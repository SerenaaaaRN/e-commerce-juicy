import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/utils/format"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { useConfirm } from "@/hooks/useConfirm"
import { useProducts } from "@/features/admin/hooks/useProducts"
import { useVariants } from "@/features/admin/hooks/useVariants"
import { useProductImages } from "@/features/admin/hooks/useProductImages"
import { useDataTableFilter } from "@/features/admin/hooks/useDataTableFilter"
import { PageHeader } from "@/features/admin/components/PageHeader"
import { EmptyState } from "@/features/admin/components/DataEmpty"
import { DefferedContainer } from "@/features/admin/components/DefferedContainer"
import { FullPageSpinner } from "@/features/admin/components/FullPageSpinner"
import { SearchInput } from "@/features/admin/components/SearchInput"
import { ProductFormDialog } from "@/features/admin/components/ProductFormDialog"
import { VariantManagerDialog } from "@/features/admin/components/VariantManagerDialog"
import { ImageManagerDialog } from "@/features/admin/components/ImageManagerDialog"
import type { ProductDetail } from "@/types"

export const ProductsPage = () => {
  const ctx = useProducts()
  const { confirm: confirmDelete, dialog: confirmDialog } = useConfirm()

  const [variantsModalOpen, setVariantsModalOpen] = useState(false)
  const [imagesModalOpen, setImagesModalOpen] = useState(false)

  const variantCtx = useVariants(ctx.activeProduct, ctx.setActiveProduct, ctx.loadData)
  const imageCtx = useProductImages(ctx.activeProduct, ctx.setActiveProduct, ctx.loadData)

  const { search, setSearch, filteredData: searchFiltered, isStale } =
    useDataTableFilter(ctx.products, (p, s) =>
      p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
    )

  const openVariants = (prod: ProductDetail) => {
    ctx.setActiveProduct(prod)
    variantCtx.resetVariantForm()
    setVariantsModalOpen(true)
  }

  const openImages = (prod: ProductDetail) => {
    ctx.setActiveProduct(prod)
    imageCtx.setSelectedFiles(null)
    setImagesModalOpen(true)
  }

  const filtered = searchFiltered.filter(
    (p) => ctx.categoryFilter === "all" || p.category_id === ctx.categoryFilter
  )

  if (ctx.loading) return <FullPageSpinner label="Loading Catalog inventory..." />

  return (
    <div className="flex flex-col gap-8 text-left">
      <PageHeader
        title="Inventory Console"
        description="Manage your boutique catalog products, category lists, variant stocks, and high-res media."
        action={<Button onClick={ctx.handleOpenAddProduct}>Add New Product</Button>}
      />

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6 bg-muted/60 p-1">
          <TabsTrigger value="products" className="cursor-pointer">Products Inventory</TabsTrigger>
          <TabsTrigger value="categories" className="cursor-pointer">Categories &amp; Slugs</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row">
            <SearchInput placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="w-full sm:max-w-xs">
              <Select value={ctx.categoryFilter} onValueChange={ctx.setCategoryFilter}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ctx.categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DefferedContainer isStale={isStale} className="rounded-lg border border-border/60 bg-card shadow-sm">
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
                {filtered.length === 0 ? (
                  <EmptyState message="No catalog products matched your query." />
                ) : filtered.map((prod) => {
                  const img = prod.images?.find((i) => i.is_primary)?.image_url || "/placeholder-product.svg"
                  const stock = prod.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
                  return (
                    <TableRow key={prod.id}>
                      <TableCell className="px-6 py-4">
                        <img src={img} alt={prod.name} className="size-12 rounded border bg-muted object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.svg" }} />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-semibold text-foreground">{prod.name}</div>
                        <div className="max-w-xs truncate font-mono text-[11px] text-muted-foreground">{prod.slug}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4"><Badge variant="outline">{prod.category?.name || "Unassigned"}</Badge></TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-foreground">
                        {formatPrice(prod.price)}
                        {prod.compare_at_price && <div className="text-[11px] font-normal text-muted-foreground line-through">{formatPrice(prod.compare_at_price)}</div>}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <Badge variant={prod.is_available ? "default" : "destructive"}>{prod.is_available ? "Active" : "Archived"}</Badge>
                          {prod.is_featured && <Badge variant="default">Featured</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant={stock === 0 ? "destructive" : stock <= 15 ? "secondary" : "default"}>{stock} in stock</Badge>
                        <div className="mt-0.5 text-[10px] font-medium text-muted-foreground">{prod.variants?.length || 0} active option(s)</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="xs" onClick={() => openVariants(prod)} className="border px-2.5 text-xs font-medium hover:bg-muted">Variants</Button>
                          <Button variant="ghost" size="xs" onClick={() => openImages(prod)} className="border px-2.5 text-xs font-medium hover:bg-muted">Media</Button>
                          <Button variant="ghost" size="icon" onClick={() => ctx.handleOpenEditProduct(prod)} className="hover:bg-muted">
                            <HugeiconsIcon icon={Edit01Icon} className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" disabled={ctx.isPending} onClick={() => ctx.handleDeleteProduct(prod.id, confirmDelete)} className="hover:bg-destructive/10 hover:text-destructive">
                            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </DefferedContainer>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="h-fit border border-border/60 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold tracking-wider text-foreground uppercase">Add New Category</CardTitle>
                <CardDescription className="text-xs">Create classifications to group organic juices &amp; wellness products.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={ctx.handleCategorySubmit} className="flex flex-col gap-5 text-left">
                  <Field data-invalid={!!ctx.categoryForm.formState.errors.name}>
                    <FieldLabel htmlFor="catName">Category Name</FieldLabel>
                    <Input id="catName" {...ctx.categoryForm.register("name", { onChange: (e) => ctx.categoryForm.setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")) })} placeholder="e.g. Cleansing Tonics" />
                    {ctx.categoryForm.formState.errors.name && <FieldError>{ctx.categoryForm.formState.errors.name.message}</FieldError>}
                  </Field>
                  <Field data-invalid={!!ctx.categoryForm.formState.errors.slug}>
                    <FieldLabel htmlFor="catSlug">URL Slug</FieldLabel>
                    <Input id="catSlug" {...ctx.categoryForm.register("slug", { onChange: (e) => ctx.categoryForm.setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")) })} placeholder="cleansing-tonics" />
                    {ctx.categoryForm.formState.errors.slug && <FieldError>{ctx.categoryForm.formState.errors.slug.message}</FieldError>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="catDesc">Description</FieldLabel>
                    <Textarea id="catDesc" {...ctx.categoryForm.register("description")} placeholder="Brief details about the products in this category..." rows={3} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="catOrder">Display Order</FieldLabel>
                    <Input id="catOrder" type="number" {...ctx.categoryForm.register("display_order")} placeholder="1" />
                  </Field>
                  <Button type="submit" disabled={ctx.isPending} className="mt-2 w-full font-medium">
                    {ctx.isPending && <Spinner data-icon="inline-start" />}
                    {ctx.isPending ? "Creating..." : "Save Classification"}
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
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ctx.categories.length === 0 ? (
                    <EmptyState message="No categories currently defined." colSpan={5} />
                  ) : ctx.categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="px-6 py-4 font-semibold text-foreground">{cat.name}</TableCell>
                      <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">{cat.slug}</TableCell>
                      <TableCell className="max-w-xs truncate px-6 py-4 text-muted-foreground">{cat.description || "-"}</TableCell>
                      <TableCell className="px-6 py-4 font-medium text-foreground">{cat.display_order}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" disabled={ctx.isPending} onClick={() => ctx.handleDeleteCategory(cat.id, confirmDelete)} className="hover:bg-destructive/10 hover:text-destructive">
                          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ProductFormDialog open={ctx.productModalOpen} onOpenChange={ctx.setProductModalOpen} activeProduct={ctx.activeProduct} categories={ctx.categories} form={ctx.productForm} onSubmit={ctx.handleProductSubmit} isPending={ctx.isPending} />
      <VariantManagerDialog open={variantsModalOpen} onOpenChange={setVariantsModalOpen} activeProduct={ctx.activeProduct} form={variantCtx.variantForm} onSubmit={variantCtx.handleAddVariant} onDeleteVariant={(vId) => variantCtx.handleDeleteVariant(vId, confirmDelete)} isPending={variantCtx.isPending} />
      <ImageManagerDialog open={imagesModalOpen} onOpenChange={setImagesModalOpen} activeProduct={ctx.activeProduct} selectedFiles={imageCtx.selectedFiles} onFileChange={imageCtx.setSelectedFiles} onUploadSubmit={imageCtx.handleImageUploadSubmit} onSetPrimary={imageCtx.handleSetPrimaryImage} onDeleteImage={(imgId) => imageCtx.handleDeleteImage(imgId, confirmDelete)} isPending={imageCtx.isPending} />
      {confirmDialog}
    </div>
  )
}

export default ProductsPage
