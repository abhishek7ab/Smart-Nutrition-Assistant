// nutritionEngineClient.js - Robust Client-Side Precision Nutrition Engine & Meal Database

export const MEAL_POOLS = {
  indian_veg: {
    breakfast: [
      {
        name: "Breakfast: Moong Dal Chilla with Mint Chutney & Curd",
        ingredients: ["2 moong dal chillas", "75g fresh paneer filling", "1 tbsp mint chutney", "1 cup low-fat curd"],
        reason: "High-protein vegetarian breakfast rich in bioavailable plant protein, iron, and gut-friendly probiotics.",
        prep_time: "10 mins",
        cook_time: "15 mins",
        difficulty: "Easy",
        instructions: [
          "Soak split yellow moong dal for 30 mins, then grind into a smooth batter with ginger and green chillies.",
          "Heat a non-stick pan with minimal oil spray and spread a ladle of batter thinly.",
          "Sprinkle crumbled paneer and fresh coriander on top, flip gently, and cook both sides until golden brown.",
          "Serve warm with fresh mint-coriander chutney and 1 cup of curd."
        ]
      },
      {
        name: "Breakfast: Vegetable Oats Upma with Peanuts & Boiled Sprouts",
        ingredients: ["1 cup rolled oats", "1/2 cup mixed diced veggies (carrots, peas, beans)", "1 tbsp roasted peanuts", "1/2 cup boiled moong sprouts", "1 tsp mustard seeds and curry leaves"],
        reason: "High in beta-glucan fiber for cholesterol control and sustained glycemic release.",
        prep_time: "10 mins",
        cook_time: "12 mins",
        difficulty: "Easy",
        instructions: [
          "Dry roast rolled oats in a skillet for 3 mins until fragrant.",
          "Splutter mustard seeds, green chilli, and curry leaves in 1 tsp olive oil or ghee.",
          "Sauté diced vegetables and boiled sprouts until tender-crisp.",
          "Add 2 cups of hot water and roasted oats, simmering for 4 minutes until thick and fluffy."
        ]
      },
      {
        name: "Breakfast: Paneer Stuffed Multigrain Paratha with Curd",
        ingredients: ["2 multigrain rotis/parathas", "80g spiced low-fat paneer", "1 cup probiotic curd", "1/2 cup cucumber slices"],
        reason: "Wholesome complex carbohydrates paired with slow-digesting casein protein.",
        prep_time: "12 mins",
        cook_time: "15 mins",
        difficulty: "Medium",
        instructions: [
          "Mix grated paneer with chopped green chillies, coriander, cumin powder, and a pinch of salt.",
          "Stuff into whole wheat or multigrain dough and roll out smoothly.",
          "Cook on a medium hot tawa with a light brush of ghee until crisp.",
          "Enjoy with probiotic plain curd and cooling cucumber slices."
        ]
      }
    ],
    lunch: [
      {
        name: "Lunch: Paneer Tikka with Yellow Tadka Dal & Brown Rice",
        ingredients: ["120g grilled paneer tikka", "3/4 cup yellow tadka dal", "3/4 cup brown rice", "1 cup kachumber salad (cucumber, tomato, onion)"],
        reason: "Complete amino acid profile pairing legumes with brown rice, balanced with high-calcium dairy.",
        prep_time: "15 mins",
        cook_time: "20 mins",
        difficulty: "Medium",
        instructions: [
          "Marinate paneer cubes with curd, turmeric, cumin, garam masala, and lemon juice for 15 mins.",
          "Grill paneer on a skillet or air fryer for 8 mins until charred at the edges.",
          "Serve with freshly prepared yellow dal tadka, steamed brown rice, and fresh lemon kachumber."
        ]
      },
      {
        name: "Lunch: High-Protein Rajma Masala with Quinoa & Steamed Beans",
        ingredients: ["1 cup cooked red kidney beans (rajma)", "3/4 cup cooked quinoa", "1 cup steamed french beans & carrots", "1 cup plain raita"],
        reason: "Dense in plant protein, dietary fiber, magnesium, and resistant starch.",
        prep_time: "15 mins",
        cook_time: "25 mins",
        difficulty: "Medium",
        instructions: [
          "Pressure cook soaked rajma with aromatics (onion, ginger-garlic, tomato purée, and garam masala).",
          "Simmer rajma until the gravy is rich and velvety.",
          "Serve over fluffy cooked quinoa with lightly spiced cucumber raita and steamed vegetables."
        ]
      },
      {
        name: "Lunch: Soya Chunk Matar Curry with Multigrain Rotis & Curd",
        ingredients: ["50g textured soya chunks", "1/2 cup green peas", "2 multigrain rotis", "1 cup mixed vegetable salad", "1/2 cup curd"],
        reason: "Massive plant protein concentration (over 25g protein from soya alone) with low fat.",
        prep_time: "10 mins",
        cook_time: "18 mins",
        difficulty: "Easy",
        instructions: [
          "Boil soya chunks in water with a pinch of salt for 5 mins, rinse and squeeze out excess water.",
          "Sauté onion, garlic, tomatoes, and spices in 1 tsp oil, then add green peas and soya chunks.",
          "Add 1 cup water and simmer for 10 minutes until flavors blend thoroughly.",
          "Serve hot with warm multigrain rotis and cooling salad."
        ]
      }
    ],
    dinner: [
      {
        name: "Dinner: Palak Paneer with Whole Wheat Phulkas & Salad",
        ingredients: ["100g paneer cubes", "1.5 cups blanched spinach purée", "2 whole wheat phulkas (no oil)", "1 cup cucumber salad"],
        reason: "Rich in lutein, iron, and magnesium to promote restful sleep and night muscle synthesis.",
        prep_time: "12 mins",
        cook_time: "15 mins",
        difficulty: "Easy",
        instructions: [
          "Blanch washed spinach leaves in boiling water for 2 mins, then plunge into cold water and blend with green chilli.",
          "Sauté garlic, cumin seeds, and chopped onion in 1 tsp ghee, then pour in spinach purée.",
          "Stir in soft paneer cubes and a pinch of garam masala. Simmer on low heat for 4 mins.",
          "Serve warm with hot oil-free phulkas."
        ]
      },
      {
        name: "Dinner: Moong Dal Khichdi with Roasted Papad & Curd",
        ingredients: ["1.25 cups moong dal & brown rice khichdi", "1 cup roasted baingan bharta (spiced eggplant)", "1/2 cup curd", "1 roasted papad"],
        reason: "Light, highly digestible dinner promoting gut restoration and optimal recovery.",
        prep_time: "10 mins",
        cook_time: "20 mins",
        difficulty: "Easy",
        instructions: [
          "Cook split yellow moong dal and brown rice with turmeric, ginger, and cumin in 3.5 cups water.",
          "Roast whole eggplant on open flame, peel, and mash with sauteed onions, tomatoes, and mustard oil.",
          "Serve steaming khichdi alongside baingan bharta and roasted papad."
        ]
      },
      {
        name: "Dinner: Grilled Tofu & Vegetable Stir Fry with Brown Rice",
        ingredients: ["150g firm tofu cubes", "1 cup broccoli florets", "1/2 cup sliced bell peppers", "1/2 cup brown rice", "1 tbsp toasted sesame seeds"],
        reason: "Clean plant protein, low saturated fat, and micronutrient density.",
        prep_time: "10 mins",
        cook_time: "12 mins",
        difficulty: "Easy",
        instructions: [
          "Press and cube firm tofu. Pan-sear in sesame oil until golden on all sides.",
          "Toss broccoli, bell peppers, and snap peas on high heat for 3-4 minutes until vibrant.",
          "Drizzle with tamari/soy sauce and ginger, then serve over warm brown rice with sesame seeds."
        ]
      }
    ],
    snack: [
      {
        name: "Snack: Roasted Makhana with Almonds & Green Tea",
        ingredients: ["1.5 cups roasted foxnuts (makhana)", "10 roasted almonds", "1 cup brewed green tea with lemon"],
        reason: "Anti-inflammatory polyphenols and clean minerals (magnesium, calcium) with zero sugar.",
        prep_time: "3 mins",
        cook_time: "0 mins",
        difficulty: "Easy",
        instructions: ["Dry roast makhana in a pan with a pinch of rock salt and black pepper until crispy. Pair with green tea."]
      },
      {
        name: "Snack: Sprouted Moong & Pomegranate Chaat",
        ingredients: ["3/4 cup steamed sprouted moong", "1/4 cup pomegranate pearls", "1 tbsp lemon juice", "1/4 tsp chaat masala", "1 tbsp roasted pumpkin seeds"],
        reason: "Active digestive enzymes, vitamin C, and zinc to combat afternoon fatigue.",
        prep_time: "5 mins",
        cook_time: "0 mins",
        difficulty: "Easy",
        instructions: ["Combine sprouted moong and pomegranate pearls with lemon juice and chaat masala. Top with pumpkin seeds."]
      }
    ]
  },
  vegan: {
    breakfast: [
      {
        name: "Breakfast: Tofu Scramble with Sautéed Spinach & Toast",
        ingredients: ["150g firm tofu crumbled", "1.5 cups baby spinach", "2 slices 100% whole grain sourdough", "1 tbsp nutritional yeast", "1/2 tsp turmeric"],
        reason: "Complete amino acids with bioavailable iron, B-vitamins, and zero cholesterol.",
        prep_time: "8 mins",
        cook_time: "10 mins",
        difficulty: "Easy",
        instructions: [
          "Crumble firm tofu and sauté with olive oil, turmeric, black salt, and nutritional yeast.",
          "Add baby spinach until wilted.",
          "Serve on toasted sourdough slices."
        ]
      }
    ],
    lunch: [
      {
        name: "Lunch: Chickpea Buddha Bowl with Tahini & Sweet Potato",
        ingredients: ["1 cup roasted chickpeas", "1/2 cup quinoa", "1 cup roasted sweet potato wedges", "1 cup kale/spinach", "2 tbsp lemon-tahini dressing"],
        reason: "Complex slow-burning carbohydrates, prebiotic fiber, and heart-healthy sesame fats.",
        prep_time: "12 mins",
        cook_time: "20 mins",
        difficulty: "Easy",
        instructions: [
          "Toss cooked chickpeas with smoked paprika and cumin, roasting for 15 mins.",
          "Assemble bowl with fluffy quinoa, massaged kale, and roasted sweet potato wedges.",
          "Drizzle with lemon-garlic tahini dressing."
        ]
      }
    ],
    dinner: [
      {
        name: "Dinner: Red Lentil Dal with Wilted Kale & Brown Rice",
        ingredients: ["1 cup red lentil (masoor) dal", "1 cup chopped organic kale", "3/4 cup brown rice", "1 tsp turmeric and ginger-garlic paste"],
        reason: "Easily digestible legume protein rich in folate, zinc, and dietary fiber.",
        prep_time: "10 mins",
        cook_time: "20 mins",
        difficulty: "Easy",
        instructions: [
          "Simmer red lentils with turmeric, minced ginger, and garlic in 2.5 cups water until creamy.",
          "Fold in chopped kale during the last 3 minutes of cooking.",
          "Serve over warm brown rice."
        ]
      }
    ],
    snack: [
      {
        name: "Snack: Chia Seed Pudding with Fresh Berries",
        ingredients: ["3 tbsp chia seeds", "3/4 cup unsweetened almond milk", "1/2 cup fresh blueberries & raspberries", "1/2 tsp vanilla extract"],
        reason: "High concentration of ALA Omega-3 fatty acids, soluble prebiotic fiber, and antioxidants.",
        prep_time: "5 mins",
        cook_time: "0 mins",
        difficulty: "Easy",
        instructions: ["Whisk chia seeds in almond milk and refrigerate for 20 minutes until set. Top with fresh berries."]
      }
    ]
  },
  non_veg: {
    breakfast: [
      {
        name: "Breakfast: 3-Egg Omelet with Sautéed Mushrooms & Toast",
        ingredients: ["3 whole pasture-raised eggs", "1/2 cup sliced button mushrooms", "1 cup baby spinach", "2 slices whole wheat sourdough", "1 tsp olive oil"],
        reason: "Highest biological value protein (eggs) rich in choline, lutein, and vitamin B12.",
        prep_time: "5 mins",
        cook_time: "8 mins",
        difficulty: "Easy",
        instructions: [
          "Whisk eggs with a pinch of sea salt and crushed black pepper.",
          "Sauté mushrooms and spinach in 1 tsp olive oil until tender.",
          "Pour in eggs and cook gently over medium-low heat until set.",
          "Serve with toasted whole wheat sourdough."
        ]
      }
    ],
    lunch: [
      {
        name: "Lunch: Grilled Herb Chicken Breast with Quinoa & Roasted Veggies",
        ingredients: ["180g skinless chicken breast", "3/4 cup cooked tricolor quinoa", "1 cup roasted zucchini & bell peppers", "1 tbsp extra virgin olive oil"],
        reason: "Ultra-lean complete protein maximizing muscle protein synthesis with low saturated fat.",
        prep_time: "10 mins",
        cook_time: "15 mins",
        difficulty: "Easy",
        instructions: [
          "Marinate chicken with olive oil, lemon juice, garlic, rosemary, and thyme.",
          "Grill for 6-7 minutes per side until internal temperature reaches 74°C (165°F).",
          "Serve over fluffy quinoa with roasted vegetables."
        ]
      }
    ],
    dinner: [
      {
        name: "Dinner: Pan-Seared Salmon Fillet with Steamed Asparagus & Sweet Potato",
        ingredients: ["180g wild-caught salmon fillet", "1 cup steamed asparagus spears", "1/2 cup baked mashed sweet potato", "1 lemon wedge"],
        reason: "Dense in EPA & DHA marine Omega-3 fatty acids, promoting cardiovascular health and recovery.",
        prep_time: "8 mins",
        cook_time: "12 mins",
        difficulty: "Easy",
        instructions: [
          "Season salmon with black pepper, sea salt, and a squeeze of fresh lemon.",
          "Pan-sear in olive oil skin-side down for 4 minutes, flip and cook for 3 more minutes.",
          "Plate alongside steamed asparagus and baked sweet potato."
        ]
      }
    ],
    snack: [
      {
        name: "Snack: Boiled Eggs with Mixed Nuts & Cucumber",
        ingredients: ["2 hard-boiled eggs", "10 raw almonds", "1 sliced English cucumber with sea salt"],
        reason: "Pure sustained energy with zero blood sugar spikes.",
        prep_time: "3 mins",
        cook_time: "0 mins",
        difficulty: "Easy",
        instructions: ["Slice boiled eggs and season with sea salt and black pepper. Pair with almonds and crisp cucumber."]
      }
    ]
  }
};

