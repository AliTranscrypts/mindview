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
