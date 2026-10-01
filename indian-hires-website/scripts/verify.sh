#!/usr/bin/env bash
# Verification gate for every phase of the redesign. Run as `npm run verify`.
#
# Runs lint -> typecheck -> build -> token check, in that order, and stops at
# the first failure with that step's exit code. See docs/QA_LOOP.md.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

DEV_PORT=3001

# `next build` and `next dev` share .next. Building under a live dev server
# replaces its chunk map and it starts serving 500s (MODULE_NOT_FOUND on
# vendor-chunks) that look exactly like a code regression. Refuse up front.
if [ "${VERIFY_ALLOW_DEV:-0}" != "1" ] && command -v lsof >/dev/null 2>&1; then
  if lsof -nP -iTCP:"$DEV_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "verify: a server is listening on :$DEV_PORT (npm run dev?)." >&2
    echo "verify: stop it first — building would corrupt its .next directory." >&2
    echo "verify: afterwards restart with: rm -rf .next && npm run dev" >&2
    exit 1
  fi
fi

step() {
  local label="$1"
  shift
  printf '\n==> [%s] %s\n' "$label" "$*"
  if "$@"; then
    printf '==> [%s] PASS\n' "$label"
  else
    local code=$?
    printf '\n==> [%s] FAIL (exit %d)\n' "$label" "$code" >&2
    printf 'verify: FAILED at %s — stopping.\n' "$label" >&2
    exit "$code"
  fi
}

step "1/4 lint" npm run lint
step "2/4 typecheck" npm run typecheck
step "3/4 build" npm run build
step "4/4 tokens" node scripts/check-tokens.mjs

printf '\nverify: ALL PASS\n'
