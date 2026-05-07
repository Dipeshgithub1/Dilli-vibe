"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Place {
  _id: string;
  name: string;
  description: string;
  area: string;
  moods: string[];
  budgetPreference: "low" | "medium" | "high";
  suitableFor: string[];
  rating?: number;
  image?: string;
}

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

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem("favorites");
        const favs: Place[] = stored ? JSON.parse(stored) : [];
        setFavorites(favs);
      } catch (err) {
        console.error("Failed to load favorites", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
    window.addEventListener("storage", loadFavorites);
    return () => window.removeEventListener("storage", loadFavorites);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f._id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-800 h-60 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-semibold">
            My Favorite Vibes ❤️
          </h1>
          <button
            onClick={() => router.push("/recommendations")}
            className="px-5 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
          >
            Find More Places
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg mb-4">No favorites yet.</p>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-6 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition"
            >
              Discover Places
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {favorites.map((place) => (
              <motion.div
                key={place._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-white transition group"
              >
                <img
                  src={place.image || `https://picsum.photos/seed/${place._id}/400/300`}
                  alt={place.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold">{place.name}</h2>
                    <button
                      onClick={() => removeFavorite(place._id)}
                      className="text-red-400 hover:text-red-300 text-xl p-1"
                      aria-label="Remove from favorites"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">📍 {place.area}</p>
<div className="flex flex-wrap gap-2 mb-3">
                     {place.moods?.map((mood) => (
                      <span
                        key={mood}
                        className="text-xs bg-zinc-800 px-2 py-1 rounded-md text-zinc-300"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className={budgetColorMap[place.budgetPreference] || "text-zinc-300"}>
                      {budgetDisplayMap[place.budgetPreference] || place.budgetPreference}
                    </span>
                    <span className="text-zinc-300">⭐ {place.rating ?? 4.5}</span>
                  </div>
                  <button
                    onClick={() => router.push(`/recommendations/${place._id}`)}
                    className="w-full py-2 rounded-lg bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition text-black font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
