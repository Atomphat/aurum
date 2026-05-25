"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface HistoryRow {
  time: string;
  goldSpot: string;
  usdThb: string;
  thaiGold: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

interface HistoryTableProps {
  rows: HistoryRow[];
}

export function HistoryTable({ rows }: HistoryTableProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
      className="bg-bg-elevated border border-line rounded-3xl sm:rounded-[28px] overflow-hidden"
    >
      {/* Head */}
      <div className="flex items-center justify-between px-5 sm:px-7 md:px-8 pt-6 sm:pt-7 pb-4 sm:pb-5 border-b border-line gap-3">
        <h2 className="font-display font-normal text-lg sm:text-xl md:text-[22px] tracking-tight">
          Price <span className="italic text-gold-deep">History</span>
        </h2>
        <Button variant="ghost" className="text-xs sm:text-sm px-3 sm:px-5 py-2">
          ดูทั้งหมด
          <ArrowRight className="arrow w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>

      {/* Desktop table */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          <tr>
            {["Time", "Gold Spot (USD)", "USD/THB", "Thai Gold (฿)", "Change"].map(
              (h, i) => (
                <th
                  key={h}
                  className={cn(
                    "px-8 py-3.5 bg-bg-cream",
                    "text-[11px] font-semibold tracking-[0.14em] uppercase",
                    "text-ink-muted",
                    i === 0 ? "text-left" : i === 4 ? "text-right" : "text-left"
                  )}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-line last:border-0 cursor-pointer",
                "transition-colors duration-300 hover:bg-bg-cream"
              )}
            >
              <td className="px-8 py-4 font-mono text-[13px] text-ink-muted tabular">
                {row.time}
              </td>
              <td className="px-8 py-4 font-mono text-sm font-medium text-ink tabular">
                {row.goldSpot}
              </td>
              <td className="px-8 py-4 font-mono text-sm font-medium text-ink tabular">
                {row.usdThb}
              </td>
              <td className="px-8 py-4 font-mono text-sm font-medium text-ink tabular">
                {row.thaiGold}
              </td>
              <td
                className={cn(
                  "px-8 py-4 font-mono text-sm font-medium text-right tabular",
                  row.trend === "up" ? "text-up" : "text-down"
                )}
              >
                {row.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-line">
        {rows.map((row, i) => (
          <div
            key={i}
            className="px-5 py-4 hover:bg-bg-cream transition-colors duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-mono text-xs text-ink-muted tabular">
                {row.time}
              </div>
              <div
                className={cn(
                  "font-mono text-sm font-medium tabular",
                  row.trend === "up" ? "text-up" : "text-down"
                )}
              >
                {row.change}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint mb-1">
                  Spot
                </div>
                <div className="font-mono text-xs font-medium tabular">
                  {row.goldSpot}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint mb-1">
                  USD/THB
                </div>
                <div className="font-mono text-xs font-medium tabular">
                  {row.usdThb}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint mb-1">
                  Thai
                </div>
                <div className="font-mono text-xs font-medium tabular">
                  {row.thaiGold}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}
