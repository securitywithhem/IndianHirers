# Harness notes — Phase R0

Set up 2 Oct 2026. Nothing was installed or enabled. No page, component or style
was modified, and no file was deleted.

## Skills and plugins

| Requested | Available? | Used in R0? | Notes |
|---|---|---|---|
| frontend-design | yes (plugin) | no | design phases only |
| impeccable | yes (user skill) | no | design phases only |
| emilkowalski-skills | yes (user skill: emil-design-eng, animation-vocabulary, apple-design, find-animation-opportunities, improve-animations) | no | motion phases |
| taste-skill | yes (user skill, incl. redesign-skill) | no | design phases |
| ui-ux-pro-max-skill | yes (user skill `ui-ux-pro-max`) | no | design phases |
| superpowers | yes (plugin) | no | R0 was a fully specified task; no brainstorming or planning skill was needed |
| vercel | yes (plugin skills + MCP connector) | no | no deploy in R0 |
| understand-anything | yes (plugin: skills + agents) | no | would spawn several analysis agents for a 44-file codebase; graphify covered the graph |
| graphify | yes (skill + CLI at `~/.local/bin/graphify`) | **yes** | `graphify update src` — AST only, no LLM calls |
| code-review-graph | **not available** | — | no skill, plugin or CLI by that name. Closest: `code-review`, `engineering:code-review` |
| gstack | **not available** | — | no skill, plugin or CLI by that name |

## Verification tooling

| Tool | Available? | Effect |
|---|---|---|
| ESLint, `tsc`, `next build` | yes | steps 1–3 of `npm run verify` |
| `scripts/check-tokens.mjs` | yes (new) | step 4 |
| Lighthouse | **no** — not in `node_modules`, not on PATH | performance/accessibility scores cannot be measured yet |
| axe (`@axe-core/cli`) | **no** | same |
| Playwright | **no** | no scripted screenshots |
| Claude in Chrome | **not connected** in this session | no browser screenshots |

Consequence: the VISUAL CHECK step of `docs/QA_LOOP.md` and rubric items 9 and 10
have no working tooling today. Baseline Lighthouse numbers were not captured.

## Decisions needed before R1

1. **Screenshots + Lighthouse** — approve installing `playwright` and `lighthouse`
   as devDependencies, or connect Claude in Chrome. One of these is required for the
   loop to run as written.
2. **Motion library** — approve adding `motion` and removing `framer-motion` and
   `gsap`. AOS is already gone from the codebase.
3. **`Docs/UI_UX_V2.md` does not exist yet.** The QA loop and `reviewer` score
   against it; until it is written they fall back to `Docs/UI_UX.md` and the rubric.
4. **Catalogue PDFs are not in the repo.** If the redesign should cover more of the
   range than the 21 photographed pieces, they need adding (rates must stay out).

## Where things were put

The repo root holds the specs (`Docs/`) and the app sits in `indian-hires-website/`,
so the harness is split:

- Repo root: `CLAUDE.md`, `.claude/rules/`, `.claude/agents/`, this file — where
  Claude Code loads them from.
- `indian-hires-website/`: `scripts/verify.sh`, `scripts/check-tokens.mjs`,
  `docs/BASELINE.md`, `docs/QA_LOOP.md`, `docs/RUBRIC.md`, `docs/graphs/baseline.*`,
  `docs/evidence/R0/verify-baseline.log` — next to `package.json`.

macOS treats `Docs/` and `docs/` at the repo root as the same folder, which is why
the engineering docs went under the app directory rather than a root `docs/`.

## Additions beyond the brief

- `verify.sh` refuses to run while port 3001 is listening (a build under a live
  `next dev` corrupts `.next`). Override with `VERIFY_ALLOW_DEV=1`.
- `check-tokens.mjs` also catches `rgb()/hsl()` literals and colour inside any
  Tailwind arbitrary value (shadows, gradients), skips comments, prints non-failing
  warnings for stock `white`/`black` classes, and supports a
  `// check-tokens-ignore: <reason>` marker.
- `package.json`: added `typecheck` and `verify` scripts only.

## Amendments after R0

- **Server discipline** (in `CLAUDE.md`, `docs/QA_LOOP.md` and the three Bash-capable
  agents): stop dev server → `npm run verify` → start `npm run dev` on 3001 in the
  background → screenshots and Lighthouse → stop the server before the next verify.
  Subagents never leave a server running.
- **White/black gate, not yet applied.** Once the redesign tokens and the `.theme-dark`
  scope exist, `check-tokens.mjs` turns stock `white`/`black` classes into failures
  (exempt: inside `.theme-dark`, and the WhatsApp button) and all offenders are fixed.
  Neither the tokens nor `.theme-dark` existed when this was requested, so it is
  recorded in `.claude/rules/design-tokens.md` as a task for the token phase. Today
  those classes are still warnings: 13 in the baseline.

## Baseline verify

`npm run verify` → exit 1. Lint, typecheck and build pass; `check-tokens` fails with
6 raw-colour offenders. Details in `indian-hires-website/docs/BASELINE.md` §1.
