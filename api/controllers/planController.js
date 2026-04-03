import prisma from '../lib/prisma.js';

// ---------------------------------------------------------------------------
// Meal database — each entry carries diet tags and ingredients for filtering
// ---------------------------------------------------------------------------
const ALL_MEALS = [
    // ── Breakfast ───────────────────────────────────────────────────────────
    { name: 'Idli Sambar',          type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 300, cost: 45, ingredients: ['rice', 'lentil', 'sambar'] },
    { name: 'Poha',                 type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 250, cost: 30, ingredients: ['rice flakes', 'onion', 'peanut'] },
    { name: 'Upma',                 type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 280, cost: 35, ingredients: ['semolina', 'vegetables'] },
    { name: 'Dosa',                 type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 320, cost: 50, ingredients: ['rice', 'lentil'] },
    { name: 'Paratha with Curd',    type: 'Breakfast', diet: ['veg'],                    cal: 420, cost: 60, ingredients: ['wheat flour', 'curd', 'dairy'] },
    { name: 'Oats Porridge',        type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 220, cost: 40, ingredients: ['oats'] },
    { name: 'Besan Cheela',         type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 300, cost: 40, ingredients: ['chickpea flour', 'vegetables'] },
    { name: 'Rava Uttapam',         type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 340, cost: 55, ingredients: ['semolina', 'vegetables', 'onion'] },
    { name: 'Boiled Egg Toast',     type: 'Breakfast', diet: ['non-veg'],                cal: 350, cost: 50, ingredients: ['egg', 'bread'] },
    { name: 'Egg Bhurji + Paratha', type: 'Breakfast', diet: ['non-veg'],                cal: 420, cost: 70, ingredients: ['egg', 'wheat flour'] },
    { name: 'Omelette + Bread',     type: 'Breakfast', diet: ['non-veg'],                cal: 320, cost: 55, ingredients: ['egg', 'bread'] },
    { name: 'Chicken Sandwich',     type: 'Breakfast', diet: ['non-veg'],                cal: 400, cost: 80, ingredients: ['chicken', 'bread'] },
    { name: 'Banana Pancakes',      type: 'Breakfast', diet: ['veg', 'vegan'],           cal: 290, cost: 45, ingredients: ['banana', 'wheat flour'] },

    // ── Lunch ────────────────────────────────────────────────────────────────
    { name: 'Dal Rice',             type: 'Lunch', diet: ['veg', 'vegan'],               cal: 450, cost: 80, ingredients: ['rice', 'lentil'] },
    { name: 'Rajma Rice',           type: 'Lunch', diet: ['veg', 'vegan'],               cal: 520, cost: 90, ingredients: ['kidney beans', 'rice'] },
    { name: 'Chole Bhature',        type: 'Lunch', diet: ['veg', 'vegan'],               cal: 600, cost: 100, ingredients: ['chickpea', 'wheat flour'] },
    { name: 'Paneer Butter Masala + Roti', type: 'Lunch', diet: ['veg'],                 cal: 550, cost: 120, ingredients: ['paneer', 'wheat flour', 'butter', 'dairy'] },
    { name: 'Vegetable Biryani',    type: 'Lunch', diet: ['veg', 'vegan'],               cal: 480, cost: 100, ingredients: ['rice', 'vegetables'] },
    { name: 'Sambar Rice',          type: 'Lunch', diet: ['veg', 'vegan'],               cal: 400, cost: 70, ingredients: ['rice', 'lentil', 'vegetables'] },
    { name: 'Aloo Gobi + Roti',     type: 'Lunch', diet: ['veg', 'vegan'],               cal: 420, cost: 75, ingredients: ['potato', 'cauliflower', 'wheat flour'] },
    { name: 'Tofu Stir Fry + Rice', type: 'Lunch', diet: ['veg', 'vegan'],               cal: 380, cost: 85, ingredients: ['tofu', 'rice', 'vegetables'] },
    { name: 'Lemon Rice',           type: 'Lunch', diet: ['veg', 'vegan'],               cal: 350, cost: 60, ingredients: ['rice', 'lemon', 'peanut'] },
    { name: 'Chicken Rice',         type: 'Lunch', diet: ['non-veg'],                    cal: 520, cost: 120, ingredients: ['chicken', 'rice'] },
    { name: 'Egg Curry + Rice',     type: 'Lunch', diet: ['non-veg'],                    cal: 480, cost: 90, ingredients: ['egg', 'rice'] },
    { name: 'Fish Curry + Rice',    type: 'Lunch', diet: ['non-veg'],                    cal: 500, cost: 130, ingredients: ['fish', 'rice', 'seafood'] },
    { name: 'Chicken Biryani',      type: 'Lunch', diet: ['non-veg'],                    cal: 580, cost: 140, ingredients: ['chicken', 'rice'] },
    { name: 'Prawn Masala + Rice',  type: 'Lunch', diet: ['non-veg'],                    cal: 520, cost: 140, ingredients: ['prawn', 'rice', 'seafood', 'shrimp'] },
    { name: 'Mixed Veg Curry + Roti', type: 'Lunch', diet: ['veg', 'vegan'],             cal: 440, cost: 80, ingredients: ['vegetables', 'wheat flour'] },

    // ── Dinner ───────────────────────────────────────────────────────────────
    { name: 'Moong Dal Khichdi',    type: 'Dinner', diet: ['veg', 'vegan'],              cal: 380, cost: 65, ingredients: ['rice', 'lentil'] },
    { name: 'Vegetable Soup + Bread', type: 'Dinner', diet: ['veg', 'vegan'],            cal: 320, cost: 55, ingredients: ['vegetables', 'bread'] },
    { name: 'Dal Tadka + Roti',     type: 'Dinner', diet: ['veg', 'vegan'],              cal: 420, cost: 75, ingredients: ['lentil', 'wheat flour'] },
    { name: 'Paneer Tikka + Roti',  type: 'Dinner', diet: ['veg'],                       cal: 480, cost: 110, ingredients: ['paneer', 'wheat flour', 'dairy'] },
    { name: 'Baingan Bharta + Roti', type: 'Dinner', diet: ['veg', 'vegan'],             cal: 360, cost: 70, ingredients: ['eggplant', 'wheat flour'] },
    { name: 'Palak Tofu + Rice',    type: 'Dinner', diet: ['veg', 'vegan'],              cal: 400, cost: 90, ingredients: ['spinach', 'tofu', 'rice'] },
    { name: 'Vegetable Daliya',     type: 'Dinner', diet: ['veg', 'vegan'],              cal: 300, cost: 50, ingredients: ['broken wheat', 'vegetables'] },
    { name: 'Methi Thepla',         type: 'Dinner', diet: ['veg', 'vegan'],              cal: 380, cost: 65, ingredients: ['wheat flour', 'fenugreek'] },
    { name: 'Grilled Chicken + Salad', type: 'Dinner', diet: ['non-veg'],                cal: 450, cost: 130, ingredients: ['chicken'] },
    { name: 'Egg Fried Rice',       type: 'Dinner', diet: ['non-veg'],                   cal: 480, cost: 80, ingredients: ['egg', 'rice'] },
    { name: 'Fish Tikka + Roti',    type: 'Dinner', diet: ['non-veg'],                   cal: 500, cost: 140, ingredients: ['fish', 'wheat flour', 'seafood'] },
    { name: 'Chicken Curry + Roti', type: 'Dinner', diet: ['non-veg'],                   cal: 550, cost: 130, ingredients: ['chicken', 'wheat flour'] },
    { name: 'Scrambled Eggs + Toast', type: 'Dinner', diet: ['non-veg'],                 cal: 300, cost: 55, ingredients: ['egg', 'bread'] },

    // ── Snack ────────────────────────────────────────────────────────────────
    { name: 'Sprouts Chaat',        type: 'Snack', diet: ['veg', 'vegan'],               cal: 180, cost: 30, ingredients: ['sprouts', 'lemon'] },
    { name: 'Fruit Salad',          type: 'Snack', diet: ['veg', 'vegan'],               cal: 150, cost: 40, ingredients: ['fruits', 'banana', 'apple'] },
    { name: 'Roasted Chana',        type: 'Snack', diet: ['veg', 'vegan'],               cal: 200, cost: 25, ingredients: ['chickpea'] },
    { name: 'Murmura Chaat',        type: 'Snack', diet: ['veg', 'vegan'],               cal: 160, cost: 20, ingredients: ['puffed rice', 'peanut', 'onion'] },
    { name: 'Coconut Water',        type: 'Snack', diet: ['veg', 'vegan'],               cal: 60,  cost: 30, ingredients: ['coconut'] },
    { name: 'Curd Rice',            type: 'Snack', diet: ['veg'],                        cal: 220, cost: 35, ingredients: ['rice', 'curd', 'dairy'] },
    { name: 'Banana',               type: 'Snack', diet: ['veg', 'vegan'],               cal: 90,  cost: 15, ingredients: ['banana'] },
    { name: 'Boiled Egg',           type: 'Snack', diet: ['non-veg'],                    cal: 140, cost: 20, ingredients: ['egg'] },
    { name: 'Chicken Tikka',        type: 'Snack', diet: ['non-veg'],                    cal: 280, cost: 80, ingredients: ['chicken'] },
    { name: 'Fish Fingers',         type: 'Snack', diet: ['non-veg'],                    cal: 250, cost: 70, ingredients: ['fish', 'seafood'] },
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Budget splits per meal slot (must sum to 1)
const BUDGET_SPLIT = { Breakfast: 0.20, Lunch: 0.35, Dinner: 0.35, Snack: 0.10 };

/**
 * Fisher-Yates shuffle — mutates the array in place, returns it.
 */
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

/**
 * Build a filtered meal pool that matches the diet type and excludes allergies.
 * Allergy matching is case-insensitive and checks each ingredient substring.
 */
const buildPool = (dietType, allergies) => {
    const lowerAllergies = allergies.map(a => a.toLowerCase().trim()).filter(Boolean);
    return ALL_MEALS.filter(meal => {
        if (!meal.diet.includes(dietType)) return false;
        if (lowerAllergies.length === 0) return true;
        return !meal.ingredients.some(ing =>
            lowerAllergies.some(allergy => ing.toLowerCase().includes(allergy) || allergy.includes(ing.toLowerCase()))
        );
    });
};

/**
 * Generate a 7-day meal plan from a filtered pool within a daily budget.
 */
const buildPlan = (pool, dailyBudget) => {
    const days = [];

    for (let day = 1; day <= 7; day++) {
        const dayMeals = [];
        let dailyCost = 0;

        for (const mealType of MEAL_TYPES) {
            const slotBudget = dailyBudget * BUDGET_SPLIT[mealType];
            const candidates = shuffle(pool.filter(m => m.type === mealType && m.cost <= slotBudget));

            if (candidates.length === 0) {
                // Fallback: cheapest available item for this type regardless of budget
                const fallback = pool
                    .filter(m => m.type === mealType)
                    .sort((a, b) => a.cost - b.cost)[0];
                if (fallback) {
                    dayMeals.push({
                        meal_type: mealType,
                        dish_name: fallback.name,
                        calories_approx: fallback.cal,
                        budget_cost_approx: fallback.cost,
                    });
                    dailyCost += fallback.cost;
                }
            } else {
                const pick = candidates[0];
                dayMeals.push({
                    meal_type: mealType,
                    dish_name: pick.name,
                    calories_approx: pick.cal,
                    budget_cost_approx: pick.cost,
                });
                dailyCost += pick.cost;
            }
        }

        days.push({ day, meals: dayMeals, daily_total_cost_approx: Math.round(dailyCost) });
    }

    return days;
};

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

// POST /api/plan/generate
export const generatePlan = async (req, res) => {
    const userId = req.user.id;

    try {
        const prefs = await prisma.userPreference.findUnique({ where: { userId } });
        if (!prefs) {
            return res.status(400).json({ error: 'No preferences found. Please save your preferences first.' });
        }

        const pool = buildPool(prefs.dietType, prefs.allergies);
        if (pool.length === 0) {
            return res.status(400).json({ error: 'No meals available for your diet type and allergy constraints.' });
        }

        const meals = buildPlan(pool, prefs.budget);
        const totalCost = meals.reduce((sum, d) => sum + d.daily_total_cost_approx, 0);

        const plan = await prisma.dietPlan.create({
            data: { userId, meals, totalCost },
        });

        res.status(201).json({ plan });
    } catch (err) {
        console.error('Generate plan error:', err);
        res.status(500).json({ error: 'Server error generating plan.' });
    }
};

// POST /api/plan/regenerate
export const regeneratePlan = async (req, res) => {
    const userId = req.user.id;

    try {
        const prefs = await prisma.userPreference.findUnique({ where: { userId } });
        if (!prefs) {
            return res.status(400).json({ error: 'No preferences found. Please save your preferences first.' });
        }

        const pool = buildPool(prefs.dietType, prefs.allergies);
        if (pool.length === 0) {
            return res.status(400).json({ error: 'No meals available for your diet type and allergy constraints.' });
        }

        // Shuffle the pool before building to guarantee meal variety
        const shuffledPool = shuffle([...pool]);
        const meals = buildPlan(shuffledPool, prefs.budget);
        const totalCost = meals.reduce((sum, d) => sum + d.daily_total_cost_approx, 0);

        const plan = await prisma.dietPlan.create({
            data: { userId, meals, totalCost },
        });

        res.status(201).json({ plan });
    } catch (err) {
        console.error('Regenerate plan error:', err);
        res.status(500).json({ error: 'Server error regenerating plan.' });
    }
};
