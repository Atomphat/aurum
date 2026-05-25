import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Sarabun } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Sarabun = ฟอนต์ไทยไม่มีหัว (loopless) ที่นิยมที่สุด อ่านง่ายมาก
const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

// ใช้ Sarabun เป็น display ด้วย ให้ minimal feel เป็นเอกภาพทั้งเว็บ
// (ถ้าอยากต่างขึ้นค่อยเปลี่ยน --font-display)
export const metadata: Metadata = {
  title: "AURUM — Gold Intelligence",
  description: "ราคาทองเรียลไทม์ พร้อมการวิเคราะห์ด้วย AI",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AURUM",
  },
  themeColor: "#B8923D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${interTight.variable} ${jetbrainsMono.variable} ${sarabun.variable}`} suppressHydrationWarning>
      <body
        style={{
          ["--font-display" as string]: "var(--font-thai)",
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
