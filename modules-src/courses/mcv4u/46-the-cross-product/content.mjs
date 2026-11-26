// MCV4U 46 The Cross Product. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/46-the-cross-product.md
const AXB = "`vec{a} × vec{b}`", BXA = "`vec{b} × vec{a}`", A = "`vec{a}`", B = "`vec{b}`", Z = "`vec{0}`";
const I = "`vec{i}`", J = "`vec{j}`", K = "`vec{k}`";
// misconception core sentences (plan §3)
const M1 = "The middle component is `a_3b_1 - a_1b_3`. Check: your answer should dot to 0 with both vectors.";
const M2 = "`vec{a} · vec{b}` is a number; " + AXB + " is a vector perpendicular to both.";
const M3 = "Swap the order and the right-hand rule points the other way: `vec{b} × vec{a} = -(vec{a} × vec{b})`.";
const M4 = "The area uses sin θ. At θ = 0° the vectors are parallel and the area is 0, and sin 0° = 0.";
const M5 = "Parallel vectors span no area: `vec{a} × vec{b} = vec{0}` even though neither vector is " + Z + ".";
const M6 = "`(vec{i} × vec{i}) × vec{j} = vec{0}` but `vec{i} × (vec{i} × vec{j}) = -vec{j}`: not associative.";
const M7 = "That’s not a cross product. Each component uses the <em>other</em> two components.";
const M8 = "Going around `vec{i} → vec{j} → vec{k} → vec{i}` gives +; going backwards gives −. `vec{k} × vec{i} = vec{j}`, so `vec{i} × vec{k} = -vec{j}`.";
const FORMULA = "`(a_2b_3 - a_3b_2, a_3b_1 - a_1b_3, a_1b_2 - a_2b_1)`";

