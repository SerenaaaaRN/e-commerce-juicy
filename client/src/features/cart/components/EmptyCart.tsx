import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"

export const EmptyCart = () => {
  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16">
      <Empty className="border-none max-w-md bg-transparent">
        
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-primary/5 text-primary size-12 rounded-full mb-3 flex items-center justify-center">
            <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={1.8} className="size-6 text-primary" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-bold tracking-tight">
            Your Cart is Empty
          </EmptyTitle>
          <EmptyDescription className="text-sm text-muted-foreground mt-2">
            You haven't selected any raw linen silhouettes or artisanal collections yet. Add some items to build your style foundation.
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
