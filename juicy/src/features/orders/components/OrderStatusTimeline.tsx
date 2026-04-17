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
  { label: "Pending", description: "Order Placed", key: "pending" },
  { label: "Confirmed", description: "Payment Verified", key: "confirmed" },
  { label: "Processing", description: "Atelier Assembly", key: "processing" },
  { label: "Shipped", description: "En Route", key: "shipped" },
  { label: "Delivered", description: "Delivered", key: "delivered" },
]

export const OrderStatusTimeline = ({ status }: OrderStatusTimelineProps) => {
  // Determine index of current status in steps
  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="flex flex-col gap-6 w-full text-left pt-2">
      
      <h3 className="text-sm font-semibold tracking-tight text-foreground uppercase">
        Delivery Status Timeline
      </h3>

      {/* Steppers container */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 pt-4 pb-6 w-full">
        
        {/* Desktop connection lines */}
        <div className="absolute top-1/2 left-0 h-0.5 bg-border/40 w-full -translate-y-1/2 hidden md:block z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-700 hidden md:block z-0"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx
          const isActive = idx === currentIdx

          return (
            <div
              key={step.key}
              className="flex md:flex-col items-center md:text-center gap-4 md:gap-2.5 z-10 flex-1 w-full md:w-auto relative"
            >
              
              {/* Stepper Node Indicator */}
              <div
                className={cn(
                  "size-8 flex items-center justify-center rounded-full border-2 text-xs font-bold font-mono transition-all duration-500",
                  isCompleted 
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isActive ? (
                  <span className="size-2 rounded-full bg-white animate-ping" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Labels details */}
              <div className="flex flex-col md:items-center text-left md:text-center">
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
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
