// MCV4U 55 Systems of Equations (Matrices). Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/55-systems-of-equations-matrices.md
// misconception core sentences (plan §3)
const M1 = "A row operation acts on the <strong>whole</strong> row, including the number after the bar.";
const M2 = "That changes the solutions. Allowed: swap rows, multiply a row by a non-zero number, add a multiple of another row.";
const M3 = "`0x + 0y + 0z = 5` says 0 = 5: impossible. No solution at all.";
const M4 = "Start at the bottom row: it has the fewest variables. Report (`x`, `y`, `z`) in order.";
const M5 = "There’s a whole line of solutions. Let the free variable be `t` and write every variable in terms of `t`.";
const M6 = "Each column is one variable. A missing variable gets a 0 in its column.";
const M7 = "Check the other rows first: a contradiction [0 0 0 | `c`] anywhere means none.";

// an augmented matrix as HTML (true minus signs; screen readers hear the rows in brackets)
const MN = v => String(v).replace(/-/g, "−");
function mx(rows){
  const n = rows[0].length;
  const said = "matrix " + rows.map(r => "[" + r.slice(0, -1).map(MN).join(" ") + " | " + MN(r[n - 1]) + "]").join(", ");
  return '<span class="sy-mx c' + n + '"><span class="vh">' + said + '</span><span class="sy-mxg" aria-hidden="true">' +
    rows.map(r => r.map((v, j) => "<span" + (j === n - 1 ? ' class="sy-b"' : "") + ">" + MN(v) + "</span>").join("")).join("") + "</span></span>";
}

// solution-entry feedback shared by the stepper's Back-substitute panel and Practice 2
const SOL = {
  pick:"Choose one solution, no solution or infinitely many first.",
  num:"Type a whole number or a fraction such as −1/2 in each box.",
  oneWrong:"Substitute your values into every equation: at least one doesn’t hold. Start at the bottom row.",
  rev3:"That’s (`z`, `y`, `x`). Report (`x`, `y`, `z`).",
  rev2:"That’s (`y`, `x`). Report (`x`, `y`).",
  isNone:"Look for a row [0 0 0 | `c`] with `c != 0`: it says 0 = `c`, which is impossible. No solution at all.",
  hasSol:"There’s no row [0 0 0 | `c`] with `c != 0`, so the system has solutions.",
  infButOne:"Every variable has a leading entry and no row is all zeros: exactly one solution.",
  onePoint:"That’s one point; the zero row means a whole line. " + M5,
  isInf:"There’s a zero row and no contradiction: infinitely many solutions. " + M5,
  infNone:M7,
  infWrong:"Substitute your expressions into each equation: they must hold for every value of `t`.",
  noT:"Your expressions don’t use `t`: that’s a single point. " + M5,
  twoParams:"This system has a whole plane of solutions (two free variables), and these boxes take one parameter. Describe it in words: every point of the plane works.",
  right:"Right."
};

const OPS = { swap:"Swap", scale:"Scale", comb:"Scale and add", label:"Row operation", combNote:"Scale and add: two allowed steps in one (`a != 0`).",
  apply:"Apply", undo:"Undo", undoKey:"Undo (Ctrl+Z or ⌘+Z)", history:"History", none:"No operations yet.",
  zeroTip:"Not allowed: multiplying a row by 0 loses an equation.",
  zeroMsg:"Multiplying by 0 wipes out an equation: every point satisfies 0 = 0, so the solutions would change.",
  tryIt:"Try it anyway (demo)", sameRow:"Choose two different rows.",
  twoSteps:"two steps: {a}, then {b}" };
const KINDS = { one:"One solution", none:"No solution", inf:"Infinitely many" };
const PARAM = "Let the free variable be `t`. Type numbers or fractions such as 1/2; a blank box counts as 0.";

