import React, { useState, useEffect, useCallback } from "react";
import "./styles/index.css";
import {
  generateClientSingleDayPlan,
  generateClientWeeklyPlan,
  generateClientMealSwap,
  getAllCatalogMeals
} from "./nutritionEngineClient.js";

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000"
  : `http://${window.location.hostname}:8000`;

// ---------------------------------------------------------------------------
// Small inline icon set (keeps the interface free of emoji clutter)
// ---------------------------------------------------------------------------
const Icon = {
  leaf: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  print: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  droplet: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 2.7 6.8 8.2a7.4 7.4 0 1 0 10.4 0Z" />
    </svg>
  ),
  refresh: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  notebook: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M8 7h8M8 11h8M8 15h5" />
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sun: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// 1. Semi-Circular BMI Speedometer Gauge Visualizer
// ---------------------------------------------------------------------------
function BmiGaugeVisualizer({ bmi, category, catColor, tdee, waterLiters }) {
  const numericBmi = parseFloat(bmi) || 22.0;
  // Map BMI 15 -> -90 deg (left), 40 -> +90 deg (right)
  const clamped = Math.min(40, Math.max(15, numericBmi));
  const angle = ((clamped - 15) / (40 - 15)) * 180 - 90; // -90deg to +90deg

  return (
    <div className="bmi-gauge-card">
      <div className="bmi-gauge-header">
        <span className="bmi-gauge-title">Live estimate</span>
        <span className="bmi-cat-sub">{category}</span>
      </div>

      <div className="bmi-gauge-body">
        <div className="bmi-gauge-svg-wrap">
          <svg className="bmi-gauge-svg" viewBox="0 0 180 100" role="img" aria-label={`BMI ${numericBmi}, ${category}`}>
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b8862e" />
                <stop offset="35%" stopColor="#2e8b4f" />
                <stop offset="70%" stopColor="#b8862e" />
                <stop offset="100%" stopColor="#b4443a" />
              </linearGradient>
            </defs>
            <path
              d="M 15 90 A 75 75 0 0 1 165 90"
              fill="none"
              stroke="var(--data-track)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 15 90 A 75 75 0 0 1 165 90"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.85"
            />
            <g className="bmi-needle" transform={`rotate(${angle}, 90, 90)`} style={{ transformOrigin: "90px 90px" }}>
              <line x1="90" y1="90" x2="90" y2="32" stroke="var(--text-main)" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle cx="90" cy="90" r="5" fill="var(--text-main)" />
          </svg>

          <div className="bmi-readout-center">
            <span className="bmi-val-big">{numericBmi}</span>
            <span className="bmi-readout-unit">BMI index</span>
          </div>
        </div>

        <div className="energy-flow-visualizer">
          <div className="energy-flow-step">
            <span className="step-lbl">Est. maintenance</span>
            <span className="step-val">{tdee ? `${tdee} kcal` : "—"}</span>
          </div>
          <div className="energy-flow-step">
            <span className="step-lbl">Daily hydration</span>
            <span className="step-val">{waterLiters ? `${waterLiters} L` : "—"}</span>
          </div>
        </div>
      </div>

      <div className="bmi-gauge-legend">
        <span><i className="bmi-dot" style={{ background: "#b8862e" }} /> Under 18.5</span>
        <span><i className="bmi-dot" style={{ background: "#2e8b4f" }} /> 18.5–24.9 Healthy</span>
        <span><i className="bmi-dot" style={{ background: "#c99a3a" }} /> 25–29.9 Over</span>
        <span><i className="bmi-dot" style={{ background: "#b4443a" }} /> 30+ Obese</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Upgraded Interactive SVG Macro Donut & Per-Meal Budget Visualizer
// ---------------------------------------------------------------------------
function MacroDonutChart({ protein_g, carbs_g, fats_g, target_calories, meals = [] }) {
  const [hoveredMacro, setHoveredMacro] = useState(null); // 'p' | 'c' | 'f' | null

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

  // Active Center readout based on hover
  let centerNumber = target_calories;
  let centerUnit = "kcal / day";
  if (hoveredMacro === "p") {
    centerNumber = `${p}g`;
    centerUnit = `Protein (${pCal} kcal)`;
  } else if (hoveredMacro === "c") {
    centerNumber = `${c}g`;
    centerUnit = `Carbs (${cCal} kcal)`;
  } else if (hoveredMacro === "f") {
    centerNumber = `${f}g`;
    centerUnit = `Fats (${fCal} kcal)`;
  }

  // Calculate per-meal calorie shares
  const mealColors = ["#2e8b4f", "#b8862e", "#6b5ca5", "#2b6cb0"];
  const validMeals = meals && meals.length > 0 ? meals : [];
  const mealsTotal = validMeals.reduce((acc, m) => acc + (m.approx_calories || 0), 0) || 1;

  return (
    <div className="macro-chart-wrapper" style={{ flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", flexWrap: "wrap" }}>
        <div className="donut-chart-box macro-donut-interactive">
          <svg className="donut-svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" className="donut-bg" />
            {/* Protein Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              className={`donut-segment segment-protein ${hoveredMacro === "p" ? "active-hover" : ""}`}
              strokeDasharray={`${pStroke} ${perimeter}`}
              strokeDashoffset={pOffset}
              onMouseEnter={() => setHoveredMacro("p")}
              onMouseLeave={() => setHoveredMacro(null)}
            />
            {/* Carbs Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              className={`donut-segment segment-carbs ${hoveredMacro === "c" ? "active-hover" : ""}`}
              strokeDasharray={`${cStroke} ${perimeter}`}
              strokeDashoffset={cOffset}
              onMouseEnter={() => setHoveredMacro("c")}
              onMouseLeave={() => setHoveredMacro(null)}
            />
            {/* Fats Segment */}
            <circle
              cx="50"
              cy="50"
              r="38"
              className={`donut-segment segment-fats ${hoveredMacro === "f" ? "active-hover" : ""}`}
              strokeDasharray={`${fStroke} ${perimeter}`}
              strokeDashoffset={fOffset}
              onMouseEnter={() => setHoveredMacro("f")}
              onMouseLeave={() => setHoveredMacro(null)}
            />
          </svg>
          <div className="donut-center-text">
            <span className="center-cal-number">{centerNumber}</span>
            <span className="center-cal-unit">{centerUnit}</span>
          </div>
        </div>

        <div className="macro-breakdown-details">
          <div
            className={`macro-detail-pill protein-pill ${hoveredMacro === "p" ? "active" : ""}`}
            onMouseEnter={() => setHoveredMacro("p")}
            onMouseLeave={() => setHoveredMacro(null)}
          >
            <div className="pill-dot"></div>
            <div className="pill-info">
              <span className="pill-title">Protein ({pPct}%)</span>
              <strong>{p}g</strong>
            </div>
          </div>
          <div
            className={`macro-detail-pill carbs-pill ${hoveredMacro === "c" ? "active" : ""}`}
            onMouseEnter={() => setHoveredMacro("c")}
            onMouseLeave={() => setHoveredMacro(null)}
          >
            <div className="pill-dot"></div>
            <div className="pill-info">
              <span className="pill-title">Carbohydrates ({cPct}%)</span>
              <strong>{c}g</strong>
            </div>
          </div>
          <div
            className={`macro-detail-pill fats-pill ${hoveredMacro === "f" ? "active" : ""}`}
            onMouseEnter={() => setHoveredMacro("f")}
            onMouseLeave={() => setHoveredMacro(null)}
          >
            <div className="pill-dot"></div>
            <div className="pill-info">
              <span className="pill-title">Healthy Fats ({fPct}%)</span>
              <strong>{f}g</strong>
            </div>
          </div>
        </div>
      </div>

      {validMeals.length > 0 && (
        <div className="per-meal-budget-section">
          <div className="per-meal-budget-header">
            <span>Calorie Budget by Meal</span>
            <span>{target_calories} kcal target</span>
          </div>
          <div className="per-meal-budget-bar">
            {validMeals.map((m, i) => {
              const share = Math.max(5, Math.round(((m.approx_calories || 0) / mealsTotal) * 100));
              return (
                <div
                  key={i}
                  className="meal-budget-segment"
                  style={{
                    flexGrow: share,
                    background: mealColors[i % mealColors.length],
                  }}
                  title={`${m.name}: ${m.approx_calories} kcal (${share}%)`}
                />
              );
            })}
          </div>
          <div className="per-meal-budget-legend">
            {validMeals.map((m, i) => (
              <div key={i} className="meal-budget-item">
                <span
                  className="meal-budget-dot"
                  style={{ background: mealColors[i % mealColors.length] }}
                />
                <span>
                  {(m.name || "").replace(/^(breakfast|lunch|dinner|snack)[:\s-]*/i, "").slice(0, 16)} ({m.approx_calories} kcal)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. 7-Day Weekly Calorie & Macro Trend Bar Chart
// ---------------------------------------------------------------------------
function WeeklyTrendVisualizer({ days, selectedDay, onSelectDay }) {
  if (!days) return null;
  const dayNames = Object.keys(days);
  if (dayNames.length === 0) return null;

  const dayCalories = dayNames.map(
    (day) => days[day]?.actual_calories || days[day]?.target_calories || 2000
  );
  const maxCal = Math.max(...dayCalories, 1);

  return (
    <div className="weekly-trend-chart-card">
      <div className="weekly-trend-header">
        <span className="weekly-trend-title">7-day calorie overview</span>
        <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
          Select a day to view its meals
        </span>
      </div>

      <div className="weekly-trend-bars-container">
        {dayNames.map((day) => {
          const cal = days[day]?.actual_calories || days[day]?.target_calories || 2000;
          const heightPct = Math.max(30, Math.round((cal / maxCal) * 100));
          const isActive = selectedDay === day;

          return (
            <button
              key={day}
              type="button"
              className={`weekly-day-bar-column ${isActive ? "active" : ""}`}
              onClick={() => onSelectDay(day)}
              title={`${day}: ${cal} kcal`}
            >
              <span className="weekly-bar-cal-label">{cal}</span>
              <div
                className="weekly-bar-pill"
                style={{ height: `${heightPct}%` }}
              />
            </button>
          );
        })}
      </div>

      <div className="weekly-day-labels-row">
        {dayNames.map((day) => (
          <span
            key={day}
            className={`weekly-day-name-tag ${selectedDay === day ? "active" : ""}`}
          >
            {day.slice(0, 3)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Chrono-Nutrition & Fasting Window Timeline
// ---------------------------------------------------------------------------
function MealTimelineVisualizer({ meals = [] }) {
  const defaultSlots = [
    { slot: "Breakfast", time: "08:30 AM", minutes: 510 },
    { slot: "Lunch", time: "01:15 PM", minutes: 795 },
    { slot: "Snack", time: "04:45 PM", minutes: 1005 },
    { slot: "Dinner", time: "07:45 PM", minutes: 1185 },
  ];

  const items = meals.length > 0
    ? meals
        .map((m, i) => {
          const lower = (m.name || "").toLowerCase();
          let entry = defaultSlots[i] || { slot: `Meal ${i + 1}`, time: "12:00 PM", minutes: 720 };

          if (lower.includes("breakfast")) entry = defaultSlots[0];
          else if (lower.includes("lunch")) entry = defaultSlots[1];
          else if (lower.includes("snack")) entry = defaultSlots[2];
          else if (lower.includes("dinner")) entry = defaultSlots[3];

          return { ...entry, name: m.name };
        })
        .sort((a, b) => a.minutes - b.minutes)
    : [];

  if (items.length === 0) return null;

  return (
    <div className="chrono-timeline-card">
      <div className="chrono-timeline-header">
        <span className="chrono-title">Meal timing</span>
        <span className="fasting-badge">About 13 hours overnight</span>
      </div>

      <div className="chrono-track-wrap">
        <div className="chrono-track-line" />
        {items.map((it, idx) => (
          <div key={idx} className="chrono-milestone">
            <span className="chrono-node" />
            <span className="chrono-time">{it.time}</span>
            <span className="chrono-slot-name">{it.slot}</span>
          </div>
        ))}
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

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  }, []);

  const updateWater = useCallback((delta) => {
    setDrankMl((prev) => {
      const updated = Math.max(0, prev + delta);
      try {
        localStorage.setItem(todayKey, updated.toString());
      } catch (e) {
        console.error(e);
      }
      if (updated >= targetMl && prev < targetMl) {
        showToast("Daily hydration goal reached.");
      } else if (delta > 0) {
        showToast(`Logged ${delta} ml`);
      }
      return updated;
    });
  }, [todayKey, targetMl, showToast]);

  const resetWater = useCallback(() => {
    setDrankMl(0);
    try {
      localStorage.setItem(todayKey, "0");
    } catch (e) {
      console.error(e);
    }
    showToast("Tracker reset for today.");
  }, [todayKey, showToast]);

  const pct = Math.min(100, Math.round((drankMl / targetMl) * 100));
  const loggedL = (drankMl / 1000).toFixed(2);
  const remainingL = Math.max(0, (targetMl - drankMl) / 1000).toFixed(2);

  return (
    <div className="water-tracker-card" aria-label="Daily Hydration Tracker">
      {/* Header */}
      <div className="water-header">
        <div className="water-title-wrap">
          <div className="water-icon-circle"><Icon.droplet /></div>
          <div>
            <h3>Daily hydration</h3>
            <p className="water-subtitle">A simple fluid goal based on your body weight</p>
          </div>
        </div>
        <span className={`water-pct-badge ${pct >= 100 ? "complete" : ""}`}>
          {pct}% of goal
        </span>
      </div>

      {/* Progress + quick log */}
      <div className="water-dashboard-layout">
        <div className="water-stats-col">
          <div className="water-metrics-tiles">
            <div className="water-metric-box">
              <span className="water-metric-lbl">Target</span>
              <span className="water-metric-val">{targetLiters} L</span>
            </div>
            <div className="water-metric-box active-log">
              <span className="water-metric-lbl">Logged</span>
              <span className="water-metric-val">{loggedL} L</span>
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

        <div className="water-actions-col">
          <div className="water-btn-grid">
            <button className="water-quick-btn" type="button" onClick={() => updateWater(250)}>
              +250 ml
            </button>
            <button className="water-quick-btn primary-add" type="button" onClick={() => updateWater(500)}>
              +500 ml
            </button>
            <button className="water-quick-btn" type="button" onClick={() => updateWater(750)}>
              +750 ml
            </button>
            <button className="water-quick-btn" type="button" onClick={() => updateWater(1000)}>
              +1 L
            </button>
          </div>

          <div className="water-reset-row">
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Quick add</span>
            <button className="water-reset-btn" type="button" onClick={resetWater}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fullscreen Distraction-Free Kitchen Cooking Mode with Timers
// ---------------------------------------------------------------------------
function KitchenCookingMode({ meal, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);

  const instructions = meal.instructions && meal.instructions.length > 0
    ? meal.instructions
    : [
        "Prepare and wash all fresh whole-food ingredients thoroughly.",
        "Cook over gentle heat with minimal cold-pressed oil or ghee until tender and aromatic.",
        "Plate fresh and garnish with garden herbs."
      ];

  const totalSteps = instructions.length;

  // Escape key closes cooking mode, arrow keys navigate
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
      if (e.key === "ArrowLeft" && currentStep > 0) setCurrentStep((s) => s - 1);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [currentStep, totalSteps, onClose]);

  // Web Audio chime for timer expiry
  const playTimerChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
    } catch {}
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      setTimerEnded(true);
      playTimerChime();
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          setTimerEnded(true);
          playTimerChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, playTimerChime]);

  const startTimer = (secs) => {
    setTimerSeconds(secs);
    setTimerRunning(true);
    setTimerEnded(false);
  };

  const toggleTimer = () => {
    if (timerSeconds === 0) {
      startTimer(300);
    } else {
      setTimerRunning((r) => !r);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
    setTimerEnded(false);
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const ingredientsList = meal.ingredients || [];
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const progressPct = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="kitchen-overlay" role="dialog" aria-modal="true" aria-label="Kitchen Cooking Mode">
      <header className="kitchen-header">
        <div className="kitchen-title-box">
          <span className="kitchen-badge">🍳 Interactive Kitchen Mode</span>
          <h1 className="kitchen-recipe-title">{meal.name}</h1>
        </div>
        <div className="kitchen-header-actions">
          <button className="btn-exit-kitchen" type="button" onClick={onClose}>
            ✕ Exit Cooking Mode
          </button>
        </div>
      </header>

      <div className="kitchen-progress-track">
        <div className="kitchen-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <main className="kitchen-body">
        {/* Left Column: Prep Checklist */}
        <aside className="kitchen-ingredients-panel">
          <div className="kitchen-panel-header">
            <h2 className="kitchen-panel-title">Mise en place</h2>
            <span className="kitchen-ingr-count">{checkedCount} of {ingredientsList.length} ready</span>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--text-light)", margin: "0" }}>
            Tap ingredients as you prep or add them to the pan:
          </p>
          <ul className="kitchen-checklist">
            {ingredientsList.map((ing, i) => {
              const text = typeof ing === "object" ? (ing.name || ing.item || JSON.stringify(ing)) : String(ing);
              const isChecked = !!checkedIngredients[i];
              return (
                <li
                  key={i}
                  className={`kitchen-check-item ${isChecked ? "checked" : ""}`}
                  onClick={() => toggleIngredient(i)}
                  role="checkbox"
                  aria-checked={isChecked}
                  tabIndex={0}
                >
                  <div className="kitchen-check-box">
                    {isChecked && "✓"}
                  </div>
                  <span className="kitchen-check-text">{text}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right Column: Step and Timer */}
        <section className="kitchen-step-panel">
          <div className="kitchen-step-card">
            <div className="kitchen-step-meta">
              <span className="kitchen-step-number-tag">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="kitchen-step-dots">
                {instructions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`kitchen-step-dot ${idx === currentStep ? "active" : idx < currentStep ? "completed" : ""}`}
                    onClick={() => setCurrentStep(idx)}
                    style={{ cursor: "pointer" }}
                    title={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <p className="kitchen-step-instruction">
              {instructions[currentStep]}
            </p>

            {/* Interactive Kitchen Timer Module */}
            <div className="kitchen-timer-module">
              <div className="kitchen-timer-left">
                <div className="kitchen-timer-icon-wrap">
                  <Icon.refresh style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <div className={`kitchen-timer-display ${timerRunning ? "running" : timerEnded ? "ended" : ""}`}>
                    {timerEnded ? "00:00 — Ready!" : formatTimer(timerSeconds)}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "2px" }}>
                    Kitchen Timer
                  </div>
                </div>
              </div>

              <div className="kitchen-timer-presets">
                <button type="button" className="timer-preset-btn" onClick={() => startTimer(60)}>+1m</button>
                <button type="button" className="timer-preset-btn" onClick={() => startTimer(300)}>+5m</button>
                <button type="button" className="timer-preset-btn" onClick={() => startTimer(600)}>+10m</button>
                <button type="button" className="timer-preset-btn" onClick={() => startTimer(900)}>+15m</button>
              </div>

              <div className="kitchen-timer-controls">
                <button type="button" className="btn-timer-primary" onClick={toggleTimer}>
                  {timerRunning ? "Pause" : timerSeconds > 0 ? "Resume" : "Start 5m"}
                </button>
                {timerSeconds > 0 && (
                  <button type="button" className="btn-timer-reset" onClick={resetTimer}>Reset</button>
                )}
              </div>
            </div>
          </div>

          {/* Step Navigation Bar */}
          <footer className="kitchen-nav-bar">
            <button
              type="button"
              className="btn-kitchen-prev"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              ← Previous step
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                type="button"
                className="btn-kitchen-next"
                onClick={() => setCurrentStep((s) => Math.min(totalSteps - 1, s + 1))}
              >
                Next step →
              </button>
            ) : (
              <button
                type="button"
                className="btn-kitchen-done"
                onClick={onClose}
              >
                🎉 Meal complete! Enjoy
              </button>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Printable Fridge-Ready Weekly Plan & Grocery Sheet
// ---------------------------------------------------------------------------
function PrintableFridgeSheet({ plan, profile, onClose }) {
  if (!plan) return null;

  const isWeekly = !!plan.is_weekly && !!plan.days;
  const daysList = isWeekly ? Object.keys(plan.days) : [];
  const grocery = plan.categorized_grocery_list || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fridge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fridge-sheet-container" onClick={(e) => e.stopPropagation()}>
        {/* On-Screen Action Toolbar */}
        <div className="fridge-toolbar">
          <div className="fridge-toolbar-info">
            <Icon.notebook style={{ width: 18, height: 18, color: "var(--accent-green)" }} />
            <span>Fridge-Ready Weekly Sheet (Formatted for Home Printing)</span>
          </div>
          <div className="fridge-toolbar-actions">
            <button className="btn-print-action" type="button" onClick={handlePrint}>
              <Icon.print style={{ width: 16, height: 16 }} /> Print Sheet / Save PDF
            </button>
            <button className="btn-close-fridge" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* The Printable Paper Sheet */}
        <article className="fridge-sheet-paper">
          <header className="fridge-sheet-header">
            <div className="fridge-sheet-brand">
              <h2>Smart Nutrition Assistant</h2>
              <p>Weekly Whole-Food Nourishment Protocol</p>
            </div>
            <div className="fridge-sheet-meta">
              <span className="fridge-meta-user">Prepared for: {plan.user_id || profile?.name || "Client"}</span>
              <span className="fridge-meta-date">Date: {plan.date || new Date().toISOString().split("T")[0]} · Goal: {profile?.goal || "Health & Vitality"}</span>
            </div>
          </header>

          {/* Key Targets Banner */}
          <div className="fridge-summary-strip">
            <div className="fridge-summary-col">
              <span className="fridge-summary-val">{plan.target_calories || 2100}</span>
              <span className="fridge-summary-lbl">Daily kcal Target</span>
            </div>
            <div className="fridge-summary-col">
              <span className="fridge-summary-val">{plan.target_macros?.protein_g || 140}g</span>
              <span className="fridge-summary-lbl">Protein Goal</span>
            </div>
            <div className="fridge-summary-col">
              <span className="fridge-summary-val">{plan.target_macros?.carbs_g || 210}g</span>
              <span className="fridge-summary-lbl">Carbohydrates</span>
            </div>
            <div className="fridge-summary-col">
              <span className="fridge-summary-val">{plan.target_macros?.fats_g || 55}g</span>
              <span className="fridge-summary-lbl">Healthy Fats</span>
            </div>
            <div className="fridge-summary-col">
              <span className="fridge-summary-val">3.0 L</span>
              <span className="fridge-summary-lbl">Water (8 glasses)</span>
            </div>
          </div>

          {/* Weekly 7-Day Table */}
          <h3 className="fridge-section-title">
            <span>7-Day Meal Schedule</span>
            <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#666" }}>Stick on fridge for quick daily reference</span>
          </h3>

          <div className="fridge-table-wrap">
            <table className="fridge-weekly-table">
              <thead>
                <tr>
                  <th style={{ width: "12%" }}>Day</th>
                  <th style={{ width: "22%" }}>Breakfast</th>
                  <th style={{ width: "22%" }}>Lunch</th>
                  <th style={{ width: "22%" }}>Dinner</th>
                  <th style={{ width: "22%" }}>Snack & Fuel</th>
                </tr>
              </thead>
              <tbody>
                {isWeekly ? (
                  daysList.map((dayName) => {
                    const dayPlan = plan.days[dayName];
                    const meals = dayPlan?.meals || [];
                    const b = meals[0] || {};
                    const l = meals[1] || {};
                    const d = meals[2] || {};
                    const s = meals[3] || {};
                    return (
                      <tr key={dayName}>
                        <td className="fridge-day-name">{dayName}</td>
                        <td className="fridge-meal-cell">
                          <strong>{b.name || "—"}</strong>
                          <span>{b.approx_calories ? `${b.approx_calories} kcal` : ""}</span>
                        </td>
                        <td className="fridge-meal-cell">
                          <strong>{l.name || "—"}</strong>
                          <span>{l.approx_calories ? `${l.approx_calories} kcal` : ""}</span>
                        </td>
                        <td className="fridge-meal-cell">
                          <strong>{d.name || "—"}</strong>
                          <span>{d.approx_calories ? `${d.approx_calories} kcal` : ""}</span>
                        </td>
                        <td className="fridge-meal-cell">
                          <strong>{s.name || "—"}</strong>
                          <span>{s.approx_calories ? `${s.approx_calories} kcal` : ""}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="fridge-day-name">{plan.day || "Today"}</td>
                    {(plan.meals || []).map((m, idx) => (
                      <td key={idx} className="fridge-meal-cell">
                        <strong>{m.name}</strong>
                        <span>{m.approx_calories} kcal</span>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Categorized Grocery List with [ ] Tick Boxes */}
          <h3 className="fridge-section-title">
            <span>Categorized Grocery Checklist</span>
            <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#666" }}>Bring to market or check off in pantry</span>
          </h3>

          <div className="fridge-grocery-grid">
            {Object.keys(grocery).length > 0 ? (
              Object.entries(grocery).map(([catName, items]) => (
                <div key={catName} className="fridge-grocery-category">
                  <h4 className="fridge-grocery-cat-name">{catName} ({items.length})</h4>
                  <ul className="fridge-checklist">
                    {items.slice(0, 14).map((item, i) => (
                      <li key={i} className="fridge-check-row">
                        <span className="fridge-box" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "0.82rem", color: "#666" }}>Standard whole-food staples: oats, quinoa, leafy greens, tomatoes, curd, paneer, and lentils.</p>
            )}
          </div>

          <footer className="fridge-sheet-footer">
            <span>🌿 Whole-Food Nutrition · Verified against Mifflin-St Jeor metabolic formulas</span>
            <span>Prep tip: Batch-cook grains and soak lentils on Sunday evening</span>
          </footer>
        </article>
      </div>
    </div>
  );
}

// Recipe Instructions Modal
function RecipeModal({ meal, onClose, onStartCooking }) {
  // Close modal on Escape key
  useEffect(() => {
    if (!meal) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [meal, onClose]);

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
            <span className="meta-label">Prep time</span>
            <strong>{meal.prep_time || "10 mins"}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">Cook time</span>
            <strong>{meal.cook_time || "15 mins"}</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">Calories</span>
            <strong>{meal.approx_calories} kcal</strong>
          </div>
          <div className="meta-item">
            <span className="meta-label">Goal alignment</span>
            <strong>
              {meal._goal
                ? meal._goal
                : meal.macros && meal.macros.protein_g > meal.macros.carbs_g
                ? "High protein"
                : meal.macros && meal.macros.carbs_g > (meal.macros.protein_g + meal.macros.fats_g)
                ? "High carbohydrate"
                : "Balanced macros"}
            </strong>
          </div>
        </div>

        <div className="recipe-body">
          <div className="recipe-section">
            <h3>Ingredients</h3>
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
            <h3>Method</h3>
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
              <strong>Why this meal works:</strong> {typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}
            </div>
          )}
        </div>

        <div className="recipe-modal-footer">
          <button
            className="btn-kitchen-mode-trigger"
            type="button"
            onClick={() => {
              if (onStartCooking) {
                onClose();
                onStartCooking(meal);
              }
            }}
          >
            🍳 Start Kitchen Cooking Mode
          </button>
          <button className="secondary-btn" type="button" onClick={onClose}>Close recipe</button>
        </div>
      </div>
    </div>
  );
}


// Main Meal Plan Display Component
function MealPlanDisplay({ plan, onSwapMeal, profile, onStartCooking, onOpenFridgeSheet, selectedDay: externalDay, onSelectDay }) {
  const [activeTab, setActiveTab] = useState("plan"); // "plan" | "grocery"
  const [internalDay, setInternalDay] = useState("Monday");
  const selectedDay = externalDay !== undefined ? externalDay : internalDay;
  const setSelectedDay = onSelectDay || setInternalDay;
  const [checkedItems, setCheckedItems] = useState({});
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  if (!plan || plan.error) {
    return plan && plan.error ? (
      <div className="result-card error">
        <h2>We could not generate this plan</h2>
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

  // Build Aggregated Grocery List from All Meals
  const buildGroceryCategories = () => {
    const categories = {
      "Fresh produce": [],
      "Protein & dairy": [],
      "Grains & carbohydrates": [],
      "Pantry & oils": []
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
          categories["Protein & dairy"].push(text);
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
          categories["Fresh produce"].push(text);
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
          categories["Grains & carbohydrates"].push(text);
        } else {
          categories["Pantry & oils"].push(text);
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
    let output = `Smart Nutrition Assistant — Grocery list\nPlan for: ${plan.user_id} (${plan.date})\n\n`;
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
    setCopyFeedback("Grocery list copied to your clipboard.");
    setTimeout(() => setCopyFeedback(""), 4000);
  };

  const totalMacros = currentDayData.total_macros || plan.total_macros || { protein_g: 130, carbs_g: 220, fats_g: 60 };
  const targetCal = currentDayData.target_calories || plan.target_calories || 2000;

  return (
    <div id="results-dashboard" className="result-card">
      <div className="result-header">
        <div className="title-row">
          <div>
            <h2>{isWeekly ? "Your 7-day nutrition plan" : "Your daily nutrition plan"}</h2>
            <p className="plan-subtitle">Prepared for <b>{plan.user_id}</b> · {plan.date}</p>
          </div>
          <div className="action-buttons">
            <button
              className="icon-btn fridge-sheet-btn"
              type="button"
              onClick={() => onOpenFridgeSheet && onOpenFridgeSheet()}
              title="View and print fridge-ready plan sheet with grocery checklist"
            >
              <Icon.notebook /> Fridge Sheet
            </button>
            <button
              className="icon-btn print-btn"
              type="button"
              onClick={() => onOpenFridgeSheet ? onOpenFridgeSheet() : window.print()}
              title="Print or save as PDF"
            >
              <Icon.print /> Print
            </button>
          </div>
        </div>

        {/* Weekly Day Selector Pills */}
        {isWeekly && (
          <div className="day-selector-row">
            <span className="day-selector-label">Day</span>
            <div className="day-pills">
              {daysList.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`day-pill ${selectedDay === day ? "active" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="day-name">{day.slice(0, 3)}</span>
                  <span className="day-cal">{plan.days[day]?.actual_calories || plan.days[day]?.target_calories} kcal</span>
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
            {isWeekly ? `${selectedDay}'s meals` : "Meals"}
          </button>
          <button
            className={`tab-btn ${activeTab === "grocery" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "grocery"}
            onClick={() => setActiveTab("grocery")}
          >
            Grocery list
          </button>
        </div>
      </div>

      {activeTab === "plan" ? (
        <>
          {/* 7-Day Weekly Calorie Trend Bar Chart for Weekly Plans */}
          {isWeekly && (
            <WeeklyTrendVisualizer
              days={plan.days}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          )}

          {/* Visual Donut Macro Chart & Metric Highlights */}
          <div className="macro-dashboard-grid">
            <div className="macro-chart-box-container">
              <span className="dashboard-subheading">Calorie & macro distribution</span>
              <MacroDonutChart
                protein_g={totalMacros.protein_g}
                carbs_g={totalMacros.carbs_g}
                fats_g={totalMacros.fats_g}
                target_calories={targetCal}
                meals={currentMeals}
              />
            </div>

            <div className="energy-stats-box">
              <span className="dashboard-subheading">Energy & metabolic targets</span>
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
                <div className="stat-tile">
                  <span className="stat-tile-label">Plate Calories (from recipes)</span>
                  <span className="stat-tile-val">{currentDayData.actual_calories || currentMeals.reduce((s, m) => s + (m.approx_calories || 0), 0)} kcal</span>
                  <span className="stat-tile-desc">Sum of catalog nutrition, not a TDEE split</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meal Timing & Fasting Window Visual Strip */}
          <MealTimelineVisualizer meals={currentMeals} />

          {/* Meals List */}
          <div className="meals-list">
            {currentMeals.map((meal, idx) => {
              const lower = (meal.name || "").toLowerCase();
              let slot = `Meal ${idx + 1}`;
              let cleanTitle = meal.name;

              if (lower.startsWith("breakfast")) {
                slot = "Breakfast";
                cleanTitle = meal.name.replace(/^breakfast[:\s-]*/i, "");
              } else if (lower.startsWith("lunch")) {
                slot = "Lunch";
                cleanTitle = meal.name.replace(/^lunch[:\s-]*/i, "");
              } else if (lower.startsWith("dinner")) {
                slot = "Dinner";
                cleanTitle = meal.name.replace(/^dinner[:\s-]*/i, "");
              } else if (lower.startsWith("snack")) {
                slot = "Snack";
                cleanTitle = meal.name.replace(/^snack[:\s-]*/i, "");
              } else {
                const defaultSlots = ["Breakfast", "Lunch", "Dinner", "Snack"];
                slot = defaultSlots[idx] || `Meal ${idx + 1}`;
              }

              // Compute macro ratio for this meal
              const mP = Number(meal.macros?.protein_g) || 20;
              const mC = Number(meal.macros?.carbs_g) || 40;
              const mF = Number(meal.macros?.fats_g) || 10;
              const mTotalCal = (mP * 4) + (mC * 4) + (mF * 9) || 1;
              const pW = Math.round(((mP * 4) / mTotalCal) * 100);
              const cW = Math.round(((mC * 4) / mTotalCal) * 100);
              const fW = Math.max(0, 100 - pW - cW);

              return (
                <div className={`meal-item ${meal.unavailable ? "meal-blocked" : ""}`} key={idx}>
                  <div className="meal-header">
                    <div className="meal-title-group">
                      <div className="meal-heading-wrapper">
                        <span className="meal-slot-tag">{slot}</span>
                        <h3 className="meal-title">{cleanTitle}</h3>
                        <div className="meal-meta-tags">
                          <span className="meal-tag">{meal.prep_time || "10 mins"} prep</span>
                          <span className="meal-tag">{meal.cook_time || "15 mins"} cook</span>
                          <span className="meal-tag difficulty">{meal.difficulty || "Easy"}</span>
                          {mP >= 28 && (
                            <span className="meal-highlight-badge badge-high-protein">
                              High protein
                            </span>
                          )}
                          {mC >= 45 && (
                            <span className="meal-highlight-badge badge-high-fiber">
                              Sustained energy
                            </span>
                          )}
                          {(meal.prep_time || "").includes("5") && (
                            <span className="meal-highlight-badge badge-quick">
                              Quick prep
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="meal-header-actions">
                      <span className="cal-badge">{meal.approx_calories} kcal</span>
                      {!meal.unavailable && (
                        <>
                          <button
                            className="recipe-btn"
                            type="button"
                            onClick={() => setSelectedRecipe(meal)}
                          >
                            Recipe
                          </button>
                          <button
                            className="cook-now-btn"
                            type="button"
                            onClick={() => onStartCooking && onStartCooking(meal)}
                            title="Start step-by-step kitchen cooking mode"
                          >
                            🍳 Cook
                          </button>
                        </>
                      )}
                      <button
                        className="swap-meal-btn"
                        type="button"
                        onClick={() => handleSwapClick(idx, meal.name)}
                        disabled={swappingIdx === idx || meal.unavailable}
                      >
                        {swappingIdx === idx ? "Swapping…" : "Swap"}
                      </button>
                    </div>
                  </div>

                  {/* Micro Macro Ratio Strip */}
                  <div
                    className="meal-macro-ratio-bar"
                    title={`Macros: ${mP}g Protein (${pW}%), ${mC}g Carbs (${cW}%), ${mF}g Fats (${fW}%)`}
                  >
                    <div className="ratio-seg ratio-p" style={{ width: `${pW}%` }} />
                    <div className="ratio-seg ratio-c" style={{ width: `${cW}%` }} />
                    <div className="ratio-seg ratio-f" style={{ width: `${fW}%` }} />
                  </div>

                  <div className="meal-body">
                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="ingr-block">
                        <span className="sub-heading">Key ingredients</span>
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
                          <span className="label">Why this meal works</span>
                          <p className="reason-text">
                            {typeof meal.reason === "object" ? JSON.stringify(meal.reason) : meal.reason}
                          </p>
                        </div>
                      )}

                      {meal.macros && (
                        <div className="meal-mini-macros">
                          <span className="macro-mini-pill p">Protein <b>{meal.macros.protein_g}g</b></span>
                          <span className="macro-mini-pill c">Carbs <b>{meal.macros.carbs_g}g</b></span>
                          <span className="macro-mini-pill f">Fats <b>{meal.macros.fats_g}g</b></span>
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
              <h3>{isWeekly ? "Weekly grocery list" : "Grocery list"}</h3>
              <p className="grocery-subtitle">Everything you need for the meals in this plan</p>
            </div>
            <button className="copy-grocery-btn" type="button" onClick={copyGroceryList}>
              Copy list
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
                          <input type="checkbox" checked={isChecked} onChange={() => toggleCheck(key)} />
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
        <RecipeModal
          meal={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onStartCooking={(m) => {
            setSelectedRecipe(null);
            if (onStartCooking) onStartCooking(m);
          }}
        />
      )}
    </div>
  );
}

// Zone 2: DietDoctor-style Hero — left checklist + right food photo
function HeroSection({ onStartAssessment, onExploreDemo }) {
  return (
    <section id="hero">
      <div className="hero-section">
        {/* Left Content */}
        <div className="hero-left-content">
          <div className="hero-eyebrow-pill">
            <Icon.leaf className="eyebrow-leaf" />
            Whole-Food Clinical Nutrition
          </div>

          <h1 className="hero-main-heading">
            Nourishing real food, <span>scientifically tailored</span> to your body.
          </h1>

          <p className="hero-subdescription">
            Personalized daily and 7-day meal protocols designed for metabolic vitality, steady energy, and gut health — built around fresh, vibrant whole ingredients you actually love.
          </p>

          <ul className="hero-feature-list">
            <li>Precision calorie, macro, and prebiotic fiber targets calculated from your biometrics</li>
            <li>Varied 7-day whole-food meal schedules with step-by-step recipes and cooking times</li>
            <li>Categorized fresh-produce grocery lists that make healthy shopping effortless</li>
          </ul>

          <div className="hero-actions-group">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={onStartAssessment}
              id="hero-cta-assessment"
            >
              Build my nutrition plan
            </button>

            <button
              type="button"
              className="btn-hero-secondary"
              onClick={onExploreDemo}
              id="hero-cta-demo"
            >
              Explore sample plan
            </button>
          </div>
          <p className="hero-no-commitment">100% free & open. No credit card or account needed.</p>

          <div className="hero-trust-row">
            <span className="hero-trust-item">Mifflin-St Jeor metabolic formulas</span>
            <span className="hero-trust-item">Zero ultra-processed filler</span>
            <span className="hero-trust-item">Complete whole-food recipes</span>
          </div>
        </div>

        {/* Right Side — Real Food Photo */}
        <div className="hero-visual-wrapper">
          <div className="hero-photo-container">
            <img
              src="./assets/hero_food.jpg"
              alt="Vibrant whole-foods Mediterranean nourishment bowl with quinoa, avocado, edamame, fresh vegetables, and infused water"
              loading="eager"
            />
            <div className="hero-photo-tag-top">
              <span className="hero-organic-badge">
                <Icon.leaf className="hero-badge-leaf" />
                100% Whole Foods • High Vitality
              </span>
            </div>
            <div className="hero-floating-stats">
              <div className="hero-floating-header">
                <span className="hero-floating-pill-label">Daily Nourishment Protocol</span>
                <span className="hero-floating-micro-badge">Metabolic Balance</span>
              </div>
              <div className="hero-floating-metrics-grid">
                <div className="hero-stat-bubble">
                  <span className="hero-stat-bubble-val green">2,100</span>
                  <span className="hero-stat-bubble-lbl">Energy (kcal)</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-bubble">
                  <span className="hero-stat-bubble-val">140g</span>
                  <span className="hero-stat-bubble-lbl">Protein</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-bubble">
                  <span className="hero-stat-bubble-val amber">38g</span>
                  <span className="hero-stat-bubble-lbl">Prebiotic Fiber</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-bubble">
                  <span className="hero-stat-bubble-val blue">3.0 L</span>
                  <span className="hero-stat-bubble-lbl">Hydration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Zone 3: Dietary approach cards (DietDoctor-style Guides)
const ARCHETYPES_LIST = [
  {
    id: "balanced",
    name: "Balanced nutrition",
    macroSplit: "30P • 45C • 25F",
    dietVal: "balanced",
    goalVal: "maintain",
    image: "./assets/recipe_salad.jpg",
    desc: "A nutrient-dense split for sustained everyday vitality, steady energy, and wellbeing.",
  },
  {
    id: "vegetarian",
    name: "Vegetarian diet",
    macroSplit: "25P • 50C • 25F",
    dietVal: "indian vegetarian",
    goalVal: "maintain",
    image: "./assets/recipe_oatmeal.jpg",
    desc: "Wholesome plant-rich staples, lentils, whole grains, dairy, and seasonal garden produce.",
  },
  {
    id: "vegan",
    name: "Plant-based diet",
    macroSplit: "20P • 60C • 20F",
    dietVal: "indian vegan",
    goalVal: "maintain",
    image: "./assets/recipe_parfait.jpg",
    desc: "Purely plant-derived meals rich in fiber, micronutrients, and clean anti-inflammatory fuel.",
  },
  {
    id: "low-carb",
    name: "Low-carb diet",
    macroSplit: "30P • 20C • 50F",
    dietVal: "balanced",
    goalVal: "weight_loss",
    image: "./assets/recipe_salmon.jpg",
    desc: "Healthy fats and reduced carbohydrates to stabilize blood sugar and accelerate fat loss.",
  },
  {
    id: "high-protein",
    name: "High-protein diet",
    macroSplit: "35P • 45C • 20F",
    dietVal: "balanced",
    goalVal: "muscle_gain",
    image: "./assets/hero_food.jpg",
    desc: "Higher protein targets for lean muscle preservation, satiety, and active metabolic support.",
  },
];

// Zone 3: DietDoctor-style Guide Cards (like "Keto for beginners", "Low-carb diet", "High-protein diet")
function DietaryArchetypeStrip({ selectedArchetype, onSelectArchetype }) {
  return (
    <section className="archetypes-section" aria-label="Dietary Frameworks">
      <div className="archetypes-inner">
        <div className="archetypes-header">
          <span className="archetypes-tag">Explore Nutrition Frameworks</span>
          <h2 className="archetypes-title">Choose your dietary approach</h2>
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
                <div className="archetype-circle-icon">
                  <img src={arch.image} alt={arch.name} loading="lazy" />
                </div>
                <div className="archetype-card-body">
                  <span className="archetype-guide-badge">Guide</span>
                  <span className="archetype-circle-name">{arch.name}</span>
                  <span className="archetype-circle-split">{arch.macroSplit}</span>
                  <p className="archetype-card-desc">{arch.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Zone 4: DietDoctor-style About Section with real photo cards
function EvidenceSection() {
  return (
    <>
      <section className="evidence-split-section" id="methodology" aria-label="About The Engine">
        {/* Left Column: Photo cards */}
        <div className="evidence-visual-col">
          <div className="evidence-img-card tall">
            <img src="./assets/meal_prep.jpg" alt="Woman preparing healthy Indian meal" loading="lazy" />
            <div className="card-overlay" />
            <div className="card-label">
              <div className="evidence-card-title">Fresh Meal Prep</div>
              <div className="evidence-card-desc">Step-by-step easy home cooking</div>
            </div>
          </div>
          <div className="evidence-img-card card-alt">
            <img src="./assets/hero_food.jpg" alt="Nutrient-dense meal spread" loading="lazy" />
            <div className="card-overlay" />
            <div className="card-label">
              <div className="evidence-card-title">Nutrient-Dense</div>
              <div className="evidence-card-desc">Whole foods rich in vitamins & minerals</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
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

      {/* Membership-style promo banner */}
      <div className="evidence-promo-banner">
        <div className="evidence-promo-card">
          <div className="evidence-promo-content">
            <div className="promo-kicker">Weekly Planner</div>
            <h3>Wish someone else would plan dinner?</h3>
            <p>
              We’ve got you. Unlock personalized meal plans, complete recipe library with step-by-step cooking instructions, and categorized grocery lists that make healthy eating simple, enjoyable, and delicious.
            </p>
            <button
              type="button"
              className="btn-promo-cta"
              onClick={() => { const el = document.getElementById("protocol-engine"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
            >
              Generate my free plan
            </button>
          </div>
          <div className="evidence-promo-photos">
            <div className="photo-thumb">
              <img src="./assets/recipe_oatmeal.jpg" alt="Oatmeal bowl with fresh figs" loading="lazy" />
            </div>
            <div className="photo-thumb">
              <img src="./assets/recipe_salad.jpg" alt="Arugula and tangerine salad" loading="lazy" />
            </div>
            <div className="photo-thumb">
              <img src="./assets/recipe_salmon.jpg" alt="Herb grilled salmon with vegetables" loading="lazy" />
            </div>
            <div className="photo-thumb">
              <img src="./assets/recipe_parfait.jpg" alt="Berry yogurt parfait" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Zone 5: 3-Step Process & 2 Split Promo Cards
function StepsSection({ onStep1Click }) {
  return (
    <section className="steps-workflow-section" id="how-it-works" aria-label="How it works">
      <div className="steps-header">
        <span className="section-eyebrow">How it works</span>
        <h2 className="section-title">A personalized plan in three steps</h2>
        <p className="steps-intro-text">
          We calculate your metabolic requirements with precision, then translate them into meals you will actually look forward to.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="steps-cards-row">
        <div
          className="step-flow-card"
          onClick={onStep1Click}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onStep1Click(); }}
        >
          <span className="step-numeral">01</span>
          <h3 className="step-title-num">Enter your details</h3>
          <p className="step-description-text">
            Add your age, height, weight, activity level, and dietary preferences to the form below.
          </p>
        </div>

        <div
          className="step-flow-card"
          onClick={onStep1Click}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onStep1Click(); }}
        >
          <span className="step-numeral">02</span>
          <h3 className="step-title-num">We build your targets</h3>
          <p className="step-description-text">
            Your plan balances calories, protein, carbohydrates, and healthy fats around your goal.
          </p>
        </div>

        <div
          className="step-flow-card"
          onClick={onStep1Click}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onStep1Click(); }}
        >
          <span className="step-numeral">03</span>
          <h3 className="step-title-num">Cook, eat, and track</h3>
          <p className="step-description-text">
            Follow your daily meals, open step-by-step recipes, and log hydration as you go.
          </p>
        </div>
      </div>

      {/* Single Weekly Meal Planner Card */}
      <div
        className="single-promo-banner"
        onClick={onStep1Click}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onStep1Click(); }}
      >
        <div className="single-promo-content">
          <span className="promo-badge-tag">7-Day Variety</span>
          <h3 className="promo-banner-title">Weekly Meal Planner</h3>
          <p className="promo-banner-desc">7 days of varied, nutritionally balanced meal plans tailored to your unique body metrics.</p>
        </div>
        <button
          type="button"
          className="btn-promo-cta"
          onClick={(e) => {
            e.stopPropagation();
            onStep1Click();
          }}
        >
          Build 7-Day Plan →
        </button>
      </div>
    </section>
  );
}

// Zone 6: DietDoctor-style Recipe Cards with real photos
const SHOWCASE_PRODUCTS = [
  {
    id: "prod-1",
    category: ["all", "breakfast"],
    title: "Fig & Berry Oatmeal Bowl",
    img: "./assets/recipe_oatmeal.jpg",
    label: "Breakfast",
    calories: "380 kcal",
    time: "10 min",
    difficulty: "Easy",
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
    category: ["all", "mains"],
    title: "Lime & Herb Grilled Salmon",
    img: "./assets/recipe_salmon.jpg",
    label: "Lunch",
    calories: "520 kcal",
    time: "15 min",
    difficulty: "Medium",
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
    category: ["all", "snacks"],
    title: "Berry Greek Yogurt Parfait",
    img: "./assets/recipe_parfait.jpg",
    label: "Snack",
    calories: "320 kcal",
    time: "5 min",
    difficulty: "Easy",
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
    category: ["all", "salads"],
    title: "Tangerine Walnut Arugula Salad",
    img: "./assets/recipe_salad.jpg",
    label: "Dinner",
    calories: "410 kcal",
    time: "8 min",
    difficulty: "Easy",
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
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filtered = SHOWCASE_PRODUCTS.filter((item) =>
    activeCategory === "all" ? true : item.category.includes(activeCategory)
  );

  return (
    <section className="showcase-matrix-section" id="macro-matrix" aria-label="Popular Recipes">
      <div className="showcase-header">
        <div className="showcase-subtitle-tag">From the recipe library</div>
        <h2 className="showcase-main-title">Recipes worth cooking tonight</h2>
        <p className="showcase-desc">
          Balanced, everyday meals from the same library used to build your plan — with full ingredients and methods.
        </p>
      </div>

      {/* Tabs — underline style */}
      <div className="showcase-tabs-row" role="tablist" aria-label="Recipe categories">
        {[
          { id: "all", label: "All recipes" },
          { id: "breakfast", label: "Breakfast" },
          { id: "mains", label: "Mains" },
          { id: "snacks", label: "Snacks" },
          { id: "salads", label: "Salads" },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`showcase-tab-btn ${activeCategory === t.id ? "active" : ""}`}
            onClick={() => setActiveCategory(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Recipe Cards with real photos */}
      <div className="showcase-cards-grid">
        {filtered.map((item) => (
          <div className="showcase-item-card" key={item.id} onClick={() => onSelectRecipe(item.recipe)}>
            <div className="showcase-item-visual">
              <img src={item.img} alt={item.title} loading="lazy" />
              <span className="recipe-cal-badge">{item.calories}</span>
            </div>
            <div className="showcase-card-body">
              <div className="recipe-rating-row">
                <span className="recipe-rating-num">{item.label}</span>
              </div>
              <h3 className="showcase-item-name">{item.title}</h3>
              <div className="showcase-item-meta">
                <span>{item.time}</span>
                <span className="meta-dot" />
                <span>{item.difficulty}</span>
              </div>
              <button
                type="button"
                className="showcase-item-btn"
                onClick={(e) => { e.stopPropagation(); onSelectRecipe(item.recipe); }}
              >
                View recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="check-all-recipes-wrap">
        <button
          type="button"
          className="btn-check-all-recipes"
          onClick={() => { const el = document.getElementById("protocol-engine"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
        >
          Build a plan with these recipes
        </button>
      </div>
    </section>
  );
}

// Institutional footer with columns (DietDoctor-style)
function InstitutionalFooter({ onNavigateSection, onSelectDiet, onShowLegalModal }) {
  return (
    <footer className="institutional-footer" id="footer-trust" aria-label="Footer">
      <div className="footer-inner">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-title">
              <Icon.leaf className="footer-brand-mark" />
              <span className="footer-brand-name">Smart<span>Nutrition</span></span>
            </div>
            <p>Your free personal nutrition engine. Evidence-based meal plans, macro targets, and grocery lists — all in one place.</p>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            <div className="footer-col-links">
              <button type="button" onClick={() => onNavigateSection("hero")}>Home</button>
              <button type="button" onClick={() => onNavigateSection("methodology")}>About Us</button>
              <button type="button" onClick={() => onNavigateSection("macro-matrix")}>Recipes</button>
              <button type="button" onClick={() => onNavigateSection("how-it-works")}>How It Works</button>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Nutrition Plans</div>
            <div className="footer-col-links">
              <button type="button" onClick={() => onNavigateSection("protocol-engine")}>1-Day Plan</button>
              <button type="button" onClick={() => onNavigateSection("protocol-engine")}>7-Day Weekly Plan</button>
              <button type="button" onClick={() => onNavigateSection("protocol-engine")}>Grocery Lists</button>
              <button type="button" onClick={() => onNavigateSection("protocol-engine")}>Hydration Tracker</button>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Diet Types</div>
            <div className="footer-col-links">
              <button type="button" onClick={() => onSelectDiet ? onSelectDiet("indian vegetarian") : onNavigateSection("protocol-engine")}>Indian Vegetarian</button>
              <button type="button" onClick={() => onSelectDiet ? onSelectDiet("indian vegan") : onNavigateSection("protocol-engine")}>Vegan</button>
              <button type="button" onClick={() => onSelectDiet ? onSelectDiet("indian non-vegetarian") : onNavigateSection("protocol-engine")}>Non-Vegetarian</button>
              <button type="button" onClick={() => onSelectDiet ? onSelectDiet("balanced") : onNavigateSection("protocol-engine")}>Balanced</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-copyright">
            © 2026 Smart Nutrition. All rights reserved.
          </div>
          <div className="footer-links-row">
            <button type="button" onClick={() => onShowLegalModal && onShowLegalModal("privacy")}>Privacy Policy</button>
            <button type="button" onClick={() => onShowLegalModal && onShowLegalModal("terms")}>Terms of Service</button>
            <button type="button" onClick={() => onShowLegalModal && onShowLegalModal("contact")}>Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Calorie Progress Tracker
// ---------------------------------------------------------------------------
function CalorieTracker({ plan, eatenMeals, onToggleMeal, currentDay = "Monday" }) {
  const meals = plan.is_weekly && plan.days
    ? (plan.days[currentDay]?.meals || Object.values(plan.days)[0]?.meals || [])
    : (plan.meals || []);

  const target = plan.target_calories || 2000;
  const eaten = meals.reduce((sum, m) => eatenMeals[m.name] ? sum + (m.approx_calories || 0) : sum, 0);
  const pct = Math.min(100, Math.round((eaten / target) * 100));
  const remaining = Math.max(0, target - eaten);

  // Compute macro targets & eaten macros
  const targetP = plan.target_macros?.protein_g || 120;
  const targetC = plan.target_macros?.carbs_g || 200;
  const targetF = plan.target_macros?.fats_g || 50;

  let eatenP = 0;
  let eatenC = 0;
  let eatenF = 0;

  meals.forEach((m) => {
    if (eatenMeals[m.name] && m.macros) {
      eatenP += Number(m.macros.protein_g) || 0;
      eatenC += Number(m.macros.carbs_g) || 0;
      eatenF += Number(m.macros.fats_g) || 0;
    }
  });

  const pPct = Math.min(100, Math.round((eatenP / targetP) * 100));
  const cPct = Math.min(100, Math.round((eatenC / targetC) * 100));
  const fPct = Math.min(100, Math.round((eatenF / targetF) * 100));

  const slotLabels = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="calorie-tracker-card">
      <div className="calorie-tracker-header">
        <div className="calorie-tracker-heading">
          <h3>Today&apos;s progress</h3>
          <p>Select a meal to mark it eaten and update your totals.</p>
        </div>
        <span className={`calorie-pct-badge ${pct >= 100 ? "complete" : ""}`}>{pct}% eaten</span>
      </div>

      <div className="calorie-progress-bar-track">
        <div className="calorie-progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="calorie-stats-row">
        <div className="calorie-stat-box">
          <span className="calorie-stat-label">Target</span>
          <span className="calorie-stat-val">{target} kcal</span>
        </div>
        <div className="calorie-stat-box">
          <span className="calorie-stat-label">Eaten</span>
          <span className="calorie-stat-val positive">{eaten} kcal</span>
        </div>
        <div className="calorie-stat-box">
          <span className="calorie-stat-label">Remaining</span>
          <span className="calorie-stat-val">{remaining} kcal</span>
        </div>
      </div>

      {/* Target vs eaten macro progress */}
      <div className="macro-progress-tracker-grid">
        <div className="macro-prog-box">
          <div className="macro-prog-top">
            <span className="macro-prog-label">Protein</span>
            <span className="macro-prog-nums">{eatenP} / {targetP}g ({pPct}%)</span>
          </div>
          <div className="macro-prog-track">
            <div className="macro-prog-fill fill-protein" style={{ width: `${pPct}%` }} />
          </div>
        </div>

        <div className="macro-prog-box">
          <div className="macro-prog-top">
            <span className="macro-prog-label">Carbs</span>
            <span className="macro-prog-nums">{eatenC} / {targetC}g ({cPct}%)</span>
          </div>
          <div className="macro-prog-track">
            <div className="macro-prog-fill fill-carbs" style={{ width: `${cPct}%` }} />
          </div>
        </div>

        <div className="macro-prog-box">
          <div className="macro-prog-top">
            <span className="macro-prog-label">Fats</span>
            <span className="macro-prog-nums">{eatenF} / {targetF}g ({fPct}%)</span>
          </div>
          <div className="macro-prog-track">
            <div className="macro-prog-fill fill-fats" style={{ width: `${fPct}%` }} />
          </div>
        </div>
      </div>

      <div className="calorie-meals-grid">
        {meals.map((meal, idx) => {
          const isEaten = !!eatenMeals[meal.name];
          return (
            <button
              key={meal.name}
              type="button"
              className={`calorie-meal-btn ${isEaten ? "eaten" : ""}`}
              onClick={() => onToggleMeal(meal.name)}
              aria-pressed={isEaten}
            >
              <span className="calorie-meal-slot">{slotLabels[idx] || `Meal ${idx + 1}`}</span>
              <span className="calorie-meal-name">{(meal.name || "").replace(/^(breakfast|lunch|dinner|snack)[:\s-]*/i, "")}</span>
              <span className="calorie-meal-cal">{meal.approx_calories} kcal</span>
              {isEaten && <span className="calorie-meal-check" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "What's in My Fridge?" Smart Pantry Matcher
// ---------------------------------------------------------------------------
const STAPLE_CHIPS = [
  "Spinach", "Paneer", "Eggs", "Oats", "Curd", "Quinoa",
  "Chickpeas", "Chicken", "Tomatoes", "Tofu", "Lentils", "Cucumber"
];

function PantryMatcher({ onOpenRecipe, onStartCooking }) {
  const [selectedPantry, setSelectedPantry] = useState(["Spinach", "Paneer", "Tomatoes"]);
  const [customInput, setCustomInput] = useState("");
  const allMeals = React.useMemo(() => getAllCatalogMeals(), []);

  const handleToggleStaple = (chip) => {
    setSelectedPantry((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const val = customInput.trim();
    if (!val) return;
    if (!selectedPantry.map((s) => s.toLowerCase()).includes(val.toLowerCase())) {
      setSelectedPantry((prev) => [...prev, val]);
    }
    setCustomInput("");
  };

  const handleRemove = (item) => {
    setSelectedPantry((prev) => prev.filter((c) => c !== item));
  };

  // Rank meals by how many selected pantry items they contain
  const matchedMeals = React.useMemo(() => {
    if (selectedPantry.length === 0) return [];
    const searchTerms = selectedPantry.map((s) => s.toLowerCase());

    const matches = [];
    allMeals.forEach((meal) => {
      const ingList = (meal.ingredients || []).map((ing) =>
        (typeof ing === "object" ? (ing.name || ing.item || JSON.stringify(ing)) : String(ing)).toLowerCase()
      );
      const combined = `${meal.name} ${ingList.join(" ")}`.toLowerCase();

      const matchedTerms = searchTerms.filter((term) => combined.includes(term));
      if (matchedTerms.length > 0) {
        matches.push({
          meal,
          matchedCount: matchedTerms.length,
          matchedTerms,
        });
      }
    });

    matches.sort((a, b) => b.matchedCount - a.matchedCount);
    return matches.slice(0, 6);
  }, [selectedPantry, allMeals]);

  return (
    <section id="pantry-matcher" className="pantry-matcher-section" aria-label="Smart Pantry Matcher">
      <div className="pantry-matcher-card">
        <header className="pantry-header">
          <div className="pantry-tag">
            <Icon.leaf style={{ width: 14, height: 14 }} />
            Zero-Waste Kitchen & Pantry Matcher
          </div>
          <h2 className="pantry-title">What's in your fridge right now?</h2>
          <p className="pantry-description">
            Select or type ingredients you already have at home. We'll cross-reference our whole-food catalog and surface delicious recipes you can cook immediately without an extra trip to the store.
          </p>
        </header>

        <div className="pantry-controls-wrap">
          <form className="pantry-input-row" onSubmit={handleAddCustom}>
            <input
              type="text"
              className="pantry-text-input"
              placeholder="e.g. sweet potato, bell pepper, mushrooms..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button className="btn-add-ingredient" type="submit">
              + Add Ingredient
            </button>
          </form>

          <div>
            <div className="pantry-staples-label">Popular staple pantry items:</div>
            <div className="pantry-staple-chips" style={{ marginTop: 10 }}>
              {STAPLE_CHIPS.map((chip) => {
                const isSelected = selectedPantry.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    className={`staple-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => handleToggleStaple(chip)}
                  >
                    {isSelected ? "✓" : "+"} {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPantry.length > 0 && (
            <div className="pantry-active-tags">
              <span className="pantry-active-label">In your kitchen ({selectedPantry.length}):</span>
              {selectedPantry.map((item) => (
                <span key={item} className="active-ingr-pill">
                  {item}
                  <button
                    type="button"
                    className="btn-remove-ingr"
                    onClick={() => handleRemove(item)}
                    title={`Remove ${item}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="btn-clear-pantry"
                onClick={() => setSelectedPantry([])}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="pantry-results-header" style={{ marginBottom: 18 }}>
            <span className="pantry-results-count">
              {matchedMeals.length > 0
                ? `Showing top ${matchedMeals.length} whole-food recipes matching your pantry:`
                : selectedPantry.length === 0
                ? "Select ingredients above to find matching meals."
                : "No matching recipes found with these exact ingredients."}
            </span>
          </div>

          {matchedMeals.length > 0 ? (
            <div className="pantry-results-grid">
              {matchedMeals.map(({ meal, matchedCount, matchedTerms }) => (
                <article key={meal.name} className="pantry-meal-card">
                  <div className="pantry-meal-card-top">
                    <span className="pantry-match-badge">
                      ✓ Matches {matchedCount} {matchedCount === 1 ? "item" : "items"}
                    </span>
                    <h3 className="pantry-meal-name">{meal.name}</h3>
                    <div className="pantry-meal-macros">
                      <span><strong>{meal.approx_calories}</strong> kcal</span>
                      <span>•</span>
                      <span><strong>{meal.macros?.protein_g || 0}g</strong> protein</span>
                      <span>•</span>
                      <span>{meal.cook_time || "15 mins"}</span>
                    </div>
                    <div className="pantry-matched-ingrs-list">
                      Found in recipe: <strong>{matchedTerms.join(", ")}</strong>
                    </div>
                  </div>

                  <div className="pantry-meal-actions">
                    <button
                      type="button"
                      className="btn-pantry-cook"
                      onClick={() => onStartCooking(meal)}
                    >
                      🍳 Cook Now
                    </button>
                    <button
                      type="button"
                      className="btn-pantry-view"
                      onClick={() => onOpenRecipe(meal)}
                    >
                      Recipe Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : selectedPantry.length > 0 ? (
            <div className="pantry-empty-prompt">
              Try clicking popular staples like <strong>Spinach</strong>, <strong>Paneer</strong>, or <strong>Oats</strong> above.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// Main Root Application
function App() {
  const emptyForm = {
    name: "",
    age: "",
    sex: "male",
    height_cm: "",
    weight_kg: "",
    activity: "medium",
    goal: "maintain",
    diet: "indian vegetarian",
    allergies: "",
    conditions: [],
    cuisine: "any",
    budget: "medium",
  };

  const [form, setForm] = useState(emptyForm);

  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingType, setGeneratingType] = useState("1day");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Add your profile details to create a personalized, goal-based nutrition plan.");
  const [selectedArchetype, setSelectedArchetype] = useState("balanced");
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric"); // "metric" | "imperial"
  const [eatenMeals, setEatenMeals] = useState({}); // { "mealName": true }
  const [cookingMeal, setCookingMeal] = useState(null);
  const [showFridgeSheet, setShowFridgeSheet] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [legalModal, setLegalModal] = useState(null);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("smart_nutrition_theme");
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {}
    return "light";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.className = `theme-${theme}`;
      localStorage.setItem("smart_nutrition_theme", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelectArchetype = (arch) => {
    setSelectedArchetype(arch.id);
    setForm((prev) => ({
      ...prev,
      diet: arch.dietVal,
      goal: arch.goalVal,
    }));
    setStatusMessage(`Calibrated to ${arch.name} (${arch.macroSplit}). Ready to generate plan.`);
    const el = document.getElementById("protocol-engine");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFooterSelectDiet = (dietValue) => {
    setForm((prev) => ({ ...prev, diet: dietValue }));
    setStatusMessage(`Diet preference set to ${dietValue}. Ready to calculate plan.`);
    const el = document.getElementById("protocol-engine");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowLegalModal = (type) => {
    if (type === "privacy") {
      setLegalModal({
        title: "Privacy Policy",
        body: "Smart Nutrition values your complete personal privacy. All biometrics, calorie computations, and diet customizations are calculated directly in your browser or local environment. We do not sell, store, or transmit your physical metrics to external advertising networks."
      });
    } else if (type === "terms") {
      setLegalModal({
        title: "Terms of Service",
        body: "Smart Nutrition is an open clinical nutrition calculator intended for personal health, meal planning, and educational purposes. Metabolic targets utilize the Mifflin-St Jeor equation. Always consult a licensed dietitian or physician for specialized medical conditions."
      });
    } else if (type === "contact") {
      setLegalModal({
        title: "Contact & Clinical Feedback",
        body: "We welcome feedback from nutrition researchers, home cooks, and clinical practitioners. Reach out at clinical@smartnutrition.local or open an issue on our GitHub repository."
      });
    }
  };

  const handleNavigateSection = (sectionId) => {
    const el = document.getElementById(sectionId) || (sectionId === "hero" ? document.querySelector(".hero-section") : null);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => {
      const next = prev === "metric" ? "imperial" : "metric";
      setForm((f) => {
        if (prev === "metric" && next === "imperial") {
          const lbs = f.weight_kg ? Math.round(parseFloat(f.weight_kg) * 2.20462) : "";
          const inches = f.height_cm ? Math.round(parseFloat(f.height_cm) / 2.54) : "";
          return { ...f, weight_kg: lbs, height_cm: inches, _ft: undefined, _in: undefined };
        }

        const kg = f.weight_kg ? (parseFloat(f.weight_kg) / 2.20462).toFixed(1) : "";
        const cm = f.height_cm ? Math.round(parseFloat(f.height_cm) * 2.54) : "";
        return { ...f, weight_kg: kg, height_cm: cm, _ft: undefined, _in: undefined };
      });
      return next;
    });
  };

  // Imperial values are stored in inches and pounds; convert once before submitting.
  const resolveMetricForm = (activeForm) => {
    if (unitSystem === "metric") return activeForm;
    const convertedCm = activeForm.height_cm ? Math.round(parseFloat(activeForm.height_cm) * 2.54) : activeForm.height_cm;
    const convertedKg = activeForm.weight_kg ? (parseFloat(activeForm.weight_kg) / 2.20462).toFixed(1) : activeForm.weight_kg;
    return { ...activeForm, height_cm: convertedCm, weight_kg: convertedKg };
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setMealPlan(null);
    setStatusMessage("Form cleared. Start again with your latest profile details.");
  };

  const loadDemoProfile = (autoGenerate = false) => {
    setUnitSystem("metric");
    const demo = {
      name: "Aarav Sharma",
      age: "28",
      sex: "male",
      height_cm: "178",
      weight_kg: "74",
      activity: "medium",
      goal: "maintain",
      diet: "indian vegetarian",
      allergies: "nuts",
      conditions: [],
      cuisine: "indian",
      budget: "medium",
    };
    setForm(demo);
    if (autoGenerate) {
      handleGeneratePlan("1day", demo);
    } else {
      setStatusMessage("Demo profile loaded. Choose a 1-day or 7-day plan below.");
    }
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

  useEffect(() => {
    const name = (form.name || "").trim();
    if (!name) return;
    let cancelled = false;
    fetch(`${API_BASE}/plans?name=${encodeURIComponent(name)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.plans) return;
        setHistory(data.plans);
        try {
          localStorage.setItem("smart_nutrition_history", JSON.stringify(data.plans));
        } catch (e) {
          console.error(e);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [form.name]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (statusMessage) {
      setStatusMessage("Add your profile details to create a personalized, goal-based nutrition plan.");
    }
  };

  const calculateLiveMetrics = () => {
    let h = parseFloat(form.height_cm);
    let w = parseFloat(form.weight_kg);
    const age = parseInt(form.age);

    if (!h || !w || h <= 0 || w <= 0) return null;

    if (unitSystem === "imperial") {
      h = h * 2.54;
      w = w / 2.20462;
    }

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

  const handleGeneratePlan = async (type = "1day", customProfile = null) => {
    const rawForm = customProfile || form;
    const activeForm = resolveMetricForm(rawForm);
    const missingFields = [];
    let firstMissingInputId = null;

    if (!activeForm.age) {
      missingFields.push("Age");
      if (!firstMissingInputId) firstMissingInputId = "profile-age";
    }
    if (!activeForm.height_cm) {
      missingFields.push(unitSystem === "metric" ? "Height (cm)" : "Height (inches)");
      if (!firstMissingInputId) firstMissingInputId = "profile-height";
    }
    if (!activeForm.weight_kg) {
      missingFields.push(unitSystem === "metric" ? "Weight (kg)" : "Weight (lbs)");
      if (!firstMissingInputId) firstMissingInputId = "profile-weight";
    }

    if (missingFields.length > 0) {
      setStatusMessage(`Please enter your ${missingFields.join(", ")} before generating your meal plan.`);
      if (firstMissingInputId) {
        const el = document.getElementById(firstMissingInputId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }

    setLoading(true);
    setGeneratingType(type);
    setStatusMessage(type === "7day" ? "Generating full 7-day varied weekly nutrition plan..." : "Building your personalized daily nutrition plan...");

    const resolvedName = (activeForm.name || "").trim() || "You";

    const payload = {
      name: resolvedName,
      age: parseInt(activeForm.age, 10) || 25,
      sex: activeForm.sex || "male",
      height_cm: parseFloat(activeForm.height_cm) || 175,
      weight_kg: parseFloat(activeForm.weight_kg) || 70,
      activity: activeForm.activity || "medium",
      goal: activeForm.goal || "maintain",
      diet: activeForm.diet || "indian vegetarian",
      allergies: activeForm.allergies
        ? (Array.isArray(activeForm.allergies) ? activeForm.allergies : activeForm.allergies.split(",").map((a) => a.trim()).filter(Boolean))
        : [],
      conditions: Array.isArray(activeForm.conditions) ? activeForm.conditions : [],
      cuisine: activeForm.cuisine || "any",
      budget: activeForm.budget || "medium",
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
      setEatenMeals({}); // Reset tracker for new plan
      try {
        const updatedHistory = [result, ...history.filter((h) => h.date !== result.date || h.user_id !== result.user_id)].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem("smart_nutrition_history", JSON.stringify(updatedHistory));
      } catch (e) {
        console.error(e);
      }
      setStatusMessage(type === "7day" ? "Your 7-day nutrition plan is ready." : "Your personalized daily nutrition plan is ready.");
      setTimeout(() => {
        const resEl = document.getElementById("results-dashboard");
        if (resEl) {
          resEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
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
      setStatusMessage(`Meal swapped: ${newMeal.name}`);
    }
  };

  return (
    <div className={`app theme-${theme}`}>
      <div className="container">
        {/* Global Header */}
        <header className="global-header">
          <div className="header-inner">
            <button
              className="brand-logo-group"
              type="button"
              aria-label="Smart Nutrition home"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Icon.leaf className="brand-mark" />
              <span className="brand-title">
                Smart<span>Nutrition</span>
              </span>
            </button>

            <ul className="nav-links-list">
              <li><button type="button" className="nav-link" onClick={() => { const el = document.getElementById("methodology"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>About</button></li>
              <li><button type="button" className="nav-link" onClick={() => { const el = document.getElementById("protocol-engine"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>Meal plans</button></li>
              <li><button type="button" className="nav-link" onClick={() => { const el = document.getElementById("macro-matrix"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>Recipes</button></li>
              <li><button type="button" className="nav-link" onClick={() => { const el = document.getElementById("pantry-matcher"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>Pantry matcher</button></li>
              <li><button type="button" className="nav-link" onClick={() => { const el = document.getElementById("how-it-works"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>How it works</button></li>
            </ul>

            <div className="nav-action-matrix">
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to daylight mode" : "Switch to natural evening mode"}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Icon.sun className="theme-icon" /> : <Icon.moon className="theme-icon" />}
                <span className="theme-toggle-text">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              <button type="button" className="btn-primary-blueprint" onClick={() => { const el = document.getElementById("protocol-engine"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}>Create my plan</button>

              {/* Hamburger for mobile */}
              <button
                className={`nav-hamburger ${navOpen ? "open" : ""}`}
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={navOpen}
                onClick={() => setNavOpen((o) => !o)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <nav className={`mobile-nav-dropdown ${navOpen ? "open" : ""}`} aria-label="Mobile navigation">
            {[
              { label: "About", id: "methodology" },
              { label: "Meal plans", id: "protocol-engine" },
              { label: "Recipes", id: "macro-matrix" },
              { label: "Pantry matcher", id: "pantry-matcher" },
              { label: "How it works", id: "how-it-works" },
              { label: "Create my plan", id: "protocol-engine" },
            ].map(({ label, id }) => (
              <button key={label} type="button" onClick={() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); setNavOpen(false); }}>{label}</button>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setNavOpen(false);
              }}
            >
              {theme === "dark" ? "☀️ Daylight mode" : "🌙 Natural dark mode"}
            </button>
          </nav>
        </header>

        {/* Hero */}
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
            loadDemoProfile(true);
            const el = document.getElementById("protocol-engine");
            if (el) el.scrollIntoView({ behavior: "smooth" });
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

        {/* "What's in My Fridge?" Smart Pantry Matcher */}
        <PantryMatcher
          onOpenRecipe={(recipe) => setPreviewRecipe(recipe)}
          onStartCooking={(meal) => setCookingMeal(meal)}
        />

        {/* ZONE 7: Generator Form Section */}
        <section id="protocol-engine" className="generator-section">
          <div className="generator-section-inner">
          {/* Header Bar with Title and Quick Actions */}
          <div className="generator-header-bar">
            <div className="generator-title-group">
              <span className="generator-eyebrow">Your plan</span>
              <h2 className="generator-main-title">Calculate your nutrition plan</h2>
              <p className="generator-subtitle">
                Add a few details and we will calculate your energy needs, macronutrient targets, and a day of meals built around them.
              </p>
            </div>

            <div className="generator-actions">
              <button className="btn-demo-quick" type="button" onClick={() => loadDemoProfile(true)}>
                Demo profile
              </button>
              <button className="btn-reset-quick" type="button" onClick={resetForm}>
                Reset
              </button>
              <button
                id="history-drawer-toggle"
                className="btn-demo-quick"
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                title="View saved nutrition plans"
              >
                Saved plans{history.length > 0 ? ` (${history.length})` : ""}
              </button>
            </div>
          </div>

          {/* Live Status Banner */}
          {statusMessage && (
            <div className="status-banner" aria-live="polite">
              {statusMessage}
            </div>
          )}

          {/* History Slide-out Drawer */}
          {showHistory && (
            <div className="history-drawer">
              <div className="history-header">
                <h3>Saved plans</h3>
                <button className="close-btn" type="button" onClick={() => setShowHistory(false)} aria-label="Close saved plans">×</button>
              </div>
              {history.length === 0 ? (
                <p className="no-history">No saved plans yet. Generate your first plan to see it here.</p>
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
                        setStatusMessage(`Restored saved plan for ${h.user_id} (${h.date})`);
                        setTimeout(() => {
                          const resEl = document.getElementById("results-dashboard");
                          if (resEl) {
                            resEl.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 100);
                      }}
                    >
                      <div>
                        <strong>{h.user_id}</strong>
                        <span className="history-date">{h.is_weekly ? "7-day plan" : "1-day plan"} · {h.date}</span>
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
              <label htmlFor="profile-name">Full name (optional)</label>
              <input
                id="profile-name"
                name="name"
                placeholder="e.g. Aarav Sharma (or leave blank for 'You')"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="profile-age">Age</label>
                <input
                  id="profile-age"
                  name="age"
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Years"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="profile-sex">Sex</label>
                <select id="profile-sex" name="sex" value={form.sex} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="profile-activity">Activity level</label>
                <select id="profile-activity" name="activity" value={form.activity} onChange={handleChange}>
                  <option value="low">Low — mostly seated</option>
                  <option value="medium">Moderate — 3–4 workouts</option>
                  <option value="high">High — daily training</option>
                </select>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <div className="field-label-row">
                  <label htmlFor="profile-height">Height ({unitSystem === "metric" ? "cm" : "in"})</label>
                  <button type="button" className="unit-toggle" onClick={toggleUnitSystem}>
                    Use {unitSystem === "metric" ? "imperial" : "metric"}
                  </button>
                </div>
                <input
                  id="profile-height"
                  name="height_cm"
                  type="number"
                  min={unitSystem === "metric" ? 50 : 20}
                  max={unitSystem === "metric" ? 250 : 98}
                  placeholder={unitSystem === "metric" ? "Height in cm" : "Total inches"}
                  value={form.height_cm}
                  onChange={handleChange}
                  required
                />
                <span className="field-hint">
                  {unitSystem === "metric" ? "Centimetres" : "Total inches, e.g. 70"}
                </span>
              </div>
              <div className="field">
                <label htmlFor="profile-weight">Weight ({unitSystem === "metric" ? "kg" : "lb"})</label>
                <input
                  id="profile-weight"
                  name="weight_kg"
                  type="number"
                  min={unitSystem === "metric" ? 20 : 44}
                  max={unitSystem === "metric" ? 600 : 1300}
                  placeholder={unitSystem === "metric" ? "Weight in kg" : "Weight in pounds"}
                  value={form.weight_kg}
                  onChange={handleChange}
                  required
                />
                <span className="field-hint">
                  {unitSystem === "metric" ? "Kilograms" : "Pounds"}
                </span>
              </div>
              <div className="field">
                <label htmlFor="profile-goal">Fitness goal</label>
                <select id="profile-goal" name="goal" value={form.goal} onChange={handleChange}>
                  <option value="weight_loss">Weight loss — calorie deficit</option>
                  <option value="muscle_gain">Muscle gain — lean surplus</option>
                  <option value="maintain">Maintain weight</option>
                </select>
              </div>
            </div>

            {/* Live biometric estimate */}
            {liveMetrics && (
              <BmiGaugeVisualizer
                bmi={liveMetrics.bmi}
                category={liveMetrics.category}
                catColor={liveMetrics.catColor}
                tdee={liveMetrics.tdee}
                waterLiters={liveMetrics.waterLiters}
              />
            )}

            <div className="field-row fields-2">
              <div className="field">
                <label htmlFor="profile-diet">Diet preference</label>
                <select id="profile-diet" name="diet" value={form.diet} onChange={handleChange}>
                  <option value="indian vegetarian">Indian vegetarian</option>
                  <option value="indian vegan">Indian vegan (dairy-free)</option>
                  <option value="indian eggetarian">Eggetarian</option>
                  <option value="indian non-vegetarian">Indian non-vegetarian</option>
                  <option value="balanced">Balanced (vegetarian and non-vegetarian)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="profile-allergies">Allergies and exclusions</label>
                <input
                  id="profile-allergies"
                  name="allergies"
                  placeholder="e.g. milk, peanuts, shellfish"
                  value={form.allergies}
                  onChange={handleChange}
                />
                <span className="field-hint">Separate multiple items with commas.</span>
              </div>
            </div>

            {statusMessage && (
              <div className="form-inline-status">
                <Icon.leaf style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>{statusMessage}</span>
              </div>
            )}

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
                    <span>Generating daily plan…</span>
                  </>
                ) : (
                  "Generate 1-day plan"
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
                    <span>Building weekly plan…</span>
                  </>
                ) : (
                  "Generate 7-day plan"
                )}
              </button>
            </div>
          </form>

          {/* Daily Hydration Tracker Component */}
          <WaterTracker weight_kg={form.weight_kg || 70} />

          {/* Calorie Progress Tracker */}
          {mealPlan && (
            <CalorieTracker
              plan={mealPlan}
              eatenMeals={eatenMeals}
              currentDay={selectedDay}
              onToggleMeal={(name) =>
                setEatenMeals((prev) => ({ ...prev, [name]: !prev[name] }))
              }
            />
          )}

          {/* Results Card */}
          {mealPlan ? (
            <MealPlanDisplay
              plan={mealPlan}
              onSwapMeal={handleSwapMeal}
              profile={form}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onStartCooking={(meal) => setCookingMeal(meal)}
              onOpenFridgeSheet={() => setShowFridgeSheet(true)}
            />
          ) : (
            <div className="empty-state">
              <span className="section-eyebrow">Your plan</span>
              <h2>Nutrition tailored to your everyday life</h2>
              <p>
                Add your details above to generate a daily or 7-day plan with practical recipes, clear macro targets, and a categorized grocery list.
              </p>
              {history.length > 0 && (
                <div className="empty-history-action">
                  <button
                    id="empty-state-history-btn"
                    className="btn btn-outline"
                    type="button"
                    onClick={() => {
                      setShowHistory(true);
                      const el = document.getElementById("protocol-engine");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Icon.notebook className="icon" />
                    View saved plans ({history.length})
                  </button>
                </div>
              )}
              <div className="empty-features">
                <div className="feature-card">
                  <h3>7-day weekly planner</h3>
                  <p>Varied recipes from Monday to Sunday, built around your daily calorie target.</p>
                </div>
                <div className="feature-card">
                  <h3>Macro breakdowns</h3>
                  <p>A clear view of protein, carbohydrates, and fats for every plan.</p>
                </div>
                <div className="feature-card">
                  <h3>Step-by-step recipes</h3>
                  <p>Prep time, cook time, ingredients, and concise methods for each meal.</p>
                </div>
                <div className="feature-card">
                  <h3>Hydration tracking</h3>
                  <p>A personalized daily water goal with simple one-tap logging.</p>
                </div>
              </div>
            </div>
          )}
          </div>
        </section>

        {/* ZONE 8: Institutional Footer */}
        <InstitutionalFooter
          onNavigateSection={handleNavigateSection}
          onSelectDiet={handleFooterSelectDiet}
          onShowLegalModal={handleShowLegalModal}
        />

        {/* Showcase Recipe Modal Preview */}
        {previewRecipe && (
          <RecipeModal
            meal={previewRecipe}
            onClose={() => setPreviewRecipe(null)}
            onStartCooking={(meal) => setCookingMeal(meal)}
          />
        )}

        {/* Fullscreen Interactive Kitchen Cooking Mode */}
        {cookingMeal && (
          <KitchenCookingMode
            meal={cookingMeal}
            onClose={() => setCookingMeal(null)}
          />
        )}

        {/* Printable Fridge-Ready Weekly Sheet */}
        {showFridgeSheet && (
          <PrintableFridgeSheet
            plan={mealPlan}
            profile={form}
            onClose={() => setShowFridgeSheet(false)}
          />
        )}

        {/* Institutional Informational Modal (Privacy / Terms / Contact) */}
        {legalModal && (
          <div className="modal-backdrop" onClick={() => setLegalModal(null)} role="dialog" aria-modal="true">
            <div className="recipe-modal" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
              <div className="recipe-modal-header">
                <h2>{legalModal.title}</h2>
                <button className="close-btn" type="button" onClick={() => setLegalModal(null)}>✕</button>
              </div>
              <div style={{ padding: "18px 0", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-body)" }}>
                {legalModal.body}
              </div>
              <div className="recipe-modal-footer">
                <button className="secondary-btn" type="button" onClick={() => setLegalModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
