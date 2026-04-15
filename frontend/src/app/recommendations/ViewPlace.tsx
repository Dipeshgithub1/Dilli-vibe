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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">

      {/* Background glow */}
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* 🔙 Back */}
        <button
          onClick={onBack}
          className="mb-6 text-sm text-zinc-400 hover:text-white transition"
        >
          ← Back
        </button>

        {/* 🖼️ Image */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img
            src={
              place.image ||
              `https://picsum.photos/seed/${place._id}/800/400`
            }
            alt={place.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/60 to-transparent" />
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 md:p-8">

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2">
          {place.name}
        </h1>

        <p className="text-zinc-400 mb-6 flex items-center gap-2">
          <span>📍</span> {place.area}
        </p>

        {/* 🤖 AI Explanation */}
        <div className="bg-linear-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-5 rounded-xl mb-4">
          <h3 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
            <span>🤖</span> Why this place?
          </h3>
          <p className="text-zinc-300 leading-relaxed">{explanation}</p>
        </div>

        {/* ⏰ Best Time */}
        <div className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-5 rounded-xl mb-6">
          <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <span>⏰</span> Best time to visit
          </h3>
          <p className="text-zinc-300 leading-relaxed">{bestTime}</p>
        </div>

        {/* Description */}
        <p className="text-zinc-300 leading-relaxed mb-6">
          {place.description}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
          <span className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-lg">⭐ {place.rating ?? 4.5}</span>
          <span className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-lg">👥 {place.suitableFor.join(", ")}</span>
          <span className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-lg">💰 {place.budgetPreference}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {place.moods.map((mood) => (
            <span
              key={mood}
              className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-md text-zinc-300"
            >
              {mood}
            </span>
          ))}
        </div>

        </div>

      </div>
    </div>
  );
}