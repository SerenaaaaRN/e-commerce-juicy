import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type SelectProps = ComponentProps<"select">;

const Select = ({ children, className, ...props }: SelectProps) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "w-full h-12 bg-chalk border border-sand rounded-[4px] px-4 pr-10 font-dm-sans text-sm text-soil appearance-none transition-all duration-300 outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-dust">
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export { Select };
