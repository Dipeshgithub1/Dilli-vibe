"use client";

import { useState } from "react";
import api from "../../../lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
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

    try {
      const res = await api.post("/auth/register", form);

      // if backend returns token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Create Account 🚀
        </h1>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Join Dilli-Vibe and discover your perfect vibe
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div className="flex gap-4">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              required
              className="w-1/2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={form.firstname}
              onChange={handleChange}
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              required
              className="w-1/2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={form.lastname}
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-white cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
