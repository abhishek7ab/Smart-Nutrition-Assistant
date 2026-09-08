# ai_service.py
"""
IBM Watsonx AI Integration and LLM Response Service.
"""

import os
import re
import json
from datetime import date
from typing import Optional, Dict, Any
from dotenv import load_dotenv
from models import Profile

load_dotenv()

creds = {
    "url": os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
    "apikey": os.getenv("WATSONX_API_KEY")
}
project_id = os.getenv("WATSONX_PROJECT_ID")

import importlib

model = None
_watsonx_status = "disabled"
try:
    if not creds.get("apikey"):
        print("[WARNING] WATSONX_API_KEY not set - AI features disabled, using rule-based nutrition engine.")
    elif not project_id:
        print("[WARNING] WATSONX_PROJECT_ID not set - AI features disabled.")
    else:
        watson_module = importlib.import_module("ibm_watsonx_ai.foundation_models")
        ModelInference = getattr(watson_module, "ModelInference")
        model = ModelInference(
            model_id="ibm/granite-3-1-8b-base",
            credentials=creds,
            project_id=project_id,
            params={"temperature": 0.5, "max_new_tokens": 500}
        )
        _watsonx_status = "active"
        print("[OK] Watsonx AI model loaded successfully.")
except (ImportError, ModuleNotFoundError):
    print("[WARNING] ibm-watsonx-ai package not installed. Run: pip install ibm-watsonx-ai")
except Exception as e:
    print(f"[WARNING] Watsonx AI initialisation failed: {e}")

def generate_ai_plan(profile: Profile) -> Optional[Dict[str, Any]]:
    """Try to generate meal plan using Watsonx AI."""
    if not model:
        return None

    prompt = (
        f"You are a certified sports & clinical nutritionist. Given the following client profile:\n"
        f"Name: {profile.name}\nAge: {profile.age}\nSex: {profile.sex}\n"
        f"Height: {profile.height_cm} cm\nWeight: {profile.weight_kg} kg\n"
        f"Goal: {profile.goal}\nDiet: {profile.diet}\nActivity: {profile.activity}\n"
        f"Allergies: {', '.join(profile.allergies) if profile.allergies else 'None'}.\n\n"
        f"Generate a customized nutrition plan. Respond with STRICT VALID JSON ONLY without extra markdown or commentary."
    )

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
            return plan
    except Exception as e:
        print("Watsonx AI plan generation failed, falling back to Smart Nutrition Engine:", str(e))
    return None

def generate_ai_chat(message: str, profile: Profile) -> Optional[str]:
    """Try to get response from Watsonx AI nutritionist."""
    if not model:
        return None

    name = profile.name or "Friend"
    goal = profile.goal or "fitness"
    diet = profile.diet or "balanced"

    prompt = (
        f"You are a friendly, certified clinical & sports nutritionist named Antigravity Nutrition Coach. "
        f"Client: {name}, Goal: {goal}, Diet: {diet}, Weight: {profile.weight_kg}kg, Height: {profile.height_cm}cm. "
        f"Client's question: \"{message}\". "
        f"Provide concise, actionable, evidence-based nutrition and lifestyle advice in 2-4 short bullet points with an encouraging tone."
    )

    try:
        response = model.generate_text(prompt)
        reply = response if isinstance(response, str) else response.get("results", [{}])[0].get("generated_text", "")
        if reply and len(reply.strip()) > 10:
            return reply.strip()
    except Exception as e:
        print("Watsonx chat failed, falling back to expert knowledge engine:", str(e))
    return None
