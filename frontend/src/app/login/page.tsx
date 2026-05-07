"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { fetchMe } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.accessToken);

      await fetchMe();

      const user = useAuthStore.getState().user;
      if (user?.isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Server not responding");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">

      {/* Background glow */}
      <div className="absolute w-100 h-100 bg-orange-500/20 blur-[150px] rounded-full top-30 left-30" />
      <div className="absolute w-112.5 h-112.5 bg-red-500/20 blur-[160px] rounded-full bottom-37.5 right-37.5" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-orange-500 mb-2">Dilli-Vibe</div>
          <p className="text-sm text-zinc-400">Delhi's mood-based city guide</p>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1">
          Welcome back
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Sign in to continue exploring Delhi
        </p>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mb-6">
          <span>⭐ 4.8/5 rating</span>
          <span>•</span>
          <span>500+ happy explorers</span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-400">
              <input type="checkbox" className="rounded border-zinc-600" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-orange-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition text-black font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center mb-3">Trusted by Delhi explorers</p>
          <div className="flex justify-center gap-4 text-zinc-600">
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded">🔒 Secure</span>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded">🚀 Fast</span>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded">🧠 AI-Powered</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
