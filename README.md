# 🥗 Smart Nutrition Assistant

An AI-powered nutrition planning application that generates personalized meal plans based on a user's profile, fitness goals, dietary preferences, and allergies.

Built using:

- React.js
- FastAPI
- IBM Watsonx AI / LLM Integration
- Modern Responsive UI
- REST API Architecture

---

## 🚀 Features

✅ **1-Day & 7-Day Weekly Meal Planning**: Mon-Sun customized day-by-day nutrition schedules.
✅ **Dynamic Macro Donut Charts**: Live visual breakdown of Protein, Carbs, and Healthy Fats.
✅ **Interactive Daily Hydration Tracker**: Personalized water targets with animated water cup logging.
✅ **Step-by-Step Cooking Recipes**: Cook times, prep times, difficulty tags, and full instructions modal.
✅ **Floating AI Nutritionist Chatbot**: Real-time Q&A assistant for pre/post workout nutrition and supplements.
✅ **Dark & Light Mode Switcher**: Seamless toggle between sleek Dark Glassmorphism and clean Light mode.
✅ **Categorized Grocery Checklist with WhatsApp Export**: One-click checklist copying for WhatsApp or Notes.
✅ **Supports Multiple Fitness Goals**: Weight Loss (Deficit), Muscle Gain (Surplus), Weight Maintenance.
✅ **Comprehensive Diet Preferences**: Indian Vegetarian, Vegan, Non-Vegetarian, Eggetarian, Balanced.
✅ **Allergy-Aware Meal Recommendations**: Filter out nuts, dairy, gluten, and shellfish safely.
✅ **FastAPI REST API Architecture** & **React Modern Glassmorphism UI**


---

# 📸 Screenshots

## Home Screen

![Home Screen](screenshots/home.png)

---

## User Input Form

![Input Form](screenshots/input-form-1.png)

---

## Meal Plan Generation

![Meal Plan Generation](screenshots/meal-plan-1.png)

---

## Muscle Gain Meal Plan

![Muscle Gain Plan](screenshots/input-form-1.png)

---

## Responsive Modern UI

![Responsive UI](screenshots/meal-plan-2.png)

---

# 🏗️ Project Architecture

```text
Smart-Nutrition-Assistant
│
├── frontend
│   ├── React
│   ├── CSS
│   └── API Integration
│
├── backend
│   ├── FastAPI
│   ├── Watsonx AI Integration
│   └── Meal Plan Generation Logic
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/smart-nutrition-assistant.git

cd smart-nutrition-assistant
```

---

# Backend Setup

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install fastapi uvicorn python-dotenv ibm-watsonx-ai
```

---

## Configure Environment Variables

Create a `.env` file:

```env
WATSONX_API_KEY=YOUR_API_KEY
WATSONX_PROJECT_ID=YOUR_PROJECT_ID
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

---

## Run Backend

```bash
uvicorn backend:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

or

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:1234
```

---

# API Endpoint

## Generate Meal Plan

### Request

```http
POST /generate_plan
```

### Sample Request

```json
{
  "name": "John Doe",
  "age": 25,
  "sex": "male",
  "height_cm": 177,
  "weight_kg": 93,
  "activity": "high",
  "goal": "muscle_gain",
  "diet": "non vegetarian",
  "allergies": ["milk"]
}
```

---

# Example Output

```json
{
  "target_calories": 3200,
  "meals": [
    {
      "name": "Breakfast",
      "approx_calories": 550
    },
    {
      "name": "Lunch",
      "approx_calories": 650
    },
    {
      "name": "Dinner",
      "approx_calories": 700
    }
  ]
}
```

---

# Future Improvements

- BMI Calculator
- Nutrition Charts
- Progress Tracking
- PDF Meal Plan Export
- Authentication System
- User Dashboard
- Meal History Storage
- Mobile App Version

---

# Tech Stack

| Technology | Usage |
|------------|--------|
| React | Frontend |
| FastAPI | Backend |
| IBM Watsonx AI | AI Meal Generation |
| CSS3 | UI Styling |
| REST API | Communication |

---

## Author

**Gargey Mahajan**

B.Tech Computer Engineering  
Vishwakarma University, Pune

## Connect With Me

- [LinkedIn](https://www.linkedin.com/in/gargey-mahajan-624a56346/)
- [GitHub](https://github.com/gargey2275)