// Calculate Macro Breakdown
export function calculateMacros(calories, goal = "maintain") {
  const g = (goal || "").toLowerCase();
  let pPct = 0.25;
  let cPct = 0.50;
  let fPct = 0.25;

  if (g.includes("loss")) {
    pPct = 0.35;
    cPct = 0.35;
    fPct = 0.30;
  } else if (g.includes("gain") || g.includes("muscle")) {
    pPct = 0.30;
    cPct = 0.50;
    fPct = 0.20;
  }

  const p = Math.round((calories * pPct) / 4);
  const c = Math.round((calories * cPct) / 4);
  const f = Math.round((calories * fPct) / 9);

  return {
    protein_g: p,
    carbs_g: c,
    fats_g: f
  };
}

// Compute BMR & TDEE
export function computeBmrTdee(profile) {
  const w = parseFloat(profile.weight_kg) || 70;
  const h = parseFloat(profile.height_cm) || 175;
  const age = parseInt(profile.age, 10) || 25;
  const sex = (profile.sex || "male").toLowerCase();
  const activity = (profile.activity || "medium").toLowerCase();
  const goal = (profile.goal || "maintain").toLowerCase();

  let bmr = 10 * w + 6.25 * h - 5 * age;
  bmr += (sex === "male" ? 5 : -161);

  let actMult = 1.45;
  if (activity.includes("low")) actMult = 1.2;
  else if (activity.includes("high")) actMult = 1.725;

  const tdee = Math.round(bmr * actMult);
  let targetCal = tdee;

  if (goal.includes("loss")) {
    targetCal = Math.max(1200, Math.round(tdee - 500));
  } else if (goal.includes("gain") || goal.includes("muscle")) {
    targetCal = Math.round(tdee + 400);
  }

  return {
    bmr: Math.round(bmr),
    tdee,
    target_calories: targetCal
  };
}

