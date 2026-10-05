# backend.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import re
import os
import random
from datetime import date
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

creds = {
    "url": os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
    "apikey": os.getenv("WATSONX_API_KEY")
}
project_id = os.getenv("WATSONX_PROJECT_ID")

model = None
try:
    from ibm_watsonx_ai.foundation_models import ModelInference
    if creds.get("apikey") and project_id:
        model = ModelInference(
            model_id="ibm/granite-3-1-8b-base",
            credentials=creds,
            project_id=project_id,
            params={"temperature": 0.5, "max_new_tokens": 500}
        )
except Exception as e:
    print("Watsonx initialization failed:", e)

class Profile(BaseModel):
    name: str
    age: int
    sex: str
    height_cm: float
    weight_kg: float
    goal: str
    diet: str
    activity: str
    allergies: list[str] = []

class SwapRequest(BaseModel):
    profile: Profile
    meal_index: int
    meal_name: str

@app.get("/")
def root():
    return {"message": "Smart Nutrition Assistant backend is running"}

def calculate_macros(calories: int, goal: str):
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

ALTERNATIVES = {
    "breakfast": [
        {
            "name": "Breakfast: Avocado Toast & Poached Eggs",
            "ingredients": ["2 poached eggs", "1/2 ripe avocado", "2 slices sourdough toast", "1 tsp chia seeds"],
            "reason": "Provides healthy monounsaturated fats and high bio-available protein.",
            "swaps": {"swap1": {"original_ingredient": "Sourdough toast", "swap_option": "Gluten-free toast", "calorie_diff": 0}}
        },
        {
            "name": "Breakfast: Protein Berry Smoothie Bowl",
            "ingredients": ["1 scoop plant/whey protein", "1 cup frozen berries", "1/2 banana", "1 cup almond milk", "1 tbsp flaxseeds"],
            "reason": "Packed with antioxidants and fast-absorbing protein for active mornings.",
            "swaps": {"swap1": {"original_ingredient": "Almond milk", "swap_option": "Oat milk", "calorie_diff": 20}}
        }
    ],
    "lunch": [
        {
            "name": "Lunch: Mediterranean Quinoa & Feta Salad",
            "ingredients": ["1 cup cooked quinoa", "50g feta cheese", "1/2 cup cucumbers", "10 Kalamata olives", "1 tbsp extra virgin olive oil"],
            "reason": "Rich in heart-healthy fats, complex carbohydrates, and Mediterranean micronutrients.",
            "swaps": {"swap1": {"original_ingredient": "Feta cheese", "swap_option": "Tofu cubes", "calorie_diff": -15}}
        },
        {
            "name": "Lunch: Turkey & Avocado Whole Wheat Wrap",
            "ingredients": ["100g sliced turkey breast", "1 whole wheat wrap", "1/4 avocado", "1 cup mixed greens", "1 tsp Dijon mustard"],
            "reason": "Lean protein with high satiety score to eliminate afternoon cravings.",
            "swaps": {"swap1": {"original_ingredient": "Turkey breast", "swap_option": "Grilled tempeh", "calorie_diff": -10}}
        }
    ],
    "dinner": [
        {
            "name": "Dinner: Herb-Grilled Cod with Roasted Asparagus & Wild Rice",
            "ingredients": ["160g wild cod fillet", "1/2 cup wild rice", "1 cup asparagus", "1 tbsp lemon-herb butter"],
            "reason": "Extremely low-fat, high-protein white fish ideal for nighttime muscle repair.",
            "swaps": {"swap1": {"original_ingredient": "Wild rice", "swap_option": "Cauliflower rice", "calorie_diff": -80}}
        },
        {
            "name": "Dinner: Stuffed Bell Peppers with Black Beans & Corn",
            "ingredients": ["2 large bell peppers", "3/4 cup black beans", "1/2 cup sweet corn", "1/4 cup salsa", "30g low-fat cheese"],
            "reason": "High-fiber vegetarian dinner rich in vitamin C and plant-based protein.",
            "swaps": {"swap1": {"original_ingredient": "Low-fat cheese", "swap_option": "Nutritional yeast", "calorie_diff": -30}}
        }
    ],
    "snack": [
        {
            "name": "Snack: Cottage Cheese with Pineapple & Walnuts",
            "ingredients": ["1/2 cup low-fat cottage cheese", "1/4 cup pineapple chunks", "10g chopped walnuts"],
            "reason": "Slow-digesting casein protein paired with natural enzymes for digestion.",
            "swaps": {"swap1": {"original_ingredient": "Pineapple", "swap_option": "Blueberries", "calorie_diff": -10}}
        },
        {
            "name": "Snack: Dark Chocolate (85%) & Roasted Almonds",
            "ingredients": ["20g dark chocolate (85%+)", "15 raw almonds"],
            "reason": "Rich in flavonoids and magnesium to lower stress levels.",
            "swaps": {"swap1": {"original_ingredient": "Almonds", "swap_option": "Pumpkin seeds", "calorie_diff": 0}}
        }
    ]
}

