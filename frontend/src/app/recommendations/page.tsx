"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Place {
  _id: string;
  name: string;
  description: string;
  budget: number;
  rating?: number;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recommendations");
    if (stored) {
      setPlaces(JSON.parse(stored));
    } else {
      router.push("/dashboard");
    }
  }, []);

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

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {places.map((place) => (
            <div
              key={place._id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-white transition"
            >
              <h2 className="text-lg font-semibold mb-2">
                {place.name}
              </h2>

              <p className="text-zinc-400 text-sm mb-4">
                {place.description}
              </p>

              <div className="flex justify-between items-center mb-4 text-sm text-zinc-300">
                <span>Budget: ₹{place.budget}</span>
                <span>⭐ {place.rating || 4.5}</span>
              </div>

              <button className="w-full py-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition">
                View Details
              </button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
