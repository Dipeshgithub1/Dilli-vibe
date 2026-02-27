"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Place {
  _id: string;
  name: string;
  description: string;
  area: string;
  moods: string[];
  budgetPreference: "low" | "medium" | "high";
  suitableFor: ("solo" | "friends" | "couple" | "family")[];
  rating?: number;
  image?: string;
}

/* Budget Display */
const budgetDisplayMap: Record<string, string> = {
  low: "Under ₹500",
  medium: "₹500 – ₹1500",
  high: "Above ₹1500",
};

const budgetColorMap: Record<string, string> = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

/* People Display */
const peopleDisplayMap: Record<string, string> = {
  solo: "1 Person",
  couple: "2 People",
  friends: "3–5 Friends",
  family: "Family Group",
};

export default function RecommendationsPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("recommendations");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPlaces(parsed);
      } catch (error) {
        console.error("Invalid stored data");
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Loading recommendations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-semibold">
            Your Perfect Vibes ✨
          </h1>

          <button
            onClick={() => router.push("/onboarding")}
            className="px-5 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition"
          >
            Try Again
          </button>
        </div>

        {/* Empty State */}
        {places.length === 0 ? (
          <div className="text-center text-zinc-400 mt-20">
            No recommendations found.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {places.map((place) => (
              <div
                key={place._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-white transition duration-300 hover:scale-[1.02]"
              >

                {/* Image */}
                {place.image && (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Name */}
                <h2 className="text-lg font-semibold mb-1">
                  {place.name}
                </h2>

                {/* Area */}
                <p className="text-xs text-zinc-500 mb-1">
                  📍 {place.area}
                </p>

                {/* Suitable For */}
                <p className="text-xs text-zinc-400 mb-2">
                  👥 {place.suitableFor
                    .map((type) => peopleDisplayMap[type])
                    .join(", ")}
                </p>

                {/* Mood Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {place.moods.map((mood) => (
                    <span
                      key={mood}
                      className="text-xs bg-zinc-800 px-2 py-1 rounded-md text-zinc-300"
                    >
                      {mood}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                  {place.description}
                </p>

                {/* Budget + Rating */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span
                    className={`font-semibold ${budgetColorMap[place.budgetPreference]}`}
                  >
                    {budgetDisplayMap[place.budgetPreference]}
                  </span>

                  <span className="text-zinc-300">
                    ⭐ {place.rating ?? 4.5}
                  </span>
                </div>

                {/* Button */}
                <button className="w-full py-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition">
                  View Details
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}