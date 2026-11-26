// MCV4U 24 An Algorithm for Curve Sketching. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/24-algorithm-for-curve-sketching.md
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "`f` isn’t defined at an asymptote. It splits the sign chart but isn’t a critical point or inflection.";
const M2 = "An even-power factor doesn’t change sign. Test each interval.";
const M3 = "`f′ = 0` with no sign change is a flat point of inflection, not a max or min.";
const M4 = "`f` and `f + 5` have the same derivative. Without a point, the height isn’t fixed.";
const M5 = "Use both signs: `f′` says up or down, `f″` says how it bends.";
const M6 = "Zeros of `f′` are extrema of `f`. Extrema of `f′` are inflections of `f`.";
const M7 = "They can be on different branches, separated by an asymptote.";
const HERO_STEPS = ["Domain", "Intercepts", "Symmetry", "Asymptotes", "`f′`: rise and fall", "`f″`: bend", "Sketch"];

export default {
  id:"24-algorithm-for-curve-sketching",
  kind:"topic",
  title:"An algorithm for curve sketching",
  topic:"An Algorithm for Curve Sketching",
  readyTopic:"the curve-sketching algorithm",
  hero:{
    eq:'<span class="cs-heq">domain → intercepts → symmetry → asymptotes → `f′` → `f″` → <strong>sketch</strong></span>',
    eqLabel:"domain, then intercepts, then symmetry, then asymptotes, then f prime, then f double prime, then sketch",
    eqSize:"sm",
    headline:"Seven questions, one picture",
    text:"You’ve learned to read a function’s <strong>intercepts</strong>, <strong>asymptotes</strong>, <strong>critical points</strong> and <strong>concavity</strong> one at a time. Put them together in order and the graph almost draws itself: each step adds a feature, and the signs of `f′` and `f″` choose one of four <strong>shapes</strong> on every interval.",
    fig:{ html:'<div class="cs-hwrap"><ol class="cs-hlist" id="cs-hlist" aria-hidden="true">' + HERO_STEPS.map((s, i) => '<li data-hs="' + i + '"><span class="cs-hmk">' + (i + 1) + "</span><span>" + s + "</span></li>").join("") + "</ol>" +
      '<canvas class="plot" id="hero-plot" role="img" aria-label="The curve-sketching checklist builds the graph of f(x) = (x² + 3)/(x − 1) one feature at a time."></canvas></div>' },
    caps:["Start with empty axes.", "Domain: every `x` except 1.", "`y`-intercept (0, −3); no `x`-intercepts.", "No symmetry.", "Asymptotes `x = 1` and `y = x + 1`.", "`f′`: ↗ ↘ ↘ ↗, a max at (−1, −2) and a min at (3, 6).", "`f″`: ∩ ∩ ∪ ∪.", "The curve joins the evidence: `f(x) = {x^2 + 3}/{x - 1}`."]
  },
  goals:[
    "I can carry out each step of the curve-sketching algorithm (domain, intercepts, symmetry, asymptotes).",
    "I can use symmetry and end behaviour to check and shorten my work.",
    "I can choose the correct shape on each interval from the signs of `f′` and `f″`.",
    "I can sketch a polynomial with all its key features labelled.",
    "I can sketch a rational function with asymptotes, extrema and concavity.",
    "I can sketch possible graphs from derivative information and explain why infinitely many graphs fit."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Symmetry", goal:2, prompt:"Which function is even?",
          options:[
            { t:"`f(x) = x^4 - 3x^2`", ok:true, why:"`f(-x) = f(x)`: only even powers." },
            { t:"`f(x) = x^3 + x`", why:"`f(-x) = -f(x)`: odd." },
            { t:"`f(x) = x^2 + x`", why:"`f(-x) = x^2 - x`: neither." },
            { t:"`f(x) = (x - 1)^2`", why:"`f(-x) = (-x - 1)^2 = (x + 1)^2 ≠ f(x)`." }],
          hints:["Replace `x` with `-x`.", "Even powers don’t change sign.", "`x^4 - 3x^2`."] },
        { id:"w2", skill:"Symmetry", goal:2, prompt:"`f` is odd and has a local max at (2, 5). What else must be true?",
          options:[
            { t:"`f` has a local min at (−2, −5)", ok:true, why:"Odd: rotate 180° about the origin." },
            { t:"A local max at (−2, 5)", why:"That’s a reflection in the `y`-axis." },
            { t:"A local min at (−2, 5)", why:"Rotating changes the `y`-sign too." },
            { t:"A local max at (2, −5)", why:"The point (2, 5) is given." }],
          hints:["Odd means `f(-x) = -f(x)`.", "(2, 5) maps to (−2, −5).", "A peak becomes a valley."] },
        { id:"w3", skill:"Asymptotes", goal:1, prompt:"Asymptotes of `f(x) = {2x^2 + 1}/{x^2 - 9}`?",
          options:[
            { t:"VA `x = ±3`; HA `y = 2`", ok:true, why:"Equal degrees: 2/1." },
            { t:"VA `x = 3` only; HA `y = 2`", why:"`x^2 = 9` has two roots." },
            { t:"VA `x = ±3`; HA `y = 0`", why:"Equal degrees give the ratio of leading coefficients." },
            { t:"VA `x = ±3`; OA `y = 2x`", why:"The degrees are equal: no oblique asymptote." }],
          hints:["Where is the denominator 0?", "`x = ±3`; the numerator isn’t 0 there.", "Equal degrees: `y = 2`."] },
        { id:"w4", skill:"Asymptotes", goal:1, prompt:"Oblique asymptote of `{x^2 + 3}/{x - 1}`?",
          options:[
            { t:"`y = x + 1`", ok:true, why:"`x^2 + 3 = (x - 1)(x + 1) + 4`." },
            { t:"`y = x`", why:"Divide fully." },
            { t:"`y = x + 5`", why:"The remainder isn’t part of the line." },
            { t:"`y = x - 1`", why:"That’s the denominator." }],
          hints:["Divide `x^2 + 3` by `x - 1`.", "Quotient `x + 1`, remainder 4.", "`y = x + 1`."] },
        { id:"w5", skill:"Reading signs", goal:3, prompt:"On an interval, `f′ < 0` and `f″ > 0`. Which shape?",
          options:[
            { t:"Falling and concave up (↘∪)", ok:true, why:"Going down, bending up: like the left side of a valley." },
            { t:"Falling and concave down", why:"`f″ > 0` means concave up." },
            { t:"Rising and concave up", why:"`f′ < 0` means falling." },
            { t:"Rising and concave down", why:"Both signs are reversed." }],
          hints:["`f′ < 0`: up or down?", "Down. `f″ > 0`: which way does it bend?", "Falling, concave up."] },
        { id:"w6", skill:"Reading signs", goal:3, prompt:"`f′` goes from + to −, and `f″ < 0` there. What does `f` have?",
          options:[
            { t:"A local maximum", ok:true, why:"Rising then falling, concave down." },
            { t:"A local minimum", why:"+ to − is a peak." },
            { t:"A point of inflection", why:"`f″` doesn’t change sign." },
            { t:"A vertical asymptote", why:"Nothing says `f` is undefined." }],
          hints:["+ to − in `f′`.", "Rising then falling.", "A local max."] }
      ],
      refreshers:{
        "Symmetry":"Even: `f(-x) = f(x)`, mirror in the `y`-axis. Odd: `f(-x) = -f(x)`, rotate 180° about the origin.",
        "Asymptotes":"Vertical: denominator 0 after cancelling. Horizontal: compare degrees. Oblique: divide.",
        "Reading signs":"`f′` gives the direction (↗ ↘); `f″` gives the bend (∪ ∩). Together they choose one of four shapes."
      }
    }
  },
  explore:{
    heading:"Sketch assembler",
    intro:"Work through the checklist. Every step you complete adds features to the graph. Then choose the shape on each interval and compare your sketch with the true curve.",
    modes:[{ id:"guided", t:"Guided" }, { id:"free", t:"Free" }, { id:"sketch", t:"Sketch" }],
    modeHow:{
      guided:"The checklist steps unlock in order. A right answer adds its features to the graph. Step 7 is your sketch.",
      free:"Do the steps in any order. You can place points and choose shapes at any time.",
      sketch:"Place the key points and choose a shape for each interval. Then press <strong>Compare</strong> to overlay the true curve."
    },
    showTrue:"Show true graph",
    key:"Your sketch: blue, dashed until you compare. True graph: thin dark line. Asymptotes: grey dashes. The band on the `x`-axis is the domain.",
    strip:{ e1:"↗ ↘ appear after the f′ step", e2:"∪ ∩ appear after the f″ step" },
    skLocked:"The sketch tools open at step 7 of the checklist.",
    steps:[
      { id:"dom", t:"Domain", q:"Domain?" },
      { id:"int", t:"Intercepts", q:"`y`-intercept? `x`-intercepts?" },
      { id:"sym", t:"Symmetry", q:"Even, odd or neither?" },
      { id:"asy", t:"Asymptotes", q:"Vertical asymptotes and end behaviour?" },
      { id:"d1", t:"`f′`", q:"Critical numbers? Then the sign of `f′` on each interval." },
      { id:"d2", t:"`f″`", q:"Sign of `f″` on each interval? Points of inflection?" },
      { id:"sk", t:"Sketch", q:"Place the key points and choose the shape on each interval (under the graph). Then press <strong>Compare</strong>." }
    ],
    labels:{ y:"`y`-intercept, `f(0)` =", x:"`x`-intercepts (type “none” if there aren’t any)", crit:"Critical numbers (type “none” if there aren’t any)",
      infl:"Points of inflection at `x` = (type “none” if there aren’t any)", sg1:"Sign of `f′`: tap each cell to choose + or −.", sg2:"Sign of `f″`: tap each cell to choose + or −.",
      check:"Check", locked:"Finish the steps above it first.", next:"Next step", sym:["Even", "Odd", "Neither"] },
    badge:{ even:"Even: mirror in the `y`-axis", odd:"Odd: rotate 180°", neither:"Neither: no symmetry" },
    stepMsg:{
      ok:"✓ Right. Its features are on the graph.",
      va:M1,
      pick:"Choose an answer first.",
      blank:"Fill in every box first.",
      bad:"That isn’t a number list. Type numbers separated by commas (√ and ± are fine), or “none”.",
      cells:"Choose a sign in every cell first.",
      critMiss:"A critical number is missing. Set each factor of the numerator of `f′` to 0.",
      critExtra:"`f′` isn’t 0 at {x}, and it’s defined there.",
      cellBad:"A sign doesn’t match: test one value in each interval marked ✗.",
      inflBad:"Points of inflection are where `f″` changes sign and `f` is defined.",
      skDone:"✓ Your sketch matches the true graph on every interval."
    },
    rows:{ domain:"Domain", ints:"Intercepts", sym:"Symmetry", asym:"Asymptotes", d1:"`f′`", d2:"`f″`", keys:"Key points", shapes:"Shapes" },
    sketch:{
      how:"Tap the graph to place a point (it snaps to 0.25 units), drag a point to move it, or type its coordinates. A selected point moves with the arrow keys; Delete removes it.",
      add:"Add point", clear:"Clear sketch", compare:"Compare", uncompare:"Hide the comparison", none:"No points yet.",
      shapesHead:"Shape on each interval", unset:"not chosen",
      words:{ uU:"rising, concave up", uN:"rising, concave down", dU:"falling, concave up", dN:"falling, concave down" },
      gaugeHead:"Match gauge, interval by interval", match:"✓ shape matches", miss:"✗ true shape {s}", pts:"Key points within 0.15: {n} of {t}.",
      far:"Typed points must have `x` from −10 to 10 and `y` from −60 to 60.", bad:"Type one number in each box (fractions and √ are fine).", full:"That’s 12 points already. Remove one first."
    },
    fns:[
      { id:"S1", chip:"S1 `x^4 - 8x^2 + 7`", eq:"`f(x) = x^4 - 8x^2 + 7`", d1:"`f′(x) = 4x^3 - 16x = 4x(x - 2)(x + 2)`", d2:"`f″(x) = 12x^2 - 16 = 4(3x^2 - 4)`",
        dom:[
          { t:"ℝ", ok:true, why:"A polynomial is defined for every `x`." },
          { t:"`{x ∈ ℝ | x ≠ ±1}`", why:"±1 are `x`-intercepts, not gaps: `f(1) = 0`." },
          { t:"`{x ∈ ℝ | x ≥ 0}`", why:"Negative `x`-values work too: `f(-1) = 0`." },
          { t:"`{x ∈ ℝ | x ≠ 0}`", why:"`f(0) = 7`: `x = 0` is in the domain." }],
        asy:[
          { t:"None: a polynomial has no asymptotes", ok:true, why:"`x^4` dominates: `f` grows without bound at both ends." },
          { t:"VA `x = ±1`", why:"`f(±1) = 0`: those are intercepts." },
          { t:"HA `y = 7`", why:"7 is the `y`-intercept; `x^4` grows without bound." },
          { t:"HA `y = 0`", why:"`x^4` dominates: `f` grows without bound at both ends." }],
        fb:{ y:"`f(0) = 0 - 0 + 7 = 7`.", x:"Factor: `(x^2 - 1)(x^2 - 7) = 0`.", x7:"`x^4 - 8x^2 + 7 = (x^2 - 1)(x^2 - 7)`: `x^2 = 7` gives `±√7 ≈ ±2.65`.",
          sym:"`f(-x) = (-x)^4 - 8(-x)^2 + 7 = f(x)`: only even powers.", crit:"`4x(x - 2)(x + 2) = 0` at −2, 0 and 2.",
          sg1:"Test one value in each interval marked ✗: for example `f′(-3) = 4(-3)(-5)(-1) < 0`.", sg2:"`3x^2 - 4` is negative between `±2/√3` and positive outside.", infl:"`f″` changes sign at `x = ±2/√3`." },
        read:{ domain:"ℝ", ints:"`y`-int (0, 7); `x`-ints ±1, `±√7 ≈ ±2.65`", sym:"even: mirror in the `y`-axis", asym:"none (a polynomial)",
          d1:"`4x(x - 2)(x + 2)`: − | + | − | +. Critical numbers −2, 0, 2", d2:"`4(3x^2 - 4)`: + | − | +. Inflections at `x = ±2/√3 ≈ ±1.15`",
          keys:"max (0, 7), mins (±2, −9), inflections (`±2/√3`, `-17/9`)", shapes:"(−∞, −2) ↘∪ · (−2, `-2/√3`) ↗∪ · (`-2/√3`, 0) ↗∩ · (0, `2/√3`) ↘∩ · (`2/√3`, 2) ↘∪ · (2, ∞) ↗∪" } },
      { id:"S2", chip:"S2 `{x^2}/{x^2 - 4}`", eq:"`f(x) = {x^2}/{x^2 - 4}`", d1:"`f′(x) = {-8x}/{(x^2 - 4)^2}`", d2:"`f″(x) = {8(3x^2 + 4)}/{(x^2 - 4)^3}`",
        dom:[
          { t:"`{x ∈ ℝ | x ≠ ±2}`", ok:true, why:"`x^2 - 4 = 0` at `x = ±2`." },
          { t:"`{x ∈ ℝ | x ≠ 2}`", why:"`x^2 = 4` has two roots: ±2." },
          { t:"ℝ", why:"The denominator is 0 at ±2." },
          { t:"`{x ∈ ℝ | x ≠ 0}`", why:"`f(0) = 0`: the numerator can be 0." }],
        asy:[
          { t:"VA `x = ±2`; HA `y = 1`", ok:true, why:"Equal degrees: 1/1." },
          { t:"VA `x = ±2`; HA `y = 0`", why:"Equal degrees give the ratio of leading coefficients." },
          { t:"VA `x = 2` only; HA `y = 1`", why:"`x^2 = 4` has two roots." },
          { t:"VA `x = ±2`; no end asymptote", why:"Equal degrees: HA `y = 1`." }],
        fb:{ y:"`f(0) = 0/(-4) = 0`.", x:"The numerator `x^2` is 0 only at 0.", sym:"`f(-x) = {(-x)^2}/{(-x)^2 - 4} = f(x)`.", crit:"Only `x = 0`: `f′(0) = 0`.",
          sg1:"The denominator is a square: the sign of `f′` is the sign of `-8x`.", sg2:"The sign of `f″` is the sign of `(x^2 - 4)^3`: negative only between −2 and 2.",
          infl:"`f″` changes sign only at ±2, which aren’t in the domain: no points of inflection." },
        read:{ domain:"`{x ∈ ℝ | x ≠ ±2}`", ints:"(0, 0) is both intercepts", sym:"even: mirror in the `y`-axis", asym:"VA `x = ±2`; HA `y = 1`",
          d1:"`{-8x}/{(x^2 - 4)^2}`: + | + | − | −. Critical number 0; ±2 not in the domain", d2:"`{8(3x^2 + 4)}/{(x^2 - 4)^3}`: + | − | +. No inflection: ±2 not in the domain",
          keys:"max (0, 0)", shapes:"(−∞, −2) ↗∪ · (−2, 0) ↗∩ · (0, 2) ↘∩ · (2, ∞) ↘∪" } },
      { id:"S3", chip:"S3 `{x^2 + 3}/{x - 1}`", eq:"`f(x) = {x^2 + 3}/{x - 1}`", d1:"`f′(x) = {(x - 3)(x + 1)}/{(x - 1)^2}`", d2:"`f″(x) = 8/(x - 1)^3`",
        dom:[
          { t:"`{x ∈ ℝ | x ≠ 1}`", ok:true, why:"`x - 1 = 0` at `x = 1`." },
          { t:"ℝ", why:"Division by 0 at `x = 1`." },
          { t:"`{x ∈ ℝ | x ≠ -1}`", why:"Set the denominator, `x - 1`, to 0." },
          { t:"`{x ∈ ℝ | x ≠ ±√3}`", why:"`x^2 + 3` is never 0; the denominator decides." }],
        asy:[
          { t:"VA `x = 1`; OA `y = x + 1`", ok:true, why:"`x^2 + 3 = (x - 1)(x + 1) + 4`." },
          { t:"VA `x = 1`; HA `y = 1`", why:"The top’s degree is one more: oblique." },
          { t:"VA `x = 1`; OA `y = x`", why:"Divide fully: the quotient is `x + 1`." },
          { t:"VA `x = 1`; OA `y = x + 5`", why:"The remainder isn’t part of the line." }],
        fb:{ y:"`f(0) = 3/(-1) = -3`.", x:"`x^2 + 3 = 0` has no real roots: no `x`-intercepts.", sym:"`f(-x) = {x^2 + 3}/{-x - 1}`, which is neither `f(x)` nor `-f(x)`.",
          crit:"`(x - 3)(x + 1) = 0` at −1 and 3.", sg1:"The denominator `(x - 1)^2` is positive: test the numerator `(x - 3)(x + 1)`.",
          sg2:"`f″ = 8/(x - 1)^3`: negative for `x < 1`, positive for `x > 1`.", infl:"No inflection: 1 is not in the domain." },
        read:{ domain:"`{x ∈ ℝ | x ≠ 1}`", ints:"`y`-int (0, −3); no `x`-intercepts: `x^2 + 3 = 0` has no real roots", sym:"neither", asym:"VA `x = 1`; OA `y = x + 1`",
          d1:"`{(x - 3)(x + 1)}/{(x - 1)^2}`: + | − | − | +. Critical numbers −1, 3; 1 not in the domain", d2:"`8/(x - 1)^3`: − | +. No inflection: 1 not in the domain",
          keys:"max (−1, −2), min (3, 6)", shapes:"(−∞, −1) ↗∩ · (−1, 1) ↘∩ · (1, 3) ↘∪ · (3, ∞) ↗∪" } },
      { id:"S4", chip:"S4 `x(x - 4)^3`", eq:"`f(x) = x(x - 4)^3`", d1:"`f′(x) = 4(x - 1)(x - 4)^2`", d2:"`f″(x) = 12(x - 2)(x - 4)`",
        dom:[
          { t:"ℝ", ok:true, why:"A polynomial is defined for every `x`." },
          { t:"`{x ∈ ℝ | x ≠ 4}`", why:"`f(4) = 0`: 4 is an intercept, not a gap." },
          { t:"`{x ∈ ℝ | x ≥ 0}`", why:"Negative `x`-values work: `f(-1) = 125`." },
          { t:"`{x ∈ ℝ | x ≠ 0, 4}`", why:"Those are zeros of `f`, not gaps." }],
        asy:[
          { t:"None: a polynomial has no asymptotes", ok:true, why:"Degree 4: `f` grows without bound at both ends." },
          { t:"VA `x = 4`", why:"`f(4) = 0`, a zero." },
          { t:"HA `y = 0`", why:"Degree 4: `f` grows without bound." },
          { t:"VA `x = 0`", why:"`f(0) = 0`: it’s an intercept." }],
        fb:{ y:"`f(0) = 0 · (-4)^3 = 0`.", x:"`x(x - 4)^3 = 0` at 0 and 4.", sym:"`f(-x) = -x(-x - 4)^3 = x(x + 4)^3`: neither.", crit:"`4(x - 1)(x - 4)^2 = 0` at 1 and 4.",
          sg1:M2, sg2:"`12(x - 2)(x - 4)`: + | − | +.", infl:"`f″` changes sign at 2 and at 4.", infl1:"`x = 1` is where `f′ = 0` (the minimum), not where `f″` changes sign." },
        read:{ domain:"ℝ", ints:"(0, 0) and (4, 0); `y`-int (0, 0)", sym:"neither", asym:"none (a polynomial)",
          d1:"`4(x - 1)(x - 4)^2`: − | + | +. Critical numbers 1, 4", d2:"`12(x - 2)(x - 4)`: + | − | +. Inflections at 2 and 4",
          keys:"min (1, −27); inflections (2, −16) and (4, 0) (flat)", shapes:"(−∞, 1) ↘∪ · (1, 2) ↗∪ · (2, 4) ↗∩ · (4, ∞) ↗∪" } }
    ],
    cmsg:{
      fn:"Choose {fn} first.",
      miss:"Not every point the challenge asks for is placed yet (each within 0.15 of the true point).",
      extra:"{pt} isn’t a key point of this graph. Remove it, or move it onto one.",
      unset:"Choose a shape on every interval.",
      shape:"The shape on {iv} doesn’t match the signs of `f′` and `f″` there."
    },
    predIntro:"Make a prediction first. Then the assembler shows you what really happens.",
    predictions:[
      { id:"p1", fn:"S2", prompt:"S2, `f(x) = {x^2}/{x^2 - 4}`. Before any calculus: what symmetry does the graph have?",
        options:[{ t:"Even: a mirror image in the `y`-axis", ok:true }, { t:"Odd" }, { t:"Neither" }, { t:"Both even and odd" }],
        explain:"`f(-x) = {(-x)^2}/{(-x)^2 - 4} = f(x)`. Do the right half; reflect it." },
      { id:"p2", fn:"S2", prompt:"S2. `f′(x) = {-8x}/{(x^2 - 4)^2}`. How many local extrema does `f` have?",
        options:[{ t:"1: a local max at (0, 0)", ok:true }, { t:"3: at `x = -2`, 0, 2" }, { t:"0" }, { t:"2: at `x = ±2`" }],
        explain:"`x = ±2` aren’t in the domain. Only `x = 0` is critical, where `f′` goes + to −." },
      { id:"p3", fn:"S3", prompt:"S3, `f(x) = {x^2 + 3}/{x - 1}`. The local max is (−1, −2) and the local min is (3, 6). Is that possible?",
        options:[{ t:"Yes: they’re on different branches, separated by the asymptote `x = 1`", ok:true }, { t:"No: a max must be higher than a min" }, { t:"Only if one is a point of inflection" }, { t:"No: they must be reversed" }],
        explain:"Local means compared with nearby points. The left branch never gets above −2; the right branch never drops below 6." },
      { id:"p4", fn:"S4", prompt:"S4, `f(x) = x(x - 4)^3`. `f′(4) = 0`. Will the sketch show a turning point at `x = 4`?",
        options:[{ t:"No: it flattens for a moment and keeps rising", ok:true }, { t:"Yes: a local max" }, { t:"Yes: a local min" }, { t:"No: it’s a cusp" }],
        explain:"`f′ = 4(x - 1)(x - 4)^2`: `(x - 4)^2` doesn’t change sign. Since `f″` changes sign at 4, it’s a flat point of inflection." }
    ],
    challenges:[
      { id:"tc1", goal:[3, 4], fn:"S1", prompt:"Guided mode on S1: place the three local extrema and the four `x`-intercepts, then choose the shapes.",
        msgs:{ i7:"`x^4 - 8x^2 + 7 = (x^2 - 1)(x^2 - 7)`: `x^2 = 7` gives `±√7 ≈ ±2.65`.", one:"`f″ = 4(3x^2 - 4)` changes sign at `-2/√3`: the bend switches inside that interval." },
        hints:["Even function: find everything for `x ≥ 0` and mirror it.", "`f′ = 4x(x - 2)(x + 2)`; `f″ = 4(3x^2 - 4)`, zero at `±2/√3 ≈ ±1.15`.", "Max (0, 7), mins (±2, −9), inflections (`±2/√3`, `-17/9`), intercepts ±1 and `±√7`."] },
      { id:"tc2", goal:[3, 5], fn:"S3", prompt:"Sketch mode on S3: choose the shape on each of the four intervals.",
        msgs:{ a:"`f″ = 8/(x - 1)^3 < 0` for `x < 1`: concave down.", b:"`f′ < 0` on (1, 3): falling." },
        hints:["Use the two sign rows.", "`f′`: + | − | − | +. `f″`: − (left of 1) | + (right of 1).", "↗∩, ↘∩, ↘∪, ↗∪."] },
      { id:"tc3", goal:[3, 4], fn:"S4", stretch:true, prompt:"Free mode on S4: build the complete sketch. Place the local min, both points of inflection and both intercepts, then choose shapes on (−∞, 1), (1, 2), (2, 4) and (4, ∞).",
        msgs:{ flat:"`f′ ≥ 0` on both sides of 4.", b12:"`f″ = 12(x - 4)(x - 2) > 0` for `x < 2`.", i1:"`x = 1` is where `f′ = 0` (the minimum), not where `f″` changes sign." },
        hints:["`f′ = 4(x - 1)(x - 4)^2`, `f″ = 12(x - 2)(x - 4)`.", "`f′`: − | + | + (signs change only at 1). `f″`: + | − | + (changes at 2 and 4).", "Min (1, −27); inflections (2, −16) and (4, 0); shapes ↘∪, ↗∪, ↗∩, ↗∪."] }
    ]
  },
  part3:{
    slug:"clues", name:"Clues", heading:"From clues to curve",
    intro:"Now the algorithm runs backwards. You get derivative information instead of an equation, and you sketch graphs that <em>could</em> fit. You’ll see why there are infinitely many.",
    s1:{ title:"Station 1: two possible sketches",
      clues:"`f′ < 0` on (−∞, 1), `f′ > 0` on (1, ∞); `f″ > 0` everywhere; <span class=\"cs-clue1\">`f(1) = -2`</span>.",
      text:"Build a sketch that fits every clue: place points and choose a shape on each side of 1. Then build a second, different one. The checker accepts any sketch that fits.",
      tabs:["Sketch 1", "Sketch 2"], check:"Check this sketch",
      fb:{ min:"Place the point the clue `f(1) = -2` gives: (1, −2).", more:"Add at least one more point, so the sketch shows how steep it is.", unset:"Choose a shape on each side of 1.",
        left:"`f′ < 0` and `f″ > 0` on (−∞, 1): falling and concave up, ↘∪.", right:"`f′ > 0` and `f″ > 0` on (1, ∞): rising and concave up, ↗∪.",
        dir:"Your points must fall toward (1, −2) from the left and rise after it: `f′` decides that.", bend:"With `f″ > 0`, the slopes between neighbouring points must keep increasing. Somewhere your points bend the wrong way.",
        same:"That’s the same as sketch 1. Change the steepness: move or add a point.", ok1:"✓ Sketch 1 fits every clue. Now build a different one.", ok2:"✓ Both sketches fit. Two different graphs, the same clues." },
      shiftHead:"Now remove the clue `f(1) = -2`.", shift:"Vertical shift", shiftMsg:"Every height works: infinitely many graphs." },
    s2:{ title:"Station 2: from the graph of `f′` to `f`",
      text:"The graph shows `f′(x) = (x + 1)(x - 2)`, a parabola crossing at −1 and 2. Mark on the strip for `f` where `f` has its extrema and its point of inflection.",
      how:"Tap the strip (or use − and +) to move the marker, then tap what `f` has there. Tap again to remove a mark.",
      marks:{ max:"Local max here", min:"Local min here", infl:"Inflection here" }, check:"Check my marks",
      fb:{ missing:"Mark one local max, one local min and one point of inflection.", zeroInfl:"Zeros of `f′` are extrema of `f`.", vertexExt:"Extrema of `f′` are inflections of `f`.",
        swap:"`f′` goes + to − at −1: rising then falling is a peak. At 2 it goes − to +: a valley.", wrong:"Look at where `f′` crosses the axis and where it turns.",
        done:"✓ Right: a max at −1, a min at 2 and an inflection at `x = 1/2`, the vertex of `f′`." },
      algLines:["With the extra clue `f(0) = 0`: `f(x) = {x^3}/{3} - {x^2}/{2} - 2x`.", "Check: `f′(x) = x^2 - x - 2 = (x + 1)(x - 2)`.", "Max: `f(-1) = -{1}/{3} - {1}/{2} + 2 = {7}/{6}`, so (−1, `7/6`).", "Min: `f(2) = {8}/{3} - 2 - 4 = -{10}/{3}`, so (2, `-10/3`)."],
      origin:"Does this `f` pass through (0, 0)?", originYes:"`f(0) = 0 - 0 - 0 = 0` ✓ The sketch passes through (0, 0), so this is the graph from the family that the clue picks." },
    s3:{ title:"Station 3: equation ↔ sketch", text:"Match each equation to its sketch. Tap an equation, then tap the sketch it belongs to.",
      eqs:[
        { id:"a", t:"`y = x^3 - 3x^2`", desc:"rises to a peak at (0, 0), falls to a valley at (2, −4), then rises, crossing the x-axis at 3", clue:"`x^3 - 3x^2 = x^2(x - 3)`: end behaviour Q3 to Q1, touching the `x`-axis at 0 and crossing at 3." },
        { id:"b", t:"`y = -x^3 + 3x`", desc:"comes down from the upper left to a valley at (−1, −2), rises to a peak at (1, 2), then falls to the lower right", clue:"Odd, with end behaviour Q2 to Q4." },
        { id:"c", t:"`y = (x^2 - 1)^2`", desc:"a W shape that touches the x-axis at −1 and 1, with a peak at (0, 1)", clue:"Even and never negative: it touches at ±1." },
        { id:"d", t:"`y = {x}/{x^2 + 1}`", desc:"hugs the x-axis at both ends, with a valley at (−1, −1/2) and a peak at (1, 1/2)", clue:"Odd, with horizontal asymptote `y = 0`." }],
      sketchName:"Sketch", wrong:"Not a match. Look for the deciding clue: {clue}", right:"✓ Matched. {clue}", done:"✓ All four matched." },
    quickCheck:{ title:"Quick check", summary:"From clues to curve quick check",
      items:[
        { id:"q1", goal:3, prompt:"`f′ > 0` and `f″ < 0` on (0, 5). The shape there is…",
          choices:[{ t:"↗∩", ok:true, fb:"Right. Rising and bending down." }, { t:"↗∪", fb:"Rising and bending down." }, { t:"↘∩", fb:"Rising and bending down." }, { t:"↘∪", fb:"Rising and bending down." }] },
        { id:"q2", goal:3, prompt:"`f′ = (x - 3)^2`, `f″ = 2(x - 3)`. At `x = 3`, `f` has…",
          choices:[{ t:"a flat point of inflection", ok:true, fb:"Right. `f′ ≥ 0` on both sides; `f″` changes sign." }, { t:"a local min", fb:"`f′ ≥ 0` on both sides; `f″` changes sign." },
            { t:"a local max", fb:"`f′ ≥ 0` on both sides; `f″` changes sign." }, { t:"a vertical asymptote", fb:"`f′ ≥ 0` on both sides; `f″` changes sign." }] },
        { id:"q3", goal:6, prompt:"Given only the sign chart of `f′`, how many different graphs fit?",
          choices:[{ t:"Infinitely many", ok:true, fb:"Right. Any vertical shift has the same `f′`." }, { t:"Exactly one", fb:"Any vertical shift has the same `f′`." }, { t:"Two", fb:"Any vertical shift has the same `f′`." }, { t:"None", fb:"Any vertical shift has the same `f′`." }] },
        { id:"q4", goal:6, prompt:"The graph of `f′` has its minimum at `x = 4`. What does `f` have at `x = 4`?",
          choices:[{ t:"A point of inflection", ok:true, fb:"Right. Extrema of `f′` are inflections of `f`." }, { t:"A local minimum", fb:"Extrema of `f′` are inflections of `f`." },
            { t:"A local maximum", fb:"Extrema of `f′` are inflections of `f`." }, { t:"A vertical asymptote", fb:"Extrema of `f′` are inflections of `f`." }] }
      ] }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ feature summary", summary:"Function ↔ feature summary", goal:[1, 2, 3, 4, 5],
        instruction:"Match each function to its feature summary.", leftTitle:"Function", rightTitle:"Feature summary",
        left:[
          { id:"l1", t:"`x^3 - 3x`", goal:4 },
          { id:"l2", t:"`x^4 - 2x^2`", goal:4 },
          { id:"l3", t:"`{x^2}/{x^2 - 1}`", goal:5 },
          { id:"l4", t:"`{x}/{x^2 + 1}`", goal:5 },
          { id:"l5", t:"`{x^2 + 1}/{x}`", goal:5 },
          { id:"l6", t:"`x^3 + 3x`", goal:3 },
          { id:"l7", t:"`{1}/{x^2 + 1}`", goal:1 },
          { id:"l8", t:"`(x - 2)^2(x + 1)`", goal:4, hints:["Expand: `x^3 - 3x^2 + 4`.", "`f′ = 3x(x - 2)`; `f″ = 6x - 6`.", "Max (0, 4), min (2, 0), inflection (1, 2)."] }],
        right:[
          { id:"r1", t:"Odd; max (−1, 2), min (1, −2); inflection (0, 0)" },
          { id:"r2", t:"Even; max (0, 0), mins (±1, −1); inflections at `x = ±1/√3`" },
          { id:"r3", t:"Even; VA `x = ±1`; HA `y = 1`; max (0, 0)" },
          { id:"r4", t:"Odd; HA `y = 0`; max (1, `1/2`), min (−1, `-1/2`)" },
          { id:"r5", t:"Odd; VA `x = 0`; OA `y = x`; max (−1, −2), min (1, 2)" },
          { id:"r6", t:"Odd; always increasing; inflection (0, 0); no extrema" },
          { id:"r7", t:"Even; HA `y = 0`; max (0, 1); inflections at `x = ±1/√3`" },
          { id:"r8", t:"Max (0, 4), min (2, 0); inflection (1, 2)" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l7|r3":"`1/(x^2 + 1)` has no vertical asymptotes: `x^2 + 1` is never 0.", "l3|r7":"`1/(x^2 + 1)` has no vertical asymptotes: `x^2 + 1` is never 0.",
          "l1|r6":"`x^3 + 3x` has `f′ = 3x^2 + 3 > 0`: no turning points.", "l6|r1":"`x^3 + 3x` has `f′ = 3x^2 + 3 > 0`: no turning points.",
          "l2|r7":"Both have inflections at `±1/√3`, but `x^4 - 2x^2` has minimums at ±1.", "l7|r2":"Both have inflections at `±1/√3`, but `x^4 - 2x^2` has minimums at ±1." },
        wrongDefault:"Check one clue at a time: symmetry, asymptotes, then extrema." },
      { id:"full", type:"custom", title:"Full sketches", summary:"Full sketches", star:true, goal:[3, 4, 5],
        instruction:"Sketch each function: place every key point (within 0.15) and choose the shape on every interval.",
        how:"Tap the graph to place a point (it snaps to 0.25), drag it, or type its coordinates. Choose a shape under each interval, then press Check. Compare overlays the true curve.",
        items:[
          { id:"k1", goal:4, model:"K1", f:"`f(x) = 3x^4 - 4x^3`",
            solved:"Intercepts 0 and `4/3`; min (1, −1); inflections (0, 0) (flat) and (`2/3`, `-16/27`). Shapes: (−∞, 0) ↘∪ · (0, `2/3`) ↘∩ · (`2/3`, 1) ↘∪ · (1, ∞) ↗∪.",
            named:{ shape1dU:"`f″ = 12x(3x - 2) < 0` between 0 and `2/3`." },
            hints:["Factor: `f(x) = x^3(3x - 4)`, so the intercepts are 0 and `4/3`.", "`f′ = 12x^2(x - 1)`: − | − | + (no sign change at 0). `f″ = 12x(3x - 2)`: + | − | +.", "Min (1, −1); inflections (0, 0) (flat) and (`2/3`, `-16/27`); shapes ↘∪, ↘∩, ↘∪, ↗∪."] },
          { id:"k2", goal:5, model:"K2", f:"`f(x) = {x^2 - 4}/{x^2 - 1}`",
            solved:"Even; VA `x = ±1`; HA `y = 1`; intercepts (±2, 0), min (0, 4). Shapes: (−∞, −1) ↘∩ · (−1, 0) ↘∪ · (0, 1) ↗∪ · (1, ∞) ↗∩.",
            named:{ shape1u:"`f′ = 6x/(x^2 - 1)^2 < 0` for `x < 0`." },
            hints:["Even function: sketch `x ≥ 0` and reflect. VA `x = ±1`; HA `y = 1`.", "`f′ = 6x/(x^2 - 1)^2`: − | − | + | +. `f″ = -6(3x^2 + 1)/(x^2 - 1)^3`: − | + | −.", "Intercepts (±2, 0), min (0, 4); shapes ↘∩, ↘∪, ↗∪, ↗∩."] },
          { id:"k3", goal:5, model:"K3", star:true, f:"`f(x) = {x^2 - 2x + 4}/{x - 2}`",
            solved:"VA `x = 2`; OA `y = x`; max (0, −2), min (4, 6); no `x`-intercepts. Shapes: (−∞, 0) ↗∩ · (0, 2) ↘∩ · (2, 4) ↘∪ · (4, ∞) ↗∪.",
            named:{ xint:"`x^2 - 2x + 4` has discriminant −12: none." },
            hints:["Divide: `f(x) = x + 4/(x - 2)`, so OA `y = x` and VA `x = 2`.", "`f′ = 1 - 4/(x - 2)^2 = 0` at 0 and 4. `f″ = 8/(x - 2)^3`: − | +.", "Max (0, −2), min (4, 6); shapes ↗∩, ↘∩, ↘∪, ↗∪."] },
          { id:"k4", goal:5, model:"K4", star:true, f:"`f(x) = {x^3}/{x^2 - 3}`",
            solved:"Odd; VA `x = ±√3`; OA `y = x`; max (−3, `-9/2`), min (3, `9/2`); flat inflection (0, 0). Shapes: (−∞, −3) ↗∩ · (−3, `-√3`) ↘∩ · (`-√3`, 0) ↘∪ · (0, `√3`) ↘∩ · (`√3`, 3) ↘∪ · (3, ∞) ↗∪.",
            named:{ shape3u:"`f′ = x^2(x^2 - 9)/(x^2 - 3)^2 < 0` for `0 < |x| < 3`." },
            hints:["Odd function: sketch `x ≥ 0` and rotate.", "`f′ = x^2(x - 3)(x + 3)/(x^2 - 3)^2`: zero at 0 and ±3. `f″ = 6x(x^2 + 9)/(x^2 - 3)^3`.", "For `x > 0`: falls on (0, `√3`) concave down, falls on (`√3`, 3) concave up to the min (3, `9/2`), then rises toward `y = x`."] }
        ],
        msgs:{ miss:"Not every key point is there yet. Look for the intercepts, the local extrema and the points of inflection.", extra:"{pt} isn’t a key point of this function.",
          unset:"Choose a shape on every interval.", shape:"The shape on {iv} doesn’t match the signs of `f′` and `f″` there.", peek:"You compared before checking, so this one won’t count as first try." } },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Ximena", how:"", goal:[4, 5, 6],
        instruction:"Ximena made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Find the key features of `f(x) = {x^2}/{x^2 - 9}`.",
            steps:["Domain: `x ≠ ±3`. Intercept (0, 0). Even.", "HA `y = 1`; VA `x = ±3`.", "`f′(x) = {-18x}/{(x^2 - 9)^2}`.", "Critical numbers: `x = -3`, 0 and 3.", "`f′`: + | + | − | −, so a max at (0, 0)."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5’s signs are right."],
            fixes:[
              { t:"±3 aren’t in the domain; the only critical number is 0, a local max at (0, 0).", ok:true, why:"Only `x = 0` is critical." },
              { t:"The critical numbers are ±3 only.", why:"`f′(0) = 0`." },
              { t:"There are no critical numbers.", why:"`f′(0) = 0` and 0 is in the domain." },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["Is `f(3)` defined?", "No: it’s an asymptote.", "Only `x = 0` is critical."] },
          { id:"e2", goal:4, task:"Find where `f(x) = x^4 + 4x^3` increases and decreases.",
            steps:["`f′ = 4x^3 + 12x^2 = 4x^2(x + 3)`.", "Critical numbers: −3 and 0.", "Signs of `f′`: − on (−∞, −3), + on (−3, 0), − on (0, ∞).", "So a min at (−3, −27) and a max at (0, 0)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"`4x^2` doesn’t change sign at 0: `f′ > 0` on (0, ∞) too. `f` decreases on (−∞, −3) and increases on (−3, ∞); a min at (−3, −27) and a flat inflection at (0, 0).", ok:true, why:"`f′ > 0` on (0, ∞): no max at 0." },
              { t:"The signs are + | − | +.", why:"Test `x = -4`: `4(16)(-1) < 0`." },
              { t:"Only −3 is critical.", why:"`f′(0) = 0`." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Test `x = 1`.", "`4(1)(4) > 0`.", "`f′ > 0` on (0, ∞): no max at 0."] },
          { id:"e3", goal:6, task:"`f′ > 0` for `x < 2`, `f′ < 0` for `x > 2`, and `f(2) = 5`. Sketch `f`.",
            steps:["`f` increases to the left of 2 and decreases to the right.", "So `f` has a local max at (2, 5).", "So the graph must be the parabola `y = -(x - 2)^2 + 5`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Many graphs fit: any curve rising to (2, 5) and falling after it, such as `y = -2(x - 2)^2 + 5` or `y = -(x - 2)^4 + 5`. The clues don’t fix the shape.", ok:true, why:"Infinitely many graphs fit." },
              { t:"It must be `y = -|x - 2| + 5`.", why:"That’s one more possibility, not the only one." },
              { t:"The max is at (5, 2).", why:"`f(2) = 5` gives (2, 5)." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Do the clues say anything about concavity or steepness?", "No.", "Infinitely many graphs fit."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the sketch assembler: the max below the min, or the flat point that wasn’t a turning point?" },
      { id:"j2", q:"In your own words, why are four shapes enough to describe any interval between key points?" },
      { id:"j3", q:"Explain to a friend the order you’d use to sketch a rational function, and why that order saves work." },
      { id:"j4", q:"Which step of the algorithm do you most often get wrong? What will you check next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the domain of `f(x) = {x - 1}/{x^2 + 2x - 8}`?", options:[
          { t:"`{x ∈ ℝ | x ≠ -4, 2}`", ok:true, why:"`x^2 + 2x - 8 = (x + 4)(x - 2)`." },
          { t:"`{x ∈ ℝ | x ≠ 1}`", why:"1 is a zero of the numerator." },
          { t:"`{x ∈ ℝ | x ≠ 4, -2}`", why:"`(x + 4) = 0` at `x = -4`." },
          { t:"`{x ∈ ℝ | x ≠ -4, 1, 2}`", why:"The numerator being 0 is allowed." }] },
        b:{ prompt:"What is the domain of `f(x) = {x + 3}/{x^2 - x - 12}`?", options:[
          { t:"`{x ∈ ℝ | x ≠ 4, -3}`", ok:true, why:"`(x - 4)(x + 3)`." },
          { t:"`{x ∈ ℝ | x ≠ -3}`", why:"`x = 4` also makes the denominator 0." },
          { t:"`{x ∈ ℝ | x ≠ -4, 3}`", why:"Factor: `x^2 - x - 12 = (x - 4)(x + 3)`." },
          { t:"`{x ∈ ℝ}`", why:"−3 makes it undefined (a hole), even though it cancels." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which describes the symmetry of `f(x) = {x^3}/{x^2 + 1}`?", options:[
          { t:"Odd: rotating the graph 180° about the origin leaves it unchanged", ok:true, why:"`f(-x) = {-x^3}/{x^2 + 1} = -f(x)`." },
          { t:"Even: mirror image in the `y`-axis", why:"`f(-x) ≠ f(x)`." },
          { t:"Neither", why:"Check `f(-x)`." },
          { t:"Both even and odd", why:"Only `f(x) = 0` is both." }] },
        b:{ prompt:"Which describes the symmetry of `f(x) = {x^4 + 1}/{x^2}`?", options:[
          { t:"Even: mirror image in the `y`-axis", ok:true, why:"Only even powers." },
          { t:"Odd", why:"`f(-x) = f(x)`, not `-f(x)`." },
          { t:"Neither", why:"Check `f(-x)`: only even powers." },
          { t:"Both even and odd", why:"Only `f(x) = 0` is both." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`f′ > 0` on (−∞, −2) and `f′ < 0` on (−2, ∞); `f″ < 0` everywhere. Which describes the graph?", options:[
          { t:"It rises then falls, bending down everywhere, with a local max at `x = -2`", ok:true, why:"`f′` goes + to − at −2, and `f″ < 0` means concave down throughout." },
          { t:"It rises then falls, with a point of inflection at −2", why:"`f″` never changes sign." },
          { t:"It falls then rises, like a ∪", why:"`f′` goes + to −." },
          { t:"It rises bending up, then falls", why:"`f″ < 0` means concave down throughout." }] },
        b:{ prompt:"`f′ < 0` on (−∞, 1) and `f′ > 0` on (1, ∞); `f″ > 0` everywhere. Which describes the graph?", options:[
          { t:"It falls then rises, bending up everywhere, with a local min at `x = 1`", ok:true, why:"`f′` goes − to + at 1, and `f″ > 0` means concave up throughout." },
          { t:"It falls then rises, with a point of inflection at 1", why:"`f″` never changes sign." },
          { t:"It rises then falls, like a ∩", why:"`f′` goes − to +." },
          { t:"It falls bending down, then rises", why:"`f″ > 0` means concave up throughout." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Which set of features belongs to `f(x) = x^3 - 3x^2 - 9x + 5`?", options:[
          { t:"Local max (−1, 10), local min (3, −22), point of inflection (1, −6)", ok:true, why:"`f′ = 3(x - 3)(x + 1)`; `f″ = 6x - 6`." },
          { t:"Local max (3, −22), local min (−1, 10), inflection (1, −6)", why:"+ to − happens at −1." },
          { t:"Local max (−1, 10), local min (3, −22), inflection (0, 5)", why:"The inflection is where `f″ = 0`, at `x = 1`." },
          { t:"Local max (1, −6), local min (−3, −22)", why:"`f′ = 3(x - 3)(x + 1)`, so the critical numbers are 3 and −1." }] },
        b:{ prompt:"Which set of features belongs to `f(x) = x^3 + 3x^2 - 9x - 2`?", options:[
          { t:"Local max (−3, 25), local min (1, −7), point of inflection (−1, 9)", ok:true, why:"`f′ = 3(x + 3)(x - 1)`; `f″ = 6x + 6`." },
          { t:"Local max (1, −7), local min (−3, 25), inflection (−1, 9)", why:"+ to − happens at −3." },
          { t:"Local max (−3, 25), local min (1, −7), inflection (0, −2)", why:"The inflection is where `f″ = 0`, at `x = -1`." },
          { t:"Local max (−1, 9), local min (3, 25)", why:"The critical numbers are −3 and 1." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Which describes `f(x) = {x^2 + 1}/{x^2 - 1}`?", options:[
          { t:"A local max at (0, −1); concave up for `|x| > 1` and concave down on (−1, 1); no points of inflection", ok:true, why:"`f′ = {-4x}/{(x^2 - 1)^2}`; `f″ = {4(3x^2 + 1)}/{(x^2 - 1)^3}`." },
          { t:"A local min at (0, −1)", why:"`f′` goes + to − at 0." },
          { t:"Points of inflection at `x = ±1`, because the concavity changes there", why:"±1 aren’t in the domain." },
          { t:"A local max at (0, −1), which can’t be right because the graph also reaches `y = 1`", why:"The branches outside ±1 stay above 1; the max is local." }] },
        b:{ prompt:"Which describes `f(x) = {x^2 - 2}/{x^2 - 4}`?", options:[
          { t:"A local max at (0, `1/2`); concave up for `|x| > 2` and concave down on (−2, 2); no points of inflection", ok:true, why:"`f′ = {-4x}/{(x^2 - 4)^2}`." },
          { t:"A local min at (0, `1/2`)", why:"`f′` goes + to − at 0." },
          { t:"Points of inflection at `x = ±2`", why:"±2 aren’t in the domain." },
          { t:"A local max at (0, `1/2`), which can’t be right because the graph also reaches `y = 1`", why:"The branches outside ±2 stay above 1; the max is local." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"The graph of `f′` is a parabola opening up that crosses the `x`-axis at −1 and 3. Which statement about `f` must be true?", options:[
          { t:"`f` has a local max at `x = -1`, a local min at `x = 3` and a point of inflection at `x = 1`", ok:true, why:"`f′`: + | − | +; the vertex of `f′` is at 1." },
          { t:"`f` has points of inflection at `x = -1` and `x = 3`", why:"Zeros of `f′` are extrema of `f`." },
          { t:"`f` is increasing on (−1, 3)", why:"`f′ < 0` there." },
          { t:"`f` has a local min at `x = 1`", why:"The vertex of `f′` is an inflection of `f`." }] },
        b:{ prompt:"The graph of `f′` is a parabola opening up that crosses the `x`-axis at −2 and 4. Which statement about `f` must be true?", options:[
          { t:"`f` has a local max at `x = -2`, a local min at `x = 4` and a point of inflection at `x = 1`", ok:true, why:"`f′`: + | − | +; the vertex of `f′` is at 1." },
          { t:"`f` has points of inflection at `x = -2` and `x = 4`", why:"Zeros of `f′` are extrema of `f`." },
          { t:"`f` is increasing on (−2, 4)", why:"`f′ < 0` there." },
          { t:"`f` has a local min at `x = 1`", why:"The vertex of `f′` is an inflection of `f`." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which best explains why infinitely many graphs fit a given sign chart for `f′`?", options:[
          { t:"“The chart fixes where `f` rises and falls, but not how high the graph is (or how steep). Adding any constant to `f` gives the same `f′`, so infinitely many graphs fit.”", ok:true, why:"`f` and `f + C` have the same derivative." },
          { t:"“Because `f′` can be any polynomial.”", why:"The chart is fixed; it’s `f` that varies." },
          { t:"“Because the domain is infinite.”", why:"The domain isn’t the reason." },
          { t:"“Only one graph fits once you know the signs exactly.”", why:M4 }] },
        b:{ prompt:"Two students sketch different graphs from the same sign charts for `f′` and `f″`. Which explanation shows both can be correct?", options:[
          { t:"“The charts give only where `f` rises, falls and bends. The heights of the points and how steep each piece is aren’t fixed, so different curves fit.”", ok:true, why:"Heights and steepness aren’t fixed by sign charts." },
          { t:"“Only the one through the origin is correct.”", why:"No point was given." },
          { t:"“They must have made an error: a sign chart gives a unique graph.”", why:M4 },
          { t:"“Both are wrong: you need the equation to sketch.”", why:"Derivative information is enough for possible sketches." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which summary of `f(x) = x^3 - 12x` is correct and correctly written?", options:[
          { t:"“Increasing on (−∞, −2) and (2, ∞); decreasing on (−2, 2); local max (−2, 16); local min (2, −16); concave down on (−∞, 0), up on (0, ∞); point of inflection (0, 0).”", ok:true, why:"`f′ = 3(x - 2)(x + 2)`; `f″ = 6x`." },
          { t:"“Increasing on (−∞, −2] and [2, ∞); decreasing on [−2, 2]; …”", why:"Use open intervals." },
          { t:"“… local max 16 at `x = 2`; local min −16 at `x = -2`; …”", why:"`f(-2) = -8 + 24 = 16`: the max is at `x = -2`." },
          { t:"“… concave up on (−∞, 0), down on (0, ∞); …”", why:"`f″ = 6x < 0` for `x < 0`." }] },
        b:{ prompt:"Which summary of `f(x) = x^3 - 27x` is correct and correctly written?", options:[
          { t:"“Increasing on (−∞, −3) and (3, ∞); decreasing on (−3, 3); local max (−3, 54); local min (3, −54); concave down on (−∞, 0), up on (0, ∞); point of inflection (0, 0).”", ok:true, why:"`f′ = 3(x - 3)(x + 3)`; `f″ = 6x`." },
          { t:"“Increasing on (−∞, −3] and [3, ∞); decreasing on [−3, 3]; …”", why:"Use open intervals." },
          { t:"“… local max 54 at `x = 3`; local min −54 at `x = -3`; …”", why:"`f(-3) = -27 + 81 = 54`: the max is at `x = -3`." },
          { t:"“… concave up on (−∞, 0), down on (0, ∞); …”", why:"`f″ = 6x < 0` for `x < 0`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"After a dose, a drug’s concentration is `C(t) = {20t}/{t^2 + 4}` mg/L, `t ≥ 0` hours. Which describes the graph?", options:[
          { t:"It rises to a maximum of 5 mg/L at 2 h, then falls toward 0, switching from concave down to concave up at `t = 2√3` h", ok:true, why:"`C′ = {20(4 - t^2)}/{(t^2 + 4)^2}`; `C″` changes sign at `t^2 = 12`." },
          { t:"It rises to 5 mg/L at 2 h and then levels off at 5 mg/L", why:"The degree of the top is smaller: `C -> 0`." },
          { t:"It rises to a maximum of 10 mg/L at 2 h", why:"`C(2) = 40/8 = 5`." },
          { t:"It rises to a maximum at `t = 4` h", why:"`t^2 = 4` gives `t = 2`." }] },
        b:{ prompt:"`C(t) = {30t}/{t^2 + 9}` mg/L, `t ≥ 0`. Which describes the graph?", options:[
          { t:"It rises to a maximum of 5 mg/L at 3 h, then falls toward 0, switching from concave down to concave up at `t = 3√3` h", ok:true, why:"`C(3) = 90/18 = 5`." },
          { t:"It rises to 5 mg/L at 3 h and then levels off at 5 mg/L", why:"The degree of the top is smaller: `C -> 0`." },
          { t:"It rises to a maximum of 10 mg/L at 3 h", why:"`C(3) = 90/18 = 5`." },
          { t:"It rises to a maximum at `t = 9` h", why:"`t^2 = 9` gives `t = 3`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A company’s profit `P` (thousands of dollars) changes at the rate `P′(x) = -3(x - 2)(x - 8)` when it sells `x` hundred units, `0 ≤ x ≤ 10`. Which describes the profit?", options:[
          { t:"Profit falls until 200 units, rises fastest at 500 units, peaks at 800 units, then falls", ok:true, why:"`P′`: − | + | −; `P″ = -6(x - 5)`." },
          { t:"Profit rises until 200 units, then falls until 800", why:"The factor −3 makes `P′` negative before 2." },
          { t:"Profit peaks at 500 units", why:"At 500, `P′` is largest: the fastest rise, not the peak." },
          { t:"Profit falls until 200 units, then rises for every `x` after that", why:"`P′ < 0` after 800." }] },
        b:{ prompt:"`P′(x) = -2(x - 1)(x - 7)`, `0 ≤ x ≤ 10` (hundreds of units). Which describes the profit?", options:[
          { t:"Profit falls until 100 units, rises fastest at 400 units, peaks at 700 units, then falls", ok:true, why:"`P″ = -2(2x - 8) = -4(x - 4)`." },
          { t:"Profit rises until 100 units, then falls until 700", why:"The factor −2 makes `P′` negative before 1." },
          { t:"Profit peaks at 400 units", why:"At 400, `P′` is largest: the fastest rise, not the peak." },
          { t:"Profit falls until 100 units, then rises for every `x` after that", why:"`P′ < 0` after 700." }] } }
    ]
  },
  task:{
    title:"Clue designer", summary:"Clue designer",
    statement:"<p>Choose `b`, `c` and `d` so that the cubic `f(x) = x^3 + bx^2 + cx + d` matches every clue. Can you find all the answers?</p>" +
      '<ol class="cs-clues"><li>`f` has a local maximum at `x = -1`.</li><li>`f` has a point of inflection at `x = 1`.</li><li>`f` has three `x`-intercepts.</li><li>The local maximum value is greater than 12.</li></ol>',
    checks:["Local max at `x = -1`", "Inflection at `x = 1`", "Three `x`-intercepts", "Max value > 12"],
    tips:["`f′ = 3x^2 + 2bx + c` must be 0 at −1, and `f` must be concave down there.", "`f″ = 6x + 2b`: set it to 0 at `x = 1`.", "Three intercepts: the max must be above the `x`-axis and the min below it.", "Once `b` and `c` are fixed, `f(-1) = 5 + d`."],
    explainPrompt:"Explain the order in which you used the clues, and why the cubic’s shape forced the intercept and maximum conditions to limit `d`.",
    vocab:"Use the words local maximum, point of inflection, intercept and concave down.",
    success:"Your cubic matches every clue!",
    after3:"Clues 1 and 2 fix `b` and `c`. Clue 3 needs `-5 < d < 27`, and clue 4 needs `d > 7`. The rest is the input range.", afterAt:5,
    inputs:{ range:"(whole numbers, −12 to 12)", none:"Enter whole numbers from −12 to 12 for `b`, `c` and `d`." }
  },
  cards:[
    ["The algorithm", "Domain → intercepts → symmetry → asymptotes → `f′` → `f″` → sketch."],
    ["Four shapes", "↗∪, ↗∩, ↘∪, ↘∩: `f′` gives the direction, `f″` the bend."],
    ["Key `x`-values", "Critical numbers, inflection candidates and asymptotes split the `x`-axis into intervals."],
    ["Even function", "Mirror in the `y`-axis: sketch `x ≥ 0`, then reflect."],
    ["Odd function", "Rotate 180° about the origin: a max at (`a`, `b`) means a min at (`-a`, `-b`)."],
    ["Asymptotes in sign charts", "Boundaries only: never critical numbers or points of inflection."],
    ["Flat inflection", "`f′ = 0` but no sign change, while `f″` changes sign, e.g. `x(x - 4)^3` at 4."],
    ["Max below min", "Possible on different branches of a rational function."],
    ["From the graph of `f′`", "Zeros of `f′` → extrema of `f`; extrema of `f′` → inflections of `f`."],
    ["Infinitely many graphs", "Derivative information fixes shape, not height: `f + C` fits too."],
    ["A point fixes the height", "One known point (like `f(0) = 0`) picks one graph from the family."],
    ["Check your sketch", "Symmetry, end behaviour and intercepts should agree with the calculus."]
  ]
};
