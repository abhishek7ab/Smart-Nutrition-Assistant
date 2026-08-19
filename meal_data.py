# meal_data.py
"""
Curated Recipe Pools and Swap Alternatives by Category & Diet.
"""

MEAL_DATABASE = {
    "indian_veg": {
        "breakfast": [
            {
                "name": "Breakfast: Moong Dal Chilla with Mint Chutney & Curd",
                "ingredients": ["2 moong dal chillas", "75g fresh paneer filling", "1 tbsp mint chutney", "1 cup low-fat curd"],
                "reason": "High-protein vegetarian breakfast rich in bioavailable plant protein, iron, and gut-friendly probiotics.",
                "prep_time": "10 mins",
                "cook_time": "15 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Soak split yellow moong dal for 30 mins, then grind into a smooth batter with ginger and green chillies.",
                    "Heat a non-stick pan with minimal oil spray and spread a ladle of batter thinly.",
                    "Sprinkle crumbled paneer and fresh coriander on top, flip gently, and cook both sides until golden brown.",
                    "Serve warm with fresh mint-coriander chutney and 1 cup of curd."
                ],
                "swaps": {"swap1": {"original_ingredient": "Paneer filling", "swap_option": "Tofu & sprout stuffing", "calorie_diff": -30}}
            },
            {
                "name": "Breakfast: Vegetable Oats Upma with Peanuts & Boiled Sprouts",
                "ingredients": ["1 cup rolled oats", "1/2 cup mixed diced veggies (carrots, peas, beans)", "1 tbsp roasted peanuts", "1/2 cup boiled moong sprouts", "1 tsp mustard seeds and curry leaves"],
                "reason": "High in beta-glucan fiber for cholesterol control and sustained glycemic release.",
                "prep_time": "10 mins",
                "cook_time": "12 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Dry roast rolled oats in a skillet for 3 mins until fragrant.",
                    "Splutter mustard seeds, green chilli, and curry leaves in 1 tsp olive oil or ghee.",
                    "Sauté diced vegetables and boiled sprouts until tender-crisp.",
                    "Add 2 cups of hot water and roasted oats, simmering for 4 minutes until thick and fluffy."
                ],
                "swaps": {"swap1": {"original_ingredient": "Peanuts", "swap_option": "Chia & pumpkin seeds", "calorie_diff": 0}}
            },
            {
                "name": "Breakfast: Paneer Stuffed Multigrain Paratha with Curd",
                "ingredients": ["2 multigrain rotis/parathas", "80g spiced low-fat paneer", "1 cup probiotic curd", "1/2 cup cucumber slices"],
                "reason": "Wholesome complex carbohydrates paired with slow-digesting casein protein.",
                "prep_time": "12 mins",
                "cook_time": "15 mins",
                "difficulty": "Medium",
                "instructions": [
                    "Mix grated paneer with chopped green chillies, coriander, cumin powder, and a pinch of salt.",
                    "Stuff into whole wheat or multigrain dough and roll out smoothly.",
                    "Cook on a medium hot tawa with a light brush of ghee until crisp.",
                    "Enjoy with probiotic plain curd and cooling cucumber slices."
                ],
                "swaps": {"swap1": {"original_ingredient": "Low-fat paneer", "swap_option": "Grated tofu & flaxseed", "calorie_diff": -25}}
            }
        ],
        "lunch": [
            {
                "name": "Lunch: Paneer Tikka with Yellow Tadka Dal & Brown Rice",
                "ingredients": ["120g grilled paneer tikka", "3/4 cup yellow tadka dal", "3/4 cup brown rice", "1 cup kachumber salad (cucumber, tomato, onion)"],
                "reason": "Complete amino acid profile pairing legumes with brown rice, balanced with high-calcium dairy.",
                "prep_time": "15 mins",
                "cook_time": "20 mins",
                "difficulty": "Medium",
                "instructions": [
                    "Marinate paneer cubes with curd, turmeric, cumin, garam masala, and lemon juice for 15 mins.",
                    "Grill paneer on a skillet or air fryer for 8 mins until charred at the edges.",
                    "Serve with freshly prepared yellow dal tadka, steamed brown rice, and fresh lemon kachumber."
                ],
                "swaps": {"swap1": {"original_ingredient": "Brown rice", "swap_option": "2 Whole-wheat phulkas", "calorie_diff": -20}}
            },
            {
                "name": "Lunch: High-Protein Rajma Masala with Quinoa & Steamed Beans",
                "ingredients": ["1 cup cooked red kidney beans (rajma)", "3/4 cup cooked quinoa", "1 cup steamed french beans & carrots", "1 cup plain raita"],
                "reason": "Dense in plant protein, dietary fiber, magnesium, and resistant starch.",
                "prep_time": "15 mins",
                "cook_time": "25 mins",
                "difficulty": "Medium",
                "instructions": [
                    "Pressure cook soaked rajma with aromatics (onion, ginger-garlic, tomato purée, and garam masala).",
                    "Simmer rajma until the gravy is rich and velvety.",
                    "Serve over fluffy cooked quinoa with lightly spiced cucumber raita and steamed vegetables."
                ],
                "swaps": {"swap1": {"original_ingredient": "Quinoa", "swap_option": "Brown Basmati rice", "calorie_diff": 10}}
            },
            {
                "name": "Lunch: Soya Chunk Matar Curry with Multigrain Rotis & Curd",
                "ingredients": ["50g textured soya chunks", "1/2 cup green peas", "2 multigrain rotis", "1 cup mixed vegetable salad", "1/2 cup curd"],
                "reason": "Massive plant protein concentration (over 25g protein from soya alone) with low fat.",
                "prep_time": "10 mins",
                "cook_time": "18 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Boil soya chunks in water with a pinch of salt for 5 mins, rinse and squeeze out excess water.",
                    "Sauté onion, garlic, tomatoes, and spices in 1 tsp oil, then add green peas and soya chunks.",
                    "Add 1 cup water and simmer for 10 minutes until flavors blend thoroughly.",
                    "Serve hot with warm multigrain rotis and cooling salad."
                ],
                "swaps": {"swap1": {"original_ingredient": "Soya chunks", "swap_option": "Grilled paneer cubes", "calorie_diff": 40}}
            }
        ],
        "dinner": [
            {
                "name": "Dinner: Palak Paneer with Whole Wheat Phulkas & Salad",
                "ingredients": ["100g paneer cubes", "1.5 cups blanched spinach purée", "2 whole wheat phulkas (no oil)", "1 cup cucumber salad"],
                "reason": "Rich in lutein, iron, and magnesium to promote restful sleep and night muscle synthesis.",
                "prep_time": "12 mins",
                "cook_time": "15 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Blanch washed spinach leaves in boiling water for 2 mins, then plunge into cold water and blend with green chilli.",
                    "Sauté garlic, cumin seeds, and chopped onion in 1 tsp ghee, then pour in spinach purée.",
                    "Stir in soft paneer cubes and a pinch of garam masala. Simmer on low heat for 4 mins.",
                    "Serve warm with hot oil-free phulkas."
                ],
                "swaps": {"swap1": {"original_ingredient": "Paneer", "swap_option": "Firm organic tofu", "calorie_diff": -45}}
            },
            {
                "name": "Dinner: Moong Dal Khichdi with Roasted Papad, Curd & Baingan Bharta",
                "ingredients": ["1.25 cups moong dal & brown rice khichdi", "1 cup roasted baingan bharta (spiced eggplant)", "1/2 cup curd", "1 roasted papad"],
                "reason": "Light, highly digestible dinner promoting gut restoration and optimal recovery.",
                "prep_time": "10 mins",
                "cook_time": "20 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Combine equal parts yellow moong dal and rice with turmeric, cumin, and salt in a cooker.",
                    "Roast eggplant over an open flame, peel, mash, and sauté with onions and tomatoes.",
                    "Serve steaming khichdi with a dash of pure ghee, spiced baingan bharta, and curd."
                ],
                "swaps": {"swap1": {"original_ingredient": "Khichdi", "swap_option": "Oats vegetable khichdi", "calorie_diff": -30}}
            }
        ],
        "snack": [
            {
                "name": "Snack: Sprouted Moong Chaat with Pomegranate & Lemon",
                "ingredients": ["1 cup boiled/raw sprouted moong", "1/4 cup diced onion & tomato", "2 tbsp pomegranate pearls", "1 tsp chaat masala & lemon juice"],
                "reason": "Low glycemic load, high dietary fiber, and active digestive enzymes.",
                "prep_time": "5 mins",
                "cook_time": "0 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Toss sprouted moong with diced onions, tomatoes, green chillies, and sweet pomegranate pearls.",
                    "Season with black salt, roasted cumin powder, chaat masala, and fresh lemon juice.",
                    "Garnish with fresh cilantro."
                ],
                "swaps": {"swap1": {"original_ingredient": "Moong sprouts", "swap_option": "Roasted makhana & almonds", "calorie_diff": 20}}
            },
            {
                "name": "Snack: Roasted Makhana (Fox Nuts) & Handful of Almonds",
                "ingredients": ["30g roasted fox nuts (makhana)", "12 raw almonds", "1 cup green tea with lemon"],
                "reason": "Rich in magnesium and antioxidants, perfect for satisfying crunch without extra calories.",
                "prep_time": "2 mins",
                "cook_time": "5 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Dry roast makhana in a heavy pan on low heat with a pinch of turmeric, black pepper, and rock salt until crunchy.",
                    "Pair with raw almonds and a hot cup of unsweetened green tea."
                ],
                "swaps": {"swap1": {"original_ingredient": "Almonds", "swap_option": "Walnut halves", "calorie_diff": 10}}
            }
        ]
    },
    "non_veg": {
        "breakfast": [
            {
                "name": "Breakfast: Masala Omelette with Multigrain Toast & Fruit",
                "ingredients": ["2 whole eggs + 1 egg white", "2 slices whole wheat/multigrain toast", "1/2 cup diced onion, tomato & green chilli", "1 medium orange"],
                "reason": "High biological value protein, choline for brain focus, and vitamin C for immunity.",
                "prep_time": "5 mins",
                "cook_time": "8 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Whisk eggs with finely diced onions, tomatoes, coriander, turmeric, and pinch of black pepper.",
                    "Cook in a lightly greased skillet on medium flame for 2 mins each side.",
                    "Serve with toasted whole grain bread and a fresh orange."
                ],
                "swaps": {"swap1": {"original_ingredient": "Multigrain toast", "swap_option": "Whole-wheat paratha", "calorie_diff": 40}}
            },
            {
                "name": "Breakfast: Boiled Eggs, Avocado & Herb Sourdough Toast",
                "ingredients": ["3 soft-boiled eggs", "1/2 ripe avocado mashed", "2 slices sourdough toast", "1 tsp chia seeds"],
                "reason": "Healthy monounsaturated fatty acids with slow-digesting complex carbohydrates.",
                "prep_time": "6 mins",
                "cook_time": "7 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Boil eggs in bubbling water for 6.5 minutes for jammy yolks, then peel.",
                    "Toast sourdough bread until crispy; spread seasoned mashed avocado with lemon juice.",
                    "Slice boiled eggs over toast, sprinkle chia seeds and chilli flakes."
                ],
                "swaps": {"swap1": {"original_ingredient": "Sourdough toast", "swap_option": "Gluten-free toast", "calorie_diff": 0}}
            }
        ],
        "lunch": [
            {
                "name": "Lunch: Grilled Herb Chicken Breast with Jeera Brown Rice & Dal",
                "ingredients": ["150g grilled chicken breast", "3/4 cup jeera brown rice", "1/2 cup yellow dal", "1 cup crisp green salad"],
                "reason": "High-leucine lean poultry to maximize muscle protein synthesis with clean carbs.",
                "prep_time": "10 mins",
                "cook_time": "18 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Marinate chicken breast with lemon juice, ginger-garlic paste, black pepper, and oregano.",
                    "Sear on a medium-hot grill pan for 6 minutes per side until golden and cooked through.",
                    "Serve alongside warm jeera brown rice, protein-rich dal, and mixed greens."
                ],
                "swaps": {"swap1": {"original_ingredient": "Chicken breast", "swap_option": "Fish fillet (Rohu / Basa)", "calorie_diff": -20}}
            },
            {
                "name": "Lunch: Chicken Tikka Whole-Wheat Wrap with Mint Yogurt & Veggies",
                "ingredients": ["140g grilled chicken tikka", "1 large whole-wheat tortilla / roti", "1/2 cup shredded cabbage & carrots", "2 tbsp mint-Greek yogurt dip"],
                "reason": "Portable high-protein balanced lunch with high satiety rating.",
                "prep_time": "10 mins",
                "cook_time": "12 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Warm the whole wheat roti on a dry skillet.",
                    "Layer crisp shredded cabbage, cucumber, and warm grilled chicken tikka pieces.",
                    "Drizzle refreshing mint yogurt dressing, roll tightly, and slice in half."
                ],
                "swaps": {"swap1": {"original_ingredient": "Tortilla", "swap_option": "Brown rice bowl", "calorie_diff": 0}}
            }
        ],
        "dinner": [
            {
                "name": "Dinner: Pan-Seared Salmon (or Rohu) with Roasted Veggies & Sweet Potato",
                "ingredients": ["150g salmon or fresh fish fillet", "1 medium baked sweet potato", "1.5 cups broccoli & bell peppers", "1 tbsp lemon-herb dressing"],
                "reason": "Rich in EPA/DHA Omega-3 fatty acids to reduce joint inflammation and support deep sleep recovery.",
                "prep_time": "10 mins",
                "cook_time": "15 mins",
                "difficulty": "Medium",
                "instructions": [
                    "Season fish fillet with sea salt, cracked black pepper, smoked paprika, and lemon juice.",
                    "Pan-sear in 1 tsp olive oil skin-side down for 4 mins, flip and cook 3 mins.",
                    "Roast broccoli florets and sweet potato cubes until caramelized; serve together."
                ],
                "swaps": {"swap1": {"original_ingredient": "Salmon", "swap_option": "Grilled chicken breast", "calorie_diff": -40}}
            },
            {
                "name": "Dinner: Homestyle Egg Curry with Multigrain Rotis & Cucumber Raita",
                "ingredients": ["3 boiled eggs in tomato-onion curry", "2 multigrain rotis", "1/2 cup cucumber raita", "1 cup steamed green beans"],
                "reason": "Wholesome comforting dinner with complete essential amino acids and anti-inflammatory spices.",
                "prep_time": "10 mins",
                "cook_time": "20 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Make a savory gravy with sautéed onions, ginger, garlic, pureed tomatoes, and garam masala.",
                    "Slit boiled eggs and simmer in the bubbling gravy for 6 minutes.",
                    "Serve hot with multigrain rotis and chilled cucumber raita."
                ],
                "swaps": {"swap1": {"original_ingredient": "Multigrain rotis", "swap_option": "1 cup Steamed quinoa", "calorie_diff": -10}}
            }
        ],
        "snack": [
            {
                "name": "Snack: Boiled Egg Whites with Chaat Masala & Roasted Chana",
                "ingredients": ["3 boiled egg whites", "35g roasted chana", "pinch of black pepper and chaat masala"],
                "reason": "Pure protein booster with zero saturated fat paired with crunchy fiber-rich chickpeas.",
                "prep_time": "3 mins",
                "cook_time": "0 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Peel hard-boiled eggs and discard yolks.",
                    "Slice egg whites, dust with chaat masala and black pepper.",
                    "Pair with crispy roasted chana."
                ],
                "swaps": {"swap1": {"original_ingredient": "Roasted chana", "swap_option": "Roasted almonds (15g)", "calorie_diff": 15}}
            },
            {
                "name": "Snack: Greek Yogurt Berry Parfait with Chia Seeds",
                "ingredients": ["1 cup unsweetened Greek yogurt", "1/2 cup fresh berries / pomegranate", "1 tsp chia seeds", "1 tsp honey"],
                "reason": "Slow-release protein for prolonged muscle repair with prebiotic antioxidants.",
                "prep_time": "3 mins",
                "cook_time": "0 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Layer thick Greek yogurt in a glass or bowl.",
                    "Top with fresh berries, chia seeds, and a light drizzle of honey."
                ],
                "swaps": {"swap1": {"original_ingredient": "Greek yogurt", "swap_option": "Whey protein shake in almond milk", "calorie_diff": -20}}
            }
        ]
    },
    "vegan": {
        "breakfast": [
            {
                "name": "Breakfast: Protein Oatmeal Bowl with Chia Seeds, Almond Butter & Berries",
                "ingredients": ["1 cup rolled oats", "1.5 cups unsweetened almond/soy milk", "1 tbsp chia seeds", "1 tbsp natural almond butter", "1/2 cup fresh blueberries"],
                "reason": "High-fiber complex carbohydrates with healthy plant fats for continuous cognitive energy.",
                "prep_time": "5 mins",
                "cook_time": "8 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Simmer rolled oats with plant milk on low heat for 5 minutes until creamy.",
                    "Stir in chia seeds, remove from heat, and transfer to a bowl.",
                    "Top with fresh blueberries and a swirl of creamy almond butter."
                ],
                "swaps": {"swap1": {"original_ingredient": "Almond butter", "swap_option": "Peanut butter / Hemp seeds", "calorie_diff": 0}}
            },
            {
                "name": "Breakfast: Tofu Scramble with Turmeric, Spinach & Multigrain Toast",
                "ingredients": ["150g crumbled firm tofu", "1 cup fresh spinach", "1/2 cup diced peppers & onions", "2 slices multigrain toast", "1/2 tsp turmeric & black salt"],
                "reason": "Plant-based egg alternative rich in soy isoflavones, iron, and complete proteins.",
                "prep_time": "8 mins",
                "cook_time": "10 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Crumble firm tofu with hands. Season with turmeric, nutritional yeast, and black salt (kala namak).",
                    "Sauté onions and bell peppers in 1 tsp olive oil until soft, add spinach and tofu.",
                    "Cook for 5 mins until hot and fragrant; serve on toasted whole grain bread."
                ],
                "swaps": {"swap1": {"original_ingredient": "Firm tofu", "swap_option": "Sprouted moong chilla", "calorie_diff": 10}}
            }
        ],
        "lunch": [
            {
                "name": "Lunch: High-Protein Chickpea & Tofu Buddha Bowl with Tahini",
                "ingredients": ["1 cup roasted chickpeas", "120g grilled tofu cubes", "3/4 cup brown rice or quinoa", "1 cup steamed broccoli & shredded purple cabbage", "1.5 tbsp lemon-tahini dressing"],
                "reason": "Synergistic plant proteins with calcium, iron, and healthy sesame fats.",
                "prep_time": "15 mins",
                "cook_time": "20 mins",
                "difficulty": "Medium",
                "instructions": [
                    "Toss boiled chickpeas and tofu cubes in cumin, paprika, and garlic powder; roast in pan or oven until crispy.",
                    "Arrange warm quinoa, steamed broccoli, and shredded cabbage in a bowl.",
                    "Place roasted protein on top and drizzle with lemon tahini dressing."
                ],
                "swaps": {"swap1": {"original_ingredient": "Quinoa", "swap_option": "Millet / Brown rice", "calorie_diff": 0}}
            },
            {
                "name": "Lunch: Yellow Lentil & Vegetable Stew with Brown Basmati Rice",
                "ingredients": ["1 cup yellow lentil dal with spinach & tomatoes", "1 cup brown basmati rice", "1 cup cucumber & radish salad", "1 tbsp flaxseed powder"],
                "reason": "Easily absorbable vegan protein, gut fiber, and plant-based ALA Omega-3s.",
                "prep_time": "10 mins",
                "cook_time": "20 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Pressure cook yellow moong/toor dal with chopped spinach, tomatoes, and turmeric.",
                    "Temper with cumin seeds, garlic, and green chilli in 1 tsp sesame or olive oil.",
                    "Serve hot over brown basmati rice and sprinkle ground flaxseed over salad."
                ],
                "swaps": {"swap1": {"original_ingredient": "Brown rice", "swap_option": "Whole wheat rotis (2)", "calorie_diff": -15}}
            }
        ],
        "dinner": [
            {
                "name": "Dinner: Black Bean & Sweet Potato Power Bowl with Guacamole",
                "ingredients": ["1 cup seasoned black beans", "1 medium roasted sweet potato", "1 cup steamed kale & corn", "2 tbsp homemade guacamole"],
                "reason": "Rich in anthocyanins, resistant starch, and potassium for cardiovascular vitality.",
                "prep_time": "12 mins",
                "cook_time": "18 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Warm black beans with cumin, lime juice, and smoked paprika.",
                    "Roast sweet potato cubes until tender inside and caramelized on edges.",
                    "Assemble kale, corn, sweet potato, and beans in a bowl topped with fresh guacamole."
                ],
                "swaps": {"swap1": {"original_ingredient": "Black beans", "swap_option": "Edamame beans", "calorie_diff": -20}}
            },
            {
                "name": "Dinner: Grilled Tofu Tikka with Roti & Steamed Veggies",
                "ingredients": ["150g marinated tofu tikka", "2 whole-wheat rotis", "1 cup sautéed bell peppers & mushrooms", "1 tbsp green mint chutney"],
                "reason": "Low-fat vegan dinner with high amino acid density.",
                "prep_time": "15 mins",
                "cook_time": "12 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Marinate tofu in vegan curd (soy/cashew) or lemon juice with tandoori spices.",
                    "Pan-sear until slightly charred on each side.",
                    "Serve with soft phulkas and sautéed seasonal vegetables."
                ],
                "swaps": {"swap1": {"original_ingredient": "Rotis", "swap_option": "Cauliflower rice & Quinoa", "calorie_diff": -60}}
            }
        ],
        "snack": [
            {
                "name": "Snack: Roasted Edamame & Fresh Apple Slices",
                "ingredients": ["1/2 cup lightly salted roasted edamame", "1 crisp green/red apple", "1 cup green tea"],
                "reason": "Complete plant protein snack with pectin fiber for hunger control.",
                "prep_time": "2 mins",
                "cook_time": "0 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Snack on crunchy roasted edamame beans alongside freshly sliced apple."
                ],
                "swaps": {"swap1": {"original_ingredient": "Edamame", "swap_option": "Roasted chickpeas", "calorie_diff": 10}}
            },
            {
                "name": "Snack: Sprouted Moong & Peanut Chaat",
                "ingredients": ["1 cup sprouted moong", "1.5 tbsp roasted peanuts", "diced onion, tomato, lemon & chaat masala"],
                "reason": "Enzyme-rich raw snack packed with folate and vitamin C.",
                "prep_time": "5 mins",
                "cook_time": "0 mins",
                "difficulty": "Easy",
                "instructions": [
                    "Mix fresh sprouted moong with crunchy peanuts and chopped veggies.",
                    "Drizzle fresh lemon juice and season with chaat masala."
                ],
                "swaps": {"swap1": {"original_ingredient": "Peanuts", "swap_option": "Pumpkin & sunflower seeds", "calorie_diff": 5}}
            }
        ]
    }
}

