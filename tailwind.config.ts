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
        navy: {
          DEFAULT: "#1a2d5a",
          dark: "#112044",
          light: "#243d77",
          50: "#f0f3fa",
          100: "#dde4f2",
          200: "#c0cde8",
          300: "#94abd8",
          400: "#6282c3",
          500: "#4063ae",
          600: "#2f4e93",
          700: "#243d77",
          800: "#1a2d5a",
          900: "#112044",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e4c46e",
          dark: "#a8893a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
