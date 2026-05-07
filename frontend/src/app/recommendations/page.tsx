"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getFavorites = (): Place[] => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  };

  const isFavorite = (id: string) => getFavorites().some((p) => p._id === id);

  const toggleFavorite = (place: Place) => {
    const favs = getFavorites();
    const exists = favs.some((p: Place) => p._id === place._id);
    let updated: Place[];

    if (exists) {
      updated = favs.filter((p: Place) => p._id !== place._id);
      toast.success(`Removed ${place.name} from favorites`);
    } else {
      updated = [...favs, place];
      toast.success(`Saved ${place.name} to favorites ❤️`);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const fetchRecommendations = async (pageNum: number) => {
    setLoading(true);
    try {
      const searchText = localStorage.getItem("lastSearch") || "";
      const cachedIds = localStorage.getItem("recommendationPlaceIds");
      const shouldFetchAll = pageNum === 1 && !cachedIds;

if (shouldFetchAll) {
         const allRes = await api.get(
           `/recommendations?page=1&limit=100${searchText ? `&searchText=${encodeURIComponent(searchText)}` : ""}`
         );
         const allPlaces = allRes.data.data || [];
        const allPlaceIds = allPlaces.map((p: Place) => p._id);
        localStorage.setItem("recommendationPlaceIds", JSON.stringify(allPlaceIds));
      }

const res = await api.get(
         `/recommendations?page=${pageNum}&limit=6${searchText ? `&searchText=${encodeURIComponent(searchText)}` : ""}`
       );

       setPlaces(res.data.data);
      setPage(pageNum);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
    fetchRecommendations(1);
  }, [router]);


  const handlePrev = () => {
    if (page > 1) fetchRecommendations(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) fetchRecommendations(page + 1);
  };

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

        {/* 🔥 Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={handlePrev}
            disabled={page <= 1 || loading}
            className="px-4 py-2 bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-700 transition"
          >
            ← Previous
          </button>
          <span className="text-zinc-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-700 transition"
          >
            Next →
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
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500 transition duration-300 hover:scale-[1.02] group"
              >

                {/* 🔥 Image + Favorite Button */}
                <div className="relative">
                  <img
                    src={
                      place.image ||
                      `https://picsum.photos/seed/${place._id}/400/300`
                    }
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(place);
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition"
                    aria-label={isFavorite(place._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <span className="text-lg">
                      {isFavorite(place._id) ? "❤️" : "🤍"}
                    </span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Name */}
                  <h2 className="text-lg font-semibold mb-1">
                    {place.name}
                  </h2>

                  {/* Area */}
                  <p className="text-xs text-zinc-500 mb-2">
                    📍 {place.area}
                  </p>

                  {/* Suitable For */}
                  <p className="text-xs text-zinc-400 mb-3">
                    👥 {place.suitableFor
                      .map((type) => peopleDisplayMap[type] || type)
                      .join(", ")}
                  </p>

                  {/* Mood Badges with colors */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {place.moods.map((mood) => {
                      const moodColorMap: Record<string, { bg: string; border: string; text: string }> = {
                        romantic: { bg: "bg-pink-500/20", border: "border-pink-500/30", text: "text-pink-300" },
                        chill: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-300" },
                        fun: { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-300" },
                        explore: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-300" },
                        food: { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-300" },
                        social: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-300" },
                      };
                      const colors = moodColorMap[mood] || { bg: "bg-zinc-800", border: "border-zinc-700", text: "text-zinc-300" };
                      return (
                        <span
                          key={mood}
                          className={`text-xs ${colors.bg} ${colors.border} border px-2 py-1 rounded-md ${colors.text}`}
                        >
                          {mood}
                        </span>
                      );
                    })}
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
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
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}