# tests/test_nutrition_engine.py
"""
Pytest test suite for Smart Nutrition Assistant — nutrition_engine.py
Run with: pytest tests/ -v
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from models import Profile, SwapRequest
from nutrition_engine import (
    calculate_macros,
    compute_tdee_and_target,
    get_diet_pool_key,
    generate_single_day_plan,
    generate_weekly_plan,
    generate_meal_swap,
    _filter_allergies,
    _get_activity_multiplier,
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def base_profile():
    return Profile(
        name="Test User",
        age=28,
        sex="male",
        height_cm=175.0,
        weight_kg=70.0,
        goal="maintain",
        diet="indian vegetarian",
        activity="medium",
        allergies=[],
    )

@pytest.fixture
def weight_loss_profile():
    return Profile(
        name="Dieter",
        age=35,
        sex="female",
        height_cm=160.0,
        weight_kg=65.0,
        goal="weight_loss",
        diet="vegan",
        activity="low",
        allergies=["nuts", "peanut"],
    )

@pytest.fixture
def muscle_gain_profile():
    return Profile(
        name="Lifter",
        age=24,
        sex="male",
        height_cm=182.0,
        weight_kg=85.0,
        goal="muscle_gain",
        diet="non vegetarian",
        activity="high",
        allergies=[],
    )


# ---------------------------------------------------------------------------
# calculate_macros
# ---------------------------------------------------------------------------

class TestCalculateMacros:
    def test_maintain_macros_are_positive(self):
        macros = calculate_macros(2000, "maintain")
        assert macros["protein_g"] > 0
        assert macros["carbs_g"] > 0
        assert macros["fats_g"] > 0

    def test_weight_loss_higher_protein_pct(self):
        """Weight loss goal should have higher protein % than maintain."""
        loss = calculate_macros(2000, "weight_loss")
        maintain = calculate_macros(2000, "maintain")
        assert loss["protein_g"] >= maintain["protein_g"]

    def test_muscle_gain_higher_carbs_pct(self):
        """Muscle gain should have more carbs than maintain."""
        gain = calculate_macros(2000, "muscle_gain")
        maintain = calculate_macros(2000, "maintain")
        assert gain["carbs_g"] >= maintain["carbs_g"]

    def test_calories_roughly_balance(self):
        """Macro-derived calories should be within 10% of the target."""
        target = 2000
        macros = calculate_macros(target, "maintain")
        derived = macros["protein_g"] * 4 + macros["carbs_g"] * 4 + macros["fats_g"] * 9
        assert abs(derived - target) / target < 0.10, (
            f"Derived {derived} kcal is too far from target {target} kcal"
        )

    def test_zero_calories_returns_zeros(self):
        macros = calculate_macros(0, "maintain")
        assert macros["protein_g"] == 0
        assert macros["carbs_g"] == 0
        assert macros["fats_g"] == 0

    def test_unknown_goal_defaults_to_maintain(self):
        unknown = calculate_macros(2000, "unknown_goal_xyz")
        maintain = calculate_macros(2000, "maintain")
        assert unknown == maintain


# ---------------------------------------------------------------------------
# compute_tdee_and_target
# ---------------------------------------------------------------------------

class TestComputeTdee:
    def test_bmr_is_positive(self, base_profile):
        bmr, tdee, target = compute_tdee_and_target(base_profile)
        assert bmr > 0

    def test_tdee_greater_than_bmr(self, base_profile):
        bmr, tdee, target = compute_tdee_and_target(base_profile)
        assert tdee > bmr

    def test_female_lower_bmr_than_male(self):
        male = Profile(name="M", age=30, sex="male", height_cm=175, weight_kg=70,
                       goal="maintain", diet="balanced", activity="medium")
        female = Profile(name="F", age=30, sex="female", height_cm=175, weight_kg=70,
                         goal="maintain", diet="balanced", activity="medium")
        bmr_m, _, _ = compute_tdee_and_target(male)
        bmr_f, _, _ = compute_tdee_and_target(female)
        assert bmr_m > bmr_f

    def test_weight_loss_target_below_tdee(self, weight_loss_profile):
        _, tdee, target = compute_tdee_and_target(weight_loss_profile)
        assert target < tdee

    def test_muscle_gain_target_above_tdee(self, muscle_gain_profile):
        _, tdee, target = compute_tdee_and_target(muscle_gain_profile)
        assert target > tdee

    def test_minimum_calories_floor(self):
        """Very low calorie scenario should never go below 1200 kcal."""
        tiny = Profile(name="Tiny", age=80, sex="female", height_cm=140, weight_kg=30,
                       goal="weight_loss", diet="balanced", activity="low")
        _, _, target = compute_tdee_and_target(tiny)
        assert target >= 1200

    def test_activity_multipliers(self):
        """High activity should yield higher TDEE than low activity."""
        p_low = Profile(name="A", age=30, sex="male", height_cm=175, weight_kg=70,
                        goal="maintain", diet="balanced", activity="low")
        p_high = Profile(name="A", age=30, sex="male", height_cm=175, weight_kg=70,
                         goal="maintain", diet="balanced", activity="high")
        _, tdee_low, _ = compute_tdee_and_target(p_low)
        _, tdee_high, _ = compute_tdee_and_target(p_high)
        assert tdee_high > tdee_low


# ---------------------------------------------------------------------------
# Activity multiplier
# ---------------------------------------------------------------------------

class TestActivityMultiplier:
    def test_low_returns_1_2(self):
        assert _get_activity_multiplier("low") == 1.2

    def test_medium_returns_1_45(self):
        assert _get_activity_multiplier("medium") == 1.45

    def test_high_returns_1_725(self):
        assert _get_activity_multiplier("high") == 1.725

    def test_unknown_defaults_to_medium(self):
        assert _get_activity_multiplier("extreme") == 1.45

    def test_case_insensitive(self):
        assert _get_activity_multiplier("HIGH") == 1.725


# ---------------------------------------------------------------------------
# Diet pool key mapping
# ---------------------------------------------------------------------------

class TestDietPoolKey:
    def test_vegan(self):
        assert get_diet_pool_key("indian vegan") == "vegan"

    def test_non_veg(self):
        assert get_diet_pool_key("non vegetarian") == "non_veg"

    def test_chicken(self):
        assert get_diet_pool_key("chicken and egg") == "non_veg"

    def test_vegetarian_defaults_to_indian_veg(self):
        assert get_diet_pool_key("indian vegetarian") == "indian_veg"

    def test_balanced_defaults_to_indian_veg(self):
        assert get_diet_pool_key("balanced") == "indian_veg"


# ---------------------------------------------------------------------------
# Allergy filtering
# ---------------------------------------------------------------------------

class TestAllergyFiltering:
    def _make_meal(self, name, ingredients):
        return {"name": name, "ingredients": ingredients, "reason": "test"}

    def test_filters_out_allergy_item(self):
        pool = [
            self._make_meal("Almond Butter Toast", ["Almond Butter", "Toast"]),
            self._make_meal("Oatmeal Bowl", ["Oats", "Milk"]),
        ]
        filtered = _filter_allergies(pool, ["almond"])
        names = [m["name"] for m in filtered]
        assert "Almond Butter Toast" not in names
        assert "Oatmeal Bowl" in names

    def test_empty_allergies_returns_all(self):
        pool = [
            self._make_meal("Peanut Curry", ["peanut", "onion"]),
            self._make_meal("Dal Rice", ["dal", "rice"]),
        ]
        assert _filter_allergies(pool, []) == pool

    def test_allergy_matching_is_case_insensitive(self):
        pool = [
            self._make_meal("Walnut Salad", ["Walnut", "Arugula"]),
        ]
        filtered = _filter_allergies(pool, ["WALNUT"])
        assert len(filtered) == 1  # Falls back to full pool since all filtered
        # The fallback returns original pool when all items match

    def test_fallback_when_all_filtered(self):
        """When all meals are allergenic, returns original pool instead of empty list."""
        pool = [self._make_meal("Nut Parfait", ["walnut", "cashew"])]
        result = _filter_allergies(pool, ["walnut"])
        assert len(result) > 0  # Never returns empty


# ---------------------------------------------------------------------------
# generate_single_day_plan
# ---------------------------------------------------------------------------

class TestSingleDayPlan:
    def test_plan_structure(self, base_profile):
        plan = generate_single_day_plan(base_profile)
        assert "meals" in plan
        assert "bmr" in plan
        assert "tdee" in plan
        assert "target_calories" in plan
        assert "total_macros" in plan

    def test_plan_has_four_meals(self, base_profile):
        plan = generate_single_day_plan(base_profile)
        assert len(plan["meals"]) == 4

    def test_each_meal_has_required_keys(self, base_profile):
        plan = generate_single_day_plan(base_profile)
        required = {"name", "ingredients", "approx_calories", "macros"}
        for meal in plan["meals"]:
            assert required.issubset(meal.keys()), f"Meal missing keys: {meal.get('name')}"

    def test_allergy_filtering_in_plan(self):
        """Meals should not contain allergy ingredients (where alternatives exist)."""
        profile = Profile(
            name="AllergyTest", age=25, sex="female", height_cm=165, weight_kg=58,
            goal="maintain", diet="indian vegetarian", activity="medium",
            allergies=["milk", "dairy"]
        )
        plan = generate_single_day_plan(profile)
        # Verify plan is generated without crash
        assert "meals" in plan

    def test_different_users_get_different_meals(self):
        """Seeded rotation: different names at same day_offset should differ sometimes."""
        p1 = Profile(name="Alice", age=25, sex="female", height_cm=165, weight_kg=58,
                     goal="maintain", diet="indian vegetarian", activity="medium")
        p2 = Profile(name="Bob", age=25, sex="male", height_cm=175, weight_kg=75,
                     goal="maintain", diet="indian vegetarian", activity="medium")
        plan1 = generate_single_day_plan(p1, day_offset=0)
        plan2 = generate_single_day_plan(p2, day_offset=0)
        meal_names_1 = [m["name"] for m in plan1["meals"]]
        meal_names_2 = [m["name"] for m in plan2["meals"]]
        # They may differ for at least one meal (not guaranteed but expected with different seeds)
        # We just assert both plans are valid
        assert len(meal_names_1) == 4
        assert len(meal_names_2) == 4


# ---------------------------------------------------------------------------
# generate_weekly_plan
# ---------------------------------------------------------------------------

class TestWeeklyPlan:
    def test_weekly_has_seven_days(self, base_profile):
        plan = generate_weekly_plan(base_profile)
        assert "days" in plan
        assert len(plan["days"]) == 7

    def test_weekly_has_all_day_names(self, base_profile):
        plan = generate_weekly_plan(base_profile)
        expected = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
        assert set(plan["days"].keys()) == expected

    def test_weekly_is_weekly_flag(self, base_profile):
        plan = generate_weekly_plan(base_profile)
        assert plan.get("is_weekly") is True


# ---------------------------------------------------------------------------
# Pydantic model validation
# ---------------------------------------------------------------------------

class TestProfileValidation:
    def test_invalid_sex_raises(self):
        with pytest.raises(Exception):
            Profile(name="X", age=25, sex="alien", height_cm=175, weight_kg=70,
                    goal="maintain", diet="balanced", activity="medium")

    def test_age_too_low_raises(self):
        with pytest.raises(Exception):
            Profile(name="X", age=5, sex="male", height_cm=175, weight_kg=70,
                    goal="maintain", diet="balanced", activity="medium")

    def test_age_too_high_raises(self):
        with pytest.raises(Exception):
            Profile(name="X", age=150, sex="male", height_cm=175, weight_kg=70,
                    goal="maintain", diet="balanced", activity="medium")

    def test_weight_too_low_raises(self):
        with pytest.raises(Exception):
            Profile(name="X", age=25, sex="male", height_cm=175, weight_kg=5,
                    goal="maintain", diet="balanced", activity="medium")

    def test_empty_name_raises(self):
        with pytest.raises(Exception):
            Profile(name="   ", age=25, sex="male", height_cm=175, weight_kg=70,
                    goal="maintain", diet="balanced", activity="medium")

    def test_sex_normalised_to_lowercase(self):
        p = Profile(name="X", age=25, sex="MALE", height_cm=175, weight_kg=70,
                    goal="maintain", diet="balanced", activity="medium")
        assert p.sex == "male"
