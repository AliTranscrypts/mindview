// MHF4U 19 Reciprocal of Quadratic Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/19-reciprocal-of-quadratic-functions.md

// Practice 1: pair-specific feedback for the matching (plan, "Mistake feedback for common wrong pairs").
const PAIR = {};
const pairs = (list, fb) => list.forEach(p => { PAIR[p] = fb; });
pairs(["l1|F", "l2|C"], "Check the sign between the asymptotes: at `x = 0`, `x^2 - 4 = -4` (negative) but `4 - x^2 = 4` (positive). The reciprocal has the same sign.");
pairs(["l1|A", "l3|C"], "`x^2 - 4` has zeros at ±2, so its reciprocal has asymptotes. `x^2 + 4` is never 0, so its reciprocal has none.");
pairs(["l3|H", "l4|A"], "`x^2 + 4` is positive everywhere, so its reciprocal is above the axis; `-x^2 - 4` is negative everywhere.");
pairs(["l5|C", "l5|D", "l5|F", "l6|C", "l6|D", "l6|F", "l7|C", "l7|D", "l7|F"], "A double zero gives one asymptote, not two.");
pairs(["l5|B", "l6|E"], "`x^2 - 4x + 4 = (x - 2)^2`, which is 0 at `x = 2`; `x^2 + 4x + 4 = (x + 2)^2`, which is 0 at `x = -2`.");
pairs(["l5|G", "l7|E"], "`(x - 2)^2` is never negative, so both pieces of its reciprocal are above the axis. `-(x - 2)^2` is never positive.");
pairs(["l8|C"], "`x^2 + 4x = x(x + 4)`, so the asymptotes are `x = -4` and `x = 0`, not ±2.");
const MH1 = "Find the zeros of the denominator: they give the vertical asymptotes.";
const MH2 = "Now decide the sign of the denominator between and outside the zeros, or its vertex and whether it opens up or down.";

