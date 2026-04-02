import { useState } from "react";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

type StarRatingProps = {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  starClassName?: string;
};

const StarRating = ({
  rating,
  interactive = false,
  onRatingChange,
  className,
  starClassName,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {STARS.map((star) => {
        const isFilled = star <= displayRating;
        const isPartiallyFilled = star - 0.5 <= displayRating && star > displayRating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={cn(
              "p-0.5 outline-none transition-transform duration-200 focus-visible:scale-110",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
          >
            <div className="relative">
              {/* Empty/Base Star */}
              <svg
                className={cn("size-4 text-sand", starClassName)}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499c.196-.427.778-.427.975 0l2.646 5.753 6.002.502c.475.04.665.632.296.974l-4.526 4.195 1.34 5.926c.106.471-.413.856-.816.59l-5.01-3.328-5.01 3.328c-.403.266-.922-.119-.816-.59l1.34-5.926-4.526-4.195c-.37-.341-.18-.934.296-.974l6.002-.502 2.646-5.753z"
                />
              </svg>

              {/* Partially Filled Star Overlay */}
              {isPartiallyFilled && !interactive && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <svg
                    className={cn("size-4 text-terracotta", starClassName)}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.48 3.499c.196-.427.778-.427.975 0l2.646 5.753 6.002.502c.475.04.665.632.296.974l-4.526 4.195 1.34 5.926c.106.471-.413.856-.816.59l-5.01-3.328-5.01 3.328c-.403.266-.922-.119-.816-.59l1.34-5.926-4.526-4.195c-.37-.341-.18-.934.296-.974l6.002-.502 2.646-5.753z" />
                  </svg>
                </div>
              )}

              {/* Fully Filled Star Overlay */}
              {isFilled && !isPartiallyFilled && (
                <div className="absolute inset-0">
                  <svg
                    className={cn("size-4 text-terracotta", starClassName)}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.48 3.499c.196-.427.778-.427.975 0l2.646 5.753 6.002.502c.475.04.665.632.296.974l-4.526 4.195 1.34 5.926c.106.471-.413.856-.816.59l-5.01-3.328-5.01 3.328c-.403.266-.922-.119-.816-.59l1.34-5.926-4.526-4.195c-.37-.341-.18-.934.296-.974l6.002-.502 2.646-5.753z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
