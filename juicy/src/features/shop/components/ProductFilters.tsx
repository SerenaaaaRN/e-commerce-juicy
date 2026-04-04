import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Category } from "@/types"

type ProductFiltersProps = {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedSort: "price_asc" | "price_desc" | "newest" | "popular" | ""
  onSortChange: (sort: "price_asc" | "price_desc" | "newest" | "popular" | "") => void
  onReset: () => void
}

export const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  onReset,
}: ProductFiltersProps) => {
  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Category Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase text-foreground">
          Categories
        </h3>
        <Separator />
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectedCategory}
          onValueChange={(val) => onCategoryChange(val || "")}
          className="flex flex-col gap-2 items-stretch"
        >
          <ToggleGroupItem
            value=""
            className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Apparel
          </ToggleGroupItem>
          {categories.map((cat) => (
            <ToggleGroupItem
              key={cat.id}
              value={cat.slug}
              className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {cat.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sorting Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase text-foreground">
          Sort By
        </h3>
        <Separator />
        <ToggleGroup
          type="single"
          variant="outline"
          value={selectedSort}
          onValueChange={(val) => onSortChange((val as "price_asc" | "price_desc" | "newest" | "popular" | "") || "")}
          className="flex flex-col gap-2 items-stretch"
        >
          <ToggleGroupItem
            value="newest"
            className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            New Arrivals
          </ToggleGroupItem>
          <ToggleGroupItem
            value="price_asc"
            className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Price: Low to High
          </ToggleGroupItem>
          <ToggleGroupItem
            value="price_desc"
            className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Price: High to Low
          </ToggleGroupItem>
          <ToggleGroupItem
            value="popular"
            className="justify-start uppercase tracking-widest text-[10px] py-4 h-auto cursor-pointer rounded-none border-none hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Popularity
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Reset Action */}
      <Button
        variant="outline"
        onClick={onReset}
        className="uppercase tracking-widest text-[10px] py-5 h-auto cursor-pointer transition-transform hover:scale-[1.01] rounded-none mt-2"
      >
        Clear Filters
      </Button>

    </div>
  )
}

export default ProductFilters
