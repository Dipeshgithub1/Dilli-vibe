"use client";

import ProtectedRoute from "../../../component/ProtectedRoute";
import { useAuthStore } from "../../../store/authStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6">
        <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
        <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mx-auto relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-sm transition"
            >
              Update Preferences
            </button>
          </div>

          {/* User Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 mb-1">First Name</p>
              <p className="text-lg">{user?.firstName || "Not set"}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 mb-1">Last Name</p>
              <p className="text-lg">{user?.lastName || "Not set"}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 mb-1">Email</p>
              <p className="text-lg">{user?.email || "Not set"}</p>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 mb-1">Member Since</p>
              <p className="text-lg">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Current Vibes</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-2">Preferred Vibes</p>
                <div className="flex flex-wrap gap-1">
                  {user?.preferredVibes && user.preferredVibes.length > 0 ? (
                    user.preferredVibes.map(vibe => (
                      <span key={vibe} className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">
                        {vibe}
                      </span>
                    ))
                  ) : (
                    <p className="text-zinc-400 text-sm">Not set</p>
                  )}
                </div>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-2">Budget Preference</p>
                <p className="capitalize text-sm">{user?.budgetPreference || "Not set"}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs text-zinc-500 mb-2">Going With</p>
                <p className="capitalize text-sm">{user?.companyType || "Not set"}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-zinc-800 pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/onboarding")}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-left"
              >
                <p className="font-medium">🔄 Update Vibes</p>
                <p className="text-xs text-zinc-400 mt-1">Change your mood, budget, or company</p>
              </button>
              <button
                onClick={() => router.push("/recommendations")}
                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-left"
              >
                <p className="font-medium">🔍 Browse Places</p>
                <p className="text-xs text-zinc-400 mt-1">Explore new Delhi spots</p>
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              Account ID: {user?._id ? user._id.slice(-8).toUpperCase() : "N/A"} • 
              Provider: {user?.authProvider || "local"}
            </p>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
