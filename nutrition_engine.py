"""
Core calculation engine for BMR, TDEE, macros, meal planning, and nutrition rules.
Meal calories come from catalog nutrition data, not from TDEE slot percentages.
Allergy filtering fails closed (never reintroduces blocked meals).
"""

import hashlib
import random
from datetime import date
from typing import Any, Dict, List, Optional, Tuple

from models import Profile, SwapRequest
from meal_data import MEAL_DATABASE

_ACTIVITY_MULTIPLIERS = {
    "low": 1.2,
    "medium": 1.45,
    "high": 1.725,
}

_ALLERGEN_ALIASES = {
    "dairy": ["dairy", "milk", "curd", "paneer", "yogurt", "yoghurt", "cheese", "ghee", "raita", "butter", "cream", "whey", "kadhi", "chaas", "buttermilk"],
    "milk": ["dairy", "milk", "curd", "paneer", "yogurt", "yoghurt", "cheese", "ghee", "raita", "butter", "cream", "whey", "kadhi", "chaas", "buttermilk"],
    "nut": ["nut", "nuts", "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "peanut", "groundnut"],
    "nuts": ["nut", "nuts", "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "peanut", "groundnut"],
    "peanut": ["peanut", "groundnut"],
    "gluten": ["gluten", "wheat", "roti", "paratha", "phulka", "toast", "sourdough", "bread", "seitan", "daliya"],
    "soy": ["soy", "soya", "tofu", "tempeh", "edamame"],
    "soya": ["soy", "soya", "tofu", "tempeh", "edamame"],
    "egg": ["egg", "eggs", "omelette", "omelet"],
    "fish": ["fish", "salmon", "rohu", "cod", "tuna", "seafood"],
    "shellfish": ["shellfish", "shrimp", "prawn", "crab", "lobster"],
    "sesame": ["sesame", "tahini"],
}

SLOTS = ("breakfast", "lunch", "dinner", "snack")


def _get_activity_multiplier(activity: str) -> float:
    a = (activity or "").strip().lower()
    if a in _ACTIVITY_MULTIPLIERS:
        return _ACTIVITY_MULTIPLIERS[a]
    for key, mult in _ACTIVITY_MULTIPLIERS.items():
        if key in a:
            return mult
    return _ACTIVITY_MULTIPLIERS["medium"]


def _ingredient_text(ing) -> str:
    if isinstance(ing, str):
        return ing.lower()
    if isinstance(ing, dict):
        parts = [str(ing.get("name", "")), str(ing.get("item", "")), str(ing.get("amount", ""))]
        return " ".join(parts).lower()
    return str(ing).lower()


def _expand_allergy_keywords(allergies: List[str]) -> List[str]:
    keywords = []
    for raw in allergies or []:
        key = str(raw).strip().lower()
        if not key:
            continue
        keywords.append(key)
        keywords.extend(_ALLERGEN_ALIASES.get(key, []))
    # preserve order, unique
    seen = set()
    out = []
    for kw in keywords:
        if kw not in seen:
            seen.add(kw)
            out.append(kw)
    return out


def _meal_matches_allergy(item: Dict, keywords: List[str]) -> bool:
    if not keywords:
        return False
    allergen_tags = [str(a).lower() for a in item.get("allergens", [])]
    ingredient_texts = " ".join(_ingredient_text(ing) for ing in item.get("ingredients", []))
    name_text = item.get("name", "").lower()
    combined = f"{ingredient_texts} {name_text} {' '.join(allergen_tags)}"
    for kw in keywords:
        if kw in allergen_tags or kw in combined:
            return True
    return False


def _filter_allergies(pool: List[Dict], allergies: List[str]) -> List[Dict]:
    """Remove meals that match any allergy. Empty list if none are safe (fail closed)."""
    if not pool:
        return []
    keywords = _expand_allergy_keywords(allergies)
    if not keywords:
        return list(pool)
    return [item for item in pool if not _meal_matches_allergy(item, keywords)]


def _apply_preferences(pool: List[Dict], profile: Profile) -> Tuple[List[Dict], List[str]]:
    """Apply cuisine, budget, and medical preferences. Relax preferences if they empty the slot."""
    warnings: List[str] = []
    filtered = list(pool)

    cuisine = (profile.cuisine or "any").lower()
    if cuisine in ("indian", "global", "north_indian", "south_indian", "east_indian", "west_indian"):
        preferred = [
            m for m in filtered
            if (m.get("cuisine") or "indian") == cuisine or (m.get("cuisine") == "indian" and "indian" in cuisine)
        ]
        if preferred:
            filtered = preferred
        elif cuisine != "any":
            warnings.append(f"No specific {cuisine.replace('_', ' ').title()} recipes left in this slot; using other suitable recipes.")

    budget = (profile.budget or "medium").lower()
    if budget == "low":
        preferred = [m for m in filtered if m.get("budget", "low") != "high"]
        if preferred:
            filtered = preferred
        else:
            warnings.append("Low-budget filter left no meals; including higher-cost recipes.")

    conditions = [c.lower() for c in (profile.conditions or [])]
    if "diabetes" in conditions:
        preferred = [m for m in filtered if m.get("diabetes_friendly", True)]
        if preferred:
            filtered = preferred
        else:
            warnings.append("No diabetes-tagged meals remained; showing other allergy-safe options.")
    if "pcos" in conditions:
        preferred = [m for m in filtered if m.get("pcos_friendly", True)]
        if preferred:
            filtered = preferred
        else:
            warnings.append("No PCOS-tagged meals remained; showing other allergy-safe options.")
    if "hypertension" in conditions:
        preferred = [m for m in filtered if m.get("hypertension_friendly", True)]
        if preferred:
            filtered = preferred
        else:
            warnings.append("No hypertension-tagged meals remained; showing other allergy-safe options.")
    if "thyroid" in conditions:
        preferred = [m for m in filtered if m.get("thyroid_friendly", True)]
        if preferred:
            filtered = preferred
        else:
            warnings.append("No thyroid-tagged meals remained; showing other allergy-safe options.")
    if "fatty_liver" in conditions:
        preferred = [m for m in filtered if m.get("fatty_liver_friendly", True)]
        if preferred:
            filtered = preferred
        else:
            warnings.append("No fatty-liver-tagged meals remained; showing other allergy-safe options.")

    return filtered, warnings


def _pick_meal(pool: List[Dict], day_offset: int, profile_name: str) -> Dict:
    if not pool:
        return {}
    digest = hashlib.md5(f"{profile_name}:{day_offset}".encode("utf-8")).hexdigest()
    seed = int(digest[:8], 16)
    rng = random.Random(seed)
    shuffled = pool[:]
    rng.shuffle(shuffled)
    return shuffled[day_offset % len(shuffled)]


def calculate_macros(calories: int, goal: str, conditions: Optional[List[str]] = None) -> Dict[str, int]:
    """Calculate target macro split in grams from a calorie budget."""
    goal_str = (goal or "").lower()
    cond = [c.lower() for c in (conditions or [])]
    if "diabetes" in cond or "pcos" in cond:
        p_pct, c_pct, f_pct = 0.35, 0.35, 0.30
    elif "loss" in goal_str:
        p_pct, c_pct, f_pct = 0.35, 0.35, 0.30
    elif "gain" in goal_str or "muscle" in goal_str:
        p_pct, c_pct, f_pct = 0.30, 0.50, 0.20
    else:
        p_pct, c_pct, f_pct = 0.25, 0.50, 0.25

    protein_g = int((calories * p_pct) / 4)
    carbs_g = int((calories * c_pct) / 4)
    fats_g = int((calories * f_pct) / 9)

    return {
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fats_g": fats_g,
    }


def calorie_floor(profile: Profile) -> int:
    """Safer minimum intake than a blanket 1200 kcal for every adult."""
    if profile.age < 18:
        return 1600 if profile.sex == "male" else 1400
    return 1500 if profile.sex == "male" else 1200


def compute_tdee_and_target(profile: Profile):
    """Compute BMR, TDEE (Mifflin-St Jeor) and target calories with deficit/surplus."""
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age
    if profile.sex.lower() == "male":
        bmr += 5
    else:
        bmr -= 161

    tdee = bmr * _get_activity_multiplier(profile.activity)

    goal = profile.goal.lower()
    if "loss" in goal:
        target_cal = int(tdee - 500)
    elif "gain" in goal or "muscle" in goal:
        target_cal = int(tdee + 400)
    else:
        target_cal = int(tdee)

    target_cal = max(calorie_floor(profile), target_cal)
    return int(bmr), int(tdee), target_cal


def calculate_bmi(weight_kg: float, height_cm: float, standard: str = "indian") -> Dict[str, Any]:
    """Calculate BMI and category using ICMR-NIN Asian-Indian or WHO standards."""
    if height_cm <= 0 or weight_kg <= 0:
        return {
            "bmi": 0.0,
            "category": "Unknown",
            "standard": standard,
            "healthy_range": "18.5 - 22.9",
        }
    height_m = height_cm / 100.0
    bmi = round(weight_kg / (height_m * height_m), 1)

    std = (standard or "indian").lower()
    if std in ("indian", "asian", "icmr", "south_asian"):
        # ICMR-NIN & WHO South Asian Consensus Cutoffs (Asian Indian phenotype)
        if bmi < 18.5:
            category = "Underweight"
        elif bmi <= 22.9:
            category = "Normal / Healthy"
        elif bmi <= 24.9:
            category = "Overweight (Increased Risk)"
        else:
            category = "Obese (High Risk)"
        healthy_range = "18.5 - 22.9"
        standard_label = "ICMR-NIN Asian Indian"
    else:
        # Standard WHO Cutoffs
        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25.0:
            category = "Normal"
        elif bmi < 30.0:
            category = "Overweight"
        else:
            category = "Obese"
        healthy_range = "18.5 - 24.9"
        standard_label = "WHO Global"

    return {
        "bmi": bmi,
        "category": category,
        "standard": standard_label,
        "healthy_range": healthy_range,
    }


def get_diet_pool_key(diet: str) -> str:
    d = (diet or "").lower()
    if "jain" in d:
        return "jain_veg"
    if "vrat" in d or "fasting" in d:
        return "vrat_fasting"
    if "vegan" in d:
        return "vegan"
    if "non" in d or "chicken" in d or "fish" in d or "meat" in d:
        return "non_veg"
    if "egg" in d:
        return "egg_veg"
    return "indian_veg"


def _nutrition_of(item: Dict) -> Dict[str, int]:
    n = item.get("nutrition") or {}
    return {
        "calories": int(n.get("calories") or 0),
        "protein_g": int(n.get("protein_g") or 0),
        "carbs_g": int(n.get("carbs_g") or 0),
        "fats_g": int(n.get("fats_g") or 0),
    }


def _blocked_meal(slot: str, allergies: List[str]) -> Dict[str, Any]:
    label = slot.title()
    listed = ", ".join(allergies) if allergies else "your listed allergies"
    return {
        "name": f"{label}: No allergy-safe option",
        "ingredients": [],
        "approx_calories": 0,
        "macros": {"protein_g": 0, "carbs_g": 0, "fats_g": 0},
        "reason": f"Every {slot} recipe in this diet contains {listed}. We did not substitute an unsafe meal.",
        "prep_time": "—",
        "cook_time": "—",
        "difficulty": "—",
        "instructions": [
            "Remove one allergy keyword, or switch diet (for example vegan if avoiding dairy).",
            "Then generate the plan again.",
        ],
        "swaps": {},
        "unavailable": True,
        "allergy_blocked": True,
    }


def _build_meal(item: Dict) -> Dict[str, Any]:
    nutrition = _nutrition_of(item)
    return {
        "name": item.get("name", "Meal"),
        "ingredients": item.get("ingredients", []),
        "approx_calories": nutrition["calories"],
        "reason": item.get("reason", ""),
        "prep_time": item.get("prep_time", "10 mins"),
        "cook_time": item.get("cook_time", "12 mins"),
        "difficulty": item.get("difficulty", "Easy"),
        "instructions": item.get("instructions", []),
        "macros": {
            "protein_g": nutrition["protein_g"],
            "carbs_g": nutrition["carbs_g"],
            "fats_g": nutrition["fats_g"],
        },
        "nutrition": nutrition,
        "allergens": item.get("allergens", []),
        "budget": item.get("budget", "low"),
        "cuisine": item.get("cuisine", "indian"),
        "swaps": item.get("swaps", {}),
        "unavailable": False,
    }


def _sum_macros(meals: List[Dict]) -> Dict[str, int]:
    return {
        "protein_g": sum(int((m.get("macros") or {}).get("protein_g") or 0) for m in meals),
        "carbs_g": sum(int((m.get("macros") or {}).get("carbs_g") or 0) for m in meals),
        "fats_g": sum(int((m.get("macros") or {}).get("fats_g") or 0) for m in meals),
    }


def _safe_pool(profile: Profile, slot: str) -> Tuple[List[Dict], List[str]]:
    pool_key = get_diet_pool_key(profile.diet)
    pool = MEAL_DATABASE.get(pool_key, MEAL_DATABASE["indian_veg"]).get(slot, [])
    allergy_safe = _filter_allergies(pool, profile.allergies)
    return _apply_preferences(allergy_safe, profile)


def generate_single_day_plan(profile: Profile, day_name: str = "Today", day_offset: int = 0) -> Dict[str, Any]:
    bmr, tdee, target_cal = compute_tdee_and_target(profile)
    target_macros = calculate_macros(target_cal, profile.goal, profile.conditions)

    meals = []
    warnings: List[str] = []
    for i, slot in enumerate(SLOTS):
        pool, slot_warnings = _safe_pool(profile, slot)
        warnings.extend(slot_warnings)
        if not pool:
            meals.append(_blocked_meal(slot, profile.allergies))
            continue
        picked = _pick_meal(pool, day_offset + i, profile.name)
        meals.append(_build_meal(picked))

    actual_macros = _sum_macros(meals)
    actual_calories = sum(int(m.get("approx_calories") or 0) for m in meals)
    blocked = sum(1 for m in meals if m.get("unavailable"))
    bmi_info = calculate_bmi(profile.weight_kg, profile.height_cm, standard="indian")

    return {
        "day": day_name,
        "user_id": profile.name,
        "date": str(date.today()),
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target_cal,
        "actual_calories": actual_calories,
        "target_macros": target_macros,
        "total_macros": actual_macros,
        "bmi": bmi_info["bmi"],
        "bmi_category": bmi_info["category"],
        "bmi_standard": bmi_info["standard"],
        "healthy_weight_range_bmi": bmi_info["healthy_range"],
        "meals": meals,
        "warnings": warnings,
        "allergy_blocked_slots": blocked,
        "calorie_floor": calorie_floor(profile),
    }


def _categorize_ingredients(ingredients: List[str]) -> Dict[str, List[str]]:
    categorized = {
        "Vegetables & Greens": [],
        "Proteins & Dairy": [],
        "Grains & Staples": [],
        "Pantry & Seasonings": [],
    }
    seen = set()
    for item in ingredients:
        text = str(item)
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        if any(w in key for w in ("paneer", "curd", "egg", "tofu", "chicken", "salmon", "yogurt", "milk", "soya", "fish", "tuna", "keema", "mutton", "sattu", "chaas", "buttermilk", "chhena", "besan")):
            categorized["Proteins & Dairy"].append(text)
        elif any(w in key for w in ("rice", "quinoa", "roti", "paratha", "oats", "sourdough", "chilla", "dal", "rajma", "lentil", "sprout", "khichdi", "idli", "dosa", "millet", "poha", "ragi", "jowar", "bajra", "dalia", "kuttu", "singhara", "sabudana", "makhana", "thepla", "bhakri")):
            categorized["Grains & Staples"].append(text)
        elif any(w in key for w in ("spinach", "cucumber", "tomato", "onion", "broccoli", "carrot", "beans", "mushroom", "pepper", "salad", "palak", "kale", "apple", "guava", "berries", "methi", "bhindi", "lauki", "tinda", "amla", "gourd", "baingan")):
            categorized["Vegetables & Greens"].append(text)
        else:
            categorized["Pantry & Seasonings"].append(text)
    return categorized


def generate_weekly_plan(profile: Profile) -> Dict[str, Any]:
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_days = {}
    all_ingredients: List[str] = []
    warnings: List[str] = []

    for idx, day in enumerate(days_of_week):
        day_plan = generate_single_day_plan(profile, day_name=day, day_offset=idx)
        weekly_days[day] = day_plan
        warnings.extend(day_plan.get("warnings") or [])
        for meal in day_plan.get("meals") or []:
            if meal.get("unavailable"):
                continue
            all_ingredients.extend(meal.get("ingredients") or [])

    bmr, tdee, target_cal = compute_tdee_and_target(profile)
    bmi_info = calculate_bmi(profile.weight_kg, profile.height_cm, standard="indian")
    unique_warnings = list(dict.fromkeys(warnings))

    return {
        "user_id": profile.name,
        "date": str(date.today()),
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target_cal,
        "target_macros": calculate_macros(target_cal, profile.goal, profile.conditions),
        "total_macros": weekly_days["Monday"]["total_macros"],
        "bmi": bmi_info["bmi"],
        "bmi_category": bmi_info["category"],
        "bmi_standard": bmi_info["standard"],
        "healthy_weight_range_bmi": bmi_info["healthy_range"],
        "is_weekly": True,
        "days": weekly_days,
        "active_day": "Monday",
        "categorized_grocery_list": _categorize_ingredients(all_ingredients),
        "warnings": unique_warnings,
    }


def generate_meal_swap(req: SwapRequest) -> Dict[str, Any]:
    idx = req.meal_index
    slot = SLOTS[idx] if 0 <= idx < len(SLOTS) else "lunch"
    name_lower = req.meal_name.lower()
    if "breakfast" in name_lower:
        slot = "breakfast"
    elif "dinner" in name_lower:
        slot = "dinner"
    elif "snack" in name_lower:
        slot = "snack"
    elif "lunch" in name_lower:
        slot = "lunch"

    pool, warnings = _safe_pool(req.profile, slot)
    pool = [m for m in pool if (m.get("name") or "") != req.meal_name]
    if not pool:
        blocked = _blocked_meal(slot, req.profile.allergies)
        blocked["error"] = "No allergy-safe swap in this slot"
        blocked["warnings"] = warnings
        return blocked

    chosen = random.choice(pool)
    meal = _build_meal(chosen)
    meal["warnings"] = warnings
    return meal
