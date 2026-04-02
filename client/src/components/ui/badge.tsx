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
        "font-dm-sans text-label-xs inline-flex items-center justify-center rounded-[2px] px-2 py-0.5 font-semibold tracking-[0.08em] uppercase select-none",
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
