'use client';
import { useState } from 'react';
const CUISINES = ['any','mediterranean','asian','mexican','american','indian','italian','japanese','other'];
const RESTRICTIONS = ['none','vegetarian','vegan','gluten-free','dairy-free','keto','paleo','low-carb'];
export default function MealPlannerPage() {
  const [form, setForm] = useState({ calories:'', mealsPerDay:'3', cuisine:'any', restriction:'none', budget:'moderate', cookTime:'30', household:'1', goal:'', preferences:'' });
  const [output, setOutput] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const gen = async () => { setLoading(true); setError(''); setOutput(''); try { const r = await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const d = await r.json(); if(!r.ok)throw new Error(d.error||'failed'); setOutput(d.result); }catch(e:any){setError(e.message);}finally{setLoading(false);} };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10"><h1 className="text-4xl font-bold text-orange-400 mb-2">🍽️ AI Weekly Meal Planner</h1><p className="text-gray-400">Get a personalized weekly meal plan with grocery list.</p></header>
        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-orange-400">Meal Plan Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-1">Calorie target (daily)</label><input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="2000" value={form.calories} onChange={e=>setForm({...form,calories:e.target.value})}/></div>
              <div><label className="block text-sm text-gray-400 mb-1">Meals per day</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" value={form.mealsPerDay} onChange={e=>setForm({...form,mealsPerDay:e.target.value})}>{['2','3','4','5'].map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Cuisine preference</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" value={form.cuisine} onChange={e=>setForm({...form,cuisine:e.target.value})}>{CUISINES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Dietary restriction</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" value={form.restriction} onChange={e=>setForm({...form,restriction:e.target.value})}>{RESTRICTIONS.map(r=><option key={r}>{r}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Budget level</label><select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>{['budget','moderate','premium'].map(b=><option key={b}>{b}</option>)}</select></div>
              <div><label className="block text-sm text-gray-400 mb-1">Max cook time (min)</label><input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="30" value={form.cookTime} onChange={e=>setForm({...form,cookTime:e.target.value})}/></div>
              <div><label className="block text-sm text-gray-400 mb-1">People in household</label><input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="2" value={form.household} onChange={e=>setForm({...form,household:e.target.value})}/></div>
              <div><label className="block text-sm text-gray-400 mb-1">Health goal</label><input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="e.g. lose weight, build muscle" value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})}/></div>
            </div>
            <div><label className="block text-sm text-gray-400 mb-1">Food preferences / dislikes</label><textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500" rows={2} placeholder="e.g. love pasta, hate seafood, love spicy food" value={form.preferences} onChange={e=>setForm({...form,preferences:e.target.value})}/></div>
            <button onClick={gen} disabled={loading} className="w-full py-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-500 transition-all disabled:opacity-50">{loading?'Generating...':'✨ Generate Meal Plan'}</button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
          {output && <div className="bg-gray-800/50 border border-orange-500/30 rounded-xl p-6"><h3 className="text-lg font-semibold text-orange-400 mb-4">Your Weekly Meal Plan</h3><div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{output}</div></div>}
        </div>
      </div>
    </div>
  );
}