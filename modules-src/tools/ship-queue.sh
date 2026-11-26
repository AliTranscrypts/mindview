#!/bin/sh
# Ship every module queued in modules-src/.artifacts/ship-queue.txt (one course:NN per line) in one batch.
#   echo mcv4u:09 >> modules-src/.artifacts/ship-queue.txt     # queue a finished module
#   sh modules-src/tools/ship-queue.sh                           # ship the whole queue (run one at a time)
# The commit subject lists the modules' codes and titles. The queue is cleared before shipping; a failed
# ship leaves those modules "built" so they can be re-queued.
set -e
REPO=$(cd "$(dirname "$0")/../.." && pwd)
cd "$REPO"
Q="modules-src/.artifacts/ship-queue.txt"
[ -s "$Q" ] || { echo "Queue empty."; exit 0; }
TARGETS=$(sort -u "$Q" | tr '\n' ' ')
: > "$Q"
SUBJECT=$(python3 - $TARGETS <<'EOF'
import json, sys
parts = []
for t in sys.argv[1:]:
    c, n = t.split(":")
    d = json.load(open(f"modules-src/courses/{c}/course.json"))
    m = next(x for x in d["modules"] if x["nn"] == n.zfill(2))
    parts.append(f'{d["code"]} {m["nn"]} {m["title"]}')
s = "; ".join(parts)
print(s if len(s) <= 140 else f"{len(parts)} modules: " + ", ".join(p.split(" ", 2)[0] + " " + p.split(" ", 2)[1] for p in parts))
EOF
)
git add modules-src/TOOLKIT-ISSUES.md modules-src/tools 2>/dev/null || true
sh modules-src/tools/ship.sh "$SUBJECT" $TARGETS
