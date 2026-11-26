// MCV4U 14 Higher Order Derivatives. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/14-higher-order-derivatives.md
// Leibniz notation built by hand so the d stays upright (as in MCV4U 07/10/11)
const DY = '<span class="m">d<i>y</i>/d<i>x</i></span>';
const D2Y = '<span class="m">d<sup>2</sup><i>y</i>/d<i>x</i><sup>2</sup></span>';
const DYSQ = '<span class="m">(d<i>y</i>/d<i>x</i>)<sup>2</sup></span>';
const DY2X = '<span class="m">d<i>y</i><sup>2</sup>/d<i>x</i></span>';
const DY2X2 = '<span class="m">d<i>y</i><sup>2</sup>/d<i>x</i><sup>2</sup></span>';
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3); M4 is written with the item's own numbers
const M1 = "`f″` means differentiate `f′` again, not square it.";
const M2 = "The 2s in " + D2Y + " count derivatives; nothing is squared.";
const M3 = "`f″` asks whether the <strong>slopes</strong> are rising, not whether the graph is high or rising.";
const M4 = (a, b, c) => "`(" + a + ")(" + b + ") = +" + c + "`: two negatives multiply to a positive.";
const M6 = "That’s `f′`. Differentiate once more.";
// hero equation: f in --pen, f′ in teal --f3, f″ in magenta --f4, higher rungs in ink
const HERO_EQ = '<span class="hd-heq">' + [
  ["hd-k0", "`f(x) = x^4`"], ["hd-k1", "`f′(x) = 4x^3`"], ["hd-k2", "`f″(x) = 12x^2`"],
  ["", "`f‴(x) = 24x`"], ["", "`f^{(4)}(x) = 24`"], ["", "`0`"]
].map(p => '<span class="hd-ht' + (p[0] ? " " + p[0] : "") + '">' + p[1] + "</span>").join('<span class="hd-arr" aria-hidden="true">→</span>') + "</span>";

