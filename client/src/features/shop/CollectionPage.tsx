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
import { useShallow } from "zustand/shallow"
import { HugeiconsIcon } from "@hugeicons/react"
import { FilterIcon } from "@hugeicons/core-free-icons"

export const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, meta, isLoading, fetchCategories, fetchProducts } = useProductStore(
    useShallow((s) => ({
      products: s.products,
      categories: s.categories,
      meta: s.meta,
      isLoading: s.isLoading,
      fetchCategories: s.fetchCategories,
      fetchProducts: s.fetchProducts,
    }))
  )

  const [cols, setCols] = useState<2 | 4>(4)
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
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
            true
          )

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
  }, [
    isInfiniteScroll,
    meta,
    isLoading,
    searchParams,
    setSearchParams,
    fetchProducts,
    currentCategory,
    currentSort,
    currentSizesStr,
    currentSearch,
  ])

  const updateParams = (newParams: Record<string, string | number | null>) => {
    const updated = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        updated.delete(key)
      } else {
        updated.set(key, String(val))
      }
    })

    if (
      newParams.category !== undefined ||
      newParams.sort !== undefined ||
      newParams.sizes !== undefined ||
      newParams.search !== undefined
    ) {
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
        <header className="flex flex-col gap-2 text-left">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Atelier Curated Catalog</span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground uppercase">The Shop</h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Browse our complete collection of pure raw textures and high-fashion silhouettes.
          </p>
        </header>

        <Separator className="my-8" />

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
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
          <main className="col-span-12 flex flex-col gap-6 lg:col-span-9">
            {/* Search results banner if active */}
            {currentSearch ? (
              <Alert className="mb-2 flex animate-in items-center justify-between rounded-none border border-primary/20 bg-primary/5 px-4 py-3 text-left duration-300 fade-in slide-in-from-top-1">
                <AlertDescription className="text-xs font-semibold text-foreground">
                  Search Results for: <span className="text-primary italic">"{currentSearch}"</span>
                </AlertDescription>
                <button
                  onClick={() => updateParams({ search: null, page: 1 })}
                  className="cursor-pointer text-[10px] font-bold tracking-wider text-muted-foreground uppercase hover:text-foreground"
                >
                  Clear Search
                </button>
              </Alert>
            ) : null}

            {/* Toolbar row */}
            <div className="flex flex-col justify-between gap-4 rounded-none border border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center">
              <span className="text-left text-xs font-medium text-muted-foreground">
                Showing {products.length} of {meta?.total || products.length} Silhouettes
              </span>

              {/* Toolbar Controls */}
              <div className="flex flex-wrap items-center justify-end gap-4">
                {/* Grid columns toggle */}
                <div className="hidden items-center gap-1.5 border-r border-border pr-4 sm:flex">
                  <span className="mr-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Grid:
                  </span>
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
                      className="h-7 cursor-pointer rounded-none px-2.5 text-[10px] font-bold tracking-wider uppercase"
                    >
                      2 Cols
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="4"
                      className="h-7 cursor-pointer rounded-none px-2.5 text-[10px] font-bold tracking-wider uppercase"
                    >
                      4 Cols
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Scroll Mode Toggle */}
                <div className="flex items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Mode:
                  </span>
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
                      className="h-7 cursor-pointer rounded-none px-2.5 text-[10px] font-bold tracking-wider uppercase"
                    >
                      Pages
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="scroll"
                      className="h-7 cursor-pointer rounded-none px-2.5 text-[10px] font-bold tracking-wider uppercase"
                    >
                      Scroll
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Mobile filter drawer trigger */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 cursor-pointer gap-2 rounded-none text-[10px] tracking-wider uppercase"
                      >
                        <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} data-icon="inline-start" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Catalog Filters</SheetTitle>
                      </SheetHeader>
                      <div className="h-full overflow-y-auto pt-6 pb-10">
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
              <div ref={sentinelRef} className="flex h-10 w-full items-center justify-center">
                {isLoading && <Spinner size={20} className="text-primary" />}
              </div>
            )}

            {/* Pagination Controls */}
            {!isInfiniteScroll && meta && meta.total_pages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {/* Previous button */}
                  {meta.page > 1 && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious onClick={() => handlePageChange(meta.page - 1)} />
                    </PaginationItem>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: meta.total_pages }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <PaginationItem key={pageNum} className="cursor-pointer">
                        <PaginationLink isActive={meta.page === pageNum} onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {/* Next button */}
                  {meta.page < meta.total_pages && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
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
