import type { Config } from "tailwindcss";

/**
 * The Royal Banquet Table — theme.
 *
 * This file only EXPOSES tokens; every value lives in the `:root` block of
 * src/app/globals.css as a bare HSL triplet. Spec: Docs/UI_UX_V2.md.
 *
 * Colours are written `hsl(var(--x))` because the variables are bare triplets;
 * Tailwind injects alpha into that form, so `border-hairline/40` works.
 */
const token = (name: string): string => `hsl(var(--${name}))`;

const displayStack = ["var(--font-display)", "Georgia", "Times New Roman", "serif"];
const bodyStack = ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"];

const EASE_ROYAL = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_MOVE = "cubic-bezier(0.65, 0, 0.35, 1)";

const config = {
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
    screens: {
      // Mobile-first: design at 390px, then scale up.
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        /* ---- Primitive scales ---- */
        maroon: {
          950: token("maroon-950"),
          800: token("maroon-800"),
          700: token("maroon-700"),
        },
        gold: {
          700: token("gold-700"),
          500: token("gold-500"),
          300: token("gold-300"),
        },
        ivory: {
          50: token("ivory-50"),
          100: token("ivory-100"),
          300: token("ivory-300"),
        },
        espresso: {
          900: token("espresso-900"),
          600: token("espresso-600"),
        },
        whatsapp: token("whatsapp"),
        danger: token("danger"),
        "control-border": token("control-border"),

        /* ---- Semantic roles (flip inside .theme-dark) ---- */
        background: token("background"),
        foreground: token("foreground"),
        card: {
          DEFAULT: token("card"),
          foreground: token("card-foreground"),
        },
        popover: {
          DEFAULT: token("popover"),
          foreground: token("popover-foreground"),
        },
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
          hover: token("primary-hover"),
        },
        secondary: {
          DEFAULT: token("secondary"),
          foreground: token("secondary-foreground"),
        },
        muted: {
          DEFAULT: token("muted"),
          foreground: token("muted-foreground"),
        },
        accent: {
          DEFAULT: token("accent"),
          foreground: token("accent-foreground"),
        },
        destructive: {
          DEFAULT: token("destructive"),
          foreground: token("destructive-foreground"),
        },
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        heading: token("heading"),
        kicker: token("kicker"),
        link: token("link"),
        hairline: token("hairline"),
      },
      fontFamily: {
        display: displayStack,
        body: bodyStack,
        /* The label voice: eyebrows and small caps. It is the body face (Jost
         * 500, uppercase, 0.2em) — a third family is ruled out, so there is no
         * Cinzel. Kept as its own name so the label face has one switch point. */
        label: bodyStack,
        /* Tailwind's own `font-sans` / `font-serif` resolve to the brand faces,
         * so a stray stock class can no longer fall back to a system stack. */
        sans: bodyStack,
        serif: displayStack,
      },
      /* Fluid scale: 390px → 1440px. Prefer the `.type-*` classes in
       * globals.css, which add the family and survive tailwind-merge. */
      fontSize: {
        display: ["clamp(2.5rem, 1.757rem + 3.048vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em", fontWeight: "600" }],
        h2: ["clamp(2rem, 1.536rem + 1.905vw, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.005em", fontWeight: "600" }],
        h3: ["clamp(1.5rem, 1.314rem + 0.762vw, 2rem)", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["clamp(1.25rem, 1.157rem + 0.381vw, 1.5rem)", { lineHeight: "1.25", fontWeight: "600" }],
        stat: ["clamp(2.75rem, 2.286rem + 1.905vw, 4rem)", { lineHeight: "1", fontWeight: "600" }],
        lead: ["clamp(1.1875rem, 1.118rem + 0.286vw, 1.375rem)", { lineHeight: "1.55" }],
        body: ["clamp(1.0625rem, 1.039rem + 0.095vw, 1.125rem)", { lineHeight: "1.65" }],
        small: ["0.9375rem", { lineHeight: "1.55" }],
        caption: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.01em" }],
        eyebrow: ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.2em", fontWeight: "500" }],
        button: ["1rem", { lineHeight: "1.25", letterSpacing: "0.02em", fontWeight: "500" }],
      },
      letterSpacing: {
        eyebrow: "0.2em",
        display: "-0.01em",
      },
      spacing: {
        /* Section rhythm and page gutter, fluid 390px → 1440px. */
        section: "clamp(4rem, 2.886rem + 4.571vw, 7rem)",
        "section-sm": "clamp(3rem, 2.443rem + 2.286vw, 4.5rem)",
        gutter: "clamp(1.25rem, 0.971rem + 1.143vw, 2rem)",
        header: "var(--header-h)",
      },
      maxWidth: {
        content: "80rem",
        /* Line length 45–75 characters. A `ch` is the width of "0", and Jost's
         * average character is narrower: measured, one `ch` holds about 1.3
         * characters of running text. 54ch ≈ 70 characters, 48ch ≈ 63. */
        measure: "54ch",
        "measure-tight": "48ch",
        heading: "18ch",
        "heading-wide": "28ch",
      },
      borderRadius: {
        card: "0.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        /* Resting card. */
        card: "0 1px 2px hsl(var(--maroon-950) / 0.05), 0 6px 16px -6px hsl(var(--maroon-950) / 0.1)",
        /* Lifted card — static use only; `.card-royal` fades it in on hover. */
        lift: "0 2px 4px hsl(var(--maroon-950) / 0.06), 0 20px 40px -12px hsl(var(--maroon-950) / 0.22)",
        /* Solid header, below its gold hairline. */
        header: "0 8px 24px -16px hsl(var(--maroon-950) / 0.18)",
        /* Mobile bottom bar: gold hairline on top, soft shadow upward. */
        bar: "0 -1px 0 hsl(var(--gold-500) / 0.4), 0 -8px 24px -8px hsl(var(--maroon-950) / 0.12)",
      },
      backgroundImage: {
        "gold-gradient": "var(--gradient-gold)",
        "gold-sheen": "var(--gradient-gold-sheen)",
        "sheen-sweep": "var(--sheen-sweep)",
        "candle-glow": "var(--glow-candle)",
        linen: "var(--texture-linen)",
        "hero-scrim": "var(--scrim-hero)",
      },
      ringWidth: {
        /* shadcn's base-nova components ask for `ring-3`, which Tailwind 3
         * does not ship; without it their focus ring is silently absent. */
        3: "3px",
      },
      aria: {
        /* Lets shadcn's `aria-invalid:` error styles compile on Tailwind 3. */
        invalid: 'invalid="true"',
      },
      scale: {
        104: "1.04",
      },
      zIndex: {
        /* One ladder for every fixed layer, so they never fight. */
        bar: "40",
        header: "50",
        drawer: "60",
        lightbox: "70",
      },
      transitionTimingFunction: {
        royal: EASE_ROYAL,
        move: EASE_MOVE,
      },
      transitionDuration: {
        press: "120ms",
        hover: "180ms",
        enter: "350ms",
        "enter-lg": "500ms",
        zoom: "700ms",
        signature: "900ms",
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
        // Hero photograph: one slow push-in, then it rests. Not a loop.
        "ken-burns": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.08)" },
        },
        // Floating WhatsApp ring: expands and fades in the first 1.2s of a
        // 6s cycle, then stays invisible. Transform + opacity only.
        "whatsapp-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "20%": { transform: "scale(1.7)", opacity: "0" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        /* ---- Motion primitives (src/components/motion). Transform and
         * opacity only. Each ends on the element's own resting state. ---- */
        // Hero headline line, sliding up from behind its mask (<MaskLines>).
        "mask-line": {
          from: { transform: "translate3d(0, 125%, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        // Above-the-fold entrance (<EnterOnLoad>).
        "enter-rise": {
          from: { opacity: "0", transform: "translate3d(0, 16px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "enter-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Mobile bottom bar, from below the screen edge (<SlideUpAfter>).
        "bar-rise": {
          from: { transform: "translate3d(0, calc(100% + 1rem), 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Always write `motion-safe:animate-…` for these two.
        "ken-burns": `ken-burns 20s ${EASE_MOVE} 1 both`,
        "whatsapp-pulse": `whatsapp-pulse 6s ${EASE_ROYAL} infinite`,
        /* Motion primitives. Always `motion-safe:`; use them through the
         * components in src/components/motion, which also set the delay.
         * `backwards`: hidden only until the animation starts, and no
         * transform is left on the element once it has finished. */
        "mask-line": `mask-line 700ms ${EASE_ROYAL} backwards`,
        "enter-rise": `enter-rise 500ms ${EASE_ROYAL} backwards`,
        "enter-fade": `enter-fade 400ms ${EASE_ROYAL} backwards`,
        "bar-rise": `bar-rise 500ms ${EASE_ROYAL} 1200ms backwards`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
