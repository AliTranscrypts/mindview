// MHF4U 12 Factor Theorem and Sum/Difference of Cubes. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/12-factor-theorem-and-sum-difference-of-cubes.md
const M1 = "`P(3) = 0` means `x - 3` is a factor: the factor is zero at `x = 3`.";
const M4 = "Fully factored means every factor is linear or can’t be factored further.";
const M5 = "`a^3 + b^3 = (a + b)(a^2 - ab + b^2)`: same sign, opposite sign, always plus.";
const M7 = "Taking out −9 from `-9x + 18` leaves `(x - 2)`, not `(x + 2)`. Check by expanding.";
const SQCUBE = "Check the powers: squares need even powers, cubes need multiples of 3.";
const GRP_IN_FT = "That works, but grouping is faster here: look for a shared bracket.";
const FT_IN_GRP = "Try it: the brackets don’t match.";

export default {
  id:"12-factor-theorem-and-sum-difference-of-cubes",
  kind:"topic",
  title:"Factor theorem and sum/difference of cubes",
  topic:"Factor Theorem and Sum/Difference of Cubes",
  readyTopic:"the factor theorem",
  hero:{
    eq:"`P(b) = 0` ⟺ `(x - b)` is a factor", eqLabel:"P of b equals 0 if and only if x minus b is a factor", eqSize:"sm",
    headline:"A remainder of zero means a factor",
    text:"In module 11, dividing `P(x)` by `x - b` left the remainder `P(b)`. When that remainder is 0, `x - b` divides in exactly: it’s a <strong>factor</strong>, and `b` is a zero. The <strong>integral and rational zero theorems</strong> tell you which values are worth testing. Some polynomials also factor by patterns: <strong>grouping</strong> and the <strong>sum or difference of cubes</strong>.",
    fig:{ html:'<canvas class="plot" id="hero-plot" role="img" aria-label="Graph of P of x equals x cubed minus 2 x squared minus 5 x plus 6. Candidate tiles plus or minus 1, 2, 3 and 6 sit under it; the tiles 1, negative 2 and 3 light up as dots land on the x-intercepts, and the caption builds (x − 1)(x + 2)(x − 3)."></canvas><div class="hero-tiles" id="hero-tiles" aria-hidden="true"></div>' }
  },
  goals:[
    "I can use the factor theorem to decide whether `x - b` or `ax - b` is a factor.",
    "I can list the possible rational zeros with the integral and rational zero theorems, and choose good test values.",
    "I can factor a polynomial of degree 3 or 4 fully by finding a factor and dividing it out.",
    "I can factor by grouping.",
    "I can factor a sum or difference of cubes and explain why its quadratic factor doesn’t factor further.",
    "I can use the factor theorem to find an unknown coefficient."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Remainder theorem", goal:1,
          prompt:"What is the remainder when `x^3 - 3x + 4` is divided by `x - 2`?",
          options:[
            { t:"6", ok:true, why:"`P(2) = 8 - 6 + 4 = 6`." },
            { t:"2", why:"Dividing by `x - 2` uses the zero 2: `P(2)`, not `P(-2) = -8 + 6 + 4 = 2`." },
            { t:"0", why:"The remainder is 0 only if `P(2) = 0`." },
            { t:"18", why:"`-3(2) = -6`, not +6." }],
          hints:["Remainder theorem: substitute the divisor’s zero.", "`x - 2 = 0` at `x = 2`.", "`P(2) = 6`."] },
        { id:"w2", skill:"Remainder theorem", goal:1,
          prompt:"`P(x) ÷ (x + 1)` has remainder 0. What does that tell you?",
          options:[
            { t:"`P(-1) = 0`", ok:true, why:"The divisor’s zero is −1." },
            { t:"`P(1) = 0`", why:"`x + 1 = 0` at `x = -1`." },
            { t:"`P(0) = -1`", why:"The `y`-intercept isn’t involved." },
            { t:"The quotient is 0", why:"The remainder is 0; the quotient is a polynomial." }],
          hints:["Remainder = `P`(divisor’s zero).", "The zero of `x + 1` is −1.", "`P(-1) = 0`."] },
        { id:"w3", skill:"Factoring quadratics", goal:3,
          prompt:"Factor `x^2 - x - 6`.",
          options:[
            { t:"`(x - 3)(x + 2)`", ok:true, why:"−3 × 2 = −6 and −3 + 2 = −1." },
            { t:"`(x + 3)(x - 2)`", why:"That expands to `x^2 + x - 6`." },
            { t:"`(x - 6)(x + 1)`", why:"−6 + 1 = −5." },
            { t:"`(x - 3)(x - 2)`", why:"That gives +6." }],
          hints:["Two numbers with product −6 and sum −1.", "−3 and 2.", "`(x - 3)(x + 2)`."] },
        { id:"w4", skill:"Factoring quadratics", goal:3,
          prompt:"Factor `2x^2 - x - 1`.",
          options:[
            { t:"`(2x + 1)(x - 1)`", ok:true, why:"`2x^2 - 2x + x - 1`." },
            { t:"`(2x - 1)(x + 1)`", why:"That gives `2x^2 + x - 1`." },
            { t:"`(2x + 1)(x + 1)`", why:"That gives +1." },
            { t:"`2(x - 1)(x + 1)`", why:"That gives `2x^2 - 2`." }],
          hints:["Try `(2x ± 1)(x ± 1)`.", "The middle term must be `-x`.", "`(2x + 1)(x - 1)`."] },
        { id:"w5", skill:"Special products", goal:5,
          prompt:"Which equals `x^2 - 9`?",
          options:[
            { t:"`(x - 3)(x + 3)`", ok:true, why:"Difference of squares." },
            { t:"`(x - 3)^2`", why:"`(x - 3)^2 = x^2 - 6x + 9`." },
            { t:"`(x - 9)(x + 1)`", why:"That gives `x^2 - 8x - 9`." },
            { t:"It can’t be factored.", why:"Only a <strong>sum</strong> of squares can’t be factored over the reals." }],
          hints:["Is it a difference of two squares?", "`x^2 - 3^2`.", "`(x - 3)(x + 3)`."] },
        { id:"w6", skill:"Special products", goal:5,
          prompt:"Which is `2x` cubed?",
          options:[
            { t:"`8x^3`", ok:true, why:"`(2x)^3 = 2^3x^3`." },
            { t:"`2x^3`", why:"The 2 is cubed too." },
            { t:"`6x^3`", why:"2³ = 8." },
            { t:"`8x`", why:"`x` is cubed too." }],
          hints:["Cube every factor.", "2³ and `x^3`.", "`8x^3`."] }
      ],
      refreshers:{
        "Remainder theorem":"Dividing `P(x)` by `x - b` leaves `P(b)`. For `x + 1` the zero is −1.",
        "Factoring quadratics":"For `x^2 + bx + c`, find two numbers with product `c` and sum `b`. For `2x^2` …, try the factor pairs of the first and last terms and check the middle term.",
        "Special products":"`a^2 - b^2 = (a - b)(a + b)`; `(2x)^3 = 8x^3`."
      }
    }
  },
  explore:{
    heading:"Root hunter",
    intro:"Tap a candidate to test it. A hit lands on the graph as an `x`-intercept, and its factor is divided out. Hunt down every factor.",
    predIntro:"Make a prediction first. Then the root hunter will show you what really happens.",
    predictions:[
      { id:"p1", start:{ pid:"p1", mode:"int" },
        prompt:"Which of these can’t be a zero of `x^3 - 2x^2 - 5x + 6`?",
        options:[{ t:"1" }, { t:"−2" }, { t:"3" }, { t:"4", ok:true }],
        explain:"If `b` is an integer zero, `P(b) = 0` forces `b` to divide the constant 6. 4 doesn’t.",
        ghost:{ n:4, note:"4 doesn’t divide 6" } },
      { id:"p2", start:{ pid:"p1", mode:"int", hits:[[1, 1]] },
        prompt:"The quotient is `x^2 - x - 6`. How many more zeros will the hunter find?",
        options:[{ t:"2", ok:true }, { t:"1" }, { t:"3" }, { t:"0" }],
        explain:"`x^2 - x - 6 = (x + 2)(x - 3)`." },
      { id:"p3", start:{ pid:"p3", mode:"int" },
        prompt:"The hunter can only test ±1 and ±2. Will it find all three zeros of `2x^3 - 3x^2 - 3x + 2`?",
        options:[{ t:"No", ok:true }, { t:"Yes" }, { t:"It will find none" }, { t:"It needs ±3 too" }],
        explain:"With leading coefficient 2, a zero can be a fraction `p/2`. `(2x - 1)` is a factor: `P(1/2) = 0`." },
      { id:"p4", start:{ pid:"p4", mode:"int" },
        prompt:"After the hit at 3, the quotient is `x^2 - 2`. No candidate (±1, ±2) works. What does that mean?",
        options:[{ t:"The other zeros are irrational: `±√2`", ok:true }, { t:"There are no more zeros" }, { t:"The polynomial was entered wrongly" }, { t:"3 is a double zero" }],
        explain:"The candidate lists only rational zeros. `x^2 - 2 = 0` gives `x = ±√2`." }
    ],
    chalIntro:"Each challenge has its own polynomial chip in the hunter. Hunt, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Fully factor `P_1`.",
        why:"`x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)`.",
        msgs:{ m4:"Not fully factored: the quadratic factors.", pick:"Choose `P_1` on the polynomial chips first.", more:"Keep hunting: the tray must hold every factor of `P_1`." },
        hints:["Test the small candidates first.", "`P(1) = 0`. Divide out `(x - 1)`.", "`x^2 - x - 6 = (x + 2)(x - 3)`."] },
      { id:"tc2", goal:[6, 3], prompt:"Set `k` so that `(x - 2)` is a factor of `x^3 + kx^2 - 4x + 12`, then factor it fully.",
        why:"`k = -3`: `x^3 - 3x^2 - 4x + 12 = (x - 2)(x + 2)(x - 3)`.",
        msgs:{ k:"`P(2) = 8 + 4k - 8 + 12 = 4k + 12`. Solve `4k + 12 = 0`.", m4:"Factor the quadratic.", pick:"Choose the Challenge 2 chip, `x^3 + kx^2 - 4x + 12`, first.", more:"`k` is right. Now hunt: the tray must hold every factor." },
        hints:["`(x - 2)` is a factor exactly when `P(2) = 0`.", "`4k + 12 = 0`.", "`k = -3`: `x^3 - 3x^2 - 4x + 12 = (x - 2)(x + 2)(x - 3)`."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Fully factor `x^4 + 2x^3 - 7x^2 - 8x + 12` using <strong>at most 5 tests</strong>.",
        why:"`x^4 + 2x^3 - 7x^2 - 8x + 12 = (x - 1)(x - 2)(x + 2)(x + 3)`.",
        msgs:{ tests:"You got there, but in {n} tests. Test small values first, and factor the quadratic as soon as you reach one.", pick:"Choose the Challenge 3 chip, `x^4 + 2x^3 - 7x^2 - 8x + 12`, first.", more:"Keep going: the tray must hold four linear factors." },
        hints:["Test ±1 first: they’re quick to compute.", "`P(1) = 1 + 2 - 7 - 8 + 12 = 0`. The quotient is `x^3 + 3x^2 - 4x - 12`: try grouping or test 2.", "`x^3 + 3x^2 - 4x - 12 = (x + 3)(x^2 - 4)`: two tests are enough."] }
    ],
    demo:"The prediction’s replay did this hunt. Press <strong>Start over</strong> and hunt the factors yourself."
  },
  part3:{
    slug:"cubes", name:"Cubes",
    heading:"Cube patterns and grouping",
    intro:"Two stations. A volume model shows where the cube pattern comes from, and grouping tiles make the shared bracket visible.",
    model:{
      title:"Station 1: the volume model",
      how:"Step through the model. Move the sliders to see the numbers.",
      steps:[
        "A big cube of side `a` (volume `a^3`) with a small cube of side `b` cut from one corner.",
        "The remaining solid splits into three boxes, each with one edge `(a - b)`: `a × a × (a - b)`, `a × b × (a - b)` and `b × b × (a - b)`.",
        "The boxes slide apart and their volumes add: `(a - b)(a^2 + ab + b^2)`."
      ],
      alg:"<summary>Check it with algebra</summary><div class=\"alg-lines\"><span>`(a - b)(a^2 + ab + b^2)`</span><span>`= a^3 + a^2b + ab^2 - a^2b - ab^2 - b^3`</span><span><small>The `a^2b` and `ab^2` terms cancel.</small></span><span>`= a^3 - b^3`</span><span style=\"margin-top:8px\">`(a + b)(a^2 - ab + b^2)`</span><span>`= a^3 - a^2b + ab^2 + a^2b - ab^2 + b^3`</span><span><small>The same two terms cancel.</small></span><span>`= a^3 + b^3`</span></div>",
      hook:"<strong>Memory hook:</strong> “Same sign, Opposite sign, Always plus” for the three signs in the factors: `a^3 - b^3 = (a - b)(a^2 + ab + b^2)` and `a^3 + b^3 = (a + b)(a^2 - ab + b^2)`."
    },
    grouping:{
      title:"Station 2: grouping tiles",
      how:"Tap two tiles to make the first pair. The other two tiles make the second pair.",
      examples:[
        { label:"`x^3 + 3x^2 - 4x - 12`", terms:[[1, 3], [3, 2], [-4, 1], [-12, 0]], full:"`(x + 3)(x - 2)(x + 2)`",
          win:"The shared bracket comes out, and `x^2 - 4` splits again as a difference of squares.",
          miss:"These brackets don’t match. Pair the tiles another way." },
        { label:"`x^3 + 2x^2 + 3x + 4`", terms:[[1, 3], [2, 2], [3, 1], [4, 0]],
          miss:"The brackets don’t match, so grouping doesn’t work here; use the factor theorem." }
      ],
      take:"Take out each pair’s common factor", merge:"Merge the shared bracket", again:"Pair again",
      glow:"The shared bracket glows: both groups contain it."
    },
    quickCheck:{
      title:"Cube patterns quick check", summary:"Cube patterns quick check",
      items:[
        { id:"q1", goal:5, prompt:"`x^3 - 64 =`",
          choices:[{ t:"`(x - 4)(x^2 + 4x + 16)`", ok:true, fb:"Right. Same, Opposite, Always plus: `(x - 4)(x^2 + 4x + 16)`." }, { t:"`(x - 4)(x^2 - 4x + 16)`", fb:"Same, Opposite, Always plus: `(x - 4)(x^2 + 4x + 16)`." }, { t:"`(x - 4)^3`", fb:"Same, Opposite, Always plus: `(x - 4)(x^2 + 4x + 16)`." }, { t:"`(x - 8)(x^2 + 8)`", fb:"Same, Opposite, Always plus: `(x - 4)(x^2 + 4x + 16)`." }] },
        { id:"q2", goal:5, prompt:"`27x^3 + 1 =`",
          choices:[{ t:"`(3x + 1)(9x^2 - 3x + 1)`", ok:true, fb:"Right. `a = 3x`, `b = 1`: `(a + b)(a^2 - ab + b^2)`." }, { t:"`(3x + 1)(9x^2 + 3x + 1)`", fb:"`a = 3x`, `b = 1`: `(a + b)(a^2 - ab + b^2)`." }, { t:"`(3x + 1)^3`", fb:"`a = 3x`, `b = 1`: `(a + b)(a^2 - ab + b^2)`." }, { t:"`(27x + 1)(x^2 - x + 1)`", fb:"`a = 3x`, `b = 1`: `(a + b)(a^2 - ab + b^2)`." }] },
        { id:"q3", goal:5, prompt:"Does `x^2 + 4x + 16` factor over the real numbers?",
          choices:[{ t:"No", ok:true, fb:"Right. Its discriminant 16 − 64 = −48 is negative." }, { t:"Yes, `(x + 4)^2`", fb:"Its discriminant 16 − 64 = −48 is negative." }, { t:"Yes, `(x + 8)(x + 2)`", fb:"Its discriminant 16 − 64 = −48 is negative." }, { t:"Yes, `(x + 4)(x - 4)`", fb:"Its discriminant 16 − 64 = −48 is negative." }] },
        { id:"q4", goal:4, prompt:"`x^3 - 2x^2 - 9x + 18` by grouping =",
          choices:[{ t:"`(x - 2)(x - 3)(x + 3)`", ok:true, fb:"Right. `x^2(x - 2) - 9(x - 2) = (x - 2)(x^2 - 9)`." }, { t:"`(x - 2)(x^2 + 9)`", fb:"`x^2(x - 2) - 9(x - 2) = (x - 2)(x^2 - 9)`." }, { t:"`(x + 2)(x - 3)(x + 3)`", fb:"`x^2(x - 2) - 9(x - 2) = (x - 2)(x^2 - 9)`." }, { t:"`(x - 2)(x - 9)`", fb:"`x^2(x - 2) - 9(x - 2) = (x - 2)(x^2 - 9)`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"method", type:"sorter", title:"Which method first?", summary:"Which method first?", goal:[3, 4, 5],
        instruction:"Sort each polynomial by the best first method.", noun:"polynomial",
        boxes:[{ id:"b1", label:"Difference of squares" }, { id:"b2", label:"Sum or difference of cubes" }, { id:"b3", label:"Grouping" }, { id:"b4", label:"Factor theorem", sub:"(no pattern fits)" }],
        items:[
          { id:"i1", t:"`x^3 - 27`", answer:"b2", goal:5, why:"`x^3 - 3^3`.", wrong:{ b1:SQCUBE } },
          { id:"i2", t:"`8x^3 + 1`", answer:"b2", goal:5, why:"`(2x)^3 + 1^3`.", wrong:{ b1:SQCUBE },
            hints:["Is each term a perfect cube?", "`8x^3 = (2x)^3`, `1 = 1^3`.", "Sum of cubes."] },
          { id:"i3", t:"`27x^3 - 64`", answer:"b2", goal:5, why:"`(3x)^3 - 4^3`.", wrong:{ b1:SQCUBE } },
          { id:"i4", t:"`x^3 + 2x^2 - 9x - 18`", answer:"b3", goal:4, why:"`x^2(x + 2) - 9(x + 2)`.", wrong:{ b4:GRP_IN_FT } },
          { id:"i5", t:"`x^3 - 5x^2 - 4x + 20`", answer:"b3", goal:4, why:"`x^2(x - 5) - 4(x - 5)`.", wrong:{ b4:GRP_IN_FT } },
          { id:"i6", t:"`x^4 - 16`", answer:"b1", goal:3, why:"`(x^2)^2 - 4^2`.", wrong:{ b2:SQCUBE } },
          { id:"i7", t:"`9x^2 - 25`", answer:"b1", goal:3, why:"`(3x)^2 - 5^2`.", wrong:{ b2:SQCUBE } },
          { id:"i8", t:"`2x^3 - 3x^2 - 3x + 2`", answer:"b4", goal:3, why:"No pattern; `P(2) = 0`.", wrong:{ b3:FT_IN_GRP } },
          { id:"i9", t:"`x^3 - 7x + 6`", answer:"b4", goal:3, why:"No pattern; `P(1) = 0`.", wrong:{ b3:FT_IN_GRP } },
          { id:"i10", t:"`x^3 + 4x^2 + x - 6`", answer:"b4", goal:3, why:"Grouping gives `x^2(x + 4) + (x - 6)`: no shared bracket. `P(1) = 0`.", wrong:{ b3:FT_IN_GRP },
            hints:["Try grouping first.", "`x^2(x + 4) + 1(x - 6)`: the brackets differ.", "Use the factor theorem: `P(1) = 0`."] }
        ] },
      { id:"factor", type:"custom", title:"Fully factor", summary:"Fully factor", star:true, goal:[3, 5, 6],
        instruction:"Build the full factorization of each polynomial in the factor tray. Problems 3 to 6 are non-routine.",
        how:"Add linear factors `px + q` and set them with the steppers. Add a quadratic factor if you need one. <strong>Check</strong> expands your factors and compares.",
        items:[
          { id:"f1", goal:3, prompt:"`x^3 - 4x^2 + x + 6`", poly:[1, -4, 1, 6], answer:{ f:"`(x + 1)(x - 2)(x - 3)`" },
            wrong:[{ zeros:[1, -2, -3], fb:M1 }] },
          { id:"f2", goal:5, prompt:"`x^3 - 64`", poly:[1, 0, 0, -64], answer:{ f:"`(x - 4)(x^2 + 4x + 16)`" },
            wrong:[{ zeros:[4], quad:[1, -4, 16], fb:"Same sign, opposite sign, always plus: `a^3 - b^3 = (a - b)(a^2 + ab + b^2)`." }] },
          { id:"f3", goal:3, star:true, prompt:"`2x^3 + x^2 - 13x + 6`", poly:[2, 1, -13, 6], answer:{ f:"`(x - 2)(2x - 1)(x + 3)`" },
            wrong:[{ zeros:[2], quad:[2, 5, -3], fb:"`P(2) = 0`; the quotient `2x^2 + 5x - 3` factors too." }],
            hints:["Candidates ±1, ±2, ±3, ±6, ±1/2, ±3/2.", "`P(2) = 16 + 4 - 26 + 6 = 0`.", "`2x^2 + 5x - 3 = (2x - 1)(x + 3)`."] },
          { id:"f4", goal:5, star:true, prompt:"`x^4 - 81`", poly:[1, 0, 0, 0, -81], answer:{ f:"`(x - 3)(x + 3)(x^2 + 9)`" },
            wrong:[{ quad:[1, 0, -9], fb:"`x^2 - 9` factors again." }, { lin:4, fb:"A sum of squares doesn’t factor over the reals." }] },
          { id:"f5", goal:6, star:true, prompt:"Find `k` so that `x + 2` is a factor of `2x^3 + kx^2 - 13x - 6`, then factor fully.", poly:[2, 0, -13, -6], kAt:1, answer:{ k:-1, f:"`k = -1`; `(x + 2)(x - 3)(2x + 1)`" },
            kWrong:[{ k:1, fb:"`P(-2) = -16 + 4k + 26 - 6 = 4k + 4`." }], kGeneral:"`x + 2` is a factor exactly when `P(-2) = 0`." },
          { id:"f6", goal:5, star:true, prompt:"`(x + 1)^3 - 8`", poly:[1, 3, 3, -7], answer:{ f:"`(x - 1)(x^2 + 4x + 7)`" },
            general:"Let `a = x + 1` and `b = 2`: `(a - b)(a^2 + ab + b^2) = (x - 1)((x + 1)^2 + 2(x + 1) + 4)`.",
            hints:["Treat `x + 1` as one quantity `a`.", "`a^3 - 2^3 = (a - 2)(a^2 + 2a + 4)`.", "`(x - 1)(x^2 + 2x + 1 + 2x + 2 + 4) = (x - 1)(x^2 + 4x + 7)`."] }
        ],
        m4:M4 },
      { id:"spot", type:"spot", title:"Spot the error", student:"Amara", how:"",
        instruction:"Amara made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Is `x + 3` a factor of `P(x) = x^3 - 2x^2 - 5x + 6`?",
            steps:["Test `x = 3`: `P(3) = 27 - 18 - 15 + 6 = 0`.", "So `x + 3` is a factor."],
            answer:0,
            stepFb:["", "Step 2 follows step 1’s choice. The mistake is earlier."],
            fixes:[
              { t:"Test `x = -3`, the zero of `x + 3`: `P(-3) = -27 - 18 + 15 + 6 = -24 ≠ 0`, so `x + 3` is <strong>not</strong> a factor (`x - 3` is).", ok:true, why:M1 },
              { t:"`P(3) = 0`, so `x - 3` and `x + 3` are both factors.", why:"Each factor needs its own test." },
              { t:"Test `x = 0`: `P(0) = 6`.", why:"`x = 0` tests the factor `x`." },
              { t:"Step 1 is correct.", why:"`P(3) = 0` tells you about `x - 3`, not `x + 3`." }],
            hints:["Which `x` makes `x + 3 = 0`?", "−3.", "`P(-3) = -24`: not a factor."] },
          { id:"e2", goal:5, task:"Factor `8x^3 + 27`.",
            steps:["`8x^3 = (2x)^3` and 27 = 3³.", "`a^3 + b^3 = (a + b)(a^2 + ab + b^2)`.", "So `8x^3 + 27 = (2x + 3)(4x^2 + 6x + 9)`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 uses step 2’s pattern. The mistake is earlier."],
            fixes:[
              { t:"`a^3 + b^3 = (a + b)(a^2 - ab + b^2)`, so `(2x + 3)(4x^2 - 6x + 9)`.", ok:true, why:M5 },
              { t:"`(2x + 3)^3`.", why:"`(2x + 3)^3` has extra terms." },
              { t:"`(2x - 3)(4x^2 + 6x + 9)`.", why:"That’s the difference pattern." },
              { t:"Step 2 is correct.", why:"Expand `(a + b)(a^2 + ab + b^2)`: it gives `a^3 + 2a^2b + 2ab^2 + b^3`." }],
            hints:["Check the pattern by expanding.", "Same, Opposite, Always plus.", "`(2x + 3)(4x^2 - 6x + 9)`."] },
          { id:"e3", goal:4, task:"Factor `x^3 - 2x^2 - 9x + 18`.",
            steps:["`(x^3 - 2x^2) + (-9x + 18)`.", "`x^2(x - 2) - 9(x + 2)`.", "The brackets differ, so grouping fails."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows from step 2. The mistake is earlier."],
            fixes:[
              { t:"`-9x + 18 = -9(x - 2)`, so `(x - 2)(x^2 - 9) = (x - 2)(x - 3)(x + 3)`.", ok:true, why:M7 },
              { t:"`-9(x - 18)`.", why:"−9 × −18 = 162." },
              { t:"`9(x - 2)`.", why:"`9(x - 2) = 9x - 18`: the sign of `-9x` is lost." },
              { t:"Step 2 is correct.", why:"Expand `-9(x + 2)`: `-9x - 18`, not `-9x + 18`." }],
            hints:["Expand step 2’s second group.", "It should give `-9x + 18`.", "`-9(x - 2)`: the brackets match."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the root hunter: how short the candidate list is, or the irrational zeros?" },
      { id:"j2", q:"In your own words, why is `x - b` a factor exactly when `P(b) = 0`?" },
      { id:"j3", q:"Explain to a friend how the volume model shows `a^3 - b^3 = (a - b)(a^2 + ab + b^2)`." },
      { id:"j4", q:"Which factoring method do you reach for last? What will remind you to try it earlier?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a factor of `P(x) = x^3 - 4x^2 + x + 6`?", options:[
          { t:"`x + 1`", ok:true, why:"`P(-1) = -1 - 4 - 1 + 6 = 0`." },
          { t:"`x + 2`", why:"`P(2) = 0` makes `x - 2` a factor; `P(-2) = -20`." },
          { t:"`x - 1`", why:"`P(1) = 4`." },
          { t:"`x + 3`", why:"`P(3) = 0` makes `x - 3` a factor; `P(-3) = -60`." }] },
        b:{ prompt:"Which is a factor of `P(x) = x^3 - 2x^2 - 5x + 6`?", options:[
          { t:"`x + 2`", ok:true, why:"`P(-2) = -8 - 8 + 10 + 6 = 0`." },
          { t:"`x + 1`", why:"`P(1) = 0` makes `x - 1` a factor; `P(-1) = 8`." },
          { t:"`x - 2`", why:"`P(2) = -4`." },
          { t:"`x + 3`", why:"`P(3) = 0` makes `x - 3` a factor; `P(-3) = -24`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"By the rational zero theorem, which could be a zero of `3x^3 - 4x^2 + x - 2`?", options:[
          { t:"2/3", ok:true, why:"`p = 2` divides −2 and `q = 3` divides 3." },
          { t:"3/2", why:"Upside down: `q` must divide 3, the leading coefficient." },
          { t:"3", why:"3 doesn’t divide the constant −2." },
          { t:"4", why:"4 is a coefficient, not a divisor of −2." }] },
        b:{ prompt:"By the rational zero theorem, which could be a zero of `2x^3 + x^2 - 5x + 3`?", options:[
          { t:"3/2", ok:true, why:"`p = 3` divides 3 and `q = 2` divides 2." },
          { t:"2/3", why:"Upside down." },
          { t:"2", why:"2 doesn’t divide the constant 3." },
          { t:"5", why:"5 is a coefficient, not a divisor of 3." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Factor `x^3 - 125`.", options:[
          { t:"`(x - 5)(x^2 + 5x + 25)`", ok:true, why:"Same sign, Opposite sign, Always plus, with `a = x` and `b = 5`." },
          { t:"`(x - 5)(x^2 - 5x + 25)`", why:"Middle sign: opposite of the first factor’s sign, so +." },
          { t:"`(x - 5)^3`", why:"`(x - 5)^3` has extra terms." },
          { t:"`(x - 5)(x^2 + 25)`", why:"The `ab` term is missing." }] },
        b:{ prompt:"Factor `x^3 + 216`.", options:[
          { t:"`(x + 6)(x^2 - 6x + 36)`", ok:true, why:"Same sign, Opposite sign, Always plus, with `a = x` and `b = 6`." },
          { t:"`(x + 6)(x^2 + 6x + 36)`", why:"Middle sign: opposite of the first factor’s sign, so −." },
          { t:"`(x + 6)^3`", why:"`(x + 6)^3` has extra terms." },
          { t:"`(x + 6)(x^2 + 36)`", why:"The `ab` term is missing." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"For which `k` is `x - 2` a factor of `x^3 + kx^2 - 5x + 6`?", options:[
          { t:"−2", why:"That makes `P(-2) = 0`." },
          { t:"−1", ok:true, why:"`P(2) = 8 + 4k - 10 + 6 = 4k + 4 = 0`." },
          { t:"1/2", why:"That drops the constant 6: `8 + 4k - 10 = 0`." },
          { t:"1", why:"Sign slip: `4k + 4 = 0` gives `k = -1`." }] },
        b:{ prompt:"For which `k` is `x + 1` a factor of `2x^3 + kx^2 - x - 6`?", options:[
          { t:"−7", why:"Sign slip: `k - 7 = 0` gives `k = 7`." },
          { t:"1", why:"That drops the constant −6: `-2 + k + 1 = 0`." },
          { t:"5", why:"That makes `P(1) = 0`." },
          { t:"7", ok:true, why:"`P(-1) = -2 + k + 1 - 6 = k - 7 = 0`." }] } },
      { id:"t2", cat:"T", goal:[3, 4],
        a:{ prompt:"Fully factor `x^3 - 3x^2 - 4x + 12`.", options:[
          { t:"`(x - 3)(x - 2)(x + 2)`", ok:true, why:"`x^2(x - 3) - 4(x - 3) = (x - 3)(x^2 - 4)`." },
          { t:"`(x - 3)(x^2 - 4)`", why:"`x^2 - 4` factors further." },
          { t:"`(x + 3)(x - 2)(x + 2)`", why:"The shared bracket is `(x - 3)`." },
          { t:"`(x - 3)(x - 2)^2`", why:"`x^2 - 4` is `(x - 2)(x + 2)`, not `(x - 2)^2`." }] },
        b:{ prompt:"Fully factor `x^3 + 2x^2 - 25x - 50`.", options:[
          { t:"`(x + 2)(x - 5)(x + 5)`", ok:true, why:"`x^2(x + 2) - 25(x + 2) = (x + 2)(x^2 - 25)`." },
          { t:"`(x + 2)(x^2 - 25)`", why:"`x^2 - 25` factors further." },
          { t:"`(x - 2)(x - 5)(x + 5)`", why:"The shared bracket is `(x + 2)`." },
          { t:"`(x + 2)(x - 5)^2`", why:"`x^2 - 25` is `(x - 5)(x + 5)`." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`P(x) = 3x^3 + 4x^2 - 13x + 6` has `P(2/3) = 0`. Which is the full factorization?", options:[
          { t:"`(3x - 2)(x + 3)(x - 1)`", ok:true, why:"`(3x - 2)` is a factor; the quotient is `x^2 + 2x - 3 = (x + 3)(x - 1)`." },
          { t:"`(3x - 2)(x - 3)(x + 1)`", why:"Signs: `(x - 3)(x + 1) = x^2 - 2x - 3`, not `x^2 + 2x - 3`." },
          { t:"`(x - 2/3)(x + 3)(x - 1)`", why:"That’s `P(x) ÷ 3`: the leading coefficient 3 is lost." },
          { t:"`(3x - 2)(x^2 + 2x - 3)`", why:"The quadratic factors further." }] },
        b:{ prompt:"`P(x) = 2x^3 - 5x^2 - 4x + 3` has `P(1/2) = 0`. Which is the full factorization?", options:[
          { t:"`(2x - 1)(x - 3)(x + 1)`", ok:true, why:"Quotient `x^2 - 2x - 3 = (x - 3)(x + 1)`." },
          { t:"`(2x - 1)(x + 3)(x - 1)`", why:"Signs: that quadratic is `x^2 + 2x - 3`." },
          { t:"`(x - 1/2)(x - 3)(x + 1)`", why:"That’s `P(x) ÷ 2`." },
          { t:"`(2x - 1)(x^2 - 2x - 3)`", why:"The quadratic factors further." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is a correct statement of the factor theorem?", options:[
          { t:"`x - b` is a factor of `P(x)` if and only if `P(b) = 0`.", ok:true, why:"The factor `x - b` is zero at `x = b`, so dividing leaves the remainder `P(b)`, and a factor leaves remainder 0." },
          { t:"`x - b` is a factor of `P(x)` if and only if `P(-b) = 0`.", why:"`x - b` is zero at `x = b`, not at `x = -b`." },
          { t:"`x - b` is a factor of `P(x)` if and only if `P(0) = b`.", why:"That’s about the `y`-intercept." },
          { t:"`x - b` is a factor of `P(x)` if and only if the remainder is `b`.", why:"A factor leaves remainder 0." }] },
        b:{ prompt:"Which is a correct statement of the factor theorem for `ax - b`?", options:[
          { t:"`ax - b` is a factor of `P(x)` if and only if `P(b/a) = 0`.", ok:true, why:"`ax - b = 0` at `x = b/a`." },
          { t:"`ax - b` is a factor of `P(x)` if and only if `P(a/b) = 0`.", why:"Upside down: `ax - b = 0` gives `x = b/a`." },
          { t:"`ax - b` is a factor of `P(x)` if and only if `P(-b/a) = 0`.", why:"Sign: `ax - b = 0` gives `x = b/a`, not `-b/a`." },
          { t:"`ax - b` is a factor of `P(x)` if and only if `P(b) = 0`.", why:"The zero of `ax - b` is `b/a`." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"`x^3 - 8 = (x - 2)(x^2 + 2x + 4)`. Which is the best explanation of why `x^2 + 2x + 4` doesn’t factor further?", options:[
          { t:"Its discriminant `2^2 - 4(1)(4) = -12` is negative, so it has no real zeros and no real linear factors.", ok:true, why:"No real zeros means no real linear factors." },
          { t:"Because it has a plus sign in the middle.", why:"`x^2 + 5x + 4` has a plus sign and factors." },
          { t:"Because it’s a perfect square.", why:"`(x + 2)^2 = x^2 + 4x + 4`, not `x^2 + 2x + 4`." },
          { t:"Because 4 is a perfect square.", why:"That has nothing to do with factoring." }] },
        b:{ prompt:"`8x^3 + 27 = (2x + 3)(4x^2 - 6x + 9)`. Which is the best explanation of why it is fully factored?", options:[
          { t:"`4x^2 - 6x + 9` has discriminant 36 − 144 = −108 < 0, so it has no real zeros and can’t split into real linear factors.", ok:true, why:"No real zeros means no real linear factors." },
          { t:"Because 9 is a perfect square.", why:"Irrelevant." },
          { t:"Because `4x^2 - 6x + 9 = (2x - 3)^2`.", why:"`(2x - 3)^2 = 4x^2 - 12x + 9`." },
          { t:"Because every cube factorization stops at two factors.", why:"`x^3 - x = x(x - 1)(x + 1)` has three." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A box has volume `V(x) = x^3 + 2x^2 - 5x - 6` cm³, and its edges are linear expressions in `x`. One edge is `x + 1`. What are the box’s dimensions when `x = 5`?", options:[
          { t:"6 cm, 3 cm and 8 cm", ok:true, why:"`V = (x + 1)(x^2 + x - 6) = (x + 1)(x - 2)(x + 3)`. At `x = 5`: 6, 3, 8 (and 6 × 3 × 8 = 144 = `V(5)`)." },
          { t:"6 cm, 7 cm and 2 cm", why:"That uses `(x + 2)(x - 3)`: signs flipped. 6 × 7 × 2 = 84 ≠ 144." },
          { t:"6 cm, 4 cm and 11 cm", why:"`(x - 1)(x + 6) = x^2 + 5x - 6`, not `x^2 + x - 6`." },
          { t:"6 cm, 6 cm and −1 cm", why:"A length can’t be negative; `(x + 1)(x - 6)` is the wrong quotient." }] },
        b:{ prompt:"A box has volume `V(x) = x^3 - x^2 - 10x - 8` cm³. One edge is `x + 1`. What are the box’s dimensions when `x = 6`?", options:[
          { t:"7 cm, 2 cm and 8 cm", ok:true, why:"`V = (x + 1)(x - 4)(x + 2)`. At `x = 6`: 7, 2, 8 (7 × 2 × 8 = 112 = `V(6)`)." },
          { t:"7 cm, 10 cm and 4 cm", why:"`(x + 4)(x - 2)` has the signs flipped." },
          { t:"7 cm, 5 cm and 14 cm", why:"`(x - 1)(x + 8)` is the wrong quotient." },
          { t:"7 cm, 7 cm and −2 cm", why:"A length can’t be negative." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A cube of side `x` cm has a cube of side 2 cm cut from a corner, leaving `x^3 - 8` cm³. Which factored form is correct, and what is the volume when `x = 5`?", options:[
          { t:"`(x - 2)(x^2 + 2x + 4)`; 117 cm³", ok:true, why:"3 × 39 = 117 = 125 − 8." },
          { t:"`(x - 2)(x^2 - 2x + 4)`; 57 cm³", why:"Wrong middle sign: 3 × 19." },
          { t:"`(x - 2)^3`; 27 cm³", why:"`(x - 2)^3` has extra terms: 3³ = 27, not 125 − 8." },
          { t:"`(x - 2)(x^2 + 4)`; 87 cm³", why:"The `ab` term is missing: 3 × 29." }] },
        b:{ prompt:"A cube of side `x` cm has a cube of side 3 cm cut from a corner, leaving `x^3 - 27` cm³. Which factored form is correct, and what is the volume when `x = 7`?", options:[
          { t:"`(x - 3)(x^2 + 3x + 9)`; 316 cm³", ok:true, why:"4 × 79 = 316 = 343 − 27." },
          { t:"`(x - 3)(x^2 - 3x + 9)`; 148 cm³", why:"Wrong middle sign: 4 × 37." },
          { t:"`(x - 3)^3`; 64 cm³", why:"`(x - 3)^3` has extra terms: 4³ = 64, not 343 − 27." },
          { t:"`(x - 3)(x^2 + 9)`; 232 cm³", why:"The `ab` term is missing: 4 × 58." }] } }
    ]
  },
  task:{
    title:"Hide a rational zero", summary:"Hide a rational zero",
    statement:"<p>Design a cubic whose integer zeros the integral zero theorem would find, but which also hides one zero that only the rational zero theorem catches. There are many answers. Can you find more than one?</p><p class=\"tiny muted\">Choose the leading coefficient `a` and three zeros, each written `p/q` (`p` from −6 to 6, `q` = 1, 2 or 3). The tool expands `P(x) = a(x - r_1)(x - r_2)(x - r_3)` and shows it with the root hunter’s board.</p>",
    checks:["Leading coefficient 2", "Constant term −6", "Every coefficient is an integer", "Three different zeros, exactly one not an integer"],
    tips:["Use `a = 2`.", "The constant term is `-2 × r_1 × r_2 × r_3`; you need `r_1r_2r_3 = 3`.", "With `a = 2`, a fraction zero must have denominator 2, so that `2(x - p/2) = 2x - p`.", "You need two integer zeros and one fraction."],
    explainPrompt:"Explain how the rational zero theorem would find your hidden zero from the constant term and the leading coefficient.",
    vocab:"Use the words factor, constant term, leading coefficient and rational zero.",
    after3:"In every answer, the hidden zero ±1/2 or ±3/2 is `p/q` with `p` dividing 6 and `q` dividing 2, exactly as the rational zero theorem predicts."
  },
  cards:[
    ["The factor theorem", "`x - b` is a factor of `P(x)` ⟺ `P(b) = 0`. For `ax - b`: `P(b/a) = 0`."],
    ["Integral zero theorem", "An integer zero divides the constant term."],
    ["Rational zero theorem", "A rational zero `p/q` (lowest terms): `p` divides the constant term, `q` divides the leading coefficient."],
    ["Candidates for `2x^3 - 3x^2 - 3x + 2`", "±1, ±2, ±1/2."],
    ["After a hit", "Divide out the factor (synthetic division) and keep going on the quotient."],
    ["Difference of cubes", "`a^3 - b^3 = (a - b)(a^2 + ab + b^2)`."],
    ["Sum of cubes", "`a^3 + b^3 = (a + b)(a^2 - ab + b^2)`."],
    ["Signs in the cube patterns", "Same, Opposite, Always plus."],
    ["Does `a^2 ± ab + b^2` factor?", "No (over the reals): its discriminant is `-3b^2 < 0`."],
    ["Grouping", "`x^3 + 3x^2 - 4x - 12 = x^2(x + 3) - 4(x + 3) = (x + 3)(x - 2)(x + 2)`."],
    ["No candidate works", "The remaining zeros are irrational or not real: `x^2 - 2` has `±√2`."],
    ["Fully factored", "Every factor is linear or a quadratic that can’t be factored over the reals."]
  ]
};
