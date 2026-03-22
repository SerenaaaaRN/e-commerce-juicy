import { create } from "zustand";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

export type Admin = {
  id: string;
  username: string;
  email: string;
};

type AdminAuthState = {
  token: string | null;
  admin: Admin | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: null,
  admin: null,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const result = await adminApi.adminLogin(email, password);
      set({ token: result.token, admin: result.admin, loading: false });
      toast.success("Welcome back, Administrator.");
      return true;
    } catch {
      set({ loading: false });
      toast.error("Invalid administrator credentials.");
      return false;
    }
  },

  logout: async () => {
    try {
      await adminApi.adminLogout();
    } catch {
      // proceed with local logout
    }
    set({ token: null, admin: null });
    toast.success("Administrator logged out.");
  },

  checkAuth: async () => {
    try {
      const profile = await adminApi.getAdminProfile();
      set({ token: null, admin: { id: profile.id, username: profile.username, email: profile.email } });
    } catch {
      set({ token: null, admin: null });
    }
  },
}));
