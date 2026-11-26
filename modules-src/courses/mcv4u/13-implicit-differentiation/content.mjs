// MCV4U 13 Implicit Differentiation. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/13-implicit-differentiation.md
// In math (`backticks`), app.js typesets the d of dy/dx, du/dx and d/dx upright.
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "`y` depends on `x`, so `y^2` is a composite. The chain rule adds the factor `dy/dx`.";
const M2 = "`y` changes as `x` changes. Only true constants differentiate to 0.";
const M3 = "`xy` is a product of two functions of `x`: `(1)(y) + x(dy/dx)`.";
const M4 = "Differentiate first, then substitute. Plugging in `x = 3` first freezes `x`, and the slope information is lost.";
const M5 = "`dy/dx = -x/y` uses the point’s `y`. At (3, −4) the slope is +3/4.";
const M6 = "Numerator 0: slope 0, horizontal. Denominator 0: slope undefined, vertical.";
const M7 = "Combine the condition with the curve’s equation to find actual points.";
const HL = s => '<span class="id-hl">' + s + "</span>";

export default {
  id:"13-implicit-differentiation",
  kind:"topic",
  title:"Implicit differentiation",
  topic:"Implicit Differentiation",
  readyTopic:"implicit differentiation",
  hero:{
    eq:'<span class="id-heq"><span class="id-nw">`x^2 + y^2 = 25`</span> <span class="id-arr">⟶</span> <span class="id-nw">`2x + 2y ·` ' + HL("`dy/dx`") + ' `= 0`</span> <span class="id-arr">⟶</span> <span class="id-nw">' + HL("`dy/dx`") + " `= -x/y`</span></span>",
    eqLabel:"x squared plus y squared equals 25, so 2x plus 2y times dy/dx equals 0, so dy/dx equals negative x over y",
    eqSize:"sm",
    headline:"One formula for both halves of a circle",
    text:"A circle isn’t the graph of a function, but every point on it still has a tangent. <strong>Implicit differentiation</strong> finds its slope: differentiate both sides with respect to `x`, remembering that `y` is a function of `x`, so each `y`-term gets a <strong>`dy/dx`</strong> from the chain rule. The answer depends on the <strong>point</strong>, both `x` and `y`.",
    fig:{ aria:"The circle x² + y² = 25 with a point travelling around it, its tangent line and its radius at right angles; the slope label changes from −3/4 at (3, 4) to vertical at (5, 0) to 3/4 at (3, −4).", shape:"square" }
  },
  goals:[
    "I can explain why `d/dx (y^2) = 2y · dy/dx`.",
    "I can differentiate an equation implicitly and solve for `dy/dx`.",
    "I can find the slope and the equation of the tangent at a given point on a curve.",
    "I can find the points on a curve with horizontal or vertical tangents.",
    "I can differentiate terms like `xy` and `x^2y` using the product rule.",
    "I can use implicit differentiation to justify the power rule for rational exponents."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Chain rule", goal:1, prompt:"Differentiate `(3x^2 + 1)^4`.",
          options:[
            { t:"`24x(3x^2 + 1)^3`", ok:true, why:"`4(3x^2 + 1)^3 · 6x`." },
            { t:"`4(3x^2 + 1)^3`", why:"Multiply by `6x`." },
            { t:"`4(6x)^3`", why:"Keep the inside as it is." },
            { t:"`24x(3x^2 + 1)^4`", why:"`4 - 1 = 3`." }],
          hints:["Outer `u^4`, inner `3x^2 + 1`.", "`4u^3 · 6x`.", "`24x(3x^2 + 1)^3`."] },
        { id:"w2", skill:"Chain rule", goal:1, prompt:"`u` is a function of `x`. What is `d/dx (u^3)`?",
          options:[
            { t:"`3u^2 · du/dx`", ok:true, why:"Outer cube, inner `u`: multiply by `du/dx`." },
            { t:"`3u^2`", why:"That would be the derivative with respect to `u`." },
            { t:"`3u^2 · x`", why:"The inner derivative is `du/dx`, not `x`." },
            { t:"`3(du/dx)^2`", why:"Differentiate the outside first, keeping `u`." }],
          hints:["This is the chain rule with an unknown inside.", "Outer: `3u^2`.", "`3u^2 · du/dx`."] },
        { id:"w3", skill:"Product rule", goal:5, prompt:"`u` is a function of `x`. What is `d/dx (x · u)`?",
          options:[
            { t:"`u + x · du/dx`", ok:true, why:"`(1)(u) + (x)(du/dx)`." },
            { t:"`du/dx`", why:"`x` changes too: its derivative 1 multiplies `u`." },
            { t:"`x · du/dx`", why:"Add the term `(1)(u)`." },
            { t:"`u · du/dx`", why:"Product rule: first′ × second + first × second′." }],
          hints:["Product of `x` and `u`.", "`(x)′ = 1`.", "`u + x du/dx`."] },
        { id:"w4", skill:"Product rule", goal:5, prompt:"Differentiate `x^3(2x - 1)`.",
          options:[
            { t:"`8x^3 - 3x^2`", ok:true, why:"`3x^2(2x - 1) + 2x^3`." },
            { t:"`6x^2`", why:"`(fg)′ ≠ f′g′`." },
            { t:"`6x^3 - 3x^2`", why:"Add `fg′ = 2x^3`." },
            { t:"`2x^3`", why:"Add `f′g`." }],
          hints:["`f′g + fg′`.", "`3x^2(2x - 1) + x^3(2)`.", "`8x^3 - 3x^2`."] },
        { id:"w5", skill:"Circles", goal:3, prompt:"Which points on `x^2 + y^2 = 25` have `x = 3`?",
          options:[
            { t:"(3, 4) and (3, −4)", ok:true, why:"`y^2 = 16`, so `y = ±4`." },
            { t:"(3, 4) only", why:"`y = -4` also works." },
            { t:"(3, 16)", why:"`y^2 = 16`, so `y = ±4`." },
            { t:"`(3, ±√22)`", why:"`3^2 = 9`." }],
          hints:["Substitute `x = 3`.", "`y^2 = 16`.", "`(3, ±4)`."] },
        { id:"w6", skill:"Perpendicular slopes", goal:3, prompt:"The radius from (0, 0) to (3, 4) has slope 4/3. What is the slope of the tangent at (3, 4)?",
          options:[
            { t:"−3/4", ok:true, why:"A tangent is perpendicular to the radius: negative reciprocal." },
            { t:"4/3", why:"The tangent is perpendicular to the radius." },
            { t:"3/4", why:"Perpendicular slopes multiply to −1." },
            { t:"−4/3", why:"Flip and change the sign." }],
          hints:["Tangent ⟂ radius.", "Negative reciprocal of 4/3.", "−3/4."] }
      ],
      refreshers:{
        "Chain rule":"`d/dx [g(x)]^n = n[g(x)]^{n-1} · g′(x)`. With an unknown inside `u`, that’s `nu^{n-1} · du/dx`.",
        "Product rule":"`(fg)′ = f′g + fg′`. For `x · u`: `u + x · du/dx`.",
        "Circles":"`x^2 + y^2 = r^2` is centred at the origin. Each `x` between `-r` and `r` gives two points, `±y`. A tangent is perpendicular to the radius.",
        "Perpendicular slopes":"A tangent is perpendicular to the radius. Perpendicular slopes multiply to −1: flip and change the sign."
      }
    }
  },
  explore:{
    heading:"Off-function tangents",
    intro:"Drag the point around a curve that isn’t a function. Compare the implicit slope formula with the two explicit halves.",
    curves:[
      { id:"circle", chip:"Circle", how:"`x^2 + y^2 = r^2`; set `r` with its slider." },
      { id:"ellipse", chip:"Ellipse", how:"`4x^2 + 9y^2 = 36`." },
      { id:"shift", chip:"Shifted circle", how:"`(x - h)^2 + y^2 = 25`, for the stretch challenge; set `h` with its slider." }
    ],
    modes:[{ id:"imp", t:"Implicit" }, { id:"two", t:"Two halves" }],
    modeHow:{
      imp:"One curve, the tangent at P and the implicit formula.",
      two:"The top half (solid) and the bottom half (long dashes), each with its explicit derivative. P’s half is highlighted: both explicit formulas agree with the implicit one."
    },
    posHow:"Drag P, or use the slider (arrow keys move it 1°; Shift moves it 15°). P snaps to points with exact coordinates.",
    rows:{ curve:"Curve", d:"Implicit derivative", p:"P", slope:"Slope at P", explicit:"Explicit check", tan:"Tangent", type:"Tangent type" },
    types:{ sloped:"sloped", horizontal:"horizontal", vertical:"vertical" },
    note:"Differentiate first, then substitute the point.",
    predIntro:"Make a prediction first. Then the tangent explorer shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Circle, P = (3, 4). What’s the slope of the tangent at (3, 4)?",
        options:[{ t:"−3/4", ok:true }, { t:"3/4" }, { t:"−4/3" }, { t:"4/3" }],
        explain:"`2x + 2y dy/dx = 0` gives `-x/y = -3/4`, the negative reciprocal of the radius’s slope 4/3." },
      { id:"p2", prompt:"P = (3, −4). Same `x`, bottom half. What’s the slope?",
        options:[{ t:"3/4", ok:true }, { t:"−3/4" }, { t:"−4/3" }, { t:"0" }],
        explain:"`-x/y = -3/(-4)`. The formula knows which half you’re on because it uses `y`." },
      { id:"p3", prompt:"P = (5, 0). What’s the slope at (5, 0)?",
        options:[{ t:"Undefined: the tangent is vertical", ok:true }, { t:"0: the tangent is horizontal" }, { t:"−5" }, { t:"5" }],
        explain:"`-x/y = -5/0`. A zero denominator means a vertical tangent." },
      { id:"p4", prompt:"Ellipse `4x^2 + 9y^2 = 36`. Where are the horizontal tangents?",
        options:[{ t:"(0, 2) and (0, −2)", ok:true }, { t:"(3, 0) and (−3, 0)" }, { t:"(0, 2) only" }, { t:"wherever `x = y`" }],
        explain:"`8x + 18y dy/dx = 0` gives `-4x/(9y)`, which is 0 when `x = 0`. Then `9y^2 = 36`." }
    ],
    chalIntro:"Use the tangent explorer to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Circle `r = 5`: move P to a point where the tangent’s slope is 4/3.",
        why:"`-x/y = 4/3` means `y = -3x/4`. With `x^2 + y^2 = 25`, `x = ±4`: P = (4, −3) or (−4, 3).",
        hints:["`-x/y = 4/3`.", "So `y = -3x/4`. Substitute into `x^2 + y^2 = 25`.", "`25x^2/16 = 25`: `x = ±4`, giving (4, −3) or (−4, 3)."],
        msgs:{ curve:"Choose the circle and set `r = 5` first.", a:"Slope −4/3 there: check the sign of `y`.", b:"Slope 3/4: you swapped `x` and `y`.",
          other:"The slope at P is {m}. You need 4/3." } },
      { id:"tc2", goal:[3, 4], prompt:"Ellipse: move P to the point in Quadrant I where the tangent’s slope is −2/3.",
        why:"`-4x/(9y) = -2/3` means `y = 2x/3`. Then `8x^2 = 36`: P = `(3√2/2, √2)`.",
        hints:["`-4x/(9y) = -2/3`.", "That gives `y = 2x/3`; substitute into `4x^2 + 9y^2 = 36`.", "`8x^2 = 36`, so `x = 3/√2 = 3√2/2` and `y = √2`."],
        msgs:{ curve:"Choose the ellipse first.", q3:"Same slope, but Quadrant III.", top:"Slope 0 there.",
          other:"The slope at P is {m}. You need −2/3 in Quadrant I." } },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Shifted circle `(x - h)^2 + y^2 = 25`: choose `h` so that the circle passes through (2, 4) <strong>and</strong> its tangent there has a positive slope.",
        why:"`h = 5`: `(2 - 5)^2 + 16 = 25`, and the slope `-(2 - 5)/4 = 3/4` is positive.",
        hints:["On the circle: `(2 - h)^2 + 16 = 25`.", "`h = -1` or 5. Implicitly, `dy/dx = -(x - h)/y`.", "At (2, 4): `-(2 - h)/4` is positive only when `h > 2`: `h = 5`, slope 3/4."],
        msgs:{ curve:"Choose the shifted circle, then set `h` with its slider.", neg:"The circle passes through (2, 4), but the slope there is −3/4.",
          off:"(2, 4) isn’t on this circle: `(2 - h)^2 + 16` must be 25." } }
    ]
  },
  part3:{
    slug:"any-curve", name:"Any curve",
    heading:"Tangents to any curve",
    intro:"Explore used curves where only `y^2` appears. Here you meet `xy` terms, use implicit differentiation to prove the power rule for rational exponents, and find a tangent to a curve you couldn’t easily solve for `y`. Step through each station, then tap a point to see its tangent. Then try the quick check.",
    tapHow:"Tap a point: the formula gives its slope, and the tangent appears on the graph.",
    locked:"Step through to the formula first. Then the tangent appears.",
    stations:[
      { id:"st1", title:"Station 1: `xy` terms", text:"A product such as `xy` needs the product rule inside implicit differentiation.",
        curves:[
          { id:"xy", chip:"`xy = 6`",
            steps:["`xy = 6`. Differentiate both sides with respect to `x`.", "`y + x dy/dx = 0` (product rule on `xy`).", "So `dy/dx = -y/x`."],
            alg:["Explicitly, `y = 6/x`, so `dy/dx = -6/x^2`.", "`-6/x^2 = -(6/x)/x = -y/x`.", "Same."],
            pts:[[1, 6], [2, 3], [3, 2], [6, 1], [-2, -3], [-3, -2]], pt0:1 },
          { id:"tilt", chip:"`x^2 + xy + y^2 = 7`",
            steps:["`x^2 + xy + y^2 = 7` is a tilted ellipse. Differentiate both sides.", "`2x + (y + x dy/dx) + 2y dy/dx = 0`", "So `dy/dx = -(2x + y)/(x + 2y)`.", "At (1, 2) (check: 1 + 2 + 4 = 7), the slope is −4/5."],
            pts:[[1, 2], [2, 1], [-1, 3], [3, -1], [-1, -2], [-2, -1]], pt0:0 }
        ] },
      { id:"st2", title:"Station 2: the power rule for rational exponents", text:"Implicit differentiation proves the power rule for a rational exponent such as `2/3`.",
        curves:[
          { id:"pow", chip:"`y = x^{2/3}`",
            steps:["`y = x^{2/3}` means `y^3 = x^2`.", "Differentiate: `3y^2 dy/dx = 2x`.", "So `dy/dx = {2x}/{3y^2} = {2x}/{3x^{4/3}}`.", "`= {2}/{3}x^{-1/3}`. That’s the power rule."],
            general:"General case: `y^q = x^p` gives `dy/dx = {p}/{q}x^{p/q - 1}`.",
            pts:[[-8, 4], [-1, 1], [1, 1], [8, 4]], pt0:3 }
        ] },
      { id:"st3", title:"Station 3: a cubic curve", text:"The module draws `x^3 + y^3 = 9` for you: solving for `y` isn’t easy. Implicit differentiation doesn’t need to.",
        curves:[
          { id:"cubic", chip:"`x^3 + y^3 = 9`",
            steps:["`x^3 + y^3 = 9`. Differentiate both sides.", "`3x^2 + 3y^2 dy/dx = 0`", "So `dy/dx = -x^2/y^2`.", "At (1, 2) the slope is −1/4."],
            pts:[[1, 2], [2, 1]], pt0:0 }
        ] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Any curve quick check",
      items:[
        { id:"q1", goal:5, prompt:"`d/dx (xy) =` ?",
          choices:[
            { t:"`y + x dy/dx`", ok:true, fb:"Right. Product rule: `(1)(y) + x(dy/dx)`." },
            { t:"`dy/dx`", fb:"Product rule: `(1)(y) + x(dy/dx)`." },
            { t:"`x dy/dx`", fb:"Product rule: `(1)(y) + x(dy/dx)`." },
            { t:"`y dy/dx`", fb:"Product rule: `(1)(y) + x(dy/dx)`." }] },
        { id:"q2", goal:[3, 5], prompt:"Slope of `x^2 + xy + y^2 = 7` at (1, 2)?",
          choices:[
            { t:"−4/5", ok:true, fb:"Right. `-(2x + y)/(x + 2y) = -4/5`." },
            { t:"−2/5", fb:"The `y` from the product rule is missing." },
            { t:"−1", fb:"The `x dy/dx` is missing." },
            { t:"−5/4", fb:"`-(2x + y)/(x + 2y) = -4/5`: −5/4 flips the fraction." }] },
        { id:"q3", goal:6, prompt:"Use `y^4 = x^3` to find the derivative of `y = x^{3/4}`.",
          choices:[
            { t:"`{3}/{4}x^{-1/4}`", ok:true, fb:"Right. `4y^3 dy/dx = 3x^2`, so `dy/dx = 3x^2/(4x^{9/4})`." },
            { t:"`{3}/{4}x^{1/4}`", fb:"`4y^3 dy/dx = 3x^2`, so `dy/dx = 3x^2/(4x^{9/4})`." },
            { t:"`{4}/{3}x^{1/3}`", fb:"`4y^3 dy/dx = 3x^2`, so `dy/dx = 3x^2/(4x^{9/4})`." },
            { t:"`{3x^2}/{4}`", fb:"`y` depends on `x`, so `4y^3` needs its `dy/dx`: `4y^3 dy/dx = 3x^2`, so `dy/dx = 3x^2/(4x^{9/4})`." }] },
        { id:"q4", goal:3, prompt:"Slope of `x^3 + y^3 = 9` at (1, 2)?",
          choices:[
            { t:"−1/4", ok:true, fb:"Right. `-x^2/y^2 = -1/4`." },
            { t:"−1/2", fb:"`-x^2/y^2 = -1/4`." },
            { t:"−4", fb:"`-x^2/y^2 = -1/4`. −4 flips the fraction." },
            { t:"1/4", fb:"`-x^2/y^2 = -1/4`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Equation ↔ `dy/dx`", summary:"Equation ↔ `dy/dx`", goal:[2, 5],
        instruction:"Match each equation to its `dy/dx`. One expression on the right has no partner.",
        how:"Tap an equation, then tap its `dy/dx` on the right.",
        leftTitle:"Equation", rightTitle:"`dy/dx`",
        left:[
          { id:"l1", goal:2, t:"`x^2 + y^2 = 16`", why:"`2x + 2y dy/dx = 0`." },
          { id:"l2", goal:2, t:"`x^2 - y^2 = 9`", why:"`2x - 2y dy/dx = 0`." },
          { id:"l3", goal:5, t:"`xy = 8`", why:"`y + x dy/dx = 0`." },
          { id:"l4", goal:2, t:"`y^2 = 4x`", why:"`2y dy/dx = 4`." },
          { id:"l5", goal:2, t:"`x^2 + 4y^2 = 4`", why:"`2x + 8y dy/dx = 0`." },
          { id:"l6", goal:2, t:"`x^3 + y^3 = 1`", why:"`3x^2 + 3y^2 dy/dx = 0`." },
          { id:"l7", goal:5, t:"`x^2 + xy = 5`", why:"`2x + y + x dy/dx = 0`.",
            hints:["`d/dx (xy) = y + x dy/dx`.", "`2x + y + x dy/dx = 0`.", "`dy/dx = -(2x + y)/x`."] },
          { id:"l8", goal:2, t:"`y^3 + y = x`", why:"`(3y^2 + 1) dy/dx = 1`.",
            hints:["`d/dx (y^3) = 3y^2 dy/dx`.", "`(3y^2 + 1) dy/dx = 1`.", "`1/(3y^2 + 1)`."] }
        ],
        right:[
          { id:"r1", t:"`-{x}/{y}`" },
          { id:"r2", t:"`{x}/{y}`" },
          { id:"r3", t:"`-{y}/{x}`" },
          { id:"r4", t:"`{2}/{y}`" },
          { id:"r5", t:"`-{x}/{4y}`" },
          { id:"r6", t:"`-{x^2}/{y^2}`" },
          { id:"r7", t:"`-{2x + y}/{x}`" },
          { id:"r8", t:"`{1}/{3y^2 + 1}`" },
          { id:"r9", t:"`3y^2 + 1`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l1|r2":"`x^2 + y^2` gives `2x + 2y dy/dx = 0`: there’s a minus.",
          "l3|r1":"`xy` needs the product rule: `y + x dy/dx = 0`.",
          "l8|r9":"Solve for `dy/dx`: it’s 1 divided by `(3y^2 + 1)`."
        },
        wrongDefault:"Differentiate both sides; every `y`-term gets `dy/dx`." },
      { id:"points", type:"custom", title:"Points and tangents", summary:"Points and tangents", star:true, goal:[3, 4, 5],
        instruction:"Find slopes, tangents and the points where tangents are horizontal or vertical. Items 3 to 6 are non-routine.",
        how:"Type whole numbers or fractions, such as 5/12 or −4/3. A point takes two boxes; the order of the points doesn’t matter.",
        items:[
          { id:"s1", goal:3, kind:"boxes", prompt:"Slope of `x^2 + y^2 = 169` at (5, −12).",
            boxes:[{ k:"m", label:"Slope" }], answer:{ m:"5/12" }, display:"5/12",
            wrong:[{ m:"−5/12", fb:"`-x/y` uses the point’s `y`. Use `y = -12`." }],
            why:"`2x + 2y dy/dx = 0` gives `dy/dx = -x/y = -5/(-12) = 5/12`." },
          { id:"s2", goal:[3, 5], kind:"boxes", prompt:"Tangent to `xy = 12` at (3, 4): slope and `y`-intercept.",
            boxes:[{ k:"m", label:"Slope" }, { k:"b", label:"`y`-intercept" }], answer:{ m:"−4/3", b:"8" }, display:"slope −4/3, intercept 8",
            wrong:[{ m:"0", fb:"Substituting `x = 3` before differentiating loses the slope. Differentiate first, then substitute." }],
            why:"`y + x dy/dx = 0` gives `dy/dx = -y/x = -4/3`; `y - 4 = -{4}/{3}(x - 3)` gives `y = -{4}/{3}x + 8`." },
          { id:"s3", goal:4, star:true, kind:"points", prompt:"Points on `x^2 + y^2 - 6x = 16` with horizontal tangents.",
            answer:[[3, 5], [3, -5]], display:"(3, 5) and (3, −5)",
            wrong:[{ pt:[3, 0], fb:"That’s the centre, not on the curve. " + M7 }],
            why:"`2x + 2y dy/dx - 6 = 0` gives `dy/dx = (3 - x)/y`. Horizontal when `x = 3`: `9 + y^2 - 18 = 16`, so `y = ±5`." },
          { id:"s4", goal:4, star:true, kind:"points", prompt:"Points on `4x^2 + y^2 - 8y = 0` with vertical tangents.",
            answer:[[2, 4], [-2, 4]], display:"(2, 4) and (−2, 4)",
            wrong:[{ pts:[[0, 0], [0, 8]], fb:"Those have horizontal tangents. " + M6 }],
            why:"`8x + 2y dy/dx - 8 dy/dx = 0` gives `dy/dx = -4x/(y - 4)`. Vertical when `y = 4`: `4x^2 + 16 - 32 = 0`, so `x = ±2`." },
          { id:"s5", goal:[4, 5], star:true, kind:"points", prompt:"Points on `x^2 + xy + y^2 = 12` with horizontal tangents.",
            answer:[[2, -4], [-2, 4]], display:"(2, −4) and (−2, 4)",
            wrong:[{ pts:[[4, -2], [-4, 2]], fb:"Those are the vertical ones. " + M6 }],
            why:"`dy/dx = -(2x + y)/(x + 2y)`. Horizontal when `y = -2x`: `3x^2 = 12`, so `x = ±2`.",
            hints:["`dy/dx = -(2x + y)/(x + 2y)`.", "Horizontal: `2x + y = 0`, so `y = -2x`.", "`x^2 - 2x^2 + 4x^2 = 12`: `x = ±2`."] },
          { id:"s6", goal:3, star:true, kind:"points", n:1, prompt:"The point on `y^2 = x^3` where the tangent’s slope is 3.",
            answer:[[4, 8]], display:"(4, 8)",
            wrong:[{ pt:[4, -8], fb:"There the slope is −3: `3x^2/(2y)` uses `y`’s sign." }],
            why:"`dy/dx = 3x^2/(2y) = 3` gives `y = x^2/2`; then `x^4/4 = x^3`, so `x = 4` and `y = 8`.",
            hints:["`2y dy/dx = 3x^2`, so `dy/dx = 3x^2/(2y)`.", "Set it to 3: `y = x^2/2`.", "`x^4/4 = x^3` gives `x = 4` (`x = 0` has no slope 3), so `y = 8`."] }
        ],
        msgs:{
          boxes:"Differentiate first, then substitute the point.",
          points:"Find the condition from `dy/dx`, then combine it with the curve’s equation to find actual points.",
          yval:"Check each `y`-value in the curve’s equation.",
          one:"There are two points. Find the other one.",
          err:"Type a whole number or a fraction such as 5/12 or −4/3 in each box."
        } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Mohammed", how:"", goal:[1, 4, 5],
        instruction:"Mohammed made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find `dy/dx` for `x^2 + y^2 = 36`.",
            steps:["`d/dx (x^2) + d/dx (y^2) = d/dx (36)`", "`2x + 2y = 0`", "So `y = -x` and `dy/dx = -1`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"`2x + 2y dy/dx = 0`, so `dy/dx = -x/y`", ok:true, why:M1 },
              { t:"`2x + 2y = 36`", why:"36 is a constant: its derivative is 0." },
              { t:"`2x + 2y dy/dx = 36`", why:M2 },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Is `y` a constant?", "`y` depends on `x`: chain rule.", "`2y dy/dx`."] },
          { id:"e2", goal:5, task:"Find `dy/dx` for `xy + y^2 = 10`.",
            steps:["`d/dx (xy) + d/dx (y^2) = 0`", "`x dy/dx + 2y dy/dx = 0`", "`dy/dx (x + 2y) = 0`, so `dy/dx = 0`"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows. Look earlier."],
            fixes:[
              { t:"`y + x dy/dx + 2y dy/dx = 0`, so `dy/dx = -y/(x + 2y)`", ok:true, why:M3 },
              { t:"`dy/dx + 2y dy/dx = 0`", why:M3 },
              { t:"`y + 2y dy/dx = 0`", why:"The `x dy/dx` term is missing." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Differentiate `xy` with the product rule.", "`y + x dy/dx`.", "`-y/(x + 2y)`."] },
          { id:"e3", goal:4, task:"Find the points on `x^2 + 4y^2 = 16` with vertical tangents.",
            steps:["`2x + 8y dy/dx = 0`", "`dy/dx = -x/(4y)`", "Vertical tangents where the numerator is 0: `x = 0`.", "`x = 0` gives `4y^2 = 16`, so (0, 2) and (0, −2)."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"Vertical where the denominator is 0: `y = 0`, so `x^2 = 16`: (4, 0) and (−4, 0).", ok:true, why:M6 },
              { t:"(0, 2) only.", why:"That uses only the top half, and a vertical tangent still needs a zero denominator." },
              { t:"Where `dy/dx = 1`.", why:"A slope of 1 isn’t vertical." },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["What slope does a vertical line have?", "Undefined: a zero denominator.", "`y = 0`: `(±4, 0)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that one formula handles both halves of a circle, or how a vertical tangent shows up?" },
      { id:"j2", q:"In your own words, why does `d/dx (y^2)` need a factor `dy/dx` when `d/dx (x^2)` doesn’t?" },
      { id:"j3", q:"Explain to a friend how to find the points on a curve where the tangent is horizontal, including how you get actual points." },
      { id:"j4", q:"What still confuses you about implicit differentiation? What will you try next?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`y` is a function of `x`. What is `d/dx (y^3)`?", options:[
          { t:"`3y^2 dy/dx`", ok:true, why:"Outer cube, inner `y`: the chain rule multiplies `3y^2` by `dy/dx`." },
          { t:"`3y^2`", why:M1 },
          { t:"`3x^2`", why:"That’s `d/dx (x^3)`." },
          { t:"`3y^2 · x`", why:"The chain rule multiplies by `dy/dx`, not `x`." }] },
        b:{ prompt:"`y` is a function of `x`. What is `d/dx (y^4)`?", options:[
          { t:"`4y^3 dy/dx`", ok:true, why:"Outer fourth power, inner `y`: the chain rule multiplies `4y^3` by `dy/dx`." },
          { t:"`4y^3`", why:M1 },
          { t:"`4x^3`", why:"That’s `d/dx (x^4)`." },
          { t:"`4y^3 · x`", why:"The chain rule multiplies by `dy/dx`, not `x`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Find `dy/dx` for `x^2 + y^2 = 50`.", options:[
          { t:"`-x/y`", ok:true, why:"`2x + 2y dy/dx = 0`, so `dy/dx = -2x/(2y) = -x/y`." },
          { t:"`x/y`", why:"`2x + 2y dy/dx = 0` moves `2x` across with a minus." },
          { t:"`-y/x`", why:"Upside down." },
          { t:"−1", why:"`2x + 2y = 0` isn’t a derivative equation. " + M1 }] },
        b:{ prompt:"Find `dy/dx` for `x^2 - y^2 = 7`.", options:[
          { t:"`x/y`", ok:true, why:"`2x - 2y dy/dx = 0`, so `dy/dx = 2x/(2y) = x/y`." },
          { t:"`-x/y`", why:"`2x - 2y dy/dx = 0` gives `2y dy/dx = 2x`: no minus survives." },
          { t:"`y/x`", why:"Upside down." },
          { t:"1", why:"`2x - 2y = 0` isn’t a derivative equation. " + M1 }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`y` is a function of `x`. What is `d/dx (x^2y)`?", options:[
          { t:"`2xy + x^2 dy/dx`", ok:true, why:"Product rule: `(2x)(y) + (x^2)(dy/dx)`." },
          { t:"`2x dy/dx`", why:"Multiplies the derivatives. `x^2y` is a product: `(2x)(y) + x^2(dy/dx)`." },
          { t:"`x^2 dy/dx`", why:"The `2xy` term is missing." },
          { t:"`2xy`", why:"`y` isn’t constant. " + M2 }] },
        b:{ prompt:"`y` is a function of `x`. What is `d/dx (xy^2)`?", options:[
          { t:"`y^2 + 2xy dy/dx`", ok:true, why:"Product rule: `(1)(y^2) + x(2y dy/dx)`." },
          { t:"`2y dy/dx`", why:"`xy^2` is a product of two functions of `x`: `(1)(y^2) + x(2y dy/dx)`." },
          { t:"`2xy dy/dx`", why:"`xy^2` is a product of two functions of `x`: the term `(1)(y^2)` is missing." },
          { t:"`y^2 + 2xy`", why:"`y^2` is a composite: the chain rule adds the factor `dy/dx`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find the equation of the tangent to `x^2 + y^2 = 25` at (−3, 4).", options:[
          { t:"`y = {3}/{4}x + {25}/{4}`", ok:true, why:"Slope `-x/y = 3/4`; `y - 4 = {3}/{4}(x + 3)`." },
          { t:"`y = -{3}/{4}x + {7}/{4}`", why:"The sign of the slope comes from `-(-3)/4`." },
          { t:"`y = {4}/{3}x + 8`", why:"Upside-down slope." },
          { t:"`y = -{4}/{3}x`", why:"That’s the radius through (−3, 4), not the tangent." }] },
        b:{ prompt:"Find the equation of the tangent to `x^2 + y^2 = 25` at (4, −3).", options:[
          { t:"`y = {4}/{3}x - {25}/{3}`", ok:true, why:"Slope `-4/(-3) = 4/3`; `y + 3 = {4}/{3}(x - 4)`." },
          { t:"`y = -{4}/{3}x + {7}/{3}`", why:"The sign of the slope comes from `-4/(-3)`." },
          { t:"`y = {3}/{4}x - 6`", why:"Upside-down slope." },
          { t:"`y = -{3}/{4}x`", why:"That’s the radius." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Find the points on `x^2 - xy + y^2 = 3` where the tangent is horizontal.", options:[
          { t:"(1, 2) and (−1, −2)", ok:true, why:"`dy/dx = (y - 2x)/(2y - x)`; horizontal when `y = 2x`; then `3x^2 = 3`." },
          { t:"(2, 1) and (−2, −1)", why:"Those make the denominator 0: vertical tangents." },
          { t:"`(0, √3)` and `(0, -√3)`", why:"Setting `x = 0` isn’t the condition for a flat tangent here." },
          { t:"(1, 2) only", why:"`x = -1` also gives a point." }] },
        b:{ prompt:"Find the points on `x^2 + xy + y^2 = 3` where the tangent is horizontal.", options:[
          { t:"(1, −2) and (−1, 2)", ok:true, why:"`dy/dx = -(2x + y)/(x + 2y)`; horizontal when `y = -2x`; then `3x^2 = 3`." },
          { t:"(−2, 1) and (2, −1)", why:"Those make the denominator 0: vertical tangents." },
          { t:"`(0, √3)` and `(0, -√3)`", why:"Setting `x = 0` isn’t the condition for a flat tangent here." },
          { t:"(1, −2) only", why:"`x = -1` also gives a point." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Use implicit differentiation on `y^5 = x^3` to find the derivative of `y = x^{3/5}`.", options:[
          { t:"`{3}/{5}x^{-2/5}`", ok:true, why:"`5y^4 dy/dx = 3x^2`, so `dy/dx = 3x^2/(5x^{12/5})`." },
          { t:"`{5}/{3}x^{2/3}`", why:"That’s the derivative of `x^{5/3}`: the fraction is upside down." },
          { t:"`{3x^2}/{5}`", why:"The `5y^4` factor needs `dy/dx`, then `y^4` must be replaced." },
          { t:"`{3}/{5}x^{3/5}`", why:"Subtract 1 from the exponent." }] },
        b:{ prompt:"Use implicit differentiation on `y^3 = x^5` to find the derivative of `y = x^{5/3}`.", options:[
          { t:"`{5}/{3}x^{2/3}`", ok:true, why:"`3y^2 dy/dx = 5x^4`, so `dy/dx = 5x^4/(3x^{10/3})`." },
          { t:"`{3}/{5}x^{-2/5}`", why:"Upside-down fraction." },
          { t:"`{5x^4}/{3}`", why:"The `3y^2` factor needs `dy/dx`, then `y^2` must be replaced." },
          { t:"`{5}/{3}x^{5/3}`", why:"Subtract 1 from the exponent." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `d/dx (y^2)` has a factor `dy/dx`?", options:[
          { t:"“`y` depends on `x`, so `y^2` is a composite: outer `u^2`, inner `y`. The chain rule multiplies `2y` by the inner derivative `dy/dx`.”", ok:true, why:M1 },
          { t:"“Because every derivative ends in `dy/dx`.”", why:"`d/dx (x^2) = 2x` has no `dy/dx`." },
          { t:"“Because `y` is a constant.”", why:M2 },
          { t:"“It doesn’t: `d/dx (y^2) = 2y`.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why `d/dx (xy) = y + x dy/dx`?", options:[
          { t:"“`xy` is a product of two functions of `x`, namely `x` and `y`, so the product rule gives `(1)(y) + (x)(dy/dx)`.”", ok:true, why:M3 },
          { t:"“Because `x` and `y` are both constants.”", why:M2 },
          { t:"“Because `d/dx (xy) = (dx/dx)(dy/dx)`.”", why:"That multiplies the derivatives. " + M3 },
          { t:"“Because you differentiate only the `y`.”", why:M3 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"For a curve, `dy/dx = {x - 2}/{y + 1}`. Which statement is correct?", options:[
          { t:"“Horizontal tangents can only be at points on the curve with `x = 2`; vertical tangents only at points on the curve with `y = -1`.”", ok:true, why:M6 + " " + M7 },
          { t:"“Horizontal tangents where `y = -1`; vertical tangents where `x = 2`.”", why:M6 },
          { t:"“Every point with `x = 2` has a horizontal tangent, whether or not it’s on the curve.”", why:M7 },
          { t:"“There are no vertical tangents, because `dy/dx` is a fraction.”", why:"A fraction with a zero denominator is undefined: that’s a vertical tangent." }] },
        b:{ prompt:"For a curve, `dy/dx = {3 - y}/{x + 4}`. Which statement is correct?", options:[
          { t:"“Horizontal tangents can only be at points on the curve with `y = 3`; vertical tangents only at points on the curve with `x = -4`.”", ok:true, why:M6 + " " + M7 },
          { t:"“Horizontal where `x = -4`; vertical where `y = 3`.”", why:M6 },
          { t:"“Every point with `y = 3` has a horizontal tangent, whether or not it’s on the curve.”", why:M7 },
          { t:"“There are no vertical tangents, because `dy/dx` is a fraction.”", why:"A fraction with a zero denominator is undefined: that’s a vertical tangent." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A circular pond’s edge is `x^2 + y^2 = 100` (metres, centre at the origin). A straight path touches the edge at (6, −8). Where does the path cross the `y`-axis?", options:[
          { t:"(0, −12.5)", ok:true, why:"Slope `-6/(-8) = 3/4`; `y + 8 = {3}/{4}(x - 6)` at `x = 0`." },
          { t:"(0, −3.5)", why:"Slope −3/4 is the wrong sign." },
          { t:"(0, −16)", why:"Slope 4/3 is upside down." },
          { t:"(0, 0)", why:"A radius passes through the centre; the tangent path doesn’t." }] },
        b:{ prompt:"The pond’s edge is `x^2 + y^2 = 25`. A path touches it at (−4, 3). Where does the path cross the `y`-axis?", options:[
          { t:"(0, 25/3)", ok:true, why:"Slope 4/3; `y - 3 = {4}/{3}(x + 4)` at `x = 0`." },
          { t:"(0, −7/3)", why:"Slope −4/3 is the wrong sign." },
          { t:"(0, 6)", why:"Slope 3/4 is upside down." },
          { t:"(0, 0)", why:"That’s the radius." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A racetrack follows the ellipse `x^2 + 4y^2 = 100` (metres). At which points is the track running exactly north–south (a vertical tangent)?", options:[
          { t:"(10, 0) and (−10, 0)", ok:true, why:"`dy/dx = -x/(4y)`; vertical when `y = 0`, so `x^2 = 100`." },
          { t:"(0, 5) and (0, −5)", why:"Those have horizontal tangents." },
          { t:"`(±10, ±5)`", why:"These four points aren’t on the ellipse." },
          { t:"(10, 0) only", why:"`x = -10` works too." }] },
        b:{ prompt:"The track follows `x^2 + 9y^2 = 81`. At which points is the tangent vertical?", options:[
          { t:"(9, 0) and (−9, 0)", ok:true, why:"`dy/dx = -x/(9y)`; vertical when `y = 0`, so `x^2 = 81`." },
          { t:"(0, 3) and (0, −3)", why:"Those have horizontal tangents." },
          { t:"`(±9, ±3)`", why:"These four points aren’t on the ellipse." },
          { t:"(9, 0) only", why:"`x = -9` works too." }] } }
    ]
  },
  task:{
    title:"Tangent from the right quadrant", summary:"Tangent from the right quadrant",
    statement:"<p>Choose a point P with whole-number coordinates on the circle `x^2 + y^2 = 50`, then write the tangent line at P as `y = mx + b`, so that every condition holds.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>P is on the circle.</li><li>The line has the tangent’s slope at P.</li><li>The line passes through P.</li><li>The line’s slope is positive.</li><li>The line’s `y`-intercept is positive.</li></ol></div>" +
      "<p class=\"tiny muted\">P’s coordinates are whole numbers from −10 to 10. Type `m` and `b` as whole numbers or fractions: a top box and a bottom box (leave the bottom empty for a whole number). The graph shows the circle, P and your line.</p>",
    checks:["P is on the circle", "Slope matches the tangent", "Passes through P", "Slope positive", "`y`-intercept positive"],
    tips:["Whole-number points on `x^2 + y^2 = 50` use `1^2 + 7^2`, `5^2 + 5^2` or `7^2 + 1^2`.",
      "Implicitly, `dy/dx = -x/y` at P.",
      "Substitute P into `y = mx + b` to find `b`.",
      "`-x_0/y_0 > 0` needs `x_0` and `y_0` to have opposite signs.",
      "Work it out: `b = y_0 + x_0^2/y_0 = 50/y_0`. So `y_0` must be positive."],
    explainPrompt:"Explain how the signs of P’s coordinates decide the signs of the slope and the `y`-intercept.",
    vocab:"Use the words implicit, tangent, slope and intercept.",
    after3:"Every tangent to `x^2 + y^2 = 50` at `(x_0, y_0)` is `x_0x + y_0y = 50`, so its `y`-intercept is `50/y_0`."
  },
  cards:[
    ["Implicit differentiation", "Differentiate both sides with respect to `x`, treating `y` as a function of `x`; then solve for `dy/dx`."],
    ["`d/dx (y^n)`", "`ny^{n-1} · dy/dx` (chain rule)."],
    ["`d/dx (xy)`", "`y + x · dy/dx` (product rule)."],
    ["Circle `x^2 + y^2 = r^2`", "`dy/dx = -x/y`: perpendicular to the radius."],
    ["Why the point matters", "`dy/dx` usually depends on `x` and `y`: (3, 4) and (3, −4) have different slopes."],
    ["Horizontal tangent", "Numerator of `dy/dx` = 0, at a point on the curve."],
    ["Vertical tangent", "Denominator of `dy/dx` = 0, at a point on the curve."],
    ["Order of steps", "Differentiate first, then substitute the point."],
    ["Finding the points", "Combine the tangent condition with the curve’s equation."],
    ["Power rule for `x^{p/q}`", "`y^q = x^p` gives `dy/dx = {p}/{q}x^{p/q - 1}`."],
    ["Constants", "`d/dx (36) = 0`."]
  ]
};
