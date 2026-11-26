// MHF4U 05 Graphing from Factored Form. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/05-graphing-from-factored-form.md
const fig = (key, aria) => '<canvas class="plot" data-fig="' + key + '" role="img" aria-label="' + aria + '"></canvas>';

// Practice 1 (matching): the eight equations and the graphs drawn from them (app.figures m1…m8).
const PAIRS = [
  ["`y = (x + 2)(x - 1)(x - 3)`", "Q3 to Q1; crosses at −2, 1, 3; `y`-intercept 6", "Graph: rises from the lower left to the upper right, crossing the x-axis at −2, 1 and 3; y-intercept 6"],
  ["`y = -(x + 2)(x - 1)(x - 3)`", "Q2 to Q4; crosses at −2, 1, 3; `y`-intercept −6", "Graph: falls from the upper left to the lower right, crossing the x-axis at −2, 1 and 3; y-intercept −6"],
  ["`y = (x + 2)^2(x - 1)`", "Q3 to Q1; touches at −2, crosses at 1; `y`-intercept −4", "Graph: rises from the lower left, touches the x-axis at −2, crosses at 1, ends upper right; y-intercept −4"],
  ["`y = (x + 2)(x - 1)^2`", "Q3 to Q1; crosses at −2, touches at 1; `y`-intercept 2", "Graph: rises from the lower left, crosses the x-axis at −2, touches at 1, ends upper right; y-intercept 2"],
  ["`y = (x - 1)^3`", "Q3 to Q1; crosses and flattens at 1; `y`-intercept −1", "Graph: rises from the lower left to the upper right, flattening as it crosses the x-axis at 1; y-intercept −1"],
  ["`y = -(x + 2)^2(x - 1)^2`", "Both arms down; touches at −2 and 1; `y`-intercept −4", "Graph: both arms down, touching the x-axis at −2 and at 1; y-intercept −4"],
  ["`y = x(x + 2)(x - 1)(x - 3)`", "Both arms up; crosses at −2, 0, 1, 3; `y`-intercept 0", "Graph: both arms up, crossing the x-axis at −2, 0, 1 and 3; y-intercept 0"],
  ["`y = (x + 2)(x - 1)^3`", "Both arms up; crosses at −2; crosses and flattens at 1; `y`-intercept −2", "Graph: both arms up, crossing the x-axis at −2 and flattening as it crosses at 1; y-intercept −2"]
];
const PAIR_HINTS = [
  ["Which zeros are there, and does the graph cross or touch at each?", "All three brackets are to the first power: it crosses at −2, 1 and 3. Degree 3, `a = 1`: Q3 to Q1.", "`y`-intercept `(2)(-1)(-3) = 6`. That’s the graph that crosses three times, rises to the right and passes through (0, 6)."],
  ["Compare with the first equation. What does the minus sign in front do?", "It flips the graph: it still crosses at −2, 1 and 3, but now goes from Q2 to Q4.", "`y`-intercept `-(2)(-1)(-3) = -6`. That’s the graph that falls to the right and passes through (0, −6)."],
  ["Which zero is squared?", "`(x + 2)^2`: the graph touches at −2. `(x - 1)` to the first power: it crosses at 1.", "Degree 3, `a = 1`: Q3 to Q1; `y`-intercept `(4)(-1) = -4`. That’s the graph that touches at −2 and passes through (0, −4)."],
  ["Which zero is squared?", "`(x - 1)^2`: the graph touches at 1. `(x + 2)` to the first power: it crosses at −2.", "Degree 3, `a = 1`: Q3 to Q1; `y`-intercept `(2)(1) = 2`. That’s the graph that touches at 1 and passes through (0, 2)."],
  ["What is the order of the zero at 1?", "Order 3: the graph crosses at 1 and flattens as it crosses. Degree 3, `a = 1`: Q3 to Q1.", "`y`-intercept `(-1)^3 = -1`. That’s the graph with one zero, flattening through 1 and passing through (0, −1)."],
  ["Add the orders for the degree, and look at the sign in front.", "2 + 2 = 4 and the leading coefficient is −1: both arms down. Both zeros are squared, so it touches at −2 and at 1.", "`y`-intercept `-(4)(1) = -4`. That’s the graph with both arms down that touches the axis twice."],
  ["How many brackets are there, and what are their orders?", "Four zeros, all of order 1: it crosses at −2, 0, 1 and 3. Degree 4, `a = 1`: both arms up.", "`x = 0` is a zero, so the `y`-intercept is 0. That’s the graph that crosses four times."],
  ["Add the orders for the degree. What does that say about the arms?", "1 + 3 = 4, `a = 1`: both arms up. At 1 the order is 3.", "Crosses at −2, flattens through 1, `y`-intercept `(2)(-1) = -2`."]
];
// Graph ids (and figure keys g…) are letters in a scrambled order, so the page doesn't give the pairs away.
const RID = ["E", "B", "H", "A", "F", "C", "G", "D"];
const rid = n => "r" + RID[n - 1];
const MIRROR = "These two are mirror images. Check the leading coefficient’s sign: the end behaviour shows it.";
const SAMEZ = "Same zeros, different orders. Which zero is squared? That’s where the graph touches.";
const ORD3 = "An order 3 zero crosses (flattening); it doesn’t touch.";
const BOTH4 = "Both have `y`-intercept −4. Check the end behaviour: one has both arms down.";
const matchWrong = {};
[[1, 2, MIRROR], [2, 1, MIRROR], [3, 4, SAMEZ], [4, 3, SAMEZ], [6, 3, BOTH4], [3, 6, BOTH4]].forEach(w => { matchWrong["l" + w[0] + "|" + rid(w[1])] = w[2]; });
[5, 8].forEach(l => [3, 4, 6].forEach(r => { matchWrong["l" + l + "|" + rid(r)] = ORD3; }));
const matchRight = RID.slice().sort().map(L => { const i = RID.indexOf(L); return { id:"r" + L, t:fig("g" + L, PAIRS[i][2]) }; });
const matchAnswer = {}; PAIRS.forEach((p, i) => { matchAnswer["l" + (i + 1)] = rid(i + 1); });

const M2 = "An even power never changes sign, so at an even-order zero the graph touches and turns back. An odd power changes sign, so the graph crosses.";
const M6 = "Substitute a point that is <strong>not</strong> a zero; then `a` = (its `y`-value) ÷ (the product of the brackets there).";

