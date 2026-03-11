import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": "#C62828",
        "brand-blue": "#1565C0",
        "brand-green": "#2E7D32",
        "brand-gold": "#F9A825",
      },
    },
  },
  plugins: [],
};
export default config;
