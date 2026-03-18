import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "brand-red": "var(--brand-red)",
        "brand-blue": "var(--brand-blue)",
        "brand-green": "var(--brand-green)",
        "brand-gold": "var(--brand-gold)",
      },
    },
  },
  plugins: [],
};
export default config;
