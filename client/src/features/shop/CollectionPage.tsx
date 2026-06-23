import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useCategoriesQuery, useInfiniteProductsQuery, useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { FilterIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ProductFilters } from "./components/ProductFilters"
import { ProductGrid } from "./components/ProductGrid"
import type { SortOption } from "./types"

export const CollectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentSort = (searchParams.get("sort") as SortOption) || ""
  const currentPage = Number(searchParams.get("page")) || 1
  const currentSizesStr = searchParams.get("sizes") || ""
  const currentSearch = searchParams.get("search") || ""
  const perPage = 8

  const currentSizes = currentSizesStr ? currentSizesStr.split(",") : []

  const [cols, setCols] = useState<2 | 4>(4)
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const queryParams = {
    category: currentCategory || undefined,
    sort: currentSort || undefined,
    sizes: currentSizesStr || undefined,
    search: currentSearch || undefined,
    page: currentPage,
    per_page: perPage,
  }

  const { data: categoriesData } = useCategoriesQuery()
  const { data: productsData, isLoading: isPaginationLoading } = useProductsQuery(queryParams, {
    enabled: !isInfiniteScroll,
  })

  const infiniteQuery = useInfiniteProductsQuery({
    category: currentCategory || undefined,
    sort: currentSort || undefined,
    sizes: currentSizesStr || undefined,
    search: currentSearch || undefined,
    per_page: perPage,
  })

  const products = isInfiniteScroll
    ? (infiniteQuery.data?.pages.flatMap((p) => p.products) ?? [])
    : (productsData?.products ?? [])
  const meta = isInfiniteScroll
    ? (infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1]?.meta ?? null)
    : (productsData?.meta ?? null)
  const categories = categoriesData ?? []
  const isLoading = isInfiniteScroll ? infiniteQuery.isLoading && products.length === 0 : isPaginationLoading

  const handleObserver = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!isInfiniteScroll) return

    if (handleObserver.current) {
      handleObserver.current.disconnect()
    }

    handleObserver.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
          infiniteQuery.fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      handleObserver.current.observe(sentinelRef.current)
    }

    return () => {
      handleObserver.current?.disconnect()
    }
  }, [isInfiniteScroll, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage, infiniteQuery.fetchNextPage])

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

  const handleSortChange = (sort: SortOption) => {
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
    <div className="bg-background">
      {/* Hero Banner — full width */}
      <header className="relative mb-12 flex flex-col items-center justify-center overflow-hidden py-24 text-center lg:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/shop-hero-luxury-fashion-collection.jpg"
            alt="Luxury Fashion Collection"
            className="size-full object-cover dark:brightness-50"
          />
          <div className="absolute inset-0 bg-background/20" />
        </div>

        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="mb-4 text-xs tracking-[0.2em] text-foreground uppercase drop-shadow-sm">
            Atelier Curated Catalog
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-foreground drop-shadow-sm lg:text-5xl">
            The Collection
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed tracking-wide text-foreground drop-shadow-sm">
            Browse our complete collection of pure raw textures and high-fashion silhouettes.
          </p>
        </div>
      </header>

      <div className="container mx-auto my-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Content Layout: stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:w-1/4">
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
          <section className="flex flex-col gap-6 lg:w-3/4">
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
            <Card
              size="sm"
              className="flex-col gap-2 rounded-none border border-border bg-muted px-4 py-3 ring-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3"
            >
              <span className="text-left text-xs font-medium text-muted-foreground">
                Showing {products.length} of {meta?.total || products.length} Silhouettes
              </span>

              {/* Toolbar Controls */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-3">
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
                <div className="flex items-center gap-1">
                  <span className="hidden text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:mr-1 sm:inline">
                    Mode:
                  </span>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    size="sm"
                    value={isInfiniteScroll ? "scroll" : "pages"}
                    onValueChange={(val) => {
                      if (val) {
                        setIsInfiniteScroll(val === "scroll")
                        updateParams({ page: 1 })
                      }
                    }}
                    className="flex gap-0.5"
                  >
                    <ToggleGroupItem
                      value="pages"
                      className="h-6 cursor-pointer rounded-none px-2 text-[10px] font-bold tracking-wider uppercase"
                    >
                      Pages
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="scroll"
                      className="h-6 cursor-pointer rounded-none px-2 text-[10px] font-bold tracking-wider uppercase"
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
                        className="h-6 cursor-pointer gap-1 rounded-none text-[10px] tracking-wider uppercase"
                      >
                        <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} data-icon="inline-start" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="sr-only">Catalog Filters</SheetTitle>
                      </SheetHeader>
                      <div className="h-full overflow-y-auto px-4 pt-6 pb-10">
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
            </Card>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} cols={cols} />

            {/* Infinite Scroll Sentinel indicator */}
            {isInfiniteScroll && (
              <div ref={sentinelRef} className="flex h-10 w-full items-center justify-center">
                {infiniteQuery.isFetchingNextPage && <Spinner size={20} className="text-primary" />}
              </div>
            )}

            {/* Pagination Controls */}
            {!isInfiniteScroll && meta && meta.total_pages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent className="flex-wrap">
                  {meta.page > 1 && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious onClick={() => handlePageChange(meta.page - 1)} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: meta.total_pages })
                    .map((_, i) => i + 1)
                    .filter((pageNum) => {
                      const total = meta.total_pages
                      const current = meta.page
                      return pageNum === 1 || pageNum === total || (pageNum >= current - 1 && pageNum <= current + 1)
                    })
                    .reduce<(number | "...")[]>((acc, pageNum, idx, arr) => {
                      if (idx > 0 && arr[idx - 1] !== pageNum - 1) {
                        acc.push("...")
                      }
                      acc.push(pageNum)
                      return acc
                    }, [])
                    .map((item) =>
                      item === "..." ? (
                        <PaginationItem key={`ellipsis-${Math.random()}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item} className="cursor-pointer">
                          <PaginationLink isActive={meta.page === item} onClick={() => handlePageChange(item)}>
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                  {meta.page < meta.total_pages && (
                    <PaginationItem className="cursor-pointer">
                      <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
