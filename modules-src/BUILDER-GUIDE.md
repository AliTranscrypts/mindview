# Builder guide: one interactive module

You turn **one module plan** into **one working page**. The toolkit does the standard machinery: page shell, step bar, saving, warm-up, predictions, challenges, quick check, sorters, Spot the Error, matching, ordering, number entry, journal, Final Check with version B, task frame, summary and flashcards. You write two files:

| File | What goes in it |
|---|---|
| `modules-src/courses/<course>/NN-slug/content.mjs` | **Every word of the plan**, as data. A Node ES module, `export default { … }`. |
| `modules-src/courses/<course>/NN-slug/app.js` | Browser code for this module only: the hero animation, the Explore centrepiece, Part 3, custom practice activities, the performance task and small question graphs. |
| `…/app.css` (optional) | Styles for your own interactives. Use the colour tokens only. |

**Canonical example: copy its patterns.** `modules-src/courses/mhf4u/02-stating-intervals/` (content.mjs + app.js + app.css). Module 01 (`01-power-functions/`) is a second example with sliders, a playground, a symmetry lab and a numeric design task.

## 0. Rules
- Don't edit `toolkit/core/`, `toolkit/css/` or `build/`. If you find a toolkit bug or need a core change, work around it in `app.js` and **describe the problem in your final report**. For shared pieces, see section 9 (builders never write to `toolkit/`).
- Don't touch site files (`courses/*.html`, `courses/*/ch*.html`, `functions/`, `js/`, `CLAUDE.md`), `course.json`, `PROGRESS.md`, or other modules. Don't `git commit`, push or deploy.
- Never copy plan text into code comments beyond a short pointer. The plans stay out of the repo, but content.mjs is the plan's content, and that's expected.
- The plan wins. Don't invent questions, drop items or change answers. If the plan is ambiguous, choose the reading most consistent with its own explanations, and mention it in your report.

## 1. What to read (in this order)
1. **This guide.**
2. The course plan `/Users/ali/Desktop/MV/Modules/<course>/plan/01-course-plan.md`. For MHF4U, read `mhf4u/plan/01-blueprint.md` §6–7 and §14 instead. Read: what changes for the course, the conventions, the colour roles, and the component (E/F/S/C/D/V) descriptions your plan names.
3. `/Users/ali/Desktop/MV/Modules/mhf4u/plan/05-colour-key.md` §1–3 (math courses), or the course plan's colour section (science/English).
4. **Your module plan** `/Users/ali/Desktop/MV/Modules/<course>/plan/modules/NN-slug.md`, all of it. It's long; read it in chunks.
5. `modules-src/courses/mhf4u/02-stating-intervals/content.mjs` and `app.js`, to see every pattern in use.

## 2. Workflow
```
cd /Users/ali/Desktop/MV/Modules/Website/mindview/modules-src
# write courses/<course>/NN-slug/content.mjs and app.js (+ app.css)
node build/assemble.mjs <course> NN      # -> ../courses/<site>/modules/NN-slug.html
node build/check.mjs <course> NN         # static + browser checks (~30 s); must print ✓ PASS
```
`node build/check.mjs <course> NN --static-only` is a fast first pass. Screenshots land in `modules-src/.artifacts/<course>/NN-slug/` (`d-*` = desktop light, `m-*` = phone dark). **Look at several of them** (Read the PNG): the check can't see ugly or broken layouts. Fix and repeat until it passes and looks right. Then test your own interactives on purpose with `build/try.mjs` (section 10). Example test file:
```js
// modules-src/.artifacts/t02.mjs  ->  node build/try.mjs mhf4u 02 .artifacts/t02.mjs
export default async function(page, t){
  await t.hash("explore");
  const h = page.locator("#ex-app .drag-h");          // drag handles are focusable buttons
  await h.nth(0).focus(); await page.keyboard.press("ArrowLeft"); await page.keyboard.press("c");
  await page.click('[data-c="tc1"] [data-act="check"]');
  t.expect(/Challenge met/.test(await page.locator('[data-c="tc1"] .fb').innerText()), "TC1 accepts [−4, 6)");
}
```

## 3. content.mjs: the schema

Strings are **HTML**. Inside any string, put math in backticks: `` "Solve `5 - 2x > 11`." `` Backtick math is typeset by `MV.m()`:

