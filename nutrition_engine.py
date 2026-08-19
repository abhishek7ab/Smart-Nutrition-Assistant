# nutrition_engine.py
"""
Core calculation engine for BMR, TDEE, Macros, Meal Planning, and Nutrition Rules.
"""

import random
from datetime import date
from typing import Dict, Any
from models import Profile, SwapRequest
from meal_data import MEAL_DATABASE, ALTERNATIVES

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
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age
    if profile.sex.lower() == "male":
        bmr += 5
    else:
        bmr -= 161

    act = profile.activity.lower()
    if "low" in act:
        tdee = bmr * 1.2
    elif "high" in act:
        tdee = bmr * 1.725
    else:
        tdee = bmr * 1.45

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

    # Pick recipes with offset for variety across days
    b_item = pool["breakfast"][day_offset % len(pool["breakfast"])]
    l_item = pool["lunch"][day_offset % len(pool["lunch"])]
    d_item = pool["dinner"][day_offset % len(pool["dinner"])]
    s_item = pool["snack"][day_offset % len(pool["snack"])]

    meals = [
        {
            "name": b_item["name"],
            "ingredients": b_item["ingredients"],
            "approx_calories": b_cal,
            "reason": b_item["reason"],
            "prep_time": b_item.get("prep_time", "10 mins"),
            "cook_time": b_item.get("cook_time", "12 mins"),
            "difficulty": b_item.get("difficulty", "Easy"),
            "instructions": b_item.get("instructions", ["Prepare fresh ingredients", "Cook on low flame", "Serve warm"]),
            "macros": calculate_macros(b_cal, profile.goal),
            "swaps": b_item.get("swaps", {})
        },
        {
            "name": l_item["name"],
            "ingredients": l_item["ingredients"],
            "approx_calories": l_cal,
            "reason": l_item["reason"],
            "prep_time": l_item.get("prep_time", "15 mins"),
            "cook_time": l_item.get("cook_time", "20 mins"),
            "difficulty": l_item.get("difficulty", "Medium"),
            "instructions": l_item.get("instructions", ["Assemble ingredients", "Cook according to directions", "Garnish and enjoy"]),
            "macros": calculate_macros(l_cal, profile.goal),
            "swaps": l_item.get("swaps", {})
        },
        {
            "name": d_item["name"],
            "ingredients": d_item["ingredients"],
            "approx_calories": d_cal,
            "reason": d_item["reason"],
            "prep_time": d_item.get("prep_time", "12 mins"),
            "cook_time": d_item.get("cook_time", "15 mins"),
            "difficulty": d_item.get("difficulty", "Easy"),
            "instructions": d_item.get("instructions", ["Prepare proteins & vegetables", "Simmer or roast", "Serve fresh"]),
            "macros": calculate_macros(d_cal, profile.goal),
            "swaps": d_item.get("swaps", {})
        },
        {
            "name": s_item["name"],
            "ingredients": s_item["ingredients"],
            "approx_calories": s_cal,
            "reason": s_item["reason"],
            "prep_time": s_item.get("prep_time", "3 mins"),
            "cook_time": s_item.get("cook_time", "0 mins"),
            "difficulty": s_item.get("difficulty", "Easy"),
            "instructions": s_item.get("instructions", ["Mix and enjoy this refreshing energy boost"]),
            "macros": calculate_macros(s_cal, profile.goal),
            "swaps": s_item.get("swaps", {})
        }
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
    pool = MEAL_DATABASE.get(pool_key, MEAL_DATABASE["indian_veg"]).get(meal_type_key, [])

    if not pool:
        options = ALTERNATIVES.get(meal_type_key, ALTERNATIVES["lunch"])
        chosen = random.choice(options)
    else:
        chosen = random.choice(pool)

    cal_multiplier = 0.25 if meal_type_key == "breakfast" else (0.35 if meal_type_key == "lunch" else (0.30 if meal_type_key == "dinner" else 0.10))

    _, _, target_cal = compute_tdee_and_target(req.profile)
    approx_cal = int(target_cal * cal_multiplier)

    return {
        "name": chosen["name"],
        "ingredients": chosen["ingredients"],
        "approx_calories": approx_cal,
        "reason": chosen["reason"],
        "prep_time": chosen.get("prep_time", "10 mins"),
        "cook_time": chosen.get("cook_time", "15 mins"),
        "difficulty": chosen.get("difficulty", "Easy"),
        "instructions": chosen.get("instructions", ["Cook ingredients gently with healthy oils", "Serve hot"]),
        "macros": calculate_macros(approx_cal, req.profile.goal),
        "swaps": chosen.get("swaps", {})
    }

def get_rule_based_chat_reply(message: str, profile: Profile) -> str:
    """Expert clinical nutrition fallback answers for chatbot."""
    msg_lower = message.lower()
    name = profile.name or "Friend"
    goal = profile.goal or "fitness"

    if "pre" in msg_lower and "workout" in msg_lower:
        return (
            f"💪 **Pre-Workout Fuel for {name} ({goal.replace('_', ' ').title()}):**\n"
            f"• **Timing:** Eat 45–60 minutes before training.\n"
            f"• **Best Picks:** A banana with 1 tbsp peanut butter, oatmeal with blueberries, or 2 boiled egg whites with toast.\n"
            f"• **Goal:** Fast-digesting complex carbs + moderate protein to maximize glycogen and avoid cramps!"
        )
    elif "post" in msg_lower and "workout" in msg_lower:
        return (
            f"⚡ **Post-Workout Recovery Formula:**\n"
            f"• **Anabolic Window:** Aim for 20–30g of high-quality protein within 45 minutes of finishing.\n"
            f"• **Great options:** Greek yogurt with honey & chia seeds, Whey/Plant protein shake, or Paneer/Chicken tikka with rice.\n"
            f"• **Hydration:** Rehydrate with at least 500ml water and electrolytes to speed up muscle repair."
        )
    elif "water" in msg_lower or "hydrat" in msg_lower:
        recommended = round(profile.weight_kg * 0.035, 1)
        return (
            f"💧 **Hydration Guidelines for your {profile.weight_kg}kg body weight:**\n"
            f"• Your personalized baseline goal is **{recommended} Liters per day**.\n"
            f"• Add 500ml for every 45 minutes of moderate-to-heavy exercise.\n"
            f"• *Pro Tip:* Keep a 1L water bottle at your desk and sip regularly before feeling thirsty!"
        )
    elif "creatine" in msg_lower or "supplement" in msg_lower:
        return (
            f"💊 **Supplement Advice for {goal.replace('_', ' ').title()}:**\n"
            f"• **Creatine Monohydrate:** 3–5g daily consistently (no loading phase needed) increases strength and muscle hydration.\n"
            f"• **Vitamin D3 + K2:** Essential for testosterone, immunity, and bone density (especially for indoor desk workers).\n"
            f"• **Omega-3:** 1000mg EPA/DHA helps reduce post-workout muscle soreness."
        )
    elif "snack" in msg_lower or "craving" in msg_lower:
        return (
            f"🥗 **Smart Low-Calorie / High-Protein Snacks:**\n"
            f"• Roasted Fox Nuts (Makhana) with black pepper.\n"
            f"• Sprouted Moong chaat with pomegranate and lemon.\n"
            f"• 1 boiled egg or 30g roasted chana.\n"
            f"• Greek yogurt or Cottage cheese (Paneer) with a handful of berries."
        )
    elif "plateau" in msg_lower or "not losing" in msg_lower or "stuck" in msg_lower:
        return (
            f"📉 **Overcoming Weight Loss Plateaus:**\n"
            f"• **Track hidden calories:** Cooking oils, salad dressings, and sugary beverages often add 300+ hidden calories.\n"
            f"• **Step count (NEAT):** Aim for 8,000–10,000 daily steps.\n"
            f"• **Sleep & Cortisol:** Ensure 7–8 hours of quality sleep; elevated cortisol causes water retention."
        )
    else:
        return (
            f"🌱 **Nutritionist Tip for {name}:**\n"
            f"• Focus on hitting your daily **{profile.goal.replace('_', ' ')}** target consistently.\n"
            f"• Prioritize 1.6–2.0g protein per kg of body weight for lean muscle retention.\n"
            f"• Eat 80% whole, minimally processed foods with colorful vegetables for gut microbiome diversity."
        )
