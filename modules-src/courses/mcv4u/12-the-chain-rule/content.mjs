// MCV4U 12 The Chain Rule. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/12-the-chain-rule.md
const DDX = '<span class="m">d/d<i>x</i></span>';
// Leibniz notation with an upright d (built by hand: backtick math would italicise the d)
function lz(a, b){ return '<span class="m">d<i>' + a + "</i>/d<i>" + b + "</i></span>"; }
const DYDX = lz("y", "x"), DYDU = lz("y", "u"), DUDX = lz("u", "x");
const CHAIN_LZ = '<span class="m">(d<i>y</i>/d<i>u</i>)(d<i>u</i>/d<i>x</i>)</span>';
// hero equation: du/dx in --pen (inner), dy/du in teal --f3 (outer), dy/dx in ink
function sf(a, b){ return '<span class="frac"><span class="fn">d<i>' + a + '</i></span><span class="fd">d<i>' + b + "</i></span></span>"; }
const HERO_EQ = '<span class="m ch-heq">' + sf("y", "x") + ' = <span class="ch-out">' + sf("y", "u") + '</span> · <span class="ch-in">' + sf("u", "x") + "</span></span>";
// misconception core sentences (plan §3), with the item’s own numbers where the plan only names M1–M7
function M1(by){ return "The inside changes too. Multiply by its derivative: here, by " + by + "."; }
function M2(keep, not){ return "Keep the inside as it is in the outer derivative: " + keep + ", not " + not + "."; }
const M3 = DYDU + " is measured at the inner value `u = g(x)`, not at `x`.";
const M4 = "Subtract 1 from the exponent: `-1/2 - 1 = -3/2`.";
const M5 = "The outer function is the last thing done to `x`. In `√{3x - 4}`, the square root is last.";
const M7 = "It’s a product first: (first)′(second) + (first)(second)′, and the chain rule is only for the second factor’s derivative.";
const POS = "The inside `1 - x` has derivative −1.";

