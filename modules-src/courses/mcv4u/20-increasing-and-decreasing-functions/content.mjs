// MCV4U 20 Increasing and Decreasing Functions. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/20-increasing-and-decreasing-functions.md
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "`f′ < 0` says the graph is falling. It can fall while it’s above the axis.";
const M2 = "Direction changes come from `f′`. The zeros of `f` are where it crosses the axis.";
const M3 = "`x = 0` isn’t in the domain, so (−2, 0) and (0, 2) are separate: `f(-1) = -5 < f(1) = 5`.";
const M4 = "`(x - 1)^2` is never negative, so `f′` keeps its sign through `x = 1`.";
const M5 = "`x^3` rises on both sides of 0; one level point doesn’t break ‘increasing’.";
const M6 = "Adding a constant doesn’t change any slope, so `f + C` fits too.";
const M7 = "`f(x + 2)` moves the graph <strong>left</strong> 2, so (1, 3) becomes (−1, 1).";
// the hero equation: two implications, the arrows carry the meaning in words for screen readers (eqLabel)
const HERO_EQ = '<span class="id-heq"><span>`f′(x) > 0` ⟹ `f` <span class="id-har">↗</span></span><span class="id-hdot" aria-hidden="true">·</span><span>`f′(x) < 0` ⟹ `f` <span class="id-har">↘</span></span></span>';

