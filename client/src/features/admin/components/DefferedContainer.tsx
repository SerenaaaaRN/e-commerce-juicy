import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type DefferedContainerProps = ComponentProps<"div"> & {
  isStale: boolean
}

const DefferedContainer = ({ isStale, className, children }: DefferedContainerProps) => (
  <div className={cn("transition-opacity duration-150", className)} style={{ opacity: isStale ? 0.6 : 1 }}>
    {children}
  </div>
)

export { DefferedContainer }
