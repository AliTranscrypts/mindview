// MCV4U 09 Derivatives of Polynomials. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/09-derivatives-of-polynomials.md
// d/dx with an upright d (course plan §2: d/dx[…] means "the derivative of"); screen readers hear "d/dx".
const DD = v => '<span class="m"><span class="frac"><span class="fn"><span class="fnm">d</span></span><span class="fd"><span class="fnm">d</span><i>' + v + "</i></span></span></span>";
const DDX = DD("x"), DDT = DD("t");
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "Two moves: the exponent comes down as a factor <strong>and</strong> drops by 1.";
const M2 = "A constant’s graph is horizontal: slope 0.";
const M3 = "Subtract 1 from the exponent: −2 − 1 = −3, and 1/2 − 1 = −1/2.";
const M4 = "Rewrite as a power first: `{1}/{x^3} = x^{-3}`.";
const M5 = "The point is `(a, f(a))`; the slope is `f′(a)`.";
const M6 = "Perpendicular slopes multiply to −1: the normal’s slope is `-1/m`.";
const M7 = "A quadratic `f′` can give two `x`-values. Check both.";
// "See the proof" (plan §6.2): limit proofs as a reading only. LIM marks are replaced with MV.mcv.lim() by app.js.
const LIM = '<span class="rc-lim" data-sub="h -> 0">lim (h → 0)</span>';
const PROOF = '<details class="alg rc-proof"><summary>See the proof</summary>' +
  "<p>Each rule follows from first principles, `f′(x) = ` " + LIM + " `{f(x + h) - f(x)}/{h}`.</p>" +
  "<p><strong>Constant rule.</strong> If `f(x) = c`, then `f(x + h) - f(x) = c - c = 0`, so every difference quotient is `{0}/{h} = 0` and the limit is 0.</p>" +
  "<p><strong>Constant multiple rule.</strong> `{kf(x + h) - kf(x)}/{h} = k · {f(x + h) - f(x)}/{h}`. The factor `k` doesn’t depend on `h`, so the limit is `k · f′(x)`.</p>" +
  "<p><strong>Sum and difference rules.</strong> `{[f(x + h) ± g(x + h)] - [f(x) ± g(x)]}/{h} = {f(x + h) - f(x)}/{h} ± {g(x + h) - g(x)}/{h}`. Each quotient has its own limit, so the limit is `f′(x) ± g′(x)`.</p>" +
  "<p><strong>Power rule for natural `n`.</strong> Expanding gives `(x + h)^n = x^n + nx^{n-1}h +` (terms with `h^2` or higher powers of `h`). Subtract `x^n` and divide by `h`: `nx^{n-1} +` (terms with `h`). As " + LIM + ", that’s `nx^{n-1}`. Module 08 did this for `n` = 1, 2, 3, 4; the tangent slopes in the rule checker confirm it for negative and fractional `n`.</p></details>";

