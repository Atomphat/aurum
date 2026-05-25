"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: string;
  meta: string;
  trend: "up" | "down" | "neutral";
}

interface StatsGridProps {
  items: StatItem[];
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.55 + i * 0.1,
          }}
          whileHover={{ y: -3 }}
          className={cn(
            "group relative overflow-hidden cursor-pointer",
            "bg-bg-elevated border border-line",
            "rounded-2xl sm:rounded-[20px]",
            "p-5 sm:p-6",
            "transition-all duration-400",
            "hover:border-gold-pale hover:shadow-card-hover"
          )}
        >
          {/* Bottom gold accent */}
          <div
            className={cn(
              "absolute bottom-0 inset-x-0 h-0.5",
              "bg-gradient-to-r from-gold-light via-gold to-gold-deep",
              "scale-x-0 origin-left transition-transform duration-500",
              "group-hover:scale-x-100"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          />

          <div className="font-display italic text-[13px] text-ink-muted mb-3">
            {item.label}
          </div>
          <div className="font-mono text-[22px] sm:text-[26px] font-medium text-ink leading-none mb-2 tabular">
            {item.value}
          </div>
          <div
            className={cn(
              "text-[11px] sm:text-xs flex items-center gap-1",
              item.trend === "up" && "text-up",
              item.trend === "down" && "text-down",
              item.trend === "neutral" && "text-ink-muted"
            )}
          >
            {item.meta}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
