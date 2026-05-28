import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { useCategoriesQuery, useProductsQuery } from "@/features/shop/hooks/useProductQueries"
import { CategoryHero } from "./components/CategoryHero"
import { SubcategoryGrid } from "./components/SubcategoryGrid"
import { CategoryProducts } from "./components/CategoryProducts"
import { CategoryPromoBanner } from "./components/CategoryPromoBanner"
import { CategoryInfo } from "./components/CategoryInfo"
import { RecentlyViewedSection } from "@/features/home/components/RecentlyViewedSection"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export const CategoryLandingPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: categories = [] } = useCategoriesQuery()
  const { data: productsData, isLoading } = useProductsQuery(
    slug ? { category: slug, per_page: 8 } : undefined
  )

  const category = useMemo(() => {
    if (!slug || categories.length === 0) return null

    const findCat = (cats: typeof categories): typeof categories[0] | null => {
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
          <Link to={ROUTES.shop}>Kembali ke Shop</Link>
        </Button>
      </div>
    )
  }

  if (isLoading && !category) {
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
          <Link to={ROUTES.shop}>Kembali ke Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      <CategoryHero category={category} />
      <SubcategoryGrid subcategories={subcategories} />
      <CategoryProducts slug={slug} categoryName={category.name} />
      <CategoryPromoBanner category={category} />
      <CategoryInfo category={category} />
      <RecentlyViewedSection />
    </div>
  )
}

export default CategoryLandingPage
