import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#060D29",
          50: "#EEF0F6",
          100: "#D6DAE9",
          400: "#4B5578",
          600: "#232B4A",
          900: "#060D29",
        },
        gold: {
          DEFAULT: "#F4CB19",
          50: "#FEFAE6",
          100: "#FDF3C0",
          400: "#F6D652",
          600: "#D9AE0A",
        },
        paper: "#FFFCF4",
        mist: "#F4F5F9",
        line: "#E3E6EE",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        helvetica: ["\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(6,13,41,0.04), 0 8px 24px -8px rgba(6,13,41,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