| Write | Get |
|---|---|
| `` `x^2` `` `` `x^{n+1}` `` `` `x_1` `` `` `log_{2} 8` `` | superscripts and subscripts |
| `` `{x + 2}/{x - 3}` `` | a stacked fraction (plain `a/b` stays inline) |
| `` `√3` `` `` `√{x + 1}` `` | a radical with a bar |
| `` `-3` `` `` `f(-x)` `` | a hyphen becomes a true minus − automatically |
| `` `sin x` `` `` `log x` `` `` `ln x` `` | function names stay upright; single letters go italic |
| `` `@a{a}x^{@n{n}}` `` | parameter colours: `@a{…}` violet, `@n` blue, `@k` orange, `@d` teal, `@c` magenta, `@b` brown, `@t` cerulean (θ) |
| `` `vec{u}` `` | an over-arrow vector |
| `` `{x ∈ ℝ | x ≥ 0}` `` | set braces kept; `<=` `>=` `!=` `->` become ≤ ≥ ≠ → |

**Outside backticks**, type real symbols: − (U+2212) for minus, ×, ·, ≤, π, ∞, ℝ, θ, ², ³. Never type a hyphen as a minus. Keep units outside math (`5 m`, `3.2 s`). Chemistry: write formulas as plain HTML/Unicode (`H₂O`, `CO<sub>2</sub>`, `Fe<sup>3+</sup>`), not in backticks (backticks would italicise element letters).

