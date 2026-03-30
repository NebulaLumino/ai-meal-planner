import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { goal, cuisine, dislikes, weeklyBudget, mealsPerDay, calories, allergies } = await req.json();

    const prompt = `You are a professional nutritionist and meal planning expert. Create a detailed weekly meal plan based on the following:

NUTRITION GOAL: ${goal || "General healthy eating"}
PREFERRED CUISINES: ${cuisine || "No preference"}
FOODS TO AVOID / DISLIKES: ${dislikes || "None"}
WEEKLY GROCERY BUDGET: ${weeklyBudget || "Not specified"}
MEALS PER DAY: ${mealsPerDay || "3"}
CALORIE TARGET: ${calories || "Not specified"}
FOOD ALLERGIES / RESTRICTIONS: ${allergies || "None"}

Create a structured weekly meal plan:

## 🍽️ Weekly Meal Plan
A 7-day plan with breakfast, lunch, dinner, and optional snack for each day. Include:
- Dish name
- Brief description
- Approximate calories per meal
- Simple ingredient list

## 🛒 Weekly Grocery List
Organized by category (Produce, Proteins, Dairy, Pantry, Frozen). Total estimated cost.

## 🥗 Key Nutrition Highlights
What this plan delivers — protein, fiber, vitamins, etc.

## 💡 Meal Prep Tips
2-3 practical tips to make the week easier (batch cooking, storage, etc.)

## ⚠️ Allergy Note
Note any allergens present in the plan.

Format clearly with emoji headers. Keep recipes practical and doable for a home cook.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1100,
      temperature: 0.7,
    });

    const plan = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ plan });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate meal plan." }, { status: 500 });
  }
}
