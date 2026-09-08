# backend.py
"""
Smart Nutrition Assistant API - Main Application Server
"""

import json
import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler  # pyrefly: ignore [missing-import]
    from slowapi.util import get_remote_address  # pyrefly: ignore [missing-import]
    from slowapi.errors import RateLimitExceeded  # pyrefly: ignore [missing-import]
    limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
    HAS_SLOWAPI = True
except (ImportError, ModuleNotFoundError):
    HAS_SLOWAPI = False
    class _NoOpLimiter:
        def limit(self, *args, **kwargs):
            def decorator(func):
                return func
            return decorator
    limiter = _NoOpLimiter()
    RateLimitExceeded = Exception
    _rate_limit_exceeded_handler = None

from models import Profile, SwapRequest
from nutrition_engine import (
    calculate_macros,
    generate_single_day_plan,
    generate_weekly_plan,
    generate_meal_swap
)
from ai_service import generate_ai_plan

app = FastAPI(
    title="Smart Nutrition Assistant API",
    description="Personalized Meal Planner, Macro Calculator, and Nutrition Engine",
    version="2.1.0"
)
if HAS_SLOWAPI and _rate_limit_exceeded_handler is not None:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — read from environment; default to all origins (dev mode)
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Health check & API info."""
    return {
        "message": "Smart Nutrition Assistant backend is running",
        "version": "2.1.0",
        "features": ["1-Day Plan", "7-Day Weekly Plan", "Meal Swaps", "Recipe Instructions", "Hydration Targets", "AI-Powered Plans"]
    }

@app.get("/health")
@limiter.limit("120/minute")
def health(request: Request):
    """Lightweight health check endpoint."""
    return {"status": "ok"}

@app.post("/generate_plan")
@limiter.limit("20/minute")
def generate_plan_endpoint(request: Request, profile: Profile):
    """Generate 1-day personalized nutrition plan.

    Rate limited to 20 requests/minute per IP.
    Attempts IBM Watsonx AI first; falls back to the built-in
    rule-based nutrition engine if AI is unavailable or fails.
    """
    try:
        # 1. Try AI-powered plan
        plan = generate_ai_plan(profile)

        # 2. Fall back to deterministic nutrition engine
        if not plan:
            plan = generate_single_day_plan(profile)

        # Save to local profile JSON cache
        filename = f"mealplan_{profile.name.lower().replace(' ', '_')}.json"
        try:
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(plan, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save {filename}: {e}")

        return plan

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")

@app.post("/generate_weekly_plan")
@limiter.limit("10/minute")
def generate_weekly_plan_endpoint(request: Request, profile: Profile):
    """Generate 7-day personalized weekly nutrition plan. Rate limited to 10/minute."""
    try:
        weekly_plan = generate_weekly_plan(profile)

        # Save weekly plan JSON cache
        filename = f"weekly_mealplan_{profile.name.lower().replace(' ', '_')}.json"
        try:
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(weekly_plan, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save {filename}: {e}")

        return weekly_plan

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate weekly plan: {str(e)}")

@app.post("/swap_meal")
@limiter.limit("30/minute")
def swap_meal_endpoint(request: Request, req: SwapRequest):
    """Swap an individual meal. Rate limited to 30/minute."""
    try:
        return generate_meal_swap(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to swap meal: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)