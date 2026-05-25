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

export async function fetchThaiGoldPrice(): Promise<ThaiGold> {
  const res = await fetch("https://classic.goldtraders.or.th/", {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("goldtraders fetch failed");
  const html = await res.text();
  const $ = cheerio.load(html);

  const parse = (id: string) =>
    parseFloat($(`#${id}`).text().replace(/[^0-9.]/g, ""));

  return {
    ornamentSell: parse("DetailPlace_uc_goldprices1_lblBLSell"),
    ornamentBuy:  parse("DetailPlace_uc_goldprices1_lblBLBuy"),
    barSell:      parse("DetailPlace_uc_goldprices1_lblOMSell"),
    barBuy:       parse("DetailPlace_uc_goldprices1_lblOMBuy"),
    updatedAt:    $("#DetailPlace_uc_goldprices1_lblAsTime").text().trim(),
  };
}
