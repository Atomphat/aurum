"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "gold" | "ghost" | "soft";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "ghost", className, children, ...props }, ref) => {
    const base =
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap relative overflow-hidden transition-all duration-300";

    const variants: Record<Variant, string> = {
      gold: cn(
        "text-white border-0",
        "bg-gradient-to-br from-gold-light via-gold to-gold-deep",
        "shadow-gold-sm",
        "hover:-translate-y-0.5 hover:shadow-gold-md",
        "active:translate-y-0",
        "[&>svg.arrow]:transition-transform [&>svg.arrow]:duration-300",
        "hover:[&>svg.arrow]:translate-x-1",
        // Shine sweep
        "after:absolute after:top-0 after:-left-full after:w-full after:h-full",
        "after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent",
        "after:transition-[left] after:duration-700 after:ease-out",
        "hover:after:left-full"
      ),
      ghost: cn(
        "bg-transparent text-ink-soft border border-line-strong",
        "hover:border-ink hover:text-ink hover:-translate-y-0.5",
        "[&>svg.arrow]:transition-transform [&>svg.arrow]:duration-300",
        "hover:[&>svg.arrow]:translate-x-1"
      ),
      soft: cn(
        "bg-bg-cream text-ink-soft border-0",
        "hover:bg-gold-pale hover:text-ink hover:-translate-y-0.5"
      ),
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
