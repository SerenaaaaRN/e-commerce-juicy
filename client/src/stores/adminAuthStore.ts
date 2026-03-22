import { create } from "zustand";
import { toast } from "sonner";
import { adminApi, withFallback } from "@/lib/api";

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

const DEFAULT_MOCK_ADMIN: Admin = {
  id: "admin-1",
  username: "Administrator",
  email: "admin@juicy.com",
};

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  token: localStorage.getItem("juicy_admin_token"),
  admin: localStorage.getItem("juicy_admin_user")
    ? JSON.parse(localStorage.getItem("juicy_admin_user")!)
    : null,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const result = await withFallback(
        () => adminApi.adminLogin(email, password),
        () => {
          if (email !== "admin@juicy.com" || password.length < 4) {
            throw new Error("Invalid credentials");
          }
          return { token: "mock-admin-jwt-token", admin: DEFAULT_MOCK_ADMIN };
        },
      );
      localStorage.setItem("juicy_admin_token", result.token);
      localStorage.setItem("juicy_admin_user", JSON.stringify(result.admin));
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
      await withFallback(
        () => adminApi.adminLogout(),
        () => {},
      );
    } catch {
      // proceed with local logout regardless
    }
    localStorage.removeItem("juicy_admin_token");
    localStorage.removeItem("juicy_admin_user");
    set({ token: null, admin: null });
    toast.success("Administrator logged out.");
  },

  checkAuth: async () => {
    const localToken = localStorage.getItem("juicy_admin_token");
    const localUser = localStorage.getItem("juicy_admin_user");
    if (!localToken || !localUser) {
      set({ token: null, admin: null });
      return;
    }
    try {
      const profile = await withFallback(
        () => adminApi.getAdminProfile(),
        () => JSON.parse(localUser),
        "Server offline — using cached credentials",
      );
      set({ token: localToken, admin: { id: profile.id, username: profile.username, email: profile.email } });
    } catch {
      set({ token: localToken, admin: JSON.parse(localUser) });
    }
  },
}));
