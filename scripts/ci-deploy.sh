#!/bin/sh
# MindView deploy: verify the baseline, stage the site, deploy to Cloudflare Pages.
#
# Used by .github/workflows/deploy.yml on every push (main → production,
# staging → https://staging.mindview.pages.dev) and by scripts/safe-deploy.sh.
#
# Deploys git HEAD, not the working tree. Why a staging folder: the repo holds files that must never be served, chiefly
# modules-src/ (interactive-module sources with readable answer keys). Wrangler
# uploads every file in the folder it is given, so we copy the site into .deploy/
# without them. Wrangler is still run from the repo root so that ./functions is
# bundled as the Pages Functions (running it from elsewhere silently drops them).
#
# Env:
#   BRANCH                 main (production) or staging; default staging
#   CLOUDFLARE_API_TOKEN   needed in CI; locally a `wrangler login` session works
#   CLOUDFLARE_ACCOUNT_ID  optional locally (wrangler finds the account)
#   FORCE=1                deploy even if the baseline check fails (don't)
#   DRY_RUN=1              stage only; print what would be deployed

set -e
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$REPO_ROOT"

BRANCH="${BRANCH:-staging}"
WRANGLER_VERSION="4.168.0"

echo "→ Verifying baseline…"
if ! python3 scripts/verify-baseline.py; then
  if [ "$FORCE" = "1" ]; then
    echo "⚠️  Baseline check failed but FORCE=1 — deploying anyway."
  else
    echo "❌ Refusing to deploy — baseline drift detected."
    exit 1
  fi
fi

echo "→ Staging site files in .deploy/ …"
rm -rf .deploy
mkdir .deploy
# Deploy exactly what is committed (HEAD), as CI does, so uncommitted or
# in-progress files in a working copy are never published. Then drop repo
# plumbing, Functions (bundled separately from ./functions) and never-serve
# sources. Keep this list in sync with CLAUDE.md §"Deploy procedure".
git archive --format=tar HEAD | tar -x -C .deploy
rm -rf .deploy/.github .deploy/.wrangler .deploy/functions .deploy/modules-src
find .deploy -name node_modules -prune -exec rm -rf {} + 2>/dev/null || true
find .deploy -name .DS_Store -delete
if [ -n "$(git status --porcelain -- . ':!modules-src' ':!.wrangler' 2>/dev/null)" ]; then
  echo "  note: uncommitted changes outside modules-src are NOT deployed (HEAD only)"
fi

if [ -d .deploy/modules-src ] || find .deploy -path '*modules-src*' | grep -q .; then
  echo "❌ modules-src leaked into the deploy folder — aborting."
  exit 1
fi
echo "  $(find .deploy -type f | wc -l | tr -d ' ') files staged"

if [ "$DRY_RUN" = "1" ]; then
  echo "DRY_RUN=1 — not deploying."
  exit 0
fi

echo "→ Deploying to Cloudflare Pages (branch: $BRANCH)…"
npx --yes "wrangler@$WRANGLER_VERSION" pages deploy .deploy \
  --project-name=mindview \
  --branch="$BRANCH" \
  --commit-dirty=true
