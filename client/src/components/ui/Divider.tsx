import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type DividerProps = ComponentProps<"hr">;

const Divider = ({ className, ...props }: DividerProps) => {
  return (
    <hr
      className={cn("border-0 border-t border-sand/40 w-full my-6", className)}
      {...props}
    />
  );
};

export default Divider;
