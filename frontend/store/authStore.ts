"use client"

import api from "../lib/axios";
import { create } from "zustand";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOnboarded: boolean;
  preferredVibes?: string[];
  budgetPreference?: string;
  companyType?: string;
  authProvider?: "local" | "google";
}

interface AuthState {
    user: User | null;
    loading:boolean;
    fetchMe: () => Promise<void>;
    logout: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        set({ user: null, loading: false });
        return;
      }
      const res = await api.get("/auth/me");
      set({ user: res.data.data });
    } catch {
      set({ user: null,loading:false });
    } finally {
      set({ loading: false });
    }
  },

logout: () => {
     localStorage.removeItem("accessToken");
     set({ user: null,loading:false });
   },
}));