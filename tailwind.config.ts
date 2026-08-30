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
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(6,13,41,0.04), 0 8px 24px -8px rgba(6,13,41,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
