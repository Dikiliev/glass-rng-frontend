import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "drift": {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.3" },
          "50%": { opacity: "0.6" },
          "100%": { transform: "translate(100vw, 100vh) rotate(360deg)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--glow-primary) / 0.3)",
            filter: "brightness(1)"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--glow-primary) / 0.6)",
            filter: "brightness(1.2)"
          },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fly-in": {
          "0%": { 
            transform: "translate(var(--start-x), var(--start-y)) scale(0.5)", 
            opacity: "0" 
          },
          "100%": { 
            transform: "translate(0, 0) scale(1)", 
            opacity: "1" 
          },
        },
        "merge": {
          "0%": { transform: "translateX(var(--offset))", opacity: "1" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "morph": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.1) rotate(180deg)" },
        },
        "collapse": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(0.7)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.8" },
        },
        "expand-result": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // New effects (inspired by visual-solana-spark)
        "spark-travel": {
          "0%": { transform: "translateX(-120%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateX(220%)", opacity: "0" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "grid-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(var(--orbit-r)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg)" },
        },
        "result-burst": {
          "0%": { transform: "scale(0.8)", filter: "blur(4px)", opacity: "0" },
          "60%": { transform: "scale(1.15)", filter: "blur(0px)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.6" },
        },
        // From visual-solana-spark
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
        "explode": {
          "0%": { transform: "scale(0.1)", opacity: "0.8" },
          "50%": { transform: "scale(1.5)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "drift": "drift 30s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "fly-in": "fly-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "merge": "merge 1s ease-out",
        "morph": "morph 1s ease-in-out",
        "collapse": "collapse 2s ease-in-out infinite",
        "expand-result": "expand-result 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        // New animations
        "spark-travel": "spark-travel 1.2s ease-in-out infinite",
        "scanline": "scanline 1.4s linear infinite",
        "grid-pop": "grid-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "orbit": "orbit 1.8s linear infinite",
        "result-burst": "result-burst 0.7s ease-out",
        "flicker": "flicker 2.5s ease-in-out infinite",
        // From visual-solana-spark
        "flow-together": "flow-together 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "char-flip": "char-flip 0.4s ease-in-out",
        "particle-chaos": "particle-chaos 1.5s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "explode": "explode 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;


