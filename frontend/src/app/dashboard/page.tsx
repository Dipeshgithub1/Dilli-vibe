"use client";

import ProtectedRoute from "../../../component/ProtectedRoute";
import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

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

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    placesVisited: 0,
    currentStreak: 0,
    favoritesCount: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get recent viewed places from localStorage
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        setRecentPlaces(viewed.slice(0, 3));

        // Get favorites count
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
        setStats(prev => ({
          ...prev,
          favoritesCount: Array.isArray(favs) ? favs.length : 0,
        }));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.log(e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">

        {/* Background glow */}
        <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
        <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

        <div className="max-w-5xl mx-auto relative z-10 w-full">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.firstName} 👋
              </h1>
              <p className="text-zinc-400 mt-1">
                {user?.preferredVibes?.join(", ") || "Set your vibes"} • {user?.budgetPreference || "Set budget"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/onboarding")}
                className="px-5 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition font-medium"
              >
                🔄 Refresh Vibes
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* 🔥 Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.favoritesCount}</p>
              <p className="text-xs text-zinc-400">Favorites</p>
            </div>
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-500">{stats.placesVisited}</p>
              <p className="text-xs text-zinc-400">Places Visited</p>
            </div>
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.currentStreak}</p>
              <p className="text-xs text-zinc-400">Day Streak 🔥</p>
            </div>
          </motion.div>

          {/* 🔥 Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: "🔍", label: "Discover", href: "/onboarding", color: "from-orange-500 to-red-500" },
              { icon: "❤️", label: "Favorites", href: "/favorites", color: "from-pink-500 to-rose-500" },
              { icon: "📍", label: "All Places", href: "/recommendations", color: "from-blue-500 to-cyan-500" },
              { icon: "⚙️", label: "Profile", href: "/profile", color: "from-purple-500 to-violet-500" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group relative overflow-hidden rounded-xl p-4 bg-zinc-900 border border-zinc-800 hover:border-white/50 transition"
              >
                <div className={`absolute inset-0 bg-linear-to-r ${action.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                <div className="relative text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <p className="text-sm font-medium">{action.label}</p>
                </div>
              </Link>
            ))}
          </motion.div>

          {/* 🔥 User Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl mb-8"
          >
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span>👤</span> Your Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Email</p>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Preferred Vibes</p>
                <p className="text-sm">{user?.preferredVibes?.join(", ") || "Not set"}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Budget</p>
                <p className="text-sm capitalize">{user?.budgetPreference || "Not set"}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-1">Going With</p>
                <p className="text-sm capitalize">{user?.companyType || "Not set"}</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/onboarding")}
              className="mt-4 text-sm text-orange-400 hover:underline"
            >
              Edit preferences →
            </button>
          </motion.div>

          {/* 🔥 Recent Places */}
          {recentPlaces.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {recentPlaces.map((place) => (
                  <div
                    key={place._id}
                    onClick={() => router.push(`/recommendations/${place._id}`)}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500 transition cursor-pointer group"
                  >
                    <img
                      src={place.image || `https://picsum.photos/seed/${place._id}/300/200`}
                      alt={place.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-1">{place.name}</h3>
                      <p className="text-xs text-zinc-500">{place.area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 🔥 Motivation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-linear-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-6 rounded-2xl text-center"
          >
            <p className="text-lg font-medium text-orange-400 mb-2">
              🚀 Ready to explore again?
            </p>
            <p className="text-zinc-300 mb-4">
              Your next favorite spot is waiting. Let AI find it for you.
            </p>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Find My Vibe
            </button>
          </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  );
}