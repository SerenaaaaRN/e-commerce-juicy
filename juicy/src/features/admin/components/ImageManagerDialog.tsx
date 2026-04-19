import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/types"

type ImageManagerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeProduct: ProductDetail | null
  selectedFiles: FileList | null
  onFileChange: (files: FileList | null) => void
  onUploadSubmit: (e: React.FormEvent) => void
  onSetPrimary: (imageId: string) => void
  onDeleteImage: (imageId: string) => void
  isPending: boolean
}

export const ImageManagerDialog = ({
  open,
  onOpenChange,
  activeProduct,
  selectedFiles,
  onFileChange,
  onUploadSubmit,
  onSetPrimary,
  onDeleteImage,
  isPending,
}: ImageManagerDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
          onSubmit={onUploadSubmit}
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
              onChange={(e) => onFileChange(e.target.files)}
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
                      onClick={() => onSetPrimary(img.id)}
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
                      onClick={() => onDeleteImage(img.id)}
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
)
