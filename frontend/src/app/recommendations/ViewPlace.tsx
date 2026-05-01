"use client";

import { motion } from "framer-motion";

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
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  weather?: { temp: number; description: string; humidity: number } | null;
  weatherLoading?: boolean;
  weatherError?: string | null;
  onShare?: () => void;
}

export default function ViewPlace({
  place,
  explanation,
  bestTime,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isFavorite = false,
  onToggleFavorite,
  weather,
  weatherLoading = false,
  weatherError,
  onShare,
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden px-4 py-6">

      {/* 🌈 Background Glow */}
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[120px] rounded-full top-10 left-10" />
      <div className="absolute w-100 h-100 bg-red-500/20 blur-[140px] rounded-full bottom-10 right-10" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* 🔙 Back + Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1"
          >
            ← Back to all
          </button>

          <div className="flex items-center gap-2">
            {onPrev && (
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className="px-3 py-1.5 text-sm bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-700 transition"
              >
                ← Prev
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                disabled={!hasNext}
                className="px-3 py-1.5 text-sm bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-zinc-700 transition"
              >
                Next →
              </button>
            )}

            {/* ❤️ Favorite */}
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="text-lg">{isFavorite ? "❤️" : "🤍"}</span>
              </button>
            )}

            {/* 📤 Share */}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                aria-label="Share this place"
              >
                <span className="text-lg">📤</span>
              </button>
            )}
          </div>
        </div>

        {/* 🖼️ HERO IMAGE */}
        <div className="relative rounded-2xl overflow-hidden mb-6 group">
          <img
            src={place.image || `https://picsum.photos/seed/${place._id}/800/400`}
            alt={place.name}
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

          {/* Title on image */}
          <div className="absolute bottom-4 left-5">
            <h1 className="text-2xl md:text-3xl font-bold">
              {place.name}
            </h1>
            <p className="text-sm text-zinc-300">
              📍 {place.area}
            </p>
          </div>
        </div>

        {/* 📦 MAIN CARD */}
        <div className="bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/30 space-y-6">

          {/* 🌤️ REAL WEATHER INSIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-5 rounded-xl"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                🌤️ Current Weather in {place.area}
                {weatherError && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">Estimated</span>}
              </h3>
              {weatherLoading ? (
                <div className="animate-spin text-sm">⟳</div>
              ) : weather ? (
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{weather.temp}°C</p>
                  <p className="text-xs text-zinc-400 capitalize">{weather.description}</p>
                </div>
              ) : (
                <span className="text-zinc-500 text-sm">N/A</span>
              )}
            </div>
            {weather && !weatherLoading && (
              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span className="text-xs text-zinc-500">
                  {weather.temp > 30 ? "🔥 It's hot! Indoor spots recommended." :
                   weather.temp < 15 ? "🧥 Bundle up before heading out." :
                   weather.temp > 25 ? "☀️ Perfect for outdoor exploration." :
                   "🌤️ Great weather for your visit!"}
                </span>
              </div>
            )}
            {weatherError && !weatherLoading && (
              <p className="text-xs text-zinc-500 mt-2">
                Weather data estimated. Add OpenWeather API key for real-time updates.
              </p>
            )}
          </motion.div>

          {/* 🤖 AI EXPLANATION */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-linear-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-5 rounded-xl"
          >
            <h3 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
              🤖 Why this place?
            </h3>
            {explanation ? (
              <p className="text-zinc-300 leading-relaxed">
                {explanation}
              </p>
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-700 rounded w-2/3" />
                <div className="h-3 bg-zinc-700 rounded w-1/2" />
              </div>
            )}
          </motion.div>

          {/* 📝 DESCRIPTION */}
          <p className="text-zinc-300 leading-relaxed">
            {place.description}
          </p>

          {/* 📍 MAP BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.area + " Delhi")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition font-medium"
            >
              📍 Google Maps
            </a>
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition font-medium"
            >
              📤 Share
            </button>
          </div>

          {/* ⏰ BEST TIME */}
          <div className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-5 rounded-xl">
            <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              ⏰ Best time to visit
            </h3>
            <p className="text-zinc-300">
              {bestTime || "Evening is usually best"}
            </p>
          </div>

          {/* 📊 INFO BADGES */}
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1 bg-zinc-800/60 px-3 py-1.5 rounded-lg backdrop-blur">
              ⭐ {place.rating ?? 4.5}
            </span>
            <span className="flex items-center gap-1 bg-zinc-800/60 px-3 py-1.5 rounded-lg backdrop-blur">
              👥 {place.suitableFor.join(", ")}
            </span>
            <span className="flex items-center gap-1 bg-zinc-800/60 px-3 py-1.5 rounded-lg backdrop-blur">
              💰 {place.budgetPreference}
            </span>
          </div>

          {/* 🏷️ TAGS */}
          <div className="flex flex-wrap gap-2">
            {place.moods.map((mood) => (
              <span
                key={mood}
                className="text-xs bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-md text-zinc-300 hover:bg-zinc-700 transition"
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
