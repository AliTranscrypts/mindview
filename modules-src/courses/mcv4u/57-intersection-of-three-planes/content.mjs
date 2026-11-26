// MCV4U 57 Intersection of Three Planes. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/57-intersection-of-three-planes.md
// Systems are stored as rows [a, b, c, d] meaning ax + by + cz = d (app.js draws and row-reduces them).
// misconception core sentences (plan §3), reused where the plan tags an option with M1–M7
const M1 = "A triangular prism has no parallel planes at all: each pair meets in a line, and the three lines are parallel.";
const M2 = "Zero only rules out <strong>exactly one</strong> point. The planes could still share a line or a whole plane.";
const M3 = "0 = 0 is always true (an equation is redundant). 0 = 5 is never true (no solution).";
const M4 = "A row operation acts on every entry, constants included.";
const M5 = "Only if the normals aren’t coplanar. Otherwise you get infinitely many solutions, or none.";
const M6 = "The three lines can be parallel: that’s the prism.";
const M7 = "Substitute your answer into all three original equations.";
const TP = "`vec{n}_1 · (vec{n}_2 × vec{n}_3)`";
const mn = v => (v < 0 ? "−" + (-v) : String(v));
// augmented matrix as inline HTML (styled .tp-mat in app.css)
const mat = R => '<span class="tp-mat tp-imat" role="img" aria-label="augmented matrix: ' + R.map(r => r.slice(0, 3).map(mn).join(", ") + " bar " + mn(r[3])).join("; ") + '">' +
  R.map(r => '<span class="tp-mr">' + r.slice(0, 3).map(v => "<span>" + mn(v) + "</span>").join("") + '<span class="tp-mb">' + mn(r[3]) + "</span></span>").join("") + "</span>";
// a system of equations, one per line
const sys = eqs => '<span class="tp-sys">' + eqs.map(e => "<span>`" + e + "`</span>").join("") + "</span>";
const FLOW = '<ol class="tp-flow"><li>Compute ' + TP + ". If it’s ≠ 0, the planes meet in <strong>one point</strong>: solve.</li>" +
  "<li>If it’s 0, row-reduce:<ul>" +
  "<li><strong>0 = 0 rows (consistent):</strong> one zero row means a <strong>line</strong> (a sheaf, or two coincident planes and a third crossing). Two zero rows mean a <strong>plane</strong> (all three coincident).</li>" +
  "<li><strong>A 0 = `k` row (inconsistent):</strong> count the parallel pairs. None means a <strong>prism</strong>. One pair means <strong>two parallel planes cut by a third</strong>. All three parallel (and distinct) means <strong>three parallel planes</strong>. Two coincident and one parallel to them is the last case.</li></ul></li></ol>";
const CONFIGS = ["One point", "Sheaf (three distinct planes share a line)", "Two coincident, one crossing", "All three coincident", "Triangular prism", "Two parallel, one crossing", "Three parallel", "Two coincident, one parallel"];

