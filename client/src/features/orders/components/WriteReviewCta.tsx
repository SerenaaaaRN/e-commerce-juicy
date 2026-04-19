import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ordersApi } from "@/lib/api/orders"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

type WriteReviewCtaProps = {
  productId: string
  orderId: string
  productName: string
}

export const WriteReviewCta = ({ productId, orderId, productName }: WriteReviewCtaProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await ordersApi.submitReview({
        product_id: productId,
        order_id: orderId,
        rating,
        body: comment.trim() || undefined,
      })

      if (res.success) {
        toast.success(`Review for ${productName} submitted. Thank you for your support!`)
        setComment("")
        setIsOpen(false)
      } else {
        toast.error(res.message || "Failed to submit review. You may have already reviewed this item.")
      }
    } catch {
      toast.error("Failed to submit review. Review details are invalid or already processed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-[10px] uppercase font-semibold h-8 cursor-pointer"
      >
        Write Review
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          
          <DialogHeader className="text-left flex flex-col gap-1">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
              Review Silhouette
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-sans">
              Provide feedback for the artisanal quality of your {productName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="pt-4 text-left">
            <FieldGroup className="gap-5">
              
              {/* Star Rating Choices selector */}
              <Field>
                <FieldLabel>Atelier Rating</FieldLabel>
                <div className="flex items-center gap-1.5 pt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= rating
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-90"
                      >
                        <HugeiconsIcon
                          icon={StarIcon}
                          className={active ? "text-amber-500 fill-amber-500" : "text-border"}
                          strokeWidth={1.8}
                        />
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Comments Textarea Field */}
              <Field>
                <FieldLabel htmlFor="review-body">Comments (Optional)</FieldLabel>
                <Textarea
                  id="review-body"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with the cut, fabric weights, or fit."
                  rows={4}
                  className="resize-none"
                />
              </Field>

              {/* Form submit footer */}
              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading} className="cursor-pointer">
                  {loading && <Spinner data-icon="inline-start" />}
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </div>

            </FieldGroup>
          </form>

        </DialogContent>
      </Dialog>
    </>
  )
}

export default WriteReviewCta
