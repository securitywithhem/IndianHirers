# QA loop

Every phase of the redesign runs this loop. A phase is not done until the loop
exits through one of the two stop conditions below.

```
PLAN → BUILD → npm run verify → VISUAL CHECK → CRITIQUE → FIX ─┐
  ▲                                                            │
  └────────────────── next iteration (max 4) ──────────────────┘
```

Commands run from `indian-hires-website/`. Evidence for a phase goes in
`docs/evidence/<phase>/` (for example `docs/evidence/R1/`).

## Server discipline

`scripts/verify.sh` refuses to run while port 3001 is in use: `next build` and
`next dev` share `.next`, and a build under a live dev server corrupts it. Every
iteration therefore runs in this order, with no exceptions:

| # | Step | Command |
|---|---|---|
| 1 | Stop the dev server | `lsof -ti tcp:3001 \| xargs kill` (no output if nothing is running) |
| 2 | Verify | `npm run verify` |
| 3 | Start the dev server in the background | `rm -rf .next && npm run dev` — wait until `curl -sf http://localhost:3001` succeeds |
| 4 | Capture screenshots and run Lighthouse | against `http://localhost:3001` |
| 5 | Stop the server before the next verify | same command as step 1, then confirm the port is free |

- `rm -rf .next` in step 3 clears the production build verify just wrote, so the dev
  server never starts on a stale chunk map.
- **Subagents must never leave a server running when they finish.** Any agent that
  starts a server stops it and confirms `lsof -nP -iTCP:3001 -sTCP:LISTEN` prints
  nothing before it reports back. This holds on failure paths too.
- Do not use `VERIFY_ALLOW_DEV=1` to get around the port check.

## 1. PLAN

Write down, before touching code:

- what this iteration changes and which files it touches
- which rubric items it is meant to raise, and from what score
- which agent owns each part (`design-architect`, `content-architect`,
  `motion-engineer`, `ui-builder`)
- anything that needs the owner's approval first (a new package, a deleted file,
  a business fact)

On iterations 2–4 the plan is the previous CRITIQUE's findings, most severe first.

## 2. BUILD

Make the change. Stay inside the plan; note anything discovered along the way in
`docs/OPEN_ISSUES.md` rather than fixing it silently.

## 3. VERIFY

```bash
npm run verify 2>&1 | tee docs/evidence/<phase>/verify-iter<N>.log
```

Stop the dev server first (step 1 of Server discipline). Runs lint → typecheck →
build → `check-tokens`, stopping at the first failure. A non-zero exit sends the loop
straight to FIX; do not go on to the visual check with a red build.

## 4. VISUAL CHECK

Screenshot every route the iteration touched at four widths:

| Width | Stands for |
|---|---|
| 390px | phone — the primary audience |
| 768px | tablet / breakpoint edge |
| 1280px | laptop |
| 1920px | desktop |

- Tooling: Claude in Chrome, or Playwright if installed. `HARNESS_NOTES.md` records
  what was available. If neither is, say so and ask the owner for screenshots —
  do not skip the step and do not describe a page that was not looked at.
- Only after verify has passed: start `npm run dev` in the background (step 3 of
  Server discipline) and take full-page captures from `http://localhost:3001`.
- Run Lighthouse in the same server session, and label the numbers as dev-server runs.
- Stop the server when captures and Lighthouse are finished (step 5).
- Capture one extra set at 390px with reduced motion emulated.
- Capture the mobile drawer open, and any hover/focus state the iteration changed.
- Name files `<route>-<width>[-<state>].png`, e.g. `home-390.png`,
  `home-390-reduced-motion.png`, `products-bone-china-1280.png`.
- Save to `docs/evidence/<phase>/iter<N>/`.

Look at each one. Check for overflow, clipped text, collisions with the fixed header
and bottom bar, unbalanced line breaks, images that did not load, and anything that
looks like a template.

## 5. CRITIQUE

A **separate reviewer pass** — the `reviewer` agent, never the agent that built.
It reads the changed files and the screenshots, re-runs verify, and scores all ten
items in `docs/RUBRIC.md` against the spec in `Docs/UI_UX_V2.md`. Where numbers are
needed for performance and accessibility, `qa-a11y-perf` supplies them.

Output is saved to `docs/evidence/<phase>/critique-iter<N>.md` and must contain the
ten scores and a findings list with `file:line` for every score below 5.

## 6. FIX

Address findings in severity order: blockers, then majors, then minors. Fixes go
back through VERIFY, VISUAL CHECK and CRITIQUE — that is the next iteration.

## Stop conditions

The loop ends when **either** is true:

1. **Pass** — every rubric item scores ≥ 4/5 **and** `npm run verify` exits 0.
2. **Iteration cap** — 4 iterations have been completed. Stop. Write every
   remaining finding to `docs/OPEN_ISSUES.md` (rubric item, score, `file:line`,
   what was tried, what is blocking it) and report the phase as **incomplete, with
   open issues**. Do not start a fifth iteration.

A score that has not moved in two consecutive iterations is also written to
`OPEN_ISSUES.md` straight away; repeating the same fix is not progress.

## Evidence rule

Never mark a phase done on "it should work".

Evidence is **command output and screenshot paths**. A phase report must include:

- the verify log path and its exit code
- the screenshot directory, with the files that exist in it
- the critique file path and the ten scores
- Lighthouse / axe numbers, or the explicit words "not measured" with the reason

If something was not run, not captured or not measured, the report says so in those
words. A skipped step is reported as skipped, not as passed.

## Phase report template

```
PHASE <id> — <PASS | INCOMPLETE, OPEN ISSUES>      iterations: n/4
verify:      exit <code>     docs/evidence/<phase>/verify-iter<N>.log
screenshots: docs/evidence/<phase>/iter<N>/   (<count> files)
critique:    docs/evidence/<phase>/critique-iter<N>.md
scores:      1:n 2:n 3:n 4:n 5:n 6:n 7:n 8:n 9:n 10:n   total nn/50
lighthouse:  perf nn · a11y nn      | not measured — <reason>
open issues: <count>, see docs/OPEN_ISSUES.md
```
