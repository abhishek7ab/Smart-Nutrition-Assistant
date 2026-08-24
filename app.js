import React, { useState, useEffect } from "react";
import "./styles/index.css";
import {
  generateClientSingleDayPlan,
  generateClientWeeklyPlan,
  generateClientMealSwap
} from "./nutritionEngineClient.js";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000"
  : `http://${window.location.hostname}:8000`;

// SVG Circular / Donut Macro Chart Component
function MacroDonutChart({ protein_g, carbs_g, fats_g, target_calories }) {
  const p = Number(protein_g) || 120;
  const c = Number(carbs_g) || 200;
  const f = Number(fats_g) || 50;

  const pCal = p * 4;
  const cCal = c * 4;
  const fCal = f * 9;
  const totalCal = pCal + cCal + fCal || target_calories || 2000;

  const pPct = Math.round((pCal / totalCal) * 100);
  const cPct = Math.round((cCal / totalCal) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  // SVG Circumference calculations (radius = 38, perimeter = 2 * PI * 38 ≈ 238.76)
  const perimeter = 238.76;
  const pOffset = 0;
  const pStroke = (pPct / 100) * perimeter;

  const cOffset = -pStroke;
  const cStroke = (cPct / 100) * perimeter;

  const fOffset = -(pStroke + cStroke);
  const fStroke = (fPct / 100) * perimeter;

  return (
    <div className="macro-chart-wrapper">
      <div className="donut-chart-box">
        <svg className="donut-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" className="donut-bg" />
          {/* Protein Segment */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="donut-segment segment-protein"
            strokeDasharray={`${pStroke} ${perimeter}`}
            strokeDashoffset={pOffset}
          />
          {/* Carbs Segment */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="donut-segment segment-carbs"
            strokeDasharray={`${cStroke} ${perimeter}`}
            strokeDashoffset={cOffset}
          />
          {/* Fats Segment */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="donut-segment segment-fats"
            strokeDasharray={`${fStroke} ${perimeter}`}
            strokeDashoffset={fOffset}
          />
        </svg>
        <div className="donut-center-text">
          <span className="center-cal-number">{target_calories}</span>
          <span className="center-cal-unit">kcal / day</span>
        </div>
      </div>

      <div className="macro-breakdown-details">
        <div className="macro-detail-pill protein-pill">
          <div className="pill-dot"></div>
          <div className="pill-info">
            <span className="pill-title">Protein ({pPct}%)</span>
            <strong>{p}g</strong>
          </div>
        </div>
        <div className="macro-detail-pill carbs-pill">
          <div className="pill-dot"></div>
          <div className="pill-info">
            <span className="pill-title">Carbohydrates ({cPct}%)</span>
            <strong>{c}g</strong>
          </div>
        </div>
        <div className="macro-detail-pill fats-pill">
          <div className="pill-dot"></div>
          <div className="pill-info">
            <span className="pill-title">Healthy Fats ({fPct}%)</span>
            <strong>{f}g</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive Daily Water Tracker Component
// Interactive Daily Water Tracker Component
function WaterTracker({ weight_kg }) {
  const weight = parseFloat(weight_kg) || 70;
  const targetLiters = (weight * 0.035).toFixed(1);
  const targetMl = Math.round(weight * 35);

  const todayKey = `smart_nutrition_water_${new Date().toISOString().split("T")[0]}`;

  const [drankMl, setDrankMl] = useState(() => {
    try {
      return parseInt(localStorage.getItem(todayKey) || "0", 10);
    } catch {
      return 0;
    }
  });

  const [toastMessage, setToastMessage] = useState("");

  const updateWater = (delta) => {
    const updated = Math.max(0, drankMl + delta);
    setDrankMl(updated);
    try {
      localStorage.setItem(todayKey, updated.toString());
    } catch (e) {
      console.error(e);
    }

    if (updated >= targetMl && drankMl < targetMl) {
      showToast("🎉 Daily hydration goal achieved!");
    } else if (delta > 0) {
      showToast(`💧 Logged +${delta}ml`);
    }
  };

  const resetWater = () => {
    setDrankMl(0);
    try {
      localStorage.setItem(todayKey, "0");
    } catch (e) {
      console.error(e);
    }
    showToast("Tracker reset for today.");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const pct = Math.min(100, Math.round((drankMl / targetMl) * 100));
  const loggedL = (drankMl / 1000).toFixed(2);
  const remainingL = Math.max(0, (targetMl - drankMl) / 1000).toFixed(2);

  return (
    <div className="water-tracker-card" aria-label="Daily Hydration Tracker">
      {/* Header */}
      <div className="water-header">
        <div className="water-title-wrap">
          <div className="water-icon-circle">💧</div>
          <div>
            <h3>Daily Hydration Tracker</h3>
            <p className="water-subtitle">Optimal fluid balance computed dynamically for your bodyweight</p>
          </div>
        </div>
        <span className={`water-pct-badge ${pct >= 100 ? "complete" : ""}`}>
          {pct}% Reached
        </span>
      </div>

      {/* 3-Column Dashboard Body */}
      <div className="water-dashboard-layout">
        {/* Col 1: Animated Realistic Glass */}
        <div className="cup-container">
          <div className="glass-cup">
            <div className="water-fill" style={{ height: `${pct}%` }}></div>
            <div className="cup-label">{drankMl} ml</div>
          </div>
        </div>

        {/* Col 2: Live Metrics & Progress Bar */}
        <div className="water-stats-col">
          <div className="water-metrics-tiles">
            <div className="water-metric-box">
              <span className="water-metric-lbl">Target</span>
              <span className="water-metric-val">{targetLiters} L</span>
            </div>
            <div className="water-metric-box active-log">
              <span className="water-metric-lbl">Logged</span>
              <span className="water-metric-val" style={{ color: "#38bdf8" }}>{loggedL} L</span>
            </div>
            <div className="water-metric-box">
              <span className="water-metric-lbl">Remaining</span>
              <span className="water-metric-val">{remainingL} L</span>
            </div>
          </div>

          <div className="water-bar-track">
            <div className="water-bar-fill" style={{ width: `${pct}%` }}></div>
          </div>

          {toastMessage && <span className="water-toast">{toastMessage}</span>}
        </div>

        {/* Col 3: Quick Log Buttons */}
        <div className="water-actions-col">
          <div className="water-btn-grid">
            <button className="water-quick-btn" type="button" onClick={() => updateWater(250)}>
              <span>🥛</span> +250 ml
            </button>
            <button className="water-quick-btn primary-add" type="button" onClick={() => updateWater(500)}>
              <span>🧴</span> +500 ml
            </button>
            <button className="water-quick-btn" type="button" onClick={() => updateWater(750)}>
              <span>💧</span> +750 ml
            </button>
            <button className="water-quick-btn" type="button" onClick={() => updateWater(1000)}>
              <span>🫙</span> +1.0 L
            </button>
          </div>

          <div className="water-reset-row">
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>1-Click Quick Log</span>
            <button className="water-reset-btn" type="button" onClick={resetWater}>
              ↺ Reset Tracker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recipe Instructions Modal
function RecipeModal({ meal, onClose }) {
  if (!meal) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="recipe-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recipe-modal-header">
          <div className="recipe-title-group">
            <span className="recipe-badge">{meal.difficulty || "Easy"}</span>
            <h2>{meal.name}</h2>
          </div>
          <button className="close-btn" type="button" onClick={onClose}>✕</button>
        </div>

        <div className="recipe-meta-row">
          <div className="meta-item">
            <span className="meta-label">⏱️ Prep Time</span>
            <strong>{meal.prep_time || "10 mins"}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">🍳 Cook Time</span>
            <strong>{meal.cook_time || "15 mins"}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">🔥 Calories</span>
            <strong>{meal.approx_calories} kcal</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">🎯 Goal Alignment</span>
            <strong>High Protein</strong>
          </div>
        </div>

        <div className="recipe-body">
          <div className="recipe-section">
            <h3>🥗 Required Ingredients</h3>
            <ul className="recipe-ingr-list">
              {meal.ingredients && meal.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="bullet">✓</span>
                  <span>{typeof ing === "object" ? (ing.name || ing.item || JSON.stringify(ing)) : String(ing)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <h3>👨‍🍳 Step-by-Step Cooking Guide</h3>
            <ol className="cooking-steps-list">
              {meal.instructions && meal.instructions.length > 0 ? (
                meal.instructions.map((step, idx) => (
                  <li key={idx} className="step-item">
                    <span className="step-num">{idx + 1}</span>
                    <p className="step-text">{step}</p>
                  </li>
                ))
              ) : (
                <li className="step-item">
                  <span className="step-num">1</span>
                  <p className="step-text">Prepare and wash all ingredients freshly. Cook with minimal healthy cold-pressed oil or ghee.</p>
                </li>
              )}
            </ol>
          </div>

          {meal.reason && (
            <div className="recipe-purpose-box">
              <strong>💡 Nutritionist Note:</strong> {typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}
            </div>
          )}
        </div>

        <div className="recipe-modal-footer">
          <button className="secondary-btn" type="button" onClick={onClose}>Close Recipe</button>
        </div>
      </div>
    </div>
  );
}


// Main Meal Plan Display Component
function MealPlanDisplay({ plan, onSwapMeal, profile }) {
  const [activeTab, setActiveTab] = useState("plan"); // "plan" | "grocery"
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [checkedItems, setCheckedItems] = useState({});
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  if (!plan || plan.error) {
    return plan && plan.error ? (
      <div className="result-card error">
        <h2>⚠️ Error Generating Plan</h2>
        <pre>{plan.error}</pre>
        {plan.raw && <pre>{plan.raw.slice(0, 500)}</pre>}
      </div>
    ) : null;
  }

  const isWeekly = plan.is_weekly && plan.days;
  const daysList = isWeekly ? Object.keys(plan.days) : [];
  const currentDayData = isWeekly ? (plan.days[selectedDay] || Object.values(plan.days)[0]) : plan;
  const currentMeals = currentDayData.meals || [];

  const renderIngredient = (ing) => {
    if (typeof ing === "string") return ing;
    if (typeof ing === "object" && ing !== null) {
      if (ing.name || ing.item) {
        return `${ing.amount || ing.quantity || ""} ${ing.name || ing.item}`.trim();
      }
      return Object.values(ing).join(" - ");
    }
    return String(ing);
  };

  const getMealIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("breakfast")) return "🍳";
    if (n.includes("lunch")) return "🥗";
    if (n.includes("dinner")) return "🍽️";
    if (n.includes("snack")) return "🍎";
    return "🍴";
  };

  // Build Aggregated Grocery List from All Meals
  const buildGroceryCategories = () => {
    const categories = {
      "🥦 Fresh Produce & Vegetables": [],
      "🥩 High-Protein & Dairy": [],
      "🌾 Healthy Grains & Carbs": [],
      "🧂 Superfoods, Oils & Pantry": []
    };

    const mealsToProcess = isWeekly
      ? Object.values(plan.days).flatMap((d) => d.meals || [])
      : currentMeals;

    const seen = new Set();

    mealsToProcess.forEach((meal) => {
      if (!meal.ingredients) return;
      meal.ingredients.forEach((ing) => {
        const text = renderIngredient(ing);
        if (seen.has(text.toLowerCase())) return;
        seen.add(text.toLowerCase());

        const lower = text.toLowerCase();
        if (
          lower.includes("egg") ||
          lower.includes("chicken") ||
          lower.includes("salmon") ||
          lower.includes("fish") ||
          lower.includes("tofu") ||
          lower.includes("paneer") ||
          lower.includes("turkey") ||
          lower.includes("yogurt") ||
          lower.includes("milk") ||
          lower.includes("curd") ||
          lower.includes("cheese") ||
          lower.includes("protein") ||
          lower.includes("soya")
        ) {
          categories["🥩 High-Protein & Dairy"].push(text);
        } else if (
          lower.includes("spinach") ||
          lower.includes("palak") ||
          lower.includes("berry") ||
          lower.includes("apple") ||
          lower.includes("banana") ||
          lower.includes("tomato") ||
          lower.includes("cucumber") ||
          lower.includes("broccoli") ||
          lower.includes("avocado") ||
          lower.includes("pepper") ||
          lower.includes("onion") ||
          lower.includes("beans") ||
          lower.includes("orange") ||
          lower.includes("guava") ||
          lower.includes("pomegranate")
        ) {
          categories["🥦 Fresh Produce & Vegetables"].push(text);
        } else if (
          lower.includes("oat") ||
          lower.includes("rice") ||
          lower.includes("quinoa") ||
          lower.includes("bread") ||
          lower.includes("toast") ||
          lower.includes("wrap") ||
          lower.includes("roti") ||
          lower.includes("paratha") ||
          lower.includes("chickpea") ||
          lower.includes("rajma") ||
          lower.includes("dal") ||
          lower.includes("lentil") ||
          lower.includes("poha") ||
          lower.includes("khichdi")
        ) {
          categories["🌾 Healthy Grains & Carbs"].push(text);
        } else {
          categories["🧂 Superfoods, Oils & Pantry"].push(text);
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
    await onSwapMeal(idx, mealName, selectedDay);
    setSwappingIdx(null);
  };

  const copyGroceryList = () => {
    let output = `🛒 Smart Nutrition Assistant - Grocery Shopping List\nPlan for: ${plan.user_id} (${plan.date})\n\n`;
    Object.entries(groceryCategories).forEach(([category, items]) => {
      if (items.length > 0) {
        output += `${category.toUpperCase()}:\n`;
        items.forEach((item) => {
          output += `  [ ] ${item}\n`;
        });
        output += `\n`;
      }
    });

    navigator.clipboard.writeText(output);
    setCopyFeedback("📋 Grocery list copied to clipboard! Ready to paste into WhatsApp or Notes.");
    setTimeout(() => setCopyFeedback(""), 4000);
  };

  const totalMacros = currentDayData.total_macros || plan.total_macros || { protein_g: 130, carbs_g: 220, fats_g: 60 };
  const targetCal = currentDayData.target_calories || plan.target_calories || 2000;

  return (
    <div className="result-card">
      <div className="result-header">
        <div className="title-row">
          <div>
            <h2>{isWeekly ? "📅 7-Day Personalized Nutrition Plan" : "🎉 Personalized Daily Nutrition Plan"}</h2>
            <p className="plan-subtitle">Formulated for <b>{plan.user_id}</b> • Generated on {plan.date}</p>
          </div>
          <div className="action-buttons">
            <button className="icon-btn print-btn" onClick={() => window.print()} title="Print / Export PDF">
              📄 Export PDF / Print
            </button>
          </div>
        </div>

        {/* Weekly Day Selector Pills */}
        {isWeekly && (
          <div className="day-selector-row">
            <span className="day-selector-label">Select Day:</span>
            <div className="day-pills">
              {daysList.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-pill ${selectedDay === day ? "active" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="day-name">{day.slice(0, 3)}</span>
                  <span className="day-cal">{plan.days[day]?.target_calories} kcal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View Switcher Tabs */}
        <div className="view-tabs" role="tablist" aria-label="Meal plan views">
          <button
            className={`tab-btn ${activeTab === "plan" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "plan"}
            onClick={() => setActiveTab("plan")}
          >
            🍽️ {isWeekly ? `${selectedDay}'s Meal Plan` : "Daily Meal Plan"}
          </button>
          <button
            className={`tab-btn ${activeTab === "grocery" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "grocery"}
            onClick={() => setActiveTab("grocery")}
          >
            🛒 {isWeekly ? "Weekly Grocery Checklist" : "Grocery Checklist"}
          </button>
        </div>
      </div>

      {activeTab === "plan" ? (
        <>
          {/* Visual Donut Macro Chart & Metric Highlights */}
          <div className="macro-dashboard-grid">
            <div className="macro-chart-box-container">
              <span className="dashboard-subheading">📊 Calorie & Macro Distribution</span>
              <MacroDonutChart
                protein_g={totalMacros.protein_g}
                carbs_g={totalMacros.carbs_g}
                fats_g={totalMacros.fats_g}
                target_calories={targetCal}
              />
            </div>

            <div className="energy-stats-box">
              <span className="dashboard-subheading">🔥 Energy & Metabolic Targets</span>
              <div className="stat-tiles">
                <div className="stat-tile">
                  <span className="stat-tile-label">Basal Metabolic Rate (BMR)</span>
                  <span className="stat-tile-val">{plan.bmr || 1550} kcal</span>
                  <span className="stat-tile-desc">Calories burned at complete rest</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-tile-label">Maintenance Energy (TDEE)</span>
                  <span className="stat-tile-val">{plan.tdee || 2150} kcal</span>
                  <span className="stat-tile-desc">Total daily energy expenditure</span>
                </div>
                <div className="stat-tile highlight">
                  <span className="stat-tile-label">Target Intake</span>
                  <span className="stat-tile-val">{targetCal} kcal</span>
                  <span className="stat-tile-desc">Optimized for your fitness goal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="meals-list">
            {currentMeals.map((meal, idx) => {
              const lower = (meal.name || "").toLowerCase();
              let slot = `Meal ${idx + 1}`;
              let cleanTitle = meal.name;

              if (lower.startsWith("breakfast")) {
                slot = "🌅 Breakfast";
                cleanTitle = meal.name.replace(/^breakfast[:\s-]*/i, "");
              } else if (lower.startsWith("lunch")) {
                slot = "☀️ Lunch";
                cleanTitle = meal.name.replace(/^lunch[:\s-]*/i, "");
              } else if (lower.startsWith("dinner")) {
                slot = "🌙 Dinner";
                cleanTitle = meal.name.replace(/^dinner[:\s-]*/i, "");
              } else if (lower.startsWith("snack")) {
                slot = "🍎 Snack";
                cleanTitle = meal.name.replace(/^snack[:\s-]*/i, "");
              } else {
                const defaultSlots = ["🌅 Breakfast", "☀️ Lunch", "🌙 Dinner", "🍎 Snack"];
                slot = defaultSlots[idx] || `Meal ${idx + 1}`;
              }

              return (
                <div className="meal-item" key={idx}>
                  <div className="meal-header">
                    <div className="meal-title-group">
                      <div className="meal-emoji-badge">{getMealIcon(meal.name)}</div>
                      <div className="meal-heading-wrapper">
                        <span className="meal-slot-tag">{slot}</span>
                        <h3 className="meal-title">{cleanTitle}</h3>
                        <div className="meal-meta-tags">
                          <span className="meal-tag">⏱️ {meal.prep_time || "10 mins"}</span>
                          <span className="meal-tag">🍳 {meal.cook_time || "15 mins"}</span>
                          <span className="meal-tag difficulty">{meal.difficulty || "Easy"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="meal-header-actions">
                      <span className="cal-badge">{meal.approx_calories} kcal</span>
                      <button
                        className="recipe-btn"
                        type="button"
                        onClick={() => setSelectedRecipe(meal)}
                      >
                        📖 View Recipe
                      </button>
                      <button
                        className="swap-meal-btn"
                        type="button"
                        onClick={() => handleSwapClick(idx, meal.name)}
                        disabled={swappingIdx === idx}
                      >
                        {swappingIdx === idx ? "Swapping..." : "🔄 Swap"}
                      </button>
                    </div>
                  </div>

                  <div className="meal-body">
                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="ingr-block">
                        <span className="sub-heading">🥗 Key Ingredients</span>
                        <div className="ingr-chips-wrap">
                          {meal.ingredients.map((ing, i) => (
                            <span className="ingr-chip" key={i}>
                              {renderIngredient(ing)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="details-block">
                      {meal.reason && (
                        <div className="reason-box">
                          <span className="label">🎯 Nutritional Purpose</span>
                          <p className="reason-text">
                            {typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}
                          </p>
                        </div>
                      )}

                      {meal.macros && (
                        <div className="meal-mini-macros">
                          <span className="macro-mini-pill p">🍗 Protein: <b>{meal.macros.protein_g}g</b></span>
                          <span className="macro-mini-pill c">🌾 Carbs: <b>{meal.macros.carbs_g}g</b></span>
                          <span className="macro-mini-pill f">🥑 Fats: <b>{meal.macros.fats_g}g</b></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="grocery-section">
          <div className="grocery-toolbar">
            <div>
              <h3>🛒 {isWeekly ? "Complete 7-Day Grocery Shopping List" : "Categorized Grocery Checklist"}</h3>
              <p className="grocery-subtitle">Everything you need for your planned healthy meals</p>
            </div>
            <button className="copy-grocery-btn" type="button" onClick={copyGroceryList}>
              📋 Copy for WhatsApp / Notes
            </button>
          </div>

          {copyFeedback && <div className="grocery-feedback">{copyFeedback}</div>}

          <div className="grocery-grid">
            {Object.entries(groceryCategories).map(([category, items]) =>
              items.length > 0 && (
                <div key={category} className="grocery-card">
                  <h4>{category}</h4>
                  <ul className="checklist">
                    {items.map((item, i) => {
                      const key = `${category}-${i}-${item}`;
                      const isChecked = !!checkedItems[key];
                      return (
                        <li
                          key={key}
                          className={isChecked ? "checked" : ""}
                          role="checkbox"
                          aria-checked={isChecked}
                          tabIndex={0}
                          onClick={() => toggleCheck(key)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") toggleCheck(key);
                          }}
                        >
                          <input type="checkbox" checked={isChecked} readOnly />
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal meal={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
}

// Zone 2: Hero Section - Personalized Smart Nutrition
function HeroSection({ onStartAssessment, onExploreDemo }) {
  return (
    <section className="hero-section" id="hero">
      {/* Left Content */}
      <div className="hero-left-content">
        <div className="hero-eyebrow-pill">AI-Powered • Personalized Nutrition</div>

        <h1 className="hero-main-heading">
          Smart Nutrition <span>Tailored for You</span>
        </h1>

        <p className="hero-subdescription">
          Input your biometrics, fitness targets, and dietary preferences. Our intelligent engine calculates your exact caloric and macro distribution with delicious daily and weekly meal plans.
        </p>

        <div className="hero-actions-group">
          <button
            type="button"
            className="btn-hero-primary"
            onClick={onStartAssessment}
            id="hero-cta-assessment"
          >
            <span>Create My Plan →</span>
          </button>

          <button
            type="button"
            className="btn-hero-secondary"
            onClick={onExploreDemo}
            id="hero-cta-demo"
          >
            <span>Quick Demo ⚡</span>
          </button>
        </div>
      </div>

      {/* Right Side Visual Produce Card */}
      <div className="hero-visual-wrapper">
        <div className="hero-produce-card">
          <div className="hero-card-banner-bg">
            <span className="hero-basket-icon">🥗</span>
            <h3 className="hero-card-title">Fresh Daily Nutrition Plan</h3>
            <p className="hero-card-subtitle">Personalized & Evidence-Based</p>
          </div>

          <div className="hero-macro-pill-row">
            <div className="hero-macro-box">
              <span className="hero-macro-label">Target</span>
              <div className="hero-macro-val">2,100 kcal</div>
            </div>
            <div className="hero-macro-box">
              <span className="hero-macro-label">Protein</span>
              <div className="hero-macro-val" style={{ color: "var(--accent-green)" }}>140g</div>
            </div>
            <div className="hero-macro-box">
              <span className="hero-macro-label">Water</span>
              <div className="hero-macro-val" style={{ color: "#38bdf8" }}>3.0 L</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Zone 3: Horizontal Round Category Icons matching Screenshot 2
const ARCHETYPES_LIST = [
  {
    id: "balanced",
    emoji: "🥗",
    name: "Balanced",
    macroSplit: "30P • 45C • 25F",
    dietVal: "balanced",
    goalVal: "maintain",
  },
  {
    id: "vegetarian",
    emoji: "🥕",
    name: "Vegetables",
    macroSplit: "25P • 50C • 25F",
    dietVal: "indian vegetarian",
    goalVal: "maintain",
  },
  {
    id: "vegan",
    emoji: "🍇",
    name: "Berries / Plant",
    macroSplit: "20P • 60C • 20F",
    dietVal: "indian vegan",
    goalVal: "maintain",
  },
  {
    id: "keto",
    emoji: "🥑",
    name: "Nuts / Keto",
    macroSplit: "25P • 5C • 70F",
    dietVal: "balanced",
    goalVal: "fat_loss",
  },
  {
    id: "hypertrophy",
    emoji: "🥤",
    name: "Beverages / Protein",
    macroSplit: "35P • 45C • 20F",
    dietVal: "balanced",
    goalVal: "muscle_gain",
  },
];

function DietaryArchetypeStrip({ selectedArchetype, onSelectArchetype }) {
  return (
    <section className="archetypes-section" aria-label="Dietary Frameworks">
      <div className="archetypes-header">
        <div className="archetypes-tag">Explore Diets</div>
        <h2 className="archetypes-title">Select Your Dietary Framework</h2>
      </div>

      <div className="archetypes-circle-grid">
        {ARCHETYPES_LIST.map((arch) => {
          const isActive = selectedArchetype === arch.id;
          return (
            <button
              key={arch.id}
              type="button"
              className={`archetype-circle-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectArchetype(arch)}
              aria-pressed={isActive}
            >
              <div className="archetype-circle-icon">{arch.emoji}</div>
              <span className="archetype-circle-name">{arch.name}</span>
              <span className="archetype-circle-split">{arch.macroSplit}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Zone 4: Split About Section matching Screenshot 2
function EvidenceSection() {
  return (
    <section className="evidence-split-section" id="methodology" aria-label="About The Engine">
      {/* Left Column: 2 Visual Image Cards */}
      <div className="evidence-visual-col">
        <div className="evidence-img-card tall">
          <span className="evidence-card-emoji">👩‍🍳</span>
          <h4 className="evidence-card-title">Fresh Meal Prep</h4>
          <p className="evidence-card-desc">Step-by-step easy home cooking instructions</p>
        </div>
        <div className="evidence-img-card card-alt">
          <span className="evidence-card-emoji">🥦</span>
          <h4 className="evidence-card-title">Nutrient-Dense</h4>
          <p className="evidence-card-desc">Whole foods rich in essential vitamins & minerals</p>
        </div>
      </div>

      {/* Right Column: Text & Checklist */}
      <div className="evidence-content-col">
        <div className="evidence-tag">About The Platform</div>
        <h2 className="evidence-title">Precision Nutrition & Delicious Recipes Delivered</h2>
        <p className="evidence-lead">
          We ease your everyday routine and make healthy eating delicious, affordable, and effortless. At Smart Nutrition, you can generate:
        </p>

        <ul className="evidence-checklist">
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>Personalized Caloric Targets</span>
          </li>
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>Balanced Macronutrients</span>
          </li>
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>7-Day Weekly Meal Plans</span>
          </li>
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>Categorized Grocery Lists</span>
          </li>
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>Dynamic Hydration Goal</span>
          </li>
          <li className="evidence-check-item">
            <span className="evidence-check-icon">✓</span>
            <span>100% Free Public Utility</span>
          </li>
        </ul>

        <p className="evidence-footnote">
          Our algorithm balances energy expenditure equations (Mifflin-St Jeor) with macronutrient density to ensure sustainable, long-term health and peak vitality.
        </p>
      </div>
    </section>
  );
}

// Zone 5: 3-Step Process & 2 Split Promo Cards
function StepsSection({ onStep1Click }) {
  return (
    <section className="steps-workflow-section" id="how-it-works" aria-label="3-Step Workflow">
      <p className="steps-intro-text">
        We calculate your metabolic requirements with precision to deliver delicious daily dishes tailored to your body.
      </p>

      {/* 3 Step Cards */}
      <div className="steps-cards-row">
        <div className="step-flow-card" onClick={onStep1Click} style={{ cursor: "pointer" }}>
          <div className="step-icon-badge">🧬</div>
          <h3 className="step-title-num"><span className="num">1.</span> Enter Biometrics</h3>
          <p className="step-description-text">
            Input your age, weight, height, activity level, and dietary framework in the form below.
          </p>
        </div>

        <div className="step-flow-card" onClick={onStep1Click} style={{ cursor: "pointer" }}>
          <div className="step-icon-badge">⚙️</div>
          <h3 className="step-title-num"><span className="num">2.</span> AI Computes Plan</h3>
          <p className="step-description-text">
            Our algorithm balances exact calories, proteins, carbohydrates, and healthy fats.
          </p>
        </div>

        <div className="step-flow-card" onClick={onStep1Click} style={{ cursor: "pointer" }}>
          <div className="step-icon-badge">📊</div>
          <h3 className="step-title-num"><span className="num">3.</span> Follow & Enjoy</h3>
          <p className="step-description-text">
            Follow your delicious meal routine, cook simple recipes, and track your daily hydration.
          </p>
        </div>
      </div>

      {/* Single Weekly Meal Planner Card */}
      <div className="single-promo-banner">
        <div className="single-promo-content">
          <span className="promo-badge-tag">7-Day Variety</span>
          <h3 className="promo-banner-title">Weekly Meal Planner</h3>
          <p className="promo-banner-desc">
            Get varied daily recipes from Monday to Sunday matching your exact caloric target.
          </p>
        </div>
        <button type="button" className="promo-cta-btn" onClick={onStep1Click}>
          Generate 7-Day Plan →
        </button>
      </div>
    </section>
  );
}

// Zone 6: Tabbed Showcase Grid
const SHOWCASE_PRODUCTS = [
  {
    id: "prod-1",
    category: ["all", "fruit"],
    title: "Fresh Figs Oatmeal Bowl",
    emoji: "🥣",
    calories: "380 kcal",
    price: "Easy • 10m",
    recipe: {
      name: "Fresh Figs & Cinnamon Spiced Oats",
      approx_calories: 380,
      prep_time: "5 mins",
      cook_time: "5 mins",
      difficulty: "Easy",
      ingredients: ["1/2 cup Rolled Oats", "1 cup Almond Milk", "2 Fresh Figs (sliced)", "1 tbsp Chia Seeds", "1/2 tsp Ceylon Cinnamon"],
      instructions: [
        "Simmer rolled oats in almond milk over medium heat for 4-5 minutes.",
        "Stir in chia seeds and ground cinnamon.",
        "Top with fresh sliced figs and serve warm."
      ]
    }
  },
  {
    id: "prod-2",
    category: ["all", "veg"],
    title: "Lime & Herb Grilled Salmon",
    emoji: "🥗",
    calories: "520 kcal",
    price: "Medium • 15m",
    recipe: {
      name: "Lime & Herb Grilled Salmon Bowl",
      approx_calories: 520,
      prep_time: "5 mins",
      cook_time: "10 mins",
      difficulty: "Medium",
      ingredients: ["180g Fresh Salmon Fillet", "1 Fresh Lime", "1 cup Steamed Broccoli", "1/2 cup Quinoa", "1 tbsp Olive Oil"],
      instructions: [
        "Pan-sear salmon in olive oil for 4 minutes skin-side down.",
        "Flip and squeeze fresh lime juice over the fillet.",
        "Serve alongside warm tricolor quinoa and steamed broccoli."
      ]
    }
  },
  {
    id: "prod-3",
    category: ["all", "berries"],
    title: "Berry Greek Yogurt Parfait",
    emoji: "🫐",
    calories: "320 kcal",
    price: "Easy • 5m",
    recipe: {
      name: "Mixed Berry Greek Yogurt Parfait",
      approx_calories: 320,
      prep_time: "5 mins",
      cook_time: "0 mins",
      difficulty: "Easy",
      ingredients: ["1 cup Plain Greek Yogurt", "1/2 cup Mixed Berries", "2 tbsp Walnuts", "1 tsp Raw Honey"],
      instructions: [
        "Layer Greek yogurt in a glass or bowl.",
        "Add fresh blueberries, raspberries, and crushed walnuts.",
        "Drizzle lightly with raw honey."
      ]
    }
  },
  {
    id: "prod-4",
    category: ["all", "nuts"],
    title: "Tangerine & Walnut Salad",
    emoji: "🍊",
    calories: "410 kcal",
    price: "Easy • 8m",
    recipe: {
      name: "Tangerine, Walnut & Arugula Salad",
      approx_calories: 410,
      prep_time: "8 mins",
      cook_time: "0 mins",
      difficulty: "Easy",
      ingredients: ["2 Fresh Tangerines", "2 cups Baby Arugula", "1/4 cup Roasted Walnuts", "30g Crumbled Feta", "1 tbsp Balsamic Glaze"],
      instructions: [
        "Peel and segment fresh tangerines.",
        "Toss baby arugula with walnuts and crumbled feta.",
        "Top with tangerine segments and drizzle with balsamic glaze."
      ]
    }
  }
];

function ProtocolMatrixShowcase({ onSelectRecipe }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = SHOWCASE_PRODUCTS.filter((item) =>
    activeCategory === "all" ? true : item.category.includes(activeCategory)
  );

  return (
    <section className="showcase-matrix-section" id="macro-matrix" aria-label="Curated Protocols">
      <div className="showcase-header">
        <div className="showcase-subtitle-tag">Featured Recipes</div>
        <h2 className="showcase-main-title">Right Off the Kitchen</h2>
        <p className="showcase-desc">
          Explore evidence-based balanced meals formulated for peak energy, muscle recovery, and metabolic health.
        </p>
      </div>

      {/* Tabs */}
      <div className="showcase-tabs-row" role="tablist">
        <button
          type="button"
          className={`showcase-tab-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All Meals
        </button>
        <button
          type="button"
          className={`showcase-tab-btn ${activeCategory === "fruit" ? "active" : ""}`}
          onClick={() => setActiveCategory("fruit")}
        >
          Fruit / Breakfast
        </button>
        <button
          type="button"
          className={`showcase-tab-btn ${activeCategory === "veg" ? "active" : ""}`}
          onClick={() => setActiveCategory("veg")}
        >
          Vegetables / Lunch
        </button>
        <button
          type="button"
          className={`showcase-tab-btn ${activeCategory === "berries" ? "active" : ""}`}
          onClick={() => setActiveCategory("berries")}
        >
          Berries / Snacks
        </button>
        <button
          type="button"
          className={`showcase-tab-btn ${activeCategory === "nuts" ? "active" : ""}`}
          onClick={() => setActiveCategory("nuts")}
        >
          Nuts / Dinner
        </button>
      </div>

      {/* 4 Clean Product Cards */}
      <div className="showcase-cards-grid">
        {filtered.map((item) => (
          <div className="showcase-item-card" key={item.id}>
            <div className="showcase-item-visual">{item.emoji}</div>
            <h3 className="showcase-item-name">{item.title}</h3>
            <div className="showcase-item-meta">{item.calories} • {item.price}</div>
            <button
              type="button"
              className="showcase-item-btn"
              onClick={() => onSelectRecipe(item.recipe)}
            >
              View Recipe
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// Clean & Minimal Footer matching Reference Site
function InstitutionalFooter({ onNavigateSection }) {
  return (
    <footer className="institutional-footer" id="footer-trust" aria-label="Footer">
      <div className="footer-brand-title">
        <span>🥗 Smart Nutrition</span>
      </div>

      <nav className="footer-simple-links" aria-label="Footer Navigation">
        <button type="button" onClick={() => onNavigateSection("hero")}>Home</button>
        <button type="button" onClick={() => onNavigateSection("methodology")}>About</button>
        <button type="button" onClick={() => onNavigateSection("macro-matrix")}>Recipes</button>
        <button type="button" onClick={() => onNavigateSection("protocol-engine")}>Create Plan</button>
      </nav>

      <div className="footer-copyright">
        © 2026 Smart Nutrition. All rights reserved.
      </div>
    </footer>
  );
}

// Main Root Application
function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("smart_nutrition_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "male",
    height_cm: "",
    weight_kg: "",
    activity: "medium",
    goal: "maintain",
    diet: "indian vegetarian",
    allergies: "",
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingType, setGeneratingType] = useState("1day"); // "1day" | "7day"
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Add your profile details to create a personalized, goal-based nutrition plan.");
  const [selectedArchetype, setSelectedArchetype] = useState("balanced");
  const [previewRecipe, setPreviewRecipe] = useState(null);

  const handleSelectArchetype = (arch) => {
    setSelectedArchetype(arch.id);
    setForm((prev) => ({
      ...prev,
      diet: arch.dietVal,
      goal: arch.goalVal,
    }));
    setStatusMessage(`Calibrated to ${arch.name} (${arch.macroSplit}). Ready to generate plan.`);
  };

  const handleNavigateSection = (sectionId) => {
    const el = document.getElementById(sectionId) || (sectionId === "hero" ? document.querySelector(".hero-section") : null);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("smart_nutrition_theme", next);
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      age: "",
      sex: "male",
      height_cm: "",
      weight_kg: "",
      activity: "medium",
      goal: "maintain",
      diet: "indian vegetarian",
      allergies: "",
    });
    setMealPlan(null);
    setStatusMessage("Form cleared. Start again with your latest profile details.");
  };

  const loadDemoProfile = () => {
    setForm({
      name: "Aarav Sharma",
      age: "28",
      sex: "male",
      height_cm: "178",
      weight_kg: "74",
      activity: "medium",
      goal: "maintain",
      diet: "indian vegetarian",
      allergies: "nuts",
    });
    setStatusMessage("Demo profile loaded. Generate a meal plan to preview the experience.");
  };

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
    if (statusMessage) {
      setStatusMessage("Add your profile details to create a personalized, goal-based nutrition plan.");
    }
  };

  const calculateLiveMetrics = () => {
    const h = parseFloat(form.height_cm);
    const w = parseFloat(form.weight_kg);
    const age = parseInt(form.age);

    if (!h || !w || h <= 0 || w <= 0) return null;

    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    let category = "Healthy Weight";
    let catColor = "#10b981"; // emerald

    if (bmi < 18.5) {
      category = "Underweight";
      catColor = "#fbbf24";
    } else if (bmi >= 25 && bmi < 29.9) {
      category = "Overweight";
      catColor = "#f97316";
    } else if (bmi >= 30) {
      category = "Obese";
      catColor = "#ef4444";
    }

    const waterLiters = (w * 0.035).toFixed(1);

    let bmr = 10 * w + 6.25 * h - 5 * (age || 25);
    bmr += form.sex === "male" ? 5 : -161;
    const actMult = form.activity === "low" ? 1.2 : form.activity === "high" ? 1.725 : 1.45;
    const tdee = Math.round(bmr * actMult);

    return { bmi, category, catColor, waterLiters, tdee };
  };

  const liveMetrics = calculateLiveMetrics();

  const handleGeneratePlan = async (type = "1day") => {
    if (!form.name.trim() || !form.age || !form.height_cm || !form.weight_kg) {
      setStatusMessage("Please complete the required profile details (Name, Age, Height, Weight) before generating your meal plan.");
      return;
    }

    setLoading(true);
    setGeneratingType(type);
    setStatusMessage(type === "7day" ? "Generating full 7-day varied weekly nutrition plan..." : "Building your personalized daily nutrition plan...");

    const payload = {
      ...form,
      name: form.name.trim(),
      age: parseInt(form.age, 10) || 25,
      height_cm: parseFloat(form.height_cm) || 175,
      weight_kg: parseFloat(form.weight_kg) || 70,
      allergies: form.allergies
        ? (Array.isArray(form.allergies) ? form.allergies : form.allergies.split(",").map((a) => a.trim()).filter(Boolean))
        : [],
    };

    let result = null;

    // 1. Try fetching from FastAPI backend server
    try {
      const endpoint = type === "7day" ? `${API_BASE}/generate_weekly_plan` : `${API_BASE}/generate_plan`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        result = await res.json();
      }
    } catch (e) {
      console.log("Backend offline or inaccessible, using built-in client engine:", e);
    }

    // 2. Seamless Client-Side Fallback Engine if backend unavailable
    if (!result || result.error) {
      result = type === "7day"
        ? generateClientWeeklyPlan(payload)
        : generateClientSingleDayPlan(payload);
    }

    if (result && !result.error) {
      setMealPlan(result);
      try {
        const updatedHistory = [result, ...history.filter((h) => h.date !== result.date || h.user_id !== result.user_id)].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("smart_nutrition_history", JSON.stringify(updatedHistory));
      } catch (e) {
        console.error(e);
      }
      setStatusMessage(type === "7day" ? "🎉 Your 7-Day Weekly Nutrition Plan is ready!" : "🎉 Your personalized daily nutrition plan is ready!");
    } else {
      setStatusMessage("Could not generate plan. Please verify your age, height, and weight inputs.");
    }

    setLoading(false);
  };

  const handleSwapMeal = async (idx, mealName, dayName) => {
    const profilePayload = {
      ...form,
      name: form.name.trim() || "User",
      age: parseInt(form.age, 10) || 25,
      height_cm: parseFloat(form.height_cm) || 175,
      weight_kg: parseFloat(form.weight_kg) || 70,
      allergies: form.allergies ? (Array.isArray(form.allergies) ? form.allergies : form.allergies.split(",").map((a) => a.trim()).filter(Boolean)) : [],
    };

    let newMeal = null;

    // Try backend swap
    try {
      const payload = {
        profile: profilePayload,
        meal_index: idx,
        meal_name: mealName,
      };

      const res = await fetch(`${API_BASE}/swap_meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        newMeal = await res.json();
      }
    } catch (e) {
      console.log("Using client swap fallback:", e);
    }

    // Client fallback swap
    if (!newMeal || newMeal.error) {
      newMeal = generateClientMealSwap(profilePayload, idx, mealName);
    }

    if (newMeal && !newMeal.error) {
      setMealPlan((prev) => {
        if (!prev) return prev;
        if (prev.is_weekly && prev.days && dayName && prev.days[dayName]) {
          const updatedDays = { ...prev.days };
          const dayMeals = [...updatedDays[dayName].meals];
          dayMeals[idx] = newMeal;
          updatedDays[dayName] = { ...updatedDays[dayName], meals: dayMeals };
          return { ...prev, days: updatedDays };
        } else {
          const newMeals = [...prev.meals];
          newMeals[idx] = newMeal;
          return { ...prev, meals: newMeals };
        }
      });
      setStatusMessage(`🔄 Swapped meal to: ${newMeal.name}`);
    }
  };

  return (
    <div className={`app theme-${theme}`}>
      <div className="container">
        {/* Clean Topbar */}
        <div className="clinical-topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <span>📞 +1 (234) 567 89 00</span>
              <span>📍 Free Public Nutrition Engine</span>
            </div>
            <div className="topbar-right">
              <span className="topbar-badge">⚡ 100% Free Public Utility</span>
            </div>
          </div>
        </div>

        {/* Clean Global Header */}
        <header className="global-header">
          <div className="header-inner">
            <div
              className="brand-logo-group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="brand-icon-wrapper">🥗</div>
              <div className="brand-title">
                Smart<span>Nutrition</span>
              </div>
            </div>

            <ul className="nav-links-list">
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => {
                    const el = document.getElementById("methodology");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => {
                    const el = document.getElementById("protocol-engine");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Protocol Engine
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => {
                    const el = document.getElementById("macro-matrix");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Recipes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => {
                    const el = document.getElementById("how-it-works");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Weekly Plan
                </button>
              </li>
            </ul>

            <div className="nav-action-matrix">
              <button
                className="theme-toggle-btn"
                type="button"
                onClick={toggleTheme}
                title="Toggle Light/Dark Theme"
              >
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
              </button>

              <button
                type="button"
                className="btn-primary-blueprint"
                onClick={() => {
                  const el = document.getElementById("protocol-engine");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Create Plan →
              </button>
            </div>
          </div>
        </header>

        {/* ZONE 2: Hero Section matching Screenshot 1 */}
        <HeroSection
          onStartAssessment={() => {
            const el = document.getElementById("protocol-engine");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              const nameInput = el.querySelector('input[name="name"]');
              if (nameInput) nameInput.focus();
            }
          }}
          onExploreDemo={() => {
            loadDemoProfile();
            handleGeneratePlan("1day");
          }}
        />

        {/* ZONE 3: Horizontal Round Category Icons matching Screenshot 2 */}
        <DietaryArchetypeStrip
          selectedArchetype={selectedArchetype}
          onSelectArchetype={handleSelectArchetype}
        />

        {/* ZONE 4: Split About Section matching Screenshot 2 */}
        <EvidenceSection />

        {/* ZONE 5: 3-Step Process & Split Promo Cards matching Screenshot 3 */}
        <StepsSection
          onStep1Click={() => {
            const el = document.getElementById("protocol-engine");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              const nameInput = el.querySelector('input[name="name"]');
              if (nameInput) nameInput.focus();
            }
          }}
        />

        {/* ZONE 6: Tabbed Showcase Grid matching Screenshot 4 */}
        <ProtocolMatrixShowcase
          onSelectRecipe={(recipe) => setPreviewRecipe(recipe)}
        />

        {/* ZONE 7: Interactive Nutrition Protocol Generator Form & Results */}
        <section id="protocol-engine" className="generator-section">
          {/* Header Bar with Title and Quick Actions */}
          <div className="generator-header-bar">
            <div className="generator-title-group">
              <span className="generator-eyebrow">Personalized Nutrition Engine</span>
              <h2 className="generator-main-title">Calculate Your Custom Diet Plan</h2>
              <p className="generator-subtitle">
                Enter your biometric parameters below to dynamically compute your BMR, TDEE, macronutrient distribution, and recipes.
              </p>
            </div>

            <div className="generator-actions">
              <button className="btn-demo-quick" type="button" onClick={loadDemoProfile}>
                <span>⚡</span> Fill Demo Profile
              </button>
              <button className="btn-reset-quick" type="button" onClick={resetForm}>
                <span>↺</span> Reset
              </button>
            </div>
          </div>

          {/* Live Status Banner */}
          {statusMessage && (
            <div className="status-banner" aria-live="polite">
              <span>💡</span> {statusMessage}
            </div>
          )}

          {/* History Slide-out Drawer */}
          {showHistory && (
            <div className="history-drawer">
              <div className="history-header">
                <h3>📜 Saved Nutrition Plans</h3>
                <button className="close-btn" type="button" onClick={() => setShowHistory(false)}>✕</button>
              </div>
              {history.length === 0 ? (
                <p className="no-history">No saved plans yet. Generate your first plan!</p>
              ) : (
                <div className="history-list">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      className="history-item"
                      onClick={() => {
                        setMealPlan(h);
                        setShowHistory(false);
                      }}
                    >
                      <div>
                        <strong>{h.user_id}</strong>
                        <span className="history-date">{h.is_weekly ? "📅 7-Day Plan" : "🍽️ 1-Day Plan"} • {h.date}</span>
                      </div>
                      <span className="history-cal">{h.target_calories} kcal</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Input Form */}
          <form
            className="floating-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleGeneratePlan("1day");
            }}
          >
            <div className="field">
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Full Name (e.g. Aarav Sharma)"
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
                  max={120}
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
                <select name="activity" value={form.activity} onChange={handleChange}>
                  <option value="low">Low (Sedentary / Desk Job)</option>
                  <option value="medium">Moderate (3-4 workouts/wk)</option>
                  <option value="high">High (Athletic / Daily Heavy)</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Height (cm)</label>
                <input
                  name="height_cm"
                  type="number"
                  min={50}
                  max={250}
                  placeholder="Height in cm"
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
                  min={20}
                  max={300}
                  placeholder="Weight in kg"
                  value={form.weight_kg}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Fitness Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange}>
                  <option value="weight_loss">🔥 Weight Loss (Caloric Deficit)</option>
                  <option value="muscle_gain">💪 Muscle Gain (Lean Surplus)</option>
                  <option value="maintain">⚖️ Weight Maintenance</option>
                </select>
              </div>
            </div>

            {/* Live Health Metrics Preview Bar */}
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
                  <span className="stat-title">Est. Maintenance (TDEE)</span>
                  <span className="stat-val">{liveMetrics.tdee} kcal</span>
                </div>
                <div className="health-stat">
                  <span className="stat-title">Daily Hydration Baseline</span>
                  <span className="stat-val">💧 {liveMetrics.waterLiters} Liters</span>
                </div>
              </div>
            )}

            <div className="field-row">
              <div className="field flex-2">
                <label>Diet Preference</label>
                <select name="diet" value={form.diet} onChange={handleChange}>
                  <option value="indian vegetarian">Indian Vegetarian</option>
                  <option value="indian vegan">Indian Vegan (Dairy-Free)</option>
                  <option value="indian eggetarian">Eggetarian</option>
                  <option value="indian non-vegetarian">Indian Non-Vegetarian</option>
                  <option value="balanced">Balanced (Global Veg + Non-Veg)</option>
                </select>
              </div>
              <div className="field flex-2">
                <label>Allergies & Exclusions</label>
                <input
                  name="allergies"
                  placeholder="Allergies (e.g. milk, peanuts, shellfish)"
                  value={form.allergies}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="btn-actions-row">
              <button
                className="generate-btn"
                type="submit"
                disabled={loading}
              >
                {loading && generatingType === "1day" ? (
                  <>
                    <span className="spinner"></span>
                    <span>Generating Daily Plan...</span>
                  </>
                ) : (
                  "Generate 1-Day Plan ✨"
                )}
              </button>

              <button
                className="generate-btn weekly-btn"
                type="button"
                disabled={loading}
                onClick={() => handleGeneratePlan("7day")}
              >
                {loading && generatingType === "7day" ? (
                  <>
                    <span className="spinner"></span>
                    <span>Building 7-Day Plan...</span>
                  </>
                ) : (
                  "Generate 7-Day Weekly Plan 📅"
                )}
              </button>
            </div>
          </form>

          {/* Daily Hydration Tracker Component */}
          <WaterTracker weight_kg={form.weight_kg || 70} />

          {/* Results Card */}
          {mealPlan ? (
            <MealPlanDisplay plan={mealPlan} onSwapMeal={handleSwapMeal} profile={form} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h2>Smart Nutrition Tailored Specifically for You</h2>
              <p>
                Enter your details above to generate an intelligent daily or 7-day weekly meal routine with macro distributions, recipe cooking instructions, and categorized shopping lists.
              </p>
              <div className="empty-features">
                <div className="feature-card">
                  <span>📅</span>
                  <h3>7-Day Weekly Planner</h3>
                  <p>Varied daily recipes from Monday to Sunday matching your exact caloric target.</p>
                </div>
                <div className="feature-card">
                  <span>📊</span>
                  <h3>Visual Macro Donut Charts</h3>
                  <p>Clear circular breakdown of Protein, Carbs, and Fats with caloric indicators.</p>
                </div>
                <div className="feature-card">
                  <span>👨‍🍳</span>
                  <h3>Step-by-Step Cooking Steps</h3>
                  <p>Prep time, cook time, and concise instructions for every meal.</p>
                </div>
                <div className="feature-card">
                  <span>💧</span>
                  <h3>Dynamic Water Tracker</h3>
                  <p>Personalized hydration goal with real-time logging and animated water glass.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ZONE 8: Institutional Footer */}
        <InstitutionalFooter
          onNavigateSection={handleNavigateSection}
        />

        {/* Showcase Recipe Modal Preview */}
        {previewRecipe && (
          <RecipeModal
            meal={previewRecipe}
            onClose={() => setPreviewRecipe(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
