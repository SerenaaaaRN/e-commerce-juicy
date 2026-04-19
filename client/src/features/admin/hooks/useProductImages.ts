import { useState, useTransition, useCallback } from "react"
import { adminApi } from "@/lib/api/admin"
import { toast } from "sonner"
import type { ProductDetail } from "@/types"

export const useProductImages = (
  activeProduct: ProductDetail | null,
  setActiveProduct: React.Dispatch<React.SetStateAction<ProductDetail | null>>,
  loadData: () => void
) => {
  const [isPending, startTransition] = useTransition()
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const handleImageUploadSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedFiles || selectedFiles.length === 0 || !activeProduct) return

      startTransition(async () => {
        const formData = new FormData()
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("images", selectedFiles[i])
        }

        try {
          const res = await adminApi.uploadProductImages(
            activeProduct.id,
            formData
          )
          if (res.success && res.data) {
            toast.success("Images uploaded successfully!")
            setActiveProduct(res.data)
            loadData()
            setSelectedFiles(null)
          } else {
            toast.error(res.message || "Failed to upload image assets.")
          }
        } catch {
          toast.error("Failed to upload product images.")
        }
      })
    },
    [selectedFiles, activeProduct, setActiveProduct, loadData]
  )

  const handleSetPrimaryImage = useCallback(
    async (imageId: string) => {
      if (!activeProduct) return
      startTransition(async () => {
        try {
          const res = await adminApi.setPrimaryImage(activeProduct.id, imageId)
          if (res.success) {
            toast.success("Cover image modified successfully!")
            const updatedI = (activeProduct.images || []).map((img) => ({
              ...img,
              is_primary: img.id === imageId,
            }))
            setActiveProduct((prev) =>
              prev ? { ...prev, images: updatedI } : null
            )
            loadData()
          } else {
            toast.error(res.message || "Failed to set primary image.")
          }
        } catch {
          toast.error("Failed to set cover image.")
        }
      })
    },
    [activeProduct, setActiveProduct, loadData]
  )

  const handleDeleteImage = useCallback(
    async (imageId: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (
        !(await confirmFn(
          "Are you sure you want to delete this image asset?"
        )) ||
        !activeProduct
      )
        return
      startTransition(async () => {
        try {
          const res = await adminApi.deleteProductImage(activeProduct.id, imageId)
          if (res.success) {
            toast.success("Image asset deleted successfully!")
            const updatedI = (activeProduct.images || []).filter(
              (img) => img.id !== imageId
            )
            setActiveProduct((prev) =>
              prev ? { ...prev, images: updatedI } : null
            )
            loadData()
          } else {
            toast.error(res.message || "Failed to delete image asset.")
          }
        } catch {
          toast.error("Failed to delete image asset.")
        }
      })
    },
    [activeProduct, setActiveProduct, loadData]
  )

  return {
    isPending,
    selectedFiles,
    setSelectedFiles,
    handleImageUploadSubmit,
    handleSetPrimaryImage,
    handleDeleteImage,
  }
}
