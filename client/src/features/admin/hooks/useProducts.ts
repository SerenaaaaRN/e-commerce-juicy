import { useEffect, useState, useTransition, useCallback } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import { productSchema, categorySchema } from "@/features/admin/validations"
import type { Category, ProductDetail } from "@/types"
import type { ProductFormValues, CategoryFormValues } from "@/features/admin/types"

export const useProducts = () => {
  const [products, setProducts] = useState<ProductDetail[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<ProductDetail | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Cast schemas through Resolver type to handle Zod number/coercion input type divergence smoothly
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category_id: "",
      price: 0,
      compare_at_price: undefined,
      is_available: true,
      is_featured: false,
      tags: "",
      display_order: 10,
    },
  })

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      display_order: 1,
    },
  })

  const loadData = useCallback(async (shouldTriggerLoader = false) => {
    if (shouldTriggerLoader) setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts({ admin: true, per_page: 9999 }),
        adminApi.getCategories(),
      ])

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data)
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data)
      }
    } catch {
      // silent fail
    } finally {
      if (shouldTriggerLoader) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(true)
  }, [loadData])

  const handleOpenAddProduct = useCallback(() => {
    setActiveProduct(null)
    productForm.reset({
      name: "",
      slug: "",
      description: "",
      category_id: categories[0]?.id || "",
      price: 0,
      compare_at_price: undefined,
      is_available: true,
      is_featured: false,
      tags: "",
      display_order: 10,
    })
    setProductModalOpen(true)
  }, [categories, productForm])

  const handleOpenEditProduct = useCallback(
    (prod: ProductDetail) => {
      setActiveProduct(prod)
      productForm.reset({
        name: prod.name,
        slug: prod.slug,
        description: prod.description || "",
        category_id: prod.category_id,
        price: prod.price,
        compare_at_price: prod.compare_at_price || undefined,
        is_available: prod.is_available,
        is_featured: prod.is_featured,
        tags: prod.tags?.join(", ") || "",
        display_order: prod.display_order,
      })
      setProductModalOpen(true)
    },
    [productForm]
  )

  const handleProductSubmit = productForm.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        const parsedTags = values.tags
          ? values.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : []
        const payload: Record<string, unknown> = {
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description?.trim() || "",
          category_id: values.category_id,
          price: values.price,
          is_available: values.is_available,
          is_featured: values.is_featured,
          display_order: values.display_order,
          tags: parsedTags,
        }
        if (values.compare_at_price !== undefined && !isNaN(values.compare_at_price) && values.compare_at_price > 0) {
          payload.compare_at_price = values.compare_at_price
        }

        if (activeProduct) {
          const res = await adminApi.updateProduct(activeProduct.id, payload)
          if (res.success) {
            toast.success("Product details modified successfully!")
            setProductModalOpen(false)
            loadData()
          } else {
            toast.error(res.message || "Failed to update product details.")
          }
        } else {
          const res = await adminApi.createProduct(payload)
          if (res.success) {
            toast.success("New product catalog created successfully!")
            setProductModalOpen(false)
            loadData()
          } else {
            toast.error(res.message || "Failed to catalog product.")
          }
        }
      } catch {
        toast.error("An error occurred during submission.")
      }
    })
  })

  const handleDeleteProduct = useCallback(
    async (id: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn(
          "Are you sure you want to permanently delete this product catalogue? This action is irreversible."
        ))
      )
        return

      try {
        const res = await adminApi.deleteProduct(id)
        if (res.success) {
          toast.success("Product catalogue removed successfully!")
          startTransition(() => loadData())
        } else {
          toast.error(res.message || "Failed to delete product catalog.")
        }
      } catch (err) {
        const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message || err.message : "Failed to delete catalog product."
        toast.error(msg)
      }
    },
    [loadData]
  )

  const handleCategorySubmit = categoryForm.handleSubmit(async (values) => {
    startTransition(async () => {
      const payload = {
        name: values.name.trim(),
        slug: values.slug.trim(),
        description: values.description?.trim() || undefined,
        display_order: values.display_order,
      }

      try {
        if (editingCategory) {
          const res = await adminApi.updateCategory(editingCategory.id, payload)
          if (res.success) {
            toast.success("Category updated successfully!")
            setEditingCategory(null)
            loadData()
          } else {
            toast.error(res.message || "Failed to update category.")
          }
        } else {
          const res = await adminApi.createCategory(payload)
          if (res.success && res.data) {
            toast.success("Category created successfully!")
            setCategories((curr) => [...curr, res.data])
          } else {
            toast.error(res.message || "Failed to create category.")
          }
        }
        if (!editingCategory) {
          categoryForm.reset({
            name: "",
            slug: "",
            description: "",
            display_order: 1,
          })
        }
      } catch {
        toast.error(editingCategory ? "Failed to update category." : "Failed to append category.")
      }
    })
  })

  const handleOpenEditCategory = useCallback(
    (cat: Category) => {
      setEditingCategory(cat)
      categoryForm.reset({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        display_order: cat.display_order,
      })
    },
    [categoryForm]
  )

  const handleCancelEditCategory = useCallback(() => {
    setEditingCategory(null)
    categoryForm.reset({
      name: "",
      slug: "",
      description: "",
      display_order: 1,
    })
  }, [categoryForm])

  const handleDeleteCategory = useCallback(
    async (id: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn(
          "Are you sure you want to permanently delete this category? Product catalogs assigned to it may be affected."
        ))
      )
        return

      try {
        const res = await adminApi.deleteCategory(id)
        if (res.success) {
          toast.success("Category removed successfully!")
          startTransition(() => loadData())
        } else {
          toast.error(res.message || "Failed to remove category.")
        }
      } catch (err) {
        const msg = axios.isAxiosError(err) ? err.response?.data?.error?.message || err.message : "Failed to delete category."
        toast.error(msg)
      }
    },
    [loadData]
  )

  return {
    products,
    categories,
    loading,
    isPending,
    productModalOpen,
    setProductModalOpen,
    activeProduct,
    setActiveProduct,
    categoryFilter,
    setCategoryFilter,
    productForm,
    categoryForm,
    editingCategory,
    handleOpenAddProduct,
    handleOpenEditProduct,
    handleProductSubmit,
    handleDeleteProduct,
    handleCategorySubmit,
    handleOpenEditCategory,
    handleCancelEditCategory,
    handleDeleteCategory,
    loadData,
  }
}
