"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   ICON BUTTON COMPONENT
   ============================================ */

type IconButtonVariant = "ghost" | "solid" | "outline" | "danger";
type IconButtonSize = "sm" | "md" | "lg" | "xl";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  label: string; // Required for a11y
}

const variantStyles: Record<IconButtonVariant, string> = {
  ghost: "bg-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary",
  solid: "bg-bg-surface text-text-primary hover:bg-bg-hover border border-border",
  outline: "bg-transparent text-text-secondary border border-border hover:bg-bg-surface hover:text-text-primary",
  danger: "bg-transparent text-text-secondary hover:bg-danger/10 hover:text-danger",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", label, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
export { IconButton };
