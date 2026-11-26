// MHF4U 39 Transformations of Log Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/39-transformations-of-log-functions.md
const FORM = "`y = @a{a} log_{@b{b}}[@k{k}(x - @d{d})] + @c{c}`";
const FORM_INK = "`y = a log_{b}[k(x - d)] + c`";
const RULE = "`(x, y) -> (x/k + d, ay + c)`";
const SKILL_FEAT = 'Features of <span class="m"><i>y</i> = <span class="fnm">log</span><sub><i>b</i></sub> <i>x</i></span>';

// ---------- Practice 1 (sorter) helpers: feedback and hints built from each item ----------
// k(x − d) is the inside; side ">" means the domain is right of the wall.
const BOXES = { b1:[2, ">"], b2:[2, "<"], b3:[-2, ">"], b4:[-2, "<"] };
const M2S = "The minus sign in front of the log flips the graph top to bottom. It can’t change which `x`-values are allowed.";
const mt = v => String(v).replace("-", "−");
function sideItem(id, t, box, why, expr, k, d, aNeg, hints){
  const [w, s] = BOXES[box];
  const inDom = x => k * (x - d) > 0;
  const test = inDom(0) ? 0 : (w > 0 ? 3 : -3);
  const val = k * (test - d);
  const wallS = "Check the wall’s sign. `" + expr + "` is 0 at `x = " + w + "`.";
  const testS = "Test a value: at `x = " + test + "` the inside `" + expr + "` is " + mt(val) + ", which is " + (val > 0 ? "positive" : "negative") + ".";
  const sideS = aNeg ? M2S : "Right wall, wrong side. " + testS;
  const wrong = {};
  for (const b of Object.keys(BOXES)) {
    if (b === box) continue;
    const [bw, bs] = BOXES[b];
    if (bw === w) wrong[b] = sideS;
    else if (bs === s) wrong[b] = wallS;
    else wrong[b] = wallS + " " + (aNeg ? M2S : testS);
  }
  const op = s === ">" ? ">" : "<";
  return { id, t, answer:box, why, wrong,
    hints:hints || ["Find where the inside is 0. That’s the wall.",
      "The inside is `" + expr + "`, which is 0 at `x = " + w + "`. Now test one `x`-value on one side.",
      "`" + expr + " > 0` gives `x " + op + " " + w + "`, so the domain is `{x ∈ ℝ | x " + op + " " + w + "}`."] };
}
// small icon: an axis, the y-axis tick, a dashed wall at ±2 and the domain band on the matching side
function boxIcon(w, s){
  const X0 = 30, X = v => X0 + v * 7, wx = X(w);
  const band = s === ">" ? '<rect x="' + wx + '" y="15" width="' + (58 - wx) + '" height="7" fill="var(--hi)" opacity=".75"/>' : '<rect x="2" y="15" width="' + (wx - 2) + '" height="7" fill="var(--hi)" opacity=".75"/>';
  return '<svg width="60" height="30" viewBox="0 0 60 30" aria-hidden="true">' + band +
    '<path d="M2 18.5H58" stroke="currentColor" stroke-width="1.2"/><path d="M' + X0 + ' 14V23" stroke="currentColor" stroke-width="1.2"/>' +
    '<path d="M' + wx + ' 2V28" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 2.5"/></svg>';
}

