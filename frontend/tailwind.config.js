/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      utilities: {
        ".gpu": {
          transform: "translateZ(0)",
          "will-change": "transform, opacity",
        },
      },
      fontFamily: {
        qurova: ["Qurova", "sans-serif"],
        sporting: ["Sporting", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        bgmain: "#0a0a0a",
        bgpanel: "#1c1c1e",
        textpri: "#ffffff",
        textsec: "#a1a1a6",
        highlightcl: "#0a84ff",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-background": "var(--gradient-background)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        "custom-sm": "var(--shadow-sm)",
        "custom-md": "var(--shadow-md)",
        "custom-lg": "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
        bounce: "var(--transition-bounce)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtils = {
        ".no-outline": {
          outline: "none",
          ring: "0",
        },
        ".no-outline:focus": {
          outline: "none",
          ring: "0",
        },
        ".no-outline:focus-visible": {
          outline: "none",
          ring: "0",
        },
      };
      addUtilities(newUtils, ["responsive", "hover", "focus"]);
    },
  ],
};
