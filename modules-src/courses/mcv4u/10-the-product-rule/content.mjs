// MCV4U 10 The Product Rule. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/10-the-product-rule.md
const DDX = '<span class="m">d/d<i>x</i></span>';
const DY = '<span class="m">d<i>y</i>/d<i>x</i></span>';
const LZ_OK = '<span class="m">(d<i>u</i>/d<i>x</i>)<i>v</i> + <i>u</i>(d<i>v</i>/d<i>x</i>)</span>';
const LZ_M1 = '<span class="m">(d<i>u</i>/d<i>x</i>)(d<i>v</i>/d<i>x</i>)</span>';
const LZ_Q = '<span class="m">(d<i>u</i>/d<i>x</i>)<i>v</i> − <i>u</i>(d<i>v</i>/d<i>x</i>)</span>';
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "Check with `x · x = x^2`: `f′g′ = 1`, but `(x^2)′ = 2x`.";
const M2 = "Both factors change, so there are two terms: `f′g` <strong>and</strong> `fg′`.";
const M3 = "Each term has exactly one derivative in it.";
const M4 = DDX + " `(5 - 2x) = -2`. Keep the sign.";
const M5 = "`f(a)g(a)` is the height of the product, not its slope.";
const M6 = "`[f]^2 = f · f`, so its derivative is `f′f + ff′ = 2ff′`.";
const M7 = "Revenue changes because price changes (`p′q`) <strong>and</strong> because sales change (`pq′`).";
const QUOT = "That minus sign belongs to the quotient rule (module 11).";

