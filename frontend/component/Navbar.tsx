"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
        <div className="font-semibold text-lg">Dilli-Vibe</div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-full">
      <Link href={user ? "/dashboard" : "/"} className="font-semibold text-lg text-white">
        Dilli-Vibe
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm">
            <Link
              href="/dashboard"
              className={`hover:text-white transition ${
                isActive("/dashboard") ? "text-green-400" : "text-zinc-400"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/recommendations"
              className={`hover:text-white transition ${
                isActive("/recommendations") ? "text-green-400" : "text-zinc-400"
              }`}
            >
              Recommendations
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-300 hidden sm:block">
              {user.firstName} {user.lastName}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}