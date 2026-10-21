# backend.py
"""
Smart Nutrition Assistant API - Main Application Server
"""

import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
try:
    import slowapi  # pyrefly: ignore [missing-import]
    import slowapi.util  # pyrefly: ignore [missing-import]
    import slowapi.errors  # pyrefly: ignore [missing-import]
    limiter = slowapi.Limiter(key_func=slowapi.util.get_remote_address, default_limits=["200/minute"])
    RateLimitExceeded = slowapi.errors.RateLimitExceeded
    _rate_limit_exceeded_handler = slowapi._rate_limit_exceeded_handler
    HAS_SLOWAPI = True
except Exception:
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
    generate_single_day_plan,
    generate_weekly_plan,
    generate_meal_swap
)
from ai_service import generate_ai_plan
from plan_store import save_plan, list_plans, get_plan, init_db

app = FastAPI(
    title="Smart Nutrition Assistant API",
    description="Personalized Meal Planner, Macro Calculator, and Nutrition Engine",
    version="2.2.0"
)
if HAS_SLOWAPI and _rate_limit_exceeded_handler is not None:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in _raw_origins.split(",")] if _raw_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup():
    init_db()


@app.get("/")
def root():
    return {
        "message": "Smart Nutrition Assistant backend is running",
        "version": "2.2.0",
        "features": ["1-Day Plan", "7-Day Weekly Plan", "Meal Swaps", "Recipe Instructions", "Hydration Targets", "Saved Plans", "Allergy Fail-Closed"]
    }


@app.get("/health")
@limiter.limit("120/minute")
def health(request: Request):
    return {"status": "ok"}


@app.post("/generate_plan")
@limiter.limit("20/minute")
def generate_plan_endpoint(request: Request, profile: Profile):
    try:
        plan = generate_ai_plan(profile)
        if not plan:
            plan = generate_single_day_plan(profile)
        plan_id = save_plan(profile, plan, "daily")
        plan["id"] = plan_id
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")


@app.post("/generate_weekly_plan")
@limiter.limit("10/minute")
def generate_weekly_plan_endpoint(request: Request, profile: Profile):
    try:
        weekly_plan = generate_weekly_plan(profile)
        plan_id = save_plan(profile, weekly_plan, "weekly")
        weekly_plan["id"] = plan_id
        return weekly_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate weekly plan: {str(e)}")


@app.post("/swap_meal")
@limiter.limit("30/minute")
def swap_meal_endpoint(request: Request, req: SwapRequest):
    try:
        return generate_meal_swap(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to swap meal: {str(e)}")


@app.get("/plans")
@limiter.limit("60/minute")
def list_saved_plans(request: Request, name: str, limit: int = 10):
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="name query parameter is required")
    return {"plans": list_plans(name, limit)}


@app.get("/plans/{plan_id}")
@limiter.limit("60/minute")
def read_saved_plan(request: Request, plan_id: int):
    plan = get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
