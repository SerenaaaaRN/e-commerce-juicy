import type { Category } from "@/types"

export type CategoryOption = { value: string; label: string; depth: number }

export function buildCategoryOptions(categories: Category[]) {
  const byParent = new Map<string, Category[]>()
  for (const cat of categories) {
    const key = cat.parent_id || ""
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key)!.push(cat)
  }

  const result: CategoryOption[] = []
  function walk(parentKey: string, depth: number) {
    for (const cat of byParent.get(parentKey) || []) {
      result.push({ value: cat.id, label: cat.name, depth })
      walk(cat.id, depth + 1)
    }
  }

  walk("", 0)
  return result
}
