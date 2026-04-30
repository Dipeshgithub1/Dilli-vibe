"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [scrollY, setScrollY] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Favorites count sync
  useEffect(() => {
    const updateFavs = () => {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavCount(Array.isArray(favs) ? favs.length : 0);
    };
    updateFavs();
    window.addEventListener("storage", updateFavs);
    return () => window.removeEventListener("storage", updateFavs);
  }, []);

  // Mouse parallax for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCTA = () => {
    router.push(user ? "/onboarding" : "/register");
  };

  return (
    <div className="relative min-h-screen bg-[#fffaf5] text-gray-900 overflow-hidden">

      {/* 🔥 Background with mouse parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: [0.8, 1, 0.8],
          x: mousePos.x * 0.3,
          y: mousePos.y * 0.3,
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute w-72 h-72 bg-orange-300/30 rounded-full blur-[60px] top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-rose-300/20 rounded-full blur-[60px] bottom-10 right-10"></div>
      </motion.div>

      {/* 🧭 NAVBAR */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center max-w-6xl mx-auto px-4 md:px-6 py-4 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-full shadow-sm sticky top-4 z-50"
      >
        <div
          onClick={() => router.push("/")}
          className="font-semibold text-lg cursor-pointer text-orange-600"
        >
          Dilli-Vibe
        </div>

        {/* ✅ Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* ✅ Desktop menu */}
        <div className="hidden md:flex gap-8 text-sm text-gray-600">
          <span
            onClick={() => router.push(user ? "/dashboard" : "/register")}
            className="cursor-pointer hover:text-black transition"
          >
            Dashboard
          </span>

          <span
            onClick={() => router.push(user ? "/favorites" : "/register")}
            className={`relative cursor-pointer ${
              !user ? "opacity-60 hover:opacity-80" : "hover:text-black"
            }`}
          >
            Favorites
            {user && favCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                {favCount}
              </span>
            )}
          </span>

          <span
            onClick={() => router.push(user ? "/profile" : "/register")}
            className={`cursor-pointer ${
              !user ? "opacity-60 hover:opacity-80" : "hover:text-black"
            }`}
          >
            Profile
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleCTA}
          className="px-5 py-2 bg-black text-white rounded-full hover:opacity-90 transition"
        >
          {user ? "Dashboard" : "Get Started"}
        </button>
      </motion.nav>

      {/* ✅ Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden max-w-6xl mx-auto px-4 mt-2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4 text-sm">
              <Link
                href={user ? "/dashboard" : "/register"}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-orange-600 transition"
              >
                Dashboard
              </Link>
              <Link
                href={user ? "/favorites" : "/register"}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-orange-600 transition flex items-center gap-2"
              >
                Favorites
                {user && favCount > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link
                href={user ? "/profile" : "/register"}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-orange-600 transition"
              >
                Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🇮🇳 HERO */}
      <section className="text-center mt-24 md:mt-28 px-6 relative overflow-hidden">

        {/* 🕌 Decorative Delhi skyline hint */}
        <div className="absolute bottom-0 left-0 w-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 1200 120" className="w-full h-24 fill-current">
            <path d="M0,120 L0,80 L50,80 L50,60 L100,60 L100,90 L150,90 L150,50 L200,50 L200,80 L250,80 L250,40 L300,40 L300,70 L350,70 L350,30 L400,30 L400,60 L450,60 L450,90 L500,90 L500,50 L550,50 L550,80 L600,80 L600,40 L650,40 L650,70 L700,70 L700,30 L750,30 L750,60 L800,60 L800,90 L850,90 L850,50 L900,50 L900,80 L950,80 L950,40 L1000,40 L1000,70 L1050,70 L1050,20 L1100,20 L1100,120 Z" />
          </svg>
        </div>

        <motion.h1
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto"
        >
          Find your perfect <span className="text-orange-600">Delhi spot</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 mt-6 max-w-2xl mx-auto text-lg"
        >
          From hidden cafés to bustling markets — discover places that match your mood, budget, and vibe.
        </motion.p>

        <p className="mt-4 text-orange-600 font-medium">
          ✨ Chandni Chowk chaos or Lodhi Garden calm? We've got you.
        </p>

        <motion.button
          onClick={handleCTA}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-full font-medium shadow-lg hover:from-orange-700 hover:to-red-700 transition relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Find My Vibe →
          </span>
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        </motion.button>

        {/* ✅ Stats with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-700"
        >
          {[
            ["1500+", "Delhi Spots"],
            ["500+", "Explorers"],
            ["4.8⭐", "User Rating"],
          ].map(([num, label], i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-black">{num}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ✅ Benefits Grid */}
      <section className="mt-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: "🤖",
                title: "AI-Powered Picks",
                desc: "Gemini AI analyzes your mood to match you with the perfect spot.",
              },
              {
                icon: "📍",
                title: "Delhi Expert Curated",
                desc: "1500+ places verified by locals — no tourist traps, only gems.",
              },
              {
                icon: "💰",
                title: "Budget Aware",
                desc: "Filter by ₹0-500, ₹500-1500, ₹1500+ and never overspend.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 📊 Dashboard Preview - Now clickable! */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-24 flex justify-center px-6"
      >
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Explore by Mood</h2>
            <p className="text-gray-600">Start with one of these popular vibes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { mood: "romantic", emoji: "💕", title: "Romantic", desc: "Hauz Khas Lake + cozy cafés" },
              { mood: "fun", emoji: "🎉", title: "Party", desc: "Connaught Place nightlife" },
              { mood: "chill", emoji: "☕", title: "Chill", desc: "Lodhi Garden quiet walks" },
            ].map((item) => (
              <motion.div
                key={item.mood}
                onClick={() => router.push(`/onboarding?mood=${item.mood}`)}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition group border-2 border-transparent hover:border-orange-400"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <p className="text-xs text-orange-600 mt-2 font-medium group-hover:underline">
                  Try this vibe →
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ✅ Short Testimonial */}
      <section className="mt-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl font-serif italic text-gray-700"
          >
            "Found my new favorite chai spot in Hauz Khas on day one. This app gets Delhi."
          </motion.blockquote>
          <p className="mt-3 text-gray-500">— Priya, Delhi explorer</p>
        </div>
      </section>

      {/* ✅ Email capture before CTA */}
      <section className="mt-16 px-6">
        <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Get weekly Delhi vibes in your inbox</h3>
          <p className="text-sm text-gray-600 mb-4">
            New spots, hidden gems, and mood-based picks — every Friday.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.target as HTMLFormElement).email.value;
              if (email) {
                localStorage.setItem("lead_email", email);
                alert("Thanks! You'll start receiving Delhi vibes soon 🌟");
                (e.target as HTMLFormElement).reset();
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ✅ Final CTA */}
      <section className="mt-20 text-center px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to explore Delhi?
          </h2>
          <p className="text-gray-600 mb-6">
            Join 500+ explorers who've found their perfect spot.
          </p>
          <button
            onClick={handleCTA}
            className="px-10 py-3 bg-orange-600 text-white rounded-full font-medium shadow-lg hover:bg-orange-700 transition text-lg"
          >
            {user ? "Find My Vibe Again →" : "Get Started Free →"}
          </button>
        </motion.div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} Dilli-Vibe. Made in Delhi 💛
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-orange-600 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-orange-600 transition">Terms</Link>
            <Link href="/contact" className="hover:text-orange-600 transition">Contact</Link>
          </div>
        </div>
      </footer>

      {/* ✅ Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Add id to main wrapper */}
      <div id="main-content" className="relative z-0">
        <div className="pb-20"></div>
      </div>

    </div>
  );
}