import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10201c",
        paper: "#f7faf7",
        leaf: "#0f7a5f",
        mint: "#dff3ea",
        saffron: "#f2a13b",
        river: "#1f78b4",
        rose: "#c6415d"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 32, 28, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