export default {
  id:"20-increasing-and-decreasing-functions",
  kind:"topic",
  title:"Increasing and decreasing functions",
  topic:"Increasing and Decreasing Functions",
  readyTopic:"increasing and decreasing functions",
  hero:{
    eq:HERO_EQ,
    eqLabel:"f prime of x greater than 0 implies f is increasing; f prime of x less than 0 implies f is decreasing",
    eqSize:"sm",
    headline:"The derivative’s sign is the graph’s direction",
    text:"Where the slope of the tangent is <strong>positive</strong>, the graph rises: `f` is <strong>increasing</strong>. Where it’s <strong>negative</strong>, `f` is <strong>decreasing</strong>. A <strong>sign chart</strong> of the factored derivative shows every interval at once.",
    fig:{ html:'<div class="id-hwrap"><canvas class="plot" id="hero-plot" role="img" aria-label="The graph of f(x) = x³ − 6x² + 9x + 1 with a tangent riding along it, and a sign strip under the x-axis."></canvas>' +
      '<p class="id-hfac" id="id-hfac" aria-hidden="true">`f′(x) = 3(x - 1)(x - 3)`</p></div>' }
  },
  goals:[
    "I can explain how the sign of `f′` tells me whether `f` is increasing or decreasing.",
    "I can use a sign chart of a factored `f′` to state the intervals of increase and decrease in interval notation.",
    "I can find `f′` for a polynomial and determine where `f` is increasing or decreasing.",
    "I can handle points not in the domain and zeros of `f′` where the sign doesn’t change.",
    "I can describe and sketch possible graphs of `f` from information about `f′`.",
    "I can interpret increasing and decreasing intervals in context and under transformations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Derivatives", goal:3, prompt:"If `f(x) = 2x^3 + 3x^2 - 12x`, what is `f′(x)` in factored form?",
          options:[
            { t:"`6(x + 2)(x - 1)`", ok:true, why:"`f′ = 6x^2 + 6x - 12 = 6(x^2 + x - 2)`." },
            { t:"`6(x - 2)(x + 1)`", why:"Expand: `6(x^2 - x - 2)`." },
            { t:"`(x + 2)(x - 1)`", why:"It’s 6 times that." },
            { t:"`6x(x + 1)`", why:"−12 is still there." }],
          hints:["Differentiate term by term.", "`6x^2 + 6x - 12`; take out 6.", "`6(x + 2)(x - 1)`."] },
        { id:"w2", skill:"Derivatives", goal:4, prompt:"If `f(x) = x + 9/x`, what is `f′(x)`?",
          options:[
            { t:"`{x^2 - 9}/{x^2}`", ok:true, why:"`1 - 9/x^2`, over a common denominator." },
            { t:"`{x^2 + 9}/{x^2}`", why:"`9x^{-1} -> -9x^{-2}`." },
            { t:"`1 - 9/x`", why:"The exponent drops to −2." },
            { t:"`1 - 9`", why:"Rewrite `9/x` as a power." }],
          hints:["`9/x = 9x^{-1}`.", "`1 - 9x^{-2}`.", "`{x^2 - 9}/{x^2}`."] },
        { id:"w3", skill:"Sign charts", goal:2, prompt:"What is the sign of `(x + 2)(x - 1)` when `x = 0`?",
          options:[
            { t:"Negative", ok:true, why:"`(2)(-1) = -2`." },
            { t:"Positive", why:"`(0 + 2)(0 - 1) = -2`." },
            { t:"Zero", why:"`x = 0` isn’t a root here." },
            { t:"Undefined", why:"Polynomials are defined everywhere." }],
          hints:["Substitute `x = 0`.", "`(2)(-1)`.", "Negative."] },
        { id:"w4", skill:"Sign charts", goal:4, prompt:"For which `x` is `(x - 3)^2` negative?",
          options:[
            { t:"Never", ok:true, why:"A square is never negative." },
            { t:"`x < 3`", why:"That treats it like `(x - 3)`. A square is never negative." },
            { t:"`x > 3`", why:"Squares are ≥ 0." },
            { t:"`x = 3`", why:"It’s 0 there." }],
          hints:["What do you know about squares?", "Always ≥ 0.", "Never negative."] },
        { id:"w5", skill:"Interval notation", goal:2, prompt:"Which is ‘all `x` less than −1, and all `x` greater than 2’ in interval notation?",
          options:[
            { t:"(−∞, −1) ∪ (2, ∞)", ok:true, why:"Two separate pieces, each with round brackets." },
            { t:"(−1, 2)", why:"That’s the part between." },
            { t:"[−∞, −1] ∪ [2, ∞]", why:"Square brackets don’t belong at ∞ or at the excluded endpoints." },
            { t:"(−∞, 2)", why:"That includes `-1 < x < 2`." }],
          hints:["Two separate pieces.", "Infinity always takes a round bracket.", "(−∞, −1) ∪ (2, ∞)."] },
        { id:"w6", skill:"Interval notation", goal:1, prompt:"A graph rises from `x = -3` to `x = 1`, then falls. Over which interval is it increasing?",
          options:[
            { t:"(−3, 1)", ok:true, why:"Open interval of `x`-values; the turning point belongs to neither interval." },
            { t:"[−3, 1]", why:"That includes the turning points. Course convention: open intervals." },
            { t:"(1, ∞)", why:"That’s where it falls." },
            { t:"`(f(-3), f(1))`", why:"That uses `y`-values. Intervals of increase are `x`-intervals." }],
          hints:["Read the `x`-values.", "From −3 to 1.", "(−3, 1)."] }
      ],
      refreshers:{
        "Derivatives":"Differentiate, then factor completely: common factor first. Rewrite `k/x` as `kx^{-1}`.",
        "Sign charts":"Mark each zero (and each point not in the domain) on a number line; test one value in each interval. A squared factor never changes sign.",
        "Interval notation":"Open intervals of `x`-values, round brackets at ∞, ∪ to join pieces: increasing on (−∞, −1) ∪ (2, ∞)."
      }
    }
  },
  explore:{
    heading:"Slope sign strip",
    intro:"Drag the point along the graph. The strip underneath records the sign of the slope. Then build the sign chart yourself.",
    fns:[
      { id:"F1", chip:"`x^3 - 6x^2 + 9x + 1`", eq:"`f(x) = x^3 - 6x^2 + 9x + 1`", d:"`f′(x) = 3(x - 1)(x - 3)`", plain:"f(x) = x³ − 6x² + 9x + 1" },
      { id:"F2", chip:"`x^4 - 2x^2`", eq:"`f(x) = x^4 - 2x^2`", d:"`f′(x) = 4x^3 - 4x`", plain:"f(x) = x⁴ − 2x²" },
      { id:"F3", chip:"`x^3`", eq:"`f(x) = x^3`", d:"`f′(x) = 3x^2`", plain:"f(x) = x³" },
      { id:"F4", chip:"`x + 4/x`", eq:"`f(x) = x + 4/x`", d:"`f′(x) = 1 - 4/x^2 = {(x - 2)(x + 2)}/{x^2}`", plain:"f(x) = x + 4/x" },
      { id:"Fc", chip:"`x^3 - cx`", eq:"`f(x) = x^3 - cx`", d:"`f′(x) = 3x^2 - c`", plain:"f(x) = x³ − cx" },
      { id:"Fb", chip:"`x^3 + bx^2 + 3x`", eq:"`f(x) = x^3 + bx^2 + 3x`", d:"`f′(x) = 3x^2 + 2bx + 3`", plain:"f(x) = x³ + bx² + 3x" }
    ],
    modes:[{ id:"trace", t:"Trace" }, { id:"build", t:"Build the chart" }, { id:"deriv", t:"Derivative view" }],
    modeHow:{
      trace:"The strip paints as the probe moves: “+” where the slope is positive, “−” where it’s negative. Arrow keys move the probe by 0.1; Shift moves it by 1.",
      build:"Move the marker (tap the strip, or use − and +), then place each zero of `f′` and each point where `f′` is undefined. Fill in the signs and arrows, select where `f` is increasing, then press Check.",
      deriv:"The lower panel shows `f′` in teal. The probe line runs through both graphs: where the teal curve is above the axis, `f` rises."
    },
    rows:{ pt:"Point", slope:"Slope `f′(x)`", sign:"Sign", dir:"Direction here", ivs:"Intervals so far" },
    shift:"Vertical shift `C`",
    shiftNote:"The graph shown is `f(x) + C`.",
    skip:"Skipped {x}: not in the domain.",
    build:{
      famNote:"Build mode works with F1 to F4. Choose one of them.",
      missZ:"A zero of `f′` is missing. Factor `f′(x)` and set each factor to 0.",
      extra:"`f′` isn’t 0 at {x}, and it’s defined there.",
      wantGap:"At {x}, `f′` is undefined: that point is not in the domain. Mark it as undefined, not as a zero.",
      wantZero:"At {x}, `f′ = 0`, and it’s defined there. Mark it as a zero.",
      blank:"Fill in every sign and every arrow first.",
      signs:"A sign doesn’t match `f′`: test one value in each interval marked ✗.",
      arrows:"An arrow doesn’t match its sign: + means ↗ (increasing), − means ↘ (decreasing).",
      selNone:"Now select the intervals where `f` is increasing.",
      selPt:"Use open intervals: a turning point belongs to neither interval.",
      sel:"Your selection doesn’t match the ↗ intervals.",
      chartOk:"✓ The chart is right.",
      allOk:"✓ The chart and your selection are right."
    },
    tc3:{ label:"Toggle on every `b` that keeps `f` increasing on (−∞, ∞):" },
    predIntro:"Make a prediction first. Then the strip shows you what really happens.",
    predictions:[
      { id:"p1", fn:"F1", prompt:"F1, probe at `x = 2`. What is the sign of `f′(2)`, and what is `f` doing there?",
        options:[{ t:"negative; decreasing", ok:true }, { t:"positive; increasing" }, { t:"negative; negative" }, { t:"zero; turning" }],
        explain:"`f(2) = 3` is positive, but the graph is falling there." },
      { id:"p2", fn:"F3", prompt:"F3, `f(x) = x^3`. `f′(0) = 0`. Is `x^3` increasing on (−∞, ∞)?",
        options:[{ t:"yes, increasing everywhere", ok:true }, { t:"no, it decreases near 0" }, { t:"it increases everywhere except at 0, where it decreases" }, { t:"no, it’s constant near 0" }],
        explain:"If `a < b` then `a^3 < b^3`: it never falls. One level point doesn’t break ‘increasing’." },
      { id:"p3", fn:"F4", prompt:"F4, `f(x) = x + 4/x`. `f′ < 0` on both sides of 0 between −2 and 2. Is `f` decreasing on (−2, 2)?",
        options:[{ t:"no: it’s decreasing on (−2, 0) and on (0, 2) separately", ok:true }, { t:"yes, on (−2, 2)" }, { t:"no, it’s increasing on (−2, 2)" }, { t:"yes, except at `x = 0`" }],
        explain:"Going from −1 to 1 the value rises from −5 to 5, so `f` can’t be decreasing on all of (−2, 2)." },
      { id:"p4", fn:"F1", prompt:"F1 with the shift slider. Add 5 to `f`. How do the intervals of increase and decrease change?",
        options:[{ t:"they don’t change", ok:true }, { t:"they shift right 5" }, { t:"they shift up 5" }, { t:"they swap" }],
        explain:"Moving a graph up doesn’t tilt any tangent: `f + C` has the same derivative." }
    ],
    chalIntro:"Use the strip, the sliders and Build mode to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Build mode, F2 `f(x) = x^4 - 2x^2`: build the sign chart and select the intervals where `f` is increasing.",
        why:"`f′(x) = 4x(x - 1)(x + 1)`: zeros −1, 0, 1 and signs −, +, −, +, so `f` is increasing on (−1, 0) ∪ (1, ∞).",
        hints:["Factor `f′(x) = 4x^3 - 4x`.", "`4x(x - 1)(x + 1)`: zeros −1, 0, 1.", "Test −2, −0.5, 0.5, 2: −, +, −, +."],
        msgs:{ fn:"Choose F2 first, then switch to Build the chart.", only1:"`4x^3 - 4x = 4x(x - 1)(x + 1)`: `x = 0` is a zero too.", sel11:"`f′` is negative on (0, 1).",
          zeros:"Place every zero of `f′(x) = 4x^3 - 4x`, and nothing else.", blank:"Fill in a sign for every interval.", signs:"Some signs don’t match `f′`: test one value in each interval.",
          arrows:"An arrow doesn’t match its sign: + means ↗, − means ↘.", selPt:"Use open intervals: a turning point belongs to neither interval.", sel:"Select every interval where `f′ > 0`, and nothing else." } },
      { id:"tc2", goal:4, prompt:"A new function `f(x) = x^3 - cx`, `c` from −5 to 5. Set the <strong>largest</strong> `c` for which `f` is increasing on (−∞, ∞).",
        why:"`f′(x) = 3x^2 - c ≥ 0` for every `x` exactly when `c ≤ 0`. At `c = 0` it’s `x^3`: one level point, still increasing.",
        hints:["`f′(x) = 3x^2 - c`. When is it never negative?", "`3x^2 ≥ 0`, so you need `-c ≥ 0`.", "`c ≤ 0`; the largest is 0 (that’s `x^3`)."],
        msgs:{ fn:"Choose `x^3 - cx` first, then set `c` with its slider.", c1:"`f′ = 3x^2 - 1` is negative between `±1/√3`: a dip appears.",
          pos:"`f′ = 3x^2 - c` is negative near `x = 0` when `c > 0`: a dip appears.", neg:"It works, but it isn’t the largest." } },
      { id:"tc3", goal:[4, 5], stretch:true, prompt:"`f(x) = x^3 + bx^2 + 3x`. Toggle on <strong>every</strong> whole number `b` from −6 to 6 for which `f` is increasing on (−∞, ∞).",
        why:"`f′(x) = 3x^2 + 2bx + 3` is never negative exactly when its discriminant `4b^2 - 36 ≤ 0`, so `-3 ≤ b ≤ 3`. At `b = ±3` there’s one level point, and `f` is still increasing.",
        hints:["`f′(x) = 3x^2 + 2bx + 3` must never be negative.", "A quadratic opening up is never negative when its discriminant is ≤ 0.", "`4b^2 - 36 ≤ 0`, so `-3 ≤ b ≤ 3`."],
        msgs:{ fn:"Choose `x^3 + bx^2 + 3x` first, then toggle on the values of `b`.", empty:"Toggle on every value of `b` that works.",
          miss3:"At `b = 3`, `f′ = 3(x + 1)^2 ≥ 0`: one level point, still increasing.", miss3n:"At `b = -3`, `f′ = 3(x - 1)^2 ≥ 0`: one level point, still increasing.",
          inc4:"At `b = 4`, `f′ = 3x^2 + 8x + 3` has two zeros and dips below 0 between them.", inc4n:"At `b = -4`, `f′ = 3x^2 - 8x + 3` has two zeros and dips below 0 between them.",
          big:"For that `b`, `f′` has two zeros and dips below 0 between them. Look at the strip.", small:"For that `b`, `f′ = 3x^2 + 2bx + 3` is never negative, so `f` is increasing: include it.",
          bigPre:"At `b =` {b}: ", smallPre:"You left out `b =` {b}. " } }
    ]
  },
  part3:{
    slug:"from-derivative", name:"Backwards",
    heading:"From `f′` back to `f`",
    intro:"Explore went from `f` to the sign of `f′`. Here you go backwards: from what you know about `f′` to possible graphs of `f`, and why infinitely many of them work. Then try the quick check.",
    s1:{ title:"Station 1: Sketch from a sign chart",
      text:"The sign chart of `f′` below has zeros at −1 and 2. Build a graph of `f` from stroke tiles: add a turning point wherever the direction changes, choose a rising or falling stroke for each piece, then drag the turning points up or down to make the graph your own.",
      chart:{ zeros:[-1, 2], signs:[1, -1, 1] },
      how:"Move the marker (tap the pad, or use − and +) and press “Add a turning point”. Tap a stroke tile, then tap a piece to place it. Drag a turning point, or focus it and use the up and down arrow keys.",
      fb:{ tiles:"Choose a stroke for every piece.", joints:"Turning points go where `f′` changes sign. Check the chart’s zeros.",
        piece:"On {iv}, `f′` is {sg}, so `f` {dir} there.", extra:"`f′` doesn’t change sign at {x}, so there’s no turning point there.",
        done:"✓ Your graph fits the chart: it rises, falls at −1, and rises again from 2. The checker ignored the heights, because the chart doesn’t fix them." },
      gallery:"Three more answers that all fit the same chart: the same rises and falls, at different heights.",
      galleryCaps:["Peak above the axis, valley below", "Both turning points above the axis", "Both turning points below the axis"] },
    s2:{ title:"Station 2: One derivative, many functions",
      text:"Below: the graph of `f′(x) = 3x^2 - 3`. Above it: `f(x) = x^3 - 3x + C`. Move the slider. The graph moves up and down, but the tangent at `x = 1.5` keeps the same slope.",
      alg:["`d/dx(x^3 - 3x + C) = 3x^2 - 3`", "The constant `C` has derivative 0, so every choice of `C` gives the same `f′`."] },
    s3:{ title:"Station 3: A zero that doesn’t turn",
      text:"`f′(x) = (x - 1)^2(x + 2)`. Fill in the sign chart yourself: tap a cell to cycle +, −, 0. Then press Check.",
      fb:{ blank:"Fill in every cell first.", sq:"`(x - 1)^2` is never negative: it’s + on both sides of 1.", lin:"`x + 2` is negative for `x < -2` and positive for `x > -2`.",
        prod:"Multiply the signs in each column.", done:"✓ −, +, +: `f` falls to a minimum at `x = -2`, rises, levels off for an instant at `x = 1`, and rises again." },
      banner:"A squared factor in `f′`: level for an instant, no turn." },
    quickCheck:{
      title:"Quick check", summary:"From f′ back to f quick check",
      items:[
        { id:"q1", goal:5, prompt:"`f′ > 0` on (−∞, 4) and `f′ < 0` on (4, ∞). At `x = 4`, `f` has …",
          choices:[
            { t:"a peak (turns from rising to falling)", ok:true, fb:"Right. Rising then falling: a local maximum." },
            { t:"a valley", fb:"Rising then falling: a local maximum." },
            { t:"a level point but no turn", fb:"Rising then falling: a local maximum." },
            { t:"a vertical asymptote", fb:"Rising then falling: a local maximum." }] },
        { id:"q2", goal:5, prompt:"Why do infinitely many graphs fit one sign chart?",
          choices:[
            { t:"Shifts up or down and different heights all keep the same rises and falls", ok:true, fb:"Right. The chart fixes directions, not heights." },
            { t:"Because `f′` has many zeros", fb:"The chart fixes directions, not heights." },
            { t:"Because the chart is approximate", fb:"The chart fixes directions, not heights." },
            { t:"They don’t", fb:"The chart fixes directions, not heights. " + M6 }] },
        { id:"q3", goal:4, prompt:"`f′(x) = (x - 1)^2(x + 2)`. On (−2, ∞), `f` is …",
          choices:[
            { t:"increasing", ok:true, fb:"Right. `(x - 1)^2 ≥ 0` and `x + 2 > 0` there." },
            { t:"decreasing", fb:"`(x - 1)^2 ≥ 0` and `x + 2 > 0` there." },
            { t:"increasing then decreasing", fb:"`(x - 1)^2 ≥ 0` and `x + 2 > 0` there. " + M4 },
            { t:"constant", fb:"`(x - 1)^2 ≥ 0` and `x + 2 > 0` there." }] },
        { id:"q4", goal:5, prompt:"`f′(x) = 3x^2 - 3`. Which could be `f`?",
          choices:[
            { t:"`x^3 - 3x + 7`", ok:true, fb:"Right. Differentiate each choice: only `x^3 - 3x + C` gives `3x^2 - 3`." },
            { t:"`6x`", fb:"Differentiate each choice: only `x^3 - 3x + C` gives `3x^2 - 3`." },
            { t:"`x^3 - 3`", fb:"Differentiate each choice: only `x^3 - 3x + C` gives `3x^2 - 3`." },
            { t:"`3x^3 - 3x`", fb:"Differentiate each choice: only `x^3 - 3x + C` gives `3x^2 - 3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"builds", type:"custom", title:"Sign chart builds", summary:"Sign chart builds", goal:[2, 3, 4],
        instruction:"Five functions. For each one: factor `f′`, place its zeros and undefined points, mark the signs and arrows, then type the intervals.",
        how:"Each build has four steps, each with Check. Type intervals like (−∞, −2) ∪ (1, ∞); you can type “inf” for ∞ and “U” for ∪, or use the buttons.",
        stages:{ factor:"Factor `f′`", pts:"Zeros and undefined points", signs:"Signs and arrows", ivs:"Intervals" },
        stageHow:{ factor:"Tap the factored form of `f′(x)`.", pts:"Move the marker (tap the line, or use − and +), then mark each zero of `f′` and each point where `f′` is undefined.",
          signs:"Tap each sign cell to cycle +, −, 0 and each arrow cell to cycle ↗, ↘. Then press Check.", ivs:"Type the intervals in interval notation." },
        msgs:{ factor:"Not that one. Differentiate, then factor completely: common factor first.", missZ:"A zero of `f′` is missing: set each factor of the numerator to 0.",
          missU:"`f′` is undefined somewhere: look for a zero of the denominator.", extra:"`f′` isn’t 0 at {x}, and it’s defined there.",
          wantU:"At {x}, `f′` is undefined (the denominator is 0), not 0.", wantZ:"At {x}, `f′ = 0`: it’s defined there.",
          blank:"Fill in every sign and every arrow first.", signs:"A sign doesn’t match `f′`: test one value in each interval marked ✗.",
          arrows:"An arrow doesn’t match its sign: + means ↗, − means ↘.", ivEmpty:"Type both answers first.", ivBad:"Type intervals like (−∞, −2) ∪ (1, ∞).",
          inf:"Infinity always takes a round bracket.", closed:"Course convention: open intervals. The turning points belong to neither interval.",
          inc:"Read the ↗ columns of your chart for “increasing”.", dec:"Read the ↘ columns of your chart for “decreasing”.", done:"✓ Build complete." },
        items:[
          { id:"b1", goal:[2, 3], f:"`f(x) = 2x^3 + 3x^2 - 12x`", range:[-4, 3],
            factor:{ prompt:"`f′(x) = 6x^2 + 6x - 12`. Which is its factored form?", options:[
              { t:"`6(x + 2)(x - 1)`", ok:true }, { t:"`6(x - 2)(x + 1)`" }, { t:"`(x + 2)(x - 1)`" }, { t:"`6x(x + 1)`" }] },
            dSrc:"6(x + 2)(x - 1)", fac:[{ s:"6", k:"const" }, { s:"x + 2" }, { s:"x - 1" }],
            answer:{ pts:[[-2, "z"], [1, "z"]], inc:[[[null, -2], [1, null]]], dec:[[[-2, 1]]] },
            display:{ inc:"(−∞, −2) ∪ (1, ∞)", dec:"(−2, 1)" },
            hints:["Differentiate term by term, then take out the common factor 6.", "`f′(x) = 6(x + 2)(x - 1)`: zeros at −2 and 1.", "Test −3, 0, 2: +, −, +. Increasing on (−∞, −2) ∪ (1, ∞); decreasing on (−2, 1)."] },
          { id:"b2", goal:[3, 4], f:"`f(x) = x^4 - 4x^3`", range:[-2, 5],
            factor:{ prompt:"`f′(x) = 4x^3 - 12x^2`. Which is its factored form?", options:[
              { t:"`4x^2(x - 3)`", ok:true }, { t:"`4x(x - 3)`" }, { t:"`4x^2(x + 3)`" }, { t:"`x^2(4x - 3)`" }] },
            dSrc:"4x^2(x - 3)", fac:[{ s:"4x^2", k:"sq" }, { s:"x - 3" }],
            answer:{ pts:[[0, "z"], [3, "z"]], inc:[[[3, null]]], dec:[[[null, 3]], [[null, 0], [0, 3]]] },
            display:{ inc:"(3, ∞)", dec:"(−∞, 3)" },
            signFb:{ "0|3|1":"`4x^2` is never negative; `x - 3 < 0` there." },
            hints:["Take out the common factor `4x^2`.", "`f′(x) = 4x^2(x - 3)`: zeros at 0 and 3. `4x^2` never changes sign.", "Signs −, −, +: decreasing on (−∞, 3) (also accepted: (−∞, 0) ∪ (0, 3)); increasing on (3, ∞)."] },
          { id:"b3", goal:[2, 3], f:"`f(x) = x/{x^2 + 1}`", range:[-3, 3],
            factor:{ prompt:"Use the quotient rule. Which is `f′(x)`?", options:[
              { t:"`{1 - x^2}/{(x^2 + 1)^2}`", ok:true }, { t:"`{x^2 - 1}/{(x^2 + 1)^2}`" }, { t:"`1/{2x}`" }, { t:"`{1 - x^2}/{x^2 + 1}`" }] },
            dSrc:"{(1 - x)(1 + x)}/{(x^2 + 1)^2}", fac:[{ s:"1 - x" }, { s:"1 + x" }, { s:"(x^2 + 1)^2", k:"den" }],
            answer:{ pts:[[-1, "z"], [1, "z"]], inc:[[[-1, 1]]], dec:[[[null, -1], [1, null]]] },
            display:{ inc:"(−1, 1)", dec:"(−∞, −1) ∪ (1, ∞)" },
            hints:["Quotient rule.", "`[(x^2 + 1) - x(2x)]/(x^2 + 1)^2 = (1 - x^2)/(x^2 + 1)^2`.", "The denominator is always positive; `1 - x^2 > 0` on (−1, 1)."] },
          { id:"b4", goal:[2, 4], star:true, f:"`f(x) = x + 9/x`", range:[-5, 5],
            factor:{ prompt:"`f′(x) = 1 - 9/x^2`. Which is its factored form?", options:[
              { t:"`{(x - 3)(x + 3)}/{x^2}`", ok:true }, { t:"`{(x - 3)(x + 3)}/x`" }, { t:"`{x^2 + 9}/{x^2}`" }, { t:"`(x - 3)(x + 3)`" }] },
            dSrc:"{(x - 3)(x + 3)}/{x^2}", fac:[{ s:"x - 3" }, { s:"x + 3" }, { s:"x^2", k:"den" }],
            answer:{ pts:[[-3, "z"], [0, "u"], [3, "z"]], inc:[[[null, -3], [3, null]]], dec:[[[-3, 0], [0, 3]]] },
            display:{ inc:"(−∞, −3) ∪ (3, ∞)", dec:"(−3, 0) ∪ (0, 3)" }, nd:[0],
            ivFb:{ dec:[{ iv:[[-3, 3]], fb:"`x = 0` isn’t in the domain, so (−3, 0) and (0, 3) are separate: `f(-1) = -10 < f(1) = 10`." }] },
            hints:["`9/x = 9x^{-1}`, so `f′(x) = 1 - 9x^{-2}`. Use a common denominator.", "`f′(x) = {(x - 3)(x + 3)}/{x^2}`: zeros at ±3, and 0 is not in the domain.", "Signs +, −, −, +: increasing on (−∞, −3) ∪ (3, ∞); decreasing on (−3, 0) ∪ (0, 3)."] },
          { id:"b5", goal:[3, 4], star:true, f:"`f(x) = x^{2/3}(x - 5)`", range:[-3, 5],
            factor:{ prompt:"Write `f = x^{5/3} - 5x^{2/3}` and differentiate. Which is `f′(x)`?", options:[
              { t:"`{5(x - 2)}/{3∛x}`", ok:true }, { t:"`{5(x - 2)}/3`" }, { t:"`{5(x + 2)}/{3∛x}`" }, { t:"`{5x - 10}/{3x}`" }] },
            dSrc:"{5(x - 2)}/{3∛x}", fac:[{ s:"5", k:"const" }, { s:"x - 2" }, { s:"3∛x", k:"den" }],
            answer:{ pts:[[0, "u"], [2, "z"]], inc:[[[null, 0], [2, null]]], dec:[[[0, 2]]] },
            display:{ inc:"(−∞, 0) ∪ (2, ∞)", dec:"(0, 2)" },
            missFb:{ "0":"`f′` is undefined at 0 (`∛x` in the denominator), so 0 splits the intervals." },
            hints:["Write `f = x^{5/3} - 5x^{2/3}` and differentiate.", "`(5/3)x^{2/3} - (10/3)x^{-1/3} = (5/3)x^{-1/3}(x - 2)`.", "Signs: + on (−∞, 0), − on (0, 2), + on (2, ∞)."] }
        ] },
      { id:"back", type:"custom", title:"Working backwards", summary:"Working backwards", star:true, goal:[4, 5, 6],
        instruction:"Go from facts about `f′` back to `f`. Items 4 to 6 are non-routine.",
        how:"Type intervals like (−∞, −1) or (−∞, −3) ∪ (2, ∞); “inf” works for ∞ and “U” for ∪. Use square brackets where an endpoint is included.",
        items:[
          { id:"r1", goal:4, kind:"iv", prompt:"`f′(x) = (x + 1)(x - 4)^2`. Where is `f` decreasing?", label:"Decreasing on",
            answer:[[null, -1]], display:"(−∞, −1)",
            wrong:[{ iv:[[-1, 4]], fb:"`(x - 4)^2 ≥ 0`, so `f′ > 0` on (−1, 4)." }],
            general:"Test one value in each interval of the sign chart of `f′`.",
            why:"`(x - 4)^2 ≥ 0` never changes sign, so `f′ < 0` only where `x + 1 < 0`.",
            hints:["Which factor can change sign?", "Only `x + 1`; `(x - 4)^2 ≥ 0`.", "`f′ < 0` only for `x < -1`: (−∞, −1)."] },
          { id:"r2", goal:4, kind:"iv", prompt:"`f′(x) = x^2(x - 2)(x + 3)`. Where is `f` increasing?", label:"Increasing on",
            answer:[[null, -3], [2, null]], display:"(−∞, −3) ∪ (2, ∞)",
            overlap:{ iv:[0, 2], fb:"`x^2` is never negative, so `f′` keeps its sign through `x = 0`: it’s negative on (0, 2) as well as on (−3, 0)." },
            general:"Test one value in each interval of the sign chart of `f′`.",
            why:"`x^2 ≥ 0`, so the sign of `f′` comes from `(x - 2)(x + 3)`: positive outside −3 and 2.",
            hints:["`x^2` never changes sign.", "The sign comes from `(x - 2)(x + 3)`.", "Positive for `x < -3` and `x > 2`: (−∞, −3) ∪ (2, ∞)."] },
          { id:"r3", goal:5, kind:"chips", prompt:"`f′(x) = 3(x - 1)(x - 5)` and `f(1) = 10`. Is `f(3)` more or less than 10?",
            choices:["More than 10", "Less than 10"], answer:"Less than 10", display:"less than 10",
            general:"`f` is decreasing on (1, 5), so it falls from 10.",
            why:"`f′ < 0` on (1, 5), so `f` is decreasing there: `f(3) < f(1) = 10`.",
            hints:["What is the sign of `f′` between 1 and 5?", "Negative: test `x = 3`, `3(2)(-2) < 0`.", "`f` is decreasing on (1, 5), so `f(3) < 10`."] },
          { id:"r4", goal:4, star:true, kind:"iv", prompt:"For which `k` is `f(x) = x^3 - kx^2 + 12x` increasing on (−∞, ∞)?", label:"Values of `k`", var:"k",
            answer:[[-6, 6, 1, 1]], display:"`-6 ≤ k ≤ 6`, that is, [−6, 6]",
            wrong:[{ iv:[[-6, 6]], fb:"At `k = 6`, `f′ = 3(x - 2)^2 ≥ 0`: one level point, still increasing. Include the endpoints." },
              { iv:[[null, 6, 0, 1]], fb:"At `k = -7`, `f′ = 3x^2 + 14x + 12` has two zeros and dips below 0. There’s a lower limit too." }],
            general:"`f′` must never be negative: look at its discriminant.",
            why:"`f′(x) = 3x^2 - 2kx + 12` is never negative when `4k^2 - 144 ≤ 0`, so `-6 ≤ k ≤ 6`.",
            hints:["`f′(x) = 3x^2 - 2kx + 12`.", "Never negative ⟺ discriminant ≤ 0.", "`4k^2 - 144 ≤ 0`."] },
          { id:"r5", goal:6, star:true, kind:"iv", prompt:"`f` is increasing on (1, 4). Where is `g(x) = f(x - 3)` increasing?", label:"Increasing on",
            answer:[[4, 7]], display:"(4, 7)",
            wrong:[{ iv:[[-2, 1]], fb:"`f(x - 3)` shifts the graph right 3." }],
            general:"`g(x) = f(x - 3)` is a horizontal shift. Which way, and how far?",
            why:"`f(x - 3)` shifts the graph right 3, so (1, 4) becomes (4, 7).",
            hints:["`g(x) = f(x - 3)` is a horizontal shift.", "It moves the graph right 3.", "(1 + 3, 4 + 3) = (4, 7)."] },
          { id:"r6", goal:[5, 6], star:true, kind:"pair", prompt:"`f′(x) = (x - a)(x - 6)`, and `f` is decreasing on exactly (2, 6). Find `a`, then find where `h(x) = f(-x)` is increasing.",
            label:"`h` increasing on", numLabel:"`a =`",
            answer:{ a:2, iv:[[-6, -2]] }, display:"`a = 2`; `h` is increasing on (−6, −2)",
            wrong:[{ iv:[[2, 6]], fb:"`h′(x) = -f′(-x)`, so `h` rises where `f` falls, mirrored: `-x ∈ (2, 6)`." }],
            aFb:"`f′ < 0` between its zeros `a` and 6, so `a` is the left end of (2, 6).",
            general:"`h′(x) = -f′(-x)` by the chain rule.",
            why:"`a = 2`. `h′(x) = -f′(-x) > 0` when `f′(-x) < 0`, that is, `2 < -x < 6`, so `-6 < x < -2`.",
            hints:["`f′ < 0` between its zeros `a` and 6, so `a = 2`.", "Chain rule: `h′(x) = -f′(-x)`.", "`h′ > 0` when `f′(-x) < 0`, i.e. `2 < -x < 6`, so `-6 < x < -2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Tariq", how:"", goal:[3, 4],
        instruction:"Tariq made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Where is `f(x) = x^3 - 12x` increasing?",
            steps:["`f(x) = x(x^2 - 12) = 0` at `x = 0` and `x = ±2√3`.", "Test intervals between `-2√3`, 0 and `2√3`.", "`f` is increasing on `(-2√3, 0)` and `(2√3, ∞)`."],
            answer:0,
            stepFb:["", "Step 2 uses step 1’s numbers. The mistake is earlier.", "Step 3 uses step 1’s numbers. The mistake is earlier."],
            fixes:[
              { t:"Use `f′`: `3x^2 - 12 = 3(x - 2)(x + 2)`. `f` is increasing on (−∞, −2) ∪ (2, ∞).", ok:true, why:"Right. " + M2 },
              { t:"Use the zeros of `f`, but include `(-∞, -2√3)`.", why:"Zeros of `f` don’t decide direction." },
              { t:"Use `f″ = 6x`.", why:"`f″` is about concavity." },
              { t:"Step 1 is correct.", why:"The zeros of `f` are crossings, not turns. " + M2 }],
            hints:["Which function’s sign tells you rising or falling?", "`f′`.", "`f′ = 3(x - 2)(x + 2)`."] },
          { id:"e2", goal:4, task:"Where is `f(x) = x + 1/x` decreasing?",
            steps:["`f′(x) = 1 - 1/x^2`.", "`f′(x) = {x^2 - 1}/{x^2}`.", "Zeros at `x = ±1`.", "Test the intervals (−∞, −1), (−1, 1), (1, ∞).", "`f` is decreasing on (−1, 1)."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows from step 4. The mistake is earlier."],
            fixes:[
              { t:"`x = 0` isn’t in the domain, so split there too. `f` is decreasing on (−1, 0) and (0, 1).", ok:true, why:"Right. `f(-0.5) = -2.5 < f(0.5) = 2.5`, so `f` isn’t decreasing across 0." },
              { t:"Test only (−1, 1).", why:"Every interval needs a test." },
              { t:"Use (−∞, 1) and (1, ∞).", why:"That loses −1 and 0." },
              { t:"Step 4 is correct.", why:"`f(-0.5) = -2.5 < f(0.5) = 2.5`, so `f` isn’t decreasing across 0." }],
            hints:["Is every `x` in the domain?", "`x = 0` isn’t.", "Split at −1, 0 and 1."] },
          { id:"e3", goal:4, task:"`f′(x) = (x - 1)^2(x + 2)`. Where is `f` decreasing?",
            steps:["`f′` is given in factored form.", "Zeros of `f′`: `x = 1` and `x = -2`.", "The signs alternate: + on (1, ∞), − on (−2, 1), + on (−∞, −2).", "So `f` is decreasing on (−2, 1)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Test each interval: (−∞, −2) gives (+)(−) = −; (−2, 1) and (1, ∞) give +. `f` is decreasing on (−∞, −2) only.", ok:true, why:"Right. " + M4 },
              { t:"Swap the signs: − on (1, ∞).", why:"Test, don’t guess." },
              { t:"Ignore the squared factor.", why:"It’s 0 at `x = 1`, but it doesn’t change sign; you can’t simply ignore the zero." },
              { t:"Step 3 is correct.", why:"`(x - 1)^2` never changes sign, so the signs don’t alternate at 1." }],
            hints:["Is `(x - 1)^2` ever negative?", "No.", "Only `x + 2` changes sign."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the sign strip: `x^3` increasing through a level point, or `x + 4/x` not decreasing on (−2, 2)?" },
      { id:"j2", q:"In your own words, what’s the difference between ‘`f` is negative’ and ‘`f` is decreasing’?" },
      { id:"j3", q:"Explain to a friend how to build a sign chart for `f′` and read off the intervals." },
      { id:"j4", q:"What still feels uncertain (squared factors, domain gaps, or going backwards from `f′`)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`f′(x) < 0` for every `x` in (2, 5). On (2, 5), `f` is …", options:[
          { t:"decreasing", ok:true, why:"`f′ < 0` means the graph is falling there." },
          { t:"negative", why:"`f′ < 0` says falling, not below the axis." },
          { t:"concave down", why:"That’s about `f″`." },
          { t:"constant", why:"A constant has `f′ = 0`." }] },
        b:{ prompt:"`f′(x) > 0` for every `x` in (−3, 1). On (−3, 1), `f` is …", options:[
          { t:"increasing", ok:true, why:"`f′ > 0` means the graph is rising there." },
          { t:"positive", why:"`f′ > 0` says rising, not above the axis." },
          { t:"concave up", why:"That’s about `f″`." },
          { t:"constant", why:"A constant has `f′ = 0`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f′(x) = (x + 2)(x - 4)`. Where is `f` increasing?", options:[
          { t:"(−∞, −2) ∪ (4, ∞)", ok:true, why:"Both factors negative or both positive." },
          { t:"(−2, 4)", why:"That’s where `f′ < 0`: decreasing." },
          { t:"(−∞, −4) ∪ (2, ∞)", why:"`x + 2 = 0` at −2, not 2." },
          { t:"(4, ∞) only", why:"On (−∞, −2) both factors are negative, so the product is positive." }] },
        b:{ prompt:"`f′(x) = (x - 1)(x + 5)`. Where is `f` increasing?", options:[
          { t:"(−∞, −5) ∪ (1, ∞)", ok:true, why:"Both factors negative or both positive." },
          { t:"(−5, 1)", why:"That’s where `f′ < 0`: decreasing." },
          { t:"(−∞, −1) ∪ (5, ∞)", why:"`x + 5 = 0` at −5, and `x - 1 = 0` at 1." },
          { t:"(1, ∞) only", why:"On (−∞, −5) both factors are negative, so the product is positive." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Where is `f(x) = x^3 - 27x` decreasing?", options:[
          { t:"(−3, 3)", ok:true, why:"`f′ = 3(x^2 - 9) < 0` for `-3 < x < 3`." },
          { t:"`(-3√3, 3√3)`", why:"Those are the zeros of `f`. " + M2 },
          { t:"(−∞, −3) ∪ (3, ∞)", why:"That’s where it’s increasing." },
          { t:"(−9, 9)", why:"`x^2 < 9`, not `x < 9`." }] },
        b:{ prompt:"Where is `f(x) = x^3 - 48x` decreasing?", options:[
          { t:"(−4, 4)", ok:true, why:"`f′ = 3(x^2 - 16) < 0` for `-4 < x < 4`." },
          { t:"`(-4√3, 4√3)`", why:"Those are the zeros of `f`. " + M2 },
          { t:"(−∞, −4) ∪ (4, ∞)", why:"That’s where it’s increasing." },
          { t:"(−16, 16)", why:"`x^2 < 16`, not `x < 16`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Where is `f(x) = x + 16/x` decreasing?", options:[
          { t:"(−4, 0) and (0, 4)", ok:true, why:"`f′ = {x^2 - 16}/{x^2} < 0` for `0 < x^2 < 16`; 0 isn’t in the domain." },
          { t:"(−4, 4)", why:"`f(-1) = -17 < f(1) = 17`: 0 isn’t in the domain, so the pieces are separate." },
          { t:"(−∞, −4) ∪ (4, ∞)", why:"That’s where it’s increasing." },
          { t:"(0, 4) only", why:"`f′ < 0` for `-4 < x < 0` too: `x^2 < 16` there." }] },
        b:{ prompt:"Where is `f(x) = x + 25/x` decreasing?", options:[
          { t:"(−5, 0) and (0, 5)", ok:true, why:"`f′ = {x^2 - 25}/{x^2} < 0` for `0 < x^2 < 25`; 0 isn’t in the domain." },
          { t:"(−5, 5)", why:"`f(-1) = -26 < f(1) = 26`: 0 isn’t in the domain, so the pieces are separate." },
          { t:"(−∞, −5) ∪ (5, ∞)", why:"That’s where it’s increasing." },
          { t:"(0, 5) only", why:"`f′ < 0` for `-5 < x < 0` too: `x^2 < 25` there." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`f′(x) = (x - 3)^2(x + 1)`. Which describes `f`?", options:[
          { t:"Decreasing on (−∞, −1), increasing on (−1, ∞); level for an instant at `x = 3` but still increasing", ok:true, why:"`(x - 3)^2 ≥ 0`, so the sign comes from `x + 1`." },
          { t:"Increasing on (−1, 3), decreasing on (3, ∞)", why:"`(x - 3)^2` is never negative, so `f′` keeps its sign through `x = 3`." },
          { t:"Decreasing on (−∞, −1) and on (3, ∞)", why:"`(x - 3)^2` is never negative, so `f′` keeps its sign through `x = 3`." },
          { t:"Increasing on (−∞, −1), decreasing on (−1, ∞)", why:"Test `x = -2`: `(25)(-1) < 0`." }] },
        b:{ prompt:"`f′(x) = (x + 2)^2(x - 3)`. Which describes `f`?", options:[
          { t:"Decreasing on (−∞, 3), increasing on (3, ∞); level for an instant at `x = -2`", ok:true, why:"`(x + 2)^2 ≥ 0`, so the sign comes from `x - 3`." },
          { t:"Decreasing on (−2, 3), increasing elsewhere", why:"`(x + 2)^2` is never negative, so `f′` keeps its sign through `x = -2`." },
          { t:"Increasing on (−∞, −2), decreasing on (−2, 3), increasing on (3, ∞)", why:"`(x + 2)^2` is never negative, so `f′` keeps its sign through `x = -2`." },
          { t:"Increasing on (−∞, 3)", why:"Test `x = 0`: `(4)(-3) < 0`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"For which values of `k` is `f(x) = x^3 + kx` increasing on (−∞, ∞)?", options:[
          { t:"`k ≥ 0`", ok:true, why:"`f′ = 3x^2 + k ≥ 0` for every `x` exactly when `k ≥ 0`; at `k = 0` it’s `x^3`." },
          { t:"`k > 0`", why:"At `k = 0`, `x^3` is still increasing." },
          { t:"`k ≤ 0`", why:"Negative `k` makes `f′` negative near 0." },
          { t:"All `k`", why:"`k = -3` gives a dip between −1 and 1." }] },
        b:{ prompt:"For which values of `k` is `f(x) = 2x^3 - kx` increasing on (−∞, ∞)?", options:[
          { t:"`k ≤ 0`", ok:true, why:"`f′ = 6x^2 - k ≥ 0` for all `x` when `-k ≥ 0`." },
          { t:"`k < 0`", why:"At `k = 0`, `2x^3` is still increasing." },
          { t:"`k ≥ 0`", why:"Positive `k` makes `f′` negative near 0." },
          { t:"All `k`", why:"`k = 6` gives a dip between −1 and 1." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"You know `f′(x)` exactly. Which is the best explanation of why you still can’t draw `f` exactly?", options:[
          { t:"“Adding a constant to `f` doesn’t change any slope, so `f(x) + C` has the same derivative for every `C`. Infinitely many graphs, all vertical shifts of each other, fit.”", ok:true, why:"`f′` fixes every slope, but not the height." },
          { t:"“Because `f′` might contain mistakes.”", why:"Even an exact `f′` leaves the height unknown." },
          { t:"“Because `f′` only gives signs, not values.”", why:"Here you know the values of `f′` exactly." },
          { t:"“You can: each derivative belongs to exactly one function.”", why:M6 }] },
        b:{ prompt:"Two students draw different graphs from the same sign chart of `f′`. Which is the best explanation?", options:[
          { t:"“Both can be right. A sign chart only says where `f` rises and falls, so any graph with those rises and falls fits, including shifted ones and ones with different turning-point heights.”", ok:true, why:"The chart fixes directions, not heights." },
          { t:"“One must be wrong: a sign chart gives one graph.”", why:M6 },
          { t:"“They must have used different functions.”", why:"The same chart fits many functions." },
          { t:"“Both are wrong unless the graphs cross the axis at the same points.”", why:"The chart doesn’t fix the intercepts." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"`f′ > 0` for `x < -1` and for `x > 2`, and `f′ < 0` for `-1 < x < 2`. Which report is correct?", options:[
          { t:"“`f` is increasing on (−∞, −1) ∪ (2, ∞) and decreasing on (−1, 2).”", ok:true, why:"Open `x`-intervals, round brackets at ∞." },
          { t:"“`f` is increasing on [−∞, −1] ∪ [2, ∞].”", why:"Infinity takes a round bracket, and the turning points belong to neither interval." },
          { t:"“`f` is positive on (−∞, −1) ∪ (2, ∞) and negative on (−1, 2).”", why:M1 },
          { t:"“`f` is increasing at `x = -1` and `x = 2`.”", why:"Those are the turning points, where `f′ = 0`." }] },
        b:{ prompt:"`f′ < 0` for `x < -3` and for `x > 0`, and `f′ > 0` for `-3 < x < 0`. Which report is correct?", options:[
          { t:"“`f` is decreasing on (−∞, −3) ∪ (0, ∞) and increasing on (−3, 0).”", ok:true, why:"Open `x`-intervals, round brackets at ∞." },
          { t:"“`f` is decreasing on [−∞, −3] ∪ [0, ∞].”", why:"Infinity takes a round bracket, and the turning points belong to neither interval." },
          { t:"“`f` is negative on (−∞, −3) ∪ (0, ∞).”", why:"`f′ < 0` says falling, not below the axis." },
          { t:"“`f` is decreasing at `x = -3` and `x = 0`.”", why:"Those are the turning points, where `f′ = 0`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A park’s website had `N(t) = -t^3 + 9t^2 + 48t` thousand visits in month `t` after its launch, for `0 ≤ t ≤ 12`. When was the number of visits increasing?", options:[
          { t:"For `0 < t < 8`, then decreasing for `8 < t < 12`", ok:true, why:"`N′ = -3(t - 8)(t + 2)`." },
          { t:"For `-2 < t < 8`", why:"Months before the launch (`t < 0`) aren’t in the model." },
          { t:"For `0 < t < 8` only, then constant", why:"`N′ < 0` after `t = 8`: it falls." },
          { t:"For all `0 < t < 12`", why:"`N′(10) = -3(2)(12) < 0`." }] },
        b:{ prompt:"`N(t) = -t^3 + 12t^2 + 60t` thousand visits, `0 ≤ t ≤ 15`. When were visits increasing?", options:[
          { t:"For `0 < t < 10`, then decreasing for `10 < t < 15`", ok:true, why:"`N′ = -3(t - 10)(t + 2)`." },
          { t:"For `-2 < t < 10`", why:"Months before the launch (`t < 0`) aren’t in the model." },
          { t:"For `0 < t < 10` only, then constant", why:"`N′ < 0` after `t = 10`: it falls." },
          { t:"For all `0 < t < 15`", why:"`N′(12) = -3(2)(14) < 0`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"`f` is decreasing on (1, 3). Where is `g(x) = f(x + 2) - 5` decreasing?", options:[
          { t:"(−1, 1)", ok:true, why:"`f(x + 2)` moves the graph left 2; −5 moves it down, which doesn’t affect direction." },
          { t:"(3, 5)", why:"That moves right. " + M7 },
          { t:"(1, 3)", why:"The horizontal shift moves the interval." },
          { t:"(−4, −2)", why:"−5 is a vertical shift; it doesn’t move `x`-intervals." }] },
        b:{ prompt:"`f` is increasing on (−2, 4). Where is `g(x) = f(x - 3) + 1` increasing?", options:[
          { t:"(1, 7)", ok:true, why:"`f(x - 3)` moves the graph right 3; +1 moves it up, which doesn’t affect direction." },
          { t:"(−5, 1)", why:"That moves left. `f(x - 3)` moves the graph <strong>right</strong> 3." },
          { t:"(−2, 4)", why:"The horizontal shift moves the interval." },
          { t:"(−1, 5)", why:"+1 is a vertical shift; it doesn’t move `x`-intervals." }] } }
    ]
  },
  task:{
    title:"Design a derivative", summary:"Design a derivative",
    statement:"<p>Build `f′(x) = a(x - p)(x - q)` so that `f` meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` is increasing on (−1, 3).</li><li>`f` is decreasing on exactly one interval.</li><li>`f′(0) = 6`.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose `a` from −3, −2, −1, 1, 2, 3, and whole numbers `p` and `q` from −5 to 5 with `p ≤ q`. The sign chart of `f′`, the graph of `f′` (teal) and one possible `f` update as you go.</p>",
    checks:["Increasing on (−1, 3)", "Exactly one decreasing interval", "`f′(0) = 6`"],
    tips:["With `a < 0`, `f′` is negative on both outer pieces: that’s two decreasing intervals.",
      "With `a > 0`, `f` decreases only between the zeros, so (`p`, `q`) must stay out of (−1, 3).",
      "`f′(0) = a(-p)(-q) = apq`.",
      "Both zeros must be at or left of −1, or at or right of 3."],
    explainPrompt:"Explain why `a` had to be positive and where the zeros of `f′` had to go.",
    vocab:"Use the words sign chart, increasing, decreasing and zero of the derivative.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"All three put the decreasing interval to the left of −1. Zeros to the right of 3 would need `pq ≥ 12`, which can’t give `apq = 6` with `a ≥ 1`."
  },
  cards:[
    ["`f′(x) > 0` on an interval", "`f` is increasing there."],
    ["`f′(x) < 0` on an interval", "`f` is decreasing there."],
    ["Sign chart for `f′`", "Zeros and domain gaps on a number line; test one value per interval."],
    ["Reporting intervals", "Open `x`-intervals with ∪: increasing on (−∞, −2) ∪ (1, ∞)."],
    ["Decreasing ≠ negative", "`f` can fall while it’s above the axis."],
    ["`x^3` at 0", "`f′(0) = 0`, but `x^3` is increasing everywhere."],
    ["Squared factor in `f′`", "`(x - 1)^2` doesn’t change sign: level for an instant, no turn."],
    ["Domain gap", "`x + 4/x`: decreasing on (−2, 0) and (0, 2), not on (−2, 2)."],
    ["Many graphs, one derivative", "`f` and `f + C` have the same `f′`."],
    ["Increasing everywhere", "`f′ ≥ 0` with only isolated zeros, e.g. `x^3 + 3x^2 + 3x`."],
    ["Shifts and intervals", "`f(x + 2)` moves intervals left 2; `f(x) + 5` doesn’t move them."]
  ]
};
