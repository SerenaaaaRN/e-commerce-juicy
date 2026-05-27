import { formatDate } from "@/lib/utils"
import { StarRating } from "./StarRating"
import { Card, CardContent } from "@/components/ui/card"

type ReviewCardProps = {
  customerName: string
  rating: number
  comment: string | null
  createdAt: string
}

export const ReviewCard = ({ customerName, rating, comment, createdAt }: ReviewCardProps) => {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardContent className="px-4">
        {/* Customer meta details row */}
        <div className="flex items-center justify-between text-xs">
          <span className="truncate font-semibold text-foreground">{customerName}</span>
          <span className="whitespace-nowrap text-muted-foreground">{formatDate(createdAt)}</span>
        </div>

        <StarRating rating={rating} />

        {/* Customer review comment */}
        {comment ? <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">{comment}</p> : null}
      </CardContent>
    </Card>
  )
}

export default ReviewCard
