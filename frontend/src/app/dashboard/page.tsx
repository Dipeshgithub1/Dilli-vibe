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
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.firstName} 👋
            </h1>
            <div className="flex gap-3">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-5 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition"
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
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 mb-6">
            <h2 className="text-lg font-medium mb-2">Your Profile</h2>

            <p className="text-zinc-400 text-sm">
              Email: {user?.email}
            </p>

            <p className="text-zinc-400 text-sm">
              Preferences: {user?.preferredVibes?.join(", ") || "Not set"}
            </p>

            <p className="text-zinc-400 text-sm">
              Budget: {user?.budgetPreference || "Not set"}
            </p>

            <p className="text-zinc-400 text-sm">
              Going with: {user?.companyType || "Not set"}
            </p>
          </div>

          {/* 🔥 Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* Discover */}
            <div
              onClick={() => router.push("/onboarding")}
              className="cursor-pointer bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:scale-105 transition"
            >
              <h2 className="text-lg font-medium mb-2">
                Discover Places 🚀
              </h2>
              <p className="text-zinc-400 text-sm">
                Get recommendations based on your mood and budget.
              </p>
            </div>

            {/* AI */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-medium mb-2">
                Smart AI Matching 🧠
              </h2>
              <p className="text-zinc-400 text-sm">
                Personalized suggestions powered by AI.
              </p>
            </div>

            {/* Budget */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-medium mb-2">
                Budget Friendly 💰
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