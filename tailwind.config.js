/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dunkles App-Theme (mobile.de-Stil) mit Alex-Autoshop-Gold
        bg: "#0c0c0e",
        surface: "#161619",
        raised: "#202024",
        hair: "rgba(255,255,255,0.08)",
        ink: "#f4f4f6",
        sub: "#9a9aa3",
        faint: "#6a6a72",
        gold: { DEFAULT: "#ffd400", soft: "rgba(255,212,0,0.14)", deep: "#e6bf00" },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "14px", "2xl": "18px", "3xl": "26px" },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px rgba(0,0,0,0.4)",
        pop: "0 12px 40px rgba(0,0,0,0.55)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "sheet-up": { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "sheet-up": "sheet-up 0.3s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
