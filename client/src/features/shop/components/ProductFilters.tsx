import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"

type ProductFiltersProps = {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedSort: "price_asc" | "price_desc" | "newest" | "popular" | ""
  onSortChange: (sort: "price_asc" | "price_desc" | "newest" | "popular" | "") => void
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
  onReset: () => void
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  selectedSizes,
  onSizesChange,
  onReset,
}: ProductFiltersProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (catId: string) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  // Filter root categories (parent_id is null/undefined)
  const rootCategories = categories.filter((cat) => !cat.parent_id)

  const renderCategoryNode = (cat: Category, level: number = 0) => {
    const hasChildren = cat.children && cat.children.length > 0
    const isExpanded = !!expanded[cat.id]
    const isSelected = selectedCategory === cat.slug

    return (
      <div key={cat.id} className="flex flex-col gap-1">
        <div
          className={cn(
            "flex items-center justify-between py-1.5 px-2 text-xs uppercase tracking-wider transition-colors duration-200 rounded-none",
            isSelected
              ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <button
            onClick={() => onCategoryChange(cat.slug)}
            className="flex-1 text-left cursor-pointer font-medium uppercase truncate"
          >
            {cat.name}
            {cat.product_count !== undefined && (
              <span className="text-[10px] text-muted-foreground ml-1.5 font-normal lowercase">
                ({cat.product_count})
              </span>
            )}
          </button>

          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(cat.id)
              }}
              className="p-1 hover:text-foreground cursor-pointer transition-transform duration-200"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <ChevronDown />
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {cat.children?.map((child) => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const sortOptions = [
    { label: "New Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Popularity", value: "popular" },
  ]

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Category Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Categories
        </h3>
        <Separator />

        <div className="flex flex-col gap-1">
          {/* All Apparel link */}
          <button
            onClick={() => onCategoryChange("")}
            className={cn(
              "text-left py-1.5 px-2 text-xs uppercase tracking-wider font-semibold rounded-none cursor-pointer border-l-2",
              selectedCategory === ""
                ? "bg-primary/10 text-primary border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/30"
            )}
          >
            All Apparel
          </button>

          {rootCategories.map((cat) => renderCategoryNode(cat, 0))}
        </div>
      </div>

      {/* Size Pills Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Filter by Size
        </h3>
        <Separator />
        <ToggleGroup
          type="multiple"
          variant="outline"
          value={selectedSizes}
          onValueChange={onSizesChange}
          className="flex flex-wrap gap-2 justify-start"
        >
          {AVAILABLE_SIZES.map((size) => (
            <ToggleGroupItem
              key={size}
              value={size}
              className="min-w-[42px] h-9 text-xs font-semibold uppercase tracking-wider rounded-none cursor-pointer data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-50 dark:data-[state=on]:bg-zinc-50 dark:data-[state=on]:text-zinc-900 data-[state=on]:border-zinc-900 dark:data-[state=on]:border-zinc-50"
            >
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sorting Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Sort By
        </h3>
        <Separator />
        <ToggleGroup
          type="single"
          value={selectedSort}
          onValueChange={(val) => onSortChange((val || "") as any)}
          className="flex flex-col items-stretch gap-1"
        >
          {sortOptions.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="justify-start py-1.5 px-2 h-auto text-xs uppercase tracking-wider font-medium rounded-none cursor-pointer border-l-2 text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/30 data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 data-[state=on]:border-zinc-900 dark:data-[state=on]:bg-zinc-800 dark:data-[state=on]:text-zinc-50 dark:data-[state=on]:border-zinc-50"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Reset Action */}
      <Button
        variant="outline"
        onClick={onReset}
        className="cursor-pointer mt-2 w-full rounded-none font-semibold text-xs uppercase tracking-wider py-5"
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default ProductFilters
