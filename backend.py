# backend.py
"""
Smart Nutrition Assistant API - Main Application Server
"""

import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Profile, SwapRequest
from nutrition_engine import (
    calculate_macros,
    generate_single_day_plan,
    generate_weekly_plan,
    generate_meal_swap
)

app = FastAPI(
    title="Smart Nutrition Assistant API",
    description="Personalized Meal Planner, Macro Calculator, and Nutrition Engine",
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
        "message": "Smart Nutrition Assistant backend is running",
        "features": ["1-Day Plan", "7-Day Weekly Plan", "Meal Swaps", "Recipe Instructions", "Hydration Targets"]
    }

@app.post("/generate_plan")
def generate_plan_endpoint(profile: Profile):
    """Generate 1-day personalized nutrition plan."""
    plan = generate_single_day_plan(profile)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)