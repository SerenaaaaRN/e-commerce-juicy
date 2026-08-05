import { useNavigate, useRouterState } from "@tanstack/react-router"
import { useCallback, useEffect, useState, type FormEvent } from "react"
import useDebounce from "./useDebounce"

const DEBOUNCE_MS = 300

/**
 * Mengelola seluruh logika pencarian & sinkronisasi URL
 */

const useSearchSync = () => {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const searchParams = useRouterState({ select: (s) => s.location.search }) as Record<string, unknown>

  const urlQuery = typeof searchParams.search === "string" ? searchParams.search : ""
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const current = urlQuery

    if (trimmed === current) return
    if (pathname !== "/shop" && !trimmed) return

    navigate({
      to: "/shop",
      replace: true,
      search: (prev) => {
        if (trimmed) return { ...prev, search: trimmed, page: 1 }
        const { search: _removed, ...rest } = prev
        return { ...rest, page: 1 }
      },
    })
  }, [debouncedQuery, urlQuery, navigate, pathname])

  const submitSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      if (query.trim()) {
        navigate({ to: "/shop", search: { search: query.trim(), page: 1 } })
      }
    },
    [query, navigate]
  )

  return { query, setQuery, submitSearch }
}

export { useSearchSync }
