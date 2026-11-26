// MCV4U 08 Derivatives from First Principles. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/08-derivatives-from-first-principles.md
// LIM("h → 0") is the toolkit's limit markup (same HTML as MV.mcv.lim, styled by .lm-lim in toolkit/courses/mcv4u.css).
const LIM = s => '<span class="lm-lim"><span class="lm-lt">lim</span><span class="vh"> (</span><span class="lm-lu">`' + s + '`</span><span class="vh">)</span></span>';
const DQ = "`{f(x + h) - f(x)}/{h}`";
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3)
const M1 = "Replace <strong>every</strong> `x` with `(x + h)`, then expand: `(x + h)^2 = x^2 + 2xh + h^2`.";
const M2 = "0/0 is a signal to simplify. Cancel the `h` first; then let `h → 0`.";
const M4 = "`-(2x^2 - 5x) = -2x^2 + 5x`. Bracket `f(x)` before subtracting.";
const M5 = "`f(a)` is the height; `f′(a)` is the slope. The tangent uses both.";
const M6 = "A corner is continuous, but the slopes from the left and right disagree, so there’s no derivative.";

export default {
  id:"08-derivatives-from-first-principles",
  kind:"topic",
  title:"Derivatives from first principles",
  topic:"Derivatives from First Principles",
  readyTopic:"derivatives from first principles",
  hero:{
    eq:"`f′(x) =` " + '<span class="fp-heq">' + LIM("h → 0") + " " + DQ + "</span>",
    eqLabel:"f prime of x equals the limit, as h approaches 0, of f of x plus h, minus f of x, all over h",
    eqSize:"sm",
    headline:"Simplify first, then let `h` shrink",
    text:"The fraction is the slope of a <strong>secant</strong> over a run of `h`. Shrink `h` to zero and the secant becomes the <strong>tangent</strong>. Put `h = 0` in straight away and you get 0/0, so expand, cancel the `h`, and only then take the <strong>limit</strong>. The result is the <strong>derivative from first principles</strong>.",
    fig:{ html:'<div class="fp-hero"><canvas class="plot" id="hero-plot" role="img" aria-label="The parabola y = x squared with a secant through the points at x = 1 and x = 1 + h."></canvas>' +
      '<div class="fp-hl" id="fp-hl" aria-live="polite"></div>' +
      '<label class="slider fp-hsl" for="fp-hh"><span class="slider-top"><span>Run <i>h</i></span><output id="fp-hho">1</output></span><input type="range" id="fp-hh" min="0" max="1" step="0.01" value="1" style="accent-color:var(--ink)" aria-label="h, the run of the secant, from 0 to 1" disabled></label></div>' }
  },
  goals:[
    "I can write the first-principles definition of `f′(x)` and explain what each part means.",
    "I can write and expand `f(x + h)` correctly.",
    "I can simplify the difference quotient by factoring out `h` before letting `h → 0`.",
    "I can use first principles for rational and radical functions, using common denominators or conjugates.",
    "I can use `f′(a)` to find the slope and the equation of a tangent line.",
    "I can identify where a function is not differentiable, and state the power-rule pattern."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Expanding", goal:2, prompt:"Expand `(x + h)^2`.",
          options:[
            { t:"`x^2 + 2xh + h^2`", ok:true, why:"`(x + h)(x + h)`." },
            { t:"`x^2 + h^2`", why:"That squares each term. Try `x = h = 1`: 4 ≠ 2." },
            { t:"`x^2 + 2h`", why:"That doubles `h`. Multiply it out." },
            { t:"`x^2 + xh + h^2`", why:"That has one middle term. There are two `xh` terms." }],
          hints:["Write it as `(x + h)(x + h)`.", "Four products: `x^2`, `xh`, `hx`, `h^2`.", "`x^2 + 2xh + h^2`."] },
        { id:"w2", skill:"Expanding", goal:2, prompt:"Expand `(x + h)^3`.",
          options:[
            { t:"`x^3 + 3x^2h + 3xh^2 + h^3`", ok:true, why:"Pascal’s row 1 3 3 1." },
            { t:"`x^3 + h^3`", why:"That cubes each term. Try `x = h = 1`: 8 ≠ 2." },
            { t:"`x^3 + 3xh + h^3`", why:"That misses the powers. The middle terms are `3x^2h` and `3xh^2`." },
            { t:"`x^3 + 3x^2h + h^3`", why:"That drops a term. There are four terms." }],
          hints:["Multiply `(x + h)^2` by `(x + h)`.", "`(x^2 + 2xh + h^2)(x + h)`.", "`x^3 + 3x^2h + 3xh^2 + h^3`."] },
        { id:"w3", skill:"Function notation", goal:2, prompt:"`f(x) = x^2 - 3x`. Find `f(x + h)`.",
          options:[
            { t:"`x^2 + 2xh + h^2 - 3x - 3h`", ok:true, why:"`(x + h)^2 - 3(x + h)`." },
            { t:"`x^2 - 3x + h`", why:"That’s `f(x) + h`. Replace each `x`, don’t add `h` at the end." },
            { t:"`x^2 + h^2 - 3x`", why:"That squares each term and drops the `-3h`. " + M1 + " The `-3x` becomes `-3(x + h)`." },
            { t:"`x^2 + 2xh + h^2 - 3x`", why:"That forgets to replace the second `x`. `-3x` becomes `-3(x + h)`." }],
          hints:["Replace every `x` with `(x + h)`.", "`(x + h)^2 - 3(x + h)`.", "Expand both parts."] },
        { id:"w4", skill:"Function notation", goal:1, prompt:"`f(x) = 2x + 5`. Simplify " + DQ + ".",
          options:[
            { t:"2", ok:true, why:"`{2x + 2h + 5 - 2x - 5}/{h} = {2h}/{h}`." },
            { t:"`{2h + 5}/{h}`", why:"That forgets to subtract the 5. Bracket `f(x)`: `-(2x + 5) = -2x - 5`." },
            { t:"`2 + {5}/{h}`", why:"That’s the same slip, split up: the 5 cancels when you subtract `f(x) = 2x + 5`." },
            { t:"0", why:"That puts `h = 0` in first. Cancel `h` first." }],
          hints:["Find `f(x + h) = 2(x + h) + 5`.", "Subtract `2x + 5`: `2h` is left.", "`{2h}/{h} = 2`."] },
        { id:"w5", skill:"Fractions and radicals", goal:4, prompt:"Simplify `{1}/{x + 2} - {1}/{x}`.",
          options:[
            { t:"`-{2}/{x(x + 2)}`", ok:true, why:"`{x - (x + 2)}/{x(x + 2)}`." },
            { t:"`{1}/{2}`", why:"That subtracts the denominators. Fractions need a common denominator." },
            { t:"`{2}/{x(x + 2)}`", why:"Check the sign: `x - (x + 2) = -2`." },
            { t:"`-{2}/{x + 2}`", why:"That drops a factor. The common denominator is `x(x + 2)`." }],
          hints:["Common denominator: `x(x + 2)`.", "`{x - (x + 2)}/{x(x + 2)}`.", "`-{2}/{x(x + 2)}`."] },
        { id:"w6", skill:"Fractions and radicals", goal:4, prompt:"Rationalize the numerator: `{√{9 + h} - 3}/{h}`.",
          options:[
            { t:"`{1}/{√{9 + h} + 3}`", ok:true, why:"The numerator becomes `(9 + h) - 9 = h`, which cancels." },
            { t:"`{√{9 + h} + 3}/{h}`", why:"That only changes the sign. Multiply top and bottom by the conjugate." },
            { t:"`{1}/{√{9 + h} - 3}`", why:"That uses the wrong conjugate. Multiply by `√{9 + h} + 3`, so the bottom becomes `h(√{9 + h} + 3)`." },
            { t:"`{√h}/{h}`", why:"That treats `√{9 + h}` as `3 + √h`. Roots don’t split over sums." }],
          hints:["Multiply by `{√{9 + h} + 3}/{√{9 + h} + 3}`.", "The top becomes `9 + h - 9 = h`.", "Cancel `h`: `{1}/{√{9 + h} + 3}`."] }
      ],
      refreshers:{
        "Expanding":"`(x + h)^2 = x^2 + 2xh + h^2`; `(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3`. Never just square or cube each term.",
        "Function notation":"`f(x + h)` means: in the rule for `f`, replace every `x` with `(x + h)`. It’s not `f(x) + h`.",
        "Fractions and radicals":"Subtract fractions over a common denominator. For a difference of square roots, multiply by the conjugate so the roots disappear from the top."
      }
    }
  },
  explore:{
    heading:"Difference-quotient engine",
    intro:"Two ways to find a slope. <strong>Numbers first:</strong> make `h` tiny and watch the table. <strong>Simplify first:</strong> do the algebra, then let `h → 0`. Do they agree?",
    predictions:[
      { id:"p1", prompt:"The engine shows `f(x) = 3x^2 - 5x` in Numbers first, with `a = 2`. Before pressing the `h` chips, what value will the difference quotient approach?",
        options:[{ t:"7", ok:true }, { t:"2, which is `f(2)`" }, { t:"0, because the top shrinks to 0" }, { t:"10, the first row" }],
        explain:"`f(2) = 2` is the height. The quotients settle on the slope, 7. The top shrinks, but so does the bottom." },
      { id:"p2", prompt:"The engine shows `x^2` in Simplify first. What do you get if you put `h = 0` into `{(x + h)^2 - x^2}/{h}` right away?",
        options:[{ t:"0/0, which tells you nothing yet", ok:true }, { t:"0, so the slope is 0" }, { t:"`2x`" }, { t:"Undefined, so `x^2` has no derivative" }],
        explain:"0/0 is a signal to simplify, not an answer." },
      { id:"p3", prompt:"Will the slope of `y = {1}/{x}` at `x = 1` be positive, negative or zero?",
        options:[{ t:"Negative", ok:true }, { t:"Positive" }, { t:"0" }, { t:"It doesn’t exist" }],
        explain:"The curve falls everywhere, so every slope is negative." },
      { id:"p4", prompt:"The engine shows `f(x) = |x|` in Numbers first, with `a = 0`. Using `h = 0.1`, 0.01 and then −0.1, −0.01, what will the table show?",
        options:[{ t:"1 for positive `h`, −1 for negative `h`: no single limit", ok:true }, { t:"0 for all `h`" }, { t:"1 for all `h`" }, { t:"Values that grow without bound" }],
        explain:"`f` is continuous at 0, but the slopes from the two sides differ, so `f′(0)` doesn’t exist." }
    ],
    chalIntro:"Use the engine, then press <strong>Check challenge</strong>. Challenge 3 also uses the workbench under the engine. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Simplify first for `f(x) = x^3`. Reach `f′(x)` in at most 5 moves without using a trap. (Writing `f(x + h)` is free.)",
        why:"Expand, subtract, factor, cancel, limit: `f′(x) = 3x^2`.",
        hints:["Start with Write `f(x + h)` and Expand.", "After subtracting: `3x^2h + 3xh^2 + h^3`.", "Factor out `h`, cancel, let `h → 0`: `3x^2`."] },
      { id:"tc2", goal:[4, 5], prompt:"For `f(x) = {1}/{x}` (`x > 0`), set `a` so that the tangent has slope `-{1}/{4}`.",
        why:"`f′(x) = -{1}/{x^2}`, and `-{1}/{2^2} = -{1}/{4}`.",
        hints:["Find `f′(x) = -{1}/{x^2}` first (Simplify mode).", "`-{1}/{a^2} = -{1}/{4}`.", "`a^2 = 4`, and `a > 0`, so `a = 2`."] },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"For `f(x) = √x`, find the point where the tangent is parallel to `y = x/6 - 1`, then enter the tangent’s equation `y = mx + b`.",
        why:"`f′(9) = {1}/{2√9} = {1}/{6}`, the point is (9, 3), and the tangent is `y = {x}/{6} + {3}/{2}`.",
        hints:["First principles with the conjugate gives `f′(x) = {1}/{2√x}`.", "Set `{1}/{2√a} = {1}/{6}`: `√a = 3`, `a = 9`, and the point is (9, 3).", "`y - 3 = {1}/{6}(x - 9)`, so `y = {x}/{6} + {3}/{2}`."] }
    ],
    blocks:[{ title:"What to notice", html:"<p>The algebra and the table always agree when the function is smooth. Simplifying explains <em>why</em> the table settles, and the same steps produce a formula for every `x` at once.</p>" }]
  },
  part3:{
    slug:"pattern", name:"Pattern hunter", heading:"Pattern hunter",
    intro:"Two stations. In the first, four derivations from first principles turn into a pattern, and the pattern into a conjecture. In the second, a zoom lens shows where the definition breaks down.",
    x4:{ answer:{ row:[1, 4, 6, 4, 1], c:4, e:3 } },
    conj:{ prompt:"Choose the conjecture that fits every row: " + DDX + "`(x^n) =` ?",
      options:[
        { t:"`nx^{n - 1}`", ok:true, why:"Bring the power down and lower it by 1: `x^2 → 2x`, `x^3 → 3x^2`, `x^4 → 4x^3`, and even `x → 1x^0 = 1`." },
        { t:"`x^{n - 1}`", why:"Test it on `x^2`: it gives `x`, but first principles gave `2x`." },
        { t:"`nx^n`", why:"Test it on `x^2`: it gives `2x^2`, but first principles gave `2x`." },
        { t:"`(n - 1)x^n`", why:"Test it on `x^2`: it gives `x^2`, but first principles gave `2x`." }] },
    quickCheck:{
      title:"Quick check", summary:"Pattern hunter quick check",
      items:[
        { id:"q1", goal:6, prompt:"By the pattern, " + DDX + "`(x^5) =` ?",
          choices:[{ t:"`5x^4`", ok:true, fb:"Right. Bring the 5 down and lower the power by 1." }, { t:"`x^4`", fb:"Bring the 5 down and lower the power by 1." }, { t:"`5x^5`", fb:"Bring the 5 down and lower the power by 1." }, { t:"`4x^5`", fb:"Bring the 5 down and lower the power by 1." }] },
        { id:"q2", goal:[2, 6], prompt:"Which term of the expanded `(x + h)^n` survives in the derivative?",
          choices:[{ t:"The `nx^{n - 1}h` term", ok:true, fb:"Right. `x^n` cancels; terms with `h^2` or more still have an `h` after dividing, so they vanish." }, { t:"The `x^n` term", fb:"`x^n` cancels; terms with `h^2` or more still have an `h` after dividing, so they vanish." }, { t:"The `h^n` term", fb:"`x^n` cancels; terms with `h^2` or more still have an `h` after dividing, so they vanish." }, { t:"The `h^2` term", fb:"`x^n` cancels; terms with `h^2` or more still have an `h` after dividing, so they vanish." }] },
        { id:"q3", goal:6, prompt:"Why doesn’t `y = ∛x` have a derivative at `x = 0`?",
          choices:[{ t:"Its tangent is vertical: the quotient grows without bound", ok:true, fb:"Right. `∛x` is continuous at 0, and `∛0 = 0`. The slopes blow up." }, { t:"It isn’t continuous", fb:"`∛x` is continuous at 0, and `∛0 = 0`. The slopes blow up." }, { t:"It has a corner", fb:"`∛x` is continuous at 0, and `∛0 = 0`. The slopes blow up." }, { t:"`∛0` is undefined", fb:"`∛x` is continuous at 0, and `∛0 = 0`. The slopes blow up." }] },
        { id:"q4", goal:6, prompt:"Does the pattern predict the first-principles result for `{1}/{x}`?",
          choices:[{ t:"Yes: `x^{-1} → -x^{-2}`", ok:true, fb:"Right. `-1 · x^{-2} = -{1}/{x^2}`, exactly what first principles gave." }, { t:"No: only whole-number powers work", fb:"`-1 · x^{-2} = -{1}/{x^2}`, exactly what first principles gave." }, { t:"No: it predicts `x^{-2}`", fb:"`-1 · x^{-2} = -{1}/{x^2}`, exactly what first principles gave." }, { t:"Yes, but only for `x > 0`", fb:"`-1 · x^{-2} = -{1}/{x^2}`, exactly what first principles gave." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"order", title:"Put the steps in order", summary:"Put the steps in order", goal:[1, 3, 4],
        instruction:"Put the steps of each first-principles derivation in order.",
        rules:{ lim:"With `h` still in the denominator, `h → 0` gives 0/0.", div:"Subtract `f(x)` first so every term on top has a factor of `h`.", conj:"There’s nothing to cancel until the conjugate clears the roots." },
        sequences:[
          { id:"s1", goal:[1, 3], prompt:"`f(x) = 2x^2 - x`", start:[2, 0, 4, 1, 5, 3],
            steps:["`f(x + h) = 2x^2 + 4xh + 2h^2 - x - h`", "`f(x + h) - f(x) = 4xh + 2h^2 - h`", "Divide by `h`: `{4xh + 2h^2 - h}/{h}`", "Factor: `{h(4x + 2h - 1)}/{h}`", "Cancel (`h ≠ 0`): `4x + 2h - 1`", "Let `h → 0`: `f′(x) = 4x - 1`"],
            hints:["What has to be written down before you can subtract `f(x)`?", "Expand, subtract `f(x)`, then divide by `h`. Factor before you cancel.", "The limit is always last: `4x + 2h - 1 → 4x - 1`."] },
          { id:"s2", goal:4, prompt:"`f(x) = {1}/{x - 2}`", start:[1, 4, 0, 3, 2],
            steps:["`f(x + h) - f(x) = {1}/{x + h - 2} - {1}/{x - 2}`", "Common denominator: `{(x - 2) - (x + h - 2)}/{(x + h - 2)(x - 2)}`", "Simplify the top: `{-h}/{(x + h - 2)(x - 2)}`", "Divide by `h`: `{-1}/{(x + h - 2)(x - 2)}`", "Let `h → 0`: `f′(x) = {-1}/{(x - 2)^2}`"],
            hints:["Which step needs a common denominator?", "The top simplifies to `-h` before you divide by `h`.", "The limit is always last."] },
          { id:"s3", goal:4, prompt:"`f(x) = √{x + 1}`", start:[3, 1, 4, 0, 2],
            steps:["`{√{x + h + 1} - √{x + 1}}/{h}`", "Multiply top and bottom by `√{x + h + 1} + √{x + 1}`", "Top becomes `(x + h + 1) - (x + 1) = h`", "Cancel `h`: `{1}/{√{x + h + 1} + √{x + 1}}`", "Let `h → 0`: `f′(x) = {1}/{2√{x + 1}}`"],
            hints:["Which step clears the roots from the top?", "Multiply by the conjugate before anything can cancel.", "Conjugate, simplify the top to `h`, cancel `h`, then let `h → 0`."] }
        ] },
      { id:"numbers", type:"custom", title:"First principles by the numbers", summary:"First principles by the numbers", star:true, goal:[2, 3, 4, 5],
        instruction:"Use first principles on each function, then fill in the boxes. F5 to F8 are non-routine.",
        how:"Type a number in each box (fractions such as 1/6 are fine), then press Check.",
        general:"Work through it again: write `f(x + h)`, subtract `f(x)`, divide by `h`, then let `h → 0`.",
        items:[
          { id:"f1", goal:3, label:"F1", prompt:"`f(x) = 5x - 3`: `f′(x)` = ?", form:["`f′(x) =`", { k:"p" }], answer:{ p:5 }, display:"`f′(x) = 5`",
            wrong:[{ txt:"5x-3", fb:"The constant cancels when you subtract `f(x)`." }, { p:-3, fb:"The constant cancels when you subtract `f(x)`." }],
            hints:["Find `f(x + h) = 5(x + h) - 3`.", "Subtract `f(x)`: `5x + 5h - 3 - 5x + 3 = 5h`.", "`{5h}/{h} = 5`, so `f′(x) = 5`."] },
          { id:"f2", goal:2, label:"F2", prompt:"`f(x) = x^2 + 4x`: `f′(x) = □x + □`", form:["`f′(x) =`", { k:"p" }, "`x +`", { k:"q" }], answer:{ p:2, q:4 }, display:"`f′(x) = 2x + 4`",
            wrong:[{ p:0, q:4, fb:"`(x + h)^2` gives `2xh`." }],
            hints:["`f(x + h) = (x + h)^2 + 4(x + h)`.", "Subtract `f(x)`: `2xh + h^2 + 4h`.", "Divide by `h`: `2x + h + 4 → 2x + 4`."] },
          { id:"f3", goal:5, label:"F3", prompt:"`f(x) = 3x^2 - x + 2`: `f′(-1)` = ?", form:["`f′(-1) =`", { k:"p" }], answer:{ p:-7 }, display:"`f′(-1) = -7`",
            wrong:[{ p:6, fb:"That’s `f(-1)`; you want the slope." }, { p:-5, fb:"`f′(x) = 6x - 1`." }],
            hints:["Find `f′(x)` by first principles first, then substitute `x = -1`.", "The difference is `6xh + 3h^2 - h`; divide by `h`: `6x + 3h - 1`.", "`f′(x) = 6x - 1`, so `f′(-1) = -6 - 1 = -7`."] },
          { id:"f4", goal:2, label:"F4", prompt:"`f(x) = x^3 - 2x`: `f′(x) = □x^2 + □`", form:["`f′(x) =`", { k:"p" }, "`x^2 +`", { k:"q" }], answer:{ p:3, q:-2 }, display:"`f′(x) = 3x^2 - 2`",
            wrong:[{ p:0, q:-2, fb:"Expand `(x + h)^3` fully." }],
            hints:["`(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3`.", "Subtract `f(x)`: `3x^2h + 3xh^2 + h^3 - 2h`.", "Divide by `h` and let `h → 0`: `3x^2 - 2`."] },
          { id:"f5", goal:4, star:true, label:"F5", prompt:"`f(x) = {4}/{x}`: `f′(2)` = ?", form:["`f′(2) =`", { k:"p" }], answer:{ p:-1 }, display:"`f′(2) = -1`",
            wrong:[{ p:1, fb:"Sign: `4x - 4(x + h)` is `-4h`." }, { p:-2, fb:"`-{4}/{x^2}` at 2 is −1." }],
            hints:["Common denominator: `{4}/{x + h} - {4}/{x} = {4x - 4(x + h)}/{x(x + h)}`.", "The top is `-4h`; divide by `h`: `{-4}/{x(x + h)} → -{4}/{x^2}`.", "`f′(2) = -{4}/{4} = -1`."] },
          { id:"f6", goal:4, star:true, label:"F6", prompt:"`f(x) = √{x + 4}`: `f′(5)` = ?", form:["`f′(5) =`", { k:"p" }], answer:{ p:0.16666666666666666 }, display:"`f′(5) = {1}/{6}`",
            wrong:[{ p:0.3333333333333333, fb:"`{1}/{2√9} = {1}/{6}`." }, { p:3, fb:"That’s `f(5)`." }],
            hints:["Multiply `{√{x + h + 4} - √{x + 4}}/{h}` by the conjugate.", "The top becomes `h`; cancel: `{1}/{√{x + h + 4} + √{x + 4}} → {1}/{2√{x + 4}}`.", "`f′(5) = {1}/{2√9} = {1}/{6}`."] },
          { id:"f7", goal:5, star:true, label:"F7", prompt:"`f(x) = x^2 - 6x`: find the point where the tangent is parallel to `y = 2x + 1`, then the tangent `y = mx + b`.",
            form:["Point (", { k:"x" }, ",", { k:"y" }, ")", "<br>", "Tangent `y =`", { k:"m" }, "`x +`", { k:"b" }], answer:{ x:4, y:-8, m:2, b:-16 }, display:"(4, −8); `y = 2x - 16`",
            wrong:[{ y:8, fb:"`f(4) = 16 - 24 = -8`." }, { b:0, fb:"Use the point: `-8 = 2(4) + b`." }],
            hints:["`f′(x) = 2x - 6` by first principles.", "Parallel means slope 2: `2x - 6 = 2`, so `x = 4`.", "`f(4) = -8`; `y + 8 = 2(x - 4)`, so `y = 2x - 16`."] },
          { id:"f8", goal:4, star:true, label:"F8", prompt:"`f(x) = {1}/{x^2}`: `f′(x) = □/x^{□}`", form:["`f′(x) =`", { k:"p", frac:"top" }, { k:"q", frac:"pow" }], answer:{ p:-2, q:3 }, display:"`f′(x) = -{2}/{x^3}`",
            wrong:[{ p:-1, q:4, fb:"Expand `x^2 - (x + h)^2 = -2xh - h^2`." }],
            hints:["Common denominator `x^2(x + h)^2`.", "Top: `x^2 - (x + h)^2 = -2xh - h^2`; divide by `h`: `-2x - h`.", "Let `h → 0`: `{-2x}/{x^4} = -{2}/{x^3}`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Hiro", how:"",
        instruction:"Hiro made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find `f′(x)` from first principles for `f(x) = x^2 + 3x`.",
            steps:["`f(x + h) = x^2 + h^2 + 3x + 3h`.", "`f(x + h) - f(x) = h^2 + 3h`.", "Divide by `h`: `h + 3`.", "Let `h → 0`: `f′(x) = 3`."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. Check step 1.", "Step 3 divides correctly.", "Step 4 follows; the error is earlier."],
            fixes:[
              { t:"`(x + h)^2 = x^2 + 2xh + h^2`, so the difference is `2xh + h^2 + 3h` and `f′(x) = 2x + 3`.", ok:true, why:M1 },
              { t:"Step 4 should give `3 + h`.", why:"Step 4 is right to let `h → 0`: `h + 3 → 3`. The real slip is the missing `2xh` in step 1." },
              { t:"`f(x + h) = x^2 + 3x + h`.", why:"That’s `f(x) + h`. " + M1 },
              { t:"Step 1 is correct.", why:"Try `x = h = 1`: `(1 + 1)^2 = 4`, but `1^2 + 1^2 = 2`. " + M1 }],
            hints:["Is `(x + h)^2` equal to `x^2 + h^2`?", "Try `x = h = 1`.", "4 ≠ 2: the `2xh` term is missing."] },
          { id:"e2", goal:3, task:"Find `f′(x)` from first principles for `f(x) = 2x^2 - 5x`.",
            steps:["`f(x + h) = 2x^2 + 4xh + 2h^2 - 5x - 5h`.", "`f(x + h) - f(x) = 2x^2 + 4xh + 2h^2 - 5x - 5h - 2x^2 - 5x`.", "`= 4xh + 2h^2 - 10x - 5h`.", "Divide by `h` and let `h → 0`: `4x - 5 - {10x}/{h}`…"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 collects step 2’s terms correctly.", "Step 4 gets stuck because of step 2."],
            fixes:[
              { t:"Subtracting `2x^2 - 5x` changes both signs: `-2x^2 + 5x`. The difference is `4xh + 2h^2 - 5h`, so `f′(x) = 4x - 5`.", ok:true, why:M4 },
              { t:"Step 1 should be `2x^2 + 2h^2 - 5x - 5h`.", why:"Step 1 is correct: `2(x + h)^2 = 2x^2 + 4xh + 2h^2`. " + M1 },
              { t:"Divide by `h` before subtracting.", why:"Subtract `f(x)` first so every term on top has a factor of `h`." },
              { t:"Step 2 is correct.", why:"`-(2x^2 - 5x)` is `-2x^2 + 5x`, not `-2x^2 - 5x`. Bracket `f(x)` before subtracting." }],
            hints:["Bracket `f(x)`: `-(2x^2 - 5x)`.", "That’s `-2x^2 + 5x`.", "Then `-5x + 5x` cancels, leaving `4xh + 2h^2 - 5h`."] },
          { id:"e3", goal:3, task:"Find the slope of `y = x^3` at `x = 1` by simplifying first.",
            steps:["`{(1 + h)^3 - 1}/{h}`.", "`{1 + 3h + 3h^2 + h^3 - 1}/{h} = {3h + 3h^2 + h^3}/{h}`.", "`= 3 + 3h^2 + h^3`.", "Let `h → 0`: the slope is 3."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "The final number happens to be right, but step 3 isn’t."],
            fixes:[
              { t:"Every term loses one factor of `h`: `3 + 3h + h^2`. (Check `h = 0.1`: `{(1.1)^3 - 1}/{0.1} = 3.31`, not 3.031.)", ok:true, why:"Divide <strong>every</strong> term by `h`: `{3h + 3h^2 + h^3}/{h} = 3 + 3h + h^2`." },
              { t:"Step 3 is correct, since the answer 3 is right.", why:"A right answer can come from wrong working; step 3 gives the wrong value for almost every `h`, such as `h = 0.1`." },
              { t:"Step 2 should be `{1 + h^3 - 1}/{h}`.", why:"That cubes each term. `(1 + h)^3 = 1 + 3h + 3h^2 + h^3`, so step 2 is right." },
              { t:"Step 3 should be `3h + 3h^2 + h^3`.", why:"That forgets to divide." }],
            hints:["Divide each term of `3h + 3h^2 + h^3` by `h`.", "`{3h^2}/{h} = 3h`.", "`3 + 3h + h^2 → 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the engine: how fast the table settled, or that putting `h = 0` in first gives 0/0?" },
      { id:"j2", q:"In your own words, what do the numerator, the denominator and the limit each do in the first-principles definition?" },
      { id:"j3", q:"Explain to a friend how to handle `{1}/{x}` or `√x` by first principles: what extra step does each need?" },
      { id:"j4", q:"Which step do you still slip on (expanding, the minus sign, or cancelling)? What will you check next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which expression is `f′(x)` from first principles?", options:[
          { t:LIM("h → 0") + " " + DQ, ok:true, why:"The fraction is the secant slope over a run of `h`; the limit turns it into the tangent slope." },
          { t:LIM("h → 0") + " `[f(x + h) - f(x)]`", why:"Without ÷ `h` this is a change in height, which goes to 0." },
          { t:LIM("h → 0") + " `{f(x) + h - f(x)}/{h}`", why:"That uses `f(x) + h` for `f(x + h)`. That’s always 1." },
          { t:DQ + " with `h = 0`", why:"That’s 0/0. " + M2 }] },
        b:{ prompt:"Which expression gives the slope of the tangent to `y = f(x)` at `x = 3`?", options:[
          { t:LIM("h → 0") + " `{f(3 + h) - f(3)}/{h}`", ok:true, why:"The secant slope from `x = 3` to `x = 3 + h`, as `h → 0`." },
          { t:"`{f(3)}/{3}`", why:"That’s not a slope." },
          { t:LIM("h → 0") + " `{f(3 + h) - f(3)}/{3}`", why:"Divide by the run, `h`." },
          { t:"`{f(3 + h) - f(3)}/{h}` with `h = 0`", why:"That’s 0/0. " + M2 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f(x) = 2x^2 + x`. Simplify `f(x + h) - f(x)`.", options:[
          { t:"`4xh + 2h^2 + h`", ok:true, why:"`2(x + h)^2 + (x + h) - 2x^2 - x = 4xh + 2h^2 + h`." },
          { t:"`2h^2 + h`", why:"That squares each term. " + M1 },
          { t:"`4xh + 2h^2`", why:"The `x` term gives `+h` too." },
          { t:"`2xh + 2h^2 + h`", why:"`2(x + h)^2 = 2x^2 + 4xh + 2h^2`." }] },
        b:{ prompt:"`f(x) = 3x^2 - 2x`. Simplify `f(x + h) - f(x)`.", options:[
          { t:"`6xh + 3h^2 - 2h`", ok:true, why:"`3(x + h)^2 - 2(x + h) - 3x^2 + 2x = 6xh + 3h^2 - 2h`." },
          { t:"`3h^2 - 2h`", why:"That squares each term. Replace every `x` with `(x + h)`, then expand: `3(x + h)^2 = 3x^2 + 6xh + 3h^2`." },
          { t:"`6xh + 3h^2`", why:"The `-2x` term gives `-2h` too." },
          { t:"`3xh + 3h^2 - 2h`", why:"`3(x + h)^2 = 3x^2 + 6xh + 3h^2`." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"At which `x` is `f(x) = |x + 1|` not differentiable?", options:[
          { t:"`x = -1`", ok:true, why:"The corner: slopes −1 on the left, 1 on the right." },
          { t:"`x = 1`", why:"`|x + 1| = 0` when `x = -1`." },
          { t:"`x = 0`", why:"There’s nothing special at 0." },
          { t:"It’s differentiable everywhere, because it’s continuous.", why:M6 }] },
        b:{ prompt:"At which `x` is `f(x) = |2x - 6|` not differentiable?", options:[
          { t:"`x = 3`", ok:true, why:"The corner is where `2x - 6 = 0`: slopes −2 on the left, 2 on the right." },
          { t:"`x = 6`", why:"`|2x - 6| = 0` when `x = 3`, not 6." },
          { t:"`x = -3`", why:"Check the sign: `2x - 6 = 0` when `x = 3`." },
          { t:"It’s differentiable everywhere, because it’s continuous.", why:M6 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Use first principles: `f(x) = x^2 - 4x + 1`. What is `f′(x)`?", options:[
          { t:"`2x - 4`", ok:true, why:"Difference `2xh + h^2 - 4h`; ÷ `h`: `2x + h - 4 → 2x - 4`." },
          { t:"`2x + h - 4`", why:"That’s the quotient before the limit." },
          { t:"−4", why:"`(x + h)^2 ≠ x^2 + h^2`." },
          { t:"0", why:"Substituting `h = 0` first gives 0/0, not 0." }] },
        b:{ prompt:"Use first principles: `f(x) = x^2 + 6x - 2`. What is `f′(x)`?", options:[
          { t:"`2x + 6`", ok:true, why:"Difference `2xh + h^2 + 6h`; ÷ `h`: `2x + h + 6 → 2x + 6`." },
          { t:"`2x + h + 6`", why:"That’s the quotient before the limit: let `h → 0`." },
          { t:"6", why:"`(x + h)^2 ≠ x^2 + h^2`: the `2xh` term gives the `2x`." },
          { t:"0", why:"Substituting `h = 0` first gives 0/0, not 0." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"First principles for `f(x) = {1}/{x + 1}`. Which is the correctly simplified difference quotient, just before the limit?", options:[
          { t:"`{-1}/{(x + h + 1)(x + 1)}`", ok:true, why:"Top: `(x + 1) - (x + h + 1) = -h`; then ÷ `h`." },
          { t:"`{1}/{h}`", why:"Use a common denominator: `{(x + 1) - (x + h + 1)}/{(x + h + 1)(x + 1)}`." },
          { t:"`{-h}/{(x + h + 1)(x + 1)}`", why:"You still need to divide by `h`." },
          { t:"`{1}/{(x + h + 1)(x + 1)}`", why:"Sign: the top is `-h`." }] },
        b:{ prompt:"First principles for `f(x) = {2}/{x}`. Which is the correctly simplified difference quotient, just before the limit?", options:[
          { t:"`{-2}/{x(x + h)}`", ok:true, why:"Top: `2x - 2(x + h) = -2h`; then ÷ `h`." },
          { t:"`{2}/{h}`", why:"Use a common denominator: `{2x - 2(x + h)}/{x(x + h)}`." },
          { t:"`{-2h}/{x(x + h)}`", why:"You still need to divide by `h`." },
          { t:"`{2}/{x(x + h)}`", why:"Sign: the top is `-2h`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`f(x) = x^2 + 2x`. Using `f′(x)` from first principles, find the tangent at `x = 1`.", options:[
          { t:"`y = 4x - 1`", ok:true, why:"`f′(x) = 2x + 2`, so the slope is 4; `f(1) = 3`; `y - 3 = 4(x - 1)`." },
          { t:"`y = 3x`", why:"That uses `f(1) = 3` as the slope, but 3 is the height, not the slope." },
          { t:"`y = 4x + 3`", why:"3 is the `y`-coordinate of the point, not the intercept." },
          { t:"`y = 2x + 1`", why:"That uses `f′ = 2` from `(x + h)^2 = x^2 + h^2`." }] },
        b:{ prompt:"`f(x) = x^2 - 3x`. Find the tangent at `x = 2`.", options:[
          { t:"`y = x - 4`", ok:true, why:"`f′(2) = 1`; `f(2) = -2`." },
          { t:"`y = -2x + 2`", why:"That uses `f(2) = -2` as the slope. " + M5 },
          { t:"`y = x - 2`", why:"The point is (2, −2): `-2 = 1(2) + b` gives `b = -4`." },
          { t:"`y = -3x + 4`", why:"That uses `f′ = -3` from `(x + h)^2 = x^2 + h^2`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"A student writes: “For `f(x) = x^2` at `x = 2`, `{f(2 + h) - f(2)}/{h}` is 0/0 at `h = 0`, so `f` has no slope at `x = 2`.” Which response is best?", options:[
          { t:"“0/0 only means simplify first: `{4 + 4h + h^2 - 4}/{h} = 4 + h` for `h ≠ 0`, which approaches 4.”", ok:true, why:M2 },
          { t:"“Correct: 0/0 is undefined, so there’s no slope.”", why:"0/0 is a signal to simplify, not an answer. The slope is 4." },
          { t:"“The slope is 0, because the top is 0.”", why:"The bottom is 0 too. Simplify first: the slope is 4." },
          { t:"“Use `h = 1` instead: the slope is 5.”", why:"That’s a secant slope." }] },
        b:{ prompt:"A student writes: “For `f(x) = x^3` at `x = 1`, `{f(1 + h) - f(1)}/{h}` gives 0/0, so the derivative doesn’t exist.” Which response is best?", options:[
          { t:"“0/0 means simplify first: `{3h + 3h^2 + h^3}/{h} = 3 + 3h + h^2`, which approaches 3.”", ok:true, why:M2 },
          { t:"“Correct: 0/0 is undefined.”", why:"0/0 is a signal to simplify, not an answer. The derivative is 3." },
          { t:"“The derivative is 0, because the top is 0.”", why:"The bottom is 0 too. Simplify first: the derivative is 3." },
          { t:"“Use `h = 1` instead: the slope is 7.”", why:"That’s a secant slope over a run of 1, not the tangent slope." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which statement about `f(x) = |x - 2|` at `x = 2` is true?", options:[
          { t:"“It’s continuous but not differentiable: the difference quotient approaches −1 from the left and 1 from the right.”", ok:true, why:M6 },
          { t:"“It’s differentiable, because it’s continuous.”", why:M6 },
          { t:"“It isn’t continuous, so it isn’t differentiable.”", why:"It is continuous: no break." },
          { t:"“`f′(2) = 0`, because it’s a minimum.”", why:"Only smooth minimums have horizontal tangents." }] },
        b:{ prompt:"Which statement about `f(x) = ∛x` at `x = 0` is true?", options:[
          { t:"“It’s continuous but not differentiable: the tangent is vertical, so the difference quotient grows without bound.”", ok:true, why:"`{∛h}/{h}` grows without bound as `h → 0`: the slopes blow up." },
          { t:"“It’s differentiable, because it’s continuous.”", why:"Continuous isn’t enough: at a vertical tangent the difference quotient grows without bound, so there’s no derivative." },
          { t:"“It isn’t continuous at 0.”", why:"It is continuous: `∛x` has no break, and `∛0 = 0`." },
          { t:"“`f′(0) = 0`, because `∛0 = 0`.”", why:"`∛0 = 0` is the height, not the slope. " + M5 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A stone dropped from a bridge has fallen `d(t) = 5t^2` metres after `t` seconds. Use first principles to find its velocity at `t` = 3 s.", options:[
          { t:"30 m/s", ok:true, why:"`d′(t) = 10t`, and `10(3) = 30`." },
          { t:"45 m/s", why:"45 m is the distance fallen, `d(3)`." },
          { t:"15 m/s", why:"That’s the average velocity over the first 3 s." },
          { t:"10 m/s", why:"Evaluate `d′(t) = 10t` at `t = 3`." }] },
        b:{ prompt:"A cyclist has travelled `s(t) = t^2 + 4t` metres after `t` seconds. Velocity at `t` = 5 s?", options:[
          { t:"14 m/s", ok:true, why:"`s′(t) = 2t + 4`, and `2(5) + 4 = 14`." },
          { t:"45 m/s", why:"45 m is the distance travelled, `s(5)`. The velocity is `s′(5)`." },
          { t:"9 m/s", why:"That’s the average velocity over the first 5 s." },
          { t:"4 m/s", why:"That drops the `2t`: `(t + h)^2 = t^2 + 2th + h^2`, not `t^2 + h^2`." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"The cost per item of a batch is `C(n) = {60}/{n}` dollars when `n` items are made. Using first principles, how fast is `C` changing when `n = 10`?", options:[
          { t:"−0.6 dollars per item", ok:true, why:"`C′(n) = -{60}/{n^2}`; at 10: `-{60}/{100}`." },
          { t:"−6 dollars per item", why:"That’s `-{60}/{n}`; the derivative has `n^2`." },
          { t:"6 dollars per item", why:"That’s `C(10)`." },
          { t:"0.6 dollars per item", why:"The cost per item is falling: negative." }] },
        b:{ prompt:"A light’s intensity is `I(d) = {100}/{d}` units at distance `d` m. Using first principles, how fast is `I` changing at `d = 5`?", options:[
          { t:"−4 units per metre", ok:true, why:"`I′(d) = -{100}/{d^2}`; at 5: `-{100}/{25} = -4`." },
          { t:"−20 units per metre", why:"That’s `-{100}/{d}`; the derivative has `d^2`." },
          { t:"20 units per metre", why:"That’s `I(5)`, the intensity itself, not its rate of change." },
          { t:"4 units per metre", why:"The intensity is falling as you move away: negative." }] } }
    ]
  },
  task:{
    title:"Hilltop at `x = 2`", summary:"Hilltop at x = 2",
    statement:"<p>Design a quadratic `f(x) = ax^2 + bx + c` that meets every condition. By first principles, `f′(x) = 2ax + b`. Find all the answers.</p>" +
      "<ol class=\"fp-conds\"><li>The tangent at `x = 2` is horizontal.</li><li>The tangent at `x = 0` has a positive slope.</li><li>The point where the tangent is horizontal lies above the `x`-axis.</li><li>The `y`-intercept is negative.</li></ol>" +
      "<p class=\"tiny muted\">Choose whole numbers from −6 to 6 for `a`, `b` and `c`, with `a ≠ 0`.</p>",
    checks:["Horizontal tangent at `x = 2`", "Positive slope at `x = 0`", "Horizontal-tangent point above the axis", "`y`-intercept negative"],
    tips:["Set `f′(2) = 2a(2) + b = 0`.", "`f′(0) = b`.", "With `b = -4a`, the point is `(2, 4a + 2b + c) = (2, c - 4a)`.", "The `y`-intercept is `c`."],
    explainPrompt:"Explain how first principles gave you `f′(x) = 2ax + b`, and how you used it to choose `a` and `b`.",
    vocab:"Use the words derivative, tangent, slope and limit.",
    after3:"Line 1 gives `b = -4a`; line 2 makes `a` negative; with `b ≤ 6`, `a = -1`. Then lines 3 and 4 need `-4 < c < 0`."
  },
  cards:[
    ["First principles", "`f′(x) =` " + LIM("h → 0") + " " + DQ + "."],
    ["The fraction", "The slope of the secant over a run of `h`."],
    ["0/0", "A signal to simplify. Cancel `h`, then take the limit."],
    ["`f(x + h)`", "Replace every `x` with `(x + h)`. Not `f(x) + h`."],
    ["`(x + h)^2`", "`x^2 + 2xh + h^2`."],
    ["Subtracting `f(x)`", "Bracket it: `-(2x^2 - 5x) = -2x^2 + 5x`."],
    ["Rational `f`", "Common denominator first: e.g. `{1}/{x}` → `-{1}/{x^2}`."],
    ["Radical `f`", "Multiply by the conjugate: `√x` → `{1}/{2√x}`."],
    ["Tangent at `x = a`", "`y - f(a) = f′(a)(x - a)`."],
    ["Pattern", "`x` → 1, `x^2` → `2x`, `x^3` → `3x^2`, `x^4` → `4x^3`: `nx^{n - 1}`."],
    ["No derivative", "Corner, cusp, vertical tangent, or discontinuity."],
    ["Continuous ≠ differentiable", "`|x|` is continuous at 0 but has no derivative there."]
  ]
};
