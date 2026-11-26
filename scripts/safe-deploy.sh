#!/bin/sh
# MindView safe-deploy wrapper (manual deploys).
#
# Normal path since 2026-11-26: push to GitHub. .github/workflows/deploy.yml
# deploys main → https://mindview.pages.dev and staging → https://staging.mindview.pages.dev.
#
# This wrapper is for deploying by hand from a checkout. It delegates to
# scripts/ci-deploy.sh, which verifies the baseline, stages the site WITHOUT
# modules-src/ (never-serve sources), and runs wrangler from the repo root so
# Functions are bundled.
#
# By default deploys to STAGING (--branch=staging → https://staging.mindview.pages.dev).
# To deploy to PRODUCTION (--branch=main → https://mindview.pages.dev):
#   TARGET=production sh scripts/safe-deploy.sh
#
# Auth: a `wrangler login` session, or CLOUDFLARE_API_TOKEN in the environment.
# Override the baseline check (only if you must — and update CLAUDE.md):
#   FORCE=1 sh scripts/safe-deploy.sh

set -e
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)

BRANCH="${BRANCH:-staging}"
if [ "$TARGET" = "production" ]; then
  BRANCH="main"
  echo "🚨  TARGET=production — deploying to live https://mindview.pages.dev/"
else
  echo "→ Deploying to STAGING (https://staging.mindview.pages.dev/)"
  echo "  (Production: TARGET=production sh scripts/safe-deploy.sh)"
fi

BRANCH="$BRANCH" sh "$REPO_ROOT/scripts/ci-deploy.sh"
