# nutrition_engine.py
"""
Core calculation engine for BMR, TDEE, Macros, Meal Planning, and Nutrition Rules.
"""

import random
from datetime import date
from typing import Dict, Any, List
from models import Profile, SwapRequest
from meal_data import MEAL_DATABASE, ALTERNATIVES

# ---------------------------------------------------------------------------
# Activity multiplier map — explicit keys instead of substring matching
# ---------------------------------------------------------------------------
_ACTIVITY_MULTIPLIERS = {
    "low": 1.2,
    "medium": 1.45,
    "high": 1.725,
}

def _get_activity_multiplier(activity: str) -> float:
    """Return TDEE activity multiplier. Defaults to moderate (1.45) if unrecognised."""
    # Try exact match first, then substring fallback
    a = activity.strip().lower()
    if a in _ACTIVITY_MULTIPLIERS:
        return _ACTIVITY_MULTIPLIERS[a]
    for key, mult in _ACTIVITY_MULTIPLIERS.items():
        if key in a:
            return mult
    return _ACTIVITY_MULTIPLIERS["medium"]


def _ingredient_text(ing) -> str:
    """Normalise an ingredient (str or dict) to a plain lowercase string."""
    if isinstance(ing, str):
        return ing.lower()
    if isinstance(ing, dict):
        parts = [str(ing.get("name", "")), str(ing.get("item", "")), str(ing.get("amount", ""))]
        return " ".join(parts).lower()
    return str(ing).lower()


def _filter_allergies(pool: List[Dict], allergies: List[str]) -> List[Dict]:
    """Remove meal items whose ingredients match any allergy keyword."""
    if not allergies:
        return pool
    allergy_keywords = [a.strip().lower() for a in allergies if a.strip()]
    if not allergy_keywords:
        return pool

    filtered = []
    for item in pool:
        ingredient_texts = " ".join(_ingredient_text(ing) for ing in item.get("ingredients", []))
        name_text = item.get("name", "").lower()
        combined = ingredient_texts + " " + name_text
        if not any(kw in combined for kw in allergy_keywords):
            filtered.append(item)
    # Safety: if all meals are filtered out, return original pool to avoid empty crash
    return filtered if filtered else pool


def _pick_meal(pool: List[Dict], day_offset: int, profile_name: str) -> Dict:
    """
    Pick a meal from pool with reproducible per-user, per-day variety.
    Uses a seed derived from (profile name + day_offset) so the same user
    always gets the same rotation, but different users see different orders.
    """
    if not pool:
        return {}
    seed = hash(profile_name + str(day_offset)) % (2 ** 32)
    rng = random.Random(seed)
    shuffled = pool[:]
    rng.shuffle(shuffled)
    return shuffled[day_offset % len(shuffled)]


def calculate_macros(calories: int, goal: str) -> Dict[str, int]:
    """Calculate macro split in grams based on calories and fitness goal."""
    goal_str = (goal or "").lower()
    if "loss" in goal_str:
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
        "fats_g": fats_g
    }

def compute_tdee_and_target(profile: Profile):
    """Compute BMR, TDEE (Mifflin-St Jeor) and target calories with deficit/surplus."""
    # Mifflin-St Jeor BMR formula
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

    target_cal = max(1200, target_cal)
    return int(bmr), int(tdee), target_cal

def get_diet_pool_key(diet: str) -> str:
    """Map user diet choice to meal database category."""
    d = (diet or "").lower()
    if "vegan" in d:
        return "vegan"
    if "non" in d or "egg" in d or "chicken" in d or "fish" in d or "meat" in d:
        return "non_veg"
    return "indian_veg"

