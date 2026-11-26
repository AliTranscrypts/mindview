# Toolkit issues and promotion candidates

Collected from builder reports. Fix/promote in batches (bump toolkit/VERSION, rebuild and re-check
every module that uses the touched code, then ship them together).

## Bugs / core gaps
- `MV.player` called twice on the same host adds a second set of click listeners (07 works around it with a fresh host).
- Sliders with no `param` default to the blue pen colour; non-parameter sliders should default to ink (03 recolours in app.js).

- Matching (N6) appends "Try another partner." after every mismatch message, even when the plan's own message already ends with an invitation (05).
- FIXED 1.0.1: `.opt .m` was `white-space:nowrap`, so long math in answer options overflows on phones (06 patched in app.css).
- FIXED 1.0.1: `.btn` was flex with a gap, which splits labels that mix text and math ("y -axis") (06 patched in app.css).
- Plot: `Plot.line` ignores the alpha option; y tick labels clip at the left edge when the y-axis is off-screen (09).
- FIXED 1.0.2: plans list the correct option first, so answers were almost always A. The assembler now reorders 4-option lists (numeric → ascending, else deterministic shuffle; `fixedOrder:true` opts out).
- FIXED 1.0.3: step bar's hidden "(done)" text scrolled phones sideways once steps were done (10); check.mjs now re-tests phone overflow with every step done.
- FIXED 1.0.3: the assembler scrambled any key named `ok`, even text (12). Now only boolean `ok` marks answers.
- Review modules: score bands, key ideas, the Connect summary line and mixed-practice "modules to revisit" needed app.js overrides in 10 — generalise in the toolkit before 16/24/30/36/45/50 if they hit the same gaps.

- FIXED 1.0.4: long math in feedback, hints, refreshers and readouts didn't wrap on phones (11).

## Promotion candidates (code lives in the named module's app.js, tagged `@component`)
| Component | First built in | Notes |
|---|---|---|
| polyExact, polyLab, budgetBars, cardDeck | mhf4u 03 | |
| N9+N14 keyPointMapper, N5+N13 transformSequencer, N4 paramBoxes | mhf4u 07 | |
| N14 diffTable | mhf4u 04 | staggered difference columns, arrows, constant glow |
| N21 zeroBuilder (+G11 lens, G10 fit) | mhf4u 05 | reused by 10, 14, 15 |
| termTiles (N15 candidate), realZeros (exact Sturm count), mirror/half-turn ghosts | mhf4u 06 | |
| N29 sentenceBuilder, G5 secantScene, sk() sketch helper | mhf4u 08 | |
| N27 linkedPanels, N8 tapPoint, N14 secantTable, exactDec | mhf4u 09 | |
| topicTable, N8 tap marker, graph-option MC, tappable equation parts, fraction box, mixed-kind activity | mhf4u 10 | review module |
| N28 rootHunter (with its own synthetic-division step-through), N4 factorTray, groupingTiles, cubeVolumeModel | mhf4u 12 | |
| N22 syntheticDivision, G13 valueBar, N4 boxSet | mhf4u 11 | |
