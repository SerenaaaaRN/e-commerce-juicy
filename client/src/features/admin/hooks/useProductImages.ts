import { adminApi } from "@/lib/api/admin"
import type { ProductDetail } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export const useProductImages = (
  activeProduct: ProductDetail | null,
  setActiveProduct: React.Dispatch<React.SetStateAction<ProductDetail | null>>
) => {
  const queryClient = useQueryClient()
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [imageUrlInput, setImageUrlInput] = useState("")

  const refetchProduct = useCallback(
    async (productId: string) => {
      const res = await adminApi.getProductByID(productId)
      if (res.success && res.data) {
        setActiveProduct(res.data)
      }
    },
    [setActiveProduct]
  )

  const uploadMutation = useMutation({
    mutationFn: async ({ productId, formData }: { productId: string; formData: FormData }) => {
      const res = await adminApi.uploadProductImages(productId, formData)
      if (!res.success) throw new Error(res.error?.message || "Failed to upload images")
      return res.data
    },
    onSuccess: (_data, { productId }) => {
      toast.success("Images uploaded successfully!")
      refetchProduct(productId)
      setSelectedFiles(null)
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to upload product images.")
    },
  })

  const addUrlMutation = useMutation({
    mutationFn: async ({ productId, imageUrl }: { productId: string; imageUrl: string }) => {
      const res = await adminApi.addProductImageUrl(productId, imageUrl)
      if (!res.success) throw new Error(res.error?.message || "Failed to add image URL")
      return res.data
    },
    onSuccess: (_data, { productId }) => {
      toast.success("Image URL added successfully!")
      refetchProduct(productId)
      setImageUrlInput("")
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to add product image URL.")
    },
  })

  const setPrimaryMutation = useMutation({
    mutationFn: async ({ productId, imageId }: { productId: string; imageId: string }) => {
      const res = await adminApi.setPrimaryImage(productId, imageId)
      if (!res.success) throw new Error(res.error?.message || "Failed to set primary image")
    },
    onMutate: async ({ imageId }) => {
      setActiveProduct((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          images: (prev.images || []).map((img) => ({ ...img, is_primary: img.id === imageId })),
        }
      })
    },
    onSuccess: () => {
      toast.success("Cover image modified successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to set cover image.")
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: async ({ productId, imageId }: { productId: string; imageId: string }) => {
      const res = await adminApi.deleteProductImage(productId, imageId)
      if (!res.success) throw new Error(res.error?.message || "Failed to delete image")
    },
    onMutate: async ({ imageId }) => {
      setActiveProduct((prev) => {
        if (!prev) return prev
        return { ...prev, images: (prev.images || []).filter((img) => img.id !== imageId) }
      })
    },
    onSuccess: () => {
      toast.success("Image asset deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["admin-products"] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete image asset.")
    },
  })

  const handleImageUploadSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!selectedFiles || selectedFiles.length === 0 || !activeProduct) return
      const formData = new FormData()
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("images", selectedFiles[i])
      }
      uploadMutation.mutate({ productId: activeProduct.id, formData })
    },
    [selectedFiles, activeProduct, uploadMutation]
  )

  const handleSetPrimaryImage = useCallback(
    async (imageId: string) => {
      if (!activeProduct) return
      setPrimaryMutation.mutate({ productId: activeProduct.id, imageId })
    },
    [activeProduct, setPrimaryMutation]
  )

  const handleDeleteImage = useCallback(
    async (imageId: string, confirmFn: (msg: string) => Promise<boolean>) => {
      if (!(await confirmFn("Are you sure you want to delete this image asset?")) || !activeProduct) return
      deleteImageMutation.mutate({ productId: activeProduct.id, imageId })
    },
    [activeProduct, deleteImageMutation]
  )

  const handleImageUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!imageUrlInput.trim() || !activeProduct) return
      addUrlMutation.mutate({ productId: activeProduct.id, imageUrl: imageUrlInput.trim() })
    },
    [imageUrlInput, activeProduct, addUrlMutation]
  )

  return {
    isPending:
      uploadMutation.isPending ||
      addUrlMutation.isPending ||
      setPrimaryMutation.isPending ||
      deleteImageMutation.isPending,
    selectedFiles,
    setSelectedFiles,
    imageUrlInput,
    setImageUrlInput,
    handleImageUploadSubmit,
    handleImageUrlSubmit,
    handleSetPrimaryImage,
    handleDeleteImage,
  }
}
