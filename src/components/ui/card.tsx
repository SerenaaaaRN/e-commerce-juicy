import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "group/card bg-transparent text-foreground relative flex flex-col gap-3 overflow-hidden rounded-none border-0 shadow-none text-sm",
        className
      )}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }: ComponentProps<"header">) => {
  return (
    <header
      className={cn(
        "group/card-header flex flex-col gap-1 rounded-none px-0 pb-2",
        className
      )}
      {...props}
    />
  );
};

const CardTitle = ({ className, ...props }: ComponentProps<"h3">) => {
  return (
    <h3
      className={cn(
        "font-playfair text-soil text-xl font-normal leading-snug tracking-tight",
        className
      )}
      {...props}
    />
  );
};

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cn("text-dust font-dm-sans text-xs font-normal leading-relaxed", className)} {...props} />;
};

const CardContent = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cn("px-0", className)} {...props} />;
};

const CardFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      className={cn(
        "border-t border-sand/30 flex items-center justify-between pt-3 px-0",
        className
      )}
      {...props}
    />
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