export default {
  id:"46-the-cross-product",
  kind:"topic",
  title:"The cross product",
  topic:"The Cross Product",
  readyTopic:"the cross product",
  hero:{
    eq:"`@n{vec{a}} × @d{vec{b}} = (@n{a_2}@d{b_3} - @n{a_3}@d{b_2}, @n{a_3}@d{b_1} - @n{a_1}@d{b_3}, @n{a_1}@d{b_2} - @n{a_2}@d{b_1})`",
    eqLabel:"a cross b equals the vector a2 b3 minus a3 b2, a3 b1 minus a1 b3, a1 b2 minus a2 b1",
    eqSize:"sm",
    headline:"A vector that stands up to both",
    text:"The <strong>cross product</strong> takes two vectors in R³ and returns a third vector that is <strong>perpendicular</strong> to both. Its direction comes from the <strong>right-hand rule</strong>, and its length is the <strong>area of the parallelogram</strong> the two vectors span: `|vec{a}||vec{b}| sin θ`.",
    fig:{ html:'<div class="cx-hero"><div id="cx-hero-v" class="cx-vhost"></div><div class="q-actions cx-hero-ctl"><button type="button" class="btn ghost sm" id="cx-hero-replay" data-k="cxhero">Replay</button></div></div>' },
    caption:"`vec{a} = (3, 0, 0)` (blue) and `vec{b} = (1, 2, 0)` (teal) span a parallelogram. Curl your right hand from " + A + " toward " + B + ": your thumb points along `vec{a} × vec{b} = (0, 0, 6)`, which meets both at right angles. Its length 6 is the parallelogram’s area 6."
  },
  goals:[
    "I can compute " + AXB + " from components.",
    "I can check that " + AXB + " is perpendicular to both " + A + " and " + B + ".",
    "I can use the right-hand rule, and I know that `vec{b} × vec{a} = -(vec{a} × vec{b})`.",
    "I can use `|vec{a} × vec{b}| = |vec{a}||vec{b}| sin θ` as the area of a parallelogram.",
    "I can use the properties of the cross product, and spot the ones it doesn’t have.",
    "I can find a vector (or unit vector) perpendicular to two given vectors and use it in a problem."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Dot product", goal:2, prompt:"Compute (2, −1, 3) · (1, 5, 1).",
          options:[
            { t:"0", ok:true, why:"2 − 5 + 3 = 0, so the vectors are perpendicular." },
            { t:"(2, −5, 3)", why:"That’s the component-by-component product. The dot product adds those into one number." },
            { t:"10", why:"(−1)(5) = −5, not +5." },
            { t:"−6", why:"3 × 1 = +3: 2 − 5 + 3." }],
          hints:["Multiply matching components, then add.", "2(1) + (−1)(5) + 3(1).", "2 − 5 + 3 = 0."] },
        { id:"w2", skill:"Dot product", goal:6, prompt:"Which vector is perpendicular to both (1, 0, 0) and (0, 1, 0)?",
          options:[
            { t:"(0, 0, 5)", ok:true, why:"Both dot products are 0." },
            { t:"(1, 1, 0)", why:"The sum lies in the same plane: (1, 1, 0) · (1, 0, 0) = 1." },
            { t:"(1, 1, 1)", why:"(1, 1, 1) · (1, 0, 0) = 1, not 0." },
            { t:"(1, −1, 0)", why:"(1, −1, 0) · (1, 0, 0) = 1." }],
          hints:["Perpendicular means the dot product is 0.", "You need `x = 0` and `y = 0`.", "(0, 0, 5)."] },
        { id:"w3", skill:"2 × 2 determinants", goal:1, prompt:"Evaluate the determinant with rows (3, 2) and (4, 5): 3 × 5 − 2 × 4.",
          options:[
            { t:"7", ok:true, why:"15 − 8 = 7." },
            { t:"23", why:"Subtract the products: 15 − 8." },
            { t:"−7", why:"Main diagonal first: 3 × 5, then minus 2 × 4." },
            { t:"2", why:"Multiply along the diagonals: 3 × 5 and 2 × 4." }],
          hints:["Down-right product minus up-right product.", "3 × 5 = 15 and 2 × 4 = 8.", "7."] },
        { id:"w4", skill:"2 × 2 determinants", goal:1, prompt:"Evaluate (−1)(3) − (4)(2).",
          options:[
            { t:"−11", ok:true, why:"−3 − 8 = −11." },
            { t:"5", why:"−3 − 8, not −3 + 8." },
            { t:"11", why:"That’s 8 − (−3)." },
            { t:"−5", why:"(−1)(3) = −3, so −3 − 8 = −11." }],
          hints:["Work out each product first.", "−3 and 8.", "−3 − 8 = −11."] },
        { id:"w5", skill:"Sine and area", goal:4, prompt:"sin 150° = ?",
          options:[
            { t:"`1/2`", ok:true, why:"150° has reference angle 30°, and sine is positive in quadrant 2." },
            { t:"`-1/2`", why:"Sine is positive in quadrant 2." },
            { t:"`√3/2`", why:"sin 30° = 1/2." },
            { t:"`-√3/2`", why:"That’s cos 150°." }],
          hints:["Reference angle?", "180° − 150° = 30°; sine is positive in Q2.", "1/2."] },
        { id:"w6", skill:"Sine and area", goal:4, prompt:"A parallelogram has sides 4 and 6 with an angle of 30° between them. Its area?",
          options:[
            { t:"12", ok:true, why:"Area = `ab` sin θ = 24 × 1/2." },
            { t:"24", why:"Only a 90° angle gives 4 × 6." },
            { t:"`12√3`", why:"24 cos 30° = `12√3`, but the height uses sine." },
            { t:"6", why:"Half of 12 is the triangle." }],
          hints:["Height = 6 sin 30°.", "Height = 3.", "4 × 3 = 12."] }
      ],
      refreshers:{
        "Dot product":"`vec{a} · vec{b} = a_1b_1 + a_2b_2 + a_3b_3`, a single number. It’s 0 exactly when the vectors are perpendicular (module 44).",
        "2 × 2 determinants":"The determinant with rows (`p`, `q`) and (`r`, `s`) is `ps - qr`. Each cross product component is one of these.",
        "Sine and area":"A parallelogram with sides `a`, `b` and angle θ has height `b` sin θ, so area `ab` sin θ. Know sin 30° = 1/2, sin 45° = `√2/2`, sin 60° = `√3/2`, sin 90° = 1, and sin(180° − θ) = sin θ."
      }
    }
  },
  explore:{
    heading:"Right-hand rotator",
    intro:"Set two vectors and watch their cross product. Rotate the view to check that it really is perpendicular to both.",
    modes:[{ id:"build", t:"Build" }, { id:"swap", t:"Swap" }, { id:"angle", t:"Angle" }],
    modeHow:{
      build:"Set " + A + " and " + B + " with the steppers (whole numbers from −4 to 4). Tap a component of " + AXB + " in the readout to see its determinant.",
      swap:"The same steppers. " + BXA + " joins the view in long dashes, and the right hand now curls from " + B + " toward " + A + ".",
      angle:"`vec{a} = (4, 0, 0)` is fixed and `|vec{b}| = 2`. The slider sets θ, with `vec{b} = (2 cos θ, 2 sin θ, 0)`."
    },
    presets:[
      { id:"ij", t:"`vec{i}`, `vec{j}`", a:[1, 0, 0], b:[0, 1, 0] },
      { id:"p122", t:"(1, 2, 2), (2, 1, −2)", a:[1, 2, 2], b:[2, 1, -2] },
      { id:"par", t:"parallel pair", a:[1, -2, 2], b:[2, -4, 4] }
    ],
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Build, preset `vec{a} = vec{i}`, `vec{b} = vec{j}`. Which way does `vec{i} × vec{j}` point?",
        options:[{ t:"Straight up, along +`z`", ok:true }, { t:"Straight down, along −`z`" }, { t:"Along `vec{i} + vec{j}`" }, { t:"It’s the number 0" }],
        explain:"The right hand curls from the `x`-axis to the `y`-axis, and the arrow rises to (0, 0, 1). `vec{i} × vec{j} = vec{k}`: a right-handed system." },
      { id:"p2", prompt:"Swap mode, same vectors. What is `vec{j} × vec{i}`?",
        options:[{ t:"Same length, opposite direction: `-vec{k}`", ok:true }, { t:"The same as `vec{i} × vec{j}`" }, { t:Z }, { t:"Twice as long" }],
        explain:"The dashed arrow points down. Curl from " + J + " to " + I + " and your thumb points down." },
      { id:"p3", prompt:"Angle mode, θ animates from 90° to 180°. What happens to the parallelogram’s area?",
        options:[{ t:"It shrinks to 0", ok:true }, { t:"It grows" }, { t:"It stays 8" }, { t:"It becomes negative" }],
        explain:"The parallelogram flattens, and the ink arrow shortens to nothing at 180°. Area = 8 sin θ, and sin 180° = 0. A length can’t be negative." },
      { id:"p4", prompt:"Build, `vec{a} = (1, 2, 3)`, `vec{b} = (2, 4, 6)`. What is " + AXB + "?",
        options:[{ t:Z, ok:true }, { t:"(2, 8, 18)" }, { t:"28" }, { t:"A long vector, since " + B + " is long" }],
        explain:"The parallelogram collapses into a segment, and every component is 0. `vec{b} = 2vec{a}`: parallel vectors span no area. (2, 8, 18) multiplies matching components, and 28 is the dot product." }
    ],
    chalIntro:"Use the 3D view to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"With `vec{a} = (3, 0, 0)` fixed, set " + B + " so that `vec{a} × vec{b} = (0, 0, 6)`.",
        why:"`vec{a} × vec{b} = (0, -3b_3, 3b_2)`, so `b_3 = 0` and `3b_2 = 6`. Any `vec{b} = (t, 2, 0)` works.",
        hints:["Work out " + AXB + " in general for `vec{a} = (3, 0, 0)`.", "It’s `(0, -3b_3, 3b_2)`. You need `b_3 = 0` and `3b_2 = 6`.", "`vec{b} = (0, 2, 0)` works, and so does any (`t`, 2, 0)."],
        msgs:{ seta:"Use Build or Swap mode and set `vec{a} = (3, 0, 0)` first.",
          down:"That gives (0, 0, −6): the right-hand rule points down. Reverse " + B + ".",
          zb:"That gives (0, −6, 0): " + B + " along `z` makes the result lie along `y`.",
          par:"Parallel to " + A + ": the cross product is " + Z + ".",
          other:"That gives " + AXB + " = {v}. You need (0, 0, 6)." } },
      { id:"tc2", goal:4, prompt:"Angle mode (`|vec{a}| = 4`, `|vec{b}| = 2`). Set θ so the parallelogram’s area is `4√3`.",
        why:"8 sin θ = `4√3` when sin θ = `√3/2`: θ = 60° or 120°.",
        hints:["Area = 4 × 2 × sin θ.", "8 sin θ = `4√3`, so sin θ = `√3/2`.", "60°, and also 120°, since sin(180° − θ) = sin θ."],
        msgs:{ mode:"Switch to Angle mode first.",
          cos:"8 cos 30° = `4√3`, but area uses sine: 8 sin 30° = 4.",
          max:"That’s the largest area, 8.",
          other:"At θ = {t} the area is 8 sin θ = {v}. You need `4√3` ≈ 6.93." } },
      { id:"tc3", goal:[1, 5], stretch:true, prompt:"Build mode, `vec{a} = (1, 2, 2)` fixed. Find a " + B + " (whole numbers from −4 to 4) with `vec{a} × vec{b} = (2, -1, 0)`. Then find a <strong>second, different</strong> one.",
        why:"The answers are `vec{b} = (0, 0, 1) + tvec{a}`: (0, 0, 1), (1, 2, 3), (−1, −2, −1) and (−2, −4, −3). Adding " + A + " to " + B + " adds `vec{a} × vec{a} = vec{0}`.",
        hints:["The target must be perpendicular to " + A + " (check: 2 − 2 + 0 = 0, so it’s possible). Try a simple " + B + " first.", "With `vec{b} = (0, 0, b_3)`: `vec{a} × vec{b} = (2b_3, -b_3, 0)`.", "`b_3 = 1` gives (0, 0, 1). Since `vec{a} × vec{a} = vec{0}`, `vec{a} × (vec{b} + vec{a}) = vec{a} × vec{b}`, so (1, 2, 3) works too."],
        msgs:{ seta:"Use Build mode and set `vec{a} = (1, 2, 2)` first.",
          target:"You set " + B + " to the target, but " + AXB + " is perpendicular to " + B + ", so the target can’t be " + B + ". You get (2, 4, −5).",
          opp:"That gives (−2, 1, 0), the opposite. Reverse " + B + ".",
          one:"One found. Hint: adding " + A + " to " + B + " doesn’t change " + AXB + ". Why?",
          other:"That gives " + AXB + " = {v}. You need (2, −1, 0).",
          found:"Found so far", none:"none yet" } }
    ]
  },
  part3:{
    slug:"properties", name:"Properties",
    heading:"Cross product properties",
    intro:"Five stations, five experiments. Each one tests a property with numbers and the 3D view, and ends in a rule.",
    stations:[
      { id:"s1", title:"Order", text:"Compute " + AXB + " and " + BXA + " for `vec{a} = (2, 1, 0)` and `vec{b} = (0, 1, 3)`. Type each component, then press Check.",
        a:[2, 1, 0], b:[0, 1, 3],
        msgs:{ m1:M1, m7:M7, m3:"That’s " + AXB + " again. " + M3,
          gen:"Work out each component with its 2 × 2 determinant, then dot your answer with " + A + " and " + B + ": both must be 0." },
        verdictQ:"How are " + AXB + " and " + BXA + " related?",
        verdicts:[{ id:"eq", t:"equal" }, { id:"opp", t:"opposite" }, { id:"unr", t:"unrelated" }],
        verdictFb:{ eq:"Look at the signs: every component flipped.", unr:"Each component of one is the negative of the other’s.", opp:"Right. Same length, opposite direction." },
        rule:"`vec{b} × vec{a} = -(vec{a} × vec{b})` (anticommutative)." },
      { id:"s2", title:"Unit-vector cycle", text:"Tap a first vector and a second vector. Forward around the circle gives +, backward gives −.",
        rule:"`vec{i} × vec{j} = vec{k}`, `vec{j} × vec{k} = vec{i}`, `vec{k} × vec{i} = vec{j}`; `vec{i} × vec{i} = vec{0}`." },
      { id:"s3", title:"Scalars and sums", text:"Slide `@a{k}` (violet, because it does the job of a stretch) to scale " + A + ". Then add `@k{vec{c}} = (1, 0, 1)` and compare both sides of the distributive law.",
        c:[1, 0, 1],
        rule:"`(kvec{a}) × vec{b} = k(vec{a} × vec{b})` and `vec{a} × (vec{b} + vec{c}) = vec{a} × vec{b} + vec{a} × vec{c}`.",
        alg:"First components: `a_2(b_3 + c_3) - a_3(b_2 + c_2) = (a_2b_3 - a_3b_2) + (a_2c_3 - a_3c_2)`. The same four terms appear on both sides, so the two sides agree for every " + A + ", " + B + ", `vec{c}`." },
      { id:"s4", title:"Not associative", text:"Work out both bracketings of `vec{i} × vec{i} × vec{j}`.",
        left:"`(vec{i} × vec{i}) × vec{j} = vec{0} × vec{j} = vec{0}`",
        right:"`vec{i} × (vec{i} × vec{j}) = vec{i} × vec{k} = -vec{j}`",
        rule:"Different answers, so the cross product is not associative: one counterexample is enough." },
      { id:"s5", title:"Parallel vectors", text:"`vec{a} = (3, 0, 0)` and `|vec{b}| = 2`. Slide " + B + " toward " + A + " and watch " + AXB + ".",
        rule:"`vec{a} × vec{b} = vec{0}` means parallel (or a zero vector)." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Cross product properties quick check",
      items:[
        { id:"q1", goal:3, prompt:"`vec{j} × vec{k}` = ?",
          choices:[
            { t:I, ok:true, fb:"Right. Forward around the cycle `vec{j} → vec{k} → vec{i}`: positive." },
            { t:"`-vec{i}`", fb:"Forward around the cycle `vec{j} → vec{k} → vec{i}`: positive." },
            { t:Z, fb:"Forward around the cycle `vec{j} → vec{k} → vec{i}`: positive." },
            { t:"1", fb:"Forward around the cycle `vec{j} → vec{k} → vec{i}`: positive." }] },
        { id:"q2", goal:3, prompt:"If `vec{a} × vec{b} = (3, -1, 2)`, then " + BXA + " = ?",
          choices:[
            { t:"(−3, 1, −2)", ok:true, fb:"Right. Swapping the order flips every sign." },
            { t:"(3, −1, 2)", fb:"Swapping the order flips every sign." },
            { t:"(2, −1, 3)", fb:"Swapping the order flips every sign." },
            { t:Z, fb:"Swapping the order flips every sign." }] },
        { id:"q3", goal:5, prompt:"`(2vec{a}) × (3vec{b})` = ?",
          choices:[
            { t:"`6(vec{a} × vec{b})`", ok:true, fb:"Right. Scalars factor out and multiply: 2 × 3 = 6." },
            { t:"`5(vec{a} × vec{b})`", fb:"Scalars factor out and multiply: 2 × 3 = 6." },
            { t:AXB, fb:"Scalars factor out and multiply: 2 × 3 = 6." },
            { t:"`6(vec{b} × vec{a})`", fb:"Scalars factor out and multiply: 2 × 3 = 6." }] },
        { id:"q4", goal:5, prompt:"Compare `(vec{i} × vec{i}) × vec{j}` and `vec{i} × (vec{i} × vec{j})`.",
          choices:[
            { t:"Different: " + Z + " and `-vec{j}`", ok:true, fb:"Right. `vec{i} × vec{k} = -vec{j}`, so brackets matter." },
            { t:"Equal: both " + Z, fb:"`vec{i} × vec{k} = -vec{j}`, so brackets matter." },
            { t:"Equal: both `-vec{j}`", fb:"`vec{i} × vec{k} = -vec{j}`, so brackets matter." },
            { t:"Different: " + Z + " and " + J, fb:"`vec{i} × vec{k} = -vec{j}`, so brackets matter." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Cross product ↔ result", summary:"Cross product ↔ result", goal:[1, 3, 5],
        instruction:"Match each cross product with its result.",
        leftTitle:"Product", rightTitle:"Result",
        left:[
          { id:"l1", t:"`vec{i} × vec{j}`", why:"Forward around the cycle." },
          { id:"l2", t:"`vec{k} × vec{j}`", why:"Backward around the cycle: `-vec{i}`.", wrong:"`vec{j} × vec{k} = vec{i}`, so `vec{k} × vec{j} = -vec{i}`." },
          { id:"l3", t:"(1, 2, 3) × (4, 5, 6)", why:"(12 − 15, 12 − 6, 5 − 8) = (−3, 6, −3).",
            hints:["First component: `a_2b_3 - a_3b_2`.", "2(6) − 3(5) = −3; middle: 3(4) − 1(6) = 6.", "Last: 1(5) − 2(4) = −3. So (−3, 6, −3)."] },
          { id:"l4", t:"(2, 0, −1) × (1, 3, 2)", why:"(0 + 3, −1 − 4, 6 − 0) = (3, −5, 6)." },
          { id:"l5", t:"(3, −6, 9) × (−1, 2, −3)", why:"(3, −6, 9) = −3(−1, 2, −3): parallel, so " + Z + ".", wrong:"(3, −6, 9) = −3(−1, 2, −3): parallel." },
          { id:"l6", t:"(2, −1, 1) × (1, 1, −2)", why:"(2 − 1, 1 + 4, 2 + 1) = (1, 5, 3).",
            hints:["Middle component: `a_3b_1 - a_1b_3`.", "1(1) − 2(−2) = 5.", "(1, 5, 3)."] },
          { id:"l7", t:"(1, 1, 0) × (0, 1, 1)", why:"(1 − 0, 0 − 1, 1 − 0) = (1, −1, 1)." },
          { id:"l8", t:"(0, 1, 1) × (1, 1, 0)", why:"The same vectors as the previous pair in the other order, so the result flips: (−1, 1, −1)." }
        ],
        right:[
          { id:"r1", t:K }, { id:"r2", t:"`-vec{i}`" }, { id:"r3", t:"(−3, 6, −3)" }, { id:"r4", t:"(3, −5, 6)" },
          { id:"r5", t:Z }, { id:"r6", t:"(1, 5, 3)" }, { id:"r7", t:"(1, −1, 1)" }, { id:"r8", t:"(−1, 1, −1)" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l7|r8":"Same vectors, opposite order: the result flips.", "l8|r7":"Same vectors, opposite order: the result flips." },
        wrongDefault:"Dot your choice with both vectors. If either isn’t 0, it can’t be the cross product." },
      { id:"puzzles", type:"numeric", title:"Cross product puzzles", summary:"Cross product puzzles", star:true, goal:[1, 4, 5, 6],
        instruction:"Type one number for each puzzle. Items 3 to 6 are non-routine (★); items 5 and 6 go beyond the Final Check.",
        how:"Type a number (fractions such as 1/2 and roots such as 2√5 are fine), then press Check.",
        items:[
          { id:"r1", goal:5, prompt:"Find `c` so that `(1, 2, c) × (2, 4, 6) = vec{0}`.", label:"c =", answer:3, display:"`c = 3`", keypad:"text",
            why:"(1, 2, 3) = ½(2, 4, 6): parallel vectors give " + Z + ".",
            wrong:[{ match:[12], fb:"That makes (1, 2, 12), not parallel. You need (1, 2, `c`) = ½(2, 4, 6)." }],
            general:"The cross product is " + Z + " only for parallel vectors. Compare (1, 2, `c`) with (2, 4, 6)." },
          { id:"r2", goal:4, prompt:"Area of the parallelogram spanned by (1, 2, 2) and (2, 1, −2).", label:"Area", answer:9, display:"9", keypad:"text",
            why:"The cross product is (−6, 6, −3), with length `√81 = 9`.",
            wrong:[{ match:[81], fb:"That’s `|vec{a} × vec{b}|^2`, not its length." }, { match:[0], fb:"That’s `vec{a} · vec{b}`. " + M2 }],
            general:"Area = `|vec{a} × vec{b}|`. Find the cross product, then its length." },
          { id:"r3", goal:[1, 6], star:true, prompt:"`vec{a} = (2, 1, -1)`, `vec{b} = (1, k, 3)`. For which `k` is " + AXB + " perpendicular to the `z`-axis?", label:"k =", answer:0.5, display:"`k = 1/2`", keypad:"text",
            why:"`vec{a} × vec{b} = (3 + k, -7, 2k - 1)`, and `2k - 1 = 0`.",
            general:"`vec{a} × vec{b} = (3 + k, -7, 2k - 1)`. Perpendicular to (0, 0, 1) means the `z`-component is 0." },
          { id:"r4", goal:4, star:true, prompt:"`|vec{a}| = 5`, `|vec{b}| = 4` and `vec{a} · vec{b} = 10`. Find `|vec{a} × vec{b}|`.", label:"Length", answer:17.320508075688775, tol:1e-6, display:"`10√3`", keypad:"text",
            why:"cos θ = 10/20, so θ = 60° and the length is 20 sin 60° = `10√3`.",
            wrong:[{ match:[10], fb:"That’s `vec{a} · vec{b}`." }, { match:[20], fb:"cos θ = 1/2, so θ = 60°, not 90°." }],
            hints:["Use the dot product to find θ.", "10 = 20 cos θ, so θ = 60°.", "`|vec{a} × vec{b}| = 20 sin 60° = 10√3`."] },
          { id:"r5", goal:4, star:true, prompt:"`vec{a} × vec{b} = (2, -3, 6)` and `|vec{a}| = 1`. What is the smallest possible `|vec{b}|`?", label:"Smallest |b|", answer:7, display:"7", keypad:"text",
            why:"`|vec{a} × vec{b}| = 7 = |vec{b}|` sin θ, and sin θ ≤ 1, so `|vec{b}| ≥ 7`.",
            wrong:[{ match:[49], fb:"That’s `|vec{a} × vec{b}|^2`." }, { match:[1], fb:"`|vec{a} × vec{b}| = 7 ≤ |vec{a}||vec{b}| = |vec{b}|`." }],
            hints:["Find `|vec{a} × vec{b}|`.", "`√(4 + 9 + 36) = 7 = |vec{a}||vec{b}|` sin θ = `|vec{b}|` sin θ.", "sin θ ≤ 1, so `|vec{b}| ≥ 7`; equality when `vec{b} ⟂ vec{a}`."] },
          { id:"r6", goal:5, star:true, prompt:"Simplify `(vec{a} + vec{b}) × (vec{a} - vec{b})` = □ " + "`(vec{a} × vec{b})`. What goes in the box?", label:"Box", answer:-2, display:"−2", keypad:"text",
            why:"`vec{a} × vec{a} - vec{a} × vec{b} + vec{b} × vec{a} - vec{b} × vec{b} = -2(vec{a} × vec{b})`.",
            wrong:[{ match:[0], fb:"`vec{a} × vec{a}` and `vec{b} × vec{b}` vanish, but `-vec{a} × vec{b} + vec{b} × vec{a} = -2(vec{a} × vec{b})`." }, { match:[2], fb:"`vec{b} × vec{a} = -(vec{a} × vec{b})`." }],
            hints:["Expand like brackets, keeping the order.", "`vec{a} × vec{a} - vec{a} × vec{b} + vec{b} × vec{a} - vec{b} × vec{b}`.", "`vec{0} - vec{a} × vec{b} - vec{a} × vec{b} - vec{0} = -2(vec{a} × vec{b})`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Valentina", how:"", goal:[1, 4, 5],
        instruction:"Valentina made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Compute (2, 3, 1) × (1, −1, 4).",
            steps:["`x`: `a_2b_3 - a_3b_2 = 3(4) - 1(-1) = 13`.", "`y`: `a_1b_3 - a_3b_1 = 2(4) - 1(1) = 7`.", "`z`: `a_1b_2 - a_2b_1 = 2(-1) - 3(1) = -5`.", "So the answer is (13, 7, −5)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct, but an earlier step isn’t.", "Step 4 copies the earlier steps. The mistake is before it."],
            fixes:[
              { t:"`y = a_3b_1 - a_1b_3 = 1 - 8 = -7`, so (13, −7, −5).", ok:true, why:"Check: (13, −7, −5) · (2, 3, 1) = 26 − 21 − 5 = 0." },
              { t:"`x` should be 12 − 1 = 11.", why:"3(4) − 1(−1) = 12 + 1 = 13." },
              { t:"Multiply matching parts: (2, −3, 4).", why:M7 },
              { t:"Step 2 is correct.", why:"Check: (13, 7, −5) · (2, 3, 1) = 42 ≠ 0, so it isn’t perpendicular to the first vector." }],
            hints:["Dot the answer with (2, 3, 1).", "It isn’t 0, so a component is wrong. Check the middle one’s order.", "`a_3b_1 - a_1b_3 = -7`."] },
          { id:"e2", goal:4, task:"Find the area of the parallelogram spanned by `vec{a} = (2, 0, 1)` and `vec{b} = (0, 3, 1)`.",
            steps:["`|vec{a}| = √5` and `|vec{b}| = √10`.", "`vec{a} · vec{b} = 1`, so cos θ = `1/√50`.", "Area = `|vec{a}||vec{b}|` cos θ = `√50 × 1/√50 = 1`.", "The area is 1 square unit."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Area = `|vec{a} × vec{b}| = |(-3, -2, 6)| = 7`.", ok:true, why:"`√(9 + 4 + 36) = √49 = 7`." },
              { t:"Area = `vec{a} · vec{b}` = 1.", why:M2 },
              { t:"Area = `|vec{a}||vec{b}| = √50`.", why:"That ignores the angle." },
              { t:"Step 3 is correct.", why:"cos θ is nearly 0 here, so the vectors are nearly perpendicular. The area should be close to `√50` ≈ 7.07, not 1." }],
            hints:["Area uses sin θ, not cos θ.", "Or skip angles: area = `|vec{a} × vec{b}|`.", "(−3, −2, 6) has length `√49 = 7`."] },
          { id:"e3", goal:5, task:"Simplify `(vec{a} × vec{b}) + (vec{b} × vec{a}) + (2vec{a} × vec{a})`.",
            steps:["`vec{b} × vec{a} = vec{a} × vec{b}`, since order doesn’t matter.", "`2vec{a} × vec{a} = 2(vec{a} × vec{a}) = vec{0}`.", "So the sum is `2(vec{a} × vec{b})`."],
            answer:0,
            stepFb:["", "Step 2 is correct, but an earlier step isn’t.", "Step 3 adds up the earlier steps. The mistake is before it."],
            fixes:[
              { t:"`vec{b} × vec{a} = -(vec{a} × vec{b})`, so the sum is " + Z + ".", ok:true, why:"The first two terms cancel and the last is " + Z + "." },
              { t:"`vec{a} × vec{a} = |vec{a}|^2`, so the sum is `2(vec{a} × vec{b}) + 2|vec{a}|^2`.", why:M2 },
              { t:"The sum is `3(vec{a} × vec{b})`.", why:"`2vec{a} × vec{a}` is " + Z + ", not another " + AXB + "." },
              { t:"Step 1 is correct.", why:"Try " + I + " and " + J + ": `vec{i} × vec{j} = vec{k}` but `vec{j} × vec{i} = -vec{k}`." }],
            hints:["Is the cross product commutative?", "Swapping the order flips the sign.", "The first two terms cancel: " + Z + "."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most in the 3D view: the right-hand rule, the swap, or parallel vectors giving " + Z + "?" },
      { id:"j2", q:"In your own words, why is the length of " + AXB + " the area of a parallelogram?" },
      { id:"j3", q:"Explain to a friend how to check a cross product you’ve computed, without redoing it." },
      { id:"j4", q:"Which property of the cross product still feels strange? What will you do to get used to it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"(1, −2, 3) × (2, 1, −1) = ?", options:[
          { t:"(−1, 7, 5)", ok:true, why:"(2 − 3, 6 + 1, 1 + 4)." },
          { t:"(−1, −7, 5)", why:"The middle is `a_3b_1 - a_1b_3 = 6 + 1 = 7`." },
          { t:"(2, −2, −3)", why:"Matching components multiplied. " + M7 },
          { t:"−3", why:"That’s the dot product. " + M2 }] },
        b:{ prompt:"(3, 1, −2) × (1, 2, 1) = ?", options:[
          { t:"(5, −5, 5)", ok:true, why:"(1 + 4, −2 − 3, 6 − 1)." },
          { t:"(5, 5, 5)", why:M1 },
          { t:"(3, 2, −2)", why:"Matching components multiplied. " + M7 },
          { t:"3", why:"That’s the dot product. " + M2 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`vec{i} × vec{k}` = ?", options:[
          { t:"`-vec{j}`", ok:true, why:"`vec{k} × vec{i} = vec{j}`, and reversing the order flips the sign." },
          { t:J, why:"That’s `vec{k} × vec{i}`. " + M8 },
          { t:Z, why:"Perpendicular vectors give a dot product of 0, not a cross product of " + Z + "." },
          { t:K, why:"The cross product is perpendicular to " + K + ", so it can’t point along " + K + "." }] },
        b:{ prompt:"`vec{k} × vec{j}` = ?", options:[
          { t:"`-vec{i}`", ok:true, why:"`vec{j} × vec{k} = vec{i}`; reversed, `-vec{i}`." },
          { t:I, why:"`vec{j} × vec{k} = vec{i}`, so reversing the order gives `-vec{i}`." },
          { t:Z, why:"Perpendicular vectors give a dot product of 0, not a cross product of " + Z + "." },
          { t:J, why:"It must be perpendicular to " + J + "." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`|vec{a}| = 6`, `|vec{b}| = 5` and the angle between them is 150°. `|vec{a} × vec{b}|` = ?", options:[
          { t:"15", ok:true, why:"30 × sin 150° = 30 × 1/2." },
          { t:"`-15√3`", why:"That’s `|vec{a}||vec{b}|` cos θ: the dot product." },
          { t:"`15√3`", why:"Cosine’s size, not sine’s. " + M4 },
          { t:"30", why:"That ignores the angle." }] },
        b:{ prompt:"`|vec{a}| = 4`, `|vec{b}| = 3`, angle 135°. `|vec{a} × vec{b}|` = ?", options:[
          { t:"`6√2`", ok:true, why:"12 × sin 135° = 12 × `√2/2`." },
          { t:"`-6√2`", why:"That’s the dot product." },
          { t:"`3√2`", why:"That’s half: the triangle’s area." },
          { t:"12", why:"That ignores the angle." }] } },
      { id:"t1", cat:"T", goal:[2, 6],
        a:{ prompt:"Which vector is perpendicular to both (1, 2, −1) and (3, 0, 2)?", options:[
          { t:"(4, −5, −6)", ok:true, why:"The cross product; check: 4 − 10 + 6 = 0 and 12 + 0 − 12 = 0." },
          { t:"(4, 5, −6)", why:"Dot with (1, 2, −1): 4 + 10 + 6 = 20 ≠ 0." },
          { t:"(3, 0, −2)", why:"Dot with (1, 2, −1): 3 + 0 + 2 = 5 ≠ 0." },
          { t:"(4, 2, 1)", why:"That’s the sum, which lies in the same plane: dot with (1, 2, −1) is 7." }] },
        b:{ prompt:"Which vector is perpendicular to both (2, −1, 1) and (1, 3, 0)?", options:[
          { t:"(−3, 1, 7)", ok:true, why:"Check: −6 − 1 + 7 = 0 and −3 + 3 + 0 = 0." },
          { t:"(−3, −1, 7)", why:"Dot with (2, −1, 1) is 2." },
          { t:"(2, −3, 0)", why:"Dot with (2, −1, 1) is 7." },
          { t:"(3, 2, 1)", why:"The sum: dot with (2, −1, 1) is 5." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`vec{a} × vec{b} = (2, -1, 4)`. Find `(3vec{a}) × (vec{a} - 2vec{b})`.", options:[
          { t:"(−12, 6, −24)", ok:true, why:"`3(vec{a} × vec{a}) - 6(vec{a} × vec{b}) = vec{0} - 6(2, -1, 4)`." },
          { t:"(12, −6, 24)", why:"The −2 carries through: 3 × (−2) = −6." },
          { t:"(−6, 3, −12)", why:"`3vec{a} × vec{a}` is " + Z + ", not `3(vec{a} × vec{b})`." },
          { t:"(2, −1, 4)", why:"Scalars multiply; they don’t add (3 + (−2) = 1)." }] },
        b:{ prompt:"`vec{a} × vec{b} = (1, 3, -2)`. Find `(2vec{a} + vec{b}) × (4vec{b})`.", options:[
          { t:"(8, 24, −16)", ok:true, why:"`8(vec{a} × vec{b}) + 4(vec{b} × vec{b}) = 8(1, 3, -2)`." },
          { t:"(−8, −24, 16)", why:"The order is " + A + " then " + B + ", not reversed." },
          { t:"(12, 36, −24)", why:"`vec{b} × vec{b}` is " + Z + ", not " + AXB + "." },
          { t:"(6, 18, −12)", why:"Scalars multiply: 2 × 4 = 8." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"`vec{a} = (1, 1, 0)`. Which " + B + " makes the parallelogram on " + A + " and " + B + " largest?", options:[
          { t:"(0, 0, 3)", ok:true, why:"`|(3, -3, 0)| = 3√2` ≈ 4.24, the largest." },
          { t:"(3, 3, 0)", why:"The longest option, but it’s parallel to " + A + ": area 0." },
          { t:"(1, −1, 1)", why:"Perpendicular to " + A + ", but short: area `√6` ≈ 2.45." },
          { t:"(2, 0, 0)", why:"It has the largest dot product with " + A + " after the parallel one, but area is `|vec{a} × vec{b}|` = 2." }] },
        b:{ prompt:"`vec{a} = (0, 2, 0)`. Which " + B + " makes the parallelogram largest?", options:[
          { t:"(3, 0, 0)", ok:true, why:"`|(0, 0, -6)|` = 6." },
          { t:"(0, 4, 0)", why:"Parallel: area 0." },
          { t:"(2, 2, 2)", why:"Longest of the rest, but at an angle: area `4√2` ≈ 5.66." },
          { t:"(1, 1, 1)", why:"Area `|(2, 0, -2)| = 2√2`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which statement best explains how " + AXB + " and " + BXA + " are related?", options:[
          { t:"“They have the same length, but the right-hand rule points them in opposite directions, so `vec{b} × vec{a} = -(vec{a} × vec{b})`.”", ok:true, why:"Curling from " + B + " to " + A + " turns your thumb around." },
          { t:"“They are equal: only the dot product depends on order.”", why:"The dot product is the one that doesn’t." },
          { t:"“" + BXA + " is the number `|vec{a}||vec{b}| sin θ`, while " + AXB + " is a vector.”", why:M2 },
          { t:"“They have different lengths, because the angle from " + B + " to " + A + " is 360° − θ.”", why:"The angle between vectors is always from 0° to 180°; the lengths match." }] },
        b:{ prompt:"Which statement best explains why `vec{a} × vec{a} = vec{0}`?", options:[
          { t:"“The angle between " + A + " and itself is 0°, so `|vec{a} × vec{a}| = |vec{a}|^2` sin 0° = 0; a zero-length vector is " + Z + ".”", ok:true, why:"A vector and itself are parallel, so they span no area." },
          { t:"“`vec{a} × vec{a} = |vec{a}|^2`, the squared length.”", why:"That’s `vec{a} · vec{a}`." },
          { t:"“Because " + A + " is perpendicular to itself.”", why:"A non-zero vector is never perpendicular to itself." },
          { t:"“Because the cross product is only defined for different vectors.”", why:"It’s defined; it just equals " + Z + "." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement is true for all vectors " + A + ", " + B + ", `vec{c}` in R³?", options:[
          { t:"`vec{a} × (vec{b} + vec{c}) = vec{a} × vec{b} + vec{a} × vec{c}`", ok:true, why:"The cross product distributes over addition." },
          { t:"`(vec{a} × vec{b}) × vec{c} = vec{a} × (vec{b} × vec{c})`", why:"`(vec{i} × vec{i}) × vec{j} = vec{0}` but `vec{i} × (vec{i} × vec{j}) = -vec{j}`." },
          { t:"`vec{a} × vec{b} = vec{b} × vec{a}`", why:M3 },
          { t:"If `vec{a} × vec{b} = vec{0}`, then `vec{a} = vec{0}` or `vec{b} = vec{0}`.", why:"Any parallel pair gives " + Z + "." }] },
        b:{ prompt:"Which statement is true for all vectors and every scalar `k`?", options:[
          { t:"`(kvec{a}) × vec{b} = k(vec{a} × vec{b})`", ok:true, why:"Scalars factor out of a cross product." },
          { t:"`(kvec{a}) × (kvec{b}) = k(vec{a} × vec{b})`", why:"Each `k` comes out: `k^2(vec{a} × vec{b})`." },
          { t:AXB + " is perpendicular to `vec{a} + vec{b}` only when `vec{a} ⟂ vec{b}`.", why:"It’s perpendicular to `vec{a} + vec{b}` always, since it’s perpendicular to both." },
          { t:"`(vec{a} × vec{b}) × vec{c} = vec{a} × (vec{b} × vec{c})`", why:M6 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A rectangular solar panel has edges along `vec{u} = (4, 0, 3)` and `vec{v} = (0, 2, 0)`, in metres. What is its area?", options:[
          { t:"10 m²", ok:true, why:"`vec{u} × vec{v} = (-6, 0, 8)`, length 10." },
          { t:"0 m²", why:"`vec{u} · vec{v} = 0` means the edges are perpendicular, not that the area is 0." },
          { t:"2 m²", why:"−6 + 0 + 8 adds the components; the area is the length `√(36 + 64)`." },
          { t:"5 m²", why:"That’s half: a triangle." }] },
        b:{ prompt:"A panel has edges along `vec{u} = (0, 3, 4)` and `vec{v} = (5, 0, 0)`, in metres. Its area?", options:[
          { t:"25 m²", ok:true, why:"`vec{u} × vec{v} = (0, 20, -15)`, length 25." },
          { t:"0 m²", why:"`vec{u} · vec{v} = 0` means the edges are perpendicular, not that the area is 0." },
          { t:"5 m²", why:"20 − 15 adds components; the area is the length `√(400 + 225)`." },
          { t:"12.5 m²", why:"Half: a triangle." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A drone’s camera must point straight out from a roof panel whose edges run along (0, 1, 1) and (2, 1, 0). Which is a <strong>unit</strong> vector perpendicular to the panel?", options:[
          { t:"`(1/3)(-1, 2, -2)`", ok:true, why:"The cross product is (−1, 2, −2), length 3; divide by 3." },
          { t:"(−1, 2, −2)", why:"Perpendicular, but its length is 3, not 1." },
          { t:"`(1/3)(-1, -2, -2)`", why:"Dot with (0, 1, 1): (−2 − 2)/3 ≠ 0." },
          { t:"`(1/√5)(2, 1, 0)`", why:"That’s a unit vector along an edge, not out of the panel." }] },
        b:{ prompt:"A panel’s edges run along (0, 1, 1) and (2, 0, 1). Which is a unit vector perpendicular to it?", options:[
          { t:"`(1/3)(1, 2, -2)`", ok:true, why:"Cross product (1, 2, −2), length 3." },
          { t:"(1, 2, −2)", why:"Length 3, not 1." },
          { t:"`(1/3)(1, -2, -2)`", why:"Dot with (0, 1, 1) is −4/3." },
          { t:"`(1/√5)(2, 0, 1)`", why:"Along an edge." }] } }
    ]
  },
  task:{
    title:"Area 9, pointing up", summary:"Area 9, pointing up",
    statement:"<p>`vec{a} = (1, 2, 2)` is fixed. Design " + B + " so the parallelogram meets every condition. Can you find all the answers?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The parallelogram on " + A + " and " + B + " has area 9.</li><li>" + AXB + " points upward (positive `z`-component).</li><li>" + B + " is <strong>not</strong> perpendicular to " + A + ".</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −4 to 4 for `b_1`, `b_2` and `b_3`. The 3D preview shows " + A + ", " + B + ", the parallelogram and " + AXB + ".</p>",
    checks:["Area 9", "Cross product points up", "Not perpendicular to " + A],
    tips:["Area = `|vec{a} × vec{b}|`. Since `|vec{a}| = 3`, you need `|vec{b}|` sin θ = 3.",
      "The `z`-component of " + AXB + " is `b_2 - 2b_1`. Make it positive, or reverse " + B + ".",
      "A perpendicular " + B + " of length 3 gives area 9, but line 3 rules it out. Try a longer " + B + " at an angle."],
    explainPrompt:"Explain how you made the area 9 without making " + B + " perpendicular to " + A + ", and how you controlled which way " + AXB + " points.",
    vocab:"Use the words cross product, area, sin θ and right-hand rule.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"Every answer has `|vec{b}| = √18` and `vec{a} · vec{b} = ±9`. That’s because `|vec{a} × vec{b}|^2 = |vec{a}|^2|vec{b}|^2 - (vec{a} · vec{b})^2`: 81 = 9 × 18 − 81."
  },
  cards:[
    [AXB + " (formula)", FORMULA],
    ["Direction of " + AXB, "Perpendicular to both; right-hand rule (curl from " + A + " to " + B + ", thumb points along " + AXB + ")."],
    ["Length of " + AXB, "`|vec{a}||vec{b}| sin θ` = area of the parallelogram on " + A + " and " + B + "."],
    ["Checking a cross product", "Dot it with " + A + " and with " + B + ": both must be 0."],
    [BXA, "`-(vec{a} × vec{b})`: anticommutative."],
    ["Unit vector cycle", "`vec{i} × vec{j} = vec{k}`, `vec{j} × vec{k} = vec{i}`, `vec{k} × vec{i} = vec{j}`; backwards gives −."],
    ["Parallel vectors", "`vec{a} × vec{b} = vec{0}` (no area), even when neither is " + Z + "."],
    ["Scalars", "`(kvec{a}) × vec{b} = vec{a} × (kvec{b}) = k(vec{a} × vec{b})`."],
    ["Distributive", "`vec{a} × (vec{b} + vec{c}) = vec{a} × vec{b} + vec{a} × vec{c}`."],
    ["Not associative", "`(vec{i} × vec{i}) × vec{j} = vec{0}`, but `vec{i} × (vec{i} × vec{j}) = -vec{j}`."],
    ["Dot vs cross", "`vec{a} · vec{b}` is a number (uses cos θ); " + AXB + " is a vector (length uses sin θ); R³ only."],
    ["Unit normal to two vectors", "`(vec{a} × vec{b})/|vec{a} × vec{b}|` (or its opposite)."]
  ]
};
