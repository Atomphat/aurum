import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// cache ผล 5 นาที — ราคาไม่เปลี่ยนบ่อย ไม่ต้องถาม Gemini ทุก request
let cache: { result: AIInsightResult; key: string; at: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export interface AIInsightResult {
  outlook: "bullish" | "bearish" | "neutral";
  verdict: string;
  highlight: string;
  body: string;
  indicators: { label: string; value: string; status: string }[];
  generatedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { xauUsd, usdThb, ornamentSell, ornamentBuy, barSell } = await req.json();

    // คืน cache ถ้าราคาเดิมและยังไม่หมดอายุ
    const cacheKey = `${Math.round(xauUsd)}_${Math.round(usdThb * 10)}_${ornamentSell}`;
    if (cache && cache.key === cacheKey && Date.now() - cache.at < CACHE_TTL) {
      return NextResponse.json(cache.result);
    }

    const spread = ornamentSell - ornamentBuy;
    const spreadPct = ((spread / ornamentBuy) * 100).toFixed(2);

    const prompt = `คุณเป็นนักวิเคราะห์ตลาดทองคำมืออาชีพ วิเคราะห์สถานการณ์ทองคำจากข้อมูลต่อไปนี้:

ราคาปัจจุบัน:
- Gold Spot (XAU/USD): $${xauUsd.toFixed(2)} ต่อออนซ์
- USD/THB: ${usdThb.toFixed(2)} บาท
- ทองรูปพรรณ (ขาย): ฿${ornamentSell.toLocaleString()} บาท/บาททอง
- ทองรูปพรรณ (รับซื้อ): ฿${ornamentBuy.toLocaleString()} บาท/บาททอง
- ทองคำแท่ง (ขาย): ฿${barSell.toLocaleString()} บาท/บาททอง
- ส่วนต่างซื้อ-ขาย: ฿${spread.toLocaleString()} (${spreadPct}%)

วิเคราะห์แนวโน้มตลาดและตอบในรูปแบบ JSON ดังนี้ (ตอบ JSON เท่านั้น ไม่มีข้อความอื่น):
{
  "outlook": "bullish" หรือ "bearish" หรือ "neutral",
  "verdict": "ประโยคสั้น 2-3 คำ เช่น แนวโน้มทอง",
  "highlight": "วลีเน้น เช่น ขาขึ้นระยะสั้น",
  "body": "วิเคราะห์ 2-3 ประโยคในภาษาไทย กระชับ",
  "indicators": [
    { "label": "USD/THB", "value": "${usdThb.toFixed(2)}", "status": "คำอธิบายสั้น" },
    { "label": "Spread", "value": "${spreadPct}%", "status": "คำอธิบายสั้น" },
    { "label": "Gold Spot", "value": "$${Math.round(xauUsd)}", "status": "คำอธิบายสั้น" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 512,
        thinkingConfig: { thinkingBudget: 0 }, // ปิด thinking → เร็วขึ้นมาก
      },
    });

    const raw = response.text?.trim() ?? "";
    const json = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(json) as AIInsightResult;
    const result = { ...parsed, generatedAt: new Date().toISOString() };

    cache = { result, key: cacheKey, at: Date.now() };
    return NextResponse.json(result);
  } catch (err) {
    console.error("[ai-insight]", err);
    return NextResponse.json({ error: "วิเคราะห์ไม่สำเร็จ" }, { status: 500 });
  }
}
