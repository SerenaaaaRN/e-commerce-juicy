import { useState, useDeferredValue, useMemo } from "react"

export const useDataTableFilter = <T>(
  initialData: T[],
  filterFn: (item: T, searchLower: string, deferredSearch: string) => boolean
) => {
  const [search, setSearch] = useState("")
  const deferredSearch = useDeferredValue(search)

  const searchLower = useMemo(() => deferredSearch.toLowerCase(), [deferredSearch])

  const filteredData = useMemo(() => {
    return initialData.filter((item) => filterFn(item, searchLower, deferredSearch))
  }, [initialData, filterFn, searchLower, deferredSearch])

  return {
    search,
    setSearch,
    deferredSearch,
    filteredData,
    isStale: search !== deferredSearch,
  }
}
