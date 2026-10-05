# Smart Nutrition Assistant

Smart Nutrition Assistant is a web app that creates a personal meal plan from
basic health and lifestyle information. Enter your age, height, weight,
activity level, fitness goal, diet preference, and allergies. The app then
creates meals with calorie and macro information.

This project has two parts:

- A React frontend for the form and meal-plan screens.
- A FastAPI backend for calculations and meal-plan generation.

## What You Can Do

- Create plans for weight loss, muscle gain, or maintaining weight.
- Choose Balanced, Vegetarian, Vegan, or Non-Vegetarian food.
- Enter allergies so meals can avoid those ingredients.
- See estimated calories, protein, carbohydrates, fats, BMI, and water needs.
- Swap a meal when you want another suggestion.
- Review saved plans from the history button.
- View a grocery list for the generated plan.
- Use the responsive interface on desktop or mobile screens.

## Project Layout

```text
Smart-Nutrition-Assistant/
|-- app.js              React user interface
|-- app.css             Application styles
|-- index.html          Frontend entry page
|-- index.js            React bootloader
|-- backend.py          FastAPI application and meal logic
|-- mealplan_*.json     Example saved meal plans
|-- package.json        Frontend commands and dependencies
|-- Dockerfile.backend  Backend container setup
|-- Dockerfile.frontend Frontend container setup
`-- docker-compose.yml  Local container setup
```

## Requirements

Install these tools before running the project:

- Node.js and npm
- Python 3.10 or newer
- A modern web browser

## Run Locally

### 1. Download the project

```bash
git clone https://github.com/abhishek7ab/Smart-Nutrition-Assistant.git
cd Smart-Nutrition-Assistant
```

### 2. Start the backend

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
source venv/bin/activate
```

Install the backend packages and start FastAPI:

```bash
pip install fastapi uvicorn python-dotenv ibm-watsonx-ai pydantic
uvicorn backend:app --reload
```

The backend is available at `http://127.0.0.1:8000`.

### 3. Start the frontend

Open a second terminal in the project folder and run:

```bash
npm install
npm start
```

Parcel starts the frontend at `http://localhost:1234`. Open that address in
your browser after both services are running.

## How a Plan Is Created

1. The form collects the user's profile and preferences.
2. The frontend sends the profile to the FastAPI backend.
3. The backend estimates daily calories from the user's measurements and goal.
4. The backend selects meals that match the diet and allergy preferences.
5. The frontend displays the plan, macros, meal swaps, and grocery list.

The app can use IBM Watsonx when it is configured. It also has built-in meal
logic, so the backend can run locally without an AI response.

## API Example

Create a meal plan with:

```http
POST http://127.0.0.1:8000/generate_plan
Content-Type: application/json
```

Example request:

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

The API returns the target calories, macro values, meals, ingredients, and
optional ingredient swaps.

## Troubleshooting

- If the frontend cannot load a plan, make sure the backend is running on port
  `8000`.
- If port `1234` is already in use, stop the other Parcel process or start the
  frontend with a different Parcel port.
- If Python packages are missing, activate the virtual environment and run the
  `pip install` command again.
- Do not commit private credentials or local secret files to GitHub.

## Tech Stack

React, Parcel, CSS, FastAPI, Python, and optional IBM Watsonx AI.

