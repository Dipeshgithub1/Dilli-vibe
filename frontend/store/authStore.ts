"use client"

import api from "../lib/axios";
import { create } from "zustand";

interface User {
    _id:string,
 firstname: string;
  lastname: string;
  email: string;
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
      const res = await api.get("/auth/me");
      set({ user: res.data.data });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));