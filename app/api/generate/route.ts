import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { calories, mealsPerDay, cuisine, restriction, budget, cookTime, household, goal, preferences } = await req.json();
    const prompt = `You are a nutrition and meal planning AI. Create a personalized weekly meal plan.

**Preferences:**
- Calorie target: ${calories || 'not specified'}
- Meals per day: ${mealsPerDay || '3'}
- Cuisine preference: ${cuisine || 'any'}
- Dietary restriction: ${restriction || 'none'}
- Budget: ${budget || 'moderate'}
- Max cook time: ${cookTime || '30'} minutes
- People in household: ${household || '1'}
- Health goal: ${goal || 'not specified'}
- Food preferences/dislikes: ${preferences || 'none'}

Generate a detailed weekly meal plan with:

## 🍽️ Weekly Menu
- For each day (Mon–Sun): breakfast, lunch, dinner, snack
- Include dish name and brief description

## 📊 Nutrition Highlights
- Estimated macros per day (protein, carbs, fat, calories)
- Note if calorie target is hit

## 🛒 Categorized Grocery List
- Produce, Proteins, Dairy, Pantry, Frozen, Other
- Estimated cost range for budget level

## 🥗 Meal Prep Tips
- 3 batch cooking suggestions to save time

Format as clean markdown with emoji headers. Be specific about portions.`;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.7 }),
    });
    if (!response.ok) {
      const e = await response.json().catch(() => ({}));
      throw new Error(e.error?.message || `API error ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || 'No result generated.' });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal error' }, { status: 500 });
  }
}