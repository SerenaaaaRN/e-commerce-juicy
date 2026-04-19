import type { ComponentProps, ReactNode } from "react"

type PageHeaderProps = ComponentProps<"div"> & {
  title: string
  description: string
  action?: ReactNode
}

const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {action ? <div>{action}</div> : null}
  </div>
)

export { PageHeader }