**Answers.** Mark correct options with `ok:true`. Put any other answer in a field named `answer` (a sorter item's box, Spot the Error's first wrong step, a numeric answer, a matching map, a custom item's answer). The assembler scrambles these two field names in the page (decision 7). In app.js, read them with `MV.ok(option)` and `MV.ans(item)`; never test `option.ok` directly. **Don't store answers under other names.**

**JSON-safe only:** no `Infinity`, `NaN`, `undefined` values, functions or Dates. Use flags (as 02 does with `aInf:true`). Helper functions at the top of content.mjs are fine for *generating* data (01 builds its sorter items with one); only the exported object goes into the page.

**Goals** are numbered from 1 as in the plan: `goal:1`, `goal:"G3"`, or `goal:[3, 6]`. Every warm-up, prediction-free item, challenge, quick check item, practice item (or its activity) and Final Check question needs one.

### 3.1 Top level (topic module)
```js
export default {
  id:"02-stating-intervals",            // must equal NN-slug
  kind:"topic",                          // or "review"
  title:"Stating intervals",             // header title (sentence case, as the reference does)
  topic:"Stating Intervals",             // first line of the results summary: "<topic> module (MHF4U, Chapter 1): results summary"
  readyTopic:"stating intervals",        // warm-up 5–6/6 message: "You’re ready for <readyTopic>."
  hero:{ eq:"`(-2, 5]`", eqLabel:"spoken version", eqSize:"md", // eqSize: omit (huge, as 01), "md", or "sm" (long reactions/sentences)
         headline:"…", text:"… paragraph with <strong>key terms</strong> …",
         fig:{ aria:"what the animation shows", shape:"square"|"wide"|"nl" } }, // canvas #hero-plot; or fig:{ html:"…custom markup…" }; fig:null for none
  goals:["I can …", …],                  // 4–6
  start:{
    blocks:[{ title:"Word story", html:"…" }],                  // optional sheets after the hero (ENG4U word story, HFA4U safety note, …)
    warmup:{ questions:[ /* 6 × MC, below */ ], refreshers:{ "<skill>":"2–4 sentences with an example", … } }
  },
  explore:{ heading:"Interval builder", intro:"…", predIntro:"(optional)", chalIntro:"(optional)",
            predictions:[ /* 3–4 */ ], challenges:[ /* 2–3 */ ], blocks:[/* optional sheets after */] },
  part3:{ slug:"detective", name:"Detective", heading:"Graph detective", intro:"…",
          blocks:[{ title:"What the split points mean", html:"…" }],   // static sections after your Part 3 interactive
          quickCheck:{ title:"Detective’s questions", summary:"Detective’s questions", intro:"(optional)", items:[ /* 4 */ ] },
          blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal", html:"…", prompt:"Your imitation" }] },
  practice:{ intro:"(optional; default is the standard ‘Three challenges…’ line)", activities:[ /* 3 */ ] },
  reflect:{ journal:[{ id:"j1", q:"…" }, …4], blocks:[…], art:{…ENG4U only, §8} },
  final:{ intro:"(optional)", questions:[ /* 10: 3 K, 3 T, 2 C, 2 A, each with a and b */ ] },
  task:{ title:"…", summary:"(summary label)", statement:"<p>…</p>", checks:["checklist line html", …], tips:["tip per line", …],
         explainPrompt:"…", vocab:"Use the words …", success:"(optional)", more:"(optional)", after3:"(optional, after 3 different answers)" },
  cards:[["front", "back"], …],          // 10–12
  exceptions:{ challenges:"reason" }     // only where the plan states a different count; keys: goals warmup predictions challenges practice quickCheck journal final finalSplit cards task
};
```
The header subtitle ("MHF4U, Chapter 1: Polynomial Functions"), storage keys, progress record and the "Course home" link come from `course.json`. Don't set them, except `storageKey` when a plan says to keep a legacy key.

### 3.2 Item shapes
```js
// multiple choice (warm-up, review diagnostic, practice "mc" activity, Final Check a/b)
{ id:"w1", skill:"Inequalities on a number line", goal:2, prompt:"…", use:"(optional ‘Use these values’ box html)",
  options:[{ t:"`x < 3`", ok:true, why:"…" }, { t:"…", why:"misconception feedback" }, …4],
  hints:["Hint", "Bigger hint", "Worked solution"] }           // final questions have no hints
// Final Check
{ id:"k1", cat:"K", goal:1, topic:"05" /* reviews only */, a:{ prompt, options, use? }, b:{ prompt, options, use? } }
// prediction (options carry no why; the explanation shows after the reveal)
{ id:"p1", prompt:"…", options:[{ t:"…", ok:true }, …4], explain:"…", /* any extra data your app needs, e.g. */ start:{…} }
// target challenge (the test lives in app.js)
{ id:"tc1", goal:[1, 2], prompt:"…", stretch:true /* last one */, why:"(shown when met)", hints:[…3], general:"(optional default wrong message)" }
// quick check item: chips; feedback per choice
{ id:"q1", goal:4, prompt:"…", choices:[{ t:"Yes", fb:"…" }, { t:"No", ok:true, fb:"Right. …" }] }
```
**Option order is set by the build, not by you.** Plans list the correct option first. The assembler reorders every 4-option `options`/`fixes` list that has exactly one `ok:true`, and every 4-choice quick-check `choices` list whose set of texts appears only once in the module (repeated chip sets such as Even/Odd/Neither are answer scales and keep their order): all-numeric options are sorted ascending, everything else is shuffled deterministically. So write options in the plan's order, never refer to an option by letter or position in any text ("option A", "the first answer"), and never rely on an option's index in app.js (use `MV.ok(option)`). If the plan's order carries meaning (e.g. options that form a sequence the prompt refers to), set `fixedOrder:true` on the item that owns the list.

If a feedback text doesn't start with "Right", "Correct", "Not quite", ✓ or ✗, the toolkit adds "✓ Correct." or "✗ Not quite." in front.

### 3.3 Practice activities (`practice.activities`, also review `mixed.activities` and `connect.activities`)
Every activity has `id`, `type`, `title`, `instruction` (one line), and optional `how` (the controls line; `how:""` hides it), `summary` (its label in the results summary; defaults to `title`), `goal` (default for its items), `star:true` (★ non-routine tag).
```js
{ type:"sorter", noun:"function", boxes:[{ id:"b1", label:"…", sub:"(optional)", icon:"(optional inline <svg>)" }],
  items:[{ id:"i1", t:"tile html", answer:"b1", why:"…", hints:[…3], wrong:{ b2:"feedback if put in b2", … }, goal }],
  wrongDefault:"(optional)", txt:true /* UI font for word tiles */ }          // " Try another box." is added
{ type:"spot", student:"Mateo", problems:[{ id:"e1", goal, task:"…", fig:"(optional html, e.g. a figure canvas)", steps:["…", …],
  answer:2 /* index of FIRST wrong step */, stepFb:["fb if step 1 tapped", …, "" /* at the error */, …],
  fixes:[{ t:"…", ok:true, why:"…" }, …4], hints:[…3] }] }
{ type:"match", leftTitle:"Equation", rightTitle:"Real roots", left:[{ id:"l1", t:"…", why:"(shown when matched)", hints:[…3] /* optional */, goal }],
  right:[{ id:"r1", t:"…" }], answer:{ l1:"r3", … }, wrong:{ "l1|r2":"pair-specific feedback" }, wrongDefault:"…" }   // right column is shuffled for display
{ type:"order", sequences:[{ id:"s1", goal, prompt:"…", steps:["in the CORRECT order", …], start:[2,0,3,1] /* optional jumble */,
  accept:[[0,2,1,3]] /* other correct orders */, wrong:[{ order:[1,0,2,3], fb:"…" }], why:"…", hints:[…3] }] }
{ type:"numeric", items:[{ id:"s1", goal, prompt:"…", answer:5 /* or a set: [-3, 0, 5] */, tol:1e-6, display:"`x = 5`",
  unit:"(optional)", label:"(optional input label)", keypad:"decimal"|"text", why:"…", hints:[…3],
  wrong:[{ match:[1, 16], fb:"Those are u-values." }, { missing:0, fb:"You lost the root 0." }] }] }
  // students may type 3/4, −2.5, 2π/3, √2/2, ±3, "1, −2" (sets are order-free); known wrong answers get their feedback
{ type:"selectall", items:[{ id, goal, prompt, options:[{ t, ok:true, why }, …], why:"…", hints:[…3] }] }
{ type:"mc", items:[ /* MC items; wrong answers show their why, then "Try again" */ ] }
{ type:"custom", … any fields your app needs …, items:[…] }      // rendered by app.activities[id] (section 4)
```
Reviews: tag every mixed-practice item with `topic:"05"` (the topic module it draws on).

### 3.4 Review modules (`kind:"review"`; parts Start, Connect, Mixed practice, Reflect, Final Check)
```js
{ kind:"review", goals:[6–9 chapter goals],
  start:{ diagnostic:{ questions:[ /* MC items, each with topic:"03" and goal */ ], refreshers:{…optional…} } },
  connect:{ heading:"…", intro:"…", activities:[ /* data activities */ ] },  // and/or app.connect(host, api) for a custom one
  mixed:{ heading:"(optional)", intro:"(optional)", activities:[ /* 12–18 items in total, interleaved, topic-tagged */ ] },
  reflect:{ journal:[…4] }, final:{ questions:[ /* 15: 4 K, 4 T, 3 C, 4 A; topic + goal on each; a and b */ ] },
  task:{…}, cards:[ /* 12–16 */ ] }
```
The toolkit builds the per-topic tables and "Revisit module NN" links from `topic` tags and `course.json`.

## 4. app.js: hooks
```js
(function(){
"use strict";
var $ = MV.$, css = MV.css, num = MV.num;
MV.module({
  hero:function(f){ /* f.canvas (#hero-plot or null), f.cap (figcaption), f.fig */ },
  explore:function(host, api){
    // host = empty div inside the Explore sheet. api = { S (persisted object for you), save(), changed(), banner(kind, text), content }
    // Build your centrepiece here (MV.pgLayout gives the reference layout). Call MV.changed() after every state change.
    return {
      predict:{ start:function(p){ /* jump to p's start state */ }, run:function(p, done){ /* animate (MV.tween), then call done() once */ } },
      challenge:function(id, opt){ /* opt.live is true for the live tick */ return { ok:false, msg:"named wrong-state feedback" }; }
    };
  },
  part3:function(host, api){ /* your Part 3 interactive; content.part3.blocks + quickCheck render after it */ },
  activities:{ builds:function(host, api, a){ /* a = the activity object from content */
    return { stats:function(){ return { first, total, done, line:"<label> (first try): x/N" }; }, missed:function(){ return [goal indices 0-based]; } }; } },
  task:{ render(inputsHost, previewHost, api) {/* api.S persisted; call api.update() on every input */},
         read() {/* -> design object */}, valid(d) {/* true or a message */}, checks(d) {/* -> [bool per content.task.checks line] */},
         tips(d, results) {/* -> [html] (optional; default = content.task.tips for failing lines) */},
         key(d) {/* string id of a valid answer, for "answers you've found" */}, label(key) {/* html */}, text(key) {/* plain text for the summary */},
         summary(taskState) {/* optional: replaces the task's summary lines (writing tasks: include the student's full text) */} },
  figures:{ w6:function(plot, canvas){ plot.draw({ view:{…}, curves:[…] }); } },  // for <canvas class="plot" data-fig="w6" role="img" aria-label="…"> in content
  connect:function(host, api){ /* reviews: custom Connect activity */ },
  summaryLines:function(){ return ["extra summary line", …]; },   // optional
  onShow:function(view){ }                                        // optional
});
})();
```
- Persist your interactive's state in `api.S` (a plain object saved with the module), then `api.save()`.
- Scoring is first-try everywhere (blueprint §9): a challenge or item counts as first try only if it was right on the first check **and** the worked solution (hint level 3) wasn't shown. The toolkit does this for its own components; do the same in custom activities.
- Use `MV.hintBtn(key, level)` + `MV.hintsHTML(hints, level)` for the three-level help; `MV.fbHTML("good"|"bad", html)` for feedback; `MV.focusFb(container)` after a check; `MV.keepFocus(host, repaintFn)` when you re-render buttons (give buttons stable `data-k` attributes so focus survives).

## 5. Toolkit API (`window.MV`)
| Call | Use |
|---|---|
| `MV.m("y = ax^n")`, `MV.md(html)` | math typesetting (section 3); `md` processes backticks in a string |
| `MV.num(v, dp)`, `MV.frac(v)`, `MV.MINUS` | numbers with true minus and thin-space thousands; fraction text |
| `MV.plain(html)` | plain text (superscripts become ², fractions a/b); use for aria-labels and summary text |
| `MV.esc(s)` | escape text for HTML attributes |
| `MV.css("--pen")` | read a colour token (canvas drawing; never hard-code colours) |
| `MV.reduceMotion`, `MV.tween({dur, step(t), done})`, `MV.wait(ms, fn)` | animation that jumps to the end with reduced motion |
| `MV.iv.text/ineq/set/norm/complement/contains/equal` | interval notation helpers; pieces `{a, b, aIn, bIn}` with ±Infinity |
| `MV.parseNum(str)`, `MV.parseList(str)`, `MV.sameNums(a, b, tol)` | safe number parsing (no eval) |
| `MV.ok(opt)`, `MV.ans(item)`, `MV.right(options)` | answer access (section 3) |
| `MV.goalIdx(goal)` | goal reference → 0-based indices |
| `MV.pgLayout(host, {shape, aria})` | reference centrepiece layout → `{graph, cap, banner, canvas, ctrl, read}` |
| `MV.readoutHTML([[label, html], …])` | readout rows for a `<dl class="read">` |
| `MV.sliders(host, defs, onChange)` | slider group (N9): `defs = [{id, label, param:"a"\|"n"\|"k"\|"d"\|"c"\|"b"\|"t", min, max, step, value, skip:[0], fmt, note}]` → `{get, set, all}` |
| `MV.seg(host, {label, options:[{id, t}], value, onChange})` | segmented toggle → `{set, get}` |
| `MV.player(host, {count, render(i), label(i), interval})` | Play / Step / Back (N13) |
| `MV.tableHTML({head, rows, hiRow, hiCol, caption})` | table of values in a scrolling box (N14) |
| `MV.usesHTML(html)` | "Use these values" box (N20); or set `use:` on a question |
| `MV.drag(plot, {handles(), move(id, x, y), snap, step, big, axis, key})` | draggable points with keyboard (G7); see 02's interval builder |
| `MV.intervalBuilder(host, opts)` | N10 interval builder component (02 is its pilot): see `toolkit/components/intervalBuilder.js` |
| `MV.download(name, text, type)` | save a file (printing is blocked on the site; offer "kitchen cards" etc. as downloads) |
| `MV.shuffle(arr, seed)` | deterministic shuffle |
| `MV.banner(kind, text)` | the Explore prediction banner |

### Plot (graph engine)
```js
var p = new MV.Plot(canvas, { xmin:-5, xmax:5, ymin:-5, ymax:5 }, { equal:false });
p.render = function(){ p.draw({ …scene… }); };  p.render();   // redraws itself on resize, theme change and font load
```
Scene keys: `view`, `grid` (default true), `axes`, `ticks`, `xTicks:{step, pi:true, den, fmt}` (π ticks, G3), `yTicks`, `xLabel`, `yLabel`, `equal:true` (G9), `quads:true` with `shade:[1, 2]`, `bands:[{x0, x1, color}]` (G6), `regions:[{f, g, x0, x1, where:"above"|"below"}]` (G6), `asymptotes:[{x:2} | {y:1} | {m, b}, label]` (G1), `curves:[{f | pts, color, width, dash, alpha, arrows, domain:[a, b]}]` (jumps at asymptotes break automatically, G1/G16), `segments:[{x1, y1, x2, y2, color, width, dash, arrow}]`, `lines:[{p:[x, y], q:[x, y], label} | {x0, f, tangent:true, label}]` (G5), `arrowsAnn:[{from, to, label, color}]` (G11), `points:[{x, y, r, color, label, open:true /* hole */, ring:true /* drag highlight */}]` (G2), `labels:[{x, y, text, color, align, dx, dy, bg}]`, `data:[{x, y}]` (G12), `numberLine:{min, max, step, pieces, hatch, dots, marks, style}` (G14), `describe:"sentence for screen readers"` (G15, **always set it**), `after:function(ctx, plot){ … }` for anything custom (use `plot.X(x)`, `plot.Y(y)`, `plot.xOf(px)`, `plot.yOf(py)`).

Canvas classes: `plot` (4:3), `plot square`, `plot wide` (16:9), `plot nl` (number line). Wrap a canvas you drag on in `<div class="plot-wrap">`.

Graph colours (05-colour-key §3): main curve `--pen` 3–3.2 px; parent/before `--ink-2` dashed [6, 6]; second function `--f3`; combined `--ink` 3.4 px; asymptotes `--ink-2` [8, 6]; tangent `--ink`; shading `--hi-soft`. Parameter colours only on the letter that's doing that job (colour-key rule 1).

### CSS classes you can reuse
`.sheet .part .q .q-head .q-prompt .opts .opt .chip .fchip .btn(.primary .ghost .sm) .fb(.good .bad) .hints .refresh .how .tiny .muted .m .eq-cap .banner .read .seg .slider .chips .alg (details "Check it with algebra") .sym (2-column) .design (2-column) .inrow .numin .tbl-wrap .legend .qpath .tag .vh (screen-reader only) .plot-wrap`. Colour tokens: `--paper --sheet --ink --ink-2 --rule --pen --acol --p-k --p-d --p-c --p-b --p-t --f3 --red --green --good-bg --bad-bg --info-bg --hi --hi-soft --hi-ink --plot-grid --plot-axis`. Course-specific role colours (science molecules, English annotation) belong in `toolkit/courses/<course>.css` (section 9) or your app.css as new tokens with light **and** dark values.

## 6. Writing and notation rules the code can't enforce
- Tone: plain, respectful, Grade 12; "you"; action first ("Tap a function, then tap the box it belongs in."). Feedback: "✓ Correct." + why; "✗ Not quite." + the likely mix-up + "Answer: …" (Final Check, warm-up). In practice, leave out the answer and invite another try.
- Canadian spelling: behaviour, centre, colour, favourite, metre, litre, analyse, modelling, labelled, travelled, defence; "practice" (noun) / "practise" (verb); "Grade 12". The check flags US spellings.
- Math (blueprint §7): true minus; italic variables, upright numbers and function names; `(2, 24)` with a space after the comma; `20 000` thousands; ≈ never =; intervals `(−∞, 3]` with a space after the comma; no "lim" in MHF4U (MCV4U has its own conventions in its course plan).
- Colour is never the only signal: keep the letters, ✓/✗ and words.
- Calculator-free: values in questions must work by hand; give approximations in `use:`.
- Contexts: Canadian, metric, diverse names. Spot the Error uses the student name in the plan.

## 7. Accessibility and quality floor (check.mjs tests some; you own the rest)
- Native `<button>`s and inputs only. No clickable divs. **No HTML5 drag-and-drop** (the site blocks `dragstart`). Every drag needs a keyboard path (`MV.drag` handles give arrows; add keys like O/C).
- Tap targets ≥ 24 px; inputs: `inputmode="decimal"` for numbers, `type="number"` (no inputmode) when negatives are needed on phones.
- No sideways scroll at 390 px: wrap wide tables/strips in a scrolling box (`.tbl-wrap`, or `overflow-x:auto`).
- `role="img"` + a current `describe` on every canvas. Live readouts get `aria-live="polite"`.
- Reduced motion: every animation through `MV.tween`/`MV.wait`, or check `MV.reduceMotion` and show the end state.
- Dark mode: only tokens (`MV.css("--…")` in canvas code). Look at the `m-*` screenshots.
- The site injects copy-protection (no copying outside form fields, no printing), a "page-nav" bar and auth. Don't rely on `window.print()`, `document.execCommand("copy")` outside a textarea, or anything outside the page. **No network requests, no external URLs** (Google Fonts only, already in the shell).
- Size: aim for a built page under 300 KB (check warns above 300, fails above 400).

## 8. Course notes
- **MHF4U / MCV4U / MDM4U:** math as above. MCV4U and MDM4U conventions and components (V1–V14, D1–D13) are in their course plans; build the ones your module needs in app.js (section 9: tag them with `@component` and reuse siblings').
- **SBI4U / SCH4U / HFA4U (science):** the hero "equation" may be a reaction or sequence (`eqSize:"sm"`); centrepieces are simulations with live data graphs (deterministic: same settings → same numbers). Part 3 uses a "Zoom to the molecules" or "Check it with data" panel (use `<details class="alg">`). Every module has an investigation item and an STSE/Canadian context. SCH4U: take every constant from the course data tables (course plan §3). HFA4U: APA 7 citations, the safety/sensitivity rules in its course plan §2 (weight-inclusive language; self-analysis optional and private), and "kitchen cards" offered with `MV.download` (printing is blocked on the site).
- **ENG4U:** header carries the trivium tag automatically (from course.json). Use `start.blocks` for the **Word story**, `part3.blocksAfter` with `type:"write"` for **Sentence to steal** (students' imitation autosaves), and `reflect.art` for the required **Add a principle to My Art of Language**:
  `art:{ intro:"(optional)", placeholder:"(optional)", examples:["master’s line 1", …] }`. It saves to the shared `eng4u-art-v1` record that the course home shows as a book, and the Final Check can't be submitted until the principle, example and imitation are filled in. Writing tasks: use `task.summary(state)` to put the student's full text in the summary; checklists test structure only ("This checklist makes sure the parts are there. Your teacher reads the writing."). Passages: public domain or written for the module (course plan §3).

## 9. Shared components (several builders run at once, so read this carefully)
Several module builders work in parallel, so **builders never write to `modules-src/toolkit/`** (no new
components, no course files) and never run `build/hub.mjs`. The orchestrator does both.

- **Use what exists:** `ls modules-src/toolkit/components/ modules-src/toolkit/courses/` and read the usage
  comment at the top of any component you can use (`MV.<name>(host, opts)`).
- **Reuse a sibling's work:** the toolkit plans give shared pieces codes (N12 unit circle, N11 sign chart,
  S5, C7, D1, V3 …). When you build one inside your `app.js`, put a marker comment on its first line:
  `// @component N12 unitCircle — <one-line purpose>`. Before building a coded component, look for an
  existing one: `grep -rn "@component N12" modules-src/courses/<course>/*/app.js` — if found, copy that
  code into your app.js and adapt it (don't import across modules; each page is self-contained).
- **Report it:** list every coded or generic component you built under "promotion candidates" in your
  reply; the orchestrator may move it into the toolkit later (then `MV.<name>` becomes available and
  modules are rebuilt).
- **Course-wide files** (`toolkit/courses/<course>.js` / `.css`, e.g. SCH4U data tables, SBI4U molecule
  colours): created only by the first module built in each course, which the orchestrator runs alone and
  tells explicitly that it may create them. Everyone else only reads them. The assembler includes them in
  every module of that course automatically.
- **Toolkit bug or missing core feature:** work around it in `app.js` and describe it in your reply.

## 10. Definition of done (blueprint §13)
- [ ] Every item in the plan is in content.mjs with the plan's wording, answers, hints and feedback (warm-up 6 + refreshers, predictions, challenges, Part 3 + quick check, all 3 practice activities, journal, Final Check A **and** B, task with every checklist line and tip, every flashcard).
- [ ] Explore centrepiece: every control, readout row, mode and the "aha" from the plan; predictions animate their reveal; challenges have the plan's exact tests and named wrong-state feedback.
- [ ] Part 3 interactive is a *different* interaction from Explore and has its algebra/data panel.
- [ ] `node build/check.mjs <course> NN` prints ✓ PASS; you looked at the screenshots (desktop and phone/dark) and they look right.
- [ ] **You exercised your own interactives on purpose** with `node build/try.mjs <course> NN modules-src/.artifacts/<your-test>.mjs` (a tiny Playwright script; see the usage comment at the top of `build/try.mjs`): each challenge accepts its correct answer and rejects a named wrong state with the right message; each custom practice item accepts the right answer; the task accepts a valid answer from the plan and rejects the plan's near-misses.
- [ ] Final report: files written, check result, file size, anything ambiguous in the plan and how you read it, any toolkit change or problem.
