import { create } from "zustand"

type Admin = {
  id: string
  email: string
  name: string
}

type AdminAuthState = {
  token: string | null
  admin: Admin | null
  isAuthenticated: boolean
  login: (token: string, admin: Admin) => void
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,

  login: (token, admin) => {
    set({
      token,
      admin,
      isAuthenticated: true,
    })
  },

  logout: () => {
    set({
      token: null,
      admin: null,
      isAuthenticated: false,
    })
  },
}))

export default useAdminAuthStore
