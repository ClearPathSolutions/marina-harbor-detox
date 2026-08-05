import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // SF bay & night-sky navy — the deep structural color (matches the logo's sky)
        navy: {
          50: "#eef2f9",
          100: "#dae2f0",
          200: "#b6c5e0",
          300: "#8aa1cc",
          400: "#5c78b0",
          500: "#3a5590",
          600: "#274073",
          700: "#1a2e54",
          800: "#122140",
          900: "#0c1830", // night sky (header/footer) — from the logo backdrop
          950: "#070f20",
        },
        // Golden Gate "International Orange" — the signature San Francisco accent
        orange: {
          50: "#fdf4f1",
          100: "#fbe2da",
          200: "#f5c0b1",
          300: "#ec9581",
          400: "#df6249",
          500: "#c8452e", // signature accent (Golden Gate bridge)
          600: "#ad3826",
          700: "#8f2d20",
          800: "#76271f",
          900: "#63231d",
        },
        // Sun amber gold — warm secondary accent (the rising sun in the logo)
        gold: {
          50: "#fbf6ea",
          100: "#f6e9c6",
          200: "#eed592",
          300: "#e3bd5a",
          400: "#d99a34", // sun amber
          500: "#c08327",
          600: "#a06a1f",
          700: "#7f531c",
          800: "#6a451b",
          900: "#5a3a19",
        },
        // Warm fog cream — light section backgrounds
        sand: {
          50: "#f8f5ef",
          100: "#f1ebe0",
          200: "#e4d9c6",
          300: "#d2bfa0",
          400: "#bfa47e",
          500: "#a6875f",
          600: "#886c4b",
          700: "#6d573d",
          800: "#5b4833",
          900: "#4c3c2c",
        },
        ink: "#1a1712",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(12, 24, 48, 0.18)",
        card: "0 20px 50px -20px rgba(12, 24, 48, 0.28)",
        lift: "0 30px 60px -25px rgba(12, 24, 48, 0.45)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        // ONE page container. There used to be a second, wider token (1560) and
        // sections picked between them, which put the header/hero left edge at
        // x=32 and every other section at x=52 on a 1440 viewport — a 20px
        // stagger, too small to read as intentional and too big to look aligned.
        content: "1400px",
        // The reading frame inside the container: article grid (prose + sidebar)
        // and every page-hero's inner content share it, so a page title and the
        // copy beneath it sit on the same left edge.
        article: "62rem",
        // Prose on its own, with no sidebar beside it. Keeps the measure at the
        // same ~64 characters the sidebar branch gets instead of running to 80.
        prose: "39rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
