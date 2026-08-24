from pydantic import BaseModel
from typing import List

class Profile(BaseModel):
    name: str
    age: int
    sex: str
    height_cm: float
    weight_kg: float
    goal: str
    diet: str
    activity: str
    allergies: List[str] = []

class SwapRequest(BaseModel):
    profile: Profile
    meal_index: int
    meal_name: str
