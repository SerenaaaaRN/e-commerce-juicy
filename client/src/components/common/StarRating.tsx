import { cn } from "@/lib/utils"
import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type StarRatingProps = {
  rating: number
  maxStars?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export const StarRating = ({ rating, maxStars = 5, interactive = false, onChange, className }: StarRatingProps) => {
  const stars = Array.from({ length: maxStars })

  return (
    <div className={cn("flex items-center gap-1 [&_svg]:size-4", className)}>
      {stars.map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= rating

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={cn(
              "p-0.5 transition-colors focus:outline-none",
              interactive ? "cursor-pointer duration-200 hover:scale-110" : "cursor-default"
            )}
          >
            <HugeiconsIcon
              icon={StarIcon}
              strokeWidth={2}
              className={cn(
                "transition-all duration-300",
                isFilled ? "fill-primary text-primary" : "fill-none text-muted-foreground/35"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
