import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          white: "#ffffff",
          gray: "#f7f7f7",
          "gray-dark": "#e5e5e5",
          "text-secondary": "rgba(0,0,0,0.6)",
          "text-tertiary": "rgba(0,0,0,0.4)",
          border: "rgba(0,0,0,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "hero": ["56px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-mobile": ["36px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "section": ["28px", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        "pill": "30px",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
        "fade-in": "fade-in 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
