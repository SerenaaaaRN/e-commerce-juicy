import { create } from "zustand"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeStore = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

type ThemeConfig = {
  storageKey: string
  defaultTheme: Theme
  disableTransitionOnChange: boolean
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]

function isTheme(value: string | null): value is Theme {
  return value !== null && THEME_VALUES.includes(value as Theme)
}

function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) return "dark"
  return "light"
}

function getResolvedTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

let config: ThemeConfig = {
  storageKey: "theme",
  defaultTheme: "system",
  disableTransitionOnChange: true,
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;transition:none!important}")
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement
  const resolved = getResolvedTheme(theme)
  const restoreTransitions = config.disableTransitionOnChange ? disableTransitionsTemporarily() : null

  root.classList.remove("light", "dark")
  root.classList.add(resolved)

  if (restoreTransitions) {
    restoreTransitions()
  }
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(config.storageKey)
  if (isTheme(stored)) return stored
  return config.defaultTheme
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getStoredTheme(),

  setTheme: (theme) => {
    localStorage.setItem(config.storageKey, theme)
    set({ theme })
    applyThemeToDOM(theme)
  },
}))

export function initThemeStore(opts: Partial<ThemeConfig>) {
  config = { ...config, ...opts }
  const initial = getStoredTheme()
  useThemeStore.setState({ theme: initial })
  applyThemeToDOM(initial)
}
