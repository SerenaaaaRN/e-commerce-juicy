import { Spinner } from "@/components/ui/spinner"

type FullPageSpinnerProps = {
  label?: string
}

export const FullPageSpinner = ({ label = "Loading..." }: FullPageSpinnerProps) => (
  <div className="flex h-[70vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-center">
      <Spinner className="size-8 text-primary" />
      <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  </div>
)
