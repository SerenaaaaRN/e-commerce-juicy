import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"

export const EmptyCart = () => {
  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16">
      <Empty className="max-w-md border-none bg-transparent">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-bold tracking-tight">Your Cart is Empty</EmptyTitle>
          <EmptyDescription className="mt-2 text-sm text-muted-foreground">
            You haven't selected any raw linen silhouettes or artisanal collections yet. Add some items to build your
            style foundation.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="mt-6">
          <Button asChild size="lg">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default EmptyCart
