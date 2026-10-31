# CI/CD

GitHub Actions decides whether a change is good. Vercel builds and hosts it. No Vercel
token is stored in GitHub, because Vercel reads the GitHub check result itself.

```
pull request ─▶ Verify workflow + Vercel preview URL
merge to main ─▶ Verify workflow + Vercel production build (held, not live)
                     │
      "Quality gate" passes ─▶ Vercel makes the build live ─▶ Production smoke
      "Quality gate" fails  ─▶ the previous version stays live
```

## What runs

| Check | Workflow | When | Blocks release? |
|---|---|---|---|
| **Quality gate**: lint, typecheck, build, tokens, First Load JS budgets, smoke test, axe | `verify.yml` | PRs, pushes to `main` | **Yes** |
| Dependency review: new high-severity packages | `verify.yml` | PRs | Only if made required in GitHub |
| Catalogue tests (report) | `verify.yml` | PRs, pushes to `main` | No, 4 known failures (`OPEN_ISSUES.md` CI3) |
| Dependency audit (report) | `verify.yml` | PRs, pushes to `main` | No, known advisories (`OPEN_ISSUES.md` CI4) |
| Lighthouse mobile (report), scores in the job summary | `verify.yml` | After the gate passes | No, CI runners are too noisy to gate on |
| Production smoke test | `post-deploy.yml` | Each promotion, daily at 07:00 IST, on demand | No, it runs after release |
| Dependabot: weekly minor and patch updates | `dependabot.yml` | Weekly | Goes through the same gate |

Lighthouse in CI does not replace the ≥ 95 check in `QA_LOOP.md`.

## One-time setup

The gate does nothing until step 2 is done, and until then every push to `main` goes
live immediately.

1. Merge these workflows to `main` and let **Verify** finish once, so that Vercel can
   see the check name.
2. In Vercel, open **indian-hirers → Settings → Build and Deployment → Deployment
   Checks → Add Checks → GitHub**, and select **Quality gate**.
3. Confirm it holds: push a harmless commit to `main` and check that the deployment
   waits on the check before `indian-hirers.vercel.app` changes. Vercel's docs describe
   the hold in terms of custom domains and this project only has its `.vercel.app`
   address, so this needs seeing once.
4. When the real domain is live, set `NEXT_PUBLIC_SITE_URL` in Vercel and the
   `PRODUCTION_URL` repository variable in GitHub.

## Day to day

- **Run the gate locally:** `npm run verify`, then start the build and run
  `npm run smoke -- <url>`.
- **Gate failed:** open the failed step in the run. The logs and axe results are in
  the `quality-gate` artifact. Nothing has been released, so fix and push again.
- **A budget failed:** the ceilings are in `scripts/check-budgets.mjs` and
  `.claude/rules/performance.md`. Change both together, and only deliberately.
- **Renaming the "Quality gate" job:** update the Deployment Check in Vercel as well,
  or releases will wait on a check that never reports.
- **Node version:** `.nvmrc` must match the Node version in the Vercel project (24.x).

## When production is wrong

GitHub emails you when **Production smoke** fails. Check the site first; the script
retries, so a failure is rarely just a blip.

```bash
vercel rollback --scope securitywithem            # back to the previous production build
vercel promote <deployment-url> --scope securitywithem   # undo: re-enables automatic releases
```

The dashboard has the same actions under **Deployments → Instant Rollback**. After a
rollback, new pushes do not go live until you promote a deployment.

To release in an emergency while the gate is failing, use **Force Promote** on the
deployment's page in Vercel. Record why in `OPEN_ISSUES.md`.

## Environment variables

Production and preview values live in Vercel. The build inlines `NEXT_PUBLIC_*`, so a
changed value needs a redeploy. `verify.yml` has its own copy of the public contact
details, used only for the checks. It sets no Web3Forms key or map URL, so **a green
gate does not show that the form or map works on the live site.**
