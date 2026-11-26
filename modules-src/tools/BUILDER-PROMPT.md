# Prompt template for module-builder agents

The orchestrator fills in `{course}`, `{nn}`, `{slug}`, `{title}`, `{plan}` and sends this to one
general-purpose agent per module. One agent builds exactly one module.
Review modules are scheduled only after every topic module of their chapter is built (they link to
the built modules' sections and reuse their components).

---

You are building one interactive learning module for the MindView site: **{course} {nn} "{title}"**.

Repo: `/Users/ali/Desktop/MV/Modules/Website/mindview`. All paths below are inside it unless absolute.

**Read first, in full:**
1. `modules-src/BUILDER-GUIDE.md`: how modules are built (toolkit API, content schema, hooks, checks). Follow it exactly.
2. The plan: `{plan}`. It is the spec. Every goal, warm-up question, prediction, challenge, practice item,
   hint, feedback line, Final Check question (A and B), performance-task test, journal prompt and flashcard
   in it must appear in the module with the plan's wording and answers.
3. The course plan's shared sections, as the guide directs (`/Users/ali/Desktop/MV/Modules/{course}/plan/01-course-plan.md`;
   for MHF4U, `/Users/ali/Desktop/MV/Modules/mhf4u/plan/01-blueprint.md` and `05-colour-key.md`).
4. The canonical example module(s) the guide names; copy their patterns.
   **For every course except MHF4U:** also read the course files `modules-src/toolkit/courses/{course}.css|js`
   (usage comments at the top; auto-included in every page of that course) and skim the course's finished
   modules `modules-src/courses/{course}/*/` (newest first), and grep `@component` across
   `modules-src/courses/*/*/app.js` for pieces to copy. The course plan's component list (V/D/S/C/F/E codes)
   names what to tag (`// @component <code> <name>`). Several modules of your course are being built at the
   same time; if a component you need isn't built yet, build a self-contained one with the plan's code tag.
5. The course notes at the end of this file for your course.

**Write only:** `modules-src/courses/{course}/{nn}-{slug}/` (`content.mjs`, `app.js`, optional `app.css`).

**Then run** (from `modules-src/`) `node build/assemble.mjs {course} {nn}` and `node build/check.mjs {course} {nn}` for this module and fix every failure until the
check passes at both widths, in light and dark mode, with reduced motion, and with no console errors.
Also open the built page's parts yourself in the check's screenshots (or a quick Playwright script) and
make sure the centrepiece and Part 3 actually work: controls respond, readouts update, predictions
animate, challenges accept the right state and reject the named wrong states, the performance task's
checklist reacts. Run your interactive test once with reduced motion on as well: every button must
re-enable after each animation.

**Rules:**
- Name your test scripts with the course and number, e.g. `modules-src/.artifacts/t-{course}{nn}*.mjs`
  (bare `tNN.mjs` names collide across courses).
- Don't edit `modules-src/toolkit/`, `modules-src/build/`, any other module, any site file (`courses/*.html`,
  `js/`, `functions/`, `CLAUDE.md`), or the course hub. If you need a generic component the toolkit lacks,
  build it inside your `app.js` and list it under "promotion candidates" in your reply.
- Don't run `git`, don't deploy, don't run `link-chapters.py`, `hub.mjs` or `progress.py`, and never write to `modules-src/toolkit/` (guide section 9).
- Where the plan is ambiguous or impossible to implement as written, make the smallest faithful choice
  and list it under "deviations".
- Option order: the build reorders 4-option lists (guide §3.2). Keep the plan's order in content.mjs,
  never refer to options by letter/position, and in your try scripts pick options by their text.
- Known toolkit quirks (work around locally): `MV.player` called twice on one host adds duplicate
  listeners (use a fresh host); matching (N6) appends "Try another partner." to mismatch feedback;
  `Plot.line` ignores alpha; `Plot.point` forces full opacity; `Plot.curve` clamps pixel x to 6× canvas height;
  y tick labels clip when the y-axis is off-screen; every failed challenge check counts as a try; the challenge click handler
  crashes if your app repaints/removes the clicked button first (repaint after, or stop propagation); the
  task frame's `after3` note shows after 3 answers unless you set `task.afterAt: 4` (toolkit 1.0.8+; no app.js
  workaround needed). Matching (N6) right columns are re-shuffled so at most one pair sits level. Don't name a text field `ok` (only a boolean
  `ok` marks answers), and don't use the key `answer` for anything but an answer key (the build scrambles it). Scripts run with cwd = modules-src: write output paths as `.artifacts/…` (not `modules-src/.artifacts/…`, which lands in modules-src/modules-src/). Don't define CSS classes that the toolkit uses (e.g. `.rb` is the √ bar); prefix
  your own classes with the module's topic.
