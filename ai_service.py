# ai_service.py
"""
AI Integration and LLM Response Service (Google Gemini & IBM Watsonx).
"""

import os
import re
import json
import urllib.request
import urllib.error
from datetime import date
from typing import Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv
from models import Profile

load_dotenv(Path(__file__).resolve().parent / ".env")

# --- Watsonx Configuration ---
watson_creds = {
    "url": os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
    "apikey": os.getenv("WATSONX_API_KEY"),
}
watson_project_id = os.getenv("WATSONX_PROJECT_ID")

watson_model = None
_watsonx_status = "disabled"
try:
    if watson_creds.get("apikey") and watson_project_id:
        import importlib
        watson_module = importlib.import_module("ibm_watsonx_ai.foundation_models")
        ModelInference = getattr(watson_module, "ModelInference")
        watson_model = ModelInference(
            model_id="ibm/granite-3-1-8b-base",
            credentials=watson_creds,
            project_id=watson_project_id,
            params={"temperature": 0.5, "max_new_tokens": 500},
        )
        _watsonx_status = "active"
        print("[OK] Watsonx AI model loaded successfully.")
except Exception:
    pass

# --- Gemini Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")


def _call_gemini(prompt: str, timeout_sec: int = 25) -> Optional[str]:
    """Call Google Gemini REST API."""
    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or GEMINI_API_KEY
    if not key:
        return None
    model_name = os.getenv("GEMINI_MODEL", GEMINI_MODEL)
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
    payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates") or []
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
    except Exception as e:
        print(f"[WARNING] Gemini API call failed: {e}")
    return None


def generate_ai_plan(profile: Profile) -> Optional[Dict[str, Any]]:
    """Generate meal plan using Gemini AI, falling back to Watsonx AI or rule engine."""
    # 1. Try Google Gemini with Indian Clinical Nutrition Prompt
    gemini_prompt = (
        f"You are a Senior Clinical & Sports Nutritionist specializing in Indian diets and ICMR-NIN guidelines.\n"
        f"Generate a customized, authentic Indian daily meal plan for:\n"
        f"Name: {profile.name}, Age: {profile.age}, Sex: {profile.sex}\n"
        f"Height: {profile.height_cm} cm, Weight: {profile.weight_kg} kg\n"
        f"Goal: {profile.goal}, Diet: {profile.diet}, Activity: {profile.activity}\n"
        f"Cuisine: {profile.cuisine}, Budget: {profile.budget}\n"
        f"Health Conditions: {', '.join(profile.conditions) if profile.conditions else 'None'}\n"
        f"Allergies/Exclusions: {', '.join(profile.allergies) if profile.allergies else 'None'}.\n\n"
        f"Nutritional Guidelines:\n"
        f"- Ensure balanced macronutrients and complete protein pairing (e.g. pulses + grains).\n"
        f"- Incorporate desi staples: sattu, paneer, sprouts, millets (ragi, jowar, bajra), curd/chaas, seasonal sabzi.\n"
        f"- Return STRICT VALID JSON ONLY without markdown, code fences, or text before/after. Match this exact JSON format:\n"
        f'{{"day": "Today", "user_id": "{profile.name}", "date": "{date.today()}", '
        f'"target_calories": 2000, "actual_calories": 1950, '
        f'"target_macros": {{"protein_g": 120, "carbs_g": 200, "fats_g": 55}}, '
        f'"total_macros": {{"protein_g": 118, "carbs_g": 195, "fats_g": 52}}, '
        f'"meals": ['
        f'{{"name": "Breakfast: Moong Chilla with Curd", "ingredients": ["2 chillas", "1 cup curd"], "approx_calories": 420, "macros": {{"protein_g": 26, "carbs_g": 40, "fats_g": 12}}, "reason": "High protein breakfast", "prep_time": "10 mins", "cook_time": "15 mins", "difficulty": "Easy", "instructions": ["Soak and grind moong dal.", "Cook on pan.", "Serve with curd."]}},'
        f'{{"name": "Lunch: Dal Tadka with Brown Rice & Paneer", "ingredients": ["1 cup dal", "1 cup rice", "75g paneer"], "approx_calories": 580, "macros": {{"protein_g": 34, "carbs_g": 68, "fats_g": 15}}, "reason": "Balanced protein and complex carbs", "prep_time": "15 mins", "cook_time": "20 mins", "difficulty": "Easy", "instructions": ["Cook dal.", "Serve with rice and roasted paneer."]}},'
        f'{{"name": "Dinner: Palak Paneer with Jowar Roti", "ingredients": ["100g paneer", "spinach", "2 jowar rotis"], "approx_calories": 490, "macros": {{"protein_g": 28, "carbs_g": 45, "fats_g": 16}}, "reason": "Low GI, rich in iron and calcium", "prep_time": "15 mins", "cook_time": "20 mins", "difficulty": "Medium", "instructions": ["Puree blanched spinach.", "Simmer with paneer.", "Serve with jowar roti."]}},'
        f'{{"name": "Snack: Roasted Makhana & Peanuts", "ingredients": ["30g makhana", "15g peanuts", "rock salt"], "approx_calories": 210, "macros": {{"protein_g": 8, "carbs_g": 24, "fats_g": 9}}, "reason": "Magnesium and antioxidant rich", "prep_time": "5 mins", "cook_time": "5 mins", "difficulty": "Easy", "instructions": ["Roast makhana and peanuts.", "Season with rock salt."]}}'
        f']}}'
    )

    gemini_resp = _call_gemini(gemini_prompt)
    if gemini_resp:
        try:
            match = re.search(r"\{[\s\S]*\}", gemini_resp)
            if match:
                plan = json.loads(match.group(0))
                if "meals" in plan and len(plan["meals"]) >= 3:
                    if "date" not in plan:
                        plan["date"] = str(date.today())
                    if "user_id" not in plan:
                        plan["user_id"] = profile.name
                    return plan
        except Exception as e:
            print(f"[WARNING] Parsing Gemini plan failed: {e}")

    # 2. Try Watsonx AI if configured
    if watson_model:
        try:
            watson_prompt = (
                f"You are a certified sports & clinical nutritionist. Given the client profile:\n"
                f"Name: {profile.name}, Age: {profile.age}, Goal: {profile.goal}, Diet: {profile.diet}.\n"
                f"Generate a customized nutrition plan. Respond with STRICT VALID JSON ONLY."
            )
            response = watson_model.generate_text(watson_prompt)
            text = response if isinstance(response, str) else response.get("results", [{}])[0].get("generated_text", "")
            match = re.search(r"\{[\s\S]*\}", text)
            if match:
                plan = json.loads(match.group(0))
                if "date" not in plan:
                    plan["date"] = str(date.today())
                if "user_id" not in plan:
                    plan["user_id"] = profile.name
                return plan
        except Exception as e:
            print("Watsonx AI plan generation failed:", str(e))

    return None


