import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "group/card bg-background text-foreground ring-border relative flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
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
        "group/card-header border-border @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
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
        "font-heading text-foreground text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  );
};

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />;
};

const CardAction = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
};

const CardContent = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cn("px-4 group-data-[size=sm]/card:px-3", className)} {...props} />;
};

const CardFooter = ({ className, ...props }: ComponentProps<"footer">) => {
  return (
    <footer
      className={cn(
        "bg-muted/50 border-border flex items-center rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter };
