import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { fetchTwelveData, fetchThaiGoldPrice } from "@/lib/gold-price";

async function saveSnapshot(data: {
  xauUsd: number; usdThb: number;
  ornamentSell: number; ornamentBuy: number;
  barSell: number; barBuy: number;
}) {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from("gold_prices").insert({
      xau_usd: data.xauUsd,
      usd_thb: data.usdThb,
      ornament_sell: data.ornamentSell,
      ornament_buy: data.ornamentBuy,
      bar_sell: data.barSell,
      bar_buy: data.barBuy,
    });
  } catch (err) {
    console.error("[gold-price] save snapshot failed", err);
  }
}

export const revalidate = 300;

export async function GET() {
  try {
    const [spot, thai] = await Promise.all([
      fetchTwelveData(),
      fetchThaiGoldPrice(),
    ]);

    saveSnapshot({
      xauUsd: spot.xauUsd, usdThb: spot.usdThb,
      ornamentSell: thai.ornamentSell, ornamentBuy: thai.ornamentBuy,
      barSell: thai.barSell, barBuy: thai.barBuy,
    });

    return NextResponse.json({
      xauUsd: spot.xauUsd,
      usdThb: spot.usdThb,
      thaiGold: {
        ornamentSell: thai.ornamentSell,
        ornamentBuy:  thai.ornamentBuy,
        barSell:      thai.barSell,
        barBuy:       thai.barBuy,
        updatedAt:    thai.updatedAt,
      },
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[gold-price]", err);
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