def generate_fallback_plan(profile: Profile):
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
    macros = calculate_macros(target_cal, profile.goal)

    diet = profile.diet.lower()
    is_veg = "veg" in diet and "non" not in diet
    is_vegan = "vegan" in diet
    
    if is_vegan:
        b_name = "Breakfast: Oatmeal with Almond Milk & Chia Seeds"
        b_ingr = ["1 cup oats", "1.5 cups almond milk", "1 tbsp chia seeds", "1/2 cup blueberries", "1 tbsp maple syrup"]
        b_reason = "High in fiber and complex carbohydrates, providing clean plant-based energy."
        
        l_name = "Lunch: Tofu & Chickpea Buddha Bowl"
        l_ingr = ["150g grilled tofu", "1/2 cup chickpeas", "1 cup brown rice", "1 cup steamed spinach", "1 tbsp tahini dressing"]
        l_reason = "Rich in plant protein, iron, and slow-digesting carbs for sustained energy."
        
        d_name = "Dinner: Lentil & Vegetable Curry with Quinoa"
        d_ingr = ["1 cup yellow lentil curry", "3/4 cup cooked quinoa", "1 cup roasted cauliflower & carrots"]
        d_reason = "Supports muscle recovery with a complete amino acid profile from lentils and quinoa."
        
        s_name = "Snack: Handful of Mixed Nuts & Fresh Apple"
        s_ingr = ["30g walnuts and almonds", "1 medium apple"]
        s_reason = "Healthy fats and antioxidants for mid-day satiety."
    elif is_veg:
        b_name = "Breakfast: Greek Yogurt Parfait with Honey & Berries"
        b_ingr = ["1 cup Greek yogurt", "1/2 cup mixed berries", "1 tbsp honey", "2 tbsp granola"]
        b_reason = "High in protein and probiotics for optimal gut health and morning vitality."
        
        l_name = "Lunch: Paneer & Vegetable Whole Wheat Wrap"
        l_ingr = ["100g low-fat paneer (cottage cheese)", "1 whole wheat tortilla", "1 cup bell peppers & onions", "1 tbsp mint chutney"]
        l_reason = "Provides high quality casein protein and complex carbs."
        
        d_name = "Dinner: Quinoa & Black Bean Power Bowl"
        d_ingr = ["1 cup quinoa", "1/2 cup black beans", "1/2 avocado", "1/2 cup roasted sweet potato", "1 tbsp lime dressing"]
        d_reason = "Rich in fiber, healthy fats, and essential minerals."
        
        s_name = "Snack: Sprouted Moong Salad & Green Tea"
        s_ingr = ["1 cup sprouted moong", "1/4 cup diced cucumber & tomato", "1 tsp lemon juice"]
        s_reason = "Low calorie, nutrient-dense snack high in vitamins."
    else:
        b_name = "Breakfast: Scrambled Eggs with Avocado & Toast"
        b_ingr = ["3 large eggs", "1/2 sliced avocado", "2 slices whole wheat toast", "1 cup spinach"]
        b_reason = "High protein and healthy fats to start the day with stable blood sugar."
        
        l_name = "Lunch: Grilled Chicken Breast with Quinoa & Asparagus"
        l_ingr = ["150g grilled chicken breast", "1 cup cooked quinoa", "1 cup steamed asparagus", "1 tbsp olive oil"]
        l_reason = "Lean protein source paired with complex carbs for optimal metabolic rate."
        
        d_name = "Dinner: Pan-Seared Salmon with Sweet Potato & Broccoli"
        d_ingr = ["150g Atlantic salmon fillet", "1 medium baked sweet potato", "1.5 cups steamed broccoli"]
        d_reason = "Rich in Omega-3 fatty acids and lean protein for anti-inflammatory muscle recovery."
        
        s_name = "Snack: Boiled Egg White & Almonds"
        s_ingr = ["2 boiled egg whites", "15 raw almonds"]
        s_reason = "Quick, low-carbohydrate protein booster."

    b_cal = int(target_cal * 0.25)
    l_cal = int(target_cal * 0.35)
    d_cal = int(target_cal * 0.30)
    s_cal = int(target_cal * 0.10)

    meals = [
        {
            "name": b_name,
            "ingredients": b_ingr,
            "approx_calories": b_cal,
            "reason": b_reason,
            "macros": calculate_macros(b_cal, profile.goal),
            "swaps": {"swap1": {"original_ingredient": b_ingr[0], "swap_option": "Chia pudding", "calorie_diff": -30}}
        },
        {
            "name": l_name,
            "ingredients": l_ingr,
            "approx_calories": l_cal,
            "reason": l_reason,
            "macros": calculate_macros(l_cal, profile.goal),
            "swaps": {"swap1": {"original_ingredient": l_ingr[0], "swap_option": "Edamame / Tofu", "calorie_diff": 0}}
        },
        {
            "name": d_name,
            "ingredients": d_ingr,
            "approx_calories": d_cal,
            "reason": d_reason,
            "macros": calculate_macros(d_cal, profile.goal),
            "swaps": {"swap1": {"original_ingredient": d_ingr[0], "swap_option": "White fish or Lentil stew", "calorie_diff": -40}}
        },
        {
            "name": s_name,
            "ingredients": s_ingr,
            "approx_calories": s_cal,
            "reason": s_reason,
            "macros": calculate_macros(s_cal, profile.goal),
            "swaps": {"swap1": {"original_ingredient": s_ingr[0], "swap_option": "Mixed seeds", "calorie_diff": 10}}
        }
    ]

    return {
        "user_id": profile.name,
        "date": str(date.today()),
        "target_calories": target_cal,
        "total_macros": macros,
        "meals": meals
    }

