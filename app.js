import React, { useState } from "react";
import "./App.css";

function MealPlanDisplay({ plan }) {
  if (!plan || plan.error) {
    return plan && plan.error ? (
      <div className="result-card error">
        <h2>Error Generating Plan</h2>
        <pre>{plan.error}</pre>
        <pre>{plan.raw && plan.raw.slice(0, 500)}</pre>
      </div>
    ) : null;
  }

  // helper function to safely render ingredients or swaps
  const renderValue = (val) => {
    if (val == null) return null;
    if (typeof val === "object") {
      return (
        <ul>
          {Object.entries(val).map(([k, v]) => (
            <li key={k}>
              <b>{k}</b>: {typeof v === "object" ? JSON.stringify(v) : v}
            </li>
          ))}
        </ul>
      );
    }
    return val.toString();
  };

  return (
    <div className="result-card">
      <div className="meta-line">
        <span><b>User:</b> {plan.user_id}</span>
        <span><b>Date:</b> {plan.date}</span>
        <span><b>Target Calories:</b> {plan.target_calories}</span>
      </div>
      <div className="meals-list">
        {plan.meals &&
          plan.meals.map((meal, idx) => (
            <div className="meal-item" key={idx}>
              <div className="meal-title">{meal.name}</div>
              <div className="meal-content-flex">
                <div className="ingr-block">
                  <div className="sub-heading">Ingredients:</div>
                  <ul>
                    {meal.ingredients?.map((ing, i) => (
                      <li key={i}>{renderValue(ing)}</li>
                    ))}
                  </ul>
                </div>
                <div className="details-block">
                  <div><span className="cal-badge">{meal.approx_calories} kcal</span></div>
                  <div><span className="label">Reason:</span> {renderValue(meal.reason)}</div>
                  {meal.swaps && (
                    <div>
                      <span className="label">Swap:</span>
                      <ul>
                        {Array.isArray(meal.swaps)
                          ? meal.swaps.map((swap, si) => <li key={si}>{renderValue(swap)}</li>)
                          : <li>{renderValue(meal.swaps)}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "male",
    height_cm: "",
    weight_kg: "",
    activity: "medium",
    goal: "maintain",
    diet: "balanced",
    allergies: "",
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        allergies: form.allergies
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      };
      const res = await fetch("http://127.0.0.1:8000/generate_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setMealPlan(result);
    } catch (error) {
      alert("Error generating plan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🥗 Smart Nutrition Assistant</h1>
        <div className="subtitle">
          Get your personalized AI meal plan powered by IBM watsonx.ai
        </div>

        <form
          className="floating-form"
          onSubmit={(e) => {
            e.preventDefault();
            generatePlan();
          }}
        >
          <div className="field">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Age</label>
              <input
                name="age"
                type="number"
                min={1}
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="field">
              <label>Activity Level</label>
              <select
                name="activity"
                value={form.activity}
                onChange={handleChange}
              >
                <option value="low">Low Activity</option>
                <option value="medium">Medium Activity</option>
                <option value="high">High Activity</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Height (cm)</label>
              <input
                name="height_cm"
                type="number"
                min={1}
                placeholder="Height (cm)"
                value={form.height_cm}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Weight (kg)</label>
              <input
                name="weight_kg"
                type="number"
                min={1}
                placeholder="Weight (kg)"
                value={form.weight_kg}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Goal</label>
              <select name="goal" value={form.goal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintain">Maintain</option>
              </select>
            </div>
          </div>

          <div className="field-row">
            <div className="field flex-2">
              <label>Diet Preference</label>
              <input
                name="diet"
                placeholder="Diet Preference (e.g., vegan, balanced)"
                value={form.diet}
                onChange={handleChange}
              />
            </div>
            <div className="field flex-2">
              <label>Allergies</label>
              <input
                name="allergies"
                placeholder="Allergies (comma separated)"
                value={form.allergies}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="generate-btn" type="submit" disabled={loading}>
            {loading ? "Generating Plan..." : "Generate Meal Plan"}
          </button>
        </form>

        {/* Removed upload section */}
        <MealPlanDisplay plan={mealPlan} />
      </div>
    </div>
  );
}

export default App;
