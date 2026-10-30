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
  "Meal plans": "आहार योजना",
  "Recipes": "पाककृती",
  "Pantry matcher": "स्वयंपाकघर साहित्य जुळवा",
  "How it works": "हे कसे काम करते",
  "Create my plan": "माझी योजना तयार करा",
  "Light": "लाईट",
  "Dark": "डार्क",
  "☀️ Daylight mode": "☀️ डे मोड (लाईट)",
  "🌙 Natural dark mode": "🌙 डार्क मोड",
  "Toggle theme": "थीम बदला",
  "Toggle navigation": "मेनू उघडा/बंद करा",

  // Hero
  "Whole-Food Clinical Nutrition": "नैसर्गिक आहारावर आधारित पोषण",
  "Nourishing real food,": "पौष्टिक व सात्विक आहार,",
  "scientifically tailored": "शास्त्रीय पद्धतीने तयार",
  "to your body.": "तुमच्या शरीरासाठी.",
  "Personalized daily and 7-day meal protocols designed for metabolic vitality, steady energy, and gut health — built around fresh, vibrant whole ingredients you actually love.":
    "चयापचय, अखंड ऊर्जा आणि पचनसंस्थेच्या उत्तम आरोग्यासाठी तयार केलेली वैयक्तिक दैनंदिन व ७-दिवसांची आहार योजना — तुम्हाला आवडणाऱ्या ताज्या, नैसर्गिक घटकांवर आधारित.",
  "Precision calorie, macro, and prebiotic fiber targets calculated from your biometrics":
    "तुमच्या शारीरिक माहितीवरून अचूक कॅलरी, पोषक तत्त्वे व फायबरची लक्ष्ये",
  "Varied 7-day whole-food meal schedules with step-by-step recipes and cooking times":
    "टप्प्याटप्प्याने सविस्तर कृती व वेळेसह ७ दिवसांचे वैविध्यपूर्ण आहार वेळापत्रक",
  "Categorized fresh-produce grocery lists that make healthy shopping effortless":
    "आरोग्यदायी किराणा खरेदी सोपी करणारी वर्गवारीनुसार साहित्याची यादी",
  "Build my nutrition plan": "माझी पोषण योजना तयार करा",
  "Explore sample plan": "नमुना योजना पहा",
  "100% free & open. No credit card or account needed.":
    "१००% मोफत व खुले. क्रेडिट कार्ड किंवा खात्याची गरज नाही.",
  "Mifflin-St Jeor metabolic formulas": "मिफ्लिन-सेंट जेऑर चयापचय सूत्र",
  "Zero ultra-processed filler": "अल्ट्रा-प्रोसेस्ड पदार्थ अजिबात नाहीत",
  "Complete whole-food recipes": "संपूर्ण नैसर्गिक अन्नघटकांच्या पाककृती",
  "100% Whole Foods • High Vitality": "१००% नैसर्गिक अन्न • उत्तम आरोग्य",
  "Daily Nourishment Protocol": "दैनंदिन पोषण योजना",
  "Metabolic Balance": "चयापचय संतुलन",
  "Energy (kcal)": "ऊर्जा (कॅलरी)",
  "Protein": "प्रोटीन",
  "Prebiotic Fiber": "फायबर (तंतुमय घटक)",
  "Hydration": "पाणी (हायड्रेशन)",

  // Diet archetype cards
  "Guide": "मार्गदर्शक",
  "Balanced nutrition": "संतुलित पोषण",
  "Vegetarian diet": "शाकाहारी आहार",
  "Plant-based diet": "वनस्पती-आधारित आहार (Plant-based)",
  "Low-carb diet": "कमी कार्ब आहार (Low-carb)",
  "High-protein diet": "उच्च प्रोटीन आहार",
  "A nutrient-dense split for sustained everyday vitality, steady energy, and wellbeing.":
    "दैनंदिन ऊर्जा, उत्साह आणि दीर्घकालीन आरोग्यासाठी संतुलित पोषक तत्त्वांचे प्रमाण.",
  "Wholesome plant-rich staples, lentils, whole grains, dairy, and seasonal garden produce.":
    "कडधान्ये, संपूर्ण धान्य, दुग्धजन्य पदार्थ व हंगामी भाज्यांवर आधारित पौष्टिक आहार.",
  "Purely plant-derived meals rich in fiber, micronutrients, and clean anti-inflammatory fuel.":
    "केवळ वनस्पती-आधारित, फायबर व सूक्ष्म पोषक घटकांनी समृद्ध आहार.",
  "Healthy fats and reduced carbohydrates to stabilize blood sugar and accelerate fat loss.":
    "रक्तातील साखर नियंत्रित ठेवणारा व चरबी कमी करणारा कमी कार्बोहायड्रेट आहार.",
  "Higher protein targets for lean muscle preservation, satiety, and active metabolic support.":
    "स्नायूंची ताकद टिकवण्यासाठी व तृप्तीसाठी उच्च प्रोटीनयुक्त आहार.",

  // Evidence / about section
  "Fresh Meal Prep": "ताज्या जेवणाची पूर्वतयारी",
  "Step-by-step easy home cooking": "सोप्या टप्प्यांत घरगुती स्वयंपाक",
  "Nutrient-Dense": "पोषक तत्त्वांनी समृद्ध",
  "Whole foods rich in vitamins & minerals": "जीवनसत्त्वे व खनिजांनी समृद्ध नैसर्गिक पदार्थ",
  "About The Platform": "आमच्याबद्दल",
  "Precision Nutrition & Delicious Recipes Delivered": "अचूक पोषण आणि स्वादिष्ट पाककृती",
  "We ease your everyday routine and make healthy eating delicious, affordable, and effortless. At Smart Nutrition, you can generate:":
    "आम्ही तुमची दैनंदिन दिनचर्या सोपी करून आरोग्यदायी खाणे चवदार, परवडणारे व सुलभ बनवतो. Smart Nutrition वर तुम्ही तयार करू शकता:",
  "Personalized Caloric Targets": "वैयक्तिक कॅलरी लक्ष्य",
  "7-Day Weekly Meal Plans": "७-दिवसांची आहार योजना",
  "Dynamic Hydration Goal": "दैनंदिन पाण्याचे लक्ष्य",
  "Categorized Grocery Lists": "वर्गवारीनुसार किराणा यादी",
  "Balanced Macronutrients": "संतुलित पोषक तत्त्वे (मॅक्रोज)",
  "100% Free Public Utility": "१००% मोफत व खुली सेवा",
  "Our algorithm balances energy expenditure equations (Mifflin-St Jeor) with macronutrient density to ensure sustainable, long-term health and peak vitality.":
    "आमची प्रणाली मिफ्लिन-सेंट जेऑर समीकरणाद्वारे ऊर्जेची गरज आणि पोषक घटकांचे संतुलन साधते, ज्यामुळे दीर्घकाळ उत्तम आरोग्य लाभते.",

  // Promo banners
  "Weekly Planner": "साप्ताहिक आहार नियोजक",
  "Wish someone else would plan dinner?": "रात्रीच्या जेवणाचे नियोजन कोणीतरी करून द्यावे असे वाटते का?",
  "We’ve got you. Unlock personalized meal plans, complete recipe library with step-by-step cooking instructions, and categorized grocery lists that make healthy eating simple, enjoyable, and delicious.":
    "काळजी करू नका, आम्ही आहोत ना! वैयक्तिक आहार योजना, सविस्तर कृतीसह पाककृती आणि वर्गवारीनुसार किराणा यादी मिळवा — आरोग्यदायी खाणे सोपे, आनंददायी व चवदार बनवा.",
  "Generate my free plan": "माझी मोफत योजना तयार करा",

  // Steps section
  "A personalized plan in three steps": "तीन सोप्या टप्प्यांत वैयक्तिक आहार योजना",
  "We calculate your metabolic requirements with precision, then translate them into meals you will actually look forward to.":
    "आम्ही शरीराच्या गरजा अचूक ओळखून तुम्हाला आवडेल असा पौष्टिक व चवदार आहार सुचवतो.",
  "Enter your details": "तुमची माहिती भरा",
  "Add your age, height, weight, activity level, and dietary preferences to the form below.":
    "खालील फॉर्ममध्ये वय, उंची, वजन, हालचालींचे प्रमाण आणि आहार पसंती भरा.",
  "We build your targets": "आम्ही तुमची पोषण लक्ष्ये ठरवतो",
  "Your plan balances calories, protein, carbohydrates, and healthy fats around your goal.":
    "तुमच्या ध्येयानुसार कॅलरी, प्रोटीन, कार्बोहायड्रेट्स आणि चांगल्या स्निग्ध पदार्थांचे (फॅट्स) अचूक संतुलन.",
  "Cook, eat, and track": "बनवा, खा आणि नोंद ठेवा",
  "Follow your daily meals, open step-by-step recipes, and log hydration as you go.":
    "दैनंदिन आहार पहा, सविस्तर पाककृती वाचा आणि पिलेल्या पाण्याचा मागोवा ठेवा.",
  "7-Day Variety": "७ दिवसांचे वैविध्य",
  "Weekly Meal Planner": "साप्ताहिक आहार नियोजक",
  "7 days of varied, nutritionally balanced meal plans tailored to your unique body metrics.":
    "तुमच्या शरीरानुसार ७ दिवसांची वैविध्यपूर्ण, पोषक तत्त्वांनी संतुलित आहार योजना.",
  "Build 7-Day Plan →": "७ दिवसांची योजना बनवा →",

  // Recipe showcase
  "From the recipe library": "पाककृती संग्रहातून",
  "Recipes worth cooking tonight": "आज रात्री बनवण्यासाठी खास पाककृती",
  "Balanced, everyday meals from the same library used to build your plan — with full ingredients and methods.":
    "तुमच्या आहार योजनेतील संतुलित दैनंदिन भोजनाच्या पाककृती — संपूर्ण साहित्य आणि कृतीसह.",
  "All recipes": "सर्व पाककृती",
  "Breakfast": "नाश्ता",
  "Mains": "मुख्य जेवण",
  "Snacks": "अल्पोपहार (स्नॅक्स)",
  "Salads": "कोशिंबीर (सॅलड)",
  "Lunch": "दुपारचे जेवण",
  "Dinner": "रात्रीचे जेवण",
  "Snack": "अल्पोपहार (स्नॅक)",
  "View recipe": "पाककृती पहा",
  "Build a plan with these recipes": "या पाककृतींसह योजना तयार करा",
  "Easy": "सोपे",
  "Medium": "मध्यम",
  "Hard": "कठीण",
  "10 min": "१० मिनिटे",
  "15 min": "१५ मिनिटे",
  "5 min": "५ मिनिटे",
  "8 min": "८ मिनिटे",

  // Showcase recipe names + content
  "Banana Peanut Oats Bowl": "केळी आणि शेंगदाणा ओट्स बाऊल",
  "Banana & Peanut Butter Oats": "केळी व पीनट बटर ओट्स",
  "1/2 cup Rolled Oats": "१/२ कप ओट्स",
  "1 cup Milk (or water)": "१ कप दूध (किंवा पाणी)",
  "1 Ripe Banana (sliced)": "१ पिकलेले केळे (कापलेले)",
  "1 tbsp Peanut Butter": "१ टेबलस्पून पीनट बटर",
  "1/4 tsp Cinnamon": "१/४ चमचा दालचिनी पूड",
  "Simmer rolled oats in milk or water over medium heat for 4-5 minutes.":
    "मध्यम आचेवर ओट्स दुधात किंवा पाण्यात ४-५ मिनिटे मंद शिजवा.",
  "Stir in the peanut butter until it melts into the oats.":
    "पीनट बटर घालून ओट्समध्ये व्यवस्थित विरघळेपर्यंत ढवळा.",
  "Top with sliced banana, sprinkle cinnamon, and serve warm.":
    "वर केळीचे काप व दालचिनी पूड घालून गरमागरम खाण्यास द्या.",
  "Lime & Herb Grilled Fish": "लेमन-हर्ब ग्रिल्ड फिश",
  "Lime & Herb Grilled Fish Bowl": "लेमन-हर्ब ग्रिल्ड फिश बाऊल",
  "180g Fish Fillets (Rohu/Tilapia/Basa)": "१८० ग्रॅम माशाचे तुकडे (रोहू/तिलापिया/बासा)",
  "1 Fresh Lime": "१ ताजे लिंबू",
  "1 cup Steamed Vegetables": "१ कप वाफवलेल्या भाज्या",
  "1/2 cup Cooked Rice": "१/२ कप शिजवलेला भात",
  "1 tbsp Cooking Oil": "१ टेबलस्पून तेल",
  "Rub the fish with lime juice, salt, pepper, and herbs; rest for 5 minutes.":
    "माशाला लिंबाचा रस, मीठ, काळी मिरी पूड व हर्ब्स चोळून ५ मिनिटे मॅरिनेट करा.",
  "Pan-sear in oil for 3-4 minutes per side until golden and flaky.":
    "तव्यावर थोडे तेल घालून दोन्ही बाजूंनी ३-४ मिनिटे सोनेरी रंगावर परता.",
  "Serve alongside warm rice and steamed vegetables.":
    "गरम भात आणि वाफवलेल्या भाज्यांसोबत गरमागरम वाढा.",
  "Banana Pomegranate Curd Parfait": "केळी-डाळिंब दही पारफे",
  "Banana & Pomegranate Curd Parfait": "केळी आणि डाळिंब दही पारफे",
  "1 cup Thick Curd (or hung curd)": "१ कप घट्ट दही (चक्का)",
  "1/4 cup Pomegranate Seeds": "१/४ कप डाळिंबाचे दाणे",
  "2 tbsp Roasted Peanuts (crushed)": "२ टेबलस्पून भाजलेले शेंगदाणे (कूट/बारीक केलेले)",
  "1 tsp Honey": "१ चमचा मध",
  "Layer thick curd in a glass or bowl.": "ग्लास किंवा बाऊलमध्ये दह्याचा थर लावा.",
  "Add banana slices and pomegranate seeds.": "केळीचे काप व डाळिंबाचे दाणे घाला.",
  "Top with crushed roasted peanuts and drizzle honey.":
    "वर भाजलेल्या शेंगदाण्यांचा कूट आणि मध घाला.",
  "Orange & Peanut Crunch Salad": "संत्रा आणि शेंगदाणा कोशिंबीर",
  "Orange, Carrot & Peanut Salad": "संत्रा, गाजर आणि शेंगदाणा कोशिंबीर",
  "1 Sweet Orange (segments)": "१ गोड संत्रे (फोडी)",
  "1 Grated Carrot": "१ किसलेले गाजर",
  "1 Cucumber (chopped)": "१ काकडी (बारीक चिरलेली)",
  "2 tbsp Roasted Peanuts": "२ टेबलस्पून भाजलेले शेंगदाणे",
  "1/2 tsp Chaat Masala + Lemon Juice": "१/२ चमचा चाट मसाला + लिंबाचा रस",
  "Peel and segment the orange, reserving any juice.":
    "संत्रे सोलून त्याच्या फोडी वेगळ्या करा आणि रस बाजूला ठेवा.",
  "Toss grated carrot and chopped cucumber with the reserved juice and chaat masala.":
    "किसलेले गाजर आणि चिरलेली काकडी रसात व चाट मसाल्यात एकत्र करा.",
  "Top with orange segments and roasted peanuts, finish with a squeeze of lemon.":
    "वर संत्र्याच्या फोडी आणि भाजलेले शेंगदाणे घाला, आणि शेवटी लिंबाचा रस पिळा.",

  // Pantry matcher
  "Zero-Waste Kitchen & Pantry Matcher": "किचन साहित्य जुळवणी (Zero-Waste Pantry)",
  "What's in your fridge right now?": "तुमच्या फ्रिजमध्ये सध्या काय उपलब्ध आहे?",
  "Select or type ingredients you already have at home. We'll cross-reference our whole-food catalog and surface delicious recipes you can cook immediately without an extra trip to the store.":
    "घरी उपलब्ध असलेले साहित्य निवडा किंवा लिहा. आमची प्रणाली त्वरित तयार करता येणाऱ्या चवदार पाककृती सुचवेल, जेणेकरून बाजारात जाण्याची गरज पडणार नाही.",
  "e.g. sweet potato, bell pepper, mushrooms...": "उदा. रताळे, ढोबळी मिरची, मशरूम...",
  "+ Add Ingredient": "+ साहित्य जोडा",
  "Popular staple pantry items:": "घरातील नेहमीचे आवश्यक साहित्य:",
  "Spinach": "पालक",
  "Paneer": "पनीर",
  "Eggs": "अंडी",
  "Oats": "ओट्स",
  "Curd": "दही",
  "Rice": "तांदूळ (भात)",
  "Chickpeas": "काबुली चणे / छोले",
  "Chicken": "चिकन",
  "Tomatoes": "टोमॅटो",
  "Tofu": "टोफू",
  "Lentils": "डाळी / कडधान्ये",
  "Cucumber": "काकडी",
  "In your kitchen ({n}):": "तुमच्या स्वयंपाकघरात उपलब्ध ({n}):",
  "Clear all": "सर्व काढून टाका",
  "Showing top {n} whole-food recipes matching your pantry:": "तुमच्या साहित्यानुसार उपलब्ध {n} पाककृती:",
  "Select ingredients above to find matching meals.": "पाककृती शोधण्यासाठी वरील उपलब्ध साहित्य निवडा.",
  "No matching recipes found with these exact ingredients.": "या साहित्याशी जुळणारी पाककृती आढळली नाही.",
  "✓ Matches {n} item": "✓ {n} साहित्य जुळले",
  "✓ Matches {n} items": "✓ {n} साहित्य जुळले",
  "Found in recipe:": "पाककृतीत समाविष्ट:",
  "🍳 Cook Now": "🍳 आता बनवा",
  "Recipe Details": "पाककृतीचा तपशील",
  "Try clicking popular staples like": "खालील नेहमीचे साहित्य निवडून पहा, जसे की",
  "or": "किंवा",

  // Generator form
  "Your plan": "तुमची आहार योजना",
  "Calculate your nutrition plan": "तुमची वैयक्तिक पोषण योजना तयार करा",
  "Add a few details and we will calculate your energy needs, macronutrient targets, and a day of meals built around them.":
    "थोडी माहिती भरा — आम्ही शरीराची दैनंदिन ऊर्जेची गरज, पोषक तत्त्वांची लक्ष्ये आणि त्यानुसार संतुलित आहार योजना तयार करू.",
  "Demo profile": "नमुना माहिती",
  "Reset": "रीसेट करा",
  "Saved plans": "जतन केलेल्या योजना",
  "View saved nutrition plans": "जतन केलेल्या पोषण योजना पहा",
  "Full name (optional)": "पूर्ण नाव (ऐच्छिक)",
  "e.g. Aarav Sharma (or leave blank for 'You')": "उदा. आरव शर्मा (रिकामे ठेवल्यास 'तुम्ही')",
  "Age": "वय",
  "Years": "वर्षे",
  "Sex": "लिंग",
  "Male": "पुरुष",
  "Female": "स्त्री",
  "Activity level": "शारीरिक हालचालींचे प्रमाण",
  "Low — mostly seated": "कमी — बैठे काम / कमी हालचाल",
  "Moderate — 3–4 workouts": "मध्यम — आठवड्यातून ३–४ दिवस व्यायाम",
  "High — daily training": "जास्त — दररोज नियमित व्यायाम",
  "Height (cm)": "उंची (सेंमी)",
  "Use imperial": "इंच/फूट वापरा",
  "Use metric": "सेंमी/किलो वापरा",
  "Height in cm": "उंची (सें.मी.)",
  "Total inches": "एकूण इंच",
  "Centimetres": "सेंटिमीटर",
  "Total inches, e.g. 70": "एकूण इंच, उदा. ७०",
  "Weight (kg)": "वजन (कि.ग्रॅ.)",
  "Weight in kg": "वजन (किलो)",
  "Weight in pounds": "वजन (पौंड)",
  "Kilograms": "किलोग्रॅम",
  "Pounds": "पौंड",
  "Fitness goal": "फिटनेस ध्येय",
  "Weight loss — calorie deficit": "वजन कमी करणे (कॅलरी डेफिसिट)",
  "Muscle gain — lean surplus": "स्नायू वाढवणे (मसल गेन)",
  "Maintain weight": "वजन नियंत्रित ठेवणे",
  "Diet preference": "आहार पसंती",
  "Indian vegetarian": "भारतीय शाकाहारी",
  "Indian vegan (dairy-free)": "भारतीय व्हिगन (दुग्धविरहित वनस्पती-आधारित)",
  "Eggetarian": "अंडाहारी (Eggetarian)",
  "Indian non-vegetarian": "भारतीय मांसाहारी",
  "Balanced (vegetarian and non-vegetarian)": "संतुलित (शाकाहारी व मांसाहारी)",
  "indian vegetarian": "भारतीय शाकाहारी",
  "indian vegan": "भारतीय व्हिगन (दुग्धविरहित)",
  "indian eggetarian": "भारतीय अंडाहारी",
  "indian non-vegetarian": "भारतीय मांसाहारी",
  "balanced": "संतुलित",
  "Allergies and exclusions": "ॲलर्जी व वर्ज्य पदार्थ",
  "e.g. milk, peanuts, shellfish": "उदा. दूध, शेंगदाणे, सीफूड/झिंगे (shellfish)",
  "Separate multiple items with commas.": "एकापेक्षा जास्त पदार्थ असल्यास स्वल्पविरामाने (,) वेगळे करा.",
  "Generate 1-day plan": "१-दिवसाची योजना तयार करा",
  "Generate 7-day plan": "७-दिवसांची योजना तयार करा",
  "Generating daily plan…": "दैनंदिन योजना तयार होत आहे…",
  "Building weekly plan…": "साप्ताहिक योजना तयार होत आहे…",

  // Status messages
  "Add your profile details to create a personalized, goal-based nutrition plan.":
    "ध्येयावर आधारित वैयक्तिक पोषण योजनेसाठी तुमची माहिती भरा.",
  "Form cleared. Start again with your latest profile details.":
    "फॉर्म साफ केला. पुन्हा नवीन माहिती भरू शकता.",
  "Demo profile loaded. Choose a 1-day or 7-day plan below.":
    "नमुना माहिती लोड केली. खाली १-दिवस किंवा ७-दिवसांची योजना निवडा.",
  "Calibrated to {name} ({split}). Ready to generate plan.":
    "{name} ({split}) नुसार सेट झाले. योजना तयार करण्यास सज्ज.",
  "Diet preference set to {diet}. Ready to calculate plan.":
    "आहार पसंती '{diet}' निवडली. योजना मोजण्यास सज्ज.",
  "Generating full 7-day varied weekly nutrition plan...": "संपूर्ण ७-दिवसांची वैविध्यपूर्ण पोषण योजना तयार होत आहे...",
  "Building your personalized daily nutrition plan...": "तुमची वैयक्तिक दैनंदिन पोषण योजना तयार होत आहे...",
  "Your 7-day nutrition plan is ready.": "तुमची ७-दिवसांची आहार योजना तयार आहे.",
  "Your personalized daily nutrition plan is ready.": "तुमची वैयक्तिक दैनंदिन पोषण योजना तयार आहे.",
  "Could not generate plan. Please verify your age, height, and weight inputs.":
    "योजना तयार करता आली नाही. कृपया आपले वय, उंची व वजन नीट तपासा.",
  "Please enter your {fields} before generating your meal plan.":
    "आहार योजना तयार करण्यापूर्वी कृपया {fields} ची माहिती भरा.",
  "Meal swapped: {name}": "जेवणाचा पदार्थ बदलला: {name}",
  "Restored saved plan for {user} ({date})": "{user} ({date}) साठी जतन केलेली योजना उघडली",
  "Height (inches)": "उंची (इंच)",
  "Weight (lbs)": "वजन (पौंड)",

  // History drawer
  "No saved plans yet. Generate your first plan to see it here.":
    "अजून कोणत्याही योजना जतन केलेल्या नाहीत. पहिली योजना तयार करा.",
  "7-day plan": "७-दिवसांची योजना",
  "1-day plan": "१-दिवसाची योजना",
  "View saved plans": "जतन केलेल्या योजना पहा",

  // BMI gauge
  "Live estimate": "तात्काळ अंदाज",
  "BMI index": "BMI निर्देशांक",
  "Est. maintenance": "अंदाजित दैनंदिन कॅलरी गरज",
  "Under 18.5": "१८.५ पेक्षा कमी",
  "18.5–24.9 Healthy": "१८.५–२४.९ योग्य/निरोगी",
  "25–29.9 Over": "२५–२९.९ जास्त वजन",
  "30+ Obese": "३०+ लठ्ठपणा",
  "Healthy Weight": "योग्य / निरोगी वजन",
  "Underweight": "कमी वजन",
  "Overweight": "जास्त वजन",
  "Obese": "लठ्ठपणा",

  // Water tracker
  "Daily hydration": "दैनंदिन पाणी (हायड्रेशन)",
  "A simple fluid goal based on your body weight": "तुमच्या वजनानुसार पाण्याचे दैनंदिन लक्ष्य",
  "% of goal": "% लक्ष्यापैकी",
  "Target": "लक्ष्य",
  "Logged": "नोंदवलेले",
  "Remaining": "शिल्लक",
  "Quick add": "झटपट जोडा",
  "Daily hydration goal reached.": "आजचे पाण्याचे लक्ष्य पूर्ण झाले! 🎉",
  "Logged {n} ml": "{n} मि.ली. नोंदवले",
  "Tracker reset for today.": "आजची नोंद रीसेट केली.",

  // Calorie tracker
  "Today's progress": "आजची प्रगती",
  "Select a meal to mark it eaten and update your totals.":
    "खाल्लेला आहार निवडा — कॅलरी आणि पोषक तत्त्वांची नोंद होईल.",
  "% eaten": "% पूर्ण",
  "Eaten": "खाल्लेले",
  "Carbs": "कार्बोहायड्रेट्स (कार्ब्स)",
  "Fats": "स्निग्ध पदार्थ (फॅट्स)",
  "Meal {n}": "आहार {n}",

  // Plan display
  "We could not generate this plan": "ही योजना तयार करता आली नाही",
  "Your 7-day nutrition plan": "तुमची ७-दिवसांची पोषण योजना",
  "Your daily nutrition plan": "तुमची दैनंदिन पोषण योजना",
  "Prepared for": "यांच्यासाठी तयार:",
  "Fridge Sheet": "फ्रिज शीट (प्रिंट)",
  "View and print fridge-ready plan sheet with grocery checklist":
    "फ्रिजवर लावण्यासाठी आहार योजना व किराणा यादी पहा आणि प्रिंट करा",
  "Print": "प्रिंट करा",
  "Print or save as PDF": "प्रिंट करा किंवा PDF म्हणून जतन करा",
  "Day": "दिवस",
  "Meals": "आहार / भोजन",
  "Grocery list": "किराणा यादी",
  "Calorie & macro distribution": "कॅलरी व पोषक तत्त्वांचे वाटप",
  "Energy & metabolic targets": "ऊर्जा व चयापचय लक्ष्ये",
  "kcal / day": "कॅलरी / दिवस",
  "kcal": "कॅलरी",
  "kcal target": "कॅलरी लक्ष्य",
  "Carbohydrates": "कार्बोहायड्रेट्स",
  "Healthy Fats": "चांगले स्निग्ध पदार्थ (Healthy Fats)",
  "Calorie Budget by Meal": "जेवणानुसार कॅलरी वाटप",
  "7-day calorie overview": "७-दिवसांचा कॅलरी आढावा",
  "Select a day to view its meals": "आहार पाहण्यासाठी दिवस निवडा",
  "Meal timing": "जेवणाची वेळ",
  "About 13 hours overnight": "रात्री सुमारे १३ तासांचे अंतर",
  "prep": "तयारी",
  "cook": "शिजवा",
  "High protein": "उच्च प्रोटीन",
  "Sustained energy": "दीर्घकाळ टिकणारी ऊर्जा",
  "Quick prep": "झटपट तयारी",
  "Recipe": "पाककृती",
  "Swap": "बदला",
  "Swapping…": "बदलत आहे…",
  "Key ingredients": "मुख्य साहित्य",
  "Why this meal works": "या आहाराचे फायदे",
  "Weekly grocery list": "साप्ताहिक किराणा यादी",
  "Everything you need for the meals in this plan": "या योजनेतील सर्व आहारांसाठी लागणारे साहित्य",
  "Copy list": "यादी कॉपी करा",
  "Grocery list copied to your clipboard.": "किराणा यादी क्लिपबोर्डवर कॉपी झाली.",
  "Fresh produce": "ताज्या भाज्या व फळे",
  "Protein & dairy": "प्रोटीन आणि दुग्धजन्य पदार्थ",
  "Grains & carbohydrates": "धान्ये व कर्बोदके",
  "Pantry & oils": "मसाले व तेल",

  // Recipe modal
  "Prep time": "तयारीची वेळ",
  "Cook time": "शिजवण्याची वेळ",
  "Calories": "कॅलरी",
  "Goal alignment": "आरोग्य ध्येयाशी सुसंगत",
  "High carbohydrate": "उच्च कार्बोहायड्रेट",
  "Balanced macros": "संतुलित पोषक तत्त्वे",
  "Ingredients": "साहित्य",
  "Method": "कृती",
  "Prepare and wash all ingredients freshly. Cook with minimal healthy cold-pressed oil or ghee.":
    "सर्व साहित्य ताजे व स्वच्छ धुवून तयार करा. कमी प्रमाणात घाण्याचे तेल किंवा शुद्ध तुपात शिजवा.",
  "Why this meal works:": "या आहाराचे महत्त्व / फायदे:",
  "🍳 Start Kitchen Cooking Mode": "🍳 स्वयंपाक मोड सुरू करा",
  "Close recipe": "पाककृती बंद करा",

  // Kitchen cooking mode
  "🍳 Interactive Kitchen Mode": "🍳 स्वयंपाक मोड",
  "✕ Exit Cooking Mode": "✕ स्वयंपाक मोड बंद करा",
  "Mise en place": "साहित्याची पूर्वतयारी",
  "{a} of {b} ready": "{a} / {b} तयार",
  "Tap ingredients as you prep or add them to the pan:":
    "साहित्य तयार करताना किंवा कढईत घालताना टिक करा:",
  "Step {n} of {m}": "टप्पा {n} / {m}",
  "Kitchen Timer": "स्वयंपाक टाइमर",
  "00:00 — Ready!": "००:०० — तयार!",
  "Pause": "थांबवा (Pause)",
  "Resume": "पुन्हा सुरू करा",
  "Start 5m": "५ मिनिटे सुरू",
  "← Previous step": "← मागील टप्पा",
  "Next step →": "पुढील टप्पा →",
  "🎉 Meal complete! Enjoy": "🎉 जेवण तयार झाले! आस्वाद घ्या!",
  "Prepare and wash all fresh whole-food ingredients thoroughly.":
    "सर्व ताजे व नैसर्गिक साहित्य स्वच्छ धुवून तयार करा.",
  "Cook over gentle heat with minimal cold-pressed oil or ghee until tender and aromatic.":
    "मंद आचेवर थोडे घाण्याचे तेल किंवा तुपात छान सुगंध येईपर्यंत शिजवा.",
  "Plate fresh and garnish with garden herbs.":
    "ताजे वाढा आणि कोथिंबीर किंवा पुदिन्याने सजवा.",

  // Fridge sheet
  "Fridge-Ready Weekly Sheet (Formatted for Home Printing)": "फ्रिजवर लावण्यासाठी साप्ताहिक शीट (प्रिंटसाठी)",
  "Print Sheet / Save PDF": "शीट प्रिंट करा / PDF म्हणून जतन करा",
  "Close": "बंद करा",
  "Weekly Whole-Food Nourishment Protocol": "साप्ताहिक पोषण योजना",
  "Prepared for:": "यांच्यासाठी:",
  "Date:": "दिनांक:",
  "Health & Vitality": "आरोग्य व उत्तम ऊर्जा",
  "Daily kcal Target": "रोजचे कॅलरी लक्ष्य",
  "Protein Goal": "प्रोटीन लक्ष्य",
  "Water (8 glasses)": "पाणी (८ ग्लास)",
  "7-Day Meal Schedule": "७-दिवसांचे आहार नियोजन",
  "Stick on fridge for quick daily reference": "दररोज पाहण्यासाठी फ्रिजवर चिकटवा",
  "Snack & Fuel": "अल्पोपहार (स्नॅक्स)",
  "Today": "आज",
  "Categorized Grocery Checklist": "वर्गवारीनुसार किराणा यादी",
  "Bring to market or check off in pantry": "बाजारात खरेदीसाठी किंवा घरातील साठ्याची तपासणी करण्यासाठी",
  "🌿 Whole-Food Nutrition · Verified against Mifflin-St Jeor metabolic formulas":
    "🌿 नैसर्गिक पोषण · मिफ्लिन-सेंट जेऑर सूत्रावर आधारित",
  "Prep tip: Batch-cook grains and soak lentils on Sunday evening":
    "टीप: रविवारी संध्याकाळी धान्ये शिजवून ठेवा आणि डाळी भिजत घाला",

  // Empty state
  "Nutrition tailored to your everyday life": "तुमच्या रोजच्या जीवनशैलीसाठी योग्य पोषण",
  "Add your details above to generate a daily or 7-day plan with practical recipes, clear macro targets, and a categorized grocery list.":
    "वरील फॉर्म भरा — दैनंदिन किंवा ७-दिवसांची योजना, स्वादिष्ट पाककृती, स्पष्ट पोषक तत्त्वे व किराणा यादीसह लगेच मिळेल.",
  "7-day weekly planner": "साप्ताहिक आहार नियोजक",
  "Varied recipes from Monday to Sunday, built around your daily calorie target.":
    "सोमवार ते रविवार वैविध्यपूर्ण पाककृती, तुमच्या दैनंदिन कॅलरी लक्ष्यानुसार.",
  "Macro breakdowns": "पोषक घटकांचे प्रमाण (Macros)",
  "A clear view of protein, carbohydrates, and fats for every plan.":
    "प्रत्येक योजनेतील प्रोटीन, कार्बोहायड्रेट्स आणि स्निग्ध पदार्थांचे स्पष्ट प्रमाण.",
  "Step-by-step recipes": "सविस्तर कृतीसह पाककृती",
  "Prep time, cook time, ingredients, and concise methods for each meal.":
    "प्रत्येक आहारासाठी पूर्वतयारी, वेळ, साहित्य आणि सोपी कृती.",
  "Hydration tracking": "पाणी पिण्याची नोंद (हायड्रेशन)",
  "A personalized daily water goal with simple one-tap logging.":
    "तुमच्या वजनानुसार पाण्याचे लक्ष्य आणि एका टॅपने सोपी नोंद.",

  // Footer + legal
  "Your free personal nutrition engine. Evidence-based meal plans, macro targets, and grocery lists — all in one place.":
    "तुमचे मोफत वैयक्तिक पोषण मार्गदर्शक. वैज्ञानिक आधारावर तयार केलेल्या आहार योजना, पोषक तत्त्वांची लक्ष्ये आणि किराणा यादी — सर्व एकाच ठिकाणी.",
  "Nutrition Plans": "पोषण योजना",
  "Diet Types": "आहार प्रकार",
  "Platform": "प्लॅटफॉर्म",
  "1-Day Plan": "१-दिवसाची योजना",
  "7-Day Weekly Plan": "७-दिवसांची योजना",
  "Grocery Lists": "किराणा याद्या",
  "Hydration Tracker": "पाणी ट्रॅकर (हायड्रेशन)",
  "Indian Vegetarian": "भारतीय शाकाहारी",
  "Vegan": "व्हिगन (वनस्पती-आधारित)",
  "Non-Vegetarian": "मांसाहारी",
  "Balanced": "संतुलित",
  "Privacy Policy": "गोपनीयता धोरण",
  "Terms of Service": "सेवा अटी",
  "Contact": "संपर्क",
  "© 2026 Smart Nutrition. All rights reserved.": "© 2026 Smart Nutrition. सर्व हक्क राखीव.",
  "Privacy Policy (body)": "Smart Nutrition तुमच्या गोपनीयतेला सर्वोच्च महत्त्व देते. सर्व शारीरिक माहिती व आकडेमोड तुमच्या ब्राउझरमध्येच होते. आम्ही तुमची वैयक्तिक माहिती कोणत्याही जाहिरात संस्थेला विकत नाही किंवा शेअर करत नाही.",
  "Terms of Service (body)": "Smart Nutrition ही वैयक्तिक आरोग्य, आहार नियोजन व शैक्षणिक उपयोगासाठी खुली पोषण गणना प्रणाली आहे. ऊर्जेची गणना मिफ्लिन-सेंट जेऑर समीकरणावर आधारित आहे. कोणत्याही वैद्यकीय सल्ल्यासाठी नोंदणीकृत डॉक्टर किंवा आहारतज्ज्ञांचा सल्ला घ्यावा.",
  "Contact & Clinical Feedback": "संपर्क व अभिप्राय",
  "Contact (body)": "पोषण संशोधक, वापरकर्ते व वैद्यकीय व्यावसायिकांकडून सूचना व अभिप्राय स्वागतार्ह आहेत. clinical@smartnutrition.local वर संपर्क करा किंवा आमच्या GitHub वर तक्रार/सूचना नोंदवा.",

  // Extra
  "Goal:": "ध्येय:",
  "🍳 Cook": "🍳 बनवा",
  "Home": "मुखपृष्ठ",
  "About Us": "आमच्याबद्दल",
  "How It Works": "हे कसे काम करते",
  "Monday": "सोमवार",
  "Tuesday": "मंगळवार",
  "Wednesday": "बुधवार",
  "Thursday": "गुरुवार",
  "Friday": "शुक्रवार",
  "Saturday": "शनिवार",
  "Sunday": "रविवार",
  "Basal Metabolic Rate (BMR)": "बेसल मेटाबॉलिक रेट (BMR)",
  "Calories burned at complete rest": "शरीराच्या पूर्ण विश्रांतीत खर्च होणाऱ्या मूलभूत कॅलरी",
  "Maintenance Energy (TDEE)": "दैनंदिन ऊर्जा गरज (TDEE)",
  "Total daily energy expenditure": "एकूण दैनंदिन ऊर्जा खर्च (TDEE)",
  "Target Intake": "दैनंदिन कॅलरी लक्ष्य",
  "Optimized for your fitness goal": "तुमच्या फिटनेस ध्येयानुसार अनुकूल",
  "Plate Calories (from recipes)": "जेवणातील प्रत्यक्ष कॅलरी (पाककृतींनुसार)",
  "Sum of catalog nutrition, not a TDEE split": "पाककृतींनुसार एकूण पोषण मूल्ये — TDEE विभागणी नाही",
};