# Fallback Alternative Swaps
ALTERNATIVES = {
    "breakfast": [
        {
            "name": "Breakfast: Avocado Toast & Poached Eggs",
            "ingredients": ["2 poached eggs", "1/2 ripe avocado", "2 slices sourdough toast", "1 tsp chia seeds"],
            "reason": "Provides healthy monounsaturated fats and high bio-available protein.",
            "prep_time": "5 mins",
            "cook_time": "8 mins",
            "difficulty": "Easy",
            "instructions": ["Toast sourdough", "Poach eggs in simmering water for 3 mins", "Mash avocado with lemon & layer toast"],
            "swaps": {"swap1": {"original_ingredient": "Sourdough toast", "swap_option": "Gluten-free toast", "calorie_diff": 0}}
        },
        {
            "name": "Breakfast: Protein Berry Smoothie Bowl",
            "ingredients": ["1 scoop plant/whey protein", "1 cup frozen berries", "1/2 banana", "1 cup almond milk", "1 tbsp flaxseeds"],
            "reason": "Packed with antioxidants and fast-absorbing protein for active mornings.",
            "prep_time": "5 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "instructions": ["Blend all ingredients until thick and creamy", "Pour into a bowl and garnish with berries & seeds"],
            "swaps": {"swap1": {"original_ingredient": "Almond milk", "swap_option": "Oat milk", "calorie_diff": 20}}
        }
    ],
    "lunch": [
        {
            "name": "Lunch: Mediterranean Quinoa & Feta Salad",
            "ingredients": ["1 cup cooked quinoa", "50g feta cheese", "1/2 cup cucumbers", "10 Kalamata olives", "1 tbsp extra virgin olive oil"],
            "reason": "Rich in heart-healthy fats, complex carbohydrates, and Mediterranean micronutrients.",
            "prep_time": "10 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "instructions": ["Toss cooked quinoa with diced vegetables and crumbled feta", "Drizzle with olive oil and oregano"],
            "swaps": {"swap1": {"original_ingredient": "Feta cheese", "swap_option": "Tofu cubes", "calorie_diff": -15}}
        },
        {
            "name": "Lunch: Turkey & Avocado Whole Wheat Wrap",
            "ingredients": ["100g sliced turkey breast", "1 whole wheat wrap", "1/4 avocado", "1 cup mixed greens", "1 tsp Dijon mustard"],
            "reason": "Lean protein with high satiety score to eliminate afternoon cravings.",
            "prep_time": "8 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "instructions": ["Spread avocado and mustard on wrap", "Layer turkey breast and mixed greens, roll tightly"],
            "swaps": {"swap1": {"original_ingredient": "Turkey breast", "swap_option": "Grilled tempeh", "calorie_diff": -10}}
        }
    ],
    "dinner": [
        {
            "name": "Dinner: Herb-Grilled Cod with Roasted Asparagus & Wild Rice",
            "ingredients": ["160g wild cod fillet", "1/2 cup wild rice", "1 cup asparagus", "1 tbsp lemon-herb butter"],
            "reason": "Extremely low-fat, high-protein white fish ideal for nighttime muscle repair.",
            "prep_time": "10 mins",
            "cook_time": "15 mins",
            "difficulty": "Medium",
            "instructions": ["Season cod and sear 4 mins each side", "Roast asparagus with olive oil", "Serve with wild rice"],
            "swaps": {"swap1": {"original_ingredient": "Wild rice", "swap_option": "Cauliflower rice", "calorie_diff": -80}}
        },
        {
            "name": "Dinner: Stuffed Bell Peppers with Black Beans & Corn",
            "ingredients": ["2 large bell peppers", "3/4 cup black beans", "1/2 cup sweet corn", "1/4 cup salsa", "30g low-fat cheese"],
            "reason": "High-fiber vegetarian dinner rich in vitamin C and plant-based protein.",
            "prep_time": "10 mins",
            "cook_time": "20 mins",
            "difficulty": "Easy",
            "instructions": ["Hollow peppers and fill with seasoned beans and corn", "Top with salsa and cheese", "Bake at 190°C for 20 mins"],
            "swaps": {"swap1": {"original_ingredient": "Low-fat cheese", "swap_option": "Nutritional yeast", "calorie_diff": -30}}
        }
    ],
    "snack": [
        {
            "name": "Snack: Cottage Cheese with Pineapple & Walnuts",
            "ingredients": ["1/2 cup low-fat cottage cheese", "1/4 cup pineapple chunks", "10g chopped walnuts"],
            "reason": "Slow-digesting casein protein paired with natural enzymes for digestion.",
            "prep_time": "3 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "instructions": ["Combine cottage cheese with pineapple and top with walnuts"],
            "swaps": {"swap1": {"original_ingredient": "Pineapple", "swap_option": "Blueberries", "calorie_diff": -10}}
        },
        {
            "name": "Snack: Dark Chocolate (85%) & Roasted Almonds",
            "ingredients": ["20g dark chocolate (85%+)", "15 raw almonds"],
            "reason": "Rich in flavonoids and magnesium to lower stress levels.",
            "prep_time": "1 min",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "instructions": ["Enjoy chocolate with almonds"],
            "swaps": {"swap1": {"original_ingredient": "Almonds", "swap_option": "Pumpkin seeds", "calorie_diff": 0}}
        }
    ]
}
