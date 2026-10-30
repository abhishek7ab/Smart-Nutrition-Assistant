from pydantic import BaseModel, Field, field_validator
from typing import List


_GOALS = {"weight_loss", "muscle_gain", "maintain"}
_ACTIVITY = {"low", "medium", "high"}
_BUDGETS = {"low", "medium", "high"}
_CUISINES = {
    "indian",
    "global",
    "any",
    "north_indian",
    "south_indian",
    "east_indian",
    "west_indian",
}
_CONDITIONS = {
    "diabetes",
    "pcos",
    "hypertension",
    "thyroid",
    "fatty_liver",
}


class Profile(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=10, le=120, description="Age in years (10-120)")
    sex: str = Field(..., description="Biological sex: 'male' or 'female'")
    height_cm: float = Field(..., ge=50.0, le=300.0, description="Height in centimetres (50-300)")
    weight_kg: float = Field(..., ge=20.0, le=400.0, description="Weight in kilograms (20-400)")
    goal: str = Field(..., description="Fitness goal e.g. 'weight_loss', 'muscle_gain', 'maintain'")
    diet: str = Field(..., description="Dietary preference e.g. 'indian vegetarian', 'vegan', 'non-vegetarian'")
    activity: str = Field(..., description="Activity level: 'low', 'medium', or 'high'")
    allergies: List[str] = []
    conditions: List[str] = []
    cuisine: str = "any"
    budget: str = "medium"

    @field_validator("sex")
    @classmethod
    def validate_sex(cls, v: str) -> str:
        normalised = v.strip().lower()
        if normalised not in ("male", "female"):
            raise ValueError("sex must be 'male' or 'female'")
        return normalised

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("name cannot be empty or whitespace")
        return stripped

    @field_validator("goal")
    @classmethod
    def validate_goal(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("diet")
    @classmethod
    def validate_diet(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("activity")
    @classmethod
    def validate_activity(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("cuisine")
    @classmethod
    def validate_cuisine(cls, v: str) -> str:
        normalised = (v or "any").strip().lower()
        return normalised if normalised in _CUISINES else "any"

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: str) -> str:
        normalised = (v or "medium").strip().lower()
        return normalised if normalised in _BUDGETS else "medium"

    @field_validator("conditions")
    @classmethod
    def validate_conditions(cls, v: List[str]) -> List[str]:
        cleaned = []
        for item in v or []:
            key = str(item).strip().lower()
            if key in _CONDITIONS and key not in cleaned:
                cleaned.append(key)
        return cleaned


class SwapRequest(BaseModel):
    profile: Profile
    meal_index: int = Field(..., ge=0, le=10)
    meal_name: str = Field(..., min_length=1)