function getPoolKey(diet) {
  const d = (diet || "").toLowerCase();
  if (d.includes("vegan")) return "vegan";
  if (d.includes("non") || d.includes("egg") || d.includes("chicken") || d.includes("fish") || d.includes("meat")) {
    return "non_veg";
  }
  return "indian_veg";
}

// Generate 1-Day Plan
export function generateClientSingleDayPlan(profile, dayName = "Today", offset = 0) {
  const { bmr, tdee, target_calories } = computeBmrTdee(profile);
  const totalMacros = calculateMacros(target_calories, profile.goal);

  const poolKey = getPoolKey(profile.diet);
  const pool = MEAL_POOLS[poolKey] || MEAL_POOLS.indian_veg;

  const bCal = Math.round(target_calories * 0.25);
  const lCal = Math.round(target_calories * 0.35);
  const dCal = Math.round(target_calories * 0.30);
  const sCal = Math.round(target_calories * 0.10);

  const bList = pool.breakfast || MEAL_POOLS.indian_veg.breakfast;
  const lList = pool.lunch || MEAL_POOLS.indian_veg.lunch;
  const dList = pool.dinner || MEAL_POOLS.indian_veg.dinner;
  const sList = pool.snack || MEAL_POOLS.indian_veg.snack;

  const bItem = bList[offset % bList.length];
  const lItem = lList[offset % lList.length];
  const dItem = dList[offset % dList.length];
  const sItem = sList[offset % sList.length];

  const meals = [
    {
      ...bItem,
      approx_calories: bCal,
      macros: calculateMacros(bCal, profile.goal)
    },
    {
      ...lItem,
      approx_calories: lCal,
      macros: calculateMacros(lCal, profile.goal)
    },
    {
      ...dItem,
      approx_calories: dCal,
      macros: calculateMacros(dCal, profile.goal)
    },
    {
      ...sItem,
      approx_calories: sCal,
      macros: calculateMacros(sCal, profile.goal)
    }
  ];

  return {
    day: dayName,
    user_id: profile.name || "User",
    date: new Date().toISOString().split("T")[0],
    bmr,
    tdee,
    target_calories,
    total_macros: totalMacros,
    meals,
    is_weekly: false
  };
}

