#!/bin/sh
# Ship built modules to production and test them live.
#
#   sh modules-src/tools/ship.sh "<commit subject>" course:NN [course:NN ...]
#
# 1. Regenerates hubs + chapter links + PROGRESS.md for the courses named.
# 2. Commits the module outputs, sources and site links (only these paths) and pushes main.
# 3. Deploys: if the repo has the CLOUDFLARE_API_TOKEN secret, waits for the GitHub Actions
#    deploy of this commit; otherwise deploys locally with scripts/ci-deploy.sh (same steps).
# 4. Runs modules-src/tools/prod-test.mjs on the shipped modules; marks them "live" on success
#    (that status change is committed with the next ship).
set -e
REPO=$(cd "$(dirname "$0")/../.." && pwd)
cd "$REPO"
SUBJECT="$1"; shift
[ -n "$SUBJECT" ] && [ $# -gt 0 ] || { echo "usage: ship.sh \"subject\" course:NN ..."; exit 2; }

OKLIST=""
echo "→ Rebuilding with the current toolkit and running the ${FAST:+quick }check …"
for t in "$@"; do
  # Full output is kept in .artifacts/check-<course><NN>.log. Under heavy load (many builders running
  # browsers) a check can time out, so a failure is retried once before the ship is refused.
  LOG="modules-src/.artifacts/check-${t%%:*}${t##*:}.log"
  ok=0
  for attempt in 1 2; do
    if (cd modules-src && node build/assemble.mjs "${t%%:*}" "${t##*:}" >/dev/null && node build/check.mjs "${t%%:*}" "${t##*:}" ${FAST:+--static-only}) > "$LOG" 2>&1 \
       && grep -q "✓ PASS ${t%%:*} " "$LOG"; then ok=1; break; fi
    [ "$attempt" = 1 ] && echo "  check failed for $t (attempt 1) — retrying" && sleep 10
  done
  grep -E "PASS|FAIL" "$LOG" | grep -v hub
  if [ "$ok" != 1 ]; then
    echo "❌ check failed for $t — not shipping it. Details:"; grep -E "✗|FAIL|Error" "$LOG" | head -12
    # FAST mode: drop the failing module from this batch (logged for follow-up) instead of blocking the rest.
    [ -n "$FAST" ] || exit 1
    echo "$t" >> modules-src/.artifacts/ship-failed.txt
  else OKLIST="$OKLIST $t"; fi
done
set -- $OKLIST
[ $# -gt 0 ] || { echo "❌ nothing left to ship in this batch"; exit 1; }
for t in "$@"; do
  c="${t%%:*}"; n="${t##*:}"
  st=$(python3 -c "import json,sys;d=json.load(open('modules-src/courses/$c/course.json'));print(next(m.get('status','todo') for m in d['modules'] if m['nn']=='$n'))")
  [ "$st" = "live" ] || python3 modules-src/tools/progress.py set "$c" "$n" built ""
done
COURSES=$(for t in "$@"; do echo "${t%%:*}"; done | sort -u)
for c in $COURSES; do
  (cd modules-src && node build/hub.mjs "$c" >/dev/null)
  python3 modules-src/tools/link-chapters.py "$c"
done
python3 modules-src/tools/progress.py

(cd modules-src && node build/check.mjs --all --static-only | tail -1)

git checkout -q .wrangler/cache/pages.json 2>/dev/null || true
# Stage only what belongs to this ship: the named modules (sources + page), the hubs and chapter
# pages of their courses, tracking files and shared tooling. Other builders' in-progress files stay out.
git add .github scripts CLAUDE.md .gitignore modules-src/toolkit modules-src/build modules-src/tools \
        modules-src/BUILDER-GUIDE.md modules-src/PROGRESS.md modules-src/package.json modules-src/package-lock.json \
        modules-src/courses/*/course.json
for t in "$@"; do
  c="${t%%:*}"; n="${t##*:}"
  eval "$(python3 -c "import json;d=json.load(open('modules-src/courses/$c/course.json'));m=next(x for x in d['modules'] if x['nn']=='$n');print('SITE=%s; ID=%s-%s' % (d['site'],m['nn'],m['slug']))")"
  git add "modules-src/courses/$c/$ID" "courses/$SITE/modules/$ID.html" "courses/$SITE/modules/index.html" "courses/$SITE"/ch*.html
done
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  BODY="Modules: $*"
  printf '%s\n\n%s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n' "$SUBJECT" "$BODY" | git commit -q -F -
fi
SHA=$(git rev-parse HEAD)
git push -q origin main
echo "Pushed $(git log --oneline -1)"

if gh secret list -R AliTranscrypts/mindview 2>/dev/null | grep -q CLOUDFLARE_API_TOKEN; then
  echo "→ Waiting for the GitHub Actions deploy of $SHA …"
  RID=""
  for i in $(seq 1 30); do
    RID=$(gh run list -R AliTranscrypts/mindview --commit "$SHA" --json databaseId -q '.[0].databaseId' 2>/dev/null || true)
    [ -n "$RID" ] && break
    sleep 5
  done
  [ -n "$RID" ] || { echo "❌ no workflow run found for $SHA"; exit 1; }
  gh run watch "$RID" -R AliTranscrypts/mindview --exit-status >/dev/null || { echo "❌ CI deploy failed: https://github.com/AliTranscrypts/mindview/actions/runs/$RID"; exit 1; }
  echo "✓ CI deploy finished (run $RID)"
else
  echo "→ No CLOUDFLARE_API_TOKEN secret yet; deploying locally."
  deployed=0
  for attempt in 1 2 3; do
    out=$(BRANCH=main sh scripts/ci-deploy.sh 2>&1 || true)
    echo "$out" | grep -E "Uploaded|Deployment complete|❌|ERROR" || true
    git checkout -q .wrangler/cache/pages.json 2>/dev/null || true
    if echo "$out" | grep -q "Deployment complete"; then deployed=1; break; fi
    echo "  deploy attempt $attempt failed; retrying in 20 s"; sleep 20
  done
  [ "$deployed" = 1 ] || { echo "❌ deploy failed 3 times — commit is pushed but not live"; exit 1; }
fi

sleep 5
if QUICK=${FAST:+1} node modules-src/tools/prod-test.mjs "$@"; then
  for t in "$@"; do python3 modules-src/tools/progress.py set "${t%%:*}" "${t##*:}" live; done
  echo "✓ Live and tested: $*"
else
  echo "❌ Prod test failed — investigate before shipping more."
  exit 1
fi
