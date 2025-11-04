import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "drift": {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.1" },
          "50%": { opacity: "0.3" },
          "100%": { transform: "translate(var(--drift-x), var(--drift-y)) rotate(var(--drift-rotate))", opacity: "0.05" },
        },
        "fly-in": {
          "0%": { transform: "translate(var(--start-x), var(--start-y)) scale(0.3)", opacity: "0" },
          "100%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 4px hsl(var(--accent-animation)))" },
          "50%": { filter: "drop-shadow(0 0 12px hsl(var(--accent-animation))) drop-shadow(0 0 24px hsl(var(--accent-animation)))" },
        },
        "flow-together": {
          "0%": { transform: "translateX(var(--offset-x))", opacity: "1" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "char-flip": {
          "0%": { transform: "rotateX(0deg)", color: "hsl(0 0% 100%)" },
          "50%": { transform: "rotateX(90deg)", color: "hsl(var(--accent-animation))" },
          "100%": { transform: "rotateX(0deg)", color: "hsl(var(--accent-animation))" },
        },
        "particle-chaos": {
          "0%": { transform: "translate(0, 0)", opacity: "0.8" },
          "100%": { transform: "translate(var(--particle-x), var(--particle-y)) rotate(var(--particle-rotate))", opacity: "0.3" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0, 0)", filter: "hue-rotate(0deg)" },
          "25%": { transform: "translate(-2px, 2px)", filter: "hue-rotate(90deg)" },
          "50%": { transform: "translate(2px, -2px)", filter: "hue-rotate(180deg)" },
          "75%": { transform: "translate(-2px, -2px)", filter: "hue-rotate(270deg)" },
        },
        "collapse": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.1)", opacity: "0.8" },
        },
        "explode": {
          "0%": { transform: "scale(0.1)", opacity: "0.8" },
          "50%": { transform: "scale(1.5)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "drift": "drift 60s ease-in-out infinite",
        "fly-in": "fly-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "flow-together": "flow-together 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "char-flip": "char-flip 0.4s ease-in-out",
        "particle-chaos": "particle-chaos 1.5s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "collapse": "collapse 0.8s cubic-bezier(0.4, 0, 0.6, 1)",
        "explode": "explode 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
