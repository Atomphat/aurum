"use client";

import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function signInWithGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vw] pointer-events-none -z-0"
        style={{ background: "radial-gradient(circle, rgba(184,146,61,0.15) 0%, transparent 60%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-bg-elevated border border-line rounded-3xl p-8 sm:p-10 shadow-gold-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light to-gold-deep grid place-items-center text-white shadow-gold-sm">
              <span className="text-lg font-medium leading-none">A</span>
            </div>
            <div className="font-display font-medium text-xl tracking-wide">
              aurum<span className="text-gold-deep font-light">.</span>
            </div>
          </div>

          <h1 className="font-display text-2xl font-light tracking-tight mb-2">
            ยินดีต้อนรับ
          </h1>
          <p className="text-sm text-ink-muted mb-8 leading-relaxed">
            เข้าสู่ระบบเพื่อดูราคาทองแบบเรียลไทม์<br />พร้อมการวิเคราะห์จาก AI
          </p>

          {/* Google button */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border border-line bg-bg-cream hover:bg-gold-pale hover:border-gold-pale transition-all duration-300 text-sm font-medium text-ink disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"}
          </button>

          <p className="text-center text-[11px] text-ink-faint mt-6 leading-relaxed">
            การเข้าสู่ระบบถือว่าคุณยอมรับเงื่อนไขการใช้งาน<br />ข้อมูลที่แสดงไม่ใช่คำแนะนำการลงทุน
          </p>
        </div>
      </motion.div>
    </div>
  );
}
