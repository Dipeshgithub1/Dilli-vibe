"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
     

      localStorage.setItem("token", res.data.data.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
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
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >

        <h1 className="text-2xl font-semibold text-center mb-1">
          Welcome back
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Discover your Delhi vibe
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-zinc-400">
              Email
            </label>

            <input
              type="email"
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Password
            </label>

            <input
              type="password"
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-400 transition text-black font-medium disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={()=>router.push("/register")}
            className="text-orange-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </motion.div>
    </div>
  );
}