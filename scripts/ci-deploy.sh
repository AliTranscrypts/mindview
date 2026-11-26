#!/bin/sh
# MindView deploy: verify the baseline, stage the site, deploy to Cloudflare Pages.
#
# Used by .github/workflows/deploy.yml on every push (main → production,
# staging → https://staging.mindview.pages.dev) and by scripts/safe-deploy.sh.
#
# Why a staging folder: the repo holds files that must never be served, chiefly
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
# Everything except repo plumbing, Functions (bundled separately) and
# never-serve sources. Keep this list in sync with CLAUDE.md §"Deploy procedure".
rsync -a \
  --exclude '/.git' \
  --exclude '/.github' \
  --exclude '/.deploy' \
  --exclude '/.wrangler' \
  --exclude '/functions' \
  --exclude '/modules-src' \
  --exclude 'node_modules' \
  --exclude '.DS_Store' \
  ./ .deploy/

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