export default {
  id:"55-systems-of-equations-matrices",
  kind:"topic",
  title:"Systems of equations (matrices)",
  topic:"Systems of Equations (Matrices)",
  readyTopic:"solving systems with matrices",
  hero:{
    eq:'<span class="sy-heq">' + mx([[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]]) + '<span class="sy-harr" aria-hidden="true">⟶</span>' + mx([[1, 1, 1, 6], [0, 1, -2, -4], [0, 0, -7, -21]]) + "</span>",
    eqLabel:"The augmented matrix with rows 1, 1, 1 bar 6; 2, −1, 1 bar 3; 1, 2, −1 bar 2 becomes the row-echelon form 1, 1, 1 bar 6; 0, 1, −2 bar −4; 0, 0, −7 bar −21",
    eqSize:"sm",
    headline:"Same solutions, simpler equations",
    text:"An <strong>augmented matrix</strong> stores a system as numbers only. <strong>Row operations</strong> (swap rows, scale a row by a non-zero number, add a multiple of one row to another) give an <strong>equivalent system</strong> with the same solutions. Keep going until the matrix is in <strong>row-echelon form</strong>, then <strong>back-substitute</strong> from the bottom up.",
    fig:{ html:'<div class="sy-hero" id="sy-hero"><div class="sy-hl" id="sy-hl" aria-hidden="true"></div><div class="sy-hr"><canvas class="sy-c3 sy-hc" id="sy-hc" role="img" aria-label="Three planes, blue, teal and orange, meeting at the point (1, 2, 3)"></canvas></div><p class="tiny muted sy-hcap" id="sy-hcap" aria-live="polite"></p></div>', caption:"" }
  },
  goals:[
    "I can write a linear system as an augmented matrix, and a matrix as a system.",
    "I can use the three elementary row operations and tell which operations keep a system equivalent.",
    "I can reduce a matrix to row-echelon form and back-substitute to solve a 2 × 2 or 3 × 3 system.",
    "I can read from row-echelon form whether a system has one solution, none or infinitely many, and write infinite solutions with a parameter.",
    "I can connect the algebra to the geometry: equivalent systems have the same intersection of lines or planes.",
    "I can model and solve problems with systems of three equations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Elimination", goal:3, prompt:"Solve `x + y = 5` and `x - y = 1`.",
          options:[
            { t:"`x = 3`, `y = 2`", ok:true, why:"Add: `2x = 6`." },
            { t:"`x = 2`, `y = 3`", why:"2 − 3 = −1, not 1." },
            { t:"`x = 6`, `y = -1`", why:"`2x = 6` means `x = 3`." },
            { t:"`x = 3`, `y = -2`", why:"3 − 2 = 1 ✓ but 3 + (−2) = 1 ≠ 5." }],
          hints:["Add the equations to remove `y`.", "`2x = 6`.", "`x = 3`, `y = 2`."] },
        { id:"w2", skill:"Elimination", goal:2, prompt:"Which combination of `2x + 3y = 7` and `4x - y = 7` eliminates `x` correctly?",
          options:[
            { t:"Equation 2 − 2 × equation 1: `-7y = -7`", ok:true, why:"`4x - 4x`, `-y - 6y`, `7 - 14`." },
            { t:"Equation 2 − 2 × equation 1: `-7y = 0`", why:"2 × equation 1 is `4x + 6y = 14`. " + M1 },
            { t:"Equation 2 − equation 1: `2x - 4y = 0`", why:"`x` is still there." },
            { t:"Equation 2 + 2 × equation 1: `8x + 5y = 21`", why:"The `x`-terms double instead of cancelling." }],
          hints:["Make the `x`-coefficients equal, then subtract.", "2 × equation 1: `4x + 6y = 14`.", "`(4x - y) - (4x + 6y) = 7 - 14`."] },
        { id:"w3", skill:"Back-substitution", goal:3, prompt:"`z = 2`, `y + z = 5` and `x + y + z = 6`. Find (`x`, `y`, `z`).",
          options:[
            { t:"(1, 3, 2)", ok:true, why:"`y = 3`, then `x = 6 - 3 - 2`." },
            { t:"(3, 3, 2)", why:"`x = 6 - y - z`." },
            { t:"(−1, 5, 2)", why:"`y = 5 - z = 3`." },
            { t:"(6, 5, 2)", why:"Substitute from the bottom up." }],
          hints:["Start with the equation that has one variable.", "`y = 5 - 2`.", "(1, 3, 2)."] },
        { id:"w4", skill:"Planes", goal:5, prompt:"Is (1, −1, 2) on the plane `2x + y - z = -1`?",
          options:[
            { t:"Yes", ok:true, why:"2 − 1 − 2 = −1." },
            { t:"No: it gives 1", why:"`y = -1`, so the `y`-term is −1." },
            { t:"No: it gives 3", why:"`-z = -2`." },
            { t:"You can’t tell without the normal", why:"Substitute the point: that’s the whole test." }],
          hints:["Substitute the coordinates.", "2(1) + (−1) − 2.", "−1 ✓."] },
        { id:"w5", skill:"Counting solutions", goal:4, prompt:"`2x - y = 3` and `4x - 2y = 6` have …",
          options:[
            { t:"infinitely many solutions", ok:true, why:"The second equation is twice the first: the same line." },
            { t:"no solution", why:"No contradiction: 6 = 2 × 3." },
            { t:"exactly one solution", why:"Parallel normals can’t cross once." },
            { t:"exactly two solutions", why:"Lines meet in 0, 1 or infinitely many points." }],
          hints:["Compare the equations.", "Equation 2 = 2 × equation 1.", "Same line: infinitely many."] },
        { id:"w6", skill:"Counting solutions", goal:4, prompt:"`2x - y = 3` and `4x - 2y = 5` have …",
          options:[
            { t:"no solution", ok:true, why:"Doubling the first gives `4x - 2y = 6 != 5`: parallel lines." },
            { t:"infinitely many solutions", why:"The constants don’t match." },
            { t:"exactly one solution", why:"Parallel lines." },
            { t:"the solution `x = 0`, `y = 0`", why:"(0, 0) gives 0 ≠ 3." }],
          hints:["Double the first equation.", "`4x - 2y = 6` vs 5.", "Contradiction: no solution."] }
      ],
      refreshers:{
        "Elimination":"Multiply an equation so a variable’s coefficients match, then add or subtract <strong>whole</strong> equations, constants included.",
        "Back-substitution":"Solve the equation with one variable, substitute into the one above, and keep going up.",
        "Planes":"A point is on a plane when it satisfies the plane’s equation.",
        "Counting solutions":"Two lines meet once, never (parallel) or everywhere (same line). A contradiction like 0 = 1 means none."
      }
    }
  },
  explore:{
    heading:"Row-reduction stepper",
    intro:"Choose row operations to simplify the matrix. Watch the geometry: the lines or planes move, but where they meet stays put. Stop when the matrix is in row-echelon form, then back-substitute.",
    systems:[
      { id:"S1", chip:"S1 (2 × 2)", rows:[[1, 2, 5], [3, -1, 1]] },
      { id:"S2", chip:"S2 (unique)", rows:[[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]],
        wrong:[{ pt:[1, 2, -3], fb:"`-7z = -21` gives `z = +3`." }] },
      { id:"S3", chip:"S3 (none)", rows:[[1, 1, 1, 3], [1, -1, 3, 1], [2, 0, 4, 5]],
        wrong:[{ z:"1", fb:"`0z = 1` has no solution. " + M3 }] },
      { id:"S4", chip:"S4 (infinite)", rows:[[1, 1, 1, 3], [1, -1, 3, 1], [2, 0, 4, 4]] },
      { id:"B", chip:"Build your own" }
    ],
    buildNote:"Type whole numbers from −9 to 9. Changing an entry starts the stepper again from your new system.",
    ops:OPS,
    cap:{ one3:"The three planes meet at the point {p}.", one2:"The two lines meet at the point {p}.", line3:"The planes share a whole line (it glows).",
      line2:"Both rows describe the same line: every point on it is a solution.", none3:"No point lies on all three planes.", none2:"The lines are parallel: they never meet.",
      plane:"Every point of one plane is a solution.", all:"Every point is a solution.", flat:"{r} has no variables left, so it draws nothing.", same:" The intersection hasn’t moved." },
    demoNote:"Demo only: {op} turned equation {n} into 0 = 0. The intersection changed from {from} to {to}. Any row operation brings the real system back.",
    rows:{ last:"Last operation", ref:"Row-echelon form?", contra:"Contradiction?", zero:"Zero rows", sol:"Solution", inter:"Intersection" },
    ref:{ yes:"Yes", under:"Not yet: row {i} has a non-zero entry under row {p}’s leading {v}", left:"Not yet: row {i}’s leading entry is left of row {p}’s",
      zeroAbove:"Not yet: row {p} is all zeros but row {i} below it isn’t (swap them)" },
    contra:{ none:"none", row:"Row {i} reads 0 = {c}: no solution" },
    zeros:{ none:"none", row:"Row {i} is all zeros" },
    solPending:"appears after back-substitution",
    inter:{ point:"the point {p}", line:"a line", plane:"a plane", none:"no common point", all:"every point", same:", unchanged" },
    geo:{ show:"Show geometry", views:"Views", iso:"Isometric", front:"Front (`xz`)", side:"Side (`yz`)", top:"Top (`xy`)",
      how:"Drag the view, or focus it and use the arrow keys (Shift for big steps), to turn it.", unchanged:"unchanged" },
    bs:{ title:"Back-substitute", locked:"Opens once the matrix is in row-echelon form.",
      intro:"The matrix is in row-echelon form. Choose how many solutions, then work from the bottom row up.",
      kinds:KINDS, param:PARAM,
      noneNote:"Press Check to confirm there’s no solution.", check:"Check", solved:"✓ Correct. The solution is {s}." },
    sol:SOL,
    predIntro:"Make a prediction first. Then the stepper shows you what really happens.",
    predictions:[
      { id:"p1", sys:"S2", pre:[], run:["comb", 1, 1, 0, -2],
        prompt:"S2, with the geometry on. You apply R₂ → R₂ − 2R₁. What happens to the point where the three planes meet?",
        options:[{ t:"It stays at (1, 2, 3)", ok:true }, { t:"It moves" }, { t:"It disappears" }, { t:"It becomes a line" }],
        explain:"(1, 2, 3) satisfies both old equations, so it satisfies their combination. Row operations keep the solutions.",
        note:"The teal plane swung, but (1, 2, 3) didn’t move." },
      { id:"p2", sys:"S3", pre:[["comb", 1, 1, 0, -1], ["comb", 2, 1, 0, -2]], run:["comb", 2, 1, 1, -1],
        prompt:"S3 after two operations. You reach the row [0 0 0 | 1]. How many solutions are there?",
        options:[{ t:"none", ok:true }, { t:"one, with `z = 1`" }, { t:"infinitely many" }, { t:"one: (0, 0, 0)" }],
        explain:"That row says 0 = 1. " + M3,
        note:"The original three planes form a triangular tunnel: no point is on all three." },
      { id:"p3", sys:"S4", pre:[["comb", 1, 1, 0, -1], ["comb", 2, 1, 0, -2]], run:["comb", 2, 1, 1, -1],
        prompt:"S4 after two operations. You reach [0 0 0 | 0]. How many solutions are there?",
        options:[{ t:"infinitely many", ok:true }, { t:"none" }, { t:"exactly one" }, { t:"exactly three" }],
        explain:"The third equation was a combination of the other two (R₃ = R₁ + R₂); two planes meeting in a line remain.",
        note:"The original three planes share one line, which glows." },
      { id:"p4", sys:"S2", pre:[], run:["zero", 0],
        prompt:"S2. What would R₁ → 0R₁ do to the solutions?",
        options:[{ t:"change them: an equation is lost", ok:true }, { t:"nothing" }, { t:"simplify the system without changing anything" }, { t:"make it inconsistent" }],
        explain:"0 = 0 is true everywhere, so the system forgets equation 1. " + M2,
        note:"Demo: the blue plane vanished, and the intersection grew from a point to a line." }
    ],
    chalIntro:"Use the stepper to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Reduce S2 to row-echelon form, then back-substitute.",
        why:"One route: R₂ → R₂ − 2R₁, R₃ → R₃ − R₁, R₂ ↔ R₃, R₃ → R₃ + 3R₂ gives [0 0 −7 | −21], so `z = 3`, `y = 2`, `x = 1`.",
        hints:["Use row 1 to clear the `x`-entries below it.", "After R₂ − 2R₁ and R₃ − R₁, clear the `y`-entry in row 3 using row 2 (swap first if that’s easier).", "`-7z = -21`, `z = 3`; `y - 2z = -4`, `y = 2`; `x = 6 - 2 - 3 = 1`."],
        msgs:{ sys:"Choose S2 first.", ref:"Keep going: the matrix isn’t in row-echelon form yet.", empty:"Now back-substitute: in the Back-substitute panel, choose One solution and enter `z`, then `y`, then `x`.",
          kind:"S2 has exactly one solution: choose One solution in the Back-substitute panel.", rev:"That’s (`z`, `y`, `x`). Report (`x`, `y`, `z`).",
          sign:"`-7z = -21` gives `z = +3`.", other:"Check your back-substitution: start with the bottom row." } },
      { id:"tc2", goal:4, prompt:"Show that S3 has no solution: reach a row of the form [0 0 0 | `c`] with `c != 0`.",
        why:"R₂ − R₁ and R₃ − 2R₁ give [0 −2 2 | −2] and [0 −2 2 | −1]; then R₃ − R₂ gives [0 0 0 | 1], which says 0 = 1.",
        hints:["Clear `x` from rows 2 and 3.", "R₂ − R₁ gives [0 −2 2 | −2]; R₃ − 2R₁ gives [0 −2 2 | −1].", "R₃ − R₂: [0 0 0 | 1]."],
        msgs:{ sys:"Choose S3 first.", z1:"`0z = 1` has no solution. " + M3, more:"No row of the form [0 0 0 | `c`] with `c != 0` yet. Keep clearing entries below the leading entries." } },
      { id:"tc3", goal:4, stretch:true, prompt:"Build mode: the system is `x + y + z = 3`, `x - y + 3z = 1`, `2x + kz = m`. Choose `k` and `m` (whole numbers −9 to 9) so the system has <strong>infinitely many</strong> solutions.",
        why:"R₁ + R₂ = `2x + 4z = 4`, so the third equation must be exactly that: `k = 4` and `m = 4`.",
        hints:["Infinitely many means the third equation must be a combination of the first two.", "It has no `y`-term: which combination cancels `y`?", "R₁ + R₂ = `2x + 4z = 4`, so `k = 4` and `m = 4`."],
        msgs:{ keep:"In Build mode, keep rows 1 and 2 as [1 1 1 | 3] and [1 −1 3 | 1], and row 3 as [2 0 `k` | `m`]: change only `k` and `m`.",
          none:"No solution: the third plane is parallel to the line of the first two but misses it. Row reduction ends with [0 0 0 | `m - 4`].",
          one:"Exactly one solution: the third plane cuts the line once." } }
    ]
  },
  part3:{
    slug:"solutions", name:"How many?",
    heading:"How many solutions?",
    intro:"Explore was about doing row operations; this part is about reading the result. Classify finished matrices, write the solutions (including parameter forms), and see the matching geometry. Then try the quick check.",
    st1:{ title:"Station 1: Read the final matrix",
      text:"For each row-echelon matrix, choose how many solutions the system has. The 3D view shows the matching planes after each answer.",
      choices:[{ id:"one", t:"One solution" }, { id:"none", t:"No solution" }, { id:"inf", t:"Infinitely many" }],
      cards:[
        { id:"a", rows:[[1, 2, -1, 3], [0, 1, 2, 4], [0, 0, 1, 1]], answer:"one",
          reveal:"One solution: `z = 1`, `y = 2`, `x = 0`: <strong>(0, 2, 1)</strong>. Three planes meeting at a point.",
          wrong:{ none:"No row reads 0 = `c` with `c != 0`: there’s no contradiction.", inf:"No row is all zeros: every variable has a leading entry." } },
        { id:"b", rows:[[1, -1, 2, 5], [0, 1, -1, 2], [0, 0, 0, 3]], answer:"none",
          reveal:"<strong>None</strong>: row 3 says 0 = 3.",
          wrong:{ one:M3.replace("= 5", "= 3").replace("0 = 5", "0 = 3"), inf:"Row 3 isn’t all zeros: it’s a contradiction. " + M7 } },
        { id:"c", rows:[[1, -1, 2, 5], [0, 1, -1, 2], [0, 0, 0, 0]], answer:"inf",
          reveal:"<strong>Infinitely many</strong>: `z = t`, `y = 2 + t`, `x = 7 - t`: (`7 - t`, `2 + t`, `t`). A line of intersection.",
          wrong:{ one:M5, none:"[0 0 0 | 0] says 0 = 0: true for every point, not a contradiction." } },
        { id:"d", rows:[[1, 2, -1, 4], [0, 0, 0, 0], [0, 0, 0, 0]], answer:"inf",
          reveal:"<strong>Infinitely many, a plane</strong>: `y = s`, `z = t`, `x = 4 - 2s + t`. Three coincident planes.",
          wrong:{ one:"Two zero rows leave one equation in three variables: two free variables.", none:"[0 0 0 | 0] says 0 = 0: true for every point, not a contradiction." } }
      ],
      fig:"The planes of the matrix you just answered." },
    st2:{ title:"Station 2: Why a parameter?",
      text:"Matrix (c) from Station 1: `x - y + 2z = 5`, `y - z = 2` and [0 0 0 | 0]. Move `t` to slide a point along the glowing line of solutions (`7 - t`, `2 + t`, `t`). Every position satisfies all three equations.",
      slider:"Parameter `t`", eqs:["`x - y + 2z`", "`y - z`", "`0x + 0y + 0z`"], rhs:[5, 2, 0] },
    st3:{ title:"Station 3: Back to R²",
      text:"Each matrix is a 2 × 2 system after row reduction. Choose one to see its two lines.",
      cards:[
        { id:"r1", rows:[[1, 2, 5], [0, 0, 0]], lines:[[1, 2, 5], [1, 2, 5]], text:"The same line twice: infinitely many solutions, `y = t`, `x = 5 - 2t`.", caption:"Before reduction, the two rows were the same line (for example, `x + 2y = 5` and `2x + 4y = 10`)." },
        { id:"r2", rows:[[1, 2, 5], [0, 0, 3]], lines:[[1, 2, 5], [1, 2, 8]], text:"Parallel lines: no solution (row 2 says 0 = 3).", caption:"For example, `x + 2y = 5` and `x + 2y = 8` reduce to this matrix (R₂ → R₂ − R₁)." },
        { id:"r3", rows:[[1, 2, 5], [0, -7, -14]], lines:[[1, 2, 5], [3, -1, 1]], text:"Crossing lines: one solution, `y = 2`, `x = 1`: S1’s (1, 2).", caption:"S1, `x + 2y = 5` and `3x - y = 1`, reduces to this matrix (R₂ → R₂ − 3R₁)." }
      ] },
    quickCheck:{
      title:"Quick check", summary:"How many? quick check",
      items:[
        { id:"q1", goal:4, prompt:"" + mx([[1, 0, 0, 2], [0, 1, 0, -1], [0, 0, 1, 4]]) + " The solution?",
          choices:[
            { t:"(2, −1, 4)", ok:true, fb:"Right. Each row gives one variable directly." },
            { t:"none", fb:"Each row gives one variable directly." },
            { t:"infinitely many", fb:"Each row gives one variable directly." },
            { t:"(4, −1, 2)", fb:"Each row gives one variable directly: row 1 is `x`." }] },
        { id:"q2", goal:4, prompt:"A row [0 0 0 | −2] means …",
          choices:[
            { t:"no solution", ok:true, fb:"Right. It says 0 = −2." },
            { t:"`z = -2`", fb:"It says 0 = −2." },
            { t:"infinitely many", fb:"It says 0 = −2." },
            { t:"`x = y = z = 0`", fb:"It says 0 = −2." }] },
        { id:"q3", goal:4, prompt:mx([[1, 1, 1, 3], [0, 1, 1, 2], [0, 0, 0, 0]]) + " With `z = t`, the solution is …",
          choices:[
            { t:"(1, `2 - t`, `t`)", ok:true, fb:"Right. `y = 2 - t`; `x = 3 - y - z = 1`." },
            { t:"(1, 2, 0) only", fb:"`y = 2 - t`; `x = 3 - y - z = 1`. (1, 2, 0) is one point of the line." },
            { t:"none", fb:"`y = 2 - t`; `x = 3 - y - z = 1`. A zero row is not a contradiction." },
            { t:"(`3 - t`, `2 - t`, `t`)", fb:"`y = 2 - t`; `x = 3 - y - z = 1`. (`3 - t`, …) forgets to substitute `y`." }] },
        { id:"q4", goal:2, prompt:"Which operation is NOT allowed?",
          choices:[
            { t:"R₂ → R₂ + 3 (add 3 to each entry)", ok:true, fb:"Right. Adding a constant to an equation’s terms changes it." },
            { t:"R₁ ↔ R₃", fb:"Adding a constant to an equation’s terms changes it: R₂ → R₂ + 3 is the illegal one." },
            { t:"R₂ → −2R₂", fb:"Adding a constant to an equation’s terms changes it: R₂ → R₂ + 3 is the illegal one." },
            { t:"R₃ → R₃ − 4R₁", fb:"Adding a constant to an equation’s terms changes it: R₂ → R₂ + 3 is the illegal one." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"legal", type:"sorter", title:"Legal or not?", summary:"Legal or not?", noun:"operation", goal:[2, 5], txt:true,
        instruction:"Decide whether each operation keeps the same solutions or changes them.",
        boxes:[{ id:"keep", label:"Keeps the same solutions" }, { id:"change", label:"Changes the solutions" }],
        items:[
          { id:"i1", t:"R₁ ↔ R₂", answer:"keep", why:"Order of equations doesn’t matter." },
          { id:"i2", t:"R₂ → 5R₂", answer:"keep", why:"Non-zero multiple: the same plane." },
          { id:"i3", t:"R₃ → R₃ − 2R₁", answer:"keep", why:"Adding a multiple of another row." },
          { id:"i4", t:"R₂ → 0R₂", answer:"change", why:"Wipes out an equation. " + M2, wrong:{ keep:"0 = 0 is true everywhere, so equation 2 is lost. " + M2 } },
          { id:"i5", t:"Add 4 to every entry of R₁", answer:"change", why:"`x + y = 2` isn’t the same as `5x + 5y = 6`. " + M2,
            wrong:{ keep:"Write it as an equation: `x + y = 2` would become `5x + 5y = 6`." },
            hints:["Write it as an equation.", "`x + y = 2` becomes `5x + 5y = 6`.", "(1, 1) solved the first but not the second: changed."] },
          { id:"i6", t:"R₂ → R₁ (replace row 2 with a copy of row 1)", answer:"change", why:"Row 2’s information is lost. " + M2,
            wrong:{ keep:"Row 2 → row 1 keeps two copies of equation 1 and forgets equation 2." } },
          { id:"i7", t:"R₃ → 2R₃ + R₁", answer:"keep", why:"Scale by 2 (non-zero), then add R₁: two allowed steps." },
          { id:"i8", t:"R₁ → R₁ + R₁", answer:"keep", why:"That’s 2R₁: a non-zero multiple." },
          { id:"i9", t:"Multiply the `x`-column by 2", answer:"change", why:"That replaces `x` by `x/2`: different solutions. " + M2,
            wrong:{ keep:"Row operations act on rows (equations), never on columns." } },
          { id:"i10", t:"R₂ → R₁ − R₂", answer:"keep", why:"That’s −(R₂ − R₁): undoable, so allowed.",
            wrong:{ change:"Multiply R₂ by −1, then add R₁: both allowed." },
            hints:["Can you undo it?", "R₂ → R₁ − R₂ again brings back the original.", "Undoable means allowed."] }
        ],
        wrongDefault:"Ask whether you can undo it. Allowed: swap rows, multiply a row by a non-zero number, add a multiple of another row." },
      { id:"solve", type:"custom", title:"Row-reduce and solve", summary:"Row-reduce and solve", star:true, goal:[1, 3, 4],
        instruction:"Row-reduce each system with the stepper, then enter the solution. Items 4 to 6 are non-routine; item 6 goes beyond the Final Check.",
        how:"Open the stepper under a system to row-reduce it. Then choose how many solutions and fill in the boxes (whole numbers or fractions such as 5/3), and press Check.",
        sol:SOL, ops:OPS, entry:{ kinds:KINDS, param:PARAM, noneNote:"Press Check to confirm there’s no solution." },
        msgs:{ open:"Open the row-reduction stepper", fill:"Write the augmented matrix first: one row per equation, one column per variable (`x`, `y`, `z`), then the constant.",
          useM:"Use this matrix", fillWrong:"Columns are `x`, `y`, `z`: row 1 is [0 1 2 | 5]. " + M6, fillNum:"Type a whole number in every box.",
          k:"`k =`", ever:"Could it ever have no solution?", yes:"Yes", no:"No", kNum:"Type a whole number for `k`.", pickEver:"Answer the second question too." },
        items:[
          { id:"s1", goal:3, prompt:"`2x + y = 7`; `x - 3y = 0`", rows:[[2, 1, 7], [1, -3, 0]], answer:{ k:"one", pt:[3, 1] }, display:"(3, 1)",
            wrong:[{ pt:[1, 3], fb:SOL.rev2 + " " + M4 }] },
          { id:"s2", goal:3, prompt:"`x + 2y - z = 1`; `2x + y + z = 8`; `x - y + 3z = 10`", rows:[[1, 2, -1, 1], [2, 1, 1, 8], [1, -1, 3, 10]], answer:{ k:"one", pt:[2, 1, 3] }, display:"(2, 1, 3)",
            wrongDefault:"Check all three equations with your answer." },
          { id:"s3", goal:4, prompt:"`x + y - z = 2`; `2x - y + z = 1`; `3x = 5`", rows:[[1, 1, -1, 2], [2, -1, 1, 1], [3, 0, 0, 5]], answer:{ k:"none" }, display:"No solution",
            wrong:[{ x:"5/3", fb:"R₁ + R₂ gives `3x = 3`, which contradicts `3x = 5`. " + M7 }] },
          { id:"s4", goal:4, star:true, prompt:"`x + 2y + z = 4`; `2x + 5y + 3z = 9`; `x + 3y + 2z = 5`", rows:[[1, 2, 1, 4], [2, 5, 3, 9], [1, 3, 2, 5]], answer:{ k:"inf" }, display:"(`2 + t`, `1 - t`, `t`)",
            wrong:[{ pt:[2, 1, 0], fb:"That’s one point; the zero row means a whole line. " + M5 }] },
          { id:"s5", goal:1, star:true, fill:true, prompt:"`y + 2z = 5`; `x + z = 3`; `2x + y = 3`", rows:[[0, 1, 2, 5], [1, 0, 1, 3], [2, 1, 0, 3]], answer:{ k:"one", pt:[1, 1, 2] }, display:"(1, 1, 2)",
            wrongDefault:"Columns are `x`, `y`, `z`: row 1 is [0 1 2 | 5].",
            hints:["Write each equation with all three variables: `0x + y + 2z = 5`.", "Swap rows so the first row starts with `x`.", "(1, 1, 2)."] },
          { id:"s6", goal:4, star:true, kind:"k", prompt:"For which `k` does `x + y + z = 1`, `x + 2y + 3z = 2`, `x + 3y + kz = 3` have infinitely many solutions? Could it ever have none?",
            answer:{ k:5, ever:"no" }, display:"`k = 5`; never none",
            wrongDefault:"Reduction gives `(k - 5)z = 0`: one solution if `k != 5`, infinitely many if `k = 5`. The right side is always 0, so no contradiction is possible.",
            hints:["Reduce with `k` as a letter.", "R₂ − R₁: [0 1 2 | 1]; R₃ − R₁: [0 2 `k - 1` | 2]; then R₃ − 2R₂.", "[0 0 `k - 5` | 0]: `k = 5` gives a zero row."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Ibrahim", goal:[2, 4],
        instruction:"Ibrahim made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Solve `x + 2y = 4` and `3x + y = 7`.",
            steps:[mx([[1, 2, 4], [3, 1, 7]]) + ".", "R₂ → R₂ − 3R₁: " + mx([[0, -5, 7]]) + ".", "`y = -7/5`.", "`x = 4 - 2(-7/5) = 34/5`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows from step 3."],
            fixes:[
              { t:"The constant also changes: 7 − 12 = −5, so [0 −5 | −5], `y = 1` and `x = 2`.", ok:true, why:M1 },
              { t:"Use R₂ → R₂ − R₁ instead.", why:"That doesn’t clear `x`." },
              { t:"Swap the rows first.", why:"Swapping doesn’t fix the arithmetic." },
              { t:"Step 2 is correct.", why:"Check (34/5, −7/5) in equation 1: 34/5 − 14/5 = 4 ✓, in equation 2: 102/5 − 7/5 = 19 ≠ 7. " + M1 }],
            hints:["Apply R₂ − 3R₁ to every entry.", "Constants: 7 − 3(4).", "−5, so `y = 1`, `x = 2`."] },
          { id:"e2", goal:4, task:"Solve the system whose row-echelon form is " + mx([[1, 1, -1, 2], [0, 1, 2, 3], [0, 0, 0, 4]]) + ".",
            steps:["Row 3 reads `0x + 0y + 0z = 4`.", "So `z = 4`.", "Then `y = 3 - 8 = -5` and `x = 2 + 5 + 4 = 11`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"0 = 4 is impossible, so the system has no solution.", ok:true, why:"`0x + 0y + 0z = 4` says 0 = 4: impossible. No solution at all." },
              { t:"So `z = 0`.", why:"`0z = 4` has no solution." },
              { t:"So there are infinitely many solutions.", why:M7 },
              { t:"Step 2 is correct.", why:"Check: 0(4) = 0, not 4. " + M3.replace(/5/g, "4") }],
            hints:["What does `0x + 0y + 0z` equal for any point?", "0.", "0 = 4 is false: no solution."] },
          { id:"e3", goal:4, task:"Solve the system whose row-echelon form is " + mx([[1, -2, 1, 3], [0, 1, -1, 1], [0, 0, 0, 0]]) + ".",
            steps:["Row 3 is all zeros and there’s no contradiction, so there are infinitely many solutions.", "Let `z = 0`. Then `y = 1` and `x = 3 + 2 - 0 = 5`.", "Solution: (5, 1, 0)."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Let `z = t`: `y = 1 + t`, `x = 3 + 2(1 + t) - t = 5 + t`. Solution (`5 + t`, `1 + t`, `t`), `t ∈ ℝ`.", ok:true, why:M5 },
              { t:"Let `z = 1`: (6, 2, 1).", why:"Another single point." },
              { t:"There’s no solution because of the zero row.", why:M7 },
              { t:"Step 2 is correct.", why:"(5, 1, 0) is just one of infinitely many solutions. " + M5 }],
            hints:["How many solutions did step 1 promise?", "Infinitely many: so don’t fix `z` at one value.", "`z = t`: (`5 + t`, `1 + t`, `t`)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the stepper: planes moving while the intersection stayed put, or what multiplying by 0 would do?" },
      { id:"j2", q:"In your own words, why do row operations never change the solutions of a system?" },
      { id:"j3", q:"Explain to a friend how to tell, from a row-echelon matrix, whether there’s one solution, none or infinitely many." },
      { id:"j4", q:"Which part slows you down (choosing operations, arithmetic with the constant column, writing parameter solutions)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is the augmented matrix of `x - 2z = 5`, `3y + z = 1`, `x + y = 0`?", options:[
          { t:mx([[1, 0, -2, 5], [0, 3, 1, 1], [1, 1, 0, 0]]), ok:true, why:"One column per variable, with 0 for each missing variable." },
          { t:mx([[1, -2, 5], [3, 1, 1], [1, 1, 0]]), why:"Missing variables need 0s, or the columns shift. " + M6 },
          { t:mx([[1, 0, -2, 5], [3, 0, 1, 1], [1, 1, 0, 0]]), why:"`3y` belongs in the `y`-column. " + M6 },
          { t:mx([[1, 0, -2, -5], [0, 3, 1, -1], [1, 1, 0, 0]]), why:"Constants keep their signs when they’re already on the right." }] },
        b:{ prompt:"Which is the augmented matrix of `2x + z = 4`, `y - z = -1`, `x - y = 3`?", options:[
          { t:mx([[2, 0, 1, 4], [0, 1, -1, -1], [1, -1, 0, 3]]), ok:true, why:"One column per variable, with 0 for each missing variable." },
          { t:mx([[2, 1, 4], [1, -1, -1], [1, -1, 3]]), why:"Missing variables need 0s, or the columns shift. " + M6 },
          { t:mx([[2, 1, 0, 4], [0, 1, -1, -1], [1, -1, 0, 3]]), why:"`z` belongs in the third column. " + M6 },
          { t:mx([[2, 0, 1, -4], [0, 1, -1, 1], [1, -1, 0, -3]]), why:"Constants keep their signs when they’re already on the right." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which operation changes the solutions of a system?", options:[
          { t:"Adding 5 to every entry of row 2", ok:true, why:"Adding a constant to an equation’s terms changes the equation. " + M2 },
          { t:"R₁ ↔ R₃", why:"Swapping is allowed." },
          { t:"R₂ → −3R₂", why:"A non-zero multiple is allowed." },
          { t:"R₃ → R₃ − 2R₁", why:"Adding a multiple of another row is allowed." }] },
        b:{ prompt:"Which operation changes the solutions of a system?", options:[
          { t:"R₃ → 0R₃", ok:true, why:"Multiplying by 0 turns equation 3 into 0 = 0, so it’s lost. " + M2 },
          { t:"R₂ ↔ R₁", why:"Swapping is allowed." },
          { t:"R₁ → (1/2)R₁", why:"A non-zero multiple is allowed." },
          { t:"R₂ → R₂ + 4R₃", why:"Adding a multiple of another row is allowed." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A row-echelon form is " + mx([[1, 3, -1, 2], [0, 1, 4, 5], [0, 0, 0, -3]]) + ". The system has …", options:[
          { t:"no solution", ok:true, why:"Row 3 says 0 = −3." },
          { t:"one solution, with `z = -3`", why:"`0x + 0y + 0z = -3` says 0 = −3: impossible. No solution at all." },
          { t:"infinitely many solutions", why:"The bottom row isn’t all zeros: it’s a contradiction. " + M7 },
          { t:"the solution (0, 0, 0)", why:"(0, 0, 0) gives 0 ≠ −3 in row 3. No solution means no point at all." }] },
        b:{ prompt:"A row-echelon form is " + mx([[1, -1, 2, 4], [0, 1, 1, 2], [0, 0, 0, 0]]) + ". The system has …", options:[
          { t:"infinitely many solutions", ok:true, why:"No contradiction; `z` is free." },
          { t:"no solution", why:"[0 0 0 | 0] says 0 = 0: true everywhere. " + M7 },
          { t:"one solution, with `z = 0`", why:"`z = 0` gives just one point. " + M5 },
          { t:"the solution (0, 0, 0)", why:"(0, 0, 0) gives 0 ≠ 4 in row 1." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Solve `x + y + z = 2`, `x + 2y + 3z = 5`, `x - y + 2z = 6`.", options:[
          { t:"(1, −1, 2)", ok:true, why:"R₂ − R₁: `y + 2z = 3`; R₃ − R₁: `-2y + z = 4`; then `5z = 10`." },
          { t:"(2, −1, 1)", why:"That’s (`z`, `y`, `x`). " + M4 },
          { t:"(1, 1, 0)", why:"That satisfies the first equation only: 1 + 2 = 3 ≠ 5." },
          { t:"Infinitely many solutions", why:"No zero row appears. " + M7 }] },
        b:{ prompt:"Solve `x + y + z = 1`, `x + 2y + 3z = -1`, `x - y + 2z = 0`.", options:[
          { t:"(2, 0, −1)", ok:true, why:"R₂ − R₁: `y + 2z = -2`; R₃ − R₁: `-2y + z = -1`; then `5z = -5`." },
          { t:"(−1, 0, 2)", why:"That’s (`z`, `y`, `x`). " + M4 },
          { t:"(1, 0, 0)", why:"That satisfies the first equation only: 1 ≠ −1 in the second." },
          { t:"Infinitely many solutions", why:"No zero row appears. " + M7 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Solve `x + y - z = 1`, `2x + 3y - z = 4`, `x + 2y = 3`. Let `z = t`.", options:[
          { t:"(`-1 + 2t`, `2 - t`, `t`)", ok:true, why:"R₂ − 2R₁ and R₃ − R₁ both give `y + z = 2`: a zero row follows. `y = 2 - t`, `x = 1 - y + z`." },
          { t:"(−1, 2, 0)", why:"One point of the line. " + M5 },
          { t:"No solution", why:"The zero row is [0 0 0 | 0], not a contradiction." },
          { t:"(`1 + t`, `2 - t`, `t`)", why:"That forgets the `y`-term when back-substituting: `x = 1 - (2 - t) + t`." }] },
        b:{ prompt:"Solve `x - y + z = 2`, `2x - y + 3z = 5`, `x + 2z = 3`. Let `z = t`.", options:[
          { t:"(`3 - 2t`, `1 - t`, `t`)", ok:true, why:"R₂ − 2R₁ and R₃ − R₁ both give `y + z = 1`: a zero row follows. `y = 1 - t`, `x = 2 + y - z`." },
          { t:"(3, 1, 0)", why:"One point of the line. " + M5 },
          { t:"No solution", why:"The zero row is [0 0 0 | 0], not a contradiction." },
          { t:"(`2 - t`, `1 - t`, `t`)", why:"Forgets the `y`-term: `x = 2 + y - z`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"For which `k` does `x + y + z = 2`, `x + 2y + 2z = 3`, `2x + 3y + 3z = k` have infinitely many solutions?", options:[
          { t:"`k = 5`", ok:true, why:"R₃ − R₁ − R₂ gives [0 0 0 | `k - 5`]: a zero row only when `k = 5`." },
          { t:"Every `k` except 5", why:"Swaps the cases: for `k != 5` there’s no solution." },
          { t:"`k = 0`", why:"The zero row needs `k - 5 = 0`, not `k = 0`." },
          { t:"No value: three equations in three unknowns always have one solution", why:M7 }] },
        b:{ prompt:"For which `k` does `x - y + z = 1`, `2x + y - z = 3`, `3x = k` have infinitely many solutions?", options:[
          { t:"`k = 4`", ok:true, why:"R₁ + R₂ = `3x = 4`." },
          { t:"Every `k` except 4", why:"Swaps the cases: for `k != 4` there’s no solution." },
          { t:"`k = 0`", why:"R₃ − R₁ − R₂ gives [0 0 0 | `k - 4`]: it needs `k - 4 = 0`, not `k = 0`." },
          { t:"No value: three equations in three unknowns always have one solution", why:M7 }] } },
      { id:"c1", cat:"C", goal:[2, 5],
        a:{ prompt:"Which is the best explanation of why row operations don’t change a system’s solutions?", options:[
          { t:"“Each operation (swap, multiply a row by a non-zero number, add a multiple of one row to another) can be undone, so the old and new systems are satisfied by exactly the same points. The planes move, but their intersection doesn’t.”", ok:true, why:"Undoable steps keep exactly the same solutions." },
          { t:"“Because the numbers in the matrix stay the same.”", why:"They change." },
          { t:"“Because you can do anything to both sides of an equation, including multiplying by 0.”", why:M2 },
          { t:"“Because the planes don’t move.”", why:"They do; only the intersection stays." }] },
        b:{ prompt:"Which is the best explanation of why multiplying a row by 0 isn’t allowed?", options:[
          { t:"“It turns an equation into 0 = 0, which every point satisfies. The equation’s information is lost and can’t be recovered, so the new system can have more solutions.”", ok:true, why:"The step can’t be undone, so solutions can be gained." },
          { t:"“Because 0 makes the system inconsistent.”", why:"0 = 0 isn’t a contradiction." },
          { t:"“It’s allowed: multiplying both sides by 0 keeps the equation balanced.”", why:M2 },
          { t:"“Because rows can only be multiplied by positive numbers.”", why:"Negative multipliers are fine." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the clearest way to report the solution of " + mx([[1, 2, 0, 3], [0, 0, 1, 4], [0, 0, 0, 0]]) + "?", options:[
          { t:"“`x = 3 - 2t`, `y = t`, `z = 4`, `t ∈ ℝ`: a line of solutions.”", ok:true, why:"`z` is fixed by row 2, and `y` has no leading entry, so `y` is the free variable." },
          { t:"“(3, 0, 4).”", why:"One point of the line. " + M5 },
          { t:"“No solution, because row 3 is all zeros.”", why:"A zero row says 0 = 0. " + M7 },
          { t:"“`x = 3 - 2t`, `y = t`, `z = t`.”", why:"`z = 4` is fixed by row 2; here `y` is the free variable." }] },
        b:{ prompt:"Which is the clearest way to report the solution of " + mx([[1, 0, -1, 2], [0, 1, 3, 1], [0, 0, 0, 0]]) + "?", options:[
          { t:"“`x = 2 + t`, `y = 1 - 3t`, `z = t`, `t ∈ ℝ`: a line of solutions.”", ok:true, why:"`z` has no leading entry, so it’s free: `x = 2 + z`, `y = 1 - 3z`." },
          { t:"“(2, 1, 0).”", why:"One point of the line. " + M5 },
          { t:"“No solution, because row 3 is all zeros.”", why:"A zero row says 0 = 0. " + M7 },
          { t:"“`x = 2 - t`, `y = 1 + 3t`, `z = t`.”", why:"Moving `-z` and `3z` across flips their signs." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A café sells small, medium and large coffees for $2, $3 and $4. One day it sold 100 coffees for $320, with twice as many mediums as larges. How many of each size did it sell?", options:[
          { t:"10 small, 60 medium, 30 large", ok:true, why:"`s + m + l = 100`, `2s + 3m + 4l = 320`, `m - 2l = 0`." },
          { t:"28 small, 24 medium, 48 large", why:"That reverses ‘twice as many mediums as larges’ (`l = 2m`)." },
          { t:"40 small, 40 medium, 20 large", why:"Satisfies the count and the ratio, but earns $280." },
          { t:"Infinitely many answers", why:"Three independent equations fix one answer. " + M7 }] },
        b:{ prompt:"A theatre sells child, student and adult tickets for $5, $8 and $10. It sold 50 tickets for $430, with as many student tickets as child tickets. How many of each?", options:[
          { t:"10 child, 10 student, 30 adult", ok:true, why:"`c + s + a = 50`, `5c + 8s + 10a = 430`, `s - c = 0`." },
          { t:"10 child, 30 student, 10 adult", why:"Columns mixed up: that earns $390. " + M6 },
          { t:"20 child, 20 student, 10 adult", why:"Count and ratio fit, but that earns $360." },
          { t:"Infinitely many answers", why:"Three independent equations fix one answer. " + M7 }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"Describe where the planes `x + y + z = 6`, `x - y + z = 2` and `2x + 2z = 8` meet.", options:[
          { t:"In a line: (`4 - t`, 2, `t`), `t ∈ ℝ`", ok:true, why:"R₃ = R₁ + R₂, so a zero row appears; R₁ − R₂ gives `y = 2`." },
          { t:"At the single point (4, 2, 0)", why:"One point of the line. " + M5 },
          { t:"Nowhere", why:"No contradiction appears." },
          { t:"In a plane", why:"Only one equation is redundant, so a line remains." }] },
        b:{ prompt:"Describe where the planes `x + y + z = 4`, `x + y - z = 2` and `2x + 2y = 6` meet.", options:[
          { t:"In a line: (`3 - t`, `t`, 1), `t ∈ ℝ`", ok:true, why:"R₃ = R₁ + R₂; R₁ − R₂ gives `z = 1`." },
          { t:"At the single point (3, 0, 1)", why:"One point of the line. " + M5 },
          { t:"Nowhere", why:"No contradiction appears." },
          { t:"In a plane", why:"Only one equation is redundant, so a line remains." }] } }
    ]
  },
  task:{
    title:"Third plane in the sheaf", summary:"Third plane in the sheaf",
    statement:"<p>The planes `x + y + z = 3` and `x - y + 3z = 1` meet in a line. Design a third equation `ax + by + cz = d` so that the three planes share that whole line (infinitely many solutions), and the conditions below hold. There are many answers.</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>The system has infinitely many solutions.</li><li>Your equation isn’t a multiple of either given equation.</li><li>`a`, `b` and `c` are all non-zero.</li><li>Your plane doesn’t pass through the origin.</li></ol></div>" +
      "<p class=\"tiny muted\">Choose whole numbers from −9 to 9. The preview shows the two given planes (blue, teal), your plane (orange) and the system’s row-echelon form.</p>",
    checks:["Infinitely many solutions", "A new plane", "No zero coefficients", "Misses the origin"],
    tips:["Row-reduce with your equation as row 3: you need a zero row, not [0 0 0 | `c`]. Every combination `p`R₁ + `q`R₂ works.",
      "Your equation is one of the given ones (or a multiple): the third plane must be different.",
      "A zero coefficient makes the plane parallel to an axis. Try a combination with unequal multiples, like R₁ + 2R₂.",
      "`d = 0` puts the plane through the origin. Choose a different combination."],
    explainPrompt:"Explain how you built your equation and how the reduced matrix shows infinitely many solutions.",
    vocab:"Use the words row operation, row-echelon form, parameter and line of intersection.",
    pvEnter:"Enter `a`, `b`, `c` and `d` (at least one of `a`, `b`, `c` non-zero) to see the system’s row-echelon form.",
    pvRef:"Row-echelon form of the system (R₁, R₂, then your equation):",
    pvNone:"Row 3 reduces to [0 0 0 | `c`] with `c != 0`: no solution. Your plane misses the line.",
    pvInf:"A zero row and no contradiction: infinitely many solutions. Your plane contains the line.",
    pvOne:"Every row has a leading entry: exactly one solution. Your plane cuts the line once.",
    more:"There’s more than one answer. Multiples of one equation count as the same plane. Can you find another?",
    after3:"Every answer is `p(x + y + z - 3) + q(x - y + 3z - 1) = 0` for some `p`, `q`. Planes like these, all through one line, are called a sheaf: module 57’s first configuration."
  },
  cards:[
    ["Augmented matrix", "Coefficients in columns (0 for a missing variable), constants after a bar."],
    ["Three row operations", "Swap rows; multiply a row by a non-zero number; add a multiple of one row to another."],
    ["Equivalent systems", "Same solutions; row operations produce them."],
    ["Not allowed", "Multiplying a row by 0; adding a constant to a row; changing a column."],
    ["Row-echelon form", "Zeros below each leading entry; each leading entry right of the one above."],
    ["Back-substitution", "Solve the bottom row first, then work up."],
    ["[0 0 0 | `c`], `c != 0`", "No solution: inconsistent."],
    ["[0 0 0 | 0]", "That equation adds nothing; with no contradiction, look for a free variable."],
    ["Infinitely many solutions", "Let a free variable be `t`; write the others in terms of `t`."],
    ["Consistent", "Has at least one solution."],
    ["Geometry", "Row operations move the planes but not their intersection."],
    ["Three planes, a zero row", "A line (one zero row) or a plane (two zero rows) of solutions."]
  ]
};
