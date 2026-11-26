// MCV4U 28 Optimization Problems with Exponential Functions. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/28-optimization-with-exponentials.md
// Upright d for d/dt and d/dx (as in MCV4U 07/10/18)
const DDT = '<span class="m">d/d<i>t</i></span>';
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3)
const M1 = "`e` to any power is positive. `e^{-kt} = 0` has no solution; only the other factor can be 0.";
const M2 = "`t` and `e^{-kt}` are both changing: use the product rule.";
const M3 = "The exponent `-kt` changes at rate `-k`.";
const M4 = "On `[0, 3]`, a peak at `t = 5` can’t be used. Compare the endpoints.";
const M5 = "Revenue is price × quantity. `q(25)` is how many sell, not how much money comes in.";
const M6 = "`@a{A}` stretches the curve vertically; the peak time `1/k` doesn’t move.";
const M7 = "Demand is greatest at `p = 0`, but then revenue is 0.";
const USE = "`e ≈ 2.718`";
const E = Math.E;

export default {
  id:"28-optimization-with-exponentials",
  kind:"topic",
  title:"Optimization problems with exponential functions",
  topic:"Optimization Problems with Exponential Functions",
  readyTopic:"optimization problems with exponential functions",
  hero:{
    eq:"`C(t) = @a{A}t e^{-kt}` <span class=\"ox-heq\">peaks&nbsp;at</span> `t = 1/k`",
    eqLabel:"C of t equals A t e to the negative k t, which peaks at t equals 1 over k",
    eqSize:"md",
    headline:"Rise, peak, fade: where is the top?",
    text:"After a dose, a medicine’s concentration in the blood rises, <strong>peaks</strong> and then fades. A model that multiplies a rising factor `t` by a decaying factor `e^{-kt}` captures this. The <strong>product rule</strong> finds the peak, and one fact makes it easy: `e` to any power is <strong>never zero</strong>.",
    fig:{ html:'<div class="ox-hero"><div class="ox-hfac" aria-hidden="true"><div class="ox-hfp"><p class="ox-hfcap">rising factor <span class="m"><i>y</i> = <i>t</i></span></p><canvas class="plot ox-hsmall" id="ox-hf1"></canvas></div>' +
      '<div class="ox-hfp"><p class="ox-hfcap">decaying factor <span class="m"><i>y</i> = <i>e</i><sup>−<i>t</i>/2</sup></span></p><canvas class="plot ox-hsmall" id="ox-hf2"></canvas></div></div>' +
      '<canvas class="plot wide" id="hero-plot" role="img" aria-label="A rising line y = t and a decay curve y = e to the minus t over 2 draw in two small panels. They multiply point by point into the dose curve C of t = 20 t e to the minus t over 2. A tangent slides along it and flattens at the top: the peak is at t = 2 hours, C = 40 over e, about 14.7 milligrams per litre."></canvas></div>' }
  },
  goals:[
    "I can differentiate products like `te^{-kt}` and factor out the exponential.",
    "I can explain why `e^{g(t)}` is never 0, so critical numbers come from the other factor.",
    "I can find and justify the maximum of a model like `C(t) = @a{A}te^{-kt}`, including on a closed interval.",
    "I can build and optimize a revenue or profit model with exponential demand.",
    "I can state optimal values in context, exactly and approximately, with units."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Product rule with <i>e</i>", goal:1, prompt:"Differentiate `y = xe^x`.",
          options:[
            { t:"`e^x(1 + x)`", ok:true, why:"`1 · e^x + x · e^x`." },
            { t:"`e^x`", why:"`(x)′ · (e^x)′ = e^x` multiplies the derivatives." },
            { t:"`xe^x`", why:"That’s only the second term of the product rule." },
            { t:"`2xe^x`", why:"No term gives `2x`." }],
          hints:["Two factors: `x` and `e^x`.", "`f′g + fg′ = 1 · e^x + x · e^x`.", "`e^x(1 + x)`."] },
        { id:"w2", skill:"Chain rule with <i>e</i>", goal:1, prompt:"Differentiate `e^{-3t}`.",
          options:[
            { t:"`-3e^{-3t}`", ok:true, why:"The exponent changes at rate −3." },
            { t:"`e^{-3t}`", why:"Multiply by the exponent’s derivative." },
            { t:"`3e^{-3t}`", why:"The exponent `-3t` has derivative −3." },
            { t:"`-3te^{-3t - 1}`", why:"Power rule on an exponential." }],
          hints:["Inside: `u = -3t`.", "`u′ = -3`.", "`-3e^{-3t}`."] },
        { id:"w3", skill:"<i>e</i> is never 0", goal:2, prompt:"Solve `e^{2x}(x - 5) = 0`.",
          options:[
            { t:"`x = 5`", ok:true, why:"`e^{2x} > 0`, so only `x - 5` can be 0." },
            { t:"`x = 0` or `x = 5`", why:"`e^0 = 1`, not 0." },
            { t:"`x = 5` or `x = ln 5`", why:"`ln 5` doesn’t make either factor 0." },
            { t:"No solution", why:"`x = 5` makes the second factor 0." }],
          hints:["When is a product 0?", "Can `e^{2x}` ever be 0?", "No; so `x = 5`."] },
        { id:"w4", skill:"<i>e</i> is never 0", goal:2, prompt:"Which statement is true for every real `t`?",
          options:[
            { t:"`e^{-t} > 0`", ok:true, why:"Positive base, any power: positive." },
            { t:"`e^{-t} < 1`", why:"For `t < 0`, `e^{-t} > 1`." },
            { t:"`e^{-t} < 0` when `t > 0`", why:"A negative exponent makes a small positive number." },
            { t:"`e^{-t} = 0` for large `t`", why:"It approaches 0 but never reaches it." }],
          hints:["What does a negative exponent mean?", "`e^{-t} = 1/e^t`.", "A positive number over a positive number."] },
        { id:"w5", skill:"Optimization", goal:3, prompt:"On `[0, 4]`, `f′(x) = 0` only at `x = 1`. `f(0) = 3`, `f(1) = 5`, `f(4) = 7`. Where is the absolute maximum?",
          options:[
            { t:"At `x = 4`", ok:true, why:"Compare all candidates: 7 is largest." },
            { t:"At `x = 1`", why:"A critical point isn’t automatically the maximum: check the endpoints." },
            { t:"At `x = 0`", why:"`f(0) = 3` is the smallest." },
            { t:"There isn’t one", why:"A continuous function on a closed interval always has one." }],
          hints:["List the candidates: endpoints and critical numbers.", "Values 3, 5 and 7.", "`x = 4`."] },
        { id:"w6", skill:"Optimization", goal:4, prompt:"Demand is `q = 100 - 2p`. Which price maximizes revenue `R = pq`?",
          options:[
            { t:"`p = 25`", ok:true, why:"`R = 100p - 2p^2`, `R′ = 100 - 4p = 0`." },
            { t:"`p = 50`", why:"At `p = 50` nothing sells." },
            { t:"`p = 0`", why:"Most sales, but zero revenue." },
            { t:"`p = 100`", why:"Demand would be negative." }],
          hints:["Write `R` as a function of `p`.", "`R = 100p - 2p^2`.", "`R′ = 0` at `p = 25`."] }
      ],
      refreshers:{
        "Product rule with <i>e</i>":"<span class=\"m\">d/d<i>x</i></span> `[f · e^{g}] = f′e^{g} + f g′e^{g} = e^{g}(f′ + f g′)`. Factor out the exponential.",
        "Chain rule with <i>e</i>":DDT + " `e^{-kt} = -ke^{-kt}`.",
        "<i>e</i> is never 0":"`e^u > 0` for every `u`. In a product with `e^u`, only the other factors can make it 0.",
        "Optimization":"Candidates are the critical numbers inside the interval and the endpoints. Compare their values, then answer in words with units."
      }
    }
  },
  explore:{
    heading:"Dose curve",
    intro:"Change the dose factor `@a{A}` and the elimination rate `k`. Watch where the curve peaks, and find out which slider moves the peak.",
    txt:{
      modeLabel:"View",
      modes:[{ id:"dose", t:"Dose curve" }, { id:"factor", t:"Factor view" }, { id:"window", t:"Window" }],
      A:"Dose factor `@a{A}`", Aunit:"mg/L per hour", k:"Elimination rate `k`", kunit:"per hour", probe:"Probe time `t`",
      t1:"Window start `t_1`", t2:"Window end `t_2`", winNote:"Window endpoints move in steps of 0.5 h.",
      gcap:{ dose:"`C(t)`, mg/L, against `t`, hours", factor:"`C′(t) = @a{A}e^{-kt}(1 - kt)`, (mg/L)/h", window:"`C(t)` on the window `[t_1, t_2]`" },
      key:{ dose:"Blue: `C(t)`. Black: the tangent at the probe. Dashed line: the peak at `t = 1/k`.",
        factor:"Top: the two factors. Teal: `C′(t)`. The strip under it shows the sign of `C′`: + before `1/k`, − after.",
        window:"Shaded: the window. Open dots: the candidates (endpoints, and `1/k` if it’s inside). Ringed: the absolute maximum on the window." },
      fac1:"Rising factor `@a{A}t`", fac2:"Decaying factor `e^{-kt}` (always above 0)",
      rows:{ model:"Model", probe:"Probe", d:"`C′(t)`", ptime:"Peak time", pval:"Peak concentration", win:"Window" },
      rising:"rising", falling:"falling", peak:"peak",
      winMax:"Absolute max on #1: at #2, #3 mg/L", peakWord:"the peak", endWord:"an endpoint",
      peakLabel:"peak", maxLabel:"absolute max"
    },
    predIntro:"Make a prediction first. Then the dose curve shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"`@a{A} = 20` and `k = 0.5`. Double `@a{A}` to 40. Where is the new peak?",
        options:[{ t:"Still at `t = 2` h", ok:true }, { t:"At 4 h" }, { t:"At 1 h" }, { t:"At `2e` h" }],
        explain:"The curve stretches upward, but the peak line stays put. `C′(t) = @a{A}e^{-kt}(1 - kt)`: `@a{A}` doesn’t change where the factor `(1 - kt)` is 0.",
        start:{ mode:"dose", A:20, k:0.5, t:1.5 } },
      { id:"p2", prompt:"`@a{A} = 20` and `k = 0.5`. Double `k` to 1. Where is the new peak?",
        options:[{ t:"At 1 h", ok:true }, { t:"At 4 h" }, { t:"Still at 2 h" }, { t:"At 0.25 h" }],
        explain:"The peak line slides left. The peak is at `t = 1/k`: faster elimination, earlier peak.",
        start:{ mode:"dose", A:20, k:0.5, t:1.5 } },
      { id:"p3", prompt:"Factor view. How many times does the factor `e^{-kt}` reach 0 on the graph?",
        options:[{ t:"Never", ok:true }, { t:"Once, at `t = 1/k`" }, { t:"Once, at `t = 0`" }, { t:"Many times" }],
        explain:"The decay curve approaches the axis, but its band never touches it. `e^{-kt} = 1/e^{kt}`, always positive.",
        start:{ mode:"factor", A:20, k:0.5, t:0 } },
      { id:"p4", prompt:"Window `[3, 8]`, `@a{A} = 20`, `k = 0.5`. The peak at `t = 2` is outside this window. Where is the absolute maximum on `[3, 8]`?",
        options:[{ t:"At `t = 3`", ok:true }, { t:"At `t = 2`" }, { t:"At `t = 8`" }, { t:"There isn’t one" }],
        explain:"The curve is falling across the whole window, so the left endpoint is ringed. `C` is decreasing after 2 h, so the earliest time in the window wins.",
        start:{ mode:"window", A:20, k:0.5, t:3, t1:3, t2:8 } }
    ],
    pv:{ still:"peak still at t = 2 h", slid:"peak now at t = 1 h", never:"e^(−kt) > 0: never 0", left:"absolute max: t = 3" },
    chalIntro:"Use the sliders to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"Set the sliders so the peak happens at exactly 4 hours.",
        why:"The peak time is `1/k`, so `1/k = 4` gives `k = 0.25`. Any `@a{A}` works.",
        hints:["Which slider moves the peak?", "Peak time = `1/k`.", "`1/k = 4` gives `k = 0.25`."],
        msgs:{ k4:"The peak is at `1/k`, so `k = 4` peaks at 0.25 h.", k05:"That peaks at 2 h.", general:"Right now the peak is at `t = 1/k` = #1 h. You need 4 h." } },
      { id:"tc2", goal:[3, 5], prompt:"Make the curve peak at 2 h with a peak concentration of `40/e` mg/L.",
        why:"`k = 0.5` puts the peak at `1/k = 2` h, and `C(2) = @a{A}/(ke) = 20/(0.5e) = 40/e`.",
        hints:["First fix the time: `k = 1/2`.", "`C(1/k) = @a{A} · (1/k) · e^{-1} = @a{A}/(ke)`.", "`@a{A}/(0.5e) = 40/e`, so `@a{A} = 20`."],
        msgs:{ a40:"Peak `80/e`: twice too high.", k2:"Peak at 0.5 h.", general:"Right now the peak is at #1 h with a peak concentration of #2 mg/L." } },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Design a dose that peaks at 2.5 h with a peak concentration of `30/e` mg/L.",
        why:"`1/k = 2.5` gives `k = 0.4`; then `@a{A}/(ke) = 30/e` gives `@a{A} = 30k = 12`.",
        hints:["Peak time `1/k = 2.5`.", "Peak value `@a{A}/(ke) = 30/e`, so `@a{A} = 30k`.", "`k = 0.4` and `@a{A} = 12`."],
        msgs:{ a30:"That peaks at `75/e`: the peak value is `@a{A}/(ke)`, not `@a{A}/e`.", k25:"Peak at 0.4 h: the time is `1/k`.", general:"Right now the peak is at #1 h with a peak concentration of #2 mg/L." } }
    ]
  },
  part3:{
    slug:"revenue", name:"Revenue",
    heading:"Revenue with exponential demand",
    intro:"The same product of a rising factor and a decaying factor shows up in economics. Build each model from chips, then move the price to find the best one, and check it with algebra. Then try the quick check.",
    build:{ how:"Tap a chip, then the slot it belongs in (or a slot, then a chip).", done:"Model built.", first:"Build the model first. The graph appears when it’s complete.",
      slider:"Price `p`", trend:{ up:"rising: a higher price brings in more", down:"falling: too many customers lost", best:"greatest" },
      algSummary:"Check it with algebra", signTitle:"Sign chart" },
    stations:[
      { id:"s1", chip:"Best ticket price", title:"Station 1: the best ticket price",
        text:"A theatre finds that at a price of `p` dollars it sells about `q(p) = 600e^{-p/20}` tickets per show (`0 ≤ p ≤ 80`).",
        frame:"`R(p) =` (price) × (quantity)",
        slots:[{ id:"price", label:"Price" }, { id:"qty", label:"Quantity sold" }],
        roles:{ price:"the price", qty:"the quantity sold" },
        chips:[{ t:"`p`", answer:"price" }, { t:"`600e^{-p/20}`", answer:"qty" },
          { t:"`600`", answer:"no", fb:"600 tickets sell only at `p = 0`. The number sold depends on `p`: `600e^{-p/20}`." },
          { t:"`p - 5`", answer:"no", fb:"Revenue uses the whole price `p`. Costs come in at Station 3." }],
        model:"`R(p) = p · 600e^{-p/20}`", graph:"`R(p)`, dollars, against the price `p`",
        rows:{ p:"Price", q:"Tickets `q(p)`", R:"Revenue `R(p)`", trend:"Revenue" },
        best:"greatest: `12 000/e` ≈ $4415 at $20",
        alg:["`R(p) = p · 600e^{-p/20}`",
          "Product rule: `R′(p) = 600e^{-p/20} + p · 600e^{-p/20} · (-1/20) = 600e^{-p/20}(1 - p/20)`.",
          "`600e^{-p/20} > 0`, so `R′(p) = 0` only when `1 - p/20 = 0`: `p = 20`.",
          "Endpoints: `R(0) = 0` and `R(80) = 48 000e^{-4}` ≈ $879.",
          "Maximum: `R(20) = 12 000/e` ≈ $4415. The best ticket price is $20."],
        use:"`e ≈ 2.718`, `e^{-4} ≈ 0.018`" },
      { id:"s2", chip:"Price cap", title:"Station 2: a price cap",
        text:"The city caps ticket prices at $15. Demand is still `q(p) = 600e^{-p/20}`.",
        frame:"`R(p) = p · 600e^{-p/20}` on the prices allowed",
        slots:[{ id:"dom", label:"Prices allowed" }],
        roles:{ dom:"the prices allowed" },
        chips:[{ t:"`0 ≤ p ≤ 15`", answer:"dom" },
          { t:"`0 ≤ p ≤ 80`", answer:"no", fb:"That was before the cap. Now prices stop at $15." },
          { t:"`p ≥ 15`", answer:"no", fb:"A cap is a highest price: $15 or less." }],
        model:"`R(p) = p · 600e^{-p/20}`, `0 ≤ p ≤ 15`", graph:"`R(p)`, dollars; the shaded band is the prices allowed",
        rows:{ p:"Price", q:"Tickets `q(p)`", R:"Revenue `R(p)`", trend:"Revenue" },
        best:"greatest on the window: the cap, $15",
        alg:["On `[0, 15]`, `1 - p/20 > 0`, so `R′(p) = 600e^{-p/20}(1 - p/20) > 0`: `R` is increasing on the whole window.",
          "The critical number `p = 20` is outside `[0, 15]`, so it can’t be used.",
          "Compare the endpoints: `R(0) = 0` and `R(15) = 9000e^{-0.75}` ≈ $4250.",
          "The best price is the cap, $15."],
        use:"`e^{-0.75} ≈ 0.472`" },
      { id:"s3", chip:"Profit", title:"Station 3: profit, not revenue",
        text:"Each ticket costs the theatre $5 to provide. Demand is still `q(p) = 600e^{-p/20}`.",
        frame:"`P(p) =` (profit per ticket) × (quantity)",
        slots:[{ id:"margin", label:"Profit per ticket" }, { id:"qty", label:"Quantity sold" }],
        roles:{ margin:"the profit per ticket", qty:"the quantity sold" },
        chips:[{ t:"`p - 5`", answer:"margin" }, { t:"`600e^{-p/20}`", answer:"qty" },
          { t:"`p`", answer:"no", fb:"That’s the price. Each ticket also costs $5, so the profit per ticket is `p - 5`." },
          { t:"`p + 5`", answer:"no", fb:"The $5 cost comes off the price, not on top of it." }],
        model:"`P(p) = (p - 5) · 600e^{-p/20}`", graph:"`P(p)`, dollars, against the price `p`",
        rows:{ p:"Price", q:"Tickets `q(p)`", R:"Revenue", c:"Cost ($5 per ticket)", P:"Profit `P(p)`", trend:"Profit" },
        best:"greatest at $25",
        alg:["`P(p) = (p - 5) · 600e^{-p/20}`",
          "Product rule: `P′(p) = 600e^{-p/20} + (p - 5) · 600e^{-p/20} · (-1/20) = 600e^{-p/20}[1 - (p - 5)/20]`.",
          "`600e^{-p/20} > 0`, so `P′(p) = 0` only when `(p - 5)/20 = 1`: `p = 25`.",
          "`P(25) = 20 · 600e^{-5/4} = 12 000e^{-5/4}` ≈ $3438. The best price for profit is $25."],
        use:"`e^{-1.25} ≈ 0.287`",
        note:"With this kind of demand, the best price is the demand’s scale (20) plus the cost per item (5)." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Revenue quick check",
      items:[
        { id:"q1", goal:4, prompt:"`q = 1000e^{-p/50}`. Which price maximizes revenue?",
          choices:[
            { t:"$50", ok:true, fb:"Right. `R′ = 1000e^{-p/50}(1 - p/50) = 0` at `p = 50`." },
            { t:"$1000", fb:"`R′ = 1000e^{-p/50}(1 - p/50)`. " + M7 },
            { t:"$0", fb:"`R′ = 1000e^{-p/50}(1 - p/50)`. " + M7 },
            { t:"$25", fb:"`R′ = 1000e^{-p/50}(1 - p/50)`. " + M7 }] },
        { id:"q2", goal:2, prompt:"`R′(p) = 300e^{-p/10}(1 - p/10)`. Why is `p = 10` the only critical number?",
          choices:[
            { t:"`e^{-p/10}` is never 0", ok:true, fb:"Right. A positive factor can’t make the product 0, so only `1 - p/10` can." },
            { t:"`e^{-p/10} = 0` at `p = 0`", fb:"A positive factor can’t make the product 0. " + M1 },
            { t:"300 can’t be 0", fb:"A positive factor can’t make the product 0. " + M1 },
            { t:"The domain stops at 10", fb:"A positive factor can’t make the product 0. " + M1 }] },
        { id:"q3", goal:3, prompt:"Same demand as Q1, but prices are capped at $40. Best price?",
          choices:[
            { t:"$40", ok:true, fb:"Right. `R` is increasing up to $50, so the cap wins." },
            { t:"$50", fb:"`R` is increasing up to $50, so the cap wins. $50 isn’t allowed." },
            { t:"$0", fb:"`R` is increasing up to $50, so the cap wins." },
            { t:"$20", fb:"`R` is increasing up to $50, so the cap wins." }] },
        { id:"q4", goal:4, prompt:"Demand `1000e^{-p/50}` and a cost of $8 per item. Profit-maximizing price?",
          choices:[
            { t:"$58", ok:true, fb:"Right. `P′ ∝ 1 - (p - 8)/50 = 0` at `p = 58`." },
            { t:"$50", fb:"`P′ ∝ 1 - (p - 8)/50 = 0`. $50 maximizes revenue." },
            { t:"$42", fb:"`P′ ∝ 1 - (p - 8)/50 = 0`: the cost is added to 50." },
            { t:"$8", fb:"`P′ ∝ 1 - (p - 8)/50 = 0`. At cost price, profit is 0." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"crit", type:"custom", title:"Find the critical numbers", summary:"Find the critical numbers", goal:[1, 2],
        instruction:"Find every critical number of each function.",
        how:"Type exact values: whole numbers, fractions and `ln` where you need it (`1/2`, −4, `ln 3`). Separate several values with commas. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact values only, such as −4, 1/2 or `ln 3`. Separate several values with commas.",
          exact:"Close, but give the exact value (with `ln` or `e`), not a decimal.", general:"Not yet. Factor out the exponential and set the other factor to 0." },
        items:[
          { id:"d1", goal:[1, 2], prompt:"`f(x) = xe^{-2x}`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[0.5] }, display:"`x = 1/2`",
            wrong:[{ k:"x", eq:[0], fb:"`e^{-2x}` is never 0; `f′ = e^{-2x}(1 - 2x)`." }, { k:"x", eq:[0, 0.5], fb:"`e^{-2x}` is never 0; `f′ = e^{-2x}(1 - 2x)`." },
              { k:"x", eq:[-0.5], fb:"The exponent `-2x` changes at rate −2: `f′ = e^{-2x}(1 - 2x)`." }],
            general:"Use the product rule and factor out `e^{-2x}`.",
            why:"`f′ = e^{-2x} - 2xe^{-2x} = e^{-2x}(1 - 2x)`, and `e^{-2x} > 0`." },
          { id:"d2", goal:[1, 2], prompt:"`f(x) = x^2e^{-x}`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[0, 2] }, display:"`x = 0` and `x = 2`",
            wrong:[{ k:"x", eq:[2], fb:"`f′ = xe^{-x}(2 - x)`: the factor `x` gives 0." }],
            general:"Use the product rule and factor out `xe^{-x}`.",
            hints:["Product rule.", "`2xe^{-x} - x^2e^{-x} = xe^{-x}(2 - x)`.", "0 and 2."],
            why:"`f′ = 2xe^{-x} - x^2e^{-x} = xe^{-x}(2 - x)`: zero at `x = 0` and `x = 2`." },
          { id:"d3", goal:[1, 2], prompt:"`f(x) = e^{x^2 - 4x}`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[2] }, display:"`x = 2`",
            general:"`f′ = (2x - 4)e^{x^2 - 4x}`.",
            why:"`f′ = (2x - 4)e^{x^2 - 4x}`; the exponential is never 0, so `2x - 4 = 0`." },
          { id:"d4", goal:[1, 2], prompt:"`f(x) = (x - 3)e^x`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[2] }, display:"`x = 2`",
            wrong:[{ k:"x", eq:[3], fb:"That’s where `f = 0`, not `f′`. `f′ = e^x(x - 2)`." }],
            general:"Use the product rule and factor out `e^x`.",
            why:"`f′ = e^x + (x - 3)e^x = e^x(x - 2)`." },
          { id:"d5", goal:[1, 2], prompt:"`f(x) = e^x - 3x`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[Math.log(3)] }, display:"`x = ln 3`",
            wrong:[{ k:"x", eq:[3], fb:"`e^x = 3` means `x = ln 3`." }],
            general:"`f′ = e^x - 3`.",
            hints:["`f′ = e^x - 3`.", "`e^x = 3`.", "`x = ln 3`."],
            why:"`f′ = e^x - 3 = 0` when `e^x = 3`, so `x = ln 3`." },
          { id:"d6", goal:[1, 2], prompt:"`f(x) = xe^{x/4}`",
            boxes:[{ k:"x", pre:"`x =`", list:true }], answer:{ x:[-4] }, display:"`x = -4`",
            wrong:[{ k:"x", eq:[4], fb:"`f′ = e^{x/4}(1 + x/4)`." }],
            general:"Use the product rule and factor out `e^{x/4}`.",
            why:"`f′ = e^{x/4} + (x/4)e^{x/4} = e^{x/4}(1 + x/4)`: zero at `x = -4`." }
        ] },
      { id:"opt", type:"custom", title:"Optimize the model", summary:"Optimize the model", star:true, goal:[3, 4, 5],
        instruction:"Solve each problem with exact values. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type exact values with `e` or `ln` where you need them (`10/e`, `600/e`, `4 ln 2`, `e`), then press Check.",
        msgs:{ fill:"Fill in every box and make every choice first.", err:"Type exact values only, such as 3, 1/3, `10/e`, `e^-3` or `4 ln 2`.",
          exact:"Close, but give the exact value with `e` or `ln` (such as `10/e` or `4 ln 2`), not a decimal.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"o1", goal:3, prompt:"Absolute maximum of `f(t) = 10te^{-t}` on `[0, 3]`: the value.",
            boxes:[{ k:"v", pre:"Maximum value" }], answer:{ v:10 / E }, display:"`10/e` (at `t = 1`)",
            wrong:[{ k:"v", eq:30 * Math.exp(-3), fb:"That’s the endpoint `t = 3`; compare it with `f(1)`." }],
            why:"`f′ = 10e^{-t}(1 - t)`: the peak at `t = 1` is inside `[0, 3]`, and `f(1) = 10/e` ≈ 3.68 beats `f(0) = 0` and `f(3) = 30e^{-3}` ≈ 1.49." },
          { id:"o2", goal:[3, 5], prompt:"A rumour spreads so that `r(t) = 200te^{-t/3}` people hear it per hour. When is `r` greatest, and what is it?",
            boxes:[{ k:"t", pre:"Greatest at `t =`", unit:"h" }, { k:"r", pre:"Greatest value `r =`", unit:"people per hour" }],
            answer:{ t:3, r:600 / E }, display:"`t = 3` h, `r = 600/e` ≈ 221 people per hour",
            wrong:[{ k:"t", eq:1 / 3, fb:"The peak is at `1/k` with `k = 1/3`." }],
            why:"`r′ = 200e^{-t/3}(1 - t/3) = 0` at `t = 3`; `r(3) = 600e^{-1} = 600/e` ≈ 221 people per hour." },
          { id:"o3", goal:3, star:true, prompt:"Where on `[0, 2]` is `f(t) = 10te^{-t/3}` greatest?",
            boxes:[{ k:"t", pre:"`t =`" }], answer:{ t:2 }, display:"`t = 2`",
            wrong:[{ k:"t", eq:3, fb:"3 is outside `[0, 2]`; `f` is still rising at 2." }],
            why:"`f′ = 10e^{-t/3}(1 - t/3) > 0` on `[0, 2]`, so `f` is increasing there and the maximum is at the endpoint `t = 2`." },
          { id:"o4", goal:3, star:true, prompt:"Minimize `f(x) = e^x/x` for `x > 0`: the `x` and the minimum value.",
            boxes:[{ k:"x", pre:"`x =`" }, { k:"v", pre:"Minimum value" }], answer:{ x:1, v:E }, display:"`x = 1`, minimum value `e`",
            general:"`f′ = e^x(x - 1)/x^2`.",
            why:"`f′ = {e^x · x - e^x}/{x^2} = e^x(x - 1)/x^2`: negative on `(0, 1)` and positive after, so the minimum is `f(1) = e`." },
          { id:"o5", goal:[3, 5], star:true, prompt:"Two drugs: `C_1(t) = 8te^{-t}` and `C_2(t) = 2te^{-t/2}`. At what time `t > 0` are they equal, and which peaks higher?",
            boxes:[{ k:"t", pre:"Equal at `t =`", unit:"h" }, { k:"c", pre:"Peaks higher", choice:[{ id:"c1", t:"`C_1`" }, { id:"c2", t:"`C_2`" }] }],
            answer:{ t:4 * Math.log(2), c:"c1" }, display:"`t = 4 ln 2` h (≈ 2.77); `C_1` (`8/e` vs `4/e`)",
            wrong:[{ k:"t", eq:Math.log(4), fb:"`8e^{-t} = 2e^{-t/2}` gives `e^{t/2} = 4`, so `t = 2 ln 4`." },
              { k:"c", eq:"c2", fb:"Compare the peaks: `C_1(1) = 8/e` and `C_2(2) = 4/e`." }],
            hints:["Divide both sides by `t` (fine here, `t > 0`).", "`8e^{-t} = 2e^{-t/2}`, so `4 = e^{t/2}`.", "`t = 2 ln 4 = 4 ln 2`. Peaks: `C_1(1) = 8/e`, `C_2(2) = 4/e`."],
            why:"`8e^{-t} = 2e^{-t/2}` gives `e^{t/2} = 4`, so `t = 2 ln 4 = 4 ln 2` ≈ 2.77 h. `C_1` peaks at `C_1(1) = 8/e`, higher than `C_2(2) = 4/e`." },
          { id:"o6", goal:[4, 5], star:true, prompt:"At price `p` dollars, `q = 5000e^{-0.04p}` units sell. Each costs $15 to make. Find the profit-maximizing price.",
            boxes:[{ k:"p", pre:"Price", money:true }], answer:{ p:40 }, display:"$40",
            wrong:[{ k:"p", eq:25, fb:"That maximizes revenue. Profit: `P′ ∝ 1 - 0.04(p - 15)`." }, { k:"p", eq:10, fb:"Add the cost: `p - 15 = 25`." }],
            hints:["Profit = (price − cost) × quantity.", "`P′ = 5000e^{-0.04p}[1 - 0.04(p - 15)]`.", "`p - 15 = 25`, so `p = 40`."],
            why:"`P = (p - 15) · 5000e^{-0.04p}`, so `P′ = 5000e^{-0.04p}[1 - 0.04(p - 15)] = 0` when `p - 15 = 25`: $40." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Brianna", how:"", goal:[2, 5],
        instruction:"Brianna made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the maximum of `C(t) = 12te^{-3t}` for `t ≥ 0`.",
            steps:["Product rule: `C′(t) = 12e^{-3t} + 12t · (e^{-3t})′`.",
              "`(e^{-3t})′ = -3e^{-3t}`.",
              "So `C′(t) = 12e^{-3t}(1 - 3t)`.",
              "Set each factor to 0: `e^{-3t} = 0` gives `t = 0`, and `1 - 3t = 0` gives `t = 1/3`.",
              "Compare `C(0) = 0` and `C(1/3) = 4/e`: the maximum is `4/e` at `t = 1/3`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 reaches the right answer, but it relies on step 4’s reasoning."],
            fixes:[
              { t:"`e^{-3t}` is never 0, so the only critical number is `t = 1/3`; `t = 0` is an endpoint to check, not a critical number.", ok:true, why:"Only the factor `1 - 3t` can be 0." },
              { t:"`e^{-3t} = 0` when `t = 3`.", why:"`e^{-9}` is small but positive." },
              { t:"`e^{-3t} = 0` only for negative `t`.", why:"It’s positive for every `t`." },
              { t:"Step 4 is correct.", why:"`e^0 = 1`, not 0. " + M1 }],
            hints:["What is `e^{-3 · 0}`?", "`e^0 = 1`.", "No value of `t` makes `e^{-3t} = 0`."] },
          { id:"e2", goal:5, task:"A store sells `q = 800e^{-p/25}` items at a price of `p` dollars. Find the price that maximizes revenue and the maximum revenue.",
            steps:["`R(p) = p · 800e^{-p/25}`.",
              "`R′(p) = 800e^{-p/25}(1 - p/25)`.",
              "`R′ = 0` when `p = 25`.",
              "Maximum revenue = `q(25) = 800e^{-1}` ≈ 294.",
              "The best price is $25, earning about $294."],
            answer:3,
            stepFb:["Step 1 is correct: revenue = price × quantity.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 reports step 4’s number."],
            fixes:[
              { t:"Maximum revenue = `R(25) = 25 · 800e^{-1} = 20 000/e` ≈ $7358.", ok:true, why:"Revenue is `R`, not `q`." },
              { t:"`R(25) = 25 · 800` = $20 000.", why:"The factor `e^{-1}` is missing." },
              { t:"`R(25) = 800 · 25/25` = $800.", why:"That cancels the price with the exponent’s denominator." },
              { t:"Step 4 is correct.", why:"`q(25)` ≈ 294 is the number of items sold, not the money. " + M5 }],
            hints:["What does `q` measure?", "Items sold. Revenue is `R`.", "`R(25) = 20 000/e`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the dose curve: that `@a{A}` never moves the peak, or that the peak lands exactly at `1/k`?" },
      { id:"j2", q:"In your own words, why can you ignore the exponential factor when you look for critical numbers?" },
      { id:"j3", q:"Explain to a friend how a price cap or a closed time window can change the answer to an optimization problem." },
      { id:"j4", q:"Which step of these problems do you still find hardest: building the model, differentiating, or interpreting? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:DDT + " `(te^{-4t})` = ?", options:[
          { t:"`e^{-4t}(1 - 4t)`", ok:true, why:"Product rule: `1 · e^{-4t} + t · (-4e^{-4t}) = e^{-4t}(1 - 4t)`." },
          { t:"`-4e^{-4t}`", why:"That multiplies the two derivatives. " + M2 },
          { t:"`e^{-4t}(1 + 4t)`", why:"The exponent’s derivative is −4." },
          { t:"`e^{-4t}`", why:"That’s only the first term of the product rule." }] },
        b:{ prompt:DDT + " `(te^{-5t})` = ?", options:[
          { t:"`e^{-5t}(1 - 5t)`", ok:true, why:"Product rule: `1 · e^{-5t} + t · (-5e^{-5t}) = e^{-5t}(1 - 5t)`." },
          { t:"`-5e^{-5t}`", why:"That multiplies the two derivatives. " + M2 },
          { t:"`e^{-5t}(1 + 5t)`", why:"The exponent’s derivative is −5." },
          { t:"`e^{-5t}`", why:"That’s only the first term of the product rule." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What are the critical numbers of `f(x) = (x - 6)e^{x/2}`?", options:[
          { t:"`x = 4`", ok:true, why:"`f′ = e^{x/2}[1 + (x - 6)/2] = e^{x/2}(x - 4)/2`." },
          { t:"`x = 6`", why:"That’s where `f = 0`, not `f′`." },
          { t:"`x = 0` and `x = 4`", why:"`e^{x/2}` is never 0." },
          { t:"`x = 8`", why:"The chain factor is `+1/2`: `1 + (x - 6)/2`, not `1 - (x - 6)/2`." }] },
        b:{ prompt:"What are the critical numbers of `f(x) = (x - 5)e^{x/3}`?", options:[
          { t:"`x = 2`", ok:true, why:"`f′ = e^{x/3}(x - 2)/3`." },
          { t:"`x = 5`", why:"Zero of `f`, not `f′`." },
          { t:"`x = 0` and `x = 2`", why:"`e^{x/3}` is never 0." },
          { t:"`x = 8`", why:"The chain factor is `+1/3`: `1 + (x - 5)/3`, not `1 - (x - 5)/3`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`C(t) = 30te^{-t/4}` mg/L. When does the concentration peak?", options:[
          { t:"At `t = 4` h", ok:true, why:"`C′ = 30e^{-t/4}(1 - t/4)`." },
          { t:"At `t = 1/4` h", why:"The peak is at `1/k` with `k = 1/4`." },
          { t:"At `t = 30` h", why:"`@a{A}` doesn’t set the time." },
          { t:"At `t = 7.5` h", why:"30/4 mixes `@a{A}` into the peak time." }] },
        b:{ prompt:"`C(t) = 18te^{-t/6}` mg/L. When does the concentration peak?", options:[
          { t:"At `t = 6` h", ok:true, why:"`C′ = 18e^{-t/6}(1 - t/6)`." },
          { t:"At `t = 1/6` h", why:"The peak is at `1/k` with `k = 1/6`." },
          { t:"At `t = 18` h", why:"`@a{A}` doesn’t set the time." },
          { t:"At `t = 3` h", why:"18/6 mixes `@a{A}` into the peak time." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find the absolute maximum of `f(t) = 6te^{-t/2}` on `[0, 5]`.", use:USE, options:[
          { t:"`12/e`", ok:true, why:"Peak at `t = 2`, inside `[0, 5]`; `f(2) = 12e^{-1}` ≈ 4.4, more than `f(5) = 30e^{-5/2}` ≈ 2.5 and `f(0) = 0`." },
          { t:"`30e^{-5/2}`", why:"That’s the endpoint value, smaller than the peak." },
          { t:"`6/e`", why:"That evaluates at `t = 1`; the peak is at `t = 2`." },
          { t:"12", why:"`f(2) = 12e^{-1}`, not 12." }] },
        b:{ prompt:"Find the absolute maximum of `f(t) = 9te^{-t/3}` on `[0, 6]`.", use:USE, options:[
          { t:"`27/e`", ok:true, why:"Peak at `t = 3` inside the interval; `f(3) = 27e^{-1}` ≈ 9.9." },
          { t:"`54e^{-2}`", why:"That’s the endpoint value, smaller than the peak." },
          { t:"`9/e`", why:"That evaluates at `t = 1`; the peak is at `t = 3`." },
          { t:"27", why:"`f(3) = 27e^{-1}`, not 27." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Find the absolute maximum of `g(t) = 8te^{-t/5}` on `[0, 3]`.", use:USE, options:[
          { t:"`24e^{-3/5}`", ok:true, why:"The peak is at `t = 5`, outside `[0, 3]`. `g` is increasing on `[0, 3]`, so the maximum is `g(3)`." },
          { t:"`40/e`", why:"That’s the value at `t = 5`, outside the interval." },
          { t:"`8e^{-1/5}`", why:"That evaluates at `t = 1`." },
          { t:"0", why:"That’s the minimum, at `t = 0`." }] },
        b:{ prompt:"Find the absolute maximum of `g(t) = 4te^{-t/6}` on `[0, 2]`.", use:USE, options:[
          { t:"`8e^{-1/3}`", ok:true, why:"The peak at `t = 6` is outside; maximum at `t = 2`." },
          { t:"`24/e`", why:"That’s the value at `t = 6`, outside the interval." },
          { t:"`4e^{-1/6}`", why:"That evaluates at `t = 1`." },
          { t:"0", why:"That’s the minimum, at `t = 0`." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"`f(x) = x^2e^{-x}`. Which describes its critical points?", options:[
          { t:"A local minimum at (0, 0) and a local maximum at `(2, 4/e^2)`", ok:true, why:"`f′ = xe^{-x}(2 - x)`: − before 0, + between 0 and 2, − after 2." },
          { t:"A local maximum at `(2, 4/e^2)` only", why:"The factor `x` gives a second critical number, 0." },
          { t:"A local minimum at (0, 0) and a local maximum at `(-2, 4e^2)`", why:"`2 - x = 0` at `x = 2`, not −2." },
          { t:"A local maximum at (0, 0) and a local minimum at `(2, 4/e^2)`", why:"Check the signs of `f′`: it changes − to + at 0." }] },
        b:{ prompt:"`f(x) = x^2e^{-x/2}`. Which describes its critical points?", options:[
          { t:"A local minimum at (0, 0) and a local maximum at `(4, 16/e^2)`", ok:true, why:"`f′ = xe^{-x/2}(2 - x/2)`." },
          { t:"A local maximum at `(4, 16/e^2)` only", why:"The factor `x` gives a second critical number, 0." },
          { t:"A local minimum at (0, 0) and a local maximum at `(-4, 16e^2)`", why:"`2 - x/2 = 0` at `x = 4`, not −4." },
          { t:"A local maximum at (0, 0) and a local minimum at `(4, 16/e^2)`", why:"Check the signs of `f′`: it changes − to + at 0." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `(1 - 2t)e^{-2t} = 0` has only the solution `t = 1/2`?", options:[
          { t:"“`e^{-2t}` is positive for every `t`, so the product is 0 only when `1 - 2t = 0`.”", ok:true, why:"A positive factor can’t make a product 0." },
          { t:"“`e^{-2t} = 0` has the solution `t = 0`, but it’s an endpoint, so we drop it.”", why:"`e^0 = 1`. " + M1 },
          { t:"“You can divide both sides by `e^{-2t}` because it’s a constant.”", why:"It isn’t constant; you can divide because it’s never 0." },
          { t:"“Take ln of both sides to bring down the exponent.”", why:"`ln 0` is undefined; that step fails." }] },
        b:{ prompt:"Which is the best explanation of why `(x - 3)e^{x^2} = 0` has only the solution `x = 3`?", options:[
          { t:"“`e^{x^2}` is positive for every `x`, so the product is 0 only when `x - 3 = 0`.”", ok:true, why:"A positive factor can’t make a product 0." },
          { t:"“`e^{x^2} = 0` when `x = 0`, but that root is extraneous.”", why:"`e^0 = 1`. " + M1 },
          { t:"“`e^{x^2}` is a constant, so divide it out.”", why:"It’s not constant; you can divide because it’s never 0." },
          { t:"“Take ln of both sides.”", why:"`ln 0` is undefined; that step fails." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A revenue model gives the best price as `p` = $40, with `R(40) = 80 000/e`. Which statement is best?", use:USE, options:[
          { t:"“Charging $40 gives the greatest revenue, `80 000/e` ≈ $29 430.”", ok:true, why:"It names the price, the revenue (exact and approximate) and the units." },
          { t:"“Demand is greatest at $40.”", why:"Demand is greatest at the lowest price." },
          { t:"“The greatest revenue is $40.”", why:"$40 is the price; the revenue is `80 000/e`." },
          { t:"“The revenue at $40 is `80 000e` ≈ $217 000.”", why:"`e^{-1}` divides by `e`." }] },
        b:{ prompt:"A dose model peaks at `t = 3` h with `C(3) = 15/e` mg/L. Which statement is best?", use:USE, options:[
          { t:"“The concentration is greatest 3 hours after the dose, about 5.5 mg/L.”", ok:true, why:"It gives the time and the value `15/e` ≈ 5.5 mg/L, with units." },
          { t:"“The concentration is 3 mg/L at its peak.”", why:"3 is the time, in hours; the peak value is `15/e` mg/L." },
          { t:"“The concentration is greatest at `15/e` ≈ 5.5 hours.”", why:"That’s the value, not the time." },
          { t:"“The peak concentration is `15e` ≈ 40.8 mg/L.”", why:"`e^{-1}` divides by `e`." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A gym sells `q = 2000e^{-p/30}` memberships at a monthly price of `p` dollars. Which price maximizes revenue, and what is the revenue?", use:USE, options:[
          { t:"$30, revenue `60 000/e` ≈ $22 073 per month", ok:true, why:"`R = 2000pe^{-p/30}`; `R′ = 2000e^{-p/30}(1 - p/30)`." },
          { t:"$30, revenue `2000/e` ≈ $736 per month", why:"That’s the number of memberships. " + M5 },
          { t:"$0, because demand is greatest there", why:M7 },
          { t:"$30, revenue `60 000e` ≈ $163 097 per month", why:"The exponent is −1: divide by `e`." }] },
        b:{ prompt:"A streaming service gets `q = 1200e^{-p/40}` subscribers at a price of `p` dollars. Which price maximizes revenue, and what is the revenue?", use:USE, options:[
          { t:"$40, revenue `48 000/e` ≈ $17 658", ok:true, why:"`R = 1200pe^{-p/40}`; `R′ = 1200e^{-p/40}(1 - p/40)`." },
          { t:"$40, revenue `1200/e` ≈ $441", why:"That’s the number of subscribers. " + M5 },
          { t:"$0, because demand is greatest there", why:M7 },
          { t:"$40, revenue `48 000e` ≈ $130 478", why:"The exponent is −1: divide by `e`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Demand is `q = 500e^{-p/20}` items at price `p` dollars, and each item costs $6 to make. Which price maximizes profit?", options:[
          { t:"$26", ok:true, why:"`P = (p - 6) · 500e^{-p/20}`; `P′ ∝ 1 - (p - 6)/20 = 0`." },
          { t:"$20", why:"That maximizes revenue and ignores the cost." },
          { t:"$14", why:"The cost is added to 20, not subtracted." },
          { t:"$6", why:"At cost price, profit is 0." }] },
        b:{ prompt:"Demand is `q = 900e^{-p/15}` items at price `p` dollars, and each item costs $4 to make. Which price maximizes profit?", options:[
          { t:"$19", ok:true, why:"`P = (p - 4) · 900e^{-p/15}`; `P′ ∝ 1 - (p - 4)/15 = 0`." },
          { t:"$15", why:"That maximizes revenue." },
          { t:"$11", why:"Add the cost." },
          { t:"$4", why:"Profit is 0 there." }] } }
    ]
  },
  task:{
    title:"Dose design", summary:"Dose design",
    statement:"<p>Design a dose curve `C(t) = @a{A}te^{-kt}` (mg/L, `t` in hours) that meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The concentration peaks between 2 h and 5 h after the dose (inclusive).</li><li>The peak concentration is between `40/e` and `60/e` mg/L (inclusive).</li><li>The concentration is still rising at `t = 3` h.</li></ol></div>",
    inputs:{ A:"Dose factor `@a{A}`", Anote:"5 to 60, in steps of 5", k:"Elimination rate `k` (per hour)" },
    read:{ ptime:"Peak time `1/k`", pval:"Peak concentration `@a{A}/(ke)`", d3:"`C′(3)`", band:"band `40/e` to `60/e`" },
    checks:["Peak between 2 h and 5 h", "Peak between `40/e` and `60/e`", "Still rising at 3 h"],
    tips:["The peak time is `1/k`. Which chips give 2 to 5 hours?",
      "The peak value is `C(1/k) = @a{A}/(ke)`. You need `@a{A}/k` between 40 and 60.",
      "`C′(t) = @a{A}e^{-kt}(1 - kt)`. Rising at 3 means the peak comes after 3 h."],
    explainPrompt:"Explain how you used the peak time `1/k` and the peak value `@a{A}/(ke)` to find every design.",
    vocab:"Use the words peak, critical number, product rule and never zero.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 3 rules out `k = 1/2` and `1/3` (the peak isn’t after 3 h); line 1 rules out `k = 1/6`. Then `@a{A} = 40k` to `60k` in steps of 5."
  },
  cards:[
    [DDT + " `(te^{-kt})`", "`e^{-kt}(1 - kt)`."],
    ["`e^u = 0`?", "Never. `e^u > 0` for every `u`."],
    ["Peak of `@a{A}te^{-kt}`", "At `t = 1/k`; value `@a{A}/(ke)`."],
    ["What `@a{A}` does", "Stretches vertically; doesn’t move the peak time."],
    ["Revenue", "`R` = price × quantity."],
    ["Demand `Ne^{-p/c}`", "Revenue is greatest at `p = c`."],
    ["Profit with cost `m` per item", "`P = (p - m) · q`; best price `c + m` for `q = Ne^{-p/c}`."],
    ["Closed interval", "Compare critical numbers inside the interval <strong>and</strong> the endpoints."],
    ["Peak outside the window", "The best value is at an endpoint."],
    ["Factor first", "Pull out `e^{g}` before setting `f′ = 0`."],
    ["Answer the question", "Give the quantity asked (time, price, revenue) with units."]
  ]
};
