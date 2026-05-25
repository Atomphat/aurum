"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const links = [
  { label: "Dashboard", active: true },
  { label: "Markets", active: false },
  { label: "Analytics", active: false },
  { label: "Alerts", active: false },
];

interface NavbarProps {
  userEmail?: string;
  userAvatar?: string;
  userCount?: number;
}

export function Navbar({ userEmail, userAvatar, userCount }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex items-center justify-between gap-4",
        "px-5 sm:px-6 lg:px-8 py-4",
        "bg-bg-elevated/60 backdrop-blur-xl backdrop-saturate-150",
        "border border-line rounded-[28px] lg:rounded-full",
        "mb-10 md:mb-14 lg:mb-16",
        "relative z-30"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer group shrink-0">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gold-light to-gold-deep grid place-items-center text-white font-medium shadow-gold-sm transition-transform duration-500 group-hover:rotate-[360deg]">
          <span className="text-base leading-none">A</span>
        </div>
        <div className="font-display font-medium text-lg sm:text-xl tracking-wide">
          aurum<span className="text-gold-deep font-light">.</span>
        </div>
      </div>

      {/* Desktop links */}
      <ul className="hidden lg:flex gap-1 list-none">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href="#"
              className={cn(
                "relative block px-4 py-2.5 text-sm font-medium rounded-full",
                "transition-colors duration-300",
                link.active ? "text-ink" : "text-ink-soft hover:text-ink"
              )}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full -z-10 transition-all duration-400",
                  link.active
                    ? "bg-gold-pale scale-100 opacity-100"
                    : "bg-bg-cream scale-[0.6] opacity-0 hover:scale-100 hover:opacity-100"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
              />
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {/* User count */}
        {userCount !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line text-xs text-ink-muted">
            <Users className="w-3 h-3" />
            {userCount.toLocaleString()} users
          </div>
        )}
        <ThemeToggle />
        {/* User avatar + sign out */}
        {userEmail && (
          <div className="flex items-center gap-2">
            {userAvatar ? (
              <img src={userAvatar} alt="" className="w-8 h-8 rounded-full border border-line" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gold-pale border border-gold/20 grid place-items-center text-xs font-medium text-gold-deep">
                {userEmail[0].toUpperCase()}
              </div>
            )}
            <button
              onClick={signOut}
              className="w-8 h-8 rounded-full grid place-items-center border border-line text-ink-muted hover:bg-bg-cream hover:text-ink transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile actions */}
      <div className="flex md:hidden items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full grid place-items-center border border-line-strong text-ink hover:bg-bg-cream transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-bg-elevated/95 backdrop-blur-xl border border-line rounded-3xl p-4 md:hidden shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href="#"
                    className={cn(
                      "block px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                      link.active ? "bg-gold-pale text-ink" : "text-ink-soft hover:bg-bg-cream"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            {userEmail && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line px-1">
                <div className="flex items-center gap-2">
                  {userAvatar ? (
                    <img src={userAvatar} alt="" className="w-7 h-7 rounded-full border border-line" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gold-pale grid place-items-center text-xs font-medium text-gold-deep">
                      {userEmail[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-ink-muted truncate max-w-[160px]">{userEmail}</span>
                </div>
                <button onClick={signOut} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                  ออก
                </button>
              </div>
            )}
            {userCount !== undefined && (
              <div className="flex items-center gap-1.5 mt-3 px-1 text-xs text-ink-faint">
                <Users className="w-3 h-3" />
                {userCount.toLocaleString()} users ทั้งหมด
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
