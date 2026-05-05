"use client";

import { useState, useEffect } from "react";

const thinkingMessages = [
  "Consulting the vibes...",
  "Scouting Delhi's hidden gems...",
  "Asking the locals for secrets...",
  "Crunching the mood data...",
  "Finding your perfect spot...",
  "Curating the experience...",
  "Analyzing the atmosphere...",
  "Mapping your adventure...",
  "Discovering hidden treasures...",
  "Crafting your recommendation...",
];

export default function AIThinkingLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <div className="max-w-md mx-auto text-center relative z-10">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-2 bg-linear-to-r from-orange-500 to-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-6 bg-zinc-950 rounded-full flex items-center justify-center">
              <span className="text-3xl animate-bounce">🤖</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-orange-400 animate-pulse">
            {thinkingMessages[messageIndex]}
          </p>
          <p className="text-sm text-zinc-500">
            Our AI is crafting something special for you
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationFillMode: "both",
              }}
            />
          ))}
        </div>

        <div className="mt-10 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-400">
            💡 Did you know? Delhi has over 1,500+ cafes, each with its own unique
            story waiting to be discovered.
          </p>
        </div>
      </div>
    </div>
  );
}
