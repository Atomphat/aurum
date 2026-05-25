import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          elevated: "rgb(var(--bg-elevated) / <alpha-value>)",
          cream: "rgb(var(--bg-cream) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "#B8923D",
          deep: "#8C6D26",
          light: "#D4B36A",
          pale: "#F0E4C4",
        },
        up: "#2D7A4E",
        down: "#B33A3A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        thai: ["var(--font-thai)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(40px, 5vw, 72px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(48px, 6vw, 88px)", { lineHeight: "1", letterSpacing: "-0.03em" }],
      },
      borderColor: {
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      backgroundColor: {
        line: "var(--line)",
      },
      boxShadow: {
        "gold-sm": "0 4px 14px rgba(184, 146, 61, 0.18)",
        "gold-md": "0 8px 28px rgba(184, 146, 61, 0.22)",
        "gold-lg": "0 24px 60px -20px rgba(184, 146, 61, 0.25)",
        "card-hover": "0 12px 32px -12px rgba(184, 146, 61, 0.2)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-5vw, 5vh) scale(1.1)" },
        },
        pulse: {
          "0%": { transform: "scale(0.8)", opacity: "0.4" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        spin: { to: { transform: "rotate(360deg)" } },
        drawLine: { to: { strokeDashoffset: "0" } },
      },
      animation: {
        drift: "drift 20s ease-in-out infinite",
        "pulse-ring": "pulse 2s ease-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "draw-line": "drawLine 2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
      },
    },
  },
  plugins: [],
};

export default config;
