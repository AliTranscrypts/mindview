// MCV4U 58 Distance from a Point to a Line in R² and R³. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/58-distance-point-to-line.md
// misconception core sentences (plan §3)
const M1 = "That’s the distance to one point of the line. The shortest distance is along the perpendicular, and it’s smaller.";
const M2 = "Divide by `|vec{n}| = √{A^2 + B^2}`, and take the absolute value: distance is never negative.";
const M3 = "Rearrange first: `y = 3x - 4` is `3x - y - 4 = 0`, so `B = -1`.";
const M4 = "The parallelogram’s height is its area `|vec{QP} × vec{m}|` divided by its base `|vec{m}|`.";
const M5 = "In R², a direction `(a, b)` gives a normal `(b, -a)`. The formula needs the normal.";
const M6 = "F = `vec{r}_0 + t vec{m}`, with `t` from `vec{PF} · vec{m} = 0`. Substitute `t` back into the whole line.";
const M7 = "A line in R³ has no single scalar equation. Use the cross product.";
const QPxM = "`{|vec{QP} × vec{m}|}/{|vec{m}|}`";

export default {
  id:"58-distance-point-to-line",
  kind:"topic",
  title:"Distance from a point to a line",
  topic:"Distance from a Point to a Line in R² and R³",
  readyTopic:"the distance from a point to a line",
  hero:{
    eq:"`d = {|vec{QP} × vec{m}|}/{|vec{m}|}` <span class=\"dp-heq2\">R²: `d = {|Ax_0 + By_0 + C|}/{√{A^2 + B^2}}`</span>",
    eqLabel:"d equals the magnitude of Q P cross m, over the magnitude of m. In R 2: d equals the absolute value of A x nought plus B y nought plus C, over the square root of A squared plus B squared.",
    eqSize:"sm",
    headline:"The shortest way to a line is straight across",
    text:"From a point, you can reach a line in many ways, but only one is shortest: the path that meets the line at a <strong>right angle</strong>. Its end is the <strong>foot of the perpendicular</strong>. Projections and cross products measure that path without having to find the foot first.",
    fig:{ html:'<div class="dp-hero"><div class="plot-wrap"><canvas class="plot" id="hero-plot" role="img" aria-label="The line 3x + 4y − 12 = 0 and the point P(3, 7). A dashed segment from P to a point sliding along the line stretches and shrinks; its length label ticks down to 5.0 and stops at F(0, 3), where a right-angle mark appears."></canvas></div>' +
      '<svg class="dp-hsvg" id="hero-3d" viewBox="0 0 420 300" role="img" aria-label="A line in space with the point P off it. The parallelogram on vector QP and the direction m shades in, and its height, from P straight across to the line, glows. Caption: height = area ÷ base." focusable="false"></svg></div>' }
  },
  goals:[
    "I can explain why the shortest distance from a point to a line is along the perpendicular.",
    "I can find the distance from a point to a line in R² using `{|Ax_0 + By_0 + C|}/{√{A^2 + B^2}}`.",
    "I can find the distance from a point to a line in R³ using " + QPxM + ".",
    "I can find the foot of the perpendicular (the closest point on the line).",
    "I can find the distance between two parallel lines.",
    "I can solve problems involving the distance from a point to a line in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Projections", goal:2, prompt:"What is the scalar projection of `(3, 4)` on `(1, 0)`?",
          options:[
            { t:"3", ok:true, why:"`(3, 4) · (1, 0) ÷ 1 = 3`." },
            { t:"4", why:"Projects onto the `y`-direction: `(1, 0)` points along `x`." },
            { t:"5", why:"That’s `|(3, 4)|`." },
            { t:"`(3, 0)`", why:"That’s the vector projection. The scalar projection is a number." }],
          hints:["`(vec{a} · vec{b})/|vec{b}|`.", "`3 × 1 + 4 × 0 = 3`.", "3."] },
        { id:"w2", skill:"Projections", goal:2, prompt:"What is the scalar projection of `vec{a} = (2, 6)` on `vec{n} = (3, 4)`?",
          options:[
            { t:"6", ok:true, why:"`(6 + 24)/5 = 6`." },
            { t:"30", why:"Divide by 5: you need `|vec{n}|`." },
            { t:"6/5", why:"Dividing by `|vec{n}|^2` gives the factor for the vector projection." },
            { t:"`2√10`", why:"That’s the length of `vec{a}`, not its shadow." }],
          hints:["Dot, then divide by `|vec{n}|`.", "`vec{a} · vec{n} = 30`, `|vec{n}| = 5`.", "6."] },
        { id:"w3", skill:"Cross product and area", goal:3, prompt:"What is the area of the parallelogram with sides `(1, 0, 0)` and `(0, 2, 0)`?",
          options:[
            { t:"2", ok:true, why:"`|(0, 0, 2)| = 2`." },
            { t:"0", why:"The dot product is 0; the area isn’t." },
            { t:"1", why:"That’s the triangle." },
            { t:"3", why:"Area multiplies." }],
          hints:["Area `= |vec{a} × vec{b}|`.", "`(1, 0, 0) × (0, 2, 0) = (0, 0, 2)`.", "2."] },
        { id:"w4", skill:"Cross product and area", goal:3, prompt:"`|vec{a}| = 4`, `|vec{b}| = 3` and the angle between them is 30°. What is `|vec{a} × vec{b}|`?",
          options:[
            { t:"6", ok:true, why:"`4 × 3 × sin 30° = 12 × 1/2`." },
            { t:"`6√3`", why:"Cross product magnitude uses `sin θ`." },
            { t:"12", why:"That ignores the angle: multiply by `sin 30° = 1/2`." },
            { t:"3", why:"`4 × 3 × 1/2 = 6`." }],
          hints:["`|vec{a} × vec{b}| = |vec{a}||vec{b}| sin θ`.", "`sin 30° = 1/2`.", "6."] },
        { id:"w5", skill:"Equations of lines", goal:2, prompt:"Write `y = 2x - 3` in the form `Ax + By + C = 0`.",
          options:[
            { t:"`2x - y - 3 = 0`", ok:true, why:"Move `y` to the right side." },
            { t:"`2x + y - 3 = 0`", why:"The `y` changes sign when it moves." },
            { t:"`2x - y + 3 = 0`", why:"Check `(0, -3)`: `0 + 3 + 3 ≠ 0`." },
            { t:"`-2x - y - 3 = 0`", why:"Check `(0, -3)`: `0 + 3 - 3 = 0` ✓, but `(1, -1)`: `-2 + 1 - 3 ≠ 0`." }],
          hints:["Get everything on one side.", "`0 = 2x - y - 3`.", "`2x - y - 3 = 0`."] },
        { id:"w6", skill:"Equations of lines", goal:4, prompt:"Which vector is a normal to the line `vec{r} = (1, 2) + t(3, -1)`?",
          options:[
            { t:"`(1, 3)`", ok:true, why:"`(1, 3) · (3, -1) = 0`." },
            { t:"`(3, -1)`", why:"That’s the direction." },
            { t:"`(1, 2)`", why:"`(1, 2)` is a position, not a normal." },
            { t:"`(-3, 1)`", why:"Still parallel to the line." }],
          hints:["A normal is perpendicular to the direction.", "Swap the components and change one sign.", "`(1, 3)`."] }
      ],
      refreshers:{
        "Projections":"The scalar projection of `vec{a}` on `vec{b}` is `(vec{a} · vec{b})/|vec{b}|`, the signed length of `vec{a}`’s shadow on `vec{b}`’s line.",
        "Cross product and area":"`|vec{a} × vec{b}| = |vec{a}||vec{b}| sin θ` is the area of the parallelogram on `vec{a}` and `vec{b}`.",
        "Equations of lines":"In R², `Ax + By + C = 0` has normal `(A, B)`. A direction `(a, b)` has normal `(b, -a)`."
      }
    }
  },
  explore:{
    heading:"Shortest path",
    intro:"Slide the point F along the line and watch the distance from P. Find where it’s smallest, and see what’s special about that spot.",
    txt:{
      mode:"Space", r2:"R²", r3:"R³", views:"Views", graph:"Distance graph", formula:"Formula view",
      tSlider:"F on the line: `t`", tNote:"Arrow keys move F by 0.25; Shift + arrows move it by 1.",
      pNote:"Drag P, or tap P and use the arrow keys (it stays on whole numbers from −8 to 8).",
      px:"P: `x`", py:"P: `y`", pz:"P: `z`",
      presets:"3D view", iso:"Isometric", front:"Front (xz)", side:"Side (yz)", top:"Top (xy)",
      rotNote:"Drag the 3D view, or tap it and use the arrow keys, to turn it.",
      show:"Show the shortest distance", hidden:"(find it, or press Show)",
      perp:"0: perpendicular ✓",
      rows:{ line:"Line", p:"P", f:"F", pf:"`|PF|`", dot:"`vec{PF} · vec{m}`", best:"Shortest distance", formula:"Formula" },
      key2:"Line in blue; `vec{n}` magenta; `vec{QP}` teal; the distance PF in ink.",
      key3:"Line `L` and `vec{m}` in blue; `vec{QP}` teal; the distance PF in ink.",
      dgLabel:"`|PF|` against `t`", at:"at", reflect:"(the reflection of P in the line is 2F − P)"
    },
    predIntro:"Make a prediction first. Then the shortest-path tool shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"R², F at `t = 0`, i.e. (4, 0). As F slides from (4, 0) toward (0, 3), what happens to `|PF|`?",
        options:[{ t:"It decreases to 5, then increases", ok:true }, { t:"It keeps decreasing" }, { t:"It stays the same" }, { t:"It keeps increasing" }],
        explain:"The distance is least at one point, the foot F(0, 3). (4, 0) is just the point named in the equation." },
      { id:"p2", prompt:"At the closest point, what’s the angle between `vec{PF}` and the line?",
        options:[{ t:"90°", ok:true }, { t:"45°" }, { t:"0°" }, { t:"It depends on where P is" }],
        explain:"If the angle weren’t 90°, sliding F a little toward P’s side would shorten PF." },
      { id:"p3", prompt:"R², Formula view, P moved to (−1, −2). Now `3x_0 + 4y_0 - 12 = -23`. What is the distance?",
        options:[{ t:"23/5", ok:true }, { t:"−23/5" }, { t:"23" }, { t:"23/25" }],
        explain:"The negative sign says P is on the other side of the line. Distance is `|-23|/5`." },
      { id:"p4", prompt:"R³, P(5, −1, 1). `|vec{QP}| = 3√2` for Q(1, 0, 2). Is the distance from P to the line `3√2`?",
        options:[{ t:"No, it’s smaller", ok:true }, { t:"Yes" }, { t:"No, it’s larger" }, { t:"You can’t tell without a scalar equation" }],
        explain:"Q is just the line’s starting point. The perpendicular height of the parallelogram is `9 ÷ 3 = 3`." }
    ],
    chalIntro:"Use the shortest-path tool, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"R² mode: slide F to the closest point to P(3, 7), then press Check.",
        why:"At `t = -1`, F = (0, 3): `vec{PF} · vec{m} = 25 + 25t = 0`, and the distance is 5.",
        hints:["Watch the `vec{PF} · vec{m}` row.", "`vec{PF} · vec{m} = 25 + 25t`.", "`t = -1`: F(0, 3), distance 5."],
        msgs:{ mode:"Switch to R² mode first.", p:"Put P back at (3, 7) first.", t0:"That’s (4, 0), the point in the equation, not the closest.",
          close:"Close. At the closest point, `vec{PF} · vec{m} = 0`.", general:"Not yet: F isn’t the closest point. Watch `|PF|` and the `vec{PF} · vec{m}` row." } },
      { id:"tc2", goal:2, prompt:"R² mode: move P so that it’s exactly <strong>2</strong> units from the line `3x + 4y - 12 = 0`, <strong>above</strong> the line.",
        why:"`3x + 4y - 12 = 10`, so `|10|/5 = 2`, and the positive sign puts P above the line (`B > 0`).",
        hints:["`|3x + 4y - 12|/5 = 2`.", "Above: `3x + 4y - 12 = 10`, so `3x + 4y = 22`.", "(2, 4): `6 + 16 = 22`."],
        msgs:{ mode:"Switch to R² mode first.", side:"Right distance, wrong side.", num:"You’ve made the numerator 2. Divide by `√{3^2 + 4^2} = 5`.",
          general:"Not yet: P must be exactly 2 units from the line, above it. Watch the Formula view." } },
      { id:"tc3", goal:4, stretch:true, prompt:"R³ mode: place P so that its distance to `L` is 3 <strong>and</strong> the foot of the perpendicular is (1, 0, 2).",
        why:"P − (1, 0, 2) is perpendicular to `(2, 1, -2)` and has length 3, so F = (1, 0, 2) and the distance is 3.",
        hints:["P = (1, 0, 2) + `vec{v}`, where `vec{v} ⟂ (2, 1, -2)` and `|vec{v}| = 3`.",
          "Whole-number vectors of length 3 look like `(2, 2, 1)` or `(3, 0, 0)`, with signs and order changed.",
          "`(2, -2, 1)`: `4 - 2 - 2 = 0`, so P(3, −2, 3)."],
        msgs:{ mode:"Switch to R³ mode first.", foot:"The distance is right, but the closest point isn’t (1, 0, 2). `vec{PF}` must be perpendicular to `vec{m}` at F(1, 0, 2).",
          len:"Perpendicular, but the offset has length", len2:"≠ 3.", general:"Not yet: P − (1, 0, 2) must be perpendicular to `(2, 1, -2)` and have length 3." } }
    ]
  },
  part3:{
    slug:"parallel", name:"Feet and parallels",
    heading:"Feet and parallels",
    intro:"Explore found the minimum by sliding. Here you compute the foot exactly, step by step, and stretch the distance idea to parallel lines. The picture checks each step.",
    labels:{ toggle:"Write the second line as `6x + 8y + 16 = 0`" },
    st1:{ title:"Station 1: the foot in R³",
      text:"`L`: `vec{r} = (1, 0, 2) + t(2, 1, -2)`, P(5, −1, 1). Step through the algebra; the 3D view marks F and the right angle.",
      fig:"3D view of the line L and the point P(5, −1, 1).",
      steps:[
        "F = `(1 + 2t, t, 2 - 2t)`.",
        "`vec{PF} = (2t - 4, t + 1, 1 - 2t)`.",
        "`vec{PF} · vec{m} = 9t - 9 = 0`, so `t = 1`.",
        "F = (3, 1, 0), and `|PF| = |(-2, 2, -1)| = 3`, which matches the cross-product formula: `9 ÷ 3 = 3`."] },
    st2:{ title:"Station 2: parallel lines in R²",
      text:"`3x + 4y - 12 = 0` and `3x + 4y + 8 = 0` have the same normal `(3, 4)`, so they’re parallel. Step through, then try the toggle.",
      fig:"Graph of the two parallel lines with the point (4, 0) on the first.",
      steps:[
        "Pick (4, 0) on the first line.",
        "Its distance to the second line is `|12 + 0 + 8|/5 = 4`.",
        "Shortcut: `|C_1 - C_2|/√{A^2 + B^2} = 20/5 = 4`, <strong>only after</strong> the `A` and `B` match."],
      stepsAlt:[
        "Pick (4, 0) on the first line.",
        "Its distance to `6x + 8y + 16 = 0` is `|24 + 0 + 16|/√{36 + 64} = 40/10 = 4`.",
        "Shortcut: the `A` and `B` don’t match yet. Divide by 2 first: `3x + 4y + 8 = 0`, then `|-12 - 8|/5 = 4`. Without dividing, `|-12 - 16|/5` gives the wrong 28/5."] },
    st3:{ title:"Station 3: parallel lines in R³",
      text:"`vec{r} = (1, 0, 2) + t(2, 1, -2)` and `vec{r} = (5, -1, 1) + s(2, 1, -2)` share the direction `(2, 1, -2)`.",
      fig:"3D view of two parallel lines joined by a strip of equal perpendicular segments.",
      steps:[
        "The lines are parallel: both have direction `(2, 1, -2)`.",
        "The distance is the distance from (5, −1, 1) to the first line: `|vec{QP} × vec{m}|/|vec{m}| = 9 ÷ 3 = 3`.",
        "Every perpendicular segment between the lines has the same length, 3."] },
    quickCheck:{
      title:"Quick check", summary:"Feet and parallels quick check",
      items:[
        { id:"q1", goal:2, prompt:"Distance from (1, 2) to `4x - 3y + 7 = 0`?",
          choices:[{ t:"1", ok:true, fb:"Right. `|4 - 6 + 7|/5 = 5/5 = 1`." }, { t:"5", fb:"Divide by 5. " + M2 },
            { t:"9/5", fb:"The constant is +7." }, { t:"1/5", fb:"Divide by `√25 = 5`, not 25." }] },
        { id:"q2", goal:4, prompt:"Foot of the perpendicular from P(0, 5) to `vec{r} = t(1, 1)` in R²?",
          choices:[{ t:"(5/2, 5/2)", ok:true, fb:"Right. `vec{PF} = (t, t - 5)`; `vec{PF} · (1, 1) = 2t - 5 = 0`, so `t = 5/2`." },
            { t:"(0, 0)", fb:"`vec{PF} = (t, t - 5)`; `vec{PF} · (1, 1) = 2t - 5 = 0`." },
            { t:"(5, 5)", fb:"`vec{PF} = (t, t - 5)`; `vec{PF} · (1, 1) = 2t - 5 = 0`." },
            { t:"(1, 1)", fb:"`vec{PF} = (t, t - 5)`; `vec{PF} · (1, 1) = 2t - 5 = 0`." }] },
        { id:"q3", goal:5, prompt:"Distance between `2x - y + 3 = 0` and `2x - y - 7 = 0`?",
          choices:[{ t:"`2√5`", ok:true, fb:"Right. `|3 - (-7)|/√5 = 10/√5 = 2√5`." }, { t:"10", fb:"`|3 - (-7)|/√5 = 10/√5 = 2√5`." },
            { t:"`4/√5`", fb:"`|3 - (-7)|/√5 = 10/√5 = 2√5`." }, { t:"2", fb:"`|3 - (-7)|/√5 = 10/√5 = 2√5`." }] },
        { id:"q4", goal:3, prompt:"In R³, the distance from P to the line through Q with direction `vec{m}` is…",
          choices:[{ t:QPxM, ok:true, fb:"Right. Parallelogram height = area ÷ base." },
            { t:"`{|vec{QP} · vec{m}|}/{|vec{m}|}`", fb:"The dot version measures along the line, not across it. " + M4 },
            { t:"`{|vec{QP} × vec{m}|}/{|vec{QP}|}`", fb:M4 },
            { t:"`|vec{QP}|`", fb:M1 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"calc", type:"numeric", title:"Distance calculator", summary:"Distance calculator", goal:[2, 3, 5],
        instruction:"Find each distance. Give exact values.",
        how:"Type an exact answer, then press Check: whole numbers, fractions such as 6/13, or roots such as √5, 2√2 or 3/√10.",
        items:[
          { id:"d1", goal:2, prompt:"(2, −1) to `5x + 12y - 4 = 0`", answer:6 / 13, display:"6/13", keypad:"text",
            why:"`|10 - 12 - 4|/13 = 6/13`.",
            wrong:[{ match:6, fb:M2 }, { match:-6 / 13, fb:M2 }, { match:-6, fb:M2 }],
            hints:["`d = {|Ax_0 + By_0 + C|}/{√{A^2 + B^2}}`.", "`5(2) + 12(-1) - 4 = -6`, and `√{25 + 144} = 13`.", "`|-6|/13 = 6/13`."] },
          { id:"d2", goal:2, prompt:"(−3, 4) to `y = 2x + 5`", answer:Math.sqrt(5), display:"`√5`", keypad:"text",
            why:"`2x - y + 5 = 0`: `|-6 - 4 + 5|/√5 = 5/√5 = √5`.",
            general:"Rearrange: `2x - y + 5 = 0`. " + M3,
            hints:["Rearrange first.", "`2x - y + 5 = 0`; `2(-3) - 4 + 5 = -5`.", "`5/√5 = √5`."] },
          { id:"d3", goal:2, prompt:"The origin to `x + y - 4 = 0`", answer:2 * Math.SQRT2, display:"`2√2`", keypad:"text",
            why:"`|0 + 0 - 4|/√2 = 4/√2 = 2√2`.",
            wrong:[{ match:4, fb:M2 }, { match:-4, fb:M2 }],
            hints:["Substitute (0, 0).", "`|-4|/√{1 + 1}`.", "`4/√2 = 2√2`."] },
          { id:"d4", goal:2, prompt:"(1, 1) to `vec{r} = (3, 0) + t(4, 3)` in R²", answer:2, display:"2", keypad:"text",
            why:"Normal `(3, -4)`: `3x - 4y - 9 = 0`, so `|3 - 4 - 9|/5 = 2`.",
            wrong:[{ match:1, fb:"Using `(4, 3)` as the normal: " + M5 + " Normal `(3, -4)`: `3x - 4y - 9 = 0`." }],
            hints:["Find a normal from the direction `(4, 3)`.", "Normal `(3, -4)`: `3x - 4y - 9 = 0`.", "`|3 - 4 - 9|/5 = 10/5 = 2`."] },
          { id:"d5", goal:3, prompt:"(3, 1, 4) to `vec{r} = (0, 1, 1) + t(1, 2, 2)`", answer:3, display:"3", keypad:"text",
            why:"`|(-6, -3, 6)| = 9`, and `9 ÷ 3 = 3`.",
            wrong:[{ match:9, fb:"Divide by `|vec{m}| = 3`. " + M4 }],
            hints:["Q(0, 1, 1), `vec{QP} = (3, 0, 3)`.", "`vec{QP} × vec{m} = (-6, -3, 6)`, length 9.", "`9 ÷ 3 = 3`."] },
          { id:"d6", goal:3, prompt:"(4, 1, −2) to the `x`-axis", answer:Math.sqrt(5), display:"`√5`", keypad:"text",
            why:"The closest point on the `x`-axis is (4, 0, 0), so `d = √{1 + 4} = √5`.",
            wrong:[{ match:Math.sqrt(21), fb:"That’s the distance to the origin (M1). The closest point on the `x`-axis is (4, 0, 0)." }],
            hints:["The `x`-axis is `vec{r} = t(1, 0, 0)`.", "The foot is (4, 0, 0).", "`√{1^2 + (-2)^2} = √5`."] },
          { id:"d7", goal:3, prompt:"(4, 5, −2) to `vec{r} = t(2, 1, 2)`", answer:6, display:"6", keypad:"text",
            why:"`vec{OP} × vec{m} = (12, -12, -6)`, length 18, and `18 ÷ 3 = 6`.",
            wrong:[{ match:3 * Math.sqrt(5), fb:"That’s `|OP|`. " + M1 }, { match:18, fb:"Divide by `|vec{m}| = 3`. " + M4 }],
            hints:["Q is the origin, so `vec{QP} = (4, 5, -2)`.", "`(4, 5, -2) × (2, 1, 2) = (12, -12, -6)`, length 18.", "`18 ÷ 3 = 6`."] },
          { id:"d8", goal:5, prompt:"Between `6x - 8y + 1 = 0` and `3x - 4y - 2 = 0`", answer:0.5, display:"1/2", keypad:"text",
            why:"`6x - 8y - 4 = 0`, so `|1 - (-4)|/10 = 1/2`.",
            wrong:[{ match:0.3, fb:"Match the coefficients first: `6x - 8y - 4 = 0`, then `|1 - (-4)|/10`." }],
            hints:["Are the normals parallel?", "Double the second equation.", "`|1 + 4|/10 = 1/2`."] }
        ] },
      { id:"beyond", type:"custom", title:"Beyond the formula", summary:"Beyond the formula", star:true, goal:[2, 4, 5, 6],
        instruction:"Non-routine distance problems. N5 and N6 go beyond the Final Check.",
        how:"Type exact numbers in the boxes (whole numbers, fractions such as −7/2, or roots such as √5), then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type exact numbers only, such as 3, −7/2 or √5.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"n1", goal:2, star:true, prompt:"Find both values of `k` for which `(k, 1)` is 3 units from `4x - 3y + 2 = 0`.",
            parts:["`k =`", { k:"a" }, "or `k =`", { k:"b" }], set:true,
            answer:{ set:[4, -3.5] }, display:"`k = 4` or `k = -7/2`",
            wrong:[{ has:[4], fb:"`|4k - 1| = 15` has two cases." }],
            why:"`|4k - 3 + 2|/5 = 3`, so `4k - 1 = ±15`: `k = 4` or `k = -7/2`.",
            hints:["`|4k - 3 + 2|/5 = 3`.", "`4k - 1 = 15` or `4k - 1 = -15`.", "`k = 4` or `-7/2`."] },
          { id:"n2", goal:5, star:true, prompt:"Find both lines parallel to `5x + 12y - 3 = 0` and 2 units from it.",
            parts:["`5x + 12y +`", { k:"a" }, "`= 0` and `5x + 12y +`", { k:"b" }, "`= 0`"], set:true,
            answer:{ set:[23, -29] }, display:"`5x + 12y + 23 = 0` and `5x + 12y - 29 = 0`",
            wrong:[{ set:[-1, -5], fb:"The constants must differ by `2 × 13 = 26`." }],
            why:"`|C - (-3)|/13 = 2`, so `C + 3 = ±26`: `C = 23` or `C = -29`.",
            hints:["Parallel lines keep `A = 5` and `B = 12`.", "`|C + 3|/13 = 2`.", "`C + 3 = ±26`: `C = 23` or `-29`."] },
          { id:"n3", goal:4, star:true, prompt:"Find the point on `vec{r} = (3, 3, 0) + t(1, 2, 2)` closest to the origin, and the distance.",
            parts:["point (", { k:"x" }, ",", { k:"y" }, ",", { k:"z" }, "); distance", { k:"d" }],
            answer:{ x:2, y:1, z:-2, d:3 }, display:"(2, 1, −2); distance 3",
            wrong:[{ when:{ x:3, y:3, z:0 }, fb:"(3, 3, 0) is the point in the equation. " + M1 }],
            why:"F = `(3 + t, 3 + 2t, 2t)`; `vec{OF} · (1, 2, 2) = 9 + 9t = 0`, so `t = -1`: F(2, 1, −2), distance `√{4 + 1 + 4} = 3`.",
            hints:["F = `(3 + t, 3 + 2t, 2t)`, and `vec{OF} · vec{m} = 0`.", "`9 + 9t = 0`, so `t = -1`.", "F(2, 1, −2), distance 3."] },
          { id:"n4", goal:6, star:true, prompt:"Triangle A(1, 2, 0), B(3, 3, 2), C(4, 5, 0): find the height from C to line AB, then the area.",
            parts:["height", { k:"h" }, "; area", { k:"a" }],
            answer:{ h:3, a:4.5 }, display:"height 3; area 9/2",
            wrong:[{ when:{ a:9 }, fb:"That’s the parallelogram; halve it." }],
            why:"`vec{AC} × vec{AB} = (6, -6, -3)`, length 9, and `|vec{AB}| = 3`: height `9 ÷ 3 = 3`, area `1/2 × 3 × 3 = 9/2`.",
            hints:["`vec{AB} = (2, 1, 2)`, `vec{AC} = (3, 3, 0)`.", "`|vec{AC} × vec{AB}| = 9`, `|vec{AB}| = 3`.", "Height 3; area `9/2`."] },
          { id:"n5", goal:5, star:true, prompt:"Distance between the parallel lines `vec{r} = (1, 0, 2) + t(2, 1, -2)` and `vec{r} = (7, 0, -1) + s(-4, -2, 4)`.",
            parts:["distance", { k:"d" }],
            answer:{ d:3 }, display:"3",
            general:"Use any point of one line and the other line’s direction.",
            why:"P(7, 0, −1), Q(1, 0, 2): `vec{QP} = (6, 0, -3)`; `vec{QP} × (2, 1, -2) = (3, 6, 6)`, length 9, and `9 ÷ 3 = 3`.",
            hints:["Take P(7, 0, −1) on the second line and Q(1, 0, 2), `vec{m} = (2, 1, -2)` on the first.", "`vec{QP} × vec{m} = (3, 6, 6)`, length 9.", "`9 ÷ 3 = 3`."] },
          { id:"n6", goal:4, star:true, prompt:"Find the reflection of P(3, 7) in the line `3x + 4y - 12 = 0`.",
            parts:["P′ = (", { k:"x" }, ",", { k:"y" }, ")"],
            answer:{ x:-3, y:-1 }, display:"(−3, −1)",
            wrong:[{ when:{ x:0, y:3 }, fb:"That’s the foot F. The reflection is as far past F as P is before it: 2F − P." }],
            why:"F(0, 3), so P′ = 2F − P = (−3, −1).",
            hints:["Find the foot F first.", "F(0, 3) (from Explore).", "P′ = 2F − P = (−3, −1)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Leo", how:"", goal:[2, 3, 4],
        instruction:"Leo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the distance from P(2, 5) to the line `y = 3x - 4`.",
            steps:["Write the line as `3x + y - 4 = 0`.", "Substitute: `3(2) + 5 - 4 = 7`.", "Divide by `√{9 + 1}`: `d = 7/√10`."],
            answer:0,
            stepFb:["", "Step 2 substitutes correctly into step 1’s equation. The mistake is earlier.", "Step 3 follows."],
            fixes:[
              { t:"`3x - y - 4 = 0`, so `d = |6 - 5 - 4|/√10 = 3/√10 = 3√10/10`.", ok:true, why:"Moving `y` to the right side changes its sign." },
              { t:"`3x - y + 4 = 0`.", why:"Check `(0, -4)`: `0 + 4 + 4 ≠ 0`." },
              { t:"`y - 3x - 4 = 0`.", why:"Check `(0, -4)`: `-4 - 0 - 4 ≠ 0`." },
              { t:"Step 1 is correct.", why:M3 }],
            hints:["Does `(0, -4)` satisfy step 1’s equation?", "`0 - 4 - 4 ≠ 0`.", "`3x - y - 4 = 0`."] },
          { id:"e2", goal:3, task:"Find the distance from P(4, 1, −1) to `vec{r} = (1, 0, 1) + t(2, 2, 1)`.",
            steps:["Q(1, 0, 1), so `vec{QP} = (3, 1, -2)`.", "`vec{QP} × vec{m} = (3, 1, -2) × (2, 2, 1) = (5, -7, 4)`.",
              "`|vec{QP} × vec{m}| = √{25 + 49 + 16} = √90 = 3√10`.", "`d = 3√10 ÷ |vec{QP}| = 3√10/√14`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Divide by `|vec{m}| = 3`: `d = √10`.", ok:true, why:M4 },
              { t:"Divide by `|vec{m}|^2 = 9`.", why:"That gives `√10/3`; the height is area ÷ base length, `|vec{m}|`." },
              { t:"Use the dot product instead: `|vec{QP} · vec{m}|/|vec{m}| = 2`.", why:"That’s the shadow along the line, not the distance across." },
              { t:"Step 4 is correct.", why:M4 }],
            hints:["Which side of the parallelogram lies along the line?", "The base is `vec{m}`.", "`3√10 ÷ 3 = √10`."] },
          { id:"e3", goal:4, task:"Find the foot of the perpendicular from P(0, 7) to `vec{r} = (1, 1) + t(1, 2)`.",
            steps:["A point on the line: F = `(1 + t, 1 + 2t)`.", "`vec{PF} = (1 + t, -6 + 2t)`.",
              "`vec{PF} · vec{m} = (1 + t) + 2(-6 + 2t) = 5t - 11 = 0`, so `t = 11/5`.", "So the foot is (11/5, 22/5)."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"F = (1, 1) + (11/5)(1, 2) = (16/5, 27/5).", ok:true, why:M6 },
              { t:"F = (11/5, 11/5).", why:"That isn’t on the line." },
              { t:"`t` should be `-11/5`.", why:"`5t - 11 = 0` gives `t = 11/5`." },
              { t:"Step 4 is correct.", why:"(11/5, 22/5) is `t vec{m}`, which leaves out `vec{r}_0`. " + M6 }],
            hints:["Substitute `t` into the line, not just the direction.", "(1 + 11/5, 1 + 22/5).", "(16/5, 27/5)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the distance graph: that the minimum is where `vec{PF} · vec{m} = 0`, or something else?" },
      { id:"j2", q:"In your own words, why does the R² formula divide by `√{A^2 + B^2}`?" },
      { id:"j3", q:"Explain to a friend how to find the distance from a point to a line in R³, and why you can’t use the R² formula." },
      { id:"j4", q:"Which step still trips you up: rearranging the line, the cross product, or finding the foot? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Find the distance from (1, −2) to `3x - 4y + 4 = 0`.", options:[
          { t:"3", ok:true, why:"`|3 + 8 + 4|/5 = 15/5`." },
          { t:"15", why:"Divide by `√{9 + 16} = 5`. " + M2 },
          { t:"3/5", why:"Divide by 5, not 25." },
          { t:"1/5", why:"Sign slip: `-4(-2) = +8`." }] },
        b:{ prompt:"Find the distance from (2, 3) to `5x + 12y - 7 = 0`.", options:[
          { t:"3", ok:true, why:"`|10 + 36 - 7|/13 = 39/13`." },
          { t:"39", why:M2 },
          { t:"39/169", why:"Divide by 13, not 169." },
          { t:"33/13", why:"Sign slip on `12y`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which expression gives the distance from P to the line `vec{r} = vec{r}_0 + t vec{m}` in R³, where Q is the point `vec{r}_0`?", options:[
          { t:QPxM, ok:true, why:"Parallelogram height = area ÷ base." },
          { t:"`{|vec{QP} · vec{m}|}/{|vec{m}|}`", why:"That’s the projection along the line. " + M4 },
          { t:"`{|vec{QP} × vec{m}|}/{|vec{QP}|}`", why:"The base lying on the line is `vec{m}`. " + M4 },
          { t:"`|vec{QP}|`", why:"Q isn’t usually the closest point. " + M1 }] },
        b:{ prompt:"Which describes the distance from P to a line in R³?", options:[
          { t:"The height of the parallelogram on `vec{QP}` and `vec{m}`: its area `|vec{QP} × vec{m}|` divided by its base `|vec{m}|`.", ok:true, why:"Parallelogram height = area ÷ base." },
          { t:"`|vec{QP}|`, the distance to the point Q on the line.", why:M1 },
          { t:"The scalar projection of `vec{QP}` on `vec{m}`.", why:"That measures along the line. " + M4 },
          { t:"`{|Ax_0 + By_0 + Cz_0 + D|}/{√{A^2 + B^2 + C^2}}` using the line’s scalar equation.", why:"A line in R³ has no single scalar equation; that formula is for planes. " + M7 }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"P is 5 units from a line. Which is true for every point Q on the line?", options:[
          { t:"`|PQ| ≥ 5`, with equality only at the foot of the perpendicular", ok:true, why:"5 is the shortest distance, reached only at the foot." },
          { t:"`|PQ| = 5`", why:"Only one point of the line is 5 away." },
          { t:"`|PQ| ≤ 5`", why:"5 is the least distance, not the greatest." },
          { t:"`|PQ| = 5` at exactly two points", why:"That’s a circle meeting a line, not the closest point." }] },
        b:{ prompt:"F is the foot of the perpendicular from P to a line with direction `vec{m}`. Which is true?", options:[
          { t:"`vec{PF} · vec{m} = 0`, and F is the point of the line closest to P", ok:true, why:"The foot is where the perpendicular meets the line, the closest point." },
          { t:"`vec{PF}` is parallel to `vec{m}`", why:"Then PF would run along the line." },
          { t:"F is always the point `vec{r}_0` in the line’s equation", why:M1 },
          { t:"`vec{PF}` is perpendicular to the line only in R²", why:"It’s perpendicular in R³ too." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Find the foot of the perpendicular from P(4, 3, 6) to `vec{r} = (0, 1, 1) + t(1, 2, 2)`.", options:[
          { t:"(2, 5, 5)", ok:true, why:"`vec{PF} · vec{m} = 9t - 18 = 0`, so `t = 2`." },
          { t:"(2, 4, 4)", why:"That’s `2vec{m}`, without `vec{r}_0`. " + M6 },
          { t:"(0, 1, 1)", why:"That’s `vec{r}_0`. " + M1 },
          { t:"(6, 13, 13)", why:"`t = 18 ÷ |vec{m}| = 6` divides by `|vec{m}|`, not `|vec{m}|^2 = 9`. " + M6 }] },
        b:{ prompt:"Find the foot of the perpendicular from P(5, −1, 1) to `vec{r} = (1, 0, 2) + t(2, 1, -2)`.", options:[
          { t:"(3, 1, 0)", ok:true, why:"`t = 1`." },
          { t:"(2, 1, −2)", why:M6 },
          { t:"(1, 0, 2)", why:M1 },
          { t:"(7, 3, −4)", why:"`t = 9 ÷ 3 = 3` divides by `|vec{m}|`. " + M6 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Find the distance between `3x - 4y + 2 = 0` and `-6x + 8y + 6 = 0`.", options:[
          { t:"1", ok:true, why:"Divide the second by −2: `3x - 4y - 3 = 0`, so `|2 - (-3)|/5 = 1`." },
          { t:"4/5", why:"That uses the constants 2 and 6 without rescaling." },
          { t:"1/2", why:"Rescaled difference 5, but divided by `|(-6, 8)| = 10`." },
          { t:"5", why:"Divide by 5. " + M2 }] },
        b:{ prompt:"Find the distance between `6x + 8y - 5 = 0` and `3x + 4y + 5 = 0`.", options:[
          { t:"3/2", ok:true, why:"Double the second: `6x + 8y + 10 = 0`; `|-5 - 10|/10`." },
          { t:"1", why:"That uses +5 without doubling it: `|-5 - 5|/10`." },
          { t:"3", why:"`15 ÷ 5` mixes the two lines’ scales." },
          { t:"15", why:M2 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Find the distance from P(4, 4, 0) to the line through A(1, 1, 0) and B(3, 2, 2).", options:[
          { t:"3", ok:true, why:"`vec{m} = (2, 1, 2)`, `vec{AP} = (3, 3, 0)`; `vec{AP} × vec{m} = (6, -6, -3)`, length 9; `9 ÷ 3`." },
          { t:"`3√2`", why:"That’s `|AP|`. " + M1 },
          { t:"9", why:"Divide by `|vec{m}| = 3`. " + M4 },
          { t:"1", why:"Divide by `|vec{m}| = 3`, not `|vec{m}|^2 = 9`." }] },
        b:{ prompt:"Find the distance from P(3, 1, 4) to the line through A(0, 1, 1) and B(1, 3, 3).", options:[
          { t:"3", ok:true, why:"`vec{m} = (1, 2, 2)`, `vec{AP} = (3, 0, 3)`; `vec{AP} × vec{m} = (-6, -3, 6)`, length 9; `9 ÷ 3`." },
          { t:"`3√2`", why:"That’s `|AP|`. " + M1 },
          { t:"9", why:"Divide by `|vec{m}| = 3`. " + M4 },
          { t:"1", why:"Divide by `|vec{m}| = 3`, not `|vec{m}|^2 = 9`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `d = {|Ax_0 + By_0 + C|}/{√{A^2 + B^2}}` gives the distance from P(`x_0`, `y_0`) to `Ax + By + C = 0`?", options:[
          { t:"For any point Q on the line, the distance is the length of the projection of `vec{QP}` onto the normal `vec{n} = (A, B)`: `|vec{QP} · vec{n}|/|vec{n}|`, which simplifies to the formula.", ok:true, why:"The perpendicular runs along the normal, so the projection on `vec{n}` measures it." },
          { t:"It’s `|vec{QP}|` for the point Q where `x = 0`.", why:M1 },
          { t:"It projects `vec{QP}` onto the direction of the line.", why:"That measures along the line. " + M5 },
          { t:"It works because `A^2 + B^2` is the slope squared.", why:"The slope is `-A/B`; the denominator is `|vec{n}|`." }] },
        b:{ prompt:"Why does the formula need an absolute value?", options:[
          { t:"`Ax_0 + By_0 + C` is negative for points on one side of the line, but a distance is never negative.", ok:true, why:"The sign tells the side; the distance is its absolute value." },
          { t:"Because `A` or `B` might be negative.", why:"The denominator is already positive; the numerator’s sign shows the side." },
          { t:"Because the square root could be negative.", why:"√ is never negative." },
          { t:"It isn’t needed; a negative distance means below the line.", why:M2 }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which correctly describes how to find the foot F of the perpendicular from P to `vec{r} = vec{r}_0 + t vec{m}`?", options:[
          { t:"Write F = `vec{r}_0 + t vec{m}`, solve `vec{PF} · vec{m} = 0` for `t`, then substitute `t` back into the line.", ok:true, why:"The foot is on the line, and PF is perpendicular to it." },
          { t:"Solve `vec{PF} × vec{m} = vec{0}` for `t`.", why:"That makes PF parallel to the line." },
          { t:"Take F = `vec{r}_0`.", why:M1 },
          { t:"Solve `vec{PF} · vec{m} = 0` for `t`; the foot is `t vec{m}`.", why:M6 }] },
        b:{ prompt:"Which statement about the closest point F on a line to P is correct?", options:[
          { t:"`|PF|` is the distance from P to the line, and `vec{PF} · vec{m} = 0`.", ok:true, why:"F is the foot of the perpendicular." },
          { t:"`|PF| = |vec{QP} × vec{m}|`, with no division needed.", why:M4 },
          { t:"F is where the line crosses the `x`-axis.", why:M1 },
          { t:"`vec{PF}` is parallel to `vec{m}`.", why:"Then PF would run along the line." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"On a map (units: km), a straight pipeline runs along `3x + 4y - 24 = 0`. A farmhouse is at (2, 1). How long is the shortest straight connector pipe?", options:[
          { t:"2.8 km", ok:true, why:"`|6 + 4 - 24|/5 = 14/5`." },
          { t:"14 km", why:M2 },
          { t:"0.56 km", why:"Divide by 5, not 25." },
          { t:"6.8 km", why:"Sign slip: the constant is −24." }] },
        b:{ prompt:"A pipeline runs along `5x + 12y - 60 = 0` and a farmhouse is at (2, 2). Shortest connector?", options:[
          { t:"2 km", ok:true, why:"`|10 + 24 - 60|/13 = 26/13`." },
          { t:"26 km", why:M2 },
          { t:"about 0.15 km", why:"26/169 divides by 169, not 13." },
          { t:"about 10.2 km", why:"That’s the distance to the pipeline’s `x`-intercept (12, 0). " + M1 }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A drone climbs along `vec{r} = (0, 0, 4) + t(1, 2, 2)` (metres). A sensor sits at S(6, 0, 10). What’s the closest the drone’s path comes to the sensor?", options:[
          { t:"6 m", ok:true, why:"`vec{QS} = (6, 0, 6)`; `vec{QS} × vec{m} = (-12, -6, 12)`, length 18; `18 ÷ 3`." },
          { t:"`6√2` m", why:"That’s `|QS|`, from the start point. " + M1 },
          { t:"18 m", why:"Divide by `|vec{m}| = 3`. " + M4 },
          { t:"2 m", why:"Divide by 3, not 9." }] },
        b:{ prompt:"A drone flies along `vec{r} = (1, 0, 0) + t(2, 1, 2)`. A sensor sits at S(1, −3, 6). Closest approach?", options:[
          { t:"6 m", ok:true, why:"`vec{QS} = (0, -3, 6)`; `vec{QS} × vec{m} = (-12, 12, 6)`, length 18; `18 ÷ 3`." },
          { t:"`3√5` m", why:"That’s `|QS|`, from the start point. " + M1 },
          { t:"18 m", why:"Divide by `|vec{m}| = 3`. " + M4 },
          { t:"2 m", why:"Divide by 3, not 9." }] } }
    ]
  },
  task:{
    title:"Five from P", summary:"Five from P",
    statement:"<p>Design a line ℓ: `Ax + By + C = 0` that meets every condition. How many can you find?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>ℓ is exactly 5 units from P(3, 7).</li><li>ℓ is within 3 units of the origin.</li><li>ℓ is neither horizontal nor vertical.</li></ol></div>" +
      "<p class=\"tiny muted\">`A` and `B` are whole numbers from −5 to 5, not both 0; `C` is a whole number from −70 to 70. The graph and both distances update as you go. Multiples of a line count as the same line.</p>",
    checks:["5 units from P(3, 7)", "Within 3 units of the origin", "Not horizontal or vertical"],
    tips:["`d = {|3A + 7B + C|}/{√{A^2 + B^2}}` must equal 5. Pick a normal whose length is a whole number, like `(3, 4)`, so the distance can come out exact.",
      "The distance from the origin is `{|C|}/{√{A^2 + B^2}}`.",
      "`A = 0` makes ℓ horizontal; `B = 0` makes it vertical."],
    explainPrompt:"Explain how you chose `C` once you’d picked the normal `(A, B)`, and why there are two choices of `C` for each normal.",
    vocab:"Use the words normal, distance, absolute value and side.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each is tangent to the circle of radius 5 around P. Every other whole-number tangent line is too far from the origin or parallel to an axis.",
    labels:{ A:"`A`", B:"`B`", C:"`C`", rangeAB:"(−5 to 5)", rangeC:"(−70 to 70)",
      invalid:"Choose whole numbers: `A` and `B` from −5 to 5 (not both 0) and `C` from −70 to 70.",
      circle:"Show the circle", line:"ℓ", dP:"Distance from P(3, 7)", dO:"Distance from O(0, 0)",
      graph:"ℓ in blue, P and the origin; the faint circle has radius 5 around P." }
  },
  cards:[
    ["Shortest distance to a line", "Along the perpendicular, to the foot F, where `vec{PF} · vec{m} = 0`."],
    ["Point to line in R²", "`d = {|Ax_0 + By_0 + C|}/{√{A^2 + B^2}}`."],
    ["Where the R² formula comes from", "The projection of `vec{QP}` onto the normal `(A, B)`."],
    ["Point to line in R³", "`d = {|vec{QP} × vec{m}|}/{|vec{m}|}` (parallelogram height = area ÷ base)."],
    ["Why no R² formula in R³", "A line in R³ has no single scalar equation."],
    ["Foot of the perpendicular", "F = `vec{r}_0 + t vec{m}`; solve `vec{PF} · vec{m} = 0`; substitute `t` back."],
    ["Rearrange first", "`y = 3x - 4` → `3x - y - 4 = 0` before using the formula."],
    ["Normal from a direction (R²)", "Direction `(a, b)` → normal `(b, -a)`."],
    ["Parallel lines in R²", "Match `A` and `B`, then `|C_1 - C_2|/√{A^2 + B^2}`."],
    ["Parallel lines in R³", "The distance from any point of one line to the other line."],
    ["The sign of `Ax_0 + By_0 + C`", "Tells which side of the line P is on; the distance uses its absolute value."],
    ["Reflection in a line", "P′ = 2F − P, where F is the foot."]
  ]
};
