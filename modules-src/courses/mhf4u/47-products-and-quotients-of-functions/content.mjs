// MHF4U 47 Products and Quotients of Functions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/47-products-and-quotients-of-functions.md

// ---------- Practice 1 (sorter): mistake feedback built from each item's factor types ----------
const M6 = "Two odd factors: each flips the sign when `x` becomes `-x`, and two flips cancel, like (−2)(−3) = 6. Test `x · x = x^2`.";
const ONE = "Only one factor flips the sign, so the result flips too: `(-f)(g) = -fg`.";
const NONE = "Neither factor flips the sign, so the result doesn’t either: it’s even.";
const BOTH = "Both factors have a symmetry, so the result does too. Decide each factor’s type first.";
// kind: "oo" odd·odd (Even), "oe" odd·even (Odd), "ee" even·even (Even)
function symWrong(kind){
  if (kind === "oo") return { odd:M6, neither:BOTH };
  if (kind === "oe") return { even:ONE, neither:BOTH };
  return { odd:NONE, neither:BOTH };
}
function nWrong(name, nums){
  const t = "`" + name + "` is neither even nor odd, so it doesn’t pass a symmetry on to the product. Check with numbers: " + nums;
  return { even:t, odd:t };
}
const it = (id, t, answer, kind, why, hints, wrong) => ({ id, t, answer, why, hints, wrong:wrong || symWrong(kind) });

