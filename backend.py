# backend.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import re
import os
from datetime import date
from dotenv import load_dotenv
from ibm_watsonx_ai.foundation_models import ModelInference

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

model = ModelInference(
    model_id="ibm/granite-3-8b-instruct",
    credentials=creds,
    project_id=project_id,
    params={"temperature": 0.7, "max_new_tokens": 1000}
)

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

@app.get("/")
def root():
    return {"message": "Smart Nutrition Assistant backend is running"}

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

    try:
        response = model.generate_text(prompt)
        text = response if isinstance(response, str) else response.get("results", [{}])[0].get("generated_text", "")

        print("RAW MODEL RESPONSE:", text)

        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return {"error": "No JSON detected in AI response", "raw": text}

        json_text = match.group(0)
        plan = json.loads(json_text)
        if "date" not in plan:
            plan["date"] = str(date.today())
        if "user_id" not in plan:
            plan["user_id"] = profile.name

        filename = f"mealplan_{profile.name.lower().replace(' ', '_')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(plan, f, indent=2)

        return plan

    except json.JSONDecodeError as je:
        return {"error": "Failed to parse JSON from AI response. Check the prompt format.", "raw": text, "exception": str(je)}
    except Exception as e:
        return {"error": f"Failed to generate plan: {str(e)}"}
#uvicorn backend:app --reload