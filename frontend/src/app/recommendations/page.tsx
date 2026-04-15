"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

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
    const fetchRecommendations = async () => {
      try {
        const searchText = localStorage.getItem("lastSearch") || "";

        const res = await api.post(
          "/recommendations?page=1&limit=6",
          { searchText }
        );

        setPlaces(res.data.data);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [router]);

  /* 🔥 LOADING SKELETON */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-zinc-800 h-60 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">

      {/* Background glow */}
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <div className="max-w-6xl mx-auto">

        {/* 🔥 Header */}
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

        {/* 🔥 Empty State */}
        {places.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-zinc-400 mb-4">
              No recommendations found.
            </p>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-4 py-2 bg-orange-500 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {places.map((place) => (
              <div
                key={place._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-white transition duration-300 hover:scale-[1.02]"
              >

                {/* 🔥 Image */}
                <img
                  src={
                    place.image ||
                    "https://source.unsplash.com/400x300/?delhi,cafe"
                  }
                  alt={place.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

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
                    .map((type) => peopleDisplayMap[type] || type)
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
                    className={`font-semibold ${
                      budgetColorMap[place.budgetPreference] || "text-zinc-300"
                    }`}
                  >
                    {budgetDisplayMap[place.budgetPreference] ||
                      place.budgetPreference}
                  </span>

                  <span className="text-zinc-300">
                    ⭐ {place.rating ?? 4.5}
                  </span>
                </div>

                {/* 🔥 View Button */}
                <button
                  onClick={() =>
                    router.push(`/recommendations/${place._id}`)
                  }
                  className="w-full py-2 rounded-lg bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition text-black font-medium"
                >
                  View Details →
                </button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}