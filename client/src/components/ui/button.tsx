import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Link, type LinkProps } from "react-router-dom";

type ButtonVariantProps = {
  variant?: "primary" | "outline" | "sand" | "ghost";
  size?: "default" | "sm" | "lg" | "xs" | "xl";
};

type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;
type ButtonLinkProps = LinkProps & ButtonVariantProps;

const variantStyle = {
  primary: "bg-terracotta text-chalk border-transparent hover:bg-[#9a5230]",
  outline: "border-1.5 border-soil text-soil bg-transparent hover:bg-cream",
  sand: "bg-sand text-soil border-transparent hover:bg-sand/80",
  ghost: "text-soil bg-transparent border-transparent hover:bg-cream",
};

const sizeStyles = {
  xs: "h-8 px-4 text-xs font-semibold tracking-wide uppercase",
  sm: "h-10 px-6 text-xs font-semibold tracking-wide uppercase",
  default: "h-12 px-8 text-sm font-medium",
  lg: "h-14 px-10 text-base font-medium",
  xl: "h-16 px-12 text-base font-semibold uppercase tracking-widest",
};

const buttonBase =
  "inline-flex items-center justify-center shrink-0 whitespace-nowrap rounded-[2px] font-dm-sans transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px cursor-pointer leading-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2";

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
