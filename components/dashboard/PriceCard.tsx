"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, LineChart, CandlestickChart } from "lucide-react";
import type { LineData, CandlestickData } from "lightweight-charts";
import { GoldChart } from "./GoldChart";
import { cn } from "@/lib/utils";
import { Timeframe } from "@/types";

const timeframes: Timeframe[] = ["1H", "1D", "1W", "1M", "1Y"];
type ChartType = "line" | "candle";

interface ChartPayload {
  line: LineData[];
  candle: CandlestickData[];
}

interface PriceCardProps {
  targetPrice: number;
  change: number;
  changePercent: number;
}

export function PriceCard({ targetPrice, change = 0, changePercent = 0 }: PriceCardProps) {
  const [active, setActive] = useState<Timeframe>("1D");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [displayPrice, setDisplayPrice] = useState(targetPrice * 0.957);
  const [chartData, setChartData] = useState<ChartPayload>({ line: [], candle: [] });
  const [loadingChart, setLoadingChart] = useState(true);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = displayPrice;
    const startTime = performance.now();
    const duration = 1200;
    const update = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPrice(start + (targetPrice - start) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPrice]);

  const fetchChart = useCallback(async (tf: Timeframe) => {
    setLoadingChart(true);
    try {
      const res = await fetch(`/api/gold-chart?tf=${tf}`);
      if (!res.ok) throw new Error();
      setChartData(await res.json());
    } catch {
      setChartData({ line: [], candle: [] });
    } finally {
      setLoadingChart(false);
    }
  }, []);

  useEffect(() => { fetchChart(active); }, [active, fetchChart]);

  const isUp = change >= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden",
        "bg-bg-elevated border border-line",
        "rounded-3xl sm:rounded-[28px]",
        "p-6 sm:p-8 md:p-10",
        "transition-shadow duration-500",
        "hover:shadow-gold-lg hover:border-gold-pale"
      )}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent opacity-60" />
      <div className="absolute -top-1/2 -right-[30%] w-[80%] h-[200%] pointer-events-none opacity-50">
        <div className="w-full h-full bg-[radial-gradient(ellipse,rgba(184,146,61,0.18)_0%,transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-7 sm:mb-8">
        <div>
          <div className="font-display italic font-normal text-[15px] sm:text-base text-ink-muted">
            ทองคำแท่ง 96.5%
          </div>
          <div className="text-xs sm:text-[13px] text-ink-faint mt-1">
            ราคาขาย · สมาคมค้าทองคำ
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart type toggle */}
          <div className="flex gap-1 bg-bg-cream p-1 rounded-full">
            <button
              onClick={() => setChartType("line")}
              className={cn(
                "w-7 h-7 rounded-full grid place-items-center transition-all duration-300",
                chartType === "line" ? "bg-white text-gold-deep shadow-sm" : "text-ink-muted hover:text-ink"
              )}
              title="Line chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType("candle")}
              className={cn(
                "w-7 h-7 rounded-full grid place-items-center transition-all duration-300",
                chartType === "candle" ? "bg-white text-gold-deep shadow-sm" : "text-ink-muted hover:text-ink"
              )}
              title="Candlestick chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframe pills */}
          <div className="flex gap-1 bg-bg-cream p-1 rounded-full overflow-x-auto scrollbar-none">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActive(tf)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide shrink-0",
                  "transition-all duration-300",
                  active === tf ? "bg-white text-gold-deep shadow-sm" : "text-ink-muted hover:text-ink"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="relative z-10 mb-5 sm:mb-6">
        <span className="font-display italic font-light text-2xl sm:text-3xl text-ink-muted align-top mr-1.5 sm:mr-2">฿</span>
        <span className="font-display font-light text-[56px] sm:text-[72px] md:text-[88px] lg:text-[96px] leading-none tracking-[-0.03em] text-ink tabular inline-block">
          {Math.floor(displayPrice).toLocaleString("en-US")}
        </span>
        <span className="font-display italic font-light text-sm sm:text-base text-ink-muted ml-2 sm:ml-3">/ บาททอง</span>
      </div>

      {/* Change badge */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4">
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm font-medium border",
          isUp ? "bg-up/[0.08] text-up border-up/15" : "bg-down/[0.08] text-down border-down/15"
        )}>
          <ArrowUpRight className={cn("w-3 h-3", !isUp && "rotate-90")} />
          {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{changePercent.toFixed(2)}%)
        </span>
        <span className="text-xs sm:text-[13px] text-ink-muted">เปลี่ยนแปลงรายวัน · สมาคมค้าทองคำ</span>
      </div>

      {/* Chart */}
      <div className="relative z-10 mt-7 sm:mt-9 h-36 sm:h-44 md:h-48">
        {loadingChart ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          </div>
        ) : chartData.line.length > 0 ? (
          <GoldChart
            line={chartData.line}
            candle={chartData.candle}
            type={chartType}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-ink-faint">
            ไม่สามารถโหลดกราฟได้
          </div>
        )}
      </div>
    </motion.article>
  );
}