export default {
  id:"09-derivatives-of-polynomials",
  kind:"topic",
  title:"Derivatives of polynomials",
  topic:"Derivatives of Polynomials",
  readyTopic:"derivatives of polynomials",
  hero:{
    eq:DDX + "`(x^n) = nx^{n-1}`",
    eqLabel:"d by d x of x to the n equals n times x to the n minus 1",
    eqSize:"md",
    headline:"One rule, every power",
    text:"Bring the exponent down, then lower it by one: that’s the <strong>power rule</strong>. Add the <strong>constant rule</strong> (constants have slope 0), the <strong>constant multiple rule</strong> and the <strong>sum rule</strong>, and you can differentiate any polynomial in one line. Rewrite roots and reciprocals as powers, and the rule still works.",
    fig:{ html:'<div class="rc-hero"><div class="rc-hx" id="rc-hx" aria-hidden="true"></div>' +
      '<canvas class="plot dp-top" id="hero-plot" role="img" aria-label="Top panel: y = x cubed with a tangent line."></canvas>' +
      '<canvas class="plot dp-low" id="hero-d" role="img" aria-label="Bottom panel: the slopes of the tangent, plotted against x."></canvas></div>' }
  },
  goals:[
    "I can apply the power rule " + DDX + "`(x^n) = nx^{n-1}` and check it against tangent slopes.",
    "I can use the constant, constant multiple, sum and difference rules, and explain why each works.",
    "I can rewrite radicals and reciprocals as powers and differentiate them.",
    "I can find the slope and the equation of the tangent (and normal) at a point.",
    "I can find the points where the tangent has a given slope, including horizontal tangents.",
    "I can interpret a derivative as a rate of change in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent laws", goal:1, prompt:"Simplify `x^5 ÷ x^2`.",
          options:[
            { t:"`x^3`", ok:true, why:"Subtract exponents." },
            { t:"`x^{5/2}`", why:"That divides the exponents. Dividing powers subtracts exponents." },
            { t:"`x^7`", why:"That adds the exponents. That’s multiplication." },
            { t:"`x^{10}`", why:"That multiplies the exponents. That’s a power of a power." }],
          hints:["`x^a ÷ x^b = x^{a - b}`.", "5 − 2.", "`x^3`."] },
        { id:"w2", skill:"Exponent laws", goal:3, prompt:"Write `{1}/{x^4}` as a power of `x`.",
          options:[
            { t:"`x^{-4}`", ok:true, why:"A reciprocal flips the sign of the exponent." },
            { t:"`x^4`", why:"That ignores the reciprocal. A reciprocal flips the sign of the exponent." },
            { t:"`-x^4`", why:"That puts the negative on the coefficient. `-x^4` is negative for every `x ≠ 0`; `{1}/{x^4}` is positive." },
            { t:"`x^{1/4}`", why:"That confuses a reciprocal with a root: `x^{1/4}` is the fourth root of `x`." }],
          hints:["`{1}/{x^n} = x^{-n}`.", "`n = 4`.", "`x^{-4}`."] },
        { id:"w3", skill:"Powers from radicals", goal:3, prompt:"Write `√{x^3}` as a power of `x`.",
          options:[
            { t:"`x^{3/2}`", ok:true, why:"The square root is the power 1/2: `(x^3)^{1/2}`." },
            { t:"`x^{2/3}`", why:"That flips the fraction. The root’s index goes in the denominator." },
            { t:"`x^{5/2}`", why:"That adds 3 and 1/2. A power of a power multiplies." },
            { t:"`3x^{1/2}`", why:"That brings the 3 down. That’s not a derivative step." }],
          hints:["`√u = u^{1/2}`.", "`(x^3)^{1/2}`.", "`x^{3/2}`."] },
        { id:"w4", skill:"Powers from radicals", goal:3, prompt:"Write `{6}/{√x}` in the form `ax^n`.",
          options:[
            { t:"`6x^{-1/2}`", ok:true, why:"`{1}/{√x} = x^{-1/2}`." },
            { t:"`6x^{1/2}`", why:"That ignores the reciprocal. Dividing by `x^{1/2}` makes the exponent negative." },
            { t:"`6x^{-2}`", why:"√ doesn’t mean squared. The square root is the power 1/2." },
            { t:"`x^{-1/12}`", why:"That moves the 6 into the exponent. The 6 stays in front as the coefficient." }],
          hints:["`√x = x^{1/2}`.", "Dividing by it gives `x^{-1/2}`.", "`6x^{-1/2}`."] },
        { id:"w5", skill:"Slopes and lines", goal:1, prompt:"From module 08, what is the derivative of `x^2`?",
          options:[
            { t:"`2x`", ok:true, why:"First principles give `{2xh + h^2}/{h} = 2x + h`, which approaches `2x` as `h → 0`." },
            { t:"`x`", why:"That lowers the exponent only. " + M1 },
            { t:"`2x^2`", why:"That multiplies only. " + M1 },
            { t:"2", why:"That’s the second derivative, from module 14." }],
          hints:["First principles: `{2xh + h^2}/{h}`.", "`2x + h → ?`", "`2x`."] },
        { id:"w6", skill:"Slopes and lines", goal:4, prompt:"Find the equation of the line through (2, 5) with slope 3.",
          options:[
            { t:"`y = 3x - 1`", ok:true, why:"`y - 5 = 3(x - 2)`." },
            { t:"`y = 3x + 5`", why:"That uses the `y`-coordinate as the intercept. 5 is the height at `x = 2`, not at `x = 0`." },
            { t:"`y = 3x + 11`", why:"Sign slip: that’s `y - 5 = 3(x + 2)`. Use `x - 2`." },
            { t:"`y = 5x - 7`", why:"That swaps the slope and the `y`-value: the slope is 3 and the point is (2, 5)." }],
          hints:["Point–slope form: `y - y_1 = m(x - x_1)`.", "`y - 5 = 3(x - 2)`.", "`y = 3x - 1`."] }
      ],
      refreshers:{
        "Exponent laws":"`x^a · x^b = x^{a + b}`; `x^a ÷ x^b = x^{a - b}`; `{1}/{x^n} = x^{-n}`.",
        "Powers from radicals":"`√x = x^{1/2}`; `∛x = x^{1/3}`; `√{x^3} = x^{3/2}`; `{1}/{√x} = x^{-1/2}`.",
        "Slopes and lines":"The line through `(x_1, y_1)` with slope `m` is `y - y_1 = m(x - x_1)`. Perpendicular slopes multiply to −1."
      }
    }
  },
  explore:{
    heading:"Rule checker",
    intro:"Three experiments. Stretch a graph and watch its slopes. Add two graphs and watch their slopes add. Then test the power rule on any power, even fractions.",
    modes:[{ id:"mul", t:"Multiply" }, { id:"add", t:"Add" }, { id:"pow", t:"Any power" }],
    subs:[{ id:"pair", t:"Pair" }, { id:"build", t:"Build" }],
    modeHow:{
      mul:"`g(x) = @a{k} · f(x)`. Choose `f`, then stretch it with `@a{k}`: the violet `@a{k}` does the job of a vertical stretch. Compare the two tangent slopes.",
      add:"Choose `f` and `g`. The top panel shows `f + g` in black; at the probe, the bar shows `f′(x)` and `g′(x)` adding to `(f + g)′(x)`.",
      build:"Build a sum: tap chips to add them (each one once), tap again to remove. The readout differentiates the sum term by term.",
      pow:"`y = @a{k}x^{@n{n}}`. Set the exponent `@n{n}` (blue) and the stretch `@a{k}` (violet). For a fractional `@n{n}`, the graph is drawn for `x > 0` only."
    },
    bases:[{ id:"x2", t:"`x^2`" }, { id:"x3", t:"`x^3`" }, { id:"sqrt", t:"`√x`" }],
    addChips:[{ id:"x", t:"`x`" }, { id:"x2", t:"`x^2`" }, { id:"x3", t:"`x^3`" }, { id:"m2x2", t:"`-2x^2`" }, { id:"c4", t:"4" }, { id:"sqrt", t:"`√x`" }],
    buildChips:[{ id:"x3", t:"`x^3`" }, { id:"x2", t:"`x^2`" }, { id:"mx2", t:"`-x^2`" }, { id:"m2x", t:"`-2x`" }, { id:"m3x", t:"`-3x`" }, { id:"c5", t:"5" }, { id:"sqrt", t:"`√x`" }],
    predIntro:"Make a prediction first. Then the rule checker sets itself up and shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Multiply mode, `f(x) = x^2`, `@a{k} = 3`, probe at `x = 2`. The slope of `x^2` at `x = 2` is 4. What is the slope of `g(x) = 3x^2` there?",
        options:[{ t:"12", ok:true }, { t:"4" }, { t:"7" }, { t:"36" }],
        explain:"The tangents on both curves have slopes 4 and 12, and the readout says `g′(x) ÷ f′(x) = 3`. A vertical stretch by 3 makes every rise 3 times bigger, so every slope triples." },
      { id:"p2", prompt:"Add mode, `f(x) = x^2`, `g(x) = 4`. `f + g = x^2 + 4`. How does its derivative compare with that of `x^2`?",
        options:[{ t:"They’re the same", ok:true }, { t:"It’s 4 more" }, { t:"It’s 4 times as large" }, { t:"It’s 1 more" }],
        explain:"The bar has no `g′` segment, and the two tangents stay parallel. Adding 4 lifts the graph without tilting it; the derivative of a constant is 0." },
      { id:"p3", prompt:"Any power, `@n{n} = -1`, `x = 2`. What does the power rule predict for the slope of `y = x^{-1}` at `x = 2`?",
        options:[{ t:"−1/4", ok:true }, { t:"−1" }, { t:"1/4" }, { t:"−1/2" }],
        explain:"The measured slope is −0.2500. `(-1)x^{-2} = -{1}/{x^2}`, so −1/4. The exponent goes from −1 to −2, not to 0." },
      { id:"p4", prompt:"Any power, `@n{n} = 1/2`, `x = 4`. Predict the slope of `y = √x` at `x = 4`.",
        options:[{ t:"1/4", ok:true }, { t:"2" }, { t:"1/2" }, { t:"1/16" }],
        explain:"The measured slope is 0.2500. `{1}/{2}x^{-1/2} = {1}/{2√x} = {1}/{4}`. 2 is the height `√4`; 1/16 comes from lowering the exponent to −3/2." }
    ],
    chalIntro:"Use the rule checker to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Any power, `@a{k} = 1`: choose `@n{n}` so that the tangent to `y = x^n` at `x = 4` has slope 48.",
        why:"`n = 3`: the slope is `3 · 4^2 = 48`.",
        hints:["The slope is `n · 4^{n-1}`.", "Try whole numbers: 2 · 4 = 8, 3 · 16 = …", "3 · 16 = 48."],
        msgs:{ mode:"Switch to <strong>Any power</strong> mode first.", k:"Set `@a{k} = 1` first: the challenge is about `y = x^n`.",
          n2:"Slope 2(4) = 8.", n4:"Slope 4(64) = 256.", n35:"Slope 3.5(32) = 112.", other:"At `x = 4` the slope is {s}. You need 48." } },
      { id:"tc2", goal:2, prompt:"Add, Build sub-mode: choose chips so that the sum has slope 0 at `x = 1` and slope 9 at `x = 2`.",
        why:"`x^3 - 3x` has slope `3x^2 - 3`: 0 at `x = 1` and 9 at `x = 2`. Adding 5 doesn’t change any slope.",
        hints:["Find each chip’s derivative: `x^3 → 3x^2`, `-3x → -3`, and so on.", "You need `f′(1) = 0` and `f′(2) = 9`. Which chip gives 12 at `x = 2`?", "`3x^2 - 3`: 0 at 1 and 9 at 2."],
        msgs:{ mode:"Switch to <strong>Add</strong> mode, then <strong>Build</strong>.", empty:"Tap chips to build a sum.",
          x2m2x:"Slope 0 at `x = 1` ✓, but only 2 at `x = 2`.", x3m2x:"Slope 1 at `x = 1`.",
          sqrt:"`√x` gives slope `{1}/{2√2}` at 2, which isn’t a whole number.", other:"Slope {a} at `x = 1` and {b} at `x = 2`. You need 0 and 9." } },
      { id:"tc3", goal:[1, 2], stretch:true, prompt:"Any power: set `@a{k}` and `@n{n}` so that `y = @a{k}x^{@n{n}}` passes through (4, 16) <strong>and</strong> has slope 6 there.",
        why:"`k = 2`, `n = 3/2`: `2 · 4^{3/2} = 16`, and the slope is `2({3}/{2})(4)^{1/2} = 6`.",
        hints:["Two conditions: `k · 4^n = 16` and `kn · 4^{n-1} = 6`.", "Divide the second by the first: `{n}/{4} = {6}/{16}`, so `n = 3/2`.", "`k · 4^{3/2} = 8k = 16`, so `k = 2`. Check: `2({3}/{2})(4)^{1/2} = 6`."],
        msgs:{ mode:"Switch to <strong>Any power</strong> mode first.", k1n2:"Through (4, 16), but the slope is 8.", k4n1:"Through (4, 16), but the slope is 4.",
          k2:"`y(4) = 2 · 4^n` must equal 16.", through:"Through (4, 16), but the slope is {s}.", miss:"`y(4)` = {y}, not 16: the curve must pass through (4, 16)." } }
    ],
    blocks:[{ title:"Why the rules work", html:"<p>Each rule has a picture: a horizontal line has slope 0; a vertical stretch by `@a{k}` multiplies every rise, so every slope; adding two graphs adds their rises, so their slopes. The proofs from first principles say the same thing with limits.</p>" + PROOF }]
  },
  part3:{
    slug:"given-slope", name:"Given a slope",
    heading:"Given a slope, find the point",
    intro:"Explore asked “what is the slope here?”. Now turn the question around: set a slope, and find the points where the tangent has it. Then add normal lines. Then try the quick check.",
    stations:[
      { id:"st1", title:"Station 1: Slope dial",
        text:"`f(x) = x^3 - 6x^2 + 9x + 1`, so `f′(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)`. Turn the dial to set a slope `m` from −6 to 12. Every point whose tangent has slope `m` lights up, with its tangent drawn. Enter the points, then check them with algebra.",
        msgs:{ "9":"(0, 1) and (4, 5): a pair of parallel tangents.", "0":"(1, 5) and (3, 1): the two horizontal tangents.", "-3":"One point, (2, 3): the least slope.",
          none:"The slope is never below −3: the vertex of `f′` is at (2, −3).", good:"Every point with slope `m` is there.", missing:M7, swap:M5,
          other:"Solve `3x^2 - 12x + 9 = m`, then find `f(x)` for each solution.", extra:"Only {n} point{s} {have} this slope.", partial:"Fill in both coordinates of each point, or leave a point empty.", empty:"Enter a point, or press <strong>No point has this slope</strong>." } },
      { id:"st2", title:"Station 2: Tangent and normal",
        text:"Tap a point on `y = x^2 - 4x` (or drag it, or use the slider). The tangent is solid; the <strong>normal</strong>, the line perpendicular to the tangent at the point, is dashed, with a right-angle mark." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Given a slope quick check",
      items:[
        { id:"q1", goal:5, prompt:"On the dial curve, how many points have slope 0?",
          choices:[
            { t:"2", ok:true, fb:"Right. `3(x - 1)(x - 3) = 0` at `x = 1` and 3." },
            { t:"1", fb:"`3(x - 1)(x - 3) = 0` at `x = 1` and 3." },
            { t:"3", fb:"`3(x - 1)(x - 3) = 0` at `x = 1` and 3." },
            { t:"0", fb:"`3(x - 1)(x - 3) = 0` at `x = 1` and 3." }] },
        { id:"q2", goal:5, prompt:"How many points have slope −5?",
          choices:[
            { t:"None", ok:true, fb:"Right. The least slope is −3." },
            { t:"1", fb:"The least slope is −3." },
            { t:"2", fb:"The least slope is −3." },
            { t:"3", fb:"The least slope is −3." }] },
        { id:"q3", goal:4, prompt:"The tangent at a point has slope 3. The normal’s slope is…",
          choices:[
            { t:"−1/3", ok:true, fb:"Right. Negative reciprocal: 3 × (−1/3) = −1." },
            { t:"−3", fb:"Negative reciprocal: 3 × (−1/3) = −1." },
            { t:"1/3", fb:"Negative reciprocal: 3 × (−1/3) = −1." },
            { t:"3", fb:"Negative reciprocal: 3 × (−1/3) = −1." }] },
        { id:"q4", goal:5, prompt:"Where is the tangent to `y = x^2 + 1` parallel to `y = 6x`?",
          choices:[
            { t:"`x = 3`", ok:true, fb:"Right. Parallel means slope 6: `2x = 6`." },
            { t:"`x = 6`", fb:"Parallel means slope 6: `2x = 6`. `√5` solves `y = 6`, not `y′ = 6`." },
            { t:"`x = 36`", fb:"Parallel means slope 6: `2x = 6`. `√5` solves `y = 6`, not `y′ = 6`." },
            { t:"`x = √5`", fb:"Parallel means slope 6: `2x = 6`. `√5` solves `y = 6`, not `y′ = 6`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"diff", type:"custom", title:"Differentiate it", summary:"Differentiate it", goal:[1, 2, 3],
        instruction:"Find `f′(x)` for each function. Rewrite roots, reciprocals, products and quotients as powers of `x` first.",
        how:"Type the coefficient and the exponent of each term of `f′(x)` (whole numbers or fractions such as −1/2), and its constant in the last box. Leave a box empty if you don’t need it; an empty exponent means 1.",
        general:{ m2:M2, m1:M1, other:"Rewrite each term as a power of `x`, then use the power rule on each term: bring the exponent down and lower it by 1." },
        items:[
          { id:"d1", fx:"`4x^5 - 3x^2 + 7`", display:"`20x^4 - 6x`", answer:[["20", "4"], ["-6", "1"]], goal:[1, 2],
            wrong:[{ has:["7", "0"], fb:"The +7 is still there. " + M2 }, { has:["4", "4"], fb:M1 }],
            why:"Term by term: `4(5)x^4 - 3(2)x + 0`.",
            hints:["Differentiate term by term.", "`4(5)x^{5-1} - 3(2)x^{2-1} + 0`.", "`20x^4 - 6x`."] },
          { id:"d2", fx:"`{x^4}/{2} - 5x`", display:"`2x^3 - 5`", answer:[["2", "3"], ["-5", "0"]], goal:[1, 2],
            wrong:[{ has:["1/2", "3"], fb:"4 × 1/2 = 2. " + M1 }],
            why:"`{x^4}/{2} = {1}/{2}x^4`, so the first term gives `{1}/{2}(4)x^3 = 2x^3`.",
            hints:["Write `{x^4}/{2}` as `{1}/{2}x^4`.", "`{1}/{2}(4)x^3 - 5`.", "`2x^3 - 5`."] },
          { id:"d3", fx:"`6√x`", display:"`3x^{-1/2}` (= `{3}/{√x}`)", answer:[["3", "-1/2"]], goal:3,
            wrong:[{ has:["3", "1/2"], fb:M3 }],
            why:"`6x^{1/2} → 6({1}/{2})x^{-1/2} = 3x^{-1/2}`.",
            hints:["Rewrite as `6x^{1/2}`.", "`6({1}/{2})x^{1/2 - 1}`.", "`3x^{-1/2} = {3}/{√x}`."] },
          { id:"d4", fx:"`{2}/{x^3}`", display:"`-6x^{-4}` (= `-{6}/{x^4}`)", answer:[["-6", "-4"]], goal:3,
            wrong:[{ has:["2/3", "−2"], fb:M4 }, { has:["−6", "−2"], fb:M3 }],
            why:"`2x^{-3} → 2(-3)x^{-4} = -6x^{-4}`.",
            hints:["Rewrite as `2x^{-3}`.", "Bring down −3: `2(-3)x^{-3 - 1}`.", "`-6x^{-4} = -{6}/{x^4}`."] },
          { id:"d5", fx:"`(x + 3)(x - 1)`", display:"`2x + 2`", answer:[["2", "1"], ["2", "0"]], goal:2,
            wrong:[{ exact:[["1", "0"]], fb:"Expand first: `x^2 + 2x - 3`. (The product rule comes in module 10.)" }],
            why:"Expand first: `x^2 + 2x - 3`, then differentiate term by term.",
            hints:["Expand first.", "`x^2 + 2x - 3`.", "`2x + 2`."] },
          { id:"d6", fx:"`{x^2 + 4x}/{x}`, `x ≠ 0`", display:"1", answer:[["1", "0"]], goal:3,
            general:"Divide each term by `x`: `x + 4`.",
            why:"Divide each term by `x`: `x + 4`, whose derivative is 1.",
            hints:["Divide each term by `x`.", "`x + 4`.", "1."] },
          { id:"d7", fx:"`∛{x^2}`", display:"`{2}/{3}x^{-1/3}`", answer:[["2/3", "-1/3"]], goal:3,
            wrong:[{ has:["3/2", "1/2"], fb:"`∛{x^2} = x^{2/3}`." }],
            why:"`x^{2/3} → {2}/{3}x^{2/3 - 1} = {2}/{3}x^{-1/3}`.",
            hints:["`∛{x^2} = x^{2/3}`.", "`{2}/{3}x^{2/3 - 1}`.", "2/3 − 1 = −1/3."] },
          { id:"d8", fx:"`(2x - 1)^2`", display:"`8x - 4`", answer:[["8", "1"], ["-4", "0"]], goal:2,
            wrong:[{ exact:[["4", "1"], ["−2", "0"]], fb:"Expand: `4x^2 - 4x + 1`." }],
            why:"Expand: `4x^2 - 4x + 1`, then differentiate: `8x - 4`.",
            hints:["Expand first.", "`4x^2 - 4x + 1`.", "`8x - 4`."] }
        ] },
      { id:"points", type:"custom", title:"Find the points", summary:"Find the points", star:true, goal:[4, 5],
        instruction:"Use `f′` to find points, coefficients and tangent lines. Items 4 to 7 (★) are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as 1/8. Points can go in either order; leave the second point empty if there’s only one.",
        msgs:{ partial:"Fill in both coordinates of each point, or leave the second point empty.", partialLine:"Fill in both boxes of each line.",
          number:"Type a number in each box, such as 4, −2 or 1/8.", empty:"Type your answer first.", both:"Fill in both boxes first.",
          missing:M7, missingLine:"Two tangents pass through that point: find both.", xok:"The `x`-values are right. Now find the heights: " + M5 },
        items:[
          { id:"s1", form:"pts", goal:[4, 5], prompt:"`f(x) = x^2 - 5x + 2`: find the point where the slope is 3.", answer:[[4, -2]], display:"(4, −2)",
            wrong:[{ pts:[[4, 3]], fb:"3 is the slope; find `f(4)`. " + M5 }],
            general:"Solve `f′(x) = 3`, then find `f(x)` there.",
            why:"`2x - 5 = 3` gives `x = 4`, and `f(4) = -2`.",
            hints:["Solve `f′(x) = 3`.", "`2x - 5 = 3`, so `x = 4`.", "`f(4) = 16 - 20 + 2 = -2`: the point is (4, −2)."] },
          { id:"s2", form:"pts", goal:5, prompt:"`f(x) = x^3 - 12x`: find the points with horizontal tangents.", answer:[[2, -16], [-2, 16]], display:"(2, −16) and (−2, 16)",
            wrong:[{ pts:[[2, -16]], fb:M7 }],
            general:"Horizontal tangents have slope 0: solve `f′(x) = 0`.",
            why:"`3x^2 - 12 = 0` gives `x = ±2`: (2, −16) and (−2, 16).",
            hints:["Horizontal means `f′(x) = 0`.", "`3x^2 - 12 = 0`, so `x = ±2`.", "`f(2) = -16` and `f(-2) = 16`: (2, −16) and (−2, 16)."] },
          { id:"s3", form:"pts", goal:5, prompt:"`f(x) = x^3 + 3x^2 - 7x + 1`: find the points where the tangent is parallel to `y = 2x + 5`.", answer:[[1, -2], [-3, 22]], display:"(1, −2) and (−3, 22)",
            general:"Solve `3x^2 + 6x - 7 = 2`: `(x - 1)(x + 3) = 0`.",
            why:"Parallel means slope 2: `(x - 1)(x + 3) = 0`, so (1, −2) and (−3, 22).",
            hints:["Parallel means slope 2.", "`3x^2 + 6x - 7 = 2`, so `x^2 + 2x - 3 = 0`.", "`x = 1` or `x = -3`: (1, −2) and (−3, 22)."] },
          { id:"s4", form:"pts", star:true, goal:[4, 5], prompt:"`f(x) = √x`: find the point where the tangent is perpendicular to `y = -4x + 1`.", answer:[[4, 2]], display:"(4, 2)",
            wrong:[{ pts:[[0.015625, 0.125]], fb:"Perpendicular to slope −4 means slope 1/4, not −4. " + M6 }],
            general:"Perpendicular to slope −4 means slope 1/4. Solve `f′(x) = {1}/{4}`.",
            why:"`{1}/{2√x} = {1}/{4}` gives `√x = 2`: the point (4, 2).",
            hints:["Perpendicular slopes multiply to −1.", "You need `f′(x) = {1}/{4}`: `{1}/{2√x} = {1}/{4}`.", "`√x = 2`, so `x = 4` and the point is (4, 2)."] },
          { id:"s5", form:"ab", star:true, goal:4, prompt:"`f(x) = ax^2 + bx` has the tangent slope 8 at the point (1, 5). Find `a` and `b`.", answer:{ a:3, b:2 }, display:"`a = 3`, `b = 2`",
            general:"Two equations: `a + b = 5` and `2a + b = 8`.",
            why:"The point gives `a + b = 5`; the slope gives `2a + b = 8`. Subtract: `a = 3`, so `b = 2`.",
            hints:["The point gives `f(1) = 5`; the slope gives `f′(1) = 8`.", "`a + b = 5` and `2a + b = 8`.", "Subtract: `a = 3`, then `b = 2`."] },
          { id:"s6", form:"c", star:true, goal:4, prompt:"The line `y = 4x + c` is tangent to `y = x^2 - 2x + 5`. Find `c`.", answer:{ c:-4 }, display:"`c = -4`",
            general:"Slope 4 at `x = 3`; the point is (3, 8); `8 = 12 + c`.",
            why:"`2x - 2 = 4` at `x = 3`; the point is (3, 8), and `8 = 4(3) + c` gives `c = -4`.",
            hints:["A tangent with slope 4: where is `f′(x) = 4`?", "`2x - 2 = 4`, so `x = 3`, and `f(3) = 8`.", "`8 = 4(3) + c`."] },
          { id:"s7", form:"lines", star:true, goal:4, prompt:"Find both tangents to `y = x^2` that pass through (1, −3) (not on the curve).", answer:[[6, -9], [-2, -1]], display:"`y = 6x - 9` and `y = -2x - 1`",
            general:"A tangent at `(t, t^2)` is `y = 2tx - t^2`. Make it pass through (1, −3): `t^2 - 2t - 3 = 0`.",
            why:"`t^2 - 2t - 3 = 0` gives `t = 3` or `t = -1`: `y = 6x - 9` and `y = -2x - 1`.",
            hints:["Name the point of tangency `(t, t^2)`; its slope is `2t`.", "Tangent: `y - t^2 = 2t(x - t)`, so `y = 2tx - t^2`.", "Substitute (1, −3): `-3 = 2t - t^2`, so `t = 3` or −1."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Ines", how:"", goal:[3, 4, 5],
        instruction:"Ines made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Differentiate `f(x) = {3}/{x^2} - 4√x`.",
            steps:["Rewrite: `f(x) = 3x^{-2} - 4x^{1/2}`.", "`f′(x) = -6x^{-1} - 2x^{-1/2}`.", "`f′(x) = -{6}/{x} - {2}/{√x}`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 rewrites step 2 correctly."],
            fixes:[
              { t:"−2 − 1 = −3: `f′(x) = -6x^{-3} - 2x^{-1/2} = -{6}/{x^3} - {2}/{√x}`.", ok:true, why:"Bring down −2 and subtract 1: the exponent becomes −3. The second term was already right." },
              { t:"`f′(x) = 6x^{-3} - 2x^{-1/2}`.", why:"The −2 comes down with its sign." },
              { t:"`f′(x) = {3}/{2x} - {4}/{2√x}`.", why:"Rewrite as a power first: `{3}/{x^2} = 3x^{-2}`." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Check the new exponent on the first term.", "−2 − 1 = ?", "−3."] },
          { id:"e2", goal:4, task:"Find the tangent to `f(x) = x^3 - 2x` at `x = 2`.",
            steps:["`f′(x) = 3x^2 - 2`.", "`f′(2) = 10`.", "`f(2) = 8 - 4 = 4`.", "Tangent: `y - 10 = 4(x - 2)`.", "`y = 4x + 2`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"The point is (2, 4) and the slope is 10: `y - 4 = 10(x - 2)`, so `y = 10x - 16`.", ok:true, why:"The point is `(2, f(2)) = (2, 4)`; the slope is `f′(2) = 10`." },
              { t:"`y - 4 = 10(x + 2)`.", why:"Sign: `x - 2`." },
              { t:"`y = 10x + 4`.", why:"4 is the `y`-value at `x = 2`, not the intercept." },
              { t:"Step 4 is correct.", why:M5 }],
            hints:["Which number is the slope and which is the `y`-coordinate?", "Slope `f′(2) = 10`; point (2, 4).", "`y - 4 = 10(x - 2)`."] },
          { id:"e3", goal:5, task:"Find the points on `f(x) = x^3 - 3x^2` where the tangent is parallel to `y = 9x`.",
            steps:["`f′(x) = 3x^2 - 6x`.", "Set `3x^2 - 6x = 9`.", "`3x^2 - 6x - 9 = 0`, so `x^2 - 2x - 3 = 0`.", "`(x - 3)(x + 1) = 0`, so `x = 3`.", "The point is (3, 0)."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"`x = 3` or `x = -1`: the points are (3, 0) and (−1, −4).", ok:true, why:"Each factor gives an `x`-value: `f(3) = 0` and `f(-1) = -4`." },
              { t:"`x = -3` or `x = 1`.", why:"`x - 3 = 0` gives 3; `x + 1 = 0` gives −1." },
              { t:"`x = 3` only, since `x` must be positive.", why:"Nothing restricts `x` here." },
              { t:"Step 4 is correct.", why:M7 }],
            hints:["How many factors are there?", "Two: each gives an `x`-value.", "`x = -1` too; `f(-1) = -1 - 3 = -4`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the rule checker: that constants vanish, or that the power rule works for fractions?" },
      { id:"j2", q:"In your own words, why does a vertical stretch by `@a{k}` multiply every slope by `@a{k}`?" },
      { id:"j3", q:"Explain to a friend how to find every point where a curve’s tangent is parallel to a given line." },
      { id:"j4", q:"Which step trips you up (rewriting as powers, exponent arithmetic, or the tangent equation)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:DDX + "`(x^7) = ?`", options:[
          { t:"`7x^6`", ok:true, why:"Bring the 7 down and lower the exponent to 6." },
          { t:"`x^6`", why:M1 },
          { t:"`7x^7`", why:M1 },
          { t:"`6x^7`", why:"The exponent comes down; it doesn’t become the coefficient minus one." }] },
        b:{ prompt:DDX + "`(x^9) = ?`", options:[
          { t:"`9x^8`", ok:true, why:"Bring the 9 down and lower the exponent to 8." },
          { t:"`x^8`", why:M1 },
          { t:"`9x^9`", why:M1 },
          { t:"`8x^9`", why:"The exponent comes down; it doesn’t become the coefficient minus one." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f(x) = 4x^3 - 5x + 9`. What is `f′(x)`?", options:[
          { t:"`12x^2 - 5`", ok:true, why:"Term by term: `12x^2`, then −5, then 0 for the constant." },
          { t:"`12x^2 - 5 + 9`", why:"The derivative of 9 is 0. " + M2 },
          { t:"`12x^2`", why:"The derivative of `-5x` is −5." },
          { t:"`4x^2 - 5`", why:"Multiply the 4 by the exponent 3. " + M1 }] },
        b:{ prompt:"`f(x) = 2x^4 + 3x - 8`. What is `f′(x)`?", options:[
          { t:"`8x^3 + 3`", ok:true, why:"Term by term: `8x^3`, then 3, then 0 for the constant." },
          { t:"`8x^3 + 3 - 8`", why:"The derivative of −8 is 0. " + M2 },
          { t:"`8x^3`", why:"The derivative of `3x` is 3." },
          { t:"`2x^3 + 3`", why:"Multiply the 2 by the exponent 4. " + M1 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:DDX + "`({1}/{x^2}) = ?`", options:[
          { t:"`-{2}/{x^3}`", ok:true, why:"`x^{-2} → -2x^{-3}`." },
          { t:"`{1}/{2x}`", why:"Rewrite as a power first: `{1}/{x^2} = x^{-2}`." },
          { t:"`-{2}/{x}`", why:"−2 − 1 = −3, not −1." },
          { t:"`{2}/{x^3}`", why:"The −2 comes down with its sign." }] },
        b:{ prompt:DDX + "`(√x) = ?`", options:[
          { t:"`{1}/{2√x}`", ok:true, why:"`x^{1/2} → {1}/{2}x^{-1/2}`." },
          { t:"`{1}/{2}√x`", why:"The exponent must drop by 1." },
          { t:"`{1}/{2}x^{3/2}`", why:"1/2 − 1 = −1/2." },
          { t:"`{1}/{√x}`", why:"Don’t forget the factor 1/2." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"At which points does `y = x^3 - 3x^2 - 9x + 2` have a horizontal tangent?", options:[
          { t:"(3, −25) and (−1, 7)", ok:true, why:"`y′ = 3(x - 3)(x + 1)`." },
          { t:"(−3, −25) and (1, −9)", why:"Sign slip: `(x - 3)(x + 1) = 0` gives 3 and −1." },
          { t:"(3, −25) only", why:M7 },
          { t:"(3, 0) and (−1, 0)", why:"0 is the slope there, not the height." }] },
        b:{ prompt:"At which points does `y = x^3 + 3x^2 - 24x + 1` have a horizontal tangent?", options:[
          { t:"(2, −27) and (−4, 81)", ok:true, why:"`y′ = 3(x - 2)(x + 4)`." },
          { t:"(−2, 53) and (4, 17)", why:"Sign slip: `(x - 2)(x + 4) = 0` gives 2 and −4." },
          { t:"(2, −27) only", why:M7 },
          { t:"(2, 0) and (−4, 0)", why:"0 is the slope there, not the height." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Find the equation of the normal to `y = x^2 - 4x` at `x = 3`.", options:[
          { t:"`y = -{x}/{2} - {3}/{2}`", ok:true, why:"Tangent slope `y′(3) = 2`, so the normal’s slope is `-1/2`; the point is (3, −3)." },
          { t:"`y = -2x + 3`", why:"Negative, but not the reciprocal. " + M6 },
          { t:"`y = 2x - 9`", why:"That’s the tangent." },
          { t:"`y = {x}/{2} - {9}/{2}`", why:"Reciprocal without the sign change." }] },
        b:{ prompt:"Find the equation of the normal to `y = x^2 + 2x` at `x = 1`.", options:[
          { t:"`y = -{x}/{4} + {13}/{4}`", ok:true, why:"Slope 4, so the normal’s slope is `-1/4`; the point is (1, 3)." },
          { t:"`y = -4x + 7`", why:"Negative, but not the reciprocal. " + M6 },
          { t:"`y = 4x - 1`", why:"That’s the tangent." },
          { t:"`y = {x}/{4} + {11}/{4}`", why:"Reciprocal without the sign change." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"`f(x) = ax^3 + bx`. The tangent at `x = 1` is horizontal, and `f(1) = -4`. Find `a` and `b`.", options:[
          { t:"`a = 2`, `b = -6`", ok:true, why:"`3a + b = 0` and `a + b = -4`." },
          { t:"`a = -2`, `b = 6`", why:"Sign slip when subtracting the equations." },
          { t:"`a = 1`, `b = -3`", why:"That meets `3a + b = 0` but gives `f(1) = -2`." },
          { t:"`a = 6`, `b = -2`", why:"`a` and `b` swapped: check `f′(1) = 18 - 2 ≠ 0`." }] },
        b:{ prompt:"`f(x) = ax^2 + bx`. The tangent at `x = 2` is horizontal, and `f(2) = -8`. Find `a` and `b`.", options:[
          { t:"`a = 2`, `b = -8`", ok:true, why:"`4a + b = 0` and `4a + 2b = -8`." },
          { t:"`a = -2`, `b = 8`", why:"Sign slip when subtracting the equations." },
          { t:"`a = 1`, `b = -4`", why:"`f(2) = -4`, not −8." },
          { t:"`a = -8`, `b = 2`", why:"`a` and `b` swapped: check `f′(2) = -32 + 2 ≠ 0`." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Why is " + DDX + "`(x^2 + 7)` the same as " + DDX + "`(x^2)`?", options:[
          { t:"“Adding 7 shifts the graph up 7. Every tangent shifts up too, so no slope changes: the derivative of a constant is 0.”", ok:true, why:"A vertical shift moves every tangent without tilting it." },
          { t:"“Because 7 is too small to matter.”", why:"Any constant works the same way." },
          { t:"“Because " + DDX + "`(7) = 7`, which cancels.”", why:"The derivative of 7 is 0. " + M2 },
          { t:"“Because you only differentiate the highest power.”", why:"Every term is differentiated." }] },
        b:{ prompt:"Why is " + DDX + "`(5x^3) = 5 ·` " + DDX + "`(x^3)`?", options:[
          { t:"“Multiplying by 5 stretches the graph vertically by 5, so every rise, and every tangent slope, is 5 times as big.”", ok:true, why:"A vertical stretch multiplies every rise, so every slope." },
          { t:"“Because 5 is a constant, so its derivative is 0.”", why:"That’s for a constant <strong>added</strong>, not multiplied." },
          { t:"“Because the 5 becomes part of the exponent.”", why:"The coefficient stays in front." },
          { t:"“Because the derivative of `5x^3` is `5x^3`.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best first step to differentiate `f(x) = {x^3 + 2}/{x}`?", options:[
          { t:"“Split and rewrite: `f(x) = x^2 + 2x^{-1}`, then use the power rule.”", ok:true, why:"Dividing each term by `x` leaves powers of `x`." },
          { t:"“Differentiate the top and the bottom separately: `3x^2/1`.”", why:"That isn’t a rule; the quotient rule (module 11) is different." },
          { t:"“Cancel the `x`: `x^2 + 2`.”", why:"Only common factors cancel; 2 has no `x`." },
          { t:"“Rewrite as `(x^3 + 2)x` and expand.”", why:"Dividing by `x` is multiplying by `x^{-1}`." }] },
        b:{ prompt:"Which is the best first step to differentiate `f(x) = {4 - x}/{√x}`?", options:[
          { t:"“Split and rewrite: `f(x) = 4x^{-1/2} - x^{1/2}`.”", ok:true, why:"Dividing each term by `x^{1/2}` leaves powers of `x`." },
          { t:"“Differentiate the top and the bottom separately.”", why:"That isn’t a rule; the quotient rule (module 11) is different." },
          { t:"“Cancel to `4 - √x`.”", why:"Only common factors cancel; 4 has no `√x`." },
          { t:"“Rewrite as `(4 - x)x^{1/2}`.”", why:"Dividing by `√x` is multiplying by `x^{-1/2}`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A ball’s height is `h(t) = -5t^2 + 20t + 1` metres after `t` seconds. When is its velocity 0, and how high is it then?", options:[
          { t:"`t = 2` s, at 21 m", ok:true, why:"`h′(t) = -10t + 20 = 0`; `h(2) = 21`." },
          { t:"`t = 4` s, at 1 m", why:"That’s when the ball is back at its starting height. At `t = 4`, `h′ = -20`." },
          { t:"`t = 2` s, at 20 m", why:"Don’t drop the +1 from `h(t)`." },
          { t:"`t = 0` s, at 1 m", why:"`h′(0) = 20`: the ball is rising fast at the start." }] },
        b:{ prompt:"A ball’s height is `h(t) = -5t^2 + 30t + 2` metres after `t` seconds. When is its velocity 0, and how high is it then?", options:[
          { t:"`t = 3` s, at 47 m", ok:true, why:"`h′(t) = -10t + 30 = 0`; `h(3) = 47`." },
          { t:"`t = 6` s, at 2 m", why:"That’s when the ball is back at its starting height. At `t = 6`, `h′ = -30`." },
          { t:"`t = 3` s, at 45 m", why:"Don’t drop the +2 from `h(t)`." },
          { t:"`t = 0` s, at 2 m", why:"`h′(0) = 30`: the ball is rising fast at the start." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"The volume of water in a tank is `V(t) = 400 - 20t + {t^2}/{4}` litres for `0 <= t <= 40` min. When is the water draining at 10 L/min?", options:[
          { t:"`t = 20` min", ok:true, why:"`V′(t) = -20 + {t}/{2} = -10`." },
          { t:"`t = 60` min", why:"Draining at 10 L/min means `V′ = -10`, not +10, and 60 is outside the domain." },
          { t:"`t = 40` min", why:DDT + "`({t^2}/{4}) = {t}/{2}`, not `{t}/{4}`." },
          { t:"Never: the rate is always −20 L/min", why:"The `{t^2}/{4}` term changes the rate." }] },
        b:{ prompt:"The volume of water in a tank is `V(t) = 300 - 24t + {t^2}/{2}` litres for `0 <= t <= 24` min. When is the water draining at 12 L/min?", options:[
          { t:"`t = 12` min", ok:true, why:"`V′(t) = -24 + t = -12`." },
          { t:"`t = 36` min", why:"Draining at 12 L/min means `V′ = -12`, not +12, and 36 is outside the domain." },
          { t:"`t = 24` min", why:DDT + "`({t^2}/{2}) = t`, not `{t}/{2}`." },
          { t:"Never: the rate is always −24 L/min", why:"The `{t^2}/{2}` term changes the rate." }] } }
    ]
  },
  task:{
    title:"Peak at `x = 1`", summary:"Peak at x = 1",
    statement:"<p>Design a cubic `f(x) = x^3 + bx^2 + cx + d` that meets every condition. Find all the answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The tangent at `x = 1` is horizontal.</li><li>The point at `x = 1` is a peak: the graph rises to it and falls after it.</li><li>The tangent at `x = 0` passes through (1, 0).</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −9 to 9 for `b`, `c` and `d`. The graph shows the tangents at `x = 0` and `x = 1`.</p>",
    checks:["Horizontal tangent at `x = 1`", "A peak at `x = 1`", "Tangent at `x = 0` passes through (1, 0)"],
    tips:["`f′(x) = 3x^2 + 2bx + c`. Set `f′(1) = 0`.",
      "For a peak, `f′` must be positive just left of 1 and negative just right, so its other zero must be to the right of 1.",
      "The tangent at `x = 0` is `y = cx + d`: slope `f′(0) = c`, intercept `f(0) = d`."],
    explainPrompt:"Explain how you used `f′` to make `x = 1` a peak and not a valley.",
    vocab:"Use the words derivative, horizontal tangent, increasing and decreasing.",
    after3:"Line 1 gives `c = -3 - 2b`. Line 2 needs `c > 3`, so `b < -3`; and `c ≤ 9` stops at `b = -6`. Line 3 sets `d = -c`."
  },
  cards:[
    ["Power rule", DDX + "`(x^n) = nx^{n-1}`, for any real `n`."],
    ["Constant rule", DDX + "`(c) = 0`."],
    ["Constant multiple rule", "`(kf)′ = kf′`: a vertical stretch multiplies every slope."],
    ["Sum and difference rules", "`(f ± g)′ = f′ ± g′`."],
    ["`√x`", "`x^{1/2} → {1}/{2}x^{-1/2} = {1}/{2√x}`."],
    ["`{1}/{x^n}`", "`x^{-n} → -nx^{-n - 1}`."],
    ["Tangent at `x = a`", "Point `(a, f(a))`, slope `f′(a)`: `y - f(a) = f′(a)(x - a)`."],
    ["Normal line", "Perpendicular to the tangent: slope `-1/f′(a)`."],
    ["Slope `m` somewhere?", "Solve `f′(x) = m`; there may be 0, 1 or 2 (or more) points."],
    ["Horizontal tangent", "`f′(x) = 0`."],
    ["Parallel lines", "Equal slopes."],
    ["Products and quotients (for now)", "Expand or divide first; rules for these arrive in 10 and 11."]
  ]
};
