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
