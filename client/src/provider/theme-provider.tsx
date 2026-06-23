import { initThemeStore, useThemeStore } from "@/stores/theme-store"
import { useEffect, useRef, type ReactNode } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

function getSystemTheme() {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) return "dark"
  return "light"
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const editableParent = target.closest("input, textarea, select, [contenteditable='true']")
  return editableParent !== null
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initThemeStore({ storageKey, defaultTheme, disableTransitionOnChange })
  }, [defaultTheme, storageKey, disableTransitionOnChange])

  useEffect(() => {
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      const theme = useThemeStore.getState().theme
      if (theme === "system") {
        useThemeStore.getState().setTheme("system")
      }
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditableTarget(event.target)) return
      if (event.key.toLowerCase() !== "d") return

      const { theme, setTheme } = useThemeStore.getState()
      const nextTheme =
        theme === "dark" ? "light" : theme === "light" ? "dark" : getSystemTheme() === "dark" ? "light" : "dark"

      setTheme(nextTheme)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return
      if (event.key !== storageKey) return

      const theme = event.newValue
      if (theme === "dark" || theme === "light" || theme === "system") {
        useThemeStore.getState().setTheme(theme)
      } else {
        useThemeStore.getState().setTheme(defaultTheme)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [defaultTheme, storageKey])

  return <>{children}</>
}

export const useTheme = () => {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  return { theme, setTheme }
}
