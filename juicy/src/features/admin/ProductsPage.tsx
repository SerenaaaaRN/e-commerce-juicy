import { useEffect, useState, useTransition } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
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
import { useConfirm } from "@/hooks/useConfirm"
import { useDataTableFilter } from "@/features/admin/hook/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import type {
  Category,
  ProductDetail,
} from "@/types"

// Zod schemas for form validations
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category assignment is required"),
  price: z.coerce.number().positive("Valid base price is required"),
  compare_at_price: z.coerce.number().optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  tags: z.string().optional(),
  display_order: z.coerce.number().default(10),
})

const variantSchema = z.object({
  size: z.string().min(1, "Size identifier is required (e.g. 250ml)"),
  color: z.string().optional(),
  color_hex: z.string().optional(),
  sku: z.string().min(1, "Unique SKU is required"),
  stock: z.coerce.number().min(0, "Valid non-negative stock quantity is required"),
  additional_price: z.coerce.number().default(0),
})

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().optional(),
  display_order: z.coerce.number().default(1),
})

type ProductFormValues = {
  name: string
  slug: string
  description?: string
  category_id: string
  price: number
  compare_at_price?: number
  is_available: boolean
  is_featured: boolean
  tags?: string
  display_order: number
}

type VariantFormValues = {
  size: string
  color?: string
  color_hex?: string
  sku: string
  stock: number
  additional_price: number
}

