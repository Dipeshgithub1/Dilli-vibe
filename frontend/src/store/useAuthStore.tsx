import { create } from "zustand";
import api from "../api/axios";

interface AuthState {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

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
