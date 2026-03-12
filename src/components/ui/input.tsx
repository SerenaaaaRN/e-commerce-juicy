import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Input = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        "border-border focus-visible:border-ring focus-visible:ring-ring/50",
        "text-foreground placeholder:text-muted-foreground bg-background",
        "file:text-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:bg-muted/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 aria-invalid:ring-3",
        "md:text-sm",
        className
      )}
      {...props}
    />
  );
};

export { Input };
