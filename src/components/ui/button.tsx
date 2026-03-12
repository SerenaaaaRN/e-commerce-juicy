import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariantProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "xs";
};

type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;
type ButtonLinkProps = LinkProps & ButtonVariantProps;

const variantStyle = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
  ghost: "hover:bg-muted hover:text-foreground",
};

const sizeStyles = {
  default: "h-8 gap-1.5 px-2.5",
  xs: "h-6 gap-1 px-2 text-xs rounded-md",
  sm: "h-7 gap-1 px-2.5 text-[0.8rem] rounded-md",
  lg: "h-9 gap-1.5 px-2.5",
};

const buttonBase =
  "inline-flex items-center justify-center shrink-0 whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const Button = ({ children, className, variant = "primary", size = "default", ...props }: ButtonProps) => {
  return (
    <button className={cn(buttonBase, variantStyle[variant], sizeStyles[size], className)} {...props}>
      {children}
    </button>
  );
};

const ButtonLink = ({ children, className, variant = "ghost", size = "default", ...props }: ButtonLinkProps) => {
  return (
    <Link className={cn(buttonBase, variantStyle[variant], sizeStyles[size], className)} {...props}>
      {children}
    </Link>
  );
};

export { Button, ButtonLink };
