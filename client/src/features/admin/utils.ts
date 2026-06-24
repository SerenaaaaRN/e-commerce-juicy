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

export const getCategoryDescendants = (categories: Category[], categoryId: string): string[] => {
  const ids: string[] = [categoryId]
  const childrenMap = new Map<string, Category[]>()

  for (const cat of categories) {
    const parentId = cat.parent_id || ""
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, [])
    }
    childrenMap.get(parentId)!.push(cat)
  }

  const walk = (id: string) => {
    const children = childrenMap.get(id) || []
    for (const child of children) {
      ids.push(child.id)
      walk(child.id)
    }
  }

  walk(categoryId)
  return ids
}
