import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"

type EmptyStateProps = {
  title: string
  description: string
  icon?: any
  ctaText?: string
  onCtaClick?: () => void
}

export const EmptyState = ({
  title,
  description,
  icon,
  ctaText,
  onCtaClick,
}: EmptyStateProps) => {
  return (
    <Empty className="border border-dashed border-border/85 p-8 max-w-md mx-auto bg-transparent rounded-lg">
      <EmptyHeader className="flex flex-col items-center text-center">
        {icon && (
          <div className="mb-4 text-muted-foreground">
            <HugeiconsIcon icon={icon} size={36} strokeWidth={1.5} />
          </div>
        )}
        <EmptyTitle className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-[280px]">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      
      {ctaText && onCtaClick && (
        <EmptyContent className="mt-6 flex justify-center">
          <Button onClick={onCtaClick} size="sm" className="cursor-pointer">
            {ctaText}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

export default EmptyState
