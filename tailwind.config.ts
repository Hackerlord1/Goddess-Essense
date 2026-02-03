// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Pink Palette
        primary: {
          50: "#FFF0F5",
          100: "#FFE4EC",
          200: "#FFCCD9",
          300: "#FFB3C6",
          400: "#FF8FAB",
          500: "#FF6B8A",
          600: "#E84A6F",
          700: "#C93A5E",
          800: "#A32A4D",
          900: "#7D1A3C",
        },
        // Secondary Lavender Palette
        secondary: {
          50: "#F8F5FF",
          100: "#F0EBFF",
          200: "#E4DBFF",
          300: "#D4C4FF",
          400: "#C4ADFF",
          500: "#B396FF",
          600: "#9B7AE6",
          700: "#7D5CBF",
          800: "#5F3F99",
          900: "#412273",
        },
        // Accent Colors
        accent: {
          peach: "#FFCBA4",
          coral: "#FF7F7F",
          mint: "#98FF98",
          gold: "#FFD700",
          cream: "#FFFDD0",
        },
        // Neutral Colors
        goddess: {
          white: "#FFFFFF",
          cream: "#FFF9F5",
          light: "#FEF6F3",
          muted: "#F5E6E0",
          gray: "#9CA3AF",
          dark: "#4A4A4A",
          black: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-dancing)", "cursive"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-goddess": "linear-gradient(135deg, #FFE4EC 0%, #F0EBFF 50%, #FFE4EC 100%)",
        "gradient-hero": "linear-gradient(180deg, #FFF0F5 0%, #F8F5FF 100%)",
      },
      boxShadow: {
        soft: "0 2px 15px rgba(255, 107, 138, 0.1)",
        goddess: "0 4px 20px rgba(255, 107, 138, 0.15)",
        hover: "0 8px 30px rgba(255, 107, 138, 0.2)",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "bounce-soft": "bounceSoft 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};