export default {
  id:"14-higher-order-derivatives",
  kind:"topic",
  title:"Higher order derivatives",
  topic:"Higher Order Derivatives",
  readyTopic:"higher order derivatives",
  hero:{
    eq:HERO_EQ,
    eqLabel:"f of x equals x to the fourth; f prime equals 4 x cubed; f double prime equals 12 x squared; f triple prime equals 24 x; the fourth derivative equals 24; then 0",
    eqSize:"sm",
    headline:"The slope of the slope",
    text:"Differentiate a function and you get its slope. Differentiate again and you get the <strong>second derivative</strong>, `f″(x)` or " + D2Y + ": how fast the slope itself is changing. For a polynomial, each step lowers the degree, until the <strong>higher order derivatives</strong> reach 0.",
    fig:{ html:'<div class="hd-hero"><canvas class="plot hd-h0" id="hero-plot" role="img" aria-label="Top panel: the cubic y = x³ − 3x with a probe line."></canvas>' +
      '<canvas class="plot hd-h1" id="hero-d1" role="img" aria-label="Middle panel: the slopes of the cubic, f′(x) = 3x² − 3, drawn as a teal trail."></canvas>' +
      '<canvas class="plot hd-h1" id="hero-d2" role="img" aria-label="Bottom panel: the change in slope, f″(x) = 6x, drawn as a magenta trail."></canvas></div>' }
  },
  goals:[
    "I can find second and higher derivatives of polynomials, and write them in correct notation.",
    "I can find the second derivative of simple rational and radical functions.",
    "I can explain `f″` as the rate of change of the slope, and read its sign from a graph.",
    "I can sketch the graphs of `f′` and `f″` from the graph of `f`.",
    "I can use patterns in higher derivatives (the degree drops; the `n`th derivative of `x^n` is `n!`)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Power rule", goal:1, prompt:"Differentiate `2x^4 - 3x^2 + 5`.",
          options:[
            { t:"`8x^3 - 6x`", ok:true, why:"Term by term; the constant gives 0." },
            { t:"`8x^3 - 6x + 5`", why:"A constant’s derivative is 0." },
            { t:"`2x^3 - 3x`", why:"Bring the exponent down." },
            { t:"`8x^4 - 6x^2`", why:"Subtract 1 from each exponent." }],
          hints:["`nx^{n-1}` for each term.", "`2 · 4x^3` and `-3 · 2x`.", "`8x^3 - 6x`."] },
        { id:"w2", skill:"Power rule", goal:1, prompt:"Differentiate `6x^3 - x`.",
          options:[
            { t:"`18x^2 - 1`", ok:true, why:"`6 · 3x^2 - 1`." },
            { t:"`18x^2`", why:"`-x` has derivative −1." },
            { t:"`6x^2 - 1`", why:"Bring down the exponent." },
            { t:"`18x^3 - 1`", why:"3 − 1 = 2." }],
          hints:["Term by term.", "`18x^2`, then −1.", "`18x^2 - 1`."] },
        { id:"w3", skill:"Negative exponents", goal:2, prompt:"Write `4/x^3` as a power of `x`.",
          options:[
            { t:"`4x^{-3}`", ok:true, why:"`1/x^3 = x^{-3}`." },
            { t:"`(4x)^{-3}`", why:"`(4x)^{-3} = 1/(64x^3)`." },
            { t:"`4x^3`", why:"`4/x^3` shrinks as `x` grows; `4x^3` doesn’t." },
            { t:"`-4x^3`", why:"A negative exponent means reciprocal." }],
          hints:["`1/x^n = x^{-n}`.", "`4 · x^{-3}`.", "`4x^{-3}`."] },
        { id:"w4", skill:"Negative exponents", goal:2, prompt:"Differentiate `x^{-2}`.",
          options:[
            { t:"`-2x^{-3}`", ok:true, why:"Bring down −2; −2 − 1 = −3." },
            { t:"`-2x^{-1}`", why:"−2 − 1 is −3, not −1." },
            { t:"`2x^{-3}`", why:"The −2 comes down." },
            { t:"`-x^{-3}`", why:"Bring the whole exponent down." }],
          hints:["`nx^{n-1}` with `n = -2`.", "`-2x^{-2 - 1}`.", "`-2x^{-3}`."] },
        { id:"w5", skill:"Reading slopes", goal:3, prompt:"On which part of `y = x^2` are the tangent slopes negative?",
          options:[
            { t:"Where `x < 0`", ok:true, why:"Left of the vertex the parabola falls." },
            { t:"Where `x > 0`", why:"Right of the vertex it rises." },
            { t:"Everywhere", why:"The graph rises for `x > 0`." },
            { t:"Nowhere, because `y >= 0`", why:"The graph is above the axis, but it can still be falling." }],
          hints:["Where does the graph fall?", "Left of the vertex.", "`x < 0`."] },
        { id:"w6", skill:"Reading slopes", goal:4, prompt:"What are the slopes of `y = x^3` at `x = -1`, 0 and 1?",
          options:[
            { t:"3, 0, 3", ok:true, why:"`3x^2` is never negative." },
            { t:"−3, 0, 3", why:"`x^3` rises everywhere: its slope is never negative." },
            { t:"−1, 0, 1", why:"Those are the heights." },
            { t:"1, 0, 1", why:DDX + " (`x^3`) `= 3x^2`." }],
          hints:["Find `y′`.", "`y′ = 3x^2`.", "3, 0, 3."] }
      ],
      refreshers:{
        "Power rule":"Each term `ax^n` becomes `anx^{n-1}`; constants become 0.",
        "Negative exponents":"Rewrite `k/x^n` as `kx^{-n}`. When you subtract 1 from a negative exponent, it gets more negative.",
        "Reading slopes":"The slope’s sign shows whether the graph is rising or falling there, not whether it’s above or below the axis."
      }
    }
  },
  explore:{
    heading:"Derivative ladder",
    intro:"Climb down the ladder from `f` to its derivatives. Then use the slope speedometer to feel what `f″` measures.",
    fns:[
      { id:"L1", chip:"`x^3 - 3x`", plain:"f(x) = x³ − 3x" },
      { id:"L2", chip:"`x^4 - 4x^3`", plain:"f(x) = x⁴ − 4x³" },
      { id:"L3", chip:"`x^4`", plain:"f(x) = x⁴" },
      { id:"L4", chip:"`1/x`", plain:"f(x) = 1/x" },
      { id:"C", chip:"Build cubic", form:"`ax^3 + bx^2 + cx + d`" },
      { id:"Q", chip:"Build quartic", form:"`ax^4 + bx^3`" }
    ],
    modes:[{ id:"ladder", t:"Ladder" }, { id:"speed", t:"Slope speedometer" }],
    modeHow:{
      ladder:"Each panel is the derivative of the panel above it, with its equation and degree. Drag the probe on the top panel, or use the slider (arrows move it by 0.1, Shift + arrows by 1).",
      speed:"The needle points along the tangent, so its angle shows the slope `f′(x)`. Press <strong>Play</strong> to move the probe right at a steady speed. The magenta arrow shows how fast the needle turns: that’s `f″(x)`."
    },
    rows:{ f:"`f(x)`", d1:"`f′(x)` (slope)", d2:"`f″(x)` (change in slope)", d3:"`f‴(x)`", trend:"The slope is…", deg:"Degrees", until:"Rungs until 0" },
    trend:{ up:"increasing as `x` increases", down:"decreasing as `x` increases", flat:"momentarily steady" },
    buildNote:"Coefficients are whole numbers. `a` and `b` go from −12 to 12; `c` and `d` from −5 to 5.",
    skip:"Skipped `x = 0`: `1/x` isn’t defined there.",
    predIntro:"Make a prediction first. Then the ladder shows you what really happens.",
    predictions:[
      { id:"p1", fn:"L1", prompt:"What is `f″(x)` for `f(x) = x^3 - 3x`?",
        options:[{ t:"`6x`", ok:true }, { t:"`3x^2 - 3`" }, { t:"`(3x^2 - 3)^2`" }, { t:"`6x - 3`" }],
        explain:"`f′ = 3x^2 - 3`, then differentiate again: `6x`. `3x^2 - 3` stops at `f′`; `(3x^2 - 3)^2` squares it; `6x - 3` keeps the constant." },
      { id:"p2", fn:"L3", prompt:"For `f(x) = x^4`, how many times must you differentiate to get 0 for every `x`?",
        options:[{ t:"5", ok:true }, { t:"4" }, { t:"infinitely many" }, { t:"3" }],
        explain:"`f^{(4)} = 24 = 4!`, a non-zero constant. One more step gives 0." },
      { id:"p3", fn:"L1", prompt:"At `x = -1` the slope is 0. As the probe moves right, the slope…",
        options:[{ t:"decreases", ok:true }, { t:"increases" }, { t:"stays 0" }, { t:"becomes undefined" }],
        explain:"`f″(-1) = -6 < 0`, so the slope is falling. The graph is at a local maximum: it was rising, now it’s falling." },
      { id:"p4", fn:"L4", prompt:"Will the ladder for `f(x) = 1/x` ever reach 0?",
        options:[{ t:"No: `-1/x^2`, `2/x^3`, `-6/x^4`, … never become 0", ok:true }, { t:"Yes, after 2 steps" }, { t:"Yes, after 1 step" }, { t:"It becomes a constant" }],
        explain:"The exponent goes −1, −2, −3, −4, …; it never reaches 0, so no rung is constant." }
    ],
    chalIntro:"Use the ladder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"L2 (`f = x^4 - 4x^3`): move the probe to the positive `x` where the slope stops changing for an instant (`f″ = 0`).",
        why:"`f″ = 12x^2 - 24x = 12x(x - 2)` is 0 at `x = 2`: the slope is momentarily steady there.",
        hints:["`f′ = 4x^3 - 12x^2`.", "`f″ = 12x^2 - 24x = 12x(x - 2)`.", "`x = 2`."],
        msgs:{ fn:"Choose L2 first.", three:"That’s where the slope is 0 (`f′ = 0`), not where it’s steady.", zero:"`f″(0) = 0` too, but you need `x > 0`.",
          other:"Here `f″` = {v}, so the slope is still changing." } },
      { id:"tc2", goal:[1, 3], prompt:"Build cubic: make `f‴ = 12` and `f″(1) = 0`.",
        why:"`f‴ = 6a = 12` gives `a = 2`, and `f″(1) = 12 + 2b = 0` gives `b = -6`. Any `c` and `d` work.",
        hints:["`f″ = 6ax + 2b` and `f‴ = 6a`.", "`6a = 12`.", "`12 + 2b = 0`, so `b = -6`."],
        msgs:{ fn:"Choose Build cubic first.", a:"Now `f‴` = {t}. `f‴ = 6a`, so `a = 2`.", b:"Now `f″(1)` = {s}. `f″ = 12x + 2b`; at 1 that’s `12 + 2b`." } },
      { id:"tc3", goal:[1, 3], stretch:true, prompt:"Build quartic `ax^4 + bx^3`: make `f″` zero at `x = 0` and `x = 3`, and `f″(4) = 48`.",
        why:"`f″ = 6x(2ax + b)`: the zero at 3 needs `b = -6a`, and `f″(4) = 48a = 48` gives `a = 1`, `b = -6`.",
        hints:["`f″ = 12ax^2 + 6bx = 6x(2ax + b)`.", "The other zero is `-b/(2a) = 3`, so `b = -6a`.", "`f″(4) = 192a - 144a = 48a = 48`, so `a = 1`."],
        msgs:{ fn:"Choose Build quartic first.", flip:"The zeros are right, but `f″(4) = -48`: the sign is flipped.",
          dbl:"`f″(4) = 96`. The zeros only fix the ratio of `b` to `a`.", ratio:"The zeros are right, but `f″(4)` = {v}. The zeros only fix the ratio of `b` to `a`.",
          other:"Your `f″` is 0 at {z}, and `f″(4)` = {v}. You need zeros at `x = 0` and `x = 3`.", none:"Your `f″` is 0 for every `x`. Make `a` or `b` non-zero." } }
    ]
  },
  part3:{
    slug:"second", name:"Second derivative",
    heading:"Read the second derivative",
    intro:"First sketch `f′` and `f″` from a graph. Then find the second derivatives of rational and radical functions and see where they’re positive or negative. Then try the quick check.",
    st1:{ title:"Station 1: Sketch from a graph",
      text:"This cubic has a local maximum at `x = -1` and a local minimum at `x = 1` (its equation is hidden). Drag the five teal dots to the heights of `f′` at `x = -2`, −1, 0, 1 and 2, then press <strong>Check my sketch</strong>. Dots within half a grid square count.",
      how:"Drag a dot up or down, or Tab to it and use the arrow keys (each press moves it half a square).",
      text2:"Now `f″`: drag the three magenta dots to the heights of `f″` at `x = -1`, 0 and 1. Read the slopes of `f′`.",
      good1:"All five dots are within half a grid square of `f′`. The true `f′` is drawn in teal.",
      bad1:"The highlighted dots are more than half a grid square off. The true `f′` is now drawn in teal: move those dots onto it.",
      good2:"All three dots are within half a grid square of `f″`.",
      bad2:"The highlighted dots are more than half a grid square off. The true `f″` is now drawn in magenta: move those dots onto it.",
      tanOn:"Show tangents", ivPrompt:"Tap the interval where `f″ > 0`.",
      ivs:[
        { id:"r", t:"`(0, ∞)`", ok:true, fb:"Right. `f″ > 0` for `x > 0`: the slopes of `f` are increasing there." },
        { id:"l", t:"`(-∞, 0)`", fb:"There `f″ < 0`: the slopes of `f` are decreasing." },
        { id:"m", t:"`(-1, 1)`", fb:"That’s where `f′ < 0`, where `f` falls. " + M3 },
        { id:"o", t:"`(-∞, -1)` and `(1, ∞)`", fb:"That’s where `f′ > 0`, where `f` rises. " + M3 }
      ] },
    st2:{ title:"Station 2: Rational and radical second derivatives",
      text:"Choose a card. The shading shows where `f″ > 0` and where `f″ < 0`; move the tangent to watch the slope change. Then open <strong>Check it with algebra</strong>.",
      cards:[
        { id:"c1", chip:"`f(x) = {1}/{x + 1}`", plain:"f(x) = 1/(x + 1)",
          alg:["`f(x) = (x + 1)^{-1}`", "`f′(x) = -(x + 1)^{-2}`", "`f″(x) = 2(x + 1)^{-3} = {2}/{(x + 1)^3}`", "`f″ > 0` for `x > -1` and `f″ < 0` for `x < -1`; `x = -1` isn’t in the domain."] },
        { id:"c2", chip:"`f(x) = √x`", plain:"f(x) = √x",
          alg:["`f(x) = x^{1/2}`", "`f′(x) = {1}/{2}x^{-1/2}`", "`f″(x) = -{1}/{4}x^{-3/2}`", "`f″ < 0` for every `x > 0`: the slopes keep decreasing. (At `x = 0`, `f′` and `f″` are undefined.)"] },
        { id:"c3", chip:"`f(x) = x + {4}/{x}`", plain:"f(x) = x + 4/x",
          alg:["`f(x) = x + 4x^{-1}`", "`f′(x) = 1 - 4x^{-2}`", "`f″(x) = 8x^{-3} = {8}/{x^3}`", "`f″ > 0` for `x > 0` and `f″ < 0` for `x < 0`; `x = 0` isn’t in the domain."] }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Second derivative quick check",
      items:[
        { id:"q1", goal:2, prompt:"`f(x) = 1/(x + 1)`. What is `f″(0)`?",
          choices:[
            { t:"2", ok:true, fb:"Right. `f″ = 2(x + 1)^{-3}`, so `f″(0) = 2`." },
            { t:"−1", fb:"That’s `f′(0)`. Differentiate once more." },
            { t:"1", fb:M1 },
            { t:"−2", fb:M4("-1", "-2", "2") }] },
        { id:"q2", goal:3, prompt:"Moving right along a graph, the slopes go −3, then 0, then 3. What is the sign of `f″` there?",
          choices:[
            { t:"positive", ok:true, fb:"Right. The slopes are increasing, so `f″ > 0`." },
            { t:"negative", fb:"The slopes are increasing, so `f″ > 0`." },
            { t:"zero", fb:"The slopes are increasing, so `f″ > 0`." },
            { t:"can’t tell", fb:"The slopes are increasing, so `f″ > 0`." }] },
        { id:"q3", goal:1, prompt:"For `y = x^3`, what does " + D2Y + " equal?",
          choices:[
            { t:"`6x`", ok:true, fb:"Right. `3x^2`, then `6x`." },
            { t:"`9x^4`", fb:"That’s " + DYSQ + ". " + M2 },
            { t:"`3x^2`", fb:"That’s " + DY + ". Differentiate once more." },
            { t:"6", fb:"That’s the third derivative: you differentiated one time too many." }] },
        { id:"q4", goal:2, prompt:"`f(x) = √x`. What is `f″(4)`?",
          choices:[
            { t:"−1/32", ok:true, fb:"Right. `f″ = -{1}/{4}x^{-3/2}` and `4^{-3/2} = 1/8`." },
            { t:"1/4", fb:"That’s `f′(4)`. Differentiate once more." },
            { t:"1/32", fb:"Check the sign: `-{1}/{2} · {1}/{2} = -{1}/{4}`." },
            { t:"−1/8", fb:"The exponent becomes −3/2." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sign", type:"sorter", title:"Sign of `f″`", summary:"Sign of f″", noun:"function", goal:[1, 2, 3],
        instruction:"Find `f″` at the point, then sort each function by the sign of `f″` there.",
        boxes:[{ id:"pos", label:"`f″ > 0`" }, { id:"neg", label:"`f″ < 0`" }, { id:"zero", label:"`f″ = 0`" }],
        items:[
          { id:"i1", goal:[1, 3], t:"`x^2` at `x = 5`", answer:"pos", why:"`f″ = 2`." },
          { id:"i2", goal:[1, 3], t:"`-3x^2 + x` at `x = 0`", answer:"neg", why:"`f″ = -6`." },
          { id:"i3", goal:[1, 3], t:"`x^3` at `x = 0`", answer:"zero", why:"`f″ = 6x = 0`." },
          { id:"i4", goal:[1, 3], t:"`x^3` at `x = -2`", answer:"neg", why:"`f″ = -12`.",
            wrong:{ pos:"`x^3` is rising there, but its slope is falling toward 0." } },
          { id:"i5", goal:[1, 3], t:"`x^4 - 6x^2` at `x = 0`", answer:"neg", why:"`f″ = 12x^2 - 12 = -12`.",
            hints:["`f′ = 4x^3 - 12x`.", "`f″ = 12x^2 - 12`.", "At 0: −12."] },
          { id:"i6", goal:[1, 3], t:"`x^4 - 6x^2` at `x = 2`", answer:"pos", why:"`f″ = 36`." },
          { id:"i7", goal:[2, 3], t:"`1/x` at `x = -1`", answer:"neg", why:"`f″ = 2/x^3 = -2`.",
            wrong:{ pos:"`2/x^3` is negative when `x < 0`." } },
          { id:"i8", goal:[2, 3], t:"`1/x` at `x = 2`", answer:"pos", why:"`f″ = 1/4`." },
          { id:"i9", goal:[1, 3], t:"`5x - 7` at `x = 3`", answer:"zero", why:"A line’s slope never changes.",
            wrong:{ pos:"The line rises, but its slope is constant." } },
          { id:"i10", goal:[2, 3], t:"`√x` at `x = 9`", answer:"neg", why:"`f″ = -{1}/{4}x^{-3/2}`.",
            hints:["`f = x^{1/2}`.", "`f″ = -{1}/{4}x^{-3/2}`.", "Negative for every `x > 0`."] }
        ],
        wrongDefault:"Find `f″`, then substitute." },
      { id:"ladder", type:"custom", title:"Climb the ladder", summary:"Climb the ladder", star:true, goal:[1, 2, 5],
        instruction:"Climb the derivative ladder and find each value. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type a whole number or a fraction, such as 18 or −1/4, then press Check.",
        items:[
          { id:"s1", goal:1, prompt:"`f(x) = 2x^5 - x^3`. Find `f″(1)`.", boxes:[{ k:"v", label:"`f″(1) =`" }], answer:{ v:34 }, display:"34",
            wrong:[{ v:7, fb:"That’s `f′(1)`." }], why:"`f′ = 10x^4 - 3x^2`, `f″ = 40x^3 - 6x`, so `f″(1) = 34`." },
          { id:"s2", goal:2, prompt:"`f(x) = 3/x^2`. Find `f″(1)`.", boxes:[{ k:"v", label:"`f″(1) =`" }], answer:{ v:18 }, display:"18",
            wrong:[{ v:-6, fb:M6 }, { v:-18, fb:M4("-6", "-3", "18") }], why:"`3x^{-2} -> -6x^{-3} -> 18x^{-4}`, so `f″(1) = 18`." },
          { id:"s3", goal:5, star:true, prompt:"`f(x) = x^6`. Find `f^{(6)}(x)`.", boxes:[{ k:"v", label:"`f^{(6)}(x) =`" }], answer:{ v:720 }, display:"720",
            wrong:[{ v:6, fb:"6! = 720." }, { v:0, fb:"That’s `f^{(7)}`." }], why:"`x^6 -> 6x^5 -> 30x^4 -> 120x^3 -> 360x^2 -> 720x -> 720 = 6!`." },
          { id:"s4", goal:1, star:true, prompt:"`f(x) = (2x - 1)^4`. Find `f″(1)`.", boxes:[{ k:"v", label:"`f″(1) =`" }], answer:{ v:48 }, display:"48",
            wrong:[{ v:12, fb:"`f″ = 48(2x - 1)^2`: the chain rule’s 2 appears twice." }], why:"`f′ = 8(2x - 1)^3` and `f″ = 48(2x - 1)^2`, so `f″(1) = 48`.",
            hints:["`f′ = 4(2x - 1)^3 · 2 = 8(2x - 1)^3`.", "`f″ = 24(2x - 1)^2 · 2`.", "`48(1)^2 = 48`."] },
          { id:"s5", goal:1, star:true, prompt:"Find `k` so that `y = x^3 + kx^2` has `y″ = 0` at `x = 2`.", boxes:[{ k:"k", label:"`k =`" }], answer:{ k:-6 }, display:"`k = -6`",
            wrong:[{ k:-3, fb:"`y″ = 6x + 2k`, so `12 + 2k = 0`." }], why:"`y″ = 6x + 2k`; at `x = 2`, `12 + 2k = 0`, so `k = -6`." },
          { id:"s6", goal:1, star:true, prompt:"Find `a` and `b` so that `f(x) = ax^3 + bx^2` has `f′(1) = 0` and `f″(1) = 6`.",
            boxes:[{ k:"a", label:"`a =`" }, { k:"b", label:"`b =`" }], answer:{ a:2, b:-3 }, display:"`a = 2`, `b = -3`",
            wrongDefault:"Two equations: `3a + 2b = 0` and `6a + 2b = 6`.", why:"`3a + 2b = 0` and `6a + 2b = 6`; subtract: `3a = 6`, so `a = 2` and `b = -3`.",
            hints:["`f′ = 3ax^2 + 2bx`; `f″ = 6ax + 2b`.", "`3a + 2b = 0` and `6a + 2b = 6`.", "Subtract: `3a = 6`, so `a = 2` and `b = -3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Naomi", how:"", goal:[1, 2],
        instruction:"Naomi made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find `f″(2)` for `f(x) = x^4 - 2x^3`.",
            steps:["`f′(x) = 4x^3 - 6x^2`", "`f″(x) = (4x^3 - 6x^2)^2`", "`f″(2) = (32 - 24)^2 = 64`"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"`f″(x) = 12x^2 - 12x`, so `f″(2) = 48 - 24 = 24`", ok:true, why:"Differentiate `f′` again, term by term." },
              { t:"`f″(x) = 4x^3 - 6x^2`, so `f″(2) = 8`", why:M6 },
              { t:"`f″(x) = 12x^2 - 6x`", why:"`-6x^2` differentiates to `-12x`." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["What does the second prime ask you to do?", "Differentiate `4x^3 - 6x^2`.", "`12x^2 - 12x`; at 2, 24."] },
          { id:"e2", goal:2, task:"Find `f″(1)` for `f(x) = 2/x`.",
            steps:["`f(x) = 2x^{-1}`", "`f′(x) = -2x^{-2}`", "`f″(x) = -4x^{-3}`", "`f″(1) = -4`"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"`f″(x) = (-2)(-2)x^{-3} = 4x^{-3}`, so `f″(1) = 4`", ok:true, why:"Bring down the exponent −2: two negatives multiply to a positive." },
              { t:"`f″(x) = -4x^{-1}`", why:"−2 − 1 = −3." },
              { t:"`f″(x) = 2x^{-3}`", why:"Multiply by the exponent −2." },
              { t:"Step 3 is correct.", why:M4("-2", "-2", "4") }],
            hints:["Bring down the exponent −2.", "(−2) × (−2) = 4.", "`4x^{-3}`; at 1, 4."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the derivative ladder: how quickly a polynomial reaches 0, or that `1/x` never does?" },
      { id:"j2", q:"In your own words, what does the sign of `f″` tell you about a graph?" },
      { id:"j3", q:"Explain to a friend why " + D2Y + " isn’t " + DYSQ + "." },
      { id:"j4", q:"Which part of reading `f″` from a graph is still hard for you? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Find `f″(x)` for `f(x) = 5x^4 - 2x^3 + x`.", options:[
          { t:"`60x^2 - 12x`", ok:true, why:"`f′ = 20x^3 - 6x^2 + 1`, then `f″ = 60x^2 - 12x`." },
          { t:"`20x^3 - 6x^2 + 1`", why:M6 },
          { t:"`(20x^3 - 6x^2 + 1)^2`", why:M1 },
          { t:"`60x^2 - 12x + 1`", why:"The +1 from `f′` differentiates to 0." }] },
        b:{ prompt:"Find `f″(x)` for `f(x) = 3x^5 + 4x^2 - 7x`.", options:[
          { t:"`60x^3 + 8`", ok:true, why:"`f′ = 15x^4 + 8x - 7`, then `f″ = 60x^3 + 8`." },
          { t:"`15x^4 + 8x - 7`", why:M6 },
          { t:"`(15x^4 + 8x - 7)^2`", why:M1 },
          { t:"`60x^3 + 8x`", why:"`8x` differentiates to 8." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Find `f″(x)` for `f(x) = 6/x`.", options:[
          { t:"`{12}/{x^3}`", ok:true, why:"`6x^{-1} -> -6x^{-2} -> 12x^{-3}`." },
          { t:"`-{6}/{x^2}`", why:M6 },
          { t:"`-{12}/{x^3}`", why:M4("-6", "-2", "12") },
          { t:"`{36}/{x^4}`", why:M1 }] },
        b:{ prompt:"Find `f″(x)` for `f(x) = 4/x^2`.", options:[
          { t:"`{24}/{x^4}`", ok:true, why:"`4x^{-2} -> -8x^{-3} -> 24x^{-4}`." },
          { t:"`-{8}/{x^3}`", why:M6 },
          { t:"`-{24}/{x^4}`", why:M4("-8", "-3", "24") },
          { t:"`{64}/{x^6}`", why:M1 }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which notation means the second derivative of `y` with respect to `x`?", options:[
          { t:D2Y, ok:true, why:"Differentiate twice: the 2s count derivatives." },
          { t:DYSQ, why:M2 },
          { t:DY2X, why:"That isn’t standard notation: the 2 belongs on the d." },
          { t:DDX + " (`y^2`)", why:"That’s the derivative of `y^2`." }] },
        b:{ prompt:"What does `f‴(x)` mean?", options:[
          { t:"The derivative of `f″(x)`", ok:true, why:"Three primes: differentiate three times." },
          { t:"`(f′(x))^3`", why:M1 },
          { t:"`3f′(x)`", why:"The primes count derivatives, not a coefficient." },
          { t:"`f(x) · f′(x) · f″(x)`", why:"Primes aren’t multiplied together." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`f(x) = x^3 - 6x^2 + 5`. On which interval is the slope of `f` increasing?", options:[
          { t:"`(2, ∞)`", ok:true, why:"`f″ = 6x - 12 > 0` when `x > 2`." },
          { t:"`(-∞, 0) ∪ (4, ∞)`", why:"That’s where `f` itself is increasing (`f′ > 0`)." },
          { t:"`(4, ∞)`", why:"`f″` is already positive from `x = 2`." },
          { t:"`(0, 4)`", why:"That’s where `f` is decreasing." }] },
        b:{ prompt:"`f(x) = -x^3 + 3x^2 + 1`. On which interval is the slope of `f` increasing?", options:[
          { t:"`(-∞, 1)`", ok:true, why:"`f″ = -6x + 6 > 0` when `x < 1`." },
          { t:"`(0, 2)`", why:"That’s where `f` is increasing." },
          { t:"`(1, ∞)`", why:"`f″ < 0` there." },
          { t:"`(-∞, 0) ∪ (2, ∞)`", why:"That’s where `f` is decreasing." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`f(x) = x^5 - 3x^4 + 2x`. What is `f^{(5)}(x)`?", options:[
          { t:"120", ok:true, why:"Only the `x^5` term survives five derivatives: 5! = 120." },
          { t:"0", why:"That’s `f^{(6)}`." },
          { t:"5", why:"5 × 4 × 3 × 2 × 1, not 5." },
          { t:"`120x`", why:"After five steps, `x^5` has no `x` left." }] },
        b:{ prompt:"`f(x) = 2x^4 - x^3`. What is `f^{(4)}(x)`?", options:[
          { t:"48", ok:true, why:"2 × 4! = 48." },
          { t:"0", why:"That’s `f^{(5)}`." },
          { t:"8", why:"2 × 4, not 2 × 4!." },
          { t:"`48x`", why:"No `x` is left after four steps." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"The graph of a cubic `f` has a local maximum at `x = -2` and a local minimum at `x = 2`. Where is `f″(x) = 0`?", options:[
          { t:"At `x = 0`", ok:true, why:"`f′` is a quadratic with zeros −2 and 2, so its vertex (where its slope `f″` is 0) is halfway, at 0." },
          { t:"At `x = -2` and `x = 2`", why:"That’s where `f′ = 0`." },
          { t:"At the `x`-intercepts of `f`", why:"`f″` is about slopes changing, not about `f = 0`." },
          { t:"Nowhere", why:"A cubic’s `f″` is linear, so it’s 0 once." }] },
        b:{ prompt:"A cubic `f` has a local maximum at `x = 1` and a local minimum at `x = 5`. Where is `f″(x) = 0`?", options:[
          { t:"At `x = 3`", ok:true, why:"`f′` is a quadratic with zeros 1 and 5, so its vertex (where `f″ = 0`) is halfway, at 3." },
          { t:"At `x = 1` and `x = 5`", why:"That’s where `f′ = 0`." },
          { t:"At the `x`-intercepts of `f`", why:"`f″` is about slopes changing, not about `f = 0`." },
          { t:"Nowhere", why:"A cubic’s `f″` is linear, so it’s 0 once." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best description of what `f″(3) = -4` tells you?", options:[
          { t:"“Near `x = 3`, the slope of `f` is decreasing by about 4 for each unit increase in `x`.”", ok:true, why:"`f″` is the rate of change of the slope." },
          { t:"“`f` is decreasing at `x = 3`.”", why:"That would need `f′(3) < 0`." },
          { t:"“The graph of `f` is below the `x`-axis at `x = 3`.”", why:M3 },
          { t:"“The slope of `f` at `x = 3` is −4.”", why:"That would be `f′(3) = -4`. `f″` tells you how the slope changes." }] },
        b:{ prompt:"Which is the best description of what `f″(-1) = 5` tells you?", options:[
          { t:"“Near `x = -1`, the slope of `f` is increasing by about 5 for each unit increase in `x`.”", ok:true, why:"`f″` is the rate of change of the slope." },
          { t:"“`f` is increasing at `x = -1`.”", why:"That would need `f′(-1) > 0`. " + M3 },
          { t:"“`f(-1) = 5`.”", why:"That’s a value, not a second derivative." },
          { t:"“The slope of `f` at `x = -1` is 5.”", why:"That would be `f′(-1) = 5`. `f″` tells you how the slope changes." }] } },
      { id:"c2", cat:"C", goal:[1, 2],
        a:{ prompt:"Which is a correct way to write the second derivative of `y = x^4`?", options:[
          { t:D2Y + " `= 12x^2`", ok:true, why:"`4x^3`, then `12x^2`: the 2s count derivatives." },
          { t:DYSQ + " `= 12x^2`", why:M2 },
          { t:DY2X2 + " `= 12x^2`", why:"The 2 goes on the d, not on `y`." },
          { t:"`y^2 = 12x^2`", why:"That says something else entirely." }] },
        b:{ prompt:"Which is correct for `y = x^{-1}`?", options:[
          { t:"`y″ = 2x^{-3}`", ok:true, why:"`x^{-1} -> -x^{-2} -> 2x^{-3}`." },
          { t:"`y″ = (-x^{-2})^2 = x^{-4}`", why:M1 },
          { t:"`y″ = -x^{-2}`", why:"That’s `y′`. Differentiate once more." },
          { t:"`y″ = -2x^{-3}`", why:M4("-1", "-2", "2") }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A drone’s height is `h(t) = t^3 - 9t^2 + 24t` metres after `t` seconds (`0 <= t <= 5`). At `t = 1`, is its vertical velocity increasing or decreasing, and how fast?", options:[
          { t:"Decreasing, by 12 m/s each second", ok:true, why:"`h′ = 3t^2 - 18t + 24`; `h″ = 6t - 18 = -12` at `t = 1`." },
          { t:"Increasing, by 9 m/s each second", why:"`h′(1) = 9` is the velocity itself." },
          { t:"Increasing, by 12 m/s each second", why:"`h″(1)` is negative." },
          { t:"Decreasing, by 18 m/s each second", why:"`h″ = 6t - 18`, so include the `6t`." }] },
        b:{ prompt:"`h(t) = t^3 - 6t^2 + 12t` metres. At `t = 1`, is the vertical velocity increasing or decreasing, and how fast?", options:[
          { t:"Decreasing, by 6 m/s each second", ok:true, why:"`h″ = 6t - 12 = -6`." },
          { t:"Increasing, by 3 m/s each second", why:"`h′(1) = 3` is the velocity itself." },
          { t:"Increasing, by 6 m/s each second", why:"`h″(1)` is negative." },
          { t:"Decreasing, by 12 m/s each second", why:"`h″ = 6t - 12`, so include the `6t`." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A cart’s position along a track is `s(t) = 2t^3 - 15t^2 + 36t` metres. At what time is the rate of change of its velocity zero?", options:[
          { t:"`t = 2.5` s", ok:true, why:"`s″ = 12t - 30 = 0`." },
          { t:"`t = 2` s and `t = 3` s", why:"Those are when `s′ = 0`, the velocity itself." },
          { t:"`t = 0` s", why:"`s″(0) = -30`." },
          { t:"`t = 5` s", why:"30 ÷ 12 = 2.5." }] },
        b:{ prompt:"`s(t) = t^3 - 12t^2 + 36t` metres. At what time is the rate of change of the velocity zero?", options:[
          { t:"`t = 4` s", ok:true, why:"`s″ = 6t - 24 = 0`." },
          { t:"`t = 2` s and `t = 6` s", why:"Those are when `s′ = 0`, the velocity itself." },
          { t:"`t = 0` s", why:"`s″(0) = -24`." },
          { t:"`t = 8` s", why:"24 ÷ 6 = 4." }] } }
    ]
  },
  task:{
    title:"Slowest slope", summary:"Slowest slope",
    statement:"<p>Design `f(x) = ax^3 + bx^2 + cx` that meets every condition. Find all the answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f‴(x) = 12`.</li><li>`f″(x) = 0` at a positive `x`-value.</li><li>The slope of `f` is never negative.</li><li>The slope at `x = 0` is 2.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −5 to 5. The ladder shows `f`, `f′` (with its lowest point marked) and `f″`.</p>",
    checks:["`f‴ = 12`", "`f″ = 0` at a positive `x`", "Slope never negative", "Slope 2 at `x = 0`"],
    tips:["`f‴ = 6a`.",
      "`f″ = 6ax + 2b` is 0 at `x = -b/(3a)`. For that to be positive with `a > 0`, `b` must be negative.",
      "The slope is smallest exactly where `f″ = 0`. Check `f′` there: it must not be negative.",
      "`f′(0) = c`."],
    explainPrompt:"Explain why the place where `f″ = 0` is the place to check whether the slope ever goes negative.",
    vocab:"Use the words first derivative, second derivative, slope and minimum.",
    more:"There’s more than one answer. Find them all.",
    after3:"With `a = 2` and `c = 2`, the slope’s lowest value is `2 - b^2/6`. `b = -4` makes it `2 - 16/6 < 0`."
  },
  cards:[
    ["Second derivative", "`f″(x)` = " + D2Y + ": the derivative of `f′`."],
    ["What `f″` measures", "The rate of change of the slope."],
    ["`f″ > 0`", "Slopes increasing as `x` increases."],
    ["`f″ < 0`", "Slopes decreasing as `x` increases."],
    ["Not this", "`f″ != (f′)^2`, and " + D2Y + " ≠ " + DYSQ + "."],
    ["Degree ladder", "Each derivative of a polynomial lowers the degree by 1."],
    ["`n`th derivative of `x^n`", "`n!` (then 0 forever after)."],
    ["`1/x` ladder", "`-1/x^2`, `2/x^3`, `-6/x^4`, …: never reaches 0."],
    ["`√x`", "`f′ = (1/2)x^{-1/2}`, `f″ = -(1/4)x^{-3/2}`."],
    ["Turning points of a cubic", "`f″ = 0` halfway between them."]
  ]
};
