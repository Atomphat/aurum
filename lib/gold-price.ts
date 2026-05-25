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
  dailyChange: number;
}

function calcThaiGoldFromSpot(xauUsd: number, usdThb: number): ThaiGold {
  const rawPerBaht = (xauUsd * usdThb * 15.244) / 31.1035;
  const barBase    = Math.round((rawPerBaht * 0.965) / 50) * 50;
  return {
    barSell:      barBase,
    barBuy:       barBase - 200,
    ornamentSell: barBase + 800,
    ornamentBuy:  barBase - 1600,
    updatedAt:    "ประมาณการจากราคา Spot",
    dailyChange:  0,
  };
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

export async function fetchThaiGoldPrice(spot?: GoldSpot): Promise<ThaiGold> {
  try {
    const res = await fetch(
      "https://www.goldtraders.or.th/api/GoldPrices/Latest?readjson=true",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`goldtraders API status ${res.status}`);

    const j = await res.json();

    const ornamentSell = parseFloat(j.oM965_SellPrice);
    const ornamentBuy  = parseFloat(j.oM965_BuyPrice);
    const barSell      = parseFloat(j.bL_SellPrice);
    const barBuy       = parseFloat(j.bL_BuyPrice);

    if (isNaN(ornamentSell) || ornamentSell === 0) {
      throw new Error(`unexpected API response: ornamentSell = ${ornamentSell}`);
    }

    return {
      ornamentSell,
      ornamentBuy,
      barSell,
      barBuy,
      updatedAt:   j.asTime ?? "",
      dailyChange: parseFloat(j.priceChangeFromPrevDayLast) ?? 0,
    };
  } catch (err) {
    console.warn("[gold-price] goldtraders API failed, using spot fallback:", err);
    if (!spot) throw err;
    return calcThaiGoldFromSpot(spot.xauUsd, spot.usdThb);
  }
}