def generate_ai_chat(message: str, profile: Profile) -> Optional[str]:
    """Provide AI nutritionist advice in Indian context."""
    name = profile.name or "Friend"
    goal = profile.goal or "fitness"
    diet = profile.diet or "balanced"
    cuisine = getattr(profile, "cuisine", "indian")

    prompt = (
        f"You are a certified clinical nutritionist and fitness coach named Smart Nutrition Assistant, specialized in Indian diets, ICMR guidelines, and desi ingredients.\n"
        f"Client Profile: {name}, Goal: {goal}, Diet: {diet}, Cuisine: {cuisine}, Weight: {profile.weight_kg}kg, Height: {profile.height_cm}cm.\n"
        f"Question: \"{message}\".\n"
        f"Provide concise, encouraging, evidence-based advice in 2-4 short bullet points. Suggest authentic Indian ingredients (like sattu, dal, paneer, curd, millets, sprouts, makhana) where appropriate."
    )

    # 1. Try Gemini
    gemini_reply = _call_gemini(prompt)
    if gemini_reply and len(gemini_reply.strip()) > 10:
        return gemini_reply.strip()

    # 2. Try Watsonx
    if watson_model:
        try:
            response = watson_model.generate_text(prompt)
            reply = response if isinstance(response, str) else response.get("results", [{}])[0].get("generated_text", "")
            if reply and len(reply.strip()) > 10:
                return reply.strip()
        except Exception:
            pass

    return (
        f"Here are a few quick tips for your {diet} plan:\n"
        f"• Prioritize protein with every meal: include paneer, sprouts, curd, or soya.\n"
        f"• Opt for complex carbohydrates like millets (jowar, ragi) or whole wheat rotis over refined flour.\n"
        f"• Keep hydrated with water, chaas (buttermilk), and coconut water throughout the day."
    )
