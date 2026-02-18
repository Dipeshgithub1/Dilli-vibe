"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

const moods = [
  "Romantic 💕",
  "Chill ☕",
  "Party 🎉",
  "Luxury ✨",
  "Nature 🌿",
  "Foodie 🍜",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood || !budget) return;

    setLoading(true);

    try {
      const res = await api.post("/recommendations", {
        mood: selectedMood,
        budget,
        people,
      });

      localStorage.setItem(
        "recommendations",
        JSON.stringify(res.data.data)
      );

      router.push("/recommendations");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-center mb-2">
          What’s your vibe today?
        </h1>
        <p className="text-zinc-400 text-center mb-8">
          Tell us your mood and budget — we’ll handle the rest.
        </p>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {moods.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`p-4 rounded-xl border transition-all ${
                selectedMood === mood
                  ? "bg-white text-black border-white scale-105"
                  : "bg-zinc-900 border-zinc-800 hover:border-white"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Budget + People */}
        <div className="space-y-4 mb-6">
          <input
            type="number"
            placeholder="Enter your budget (₹)"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <select
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3">3 People</option>
            <option value="4">4+ People</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Finding places..." : "Find My Vibe"}
        </button>
      </div>
    </div>
  );
}
