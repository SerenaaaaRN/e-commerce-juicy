import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type BadgeProps = ComponentProps<"div"> & {
  variant?: "primary" | "sale" | "outline";
};

const variantStyle = {
  primary: "bg-terracotta-light text-terracotta",
  sale: "bg-terracotta text-chalk",
  outline: "border border-sand text-dust bg-transparent",
};

const Badge = ({ children, className, variant = "primary", ...props }: BadgeProps) => {
  return (
    <div
      className={cn(  
        "inline-flex items-center justify-center rounded-[2px] px-2 py-0.5 font-dm-sans text-[11px] font-semibold uppercase tracking-[0.08em] select-none",
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
