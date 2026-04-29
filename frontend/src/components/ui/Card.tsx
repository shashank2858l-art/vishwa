"use client";

import { cn } from "@/lib/utils";

/* ============================================
   CARD COMPONENT — Light Theme
   ============================================ */

type CardVariant = "solid" | "glass" | "outline" | "elevated";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  solid: "bg-bg-surface border border-border",
  glass: "glass",
  outline: "bg-transparent border border-border",
  elevated: "bg-bg-elevated border border-border shadow-md shadow-black/5",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  variant = "solid",
  hover = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300",
        variantStyles[variant],
        paddingStyles[padding],
        hover && "hover:border-border-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* --- Sub-components --- */

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-secondary mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}
