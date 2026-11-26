#!/bin/sh
# Keep shipping whatever builders have queued (FAST mode), one ship at a time, until STOP file appears
# or nothing is left to build. Log: modules-src/.artifacts/ship-loop.log
REPO=$(cd "$(dirname "$0")/../.." && pwd); cd "$REPO"
A=modules-src/.artifacts; LOG=$A/ship-loop.log
while [ ! -f "$A/ship-loop.STOP" ]; do
  if [ -s "$A/ship-queue.txt" ]; then
    echo "=== $(date '+%H:%M:%S') ship: $(tr '\n' ' ' < $A/ship-queue.txt)" >> "$LOG"
    FAST=1 sh modules-src/tools/ship-queue.sh > "$A/ship-last.log" 2>&1
    echo "    exit $? — $(grep -E 'Live and tested|❌' $A/ship-last.log | tr '\n' ' ')" >> "$LOG"
  else
    left=$(python3 -c "import json,glob;print(sum(1 for f in glob.glob('modules-src/courses/*/course.json') for m in json.load(open(f))['modules'] if m.get('status','todo')!='live'))")
    [ "$left" = 0 ] && { echo "=== all live" >> "$LOG"; break; }
    sleep 20
  fi
done
