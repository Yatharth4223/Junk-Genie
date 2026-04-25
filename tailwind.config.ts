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
        paper: "hsl(var(--paper))",
        "paper-dark": "hsl(var(--paper-dark))",
        kraft: "hsl(var(--kraft))",
        ink: "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        caution: "hsl(var(--caution))",
        rust: "hsl(var(--rust))",
        teal: "hsl(var(--teal))",
        "red-stamp": "hsl(var(--red-stamp))",
        bubble: "hsl(var(--bubble-pink))",
        sky: "hsl(var(--sky-blue))",
        grass: "hsl(var(--grass))",
        grape: "hsl(var(--grape))",
        /* Eco greens */
        "eco-leaf": "hsl(var(--eco-leaf))",
        "eco-forest": "hsl(var(--eco-forest))",
        "eco-moss": "hsl(var(--eco-moss))",
        "eco-sage": "hsl(var(--eco-sage))",
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
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        block: ["Archivo Black", "sans-serif"],
        bungee: ["Bungee", "sans-serif"],
        mono: ["Special Elite", "JetBrains Mono", "monospace"],
        marker: ["Permanent Marker", "cursive"],
        hand: ["Caveat", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-up": {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-12px)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "flicker": {
          "0%,100%": { opacity: "1" },
          "45%": { opacity: "1" },
          "50%": { opacity: "0.4" },
          "55%": { opacity: "1" },
        },
        "wiggle": {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%":     { transform: "rotate(3deg)" },
        },
        "bounce-soft": {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out both",
        "float-up": "float-up 4s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "flicker": "flicker 3s infinite",
        "wiggle": "wiggle 1.4s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
