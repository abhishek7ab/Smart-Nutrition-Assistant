import React, { useState, useEffect } from "react";
import "./app.css";

function MealPlanDisplay({ plan, onSwapMeal, profile }) {
  const [activeTab, setActiveTab] = useState("plan"); // "plan" | "grocery"
  const [checkedItems, setCheckedItems] = useState({});
  const [swappingIdx, setSwappingIdx] = useState(null);

  if (!plan || plan.error) {
    return plan && plan.error ? (
      <div className="result-card error">
        <h2>⚠️ Error Generating Plan</h2>
        <pre>{plan.error}</pre>
        {plan.raw && <pre>{plan.raw.slice(0, 500)}</pre>}
      </div>
    ) : null;
  }

  const renderIngredient = (ing) => {
    if (typeof ing === "string") return ing;
    if (typeof ing === "object" && ing !== null) {
      if (ing.name || ing.item) {
        return `${ing.amount || ing.quantity || ''} ${ing.name || ing.item}`.trim();
      }
      return Object.values(ing).join(" - ");
    }
    return String(ing);
  };

  const renderSwaps = (swaps) => {
    if (!swaps) return null;
    let list = [];
    if (Array.isArray(swaps)) {
      list = swaps;
    } else if (typeof swaps === "object") {
      list = Object.values(swaps);
    } else {
      list = [swaps];
    }

    return (
      <div className="swaps-container">
        <span className="label">💡 Recommended Alternatives:</span>
        <div className="swaps-list">
          {list.map((item, idx) => {
            if (typeof item === "string") {
              return <div key={idx} className="swap-badge">🔄 {item}</div>;
            }
            if (typeof item === "object" && item !== null) {
              const orig = item.original_ingredient || item.original || "Original";
              const opt = item.swap_option || item.replacement || item.swap || "Option";
              const diff = item.calorie_diff !== undefined ? item.calorie_diff : null;
              const diffText = diff ? ` (${diff > 0 ? '+' : ''}${diff} kcal)` : '';
              return (
                <div key={idx} className="swap-badge">
                  🔄 <span>{orig}</span> → <b>{opt}</b>{diffText}
                </div>
              );
            }
            return <div key={idx} className="swap-badge">🔄 {String(item)}</div>;
          })}
        </div>
      </div>
    );
  };

  const getMealIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("breakfast")) return "🍳";
    if (n.includes("lunch")) return "🥗";
    if (n.includes("dinner")) return "🍽️";
    if (n.includes("snack")) return "🍎";
    return "🍴";
  };

  // Categorize Grocery List
  const buildGroceryCategories = () => {
    const categories = {
      "🥦 Produce & Vegetables": [],
      "🥩 Protein & Dairy": [],
      "🌾 Grains & Carbs": [],
      "🧂 Oils & Pantry": []
    };

    if (!plan.meals) return categories;

    plan.meals.forEach((meal) => {
      if (!meal.ingredients) return;
      meal.ingredients.forEach((ing) => {
        const text = renderIngredient(ing);
        const lower = text.toLowerCase();

        if (lower.includes("egg") || lower.includes("chicken") || lower.includes("salmon") || lower.includes("tofu") || lower.includes("paneer") || lower.includes("turkey") || lower.includes("yogurt") || lower.includes("milk") || lower.includes("cheese")) {
          categories["🥩 Protein & Dairy"].push(text);
        } else if (lower.includes("spinach") || lower.includes("berry") || lower.includes("berries") || lower.includes("apple") || lower.includes("banana") || lower.includes("tomato") || lower.includes("cucumber") || lower.includes("asparagus") || lower.includes("broccoli") || lower.includes("avocado") || lower.includes("pepper")) {
          categories["🥦 Produce & Vegetables"].push(text);
        } else if (lower.includes("oat") || lower.includes("rice") || lower.includes("quinoa") || lower.includes("bread") || lower.includes("toast") || lower.includes("wrap") || lower.includes("tortilla") || lower.includes("chickpea") || lower.includes("lentil") || lower.includes("bean")) {
          categories["🌾 Grains & Carbs"].push(text);
        } else {
          categories["🧂 Oils & Pantry"].push(text);
        }
      });
    });

    return categories;
  };

  const groceryCategories = buildGroceryCategories();

  const toggleCheck = (itemKey) => {
    setCheckedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const handleSwapClick = async (idx, mealName) => {
    setSwappingIdx(idx);
    await onSwapMeal(idx, mealName);
    setSwappingIdx(null);
  };

  const totalMacros = plan.total_macros || { protein_g: 130, carbs_g: 220, fats_g: 60 };
  const macroCalories = { protein: totalMacros.protein_g * 4, carbs: totalMacros.carbs_g * 4, fats: totalMacros.fats_g * 9 };
  const macroTotal = macroCalories.protein + macroCalories.carbs + macroCalories.fats || 1;
  const macroPct = Object.fromEntries(Object.entries(macroCalories).map(([key, value]) => [key, (value / macroTotal * 100).toFixed(1)]));

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="title-row">
          <h2>🎉 Personalized Nutrition Plan</h2>
          <div className="action-buttons">
            <button className="icon-btn print-btn" onClick={() => window.print()} title="Print / Export PDF">
              📄 Export PDF / Print
            </button>
          </div>
        </div>

        <div className="view-tabs">
          <button className={`tab-btn ${activeTab === "plan" ? "active" : ""}`} onClick={() => setActiveTab("plan")}>
            🍽️ Meal Plan View
          </button>
          <button className={`tab-btn ${activeTab === "grocery" ? "active" : ""}`} onClick={() => setActiveTab("grocery")}>
            🛒 Grocery Checklist
          </button>
        </div>
      </div>

      {activeTab === "plan" ? (
        <>
          <div className="stat-cards-grid">
            <div className="stat-card">
              <span className="stat-icon">👤</span>
              <div>
                <span className="stat-label">User</span>
                <span className="stat-value">{plan.user_id}</span>
              </div>
            </div>
            <div className="stat-card highlight">
              <span className="stat-icon">🔥</span>
              <div>
                <span className="stat-label">Target Calories</span>
                <span className="stat-value">{plan.target_calories} kcal / day</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <div>
                <span className="stat-label">Date</span>
                <span className="stat-value">{plan.date}</span>
              </div>
            </div>
          </div>

          {/* Macro Visual Breakdown */}
          <div className="macro-section">
            <span className="sub-heading">📊 Daily Macro Distribution</span>
            <div className="macro-bar-container">
              <div className="macro-bar-fill protein" style={{ width: `${macroPct.protein}%` }} title={`Protein ${macroPct.protein}%`}></div>
              <div className="macro-bar-fill carbs" style={{ width: `${macroPct.carbs}%` }} title={`Carbs ${macroPct.carbs}%`}></div>
              <div className="macro-bar-fill fats" style={{ width: `${macroPct.fats}%` }} title={`Fats ${macroPct.fats}%`}></div>
            </div>
            <div className="macro-legend">
              <span className="legend-item protein"><span className="dot"></span> Protein: {totalMacros.protein_g}g</span>
              <span className="legend-item carbs"><span className="dot"></span> Carbs: {totalMacros.carbs_g}g</span>
              <span className="legend-item fats"><span className="dot"></span> Fats: {totalMacros.fats_g}g</span>
            </div>
          </div>

          <div className="meals-list">
            {plan.meals &&
              plan.meals.map((meal, idx) => (
                <div className="meal-item" key={idx}>
                  <div className="meal-header">
                    <div className="meal-title-group">
                      <span className="meal-emoji">{getMealIcon(meal.name)}</span>
                      <h3 className="meal-title">{meal.name}</h3>
                    </div>
                    <div className="meal-header-actions">
                      <span className="cal-badge">{meal.approx_calories} kcal</span>
                      <button
                        className="swap-meal-btn"
                        onClick={() => handleSwapClick(idx, meal.name)}
                        disabled={swappingIdx === idx}
                      >
                        {swappingIdx === idx ? "Swapping..." : "🔄 Swap Meal"}
                      </button>
                    </div>
                  </div>

                  <div className="meal-body">
                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="ingr-block">
                        <span className="sub-heading">🥗 Ingredients</span>
                        <ul className="ingr-list">
                          {meal.ingredients.map((ing, i) => (
                            <li key={i}>{renderIngredient(ing)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="details-block">
                      {meal.reason && (
                        <div className="reason-box">
                          <span className="label">🎯 Nutritional Purpose</span>
                          <p className="reason-text">{typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}</p>
                        </div>
                      )}
                      {renderSwaps(meal.swaps)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="grocery-section">
          <h3>🛒 Categorized Grocery Shopping List</h3>
          <p className="grocery-subtitle">Check off items as you shop for your weekly meal plan</p>
          <div className="grocery-grid">
            {Object.entries(groceryCategories).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="grocery-card">
                  <h4>{category}</h4>
                  <ul className="checklist">
                    {items.map((item, i) => {
                      const key = `${category}-${i}-${item}`;
                      const isChecked = !!checkedItems[key];
                      return (
                        <li key={key} className={isChecked ? "checked" : ""} onClick={() => toggleCheck(key)}>
                          <input type="checkbox" checked={isChecked} readOnly />
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}
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
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smart_nutrition_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Real-time Health Metrics Calculation
  const calculateLiveMetrics = () => {
    const h = parseFloat(form.height_cm);
    const w = parseFloat(form.weight_kg);
    const age = parseInt(form.age);

    if (!h || !w || h <= 0 || w <= 0) return null;

    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    let category = "Healthy";
    let catColor = "#34d399"; // green

    if (bmi < 18.5) {
      category = "Underweight";
      catColor = "#fbbf24";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      catColor = "#f97316";
    } else if (bmi >= 30) {
      category = "Obese";
      catColor = "#ef4444";
    }

    // Daily Water Intake (35ml per kg)
    const waterLiters = (w * 0.035).toFixed(1);

    // TDEE estimate
    let bmr = 10 * w + 6.25 * h - 5 * (age || 25);
    bmr += form.sex === "male" ? 5 : -161;
    const actMult = form.activity === "low" ? 1.2 : (form.activity === "high" ? 1.725 : 1.45);
    const tdee = Math.round(bmr * actMult);

    return { bmi, category, catColor, waterLiters, tdee };
  };

  const liveMetrics = calculateLiveMetrics();

  const generatePlan = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age) || 25,
        height_cm: parseFloat(form.height_cm) || 175,
        weight_kg: parseFloat(form.weight_kg) || 70,
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
      if (!res.ok || !result || result.error || !Array.isArray(result.meals) || !result.meals.length) {
        setMealPlan({ error: result?.detail || result?.error || "The server returned an invalid meal plan." });
        return;
      }
      setMealPlan(result);

      // Save to localStorage history
      if (result && Array.isArray(result.meals) && result.meals.length) {
        const updatedHistory = [result, ...history.filter(h => h.date !== result.date || h.user_id !== result.user_id)].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("smart_nutrition_history", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      setMealPlan({ error: error.message || "Error generating plan." });
    } finally {
      setLoading(false);
    }
  };

  const handleSwapMeal = async (idx, mealName) => {
    try {
      const payload = {
        profile: {
          ...form,
          age: parseInt(form.age) || 25,
          height_cm: parseFloat(form.height_cm) || 175,
          weight_kg: parseFloat(form.weight_kg) || 70,
          allergies: form.allergies ? form.allergies.split(",").map(a => a.trim()).filter(Boolean) : []
        },
        meal_index: idx,
        meal_name: mealName
      };
      const res = await fetch("http://127.0.0.1:8000/swap_meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const newMeal = await res.json();
      if (!res.ok || !newMeal || newMeal.error || newMeal.detail) throw new Error(newMeal?.detail || newMeal?.error || "Unable to swap this meal.");
        setMealPlan(prev => {
          if (!prev) return prev;
          const newMeals = [...prev.meals];
          newMeals[idx] = newMeal;
          const updatedPlan = { ...prev, meals: newMeals };
          const updatedHistory = [updatedPlan, ...history.filter(h => h.date !== updatedPlan.date || h.user_id !== updatedPlan.user_id)].slice(0, 10);
          setHistory(updatedHistory);
          localStorage.setItem("smart_nutrition_history", JSON.stringify(updatedHistory));
          return updatedPlan;
        });
    } catch (e) {
      console.error("Failed to swap meal", e);
      setMealPlan(prev => ({ ...prev, error: e.message || "Failed to swap meal." }));
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="top-header">
          <div>
            <h1>🥗 Smart Nutrition Assistant</h1>
            <div className="subtitle">
              Personalized AI Meal Plans & Macro Nutrition Calculator
            </div>
          </div>
          <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
            📜 Saved Plans ({history.length})
          </button>
        </div>

        {/* History Slide-out Modal/Drawer */}
        {showHistory && (
          <div className="history-drawer">
            <div className="history-header">
              <h3>📜 Saved Meal Plans</h3>
              <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
            </div>
            {history.length === 0 ? (
              <p className="no-history">No saved plans yet. Generate your first plan!</p>
            ) : (
              <div className="history-list">
                {history.map((h, i) => (
                  <div key={i} className="history-item" onClick={() => { setMealPlan(h); setShowHistory(false); }}>
                    <div>
                      <strong>{h.user_id}</strong>
                      <span className="history-date">{h.date}</span>
                    </div>
                    <span className="history-cal">{h.target_calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
              placeholder="Full Name (e.g. John Doe)"
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
              <label>Fitness Goal</label>
              <select name="goal" value={form.goal} onChange={handleChange}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintain">Maintain Weight</option>
              </select>
            </div>
          </div>

          {/* Live Real-time Health Metrics Preview Bar */}
          {liveMetrics && (
            <div className="live-health-bar">
              <div className="health-stat">
                <span className="stat-title">BMI Index</span>
                <span className="stat-val">{liveMetrics.bmi}</span>
                <span className="category-pill" style={{ backgroundColor: liveMetrics.catColor }}>
                  {liveMetrics.category}
                </span>
              </div>
              <div className="health-stat">
                <span className="stat-title">Est. TDEE</span>
                <span className="stat-val">{liveMetrics.tdee} kcal</span>
              </div>
              <div className="health-stat">
                <span className="stat-title">Daily Water Goal</span>
                <span className="stat-val">💧 {liveMetrics.waterLiters} Liters</span>
              </div>
            </div>
          )}

          <div className="field-row">
            <div className="field flex-2">
              <label>Diet Preference</label>
              <select
                name="diet"
                value={form.diet}
                onChange={handleChange}
              >
                <option value="balanced">Balanced Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>
            <div className="field flex-2">
              <label>Allergies</label>
              <input
                name="allergies"
                placeholder="Allergies (e.g. milk, peanuts, shellfish)"
                value={form.allergies}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="generate-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Generating AI Meal Plan...</span>
              </>
            ) : (
              "Generate Meal Plan ✨"
            )}
          </button>
        </form>

        <MealPlanDisplay plan={mealPlan} onSwapMeal={handleSwapMeal} profile={form} />
      </div>
    </div>
  );
}

export default App;
