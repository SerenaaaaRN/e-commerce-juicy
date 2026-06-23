import { Separator } from "@/components/ui/separator"
import { ORDER_STATUS_LABELS } from "@/constants/order-status"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

type OrderStatusTimelineProps = {
  status: OrderStatus
}

type TimelineStep = {
  label: string
  description: string
  key: OrderStatus
}

const STEPS: TimelineStep[] = [
  { label: ORDER_STATUS_LABELS["pending"], description: "Order Placed", key: "pending" },
  { label: ORDER_STATUS_LABELS["confirmed"], description: "Payment Verified", key: "confirmed" },
  {
    label: ORDER_STATUS_LABELS["processing"],
    description: "Atelier Assembly",
    key: "processing",
  },
  { label: ORDER_STATUS_LABELS["shipped"], description: "En Route", key: "shipped" },
  { label: ORDER_STATUS_LABELS["delivered"], description: "Delivered", key: "delivered" },
]

export const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex w-full flex-col gap-6 pt-2 text-left">
      <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">Delivery Status Timeline</h3>

      <div className="relative flex w-full flex-col items-start justify-between gap-6 pt-4 pb-6 md:flex-row md:items-center md:gap-4">
        {/* Timeline connection line */}
        <Separator className="absolute top-1/3 left-0 z-0 hidden -translate-y-1/2 md:block" />
        <div
          className="absolute top-1/3 left-0 z-0 hidden h-0.5 -translate-y-1/2 bg-primary transition-all duration-700 md:block"
          style={{ width: `${(Math.max(0, currentIdx) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx
          const isActive = idx === currentIdx

          return (
            <div
              key={step.key}
              className="relative z-10 flex w-full flex-1 items-center gap-4 md:w-auto md:flex-col md:gap-2.5 md:text-center"
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all duration-500",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {isActive ? <span className="size-2 animate-ping rounded-full bg-white" /> : <span>{idx + 1}</span>}
              </div>

              <div className="flex flex-col text-left md:items-center md:text-center">
                <span
                  className={cn(
                    "text-xs font-bold tracking-wider uppercase",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 text-[10px] tracking-widest text-muted-foreground uppercase">
                  {step.description}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderStatusTimeline
