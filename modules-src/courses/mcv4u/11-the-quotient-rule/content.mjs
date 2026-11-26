// MCV4U 11 The Quotient Rule. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/11-the-quotient-rule.md
const DDX = '<span class="m">d/d<i>x</i></span>';
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "Dividing the derivatives gives the wrong slope.";
const M2 = "Subtraction isn’t commutative. Swapping the order flips the sign of every slope.";
const M3 = "The denominator is `g^2`, not `g`. Check: `(f/g)′` for `f = x`, `g = x^2` must equal `-1/x^2`.";
const M4 = "Where `g = 0` the function isn’t defined, so there’s no tangent at all. Only the numerator of `f′` can make the slope 0.";
const M5 = "The minus applies to the whole product `f · g′`. Use brackets.";
const M7 = "Check the domain first: if `g(a) = 0`, there’s no point on the graph at `x = a`.";
// hero equation: f in --pen, g in teal --f3, the minus highlighted (built by hand so the letters can carry colours)
const F = '<i class="qr-f">f</i>', G = '<i class="qr-g">g</i>';
const HERO_EQ = '<span class="m qr-heq">(' + F + "/" + G + ")′ = " +
  '<span class="frac"><span class="fn">' + F + "′" + G + ' <span class="qr-minus">−</span> ' + F + G + "′</span>" +
  '<span class="fd">' + G + "<sup>2</sup></span></span></span>";

export default {
  id:"11-the-quotient-rule",
  kind:"topic",
  title:"The quotient rule",
  topic:"The Quotient Rule",
  readyTopic:"the quotient rule",
  hero:{
    eq:HERO_EQ,
    eqLabel:"f over g, prime, equals f prime g minus f g prime, all over g squared",
    eqSize:"md",
    headline:"Low d-high minus high d-low, over low squared",
    text:"To differentiate a <strong>quotient</strong> `f(x)/g(x)`, you can’t just divide the derivatives. The <strong>quotient rule</strong> multiplies across, subtracts in a fixed order, and divides by the <strong>denominator squared</strong>. It tells you the slope of a <strong>rational function</strong> anywhere it’s defined, including where its tangent is <strong>horizontal</strong>.",
    fig:{ aria:"The graph of y = x/(x² + 1) with a tangent line sliding along it; it flattens at x = −1 and x = 1.", shape:"wide" }
  },
  goals:[
    "I can state the quotient rule and use it to differentiate a quotient of polynomials.",
    "I can decide when to rewrite a quotient with negative exponents instead of using the rule.",
    "I can find the slope and the equation of the tangent to a rational function at a point.",
    "I can find where a rational function has horizontal tangents and where its derivative is undefined.",
    "I can explain where the quotient rule comes from, using the product rule.",
    "I can use the derivative of a quotient to solve rate problems in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Product rule", goal:5, prompt:"Differentiate `(x^2 + 1)(3x - 2)`.",
          options:[
            { t:"`9x^2 - 4x + 3`", ok:true, why:"`2x(3x - 2) + 3(x^2 + 1) = 6x^2 - 4x + 3x^2 + 3`." },
            { t:"`6x`", why:"`(fg)′ ≠ f′g′`: that’s `2x · 3`." },
            { t:"`6x^2 - 4x`", why:"Add `fg′ = 3(x^2 + 1)`." },
            { t:"`3x^2 + 3`", why:"Add `f′g = 2x(3x - 2)`." }],
          hints:["`f′g + fg′`.", "`2x(3x - 2) + (x^2 + 1)(3)`.", "`9x^2 - 4x + 3`."] },
        { id:"w2", skill:"Product rule", goal:5, prompt:"Find the slope of `y = (2x + 1)(x^2 - 3)` at `x = 1`.",
          options:[
            { t:"2", ok:true, why:"`2(1 - 3) + 3(2) = -4 + 6`." },
            { t:"4", why:"That multiplies the derivatives: `2 · 2x` at `x = 1`. Use `f′g + fg′`." },
            { t:"−4", why:"Add `fg′ = 3 × 2 = 6`." },
            { t:"6", why:"Add `f′g = 2 × (-2) = -4`." }],
          hints:["Evaluate `f`, `g`, `f′`, `g′` at 1.", "`f = 3`, `f′ = 2`, `g = -2`, `g′ = 2`.", "`2(-2) + 3(2) = 2`."] },
        { id:"w3", skill:"Negative exponents", goal:2, prompt:"Write `3/x^2` as a power of `x`.",
          options:[
            { t:"`3x^{-2}`", ok:true, why:"`1/x^2 = x^{-2}`, and the 3 stays in front." },
            { t:"`(3x)^{-2}`", why:"`(3x)^{-2} = 1/(9x^2)`." },
            { t:"`3x^{-1/2}`", why:"`x^{-1/2} = 1/√x`." },
            { t:"`-3x^2`", why:"A negative exponent means “reciprocal”, not “negative”." }],
          hints:["`1/x^n = x^{-n}`.", "`1/x^2 = x^{-2}`.", "`3x^{-2}`."] },
        { id:"w4", skill:"Negative exponents", goal:2, prompt:"Differentiate `4/x`.",
          options:[
            { t:"`-{4}/{x^2}`", ok:true, why:"`4x^{-1} -> 4(-1)x^{-2} = -4x^{-2}`." },
            { t:"`{4}/{x^2}`", why:"The exponent −1 comes down as a factor." },
            { t:"0", why:"`4/x` isn’t constant: it changes as `x` changes." },
            { t:"`-{4}/{x}`", why:"`-1 - 1 = -2`." }],
          hints:["Rewrite as `4x^{-1}`.", "Bring down −1, subtract 1 from the exponent.", "`-4x^{-2} = -{4}/{x^2}`."] },
        { id:"w5", skill:"Zeros of rational expressions", goal:4, prompt:"Simplify `{x^2 - 9}/{x - 3}` for `x ≠ 3`.",
          options:[
            { t:"`x + 3`", ok:true, why:"`{(x - 3)(x + 3)}/{x - 3}`." },
            { t:"`x - 3`", why:"`x^2 - 9 = (x - 3)(x + 3)`." },
            { t:"`x^2 - 3`", why:"You can only cancel common <strong>factors</strong>." },
            { t:"3", why:"`x^2/x` isn’t how factors cancel here." }],
          hints:["Factor the top.", "`(x - 3)(x + 3)`.", "`x + 3`."] },
        { id:"w6", skill:"Zeros of rational expressions", goal:4, prompt:"For which `x` is `{x^2 - 6x + 8}/{(x - 1)^2}` equal to 0?",
          options:[
            { t:"`x = 2` or `x = 4`", ok:true, why:"The numerator `(x - 2)(x - 4)` is 0 and the denominator isn’t." },
            { t:"`x = 1`", why:"At `x = 1` the expression is undefined, not 0." },
            { t:"`x = 1`, 2 or 4", why:"A fraction is 0 only when its numerator is." },
            { t:"`x = -2` or `x = -4`", why:"`x - 2 = 0` at `x = 2`." }],
          hints:["When is a fraction 0?", "Factor the numerator.", "2 or 4."] }
      ],
      refreshers:{
        "Product rule":"`(fg)′ = f′g + fg′`. Two terms, each with one derivative.",
        "Negative exponents":"`k/x^n = kx^{-n}`, so its derivative is `-nkx^{-n-1}`.",
        "Zeros of rational expressions":"A fraction is 0 only when its numerator is 0 and its denominator isn’t. Where the denominator is 0, it’s undefined."
      }
    }
  },
  explore:{
    heading:"Rational tangent hunter",
    intro:"Slide the point of tangency along a rational function. Watch where the tangent flattens, and where it can’t exist at all.",
    fns:[
      { id:"R1", chip:"`x/(x^2 + 1)`", eq:"`y = {x}/{x^2 + 1}`", d:"`{(1 - x)(1 + x)}/{(x^2 + 1)^2}`", flat:"`x = -1`, `x = 1`", undef:"nowhere: `x^2 + 1` is never 0",
        plain:"y = x/(x² + 1)" },
      { id:"R2", chip:"`(x^2 + 3)/(x - 1)`", eq:"`y = {x^2 + 3}/{x - 1}`", d:"`{(x - 3)(x + 1)}/{(x - 1)^2}`", flat:"`x = -1`, `x = 3`", undef:"`x = 1` (not in the domain)",
        plain:"y = (x² + 3)/(x − 1)" },
      { id:"R3", chip:"`(2x + 1)/(x - 2)`", eq:"`y = {2x + 1}/{x - 2}`", d:"`-{5}/{(x - 2)^2}`", flat:"none", undef:"`x = 2` (not in the domain)",
        plain:"y = (2x + 1)/(x − 2)" },
      { id:"R4", chip:"`x^2/(x^2 - 4)`", eq:"`y = {x^2}/{x^2 - 4}`", d:"`-{8x}/{(x^2 - 4)^2}`", flat:"`x = 0`", undef:"`x = -2`, `x = 2` (not in the domain)",
        plain:"y = x²/(x² − 4)" },
      { id:"B", chip:"Build", eq:"`y = {x + c}/{x^2 + k}`", undef:"nowhere: `x^2 + k > 0`", plain:"y = (x + c)/(x² + k)" }
    ],
    modes:[{ id:"tan", t:"Tangent" }, { id:"sign", t:"Sign chart" }, { id:"wrong", t:"Wrong-rule overlay" }],
    modeHow:{
      tan:"Drag the point of tangency, or use the slider. The teal panel below shows `f′`, with the current slope as a dot.",
      sign:"The sign chart shows the sign of each factor of `f′`, the sign of `f′` and how the function behaves (↗ ↘). Horizontal tangents say “slope 0”; zeros of the denominator say “not in the domain”.",
      wrong:"The long dashes show the wrong rule: the derivative of the top divided by the derivative of the bottom. Compare it with the true `f′` in teal."
    },
    rows:{ fn:"Function", pt:"Point", d:"`f′(x)`", slope:"Slope here", tan:"Tangent", flat:"Horizontal tangents", undef:"Derivative undefined at", wrong:"Dividing the derivatives (wrong rule)" },
    skip:"Skipped {x}: not in the domain.",
    tc2:{ title:"TC2 tangents parallel to `y = -3x + 1`", one:"Found {x}. Move to the other point and press <strong>Record this point</strong> to earn the badge.",
      both:"★ Found both: `x = 0` and `x = 2`.", rec:"Record this point", not:"The slope at {x} is {m}, not −3." },
    predIntro:"Make a prediction first. Then the tangent hunter shows you what really happens.",
    predictions:[
      { id:"p1", fn:"R1", mode:"tan", prompt:"R1, point at `x = 0`. What’s the slope of the tangent to `y = {x}/{x^2 + 1}` at `x = 0`?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"undefined" }, { t:"1/2" }],
        explain:"`(1 · 1 - 0 · 0)/1^2 = 1`. Dividing derivatives would give `1/(2x)`, undefined at 0: a sign the wrong rule is wrong." },
      { id:"p2", fn:"R3", mode:"tan", prompt:"R3. How many horizontal tangents does `y = {2x + 1}/{x - 2}` have?",
        options:[{ t:"0", ok:true }, { t:"1" }, { t:"2" }, { t:"infinitely many" }],
        explain:"`f′ = -5/(x - 2)^2`. The numerator is −5, which is never 0." },
      { id:"p3", fn:"R2", mode:"sign", prompt:"R2, Sign chart mode. Where does `y = {x^2 + 3}/{x - 1}` have horizontal tangents?",
        options:[{ t:"`x = -1` and `x = 3`", ok:true }, { t:"`x = 1` only" }, { t:"`x = 0` only" }, { t:"`x = -1`, 1 and 3" }],
        explain:"`f′ = {(x - 3)(x + 1)}/{(x - 1)^2}`. At `x = 1` there’s no point, so no tangent. (Dividing the derivatives gives `2x`, which is 0 only at `x = 0`: the wrong rule.)" },
      { id:"p4", fn:"R4", mode:"wrong", prompt:"R4, Wrong-rule overlay. Dividing the derivatives says the slope of `y = {x^2}/{x^2 - 4}` is always `2x/2x = 1`. What’s the true slope at `x = 1`?",
        options:[{ t:"−8/9", ok:true }, { t:"1" }, { t:"8/9" }, { t:"8/3" }],
        explain:"`f′ = -8x/(x^2 - 4)^2`, so `f′(1) = -8/9`. 8/9 reverses the numerator; 8/3 forgets to square the denominator." }
    ],
    chalIntro:"Use the tangent hunter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"On R1, move the point to the horizontal tangent where the function is highest.",
        why:"`f′ = 0` where `1 - x^2 = 0`, at `x = ±1`; `f(1) = 1/2` is the higher of the two.",
        hints:["Set the numerator `1 - x^2 = 0`.", "`x = ±1`.", "`f(1) = 1/2` is higher than `f(-1) = -1/2`."],
        msgs:{ fn:"Choose R1 first.", neg:"That tangent is horizontal too, but `f(-1) = -1/2` is the lowest value.", zero:"The slope there is 1.",
          other:"The slope here is {m}. Find a horizontal tangent." } },
      { id:"tc2", goal:[3, 4], prompt:"On R2, move the point to where the tangent is parallel to `y = -3x + 1`.",
        why:"`f′(x) = -3` gives `4x^2 - 8x = 0`, so `x = 0` or `x = 2`. Find the other one too: the tangent hunter shows a “Found both” badge.",
        hints:["Set `f′(x) = -3`.", "`x^2 - 2x - 3 = -3(x - 1)^2`.", "`4x^2 - 8x = 0`, so `x = 0` or 2."],
        msgs:{ fn:"Choose R2 first.", dom:"Not in the domain.", rise:"This tangent rises; you need slope −3.", other:"The slope here is {m}; you need −3." } },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Build mode: choose `c` and `k` so that `y = {x + c}/{x^2 + k}` has horizontal tangents at exactly `x = -3` and `x = 1`.",
        why:"`c = 1`, `k = 3`: the numerator of `f′` is `-x^2 - 2x + 3 = -(x + 3)(x - 1)`.",
        hints:["Find the numerator of `f′`: `(x^2 + k) - (x + c)(2x) = -x^2 - 2cx + k`.", "It must be a multiple of `(x + 3)(x - 1) = x^2 + 2x - 3`.", "`-(x^2 + 2x - 3)`: so `2c = 2` and `k = 3`."],
        msgs:{ fn:"Choose Build, then set `c` and `k` with the sliders.", rev:"Your flat spots are at `x = 3` and `x = -1`: the sign of `c` is reversed.",
          k:"Right axis of symmetry for the flat spots, wrong spacing: the product of the `x`-values must be `-k`.",
          other:"Your flat spots are at {r}. You need `x = -3` and `x = 1`." } }
    ]
  },
  part3:{
    slug:"derive", name:"Derive it",
    heading:"Derive it from the product rule",
    intro:"The rule is easy to misremember, so learn to rebuild it. Derive it from the product rule, check it with numbers, then decide when you don’t need it at all. Then try the quick check.",
    stations:[
      { id:"st1", title:"Station 1: Three-line derivation",
        text:"Step through the derivation. Then put the five steps back in order.",
        steps:[
          "Let `Q = f/g`. Multiply by `g`: `f = Q · g`.",
          "Product rule: `f′ = Q′g + Qg′`.",
          "Solve for `Q′`: `Q′ = {f′ - Qg′}/{g}`.",
          "Replace `Q` with `f/g`: `Q′ = {f′ - (f/g)g′}/{g}`.",
          "Multiply top and bottom by `g`: `Q′ = {f′g - fg′}/{g^2}`."
        ],
        orderPrompt:"Put the five steps of the derivation in order.",
        orderHow:"Tap a step, then use Move up and Move down to put it in place. Press Check the order when it’s right. Stuck? Step through the derivation above again.",
        orderWrong:"Solve for `Q′` first, then substitute.",
        orderWhy:"Write `f = Q · g`, use the product rule, solve for `Q′`, replace `Q`, then clear the small fraction: a second `g` lands underneath." },
      { id:"st2", title:"Station 2: Check it with numbers",
        text:"R1 at `x = 2`: the rule gives `(1 · 5 - 2 · 4)/25 = -3/25`. Choose `h` to draw a secant through P(2, 2/5) and Q; the secant slopes fill the table and approach −0.12.",
        rule:"Quotient rule: `f′(2) = -3/25 = -0.12`",
        alg:[
          "`f = x`, `g = x^2 + 1`",
          "`f′ = 1`, `g′ = 2x`",
          "At `x = 2`: `f = 2`, `g = 5`, `f′ = 1`, `g′ = 4`",
          "`{f′g - fg′}/{g^2} = {1 · 5 - 2 · 4}/{5^2} = -{3}/{25} = -0.12`"
        ] },
      { id:"st3", title:"Station 3: Rewrite instead?",
        text:"Toggle between the quotient rule and rewriting for `{x^3 + 2}/{x}`.",
        ruleLines:[
          "`f = x^3 + 2`, `g = x`, `f′ = 3x^2`, `g′ = 1`",
          "`y′ = {3x^2 · x - (x^3 + 2)}/{x^2}`",
          "`= {2x^3 - 2}/{x^2}`",
          "`= 2x - {2}/{x^2}`"
        ],
        rewriteLines:[
          "`{x^3 + 2}/{x} = x^2 + 2x^{-1}`",
          "`y′ = 2x - 2x^{-2}`",
          "`= 2x - {2}/{x^2}`"
        ],
        same:"Same answer, fewer steps.",
        thumb:"Single-term denominator? Divide first. Several terms below? Use the quotient rule." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Derive it quick check",
      items:[
        { id:"q1", goal:5, prompt:"In the derivation, why can we write `f = Q · g`?",
          choices:[
            { t:"Because `Q = f/g`, so multiply both sides by `g`", ok:true, fb:"Right. `Q = f/g` means `Q · g = f` wherever `g ≠ 0`." },
            { t:"Because `f` and `g` are polynomials", fb:"`Q = f/g` means `Q · g = f` wherever `g ≠ 0`." },
            { t:"Because `Q′ = f′/g′`", fb:"`Q = f/g` means `Q · g = f` wherever `g ≠ 0`." },
            { t:"Because `g = 1`", fb:"`Q = f/g` means `Q · g = f` wherever `g ≠ 0`." }] },
        { id:"q2", goal:1, prompt:"The quotient rule’s numerator is…",
          choices:[
            { t:"`f′g - fg′`", ok:true, fb:"Right. Low d-high first, then subtract high d-low." },
            { t:"`fg′ - f′g`", fb:"Low d-high first, then subtract high d-low." },
            { t:"`f′g′`", fb:"Low d-high first, then subtract high d-low." },
            { t:"`f′g + fg′`", fb:"Low d-high first, then subtract high d-low." }] },
        { id:"q3", goal:2, prompt:"Derivative of `{x^2 + 5}/{x}`, by rewriting first?",
          choices:[
            { t:"`1 - 5/x^2`", ok:true, fb:"Right. `x + 5x^{-1} -> 1 - 5x^{-2}`." },
            { t:"`2x`", fb:"`x + 5x^{-1} -> 1 - 5x^{-2}`." },
            { t:"`1 + 5/x^2`", fb:"`x + 5x^{-1} -> 1 - 5x^{-2}`." },
            { t:"0", fb:"`x + 5x^{-1} -> 1 - 5x^{-2}`." }] },
        { id:"q4", goal:4, prompt:"If `g(2) = 0`, what is `(f/g)′(2)`?",
          choices:[
            { t:"Undefined: 2 isn’t in the domain", ok:true, fb:"Right. No point on the graph means no tangent." },
            { t:"0", fb:"No point on the graph means no tangent." },
            { t:"`f′(2)`", fb:"No point on the graph means no tangent." },
            { t:"`f′(2)/g′(2)`", fb:"No point on the graph means no tangent." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Function ↔ derivative", summary:"Function ↔ derivative", goal:[1, 2],
        instruction:"Match each function to its derivative. One derivative on the right has no partner.",
        how:"Tap a function, then tap its derivative on the right.",
        leftTitle:"Function", rightTitle:"Derivative",
        left:[
          { id:"l1", goal:1, t:"`{x}/{x + 1}`", why:"`(x + 1) - x = 1`, over `(x + 1)^2`." },
          { id:"l2", goal:1, t:"`{x - 1}/{x + 1}`", why:"`(x + 1) - (x - 1) = 2`, over `(x + 1)^2`." },
          { id:"l3", goal:[1, 2], t:"`{1}/{x^2 + 1}`", why:"`0 · (x^2 + 1) - 1 · 2x = -2x`, over `(x^2 + 1)^2`." },
          { id:"l4", goal:1, t:"`{x^2}/{x + 1}`", why:"`2x(x + 1) - x^2 · 1 = x^2 + 2x`, over `(x + 1)^2`.",
            hints:["`f = x^2`, `g = x + 1`.", "`2x(x + 1) - x^2 · 1`.", "`{x^2 + 2x}/{(x + 1)^2}`."] },
          { id:"l5", goal:1, t:"`{2x + 3}/{x - 1}`", why:"`2(x - 1) - (2x + 3) = -5`, over `(x - 1)^2`." },
          { id:"l6", goal:[1, 2], t:"`{3}/{x - 2}`", why:"`0 · (x - 2) - 3 · 1 = -3`, over `(x - 2)^2`. Or rewrite: `3(x - 2)^{-1}`." },
          { id:"l7", goal:[1, 2], t:"`{x + 1}/{x^2}`", why:"Rewrite as `x^{-1} + x^{-2}`: the derivative is `-x^{-2} - 2x^{-3} = {-x - 2}/{x^3}`.",
            hints:["Rewrite as `x^{-1} + x^{-2}`.", "`-x^{-2} - 2x^{-3}`.", "`{-x - 2}/{x^3}`."] },
          { id:"l8", goal:1, t:"`{x}/{x^2 + 4}`", why:"`(x^2 + 4) - x · 2x = 4 - x^2`, over `(x^2 + 4)^2`." }
        ],
        right:[
          { id:"r1", t:"`{1}/{(x + 1)^2}`" },
          { id:"r2", t:"`{2}/{(x + 1)^2}`" },
          { id:"r3", t:"`{-2x}/{(x^2 + 1)^2}`" },
          { id:"r4", t:"`{x^2 + 2x}/{(x + 1)^2}`" },
          { id:"r5", t:"`{-5}/{(x - 1)^2}`" },
          { id:"r6", t:"`{-3}/{(x - 2)^2}`" },
          { id:"r7", t:"`-{x + 2}/{x^3}`" },
          { id:"r8", t:"`{4 - x^2}/{(x^2 + 4)^2}`" },
          { id:"r9", t:"`{x^2 - 4}/{(x^2 + 4)^2}`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"Numerator `(x + 1) - x = 1`, not 2.",
          "l6|r1":"A constant over a line: the slope’s sign comes from `-3 · 1`.",
          "l6|r2":"A constant over a line: the slope’s sign comes from `-3 · 1`.",
          "l8|r9":"That’s the reversed numerator."
        },
        wrongDefault:"Write `f`, `g`, `f′`, `g′` first, then build `f′g - fg′`." },
      { id:"slopes", type:"custom", title:"Slopes and tangents", summary:"Slopes and tangents", star:true, goal:[3, 4],
        instruction:"Find slopes, tangents and flat spots of rational functions. Items 3 to 6 are non-routine.",
        how:"Type whole numbers or fractions, such as 7/4 or −1/2. A point takes two boxes; the order of the points doesn’t matter.",
        items:[
          { id:"s1", goal:3, kind:"boxes", prompt:"Slope of `y = {3x - 1}/{x + 2}` at `x = 0`.",
            boxes:[{ k:"m", label:"Slope" }], answer:{ m:1.75 }, display:"7/4",
            wrong:[{ m:-1.75, fb:M2 }, { m:3, fb:M1 }, { m:3.5, fb:M3 }],
            why:"`f′ = 7/(x + 2)^2`, so `f′(0) = 7/4`." },
          { id:"s2", goal:3, kind:"boxes", prompt:"Tangent to `y = {x^2}/{x - 3}` at `x = 4`: enter slope and `y`-intercept.",
            boxes:[{ k:"m", label:"Slope" }, { k:"b", label:"`y`-intercept" }], answer:{ m:-8, b:48 }, display:"`y = -8x + 48`",
            wrong:[{ m:8, fb:M2 }, { b:16, fb:"`f(4) = 16` is the `y`-value of the point, not the intercept." }],
            why:"`f′ = (x^2 - 6x)/(x - 3)^2`, so `f′(4) = -8`; `y - 16 = -8(x - 4)` gives `y = -8x + 48`." },
          { id:"s3", goal:4, star:true, kind:"points", prompt:"Both points on `y = {x^2 - 3}/{x - 2}` with a horizontal tangent.",
            answer:[[1, 2], [3, 6]], display:"(1, 2) and (3, 6)",
            wrong:[{ x:2, fb:M4 }, { pt:[1, -2], fb:"`f(1) = (1 - 3)/(1 - 2) = 2`." }],
            why:"`f′ = (x - 1)(x - 3)/(x - 2)^2`: the numerator is 0 at `x = 1` and `x = 3`." },
          { id:"s4", goal:3, star:true, kind:"boxes", prompt:"Find `a` so that `y = {ax + 1}/{x + 2}` has slope 3 at `x = -1`.",
            boxes:[{ k:"a", label:"`a`" }], answer:{ a:2 }, display:"`a = 2`",
            wrong:[{ a:-1, fb:M2 + " That makes `-(2a - 1) = 3`." }],
            why:"`f′ = (2a - 1)/(x + 2)^2`; at `x = -1` that’s `2a - 1 = 3`, so `a = 2`." },
          { id:"s5", goal:3, star:true, kind:"points", prompt:"Find both points on `y = {x + 1}/{x - 1}` where the tangent is perpendicular to `y = 2x + 5`.",
            answer:[[3, 2], [-1, 0]], display:"(3, 2) and (−1, 0)",
            wrong:[{ pts:[[0, -1], [2, 3]], fb:"Perpendicular slopes multiply to −1: you need −1/2." }], one:"`(x - 1)^2 = 4` has two solutions.",
            why:"`f′ = -2/(x - 1)^2 = -1/2` gives `(x - 1)^2 = 4`, so `x = 3` or `x = -1`.",
            hints:["`f′ = -2/(x - 1)^2`.", "Set it equal to `-1/2`.", "`(x - 1)^2 = 4`: `x = 3` or −1."] },
          { id:"s6", goal:4, star:true, kind:"chips", prompt:"For which values of `k` does `y = {x}/{x^2 + k}` have exactly two horizontal tangents?",
            options:[
              { t:"`k > 0`", ok:true, why:"The numerator of `f′` is `k - x^2`. Two solutions of `x^2 = k` need `k > 0`, and then `x^2 + k ≠ 0`." },
              { t:"`k < 0`", why:"`k - x^2 = 0` needs `x^2 = k`, impossible when `k < 0`." },
              { t:"`k = 0`", why:"Then `y = 1/x`, which has no flat spots." },
              { t:"every `k ≠ 0`", why:"`k - x^2 = 0` needs `x^2 = k`, impossible when `k < 0`." }],
            hints:["Find the numerator of `f′`.", "`(x^2 + k) - 2x^2 = k - x^2`.", "Two solutions of `x^2 = k` need `k > 0`, and then `x^2 + k ≠ 0`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Kofi", how:"", goal:[1, 2, 4],
        instruction:"Kofi made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Differentiate `y = {x^2 + 1}/{x - 3}`.",
            steps:["`f = x^2 + 1`, `g = x - 3`, `f′ = 2x`, `g′ = 1`.", "`y′ = {(x^2 + 1)(1) - 2x(x - 3)}/{(x - 3)^2}`", "`= {x^2 + 1 - 2x^2 + 6x}/{(x - 3)^2}`", "`= {-x^2 + 6x + 1}/{(x - 3)^2}`"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 simplifies step 2 correctly. The mistake is earlier.", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"`{2x(x - 3) - (x^2 + 1)(1)}/{(x - 3)^2} = {x^2 - 6x - 1}/{(x - 3)^2}`", ok:true, why:"Low d-high first: `f′g = 2x(x - 3)`, then subtract `fg′ = (x^2 + 1)(1)`." },
              { t:"`{2x(x - 3) + (x^2 + 1)}/{(x - 3)^2}`", why:"That’s the product rule’s plus sign." },
              { t:"`2x/1 = 2x`", why:M1 },
              { t:"Step 2 is correct: the order doesn’t matter.", why:"Swapping flips the sign of every slope." }],
            hints:["Which comes first in the numerator: `f′g` or `fg′`?", "`f′g = 2x(x - 3)` first.", "`{x^2 - 6x - 1}/{(x - 3)^2}`."] },
          { id:"e2", goal:4, task:"Find the horizontal tangents of `y = {x^2}/{x - 2}`.",
            steps:["`y′ = {2x(x - 2) - x^2(1)}/{(x - 2)^2}`", "`= {x^2 - 4x}/{(x - 2)^2}`", "Set `y′ = 0`: `x(x - 4) = 0` or `(x - 2)^2 = 0`.", "So `x = 0`, 2 or 4."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"Only the numerator can be 0: `x = 0` or 4, giving (0, 0) and (4, 8).", ok:true, why:"A fraction is 0 only when its numerator is 0 and its denominator isn’t." },
              { t:"Only `x = 2`.", why:"At `x = 2` the function isn’t defined, so there’s no tangent." },
              { t:"Step 3 is correct: every factor counts.", why:"At `x = 2` the function isn’t defined, so there’s no tangent." },
              { t:"`x = -4` or 0.", why:"Sign slip." }],
            hints:["When is a fraction 0?", "Numerator `x(x - 4)`.", "(0, 0) and (4, 8)."] },
          { id:"e3", goal:2, task:"Differentiate `y = 6/x^3` with the quotient rule.",
            steps:["`f = 6`, `g = x^3`", "`f′ = 0`, `g′ = 3x^2`", "`y′ = {0 · x^3 - 6 · 3x^2}/{x^6}`", "`= -18x^2/x^6 = -18x^3`"],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct: `(x^3)^2 = x^6`.", ""],
            fixes:[
              { t:"`-18x^2/x^6 = -18x^{-4} = -18/x^4`", ok:true, why:"Dividing powers subtracts exponents: `2 - 6 = -4`." },
              { t:"`= -18x^8`", why:"Dividing powers subtracts exponents." },
              { t:"`y′ = 0`, because the numerator is constant.", why:"`6/x^3` changes as `x` changes. Rewrite as `6x^{-3}` and use the power rule." },
              { t:"Step 4 is correct.", why:"`x^2/x^6 = x^{2 - 6}`, not `x^3`." }],
            hints:["`x^2/x^6 = x^{2 - 6}`.", "`x^{-4}`.", "Check by rewriting: `6x^{-3} -> -18x^{-4}`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the tangent hunter: the function with no flat spots, or how badly “divide the derivatives” did?" },
      { id:"j2", q:"In your own words, why does the denominator of a quotient’s derivative get squared?" },
      { id:"j3", q:"Explain to a friend how to find the horizontal tangents of a rational function, and why the denominator doesn’t help." },
      { id:"j4", q:"Which part of the quotient rule do you still slip on? What will you do to remember it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is the derivative of `y = f(x)/g(x)`?", options:[
          { t:"`{f′g - fg′}/{g^2}`", ok:true, why:"Low d-high minus high d-low, over low squared." },
          { t:"`{fg′ - f′g}/{g^2}`", why:M2 },
          { t:"`{f′}/{g′}`", why:M1 },
          { t:"`{f′g - fg′}/{g}`", why:M3 }] },
        b:{ prompt:"Which is " + DDX + " [`u/v`], where `u` and `v` are functions of `x`?", options:[
          { t:"`{u′v - uv′}/{v^2}`", ok:true, why:"Low d-high minus high d-low, over low squared, with `u` on top and `v` below." },
          { t:"`{uv′ - u′v}/{v^2}`", why:M2 },
          { t:"`{u′}/{v′}`", why:M1 },
          { t:"`{u′v + uv′}/{v^2}`", why:"That’s the product rule’s sign." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Differentiate `y = {2x - 1}/{x + 3}`.", options:[
          { t:"`{7}/{(x + 3)^2}`", ok:true, why:"`2(x + 3) - (2x - 1) = 7`." },
          { t:"`-{7}/{(x + 3)^2}`", why:M2 },
          { t:"2", why:M1 },
          { t:"`{7}/{x + 3}`", why:M3 }] },
        b:{ prompt:"Differentiate `y = {3x + 2}/{x - 1}`.", options:[
          { t:"`-{5}/{(x - 1)^2}`", ok:true, why:"`3(x - 1) - (3x + 2) = -5`." },
          { t:"`{5}/{(x - 1)^2}`", why:M2 },
          { t:"3", why:M1 },
          { t:"`-{5}/{x - 1}`", why:M3 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"For `y = {x^2 + 8}/{x - 1}`, where is the derivative undefined, and where is the tangent horizontal?", options:[
          { t:"Undefined at `x = 1`; horizontal at `x = -2` and `x = 4`", ok:true, why:"`f′ = {(x - 4)(x + 2)}/{(x - 1)^2}`." },
          { t:"Undefined at `x = 1`; horizontal at `x = 1`", why:M4 },
          { t:"Undefined at `x = -2` and 4; horizontal at `x = 1`", why:"Swapped: zeros of the numerator give the flat spots." },
          { t:"Undefined at `x = 1`; horizontal at `x = 2` and `x = -4`", why:"Sign slip: `x - 4 = 0` at 4." }] },
        b:{ prompt:"For `y = {x^2 + 5}/{x + 2}`, where is the derivative undefined, and where is the tangent horizontal?", options:[
          { t:"Undefined at `x = -2`; horizontal at `x = -5` and `x = 1`", ok:true, why:"`f′ = {(x + 5)(x - 1)}/{(x + 2)^2}`." },
          { t:"Undefined at `x = -2`; horizontal at `x = -2`", why:M4 },
          { t:"Undefined at `x = -5` and 1; horizontal at `x = -2`", why:"Swapped: zeros of the numerator give the flat spots." },
          { t:"Undefined at `x = -2`; horizontal at `x = 5` and `x = -1`", why:"Sign slip: `x + 5 = 0` at −5." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find the equation of the tangent to `y = {x + 2}/{x - 1}` at `x = 2`.", options:[
          { t:"`y = -3x + 10`", ok:true, why:"`f(2) = 4`; `f′ = -3/(x - 1)^2`, so `f′(2) = -3`; `y - 4 = -3(x - 2)`." },
          { t:"`y = 3x - 2`", why:"Slope +3 comes from the reversed numerator. " + M2 },
          { t:"`y = x + 2`", why:"`f′/g′ = 1` isn’t the slope. " + M1 },
          { t:"`y = -3x + 4`", why:"Uses `f(2)` as the `y`-intercept instead of point-slope form." }] },
        b:{ prompt:"Find the equation of the tangent to `y = {x + 3}/{x - 2}` at `x = 3`.", options:[
          { t:"`y = -5x + 21`", ok:true, why:"`f(3) = 6`; `f′(3) = -5`; `y - 6 = -5(x - 3)`." },
          { t:"`y = 5x - 9`", why:M2 },
          { t:"`y = x + 3`", why:M1 },
          { t:"`y = -5x + 6`", why:"Point-slope form needed: `f(3) = 6` is the `y`-value of the point, not the intercept." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`y = {x^2 + a}/{x - 1}` has a horizontal tangent at `x = 3`. Find `a`.", options:[
          { t:"3", ok:true, why:"Numerator of `f′`: `2x(x - 1) - (x^2 + a) = x^2 - 2x - a`; at 3: `3 - a = 0`." },
          { t:"−3", why:"The minus must apply to the whole of `(x^2 + a)`. " + M5 },
          { t:"−9", why:"That makes `f(3) = 0`, not the slope." },
          { t:"−21", why:"That’s the product rule’s plus sign: `12 + 9 + a = 0`." }] },
        b:{ prompt:"`y = {x^2 + a}/{x - 1}` has a horizontal tangent at `x = 4`. Find `a`.", options:[
          { t:"8", ok:true, why:"`16 - 8 - a = 0`." },
          { t:"−8", why:M5 },
          { t:"−16", why:"That makes `f(4) = 0`." },
          { t:"−40", why:"Product rule’s plus sign: `24 + 16 + a = 0`." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"`f(2) = 3`, `f′(2) = -1`, `g(2) = 2`, `g′(2) = 4`. Find `(f/g)′(2)`.", options:[
          { t:"−7/2", ok:true, why:"`(-1 · 2 - 3 · 4)/2^2 = -14/4`." },
          { t:"7/2", why:M2 },
          { t:"−1/4", why:M1 },
          { t:"−7", why:M3 }] },
        b:{ prompt:"`f(1) = 4`, `f′(1) = 2`, `g(1) = -2`, `g′(1) = 3`. Find `(f/g)′(1)`.", options:[
          { t:"−4", ok:true, why:"`(2 · (-2) - 4 · 3)/(-2)^2 = -16/4`." },
          { t:"4", why:M2 },
          { t:"2/3", why:M1 },
          { t:"8", why:"`-16 ÷ (-2)`: the denominator must be squared." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why the quotient rule has `g^2` in the denominator?", options:[
          { t:"“Writing `f = Q · g` and solving the product rule for `Q′` gives `(f′ - Qg′)/g`. Replacing `Q` with `f/g` puts a second `g` underneath.”", ok:true, why:"The derivation shows where the second `g` comes from." },
          { t:"“Because the derivative of `g` is `2g`.”", why:"That’s not true for most `g`." },
          { t:"“Because everything in a quotient gets squared when you differentiate.”", why:"Only the denominator is squared, and the derivation shows why." },
          { t:"“Because the numerator has two terms.”", why:"The number of terms doesn’t decide the denominator." }] },
        b:{ prompt:"Which is the best explanation of why the order in the quotient rule’s numerator matters?", options:[
          { t:"“Subtraction isn’t commutative: `fg′ - f′g` is the negative of `f′g - fg′`, so the reversed order gives every slope the wrong sign.”", ok:true, why:"Swapping the order flips the sign of every slope." },
          { t:"“It doesn’t matter; both orders give the same derivative.”", why:M2 },
          { t:"“Because `f` must always be written before `g`.”", why:"Order matters because of the subtraction, not the letters." },
          { t:"“Because `g^2` must stay positive.”", why:"`g^2` is positive in either order." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"For `y = {x}/{(x - 2)^2}`, `f′(x) = -{x + 2}/{(x - 2)^3}`. Which description is correct?", options:[
          { t:"“A horizontal tangent at `x = -2`; no tangent at `x = 2`, which isn’t in the domain.”", ok:true, why:"The numerator is 0 at `x = -2`; at `x = 2` the function isn’t defined." },
          { t:"“Horizontal tangents at `x = -2` and `x = 2`.”", why:M4 },
          { t:"“A horizontal tangent at `x = 2` only.”", why:M4 + " " + M7 },
          { t:"“No horizontal tangents, because the denominator is cubed.”", why:"The power of the denominator doesn’t stop the numerator being 0." }] },
        b:{ prompt:"For `y = {x^2}/{x + 3}`, `f′(x) = {x(x + 6)}/{(x + 3)^2}`. Which description is correct?", options:[
          { t:"“Horizontal tangents at `x = 0` and `x = -6`; no tangent at `x = -3`, which isn’t in the domain.”", ok:true, why:"The numerator is 0 at `x = 0` and `x = -6`; at `x = -3` the function isn’t defined." },
          { t:"“Horizontal tangents at `x = 0`, −6 and −3.”", why:M4 },
          { t:"“A horizontal tangent at `x = -3` only.”", why:M4 + " " + M7 },
          { t:"“Horizontal tangents at `x = 0` and `x = 6`.”", why:"Sign slip: `x + 6 = 0` at −6." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A medicine’s concentration in the blood is `c(t) = {5t}/{t^2 + 4}` mg/L, `t` hours after a dose. How fast is it changing at `t = 1`?", options:[
          { t:"0.6 mg/L per hour", ok:true, why:"`c′ = (20 - 5t^2)/(t^2 + 4)^2`, so `c′(1) = 15/25`." },
          { t:"−0.6 mg/L per hour", why:M2 },
          { t:"2.5 mg/L per hour", why:"`5/(2t)` at `t = 1`. " + M1 },
          { t:"3 mg/L per hour", why:"`15/5`: the denominator must be squared." }] },
        b:{ prompt:"`c(t) = {6t}/{t^2 + 9}` mg/L. How fast is it changing at `t = 1`?", options:[
          { t:"0.48 mg/L per hour", ok:true, why:"`c′ = (54 - 6t^2)/(t^2 + 9)^2`, so `c′(1) = 48/100`." },
          { t:"−0.48 mg/L per hour", why:M2 },
          { t:"3 mg/L per hour", why:M1 },
          { t:"4.8 mg/L per hour", why:"`48/10`: the denominator must be squared." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"The average cost per item of making `x` items a day is `A(x) = {2x^2 + 800}/{x}` dollars. At what production level is the rate of change of the average cost zero, and what is the average cost then?", options:[
          { t:"20 items; $80 each", ok:true, why:"`A′ = (2x^2 - 800)/x^2`, zero at `x = 20`; `A(20) = 1600/20`." },
          { t:"400 items; $802 each", why:"`x^2 = 400` gives `x = 20`, not 400." },
          { t:"0 items", why:"`x = 0` isn’t in the domain. " + M4 },
          { t:"Never: the average cost always rises", why:"`f′/g′ = 4x` isn’t the rate. " + M1 }] },
        b:{ prompt:"`A(x) = {3x^2 + 1200}/{x}` dollars. At what production level is the rate of change of the average cost zero, and what is the average cost then?", options:[
          { t:"20 items; $120 each", ok:true, why:"`A′ = (3x^2 - 1200)/x^2`; `A(20) = 2400/20`." },
          { t:"400 items; $1203 each", why:"`x^2 = 400` gives `x = 20`." },
          { t:"0 items", why:"`x = 0` isn’t in the domain. " + M4 },
          { t:"Never: the average cost always rises", why:"`f′/g′ = 6x` isn’t the rate. " + M1 }] } }
    ]
  },
  task:{
    title:"Two flat spots", summary:"Two flat spots",
    statement:"<p>Design `y = {x^2 + b}/{x - c}` that meets every condition. There’s more than one answer.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It has a vertical asymptote at a positive `x`-value.</li><li>It has exactly two horizontal tangents.</li><li>One of the horizontal tangents is at `x = 5`.</li><li>Its `y`-intercept is positive.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers: `b` from −50 to 50 and `c` from −10 to 10. The graph shows the asymptote, the horizontal tangents and the factored `f′`.</p>",
    checks:["Vertical asymptote at a positive `x`", "Exactly two horizontal tangents", "A horizontal tangent at `x = 5`", "`y`-intercept positive"],
    tips:["The asymptote is at `x = c`. If `x^2 + b` has `(x - c)` as a factor, it cancels and leaves a hole instead.",
      "`f′` has numerator `x^2 - 2cx - b`. It needs two different real zeros.",
      "Substitute `x = 5` into the numerator: `25 - 10c - b = 0`.",
      "At `x = 0`, `y = b/(-c)`. With `c > 0` that needs `b < 0`."],
    explainPrompt:"Explain how you used the numerator of `f′` to meet lines 2 and 3, and why `c = 5` doesn’t work.",
    vocab:"Use the words numerator, horizontal tangent, vertical asymptote and domain.",
    after3:"`c = 5` would give `b = -25`, and `(x^2 - 25)/(x - 5)` is just `x + 5` with a hole. `c = 8` needs `b = -55`, outside the range."
  },
  cards:[
    ["Quotient rule", "`(f/g)′ = {f′g - fg′}/{g^2}`, where `g ≠ 0`."],
    ["Memory line", "“Low d-high minus high d-low, over low squared.”"],
    ["Not this", "`(f/g)′ ≠ f′/g′`."],
    ["Order matters", "Reversing the numerator flips the sign of every slope."],
    ["Where it comes from", "`f = Q · g`, product rule, solve for `Q′`."],
    ["Horizontal tangents", "Where the numerator of `f′` is 0 (and `g ≠ 0`)."],
    ["Derivative undefined", "Where `g = 0`: not in the domain, so no tangent."],
    ["Rewrite instead", "Single-term denominator: divide first. `{x^3 + 2}/{x} = x^2 + 2x^{-1}`."],
    ["`k/x^n`", "Rewrite as `kx^{-n}`; derivative `-nkx^{-n-1}`."],
    ["`{2x + 1}/{x - 2}`", "Derivative `-{5}/{(x - 2)^2}`: always negative, no flat spots."],
    ["Tangent line", "`y - f(a) = f′(a)(x - a)`."],
    ["Values only", "`(f/g)′(a) = {f′(a)g(a) - f(a)g′(a)}/{g(a)^2}`."]
  ]
};
