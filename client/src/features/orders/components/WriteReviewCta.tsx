import { StarRating } from "@/components/common/StarRating"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitReviewMutation } from "@/features/shop/hooks/useProductQueries"
import { useState } from "react"
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
  const submitReviewMutation = useSubmitReviewMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitReviewMutation.mutateAsync({
        product_id: productId,
        order_id: orderId,
        rating,
        body: comment.trim() || undefined,
      })

      toast.success(`Review for ${productName} submitted. Thank you for your support!`)
      setComment("")
      setIsOpen(false)
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to submit review. Review details are invalid or already processed."
      toast.error(errMsg)
    }
  }

  const loading = submitReviewMutation.isPending

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 cursor-pointer text-[10px] font-semibold uppercase"
      >
        Write Review
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-col gap-1 text-left">
            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Review Silhouette</DialogTitle>
            <DialogDescription className="font-sans text-xs text-muted-foreground">
              Provide feedback for the artisanal quality of your {productName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="pt-4 text-left">
            <FieldGroup className="gap-5">
              {/* Star Rating Choices selector */}
              <Field>
                <FieldLabel>Atelier Rating</FieldLabel>
                <div className="pt-1.5">
                  <StarRating rating={rating} interactive onChange={setRating} />
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
