import { create } from "zustand";
import { toast } from "sonner";

export type Admin = {
  id: string;
  username: string;
  email: string;
};

type AdminAuthState = {
  token: string | null;
  admin: Admin | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => void;
};

const DEFAULT_MOCK_ADMIN: Admin = {
  id: "admin-1",
  username: "Administrator",
  email: "admin@juicy.com",
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: localStorage.getItem("juicy_admin_token"),
  admin: localStorage.getItem("juicy_admin_user")
    ? JSON.parse(localStorage.getItem("juicy_admin_user")!)
    : null,

  login: (email: string, password: string) => {
    if (email === "admin@juicy.com" && password.length >= 4) {
      const mockToken = "mock-admin-jwt-token";
      localStorage.setItem("juicy_admin_token", mockToken);
      localStorage.setItem("juicy_admin_user", JSON.stringify(DEFAULT_MOCK_ADMIN));
      set({ token: mockToken, admin: DEFAULT_MOCK_ADMIN });
      toast.success("Welcome back, Administrator.");
      return true;
    }
    toast.error("Invalid administrator credentials.");
    return false;
  },

  logout: () => {
    localStorage.removeItem("juicy_admin_token");
    localStorage.removeItem("juicy_admin_user");
    set({ token: null, admin: null });
    toast.success("Administrator logged out.");
  },

  checkAuth: () => {
    const token = localStorage.getItem("juicy_admin_token");
    const userJson = localStorage.getItem("juicy_admin_user");
    if (token && userJson) {
      set({ token, admin: JSON.parse(userJson) });
    } else {
      set({ token: null, admin: null });
    }
  },
}));
