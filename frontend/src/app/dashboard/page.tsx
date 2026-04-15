"use client";

import ProtectedRoute from "../../../component/ProtectedRoute";
import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.log(e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    router.push("/login")
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">

        {/* Background glow */}
        <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
        <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

        <div className="max-w-5xl mx-auto relative z-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.firstName} 👋
            </h1>
            <div className="flex gap-3">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-400 hover:to-red-400 transition"
            >
              Find My Vibe
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            >
              Logout
            </button>
            </div>
          </div>

          {/* 🔥 User Profile Card */}
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl mb-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <span>👤</span> Your Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <p className="text-zinc-400 text-sm">
                <span className="text-zinc-500">Email:</span> {user?.email}
              </p>

              <p className="text-zinc-400 text-sm">
                <span className="text-zinc-500">Preferences:</span> {user?.preferredVibes?.join(", ") || "Not set"}
              </p>

              <p className="text-zinc-400 text-sm">
                <span className="text-zinc-500">Budget:</span> {user?.budgetPreference || "Not set"}
              </p>

              <p className="text-zinc-400 text-sm">
                <span className="text-zinc-500">Going with:</span> {user?.companyType || "Not set"}
              </p>
            </div>
          </div>

          {/* 🔥 Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Discover */}
            <div
              onClick={() => router.push("/onboarding")}
              className="cursor-pointer bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-orange-500 hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">
                🚀
              </div>
              <h2 className="text-lg font-medium mb-2">
                Discover Places
              </h2>
              <p className="text-zinc-400 text-sm">
                Get recommendations based on your mood and budget.
              </p>
            </div>

            {/* AI */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-zinc-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">
                🧠
              </div>
              <h2 className="text-lg font-medium mb-2">
                Smart AI Matching
              </h2>
              <p className="text-zinc-400 text-sm">
                Personalized suggestions powered by AI.
              </p>
            </div>

            {/* Budget */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 rounded-2xl border border-zinc-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-2xl">
                💰
              </div>
              <h2 className="text-lg font-medium mb-2">
                Budget Friendly
              </h2>
              <p className="text-zinc-400 text-sm">
                Enjoy experiences within your budget.
              </p>
            </div>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}