# backend.py
"""
Smart Nutrition Assistant API - Main Application Server
"""

import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Profile, SwapRequest, ChatRequest
from nutrition_engine import (
    calculate_macros,
    generate_single_day_plan,
    generate_weekly_plan,
    generate_meal_swap,
    get_rule_based_chat_reply
)
from ai_service import generate_ai_plan, generate_ai_chat

app = FastAPI(
    title="Smart Nutrition Assistant API",
    description="Personalized AI Meal Planner, Macro Calculator, and Nutrition Chatbot",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Health check & API info."""
    return {
        "message": "Smart Nutrition Assistant backend v2.0 is running",
        "features": ["1-Day Plan", "7-Day Weekly Plan", "Meal Swaps", "AI Nutrition Chatbot", "Recipe Instructions"]
    }

@app.post("/generate_plan")
def generate_plan_endpoint(profile: Profile):
    """Generate 1-day personalized nutrition plan (AI with fallback)."""
    # 1. Try Watsonx AI generation
    plan = generate_ai_plan(profile)

    # 2. Fallback to smart local nutrition engine if AI is unavailable or failed
    if not plan:
        plan = generate_single_day_plan(profile)
    else:
        # Validate required fields in AI output
        if "total_macros" not in plan:
            plan["total_macros"] = calculate_macros(plan.get("target_calories", 2000), profile.goal)

        for meal in plan.get("meals", []):
            if "macros" not in meal:
                meal["macros"] = calculate_macros(meal.get("approx_calories", 500), profile.goal)
            if "instructions" not in meal:
                meal["instructions"] = ["Prepare ingredients freshly", "Cook on low flame", "Enjoy immediately"]
            if "prep_time" not in meal:
                meal["prep_time"] = "10 mins"
            if "cook_time" not in meal:
                meal["cook_time"] = "15 mins"
            if "difficulty" not in meal:
                meal["difficulty"] = "Easy"

    # Save to local profile JSON cache
    filename = f"mealplan_{profile.name.lower().replace(' ', '_')}.json"
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(plan, f, indent=2)
    except Exception as e:
        print(f"Warning: Could not save {filename}: {e}")

    return plan

@app.post("/generate_weekly_plan")
def generate_weekly_plan_endpoint(profile: Profile):
    """Generate 7-day personalized weekly nutrition plan."""
    weekly_plan = generate_weekly_plan(profile)

    # Save weekly plan JSON cache
    filename = f"weekly_mealplan_{profile.name.lower().replace(' ', '_')}.json"
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(weekly_plan, f, indent=2)
    except Exception as e:
        print(f"Warning: Could not save {filename}: {e}")

    return weekly_plan

@app.post("/swap_meal")
def swap_meal_endpoint(req: SwapRequest):
    """Swap an individual meal with an alternative aligned to diet and macros."""
    return generate_meal_swap(req)

@app.post("/chat_nutritionist")
def chat_nutritionist_endpoint(req: ChatRequest):
    """AI and expert rule-based nutrition advice chatbot."""
    # 1. Try Watsonx AI Chat
    reply = generate_ai_chat(req.message, req.profile)

    # 2. Fallback to expert knowledge rules
    if not reply:
        reply = get_rule_based_chat_reply(req.message, req.profile)

    return {"reply": reply}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)