export default {
  id:"57-intersection-of-three-planes",
  kind:"topic",
  title:"Intersection of three planes",
  topic:"Intersection of Three Planes",
  readyTopic:"the intersection of three planes",
  hero:{
    eq:TP + " `≠ 0` ⟺ exactly one common point",
    eqLabel:"n 1 dot the cross product of n 2 and n 3 is not zero, if and only if there is exactly one common point",
    eqSize:"sm",
    headline:"Three planes, eight pictures",
    text:"Three planes might meet at a single <strong>point</strong>, share a <strong>line</strong>, share a whole <strong>plane</strong>, or have <strong>no common point</strong> at all, even when no two of them are parallel. The <strong>normals</strong> tell you whether one point is possible; <strong>elimination</strong> tells you the rest.",
    fig:{ aria:"Three planes in blue, teal and orange meet at the glowing point (1, 2, 3). The orange plane turns about a vertical axis until the point stretches into a line shared by all three, like pages of a book. Then it slides off the line, and the three pairwise lines are parallel: a triangular tunnel with no common point and no two planes parallel.", shape:"wide" }
  },
  goals:[
    "I can name and picture the eight ways three planes can be arranged, and say how many points they share.",
    "I can use " + TP + " to decide whether three planes meet in exactly one point.",
    "I can solve a system of three equations in three unknowns by elimination or row reduction, and find the point of intersection.",
    "I can read a reduced system (a contradiction, a row of zeros, or three pivots) as a configuration.",
    "I can write the line of intersection, using a parameter, when three planes share a line.",
    "I can choose or adjust a plane to create a given configuration and solve problems with three planes."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Triple scalar product", goal:2, prompt:"(1, 0, 0) · [(0, 1, 0) × (0, 0, 1)] = ?",
          options:[
            { t:"1", ok:true, why:"(0, 1, 0) × (0, 0, 1) = (1, 0, 0); dotting with (1, 0, 0) gives 1." },
            { t:"0", why:"The cross product is (1, 0, 0), which is parallel to the first vector." },
            { t:"−1", why:"`vec{j} × vec{k} = +vec{i}`." },
            { t:"(1, 0, 0)", why:"The dot product gives a number." }],
          hints:["Do the cross product first.", "`vec{j} × vec{k} = vec{i}`.", "`vec{i} · vec{i} = 1`."] },
        { id:"w2", skill:"Triple scalar product", goal:2, prompt:"If `vec{a} · (vec{b} × vec{c}) = 0` for non-zero vectors, what must be true?",
          options:[
            { t:"The three vectors are coplanar", ok:true, why:"The parallelepiped they build is flat: volume 0." },
            { t:"All three are perpendicular to each other", why:"Then the volume would be as large as possible, not 0." },
            { t:"All three are parallel", why:"Parallel vectors give 0, but so do many non-parallel coplanar sets." },
            { t:"One of them must be `vec{0}`", why:"The vectors are non-zero; they just lie in one plane." }],
          hints:["`|vec{a} · (vec{b} × vec{c})|` is a volume.", "Volume 0 means flat.", "Coplanar."] },
        { id:"w3", skill:"Two planes", goal:1, prompt:"How do `x + y + z = 6` and `2x + 2y + 2z = 5` meet?",
          options:[
            { t:"They’re parallel and distinct", ok:true, why:"Normals are multiples; 2 × 6 ≠ 5." },
            { t:"They’re coincident", why:"The constant doesn’t scale: 12 ≠ 5." },
            { t:"In a line", why:"Parallel normals give no line." },
            { t:"In a point", why:"Two planes never meet in exactly one point." }],
          hints:["Compare normals.", "(2, 2, 2) = 2(1, 1, 1).", "Constants: 12 vs 5, so parallel and distinct."] },
        { id:"w4", skill:"Two planes", goal:5, prompt:"The line of intersection of `x + y + z = 6` and `x - y + z = 2` is…",
          options:[
            { t:"`(4, 2, 0) + t(-1, 0, 1)`", ok:true, why:"Subtracting gives `y = 2`, then `x + z = 4`." },
            { t:"`(4, 2, 0) + t(1, 1, 1)`", why:"(1, 1, 1) is a normal, not the direction of the line." },
            { t:"`(4, 2, 0) + t(1, -1, 1)`", why:"(1, −1, 1) is the other normal, not the direction of the line." },
            { t:"`(-1, 0, 1) + t(4, 2, 0)`", why:"Point and direction are swapped: (−1, 0, 1) isn’t on the first plane." }],
          hints:["Subtract the equations.", "`2y = 4`, so `y = 2`.", "`x + z = 4`: `(4, 2, 0) + t(-1, 0, 1)`."] },
        { id:"w5", skill:"Elimination", goal:3, prompt:"Solve `x + y + z = 6`, `y + z = 5`, `z = 3`.",
          options:[
            { t:"(1, 2, 3)", ok:true, why:"`z = 3`, `y = 2`, `x = 1`." },
            { t:"(3, 2, 1)", why:"The order is reversed: `z = 3`, not `x`." },
            { t:"(6, 5, 3)", why:"Those are the constants. Back-substitute." },
            { t:"(1, 2, −3)", why:"Sign slip: `z = 3`." }],
          hints:["Start at the bottom.", "`y = 5 - 3`.", "`x = 6 - 2 - 3 = 1`."] },
        { id:"w6", skill:"Elimination", goal:4, prompt:"A system reduces to the row `0x + 0y + 0z = 4`. What does that mean?",
          options:[
            { t:"The system has no solution", ok:true, why:"0 = 4 is never true." },
            { t:"`z = 4`", why:"There’s no `z` left in the row." },
            { t:"Infinitely many solutions", why:"That’s 0 = 0. " + M3 },
            { t:"`x = y = z = 4`", why:"Every coefficient is 0." }],
          hints:["What does the row say?", "0 = 4.", "Impossible, so no solution."] }
      ],
      refreshers:{
        "Triple scalar product":"`vec{a} · (vec{b} × vec{c})` is the signed volume of the parallelepiped on `vec{a}`, `vec{b}`, `vec{c}`. It’s 0 exactly when the vectors are coplanar.",
        "Two planes":"Parallel normals give parallel or coincident planes; otherwise the planes meet in a line with direction `vec{n}_1 × vec{n}_2`.",
        "Elimination":"Eliminate one variable from two pairs of equations, solve the 2 × 2 system, then back-substitute. A row 0 = 0 means a redundant equation; 0 = `k` ≠ 0 means no solution."
      }
    }
  },
  explore:{
    heading:"Three-plane configurator",
    intro:"Explore the eight arrangements, then build them yourself by adjusting the orange plane.",
    modes:[{ id:"gallery", t:"Gallery" }, { id:"adjust", t:"Adjust" }, { id:"rr", t:"Row-reduce" }],
    modeHow:{
      gallery:"Tap a card to open its example: the system, its reduced matrix and the 3D picture.",
      adjust:"π₁ (blue) and π₂ (teal) are fixed and meet in the line `L`, drawn dashed. Move the sliders to change π₃ (orange): `Ax + By + Cz + D = 0`.",
      rr:"The current system (the last Gallery card or your Adjust setting) loads here. Choose a row operation and apply it: the changed plane moves, but the common points stay."
    },
    viewHow:"Drag the view, or focus it and use the arrow keys, to turn it.",
    cards:[
      { id:"one", kind:"point", name:"One point", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [2, 1, -1, 1]], common:"(1, 2, 3)" },
      { id:"sheaf", kind:"sheaf", name:"Sheaf (a line, 3 distinct planes)", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [1, 3, 1, 10]], common:"`(4, 2, 0) + t(-1, 0, 1)`" },
      { id:"coinCross", kind:"coinCross", name:"Two coincident + one crossing", rows:[[1, 1, 1, 6], [2, 2, 2, 12], [1, -1, 1, 2]], common:"same line" },
      { id:"allSame", kind:"allSame", name:"All coincident", rows:[[1, 1, 1, 6], [2, 2, 2, 12], [-1, -1, -1, -6]], common:"the whole plane" },
      { id:"prism", kind:"prism", name:"Triangular prism", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [1, 3, 1, 12]], common:"none" },
      { id:"twoPar", kind:"twoPar", name:"Two parallel + one crossing", rows:[[1, 1, 1, 6], [1, 1, 1, 2], [1, -1, 1, 2]], common:"none" },
      { id:"threePar", kind:"threePar", name:"Three parallel", rows:[[1, 1, 1, 6], [1, 1, 1, 2], [2, 2, 2, 5]], common:"none" },
      { id:"coinPar", kind:"coinPar", name:"Two coincident + one parallel", rows:[[1, 1, 1, 6], [2, 2, 2, 12], [1, 1, 1, 1]], common:"none" }
    ],
    kinds:{ point:"one point", sheaf:"sheaf (a line, 3 distinct planes)", coinCross:"two coincident + one crossing", allSame:"all coincident",
      prism:"triangular prism", twoPar:"two parallel + one crossing", threePar:"three parallel", coinPar:"two coincident + one parallel" },
    rows:{ planes:"π₁, π₂, π₃", tp:TP, par:"Parallel pairs", config:"Configuration", common:"Common points", red:"Reduced matrix" },
    tpYes:"≠ 0: exactly one point", tpNo:"= 0: not exactly one point; check further",
    toggles:{ pairs:"Show pairwise lines", norms:"Show normals", box:"Show " + TP },
    rrOps:[{ id:"swap", t:"Swap rows" }, { id:"mul", t:"Multiply a row" }, { id:"add", t:"Add a multiple" }],
    predIntro:"Make a prediction first. Then the configurator shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Adjust mode, π₃: `x + 3y + z - 10 = 0`. π₃ contains the points (4, 2, 0) and (3, 2, 1), both on the line where π₁ and π₂ meet. How do the three planes meet?",
        options:[{ t:"In a line, like pages of a book", ok:true }, { t:"In one point" }, { t:"Nowhere" }, { t:"In a whole plane" }],
        explain:"π₃ contains two points of `L`, so it contains all of `L`. A zero triple product didn’t mean ‘no solution’ here." },
      { id:"p2", prompt:"Slide `D` to −12 (π₃: `x + 3y + z - 12 = 0`). Now how do they meet?",
        options:[{ t:"Nowhere: they form a triangular prism", ok:true }, { t:"In a line" }, { t:"In one point" }, { t:"Nowhere, because two planes are parallel" }],
        explain:"π₃ is still parallel to `L` but no longer contains it." },
      { id:"p3", prompt:"Row-reduce mode with the One-point card loaded. You apply R₂ → R₂ − R₁. What happens to the common point on screen?",
        options:[{ t:"It stays exactly where it is", ok:true }, { t:"It moves" }, { t:"It disappears" }, { t:"Plane 1 changes" }],
        explain:"Row operations make an equivalent system: different planes, same solution." },
      { id:"p4", prompt:"Adjust mode, π₃ = π₁ + π₂ (`2x + 2z - 8 = 0`). How do the three planes meet?",
        options:[{ t:"In a line", ok:true }, { t:"In one point" }, { t:"Nowhere" }, { t:"π₃ is parallel to π₁" }],
        explain:"Any point on both π₁ and π₂ satisfies their sum, so π₃ contains `L`. Three equations, but only two independent ones." }
    ],
    chalIntro:"Use Adjust mode to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6], prompt:"Adjust mode: set π₃ so the three planes meet in <strong>exactly one</strong> point, and that point is (4, 2, 0).",
        why:"(4, 2, 0) is on π₃, and " + TP + " `= 2A - 2C ≠ 0`, so it’s the only common point.",
        hints:["(4, 2, 0) is on π₁ and π₂, so it just has to be on π₃.", "For exactly one point, " + TP + " `= 2A - 2C ≠ 0`.", "`z = 0`: `A = 0`, `B = 0`, `C = 1`, `D = 0`."],
        msgs:{ mode:"Switch to Adjust mode and set π₃ with the sliders first.", zero:"π₃ needs a normal: `A`, `B` and `C` can’t all be 0.",
          line:"All three planes share the whole line `L`. Tilt π₃ so its normal isn’t perpendicular to (1, 0, −1).",
          other:"They meet in one point, but not at (4, 2, 0). Substitute it into π₃.",
          flat:"Those planes don’t meet in exactly one point: " + TP + " `= 2A - 2C = 0`." } },
      { id:"tc2", goal:[2, 6], prompt:"Adjust mode: make a <strong>triangular prism</strong>.",
        why:"π₃ is parallel to `L` (`A = C`) but misses it, and it isn’t parallel to π₁ or π₂: no common point, no parallel planes.",
        hints:["In a prism each pair meets in a line, and all three lines are parallel.", "Make π₃ parallel to `L` (`A = C`), but not through it, and not parallel to π₁ or π₂.", "`y = 0`: (0, 1, 0, 0)."],
        msgs:{ mode:"Switch to Adjust mode and set π₃ with the sliders first.", zero:"π₃ needs a normal: `A`, `B` and `C` can’t all be 0.",
          p1:"π₃ is parallel to π₁: that’s two parallel planes cut by a third, not a prism.", p2:"π₃ is parallel to π₂.",
          sheaf:"That’s a sheaf. They share `L`.", point:"They meet in one point." } },
      { id:"tc3", goal:[2, 6], stretch:true, prompt:"Adjust mode: make the three planes share a line, with π₃ passing through the origin.",
        why:"`x - 2y + z = 0` contains (4, 2, 0), (3, 2, 1) and (0, 0, 0), so it contains `L` and passes through the origin.",
        hints:["π₁ and π₂ meet in `L`: `y = 2`, `x + z = 4`.", "π₃ must contain (4, 2, 0), (3, 2, 1) and (0, 0, 0).",
          "Through the origin: `Ax + By + Cz = 0`. Then `4A + 2B = 0` and `3A + 2B + C = 0`, so `B = -2A` and `C = A`: `x - 2y + z = 0`."],
        msgs:{ mode:"Switch to Adjust mode and set π₃ with the sliders first.", zero:"π₃ needs a normal: `A`, `B` and `C` can’t all be 0.",
          point:"They meet in one point. For a shared line, π₃ must contain `L`.", sheaf:"That’s a sheaf, but π₃ misses the origin.",
          other:"For a shared line, π₃ must contain `L`; for the origin, `D = 0`." } }
    ]
  },
  part3:{
    slug:"configurations", name:"Configurations",
    heading:"Algebra meets geometry",
    intro:"Each station row-reduces a system while the 3D view shows its planes. Step through it and watch the common points: they never move. Then use the normals to name the exact picture.",
    stations:[
      { id:"st1", title:"Station 1: one point", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [2, 1, -1, 1]],
        text:"The One-point card. Step through the elimination: the dot at (1, 2, 3) stays put through every step.",
        steps:[
          { say:"The system: `x + y + z = 6`, `x - y + z = 2`, `2x + y - z = 1`." },
          { op:{ t:1, s:0, k:-1 }, say:"R₂ → R₂ − R₁: [0 −2 0 | −4]." },
          { op:{ t:2, s:0, k:-2 }, say:"R₃ → R₃ − 2R₁: [0 −1 −3 | −11]." },
          { op:{ t:2, a:2, s:1, k:-1 }, say:"R₃ → 2R₃ − R₂: [0 0 −6 | −18]." },
          { say:"Back-substitute: `z = 3`, `y = 2`, `x = 1`." }],
        alg:["Substitute (1, 2, 3) into all three equations:", "`1 + 2 + 3 = 6` ✓", "`1 - 2 + 3 = 2` ✓", "`2(1) + 2 - 3 = 1` ✓"] },
      { id:"st2", title:"Station 2: when the bottom row vanishes", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [1, 3, 1, 10]],
        text:"The Sheaf card. Watch the bottom row: when it becomes 0 = 0, it no longer draws a plane.",
        steps:[
          { say:"The system: `x + y + z = 6`, `x - y + z = 2`, `x + 3y + z = 10`." },
          { op:{ t:1, s:0, k:-1 }, say:"R₂ − R₁ gives [0 −2 0 | −4]." },
          { op:{ t:2, s:0, k:-1 }, say:"R₃ − R₁ gives [0 2 0 | 4]." },
          { op:{ t:2, s:1, k:1 }, say:"R₃ + R₂ gives [0 0 0 | 0]." },
          { say:"Let `z = t`: `y = 2`, `x = 4 - t`. The line `(4, 2, 0) + t(-1, 0, 1)`." },
          { say:"Which line picture? No two normals are parallel, so it’s a <strong>sheaf</strong>.", normals:true }],
        compare:{ title:"Compare: the “two coincident + one crossing” card", rows:[[1, 1, 1, 6], [2, 2, 2, 12], [1, -1, 1, 2]],
          steps:[
            { say:"The system: `x + y + z = 6`, `2x + 2y + 2z = 12`, `x - y + z = 2`." },
            { op:{ t:1, s:0, k:-2 }, say:"R₂ − 2R₁ gives [0 0 0 | 0]." },
            { op:{ t:2, s:0, k:-1 }, say:"R₃ − R₁ gives [0 −2 0 | −4]." },
            { op:{ sw:[1, 2] }, say:"Swap R₂ and R₃: the same kind of matrix as the sheaf, with one row 0 = 0." },
            { say:"Here two normals and equations are multiples: `2x + 2y + 2z = 12` is 2 × the first equation. The matrix says ‘a line’; the normals say which picture.", normals:true }] } },
      { id:"st3", title:"Station 3: when 0 = 2", rows:[[1, 1, 1, 6], [1, -1, 1, 2], [1, 3, 1, 12]],
        text:"The Prism card. This time the bottom row turns into a contradiction.",
        steps:[
          { say:"The system: `x + y + z = 6`, `x - y + z = 2`, `x + 3y + z = 12`." },
          { op:{ t:1, s:0, k:-1 }, say:"R₂ − R₁ gives [0 −2 0 | −4]." },
          { op:{ t:2, s:0, k:-1 }, say:"R₃ − R₁ gives [0 2 0 | 6]." },
          { op:{ t:2, s:1, k:1 }, say:"R₃ + R₂ gives [0 0 0 | 2], which says 0 = 2: no solution." },
          { say:"No two normals are parallel, so it’s a <strong>prism</strong>.", normals:true }],
        compare:{ title:"Compare: the “two parallel + one crossing” card", rows:[[1, 1, 1, 6], [1, 1, 1, 2], [1, -1, 1, 2]],
          steps:[
            { say:"The system: `x + y + z = 6`, `x + y + z = 2`, `x - y + z = 2`." },
            { op:{ t:1, s:0, k:-1 }, say:"R₂ − R₁ gives [0 0 0 | −4]: the same kind of contradiction." },
            { say:"But here two normals are parallel: (1, 1, 1) and (1, 1, 1). Two parallel planes cut by a third, not a prism. " + M1, normals:true }] } }
    ],
    labels:{ view:"3D view of", main:"the station’s system", cmp:"the comparison system", common:"Common points", normals:"Normals" },
    zeroRow:"R{r} is 0 = 0: true for every point, so it draws no plane.",
    badRow:"R{r} says 0 = {k}: no point satisfies it, so there’s no common point.",
    blocks:[{ title:"Classification flowchart", html:FLOW }],
    quickCheck:{
      title:"Quick check", summary:"Configurations quick check",
      items:[
        { id:"q1", goal:4, prompt:"Reduced matrix: two pivot rows and the row [0 0 0 | 0]. The planes share…",
          choices:[
            { t:"a line", ok:true, fb:"Right. 0 = 0 is redundant, so one variable is free." },
            { t:"one point", fb:"0 = 0 is redundant, so one variable is free." },
            { t:"no points", fb:"0 = 0 is redundant, so one variable is free." },
            { t:"a plane", fb:"0 = 0 is redundant, so one variable is free." }] },
        { id:"q2", goal:2, prompt:TP + " = 0. Which is certain?",
          choices:[
            { t:"They don’t meet in exactly one point", ok:true, fb:"Right. Zero rules out exactly one point, and nothing more." },
            { t:"They have no common point", fb:"Zero allows a line, a plane, or nothing." },
            { t:"Two planes are parallel", fb:"Zero allows a line, a plane, or nothing." },
            { t:"All three coincide", fb:"Zero allows a line, a plane, or nothing." }] },
        { id:"q3", goal:[1, 4], prompt:"The row [0 0 0 | 7] appears and no two normals are parallel. Which configuration?",
          choices:[
            { t:"triangular prism", ok:true, fb:"Right. Inconsistent with no parallel pair: a prism." },
            { t:"three parallel planes", fb:"Inconsistent with no parallel pair: a prism." },
            { t:"a line", fb:"Inconsistent with no parallel pair: a prism." },
            { t:"one point", fb:"Inconsistent with no parallel pair: a prism." }] },
        { id:"q4", goal:1, prompt:"Each pair of three planes meets in a line. Must all three share a point?",
          choices:[
            { t:"No: they could form a prism", ok:true, fb:"Right. The three lines can be parallel." },
            { t:"Yes: three lines always meet", fb:"The three lines can be parallel." },
            { t:"Yes, exactly one point", fb:"The three lines can be parallel." },
            { t:"No: they must be parallel", fb:"The three lines can be parallel." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"System ↔ configuration", summary:"System ↔ configuration", goal:[1, 4],
        instruction:"Match each system to the way its three planes are arranged.",
        how:"Tap a system, then tap its configuration on the right.",
        leftTitle:"System", rightTitle:"Configuration",
        left:[
          { id:"l1", t:sys(["x + 2y - z = 2", "2x - y + z = 2", "x + y + 2z = 4"]), why:"The solution is (1, 1, 1); the triple product (1, 2, −1) · [(2, −1, 1) × (1, 1, 2)] = −12 ≠ 0." },
          { id:"l2", t:sys(["x - y + 2z = 3", "2x + y - z = 1", "3x + z = 4"]), why:"Adding the first two gives the third exactly, and no two normals are parallel." },
          { id:"l3", t:sys(["x - y + 2z = 1", "3x - 3y + 6z = 3", "x + y - z = 4"]), why:"The second equation is 3 × the first; the third crosses them." },
          { id:"l4", t:sys(["2x + y - z = 3", "4x + 2y - 2z = 6", "-2x - y + z = -3"]), why:"Every equation is a multiple of the first." },
          { id:"l5", t:sys(["x + 2y + z = 1", "x - y + 2z = 3", "2x + y + 3z = 7"]), why:"Adding the first two gives `2x + y + 3z = 4`, which contradicts the third, and no two normals are parallel.",
            hints:["Add the first two equations.", "`2x + y + 3z = 4` vs `2x + y + 3z = 7`.", "Inconsistent, no parallel pair: a prism."] },
          { id:"l6", t:sys(["x - 2y + z = 4", "x - 2y + z = 1", "2x + y - z = 0"]), why:"The first two have the same normal but different constants; the third crosses them." },
          { id:"l7", t:sys(["x + y + 3z = 1", "2x + 2y + 6z = 5", "x + y + 3z = -4"]), why:"All three normals are multiples of (1, 1, 3), and no two equations are multiples." },
          { id:"l8", t:sys(["x - y - z = 2", "2x - 2y - 2z = 4", "x - y - z = 9"]), why:"The second is 2 × the first (coincident); the third has the same normal but a different constant." }
        ],
        right:CONFIGS.map((t, i) => ({ id:"r" + (i + 1), t })),
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r5":"Add the first two equations: you get the third exactly. Consistent, so a line.",
          "l5|r2":"Adding the first two gives `2x + y + 3z = 4`, which contradicts `2x + y + 3z = 7`.",
          "l6|r5":"The first two planes have the same normal: they’re parallel.",
          "l3|r2":"The second equation is 3 × the first: those two planes coincide.",
          "l7|r6":"All three normals are multiples of (1, 1, 3)."
        },
        wrongDefault:"Check the triple product, then the parallel pairs." },
      { id:"solve", type:"custom", title:"Solve the system", summary:"Solve the system", star:true, goal:[3, 4, 5, 6],
        instruction:"Solve each system and name what the planes share. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −2/3. For a line, give any point on it and any direction vector.",
        flowTitle:"Classification flowchart", flow:FLOW,
        items:[
          { id:"x1", goal:3, kind:"pt", prompt:"Solve " + sys(["x + y + z = 2", "2x - y + z = 5", "x + 2y - z = -3"]),
            rows:[[1, 1, 1, 2], [2, -1, 1, 5], [1, 2, -1, -3]], answer:{ pt:[1, -1, 2] }, display:"(1, −1, 2)",
            why:"(1, −1, 2) satisfies all three equations: 2, 5 and −3." },
          { id:"x2", goal:3, kind:"pt", prompt:"Solve " + sys(["x + 2y + z = 4", "3x - y + 2z = -3", "2x + y - 3z = -3"]),
            rows:[[1, 2, 1, 4], [3, -1, 2, -3], [2, 1, -3, -3]], answer:{ pt:[-1, 2, 1] }, display:"(−1, 2, 1)",
            wrong:[{ pt:[1, 2, -1], fb:"Sign slip in back-substitution." }],
            why:"(−1, 2, 1) satisfies all three equations: 4, −3 and −3." },
          { id:"x3", goal:[4, 5], star:true, kind:"line", prompt:"Solve " + sys(["x + 2y - z = 3", "2x - y + z = 1", "3x + y = 4"]),
            rows:[[1, 2, -1, 3], [2, -1, 1, 1], [3, 1, 0, 4]], display:"the line `(0, 4, 5) + t(1, -3, -5)`",
            shareLabel:"The planes share",
            chips:[{ t:"one point" }, { t:"a line", ok:true }, { t:"no points", fb:"R₁ + R₂ is exactly R₃: 0 = 0." }, { t:"a plane" }],
            why:"R₁ + R₂ = R₃, so only two independent equations remain: `x = t`, `y = 4 - 3t`, `z = 5 - 5t`, the line `(0, 4, 5) + t(1, -3, -5)`.",
            hints:["Compare R₁ + R₂ with R₃.", "They’re identical, so only two independent equations remain.", "Add the first two: `3x + y = 4`. Let `x = t`: `y = 4 - 3t`, `z = 5 - 5t`."] },
          { id:"x4", goal:[1, 4], star:true, kind:"config", prompt:sys(["x + y - z = 1", "2x - y + z = 2", "3x = 5"]) + "Name the configuration.",
            chips:CONFIGS.map((t, i) => i === 4 ? { t, ok:true } : i === 5 ? { t, fb:"No pair of normals is parallel." } : { t }),
            display:"no solution; a triangular prism",
            why:"R₁ + R₂ gives `3x = 3`, which contradicts `3x = 5`: no solution. No pair of normals is parallel, so it’s a triangular prism." },
          { id:"x5", goal:[4, 6], star:true, kind:"k5", prompt:"For which `k` does " + sys(["x + y + z = 1", "x + 2y + 3z = 2", "x + 3y + kz = 3"]) + "have infinitely many solutions? For which `k` exactly one?",
            boxLabel:"Infinitely many solutions (a line) when `k =`", answer:{ k:5 },
            groups:[
              { id:"one", label:"Exactly one point when", chips:[{ t:"`k ≠ 5`", ok:true }, { t:"`k = 5`" }, { t:"every `k`" }, { t:"no `k`" }] },
              { id:"none", label:"No solution when", chips:[{ t:"no `k`", ok:true }, { t:"`k = 5`", fb:"The last row becomes [0 0 `k − 5` | 0]: 0 = 0 at `k = 5`." }, { t:"`k ≠ 5`" }, { t:"every `k`" }] }],
            display:"`k = 5`: infinitely many (a line); every `k ≠ 5`: one point; no `k` gives none",
            why:"R₃ − 2R₂ after the first two steps gives [0 0 `k − 5` | 0]. At `k = 5` it’s 0 = 0 (a line); otherwise `z = 0` and a single point. The last entry is always 0, so no `k` gives none.",
            hints:["Row-reduce with `k` left in.", "R₂ − R₁: [0 1 2 | 1]; R₃ − R₁: [0 2 `k − 1` | 2].", "R₃ − 2R₂: [0 0 `k − 5` | 0]. `k = 5` gives 0 = 0 (a line); otherwise `z = 0` and a single point."] },
          { id:"x6", goal:[5, 6], star:true, kind:"kline", prompt:"Find `k` so that " + sys(["x + y + z = 1", "x + 2y + 3z = 2", "x + 3y + 5z = k"]) + "has solutions, and give them.",
            rows:[[1, 1, 1, 1], [1, 2, 3, 2], [1, 3, 5, 3]], boxLabel:"`k =`", answer:{ k:3 },
            wrong:[{ k:1, fb:"R₃ − R₁ − 2(R₂ − R₁) gives 0 = `k − 3`." }],
            display:"`k = 3`; the line `(0, 1, 0) + t(1, -2, 1)`",
            why:"R₃ − R₁ − 2(R₂ − R₁) gives 0 = `k − 3`, so `k = 3`. Then `y + 2z = 1` and `x + y + z = 1` give the line `(0, 1, 0) + t(1, -2, 1)`." }
        ],
        msgs:{ err:"Type a whole number or a fraction such as −2/3 in each box.", fill:"Fill in every box first.", chip:"Choose what the planes share first.",
          pt:"Substitute into all three.", fails:"Your point doesn’t satisfy equation {n}.",
          lineP:"Your point isn’t on all three planes: substitute it into each equation.", lineD:"Your direction must be perpendicular to every normal (dot product 0), and not `vec{0}`.",
          chipDefault:"Row-reduce: what does the last row say?", config:"Check the triple product, then the parallel pairs.",
          kBox:"Row-reduce with `k` left in and look at the last row.", kGroup:"Look at the last row [0 0 `k − 5` | 0] for each `k`." } },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Kai", how:"", goal:[2, 3, 4],
        instruction:"Kai made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"How do `x + y + z = 3`, `x - y + 2z = 1` and `2x + 3z = 4` meet?",
            steps:["`vec{n}_2 × vec{n}_3 = (1, -1, 2) × (2, 0, 3) = (-3, 1, 2)`.", "`vec{n}_1 · (-3, 1, 2) = -3 + 1 + 2 = 0`.", "So the planes have no point in common.", "No two normals are parallel, so it’s a triangular prism."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Zero only rules out a single point. Adding the first two equations gives `2x + 3z = 4`, which is the third equation, so all three planes share a line.", ok:true, why:M2 },
              { t:"Zero means exactly one point.", why:"Non-zero means one point." },
              { t:"Zero means two planes are parallel.", why:M1 },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["What does a zero triple product rule out?", "Only the single-point case.", "R₁ + R₂ = R₃: a sheaf."] },
          { id:"e2", goal:3, task:"Solve `x + y + z = 6`, `2x + y - z = 1`, `x - y + 2z = 5`.",
            steps:["R₂ → R₂ − 2R₁: `-y - 3z = -11`.", "R₃ → R₃ − R₁: `-2y + z = -1`.", "R₃ → R₃ − 2R₂: `7z = -23`.", "So `z = -23/7`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"−1 − 2(−11) = −1 + 22 = 21, so `7z = 21` and `z = 3`; then `y = 2` and `x = 1`.", ok:true, why:M4 },
              { t:"−1 − 2(−11) = −23 is right; keep going.", why:"−2 × (−11) = +22." },
              { t:"Use R₃ → R₃ + 2R₂.", why:"That gives `-4y - 5z = -23` and doesn’t eliminate `y`." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Redo the constant column.", "−1 − 2(−11).", "21: `z = 3`, and the solution is (1, 2, 3)."] },
          { id:"e3", goal:4, task:"Solve `x + 2y - z = 1`, `2x + 4y - 2z = 2`, `x - y + z = 4`.",
            steps:["R₂ → R₂ − 2R₁: 0 = 0.", "A row of zeros means the system has no solution.", "So the three planes have no common point."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"0 = 0 is always true, so that equation adds nothing. The two different planes meet in the line `vec{r} = (0, 5, 9) + t(1, -2, -3)`.", ok:true, why:M3 },
              { t:"0 = 0 means exactly one point.", why:"A redundant equation can’t pin down one point." },
              { t:"0 = 0 means all three planes coincide.", why:"`x - y + z = 4` isn’t a multiple of the first equation." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Is 0 = 0 true or false?", "Always true: R₂ is just 2 × R₁.", "Solve the remaining two: adding gives `2x + y = 5`; let `x = t`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: the prism with no parallel planes, or row operations that move planes but not the solution?" },
      { id:"j2", q:"In your own words, what does " + TP + " = 0 tell you, and what doesn’t it tell you?" },
      { id:"j3", q:"Explain to a friend how to go from a reduced matrix to the name of the configuration." },
      { id:"j4", q:"Which configuration is hardest for you to picture? What will you do to fix that?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Three planes form a triangular prism. How many points do all three share?", options:[
          { t:"None", ok:true, why:"Each pair meets in a line, but the three lines are parallel." },
          { t:"Exactly one", why:M5 },
          { t:"Infinitely many, along a line", why:"That’s a sheaf. " + M6 },
          { t:"Exactly three", why:"The pairwise lines don’t meet each other at all." }] },
        b:{ prompt:"Three distinct planes share a common line, like pages of a book. How many points do all three share?", options:[
          { t:"Infinitely many (a line)", ok:true, why:"They share every point of the line." },
          { t:"Exactly one", why:M5 },
          { t:"None", why:"They share the whole line." },
          { t:"Exactly three", why:"A line has infinitely many points." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"A system reduces to " + mat([[1, 2, -1, 3], [0, 1, 4, 2], [0, 0, 0, 6]]) + ". The three planes have…", options:[
          { t:"no common point", ok:true, why:"The last row says 0 = 6." },
          { t:"exactly one common point", why:"There are only two pivots." },
          { t:"a line of common points", why:"That needs 0 = 0. " + M3 },
          { t:"a whole plane in common", why:"That needs two rows of zeros." }] },
        b:{ prompt:"A system reduces to " + mat([[1, -1, 2, 4], [0, 1, -3, 1], [0, 0, 0, 0]]) + ". The three planes have…", options:[
          { t:"a line of common points", ok:true, why:"0 = 0: `z` is free." },
          { t:"no common point", why:M3 },
          { t:"exactly one common point", why:"Only two pivots." },
          { t:"a whole plane in common", why:"Only one zero row." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Normals `vec{n}_1 = (1, 0, 0)`, `vec{n}_2 = (0, 1, 0)`, `vec{n}_3 = (1, 1, k)`. For which `k` do the planes meet in exactly one point?", options:[
          { t:"Every `k ≠ 0`", ok:true, why:"`vec{n}_2 × vec{n}_3 = (k, 0, -1)`, so the triple product is `k`." },
          { t:"Only `k = 0`", why:"`k = 0` makes the triple product 0: the normals are coplanar." },
          { t:"Every `k`", why:M5 },
          { t:"No `k`", why:"Any non-zero `k` works." }] },
        b:{ prompt:"`vec{n}_1 = (1, 1, 0)`, `vec{n}_2 = (0, 1, 1)`, `vec{n}_3 = (1, 0, k)`. For which `k` exactly one point?", options:[
          { t:"Every `k ≠ -1`", ok:true, why:"The triple product is `k + 1`." },
          { t:"Only `k = -1`", why:"`k = -1` makes the triple product 0: the normals are coplanar." },
          { t:"Every `k ≠ 1`", why:"Sign slip: `vec{n}_2 × vec{n}_3 = (k, 1, -1)`." },
          { t:"Every `k`", why:M5 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Solve `x + y + z = 4`, `x - y + 2z = 10`, `2x + y - z = -3`.", options:[
          { t:"(1, −1, 4)", ok:true, why:"It satisfies all three: 4, 10 and −3." },
          { t:"(7, −3, 0)", why:"That satisfies only the first two equations: 14 − 3 − 0 ≠ −3." },
          { t:"(−1, 1, 4)", why:"Sign slip: it fails the second equation. " + M7 },
          { t:"(1, −1, −4)", why:"Sign of `z`: 1 − 1 − 4 ≠ 4. " + M7 }] },
        b:{ prompt:"Solve `x + y + z = 2`, `x - y + 2z = -1`, `2x + y - z = 6`.", options:[
          { t:"(2, 1, −1)", ok:true, why:"It satisfies all three: 2, −1 and 6." },
          { t:"(−1, 2, 1)", why:"Only the first two equations." },
          { t:"(2, −1, 1)", why:"Fails the second: 2 + 1 + 2 ≠ −1. " + M7 },
          { t:"(1, 2, −1)", why:"`x` and `y` swapped: 2 + 2 + 1 ≠ 6." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"π₁: `x + y + z = 3` and π₂: `x - y + z = 1`. Which π₃ makes the three planes form a triangular prism?", options:[
          { t:"`x + 2y + z = 5`", ok:true, why:"Its normal is perpendicular to (1, 0, −1), so it’s parallel to π₁ ∩ π₂ (`y = 1`, `x + z = 2`). But it gives `x + z = 3 ≠ 2`, so it misses the line." },
          { t:"`x + 2y + z = 4`", why:"That one contains the line: a sheaf." },
          { t:"`x + y + z = 5`", why:"Parallel to π₁: two parallel planes cut by a third. " + M1 },
          { t:"`x + 2y + 2z = 4`", why:"Its normal isn’t perpendicular to (1, 0, −1): one point." }] },
        b:{ prompt:"π₁: `x + y + z = 6` and π₂: `x - y + z = 2`. Which π₃ makes a triangular prism?", options:[
          { t:"`3x + y + 3z = 10`", ok:true, why:"Parallel to `L`, but 3(4) + 2 = 14 ≠ 10." },
          { t:"`3x + y + 3z = 14`", why:"Contains `L`: a sheaf." },
          { t:"`x - y + z = 5`", why:"Parallel to π₂. " + M1 },
          { t:"`3x + y + 2z = 10`", why:"One point." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"The planes `x + y - z = 2`, `2x + y + z = 5` and `3x + 2y = 7` share a line. Which is an equation of it?", options:[
          { t:"`vec{r} = (3, -1, 0) + t(-2, 3, 1)`", ok:true, why:"The third equation is the sum of the first two; (1, 1, −1) × (2, 1, 1) = (2, −3, −1)." },
          { t:"`vec{r} = (3, -1, 0) + t(1, 1, -1)`", why:"That’s a normal, not the direction." },
          { t:"`vec{r} = (1, 1, 0) + t(-2, 3, 1)`", why:"(1, 1, 0) is on the first plane only: 2 + 1 ≠ 5." },
          { t:"`vec{r} = (3, -1, 0) + t(2, 3, 1)`", why:"Cross product sign slip: check the dot with (1, 1, −1)." }] },
        b:{ prompt:"The planes `x - y + z = 1`, `x + y + 2z = 5` and `2x + 3z = 6` share a line. Which is an equation of it?", options:[
          { t:"`vec{r} = (3, 2, 0) + t(-3, -1, 2)`", ok:true, why:"The third equation is the sum of the first two; (1, −1, 1) × (1, 1, 2) = (−3, −1, 2)." },
          { t:"`vec{r} = (3, 2, 0) + t(1, -1, 1)`", why:"A normal." },
          { t:"`vec{r} = (1, 0, 0) + t(-3, -1, 2)`", why:"(1, 0, 0) is on the first plane only." },
          { t:"`vec{r} = (3, 2, 0) + t(-3, 1, 2)`", why:"Sign slip." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"A classmate says: ‘Each pair of these three planes meets in a line, so all three must share at least one point.’ Which is the best response?", options:[
          { t:"“Not necessarily: if the three lines are parallel, the planes form a triangular prism with no common point.”", ok:true, why:M6 },
          { t:"“That’s right: three lines in space always meet.”", why:M6 },
          { t:"“Not necessarily: they could be three parallel planes.”", why:"Parallel planes don’t meet in lines at all." },
          { t:"“That’s right, and the common point is unique.”", why:M5 }] },
        b:{ prompt:"A classmate says: ‘Three equations in three unknowns always have exactly one solution.’ Which is the best response?", options:[
          { t:"“Not always: if " + TP + " = 0, the planes share a line, a plane, or nothing.”", ok:true, why:M5 },
          { t:"“That’s right: one equation per unknown.”", why:M5 },
          { t:"“Not always: they never have exactly one.”", why:"Most systems do." },
          { t:"“That’s right, unless two equations are identical.”", why:"It also fails for a prism or a sheaf." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly reads the reduced matrix " + mat([[1, 0, 2, 3], [0, 1, -1, 1], [0, 0, 0, 0]]) + "?", options:[
          { t:"“`z` is free: let `z = t`; then `x = 3 - 2t` and `y = 1 + t`. The planes share a line.”", ok:true, why:"0 = 0 is redundant, so `z` is free." },
          { t:"“No solution, because the last row is zero.”", why:M3 },
          { t:"“The only solution is `x = 3`, `y = 1`, `z = 0`.”", why:"That’s one point on the line, not the only one." },
          { t:"“The planes share a whole plane.”", why:"That needs two zero rows." }] },
        b:{ prompt:"Which statement correctly reads " + mat([[1, 0, -1, 2], [0, 1, 3, -1], [0, 0, 0, 0]]) + "?", options:[
          { t:"“`z = t`, `x = 2 + t`, `y = -1 - 3t`: the planes share a line.”", ok:true, why:"0 = 0 is redundant, so `z` is free." },
          { t:"“No solution, because the last row is zero.”", why:M3 },
          { t:"“The only solution is (2, −1, 0).”", why:"That’s one point on the line, not the only one." },
          { t:"“The planes share a whole plane.”", why:"That needs two zero rows." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"At a theatre, 2 adult, 3 student and 1 child ticket cost $46; 1 adult, 2 student and 2 child tickets cost $38; 3 adult, 1 student and 1 child ticket cost $44. What does a student ticket cost?", options:[
          { t:"$6", ok:true, why:"The solution is adult $10, student $6, child $8." },
          { t:"$8", why:"That’s the child ticket. " + M7 },
          { t:"$10", why:"That’s the adult ticket. " + M7 },
          { t:"$5", why:"Check: 2(10) + 3(5) + 8 = 43, not 46." }] },
        b:{ prompt:"2 adult, 3 student and 1 child ticket cost $50; 1 adult, 2 student and 2 child tickets cost $36; 3 adult, 1 student and 1 child ticket cost $48. What does a child ticket cost?", options:[
          { t:"$5", ok:true, why:"Adult $12, student $7, child $5." },
          { t:"$7", why:"Student. " + M7 },
          { t:"$12", why:"Adult. " + M7 },
          { t:"$6", why:"Check: 12 + 14 + 12 = 38, not 36." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Three laser sheets in a stage show lie in `x + y + z = 6`, `x - y + z = 2` and `x + ky + z = 8`. For which `k` do the lasers share a single common line of light?", options:[
          { t:"`k = 2`", ok:true, why:"The first two meet in `y = 2`, `x + z = 4`. The third contains that line when `4 + 2k = 8`." },
          { t:"`k = 1`", why:"That makes the third sheet parallel to the first: no common points." },
          { t:"`k = 0`", why:"`x + z = 8` misses the line `x + z = 4`: a prism." },
          { t:"Any `k ≠ 1`, because then the triple product isn’t 0", why:"The triple product is 0 for <strong>every</strong> `k`: (1, `k`, 1) is always perpendicular to (1, 0, −1). " + M2 }] },
        b:{ prompt:"Laser sheets in `x + y + z = 4`, `x - y + z = 2` and `2x + ky + 2z = 9`. For which `k` do they share a common line?", options:[
          { t:"`k = 3`", ok:true, why:"The line is `y = 1`, `x + z = 3`; then `6 + k = 9`." },
          { t:"`k = 2`", why:"Parallel to the first sheet." },
          { t:"`k = 0`", why:"A prism." },
          { t:"Any `k ≠ 2`", why:"The triple product is 0 for every `k`. " + M2 }] } }
    ]
  },
  task:{
    title:"Prism through a point", summary:"Prism through a point",
    statement:"<p>π₁: `x + y + z = 6` and π₂: `x - y + z = 2` are fixed. Design π₃: `Ax + By + Cz + D = 0` that meets every condition. Can you find them all?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>π₃ passes through Q(0, 0, 3).</li><li>No two of the three planes are parallel or coincident.</li><li>The three planes have no point in common.</li></ol></div>" +
      "<p class=\"tiny muted\">`A`, `B` and `C` are whole numbers from −2 to 2; `D` is a whole number from −12 to 12. The 3D view shows all three planes, Q, the line `L` = π₁ ∩ π₂ and the pairwise lines.</p>",
    checks:["Passes through Q(0, 0, 3)", "No two planes parallel or coincident", "No common point"],
    tips:["Substitute (0, 0, 3): `3C + D = 0`.",
      "If (`A`, `B`, `C`) is a multiple of (1, 1, 1) or (1, −1, 1), two planes are parallel.",
      "With no parallel pair, ‘no common point’ means a prism. π₃ must be parallel to `L`, so `vec{n}_3 · (1, 0, -1) = 0` (`A = C`), but must miss `L`: (4, 2, 0) must not satisfy π₃."],
    explainPrompt:"Explain why every answer has `A = C`, and why that alone isn’t enough.",
    vocab:"Use the words normal, parallel, line of intersection and triangular prism.",
    after3:"Every answer has `A = C` (parallel to `L`) and `D = -3C` (through Q).",
    afterAll:"`2x - y + 2z - 6 = 0` also passes through Q and is parallel to `L`, but it contains `L`: a sheaf, not a prism.",
    total:5
  },
  cards:[
    ["Exactly one point", TP + " ≠ 0 (the normals aren’t coplanar)."],
    ["Triple product = 0", "<strong>Not</strong> exactly one point: a line, a plane, or none. Row-reduce to tell."],
    ["Sheaf", "Three distinct planes through one line, like pages of a book."],
    ["Triangular prism", "Each pair meets in a line; the three lines are parallel; no common point; no parallel planes."],
    ["Two parallel + one crossing", "No common point; the crossing plane cuts the others in two parallel lines."],
    ["Row [0 0 0 | 0]", "A redundant equation; one zero row gives a line (one parameter)."],
    ["Row [0 0 0 | `k`], `k ≠ 0`", "Inconsistent: no common point."],
    ["Two zero rows", "All three planes coincide: a whole plane of solutions (two parameters)."],
    ["Name the inconsistent case", "Count parallel pairs: none means a prism; one pair means two parallel planes cut by a third; all three means three parallel planes."],
    ["Row operations", "Change the planes, never the common points."],
    ["Check a solution", "Substitute it into all three original equations."],
    ["Plane through a known line", "It contains two points of the line; its normal is perpendicular to the line’s direction."]
  ]
};
