// Client nutrition engine — uses the same data/meal_catalog.json as the Python backend.
import catalog from "./data/meal_catalog.json";

export const MEAL_POOLS = catalog.diets;

const SLOTS = ["breakfast", "lunch", "dinner", "snack"];

const ALLERGEN_ALIASES = {
  dairy: ["dairy", "milk", "curd", "paneer", "yogurt", "yoghurt", "cheese", "ghee", "raita", "butter", "cream", "whey", "kadhi", "chaas", "buttermilk"],
  milk: ["dairy", "milk", "curd", "paneer", "yogurt", "yoghurt", "cheese", "ghee", "raita", "butter", "cream", "whey", "kadhi", "chaas", "buttermilk"],
  nut: ["nut", "nuts", "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "peanut", "groundnut"],
  nuts: ["nut", "nuts", "almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "peanut", "groundnut"],
  peanut: ["peanut", "groundnut"],
  gluten: ["gluten", "wheat", "roti", "paratha", "phulka", "toast", "sourdough", "bread", "seitan", "daliya"],
  soy: ["soy", "soya", "tofu", "tempeh", "edamame"],
  soya: ["soy", "soya", "tofu", "tempeh", "edamame"],
  egg: ["egg", "eggs", "omelette", "omelet"],
  fish: ["fish", "salmon", "rohu", "cod", "tuna", "seafood"],
  shellfish: ["shellfish", "shrimp", "prawn", "crab", "lobster"],
  sesame: ["sesame", "tahini"],
};

function expandAllergyKeywords(allergies) {
  const raw = Array.isArray(allergies)
    ? allergies
    : String(allergies || "").split(",").map((a) => a.trim()).filter(Boolean);
  const out = [];
  const seen = new Set();
  raw.forEach((item) => {
    const key = String(item).trim().toLowerCase();
    if (!key) return;
    const aliases = ALLERGEN_ALIASES[key] || [key];
    [key, ...aliases].forEach((kw) => {
      if (!seen.has(kw)) {
        seen.add(kw);
        out.push(kw);
      }
    });
  });
  return out;
}

function mealMatchesAllergy(item, keywords) {
  if (!keywords.length) return false;
  const tags = (item.allergens || []).map((a) => String(a).toLowerCase());
  const ingText = (item.ingredients || [])
    .map((ing) => (typeof ing === "string" ? ing : JSON.stringify(ing)))
    .join(" ")
    .toLowerCase();
  const combined = `${ingText} ${item.name || ""} ${tags.join(" ")}`.toLowerCase();
  return keywords.some((kw) => tags.includes(kw) || combined.includes(kw));
}

export function filterAllergies(pool, allergies) {
  if (!pool || pool.length === 0) return [];
  const keywords = expandAllergyKeywords(allergies);
  if (keywords.length === 0) return [...pool];
  return pool.filter((item) => !mealMatchesAllergy(item, keywords));
}

function applyPreferences(pool, profile) {
  let filtered = [...pool];
  const cuisine = (profile.cuisine || "any").toLowerCase();
  if (cuisine === "indian" || cuisine === "global") {
    const preferred = filtered.filter((m) => (m.cuisine || "indian") === cuisine);
    if (preferred.length) filtered = preferred;
  }
  if ((profile.budget || "medium").toLowerCase() === "low") {
    const preferred = filtered.filter((m) => (m.budget || "low") !== "high");
    if (preferred.length) filtered = preferred;
  }
  const conditions = (profile.conditions || []).map((c) => String(c).toLowerCase());
  if (conditions.includes("diabetes")) {
    const preferred = filtered.filter((m) => m.diabetes_friendly !== false);
    if (preferred.length) filtered = preferred;
  }
  if (conditions.includes("pcos")) {
    const preferred = filtered.filter((m) => m.pcos_friendly !== false);
    if (preferred.length) filtered = preferred;
  }
  return filtered;
}

export function calculateMacros(calories, goal = "maintain", conditions = []) {
  const g = (goal || "").toLowerCase();
  const cond = (conditions || []).map((c) => String(c).toLowerCase());
  let pPct = 0.25;
  let cPct = 0.50;
  let fPct = 0.25;
  if (cond.includes("diabetes") || cond.includes("pcos") || g.includes("loss")) {
    pPct = 0.35;
    cPct = 0.35;
    fPct = 0.30;
  } else if (g.includes("gain") || g.includes("muscle")) {
    pPct = 0.30;
    cPct = 0.50;
    fPct = 0.20;
  }
  return {
    protein_g: Math.round((calories * pPct) / 4),
    carbs_g: Math.round((calories * cPct) / 4),
    fats_g: Math.round((calories * fPct) / 9),
  };
}

export function calorieFloor(profile) {
  const age = parseInt(profile.age, 10) || 25;
  const sex = (profile.sex || "male").toLowerCase();
  if (age < 18) return sex === "male" ? 1600 : 1400;
  return sex === "male" ? 1500 : 1200;
}

export function computeBmrTdee(profile) {
  const w = parseFloat(profile.weight_kg) || 70;
  const h = parseFloat(profile.height_cm) || 175;
  const age = parseInt(profile.age, 10) || 25;
  const sex = (profile.sex || "male").toLowerCase();
  const activity = (profile.activity || "medium").toLowerCase();
  const goal = (profile.goal || "maintain").toLowerCase();

  let bmr = 10 * w + 6.25 * h - 5 * age;
  bmr += sex === "male" ? 5 : -161;

  let actMult = 1.45;
  if (activity.includes("low")) actMult = 1.2;
  else if (activity.includes("high")) actMult = 1.725;

  const tdee = Math.round(bmr * actMult);
  let targetCal = tdee;
  if (goal.includes("loss")) targetCal = Math.round(tdee - 500);
  else if (goal.includes("gain") || goal.includes("muscle")) targetCal = Math.round(tdee + 400);
  targetCal = Math.max(calorieFloor(profile), targetCal);

  return { bmr: Math.round(bmr), tdee, target_calories: targetCal };
}

export function getPoolKey(diet) {
  const d = (diet || "").toLowerCase();
  if (d.includes("vegan")) return "vegan";
  if (d.includes("non") || d.includes("chicken") || d.includes("fish") || d.includes("meat")) return "non_veg";
  if (d.includes("egg")) return "egg_veg";
  return "indian_veg";
}

function blockedMeal(slot, allergies) {
  const listed = (Array.isArray(allergies) ? allergies : [allergies]).filter(Boolean).join(", ") || "your listed allergies";
  const label = slot.charAt(0).toUpperCase() + slot.slice(1);
  return {
    name: `${label}: No allergy-safe option`,
    ingredients: [],
    approx_calories: 0,
    macros: { protein_g: 0, carbs_g: 0, fats_g: 0 },
    reason: `Every ${slot} recipe in this diet contains ${listed}. We did not substitute an unsafe meal.`,
    prep_time: "—",
    cook_time: "—",
    difficulty: "—",
    instructions: ["Remove one allergy keyword, or switch diet.", "Then generate the plan again."],
    unavailable: true,
    allergy_blocked: true,
  };
}

function buildMeal(item) {
  const n = item.nutrition || {};
  return {
    ...item,
    approx_calories: Number(n.calories) || 0,
    macros: {
      protein_g: Number(n.protein_g) || 0,
      carbs_g: Number(n.carbs_g) || 0,
      fats_g: Number(n.fats_g) || 0,
    },
    unavailable: false,
  };
}

function safePool(profile, slot) {
  const poolKey = getPoolKey(profile.diet);
  const raw = (MEAL_POOLS[poolKey] || MEAL_POOLS.indian_veg)[slot] || [];
  return applyPreferences(filterAllergies(raw, profile.allergies), profile);
}

function pickMeal(pool, offset) {
  if (!pool.length) return null;
  return pool[offset % pool.length];
}

function sumMacros(meals) {
  return meals.reduce(
    (acc, m) => ({
      protein_g: acc.protein_g + (Number(m.macros?.protein_g) || 0),
      carbs_g: acc.carbs_g + (Number(m.macros?.carbs_g) || 0),
      fats_g: acc.fats_g + (Number(m.macros?.fats_g) || 0),
    }),
    { protein_g: 0, carbs_g: 0, fats_g: 0 }
  );
}

export function generateClientSingleDayPlan(profile, dayName = "Today", offset = 0) {
  const { bmr, tdee, target_calories } = computeBmrTdee(profile);
  const meals = SLOTS.map((slot, i) => {
    const pool = safePool(profile, slot);
    if (!pool.length) return blockedMeal(slot, profile.allergies);
    return buildMeal(pickMeal(pool, offset + i));
  });
  const actual_calories = meals.reduce((sum, m) => sum + (Number(m.approx_calories) || 0), 0);
  return {
    day: dayName,
    user_id: profile.name || "User",
    date: new Date().toISOString().split("T")[0],
    bmr,
    tdee,
    target_calories,
    actual_calories,
    target_macros: calculateMacros(target_calories, profile.goal, profile.conditions),
    total_macros: sumMacros(meals),
    meals,
    is_weekly: false,
    allergy_blocked_slots: meals.filter((m) => m.unavailable).length,
  };
}

export function generateClientWeeklyPlan(profile) {
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const daysObj = {};
  const allIngredients = [];
  dayNames.forEach((day, idx) => {
    const dayPlan = generateClientSingleDayPlan(profile, day, idx);
    daysObj[day] = dayPlan;
    dayPlan.meals.forEach((m) => {
      if (!m.unavailable && Array.isArray(m.ingredients)) allIngredients.push(...m.ingredients);
    });
  });

  const uniqueIngs = Array.from(new Set(allIngredients));
  const categorized = {
    "Vegetables & Greens": [],
    "Proteins & Dairy": [],
    "Grains & Staples": [],
    "Pantry & Seasonings": [],
  };
  uniqueIngs.forEach((item) => {
    const str = String(item).toLowerCase();
    if (/(paneer|curd|egg|tofu|chicken|salmon|yogurt|milk|soya|fish|tuna|keema|mutton)/.test(str)) {
      categorized["Proteins & Dairy"].push(item);
    } else if (/(rice|quinoa|roti|paratha|oats|sourdough|chilla|dal|rajma|lentil|sprout|khichdi|idli|dosa|millet|poha)/.test(str)) {
      categorized["Grains & Staples"].push(item);
    } else if (/(spinach|cucumber|tomato|onion|broccoli|carrot|beans|mushroom|pepper|salad|palak|kale|apple|guava|berries)/.test(str)) {
      categorized["Vegetables & Greens"].push(item);
    } else {
      categorized["Pantry & Seasonings"].push(item);
    }
  });

  const { bmr, tdee, target_calories } = computeBmrTdee(profile);
  return {
    is_weekly: true,
    user_id: profile.name || "User",
    date: new Date().toISOString().split("T")[0],
    bmr,
    tdee,
    target_calories,
    target_macros: calculateMacros(target_calories, profile.goal, profile.conditions),
    total_macros: daysObj.Monday.total_macros,
    days: daysObj,
    categorized_grocery_list: categorized,
  };
}

export function generateClientMealSwap(profile, mealIndex = 0, currentMealName = "") {
  const slot = SLOTS[mealIndex] || "lunch";
  const pool = safePool(profile, slot).filter((m) => m.name !== currentMealName);
  if (!pool.length) {
    const blocked = blockedMeal(slot, profile.allergies);
    blocked.error = "No allergy-safe swap in this slot";
    return blocked;
  }
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return buildMeal(picked);
}

export function getAllCatalogMeals() {
  const seen = new Set();
  const list = [];
  const diets = catalog.diets || {};
  Object.keys(diets).forEach((dietKey) => {
    const slots = diets[dietKey] || {};
    Object.keys(slots).forEach((slotKey) => {
      const meals = slots[slotKey] || [];
      meals.forEach((m) => {
        if (m && m.name && !seen.has(m.name)) {
          seen.add(m.name);
          list.push(buildMeal(m));
        }
      });
    });
  });
  return list;
}