export default {
  id:"19-reciprocal-of-quadratic-functions",
  kind:"topic",
  title:"Reciprocal of quadratic functions",
  topic:"Reciprocal of Quadratic Functions",
  readyTopic:"the reciprocals of quadratic functions",
  hero:{
    eq:"`y = {1}/{@a{a}(x - @d{d})^2 + @c{c}}`", eqLabel:"y equals 1 over a times x minus d, all squared, plus c", eqSize:"md",
    headline:"Small turns big, and every zero becomes an asymptote",
    text:"The <strong>reciprocal</strong> of a quadratic `f` is `y = 1/f(x)`. Every point keeps its `x`-value, and its height becomes 1 divided by the old height. Heights near 0 turn into huge heights, so each <strong>zero</strong> of `f` becomes a <strong>vertical asymptote</strong>. Large heights turn tiny, so far out the graph hugs the <strong>horizontal asymptote</strong> `y = 0`. And the parabola’s <strong>vertex</strong> becomes a <strong>local maximum or minimum</strong>, unless it sits on the `x`-axis.",
    fig:{ aria:"The parabola f(x) = x squared minus 4x, dashed, with seven points that fly to their reciprocal heights; vertical asymptotes at x = 0 and x = 4 and the reciprocal drawn in three pieces",
      caps:["Two zeros → three pieces", "One zero → two pieces", "No zeros → one piece"] }
  },
  goals:[
    "I can explain how each value of a quadratic `f` turns into a value of `1/f`: same `x`, same sign, small ↔ large, and heights of 1 and −1 stay put.",
    "I can decide whether a quadratic has two, one or no zeros, and find the vertical asymptotes, the horizontal asymptote and the `y`-intercept of its reciprocal.",
    "I can find the local maximum or minimum of `y = 1/f(x)` from the vertex of `f`, and say when there isn’t one.",
    "I can describe the behaviour of `1/f` near each vertical asymptote and as `x → ±∞`, and state where it is positive, negative, increasing and decreasing.",
    "I can state the domain and range of `y = 1/f(x)` and sketch its graph from its key features.",
    "I can work backwards from features to an equation, and use reciprocals of quadratics in new situations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factoring", goal:2,
          prompt:"Factor `x^2 - 2x - 15`.",
          options:[
            { t:"`(x - 5)(x + 3)`", ok:true, why:"−5 × 3 = −15 and −5 + 3 = −2." },
            { t:"`(x + 5)(x - 3)`", why:"This expands to `x^2 + 2x - 15`: the middle term has the wrong sign. To add to −2, the larger number must be the negative one." },
            { t:"`(x - 15)(x + 1)`", why:"This expands to `x^2 - 14x - 15`. The product −15 is right, but the two numbers must also add to −2." },
            { t:"`(x - 5)(x - 3)`", why:"This expands to `x^2 - 8x + 15`. A negative constant needs one positive and one negative number." }],
          hints:["Find two numbers that multiply to −15 and add to −2.", "The product is negative, so one number is negative. Try 3 and 5 with one sign changed.", "−5 × 3 = −15 and −5 + 3 = −2, so `x^2 - 2x - 15 = (x - 5)(x + 3)`."] },
        { id:"w2", skill:"Zeros of a quadratic", goal:2,
          prompt:"What are the zeros of `f(x) = x^2 + 6x + 10`?",
          options:[
            { t:"There are none", ok:true, why:"Complete the square: `x^2 + 6x + 10 = (x + 3)^2 + 1`, which is at least 1. It’s never 0. (The discriminant agrees: 36 − 40 = −4 < 0.)" },
            { t:"`x = -3` only (a double zero)", why:"`(x + 3)^2` would be `x^2 + 6x + 9`. The extra 1 lifts the vertex to (−3, 1), above the axis." },
            { t:"`x = -2` and `x = -5`", why:"`(x + 2)(x + 5) = x^2 + 7x + 10`. The product 10 is right, but the sum is 7, not 6." },
            { t:"`x = 2` and `x = 5`", why:"`(x - 2)(x - 5) = x^2 - 7x + 10`: both the sum and the signs are off." }],
          hints:["Try completing the square, or check the discriminant `b^2 - 4ac`.", "`x^2 + 6x + 10 = (x + 3)^2 + 1`. Can `(x + 3)^2 + 1` ever be 0?", "`(x + 3)^2 >= 0`, so `(x + 3)^2 + 1 >= 1`. There are no zeros."] },
        { id:"w3", skill:"Vertex form", goal:3,
          prompt:"What is the vertex of `y = 2(x + 3)^2 - 5`?",
          options:[
            { t:"(−3, −5)", ok:true, why:"`x + 3 = x - (-3)`, so `d = -3` and `c = -5`." },
            { t:"(3, −5)", why:"`(x + 3)^2` is 0 when `x = -3`, not 3." },
            { t:"(−5, −3)", why:"The `x`-value comes from the bracket and the `y`-value from the constant at the end." },
            { t:"(−6, −5)", why:"The 2 stretches the parabola vertically. It doesn’t move the vertex sideways." }],
          hints:["In `y = a(x - d)^2 + c`, the vertex is (`d`, `c`).", "Rewrite `x + 3` as `x - (-3)`.", "`d = -3` and `c = -5`, so the vertex is (−3, −5)."] },
        { id:"w4", skill:"Vertex form", goal:3,
          prompt:"Write `x^2 - 8x + 13` in vertex form.",
          options:[
            { t:"`(x - 4)^2 - 3`", ok:true, why:"Half of −8 is −4, and `(x - 4)^2 = x^2 - 8x + 16`. To get 13 instead of 16, subtract 3." },
            { t:"`(x - 4)^2 + 13`", why:"`(x - 4)^2` already contains 16, so this equals `x^2 - 8x + 29`." },
            { t:"`(x + 4)^2 - 3`", why:"`(x + 4)^2 = x^2 + 8x + 16`: the middle term has the wrong sign." },
            { t:"`(x - 8)^2 - 51`", why:"`(x - 8)^2 - 51 = x^2 - 16x + 13`. Use half of −8." }],
          hints:["Take half of the `x`-coefficient: half of −8 is −4.", "`(x - 4)^2 = x^2 - 8x + 16`. How far is 16 from 13?", "`x^2 - 8x + 13 = (x - 4)^2 - 16 + 13 = (x - 4)^2 - 3`."] },
        { id:"w5", skill:"Reciprocal of a linear function", goal:2,
          prompt:"What is the vertical asymptote of `y = 1/(2x - 6)`?",
          options:[
            { t:"`x = 3`", ok:true, why:"The denominator is 0 when `2x - 6 = 0`, that is, when `x = 3`." },
            { t:"`x = -3`", why:"At `x = -3`, `2x - 6 = -12`, not 0." },
            { t:"`x = 6`", why:"At `x = 6`, `2x - 6 = 6`. Divide by 2: `2x = 6` gives `x = 3`." },
            { t:"`x = 1/3`", why:"That’s 2 ÷ 6. From `2x = 6`, `x` = 6 ÷ 2 = 3." }],
          hints:["A vertical asymptote of 1/(linear) is where the denominator is 0.", "Solve `2x - 6 = 0`.", "`2x = 6`, so `x = 3`."] },
        { id:"w6", skill:"Reciprocal of a linear function", goal:1,
          prompt:"For what value of `x` does `1/(x - 2) = -10`?",
          options:[
            { t:"`x = 1.9`", ok:true, why:"`x - 2` must be the reciprocal of −10, which is −0.1. So `x = 1.9`. A large reciprocal needs a small denominator." },
            { t:"`x = 2.1`", why:"At 2.1, `x - 2 = 0.1`, and 1/0.1 = +10." },
            { t:"`x = -8`", why:"That makes `x - 2 = -10`, so `1/(x - 2) = -1/10`." },
            { t:"`x = 12`", why:"At 12, `x - 2 = 10`, and 1/10 is small and positive." }],
          hints:["If `1/(x - 2) = -10`, what must `x - 2` be?", "`x - 2` is the reciprocal of −10, which is −1/10 = −0.1.", "`x - 2 = -0.1`, so `x = 1.9`."] }
      ],
      refreshers:{
        "Factoring":"To factor `x^2 + bx + c`, find two numbers that multiply to `c` and add to `b`. Example: −5 × 3 = −15 and −5 + 3 = −2, so `x^2 - 2x - 15 = (x - 5)(x + 3)`, with zeros `x = 5` and `x = -3` (the opposite signs of the numbers in the brackets). A difference of squares factors, `x^2 - 9 = (x - 3)(x + 3)`, but a sum such as `x^2 + 9` doesn’t factor at all.",
        "Zeros of a quadratic":"A quadratic has two zeros, one (double) zero, or none. Completing the square shows which: `x^2 + 6x + 10 = (x + 3)^2 + 1` is never below 1, so it has none. The discriminant `b^2 - 4ac` says the same: positive means two zeros, 0 means one, negative means none.",
        "Vertex form":"`y = a(x - d)^2 + c` has its vertex at (`d`, `c`). (Grade 11 wrote `y = a(x - h)^2 + k`; `d` and `c` do the same jobs.) If `a > 0` the vertex is a minimum; if `a < 0` it’s a maximum. To get vertex form, complete the square: `x^2 - 8x + 13 = (x - 4)^2 - 16 + 13 = (x - 4)^2 - 3`, so the vertex is (4, −3).",
        "Reciprocal of a linear function":"`y = 1/(kx - c)` has a vertical asymptote where `kx - c = 0`. The reciprocal of a small number is large (1/0.1 = 10), and it keeps the sign (1/(−0.1) = −10). Example: `1/(x - 2) = -10` when `x - 2 = -0.1`, at `x = 1.9`, just left of the asymptote `x = 2`."
      }
    }
  },
  explore:{
    heading:"Reciprocal plotter",
    intro:"Build the reciprocal of a parabola one point at a time. Then slide the parabola and watch the reciprocal change shape. The panel lists every key feature as you go.",
    note:"Here `a`, `d` and `c` do the jobs they did in module 07: `a` stretches or flips the parabola, `d` moves it sideways and `c` moves it up or down. So they appear in their course colours. Grade 11 wrote the same form as `y = a(x - h)^2 + k`; this course uses `d` and `c`, so the vertex is (`d`, `c`). (In module 18’s `y = 1/(kx - c)`, the letters were plain coefficients, written in ink.)",
    modes:[{ id:"plot", t:"Plot by hand" }, { id:"slide", t:"Slide the parabola" }],
    caseStrip:["Two zeros · three pieces", "One zero · two pieces", "No zeros · one piece"],
    caseNames:["two zeros", "one zero", "no zeros"],
    caseSay:{ two:"Now: two zeros. Two vertical asymptotes, at {xs}.", one:"Now: one zero. One vertical asymptote, at {xs}.", none:"Now: no zeros. No vertical asymptotes." },
    toggles:[["para", "Show the parabola"], ["flight", "Flight lines"], ["ones", "Lines `y = 1` and `y = -1`"], ["band", "Big ↔ small band"], ["table", "Close-up table"]],
    presets:[
      { id:"two", name:"Two zeros", a:1, d:2, c:-4, view:{ xmin:-2, xmax:6, ymin:-5, ymax:6 }, xs:[-1, 0, 1, 2, 3, 4, 5], zero:4, tableXs:[3.9, 3.99, 4.01, 4.1] },
      { id:"one", name:"One zero", a:1, d:1, c:0, view:{ xmin:-2, xmax:4, ymin:-1.5, ymax:5 }, xs:[-1, 0, 1, 2, 3], zero:1, tableXs:[0.9, 0.99, 1.01, 1.1] },
      { id:"none", name:"No zeros", a:1, d:-1, c:2, view:{ xmin:-4.5, xmax:2.5, ymin:-1.5, ymax:7 }, xs:[-3, -2, -1, 0, 1] },
      { id:"down", name:"Opens down", a:-1, d:0, c:4, view:{ xmin:-4, xmax:4, ymin:-6, ymax:5 }, xs:[-3, -2, -1, 0, 1, 2, 3], zero:2, tableXs:[1.9, 1.99, 2.01, 2.1] }
    ],
    plot:{
      prompt:"{fx} = {v}. Plot 1/{fx}.",
      pick:"Tap a dot on the parabola (or use the arrow keys and Enter) to plot its reciprocal.",
      num:"Numerator", den:"Denominator (blank means 1)",
      noValue:"No value: `f(x) = 0`", plotIt:"Plot it",
      progress:"Plotted {n} of {N} ({f} right first time)",
      draw:"Draw the curve", toGo:"Plot all the points first: {n} to go",
      another:"Try another preset",
      right:"{fx} = {v}, so 1/{fx} = {r}.",
      rightZero:"{fx} = 0, so there’s no point here: {xa} is a vertical asymptote.",
      stay:"{fx} = {v}, and 1/{vp} = {v}: this point stays put. Points at height 1 or −1 are on both graphs.",
      fb:{
        zero0:"1/0 isn’t 0: dividing by 0 has no answer, so there’s no point here. Press ‘No value’.",
        zeroNum:"{fx} = 0 here, so 1/{fx} would be 1/0, which has no value. There’s no point to plot. Press ‘No value’.",
        self:"That’s {fx} itself, the parabola’s height. The reciprocal is 1 divided by that height.",
        sign:"Right size, wrong sign. Reciprocals keep the sign: {fx} = {v}, so 1/{fx} is {pn} too.",
        neg:"That reflects the point in the `x`-axis. The reciprocal keeps the sign and flips the size.",
        recipX:"You took the reciprocal of the `x`-value. Keep {xx} and take the reciprocal of the height, {fx}.",
        noValue:"{fx} = {v}, which isn’t 0, so 1/{fx} has a value. Only zeros of `f` have no reciprocal.",
        other:"Not quite. {fx} = {v}. Divide 1 by that height and write the result as a fraction.",
        empty:"Type a whole number in the numerator box (and the denominator, if you need one), or press ‘No value’."
      },
      banner:"Your {n} points, joined. Far out, the curve hugs `y = 0`. Near {xs} it shoots off, because `f` is close to 0 there.",
      bannerNone:"Your {n} points, joined. Far out, the curve hugs `y = 0`. `f` never gets close to 0, so the curve never shoots off: it’s one unbroken piece."
    },
    table:{
      head:["`x`", "`f(x)`", "`1/f(x)`"], cap:"Close-up near {xa}",
      offs:["zero − 0.1", "zero − 0.01", "zero + 0.01", "zero + 0.1"],
      none:"No zeros: nothing to zoom in on. The closest `f` gets to 0 is its vertex height, {c}, so `1/f` never gets above {rc}.",
      noneBelow:"No zeros: nothing to zoom in on. The closest `f` gets to 0 is its vertex height, {c}, so `1/f` never gets below {rc}."
    },
    sliders:{ a:"`@a{a}`, stretch or flip", d:"`@d{d}`, sideways shift", c:"`@c{c}`, up or down", skip:"`@a{a}` skips 0 (the thumb jumps from 0.25 to −0.25 and back).", handle:"Vertex handle at ({d}, {c}). Arrow keys move `d` by 0.5 or `c` by 0.25; Shift + arrow moves by 1." },
    reset:"Reset to the start graph",
    graph:{ ha:"y = 0 (horizontal asymptote)", min:"min", max:"max", lmax:"local max", lmin:"local min", onAxis:"({d}, 0): on the axis, so it becomes the asymptote", stay:"stays put", small:"small heights" },
    read:{
      quad:"Quadratic", recip:"Reciprocal", kase:"Case", zeros:"Zeros of `f`", va:"Vertical asymptotes", ha:"Horizontal asymptote",
      vtx:"Vertex of `f` → turning point of `1/f`", yint:"`y`-intercept", xint:"`x`-intercepts", dom:"Domain", rng:"Range",
      sign:"Positive / negative", incdec:"Increasing / decreasing", near:"Near the asymptotes", ends:"End behaviour", stay:"Points that stay put (`f(x) = ±1`)",
      cases:["Two zeros", "One zero (a double zero)", "No zeros"],
      noZeros:"none: `f(x)` is never 0", none:"none", haVal:"`y = 0` (the `x`-axis)", xintVal:"none: `1/f(x)` is never 0", yintNone:"none: `x = 0` is a vertical asymptote",
      min:"a minimum", max:"a maximum", lmax:"a local maximum", lmin:"a local minimum",
      vtxZero:"({d}, 0) is on the `x`-axis → no turning point; {xa} is an asymptote instead",
      posAll:"positive everywhere", negAll:"negative everywhere",
      split:"(on each piece separately: the asymptote at {xa} splits the interval)",
      splitTwo:"(on each piece separately: the asymptotes at {xa} and {xb} split the intervals)",
      noStay:"none: the parabola never reaches 1 or −1",
      more:"More facts", fewer:"Fewer facts"
    },
    predIntro:"Make a prediction first. Then the plotter will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"plot", preset:"one", plotted:[-1, 3] },
        prompt:"At `x = 0`, 1 and 2 the parabola’s heights are 1, 0 and 1. What happens to the reciprocal at those three `x`-values?",
        options:[
          { t:"Heights 1 and 1 at `x = 0` and 2, and no point at `x = 1`: a vertical asymptote", ok:true },
          { t:"Heights 1, 0 and 1: the reciprocal touches the `x`-axis at `x = 1`" },
          { t:"Heights −1, 0 and −1" },
          { t:"Heights 1, ∞ and 1: the point at `x = 1` is at infinity" }],
        explain:"At `x = 0` and 2, `f = 1` and 1/1 = 1, so those points stay put. At `x = 1`, `f = 0` and 1/0 has no value, so there’s no point, and certainly no `x`-intercept. Close to `x = 1`, `f` is tiny and positive (`f(1.1) = 0.01`), so `1/f` is huge (100). That’s a vertical asymptote. Because `(x - 1)^2` is never negative, both pieces go <strong>up</strong>. (There’s no point ‘at infinity’ either: ∞ isn’t a number, so it can’t be a height. The heights just grow without bound as `x` gets close to 1.)" },
      { id:"p2", start:{ mode:"slide", a:1, d:1, c:2, hide:true },
        prompt:"The parabola’s lowest point is (1, 2). What will the reciprocal have at `x = 1`?",
        options:[
          { t:"A highest point, at (1, 1/2)", ok:true },
          { t:"A lowest point, at (1, 1/2)" },
          { t:"A highest point, at (1, 2)" },
          { t:"A lowest point, at (1, −2)" }],
        label:"local max (1, 1/2)",
        explain:"Everywhere else `f(x)` is more than 2, so `1/f(x)` is less than 1/2: `f(0) = 3` gives 1/3, and `f(3) = 6` gives 1/6. The smallest value of `f` gives the largest value of `1/f`. So the parabola’s minimum becomes the reciprocal’s local maximum, at the same `x`, with height 1/2." },
      { id:"p3", start:{ mode:"slide", a:1, d:0, c:2 },
        prompt:"`c` will slide slowly from 2 down to −2. How many vertical asymptotes will the reciprocal have at `c = 1`, `c = 0` and `c = -1`, in that order?",
        options:[{ t:"0, 1, 2", ok:true }, { t:"0, 0, 2" }, { t:"2, 1, 0" }, { t:"0, 2, 2" }],
        snaps:["`c = 1`: no zeros, one piece", "`c = 0`: one zero, two pieces", "`c = -1`: two zeros, three pieces"],
        explain:"The vertical asymptotes are the zeros of `f`. At `c = 1` the parabola is above the axis: no zeros. At `c = 0` it touches the axis at `x = 0`: one double zero, one asymptote. At `c = -1` it crosses at `x = -1` and 1: two zeros, two asymptotes. (A double zero gives <strong>one</strong> asymptote, not two.)" },
      { id:"p4", start:{ mode:"slide", a:-1, d:0, c:4, hide:true },
        prompt:"Just to the right of `x = 2`, which way does the reciprocal go?",
        options:[
          { t:"Down, toward −∞", ok:true },
          { t:"Up, toward +∞" },
          { t:"It levels off toward `y = 0`" },
          { t:"It crosses the `x`-axis at `x = 2`" }],
        walk:[3, 2.5, 2.1, 2.01],
        explain:"Just right of 2, `f(x)` is negative and close to 0: `f(2.1) = -0.41`. A small negative number has a large negative reciprocal, so as `x → 2^{+}`, `y → -∞`. Between −2 and 2 the parabola is above the axis, so the middle piece is above it too, with a local minimum at (0, 1/4), the reciprocal of the vertex height 4." }
    ],
    chalIntro:"Use <strong>Slide the parabola</strong>. Each challenge starts from the start graph, `a = 1`, `d = 2`, `c = -4` (the plotter resets after each one you meet). Set the sliders, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Make the reciprocal have vertical asymptotes at `x = -1` and `x = 1`.",
        why:"With `d = 0` and `c = -a`, `f(x) = a(x^2 - 1)`, which is 0 at `x = -1` and `x = 1`.",
        named:{
          offCentre:"Your asymptotes are at {r1} and {r2}, centred on {xd}. They always sit symmetrically about the parabola’s axis, {xd}. You need them centred on 0.",
          gap:"Centred correctly, but the gap is wrong. The asymptotes are at `±√{-c/a}`, so you need `-c/a = 1`.",
          none:"Your parabola never reaches the `x`-axis, so there’s nothing to divide by zero. `a` and `c` need opposite signs.",
          c0:"One asymptote: the vertex is on the `x`-axis, a double zero. Move `c` off 0, to the opposite sign from `a`.",
          other:"Check where the parabola crosses the `x`-axis. Those are the asymptotes." },
        hints:["Where are the asymptotes? Where the parabola meets the `x`-axis.", "The asymptotes sit symmetrically about the axis `x = d`, so `d = 0`. Then the zeros are `±√{-c/a}`.", "With `d = 0`, you need `√{-c/a} = 1`, so `c = -a`. For example, `a = 1` and `c = -1` give `f(x) = x^2 - 1 = (x - 1)(x + 1)`."] },
      { id:"tc2", goal:3, prompt:"Make the reciprocal have a local minimum at (−2, 1/3).",
        why:"`d = -2`, `c = 3` and a negative `a`: the parabola’s maximum (−2, 3) becomes the local minimum (−2, 1/3).",
        named:{
          aPos:"Your reciprocal has a local <strong>maximum</strong> at (−2, 1/3). The parabola opens up, so its vertex is a minimum, and that turns into a maximum. Make `a` negative.",
          small:"Your turning point is at (−2, 1/`c`) = (−2, {v}). Its height is the reciprocal of `c`, not `c` itself. Which `c` has 1/`c` = 1/3?",
          cNeg:"Your turning point is at (−2, −1/3), below the axis. You need +1/3.",
          d2:"The turning point is at `x = d`. You’re on the right side of the `y`-axis; you need `x = -2`.",
          other:"The turning point is (`d`, 1/`c`). Set `d` first, then `c`, then decide the sign of `a`." },
        hints:["The reciprocal’s turning point comes from the parabola’s vertex (`d`, `c`). It’s at (`d`, 1/`c`).", "1/`c` = 1/3 means `c = 3`, and `d = -2`. Should the vertex be a maximum or a minimum?", "A local minimum of `1/f` comes from a maximum of `f`, so the parabola must open down: `d = -2`, `c = 3` and any negative `a`, such as `a = -1`, which gives `f(x) = -(x + 2)^2 + 3`."] },
      { id:"tc3", goal:[3, 6], stretch:true,
        prompt:"Keep the asymptotes at `x = 0` and `x = 4`, but change the graph so that it has a local <strong>minimum</strong> at (2, 1/2).",
        why:"`f(x) = -{1}/{2}(x - 2)^2 + 2`: its maximum (2, 2) becomes the local minimum (2, 1/2), and `f(0) = f(4) = 0`. It’s the only slider state that works.",
        named:{
          start:"This is the starting graph: the asymptotes are right, but its turning point is a local maximum at (2, −1/4).",
          maxBelow:"Asymptotes at 0 and 4 ✓, but the turning point is a local <strong>maximum</strong> at (2, {v}), below the axis. A local minimum above the axis needs a parabola that opens down with its vertex above the axis.",
          minHeight:"Asymptotes ✓ and a local minimum ✓, but it’s at (2, {v}). The height of the turning point is 1/`c`, so which `c` gives 1/2? Then make `f(4) = 0` again.",
          wrongA:"Local minimum (2, 1/2) ✓, but the asymptotes are at {rs}, not 0 and 4. Check: `f(4) = 4a + 2` = {v}, not 0.",
          aPos:"With `a > 0` and `c > 0` the parabola never reaches the `x`-axis, so there are no asymptotes, and the turning point is a maximum.",
          cHalf:"Your turning point is at (2, 2). Its height is 1/`c`, not `c`.",
          other:"Work in order: the turning point fixes `d` and `c`; then the asymptote at `x = 4` fixes `a`." },
        hints:["The turning point (2, 1/2) comes from the vertex. What must `d` and `c` be?", "`d = 2` and `c = 2`, and a local minimum needs `a < 0`. The asymptote `x = 4` means `f(4) = 0`.", "`f(4) = a(4 - 2)^2 + 2 = 4a + 2 = 0`, so `a = -1/2`. The answer is `f(x) = -{1}/{2}(x - 2)^2 + 2`."] }
    ]
  },
  part3:{
    slug:"cases", name:"Three cases",
    heading:"Three cases, one routine",
    intro:"Each case file gives you an equation. Answer six questions about it. Each right answer adds a layer to the sketch, and the curve draws itself at the end.",
    triptych:[
      { t:"Two zeros · three pieces", a:1, d:0, c:-1, aria:"Thumbnail: reciprocal of x squared minus 1, three pieces with asymptotes x = −1 and x = 1" },
      { t:"One zero · two pieces", a:1, d:0, c:0, aria:"Thumbnail: reciprocal of x squared, two pieces rising along the asymptote x = 0" },
      { t:"No zeros · one piece", a:1, d:0, c:1, aria:"Thumbnail: reciprocal of x squared plus 1, one hump with a local maximum at (0, 1)" }
    ],
    stepNames:["Which case?", "Vertical asymptotes", "Signs", "Turning point", "Arrows", "Range"],
    stepGoals:[2, 2, 4, 3, 4, 5],
    stepHow:[
      "Count the zeros of the denominator.",
      "Tap the `x`-axis at each vertical asymptote (tap again to remove one), or press <strong>None</strong>. Then press Check.",
      "Set + or − for each interval of the sign strip under the graph. Then press Check.",
      "Choose the turning point of the reciprocal.",
      "For each asymptote, choose where the graph goes on its left and right. For each end, choose how it approaches `y = 0`. Then press Check.",
      "Choose the range of the reciprocal."
    ],
    ui:{ none:"None", check:"Check", drawIt:"Draw it", next:"Next case file", prev:"Previous", tapped:"Your asymptotes: {xs}", tappedNone:"Your asymptotes: none yet", noneChosen:"Your answer: none",
      lives:"1/f lives here", left:"left of {x}", right:"right of {x}", endL:"Left end", endR:"Right end", up:"↑ +∞", down:"↓ −∞", zp:"`y → 0^{+}`", zm:"`y → 0^{-}`",
      file:"Case file {n} of 4", done:"Case file finished: {n} of 6 steps right first time.", fileOf:"Case file", alg:"Check it with algebra",
      card:"Feature card", dom:"Domain", rng:"Range", yint:"`y`-intercept", xint:"`x`-intercepts", xintVal:"none", inc:"Increasing", dec:"Decreasing", interval:"Interval", sign:"Sign of `f`",
      axisBtns:"Asymptote positions (buttons for keyboard use)", stepOf:"Step {n} of 6: " },
    fallback:{
      1:"Try to factor it. If it won’t factor, complete the square and look at the vertex height. Then count the zeros. Try again.",
      2:"The asymptotes are exactly the zeros of the denominator. Set each factor equal to 0, and tap only those `x`-values. Try again.",
      3:"Test one `x`-value inside each interval. The sign of `f` there is the sign of `1/f`. Try again.",
      5:"Use your signs from step 3: on each side of an asymptote, positive and tiny → +∞, negative and tiny → −∞. Far out, `f` is large with the sign of `a`, so `1/f → 0` from that side. Try again."
    },
    files:[
      { id:"cf1", goal:[2, 3, 4, 5], eq:"`y = 1/(x^2 - 2x - 8)`", eqs:"`y = {1}/{x^2 - 2x - 8}`", a:1, d:1, c:-9, view:{ xmin:-5, xmax:7, ymin:-1.5, ymax:1.5 },
        s1:{ choices:[{ t:"Two zeros", ok:true }, { t:"One zero", fb:"A single double zero needs a perfect square like `(x - 1)^2`. These two factors are different." }, { t:"No zeros", fb:"It factors: `x^2 - 2x - 8 = (x + 2)(x - 4)`." }],
          hints:["Try to factor. If it won’t, complete the square.", "`x^2 - 2x - 8 = (x + 2)(x - 4)`.", "Two different factors, so two zeros: the case is two zeros."] },
        s2:{ answer:[-2, 4], wrong:[{ set:[-4, 2], fb:"`(x + 2)` is 0 at `x = -2`, not 2: the zero has the opposite sign." }, { set:[1], fb:"`x = 1` is the axis of symmetry, where the turning point will be. Asymptotes come from zeros." }],
          hints:["Asymptotes are where `f(x) = 0`.", "Set each factor equal to 0.", "`x = -2` and `x = 4`."] },
        s3:{ answer:["+", "-", "+"], anyWrong:"Test a value in that interval: `f(-3) = 7`, `f(0) = -8` and `f(5) = 7`. `1/f` has the same sign as `f`.",
          hints:["Pick a test value in each interval.", "`f(-3) = 7`, `f(0) = -8` and `f(5) = 7`.", "+, −, +; `1/f` has the same signs."] },
        s4:{ tp:[1, -1/9], tpLabel:"(1, −1/9) local max", options:[
            { t:"Local maximum (1, −1/9)", ok:true, why:"The parabola’s minimum (1, −9) becomes a local maximum at height 1/(−9) = −1/9." },
            { t:"Local minimum (1, −1/9)", why:"The parabola’s vertex is a minimum (it opens up), so the reciprocal has a local <strong>maximum</strong> there." },
            { t:"Local minimum (1, −9)", why:"(1, −9) is the parabola’s vertex. Flip both the height (1/(−9) = −1/9) and the type." },
            { t:"Local maximum (1, −9)", why:"Right type, but the height must be the reciprocal: −1/9." }],
          hints:["Find the vertex (`d`, `c`) of `f`.", "The vertex is (1, −9), a minimum.", "The turning point is a local maximum at (1, −1/9)."] },
        s5:{ answer:{ sides:[["+", "-"], ["-", "+"]], ends:["+", "+"] },
          side:"Follow the signs from step 3: just left of −2, `f` is positive and tiny, so `1/f → +∞`; just right, it’s negative and tiny, so `1/f → -∞`.",
          end:"Far out, `f` is large and positive, so `1/f` is small and positive: `0^{+}`.",
          hints:["Use the signs from step 3 on each side of each asymptote.", "Positive and tiny → +∞; negative and tiny → −∞.", "As `x → -2^{-}`, `y → +∞`; as `x → -2^{+}`, `y → -∞`; as `x → 4^{-}`, `y → -∞`; as `x → 4^{+}`, `y → +∞`; at both ends, `y → 0^{+}`."] },
        s6:{ pieces:[{ a:null, b:-1 / 9, bIn:true }, { a:0, b:null, aIn:false }], options:[
            { t:"`(-∞, -1/9] ∪ (0, ∞)`", ok:true, why:"The middle piece climbs only to −1/9; the outer pieces take every positive value." },
            { t:"`(-∞, 0) ∪ (0, ∞)`", why:"The middle piece only climbs to −1/9. Values between −1/9 and 0 are never reached." },
            { t:"`[-9, ∞)`", why:"That’s the range of the parabola, not its reciprocal." },
            { t:"`[-1/9, 0) ∪ (0, ∞)`", why:"−1/9 is the top of the middle piece, not the bottom. Near the asymptotes it drops to −∞." }],
          hints:["Where is the turning point, and which pieces are above or below the axis?", "The outer pieces are above the axis and take every positive value. The middle piece is below, with its highest point at −1/9.", "Range: `(-∞, -1/9] ∪ (0, ∞)`."] },
        alg:["`x^2 - 2x - 8 = (x + 2)(x - 4)`.", "Vertex: `x` = (−2 + 4)/2 = 1, and `f(1) = 1 - 2 - 8 = -9`, so `1/f(1) = -1/9`.", "`f(0) = -8`, so the `y`-intercept is −1/8.", "Signs: test −3, 0, 5 → 7, −8, 7."],
        card:{ dom:"`{x ∈ ℝ | x ≠ -2, 4}`", rng:"`(-∞, -1/9] ∪ (0, ∞)`", yint:"(0, −1/8)", inc:"`(-∞, -2) ∪ (-2, 1)`", dec:"`(1, 4) ∪ (4, ∞)`" } },
      { id:"cf2", goal:[2, 3, 4, 5], eq:"`y = 1/(x^2 + 6x + 9)`", eqs:"`y = {1}/{x^2 + 6x + 9}`", a:1, d:-3, c:0, view:{ xmin:-8, xmax:2, ymin:-1.5, ymax:2.5 },
        s1:{ choices:[{ t:"Two zeros", fb:"`x^2 + 6x + 9 = (x + 3)^2`, which is 0 only at `x = -3`: a double zero." }, { t:"One zero", ok:true }, { t:"No zeros", fb:"`(x + 3)^2` is 0 at `x = -3`." }],
          hints:["Try to factor. If it won’t, complete the square.", "`x^2 + 6x + 9 = (x + 3)^2`.", "A perfect square, so one (double) zero: the case is one zero."] },
        s2:{ answer:[-3], wrong:[{ set:[3], fb:"`(x + 3)` is 0 at `x = -3`." }, { set:[-3, 3], fb:"There’s only one zero. `(x + 3)(x - 3)` would be `x^2 - 9`." }],
          hints:["Asymptotes are where `f(x) = 0`.", "Set each factor equal to 0.", "`x = -3`."] },
        s3:{ answer:["+", "+"], wrong:[{ signs:["-", "+"], fb:"`(x + 3)^2` is a square, so it’s positive on both sides of −3, and so is its reciprocal." }],
          hints:["Pick a test value in each interval.", "`f(-4) = 1` and `f(0) = 9`.", "+, +; `1/f` has the same signs."] },
        s4:{ tp:null, options:[
            { t:"None: the vertex (−3, 0) is on the `x`-axis, so it becomes the asymptote", ok:true, why:"1/0 has no value, so the vertex can’t become a turning point. It becomes the asymptote `x = -3`." },
            { t:"Local maximum (−3, 0)", why:"1/0 has no value, so there’s no point at `x = -3` at all." },
            { t:"Local minimum (−3, 0)", why:"1/0 has no value, so there’s no point at `x = -3` at all." },
            { t:"Local maximum (0, 1/9)", why:"(0, 1/9) is the `y`-intercept. The graph keeps rising toward the asymptote as `x` goes from 0 to −3, so it isn’t a maximum." }],
          hints:["Find the vertex (`d`, `c`) of `f`.", "The vertex is (−3, 0), a minimum on the `x`-axis.", "None: the vertex (−3, 0) is on the `x`-axis, so it becomes the asymptote."] },
        s5:{ answer:{ sides:[["+", "+"]], ends:["+", "+"] },
          named:[{ at:0, side:0, val:"-", fb:"That’s the `1/x` pattern. Here the denominator is squared, so it’s positive on the left too: +∞ on both sides." }],
          hints:["Use the signs from step 3 on each side of each asymptote.", "Positive and tiny → +∞; negative and tiny → −∞.", "As `x → -3^{-}`, `y → +∞`; as `x → -3^{+}`, `y → +∞`; at both ends, `y → 0^{+}`."] },
        s6:{ pieces:[{ a:0, b:null, aIn:false }], options:[
            { t:"`(0, ∞)`", ok:true, why:"Both pieces are above the axis and rise without bound near `x = -3`, and the graph never reaches 0." },
            { t:"`(0, 1/9]`", why:"1/9 is only the `y`-intercept. Near `x = -3` the graph rises without bound." },
            { t:"`(-∞, 0) ∪ (0, ∞)`", why:"Both pieces are above the axis, so no negative values." },
            { t:"`[0, ∞)`", why:"`1/f` is never 0, so 0 isn’t in the range." }],
          hints:["Where is the turning point, and which pieces are above or below the axis?", "There’s no turning point. Both pieces are above the axis and rise without bound near `x = -3`.", "Range: `(0, ∞)`."] },
        alg:["`x^2 + 6x + 9 = (x + 3)^2`, zero at −3 (order 2).", "`f(0) = 9`, so the `y`-intercept is 1/9.", "A square is never negative: + on both sides."],
        card:{ dom:"`{x ∈ ℝ | x ≠ -3}`", rng:"`(0, ∞)`", yint:"(0, 1/9)", inc:"`(-∞, -3)`", dec:"`(-3, ∞)`" } },
      { id:"cf3", goal:[2, 3, 4, 5], eq:"`y = 1/(x^2 - 4x + 8)`", eqs:"`y = {1}/{x^2 - 4x + 8}`", a:1, d:2, c:4, view:{ xmin:-3, xmax:7, ymin:-0.2, ymax:0.5 },
        s1:{ choices:[{ t:"Two zeros", fb:"Complete the square: `x^2 - 4x + 8 = (x - 2)^2 + 4`, which is at least 4. It never reaches 0." }, { t:"One zero", fb:"`(x - 2)^2` alone would touch the axis; the + 4 lifts the vertex to (2, 4)." }, { t:"No zeros", ok:true }],
          hints:["Try to factor. If it won’t, complete the square.", "`x^2 - 4x + 8 = (x - 2)^2 + 4`.", "It’s at least 4, so it’s never 0: the case is no zeros."] },
        s2:{ answer:[], wrong:[{ set:[2], fb:"`x = 2` is where the vertex is, but `f(2) = 4`, not 0." }],
          hints:["Asymptotes are where `f(x) = 0`.", "Set each factor equal to 0. Here `x^2 - 4x + 8 = (x - 2)^2 + 4` has no real factors.", "None."] },
        s3:{ answer:["+"], wrong:[{ signs:["-"], fb:"`f` is at least 4 everywhere, so `1/f` is positive everywhere." }],
          hints:["Pick a test value in each interval.", "`f(0) = 8`.", "+ everywhere; `1/f` has the same sign."] },
        s4:{ tp:[2, 0.25], tpLabel:"(2, 1/4) local max", options:[
            { t:"Local maximum (2, 1/4)", ok:true, why:"The parabola’s minimum (2, 4) becomes a local maximum at height 1/4." },
            { t:"Local minimum (2, 1/4)", why:"The parabola’s minimum turns into a maximum." },
            { t:"Local maximum (2, 4)", why:"The height is the reciprocal of 4." },
            { t:"Local maximum (0, 1/8)", why:"(0, 1/8) is the `y`-intercept; the graph is still climbing there." }],
          hints:["Find the vertex (`d`, `c`) of `f`.", "The vertex is (2, 4), a minimum.", "The turning point is a local maximum at (2, 1/4)."] },
        s5:{ answer:{ sides:[], ends:["+", "+"] },
          end:"`f` is positive, so `1/f` approaches 0 from above.",
          hints:["Use the signs from step 3 on each side of each asymptote.", "Positive and tiny → +∞; negative and tiny → −∞.", "There are no asymptotes. At both ends, `y → 0^{+}`."] },
        s6:{ pieces:[{ a:0, b:0.25, aIn:false, bIn:true }], options:[
            { t:"`(0, 1/4]`", ok:true, why:"One piece above the axis, with its highest point at 1/4; it never reaches 0." },
            { t:"`(0, ∞)`", why:"The graph never gets higher than its local maximum, 1/4." },
            { t:"`[4, ∞)`", why:"That’s the range of the parabola." },
            { t:"`[0, 1/4]`", why:"`1/f` is never 0." }],
          hints:["Where is the turning point, and which pieces are above or below the axis?", "One piece, above the axis, with its highest point at 1/4.", "Range: `(0, 1/4]`."] },
        alg:["Half of −4 is −2, (−2)² = 4, and 8 − 4 = 4, so `x^2 - 4x + 8 = (x - 2)^2 + 4 >= 4`.", "Vertex (2, 4), so the turning point is (2, 1/4).", "`f(0) = 8`, so the `y`-intercept is 1/8."],
        card:{ dom:"`{x ∈ ℝ}`", rng:"`(0, 1/4]`", yint:"(0, 1/8)", inc:"`(-∞, 2)`", dec:"`(2, ∞)`" } },
      { id:"cf4", goal:[2, 3, 4, 5], eq:"`y = 1/(-x^2 + 2x + 3)`", eqs:"`y = {1}/{-x^2 + 2x + 3}`", a:-1, d:1, c:4, view:{ xmin:-4, xmax:6, ymin:-1.5, ymax:1.5 },
        s1:{ choices:[{ t:"Two zeros", ok:true }, { t:"One zero", fb:"One zero needs a perfect square, such as `-(x - 1)^2`. Here the factors `(x + 1)` and `(x - 3)` are different, so there are two zeros." }, { t:"No zeros", fb:"A negative leading coefficient doesn’t mean no zeros. `-x^2 + 2x + 3 = -(x + 1)(x - 3)`: the vertex (1, 4) is above the axis and the parabola opens down, so it crosses twice." }],
          hints:["Try to factor. Take out −1 first.", "Taking out −1 leaves a trinomial that factors: `-x^2 + 2x + 3 = -(x + 1)(x - 3)`. Expand to check.", "Two different factors, so two zeros."] },
        s2:{ answer:[-1, 3], wrong:[{ set:[-3, 1], fb:"`-(x + 1)(x - 3)` is 0 at `x = -1` and `x = 3`." }, { set:[1], fb:"`x = 1` is the axis of symmetry." }],
          hints:["Asymptotes are where `f(x) = 0`.", "Set each factor equal to 0.", "`x = -1` and `x = 3`."] },
        s3:{ answer:["-", "+", "-"], wrong:[{ signs:["+", "-", "+"], fb:"This parabola opens down, so it’s positive <strong>between</strong> its zeros: `f(0) = 3`. And `1/f` has the same sign as `f`, not the opposite one." }],
          hints:["Pick a test value in each interval: −2, 0 and 4 work.", "`f(-2) = -5`, `f(0) = 3`, `f(4) = -5`.", "−, +, −, and `1/f` has the same signs."] },
        s4:{ tp:[1, 0.25], tpLabel:"(1, 1/4) local min", options:[
            { t:"Local minimum (1, 1/4)", ok:true, why:"The parabola’s maximum (1, 4) becomes a local minimum at height 1/4." },
            { t:"Local maximum (1, 1/4)", why:"The parabola’s vertex is a <strong>maximum</strong> here (it opens down), so the reciprocal has a local minimum." },
            { t:"Local minimum (1, 4)", why:"Right type, but the height is 1/4, the reciprocal of 4." },
            { t:"Local maximum (1, 4)", why:"(1, 4) is the parabola’s vertex. Flip both the height and the type." }],
          hints:["Complete the square: `-x^2 + 2x + 3 = -(x - 1)^2 + 4`.", "The vertex (1, 4) is a maximum, because the parabola opens down.", "A maximum of 4 becomes a local minimum of 1/4: the turning point is (1, 1/4)."] },
        s5:{ answer:{ sides:[["-", "+"], ["+", "-"]], ends:["-", "-"] },
          side:"Use the signs from step 3: left of −1, `f` is negative, so `1/f → -∞` there.",
          end:"Far out, `f` is large and negative, so `1/f → 0^{-}`.",
          hints:["Use the signs from step 3 on each side of each asymptote.", "Positive and tiny → +∞; negative and tiny → −∞.", "As `x → -1^{-}`, `y → -∞`; as `x → -1^{+}`, `y → +∞`; as `x → 3^{-}`, `y → +∞`; as `x → 3^{+}`, `y → -∞`; at both ends, `y → 0^{-}`."] },
        s6:{ pieces:[{ a:null, b:0, bIn:false }, { a:0.25, b:null, aIn:true }], options:[
            { t:"`(-∞, 0) ∪ [1/4, ∞)`", ok:true, why:"The outer pieces take every negative value; the middle piece starts at 1/4 and rises without bound." },
            { t:"`(-∞, 4]`", why:"That’s the range of the parabola." },
            { t:"`(-∞, 0) ∪ (0, ∞)`", why:"The middle piece never goes below its local minimum, 1/4. Values between 0 and 1/4 are never reached." },
            { t:"`(-∞, 0) ∪ (0, 1/4]`", why:"1/4 is the <strong>bottom</strong> of the middle piece, not its top." }],
          hints:["Which pieces are above the axis, and how low does the middle one go?", "The outer pieces are below the axis and take every negative value. The middle piece is above, with its lowest point at 1/4.", "Range: `(-∞, 0) ∪ [1/4, ∞)`."] },
        alg:["`-x^2 + 2x + 3 = -(x + 1)(x - 3) = -(x - 1)^2 + 4`.", "Vertex (1, 4) is a maximum.", "`f(0) = 3`, so the `y`-intercept is 1/3.", "Signs: test −2, 0, 4 → −5, 3, −5."],
        card:{ dom:"`{x ∈ ℝ | x ≠ -1, 3}`", rng:"`(-∞, 0) ∪ [1/4, ∞)`", yint:"(0, 1/3)", inc:"`(1, 3) ∪ (3, ∞)`", dec:"`(-∞, -1) ∪ (-1, 1)`" } }
    ],
    blocks:[{ title:"What the routine means", html:"<p><strong>Sketching `y = 1/f(x)` when `f` is a quadratic</strong></p><ol><li>Factor or complete the square to find the case: two zeros, one or none.</li><li>Zeros of `f` → vertical asymptotes. `y = 0` is always the horizontal asymptote, and the graph never touches it.</li><li>Signs of `f` → signs of `1/f` (the same).</li><li>Vertex (`d`, `c`) of `f` → turning point (`d`, 1/`c`) of `1/f`, with minimum ↔ maximum. No turning point if `c = 0`.</li><li>Near each asymptote, follow the sign on that side: positive → +∞, negative → −∞.</li><li>Range: read it off the pieces, remembering the turning point’s height and that 0 is never reached.</li></ol>" }],
    quickCheck:{
      title:"Three cases", summary:"Three cases quick check",
      items:[
        { id:"q1", goal:2, prompt:"How many vertical asymptotes does `y = 1/(x^2 + 9)` have?",
          choices:[{ t:"0", ok:true, fb:"Right. `x^2 + 9 >= 9`, so it’s never 0." }, { t:"1", fb:"There’s no double zero either: `x^2 + 9` is never 0." }, { t:"2", fb:"`x^2 + 9` doesn’t factor; `(x + 3)(x - 3)` is `x^2 - 9`." }] },
        { id:"q2", goal:2, prompt:"What does `y = 1/(x^2 - 10x + 25)` have at `x = 5`?",
          choices:[{ t:"Local maximum", fb:"The vertex is (5, 0), on the `x`-axis. 1/0 has no value, so there’s no turning point: there’s an asymptote." }, { t:"Local minimum", fb:"The vertex is (5, 0), on the `x`-axis. 1/0 has no value, so there’s no turning point: there’s an asymptote." }, { t:"Vertical asymptote", ok:true, fb:"Right. `x^2 - 10x + 25 = (x - 5)^2`, so the vertex (5, 0) is on the axis and becomes the asymptote." }] },
        { id:"q3", goal:3, prompt:"What does `y = 1/(x^2 - 6x + 5)` have at `x = 3`?",
          choices:[{ t:"Local max (3, −1/4)", ok:true, fb:"Right. `f(3) = 9 - 18 + 5 = -4`, a minimum of the parabola, so the reciprocal has a local maximum of −1/4." }, { t:"Local min (3, −1/4)", fb:"The parabola’s minimum becomes a maximum." }, { t:"Local min (3, −4)", fb:"That’s the parabola’s vertex unchanged." }, { t:"Vertical asymptote", fb:"`f(3) = -4`, not 0. The asymptotes are at `x = 1` and `x = 5`." }] },
        { id:"q4", goal:4, prompt:"For `y = 1/(4 - x^2)`, as `x → 2^{-}`, `y` → ?",
          choices:[{ t:"+∞", ok:true, fb:"Right. Just left of 2 (say 1.9), `4 - x^2 = 0.39` is small and positive, so its reciprocal is large and positive." }, { t:"−∞", fb:"Test `x = 1.9`: 4 − 3.61 = 0.39, which is positive." }, { t:"0", fb:"`4 - x^2` is approaching 0, so its reciprocal grows without bound." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"custom", title:"Match the graph", summary:"Match the graph", goal:[2, 3, 4, 5],
        instruction:"Match each equation to its graph.", how:"Tap an equation, then tap its graph.",
        view:{ xmin:-6, xmax:6, ymin:-1.5, ymax:1.5 },
        left:[
          { id:"l1", n:1, t:"`y = {1}/{x^2 - 4}`", hints:[MH1, MH2, "`x^2 - 4 = (x - 2)(x + 2)`: asymptotes `x = -2` and `x = 2`. Between them the denominator is negative with minimum −4, so the middle piece is below the axis with a local maximum at (0, −1/4); the outer pieces are above. That’s graph C."] },
          { id:"l2", n:2, t:"`y = {1}/{4 - x^2}`", hints:["Find the zeros of `4 - x^2`.", "`4 - x^2 = (2 - x)(2 + x)`: asymptotes at `x = ±2`. It opens down, with vertex (0, 4).", "Between ±2 the denominator is positive with maximum 4, so the middle piece is above the axis with a local minimum at (0, 1/4); the outer pieces are below. That’s graph F."] },
          { id:"l3", n:3, t:"`y = {1}/{x^2 + 4}`", hints:[MH1, MH2, "`x^2 + 4` has no zeros, so there are no asymptotes. Its minimum, 4 at `x = 0`, gives one hump above the axis with a local maximum at (0, 1/4). That’s graph A."] },
          { id:"l4", n:4, t:"`y = {1}/{-x^2 - 4}`", hints:[MH1, MH2, "`-x^2 - 4` has no zeros and is always negative, with maximum −4 at `x = 0`. So there are no asymptotes, and one dip below the axis with a local minimum at (0, −1/4). That’s graph H."] },
          { id:"l5", n:5, t:"`y = {1}/{x^2 - 4x + 4}`", hints:[MH1, MH2, "`x^2 - 4x + 4 = (x - 2)^2`: one asymptote at `x = 2`, no turning point, and both pieces above the axis, rising toward it. That’s graph E."] },
          { id:"l6", n:6, t:"`y = {1}/{x^2 + 4x + 4}`", hints:[MH1, MH2, "`x^2 + 4x + 4 = (x + 2)^2`: one asymptote at `x = -2`, no turning point, and both pieces above the axis, rising toward it. That’s graph B."] },
          { id:"l7", n:7, t:"`y = {1}/{-x^2 + 4x - 4}`", hints:["Take out −1 from the denominator and look for a perfect square.", "`-x^2 + 4x - 4 = -(x - 2)^2`: a double zero at `x = 2`, and the denominator is never positive.", "One asymptote at `x = 2`, with both pieces below the axis: graph G."] },
          { id:"l8", n:8, t:"`y = {1}/{x^2 + 4x}`", hints:[MH1, MH2, "`x^2 + 4x = x(x + 4)`: asymptotes `x = -4` and `x = 0`. The vertex (−2, −4) gives a middle piece below the axis with a local maximum at (−2, −1/4); the outer pieces are above. That’s graph D."] }
        ],
        graphs:[
          { id:"A", a:1, d:0, c:4, desc:"No asymptotes. One hump above the axis, with a local maximum at (0, 1/4)." },
          { id:"B", a:1, d:-2, c:0, desc:"One asymptote, `x = -2`. Both pieces above the axis, rising toward it." },
          { id:"C", a:1, d:0, c:-4, desc:"Asymptotes `x = -2` and `x = 2`. Outer pieces above the axis; middle piece below, with a local maximum at (0, −1/4)." },
          { id:"D", a:1, d:-2, c:-4, desc:"Asymptotes `x = -4` and `x = 0`. Outer pieces above the axis; middle piece below, with a local maximum at (−2, −1/4)." },
          { id:"E", a:1, d:2, c:0, desc:"One asymptote, `x = 2`. Both pieces above the axis, rising toward it." },
          { id:"F", a:-1, d:0, c:4, desc:"Asymptotes `x = -2` and `x = 2`. Outer pieces below the axis; middle piece above, with a local minimum at (0, 1/4)." },
          { id:"G", a:-1, d:2, c:0, desc:"One asymptote, `x = 2`. Both pieces below the axis, falling toward it." },
          { id:"H", a:-1, d:0, c:-4, desc:"No asymptotes. One dip below the axis, with a local minimum at (0, −1/4)." }
        ],
        answer:{ l1:"C", l2:"F", l3:"A", l4:"H", l5:"E", l6:"B", l7:"G", l8:"D" },
        wrong:PAIR, wrongDefault:"Compare the asymptotes first, then which side of the axis each piece is on.", tail:"Try another graph.",
        ui:{ eqs:"Equations", graphs:"Graphs", graph:"Graph", pick:"Tap an equation first, then tap its graph.", sel:"Selected", done:"All matched! You got {f} of {n} right on the first try, without the worked solution." } },
      { id:"wb", type:"custom", title:"Work backwards", summary:"Work backwards", star:true, goal:[6, 3, 5],
        instruction:"Each graph’s features are given. Fill in the boxes to make its equation.",
        how:"Type a number in each box (fractions like −1/2 are fine), then press Check.",
        generic:"This box doesn’t fit the features yet. Check it against each feature in turn.", tail:"Fix that box and press Check again.",
        empty:"Type a number in every box first.", azero:"`a` can’t be 0: then there’s no quadratic at all.",
        ui:{ item:"Graph {n} of 6", check:"Check", prev:"Previous", next:"Next graph", features:"Features" },
        items:[
          { id:"wb1", goal:[6, 2], tpl:"roots", features:"Vertical asymptotes `x = 1` and `x = 5`; `y`-intercept (0, 1/5)",
            view:{ xmin:-2, xmax:8, ymin:-1, ymax:1 }, asym:[1, 5], pts:[[0, 0.2, "(0, 1/5)"]],
            answer:{ a:1, r:[1, 5] },
            wrong:[{ box:"a", v:0.04, fb:"You made `f(0)` equal 1/5. The graph’s `y`-intercept is `1/f(0)`, so `f(0) = 5`." }, { box:"a", v:-1, fb:"(0 − 1)(0 − 5) = (−1)(−5) = +5, so `5a = 5`." }, { box:"r", v:[-1, -5], fb:"`x - r` is 0 at `x = r`: the asymptote `x = 1` needs `(x - 1)`." }],
            hints:["Asymptotes at 1 and 5 mean factors `(x - 1)` and `(x - 5)`.", "`f(0) = a(-1)(-5) = 5a`, and the `y`-intercept 1/5 means `f(0) = 5`.", "`5a = 5`, so `a = 1`: `y = 1/((x - 1)(x - 5))`."] },
          { id:"wb2", goal:[6, 2], tpl:"double", features:"One vertical asymptote, `x = -3`; passes through (−1, 1/8)",
            view:{ xmin:-7, xmax:1, ymin:-0.5, ymax:1 }, asym:[-3], pts:[[-1, 0.125, "(−1, 1/8)"]],
            answer:{ a:2, d:-3 },
            wrong:[{ box:"a", v:1 / 32, fb:"`4a = 1/8` uses the graph’s height as `f`’s. `f(-1)` is the reciprocal: 8." }, { box:"a", v:4, fb:"(−1 + 3)² = 4, not 2. Square it: `4a = 8`." }, { box:"d", v:3, fb:"The bracket must be 0 at `x = -3`, so `d = -3`." }],
            hints:["One asymptote means a double zero: `f(x) = a(x + 3)^2`.", "The point (−1, 1/8) means `f(-1) = 8`.", "`a(-1 + 3)^2 = 4a = 8`, so `a = 2`: `y = 1/(2(x + 3)^2)`."] },
          { id:"wb3", goal:[6, 3], tpl:"vertex", features:"No vertical asymptotes; local maximum (2, 1/5); passes through (0, 1/9)",
            view:{ xmin:-3, xmax:7, ymin:-0.1, ymax:0.3 }, asym:[], pts:[[2, 0.2, "(2, 1/5) local max"], [0, 1 / 9, "(0, 1/9)"]],
            answer:{ a:1, d:2, c:5 },
            wrong:[{ box:"c", v:0.2, fb:"The turning point’s height is 1/`c`, so `c = 5`." }, { box:"a", v:2.25, fb:"`f(0) = 4a + c`: don’t drop the `c`. `4a + 5 = 9`." }, { box:"a", neg:true, fb:"A local maximum of `1/f` comes from a minimum of `f`, so `a > 0`. (With `a < 0` and `c = 5`, the parabola would cross the axis twice and the graph would have asymptotes.)" }],
            hints:["The turning point (2, 1/5) comes from the vertex: `d = 2` and `c = 5`.", "The point (0, 1/9) means `f(0) = 9`.", "`a(0 - 2)^2 + 5 = 4a + 5 = 9`, so `a = 1`: `y = 1/((x - 2)^2 + 5)`."] },
          { id:"wb4", goal:[6, 3], tpl:"vertex", features:"Local minimum (2, 1/3); vertical asymptotes `x = -1` and `x = 5`",
            view:{ xmin:-3, xmax:7, ymin:-1.5, ymax:1.5 }, asym:[-1, 5], pts:[[2, 1 / 3, "(2, 1/3) local min"]],
            answer:{ a:-1 / 3, d:2, c:3 },
            wrong:[{ box:"a", v:1 / 3, fb:"A local minimum of `1/f` comes from a maximum of `f`, so `a < 0`." }, { box:"a", v:-1, fb:"`f(5) = a(5 - 2)^2 + 3 = 9a + 3`. Square the 3." }, { box:"c", v:1 / 3, fb:"The height of the turning point is 1/`c`, so `c = 3`." }],
            hints:["The turning point gives `d = 2` and `c = 3`, and a local minimum needs `a < 0`.", "The asymptote `x = 5` means `f(5) = 0`.", "`a(5 - 2)^2 + 3 = 9a + 3 = 0`, so `a = -1/3`: `y = 1/(-{1}/{3}(x - 2)^2 + 3)`."] },
          { id:"wb5", goal:[6, 5], tpl:"vertex", features:"Range `(-∞, -1/2] ∪ (0, ∞)`; vertical asymptotes `x = -1` and `x = 3`",
            view:{ xmin:-4, xmax:6, ymin:-1.5, ymax:1.5 }, asym:[-1, 3], pts:[], range:[{ a:null, b:-0.5, bIn:true }, { a:0, b:null, aIn:false }],
            answer:{ a:0.5, d:1, c:-2 },
            wrong:[{ box:"c", v:-0.5, fb:"The range’s −1/2 is the turning point’s height, which is 1/`c`, so `c = -2`." }, { box:"a", v:1, fb:"`f(3) = a(3 - 1)^2 - 2 = 4a - 2`. Square the 2." }, { box:"d", v:2, fb:"The asymptotes are 4 apart, but the axis is halfway between them: `d = 1`." }, { box:"a", v:-0.5, fb:"A range topping out at −1/2 means a local maximum, so the parabola opens up: `a > 0`." }],
            hints:["The axis of symmetry is halfway between the asymptotes: `d = 1`. The range tops out at −1/2, so that’s a local maximum.", "A local maximum at height −1/2 means `c = -2` and `a > 0`. The asymptote `x = 3` means `f(3) = 0`.", "`a(3 - 1)^2 - 2 = 4a - 2 = 0`, so `a = 1/2`: `y = 1/({1}/{2}(x - 1)^2 - 2)`."] },
          { id:"wb6", goal:[6, 5], tpl:"vertex", features:"Range `[-1/2, 0)`; passes through (−3, −1/6) and (1, −1/6)",
            view:{ xmin:-5, xmax:3, ymin:-0.8, ymax:0.2 }, asym:[], pts:[[-3, -1 / 6, "(−3, −1/6)"], [1, -1 / 6, "(1, −1/6)"]], range:[{ a:-0.5, b:0, aIn:true, bIn:false }],
            answer:{ a:-1, d:-1, c:-2 },
            wrong:[{ box:"c", v:-0.5, fb:"The range starts at the turning point’s height, 1/`c` = −1/2, so `c = -2`." }, { box:"d", v:1, fb:"Two points at the same height sit symmetrically about the axis: halfway between −3 and 1 is −1." }, { box:"a", v:1, fb:"With `a > 0` and `c < 0` the parabola crosses the axis, so the graph would have asymptotes. A range of `[-1/2, 0)` means it stays below the axis: `a < 0`." }, { box:"a", v:11 / 24, fb:"You used −1/6 as `f(1)`. The graph’s height is −1/6, so `f(1) = -6`." }],
            hints:["The two points have the same height, so the axis is halfway between `x = -3` and `x = 1`: `d = -1`.", "The range `[-1/2, 0)` is all below the axis and starts at −1/2: a local minimum at height −1/2, so `c = -2`, and no asymptotes, so `a < 0`.", "The point (1, −1/6) means `f(1) = -6`: `a(1 + 1)^2 - 2 = 4a - 2 = -6`, so `a = -1`: `y = 1/(-(x + 1)^2 - 2)`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Leila", how:"", goal:[2, 3, 4],
        instruction:"Leila made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the vertical asymptotes and the domain of `y = 1/(x^2 + 16)`.",
            steps:["The vertical asymptotes come from the zeros of the denominator, `x^2 + 16`.", "`x^2 + 16 = (x + 4)(x - 4)`.", "So `x^2 + 16 = 0` at `x = -4` and `x = 4`.", "The vertical asymptotes are `x = -4` and `x = 4`.", "Domain: `{x ∈ ℝ | x ≠ -4, 4}`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 follows from step 2. The mistake is earlier.", "Step 4 follows from step 2. The mistake is earlier.", "Step 5 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"`x^2 + 16` doesn’t factor. Since `x^2 >= 0`, `x^2 + 16 >= 16`, so it’s never 0: no vertical asymptotes, and the domain is `{x ∈ ℝ}`.", ok:true, why:"A sum of squares is never 0, so there’s nothing to divide by zero." },
              { t:"`x^2 + 16 = (x + 4)^2`, so the only asymptote is `x = -4`.", why:"`(x + 4)^2 = x^2 + 8x + 16`. Expand to check." },
              { t:"`x^2 + 16 = (x + 16)(x - 16)`, so the asymptotes are `x = ±16`.", why:"`(x + 16)(x - 16) = x^2 - 256`." },
              { t:"Step 2 is correct as written.", why:"`(x + 4)(x - 4) = x^2 - 16`, a <strong>difference</strong> of squares. `x^2 + 16` is a sum." }],
            hints:["Expand step 2’s factors and compare with `x^2 + 16`.", "`(x + 4)(x - 4) = x^2 - 16`. Can `x^2 + 16` ever be 0?", "Step 2 is wrong. `x^2 + 16 >= 16`, so there are no zeros, no vertical asymptotes, and the domain is `{x ∈ ℝ}`."] },
          { id:"e2", goal:3, task:"Find the turning point and the range of `y = 1/(x^2 - 8x + 12)`.",
            steps:["`x^2 - 8x + 12 = (x - 2)(x - 6)`, so the vertical asymptotes are `x = 2` and `x = 6`.", "The vertex is halfway between the zeros, at `x = 4`, and `f(4) = 16 - 32 + 12 = -4`.", "The parabola has a minimum at (4, −4), so the reciprocal also has a minimum there, at (4, −1/4).", "So on the middle piece, between `x = 2` and `x = 6`, the reciprocal’s values are −1/4 or more.", "Range: `[-1/4, 0) ∪ (0, ∞)`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: the vertex is (4, −4).", "", "Step 4 follows from step 3. The mistake is earlier.", "Step 5 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"A minimum of `f` becomes a local <strong>maximum</strong> of `1/f`. The reciprocal has a local maximum at (4, −1/4), so its range is `(-∞, -1/4] ∪ (0, ∞)`.", ok:true, why:"On the middle piece, `f` is between −4 and 0, so `1/f` is −1/4 or <strong>less</strong>." },
              { t:"The reciprocal has a local minimum at (4, −4).", why:"That keeps the parabola’s vertex unchanged. The height must be flipped to −1/4." },
              { t:"The reciprocal has a local maximum at (4, −4).", why:"The type is fixed, but the height still has to be the reciprocal of −4." },
              { t:"Step 3 is correct as written.", why:"Test `x = 3`: `f(3) = -3`, and 1/(−3) = −1/3, which is <strong>below</strong> −1/4. So −1/4 is the top of the middle piece." }],
            hints:["Test a value near the vertex, such as `x = 3`. Is `1/f(3)` above or below −1/4?", "`f(3) = 9 - 24 + 12 = -3`, so `1/f(3) = -1/3 < -1/4`. The reciprocal is lower beside the vertex.", "Step 3 is wrong: the minimum of `f` becomes a local maximum of `1/f`, at (4, −1/4). The range is `(-∞, -1/4] ∪ (0, ∞)`."] },
          { id:"e3", goal:4, task:"Find where `y = 1/(x^2 - 9)` is increasing and where it is decreasing.",
            steps:["`x^2 - 9 = (x + 3)(x - 3)`, so the vertical asymptotes are `x = -3` and `x = 3`.", "The parabola `y = x^2 - 9` decreases on `(-∞, 0)` and increases on `(0, ∞)`.", "So the reciprocal also decreases on `(-∞, 0)` and increases on `(0, ∞)`, except at the asymptotes.", "Answer: decreasing on `(-∞, -3) ∪ (-3, 0)`; increasing on `(0, 3) ∪ (3, ∞)`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: its vertex is (0, −9), a minimum.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Where `f` decreases, `1/f` increases, and the other way round. So the reciprocal is increasing on `(-∞, -3) ∪ (-3, 0)` and decreasing on `(0, 3) ∪ (3, ∞)`.", ok:true, why:"Bigger values of `f` (with the same sign) give smaller reciprocals, so the directions swap." },
              { t:"The reciprocal decreases everywhere, because `1/x` is decreasing.", why:"Test `x = -5` and `x = -4`: `f` = 16 and 7, so `1/f` goes from 1/16 up to 1/7. It’s increasing there." },
              { t:"The reciprocal is increasing on `(-∞, 0)` and decreasing on `(0, ∞)`.", why:"The directions are right, but `1/f` isn’t defined at `x = ±3`. The asymptotes must split the intervals." },
              { t:"Step 3 is correct as written.", why:"Test `x = -5` and `x = -4`: `f` goes down from 16 to 7, but `1/f` goes <strong>up</strong> from 1/16 to 1/7." }],
            hints:["Compare the parabola and its reciprocal at two nearby points, such as `x = -5` and `x = -4`.", "`f(-5) = 16` and `f(-4) = 7`: `f` is decreasing. What do 1/16 and 1/7 do?", "Step 3 is wrong: `1/f` moves the opposite way to `f`. Increasing on `(-∞, -3) ∪ (-3, 0)`; decreasing on `(0, 3) ∪ (3, ∞)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you plotted reciprocal points by hand, or when you slid the parabola through the three cases?" },
      { id:"j2", q:"In your own words, why does a zero of the quadratic become a vertical asymptote, and why does its vertex become a turning point of the opposite type?" },
      { id:"j3", q:"Explain to a friend, step by step, how to sketch `y = 1/(x^2 - 2x - 8)` without technology." },
      { id:"j4", q:"Which feature of these graphs is still tricky for you (signs near an asymptote, the range, increasing intervals, …)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What are the vertical asymptotes of `y = 1/(x^2 - x - 6)`?", options:[
          { t:"`x = -2` and `x = 3`", ok:true, why:"`x^2 - x - 6 = (x + 2)(x - 3)`, which is 0 at `x = -2` and `x = 3`." },
          { t:"`x = 2` and `x = -3`", why:"Those make `x - 2` and `x + 3` zero. The factors are `(x + 2)(x - 3)`, so the zeros have the opposite signs: −2 and 3." },
          { t:"`x = -1` and `x = 6`", why:"`(x + 1)(x - 6) = x^2 - 5x - 6`. The product is right, but the middle term isn’t." },
          { t:"`x = 1/2` only", why:"`x = 1/2` is the axis of symmetry, where the turning point is. Asymptotes come from zeros." }] },
        b:{ prompt:"What are the vertical asymptotes of `y = 1/(x^2 + 2x - 8)`?", options:[
          { t:"`x = -4` and `x = 2`", ok:true, why:"`x^2 + 2x - 8 = (x + 4)(x - 2)`, which is 0 at `x = -4` and `x = 2`." },
          { t:"`x = 4` and `x = -2`", why:"The zeros have the opposite signs to the numbers in the brackets: −4 and 2." },
          { t:"`x = -8` and `x = 1`", why:"`(x + 8)(x - 1) = x^2 + 7x - 8`. The product is right, but the middle term isn’t." },
          { t:"`x = -1` only", why:"`x = -1` is the axis of symmetry, where the turning point is. Asymptotes come from zeros." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Where is the local maximum of `y = 1/(x^2 + 6x + 13)`?", options:[
          { t:"(−3, 1/4)", ok:true, why:"`x^2 + 6x + 13 = (x + 3)^2 + 4`. Its minimum, 4 at `x = -3`, becomes the reciprocal’s maximum, 1/4." },
          { t:"(−3, 4)", why:"(−3, 4) is the parabola’s vertex. The reciprocal’s height there is 1/4." },
          { t:"(3, 1/4)", why:"`(x + 3)^2` is smallest at `x = -3`, not 3." },
          { t:"(0, 1/13)", why:"(0, 1/13) is the `y`-intercept. The turning point is at the vertex’s `x`-value, −3." }] },
        b:{ prompt:"Where is the local maximum of `y = 1/(x^2 - 8x + 18)`?", options:[
          { t:"(4, 1/2)", ok:true, why:"`x^2 - 8x + 18 = (x - 4)^2 + 2`. Its minimum, 2 at `x = 4`, becomes the reciprocal’s maximum, 1/2." },
          { t:"(4, 2)", why:"(4, 2) is the parabola’s vertex. The reciprocal’s height there is 1/2." },
          { t:"(−4, 1/2)", why:"`(x - 4)^2` is smallest at `x = 4`, not −4." },
          { t:"(0, 1/18)", why:"(0, 1/18) is the `y`-intercept. The turning point is at the vertex’s `x`-value, 4." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"The point (3, 4) is on the graph of `y = f(x)`. Which point must be on the graph of `y = 1/f(x)`?", options:[
          { t:"(3, 1/4)", ok:true, why:"Same `x`; the height 4 becomes 1/4." },
          { t:"(1/3, 4)", why:"The reciprocal changes the height, not the `x`-value." },
          { t:"(4, 3)", why:"Swapping the coordinates gives the inverse `f^{-1}`, not the reciprocal `1/f`." },
          { t:"(3, −4)", why:"`1/f` keeps the sign. The reciprocal of 4 is 1/4, not −4." }] },
        b:{ prompt:"The point (−2, −5) is on the graph of `y = f(x)`. Which point must be on the graph of `y = 1/f(x)`?", options:[
          { t:"(−2, −1/5)", ok:true, why:"Same `x`; the height −5 becomes −1/5, keeping its sign." },
          { t:"(−1/2, −5)", why:"The reciprocal changes the height, not the `x`-value." },
          { t:"(−5, −2)", why:"Swapping the coordinates gives the inverse `f^{-1}`, not the reciprocal `1/f`." },
          { t:"(−2, 1/5)", why:"`1/f` keeps the sign: the reciprocal of −5 is −1/5." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"On which intervals is `y = 1/(x^2 + 6x)` increasing?", options:[
          { t:"`(-∞, -6) ∪ (-6, -3)`", ok:true, why:"`x^2 + 6x = x(x + 6)` has its vertex at `x = -3` and decreases on `(-∞, -3)`. Where `f` decreases, `1/f` increases, and the asymptote `x = -6` splits the interval." },
          { t:"`(-3, 0) ∪ (0, ∞)`", why:"That’s where the parabola increases. The reciprocal moves the opposite way." },
          { t:"`(-∞, -3)`", why:"`x = -6` is a vertical asymptote: `1/f` isn’t defined there, so the interval must be split at −6." },
          { t:"`(-∞, -6) ∪ (0, ∞)`", why:"That’s where the reciprocal is positive, not where it’s increasing." }] },
        b:{ prompt:"On which intervals is `y = 1/(x^2 + 4x - 5)` decreasing?", options:[
          { t:"`(-2, 1) ∪ (1, ∞)`", ok:true, why:"`x^2 + 4x - 5 = (x + 5)(x - 1)` has its vertex at `x = -2` and increases on `(-2, ∞)`. Where `f` increases, `1/f` decreases, and the asymptote `x = 1` splits the interval." },
          { t:"`(-∞, -5) ∪ (-5, -2)`", why:"That’s where the parabola decreases. The reciprocal moves the opposite way." },
          { t:"`(-2, ∞)`", why:"`x = 1` is a vertical asymptote, so the interval must be split at 1." },
          { t:"`(-∞, -5) ∪ (1, ∞)`", why:"That’s where the reciprocal is positive, not where it’s decreasing." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"The graph of `y = 1/f(x)`, where `f` is a quadratic, has two vertical asymptotes and a local minimum at (2, 1/4). Which could be `f(x)`?", options:[
          { t:"`f(x) = -(x - 2)^2 + 4`", ok:true, why:"The turning point (2, 1/4) comes from the vertex (2, 4). A local minimum of `1/f` comes from a maximum of `f`, so the parabola opens down; with its vertex above the axis, it has two zeros." },
          { t:"`f(x) = (x - 2)^2 + 4`", why:"This parabola opens up, so the reciprocal has a local <strong>maximum</strong> at (2, 1/4). It also has no zeros, so no asymptotes." },
          { t:"`f(x) = -(x - 2)^2 + 1/4`", why:"This gives a local minimum at (2, 4). The vertex height of `f` must be the reciprocal of 1/4, which is 4." },
          { t:"`f(x) = -(x + 2)^2 + 4`", why:"The turning point is at `x = 2`, so the vertex is at `x = 2`: `(x - 2)^2`." }] },
        b:{ prompt:"The graph of `y = 1/f(x)`, where `f` is a quadratic, has two vertical asymptotes and a local maximum at (−1, −1/3). Which could be `f(x)`?", options:[
          { t:"`f(x) = (x + 1)^2 - 3`", ok:true, why:"The turning point (−1, −1/3) comes from the vertex (−1, −3). A local maximum of `1/f` comes from a minimum of `f`, so the parabola opens up; with its vertex below the axis, it has two zeros." },
          { t:"`f(x) = -(x + 1)^2 - 3`", why:"This parabola opens down and stays below the axis: no zeros, and the reciprocal has a local <strong>minimum</strong> at (−1, −1/3)." },
          { t:"`f(x) = (x + 1)^2 - 1/3`", why:"This gives a local maximum at (−1, −3). The vertex height of `f` must be the reciprocal of −1/3, which is −3." },
          { t:"`f(x) = (x - 1)^2 - 3`", why:"The turning point is at `x = -1`, so the vertex is at `x = -1`: `(x + 1)^2`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"What is the range of `y = 1/(x^2 + 2x - 15)`?", options:[
          { t:"`(-∞, -1/16] ∪ (0, ∞)`", ok:true, why:"`x^2 + 2x - 15 = (x + 1)^2 - 16`. Between the asymptotes `x = -5` and `x = 3` the middle piece climbs to a local maximum of −1/16 at `x = -1`. The outer pieces take every positive value." },
          { t:"`[-16, ∞)`", why:"That’s the range of the parabola, not of its reciprocal." },
          { t:"`(-∞, 0) ∪ (0, ∞)`", why:"The middle piece never gets above −1/16, so values between −1/16 and 0 are never reached." },
          { t:"`[-1/16, 0) ∪ (0, ∞)`", why:"−1/16 is the <strong>highest</strong> value of the middle piece, not its lowest. Near the asymptotes it drops to −∞." }] },
        b:{ prompt:"What is the range of `y = 1/(x^2 - 4x - 5)`?", options:[
          { t:"`(-∞, -1/9] ∪ (0, ∞)`", ok:true, why:"`x^2 - 4x - 5 = (x - 2)^2 - 9`. Between the asymptotes `x = -1` and `x = 5` the middle piece climbs to a local maximum of −1/9 at `x = 2`. The outer pieces take every positive value." },
          { t:"`[-9, ∞)`", why:"That’s the range of the parabola, not of its reciprocal." },
          { t:"`(-∞, 0) ∪ (0, ∞)`", why:"The middle piece never gets above −1/9, so values between −1/9 and 0 are never reached." },
          { t:"`[-1/9, 0) ∪ (0, ∞)`", why:"−1/9 is the <strong>highest</strong> value of the middle piece, not its lowest." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly describes `y = 1/(x^2 - 1)` near `x = 1`?", options:[
          { t:"“As `x → 1^{-}`, `y → -∞`, and as `x → 1^{+}`, `y → +∞`.”", ok:true, why:"Just left of 1 (say 0.9), `x^2 - 1 = -0.19` is small and negative; just right of 1 it’s small and positive." },
          { t:"“As `x → 1`, `y → ∞`.”", why:"This ignores the two sides. Just left of 1, `x^2 - 1` is negative, so `y → -∞` there." },
          { t:"“As `x → 1^{-}`, `y → +∞`, and as `x → 1^{+}`, `y → -∞`.”", why:"The sides are swapped. Test `x = 0.9`: 0.81 − 1 = −0.19, which is negative." },
          { t:"“As `x → 1^{-}`, `y → 0^{-}`, and as `x → 1^{+}`, `y → 0^{+}`.”", why:"That describes `x^2 - 1` itself, which approaches 0. Its reciprocal grows without bound." }] },
        b:{ prompt:"Which statement correctly describes `y = 1/(4 - x^2)` near `x = -2`?", options:[
          { t:"“As `x → -2^{-}`, `y → -∞`, and as `x → -2^{+}`, `y → +∞`.”", ok:true, why:"Just left of −2 (say −2.1), `4 - x^2 = -0.41` is small and negative; just right (−1.9) it’s 0.39, small and positive." },
          { t:"“As `x → -2`, `y → ∞`.”", why:"This ignores the two sides. Just left of −2, `4 - x^2` is negative, so `y → -∞` there." },
          { t:"“As `x → -2^{-}`, `y → +∞`, and as `x → -2^{+}`, `y → -∞`.”", why:"The sides are swapped. Test `x = -2.1`: 4 − 4.41 = −0.41, which is negative." },
          { t:"“As `x → -2^{-}`, `y → 0^{-}`, and as `x → -2^{+}`, `y → 0^{+}`.”", why:"That describes `4 - x^2` itself, which approaches 0. Its reciprocal grows without bound." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why `y = 1/(x^2 + 2)` has a local maximum at `x = 0`?", options:[
          { t:"“`x^2 + 2` is smallest at `x = 0`, so 1 divided by it is largest there, 1/2.”", ok:true, why:"This links the parabola’s minimum to the reciprocal’s maximum and says why: dividing 1 by a smaller positive number gives a larger result." },
          { t:"“`x^2 + 2` is largest at `x = 0`, so 1 divided by it is largest there too.”", why:"That misreads the parabola: `x^2` is never negative, so `x^2 + 2` is <strong>smallest</strong> at `x = 0`. And a reciprocal reverses sizes: a larger positive `f` gives a smaller `1/f`." },
          { t:"“`x^2 + 2` is smallest at `x = 0`, so 1 divided by it is smallest there too.”", why:"Dividing 1 by a smaller positive number gives a <strong>larger</strong> result: 1/2 at `x = 0` beats 1/3 at `x = 1`. So the smallest `f` gives the largest `1/f`." },
          { t:"“Reciprocals turn small into large, so every parabola’s vertex becomes a local maximum.”", why:"That over-generalizes the vertex rule. A parabola’s <strong>maximum</strong> becomes a local <strong>minimum</strong>: `1/(-x^2 - 2)` dips to −1/2 at `x = 0`. It works here only because `x^2 + 2` has its minimum at `x = 0`." }] },
        b:{ prompt:"Which is the best explanation of why `y = 1/(x^2 - 2x + 5) = 1/((x - 1)^2 + 4)` has a local maximum at `x = 1`?", options:[
          { t:"“`(x - 1)^2 + 4` is smallest at `x = 1`, so 1 divided by it is largest there, 1/4.”", ok:true, why:"This links the parabola’s minimum to the reciprocal’s maximum and says why: dividing 1 by a smaller positive number gives a larger result." },
          { t:"“`(x - 1)^2 + 4` is largest at `x = 1`, so 1 divided by it is largest there too.”", why:"That misreads the parabola: `(x - 1)^2` is never negative, so `(x - 1)^2 + 4` is <strong>smallest</strong> at `x = 1`. And a reciprocal reverses sizes: a larger positive `f` gives a smaller `1/f`." },
          { t:"“`(x - 1)^2 + 4` is smallest at `x = 1`, so 1 divided by it is smallest there too.”", why:"Dividing 1 by a smaller positive number gives a <strong>larger</strong> result: 1/4 at `x = 1` beats 1/5 at `x = 0`. So the smallest `f` gives the largest `1/f`." },
          { t:"“Reciprocals turn small into large, so every parabola’s vertex becomes a local maximum.”", why:"That over-generalizes the vertex rule. A parabola’s <strong>maximum</strong> becomes a local <strong>minimum</strong>: `1/(-(x - 1)^2 - 4)` dips to −1/4 at `x = 1`. It works here only because `(x - 1)^2 + 4` has its minimum at `x = 1`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A light hangs 3 m above a straight path. The brightness at a point on the path, `x` metres from the spot directly below the light, is modelled by `L(x) = 90/(x^2 + 9)` lux. How far from that spot is the brightness half of its greatest value?", options:[
          { t:"3 m", ok:true, why:"The greatest value is `L(0)` = 90/9 = 10 lux, where `x^2 + 9` is smallest. Half is 5: `90/(x^2 + 9) = 5` gives `x^2 + 9 = 18`, so `x^2 = 9` and `x = 3`." },
          { t:"1.5 m", why:"Halving the distance doesn’t halve the brightness. Check: `L(1.5)` = 90/11.25 = 8, not 5." },
          { t:"`3√2` m", why:"That solves `90/x^2 = 5` and leaves out the + 9 in the denominator." },
          { t:"9 m", why:"That’s `x^2`, not `x`. Take the square root: `x = 3`." }] },
        b:{ prompt:"A speaker is mounted 4 m above a walkway. The sound level at a point on the walkway, `x` metres from the spot directly below the speaker, is modelled by `S(x) = 160/(x^2 + 16)` units. How far from that spot is the level half of its greatest value?", options:[
          { t:"4 m", ok:true, why:"The greatest value is `S(0)` = 160/16 = 10. Half is 5: `160/(x^2 + 16) = 5` gives `x^2 + 16 = 32`, so `x^2 = 16` and `x = 4`." },
          { t:"2 m", why:"Halving the distance doesn’t halve the level. Check: `S(2)` = 160/20 = 8, not 5." },
          { t:"`4√2` m", why:"That solves `160/x^2 = 5` and leaves out the + 16 in the denominator." },
          { t:"16 m", why:"That’s `x^2`, not `x`. Take the square root: `x = 4`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Where does the graph of `y = 1/(x^2 - 4) + 1` cross the `x`-axis?", options:[
          { t:"At `x = -√3` and `x = √3`", ok:true, why:"`y = 0` means `1/(x^2 - 4) = -1`, so `x^2 - 4 = -1` and `x^2 = 3`." },
          { t:"At `x = -2` and `x = 2`", why:"Those are the vertical asymptotes: the graph isn’t defined there." },
          { t:"At `x = -√5` and `x = √5`", why:"That solves `x^2 - 4 = 1`. You need `1/(x^2 - 4) = -1`, so `x^2 - 4 = -1`." },
          { t:"Nowhere: it never crosses the `x`-axis.", why:"`1/(x^2 - 4)` is never 0, but adding 1 lifts the graph. Now `y = 0` wherever `1/(x^2 - 4) = -1`." }] },
        b:{ prompt:"Where does the graph of `y = 1/(x^2 - 9) + 1` cross the `x`-axis?", options:[
          { t:"At `x = -2√2` and `x = 2√2`", ok:true, why:"`y = 0` means `1/(x^2 - 9) = -1`, so `x^2 - 9 = -1` and `x^2 = 8`." },
          { t:"At `x = -3` and `x = 3`", why:"Those are the vertical asymptotes: the graph isn’t defined there." },
          { t:"At `x = -√10` and `x = √10`", why:"That solves `x^2 - 9 = 1`. You need `1/(x^2 - 9) = -1`, so `x^2 - 9 = -1`." },
          { t:"Nowhere: it never crosses the `x`-axis.", why:"`1/(x^2 - 9)` is never 0, but adding 1 lifts the graph. Now `y = 0` wherever `1/(x^2 - 9) = -1`." }] } }
    ]
  },
  task:{
    title:"Design a reciprocal", summary:"Design a reciprocal",
    statement:"<p>Choose `a`, `d` and `c` so that the graph of `y = 1/(a(x - d)^2 + c)` has all three features below. There’s more than one answer. Can you find them all?</p>",
    checks:["Range: `(-∞, -1/4] ∪ (0, ∞)`", "Two vertical asymptotes, both at whole numbers", "`y`-intercept: (0, −1/3)"],
    tips:[
      "Right now your range is {range}. A range of `(-∞, -1/4] ∪ (0, ∞)` means a middle piece that tops out at −1/4: a local <strong>maximum</strong> at height −1/4. Which vertex height and which way of opening give that?",
      "Right now your asymptotes are {list}. They sit at `d - √{-c/a}` and `d + √{-c/a}`. For whole numbers, `√{-c/a}` has to come out nicely.",
      "Substitute `x = 0`: the `y`-intercept is `1/(a · d^2 + c)`. Right now `a · d^2 + c` = {v}; you need −3."
    ],
    ui:{ a:"`@a{a}`", d:"`@d{d}`", c:"`@c{c}`", dBad:"Use a multiple of 1/2 from −5 to 5", cBad:"Use a whole number from −9 to 9", minus:"Decrease", plus:"Increase",
      eq:"Your function", va:"Vertical asymptotes", yint:"`y`-intercept", tp:"Turning point", rng:"Range", none:"none", noTp:"none: the vertex is on the `x`-axis", lmax:"local maximum", lmin:"local minimum" },
    explainPrompt:"Explain how each feature told you something about `a`, `d` or `c`.",
    vocab:"Use the words vertex, local maximum, vertical asymptote and range.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    all4:"You found all four. Each one has `c = -4` (from the range) and `a · d^2 = 1` (from the `y`-intercept). On these inputs that leaves `a = 1` with `d = ±1`, `a = 1/4` with `d = ±2`, and `a = 4` with `d = ±1/2`, and only the first two put both asymptotes at whole numbers."
  },
  cards:[
    ["From `y = f(x)` to `y = 1/f(x)`", "Each point keeps its `x`; its height `h` becomes 1/`h`, with the same sign. Example: (6, 3) → (6, 1/3)."],
    ["Zeros of `f`", "They become vertical asymptotes of `1/f`. Example: `x^2 - 4x = x(x - 4)` gives `x = 0` and `x = 4`."],
    ["Horizontal asymptote of `1/f` (`f` quadratic)", "Always `y = 0`, approached from above if `a > 0` and from below if `a < 0`."],
    ["Points that stay put", "Where `f(x) = 1` or `f(x) = -1`, since 1/1 = 1 and 1/(−1) = −1."],
    ["Two zeros (`a > 0`)", "Three pieces: outer pieces above the axis, middle piece below with a local maximum (`d`, 1/`c`). Range `(-∞, 1/c] ∪ (0, ∞)`."],
    ["One zero: `f(x) = a(x - d)^2`", "One asymptote `x = d`; both pieces on the same side (up if `a > 0`); no turning point; range `(0, ∞)` if `a > 0`."],
    ["No zeros (`a > 0`)", "One piece, a hump above the axis, with a local maximum (`d`, 1/`c`). Range `(0, 1/c]`."],
    ["The vertex rule", "Vertex (`d`, `c`) of `f` → turning point (`d`, 1/`c`) of `1/f`, with minimum ↔ maximum. None if `c = 0`."],
    ["Increasing and decreasing", "`1/f` increases where `f` decreases, and the other way round, split at every asymptote."],
    ["Behaviour near a vertical asymptote", "Follow the sign of `f` on each side: positive → +∞, negative → −∞. `1/(x^2 - 4x)`: as `x → 0^{-}`, `y → +∞`; as `x → 0^{+}`, `y → -∞`."],
    ["`x`-intercepts of `1/f`", "None. A fraction with numerator 1 is never 0."],
    ["Reciprocal vs inverse", "`1/f(x)` keeps `x` and flips the height: (6, 3) → (6, 1/3). `f^{-1}` swaps `x` and `y`: (6, 3) → (3, 6). They’re different things."]
  ]
};