export default {
  id:"39-transformations-of-log-functions",
  kind:"topic",
  title:"Transformations of log functions",
  topic:"Transformations of Log Functions",
  readyTopic:"transformations of log functions",
  hero:{
    eq:FORM, eqLabel:"y equals a times log base b of the quantity k times x minus d, plus c", eqSize:"md",
    headline:"Which numbers can move the wall?",
    text:"Every log graph has a <strong>vertical asymptote</strong>, a wall it hugs but never crosses, and its <strong>domain</strong> sits on one side of that wall. Four numbers, `@a{a}`, `@k{k}`, `@d{d}` and `@c{c}`, transform the graph. Some of them can move the wall or switch the side the graph lives on, and some can’t. You’ll find out which. Then you’ll sketch any transformed log graph by hand from its wall, its side and a few <strong>key points</strong>, moved with the <strong>mapping rule</strong> `(x, y) -> (x/@k{k} + @d{d}, @a{a}y + @c{c})`.</p>" +
      "<p class=\"lw-hook\">Same colours as module 07: violet `@a{a}` and orange `@k{k}` stretch; teal `@d{d}` and magenta `@c{c}` shift. The base `@b{b}` is brown.",
    fig:{ aria:"The graph of y = log base 2 of x with its wall x = 0 and key points; the points travel along mapping arrows while the wall slides to x = 3 and the domain switches to the left", caption:"" },
    capEnd:"`y = 2 log_{2}[-(x - 3)] + 1`. The wall moved from `x = 0` to `x = 3`, and the graph switched sides. Which of `@a{a}`, `@k{k}`, `@d{d}` and `@c{c}` did that? Explore will show you."
  },
  goals:[
    "I can describe how each of `a`, `k`, `d` and `c` transforms the graph of `y = log_{b} x`, naming stretches and reflections first, then translations.",
    "I can find the vertical asymptote and the domain of " + FORM_INK + " from its equation, factoring the inside first when needed, and explain why `a` and `c` can’t change them.",
    "I can map key points with " + RULE + " and use them, with the asymptote, to sketch the graph.",
    "I can state the range, the intercepts and where the function increases or decreases, and describe its behaviour next to the asymptote and far from it.",
    "I can recognize when two different equations give the same log graph, such as `y = log_{2}(4x)` and `y = log_{2} x + 2`.",
    "I can work backwards from a graph, points or features to an equation of a transformed log function."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Evaluating logarithms", goal:3,
          prompt:"What is `log_{2} 32`?",
          options:[
            { t:"5", ok:true, why:"`log_{2} 32` asks: 2 to what exponent gives 32? `2^5 = 32`, so `log_{2} 32 = 5`." },
            { t:"4", why:"`2^4 = 16`, not 32. Halving 32 gives 16, 8, 4, 2, 1: five halvings to reach 1, so the exponent is 5." },
            { t:"16", why:"32 ÷ 2 = 16, but a logarithm is an exponent, not a quotient. `2^{16}` is 65 536." },
            { t:"64", why:"2 × 32 = 64. The log is the exponent that turns 2 into 32: `2^5 = 32`." }],
          hints:["A logarithm is an exponent. `log_{2} 32` means: 2 to what exponent gives 32?", "List powers of 2: 2, 4, 8, 16, 32 …", "`2^5 = 32`, so `log_{2} 32 = 5`."] },
        { id:"w2", skill:"Evaluating logarithms", goal:3,
          prompt:"What is `log_{3}(1/9)`?",
          options:[
            { t:"`-2`", ok:true, why:"`3^{-2} = 1/3^2 = 1/9`, so `log_{3}(1/9) = -2`. Numbers between 0 and 1 have negative logs." },
            { t:"2", why:"`3^2 = 9`, not 1/9. A reciprocal needs a negative exponent: `3^{-2} = 1/9`." },
            { t:"`1/2`", why:"`3^{1/2} = √3`, about 1.73, not 1/9. The reciprocal of the input gives the <strong>opposite</strong> of the log, not its reciprocal." },
            { t:"`-1/2`", why:"`3^{-1/2} = 1/√3`, about 0.58. For 1/9 you need `1/3^2`, so the exponent is −2." }],
          hints:["Write 1/9 as a power of 3.", "`9 = 3^2`, and a reciprocal flips the sign of the exponent.", "`1/9 = 3^{-2}`, so `log_{3}(1/9) = -2`."] },
        { id:"w3", skill:SKILL_FEAT, goal:2,
          prompt:"What is the domain of `y = log_{2} x`?",
          options:[
            { t:"`{x ∈ ℝ | x > 0}`", ok:true, why:"`log_{2} x` is the exponent that turns 2 into `x`. Every power of 2 is positive, so `x` must be positive. 0 is excluded too: 2 to any exponent is never 0." },
            { t:"`{x ∈ ℝ | x ≥ 0}`", why:"`log_{2} 0` would need `2^y = 0`, which never happens. The graph hugs the `y`-axis but never reaches `x = 0`." },
            { t:"`{x ∈ ℝ}`", why:"Every real number is the <strong>range</strong> (any exponent is possible). The inputs must be positive." },
            { t:"`{x ∈ ℝ | x > 1}`", why:"`log_{2} x` is positive when `x > 1`, but it exists for `0 < x < 1` too: `log_{2}(1/2) = -1`." }],
          hints:["`log_{2} x` answers: 2 to what exponent gives `x`? Which numbers can a power of 2 equal?", "Powers of 2 are always positive, and never 0.", "So `x > 0`: the domain is `{x ∈ ℝ | x > 0}`."] },
        { id:"w4", skill:"Transformations", goal:3,
          prompt:"The point (2, 5) is on the graph of `y = f(x)`. Which point must be on the graph of `y = 3f(x - 4) + 1`?",
          options:[
            { t:"(6, 16)", ok:true, why:"The mapping rule " + RULE + " with `k = 1`, `d = 4`, `a = 3`, `c = 1` gives (2 + 4, 3(5) + 1) = (6, 16)." },
            { t:"(−2, 16)", why:"`x - 4` inside moves the graph 4 units <strong>right</strong>: 2 + 4 = 6." },
            { t:"(6, 18)", why:"That’s 3(5 + 1). Stretch first, then shift: 3(5) + 1 = 16." },
            { t:"(6, 9)", why:"5 + 3 + 1 = 9 treats the 3 as a shift. A vertical stretch by 3 multiplies: 3 × 5 = 15, then + 1 = 16." }],
          hints:["Use " + RULE + ". Read `a`, `k`, `d` and `c` from `3f(x - 4) + 1`.", "`a = 3`, `k = 1`, `d = 4`, `c = 1`. The `x`-coordinate becomes 2 + 4.", "(2 + 4, 3 × 5 + 1) = (6, 16)."] },
        { id:"w5", skill:"Transformations", goal:1,
          prompt:"Compared with `y = f(x)`, the graph of `y = f[2(x + 3)]` is…",
          options:[
            { t:"compressed horizontally by a factor of 1/2, then translated 3 units left", ok:true, why:"`k = 2` compresses by a factor of 1/2, and `x + 3 = x - (-3)` means `d = -3`: 3 units left." },
            { t:"stretched horizontally by a factor of 2, then translated 3 units left", why:"`k = 2` squeezes the graph toward the `y`-axis: each `x`-coordinate is halved. That’s a compression by a factor of 1/2." },
            { t:"compressed horizontally by a factor of 1/2, then translated 3 units right", why:"`x + 3` is `x - (-3)`, so `d = -3`: left, not right." },
            { t:"compressed horizontally by a factor of 1/2, then translated 6 units left", why:"The 2 is factored out already: `2(x + 3)`. The translation is the number inside the bracket with `x`, which is 3." }],
          hints:["Match `f[2(x + 3)]` to `f[k(x - d)]`. What are `k` and `d`?", "`k = 2` and `d = -3`. A `k` bigger than 1 compresses.", "Compression by a factor of 1/2, then 3 units left."] },
        { id:"w6", skill:"Linear inequalities", goal:2,
          prompt:"Solve `6 - 2x > 0`.",
          options:[
            { t:"`x < 3`", ok:true, why:"`-2x > -6`. Dividing by −2 reverses the inequality: `x < 3`. Check `x = 0`: 6 − 0 = 6 > 0." },
            { t:"`x > 3`", why:"Check `x = 4`: 6 − 8 = −2, which isn’t > 0. Dividing by −2 flips > to <." },
            { t:"`x ≤ 3`", why:"At `x = 3`, 6 − 6 = 0, and 0 > 0 is false. The inequality is strict." },
            { t:"`x < -3`", why:"`6 - 2x > 0` gives `-2x > -6`, not `-2x > 6`. Check `x = 0`: 6 > 0, so 0 must be a solution, but 0 < −3 is false." }],
          hints:["Move the 6: `-2x > -6`.", "Divide by −2, and remember what happens to the inequality sign.", "`x < 3`. Check: `x = 0` gives 6 > 0 ✓, `x = 4` gives −2 > 0 ✗."] }
      ],
      refreshers:{
        "Evaluating logarithms":"A logarithm is an exponent. `log_{b} x = y` means `b^y = x`. So `log_{2} 32 = 5` because `2^5 = 32`, and `log_{3}(1/9) = -2` because `3^{-2} = 1/9`. Reciprocals give negative logs, and `log_{b} 1 = 0` for every base.",
        [SKILL_FEAT]:"For a base `b > 1`: domain `{x ∈ ℝ | x > 0}`, range `{y ∈ ℝ}`, vertical asymptote `x = 0` (the `y`-axis), `x`-intercept (1, 0), no `y`-intercept, and the graph rises from left to right. Key points: `(1/b, -1)`, (1, 0), `(b, 1)`. For base 2: (1/2, −1), (1, 0), (2, 1), (4, 2).",
        "Transformations":"In `y = a f[k(x - d)] + c`, each point `(x, y)` moves to `(x/k + d, ay + c)`. `a` stretches or compresses vertically by a factor of `|a|` (and reflects in the `x`-axis if negative); `k` stretches or compresses horizontally by a factor of `1/|k|` (and reflects in the `y`-axis if negative); `d` moves the graph right (left if negative); `c` moves it up (down if negative). Example: on `y = 3f(x - 4) + 1`, (2, 5) moves to (6, 16). If the inside isn’t factored, factor `k` out first: `f(2x + 6) = f[2(x + 3)]`.",
        "Linear inequalities":"Solve like an equation, but when you multiply or divide by a negative number, reverse the sign. `6 - 2x > 0 -> -2x > -6 -> x < 3`. Check with one value: `x = 0` gives 6 > 0, true."
      }
    }
  },
  explore:{
    heading:"Domain wall",
    intro:"Move the sliders and watch the wall, the shaded domain and the key points. Drag the probe to test any `x`-value: is it allowed? Then switch to <strong>Stretch or shift?</strong> to see something only log graphs do.",
    predIntro:"Make a prediction first. Then the explorer will show you what really happens.",
    predictions:[
      { id:"p1", start:{ view:"t", b:2, a:1, k:1, d:0, c:0, probe:2 },
        prompt:"First `c` will change from 0 to 4. Then `d` will change from 0 to −3. Where will the wall be at the end?",
        options:[{ t:"`x = -3`", ok:true }, { t:"`x = 3`" }, { t:"`x = 1`" }, { t:"`x = 4`" }],
        banners:["The wall didn’t move.", "The wall, the domain and the curve slid 3 units left together."],
        explain:"Moving a vertical line up or down leaves it where it is, so `c` can’t move the wall. `d = -3` makes the inside `x - (-3) = x + 3`, which is 0 at `x = -3`: 3 units left. `x = 3` is the sign slip. `x = 1` adds the two shifts, as if `c` could move the wall too. `x = 4` lets `c` move it." },
      { id:"p2", start:{ view:"t", b:2, a:1, k:1, d:2, c:0, probe:4 },
        prompt:"`a` will change from 1 to −3. What will the domain be?",
        options:[{ t:"`{x ∈ ℝ | x > 2}`, unchanged", ok:true }, { t:"`{x ∈ ℝ | x < 2}`" }, { t:"`{x ∈ ℝ | x > 6}`" }, { t:"`{x ∈ ℝ | x > -6}`" }],
        banners:["Every point kept its `x`-coordinate. Domain: still `x > 2`."],
        explain:"`a` multiplies the output, after the log is taken. It moves points up and down only, so the set of allowed `x`-values can’t change. A reflection in the `x`-axis flips the graph top to bottom, not left to right. The other options multiply the wall by 3 or by −3, as if the stretch acted on `x`." },
      { id:"p3", start:{ view:"t", b:2, a:1, k:1, d:1, c:0, probe:0 },
        prompt:"`k` will change from 1 to −1. What will happen to the graph?",
        options:[{ t:"It flips across the wall `x = 1`, and the domain becomes `x < 1`", ok:true }, { t:"It flips across the `x`-axis, and the domain stays `x > 1`" }, { t:"It disappears, because a log of a negative number has no value" }, { t:"It flips across the `y`-axis, and the wall moves to `x = -1`" }],
        banners:["The graph turned over the wall `x = 1`. Domain: now `x < 1`."],
        explain:"With `k = -1` the inside is `-(x - 1) = 1 - x`, which is positive when `x < 1`. So the graph now lives left of the wall. In the mapping rule, `x/k + d` sends (2, 1) on `y = log_{2} x` to `(2/(-1) + 1, 1) = (-1, 1)`. The reflection in the `y`-axis happens first and the shift right 1 happens after, so the result looks like a mirror image across the wall itself. Flipping across the `x`-axis is `a`’s job. Negative values of `k` don’t make the graph vanish: they make the inside positive on the other side." },
      { id:"p4", start:{ view:"s", b:2, ks:1 },
        prompt:"`k` will change from 1 to 4, a horizontal compression by a factor of 1/4. The gap bars will measure how far the new curve is above `y = log_{2} x` at `x = 1`, 2, 4 and 8. What will the gaps be?",
        options:[{ t:"All 2", ok:true }, { t:"All 4" }, { t:"They grow as `x` grows" }, { t:"They shrink toward 0 as `x` grows" }],
        banners:["Same curve: `log_{2}(4x) = log_{2} x + 2`."],
        explain:"Multiplying the inside by 4 is two doublings, and each doubling adds 1 to a base-2 log. So every point gains exactly 2, wherever it is: a horizontal compression by 1/4 is the same as a translation 2 units up. ‘All 4’ mixes up the factor with the shift. Growing gaps are what happens to `y = x^2`: turn on the comparison to see `(2x)^2` pull away from `x^2`. The gaps can’t shrink: the two curves never meet. (Module 41 shows why this works for any number, not just powers of the base.)" }
    ],
    chalIntro:"Set the explorer, then press <strong>Check challenge</strong>. Tapping a challenge shows its target on the graph. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Put the wall at `x = 3` with the domain on its <strong>left</strong>, and make the graph cross the `x`-axis at (2, 0).",
        why:"The wall `x = 3` needs `d = 3`, and only a negative `k` puts the domain on the left. With `k = -1` the inside at `x = 2` is 1 and `log_{b} 1 = 0`, so `c = 0` works with any `a` and any base, such as `y = log_{2}[-(x - 3)]`. Other settings trade `k` for `c`, such as `k = -2`, `c = -1` with `a = 1` in base 2.",
        general:"Put the wall at `x = 3` first, then choose the side, then the height at `x = 2`.",
        hints:["The wall is where the inside is 0. Which `d` puts it at `x = 3`?", "`d = 3`. For the domain to be on the left, `k` must be negative. Try `k = -1`.", "With `k = -1` the inside at `x = 2` is `-(2 - 3) = 1`, and `log_{b} 1 = 0`. So with `c = 0` the graph crosses at (2, 0): `y = log_{2}[-(x - 3)]` works, with any `a`."] },
      { id:"tc2", goal:[3, 6], prompt:"Match the dashed target curve exactly. Its wall is `x = 1`, and three of its points are ringed: (0, −1), (−1, 1) and (−3, 3).",
        answer:{ b:2, a:2, k:-1, d:1, c:-1 }, target:{ pts:[[0, -1], [-1, 1], [-3, 3]] },
        why:"Matched. This curve has five different slider settings. Try `k = -2`: what must `c` become? (The Stretch or shift? view explains why.)",
        general:"Check the wall first, then the side, then match the marked points one at a time.",
        hints:["Where is the target’s wall, and which side of it does the curve live on?", "Wall `x = 1`, domain `x < 1`: `d = 1` and `k` negative (try `k = -1`). The marked points are 1, 2 and 4 units from the wall.", "Distances 1, 2, 4 double each time, and the heights go −1, 1, 3: up 2 per doubling. In base 2 that’s `a = 2`. At distance 1 the log is 0, so `c = -1`: `y = 2 log_{2}[-(x - 1)] - 1`."] },
      { id:"tc3", goal:[3, 6], stretch:true, prompt:"The wall is fixed at `x = -2`. Make the curve pass through both marked points, (0, 1) and (6, −1). (While this challenge is selected, `d` is locked at −2.)",
        target:{ pts:[[0, 1], [6, -1]], lockD:-2 },
        why:"Guessing rarely works here. Between the two points the distance from the wall goes from 2 to 8, so the inside is multiplied by 4. In base 2 that adds `log_{2} 4 = 2` to the log, so the curve changes by `2a` between the points. `2a = -2` gives `a = -1`.",
        hints:["Measure how far each point is from the wall `x = -2`.", "The distances are 2 and 8, so the inside is multiplied by 4 between the points. In base 2, that adds `log_{2} 4 = 2` to the log. So the curve changes by `2a`.", "`2a = -1 - 1 = -2`, so `a = -1`. With `k = 1`: `-log_{2} 2 + c = 1`, so `c = 2`. `y = -log_{2}(x + 2) + 2`."] }
    ],
    chalFb:{
      tc1:{ dm3:"Your wall is at `x = -3`. For a wall at `x = 3` the inside must be `k(x - 3)`, so `d = 3`.",
        aNeg:"A negative `a` flips the graph top to bottom, not left to right. Your domain is still `x > 3`. Only a negative `k` puts it on the left.",
        kPos:"Right wall, wrong side. With `k > 0` the inside `k(x - 3)` is positive only when `x > 3`. Make `k` negative.",
        miss:"Right wall and right side. At `x = 2` your graph is at {yv}, not 0. The inside there is `k(2 - 3) = -k`." },
      tc2:{ kPos:"Your curve is the mirror image of the target: it lives right of its wall. The target lives left of `x = 1`, so `k` must be negative.",
        dm1:"Your wall is at `x = -1`. The target’s wall is `x = 1`.",
        aNeg:"Your curve rises toward the wall; the target falls toward it. Change the sign of `a`.",
        a1:"You pass through (0, −1), but at `x = -1` you’re at 0, not 1. The target climbs 2 each time the distance from the wall doubles, so `a = 2`.",
        base:"With base {b}, no `a` on the slider fits all three points. The marked points are 1, 2 and 4 units from the wall, and the heights rise by the same amount each time the distance doubles. Which base makes doubling add a whole number?" },
      tc3:{ kNeg:"With `k < 0` the domain is left of `x = -2`, so neither point can be on the graph.",
        aPos:"Your curve rises from left to right, but (6, −1) is lower than (0, 1). Make `a` negative.",
        a2:"Your curve drops 4 between the points. The inside is multiplied by 4 there (distances 2 and 8), which adds 2 to a base-2 log, so the drop is 2 × 2. You need a drop of 2.",
        base:"In base {b}, multiplying the inside by 4 adds {L} ≈ {v} to the log, so you’d need `a ≈` {av}, which isn’t on the slider. Try base 2.",
        other:"At `x = 0` your curve is at {y0}, and at `x = 6` it’s at {y6}." }
    }
  },
  part3:{
    slug:"mapping", name:"By hand",
    heading:"Wall, domain and key points by hand",
    intro:"Read the equation, place the wall, choose the side, then move three key points with the mapping rule. When your sketch agrees with itself, check it against the real graph.",
    checks:["`a`, `k`, `d` and `c`", "Wall", "Domain side", "Key points", "My points agree with my wall"],
    ui:{
      steps:["Read the parameters", "Wall", "Side", "Map three key points", "Draw my sketch"],
      factorLab:"Factor first:",
      wallHow:"Tap the `x`-axis, or press <strong>Place wall</strong> and use the arrow keys. It snaps to steps of 0.5 and can be dragged.",
      sides:["Domain left of the wall", "Domain right of the wall"],
      pointsHow:"Each row moves a point of `y = log_{b} x`. Its image appears on the grid as soon as both boxes are filled.",
      sketchHow:"The tool joins your three points with a smooth curve (long dashes) and extends it toward the wall and away from it. It’s a drawing aid: it shows what your points say.",
      wrongSide:"Your point {pt} is {lr} of your wall `x =` {w}, but you chose the domain on the {side}.",
      onWall:"Your point {pt} sits on your wall `x =` {w}, where the log has no value.",
      sameX:"Two of your points have the same `x`-coordinate. A function has only one height at each `x`.",
      notMono:"A log graph always rises or always falls as you move away from its wall. Your heights go {hs} as the points get farther from the wall, so at least one point is wrong.",
      allRight:"All four lines are right. The true graph is drawn in blue over your sketch.",
      generic:{ params:"Compare the equation with `y = a log_{b}[k(x - d)] + c`. Check {list} again.", factor:"Multiply your factored form back out and compare it with the inside.",
        wall:"Your wall is at `x =` {w}. The wall is where the inside is 0.", side:"Test one `x`-value on each side of the wall: the inside must be positive.",
        point:"Check your image of {pt}. Use `(x/k + d, ay + c)` with the right `a`, `k`, `d` and `c`." }
    },
    algGeneral:[
      ["Why the wall is `x = d`", "The inside `k(x - d)` is 0 at `x = d`, and `log_{b} 0` has no value, because `b^y` is never 0. Close to `x = d` the inside is a tiny positive number, so the log is a huge negative number: the graph plunges along the wall."],
      ["Why the side depends on `k`", "The inside must be positive: `k(x - d) > 0`. Divide by `k`. If `k > 0`, `x - d > 0`, so `x > d`. If `k < 0`, dividing reverses the inequality: `x < d`."],
      ["Why the rule is `(x/k + d, ay + c)`", "Take a point `(x, y)` on `y = log_{b} x`. On the new graph, the input `X` with `k(X - d) = x` gives the same log, `y`. Solving, `X = x/k + d`. The output is then `a · y + c`."],
      ["Why a squeeze can be a shift", "If `k = b^m`, then `k · x = b^m · b^{log_{b} x} = b^{m + log_{b} x}`, so `log_{b}(kx) = m + log_{b} x`. Example: `log_{2}(4x) = 2 + log_{2} x`. Only exponent laws are needed."]
    ],
    rounds:[
      { id:"r1", goal:[2, 3], eq:"`y = 2 log_{2}(x - 3) + 1`", b:2,
        answer:{ a:2, k:1, d:3, c:1, side:"r", img:[[3.5, -1], [4, 1], [5, 3]] },
        parents:[[0.5, -1], [1, 0], [2, 1]],
        wrong:{ d:[{ v:-3, fb:"`x - 3` is 0 at `x = 3`, not −3." }], wall:[{ v:-3, fb:"`x - 3` is 0 at `x = 3`, not −3." }],
          pts:[
            { i:1, p:[4, 2], fb:"You added `c` before multiplying by `a`. The rule is `ay + c`: 2(0) + 1 = 1, not 2(0 + 1) = 2." },
            { i:2, p:[5, 4], fb:"You added `c` before multiplying by `a`. The rule is `ay + c`: 2(1) + 1 = 3, not 2(1 + 1) = 4." },
            { i:0, p:[3.5, 0], fb:"You added `c` before multiplying by `a`. The rule is `ay + c`: 2(−1) + 1 = −1, not 2(−1 + 1) = 0." },
            { i:1, p:[4, 0], fb:"The `y`-coordinate is `ay + c` = 2(0) + 1 = 1. Don’t forget `c`." },
            { i:2, p:[-1, 3], fb:"`x - 3` inside moves the graph 3 units right: add 3 to each `x`-coordinate." },
            { i:0, p:[-2.5, -1], fb:"`x - 3` inside moves the graph 3 units right: add 3 to each `x`-coordinate." }] },
        hints:["Compare `2 log_{2}(x - 3) + 1` with `a log_{b}[k(x - d)] + c`.", "`a = 2`, `k = 1`, `d = 3`, `c = 1`. The wall is `x = 3`; with `k > 0` the domain is on the right. Each point moves to `(x + 3, 2y + 1)`.", "(1/2, −1) → (7/2, −1); (1, 0) → (4, 1); (2, 1) → (5, 3)."],
        alg:"At `x = 5`: `2 log_{2}(5 - 3) + 1 = 2 log_{2} 2 + 1 = 3` ✓. At `x = 7/2`: `2 log_{2}(1/2) + 1 = -2 + 1 = -1` ✓." },
      { id:"r2", goal:[2, 3], eq:"`y = -log_{3}(x + 4) + 2`", b:3,
        answer:{ a:-1, k:1, d:-4, c:2, side:"r", img:[[-3, 2], [-1, 1], [5, 0]] },
        parents:[[1, 0], [3, 1], [9, 2]],
        wrong:{ d:[{ v:4, fb:"`x + 4 = x - (-4)`: `d = -4`, so the wall is at `x = -4`." }], wall:[{ v:4, fb:"`x + 4 = x - (-4)`: `d = -4`, so the wall is at `x = -4`." }],
          side:"`a = -1` flips the graph top to bottom only. The inside `x + 4` is positive when `x > -4`.",
          pts:[
            { i:1, p:[-1, -3], fb:"That’s `-(y + 2)`. Multiply by `a` first, then add `c`: −1 + 2 = 1." },
            { i:2, p:[5, -4], fb:"That’s `-(y + 2)`. Multiply by `a` first, then add `c`: −2 + 2 = 0." },
            { i:2, p:[5, 4], fb:"You left out the reflection: `a = -1` makes the `y`-coordinate `-y + 2`." },
            { i:1, p:[-1, 3], fb:"You left out the reflection: `a = -1` makes the `y`-coordinate `-y + 2`." },
            { i:1, p:[7, 1], fb:"`x + 4` inside moves the graph 4 units <strong>left</strong>: 3 − 4 = −1." }] },
        hints:["Rewrite `x + 4` as `x - (-4)`, and read `a` from the sign in front of the log.", "`a = -1`, `k = 1`, `d = -4`, `c = 2`. Each point moves to `(x - 4, -y + 2)`.", "(1, 0) → (−3, 2); (3, 1) → (−1, 1); (9, 2) → (5, 0)."],
        alg:"At `x = 5`: `-log_{3} 9 + 2 = -2 + 2 = 0` ✓, so (5, 0) is also the `x`-intercept. At `x = -1`: `-log_{3} 3 + 2 = 1` ✓." },
      { id:"r3", goal:[2, 3], eq:"`y = log_{2}(6 - 2x) - 1`", b:2, factor:{ lhs:"`6 - 2x =`" },
        answer:{ a:1, k:-2, d:3, c:-1, side:"l", f:[-2, 3], img:[[2.5, -1], [2, 0], [-1, 2]] },
        parents:[[1, 0], [2, 1], [8, 3]],
        wrong:{ factor:[{ v:[2, 3], fb:"Multiply back out: `2(x - 3) = 2x - 6`, the opposite of `6 - 2x`. The factor is −2." }, { v:[-2, -3], fb:"`-2(x + 3) = -2x - 6`. You need +6: `-2(x - 3) = -2x + 6`." }],
          d:[{ v:6, fb:"6 is the constant before factoring. `6 - 2x = -2(x - 3)`, so the wall is `x = 3`. Check: at `x = 3` the inside is 0." }],
          wall:[{ v:6, fb:"6 is the constant before factoring. `6 - 2x = -2(x - 3)`, so the wall is `x = 3`. Check: at `x = 3` the inside is 0." }],
          side:"Test `x = 0`: 6 − 0 = 6 > 0, so 0 is in the domain, left of the wall. A negative `k` puts the domain on the left.",
          pts:[
            { i:1, p:[-1, 0], fb:"That multiplies by `k`: −2(2) + 3. The rule divides: 2/(−2) + 3 = 2." },
            { i:2, p:[-13, 2], fb:"That multiplies by `k`: −2(8) + 3. The rule divides: 8/(−2) + 3 = −1." },
            { i:1, p:[4, 0], fb:"Dividing by `k = -2` gives a negative number: 2/(−2) = −1, then + 3 = 2. Keep the sign of `k`." }] },
        hints:["Factor the inside so it looks like `k(x - d)`. Take out −2.", "`6 - 2x = -2(x - 3)`: `k = -2`, `d = 3`. Wall `x = 3`, and with `k < 0` the domain is on the left. Each point moves to `(x/(-2) + 3, y - 1)`.", "(1, 0) → (5/2, −1); (2, 1) → (2, 0); (8, 3) → (−1, 2)."],
        alg:"Factor first: `6 - 2x = -2(x - 3)`. At `x = 2`: `log_{2}(6 - 4) - 1 = 1 - 1 = 0` ✓, so (2, 0) is the `x`-intercept. At `x = -1`: `log_{2} 8 - 1 = 2` ✓." }
    ],
    blocks:[{ title:"How to graph it by hand", html:"<p><strong>Graphing " + FORM_INK + " in five steps</strong></p><ol><li><strong>Factor</strong> the inside if needed, so it reads `k(x - d)`.</li><li><strong>Wall:</strong> `x = d`.</li><li><strong>Side:</strong> `k > 0`, the domain is right of the wall; `k < 0`, left.</li><li><strong>Points:</strong> move three key points of `y = log_{b} x` with " + RULE + ".</li><li><strong>Draw:</strong> a curve through the points that hugs the wall (down along it if `a > 0`, up along it if `a < 0`) and keeps going slowly the other way, with no horizontal asymptote.</li></ol>" }],
    quickCheck:{
      title:"Read it from the equation", summary:"Read it from the equation",
      items:[
        { id:"q1", goal:2, prompt:"What is the vertical asymptote of `y = log_{2}(3x - 12) + 5`?",
          choices:[{ t:"`x = 4`", ok:true, fb:"Right. `3x - 12 = 3(x - 4)`, so the inside is 0 at `x = 4`." },
            { t:"`x = 12`", fb:"Factor first: `3x - 12 = 3(x - 4)`. At `x = 12` the inside is 24." },
            { t:"`x = -4`", fb:"`3(x - 4)` is 0 at `x = 4`, not −4." },
            { t:"`x = 5`", fb:"The + 5 lifts the graph; it can’t move a vertical wall." }] },
        { id:"q2", goal:2, prompt:"What is the domain of `y = -2 log(5 - x)`?",
          choices:[{ t:"`{x ∈ ℝ | x < 5}`", ok:true, fb:"Right. `5 - x > 0` gives `x < 5`. The −2 acts on the output, so it doesn’t change the domain." },
            { t:"`{x ∈ ℝ | x > 5}`", fb:"Test `x = 0`: 5 − 0 = 5 > 0, so 0 is allowed. The domain is left of the wall." },
            { t:"`{x ∈ ℝ | x > -5}`", fb:"`5 - x` is 0 at `x = 5`. Check `x = 6`: the inside is −1." }] },
        { id:"q3", goal:3, prompt:"(4, 2) is on `y = log_{2} x`. Where does it land on `y = 3 log_{2}(x + 1) - 4`?",
          choices:[{ t:"(3, 2)", ok:true, fb:"Right. (4 − 1, 3(2) − 4) = (3, 2). Check: `3 log_{2} 4 - 4 = 2`." },
            { t:"(5, 2)", fb:"`x + 1` inside moves the graph 1 unit left: 4 − 1 = 3." },
            { t:"(3, −6)", fb:"That’s 3(2 − 4). Multiply first, then subtract: 3(2) − 4 = 2." },
            { t:"(3, −2)", fb:"You left out the stretch: 3 × 2 = 6, then − 4." }] },
        { id:"q4", goal:5, prompt:"Is `y = log_{3}(9x)` the same graph as `y = log_{3} x + 2`?",
          choices:[{ t:"Yes", ok:true, fb:"Right. `9 = 3^2`, so multiplying the inside by 9 adds 2 to a base-3 log. Check at `x = 3`: `log_{3} 27 = 3` and `log_{3} 3 + 2 = 3`." },
            { t:"No: one is a compression and the other is a translation", fb:"Both descriptions are true of the same curve. Check `x = 1`: `log_{3} 9 = 2` and `log_{3} 1 + 2 = 2`. At `x = 3`: 3 and 3." },
            { t:"No: `log_{3}(9x) = 9 log_{3} x`", fb:"At `x = 3`, `9 log_{3} 3 = 9`, but `log_{3} 27 = 3`. A factor inside the log is not a factor outside." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sides", type:"sorter", title:"Which side of which wall?", summary:"Which side of which wall?", noun:"function", goal:[2, 1],
        instruction:"Sort each function into the box with its domain.", how:"Tap a function, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"`{x ∈ ℝ | x > 2}`", icon:boxIcon(2, ">") }, { id:"b2", label:"`{x ∈ ℝ | x < 2}`", icon:boxIcon(2, "<") },
          { id:"b3", label:"`{x ∈ ℝ | x > -2}`", icon:boxIcon(-2, ">") }, { id:"b4", label:"`{x ∈ ℝ | x < -2}`", icon:boxIcon(-2, "<") }],
        items:[
          sideItem("i1", "`y = log(x - 2) + 5`", "b1", "`x - 2 > 0` gives `x > 2`. The + 5 lifts the graph and can’t move the wall.", "x - 2", 1, 2, false),
          sideItem("i2", "`y = -3 log_{2}(x - 2)`", "b1", "`x - 2 > 0`. The −3 reflects the graph top to bottom, so the domain doesn’t change.", "x - 2", 1, 2, true),
          sideItem("i3", "`y = log_{3}(4x - 8)`", "b1", "`4x - 8 = 4(x - 2)`, positive when `x > 2`.", "4x - 8", 4, 2, false),
          sideItem("i4", "`y = 2 log(2 - x)`", "b2", "`2 - x > 0` gives `x < 2`.", "2 - x", -1, 2, false),
          sideItem("i5", "`y = log_{2}(-x + 2) - 7`", "b2", "`-x + 2 = -(x - 2)`: `k = -1`, so the domain is left of `x = 2`.", "-x + 2", -1, 2, false),
          sideItem("i6", "`y = -log(6 - 3x) + 1`", "b2", "`6 - 3x = -3(x - 2) > 0` gives `x < 2`.", "6 - 3x", -3, 2, true,
            ["Find where the inside is 0. That’s the wall.", "The inside is `6 - 3x`, which is 0 at `x = 2`. Now test `x = 0`.", "At `x = 0` the inside is 6, which is positive, so the domain is left of the wall: `{x ∈ ℝ | x < 2}`."]),
          sideItem("i7", "`y = log(x + 2) - 2`", "b3", "`x + 2 > 0` gives `x > -2`.", "x + 2", 1, -2, false),
          sideItem("i8", "`y = 5 - log_{2}(x + 2)`", "b3", "The 5 and the minus sign act on the output. The inside `x + 2 > 0` gives `x > -2`.", "x + 2", 1, -2, true),
          sideItem("i9", "`y = log_{3}(2x + 4) - 1`", "b3", "`2x + 4 = 2(x + 2)`, positive when `x > -2`.", "2x + 4", 2, -2, false),
          sideItem("i10", "`y = log(-x - 2)`", "b4", "`-x - 2 = -(x + 2) > 0` gives `x < -2`.", "-x - 2", -1, -2, false),
          sideItem("i11", "`y = -2 log_{2}[-(x + 2)] + 3`", "b4", "`k = -1` and `d = -2`: the domain is left of `x = -2`.", "-(x + 2)", -1, -2, true,
            ["Find where the inside is 0. That’s the wall.", "The inside is `-(x + 2)`, which is 0 at `x = -2`. The −2 and the + 3 are outside, so ignore them. Test `x = -3`.", "At `x = -3` the inside is `-(-1) = 1`, which is positive, so the domain is `{x ∈ ℝ | x < -2}`."]),
          sideItem("i12", "`y = log(-4 - 2x)`", "b4", "`-4 - 2x = -2(x + 2) > 0` gives `x < -2`.", "-4 - 2x", -2, -2, false)
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Yasmin", how:"",
        instruction:"Yasmin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"State the vertical asymptote and the domain of `y = 3 log_{2}(2x - 8) + 1`.",
            steps:["The inside of the log is `2x - 8`.", "Comparing with `log_{b}[k(x - d)]`, `d = 8`, so the vertical asymptote is `x = 8`.", "`k = 2` is positive, so the domain is to the right of the wall.", "So the domain is `{x ∈ ℝ | x > 8}`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is true: a positive `k` puts the domain on the right. The mistake is earlier.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"Factor first: `2x - 8 = 2(x - 4)`, so `d = 4`. The asymptote is `x = 4` and the domain is `{x ∈ ℝ | x > 4}`.", ok:true, why:"The form `k(x - d)` needs `k` factored out. Check: at `x = 4` the inside is 2(4) − 8 = 0." },
              { t:"The asymptote is `x = -8`, because the sign in front of 8 flips.", why:"At `x = -8` the inside is 2(−8) − 8 = −24, not 0. The wall is where the inside is 0." },
              { t:"The asymptote is `x = 9`, because the + 1 moves the wall 1 unit.", why:"`c` lifts the graph; it can’t move a vertical line sideways." },
              { t:"Step 2 is correct as written.", why:"At `x = 8` the inside is 2(8) − 8 = 8, not 0. `d` can only be read after factoring." }],
            hints:["Check step 2: what must the inside equal at the wall?", "Set `2x - 8 = 0`, or factor: `2x - 8 = 2(x - ?)`.", "`2x - 8 = 2(x - 4)`, so `d = 4`: wall `x = 4`, domain `x > 4`. Step 2 read `d` before factoring."] },
          { id:"e2", goal:3, task:"(4, 2) is on `y = log_{2} x`. Find where it lands on `y = -log_{2}[2(x + 1)] + 3`.",
            steps:["`a = -1`, `k = 2`, `d = -1`, `c = 3`.", "New `x`: `kx + d = 2(4) + (-1) = 7`.", "New `y`: `ay + c = -1(2) + 3 = 1`.", "So (4, 2) lands on (7, 1)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is correct: `ay + c`. The mistake is earlier.", "Step 4 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"New `x`: `x/k + d = 4/2 + (-1) = 1`. The point lands on (1, 1).", ok:true, why:"A horizontal compression by a factor of 1/2 halves the `x`-coordinate. Check: `-log_{2}[2(1 + 1)] + 3 = -2 + 3 = 1`." },
              { t:"New `x`: `x/k - d = 4/2 + 1 = 3`.", why:"`d` is −1 here, so `x/k + d = 2 - 1 = 1`. Check (3, 1): `-log_{2}[2(4)] + 3 = 0`, not 1." },
              { t:"New `x`: `(x + d)/k = (4 - 1)/2 = 3/2`.", why:"That shifts before compressing. The rule divides by `k` first, then adds `d`. Check (3/2, 1): `-log_{2} 5 + 3`, which isn’t 1, because `log_{2} 5` isn’t 2 (`2^2 = 4`). It’s about 0.68." },
              { t:"Step 2 is correct as written.", why:"Check (7, 1): `-log_{2}[2(8)] + 3 = -4 + 3 = -1`, not 1. A compression by a factor of 1/2 halves the `x`-coordinates; it doesn’t double them." }],
            hints:["Does a horizontal compression by a factor of 1/2 double the `x`-coordinate, or halve it?", "The mapping rule is " + RULE + ".", "`x/k + d = 4/2 - 1 = 1`, so (4, 2) → (1, 1). Step 2 multiplied by `k` instead of dividing."] },
          { id:"e3", goal:2, task:"Describe the vertical asymptote, domain and range of `y = -2 log_{3}(x + 5) - 4`.",
            steps:["The inside, `x + 5`, is 0 at `x = -5`, so the vertical asymptote is `x = -5`.", "`a = -2` is negative, so the graph is reflected in the `x`-axis.", "A reflection flips the domain to the other side of the wall: `{x ∈ ℝ | x < -5}`.", "The range is `{y ∈ ℝ}`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: a negative `a` reflects in the `x`-axis. Keep checking.", "", "Step 4 is true: every log graph has range all real numbers. The mistake is earlier."],
            fixes:[
              { t:"A reflection in the `x`-axis flips the `y`-values only. The inside `x + 5` must still be positive, so the domain is `{x ∈ ℝ | x > -5}`.", ok:true, why:"Only the inside decides the domain. `a` changes heights, not which `x`-values are allowed." },
              { t:"The reflection moves the wall too, so the domain is `{x ∈ ℝ | x > 5}`.", why:"The wall is where `x + 5 = 0`, at `x = -5`. `a` can’t move it." },
              { t:"The − 4 moves the wall down, so the domain is `{x ∈ ℝ | x > -9}`.", why:"`c` shifts the graph up or down. A vertical wall slid up or down stays exactly where it is." },
              { t:"Step 3 is correct as written.", why:"Test `x = -6`, which step 3 says is in the domain: the inside is −6 + 5 = −1, and `log_{3}(-1)` has no value." }],
            hints:["Which part of the equation decides which `x`-values are allowed?", "Only the inside, `x + 5`, must be positive. `a = -2` changes the `y`-values.", "`x + 5 > 0` gives `x > -5`. A reflection in the `x`-axis doesn’t move the domain; only a negative `k` would put it on the left."] }
        ] },
      { id:"backwards", type:"custom", title:"Work backwards", summary:"Work backwards", star:true, goal:[6, 2, 3, 5],
        instruction:"Fill in the boxes to make a function with all the listed features.",
        how:"Type an integer or a simple fraction in each box (negative values are fine), then press Check. After each Check, a small graph shows your curve with the item’s points.",
        ui:{ empty:"Enter a number in every box, such as −2, 3 or 1/2.", zero:"{p} can’t be 0.", your:"Your function:", wall:"wall `x =` {w}", side:"domain {lr} of the wall", gives:"at `x =` {x} gives {yv}", none:"at `x =` {x} has no value", needs:"(needs {v})", passes:"passes through {pt}" },
        items:[
          { id:"B1", goal:6, b:2, tpl:"full", feat:"Base 2. Vertical asymptote `x = 2`; passes through (3, 1) and (6, 5).",
            answer:{ a:2, k:1, d:2, c:1 }, wall:2, side:"r", pts:[[3, 1], [6, 5]], view:{ xmin:-1, xmax:9, ymin:-3, ymax:7 },
            wrong:[{ m:{ a:4, k:1, d:2, c:1 }, fb:"This passes through (3, 1), but at `x = 6` it gives `4 log_{2} 4 + 1 = 9`. From `x = 3` to `x = 6` the distance from the wall goes from 1 to 4: two doublings. A rise of 4 over two doublings means `a = 2`." },
              { m:{ d:-2 }, fb:"Your wall is at `x = -2`. The inside must be `x - 2`." },
              { m:{ a:4 / 3 }, fb:"4/3 is the slope between the points, as if the graph were a line. A log rises by `a` for every doubling of the distance from the wall." }],
            hints:["Measure each point’s distance from the wall `x = 2`.", "Distances 1 and 4. At distance 1 the log is 0, so `c = 1`. From 1 to 4 is two doublings.", "The rise from 1 to 5 is 4 over two doublings, so `a = 2`: `y = 2 log_{2}(x - 2) + 1`."],
            right:"✓ Correct. Check: at `x = 3`, `2 log_{2} 1 + 1 = 1`, and at `x = 6`, `2 log_{2} 4 + 1 = 5`. The inside `x - 2` is 0 at the wall `x = 2`." },
          { id:"B2", goal:6, b:3, tpl:"full", feat:"Base 3. Domain `{x ∈ ℝ | x < 0}`; passes through (−1, 3) and (−9, 1).",
            answer:{ a:-1, k:-1, d:0, c:3 }, wall:0, side:"l", pts:[[-1, 3], [-9, 1]], view:{ xmin:-11, xmax:2, ymin:-2, ymax:6 },
            wrong:[{ m:{ a:1, k:-1, d:0, c:3 }, fb:"At `x = -9` this gives `log_{3} 9 + 3 = 5`. The heights fall from 3 to 1 as you move away from the wall, so `a` is negative." },
              { m:{ k:1 }, fb:"With `k = 1` the domain is `x > 0`, so (−1, 3) isn’t on the graph. For a domain on the left, `k` must be negative." },
              { m:{ a:-2, k:-1, d:0, c:3 }, fb:"At `x = -9` this gives `-2 log_{3} 9 + 3 = -1`. From distance 1 to distance 9 is two triplings, and `log_{3} 9 = 2`, so a drop of 2 needs `a = -1`." }],
            hints:["Domain `x < 0`: where is the wall, and what sign must `k` have?", "Wall `x = 0`, `k = -1`. The points are 1 and 9 units from the wall, and `log_{3} 1 = 0`, `log_{3} 9 = 2`.", "(−1, 3) gives `c = 3`. Then `2a + 3 = 1`, so `a = -1`: `y = -log_{3}(-x) + 3`."],
            right:"✓ Correct. Check: at `x = -1`, `-log_{3} 1 + 3 = 3`, and at `x = -9`, `-log_{3} 9 + 3 = 1`. The inside `-x` is positive only when `x < 0`." },
          { id:"B3", goal:[6, 1], b:10, tpl:"full", feat:"Base 10. `y = log x` is reflected in the `x`-axis, compressed horizontally by a factor of 1/10, then translated 4 units left.",
            answer:{ a:-1, k:10, d:-4, c:0 }, wall:-4, side:"r", pts:[[-3.9, 0], [-3, -1]], view:{ xmin:-6, xmax:4, ymin:-4, ymax:3 },
            wrong:[{ m:{ k:10, d:-0.4 }, fb:"`10x + 4 = 10(x + 2/5)`: the wall is at `x = -2/5`. Translating after the compression puts the 4 inside the bracket: `10(x + 4)`." },
              { m:{ d:4 }, fb:"That moves the graph right. 4 units left means `x + 4` inside: `d = -4`." },
              { m:{ k:0.1 }, fb:"`k = 1/10` <strong>stretches</strong> by a factor of 10. A compression by a factor of 1/10 needs `k = 10`." },
              { m:{ a:1 }, fb:"A reflection in the `x`-axis makes `a` negative." }],
            hints:["Each description matches one parameter: reflection in the `x`-axis → `a`; compression → `k`; translation → `d`.", "`a = -1`; a compression by a factor of 1/10 means `k = 10`; 4 units left means `d = -4`.", "`y = -log[10(x + 4)]`. (It is also `y = -log(x + 4) - 1`, since `log 10 = 1`.)"],
            right:"✓ Correct. Reflection: `a = -1`. Compression by a factor of 1/10: `k = 10`. Then 4 units left: `d = -4`. Check: at `x = -3.9` the inside is 10(0.1) = 1, so `y = -log 1 = 0`, and the wall is `x = -4`." },
          { id:"B4", goal:6, b:2, tpl:"full", feat:"Base 2. `x`-intercept (5, 0); vertical asymptote `x = 1`; passes through (17, 2).",
            answer:{ a:1, k:1, d:1, c:-2 }, wall:1, side:"r", pts:[[5, 0], [17, 2]], view:{ xmin:-1, xmax:19, ymin:-4, ymax:5 },
            wrong:[{ m:{ a:1, k:1, d:1, c:0 }, fb:"`y = log_{2}(x - 1)` is 2 at `x = 5`, not 0. Move it down 2." },
              { m:{ a:2, k:1, d:1, c:-4 }, fb:"This crosses at (5, 0), but at `x = 17` it gives `2 log_{2} 16 - 4 = 4`. From distance 4 to distance 16 is two doublings with a rise of 2, so `a = 1`." },
              { m:{ d:-1 }, fb:"Your wall is at `x = -1`. The inside must be `x - 1`." }],
            hints:["Distances from the wall: 4 for (5, 0) and 16 for (17, 2).", "From 4 to 16 is two doublings, and `y` rises 2, so `a = 1`. Then `log_{2} 4 + c = 0`.", "`2 + c = 0`, so `c = -2`: `y = log_{2}(x - 1) - 2`."],
            right:"✓ Correct. Check: at `x = 5`, `log_{2} 4 - 2 = 0`, and at `x = 17`, `log_{2} 16 - 2 = 2`. The inside `x - 1` is 0 at the wall `x = 1`." },
          { id:"B5", goal:[6, 5], b:2, tpl:"dc", star:true, feat:"Base 2. `y = log_{2} x` is compressed horizontally by a factor of 1/8, then translated 2 units right. Write the result <strong>without `k`</strong>: `y = log_{2}(x - [ ]) + [ ]`.",
            answer:{ a:1, k:1, d:2, c:3 }, wall:2, side:"r", pts:[[3, 3], [4, 4]], view:{ xmin:-1, xmax:8, ymin:-2, ymax:7 },
            wrong:[{ m:{ d:2, c:8 }, fb:"The compression adds `log_{2} 8`, which is 3, not 8. `8 = 2^3`." },
              { m:{ d:2, c:-3 }, fb:"Compressing toward the `y`-axis raises a log graph: `log_{2}[8(x - 2)] = log_{2}(x - 2) + 3`." },
              { m:{ d:0.25, c:3 }, fb:"That’s what you get if you translate first and then compress: `log_{2}(8x - 2) = log_{2}[8(x - 1/4)]`. Stretches and compressions come first." },
              { m:{ d:16, c:3 }, fb:"The translation isn’t multiplied by 8: after the compression, moving 2 right replaces `x` with `x - 2`." }],
            hints:["Write it with `k` first. A compression by a factor of 1/8 is `k = 8`; then 2 units right.", "`y = log_{2}[8(x - 2)]`. `8 = 2^3`, so multiplying the inside by 8 adds 3 to the log.", "`y = log_{2}(x - 2) + 3`: `d = 2`, `c = 3`."],
            right:"✓ Correct. `8 = 2^3`, so multiplying the inside by 8 adds 3. Check: at `x = 3`, `log_{2}[8(1)] = 3` and `log_{2} 1 + 3 = 3`; at `x = 4`, `log_{2}[8(2)] = 4` and `log_{2} 2 + 3 = 4`." },
          { id:"B6", goal:6, b:2, tpl:"adc", star:true, feat:"Base 2. `y = a log_{2}(x - d) + c` passes through (2, 1), (3, 3) and (5, 5).",
            answer:{ a:2, k:1, d:1, c:1 }, wall:null, side:"r", pts:[[2, 1], [3, 3], [5, 5]], view:{ xmin:-1, xmax:7, ymin:-2, ymax:7 },
            wrong:[{ m:{ a:2, d:0, c:-1 }, fb:"This passes through (2, 1), but at `x = 3` it gives `2 log_{2} 3 - 1` ≈ 2.17. With the wall at `x = 0` the distances 2, 3, 5 don’t grow by equal factors." },
              { m:{ d:2 }, fb:"(2, 1) would sit on the wall, where the log has no value." },
              { m:{ a:1, d:1, c:1 }, fb:"Right wall. But the heights rise 2 per doubling of the distance (1 → 2 → 4), so `a = 2`." }],
            hints:["The heights go up in equal steps of 2. For a log graph, equal steps up come from equal <strong>ratios</strong> of the distances from the wall.", "So `(3 - d)/(2 - d) = (5 - d)/(3 - d)`. Cross-multiply.", "`(3 - d)^2 = (2 - d)(5 - d)` gives `9 - 6d = 10 - 7d`, so `d = 1`. The distances are 1, 2, 4, each double the last, so `a = 2`, and (2, 1) gives `c = 1`: `y = 2 log_{2}(x - 1) + 1`."],
            right:"✓ Correct. The points are 1, 2 and 4 units from the wall `x = 1`, so the logs are 0, 1 and 2, and the heights 2(0) + 1, 2(1) + 1 and 2(2) + 1 are 1, 3 and 5." }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"In Explore, which surprised you more: that `a` and `c` never move the wall, or that squeezing a log graph sideways can look exactly like sliding it up? Describe what you saw." },
      { id:"j2", q:"In your own words, explain why only the inside, `k(x - d)`, can change the domain of a log function." },
      { id:"j3", q:"Explain to a friend how to sketch `y = log_{2}(8 - 2x) + 1`: the wall, the side and two key points." },
      { id:"j4", q:"Which step of graphing a transformed log function do you still get wrong most often? What will you do differently next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:4,
        a:{ prompt:"Which statement describes the graph of `y = -2 log_{3}(x + 1) + 4` next to its vertical asymptote and far from it?", options:[
          { t:"As `x → -1⁺`, `y → ∞`, and as `x → ∞`, `y → -∞`.", ok:true, why:"The wall is `x = -1`, where the inside `x + 1` is 0. Next to it the log plunges toward −∞, and `a = -2` turns that into ∞. Far away the log keeps rising slowly, and `a = -2` turns that into a slow fall with no floor." },
          { t:"As `x → -1⁺`, `y → -∞`, and as `x → ∞`, `y → ∞`.", why:"That’s the behaviour of `y = log_{3}(x + 1)`, before the reflection. `a = -2` is negative, so both ends flip: up along the wall, down far away." },
          { t:"As `x → -1⁺`, `y → ∞`, and as `x → ∞`, `y → 4`.", why:"The + 4 lifts the graph, but a log graph never levels off, so there’s no horizontal asymptote. At `x = 80`, `y = -2 log_{3} 81 + 4 = -4`, already below 4." },
          { t:"As `x → 1⁺`, `y → ∞`, and as `x → ∞`, `y → -∞`.", why:"The inside `x + 1` is 0 at `x = -1`, not 1, so the graph runs along the wall `x = -1`." }] },
        b:{ prompt:"Which statement describes the graph of `y = -3 log_{2}(x - 2) + 5` next to its vertical asymptote and far from it?", options:[
          { t:"As `x → 2⁺`, `y → ∞`, and as `x → ∞`, `y → -∞`.", ok:true, why:"The wall is `x = 2`, where the inside `x - 2` is 0. Next to it the log plunges toward −∞, and `a = -3` turns that into ∞. Far away the log keeps rising slowly, and `a = -3` turns that into a slow fall with no floor." },
          { t:"As `x → 2⁺`, `y → -∞`, and as `x → ∞`, `y → ∞`.", why:"That’s the behaviour of `y = log_{2}(x - 2)`, before the reflection. `a = -3` is negative, so both ends flip: up along the wall, down far away." },
          { t:"As `x → 2⁺`, `y → ∞`, and as `x → ∞`, `y → 5`.", why:"The + 5 lifts the graph, but a log graph never levels off, so there’s no horizontal asymptote. At `x = 10`, `y = -3 log_{2} 8 + 5 = -4`, already below 5." },
          { t:"As `x → -2⁺`, `y → ∞`, and as `x → ∞`, `y → -∞`.", why:"The inside `x - 2` is 0 at `x = 2`, not −2, so the graph runs along the wall `x = 2`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the domain of `y = log_{2}(12 - 3x)`?", options:[
          { t:"`{x ∈ ℝ | x < 4}`", ok:true, why:"`12 - 3x > 0` gives `-3x > -12`, so `x < 4` (dividing by −3 reverses the sign)." },
          { t:"`{x ∈ ℝ | x > 4}`", why:"Test `x = 0`: 12 > 0, so 0 is in the domain. Dividing by −3 reverses the inequality." },
          { t:"`{x ∈ ℝ | x < 12}`", why:"12 is the constant before factoring: `12 - 3x = -3(x - 4)`. At `x = 5` the inside is −3." },
          { t:"`{x ∈ ℝ | x < -4}`", why:"That comes from `-3x > 12`, which moves the 12 across without changing its sign. `12 - 3x > 0` gives `-3x > -12`, so `x < 4`. Check `x = 0`: the inside is 12 > 0, so 0 is in the domain, but 0 < −4 is false." }] },
        b:{ prompt:"What is the domain of `y = log(10 - 2x) + 3`?", options:[
          { t:"`{x ∈ ℝ | x < 5}`", ok:true, why:"`10 - 2x > 0` gives `x < 5`. The + 3 acts on the output." },
          { t:"`{x ∈ ℝ | x > 5}`", why:"Test `x = 0`: 10 > 0, so 0 is in the domain." },
          { t:"`{x ∈ ℝ | x < 10}`", why:"`10 - 2x = -2(x - 5)`. At `x = 6` the inside is −2." },
          { t:"`{x ∈ ℝ | x < -5}`", why:"That comes from `-2x > 10`, which moves the 10 across without changing its sign. `10 - 2x > 0` gives `-2x > -10`, so `x < 5`. Check `x = 0`: the inside is 10 > 0, so 0 is in the domain, but 0 < −5 is false." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"(9, 2) is on the graph of `y = log_{3} x`. Which point is on the graph of `y = 2 log_{3}(x - 4) + 1`?", options:[
          { t:"(13, 5)", ok:true, why:"(9 + 4, 2(2) + 1) = (13, 5). Check: `2 log_{3} 9 + 1 = 5`." },
          { t:"(5, 5)", why:"`x - 4` inside moves the graph 4 units right: 9 + 4 = 13." },
          { t:"(13, 6)", why:"That’s 2(2 + 1). Multiply first, then add: 2(2) + 1 = 5." },
          { t:"(13, 3)", why:"That adds 1 but leaves out the stretch: 2 × 2 = 4, then + 1." }] },
        b:{ prompt:"(8, 3) is on the graph of `y = log_{2} x`. Which point is on the graph of `y = 3 log_{2}(x + 2) - 1`?", options:[
          { t:"(6, 8)", ok:true, why:"(8 − 2, 3(3) − 1) = (6, 8). Check: `3 log_{2} 8 - 1 = 8`." },
          { t:"(10, 8)", why:"`x + 2` inside moves the graph 2 units left: 8 − 2 = 6." },
          { t:"(6, 6)", why:"That’s 3(3 − 1). Multiply first, then subtract: 3(3) − 1 = 8." },
          { t:"(6, 2)", why:"That subtracts 1 but leaves out the stretch: 3 × 3 = 9, then − 1." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"In `y = a log_{2}[k(x - 3)] + c`, the numbers `a`, `k` and `c` are all positive. You want the graph to pass through (1, 5). Which number must become negative?", options:[
          { t:"`k`", ok:true, why:"(1, 5) is left of the wall `x = 3`, and right now the domain is `x > 3`. Only a negative `k` moves the domain to the left. Then it can work: with `k = -1` the inside at `x = 1` is 2, so `a = 1` and `c = 4` give `log_{2} 2 + 4 = 5`." },
          { t:"`a`", why:"A negative `a` flips the graph top to bottom. The domain stays `x > 3`, so `x = 1` still has no value." },
          { t:"`c`", why:"`c` moves the graph up or down. No height can reach a point whose `x`-value isn’t in the domain." },
          { t:"None; a larger `c` is enough.", why:"At `x = 1` the inside is `k(1 - 3) = -2k`, which is negative while `k > 0`, so there is no point on the graph at `x = 1` at all." }] },
        b:{ prompt:"In `y = a log_{3}[k(x + 2)] + c`, the numbers `a`, `k` and `c` are all positive. You want the graph to pass through (−5, 1). Which number must become negative?", options:[
          { t:"`k`", ok:true, why:"(−5, 1) is left of the wall `x = -2`, and right now the domain is `x > -2`. Only a negative `k` moves it to the left. With `k = -1` the inside at `x = -5` is 3, so `a = 1/2` and `c = 1/2` give `(1/2) log_{3} 3 + 1/2 = 1`." },
          { t:"`a`", why:"A negative `a` flips the graph top to bottom. The domain stays `x > -2`." },
          { t:"`c`", why:"`c` moves the graph up or down. It can’t make `x = -5` allowed." },
          { t:"None; a smaller `c` is enough.", why:"At `x = -5` the inside is `k(-5 + 2) = -3k`, which is negative while `k > 0`, so there is no point on the graph at `x = -5`." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"The graph of `y = a log_{2}(x - d) + c` has vertical asymptote `x = -1` and passes through (0, 4) and (3, 0). What is `a`?", options:[
          { t:"`-2`", ok:true, why:"`d = -1`. At `x = 0` the inside is 1 and `log_{2} 1 = 0`, so `c = 4`. At `x = 3` the inside is 4: `2a + 4 = 0`, so `a = -2`." },
          { t:"2", why:"The graph falls from (0, 4) to (3, 0), so `a` must be negative." },
          { t:"`-4`", why:"−4 is the change in `y`. Between the points the inside goes from 1 to 4, which adds `log_{2} 4 = 2` to the log, so `a = -4 ÷ 2`." },
          { t:"`-4/3`", why:"−4/3 is the slope of the line through the two points. The graph is a log curve, not a line." }] },
        b:{ prompt:"The graph of `y = a log_{3}(x - d) + c` has vertical asymptote `x = 2` and passes through (3, −1) and (11, 3). What is `a`?", options:[
          { t:"2", ok:true, why:"`d = 2`. At `x = 3` the inside is 1, so `c = -1`. At `x = 11` the inside is 9 and `log_{3} 9 = 2`: `2a - 1 = 3`, so `a = 2`." },
          { t:"`-2`", why:"The graph rises from (3, −1) to (11, 3), so `a` is positive." },
          { t:"4", why:"4 is the change in `y`. The inside goes from 1 to 9, which adds `log_{3} 9 = 2` to the log, so `a = 4 ÷ 2`." },
          { t:"`1/2`", why:"1/2 is the slope of the line through the two points. The graph is a log curve, not a line." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Which equation has exactly the same graph as `y = log_{2}(4x - 12)`?", options:[
          { t:"`y = log_{2}(x - 3) + 2`", ok:true, why:"Factor first: `4x - 12 = 4(x - 3)`. Then `4 = 2^2`, so multiplying the inside by 4 adds 2: `log_{2}[4(x - 3)] = log_{2}(x - 3) + 2`. Check `x = 4`: `log_{2} 4 = 2` and `log_{2} 1 + 2 = 2`." },
          { t:"`y = log_{2}(x - 12) + 2`", why:"The 4 has to come out of both terms: `4x - 12 = 4(x - 3)`. `log_{2}(x - 12) + 2` has its wall at `x = 12`, but `log_{2}(4x - 12)` has its wall at `x = 3`." },
          { t:"`y = log_{2}(x - 3) + 4`", why:"The shift is `log_{2} 4 = 2`, not 4. At `x = 4`: `log_{2} 4 = 2`, but `log_{2} 1 + 4 = 4`." },
          { t:"`y = 4 log_{2}(x - 3)`", why:"A factor inside isn’t a factor outside. At `x = 5`: `log_{2} 8 = 3`, but `4 log_{2} 2 = 4`." }] },
        b:{ prompt:"Which equation has exactly the same graph as `y = log_{3}(9x + 18)`?", options:[
          { t:"`y = log_{3}(x + 2) + 2`", ok:true, why:"Factor first: `9x + 18 = 9(x + 2)`. Then `9 = 3^2`, so multiplying the inside by 9 adds 2: `log_{3}[9(x + 2)] = log_{3}(x + 2) + 2`. Check `x = -1`: `log_{3} 9 = 2` and `log_{3} 1 + 2 = 2`." },
          { t:"`y = log_{3}(x + 18) + 2`", why:"The 9 has to come out of both terms: `9x + 18 = 9(x + 2)`. `log_{3}(x + 18) + 2` has its wall at `x = -18`, but `log_{3}(9x + 18)` has its wall at `x = -2`." },
          { t:"`y = log_{3}(x + 2) + 9`", why:"The shift is `log_{3} 9 = 2`, not 9. At `x = -1`: `log_{3} 9 = 2`, but `log_{3} 1 + 9 = 9`." },
          { t:"`y = 9 log_{3}(x + 2)`", why:"A factor inside isn’t a factor outside. At `x = 1`: `log_{3} 27 = 3`, but `9 log_{3} 3 = 9`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which describes how to get `y = 3 log[2(x + 1)] - 4` from `y = log x`, correctly and in a correct order?", options:[
          { t:"A vertical stretch by a factor of 3 and a horizontal compression by a factor of 1/2, then a translation 1 unit left and 4 units down.", ok:true, why:"`a = 3`, `k = 2`, `d = -1`, `c = -4`, with stretches before translations, as in the mapping rule `(x/2 - 1, 3y - 4)`." },
          { t:"A vertical stretch by a factor of 3 and a horizontal stretch by a factor of 2, then a translation 1 unit left and 4 units down.", why:"`k = 2` halves every `x`-coordinate: that’s a compression by a factor of 1/2." },
          { t:"A vertical stretch by a factor of 3 and a horizontal compression by a factor of 1/2, then a translation 2 units left and 4 units down.", why:"The bracket is already factored: `2(x + 1)`. The shift is the number with `x` inside the bracket, 1, not 2 × 1." },
          { t:"A translation 1 unit left and 4 units down, then a vertical stretch by a factor of 3 and a horizontal compression by a factor of 1/2.", why:"In that order the stretch also stretches the shift: the − 4 becomes − 12, and you get `3 log(2x + 1) - 12`." }] },
        b:{ prompt:"Which describes how to get `y = -(1/2) log_{2}[3(x - 2)] + 5` from `y = log_{2} x`, correctly and in a correct order?", options:[
          { t:"A vertical compression by a factor of 1/2, a reflection in the `x`-axis and a horizontal compression by a factor of 1/3, then a translation 2 units right and 5 units up.", ok:true, why:"`a = -1/2`, `k = 3`, `d = 2`, `c = 5`, stretches and reflections first." },
          { t:"A vertical compression by a factor of 1/2, a reflection in the `x`-axis and a horizontal stretch by a factor of 3, then a translation 2 units right and 5 units up.", why:"`k = 3` divides every `x`-coordinate by 3: that’s a compression by a factor of 1/3." },
          { t:"A vertical compression by a factor of 1/2, a reflection in the `x`-axis and a horizontal compression by a factor of 1/3, then a translation 6 units right and 5 units up.", why:"The bracket is already factored: `3(x - 2)`. The shift is 2, not 3 × 2." },
          { t:"A translation 2 units right and 5 units up, then a vertical compression by a factor of 1/2, a reflection in the `x`-axis and a horizontal compression by a factor of 1/3.", why:"In that order the reflection and compression also act on the shift: the + 5 becomes −5/2." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `y = 5 log_{2}(x - 1) - 7` has domain `{x ∈ ℝ | x > 1}`?", options:[
          { t:"A log only accepts positive inputs, and the input here is `x - 1`, so `x - 1 > 0` and `x > 1`. The 5 and the −7 act on the output after the log is taken, so they can’t change which `x`-values are allowed.", ok:true, why:"This names what decides the domain and why the other numbers don’t matter." },
          { t:"`a = 5` is positive, so the graph is not reflected and stays on the right of its wall `x = 1`. If `a` were negative, the reflection would carry the graph across the wall, and the domain would become `{x ∈ ℝ | x < 1}`.", why:"A negative `a` reflects in the `x`-axis, which changes heights, not `x`-values. The domain would still be `x > 1`." },
          { t:"The input `x - 1` must be positive, so `x > 1`. In the same way, the −7 shifts the graph down 7, which limits the outputs instead: the range is `{y ∈ ℝ | y > -7}`, so the graph stays above that line.", why:"The first sentence is right, but the second isn’t. The range of every log graph is all real numbers: as `x → 1⁺`, `y → -∞`, far below −7." },
          { t:"The vertical asymptote is `x = 1`, because the inside `x - 1` is 0 there. A graph can never touch its vertical asymptote, so `x = 1` is left out of the domain, and that leaves `{x ∈ ℝ | x > 1}`.", why:"This explains why `x = 1` is left out, but not why `x = 0` is. For `y = 1/(x - 1)`, `x = 0` is allowed. A log has no values on one whole side of its wall: at `x = 0` the inside is −1." }] },
        b:{ prompt:"Which is the best explanation of why `y = -3 log(x + 4) + 2` has domain `{x ∈ ℝ | x > -4}`, even though `a` is negative?", options:[
          { t:"A log only accepts positive inputs, and the input here is `x + 4`, so `x + 4 > 0` and `x > -4`. The −3 and the 2 act on the output after the log is taken, so they can’t change which `x`-values are allowed.", ok:true, why:"This names what decides the domain and why `a` doesn’t matter." },
          { t:"A negative `a` reflects the graph in the `y`-axis, which would put it on the left of the wall. But the + 4 inside moves it back to the right, so the domain is still `{x ∈ ℝ | x > -4}`.", why:"A negative `a` reflects in the `x`-axis, not the `y`-axis, so there is nothing to move back." },
          { t:"The input `x + 4` must be positive, so `x > -4`. In the same way, the + 2 and the reflection limit the outputs instead: the range is `{y ∈ ℝ | y < 2}`, so the graph stays below that line.", why:"The first sentence is right, but the second isn’t. The range of every log graph is all real numbers: as `x → -4⁺`, `y → ∞`, far above 2." },
          { t:"The vertical asymptote is `x = -4`, because the inside `x + 4` is 0 there. A graph can never touch its vertical asymptote, so `x = -4` is left out of the domain, and that leaves `{x ∈ ℝ | x > -4}`.", why:"This explains why `x = -4` is left out, but not why `x = -5` is. For `y = 1/(x + 4)`, `x = -5` is allowed. A log has no values on one whole side of its wall: at `x = -5` the inside is −1." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A seedling’s height `h`, in centimetres, `t` weeks after it is planted is modelled by `h = 6 log_{2}(t + 1) + 4`. After how many weeks is it 22 cm tall?", options:[
          { t:"7", ok:true, why:"`6 log_{2}(t + 1) = 18`, so `log_{2}(t + 1) = 3` and `t + 1 = 2^3 = 8`: `t = 7`. In mapping terms, (8, 3) on `y = log_{2} x` maps to (8 − 1, 6(3) + 4) = (7, 22)." },
          { t:"3", why:"3 is the value of `log_{2}(t + 1)`, not `t`. Undo the log: `t + 1 = 2^3`." },
          { t:"5", why:"`2^3` is 2 × 2 × 2 = 8, not 2 × 3 = 6." },
          { t:"8", why:"`t + 1 = 8`, so `t = 7`. The + 1 inside shifts the graph 1 unit left." }] },
        b:{ prompt:"A fish’s length `L`, in centimetres, `t` months after it hatches is modelled by `L = 5 log_{3}(t + 1) + 2`. After how many months is it 12 cm long?", options:[
          { t:"8", ok:true, why:"`5 log_{3}(t + 1) = 10`, so `log_{3}(t + 1) = 2` and `t + 1 = 3^2 = 9`: `t = 8`. In mapping terms, (9, 2) on `y = log_{3} x` maps to (9 − 1, 5(2) + 2) = (8, 12)." },
          { t:"2", why:"2 is the value of `log_{3}(t + 1)`, not `t`. Undo the log: `t + 1 = 3^2`." },
          { t:"5", why:"`3^2` is 3 × 3 = 9, not 3 × 2 = 6." },
          { t:"9", why:"`t + 1 = 9`, so `t = 8`. The + 1 inside shifts the graph 1 unit left." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"`f(x) = 2^{x - 3} + 1`. The inverse of `f` is a transformed log function. What is the vertical asymptote of the graph of the inverse?", options:[
          { t:"`x = 1`", ok:true, why:"`f` has horizontal asymptote `y = 1`. Reflecting in `y = x` swaps the coordinates, so the inverse has the vertical asymptote `x = 1`. Algebra agrees: `x = 2^{y - 3} + 1` gives `y = log_{2}(x - 1) + 3`." },
          { t:"`x = 3`", why:"The 3 is `f`’s horizontal shift. After the swap it becomes the inverse’s vertical shift: `y = log_{2}(x - 1) + 3`." },
          { t:"`y = 1`", why:"That’s `f`’s asymptote. Reflecting in `y = x` turns a horizontal line into a vertical one." },
          { t:"`x = -1`", why:"Sign slip: the inverse is `log_{2}(x - 1) + 3`, whose inside is 0 at `x = 1`." }] },
        b:{ prompt:"`g(x) = 3^{x + 2} - 4`. The inverse of `g` is a transformed log function. What is the vertical asymptote of the graph of the inverse?", options:[
          { t:"`x = -4`", ok:true, why:"`g` has horizontal asymptote `y = -4`. Reflecting in `y = x` makes it the vertical asymptote `x = -4`. Algebra agrees: `x = 3^{y + 2} - 4` gives `y = log_{3}(x + 4) - 2`." },
          { t:"`x = -2`", why:"The −2 comes from `g`’s horizontal shift. After the swap it becomes the inverse’s vertical shift: `y = log_{3}(x + 4) - 2`." },
          { t:"`y = -4`", why:"That’s `g`’s asymptote. Reflecting in `y = x` turns a horizontal line into a vertical one." },
          { t:"`x = 4`", why:"Sign slip: the inverse is `log_{3}(x + 4) - 2`, whose inside is 0 at `x = -4`." }] } }
    ]
  },
  task:{
    title:"Rising to the wall", summary:"Rising to the wall",
    statement:"<p>Design a function " + FORM + " whose graph:</p><ul><li>has domain `{x ∈ ℝ | x < 4}`;</li><li>passes through (3, 2);</li><li>is increasing on its whole domain;</li><li>crosses the `x`-axis at an integer from −10 to 10.</li></ul><p>There’s more than one answer. Can you find them all?</p>",
    checks:["Domain `{x ∈ ℝ | x < 4}`", "Passes through (3, 2)", "Increasing on its whole domain", "Crosses the `x`-axis at an integer from −10 to 10"],
    tips:["The domain `x < 4` fixes two things: where the wall is (`d`) and which side the graph is on (the sign of `k`).",
      "At `x = 3` your graph is at {yv}.",
      "Your graph falls as `x` increases. With `k` negative, the inside shrinks as `x` moves right, so the log falls. A negative `a` turns that fall into a rise.",
      "Your graph crosses the `x`-axis at `x ≈` {v}. With `k = -1` and `c = 2` you need `a log_{b}(4 - x) = -2`, so `4 - x` must be `b^{-2/a}`. Which choices of `a` and `b` make that a whole number?"],
    tip2out:"`x = 3` isn’t in your domain yet. Fix line 1 first.",
    tip2more:"3 is one unit left of the wall. With `k = -1` the inside there is 1, and `log_{b} 1 = 0`, so the height at `x = 3` is just `c`.",
    noCross:"Your graph doesn’t cross the `x`-axis inside the window you can reach with these numbers.",
    far:"far off the screen, beyond 10 000 units from the wall",
    same:"Same function as one you already found.",
    allFive:"You found all five. Every answer is `y = a log_{b}(4 - x) + 2` with `a` negative. The point (3, 2) is one unit from the wall, where the log is 0, so it pins the height at 2. The `x`-intercept is where `a log_{b}(4 - x) = -2`. Other choices also give integers, such as −12 (base 2, `a = -1/2`) and −96 (base 10, `a = -1`), but they are outside −10 to 10.",
    explainPrompt:"Explain why `a` has to be negative in every answer.",
    vocab:"Use the words domain, wall, reflection and increasing.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Key points of `y = log_{b} x`", "`(1/b, -1)`, (1, 0), `(b, 1)`, `(b^2, 2)`. Base 2: (1/2, −1), (1, 0), (2, 1), (4, 2). Wall `x = 0`, domain `x > 0`."],
    [FORM_INK, "`a`: vertical stretch or compression (reflection in the `x`-axis if `a < 0`). `k`: horizontal compression or stretch by a factor of `1/|k|` (reflection in the `y`-axis if `k < 0`). `d`: left or right. `c`: up or down."],
    ["The vertical asymptote", "`x = d`, where the inside `k(x - d)` is 0. Only `d` moves it. Example: `y = 4 log(x + 6) - 3` has `x = -6`."],
    ["The domain", "`k > 0`: `{x ∈ ℝ | x > d}`. `k < 0`: `{x ∈ ℝ | x < d}`. `a` and `c` never change it."],
    ["The range", "Always `{y ∈ ℝ}`. A log graph has no horizontal asymptote: it keeps rising or falling, slowly."],
    ["Factor first", "`log_{2}(2x - 8) = log_{2}[2(x - 4)]`: `d = 4`, not 8. `log_{2}(6 - 2x) = log_{2}[-2(x - 3)]`: wall `x = 3`, domain `x < 3`."],
    ["The mapping rule", RULE + ". Example: (2, 1) on `y = log_{2} x` → (5, 3) on `y = 2 log_{2}(x - 3) + 1`."],
    ["Increasing or decreasing?", "Increasing when `a` and `k` have the same sign; decreasing when their signs differ (for base `b > 1`)."],
    ["Next to the wall", "`y → -∞` when `a > 0`, `y → ∞` when `a < 0`. Example: `y = -log_{2}(x - 1)`: as `x → 1⁺`, `y → ∞`."],
    ["Stretch or shift?", "Multiplying the inside by a power of the base shifts the graph: `log_{2}(4x) = log_{2} x + 2`; `log_{3}(x/9) = log_{3} x - 2`."],
    ["`x`-intercept of a transformed log", "Set `y = 0` and undo the log: `k(x - d) = b^{-c/a}`. Example: `2 log_{2}(x - 3) - 2 = 0` gives `x - 3 = 2`, so `x = 5`."],
    ["Order of transformations", "Stretches, compressions and reflections first, then translations. Translating first stretches the shifts too."]
  ]
};
