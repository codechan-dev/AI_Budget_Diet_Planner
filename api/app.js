// app.js (Using ES Module syntax)

// Setup Environment and Dependencies
import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Auth routes
app.use('/api/auth', authRouter);

// Check for API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the .env file.");
}


const ai = new GoogleGenAI({ apiKey }); 


const mealPlanSchema = {
    type: Type.ARRAY,
    description: "A 7-day meal plan, with daily budget and calorie estimates.",
    items: {
        type: Type.OBJECT,
        properties: {
            day: { type: Type.INTEGER, description: "The day number in the plan (1 to 7)." },
            meals: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        meal_type: { type: Type.STRING, description: "e.g., Breakfast, Lunch, Dinner, Snack." },
                        dish_name: { type: Type.STRING, description: "Name of the suggested regional dish." },
                        recipe_summary: { type: Type.STRING, description: "A very brief summary of the recipe/key ingredients." },
                        calories_approx: { type: Type.INTEGER, description: "Estimated calorie count for the serving." },
                        budget_cost_approx: { type: Type.NUMBER, description: "Estimated ingredient cost for this single serving in INR." }
                    },
                    required: ['meal_type', 'dish_name', 'recipe_summary', 'calories_approx', 'budget_cost_approx']
                }
            },
            daily_total_cost_approx: { type: Type.NUMBER, description: "The calculated sum of all budget_cost_approx for the day." }
        },
        required: ['day', 'meals', 'daily_total_cost_approx']
    }
};

// --- PROMPT ASSEMBLY FUNCTION --- (No change needed here)
const createPlanPrompt = (constraints) => {
    return `
    You are an expert Smart Diet Planner... (etc.)
    
    USER CONSTRAINTS (CRITICAL):
    1.  DIET TYPE: ${constraints.dietType || 'Balanced'}
    2.  CALORIE GOAL: ${constraints.calorieTarget || 2000} calories per day.
    3.  ALLERGIES/AVOIDANCES: ${constraints.allergies || 'None'}. 
    4.  CUISINE FOCUS: ${constraints.cuisinePreference || 'Generic Indian'}. 
    5.  MAX DAILY BUDGET (Hard Constraint): ${constraints.dailyBudget || 500} INR. 
    
    INSTRUCTIONS FOR COST:
    * Use current, common grocery prices in a major Indian metro city (INR)...
    
    RETURN the result STRICTLY as a JSON array adhering to the provided schema.
    `;
};


// --- API ROUTE: The heart of the backend ---
app.post('/api/generate-plan', async (req, res) => {
    try {
        const constraints = req.body; 
        if (!constraints.calorieTarget || !constraints.dailyBudget) {
            return res.status(400).json({ error: "Missing required constraints: calorieTarget and dailyBudget." });
        }
        const prompt = createPlanPrompt(constraints);
        
        console.log(`Generating plan for: ${constraints.cuisinePreference} at ${constraints.dailyBudget} INR/day...`);

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Specify the model here instead of in initialization
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mealPlanSchema
            }
        });

        const jsonString = result.text.trim();
        const planObject = JSON.parse(jsonString);

        res.json(planObject); 

    } catch (error) {
        console.error('Error generating plan:', error);
        res.status(500).json({ 
            error: 'Failed to generate meal plan from AI.', 
            details: error.message 
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
});