import { Skeleton } from "@/components/ui/skeleton"

type ProductGridSkeletonProps = {
  count?: number
}

export const ProductGridSkeleton = ({ count = 4 }: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          {/* Aspect Ratio Box */}
          <Skeleton className="aspect-[3/4] w-full rounded-none" />
          {/* Metadata Row */}
          <div className="flex justify-between items-center mt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          {/* Title */}
          <Skeleton className="h-4 w-3/4" />
          {/* Price */}
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
export default Skeleton
