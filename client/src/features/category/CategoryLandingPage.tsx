import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useCategoriesQuery, useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { useMemo } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { CategoryHero } from "./components/CategoryHero"
import { CategoryProducts } from "./components/CategoryProducts"
import { CategoryPromoBanner } from "./components/CategoryPromoBanner"
import { SubcategoryGrid } from "./components/SubcategoryGrid"

export const CategoryLandingPage = () => {
  const { slug } = useParams({ from: "/_public/category/$slug" })
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoriesQuery()

  useProductsQuery(slug ? { category: slug, per_page: 8 } : undefined)

  const category = useMemo(() => {
    if (!slug || categories.length === 0) return null

    const findCat = (cats: typeof categories): (typeof categories)[0] | null => {
      for (const c of cats) {
        if (c.slug === slug) return c
        if (c.children) {
          const found = findCat(c.children)
          if (found) return found
        }
      }
      return null
    }
    return findCat(categories)
  }, [slug, categories])

  const subcategories = useMemo(() => {
    return category?.children || []
  }, [category])

  if (!slug) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Kategori tidak ditemukan.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/shop">Kembali ke Shop</Link>
        </Button>
      </div>
    )
  }

  if (isCategoriesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Kategori "{slug}" tidak ditemukan.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/shop">Kembali ke Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full animate-in flex-col duration-500 fade-in">
      <CategoryHero category={category} />
      <SubcategoryGrid subcategories={subcategories} />
      <CategoryProducts slug={slug} categoryName={category.name} />
      <CategoryPromoBanner category={category} />
    </div>
  )
}

export default CategoryLandingPage
