import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/$")({
  component: () => (
    <div className="container mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20">
      <Empty className="max-w-md border-none bg-transparent">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/5 text-primary"
          >
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.8} className="size-6 text-primary" />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-bold tracking-tight">Page Not Found</EmptyTitle>
          <EmptyDescription className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved to a new location.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="mt-6">
          <Button asChild variant="outline">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
})