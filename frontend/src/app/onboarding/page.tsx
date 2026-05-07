"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/axios";
import { motion } from "framer-motion";

/* Mood Options */
const moods = [
  { label: "Romantic 💕", value: "romantic" },
  { label: "Chill ☕", value: "chill" },
  { label: "Fun 🎉", value: "fun" },
  { label: "Explore 🌿", value: "explore" },
  { label: "Food 🍜", value: "food" },
  { label: "Social 👯", value: "social" },
];


export default function OnboardingPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedMood, setSelectedMood] = useState<string[]>([]);
  const [budget, setBudget] = useState<"low" | "medium" | "high" | "">("");
  const [people, setPeople] = useState<
    "solo" | "couple" | "friends" | "family"
  >("solo");

  const [loading,setLoading] = useState(false);

  // Pre-select mood from URL query param
  useEffect(() => {
    const moodParam = searchParams.get("mood");
    if (moodParam && moods.some(m => m.value === moodParam)) {
      setSelectedMood([moodParam]);
    }
  }, [searchParams]);

  const handleSubmit = async () => {

    if (!selectedMood.length || !budget) {
      alert("Please select mood and budget");
      return;
    }
    setLoading(true);

    try {
      await api.patch("/users/onboarding",{
        preferredVibes: selectedMood,
        budgetPreference: budget,
        companyType: people,
      });

      
      //ai recommended call
      const searchText = `${selectedMood.join(" ")} ${people} ${budget}`;

    // 🔥 Save for later (AI explanation, detail page)
      localStorage.setItem("lastSearch", searchText);

      await useAuthStore.getState().fetchMe();


const res = await api.get(
        `/recommendations?page=1&limit=6&searchText=${encodeURIComponent(searchText)}`
      );

      localStorage.setItem(
        "recommendations",
        JSON.stringify(res.data.data)
      );

      router.push("/recommendations");

    } catch(err){
      console.error(err);
    } finally{
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <div className="w-full max-w-3xl relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

        <h1 className="text-3xl font-semibold text-center mb-2">
          What’s your vibe today?
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Choose mood, budget & who you’re going with.
        </p>

        {/* Mood Grid */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">

          {moods.map((mood) => (

            <button
              key={mood.value}
              onClick={() =>
                setSelectedMood((prev) =>
                  prev.includes(mood.value)
                    ? prev.filter((m) => m !== mood.value)
                    : [...prev,mood.value]
                )
              }
              className={`p-4 rounded-xl border transition-all ${
                selectedMood.includes(mood.value)
                  ? "bg-white text-black border-white scale-105 shadow-md"
                  : "bg-zinc-900 border-zinc-800 hover:border-orange-400"
              }`}
            >
              {mood.label}
            </button>

          ))}

        </div>

        {/* Selected Mood Tags */}

        {selectedMood.length > 0 && (

          <div className="flex flex-wrap gap-2 mb-6">

            {selectedMood.map((mood) => (

              <div
                key={mood}
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-sm"
              >

                {mood}

                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedMood((prev) =>
                      prev.filter((m) => m !== mood)
                    )
                  }
                >
                  ×
                </span>

              </div>

            ))}

          </div>

        )}

        {/* Budget + People */}

        <div className="space-y-4 mb-6">

          {/* Budget */}

          <select
            value={budget}
            onChange={(e)=>
              setBudget(e.target.value as "low"|"medium"|"high")
            }
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select Budget</option>
            <option value="low">Low (Under ₹500)</option>
            <option value="medium">Medium (₹500–1500)</option>
            <option value="high">High (₹1500+)</option>
          </select>

          {/* People */}

          <select
            value={people}
            onChange={(e)=>
              setPeople(
                e.target.value as
                |"solo"
                |"couple"
                |"friends"
                |"family"
              )
            }
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
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
          disabled={loading || !selectedMood.length || !budget}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-400 hover:to-red-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >

          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Finding places...
            </>
          ) : (
            <>
              Find My Vibe →
            </>
          )}

        </button>

        </motion.div>

      </div>

    </div>

  );

}