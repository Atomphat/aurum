export type Timeframe = "1H" | "1D" | "1W" | "1M" | "1Y";

export type Trend = "up" | "down" | "neutral";

export interface PricePoint {
  time: string;
  goldSpot: number;
  usdThb: number;
  thaiGold: number;
  change: number;
}

export interface AIInsight {
  outlook: "bullish" | "bearish" | "neutral";
  verdict: string;
  body: string;
  indicators: {
    rsi: { value: number; status: string };
    macd: { value: number; status: string };
    ma50: { value: number; status: string };
  };
}
