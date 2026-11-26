// MCV4U 59 Distance from a Point to a Plane. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/59-distance-point-to-plane.md
// misconception core sentences (plan §3)
const M1 = "That’s the distance to one point of the plane. The shortest path follows the normal.";
const M2 = "Divide by `|vec{n}| = √{A^2 + B^2 + C^2}`, and take the absolute value.";
const M3 = "Scale one equation so both have the same `(A, B, C)`, then compare `D`s.";
const M4 = "The normal is perpendicular to both directions: use their cross product.";
const M5 = "Project `vec{P_1P_2}` onto `vec{n} = vec{m}_1 × vec{m}_2`, the only direction perpendicular to both lines.";
const M6 = "Substitute `P + tvec{n}` into the plane and solve for `t`. Check that F satisfies the plane.";
const M7 = "Check `vec{m} · vec{n}` first. If it isn’t 0, the line crosses the plane and the distance is 0.";
const FORMULA = "`d = {|Ax_0 + By_0 + Cz_0 + D|}/{√{A^2 + B^2 + C^2}}`";

export default {
  id:"59-distance-point-to-plane",
  kind:"topic",
  title:"Distance from a point to a plane",
  topic:"Distance from a Point to a Plane",
  readyTopic:"distances to planes",
  hero:{
    eq:FORMULA,
    eqLabel:"d equals the absolute value of A x nought plus B y nought plus C z nought plus D, divided by the square root of A squared plus B squared plus C squared",
    eqSize:"md",
    headline:"Straight down the normal",
    text:"The quickest way from a point to a plane is straight along the <strong>normal</strong>: it lands at the <strong>foot of the perpendicular</strong>. Project any path from the plane to the point onto the normal, and you get that shortest distance without finding the foot.",
    fig:{ aria:"A 3D view of the plane 2x + y + 2z − 6 = 0, drawn as its intercept triangle with corners (3, 0, 0), (0, 6, 0) and (0, 0, 3). The point P(3, 3, 3) floats above it. A dashed segment from P to a point wandering over the plane shortens and lengthens, then settles at F(1, 2, 1), where it lines up with the magenta normal and its length label reads 3. Caption: |9| over √9 = 3.", shape:"square" }
  },
  goals:[
    "I can explain why the shortest distance from a point to a plane is along the normal.",
    "I can find the distance from a point to a plane using `|Ax_0 + By_0 + Cz_0 + D|/√{A^2 + B^2 + C^2}`.",
    "I can find the foot of the perpendicular from a point to a plane.",
    "I can find the distance between parallel planes, and from a line parallel to a plane.",
    "I can find the distance between two skew lines using `vec{n} = vec{m}_1 × vec{m}_2`.",
    "I can solve distance problems with planes given in any form, including vector form."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Normals and plane equations", goal:2, prompt:"What is `|vec{n}|` for the plane `2x - y + 2z + 5 = 0`?",
          options:[
            { t:"3", ok:true, why:"`√{4 + 1 + 4} = 3`." },
            { t:"9", why:"That’s `|vec{n}|^2`." },
            { t:"5", why:"`D` isn’t part of the normal." },
            { t:"`√34`", why:"The root takes only `A`, `B` and `C`." }],
          hints:["`vec{n} = (2, -1, 2)`.", "Square, add, take the root.", "3."] },
        { id:"w2", skill:"Normals and plane equations", goal:6, prompt:"Which plane is parallel to `2x - y + 2z + 5 = 0`?",
          options:[
            { t:"`4x - 2y + 4z - 1 = 0`", ok:true, why:"Normal `(4, -2, 4) = 2(2, -1, 2)`." },
            { t:"`2x + y + 2z + 5 = 0`", why:"`(2, 1, 2)` isn’t a multiple of `(2, -1, 2)`." },
            { t:"`x - y + z + 5 = 0`", why:"`(1, -1, 1)` isn’t a multiple." },
            { t:"`-x + 2y - 2z + 5 = 0`", why:"`(-1, 2, -2)` isn’t a multiple of `(2, -1, 2)`." }],
          hints:["Parallel planes have parallel normals.", "Look for a multiple of `(2, -1, 2)`.", "`(4, -2, 4)`."] },
        { id:"w3", skill:"Projection onto a vector", goal:1, prompt:"What is the scalar projection of `(1, 4, 2)` on `(2, 1, 2)`?",
          options:[
            { t:"`10/3`", ok:true, why:"`(2 + 4 + 4)/3`." },
            { t:"10", why:"Divide by `|(2, 1, 2)| = 3`." },
            { t:"`10/9`", why:"That’s the factor for the vector projection." },
            { t:"`√21`", why:"That’s the length, not the shadow." }],
          hints:["`(vec{a} · vec{b})/|vec{b}|`.", "`vec{a} · vec{b} = 10`, `|vec{b}| = 3`.", "`10/3`."] },
        { id:"w4", skill:"Projection onto a vector", goal:1, prompt:"The scalar projection of `vec{QP}` onto a plane’s normal is −4. What does that tell you?",
          options:[
            { t:"P is 4 units from the plane, on the side opposite to `vec{n}`", ok:true, why:"The size is the distance; the sign gives the side." },
            { t:"P is −4 units from the plane", why:"A distance is never negative." },
            { t:"P is on the plane", why:"That would be 0." },
            { t:"P is 16 units away", why:"Don’t square it." }],
          hints:["What does a negative shadow mean?", "It points against `vec{n}`.", "Distance 4, on the far side from `vec{n}`."] },
        { id:"w5", skill:"Cross product", goal:5, prompt:"`(1, 2, 2) × (2, 1, -2) = ?`",
          options:[
            { t:"`(-6, 6, -3)`", ok:true, why:"`(2(-2) - 2(1), 2(2) - 1(-2), 1(1) - 2(2))`." },
            { t:"`(-6, -6, -3)`", why:"`a_3b_1 - a_1b_3 = 4 + 2 = 6`." },
            { t:"`(2, 2, -4)`", why:"That multiplies matching components. The cross product uses the determinant pattern." },
            { t:"`(6, -6, 3)`", why:"That’s `(2, 1, -2) × (1, 2, 2)`." }],
          hints:["Determinant pattern.", "First: `2(-2) - 2(1) = -6`.", "`(-6, 6, -3)`, which is parallel to `(2, -2, 1)`."] },
        { id:"w6", skill:"Cross product", goal:6, prompt:"A plane contains the directions `(1, 1, 0)` and `(0, 1, 1)`. Which vector is normal to it?",
          options:[
            { t:"`(1, -1, 1)`", ok:true, why:"`(1, 1, 0) × (0, 1, 1) = (1, -1, 1)`." },
            { t:"`(1, 1, 0)`", why:"That’s a direction in the plane." },
            { t:"`(1, 2, 1)`", why:"The sum lies in the plane too." },
            { t:"`(0, 1, 0)`", why:"That multiplies matching components. Use the cross product." }],
          hints:["The normal is perpendicular to both directions.", "Use the cross product.", "`(1, -1, 1)`. Check: dot with each direction is 0."] }
      ],
      refreshers:{
        "Normals and plane equations":"`Ax + By + Cz + D = 0` has normal `(A, B, C)` and `|vec{n}| = √{A^2 + B^2 + C^2}`. Parallel planes have parallel normals.",
        "Projection onto a vector":"`(vec{a} · vec{b})/|vec{b}|` is the signed length of `vec{a}`’s shadow on `vec{b}`. Its size is a distance; its sign gives a direction.",
        "Cross product":"`vec{a} × vec{b}` is perpendicular to both `vec{a}` and `vec{b}`. For a plane in vector form, it gives the normal."
      }
    }
  },
  explore:{
    heading:"Drop the perpendicular",
    intro:"Slide the probe across the plane and watch its distance from P. Find the closest spot, then let the formula find it for you.",
    modes:[{ id:"slide", t:"Slide" }, { id:"formula", t:"Formula" }, { id:"parallel", t:"Parallel" }],
    modeHow:{
      slide:"Move the probe Q over the plane with `s` and `t`. The dashed segment PQ turns solid, with a right-angle mark, when `vec{PQ}` lines up with the normal.",
      formula:"The probe is hidden. `vec{QP}` from the intercept Q(3, 0, 0) is drawn in teal; its shadow on the normal is the highlighted band. Move P and watch the band.",
      parallel:"A second plane `2x + y + 2z + D_2 = 0` (orange) sits parallel to π. Change `D_2`, switch on the ×2 view to practise scaling, or add a line parallel to π."
    },
    planeVec:"π: `vec{r} = (3, 0, 0) + s(1, 0, -1) + t(1, -2, 0)`",
    txt:{
      mode:"Mode", pTitle:"Point P", probe:"Probe Q on the plane", par:"Second plane and line",
      d2:"`D_2`", x2:"×2 view", line:"Parallel line", lt:"Point on the line, `t`",
      show:"Show the foot", more:"Show all", less:"Show fewer",
      pHow:"Arrow keys move 1 unit.", stHow:"Arrow keys move 0.5.",
      rows:{ pi:"π", p:"P", q:"Q (probe)", q0:"Q (intercept)", pq:"`|PQ|`", qpv:"`vec{QP}`", dot:"`vec{QP} · vec{n}`", par:"`vec{PQ} ∥ vec{n}`?",
        dist:"Distance (formula)", foot:"Foot F", plane2:"Second plane", planes:"Between the planes", line:"Line", lpt:"Point on the line", lineD:"Line to π",
        pPi:"P to π", pP2:"P to the second plane" },
      shadow:"the shadow on `vec{n}` never changes", yes:"yes: Q is the foot", no:"no",
      footHidden:"find it, or press Show", hidden:"?",
      plus:"positive: P is on the side `vec{n}` points to", minus:"negative: P is on the side opposite `vec{n}`", zero:"0: P is on the plane",
      lineNote:"`(1, 0, -1) · (2, 1, 2) = 0`, so the line is parallel to π", constant:"(constant)",
      halve:"halve it: ", same:"the planes coincide"
    },
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Slide mode, probe at (3, 0, 0). Where on the plane is the probe closest to P?",
        options:[{ t:"Where `vec{PQ}` lines up with the normal", ok:true }, { t:"Where `vec{PQ}` lies along the plane" }, { t:"At (3, 0, 0), the intercept" }, { t:"Where Q is closest to the origin" }],
        explain:"The probe glides to (1, 2, 1) and `|PQ|` drops from 4.24 to 3. The intercept is just a convenient point. The shortest path meets the plane at a right angle." },
      { id:"p2", prompt:"Formula mode, P moved to (0, 0, 0). What’s the distance from the origin to the plane?",
        options:[{ t:"2", ok:true }, { t:"6" }, { t:"−2" }, { t:"`2/3`" }],
        explain:"`|-6|/3 = 2`. The projection band points against `vec{n}`: the negative value means the origin is on the side opposite `vec{n}`." },
      { id:"p3", prompt:"Parallel mode, second plane shown as `4x + 2y + 4z + 6 = 0`. What’s the distance between the planes?",
        options:[{ t:"3", ok:true }, { t:"4" }, { t:"2" }, { t:"9" }],
        explain:"The second equation halves to `2x + y + 2z + 3 = 0`, and the strip of perpendiculars all read 3. Match the normals first: `|-6 - 3|/3 = 3`. Using 6 directly gives the wrong 4." },
      { id:"p4", prompt:"Parallel mode, line `vec{r} = t(1, 0, -1)` on. As the point slides along this line, its distance to π…",
        options:[{ t:"stays at 2", ok:true }, { t:"grows" }, { t:"shrinks to 0" }, { t:"depends on `t`" }],
        explain:"The moving point’s distance readout never changes. `(1, 0, -1) · (2, 1, 2) = 0`, so the line is parallel to π; every point of it is as far as the origin, 2." }
    ],
    chalIntro:"Use the 3D view and the sliders to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Slide mode: move the probe to the foot of the perpendicular from P(3, 3, 3).",
        why:"At `(s, t) = (-1, -1)`, Q = (1, 2, 1) and `vec{PQ} = (-2, -1, -2) = -vec{n}`. The segment meets the plane at a right angle, and `|PQ| = 3`.",
        hints:["Watch the ‘`vec{PQ} ∥ vec{n}`?’ row.", "At P the expression is `9 = 1 × |vec{n}|^2`, so the foot is `P - 1vec{n} = (3, 3, 3) - (2, 1, 2)`.", "`s = -1`, `t = -1`: Q = (1, 2, 1)."],
        msgs:{ mode:"Switch to <strong>Slide</strong> mode first.", p:"Put P back at (3, 3, 3) first.",
          start:"That’s (3, 0, 0), the plane’s starting point, not the closest. " + M1,
          close:"Close. At the foot, `vec{PQ}` is a multiple of `vec{n}`.",
          general:"`|PQ| ≈ #1` there. Find where `vec{PQ}` lines up with `vec{n}`." } },
      { id:"tc2", goal:[2], prompt:"Formula mode: move P so it’s exactly <strong>2</strong> units from π, on the <strong>opposite</strong> side from (3, 3, 3), with `z = 0`.",
        why:"`2x + y + 2z - 6 = -6` with `z = 0` gives `y = -2x`: points such as (0, 0, 0), (1, −2, 0) and (−1, 2, 0). Then `|-6|/3 = 2`, and the negative sign puts P on the far side.",
        hints:["`|2x + y + 2z - 6|/3 = 2`.", "Opposite side means `2x + y + 2z - 6 = -6`.", "With `z = 0`: `2x + y = 0`, e.g. (1, −2, 0)."],
        msgs:{ mode:"Switch to <strong>Formula</strong> mode first.", z:"Keep `z = 0`.",
          same:"2 units away, but on P’s original side. You need a negative value.",
          num:"The numerator is 2: divide by `|vec{n}| = 3`. " + M2,
          general:"Here `2x + y + 2z - 6 = #1`, so P is #2 from π. You want −6." } },
      { id:"tc3", goal:[4], stretch:true, prompt:"Parallel mode: set `D_2` so that P(3, 3, 3) is exactly <strong>halfway</strong> between π and `2x + y + 2z + D_2 = 0`.",
        why:"`D_2 = -24`: the planes are `|-6 + 24|/3 = 6` apart, and P is 3 from each.",
        hints:["P is 3 from π, so the new plane must be 3 from P on P’s other side.", "At P, `2x + y + 2z = 15`. π gives `15 - 6 = 9`; you need `15 + D_2 = -9`.", "`D_2 = -24`: the planes are `|-6 + 24|/3 = 6` apart, and P is 3 from each."],
        msgs:{ mode:"Switch to <strong>Parallel</strong> mode first.", p:"Put P back at (3, 3, 3) first.",
          m12:"The planes are 2 apart and P is 1 from the new plane, not halfway.",
          p12:"That plane is on the far side of π: P is 9 from it.",
          p3:"The new plane is 3 from π, on the other side of π from P. P isn’t between them.",
          general:"P is 3 from π and #1 from the new plane. You need equal distances, with P between the planes." } }
    ]
  },
  part3:{
    slug:"skew-distance", name:"Skew distance",
    heading:"Parallel planes and skew lines",
    intro:"Every distance in this module is a point-to-plane problem in disguise. Step through the three stations: each one ends with a projection onto a normal.",
    stations:[
      { id:"s1", title:"Station 1: parallel planes",
        text:"π₁: `x - 2y + 2z - 3 = 0` and π₂: `2x - 4y + 4z + 12 = 0`.",
        steps:["Halve π₂: `x - 2y + 2z + 6 = 0`.", "`d = |-3 - 6|/3 = 3`.", "Check with a point: (3, 0, 0) is on π₁, and its distance to π₂ is `|3 + 6|/3 = 3`."],
        skip:{ btn:"Skip the halving", fb:"Skipping the halving gives `|-3 - 12|/3 = 5`, which is wrong. The `D`s 12 and −3 belong to equations with different normals, `(2, -4, 4)` and `(1, -2, 2)`. " + M3 },
        say:["The planes π₁ (blue) and π₂ (orange), parallel, with the normal of π₁ in magenta.", "π₂ rewritten as x − 2y + 2z + 6 = 0, with the same normal as π₁.", "The planes are 3 apart.", "A perpendicular from (3, 0, 0) on π₁ to π₂ has length 3."] },
      { id:"s2", title:"Station 2: a line parallel to a plane",
        text:"`L`: `vec{r} = (2, 1, 3) + t(2, 0, -1)` and π₁: `x - 2y + 2z - 3 = 0`.",
        steps:["Check: `(2, 0, -1) · (1, -2, 2) = 0`, so `L ∥ π_1`.", "Distance from (2, 1, 3): `|2 - 2 + 6 - 3|/3 = 1`."],
        slide:"Slide the point along `L`:",
        say:["The plane π₁ (blue) and the line L (teal) with a point on it.", "L is parallel to π₁.", "Every point of L is 1 unit from π₁."] },
      { id:"s3", title:"Station 3: skew lines",
        text:"`L_1`: `vec{r} = (0, 0, 0) + s(1, 2, 2)` and `L_2`: `vec{r} = (2, 0, 5) + t(2, 1, -2)`.",
        steps:["`vec{n} = vec{m}_1 × vec{m}_2 = (-6, 6, -3)`, which is parallel to `(2, -2, 1)`.", "`vec{P_1P_2} = (2, 0, 5)`.", "`d = |vec{P_1P_2} · vec{n}|/|vec{n}| = |4 + 0 + 5|/3 = 3`."],
        shelves:"The 3D view builds the two parallel planes that contain the lines, `2x - 2y + z = 0` (through `L_1`) and `2x - 2y + z = 9` (through `L_2`). Their distance, `9/3 = 3`, is the skew-line distance. The lines are on two parallel shelves; the gap between the shelves is the distance.",
        alg:["`(1, 2, 2) · (2, -2, 1) = 2 - 4 + 2 = 0` and `(2, 1, -2) · (2, -2, 1) = 4 - 2 - 2 = 0`: both directions are perpendicular to `(2, -2, 1)`.",
          "(0, 0, 0) satisfies `2x - 2y + z = 0`, so `L_1` lies in the first shelf.",
          "(2, 0, 5) satisfies `2x - 2y + z = 9`: `4 - 0 + 5 = 9`, so `L_2` lies in the second shelf.",
          "The shelves are `|9 - 0|/3 = 3` apart."],
        say:["The skew lines L₁ (blue) and L₂ (teal).", "The normal (2, −2, 1) in magenta, perpendicular to both lines.", "The vector from P₁(0, 0, 0) to P₂(2, 0, 5).", "Two parallel shelves contain the lines; the common perpendicular between the lines has length 3."] }
    ],
    txt:{ stepOf:"Step #1 of #2", ready:"Press Step to begin.", start:"Setup" },
    quickCheck:{
      title:"Quick check", summary:"Skew distance quick check",
      items:[
        { id:"q1", goal:2, prompt:"Distance from (1, 2, 3) to `x + 2y + 2z - 2 = 0`?",
          choices:[{ t:"3", ok:true, fb:"Right. `|1 + 4 + 6 - 2|/3 = 9/3 = 3`." }, { t:"9", fb:M2 }, { t:"1", fb:"Divide by 3, not 9." }, { t:"`11/3`", fb:"Include `D = -2`." }] },
        { id:"q2", goal:4, prompt:"Distance between `2x - y + 2z = 3` and `4x - 2y + 4z = 18`?",
          choices:[{ t:"2", ok:true, fb:"Right. Halve the second: `2x - y + 2z = 9`, so `|9 - 3|/3 = 2`." }, { t:"5", fb:"Halve the second equation first: `2x - y + 2z = 9`. " + M3 },
            { t:"`5/2`", fb:"Dividing by 6 doesn’t fix it: the constants still come from equations with different normals. Halve the second equation first." }, { t:"6", fb:"Divide by `|vec{n}| = 3`." }] },
        { id:"q3", goal:5, prompt:"For skew lines, the vector to project onto is…",
          choices:[{ t:"`vec{m}_1 × vec{m}_2`", ok:true, fb:"Right. Only the cross product is perpendicular to both lines." }, { t:"`vec{m}_1 + vec{m}_2`", fb:"Only the cross product is perpendicular to both lines." },
            { t:"`vec{m}_1`", fb:"Only the cross product is perpendicular to both lines." }, { t:"`vec{P_1P_2}`", fb:"Only the cross product is perpendicular to both lines. `vec{P_1P_2}` is the vector you project." }] },
        { id:"q4", goal:4, prompt:"A line is parallel to a plane when…",
          choices:[{ t:"`vec{m} · vec{n} = 0`", ok:true, fb:"Right. The direction is perpendicular to the normal, so it runs along the plane." }, { t:"`vec{m} × vec{n} = vec{0}`", fb:"`vec{m} × vec{n} = vec{0}` means the line is perpendicular to the plane." },
            { t:"`vec{m} = vec{n}`", fb:"A line along the normal is perpendicular to the plane." }, { t:"`vec{m} · vec{n} = 1`", fb:"Parallel needs the direction perpendicular to the normal: a dot product of 0." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"calc", type:"numeric", title:"Distance calculator", summary:"Distance calculator", goal:[2, 4, 5, 6],
        instruction:"Find each distance. Type an exact value: a whole number, a fraction or a root, such as 2, 1/3 or 4√3/3.",
        how:"Type √ as “sqrt”, e.g. 4sqrt3/3; 4/√3 is accepted too. Then press Check.",
        items:[
          { id:"d1", goal:2, prompt:"(2, −1, 3) to `2x + y - 2z + 4 = 0`", answer:1 / 3, display:"`1/3`", keypad:"text",
            wrong:[{ match:1, fb:M2 }], why:"`|4 - 1 - 6 + 4|/3 = 1/3`." },
          { id:"d2", goal:2, prompt:"The origin to `6x + 2y - 3z - 14 = 0`", answer:2, display:"2", keypad:"text",
            wrong:[{ match:14, fb:"`|vec{n}| = 7`. " + M2 }], why:"`|-14|/√{36 + 4 + 9} = 14/7 = 2`." },
          { id:"d3", goal:2, prompt:"(1, 1, 1) to `z = 4`", answer:3, display:"3", keypad:"text",
            wrong:[{ match:4, fb:"The plane is `z - 4 = 0`: `|1 - 4|/1`." }], why:"`z - 4 = 0` has `vec{n} = (0, 0, 1)`: `|1 - 4|/1 = 3`." },
          { id:"d4", goal:2, prompt:"(0, 3, −1) to `x - 4y + 8z + 2 = 0`", answer:2, display:"2", keypad:"text",
            wrong:[{ match:18, fb:"`|vec{n}| = 9`. " + M2 }], why:"`|0 - 12 - 8 + 2|/√{1 + 16 + 64} = 18/9 = 2`." },
          { id:"d5", goal:4, prompt:"Between `x + 2y - 2z = 1` and `-2x - 4y + 4z = 16`", answer:3, display:"3", keypad:"text",
            wrong:[{ match:5, fb:"Divide by −2: `x + 2y - 2z = -8`. " + M3 }], why:"`x + 2y - 2z = -8`, so `|1 - (-8)|/3 = 3`." },
          { id:"d6", goal:6, prompt:"(4, 1, 2) to `vec{r} = (1, 0, 0) + s(1, 1, 0) + t(0, 1, 1)`", answer:4 * Math.sqrt(3) / 3, display:"`{4√3}/{3}`", keypad:"text",
            wrong:[{ match:2 * Math.SQRT2, fb:"Normal `(1, 1, 0) × (0, 1, 1) = (1, -1, 1)`. " + M4 }, { match:3 / Math.SQRT2, fb:"Normal `(1, 1, 0) × (0, 1, 1) = (1, -1, 1)`. " + M4 }, { match:4, fb:"Divide by `|vec{n}| = √3`." }],
            why:"Normal `(1, -1, 1)`; the plane is `x - y + z - 1 = 0`; `|4 - 1 + 2 - 1|/√3 = 4/√3 = {4√3}/{3}`.",
            hints:["Find the normal first.", "`(1, -1, 1)`; the plane is `x - y + z - 1 = 0`.", "`|4 - 1 + 2 - 1|/√3 = 4/√3 = {4√3}/{3}`."] },
          { id:"d7", goal:4, prompt:"The line `vec{r} = (1, 2, 3) + t(2, 1, -2)` to `2x - 2y + z + 5 = 0`", answer:2, display:"2", keypad:"text",
            wrong:[{ match:0, fb:"`(2, 1, -2) · (2, -2, 1) = 0`: the line is parallel. " + M7 }, { match:6, fb:M2 }], why:"The line is parallel, so use (1, 2, 3): `|2 - 4 + 3 + 5|/3 = 2`." },
          { id:"d8", goal:5, prompt:"Between the skew lines `vec{r} = (1, 0, 1) + s(1, 2, 2)` and `vec{r} = (0, 3, 1) + t(2, 1, -2)`", answer:8 / 3, display:"`8/3`", keypad:"text",
            wrong:[{ match:Math.sqrt(10), fb:"That’s `|vec{P_1P_2}|`. " + M5 }, { match:8, fb:"Divide by `|vec{n}| = 3`." }],
            why:"`vec{n} ∥ (2, -2, 1)`, `vec{P_1P_2} = (-1, 3, 0)`, so `|-8|/3 = 8/3`.",
            hints:["`vec{n} = vec{m}_1 × vec{m}_2 ∥ (2, -2, 1)`.", "`vec{P_1P_2} = (-1, 3, 0)`; dot with `vec{n}`: −8.", "`|-8|/3 = 8/3`."] }
        ] },
      { id:"beyond", type:"custom", title:"Beyond the formula", summary:"Beyond the formula", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Six non-routine problems. N5 and N6 go beyond the Final Check.",
        how:"Type exact values: whole numbers, fractions such as 13/5, or roots such as 2sqrt3. Answers with two values can go in either order. Then press Check.",
        msgs:{ fill:"Fill in every box first.", fillPt:"Fill in all three coordinates of each point.", err:"Type exact values only, such as 3, −5, 13/5 or 2√3.",
          choose:"Choose a reason too.", reason:"Your distance is right; check the reason.", oneRight:"One answer is right; check the other.", general:"Not yet. Check your work and try again." },
        items:[
          { id:"n1", goal:2, star:true, prompt:"Find both values of `k` for which P(`k`, 1, 2) is 2 units from `2x - y + 2z + 1 = 0`.",
            rows:[{ pre:"`k =`", n:1 }, { pre:"`k =`", n:1 }], unordered:true, answer:[[1], [-5]], display:"`k = 1` or `k = -5`",
            one:"`|2k + 4| = 6` has two cases.", why:"`|2k - 1 + 4 + 1|/3 = 2` gives `|2k + 4| = 6`, so `2k + 4 = 6` or `2k + 4 = -6`." },
          { id:"n2", goal:4, star:true, prompt:"Find both planes parallel to `x + 2y - 2z + 4 = 0` and 3 units from it. Write each as `x + 2y - 2z + D = 0` and enter its `D`.",
            rows:[{ pre:"`D =`", n:1 }, { pre:"`D =`", n:1 }], unordered:true, answer:[[13], [-5]], display:"`x + 2y - 2z + 13 = 0` and `x + 2y - 2z - 5 = 0`",
            wrong:[{ v:[7], fb:"The `D`s differ by `3 × |vec{n}| = 9`." }, { v:[1], fb:"The `D`s differ by `3 × |vec{n}| = 9`." }],
            one:"There are two planes, one on each side.", why:"`|D - 4|/3 = 3`, so `D = 4 ± 9`: 13 or −5." },
          { id:"n3", goal:3, star:true, prompt:"Find the foot of the perpendicular from P(6, −1, 7) to `2x - y + 2z - 9 = 0`, and the reflection of P in the plane.",
            rows:[{ pre:"Foot F", n:3 }, { pre:"Reflection", n:3 }], answer:[[2, 1, 3], [-2, 3, -1]], display:"F(2, 1, 3); reflection (−2, 3, −1)",
            wrong:[{ row:1, v:[2, 1, 3], fb:"The reflection is `2F - P`." }, { row:0, v:[-2, 3, -1], fb:"That’s the reflection. F is halfway between P and its reflection." }],
            why:"The line through P along `vec{n}` reaches the plane at `t = -2`: F(2, 1, 3). The reflection is `2F - P = (-2, 3, -1)`, at `t = -4`.",
            hints:["Line through P along `vec{n}`: `(6 + 2t, -1 - t, 7 + 2t)`.", "Substitute: `18 + 9t = 0`, so `t = -2`.", "F(2, 1, 3); reflection at `t = -4`: (−2, 3, −1)."] },
          { id:"n4", goal:2, star:true, prompt:"The origin is 3 units from `x + 2y + kz - 9 = 0`. Find `k`.",
            rows:[{ pre:"`k =`", n:1 }, { pre:"`k =`", n:1 }], unordered:true, answer:[[2], [-2]], display:"`k = 2` or `k = -2`",
            one:"`k^2 = 4` has two roots.", why:"`9/√{5 + k^2} = 3` gives `5 + k^2 = 9`, so `k^2 = 4`." },
          { id:"n5", goal:6, star:true, prompt:"Find the points on `vec{r} = (1, 0, 0) + t(1, 1, 1)` that are 3 units from `x + 2y + 2z = 0`.",
            rows:[{ pre:"Point 1", n:3 }, { pre:"Point 2", n:3 }], unordered:true, answer:[[13 / 5, 8 / 5, 8 / 5], [-1, -2, -2]], display:"(13/5, 8/5, 8/5) and (−1, −2, −2)",
            one:"`|1 + 5t|/3 = 3` gives `1 + 5t = ±9`.", fb:"`|1 + 5t|/3 = 3` gives `1 + 5t = ±9`.",
            why:"A point of the line is `(1 + t, t, t)`, and `x + 2y + 2z = 1 + 5t`. So `1 + 5t = 9` (`t = 8/5`) or `1 + 5t = -9` (`t = -2`)." },
          { id:"n6", goal:5, star:true, prompt:"Find the distance between `vec{r} = (1, 0, 2) + s(2, 1, -2)` and `vec{r} = (3, 3, 4) + t(2, -2, 1)`, and explain why they never meet.",
            rows:[{ pre:"Distance", n:1 }], answer:[[4]], display:"4",
            wrong:[{ v:[Math.sqrt(17)], fb:"That’s `|vec{P_1P_2}|`. " + M5 }, { v:[12], fb:"Divide by `|(1, 2, 2)| = 3`." }],
            choice:{ label:"Why don’t they meet?", options:[
              { t:"The directions aren’t parallel and the distance isn’t 0, so the lines are skew.", ok:true },
              { t:"The directions are perpendicular, so the lines can’t cross.", fb:"Perpendicular lines can still cross. What matters is that the gap along `vec{n}` isn’t 0." },
              { t:"`|vec{P_1P_2}|` isn’t 0.", fb:"Two different points are always some distance apart; that doesn’t stop the lines meeting elsewhere." }] },
            why:"`vec{m}_1 × vec{m}_2 = (-3, -6, -6) ∥ (1, 2, 2)`; `vec{P_1P_2} = (2, 3, 2)`, and `12/3 = 4`. Non-parallel directions and a non-zero gap: skew.",
            hints:["`vec{m}_1 × vec{m}_2 = (-3, -6, -6) ∥ (1, 2, 2)`.", "`vec{P_1P_2} = (2, 3, 2)`; dot with (1, 2, 2): 12.", "12/3 = 4. Non-parallel directions and a non-zero gap: skew."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Mira", how:"", goal:[4, 5, 6],
        instruction:"Mira made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find the distance between `2x + y - 2z + 3 = 0` and `4x + 2y - 4z - 18 = 0`.",
            steps:["The normals (2, 1, −2) and (4, 2, −4) are parallel, so the planes are parallel.", "`d = |D_1 - D_2|/|vec{n}| = |3 - (-18)|/3 = 7`.", "The planes are 7 units apart."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Halve the second equation first: `2x + y - 2z - 9 = 0`, so `d = |3 - (-9)|/3 = 4`.", ok:true, why:"Now both equations have the normal (2, 1, −2)." },
              { t:"Use `|vec{n}_2| = 6`: `|3 + 18|/6 = 7/2`.", why:"The `D`s still come from equations with different normals." },
              { t:"`|3 - 18|/3 = 5`.", why:"Sign slip, and the scaling problem remains." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Do both equations have the same `(A, B, C)`?", "Divide the second by 2.", "`|3 + 9|/3 = 4`."] },
          { id:"e2", goal:6, task:"Find the distance from P(1, 4, 2) to the plane `vec{r} = (1, 0, 0) + s(2, 1, 0) + t(0, 1, 2)`.",
            steps:["Use a direction vector as the normal: `vec{n} = (2, 1, 0)`.", "Scalar equation: `2x + y + D = 0` through (1, 0, 0), so `D = -2`.", "`d = |2 + 4 - 2|/√5 = 4/√5`."],
            answer:0,
            stepFb:["", "Step 2 follows step 1’s normal. The mistake is earlier.", "Step 3 follows."],
            fixes:[
              { t:"The normal is `(2, 1, 0) × (0, 1, 2) = (2, -4, 2)`, or `(1, -2, 1)`. The plane is `x - 2y + z - 1 = 0`, and `d = |1 - 8 + 2 - 1|/√6 = 6/√6 = √6`.", ok:true, why:"The normal must be perpendicular to both directions." },
              { t:"Use (0, 1, 2) as the normal.", why:"That’s the other direction, also in the plane." },
              { t:"Use `(2, 1, 0) + (0, 1, 2) = (2, 2, 2)`.", why:"The sum also lies in the plane." },
              { t:"Step 1 is correct.", why:M4 }],
            hints:["Is (2, 1, 0) perpendicular to the plane or inside it?", "Inside it. Cross the two directions.", "(1, −2, 1): `d = √6`."] },
          { id:"e3", goal:5, task:"Find the distance between `L_1`: `vec{r} = (1, 1, 0) + s(1, 2, 2)` and `L_2`: `vec{r} = (1, 4, 3) + t(2, 1, -2)`.",
            steps:["`vec{n} = vec{m}_1 × vec{m}_2 = (-6, 6, -3)`, or (2, −2, 1).", "`vec{P_1P_2} = (0, 3, 3)`.", "`d = |vec{P_1P_2}| = 3√2`.", "So the lines are `3√2` apart."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows."],
            fixes:[
              { t:"Project onto `vec{n}`: `d = |(0, 3, 3) · (2, -2, 1)|/3 = |0 - 6 + 3|/3 = 1`.", ok:true, why:"`vec{n}` is the only direction perpendicular to both lines." },
              { t:"Project onto `vec{m}_1`: `|(0, 3, 3) · (1, 2, 2)|/3 = 4`.", why:"That measures along `L_1`. " + M5 },
              { t:"`d = |vec{P_1P_2} × vec{n}|/|vec{n}|`.", why:"That’s the wrong product: you want the part along `vec{n}`." },
              { t:"Step 3 is correct.", why:"(1, 1, 0) and (1, 4, 3) are just two convenient points, not the closest pair. " + M5 }],
            hints:["Step 1 found `vec{n}`. Why?", "`vec{n}` is perpendicular to both lines: project onto it.", "`|-3|/3 = 1`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that `vec{QP} · vec{n}` stayed the same wherever the probe was?" },
      { id:"j2", q:"In your own words, why does the distance formula work with any point Q on the plane?" },
      { id:"j3", q:"Explain to a friend how finding the distance between skew lines is really a point-to-plane problem." },
      { id:"j4", q:"Which case is still shakiest for you: parallel planes, vector-form planes, or skew lines? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Find the distance from (2, −1, 1) to `2x - 2y + z + 3 = 0`.", options:[
          { t:"`10/3`", ok:true, why:"`|4 + 2 + 1 + 3|/3`." },
          { t:"10", why:M2 },
          { t:"`10/9`", why:"Divide by 3, not 9." },
          { t:"2", why:"Sign slip: `-2(-1) = +2`, not −2." }] },
        b:{ prompt:"Find the distance from (1, 3, −2) to `x + 2y - 2z - 4 = 0`.", options:[
          { t:"`7/3`", ok:true, why:"`|1 + 6 + 4 - 4|/3`." },
          { t:"7", why:M2 },
          { t:"`7/9`", why:"Divide by 3." },
          { t:"`1/3`", why:"Sign slip: `-2(-2) = +4`." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which line passes through P(1, 2, 3) and the foot of the perpendicular from P to `2x - y + 3z = 5`?", options:[
          { t:"`vec{r} = (1, 2, 3) + t(2, -1, 3)`", ok:true, why:"The perpendicular runs along the normal." },
          { t:"`vec{r} = (1, 2, 3) + t(1, 2, 3)`", why:"That uses P as the direction." },
          { t:"`vec{r} = (2, -1, 3) + t(1, 2, 3)`", why:"Point and direction swapped." },
          { t:"`vec{r} = (1, 2, 3) + t(1, 2, 0)`", why:"`(1, 2, 0) · (2, -1, 3) = 0`: that line is parallel to the plane and never reaches it." }] },
        b:{ prompt:"Which line passes through P(0, 1, −1) and the foot of the perpendicular from P to `x + 3y - z = 2`?", options:[
          { t:"`vec{r} = (0, 1, -1) + t(1, 3, -1)`", ok:true, why:"The perpendicular runs along the normal (1, 3, −1)." },
          { t:"`vec{r} = (0, 1, -1) + t(0, 1, -1)`", why:"That uses P as the direction." },
          { t:"`vec{r} = (1, 3, -1) + t(0, 1, -1)`", why:"Point and direction swapped." },
          { t:"`vec{r} = (0, 1, -1) + t(1, 0, 1)`", why:"Parallel to the plane: `(1, 0, 1) · (1, 3, -1) = 0`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Find the distance between `x - 2y + 2z = 1` and `x - 2y + 2z = 7`.", options:[
          { t:"2", ok:true, why:"`|7 - 1|/3`." },
          { t:"6", why:M2 },
          { t:"`8/3`", why:"Subtract the constants; don’t add them." },
          { t:"`2/3`", why:"Divide by 3, not 9." }] },
        b:{ prompt:"Find the distance between `2x + y - 2z = -4` and `2x + y - 2z = 5`.", options:[
          { t:"3", ok:true, why:"`|5 - (-4)|/3`." },
          { t:"9", why:M2 },
          { t:"`1/3`", why:"`|-4 + 5|` adds them." },
          { t:"1", why:"Divide by 3, not 9." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Find the foot of the perpendicular from P(3, 4, 6) to `x + 2y + 2z - 5 = 0`.", options:[
          { t:"(1, 0, 2)", ok:true, why:"`(3 + t, 4 + 2t, 6 + 2t)` in the plane: `18 + 9t = 0`, so `t = -2`." },
          { t:"(5, 8, 10)", why:"`t = +2` moves away from the plane. " + M6 },
          { t:"(−3, −8, −6)", why:"`t = -6` divides 18 by `|vec{n}| = 3` instead of `|vec{n}|^2 = 9`. " + M6 },
          { t:"(1, 2, 2)", why:"That’s the normal, not a point." }] },
        b:{ prompt:"Find the foot of the perpendicular from P(5, −1, 5) to `2x - y + 2z - 3 = 0`.", options:[
          { t:"(1, 1, 1)", ok:true, why:"`t = -18/9 = -2`." },
          { t:"(9, −3, 9)", why:"`t = +2` moves away from the plane. " + M6 },
          { t:"(−7, 5, −7)", why:"`t = -6` divides by `|vec{n}|` instead of `|vec{n}|^2`. " + M6 },
          { t:"(2, −1, 2)", why:"That’s the normal." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Find the distance between the skew lines `vec{r} = (0, 1, 0) + s(1, 2, 2)` and `vec{r} = (1, 1, 6) + t(2, 1, -2)`.", options:[
          { t:"`8/3`", ok:true, why:"`vec{n} ∥ (2, -2, 1)`; `vec{P_1P_2} = (1, 0, 6)`; `|2 + 6|/3`." },
          { t:"`√37`", why:"That’s `|vec{P_1P_2}|`. " + M5 },
          { t:"`13/3`", why:"That’s the projection onto `vec{m}_1`. " + M5 },
          { t:"8", why:"Divide by `|vec{n}| = 3`." }] },
        b:{ prompt:"Find the distance between `vec{r} = (2, 0, 1) + s(1, 2, 2)` and `vec{r} = (0, 3, 1) + t(2, 1, -2)`.", options:[
          { t:"`10/3`", ok:true, why:"`vec{P_1P_2} = (-2, 3, 0)`; `|-4 - 6|/3`." },
          { t:"`√13`", why:"That’s `|vec{P_1P_2}|`. " + M5 },
          { t:"`4/3`", why:"That’s the projection onto `vec{m}_1`. " + M5 },
          { t:"10", why:"Divide by `|vec{n}| = 3`." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Find the distance from P(2, 3, 1) to the plane `vec{r} = (1, 0, 1) + s(1, 1, 0) + t(0, 1, -1)`.", options:[
          { t:"`{2√3}/{3}`", ok:true, why:"`vec{n} = (-1, 1, 1)`; the plane is `-x + y + z = 0`; `|-2 + 3 + 1|/√3`." },
          { t:"`2√2`", why:"That uses the direction (1, 1, 0) as the normal. " + M4 },
          { t:"`√10`", why:"That’s the distance to (1, 0, 1). " + M1 },
          { t:"2", why:"Divide by `√3`." }] },
        b:{ prompt:"Find the distance from P(1, 4, 0) to `vec{r} = (0, 1, 1) + s(1, 0, 1) + t(1, 1, 0)`.", options:[
          { t:"`{√3}/{3}`", ok:true, why:"`vec{n} = (-1, 1, 1)`; the plane is `-x + y + z - 2 = 0`; `|-1 + 4 - 2|/√3`." },
          { t:"0", why:"Using (1, 0, 1) as the normal wrongly puts P on the plane. " + M4 },
          { t:"`√11`", why:"That’s the distance to (0, 1, 1). " + M1 },
          { t:"1", why:"Divide by `√3`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of the formula " + FORMULA + "?", options:[
          { t:"“Take any point Q on the plane; the distance is the length of the projection of `vec{QP}` onto the normal, `|vec{QP} · vec{n}|/|vec{n}|`, which simplifies to the formula.”", ok:true, why:"The shadow on the normal is the perpendicular distance, whichever Q you start from." },
          { t:"“It’s `|vec{QP}|` for the plane’s `x`-intercept Q.”", why:M1 },
          { t:"“It projects `vec{QP}` onto a direction vector of the plane.”", why:M4 },
          { t:"“It’s the distance formula between two points, with `D` as a fourth coordinate.”", why:"`D` isn’t a coordinate." }] },
        b:{ prompt:"Why does the formula give the same answer whichever point Q of the plane you use?", options:[
          { t:"“Moving Q within the plane only adds vectors perpendicular to `vec{n}`, which don’t change `vec{QP} · vec{n}`.”", ok:true, why:"Any in-plane step has a dot product of 0 with `vec{n}`." },
          { t:"“Because every point of the plane is the same distance from P.”", why:"`|PQ|` changes as Q moves." },
          { t:"“Because `vec{n}` is a unit vector.”", why:"It usually isn’t; that’s why you divide by `|vec{n}|`." },
          { t:"“It doesn’t; you must use an intercept.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which describes how to find the distance between skew lines `L_1` and `L_2`?", options:[
          { t:"“Find `vec{n} = vec{m}_1 × vec{m}_2`, which is perpendicular to both lines; the distance is the scalar projection of `vec{P_1P_2}` (`P_1` on `L_1`, `P_2` on `L_2`) onto `vec{n}`.”", ok:true, why:"Only `vec{n}` measures straight across from one line to the other." },
          { t:"“Find `|vec{P_1P_2}|`.”", why:M5 },
          { t:"“Project `vec{P_1P_2}` onto `vec{m}_1`.”", why:M5 },
          { t:"“Set the lines’ equations equal; the distance is `|s - t|`.”", why:"Skew lines have no common point to solve for." }] },
        b:{ prompt:"Why does the skew-line method give 0 when the lines actually intersect?", options:[
          { t:"“If they meet, both lines lie in one plane with normal `vec{m}_1 × vec{m}_2`, so `vec{P_1P_2}` lies in that plane and `vec{P_1P_2} · vec{n} = 0`.”", ok:true, why:"A vector inside the plane has no shadow on its normal." },
          { t:"“Because `vec{m}_1 × vec{m}_2 = vec{0}` for intersecting lines.”", why:"That happens for <strong>parallel</strong> lines." },
          { t:"“Because `|vec{P_1P_2}| = 0`.”", why:"The chosen points needn’t be the intersection point." },
          { t:"“It doesn’t; intersecting lines have a positive distance.”", why:"Intersecting lines are 0 apart." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A sloped solar panel lies in the plane `x + 2y + 2z - 12 = 0` (metres). A light sensor hangs at S(3, 4, 5). How far is the sensor from the panel’s plane?", options:[
          { t:"3 m", ok:true, why:"`|3 + 8 + 10 - 12|/3`." },
          { t:"9 m", why:M2 },
          { t:"1 m", why:"Divide by 3, not 9." },
          { t:"about 11.0 m", why:"That’s the distance to the plane’s `x`-intercept (12, 0, 0). " + M1 }] },
        b:{ prompt:"A panel lies in `2x + y + 2z - 10 = 0` and a sensor hangs at S(5, 5, 5) (metres). How far is the sensor from the plane?", options:[
          { t:"5 m", ok:true, why:"`|10 + 5 + 10 - 10|/3`." },
          { t:"15 m", why:M2 },
          { t:"`5/3` m", why:"Divide by 3, not 9." },
          { t:"about 7.1 m", why:"Distance to the intercept (5, 0, 0). " + M1 }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A drone flies along `vec{r} = (0, 0, 10) + t(1, 1, 0)` (metres) over a roof in the plane `2x - 2y + z - 4 = 0`. How close does it ever get to the roof’s plane?", options:[
          { t:"2 m", ok:true, why:"`(1, 1, 0) · (2, -2, 1) = 0`, so the path is parallel; from (0, 0, 10): `|10 - 4|/3`." },
          { t:"6 m", why:M2 },
          { t:"0 m: the path eventually meets the plane", why:"Check `vec{m} · vec{n}`: it’s 0, so it never meets." },
          { t:"`2/3` m", why:"Divide by 3, not 9." }] },
        b:{ prompt:"A drone flies along `vec{r} = (0, 0, 9) + t(2, -1, 0)` (metres) over a roof in `x + 2y - 2z + 6 = 0`. How close does it get?", options:[
          { t:"4 m", ok:true, why:"Parallel: `(2, -1, 0) · (1, 2, -2) = 0`; `|-18 + 6|/3`." },
          { t:"12 m", why:M2 },
          { t:"0 m", why:"Check `vec{m} · vec{n}`: it’s 0, so the path is parallel and never meets the plane." },
          { t:"`4/3` m", why:"Divide by 3, not 9." }] } }
    ]
  },
  task:{
    title:"Two planes, one point", summary:"Two planes, one point",
    statement:"<p>Place a point P(`x`, `y`, `z`) with whole-number coordinates that meets every condition. Can you find them all?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>P is exactly 3 units from π₁: `2x + y + 2z - 6 = 0`.</li><li>P is exactly 1 unit from π₂: `x - 2y + 2z + 1 = 0`.</li><li>P is on the same side of π₁ as the origin.</li></ol></div>" +
      "<p class=\"tiny muted\">Inputs: whole numbers from −5 to 5. The 3D view shows both planes and P, with both distance readouts and the sign of each expression.</p>",
    checks:["3 units from π₁", "1 unit from π₂", "Same side of π₁ as the origin"],
    tips:["Both normals have length 3, so line 1 needs `|2x + y + 2z - 6| = 9`.", "Line 2 needs `x - 2y + 2z + 1 = 3` or −3.", "The origin makes `2x + y + 2z - 6` negative, so you need `2x + y + 2z = -3`."],
    explainPrompt:"Explain how the absolute values in lines 1 and 2 turn into ordinary equations, and why line 3 removes some answers.",
    vocab:"Use the words normal, distance, absolute value and side.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"The conditions pick out two lines: where the plane `2x + y + 2z = -3` meets `x - 2y + 2z = 2` and `x - 2y + 2z = -4`. These are their whole-number points in the box.",
    labels:{ x:"`x`", y:"`y`", z:"`z`", range:"(−5 to 5)", invalid:"Choose whole numbers from −5 to 5 for `x`, `y` and `z`.",
      e1:"π₁ at P: `2x + y + 2z - 6`", e2:"π₂ at P: `x - 2y + 2z + 1`", d1:"Distance to π₁", d2:"Distance to π₂",
      sameO:"same side as the origin", farO:"opposite side from the origin", onP:"on the plane", view:"3D view of π₁ (blue), π₂ (teal) and your point P" }
  },
  cards:[
    ["Shortest distance to a plane", "Along the normal, to the foot of the perpendicular."],
    ["Point to plane", "`d = |Ax_0 + By_0 + Cz_0 + D|/√{A^2 + B^2 + C^2}`."],
    ["Where the formula comes from", "The projection of `vec{QP}` (Q on the plane) onto `vec{n}`."],
    ["Sign of `Ax_0 + By_0 + Cz_0 + D`", "Tells which side of the plane P is on."],
    ["Foot of the perpendicular", "Substitute `P + tvec{n}` into the plane; solve for `t`."],
    ["Reflection in a plane", "`P′ = 2F - P`."],
    ["Parallel planes", "Match the normals, then `|D_1 - D_2|/|vec{n}|`."],
    ["Line parallel to a plane", "`vec{m} · vec{n} = 0`; the distance from any point of the line."],
    ["Line crossing a plane", "`vec{m} · vec{n} ≠ 0`: the distance is 0."],
    ["Vector-form plane", "Normal = cross product of the two directions."],
    ["Skew lines", "`vec{n} = vec{m}_1 × vec{m}_2`; `d = |vec{P_1P_2} · vec{n}|/|vec{n}|`."],
    ["Skew lines as shelves", "Each line lies in one of two parallel planes; the gap between them is the distance."]
  ]
};
