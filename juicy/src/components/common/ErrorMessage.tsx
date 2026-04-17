import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { HugeiconsIcon } from "@hugeicons/react"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"

type ErrorMessageProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({
  title = "An Error Occurred",
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="w-full max-w-md mx-auto py-8 px-4 text-left">
      <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
        <div className="flex gap-3">
          <div className="text-destructive pt-0.5">
            <HugeiconsIcon icon={AlertCircleIcon} size={18} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-sm font-bold tracking-tight text-destructive">
              {title}
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans">
              {message}
            </AlertDescription>
            
            {onRetry && (
              <div className="mt-4">
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 text-[10px] uppercase font-semibold h-8 cursor-pointer"
                >
                  Retry Action
                </Button>
              </div>
            )}
          </div>
        </div>
      </Alert>
    </div>
  )
}

export default ErrorMessage
