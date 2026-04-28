import { useProductStore } from "@/stores/productStore"
import { ProductCard } from "@/features/shop/components/ProductCard"
import { Spinner } from "@/components/ui/spinner"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

type CategoryProductsProps = {
  slug: string
  categoryName: string
}

export const CategoryProducts = ({ slug, categoryName }: CategoryProductsProps) => {
  const { products, isLoading } = useProductStore()

  if (isLoading && products.length === 0) {
    return (
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center py-12">
          <Spinner size={24} className="text-primary" />
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              Koleksi
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
              Produk {categoryName}
            </h2>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link to={`/shop?category=${slug}`}>
              Lihat Semua
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/shop?category=${slug}`}>
              Lihat Semua Produk {categoryName}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