// Generate 7-Day Plan
export function generateClientWeeklyPlan(profile) {
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const daysObj = {};
  const allIngredients = [];

  dayNames.forEach((day, idx) => {
    const dayPlan = generateClientSingleDayPlan(profile, day, idx);
    daysObj[day] = dayPlan;

    dayPlan.meals.forEach((m) => {
      if (m.ingredients && Array.isArray(m.ingredients)) {
        allIngredients.push(...m.ingredients);
      }
    });
  });

  // Categorize grocery items
  const uniqueIngs = Array.from(new Set(allIngredients));
  const categorized = {
    "Vegetables & Greens": [],
    "Proteins & Dairy": [],
    "Grains & Staples": [],
    "Pantry & Seasonings": []
  };

  uniqueIngs.forEach((item) => {
    const str = item.toLowerCase();
    if (str.includes("paneer") || str.includes("curd") || str.includes("egg") || str.includes("tofu") || str.includes("chicken") || str.includes("salmon") || str.includes("yogurt") || str.includes("milk") || str.includes("soya")) {
      categorized["Proteins & Dairy"].push(item);
    } else if (str.includes("rice") || str.includes("quinoa") || str.includes("roti") || str.includes("paratha") || str.includes("oats") || str.includes("sourdough") || str.includes("chillas") || str.includes("dal") || str.includes("rajma") || str.includes("lentil") || str.includes("sprouts") || str.includes("khichdi")) {
      categorized["Grains & Staples"].push(item);
    } else if (str.includes("spinach") || str.includes("cucumber") || str.includes("tomato") || str.includes("onion") || str.includes("broccoli") || str.includes("carrots") || str.includes("beans") || str.includes("mushrooms") || str.includes("berries") || str.includes("figs") || str.includes("lime") || str.includes("peppers") || str.includes("asparagus") || str.includes("potato") || str.includes("peas") || str.includes("salad") || str.includes("baingan")) {
      categorized["Vegetables & Greens"].push(item);
    } else {
      categorized["Pantry & Seasonings"].push(item);
    }
  });

  const { bmr, tdee, target_calories } = computeBmrTdee(profile);
  const totalMacros = calculateMacros(target_calories, profile.goal);

  return {
    is_weekly: true,
    user_id: profile.name || "User",
    date: new Date().toISOString().split("T")[0],
    bmr,
    tdee,
    target_calories,
    total_macros: totalMacros,
    days: daysObj,
    categorized_grocery_list: categorized
  };
}

// Generate Meal Swap
export function generateClientMealSwap(profile, mealIndex = 0, currentMealName = "") {
  const { target_calories } = computeBmrTdee(profile);
  const slotCalRatios = [0.25, 0.35, 0.30, 0.10];
  const slotNames = ["breakfast", "lunch", "dinner", "snack"];
  const slot = slotNames[mealIndex] || "lunch";
  const cal = Math.round(target_calories * (slotCalRatios[mealIndex] || 0.30));

  const poolKey = getPoolKey(profile.diet);
  const pool = MEAL_POOLS[poolKey] || MEAL_POOLS.indian_veg;
  const list = pool[slot] || MEAL_POOLS.indian_veg[slot] || MEAL_POOLS.indian_veg.lunch;

  // Filter out current meal if possible
  const filtered = list.filter((m) => m.name !== currentMealName);
  const picked = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : list[0];

  return {
    ...picked,
    approx_calories: cal,
    macros: calculateMacros(cal, profile.goal)
  };
}
