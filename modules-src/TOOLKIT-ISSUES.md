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

- FIXED 1.0.5: one-off 4-choice quick checks also kept the plan's answer-first order (15); now reordered too. Repeated chip sets keep their order.

- Gap: no API to add results-summary lines / skills-to-review goals for interactives outside Practice (Part 3 steps, Explore builders). 19 registers them via MV.ACTS from app.js; document or generalise.

- Gap: N10 `MV.intervalBuilder` can't represent an isolated single point (forces a 0.5 gap); 16 added a "Single points" row.
- Review modules override `paintWarmResult`, `paintFinalCtl`, `summaryData`, `summaryText` (10, 16): generalise review score bands/key ideas/per-topic summary in the toolkit.

- Gaps (25): sorter has no "Use these values" box; numeric activity tolerance scales with the answer, has no π-box, and allows one box per item (25 built N4 piBoxes).

- Gaps (27): every failed challenge check counts as a try, even for invalid/setup states (no way to return "not counted"); no "challenge opened" event (modules use focus/tap or set-up buttons).

- Gotcha (31): the radical component uses generic class names (`.rb`); a module class `.rb` breaks every √. Namespace toolkit classes (e.g. `.mv-rb`) in a future version.

- Plot (47): `Plot.curve` clamps pixel x to 6 × canvas height, cutting curves on wide, short canvases.

- Challenge cards (46): removing a button inside a challenge card before the toolkit's click handler runs makes the handler throw.

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
| N15 moveChooser, N25 flattenMorph, N4 rootBoxes, dotLabels | mhf4u 13 | |
| N21 zeroSlots, exactQ | mhf4u 14 | |
| recipPieces (G1+G16), reciprocalTwin, G13 valueBar variant, N11 signLine, N6 graphMatch, N4 coefBoxes | mhf4u 18 | plan issue: TC1 answer equals the start state |
| N11 signChart (+ .build, signScanner), N25 flattenMorph with gap bars | mhf4u 15 | |
| approachLadder, exactQ, leadRace | mhf4u 17 | |
| linOverLin, G11 canvasFracLabel, N8 sketchBuilder, N6 graphMatch (from 18), N4 fracBoxes | mhf4u 20 | |
| sketchBuilder, N6 graphMatch (from 18), N4 coefTemplate | mhf4u 19 | registers summary lines via MV.ACTS from app.js |
| N26 factorTiles, N22 syntheticDivision (from 11), N6 graphMatch (from 20), N4 blankBoxes | mhf4u 21 | |
| chain ordering with spare slot, interval entry with single points, mixed-kind activity, per-topic key-idea tables | mhf4u 16 | review |
| N4 boxSet (from 11), drawTank, concDraw | mhf4u 23 | |
| N12 unitCircle | mhf4u 26 | reused by 27, 28, 30, 31, 34 |
| exactQ22, N11 signChart.rational | mhf4u 22 | |
| G8 circleDraw, N19 wheel, N19 beltPath, unitChain, N4 piBoxes, radioGroup | mhf4u 25 | |
| N23 overlayGauge, N12 unitCircle (copy), G8 circleDraw (arcAt/txt/eqLabel), radio chips, piS/exS/parsePi | mhf4u 27 | |
| (note) two N12 unit circles: 26 = special-angle table, CAST, reference arc/triangle, tappable dots; 27 = two arms, rotation arc / mirror line, coordinate segments | 26, 27 | merge into one toolkit N12 when promoting |
| G8 circleDraw, G13 valueBars, N9 angleSlider, radioGroup, valuePalette | mhf4u 28 | |
| N18 connectionBuilder, N26 factorTiles + sign-chart table, canvas tag/leader helpers | mhf4u 24 | review |
| N15 moveChooser (two-column LS/RS), N23 overlayGauge, N5 orderTray (decoy tray), N4 identityBoxes, exactRad | mhf4u 29 | |
| N24 circleGraphLink | mhf4u 31 | needed by 34, 35, 36 |
| insideRuler, N9 stepSlider, exactPiQ, N6 graphMatch, N4 waveBoxes | mhf4u 32 | |
| N23 overlayGauge, N4 sinBuilder, N8 keyPoints, N6 graphMatch, radioGroup, cycleRuler | mhf4u 33 | |
| N18 concept-map variant, N12 extended to π/12 and 5π/12, mixed-practice set, per-topic tables | mhf4u 30 | review |
| N9 heightSlider, radioGroup (from 28), N4 entryBoxes | mhf4u 34 | |
| N19+N24 wheelGraph, radioGroup with per-option disabling | mhf4u 35 | |
| statementBuilder, G11 canvasMath/edgeArrow/mirrorSeg, G9+G11 twinScene, N9 stepSlider (Shift-arrow) | mhf4u 37 | |
| G1+G6+G16 logWall, N8 logSketchBuilder, N4 logCoefBoxes, logExplorer, G11 canvasFracLabel (overlap skipping) | mhf4u 39 | |
| G4 powerLadder, exactPow, N4 pieceBoxes | mhf4u 38 | |
| K12 groupSort with multi-form cards, tide frame with brackets | mhf4u 36 | review |
| exactPow, G4+G14 logRuler, blockBars, N4 rangeBoxes | mhf4u 40 | plan issue: TC1 n = −4 feedback unreachable (slider −3…4) |
| lengthStrip, claimTester, N15 moveChooser (single-column), N4 coefBoxes, N9 markSlider | mhf4u 41 | |
| G4 logAxis (linear↔log morph, mirror), exampleLabels, N4+G4 rulerBoxes | mhf4u 42 | |
| N4 solutionSet (boxes + No solution toggle), gateLanes, radioGroup/N9 stepSlider with lock | mhf4u 44 | |
| N15 moveChooser.lock, N4 roundBoxes, stepSlider (settable count) | mhf4u 43 | |
| G1+G16 breakPieces, G13 scaleBars, stackedPanels, springAnim, N11 signChart.factorRows | mhf4u 47 | |
| functionPicker, tonePlayer, N27 linkedPanels (strip), G13 valueBar (stacked, clipped) | mhf4u 46 | |
| N18 concept map, gateLanes, G11 canvasMath | mhf4u 45 | review |
| N4 fillBoxes | mhf4u 48 | |
| V8 exactBox, areaTiles; move ∛ support into core MV.m | mcv4u 01 | course files: mcv4u.css (--f4, --f5, .vec.wide), mcv4u.js (MV.mcv.rpow, Q, S, exact.judge) |
| splitPlot, N6 storyMatch | mhf4u 49 | plan fix: TC3 slider range widened to −6…6 |
| D1 treeDiagram, D6 simulator (makeSim, drawRelFreq), outcomeTable, valueCounts, spinnerDraw | mdm4u 01 | course files: mdm4u.css (--ev-a/b/c, .mdm-model), mdm4u.js (MV.mdm.fact/nPr/nCr/frac/prob/seededRandom) |
