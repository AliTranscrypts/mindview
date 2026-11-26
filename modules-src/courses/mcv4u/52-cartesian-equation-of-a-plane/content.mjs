// MCV4U 52 Cartesian Equation of a Plane. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/52-cartesian-equation-of-a-plane.md
// misconception core sentences (plan §3)
const M1 = "The normal is perpendicular to the plane. From a vector equation, it’s `vec{a} × vec{b}`, not either direction; from `Ax + By + Cz + D = 0`, it’s `(A, B, C)` with no `D`.";
const M2 = "Substitute `P_0` and solve for `D`: the plane passes through `P_0`, not the origin.";
const M3 = "In R³ one equation gives a plane: a missing variable can be anything, so the plane runs parallel to that axis.";
const M5 = "Perpendicular planes have perpendicular normals: `vec{n}_1 · vec{n}_2 = 0`.";
const M6 = "The angle between planes is acute: use `|vec{n}_1 · vec{n}_2|` in `cos θ`.";
const M7 = "Set `y = z = 0`: `Ax + D = 0` gives `x = -D/A`.";
const M8 = "Directions in the plane are perpendicular to the normal. The normal sticks out of the plane.";

export default {
  id:"52-cartesian-equation-of-a-plane",
  kind:"topic",
  title:"Cartesian equation of a plane",
  topic:"Cartesian Equation of a Plane",
  readyTopic:"the Cartesian equation of a plane",
  hero:{
    eq:"`@c{vec{n}} · (vec{r} - vec{r}_0) = 0` ⟶ `@c{A}x + @c{B}y + @c{C}z + D = 0`",
    eqLabel:"n vector dot the quantity r vector minus r zero vector equals 0, which expands to A x plus B y plus C z plus D equals 0, with normal n equal to A, B, C.",
    eqSize:"sm",
    headline:"One arrow decides the tilt",
    text:"Every plane has a <strong>normal</strong>: a vector perpendicular to it. Fix a point and a normal and the plane is fixed. Its <strong>scalar equation</strong> `Ax + By + Cz + D = 0` holds the normal in plain sight: the coefficients `(A, B, C)`. Tilt the normal and the plane tilts with it.",
    fig:{ aria:"A 3D view: the point P₀(1, 1, 1) with the normal n = (1, 2, 2) and the plane x + 2y + 2z − 5 = 0 painted by an arrow that stays at right angles to the normal.", shape:"square" }
  },
  goals:[
    "I can explain what a normal vector is and read it from `Ax + By + Cz + D = 0`.",
    "I can write a plane’s scalar equation from a point and a normal, three points, or a vector equation.",
    "I can convert a scalar equation into vector and parametric form.",
    "I can recognize and describe special planes (missing variables, intercepts, coordinate planes).",
    "I can decide whether two planes are parallel, perpendicular or neither, and find the angle between them.",
    "I can solve problems with scalar equations of planes (heights on a sloped surface, planes through a point parallel to another)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Cross product", goal:2, prompt:"Find `(1, 2, 0) × (0, 1, 3)`.",
          options:[
            { t:"`(6, -3, 1)`", ok:true, why:"`(2·3 - 0·1, 0·0 - 1·3, 1·1 - 2·0)`." },
            { t:"`(6, 3, 1)`", why:"The `y`-component is `a_3 b_1 - a_1 b_3 = 0 - 3`." },
            { t:"`(0, 2, 0)`", why:"That’s not the cross product; it’s the start of a dot product." },
            { t:"`(-6, 3, -1)`", why:"That’s `(0, 1, 3) × (1, 2, 0)`: order matters." }],
          hints:["Use `(a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1)`.", "`x`: `2·3 - 0·1 = 6`.", "`(6, -3, 1)`."] },
        { id:"w2", skill:"Dot product", goal:1, prompt:"Which vector is perpendicular to `(2, -1, 3)`?",
          options:[
            { t:"`(1, 5, 1)`", ok:true, why:"`2 - 5 + 3 = 0`." },
            { t:"`(-2, 1, -3)`", why:"That’s parallel (opposite direction)." },
            { t:"`(1, 2, 1)`", why:"`2 - 2 + 3 = 3`, not 0." },
            { t:"`(1, 2, 3)`", why:"`2 - 2 + 9 = 9`." }],
          hints:["Perpendicular means the dot product is 0.", "Test each: `2a - b + 3c`.", "`(1, 5, 1)`."] },
        { id:"w3", skill:"Vector equations of planes", goal:3, prompt:"Which point is on `vec{r} = (1, 0, 2) + s(1, 1, 0) + t(0, 2, 1)`?",
          options:[
            { t:"`(2, 3, 3)`", ok:true, why:"`s = 1`, `t = 1`." },
            { t:"`(1, 1, 0)`", why:"Directions aren’t points of the plane." },
            { t:"`(2, 3, 2)`", why:"`z = 2 + t = 3`." },
            { t:"`(0, 0, 0)`", why:"No `s` and `t` reach the origin here." }],
          hints:["Pick values of `s` and `t`.", "`s = t = 1`: `(1 + 1, 0 + 1 + 2, 2 + 1)`.", "`(2, 3, 3)`."] },
        { id:"w4", skill:"Cross product", goal:2, prompt:"Which vector is perpendicular to both `(1, 0, 1)` and `(0, 1, 1)`?",
          options:[
            { t:"`(-1, -1, 1)`", ok:true, why:"Their cross product; check: `-1 + 0 + 1 = 0` and `0 - 1 + 1 = 0`." },
            { t:"`(1, 1, 1)`", why:"`(1, 1, 1) · (1, 0, 1) = 2`." },
            { t:"`(1, 1, 2)`", why:"The sum lies in their plane." },
            { t:"`(0, 0, 1)`", why:"`(0, 0, 1) · (1, 0, 1) = 1`." }],
          hints:["The cross product is perpendicular to both.", "`(0·1 - 1·1, 1·0 - 1·1, 1·1 - 0·0)`.", "`(-1, -1, 1)`."] },
        { id:"w5", skill:"Solving for a variable", goal:4, prompt:"In `2x - y + 3z = 6`, find `y` when `x = 1` and `z = 2`.",
          options:[
            { t:"2", ok:true, why:"`2 - y + 6 = 6`, so `y = 2`." },
            { t:"−2", why:"Divide by −1." },
            { t:"14", why:"`-y = 6 - 2 - 6`." },
            { t:"6", why:"Substitute first, then solve." }],
          hints:["Substitute `x` and `z`.", "`8 - y = 6`.", "`y = 2`."] },
        { id:"w6", skill:"Dot product", goal:5, prompt:"What is the angle between `(1, 0, 1)` and `(0, 1, 1)`?",
          options:[
            { t:"60°", ok:true, why:"`cos θ = 1/(√2 · √2) = 1/2`." },
            { t:"30°", why:"`cos 30° = √3/2`." },
            { t:"45°", why:"Divide by both: `√2 · √2 = 2`." },
            { t:"90°", why:"The dot product is 1, not 0." }],
          hints:["`cos θ = {vec{a} · vec{b}}/{|vec{a}||vec{b}|}`.", "Dot product 1; magnitudes `√2` and `√2`.", "`cos θ = 1/2`: 60°."] }
      ],
      refreshers:{
        "Cross product":"`vec{a} × vec{b}` is perpendicular to both. Use the determinant pattern, and watch the middle sign.",
        "Dot product":"`vec{a} · vec{b} = 0` means perpendicular. `cos θ = {vec{a} · vec{b}}/{|vec{a}||vec{b}|}`.",
        "Vector equations of planes":"`vec{r} = vec{r}_0 + s vec{a} + t vec{b}`: choose `s` and `t` to get points.",
        "Solving for a variable":"Substitute the known values, collect constants, then divide."
      }
    }
  },
  explore:{
    heading:"Normal and plane",
    intro:"Tilt the normal and watch the plane follow. Type an equation and see its normal, intercepts and special features. Then compare two planes.",
    txt:{
      modes:{ np:"Normal + point", eq:"Equation", two:"Two planes" },
      modeL:"Mode",
      normalH:"Normal `vec{n} = (A, B, C)`", pointH:"Point `P_0`", testH:"Test point `Q`",
      eqH:"Coefficients of `Ax + By + Cz + D = 0`", p1H:"Plane 1 (blue)", p2H:"Plane 2 (teal)",
      ranges:{ np:"Each from −4 to 4; `Q` from −5 to 5.", eq:"`A`, `B`, `C` from −6 to 6; `D` from −20 to 20.", two:"Whole numbers from −6 to 6." },
      tidy:"Tidy", tidyNote:"Tidy makes the leading coefficient positive.",
      tip:"Normal tip", tipLabel:"Normal tip handle. Left and Right arrows change A, Up and Down change B, Page Up and Page Down change C.",
      tipNote:"Drag the dot at the normal’s tip, or focus <strong>Normal tip</strong> and use the arrow keys.",
      rows:{ normal:"Normal", point:"Point", eq:"Equation", d:"`D`", icpt:"Intercepts", special:"Special", test:"Test point",
        p1:"Plane 1", p2:"Plane 2", dot:"`vec{n}_1 · vec{n}_2`", rel:"Two planes" },
      notPlane:"Not a plane: `A`, `B` and `C` can’t all be 0.",
      onP:"on the plane", plusSide:"on the side the normal points to", minusSide:"on the other side",
      same:"Same plane: the equations are multiples", par:"Parallel: the normals are parallel", perp:"Perpendicular: angle 90°",
      meet:"Neither: the planes meet at", normalsAt:"the normals meet at", mask:"Make your prediction first.",
      off:"(outside the view)"
    },
    predIntro:"Make a prediction first. Then the 3D view shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: `vec{n} = (1, 2, 2)`, `P_0(1, 1, 1)`. Change the normal to `(2, 4, 4)`, keeping `P_0`. What happens to the plane?",
        options:[{ t:"Nothing: same plane", ok:true }, { t:"It moves twice as far" }, { t:"It tilts" }, { t:"It becomes a line" }],
        explain:"Every multiple of a normal is a normal; the equation just doubled: `2x + 4y + 4z - 10 = 0`." },
      { id:"p2", prompt:"Set `A = 0`, `B = 0`, `C = 1`, `D = -3`, so the equation is `z = 3`. What will you see?",
        options:[{ t:"A horizontal plane 3 units up", ok:true }, { t:"A line" }, { t:"The point `(0, 0, 3)`" }, { t:"A vertical plane" }],
        explain:"`x` and `y` are free, so every point with `z = 3` is included." },
      { id:"p3", prompt:"`x + z = 4` has no `y`-term. How does the plane sit?",
        options:[{ t:"Parallel to the `y`-axis", ok:true }, { t:"Perpendicular to the `y`-axis" }, { t:"Parallel to the `x`-axis" }, { t:"Through the origin" }],
        explain:"The normal `(1, 0, 1)` has no `y`-part, so the plane contains the `y`-direction. It’s a slanted wall through `(4, 0, 0)` and `(0, 0, 4)`." },
      { id:"p4", prompt:"Plane 1: `x + y + z = 1`. Plane 2: `x - y = 0`. Parallel, perpendicular or neither?",
        options:[{ t:"Perpendicular", ok:true }, { t:"Parallel" }, { t:"Neither" }, { t:"The same plane" }],
        explain:"`(1, 1, 1) · (1, -1, 0) = 0`." }
    ],
    chalIntro:"Use the 3D tool, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Build the plane through `(2, 0, -1)` with normal `(3, 1, -2)`, and enter its scalar equation in <strong>Equation</strong> mode.",
        why:"`3x + y - 2z + D = 0` through `(2, 0, -1)`: `6 + 0 + 2 + D = 0`, so `D = -8`.",
        hints:["Coefficients = normal: `3x + y - 2z + D = 0`.", "Substitute `(2, 0, -1)`: `6 + 0 + 2 + D = 0`.", "`D = -8`."],
        msgs:{ mode:"Enter the equation in <strong>Equation</strong> mode: type `A`, `B`, `C` and `D`.",
          sign:"Check `(2, 0, -1)`: `6 + 0 + 2 + 8 ≠ 0`. `D = -(6 + 0 + 2) = -8`.",
          swap:"The normal gives the coefficients; the point gives `D`.",
          origin:"That plane passes through the origin, not `(2, 0, -1)`.",
          general:"Not yet: the coefficients come from the normal, and `(2, 0, -1)` must make the equation true." } },
      { id:"tc2", goal:4, prompt:"Equation mode: make a plane with `x`-intercept 2, `y`-intercept 3 and `z`-intercept 6, using whole-number coefficients.",
        why:"`x/2 + y/3 + z/6 = 1`; multiply by 6: `3x + 2y + z - 6 = 0`.",
        hints:["Intercept form: `x/2 + y/3 + z/6 = 1`.", "Multiply by 6.", "`3x + 2y + z - 6 = 0`."],
        msgs:{ mode:"Switch to <strong>Equation</strong> mode and type the coefficients.",
          coef:"Intercepts aren’t coefficients: that plane’s intercepts are 1/2, 1/3, 1/6.",
          onlyZ:"Only the `z`-intercept is right.",
          sign:"Set `y = z = 0`: `3x = -6` gives −2.",
          general:"Not yet: watch the Intercepts row. You need 2, 3 and 6." } },
      { id:"tc3", goal:5, stretch:true, prompt:"Two planes mode: plane 1 is `x + 2y - 2z = 4`. Make plane 2 pass through `(1, 1, 1)`, be <strong>perpendicular</strong> to plane 1, and be <strong>parallel to the `z`-axis</strong>.",
        why:"No `z`-term and `(A, B, 0) · (1, 2, -2) = 0` give `(2, -1, 0)`; through `(1, 1, 1)`: `2x - y - 1 = 0`. It’s the only such plane.",
        hints:["Parallel to the `z`-axis means no `z`-term: `C = 0`.", "Perpendicular means `(A, B, 0) · (1, 2, -2) = 0`, so `A + 2B = 0`: `(2, -1, 0)` works.", "`2x - y + D = 0` through `(1, 1, 1)`: `D = -1`."],
        msgs:{ mode:"Switch to <strong>Two planes</strong> mode.",
          p1:"First set plane 1 to `x + 2y - 2z - 4 = 0`.",
          par:"That’s parallel to plane 1, not perpendicular.",
          noPerp:"Parallel to the `z`-axis, but `(1, 2, 0) · (1, 2, -2) = 5 ≠ 0`.",
          meetsZ:"Perpendicular to plane 1, but it meets the `z`-axis at `(0, 0, 2)` instead of running parallel to it.",
          point:"`(1, 1, 1)` gives `2 - 1 + 1 ≠ 0`.",
          general:"Not yet: check all three conditions. Through `(1, 1, 1)`, normals perpendicular, and no `z`-term." } }
    ]
  },
  part3:{
    slug:"convert", name:"Convert",
    heading:"Converting between forms",
    intro:"Move between the vector side and the scalar side. Each station shows its steps on a 3D view so you can check every step. Then try the quick check.",
    labels:{ vec:"Vector side", sca:"Scalar side", working:"Check it with algebra", show:"Show", next:"Next step" },
    st1:{ title:"Station 1: vector → scalar",
      text:"`vec{r} = (1, 0, 2) + s(1, 1, 0) + t(0, 1, 3)`. Press each step to reveal it. The 3D view draws the normal at right angles to both direction arrows.",
      fig:"3D view of the plane through (1, 0, 2) with direction arrows (1, 1, 0) in blue and (0, 1, 3) in teal.",
      steps:[
        { b:"1. Normal = cross product of the directions", r:"`(1, 1, 0) × (0, 1, 3) = (3, -3, 1)`." },
        { b:"2. Write the equation with the normal’s components", r:"`3x - 3y + z + D = 0`." },
        { b:"3. Substitute `(1, 0, 2)`", r:"`3 - 0 + 2 + D = 0`, so `D = -5`: `3x - 3y + z - 5 = 0`." },
        { b:"4. Check another point (`s = t = 1`)", r:"`(2, 2, 5)`: `6 - 6 + 5 - 5 = 0` ✓." }
      ] },
    st2:{ title:"Station 2: scalar → vector",
      text:"`2x - y + z = 4`. Find a vector equation two ways.",
      fig:"3D view of the plane 2x − y + z = 4 with its normal.",
      methA:{ b:"Method A: two variables as parameters", r:"Let `x = s`, `y = t`, so `z = 4 - 2s + t`: `vec{r} = (0, 0, 4) + s(1, 0, -2) + t(0, 1, 1)`." },
      methB:{ b:"Method B: three points from the intercepts", r:"`(2, 0, 0)`, `(0, -4, 0)`, `(0, 0, 4)`. Directions: `(0, 0, 4) - (2, 0, 0) = (-2, 0, 4)` and `(0, -4, 0) - (2, 0, 0) = (-2, -4, 0)`: `vec{r} = (2, 0, 0) + s(-2, 0, 4) + t(-2, -4, 0)`." },
      trap:{ b:"Use the normal as a direction", msg:M8 + " Using `(2, -1, 1)` as a direction draws a plane at right angles to the real one." },
      alg:["Method A directions: `(1, 0, -2) · (2, -1, 1) = 2 + 0 - 2 = 0` and `(0, 1, 1) · (2, -1, 1) = 0 - 1 + 1 = 0`.",
        "Method B directions: `(-2, 0, 4) · (2, -1, 1) = -4 + 4 = 0` and `(-2, -4, 0) · (2, -1, 1) = -4 + 4 = 0`.",
        "Both directions of each form dot the normal `(2, -1, 1)` to 0, so they lie along the plane."] },
    st3:{ title:"Station 3: comparing planes",
      text:"Tap two planes, then choose <strong>parallel</strong>, <strong>perpendicular</strong> or <strong>neither</strong> (and the angle). Classify all six pairs.",
      fig:"3D view of the two chosen planes and their normals.",
      planes:[{ name:"Π₁", eq:"`x + y = 3`", c:[1, 1, 0, -3] }, { name:"Π₂", eq:"`y + z = 1`", c:[0, 1, 1, -1] },
        { name:"Π₃", eq:"`2x + 2y - 7 = 0`", c:[2, 2, 0, -7] }, { name:"Π₄", eq:"`x - y + z = 0`", c:[1, -1, 1, 0] }],
      pick:"Tap two planes.", pickOne:"Tap one more plane.",
      rels:{ par:"parallel", perp:"perpendicular", nei:"neither" }, angH:"The angle between the planes:", angles:[30, 45, 60],
      msgs:{ par:"✓ Parallel: the normals are multiples.", perp:"✓ Perpendicular: `vec{n}_1 · vec{n}_2 = 0`.", nei:"✓ Neither: the planes meet at",
        notPar:"The normals aren’t multiples, so the planes aren’t parallel.", notPerp:"Perpendicular planes have perpendicular normals, but here `vec{n}_1 · vec{n}_2 ≠ 0`.",
        isPar:"The normals are multiples: the planes are parallel.", isPerp:"`vec{n}_1 · vec{n}_2 = 0`: the planes are perpendicular.",
        ang:M6 },
      rows:{ n1:"First normal", n2:"Second normal", dot:"`vec{n}_1 · vec{n}_2`", angN:"Angle between normals", angP:"Angle between planes" },
      tally:"Pairs classified:" },
    quickCheck:{
      title:"Quick check", summary:"Convert quick check",
      items:[
        { id:"q1", goal:1, prompt:"A normal to `4x - z + 7 = 0`?",
          choices:[{ t:"`(4, 0, -1)`", ok:true, fb:"Right. No `y`-term means `B = 0`; `D` isn’t part of the normal." },
            { t:"`(4, -1, 7)`", fb:"No `y`-term means `B = 0`; `D` isn’t part of the normal." },
            { t:"`(4, -1, 0)`", fb:"No `y`-term means `B = 0`; `D` isn’t part of the normal." },
            { t:"`(4, 0, 1)`", fb:"No `y`-term means `B = 0`; `D` isn’t part of the normal." }] },
        { id:"q2", goal:2, prompt:"Scalar equation of `vec{r} = (0, 0, 1) + s(1, 0, 0) + t(0, 1, 0)`?",
          choices:[{ t:"`z - 1 = 0`", ok:true, fb:"Right. Normal `(1, 0, 0) × (0, 1, 0) = (0, 0, 1)`; through `(0, 0, 1)`." },
            { t:"`x + y - 1 = 0`", fb:"Normal `(1, 0, 0) × (0, 1, 0) = (0, 0, 1)`; through `(0, 0, 1)`." },
            { t:"`z = 0`", fb:"Normal `(1, 0, 0) × (0, 1, 0) = (0, 0, 1)`; through `(0, 0, 1)`." },
            { t:"`x + y + z = 1`", fb:"Normal `(1, 0, 0) × (0, 1, 0) = (0, 0, 1)`; through `(0, 0, 1)`." }] },
        { id:"q3", goal:5, prompt:"Angle between the planes `x = 2` and `x + z = 1`?",
          choices:[{ t:"45°", ok:true, fb:"Right. `(1, 0, 0) · (1, 0, 1) = 1`; `cos θ = 1/√2`." },
            { t:"135°", fb:"`(1, 0, 0) · (1, 0, 1) = 1`; `cos θ = 1/√2`." },
            { t:"60°", fb:"`(1, 0, 0) · (1, 0, 1) = 1`; `cos θ = 1/√2`." },
            { t:"90°", fb:"`(1, 0, 0) · (1, 0, 1) = 1`; `cos θ = 1/√2`." }] },
        { id:"q4", goal:5, prompt:"Which plane is parallel to `2x - y + 3z = 1`?",
          choices:[{ t:"`-4x + 2y - 6z = 5`", ok:true, fb:"Right. `(-4, 2, -6) = -2(2, -1, 3)`: parallel normals. `D` sets the position, not the tilt." },
            { t:"`2x + y + 3z = 1`", fb:"`(-4, 2, -6) = -2(2, -1, 3)`: parallel normals. `D` sets the position, not the tilt." },
            { t:"`3x - y + 2z = 1`", fb:"`(-4, 2, -6) = -2(2, -1, 3)`: parallel normals. `D` sets the position, not the tilt." },
            { t:"None: parallel planes need equal `D`", fb:"`(-4, 2, -6) = -2(2, -1, 3)`: parallel normals. `D` sets the position, not the tilt." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Equation ↔ description", summary:"Equation ↔ description", goal:[1, 4],
        instruction:"Match each equation with its description. Two cards on the right have no partner.",
        leftTitle:"Equation", rightTitle:"Description",
        left:[
          { id:"l1", t:"`z = 2`" },
          { id:"l2", t:"`x = 0`" },
          { id:"l3", t:"`y + z = 3`" },
          { id:"l4", t:"`x - y = 0`", hints:["Test the point `(0, 0, 5)`.", "`0 - 0 = 0` ✓, for any `z`.", "So the whole `z`-axis lies in it."] },
          { id:"l5", t:"`x + y + z = 6`" },
          { id:"l6", t:"`2x + 3y + 6z = 6`" },
          { id:"l7", t:"`x + 2y - z = 0`" },
          { id:"l8", t:"`3x - z = 3`", hints:["Which variable is missing?", "`y`: parallel to the `y`-axis.", "`y = z = 0`: `3x = 3`, so `x = 1`."] }
        ],
        right:[
          { id:"r1", t:"Horizontal plane 2 units above the `xy`-plane" }, { id:"r2", t:"The `yz`-plane" },
          { id:"r3", t:"Parallel to the `x`-axis" }, { id:"r4", t:"Contains the `z`-axis" },
          { id:"r5", t:"Intercepts 6, 6 and 6" }, { id:"r6", t:"Intercepts 3, 2 and 1" },
          { id:"r7", t:"Through the origin, containing no coordinate axis" }, { id:"r8", t:"Parallel to the `y`-axis, `x`-intercept 1" },
          { id:"r9", t:"Perpendicular to the `x`-axis" }, { id:"r10", t:"Intercepts 2, 3 and 6" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l3|r9":"No `x`-term means `x` is free: the plane runs parallel to the `x`-axis.",
          "l6|r10":"Set `y = z = 0`: `2x = 6` gives 3.",
          "l4|r7":"`x - y = 0` holds for every point `(0, 0, z)`, so it contains the `z`-axis.",
          "l7|r4":"`x - y = 0` holds for every point `(0, 0, z)`, so it contains the `z`-axis; `x + 2y - z = 0` doesn’t." },
        wrongDefault:"Set two variables to 0, or look for a missing variable." },
      { id:"build", type:"custom", title:"Build the equation", summary:"Build the equation", star:true, goal:[2, 5, 6],
        instruction:"Fill in the coefficients of each plane’s scalar equation. Items 4 to 6 are non-routine; 6 goes beyond the Final Check.",
        how:"Type whole numbers in the four boxes (use 0 for a missing term), then press Check. Any non-zero multiple of the equation counts.",
        msgs:{ fill:"Fill in every box with a whole number (use 0 for a missing term).", zero:"`A`, `B` and `C` can’t all be 0.",
          general:"Not yet. Find the normal first, then substitute a point for `D`." },
        items:[
          { id:"s1", goal:2, prompt:"Point `(1, 2, -1)`, normal `(2, 0, 3)`.", answer:[2, 0, 3, 1],
            wrong:[{ c:[2, 0, 3, -1], fb:"`D = -(2 - 3) = 1`." }],
            why:"`2x + 3z + D = 0` through `(1, 2, -1)`: `2 - 3 + D = 0`, so `D = 1`." },
          { id:"s2", goal:2, prompt:"Points `(1, 0, 0)`, `(0, 2, 0)`, `(0, 0, 3)`.", answer:[6, 3, 2, -6],
            wrong:[{ c:[1, 2, 3, -1], fb:"Intercepts aren’t coefficients." }],
            why:"`x/1 + y/2 + z/3 = 1`; times 6: `6x + 3y + 2z - 6 = 0`." },
          { id:"s3", goal:2, prompt:"`vec{r} = (2, 1, 0) + s(1, 0, 1) + t(0, 2, -1)`.", answer:[2, -1, -2, -3],
            wrong:[{ c:[1, 0, 1, -2], fb:"`(1, 0, 1)` is a direction, not the normal." }, { n:[1, 0, 1], fb:"`(1, 0, 1)` is a direction, not the normal." }, { n:[0, 2, -1], fb:"`(0, 2, -1)` is a direction, not the normal." }],
            why:"`(1, 0, 1) × (0, 2, -1) = (-2, 1, 2)`; through `(2, 1, 0)`: `-2x + y + 2z + 3 = 0`, the same plane as `2x - y - 2z - 3 = 0`." },
          { id:"s4", goal:6, star:true, prompt:"Through `(1, -2, 3)`, parallel to `4x - y + 2z = 7`.", answer:[4, -1, 2, -12],
            wrong:[{ c:[4, -1, 2, -7], fb:"Same normal, but `D` must fit `(1, -2, 3)`." }, { c:[4, -1, 2, 7], fb:"Same normal, but `D` must fit `(1, -2, 3)`." }],
            why:"Same normal `(4, -1, 2)`; `4 + 2 + 6 + D = 0`, so `D = -12`." },
          { id:"s5", goal:2, star:true, prompt:"Contains the line `vec{r} = (1, 0, 1) + u(1, 1, 0)` and the point `(2, 0, 3)`.", answer:[2, -2, -1, -1],
            wrong:[],
            general:"Directions `(1, 1, 0)` and `(2, 0, 3) - (1, 0, 1) = (1, 0, 2)`; normal = their cross product.",
            why:"`(1, 1, 0) × (1, 0, 2) = (2, -2, -1)`; through `(1, 0, 1)`: `D = -1`.",
            hints:["You need two directions.", "`(1, 1, 0)` and `(1, 0, 2)`.", "Cross product `(2, -2, -1)`; `D` from `(1, 0, 1)`: −1."] },
          { id:"s6", goal:5, star:true, prompt:"Through `(0, 0, 0)` and `(1, 1, 1)`, perpendicular to `x + 2y + 3z = 4`.", answer:[1, -2, 1, 0],
            wrong:[{ n:[1, 2, 3], fb:"That’s parallel to the given plane." }],
            why:"Directions `(1, 1, 1)` and `(1, 2, 3)`: `(1, 1, 1) × (1, 2, 3) = (1, -2, 1)`, through the origin.",
            hints:["A plane perpendicular to Π contains the direction of Π’s normal.", "So the directions are `(1, 1, 1)` and `(1, 2, 3)`.", "`(1, 1, 1) × (1, 2, 3) = (1, -2, 1)`, through the origin: `x - 2y + z = 0`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Camila", how:"", goal:[2, 3],
        instruction:"Camila made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the scalar equation of the plane through `P(2, -1, 4)` with normal `(3, 1, -2)`.",
            steps:["`3x + y - 2z + D = 0`.", "Substitute `P`: `3(2) + (-1) - 2(4) + D = 0`.", "`6 - 1 - 8 + D = 0`, so `D = -3`.", "`3x + y - 2z - 3 = 0`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"`-3 + D = 0` gives `D = 3`: `3x + y - 2z + 3 = 0`.", ok:true, why:"Check `P`: `6 - 1 - 8 + 3 = 0` ✓." },
              { t:"`D = -3` is right; the normal should be `(2, -1, 4)`.", why:M1 },
              { t:"Leave out `D`: `3x + y - 2z = 0`.", why:M2 },
              { t:"Step 3 is correct.", why:"Check `P`: `6 - 1 - 8 - 3 = -6 ≠ 0`." }],
            hints:["Substitute `P` into Camila’s final equation.", "It gives −6, not 0.", "`-3 + D = 0` means `D = +3`."] },
          { id:"e2", goal:2, task:"Find the scalar equation of `vec{r} = (1, 2, 0) + s(2, 1, 1) + t(1, 0, 3)`.",
            steps:["The normal is `(2, 1, 1)`.", "`2x + y + z + D = 0`.", "Substitute `(1, 2, 0)`: `D = -4`."],
            answer:0,
            stepFb:["", "Step 2 uses step 1’s normal. The mistake is earlier.", "The arithmetic is right; the normal isn’t."],
            fixes:[
              { t:"`vec{n} = (2, 1, 1) × (1, 0, 3) = (3, -5, -1)`, so `3x - 5y - z + 7 = 0`.", ok:true, why:"The normal is perpendicular to both directions: their cross product. `D = -(3 - 10) = 7`." },
              { t:"Use `(1, 0, 3)` as the normal instead.", why:M1 },
              { t:"Use `(1, 2, 0)` as the normal.", why:"That’s a point." },
              { t:"Step 1 is correct.", why:"`(2, 1, 1)` lies <strong>along</strong> the plane; a normal must be perpendicular to it." }],
            hints:["Is `(2, 1, 1)` perpendicular to itself?", "The normal is perpendicular to both directions.", "Cross product: `(3, -5, -1)`; `D = -(3 - 10) = 7`."] },
          { id:"e3", goal:3, task:"Find a vector equation of `2x + y - z = 6`.",
            steps:["A point: `x = 0`, `y = 0` gives `z = -6`, so `(0, 0, -6)`.", "One direction: the normal `(2, 1, -1)`.", "Another direction: `(1, 0, 2)`.", "`vec{r} = (0, 0, -6) + s(2, 1, -1) + t(1, 0, 2)`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "`(1, 0, 2)` is a valid direction, but check the step before.", "Step 4 uses step 2. The mistake is earlier."],
            fixes:[
              { t:"Use two directions perpendicular to the normal, e.g. `(1, 0, 2)` and `(0, 1, 1)`.", ok:true, why:"Both dot `(2, 1, -1)` to 0, so they lie along the plane." },
              { t:"Use `(2, 1, -6)` as a direction.", why:"That mixes the normal with `D`." },
              { t:"Use the point `(2, 1, -1)`.", why:"Changing the point doesn’t fix step 2: the normal is still being used as a direction. " + M1 },
              { t:"Step 2 is correct.", why:"The normal sticks <strong>out</strong> of the plane: `(2, 1, -1) · (2, 1, -1) = 6 ≠ 0`." }],
            hints:["Which vectors lie along a plane?", "Those with zero dot product with the normal.", "`(1, 0, 2)` and `(0, 1, 1)` both work."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Explore: that doubling the normal changed nothing, or how `x + z = 4` sits?" },
      { id:"j2", q:"In your own words, why are the coefficients of `x`, `y` and `z` a normal to the plane?" },
      { id:"j3", q:"Explain to a friend how to turn a vector equation of a plane into a scalar equation." },
      { id:"j4", q:"Which conversion or test still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which vector is normal to the plane `3x - 2y + 5 = 0` in R³?", options:[
          { t:"`(3, -2, 0)`", ok:true, why:"Coefficients of `x`, `y`, `z`; no `z`-term means 0." },
          { t:"`(3, -2, 5)`", why:"5 is the constant `D`, not a component." },
          { t:"`(2, 3, 0)`", why:"That’s perpendicular to the normal: a direction along the plane (the R² line rule)." },
          { t:"`(0, 0, 1)`", why:"A missing `z` means the plane is parallel to the `z`-axis, so `(0, 0, 1)` lies along it." }] },
        b:{ prompt:"Which vector is normal to the plane `4y + z - 2 = 0`?", options:[
          { t:"`(0, 4, 1)`", ok:true, why:"Coefficients of `x`, `y`, `z`; no `x`-term means 0." },
          { t:"`(4, 1, -2)`", why:"−2 is the constant `D`, not a component, and the `x`-component is 0." },
          { t:"`(0, 1, -4)`", why:"That’s perpendicular to the normal: a direction along the plane." },
          { t:"`(1, 0, 0)`", why:"A missing `x` means the plane is parallel to the `x`-axis, so `(1, 0, 0)` lies along it." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"The plane through `(1, 3, -2)` with normal `(2, -1, 4)`?", options:[
          { t:"`2x - y + 4z + 9 = 0`", ok:true, why:"`D = -(2 - 3 - 8) = 9`." },
          { t:"`2x - y + 4z - 9 = 0`", why:"Check `(1, 3, -2)`: `2 - 3 - 8 - 9 ≠ 0`." },
          { t:"`x + 3y - 2z + 9 = 0`", why:"Point and normal swapped." },
          { t:"`2x - y + 4z = 0`", why:"That passes through the origin." }] },
        b:{ prompt:"The plane through `(-1, 2, 0)` with normal `(3, 0, -1)`?", options:[
          { t:"`3x - z + 3 = 0`", ok:true, why:"`D = -(-3 + 0 - 0) = 3`." },
          { t:"`3x - z - 3 = 0`", why:"Check `(-1, 2, 0)`: `-3 - 0 - 3 ≠ 0`." },
          { t:"`-x + 2y + 3 = 0`", why:"Point and normal swapped." },
          { t:"`3x - z = 0`", why:"That passes through the origin." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which describes the plane `y = -2` in R³?", options:[
          { t:"Parallel to the `xz`-plane, 2 units on the negative `y` side", ok:true, why:"`x` and `z` are free; every point has `y = -2`." },
          { t:"A line parallel to the `x`-axis", why:"In R³ one equation gives a plane: `x` and `z` are free." },
          { t:"Perpendicular to the `xz`-plane", why:"Its normal `(0, 1, 0)` is perpendicular to the `xz`-plane, so the plane is parallel to it." },
          { t:"The point `(0, -2, 0)`", why:"Every point with `y = -2` is included." }] },
        b:{ prompt:"Which describes the plane `x + y = 4` in R³?", options:[
          { t:"A vertical plane parallel to the `z`-axis, through `(4, 0, 0)` and `(0, 4, 0)`", ok:true, why:"`z` is free, so the plane is made of vertical lines." },
          { t:"A line with slope −1", why:"In R³ one equation gives a plane: `z` is free." },
          { t:"A plane perpendicular to the `z`-axis", why:"No `z`-term means `z` is free: the plane is parallel to the `z`-axis." },
          { t:"A plane through the origin", why:"`(0, 0, 0)` gives 0 ≠ 4." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Scalar equation of `vec{r} = (1, 0, 1) + s(1, 2, 0) + t(0, 1, 1)`?", options:[
          { t:"`2x - y + z - 3 = 0`", ok:true, why:"`(1, 2, 0) × (0, 1, 1) = (2, -1, 1)`; `D = -(2 + 1) = -3`." },
          { t:"`x + 2y - 1 = 0`", why:"That uses a direction as the normal." },
          { t:"`2x + y + z - 3 = 0`", why:"The middle component of the cross product is `0·0 - 1·1 = -1`." },
          { t:"`2x - y + z + 3 = 0`", why:"Check `(1, 0, 1)`: `2 + 1 + 3 ≠ 0`." }] },
        b:{ prompt:"Scalar equation of `vec{r} = (0, 2, 1) + s(1, 0, 2) + t(1, 1, 0)`?", options:[
          { t:"`2x - 2y - z + 5 = 0`", ok:true, why:"Cross product `(-2, 2, 1)`; through `(0, 2, 1)`." },
          { t:"`x + 2z - 2 = 0`", why:"That uses a direction as the normal." },
          { t:"`-2x - 2y + z + 3 = 0`", why:"Middle sign slip in the cross product." },
          { t:"`2x - 2y - z - 5 = 0`", why:"Check `(0, 2, 1)`: `0 - 4 - 1 - 5 ≠ 0`." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"For which `k` are `2x - y + kz = 3` and `x + 3y + 2z = 1` perpendicular?", options:[
          { t:"`k = 1/2`", ok:true, why:"`(2, -1, k) · (1, 3, 2) = 2 - 3 + 2k = 0`." },
          { t:"`k = -1/2`", why:"Sign slip: `2k = 1`." },
          { t:"`k = 4`", why:"That tries to make the normals proportional, the test for parallel." },
          { t:"No value: perpendicular planes need matching coefficients", why:M5 }] },
        b:{ prompt:"For which `k` are `x + ky - z = 2` and `3x - y + z = 0` perpendicular?", options:[
          { t:"`k = 2`", ok:true, why:"`3 - k - 1 = 0`." },
          { t:"`k = -2`", why:"Sign slip: `-k = -2`." },
          { t:"`k = -1/3`", why:"Proportional normals is the parallel test." },
          { t:"No value", why:M5 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"What is the angle between the planes `x - z = 4` and `y + z = 1`?", options:[
          { t:"60°", ok:true, why:"`(1, 0, -1) · (0, 1, 1) = -1`; the normals meet at 120°, so the planes meet at 60°." },
          { t:"120°", why:"The angle between planes is the acute one." },
          { t:"45°", why:"Divide by both magnitudes: `√2 · √2 = 2`." },
          { t:"30°", why:"`cos θ = 1/2` gives 60°." }] },
        b:{ prompt:"What is the angle between the planes `x - y = 2` and `y - z = 5`?", options:[
          { t:"60°", ok:true, why:"`(1, -1, 0) · (0, 1, -1) = -1`; take the acute angle." },
          { t:"120°", why:"The angle between planes is the acute one." },
          { t:"45°", why:"Divide by both magnitudes: `√2 · √2 = 2`." },
          { t:"30°", why:"`cos θ = 1/2` gives 60°." }] } },
      { id:"c1", cat:"C", goal:[1, 3],
        a:{ prompt:"Which is the best explanation of why `(2, 1, -1)` can’t be a direction vector of the plane `2x + y - z = 5`?", options:[
          { t:"“`(2, 1, -1)` is the normal. A direction along the plane must be perpendicular to the normal, but `(2, 1, -1) · (2, 1, -1) = 6 ≠ 0`.”", ok:true, why:M8 },
          { t:"“A direction vector can’t have negative components.”", why:"Signs don’t matter." },
          { t:"“It can: any vector made from the coefficients lies in the plane.”", why:M8 },
          { t:"“Because the plane doesn’t pass through the origin.”", why:"Directions don’t depend on where the plane is." }] },
        b:{ prompt:"Which is the best explanation of why `(1, -3, 2)` can’t be a direction vector of the plane `x - 3y + 2z = 0`?", options:[
          { t:"“`(1, -3, 2)` is the normal. A direction along the plane must be perpendicular to it, but `(1, -3, 2) · (1, -3, 2) = 14 ≠ 0`.”", ok:true, why:M8 },
          { t:"“A direction vector can’t have negative components.”", why:"Signs don’t matter." },
          { t:"“It can: any vector made from the coefficients lies in the plane.”", why:M8 },
          { t:"“Because the plane passes through the origin.”", why:"Irrelevant to directions." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the best description of the plane `2x + 3z = 6`?", options:[
          { t:"“It’s parallel to the `y`-axis: `y` can be anything, so the plane is made of lines parallel to the `y`-axis through the line `2x + 3z = 6` in the `xz`-plane. It meets the `x`-axis at 3 and the `z`-axis at 2.”", ok:true, why:"No `y`-term: `y` is free." },
          { t:"“It’s a line in the `xz`-plane with intercepts 3 and 2.”", why:M3 },
          { t:"“It’s perpendicular to the `y`-axis because `y` is missing.”", why:M3 },
          { t:"“It meets the axes at `x = 3`, `y = 0` and `z = 2`.”", why:"It never meets the `y`-axis: `(0, y, 0)` gives 0 ≠ 6." }] },
        b:{ prompt:"Which is the best description of the plane `x - 2y = 4`?", options:[
          { t:"“It’s parallel to the `z`-axis: `z` can be anything, so the plane is made of vertical lines through the line `x - 2y = 4` in the `xy`-plane. It meets the `x`-axis at 4 and the `y`-axis at −2.”", ok:true, why:"No `z`-term: `z` is free." },
          { t:"“It’s a line in the `xy`-plane with intercepts 4 and −2.”", why:M3 },
          { t:"“It’s perpendicular to the `z`-axis because `z` is missing.”", why:M3 },
          { t:"“It meets the axes at `x = 4`, `y = -2` and `z = 0`.”", why:"It never meets the `z`-axis: `(0, 0, z)` gives 0 ≠ 4." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A ramp’s surface lies in the plane through `A(0, 0, 0)`, `B(4, 0, 1)` and `C(0, 3, 0)`, in metres (`z` is height). How high is the ramp above the floor point `(2, 1, 0)`?", options:[
          { t:"0.5 m", ok:true, why:"Normal `(4, 0, 1) × (0, 3, 0) = (-3, 0, 12)`, so `x - 4z = 0` and `z = x/4 = 0.5`." },
          { t:"8 m", why:"That inverts rise and run: `z = 4x`." },
          { t:"0.25 m", why:"That uses `y = 1`; the ramp rises along `x`, not `y`." },
          { t:"1 m", why:"That’s the height at `B`, the far end." }] },
        b:{ prompt:"A ramp lies in the plane through `A(0, 0, 0)`, `B(0, 6, 2)` and `C(5, 0, 0)`, in metres. How high is it above the floor point `(1, 3, 0)`?", options:[
          { t:"1 m", ok:true, why:"Normal `(0, 6, 2) × (5, 0, 0) = (0, 10, -30)`, so `y - 3z = 0` and `z = y/3 = 1`." },
          { t:"9 m", why:"That inverts rise and run: `z = 3y`." },
          { t:"1/3 m", why:"That uses `x = 1`; the ramp rises along `y`, not `x`." },
          { t:"2 m", why:"That’s `B`’s height." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A glass shelf must be parallel to the plane `x + y + 2z = 0` and pass through the bracket at `(1, 2, 3)`. Where does the shelf’s plane meet the `z`-axis?", options:[
          { t:"`z = 9/2`", ok:true, why:"`x + y + 2z = 1 + 2 + 6 = 9`; on the `z`-axis `2z = 9`." },
          { t:"`z = 9`", why:"Divide by the coefficient 2." },
          { t:"`z = 3`", why:"That’s the bracket’s height; the shelf is tilted." },
          { t:"`z = 0`", why:"A parallel plane through `(1, 2, 3)` can’t pass through the origin." }] },
        b:{ prompt:"A shelf is parallel to `2x - y + 4z = 0` and passes through `(1, -1, 2)`. Where does it meet the `z`-axis?", options:[
          { t:"`z = 11/4`", ok:true, why:"`2 + 1 + 8 = 11`, so `4z = 11`." },
          { t:"`z = 11`", why:"Divide by 4." },
          { t:"`z = 2`", why:"That’s the bracket’s height; the shelf is tilted." },
          { t:"`z = 0`", why:"A parallel plane through `(1, -1, 2)` can’t pass through the origin." }] } }
    ]
  },
  task:{
    title:"Plane to order", summary:"Plane to order",
    statement:"<p>Design a plane `Ax + By + Cz + D = 0` that meets every condition. There are many answers. How many can you find?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It passes through `P(1, 2, 3)`.</li><li>It’s perpendicular to the plane `x - y + z = 5`.</li><li>It isn’t parallel to any coordinate axis.</li><li>It meets the `z`-axis above the origin.</li></ol></div>" +
      "<p class=\"tiny muted\">`A`, `B`, `C` are whole numbers from −6 to 6; `D` is a whole number from −20 to 20. The 3D view shows `P`, the given plane (teal) and your plane (blue), with your `z`-intercept marked.</p>",
    checks:["Passes through `P(1, 2, 3)`", "Perpendicular to `x - y + z = 5`", "Not parallel to any axis", "Meets the `z`-axis above the origin"],
    tips:["Substitute `P`: you need `A + 2B + 3C + D = 0`. Choose `A`, `B`, `C` first, then `D` is forced.",
      "Perpendicular planes have perpendicular normals: `(A, B, C) · (1, -1, 1) = 0`.",
      "A zero coefficient makes the plane parallel to that axis.",
      "The `z`-intercept is `-D/C`. Try flipping the signs of `A`, `B` and `C` together, or choose different coefficients."],
    explainPrompt:"Explain how you chose the normal and how you found `D`.",
    vocab:"Use the words normal, perpendicular, dot product and intercept.",
    more:"Multiples of one plane count as the same answer. How many different planes can you find?",
    after3:"Every answer has a normal perpendicular to `(1, -1, 1)`, and `D` is then forced by `P`. Each normal you choose spins the plane about a line through `P`.",
    labels:{ invalid:"Choose whole numbers: `A`, `B`, `C` from −6 to 6 (not all 0) and `D` from −20 to 20.",
      eq:"Your plane", atP:"At `P(1, 2, 3)`", dotRow:"`(A, B, C) · (1, -1, 1)`", zRow:"`z`-intercept",
      none:"none (no `z`-term)", graph:"3D view: P, the given plane (teal) and your plane (blue)" }
  },
  cards:[
    ["Normal vector", "A vector perpendicular to the plane."],
    ["Scalar equation", "`Ax + By + Cz + D = 0`, with normal `vec{n} = (A, B, C)`."],
    ["Finding `D`", "Substitute a point: `D = -(Ax_0 + By_0 + Cz_0)`."],
    ["Vector → scalar", "`vec{n} = vec{a} × vec{b}`, then find `D` from `vec{r}_0`."],
    ["Scalar → vector", "Let two variables be `s` and `t`, or use three points."],
    ["Multiples", "`vec{n}` and `2vec{n}` are both normals; an equation times `k ≠ 0` is the same plane."],
    ["Missing variable", "`x + z = 4` is parallel to the `y`-axis."],
    ["`z = 3`", "A horizontal plane, parallel to the `xy`-plane."],
    ["Intercepts", "Set two variables to 0: `x`-intercept `-D/A`."],
    ["Parallel planes", "Normals are parallel (multiples)."],
    ["Perpendicular planes", "Normals are perpendicular: `vec{n}_1 · vec{n}_2 = 0`."],
    ["Angle between planes", "`cos θ = {|vec{n}_1 · vec{n}_2|}/{|vec{n}_1||vec{n}_2|}`, the acute angle."]
  ]
};
