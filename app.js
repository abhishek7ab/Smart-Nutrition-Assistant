import React, { useState, useEffect } from "react";
import "./app.css";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000"
  : "/api";

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
      showToast("🎉 Awesome job! You've reached your daily hydration goal!");
    } else if (delta > 0) {
      showToast(`💧 Added +${delta}ml of water`);
    }
  };

  const resetWater = () => {
    setDrankMl(0);
    try {
      localStorage.setItem(todayKey, "0");
    } catch (e) {
      console.error(e);
    }
    showToast("Water tracker reset for today.");
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const pct = Math.min(100, Math.round((drankMl / targetMl) * 100));

  return (
    <div className="water-tracker-card">
      <div className="water-header">
        <div className="water-title-wrap">
          <span className="water-icon">💧</span>
          <div>
            <h3>Daily Hydration Tracker</h3>
            <p className="water-subtitle">Target: <b>{targetLiters} L ({targetMl} ml)</b> based on your weight</p>
          </div>
        </div>
        <span className={`water-pct-badge ${pct >= 100 ? "complete" : ""}`}>
          {pct}% Goal
        </span>
      </div>

      <div className="water-body">
        {/* Animated Cup */}
        <div className="cup-container">
          <div className="glass-cup">
            <div className="water-fill" style={{ height: `${pct}%` }}>
              <div className="water-wave"></div>
            </div>
            <div className="cup-label">{drankMl} ml</div>
          </div>
        </div>

        <div className="water-controls">
          <div className="water-progress-text">
            <span>Logged: <b>{(drankMl / 1000).toFixed(2)} L</b></span>
            <span>Remaining: <b>{Math.max(0, (targetMl - drankMl) / 1000).toFixed(2)} L</b></span>
          </div>

          <div className="water-btn-group">
            <button className="water-btn" type="button" onClick={() => updateWater(250)}>
              +250 ml (Glass)
            </button>
            <button className="water-btn highlight" type="button" onClick={() => updateWater(500)}>
              +500 ml (Bottle)
            </button>
            <button className="water-btn ghost" type="button" onClick={resetWater} title="Reset">
              ↺ Reset
            </button>
          </div>

          {toastMessage && <div className="water-toast">{toastMessage}</div>}
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

// Floating AI Nutritionist Chat Component
function NutritionistChat({ profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI Nutritionist. Ask me about pre-workout meals, ingredient replacements, hydration, or supplement advice!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Pre-workout snack ideas",
    "Post-workout recovery",
    "How much water do I need?",
    "Healthy late-night snacks",
    "Creatine & supplement guide"
  ];

  const sendMessage = async (customText) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    const userMessage = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputMsg("");
    setIsTyping(true);

    try {
      const payload = {
        message: textToSend,
        profile: {
          name: profile.name || "User",
          age: parseInt(profile.age) || 25,
          sex: profile.sex || "male",
          height_cm: parseFloat(profile.height_cm) || 175,
          weight_kg: parseFloat(profile.weight_kg) || 70,
          goal: profile.goal || "maintain",
          diet: profile.diet || "indian vegetarian",
          activity: profile.activity || "medium",
          allergies: profile.allergies ? profile.allergies.split(",").map(a => a.trim()).filter(Boolean) : []
        }
      };

      const res = await fetch(`${API_BASE}/chat_nutritionist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Chat service unavailable");
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ I'm temporarily unable to connect to the nutrition AI engine. Stay hydrated and stick to your whole-food targets!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="floating-chat-container">
      {!isOpen && (
        <button className="chat-bubble-btn" type="button" onClick={() => setIsOpen(true)}>
          <span className="bubble-icon">💬</span>
          <span className="bubble-label">Ask AI Nutritionist</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="bot-avatar">🤖</span>
              <div>
                <h4>Smart AI Nutritionist</h4>
                <span className="online-indicator">● Active Coach</span>
              </div>
            </div>
            <button className="close-btn" type="button" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                <div className="message-bubble">{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <div className="message-bubble typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="quick-chips">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                className="chip-btn"
                type="button"
                onClick={() => sendMessage(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <form
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about nutrition..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!inputMsg.trim() || isTyping}>
              ➤
            </button>
          </form>
        </div>
      )}
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
            {currentMeals.map((meal, idx) => (
              <div className="meal-item" key={idx}>
                <div className="meal-header">
                  <div className="meal-title-group">
                    <span className="meal-emoji">{getMealIcon(meal.name)}</span>
                    <div>
                      <h3 className="meal-title">{meal.name}</h3>
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
                        <p className="reason-text">
                          {typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}
                        </p>
                      </div>
                    )}

                    {meal.macros && (
                      <div className="meal-mini-macros">
                        <span>🍗 Protein: <b>{meal.macros.protein_g}g</b></span>
                        <span>🌾 Carbs: <b>{meal.macros.carbs_g}g</b></span>
                        <span>🥑 Fats: <b>{meal.macros.fats_g}g</b></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
      setStatusMessage("Please complete the required profile details before generating your meal plan.");
      return;
    }

    setLoading(true);
    setGeneratingType(type);
    setStatusMessage(type === "7day" ? "Generating full 7-day varied weekly nutrition plan..." : "Building your personalized daily nutrition plan...");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        age: parseInt(form.age) || 25,
        height_cm: parseFloat(form.height_cm) || 175,
        weight_kg: parseFloat(form.weight_kg) || 70,
        allergies: form.allergies
          ? form.allergies.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };

      const endpoint = type === "7day" ? `${API_BASE}/generate_weekly_plan` : `${API_BASE}/generate_plan`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`The nutrition service returned ${res.status}.`);

      const result = await res.json();
      setMealPlan(result);

      if (result && !result.error) {
        const updatedHistory = [result, ...history.filter((h) => h.date !== result.date || h.user_id !== result.user_id)].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("smart_nutrition_history", JSON.stringify(updatedHistory));
        setStatusMessage(type === "7day" ? "Your 7-Day Weekly Nutrition Plan is ready!" : "Your personalized nutrition plan is ready!");
      } else {
        setStatusMessage("The plan could not be generated. Please check your inputs.");
      }
    } catch (error) {
      setStatusMessage("We hit a server issue while generating your plan. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapMeal = async (idx, mealName, dayName) => {
    try {
      const payload = {
        profile: {
          ...form,
          age: parseInt(form.age) || 25,
          height_cm: parseFloat(form.height_cm) || 175,
          weight_kg: parseFloat(form.weight_kg) || 70,
          allergies: form.allergies ? form.allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
        },
        meal_index: idx,
        meal_name: mealName,
      };

      const res = await fetch(`${API_BASE}/swap_meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`The meal swap service returned ${res.status}.`);
      const newMeal = await res.json();

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
      }
    } catch (error) {
      setStatusMessage(error.message || "Unable to swap this meal right now.");
    }
  };

  return (
    <div className={`app theme-${theme}`}>
      <div className="container">
        {/* Top Header */}
        <div className="top-header">
          <div>
            <h1>🥗 Smart Nutrition Assistant</h1>
            <div className="subtitle">
              Personalized AI Weekly Meal Plans • Macro Charts • Hydration Tracker
            </div>
          </div>
          <div className="header-actions">
            <button className="theme-toggle-btn" type="button" onClick={toggleTheme} title="Toggle Theme">
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button className="history-btn" type="button" onClick={() => setShowHistory(!showHistory)}>
              📜 Saved ({history.length})
            </button>
          </div>
        </div>

        {/* Live Status Banner */}
        <div className="status-banner" aria-live="polite">
          {statusMessage}
        </div>

        <div className="form-toolbar">
          <button className="secondary-btn" type="button" onClick={loadDemoProfile}>Quick Demo Profile</button>
          <button className="secondary-btn ghost" type="button" onClick={resetForm}>Reset Form</button>
        </div>

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

        {/* Floating AI Nutritionist Chatbot */}
        <NutritionistChat profile={form} />
      </div>
    </div>
  );
}

export default App;
