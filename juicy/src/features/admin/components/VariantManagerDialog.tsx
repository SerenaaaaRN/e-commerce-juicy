import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { formatPrice } from "@/lib/utils/format"
import type { ProductDetail } from "@/types"
import type { VariantFormValues } from "@/features/admin/types"

type VariantManagerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeProduct: ProductDetail | null
  form: UseFormReturn<VariantFormValues>
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  onDeleteVariant: (variantId: string) => void
  isPending: boolean
}

export const VariantManagerDialog = ({
  open,
  onOpenChange,
  activeProduct,
  form,
  onSubmit,
  onDeleteVariant,
  isPending,
}: VariantManagerDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <Field data-invalid={!!form.formState.errors.size}>
                <FieldLabel htmlFor="varSize">
                  Size (Volume/Dimension)
                </FieldLabel>
                <Input
                  id="varSize"
                  {...form.register("size")}
                  placeholder="e.g. 250ml or 500ml"
                />
                {form.formState.errors.size && (
                  <FieldError>{form.formState.errors.size.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="varColor">Color Name</FieldLabel>
                  <Input
                    id="varColor"
                    {...form.register("color")}
                    placeholder="Beet Red"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="varColorHex">
                    Color Hex Code
                  </FieldLabel>
                  <Input
                    id="varColorHex"
                    {...form.register("color_hex")}
                    placeholder="#8b0000"
                  />
                </Field>
              </div>

              <Field data-invalid={!!form.formState.errors.sku}>
                <FieldLabel htmlFor="varSku">SKU Code</FieldLabel>
                <Input
                  id="varSku"
                  {...form.register("sku")}
                  placeholder="JUICE-BEET-250"
                />
                {form.formState.errors.sku && (
                  <FieldError>{form.formState.errors.sku.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!form.formState.errors.stock}>
                  <FieldLabel htmlFor="varStock">
                    Fulfillment Stock
                  </FieldLabel>
                  <Input
                    id="varStock"
                    type="number"
                    {...form.register("stock")}
                    placeholder="100"
                  />
                  {form.formState.errors.stock && (
                    <FieldError>{form.formState.errors.stock.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="varAddPrice">
                    Add. Price Offset (IDR)
                  </FieldLabel>
                  <Input
                    id="varAddPrice"
                    type="number"
                    {...form.register("additional_price")}
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
                    onClick={() => onDeleteVariant(v.id)}
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
)
