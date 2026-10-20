import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#06080c", 900: "#0a0d13", 800: "#10141c", 700: "#171c26", 600: "#222938" },
        brand: { DEFAULT: "#34d399", dim: "#10b981", cyan: "#22d3ee" },
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { glow: "0 0 80px -20px rgba(52,211,153,0.35)" },
    },
  },
  plugins: [],
};
export default config;