- Teacher notes such as "verify before release" go only in `// VERIFY:` code comments, never in text students
  see (check.mjs fails a page that shows "(verify…)").
- Canadian spelling, true minus signs, upright function names, colours only from tokens.

**Reply (under 150 words):** PASS/FAIL of the final check run, output file size, counts (goals, warm-up,
predictions, challenges, practice items, Final Check A/B, flashcards), deviations from the plan,
promotion candidates.

---

## Course notes (read the one for your course)

- **mcv4u:** colours f `--pen`, f′ teal `--f3`, f″ magenta `--f4`, third vector orange `--f5`; rules 7–8. Use
  `MV.mcv.lim(sub)` for limit notation and `MV.mcv.Q/S/exact.judge` for exact answers (don't copy local versions).
  Components so far: V4 secantTangent (02), V9 motionTrack (03), V6 approachTable (04), V7 ruleChooser + V8
  fracBox (05), pencilTrace (06), V5 derivativePanels (07).
- **mdm4u:** event colours `--ev-a/b/c`; `MV.mdm.fact/nPr/nCr/frac/prob/seededRandom` (simulations must be
  seeded and repeatable). Components: D1 treeDiagram + D6 simulator (01), D3 countingSlots (02), D2 vennDiagram +
  parseExpr (03/04). Label invented datasets "model data".
- **sbi4u:** role colours `--bio-*`, `--leaf` (plant tissue only); `MV.bio.chem` for formulas; simulations are
  deterministic. Components: S1 diagramExplorer (01/03), S7 spectrumGraph + S9 procedureLab (02), photosystemSim
  (03), S2 pathwayStepper / S3 energyLedger (04+). Every module has an investigation item and an STSE/Canadian item.
- **sch4u:** take every constant from `MV.chem.data` (never retype); if a value is missing, define it locally
  with a comment and report it. `MV.chem.f()` formulas, `MV.chem.atom()` colours, `MV.chem.tablePanel()`.
  Components: most complete C2 namer + chip judge and C1 SMILES-lite parser/view/palette builder are in 09;
  C3 mechanismStepper (02, 10); polymerChain + densityBar (07). Spelling "aluminium".
- **hfa4u:** published in the site's HFA4M course (header shows HFA4M). Follow course plan §2 safety, sensitivity
  and privacy strictly (weight-inclusive language; self-analysis optional, private and never saved). Don't invent
  nutrition values or statistics and don't pull figures from the web: label illustrative values "model data" and
  mark plan "verify before release" items and any value you had to supply with `// VERIFY:` comments; flag all
  authored content in your reply. `MV.nutri.*`, `MV.kitchenCard` (printing is blocked; cards download). APA 7.
- **eng4u:** only public-domain texts or passages written for the module; quote exactly from a reliable PD
  edition and say in your reply if you couldn't verify a text. The site blocks native text selection for
  students, so span selection uses word chips (`MV.eng.tokens`). ENG features per guide §8 (Word story,
  Sentence to steal, required Art of Language principle, writing tasks checked for structure only, full text in
  the summary). Use "metre" for verse; check.mjs flags "meter" (a gauge is "meter", written `m&#101;ter`).
  Components: E1 annotationStudio + E2 deviceLens + spotProse (01), E9 structureMap + E6 paragraphBuilder (02),
  E3 scansionTapper (03), E8 citationBuilder (07), E7 thesisForge + E17 draftWorkspace (05/06), E10 stageSimulator (08).
  Hamlet: quote the Globe text with Globe act.scene.line numbers; 08's `R` table is the unit's reference list.
  Copyrighted course texts (Munro, King, Atwood, ISU novels, Frye, Survival …): the plan's §3 allows short excerpts
  under fair dealing, but you have no class edition. So: use only the short quotations the plan itself prints
  (exact, as given); never fetch or reproduce copyrighted text from the web or from memory. Each plan "excerpt
  slot" becomes a "Read in your copy" card naming the passage (scene/description, and pp. [class edition] if the
  plan has a credit line), with the activity working from the plan's quotations and paraphrase. Mark every slot
  with a `// EXCERPT SLOT:` comment (teacher pastes the class-edition text) and list the slots in your reply.
