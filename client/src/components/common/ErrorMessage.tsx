import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type ErrorMessageProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({ title = "An Error Occurred", message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 text-left">
      <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
        <div className="flex gap-3">
          <div className="pt-0.5 text-destructive">
            <HugeiconsIcon icon={AlertCircleIcon} size={18} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-sm font-bold tracking-tight text-destructive">{title}</AlertTitle>
            <AlertDescription className="mt-1.5 font-sans text-xs leading-relaxed text-muted-foreground">
              {message}
            </AlertDescription>

            {onRetry && (
              <div className="mt-4">
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="h-8 cursor-pointer border-destructive/30 text-[10px] font-semibold text-destructive uppercase hover:bg-destructive/10"
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
