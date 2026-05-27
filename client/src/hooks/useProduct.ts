import { useMemo } from "react"
import { useShallow } from "zustand/shallow"
import { useProductStore } from "@/stores/productStore"

export const useProduct = () => {
  const store = useProductStore(
    useShallow((s) => ({
      products: s.products,
      featuredProducts: s.featuredProducts,
      categories: s.categories,
      currentProduct: s.currentProduct,
      isLoading: s.isLoading,
      error: s.error,
      meta: s.meta,
      fetchProducts: s.fetchProducts,
      fetchFeaturedProducts: s.fetchFeaturedProducts,
      fetchProductBySlug: s.fetchProductBySlug,
      clearCurrentProduct: s.clearCurrentProduct,
    }))
  )

  return useMemo(() => store, [store])
}

export default useProduct