export default {
  id:"10-the-product-rule",
  kind:"topic",
  title:"The product rule",
  topic:"The Product Rule",
  readyTopic:"the product rule",
  hero:{
    eq:"`(fg)′ = f′g + fg′`",
    eqLabel:"f g, all prime, equals f prime g plus f g prime",
    eqSize:"md",
    headline:"Two factors, two terms",
    text:"When two quantities that are multiplied together both change, their product changes for two reasons at once. The <strong>product rule</strong> adds both effects: `f′g + fg′`. It’s never just `f′g′`. A rectangle shows why.",
    fig:{ html:'<div class="pr-hero"><div id="pr-hero-svg" class="pr-svgbox" role="img" aria-label="A rectangle with width f of x and height g of x."></div><div id="pr-hero-ctl"></div></div>' },
    steps:[
      "A rectangle with width `f(x)` (blue edge) and height `g(x)` (teal edge).",
      "Nudge `x` forward. The rectangle grows a strip along the top (`fΔg`), a strip down the side (`gΔf`) and a small corner square (`ΔfΔg`).",
      "Shrink `Δx`. The strips thin in proportion…",
      "…but the corner shrinks much faster…",
      "…and fades out.",
      "Divide by `Δx` and let it shrink: the top strip gives `fg′`, the side strip gives `f′g`, and the corner gives 0. So `(fg)′ = f′g + fg′`."
    ]
  },
  goals:[
    "I can state the product rule and explain it with the growing rectangle.",
    "I can verify the product rule by expanding and differentiating a product of polynomials.",
    "I can apply the product rule to products of polynomial and power functions, including radicals.",
    "I can use the product rule to find tangent lines and horizontal tangents.",
    "I can extend the rule to three factors and to `[f(x)]^2`, and use given values of `f`, `f′`, `g`, `g′`.",
    "I can apply the product rule to rates in context, such as revenue = price × quantity."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Power rule", goal:3, prompt:DDX + " `(3x^4 - 2x)` = ?",
          options:[
            { t:"`12x^3 - 2`", ok:true, why:"Term by term: `3 × 4x^3` and −2." },
            { t:"`12x^3`", why:"You dropped the linear term’s derivative: `-2x → -2`." },
            { t:"`3x^3 - 2`", why:"Multiply by the exponent too: `3 × 4 = 12`." },
            { t:"`12x^4 - 2`", why:"Lower the exponent by 1: `x^4` becomes `4x^3`." }],
          hints:["Term by term.", "`3 × 4x^3` and −2.", "`12x^3 - 2`."] },
        { id:"w2", skill:"Power rule", goal:3, prompt:DDX + " `(x^{3/2})` = ?",
          options:[
            { t:"`(3/2)x^{1/2}`", ok:true, why:"Bring down 3/2, then `3/2 - 1 = 1/2`." },
            { t:"`(3/2)x^{5/2}`", why:"Subtract 1 from the exponent; don’t add it: `3/2 - 1 = 1/2`." },
            { t:"`(2/3)x^{1/2}`", why:"Bring down 3/2 as it is; don’t flip it." },
            { t:"`x^{1/2}`", why:"You forgot the factor 3/2 that comes down from the exponent." }],
          hints:["Bring down 3/2.", "`3/2 - 1 = 1/2`.", "`(3/2)x^{1/2}`."] },
        { id:"w3", skill:"Expanding", goal:2, prompt:"Expand `(2x + 1)(x^2 - 3)`.",
          options:[
            { t:"`2x^3 + x^2 - 6x - 3`", ok:true, why:"`2x^3 - 6x + x^2 - 3`, ordered by degree." },
            { t:"`2x^3 - 3`", why:"That multiplies only the first terms and the last terms. Multiply every pair." },
            { t:"`2x^3 + x^2 - 3`", why:"You missed `2x × (-3) = -6x`." },
            { t:"`2x^3 + x^2 + 6x - 3`", why:"Sign: `2x × (-3) = -6x`." }],
          hints:["Multiply each term of the first bracket by each of the second.", "`2x^3 - 6x + x^2 - 3`.", "Order by degree."] },
        { id:"w4", skill:"Expanding", goal:2, prompt:"Expand `x^2(x - 4)`.",
          options:[
            { t:"`x^3 - 4x^2`", ok:true, why:"`x^2 · x` and `x^2 · (-4)`." },
            { t:"`x^3 - 4`", why:"Distribute `x^2` to the −4 as well." },
            { t:"`x^2 - 4x`", why:"That multiplies by `x`. The factor outside is `x^2`." },
            { t:"`x^3 - 4x`", why:"Multiply −4 by `x^2`, not by `x`." }],
          hints:["Multiply `x^2` by each term.", "`x^2 · x` and `x^2 · (-4)`.", "`x^3 - 4x^2`."] },
        { id:"w5", skill:"Tangent lines", goal:4, prompt:"`f(1) = 2` and `f′(1) = 5`. What is the tangent at `x = 1`?",
          options:[
            { t:"`y = 5x - 3`", ok:true, why:"`y - 2 = 5(x - 1)`." },
            { t:"`y = 2x + 3`", why:"That swaps the slope and the height. The slope is `f′(1) = 5`; the point is (1, 2)." },
            { t:"`y = 5x + 2`", why:"2 is the height at `x = 1`, not the `y`-intercept. Use point–slope form." },
            { t:"`y = 5x + 7`", why:"Sign slip: it’s `y - 2 = 5(x - 1)`, not `5(x + 1)`." }],
          hints:["Point (1, 2), slope 5.", "`y - 2 = 5(x - 1)`.", "`y = 5x - 3`."] },
        { id:"w6", skill:"Tangent lines", goal:4, prompt:"Where does a graph have a horizontal tangent?",
          options:[
            { t:"Where `f′(x) = 0`", ok:true, why:"Horizontal means slope 0, and the slope is `f′(x)`." },
            { t:"Where `f(x) = 0`", why:"That’s where the height is 0, not the slope." },
            { t:"Where `f′(x)` is undefined", why:"That’s a corner, cusp or vertical tangent." },
            { t:"Where `f(x) = f′(x)`", why:"That equation has no special meaning here. Horizontal means slope 0." }],
          hints:["Horizontal means slope 0.", "The slope is `f′(x)`.", "`f′(x) = 0`."] }
      ],
      refreshers:{
        "Power rule":DDX + " `(x^n) = nx^{n-1}`; rewrite roots and reciprocals as powers first (module 09).",
        "Expanding":"Multiply every term of one bracket by every term of the other, then collect like terms.",
        "Tangent lines":"Point `(a, f(a))`, slope `f′(a)`: `y - f(a) = f′(a)(x - a)`. Horizontal tangents are where `f′(x) = 0`."
      }
    }
  },
  explore:{
    heading:"Growing rectangle",
    intro:"A rectangle has width `f(x)` and height `g(x)`. Nudge `x` and watch where the new area comes from. Then shrink the nudge.",
    pairs:[
      { id:"P1", chip:"<strong>P1</strong> `f = x + 1`, `g = x^2`", eq:"`f(x) = x + 1`, `g(x) = x^2`" },
      { id:"P2", chip:"<strong>P2</strong> `f = 2x`, `g = x + 3`", eq:"`f(x) = 2x`, `g(x) = x + 3`" },
      { id:"P3", chip:"<strong>P3</strong> `f = x^2`, `g = √x`", eq:"`f(x) = x^2`, `g(x) = √x`" },
      { id:"P4", chip:"<strong>P4</strong> `f = x`, `g = x` (a square)", eq:"`f(x) = x`, `g(x) = x` (a square)" },
      { id:"B", chip:"<strong>Build</strong> `f = x`, choose `g`", eq:"Build: `f(x) = x`, `g(x)` = ?" },
      { id:"K", chip:"<strong>Tune `k`</strong> `f = x^2`, `g = x - k`", eq:"`f(x) = x^2`, `g(x) = x - k`" }
    ],
    gChips:[{ id:"g1", t:"`x^2 + 2x`" }, { id:"g2", t:"`x^3 + 2x^2`" }, { id:"g3", t:"`3x + 4`" }, { id:"g4", t:"`x^2 + 4x`" }],
    modes:[{ id:"rect", t:"Rectangle" }, { id:"graphs", t:"Graphs" }, { id:"wrong", t:"Wrong rule" }],
    modeHow:{
      rect:"The rectangle `f(x) × g(x)` and the grown rectangle `f(x + Δx) × g(x + Δx)`. The new area splits into a top strip `fΔg`, a side strip `gΔf` and the corner `ΔfΔg`. <strong>Zoom on the corner</strong> keeps it visible as `Δx` shrinks.",
      graphs:"Top: the product `p = fg` with its tangent at `x`. Bottom: a stacked bar at `x` shows `f′g` (blue) plus `fg′` (teal); together they reach `p′`, drawn in long dashes.",
      wrong:"The wrong rule `f′g′` (short dashes) is drawn beside the true `p′`. The readout shows the gap."
    },
    predIntro:"Make a prediction first. Then the growing rectangle shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"P4, `x = 3`, `Δx` stepping from 0.5 down to 0.01. Which piece of the new area shrinks fastest as `Δx` gets small?",
        options:[{ t:"The corner square", ok:true }, { t:"The two strips" }, { t:"All pieces shrink at the same rate" }, { t:"None of them shrink" }],
        explain:"The strips go 1.5 → 0.3 → 0.03, while the corner goes 0.25 → 0.01 → 0.0001; its share drops from 7.7% to 0.17%. Each strip is `3 × Δx`, but the corner is `Δx × Δx`. Divided by `Δx`, the corner still has a `Δx` left over, so it vanishes." },
      { id:"p2", prompt:"P1, `x = 3`, Graphs mode. Is the slope of `y = (x + 1)x^2` at `x = 3` equal to `f′(3) · g′(3) = 1 × 6 = 6`?",
        options:[{ t:"No: it’s 33", ok:true }, { t:"Yes, it’s 6" }, { t:"No: it’s 24" }, { t:"No: it’s 36" }],
        explain:"The tangent’s slope is 33; the bars show 9 (`f′g`) + 24 (`fg′`). `f′g = 1 × 9` and `fg′ = 4 × 6`. 24 is only one term, and 36 is the product’s height." },
      { id:"p3", prompt:"P3, `x = 4`, Graphs mode. Which term is bigger at `x = 4`: `f′g` or `fg′`?",
        options:[{ t:"`f′g` (16 vs 4)", ok:true }, { t:"`fg′`" }, { t:"They’re equal" }, { t:"You can’t compare them" }],
        explain:"The bars show 16 and 4, totalling 20. `f′g = 2(4) × √4 = 16`; `fg′ = 16 × 1/(2√4) = 4`. Check: `x^2 · √x = x^{5/2}`, whose slope at 4 is `(5/2)(8) = 20`." },
      { id:"p4", prompt:"P2, Wrong rule mode. For `f = 2x` and `g = x + 3`, the wrong rule `f′g′` gives a constant, 2. What does the true derivative look like?",
        options:[{ t:"A line, `4x + 6`", ok:true }, { t:"The constant 2" }, { t:"A parabola" }, { t:"The constant 6" }],
        explain:"`p = 2x^2 + 6x` and `p′ = 4x + 6`, rising, while `f′g′` stays flat at 2. The product is a parabola, so its derivative must be a line, not a constant." }
    ],
    chalIntro:"Use the growing rectangle to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Pair P1: set `x` so that the product’s slope is 16.",
        why:"At `x = 2`: `f′g + fg′ = 4 + 12 = 16`.",
        hints:["`p′ = f′g + fg′ = x^2 + (x + 1)(2x)`.", "That’s `3x^2 + 2x`. Set it equal to 16.", "`(3x + 8)(x - 2) = 0`, and `x > 0`, so `x = 2`."],
        msgs:{ pair:"Choose P1 first: `f = x + 1`, `g = x^2`.", area:"That’s where the <strong>area</strong> is 16, not where its rate is 16.", x3:"Slope 33.",
          other:"The product’s slope here is {m}. Watch the `f′g + fg′` row." } },
      { id:"tc2", goal:[1, 3], prompt:"Build mode: `f(x) = x`. Choose `g` from the chips so that `(fg)′ = 3x^2 + 4x`.",
        why:"`(x^2 + 2x) + x(2x + 2) = 3x^2 + 4x`.",
        hints:["`(x · g)′ = 1 · g + x · g′`.", "Try each chip: the result must be `3x^2 + 4x`.", "`g = x^2 + 2x`: `(x^2 + 2x) + x(2x + 2) = 3x^2 + 4x`."],
        msgs:{ pair:"Choose <strong>Build</strong> first, then pick `g` from the chips.", nog:"Pick `g` from the chips.",
          g2:"That’s what you’d get if `(fg)′` were `f′g′ = g′`. Check: `x(x^3 + 2x^2)` has derivative `4x^3 + 6x^2`.",
          g3:"`(x(3x + 4))′ = 6x + 4`.", g4:"`(x^3 + 4x^2)′ = 3x^2 + 8x`." } },
      { id:"tc3", goal:4, stretch:true, prompt:"`f(x) = x^2`, `g(x) = x - k`, with a `k` slider from 0 to 6 in steps of 0.5. Set `k` so that the product has a horizontal tangent at `x = 2`.",
        why:"`p′(2) = 4(2 - 3) + 4 = 0`: the tangent at `x = 2` is horizontal.",
        hints:["Keep `k` as a letter and apply the product rule.", "`p′ = 2x(x - k) + x^2`, so at `x = 2`: `4(2 - k) + 4`.", "`12 - 4k = 0`, so `k = 3`."],
        msgs:{ pair:"Choose the pair <strong>Tune `k`</strong> first: `f = x^2`, `g = x - k`.",
          k2:"Now `x = 2` is a zero of the product, where `y = x^2(x - 2)` crosses the axis with slope 4, not 0.",
          k0:"`y = x^3` has slope 12 at `x = 2`.", other:"The slope at `x = 2` is `12 - 4k`. Here that’s {v}." } }
    ]
  },
  part3:{
    slug:"compare", name:"Expand or rule?",
    heading:"Expand or use the rule?",
    intro:"Two routes lead to the same derivative: expand first, or use the product rule. Race them, compare them on a radical, then use the rule alone to hunt for a pattern.",
    stations:[
      { id:"s1", title:"Station 1: Race",
        text:"Differentiate `(3x - 2)(x^2 + 4)` both ways. Fill in each column’s boxes, then press its <strong>Check</strong>.",
        left:{ title:"Expand first", lines:["`(3x - 2)(x^2 + 4) = 3x^3 - 2x^2 + 12x - 8`"], ask:"Differentiate term by term:" },
        right:{ title:"Product rule", lines:["`f′g + fg′ = 3(x^2 + 4) + (3x - 2)(2x)`"], ask:"Simplify:" },
        frame:"[]x^2 + []x + []", answer:[9, -4, 12], display:"`9x^2 - 4x + 12`",
        wrongL:[{ v:[9, -2, 12], fb:"`-2x^2` has derivative `-4x`." }, { v:[3, -2, 12], fb:"Bring each exponent down as a factor: `3x^3` gives `9x^2`." }],
        generalL:"Differentiate each term of `3x^3 - 2x^2 + 12x - 8`; the constant −8 gives 0.",
        wrongR:[{ v:[3, 0, 12], fb:"That’s only `f′g = 3(x^2 + 4)`. " + M2 }, { v:[6, -4, 0], fb:"That’s only `fg′ = (3x - 2)(2x)`. " + M2 }, { v:[0, 6, 0], fb:"That’s `f′g′ = 3 · 2x`. " + M1 }],
        generalR:"Expand both products, then collect like terms.",
        banner:"Same derivative, two routes.",
        alg:"Collect the right column’s terms: `3x^2 + 12 + 6x^2 - 4x = 9x^2 - 4x + 12`." },
      { id:"s2", title:"Station 2: Radical",
        text:"Differentiate `√x(x + 1)` both ways, then press <strong>Same?</strong> to compare the two answers at a value of `x`.",
        left:{ title:"Expand first", lines:["Rewrite as powers: `x^{3/2} + x^{1/2}`", "Differentiate: `(3/2)x^{1/2} + (1/2)x^{-1/2}`"] },
        right:{ title:"Product rule", lines:["`f = √x`, `g = x + 1`, `f′ = {1}/{2√x}`, `g′ = 1`", "`f′g + fg′ = {x + 1}/{2√x} + √x`"] },
        xs:[1, 4, 9], same:"Same?",
        note:"Both work; the rule avoids rewriting first." },
      { id:"s3", title:"Station 3: Pattern hunt",
        text:"Use the product rule only. Write each power as a product, differentiate, and fill in the boxes. Then predict the next one.",
        rows:[
          { id:"sq", expr:"`(3x - 1)^2 = (3x - 1)(3x - 1)`", answer:[6, 1],
            wrong:[{ v:[2, 1], fb:M6 + " Here `f′ = 3`." }, { v:[3, 1], fb:"That’s one term. " + M2 }],
            general:"Write both terms, `3(3x - 1) + (3x - 1)(3)`, then collect them." },
          { id:"cu", expr:"`(3x - 1)^3 = (3x - 1)^2(3x - 1)`", answer:[9, 2],
            wrong:[{ v:[3, 2], fb:"That’s only `fg′ = (3x - 1)^2 · 3`. Add `f′g = 6(3x - 1)(3x - 1)`." }, { v:[6, 2], fb:"That’s only `f′g`. Add `fg′ = (3x - 1)^2 · 3`." }],
            general:"Use `f = (3x - 1)^2` with `f′ = 6(3x - 1)` from the first row, and `g = 3x - 1` with `g′ = 3`." }
        ],
        predict:"Predict: " + DDX + " `(3x - 1)^4` = ?",
        options:[
          { t:"`12(3x - 1)^3`", ok:true },
          { t:"`4(3x - 1)^3`", why:"The power alone isn’t the whole pattern: 6 = 2 × 3 and 9 = 3 × 3." },
          { t:"`3(3x - 1)^3`", why:"Multiply by the power as well: 6 = 2 × 3 and 9 = 3 × 3." },
          { t:"`12(3x)^3`", why:"The bracket stays `3x - 1`." }],
        message:"Power times the bracket to one less power, times 3, the derivative of the inside. Module 12 calls this the chain rule." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Expand or rule? quick check",
      items:[
        { id:"q1", goal:[1, 2], prompt:DDX + " `[(x + 4)(x - 4)]` = ?",
          choices:[
            { t:"`2x`", ok:true, fb:"Right. Expand: `x^2 - 16`. Or: `(x - 4) + (x + 4) = 2x`." },
            { t:"1", fb:"Expand: `x^2 - 16`. Or: `(x - 4) + (x + 4) = 2x`." },
            { t:"`x - 4`", fb:"Expand: `x^2 - 16`. Or: `(x - 4) + (x + 4) = 2x`." },
            { t:"0", fb:"Expand: `x^2 - 16`. Or: `(x - 4) + (x + 4) = 2x`." }] },
        { id:"q2", goal:5, prompt:"From the pattern, " + DDX + " `(3x - 1)^4` = ?",
          choices:[
            { t:"`12(3x - 1)^3`", ok:true, fb:"Right. 4 from the power, 3 from the inside: 12." },
            { t:"`4(3x - 1)^3`", fb:"4 from the power, 3 from the inside: 12." },
            { t:"`3(3x - 1)^3`", fb:"4 from the power, 3 from the inside: 12." },
            { t:"`12(3x)^3`", fb:"4 from the power, 3 from the inside: 12." }] },
        { id:"q3", goal:[2, 3], prompt:"One student uses the product rule on `x^3 · √x`; another rewrites it as `x^{7/2}`. Do they agree?",
          choices:[
            { t:"Yes: both give `(7/2)x^{5/2}`", ok:true, fb:"Right. `3x^2√x + {x^3}/{2√x} = 3x^{5/2} + (1/2)x^{5/2}`." },
            { t:"No: the rule gives `3x^2 · 1/(2√x)`", fb:"`3x^2√x + {x^3}/{2√x} = 3x^{5/2} + (1/2)x^{5/2}`." },
            { t:"No: rewriting isn’t allowed", fb:"`3x^2√x + {x^3}/{2√x} = 3x^{5/2} + (1/2)x^{5/2}`." },
            { t:"Only at `x = 1`", fb:"`3x^2√x + {x^3}/{2√x} = 3x^{5/2} + (1/2)x^{5/2}`." }] },
        { id:"q4", goal:5, prompt:"`f(1) = 2`, `f′(1) = 1`, `g(1) = 3`, `g′(1) = -1`. `(fg)′(1)` = ?",
          choices:[
            { t:"1", ok:true, fb:"Right. `1 × 3 + 2 × (-1) = 1`." },
            { t:"−1", fb:"`1 × 3 + 2 × (-1) = 1`." },
            { t:"3", fb:"`1 × 3 + 2 × (-1) = 1`." },
            { t:"6", fb:"`1 × 3 + 2 × (-1) = 1`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pieces", type:"custom", title:"Product rule pieces", summary:"Product rule pieces", goal:[2, 3, 5],
        instruction:"Differentiate each product. Fill in the coefficients, or one number when the question asks for a value at a point.",
        how:"Type a number in each box (fractions such as 3/2 are fine), then press Check. A blank coefficient box counts as 0.",
        items:[
          { id:"i1", goal:3, prompt:DDX + " `[x^3(2x + 5)]`", frame:"[]x^3 + []x^2", blankZero:true, answer:[8, 15], display:"`8x^3 + 15x^2`",
            wrong:[{ v:[0, 6], fb:M1 + " Here `f′g′ = 3x^2 × 2`." }],
            hints:["`f = x^3`, `g = 2x + 5`.", "`f′g + fg′ = 3x^2(2x + 5) + x^3(2)`.", "`6x^3 + 15x^2 + 2x^3 = 8x^3 + 15x^2`."] },
          { id:"i2", goal:2, prompt:DDX + " `[(x^2 - 1)(x^2 + 1)]`", frame:"[]x^3 + []x^2 + []x + []", blankZero:true, answer:[4, 0, 0, 0], display:"`4x^3`",
            wrong:[{ v:[0, 4, 0, 0], fb:M1 }],
            hints:["`f = x^2 - 1` and `g = x^2 + 1` both have derivative `2x`.", "`2x(x^2 + 1) + (x^2 - 1)(2x)`.", "`2x^3 + 2x + 2x^3 - 2x = 4x^3`. Check: the product is `x^4 - 1`."] },
          { id:"i3", goal:3, prompt:DDX + " `[(4x - 3)(x + 2)]` at `x = 1`", frame:"[]", answer:[13], display:"13",
            wrong:[{ v:[4], fb:M1 }, { v:[3], fb:"That’s `f(1)g(1)`. " + M5 }],
            hints:["Find `f(1)`, `f′(1)`, `g(1)` and `g′(1)`.", "`f(1) = 1`, `f′(1) = 4`, `g(1) = 3`, `g′(1) = 1`.", "`4(3) + 1(1) = 13`."] },
          { id:"i4", goal:3, prompt:DDX + " `[√x(x - 4)]`", frame:{ num:"[]x + []", den:"[]√x" }, scale:true, answer:[3, -4, 2], display:"`{3x - 4}/{2√x}`",
            general:"`{x - 4}/{2√x} + √x`, over a common denominator `2√x`.",
            hints:["`f = √x`, `g = x - 4`.", "`({1}/{2√x})(x - 4) + √x`.", "Over `2√x`: `{x - 4 + 2x}/{2√x}`."] },
          { id:"i5", goal:3, prompt:DDX + " `[(x^2 + 3x)(2 - x)]` at `x = -1`", frame:"[]", answer:[5], display:"5",
            wrong:[{ v:[-1], fb:M1 }, { v:[3], fb:"Only `f′g`. " + M2 }],
            hints:["`f = x^2 + 3x`, `g = 2 - x`.", "At `x = -1`: `f = -2`, `f′ = 1`, `g = 3`, `g′ = -1`.", "`1(3) + (-2)(-1) = 5`."] },
          { id:"i6", goal:3, prompt:DDX + " `[x^{-1}(x^2 + 5)]` at `x = 1`", frame:"[]", answer:[-4], display:"−4",
            wrong:[{ v:[-2], fb:M1 }, { v:[-6], fb:"Only `f′g`. " + M2 }],
            hints:["`f = x^{-1}`, so `f′ = -x^{-2}`.", "At `x = 1`: `f = 1`, `f′ = -1`, `g = 6`, `g′ = 2`.", "`(-1)(6) + 1(2) = -4`."] },
          { id:"i7", goal:5, prompt:DDX + " `[(2x + 1)^2]`, written as `(2x + 1)(2x + 1)`", frame:"[]x + []", blankZero:true, answer:[8, 4], display:"`8x + 4`",
            wrong:[{ v:[4, 2], fb:M6 + " Two terms, each `2(2x + 1)`." }],
            hints:["`f = g = 2x + 1`, so `f′ = g′ = 2`.", "`2(2x + 1) + (2x + 1)(2)`.", "`4(2x + 1) = 8x + 4`."] },
          { id:"i8", goal:5, prompt:DDX + " `[x(x + 1)(x - 2)]` at `x = 2`", frame:"[]", answer:[6], display:"6",
            wrong:[{ v:[0], fb:"Three terms: `f′gh + fg′h + fgh′ = 0 + 0 + 6`." }],
            hints:["Three factors give three terms, each with one derivative.", "At `x = 2` the factor `x - 2` is 0, so two terms vanish.", "`fgh′ = 2 × 3 × 1 = 6`."] }
        ] },
      { id:"problems", type:"custom", title:"Product rule problems", summary:"Product rule problems", star:true, goal:[4, 5],
        instruction:"Tangent lines, horizontal tangents and given values. Items 3 to 7 are non-routine (★); items 5 to 7 go beyond the Final Check.",
        how:"Type a number in each box (fractions such as 3/2 are fine), then press Check. For points and lists of `x`-values, any order is fine.",
        items:[
          { id:"s1", goal:4, prompt:"Tangent to `y = (x^2 - 3)(x + 1)` at `x = 1`, as `y = mx + b`", frame:"y = []x + []", answer:[2, -6], display:"`y = 2x - 6`",
            wrong:[{ v:[2, -4], fb:"−4 is the `y`-value at `x = 1`; use point–slope form." }],
            hints:["Find `y(1)` and `y′(1)`.", "`y(1) = -4`; `y′ = 2x(x + 1) + (x^2 - 3)`, so `y′(1) = 2`.", "`y + 4 = 2(x - 1)`, so `y = 2x - 6`."] },
          { id:"s2", goal:4, prompt:"Points with horizontal tangents on `y = x^2(x - 3)`", frame:"([], []) and ([], [])", pairs:true, answer:[[0, 0], [2, -4]], display:"(0, 0) and (2, −4)",
            wrong:[{ v:[[0, 0], [3, 0]], fb:"Those are the zeros of `y`, not of `y′`." }],
            hints:["Set `y′ = 0`.", "`y′ = 2x(x - 3) + x^2 = 3x(x - 2)`.", "`x = 0` or `x = 2`: (0, 0) and (2, −4)."] },
          { id:"s3", goal:5, star:true, prompt:"`f(2) = 3`, `f′(2) = -1`, `g(2) = 4`, `g′(2) = 5`. `(fg)′(2)` = ?", frame:"[]", answer:[11], display:"11",
            wrong:[{ v:[-5], fb:M1 }, { v:[-4], fb:M2 }],
            hints:["`(fg)′(2) = f′(2)g(2) + f(2)g′(2)`.", "`(-1)(4) + 3(5)`.", "`-4 + 15 = 11`."] },
          { id:"s4", goal:5, star:true, prompt:"`h(x) = x · f(x)`, `f(3) = 2`, `f′(3) = -4`. `h′(3)` = ?", frame:"[]", answer:[-10], display:"−10",
            wrong:[{ v:[-4], fb:M1 + " `x′ = 1`, so `h′ = f + xf′`." }],
            hints:["The two factors are `x` and `f(x)`.", "`h′(x) = 1 · f(x) + x · f′(x)`.", "`2 + 3(-4) = -10`."] },
          { id:"s5", goal:5, star:true, prompt:"`p(x) = [f(x)]^2`, `f(1) = 3`, `f′(1) = -2`. `p′(1)` = ?", frame:"[]", answer:[-12], display:"−12",
            wrong:[{ v:[6], fb:M6 + " `2f` alone forgets `f′`." }],
            hints:["Write `p = f · f`.", "`p′ = f′f + ff′ = 2ff′`.", "`2(3)(-2) = -12`."] },
          { id:"s6", goal:4, star:true, prompt:"All `x` where `y = (x - 1)^2(x + 2)` has a horizontal tangent", frame:"x = [] and x = []", set:true, answer:[1, -1], display:"`x = 1` and `x = -1`",
            general:"Factor `y′ = 2(x - 1)(x + 2) + (x - 1)^2` by taking out `(x - 1)`.",
            hints:["Treat `(x - 1)^2` as one factor: its derivative is `2(x - 1)` (Activity 1, item 7).", "`y′ = (x - 1)[2(x + 2) + (x - 1)] = (x - 1)(3x + 3)`.", "`x = 1` or `x = -1`."] },
          { id:"s7", goal:4, star:true, prompt:"Find `k` so that `y = (x + k)(x^2 + 1)` has slope 0 at `x = -1`", frame:"k = []", answer:[2], display:"`k = 2`",
            wrong:[{ v:[1], fb:"`y′(-1) = 2 + (k - 1)(-2) = 4 - 2k`." }],
            hints:["`y′ = (x^2 + 1) + (x + k)(2x)`.", "At `x = -1`: `2 + (-1 + k)(-2)`.", "`4 - 2k = 0`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Jasmine", how:"", goal:3,
        instruction:"Jasmine made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Differentiate `(x^2 + 1)(3x - 2)`.",
            steps:["Let `f = x^2 + 1` and `g = 3x - 2`.", "`f′ = 2x` and `g′ = 3`.", "`(fg)′ = f′g′ = 6x`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"`(fg)′ = f′g + fg′ = 2x(3x - 2) + 3(x^2 + 1) = 9x^2 - 4x + 3`.", ok:true, why:"Expand to check: `3x^3 - 2x^2 + 3x - 2` has derivative `9x^2 - 4x + 3`." },
              { t:"`(fg)′ = f′g = 2x(3x - 2)`.", why:M2 },
              { t:"`(fg)′ = f′g′ + fg`.", why:M3 },
              { t:"Step 3 is correct.", why:M1 + " Expand to check: `3x^3 - 2x^2 + 3x - 2` has derivative `9x^2 - 4x + 3`." }],
            hints:["Test the rule on `x · x`.", "`f′g′` gives 1, but `(x^2)′ = 2x`.", "Use `f′g + fg′`."] },
          { id:"e2", goal:4, task:"Find the tangent to `y = x^3(x - 2)` at `x = 1`.",
            steps:["`y′ = 3x^2(x - 2) + x^3(1)`.", "At `x = 1`: `3(1)(-1) + 1 = -2`.", "`y(1) = 1 × (-1) = -1`.", "So the slope is −1: `y + 1 = -1(x - 1)`.", "`y = -x`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"The slope is `y′(1) = -2`, not `y(1) = -1`: `y + 1 = -2(x - 1)`, so `y = -2x + 1`.", ok:true, why:"Use slope −2 through (1, −1)." },
              { t:"`y - 1 = -2(x + 1)`.", why:"The point is (1, −1)." },
              { t:"`y = -2x - 1`.", why:"Check: at `x = 1` this gives −3, not −1." },
              { t:"Step 4 is correct.", why:"`y(1)` is the height of the product, not its slope." }],
            hints:["Which line found the slope?", "Step 2: −2.", "Use slope −2 through (1, −1)."] },
          { id:"e3", goal:3, task:"Differentiate `(5 - 2x)^2` with the product rule.",
            steps:["`(5 - 2x)^2 = (5 - 2x)(5 - 2x)`.", "`f = g = 5 - 2x`, so `f′ = g′ = 2`.", "`(fg)′ = 2(5 - 2x) + (5 - 2x)(2) = 20 - 8x`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 applies the rule correctly to step 2’s values."],
            fixes:[
              { t:"`f′ = g′ = -2`, so `(fg)′ = -2(5 - 2x) - 2(5 - 2x) = 8x - 20`.", ok:true, why:"Check by expanding `25 - 20x + 4x^2`: its derivative is `-20 + 8x`." },
              { t:"`f′ = 5 - 2 = 3`.", why:"The derivative of 5 is 0." },
              { t:"`(5 - 2x)^2 = 25 + 4x^2`, so the derivative is `8x`.", why:"The middle term `-20x` is missing." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["What is the slope of `5 - 2x`?", "−2.", "Both terms are `-2(5 - 2x)`: total `8x - 20`. Check by expanding `25 - 20x + 4x^2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the growing rectangle: how quickly the corner disappeared, or how far `f′g′` was from the truth?" },
      { id:"j2", q:"In your own words, why does the product rule have two terms?" },
      { id:"j3", q:"Explain to a friend when you’d expand instead of using the product rule, and when you wouldn’t." },
      { id:"j4", q:"Which part still slips (choosing `f` and `g`, signs, or simplifying)? What will you check next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"The product rule says `(fg)′` = …", options:[
          { t:"`f′g + fg′`", ok:true, why:"Differentiate the first factor and keep the second, then keep the first and differentiate the second." },
          { t:"`f′g′`", why:M1 },
          { t:"`f′g - fg′`", why:QUOT },
          { t:"`f′g′ + fg`", why:M3 }] },
        b:{ prompt:"If `y = u · v`, then " + DY + " = …", options:[
          { t:LZ_OK, ok:true, why:"This is the product rule in Leibniz form: `u′v + uv′`." },
          { t:LZ_M1, why:M1 },
          { t:LZ_Q, why:QUOT },
          { t:"`u + v`", why:"That’s not a derivative at all." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:DDX + " `[x^2(x + 5)]` = ?", options:[
          { t:"`3x^2 + 10x`", ok:true, why:"`2x(x + 5) + x^2`." },
          { t:"`2x`", why:M1 },
          { t:"`2x^2 + 10x`", why:"That’s only `f′g`. " + M2 },
          { t:"`3x^2 + 5`", why:"Expanding gives `x^3 + 5x^2`, not `x^3 + 5x`." }] },
        b:{ prompt:DDX + " `[x^3(x - 2)]` = ?", options:[
          { t:"`4x^3 - 6x^2`", ok:true, why:"`3x^2(x - 2) + x^3`." },
          { t:"`3x^2`", why:M1 },
          { t:"`3x^3 - 6x^2`", why:"That’s only `f′g`. " + M2 },
          { t:"`4x^3 - 2`", why:"Expanding gives `x^4 - 2x^3`, so the second term is `-6x^2`." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"One student differentiates `(2x + 1)(x - 3)` by expanding; another uses the product rule. What should both get?", options:[
          { t:"`4x - 5`", ok:true, why:"Expanded: `2x^2 - 5x - 3`." },
          { t:"2", why:M1 },
          { t:"`2x - 6`", why:"That’s only `f′g`. " + M2 },
          { t:"Different answers, because the methods are different", why:"Correct methods always agree." }] },
        b:{ prompt:"Differentiate `(3x - 2)(x + 4)` by expanding and by the product rule. What should both give?", options:[
          { t:"`6x + 10`", ok:true, why:"Expanded: `3x^2 + 10x - 8`." },
          { t:"3", why:M1 },
          { t:"`3x + 12`", why:"That’s only `f′g`. " + M2 },
          { t:"Different answers", why:"Correct methods always agree." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"At which `x` does `y = x^2(x - 6)` have horizontal tangents?", options:[
          { t:"`x = 0` and `x = 4`", ok:true, why:"`y′ = 2x(x - 6) + x^2 = 3x(x - 4)`." },
          { t:"`x = 0` and `x = 6`", why:"Those are where `y = 0`." },
          { t:"`x = 0` only", why:M1 + " Here `f′g′ = 2x`." },
          { t:"`x = 0` and `x = 2`", why:"`3x^2 - 12x = 3x(x - 4)`." }] },
        b:{ prompt:"At which `x` does `y = x^2(x + 3)` have horizontal tangents?", options:[
          { t:"`x = 0` and `x = -2`", ok:true, why:"`y′ = 2x(x + 3) + x^2 = 3x(x + 2)`." },
          { t:"`x = 0` and `x = -3`", why:"Those are where `y = 0`." },
          { t:"`x = 0` only", why:M1 + " Here `f′g′ = 2x`." },
          { t:"`x = 0` and `x = -1`", why:"`3x^2 + 6x = 3x(x + 2)`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`f(1) = 2`, `f′(1) = 3`, `g(1) = -1`, `g′(1) = 4`. Find `(fg)′(1)`.", options:[
          { t:"5", ok:true, why:"`3(-1) + 2(4)`." },
          { t:"12", why:M1 },
          { t:"−3", why:M2 },
          { t:"−2", why:"That’s `f(1)g(1)`. " + M5 }] },
        b:{ prompt:"`f(2) = -3`, `f′(2) = 2`, `g(2) = 5`, `g′(2) = -1`. Find `(fg)′(2)`.", options:[
          { t:"13", ok:true, why:"`2(5) + (-3)(-1)`." },
          { t:"−2", why:M1 },
          { t:"10", why:M2 },
          { t:"−15", why:"That’s `f(2)g(2)`. " + M5 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`p(x) = [f(x)]^2`, with `f(3) = -2` and `f′(3) = 5`. Find `p′(3)`.", options:[
          { t:"−20", ok:true, why:"`p = f · f`, so `p′ = 2ff′ = 2(-2)(5)`." },
          { t:"−4", why:M6 + " `2f` alone forgets `f′`." },
          { t:"10", why:"That’s `2f′`; you need `f` too." },
          { t:"25", why:"That’s `[f′]^2`." }] },
        b:{ prompt:"`p(x) = [f(x)]^2`, with `f(0) = 4` and `f′(0) = -3`. Find `p′(0)`.", options:[
          { t:"−24", ok:true, why:"`p′ = 2ff′ = 2(4)(-3)`." },
          { t:"8", why:M6 + " `2f` alone forgets `f′`." },
          { t:"−6", why:"That’s `2f′`; you need `f` too." },
          { t:"9", why:"That’s `[f′]^2`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"In the growing rectangle with sides `f(x)` and `g(x)`, why doesn’t the corner piece `ΔfΔg` appear in the derivative?", options:[
          { t:"“Divided by `Δx` it becomes `Δf · (Δg/Δx)`. `Δg/Δx` approaches `g′`, but `Δf` approaches 0, so the corner’s contribution goes to 0.”", ok:true, why:"The corner’s share of the new area shrinks to nothing; only the two strips survive the limit." },
          { t:"“Because it’s always smaller than 1.”", why:"Small isn’t the reason; it shrinks faster than `Δx`." },
          { t:"“Because it’s already counted in the strips.”", why:"The strips don’t include it." },
          { t:"“Because the rectangle has no corner.”", why:"It does, until the limit." }] },
        b:{ prompt:"Which is the best explanation of why `(fg)′` is not `f′g′`?", options:[
          { t:"“When both sides of a rectangle grow, the area gains a strip along each side, `fΔg` and `gΔf`. `f′g′` only multiplies how fast the sides grow; it ignores how long they are.”", ok:true, why:"Each strip’s area uses one side’s length and the other side’s growth." },
          { t:"“Because derivatives can never be multiplied.”", why:"They can; it just isn’t the derivative of the product." },
          { t:"“It is; the two are equal for polynomials.”", why:"Try `x · x`." },
          { t:"“Because `(fg)′` must include the product `f · g` itself.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which line correctly starts differentiating `y = √x(x^2 - 1)`?", options:[
          { t:"`y′ = ({1}/{2√x})(x^2 - 1) + √x(2x)`", ok:true, why:"`f′g + fg′` with `f = √x` and `g = x^2 - 1`." },
          { t:"`y′ = ({1}/{2√x})(2x)`", why:M1 },
          { t:"`y′ = ({1}/{2√x})(x^2 - 1)`", why:M2 },
          { t:"`y′ = √x(2x) - ({1}/{2√x})(x^2 - 1)`", why:"The product rule adds; the minus is from the quotient rule." }] },
        b:{ prompt:"Which line correctly starts differentiating `y = x^{-1}(x^3 + 2)`?", options:[
          { t:"`y′ = -x^{-2}(x^3 + 2) + x^{-1}(3x^2)`", ok:true, why:"`f′g + fg′` with `f = x^{-1}`, so `f′ = -x^{-2}`." },
          { t:"`y′ = -x^{-2}(3x^2)`", why:M1 },
          { t:"`y′ = -x^{-2}(x^3 + 2)`", why:M2 },
          { t:"`y′ = -x^{-1}(x^3 + 2) + x^{-1}(3x^2)`", why:DDX + " `(x^{-1}) = -x^{-2}`, not `-x^{-1}`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A theatre’s revenue is `R = p · q`. The ticket price is $40 and rising at $2 per month; 500 tickets are sold per month, and that number is falling by 10 per month. How fast is revenue changing?", options:[
          { t:"Rising at $600 per month", ok:true, why:"`R′ = p′q + pq′ = 2(500) + 40(-10)`." },
          { t:"Falling at $20 per month", why:"That’s `p′q′ = 2 × (-10)`. " + M7 },
          { t:"Rising at $1000 per month", why:"That’s only the price effect, `p′q`. " + M7 },
          { t:"$20 000 per month", why:"That’s the revenue itself." }] },
        b:{ prompt:"The price of a class is $15 and rising at $1 per month; 800 people sign up per month, and that number is falling by 40 per month. How fast is revenue changing?", options:[
          { t:"Rising at $200 per month", ok:true, why:"`1(800) + 15(-40)`." },
          { t:"Falling at $40 per month", why:"That’s `p′q′ = 1 × (-40)`. " + M7 },
          { t:"Rising at $800 per month", why:"That’s only the price effect, `p′q`. " + M7 },
          { t:"$12 000 per month", why:"That’s the revenue itself." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A rectangle has length `L(t) = 2t + 3` cm and width `W(t) = t^2` cm at time `t` s. How fast is its area growing at `t` = 1 s?", options:[
          { t:"12 cm²/s", ok:true, why:"`A′ = L′W + LW′ = 2(1) + 5(2)`." },
          { t:"4 cm²/s", why:"`L′W′ = 2 × 2`. " + M1 },
          { t:"10 cm²/s", why:"Only `LW′`. " + M2 },
          { t:"5 cm²/s", why:"That’s the area at `t = 1`, not its rate." }] },
        b:{ prompt:"A rectangle has length `L(t) = 3t + 1` cm and width `W(t) = t^2` cm. How fast is its area growing at `t` = 1 s?", options:[
          { t:"11 cm²/s", ok:true, why:"`3(1) + 4(2)`." },
          { t:"6 cm²/s", why:"`L′W′ = 3 × 2`. " + M1 },
          { t:"8 cm²/s", why:"Only `LW′`. " + M2 },
          { t:"4 cm²/s", why:"That’s the area at `t = 1`, not its rate." }] } }
    ]
  },
  task:{
    title:"Flat at `x = 1`", summary:"Flat at x = 1",
    statement:"<p>Design `y = (x + p)(x^2 + q)` that meets every condition. Find all the answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The graph has a horizontal tangent at `x = 1`.</li><li>The graph has exactly three different `x`-intercepts.</li><li>The `y`-intercept is negative.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −12 to 12 for `p` and `q`. The graph shows the tangent at `x = 1`; the readout gives `y′ = (x^2 + q) + 2x(x + p)` and the `x`-intercepts.</p>",
    checks:["Horizontal tangent at `x = 1`", "Exactly three different `x`-intercepts", "Negative `y`-intercept"],
    tips:["Use the product rule: `y′(1) = (1 + q) + 2(1 + p)`.",
      "`x^2 + q` gives two intercepts only if `q < 0`; make sure `-p` isn’t one of them.",
      "The `y`-intercept is `p × q`."],
    explainPrompt:"Explain how the product rule gave the condition `3 + 2p + q = 0`, and why (3, −9) doesn’t work.",
    vocab:"Use the words product rule, horizontal tangent, factor and intercept.",
    after3:"Line 1 gives `q = -3 - 2p`. Lines 2 and 3 need `q < 0 < p`. (3, −9) fails line 2 because −3 is a root of both factors."
  },
  cards:[
    ["Product rule", "`(fg)′ = f′g + fg′`."],
    ["Leibniz form", DDX + " `(uv) = u′v + uv′`."],
    ["Not `f′g′`", "Test: `x · x = x^2`. `f′g′ = 1`, but `(x^2)′ = 2x`."],
    ["Growing rectangle", "New area = `fΔg + gΔf + ΔfΔg`; the corner vanishes in the limit."],
    ["Three factors", "`(fgh)′ = f′gh + fg′h + fgh′`."],
    ["`[f(x)]^2`", "`2f(x)f′(x)`."],
    ["Expand or rule?", "Same answer. Expand small polynomials; use the rule for radicals and many factors."],
    ["At a point", "`(fg)′(a) = f′(a)g(a) + f(a)g′(a)`."],
    ["Revenue", "`R = pq`, so `R′ = p′q + pq′`."],
    ["Horizontal tangents of a product", "Set `(fg)′ = 0`; factor out common brackets."],
    ["Pattern `(3x - 1)^n`", "Derivative `n(3x - 1)^{n-1} × 3` (the chain rule, module 12)."]
  ]
};
