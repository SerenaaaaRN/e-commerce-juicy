import { TableCell, TableRow } from "@/components/ui/table"

type EmptyStateProps = {
  message: string
  colSpan?: number
  variant?: "table" | "card"
}

const EmptyState = ({ message, colSpan = 7, variant = "table" }: EmptyStateProps) => {
  if (variant === "card") {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center text-xs text-muted-foreground">
        {message}
      </div>
    )
  }

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="px-6 py-12 text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  )
}
export { EmptyState }
