# Indian Hirers — project memory

Redesign of the website for a family-run crockery and event-tableware rental
business in Vadodara, Gujarat. Static marketing + catalogue site whose only job
is to earn an enquiry by WhatsApp, phone or form.

## Repo layout

```
IndianHirers/                 ← git root; Claude Code starts here
├── CLAUDE.md  .claude/rules  .claude/agents  HARNESS_NOTES.md
├── Docs/                     ← product specs: PRD, TRD, UI_UX, App_Flow, Backend_Schema,
│                               Implementation_Plan, Phase3_Assets, LOGO (TM).jpg
└── indian-hires-website/     ← the Next.js app; run every npm command from here
    ├── src/app  src/components  src/content  src/lib
    ├── scripts/              ← verify.sh, check-tokens.mjs, contrast/screenshots/audit (QA), image pipeline (Python)
    └── docs/                 ← BASELINE, QA_LOOP, RUBRIC, color-system, graphs/, evidence/
```

`Docs/` (specs) and `indian-hires-website/docs/` (engineering) are different folders.

## Brand facts — copy exactly, never paraphrase

| | |
|---|---|
| Name | **Indian Hirers** (two words; not "IndianHirers", not "Indian Hires") |
| Mark | **Gabhawalas** (crest reads "IH Gabhawalas") |
| Tagline | **An Occasion with Dignity** |
| City | Vadodara, Gujarat |
| Phones | 8734090908 (primary, WhatsApp) · 9825037478 · 9925515029 (Jay Gabhawala) |
| Email | indianhires@gmail.com |
| Office | 3-4 Sandalwood Residency, Nr Urmi Char Rasta, Akota, Vadodara – 390020 |
| Highway office | Plot No. 137, Bruhshellz Industrial Park, Opp GSFC Township Gate, Dashrath, Vadodara – 391740 |
| GSTIN | 24AABPG5066D1Z8 — **footer only**, never as a trust badge |

History: founded 1977 in Malad, Mumbai; in Vadodara since 2001; three generations.
No prices anywhere on the site — the catalogue PDFs carry wholesale rates that must
never be published (`NoPricing` type in `src/content/products.ts` enforces this).

Colour: the palette is warm, hue 10°–46°, sampled from the logo (`#702010`).
`#800020` is wrong and is not the logo. Authority: `indian-hires-website/docs/color-system.md`.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind 3 · shadcn/ui · lucide-react ·
react-hook-form + zod · Web3Forms · Vercel.

**Motion: `motion`** (framer-motion's successor), installed in R1. `framer-motion`, `gsap`
and AOS are gone. Scroll reveals, counters, the page fade and drawers are CSS-driven
primitives in `src/components/motion` and load no library; `motion` itself loads only
through `@/components/motion/engine` around the catalogue grid and the gallery lightbox.
Client components join classes with `cx` (`src/lib/cx.ts`), never `cn` — `cn` ships
tailwind-merge to the browser. QA tooling (devDependencies): `playwright`, `lighthouse`,
`@axe-core/playwright`.
Ask before installing or removing any package.

## Non-negotiables

1. Static-export friendly. No backend, no API routes, no server actions, no database.
2. Lighthouse Performance ≥ 95 and Accessibility ≥ 95, mobile profile.
3. WCAG 2.1 AA.
4. Mobile-first: design and build at 390px, then scale up.
5. All copy and catalogue data live in `src/content/*.ts`, typed. No hard-coded
   strings in components — that includes nav labels, alt text, aria-labels, metadata.
6. Phone, WhatsApp, email and map URL come from env vars via `src/lib/env.ts`.
7. Colours only through tokens (CSS variables → Tailwind theme). No raw hex in components.
8. Animate `transform` and `opacity` only; every animation honours reduced motion.

Detail for each lives in `.claude/rules/`: `design-tokens.md`, `motion.md`,
`content.md`, `a11y.md`, `performance.md`.

## Commands — run from `indian-hires-website/`

```bash
npm run dev         # http://localhost:3001
npm run lint        # next lint
npm run typecheck   # tsc --noEmit
npm run build       # next build
npm run verify      # lint → typecheck → build → check-tokens; stops at first failure
```

**Server discipline — same order every iteration.** `verify` refuses to run while port
3001 is in use (a build under a live dev server corrupts `.next`).

1. Stop the dev server: `lsof -ti tcp:3001 | xargs kill`
2. `npm run verify`
3. Start `rm -rf .next && npm run dev` in the background (port 3001)
4. Capture screenshots and run Lighthouse
5. Stop the server again before the next verify — subagents never leave one running

`src/content/products.ts` is generated — edit the Python tables in `scripts/`, not the `.ts`.

**Due in the token phase:** once the redesign tokens and `.theme-dark` exist, `check-tokens.mjs`
fails on stock `white`/`black` classes (except in `.theme-dark` and on the WhatsApp button)
and every offender is fixed. Detail: `.claude/rules/design-tokens.md`.

## How work is done

Every phase runs the loop in `indian-hires-website/docs/QA_LOOP.md`:
PLAN → BUILD → `npm run verify` → VISUAL CHECK → CRITIQUE → FIX, max 4 iterations.
Scoring is against `docs/RUBRIC.md`. Starting state is `docs/BASELINE.md`.

Agents in `.claude/agents/`: `design-architect`, `content-architect`,
`motion-engineer`, `ui-builder`, `reviewer` (read-only), `qa-a11y-perf` (read + bash).
The agent that builds never scores its own work — `reviewer` does.

## Definition of Done (per phase)

- [ ] `npm run verify` exits 0; output saved to `docs/evidence/<phase>/verify.log`
- [ ] Screenshots at 390, 768, 1280 and 1920px for every touched route, saved to
      `docs/evidence/<phase>/`
- [ ] Every `docs/RUBRIC.md` item scored ≥ 4/5 by `reviewer`, with file:line evidence
- [ ] Lighthouse Performance ≥ 95 and Accessibility ≥ 95 — numbers recorded, or
      "not measured" stated with the reason
- [ ] Keyboard pass: skip link, nav, mobile drawer, any carousel, form
- [ ] Reduced-motion pass: page is complete and usable with motion off
- [ ] No new hard-coded strings, raw colours, or `any`
- [ ] No route's First Load JS above its budget in `.claude/rules/performance.md`
- [ ] Unresolved items written to `docs/OPEN_ISSUES.md`, not silently dropped
- [ ] Nothing reported as done on "it should work" — evidence is command output
      and screenshot paths
