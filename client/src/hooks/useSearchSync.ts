import ROUTES from "@/constants/paths"
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import useDebounce from "./useDebounce"

const DEBOUNCE_MS = 300

/**
 * Mengelola seluruh logika pencarian & sinkronisasi URL
 */

const useSearchSync = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const urlQuery = searchParams.get("search") || ""
  const [query, setQuery] = useState(urlQuery)
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    const current = searchParams.get("search") || ""

    if (trimmed === current) return

    const params = new URLSearchParams(searchParams)
    if (!trimmed) {
      params.delete("search")
    } else {
      params.set("search", trimmed)
      params.set("page", "1")
    }

    const targetPath =
      location.pathname === ROUTES.shop
        ? `${ROUTES.shop}?${params.toString()}`
        : `${ROUTES.shop}?search=${encodeURIComponent(trimmed)}`

    navigate(targetPath, { replace: true })
  }, [debouncedQuery, navigate, location.pathname, searchParams])

  const submitSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      if (query.trim()) {
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      }
    },
    [query, navigate]
  )

  return { query, setQuery, submitSearch }
}

export { useSearchSync }