def generate_single_day_plan(profile: Profile, day_name: str = "Today", day_offset: int = 0) -> Dict[str, Any]:
    """Generate a balanced single-day nutrition plan with recipes & macros."""
    bmr, tdee, target_cal = compute_tdee_and_target(profile)
    macros = calculate_macros(target_cal, profile.goal)

    pool_key = get_diet_pool_key(profile.diet)
    pool = MEAL_DATABASE.get(pool_key, MEAL_DATABASE["indian_veg"])

    b_cal = int(target_cal * 0.25)
    l_cal = int(target_cal * 0.35)
    d_cal = int(target_cal * 0.30)
    s_cal = int(target_cal * 0.10)

    # Filter allergy meals then pick with seeded randomness for variety
    b_pool = _filter_allergies(pool.get("breakfast", []), profile.allergies)
    l_pool = _filter_allergies(pool.get("lunch", []), profile.allergies)
    d_pool = _filter_allergies(pool.get("dinner", []), profile.allergies)
    s_pool = _filter_allergies(pool.get("snack", []), profile.allergies)

    b_item = _pick_meal(b_pool, day_offset, profile.name)
    l_item = _pick_meal(l_pool, day_offset + 1, profile.name)
    d_item = _pick_meal(d_pool, day_offset + 2, profile.name)
    s_item = _pick_meal(s_pool, day_offset + 3, profile.name)

    def _build_meal(item: Dict, cal: int, defaults: Dict) -> Dict:
        return {
            "name": item.get("name", defaults.get("name", "Meal")),
            "ingredients": item.get("ingredients", []),
            "approx_calories": cal,
            "reason": item.get("reason", ""),
            "prep_time": item.get("prep_time", defaults.get("prep_time", "10 mins")),
            "cook_time": item.get("cook_time", defaults.get("cook_time", "12 mins")),
            "difficulty": item.get("difficulty", "Easy"),
            "instructions": item.get("instructions", defaults.get("instructions", ["Prepare fresh ingredients", "Cook on low flame", "Serve warm"])),
            "macros": calculate_macros(cal, profile.goal),
            "swaps": item.get("swaps", {}),
        }

    meals = [
        _build_meal(b_item, b_cal, {"name": "Breakfast", "prep_time": "10 mins", "cook_time": "12 mins", "instructions": ["Prepare fresh ingredients", "Cook on low flame", "Serve warm"]}),
        _build_meal(l_item, l_cal, {"name": "Lunch", "prep_time": "15 mins", "cook_time": "20 mins", "instructions": ["Assemble ingredients", "Cook according to directions", "Garnish and enjoy"]}),
        _build_meal(d_item, d_cal, {"name": "Dinner", "prep_time": "12 mins", "cook_time": "15 mins", "instructions": ["Prepare proteins & vegetables", "Simmer or roast", "Serve fresh"]}),
        _build_meal(s_item, s_cal, {"name": "Snack", "prep_time": "3 mins", "cook_time": "0 mins", "instructions": ["Mix and enjoy this refreshing energy boost"]}),
    ]

    return {
        "day": day_name,
        "user_id": profile.name,
        "date": str(date.today()),
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target_cal,
        "total_macros": macros,
        "meals": meals
    }

def generate_weekly_plan(profile: Profile) -> Dict[str, Any]:
    """Generate a full 7-day varied meal plan."""
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_days = {}

    for idx, day in enumerate(days_of_week):
        weekly_days[day] = generate_single_day_plan(profile, day_name=day, day_offset=idx)

    bmr, tdee, target_cal = compute_tdee_and_target(profile)
    total_macros = calculate_macros(target_cal, profile.goal)

    return {
        "user_id": profile.name,
        "date": str(date.today()),
        "bmr": bmr,
        "tdee": tdee,
        "target_calories": target_cal,
        "total_macros": total_macros,
        "is_weekly": True,
        "days": weekly_days,
        "active_day": "Monday"
    }

def generate_meal_swap(req: SwapRequest) -> Dict[str, Any]:
    """Pick an alternative meal option for a given meal category."""
    meal_type_key = "lunch"
    name_lower = req.meal_name.lower()
    if "breakfast" in name_lower:
        meal_type_key = "breakfast"
    elif "dinner" in name_lower:
        meal_type_key = "dinner"
    elif "snack" in name_lower:
        meal_type_key = "snack"

    pool_key = get_diet_pool_key(req.profile.diet)
    raw_pool = MEAL_DATABASE.get(pool_key, MEAL_DATABASE["indian_veg"]).get(meal_type_key, [])

    # Filter allergies before swapping
    pool = _filter_allergies(raw_pool, req.profile.allergies)

    if not pool:
        options = _filter_allergies(ALTERNATIVES.get(meal_type_key, ALTERNATIVES["lunch"]), req.profile.allergies)
        chosen = random.choice(options) if options else ALTERNATIVES.get(meal_type_key, ALTERNATIVES["lunch"])[0]
    else:
        chosen = random.choice(pool)

    cal_map = {"breakfast": 0.25, "lunch": 0.35, "dinner": 0.30, "snack": 0.10}
    cal_multiplier = cal_map.get(meal_type_key, 0.35)

    _, _, target_cal = compute_tdee_and_target(req.profile)
    approx_cal = int(target_cal * cal_multiplier)

    return {
        "name": chosen.get("name", "Meal"),
        "ingredients": chosen.get("ingredients", []),
        "approx_calories": approx_cal,
        "reason": chosen.get("reason", ""),
        "prep_time": chosen.get("prep_time", "10 mins"),
        "cook_time": chosen.get("cook_time", "15 mins"),
        "difficulty": chosen.get("difficulty", "Easy"),
        "instructions": chosen.get("instructions", ["Cook ingredients gently with healthy oils", "Serve hot"]),
        "macros": calculate_macros(approx_cal, req.profile.goal),
        "swaps": chosen.get("swaps", {})
    }
