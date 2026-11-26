// MCV4U 49 Cartesian Equation of a Line in R². Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/49-cartesian-equation-of-a-line-in-r2.md
// misconception core sentences (plan §3)
const M1 = "`(A, B)` is perpendicular to the line. A direction along it is `(B, -A)`.";
const M2 = "Check with the dot product: a direction must give `vec{n} · vec{m} = 0`.";
const M3 = "Substitute the point: `Ax_0 + By_0 + C` must equal 0.";
const M4 = "Perpendicular normals mean perpendicular lines; parallel normals mean parallel lines.";
const M5 = "Lines make two angles that add to 180°. Report the acute one: use `|vec{n}_1 · vec{n}_2|`.";
const M6 = "`2x - 4y + 6 = 0` is 2 × (`x - 2y + 3 = 0`): same points, same line.";
const N = "`@c{vec{n}}`";

export default {
  id:"49-cartesian-equation-of-a-line-in-r2",
  kind:"topic",
  title:"Cartesian equation of a line in R²",
  topic:"Cartesian Equation of a Line in R²",
  readyTopic:"the Cartesian equation of a line",
  hero:{
    eq:"`@c{vec{n}} · (vec{r} - vec{r}_0) = 0` ⟶ `Ax + By + C = 0`",
    eqLabel:"n dot the quantity r minus r naught equals 0, which gives A x plus B y plus C equals 0.",
    eqSize:"md",
    headline:"The numbers in front of `x` and `y` point away from the line",
    text:"In `Ax + By + C = 0`, the pair `(A, B)` is a <strong>normal vector</strong>: it’s <strong>perpendicular</strong> to the line. A point is on the line exactly when the arrow from a known point to it is perpendicular to the normal. That one dot product gives the <strong>Cartesian equation</strong>.",
    fig:{ aria:"The line 2x + 3y − 6 = 0 with the normal (2, 3) drawn from (3, 0) and a right-angle mark; a point P slides along the line while the arrow from (3, 0) to P stays at 90° to the normal.", shape:"square" }
  },
  goals:[
    "I can read a normal vector `(A, B)` from `Ax + By + C = 0` and give a direction vector `(B, -A)`.",
    "I can write the Cartesian equation of a line from a point and a normal (or a direction).",
    "I can convert between Cartesian, vector, parametric and slope–intercept forms.",
    "I can decide whether two lines are parallel, perpendicular or neither, and when two equations describe the same line.",
    "I can find the acute angle between two lines."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Dot product", goal:1, prompt:"`(3, -2) · (4, 6)` = ?",
          options:[
            { t:"0", ok:true, why:"`12 - 12 = 0`: perpendicular." },
            { t:"24", why:"`(-2)(6) = -12`." },
            { t:"(12, −12)", why:"Add them: one number." },
            { t:"7", why:"Multiply matching components, then add." }],
          hints:["Multiply matching parts, then add.", "`3(4) + (-2)(6)`.", "0."] },
        { id:"w2", skill:"Dot product", goal:1, prompt:"Which vector is perpendicular to (5, 2)?",
          options:[
            { t:"(2, −5)", ok:true, why:"`10 - 10 = 0`." },
            { t:"(5, −2)", why:"`(5, 2) · (5, -2) = 21`." },
            { t:"(2, 5)", why:"`(5, 2) · (2, 5) = 20`." },
            { t:"(−5, −2)", why:"That’s the opposite direction, which is parallel." }],
          hints:["Perpendicular ⇔ dot product 0.", "Swap the components and change one sign.", "(2, −5)."] },
        { id:"w3", skill:"Vector equations of lines", goal:3, prompt:"Which point is on `vec{r} = (1, 4) + t(2, -1)`?",
          options:[
            { t:"(5, 2)", ok:true, why:"`t = 2`." },
            { t:"(2, −1)", why:"That’s the direction vector." },
            { t:"(3, 5)", why:"`x = 3` needs `t = 1`, which gives `y = 3`." },
            { t:"(5, 6)", why:"`t = 2` gives `y = 4 - 2 = 2`." }],
          hints:["Choose a value of `t`.", "`t = 2`.", "(5, 2)."] },
        { id:"w4", skill:"Vector equations of lines", goal:3, prompt:"Which is a direction vector of the line through (0, 3) and (2, −1)?",
          options:[
            { t:"(1, −2)", ok:true, why:"`(2, -4) = 2(1, -2)`." },
            { t:"(2, 2)", why:"That’s the sum of the points." },
            { t:"(−2, 1)", why:"Slope −2 means run 1, rise −2." },
            { t:"(2, −1)", why:"That’s the second point, not the direction." }],
          hints:["Subtract the points.", "`(2 - 0, -1 - 3) = (2, -4)`.", "(1, −2)."] },
        { id:"w5", skill:"Slope", goal:3, prompt:"Slope of `2x + 3y - 6 = 0`?",
          options:[
            { t:"`-2/3`", ok:true, why:"`y = -{2}/{3}x + 2`." },
            { t:"`2/3`", why:"Move `2x` across: `-2x`." },
            { t:"`-3/2`", why:"Divide by 3, the coefficient of `y`." },
            { t:"2", why:"That’s the `y`-intercept." }],
          hints:["Solve for `y`.", "`3y = -2x + 6`.", "`-2/3`."] },
        { id:"w6", skill:"Slope", goal:4, prompt:"A line has slope `3/4`. What is the slope of a perpendicular line?",
          options:[
            { t:"`-4/3`", ok:true, why:"Negative reciprocal." },
            { t:"`-3/4`", why:"Only the sign changed." },
            { t:"`4/3`", why:"Only flipped; the sign must change too." },
            { t:"`3/4`", why:"That’s a parallel line." }],
          hints:["Perpendicular slopes multiply to −1.", "Flip and change the sign.", "`-4/3`."] }
      ],
      refreshers:{
        "Dot product":"`(a, b) · (c, d) = ac + bd`; it is 0 exactly when the vectors are perpendicular. `(a, b)` is always perpendicular to `(b, -a)`.",
        "Vector equations of lines":"`vec{r} = vec{r}_0 + tvec{m}`: a point plus multiples of a direction (module 48).",
        "Slope":"Solve for `y` to read the slope. Perpendicular slopes are negative reciprocals."
      }
    }
  },
  explore:{
    heading:"Normal dial",
    intro:"Drag the normal arrow and watch the line turn so it stays perpendicular. Then test points to see which side of the line they’re on.",
    modes:[{ id:"normal", t:"Normal" }, { id:"test", t:"Test point" }, { id:"convert", t:"Convert" }],
    txt:{
      mode:"Mode", nH:"Normal " + N + " = `(A, B)`", p0:"Point `P_0`", q:"Test point `Q`",
      dragNote:"Drag `P_0` (black), the tip of " + N + " (magenta) or `Q`. Tab to a point, then use the arrow keys to move it one step.",
      reset:"Reset", work:"Show the working", hideWork:"Hide the working",
      key:"The line in black; the normal " + N + " in magenta with a right-angle mark; the direction `vec{m}` faint blue.",
      rows:{ n:"Normal " + N, m:"Direction `vec{m}`", cart:"Cartesian equation", slope:"Slope and `y`-intercept", vec:"Vector equation", test:"Test point", a:"Point `A`", b:"Point `B`" },
      vertical:"vertical line", side:{ pos:"so it is on the side " + N + " points to", zero:"on the line", neg:"so it is on the other side" },
      formsH:"The four forms (edit any one)", forms:{ cart:"Cartesian", vec:"Vector", par:"Parametric", si:"Slope–intercept" },
      formNote:{ fill:"Fill in every box.", err:"Type whole numbers (fractions in the slope–intercept form).", zero:"The direction (or `A` and `B`) can’t be zero.",
        range:"Keep the point and the normal on the board: coordinates from −6 to 6.", none:"This line has no whole-number point on the board. Try other numbers.",
        vertical:"Vertical line: it has no slope–intercept form.", ok:"✓ Drawn." },
      nRange:"(−6 to 6, not both 0)"
    },
    predIntro:"Make a prediction first. Then the normal dial shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Normal mode, " + N + " `= (2, 3)`. Which way does the line run?",
        options:[{ t:"along (3, −2)", ok:true }, { t:"along (2, 3)" }, { t:"along (3, 2)" }, { t:"along (2, −3)" }],
        explain:"`(2, 3) · (3, -2) = 0`. (2, 3) itself is the normal; (3, 2) and (2, −3) aren’t perpendicular to it." },
      { id:"p2", prompt:"Double the normal to (4, 6), keeping `P_0`. What happens to the line?",
        options:[{ t:"nothing", ok:true }, { t:"it rotates" }, { t:"it moves" }, { t:"it gets steeper" }],
        explain:"Every term doubled: same points, same line. The equation becomes `4x + 6y - 12 = 0`." },
      { id:"p3", prompt:"Test point mode, line `2x + 3y - 6 = 0`, `Q = (3, 2)`. Where is `Q`?",
        options:[{ t:"on the side the normal points to", ok:true }, { t:"on the line" }, { t:"on the other side" }, { t:"you can’t tell without a graph" }],
        explain:"`2(3) + 3(2) - 6 = 6 > 0`." },
      { id:"p4", prompt:"Drag `P_0` along the line. What happens to `C`?",
        options:[{ t:"it stays the same", ok:true }, { t:"it changes" }, { t:"it becomes 0" }, { t:"it doubles" }],
        explain:"Every point on the line gives the same `C = -(Ax_0 + By_0)`, because they all satisfy the equation." }
    ],
    chalIntro:"Use the normal dial, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Set " + N + " and `P_0` so the line is `3x - 4y + 2 = 0`.",
        why:"`vec{n} = (3, -4)` and `P_0` satisfies `3x_0 - 4y_0 = -2`, so `C = 2`.",
        hints:["Read " + N + " from the coefficients.", N + " `= (3, -4)`. Now find a grid point with `3x - 4y = -2`.", "(2, 2): `6 - 8 = -2`."],
        msgs:{ dir:"That’s the direction, so you’ve drawn the perpendicular line.", point:"Parallel, but `C` comes out wrong: check `3x_0 - 4y_0 = -2`.",
          general:"Not yet: read the normal from the coefficients of `x` and `y`." } },
      { id:"tc2", goal:[2, 4], prompt:"Make a line perpendicular to `x - 2y + 5 = 0` that passes through (1, 3).",
        why:"The normal (2, 1) is the given line’s direction, and `2(1) + 3 - 5 = 0`: the line is `2x + y - 5 = 0`.",
        hints:["A perpendicular line’s normal is the given line’s <strong>direction</strong>.", "The given direction is (2, 1).", "`2x + y + C = 0` through (1, 3): `C = -5`."],
        msgs:{ same:"Same normal as the given line: that’s parallel.", m2:"`(2, -1) · (1, -2) = 4 ≠ 0`: not perpendicular.",
          point:"Perpendicular, but the line misses (1, 3): move `P_0` onto `2x + y - 5 = 0`.",
          general:"Not yet: the new normal must be perpendicular to (1, −2)." } },
      { id:"tc3", goal:[1, 4], stretch:true, prompt:"Test point mode, with A(−2, 1) and B(4, 3) shown. Place a line so that A and B are on <strong>opposite sides</strong>, the line is <strong>perpendicular to AB</strong>, and A and B are the <strong>same distance</strong> from it.",
        why:"`vec{n} = (3, 1)` through the midpoint (1, 2): `3x + y - 5 = 0`, the perpendicular bisector. The values at A and B are −10 and 10.",
        hints:["Perpendicular to AB means " + N + " `= B - A = (6, 2)`, or (3, 1).", "Equal distances: the line must pass through the midpoint of AB.", "Midpoint (1, 2): `3(1) + 2 + C = 0`, so `3x + y - 5 = 0`."],
        msgs:{ mode:"Switch to <strong>Test point</strong> mode to see A and B.", along:"That line runs along AB.",
          origin:"Perpendicular, and A and B are on opposite sides (−5 and 15), but not equally far: the values differ.",
          unequal:"Perpendicular, and A and B are on opposite sides, but not equally far: the values {a} and {b} differ.",
          onA:"A is on the line, not on one side.", onB:"B is on the line, not on one side.",
          general:"Not yet: the normal must be parallel to AB, and the values at A and B must be opposites." } }
    ]
  },
  part3:{
    slug:"angles", name:"Angles",
    heading:"Angles between lines",
    intro:"With normals, comparing two lines becomes dot-product work: parallel, perpendicular or an exact angle. Turn a line in the protractor view and watch the normals’ angle match the lines’ angle.",
    labels:{
      pairs:"Pair on the board", turn:"Turn line 2", turnNote:"Line 2 turns about the crossing point, 5° at a time.", use:"Measure with",
      useN:"Normals", useD:"Directions", reset:"Reset turn", line1:"Line 1", line2:"Line 2", turned:"(turned {d}°)",
      rows:{ eq1:"Line 1", eq2:"Line 2", nn:"Angle between the normals", dd:"Angle between the directions", lines:"Angles between the lines", cos:"`cos θ`" },
      parallel:"Parallel: the lines never cross.", same:"The same line.", match:"one of the two angles between the lines",
      key:"Line 1 in black, line 2 in teal; their normals (or directions) in magenta, `vec{n}_1` solid and `vec{n}_2` dashed.",
      graph:"Two lines with their normals and a protractor arc"
    },
    pairs:[
      { id:"s1", t:"Station 1, pair 1", l1:[3, -1, 1], l2:[6, -2, -5] },
      { id:"s2", t:"Station 1, pair 2", l1:[1, 2, -3], l2:[2, -1, 4] },
      { id:"w1", t:"Worked 1", l1:[1, -1, 1], l2:[0, 1, -3] },
      { id:"w2", t:"Worked 2", l1:[2, -1, 3], l2:[1, -3, -1] },
      { id:"w3", t:"Worked 3", l1:[1, 0, -2], l2:[1, 1.7320508075688772, -4], r3:true }
    ],
    st1:{ title:"Station 1: Parallel or perpendicular?",
      text:"Each pair is drawn with its normals. Choose the verdict, then open “Check it with algebra”: " + "`vec{n}_1 = kvec{n}_2` (parallel) or `vec{n}_1 · vec{n}_2 = 0` (perpendicular).",
      verdicts:[{ id:"par", t:"parallel" }, { id:"perp", t:"perpendicular" }, { id:"same", t:"the same line" }, { id:"nei", t:"neither" }],
      items:[
        { id:"s1", prompt:"`3x - y + 1 = 0` and `6x - 2y - 5 = 0` are…", answer:"par",
          fb:{ par:"Right. `(6, -2) = 2(3, -1)`, but `-5 ≠ 2 × 1`: parallel, not the same.",
            perp:"`(3, -1) · (6, -2) = 20 ≠ 0`. " + M4,
            same:"The whole equation must be a multiple, `C` included: `2 × 1 = 2`, not −5.",
            nei:"`(6, -2) = 2(3, -1)`: the normals are multiples." },
          alg:"`vec{n}_1 = (3, -1)` and `vec{n}_2 = (6, -2) = 2(3, -1)`: parallel normals, so parallel lines. Doubling `3x - y + 1 = 0` gives `6x - 2y + 2 = 0`, and `2 ≠ -5`, so the lines are distinct." },
        { id:"s2", prompt:"`x + 2y - 3 = 0` and `2x - y + 4 = 0` are…", answer:"perp",
          fb:{ perp:"Right. `(1, 2) · (2, -1) = 2 - 2 = 0`.",
            par:"`(1, 2) · (2, -1) = 0`. " + M4,
            same:"The normals aren’t even parallel.",
            nei:"The dot product is 0: `(1, 2) · (2, -1) = 0`." },
          alg:"`vec{n}_1 · vec{n}_2 = (1)(2) + (2)(-1) = 0`: perpendicular normals, so perpendicular lines." }
      ] },
    st2:{ title:"Station 2: The angle from normals",
      text:"The protractor marks both angles between the lines (θ and 180° − θ) and the angle between the normals. Turn line 2: the normals’ angle always equals one of the two angles between the lines.",
      formula:"`cos θ = |vec{n}_1 · vec{n}_2|/(|vec{n}_1||vec{n}_2|)` gives the <strong>acute</strong> angle θ.",
      worked:[
        { id:"w1", t:"`x - y + 1 = 0` and `y = 3`: `cos θ = |-1|/(√2 × 1)`, so `θ = 45°`." },
        { id:"w2", t:"`2x - y + 3 = 0` and `x - 3y - 1 = 0`: `|2 + 3|/(√5 √10) = 5/(5√2)`, so `θ = 45°`." },
        { id:"w3", t:"`x = 2` and `x + √3y - 4 = 0`: `|1|/(1 × 2)`, so `θ = 60°`." }
      ],
      show:"Show on the board" },
    st3:{ title:"Station 3: Same answer from directions",
      text:"Switch <strong>Measure with</strong> to Directions. The same pairs, using direction vectors `(B, -A)`, give the same acute angle.",
      banner:"Normals or directions: either works, as long as you take the acute angle." },
    quickCheck:{
      title:"Quick check", summary:"Angles between lines quick check",
      items:[
        { id:"q1", goal:4, prompt:"`3x - y + 1 = 0` and `6x - 2y - 5 = 0` are…",
          choices:[{ t:"parallel", ok:true, fb:"Right. `(6, -2) = 2(3, -1)`, but `-5 ≠ 2 × 1`: parallel, not the same." },
            { t:"perpendicular", fb:"`(6, -2) = 2(3, -1)`, but `-5 ≠ 2 × 1`: parallel, not the same." },
            { t:"the same line", fb:"`(6, -2) = 2(3, -1)`, but `-5 ≠ 2 × 1`: parallel, not the same." },
            { t:"neither", fb:"`(6, -2) = 2(3, -1)`, but `-5 ≠ 2 × 1`: parallel, not the same." }] },
        { id:"q2", goal:5, prompt:"Acute angle between `x = 3` and `x - y + 2 = 0`?",
          choices:[{ t:"45°", ok:true, fb:"Right. `|(1, 0) · (1, -1)| = 1`, over `1 × √2`." },
            { t:"135°", fb:"`|(1, 0) · (1, -1)| = 1`, over `1 × √2`. " + M5 },
            { t:"90°", fb:"`|(1, 0) · (1, -1)| = 1`, over `1 × √2`." },
            { t:"60°", fb:"`|(1, 0) · (1, -1)| = 1`, over `1 × √2`." }] },
        { id:"q3", goal:4, prompt:"`x + 2y - 3 = 0` and `2x - y + 4 = 0` are…",
          choices:[{ t:"perpendicular", ok:true, fb:"Right. `(1, 2) · (2, -1) = 0`." },
            { t:"parallel", fb:"`(1, 2) · (2, -1) = 0`. " + M4 },
            { t:"the same line", fb:"`(1, 2) · (2, -1) = 0`." },
            { t:"neither", fb:"`(1, 2) · (2, -1) = 0`." }] },
        { id:"q4", goal:1, prompt:"A direction vector for `5x + 2y - 1 = 0`?",
          choices:[{ t:"(2, −5)", ok:true, fb:"Right. `(5, 2) · (2, -5) = 0`." },
            { t:"(5, 2)", fb:"(5, 2) is the normal; a direction must dot to 0 with it." },
            { t:"(2, 5)", fb:"(5, 2) is the normal; a direction must dot to 0 with it." },
            { t:"(−5, 2)", fb:"(5, 2) is the normal; a direction must dot to 0 with it." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Cartesian ↔ vector equation", summary:"Cartesian ↔ vector equation", goal:[1, 3],
        instruction:"Match each Cartesian equation with the vector equation of the same line.",
        leftTitle:"Cartesian", rightTitle:"Vector",
        left:[
          { id:"l1", t:"`2x + y - 4 = 0`" },
          { id:"l2", t:"`x - 3y + 3 = 0`" },
          { id:"l3", t:"`3x + 2y - 6 = 0`" },
          { id:"l4", t:"`x + 2y - 4 = 0`", hints:["Direction = `(B, -A)`.", "(2, −1); is (2, 1) on `x + 2y - 4 = 0`?", "`2 + 2 - 4 = 0` ✓."] },
          { id:"l5", t:"`y - 3 = 0`" },
          { id:"l6", t:"`x + 2 = 0`", hints:["`x + 2 = 0` means `x = -2`: a vertical line.", "Normal (1, 0), so direction (0, 1).", "`vec{r} = (-2, 0) + t(0, 1)`."] },
          { id:"l7", t:"`4x - y = 0`" },
          { id:"l8", t:"`2x - y + 1 = 0`" }
        ],
        right:[
          { id:"r1", t:"`vec{r} = (2, 0) + t(1, -2)`" }, { id:"r2", t:"`vec{r} = (0, 1) + t(3, 1)`" },
          { id:"r3", t:"`vec{r} = (2, 0) + t(2, -3)`" }, { id:"r4", t:"`vec{r} = (2, 1) + t(2, -1)`" },
          { id:"r5", t:"`vec{r} = (0, 3) + t(1, 0)`" }, { id:"r6", t:"`vec{r} = (-2, 0) + t(0, 1)`" },
          { id:"r7", t:"`vec{r} = t(1, 4)`" }, { id:"r8", t:"`vec{r} = (0, 1) + t(1, 2)`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r3":"Same point (2, 0), but `(2, -3) · (2, 1) = 1 ≠ 0`. " + M2,
          "l2|r8":"Same point (0, 1), but `(1, 2) · (1, -3) = -5 ≠ 0`.",
          "l8|r4":M1, "l4|r8":M1, "l5|r6":M1, "l6|r5":M1 },
        wrongDefault:"Check two things: the point satisfies the equation, and `vec{n} · vec{m} = 0`." },
      { id:"coef", type:"custom", title:"Find the coefficient", summary:"Find the coefficient", star:true, goal:[2, 3, 4, 5],
        instruction:"Find each coefficient, equation or angle. Items 4 to 7 are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −6 or 8/3 in the boxes. For an equation, any multiple of a correct equation counts. Then press Check.",
        msgs:{ fill:"Fill in every box first.", err:"Type whole numbers or fractions only, such as −6 or 8/3.", zero:"`A` and `B` can’t both be 0.",
          general:"Not yet. Check your work and try again.", lineC:M3 },
        items:[
          { id:"n1", goal:2, prompt:"Find `C` for the line through (3, −1) with normal (2, 5).", form:"num", label:"`C =`",
            answer:-1, display:"`C = -1`", wrong:[{ v:1, fb:"`2(3) + 5(-1) + C = 0` gives `C = -1`." }],
            general:M3, why:"`2(3) + 5(-1) + C = 0`, so `1 + C = 0`." },
          { id:"n2", goal:4, prompt:"Find `k` so that `3x + ky - 1 = 0` is perpendicular to `2x - 6y + 5 = 0`.", form:"num", label:"`k =`",
            answer:1, display:"`k = 1`", wrong:[{ v:-9, fb:"That makes them parallel." }],
            general:"Perpendicular lines: the normals’ dot product is 0.", why:"`(3, k) · (2, -6) = 6 - 6k = 0`." },
          { id:"n3", goal:4, prompt:"Find `k` so that `kx + 4y + 7 = 0` is parallel to `3x - 2y + 1 = 0`.", form:"num", label:"`k =`",
            answer:-6, display:"`k = -6`", wrong:[{ v:6, fb:"`(k, 4) = -2(3, -2)` needs `k = -6`." }, { v:2.6666666666666665, fb:"That’s perpendicular." }],
            general:"Parallel lines: the normals are multiples.", why:"`(k, 4) = -2(3, -2)`." },
          { id:"n4", goal:3, star:true, prompt:"Write the Cartesian equation of `vec{r} = (1, -2) + t(4, 3)` as `Ax + By + C = 0`.", form:"line",
            answer:[3, -4, -11], display:"`3x - 4y - 11 = 0`", wrong:[{ line:[4, 3, 2], fb:"That uses the direction as the normal." }],
            why:"`vec{n} = (3, -4)` is perpendicular to (4, 3), and `3(1) - 4(-2) - 11 = 0`.",
            hints:["The normal is perpendicular to (4, 3).", "`vec{n} = (3, -4)`; `3x - 4y + C = 0`.", "`3(1) - 4(-2) + C = 0`, so `C = -11`."] },
          { id:"n5", goal:5, star:true, prompt:"Acute angle between `2x - y + 3 = 0` and `x - 3y - 1 = 0`, in degrees.", form:"num", label:"θ =", unit:"°",
            answer:45, display:"45°", wrong:[{ v:135, fb:M5 }],
            general:"Use `cos θ = |vec{n}_1 · vec{n}_2|/(|vec{n}_1||vec{n}_2|)`.", why:"`|2 + 3|/(√5 √10) = 5/(5√2) = 1/√2`." },
          { id:"n6", goal:2, star:true, prompt:"Cartesian equation of the line through (4, 1) perpendicular to `vec{r} = t(2, -5)`.", form:"line",
            answer:[2, -5, -3], display:"`2x - 5y - 3 = 0`", wrong:[{ line:[5, 2, -22], fb:"That line is parallel to `vec{r} = t(2, -5)`." }],
            why:"The direction (2, −5) is the new normal, and `2(4) - 5(1) - 3 = 0`." },
          { id:"n7", goal:4, star:true, prompt:"For which `k` are `kx + 2y - 1 = 0` and `2x + ky + 1 = 0` the <strong>same</strong> line?", form:"num", label:"`k =`",
            answer:-2, display:"`k = -2`", wrong:[{ v:2, fb:"Then the lines are parallel but distinct: `2x + 2y - 1 = 0` and `2x + 2y + 1 = 0`." }],
            general:"Same line: one whole equation must be a multiple of the other.", why:"`-2x + 2y - 1 = 0` is −1 times `2x - 2y + 1 = 0`.",
            hints:["Same line: one equation must be a multiple of the other.", "Parallel first: `k/2 = 2/k`, so `k = ±2`.", "`k = -2`: `-2x + 2y - 1 = 0` and `2x - 2y + 1 = 0` are negatives of each other: the same line."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Zain", goal:[2, 4, 5],
        instruction:"Zain made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write the Cartesian equation of the line through P(2, −3) with direction vector (4, 1).",
            steps:["A normal is perpendicular to (4, 1): `vec{n} = (1, -4)`.", "So the equation is `x - 4y + C = 0`.", "Substitute P: `2 - 4(-3) + C = 0`, so `14 + C = 0` and `C = 14`.", "`x - 4y + 14 = 0`."],
            answer:2,
            stepFb:["Step 1 is correct: `4 - 4 = 0`.", "Step 2 is correct.", "", "Step 4 uses step 3’s `C`. The mistake is earlier."],
            fixes:[
              { t:"`14 + C = 0` gives `C = -14`: `x - 4y - 14 = 0`.", ok:true, why:M3 },
              { t:"`vec{n}` should be (4, 1).", why:M1 },
              { t:"`-4(-3) = -12`, so `C = 10`.", why:"`-4 × -3 = +12`." },
              { t:"Step 3 is correct.", why:"Check P: `2 + 12 + 14 = 28 ≠ 0`. " + M3 }],
            hints:["Does P satisfy the final equation?", "`2 + 12 + 14 ≠ 0`.", "`C = -14`."] },
          { id:"e2", goal:4, task:"Are `2x - 3y + 6 = 0` and `6x + 4y - 1 = 0` parallel, perpendicular or neither?",
            steps:["`vec{n}_1 = (2, -3)` and `vec{n}_2 = (6, 4)`.", "`vec{n}_1 · vec{n}_2 = 12 - 12 = 0`.", "The normals are perpendicular, so the lines are parallel.", "The lines are parallel."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Perpendicular normals mean perpendicular lines.", ok:true, why:M4 },
              { t:"(6, 4) = 3(2, −3), so they’re parallel.", why:"`3(2, -3) = (6, -9)`." },
              { t:"Neither: the dot product isn’t 1.", why:"A dot product of 0 is the perpendicular test; no test uses 1." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Each normal is at 90° to its own line.", "Turn both lines by 90° and you get the normals, so the angles match.", "Perpendicular."] },
          { id:"e3", goal:5, task:"Find the acute angle between `x - y + 1 = 0` and `y = 3`.",
            steps:["`vec{n}_1 = (1, -1)` and `vec{n}_2 = (0, 1)`, so `vec{n}_1 · vec{n}_2 = -1`.", "`|vec{n}_1| = √2` and `|vec{n}_2| = 1`.", "`cos θ = -1/√2`, so the normals meet at 135°.", "So the acute angle between the lines is 135°."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct for the normals.", ""],
            fixes:[
              { t:"135° isn’t acute; the lines also meet at 180° − 135° = 45°. (Or use `|vec{n}_1 · vec{n}_2|`.)", ok:true, why:M5 },
              { t:"`cos 45° = -1/√2`, so `θ = 45°`.", why:"`cos 45°` is positive." },
              { t:"One line is horizontal, so the angle is 90°.", why:"A horizontal line meets a line of slope 1 at 45°, not 90°." },
              { t:"Step 4 is correct.", why:M5 }],
            hints:["Is 135° acute?", "Two lines make supplementary angles.", "45°."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the normal dial: that `(A, B)` points away from the line, or that `C` never changes as `P_0` slides?" },
      { id:"j2", q:"In your own words, why does `vec{n} · (vec{r} - vec{r}_0) = 0` describe a line?" },
      { id:"j3", q:"Explain to a friend how to turn a vector equation into a Cartesian equation." },
      { id:"j4", q:"Which still trips you up: normal vs direction, the sign of `C`, or the acute angle? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a normal vector to `3x - 5y + 2 = 0`?", options:[
          { t:"(3, −5)", ok:true, why:"The coefficients of `x` and `y`." },
          { t:"(5, 3)", why:"That’s a direction vector along the line. " + M1 },
          { t:"(3, 5)", why:"The sign of `B` is −5." },
          { t:"(−5, 3)", why:"`A` and `B` swapped: `(-5, 3) · (3, -5) ≠ 0` and it isn’t a multiple." }] },
        b:{ prompt:"Which is a normal vector to `4x + y - 7 = 0`?", options:[
          { t:"(4, 1)", ok:true, why:"The coefficients of `x` and `y`." },
          { t:"(1, −4)", why:"That’s a direction vector along the line. " + M1 },
          { t:"(4, −1)", why:"The sign of `B` is +1." },
          { t:"(1, 4)", why:"`A` and `B` swapped: (1, 4) isn’t a multiple of (4, 1)." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Cartesian equation of the line through (1, 4) with normal (2, −1)?", options:[
          { t:"`2x - y + 2 = 0`", ok:true, why:"`2(1) - 4 + C = 0` gives `C = 2`." },
          { t:"`2x - y - 2 = 0`", why:"Check (1, 4): `2 - 4 - 2 ≠ 0`. " + M3 },
          { t:"`x + 2y - 9 = 0`", why:"That treats (2, −1) as a direction." },
          { t:"`2x - y = 0`", why:"`C` isn’t 0 unless the line passes through the origin." }] },
        b:{ prompt:"Cartesian equation of the line through (−2, 3) with normal (3, 1)?", options:[
          { t:"`3x + y + 3 = 0`", ok:true, why:"`-6 + 3 + C = 0` gives `C = 3`." },
          { t:"`3x + y - 3 = 0`", why:"Check (−2, 3): `-6 + 3 - 3 ≠ 0`. " + M3 },
          { t:"`x - 3y + 11 = 0`", why:"That treats (3, 1) as a direction." },
          { t:"`3x + y = 0`", why:"`C` isn’t 0 unless the line passes through the origin." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"How are `2x + 6y - 1 = 0` and `x + 3y + 4 = 0` related?", options:[
          { t:"Parallel and distinct", ok:true, why:"`(2, 6) = 2(1, 3)`, but `-1 ≠ 2 × 4`." },
          { t:"The same line", why:"The whole equation must be a multiple, including `C`." },
          { t:"Perpendicular", why:"Parallel normals mean parallel lines." },
          { t:"Neither", why:"The normals are multiples." }] },
        b:{ prompt:"How are `3x - y + 2 = 0` and `x + 3y - 5 = 0` related?", options:[
          { t:"Perpendicular", ok:true, why:"`(3, -1) · (1, 3) = 0`." },
          { t:"Parallel", why:"`(3, -1) · (1, 3) = 0`. " + M4 },
          { t:"The same line", why:"The normals aren’t even parallel." },
          { t:"Neither", why:"The dot product is 0." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Cartesian equation of `vec{r} = (2, -1) + t(3, 2)`?", options:[
          { t:"`2x - 3y - 7 = 0`", ok:true, why:"`vec{n} = (2, -3)`; `4 + 3 + C = 0`." },
          { t:"`3x + 2y - 4 = 0`", why:"That uses the direction (3, 2) as the normal." },
          { t:"`2x - 3y + 7 = 0`", why:"Check (2, −1): `4 + 3 + 7 ≠ 0`." },
          { t:"`2x + 3y - 1 = 0`", why:"`(2, 3) · (3, 2) = 12 ≠ 0`." }] },
        b:{ prompt:"Cartesian equation of `vec{r} = (-1, 4) + t(1, -2)`?", options:[
          { t:"`2x + y - 2 = 0`", ok:true, why:"`vec{n} = (2, 1)`; `-2 + 4 + C = 0`." },
          { t:"`x - 2y + 9 = 0`", why:"That uses the direction (1, −2) as the normal." },
          { t:"`2x + y + 2 = 0`", why:"Check (−1, 4): `-2 + 4 + 2 ≠ 0`." },
          { t:"`2x - y + 6 = 0`", why:"`(2, -1) · (1, -2) = 4 ≠ 0`." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"For which `k` is `kx - 2y + 5 = 0` perpendicular to `3x + 4y - 1 = 0`?", options:[
          { t:"`k = 8/3`", ok:true, why:"`3k - 8 = 0`." },
          { t:"`k = -3/2`", why:"That makes them parallel." },
          { t:"`k = -8/3`", why:"Sign: `(k, -2) · (3, 4) = 3k - 8`." },
          { t:"`k = 3/8`", why:"`3k = 8` gives `8/3`." }] },
        b:{ prompt:"For which `k` is `kx + 3y - 2 = 0` parallel to `4x - 6y + 1 = 0`?", options:[
          { t:"`k = -2`", ok:true, why:"`(k, 3) = -{1}/{2}(4, -6)`." },
          { t:"`k = 9/2`", why:"That makes them perpendicular." },
          { t:"`k = 2`", why:"The ratio `B/A` is negative: `3/k = -6/4`." },
          { t:"`k = -1/2`", why:"The ratio is inverted." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Acute angle between `vec{r} = (1, 0) + t(1, 2)` and `vec{r} = (0, 3) + s(1, -3)`?", options:[
          { t:"45°", ok:true, why:"`|(1, 2) · (1, -3)| = 5`; `√5 × √10 = 5√2`; `cos θ = 1/√2`." },
          { t:"135°", why:"That’s the obtuse angle between the directions." },
          { t:"60°", why:"`cos θ = 5/(5√2)`, not `5/10`." },
          { t:"90°", why:"The dot product is −5, not 0." }] },
        b:{ prompt:"Acute angle between `vec{r} = (2, 1) + t(3, 1)` and `vec{r} = s(-1, -2)`?", options:[
          { t:"45°", ok:true, why:"`|-3 - 2| = 5` over `√10 × √5`." },
          { t:"135°", why:"That’s the obtuse angle between the directions." },
          { t:"60°", why:"Over `5√2`, not 10." },
          { t:"90°", why:"The dot product is −5." }] } },
      { id:"c1", cat:"C", goal:[1, 4],
        a:{ prompt:"Which best explains why (4, −3) is a normal to `4x - 3y + 12 = 0`?", options:[
          { t:"For two points on the line, subtracting their equations gives `4Δx - 3Δy = 0`, so `(4, -3) · (Δx, Δy) = 0`: it’s perpendicular to every direction along the line.", ok:true, why:"Subtracting removes `C` and leaves a dot product of 0." },
          { t:"(4, −3) points along the line, because those are the coefficients.", why:M1 },
          { t:"Because the slope is `4/(-3)`.", why:"The slope is `-A/B = 4/3`, and slope says nothing about normals by itself." },
          { t:"Because 4 and −3 add to 1.", why:"The sum of the coefficients isn’t relevant." }] },
        b:{ prompt:"Which best explains why `2x - 4y + 6 = 0` and `x - 2y + 3 = 0` describe the same line?", options:[
          { t:"The first is 2 times the second, so every `(x, y)` that satisfies one satisfies the other.", ok:true, why:M6 },
          { t:"Their normals are parallel, so they’re the same line.", why:"Parallel lines have parallel normals too." },
          { t:"They have the same `x`-intercept.", why:"One shared point isn’t enough." },
          { t:"They’re different lines, because the coefficients differ.", why:M6 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which shows the line through (0, 2) and (3, 0) correctly in three forms?", options:[
          { t:"`2x + 3y - 6 = 0`; `vec{r} = (0, 2) + t(3, -2)`; `x = 3t`, `y = 2 - 2t`", ok:true, why:"Both points satisfy `2x + 3y - 6 = 0`, and `(2, 3) · (3, -2) = 0`." },
          { t:"`2x + 3y - 6 = 0`; `vec{r} = (0, 2) + t(2, 3)`; `x = 2t`, `y = 2 + 3t`", why:"(2, 3) is the normal, not a direction." },
          { t:"`3x + 2y - 6 = 0`; `vec{r} = (0, 2) + t(3, -2)`; `x = 3t`, `y = 2 - 2t`", why:"(3, 2) isn’t perpendicular to (3, −2); (3, 0) doesn’t satisfy it." },
          { t:"`2x + 3y - 6 = 0`; `vec{r} = (3, 0) + t(3, -2)`; `x = 3 + 3t`, `y = 2t`", why:"The parametric form doesn’t match the vector form: `y` should be `-2t`." }] },
        b:{ prompt:"Which shows the line through (0, −1) and (2, 3) correctly in three forms?", options:[
          { t:"`2x - y - 1 = 0`; `vec{r} = (0, -1) + t(1, 2)`; `x = t`, `y = -1 + 2t`", ok:true, why:"Both points satisfy `2x - y - 1 = 0`, and `(2, -1) · (1, 2) = 0`." },
          { t:"`2x - y - 1 = 0`; `vec{r} = (0, -1) + t(2, -1)`; `x = 2t`, `y = -1 - t`", why:"(2, −1) is the normal, not a direction." },
          { t:"`x - 2y - 2 = 0`; `vec{r} = (0, -1) + t(1, 2)`; `x = t`, `y = -1 + 2t`", why:"(1, −2) isn’t perpendicular to (1, 2); (2, 3) doesn’t satisfy it." },
          { t:"`2x - y - 1 = 0`; `vec{r} = (0, -1) + t(1, 2)`; `x = t`, `y = 1 + 2t`", why:"The parametric form has the wrong starting `y`." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"On a city map (km), a straight road passes through the library L(2, 1) and is perpendicular to the path from L to the school S(5, 5). What is the road’s Cartesian equation?", options:[
          { t:"`3x + 4y - 10 = 0`", ok:true, why:"`vec{n} = vec{LS} = (3, 4)`; `6 + 4 + C = 0`." },
          { t:"`4x - 3y - 5 = 0`", why:"That road runs along `vec{LS}`." },
          { t:"`3x + 4y - 35 = 0`", why:"That passes through the school, not the library." },
          { t:"`3x + 4y + 10 = 0`", why:"Check L: `6 + 4 + 10 ≠ 0`. " + M3 }] },
        b:{ prompt:"A road passes through L(1, 3) and is perpendicular to the path from L to S(4, −1). Its Cartesian equation?", options:[
          { t:"`3x - 4y + 9 = 0`", ok:true, why:"`vec{n} = (3, -4)`; `3 - 12 + C = 0`." },
          { t:"`4x + 3y - 13 = 0`", why:"That road runs along `vec{LS}`." },
          { t:"`3x - 4y - 16 = 0`", why:"That passes through the school, not the library." },
          { t:"`3x - 4y - 9 = 0`", why:"Check L: `3 - 12 - 9 ≠ 0`. " + M3 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Two straight ski trails follow `3x + y - 6 = 0` and `x + 2y - 4 = 0` on a map. At what acute angle do they cross?", options:[
          { t:"45°", ok:true, why:"`|(3, 1) · (1, 2)| = 5`; `√10 × √5 = 5√2`." },
          { t:"135°", why:"The question asks for the acute angle." },
          { t:"60°", why:"`√10 × √5 = √50 = 5√2`, not 10." },
          { t:"90°", why:"The dot product is 5, not 0." }] },
        b:{ prompt:"Trails follow `2x - y + 1 = 0` and `x - 3y + 6 = 0`. Acute angle where they cross?", options:[
          { t:"45°", ok:true, why:"`|2 + 3| = 5` over `√5 × √10`." },
          { t:"135°", why:"The question asks for the acute angle." },
          { t:"60°", why:"`√50`, not 10." },
          { t:"90°", why:"The dot product is 5." }] } }
    ]
  },
  task:{
    title:"Split the pair", summary:"Split the pair",
    statement:"<p>Design a line `Ax + By + C = 0` that meets every condition. Can you find all the different lines?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>It is parallel to `2x - y + 7 = 0`.</li><li>A(3, 1) and B(−1, 5) are on opposite sides of it.</li><li>Its `x`-intercept and `y`-intercept are both whole numbers.</li><li>It does not pass through the origin.</li></ol></div>" +
      "<p class=\"tiny muted\">`A`, `B` and `C` are whole numbers from −6 to 6 (`A` and `B` not both 0). Equivalent equations, such as `4x - 2y + 4 = 0` and `2x - y + 2 = 0`, count as the same line.</p>",
    checks:["Parallel to `2x - y + 7 = 0`", "A and B on opposite sides", "Whole-number intercepts", "Not through the origin"],
    tips:["Parallel lines share a normal: use `2x - y + C = 0`.",
      "Substitute A and B. One value must be positive and the other negative: `5 + C` and `-7 + C`.",
      "For `2x - y + C = 0` the intercepts are `-C/2` and `C`: `C` must be even.",
      "`C = 0` passes through (0, 0)."],
    explainPrompt:"Explain how you used the normal to make the line parallel, and how substituting A and B decided which values of `C` work.",
    vocab:"Use the words normal vector, parallel, Cartesian equation and opposite sides.",
    more:"There’s more than one line. Can you find them all?",
    afterAt:5,
    after3:"Line 2 forces `-5 < C < 7`, line 3 forces `C` to be even, and line 4 removes `C = 0`. That leaves five lines, all with the same normal (2, −1).",
    labels:{ A:"`A`", B:"`B`", C:"`C`", range:"(−6 to 6)", invalid:"Choose whole numbers from −6 to 6, with `A` and `B` not both 0.",
      eq:"Your line", atA:"Value at A(3, 1)", atB:"Value at B(−1, 5)", ints:"Intercepts", none:"none", pos:"positive", neg:"negative", zero:"0: on the line",
      graph:"Graph of your line with A and B" }
  },
  cards:[
    ["Cartesian (scalar) equation of a line in R²", "`Ax + By + C = 0`."],
    ["Normal vector", "`vec{n} = (A, B)`, perpendicular to the line."],
    ["Direction vector from `Ax + By + C = 0`", "`(B, -A)` (any non-zero multiple)."],
    ["Equation from a point and a normal", "`vec{n} · (vec{r} - vec{r}_0) = 0`, so `C = -(Ax_0 + By_0)`."],
    ["Vector → Cartesian", "Swap the direction’s components and change one sign to get `vec{n}`; then find `C` from the point."],
    ["Parallel lines", "Normals are multiples."],
    ["Perpendicular lines", "`vec{n}_1 · vec{n}_2 = 0`."],
    ["Same line", "The whole equation is a multiple of the other, `C` included."],
    ["Acute angle between lines", "`cos θ = |vec{n}_1 · vec{n}_2|/(|vec{n}_1||vec{n}_2|)`."],
    ["Which side of the line?", "The sign of `Ax_0 + By_0 + C`: positive on the side `vec{n}` points to."],
    ["Slope from `Ax + By + C = 0`", "`-A/B` (vertical if `B = 0`)."]
  ]
};