type CategoryFormValues = {
  name: string
  slug: string
  description?: string
  display_order: number
}

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductDetail[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const {
    search,
    setSearch,
    filteredData: searchFilteredProducts,
    isStale,
  } = useDataTableFilter(products, (p, searchLower) =>
    p.name.toLowerCase().includes(searchLower) ||
    p.slug.toLowerCase().includes(searchLower)
  )
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<ProductDetail | null>(null)
  const [variantsModalOpen, setVariantsModalOpen] = useState(false)
  const [imagesModalOpen, setImagesModalOpen] = useState(false)

  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // React Hook Form setups
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

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as unknown as Resolver<CategoryFormValues>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      display_order: 1,
    },
  })

  const loadData = async (shouldTriggerLoader = false) => {
    if (shouldTriggerLoader) setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getProducts(),
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
  }

  useEffect(() => {
    loadData(true)
  }, [])

  const handleOpenAddProduct = () => {
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
  }

  const handleOpenEditProduct = (prod: ProductDetail) => {
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
  }

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

  const handleDeleteProduct = async (id: string) => {
    if (
      !(await confirmDelete(
        "Are you sure you want to permanently delete this product catalogue? This action is irreversible."
      ))
    )
      return

    startTransition(async () => {
      try {
        const res = await adminApi.deleteProduct(id)
        if (res.success) {
          toast.success("Product catalogue removed successfully!")
          loadData()
        } else {
          toast.error(res.message || "Failed to delete product catalog.")
        }
      } catch {
        toast.error("Failed to delete catalog product.")
      }
    })
  }

  const handleOpenVariantManager = (prod: ProductDetail) => {
    setActiveProduct(prod)
    variantForm.reset({
      size: "",
      color: "",
      color_hex: "",
      sku: "",
      stock: 0,
      additional_price: 0,
    })
    setVariantsModalOpen(true)
  }

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
          variantForm.reset({
            size: "",
            color: "",
            color_hex: "",
            sku: "",
            stock: 0,
            additional_price: 0,
          })
        } else {
          toast.error(res.message || "Failed to append variant option.")
        }
      } catch {
        toast.error("Failed to append variant.")
      }
    })
  })

  const handleDeleteVariant = async (variantId: string) => {
    if (
      !(await confirmDelete("Are you sure you want to delete this variant?")) ||
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
  }

  const handleOpenImageManager = (prod: ProductDetail) => {
    setActiveProduct(prod)
    setSelectedFiles(null)
    setImagesModalOpen(true)
  }

  const handleImageUploadSubmit = async (e: React.FormEvent) => {
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
  }

  const handleSetPrimaryImage = async (imageId: string) => {
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
  }

  const handleDeleteImage = async (imageId: string) => {
    if (
      !(await confirmDelete(
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
  }

  const handleCategorySubmit = categoryForm.handleSubmit(async (values) => {
    startTransition(async () => {
      const payload = {
        name: values.name.trim(),
        slug: values.slug.trim(),
        description: values.description?.trim() || undefined,
        display_order: values.display_order,
      }

      try {
        const res = await adminApi.createCategory(payload)
        if (res.success && res.data) {
          toast.success("Category created successfully!")
          setCategories((curr) => [...curr, res.data])
          categoryForm.reset({
            name: "",
            slug: "",
            description: "",
            display_order: 1,
          })
        } else {
          toast.error(res.message || "Failed to create category.")
        }
      } catch {
        toast.error("Failed to append category.")
      }
    })
  })

  const handleDeleteCategory = async (id: string) => {
    if (
      !(await confirmDelete(
        "Are you sure you want to permanently delete this category? Product catalogs assigned to it may be affected."
      ))
    )
      return
    startTransition(async () => {
      try {
        const res = await adminApi.deleteCategory(id)
        if (res.success) {
          toast.success("Category removed successfully!")
          loadData()
        } else {
          toast.error(res.message || "Failed to remove category.")
        }
      } catch {
        toast.error("Failed to delete category.")
      }
    })
  }

  const filteredProducts = searchFilteredProducts.filter((p) =>
    categoryFilter === "all" || p.category_id === categoryFilter
  )

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Spinner className="size-8 text-primary" />
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Loading Catalog inventory...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Inventory Console"
        description="Manage your boutique catalog products, category lists, variant stocks, and high-res media."
        action={<Button onClick={handleOpenAddProduct}>Add New Product</Button>}
      />

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6 bg-muted/60 p-1">
          <TabsTrigger value="products" className="cursor-pointer">
            Products Inventory
          </TabsTrigger>
          <TabsTrigger value="categories" className="cursor-pointer">
            Categories & Slugs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative w-full sm:max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <HugeiconsIcon icon={SearchIcon} className="size-4" />
              </span>
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-border/80 bg-card pl-9"
              />
            </div>

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

          <DefferedContainer
            isStale={isStale}
            className="rounded-lg border border-border/60 bg-card shadow-sm"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Image</TableHead>
                  <TableHead className="px-6 py-4">Product Details</TableHead>
                  <TableHead className="px-6 py-4">Category</TableHead>
                  <TableHead className="px-6 py-4">Price</TableHead>
                  <TableHead className="px-6 py-4">Badges</TableHead>
                  <TableHead className="px-6 py-4">Variants / Stocks</TableHead>
                  <TableHead className="px-6 py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <EmptyState message="No catalog products matched your query." />
                ) : (
                  filteredProducts.map((prod) => {
                    const primaryImage =
                      prod.images?.find((img) => img.is_primary)?.image_url ||
                      "/placeholder-product.svg"
                    const totalStock =
                      prod.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0

                    return (
                      <TableRow key={prod.id}>
                        <TableCell className="px-6 py-4">
                          <img
                            src={primaryImage}
                            alt={prod.name}
                            className="size-12 rounded border bg-muted object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "/placeholder-product.svg"
                            }}
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {prod.name}
                          </div>
                          <div className="max-w-xs truncate font-mono text-[11px] text-muted-foreground">
                            {prod.slug}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="outline">
                            {prod.category?.name || "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="Richmond-font px-6 py-4 font-semibold text-foreground">
                          {formatPrice(prod.price)}
                          {prod.compare_at_price && (
                            <div className="text-[11px] font-normal text-muted-foreground line-through">
                              {formatPrice(prod.compare_at_price)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1.5 self-start">
                            <Badge
                              variant={
                                prod.is_available ? "default" : "destructive"
                              }
                            >
                              {prod.is_available ? "Active" : "Archived"}
                            </Badge>
                            {prod.is_featured && (
                              <Badge variant="default">Featured</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            variant={
                              totalStock === 0
                                ? "destructive"
                                : totalStock <= 15
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {totalStock} in stock
                          </Badge>
                          <div className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                            {prod.variants?.length || 0} active option(s)
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleOpenVariantManager(prod)}
                              className="border px-2.5 text-xs font-medium hover:bg-muted"
                            >
                              Variants
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleOpenImageManager(prod)}
                              className="border px-2.5 text-xs font-medium hover:bg-muted"
                            >
                              Media
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="hover:bg-muted"
                            >
                              <HugeiconsIcon
                                icon={Edit01Icon}
                                className="size-4 text-muted-foreground"
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isPending}
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="size-4"
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </DefferedContainer>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="h-fit border border-border/60 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold tracking-wider text-foreground uppercase">
                  Add New Category
                </CardTitle>
                <CardDescription className="text-xs">
                  Create classifications to group organic juices & wellness
                  products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleCategorySubmit}
                  className="flex flex-col gap-5 text-left"
                >
                  <Field data-invalid={!!categoryForm.formState.errors.name}>
                    <FieldLabel htmlFor="catName">Category Name</FieldLabel>
                    <Input
                      id="catName"
                      {...categoryForm.register("name", {
                        onChange: (e) => {
                          categoryForm.setValue(
                            "slug",
                            e.target.value
                              .toLowerCase()
                              .replace(/ /g, "-")
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                      })}
                      placeholder="e.g. Cleansing Tonics"
                    />
                    {categoryForm.formState.errors.name && (
                      <FieldError>{categoryForm.formState.errors.name.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!categoryForm.formState.errors.slug}>
                    <FieldLabel htmlFor="catSlug">URL Slug</FieldLabel>
                    <Input
                      id="catSlug"
                      {...categoryForm.register("slug", {
                        onChange: (e) => {
                          categoryForm.setValue(
                            "slug",
                            e.target.value
                              .toLowerCase()
                              .replace(/ /g, "-")
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                      })}
                      placeholder="cleansing-tonics"
                    />
                    {categoryForm.formState.errors.slug && (
                      <FieldError>{categoryForm.formState.errors.slug.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="catDesc">Description</FieldLabel>
                    <Textarea
                      id="catDesc"
                      {...categoryForm.register("description")}
                      placeholder="Brief details about the products in this category..."
                      rows={3}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="catOrder">Display Order</FieldLabel>
                    <Input
                      id="catOrder"
                      type="number"
                      {...categoryForm.register("display_order")}
                      placeholder="1"
                    />
                  </Field>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full font-medium"
                  >
                    {isPending && <Spinner data-icon="inline-start" />}
                    {isPending ? "Creating..." : "Save Classification"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="h-fit rounded-lg border border-border/60 bg-card shadow-sm lg:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">Name</TableHead>
                    <TableHead className="px-6 py-4">Slug</TableHead>
                    <TableHead className="px-6 py-4">Description</TableHead>
                    <TableHead className="px-6 py-4">Display Order</TableHead>
                    <TableHead className="px-6 py-4 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <EmptyState message="No categories currently defined." colSpan={5} />
                  ) : (
                    categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell className="px-6 py-4 font-semibold text-foreground">
                          {cat.name}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {cat.slug}
                        </TableCell>
                        <TableCell className="max-w-xs truncate px-6 py-4 text-muted-foreground">
                          {cat.description || "-"}
                        </TableCell>
                        <TableCell className="px-6 py-4 font-medium text-foreground">
                          {cat.display_order}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              className="size-4"
                            />
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

      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              {activeProduct
                ? `Modify Catalogue: ${activeProduct.name}`
                : "Create New Product Catalog"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill out the basic information details below to compile your
              catalog entry.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleProductSubmit}
            className="flex flex-col gap-5 py-4 text-left"
          >
            <Field data-invalid={!!productForm.formState.errors.name}>
              <FieldLabel htmlFor="formName">Product Title</FieldLabel>
              <Input
                id="formName"
                {...productForm.register("name", {
                  onChange: (e) => {
                    if (!activeProduct) {
                      productForm.setValue(
                        "slug",
                        e.target.value
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                      )
                    }
                  }
                })}
                placeholder="e.g. Pure Earth Cleanser"
              />
              {productForm.formState.errors.name && (
                <FieldError>{productForm.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!productForm.formState.errors.slug}>
              <FieldLabel htmlFor="formSlug">Product Slug</FieldLabel>
              <Input
                id="formSlug"
                {...productForm.register("slug", {
                  onChange: (e) => {
                    productForm.setValue(
                      "slug",
                      e.target.value
                        .toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                })}
                placeholder="pure-earth-cleanser"
              />
              {productForm.formState.errors.slug && (
                <FieldError>{productForm.formState.errors.slug.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!productForm.formState.errors.category_id}>
              <FieldLabel htmlFor="formCategoryId">
                Assign Category Classification
              </FieldLabel>
              <Select
                value={productForm.watch("category_id")}
                onValueChange={(val) => productForm.setValue("category_id", val)}
              >
                <SelectTrigger id="formCategoryId" className="w-full">
                  <SelectValue placeholder="Choose Classification..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {productForm.formState.errors.category_id && (
                <FieldError>{productForm.formState.errors.category_id.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!productForm.formState.errors.price}>
                <FieldLabel htmlFor="formPrice">
                  Base Retail Price (IDR)
                </FieldLabel>
                <Input
                  id="formPrice"
                  type="number"
                  {...productForm.register("price")}
                  placeholder="45000"
                />
                {productForm.formState.errors.price && (
                  <FieldError>{productForm.formState.errors.price.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="formComparePrice">
                  Compare-At Price (IDR - Strikeout)
                </FieldLabel>
                <Input
                  id="formComparePrice"
                  type="number"
                  {...productForm.register("compare_at_price")}
                  placeholder="50000"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="formTags">
                  Tags (Comma Separated)
                </FieldLabel>
                <Input
                  id="formTags"
                  {...productForm.register("tags")}
                  placeholder="Detox, Organic, Immunity"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="formDisplayOrder">
                  Display Order (Sorting)
                </FieldLabel>
                <Input
                  id="formDisplayOrder"
                  type="number"
                  {...productForm.register("display_order")}
                  placeholder="10"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="formDescription">Description</FieldLabel>
              <Textarea
                id="formDescription"
                {...productForm.register("description")}
                placeholder="Write premium catalog details about ingredients, taste profile, and health benefits..."
                rows={4}
              />
            </Field>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
                <Checkbox
                  checked={productForm.watch("is_available")}
                  onCheckedChange={(c) => productForm.setValue("is_available", !!c)}
                />
                Is Available (Publish immediately)
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
                <Checkbox
                  checked={productForm.watch("is_featured")}
                  onCheckedChange={(c) => productForm.setValue("is_featured", !!c)}
                />
                Is Featured (Promote on frontpage)
              </label>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner data-icon="inline-start" />}
                {isPending
                  ? "Saving catalogue..."
                  : "Save Product Catalogue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={variantsModalOpen} onOpenChange={setVariantsModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl sm:max-w-3xl overflow-y-auto border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Manage Variants: {activeProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure variant options (Volume size, customized colors,
              localized SKU strings, stock values, and pricing offsets).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 text-left md:grid-cols-2">
            <Card className="h-fit border border-border/80 bg-card/40">
              <CardHeader className="p-4">
                <CardTitle className="text-xs font-bold tracking-wider text-foreground uppercase">
                  Add New Variant option
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <form
                  onSubmit={handleAddVariant}
                  className="flex flex-col gap-4"
                >
                  <Field data-invalid={!!variantForm.formState.errors.size}>
                    <FieldLabel htmlFor="varSize">
                      Size (Volume/Dimension)
                    </FieldLabel>
                    <Input
                      id="varSize"
                      {...variantForm.register("size")}
                      placeholder="e.g. 250ml or 500ml"
                    />
                    {variantForm.formState.errors.size && (
                      <FieldError>{variantForm.formState.errors.size.message}</FieldError>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="varColor">Color Name</FieldLabel>
                      <Input
                        id="varColor"
                        {...variantForm.register("color")}
                        placeholder="Beet Red"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="varColorHex">
                        Color Hex Code
                      </FieldLabel>
                      <Input
                        id="varColorHex"
                        {...variantForm.register("color_hex")}
                        placeholder="#8b0000"
                      />
                    </Field>
                  </div>

                  <Field data-invalid={!!variantForm.formState.errors.sku}>
                    <FieldLabel htmlFor="varSku">SKU Code</FieldLabel>
                    <Input
                      id="varSku"
                      {...variantForm.register("sku")}
                      placeholder="JUICE-BEET-250"
                    />
                    {variantForm.formState.errors.sku && (
                      <FieldError>{variantForm.formState.errors.sku.message}</FieldError>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={!!variantForm.formState.errors.stock}>
                      <FieldLabel htmlFor="varStock">
                        Fulfillment Stock
                      </FieldLabel>
                      <Input
                        id="varStock"
                        type="number"
                        {...variantForm.register("stock")}
                        placeholder="100"
                      />
                      {variantForm.formState.errors.stock && (
                        <FieldError>{variantForm.formState.errors.stock.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="varAddPrice">
                        Add. Price Offset (IDR)
                      </FieldLabel>
                      <Input
                        id="varAddPrice"
                        type="number"
                        {...variantForm.register("additional_price")}
                        placeholder="+15000"
                      />
                    </Field>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 w-full font-medium"
                  >
                    {isPending && <Spinner data-icon="inline-start" />}
                    {isPending
                      ? "Appending..."
                      : "Append Variant Option"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Active Variant Combinations
              </h3>
              <div className="flex max-h-87.5 flex-col gap-3 overflow-y-auto pr-1">
                {!activeProduct?.variants ||
                activeProduct.variants.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
                    No variant combinations constructed yet.
                  </div>
                ) : (
                  activeProduct.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-3 text-xs transition-colors hover:border-primary"
                    >
                      <div className="flex flex-col items-start gap-1">
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
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {v.sku}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[10px] font-semibold">
                          <Badge variant="default">{v.stock} in stock</Badge>
                          <span className="text-primary">
                            +{formatPrice(v.additional_price)} offset
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isPending}
                        onClick={() => handleDeleteVariant(v.id)}
                        className="size-7 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          className="size-3.5"
                        />
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

      <Dialog open={imagesModalOpen} onOpenChange={setImagesModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl sm:max-w-2.5xl overflow-y-auto border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              Boutique Image Assets: {activeProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Upload multiple raw images directly to Cloudinary CDN, set primary
              listing catalog covers, or remove expired graphics assets.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4 text-left">
            <form
              onSubmit={handleImageUploadSubmit}
              className="flex items-end gap-4 rounded-lg border bg-muted/10 p-4"
            >
              <div className="flex-1 text-xs">
                <label className="mb-2 block font-semibold text-foreground">
                  Select Multi-Images files to upload
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full cursor-pointer text-xs text-muted-foreground file:mr-4 file:rounded-md file:border file:bg-card file:px-4 file:py-2 file:text-xs file:font-semibold file:text-foreground hover:file:bg-muted"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending || !selectedFiles}
              >
                {isPending && <Spinner data-icon="inline-start" />}
                {isPending ? "Uploading..." : "Upload Assets"}
              </Button>
            </form>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Catalog Image Assets
              </h3>
              {!activeProduct?.images || activeProduct.images.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-muted/20 py-16 text-center text-xs text-muted-foreground">
                  No photographic graphics uploaded for this product yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {activeProduct.images.map((img) => (
                    <div
                      key={img.id}
                      className={cn(
                        "group relative flex flex-col items-center gap-2 overflow-hidden rounded-lg border bg-card p-2 transition-colors hover:border-primary",
                        img.is_primary
                          ? "border-2 border-primary"
                          : "border-border"
                      )}
                    >
                      <img
                        src={img.image_url}
                        alt="Product option thumbnail"
                        className="h-28 w-full rounded bg-muted object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            "/placeholder-product.svg"
                        }}
                      />
                      {img.is_primary && (
                        <div className="absolute top-2 left-2 rounded bg-primary px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary-foreground uppercase shadow">
                          Cover
                        </div>
                      )}
                      <div className="mt-1 flex w-full items-center justify-between border-t border-border/60 pt-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleSetPrimaryImage(img.id)}
                          disabled={img.is_primary || isPending}
                          className="h-auto p-1.5 text-[10px]"
                        >
                          Set Cover
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleDeleteImage(img.id)}
                          className="size-7 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            className="size-3.5"
                          />
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

      {confirmDialog}
    </div>
  )
}

export default ProductsPage
