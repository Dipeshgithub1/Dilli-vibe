"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);

localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.data?.isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 py-8">

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
          <p className="text-sm text-zinc-400">Start your Delhi adventure</p>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1">
          Create Account
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Join 500+ explorers discovering Delhi
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                placeholder="Priya"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 block mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                placeholder="Sharma"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">
              Password (min 6 characters)
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <div className="text-xs text-zinc-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-orange-400 hover:underline">Terms</Link>
            {" "}&{" "}
            <Link href="/privacy" className="text-orange-400 hover:underline">Privacy Policy</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 transition text-black font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⟳</span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center mb-3">What you get:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span>✓</span> AI recommendations
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span> Save favorites
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span> Mood-based tags
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span> Delhi expertise
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}