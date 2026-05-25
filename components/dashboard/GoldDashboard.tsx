"use client";

import { useState, useEffect, useCallback } from "react";
import { PriceCard } from "./PriceCard";
import { AIInsight } from "./AIInsight";
import { StatsGrid, type StatItem } from "./StatsGrid";
import { HistoryTable, type HistoryRow } from "./HistoryTable";
import type { AIInsightResult } from "@/app/api/ai-insight/route";

interface ThaiGold {
  ornamentSell: number;
  ornamentBuy: number;
  barSell: number;
  barBuy: number;
  updatedAt: string;
  dailyChange: number;
}

export interface GoldData {
  xauUsd: number;
  usdThb: number;
  thaiGold: ThaiGold;
  fetchedAt: string;
}

const POLL_INTERVAL = 30_000;
const AI_REFRESH_INTERVAL = 300_000; // วิเคราะห์ใหม่ทุก 5 นาที

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function toStats(data: GoldData): StatItem[] {
  return [
    {
      label: "Gold Spot",
      value: `$${fmt(data.xauUsd)}`,
      meta: "ต่อออนซ์ · Twelve Data",
      trend: "up",
    },
    {
      label: "USD / THB",
      value: fmt(data.usdThb),
      meta: "Twelve Data",
      trend: "neutral",
    },
    {
      label: "ทองคำแท่ง (ขาย)",
      value: `฿${fmt(data.thaiGold.barSell, 0)}`,
      meta: "สมาคมค้าทองคำ",
      trend: "up",
    },
    {
      label: "ทองคำแท่ง (รับซื้อ)",
      value: `฿${fmt(data.thaiGold.barBuy, 0)}`,
      meta: "สมาคมค้าทองคำ",
      trend: "neutral",
    },
  ];
}

interface Props {
  initialData: GoldData | null;
}

export function GoldDashboard({ initialData }: Props) {
  const [data, setData] = useState<GoldData | null>(initialData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData ? new Date(initialData.fetchedAt) : null
  );
  const [status, setStatus] = useState<"idle" | "refreshing" | "error">("idle");
  const [history, setHistory] = useState<HistoryRow[]>(() =>
    initialData ? [dataToRow(initialData)] : []
  );
  const [aiInsight, setAiInsight] = useState<AIInsightResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchAI = useCallback(async (d: GoldData) => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xauUsd: d.xauUsd,
          usdThb: d.usdThb,
          ornamentSell: d.thaiGold.ornamentSell,
          ornamentBuy: d.thaiGold.ornamentBuy,
          barSell: d.thaiGold.barSell,
        }),
      });
      if (!res.ok) throw new Error();
      setAiInsight(await res.json());
    } catch {
      // ใช้ข้อมูลเดิมถ้า AI ล้มเหลว
    } finally {
      setAiLoading(false);
    }
  }, []);

  // โหลด AI ครั้งแรก
  useEffect(() => {
    if (initialData) fetchAI(initialData);
  }, [initialData, fetchAI]);

  // refresh ราคาทุก 30 วิ
  const refresh = useCallback(async () => {
    setStatus("refreshing");
    try {
      const res = await fetch("/api/gold-price", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const fresh: GoldData = await res.json();
      setData(fresh);
      setLastUpdated(new Date(fresh.fetchedAt));
      setHistory((prev) => [dataToRow(fresh), ...prev].slice(0, 20));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const priceId = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(priceId);
  }, [refresh]);

  // refresh AI ทุก 5 นาที
  useEffect(() => {
    const aiId = setInterval(() => {
      if (data) fetchAI(data);
    }, AI_REFRESH_INTERVAL);
    return () => clearInterval(aiId);
  }, [data, fetchAI]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  const { ornamentSell, ornamentBuy, barSell, dailyChange } = data.thaiGold;
  const prevBarSell = barSell - dailyChange;

  return (
    <>
      {/* Status bar */}
      <div className="flex items-center gap-2 mb-4 text-xs text-ink-faint">
        <span
          className={
            status === "refreshing"
              ? "w-1.5 h-1.5 rounded-full bg-gold animate-pulse"
              : status === "error"
              ? "w-1.5 h-1.5 rounded-full bg-down"
              : "w-1.5 h-1.5 rounded-full bg-up"
          }
        />
        {status === "refreshing" && "กำลังอัปเดต..."}
        {status === "error" && "อัปเดตไม่สำเร็จ"}
        {status === "idle" && lastUpdated && (
          <>อัปเดตล่าสุด {lastUpdated.toLocaleTimeString("th-TH")} · รีเฟรชทุก 30 วิ</>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-6">
        <PriceCard
          targetPrice={barSell}
          change={dailyChange}
          changePercent={prevBarSell > 0 ? (dailyChange / prevBarSell) * 100 : 0}
        />
        <AIInsight
          loading={aiLoading}
          verdict={aiInsight?.verdict ?? "แนวโน้มทอง"}
          highlight={aiInsight?.highlight ?? "กำลังวิเคราะห์..."}
          body={aiInsight?.body ?? ""}
          indicators={aiInsight?.indicators ?? [
            { label: "Gold Spot", value: `$${Math.round(data.xauUsd)}`, status: "—" },
            { label: "USD/THB", value: fmt(data.usdThb), status: "—" },
            { label: "แท่ง ขาย", value: `฿${fmt(data.thaiGold.barSell, 0)}`, status: "—" },
            { label: "แท่ง รับซื้อ", value: `฿${fmt(data.thaiGold.barBuy, 0)}`, status: "—" },
          ]}
        />
      </div>

      <StatsGrid items={toStats(data)} />
      <HistoryTable rows={history} />
    </>
  );
}

function dataToRow(d: GoldData): HistoryRow {
  return {
    time: new Date(d.fetchedAt).toLocaleTimeString("th-TH"),
    goldSpot: `$${fmt(d.xauUsd)}`,
    usdThb: fmt(d.usdThb),
    thaiGold: `฿${fmt(d.thaiGold.ornamentSell, 0)}`,
    change: "—",
    trend: "neutral",
  };
}