export default {
  id:"12-the-chain-rule",
  kind:"topic",
  title:"The chain rule",
  topic:"The Chain Rule",
  readyTopic:"the chain rule",
  hero:{
    eq:HERO_EQ,
    eqLabel:"d y by d x equals d y by d u times d u by d x",
    eqSize:"md",
    headline:"Rates in a chain multiply",
    text:"A <strong>composite function</strong> feeds the output of an <strong>inner function</strong> into an <strong>outer function</strong>. If the inner one changes 3 times as fast as `x`, and the outer one changes 2 times as fast as its input, the whole chain changes 6 times as fast as `x`. That is the <strong>chain rule</strong>: differentiate the outside (leaving the inside alone), then multiply by the derivative of the inside.",
    fig:{ html:'<div class="ch-hero"><div class="ch-hero-box"><div id="ch-hero-svg" class="ch-gearbox" role="img" aria-label="Three gears X, U and Y joined by chains."></div><p class="ch-hero-fin" id="ch-hero-fin" aria-hidden="true"></p></div><p class="ch-hero-mul" id="ch-hero-mul" aria-live="polite"></p><div class="q-actions ch-hero-ctl"><button type="button" class="btn ghost sm" id="ch-hero-replay">Replay</button></div></div>' },
    steps:[
      "Gear `X` turns once. Gear `U` turns 3 times as fast, and gear `Y` turns 2 times as fast as `U`.",
      "The counters freeze: `X` turned once, `U` 3 times, `Y` 6 times. Rates multiply: 6 = 2 × 3.",
      "`y = (3x + 1)^2`: the outer rate is `2(3x + 1)`, the inner rate is 3, and " + DYDX + " = `2(3x + 1) · 3`."
    ],
    finalEq:"`y = (3x + 1)^2`, " + DYDX + " = `2(3x + 1) · 3`"
  },
  goals:[
    "I can identify the outer and inner functions of a composite function.",
    "I can apply the chain rule in both forms: " + DYDX + " = " + CHAIN_LZ + " and `f′(g(x)) · g′(x)`.",
    "I can differentiate powers of functions, including radicals and reciprocals written as powers.",
    "I can verify the chain rule by expanding, by simplifying a monomial, or with the product rule.",
    "I can combine the chain rule with the product and quotient rules.",
    "I can use the chain rule to find slopes, tangents and rates of change in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Composition", goal:1, prompt:"`f(x) = x^3` and `g(x) = 2x + 1`. What is `f(g(x))`?",
          options:[
            { t:"`(2x + 1)^3`", ok:true, why:"Put `g(x)` into `f`." },
            { t:"`2x^3 + 1`", why:"That’s `g(f(x))`. The inside function goes in first." },
            { t:"`6x^2`", why:"Composition isn’t a derivative." },
            { t:"`x^3(2x + 1)`", why:"`f(g(x))` isn’t `f · g`." }],
          hints:["Replace the `x` in `f` with `g(x)`.", "`f(2x + 1) = (2x + 1)^3`.", "`(2x + 1)^3`."] },
        { id:"w2", skill:"Composition", goal:1, prompt:"`h(x) = √{x^2 + 9}`. Which pair gives `h(x) = f(g(x))`?",
          options:[
            { t:"`f(x) = √x`, `g(x) = x^2 + 9`", ok:true, why:"Square, add 9, then take the root: the root is last, so it’s outer." },
            { t:"`f(x) = x^2 + 9`, `g(x) = √x`", why:"That gives `x + 9`." },
            { t:"`f(x) = √x`, `g(x) = x^2`", why:"That gives `√{x^2}`." },
            { t:"`f(x) = x + 3`, `g(x) = x^2`", why:"`√{x^2 + 9} ≠ x + 3`: try `x = 4`." }],
          hints:["What’s done to `x` last?", "The square root is last.", "Outer `√x`, inner `x^2 + 9`."] },
        { id:"w3", skill:"Power rule", goal:3, prompt:"Differentiate `x^{1/2}`.",
          options:[
            { t:"`(1/2)x^{-1/2}`", ok:true, why:"Bring down 1/2; `1/2 - 1 = -1/2`." },
            { t:"`(1/2)x^{1/2}`", why:"Lower the exponent by 1." },
            { t:"`(3/2)x^{1/2}`", why:"That reverses the power rule." },
            { t:"`-(1/2)x^{-1/2}`", why:"The exponent 1/2 is positive." }],
          hints:["`nx^{n-1}`.", "`n = 1/2`.", "`(1/2)x^{-1/2} = {1}/{2√x}`."] },
        { id:"w4", skill:"Power rule", goal:3, prompt:"Differentiate `x^{-3}`.",
          options:[
            { t:"`-3x^{-4}`", ok:true, why:"`-3 - 1 = -4`." },
            { t:"`-3x^{-2}`", why:"`-3 - 1` is −4, not −2." },
            { t:"`3x^{-4}`", why:"The −3 comes down." },
            { t:"`-3x^{-3}`", why:"Subtract 1." }],
          hints:["Bring down −3.", "Subtract 1: −4.", "`-3x^{-4}`."] },
        { id:"w5", skill:"Product rule", goal:5, prompt:"Find the slope of `y = (x + 2)(x^2 - 1)` at `x = 1`.",
          options:[
            { t:"6", ok:true, why:"`1 · 0 + 3 · 2 = 6`." },
            { t:"2", why:"That multiplies the derivatives. Use `f′g + fg′`." },
            { t:"0", why:"That keeps only `f′g`. Add `fg′ = 3 × 2`." },
            { t:"−6", why:"That subtracts, as in the quotient rule. The product rule adds." }],
          hints:["`f = 3`, `f′ = 1`, `g = 0`, `g′ = 2` at `x = 1`.", "`f′g + fg′`.", "`0 + 6 = 6`."] },
        { id:"w6", skill:"Rewriting as powers", goal:3, prompt:"Write `1/√{x + 4}` as a power.",
          options:[
            { t:"`(x + 4)^{-1/2}`", ok:true, why:"√ is the 1/2 power; 1 over it is the −1/2 power." },
            { t:"`(x + 4)^{1/2}`", why:"That’s `√{x + 4}`, not 1 over it." },
            { t:"`x^{-1/2} + 4^{-1/2}`", why:"Powers don’t split over a sum." },
            { t:"`(x + 4)^{-2}`", why:"√ is the 1/2 power." }],
          hints:["`√A = A^{1/2}`.", "`1/A^{1/2} = A^{-1/2}`.", "`(x + 4)^{-1/2}`."] }
      ],
      refreshers:{
        "Composition":"`f(g(x))`: do `g` first, then `f`. The outer function is the last operation.",
        "Power rule":"`x^n → nx^{n-1}` for any rational `n`. Subtract 1 carefully with fractions and negatives.",
        "Product rule":"`(fg)′ = f′g + fg′`.",
        "Rewriting as powers":"`√A = A^{1/2}`, `1/A = A^{-1}`, `1/√A = A^{-1/2}`. Never split a power over a sum."
      }
    }
  },
  explore:{
    heading:"Gear train",
    intro:"Turn the input and watch how a change passes through two functions. The local stretch at each stage multiplies.",
    modes:[{ id:"gears", t:"Gears" }, { id:"pipe", t:"Pipeline" }, { id:"graph", t:"Graph" }],
    modeHow:{
      gears:"Gear `X` drives gear `U`, and `U` drives `Y`. Set the two rates, then press <strong>Play</strong> (one turn of `X`) or <strong>Step</strong> (a quarter turn). A negative rate crosses the chain, so that gear turns the other way.",
      pipe:"Three number lines, `x`, `u` and `y`. A bracket of width 0.1 around `x` is carried to `u = g(x)` and then to `y = f(u)`. The arrows show each stage’s stretch factor.",
      graph:"The graph of `y = f(g(x))` with its tangent at `x`. The tangent’s slope is the chain " + DYDX + "."
    },
    pipes:[
      { id:"P1", chip:"<strong>P1</strong> `u = x^2 + 1`, `y = u^3`" },
      { id:"P2", chip:"<strong>P2</strong> `u = 2x - 3`, `y = √u`" },
      { id:"P3", chip:"<strong>P3</strong> `u = x^3`, `y = 1/u`" },
      { id:"P4", chip:"<strong>P4</strong> `u = 1 - x^2`, `y = u^4`" },
      { id:"K", chip:"<strong>Tune `k`</strong> `u = x^2 - k`, `y = u^3`" }
    ],
    predIntro:"Make a prediction first. Then the gear train shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Gears, " + DUDX + " = 3 and " + DYDU + " = 2. When `X` turns once, how many turns does `Y` make?",
        options:[{ t:"6", ok:true }, { t:"5" }, { t:"`2/3`" }, { t:"1.5" }],
        explain:"The counters read 1, 3, 6. `U` turns 3 times; each turn of `U` turns `Y` twice. Rates multiply, they don’t add." },
      { id:"p2", prompt:"Pipeline P1, `x = 1`. `u = x^2 + 1` and `y = u^3`. At `x = 1`, " + DUDX + " = 2. What is " + DYDU + " there?",
        options:[{ t:"12", ok:true }, { t:"3" }, { t:"24" }, { t:"4" }],
        explain:"The `u`-bracket around 2 is stretched 12 times on the `y` line. " + DYDU + " = `3u^2`, evaluated at `u = g(1) = 2`, not at `x = 1`. 3 evaluates it at `x = 1`; 24 is already the full chain; 4 forgets the 3." },
      { id:"p3", prompt:"Graph mode, P1. So what is the slope of `y = (x^2 + 1)^3` at `x = 1`?",
        options:[{ t:"24", ok:true }, { t:"12" }, { t:"6" }, { t:"8" }],
        explain:"The tangent’s slope label reads 24. `3(x^2 + 1)^2 · 2x = 3(4)(2) = 24`. 12 forgets the inner derivative; 6 evaluates `3u^2` at `u = 1`; 8 is the `y`-value." },
      { id:"p4", prompt:"Pipeline P2, `x = 6`. `u = 2x - 3`, `y = √u`. What is " + DYDX + " at `x = 6`?",
        options:[{ t:"`1/3`", ok:true }, { t:"`1/6`" }, { t:"`√2/4`" }, { t:"3" }],
        explain:"`u = 9`, and the brackets stretch by 2, then by 1/6. " + DYDU + " = `1/(2√9) = 1/6`, times " + DUDX + " = 2. 1/6 forgets the 2; `√2/4` evaluates `f′` at `g′(x) = 2`; 3 is `y` itself." }
    ],
    chalIntro:"Use the gear train to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Pipeline P1: move `x` so that the whole chain is flat (" + DYDX + " = 0).",
        why:"At `x = 0` the inner rate `2x` is 0, so the chain " + DYDX + " = `3u^2 · 0 = 0`, even though the outer rate is 3.",
        hints:[DYDX + " = `3u^2 · 2x`.", "`3u^2 ≥ 3`, so only `2x` can be 0.", "`x = 0`."],
        msgs:{ pipe:"Choose pipeline P1 in Pipeline or Graph mode first.", pm1:"Slope ±24 there.",
          small:"`u = x^2 + 1` is never 0, so the outer rate `3u^2` is never 0.", other:"The chain’s slope here is {m}. Watch the Chain row." } },
      { id:"tc2", goal:[2, 3], prompt:"Gears: " + DUDX + " = 4 is fixed. Set " + DYDU + " so that `Y` turns backward, twice as fast as `X`.",
        why:"`4 × (-0.5) = -2`: `Y` turns backward, twice as fast as `X`.",
        hints:[DYDX + " must be −2.", "4 × (" + DYDU + ") = −2.", "−0.5."],
        msgs:{ mode:"Switch to Gears mode first.", a:"Set " + DUDX + " to 4 first.", p05:"`Y` turns forward.",
          m2:"That’s the rate you want for the whole chain, not for the outer gear.", m8:"You multiplied instead of dividing.",
          zero:"With " + DYDU + " = 0, `Y` doesn’t turn at all.",
          other:"Now `Y` turns {dir}, {r} times as fast as `X`." } },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Graph mode with a `k` slider (−5 to 5, step 1): `y = (x^2 - k)^3`. Choose `k` so that the slope at `x = 1` is 6. There are two answers.",
        why:"`6(1 - k)^2 = 6` gives `1 - k = ±1`: `k = 0` or `k = 2`. Set the other value too and the Tune `k` panel shows <strong>Found both</strong>.",
        hints:[DYDX + " = `3(x^2 - k)^2 · 2x`.", "At `x = 1`: `6(1 - k)^2 = 6`.", "`(1 - k)^2 = 1`, so `1 - k = ±1`: `k = 0` or 2."],
        msgs:{ pipe:"Choose <strong>Tune `k`</strong> in Graph mode first.", k1:"The slope is 0: `x^2 - k = 0` at `x = 1`.",
          km1:"Slope 24: `(1 - k)^2 = 4`.", other:"The slope at `x = 1` is `6(1 - k)^2` = {v} here." } }
    ]
  },
  part3:{
    slug:"layers", name:"Layers",
    heading:"Outside–inside",
    intro:"Peel the layers in the right order, check the rule three ways, then combine it with the product rule.",
    peel:{
      title:"Station 1: Peel the layers",
      text:"Tap the outer layer of the function, then choose the steps in order. Each step you choose writes a line of working.",
      rules:[
        { id:"out", t:"Differentiate the outside, keep the inside" },
        { id:"mul", t:"Multiply by the derivative of the inside" },
        { id:"in", t:"Differentiate the inside first" }],
      msgs:{ wrong:"Start from the outside: the last operation done to `x`.",
        mulFirst:"Not yet: differentiate the outside first, keeping the inside as it is.",
        outDone:"The outside is done. Now multiply by the derivative of the inside.",
        layerFirst:"Tap the outer layer first." },
      cards:[
        { id:"c1", expr:"`(5x^2 - 1)^4`",
          layers:[{ t:"the 4th power `(  )^4`", ok:true }, { t:"`5x^2 - 1`" }],
          outerName:"the 4th power, `u^4` with `u = 5x^2 - 1`",
          lines:["`4(5x^2 - 1)^3`", "`4(5x^2 - 1)^3 · 10x = 40x(5x^2 - 1)^3`"] },
        { id:"c2", expr:"`√{x^3 + 8}`",
          layers:[{ t:"the square root `√(  )`", ok:true }, { t:"`x^3 + 8`" }],
          outerName:"the square root, `u^{1/2}` with `u = x^3 + 8`",
          lines:["`(1/2)(x^3 + 8)^{-1/2}`", "`(1/2)(x^3 + 8)^{-1/2} · 3x^2 = {3x^2}/{2√{x^3 + 8}}`"] },
        { id:"c3", expr:"`1/(x^2 + 4)^2`",
          layers:[{ t:"one over a square, `(  )^{-2}`", ok:true }, { t:"`x^2 + 4`" }],
          outerName:"the −2 power, `u^{-2}` with `u = x^2 + 4`",
          lines:["`-2(x^2 + 4)^{-3}`", "`-2(x^2 + 4)^{-3} · 2x = {-4x}/{(x^2 + 4)^3}`"] },
        { id:"c4", expr:"`(1 + √x)^3`",
          layers:[{ t:"the cube `(  )^3`", ok:true }, { t:"`1 + √x`" }, { t:"`√x`" }],
          outerName:"the cube, `u^3` with `u = 1 + √x`",
          lines:["`3(1 + √x)^2`", "`3(1 + √x)^2 · {1}/{2√x}`"],
          note:"Two layers: the inside `1 + √x` has its own inside, `√x`, whose derivative is `1/(2√x)`." }
      ]
    },
    verify:{
      title:"Station 2: Verify it three ways",
      text:"Step through each check. Every route must give the same derivative as the chain rule.",
      tabs:[
        { id:"expand", t:"Expand",
          lines:[
            { e:"`(2x + 1)^3 = 8x^3 + 12x^2 + 6x + 1`", n:"Expand first." },
            { e:DDX + " `= 24x^2 + 24x + 6`", n:"Differentiate term by term." },
            { e:"`= 6(4x^2 + 4x + 1) = 6(2x + 1)^2`", n:"Factor out 6." },
            { e:"Chain rule: `3(2x + 1)^2 · 2 = 6(2x + 1)^2`", n:"Same." }],
          alg:"`(2x + 1)^2 = 4x^2 + 4x + 1`, so `6(2x + 1)^2 = 24x^2 + 24x + 6`. At `x = 1`: `24 + 24 + 6 = 54` and `6(3)^2 = 54`." },
        { id:"mono", t:"Monomial",
          lines:[
            { e:"`(8x^3)^{1/3} = 2x`", n:"Simplify first: the derivative is 2." },
            { e:"Chain rule: `(1/3)(8x^3)^{-2/3} · 24x^2`", n:"Outer `u^{1/3}`, inner `8x^3`." },
            { e:"`= (1/3) · {1}/{4x^2} · 24x^2`", n:"`(8x^3)^{2/3} = 4x^2`." },
            { e:"`= 2`", n:"Same." }],
          alg:"`(8x^3)^{2/3} = 8^{2/3}(x^3)^{2/3} = 4x^2`, so `(8x^3)^{-2/3} = {1}/{4x^2}`, and `(1/3) × 24 ÷ 4 = 2`." },
        { id:"pattern", t:"Product-rule pattern",
          lines:[
            { e:"`(3x - 1)^2 = (3x - 1)(3x - 1)`", n:"Write the square as a product." },
            { e:"`→ 3(3x - 1) + (3x - 1)(3) = 2(3x - 1) · 3`", n:"Product rule." },
            { e:"`(3x - 1)^3 = (3x - 1)^2(3x - 1)`", n:"Write the cube as a product." },
            { e:"`→ 2(3x - 1) · 3 · (3x - 1) + (3x - 1)^2 · 3 = 3(3x - 1)^2 · 3`", n:"Product rule, using the first result." }],
          alg:"`(3x - 1)^4 = (3x - 1)^3(3x - 1)`: `3(3x - 1)^2 · 3 · (3x - 1) + (3x - 1)^3 · 3 = 4(3x - 1)^3 · 3`.",
          predict:"Predict: " + DDX + " `(3x - 1)^4` = ?", frame:"[](3x - 1)^[] · []", answer:[4, 3, 3],
          wrong:[{ v:[4, 3, 1], fb:M1("3") }, { v:[4, 4, 3], fb:"Lower the exponent by 1." }],
          general:"Follow the pattern: the power comes down, the bracket’s power drops by 1, and the inside’s derivative 3 multiplies.",
          message:"Power, times the bracket to one less power, times 3, the derivative of the inside: that’s the chain rule." }
      ]
    },
    combine:{
      title:"Station 3: Combine the rules",
      text:"A product with a chain inside it, then a quotient written as a product.",
      probs:[
        { id:"a", expr:DDX + " `[x(2x + 1)^3]`", ask:"Which rule goes first?",
          choices:[{ t:"Product rule", ok:true, fb:"Right. It’s a product of `x` and `(2x + 1)^3`; the chain rule handles the second factor’s derivative." },
            { t:"Chain rule", fb:M7 }],
          lines:[
            { e:"`y′ = (x)′(2x + 1)^3 + x[(2x + 1)^3]′`", n:"Product rule." },
            { e:"`= (2x + 1)^3 + x · 3(2x + 1)^2 · 2`", n:"Chain rule for the second factor." },
            { e:"`= (2x + 1)^2[(2x + 1) + 6x]`", n:"Factor out `(2x + 1)^2`." }],
          finish:"Finish the factoring:", frame:"(2x + 1)^2([]x + [])", answer:[8, 1], display:"`(2x + 1)^2(8x + 1)`",
          wrong:[{ v:[2, 1], fb:"You left out `6x`: the second term is `x · 3(2x + 1)^2 · 2 = 6x(2x + 1)^2`." }, { v:[5, 1], fb:M1("2") }],
          general:"Collect `(2x + 1) + 6x`." },
        { id:"b", expr:DDX + " `[(2x + 1)/(x - 3)^2]`", ask:"",
          lines:[
            { e:"`(2x + 1)/(x - 3)^2 = (2x + 1)(x - 3)^{-2}`", n:"Write the quotient as a product." },
            { e:"`y′ = 2(x - 3)^{-2} + (2x + 1)(-2)(x - 3)^{-3}`", n:"Product rule, with the chain rule for `(x - 3)^{-2}`." },
            { e:"`= 2(x - 3)^{-2} - 2(2x + 1)(x - 3)^{-3}`", n:"Tidy the second term." },
            { e:"`= (x - 3)^{-3}[2(x - 3) - 2(2x + 1)]`", n:"Factor out `(x - 3)^{-3}`." }],
          finish:"Finish:", frame:{ num:"[](x + [])", den:"(x - 3)^[]" }, answer:[-2, 4, 3], display:"`{-2(x + 4)}/{(x - 3)^3}`",
          wrong:[{ v:[2, 4, 3], fb:"`2x - 6 - 4x - 2 = -2x - 8`: the factor is −2." }, { v:[-2, 4, 2], fb:"The common factor is `(x - 3)^{-3}`, so the bottom is `(x - 3)^3`." }],
          general:"Expand the bracket: `2(x - 3) - 2(2x + 1) = -2x - 8`." }
      ]
    },
    quickCheck:{
      title:"Quick check", summary:"Outside–inside quick check",
      items:[
        { id:"q1", goal:1, prompt:"Outer and inner of `(4x - 1)^6`?",
          choices:[
            { t:"outer `u^6`, inner `4x - 1`", ok:true, fb:"Right. The 6th power is the last thing done." },
            { t:"outer `4u - 1`, inner `x^6`", fb:"The 6th power is the last thing done." },
            { t:"outer `6u`, inner `4x`", fb:"The 6th power is the last thing done." },
            { t:"outer `u^6`, inner `4x`", fb:"The 6th power is the last thing done." }] },
        { id:"q2", goal:3, prompt:DDX + " `√{x^2 + 7}`?",
          choices:[
            { t:"`x/√{x^2 + 7}`", ok:true, fb:"Right. `(1/2)(x^2 + 7)^{-1/2} · 2x`." },
            { t:"`1/(2√{x^2 + 7})`", fb:"`(1/2)(x^2 + 7)^{-1/2} · 2x`." },
            { t:"`2x/√{x^2 + 7}`", fb:"`(1/2)(x^2 + 7)^{-1/2} · 2x`." },
            { t:"`1/(2√{2x})`", fb:"`(1/2)(x^2 + 7)^{-1/2} · 2x`." }] },
        { id:"q3", goal:4, prompt:"Expanding `(2x + 1)^3` gives derivative `24x^2 + 24x + 6`. Which chain-rule result matches?",
          choices:[
            { t:"`6(2x + 1)^2`", ok:true, fb:"Right. `3(2x + 1)^2 · 2 = 6(4x^2 + 4x + 1)`." },
            { t:"`3(2x + 1)^2`", fb:"`3(2x + 1)^2 · 2 = 6(4x^2 + 4x + 1)`." },
            { t:"12", fb:"`3(2x + 1)^2 · 2 = 6(4x^2 + 4x + 1)`." },
            { t:"`6(2x + 1)^3`", fb:"`3(2x + 1)^2 · 2 = 6(4x^2 + 4x + 1)`." }] },
        { id:"q4", goal:5, prompt:DDX + " `[x(x + 1)^4]`?",
          choices:[
            { t:"`(x + 1)^4 + 4x(x + 1)^3`", ok:true, fb:"Right. Product rule first; the chain rule handles `(x + 1)^4`." },
            { t:"`4(x + 1)^3`", fb:"Product rule first; the chain rule handles `(x + 1)^4`." },
            { t:"`4x(x + 1)^3`", fb:"Product rule first; the chain rule handles `(x + 1)^4`." },
            { t:"`(x + 1)^4 + 4(x + 1)^3`", fb:"Product rule first; the chain rule handles `(x + 1)^4`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[1, 3],
        instruction:"Match each function with its derivative. One derivative on the right has no partner.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`(3x - 2)^4`", why:"`4(3x - 2)^3 · 3`." },
          { id:"l2", t:"`(x^2 + 5)^3`", why:"`3(x^2 + 5)^2 · 2x`." },
          { id:"l3", t:"`√{4x + 1}`", why:"`(1/2)(4x + 1)^{-1/2} · 4`." },
          { id:"l4", t:"`1/(x^2 + 1)`", why:"`-(x^2 + 1)^{-2} · 2x`." },
          { id:"l5", t:"`(1 - x)^5`", why:"`5(1 - x)^4 · (-1)`." },
          { id:"l6", t:"`1/(2x + 3)^3`", why:"`-3(2x + 3)^{-4} · 2`.",
            hints:["Rewrite as `(2x + 3)^{-3}`.", "`-3(2x + 3)^{-4} · 2`.", "`-6/(2x + 3)^4`."] },
          { id:"l7", t:"`∛{x^3 + 8}`", why:"`(1/3)(x^3 + 8)^{-2/3} · 3x^2`.",
            hints:["`∛A = A^{1/3}`.", "`(1/3)(x^3 + 8)^{-2/3} · 3x^2`.", "`x^2(x^3 + 8)^{-2/3}`."] },
          { id:"l8", t:"`(x^2 - x)^2`", why:"`2(x^2 - x) · (2x - 1)`." }
        ],
        right:[
          { id:"r1", t:"`12(3x - 2)^3`" },
          { id:"r2", t:"`6x(x^2 + 5)^2`" },
          { id:"r3", t:"`2/√{4x + 1}`" },
          { id:"r4", t:"`-2x/(x^2 + 1)^2`" },
          { id:"r5", t:"`-5(1 - x)^4`" },
          { id:"r6", t:"`-6/(2x + 3)^4`" },
          { id:"r7", t:"`x^2/(x^3 + 8)^{2/3}`" },
          { id:"r8", t:"`2(x^2 - x)(2x - 1)`" },
          { id:"r9", t:"`1/(2√{4x + 1})`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l5|r1":POS, "l5|r2":POS, "l5|r3":POS, "l5|r7":POS, "l5|r8":POS, "l5|r9":POS,
          "l3|r9":"Multiply by the inner derivative 4.", "l6|r4":"`-3 - 1 = -4`." },
        wrongDefault:"Name the outer and inner functions, then multiply." },
      { id:"slopes", type:"custom", title:"Slopes, tangents and tables", summary:"Slopes, tangents and tables", star:true, goal:[2, 5, 6],
        instruction:"Slopes, tangent lines and given values. Items 3 to 8 are non-routine (★); items 6 and 8 go beyond the Final Check.",
        how:"Type a number in each box (fractions such as 3/5 and roots such as √2/2 are fine), then press Check. For points and lists, any order is fine.",
        items:[
          { id:"s1", goal:6, prompt:"Slope of `y = (2x - 3)^5` at `x = 2`.", frame:"[]", answer:[10], display:"10",
            wrong:[{ v:[5], fb:M1("2") }] },
          { id:"s2", goal:6, prompt:"Slope of `y = √{x^2 + 16}` at `x = 3`.", frame:"[]", answer:[0.6], display:"`3/5`",
            wrong:[{ v:[0.1], fb:"The inside changes too. Multiply by `2x = 6`." }] },
          { id:"s3", goal:6, star:true, prompt:"Tangent to `y = 8/(x^2 + 4)` at `x = 2`: slope and `y`-intercept.", frame:"y = []x + []", answer:[-0.5, 2], display:"`y = -(1/2)x + 2`: slope `-1/2`, `y`-intercept 2",
            wrong:[{ v:[-2, null], fb:"`8 · (-1) · 8^{-2} · 4 = -1/2`." }],
            general:"Find `y(2)` and `y′(2)`, then use point–slope form." },
          { id:"s4", goal:2, star:true, prompt:"`f(1) = 0`, `f′(1) = 7`, `f(2) = 3`, `f′(2) = 5`, `g(1) = 2`, `g′(1) = -4`. Find `h′(1)` for `h(x) = f(g(x))`.", frame:"h′(1) = []", answer:[-20], display:"−20",
            wrong:[{ v:[-28], fb:"`f′` is evaluated at `g(1) = 2`." }, { v:[5], fb:M1("`g′(1) = -4`") }] },
          { id:"s5", goal:6, star:true, prompt:"All points on `y = (x^2 - 4)^2` with a horizontal tangent.", frame:"([], []) ([], []) ([], []) ([], [])", pairs:true, blankPairs:true,
            answer:[[0, 16], [2, 0], [-2, 0]], display:"(0, 16), (2, 0) and (−2, 0)",
            wrong:[{ v:[[0, 16]], fb:"The inside `x^2 - 4` can be 0 too." }],
            general:"Set " + DYDX + " = `2(x^2 - 4) · 2x = 0`. Leave any extra boxes empty." },
          { id:"s6", goal:5, star:true, prompt:"`x`-values in (−1, 1) where `y = x√{1 - x^2}` has a horizontal tangent.", frame:"x = [] and x = []", set:true,
            answer:[0.7071067811865476, -0.7071067811865476], display:"`x = ±√2/2`",
            general:"Product rule, then chain: `y′ = (1 - 2x^2)/√{1 - x^2}`.",
            hints:["Product rule: `√{1 - x^2} + x ·` " + DDX + " `√{1 - x^2}`.", DDX + " `√{1 - x^2} = -x/√{1 - x^2}`.", "Common denominator: `(1 - 2x^2)/√{1 - x^2} = 0` gives `x = ±√2/2`."] },
          { id:"s7", goal:6, star:true, prompt:"`h(x) = √{f(x)}`, `f(3) = 16`, `f′(3) = 8`. Find `h′(3)`.", frame:"h′(3) = []", answer:[1], display:"1",
            wrong:[{ v:[2], fb:"`1/(2√16) · 8 = 1`, not `8/4 = 2`: the 2 in `2√f` matters." }] },
          { id:"s8", goal:2, star:true, prompt:"`y = (kx + 1)^3` has slope 54 at `x = 1`. Find `k > 0`.", frame:"k = []", answer:[2], display:"`k = 2`",
            wrong:[{ v:[6], fb:"`3(k + 1)^2 · k = 54`: don’t drop the inner derivative `k`." }],
            hints:["`y′ = 3(kx + 1)^2 · k`.", "`k(k + 1)^2 = 18`.", "Try small whole numbers: `k = 2` gives `2 × 9 = 18`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Lena", how:"", goal:3,
        instruction:"Lena made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Differentiate `y = (x^3 - 2x)^4`.",
            steps:["Outer `u^4`, inner `u = x^3 - 2x`.", DYDU + " = `4u^3`.", DUDX + " = `3x^2 - 2`.", DYDX + " = `4(x^3 - 2x)^3`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:DYDX + " = `4(x^3 - 2x)^3(3x^2 - 2)`", ok:true, why:"Multiply the outer rate by the inner rate: both from steps 2 and 3." },
              { t:"`4(3x^2 - 2)^3`", why:M2("`4(x^3 - 2x)^3`", "`4(3x^2 - 2)^3`") },
              { t:"`4u^3 · u`", why:"Multiply by " + DUDX + ", not by `u`." },
              { t:"Step 4 is correct.", why:M1("`3x^2 - 2`") }],
            hints:["Steps 2 and 3 found two rates. Were both used?", "Multiply them.", "`4(x^3 - 2x)^3(3x^2 - 2)`."] },
          { id:"e2", goal:3, task:"Differentiate `y = 1/√{2x + 5}`.",
            steps:["`y = (2x + 5)^{-1/2}`", "`y′ = -(1/2)(2x + 5)^{1/2} · 2`", "`= -(2x + 5)^{1/2}`"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows. Look earlier."],
            fixes:[
              { t:"`y′ = -(1/2)(2x + 5)^{-3/2} · 2 = -1/(2x + 5)^{3/2}`", ok:true, why:"`-1/2 - 1 = -3/2`, and the inner derivative 2 cancels the 1/2." },
              { t:"`-(1/2)(2x + 5)^{-3/2}`", why:M1("2") },
              { t:"`(1/2)(2x + 5)^{-1/2} · 2`", why:"The −1/2 comes down as a negative." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["What is `-1/2 - 1`?", "`-3/2`.", "`-(2x + 5)^{-3/2}`."] },
          { id:"e3", goal:5, task:"Differentiate `y = x^2(3x - 1)^4`.",
            steps:["Product rule: `y′ = (x^2)′(3x - 1)^4 + x^2[(3x - 1)^4]′`", "`= 2x(3x - 1)^4 + x^2 · 4(3x - 1)^3`", "`= 2x(3x - 1)^3[(3x - 1) + 2x]`", "`= 2x(3x - 1)^3(5x - 1)`"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 factors step 2 correctly.", "Step 4 follows."],
            fixes:[
              { t:"`= 2x(3x - 1)^4 + 12x^2(3x - 1)^3`, so `y′ = 2x(3x - 1)^3(9x - 1)`", ok:true, why:"`[(3x - 1)^4]′ = 4(3x - 1)^3 · 3 = 12(3x - 1)^3`; then factor out `2x(3x - 1)^3`." },
              { t:"`= 2x · 4(3x - 1)^3 · 3`", why:M7 },
              { t:"`= 8x(3x - 1)^3`", why:M7 },
              { t:"Step 2 is correct.", why:"The derivative of `(3x - 1)^4` needs the inner 3." }],
            hints:["Differentiate `(3x - 1)^4` on its own.", "`4(3x - 1)^3 · 3 = 12(3x - 1)^3`.", "`2x(3x - 1)^3(9x - 1)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the gear train: that rates multiply, or that the outer rate is measured at `u`, not `x`?" },
      { id:"j2", q:"In your own words, why is there an extra factor when you differentiate `(3x + 1)^5`?" },
      { id:"j3", q:"Explain to a friend how to differentiate `x^2(3x - 1)^4`: which rule goes first, and why?" },
      { id:"j4", q:"Which kind of chain still trips you up (radicals, reciprocals, two layers)? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`h(x) = √{3x - 4}`. Which pair gives `h(x) = f(g(x))`?", options:[
          { t:"`f(x) = √x`, `g(x) = 3x - 4`", ok:true, why:"Multiply by 3, subtract 4, then take the root: the root is last, so it’s the outer function." },
          { t:"`f(x) = 3x - 4`, `g(x) = √x`", why:M5 },
          { t:"`f(x) = √x`, `g(x) = 3x`", why:"That gives `√{3x}`." },
          { t:"`f(x) = x - 4`, `g(x) = √{3x}`", why:"That’s `√{3x} - 4`. Powers and roots don’t distribute over addition." }] },
        b:{ prompt:"`h(x) = (2 - x^3)^5`. Which pair gives `h(x) = f(g(x))`?", options:[
          { t:"`f(x) = x^5`, `g(x) = 2 - x^3`", ok:true, why:"Cube, subtract from 2, then take the 5th power: the 5th power is last, so it’s outer." },
          { t:"`f(x) = 2 - x^3`, `g(x) = x^5`", why:"The outer function is the last thing done to `x`. In `(2 - x^3)^5`, the 5th power is last." },
          { t:"`f(x) = x^5`, `g(x) = -x^3`", why:"The 2 is missing." },
          { t:"`f(x) = 2 - x^5`, `g(x) = x^3`", why:"That’s `2 - x^{15}`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Differentiate `(4x - 3)^5`.", options:[
          { t:"`20(4x - 3)^4`", ok:true, why:"`5(4x - 3)^4 · 4`." },
          { t:"`5(4x - 3)^4`", why:M1("4") },
          { t:"`5(4)^4`", why:M2("`5(4x - 3)^4`", "`5(4)^4`") },
          { t:"`20(4x - 3)^5`", why:"Lower the exponent." }] },
        b:{ prompt:"Differentiate `(2 - 5x)^3`.", options:[
          { t:"`-15(2 - 5x)^2`", ok:true, why:"`3(2 - 5x)^2 · (-5)`." },
          { t:"`3(2 - 5x)^2`", why:M1("−5") },
          { t:"`3(-5)^2`", why:M2("`3(2 - 5x)^2`", "`3(-5)^2`") },
          { t:"`15(2 - 5x)^2`", why:"The inner derivative is −5." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"`y = u^3 - u` and `u = x^2 + 1`. Find " + DYDX + " at `x = 1`.", options:[
          { t:"22", ok:true, why:"`u = 2`: " + DYDU + " = `3(4) - 1 = 11`; " + DUDX + " = 2; 11 × 2." },
          { t:"4", why:"`3u^2 - 1` must be evaluated at `u = 2`, not 1." },
          { t:"11", why:M1(DUDX + " = 2") },
          { t:"6", why:"That’s `y` at `x = 1`, not the slope." }] },
        b:{ prompt:"`y = √u` and `u = x^3 + 1`. Find " + DYDX + " at `x = 2`.", options:[
          { t:"2", ok:true, why:"`u = 9`: " + DYDU + " = 1/6; " + DUDX + " = 12." },
          { t:"`3√2`", why:"`1/(2√u)` at `u = 9`, not at 2." },
          { t:"`1/6`", why:M1(DUDX + " = 12") },
          { t:"3", why:"That’s `y`." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Differentiate `x(x^2 + 1)^3` and factor.", options:[
          { t:"`(x^2 + 1)^2(7x^2 + 1)`", ok:true, why:"`(x^2 + 1)^3 + x · 3(x^2 + 1)^2 · 2x = (x^2 + 1)^2[(x^2 + 1) + 6x^2]`." },
          { t:"`6x(x^2 + 1)^2`", why:M7 },
          { t:"`(x^2 + 1)^2(x^2 + 3x + 1)`", why:"The inner `2x` is missing." },
          { t:"`(x^2 + 1)^3`", why:"Only the first product-rule term." }] },
        b:{ prompt:"Differentiate `x(2x - 1)^4` and factor.", options:[
          { t:"`(2x - 1)^3(10x - 1)`", ok:true, why:"`(2x - 1)^4 + 8x(2x - 1)^3`." },
          { t:"`8(2x - 1)^3`", why:M7 },
          { t:"`(2x - 1)^3(6x - 1)`", why:"The inner 2 is missing." },
          { t:"`(2x - 1)^4`", why:"Only the first term." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"`f(3) = 2`, `f′(3) = -1`, `f′(1) = 5`, `g(1) = 3`, `g′(1) = 4`. Find `h′(1)` for `h(x) = f(g(x))`.", options:[
          { t:"−4", ok:true, why:"`f′(g(1)) · g′(1) = f′(3) · 4`." },
          { t:"20", why:"`f′(1) · g′(1)` evaluates `f′` at the wrong place." },
          { t:"−1", why:M1("`g′(1) = 4`") },
          { t:"8", why:"`f(3) · g′(1)` uses a value, not a derivative." }] },
        b:{ prompt:"`f(2) = 7`, `f′(2) = 3`, `f′(0) = -2`, `g(0) = 2`, `g′(0) = 5`. Find `h′(0)` for `h(x) = f(g(x))`.", options:[
          { t:"15", ok:true, why:"`f′(2) · 5`." },
          { t:"−10", why:"`f′(0) · g′(0)` evaluates `f′` at the wrong place: it belongs at `g(0) = 2`." },
          { t:"3", why:M1("`g′(0) = 5`") },
          { t:"35", why:"`f(2) · g′(0)` uses a value, not a derivative." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"At which `x`-values does `y = (x^2 - 6x)^3` have a horizontal tangent?", options:[
          { t:"`x = 0`, 3 and 6", ok:true, why:"`3(x^2 - 6x)^2(2x - 6)`: zero when `x^2 - 6x = 0` or `2x - 6 = 0`." },
          { t:"`x = 3` only", why:"The outer factor `(x^2 - 6x)^2` can be 0 too." },
          { t:"`x = 0` and 6", why:"The inner derivative `2x - 6` is 0 at 3." },
          { t:"`x = 0`, 6 and −3", why:"Sign slip: `2x - 6 = 0` at 3." }] },
        b:{ prompt:"At which `x`-values does `y = (x^2 - 4x)^5` have a horizontal tangent?", options:[
          { t:"`x = 0`, 2 and 4", ok:true, why:"`5(x^2 - 4x)^4(2x - 4)`: zero when `x^2 - 4x = 0` or `2x - 4 = 0`." },
          { t:"`x = 2` only", why:"The outer factor `(x^2 - 4x)^4` can be 0 too." },
          { t:"`x = 0` and 4", why:"The inner derivative `2x - 4` is 0 at 2." },
          { t:"`x = 0`, 4 and −2", why:"Sign slip: `2x - 4 = 0` at 2." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"A student claims " + DDX + " `(2x + 1)^2 = 2(2x + 1)`. Which is the best response?", options:[
          { t:"“Expand: `(2x + 1)^2 = 4x^2 + 4x + 1`, whose derivative is `8x + 4 = 2(2x + 1) · 2`. The inner derivative 2 is missing.”", ok:true, why:"Expanding is an independent check, and it shows exactly which factor is missing." },
          { t:"“Correct: bring down the 2 and lower the exponent.”", why:M1("2") },
          { t:"“Wrong: the answer is 2(2) = 4.”", why:M2("`2(2x + 1)`", "2(2)") },
          { t:"“You can’t check it, because expanding is a different method.”", why:"Any correct method must give the same derivative." }] },
        b:{ prompt:"A student claims " + DDX + " `(x^2 + 3)^2 = 2(x^2 + 3)`. Which is the best response?", options:[
          { t:"“Expand: `x^4 + 6x^2 + 9` has derivative `4x^3 + 12x = 2(x^2 + 3) · 2x`. The inner derivative `2x` is missing.”", ok:true, why:"Expanding is an independent check, and it shows exactly which factor is missing." },
          { t:"“Correct.”", why:M1("`2x`") },
          { t:"“Wrong: it’s `2(2x)`.”", why:M2("`2(x^2 + 3)`", "`2(2x)`") },
          { t:"“You can’t check it.”", why:"Any correct method must give the same derivative." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which statement about `y = f(g(x))` is correct?", options:[
          { t:"“" + DYDX + " = `f′(g(x)) · g′(x)`: the outer derivative is evaluated at the inner function.”", ok:true, why:"Differentiate the outside at the inside, then multiply by the inside’s derivative." },
          { t:"“" + DYDX + " = `f′(x) · g′(x)`.”", why:M3 },
          { t:"“" + DYDX + " = `f′(g′(x))`.”", why:M2("`f′(g(x))`", "`f′(g′(x))`") },
          { t:"“" + DYDX + " = `f(g′(x))`.”", why:"That isn’t a derivative of the composite at all." }] },
        b:{ prompt:"`y = u^4` and `u = 1 - x^2`. Which line of working is correct?", options:[
          { t:DYDX + " = " + CHAIN_LZ + " = `4u^3(-2x) = -8x(1 - x^2)^3`", ok:true, why:"Outer rate `4u^3` at `u = 1 - x^2`, times the inner rate `-2x`." },
          { t:DYDX + " = " + DYDU + " = `4(1 - x^2)^3`", why:M1("`-2x`") },
          { t:DYDX + " = `4(-2x)^3`", why:M2("`4(1 - x^2)^3`", "`4(-2x)^3`") },
          { t:DYDX + " = (" + DYDU + ") ÷ (" + DUDX + ")", why:"Rates in a chain multiply." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A tank drains so that the volume left after `t` minutes is `V(t) = 500(1 - t/40)^2` litres, `0 ≤ t ≤ 40`. How fast is the volume changing at `t = 20`?", options:[
          { t:"−12.5 L/min", ok:true, why:"`V′ = 500 · 2(1 - t/40) · (-1/40) = -25(1 - t/40)`; at 20, `-25 × 1/2`." },
          { t:"500 L/min", why:"The inner derivative `-1/40` is missing." },
          { t:"12.5 L/min", why:"The tank is draining, so the rate is negative." },
          { t:"125 L", why:"That’s the volume at `t = 20`, not its rate." }] },
        b:{ prompt:"`V(t) = 800(1 - t/20)^2` litres, `0 ≤ t ≤ 20`. How fast is the volume changing at `t = 10`?", options:[
          { t:"−40 L/min", ok:true, why:"`-80(1 - t/20)` at 10." },
          { t:"800 L/min", why:"The inner derivative `-1/20` is missing." },
          { t:"40 L/min", why:"Draining means negative." },
          { t:"200 L", why:"That’s the volume at `t = 10`, not its rate." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A drink’s temperature `t` minutes after it’s poured is `T(t) = 20 + 60/(t + 1)^2` °C. How fast is it cooling at `t = 1`?", options:[
          { t:"−15 °C/min", ok:true, why:"`T′ = -120(t + 1)^{-3}`; at 1, `-120/8`." },
          { t:"−30 °C/min", why:"`-120/(t + 1)^2` keeps the old exponent: `-2 - 1 = -3`." },
          { t:"15 °C/min", why:"Cooling means the rate is negative." },
          { t:"35 °C", why:"That’s the temperature at `t = 1`." }] },
        b:{ prompt:"`T(t) = 25 + 80/(t + 2)^2` °C. How fast is it cooling at `t = 2`?", options:[
          { t:"−2.5 °C/min", ok:true, why:"`-160(t + 2)^{-3}`; at 2, `-160/64`." },
          { t:"−10 °C/min", why:"`-160/(t + 2)^2` keeps the old exponent: `-2 - 1 = -3`." },
          { t:"2.5 °C/min", why:"Cooling means the rate is negative." },
          { t:"30 °C", why:"That’s the temperature at `t = 2`." }] } }
    ]
  },
  task:{
    title:"Three flat spots", summary:"Three flat spots",
    statement:"<p>Design `y = (x^2 + bx + c)^n` that meets every condition. Find as many as you can.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The graph passes through (0, 16).</li><li>It has exactly three horizontal tangents.</li><li>One of them is at `x = 1`.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −10 to 10 for `b` and `c`, and `n` = 2, 3 or 4. The graph marks the horizontal tangents and shows the factored derivative `n(x^2 + bx + c)^{n-1}(2x + b)`.</p>",
    checks:["Passes through (0, 16)", "Exactly three horizontal tangents", "A horizontal tangent at `x = 1`"],
    tips:["At `x = 0`, `y = c^n`. Which whole numbers `c` and `n` make that 16?",
      "The derivative is 0 where the inside is 0 <strong>or</strong> where its derivative `2x + b` is 0. For three flat spots, the inside needs two different real zeros.",
      "`x = 1` is a flat spot if it’s the vertex (`b = -2`) or a zero of the inside (`1 + b + c = 0`)."],
    explainPrompt:"Explain why the derivative has a horizontal tangent wherever the inside is 0, and how you used `c^n = 16` to narrow your choices.",
    vocab:"Use the words outer function, inner function, chain rule and horizontal tangent.",
    after4:"`c^n = 16` allows only `c = ±4` with `n = 2`, or `c = ±2` with `n = 4`. For each, `x = 1` can be the vertex or a zero."
  },
  cards:[
    ["Chain rule (Leibniz)", DYDX + " = " + CHAIN_LZ + "."],
    ["Chain rule (functions)", "`[f(g(x))]′ = f′(g(x)) · g′(x)`."],
    ["In words", "Differentiate the outside, keep the inside, multiply by the inside’s derivative."],
    ["Power of a function", DDX + " `[g(x)]^n = n[g(x)]^{n-1} g′(x)`."],
    ["Radicals", "`√{x^2 + 5} = (x^2 + 5)^{1/2} → x/√{x^2 + 5}`."],
    ["Reciprocals", "`1/(x - 1) = (x - 1)^{-1} → -1/(x - 1)^2`."],
    ["Outer function", "The last operation done to `x`."],
    ["Where is `f′` evaluated?", "At the inside, `u = g(x)`, never at `g′(x)`."],
    ["Rates multiply", "Inner rate 3, outer rate 2: total rate 6."],
    ["Product + chain", "`x(2x + 1)^3 → (2x + 1)^3 + 6x(2x + 1)^2`."],
    ["Verify by expanding", "`(2x + 1)^3 → 24x^2 + 24x + 6 = 6(2x + 1)^2`."],
    ["Flat spots of `[g(x)]^n`", "Where `g(x) = 0` (for `n ≥ 2`) or `g′(x) = 0`."]
  ]
};
