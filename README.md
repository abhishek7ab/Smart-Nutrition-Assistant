# Smart Nutrition Assistant

A small React and FastAPI app that creates personalized meal plans from a user's
body measurements, activity level, goal, diet preference, and allergies.

## Features

- Weight loss, muscle gain, and maintenance plans
- Balanced, vegetarian, vegan, and non-vegetarian meal options
- BMI, calorie, macro, and water-goal estimates
- Allergy-aware meal recommendations
- Meal swaps, saved plans, grocery lists, and responsive UI
- Optional IBM Watsonx integration with a local fallback

## Run Locally

### 1. Clone and install the frontend

```bash
git clone https://github.com/abhishek7ab/Smart-Nutrition-Assistant.git
cd Smart-Nutrition-Assistant
npm install
```

### 2. Install and run the backend

Create a virtual environment, activate it, and install the Python packages:

```bash
python -m venv venv
# Windows PowerShell
venv\Scripts\Activate.ps1
# macOS/Linux
source venv/bin/activate
pip install fastapi uvicorn python-dotenv ibm-watsonx-ai
uvicorn backend:app --reload
```

The API runs at `http://127.0.0.1:8000`.

### 3. Run the frontend

Open a second terminal in the project folder:

```bash
npm start
```

Open `http://localhost:1234` in a browser.

## Optional Watsonx Configuration

Create a `.env` file in the project root if Watsonx meal generation is enabled:

```env
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

The backend still starts without these values and uses its built-in meal-plan
logic.

## API

Generate a plan with `POST http://127.0.0.1:8000/generate_plan`:

```json
{
  "name": "Alex",
  "age": 25,
  "sex": "male",
  "height_cm": 177,
  "weight_kg": 75,
  "goal": "muscle_gain",
  "diet": "vegetarian",
  "activity": "high",
  "allergies": ["peanuts"]
}
```

## Tech Stack

React, Parcel, CSS, FastAPI, Python, and optional IBM Watsonx AI.

