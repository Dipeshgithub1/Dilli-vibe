"use client";

import ProtectedRoute from "../../../component/ProtectedRoute";
import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white p-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold">
              Welcome, {user?.firstname} 👋
            </h1>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-5 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition"
            >
              Find My Vibe
            </button>
          </div>

          {/* Card Section */}
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-medium mb-2">Discover Places</h2>
              <p className="text-zinc-400 text-sm">
                Get recommendations based on your mood and budget.
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-medium mb-2">Smart AI Matching</h2>
              <p className="text-zinc-400 text-sm">
                Personalized suggestions tailored for Delhi vibes.
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-medium mb-2">Budget Friendly</h2>
              <p className="text-zinc-400 text-sm">
                Stay within your budget while enjoying your day.
              </p>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
