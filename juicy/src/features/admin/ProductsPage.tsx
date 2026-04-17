import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { adminApi } from "@/lib/api/admin"
import { formatPrice } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  Edit01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Category, ProductDetail, ProductVariant, ProductImage } from "@/types"

// Fallback lists for offline sandbox demos
const fallbackCategories: Category[] = [
  { id: "1", name: "Cold-Pressed Juice", slug: "cold-pressed-juice", display_order: 1, is_active: true },
  { id: "2", name: "Wellness Shots", slug: "wellness-shots", display_order: 2, is_active: true },
  { id: "3", name: "Elixirs & Tonics", slug: "elixirs-tonics", display_order: 3, is_active: true },
]

const fallbackProducts: ProductDetail[] = [
  {
    id: "1",
    category_id: "1",
    name: "Crimson Beet Cleanse",
    slug: "crimson-beet-cleanse",
    description: "A highly restorative blend of organic red beetroots, fresh green apples, and sweet lemon juice. Packed with raw antioxidants and earthy vitamins.",
    price: 48000,
    compare_at_price: 55000,
    is_available: true,
    is_featured: true,
    tags: ["Antioxidant", "Detox"],
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: fallbackCategories[0],
    images: [
      { id: "img1", product_id: "1", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200", cloudinary_public_id: "mock1", display_order: 1, is_primary: true, created_at: new Date().toISOString() }
    ],
    variants: [
      { id: "v1", product_id: "1", size: "250ml", color: "Beet Red", color_hex: "#8b0000", sku: "JUICE-BEET-250", stock: 45, additional_price: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: "v2", product_id: "1", size: "500ml", color: "Beet Red", color_hex: "#8b0000", sku: "JUICE-BEET-500", stock: 12, additional_price: 18000, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ],
    avg_rating: 4.9,
    review_count: 24
  },
  {
    id: "2",
    category_id: "2",
    name: "Golden Ginger Defense",
    slug: "golden-ginger-defense",
    description: "An intense immunity booster shot containing pure extracted raw ginger root, sweet organic turmeric, black pepper blend, and fresh honey notes.",
    price: 32000,
    is_available: true,
    is_featured: false,
    tags: ["Immunity", "Spicy"],
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: fallbackCategories[1],
    images: [],
    variants: [
      { id: "v3", product_id: "2", size: "60ml", color: "Turmeric Yellow", color_hex: "#ffd700", sku: "SHOT-GING-60", stock: 80, additional_price: 0, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ],
    avg_rating: 4.7,
    review_count: 12
  }
]

export const ProductsPage = () => {
  // Page Lists States
  const [products, setProducts] = useState<ProductDetail[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Filters state
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Modals & Drawers trigger states
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<ProductDetail | null>(null) // null = Add mode
  const [variantsModalOpen, setVariantsModalOpen] = useState(false)
  const [imagesModalOpen, setImagesModalOpen] = useState(false)

  // Product Form states
  const [formName, setFormName] = useState("")
  const [formSlug, setFormSlug] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formCategoryId, setFormCategoryId] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formComparePrice, setFormComparePrice] = useState("")
  const [formIsAvailable, setFormIsAvailable] = useState(true)
  const [formIsFeatured, setFormIsFeatured] = useState(false)
  const [formTags, setFormTags] = useState("")
  const [formDisplayOrder, setFormDisplayOrder] = useState("10")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submittingProduct, setSubmittingProduct] = useState(false)

  // Variant Form states
  const [varSize, setVarSize] = useState("")
  const [varColor, setVarColor] = useState("")
  const [varColorHex, setVarColorHex] = useState("")
  const [varSku, setVarSku] = useState("")
  const [varStock, setVarStock] = useState("")
  const [varAddPrice, setVarAddPrice] = useState("")
  const [varErrors, setVarErrors] = useState<Record<string, string>>({})
  const [submittingVariant, setSubmittingVariant] = useState(false)

  // Image Upload states
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  // Category Form states
  const [catName, setCatName] = useState("")
  const [catSlug, setCatSlug] = useState("")
  const [catDesc, setCatDesc] = useState("")
  const [catOrder, setCatOrder] = useState("1")
  const [catErrors, setCatErrors] = useState<Record<string, string>>({})
  const [submittingCategory, setSubmittingCategory] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts(),
        adminApi.getCategories(),
      ])

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data)
      } else {
        setProducts(fallbackProducts)
        setUsingFallback(true)
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data)
      } else {
        setCategories(fallbackCategories)
        setUsingFallback(true)
      }
    } catch {
      setProducts(fallbackProducts)
      setCategories(fallbackCategories)
      setUsingFallback(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          adminApi.getProducts(),
          adminApi.getCategories(),
        ])

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data)
        } else {
          setProducts(fallbackProducts)
          setUsingFallback(true)
        }

        if (catRes.success && catRes.data) {
          setCategories(catRes.data)
        } else {
          setCategories(fallbackCategories)
          setUsingFallback(true)
        }
      } catch {
        setProducts(fallbackProducts)
        setCategories(fallbackCategories)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  // Handle open Add Product Modal
  const handleOpenAddProduct = () => {
    setActiveProduct(null)
    setFormName("")
    setFormSlug("")
    setFormDescription("")
    setFormCategoryId(categories[0]?.id || "")
    setFormPrice("")
    setFormComparePrice("")
    setFormIsAvailable(true)
    setFormIsFeatured(false)
    setFormTags("")
    setFormDisplayOrder("10")
    setFormErrors({})
    setProductModalOpen(true)
  }

  // Handle open Edit Product Modal
  const handleOpenEditProduct = (prod: ProductDetail) => {
    setActiveProduct(prod)
    setFormName(prod.name)
    setFormSlug(prod.slug)
    setFormDescription(prod.description || "")
    setFormCategoryId(prod.category_id)
    setFormPrice(prod.price.toString())
    setFormComparePrice(prod.compare_at_price?.toString() || "")
    setFormIsAvailable(prod.is_available)
    setFormIsFeatured(prod.is_featured)
    setFormTags(prod.tags?.join(", ") || "")
    setFormDisplayOrder(prod.display_order.toString())
    setFormErrors({})
    setProductModalOpen(true)
  }

  // Validate Product Form
  const validateProduct = () => {
    const errs: Record<string, string> = {}
    if (!formName.trim()) errs.name = "Product name is required"
    if (!formSlug.trim()) errs.slug = "Product slug is required"
    if (!formPrice.trim() || isNaN(Number(formPrice)) || Number(formPrice) <= 0) {
      errs.price = "Valid base price is required"
    }
    if (!formCategoryId) errs.category = "Category assignment is required"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Submit Product Add/Edit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateProduct()) return

    setSubmittingProduct(true)
    try {
      const formData = new FormData()
      formData.append("name", formName.trim())
      formData.append("slug", formSlug.trim())
      formData.append("description", formDescription.trim())
      formData.append("category_id", formCategoryId)
      formData.append("price", Number(formPrice).toString())
      if (formComparePrice) {
        formData.append("compare_at_price", Number(formComparePrice).toString())
      }
      formData.append("is_available", formIsAvailable ? "true" : "false")
      formData.append("is_featured", formIsFeatured ? "true" : "false")
      formData.append("display_order", Number(formDisplayOrder).toString())
      
      const parsedTags = formTags.split(",").map(t => t.trim()).filter(Boolean)
      parsedTags.forEach(tag => formData.append("tags", tag))

      if (activeProduct) {
        // Edit mode
        if (usingFallback) {
          // Fallback mocking
          const updatedList = products.map((p) =>
            p.id === activeProduct.id
              ? {
                  ...p,
                  name: formName,
                  slug: formSlug,
                  description: formDescription,
                  category_id: formCategoryId,
                  price: Number(formPrice),
                  compare_at_price: formComparePrice ? Number(formComparePrice) : undefined,
                  is_available: formIsAvailable,
                  is_featured: formIsFeatured,
                  tags: parsedTags,
                  display_order: Number(formDisplayOrder),
                  category: categories.find((c) => c.id === formCategoryId)
                }
              : p
          )
          setProducts(updatedList)
          toast.success("Product details modified successfully (Mocked)")
          setProductModalOpen(false)
        } else {
          const res = await adminApi.updateProduct(activeProduct.id, formData)
          if (res.success) {
            toast.success("Product details modified successfully!")
            setProductModalOpen(false)
            loadData()
          } else {
            toast.error(res.message || "Failed to update product details.")
          }
        }
      } else {
        // Create mode
        if (usingFallback) {
          const mockNew: ProductDetail = {
            id: `prod_${Date.now()}`,
            category_id: formCategoryId,
            name: formName,
            slug: formSlug,
            description: formDescription,
            price: Number(formPrice),
            compare_at_price: formComparePrice ? Number(formComparePrice) : undefined,
            is_available: formIsAvailable,
            is_featured: formIsFeatured,
            tags: parsedTags,
            display_order: Number(formDisplayOrder),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: categories.find((c) => c.id === formCategoryId),
            images: [],
            variants: [],
            avg_rating: 0,
            review_count: 0
          }
          setProducts([mockNew, ...products])
          toast.success("Product created successfully (Mocked)")
          setProductModalOpen(false)
        } else {
          const res = await adminApi.createProduct(formData)
          if (res.success) {
            toast.success("New product catalog created successfully!")
            setProductModalOpen(false)
            loadData()
          } else {
            toast.error(res.message || "Failed to catalog product.")
          }
        }
      }
    } catch {
      toast.error("An error occurred during submission.")
    } finally {
      setSubmittingProduct(false)
    }
  }

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this product catalogue? This action is irreversible.")) return

    try {
      if (usingFallback) {
        setProducts(products.filter(p => p.id !== id))
        toast.success("Product catalogue removed successfully (Mocked)")
      } else {
        const res = await adminApi.deleteProduct(id)
        if (res.success) {
          toast.success("Product catalogue removed successfully!")
          loadData()
        } else {
          toast.error(res.message || "Failed to delete product catalog.")
        }
      }
    } catch {
      toast.error("Failed to delete catalog product.")
    }
  }

  // --- VARIANTS OPERATIONS ---
  const handleOpenVariantManager = (prod: ProductDetail) => {
    setActiveProduct(prod)
    setVarSize("")
    setVarColor("")
    setVarColorHex("")
    setVarSku("")
    setVarStock("")
    setVarAddPrice("")
    setVarErrors({})
    setVariantsModalOpen(true)
  }

  const validateVariant = () => {
    const errs: Record<string, string> = {}
    if (!varSize.trim()) errs.size = "Size identifier is required (e.g. 250ml)"
    if (!varSku.trim()) errs.sku = "Unique Stock Keeping Unit (SKU) is required"
    if (!varStock.trim() || isNaN(Number(varStock)) || Number(varStock) < 0) {
      errs.stock = "Valid non-negative stock quantity is required"
    }
    setVarErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateVariant() || !activeProduct) return

    setSubmittingVariant(true)
    const payload = {
      size: varSize.trim(),
      color: varColor.trim(),
      color_hex: varColorHex.trim() || undefined,
      sku: varSku.trim(),
      stock: Number(varStock),
      additional_price: varAddPrice ? Number(varAddPrice) : 0,
      is_active: true
    }

    try {
      if (usingFallback) {
        const mockV: ProductVariant = {
          id: `var_${Date.now()}`,
          product_id: activeProduct.id,
          size: payload.size,
          color: payload.color,
          color_hex: payload.color_hex,
          sku: payload.sku,
          stock: payload.stock,
          additional_price: payload.additional_price,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const updatedProds = products.map(p => {
          if (p.id === activeProduct.id) {
            const currentVariants = p.variants || []
            const updatedV = [...currentVariants, mockV]
            // Update active product reference
            setActiveProduct({ ...p, variants: updatedV })
            return { ...p, variants: updatedV }
          }
          return p
        })
        setProducts(updatedProds)
        toast.success("Variant created successfully (Mocked)")
        
        // Reset variant form
        setVarSize("")
        setVarColor("")
        setVarColorHex("")
        setVarSku("")
        setVarStock("")
        setVarAddPrice("")
      } else {
        const res = await adminApi.addVariant(activeProduct.id, payload)
        if (res.success && res.data) {
          toast.success("Variant appended successfully!")
          const updatedV = [...(activeProduct.variants || []), res.data]
          setActiveProduct({ ...activeProduct, variants: updatedV })
          
          // Refresh catalog list
          loadData()

          // Reset variant form
          setVarSize("")
          setVarColor("")
          setVarColorHex("")
          setVarSku("")
          setVarStock("")
          setVarAddPrice("")
        } else {
          toast.error(res.message || "Failed to append variant option.")
        }
      }
    } catch {
      toast.error("Failed to append variant.")
    } finally {
      setSubmittingVariant(false)
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (!window.confirm("Are you sure you want to delete this variant?") || !activeProduct) return

    try {
      if (usingFallback) {
        const updatedProds = products.map(p => {
          if (p.id === activeProduct.id) {
            const currentVariants = p.variants || []
            const updatedV = currentVariants.filter(v => v.id !== variantId)
            setActiveProduct({ ...p, variants: updatedV })
            return { ...p, variants: updatedV }
          }
          return p
        })
        setProducts(updatedProds)
        toast.success("Variant deleted successfully (Mocked)")
      } else {
        const res = await adminApi.deleteVariant(activeProduct.id, variantId)
        if (res.success) {
          toast.success("Variant removed successfully!")
          const updatedV = (activeProduct.variants || []).filter(v => v.id !== variantId)
          setActiveProduct({ ...activeProduct, variants: updatedV })
          loadData()
        } else {
          toast.error(res.message || "Failed to delete variant.")
        }
      }
    } catch {
      toast.error("Failed to delete variant.")
    }
  }

  // --- IMAGES OPERATIONS ---
  const handleOpenImageManager = (prod: ProductDetail) => {
    setActiveProduct(prod)
    setSelectedFiles(null)
    setImagesModalOpen(true)
  }

  const handleImageUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFiles || selectedFiles.length === 0 || !activeProduct) return

    setUploadingImages(true)
    const formData = new FormData()
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i])
    }

    try {
      if (usingFallback) {
        // Mock new image appended
        const mockImg: ProductImage = {
          id: `img_${Date.now()}`,
          product_id: activeProduct.id,
          image_url: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=200",
          cloudinary_public_id: `mock_${Date.now()}`,
          display_order: 10,
          is_primary: activeProduct.images && activeProduct.images.length === 0 ? true : false,
          created_at: new Date().toISOString()
        }

        const updatedProds = products.map(p => {
          if (p.id === activeProduct.id) {
            const currentImg = p.images || []
            const updatedI = [...currentImg, mockImg]
            setActiveProduct({ ...p, images: updatedI })
            return { ...p, images: updatedI }
          }
          return p
        })
        setProducts(updatedProds)
        toast.success("Images uploaded successfully (Mocked)")
        setSelectedFiles(null)
      } else {
        const res = await adminApi.uploadProductImages(activeProduct.id, formData)
        if (res.success && res.data) {
          toast.success("Images uploaded successfully!")
          setActiveProduct(res.data)
          loadData()
          setSelectedFiles(null)
        } else {
          toast.error(res.message || "Failed to upload image assets.")
        }
      }
    } catch {
      toast.error("Failed to upload product images.")
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!activeProduct) return
    try {
      if (usingFallback) {
        const updatedProds = products.map(p => {
          if (p.id === activeProduct.id) {
            const updatedI = (p.images || []).map(img => ({
              ...img,
              is_primary: img.id === imageId
            }))
            setActiveProduct({ ...p, images: updatedI })
            return { ...p, images: updatedI }
          }
          return p
        })
        setProducts(updatedProds)
        toast.success("Primary image set (Mocked)")
      } else {
        const res = await adminApi.setPrimaryImage(activeProduct.id, imageId)
        if (res.success) {
          toast.success("Cover image modified successfully!")
          const updatedI = (activeProduct.images || []).map(img => ({
            ...img,
            is_primary: img.id === imageId
          }))
          setActiveProduct({ ...activeProduct, images: updatedI })
          loadData()
        } else {
          toast.error(res.message || "Failed to set primary image.")
        }
      }
    } catch {
      toast.error("Failed to set cover image.")
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Are you sure you want to delete this image asset?") || !activeProduct) return
    try {
      if (usingFallback) {
        const updatedProds = products.map(p => {
          if (p.id === activeProduct.id) {
            const updatedI = (p.images || []).filter(img => img.id !== imageId)
            setActiveProduct({ ...p, images: updatedI })
            return { ...p, images: updatedI }
          }
          return p
        })
        setProducts(updatedProds)
        toast.success("Image asset deleted (Mocked)")
      } else {
        const res = await adminApi.deleteProductImage(activeProduct.id, imageId)
        if (res.success) {
          toast.success("Image asset deleted successfully!")
          const updatedI = (activeProduct.images || []).filter(img => img.id !== imageId)
          setActiveProduct({ ...activeProduct, images: updatedI })
          loadData()
        } else {
          toast.error(res.message || "Failed to delete image asset.")
        }
      }
    } catch {
      toast.error("Failed to delete image asset.")
    }
  }

  // --- CATEGORY OPERATIONS ---
  const validateCategory = () => {
    const errs: Record<string, string> = {}
    if (!catName.trim()) errs.name = "Category name is required"
    if (!catSlug.trim()) errs.slug = "Category slug is required"
    setCatErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCategory()) return

    setSubmittingCategory(true)
    const payload = {
      name: catName.trim(),
      slug: catSlug.trim(),
      description: catDesc.trim() || undefined,
      display_order: Number(catOrder) || 1,
    }

    try {
      if (usingFallback) {
        const mockC: Category = {
          id: `cat_${Date.now()}`,
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          display_order: payload.display_order,
          is_active: true
        }
        setCategories([...categories, mockC])
        toast.success("Category created successfully (Mocked)")
        setCatName("")
        setCatSlug("")
        setCatDesc("")
        setCatOrder("1")
      } else {
        const res = await adminApi.createCategory(payload)
        if (res.success && res.data) {
          toast.success("Category created successfully!")
          setCategories([...categories, res.data])
          setCatName("")
          setCatSlug("")
          setCatDesc("")
          setCatOrder("1")
        } else {
          toast.error(res.message || "Failed to create category.")
        }
      }
    } catch {
      toast.error("Failed to append category.")
    } finally {
      setSubmittingCategory(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this category? Product catalogs assigned to it may be affected.")) return
    try {
      if (usingFallback) {
        setCategories(categories.filter(c => c.id !== id))
        toast.success("Category deleted (Mocked)")
      } else {
        const res = await adminApi.deleteCategory(id)
        if (res.success) {
          toast.success("Category removed successfully!")
          loadData()
        } else {
          toast.error(res.message || "Failed to remove category.")
        }
      }
    } catch {
      toast.error("Failed to delete category.")
    }
  }

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">
            Loading Catalog inventory...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
            Inventory Console
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your boutique catalog products, category lists, variant stocks, and high-res media.
          </p>
        </div>
        <Button onClick={handleOpenAddProduct}>
          Add New Product
        </Button>
      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6 bg-muted/60 p-1">
          <TabsTrigger value="products" className="cursor-pointer">Products Inventory</TabsTrigger>
          <TabsTrigger value="categories" className="cursor-pointer">Categories & Slugs</TabsTrigger>
        </TabsList>

        {/* Tab 1: Products Catalogue grid */}
        <TabsContent value="products">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <HugeiconsIcon icon={SearchIcon} className="size-4" />
              </span>
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border/80 w-full"
              />
            </div>

            {/* Category selection */}
            <div className="w-full sm:max-w-xs">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Grid listing products */}
          <div className="border border-border/60 rounded-lg bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Image</TableHead>
                  <TableHead className="px-6 py-4">Product Details</TableHead>
                  <TableHead className="px-6 py-4">Category</TableHead>
                  <TableHead className="px-6 py-4">Price</TableHead>
                  <TableHead className="px-6 py-4">Badges</TableHead>
                  <TableHead className="px-6 py-4">Variants / Stocks</TableHead>
                  <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No catalog products matched your query.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((prod) => {
                    const primaryImage = prod.images?.find((img) => img.is_primary)?.image_url || "/placeholder-product.jpg"
                    const totalStock = prod.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0

                    return (
                      <TableRow key={prod.id}>
                        
                        {/* Image Thumbnail */}
                        <TableCell className="px-6 py-4">
                          <img
                            src={primaryImage}
                            alt={prod.name}
                            className="size-12 object-cover rounded bg-muted border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&q=80&w=200"
                            }}
                          />
                        </TableCell>

                        {/* Title and slug */}
                        <TableCell className="px-6 py-4">
                          <div className="font-semibold text-foreground">{prod.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">{prod.slug}</div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline">{prod.category?.name || "Unassigned"}</Badge>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="px-6 py-4 font-semibold text-foreground">
                          {formatPrice(prod.price)}
                          {prod.compare_at_price && (
                            <div className="text-[11px] text-muted-foreground line-through font-normal">
                              {formatPrice(prod.compare_at_price)}
                            </div>
                          )}
                        </TableCell>

                        {/* Badges */}
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-1.5 self-start items-start">
                            <Badge variant={prod.is_available ? "default" : "destructive"}>
                              {prod.is_available ? "Active" : "Archived"}
                            </Badge>
                            {prod.is_featured && (
                              <Badge variant="default">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Variant / Stocks */}
                        <TableCell className="px-6 py-4">
                          <Badge variant={totalStock === 0 ? "destructive" : totalStock <= 15 ? "secondary" : "default"}>
                            {totalStock} in stock
                          </Badge>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {prod.variants?.length || 0} active option(s)
                          </div>
                        </TableCell>

                        {/* Actions buttons */}
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="xs" onClick={() => handleOpenVariantManager(prod)} className="text-xs px-2.5 border hover:bg-muted font-medium">
                              Variants
                            </Button>
                            <Button variant="ghost" size="xs" onClick={() => handleOpenImageManager(prod)} className="text-xs px-2.5 border hover:bg-muted font-medium">
                              Media
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditProduct(prod)} className="hover:bg-muted">
                              <HugeiconsIcon icon={Edit01Icon} className="size-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(prod.id)} className="hover:bg-destructive/10 hover:text-destructive">
                              <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

        </TabsContent>

        {/* Tab 2: Categories Inventory Management */}
        <TabsContent value="categories">
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Category creation form */}
            <Card className="border border-border/60 bg-card shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Add New Category</CardTitle>
                <CardDescription className="text-xs">Create classifications to group organic juices & wellness products.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="flex flex-col gap-5 text-left">
                  
                  {/* Category Name */}
                  <Field data-invalid={!!catErrors.name}>
                    <FieldLabel htmlFor="catName">Category Name</FieldLabel>
                    <Input
                      id="catName"
                      value={catName}
                      onChange={(e) => {
                        setCatName(e.target.value)
                        if (catErrors.name) setCatErrors(prev => ({ ...prev, name: "" }))
                      }}
                      placeholder="e.g. Cleansing Tonics"
                      aria-invalid={!!catErrors.name}
                    />
                    {catErrors.name && <FieldError>{catErrors.name}</FieldError>}
                  </Field>

                  {/* Slug */}
                  <Field data-invalid={!!catErrors.slug}>
                    <FieldLabel htmlFor="catSlug">URL Slug</FieldLabel>
                    <Input
                      id="catSlug"
                      value={catSlug}
                      onChange={(e) => {
                        setCatSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, ""))
                        if (catErrors.slug) setCatErrors(prev => ({ ...prev, slug: "" }))
                      }}
                      placeholder="cleansing-tonics"
                      aria-invalid={!!catErrors.slug}
                    />
                    {catErrors.slug && <FieldError>{catErrors.slug}</FieldError>}
                  </Field>

                  {/* Description */}
                  <Field>
                    <FieldLabel htmlFor="catDesc">Description</FieldLabel>
                    <Textarea
                      id="catDesc"
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      placeholder="Brief details about the products in this category..."
                      rows={3}
                    />
                  </Field>

                  {/* Order */}
                  <Field>
                    <FieldLabel htmlFor="catOrder">Display Order</FieldLabel>
                    <Input
                      id="catOrder"
                      type="number"
                      value={catOrder}
                      onChange={(e) => setCatOrder(e.target.value)}
                      placeholder="1"
                    />
                  </Field>

                  {/* Submit Button */}
                  <Button type="submit" disabled={submittingCategory} className="w-full mt-2 font-medium">
                    {submittingCategory && <Spinner data-icon="inline-start" />}
                    {submittingCategory ? "Creating..." : "Save Classification"}
                  </Button>

                </form>
              </CardContent>
            </Card>

            {/* Category listing grid */}
            <div className="lg:col-span-2 border border-border/60 rounded-lg bg-card shadow-sm h-fit">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">Name</TableHead>
                    <TableHead className="px-6 py-4">Slug</TableHead>
                    <TableHead className="px-6 py-4">Description</TableHead>
                    <TableHead className="px-6 py-4">Display Order</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No categories currently defined.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.id}>
                        
                        {/* Name */}
                        <TableCell className="px-6 py-4 font-semibold text-foreground">
                          {cat.name}
                        </TableCell>

                        {/* Slug */}
                        <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {cat.slug}
                        </TableCell>

                        {/* Description */}
                        <TableCell className="px-6 py-4 max-w-xs truncate text-muted-foreground">
                          {cat.description || "-"}
                        </TableCell>

                        {/* Display Order */}
                        <TableCell className="px-6 py-4 font-medium text-foreground">
                          {cat.display_order}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat.id)} className="hover:bg-destructive/10 hover:text-destructive">
                            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

          </div>
        </TabsContent>
      </Tabs>

      {/* --- ADD/EDIT PRODUCT DIALOG --- */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-w-xl bg-card border overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">
              {activeProduct ? `Modify Catalogue: ${activeProduct.name}` : "Create New Product Catalog"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill out the basic information details below to compile your catalog entry.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProductSubmit} className="text-left py-4 flex flex-col gap-5">
            
            {/* Title Name */}
            <Field data-invalid={!!formErrors.name}>
              <FieldLabel htmlFor="formName">Product Title</FieldLabel>
              <Input
                id="formName"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value)
                  if (formErrors.name) setFormErrors(prev => ({ ...prev, name: "" }))
                  // Auto-generate slug on typing name in create mode
                  if (!activeProduct) {
                    setFormSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, ""))
                  }
                }}
                placeholder="e.g. Pure Earth Cleanser"
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
            </Field>

            {/* Slug URL */}
            <Field data-invalid={!!formErrors.slug}>
              <FieldLabel htmlFor="formSlug">Product Slug</FieldLabel>
              <Input
                id="formSlug"
                value={formSlug}
                onChange={(e) => {
                  setFormSlug(e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, ""))
                  if (formErrors.slug) setFormErrors(prev => ({ ...prev, slug: "" }))
                }}
                placeholder="pure-earth-cleanser"
                aria-invalid={!!formErrors.slug}
              />
              {formErrors.slug && <FieldError>{formErrors.slug}</FieldError>}
            </Field>

            {/* Category selection */}
            <Field data-invalid={!!formErrors.category}>
              <FieldLabel htmlFor="formCategoryId">Assign Category Classification</FieldLabel>
              <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                <SelectTrigger id="formCategoryId" className="w-full" aria-invalid={!!formErrors.category}>
                  <SelectValue placeholder="Choose Classification..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && <FieldError>{formErrors.category}</FieldError>}
            </Field>

            {/* Price Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Base Price */}
              <Field data-invalid={!!formErrors.price}>
                <FieldLabel htmlFor="formPrice">Base Retail Price (IDR)</FieldLabel>
                <Input
                  id="formPrice"
                  type="number"
                  value={formPrice}
                  onChange={(e) => {
                    setFormPrice(e.target.value)
                    if (formErrors.price) setFormErrors(prev => ({ ...prev, price: "" }))
                  }}
                  placeholder="45000"
                  aria-invalid={!!formErrors.price}
                />
                {formErrors.price && <FieldError>{formErrors.price}</FieldError>}
              </Field>

              {/* Compare Price */}
              <Field>
                <FieldLabel htmlFor="formComparePrice">Compare-At Price (IDR - Strikeout)</FieldLabel>
                <Input
                  id="formComparePrice"
                  type="number"
                  value={formComparePrice}
                  onChange={(e) => setFormComparePrice(e.target.value)}
                  placeholder="50000"
                />
              </Field>

            </div>

            {/* Tags and Order */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Tags */}
              <Field>
                <FieldLabel htmlFor="formTags">Tags (Comma Separated)</FieldLabel>
                <Input
                  id="formTags"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Detox, Organic, Immunity"
                />
              </Field>

              {/* Display Order */}
              <Field>
                <FieldLabel htmlFor="formDisplayOrder">Display Order (Sorting)</FieldLabel>
                <Input
                  id="formDisplayOrder"
                  type="number"
                  value={formDisplayOrder}
                  onChange={(e) => setFormDisplayOrder(e.target.value)}
                  placeholder="10"
                />
              </Field>

            </div>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="formDescription">Description</FieldLabel>
              <Textarea
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Write premium catalog details about ingredients, taste profile, and health benefits..."
                rows={4}
              />
            </Field>

            {/* Toggles */}
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
                <Checkbox checked={formIsAvailable} onCheckedChange={(c) => setFormIsAvailable(!!c)} />
                Is Available (Publish immediately)
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
                <Checkbox checked={formIsFeatured} onCheckedChange={(c) => setFormIsFeatured(!!c)} />
                Is Featured (Promote on frontpage)
              </label>
            </div>

            {/* Footer triggers */}
            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={submittingProduct}>
                {submittingProduct && <Spinner data-icon="inline-start" />}
                {submittingProduct ? "Saving catalogue..." : "Save Product Catalogue"}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

      {/* --- VARIANTS MANAGER DIALOG --- */}
      <Dialog open={variantsModalOpen} onOpenChange={setVariantsModalOpen}>
        <DialogContent className="max-w-3xl bg-card border overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">
              Manage Variants: {activeProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure variant options (Volume size, customized colors, localized SKU strings, stock values, and pricing offsets).
            </DialogDescription>
          </DialogHeader>

          {/* Core manager layout */}
          <div className="grid gap-6 md:grid-cols-2 text-left py-4">
            
            {/* Append Variant form */}
            <Card className="border border-border/80 bg-card/40 h-fit">
              <CardHeader className="p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Add New Variant option</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <form onSubmit={handleAddVariant} className="flex flex-col gap-4">
                  
                  {/* Variant Size */}
                  <Field data-invalid={!!varErrors.size}>
                    <FieldLabel htmlFor="varSize">Size (Volume/Dimension)</FieldLabel>
                    <Input
                      id="varSize"
                      value={varSize}
                      onChange={(e) => {
                        setVarSize(e.target.value)
                        if (varErrors.size) setVarErrors(prev => ({ ...prev, size: "" }))
                      }}
                      placeholder="e.g. 250ml or 500ml"
                      aria-invalid={!!varErrors.size}
                    />
                    {varErrors.size && <FieldError>{varErrors.size}</FieldError>}
                  </Field>

                  {/* Color & Color Hex */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="varColor">Color Name</FieldLabel>
                      <Input
                        id="varColor"
                        value={varColor}
                        onChange={(e) => setVarColor(e.target.value)}
                        placeholder="Beet Red"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="varColorHex">Color Hex Code</FieldLabel>
                      <Input
                        id="varColorHex"
                        value={varColorHex}
                        onChange={(e) => setVarColorHex(e.target.value)}
                        placeholder="#8b0000"
                      />
                    </Field>
                  </div>

                  {/* SKU */}
                  <Field data-invalid={!!varErrors.sku}>
                    <FieldLabel htmlFor="varSku">SKU Code</FieldLabel>
                    <Input
                      id="varSku"
                      value={varSku}
                      onChange={(e) => {
                        setVarSku(e.target.value)
                        if (varErrors.sku) setVarErrors(prev => ({ ...prev, sku: "" }))
                      }}
                      placeholder="JUICE-BEET-250"
                      aria-invalid={!!varErrors.sku}
                    />
                    {varErrors.sku && <FieldError>{varErrors.sku}</FieldError>}
                  </Field>

                  {/* Stock and additional price */}
                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={!!varErrors.stock}>
                      <FieldLabel htmlFor="varStock">Fulfillment Stock</FieldLabel>
                      <Input
                        id="varStock"
                        type="number"
                        value={varStock}
                        onChange={(e) => {
                          setVarStock(e.target.value)
                          if (varErrors.stock) setVarErrors(prev => ({ ...prev, stock: "" }))
                        }}
                        placeholder="100"
                        aria-invalid={!!varErrors.stock}
                      />
                      {varErrors.stock && <FieldError>{varErrors.stock}</FieldError>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="varAddPrice">Add. Price Offset (IDR)</FieldLabel>
                      <Input
                        id="varAddPrice"
                        type="number"
                        value={varAddPrice}
                        onChange={(e) => setVarAddPrice(e.target.value)}
                        placeholder="+15000"
                      />
                    </Field>
                  </div>

                  {/* Save option */}
                  <Button type="submit" disabled={submittingVariant} className="w-full mt-2 font-medium">
                    {submittingVariant && <Spinner data-icon="inline-start" />}
                    {submittingVariant ? "Appending..." : "Append Variant Option"}
                  </Button>

                </form>
              </CardContent>
            </Card>

            {/* Existing Variants list */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Variant Combinations</h3>
              <div className="flex flex-col gap-3 max-h-87.5 overflow-y-auto pr-1">
                {!activeProduct?.variants || activeProduct.variants.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                    No variant combinations constructed yet.
                  </div>
                ) : (
                  activeProduct.variants.map((v) => (
                    <div key={v.id} className="p-3 border rounded-lg bg-card flex items-center justify-between text-xs hover:border-primary transition-colors">
                      <div className="flex flex-col gap-1 items-start">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <span>{v.size}</span>
                          {v.color && (
                            <span className="flex items-center gap-1 font-normal text-muted-foreground">
                              • {v.color}
                              {v.color_hex && (
                                <span
                                  className="inline-block size-3 rounded-full border border-border"
                                  style={{ backgroundColor: v.color_hex }}
                                />
                              )}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">{v.sku}</div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-semibold">
                          <Badge variant="default">{v.stock} in stock</Badge>
                          <span className="text-primary">+{formatPrice(v.additional_price)} offset</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteVariant(v.id)} className="hover:bg-destructive/10 hover:text-destructive size-7">
                        <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <DialogFooter className="border-t border-border pt-4">
            <DialogClose asChild>
              <Button type="button">Close Manager</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MEDIA IMAGE MANAGER DIALOG --- */}
      <Dialog open={imagesModalOpen} onOpenChange={setImagesModalOpen}>
        <DialogContent className="max-w-2xl bg-card border overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading">
              Boutique Image Assets: {activeProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload multiple raw images directly to Cloudinary CDN, set primary listing catalog covers, or remove expired graphics assets.
            </DialogDescription>
          </DialogHeader>

          <div className="text-left py-4 flex flex-col gap-6">
            
            {/* Uploader section */}
            <form onSubmit={handleImageUploadSubmit} className="flex gap-4 items-end border p-4 rounded-lg bg-muted/10">
              <div className="flex-1 text-xs">
                <label className="block font-semibold mb-2 text-foreground">Select Multi-Images files to upload</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-xs file:font-semibold file:bg-card file:text-foreground hover:file:bg-muted cursor-pointer"
                />
              </div>
              <Button type="submit" disabled={uploadingImages || !selectedFiles}>
                {uploadingImages && <Spinner data-icon="inline-start" />}
                {uploadingImages ? "Uploading..." : "Upload Assets"}
              </Button>
            </form>

            {/* Thumbnail Grid display */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catalog Image Assets</h3>
              {!activeProduct?.images || activeProduct.images.length === 0 ? (
                <div className="text-center py-16 border border-dashed rounded-lg text-xs text-muted-foreground bg-muted/20">
                  No photographic graphics uploaded for this product yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {activeProduct.images.map((img) => (
                    <div key={img.id} className={cn(
                      "group relative border rounded-lg bg-card overflow-hidden flex flex-col items-center gap-2 p-2 hover:border-primary transition-colors",
                      img.is_primary ? "border-2 border-primary" : "border-border"
                    )}>
                      
                      {/* Image Frame */}
                      <img
                        src={img.image_url}
                        alt="Product option thumbnail"
                        className="h-28 w-full object-cover rounded bg-muted"
                      />

                      {/* Display info */}
                      {img.is_primary && (
                        <div className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded shadow">
                          Cover Cover
                        </div>
                      )}

                      {/* Action buttons panel */}
                      <div className="flex w-full items-center justify-between mt-1 pt-1.5 border-t border-border/60">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleSetPrimaryImage(img.id)}
                          disabled={img.is_primary}
                          className="text-[10px] p-1.5 h-auto"
                        >
                          Set Cover
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteImage(img.id)}
                          className="hover:bg-destructive/10 hover:text-destructive size-7"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                        </Button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <DialogFooter className="border-t border-border pt-4">
            <DialogClose asChild>
              <Button type="button">Close Gallery</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default ProductsPage
