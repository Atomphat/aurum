"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Indicator {
  label: string;
  value: string;
  status: string;
}

interface AIInsightProps {
  verdict: string;
  highlight: string;
  body: string;
  indicators: Indicator[];
  loading?: boolean;
}

export function AIInsight({ verdict, highlight, body, indicators, loading }: AIInsightProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden text-white",
        "bg-gradient-to-br from-ink to-[#2A2620]",
        "rounded-3xl sm:rounded-[28px]",
        "p-6 sm:p-8 md:p-9",
        "transition-shadow duration-500",
        "hover:shadow-[0_24px_60px_-20px_rgba(26,24,20,0.4)]"
      )}
    >
      {/* Gold radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(184,146,61,0.18)_0%,transparent_50%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6 sm:mb-7">
        {/* Animated AI orb */}
        <div className="relative w-9 h-9 shrink-0">
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, #D4B36A, #B8923D, #8C6D26, #B8923D)",
            }}
          />
          <div className="absolute inset-[4px] bg-ink rounded-full" />
          <div
            className="absolute -inset-1 rounded-full blur-md opacity-50 -z-10"
            style={{
              background: "conic-gradient(from 0deg, #D4B36A, transparent)",
            }}
          />
        </div>

        <div>
          <div className="font-display italic font-normal text-[17px]">
            Aurum Intelligence
          </div>
          <div className="text-[10px] sm:text-[11px] text-ink-faint tracking-[0.12em] uppercase mt-0.5">
            AI Market Analysis
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className="relative z-10 mb-5 sm:mb-6">
        <div className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-gold-light mb-3 font-medium">
          — Today&apos;s Outlook
        </div>
        <div className="font-display font-light text-[24px] sm:text-[28px] md:text-[32px] leading-tight tracking-tight">
          {verdict}{" "}
          <span className="italic text-gold-light">{highlight}</span>
        </div>
      </div>

      {/* Body text */}
      <p className="relative z-10 text-[13px] sm:text-sm leading-relaxed text-white/70 mb-6 sm:mb-7 min-h-[60px]">
        {loading ? (
          <span className="inline-flex items-center gap-2 text-white/40">
            <span className="w-3 h-3 rounded-full border border-gold/40 border-t-gold animate-spin" />
            กำลังวิเคราะห์ด้วย AI...
          </span>
        ) : body}
      </p>

      {/* Indicators */}
      {indicators.length > 0 && <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-white/10">
        {indicators.map((ind) => (
          <motion.div
            key={ind.label}
            whileHover={{ y: -2 }}
            className="cursor-pointer transition-transform"
          >
            <div className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-white/40 mb-1.5">
              {ind.label}
            </div>
            <div className="font-mono text-base sm:text-lg font-medium text-white tabular">
              {ind.value}
            </div>
            <div className="font-display italic text-[10px] sm:text-[11px] text-gold-light mt-0.5">
              {ind.status}
            </div>
          </motion.div>
        ))}
      </div>}
    </motion.article>
  );
}
