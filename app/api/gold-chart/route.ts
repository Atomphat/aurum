import { NextRequest, NextResponse } from "next/server";

const INTERVAL_MAP: Record<string, { interval: string; outputsize: number; revalidate: number; intraday: boolean }> = {
  "1H": { interval: "5min",  outputsize: 12, revalidate: 60,   intraday: true  },
  "1D": { interval: "1h",    outputsize: 24, revalidate: 300,  intraday: true  },
  "1W": { interval: "4h",    outputsize: 42, revalidate: 900,  intraday: true  },
  "1M": { interval: "1day",  outputsize: 30, revalidate: 3600, intraday: false },
  "1Y": { interval: "1week", outputsize: 52, revalidate: 3600, intraday: false },
};

// "2024-05-26 10:30:00" → Unix seconds (UTC); "2024-05-26" → date string
function toTime(datetime: string, intraday: boolean): number | string {
  if (!intraday) return datetime.slice(0, 10);
  return Math.floor(new Date(datetime.replace(" ", "T") + "Z").getTime() / 1000);
}

export async function GET(req: NextRequest) {
  const tf = req.nextUrl.searchParams.get("tf") ?? "1D";
  const config = INTERVAL_MAP[tf] ?? INTERVAL_MAP["1D"];

  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const url = `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=${config.interval}&outputsize=${config.outputsize}&apikey=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: config.revalidate } });
    if (!res.ok) throw new Error("upstream error");
    const json = await res.json();
    if (json.status !== "ok") throw new Error(json.message ?? "api error");

    const values = (json.values as {
      datetime: string; open: string; high: string; low: string; close: string;
    }[]).reverse();

    // deduplicate by time to be safe
    const seen = new Set<number | string>();
    const unique = values.filter((v) => {
      const t = toTime(v.datetime, config.intraday);
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });

    const line = unique.map((v) => ({
      time: toTime(v.datetime, config.intraday),
      value: parseFloat(parseFloat(v.close).toFixed(2)),
    }));

    const candle = unique.map((v) => ({
      time: toTime(v.datetime, config.intraday),
      open:  parseFloat(parseFloat(v.open).toFixed(2)),
      high:  parseFloat(parseFloat(v.high).toFixed(2)),
      low:   parseFloat(parseFloat(v.low).toFixed(2)),
      close: parseFloat(parseFloat(v.close).toFixed(2)),
    }));

    return NextResponse.json({ line, candle }, { headers: { "Cache-Control": `s-maxage=${config.revalidate}` } });
  } catch (err) {
    console.error("[gold-chart]", err);
    return NextResponse.json({ error: "ดึงข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
