import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import type { Category } from "@/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDownIcon } from "@hugeicons/core-free-icons"

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

type CategoryNodeProps = {
  cat: Category
  level?: number
  selectedCategory: string
  onCategoryChange: (slug: string) => void
}

const CategoryNode = ({ cat, level = 0, selectedCategory, onCategoryChange }: CategoryNodeProps) => {
  const [open, setOpen] = useState(false)
  const hasChildren = cat.children && cat.children.length > 0
  const isSelected = selectedCategory === cat.slug

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center justify-between rounded-none px-2 py-1.5 text-xs tracking-wider uppercase transition-colors duration-200",
          isSelected
            ? "border-l-2 border-primary bg-primary/10 font-semibold text-primary"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          onClick={() => onCategoryChange(cat.slug)}
          className="flex-1 cursor-pointer truncate text-left font-medium uppercase"
        >
          {cat.name}
          {cat.product_count !== undefined ? (
            <span className="ml-1.5 text-[10px] font-normal text-muted-foreground lowercase">
              ({cat.product_count})
            </span>
          ) : null}
        </button>

        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen((prev) => !prev)
            }}
            className="cursor-pointer p-1 transition-transform duration-200 hover:text-foreground"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <HugeiconsIcon icon={ArrowDownIcon} />
          </button>
        ) : null}
      </div>

      {open && hasChildren ? (
        <div className="flex animate-in flex-col gap-1 duration-200 fade-in slide-in-from-top-1">
          {cat.children?.map((child) => (
            <CategoryNode
              key={child.id}
              cat={child}
              level={level + 1}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const sortOptions = [
  { label: "New Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popular" },
]

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
  const rootCategories = categories.filter((cat) => !cat.parent_id)

  return (
    <div className="flex flex-col gap-6 text-left">
      <Accordion type="multiple" defaultValue={["categories", "sizes", "sort"]} className="w-full">
        {/* Categories Section */}
        <AccordionItem value="categories" className="mb-3 border-b border-border/80 pb-3">
          <AccordionTrigger className="py-2 text-xs font-bold tracking-widest text-foreground uppercase hover:text-primary hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-1">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onCategoryChange("")}
                className={cn(
                  "cursor-pointer rounded-none border-l-2 px-2 py-1.5 text-left text-xs font-semibold tracking-wider uppercase",
                  selectedCategory === ""
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
              >
                All Apparel
              </button>
              {rootCategories.map((cat) => (
                <CategoryNode
                  key={cat.id}
                  cat={cat}
                  level={0}
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Pills Section */}
        <AccordionItem value="sizes" className="mb-3 border-b border-border/80 pb-3">
          <AccordionTrigger className="py-2 text-xs font-bold tracking-widest text-foreground uppercase hover:text-primary hover:no-underline">
            Filter by Size
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-1">
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={selectedSizes}
              onValueChange={onSizesChange}
              className="flex flex-wrap justify-start gap-2"
            >
              {AVAILABLE_SIZES.map((size) => (
                <ToggleGroupItem
                  key={size}
                  value={size}
                  className="h-9 min-w-10.5 cursor-pointer rounded-none text-xs font-semibold tracking-wider uppercase data-[state=on]:border-zinc-50 data-[state=on]:bg-zinc-900 data-[state=on]:text-zinc-50 dark:data-[state=on]:bg-zinc-50 dark:data-[state=on]:text-zinc-900"
                >
                  {size}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Sorting Section */}
        <AccordionItem value="sort" className="pb-3">
          <AccordionTrigger className="py-2 text-xs font-bold tracking-widest text-foreground uppercase hover:text-primary hover:no-underline">
            Sort By
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-1">
            <ToggleGroup
              type="single"
              value={selectedSort}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(val) => onSortChange((val || "") as any)}
              className="flex flex-col items-stretch gap-1"
            >
              {sortOptions.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  className="h-auto cursor-pointer justify-start rounded-none border-l-2 border-transparent px-2 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase hover:bg-muted/30 hover:text-foreground data-[state=on]:border-zinc-900 data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 dark:data-[state=on]:border-zinc-50 dark:data-[state=on]:bg-zinc-800 dark:data-[state=on]:text-zinc-50"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Reset Action */}
      <Button
        variant="outline"
        onClick={onReset}
        className="w-full cursor-pointer rounded-none py-5 text-xs font-semibold tracking-wider uppercase"
      >
        Clear Filters
      </Button>
    </div>
  )
}

export default ProductFilters
