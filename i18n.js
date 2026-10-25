// Minimal i18n layer: English source strings with Marathi translations.
// t(key) returns the English key unchanged in English mode, so any string
// missing from the dictionary degrades gracefully instead of breaking.

let LANG = "en";

export function getLang() {
  return LANG;
}

export function setLang(lang) {
  LANG = lang === "mr" ? "mr" : "en";
}

export function t(key, vars) {
  let out = key;
  if (LANG === "mr" && MR_STRINGS[key]) out = MR_STRINGS[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
  }
  return out;
}

const MR_DAYS_SHORT = {
  Monday: "सोम",
  Tuesday: "मंगळ",
  Wednesday: "बुध",
  Thursday: "गुरु",
  Friday: "शुक्र",
  Saturday: "शनि",
  Sunday: "रवि",
};

// Short weekday label used in day pills and the weekly trend chart.
export function dayShort(day) {
  if (LANG === "mr" && MR_DAYS_SHORT[day]) return MR_DAYS_SHORT[day];
  return (day || "").slice(0, 3);
}

const MR_STRINGS = {
  // Header / nav
  "About": "आमच्याबद्दल",
  "Meal plans": "जेवण योजना",
  "Recipes": "पाककृती",
  "Pantry matcher": "स्वयंपाकघर सामग्री",
  "How it works": "कसे कार्य करते",
  "Create my plan": "माझी योजना तयार करा",
  "Light": "लाइट",
  "Dark": "डार्क",
  "☀️ Daylight mode": "☀️ दिवसा मोड",
  "🌙 Natural dark mode": "🌙 नैसर्गिक डार्क मोड",
  "Toggle theme": "थीम बदला",
  "Toggle navigation": "नेव्हिगेशन उघडा/बंद करा",

  // Hero
  "Whole-Food Clinical Nutrition": "नैसर्गिक खाद्यपदार्थ आधारित पोषण",
  "Nourishing real food,": "पौष्टिक खरे जेवण,",
  "scientifically tailored": "वैज्ञानिक रीतीने तयार",
  "to your body.": "तुमच्या शरीरासाठी.",
  "Personalized daily and 7-day meal protocols designed for metabolic vitality, steady energy, and gut health — built around fresh, vibrant whole ingredients you actually love.":
    "चयापचय, स्थिर ऊर्जा आणि पचनसंस्थेच्या निरोगीपणासाठी तयार केलेली वैयक्तिक दैनंदिन व ७-दिवसांची जेवणाची योजना — तुम्हाला आवडणाऱ्या ताज्या, नैसर्गिक घटकांवर आधारित.",
  "Precision calorie, macro, and prebiotic fiber targets calculated from your biometrics":
    "तुमच्या शारीरिक माहितीवरून अचूक कॅलरी, पोषक तत्वे व फायबरची लक्ष्ये",
  "Varied 7-day whole-food meal schedules with step-by-step recipes and cooking times":
    "पायऱ्या-पाऱ्याने पाककृती व वेळेसह विविध ७-दिवसांची जेवणाची वेळापत्रके",
  "Categorized fresh-produce grocery lists that make healthy shopping effortless":
    "निरोगी किराणा खरेदी सोपी करणारी वर्गवार ताज्या भाज्यांची यादी",
  "Build my nutrition plan": "माझी पोषण योजना तयार करा",
  "Explore sample plan": "नमुना योजना पहा",
  "100% free & open. No credit card or account needed.":
    "१००% मोफत. क्रेडिट कार्ड किंवा खात्याची गरज नाही.",
  "Mifflin-St Jeor metabolic formulas": "मिफ्लिन-सेंट जेऑर चयापचय सूत्र",
  "Zero ultra-processed filler": "प्रक्रिया केलेले पदार्थ अजिबात नाहीत",
  "Complete whole-food recipes": "संपूर्ण नैसर्गिक पाककृती",
  "100% Whole Foods • High Vitality": "१००% नैसर्गिक खाद्य • उत्तम आरोग्य",
  "Daily Nourishment Protocol": "दैनंदिन पोषण योजना",
  "Metabolic Balance": "चयापचय संतुलन",
  "Energy (kcal)": "ऊर्जा (कॅलरी)",
  "Protein": "प्रोटीन",
  "Prebiotic Fiber": "फायबर",
  "Hydration": "पाणी",

  // Diet archetype cards
  "Guide": "मार्गदर्शक",
  "Balanced nutrition": "संतुलित पोषण",
  "Vegetarian diet": "शाकाहारी आहार",
  "Plant-based diet": "शुद्ध शाकाहारी आहार",
  "Low-carb diet": "कमी कार्ब आहार",
  "High-protein diet": "जास्त प्रोटीन आहार",
  "A nutrient-dense split for sustained everyday vitality, steady energy, and wellbeing.":
    "रोजच्या ऊर्जेसाठी व निरोगीपणासाठी संतुलित पोषक तत्वांचे प्रमाण.",
  "Wholesome plant-rich staples, lentils, whole grains, dairy, and seasonal garden produce.":
    "कडधान्ये, संपूर्ण धान्ये, दुग्धजन्य पदार्थ व हंगामी भाज्यांवर आधारित आहार.",
  "Purely plant-derived meals rich in fiber, micronutrients, and clean anti-inflammatory fuel.":
    "फक्त वनस्पती-आधारित, फायबर व सूक्ष्म पोषक तत्वांनी समृद्ध आहार.",
  "Healthy fats and reduced carbohydrates to stabilize blood sugar and accelerate fat loss.":
    "रक्तातील साखर स्थिर ठेवणारे व चरबी कमी करणारे कमी कार्बोहायड्रेट आहार.",
  "Higher protein targets for lean muscle preservation, satiety, and active metabolic support.":
    "स्नायू टिकवणे व तृप्तीसाठी जास्त प्रोटीनयुक्त आहार.",

  // Evidence / about section
  "Fresh Meal Prep": "ताजे जेवण तयारी",
  "Step-by-step easy home cooking": "सोप्या पायऱ्यांनी घरगुती स्वयंपाक",
  "Nutrient-Dense": "पोषक तत्वांनी भरलेले",
  "Whole foods rich in vitamins & minerals": "जीवनसत्त्वे व खनिजांनी समृद्ध खाद्यपदार्थ",
  "About The Platform": "आमच्याबद्दल",
  "Precision Nutrition & Delicious Recipes Delivered": "अचूक पोषण व स्वादिष्ट पाककृती",
  "We ease your everyday routine and make healthy eating delicious, affordable, and effortless. At Smart Nutrition, you can generate:":
    "आम्ही तुमची रोजची कामे सोपी करून निरोगी खाणे स्वादिष्ट, परवडणारे व सुलभ बनवतो. Smart Nutrition वर तुम्ही तयार करू शकता:",
  "Personalized Caloric Targets": "वैयक्तिक कॅलरी लक्ष्य",
  "7-Day Weekly Meal Plans": "७-दिवसांची जेवण योजना",
  "Dynamic Hydration Goal": "पाण्याचे लक्ष्य",
  "Categorized Grocery Lists": "वर्गवार किराणा यादी",
  "Balanced Macronutrients": "संतुलित पोषक तत्वे",
  "100% Free Public Utility": "१००% मोफत सेवा",
  "Our algorithm balances energy expenditure equations (Mifflin-St Jeor) with macronutrient density to ensure sustainable, long-term health and peak vitality.":
    "आमचे सूत्र मिफ्लिन-सेंट जेऑर समीकरणाद्वारे ऊर्जा व पोषक तत्वांचे संतुलन साधते, ज्यामुळे दीर्घकाळ चांगले आरोग्य मिळते.",

  // Promo banners
  "Weekly Planner": "साप्ताहिक नियोजन",
  "Wish someone else would plan dinner?": "रात्रीचे जेवण कोणीतरी नियोजित करावे असे वाटते?",
  "We’ve got you. Unlock personalized meal plans, complete recipe library with step-by-step cooking instructions, and categorized grocery lists that make healthy eating simple, enjoyable, and delicious.":
    "आम्ही आहोत. वैयक्तिक जेवण योजना, पायऱ्या-पाऱ्याने सूचना असलेल्या पाककृती व वर्गवार किराणा यादी — निरोगी खाणे सोपे व स्वादिष्ट करण्यासाठी.",
  "Generate my free plan": "माझी मोफत योजना तयार करा",

  // Steps section
  "A personalized plan in three steps": "तीन सोप्या पायऱ्यांत वैयक्तिक योजना",
  "We calculate your metabolic requirements with precision, then translate them into meals you will actually look forward to.":
    "आम्ही तुमच्या शरीराच्या गरजा अचूक मोजून तुम्हाला आवडतील असे जेवण सुचवतो.",
  "Enter your details": "तुमची माहिती भरा",
  "Add your age, height, weight, activity level, and dietary preferences to the form below.":
    "खालील फॉर्ममध्ये वय, उंची, वजन, हालचाल आणि आहार पसंती भरा.",
  "We build your targets": "आम्ही लक्ष्ये ठरवतो",
  "Your plan balances calories, protein, carbohydrates, and healthy fats around your goal.":
    "तुमच्या ध्येयानुसार कॅलरी, प्रोटीन, कार्बोहायड्रेट व चरबीचे संतुलन.",
  "Cook, eat, and track": "बनवा, खा आणि मागोवा ठेवा",
  "Follow your daily meals, open step-by-step recipes, and log hydration as you go.":
    "रोजची जेवणे पहा, पाककृती उघडा आणि पाण्याचा मागोवा ठेवा.",
  "7-Day Variety": "७-दिवसांची विविधता",
  "Weekly Meal Planner": "साप्ताहिक जेवण नियोजन",
  "7 days of varied, nutritionally balanced meal plans tailored to your unique body metrics.":
    "तुमच्या शरीरानुसार ७ दिवसांची विविधतापूर्ण, संतुलित जेवण योजना.",
  "Build 7-Day Plan →": "७-दिवसांची योजना →",

  // Recipe showcase
  "From the recipe library": "पाककृती संग्रहातून",
  "Recipes worth cooking tonight": "आज रात्री बनवण्यासारख्या पाककृती",
  "Balanced, everyday meals from the same library used to build your plan — with full ingredients and methods.":
    "तुमच्या योजनेत वापरल्या जाणाऱ्याच संग्रहातील संतुलित, रोजची जेवणे — संपूर्ण साहित्य व पद्धतीसह.",
  "All recipes": "सर्व पाककृती",
  "Breakfast": "नाश्ता",
  "Mains": "मुख्य जेवण",
  "Snacks": "स्नॅक्स",
  "Salads": "कोशंबिर",
  "Lunch": "दुपारचे जेवण",
  "Dinner": "रात्रीचे जेवण",
  "Snack": "स्नॅक",
  "View recipe": "पाककृती पहा",
  "Build a plan with these recipes": "या पाककृतींसह योजना तयार करा",
  "Easy": "सोपे",
  "Medium": "मध्यम",
  "10 min": "१० मि",
  "15 min": "१५ मि",
  "5 min": "५ मि",
  "8 min": "८ मि",

  // Showcase recipe names + content
  "Banana Peanut Oats Bowl": "केळी-भुईमूग ओट्स बाउल",
  "Banana & Peanut Butter Oats": "केळी व पीनट बटर ओट्स",
  "1/2 cup Rolled Oats": "१/२ कप ओट्स",
  "1 cup Milk (or water)": "१ कप दूध (किंवा पाणी)",
  "1 Ripe Banana (sliced)": "१ पिकलेली केळी (चिरलेली)",
  "1 tbsp Peanut Butter": "१ टेबलस्पून पीनट बटर",
  "1/4 tsp Cinnamon": "१/४ चमचा दालचिनी",
  "Simmer rolled oats in milk or water over medium heat for 4-5 minutes.":
    "मध्यम आचेवर ओट्स दुधात किंवा पाण्यात ४-५ मिनिटे शिजवा.",
  "Stir in the peanut butter until it melts into the oats.":
    "पीनट बटर घालून ओट्समध्ये मिसळेपर्यंत ढवळा.",
  "Top with sliced banana, sprinkle cinnamon, and serve warm.":
    "वर केळीचे तुकडे व दालचिनी घालून गरम गरम सादर करा.",
  "Lime & Herb Grilled Fish": "लिंबू-हर्ब ग्रिल्ड मासे",
  "Lime & Herb Grilled Fish Bowl": "लिंबू-हर्ब ग्रिल्ड माशांचा बाउल",
  "180g Fish Fillets (Rohu/Tilapia/Basa)": "१८० ग्रॅम माशाचे तुकडे (रोहू/तिलापिया/बासा)",
  "1 Fresh Lime": "१ लिंबू",
  "1 cup Steamed Vegetables": "१ कप वाफवलेल्या भाज्या",
  "1/2 cup Cooked Rice": "१/२ कप शिजवलेला तांदूळ",
  "1 tbsp Cooking Oil": "१ टेबलस्पून तेल",
  "Rub the fish with lime juice, salt, pepper, and herbs; rest for 5 minutes.":
    "माशाला लिंबाचा रस, मीठ, मिरपूड व हर्ब्स लावून ५ मिनिटे ठेवा.",
  "Pan-sear in oil for 3-4 minutes per side until golden and flaky.":
    "तेलात दोन्ही बाजूला ३-४ मिनिटे गोल्डन होईपर्यंत भाजा.",
  "Serve alongside warm rice and steamed vegetables.":
    "गरम तांदळासोबत वाफवलेल्या भाज्यांसह सादर करा.",
  "Banana Pomegranate Curd Parfait": "केळी-डाळिंब दही पारफै",
  "Banana & Pomegranate Curd Parfait": "केळी व डाळिंब दही पारफै",
  "1 cup Thick Curd (or hung curd)": "१ कप घट्ट दही",
  "1/4 cup Pomegranate Seeds": "१/४ कप डाळिंब दाणे",
  "2 tbsp Roasted Peanuts (crushed)": "२ टेबलस्पून भाजलेले भुईमूग (कुटलेले)",
  "1 tsp Honey": "१ चमचा मध",
  "Layer thick curd in a glass or bowl.": "ग्लास किंवा भांड्यात दहीचा थर घाला.",
  "Add banana slices and pomegranate seeds.": "केळीचे तुकडे व डाळिंब दाणे घाला.",
  "Top with crushed roasted peanuts and drizzle honey.":
    "वर कुटलेले भुईमूग व मध घाला.",
  "Orange & Peanut Crunch Salad": "संत्रा-भुईमूग कोशंबिर",
  "Orange, Carrot & Peanut Salad": "संत्रा, गाजर व भुईमूग कोशंबिर",
  "1 Sweet Orange (segments)": "१ संत्रा (फाळे)",
  "1 Grated Carrot": "१ किसलेली गाजर",
  "1 Cucumber (chopped)": "१ काकडी (चिरलेली)",
  "2 tbsp Roasted Peanuts": "२ टेबलस्पून भाजलेले भुईमूग",
  "1/2 tsp Chaat Masala + Lemon Juice": "१/२ चमचा चाट मसाला + लिंबाचा रस",
  "Peel and segment the orange, reserving any juice.":
    "संत्रा सोलून फाळे करा, रस बाजूला ठेवा.",
  "Toss grated carrot and chopped cucumber with the reserved juice and chaat masala.":
    "किसलेली गाजर व काकडी रस व चाट मसाल्यात मिसळा.",
  "Top with orange segments and roasted peanuts, finish with a squeeze of lemon.":
    "वर संत्र्याचे फाळे व भुईमूग घालून लिंबाचा रस पिंपरा.",

  // Pantry matcher
  "Zero-Waste Kitchen & Pantry Matcher": "स्वयंपाकघर सामग्री जुळवणी",
  "What's in your fridge right now?": "तुमच्या फ्रिजमध्ये आत्ता काय आहे?",
  "Select or type ingredients you already have at home. We'll cross-reference our whole-food catalog and surface delicious recipes you can cook immediately without an extra trip to the store.":
    "घरी असलेली सामग्री निवडा किंवा लिहा. आमची यंत्रणा त्यानुसार तात्काळ बनवता येणाऱ्या स्वादिष्ट पाककृती सुचवेल.",
  "e.g. sweet potato, bell pepper, mushrooms...": "उदा. बटाटा, ढोबळी मिरची, मशरूम...",
  "+ Add Ingredient": "+ सामग्री जोडा",
  "Popular staple pantry items:": "घरातील सामान्य सामग्री:",
  "Spinach": "पालक",
  "Paneer": "पनीर",
  "Eggs": "अंडी",
  "Oats": "ओट्स",
  "Curd": "दही",
  "Rice": "तांदूळ",
  "Chickpeas": "चना",
  "Chicken": "चिकन",
  "Tomatoes": "टोमॅटो",
  "Tofu": "टोफू",
  "Lentils": "डाळी",
  "Cucumber": "काकडी",
  "In your kitchen ({n}):": "तुमच्या स्वयंपाकघरात ({n}):",
  "Clear all": "सर्व साफ करा",
  "Showing top {n} whole-food recipes matching your pantry:": "तुमच्या सामग्रीनुसार शीर्ष {n} पाककृती:",
  "Select ingredients above to find matching meals.": "जुळणाऱ्या जेवणांसाठी वरील सामग्री निवडा.",
  "No matching recipes found with these exact ingredients.": "या सामग्रीसाठी जुळणारी पाककृती सापडली नाही.",
  "✓ Matches {n} item": "✓ {n} बाब जुळली",
  "✓ Matches {n} items": "✓ {n} बाबी जुळल्या",
  "Found in recipe:": "पाककृतीमध्ये सापडले:",
  "🍳 Cook Now": "🍳 आता बनवा",
  "Recipe Details": "पाककृती तपशील",
  "Try clicking popular staples like": "वरील सामान्य सामग्री क्लिक करा जसे",
  "or": "किंवा",

  // Generator form
  "Your plan": "तुमची योजना",
  "Calculate your nutrition plan": "तुमची पोषण योजना मोजा",
  "Add a few details and we will calculate your energy needs, macronutrient targets, and a day of meals built around them.":
    "थोडी माहिती भरा — आम्ही तुमच्या ऊर्जेची गरज, पोषक तत्वांची लक्ष्ये व त्यानुसार जेवणाचा घटक तयार करू.",
  "Demo profile": "नमुना माहिती",
  "Reset": "रीसेट",
  "Saved plans": "जतन केलेल्या योजना",
  "View saved nutrition plans": "जतन केलेल्या योजना पहा",
  "Full name (optional)": "पूर्ण नाव (ऐच्छिक)",
  "e.g. Aarav Sharma (or leave blank for 'You')": "उदा. आरव शर्मा (रिकामे सोडल्यास 'तुम्ही')",
  "Age": "वय",
  "Years": "वर्षे",
  "Sex": "लिंग",
  "Male": "पुरुष",
  "Female": "स्त्री",
  "Activity level": "हालचालीचे प्रमाण",
  "Low — mostly seated": "कमी — बहुतेक बसलेले",
  "Moderate — 3–4 workouts": "मध्यम — आठवड्यात ३–४ व्यायाम",
  "High — daily training": "जास्त — रोज व्यायाम",
  "Height (cm)": "उंची (सेमी)",
  "Use imperial": "इंपीरियल वापरा",
  "Use metric": "मेट्रिक वापरा",
  "Height in cm": "उंची सेंमीमध्ये",
  "Total inches": "एकूण इंच",
  "Centimetres": "सेंटिमीटर",
  "Total inches, e.g. 70": "एकूण इंच, उदा. ७०",
  "Weight (kg)": "वजन (किग्रॅ)",
  "Weight in kg": "वजन किलोमध्ये",
  "Weight in pounds": "वजन पौंडमध्ये",
  "Kilograms": "किलोग्रॅम",
  "Pounds": "पौंड",
  "Fitness goal": "फिटनेस ध्येय",
  "Weight loss — calorie deficit": "वजन कमी — कॅलरी कमी",
  "Muscle gain — lean surplus": "स्नायू वाढ — नियंत्रित वाढ",
  "Maintain weight": "वजन टिकवून ठेवणे",
  "Diet preference": "आहार पसंती",
  "Indian vegetarian": "भारतीय शाकाहारी",
  "Indian vegan (dairy-free)": "भारतीय शुद्ध शाकाहारी (दूध-विरहित)",
  "Eggetarian": "अंडिटेरियन",
  "Indian non-vegetarian": "भारतीय मांसाहारी",
  "Balanced (vegetarian and non-vegetarian)": "संतुलित (शाकाहारी व मांसाहारी)",
  "indian vegetarian": "भारतीय शाकाहारी",
  "indian vegan": "भारतीय शुद्ध शाकाहारी",
  "indian eggetarian": "अंडिटेरियन",
  "indian non-vegetarian": "भारतीय मांसाहारी",
  "balanced": "संतुलित",
  "Allergies and exclusions": "अॅलर्जी व टाळायचे पदार्थ",
  "e.g. milk, peanuts, shellfish": "उदा. दूध, भुईमूग, कब्जे",
  "Separate multiple items with commas.": "एकापेक्षा जास्त असल्यास स्वल्पविरामाने वेगळे करा.",
  "Generate 1-day plan": "१-दिवसाची योजना तयार करा",
  "Generate 7-day plan": "७-दिवसांची योजना तयार करा",
  "Generating daily plan…": "दैनंदिन योजना तयार होत आहे…",
  "Building weekly plan…": "साप्ताहिक योजना तयार होत आहे…",

  // Status messages
  "Add your profile details to create a personalized, goal-based nutrition plan.":
    "वैयक्तिक योजनेसाठी तुमची माहिती भरा.",
  "Form cleared. Start again with your latest profile details.":
    "फॉर्म साफ केला. पुन्हा नव्याने माहिती भरा.",
  "Demo profile loaded. Choose a 1-day or 7-day plan below.":
    "नमुना माहिती भरली. खाली १-दिवस किंवा ७-दिवसांची योजना निवडा.",
  "Calibrated to {name} ({split}). Ready to generate plan.":
    "{name} ({split}) नुसार सेट झाले. योजना तयार करा.",
  "Diet preference set to {diet}. Ready to calculate plan.":
    "आहार पसंती {diet} केली. योजना मोजण्यास सज्ज.",
  "Generating full 7-day varied weekly nutrition plan...": "संपूर्ण ७-दिवसांची योजना तयार होत आहे...",
  "Building your personalized daily nutrition plan...": "तुमची वैयक्तिक दैनंदिन योजना तयार होत आहे...",
  "Your 7-day nutrition plan is ready.": "तुमची ७-दिवसांची योजना तयार आहे.",
  "Your personalized daily nutrition plan is ready.": "तुमची वैयक्तिक दैनंदिन योजना तयार आहे.",
  "Could not generate plan. Please verify your age, height, and weight inputs.":
    "योजना तयार झाली नाही. कृपया वय, उंची व वजन तपासा.",
  "Please enter your {fields} before generating your meal plan.":
    "जेवणाची योजना तयार करण्यापूर्वी कृपया {fields} भरा.",
  "Meal swapped: {name}": "जेवण बदलले: {name}",
  "Restored saved plan for {user} ({date})": "{user} ({date}) साठी जतन केलेली योजना उघडली",
  "Height (inches)": "उंची (इंच)",
  "Weight (lbs)": "वजन (पौंड)",

  // History drawer
  "No saved plans yet. Generate your first plan to see it here.":
    "अजून योजना जतन केलेल्या नाहीत. पहिली योजना तयार करा.",
  "7-day plan": "७-दिवसांची योजना",
  "1-day plan": "१-दिवसाची योजना",
  "View saved plans": "जतन केलेल्या योजना पहा",

  // BMI gauge
  "Live estimate": "तात्काळ अंदाज",
  "BMI index": "BMI निर्देशांक",
  "Est. maintenance": "अंदाजित दैनंदिन गरज",
  "Under 18.5": "18.5 पेक्षा कमी",
  "18.5–24.9 Healthy": "18.5–24.9 निरोगी",
  "25–29.9 Over": "25–29.9 जास्त",
  "30+ Obese": "30+ लठ्ठ",
  "Healthy Weight": "निरोगी वजन",
  "Underweight": "कमी वजन",
  "Overweight": "जास्त वजन",
  "Obese": "लठ्ठपणा",

  // Water tracker
  "Daily hydration": "रोजचे पाणी",
  "A simple fluid goal based on your body weight": "वजनानुसार पाण्याचे लक्ष्य",
  "% of goal": "% लक्ष्यापैकी",
  "Target": "लक्ष्य",
  "Logged": "प्यालेले",
  "Remaining": "शिल्लक",
  "Quick add": "झटपट जोडा",
  "Daily hydration goal reached.": "रोजचे पाण्याचे लक्ष्य पूर्ण!",
  "Logged {n} ml": "{n} मिली नोंदवले",
  "Tracker reset for today.": "आजचा मागोवा रीसेट झाला.",

  // Calorie tracker
  "Today's progress": "आजची प्रगती",
  "Select a meal to mark it eaten and update your totals.":
    "जेवण निवडा — खाल्लेली कॅलरी व पोषक तत्वे अपडेट होतील.",
  "% eaten": "% खाल्ले",
  "Eaten": "खाल्ले",
  "Carbs": "कार्ब्स",
  "Fats": "फॅट्स",
  "Meal {n}": "जेवण {n}",

  // Plan display
  "We could not generate this plan": "ही योजना तयार करता आली नाही",
  "Your 7-day nutrition plan": "तुमची ७-दिवसांची पोषण योजना",
  "Your daily nutrition plan": "तुमची दैनंदिन पोषण योजना",
  "Prepared for": "तयार:",
  "Fridge Sheet": "फ्रिज शीट",
  "View and print fridge-ready plan sheet with grocery checklist":
    "फ्रिज-रेडी योजना व किराणा यादी पहा व प्रिंट करा",
  "Print": "प्रिंट",
  "Print or save as PDF": "प्रिंट करा किंवा PDF जतन करा",
  "Day": "दिवस",
  "Meals": "जेवण",
  "Grocery list": "किराणा यादी",
  "Calorie & macro distribution": "कॅलरी व पोषक तत्व वितरण",
  "Energy & metabolic targets": "ऊर्जा व चयापचय लक्ष्ये",
  "kcal / day": "कॅलरी / दिवस",
  "kcal": "कॅलरी",
  "kcal target": "कॅलरी लक्ष्य",
  "Carbohydrates": "कार्बोहायड्रेट",
  "Healthy Fats": "पौष्टिक चरबी",
  "Calorie Budget by Meal": "जेवणानुसार कॅलरी वाटप",
  "7-day calorie overview": "७-दिवसांचे कॅलरी विहंगावलोकन",
  "Select a day to view its meals": "जेवण पाहण्यासाठी दिवस निवडा",
  "Meal timing": "जेवणाची वेळ",
  "About 13 hours overnight": "रात्री सुमारे १३ तास",
  "prep": "तयारी",
  "cook": "शिजवणे",
  "High protein": "जास्त प्रोटीन",
  "Sustained energy": "टिकाऊ ऊर्जा",
  "Quick prep": "झटपट तयारी",
  "Recipe": "पाककृती",
  "Swap": "बदला",
  "Swapping…": "बदलत आहे…",
  "Key ingredients": "मुख्य साहित्य",
  "Why this meal works": "हे जेवण का उपयुक्त",
  "Weekly grocery list": "साप्ताहिक किराणा यादी",
  "Everything you need for the meals in this plan": "या योजनेतील जेवणांसाठी लागणारे सर्व साहित्य",
  "Copy list": "यादी कॉपी करा",
  "Grocery list copied to your clipboard.": "किराणा यादी क्लिपबोर्डवर कॉपी झाली.",
  "Fresh produce": "ताज्या भाज्या",
  "Protein & dairy": "प्रोटीन व दूध-दुग्ध",
  "Grains & carbohydrates": "धान्ये व कार्बोहायड्रेट",
  "Pantry & oils": "मसाले व तेले",

  // Recipe modal
  "Prep time": "तयारीची वेळ",
  "Cook time": "शिजवण्याची वेळ",
  "Calories": "कॅलरी",
  "Goal alignment": "ध्येयाशी सुसंगत",
  "High carbohydrate": "जास्त कार्बोहायड्रेट",
  "Balanced macros": "संतुलित पोषक तत्वे",
  "Ingredients": "साहित्य",
  "Method": "पद्धत",
  "Prepare and wash all ingredients freshly. Cook with minimal healthy cold-pressed oil or ghee.":
    "सर्व साहित्य ताजे धुवून तयार करा. थोड्या चांगल्या तेलात किंवा तुपात शिजवा.",
  "Why this meal works:": "हे जेवण का उपयुक्त:",
  "🍳 Start Kitchen Cooking Mode": "🍳 स्वयंपाक मोड सुरू करा",
  "Close recipe": "पाककृती बंद करा",

  // Kitchen cooking mode
  "🍳 Interactive Kitchen Mode": "🍳 स्वयंपाक मोड",
  "✕ Exit Cooking Mode": "✕ स्वयंपाक मोड बंद करा",
  "Mise en place": "साहित्य तयार",
  "{a} of {b} ready": "{a} / {b} तयार",
  "Tap ingredients as you prep or add them to the pan:":
    "साहित्य तयार करताना किंवा भांड्यात टाकताना टॅप करा:",
  "Step {n} of {m}": "पायरी {n} / {m}",
  "Kitchen Timer": "स्वयंपाक टाइमर",
  "00:00 — Ready!": "00:00 — तयार!",
  "Pause": "थांबा",
  "Resume": "पुन्हा सुरू",
  "Start 5m": "५ मि सुरू",
  "← Previous step": "← मागील पायरी",
  "Next step →": "पुढील पायरी →",
  "🎉 Meal complete! Enjoy": "🎉 जेवण तयार! छान",
  "Prepare and wash all fresh whole-food ingredients thoroughly.":
    "सर्व ताजे साहित्य नीट धुवून तयार करा.",
  "Cook over gentle heat with minimal cold-pressed oil or ghee until tender and aromatic.":
    "हलक्या आचेवर थोड्या तेलात किंवा तुपात शिजवा.",
  "Plate fresh and garnish with garden herbs.": "ताजे सादर करून हर्ब्सने सुशोभित करा.",

  // Fridge sheet
  "Fridge-Ready Weekly Sheet (Formatted for Home Printing)": "फ्रिज-शीट (घरी प्रिंटसाठी)",
  "Print Sheet / Save PDF": "शीट प्रिंट करा / PDF जतन करा",
  "Close": "बंद करा",
  "Weekly Whole-Food Nourishment Protocol": "साप्ताहिक पोषण योजना",
  "Prepared for:": "साठी:",
  "Date:": "दिनांक:",
  "Health & Vitality": "आरोग्य व उत्तम ऊर्जा",
  "Daily kcal Target": "रोजची कॅलरी",
  "Protein Goal": "प्रोटीन लक्ष्य",
  "Water (8 glasses)": "पाणी (८ ग्लास)",
  "7-Day Meal Schedule": "७-दिवसांचे जेवणपत्रक",
  "Stick on fridge for quick daily reference": "रोज पाहण्यासाठी फ्रिजवर चिकटवा",
  "Snack & Fuel": "स्नॅक",
  "Today": "आज",
  "Categorized Grocery Checklist": "वर्गवार किराणा यादी",
  "Bring to market or check off in pantry": "बाजाराला नेण्यासाठी किंवा घरी टिक करा",
  "🌿 Whole-Food Nutrition · Verified against Mifflin-St Jeor metabolic formulas":
    "🌿 नैसर्गिक पोषण · मिफ्लिन-सेंट जेऑर सूत्रावर आधारित",
  "Prep tip: Batch-cook grains and soak lentils on Sunday evening":
    "टिप: रविवारी संध्याकाळी धान्ये शिजवून ठेवा व डाळी भिजवा",

  // Empty state
  "Nutrition tailored to your everyday life": "तुमच्या रोजच्या जीवनासाठी पोषण",
  "Add your details above to generate a daily or 7-day plan with practical recipes, clear macro targets, and a categorized grocery list.":
    "वरील माहिती भरा — दैनंदिन किंवा ७-दिवसांची योजना पाककृती, मॅक्रो लक्ष्ये व किराणा यादीसह मिळेल.",
  "7-day weekly planner": "साप्ताहिक नियोजक",
  "Varied recipes from Monday to Sunday, built around your daily calorie target.":
    "सोमवार ते रविवार विविध पाककृती, तुमच्या कॅलरी लक्ष्यानुसार.",
  "Macro breakdowns": "मॅक्रो विभाजन",
  "A clear view of protein, carbohydrates, and fats for every plan.":
    "प्रत्येक योजनेतील प्रोटीन, कार्बोहायड्रेट व चरबीचे स्पष्ट चित्र.",
  "Step-by-step recipes": "पायऱ्यांसह पाककृती",
  "Prep time, cook time, ingredients, and concise methods for each meal.":
    "प्रत्येक जेवणासाठी तयारी, वेळ, साहित्य व पद्धत.",
  "Hydration tracking": "पाण्याचा मागोवा",
  "A personalized daily water goal with simple one-tap logging.":
    "वजनानुसार पाण्याचे लक्ष्य व एका टॅपवर नोंद.",

  // Footer + legal
  "Your free personal nutrition engine. Evidence-based meal plans, macro targets, and grocery lists — all in one place.":
    "तुमची मोफत वैयक्तिक पोषण यंत्रणा. पुराव्यावर आधारित जेवण योजना, मॅक्रो लक्ष्ये आणि किराणा यादी — सर्व एकाच ठिकाणी.",
  "Nutrition Plans": "पोषण योजना",
  "Diet Types": "आहार प्रकार",
  "Platform": "प्लॅटफॉर्म",
  "1-Day Plan": "१-दिवसाची योजना",
  "7-Day Weekly Plan": "७-दिवसांची योजना",
  "Grocery Lists": "किराणा याद्या",
  "Hydration Tracker": "पाणी मागोवा",
  "Indian Vegetarian": "भारतीय शाकाहारी",
  "Vegan": "शुद्ध शाकाहारी",
  "Non-Vegetarian": "मांसाहारी",
  "Balanced": "संतुलित",
  "Privacy Policy": "गोपनीयता धोरण",
  "Terms of Service": "सेवा अटी",
  "Contact": "संपर्क",
  "© 2026 Smart Nutrition. All rights reserved.": "© 2026 Smart Nutrition. सर्व हक्क राखीव.",
  "Privacy Policy (body)": "Smart Nutrition तुमच्या गोपनीयतेला महत्त्व देते. सर्व शारीरिक माहिती व गणना तुमच्या ब्राउझरमध्येच होते. आम्ही तुमची माहिती कोणत्याही जाहिरात संस्थेला विकत नाही किंवा पाठवत नाही.",
  "Terms of Service (body)": "Smart Nutrition ही वैयक्तिक आरोग्य, जेवण नियोजन व शैक्षणिक उपयोगासाठी खुली पोषण गणना यंत्रणा आहे. ऊर्जेची गणना मिफ्लिन-सेंट जेऑर समीकरणावर आधारित आहे. वैद्यकीय सल्ल्यासाठी नोंदणीकृत डॉक्टर किंवा आहार तज्ज्ञांचा सल्ला घ्यावा.",
  "Contact & Clinical Feedback": "संपर्क व सूचना",
  "Contact (body)": "पोषण संशोधक, गृहिणी व वैद्यकीय व्यावसायिकांकडून सूचना आम्हाला स्वागतार्ह आहेत. clinical@smartnutrition.local वर संपर्क करा किंवा आमच्या GitHub वर issue उघडा.",

  // Extra
  "Goal:": "ध्येय:",
  "🍳 Cook": "🍳 बनवा",
  "Home": "होम",
  "About Us": "आमच्याबद्दल",
  "How It Works": "कसे कार्य करते",
  "Monday": "सोमवार",
  "Tuesday": "मंगळवार",
  "Wednesday": "बुधवार",
  "Thursday": "गुरुवार",
  "Friday": "शुक्रवार",
  "Saturday": "शनिवार",
  "Sunday": "रविवार",
  "Basal Metabolic Rate (BMR)": "बेसल मेटाबॉलिक रेट (BMR)",
  "Calories burned at complete rest": "पूर्ण विश्रांतीत खर्च होणाऱ्या कॅलरी",
  "Maintenance Energy (TDEE)": "दैनंदिन ऊर्जा गरज (TDEE)",
  "Total daily energy expenditure": "एकूण दैनंदिन ऊर्जा खर्च",
  "Target Intake": "लक्ष्य सेवन",
  "Optimized for your fitness goal": "तुमच्या ध्येयानुसार सुसंगत",
  "Plate Calories (from recipes)": "जेवणातील कॅलरी (पाककृतींवरून)",
  "Sum of catalog nutrition, not a TDEE split": "संग्रहातील पोषण मूल्ये — TDEE विभागणी नाही",
};
