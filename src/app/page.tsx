"use client";

import { useState } from "react";

const GOALS = [
  "Weight Loss", "Muscle Gain", "Maintain Weight", "Heart Health",
  "General Healthy Eating", "Vegetarian / Plant-Based", "Keto / Low-Carb", "Other"
];

const CUISINES = [
  "No Preference", "Italian", "Mexican", "Asian", "Mediterranean",
  "American", "Indian", "Middle Eastern", "French", "Other"
];

export default function Home() {
  const [form, setForm] = useState({
    goal: "",
    cuisine: "",
    dislikes: "",
    weeklyBudget: "",
    mealsPerDay: "3",
    calories: "",
    allergies: "",
  });
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generate = async () => {
    if (!form.goal) {
      setError("Please select a nutrition goal.");
      return;
    }
    setLoading(true);
    setError("");
    setPlan("");

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setPlan(data.plan);
    } catch {
      setError("Failed to connect to the meal planning service.");
    } finally {
      setLoading(false);
    }
  };

  const copyPlan = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <header className="border-b border-emerald-900/50 sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🥗</span>
          <div>
            <h1 className="text-lg font-bold text-white">AI Meal Plan Generator</h1>
            <p className="text-xs text-gray-400">Personalized weekly meal plans · Powered by DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-extrabold text-white">Eat well, live better 🥑</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Tell us your goals and preferences — get a personalized weekly meal plan with recipes, grocery lists, and nutrition tips.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gray-800/60 rounded-2xl border border-emerald-900/40 p-6 space-y-5">
            <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wide">Your Preferences</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Nutrition Goal *</label>
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="">Select goal...</option>
                {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Preferred Cuisine</label>
                <select
                  name="cuisine"
                  value={form.cuisine}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Select...</option>
                  {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Meals per Day</label>
                <select
                  name="mealsPerDay"
                  value={form.mealsPerDay}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="3">3 meals</option>
                  <option value="4">4 meals (+ snacks)</option>
                  <option value="5">5 small meals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Weekly Budget</label>
                <input
                  type="text"
                  name="weeklyBudget"
                  value={form.weeklyBudget}
                  onChange={handleChange}
                  placeholder="e.g. $100-150"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Calorie Target</label>
                <input
                  type="text"
                  name="calories"
                  value={form.calories}
                  onChange={handleChange}
                  placeholder="e.g. ~2000 kcal"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Food Allergies</label>
              <input
                type="text"
                name="allergies"
                value={form.allergies}
                onChange={handleChange}
                placeholder="e.g. Nuts, gluten, dairy, shellfish..."
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Foods to Avoid / Dislikes</label>
              <textarea
                name="dislikes"
                value={form.dislikes}
                onChange={handleChange}
                placeholder="e.g. Cilantro, olives, liver, too spicy food..."
                rows={3}
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <span>⚙️ Planning your meals...</span> : <span>🥗 Generate Meal Plan</span>}
            </button>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          <div>
            {plan ? (
              <div className="bg-gray-800/60 rounded-2xl border border-emerald-900/40 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">🥗 Your Weekly Meal Plan</h3>
                  <button
                    onClick={copyPlan}
                    className="text-xs text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="px-6 py-5 overflow-y-auto max-h-[65vh]">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap" style={{ fontSize: "0.88rem", lineHeight: "1.85" }}>
                    {plan}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/60 rounded-2xl border border-emerald-900/40 p-8 text-center h-full flex flex-col justify-center items-center">
                <span className="text-5xl mb-4">🥗</span>
                <p className="text-base font-medium text-gray-400">No plan yet</p>
                <p className="text-xs text-gray-500 mt-1">Select your goal and click Generate</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6 pb-4">
          AI Meal Plan Generator · {new Date().getFullYear()} · Not medical advice
        </p>
      </div>
    </main>
  );
}
