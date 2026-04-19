import { useTransition, useCallback } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import { variantSchema } from "@/features/admin/validations"
import type { ProductDetail } from "@/types"
import type { VariantFormValues } from "@/features/admin/types"

export const useVariants = (
  activeProduct: ProductDetail | null,
  setActiveProduct: React.Dispatch<React.SetStateAction<ProductDetail | null>>,
  loadData: () => void
) => {
  const [isPending, startTransition] = useTransition()

  const variantForm = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema) as unknown as Resolver<VariantFormValues>,
    defaultValues: {
      size: "",
      color: "",
      color_hex: "",
      sku: "",
      stock: 0,
      additional_price: 0,
    },
  })

  const resetVariantForm = useCallback(() => {
    variantForm.reset({
      size: "",
      color: "",
      color_hex: "",
      sku: "",
      stock: 0,
      additional_price: 0,
    })
  }, [variantForm])

  const handleAddVariant = variantForm.handleSubmit(async (values) => {
    if (!activeProduct) return

    startTransition(async () => {
      const payload = {
        size: values.size.trim(),
        color: values.color?.trim() || "",
        color_hex: values.color_hex?.trim() || undefined,
        sku: values.sku.trim(),
        stock: values.stock,
        additional_price: values.additional_price,
        is_active: true,
      }

      try {
        const res = await adminApi.addVariant(activeProduct.id, payload)
        if (res.success && res.data) {
          toast.success("Variant appended successfully!")
          const updatedV = [...(activeProduct.variants || []), res.data]
          setActiveProduct((prev) =>
            prev ? { ...prev, variants: updatedV } : null
          )
          loadData()
          resetVariantForm()
        } else {
          toast.error(res.message || "Failed to append variant option.")
        }
      } catch {
        toast.error("Failed to append variant.")
      }
    })
  })

  const handleDeleteVariant = useCallback(
    async (variantId: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn("Are you sure you want to delete this variant?")) ||
        !activeProduct
      )
        return

      startTransition(async () => {
        try {
          const res = await adminApi.deleteVariant(activeProduct.id, variantId)
          if (res.success) {
            toast.success("Variant removed successfully!")
            const updatedV = (activeProduct.variants || []).filter(
              (v) => v.id !== variantId
            )
            setActiveProduct((prev) =>
              prev ? { ...prev, variants: updatedV } : null
            )
            loadData()
          } else {
            toast.error(res.message || "Failed to delete variant.")
          }
        } catch {
          toast.error("Failed to delete variant.")
        }
      })
    },
    [activeProduct, loadData, setActiveProduct]
  )

  return {
    isPending,
    variantForm,
    resetVariantForm,
    handleAddVariant,
    handleDeleteVariant,
  }
}
