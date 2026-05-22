import { create } from "zustand"
import { persist } from "zustand/middleware"

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

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "juicy-admin-auth",
      version: 1,
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAdminAuthStore
