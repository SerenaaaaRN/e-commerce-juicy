import type { CategoryFormValues, ProductFormValues } from "@/features/admin/types"
import { categorySchema, productSchema } from "@/features/admin/validations"
import { adminApi } from "@/lib/api/admin"
import type { CatalogProduct, Category, ProductDetail } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"

export const useProducts = () => {
  const queryClient = useQueryClient()

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await adminApi.getProducts({ admin: true, per_page: 9999 })
      if (!res.success) throw new Error(res.error?.message || "Failed to load products")
      return res.data as CatalogProduct[]
    },
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await adminApi.getCategories()
      if (!res.success) throw new Error(res.error?.message || "Failed to load categories")
      return res.data as Category[]
    },
  })

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<ProductDetail | null>(null)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

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
      parent_id: "",
      display_order: 1,
    },
  })

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
    (prod: CatalogProduct) => {
      setActiveProduct(prod as unknown as ProductDetail)
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

  const createProductMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await adminApi.createProduct(payload)
      if (!res.success) throw new Error(res.error?.message || "Failed to create product")
      return res.data
    },
    onSuccess: () => {
      toast.success("New product catalog created successfully!")
      setProductModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to catalog product.")
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const res = await adminApi.updateProduct(id, payload)
      if (!res.success) throw new Error(res.error?.message || "Failed to update product")
      return res.data
    },
    onSuccess: () => {
      toast.success("Product details modified successfully!")
      setProductModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update product details.")
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.deleteProduct(id)
      if (!res.success) throw new Error(res.error?.message || "Failed to delete product")
    },
    onSuccess: () => {
      toast.success("Product catalogue removed successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete product catalog.")
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: async (payload: Omit<Category, "id">) => {
      const res = await adminApi.createCategory(payload)
      if (!res.success) throw new Error(res.error?.message || "Failed to create category")
      return res.data
    },
    onSuccess: () => {
      toast.success("Category created successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
      categoryForm.reset({
        name: "",
        slug: "",
        description: "",
        parent_id: "",
        display_order: 1,
      })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create category.")
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Omit<Category, "id"> }) => {
      const res = await adminApi.updateCategory(id, payload)
      if (!res.success) throw new Error(res.error?.message || "Failed to update category")
      return res.data
    },
    onSuccess: () => {
      toast.success("Category updated successfully!")
      setEditingCategory(null)
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update category.")
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.deleteCategory(id)
      if (!res.success) throw new Error(res.error?.message || "Failed to delete category")
    },
    onSuccess: () => {
      toast.success("Category removed successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to remove category.")
    },
  })

  const handleProductSubmit = productForm.handleSubmit(async (values) => {
    const parsedTags = values.tags
      ? values.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
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
      updateProductMutation.mutate({ id: activeProduct.id, payload })
    } else {
      createProductMutation.mutate(payload)
    }
  })

  const handleDeleteProduct = useCallback(
    async (id: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn(
          "Are you sure you want to permanently delete this product catalogue? This action is irreversible."
        ))
      )
        return
      deleteProductMutation.mutate(id)
    },
    [deleteProductMutation]
  )

  const handleCategorySubmit = categoryForm.handleSubmit(async (values) => {
    const payload: Omit<Category, "id"> = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description?.trim() || undefined,
      parent_id: values.parent_id || null,
      is_active: true,
      display_order: values.display_order,
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, payload })
    } else {
      createCategoryMutation.mutate(payload)
    }
  })

  const handleOpenEditCategory = useCallback(
    (cat: Category) => {
      setEditingCategory(cat)
      categoryForm.reset({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        parent_id: cat.parent_id || "",
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
      parent_id: "",
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
      deleteCategoryMutation.mutate(id)
    },
    [deleteCategoryMutation]
  )

  const isPending =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    deleteProductMutation.isPending ||
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    deleteCategoryMutation.isPending

  return {
    products,
    categories,
    loading: productsLoading || categoriesLoading,
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
  }
}
