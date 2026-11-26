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

- Plot (50): `Plot.point` forces full opacity.

- FIXED 1.0.6: with reduced motion, `MV.tween` called done() before returning, so `x = MV.tween({done(){x=null}})` left x set and buttons stuck disabled (sbi4u 02). done() now runs in a microtask after the call returns.

- FIXED 1.0.7: intervalBuilder arrow keys always stepped 1 even with ½ steps on (mcv4u 15); rebuilt mhf4u 02, 15, 16, 22, 24, 50.

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
| S1 diagramExplorer, radioGroup (disabled options), xsSVG/miniLeafSVG leaf drawings | sbi4u 01 | course files: sbi4u.css (--bio-e/h/atp/nadh/fadh/carbon/o2, --leaf, .bio-tok/.bio-chem), sbi4u.js (MV.bio.chem, chemHTML, tok, rng) |
| foodWeb, F1 personaPanel, annotation tagger, mixed inquiry activity | hfa4u 01 | course files: hfa4u.css (--nu-*, --leaf, --fs-*, .hfa-private/.hfa-nft/.hfa-kc), hfa4u.js (MV.nutri.kcal/pctEnergy/pctDV/amdr/apa, MV.kitchenCard). NOTE: builder authored 38 of 48 "levers" the plan left open — owner review |
| C1 moleculeView, C2 nameBuilder | sch4u 01 | course files: sch4u.js (MV.chem.data tables, f(), atom(), tablePanel(), bpOf()), sch4u.css (--at-*, role tokens, .chem) |
| detective case chips, functionPicker, canvasMath, breakPieces sampler, task evaluator | mhf4u 50 | review |
| V4 secantTangent, exactDec (from mhf4u 09) | mcv4u 02 | plan: TC1 h=2.5 and TC3 a=5 states unreachable with plan controls |
| D3 countingSlots, N4 countEntry (products/powers), D1 treeDiagram (+onLevel) | mdm4u 02 | |
| S7 spectrumGraph, S9 procedureLab, N8 spectrumTap | sbi4u 02 | |
| E1 annotationStudio, E2 deviceLens, spotProse, radioGroup | eng4u 01 | course files: eng4u.css (--an-*, --pp-*, --sc-*, .an/.eng-passage/.eng-tok; header subtitle wraps), eng4u.js (MV.eng.words/tokenize/mlaInText/isMLA/passage/tokens/voice/saveLine/commonplace/triviumPicker). OWNER REVIEW: Dickinson "Hope" uses the plan's dashed text (later edition); the public-domain 1891/1924 text has no dashes. Johnson line 1 corrected to "nest," per Flint and Feather 1914 |
| F3 labelLab, macro energy/AMDR bars, molecule sketches, mixed-item practice set | hfa4u 02 | OWNER REVIEW: author-written model data (amino-acid bar values, butter/canola presets) and an APA list whose years need verifying |
| V9 motionTrack, N29 sentenceBuilder (multi-answer blanks), N4 unitBoxes | mcv4u 03 | |
| C1 moleculeView (multiple bonds, 3D), C2 nameBuilder (alkenes/alkynes/rings/benzene), C3 mechanismStepper | sch4u 02 | course data gap: 9 boiling points kept as BP_ADD in app.js — fold into MV.chem.data later. Plan issue: 4-methylpent-2-ene fails checklist lines 2 and 3 (plan lists only 2) |
| V6 approachTable, lim typesetting (.lm-lim → promote to mcv4u course files), canvas rich/limCanvas | mcv4u 04 | |
| D2 vennDiagram (2 or 3 sets) | mdm4u 03 | |
| radioGroup, F1 adequacy bars, retention stage, prediction cards, body tap points, food icons | hfa4u 03 | OWNER REVIEW: advisory figures + framing example taken from a web search of government sources, marked VERIFY in content (check Oct 2026 numbers); model data (Sam record, bars, tofu decoy, self-check values) |
| E9 structureMap, E1 annotationStudio (lens variant), E6 paragraphBuilder, spotProse, radioGroup | eng4u 02 | OWNER REVIEW: story text typed from the standard 23-paragraph edition (online check failed) — proofread against a published PD edition; plan issue: none of the 3 model responses passes all 7 task checklist lines; 302 KB |
| S1 diagramExplorer (+default tag positions), photosystemSim, moleculeClip, S9 tubeBuilder | sbi4u 03 | |
| pencilTrace (new), V6 approachTable, exactDec, N4 unitBoxes | mcv4u 06 | |
| D2 vennDiagram (number boxes, hatching, pulse, equivalent names), parseExpr (set notation parser) | mdm4u 04 | |
| C1 moleculeView (O, highlights), C1 moleculeBuilder (free mode), C2 nameBuilder, C3 mechanismStepper, hbondBox, bpBars | sch4u 03 | course data gap: plan's 16-compound bp/solubility table kept locally — fold into MV.chem.data with 02's BP_ADD |
| F4 digestiveExplorer, S1 diagramExplorer, nutrientGlyphs, challenge-card chip injection, Trace it | hfa4u 04 | OWNER REVIEW: author-written (VERIFY/model data): tract length 5–9 m, stop times, lactose per serving, priority-allergen list + APA ref, 6 Station 3 cases. Toolkit: challenge click handler crashes if app repaints the clicked button first (also 46) |
| V5 derivativePanels, sketchBuild, slopeGallery | mcv4u 07 | plan fix: f(x)=9 at x≈2.55 not 2.4 (TC1 tolerance). Toolkit: plot.v undefined while a view is hidden |
| E3 scansionTapper, E17 poemEditor | eng4u 03 | OWNER REVIEW: Johnson, Dickinson 1890, Rossetti, Hopkins checked on Gutenberg mirrors; Shakespeare and Keats on Wikisource (modern spelling); short Blake, Poe, Coleridge, Tennyson, Pope, McCrae, Frost lines unchecked; author-written device-lens notes, Station 4 distractors, hints; 301 KB |
| S2 pathwayStepper (station form + atom tracker), N8 regionTaps, enzymeZoom | sbi4u 04 | |
| D3 countingSlots (permutations), D4 arrangementTiles, products ladder | mdm4u 07 | |
| radioGroup (+setOptions), drawModel, mosaicSquare, bagSliders | mdm4u 05 | visual bug: D1 tree highlighted path shows through node label backgrounds — also in mdm4u 01 (fixed locally in 05) |
| rectGrowth, V8 coefBoxes, mtext (canvas labels) | mcv4u 10 | |
| F6 lifeStageSwitcher, F1 plateCheck, fridgeSort, F13 claimCards, dayPlanner | hfa4u 06 | OWNER REVIEW (VERIFY-marked): DRI values beyond the plan, 3 milestones, 20 task-card model values, illustrative NTD chart, APA refs, C1–C5 distractors/hints |
| S2 zScheme, S4 membraneSim, S3 energyLedger bars, rule-based ordering activity | sbi4u 05 | |
| D4 arrangementTiles (build/list), factorTiles, log bar chart | mdm4u 06 | |
| V7 diffQuotientEngine, V8 coefBoxes, exactDec | mcv4u 08 | plan fix: E3 fix B "for every h ≠ 1" false at h = −3 → "almost every h" |
| dish drawings, F6 lifeStageSwitcher, F13 productCards, F2 toddlerPlate + dayPlanner, whoDecides meter | hfa4u 07 | OWNER REVIEW (VERIFY): timeline rows for every age except 7–8 months, Ayo scenario + plate, APA refs. Toolkit: prediction start state applies only once an option is picked |
| V5 derivativePanels (asymptotes, domain skips), V11 signChart, ratFn, V8 slopeBoxes | mcv4u 11 | |
| S4 membraneSim, S3 energyLedger, S7 experimentBench (acid bath), atpSynthaseZoom | sbi4u 06 | |
| C1 moleculeView (+dip overlay), C2 chips + carbonyl judge, dipoleBox, bpBars, moleculeBuilder (alcohol mode) | sch4u 04 | course data gap: 11 carbonyl bp + alcohol bp kept locally |
| C1 esterStage, bpBars, C2 nameChips, predictAct | sch4u 05 | course data gap: 11 bp + 7 scents kept locally |
| C1 (N, lone pairs, H-bond ghosts, reaction morphs), C2 amine/amide namer, bpBars, phMeter, sort-then-name activity | sch4u 06 | OWNER REVIEW (VERIFY): acetaminophen mp ~169 °C and solubility ~14 g/L supplied by builder; N-compound bp kept locally |
| E6 ladderBuilder, E7 analysisRules, E4 verbDial, E8 lineCitation, spotProse | eng4u 04 | OWNER REVIEW: no texts verified (fetch failed) — check Defence "world/World", comma after "November" (Frankenstein), spaced ellipsis (Ozymandias); 295 KB |
| F2 plateBuilder, F5 energyScale, guideShapes | hfa4u 05 | OWNER REVIEW (VERIFY, model data): Nour nutrient values, CCHS typical intakes (stand-ins), persona kcal/meals/activities, self-check fibre %, history/world cards, recipe values, habit labels, allergen additions |
| (update) | eng4u 04 | VERIFIED since: Frankenstein ch. 5 opening matches the 1831 text (no comma); Tennyson "The Eagle" (Wikisource); Frost "Nothing Gold Can Stay". STILL UNVERIFIED: Wordsworth "I wandered lonely" st. 1, Defence of Poetry "world/World", Keats line in K1B |
| V5 derivativePanels (domain-aware), V8 coefficientEntry/pointEntry, slopeDial, exactD | mcv4u 09 | |
| S4 guard-cell scene, dayGraph, S7 jelly bench, guardCellZoom, revealPrompts | sbi4u 07 | |
| D3 countingSlots (case rows), D4 arrangementTiles (sliding, block outline, ticked list), gapBuilder | mdm4u 09 | |
| D4 arrangementTiles circular mode (D4C), seat placer | mdm4u 10 | |
| upright d in dy/dx (MV.m wrapper — promote to mcv4u.js), implicitTangent, exactSurd, V8 pointBoxes/fracBoxes, N13 stationStepper | mcv4u 13 | |
| gearTrain, pipeLines, V7 layerPeeler, V8 coefBoxes (extended) | mcv4u 12 | plan: TC2 −8 state unreachable on −4…4 slider |
| F6 needsCurve, drinkShelf, cafeteriaMenu, realityStations, radioGroup (function options) | hfa4u 08 | OWNER REVIEW (VERIFY): fibre/protein DRIs, vitamin D + fibre per card, map distances/prices, Station 3–4 scenarios/times, Lin family background, chart values, Minaker 2016 citation |
| D4 arrangementTiles (identical tiles), D5 gridPaths | mdm4u 08 | |
| E7 thesisForge, E17 draftWorkspace, formXray | eng4u 06 | texts being corrected to Wikisource (Leacock 1919; Bacon 1884 Works); 298 KB |
| V5 derivativePanels (6-panel ladder), ladderFn, slopeDial, V11 signChart (f″), V8 ladderBoxes | mcv4u 14 | plan: slider ranges widened (b=−6, a=12, b=−12 unreachable) |
| (update) | eng4u 06 | VERIFIED: Leacock matches Wikisource 1919 scan; Bacon "Of Studies" copied verbatim from Works vol. 1 (1884) p. 55 |
| F2 dayPlanner, systemsWheel, switchBtn, designStations | hfa4u 09 | plan arithmetic: Gurdeep plan = 8 µg vit D (not 11); Harold plan $6.50 / near-miss $9.60 (not $7.60/$10.40). OWNER REVIEW (VERIFY): 12 of 30 pool foods + values, Ruth start day, systems-wheel text, station data/costs, kitchen-card recipes, APA refs, care note |
| rubiscoSim, S3 carbonBars, S2 strategy steppers, climateBoard, dialSVG | sbi4u 09 | builder-chosen climate-board key (plan gave none); C4-rice text VERIFY |
| S2 calvinWheel, S3 energyLedger (tally/bars), stepper, S1 diagramExplorer lite, rubiscoZoom | sbi4u 08 | |
| C1 polymerChain, K21 densityBar | sch4u 07 | fixed by orchestrator: "(verify before release)" was visible to students — moved to // VERIFY comments (3 Mt / 9% recycled; single-use plastics rules); check.mjs now fails visible verify notes |
| C2 general namer + chip judge (all families, rings, benzene, older forms; ~140 unit-tested names), C1 SMILES-lite parser + palette builder, nameChips grid | sch4u 09 | best C2 to promote |
| conversation simulator, influence map, support-card builder, blocked-word checker, Support header dialog | hfa4u 10 | **PRIORITY OWNER REVIEW (sensitive topic: eating disorders)**: author-written myth statements 2–8, conversation dialogue, 6 of 8 repair responses, Part 3 feedback, data summary + 5 APA refs (VERIFY), helpline numbers (VERIFY). Safety scan clean (no weights/calories/BMI; blocked-word list prevents them in student writing) |
| V10 shapeStage (Part 3), intervalExtrema engine, wall rail, V8 extremaBoxes | mcv4u 16 | |
| tileView (D4 erase into stacks), cancelWork, read-only factorTiles, binomial/nCr notation helpers, station bar | mdm4u 11 | promote nCr notation to mdm4u.js |
| C1 chainStage, calcAct (mixed set) | sch4u 08 | model values: PLA 10% compost, cellulose 15%/95%, 0.85 chain-length per melt; Canada line VERIFY |
| D5 pascalExplorer (rows 0–15, marks, row sums, mod colouring, hockey/fib), N29 sentenceBuilder (+chip order), N4 numEntryWords | mdm4u 12 | plan: n = 15 state unreachable (slider max 10) |
| V9 motionTrack (v/a arrows, strip, marks), V5 motionPanels (tabs on phones), V11 motionSignChart, V8 tripBoxes | mcv4u 15 | toolkit bug: intervalBuilder arrow keys step 1 even with ½ steps |
| energyLandscape, enzymeSVG/enzymeZoom, S3 ledger (accounting), stepper, S7 rateProbe, S2 feedback pathway | sbi4u 10 | B2 value VERIFY |
| V10 shapeStage (box, field), modelSlots, orderSteps, slotChoice, V8 solveBoxes, V11 signChart | mcv4u 17 | toolkit quirk: {x} placeholders inside backtick maths get broken by MV.m |
| E17 draftWorkspace, E7 thesisForge, E5 sentenceLab, story reader panel | eng4u 05 | 340 KB (over 300 target); plan drafts did not fit together — readout shows 8 changes/4 higher-order (plan 9/6); all texts verified |
| E8 citationBuilder, E6 quotationIntegrator, E5 pausePlayer + beat bar | eng4u 07 | OWNER REVIEW: unverified Austen, Dickens, Dickinson dashes, Hamlet Globe lines; 305 KiB. Note: Ozymandias "Works" (04/07) vs "works" (05) — both real editions, align if wanted |
| V10 shapeStage, V11 signChart (optimization), N4 moneyBoxes, padView/axisName | mcv4u 18 | |
| F7 riskModel, arteryView, F3 labelLab stations, radioGroup (locked state) | hfa4u 11 | OWNER REVIEW (VERIFY): sodium-source shares 70/20/10 (model), model-day items, DASH/Mediterranean plates, APA refs; optional kitchen card skipped |
| E10 Globe stageSimulator, line bank, E17 draftWorkspace + quotation inserter + then/now tags, lens-card sentence builder | eng4u 08 | Hamlet quoted from the Globe text; Globe line numbers in table R (unit standard). Unverified: 3.2.10–11 numbering; early-quarto readings D1/D2/D5. Kids Help Phone VERIFY |
| D5 pascalExplorer, D5 gridPaths (label-the-grid), galtonBoard (for 21/D7) | mdm4u 13 | |
| S2 electronFlow, S3 energyDrop (fire vs staircase), bondTug + carbon-score ladder, station keyframe stepper | sbi4u 11 | plan gap: no investigation or STSE item (course rule) — not invented |
| F7 riskMap, N13 cellSteps, sorterPlus, F2 platePicker, communityStations | hfa4u 12 | OWNER REVIEW: builder-written risk-map cards, "Why higher rates" card (content note + Hope for Wellness 1-855-242-3310), KSDPP card, APA refs, kitchen card — all `// VERIFY`; 2nd program card is a labelled fictional model; no teacher food-tradition swap |
| F13 evidenceLadder, personArray, claimChecker, headlineBuilder | hfa4u 13 | OWNER REVIEW: builder-written "Before you start" note, ladder lines, tobacco ×20 illustrative bar (labelled model data), study summaries, Station 3 lines, APA refs — all `// VERIFY`; support note names Kids Help Phone only |
| S2 electronShuttle, carrier parking lot, molZoom, poolGauges, multi-box N4, stageCounter, switchBtn | sbi4u 12 | OWNER REVIEW: builder-written STSE block on Canadian flour enrichment (`// VERIFY`) |
| coefList (N4), balanceScale, D5 pascalExplorer (trimmed), D6 simulator | mdm4u 14 | builder-written hints for X1–X4, X6, T1–T3, T5 |
| C3 mechanismStepper scene engine (lone pairs, charges, curved arrows, morphs) | sch4u 10 | PLAN ERROR: "3-chloro-2-methylbutane" → IUPAC "2-chloro-3-methylbutane" (used in R3/lab); local data Br 79.90, ¹⁸O 18.00 (merge into MV.chem.data); builder-written Sort mode cards |
| V10 rateStage (time mode), N29 setupSlots, N5 orderSteps+rules, V8 rateBoxes, upright-d MV.m wrap (13, 19) | mcv4u 19 | PLAN ERROR: S5 wrong answer 1/18 comes from r = h, not r = 3h (feedback fixed; 1/162 added for r = 3h) |
| dealSim + drawRF (D6 deal), D1 treeDiagram; TOOLKIT: matching shuffle often leaves pairs side by side; task needs an "after all N answers" option (mdm4u 14/15, mcv4u 19, hfa4u 12) | mdm4u 15 | builder-written feedback lines |
| atomPic (5 models), rpath (alpha paths), gold-foil lab + histogram, CRT view, evidence board (tap + drag), reasonAct ratio input | sch4u 13 | PLAN ERROR: A2A option D feedback "1000 times too big" should be "100 times"; model values for 1/10 centre (0/3200/4800) |
| V11 slopeStrip, V11 signChart.build, V14 strokePad, N4 intervalEntry (parseIv), V5 derivativePanels+strip | mcv4u 20 | builder-written factor-chip distractors and hints |
| TOOLKIT 1.0.8: N6 matchOrder (re-seed until ≤1 aligned pair) + task.afterAt | — | DONE: audited all 32 live modules with matching (2026-11-26): at most 2 of 8 pairs aligned (chance level ≈1), so no refresh needed; they pick up 1.0.8 on their next rebuild |
| S1 diagramExplorer (44px, arrow keys), S2 map stepper + atom tracker, S3 ledger, tube drawing, Venn sorter, matter/energy loop | sbi4u 13 | builder-written lab hints/distractors; ³H label + model atom counts |
| stereo-aware C1 core (cis/trans, identity, relationships, polarity, 2D/3D, rotation, π band), 2D/3D view widgets | sch4u 11 | local data: bp of ethanol/methoxymethane/propanols/propanal/propanone/but-2-enes/dichloroethenes, 16 mp, fats, C=C twist ≈270 kJ/mol (merge into MV.chem.data after owner check); fixed ene locants in its copy of 09's namer |
| E9 arc builder, E7 forge (stance + critic chips), counter/answer tagger; TOOLKIT QUIRK: any content key named `answer` is scrambled | eng4u 09 | PLAN ERRORS: 5 Hamlet line numbers moved to Globe (2.2.306–307, 2.2.576, 3.2.24–25, 5.2.331, 5.2.370); 3 model answers were under the plan's own 180-word minimum (lengthened). OWNER REVIEW: critics' summaries/dates, "three unities" claim, Kids Help Phone numbers (`// VERIFY`) |
| C1 mirrorView (3D groups, mirror, best-fit superimposition turns), polarimeter, receptorGlove, N8 tap-a-carbon, mixed number+MC practice set | sch4u 12 | builder-written hints R1–R4 |
| — | sch4u 12 | OWNER REVIEW: carvone smells + medicine history card (`// VERIFY`) |
| V11 signBuilder (interactive), V5 panels + zoom + one-sided tangent stubs, V8 designBoxes (lists, points, intervals with bracket toggles) | mcv4u 21 | PLAN NOTE: hero's listed point order can't be drawn left to right (two minima need a maximum between) — reordered |
| causesMap, personaPanel, boneBank, adequacyBars, foodChipPlanner, languageAudit, chipCounters | hfa4u 14 | PLAN ERROR: near-miss "1 soy + 2 tofu + 2 bok choy + 1 salmon" also fails calcium (1200 mg). OWNER REVIEW (priority): plan's weight-stigma slurs kept as wrong examples in the language audit ("Fatties…", "Fat people are lazy") — teacher should confirm; builder-written causes-map links, Osteoporosis Canada "1 in 3 women, 1 in 5 men", hip-fracture text, APA refs, kitchen-card gluten-free wording — all `// VERIFY` |
| asymptoteModel, gapMeter, long-division step-through (divideSpec/ldHTML), V6 approachTable | mcv4u 22 | PLAN ERRORS: matching card "VA x = ±1" doesn't exist (feedback reattached); two task near-misses also fail line 4 by the plan's own test |
| S2 glycolysis stepper, S3 ledger strip (sticky on phones), chip-fill table, ordering with "placed before" feedback, ATP synthase preview, enzymeZoom wide cleft | sbi4u 14 | PLAN ERROR: E2 fix "Step 1 is correct." should be "Step 2"; model PFK curves (builder-written) |
| E3 tapper (one/least keys), E1 lens marks, E5 argument path, E10 deliveryScore, E15 recorder, E17 soliloquyStudio, seq() voice player (falls back to timers if speech never starts) | eng4u 10 | PLAN ERROR: 2.2 soliloquy numbers 550–558 → Globe 576–584 (+ Spot 2.2.583, Model 2 notes). Macbeth 5.5.19–20, 5.5.24–26, 2.1.33–34 and R&J 2.2.2 verified vs Perseus + MIT |
| F9 foodMap, mealChips, originStations, seasonWheel | hfa4u 16 | OWNER REVIEW: builder-written Ripple options/feedback, Station 1 ingredient rows, Station 2 model ratings + evidence, season-wheel extents, tomato bars, CFIA APA ref — all `// VERIFY` |
| extended D6 (seeded runs, log-scale graph + band, differences graph), many-runs dot plot, spinner + sector editor, ratio-entry box | mdm4u 16 | builder-written sorter explanations, N1–N4 hints; mystery mix adds red 4 / yellow 3 (plan gives only blue 0.30) |
| flipTree, D2 vennCond, N4 probEntry, D1 dim(path) option | mdm4u 17 | builder-written Part 3 station texts (Station 3 ~6% base rate), default Venn counts, 2 extra dice events |
| S4 membraneSim (mitochondrial), S3 split bar, dam inset, S1 tap-label builder, evidenceCards, calc | sbi4u 17 | builder-written evidence-card feedback |
| stepIcons, F8 kitchenDetective dot tray, outbreakTable, pathogenCards, decisionSet, stagePlanner | hfa4u 15 | OWNER REVIEW (priority, safety content): builder-written pathogen onset times + symptoms (all but C. perfringens), Station 3 text, probe messages, kitchen card, APA refs (n.d.) — all `// VERIFY` |
| D7 distChart, outcomeGrid, N4 probEntry (fractions, two-part), makeSim with to()/instant | mdm4u 18 | Station 3 model counts 10/20/10 |
| V5 derivativePanels (any panel kinds), V11 concavityStrip, V11 signChart f′/f″, V8 bendBoxes, hatch pattern | mcv4u 23 | PLAN NOTE: task near-misses (−3, 4) and (−4, 6) also fail line 2 |
| C12 energyLadder (ladderSVG/stripSVG/photonSVG), hStrip spectrum strip, specRGB | sch4u 14 | PLAN ERROR: T3B — a 10.20 eV photon at n = 2 would ionize (limit 3.40 eV); option reworded + feedback note. Local data: H wavelengths, hc = 1240 eV·nm. OWNER REVIEW: Herzberg + 1868 helium history (`// VERIFY`) |
| C11 ptable, C12 orbitalLadder + aufbauDiagonal + config engine (ground/ionOcc/checkRules), N4 configBuilder; COURSE-DATA: element symbols/names kept locally (merge into MV.chem) | sch4u 16 | builder-written S3–S5 distractors and hints |
| fieldArt, gaugeRows, F13 claimStations | hfa4u 17 | OWNER REVIEW: builder-written evidence-station sources + strength keys, "settled" cards, trade-off stems/distractors, organic-premium note, APA refs (`// VERIFY`) |
| E11 motifTracker, E7 statement forge, quotation/citation checks, spotProse | eng4u 11 | PLAN ERRORS: quotes changed to Globe wording ("porches of my ears", "protests too much", "mildew'd"); line numbers moved to Globe (e.g. 2.2.321, 3.2.268, 5.1.236–237, Macbeth 5.1.39, 5.1.56–58); all verified vs Perseus Globe |
| V8 eNumber (exact values with e), V5 shared-axes slope tool, designBoxes with e; FIXED: try.mjs re-anchors "modules-src/…" screenshot paths (cause of the stray modules-src/modules-src/.artifacts/) | mcv4u 25 | builder-written Part 3 distractors |
| S4 mitochondrial membraneSim, energy staircase, routeBuilder (with distractors; TOOLKIT: N5 can't leave out a tile), electronegLadder, O₂-electrode tap-a-segment | sbi4u 16 | OWNER REVIEW: CO-alarm law statement (`// VERIFY`) |
| S2 Krebs wheel (multi-molecule stepper), S3 energy ledger, ¹⁴C tracker, tap/drag table fill, chip tagger, two-box number entry | sbi4u 15 | plan gap: no Canadian/STSE item (not invented) |
| ratioDial, V8 lnExact (lnParse/specVal), N13 station stepper | mcv4u 26 | builder-written prediction setups, Part 3 intro |
| — | sbi4u 15 | PLAN ERROR: ¹⁴C tracker lists 5 values for 6 stages (Turn 2 set to 2/4 on average) |
| flowSVG energy flow band, ATP pool gauge + ATP–ADP loop, signed-ΔG/ratio number entry, chipQ | sbi4u 18 | builder-written Beyond-station chips + feedback; ATP pool model (100 units, 0–200 gauge) |
| C12 orbitalView (3D orbital meshes + nodes), C12 dotCloud (seeded H 1s/2s/2p, 90% boundary), C12 standingRing, ruleSorter, radioGroup extra() hook | sch4u 15 | PLAN NOTE: "planes = l" — dz² and f have cone-shaped nodes (readouts say so). Local: Bohr radius 52.9 pm. OWNER REVIEW: Bader content (`// VERIFY`) |
| V14 sketchPad (drawing + match gauge), V11 shapeStrips, featAdd/featAfter | mcv4u 24 | builder-written S1/S2/S4 checklist text, K1–K3 hints |
| C1 lewisModel / lewisView / lewisBuilder; COURSE-DATA: no valence electrons or bond lengths in MV.chem.data (kept local); FIXED 1.0.9: MV.chem.atom("Xe") was metal-coloured (Kr/Xe/Rn/At/Sb now non-metal) | sch4u 17 | builder-written 3-level hints (count items, R1–R5); M5 reworded for ozone |
| F3 label table renderer, front-of-package symbol, claim stations, label detective (number + chips), snack chips | hfa4u 18 | OWNER REVIEW: model values (hero cereal, soup, snack bar, ingredient weights, functional-food costs), L1–L7 hints — `// VERIFY`; "multigrain" binned as specific term |
| V8 lnExact (reads e²), V5 derivativePanels exact "set" moves, mirror slope-triangle helpers, designBoxes one-coordinate wrongs | mcv4u 27 | decoy card 1/√x added (plan mismatch line needs it) |
| D7 balanceSeesaw, D6 makeSim geometric schedule + drawRunAvg, N4 moneyEntry | mdm4u 19 | "Charity raffle" device added for the raffle challenge |
| F10 householdExplorer, componentIcons, desk matcher, dataSet, letterDesk | hfa4u 19 | OWNER REVIEW: 211 + Kids Help Phone numbers, PROOF / Canadian Income Survey findings, food-bank use, the drop after 65, 2024 school food program, northern food prices, level-of-government pairings, model-letter citations (`// VERIFY`) |
| — | sbi4u 19 | PLAN ERRORS: matching has no "18" on the right (M7 feedback moved to fermentation ↔ 38/36/30); Krebs "3/1/1" read as 1/3/1; no STSE item |
| D7 distChart (E line, σ bracket), n-row galtonBoard, probEntry (√ input), binom/statsOf | mdm4u 21 | PLAN ERRORS: P3 asks n = 40 but slider stops at 20; 50 balls can't land exactly 1:4:6:4:1 |
| sovereigntyCircle, plantArt, briefBuilder, Support dialog | hfa4u 20 | **OWNER REVIEW (PRIORITY, must fix before release per plan):** the 5 Part 3 initiative cards are "Practice model" placeholders — need real named initiatives chosen with the Indigenous education lead; no community quotations; Station 3 figures left for the teacher. Builder-written: Start care note, residential-school card summary, card notes, ally-statement feedback, APA list (Mosby 2013, UNDRIP 2007, 2021 Act) — `// VERIFY`. Show the four-segment circle design to the Indigenous education lead |
| E9 time-shift map + line chart, mapBuilder, E8 edition form | eng4u 14 | **EXCERPT SLOTS (teacher pastes class-edition text):** `PG` page numbers, `READING.paras` full story, `READING.edition`, `NIGHT` night stories. Leacock verified vs Gutenberg #3533 + 1912 scans. VERIFY: 5 shelf stance lines + CBC/Weaver note. PLAN ERROR: "pattern breaks" rule gives m5 but example says m7 |
| C1 vseprModel/dipoleViewer, C11 enTable, ΔEN bar | sch4u 19 | local data: Xe electronegativity 2.60 (`// VERIFY`) |
| N12 exactTrig, V8 piExact, N24 circle twin | mcv4u 29 | — |
| V5 asymptote-aware panels + N8 tap-to-mark, V8 frameBoxes, N3 specialTrig, V10 drone/shadow stage | mcv4u 30 | decoy card (1/2)csc²(x/2) added (plan mismatch line needs it) |
| — | hfa4u 22 | OWNER REVIEW: Crippa 2021 ("a third"), Poore & Nemecek values, 38 700 farm count, 3 references, Canada impact levels, salmon/pork/milk/egg serving values (`// VERIFY`); R1/R2/R5/R6 hints + R5/R6 options builder-written |
| — | eng4u 15 | **EXCERPT SLOTS** X1–X6 + [p.] pages (only "Blackfoot" and the Truth line quoted). OWNER REVIEW: E. Pauline Johnson texts not checked against a scan; support-line numbers; TRC, Kainai, Capilano facts; King ancestry note (Station 6, hidden unless ?station6=on) — `// VERIFY` |
| — | mdm4u 38 | screen-time r = −0.65 is a builder value; 4th verdict chip added |
| — | mdm4u 26 | PLAN ERROR: μ slider 40–160 can't reach Data-mode Fit value 170 (widened to 40–180) |
| — | mdm4u 33 | gallery context cards (except household incomes) are builder-written model data |
| — | eng4u 23 | OWNER REVIEW: Canadian ad-disclosure rules, Text C label wording, Aristotle (Roberts) + Lincoln quotes NOT verified vs a PD edition, confirm no mock brand matches a real trademark; real-campaign examples removed (R-A–R-D are unscored note fields) |
| D11 scatter/regression view, trust gauge, slope-intercept entry | mdm4u 36 | PLAN TYPO: sᵧ written with a Greek gamma; matching feedback refers to 2 meanings not in the list (added as decoys); Part 3 model data (121 cm at 7, ~170 cm at 30) builder-written |
| C1 vseprFrame + vseprView 3D SVG renderer (auto best view, arcs, ghost polyhedra), trimmed lewisView | sch4u 18 | OWNER REVIEW: Bartlett item (`// VERIFY`); O₂ treated as AX₁E₂ |
| — | eng4u 17 | OWNER REVIEW: Melville/Shelley/Woolf/Fitzgerald/Austen lines quoted from memory (verification requested); B6 1942 Japanese Canadian history; illustrative page numbers |
| — | hfa4u 23 | OWNER REVIEW: Second Harvest/VCMI 58% + "a third avoidable", UNEP 2024 1.05 Bt, NZWC household claims + "2 million tonnes", CFIA date-label rules, PROOF finding, Canadian food-recovery hierarchy wording, 4 builder-written APA titles (`// VERIFY`); Station 3 fix effects are builder model values |
| — | mdm4u 25 | PLAN ERRORS: P4 needs c = 0.5 but slider is 1–20 (now starts 0.5); TC2 b = 3.6 not reachable with 0.5 steps (3.5/4 get that feedback). VERIFY: Ontario population figure |
| — | mdm4u 25 | PLAN ERROR (cont.): Station 2 boundary values 160.0/170.0 placed in wrong intervals by the plan (module follows the left-endpoint rule) |
| — | sbi4u 45 | OWNER REVIEW: Sudbury regreening start date, tree count, pH + cover values (`// VERIFY`). PLAN ERROR: sequence 2 has no lichens step, so "lichens placed first" feedback is unused |
| — | mdm4u 30 | task-only frame + selection factors are builder-invented (`// VERIFY`); hero leaves out the dial |
| — | mdm4u 31 | Station 4 skew dot-plot data + grouped-class values are builder model data |
| — | mdm4u 32 | PLAN ERROR: hero "s = 3" impossible with 10 whole numbers (caption now "s ≈ 3") |
| — | eng4u 20 | PLAN ERROR: Hamlet "suit the action" at Globe 3.2.19–20 (plan said 17–18). OWNER REVIEW: those line numbers, Gettysburg wording, novel quotations + chapters (`// VERIFY`); drill bank + Station 2–3 answers builder-written |
| — | eng4u 21 | **EXCERPT SLOTS:** 4 real media examples, Part 3 "one story", U6 PSA. OWNER REVIEW: key concepts, McLuhan, War of the Worlds panic claim, Larchmere names (`// VERIFY`). PLAN ERROR: Model 1 is 149 words, not 182. Mock "Light One" poster replaces VW "Think Small" |
| — | mdm4u 24 | Q2 reworded so sum-of-two-dice routes to "None of these"; station 4 spinner 1–4 chosen by builder |
| — | hfa4u 25 | PLAN ERROR: Model 2 commitment "half my plate…" not in the Health list. OWNER REVIEW: every rating, emissions share, label + price fact; 34/35 rating reasons, (b)/(c) evidence cards, extra commitment chips, 2 APA refs builder-written (`// VERIFY`) |
| S2 oxygen-switch map + poolGauges, carrierLoop, S3 ledger + ATP split bar, S7 flask/balloon bench, variable tagger; TOOLKIT QUIRK: content inside <details> loses border-box sizing in Chrome | sbi4u 20 | PLAN ERRORS: TC3 "length 7" impossible on a step-2 slider; after3 "most gas per gram" contradicts the plan's own model (30 °C best). VERIFY: other-fuels NADH counts (glycerol, amino acids) |
| — | mdm4u 35 | K1 versions A and B ask the same question (as the plan does); Anscombe values `// VERIFY` |
| — | mdm4u 29 | PLAN ERROR: P2 uses n = 25 but slider steps by 10 (shown as dashed outline) |
| — | eng4u 16 | **EXCERPT SLOTS** A–F (Atwood). OWNER REVIEW: all Atwood quotes, chapters + page numbers (p. __); Forster lines + part numbers; Mill 1868 quote (`// VERIFY`). ?path=forster swap is partial (Quiet City text missing) |
| — | eng4u 16 (cont.) | chapter numbers GUESSED by builder (greetings 4–5, "temporary" 28, "ignoring" 10, "ordinary" 6, 6 Gilead cards) — must be checked; Historical Notes details; 2017 NYT source |
| — | sbi4u 40 | PLAN ERROR: K⁺-blocked trace drops to −20 mV at 1.5 ms then climbs to +10 at 2.0 (used +20 at 1.5). VERIFY: MS rate claim for Canada |
| — | mdm4u 37 | PLAN NOTE: add-point x limited to 0–20 but data B runs 10–50 (extended to 60); savings-station data builder-chosen |
| — | sbi4u 23 | OWNER REVIEW: added Gene Q (5′-ATGGGATAA-3′) for P4; builder-written splicing puzzles, Gene T introns, Station 3 four-exon gene; insulin/Toronto 1921–22 note (Banting, Best, Macleod, Collip) |
| — | eng4u 18 | OWNER REVIEW: Johnson/Boswell wording, 8 Gatsby lines (verification requested), MLA 9 AI-prompt citation, plagiarius word story; Station 3 six AI scenarios builder-written (plan had none) |
| — | sbi4u 46 | PLAN ERROR: K3 + Activity 1 mismatch tagged M3 (migration) but are about pyramids. VERIFY: world milestones + UN projection, biocapacity 1.6 gha, Canada footprint, canola dates, food-waste share |
| — | sbi4u 44 | PLAN ERRORS: L0 slider must reach 0 for P2 (now 0–150); TC1 "(50, 400)" impossible since L0 ≤ 150 |
| — | mdm4u 34 | Part 3 model data sets builder-written |
| — | hfa4u 24 | OWNER REVIEW: SDG 2 + targets 2.1–2.5 wording, "not on track", cash-transfer research + 70/25/5 bar (model data), Canada facts (2008 untying, Canadian Foodgrains Bank, WFP 2020 Nobel), 2 APA refs from memory (`// VERIFY`); decision labels, reason chips, rubric evidence, D1/D3/D5 distractors builder-written |
| — | sbi4u 37 | OWNER REVIEW: Station 4 Canadian anti-doping arrangements, flashcard 4 iodized-salt policy (`// VERIFY`); P3 starts healthy → Graves' |
| — | eng4u 22 | **EXCERPT SLOTS:** real coverage of one event (Explore Reader), station 5 real claim. OWNER REVIEW: Milton (Areopagitica) + Swift (Examiner) wording not checked vs PD edition, SIFT credit (Caulfield) + date, Pope puffer-coat 2023 + AP hack 2013 details, confirm invented handles (@harbourwatcher, @calderlaughs, @calderchat + plan names) aren't real; models 2–3 builder-written |
| — | eng4u 17 | PD quotes verified (pglaf/Wikisource); Frankenstein fixed to 1818 "November, that"; Austen kept 1813 comma |
| — | sbi4u 35 | VERIFY: hibernation curve shape (no plan figures); fever sweat/shiver amounts are model values |
| S5 dnaDraw (comp/revComp/strand/duplex, ladder↔helix), forkView + knockout model, nucleotideSVG/basePairSVG, densityTube | sbi4u 21 | builder-written station-conclusion distractors + order-builder consequence lines |
| V3 vectorBoard, vecMath, compassDial | mcv4u 33 | K1 versions A/B have identical prompts in the plan (retake repeats Q1) |
| — | mcv4u 32 | TC3 "t = 7.5" unreachable with 1 s steps (7/8 get the message); 2 decoy cards added |
| — | sbi4u 34 | plan gap: no STSE/Canadian item; Activity 2 extra distractors builder-written |
| — | mcv4u 34 | PLAN ERROR: Final T3 B had two right answers (180° turns also sum to 0⃗); prompt now says "close into a four-sided figure" |
| — | sbi4u 28 | VERIFY: Health Canada radon recommendation (Final A2) |
| — | mdm4u 27 | PLAN ERROR: μ slider 0–200 can't reach presets 250/500 or TC3 μ = 508 (now 0–600); Station 3 wrong statements builder-written |
| — | sbi4u 43 | VERIFY: swift fox reintroduction began 1980s; TC2 "points to N = K" state impossible in the simulator |
| — | sbi4u 27 | VERIFY: A2 drug claim; O3/O5/O6 extra options + S12 chips builder-written |
| V1 view3d (SVG 3D view) | mcv4u 46 | PLAN ERRORS: P4 b = (2,4,6) outside the −4..4 steppers; "2 ↔ i⃗" mismatch can't occur (i⃗ not a result); R1–R3 have no hints |
| — | sbi4u 31 | OWNER REVIEW: Canadian approval of the CRISPR blood-disorder therapy, Assisted Human Reproduction Act wording + status, 2018 embryo case details, law on research embryos (`// VERIFY`); spacer match counts 7/20/9 builder-chosen |
| — | sbi4u 26 | VERIFY: trp "Medium" level drawn as reduced transcription (plan defines only low/high) |
| — | mdm4u 39 | third question template + some distractors builder-written |
| V3 vectorBoard + V3exact | mcv4u 38 | Final A1/A2 version-B prompts incomplete in plan (filled) |
| — | mcv4u 42 | PLAN NOTE: strain bar "above 2W" unreachable (max ≈1.93W; now 1.5W) |
| V3 lineBoard, V12 lineAlgebra | mcv4u 48 | PLAN ERROR: N4 wrong answer (8, 7) is A + B but its feedback describes (11, 7) |
| V8 lineBoxes | mcv4u 49 | PLAN ERROR: P2 needs normal (4, 6) but components limited to −5..5 (now −6..6) |
| — | mcv4u 44 | PLAN ERROR: hero + P2 say θ ≈ 120° for (1,0,3)·(0,1,−2); correct value ≈ 148° |
| — | sbi4u 42 | VERIFY: glucose thresholds, history dates; T1/injection model curves builder-chosen |
| — | sbi4u 25 | VERIFY: GTP/initiation factors omitted; mitochondrial code = vertebrate; Station 1 gene + Station 2 sequence builder-written |
| — | sbi4u 38 | VERIFY: Experimental Lakes Area dates + estrogen concentrations; Canada BPA baby-bottle ban date (2010); "Wire it" outcomes rule-based |
| — | sbi4u 42 (cont.) | VERIFY: 4–7 mmol/L band, 4.0 hypo line, 10 mmol/L kidney limit vs Diabetes Canada; Toronto insulin history (patent sale, Nobel sharing) |
| V1 view3d | mcv4u 37 | Practice 2 uses typed √/± entry |
| V1 view3d, V2 det3, wrenchView | mcv4u 47 | — |
| V1 view3d | mcv4u 39 | PLAN NOTE: TC2 wrong states m = 6, 1/3 unreachable on −3..3 slider; point sliders widened to −12..12 for P4 |
| TOOLKIT TODO: 5+ separate copies of V1 view3d / V3 vectorBoard across mcv4u 33–59 (built in parallel) — consolidate into toolkit/courses/mcv4u.js later | mcv4u | — |
| — | sch4u 29 | catalyst masses (MnO₂ 0.50 g, potato 5.0 g) + hero curve V = 60(1−e^−kt) are builder model values; R1–R4 hints builder-written |
| — | sbi4u 32 | PLAN ERROR: readout example gap 11.1 mm should be 11.0 (P4's 3.6 only works with unrounded gaps). VERIFY: Canada national DNA data bank (D6) |
| V3 vectorBoard | mcv4u 36 | — |
| V1/V2/V3 vector components | mcv4u 40 | PLAN ERROR: TC1 wrong state s = −1, t = 7 unreachable (sliders −5..5) |
| V1 view3d | mcv4u 52 | PLAN ERROR: Equation mode limits D to −6..6 but TC1 needs D = −8 (widened to −20..20) |
| — | eng4u 18 | quotes verified: Gatsby matches 1925 text ("orgastic"), Johnson matches Boswell (PG #1564) |
| — | sbi4u 29 | VERIFY: Canadian regulator roles, Harvard mouse 2002 ruling, AHRA heritable-change ban, commercial yeast/bacteria insulin; Station 2 distractors + CER chips builder-written |
| — | sch4u 40 | PLAN ERROR: M8 "water is left out" matching feedback can't trigger (no expression contains [H₂O]); A6 also rejects 0.056 (c − x) |
| — | sch4u 33 | PLAN NOTE: plan lists 2 mode chips but describes 3 modes; Station 2 model ΔG° = −5 kJ |
| — | sbi4u 30 | VERIFY: National DNA Data Bank scope; police searches of ancestry databases |
| — | sch4u 26 | PLAN ERRORS: B4 745-slip gives −1031 (not −1059); B6 C=C slip gives −1437 (not −1588); TC2 sign slip gives 247.2 (not 247.4). VERIFY: C=O 799 parsed from bondNote; Station 3 hydrogen-from-gas fact |
| — | sch4u 52 | VERIFY: 5% recycling energy figure, Quebec smelter count + power source, inert-anode research status (shown as "model value") |
| — | sch4u 36 | VERIFY: R4 (CaCO₃) K = 0.010 model value (plan gives none); 2 decoy expressions added |
| — | sbi4u 24 | PLAN GAP: TC1 "ACC" trap needed an 11th tRNA chip 5′-ACC-3′ (added); S12 chip feedback builder-written |
| — | sbi4u 39 | **OWNER REVIEW (clinical):** IVF steps, hCG trigger timing (~36 h), hormone-therapy risks — plan §6 asks for clinical-source check; removing corpus luteum also drops estrogen (plan names only progesterone); R2/R3/R8 distractors + Station 1 + CER feedback builder-written |
| — | sch4u 25 | PLAN ERROR: all 6 Station 2 error sources sort to "too small" (one-answer sorter). VERIFY: NH₄NO₃ molar mass 80.0 g/mol local; R4 made a fuel choice, not number entry |
