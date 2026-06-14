import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        latimore: {
          navy: "#2C3E50",
          gold: "#C49A6C"
        }
      }
    }
  },
  plugins: []
};

export default config;