@app.post("/generate_plan")
def generate_plan(profile: Profile):
    prompt = (
        f"You are a certified nutritionist. Given the following details:\n"
        f"Name: {profile.name}\nAge: {profile.age}\nSex: {profile.sex}\n"
        f"Height: {profile.height_cm} cm\nWeight: {profile.weight_kg} kg\n"
        f"Goal: {profile.goal}\nDiet: {profile.diet}\nActivity: {profile.activity}\n"
        f"Allergies: {', '.join(profile.allergies) if profile.allergies else 'None'}.\n\n"
        f"Respond with VALID JSON ONLY (NO extra text, no markdown, no explanation) with fields: "
        f"user_id, date, target_calories, meals (name, ingredients, approx_calories, reason, swaps)."
    )

    if model:
        try:
            response = model.generate_text(prompt)
            text = response if isinstance(response, str) else response.get("results", [{}])[0].get("generated_text", "")
            match = re.search(r"\{[\s\S]*\}", text)
            if match:
                json_text = match.group(0)
                plan = json.loads(json_text)
                if "date" not in plan:
                    plan["date"] = str(date.today())
                if "user_id" not in plan:
                    plan["user_id"] = profile.name

                if "total_macros" not in plan:
                    plan["total_macros"] = calculate_macros(plan.get("target_calories", 2000), profile.goal)

                for meal in plan.get("meals", []):
                    if "macros" not in meal:
                        meal["macros"] = calculate_macros(meal.get("approx_calories", 500), profile.goal)

                filename = f"mealplan_{profile.name.lower().replace(' ', '_')}.json"
                with open(filename, "w", encoding="utf-8") as f:
                    json.dump(plan, f, indent=2)

                return plan
        except Exception as e:
            print("Watsonx AI call failed, falling back to Smart Nutrition Engine:", str(e))

    plan = generate_fallback_plan(profile)
    filename = f"mealplan_{profile.name.lower().replace(' ', '_')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2)
    return plan

@app.post("/swap_meal")
def swap_meal(req: SwapRequest):
    meal_type_key = "lunch"
    name_lower = req.meal_name.lower()
    if "breakfast" in name_lower:
        meal_type_key = "breakfast"
    elif "dinner" in name_lower:
        meal_type_key = "dinner"
    elif "snack" in name_lower:
        meal_type_key = "snack"

    options = ALTERNATIVES.get(meal_type_key, ALTERNATIVES["lunch"])
    chosen = random.choice(options)
    
    cal_multiplier = 0.25 if meal_type_key == "breakfast" else (0.35 if meal_type_key == "lunch" else (0.30 if meal_type_key == "dinner" else 0.10))
    
    bmr = 10 * req.profile.weight_kg + 6.25 * req.profile.height_cm - 5 * req.profile.age
    target_cal = int(bmr * 1.45)
    approx_cal = int(target_cal * cal_multiplier)

    new_meal = {
        "name": chosen["name"],
        "ingredients": chosen["ingredients"],
        "approx_calories": approx_cal,
        "reason": chosen["reason"],
        "macros": calculate_macros(approx_cal, req.profile.goal),
        "swaps": chosen.get("swaps", {})
    }
    return new_meal