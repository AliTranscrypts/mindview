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
   (usage comments at the top; auto-included in every page of that course) and the course's first module
   `modules-src/courses/{course}/01-*/`, and grep `@component` across `modules-src/courses/*/*/app.js` for
   pieces to copy. The course plan's component list (V/D/S/C/F/E codes) names what to tag.

**Write only:** `modules-src/courses/{course}/{nn}-{slug}/` (`content.mjs`, `app.js`, optional `app.css`).

**Then run** the guide's assemble and check commands for this module and fix every failure until the
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
  y tick labels clip when the y-axis is off-screen; every failed challenge check counts as a try; the
  task frame's "find another" message fires after 3 answers. Don't name a text field `ok` (only a boolean
  `ok` marks answers). Don't define CSS classes that the toolkit uses (e.g. `.rb` is the √ bar); prefix
  your own classes with the module's topic.
- Canadian spelling, true minus signs, upright function names, colours only from tokens.

**Reply (under 150 words):** PASS/FAIL of the final check run, output file size, counts (goals, warm-up,
predictions, challenges, practice items, Final Check A/B, flashcards), deviations from the plan,
promotion candidates.
