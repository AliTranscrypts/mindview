// MHF4U 13 Solving Polynomial Equations. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/13-solving-polynomial-equations.md
const M1 = "Dividing by `x` assumes `x ≠ 0`. Move everything to one side and factor instead: `x = 0` is a root.";
const M3 = "Those are `u`-values. `u` is `x^2`, so solve `x^2 = 1` and `x^2 = 16`.";
const M5 = (x, dim) => "A side length must make every dimension positive. `x = " + x + "` makes `" + dim + "` negative.";

export default {
  id:"13-solving-polynomial-equations",
  kind:"topic",
  title:"Solving polynomial equations",
  topic:"Solving Polynomial Equations",
  readyTopic:"solving polynomial equations",
  hero:{
    eq:"<span class=\"nw\">`P(x) = 0` ⟶</span> <span class=\"nw\">(factor)(factor)(factor) = 0 ⟶</span> <span class=\"nw\">roots = `x`-intercepts</span>", eqLabel:"P of x equals 0, becomes factor times factor times factor equals 0, and the roots are the x-intercepts", eqSize:"sm",
    headline:"Zero on one side, then factor",
    text:"A product is zero only when one of its factors is zero. So to solve a polynomial equation, move everything to one side, <strong>factor</strong>, and set each factor to 0. Each real <strong>root</strong> you find is an <strong>`x`-intercept</strong> of the graph of the polynomial.",
    fig:{ html:'<div class="hz-line" id="hz-line" aria-hidden="true"></div><canvas class="plot" id="hero-plot" role="img" aria-label="The equation x cubed plus 2 x squared equals 9 x plus 18 is rewritten as x cubed plus 2 x squared minus 9 x minus 18 equals 0, then grouped as x squared times (x + 2) minus 9 times (x + 2), then factored as (x + 2)(x − 3)(x + 3) = 0. Three dots drop onto the graph’s x-axis at −3, −2 and 3."></canvas>' }
  },
  goals:[
    "I can solve a factored polynomial equation using the zero product property.",
    "I can rearrange an equation to = 0 before factoring, without dividing by a variable.",
    "I can choose a strategy: common factor, grouping, quadratic form or the factor theorem.",
    "I can solve equations in quadratic form, such as `x^4 - 13x^2 + 36 = 0`.",
    "I can connect real roots to `x`-intercepts, including repeated roots and factors with no real zeros.",
    "I can solve problems with polynomial equations and reject roots that don’t fit the context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Zero product property", goal:1,
          prompt:"Solve `(x - 5)(x + 2) = 0`.",
          options:[
            { t:"`x = 5` or `x = -2`", ok:true, why:"Each factor can be 0." },
            { t:"`x = -5` or `x = 2`", why:"`x - 5 = 0` at `x = 5`." },
            { t:"`x = 5` only", why:"`x = -2` makes the second factor 0." },
            { t:"`x = -10`", why:"Set each factor to 0." }],
          hints:["When is a product 0?", "`x - 5 = 0` or `x + 2 = 0`.", "5 or −2."] },
        { id:"w2", skill:"Zero product property", goal:2,
          prompt:"Solve `x^2 - 3x = 0`.",
          options:[
            { t:"`x = 0` or `x = 3`", ok:true, why:"`x(x - 3) = 0`." },
            { t:"`x = 3` only", why:"Dividing by `x` loses `x = 0`." },
            { t:"`x = -3` or `x = 0`", why:"`x - 3 = 0` at 3." },
            { t:"`x = √3`", why:"Factor out `x`." }],
          hints:["Common factor?", "`x(x - 3) = 0`.", "0 or 3."] },
        { id:"w3", skill:"Factoring", goal:3,
          prompt:"Factor `x^3 - 2x^2 - 9x + 18`.",
          options:[
            { t:"`(x - 2)(x - 3)(x + 3)`", ok:true, why:"`x^2(x - 2) - 9(x - 2)`." },
            { t:"`(x - 2)(x^2 - 9)`", why:"`x^2 - 9` factors." },
            { t:"`(x + 2)(x - 3)(x + 3)`", why:"`-9x + 18 = -9(x - 2)`." },
            { t:"`(x - 2)(x - 9)`", why:"`x^2 - 9`, not `x - 9`." }],
          hints:["Group in pairs.", "`x^2(x - 2) - 9(x - 2)`.", "`(x - 2)(x - 3)(x + 3)`."] },
        { id:"w4", skill:"Factoring", goal:3,
          prompt:"Factor `u^2 - 13u + 36`.",
          options:[
            { t:"`(u - 4)(u - 9)`", ok:true, why:"4 × 9 = 36, 4 + 9 = 13." },
            { t:"`(u + 4)(u + 9)`", why:"That gives `+13u`." },
            { t:"`(u - 6)^2`", why:"`(u - 6)^2 = u^2 - 12u + 36`." },
            { t:"`(u - 12)(u - 3)`", why:"Product 36, but sum 15." }],
          hints:["Product 36, sum −13.", "−4 and −9.", "`(u - 4)(u - 9)`."] },
        { id:"w5", skill:"Square roots", goal:4,
          prompt:"Solve `x^2 = 16`.",
          options:[
            { t:"`x = 4` or `x = -4`", ok:true, why:"Both square to 16." },
            { t:"`x = 4`", why:"`(-4)^2 = 16` too." },
            { t:"`x = 8`", why:"`8^2 = 64`." },
            { t:"`x = 256`", why:"Take the square root." }],
          hints:["Which numbers square to 16?", "`4^2` and `(-4)^2`.", "±4."] },
        { id:"w6", skill:"Square roots", goal:5,
          prompt:"How many real solutions does `x^2 + 9 = 0` have?",
          options:[
            { t:"None", ok:true, why:"`x^2 = -9`, and no real number squares to a negative." },
            { t:"Two: ±3", why:"`3^2 = 9`, not −9." },
            { t:"One: −3", why:"`(-3)^2 = 9`." },
            { t:"Two: ±9", why:"Check: `9^2 + 9 = 90`." }],
          hints:["Isolate `x^2`.", "`x^2 = -9`.", "No real solutions."] }
      ],
      refreshers:{
        "Zero product property":"If `AB = 0`, then `A = 0` or `B = 0`. It only works when one side is 0.",
        "Factoring":"Common factor first, then grouping or a pattern, then trinomials.",
        "Square roots":"`x^2 = k > 0` gives `x = ±√k`; `x^2 =` negative has no real solutions."
      }
    }
  },
  explore:{
    heading:"Strategy path",
    intro:"Choose the next move for each equation. Correct moves rewrite it; each root you find drops onto the graph as an `x`-intercept.",
    equations:[
      { id:"e1", chip:"E1", eq:"`x^3 - 4x = 0`" },
      { id:"e2", chip:"E2", eq:"`x^3 + 2x^2 = 9x + 18`" },
      { id:"e3", chip:"E3", eq:"`x^4 - 13x^2 + 36 = 0`" },
      { id:"e4", chip:"E4", eq:"`2x^3 - 3x^2 - 11x + 6 = 0`" },
      { id:"e5", chip:"E5", eq:"`x^4 - 5x^2 - 36 = 0`" }
    ],
    moves:[
      { id:"side", t:"Move everything to one side" },
      { id:"divx", t:"Divide both sides by `x`" },
      { id:"cf", t:"Take out a common factor" },
      { id:"group", t:"Group in pairs" },
      { id:"u", t:"Let `u = x^2`" },
      { id:"test", t:"Test a candidate (factor theorem)" },
      { id:"quad", t:"Factor a quadratic" },
      { id:"zero", t:"Set each factor to 0" }
    ],
    fb:{
      divx:"That would lose the root `x = 0`. Move everything to one side and factor out `x` instead.",
      zeroSide:"One side isn’t 0 yet.",
      na:"{move} doesn’t apply here: {reason}."
    },
    readout:{ line:"Current line", roots:"Roots found", none:"Factors with no real roots", ints:"`x`-intercepts", moves:"Moves" },
    predIntro:"Make a prediction first. Then the strategy path will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Solve `x^3 = 4x`. A student divides both sides by `x` and gets `x^2 = 4`. How many `x`-intercepts does the graph of `y = x^3 - 4x` have?",
        options:[{ t:"3", ok:true }, { t:"2" }, { t:"1" }, { t:"4" }],
        explain:"`x(x - 2)(x + 2) = 0` also gives `x = 0`, which dividing by `x` threw away." },
      { id:"p2", prompt:"E3 after `u = x^2`: `(u - 4)(u - 9) = 0`. How many `x`-intercepts will `y = x^4 - 13x^2 + 36` have?",
        options:[{ t:"4", ok:true }, { t:"2" }, { t:"0" }, { t:"3" }],
        explain:"`u = 4` gives `x = ±2` and `u = 9` gives `x = ±3`." },
      { id:"p3", prompt:"E5: `(u - 9)(u + 4) = 0`. How many `x`-intercepts will `y = x^4 - 5x^2 - 36` have?",
        options:[{ t:"2", ok:true }, { t:"4" }, { t:"0" }, { t:"1" }],
        explain:"`u = x^2 = -4` has no real solutions." },
      { id:"p4", prompt:"`y = (x - 1)^2(x + 3)`. How many `x`-intercepts?",
        options:[{ t:"2", ok:true }, { t:"3" }, { t:"1" }, { t:"0" }],
        explain:"The roots are −3 and 1 (order 2): two different `x`-values." }
    ],
    chalIntro:"Use the strategy path to meet each goal, then press <strong>Check challenge</strong>. Each candidate you test counts as a move. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3], prompt:"Solve E2 in at most 4 moves.",
        why:"Move to one side, group, factor `x^2 - 9`, set to 0: the roots are −3, −2 and 3.",
        msgs:{ more:"Grouping gets there faster than testing candidates.", pick:"Choose E2 and solve it: find every root.", moves:"You used {n} moves. Press <strong>Start over</strong> and try again." },
        hints:["Get 0 on one side.", "`x^3 + 2x^2 - 9x - 18`: group in pairs.", "`(x + 2)(x^2 - 9) = (x + 2)(x - 3)(x + 3)`."] },
      { id:"tc2", goal:[3], prompt:"Solve E4.",
        why:"`(x - 3)(2x - 1)(x + 2) = 0`: the roots are −2, 1/2 and 3.",
        msgs:{ ints:"The quotient `2x^2 + 3x - 2` factors as `(2x - 1)(x + 2)`: a fraction root.", pick:"Choose E4 and solve it: find every root." },
        hints:["Test candidates ±1, ±2, ±3, ±6, ±1/2, ±3/2.", "`P(3) = 54 - 27 - 33 + 6 = 0`.", "`(x - 3)(2x - 1)(x + 2) = 0`."] },
      { id:"tc3", goal:[4], stretch:true,
        prompt:"Build mode: set `k` so that `x^4 - 10x^2 + k = 0` has <strong>exactly two</strong> real roots, <strong>both integers</strong>.",
        why:"`k = -96`: `u = 16` or `u = -6`, so `x = ±4`.",
        msgs:{ four:"Four real roots.", three:"Three real roots.", none:"No real roots.", twoIrr:"Two real roots, but {r} aren’t integers." },
        hints:["Let `u = x^2`: `u^2 - 10u + k = 0`. For exactly two real roots, exactly one `u` should be positive.", "The `u`-values add to 10. The positive one must be a perfect square, and the other negative.", "`u = 16` and `u = -6`: `k = 16 × (-6) = -96`."] }
    ]
  },
  part3:{
    slug:"roots", name:"Roots",
    heading:"Roots ↔ intercepts",
    intro:"Three stations, one idea: the real roots of `P(x) = 0` are the `x`-intercepts of `y = P(x)`. Choose a station.",
    stations:[
      { id:"s1", chip:"1. Two views",
        title:"Station 1: two views of one equation",
        text:"`x^3 + 2x^2 = 9x + 18` drawn as two graphs: `y = x^3 + 2x^2` (solid) and `y = 9x + 18` (dashed). They meet at `x = -3`, −2 and 3. Subtract them to get one graph.",
        btn:"Subtract the graphs", back:"Show the two graphs again",
        after:"`y = x^3 + 2x^2 - 9x - 18` crosses the `x`-axis at the same `x`-values: −3, −2 and 3. Each guide line joins an intersection to its intercept.",
        alg:"<summary>Check it with algebra</summary><p>Substitute each root into both sides:</p><div class=\"alg-lines\"><span>`x = -3`: `-27 + 18 = -9` and `9(-3) + 18 = -9`</span><span>`x = -2`: `-8 + 8 = 0` and `9(-2) + 18 = 0`</span><span>`x = 3`: `27 + 18 = 45` and `27 + 18 = 45`</span></div>" },
      { id:"s2", chip:"2. The box",
        title:"Station 2: the box",
        text:"Cut squares of side `x` cm from the corners of a 10 cm × 16 cm sheet and fold up an open box. For which `x` is the volume 144 cm³?",
        model:["`V(x) = x(10 - 2x)(16 - 2x) = 144`", "`4x^3 - 52x^2 + 160x - 144 = 0`", "`x^3 - 13x^2 + 40x - 36 = 0`"],
        how:"Test candidates (divisors of 36) until one works.",
        band:"valid sizes: 0 < `x` < 5",
        result:"The answer is `x = 2`: a 2 × 6 × 12 box.",
        alg:"<summary>Check it with algebra</summary><div class=\"alg-lines\"><span>`V(2) = 2 × 6 × 12 = 144` ✓</span><span>`x = 9`: `10 - 18 < 0`, so there’s no box <small>(rejected)</small></span><span>Only 0 < `x` < 5 makes every dimension positive.</span></div>" },
      { id:"s3", chip:"3. The W",
        title:"Station 3: the W",
        text:"`y = x^4 - 13x^2 + 36` with a constant `s` added. Move the slider and watch the four intercepts become two, then none.",
        alg:"<summary>Check it with algebra</summary><p>Let `u = x^2`: `u^2 - 13u + (36 + s) = 0`. Each positive `u` gives two intercepts `x = ±√u`; `u = 0` gives one; a negative `u` gives none.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Roots ↔ intercepts quick check",
      items:[
        { id:"q1", goal:4, prompt:"Real roots of `x^4 - 5x^2 + 4 = 0`?",
          choices:[
            { t:"±1, ±2", ok:true, fb:"Right. `(x^2 - 1)(x^2 - 4)`: `x^2 = 1` or 4." },
            { t:"1, 4", fb:"`(x^2 - 1)(x^2 - 4)`: `x^2 = 1` or 4." },
            { t:"±1", fb:"`(x^2 - 1)(x^2 - 4)`: `x^2 = 1` or 4." },
            { t:"±2", fb:"`(x^2 - 1)(x^2 - 4)`: `x^2 = 1` or 4." }] },
        { id:"q2", goal:5, prompt:"How many `x`-intercepts does `y = x(x^2 + 1)` have?",
          choices:[
            { t:"1", ok:true, fb:"Right. Only `x = 0`: `x^2 + 1 = 0` has no real roots." },
            { t:"3", fb:"`x^2 + 1 = 0` has no real roots." },
            { t:"2", fb:"`x^2 + 1 = 0` has no real roots." },
            { t:"0", fb:"`x^2 + 1 = 0` has no real roots." }] },
        { id:"q3", goal:2, prompt:"`x(x - 1) = 6`. First step?",
          choices:[
            { t:"Move 6 to the left", ok:true, fb:"Right. Get 0 on one side: `x^2 - x - 6 = 0`." },
            { t:"Set `x = 6`", fb:"Get 0 on one side: `x^2 - x - 6 = 0`." },
            { t:"Set `x - 1 = 6`", fb:"Get 0 on one side: `x^2 - x - 6 = 0`." },
            { t:"Divide by `x`", fb:"Get 0 on one side: `x^2 - x - 6 = 0`." }] },
        { id:"q4", goal:6, prompt:"In the box problem, why is `x = 9` rejected?",
          choices:[
            { t:"`10 - 2x` would be negative", ok:true, fb:"Right. Every dimension must be positive." },
            { t:"9 isn’t a root", fb:"Every dimension must be positive." },
            { t:"9 is too big to cube", fb:"Every dimension must be positive." },
            { t:"Roots must be even", fb:"Every dimension must be positive." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Equation ↔ real roots", summary:"Equation ↔ real roots", goal:[1, 4, 5],
        instruction:"Match each equation with all of its real roots.",
        leftTitle:"Equation", rightTitle:"Real roots",
        left:[
          { id:"l1", t:"`x^3 - 9x = 0`", why:"`x(x - 3)(x + 3) = 0`." },
          { id:"l2", t:"`x^3 + 9x = 0`", why:"`x(x^2 + 9) = 0`, and `x^2 + 9` has no real roots." },
          { id:"l3", t:"`x^4 - 10x^2 + 9 = 0`", why:"`(x^2 - 1)(x^2 - 9) = 0`." },
          { id:"l4", t:"`(x - 2)^2(x + 1) = 0`", why:"2 is a root of order 2, but it’s one root." },
          { id:"l5", t:"`x^4 - 16 = 0`", why:"`(x^2 - 4)(x^2 + 4) = 0`." },
          { id:"l6", t:"`x^3 - 8 = 0`", why:"`(x - 2)(x^2 + 2x + 4) = 0`.",
            hints:["Difference of cubes.", "`(x - 2)(x^2 + 2x + 4)`.", "Only `x = 2` is real."] },
          { id:"l7", t:"`x^3 - 3x^2 - 4x + 12 = 0`", why:"`x^2(x - 3) - 4(x - 3) = (x - 3)(x - 2)(x + 2)`." },
          { id:"l8", t:"`2x^3 - x^2 - 2x + 1 = 0`", why:"`(2x - 1)(x - 1)(x + 1) = 0`.",
            hints:["Group.", "`x^2(2x - 1) - 1(2x - 1)`.", "`(2x - 1)(x - 1)(x + 1)`."] }
        ],
        right:[
          { id:"r1", t:"−3, 0, 3" }, { id:"r2", t:"0" }, { id:"r3", t:"−3, −1, 1, 3" }, { id:"r4", t:"−1, 2" },
          { id:"r5", t:"−2, 2" }, { id:"r6", t:"2" }, { id:"r7", t:"−2, 2, 3" }, { id:"r8", t:"−1, 1/2, 1" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r1":"`x^2 + 9` has no real roots.",
          "l5|r3":"`x^4 - 16 = (x^2 - 4)(x^2 + 4)`: only ±2.",
          "l6|r5":"`x^3 = 8` has one real root; `x^2 + 2x + 4` has none."
        },
        wrongDefault:"Factor, then set each factor to 0." },
      { id:"solve", type:"custom", title:"Solve it", summary:"Solve it", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Enter every real root. The order doesn’t matter.",
        how:"Type one root in each box (fractions like 1/3 and ± are fine). Press <strong>Add another root</strong> for more boxes, then press Check.",
        add:"Add another root", label:"Real roots", kLabel:"Values of `k`",
        items:[
          { id:"s1", goal:2, prompt:"`x^3 - 2x^2 - 15x = 0`", answer:[-3, 0, 5], display:"−3, 0, 5",
            wrong:[{ missing:0, fb:M1 }],
            hints:["Common factor first.", "`x(x^2 - 2x - 15) = 0`.", "`x(x - 5)(x + 3) = 0`: `x = -3`, 0 or 5."] },
          { id:"s2", goal:4, prompt:"`x^4 - 17x^2 + 16 = 0`", answer:[-4, -1, 1, 4], display:"±1, ±4",
            wrong:[{ match:[1, 16], fb:M3 }, { match:[1, 4], fb:"`x^2 = 1` gives `x = 1` <strong>or</strong> `x = -1`, and `x^2 = 16` gives ±4." }],
            hints:["Let `u = x^2`.", "`(u - 1)(u - 16) = 0`, so `x^2 = 1` or `x^2 = 16`.", "`x = ±1` or `x = ±4`."] },
          { id:"s3", goal:2, star:true, prompt:"`x^3 - x^2 = 4x - 4`", answer:[-2, 1, 2], display:"1, ±2",
            general:"Move everything left, then group: `(x - 1)(x^2 - 4)`.",
            hints:["Get 0 on one side.", "`x^3 - x^2 - 4x + 4 = x^2(x - 1) - 4(x - 1)`.", "`(x - 1)(x - 2)(x + 2) = 0`: 1, ±2."] },
          { id:"s4", goal:3, star:true, prompt:"`3x^3 + 2x^2 - 7x + 2 = 0`", answer:[-2, 0.3333333333333333, 1], display:"−2, 1/3, 1",
            wrong:[{ missing:0.3333333333333333, fb:"The quotient `3x^2 + 5x - 2 = (3x - 1)(x + 2)`." }],
            hints:["Test candidates ±1, ±2, ±1/3, ±2/3.", "`P(1) = 3 + 2 - 7 + 2 = 0`, so `x - 1` is a factor, with quotient `3x^2 + 5x - 2`.", "`(x - 1)(3x - 1)(x + 2) = 0`: −2, 1/3, 1."] },
          { id:"s5", goal:4, star:true, prompt:"`(x^2 - 5)^2 = 16`", answer:[-3, -1, 1, 3], display:"±1, ±3",
            wrong:[{ match:[-3, 3], fb:"`x^2 - 5 = ±4` gives `x^2 = 9` <strong>or</strong> `x^2 = 1`." }],
            hints:["Take the square root of both sides.", "`x^2 - 5 = 4` or `x^2 - 5 = -4`.", "`x^2 = 9` or 1: ±3, ±1."] },
          { id:"s6", goal:5, star:true, kind:"k", prompt:"Find every `k` for which `x^3 - kx^2 + 4x = 0` has exactly two different real roots.", answer:[-4, 4], display:"`k = 4` and `k = -4`",
            general:"`x(x^2 - kx + 4) = 0`. `x = 0` is one root; the quadratic must have a double root: `k^2 - 16 = 0`.",
            hints:["Factor out `x`.", "The quadratic `x^2 - kx + 4` can’t have 0 as a root, so for exactly two different roots it must have a double root.", "Discriminant `k^2 - 16 = 0`: `k = ±4`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Lucas", how:"",
        instruction:"Lucas made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Solve `x^3 = 9x`.",
            steps:["Divide both sides by `x`: `x^2 = 9`.", "So `x = 3` or `x = -3`."],
            answer:0,
            stepFb:["", "Step 2 solves step 1 correctly. The mistake is earlier."],
            fixes:[
              { t:"`x^3 - 9x = 0`, so `x(x - 3)(x + 3) = 0`: `x = 0`, 3 or −3.", ok:true, why:"Getting 0 on one side and factoring keeps every root, including `x = 0`." },
              { t:"Divide by 9: `x^3/9 = x`.", why:"That’s the same equation in a new form. It still needs 0 on one side and factoring." },
              { t:"Take cube roots: `x = ∛(9x)`.", why:"`x` is still on both sides, so nothing is solved. Get 0 on one side and factor." },
              { t:"Step 1 is correct.", why:"Dividing by `x` loses `x = 0`." }],
            hints:["Is `x = 0` a solution of `x^3 = 9x`?", "Yes: 0 = 0.", "Factor instead: 0, ±3."] },
          { id:"e2", goal:2, task:"Solve `x(x - 4) = 5`.",
            steps:["`x = 5` or `x - 4 = 5`.", "So `x = 5` or `x = 9`."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier."],
            fixes:[
              { t:"`x^2 - 4x - 5 = 0`, so `(x - 5)(x + 1) = 0`: `x = 5` or −1.", ok:true, why:"Only a product equal to <strong>0</strong> splits into cases, so get 0 on one side first." },
              { t:"`x = 0` or `x = 4`.", why:"That solves `x(x - 4) = 0`." },
              { t:"`x = 5` only.", why:"`x = -1` works too: `(-1)(-5) = 5`. Get 0 on one side and factor to find both." },
              { t:"Step 1 is correct.", why:"Check `x = 9`: 9 × 5 = 45 ≠ 5." }],
            hints:["Is the right side 0?", "Move the 5 over.", "5 or −1."] },
          { id:"e3", goal:4, task:"Solve `x^4 - 5x^2 - 36 = 0`.",
            steps:["Let `u = x^2`: `u^2 - 5u - 36 = 0`.", "`(u - 9)(u + 4) = 0`, so `u = 9` or `u = -4`.", "So `x = ±3` or `x = ±2`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`x^2 = 9` gives ±3; `x^2 = -4` has no real solutions. The real roots are ±3.", ok:true, why:"No real number squares to a negative, so `u = -4` gives no `x`-intercepts." },
              { t:"`x = 9` or −4.", why:"Those are the `u`-values. `u` is `x^2`, so `x^2 = 9` gives `x = ±3`." },
              { t:"`x = ±3` or `±4`.", why:"`u = -4` means `x^2 = -4`, not `x = ±4`. No real number squares to a negative." },
              { t:"Step 3 is correct.", why:"`(±2)^2 = 4`, not −4." }],
            hints:["Which numbers square to −4?", "None.", "±3 only."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the strategy path: the “divide by `x`” trap, or the quadratic-form equations?" },
      { id:"j2", q:"In your own words, why must one side be 0 before you factor?" },
      { id:"j3", q:"Explain to a friend how you decide which factoring move to try first." },
      { id:"j4", q:"Which step still slows you down? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Solve `x(x - 3)(2x + 1) = 0`.", options:[
          { t:"`x = 0`, 3 or `-1/2`", ok:true, why:"Each factor can be 0: `x = 0`, `x - 3 = 0` gives 3, and `2x + 1 = 0` gives `-1/2`." },
          { t:"`x = 3` or `-1/2`", why:"`x = 0` makes the first factor 0." },
          { t:"`x = 0`, −3 or 1/2", why:"`x - 3 = 0` when `x = 3`, and `2x + 1 = 0` when `x = -1/2`." },
          { t:"`x = 0`, 3 or −1", why:"`2x + 1 = 0` gives `x = -1/2`." }] },
        b:{ prompt:"Solve `x(x + 4)(3x - 2) = 0`.", options:[
          { t:"`x = 0`, −4 or 2/3", ok:true, why:"Each factor can be 0: `x = 0`, `x + 4 = 0` gives −4, and `3x - 2 = 0` gives 2/3." },
          { t:"`x = -4` or 2/3", why:"`x = 0` makes the first factor 0." },
          { t:"`x = 0`, 4 or `-2/3`", why:"`x + 4 = 0` when `x = -4`, and `3x - 2 = 0` when `x = 2/3`." },
          { t:"`x = 0`, −4 or 2", why:"`3x - 2 = 0` gives 2/3." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Solve `x^4 - 20x^2 + 64 = 0`.", options:[
          { t:"`x = ±2` or `±4`", ok:true, why:"`(x^2 - 4)(x^2 - 16) = 0`." },
          { t:"`x = 2` or 4", why:"Each square has two roots." },
          { t:"`x = 4` or 16", why:"Those are the values of `x^2`." },
          { t:"`x = ±4` or `±16`", why:"`x^2 = 16` gives ±4; `x^2 = 4` gives ±2." }] },
        b:{ prompt:"Solve `x^4 - 26x^2 + 25 = 0`.", options:[
          { t:"`x = ±1` or `±5`", ok:true, why:"`(x^2 - 1)(x^2 - 25) = 0`." },
          { t:"`x = 1` or 5", why:"Each square has two roots: `x^2 = 1` gives ±1 and `x^2 = 25` gives ±5." },
          { t:"`x = 1` or 25", why:"Those are the values of `x^2`." },
          { t:"`x = ±1` or `±25`", why:"`x^2 = 25` gives ±5." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"How many `x`-intercepts does `y = x^4 - 3x^2 - 4` have?", options:[
          { t:"2", ok:true, why:"`(x^2 - 4)(x^2 + 1)`: only `x = ±2`." },
          { t:"4", why:"`x^2 = -1` has no real roots." },
          { t:"0", why:"`x^2 = 4` gives ±2." },
          { t:"3", why:"`x^2 = 4` gives two intercepts, ±2, not three." }] },
        b:{ prompt:"How many `x`-intercepts does `y = x^4 + 3x^2 - 10` have?", options:[
          { t:"2", ok:true, why:"`(x^2 + 5)(x^2 - 2)`: only `x = ±√2`." },
          { t:"4", why:"`x^2 = -5` has no real roots." },
          { t:"0", why:"`x^2 = 2` gives `±√2`." },
          { t:"1", why:"`x^2 = 2` gives two intercepts, `±√2`." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Solve `x^3 + 3x^2 = 4x + 12`.", options:[
          { t:"`x = -3`, −2 or 2", ok:true, why:"`x^3 + 3x^2 - 4x - 12 = (x + 3)(x - 2)(x + 2) = 0`." },
          { t:"`x = -2` or 2", why:"Dividing `x^2(x + 3) = 4(x + 3)` by `(x + 3)` loses `x = -3`." },
          { t:"`x = 3`, −2 or 2", why:"`x + 3 = 0` gives −3." },
          { t:"`x = -3` or 2", why:"`x^2 - 4 = 0` gives ±2." }] },
        b:{ prompt:"Solve `x^3 - 2x^2 = 9x - 18`.", options:[
          { t:"`x = 2`, −3 or 3", ok:true, why:"`(x - 2)(x - 3)(x + 3) = 0`." },
          { t:"`x = -3` or 3", why:"Dividing by `(x - 2)` loses `x = 2`." },
          { t:"`x = -2`, −3 or 3", why:"`x - 2 = 0` gives 2, not −2." },
          { t:"`x = 2` or 3", why:"`x^2 - 9 = 0` gives ±3." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Solve `2x^3 - 7x^2 + 7x - 2 = 0`.", options:[
          { t:"`x = 1/2`, 1 or 2", ok:true, why:"`P(1) = 0`; `2x^2 - 5x + 2 = (2x - 1)(x - 2)`." },
          { t:"`x = 1` or 2", why:"The rational zero 1/2 is missing: integer candidates alone aren’t enough." },
          { t:"`x = -1/2`, 1 or −2", why:"`(2x - 1)(x - 2)` gives +1/2 and +2." },
          { t:"`x = 1`, 2 or `-1/2`", why:"Check `P(-1/2) = -1/4 - 7/4 - 7/2 - 2 ≠ 0`." }] },
        b:{ prompt:"Solve `3x^3 - 10x^2 + 9x - 2 = 0`.", options:[
          { t:"`x = 1/3`, 1 or 2", ok:true, why:"`P(1) = 0`; `3x^2 - 7x + 2 = (3x - 1)(x - 2)`." },
          { t:"`x = 1` or 2", why:"The rational zero 1/3 is missing." },
          { t:"`x = -1/3`, 1 or −2", why:"`(3x - 1)(x - 2)` gives +1/3 and +2." },
          { t:"`x = 1`, 2 or `-1/3`", why:"`P(-1/3) ≠ 0`." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"For which value of `c` does `x^4 - 8x^2 + c = 0` have <strong>exactly 3</strong> real roots?", options:[
          { t:"`c = 0`", ok:true, why:"`u^2 - 8u = 0`: `u = 0` or 8, so `x = 0` or `±2√2`." },
          { t:"`c = 16`", why:"`u = 4` twice: `x = ±2`, only 2 roots." },
          { t:"`c = 7`", why:"`u = 1` or 7: 4 roots." },
          { t:"`c = -9`", why:"`u = 9` or −1: 2 roots." }] },
        b:{ prompt:"For which value of `c` does `x^4 - 18x^2 + c = 0` have <strong>exactly 3</strong> real roots?", options:[
          { t:"`c = 0`", ok:true, why:"`u = 0` or 18: `x = 0` or `±3√2`." },
          { t:"`c = 81`", why:"`u = 9` twice: 2 roots." },
          { t:"`c = 17`", why:"`u = 1` or 17: 4 roots." },
          { t:"`c = -19`", why:"`u = 19` or −1: 2 roots." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why dividing both sides of `x^3 = 16x` by `x` is a mistake?", options:[
          { t:"It loses the root `x = 0`, because dividing by `x` assumes `x ≠ 0`. Instead, `x^3 - 16x = 0` gives `x(x - 4)(x + 4) = 0`.", ok:true, why:"Dividing by `x` assumes `x ≠ 0`, but `x = 0` is a root: 0 = 0." },
          { t:"You can never divide an equation by a variable.", why:"You can when you know it isn’t 0; here it can be." },
          { t:"It changes the degree, which isn’t allowed.", why:"Degree changes aren’t the issue; losing a root is." },
          { t:"It isn’t a mistake: ±4 are all the roots.", why:"`x = 0` also works: 0 = 0." }] },
        b:{ prompt:"Which is the best explanation of why `x(x - 2) = 8` can’t be solved by writing `x = 8` or `x - 2 = 8`?", options:[
          { t:"The zero product property only works when the product is 0. Rearrange to `x^2 - 2x - 8 = 0`, so `(x - 4)(x + 2) = 0` and `x = 4` or −2.", ok:true, why:"Only a product equal to <strong>0</strong> splits into cases." },
          { t:"Because 8 isn’t a perfect square.", why:"Irrelevant: whether 8 is a perfect square doesn’t matter. The product has to be 0." },
          { t:"Because you must divide by `x` first.", why:"Dividing by `x` assumes `x ≠ 0` and can lose a root. Get 0 on one side and factor instead." },
          { t:"It can: `x = 8` or 10.", why:"Check: 8 × 6 = 48 ≠ 8." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"`x^3 - 3x + 2 = (x - 1)^2(x + 2)`. Which describes its roots and the graph of `y = x^3 - 3x + 2`?", options:[
          { t:"Roots 1 (order 2) and −2; the graph touches the `x`-axis at 1 and crosses at −2.", ok:true, why:"`(x - 1)^2` gives one root of order 2, where the graph touches; `x + 2` gives −2, where it crosses." },
          { t:"Roots 1, 1 and −2, so three `x`-intercepts.", why:"`(x - 1)^2` gives one root, `x = 1`, of order 2: the graph touches there once." },
          { t:"Roots −1 and 2.", why:"`x - 1 = 0` when `x = 1`, and `x + 2 = 0` when `x = -2`." },
          { t:"Root 1 only, because it’s a double root.", why:"`x + 2 = 0` gives −2." }] },
        b:{ prompt:"`x^3 + x^2 - 8x - 12 = (x - 3)(x + 2)^2`. Which describes its roots and the graph?", options:[
          { t:"Roots 3 and −2 (order 2); the graph crosses at 3 and touches at −2.", ok:true, why:"`x - 3` gives 3, where the graph crosses; `(x + 2)^2` gives one root of order 2, where it touches." },
          { t:"Roots 3, −2 and −2, so three `x`-intercepts.", why:"`(x + 2)^2` gives one root, `x = -2`, of order 2: the graph touches there once." },
          { t:"Roots −3 and 2.", why:"`x - 3 = 0` when `x = 3`, and `x + 2 = 0` when `x = -2`." },
          { t:"Root −2 only.", why:"`x - 3 = 0` gives 3." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"An open box is made from a 10 cm × 16 cm sheet by cutting squares of side `x` cm from the corners. For which `x` is the volume 144 cm³?", options:[
          { t:"`x = 2` cm", ok:true, why:"`x^3 - 13x^2 + 40x - 36 = (x - 2)^2(x - 9) = 0`, and `x = 9` would make `10 - 2x` negative." },
          { t:"`x = 2` cm or `x = 9` cm", why:M5(9, "10 - 2x") },
          { t:"`x = 9` cm", why:M5(9, "10 - 2x") },
          { t:"`x = 4` cm", why:"`V(4) = 4 × 2 × 8 = 64`." }] },
        b:{ prompt:"An open box is made from a 12 cm × 12 cm sheet by cutting squares of side `x` cm from the corners. For which `x` is the volume 128 cm³?", options:[
          { t:"`x = 2` cm", ok:true, why:"`x^3 - 12x^2 + 36x - 32 = (x - 2)^2(x - 8) = 0`, and `x = 8` would make `12 - 2x` negative." },
          { t:"`x = 2` cm or `x = 8` cm", why:M5(8, "12 - 2x") },
          { t:"`x = 8` cm", why:M5(8, "12 - 2x") },
          { t:"`x = 4` cm", why:"`V(4) = 4 × 4 × 4 = 64`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Three consecutive integers have a product of 210. What is the smallest?", options:[
          { t:"5", ok:true, why:"`n(n + 1)(n + 2) = 210` gives `(n - 5)(n^2 + 8n + 42) = 0`; the quadratic has no real roots. 5 × 6 × 7 = 210." },
          { t:"6", why:"That’s the middle one." },
          { t:"7", why:"That’s the largest." },
          { t:"5 or −7", why:"(−7)(−6)(−5) = −210, not 210." }] },
        b:{ prompt:"Three consecutive even integers have a product of 480. What is the smallest?", options:[
          { t:"6", ok:true, why:"`n(n + 2)(n + 4) = 480` gives `(n - 6)(n^2 + 12n + 80) = 0`. 6 × 8 × 10 = 480." },
          { t:"8", why:"That’s the middle one." },
          { t:"10", why:"That’s the largest." },
          { t:"6 or −10", why:"(−10)(−8)(−6) = −480." }] } }
    ]
  },
  task:{
    title:"Touch on the left", summary:"Touch on the left",
    statement:"<p>Design a cubic equation `x^3 + bx^2 + cx + d = 0` that meets every condition. Can you find all the answers?</p><ol class=\"tl-conds\"><li>`x = 2` is a root.</li><li>It has exactly two different real roots.</li><li>Its constant term is negative.</li><li>Its graph touches the `x`-axis at a negative `x`-value.</li></ol><p class=\"tiny muted\">Choose whole numbers from −20 to 20 for `b`, `c` and `d`. The graph shows `y = x^3 + bx^2 + cx + d` with its real roots and their orders.</p>",
    checks:["`x = 2` is a root", "Exactly two different real roots", "Constant term negative", "Touches at a negative `x`"],
    tips:["Substitute `x = 2`: you need `8 + 4b + 2c + d = 0`.", "A cubic with exactly two different real roots must have a double root.", "`d = -(2)(r)(r)` if the double root is `r`.", "Touching means a double root; put it left of the `y`-axis."],
    explainPrompt:"Explain why the answers must have the form `(x - 2)(x - r)^2` and how you chose `r`.",
    vocab:"Use the words root, order, double root and constant term.",
    after3:"`(x + 4)^2` would make the constant term −32, outside the range. The double root sets the constant: `d = -2r^2`."
  },
  cards:[
    ["Zero product property", "If `AB = 0`, then `A = 0` or `B = 0`. Only for products equal to <strong>0</strong>."],
    ["First step", "Get 0 on one side."],
    ["Never divide by `x`", "It loses the root `x = 0`. Factor `x` out instead."],
    ["Strategy order", "Common factor → grouping → quadratic form → factor theorem → quadratic."],
    ["Quadratic form", "`x^4 - 13x^2 + 36 = 0`: let `u = x^2`, solve, then `x = ±√u`."],
    ["Roots and `x`-intercepts", "The real roots of `P(x) = 0` are the `x`-intercepts of `y = P(x)`."],
    ["Repeated root", "One root, one intercept: the graph touches (even order) or flattens (order 3)."],
    ["`x^2 + 4 = 0`", "No real roots, so no `x`-intercepts."],
    ["Fewer roots than the degree", "A degree-`n` equation has <strong>at most</strong> `n` real roots."],
    ["Context", "Reject roots that make a length, time or count impossible."],
    ["Box from a sheet", "`V = x(L - 2x)(W - 2x)`, with 0 < `x` < `W`/2."],
    ["Checking a root", "Substitute it into the <strong>original</strong> equation: both sides should match."]
  ]
};
