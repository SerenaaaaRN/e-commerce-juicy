import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "w-full h-12 bg-chalk border border-sand rounded-[4px] px-4 font-dm-sans text-sm text-soil placeholder:text-dust/60 transition-all duration-300 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/40 disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
};

export { Input };
