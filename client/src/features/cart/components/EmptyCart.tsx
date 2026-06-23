import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"

export const EmptyCart = () => {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 pt-24 pb-16 lg:pt-32">
      <Empty className="max-w-md border-none bg-transparent">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-3 flex size-12 items-center justify-center rounded-none bg-muted text-foreground"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.5} className="size-6 text-foreground" />
          </EmptyMedia>
          <EmptyTitle className="font-serif text-2xl text-foreground">Your Cart is Empty</EmptyTitle>
          <EmptyDescription className="mt-2 text-sm text-muted-foreground">
            You haven't selected any raw linen silhouettes or artisanal collections yet. Add some items to build your
            style foundation.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="mt-6">
          <Button asChild size="lg" className="rounded-none text-xs tracking-[0.15em] uppercase">
            <Link to={ROUTES.shop}>Shop the Collection</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default EmptyCart
