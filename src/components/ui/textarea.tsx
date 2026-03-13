import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea">;

const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "w-full min-h-[120px] bg-chalk border border-sand rounded-[4px] p-4 font-dm-sans text-sm text-soil placeholder:text-dust/60 transition-all duration-300 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/40 disabled:opacity-40 disabled:cursor-not-allowed resize-y",
        className
      )}
      {...props}
    />
  );
};

export { Textarea };
