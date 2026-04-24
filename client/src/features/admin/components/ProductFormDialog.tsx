import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import type { Category, ProductDetail } from "@/types"
import type { ProductFormValues } from "@/features/admin/types"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeProduct: ProductDetail | null
  categories: Category[]
  form: UseFormReturn<ProductFormValues>
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  isPending: boolean
}

export const ProductFormDialog = ({
  open,
  onOpenChange,
  activeProduct,
  categories,
  form,
  onSubmit,
  isPending,
}: ProductFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] max-w-xl sm:max-w-3xl overflow-y-auto border bg-card">
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
        onSubmit={onSubmit}
        className="flex flex-col gap-5 py-4 text-left"
      >
        <Field data-invalid={!!form.formState.errors.name}>
          <FieldLabel htmlFor="formName">Product Title</FieldLabel>
          <Input
            id="formName"
            {...form.register("name", {
              onChange: (e) => {
                if (!activeProduct) {
                  form.setValue(
                    "slug",
                    e.target.value
                      .toLowerCase()
                      .replace(/ /g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
              },
            })}
            placeholder="e.g. Pure Earth Cleanser"
          />
          {form.formState.errors.name && (
            <FieldError>{form.formState.errors.name.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.slug}>
          <FieldLabel htmlFor="formSlug">Product Slug</FieldLabel>
          <Input
            id="formSlug"
            {...form.register("slug", {
              onChange: (e) => {
                form.setValue(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                )
              },
            })}
            placeholder="pure-earth-cleanser"
          />
          {form.formState.errors.slug && (
            <FieldError>{form.formState.errors.slug.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.category_id}>
          <FieldLabel htmlFor="formCategoryId">
            Assign Category Classification
          </FieldLabel>
          <Select
            value={form.watch("category_id")}
            onValueChange={(val) => form.setValue("category_id", val)}
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
          {form.formState.errors.category_id && (
            <FieldError>{form.formState.errors.category_id.message}</FieldError>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel htmlFor="formPrice">
              Base Retail Price (IDR)
            </FieldLabel>
            <Input
              id="formPrice"
              type="number"
              {...form.register("price")}
              placeholder="45000"
            />
            {form.formState.errors.price && (
              <FieldError>{form.formState.errors.price.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="formComparePrice">
              Compare-At Price (IDR - Strikeout)
            </FieldLabel>
            <Input
              id="formComparePrice"
              type="number"
              {...form.register("compare_at_price")}
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
              {...form.register("tags")}
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
              {...form.register("display_order")}
              placeholder="10"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="formDescription">Description</FieldLabel>
          <Textarea
            id="formDescription"
            {...form.register("description")}
            placeholder="Write premium catalog details about ingredients, taste profile, and health benefits..."
            rows={4}
          />
        </Field>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
            <Checkbox
              checked={form.watch("is_available")}
              onCheckedChange={(c) => form.setValue("is_available", !!c)}
            />
            Is Available (Publish immediately)
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-foreground select-none">
            <Checkbox
              checked={form.watch("is_featured")}
              onCheckedChange={(c) => form.setValue("is_featured", !!c)}
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
)