export default {
  id:"05-graphing-from-factored-form",
  kind:"topic",
  title:"Graphing from factored form",
  topic:"Graphing from Factored Form",
  readyTopic:"graphing from factored form",
  hero:{
    eq:'<span class="m"><i>y</i> = <span class="p-a"><i>a</i></span><span class="nw">(<i>x</i> − <i>r</i><sub>1</sub>)</span><span class="nw">(<i>x</i> − <i>r</i><sub>2</sub>)<sup class="ord">2</sup></span><span class="nw">(<i>x</i> − <i>r</i><sub>3</sub>)<sup class="ord">3</sup></span></span>',
    eqLabel:"y equals a, times x minus r 1, times x minus r 2 squared, times x minus r 3 cubed", eqSize:"md",
    headline:"The factors draw the graph",
    text:"In <strong>factored form</strong>, every bracket is a <strong>zero</strong>: `(x - r)` is zero at `x = r`. The bracket’s power is the zero’s <strong>order</strong>, and the order tells you how the graph meets the axis there. Add the orders for the degree, use `@a{a}` for the end behaviour, put in `x = 0` for the `y`-intercept, and you can sketch the whole graph without expanding anything.",
    fig:{ shape:"wide", caption:"`y = (x + 2)(x - 1)^2(x - 3)^3`",
      aria:"An x-axis from −4 to 4 with zeros at −2, 1 and 3, of orders 1, 2 and 3. A round lens above each zero shows the shape there: a straight crossing at −2, a touch-and-turn at 1, and a crossing that flattens at 3." },
    lensCaps:["order 1: crosses", "order 2: touches", "order 3: crosses and flattens"]
  },
  goals:[
    "I can find the zeros of a polynomial in factored form, and the order of each zero.",
    "I can describe how a graph behaves at a zero of order 1, 2 or 3.",
    "I can find the degree, leading coefficient, end behaviour and `y`-intercept from factored form without expanding.",
    "I can sketch a polynomial from its factored form and state where it is positive and negative.",
    "I can find the equation of a polynomial from its graph, using one extra point to find `a`.",
    "I can decide whether given conditions fix exactly one polynomial, and what extra information would."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Zeros of factors", goal:1,
          prompt:"What value of `x` makes `2x + 5` equal to 0?",
          options:[
            { t:"`-5/2`", ok:true, why:"`2x + 5 = 0` gives `2x = -5`, so `x = -5/2`." },
            { t:"`5/2`", why:"Check: `2(5/2) + 5 = 10`, not 0." },
            { t:"`-5`", why:"`2(-5) + 5 = -5`, not 0." },
            { t:"`-2/5`", why:"`2(-2/5) + 5 = 21/5`, not 0. It’s −5 ÷ 2." }],
          hints:["Set `2x + 5 = 0` and solve.", "Subtract 5, then divide by 2.", "`x = -5/2`."] },
        { id:"w2", skill:"Zeros of factors", goal:1,
          prompt:"Which `x`-values make `(x - 4)(x + 1)` equal to 0?",
          options:[
            { t:"4 and −1", ok:true, why:"A product is 0 when a factor is 0: `x - 4 = 0` or `x + 1 = 0`." },
            { t:"−4 and 1", why:"At `x = -4`, `(-8)(-3) = 24`, not 0." },
            { t:"4 only", why:"`x = -1` makes the second bracket 0, so the product is 0 too." },
            { t:"4 and 1", why:"`x + 1 = 0` at `x = -1`." }],
          hints:["When is a product equal to 0?", "Set each bracket to 0.", "`x = 4` or `x = -1`."] },
        { id:"w3", skill:"Leading term and end behaviour", goal:3,
          prompt:"What is the end behaviour of `y = -x^4 + 3x`?",
          options:[
            { t:"Q3 to Q4", ok:true, why:"Even degree with a negative leading coefficient: both arms down." },
            { t:"Q2 to Q1", why:"`-x^4` is negative for large `|x|`, so both arms point down." },
            { t:"Q2 to Q4", why:"Degree 4 is even, so the arms point the same way." },
            { t:"Q3 to Q1", why:"Far out, `-x^4` outgrows `3x`." }],
          hints:["Find the leading term.", "`-x^4`: even degree, negative coefficient.", "Both arms down: Q3 to Q4."] },
        { id:"w4", skill:"Leading term and end behaviour", goal:3,
          prompt:"What is the leading term of `(x - 1)^2(2x + 3)`?",
          options:[
            { t:"`2x^3`", ok:true, why:"`x^2` from `(x - 1)^2`, times `2x` from `(2x + 3)`." },
            { t:"`x^3`", why:"`(2x + 3)` contributes `2x`, not `x`." },
            { t:"`2x^2`", why:"The square makes `(x - 1)^2` degree 2; with the degree-1 factor, that’s 2 + 1 = 3." },
            { t:"`-2x^3`", why:"The −1 in `(x - 1)` doesn’t affect the leading term: `(x - 1)^2` starts with `x^2`." }],
          hints:["Take the highest-power term from each factor.", "`(x - 1)^2` starts with `x^2`; `(2x + 3)` starts with `2x`.", "`x^2 × 2x = 2x^3`."] },
        { id:"w5", skill:"Intervals", goal:4,
          prompt:"`y = (x - 1)(x - 5)` is a parabola that opens up. Where is it negative?",
          options:[
            { t:"`(1, 5)`", ok:true, why:"Opening up, it’s below the axis between its zeros." },
            { t:"`(-∞, 1) ∪ (5, ∞)`", why:"Outside the zeros an upward parabola is above the axis." },
            { t:"`[1, 5]`", why:"At 1 and 5 the value is 0, which isn’t negative." },
            { t:"`(-∞, 3)`", why:"Decreasing isn’t the same as negative." }],
          hints:["Where is an upward parabola below the axis?", "Between its zeros, 1 and 5.", "`(1, 5)`, with round brackets because the zeros give 0."] },
        { id:"w6", skill:"Solving for <i>a</i>", goal:5,
          prompt:"`y = a(x - 2)(x + 1)` passes through (0, 4). What is `a`?",
          options:[
            { t:"−2", ok:true, why:"At `x = 0`: `a(-2)(1) = -2a = 4`, so `a = -2`." },
            { t:"2", why:"`(0 - 2) = -2`, so `-2a = 4`." },
            { t:"4", why:"4 is `y` at `x = 0`. It equals `a` times the brackets." },
            { t:"`-1/2`", why:"`-2a = 4` gives `a = 4 ÷ (-2) = -2`." }],
          hints:["Substitute `x = 0` and `y = 4`.", "`4 = a(0 - 2)(0 + 1) = -2a`.", "`a = 4 ÷ (-2) = -2`."] }
      ],
      refreshers:{
        "Zeros of factors":"A product is 0 exactly when one of its factors is 0. Set each bracket to 0 and solve: `x + 1 = 0` gives `x = -1`; `2x + 5 = 0` gives `x = -5/2`.",
        "Leading term and end behaviour":"Multiply the highest-power term of each factor: `(x - 1)^2(2x + 3)` starts with `x^2 · 2x = 2x^3`. Then use module 03: even degree, same direction; odd degree, opposite; `a > 0` sends the right arm up.",
        "Intervals":"Positive means above the `x`-axis; negative means below. Zeros are left out, so the brackets at zeros are round: an upward parabola with zeros 1 and 5 is negative on `(1, 5)`.",
        "Solving for <i>a</i>":"Substitute a point that is on the graph but isn’t a zero, then solve: (0, 4) on `y = a(x - 2)(x + 1)` gives `4 = -2a`, so `a = -2`."
      }
    }
  },
  explore:{
    heading:"Zero builder",
    intro:"Drop zeros on the axis, give each one an order, and set `@a{a}`. The graph and the equation update together. Use the lens to zoom in on any zero.",
    predictions:[
      { id:"p1", start:{ z:[[-2, 1], [1, 1], [3, 1]], a:1 }, end:{ z:[[-2, 1], [1, 2], [3, 1]], a:1 },
        prompt:"The zero at 1 will change from order 1 to order 2. What will the graph do at `x = 1`?",
        options:[{ t:"Touch the axis and turn back", ok:true }, { t:"Cross the axis more steeply" }, { t:"Cross the axis and flatten" }, { t:"Stop being a zero" }],
        explain:"`(x - 1)^2` is never negative, so the sign of `y` is the same on both sides of 1: the graph comes down to the axis and turns back. The degree also went up by 1, so now both arms point up." },
      { id:"p2", start:{ z:[[2, 1]], a:1, mode:"lens", lens:2 }, end:{ z:[[2, 3]], a:1 },
        prompt:"The order at 2 will change to 3, making `y = (x - 2)^3`. In the lens, what will the graph look like at `x = 2`?",
        options:[{ t:"It crosses, flattening out for an instant", ok:true }, { t:"It touches and turns back" }, { t:"It crosses in a straight line" }, { t:"It turns around: a local maximum at 2" }],
        explain:"`(x - 2)^3` is negative left of 2 and positive right of it, so the graph crosses. But near 2 it’s very small (`0.1^3 = 0.001`), so it flattens as it crosses. It never turns around: an order 3 zero is not a turning point." },
      { id:"p3", start:{ z:[[-1, 1], [2, 2], [3, 1]], a:1, hideY:true },
        prompt:"What is the `y`-intercept?",
        options:[{ t:"−12", ok:true }, { t:"−6" }, { t:"6" }, { t:"12" }],
        explain:"Substitute `x = 0` into every bracket, keeping the powers: `(0 + 1)(0 - 2)^2(0 - 3) = (1)(4)(-3) = -12`. Forgetting the square gives `(1)(-2)(-3) = 6`; dropping a sign gives 12; −6 multiplies the zeros −1, 2, 3 instead of the brackets." },
      { id:"p4", start:{ z:[[-1, 2], [2, 1]], a:1 }, end:{ a:-0.5 },
        prompt:"`@a{a}` will change from 1 to −½. What changes?",
        options:[{ t:"The graph flips over the `x`-axis and becomes half as tall; the zeros and their orders stay the same", ok:true }, { t:"The zeros move" }, { t:"Only the end behaviour changes" }, { t:"The graph shifts down by ½" }],
        explain:"`a` multiplies every `y`-value. A zero stays a zero (`-½ × 0 = 0`), so the zeros and their orders can’t change. Every other point is multiplied by −½: flipped and halved." }
    ],
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build a cubic with `@a{a} > 0` that crosses the axis at −3 and touches it at 2.",
        why:"`y = a(x + 3)(x - 2)^2` with any positive `a`: order 1 at −3 (crosses), order 2 at 2 (touches), degree 1 + 2 = 3.",
        named:{ signs:"Check the signs: the graph should cross at `x = -3` and touch at `x = 2`.", swapped:"At −3 your graph touches and at 2 it crosses. Swap the orders.",
          order3:"That flattens as it crosses and makes the degree 5. A plain crossing is order 1.", aneg:"The challenge asks for `a > 0`." },
        general:"Check the challenge: a crossing at −3 (odd order), a touch at 2 (even order), degree 3 in all, and `a > 0`.",
        hints:["Crossing means an odd order; touching means an even order.", "Put a zero of order 1 at −3 and a zero of order 2 at 2.", "`y = a(x + 3)(x - 2)^2` with any positive `a`."] },
      { id:"tc2", goal:[1, 5], prompt:"Match the dashed target graph: it crosses at −4, crosses and flattens at 0, touches at 3, and passes through the marked point (1, −10). <span class=\"tiny muted\">(Turn on <strong>Show the TC2 target</strong> under the graph to see it.)</span>",
        why:"`y = -0.5(x + 4)x^3(x - 3)^2`: at `x = 1` the brackets give (5)(1)(4) = 20, and `20a = -10` gives `a = -0.5`.",
        named:{ wrongA:"Your graph is the right shape but passes through (1, {v}). At `x = 1` the brackets give (5)(1)(4) = 20, so `20a = -10`.",
          at0:"At 0 the target flattens as it crosses: that’s order 3.", at3:"At 3 the target touches without crossing: an even order." },
        general:"Compare your graph with the dashed target: set the zeros first, then the order at each zero, then `a`.",
        hints:["Set the zeros and orders from the target’s behaviour first. `a` comes last.", "`y = a(x + 4)x^3(x - 3)^2`. Substitute `x = 1`.", "`a(5)(1)(4) = -10`, so `a = -0.5`."] },
      { id:"tc3", goal:[3, 6], stretch:true,
        prompt:"Build the polynomial of <strong>lowest possible degree</strong> that is positive exactly on `(-2, 1) ∪ (1, 4)`, negative exactly on `(-∞, -2) ∪ (4, ∞)`, and has `y`-intercept 16.",
        why:"It’s the only one: the sign doesn’t change at 1, so that’s an even-order zero, and the lowest choice is order 2; the sign changes at −2 and 4, so order 1; negative at both ends with even degree means `a < 0`; the `y`-intercept gives `a(2)(1)(-4) = 16`, so `a = -2`.",
        named:{ cross1:"With a crossing at 1, the graph would change sign there. But it’s positive on both sides of 1.", degree:"That works for the signs, but the degree isn’t the lowest possible.",
          apos:"With `a > 0` and even degree, both ends would be positive.", wrongA:"Your `y`-intercept is {v}. At `x = 0` the brackets give (2)(1)(−4) = −8, so `-8a = 16`." },
        general:"Check the signs: the graph must change sign at −2 and at 4, stay positive on both sides of 1, and have `y`-intercept 16.",
        hints:["Where does the sign change? Where does it stay the same?", "Sign changes at −2 and 4 (odd orders); no change at 1 (even order). Both ends negative: even degree with `a < 0`.", "`y = a(x + 2)(x - 1)^2(x - 4)`. At `x = 0`: `-8a = 16`, so `a = -2`."] }
    ]
  },
  part3:{
    slug:"equation", name:"Equation",
    heading:"Equation from a graph",
    intro:"Read the zeros and how the graph meets the axis there. Then use one more point to find `@a{a}`.",
    steps:["1. Tap the zeros", "2. Set each order", "3. The fan", "4. Pick a point", "5. Enter `@a{a}`"],
    fan:"Same zeros, many graphs. One more point picks the right one.",
    fb:{
      miss:"No zero there. Tap the `x`-axis exactly where the graph meets it.",
      evenAtCross:"The graph changes sides here: odd order.",
      oneAtFlat:"Look closely: it flattens as it crosses. That’s order 3.",
      threeAtCross:"That flattens as it crosses. A plain crossing is order 1.",
      oddAtTouch:M2,
      zeroPick:"That’s a zero: every member of the fan passes through it, so it can’t tell you `a`.",
      aSign:"Your curve is the mirror image. Check the sign of each bracket at the point you chose.",
      aInv:"Divide the `y`-value by the bracket product, not the other way round.",
      aOther:M6
    },
    rounds:[
      { id:"r1", name:"Round 1", kind:"cubic", points:[[0, 4], [3, -2]],
        desc:"Round 1 graph, a cubic: rises from the lower left, crosses the x-axis at −1, 2 and 4, and ends in the upper right. Labelled points (0, 4) and (3, −2).",
        answer:{ z:[[-1, 1], [2, 1], [4, 1]], a:0.5 } },
      { id:"r2", name:"Round 2", kind:"quartic", points:[[0, -27], [2, 25]],
        desc:"Round 2 graph, a quartic with both arms down: touches the x-axis at −3, crosses it at 1 and at 3. Labelled points (0, −27) and (2, 25).",
        answer:{ z:[[-3, 2], [1, 1], [3, 1]], a:-1 } },
      { id:"r3", name:"Round 3", kind:"degree 5", points:[[0, -3], [2, 2]],
        desc:"Round 3 graph, degree 5, from the upper left to the lower right: crosses the x-axis at −2, flattens as it crosses at 1, and crosses at 3. Labelled points (0, −3) and (2, 2).",
        note:"The leading coefficient is −½, and the end behaviour (Q2 to Q4) agrees: degree 5, `a < 0`.",
        answer:{ z:[[-2, 1], [1, 3], [3, 1]], a:-0.5 } }
    ],
    quickCheck:{
      title:"Which equation?", summary:"Which equation?",
      items:[
        { id:"q1", goal:[1, 5], prompt:"A graph crosses at −1 and 3, touches at 0, and both arms point down. Which could it be?",
          choices:[
            { t:"`y = -x^2(x + 1)(x - 3)`", ok:true, fb:"Right. Touching at 0 needs `x^2`; crossing at −1 and 3 needs `(x + 1)` and `(x - 3)`; both arms down needs a negative leading coefficient." },
            { t:"`y = x^2(x + 1)(x - 3)`", fb:"Touching at 0 needs `x^2`; crossing at −1 and 3 needs `(x + 1)` and `(x - 3)`; both arms down needs a negative leading coefficient." },
            { t:"`y = -x(x + 1)^2(x - 3)`", fb:"Touching at 0 needs `x^2`; crossing at −1 and 3 needs `(x + 1)` and `(x - 3)`; both arms down needs a negative leading coefficient." },
            { t:"`y = -x^2(x - 1)(x + 3)`", fb:"Touching at 0 needs `x^2`; crossing at −1 and 3 needs `(x + 1)` and `(x - 3)`; both arms down needs a negative leading coefficient." }] },
        { id:"q2", goal:3, prompt:"What is the `y`-intercept of `y = -2(x - 1)^2(x + 4)`?",
          choices:[
            { t:"−8", ok:true, fb:"Right. At 0: `-2 × (-1)^2 × 4 = -2 × 1 × 4 = -8`." },
            { t:"8", fb:"At 0: `-2 × (-1)^2 × 4 = -2 × 1 × 4 = -8`." },
            { t:"−2", fb:"At 0: `-2 × (-1)^2 × 4 = -2 × 1 × 4 = -8`." },
            { t:"−32", fb:"At 0: `-2 × (-1)^2 × 4 = -2 × 1 × 4 = -8`." }] },
        { id:"q3", goal:2, prompt:"A zero of order 3 at `x = -2`. What does the graph do there?",
          choices:[
            { t:"Crosses and flattens", ok:true, fb:"Right. Odd order: it crosses. Order 3: it flattens as it crosses, without turning." },
            { t:"Touches", fb:"Odd order: it crosses. Order 3: it flattens as it crosses, without turning." },
            { t:"Crosses straight", fb:"Odd order: it crosses. Order 3: it flattens as it crosses, without turning." },
            { t:"Turns around", fb:"Odd order: it crosses. Order 3: it flattens as it crosses, without turning." }] },
        { id:"q4", goal:3, prompt:"What is the leading coefficient of `y = (3 - x)(x + 2)^2`?",
          choices:[
            { t:"−1", ok:true, fb:"Right. `(3 - x)` starts with `-x` and `(x + 2)^2` with `x^2`: `-x · x^2 = -x^3`." },
            { t:"1", fb:"`(3 - x)` starts with `-x` and `(x + 2)^2` with `x^2`: `-x · x^2 = -x^3`." },
            { t:"3", fb:"`(3 - x)` starts with `-x` and `(x + 2)^2` with `x^2`: `-x · x^2 = -x^3`." },
            { t:"−3", fb:"`(3 - x)` starts with `-x` and `(x + 2)^2` with `x^2`: `-x · x^2 = -x^3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Equation ↔ graph", summary:"Equation ↔ graph", goal:[2, 3, 4],
        instruction:"Match each equation to its graph.", how:"Tap an equation, then tap its graph.",
        leftTitle:"Equation", rightTitle:"Graph",
        left:PAIRS.map((p, i) => ({ id:"l" + (i + 1), t:p[0], why:p[1] + ".", hints:PAIR_HINTS[i] })),
        right:matchRight,
        answer:matchAnswer,
        wrong:matchWrong,
        wrongDefault:"Compare the zeros, then the order at each zero, then the ends." },
      { id:"find", type:"custom", title:"Find the equation", summary:"Find the equation", star:true, goal:[5, 6],
        instruction:"Use the conditions to find what’s asked. No graph is given: picture it, or sketch on paper.",
        how:"Type your answer, then press Check. Fractions like −1/3 are fine.",
        items:[
          { id:"f1", goal:5, prompt:"A cubic has zeros −1, 2 and 5 and passes through (0, 20). Find `a`.",
            fields:[{ id:"v", label:"`a` =" }], answer:2, display:"`a = 2`",
            why:"At 0 the brackets give `(1)(-2)(-5) = 10`, so `10a = 20` and `a = 2`.",
            wrong:[{ match:20, fb:"That’s the `y`-intercept, not `a`. At 0 the brackets give `(1)(-2)(-5) = 10`." }, { match:0.5, fb:"Divide 20 by 10, not 10 by 20." }],
            hints:["Write the family first: `y = a(x + 1)(x - 2)(x - 5)`.", "At (0, 20): `a(1)(-2)(-5) = 10a = 20`.", "`a = 20 ÷ 10 = 2`."] },
          { id:"f2", goal:5, prompt:"A quartic touches the axis at −3 and at 3 and passes through (0, −27). Find `a`.",
            fields:[{ id:"v", label:"`a` =" }], answer:-1 / 3, display:"`a = -1/3`",
            why:"The family is `y = a(x + 3)^2(x - 3)^2`. At 0 the brackets give `(3)^2(-3)^2 = 81`, so `81a = -27` and `a = -1/3`.",
            wrong:[{ match:-3, fb:"Divide −27 by 81, not 81 by −27." }, { match:1 / 3, fb:"Check the sign: `(3)^2(-3)^2 = 81` is positive, so `a` has the sign of −27." }],
            hints:["Touching means an even order. Write the family: `y = a(x + 3)^2(x - 3)^2`.", "At (0, −27): `a(3)^2(-3)^2 = 81a = -27`.", "`a = -27 ÷ 81 = -1/3`."] },
          { id:"f3", goal:5, star:true, prompt:"A cubic has a zero of order 2 at 2 and a zero at −4, and passes through (1, 10). Find `a`.",
            fields:[{ id:"v", label:"`a` =" }], answer:2, display:"`a = 2`",
            why:"`y = a(x - 2)^2(x + 4)`. At `x = 1`: `(1 - 2)^2(1 + 4) = 5`, so `5a = 10` and `a = 2`.",
            wrong:[{ match:5 / 8, fb:"That substitutes `x = 0`, where the brackets give 16. The point is at `x = 1`: `(1 - 2)^2(1 + 4) = 5`." }, { match:-2, fb:"`(1 - 2)^2 = (-1)^2 = 1`, not −1." }],
            hints:["Write the family first: `y = a(x - 2)^2(x + 4)`.", "Substitute the point (1, 10), not `x = 0`: `(1 - 2)^2(1 + 4) = (1)(5) = 5`.", "`5a = 10`, so `a = 2`."] },
          { id:"f4", goal:[2, 6], star:true, kind:"select",
            prompt:"A polynomial of degree 5 has zeros only at −1 and 2. It crosses the axis at −1 and touches it at 2. Which orders are possible? Select every pair that works.",
            note:"Each pair is (order at −1, order at 2).",
            options:[
              { t:"(1, 4)", ok:true, why:"" },
              { t:"(3, 2)", ok:true, why:"" },
              { t:"(2, 3)", why:"Crossing needs an odd order at −1; touching needs an even order at 2." },
              { t:"(1, 2)", why:"That adds to 3, not 5." },
              { t:"(4, 1)", why:"Crossing needs an odd order at −1; touching needs an even order at 2." }],
            partial:"There’s another pair: the orders must add to 5, odd at −1 and even at 2.",
            why:"1 + 4 = 5 and 3 + 2 = 5: `(x + 1)(x - 2)^4` and `(x + 1)^3(x - 2)^2` both work.",
            hints:["Crossing means odd order; touching means even order; the orders add to the degree.", "Odd + even = 5. List the odd choices for −1: 1, 3 (5 would leave nothing for 2).", "1 + 4 = 5 and 3 + 2 = 5. Both work: `(x + 1)(x - 2)^4` and `(x + 1)^3(x - 2)^2`."] },
          { id:"f5", goal:[5, 3], star:true, prompt:"`y = a(x + 1)(x - 3)^2` passes through (1, −16). Find `a`, then the `y`-intercept.",
            fields:[{ id:"a", label:"`a` =" }, { id:"y", label:"`y`-intercept =" }], answer:{ a:-2, y:-18 }, display:"`a = -2`; `y`-intercept −18",
            why:"`a(2)(4) = 8a = -16`, so `a = -2`. At 0: `-2(1)(9) = -18`.",
            wrong:[{ field:"a", match:2, fb:"`(1 - 3)^2 = 4` and `(1 + 1) = 2`, so `8a = -16`." }, { field:"y", match:18, fb:"At 0: `-2(1)(9) = -18`." }],
            hints:["Substitute (1, −16) to find `a` first.", "`a(1 + 1)(1 - 3)^2 = a(2)(4) = 8a = -16`, so `a = -2`.", "At `x = 0`: `-2(0 + 1)(0 - 3)^2 = -2(1)(9) = -18`."] },
          { id:"f6", goal:[5, 6], star:true, prompt:"A cubic crosses the axis at −2, touches it at 3, and passes through (1, 12). Find `y` when `x = -3`.",
            fields:[{ id:"v", label:"`y` =" }], answer:-36, display:"`y = -36`",
            why:"`y = a(x + 2)(x - 3)^2`; at (1, 12), `12a = 12`, so `a = 1`. Then `y(-3) = (-1)(36) = -36`.",
            wrong:[{ match:36, fb:"At `x = -3`, `(x + 2) = -1` is negative: `(-1)(36) = -36`." }, { match:6, fb:"Keep the square: `(-3 - 3)^2 = (-6)^2 = 36`, not −6." }],
            hints:["Write the family first: `y = a(x + 2)(x - 3)^2`.", "At (1, 12): `a(3)(4) = 12`, so `a = 1`.", "`y(-3) = (-3 + 2)(-3 - 3)^2 = (-1)(36) = -36`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Mei", how:"",
        instruction:"Mei made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"State the zeros of `y = (x + 4)(x - 1)^2` and how the graph behaves at each.",
            steps:["The zeros come from `x + 4 = 0` and `x - 1 = 0`.", "So the zeros are 4 and 1.", "`(x - 1)` is squared, so the graph touches at 1.", "`(x + 4)` is to the first power, so the graph crosses at 4."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 is correct. The mistake is earlier.", "Step 4 uses step 2’s zero. The mistake is earlier."],
            fixes:[
              { t:"`x + 4 = 0` gives `x = -4`, so the zeros are −4 (crosses) and 1 (touches).", ok:true, why:"Solve each bracket = 0." },
              { t:"The zeros are −4 and −1.", why:"`x - 1 = 0` gives `x = +1`." },
              { t:"The zeros are 4 and −1.", why:"Both signs are flipped now. Solve each bracket = 0." },
              { t:"Step 2 is correct as written.", why:"At `x = 4`, `x + 4 = 8`, not 0." }],
            hints:["Check step 2 by substituting each zero into its bracket.", "Does `x = 4` make `x + 4` equal to 0?", "Step 2 is wrong: the zeros are −4 and 1."] },
          { id:"e2", goal:3, task:"Find the `y`-intercept of `y = -2(x + 1)(x - 3)^2`.",
            steps:["Set `x = 0`.", "`y = -2(0 + 1)(0 - 3)^2`.", "`(0 - 3)^2 = -9`.", "`y = -2(1)(-9) = 18`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "", "Step 4 uses step 3’s value. The mistake is earlier."],
            fixes:[
              { t:"`(0 - 3)^2 = (-3)^2 = 9`, so `y = -2(1)(9) = -18`.", ok:true, why:"The square applies to the whole bracket, including its sign." },
              { t:"`(0 - 3)^2 = -6`.", why:"Squaring isn’t doubling: `(-3)^2 = 9`." },
              { t:"`(0 - 3)^2 = 9`, so `y = 2(1)(9) = 18`.", why:"The −2 in front still counts: `y = -18`." },
              { t:"Step 3 is correct as written.", why:"`-3^2` and `(-3)^2` are different: `(-3)^2 = (-3)(-3) = 9`." }],
            hints:["Check the square in step 3.", "`(0 - 3) = -3`. What is `(-3) × (-3)`?", "Step 3 is wrong: `(-3)^2 = 9`, so the `y`-intercept is −18."] },
          { id:"e3", goal:5, task:"A cubic crosses the axis at −2, touches it at 1, and passes through (0, 4). Find its equation.",
            steps:["`y = a(x + 2)^2(x - 1)`.", "At (0, 4): `4 = a(2)^2(-1) = -4a`.", "`a = -1`.", "`y = -(x + 2)^2(x - 1)`."],
            answer:0,
            stepFb:["", "Step 2 substitutes correctly into step 1’s equation. The mistake is earlier.", "Step 3 solves step 2 correctly. The mistake is earlier.", "Step 4 follows. The mistake is earlier."],
            fixes:[
              { t:"`y = a(x + 2)(x - 1)^2`, because the graph touches at 1. Then `4 = a(2)(1)`, so `a = 2`.", ok:true, why:"The squared factor goes with the touching zero." },
              { t:"`y = a(x - 2)(x + 1)^2`.", why:"The signs are flipped: zeros at −2 and 1 come from `(x + 2)` and `(x - 1)`." },
              { t:"`y = a(x + 2)(x - 1)`.", why:"That’s a quadratic. A cubic that touches at 1 needs `(x - 1)^2`." },
              { t:"Step 1 is correct as written.", why:"Step 1 squares the bracket for −2, so its graph touches at −2 and crosses at 1: the opposite of the description." }],
            hints:["Which zero should have the square?", "Touching means an even order. The graph touches at 1.", "Step 1 is wrong: `y = a(x + 2)(x - 1)^2`, which gives `a = 2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the zero builder? Think about the lens, or what `a` did and didn’t change." },
      { id:"j2", q:"In your own words, why does a squared factor make the graph touch the axis instead of crossing?" },
      { id:"j3", q:"Explain to a friend how to find the equation of a polynomial from its graph, step by step." },
      { id:"j4", q:"Which part of sketching from factored form is still slow for you: zeros, orders, the `y`-intercept, or the ends? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What are the zeros of `y = (x + 5)(2x - 3)`?", options:[
          { t:"−5 and 3/2", ok:true, why:"`x + 5 = 0` gives −5; `2x - 3 = 0` gives 3/2." },
          { t:"5 and −3/2", why:"Both signs are flipped." },
          { t:"−5 and 3", why:"`2x - 3 = 0` gives `x = 3/2`, not 3." },
          { t:"−5 and 2/3", why:"`2x = 3` gives `x = 3 ÷ 2`, not 2 ÷ 3." }] },
        b:{ prompt:"What are the zeros of `y = (x - 6)(3x + 2)`?", options:[
          { t:"6 and −2/3", ok:true, why:"`x - 6 = 0` gives 6; `3x + 2 = 0` gives −2/3." },
          { t:"−6 and 2/3", why:"Both signs are flipped." },
          { t:"6 and −2", why:"`3x + 2 = 0` gives `x = -2/3`, not −2." },
          { t:"6 and −3/2", why:"`3x = -2` gives `x = -2 ÷ 3`, not −3 ÷ 2." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"At which zero does the graph of `y = (x - 1)^2(x + 3)^3` cross the axis while flattening?", options:[
          { t:"−3", ok:true, why:"`(x + 3)^3` has odd order 3: it crosses and flattens at −3." },
          { t:"1", why:"At 1 the order is 2: the graph touches and turns back." },
          { t:"3", why:"The zero from `(x + 3)` is −3, not 3." },
          { t:"Both −3 and 1", why:"Only the odd-order zero crosses." }] },
        b:{ prompt:"At which zero does the graph of `y = (x + 2)^3(x - 4)^2` cross the axis while flattening?", options:[
          { t:"−2", ok:true, why:"`(x + 2)^3` has odd order 3: it crosses and flattens at −2." },
          { t:"4", why:"At 4 the order is 2: the graph touches and turns back." },
          { t:"2", why:"The zero from `(x + 2)` is −2, not 2." },
          { t:"Both −2 and 4", why:"Only the odd-order zero crosses." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What is the `y`-intercept of `y = 3(x - 2)(x + 1)^2`?", options:[
          { t:"−6", ok:true, why:"`3 × (-2) × (1)^2 = -6`." },
          { t:"6", why:"`(0 - 2) = -2` is negative, so the product is negative." },
          { t:"−2", why:"Don’t forget the factor 3 in front." },
          { t:"12", why:"That squares the wrong bracket: `3 × (-2)^2 × 1`." }] },
        b:{ prompt:"What is the `y`-intercept of `y = -2(x + 3)(x - 1)^2`?", options:[
          { t:"−6", ok:true, why:"`-2 × 3 × (-1)^2 = -2 × 3 × 1 = -6`." },
          { t:"6", why:"The −2 in front makes the product negative." },
          { t:"3", why:"Don’t forget the −2 in front." },
          { t:"18", why:"That squares the wrong bracket: `-2 × 3^2 × (-1)`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is the end behaviour of `y = (2 - x)(x + 1)^2`?", options:[
          { t:"Q2 to Q4", ok:true, why:"Leading term: `(-x)(x^2) = -x^3`. Odd degree, negative: Q2 to Q4." },
          { t:"Q3 to Q1", why:"`(2 - x)` starts with `-x`, which makes the leading coefficient negative." },
          { t:"Q3 to Q4", why:"That treats the degree as 2 (two factors). Add the orders: 1 + 2 = 3." },
          { t:"Q2 to Q1", why:"Both arms the same way needs an even degree. Here it’s 3." }] },
        b:{ prompt:"What is the end behaviour of `y = (5 - x)(x - 1)^2`?", options:[
          { t:"Q2 to Q4", ok:true, why:"Leading term: `(-x)(x^2) = -x^3`. Odd degree, negative: Q2 to Q4." },
          { t:"Q3 to Q1", why:"`(5 - x)` starts with `-x`, which makes the leading coefficient negative." },
          { t:"Q3 to Q4", why:"That treats the degree as 2. Add the orders: 1 + 2 = 3." },
          { t:"Q2 to Q1", why:"Both arms the same way needs an even degree. Here it’s 3." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A cubic crosses the `x`-axis at −3, touches it at 2, and has `y`-intercept −6. What is its equation?", options:[
          { t:"`y = -½(x + 3)(x - 2)^2`", ok:true, why:"At 0: `a(3)(4) = 12a = -6`, so `a = -½`." },
          { t:"`y = -½(x - 3)(x + 2)^2`", why:"Zeros at −3 and 2 come from `(x + 3)` and `(x - 2)`. This one’s `y`-intercept is 6." },
          { t:"`y = -½(x + 3)^2(x - 2)`", why:"This touches at −3 and crosses at 2: the wrong way round. Its `y`-intercept is 9." },
          { t:"`y = -2(x + 3)(x - 2)^2`", why:"`12a = -6` gives `a = -6 ÷ 12 = -½`, not −2. This one’s `y`-intercept is −24." }] },
        b:{ prompt:"A cubic crosses the `x`-axis at 4, touches it at −1, and has `y`-intercept 8. What is its equation?", options:[
          { t:"`y = -2(x - 4)(x + 1)^2`", ok:true, why:"At 0: `a(-4)(1) = -4a = 8`, so `a = -2`." },
          { t:"`y = -2(x + 4)(x - 1)^2`", why:"Zeros at 4 and −1 come from `(x - 4)` and `(x + 1)`. This one’s `y`-intercept is −8." },
          { t:"`y = -2(x - 4)^2(x + 1)`", why:"This touches at 4 and crosses at −1: the wrong way round. Its `y`-intercept is −32." },
          { t:"`y = -½(x - 4)(x + 1)^2`", why:"`-4a = 8` gives `a = 8 ÷ (-4) = -2`, not −½. This one’s `y`-intercept is 2." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Which set of conditions describes <strong>exactly one</strong> polynomial?", options:[
          { t:"Degree 3, zeros −1, 2 and 5.", why:"That’s a whole family `y = a(x + 1)(x - 2)(x - 5)`: every `a ≠ 0` fits." },
          { t:"Zeros −1, 2 and 5, passing through (0, 10).", why:"Without the degree, `(x + 1)^2(x - 2)(x - 5)` and others can be scaled to fit too." },
          { t:"Degree 3, zeros −1, 2 and 5, passing through (0, 10).", ok:true, why:"The degree and zeros give the family; the point gives `a = 1`: `(1)(-2)(-5)a = 10`." },
          { t:"Degree 3, passing through (0, 10) and (1, 0).", why:"Two points can’t fix a cubic: it has more freedom than that." }] },
        b:{ prompt:"Which set of conditions describes <strong>exactly one</strong> polynomial?", options:[
          { t:"Degree 4, touching the axis at −2 and at 3.", why:"That’s a family `y = a(x + 2)^2(x - 3)^2`." },
          { t:"Touching the axis at −2 and at 3, passing through (1, 36).", why:"Without the degree, higher-degree polynomials with extra factors can fit too." },
          { t:"Degree 4, touching the axis at −2 and at 3, passing through (1, 36).", ok:true, why:"The family is `a(x + 2)^2(x - 3)^2`; at 1, `36a = 36`, so `a = 1`." },
          { t:"Degree 4, touching the axis at −2, passing through (1, 36).", why:"The other two zeros aren’t known, so many quartics fit." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of what the graph of `y = (x + 3)^2(x - 1)` does at `x = -3`?", options:[
          { t:"It touches the axis and turns back: `(x + 3)^2` is never negative, so `y` has the same sign just left and just right of −3.", ok:true, why:"Even order means no sign change." },
          { t:"It crosses, because −3 is a negative zero.", why:"Positive or negative zeros can both cross or touch. The order decides." },
          { t:"It crosses and flattens, because every repeated zero flattens.", why:"Order 3 flattens as it crosses; order 2 touches." },
          { t:"It turns back because the degree, 2, is even.", why:"The degree is 2 + 1 = 3. The exponent 2 is the order of this one zero." }] },
        b:{ prompt:"Which is the best explanation of what the graph of `y = (x + 1)^3(x - 4)` does at −1?", options:[
          { t:"`(x + 1)^3` changes sign at −1 (an odd power), so the graph crosses. Near −1 it behaves like a cubic, which is flat at its zero, so it flattens as it crosses.", ok:true, why:"Odd order means a sign change, and order 3 makes the graph flatten as it crosses." },
          { t:"It touches, because −1 is negative.", why:"The sign of the zero doesn’t decide. The order does." },
          { t:"It turns around, because a cube makes a turning point.", why:"An order 3 zero flattens but keeps going: no turn." },
          { t:"It crosses in a straight line, because the degree is 4.", why:"The degree affects the ends. The order at −1 is 3." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which equation has zeros −2 (order 2) and 5 (order 1), and leading coefficient −3?", options:[
          { t:"`y = -3(x + 2)^2(x - 5)`", ok:true, why:"Each zero `r` gives `(x - r)`; the order is the power; −3 multiplies the whole product." },
          { t:"`y = -3(x - 2)^2(x + 5)`", why:"These zeros are 2 and −5." },
          { t:"`y = -3(x + 2)(x - 5)^2`", why:"The orders are swapped: here 5 has order 2." },
          { t:"`y = (x + 2)^2(x - 5) - 3`", why:"Subtracting 3 shifts the graph down; it doesn’t set the leading coefficient, and it moves the zeros." }] },
        b:{ prompt:"Which equation has zeros 4 (order 3) and −1 (order 1), and leading coefficient 2?", options:[
          { t:"`y = 2(x - 4)^3(x + 1)`", ok:true, why:"Each zero `r` gives `(x - r)`; the order is the power; 2 multiplies the whole product." },
          { t:"`y = 2(x + 4)^3(x - 1)`", why:"These zeros are −4 and 1." },
          { t:"`y = 2(x - 4)(x + 1)^3`", why:"The orders are swapped: here −1 has order 3." },
          { t:"`y = (x - 4)^3(x + 1) + 2`", why:"Adding 2 shifts the graph up and moves the zeros." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A skateboard ramp’s profile is a cubic `h(x)`, in metres, where `x` is the horizontal distance. It starts on the ground at `x = 0`, levelling into the ground there (it touches), and comes back to the ground at `x = 9`. At `x = 3` it is 4.5 m high. How high is it at `x = 6`?", options:[
          { t:"9 m", ok:true, why:"`h = ax^2(x - 9)`. At 3: `a(9)(-6) = -54a = 4.5`, so `a = -1/12`. At 6: `-(1/12)(36)(-3) = 9`." },
          { t:"2.25 m", why:"That puts the touch at 9 instead of 0: `h = ax(x - 9)^2`." },
          { t:"4.5 m", why:"That assumes the ramp is symmetric. A cubic with a touch at one end isn’t." },
          { t:"−9 m", why:"Check the sign of `a`: `-54a = 4.5` makes `a` negative, and `h(6)` comes out positive." }] },
        b:{ prompt:"A drainage channel’s profile is a cubic `h(x)`, in metres. It meets ground level at `x = 0`, crossing it, and at `x = 8`, where it levels into the ground (it touches). At `x = 4` it is −8 m (8 m deep). What is `h` at `x = 6`?", options:[
          { t:"−3 m", ok:true, why:"`h = ax(x - 8)^2`. At 4: `a(4)(16) = 64a = -8`, so `a = -1/8`. At 6: `-(1/8)(6)(4) = -3`." },
          { t:"−9 m", why:"That puts the touch at 0 instead of 8: `h = ax^2(x - 8)`." },
          { t:"−8 m", why:"That assumes the depth stays the same from 4 to 6." },
          { t:"3 m", why:"Check the sign of `a`: `64a = -8` makes `a` negative." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A company’s monthly profit, in thousands of dollars, is `P(x) = -(x - 2)^2(x - 8)`, where `x` is the number of units made, in hundreds, with `0 < x < 10`. For which production levels is the profit positive?", options:[
          { t:"`(0, 8)`", why:"At `x = 2` the profit is exactly 0, which isn’t positive." },
          { t:"`(0, 2) ∪ (2, 8)`", ok:true, why:"`(x - 2)^2 ≥ 0` and `-(x - 8) > 0` when `x < 8`. So `P > 0` for `x < 8`, except at the touch point 2." },
          { t:"`(8, 10)`", why:"That ignores the minus sign in front." },
          { t:"`(2, 8)`", why:"`P` is positive before 2 as well: the square doesn’t change sign at 2." }] },
        b:{ prompt:"A pond’s level changes at a rate of `L(t) = (t - 1)^2(t - 5)` cm per month, `t` months after a dam opens, with `0 < t < 7`. When is the level falling (`L < 0`)?", options:[
          { t:"`(0, 5)`", why:"At `t = 1` the rate is exactly 0, which isn’t negative." },
          { t:"`(0, 1) ∪ (1, 5)`", ok:true, why:"`(t - 1)^2 ≥ 0` and `(t - 5) < 0` when `t < 5`. So `L < 0` for `t < 5`, except at the touch point 1." },
          { t:"`(5, 7)`", why:"That’s where `L > 0`, the level rising." },
          { t:"`(1, 5)`", why:"`L` is negative before 1 as well: the square doesn’t change sign at 1." }] } }
    ]
  },
  task:{
    title:"Hit the checkpoints", summary:"Hit the checkpoints",
    statement:"<p>Use the zero builder to design a polynomial that meets every checkpoint. There are many answers. Can you find more than one?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The checkpoints</h4><ol style=\"margin:0;padding-left:1.3em\"><li>Degree exactly 4.</li><li>Exactly 3 `x`-intercepts.</li><li>Both arms point down.</li><li>`y`-intercept 8.</li><li>The graph touches the axis at a positive `x`-value.</li></ol></div><p class=\"tiny muted\">In this builder the zeros snap to whole numbers from −6 to 6. Each zero has order chips (1, 2, 3), and `@a{a}` runs from −3 to 3 in steps of 0.25.</p>",
    checks:["Degree exactly 4", "Exactly 3 `x`-intercepts", "Both arms point down", "`y`-intercept 8", "Touches the axis at a positive `x`-value"],
    tips:["Your orders add to {n}. Degree 4 with 3 zeros needs orders 2, 1 and 1.", "You have {k} zeros. Use three, one of them squared.", "Both arms down needs an even degree and a negative `a`.",
      "Your `y`-intercept is {v} = `a` × {p}. With `a < 0`, you need a negative bracket product. Try changing which zero is squared, or the sign of one zero.",
      "Touching means an even order. Put the squared factor on a zero to the right of the `y`-axis."],
    explainPrompt:"Explain how you chose the zeros and `a` so that the `y`-intercept came out to 8 with both arms down.",
    vocab:"Use the words order, zero, leading coefficient and y-intercept.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Notice that `a < 0` and the `y`-intercept is positive, so the bracket product at 0 must be negative: that’s what decides which zeros can work together."
  },
  cards:[
    ["Zero from a factor", "`(x - r)` is 0 at `x = r`; `(x + 3)` gives −3; `(2x - 3)` gives 3/2."],
    ["Order of a zero", "The power on its factor: in `(x - 1)^2(x + 3)`, 1 has order 2 and −3 has order 1."],
    ["Order 1", "The graph crosses the axis, like a line."],
    ["Order 2", "The graph touches the axis and turns back, like a parabola. No sign change."],
    ["Order 3", "The graph crosses and flattens for an instant, like a cubic. No turning point there."],
    ["Degree from factored form", "Add the orders: `(x + 1)^2(x - 3)` has degree 3."],
    ["Leading coefficient from factored form", "`a` times the leading coefficient of every factor: `(3 - x)(x + 2)^2` has −1."],
    ["`y`-intercept from factored form", "Put `x = 0` into every bracket, keeping powers and `a`: `-2(0 + 1)(0 - 3)^2 = -18`."],
    ["Sign changes", "Only odd-order zeros change the sign of `y`. Use them to find positive and negative intervals."],
    ["What `a` changes", "Every height is multiplied by `a`: stretch, compress or flip. Zeros and their orders don’t move."],
    ["Equation from a graph", "Read the zeros and orders, write `y = a(…)`, then substitute a point that <strong>isn’t</strong> a zero to find `a`."],
    ["Zeros alone aren’t enough", "Degree 3 with zeros −1, 2, 5 is a family `a(x + 1)(x - 2)(x - 5)`. One more point fixes `a`."]
  ]
};
