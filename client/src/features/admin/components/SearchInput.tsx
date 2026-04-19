import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "@hugeicons/core-free-icons"
import type { ComponentProps } from "react"

type SearchInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  containerClassName?: string
}

export const SearchInput = ({
  containerClassName = "w-full sm:max-w-xs",
  className,
  ...props
}: SearchInputProps) => (
  <div className={`relative ${containerClassName}`}>
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
      <HugeiconsIcon icon={SearchIcon} className="size-4" />
    </span>
    <Input
      type="text"
      className={`w-full border-border/80 bg-card pl-9 ${className ?? ""}`}
      {...props}
    />
  </div>
)
