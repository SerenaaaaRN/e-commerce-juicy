import { formatDate } from "@/lib/utils"
import { StarRating } from "./StarRating"
import { Card, CardContent } from "@/components/ui/card"

type ReviewCardProps = {
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

export const ReviewCard = ({ customerName, rating, comment, createdAt }: ReviewCardProps) => {
  return (
    <Card className="border border-border/60 shadow-sm">
      <CardContent className="px-4">

        {/* Customer meta details row */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground truncate">
            {customerName}
          </span>
          <span className="text-muted-foreground whitespace-nowrap">
            {formatDate(createdAt)}
          </span>
        </div>

        <StarRating rating={rating} />

        {/* Customer review comment */}
        <p className="text-sm text-muted-foreground leading-relaxed leading-relaxed font-sans mt-1">
          {comment}
        </p>

      </CardContent>
    </Card>
  )
}

export default ReviewCard
