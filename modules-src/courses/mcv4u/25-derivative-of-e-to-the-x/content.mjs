// MCV4U 25 Derivatives of Exponential Functions, y = eˣ. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/25-derivative-of-e-to-the-x.md
// misconception core sentences (plan §3)
const M1 = "The power rule is for `x^n`: variable base, fixed exponent. In `e^x` the exponent is the variable.";
const M2 = "Multiply by the derivative of the exponent: `d/dx e^{3x} = 3e^{3x}`.";
const M3 = "`xe^x` is a product: `(x)′e^x + x(e^x)′ = (1 + x)e^x`.";
const M4 = "`e` is a constant, but `e^x` isn’t: its exponent changes with `x`.";
const M5 = "ln and `e^{( )}` undo each other: `ln(e^x) = x`. And `(ln 3)/2` isn’t `ln(3/2)`.";
const M6 = "For `a^x` the slope is `k` times the height, with the same `k` everywhere. Only for `e` is `k = 1`.";
const USE = "`e ≈ 2.718`, `e^2 ≈ 7.39`, `ln 2 ≈ 0.693`, `ln 3 ≈ 1.099`, `ln 4 ≈ 1.386`";
const E = Math.E;

export default {
  id:"25-derivative-of-e-to-the-x",
  kind:"topic",
  title:"Derivatives of exponential functions, y = eˣ",
  topic:"Derivatives of Exponential Functions, y = eˣ",
  readyTopic:"derivatives of exponential functions",
  hero:{
    eq:"`{d}/{dx} e^x = e^x` <span class=\"ee-heq\">(with `e ≈ 2.718`)</span>",
    eqLabel:"d by d x of e to the x equals e to the x, with e approximately 2.718",
    eqSize:"md",
    headline:"The function that is its own slope",
    text:"Every exponential function `a^x` has a derivative that’s a <strong>stretched copy</strong> of itself. Tune the base, and at one special value the copy lands exactly on the original. That base is <strong>`e`</strong> ≈ 2.718, and its inverse, the <strong>natural logarithm</strong> `ln x`, lets you solve for exponents.",
    fig:{ aria:"y = 2 to the x draws in blue with its slope graph in teal underneath, about 0.69 times as tall. The base changes to 3 and the slope graph rises above the curve. Then the base settles at 2.718 and the two curves merge into one: y = e to the x is its own derivative. A tangent with slope e flashes at (1, e).", shape:"wide" }
  },
  goals:[
    "I can explain why the derivative of `a^x` is a constant multiple of `a^x`, and use that ratio to find slopes.",
    "I can explain what makes `e` special: `d/dx e^x = e^x`, so the slope equals the height.",
    "I can use `ln x` as the inverse of `e^x` to simplify expressions and solve exponential equations.",
    "I can differentiate `e^{g(x)}` with the chain rule.",
    "I can combine `e^x` with the product and quotient rules to find tangent lines and horizontal tangents.",
    "I can solve rate-of-change problems with models built on `e^x`."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Exponent and log laws", goal:3, prompt:"Solve `2^x = 32`.",
          options:[
            { t:"`x = 5`", ok:true, why:"`2^5 = 32`." },
            { t:"`x = 16`", why:"`2^{16}` is far bigger." },
            { t:"`x = 6`", why:"`2^6 = 64`." },
            { t:"`x = 1/5`", why:"`2^{1/5}` is about 1.15." }],
          hints:["Write 32 as a power of 2.", "`32 = 2^5`.", "`x = 5`."] },
        { id:"w2", skill:"Exponent and log laws", goal:3, prompt:"Simplify `log_{3}(3^{2x})`.",
          options:[
            { t:"`2x`", ok:true, why:"`log_{b} b^n = n`." },
            { t:"`3^{2x}`", why:"The log undoes the power." },
            { t:"`6x`", why:"The base doesn’t stay." },
            { t:"`2x log 3`", why:"Base 3 matches base 3." }],
          hints:["`log_{3}` asks ‘what power of 3?’", "3 to the power `2x`.", "`2x`."] },
        { id:"w3", skill:"Chain rule", goal:4, prompt:"Differentiate `(3x + 1)^5`.",
          options:[
            { t:"`15(3x + 1)^4`", ok:true, why:"`5(3x + 1)^4 × 3`." },
            { t:"`5(3x + 1)^4`", why:"Multiply by 3." },
            { t:"`15x^4`", why:"Keep the inside as a block." },
            { t:"`(3x + 1)^4`", why:"Bring down the 5." }],
          hints:["Outside: `u^5`; inside: `3x + 1`.", "`5u^4 · u′`.", "`15(3x + 1)^4`."] },
        { id:"w4", skill:"Chain rule", goal:4, prompt:"If `y = f(g(x))`, then `dy/dx` = ?",
          options:[
            { t:"`f′(g(x)) · g′(x)`", ok:true, why:"Outside derivative at the inside, times the inside derivative." },
            { t:"`f′(x) · g′(x)`", why:"Evaluate `f′` at `g(x)`, not at `x`." },
            { t:"`f′(g′(x))`", why:"Multiply, don’t nest." },
            { t:"`f(g′(x))`", why:"Differentiate the outer function too." }],
          hints:["Outside first, inside unchanged.", "Then multiply by the inside’s derivative.", "`f′(g(x))g′(x)`."] },
        { id:"w5", skill:"Product rule", goal:5, prompt:"Differentiate `x^2(2x + 1)` using the product rule.",
          options:[
            { t:"`2x(2x + 1) + 2x^2`", ok:true, why:"`f′g + fg′`." },
            { t:"`2x · 2 = 4x`", why:"`(fg)′ ≠ f′g′`." },
            { t:"`2x(2x + 1)`", why:"Add `f · g′` too." },
            { t:"`6x^2 + 1`", why:"Expanded: `2x^3 + x^2`, derivative `6x^2 + 2x`." }],
          hints:["`f = x^2`, `g = 2x + 1`.", "`f′ = 2x`, `g′ = 2`.", "`2x(2x + 1) + 2x^2 = 6x^2 + 2x`."] },
        { id:"w6", skill:"Product rule", goal:5, prompt:"For which `x` is `(x - 2)(x + 5) · 7 = 0`?",
          options:[
            { t:"`x = 2` or `x = -5`", ok:true, why:"The constant 7 is never 0." },
            { t:"`x = 2`, −5 or 7", why:"`7 = 0` has no solution." },
            { t:"`x = -2` or `x = 5`", why:"`x - 2 = 0` at 2." },
            { t:"No solution, because of the 7", why:"A non-zero factor doesn’t stop the others from being 0." }],
          hints:["Which factors can be 0?", "Not 7.", "2 or −5."] }
      ],
      refreshers:{
        "Exponent and log laws":"`log_{b}(b^n) = n` and `b^{log_{b} x} = x`. Logs turn exponents into multipliers: `log(a^n) = n log a`.",
        "Chain rule":"Derivative of the outside, evaluated at the inside, times the derivative of the inside.",
        "Product rule":"`(fg)′ = f′g + fg′`. A factor that is never 0 can be ignored when solving `f′ = 0`."
      }
    }
  },
  explore:{
    heading:"Find the special base",
    intro:"Change the base of `y = @b{a}^x` and watch its slope graph. The slopes are a stretched copy of the function. Find the base where the copy lands exactly on the original.",
    modes:[{ id:"slope", t:"Slope graph" }, { id:"ratio", t:"Ratio" }, { id:"match", t:"Match" }],
    modeHow:{
      slope:"Move the probe: the slope at each `x` is plotted in teal, building the slope graph of `f` on the same axes.",
      ratio:"The table gives `f(x)`, the slope and slope ÷ `f(x)` at five points. Change the base and watch the last column.",
      match:"Both curves on one set of axes. The gauge shows how far apart they are: tune the base until they match."
    },
    txt:{
      base:"Base `@b{a}`", baseNote:"Here `@b{a}` is the base. Arrow keys move it by 0.001; use the buttons for bigger or finer steps.",
      setE:"Set to `e`", probe:"Probe `x`", probeNote:"Arrow keys move the probe by 0.1. You can also tap the graph.",
      showAll:"Show the whole slope graph", clear:"Clear trail",
      rows:{ fn:"Function", probe:"At the probe", ratio:"Ratio slope ÷ height", deriv:"Derivative", match:"Match" },
      same:"same at every `x`",
      stretch:"a vertical stretch of `f` by #1", comp:"a vertical compression of `f` by #1", equal:"the same graph as `f`",
      flip:"a reflection of `f` in the `x`-axis and a vertical #2 by #1", flipS:"stretch", flipC:"compression",
      below:"slope graph below `f`", above:"slope graph above `f`", matches:"<strong>matches</strong>: the slope graph lands on `f`", under:"slope graph below the `x`-axis (flipped)",
      tableCap:"Slope ÷ height at five points", tHead:["`x`", "`f(x)`", "slope", "slope ÷ `f(x)`"],
      gauge:"How far apart are the curves?", gap:"gap `|k - 1|` = #1", coarse:"0 to 1", fine:"zoomed: 0 to 0.01",
      gaugeOk:"✓ They match: `|k - 1| < 0.0005`.",
      key:"`f` in blue, its slope graph in teal, the tangent at the probe in black.",
      exact:"Exact answers for challenges 2 and 3", exactHow:"Type whole numbers or fractions. A blank first box means 1.",
      x2:"Challenge 2: `x =`", a3:"Challenge 3: `@b{a} =`", lnBox:"ln", eBox:"`e`"
    },
    predIntro:"Make a prediction first. Then the slope tool shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`@b{a} = 2`. What will the slope graph of `y = 2^x` look like?",
        options:[{ t:"The same shape, squashed vertically", ok:true }, { t:"Exactly the same graph" }, { t:"A parabola" }, { t:"A straight line" }],
        explain:"Slope ≈ 0.693 × height at every `x`: a vertical compression, not `x · 2^{x - 1}`." },
      { id:"p2", prompt:"`@b{a} = 3`. Will the ratio slope ÷ height be the same at `x = -2` and at `x = 2`?",
        options:[{ t:"Yes: about 1.10 at every `x`", ok:true }, { t:"No: larger at `x = 2`" }, { t:"No: smaller at `x = 2`" }, { t:"It equals `x`" }],
        explain:"The slope grows exactly as fast as the height, so their ratio never changes." },
      { id:"p3", prompt:"For base 2, `k ≈ 0.69`; for base 3, `k ≈ 1.10`. Where is the base with `k = 1`?",
        options:[{ t:"Between 2 and 3, closer to 3", ok:true }, { t:"Exactly 2.5" }, { t:"Above 3" }, { t:"Below 2" }],
        explain:"`k = 1` at `@b{a} ≈ 2.718`. That base is called `e`." },
      { id:"p4", prompt:"`@b{a} = 1/2`. What will the slope graph of `y = (1/2)^x` look like?",
        options:[{ t:"The same shape flipped below the `x`-axis", ok:true }, { t:"The same graph" }, { t:"Zero everywhere" }, { t:"It doesn’t exist" }],
        explain:"`(1/2)^x` decreases, so every slope is negative: `k ≈ -0.693`." }
    ],
    chalIntro:"Use the slope tool to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Set the base so that slope ÷ height = 1 to three decimal places.",
        why:"At `@b{a} ≈ 2.718` the slope graph lands on the curve: slope = height. This base is the number `e`.",
        hints:["`k < 1` at 2 and `k > 1` at 3.", "Try 2.7 and 2.75, then narrow down.", "`@b{a} ≈ 2.718`: that’s `e`."],
        msgs:{ a27:"`k ≈ 0.993`: still a little low; nudge up.", a272:"`k ≈ 1.0006`: just over.",
          low:"`k ≈ #1`: still too low; raise the base.", high:"`k ≈ #1`: too high; lower the base." } },
      { id:"tc2", goal:[2, 3], prompt:"Set the base to `e` (button). Move the probe to the point where the tangent has slope 5, then enter that `x` exactly.",
        why:"For `y = e^x`, slope = height, so `e^x = 5` and `x = ln 5 ≈ 1.609`.",
        hints:["For `y = e^x`, slope = `y`-value.", "So you need `e^x = 5`.", "`x = ln 5 ≈ 1.609`."],
        msgs:{ base:"Press <strong>Set to `e`</strong> first: this challenge needs the base `e`.",
          x5:"The slope at `x = 5` is `e^5 ≈ 148`. For `e^x`, slope = height, so solve `e^x = 5`.",
          x5e:"Solve `e^x = 5` with ln, not by dividing.",
          probe:"Move the probe until the slope readout is about 5.", blank:"Now enter that `x` exactly in the □ ln □ box.",
          approx:"Close, but enter it exactly: use ln.", general:"For `y = e^x`, slope = height: solve `e^x = 5`." } },
      { id:"tc3", goal:[1, 4], stretch:true, prompt:"Find the base `@b{a}` for which `y = @b{a}^x` has slope <strong>2</strong> at `x = 0`. Set it on the slider, then enter it exactly.",
        why:"`(e^2)^x = e^{2x}`, and `d/dx e^{2x} = 2e^{2x}`, which is 2 at `x = 0`. So `@b{a} = e^2 ≈ 7.39`.",
        hints:["At `x = 0`, slope = `k · @b{a}^0 = k`. You need `k = 2`.", "`(e^2)^x = e^{2x}`, and by the chain rule `d/dx e^{2x} = 2e^{2x}`.", "At `x = 0` that’s 2, so `@b{a} = e^2 ≈ 7.39`."],
        msgs:{ a2e:"Doubling the base doesn’t double `k`: for `2e`, `k ≈ 1.69`. Squaring the base does.",
          a2:"For base 2 the slope at 0 is about 0.693.",
          slider:"Move the probe to `x = 0` and tune the base until the slope there is 2.", blank:"Now enter the base exactly in the □`e`^□ box.",
          approx:"Close, but enter it exactly with `e`.", general:"Not yet: the slope at `x = 0` must be 2." } }
    ]
  },
  part3:{
    slug:"ln", name:"eˣ and ln",
    heading:"`e^x` and `ln x`: an inverse pair",
    intro:"Explore found the special base `e`. Here you meet its inverse, the natural logarithm `ln x = log_{e} x`: see the reflection, practise undoing, use ln to solve the equations that slope questions produce, and check a chain-rule derivative against measured slopes. Then try the quick check.",
    st1:{ title:"Station 1: The mirror",
      text:"`y = e^x` and `y = ln x` are reflections of each other in the line `y = x`. Step through the points on `y = e^x` (or tap one on the graph) to see each one’s mirror image on `y = ln x`.",
      pts:[{ a:"0", b:"1", av:0, bv:1 }, { a:"1", b:"e", av:1, bv:E }, { a:"ln 2", b:"2", av:Math.LN2, bv:2 }],
      pair:"`(#1, #2)` on `y = e^x` ↔ `(#2, #1)` on `y = ln x`: the coordinates swap.",
      head:["", "`y = e^x`", "`y = ln x`"], rows:[["Domain", "all real `x`", "`x > 0`"], ["Range", "`y > 0`", "all real `y`"]],
      tableNote:"The domain and range swap, just as the coordinates do.",
      alg:["`e^{ln x} = x` for `x > 0`: `ln x` is the power of `e` that gives `x`.", "`ln(e^x) = x` for every `x`: the power of `e` in `e^x` is `x`.", "So `(p, q)` on `y = e^x` means `(q, p)` on `y = ln x`."],
      graph:"Graph of y = e to the x in blue, y = ln x in teal and the dotted line y = x." },
    st2:{ title:"Station 2: The undo machine",
      text:"ln and `e^{( )}` undo each other. Simplify each expression: tap the chip that is equal to it.",
      chips:[
        { id:"u1", ex:"`e^{ln 7}`", choices:[{ t:"7", ok:true, fb:"`e^{( )}` undoes ln." }, { t:"`ln 7`", fb:"`e^{( )}` undoes ln: only the 7 is left." }, { t:"`e^7`", fb:"The exponent is `ln 7`, not 7." }, { t:"`7e`", fb:"`e^{( )}` undoes ln: only the 7 is left." }] },
        { id:"u2", ex:"`ln(e^{-3x})`", choices:[{ t:"`-3x`", ok:true, fb:"ln undoes `e^{( )}`." }, { t:"`e^{-3x}`", fb:M5 }, { t:"`-3`", fb:"Keep the `x`: the exponent is `-3x`." }, { t:"`3x`", fb:"Keep the sign: the exponent is `-3x`." }] },
        { id:"u3", ex:"`e^{2 ln 3}`", choices:[{ t:"9", ok:true, fb:"`2 ln 3 = ln 3^2 = ln 9`, so `e^{2 ln 3} = 9`." }, { t:"6", fb:"Use the power law first: `2 ln 3 = ln 9`." }, { t:"`e^6`", fb:"Use the power law first: `2 ln 3 = ln 9`." }, { t:"`2 ln 3`", fb:"`e^{( )}` undoes ln once you write `2 ln 3 = ln 9`." }] },
        { id:"u4", ex:"`ln(1/e)`", choices:[{ t:"−1", ok:true, fb:"`1/e = e^{-1}`, so `ln(1/e) = -1`." }, { t:"1", fb:"Write `1/e = e^{-1}`: the power is −1." }, { t:"`1/e`", fb:"ln undoes `e^{( )}`: write `1/e = e^{-1}`." }, { t:"0", fb:"`ln 1 = 0`, but `1/e ≠ 1`." }] }
      ],
      solveTitle:"Now solve. Type whole numbers or fractions in the boxes (a blank box in front of ln means 1), then press Check.",
      solve:[
        { id:"v1", eq:"Solve `e^{2x} = 7`.", frame:"lnover", lab:["`x =` (ln", ") /"], aria:["number after ln", "number to divide by"],
          good:"<strong>✓ Right:</strong> `2x = ln 7`, so `x = (ln 7)/2 ≈ 0.973`.",
          half:"`(ln 7)/2` isn’t `ln(7/2)`. Take ln of both sides first, `2x = ln 7`, then divide by 2.",
          two:"`ln 7` is `2x`. Divide by 2.", general:"Take ln of both sides: `2x = ln 7`." },
        { id:"v2", eq:"Solve `5e^{x - 1} = 20`.", frame:"plusln", lab:["`x =`", "+", "ln"], aria:["number in front", "number in front of ln", "number after ln"],
          good:"<strong>✓ Right:</strong> `e^{x - 1} = 4`, so `x - 1 = ln 4` and `x = 1 + ln 4 ≈ 2.386`.",
          div5:"Divide by 5 first: `e^{x - 1} = 4`.", add1:"`x - 1 = ln 4`, so add 1: `x = 1 + ln 4`.",
          quarter:"`ln(20/5)` is `ln 4`, but you can’t split `ln(20)/5`: divide by 5 before taking ln.",
          general:"Divide by 5, take ln of both sides, then add 1." }
      ],
      fill:"Fill in the boxes first.", err:"Type numbers only, such as 7, 2 or 1/2." },
    st3:{ title:"Station 3: The chain rule, measured",
      text:"`y = e^{x^2}` with the slope tool. The tool measures each slope with a tiny difference quotient (`h = 0.0001`).",
      measure:"Measure the slope at `x = 1`", measured:"Measured slope at `x = #1`: ≈ #2",
      predict:"The chain rule gives `dy/dx = 2xe^{x^2}`. What does it predict at `x = 1`?",
      choices:[
        { t:"`2(1)e^{1} = 2e ≈ 5.437`", ok:true, fb:"<strong>✓ Right:</strong> the measured slope ≈ 5.437 matches `2e`. Now try other points." },
        { t:"`e^{1} = e ≈ 2.718`", fb:"That forgets the chain factor. " + M2 },
        { t:"`1^2 e^{1^2 - 1} = 1`", fb:M1 },
        { t:"`e^{2(1)} = e^2 ≈ 7.389`", fb:"Don’t replace the exponent; multiply by its derivative." }],
      pick:"Tap a point to compare the measured slope with the formula", formula:"Formula: `2(#1)e^{#2} = #3`", matchTxt:"✓ matches",
      neg:"At `x = -1` the measured slope is −5.437, matching `-2e`: the factor `2x` is negative there, and `e^{x^2}` is still positive.",
      graph:"Graph of y = e to the x squared with the tangent at the probe." },
    quickCheck:{
      title:"Quick check", summary:"eˣ and ln x quick check",
      items:[
        { id:"q1", goal:3, prompt:"`ln(e^4)` = ?",
          choices:[{ t:"4", ok:true, fb:"Right. ln undoes `e^{( )}`." }, { t:"`e^4`", fb:"ln undoes `e^{( )}`." }, { t:"`4e`", fb:"ln undoes `e^{( )}`." }, { t:"1", fb:"ln undoes `e^{( )}`." }] },
        { id:"q2", goal:3, prompt:"Solve `e^x = 10`.",
          choices:[{ t:"`x = ln 10`", ok:true, fb:"Right. Take ln of both sides." }, { t:"`x = 10/e`", fb:"Take ln of both sides." }, { t:"`x = log 10`", fb:"Take ln of both sides." }, { t:"`x = e^{10}`", fb:"Take ln of both sides." }] },
        { id:"q3", goal:4, prompt:"`d/dx e^{-2x}` = ?",
          choices:[{ t:"`-2e^{-2x}`", ok:true, fb:"Right. Multiply by the exponent’s derivative, −2." }, { t:"`e^{-2x}`", fb:"Multiply by the exponent’s derivative, −2." }, { t:"`-2xe^{-2x - 1}`", fb:"Multiply by the exponent’s derivative, −2." }, { t:"`2e^{-2x}`", fb:"Multiply by the exponent’s derivative, −2." }] },
        { id:"q4", goal:3, prompt:"The graph of `y = ln x` is the graph of `y = e^x` …",
          choices:[{ t:"reflected in `y = x`", ok:true, fb:"Right. Inverse functions reflect in `y = x`." }, { t:"reflected in the `x`-axis", fb:"Inverse functions reflect in `y = x`." }, { t:"shifted right 1", fb:"Inverse functions reflect in `y = x`." }, { t:"stretched by `e`", fb:"Inverse functions reflect in `y = x`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[2, 4, 5],
        instruction:"Match each function with its derivative. Three cards on the right have no partner.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`e^{4x}`", goal:4, why:"Chain factor 4: `4e^{4x}`." },
          { id:"l2", t:"`e^{x^2}`", goal:4, why:"The exponent’s derivative is `2x`: `2xe^{x^2}`." },
          { id:"l3", t:"`xe^x`", goal:5, why:"Product rule: `1 · e^x + x · e^x = (x + 1)e^x`." },
          { id:"l4", t:"`e^x/x`", goal:5, why:"Quotient rule: `(e^x · x - e^x · 1)/x^2 = (x - 1)e^x/x^2`.",
            hints:["Quotient rule.", "`(e^x · x - e^x · 1)/x^2`.", "`(x - 1)e^x/x^2`."] },
          { id:"l5", t:"`e^{-x}`", goal:4, why:"Chain factor −1: `-e^{-x}`." },
          { id:"l6", t:"`5e^x + x^5`", goal:2, why:"`d/dx e^x = e^x`; the power rule only for `x^5`." },
          { id:"l7", t:"`e^{3x + 1}`", goal:4, why:"Chain factor 3: `3e^{3x + 1}`." },
          { id:"l8", t:"`x^2e^{-x}`", goal:5, why:"Product rule with a chain factor: `2xe^{-x} - x^2e^{-x} = (2x - x^2)e^{-x}`.",
            hints:["Product: `x^2` times `e^{-x}`.", "`2x · e^{-x} + x^2 · (-e^{-x})`.", "`(2x - x^2)e^{-x}`."] }
        ],
        right:[
          { id:"r1", t:"`4e^{4x}`" }, { id:"r2", t:"`2xe^{x^2}`" }, { id:"r3", t:"`(x + 1)e^x`" }, { id:"r4", t:"`(x - 1)e^x/x^2`" },
          { id:"r5", t:"`-e^{-x}`" }, { id:"r6", t:"`5e^x + 5x^4`" }, { id:"r7", t:"`3e^{3x + 1}`" }, { id:"r8", t:"`(2x - x^2)e^{-x}`" },
          { id:"r9", t:"`e^{4x}`" }, { id:"r10", t:"`e^x`" }, { id:"r11", t:"`5xe^{x - 1} + 5x^4`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r9":"The chain factor 4 is missing.", "l3|r10":"`xe^x` is a product: `1 · e^x + x · e^x`.", "l6|r11":"The power rule doesn’t apply to `e^x`." },
        wrongDefault:"Identify the outside and inside, or the two factors." },
      { id:"rates", type:"custom", title:"Tangents and rates", summary:"Tangents and rates", star:true, goal:[3, 4, 5],
        instruction:"Find tangent lines, horizontal tangents and critical points with exact values. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions, and `e` where you need it (`e`, `2e`, `1/e`, `e^-1`, `4e^-2`). Separate several values with commas. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as −3, 1/2, `e`, `1/e` or `4e^-2`.",
          exact:"Close, but give the exact value with `e` (such as `1/e` or `e^-2`), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"s1", goal:[4, 5], prompt:"Equation of the tangent to `y = e^{2x}` at `x = 0`.",
            boxes:[{ k:"t", line:true }], answer:{ t:[2, 1] }, display:"`y = 2x + 1`",
            wrong:[{ k:"t", eq:[1, 1], fb:"The slope is `2e^0 = 2`." }],
            why:"`y′ = 2e^{2x}`, so the slope at 0 is 2, and the point is (0, 1)." },
          { id:"s2", goal:5, prompt:"The point where `f(x) = xe^{-x}` has a horizontal tangent.",
            boxes:[{ k:"p", pre:"Point", pt:true }], answer:{ p:[1, Math.exp(-1)] }, display:"`(1, e^{-1})`",
            wrong:[{ k:"p", eq:[0, 0], fb:"`f′ = (1 - x)e^{-x}`, zero only at `x = 1`." }],
            why:"`f′ = (1 - x)e^{-x}` is zero only at `x = 1`, and `f(1) = e^{-1}`." },
          { id:"s3", goal:5, star:true, prompt:"Find and classify the critical points of `f(x) = x^2e^x`.",
            boxes:[{ k:"max", pre:"Local max at", pt:true }, { k:"min", pre:"Local min at", pt:true }], answer:{ max:[-2, 4 * Math.exp(-2)], min:[0, 0] },
            display:"local max `(-2, 4e^{-2})`; local min (0, 0)",
            general:"`f′ = x(x + 2)e^x`; `e^x > 0`, so the sign comes from `x(x + 2)`.",
            why:"`f′ = x(x + 2)e^x`: + on `(-∞, -2)`, − on `(-2, 0)`, + on `(0, ∞)`." },
          { id:"s4", goal:4, star:true, prompt:"Find every `k` for which `y = e^{kx}` satisfies `y″ - 5y′ + 6y = 0`.",
            boxes:[{ k:"k", pre:"`k =`", list:true }], answer:{ k:[2, 3] }, display:"`k = 2` or `k = 3`",
            general:"`y′ = ke^{kx}`, `y″ = k^2e^{kx}`: `(k^2 - 5k + 6)e^{kx} = 0`.",
            why:"`e^{kx} ≠ 0`, so `k^2 - 5k + 6 = 0`: `(k - 2)(k - 3) = 0`.",
            hints:["Find `y′` and `y″`.", "Substitute: `e^{kx}(k^2 - 5k + 6) = 0`.", "`e^{kx} ≠ 0`, so `k^2 - 5k + 6 = 0`: `k = 2` or 3."] },
          { id:"s5", goal:5, star:true, prompt:"The tangent to `y = e^x` at `x = a` passes through the origin. Find the point of tangency.",
            boxes:[{ k:"p", pre:"Point", pt:true }], answer:{ p:[1, E] }, display:"`(1, e)`",
            wrong:[{ k:"p", eq:[0, 1], fb:"The tangent at 0 is `y = x + 1`, which misses the origin." }],
            why:"The tangent at `x = a` is `y - e^a = e^a(x - a)`; (0, 0) on it gives `a = 1`.",
            hints:["The tangent at `x = a` is `y - e^a = e^a(x - a)`.", "Put in (0, 0): `-e^a = -ae^a`.", "Divide by `e^a > 0`: `a = 1`, so the point is `(1, e)`."] },
          { id:"s6", goal:[4, 5], star:true, prompt:"Where does the tangent to `y = e^{x/2}` at `x = 2` cross the `x`-axis?",
            boxes:[{ k:"x", pre:"`x =`" }], answer:{ x:0 }, display:"`x = 0`",
            wrong:[{ k:"x", eq:4, fb:"Slope `(1/2)e`, point `(2, e)`: `0 - e = (e/2)(x - 2)` gives `x = 0`." }],
            why:"Slope `(1/2)e`, point `(2, e)`: `0 - e = (e/2)(x - 2)` gives `x = 0`." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Yusuf", how:"", goal:[2, 3, 4],
        instruction:"Yusuf made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Differentiate `y = e^{x^3 - 2x}`.",
            steps:["The outer function is `e^u`; the inner function is `u = x^3 - 2x`.", "`d/du e^u = e^u`.", "So `dy/dx = e^{x^3 - 2x}`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Multiply by `u′ = 3x^2 - 2`: `dy/dx = (3x^2 - 2)e^{x^3 - 2x}`.", ok:true, why:"The chain rule multiplies by the inner derivative." },
              { t:"`dy/dx = (x^3 - 2x)e^{x^3 - 2x - 1}`.", why:M1 },
              { t:"`dy/dx = e^{3x^2 - 2}`.", why:"Don’t replace the exponent; multiply by its derivative." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["What does the chain rule multiply by?", "The inner derivative.", "`(3x^2 - 2)e^{x^3 - 2x}`."] },
          { id:"e2", goal:2, task:"Differentiate `y = e^x + x^e`.",
            steps:["`e^x` is exponential, so its derivative is `e^x`.", "`x^e` is also exponential, so its derivative is `x^e`.", "So `dy/dx = e^x + x^e`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows from step 2."],
            fixes:[
              { t:"`x^e` is a power function (variable base, constant exponent `e ≈ 2.718`). The power rule gives `e · x^{e - 1}`, so `dy/dx = e^x + ex^{e - 1}`.", ok:true, why:"The variable is in the base, so it’s like `x^3`." },
              { t:"Its derivative is 0, because `e` is a constant.", why:M4 },
              { t:"Its derivative is `x^e ln x`.", why:"That would be for a variable exponent." },
              { t:"Step 2 is correct.", why:"Exponential means the variable is in the exponent." }],
            hints:["Where is the variable in `x^e`?", "In the base: it’s like `x^3`.", "Power rule: `ex^{e - 1}`."] },
          { id:"e3", goal:3, task:"Find the point on `y = e^{2x}` where the tangent has slope 6.",
            steps:["`dy/dx = 2e^{2x}`.", "`2e^{2x} = 6`, so `e^{2x} = 3`.", "Take ln of both sides: `2x = ln 3`, so `x = ln(3/2)`.", "The point is `(ln(3/2), 3)`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses step 3’s value."],
            fixes:[
              { t:"`2x = ln 3` gives `x = (ln 3)/2`. The point is `((ln 3)/2, 3)`.", ok:true, why:"Divide both sides by 2." },
              { t:"`x = ln 3 - 2`.", why:"Divide by 2, don’t subtract." },
              { t:"`x = 3/2`.", why:"ln is needed to undo `e^{( )}`." },
              { t:"Step 3 is correct.", why:M5 + " `(ln 3)/2 ≈ 0.549`, but `ln(3/2) ≈ 0.405`." }],
            hints:["From `2x = ln 3`, what’s `x`?", "Divide both sides by 2.", "`(ln 3)/2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you tuned the base: that every exponential’s slope graph is a stretched copy, or where `e` turned up?" },
      { id:"j2", q:"In your own words, why is `d/dx e^x = e^x`, and what does it mean on the graph?" },
      { id:"j3", q:"Explain to a friend how ln helps you find where the slope of `e^{2x}` is 6." },
      { id:"j4", q:"Which rule with `e^x` do you still mix up (power rule vs exponential, the chain factor, products)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"`d/dx (4e^x - x^4)` = ?", options:[
          { t:"`4e^x - 4x^3`", ok:true, why:"`d/dx e^x = e^x`." },
          { t:"`4xe^{x - 1} - 4x^3`", why:M1 },
          { t:"`-4x^3`", why:M4 },
          { t:"`4e^x - x^4`", why:"`x^4` must be differentiated too." }] },
        b:{ prompt:"`d/dx (x^3 + 7e^x)` = ?", options:[
          { t:"`3x^2 + 7e^x`", ok:true, why:"`d/dx e^x = e^x`, so `7e^x` stays `7e^x`." },
          { t:"`3x^2 + 7xe^{x - 1}`", why:M1 },
          { t:"`3x^2`", why:M4 },
          { t:"`3x^2 + 7e^x + 7`", why:"The derivative of `7e^x` is just `7e^x`." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"`d/dx e^{5x - 2}` = ?", options:[
          { t:"`5e^{5x - 2}`", ok:true, why:"Chain factor 5." },
          { t:"`e^{5x - 2}`", why:M2 },
          { t:"`(5x - 2)e^{5x - 3}`", why:M1 },
          { t:"`5e^5`", why:"Keep the whole exponent." }] },
        b:{ prompt:"`d/dx e^{4 - 3x}` = ?", options:[
          { t:"`-3e^{4 - 3x}`", ok:true, why:"Chain factor −3." },
          { t:"`e^{4 - 3x}`", why:M2 },
          { t:"`(4 - 3x)e^{3 - 3x}`", why:M1 },
          { t:"`3e^{4 - 3x}`", why:"The inner derivative is −3." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Simplify `ln(e^{4x}) + e^{ln 3}`.", options:[
          { t:"`4x + 3`", ok:true, why:"Each pair undoes." },
          { t:"`e^{4x} + ln 3`", why:M5 },
          { t:"`4x + ln 3`", why:"`e^{ln 3} = 3`." },
          { t:"`4 + 3x`", why:"`ln(e^{4x}) = 4x`." }] },
        b:{ prompt:"Simplify `e^{ln 5} - ln(e^{2x})`.", options:[
          { t:"`5 - 2x`", ok:true, why:"Each pair undoes." },
          { t:"`ln 5 - e^{2x}`", why:M5 },
          { t:"`5 - e^{2x}`", why:"`ln(e^{2x}) = 2x`." },
          { t:"`5 - 2`", why:"Keep the `x`." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"At which `x`-values does `f(x) = (x^2 - 3)e^x` have horizontal tangents?", options:[
          { t:"`x = -3` and `x = 1`", ok:true, why:"`f′ = (x^2 + 2x - 3)e^x = (x + 3)(x - 1)e^x`." },
          { t:"`x = -√3` and `x = √3`", why:"Those make `f = 0`, not `f′ = 0`." },
          { t:"`x = 0` only", why:"That’s from `2x · e^x` alone; the product rule adds `(x^2 - 3)e^x`." },
          { t:"`x = -3`, `x = 1`, and wherever `e^x = 0`", why:"`e^x` is never 0." }] },
        b:{ prompt:"At which `x`-values does `f(x) = (x^2 - 8)e^x` have horizontal tangents?", options:[
          { t:"`x = -4` and `x = 2`", ok:true, why:"`f′ = (x^2 + 2x - 8)e^x = (x + 4)(x - 2)e^x`." },
          { t:"`x = -2√2` and `x = 2√2`", why:"Those make `f = 0`, not `f′ = 0`." },
          { t:"`x = 0` only", why:"That’s from `2x · e^x` alone; the product rule adds `(x^2 - 8)e^x`." },
          { t:"`x = -4`, `x = 2`, and wherever `e^x = 0`", why:"`e^x` is never 0." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"For `f(x) = 4^x`, the slope at `x = 0` is about 1.386. What is the slope at `x = 3`?", use:USE, options:[
          { t:"About 1.386 × 64", ok:true, why:"Slope = `k` × height, and `f(3) = 64`." },
          { t:"About 1.386", why:"The ratio is constant, not the slope." },
          { t:"`3 × 4^2 = 48`", why:M1 },
          { t:"64", why:"Slope = height only for base `e`." }] },
        b:{ prompt:"For `f(x) = 3^x`, the slope at `x = 0` is about 1.099. What is the slope at `x = 2`?", use:USE, options:[
          { t:"About 1.099 × 9", ok:true, why:"Slope = `k` × height, and `f(2) = 9`." },
          { t:"About 1.099", why:"The ratio is constant, not the slope." },
          { t:"`2 × 3^1 = 6`", why:M1 },
          { t:"9", why:"Slope = height only for base `e`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"What is the equation of the tangent to `y = (x + 1)e^{2x}` at `x = 0`?", options:[
          { t:"`y = 3x + 1`", ok:true, why:"`y′ = (2x + 3)e^{2x}`; slope 3 at 0; point (0, 1)." },
          { t:"`y = 2x + 1`", why:"That differentiates only `e^{2x}`. " + M3 },
          { t:"`y = x + 1`", why:"That differentiates only `x + 1`. " + M3 },
          { t:"`y = 3x`", why:"`y(0) = 1`, not 0." }] },
        b:{ prompt:"What is the equation of the tangent to `y = (x + 2)e^{-x}` at `x = 0`?", options:[
          { t:"`y = -x + 2`", ok:true, why:"`y′ = -(x + 1)e^{-x}`; slope −1; point (0, 2)." },
          { t:"`y = -2x + 2`", why:"That differentiates only `e^{-x}`. " + M3 },
          { t:"`y = x + 2`", why:"That differentiates only `x + 2`. " + M3 },
          { t:"`y = -x`", why:"`y(0) = 2`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which best describes the relationship between `y = 3^x` and its derivative?", options:[
          { t:"“The derivative is a vertical stretch of `y = 3^x`: at every `x`, the slope is about 1.10 times the height.”", ok:true, why:"Slope ÷ height is the same at every `x`: about 1.10 for base 3." },
          { t:"“The derivative is `x · 3^{x - 1}`.”", why:M1 },
          { t:"“The derivative equals `3^x`.”", why:M6 },
          { t:"“The derivative is `3^x` shifted to the left.”", why:"The ratio of slope to height is constant: a stretch, not a shift." }] },
        b:{ prompt:"Which best describes the relationship between `y = 2^x` and its derivative?", options:[
          { t:"“The derivative is a vertical compression of `y = 2^x`: at every `x`, the slope is about 0.69 times the height.”", ok:true, why:"Slope ÷ height is the same at every `x`: about 0.69 for base 2." },
          { t:"“The derivative is `x · 2^{x - 1}`.”", why:M1 },
          { t:"“The derivative equals `2^x`.”", why:M6 },
          { t:"“The derivative is `2^x` shifted to the right.”", why:"The ratio of slope to height is constant: a compression, not a shift." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `d/dx e^x = e^x`?", options:[
          { t:"“For every `y = a^x`, slope ÷ height is the same at every `x`; `e` is the base for which that ratio is exactly 1.”", ok:true, why:"That’s what tuning the base shows: `k = 1` only for `e`." },
          { t:"“Because `e` is a constant, and constants don’t change.”", why:M4 },
          { t:"“By the power rule: bring down the exponent.”", why:M1 },
          { t:"“Because `e^x` passes through (0, 1).”", why:"Every `a^x` passes through (0, 1)." }] },
        b:{ prompt:"A student says the tangent to `y = e^x` at `(2, e^2)` has slope 2. Which response is best?", options:[
          { t:"“For `y = e^x` the slope at any point equals the `y`-value, so the slope at `(2, e^2)` is `e^2 ≈ 7.39`, not 2.”", ok:true, why:"Slope = height for `e^x`." },
          { t:"“Correct: the slope equals `x`.”", why:M6 },
          { t:"“The slope is `2e`: bring down the exponent.”", why:M1 },
          { t:"“The slope is 0, because `e` is a constant.”", why:M4 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A bacteria culture has `P(t) = 500e^{0.4t}` cells after `t` hours. How fast is it growing at `t = 5`?", use:USE, options:[
          { t:"About 1478 cells per hour", ok:true, why:"`P′ = 200e^{0.4t}`; `P′(5) = 200e^2 ≈ 200 × 7.39`." },
          { t:"About 3695 cells per hour", why:"That’s `P(5) = 500e^2`: the size, not the rate." },
          { t:"About 3 cells per hour", why:"`0.4e^2` forgets the 500." },
          { t:"200 cells per hour", why:"That’s the rate at `t = 0`." }] },
        b:{ prompt:"`P(t) = 300e^{0.5t}` cells. How fast is it growing at `t = 4`?", use:USE, options:[
          { t:"About 1109 cells per hour", ok:true, why:"`P′ = 150e^{0.5t}`; `150e^2 ≈ 150 × 7.39`." },
          { t:"About 2217 cells per hour", why:"That’s `P(4) = 300e^2`: the size, not the rate." },
          { t:"About 4 cells per hour", why:"`0.5e^2` forgets the 300." },
          { t:"150 cells per hour", why:"That’s the rate at `t = 0`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Tea cools as `T(t) = 20 + 70e^{-0.1t}` °C after `t` minutes. When is it cooling at 3.5 °C per minute?", use:USE, options:[
          { t:"After `10 ln 2 ≈ 6.9` min", ok:true, why:"`T′ = -7e^{-0.1t} = -3.5` gives `e^{-0.1t} = 1/2`, so `t = 10 ln 2`." },
          { t:"After `ln 2 ≈ 0.69` min", why:"`-0.1t = -ln 2` gives `t = 10 ln 2`." },
          { t:"After 5 min", why:"Exponential decay doesn’t halve linearly." },
          { t:"Never: it always cools at 7 °C per minute", why:"The rate shrinks as `e^{-0.1t}` shrinks. " + M6 }] },
        b:{ prompt:"`T(t) = 22 + 60e^{-0.2t}` °C. When is it cooling at 6 °C per minute?", use:USE, options:[
          { t:"After `5 ln 2 ≈ 3.5` min", ok:true, why:"`T′ = -12e^{-0.2t} = -6` gives `e^{-0.2t} = 1/2`, so `t = 5 ln 2`." },
          { t:"After `ln 2 ≈ 0.69` min", why:"`-0.2t = -ln 2` gives `t = 5 ln 2`." },
          { t:"After 2.5 min", why:"Exponential decay doesn’t halve linearly." },
          { t:"Never: it always cools at 12 °C per minute", why:"The rate shrinks as `e^{-0.2t}` shrinks. " + M6 }] } }
    ]
  },
  task:{
    title:"Peak designer", summary:"Peak designer",
    statement:"<p>Choose whole numbers `p`, `q`, `r` so that `f(x) = (px + q)e^{rx}` meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`f` has a horizontal tangent at `x = 1`.</li><li>That point is a local maximum.</li><li>The `y`-intercept is positive.</li></ol></div>" +
      "<p class=\"tiny muted\">`p`, `q` and `r` are whole numbers from −5 to 5, with `p ≠ 0` and `r ≠ 0`. The graph, `f′(x)` and the tangent at `x = 1` update as you go.</p>",
    checks:["Horizontal tangent at `x = 1`", "A local max there", "Positive `y`-intercept"],
    tips:["`e^{rx}` is never 0, so `f′(1) = 0` needs `pr · 1 + p + qr = 0`.",
      "The factor `prx + p + qr` is a line in `x`. For + then −, its slope `pr` must be negative.",
      "`f(0) = q · e^0 = q`."],
    explainPrompt:"Explain why `e^{rx}` never affects where the horizontal tangent is, and how you made sure the point is a maximum.",
    vocab:"Use the words product rule, horizontal tangent, sign change and e to any power is positive.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:5,
    after3:"Line 1 gives `q = -p(1 + r)/r`. With `q > 0` and `pr < 0`, `r` must be positive and `p` negative. The maximum value is `f(1) = (-p/r)e^r`: `e`, `2e`, `e^2`, `e^3` and `e^4`.",
    labels:{ p:"`p`", q:"`q`", r:"`r`", range:"(−5 to 5)", rangeNZ:"(−5 to 5, not 0)",
      invalid:"Choose whole numbers from −5 to 5 for `p`, `q` and `r`, with `p ≠ 0` and `r ≠ 0`.",
      fRow:"`f(x)`", dRow:"`f′(x)`", d1:"`f′(1)`", f0:"`y`-intercept `f(0)`", tan:"Tangent at `x = 1`",
      flat:"horizontal", graph:"Graph of `f` with the tangent at `x = 1`" }
  },
  cards:[
    ["`d/dx a^x` (the pattern)", "`k · a^x`, with `k` = slope at 0: the derivative is a vertical stretch of `a^x`."],
    ["Slope ÷ height for `a^x`", "Constant: ≈ 0.693 for base 2, ≈ 1.099 for base 3."],
    ["`e`", "≈ 2.718: the base for which slope ÷ height = 1."],
    ["`d/dx e^x`", "`e^x`: the slope at any point equals the `y`-value."],
    ["`d/dx e^{g(x)}`", "`g′(x) e^{g(x)}`."],
    ["`ln x`", "`log_{e} x`: the inverse of `e^x`; graphs reflect in `y = x`."],
    ["Undoing", "`e^{ln x} = x` (`x > 0`); `ln(e^x) = x`."],
    ["Solve `e^{2x} = 7`", "`2x = ln 7`, so `x = (ln 7)/2` (not `ln(7/2)`)."],
    ["`e` to any power, `e^{( )}`", "Always positive: it’s never a source of zeros."],
    ["`xe^x`", "Product rule: `(1 + x)e^x`."],
    ["`x^e` vs `e^x`", "`x^e` is a power function: `ex^{e - 1}`. `e^x` is exponential: `e^x`."],
    ["Growth model `Ae^{kt}`", "Rate `kAe^{kt}`: proportional to the amount present."]
  ]
};
