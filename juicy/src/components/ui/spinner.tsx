import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className, size, strokeWidth, ...props }: Omit<React.ComponentProps<"svg">, "size" | "strokeWidth"> & { size?: number; strokeWidth?: number }) {
  return (
    <HugeiconsIcon icon={Loading03Icon} strokeWidth={strokeWidth ?? 2} role="status" aria-label="Loading" size={size} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
