"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-[#f7f7f7] text-black overflow-hidden">

      {/* Animated Gradient Background */}
      {/* Updated Animated Gradient Background */}
<motion.div
  className="absolute inset-0 -z-10 bg-[#fffaf5]" // Added a very subtle orange tint to the base
  animate={{ opacity: [0.8, 1, 0.8] }}
  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
>
  {/* Primary Orange Flow (Left) */}
  <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[120%] bg-linear-to-br from-orange-400/40 via-amber-200/20 to-transparent blur-[100px] rotate-12 transform-gpu"></div>
  
  {/* Secondary Glow (Right) */}
  <div className="absolute top-[-20%] -right-[10%] w-[60%] h-[140%] bg-linear-to-bl from-orange-500/30 via-orange-300/20 to-transparent blur-[120px] -rotate-12 transform-gpu"></div>

  {/* Accent Light Streaks - This mimics the "lines" in your image */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-50">
    <div className="absolute top-0 left-[20%] w-px h-full bg-orange-400/20 blur-sm rotate-15"></div>
    <div className="absolute top-0 right-[20%] w-1px h-full bg-orange-300/20 blur-sm -rotate-15deg"></div>
  </div>
</motion.div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center max-w-6xl mx-auto px-6 py-6 mt-6 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-full shadow-sm"
      >

        <div
          onClick={() => router.push("/")}
          className="font-semibold text-lg cursor-pointer"
        >
          Dilli-Vibe
        </div>

        {/* Center Menu */}
        {user && (
          <div className="hidden md:flex gap-8 text-sm text-gray-600">

            <span
              onClick={() => router.push("/dashboard")}
              className="hover:text-black cursor-pointer"
            >
              Dashboard
            </span>

            <span
              onClick={() => router.push("/favorites")}
              className="hover:text-black cursor-pointer"
            >
              Favorites
            </span>

            <span
              onClick={() => router.push("/profile")}
              className="hover:text-black cursor-pointer"
            >
              Profile
            </span>

          </div>
        )}

        {/* Right Side Button */}
        {!user ? (
          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 bg-black text-white rounded-full hover:opacity-90 transition"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 bg-black text-white rounded-full hover:opacity-90 transition"
          >
            Go to Dashboard
          </button>
        )}

      </motion.nav>

      {/* Hero Section */}
      <section className="text-center mt-28 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto"
        >
          Discover Delhi with{" "}
          {/* Updated text color to Orange */}
          <span className="text-orange-600">AI-powered vibes</span>{" "}
          tailored to your mood
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-600 mt-6 max-w-2xl mx-auto"
        >
          Tell us your mood and budget. We’ll recommend the best places
          in Delhi — instantly.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          onClick={() => router.push(user ? "/dashboard" : "/register")}
  
          className="mt-8 px-8 py-3 bg-orange-600 text-white rounded-full font-medium shadow-lg hover:bg-orange-700 transition"
        >
          Find My Vibe →
        </motion.button>

      </section>

      {/* Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="mt-24 flex justify-center px-6"
      >
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-10 shadow-2xl hover:scale-[1.02] transition-transform duration-500">

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="font-semibold mb-2">Romantic 💕</h3>
              <p className="text-sm text-gray-600">
                Hauz Khas Lake Walk + Café
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="font-semibold mb-2">Party 🎉</h3>
              <p className="text-sm text-gray-600">
                Connaught Place Nightclubs
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="font-semibold mb-2">Nature 🌿</h3>
              <p className="text-sm text-gray-600">
                Lodhi Garden + Street Food
              </p>
            </div>

          </div>

        </div>
      </motion.div>

    </div>
  );
}