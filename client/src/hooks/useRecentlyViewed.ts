import { useState, useCallback } from "react"

const STORAGE_KEY = "juicy_recently_viewed"
const MAX_ITEMS = 8

export type RecentlyViewedItem = {
  slug: string
  name: string
  image_url: string
  price: number
  category_name: string
}

function loadFromStorage(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items: RecentlyViewedItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // silent
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(loadFromStorage)

  const addItem = useCallback((item: RecentlyViewedItem) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.slug !== item.slug)
      const updated = [item, ...filtered].slice(0, MAX_ITEMS)
      saveToStorage(updated)
      return updated
    })
  }, [])

  return { items, addItem }
}
