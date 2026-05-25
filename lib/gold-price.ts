import * as cheerio from "cheerio";

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

// คำนวณราคาทองไทยโดยประมาณจากราคา spot เมื่อ scrape ไม่ได้
function calcThaiGoldFromSpot(xauUsd: number, usdThb: number): ThaiGold {
  // 1 troy oz = 31.1035g, 1 บาทน้ำหนัก = 15.244g
  const pricePerBaht = (xauUsd * usdThb * 15.244) / 31.1035;
  const barSell      = Math.round(pricePerBaht / 50) * 50 + 300;
  const barBuy       = barSell - 500;
  const ornamentSell = barSell + 250;
  const ornamentBuy  = barSell - 200;
  return { ornamentSell, ornamentBuy, barSell, barBuy, updatedAt: "ประมาณการจากราคา Spot" };
}

export async function fetchThaiGoldPrice(spot?: GoldSpot): Promise<ThaiGold> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://classic.goldtraders.or.th/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) throw new Error(`goldtraders status ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    const parse = (id: string) =>
      parseFloat($(`#${id}`).text().replace(/[^0-9.]/g, ""));

    const ornamentSell = parse("DetailPlace_uc_goldprices1_lblBLSell");
    const ornamentBuy  = parse("DetailPlace_uc_goldprices1_lblBLBuy");
    const barSell      = parse("DetailPlace_uc_goldprices1_lblOMSell");
    const barBuy       = parse("DetailPlace_uc_goldprices1_lblOMBuy");

    // ถ้า parse ไม่ได้ค่า (NaN) ให้ fallback
    if (isNaN(ornamentSell) || ornamentSell === 0) {
      throw new Error("parse failed — empty values");
    }

    return {
      ornamentSell,
      ornamentBuy,
      barSell,
      barBuy,
      updatedAt: $("#DetailPlace_uc_goldprices1_lblAsTime").text().trim(),
    };
  } catch (err) {
    console.warn("[gold-price] goldtraders scrape failed, using spot fallback:", err);
    if (!spot) throw err;
    return calcThaiGoldFromSpot(spot.xauUsd, spot.usdThb);
  }
}
