"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mb-10 sm:mb-12 md:mb-14"
    >
      {/* Live tag */}
      <div className="inline-flex items-center gap-2.5 py-1.5 pl-2 pr-3.5 bg-white border border-line rounded-full text-xs font-medium text-ink-soft mb-5 sm:mb-6">
        <span className="relative w-2 h-2 rounded-full bg-up">
          <span className="absolute inset-0 rounded-full bg-up opacity-40 animate-pulse-ring" />
        </span>
        <span>Live · ปรับปรุงทุก 15 วินาที</span>
      </div>

      {/* Headline */}
      <h1 className="font-display font-light text-[36px] sm:text-[48px] md:text-[60px] lg:text-[72px] leading-[1.05] tracking-tight text-ink mb-3 sm:mb-4">
        ราคาทอง{" "}
        <span className="font-normal bg-gradient-to-br from-gold-deep to-gold-light bg-clip-text text-transparent">
          เรียลไทม์
        </span>
        <br />
        วิเคราะห์ด้วย AI
      </h1>

      {/* Subtitle */}
      <p className="text-[15px] sm:text-base md:text-[17px] text-ink-muted max-w-[560px] leading-relaxed">
        ติดตามราคาทองคำในประเทศไทยและทั่วโลก พร้อมการวิเคราะห์แนวโน้มอัจฉริยะ ในอินเตอร์เฟซที่งดงามและละเอียดอ่อน
      </p>
    </motion.section>
  );
}