export default {
  id:"47-products-and-quotients-of-functions",
  kind:"topic",
  title:"Products and quotients of functions",
  topic:"Products and Quotients of Functions",
  readyTopic:"products and quotients of functions",
  hero:{
    eq:'<span class="m">(<i class="pq-f">f</i> · <i class="pq-g">g</i>)(<i>x</i>) = <i class="pq-f">f</i>(<i>x</i>) · <i class="pq-g">g</i>(<i>x</i>)</span>',
    eqLabel:"f times g, of x, equals f of x times g of x", eqSize:"md",
    headline:"Times a wave, a curve becomes a fence",
    text:"The <strong>product</strong> `f · g` and the <strong>quotient</strong> `f/g` are built one `x` at a time: `(f · g)(x) = f(x) × g(x)` and `(f/g)(x) = f(x) ÷ g(x)`. Multiply by a wave like `cos(πx)`, which never goes above 1 or below −1, and the result is trapped between `y = f(x)` and `y = -f(x)`. That boundary is the <strong>envelope</strong>, and it’s how a bouncing spring settles down: <strong>damped motion</strong>. Dividing has its own surprises. Wherever `g(x) = 0`, `f/g` is undefined, and its graph breaks at a <strong>vertical asymptote</strong> or a <strong>hole</strong>.",
    fig:{ html:'<canvas class="plot pq-hstrip" id="pq-hero-g" role="img" aria-label="Strip graph of g of x equals cos of pi x, between negative 1 and 1"></canvas><canvas class="plot" id="pq-hero-p" role="img" aria-label="Graph of f of x equals 16 times one half to the x, its mirror, and the product f times g trapped between them"></canvas>' }
  },
  goals:[
    "I can find the value and the equation of `f · g` and `f/g` from equations, tables or graphs, without mixing up a product with a composition.",
    "I can state the domain of `f · g` and `f/g`, leaving out every zero of `g`, even one that cancels.",
    "I can find the zeros of a product or quotient, and its sign on each interval, from the zeros and signs of its factors, and show them on a sign chart.",
    "I can predict what `f/g` does where `g(x) = 0` (a vertical asymptote or a hole), where `g(x) = ±1`, and where `g` is large.",
    "I can explain why a wave times an envelope stays between `y = f(x)` and `y = -f(x)`, touching them where the wave is 1 or −1, and use a damped model to answer questions in context.",
    "I can decide whether a product or quotient is even, odd or neither from its factors, and test a claim about increasing or decreasing behaviour with an example."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Restrictions and zeros", goal:2,
          prompt:"What are the restrictions on `(x + 3)/(x^2 - 9)`?",
          options:[
            { t:"`x ≠ -3` and `x ≠ 3`", ok:true, why:"`x^2 - 9 = (x - 3)(x + 3)` is 0 at both 3 and −3. Both are excluded, even though `(x + 3)` also appears on top." },
            { t:"`x ≠ 3` only", why:"Cancelling doesn’t make `x = -3` allowed. At `x = -3` the original denominator is `(-3)^2 - 9 = 0`, so the expression is 0/0 there: undefined." },
            { t:"`x ≠ -3` only", why:"−3 is a restriction, but because the <strong>denominator</strong> is 0 there, not the numerator. `x^2 - 9` is also 0 at `x = 3`." },
            { t:"`x ≠ 9`", why:"`x^2 - 9 = 0` means `x^2 = 9`, so `x = 3` or `x = -3`. At `x = 9` the denominator is 72." }],
          hints:["Restrictions come from the denominator. Where is `x^2 - 9` equal to 0?", "Factor it: `x^2 - 9 = (x - 3)(x + 3)`. Set each factor to 0.", "`x = 3` and `x = -3` both make the denominator 0. Cancelling the `(x + 3)` afterwards doesn’t change that: `x ≠ -3` and `x ≠ 3`."] },
        { id:"w2", skill:"Restrictions and zeros", goal:4,
          prompt:"For which value(s) of `x` is `(x - 4)/(x + 1)` equal to 0?",
          options:[
            { t:"`x = 4`", ok:true, why:"A fraction is 0 when its numerator is 0 and its denominator isn’t. `x - 4 = 0` at `x = 4`, where the denominator is 5." },
            { t:"`x = -1`", why:"At `x = -1` the denominator is 0, so the expression is undefined there, not 0. You can’t divide by 0." },
            { t:"`x = 4` and `x = -1`", why:"`x = 4` is right. But at `x = -1` the fraction has no value at all." },
            { t:"`x = -4`", why:"`x - 4 = 0` gives `x = 4`. At `x = -4` the fraction is `(-8)/(-3) = 8/3`." }],
          hints:["When is a fraction equal to 0?", "Only when its numerator is 0 and its denominator isn’t. Solve `x - 4 = 0`.", "`x = 4`, and there the denominator is 4 + 1 = 5, not 0. So the only answer is `x = 4`."] },
        { id:"w3", skill:"Signs", goal:3,
          prompt:"For which `x` is `(x - 1)(x + 3) < 0`?",
          options:[
            { t:"`-3 < x < 1`", ok:true, why:"The zeros −3 and 1 split the number line into three intervals. Only in the middle do the factors have opposite signs: at `x = 0`, (−1)(3) = −3 < 0." },
            { t:"`x < -3` or `x > 1`", why:"Test `x = 2`: (1)(5) = 5, which is positive. These are the intervals where the product is <strong>greater</strong> than 0." },
            { t:"`-1 < x < 3`", why:"`x - 1 = 0` at `x =` <strong>1</strong>, and `x + 3 = 0` at `x =` <strong>−3</strong>." },
            { t:"`x < 1`", why:"For `x < -3` <strong>both</strong> factors are negative, so the product is positive: at `x = -4`, (−5)(−1) = 5." }],
          hints:["Find the zero of each factor. Together they split the number line into intervals.", "The zeros are −3 and 1. Test one value in each interval: `x = -4`, 0 and 2.", "At −4: (−5)(−1) = 5 > 0. At 0: (−1)(3) = −3 < 0. At 2: (1)(5) = 5 > 0. Only `-3 < x < 1` works."] },
        { id:"w4", skill:"Even and odd", goal:6,
          prompt:"`f(x) = x^3 - 2x`. What is `f(-x)`, and what does it show?",
          options:[
            { t:"`-x^3 + 2x = -f(x)`, so `f` is odd", ok:true, why:"`(-x)^3 = -x^3` and `-2(-x) = 2x`. Every term changed sign, so `f(-x) = -f(x)`." },
            { t:"`-x^3 - 2x`, so `f` is neither", why:"Replace <strong>every</strong> `x`: `-2(-x) = +2x`. So `f(-x) = -x^3 + 2x`." },
            { t:"`x^3 - 2x = f(x)`, so `f` is even", why:"`(-x)^3 = (-x)(-x)(-x) = -x^3`. An odd power keeps the sign." },
            { t:"`-x^3 + 2x`, so `f` is even", why:"The algebra is right, but `-x^3 + 2x = -f(x)`, and `f(-x) = -f(x)` is the test for <strong>odd</strong>." }],
          hints:["Replace every `x` with `(-x)`.", "`(-x)^3 = -x^3`, and `-2(-x) = +2x`.", "`f(-x) = -x^3 + 2x = -(x^3 - 2x) = -f(x)`. That’s the test for odd."] },
        { id:"w5", skill:"Waves and decay", goal:5,
          prompt:"What is the period of `y = cos(πx)`?",
          options:[
            { t:"2", ok:true, why:"The period is `2π/k = 2π/π = 2`. Check: `cos(π · 0) = 1`, and the next time it’s 1 again is `cos(π · 2) = cos 2π = 1`." },
            { t:"1/2", why:"The period is `2π/k`, not `k/(2π)`. Here `2π/π = 2`." },
            { t:"π", why:"π is `k`, the number multiplying `x`. The period is `2π/π = 2`." },
            { t:"2π", why:"2π is the period of `cos x`. Multiplying `x` by π squeezes the wave: `2π/π = 2`." }],
          hints:["For `y = cos(kx)`, the period is `2π/k`.", "Here `k = π`.", "`2π/π = 2`. The wave repeats every 2 units: `cos(πx) = 1` at `x = 0`, 2, 4, …"] },
        { id:"w6", skill:"Waves and decay", goal:5,
          prompt:"`y = 16(1/2)^x`. What is `y` when `x = 3`?",
          options:[
            { t:"2", ok:true, why:"`(1/2)^3 = 1/8`, and `16 × 1/8 = 2`. Each step of 1 in `x` halves `y`: 16, 8, 4, 2." },
            { t:"1/8", why:"`(1/2)^3 = 1/8` is right, but `y = 16 × 1/8`." },
            { t:"24", why:"`16 × (3 × 1/2) = 24`. The exponent means multiplying 1/2 by itself 3 times." },
            { t:"512", why:"That’s `(16 × 1/2)^3 = 8^3`. The exponent belongs to the 1/2 only." }],
          hints:["Do the power first: what is `(1/2)^3`?", "`(1/2)^3 = 1/8`. Now multiply by 16.", "`16 × 1/8 = 2`."] }
      ],
      refreshers:{
        "Restrictions and zeros":"A fraction is undefined where its <strong>denominator</strong> is 0, and it equals 0 where its <strong>numerator</strong> is 0 and its denominator isn’t. Find the restrictions from the original denominator, before cancelling anything. Example: in `(x + 3)/(x^2 - 9)`, `x^2 - 9 = (x - 3)(x + 3)`, so `x ≠ 3` and `x ≠ -3`, even though the expression simplifies to `1/(x - 3)`.",
        "Signs":"A product is negative when it has an odd number of negative factors and positive when it has an even number. To find where `(x - 1)(x + 3) < 0`, mark the zeros −3 and 1, test one value in each interval, and keep the intervals where the result is negative: `-3 < x < 1`.",
        "Even and odd":"Replace `x` with `-x`. If `f(-x) = f(x)`, `f` is even: its graph is its own mirror image in the `y`-axis. If `f(-x) = -f(x)`, `f` is odd: its graph matches itself after a half turn about the origin. Example: `f(x) = x^3 - 2x` gives `f(-x) = -x^3 + 2x = -f(x)`, so `f` is odd. `sin x` is odd and `cos x` is even.",
        "Waves and decay":"`y = cos(kx)` has period `2π/k`, so `cos(πx)` repeats every 2. It’s 1 at `x = 0`, 2, 4, …, −1 at `x = 1`, 3, 5, …, and 0 halfway between. `y = a(b)^x` with `0 < b < 1` decays: `16(1/2)^x` is 16, 8, 4, 2, 1 at `x = 0`, 1, 2, 3, 4. Do the power before multiplying by `a`."
      }
    }
  },
  explore:{
    heading:"Envelope explorer: multiply and divide, one height at a time",
    intro:"Pick two functions and slide the probe. At every `x`, the panel multiplies (or divides) the two heights. Press <strong>Trace</strong> to build the whole graph, then switch to <strong>Spring</strong> to watch a product move.",
    predictions:[
      { id:"p1", start:{ mode:"mul", view:"stacked", f:"4mx2", g:"cos", x:-3 },
        prompt:"Where will `f · g = (4 - x^2)cos(πx)` be 0 between `x = -3` and `x = 3`?",
        options:[{ t:"At `x = ±2` and at `x = ±1/2`, `±3/2` and `±5/2`", ok:true }, { t:"Only at `x = -2` and `x = 2`" }, { t:"Only at `x = ±1/2`, `±3/2` and `±5/2`" }, { t:"Only where the graphs of `f` and `g` cross each other" }],
        explain:"0 times anything is 0, so a product is 0 wherever <strong>either</strong> factor is 0. `f = 4 - x^2` is 0 at ±2, and `g = cos(πx)` is 0 halfway between whole numbers, so `f · g` has 8 zeros in this window. Where the graphs of `f` and `g` cross, `f(x) = g(x)`. That makes the <strong>difference</strong> `f - g` zero, not the product." },
      { id:"p2", start:{ mode:"spring", a:16, b:"1/2", t:0, fences:false },
        prompt:"The mass is pulled up 16 cm and released: `y = 16(1/2)^t cos(πt)`. What will it do?",
        options:[{ t:"It swings through rest, reaching half as far each second: 8 cm below rest at `t = 1`, 4 cm above at `t = 2`, 2 cm below at `t = 3`", ok:true }, { t:"It bobs up and down by 1 cm around the curve `y = 16(1/2)^t`, sinking slowly toward rest" }, { t:"It keeps swinging 16 cm above and below rest; the 1/2 only makes each swing slower" }, { t:"It drops to rest at `t = 1/2` and stays there" }],
        explain:"`cos(πt)` stays between −1 and 1, so multiplying by it keeps `y` between `16(1/2)^t` and `-16(1/2)^t`. At whole seconds `cos(πt) = ±1`, so the mass touches a fence: `y(1) = 8 × (-1) = -8`, `y(2) = 4 × 1 = 4`, `y(3) = 2 × (-1) = -2`. At `t = 1/2`, 3/2, … `cos(πt) = 0`, so the mass passes through rest without stopping. <strong>Adding</strong> the wave would make it bob around the curve; <strong>multiplying</strong> turns the curve into a fence. The base 1/2 sets how fast the swings shrink, not how long each one takes: the period stays 2 s." },
      { id:"p3", start:{ mode:"div", view:"overlay", f:"xm2", g:"x2m4", x:1 },
        prompt:"`g(x) = x^2 - 4` is 0 at `x = -2` and at `x = 2`. What will the graph of `f/g = (x - 2)/(x^2 - 4)` do at those two values?",
        options:[{ t:"A vertical asymptote at `x = -2` and a hole at `x = 2`", ok:true }, { t:"Vertical asymptotes at both" }, { t:"A hole at `x = -2` and a vertical asymptote at `x = 2`" }, { t:"It crosses the `x`-axis at both" }],
        explain:"At `x = 2` <strong>both</strong> `f` and `g` are 0. They share the factor `x - 2`, which cancels: `f/g = 1/(x + 2)` for `x ≠ 2`. So near 2 the graph heads for `1/(2 + 2) = 1/4`, and there’s a hole at (2, 1/4). At `x = -2` only `g` is 0 (`f(-2) = -4`), so `f/g` is −4 divided by a tiny number: a vertical asymptote. A zero of `g` is never a zero of `f/g`, because you can’t divide by 0." },
      { id:"p4", start:{ mode:"mul", view:"overlay", f:"x", g:"sin", x:0, fences:true },
        prompt:"`f(x) = x` and `g(x) = sin(πx)` are both odd. What symmetry will `f · g = x sin(πx)` have?",
        options:[{ t:"Even: it will be its own mirror image in the `y`-axis", ok:true }, { t:"Odd: it will match itself after a half turn about the origin" }, { t:"Neither: two odd functions multiply to a function with no symmetry" }, { t:"Both even and odd" }],
        explain:"`(f · g)(-x) = f(-x) · g(-x) = (-f(x))(-g(x)) = f(x)g(x)`. Each odd factor flips the sign, and the two flips cancel, just as (−3)(−5) = 15. So odd · odd is even, unlike odd × odd for whole numbers. Only the zero function is both even and odd." }
    ],
    chalIntro:"Set the explorer (or press <strong>Set up this challenge</strong>), then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:5, prompt:"(Spring) Set `a` and `b` so that at `t` = 4 s the mass is exactly 1 cm above rest.",
        why:"`y(4) = 16 × (1/2)^4 × cos 4π = 16 × 1/16 × 1 = 1` cm.",
        hints:["At `t = 4`, `cos(4π) = 1`, so `y(4) = a · b^4`.", "Try `b = 1/2`: `(1/2)^4 = 1/16`. What must `a` be?", "`a × 1/16 = 1` gives `a = 16`. Set `a = 16` and `b = 1/2`, then slide `t` to 4 to see it."] },
      { id:"tc2", goal:4, prompt:"(Divide) Choose `g` so that the graph of `f/g` has a hole, then put the probe on a hole.",
        why:"`f/g = -1` everywhere except `x = ±2`: a flat line with two holes, at (−2, −1) and (2, −1).",
        hints:["A hole needs `f` and `g` to be 0 at the same `x`. Where is `4 - x^2 = 0`?", "`f` is 0 at `x = 2` and `x = -2`. Which `g` in the menu is 0 there too?", "`g(x) = x^2 - 4`. Then `f/g = (4 - x^2)/(x^2 - 4) = -1` for `x ≠ ±2`. Put the probe at `x = 2` or `x = -2`."] },
      { id:"tc3", goal:3, stretch:true, prompt:"(Multiply) Choose `f` and `g` so that the graph of `f · g` <strong>touches</strong> the `x`-axis at `x = 2` <strong>without crossing it</strong>. Then put the probe at `x = 2`.",
        why:"Both factors change sign at `x = 2`, and the two sign changes cancel. You’ll use this in Part 3.",
        hints:["For `f · g` to be 0 at 2, at least one factor must be 0 there. To touch without crossing, `f · g` must have the same sign just left and just right of 2.", "If only one factor changes sign at 2, the product changes sign. What if <strong>both</strong> factors change sign at 2?", "Choose an `f` that is 0 at 2 (`x - 2` or `4 - x^2`) and a `g` that is 0 at 2 (`sin(πx)` or `x^2 - 4`). For `x - 2` and `sin(πx)`: just left of 2 both are negative, and just right both are positive, so the product is positive on both sides."] }
    ]
  },
  part3:{
    slug:"signs", name:"Signs",
    heading:"Sign and shape: build `f · g` and `f/g` from their factors",
    intro:"Mark where each factor is 0, read each factor’s sign from its graph, then decide the sign and shape of the result. When your chart is right, the graph draws itself across it.",
    blocks:[{ title:"What the rules say", html:"<p><strong>Sign.</strong> Count the negative factors: an even number gives a positive result, an odd number a negative one. Division follows the same rule as multiplication.</p><p><strong>Zeros.</strong> `f · g = 0` wherever `f = 0` or `g = 0`. `f/g = 0` wherever `f = 0` and `g ≠ 0`.</p><p><strong>Breaks in `f/g`.</strong> Where `g = 0`, `f/g` is undefined. If `f ≠ 0` there, the graph has a vertical asymptote. If `f = 0` there too and the common factor cancels, it has a hole.</p><p><strong>Sign changes.</strong> Where exactly one factor changes sign, the result changes sign. Where both change sign at the same `x`, the two changes cancel: a product touches the axis, and a quotient has a hole with the same sign on both sides.</p>" }],
    cases:[
      { id:"A", op:"mul", f:"`f(x) = x^2 - 1`", g:"`g(x) = sin(πx)`", res:"`f · g`",
        alg:"`(x^2 - 1) sin(πx) = (x - 1)(x + 1) sin(πx)`. On (0, 1): `x - 1 < 0`, `x + 1 > 0` and `sin(πx) > 0`. One negative factor, so the product is negative. At `x = 1` both `x - 1` and `sin(πx)` change sign, so the product keeps its sign. The product is odd (even × odd), which is why the signs on the left are the opposite of the signs on the right." },
      { id:"B", op:"div", f:"`f(x) = x^2 + x - 2`", g:"`g(x) = x^2 - 4x + 3`", res:"`f/g`",
        alg:"`(x^2 + x - 2)/(x^2 - 4x + 3) = ((x + 2)(x - 1))/((x - 1)(x - 3)) = (x + 2)/(x - 3)` for `x ≠ 1`. Domain `{x ∈ ℝ | x ≠ 1, x ≠ 3}`. Hole at `(1, (1 + 2)/(1 - 3)) = (1, -3/2)`. Vertical asymptote `x = 3`. Zero at `x = -2`." },
      { id:"C", op:"div", f:"`f(x) = sin(πx)`", g:"`g(x) = cos(πx)`", res:"`f/g`",
        alg:"`sin(πx)/cos(πx) = tan(πx)` (module 31). It’s undefined where `cos(πx) = 0`, at `x = 1/2` and 3/2. There `sin(πx) = ±1`, so those are vertical asymptotes. It’s 0 at `x = 1`, where `sin(πx) = 0` and `cos(πx) = -1`." }
    ],
    quickCheck:{
      title:"Sign and shape", summary:"Sign and shape quick check",
      items:[
        { id:"q1", goal:3, prompt:"`f(x) = x - 3` and `g(x) = x + 1`. Where is `(f · g)(x) < 0`?",
          choices:[{ t:"`(-1, 3)`", ok:true, fb:"Right. Between −1 and 3 the factors have opposite signs: at `x = 0`, (−3)(1) = −3." },
            { t:"`(-∞, -1) ∪ (3, ∞)`", fb:"There both factors have the same sign, so the product is positive: at `x = 4`, (1)(5) = 5." },
            { t:"`(-3, 1)`", fb:"Check the zeros: `x - 3 = 0` at <strong>3</strong>, and `x + 1 = 0` at <strong>−1</strong>." }] },
        { id:"q2", goal:3, prompt:"`f(x) = 2^x`, which is always positive, and `g(x) = sin(πx)`. Where between `x = 0` and `x = 4` is `f · g` negative?",
          choices:[{ t:"`1 < x < 2` and `3 < x < 4`", ok:true, fb:"Right. A positive factor never changes the sign, so `f · g` has the sign of `sin(πx)`, which is negative on (1, 2) and (3, 4)." },
            { t:"`0 < x < 1` and `2 < x < 3`", fb:"There `sin(πx)` is positive: `sin(π/2) = 1`." },
            { t:"nowhere, because `2^x` is always positive", fb:"`2^x` is positive, but `sin(πx)` isn’t always: positive × negative = negative." }] },
        { id:"q3", goal:4, prompt:"`f(x) = x^2 - 9` and `g(x) = x + 3`. What does the graph of `f/g` have at `x = -3`?",
          choices:[{ t:"a hole at (−3, −6)", ok:true, fb:"Right. `f(-3) = 0` too, and `(x^2 - 9)/(x + 3) = x - 3` for `x ≠ -3`. At −3 that’s −6, so the hole is at (−3, −6)." },
            { t:"a vertical asymptote `x = -3`", fb:"`f` is 0 at −3 as well, and the common factor `x + 3` cancels: a hole, not an asymptote." },
            { t:"a zero (it crosses the `x`-axis)", fb:"`g(-3) = 0`, so `f/g` has no value at `x = -3`." }] },
        { id:"q4", goal:4, prompt:"`f(x) = x + 2` and `g(x) = (x - 1)^2`. What does `f/g` do on each side of `x = 1`?",
          choices:[{ t:"`→ ∞` on both sides", ok:true, fb:"Right. Near 1, `f` is close to 3, which is positive, and `(x - 1)^2` is a tiny <strong>positive</strong> number on both sides. So `f/g → ∞` on both sides. A squared factor doesn’t change sign." },
            { t:"`→ -∞` on the left and `→ ∞` on the right", fb:"`(x - 1)^2` is never negative, so `g` doesn’t change sign at 1. Only a factor that changes sign can flip the result." },
            { t:"it has a hole at `x = 1`", fb:"`f(1) = 3`, not 0, so nothing cancels. It’s a vertical asymptote." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"parity", type:"sorter", title:"Even, odd or neither?", summary:"Even, odd or neither?", goal:6, noun:"function",
        instruction:"Sort each product or quotient by its symmetry. The angles are in radians; `sin x` is odd and `cos x` is even (module 31).",
        how:"Tap a function, then tap the box it belongs in.",
        boxes:[{ id:"even", label:"Even", sub:"`h(-x) = h(x)`" }, { id:"odd", label:"Odd", sub:"`h(-x) = -h(x)`" }, { id:"neither", label:"Neither" }],
        items:[
          it("s1", "`x sin x`", "even", "oo", "`x` and `sin x` are both odd: `(-x) sin(-x) = (-x)(-sin x) = x sin x`.",
            ["Is `x` even or odd? Is `sin x`?", "Both are odd. Replace `x` with `-x` in both factors.", "`(-x) sin(-x) = (-x)(-sin x) = x sin x`. The two signs cancel, so it’s <strong>Even</strong>."]),
          it("s2", "`x^2 sin x`", "odd", "oe", "`x^2` is even and `sin x` is odd: `(-x)^2 sin(-x) = x^2(-sin x) = -x^2 sin x`.",
            ["Is `x^2` even or odd? Is `sin x`?", "`x^2` is even and `sin x` is odd. Replace `x` with `-x` in both factors.", "`(-x)^2 sin(-x) = x^2(-sin x) = -x^2 sin x`. Only one sign flips, so it’s <strong>Odd</strong>."]),
          it("s3", "`(sin x)/x`", "even", "oo", "Odd ÷ odd: `sin(-x)/(-x) = (-sin x)/(-x) = (sin x)/x`. Its domain, `x ≠ 0`, is symmetric too.",
            ["Is `sin x` even or odd? Is `x`?", "Both are odd. Replace `x` with `-x` in both the top and the bottom.", "`sin(-x)/(-x) = (-sin x)/(-x) = (sin x)/x`. The two signs cancel, so it’s <strong>Even</strong>."]),
          it("s4", "`(cos x)/x`", "odd", "oe", "Even ÷ odd: `cos(-x)/(-x) = -(cos x)/x`.",
            ["Is `cos x` even or odd? Is `x`?", "`cos x` is even and `x` is odd. Replace `x` with `-x` in both the top and the bottom.", "`cos(-x)/(-x) = (cos x)/(-x) = -(cos x)/x`. Only the bottom flips, so it’s <strong>Odd</strong>."]),
          it("s5", "`(x - 1) sin x`", "neither", null, "`x - 1` is neither even nor odd. At `x = π/2` the product is `π/2 - 1`, about 0.57; at `x = -π/2` it’s `π/2 + 1`, about 2.57. Not equal, and not opposite.",
            ["Is `x - 1` even, odd or neither?", "`-x - 1` is neither `x - 1` nor `-(x - 1)`. So test the product with numbers: try `x = π/2` and `x = -π/2`.", "At `π/2` the product is `π/2 - 1`, about 0.57; at `-π/2` it’s `π/2 + 1`, about 2.57. They aren’t equal and aren’t opposite, so it’s <strong>Neither</strong>."],
            nWrong("x - 1", "at `x = π/2` the product is `π/2 - 1`, about 0.57; at `x = -π/2` it’s `π/2 + 1`, about 2.57.")),
          it("s6", "`sin x cos x`", "odd", "oe", "Odd × even: `sin(-x) cos(-x) = (-sin x)(cos x) = -sin x cos x`.",
            ["Is `sin x` even or odd? Is `cos x`?", "`sin x` is odd and `cos x` is even. Replace `x` with `-x` in both factors.", "`sin(-x) cos(-x) = (-sin x)(cos x) = -sin x cos x`. Only one sign flips, so it’s <strong>Odd</strong>."]),
          it("s7", "`x/(x^2 + 1)`", "odd", "oe", "Odd ÷ even: `(-x)/((-x)^2 + 1) = -x/(x^2 + 1)`.",
            ["Is `x` even or odd? Is `x^2 + 1`?", "`x` is odd and `x^2 + 1` is even. Replace `x` with `-x` in both the top and the bottom.", "`(-x)/((-x)^2 + 1) = -x/(x^2 + 1)`. Only the top flips, so it’s <strong>Odd</strong>."]),
          it("s8", "`(x^2 + 1)/(x^2 - 4)`", "even", "ee", "Even ÷ even is even, and the domain, `x ≠ ±2`, is symmetric.",
            ["Is `x^2 + 1` even or odd? Is `x^2 - 4`?", "Both are even. Replace `x` with `-x` in both the top and the bottom.", "`((-x)^2 + 1)/((-x)^2 - 4) = (x^2 + 1)/(x^2 - 4)`. Nothing flips, and the domain, `x ≠ ±2`, is symmetric, so it’s <strong>Even</strong>."]),
          it("s9", "`2^x cos x`", "neither", null, "`2^x` is neither even nor odd. At `x = π` and `x = -π`, `cos x = -1` both times, but `2^π` is much bigger than `2^{-π}`: the two values are neither equal nor opposite.",
            ["Is `2^x` even, odd or neither?", "`2^{-x} = 1/2^x`, which is neither `2^x` nor `-2^x`. So test the product with numbers: try `x = π` and `x = -π`.", "At ±π, `cos x = -1`, so the values are `-2^π` and `-2^{-π}`. They aren’t equal and aren’t opposite, so it’s <strong>Neither</strong>."],
            nWrong("2^x", "at `x = π` and `x = -π`, `cos x = -1` both times, but `2^π` is much bigger than `2^{-π}`, so the two values are neither equal nor opposite.")),
          it("s10", "`sin^2 x`", "even", "oo", "`sin^2 x = sin x · sin x`: odd × odd is even. `sin^2(-x) = (-sin x)^2 = sin^2 x`.",
            ["Write `sin^2 x` as a product. Is each factor even or odd?", "`sin^2 x = sin x · sin x`: two odd factors. Replace `x` with `-x`.", "`sin^2(-x) = (-sin x)^2 = sin^2 x`. The two signs cancel, so it’s <strong>Even</strong>."])
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Diego", how:"",
        instruction:"Diego made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"`f(x) = x^2 - 9` and `g(x) = x^2 - x - 6`. State the domain of `f/g`.",
            steps:["`(f/g)(x) = (x^2 - 9)/(x^2 - x - 6)`.", "`= ((x - 3)(x + 3))/((x - 3)(x + 2))`.", "`= (x + 3)/(x + 2)`, after cancelling `x - 3`.", "`x + 2` is 0 only at `x = -2`, so the domain is `{x ∈ ℝ | x ≠ -2}`.", "So the graph of `f/g` has a vertical asymptote at `x = -2` and no other breaks."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: both factorings expand back to the originals.", "Cancelling is fine, as long as you remember that `x ≠ 3`. The mistake is later.", "", "Step 5 follows from step 4. The asymptote at `x = -2` is right, but the mistake in step 4 hides another break."],
            fixes:[
              { t:"Read the domain from the original denominator: `x^2 - x - 6 = 0` at `x = 3` and `x = -2`, so the domain is `{x ∈ ℝ | x ≠ -2, x ≠ 3}`.", ok:true, why:"At `x = 3` the original quotient is 0/0, which is undefined. Cancelling hides that, so the graph has a hole at (3, 6/5)." },
              { t:"Also exclude the zero of the new numerator: the domain is `{x ∈ ℝ | x ≠ -3, x ≠ -2}`.", why:"`x = -3` makes the numerator 0, so `f/g = 0` there: a zero, not a restriction. And `x = 3` is still missing." },
              { t:"Exclude every zero of `f` and of `g`: `{x ∈ ℝ | x ≠ -3, x ≠ -2, x ≠ 3}`.", why:"Zeros of `f` don’t break `f/g`: `(f/g)(-3) = 0/(9 + 3 - 6) = 0`, a perfectly good value." },
              { t:"Step 4 is correct: cancelling `x - 3` removes the restriction at `x = 3`.", why:"Cancelling changes how the formula looks, not where `f/g` is defined. `g(3) = 0`, so `f/g` is undefined at `x = 3`." }],
            hints:["Is the domain of `f/g` decided before or after you cancel?", "Where is the original denominator, `x^2 - x - 6`, equal to 0?", "Step 4 is wrong. `x^2 - x - 6 = (x - 3)(x + 2)` is 0 at `x = 3` and `x = -2`, so the domain is `{x ∈ ℝ | x ≠ -2, x ≠ 3}`, with a hole at (3, 6/5)."] },
          { id:"e2", goal:1, task:"`f(x) = 2x - 1` and `g(x) = x^2 + 1`. Find `(f · g)(-1)` and `(f/g)(-1)`.",
            steps:["`f(-1) = 2(-1) - 1 = -3`.", "`g(-1) = (-1)^2 + 1 = 2`.", "`(f · g)(-1) = f(g(-1)) = f(2) = 3`.", "`(f/g)(-1) = f(-1)/g(-1) = -3/2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: `(-1)^2 = 1`.", "", "Step 4 is correct: that’s exactly how a quotient works. The mistake is earlier."],
            fixes:[
              { t:"`(f · g)(-1) = f(-1) × g(-1) = (-3)(2) = -6`.", ok:true, why:"The dot means multiply the two outputs at the same `x`, just as step 4 divides them." },
              { t:"`(f · g)(-1) = g(f(-1)) = g(-3) = 10`.", why:"That’s a composition the other way round. `f · g` multiplies `f(-1)` by `g(-1)`." },
              { t:"`(f · g)(-1) = f(-1) + g(-1) = -1`.", why:"That’s `(f + g)(-1)`, from module 46. The dot means multiply." },
              { t:"Step 3 is correct: `f · g` means put `g(x)` into `f`.", why:"Putting `g` into `f` is `f(g(x))`, a composition (module 48). `(f · g)(x) = f(x) · g(x)`." }],
            hints:["What does the dot in `f · g` mean?", "`(f · g)(-1) = f(-1) × g(-1)`. You already have both values.", "Step 3 is wrong: `(f · g)(-1) = (-3)(2) = -6`."] },
          { id:"e3", goal:5, task:"A spring’s height above rest is `y(t) = 12(1/2)^t cos(πt)` cm. Where is the mass at `t` = 3 s?",
            steps:["The fence at `t = 3` is `12(1/2)^3 = 12/8 = 1.5` cm.", "The wave at `t = 3` is `cos(3π) = -1`.", "So `y(3) = 1.5 + (-1) = 0.5`.", "The mass is 0.5 cm above rest."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: `cos(πt)` is −1 at every odd whole number.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"`y(3) = 1.5 × (-1) = -1.5`, so the mass is 1.5 cm below rest.", ok:true, why:"The model multiplies the fence by the wave. At `t = 3` the wave is −1, so the mass touches the lower fence." },
              { t:"`y(3) = 1.5 × 1 = 1.5`: only the size of the wave matters, so the mass is 1.5 cm above rest.", why:"The sign of `cos(3π)` matters: −1 puts the mass below rest." },
              { t:"`y(3) = 12 × (-1) = -12`, so the mass is 12 cm below rest.", why:"That drops the `(1/2)^3`. By `t = 3` the swings have shrunk to 1.5 cm." },
              { t:"Step 3 is correct: the fence lifts the wave up and down.", why:"Adding would make the mass bob around the fence. The model multiplies, so the fence sets the size of each swing." }],
            hints:["Is the fence added to the wave, or multiplied by it?", "`y(3) =` (fence) × (wave) `= 1.5 × cos(3π)`.", "Step 3 is wrong: `y(3) = 1.5 × (-1) = -1.5`, so the mass is 1.5 cm below rest."] }
        ] },
      { id:"builds", type:"custom", title:"Work backwards: build the combination", summary:"Work backwards", star:true, goal:[3, 4, 5, 6],
        instruction:"Fill in the boxes so the combination has every feature listed.",
        how:"Type a number in each box, then press Check. After each check you’ll see the graph of <strong>your</strong> combination.",
        items:[
          { id:"b1", goal:4, kind:"b1", tpl:["g(x) = x^2 + ", { box:"b" }, "x + ", { box:"c" }, ", with f(x) = x - 1"],
            features:"`f/g` has a hole at `x = 1` and a vertical asymptote `x = -4`.",
            answer:{ b:3, c:-4 },
            why:"`g(x) = (x - 1)(x + 4) = x^2 + 3x - 4`, and `f/g = 1/(x + 4)` for `x ≠ 1`, with the hole at (1, 1/5).",
            wrong:[{ v:{ b:-3, c:-4 }, fb:"Your `g = (x - 4)(x + 1)` is 0 at 4 and −1. That gives asymptotes there and no hole. Check the signs in the factors." },
              { v:{ b:5, c:4 }, fb:"`(x + 1)(x + 4)` is 0 at −4, but not at 1, so there’s no hole: `f/g = 0` at `x = 1`." },
              { v:{ b:-5, c:4 }, fb:"`(x - 1)(x - 4)` gives the hole at 1, but its asymptote is at `x = 4`, not −4." }],
            hints:["A hole at `x = 1` needs `g(1) = 0` (`f(1)` is already 0). An asymptote at −4 needs `g(-4) = 0`.", "So `g(x) = (x - 1)(x + 4)`. Expand it.", "`(x - 1)(x + 4) = x^2 + 3x - 4`, so `b = 3` and `c = -4`."] },
          { id:"b2", goal:6, kind:"b2", tpl:["g(x) = ", { box:"a" }, "x + ", { box:"c" }, ", with f(x) = x^2 - 4"],
            features:"`f · g` is odd, and `(f · g)(1) = 6`.",
            answer:{ a:-2, c:0 },
            why:"`g(x) = -2x`, and `f · g = -2x^3 + 8x`.",
            wrong:[{ v:{ a:2, c:0 }, fb:"`(f · g)(1) = (1 - 4)(2) = -6`. `f(1)` is negative, so `g(1)` must be negative too." },
              { v:{ a:0, c:-2 }, fb:"`(f · g)(1) = (-3)(-2) = 6`, but `g = -2` is even, so `f · g = -2x^2 + 8` is even, not odd." },
              { v:{ cnz:true }, fb:"With `c ≠ 0`, `g` is neither even nor odd, and so is `f · g`: compare `(f · g)(1)` with `(f · g)(-1)`." }],
            hints:["`f` is even. What must `g` be for the product to be odd?", "`g` must be odd, so `c = 0` and `g(x) = ax`. Then `(f · g)(1) = f(1) × a`.", "`f(1) = -3`, so `-3a = 6` and `a = -2`: `g(x) = -2x`."] },
          { id:"b3", goal:5, kind:"b3", tpl:["y(t) = ", { box:"a", min:-40, max:40 }, " · (", { box:"p", min:1, max:9, frac:"top" }, "/", { box:"q", min:1, max:9, frac:"bottom" }, ")^t · cos(πt)"],
            features:"At `t = 1` the mass is 6 cm below rest. At `t = 3` it is 2/3 cm below rest.",
            note:"`a` is a whole number from −40 to 40. The base is a fraction box: whole numbers from 1 to 9 on top and bottom (equal fractions such as 2/6 are accepted).",
            answer:{ a:18, b:[1, 3] },
            why:"`y(1) = 18 × 1/3 × (-1) = -6` and `y(3) = 18 × 1/27 × (-1) = -2/3`.",
            wrong:[{ v:{ a:54, b:[1, 9] }, fb:"`y(1) = -6` works, but `y(3) = -54/729 = -2/27`. Dividing the two conditions gives `b^2 = 1/9`, so take the square root." },
              { v:{ a:2, b:[3, 1] }, fb:"`y(1) = -6` works, but the swings grow: `y(3) = -54`. The fraction is upside down." },
              { v:{ a:6, b:[1, 1] }, fb:"No damping: `y(3) = -6`, not −2/3." },
              { v:{ a:-18, b:[1, 3] }, fb:"`y(1) = (-18)(1/3)(-1) = 6`, which is above rest. `cos π = -1` already makes the height negative, so `a` stays positive." }],
            hints:["Write both conditions: `y(1) = a · b · cos π` and `y(3) = a · b^3 · cos 3π`.", "`cos π = cos 3π = -1`, so `ab = 6` and `ab^3 = 2/3`. Divide the second by the first.", "`b^2 = (2/3)/6 = 1/9`, so `b = 1/3`, and `a = 6 ÷ 1/3 = 18`: `y = 18(1/3)^t cos(πt)`."] },
          { id:"b4", goal:5, kind:"b4", tpl:["f(x) = ", { box:"p" }, "x + ", { box:"q" }, " and h(x) = f(x) · cos(πx)"],
            features:"The graph of `h` touches the fence `y = f(x)` at (2, 5) and touches the fence `y = -f(x)` at (1, −3).",
            answer:{ p:2, q:1 },
            why:"`f(x) = 2x + 1`, so `h(2) = 5 × cos 2π = 5` and `h(1) = 3 × cos π = -3`.",
            wrong:[{ v:{ p:8, q:-11 }, fb:"You used `f(1) = -3`. But (1, −3) is a point on `h`, and `h(1) = f(1) × cos π = -f(1)`. So `f(1) = 3`." }],
            other:"Right now `h(2) =` {h2} and `h(1) =` {h1}. You need 5 and −3.",
            hints:["At `x = 2`, `cos 2π = 1`, so `h(2) = f(2)`. At `x = 1`, `cos π = -1`, so `h(1) = -f(1)`.", "So `f(2) = 5` and `f(1) = 3`: the line `f` passes through (1, 3) and (2, 5).", "Slope `(5 - 3)/(2 - 1) = 2`, and `2(1) + q = 3` gives `q = 1`: `f(x) = 2x + 1`."] },
          { id:"b5", goal:4, kind:"b5", tpl:["f(x) = x + ", { box:"p" }, " and g(x) = x^2 - ", { box:"q" }],
            features:"`f/g` has exactly one vertical asymptote, `x = 3`, and its graph passes through (1, −1/2).",
            answer:{ p:3, q:9 },
            why:"`(x + 3)/(x^2 - 9) = 1/(x - 3)` for `x ≠ -3`, with a hole at (−3, −1/6). At `x = 1` it’s `4/(-8) = -1/2`.",
            wrong:[{ v:{ p:-3, q:9 }, fb:"Now `x - 3` cancels instead: a hole at `x = 3` and the asymptote at `x = -3`." },
              { v:{ p:0, q:9 }, fb:"`x/(x^2 - 9)` has two asymptotes, `x = 3` and `x = -3`. The second one must cancel." },
              { v:{ q:3 }, fb:"`x^2 - 3 = 0` at `±√3`, not at 3." }],
            hints:["Which `g` has `x = 3` as a zero?", "`q = 9` gives `x^2 - 9`, which is 0 at 3 <strong>and</strong> at −3. The −3 mustn’t become an asymptote, so make `f(-3) = 0` and let it cancel.", "`p = 3`: `(x + 3)/(x^2 - 9) = 1/(x - 3)` for `x ≠ -3`. One asymptote, `x = 3`, a hole at (−3, −1/6), and at `x = 1` the value is −1/2."] },
          { id:"b6", goal:6, kind:"b6", tpl:["f(x) = x + ", { box:"c" }, ", with g(x) = x - 3"],
            features:"`f` and `g` are both increasing. Make `f · g` decreasing on `(-∞, 1)` and increasing on `(1, ∞)`.",
            answer:{ c:1 },
            why:"`f · g = (x + 1)(x - 3) = x^2 - 2x - 3`, a parabola with its vertex at `x = 1`.",
            wrong:[{ v:{ c:-1 }, fb:"`f · g = (x - 1)(x - 3)` has zeros 1 and 3, so it turns halfway between them, at `x = 2`." },
              { v:{ c:5 }, fb:"Zeros at −5 and 3: it turns at `x = -1`." }],
            hints:["`f · g` is a parabola that opens up. It turns halfway between its two zeros.", "The zeros are `-c` and 3. Their midpoint must be 1.", "`(-c + 3)/2 = 1` gives `c = 1`: `f · g = (x + 1)(x - 3)`, decreasing on `(-∞, 1)` and increasing on `(1, ∞)`."] },
          { id:"b7", goal:[3, 4], star:true, kind:"b7", tpl:["f(x) = x^2 + ", { box:"b" }, "x + ", { box:"c" }, " and g(x) = x - ", { box:"r", min:-10, max:10 }],
            features:"`f · g` is 0 at exactly two values, `x = -1` and `x = 3`, and `f/g` has a hole at `x = 3`.",
            answer:{ b:-2, c:-3, r:3 },
            why:"`f(x) = (x - 3)(x + 1)`. Then `f · g = (x - 3)^2(x + 1)`, which touches the axis at 3 and crosses at −1, and `f/g = x + 1` for `x ≠ 3`, with a hole at (3, 4).",
            wrong:[{ v:{ b:-6, c:9, r:3 }, fb:"`f = (x - 3)^2`, so `f · g = (x - 3)^3` is 0 only at 3. The zero at −1 has to come from `f`." },
              { v:{ b:-2, c:-3, r:-1 }, fb:"The zeros of `f · g` are right, but `g = x + 1` puts the hole at `x = -1`, not 3." },
              { v:{ b:2, c:-3, r:3 }, fb:"`f = (x + 3)(x - 1)` isn’t 0 at 3, so nothing cancels: `x = 3` becomes an asymptote, and `f · g` is 0 at −3, 1 and 3." }],
            hints:["A hole at `x = 3` needs `g(3) = 0` <strong>and</strong> `f(3) = 0`.", "So `r = 3` and `x - 3` is a factor of `f`. The product’s other zero, −1, has to come from `f`.", "`f(x) = (x - 3)(x + 1) = x^2 - 2x - 3`: `b = -2`, `c = -3`, `r = 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: the fences, where the product was 0, or what happened to `f/g` where `g(x) = 0`?" },
      { id:"j2", q:"In your own words, explain why multiplying by `cos(πx)` keeps a graph between `y = f(x)` and `y = -f(x)`, but adding `cos(πx)` doesn’t." },
      { id:"j3", q:"Explain to a friend, step by step, how to find the domain, zeros, asymptotes and holes of `f/g` when `f(x) = x^2 - 1` and `g(x) = x^2 + 3x + 2`." },
      { id:"j4", q:"Which is shakiest for you: signs, domains, holes, fences or symmetry? What will you do about it before module 48?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`f(x) = x^2 - 1` and `g(x) = 2x + 3`. What is `(f · g)(2)`?", options:[
          { t:"21", ok:true, why:"`f(2) = 3` and `g(2) = 7`, so `(f · g)(2) = 3 × 7 = 21`." },
          { t:"9", why:"That’s `g(f(2)) = g(3) = 9`. The dot means multiply: `f(2) × g(2)`." },
          { t:"10", why:"That’s `f(2) + g(2) = 3 + 7`, which is `(f + g)(2)`." },
          { t:"48", why:"That’s `f(g(2)) = f(7) = 48`, a composition. `(f · g)(2) = f(2) × g(2)`." }] },
        b:{ prompt:"`f(x) = x^2 + 2` and `g(x) = 5 - x`. What is `(f · g)(3)`?", options:[
          { t:"22", ok:true, why:"`f(3) = 11` and `g(3) = 2`, so `(f · g)(3) = 11 × 2 = 22`." },
          { t:"−6", why:"That’s `g(f(3)) = g(11) = -6`. The dot means multiply: `f(3) × g(3)`." },
          { t:"6", why:"That’s `f(g(3)) = f(2) = 6`, a composition." },
          { t:"13", why:"That’s `f(3) + g(3) = 11 + 2`, which is `(f + g)(3)`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`f(x) = x - 4` and `g(x) = x^2 - 2x - 8`. What is the domain of `f/g`?", options:[
          { t:"`{x ∈ ℝ | x ≠ -2, x ≠ 4}`", ok:true, why:"`g(x) = (x - 4)(x + 2)` is 0 at 4 and −2. Both stay out of the domain, even though `x - 4` cancels." },
          { t:"`{x ∈ ℝ | x ≠ -4, x ≠ 2}`", why:"`x^2 - 2x - 8 = (x - 4)(x + 2)` is 0 at <strong>4</strong> and <strong>−2</strong>." },
          { t:"`{x ∈ ℝ | x ≠ -2}`", why:"After cancelling, `1/(x + 2)` looks fine at `x = 4`, but `g(4) = 0`, so `f/g` is undefined there: it has a hole." },
          { t:"`{x ∈ ℝ | x ≠ 4}`", why:"`x = 4` is excluded, but because `g(4) = 0`, not because `f(4) = 0`. `g` is also 0 at `x = -2`." }] },
        b:{ prompt:"`f(x) = x + 3` and `g(x) = x^2 - x - 12`. What is the domain of `f/g`?", options:[
          { t:"`{x ∈ ℝ | x ≠ -3, x ≠ 4}`", ok:true, why:"`g(x) = (x - 4)(x + 3)` is 0 at 4 and −3. Both stay out of the domain, even though `x + 3` cancels." },
          { t:"`{x ∈ ℝ | x ≠ -4, x ≠ 3}`", why:"`x^2 - x - 12 = (x - 4)(x + 3)` is 0 at <strong>4</strong> and <strong>−3</strong>." },
          { t:"`{x ∈ ℝ | x ≠ -3}`", why:"`x = -3` is excluded, but because `g(-3) = 0`. `g` is also 0 at `x = 4`." },
          { t:"`{x ∈ ℝ | x ≠ 4}`", why:"After cancelling, `1/(x - 4)` looks fine at `x = -3`, but `g(-3) = 0`, so `f/g` is undefined there." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"`f` is an odd function and `g` is an even function, both defined for every real `x`. Which describes `f · g`?", options:[
          { t:"Odd", ok:true, why:"`(f · g)(-x) = f(-x)g(-x) = (-f(x))(g(x)) = -(f · g)(x)`. Example: `x · x^2 = x^3`." },
          { t:"Even", why:"The odd factor’s sign flip survives: `(f · g)(-x) = (-f(x))(g(x)) = -(f · g)(x)`." },
          { t:"Neither", why:"An odd function plus an even one is usually neither, but a product passes the single sign flip straight through." },
          { t:"It depends on which functions they are", why:"The argument above uses only `f(-x) = -f(x)` and `g(-x) = g(x)`, so it works for every such pair." }] },
        b:{ prompt:"`f` and `g` are both odd functions, and `g(x) ≠ 0` except at `x = 0`. Which describes `f/g` on its domain?", options:[
          { t:"Even", ok:true, why:"`(f/g)(-x) = (-f(x))/(-g(x)) = (f/g)(x)`. Example: `(sin x)/x`." },
          { t:"Odd", why:"The two sign flips cancel. Example: `x/x^3 = 1/x^2` for `x ≠ 0`, which is even." },
          { t:"Neither", why:"Both functions have a symmetry, so the quotient does too." },
          { t:"It depends on which functions they are", why:"The argument uses only `f(-x) = -f(x)` and `g(-x) = -g(x)`, so it works for every such pair." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`f(x) = x^2 - 9` and `g(x) = x - 1`. For which `x` is `(f · g)(x) < 0`?", options:[
          { t:"`(-∞, -3) ∪ (1, 3)`", ok:true, why:"`f · g = (x - 3)(x + 3)(x - 1)`, with zeros −3, 1 and 3. Testing `x = -4`, 0, 2 and 4 gives −, +, −, +." },
          { t:"`(-3, 1) ∪ (3, ∞)`", why:"At `x = 0` the product is (−9)(−1) = 9 > 0. These are the positive intervals." },
          { t:"`(-3, 3)`", why:"That’s where `f < 0`. On (−3, 1), `g` is negative too, so the product is positive there." },
          { t:"`(-∞, 1)`", why:"That’s where `g < 0`. On (−3, 1), `f` is negative too, so the product is positive there." }] },
        b:{ prompt:"`f(x) = x^2 - 4` and `g(x) = x + 1`. For which `x` is `(f · g)(x) < 0`?", options:[
          { t:"`(-∞, -2) ∪ (-1, 2)`", ok:true, why:"`f · g = (x - 2)(x + 2)(x + 1)`, with zeros −2, −1 and 2. Testing `x = -3`, −1.5, 0 and 3 gives −, +, −, +." },
          { t:"`(-2, -1) ∪ (2, ∞)`", why:"At `x = 3` the product is (5)(4) = 20 > 0. These are the positive intervals." },
          { t:"`(-2, 2)`", why:"That’s where `f < 0`. On (−2, −1), `g` is negative too, so the product is positive there." },
          { t:"`(-∞, -1)`", why:"That’s where `g < 0`. On (−2, −1), `f` is negative too, so the product is positive there." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`f(x) = x^2 - 1` and `g(x) = x^2 + x - 2`. Which describes the graph of `f/g`?", options:[
          { t:"A hole at (1, 2/3) and a vertical asymptote `x = -2`", ok:true, why:"`f/g = ((x - 1)(x + 1))/((x - 1)(x + 2)) = (x + 1)/(x + 2)` for `x ≠ 1`. At `x = 1` that’s 2/3. `f(-2) = 3 ≠ 0`, so `x = -2` is an asymptote." },
          { t:"Vertical asymptotes `x = -2` and `x = 1`", why:"`f(1) = 0` too, and the common factor `x - 1` cancels. There’s a hole at `x = 1`, not an asymptote." },
          { t:"A hole at (1, 0) and a vertical asymptote `x = -2`", why:"At `x = 1` the original is 0/0. The hole’s height comes from the simplified form: `(1 + 1)/(1 + 2) = 2/3`." },
          { t:"A hole at (1, 2/3) and a vertical asymptote `x = 2`", why:"`x + 2 = 0` at `x = -2`." }] },
        b:{ prompt:"`f(x) = x^2 - 4` and `g(x) = x^2 - x - 2`. Which describes the graph of `f/g`?", options:[
          { t:"A hole at (2, 4/3) and a vertical asymptote `x = -1`", ok:true, why:"`f/g = ((x - 2)(x + 2))/((x - 2)(x + 1)) = (x + 2)/(x + 1)` for `x ≠ 2`. At `x = 2` that’s 4/3. `f(-1) = -3 ≠ 0`, so `x = -1` is an asymptote." },
          { t:"Vertical asymptotes `x = -1` and `x = 2`", why:"`f(2) = 0` too, and the common factor `x - 2` cancels. There’s a hole at `x = 2`." },
          { t:"A hole at (2, 0) and a vertical asymptote `x = -1`", why:"At `x = 2` the original is 0/0. The height comes from the simplified form: `(2 + 2)/(2 + 1) = 4/3`." },
          { t:"A hole at (2, 4/3) and a vertical asymptote `x = 1`", why:"`x + 1 = 0` at `x = -1`." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"`f(x) = x` and `g(x) = x - 2` are both increasing on ℝ. Which gives the <strong>whole</strong> interval on which `f · g` is decreasing?", options:[
          { t:"`(-∞, 1)`", ok:true, why:"`f · g = x^2 - 2x = (x - 1)^2 - 1`. It decreases until the vertex at `x = 1`, then increases." },
          { t:"Nowhere: an increasing function times an increasing function is increasing", why:"`f · g = x^2 - 2x`, a parabola opening up, which falls until its vertex at `x = 1`. When the factors are negative, making them bigger can make the product smaller." },
          { t:"`(-∞, 0)`", why:"It does fall on `(-∞, 0)`, but that isn’t the whole interval: it keeps falling on (0, 1), from 0 at `x = 0` down to −1 at `x = 1`." },
          { t:"`(0, 2)`", why:"That’s where `f · g < 0`. On (1, 2) it’s negative but rising, from −1 back up to 0." }] },
        b:{ prompt:"`f(x) = x + 4` and `g(x) = x` are both increasing on ℝ. Which gives the <strong>whole</strong> interval on which `f · g` is decreasing?", options:[
          { t:"`(-∞, -2)`", ok:true, why:"`f · g = x^2 + 4x = (x + 2)^2 - 4`. It decreases until the vertex at `x = -2`, then increases." },
          { t:"Nowhere: an increasing function times an increasing function is increasing", why:"`f · g = x^2 + 4x`, a parabola opening up, which falls until its vertex at `x = -2`." },
          { t:"`(-∞, -4)`", why:"It does fall on `(-∞, -4)`, but that isn’t the whole interval: it keeps falling on (−4, −2), from 0 at `x = -4` down to −4 at `x = -2`." },
          { t:"`(-4, 0)`", why:"That’s where `f · g < 0`. On (−2, 0) it’s negative but rising." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why the graph of `y = x^2 cos x` stays between the graphs of `y = x^2` and `y = -x^2`?", options:[
          { t:"“`-1 ≤ cos x ≤ 1` and `x^2` is never negative, so `x^2 cos x` is a number between `-x^2` and `x^2`.”", ok:true, why:"This uses both facts it needs: the size of the multiplier and the sign of `x^2`." },
          { t:"“Adding `cos x` moves `x^2` up or down by at most 1.”", why:"That describes `y = x^2 + cos x`. Here `cos x` <strong>multiplies</strong> `x^2`." },
          { t:"“`x^2` is always bigger than `cos x`.”", why:"That isn’t even true near 0 (at `x = 0`, `x^2 = 0` but `cos 0 = 1`), and comparing the factors says nothing about their product." },
          { t:"“`y = x^2 cos x` has the same zeros as `y = x^2`.”", why:"It has more zeros, wherever `cos x = 0`. And sharing zeros wouldn’t keep a graph between two curves anyway." }] },
        b:{ prompt:"Which is the best explanation of why the graph of `y = 2^{-x} sin x` stays between the graphs of `y = 2^{-x}` and `y = -2^{-x}`?", options:[
          { t:"“`-1 ≤ sin x ≤ 1` and `2^{-x}` is always positive, so `2^{-x} sin x` is a number between `-2^{-x}` and `2^{-x}`.”", ok:true, why:"This uses both facts it needs: the size of the multiplier and the sign of `2^{-x}`." },
          { t:"“Adding `sin x` moves `2^{-x}` up or down by at most 1.”", why:"That describes `y = 2^{-x} + sin x`. Here `sin x` <strong>multiplies</strong> `2^{-x}`." },
          { t:"“`2^{-x}` is always bigger than `sin x`.”", why:"Not true: at `x = 2`, `2^{-x} = 1/4`, but `sin 2` is about 0.91. And comparing the factors says nothing about their product." },
          { t:"“`2^{-x}` is never 0.”", why:"True, but `5 · 2^{-x}` is never 0 either, and it isn’t between the two curves." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"`f(x) = x^2 - 4` and `g(x) = x - 2`. Which statement is written correctly and true?", options:[
          { t:"“`(f/g)(x) = x + 2`, with domain `{x ∈ ℝ | x ≠ 2}`.”", ok:true, why:"The simplified formula plus the restriction from `g`: the graph is the line `y = x + 2` with a hole at (2, 4)." },
          { t:"“`(f/g)(x) = x + 2`, with domain `{x ∈ ℝ}`.”", why:"`g(2) = 0`, so `x = 2` stays out of the domain of `f/g`." },
          { t:"“`(f/g)(2) = 4`.”", why:"`g(2) = 0`, so `(f/g)(2)` doesn’t exist. 4 is the height of the hole at (2, 4)." },
          { t:"“`(f/g)(x) = f(g(x)) = (x - 2)^2 - 4`.”", why:"`f/g` divides the outputs. `f(g(x))` is a composition." }] },
        b:{ prompt:"`f(x) = x^2 - 9` and `g(x) = x + 3`. Which statement is written correctly and true?", options:[
          { t:"“`(f/g)(x) = x - 3`, with domain `{x ∈ ℝ | x ≠ -3}`.”", ok:true, why:"The simplified formula plus the restriction from `g`: the line `y = x - 3` with a hole at (−3, −6)." },
          { t:"“`(f/g)(x) = x - 3`, with domain `{x ∈ ℝ}`.”", why:"`g(-3) = 0`, so `x = -3` stays out of the domain." },
          { t:"“`(f/g)(-3) = -6`.”", why:"`g(-3) = 0`, so `(f/g)(-3)` doesn’t exist. −6 is the height of the hole." },
          { t:"“`(f/g)(x) = f(g(x)) = (x + 3)^2 - 9`.”", why:"`f/g` divides the outputs. `f(g(x))` is a composition." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A mass on a spring is `y(t) = 24(1/2)^t cos(πt)` cm above its rest position, `t` seconds after it is released. Where is it at `t` = 3 s?", options:[
          { t:"3 cm below rest", ok:true, why:"The fence is `24(1/2)^3 = 3` cm and `cos 3π = -1`, so `y(3) = 3 × (-1) = -3`: 3 cm below rest, touching the lower fence." },
          { t:"2 cm above rest", why:"3 + (−1) = 2 adds them. The model multiplies: 3 × (−1)." },
          { t:"3 cm above rest", why:"`cos 3π = -1`, so the mass is below rest." },
          { t:"24 cm below rest", why:"24 × (−1) leaves out the `(1/2)^3`. By `t = 3` the swings have shrunk to 3 cm." }] },
        b:{ prompt:"A mass on a spring is `y(t) = 18(1/3)^t cos(πt)` cm above its rest position, `t` seconds after it is released. Where is it at `t` = 2 s?", options:[
          { t:"2 cm above rest", ok:true, why:"The fence is `18(1/3)^2 = 2` cm and `cos 2π = 1`, so `y(2) = 2 × 1 = 2`: 2 cm above rest, touching the upper fence." },
          { t:"2 cm below rest", why:"`cos 2π = 1`: two seconds is one full cycle of `cos(πt)`." },
          { t:"3 cm above rest", why:"2 + 1 = 3 adds them. The model multiplies: 2 × 1." },
          { t:"18 cm above rest", why:"18 × 1 leaves out the `(1/3)^2`. By `t = 2` the swings have shrunk to 2 cm." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A town’s population is `P(t) = 12 000 + 600t`, and its built-up area is `S(t) = 20 + 2t` square kilometres, `t` years from now. Its population density is `D(t) = P(t)/S(t)` people per square kilometre. What happens to the density in the long run?", options:[
          { t:"It approaches 300 people per square kilometre", ok:true, why:"Both are linear, so in the long run the leading terms decide: `600t/(2t) = 300`. The density falls from 600 toward 300." },
          { t:"It grows without bound, because the population keeps growing", why:"The area grows too. For large `t`, `D(t)` is about `600t/(2t) = 300`." },
          { t:"It stays at 600 people per square kilometre", why:"`600 = 12 000/20` is `D(0)`, today’s density. The long run comes from the leading terms." },
          { t:"It approaches 0, because the area keeps growing", why:"`D → 0` would need the area to grow faster than linearly, outpacing the population. Here both grow at steady rates." }] },
        b:{ prompt:"A town’s population is `P(t) = 8000 + 300t`, and its built-up area is `S(t) = 40 + 3t` square kilometres, `t` years from now. Its population density is `D(t) = P(t)/S(t)` people per square kilometre. What happens to the density in the long run?", options:[
          { t:"It approaches 100 people per square kilometre", ok:true, why:"Both are linear, so in the long run the leading terms decide: `300t/(3t) = 100`. The density falls from 200 toward 100." },
          { t:"It grows without bound, because the population keeps growing", why:"The area grows too. For large `t`, `D(t)` is about `300t/(3t) = 100`." },
          { t:"It stays at 200 people per square kilometre", why:"`200 = 8000/40` is `D(0)`, today’s density." },
          { t:"It approaches 0, because the area keeps growing", why:"Both grow at steady rates, so their ratio settles at 300/3." }] } }
    ]
  },
  task:{
    title:"Design a combination", summary:"Design a combination",
    statement:"<p>Use two function cards and a whole number `k` to build `h(x) = k · f(x) · g(x)` or `h(x) = k · f(x)/g(x)`, so that all four checks pass. There are 12 working functions. Can you find three that use different pairs of cards?</p><p class=\"tiny muted\">Choose `k` (−3 to 3, not 0), a first card `f`, a second card `g` (a card may be chosen twice), and × or ÷. The graph shows your `h` on `-3 ≤ x ≤ 3`.</p>",
    checks:["`h` is odd", "`h(-2) = 0` and `h(2) = 0`", "`h(x) > 0` for every `x` between 0 and 1", "`h` is defined for every real `x`"],
    tips:["An odd function times (or divided by) an even one is odd. Two odd ones make an even function.", "For `h(±2) = 0`, one card must be 0 at both 2 and −2, and you can’t divide by that card.", "Change the sign of `k` or swap a card.", "Divide only by a card that is never 0, or multiply instead."],
    explainPrompt:"Explain why your design passes each check.",
    vocab:"Use the words odd, even, zero, sign and domain.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"You found three. Every working design pairs an odd card with an even card, uses `x^2 - 4` or `sin(πx)` to make the zeros at ±2, never divides by a card that can be 0, and gets the sign of `k` from the signs on `0 < x < 1`."
  },
  cards:[
    ["`(f · g)(x)`", "`f(x) · g(x)`: multiply the two outputs at the same `x`. With `f(x) = x^2 - 1` and `g(x) = 2x + 3`, `(f · g)(2) = 3 × 7 = 21`. It is not `f(g(x))`."],
    ["`(f/g)(x)`", "`f(x)/g(x)`, only where `g(x) ≠ 0`. With `f(x) = x - 2` and `g(x) = x^2 - 4`, `(f/g)(1.5) = (-0.5)/(-1.75) = 2/7`."],
    ["Domain of `f · g` and of `f/g`", "`f · g`: every `x` where both `f` and `g` are defined. `f/g`: the same, minus every `x` where `g(x) = 0`. Decide it before cancelling."],
    ["Zeros of `f · g` and of `f/g`", "`f · g = 0` where `f = 0` or `g = 0`. `f/g = 0` where `f = 0` and `g ≠ 0`."],
    ["Sign of a product or quotient", "Count the negative factors: an even number gives +, an odd number gives −. Division follows the same rule as multiplication."],
    ["Where `g(x) = 0` in `f/g`", "If `f ≠ 0` there: a vertical asymptote. If `f = 0` too and a common factor cancels: a hole. `(x - 2)/(x^2 - 4)` has an asymptote at `x = -2` and a hole at (2, 1/4)."],
    ["Both factors 0 at the same `x`", "When each factor has a simple zero there, both change sign and the changes cancel: a product touches the axis, and a quotient has a hole with the same sign on both sides. Example: `(x - 2) sin(πx)` touches the axis at `x = 2`."],
    ["The fence (envelope)", "If `-1 ≤ g(x) ≤ 1`, then `f · g` stays between `y = f(x)` and `y = -f(x)`. It touches `y = f(x)` where `g = 1` and `y = -f(x)` where `g = -1`."],
    ["Damped motion", "`y = a · b^t · cos(πt)` with `0 < b < 1`: the fence `a · b^t` shrinks each second. For `16(1/2)^t` the swings reach 16, 8, 4, 2, 1 at `t = 0`, 1, 2, 3, 4."],
    ["Symmetry of `f · g` and `f/g`", "even · even = even; odd · odd = even; odd · even = odd. The same for ÷. Example: `x sin x` is even."],
    ["Increasing × increasing", "Not always increasing. `x` and `x - 2` both increase, but `x(x - 2)` decreases on `(-∞, 1)`."],
    ["Adding a wave vs multiplying by one", "`f(x) + cos x` wobbles around `y = f(x)` (module 46). `f(x) · cos x` is squeezed between `y = f(x)` and `y = -f(x)`."]
  ]
};
