import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
    screens: {
      // Mobile: 0–640px (Tailwind default sm: 640px boundary)
      sm: '640px',
      // Tablet: 641–1024px (md/lg range)
      md: '768px',
      lg: '1024px',
      // Desktop: 1025px+ (xl)
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* Wrapped in hsl() because the vars are bare HSL triplets. Passing the
           raw var produced invalid colours — see the note in globals.css. */
        maroon: 'hsl(var(--maroon))',
        'maroon-dark': 'hsl(var(--maroon-dark))',
        'maroon-deep': 'hsl(var(--maroon-deep))',
        gold: 'hsl(var(--gold))',
        'gold-deep': 'hsl(var(--gold-deep))',
        'gold-light': 'hsl(var(--gold-light))',
        cream: 'hsl(var(--cream))',
        ink: 'hsl(var(--ink))',
        night: 'hsl(var(--night))',
        surface: 'hsl(var(--surface))',
        'surface-2': 'hsl(var(--surface-2))',
        text: 'hsl(var(--cream))',
        whatsapp: 'hsl(var(--whatsapp))',
        
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
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
        // Decorative glow behind the logo finale. Opacity only — no transform,
        // so it composites off the main thread.
        "glow-pulse": {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
