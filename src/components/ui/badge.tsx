import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type BadgeProps = ComponentProps<"div"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

const variantStyle = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border text-foreground hover:bg-muted hover:text-muted-foreground",
  ghost: "hover:bg-muted hover:text-muted-foreground",
};

const Badge = ({ children, className, variant = "primary", ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "focus:ring-ring inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus:ring-2 focus:outline-none [&>svg]:size-3",
        variantStyle[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
