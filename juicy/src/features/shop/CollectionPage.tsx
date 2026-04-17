import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"
import { ProductFilters } from "./components/ProductFilters"
import { ProductGrid } from "./components/ProductGrid"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"

export const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, meta, isLoading, fetchCategories, fetchProducts } = useProductStore()

  // Parse parameters from search params
  const currentCategory = searchParams.get("category") || ""
  const currentSort = (searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | "popular" | "") || ""
  const currentPage = Number(searchParams.get("page")) || 1
  const perPage = 6

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts({
      category: currentCategory || undefined,
      sort: currentSort || undefined,
      page: currentPage,
      per_page: perPage,
    })
  }, [fetchProducts, currentCategory, currentSort, currentPage])

  // Helper to update query params
  const updateParams = (newParams: Record<string, string | number | null>) => {
    const updated = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        updated.delete(key)
      } else {
        updated.set(key, String(val))
      }
    })
    // Reset page to 1 on category/sort change
    if (newParams.category !== undefined || newParams.sort !== undefined) {
      updated.set("page", "1")
    }
    setSearchParams(updated)
  }

  const handleCategoryChange = (category: string) => {
    updateParams({ category })
  }

  const handleSortChange = (sort: "price_asc" | "price_desc" | "newest" | "popular" | "") => {
    updateParams({ sort })
  }

  const handlePageChange = (page: number) => {
    updateParams({ page })
  }

  const handleReset = () => {
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Typographic Header */}
        <div className="text-left flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Atelier Curated Catalog
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            The Shop
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Browse our complete collection of pure raw textures and high-fashion linen silhouettes.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <ProductFilters
              categories={categories}
              selectedCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
              selectedSort={currentSort}
              onSortChange={handleSortChange}
              onReset={handleReset}
            />
          </aside>

          {/* Main Grid Area */}
          <main className="col-span-12 lg:col-span-9 flex flex-col gap-8">
            
            {/* Toolbar row */}
            <div className="flex items-center justify-between bg-muted/40 px-4 py-3 border border-border rounded-md">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {products.length} of {meta?.total || products.length} Silhouettes
              </span>
              
              {/* Mobile filter drawer trigger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                      <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} data-icon="inline-start" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="sr-only">Catalog Filters</SheetTitle>
                    </SheetHeader>
                    <div className="pt-6">
                      <ProductFilters
                        categories={categories}
                        selectedCategory={currentCategory}
                        onCategoryChange={handleCategoryChange}
                        selectedSort={currentSort}
                        onSortChange={handleSortChange}
                        onReset={handleReset}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination Controls */}
            {meta && meta.total_pages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  
                  {/* Previous button */}
                  {meta.page > 1 && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious
                        onClick={() => handlePageChange(meta.page - 1)}
                      />
                    </PaginationItem>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: meta.total_pages }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <PaginationItem key={pageNum} className="cursor-pointer">
                        <PaginationLink
                          isActive={meta.page === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {/* Next button */}
                  {meta.page < meta.total_pages && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext
                        onClick={() => handlePageChange(meta.page + 1)}
                      />
                    </PaginationItem>
                  )}

                </PaginationContent>
              </Pagination>
            )}

          </main>

        </div>

      </div>
    </div>
  )
}

export default CollectionPage
