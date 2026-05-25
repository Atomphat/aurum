"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type CandlestickData,
  ColorType,
} from "lightweight-charts";
import { useTheme } from "next-themes";

interface GoldChartProps {
  line: LineData[];
  candle: CandlestickData[];
  type: "line" | "candle";
}

export function GoldChart({ line, candle, type }: GoldChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const colors = {
    bg:         isDark ? "rgb(26,24,20)"    : "rgb(255,255,255)",
    grid:       isDark ? "rgba(250,248,243,0.05)" : "rgba(26,24,20,0.05)",
    text:       isDark ? "rgb(138,131,120)" : "rgb(138,131,120)",
    line:       "#B8923D",
    upColor:    "#2D7A4E",
    downColor:  "#B33A3A",
    wickUp:     "#2D7A4E",
    wickDown:   "#B33A3A",
  };

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.text,
        fontSize: 10,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      crosshair: { vertLine: { width: 1, color: colors.line, style: 3 }, horzLine: { width: 1, color: colors.line, style: 3 } },
      handleScroll: false,
      handleScale: false,
    });

    const chart = chartRef.current;

    if (type === "candle") {
      const s = chart.addSeries(CandlestickSeries, {
        upColor: colors.upColor,
        downColor: colors.downColor,
        wickUpColor: colors.wickUp,
        wickDownColor: colors.wickDown,
        borderVisible: false,
      });
      s.setData(candle);
      seriesRef.current = s;
    } else {
      const s = chart.addSeries(AreaSeries, {
        lineColor: colors.line,
        topColor: "rgba(184,146,61,0.25)",
        bottomColor: "rgba(184,146,61,0)",
        lineWidth: 2,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: colors.line,
        crosshairMarkerBackgroundColor: colors.line,
      });
      s.setData(line);
      seriesRef.current = s;
    }

    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isDark, line.length, candle.length]);

  return <div ref={containerRef} className="w-full h-full" />;
}
