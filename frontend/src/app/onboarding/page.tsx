"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

/* Mood Options */
const moods = [
  { label: "Romantic 💕", value: "romantic" },
  { label: "Chill ☕", value: "chill" },
  { label: "Party 🎉", value: "party" },
  { label: "Luxury ✨", value: "luxury" },
  { label: "Nature 🌿", value: "nature" },
  { label: "Foodie 🍜", value: "food" },
];

export default function OnboardingPage() {
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [budget, setBudget] = useState<"low" | "medium" | "high" | "">("");
  const [people, setPeople] = useState<
    "solo" | "couple" | "friends" | "family"
  >("solo");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood || !budget) return;

    setLoading(true);

    try {
      const res = await api.get("/recommendations", {
        params: {
          mood: selectedMood,
          budgetPreference: budget,
          suitableFor: people,
        },
      });

      localStorage.setItem(
        "recommendations",
        JSON.stringify(res.data.data)
      );

      router.push("/recommendations");
    } catch (err) {
      console.error(err);
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
          Choose mood, budget & who you’re going with.
        </p>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-xl border transition-all ${
                selectedMood === mood.value
                  ? "bg-white text-black border-white scale-105"
                  : "bg-zinc-900 border-zinc-800 hover:border-white"
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>

        {/* Budget + People */}
        <div className="space-y-4 mb-6">

          {/* Budget Select */}
          <select
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value as "low" | "medium" | "high")
            }
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">Select Budget</option>
            <option value="low">Low (Under ₹500)</option>
            <option value="medium">Medium (₹500–1500)</option>
            <option value="high">High (₹1500+)</option>
          </select>

          {/* Suitable For */}
          <select
            value={people}
            onChange={(e) =>
              setPeople(
                e.target.value as
                  | "solo"
                  | "couple"
                  | "friends"
                  | "family"
              )
            }
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="solo">1 Person</option>
            <option value="couple">2 People</option>
            <option value="friends">3–5 Friends</option>
            <option value="family">Family</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedMood || !budget}
          className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Finding places..." : "Find My Vibe"}
        </button>
      </div>
    </div>
  );
}