export interface GoldSpot {
  xauUsd: number;
  usdThb: number;
}

export interface ThaiGold {
  ornamentSell: number;
  ornamentBuy: number;
  barSell: number;
  barBuy: number;
  updatedAt: string;
}

export async function fetchTwelveData(): Promise<GoldSpot> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const res = await fetch(
    `https://api.twelvedata.com/price?symbol=XAU/USD,USD/THB&apikey=${apiKey}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Twelve Data fetch failed");
  const data = await res.json();
  return {
    xauUsd: parseFloat(data["XAU/USD"].price),
    usdThb: parseFloat(data["USD/THB"].price),
  };
}

// fallback เมื่อ API สมาคมล้มเหลว
function calcThaiGoldFromSpot(xauUsd: number, usdThb: number): ThaiGold {
  const rawPerBaht = (xauUsd * usdThb * 15.244) / 31.1035;
  const barBase    = Math.round((rawPerBaht * 0.965) / 50) * 50;
  return {
    barSell:      barBase,
    barBuy:       barBase - 200,
    ornamentSell: barBase + 800,
    ornamentBuy:  barBase - 1600,
    updatedAt: "ประมาณการจากราคา Spot",
  };
}

export async function fetchThaiGoldPrice(spot?: GoldSpot): Promise<ThaiGold> {
  try {
    const res = await fetch(
      "https://www.goldtraders.or.th/api/GoldPrices/Latest?readjson=false",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`goldtraders API status ${res.status}`);

    const json = await res.json();
    console.log("[gold-price] raw API response:", JSON.stringify(json).slice(0, 300));

    // รองรับหลาย field name ที่ API อาจส่งกลับมา
    const get = (obj: Record<string, unknown>, ...keys: string[]): number => {
      for (const k of keys) {
        const v = obj[k] ?? obj[k.toLowerCase()] ?? obj[k.toUpperCase()];
        if (v !== undefined && v !== null) return parseFloat(String(v));
      }
      return NaN;
    };

    const ornamentSell = get(json, "BLSell", "bl_sell", "ornamentSell", "OrnamentSell");
    const ornamentBuy  = get(json, "BLBuy",  "bl_buy",  "ornamentBuy",  "OrnamentBuy");
    const barSell      = get(json, "OMSell", "om_sell", "barSell",      "BarSell");
    const barBuy       = get(json, "OMBuy",  "om_buy",  "barBuy",       "BarBuy");
    const updatedAt    = String(json.UpdateTime ?? json.updateTime ?? json.update_time ?? json.AsTime ?? "");

    if (isNaN(ornamentSell) || ornamentSell === 0) {
      throw new Error(`unexpected API shape — ornamentSell = ${ornamentSell}`);
    }

    return { ornamentSell, ornamentBuy, barSell, barBuy, updatedAt };
  } catch (err) {
    console.warn("[gold-price] goldtraders API failed, using spot fallback:", err);
    if (!spot) throw err;
    return calcThaiGoldFromSpot(spot.xauUsd, spot.usdThb);
  }
}
