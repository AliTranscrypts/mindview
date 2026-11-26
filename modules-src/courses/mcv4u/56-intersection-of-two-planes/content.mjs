// MCV4U 56 Intersection of Two Planes. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/56-intersection-of-two-planes.md
// misconception core sentences (plan §3)
const N1 = "`vec{n}₁`", N2 = "`vec{n}₂`", NX = "`vec{n}₁ × vec{n}₂`";
const M1 = "Two equations in three unknowns leave one variable free, so non-parallel planes share a whole line.";
const M2 = "Parallel normals give parallel <strong>or</strong> coincident planes. Coincident only if the constant scales by the same factor.";
const M3 = "The line lies in both planes, so its direction is perpendicular to both normals: use " + NX + ".";
const M4 = "The line may never reach `z = 0` (its `z` is constant). Set `x = 0` or `y = 0` instead.";
const M5 = "Same line if the directions are parallel and one line’s point lies on the other.";
const M6 = "The middle component is `a_3 b_1 - a_1 b_3`. Check: `vec{m} · vec{n}₁` should be 0.";
const M7 = "`x = 3` means `x = 3 + 0t`: the direction’s `x`-component is 0, and 3 belongs to the point.";

export default {
  id:"56-intersection-of-two-planes",
  kind:"topic",
  title:"Intersection of two planes",
  topic:"Intersection of Two Planes",
  readyTopic:"the intersection of two planes",
  hero:{
    eq:"`vec{n}₁ × vec{n}₂ = vec{m}`",
    eqLabel:"n 1 cross n 2 equals m, the direction of the line both planes share.",
    eqSize:"md",
    headline:"Two planes, one shared line",
    text:"Two flat planes that aren’t parallel cut each other along a <strong>line of intersection</strong>, like the crease where a wall meets a sloped ceiling. The line lies in both planes, so its direction is perpendicular to both <strong>normals</strong>. If the normals are parallel, the planes are <strong>parallel</strong> or <strong>coincident</strong> instead.",
    fig:{ aria:"3D view: the blue plane x + y + z = 6 and the teal plane x − y + 3z = 2 meet in a line through (4, 2, 0) with direction (−2, 1, 1). The two normals and their cross product (4, −2, −2) are drawn as arrows.", shape:"square" }
  },
  goals:[
    "I can decide from the normals and the equations whether two planes are parallel, coincident or intersecting.",
    "I can find the line of intersection of two planes by elimination, using a parameter.",
    "I can find the direction of the line of intersection with " + NX + ", and a point on it.",
    "I can explain why two planes never meet in exactly one point.",
    "I can check that a point or line lies in both planes and recognise equivalent equations of the same line.",
    "I can solve problems with two planes, such as where their line meets a coordinate plane or choosing a coefficient to get a given configuration."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Normals and parallel vectors", goal:1, prompt:"Which vector is a normal to the plane `2x - 3y + z - 7 = 0`?",
          options:[
            { t:"`(2, -3, 1)`", ok:true, why:"The coefficients of `x`, `y` and `z`." },
            { t:"`(2, 3, 1)`", why:"The `y`-coefficient is −3." },
            { t:"`(2, -3, -7)`", why:"−7 is `D`, not the `z`-coefficient." },
            { t:"`(-3, 2, 1)`", why:"Order is `(A, B, C)`." }],
          hints:["Read the coefficients.", "`A = 2`, `B = -3`, `C = 1`.", "`(2, -3, 1)`."] },
        { id:"w2", skill:"Normals and parallel vectors", goal:1, prompt:"Which vector is parallel to `(2, -4, 6)`?",
          options:[
            { t:"`(-1, 2, -3)`", ok:true, why:"It’s `-1/2` times `(2, -4, 6)`." },
            { t:"`(1, -2, 6)`", why:"Every component must scale by the same number." },
            { t:"`(2, 4, 6)`", why:"−4 became 4, but 2 and 6 didn’t change sign." },
            { t:"`(6, -4, 2)`", why:"Components can’t be reordered." }],
          hints:["Parallel means a scalar multiple.", "Try dividing each component by −2.", "`(-1, 2, -3)`."] },
        { id:"w3", skill:"Cross product", goal:3, prompt:"`(1, 0, 0) × (0, 1, 0)` = ?",
          options:[
            { t:"`(0, 0, 1)`", ok:true, why:"`vec{i} × vec{j} = vec{k}`." },
            { t:"`(0, 0, -1)`", why:"That’s `vec{j} × vec{i}`." },
            { t:"`(0, 0, 0)`", why:"The dot product is 0; the cross product is a vector perpendicular to both." },
            { t:"`(1, 1, 0)`", why:"That’s the sum." }],
          hints:["The result is perpendicular to both.", "Right-hand rule from `x` to `y`.", "`(0, 0, 1)`."] },
        { id:"w4", skill:"Cross product", goal:3, prompt:"`(1, 2, 3) × (1, 0, -1)` = ?",
          options:[
            { t:"`(-2, 4, -2)`", ok:true, why:"`(2(-1) - 3(0), 3(1) - 1(-1), 1(0) - 2(1))`." },
            { t:"`(-2, -4, -2)`", why:"The middle is `a_3 b_1 - a_1 b_3 = 3 + 1 = 4`." },
            { t:"`(1, 0, -3)`", why:"That’s not the cross product." },
            { t:"`(2, -4, 2)`", why:"That’s `(1, 0, -1) × (1, 2, 3)`." }],
          hints:["Use the determinant pattern.", "First: `2(-1) - 3(0) = -2`.", "`(-2, 4, -2)`. Check: dot with `(1, 2, 3)` is `-2 + 8 - 6 = 0`."] },
        { id:"w5", skill:"Lines and 2 × 2 systems", goal:2, prompt:"Which point is on the line `vec{r} = (1, 0, 2) + t(2, 1, -1)`?",
          options:[
            { t:"`(5, 2, 0)`", ok:true, why:"`t = 2`: `(1 + 4, 0 + 2, 2 - 2)`." },
            { t:"`(2, 1, -1)`", why:"That’s the direction vector." },
            { t:"`(3, 1, 3)`", why:"`t = 1` gives `z = 2 - 1 = 1`." },
            { t:"`(3, 0, 2)`", why:"Every coordinate moves with `t`." }],
          hints:["Try a value of `t`.", "`t = 2`.", "`(5, 2, 0)`."] },
        { id:"w6", skill:"Lines and 2 × 2 systems", goal:2, prompt:"Solve `x + y = 5` and `x - y = 1`.",
          options:[
            { t:"`x = 3`, `y = 2`", ok:true, why:"Add: `2x = 6`." },
            { t:"`x = 2`, `y = 3`", why:"Check: `2 - 3 ≠ 1`." },
            { t:"`x = 6`, `y = -1`", why:"`2x = 6` gives `x = 3`." },
            { t:"`x = 3`, `y = -2`", why:"`3 + (-2) ≠ 5`." }],
          hints:["Add the equations.", "`2x = 6`.", "`x = 3`, `y = 2`."] }
      ],
      refreshers:{
        "Normals and parallel vectors":"The normal of `Ax + By + Cz + D = 0` is `(A, B, C)`. Vectors are parallel when one is a scalar multiple of the other, every component scaled by the same number.",
        "Cross product":"`vec{a} × vec{b} = (a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1)` is perpendicular to both. Check by dotting with each.",
        "Lines and 2 × 2 systems":"`vec{r} = vec{r}_0 + t vec{m}`: the point is `vec{r}_0`, the direction is `vec{m}`. Solve two equations by adding or subtracting to eliminate a variable."
      }
    }
  },
  explore:{
    heading:"Two-plane hinge",
    intro:"Tilt the teal plane and watch where it cuts the blue one. The ink line is the line of intersection; the readout gives its equation.",
    modes:[{ id:"hinge", t:"Hinge" }, { id:"build", t:"Build" }, { id:"scale", t:"Scale" }],
    presets:[
      { id:"a", t:"(a) `x + y + z = 6`", n:[1, 1, 1], d:6 },
      { id:"b", t:"(b) `x + 2y - z = 2`", n:[1, 2, -1], d:2 },
      { id:"c", t:"(c) `x - y + 2z = 4`", n:[1, -1, 2], d:4 }],
    hinge:[
      { n:[0, 0, 1], d:4 }, { n:[0, 1, 2], d:8 }, { n:[0, 1, 1], d:4 }, { n:[0, 2, 1], d:4 },
      { n:[0, 1, 0], d:0 }, { n:[0, 2, -1], d:-4 }, { n:[0, 1, -1], d:-4 }, { n:[0, 1, -2], d:-8 }],
    txt:{
      mode:"Mode", view:"View", views:{ iso:"Isometric", front:"Front", side:"Side", top:"Top" },
      viewNote:"Drag the view, or focus it and use the arrow keys, to rotate (Shift + arrows: 15° steps).",
      tilt:"Tilt", tiltNote:"Stop 0 is flat; stop 4 stands upright. The dashed hinge line `(t, 0, 4)` stays in the teal plane.",
      hingeNote:"The blue plane is the floor, `z = 0`.",
      p1:"π₁", p2:"π₂: `Ax + By + Cz + D = 0`", scaleEq:"π₂ = `@a{k}` × (left side of π₁) = `@a{k}` × (constant of π₁) + `s`",
      k:"`@a{k}`", s:"shift `s`",
      showN:"Show normals", showX:"Show " + NX,
      key:"π₁ blue, π₂ teal, the line of intersection thick ink. Normals: " + N1 + " blue, " + N2 + " teal; " + NX + " thick ink.",
      notPlane:"`A`, `B` and `C` can’t all be 0: that isn’t a plane.",
      par:"Parallel: no common points.", coin:"Coincident: every point is shared.",
      rows:{ p1:"π₁", p2:"π₂", nor:"Normals", cross:NX, cfg:"Configuration", pt:"A point on the line", line:"Line" },
      notPar:"not parallel", parallel:"parallel", line:"intersect in a line", parD:"parallel and distinct", coinc:"coincident",
      none:"none", whole:"the whole plane", anyPt:"any point of π₁", using:"using", hidden:"?",
      off:"(outside the ±10 box)"
    },
    predIntro:"Make a prediction first. Then the hinge shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Hinge mode, stop 2. Tilt the teal plane toward flat (stops 1, then 0). What happens to the line of intersection?",
        options:[{ t:"It slides farther away, then disappears when the planes are parallel", ok:true }, { t:"It stays in the same place" }, { t:"It shrinks to a single point" }, { t:"It turns to point a new way" }],
        explain:"The line is where the tilted plane reaches the floor. The flatter it gets, the farther away that is, until a flat plane never reaches the floor at all. " + M1 },
      { id:"p2", prompt:"Build mode: π₁ is `x + y + z - 6 = 0` and π₂ is `2x + 2y + 2z - 12 = 0`. How do these planes meet?",
        options:[{ t:"They’re the same plane (coincident)", ok:true }, { t:"Parallel, no common points" }, { t:"In a line" }, { t:"In a point" }],
        explain:"The whole equation, constant included, is 2 × π₁." },
      { id:"p3", prompt:"Change π₂ to `2x + 2y + 2z - 8 = 0`. Now?",
        options:[{ t:"Parallel, no common points", ok:true }, { t:"Coincident" }, { t:"In a line" }, { t:"In a point" }],
        explain:"The left side doubled, but 2 × 6 = 12, not 8. Parallel normals, different planes. " + M2 },
      { id:"p4", prompt:"Build mode: π₁ is `x + y + z = 6` and π₂ is `x - y = 0`. Which direction will the line of intersection have?",
        options:[{ t:"`(1, 1, -2)`", ok:true }, { t:"`(1, 1, 1)`" }, { t:"`(1, -1, 0)`" }, { t:"`(1, -1, -2)`" }],
        explain:"`(1, 1, 1) × (1, -1, 0) = (1, 1, -2)`. The normals themselves stick out of the planes, so they can’t lie along the line. " + M6 }
    ],
    chalIntro:"Set up the planes, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], prompt:"Build mode, π₁ (a): make the planes parallel but <strong>not</strong> the same plane.",
        why:"`(A, B, C)` is a multiple `k(1, 1, 1)`, so the normals are parallel, and `D ≠ -6k`, so the constant doesn’t scale with it: parallel and distinct.",
        hints:["Parallel planes have parallel normals.", "Try `A = B = C = 2`; then `D = -12` would be the same plane.", "`2x + 2y + 2z - 4 = 0` works."],
        msgs:{ mode:"Switch to Build mode and choose π₁ (a).", notPlane:"`A`, `B` and `C` can’t all be 0: that isn’t a plane.",
          line:"They meet in a line. Make `(A, B, C)` a multiple of `(1, 1, 1)`.", same:"That’s π₁ itself: coincident. Change `D`." } },
      { id:"tc2", goal:[3, 6], prompt:"Build mode, π₁ (c) `x - y + 2z = 4`: set π₂ so the line of intersection has direction `(2, 0, -1)`.",
        why:"`vec{n}₂ · (2, 0, -1) = 0` and " + N2 + " isn’t parallel to " + N1 + ", so " + NX + " is parallel to `(2, 0, -1)`.",
        hints:["The line lies in both planes, so its direction is perpendicular to both normals.", "You need `(A, B, C) · (2, 0, -1) = 0`: `2A = C`.", "`A = 0`, `B = 1`, `C = 0` (the plane `y` = any constant)."],
        msgs:{ mode:"Switch to Build mode and choose π₁ (c).", notPlane:"`A`, `B` and `C` can’t all be 0: that isn’t a plane.",
          normal:"That’s the direction you want, not a normal. The direction must be <strong>perpendicular</strong> to " + N2 + ".",
          par:"Now the planes are parallel or coincident.", other:"The direction is " + NX + ". Check the readout." } },
      { id:"tc3", goal:[5, 6], stretch:true, prompt:"Build mode, π₁ (b) `x + 2y - z = 2`: choose π₂ so the line of intersection passes through `(1, 1, 1)` <strong>and</strong> `(3, 0, 1)`.",
        why:"Both points lie on π₁ and on your π₂, and π₂ isn’t π₁, so the planes share exactly the line through them.",
        hints:["π₂ must contain both points.", "The line’s direction `(2, -1, 0)` is perpendicular to " + N2 + ": `2A - B = 0`.", "The plane `z = 1` contains both points: `A = B = 0`, `C = 1`, `D = -1`."],
        msgs:{ mode:"Switch to Build mode and choose π₁ (b).", notPlane:"`A`, `B` and `C` can’t all be 0: that isn’t a plane.",
          onlyA:"Your plane passes through `(1, 1, 1)` but not `(3, 0, 1)`.", onlyB:"Your plane passes through `(3, 0, 1)` but not `(1, 1, 1)`.",
          same:"That’s π₁ itself. You need a <strong>different</strong> plane through the same line.", general:"π₂ must contain both points." } }
    ]
  },
  part3:{
    slug:"line", name:"Find the line",
    heading:"Find the line",
    intro:"Explore showed you the line. Now produce its equation two ways, see that the answers agree, and meet the case where the usual shortcut fails. Press <strong>Step</strong> to reveal each line of working; the 3D view checks it.",
    labels:{ working:"Check it with algebra", compare:"Compare", compared:"Hide comparison", view:"3D view of the station’s planes" },
    st1:{ title:"Station 1: elimination with a parameter",
      text:"System: `x + y + z = 6`, `x - y + 3z = 2`.",
      steps:[
        { h:"Add the equations:", t:"`2x + 4z = 8`, so `x = 4 - 2z`." },
        { h:"Let `z = t`:", t:"`x = 4 - 2t`, and `y = 6 - x - z = 2 + t`." },
        { h:"Line:", t:"`vec{r} = (4, 2, 0) + t(-2, 1, 1)`." }],
      alg:["Substitute `x = 4 - 2t`, `y = 2 + t`, `z = t` into both planes.",
        "First: `(4 - 2t) + (2 + t) + t = 6`, which simplifies to `6 = 6`.",
        "Second: `(4 - 2t) - (2 + t) + 3t = 2`, which simplifies to `2 = 2`.",
        "Both are true for every `t`: every point of the line lies in both planes."] },
    st2:{ title:"Station 2: the cross-product route",
      text:"Same planes: `x + y + z = 6`, `x - y + 3z = 2`.",
      steps:[
        { h:"Direction:", t:NX + " `= (1, 1, 1) × (1, -1, 3) = (4, -2, -2) ∥ (-2, 1, 1)`." },
        { h:"Point:", t:"set `z = 0`, so `x + y = 6` and `x - y = 2`, giving `(4, 2, 0)`." },
        { h:"Compare:", t:"press <strong>Compare</strong> to lay the station 1 line over this one." }],
      same:"Same line: directions parallel, and `(4, 2, 0)` is on both." },
    st3:{ title:"Station 3: when `z = 0` fails",
      text:"System: `x + y + z = 5`, `x + y - z = 1`.",
      steps:[
        { h:"Try `z = 0`:", t:"`x + y = 5` and `x + y = 1`, which is impossible." },
        { h:"Subtract the equations:", t:"`2z = 4`, so `z = 2` everywhere on the line. The line is horizontal, at height 2." },
        { h:"Direction:", t:"`(1, 1, 1) × (1, 1, -1) = (-2, 2, 0)`." },
        { h:"Set `x = 0` instead:", t:"`y + z = 5`, `y - z = 1`, giving `(0, 3, 2)`." },
        { h:"Line:", t:"`vec{r} = (0, 3, 2) + t(-1, 1, 0)`." }],
      floor:"The line floats at `z = 2` and never touches the floor `z = 0`." },
    quickCheck:{
      title:"Quick check", summary:"Find the line quick check",
      items:[
        { id:"q1", goal:4, prompt:"Two planes with non-parallel normals meet in…",
          choices:[{ t:"a line", ok:true, fb:"Right. Two equations, three unknowns: one variable stays free." }, { t:"a single point", fb:"Two equations, three unknowns: one variable stays free." },
            { t:"two lines", fb:"Two equations, three unknowns: one variable stays free." }, { t:"nothing", fb:"Two equations, three unknowns: one variable stays free." }] },
        { id:"q2", goal:3, prompt:"`vec{n}₁ = (1, 0, 2)`, `vec{n}₂ = (0, 1, -1)`. Direction of the line of intersection?",
          choices:[{ t:"`(-2, 1, 1)`", ok:true, fb:"Right. `(0(-1) - 2(1), 2(0) - 1(-1), 1(1) - 0(0)) = (-2, 1, 1)`." }, { t:"`(1, 1, 1)`", fb:"That’s " + N1 + " + " + N2 + "." },
            { t:"`(2, 1, 1)`", fb:"First component: `0(-1) - 2(1) = -2`." }, { t:"`(0, 0, -2)`", fb:"Multiplying matching components isn’t the cross product." }] },
        { id:"q3", goal:[3, 6], prompt:"`x + y - z = 5` and `x + y + z = 1`. Setting `z = 0` gives `x + y = 5` and `x + y = 1`. What does that mean?",
          choices:[{ t:"The line has no point with `z = 0`; set `x = 0` instead", ok:true, fb:"Right. The normals aren’t parallel, so there is a line, at `z = -2`." },
            { t:"The planes are parallel", fb:"The normals `(1, 1, -1)` and `(1, 1, 1)` aren’t parallel, so there is a line, at `z = -2`." },
            { t:"The planes don’t intersect", fb:"The normals `(1, 1, -1)` and `(1, 1, 1)` aren’t parallel, so there is a line, at `z = -2`." },
            { t:"Every point works", fb:"The normals `(1, 1, -1)` and `(1, 1, 1)` aren’t parallel, so there is a line, at `z = -2`." }] },
        { id:"q4", goal:5, prompt:"Is `(4, 2, 0) + t(-2, 1, 1)` the same line as `(0, 4, 2) + s(2, -1, -1)`?",
          choices:[{ t:"Yes", ok:true, fb:"Right. `(0, 4, 2)` is the first line at `t = 2`, and `(2, -1, -1) = -(-2, 1, 1)`." },
            { t:"No: the points differ", fb:"`(0, 4, 2)` is the first line at `t = 2`, and `(2, -1, -1) = -(-2, 1, 1)`." },
            { t:"No: the directions are opposite", fb:"`(0, 4, 2)` is the first line at `t = 2`, and `(2, -1, -1) = -(-2, 1, 1)`." },
            { t:"Only when `t = s`", fb:"`(0, 4, 2)` is the first line at `t = 2`, and `(2, -1, -1) = -(-2, 1, 1)`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"sorter", title:"Classify the pair", summary:"Classify the pair", goal:1, noun:"pair",
        instruction:"Tap a pair of planes, then tap the box it belongs in.",
        boxes:[{ id:"ln", label:"Intersect in a line" }, { id:"par", label:"Parallel and distinct" }, { id:"coin", label:"Coincident" }],
        wrongDefault:"Compare the normals first, then the constants.",
        items:[
          { id:"i1", t:"`x + 2y - z = 3` and `2x + 4y - 2z = 6`", answer:"coin", why:"The whole equation doubled: `2 × 3 = 6`.",
            wrong:{ par:"Scale the whole equation: the constant matches too." } },
          { id:"i2", t:"`x + 2y - z = 3` and `2x + 4y - 2z = 5`", answer:"par", why:"The left side doubled, but `2 × 3 = 6 ≠ 5`.",
            wrong:{ coin:"The left sides match after scaling, but the constants don’t (6 ≠ 5; −2 × 2 = −4, not 4)." } },
          { id:"i3", t:"`x + 2y - z = 3` and `x - 2y + z = 1`", answer:"ln", why:"`(1, -2, 1)` isn’t a multiple of `(1, 2, -1)`.",
            wrong:{ par:"`(1, -2, 1)` isn’t a multiple of `(1, 2, -1)`: check every component." } },
          { id:"i4", t:"`3x - y + z = 2` and `-6x + 2y - 2z = -4`", answer:"coin", why:"Multiply the first by −2: `-6x + 2y - 2z = -4`, identical.",
            wrong:{ par:"Scale the whole equation: the constant matches too." },
            hints:["Multiply the first equation by −2.", "`-6x + 2y - 2z = -4`.", "Identical: coincident."] },
          { id:"i5", t:"`3x - y + z = 2` and `-6x + 2y - 2z = 4`", answer:"par", why:"The left side is −2 times the first, but `-2 × 2 = -4`, not 4.",
            wrong:{ coin:"The left sides match after scaling, but the constants don’t (6 ≠ 5; −2 × 2 = −4, not 4)." } },
          { id:"i6", t:"`x = 2` and `y = 2`", answer:"ln", why:"The normals `(1, 0, 0)` and `(0, 1, 0)` aren’t parallel: the planes meet in the vertical line `x = 2`, `y = 2`.",
            wrong:{ par:"The normals `(1, 0, 0)` and `(0, 1, 0)` aren’t parallel." } },
          { id:"i7", t:"`z = 1` and `2z = 3`", answer:"par", why:"`2z = 3` is `z = 3/2`: a different horizontal plane.",
            wrong:{ coin:"Scale `z = 1` by 2: `2z = 2`, not 3." } },
          { id:"i8", t:"`x + y = 4` and `y + z = 4`", answer:"ln", why:"The normals `(1, 1, 0)` and `(0, 1, 1)` aren’t multiples.",
            wrong:{ par:"The normals `(1, 1, 0)` and `(0, 1, 1)` aren’t parallel." },
            hints:["Normals `(1, 1, 0)` and `(0, 1, 1)`.", "Not multiples.", "A line."] },
          { id:"i9", t:"`x - y + z = 0` and `4x - 4y + 4z = 0`", answer:"coin", why:"The whole equation times 4, and `4 × 0 = 0`.",
            wrong:{ par:"Scale the whole equation: the constant matches too." } }
        ] },
      { id:"lines", type:"custom", title:"Find the line", summary:"Find the line set", star:true, goal:[2, 3, 6],
        instruction:"Find each line, point or coefficient. Items 3 to 6 are non-routine; 6 goes beyond the Final Check.",
        how:"Type whole numbers or fractions (such as −2 or 1/2) in the boxes, then press Check. Any point on the line and any parallel direction is accepted.",
        msgs:{ fill:"Fill in every box first.", err:"Type whole numbers or fractions only, such as 3, −2 or 1/2.",
          zero:"A direction can’t be `(0, 0, 0)`.",
          dir:"Your direction isn’t parallel to the line. " + M3,
          pt:"Your direction is right, but your point isn’t on the line. Check it in both plane equations.",
          general:"Not yet. Check your work and try again." },
        items:[
          { id:"l1", goal:[2, 3], kind:"line", prompt:"Find the line of intersection of `x + y + z = 4` and `x - y + z = 2`.",
            planes:[[1, 1, 1, 4], [1, -1, 1, 2]],
            answer:{ p:[3, 1, 0], m:[-1, 0, 1] }, display:"`vec{r} = (3, 1, 0) + t(-1, 0, 1)`",
            wrongDir:[{ d:[1, 1, 1], fb:M3 }, { d:[1, -1, 1], fb:M3 }, { d:[2, 0, 2], fb:"Check the middle component of the cross product: `(1, 1, 1) × (1, -1, 1) = (2, 0, -2)`." }],
            why:"`(1, 1, 1) × (1, -1, 1) = (2, 0, -2) ∥ (-1, 0, 1)`; with `z = 0`, `x + y = 4` and `x - y = 2` give `(3, 1, 0)`." },
          { id:"l2", goal:[2, 3], kind:"line", prompt:"Find the line of intersection of `2x + y - z = 1` and `x + y + z = 5`.",
            planes:[[2, 1, -1, 1], [1, 1, 1, 5]],
            answer:{ p:[-4, 9, 0], m:[2, -3, 1] }, display:"`vec{r} = (-4, 9, 0) + t(2, -3, 1)`",
            wrongDir:[{ d:[2, 1, -1], fb:M3 }, { d:[1, 1, 1], fb:M3 }],
            ptFail:"Check your point in <strong>both</strong> equations.",
            why:"`(2, 1, -1) × (1, 1, 1) = (2, -3, 1)`; with `z = 0`, subtracting gives `x = -4`, then `y = 9`." },
          { id:"l3", goal:6, kind:"point", star:true, prompt:"Where does the line of intersection of `x + y + z = 6` and `2x - y + z = 3` cross the `xz`-plane?",
            answer:{ p:[-3, 0, 9] }, display:"`(-3, 0, 9)`",
            wrongPt:[{ p:[3, 3, 0], fb:"That’s where it crosses the `xy`-plane. The `xz`-plane is `y = 0`." }],
            general:"Not yet. The `xz`-plane is `y = 0`: put `y = 0` into both equations and solve.",
            why:"`y = 0`: `x + z = 6` and `2x + z = 3`, so `x = -3` and `z = 9`." },
          { id:"l4", goal:[1, 6], kind:"km", star:true, prompt:"`kx + 2y - z = 1` and `6x + 4y + mz = 3` are parallel. Find `k` and `m`.",
            answer:{ k:3, m:-2 }, display:"`k = 3`, `m = -2`",
            wrongM:[{ m:2, fb:"The `z`-coefficient must scale like the `y`-coefficient: `-1 × 2 = -2`." }],
            general:"Not yet. Parallel means `(6, 4, m)` is a multiple of `(k, 2, -1)`.",
            why:"`(6, 4, m) = 2(k, 2, -1)`, so `k = 3` and `m = -2`.",
            hints:["Parallel means `(6, 4, m) = λ(k, 2, -1)`.", "From the `y`-components, `λ = 2`.", "`k = 3`, `m = -2`."] },
          { id:"l5", goal:[3, 6], kind:"line", star:true, prompt:"Find the line where `3x - 2y + z = 6` meets the `xy`-plane.",
            planes:[[3, -2, 1, 6], [0, 0, 1, 0]],
            answer:{ p:[2, 0, 0], m:[2, 3, 0] }, display:"`vec{r} = (2, 0, 0) + t(2, 3, 0)`",
            wrongDir:[{ d:[3, -2, 1], fb:"That’s the plane’s normal. " + M3 }],
            why:"The `xy`-plane is `z = 0`, normal `(0, 0, 1)`: `(3, -2, 1) × (0, 0, 1) = (-2, -3, 0) ∥ (2, 3, 0)`, and `(2, 0, 0)` is on both." },
          { id:"l6", goal:[3, 6], kind:"kline", star:true, prompt:"`x + y + z = 3` and `x + ky - z = 1` meet in a line parallel to the `xy`-plane. Find `k` and the line.",
            planes:[[1, 1, 1, 3], [1, 1, -1, 1]],
            answer:{ k:1, p:[2, 0, 1], m:[1, -1, 0] }, display:"`k = 1`; `vec{r} = (2, 0, 1) + t(1, -1, 0)`",
            wrongK:[{ k:-1, fb:"With `k = -1` the direction is `(0, 2, -2)`, not horizontal. You need the `z`-component `k - 1 = 0`." }],
            kGeneral:"Not yet. Parallel to the `xy`-plane means the direction’s `z`-component is 0.",
            why:"`(1, 1, 1) × (1, k, -1) = (-1 - k, 2, k - 1)`, so `k = 1`. Subtracting gives `2z = 2`, so `z = 1` and `x + y = 2`.",
            hints:["Parallel to the `xy`-plane means the direction’s `z`-component is 0.", "`(1, 1, 1) × (1, k, -1) = (-1 - k, 2, k - 1)`.", "`k = 1`: subtracting gives `2z = 2`, so `z = 1` and `x + y = 2`: `(2, 0, 1) + t(1, -1, 0)`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Julia", how:"", goal:[1, 2, 3],
        instruction:"Julia made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Find the intersection of `x + 2y + z = 5` and `2x + 4y + 2z = 7`.",
            steps:["`vec{n}₁ = (1, 2, 1)` and `vec{n}₂ = (2, 4, 2)`.", "`vec{n}₂ = 2vec{n}₁`, so the normals are parallel.", "Parallel normals mean the planes are the same plane.", "So every point of `x + 2y + z = 5` is on both planes."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Doubling the first equation gives `2x + 4y + 2z = 10`, not 7: the planes are parallel and distinct, with no common points.", ok:true, why:M2 },
              { t:"The planes meet in a line with direction " + NX + ".", why:NX + " `= vec{0}` for parallel normals: there’s no line." },
              { t:"They meet in one point.", why:M1 },
              { t:"Step 3 is correct.", why:"Check the constants: `2 × 5 ≠ 7`. " + M2 }],
            hints:["Parallel normals allow two cases.", "Compare `2 × 5` with 7.", "Parallel and distinct."] },
          { id:"e2", goal:3, task:"Find the line of intersection of `x + y + z = 5` and `x + y - z = 1`.",
            steps:["Direction: `(1, 1, 1) × (1, 1, -1) = (-2, 2, 0)`.", "For a point, set `z = 0`: `x + y = 5` and `x + y = 1`.", "These contradict each other, so the planes don’t intersect.", "There is no line of intersection."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2’s substitution is correct. Keep checking what she concludes.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The line just never reaches `z = 0` (on it, `z = 2` always). Set `x = 0`: `y + z = 5` and `y - z = 1` give `(0, 3, 2)`, so the line is `(0, 3, 2) + t(-2, 2, 0)`.", ok:true, why:M4 },
              { t:"The planes are parallel.", why:"`(1, 1, 1)` and `(1, 1, -1)` aren’t parallel, and step 1’s cross product isn’t `vec{0}`." },
              { t:"Set `y = 0` and `z = 0` together.", why:"Then you’d have 1 unknown and 2 equations: still inconsistent." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Step 1 found a non-zero direction. What does that tell you?", "The line exists; `z = 0` just isn’t on it.", "Use `x = 0`: `(0, 3, 2)`."] },
          { id:"e3", goal:2, task:"Find the line of intersection of `x - y + z = 2` and `2x + y - z = 7`.",
            steps:["Add the equations: `3x = 9`, so `x = 3`.", "Substitute: `3 - y + z = 2`, so `z = y - 1`.", "Let `y = t`: `x = 3`, `y = t`, `z = t - 1`.", "So the direction vector is `(3, 1, 1)`.", "Line: `vec{r} = (0, 0, -1) + t(3, 1, 1)`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"`x = 3 + 0t`, so the direction is `(0, 1, 1)` and a point is `(3, 0, -1)`: `vec{r} = (3, 0, -1) + t(0, 1, 1)`.", ok:true, why:M7 },
              { t:"The direction is `(1, 1, 1)`.", why:"The `x`-component is 0: `x` doesn’t change." },
              { t:"The direction is `vec{n}₁ = (1, -1, 1)`.", why:M3 },
              { t:"Step 4 is correct.", why:"3 is the constant in `x = 3`, so it belongs to the point. " + M7 }],
            hints:["Write each coordinate as constant + (number)`t`.", "`x = 3 + 0t`, `y = 0 + 1t`, `z = -1 + 1t`.", "`(3, 0, -1) + t(0, 1, 1)`. Check: `(1, -1, 1) × (2, 1, -1) = (0, 3, 3)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the hinge: the line running away as the planes became parallel, or something else?" },
      { id:"j2", q:"In your own words, why can’t two planes meet in exactly one point?" },
      { id:"j3", q:"Explain to a friend how to find the line where two planes meet, including what to do if setting `z = 0` doesn’t work." },
      { id:"j4", q:"Which part still slows you down: the cross product, choosing the variable to set, or checking answers? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How do `x - 2y + 3z = 4` and `-2x + 4y - 6z = 8` intersect?", options:[
          { t:"They’re parallel and distinct", ok:true, why:"`vec{n}₂ = -2vec{n}₁`, but `-2 × 4 = -8 ≠ 8`." },
          { t:"They’re coincident", why:"The left sides are multiples; the constants aren’t. " + M2 },
          { t:"In a line", why:"The normals are parallel, so there’s no line." },
          { t:"In a single point", why:M1 }] },
        b:{ prompt:"How do `3x + y - z = 2` and `6x + 2y - 2z = 4` intersect?", options:[
          { t:"They’re coincident", ok:true, why:"The whole equation doubled." },
          { t:"Parallel and distinct", why:"`2 × 2 = 4`: the constant matches too. " + M2 },
          { t:"In a line", why:"The normals are parallel." },
          { t:"In a single point", why:M1 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which is a direction vector for the line of intersection of `2x - y + z = 1` and `x + y - z = 5`?", options:[
          { t:"`(0, 1, 1)`", ok:true, why:"`(2, -1, 1) × (1, 1, -1) = (0, 3, 3)`." },
          { t:"`(2, -1, 1)`", why:"That’s " + N1 + ". " + M3 },
          { t:"`(3, 0, 0)`", why:"That’s " + N1 + " + " + N2 + ". " + M3 },
          { t:"`(0, -3, 3)`", why:"Middle component: `1(1) - 2(-1) = 3`. " + M6 }] },
        b:{ prompt:"Which is a direction vector for the line of intersection of `x + 2y - z = 3` and `2x - y + z = 0`?", options:[
          { t:"`(1, -3, -5)`", ok:true, why:"`(1, 2, -1) × (2, -1, 1) = (1, -3, -5)`." },
          { t:"`(1, 2, -1)`", why:"That’s " + N1 + ". " + M3 },
          { t:"`(3, 1, 0)`", why:"That’s " + N1 + " + " + N2 + ". " + M3 },
          { t:"`(1, 3, -5)`", why:"Middle component: `(-1)(2) - 1(1) = -3`. " + M6 }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which point lies on the line of intersection of `x + y + z = 6` and `x - y + 3z = 2`?", options:[
          { t:"`(2, 3, 1)`", ok:true, why:"`2 + 3 + 1 = 6` and `2 - 3 + 3 = 2`." },
          { t:"`(3, 3, 0)`", why:"On the first plane only: `3 - 3 + 0 ≠ 2`." },
          { t:"`(2, 0, 0)`", why:"On the second plane only: `2 ≠ 6`." },
          { t:"`(-2, 1, 1)`", why:"That’s a direction vector of the line, not a point on it." }] },
        b:{ prompt:"Which point lies on the line of intersection of `x + y + z = 4` and `x - y + z = 2`?", options:[
          { t:"`(1, 1, 2)`", ok:true, why:"`1 + 1 + 2 = 4` and `1 - 1 + 2 = 2`." },
          { t:"`(2, 2, 0)`", why:"First plane only: `2 - 2 + 0 ≠ 2`." },
          { t:"`(2, 0, 0)`", why:"Second plane only: `2 ≠ 4`." },
          { t:"`(-1, 0, 1)`", why:"That’s a direction vector." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Find the line of intersection of `x + 2y - z = 4` and `2x + y + z = 5`.", options:[
          { t:"`vec{r} = (3, 0, -1) + t(-1, 1, 1)`", ok:true, why:"Adding gives `x + y = 3`; with `y = t`, `x = 3 - t`, `z = t - 1`." },
          { t:"`vec{r} = (4, 0, 0) + t(-1, 1, 1)`", why:"`(4, 0, 0)` is on the first plane only: `8 ≠ 5`." },
          { t:"`vec{r} = (3, 0, -1) + t(1, 2, -1)`", why:"That’s " + N1 + ". " + M3 },
          { t:"`vec{r} = (3, 0, -1) + t(3, 3, 0)`", why:"That’s " + N1 + " + " + N2 + ". " + M3 }] },
        b:{ prompt:"Find the line of intersection of `x + y - z = 1` and `2x - y + z = 5`.", options:[
          { t:"`vec{r} = (2, -1, 0) + t(0, 1, 1)`", ok:true, why:"Adding gives `3x = 6`; then `y = z - 1`." },
          { t:"`vec{r} = (1, 0, 0) + t(0, 1, 1)`", why:"`(1, 0, 0)` is on the first plane only." },
          { t:"`vec{r} = (2, -1, 0) + t(1, 1, -1)`", why:"That’s " + N1 + ". " + M3 },
          { t:"`vec{r} = (2, -1, 0) + t(2, 1, 1)`", why:"`x = 2` is constant: its direction component is 0." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"For which `k` and `m` are `2x - 3y + z = 4` and `kx + 6y - 2z = m` coincident?", options:[
          { t:"`k = -4` and `m = -8`", ok:true, why:"The second must be −2 times the first: `(-4, 6, -2)` and −8." },
          { t:"`k = -4` and `m = 8`", why:"The constant scales by −2 as well." },
          { t:"`k = 4` and `m = 8`", why:"`6 = -2 × (-3)`, so the factor is −2, not 2." },
          { t:"`k = -4` and any `m`", why:"Any other `m` gives parallel, distinct planes. " + M2 }] },
        b:{ prompt:"For which `k` and `m` are `x + 2y - 3z = 5` and `3x + ky - 9z = m` coincident?", options:[
          { t:"`k = 6` and `m = 15`", ok:true, why:"The second must be 3 times the first: `(3, 6, -9)` and 15." },
          { t:"`k = 6` and `m = 5`", why:"The constant scales by 3 too." },
          { t:"`k = -6` and `m = 15`", why:"`-9 = 3 × (-3)`: the factor is 3." },
          { t:"`k = 6` and any `m`", why:"Any other `m` gives parallel, distinct planes. " + M2 }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Where does the line of intersection of `x + y + z = 6` and `2x - y + z = 3` meet the `xy`-plane?", options:[
          { t:"`(3, 3, 0)`", ok:true, why:"`z = 0`: `x + y = 6` and `2x - y = 3`, so `x = 3`, `y = 3`." },
          { t:"`(6, 0, 0)`", why:"That’s the first plane’s `x`-intercept; it isn’t on the second plane." },
          { t:"`(2, 1, 0)`", why:"Those are the first two components of the direction `(2, 1, -3)`." },
          { t:"`(3, -3, 0)`", why:"Sign slip: `2(3) - y = 3` gives `y = 3`." }] },
        b:{ prompt:"Where does the line of intersection of `x + y + z = 4` and `x - y + 2z = 2` meet the `xz`-plane?", options:[
          { t:"`(6, 0, -2)`", ok:true, why:"`y = 0`: `x + z = 4` and `x + 2z = 2`." },
          { t:"`(4, 0, 0)`", why:"The first plane’s `x`-intercept only." },
          { t:"`(3, 0, -2)`", why:"Taken from the direction `(3, -1, -2)`." },
          { t:"`(2, 0, 2)`", why:"Sign slip: subtracting gives `z = -2`." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"A classmate says: “Two planes are like two lines in R²: if they aren’t parallel, they meet in one point.” Which is the best response?", options:[
          { t:"“In R³, two equations in three unknowns leave a free variable, so non-parallel planes share a whole line, with direction " + NX + ".”", ok:true, why:M1 },
          { t:"“That’s right: the point is where the normals cross.”", why:M1 },
          { t:"“Not quite: non-parallel planes never meet.”", why:"They always meet." },
          { t:"“Not quite: they meet in a plane.”", why:"Only coincident planes share a plane." }] },
        b:{ prompt:"Which is the best explanation of why the system `x + y + z = 2`, `x - y + z = 0` can’t have exactly one solution?", options:[
          { t:"“Eliminating a variable leaves one equation in two unknowns, so one variable is free: the solutions form a line, since the planes aren’t parallel.”", ok:true, why:M1 },
          { t:"“Two equations always have exactly one solution.”", why:M1 },
          { t:"“The normals are parallel, so there’s no solution.”", why:"`(1, 1, 1)` and `(1, -1, 1)` aren’t parallel." },
          { t:"“It does: `(1, 1, 0)`.”", why:"`(1, 1, 0)` works, but so does `(0, 1, 1)`: it isn’t the only one." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Two students found the line of intersection of the same planes: `vec{r} = (4, 2, 0) + t(-2, 1, 1)` and `vec{r} = (0, 4, 2) + s(4, -2, -2)`. Which statement is correct?", options:[
          { t:"“Both are right: `(0, 4, 2)` is on the first line (`t = 2`), and `(4, -2, -2) = -2(-2, 1, 1)`.”", ok:true, why:M5 },
          { t:"“Only the first: the points are different.”", why:M5 },
          { t:"“Only the second: its direction is longer.”", why:"Length doesn’t matter; any parallel direction works." },
          { t:"“Neither: the directions point opposite ways, so the lines differ.”", why:M5 }] },
        b:{ prompt:"`vec{r} = (3, 1, 0) + t(-1, 0, 1)` and `vec{r} = (1, 1, 2) + s(2, 0, -2)`. Which statement is correct?", options:[
          { t:"“Both describe the same line: `(1, 1, 2)` is the first line at `t = 2`, and `(2, 0, -2) = -2(-1, 0, 1)`.”", ok:true, why:M5 },
          { t:"“Different lines: the points differ.”", why:M5 },
          { t:"“Only the second is a line; its direction is longer.”", why:"Length doesn’t matter; any parallel direction works." },
          { t:"“Different lines: opposite directions.”", why:M5 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Two roof panels lie in the planes `2y + z = 8` and `-2y + z = 0` (metres, `z` up). Describe the ridge where they meet.", options:[
          { t:"Height 4 m, running parallel to the `x`-axis", ok:true, why:"Adding gives `2z = 8`, so `z = 4` and `y = 2`; the direction `(0, 2, 1) × (0, -2, 1) = (4, 0, 0)`." },
          { t:"Height 8 m", why:"8 is the first panel’s `z`-intercept, not on the second panel." },
          { t:"Height 4 m, running parallel to the `y`-axis", why:"`y = 2` is fixed along the ridge; `x` is free." },
          { t:"The panels are parallel, so there is no ridge", why:"`(0, 2, 1)` and `(0, -2, 1)` aren’t parallel." }] },
        b:{ prompt:"Two roof panels lie in the planes `3x + z = 12` and `-3x + z = 0`. Describe the ridge.", options:[
          { t:"Height 6 m, running parallel to the `y`-axis", ok:true, why:"Adding gives `2z = 12`, so `z = 6` and `x = 2`; the direction `(3, 0, 1) × (-3, 0, 1) = (0, -6, 0)`." },
          { t:"Height 12 m", why:"12 is the first panel’s `z`-intercept, not on the second panel." },
          { t:"Height 6 m, running parallel to the `x`-axis", why:"`x = 2` is fixed along the ridge; `y` is free." },
          { t:"The panels are parallel: no ridge", why:"`(3, 0, 1)` and `(-3, 0, 1)` aren’t parallel." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Two laser sheets light up the planes `x + y + z = 6` and `x - y = 0` (metres; `z` is height above the floor). Where they meet, a line of light forms. How high is it directly above the floor point `(1, 1, 0)`?", options:[
          { t:"4 m", ok:true, why:"The point `(1, 1, z)` is on `x - y = 0`; then `1 + 1 + z = 6`." },
          { t:"6 m", why:"That uses `x = y = 0`." },
          { t:"5 m", why:"That substitutes only `x = 1` and forgets `y`." },
          { t:"−2 m", why:"−2 is the `z`-component of the direction `(1, 1, -2)`, not a height." }] },
        b:{ prompt:"Laser sheets in the planes `x + y + 2z = 10` and `x - y = 0`. How high is the line of light above floor point `(2, 2, 0)`?", options:[
          { t:"3 m", ok:true, why:"`2 + 2 + 2z = 10`." },
          { t:"5 m", why:"Uses `x = y = 0`." },
          { t:"4 m", why:"Substitutes only `x = 2`." },
          { t:"−1 m", why:"The direction is `(1, 1, -1)`; that’s not a height." }] } }
    ]
  },
  task:{
    title:"Horizontal crease", summary:"Horizontal crease",
    statement:"<p>π₁ is `x + y + z = 6`. Design a second plane π₂: `Ax + By + Cz + D = 0` that meets every condition. How many different planes can you find?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>π₂ meets π₁ in a line (not parallel, not the same plane).</li><li>The line passes through P(2, 2, 2).</li><li>The line is horizontal (parallel to the `xy`-plane).</li><li>π₂ isn’t vertical (it isn’t parallel to the `z`-axis).</li></ol></div>" +
      "<p class=\"tiny muted\">`A`, `B` and `C` are whole numbers from −2 to 2; `D` is a whole number from −12 to 12. The 3D preview shows both planes, P and the line of intersection with its direction. Scalar multiples count as the same plane.</p>",
    checks:["Meets π₁ in a line", "The line passes through P(2, 2, 2)", "The line is horizontal", "π₂ isn’t vertical"],
    tips:["If `(A, B, C)` is a multiple of `(1, 1, 1)`, the planes are parallel or the same.",
      "Substitute `(2, 2, 2)` into π₂: `2A + 2B + 2C + D = 0`.",
      "The line’s direction is " + NX + " `= (C - B, A - C, B - A)`. Horizontal means the last component is 0.",
      "A vertical plane has `C = 0`."],
    explainPrompt:"Explain why every answer has `A = B`, and why there’s more than one answer.",
    vocab:"Use the words normal, cross product, direction vector and line of intersection.",
    more:"There’s more than one plane. How many different planes can you find?",
    after3:"Every answer contains the same horizontal line, `x + y = 4` at `z = 2`. The planes through it fan out like pages.",
    afterAll:"With coefficients from −2 to 2, these are all the planes through that line except π₁ itself and the vertical plane `x + y - 4 = 0`.",
    labels:{ A:"`A`", B:"`B`", C:"`C`", D:"`D`", rangeABC:"(−2 to 2)", rangeD:"(−12 to 12)",
      invalid:"Choose whole numbers: `A`, `B` and `C` from −2 to 2 and `D` from −12 to 12.",
      notPlane:"`A`, `B` and `C` can’t all be 0: that isn’t a plane.",
      p1:"π₁", p2:"π₂", dir:"Direction " + NX, cfg:"Configuration", P:"P(2, 2, 2) on π₂?",
      yes:"yes", no:"no", horiz:"horizontal", notHoriz:"not horizontal",
      graph:"3D preview: π₁ blue, π₂ teal, P and the line of intersection in ink" }
  },
  cards:[
    ["Two planes: the three cases", "Intersect in a line; parallel and distinct (no points); coincident (every point)."],
    ["Never one point", "Two equations in three unknowns always leave a free variable."],
    ["Parallel normals", "Parallel <strong>or</strong> coincident: compare the constants after scaling."],
    ["Coincident test", "The <strong>whole</strong> equation is a multiple: `3x + y - z = 2` and `6x + 2y - 2z = 4`."],
    ["Direction of the line", "`vec{m} = vec{n}₁ × vec{n}₂` (perpendicular to both normals)."],
    ["A point on the line", "Set one variable to 0 and solve the 2 × 2 system."],
    ["When `z = 0` fails", "The line is horizontal (constant `z`); set `x = 0` or `y = 0` instead."],
    ["Elimination route", "Eliminate one variable, let a remaining one be `t`, write `x`, `y`, `z` in terms of `t`."],
    ["Same line?", "Directions parallel <strong>and</strong> a point of one lies on the other."],
    ["A line as two planes", "{`x + y + z = 6`, `x - y + 3z = 2`} is the line `(4, 2, 0) + t(-2, 1, 1)`."],
    ["Check your line", "Substitute `x`, `y`, `z` (in terms of `t`) into <strong>both</strong> planes: every `t` must work."],
    ["Planes through one line", "Infinitely many planes share a given line, like pages of an open book."]
  ]
};
