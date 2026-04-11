"use client";

interface Place {
  _id: string;
  name: string;
  description: string;
  area: string;
  moods: string[];
  suitableFor: string[];
  budgetPreference: string;
  rating?: number;
  image?: string;
}

interface Props {
  place: Place;
  explanation: string;
  bestTime: string;
  onBack: () => void;
}

export default function ViewPlace({
  place,
  explanation,
  bestTime,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* 🔙 Back */}
        <button
          onClick={onBack}
          className="mb-6 text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </button>

        {/* 🖼️ Image */}
        <img
          src={
            place.image ||
            "https://source.unsplash.com/800x400/?delhi,cafe"
          }
          alt={place.name}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2">
          {place.name}
        </h1>

        <p className="text-zinc-400 mb-4">
          📍 {place.area}
        </p>

        {/* 🤖 AI Explanation */}
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-orange-400 mb-2">
            🤖 Why this place?
          </h3>
          <p>{explanation}</p>
        </div>

        {/* ⏰ Best Time */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6">
          <h3 className="font-semibold text-blue-400 mb-2">
            ⏰ Best time to visit
          </h3>
          <p>{bestTime}</p>
        </div>

        {/* Description */}
        <p className="text-zinc-300 mb-6">
          {place.description}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
          <span>⭐ {place.rating ?? 4.5}</span>
          <span>👥 {place.suitableFor.join(", ")}</span>
          <span>💰 {place.budgetPreference}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {place.moods.map((mood) => (
            <span
              key={mood}
              className="text-xs bg-zinc-800 px-3 py-1 rounded-md"
            >
              {mood}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}