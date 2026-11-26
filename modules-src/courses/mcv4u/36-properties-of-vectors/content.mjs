// MCV4U 36 Properties of Vectors. Source: /Users/ali/Desktop/MV/Modules/mcv4u/plan/modules/36-properties-of-vectors.md
// Shorthand: inside this file "~u" stands for vec{u} and "~AB" for vec{AB}; vecs() below expands it in every string.
// misconception core sentences (plan §3)
const M1 = "`~u - ~v` and `~v - ~u` have the same length but opposite directions: `~u - ~v = -(~v - ~u)`.";
const M2 = "Lengths only add when the arrows point the same way. A 3 and a 4 at right angles make 5, not 7.";
const M3 = "The whole triangle is enlarged, so <strong>both</strong> sides are multiplied by `k`.";
const M5 = "Subtract `~a` from both sides; the sign changes. There’s no division by a vector, only by a non-zero number.";
const M7 = "Length is never negative: `|k~u| = |k||~u|`. The minus sign only flips the direction.";

const C = {
  id:"36-properties-of-vectors",
  kind:"topic",
  title:"Properties of vectors",
  topic:"Properties of Vectors",
  readyTopic:"properties of vectors",
  hero:{
    eq:"`@n{~u} + @d{~v} = @d{~v} + @n{~u}` <span class=\"pv-hsep\">·</span> `@a{k}(@n{~u} + @d{~v}) = @a{k}@n{~u} + @a{k}@d{~v}` <span class=\"pv-hsep\">·</span> <span class=\"pv-hbut\">but</span> `@n{~u} - @d{~v} ≠ @d{~v} - @n{~u}`",
    eqLabel:"u plus v equals v plus u. k times the quantity u plus v equals k u plus k v. But u minus v is not equal to v minus u.",
    eqSize:"sm",
    headline:"Which algebra rules survive?",
    text:"You’ve added, subtracted and scaled vectors with arrows. Now you’ll test which rules from number algebra still hold. Addition is <strong>commutative</strong> and <strong>associative</strong>. Scalars <strong>distribute</strong>. Every vector has an <strong>opposite</strong>, and there is a <strong>zero vector</strong>. Subtraction doesn’t commute, and lengths don’t simply add.",
    fig:{ html:'<canvas class="plot" id="hero-plot" role="img" aria-label="Vectors u and v drawn from one point. The paths u then v and v then u close a parallelogram and meet at one tip: the diagonal u + v is the same vector. Then u − v and v − u: two arrows of equal length pointing opposite ways, not the same."></canvas>' }
  },
  goals:[
    "I can show, with diagrams and grid steps, that vector addition is commutative and associative.",
    "I can use the zero vector and opposite vectors, and explain why `~u - ~v ≠ ~v - ~u` in general.",
    "I can use the distributive properties `k(~u + ~v) = k~u + k~v` and `(k + m)~u = k~u + m~u`.",
    "I can simplify vector expressions using the properties, including in geometric figures.",
    "I can solve vector equations such as `2~x + ~a = ~b`.",
    "I can explain why `|~u + ~v| ≤ |~u| + |~v|` and find the range of possible magnitudes."
  ],
  start:{
    warmup:{
      intro:"Grid steps are written (right, up), as on the module 34–35 boards.",
      questions:[
        { id:"w1", skill:"Tip-to-tail addition", goal:1,
          prompt:"On a grid, `~a` goes 3 right and 1 up; `~b` goes 1 right and 4 up. Placed tip-to-tail from the origin, where does `~a + ~b` end?",
          options:[
            { t:"(4, 5)", ok:true, why:"3 + 1 right and 1 + 4 up." },
            { t:"(2, −3)", why:"That’s `~a - ~b`." },
            { t:"(−2, 3)", why:"That’s `~b - ~a`." },
            { t:"(5, 4)", why:"Add right steps to right steps: 3 + 1 = 4." }],
          hints:["Follow `~a`, then start `~b` at its tip.", "Right steps: 3 + 1. Up steps: 1 + 4.", "(4, 5)."] },
        { id:"w2", skill:"Tip-to-tail addition", goal:2,
          prompt:"In parallelogram ABCD, `~AB = ~u` and `~AD = ~v`. Which vector equals `~BD`?",
          options:[
            { t:"`~v - ~u`", ok:true, why:"`~BD = ~BA + ~AD = -~u + ~v`." },
            { t:"`~u - ~v`", why:"That’s `~DB`: same length, opposite direction." },
            { t:"`~u + ~v`", why:"That’s `~AC`." },
            { t:"`-~u - ~v`", why:"That’s `~CA`." }],
          hints:["Go from B to D through A.", "B → A is `-~u`; A → D is `~v`.", "`~v - ~u`."] },
        { id:"w3", skill:"Scalar multiples", goal:3,
          prompt:"`|~u| = 4`. What is `|-3~u|`?",
          options:[
            { t:"12", ok:true, why:"`|-3| × 4 = 12`." },
            { t:"−12", why:"A length can’t be negative." },
            { t:"1", why:"Multiply the length by `|-3|`." },
            { t:"4/3", why:"`-3~u` is three times as long." }],
          hints:["The minus sign only reverses the direction.", "Length is multiplied by 3.", "12."] },
        { id:"w4", skill:"Scalar multiples", goal:3,
          prompt:"Which describes `-½~v`?",
          options:[
            { t:"Half as long as `~v`, opposite direction", ok:true, why:"½ halves the length and the minus sign reverses the direction." },
            { t:"Half as long, same direction", why:"The negative reverses it." },
            { t:"Twice as long, opposite direction", why:"½ halves the length." },
            { t:"Same length, opposite direction", why:"That’s `-~v`." }],
          hints:["Two pieces: the size ½ and the sign −.", "½ halves; − reverses.", "Half as long, opposite."] },
        { id:"w5", skill:"Number properties", goal:4,
          prompt:"Which property does `3(x + 4) = 3x + 12` use?",
          options:[
            { t:"Distributive", ok:true, why:"The 3 multiplies each term in the brackets." },
            { t:"Commutative", why:"Commutative swaps order: `a + b = b + a`." },
            { t:"Associative", why:"Associative regroups brackets: `(a + b) + c = a + (b + c)`." },
            { t:"Identity", why:"Identity is adding 0 or multiplying by 1." }],
          hints:["Something outside the brackets multiplies everything inside.", "That’s distributing.", "Distributive."] },
        { id:"w6", skill:"Number properties", goal:5,
          prompt:"Solve `2x + 7 = 1`.",
          options:[
            { t:"`x = -3`", ok:true, why:"`2x = -6`." },
            { t:"`x = 4`", why:"`2x = 1 - 7`." },
            { t:"`x = 3`", why:"`1 - 7 = -6`, not 6." },
            { t:"`x = -12`", why:"Divide by 2." }],
          hints:["Undo the + 7 first.", "`2x = -6`.", "`x = -3`."] }
      ],
      refreshers:{
        "Tip-to-tail addition":"Start the second arrow at the tip of the first; the sum runs from the first tail to the last tip. In grid steps, add the right steps and the up steps separately.",
        "Scalar multiples":"`k~u` is `|k|` times as long as `~u`; if `k < 0` it points the opposite way. `|k~u| = |k||~u|`.",
        "Number properties":"Commutative: order doesn’t matter. Associative: grouping doesn’t matter. Distributive: a factor multiplies every term. To solve, undo operations on both sides."
      }
    }
  },
  explore:{
    heading:"Property tester",
    intro:"Pick a property, set the vectors, and see whether both sides land on the same tip. Then try to break it.",
    modes:[
      { id:"comm", t:"Commutative" }, { id:"assoc", t:"Associative" }, { id:"zero", t:"Zero and opposites" },
      { id:"distV", t:"Distributive (over vectors)" }, { id:"distS", t:"Distributive (over scalars)" },
      { id:"sub", t:"Subtraction: does it commute?" }, { id:"mag", t:"Magnitudes" }],
    txt:{
      modes:"Property", view:"View", diagram:"Diagram", numbers:"Numbers",
      subView:"Compare", subOrder:"`~u - ~v` and `~v - ~u`", subBr:"`(~u - ~v) - ~w` and `~u - (~v - ~w)`",
      kLabel:"Scalar `k`", mLabel:"Scalar `m`",
      kNote:"`k` stretches the vector, like `a` stretches a graph.",
      turn:"Turn `~v` (length stays the same)", turnL:"↺ 15°", turnR:"↻ 15°",
      setups:"Challenge set-ups", setup:"Set up challenge",
      key:"`~u` blue, `~v` teal, `~w` orange; results thick black. Left side solid, right side dashed.",
      dragNote:"Drag a tip, or press Tab to select a tip and use the arrow keys to move it one grid step.",
      numHead:["", "Left side", "Right side"],
      rows:{ prop:"Property", left:"Left side", right:"Right side", same:"Same vector?", len:"|left side|", mag:"Magnitudes",
        chain:"`~u + ~v + ~w`", brL:"`(~u - ~v) - ~w`", brR:"`~u - (~v - ~w)`", gap:"Gap between them", other:"Other answer" },
      yes:"Yes ✓", no:"No: they differ by",
      zeroDot:"0⃗: length 0, no direction",
      sameTip:"same tip ✓", order:"Drawn in order:"
    },
    predIntro:"Make a prediction first. Then the property tester shows you what really happens.",
    predictions:[
      { id:"p1", prompt:"Draw `~u` then `~v`, and `~v` then `~u`. Where do the two paths end?",
        use:"Commutative, `~u` = (3, 1), `~v` = (−1, 2).",
        options:[{ t:"At the same point", ok:true }, { t:"At mirror-image points" }, { t:"At different points, because the paths are different lengths" }, { t:"At the same point only if `|~u| = |~v|`" }],
        explain:"The two paths are opposite sides of a parallelogram, so they finish at the same corner: (2, 3)." },
      { id:"p2", prompt:"How are `~u - ~v` and `~v - ~u` related?",
        options:[{ t:"Same length, opposite directions", ok:true }, { t:"They are equal" }, { t:"`~v - ~u` is longer" }, { t:"They are perpendicular" }],
        explain:"`~u - ~v` goes from `~v`’s tip to `~u`’s tip; `~v - ~u` makes the same trip backwards." },
      { id:"p3", prompt:"What happens to the third side, `~u + ~v`?",
        use:"Distributive (over vectors); `k` animates from 1 to 2.",
        options:[{ t:"It doubles and stays parallel", ok:true }, { t:"It grows by `|~v|`" }, { t:"It stays the same" }, { t:"It doubles but turns" }],
        explain:"Enlarging a triangle by 2 doubles every side and keeps their directions, so `2(~u + ~v) = 2~u + 2~v`." },
      { id:"p4", prompt:"As `~v` turns, which values can `|~u + ~v|` take?",
        use:"Magnitudes, `|~u| = 3` and `|~v| = 4`.",
        options:[{ t:"Anything from 1 to 7", ok:true }, { t:"Always 5" }, { t:"Always 7" }, { t:"Anything from 0 to 7" }],
        explain:"7 only when the arrows line up, 1 when they’re opposite, and 5 only at 90°." }
    ],
    chalIntro:"Use <strong>Set up challenge</strong> on the board to load the fixed vectors, move the tips, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Zero and opposites mode, with `~u` = (3, 1) and `~v` = (−1, 2) fixed. Drag `~w` so that `~u + ~v + ~w = 0⃗`.",
        why:"`~u + ~v` = (2, 3), so `~w` must be its opposite, (−2, −3). The three arrows close up.",
        hints:["First find `~u + ~v`.", "`~u + ~v` = (2, 3).", "`~w = -(2, 3)` = (−2, −3)."],
        msgs:{ mode:"Switch to Zero and opposites mode first.", fixed:"Keep `~u` = (3, 1) and `~v` = (−1, 2): press <strong>Set up challenge</strong> 1.",
          same:"That’s `~u + ~v` itself. You need its opposite.", onlyU:"That cancels only `~u`.",
          general:"Not yet: the chain must end back where it started. Watch the `~u + ~v + ~w` row." } },
      { id:"tc2", goal:3, prompt:"Distributive mode, with `~u` = (3, 1) fixed. Set `k` and drag `~v` so that `k(~u + ~v)` ends at (−4, 6).",
        why:"`~u + ~v` must equal (−4, 6) ÷ `k`. With `k = 2`, `~v` = (−5, 2); with `k = -2`, `~v` = (−1, −4).",
        hints:["`~u + ~v` must equal (−4, 6) ÷ `k`.", "With `k = 2`, `~u + ~v` = (−2, 3).", "`~v` = (−2, 3) − (3, 1) = (−5, 2). (`k = -2` with `~v` = (−1, −4) also works.)"],
        msgs:{ mode:"Switch to Distributive (over vectors) mode first.", fixed:"Keep `~u` = (3, 1): press <strong>Set up challenge</strong> 2.",
          half:"That makes `~v` = (−4, 6) ÷ 2. It’s `~u + ~v` that must equal (−2, 3).",
          k1:"`~v` would need to be (−7, 5), off the board. Use a scalar.",
          general:"Not yet: `k(~u + ~v)` must end exactly at (−4, 6). Watch the left-side row." } },
      { id:"tc3", goal:2, stretch:true, prompt:"Subtraction mode, with `~u` = (3, 1) and `~v` = (−1, 2) fixed. Place `~w` so that `(~u - ~v) - ~w` and `~u - (~v - ~w)` end exactly 6 units apart.",
        why:"Without brackets the two sides are `~u - ~v - ~w` and `~u - ~v + ~w`: they differ by `2~w`. A gap of 6 needs `|~w| = 3`.",
        hints:["Write both sides without brackets.", "`~u - ~v - ~w` and `~u - ~v + ~w` differ by `2~w`.", "`|2~w| = 6` means `|~w| = 3`: (3, 0), (−3, 0), (0, 3) or (0, −3)."],
        msgs:{ mode:"Switch to Subtraction mode first.", fixed:"Keep `~u` = (3, 1) and `~v` = (−1, 2): press <strong>Set up challenge</strong> 3.",
          w33:"The gap is `2|~w| = 6√2`. You need `|~w| = 3` exactly.", w50:"The gap is 10: twice `|~w|`.",
          zero:"The two sides are equal only when `~w = 0⃗`; you want a gap of 6.",
          general:"Not yet: the gap is `2|~w|`. Make it exactly 6." } }
    ]
  },
  part3:{
    slug:"simplify", name:"Simplify",
    heading:"Simplify and solve",
    intro:"The properties earn their keep in algebra. Name the property behind each line, solve a vector equation one move at a time, then write a vector in a figure. Then try the quick check.",
    st1:{ title:"Station 1: Name the property",
      text:"Simplify `3(~a - 2~b) - 2(~a + ~b)`. Tap the property that justifies each line.",
      start:"`3(~a - 2~b) - 2(~a + ~b)`",
      chips:[{ id:"dv", t:"distributive over vectors" }, { id:"cm", t:"commutative" }, { id:"ds", t:"distributive over scalars" }, { id:"zo", t:"zero/opposite" }],
      lines:[
        { t:"`= 3~a - 6~b - 2~a - 2~b`", answer:"dv", good:"The 3 and the −2 multiply every vector in their brackets.", bad:"Two sets of brackets opened: a scalar multiplied a sum of vectors." },
        { t:"`= 3~a - 2~a - 6~b - 2~b`", answer:"cm", good:"Only the order of the terms changed.", bad:"Nothing was multiplied or grouped; two terms swapped places." },
        { t:"`= (3 - 2)~a + (-6 - 2)~b`", answer:"ds", good:"`3~a - 2~a = (3 - 2)~a`: the scalars combine on one vector.", bad:"Here two scalars share one vector: `k~a + m~a = (k + m)~a`." }],
      last:"`= ~a - 8~b`", lastNote:"Arithmetic on the scalars finishes it.",
      fig:"Grid with `~a` = (2, 1) and `~b` = (0, 1). The original expression (dashed, step by step) and `~a - 8~b` (solid) end at the same tip, (2, −7).",
      alg:["`~a` = (2, 1) and `~b` = (0, 1).", "`3(~a - 2~b)` = 3 × (2, −1) = (6, −3).", "`2(~a + ~b)` = 2 × (2, 2) = (4, 4).", "(6, −3) − (4, 4) = (2, −7).", "`~a - 8~b` = (2, 1) − (0, 8) = (2, −7). Same tip ✓"],
      done:"✓ All three lines named. Both expressions land on (2, −7)." },
    st2:{ title:"Station 2: Solve for `~x`",
      text:"`~a` = (−2, 1) and `~b` = (4, 3) are on the grid. Solve `2~x + ~a = ~b` by choosing moves.",
      moves:[{ id:"sub", t:"Subtract `~a` from both sides" }, { id:"half", t:"Multiply both sides by ½" }, { id:"div", t:"Divide both sides by `~a`" }],
      eqs:["`2~x + ~a = ~b`", "`2~x = ~b - ~a`", "`~x = ½(~b - ~a)`"],
      trap:"Division by a vector isn’t defined. Undo the addition first.",
      early:"Undo the addition first: subtract `~a` from both sides, then deal with the 2.",
      again:"`~a` is already gone from the left side. Now get `~x` on its own.",
      good1:"✓ `2~x = ~b - ~a` = (6, 2).",
      good2:"✓ `~x = ½(~b - ~a)` = (3, 1). Check: `2~x + ~a` drawn tip-to-tail lands on `~b`’s tip.",
      reset:"Start again",
      fig:"Grid with `~a` (blue) and `~b` (teal) from the origin; the solution `~x`, then `2~x + ~a` tip-to-tail." },
    st3:{ title:"Station 3: Vectors in a figure",
      text:"Parallelogram ABCD has `~AB = ~a` and `~AD = ~b`; M is the midpoint of CD. Build `~AM` by tapping a route along the sides, starting at A.",
      at:"You’re at", go:"Go to", reset:"Clear route", route:"Route",
      done:"✓ You reached M.", empty:"Tap a corner to start walking from A.",
      fig:"Parallelogram ABCD with `~AB = ~a` along the bottom and `~AD = ~b` up the left side; M is the midpoint of CD." },
    quickCheck:{
      title:"Quick check", summary:"Simplify and solve quick check",
      items:[
        { id:"q1", goal:4, prompt:"Simplify `4(~a + ~b) - 3(~a - ~b)`.",
          choices:[{ t:"`~a + 7~b`", ok:true, fb:"Right. `4~a + 4~b - 3~a + 3~b = ~a + 7~b`." },
            { t:"`~a + ~b`", fb:"`-3(~a - ~b) = -3~a` <strong>+</strong> `3~b`." },
            { t:"`7~a + ~b`", fb:"`4~a - 3~a = ~a`, and `4~b + 3~b = 7~b`." },
            { t:"`~a - 7~b`", fb:"`-3 × (-~b) = +3~b`, so the `~b` terms add: `4~b + 3~b`." }] },
        { id:"q2", goal:5, prompt:"Solve `3~x - ~a = 2~a + 6~b`.",
          choices:[{ t:"`~a + 2~b`", ok:true, fb:"Right. `3~x = 3~a + 6~b`, so `~x = ~a + 2~b`." },
            { t:"`⅓~a + 2~b`", fb:"Adding `~a` to both sides gives `3~x = 3~a + 6~b`." },
            { t:"`3~a + 6~b`", fb:"That’s `3~x`. Multiply both sides by ⅓." },
            { t:"`~a + 6~b`", fb:"Multiply <strong>every</strong> term by ⅓: `⅓ × 6~b = 2~b`." }] },
        { id:"q3", goal:1, prompt:"Which property justifies `(~u + ~v) + ~w = ~u + (~v + ~w)`?",
          choices:[{ t:"Associative", ok:true, fb:"Right. Only the brackets moved; the order stayed the same." },
            { t:"Commutative", fb:"Only the brackets moved; the order stayed the same." },
            { t:"Distributive", fb:"Only the brackets moved; the order stayed the same." },
            { t:"Identity", fb:"Only the brackets moved; the order stayed the same." }] },
        { id:"q4", goal:2, prompt:"`~u - ~v = 0⃗`. What must be true?",
          choices:[{ t:"`~u = ~v`", ok:true, fb:"Right. Add `~v` to both sides: `~u = ~v`, the same length <strong>and</strong> direction." },
            { t:"`~u = -~v`", fb:"Add `~v` to both sides: `~u = ~v`, the same length <strong>and</strong> direction." },
            { t:"Only `|~u| = |~v|`", fb:"Add `~v` to both sides: `~u = ~v`, the same length <strong>and</strong> direction." },
            { t:"`~u ⟂ ~v`", fb:"Add `~v` to both sides: `~u = ~v`, the same length <strong>and</strong> direction." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"always", type:"sorter", noun:"statement", title:"Always true or not always true?", summary:"Always true?", goal:[1, 2, 3, 6],
        instruction:"Tap a statement, then tap the box it belongs in. “Always true” means true for every choice of vectors and scalars.",
        boxes:[{ id:"yes", label:"Always true" }, { id:"no", label:"Not always true" }],
        items:[
          { id:"i1", t:"`~u + ~v = ~v + ~u`", answer:"yes", goal:1, why:"The parallelogram closes either way.", wrong:{ no:"The parallelogram closes either way." } },
          { id:"i2", t:"`~u - ~v = ~v - ~u`", answer:"no", goal:2, why:"Only when `~u = ~v`; otherwise they’re opposites.", wrong:{ yes:"Only when `~u = ~v`; otherwise they’re opposites." } },
          { id:"i3", t:"`(~u - ~v) - ~w = ~u - (~v - ~w)`", answer:"no", goal:2, why:"They differ by `2~w`.", wrong:{ yes:"They differ by `2~w`." } },
          { id:"i4", t:"`k(~u + ~v) = k~u + k~v`", answer:"yes", goal:3, why:"Enlarged triangles stay triangles.", wrong:{ no:"Enlarged triangles stay triangles." } },
          { id:"i5", t:"`|~u + ~v| = |~u| + |~v|`", answer:"no", goal:6, why:"Only when they point the same way (or one is `0⃗`).", wrong:{ yes:"Only when they point the same way (or one is `0⃗`)." } },
          { id:"i6", t:"`|k~u| = k|~u|`", answer:"no", goal:3, why:"Fails for `k < 0`: `|k~u| = |k||~u|`.", wrong:{ yes:"Fails for `k < 0`: `|k~u| = |k||~u|`." },
            hints:["Try `k = -2`.", "`|-2~u|` is positive.", "Not always: it needs `|k|`."] },
          { id:"i7", t:"`~u + (-~u) = 0⃗`", answer:"yes", goal:2, why:"Opposites cancel to the zero vector.", wrong:{ no:"Opposites cancel to the zero vector." } },
          { id:"i8", t:"`(k + m)~u = k~u + m~u`", answer:"yes", goal:3, why:"Collinear arrows add along the line.", wrong:{ no:"Collinear arrows add along the line." } },
          { id:"i9", t:"`|~u - ~v| = |~v - ~u|`", answer:"yes", goal:2, why:"Opposite vectors have equal lengths.", wrong:{ no:"Opposite vectors have equal lengths." } },
          { id:"i10", t:"`|~u + ~v| ≤ |~u| + |~v|`", answer:"yes", goal:6, why:"A side of a triangle is never longer than the other two together.", wrong:{ no:"A side of a triangle is never longer than the other two together." } },
          { id:"i11", t:"If `k~u = 0⃗`, then `k = 0`", answer:"no", goal:3, why:"`~u` could be `0⃗`.", wrong:{ yes:"`~u` could be `0⃗`." } },
          { id:"i12", t:"If `k~u = k~v`, then `~u = ~v`", answer:"no", goal:3, why:"If `k = 0`, any `~u` and `~v` work.", wrong:{ yes:"If `k = 0`, any `~u` and `~v` work." },
            hints:["Look for a value of `k` that makes both sides `0⃗`.", "Try `k = 0`.", "`0~u = 0~v = 0⃗` for any vectors, so not always."] }
        ] },
      { id:"solve", type:"custom", title:"Simplify and solve", summary:"Simplify and solve set", star:true, goal:[4, 5],
        instruction:"Fill in the coefficients. Items 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type whole numbers or fractions such as −1/3 in the boxes. Type 0 when a vector doesn’t appear (a blank box counts as 0). Then press Check.",
        msgs:{ fill:"Fill in the boxes first.", err:"Type whole numbers or fractions only, such as 2, −3 or −1/3.", general:"Not yet. Check each step and try again." },
        items:[
          { id:"s1", goal:4, prompt:"Simplify `2(3~a - ~b) + 5(~b - ~a)`.", rows:[{ lab:"" }],
            answer:[["1", "3"]], display:"`~a + 3~b`",
            wrong:[{ v:[["11", "3"]], fb:"`5(~b - ~a) = 5~b - 5~a`." }],
            why:"`6~a - 2~b + 5~b - 5~a = ~a + 3~b`.",
            hints:["Expand both brackets first.", "`6~a - 2~b + 5~b - 5~a`.", "`~a + 3~b`."] },
          { id:"s2", goal:5, prompt:"Solve `4~x + 2~a = 6~b - 2~x`.", rows:[{ lab:"`~x =`" }],
            answer:[["-1/3", "1"]], display:"`~x = -⅓~a + ~b`",
            wrong:[{ v:[["1/3", "1"]], fb:"Subtracting `2~a` makes it `-2~a`." }, { v:[["-1", "3"]], fb:"`4~x + 2~x = 6~x`, not `2~x`." }],
            why:"`6~x = -2~a + 6~b`, so `~x = -⅓~a + ~b`.",
            hints:["Add `2~x` to both sides and subtract `2~a`.", "`6~x = -2~a + 6~b`.", "`~x = -⅓~a + ~b`."] },
          { id:"s3", goal:5, star:true, prompt:"Solve the pair `~x + ~y = ~a` and `~x - ~y = ~b`. Enter `~x` and `~y`.", rows:[{ lab:"`~x =`" }, { lab:"`~y =`" }],
            answer:[["1/2", "1/2"], ["1/2", "-1/2"]], display:"`~x = ½~a + ½~b`; `~y = ½~a - ½~b`",
            wrong:[{ v:[null, ["-1/2", "1/2"]], fb:"Subtract the second equation from the first: `2~y = ~a - ~b`." }],
            why:"Adding the equations gives `2~x = ~a + ~b`; subtracting them gives `2~y = ~a - ~b`.",
            hints:["Add the two equations to get rid of `~y`.", "`2~x = ~a + ~b`; subtracting gives `2~y = ~a - ~b`.", "`~x = ½~a + ½~b` and `~y = ½~a - ½~b`."] },
          { id:"s4", goal:4, star:true, prompt:"Parallelogram ABCD, `~AB = ~a`, `~AD = ~b`, M the midpoint of CD. Find `~BM`.", fig:"para", rows:[{ lab:"`~BM =`" }],
            answer:[["-1/2", "1"]], display:"`~BM = -½~a + ~b`",
            wrong:[{ v:[["1/2", "1"]], fb:"From C to M you go <strong>backwards</strong> along `~a`." }],
            why:"`~BM = ~BC + ~CM = ~b - ½~a`.",
            hints:["Go from B to C, then from C to M.", "`~BC = ~b` and `~CM = -½~a`.", "`~BM = -½~a + ~b`."] },
          { id:"s5", goal:4, star:true, prompt:"Regular hexagon ABCDEF, `~AB = ~a`, `~BC = ~b`. Find `~AD`.", fig:"hex", rows:[{ lab:"`~AD =`" }],
            answer:[["0", "2"]], display:"`~AD = 2~b`",
            wrong:[{ v:[["1", "2"]], fb:"`~CD = ~b - ~a`, so `~a + ~b + (~b - ~a) = 2~b`." }],
            why:"`~AD = ~a + ~b + (~b - ~a) = 2~b`: the long diagonal is twice a side, parallel to `~BC`.",
            hints:["In a regular hexagon each side turns 60° from the last.",
              "`~CD` is parallel to `~AF`… or use `~CD = ~b - ~a` (the 120° direction is the 60° direction minus the 0° direction).",
              "`~AD = ~a + ~b + (~b - ~a) = 2~b`: the long diagonal is twice a side, parallel to `~BC`."] },
          { id:"s6", goal:5, star:true, prompt:"`~a` and `~b` are not parallel. Find `k` and `m` with `k(~a + 2~b) + m(~a - ~b) = 5~a + ~b`. Enter `k`, `m`.", rows:[{ lab:"", kind:"km" }],
            answer:[["2", "3"]], display:"`k = 2`, `m = 3`",
            wrong:[{ v:[["3", "2"]], fb:"Check the `~b` part: `2k - m` must be 1." }],
            why:"`k + m = 5` and `2k - m = 1`, so `k = 2` and `m = 3`.",
            hints:["Collect the `~a` terms and the `~b` terms.", "`(k + m)~a + (2k - m)~b = 5~a + ~b`. Since `~a ∦ ~b`, match coefficients.", "`k + m = 5` and `2k - m = 1`: `k = 2`, `m = 3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Jamal", goal:[4, 5, 6], how:"",
        instruction:"Jamal made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Simplify `2(~a - 3~b) - (4~a - ~b)`.",
            steps:["`= 2~a - 6~b - (4~a - ~b)`", "`= 2~a - 6~b - 4~a - ~b`", "`= -2~a - 7~b`", "Check: the coefficients −2 and −7 are both negative, so it looks right."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 adds step 2 correctly. The mistake is earlier.", "A sign pattern isn’t a check. Look earlier."],
            fixes:[
              { t:"`-(4~a - ~b) = -4~a + ~b`, giving `-2~a - 5~b`.", ok:true, why:"The minus sign in front changes <strong>both</strong> signs, so `-(-~b) = +~b`." },
              { t:"`-(4~a - ~b) = 4~a - ~b`.", why:"The minus sign in front changes <strong>both</strong> signs." },
              { t:"Step 2 is correct.", why:"`-(-~b) = +~b`. " + M5 },
              { t:"Combine to `-6~a~b`.", why:"Unlike vectors don’t multiply together." }],
            hints:["What does a minus sign in front of brackets do?", "`-(4~a - ~b) = -4~a + ~b`.", "`-2~a - 5~b`."] },
          { id:"e2", goal:5, task:"Solve `4~x - ~a = 2(~x + ~b)`.",
            steps:["`4~x - ~a = 2~x + 2~b`", "`4~x - 2~x = 2~b + ~a`", "`2~x = 2~b + ~a`", "`~x = ~b + ~a`"],
            answer:3,
            stepFb:["Step 1 distributes correctly.", "Step 2 moves terms correctly, changing signs.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Divide every term by 2: `~x = ~b + ½~a`.", ok:true, why:"Multiplying both sides by ½ halves <strong>both</strong> terms (distributive)." },
              { t:"`~x = (2~b + ~a) - 2`.", why:"You can’t subtract a number from a vector." },
              { t:"`~x = 2~b + ½~a`.", why:"Both terms must be halved." },
              { t:"Step 4 is correct.", why:"Check: `2(~b + ~a) = 2~b + 2~a ≠ 2~b + ~a`." }],
            hints:["Multiply both sides by ½.", "½ multiplies <em>both</em> terms (distributive).", "`~b + ½~a`."] },
          { id:"e3", goal:6, task:"`~u` is 3 units east and `~v` is 4 units north. Find `|~u + ~v|` and `|~u - ~v|`.",
            steps:["`~u` and `~v` are perpendicular, so `~u + ~v` is the hypotenuse of a right triangle.", "`|~u + ~v| = √{3^2 + 4^2} = 5`.",
              "`~u - ~v = ~u + (-~v)`, and `-~v` is 4 units south.", "So `|~u - ~v| = |~u| - |~v| = 3 - 4 = -1`, which means 1 unit."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`~u` and `-~v` are also perpendicular: `|~u - ~v| = √{3^2 + 4^2} = 5`.", ok:true, why:"3 east and 4 south still make a right angle, so the length is 5." },
              { t:"`|~u - ~v| = 3 + 4 = 7`.", why:"Lengths don’t add unless the arrows line up." },
              { t:"`|~u - ~v| = -5`, the opposite of `|~u + ~v|`.", why:"A length is never negative." },
              { t:"Step 4 is correct once you drop the minus sign.", why:"Subtracting lengths is the same mistake as adding them." }],
            hints:["Draw `~u` and `-~v` tip-to-tail.", "3 east and 4 south: still a right angle.", "5."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which property surprised you most in the property tester: one that held, or one that broke?" },
      { id:"j2", q:"In your own words, why is `k(~u + ~v) = k~u + k~v` true? Use the word ‘triangle’." },
      { id:"j3", q:"Explain to a friend how to solve `3~x + ~a = ~b` and why you never divide by a vector." },
      { id:"j4", q:"Which property or step still trips you up? What will you do about it?" }
    ]
  },
  final:{
    intro:"Grid steps are written (right, up).",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A diagram shows `~u` followed by `~v`, and `~v` followed by `~u`, ending at the same point. Which property does it show?", options:[
          { t:"Commutative property of addition", ok:true, why:"The order of the two vectors swapped and the tip stayed the same." },
          { t:"Associative property", why:"Associative regroups three vectors; here the order of two swapped." },
          { t:"Distributive property", why:"No scalar is involved." },
          { t:"Zero vector property", why:"Nothing cancels to `0⃗`." }] },
        b:{ prompt:"A diagram shows `(~u + ~v) + ~w` and `~u + (~v + ~w)` ending at the same point. Which property does it show?", options:[
          { t:"Associative property of addition", ok:true, why:"Only the grouping changed, and the tip stayed the same." },
          { t:"Commutative property", why:"The order stayed `~u`, `~v`, `~w`; only the grouping changed." },
          { t:"Distributive property", why:"No scalar is involved." },
          { t:"Opposite vector property", why:"Nothing cancels." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Expand `-3(2~a - ~b)`.", options:[
          { t:"`-6~a + 3~b`", ok:true, why:"The −3 multiplies both terms: `-3 × 2~a = -6~a` and `-3 × (-~b) = +3~b`." },
          { t:"`-6~a - 3~b`", why:"`-3 × (-~b) = +3~b`." },
          { t:"`-6~a - ~b`", why:"The −3 multiplies both terms." },
          { t:"`6~a + 3~b`", why:"`-3 × 2~a = -6~a`." }] },
        b:{ prompt:"Expand `-2(~a - 4~b)`.", options:[
          { t:"`-2~a + 8~b`", ok:true, why:"The −2 multiplies both terms: `-2 × (-4~b) = +8~b`." },
          { t:"`-2~a - 8~b`", why:"`-2 × (-4~b) = +8~b`." },
          { t:"`-2~a - 4~b`", why:M3 },
          { t:"`2~a + 8~b`", why:"`-2 × ~a = -2~a`." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"`~u - ~v` = (2, −5). What is `~v - ~u`?", options:[
          { t:"(−2, 5)", ok:true, why:"`~v - ~u = -(~u - ~v)`." },
          { t:"(2, −5)", why:"Subtraction doesn’t commute." },
          { t:"(−2, −5)", why:"Both steps reverse, not just one." },
          { t:"(5, −2)", why:"Reversing a vector doesn’t swap its steps." }] },
        b:{ prompt:"`~u - ~v` is 6 units north. What is `~v - ~u`?", options:[
          { t:"6 units south", ok:true, why:"`~v - ~u = -(~u - ~v)`: same length, opposite direction." },
          { t:"6 units north", why:M1 },
          { t:"−6 units north", why:"A length can’t be −6; say the direction instead." },
          { t:"`0⃗`", why:"They’re opposites, not equal; they’d cancel only if <em>added</em>." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Solve `5~x + 3~a = 2~x - 3~b`.", options:[
          { t:"`~x = -~a - ~b`", ok:true, why:"`3~x = -3~a - 3~b`." },
          { t:"`~x = ~a - ~b`", why:"Subtracting `3~a` from both sides gives `-3~a`." },
          { t:"`~x = -~a - 3~b`", why:"Divide <strong>every</strong> term by 3." },
          { t:"`~x = -(3/7)(~a + ~b)`", why:"Subtract `2~x` from both sides: `5~x - 2~x = 3~x`." }] },
        b:{ prompt:"Solve `6~x - 2~b = 2~x + 4~a`.", options:[
          { t:"`~x = ~a + ½~b`", ok:true, why:"`4~x = 4~a + 2~b`." },
          { t:"`~x = ~a - ½~b`", why:M5 },
          { t:"`~x = ~a + 2~b`", why:"Divide every term by 4." },
          { t:"`~x = ½~a + ¼~b`", why:"`6~x - 2~x = 4~x`, not `8~x`." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"`|~u| = 5` and `|~v| = 3`, and `~v` can point in any direction. Which value can `|~u - ~v|` <strong>never</strong> take?", options:[
          { t:"1", ok:true, why:"`|~u - ~v|` ranges from 5 − 3 = 2 to 5 + 3 = 8." },
          { t:"2", why:"When `~v` points the same way as `~u`, `|~u - ~v| = 2`." },
          { t:"5", why:"Possible: somewhere between the two extremes it passes 5." },
          { t:"8", why:"Subtraction can make it longer: if `~v` is opposite `~u`, `|~u - ~v| = 8`." }] },
        b:{ prompt:"`|~u| = 6` and `|~v| = 2`. Which value can `|~u + ~v|` <strong>never</strong> take?", options:[
          { t:"3", ok:true, why:"The range is 6 − 2 = 4 to 6 + 2 = 8." },
          { t:"4", why:"Opposite directions give 4." },
          { t:"6", why:"Possible, between 4 and 8." },
          { t:"8", why:"Same direction gives 8." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"In triangle ABC, `~AB = ~a` and `~AC = ~b`, and M is the midpoint of BC. Express `~AM`.", options:[
          { t:"`½~a + ½~b`", ok:true, why:"`~AM = ~a + ½(~b - ~a)`." },
          { t:"`~a + ½~b`", why:"`~BM` is half of `~BC = ~b - ~a`, not half of `~b`." },
          { t:"`½(~b - ~a)`", why:"That’s `~BM`; start from A." },
          { t:"`~a + ~b`", why:"That’s the parallelogram’s diagonal, twice `~AM`." }] },
        b:{ prompt:"In triangle PQR, `~PQ = ~a` and `~PR = ~b`. N is on QR with QN = ⅓ QR. Express `~PN`.", options:[
          { t:"`⅔~a + ⅓~b`", ok:true, why:"`~PN = ~a + ⅓(~b - ~a)`." },
          { t:"`⅓~a + ⅔~b`", why:"That measures ⅓ from R, not from Q." },
          { t:"`~a + ⅓~b`", why:"`~QN = ⅓~QR = ⅓(~b - ~a)`." },
          { t:"`⅓(~b - ~a)`", why:"That’s `~QN`; start from P." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why vector subtraction is not commutative?", options:[
          { t:"“`~u - ~v` and `~v - ~u` have the same length but opposite directions, so they’re equal only when `~u - ~v = 0⃗`, that is, when `~u = ~v`.”", ok:true, why:M1 },
          { t:"“Because `~u - ~v` is always shorter than `~v - ~u`.”", why:"They’re the same length." },
          { t:"“Because subtraction isn’t defined for vectors.”", why:"It is: `~u + (-~v)`." },
          { t:"“It is commutative, because both have the same magnitude.”", why:"Equal vectors need equal direction too." }] },
        b:{ prompt:"Which is the best explanation of why `(~u - ~v) - ~w ≠ ~u - (~v - ~w)` in general?", options:[
          { t:"“The first is `~u - ~v - ~w` and the second is `~u - ~v + ~w`; they differ by `2~w`, so they’re equal only when `~w = 0⃗`.”", ok:true, why:"Removing the brackets flips the sign of `~w` in the second expression." },
          { t:"“Brackets never matter with vectors.”", why:"They matter for subtraction." },
          { t:"“They differ by `~w`.”", why:"The sign of `~w` flips, so the gap is `2~w`." },
          { t:"“They differ because the order of `~u` and `~v` changed.”", why:"The order didn’t change." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which description shows why `2(~u + ~v) = 2~u + 2~v`?", options:[
          { t:"“The triangle with sides `~u`, `~v` and `~u + ~v` is enlarged by a factor of 2. The new sides `2~u`, `2~v` and `2(~u + ~v)` still close a triangle, so `2~u + 2~v = 2(~u + ~v)`.”", ok:true, why:"An enlarged triangle stays a triangle with parallel sides." },
          { t:"“Each vector moves 2 units, so their sum moves 2 units.”", why:"Scaling isn’t moving." },
          { t:"“Doubling `~u` alone doubles `~u + ~v`.”", why:M3 },
          { t:"“The parallelogram on `~u` and `~v` turns through twice its angle.”", why:"Scaling by 2 doesn’t rotate anything." }] },
        b:{ prompt:"Which description shows why `2~u + 3~u = 5~u`?", options:[
          { t:"“`2~u` and `3~u` point the same way along one line; placed tip-to-tail they make an arrow 5 times as long as `~u` in the same direction, which is `5~u`.”", ok:true, why:"Collinear arrows add along the line." },
          { t:"“`2~u` and `3~u` form a parallelogram whose diagonal is `5~u`.”", why:"Collinear arrows don’t make a parallelogram." },
          { t:"“`|2~u + 3~u| = 2 + 3 = 5`, so it equals `5~u`.”", why:"The length is `5|~u|`, and direction matters too." },
          { t:"“The scalars multiply, so the result is `6~u`.”", why:"Scalars add here: `(2 + 3)~u`." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"Two hikers start at the same cairn. Hiker 1 walks `~p`, then `~q`, then `~r`. Hiker 2 walks `~r`, then `~p`. Which single displacement takes Hiker 2 to Hiker 1?", options:[
          { t:"`~q`", ok:true, why:"Hiker 1 is at `~p + ~q + ~r` and Hiker 2 at `~r + ~p = ~p + ~r`; the difference is `~q`." },
          { t:"`-~q`", why:"That goes from Hiker 1 to Hiker 2." },
          { t:"`~p + ~q + ~r`", why:"That’s Hiker 1’s position from the cairn." },
          { t:"`~q + ~r`", why:"Hiker 2 walked `~r` too; it cancels." }] },
        b:{ prompt:"Hiker 1 walks `~a`, then `~b`, then `~c`. Hiker 2 walks `~b`, then `2~c`. Which displacement takes Hiker 2 to Hiker 1?", options:[
          { t:"`~a - ~c`", ok:true, why:"`(~a + ~b + ~c) - (~b + 2~c)`." },
          { t:"`~c - ~a`", why:"That goes from Hiker 1 to Hiker 2. " + M1 },
          { t:"`~a + ~c`", why:"Subtract `2~c`, not add it." },
          { t:"`~a`", why:"Hiker 2 walked one extra `~c`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Three ropes pull on a ring that doesn’t move, so `~F_1 + ~F_2 + ~F_3 = 0⃗`. If `~F_1 = 2~a - ~b` and `~F_2 = ~a + 3~b`, what is `~F_3`?", options:[
          { t:"`-3~a - 2~b`", ok:true, why:"`~F_3 = -(~F_1 + ~F_2) = -(3~a + 2~b)`." },
          { t:"`3~a + 2~b`", why:"That’s `~F_1 + ~F_2`; the third rope must cancel it." },
          { t:"`-3~a + 4~b`", why:"`-~F_2 = -~a - 3~b`: the minus applies to both terms." },
          { t:"`-~a + 4~b`", why:"That’s `~F_2 - ~F_1`." }] },
        b:{ prompt:"`~F_1 = ~a + 2~b` and `~F_2 = 3~a - 4~b`, and the three forces balance. Find `~F_3`.", options:[
          { t:"`-4~a + 2~b`", ok:true, why:"`-(4~a - 2~b)`." },
          { t:"`4~a - 2~b`", why:"That’s the sum; `~F_3` cancels it." },
          { t:"`-4~a - 6~b`", why:"`-(3~a - 4~b) = -3~a + 4~b`." },
          { t:"`2~a - 6~b`", why:"That’s `~F_2 - ~F_1`." }] } }
    ]
  },
  task:{
    title:"Close the triangle", summary:"Close the triangle",
    statement:"<p>`~u` = (3, 4) is fixed on the board. Place `~v` and `~w` so that every condition is met. There’s more than one answer: can you find them all?</p>" +
      "<div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The conditions</h4><ol style=\"margin:0;padding-left:1.3em\"><li>`~u + ~v + ~w = 0⃗` (the three arrows close a triangle).</li><li>`(~u - ~v) - ~w` and `~u - (~v - ~w)` end exactly 10 units apart.</li><li>No two of the three vectors are parallel.</li></ol></div>" +
      "<p class=\"tiny muted\">Drag the tips of `~v` and `~w` (or Tab to a tip and use the arrow keys). Their grid steps are whole numbers from −5 to 5.</p>",
    checks:["The arrows close a triangle", "The two subtractions end 10 apart", "No two are parallel"],
    tips:["`~w` must be the opposite of `~u + ~v`.", "Remove the brackets: the two expressions differ by `2~w`. How long must `~w` be?", "If `~w` points along `~u` (or exactly opposite), the triangle flattens."],
    explainPrompt:"Explain why line 2 forces `|~w| = 5`, and how you then found `~v`.",
    vocab:"Use the words associative, opposite and magnitude.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every other length-5 `~w` either sits along `~u` or makes `~v = -(~u + ~w)` run off the board. Line 2 is really a disguised length condition: `|~w| = 5`.",
    labels:{ board:"Board: `~u` (blue) fixed, then `~v` (teal) and `~w` (orange) tip-to-tail.", line2:"Line 2, both sides",
      brL:"`(~u - ~v) - ~w`", brR:"`~u - (~v - ~w)`", gap:"Gap", sum:"`~u + ~v + ~w`", vv:"`~v`", ww:"`~w`", lenW:"`|~w|`" }
  },
  cards:[
    ["Commutative", "`~u + ~v = ~v + ~u` (the parallelogram)."],
    ["Associative", "`(~u + ~v) + ~w = ~u + (~v + ~w)`: grouping doesn’t matter."],
    ["Zero vector `0⃗`", "Length 0, no direction; `~u + 0⃗ = ~u`."],
    ["Opposite vector", "`-~u`: same length, opposite direction; `~u + (-~u) = 0⃗`."],
    ["Distributive (vectors)", "`k(~u + ~v) = k~u + k~v` (an enlarged triangle)."],
    ["Distributive (scalars)", "`(k + m)~u = k~u + m~u`."],
    ["Subtraction", "`~u - ~v = -(~v - ~u)`; not commutative, not associative."],
    ["Length of `k~u`", "`|k~u| = |k||~u|`. Never negative."],
    ["Triangle inequality", "`|~u + ~v| ≤ |~u| + |~v|`; equal only when they point the same way."],
    ["Solving `2~x + ~a = ~b`", "Subtract `~a`, multiply by ½: `~x = ½(~b - ~a)`."],
    ["No division by vectors", "Divide only by non-zero numbers."],
    ["Unlike vectors", "`2~a + 3~b` doesn’t simplify when `~a ∦ ~b`."]
  ]
};

// expand the ~u / ~AB shorthand in every string (keys untouched)
function vecs(o){
  if (typeof o === "string") return o.replace(/~([A-Za-z]+)/g, "vec{$1}");
  if (Array.isArray(o)) return o.map(vecs);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = vecs(o[k]); return r; }
  return o;
}
export default vecs(C);
