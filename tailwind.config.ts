import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#090c13",
        card: "#111622",
        accent: "#50B4FF",
        success: "#2ecc71",
        warning: "#f39c12",
        danger: "#e74c3c"
      }
    }
  },
  plugins: []
};

export default config;
