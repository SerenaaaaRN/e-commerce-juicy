import type { VariantFormValues } from "@/features/admin/types"
import { variantSchema } from "@/features/admin/validations"
import { adminApi } from "@/lib/api/admin"
import type { ProductDetail, ProductVariant } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { toast } from "sonner"

export const useVariants = (
  activeProduct: ProductDetail | null,
  setActiveProduct: React.Dispatch<React.SetStateAction<ProductDetail | null>>
) => {
  const queryClient = useQueryClient()
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)

  const { isLoading: isLoadingVariants } = useQuery({
    queryKey: ["admin-product-variants", activeProduct?.id],
    queryFn: async () => {
      if (!activeProduct) throw new Error("No active product")
      const res = await adminApi.getVariants(activeProduct.id)
      if (!res.success) throw new Error(res.error?.message || "Failed to load variants")
      setActiveProduct((prev) =>
        prev && prev.id === activeProduct.id ? { ...prev, variants: res.data as ProductVariant[] } : prev
      )
      return res.data as ProductVariant[]
    },
    enabled: !!activeProduct && !activeProduct.variants,
  })

  const variantForm = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema) as unknown as Resolver<VariantFormValues>,
    defaultValues: {
      size: "",
      color: "",
      stock: 0,
      additional_price: 0,
    },
  })

  const resetVariantForm = useCallback(() => {
    setEditingVariant(null)
    variantForm.reset({
      size: "",
      color: "",
      stock: 0,
      additional_price: 0,
    })
  }, [variantForm])

  const handleOpenEditVariant = useCallback(
    (variant: ProductVariant) => {
      setEditingVariant(variant)
      variantForm.reset({
        size: variant.size,
        color: variant.color || "",
        stock: variant.stock,
        additional_price: variant.additional_price,
      })
    },
    [variantForm]
  )

  const handleCancelEditVariant = useCallback(() => {
    resetVariantForm()
  }, [resetVariantForm])

  const saveMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
      payload,
    }: {
      productId: string
      variantId?: string
      payload: Omit<ProductVariant, "id" | "product_id" | "created_at" | "updated_at">
    }) => {
      const res = variantId
        ? await adminApi.updateVariant(productId, variantId, payload)
        : await adminApi.addVariant(productId, payload)
      if (!res.success) throw new Error(res.error?.message || "Failed to save variant")
      return res.data as ProductVariant
    },
    onSuccess: (data, { variantId, productId }) => {
      if (variantId) {
        toast.success("Variant updated successfully!")
        setActiveProduct((prev) => {
          if (!prev || prev.id !== productId) return prev
          return {
            ...prev,
            variants: (prev.variants || []).map((v) => (v.id === variantId ? data : v)),
          }
        })
      } else {
        toast.success("Variant appended successfully!")
        setActiveProduct((prev) => {
          if (!prev || prev.id !== productId) return prev
          return { ...prev, variants: [...(prev.variants || []), data] }
        })
      }
      resetVariantForm()
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err, { variantId }) => {
      toast.error(
        err instanceof Error ? err.message : variantId ? "Failed to update variant." : "Failed to append variant."
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ productId, variantId }: { productId: string; variantId: string }) => {
      const res = await adminApi.deleteVariant(productId, variantId)
      if (!res.success) throw new Error(res.error?.message || "Failed to delete variant")
    },
    onSuccess: (_data, { productId, variantId }) => {
      toast.success("Variant removed successfully!")
      setActiveProduct((prev) => {
        if (!prev || prev.id !== productId) return prev
        return { ...prev, variants: (prev.variants || []).filter((v) => v.id !== variantId) }
      })
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete variant.")
    },
  })

  const handleAddVariant = variantForm.handleSubmit(async (values) => {
    if (!activeProduct) return
    const payload = {
      size: values.size.trim(),
      color: values.color?.trim() || "",
      stock: values.stock,
      additional_price: values.additional_price,
      is_active: true,
    }
    saveMutation.mutate({
      productId: activeProduct.id,
      variantId: editingVariant?.id,
      payload,
    })
  })

  const handleDeleteVariant = useCallback(
    async (variantId: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (!(await confirmFn("Are you sure you want to delete this variant?")) || !activeProduct) return
      deleteMutation.mutate({ productId: activeProduct.id, variantId })
    },
    [activeProduct, deleteMutation]
  )

  return {
    isPending: saveMutation.isPending || deleteMutation.isPending,
    isLoadingVariants,
    variantForm,
    editingVariant,
    resetVariantForm,
    handleAddVariant,
    handleDeleteVariant,
    handleOpenEditVariant,
    handleCancelEditVariant,
  }
}
