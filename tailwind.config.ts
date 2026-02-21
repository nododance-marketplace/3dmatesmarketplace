import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: "#0FB6C8",
          hover: "#0CA4B5",
          muted: "rgba(15, 182, 200, 0.125)",
        },
        brand: {
          bg: "#0B0F14",
          surface: "#141A1F",
          "surface-hover": "#1A2128",
          text: "#E5E7EB",
          muted: "#6B7280",
          border: "#1F2937",
          "border-light": "#374151",
        },
      },
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
