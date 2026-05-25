# AURUM — Gold Intelligence

ราคาทองเรียลไทม์ พร้อมการวิเคราะห์ด้วย AI ในอินเตอร์เฟซที่งดงาม

## Stack

- **Next.js 15** (App Router) + React 19
- **TypeScript** strict mode
- **TailwindCSS** + custom design tokens
- **Framer Motion** สำหรับ animation
- **Lucide React** icons
- **Sarabun** (ฟอนต์ไทยไม่มีหัว) + **Inter Tight** + **JetBrains Mono**

## ฟีเจอร์ของ UI ใน MVP นี้

- ✅ Responsive ครบ mobile/tablet/desktop
- ✅ ฟอนต์ไทยไม่มีหัว (Sarabun) — อ่านง่าย minimal
- ✅ Hover animation ทุกปุ่ม / ทุก card
- ✅ Count-up animation ตอนโหลดราคา
- ✅ Chart line drawing animation
- ✅ Grain texture + ambient gold glow
- ✅ Mobile menu (hamburger)
- ✅ Mobile-optimized table (card view บนมือถือ)
- ✅ Custom scrollbar + selection color

## เริ่มใช้งาน

```bash
# ติดตั้ง dependencies
pnpm install
# หรือ npm install / yarn install

# รัน dev server
pnpm dev

# เปิด http://localhost:3000
```

## โครงสร้างโปรเจกต์

```
aurum-gold/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles + grain texture
├── components/
│   ├── ui/
│   │   └── Button.tsx      # Reusable button with variants
│   └── dashboard/
│       ├── Navbar.tsx      # Nav + mobile menu
│       ├── Hero.tsx        # Headline
│       ├── PriceCard.tsx   # Hero price + chart
│       ├── AIInsight.tsx   # AI analysis card
│       ├── StatsGrid.tsx   # 4 stat cards
│       └── HistoryTable.tsx # Price history (responsive)
├── lib/
│   └── utils.ts            # cn() + formatters
├── types/
│   └── index.ts            # TypeScript types
├── tailwind.config.ts      # Design tokens
└── package.json
```

## Design Tokens

ดูใน `tailwind.config.ts` — เปลี่ยนสีหรือ font ที่เดียวเปลี่ยนทั้งเว็บ

```ts
// Colors
bg.DEFAULT         #FAF8F3   // cream background
ink.DEFAULT        #1A1814   // primary text
gold.DEFAULT       #B8923D   // accent gold
gold.deep / light  // gold gradient

// Fonts (CSS vars)
--font-thai        Sarabun (loopless ฟอนต์ไทยไม่มีหัว)
--font-sans        Inter Tight
--font-mono        JetBrains Mono
```

## Roadmap ต่อไป

- [ ] API route ดึงราคา Gold Spot จริง (GoldAPI / scrape)
- [ ] BOT API สำหรับ USD/THB
- [ ] Supabase: เก็บ historical data + realtime
- [ ] Recharts หรือ Lightweight Charts สำหรับกราฟจริง
- [ ] AI วิเคราะห์ผ่าน Gemini API + technical indicators
- [ ] Google OAuth login (NextAuth)
- [ ] Dark mode toggle
- [ ] PWA support

## License

MIT — ทำเล่นได้ตามสบาย
# aurum
