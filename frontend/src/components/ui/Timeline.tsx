"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================
   TIMELINE COMPONENT — Light Theme
   ============================================ */

export interface TimelineStep {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  status: "completed" | "active" | "pending";
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const dotColors = {
  completed: "border-success bg-success/10",
  active: "border-accent bg-accent/10 animate-status-pulse",
  pending: "border-border bg-bg-primary",
};

const lineColors = {
  completed: "bg-success",
  active: "bg-gradient-to-b from-accent to-border",
  pending: "bg-border",
};

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn("relative flex flex-col", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Line + Dot */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-[3px] transition-colors duration-300 shrink-0",
                  dotColors[step.status]
                )}
              >
                {step.status === "completed" ? (
                  <Check size={18} className="text-success" />
                ) : step.icon ? (
                  <span className={cn(
                    step.status === "active" ? "text-accent" : "text-text-muted"
                  )}>
                    {step.icon}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "w-3 h-3 rounded-full",
                      step.status === "active" ? "bg-accent" : "bg-text-muted"
                    )}
                  />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-1 flex-1 my-1 rounded-full",
                    lineColors[step.status]
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1.5 min-w-0">
              <p
                className={cn(
                  "font-medium leading-tight",
                  step.status === "pending" ? "text-text-muted" : "text-text-primary"
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-text-secondary mt-0.5">{step.description}</p>
              )}
              {step.timestamp && (
                <p className="text-xs text-text-muted mt-1">{step.timestamp}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
