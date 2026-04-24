import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useProductStore } from "@/stores/productStore"
import { ProductFilters } from "./components/ProductFilters"
import { ProductGrid } from "./components/ProductGrid"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
import { cn } from "@/lib/utils"

export const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, meta, isLoading, fetchCategories, fetchProducts } = useProductStore()

  // Local toolbar preferences
  const [cols, setCols] = useState<2 | 4>(4)
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Parse parameters from search params
  const currentCategory = searchParams.get("category") || ""
  const currentSort = (searchParams.get("sort") as any) || ""
  const currentPage = Number(searchParams.get("page")) || 1
  const currentSizesStr = searchParams.get("sizes") || ""
  const currentSearch = searchParams.get("search") || ""
  const perPage = 8

  const currentSizes = currentSizesStr ? currentSizesStr.split(",") : []

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Sync main product fetching
  useEffect(() => {
    // If infinite scroll is on and page > 1, the IntersectionObserver sentinel handles fetching the next page,
    // so we skip this flat fetch to avoid replacing our accumulated list.
    if (isInfiniteScroll && currentPage > 1) {
      return
    }

    fetchProducts(
      {
        category: currentCategory || undefined,
        sort: currentSort || undefined,
        sizes: currentSizesStr || undefined,
        search: currentSearch || undefined,
        page: currentPage,
        per_page: perPage,
      },
      false
    )
  }, [fetchProducts, currentCategory, currentSort, currentSizesStr, currentSearch, currentPage, isInfiniteScroll])

  // Infinite Scroll sentinel observer
  useEffect(() => {
    if (!isInfiniteScroll || !meta || meta.page >= meta.total_pages) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          const nextPage = meta.page + 1

          fetchProducts(
            {
              category: currentCategory || undefined,
              sort: currentSort || undefined,
              sizes: currentSizesStr || undefined,
              search: currentSearch || undefined,
              page: nextPage,
              per_page: perPage,
            },
            true // append products
          )

          // Keep URL parameter in sync
          const updated = new URLSearchParams(searchParams)
          updated.set("page", String(nextPage))
          setSearchParams(updated, { replace: true })
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [isInfiniteScroll, meta, isLoading, searchParams, setSearchParams, fetchProducts, currentCategory, currentSort, currentSizesStr, currentSearch])

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
    // Reset page to 1 on category/sort/sizes change
    if (newParams.category !== undefined || newParams.sort !== undefined || newParams.sizes !== undefined || newParams.search !== undefined) {
      updated.set("page", "1")
    }
    setSearchParams(updated)
  }

  const handleCategoryChange = (category: string) => {
    updateParams({ category })
  }

  const handleSortChange = (sort: any) => {
    updateParams({ sort })
  }

  const handleSizesChange = (sizes: string[]) => {
    updateParams({ sizes: sizes.length > 0 ? sizes.join(",") : null })
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground uppercase">
            The Shop
          </h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Browse our complete collection of pure raw textures and high-fashion silhouettes.
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
              selectedSizes={currentSizes}
              onSizesChange={handleSizesChange}
              onReset={handleReset}
            />
          </aside>

          {/* Main Grid Area */}
          <main className="col-span-12 lg:col-span-9 flex flex-col gap-6">

            {/* Search results banner if active */}
            {currentSearch && (
              <Alert className="flex items-center justify-between bg-primary/5 px-4 py-3 border border-primary/20 rounded-none text-left mb-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertDescription className="text-xs text-foreground font-semibold">
                  Search Results for: <span className="text-primary italic">"{currentSearch}"</span>
                </AlertDescription>
                <button
                  onClick={() => updateParams({ search: null, page: 1 })}
                  className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear Search
                </button>
              </Alert>
            )}

            {/* Toolbar row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 px-4 py-3 border border-border rounded-none">
              <span className="text-xs text-muted-foreground font-medium text-left">
                Showing {products.length} of {meta?.total || products.length} Silhouettes
              </span>

              {/* Toolbar Controls */}
              <div className="flex items-center justify-end flex-wrap gap-4">
                {/* Grid columns toggle */}
                <div className="hidden sm:flex items-center gap-1.5 border-r border-border pr-4">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">Grid:</span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={cols.toString()}
                    onValueChange={(val) => {
                      if (val) setCols(Number(val) as 2 | 4)
                    }}
                    className="flex gap-1"
                  >
                    <ToggleGroupItem
                      value="2"
                      className="px-2.5 h-7 text-[10px] uppercase font-bold tracking-wider rounded-none cursor-pointer"
                    >
                      2 Cols
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="4"
                      className="px-2.5 h-7 text-[10px] uppercase font-bold tracking-wider rounded-none cursor-pointer"
                    >
                      4 Cols
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Scroll Mode Toggle */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">Mode:</span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    value={isInfiniteScroll ? "scroll" : "pages"}
                    onValueChange={(val) => {
                      if (val) {
                        setIsInfiniteScroll(val === "scroll")
                        updateParams({ page: 1 })
                      }
                    }}
                    className="flex gap-1"
                  >
                    <ToggleGroupItem
                      value="pages"
                      className="px-2.5 h-7 text-[10px] uppercase font-bold tracking-wider rounded-none cursor-pointer"
                    >
                      Pages
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="scroll"
                      className="px-2.5 h-7 text-[10px] uppercase font-bold tracking-wider rounded-none cursor-pointer"
                    >
                      Scroll
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Mobile filter drawer trigger */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 cursor-pointer h-7 text-[10px] uppercase tracking-wider rounded-none">
                        <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} className="size-3" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Catalog Filters</SheetTitle>
                      </SheetHeader>
                      <div className="pt-6 overflow-y-auto h-full pb-10">
                        <ProductFilters
                          categories={categories}
                          selectedCategory={currentCategory}
                          onCategoryChange={handleCategoryChange}
                          selectedSort={currentSort}
                          onSortChange={handleSortChange}
                          selectedSizes={currentSizes}
                          onSizesChange={handleSizesChange}
                          onReset={handleReset}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} cols={cols} />

            {/* Infinite Scroll Sentinel indicator */}
            {isInfiniteScroll && (
              <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center">
                {isLoading && (
                  <Spinner size={20} className="text-primary" />
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!isInfiniteScroll && meta && meta.total_pages > 1 && (
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
