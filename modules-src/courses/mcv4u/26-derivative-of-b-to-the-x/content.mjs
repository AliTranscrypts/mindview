// MCV4U 26 The Derivative of y = bˣ. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/26-derivative-of-b-to-the-x.md
// Leibniz d/dx built by hand so the d stays upright (as in MCV4U 08/10/14)
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3), written with the item's own base where the plan's example differs
const M1 = (b) => "The power rule is for `x^n`, where the exponent is fixed. In `" + b + "^x` the exponent is the variable.";
const M2 = (b, v) => "Only `e^x` is its own derivative. For `" + b + "^x` the slope is `" + b + "^x` times `ln " + b + "`" + (v ? " ≈ " + v : "") + ".";
const M3 = "The constant is the <strong>natural</strong> log of the base, because `b = e^{ln b}`.";
const M5 = "`ln(1/2) = -ln 2 < 0`. A base between 0 and 1 gives a negative slope everywhere.";
const M6 = "Check at `x = 0`: the slope of `2^x` is about 0.69, which is `ln 2`, not `1/ln 2 ≈ 1.44`.";
const USE3 = "`ln 2 ≈ 0.693`, `ln 3 ≈ 1.099`, `ln 10 ≈ 2.303`";

export default {
  id:"26-derivative-of-b-to-the-x",
  kind:"topic",
  title:"The derivative of y = bˣ",
  topic:"The Derivative of y = bˣ",
  readyTopic:"the derivative of `y = b^x`",
  hero:{
    eq:'<span class="bx-heq"><span class="m"><span class="fnm">d</span>/<span class="fnm">d</span><i>x</i></span> `@b{b}^x = @b{b}^x · ln @b{b}`</span>',
    eqLabel:"d by d x of b to the x equals b to the x times ln b",
    eqSize:"md",
    headline:"Slope = height × one constant",
    text:"In module 25, `e^x` was its own derivative. Every other exponential is almost as simple: its slope at any point is its height multiplied by the same constant, the <strong>natural logarithm of the base</strong>. That’s why exponentials model <strong>growth</strong> and <strong>decay</strong>: the bigger the amount, the faster it changes.",
    fig:{ shape:"wide", aria:"The graph of y = 2ˣ with a tangent line that moves from x = 0 to x = 1 to x = 2. At each point, slope divided by height is about 0.69, which is ln 2." }
  },
  goals:[
    "I can explain why the slope of `y = b^x` is a constant multiple of its height, and identify the constant as `ln b`.",
    "I can differentiate `b^x` and `b^{g(x)}` using " + DDX + " `b^x = b^x ln b` and the chain rule.",
    "I can rewrite `b^x` as `e^{x ln b}` and use it to derive the rule.",
    "I can use the sign and size of `ln b` to compare how fast exponentials grow or decay.",
    "I can solve doubling and half-life problems with instantaneous rates, in exact form and with given values."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"<i>e</i> and ln", goal:3, prompt:"Simplify `e^{ln 7}`.",
          options:[
            { t:"7", ok:true, why:"`e^x` and `ln x` undo each other." },
            { t:"`ln 7`", why:"That stops halfway. `e` raised to `ln 7` undoes the ln." },
            { t:"`e^7`", why:"That drops the ln. The exponent is `ln 7`, not 7." },
            { t:"`7e`", why:"There’s no product here." }],
          hints:["What does `ln 7` mean?", "`ln 7` is the power of `e` that gives 7.", "So `e^{ln 7} = 7`."] },
        { id:"w2", skill:"<i>e</i> and ln", goal:3, prompt:"Which expression equals `5^x` for every `x`?",
          options:[
            { t:"`e^{x ln 5}`", ok:true, why:"`5 = e^{ln 5}`, so `5^x = (e^{ln 5})^x = e^{x ln 5}`." },
            { t:"`e^{5 ln x}`", why:"That swaps the base and the exponent. That’s `x^5`." },
            { t:"`5e^x`", why:"Try `x = 0`: `5e^0 = 5`, but `5^0 = 1`." },
            { t:"`ln(5^x)`", why:"That’s `x ln 5`, a straight line." }],
          hints:["Write 5 as a power of `e`.", "`5 = e^{ln 5}`.", "Power of a power: multiply the exponents."] },
        { id:"w3", skill:"Chain rule with <i>e</i>", goal:2, prompt:"Differentiate `y = e^{3x}`.",
          options:[
            { t:"`3e^{3x}`", ok:true, why:"Outside: `e^{3x}`; inside: 3." },
            { t:"`e^{3x}`", why:"The exponent changes 3 times as fast as `x`." },
            { t:"`3x e^{3x - 1}`", why:"The power rule doesn’t apply: the exponent is variable." },
            { t:"`e^3`", why:"That’s a constant; `y` isn’t." }],
          hints:["The outer function is `e^u`.", "`dy/du = e^u`, `du/dx = 3`.", "`3e^{3x}`."] },
        { id:"w4", skill:"Chain rule with <i>e</i>", goal:2, prompt:"Differentiate `y = e^{x^2}`.",
          options:[
            { t:"`2x e^{x^2}`", ok:true, why:"`e^u` times `u′ = 2x`." },
            { t:"`e^{x^2}`", why:"Multiply by the inside’s derivative." },
            { t:"`x^2 e^{x^2 - 1}`", why:"That’s the power rule on an exponential." },
            { t:"`e^{2x}`", why:"That differentiates the exponent in place. The exponent stays; its derivative multiplies." }],
          hints:["Inside: `u = x^2`.", DDX + " `e^u = e^u · u′`.", "`2x e^{x^2}`."] },
        { id:"w5", skill:"Signs of ln", goal:4, prompt:"Which of these is negative?",
          options:[
            { t:"`ln(1/2)`", ok:true, why:"`e` to a negative power is less than 1, so ln of a number below 1 is negative: `ln(1/2) = -ln 2`." },
            { t:"`ln 2`", why:"2 > 1, so `ln 2 > 0`." },
            { t:"`ln 1`", why:"`ln 1 = 0`, neither positive nor negative." },
            { t:"`ln e`", why:"`ln e = 1`." }],
          hints:["`ln x < 0` exactly when `0 < x < 1`.", "Which input is between 0 and 1?", "`ln(1/2) = -ln 2 ≈ -0.693`."] },
        { id:"w6", skill:"Exponential models", goal:5, prompt:"A culture of 500 bacteria doubles every 3 hours. Which models the count after `t` hours?",
          options:[
            { t:"`N = 500(2)^{t/3}`", ok:true, why:"Every 3 hours the exponent goes up by 1, so the count doubles." },
            { t:"`N = 500(2)^{3t}`", why:"That doubles every 1/3 hour." },
            { t:"`N = 500(3)^{t/2}`", why:"That swaps the base and the period. That triples every 2 hours." },
            { t:"`N = 1000^{t/3}`", why:"The 500 multiplies; it doesn’t join the base." }],
          hints:["How many doublings in `t` hours?", "`t/3` doublings.", "`500 · 2^{t/3}`."] }
      ],
      refreshers:{
        "<i>e</i> and ln":"`e^{ln b} = b` and `ln(e^x) = x`. So any base can be written as a power of `e`: `b^x = e^{x ln b}`.",
        "Chain rule with <i>e</i>":DDX + " `e^{g(x)} = e^{g(x)} · g′(x)`. Example: " + DDX + " `e^{-2x} = -2e^{-2x}`.",
        "Signs of ln":"`ln x > 0` for `x > 1`, `ln 1 = 0`, `ln x < 0` for `0 < x < 1`. `ln(1/b) = -ln b`.",
        "Exponential models":"Doubling every `d`: `N_0(2)^{t/d}`. Half-life `h`: `A_0(1/2)^{t/h}`."
      }
    }
  },
  explore:{
    heading:"Ratio m&#101;ter",
    intro:"Pick a base and move the point. The m&#101;ter divides the slope of the tangent by the height of the graph. Watch what stays the same.",
    ui:{
      modes:[{ id:"one", t:"One base" }, { id:"ratio", t:"Ratio vs `ln b`" }, { id:"two", t:"Two bases" }],
      modeHow:{
        one:"The lower panel traces the slope of the tangent as you move the point (drag it, or use the slider: arrows move it by 0.1, Shift + arrows by 1).",
        ratio:"Each base you visit leaves a dot at (`b`, slope ÷ height) on the lower graph. The dashed curve is `y = ln b`.",
        two:"Both graphs get a tangent at the same `x_0`. The slope panel is hidden in this mode."
      },
      base:"Base `@b{b}`", base1:"Base `@b{b_1}`", base2:"Base", point:"Point `x_0`",
      rewrite:"Rewrite as `e^{kx}`", kLabel:"`k`", exact:"Exact `k`:", exactHow:"First box: the number in front of ln (blank means 1, − means −1). Second box: the number inside ln, such as 4, 1/4 or 0.25. Leave the ln box empty for a plain number.",
      meter:"The m&#101;ter: slope ÷ height",
      rows:{ fn:"Function", pt:"Point", slope:"Slope of tangent (measured)", ratio:"Slope ÷ height", ln:"`ln b`", beh:"Behaviour", two:"Two bases", over:"Overlay `y = e^{kx}`" },
      lowOne:"Slope graph: the slope at each point you visit", lowRatio:"Slope ÷ height for each base you visit; dashed: `y = ln b`"
    },
    predIntro:"Make a prediction first. Then the m&#101;ter shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`b = 2`, `x_0 = 0`. Here the slope is about 0.693. What is the slope at `x_0 = 3`?",
        options:[{ t:"8 × 0.693 ≈ 5.55", ok:true }, { t:"0.693" }, { t:"3 × 0.693 ≈ 2.08" }, { t:"0.693³" }],
        explain:"The height is now 8 and the ratio is still 0.693, so the slope is 8 × 0.693." },
      { id:"p2", prompt:"`b` changes from 2 to 4. What happens to the ratio slope ÷ height?",
        options:[{ t:"It doubles", ok:true }, { t:"It stays 0.693" }, { t:"It becomes 4 times as big" }, { t:"It squares" }],
        explain:"`ln 4 = ln 2^2 = 2 ln 2`. Squaring the base doubles the constant." },
      { id:"p3", prompt:"`b = 1/2`. What does the m&#101;ter read now?",
        options:[{ t:"About −0.693", ok:true }, { t:"About 0.693" }, { t:"0.5" }, { t:"0" }],
        explain:"`ln(1/2) = -ln 2`. Every slope is negative: decay." },
      { id:"p4", prompt:"`b = 1`. What does the m&#101;ter read for `y = 1^x`?",
        options:[{ t:"0", ok:true }, { t:"1" }, { t:"−1" }, { t:"It can’t be measured" }],
        explain:"`1^x = 1` for all `x`, and `ln 1 = 0`." }
    ],
    chalIntro:"Use the ratio m&#101;ter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"One base mode: choose `b` so the tangent at `x_0 = 0` has slope `2 ln 3` (≈ 2.197).",
        why:"At `x = 0` the height is 1, so the slope is `ln b = ln 9 = 2 ln 3`.",
        hints:["At `x = 0` the height is 1, so the slope is just `ln b`.", "Write `2 ln 3` as a single log.", "`2 ln 3 = ln 9`, so `b = 9`."],
        msgs:{ mode:"Switch to One base mode first.", x:"Move the point to `x_0 = 0` first.",
          b6:"`ln 6 = ln 2 + ln 3`, not `2 ln 3`.", b3:"That gives `ln 3`, half of what you need.", b8:"Close (2.079), but `2 ln 3 = ln 3^2` exactly.",
          other:"At `x_0 = 0` the slope is `ln b` ≈ {v}. You need `2 ln 3` ≈ 2.197." } },
      { id:"tc2", goal:3, prompt:"Turn on “Rewrite as `e^{kx}`”. Set `b = 1/4`, then enter the exact `k` that puts `y = e^{kx}` exactly on top of `y = (1/4)^x`.",
        why:"`1/4 = e^{ln(1/4)}`, so `(1/4)^x = e^{x ln(1/4)}` and `k = ln(1/4) = -ln 4`.",
        hints:["Write 1/4 as `e` to some power.", "`1/4 = e^{ln(1/4)}`.", "`k = ln(1/4) = -ln 4`."],
        msgs:{ mode:"Switch to One base mode first.", rw:"Turn on “Rewrite as `e^{kx}`” first.", b:"Set `b = 1/4` first (use the chip).",
          ln4:"That’s growth; `(1/4)^x` decays.", quarter:"`k` must be a natural log: `(1/4)^x = e^{x ln(1/4)}`.",
          slider:"The curves match. Now type the exact `k` in the boxes.", other:"With `k` ≈ {v}, `y = e^{kx}` isn’t on top of `y = (1/4)^x`." } },
      { id:"tc3", goal:2, stretch:true, prompt:"Two bases mode with `b_1 = 2` and `b_2 = 4`: move `x_0` to the place where the two tangents are parallel.",
        why:"At `x = -1` both slopes are `(1/2) ln 2` ≈ 0.347.",
        hints:["Parallel means equal slopes: `2^x ln 2 = 4^x ln 4`.", "`ln 4 = 2 ln 2`, so `2^x = 2 · 4^x = 2 · 2^{2x}`.", "`2^{-x} = 2`, so `x = -1`."],
        msgs:{ set:"Choose Two bases mode with `b_1 = 2` and `b_2 = 4` first.",
          x0:"The graphs cross here (equal heights), but `4^x` is twice as steep.", x1:"Slopes `2 ln 2` and `8 ln 2`: further apart.",
          other:"Here the slopes are {s1} and {s2}: not equal yet." } }
    ]
  },
  part3:{
    slug:"growth", name:"Growth",
    heading:"Growth and decay rates",
    intro:"Three stations put the rule to work. Move the time slider and watch the rate, then step through <strong>Check it with algebra</strong>. Then try the quick check.",
    stations:[
      { id:"s1", chip:"Station 1: doubling", title:"Station 1: doubling",
        text:"A culture starts with 300 bacteria and doubles every 4 hours: `N(t) = 300(2)^{t/4}`.",
        alg:["`N′(t) = 300 · 2^{t/4} · ln 2 · {1}/{4}`", "`= ({ln 2}/{4}) N(t)`", "At `t = 8`: `N = 1200` and `N′ = 300 ln 2 ≈ 208` bacteria/h."],
        use:"`ln 2 ≈ 0.693`", bar:"about 17.3% of the population per hour" },
      { id:"s2", chip:"Station 2: half-life", title:"Station 2: half-life",
        text:"A patient has 80 mg of a drug with a half-life of 6 h: `A(t) = 80(1/2)^{t/6}`.",
        alg:["`A′(t) = 80(1/2)^{t/6} · ln(1/2) · {1}/{6}`", "`= -({ln 2}/{6}) A(t)`", "At `t = 12`: `A = 20` mg and `A′ = -(10/3) ln 2 ≈ -2.31` mg/h."],
        use:"`ln 2 ≈ 0.693`", bar:"about 11.6% of the amount per hour, decreasing" },
      { id:"s3", chip:"Station 3: when is the rate this big?", title:"Station 3: when is the rate this big?",
        text:"For `N(t) = 200(2)^{t/5}`, when is the population growing at `320 ln 2` bacteria per hour?",
        alg:["`N′(t) = 200 · 2^{t/5} · ln 2 · {1}/{5} = 40 ln 2 · 2^{t/5}`", "`40 ln 2 · 2^{t/5} = 320 ln 2`, so `2^{t/5} = 8`", "`t/5 = 3`, so `t = 15` h."],
        use:"", target:"Target: `N′ = 320 ln 2` ≈ 221.8 bacteria/h" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Growth and decay quick check",
      items:[
        { id:"q1", goal:2, prompt:"`y = 5(3)^x`. `y′ = ?`",
          choices:[
            { t:"`5(3)^x ln 3`", ok:true, fb:"Right. The 5 is a constant multiple; the `3^x` brings `ln 3`." },
            { t:"`5x(3)^{x - 1}`", fb:"The 5 is a constant multiple; the `3^x` brings `ln 3`." },
            { t:"`15(3)^x`", fb:"The 5 is a constant multiple; the `3^x` brings `ln 3`." },
            { t:"`5(3)^x`", fb:"The 5 is a constant multiple; the `3^x` brings `ln 3`." }] },
        { id:"q2", goal:5, prompt:"An amount doubles every 4 h. `N′/N = ?`",
          choices:[
            { t:"`{ln 2}/{4}`", ok:true, fb:"Right. `N′ = N · ln 2 · (1/4)`." },
            { t:"`4 ln 2`", fb:"`N′ = N · ln 2 · (1/4)`." },
            { t:"`1/2`", fb:"`N′ = N · ln 2 · (1/4)`." },
            { t:"`ln 4`", fb:"`N′ = N · ln 2 · (1/4)`." }] },
        { id:"q3", goal:4, prompt:"`A(t) = 60(1/2)^{t/3}`. The sign of `A′(t)` is…",
          choices:[
            { t:"Always negative", ok:true, fb:"Right. `ln(1/2) < 0` and the height is always positive." },
            { t:"Always positive", fb:"`ln(1/2) < 0` and the height is always positive." },
            { t:"Zero at `t = 3`", fb:"`ln(1/2) < 0` and the height is always positive." },
            { t:"It changes", fb:"`ln(1/2) < 0` and the height is always positive." }] },
        { id:"q4", goal:5, prompt:"`N(t) = 100(2)^{t/2}`. When is `N′ = 400 ln 2`?",
          choices:[
            { t:"`t = 6`", ok:true, fb:"Right. `N′ = 50 ln 2 · 2^{t/2}`, so `2^{t/2} = 8` and `t/2 = 3`." },
            { t:"`t = 3`", fb:"`N′ = 50 ln 2 · 2^{t/2}`, so `2^{t/2} = 8` and `t/2 = 3`." },
            { t:"`t = 8`", fb:"`N′ = 50 ln 2 · 2^{t/2}`, so `2^{t/2} = 8` and `t/2 = 3`." },
            { t:"`t = 4`", fb:"`N′ = 50 ln 2 · 2^{t/2}`, so `2^{t/2} = 8` and `t/2 = 3`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[2, 3],
        instruction:"Tap a function, then tap its derivative.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", t:"`2^x`", why:"Base rule: `2^x ln 2`." },
          { id:"l2", t:"`2^{3x}`", why:"Base rule, then the inside’s derivative, 3." },
          { id:"l3", t:"`3^{x^2}`", why:"Base rule, then the inside’s derivative, `2x`." },
          { id:"l4", t:"`10^{-x}`", why:"Base rule, then the inside’s derivative, −1." },
          { id:"l5", t:"`(1/2)^x`", why:"`ln(1/2) = -ln 2`." },
          { id:"l6", t:"`x · 2^x`", why:"Product rule: `(x)′ · 2^x + x · (2^x)′`.",
            hints:["Two factors: `x` and `2^x`.", "`(x)′ · 2^x + x · (2^x)′`.", "`2^x + x 2^x ln 2`."] },
          { id:"l7", t:"`5^{x + 1}`", why:"The inside `x + 1` has derivative 1." },
          { id:"l8", t:"`9^{x/2}`", why:"`9^{x/2} = (√9)^x = 3^x`.",
            hints:["Simplify first: `9^{x/2} = (√9)^x`.", "That’s `3^x`.", "Its derivative is `3^x ln 3`."] }
        ],
        right:[
          { id:"r1", t:"`2^x ln 2`" },
          { id:"r2", t:"`3 ln 2 · 2^{3x}`" },
          { id:"r3", t:"`2x ln 3 · 3^{x^2}`" },
          { id:"r4", t:"`-ln 10 · 10^{-x}`" },
          { id:"r5", t:"`-ln 2 · (1/2)^x`" },
          { id:"r6", t:"`2^x + x · 2^x ln 2`" },
          { id:"r7", t:"`5^{x + 1} ln 5`" },
          { id:"r8", t:"`ln 3 · 3^x`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"`2^{3x}` needs the inside’s derivative, 3.", "l2|r1":"`2^{3x}` needs the inside’s derivative, 3.",
          "l4|r5":"`10^{-x}` brings `ln 10`; `(1/2)^x` brings `ln(1/2) = -ln 2`.", "l5|r4":"`10^{-x}` brings `ln 10`; `(1/2)^x` brings `ln(1/2) = -ln 2`.",
          "l8|r1":"`9^{x/2} = (9^{1/2})^x = 3^x`, so its derivative uses `ln 3`.", "l1|r8":"`9^{x/2} = (9^{1/2})^x = 3^x`, so its derivative uses `ln 3`.",
          "l6|r1":"`x · 2^x` is a product: use the product rule.", "l1|r6":"`x · 2^x` is a product: use the product rule."
        },
        wrongDefault:"Write the derivative as (function) × ln(base) × (inside’s derivative), then compare." },
      { id:"rates", type:"custom", title:"Rates by hand", summary:"Rates by hand", star:true, goal:[2, 4, 5],
        instruction:"Find each exact value. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type an exact answer such as 4 ln 2, −1/ln 3, 5/2 or e (write ln for the natural log), then press Check.",
        msgs:{ empty:"Type your answer first.", err:"Type an exact answer using numbers, fractions, ln and e, such as 4 ln 2 or −1/ln 3.",
          lnneg:"ln needs a positive number.", approx:"That’s a decimal approximation. Keep the answer exact: leave the ln (or `e`) in it." },
        items:[
          { id:"r1", goal:2, prompt:"Exact slope of `y = 3^x` at `x = 2`.", label:"slope =", answer:["ln", 9, 3], display:"`9 ln 3`",
            wrong:[{ v:9, fb:M2("3", "1.099") }, { v:6, fb:M1("3") }],
            why:"`y′ = 3^x ln 3`, so at `x = 2` the slope is `9 ln 3`." },
          { id:"r2", goal:2, prompt:"`f(x) = 2^{x^2}`. Find `f′(1)`.", label:"`f′(1) =`", answer:["ln", 4, 2], display:"`4 ln 2`",
            wrong:[{ v:["ln", 2, 2], fb:"The height at `x = 1` is `2^1 = 2`, times `2x ln 2 = 2 ln 2`." },
              { v:["ln", 1, 2], fb:"The exponent `x^2` changes at rate `2x`: multiply by it, and by the height." }],
            why:"`f′(x) = 2^{x^2} · ln 2 · 2x`, so `f′(1) = 2 · ln 2 · 2 = 4 ln 2`." },
          { id:"r3", goal:2, star:true, prompt:"At what `x` do `y = 4^x` and `y = 2^{x + 3}` have equal slopes?", label:"`x =`", answer:2, display:"`x = 2`",
            wrong:[{ v:3, fb:"That’s where the heights are equal, `4^x = 2^{x + 3}`." }],
            wrongDefault:"`4^x ln 4 = 2^{x + 3} ln 2` gives `2 · 2^{2x} = 8 · 2^x`, so `2^x = 4`.",
            hints:["Set the two slopes equal.", "`4^x ln 4 = 2^{x + 3} ln 2` and `ln 4 = 2 ln 2`.", "`2 · 2^{2x} = 8 · 2^x`, so `2^x = 4` and `x = 2`."],
            why:"Both slopes are `16 ln 4 = 32 ln 2` at `x = 2`." },
          { id:"r4", goal:2, star:true, prompt:"The tangent to `y = 3^x` at `x = 0` crosses the `x`-axis where?", label:"`x =`", answer:["rln", -1, 3], display:"`x = -{1}/{ln 3}`",
            wrong:[{ v:["ln", -1, 3], fb:"The tangent is `y = 1 + (ln 3)x`; set `y = 0`." }, { v:-3, fb:M2("3", "1.099") }],
            why:"The tangent is `y = 1 + (ln 3)x`; `y = 0` gives `x = -1/ln 3`." },
          { id:"r5", goal:5, star:true, prompt:"`A(t) = A_0(1/2)^{t/8}`, `t` in days. When is the rate of decay one-quarter of its rate at `t = 0`?", label:"`t =`", unit:"days", answer:16, display:"`t = 16` days",
            wrong:[{ v:2, fb:"The ratio `A′(t)/A′(0) = (1/2)^{t/8} = 1/4`, so `t/8 = 2`." }, { v:32, fb:"`(1/2)^{t/8} = 1/4` means two half-lives." }],
            why:"`A′(t)/A′(0) = (1/2)^{t/8} = 1/4`, so `t/8 = 2` and `t = 16` days." },
          { id:"r6", goal:4, star:true, prompt:"For which base `b` does the tangent to `y = b^x` at `x = 1` pass through the origin?", label:"`b =`", answer:["e", 1], display:"`b = e`",
            wrong:[{ v:1, fb:"`1^x` is flat; its tangent is `y = 1`." }],
            wrongDefault:"Tangent: `y - b = b ln b (x - 1)`. At `(0, 0)`: `-b = -b ln b`, so `ln b = 1`.",
            hints:["Write the tangent line at `(1, b)`.", "Substitute `(0, 0)`.", "`ln b = 1`, so `b = e`."],
            why:"The tangent `y - b = b ln b (x - 1)` passes through `(0, 0)` when `ln b = 1`." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Zoe", how:"", goal:[2, 3, 4],
        instruction:"Zoe made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the slope of `y = 5^{2x}` at `x = 1`.",
            steps:["`5^{2x} = (5^2)^x = 25^x`.", DDX + " `25^x = x · 25^{x - 1}`.", "At `x = 1`: `1 · 25^0 = 1`.", "The slope at `x = 1` is 1."],
            answer:1,
            stepFb:["Step 1 is correct: a power of a power. Keep checking.", "", "Step 3 evaluates step 2 correctly. The mistake is earlier.", "This follows from the steps before it."],
            fixes:[
              { t:DDX + " `25^x = 25^x ln 25`, so the slope is `25 ln 25 = 50 ln 5`.", ok:true, why:"The variable is in the exponent, so use " + DDX + " `b^x = b^x ln b`." },
              { t:DDX + " `25^x = 25^x`, so the slope is 25.", why:M2("25") },
              { t:DDX + " `25^x = 25^x log 25`.", why:M3 },
              { t:"Step 2 is correct.", why:"The power rule is for `x^n`, not `b^x`." }],
            hints:["Is the variable in the base or the exponent?", "Use " + DDX + " `b^x = b^x ln b`.", "`25 ln 25 = 50 ln 5`."] },
          { id:"e2", goal:4, task:"`A(t) = 40(1/2)^{t/4}` mg. Find the rate of change at `t = 8` h.",
            steps:["`A′(t) = 40(1/2)^{t/4} · ln(1/2) · (1/4)`.", "`= 10(1/2)^{t/4} ln(1/2)`.", "`ln(1/2) = ln 2`, so `A′(t) = 10(1/2)^{t/4} ln 2`.", "`A′(8) = 10 · (1/4) · ln 2 = 2.5 ln 2 ≈ 1.73` mg/h.", "The amount is increasing by about 1.73 mg/h."],
            answer:2,
            stepFb:["Step 1 is correct: base rule and chain factor 1/4.", "Step 2 is correct.", "", "Step 4 follows step 3.", "This follows; but should a decaying drug increase?"],
            fixes:[
              { t:"`ln(1/2) = -ln 2`, so `A′(8) = -2.5 ln 2 ≈ -1.73` mg/h: decreasing.", ok:true, why:"A base between 0 and 1 has a negative ln, so a decaying drug has a negative rate." },
              { t:"`ln(1/2) = 1/ln 2`.", why:"That’s a different number (≈ 1.44)." },
              { t:"`ln(1/2) = 1/2`.", why:"`ln(1/2) ≈ -0.693`." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Is 1/2 bigger or smaller than 1?", "ln of a number between 0 and 1 is negative.", "`ln(1/2) = -ln 2`."] },
          { id:"e3", goal:3, task:"Show that " + DDX + " `3^x = 3^x ln 3`.",
            steps:["`3 = e^{ln 3}`, so `3^x = e^{x ln 3}`.", DDX + " `e^{x ln 3} = e^{x ln 3}`.", "`= 3^x`.", "So " + DDX + " `3^x = 3^x`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 rewrites step 2 correctly.", "This follows, but check it at `x = 0`: is the slope 1?"],
            fixes:[
              { t:"Chain rule: " + DDX + " `e^{x ln 3} = e^{x ln 3} · ln 3 = 3^x ln 3`.", ok:true, why:"The inside `u = x ln 3` has `u′ = ln 3`." },
              { t:"`= (x ln 3) e^{x ln 3 - 1}`.", why:M1("3") },
              { t:"`= e^{ln 3} = 3`.", why:"That’s a number, not a function." },
              { t:"Step 2 is correct.", why:"The exponent is `x ln 3`, which changes at rate `ln 3`." }],
            hints:["What is the inside function?", "`u = x ln 3`, and `u′ = ln 3`.", "`e^u · u′ = 3^x ln 3`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the ratio m&#101;ter: that the ratio never changed as you moved the point, or that it matched `ln b`?" },
      { id:"j2", q:"In your own words, why is the derivative of `2^x` a vertical stretch of `2^x`?" },
      { id:"j3", q:"Explain to a friend how to differentiate `3^{5x}` and why the power rule doesn’t apply." },
      { id:"j4", q:"What part of growth and decay rates are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:DDX + " `7^x = ?`", options:[
          { t:"`7^x ln 7`", ok:true, why:DDX + " `b^x = b^x ln b`, with `b = 7`." },
          { t:"`x · 7^{x - 1}`", why:"That’s the power rule on an exponential. " + M1("7") },
          { t:"`7^x`", why:"Only `e^x` is its own derivative." },
          { t:"`7^x/ln 7`", why:"Multiply by `ln 7`, don’t divide. " + M6 }] },
        b:{ prompt:DDX + " `6^x = ?`", options:[
          { t:"`6^x ln 6`", ok:true, why:DDX + " `b^x = b^x ln b`, with `b = 6`." },
          { t:"`x · 6^{x - 1}`", why:M1("6") },
          { t:"`6^x`", why:M2("6") },
          { t:"`6^x/ln 6`", why:"Multiply by `ln 6`, don’t divide. " + M6 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:DDX + " `2^{5x} = ?`", options:[
          { t:"`5 ln 2 · 2^{5x}`", ok:true, why:"Base rule, then the inside’s derivative, 5." },
          { t:"`ln 2 · 2^{5x}`", why:"Multiply by the inside’s derivative, 5." },
          { t:"`5x · 2^{5x - 1}`", why:M1("2") },
          { t:"`5 · 2^{5x}`", why:"`ln 2` is missing." }] },
        b:{ prompt:DDX + " `3^{4x} = ?`", options:[
          { t:"`4 ln 3 · 3^{4x}`", ok:true, why:"Base rule, then the inside’s derivative, 4." },
          { t:"`ln 3 · 3^{4x}`", why:"The exponent `4x` changes 4 times as fast as `x`: multiply by 4." },
          { t:"`4x · 3^{4x - 1}`", why:M1("3") },
          { t:"`4 · 3^{4x}`", why:"`ln 3` is missing. " + M2("3", "1.099") }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which function has a negative derivative for every `x`?", options:[
          { t:"`y = (1/3)^x`", ok:true, why:"`ln(1/3) < 0` and `(1/3)^x > 0`." },
          { t:"`y = 3^x`", why:"`ln 3 > 0`: increasing." },
          { t:"`y = (4/3)^x`", why:"The base is above 1, so `ln(4/3) > 0`." },
          { t:"`y = -(1/3)^x`", why:"Two negatives: `y′ = -(1/3)^x ln(1/3) > 0`." }] },
        b:{ prompt:"Which function has a negative derivative for every `x`?", options:[
          { t:"`y = 0.2^x`", ok:true, why:"`ln 0.2 < 0`." },
          { t:"`y = 2^x`", why:"`ln 2 > 0`." },
          { t:"`y = 1.2^x`", why:"The base is above 1." },
          { t:"`y = -(0.2)^x`", why:"`y′ = -(0.2)^x ln 0.2 > 0`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`f(x) = b^x` and `f′(0) = 3`. What is `b`?", options:[
          { t:"`e^3`", ok:true, why:"`f′(0) = b^0 ln b = ln b = 3`, so `b = e^3`." },
          { t:"3", why:"`f′(0) = ln b`, not `b`." },
          { t:"`ln 3`", why:"That reverses the relationship: `ln b = 3`." },
          { t:"`10^3`", why:"ln is base `e`, not base 10." }] },
        b:{ prompt:"`f(x) = b^x` and `f′(0) = -2`. What is `b`?", options:[
          { t:"`e^{-2}`", ok:true, why:"`ln b = -2`." },
          { t:"−2", why:"A base can’t be negative; `f′(0) = ln b`." },
          { t:"`ln 2`", why:"Reversed: `ln b = -2`." },
          { t:"`10^{-2}`", why:M3 + " ln is base `e`, not base 10." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"At what `x` does the tangent to `y = 2^x` have slope `16 ln 2`?", options:[
          { t:"`x = 4`", ok:true, why:"`2^x ln 2 = 16 ln 2`, so `2^x = 16`." },
          { t:"`x = 16`", why:"`2^x = 16` gives `x = 4`, not 16." },
          { t:"`x = 5`", why:"`2^5 = 32`." },
          { t:"`x = 2`", why:"At `x = 2` the slope is `4 ln 2`." }] },
        b:{ prompt:"At what `x` does the tangent to `y = 3^x` have slope `27 ln 3`?", options:[
          { t:"`x = 3`", ok:true, why:"`3^x = 27`." },
          { t:"`x = 27`", why:"`3^x = 27` gives `x = 3`." },
          { t:"`x = 4`", why:"`3^4 = 81`." },
          { t:"`x = 9`", why:"`3^9` is far bigger than 27." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Which function has the greatest rate of change at `x = 0`? (Use these values.)", use:USE3, options:[
          { t:"`y = 3^x`", ok:true, why:"Slope at 0: `ln 3 ≈ 1.099`." },
          { t:"`y = e^x`", why:"Slope 1, and `ln 3 > ln e = 1`." },
          { t:"`y = 10^{x/3}`", why:"The biggest base, but the slope is `ln 10/3 ≈ 0.768`." },
          { t:"`y = 4^{x/2}`", why:"`4^{x/2} = 2^x`: slope `ln 2 ≈ 0.693`." }] },
        b:{ prompt:"Which function has the greatest rate of change at `x = 0`? (Use these values.)", use:USE3, options:[
          { t:"`y = 2^{2x}`", ok:true, why:"Slope `2 ln 2 ≈ 1.386`." },
          { t:"`y = e^x`", why:"Slope 1." },
          { t:"`y = 10^{x/2}`", why:"Compare `b^{kx}` by `k ln b`: slope `ln 10/2 ≈ 1.151`." },
          { t:"`y = 8^{x/3}`", why:"`8^{x/3} = 2^x`: slope ≈ 0.693." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why " + DDX + " `2^x = 2^x ln 2`?", options:[
          { t:"“`2^x = e^{x ln 2}`. By the chain rule its derivative is `e^{x ln 2} · ln 2`, which is `2^x ln 2`.”", ok:true, why:"Rewrite with base `e`, then the chain rule brings out `ln 2`." },
          { t:"“By the power rule, bring the exponent down and lower it by one.”", why:M1("2") },
          { t:"“Every exponential is its own derivative times its base, so the 2 becomes `ln 2`.”", why:"The base isn’t multiplied in." },
          { t:"“The slope of `2^x` is `ln 2` at every point.”", why:"That’s only the slope at `x = 0`, where the height is 1." }] },
        b:{ prompt:"Which is the best explanation of why the slope of `y = 5^x` is always proportional to its height?", options:[
          { t:"“`5^x = e^{x ln 5}`, so its derivative is `5^x · ln 5`: the height times the fixed number `ln 5`.”", ok:true, why:"The constant of proportionality is `ln 5`." },
          { t:"“Because `5^x` grows, and growing functions have slopes proportional to their heights.”", why:"`x^2` grows too, but its slope `2x` isn’t proportional to `x^2`." },
          { t:"“Because the power rule gives `x · 5^{x - 1}`, which is a multiple of `5^x`.”", why:M1("5") },
          { t:"“Because the slope at `x = 0` is 5.”", why:"It’s `ln 5 ≈ 1.61`." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A model says `N(t) = 300(1/2)^{t/10}`. Which statement about `N′(t)` is correct?", options:[
          { t:"`N′(t) = -({ln 2}/{10}) N(t)`: the amount drops at a rate that is always about 6.9% of what is left.", ok:true, why:"`ln(1/2) · {1}/{10} = -{ln 2}/{10} ≈ -0.069`." },
          { t:"`N′(t) = ({ln 2}/{10}) N(t)`: it grows at about 6.9% per unit time.", why:M5 },
          { t:"`N′(t) = -15` for all `t`: it drops by the same amount each unit of time.", why:"That’s linear decay, not exponential." },
          { t:"`N′(t) = -(1/2) N(t)`.", why:"The constant is `ln(1/2) ÷ 10`, not 1/2." }] },
        b:{ prompt:"A model says `P(t) = 50(2)^{t/4}`. Which statement about `P′(t)` is correct?", options:[
          { t:"`P′(t) = ({ln 2}/{4}) P(t)`: the population grows at a rate that is always about 17.3% of its size.", ok:true, why:"`ln 2 · {1}/{4} ≈ 0.173`." },
          { t:"`P′(t) = -({ln 2}/{4}) P(t)`.", why:"`ln 2 > 0`: a doubling model grows." },
          { t:"`P′(t) = 12.5` for all `t`.", why:"That’s linear growth." },
          { t:"`P′(t) = 2P(t)`.", why:"The constant is `ln 2 ÷ 4`, not 2. Only `e^x` is its own derivative." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A bacteria count doubles every 3 h: `N(t) = 500(2)^{t/3}`. How fast is it growing at `t = 6` h?", use:"`ln 2 ≈ 0.693`", options:[
          { t:"About 462 bacteria/h", ok:true, why:"`N(6) = 2000` and `N′ = 2000 · ln 2/3 ≈ 462`." },
          { t:"About 1386 bacteria/h", why:"The chain factor 1/3 is missing." },
          { t:"About 667 bacteria/h", why:"`ln 2` is missing: 2000/3." },
          { t:"About 4158 bacteria/h", why:"That multiplies by 3 instead of dividing." }] },
        b:{ prompt:"A bacteria count doubles every 5 h: `N(t) = 400(2)^{t/5}`. How fast is it growing at `t = 10` h?", use:"`ln 2 ≈ 0.693`", options:[
          { t:"About 222 bacteria/h", ok:true, why:"`N(10) = 1600`; `N′ = 1600 · ln 2/5 ≈ 222`." },
          { t:"About 1109 bacteria/h", why:"The chain factor 1/5 is missing." },
          { t:"320 bacteria/h", why:"`ln 2` is missing: 1600/5." },
          { t:"About 5544 bacteria/h", why:"Multiplied by 5." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A drug has a half-life of 6 h: `A(t) = 64(1/2)^{t/6}` mg. When is `A′(t) = -(2/3) ln 2` mg/h?", options:[
          { t:"At `t = 24` h", ok:true, why:"`A′ = -(32/3) ln 2 · (1/2)^{t/6}`. Setting it equal: `(1/2)^{t/6} = 1/16`, so `t/6 = 4`." },
          { t:"At `t = 4` h", why:"4 is the number of half-lives; each is 6 h." },
          { t:"At `t = 16` h", why:"1/16 is the fraction left, not the time." },
          { t:"At `t = 96` h", why:"`t/6 = 4`, not 16." }] },
        b:{ prompt:"A drug has a half-life of 5 h: `A(t) = 80(1/2)^{t/5}` mg. When is `A′(t) = -2 ln 2` mg/h?", options:[
          { t:"At `t = 15` h", ok:true, why:"`A′ = -16 ln 2 · (1/2)^{t/5} = -2 ln 2` gives `(1/2)^{t/5} = 1/8`." },
          { t:"At `t = 3` h", why:"That’s the number of half-lives." },
          { t:"At `t = 8` h", why:"1/8 is the fraction, not the time." },
          { t:"At `t = 40` h", why:"`t/5 = 3`, not 8." }] } }
    ]
  },
  task:{
    title:"Safe dose", summary:"Safe dose",
    statement:"<p>Design a drug model `A(t) = A_0(1/2)^{t/h}` (mg, `t` in hours) that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The starting dose is at most 150 mg.</li><li>At `t = 0` the amount is decreasing at exactly `10 ln 2` mg/h.</li><li>At least 5 mg is still present after 12 hours.</li><li>Less than 50 mg is present after 24 hours.</li></ol></div>",
    checks:["Starting dose at most 150 mg", "Decreasing at `10 ln 2` mg/h at the start", "At least 5 mg after 12 h", "Less than 50 mg after 24 h"],
    tips:["Lower the starting dose.",
      "`A′(0) = A_0 · ln(1/2) · (1/h)`. For this to be `-10 ln 2`, you need `A_0 = 10h`.",
      "With a short half-life, too little is left at 12 h. Count the half-lives in 12 hours.",
      "With a long half-life, too much is left at 24 h."],
    explainPrompt:"Explain how the rate at `t = 0` fixed the link between `A_0` and `h`, and why only three half-lives work.",
    vocab:"Use the words half-life, rate of change, ln 2 and initial dose.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 2 forces `A_0 = 10h`. Lines 3 and 4 then rule out the short half-lives (2 and 3 h) and the long one (24 h, which also breaks line 1)."
  },
  cards:[
    [DDX + " `b^x`", "`b^x ln b`. Example: " + DDX + " `2^x = 2^x ln 2`."],
    ["Why `ln b`?", "`b^x = e^{x ln b}`; the chain rule brings out `ln b`."],
    ["`e^x` is special", "`ln e = 1`, so " + DDX + " `e^x = e^x`."],
    ["Chain rule with `b^x`", DDX + " `b^{g(x)} = b^{g(x)} · ln b · g′(x)`."],
    ["Not the power rule", "`x^n`: exponent fixed. `b^x`: exponent variable."],
    ["Sign of `ln b`", "`b > 1`: growth (`ln b > 0`). `0 < b < 1`: decay (`ln b < 0`)."],
    ["Slope ÷ height", "For `b^x`, always `ln b`, at every point."],
    ["Doubling time `d`", "`N = N_0(2)^{t/d}`; `N′ = ({ln 2}/{d}) N`."],
    ["Half-life `h`", "`A = A_0(1/2)^{t/h}`; `A′ = -({ln 2}/{h}) A`."],
    ["`ln(1/b)`", "`= -ln b`. Example: `ln(1/2) = -ln 2 ≈ -0.693`."]
  ]
};
