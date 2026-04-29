"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================
   INPUT COMPONENT
   ============================================ */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  inputSize?: "md" | "lg" | "xl";
}

const sizeStyles = {
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
  xl: "h-14 text-lg px-5",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, inputSize = "lg", className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl bg-bg-surface border border-border",
              "text-text-primary placeholder:text-text-muted",
              "transition-all duration-200",
              "hover:border-border-hover",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              sizeStyles[inputSize],
              icon ? "pl-10" : false,
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl bg-bg-surface border border-border",
            "text-text-primary placeholder:text-text-muted",
            "transition-all duration-200 resize-none",
            "hover:border-border-hover",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
            "min-h-[120px] p-4 text-base leading-relaxed",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
