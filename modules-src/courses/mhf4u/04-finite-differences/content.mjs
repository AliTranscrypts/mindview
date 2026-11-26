// MHF4U 04 Finite Differences. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/04-finite-differences.md
const n = v => (v < 0 ? "−" : "") + Math.abs(v);
const L = a => a.map(n).join(", ");
function cols(ys){ const c = [ys]; while (c[c.length - 1].length > 1 && c.length < 5) { const p = c[c.length - 1]; c.push(p.slice(1).map((v, i) => v - p[i])); } return c; }
function degreeOf(ys){ const c = cols(ys); for (let k = 1; k < c.length; k++) if (c[k].length >= 2 && c[k].every(v => v === c[k][0])) return k; return 0; }
const ORDW = ["", "first", "second", "third", "fourth"];

// ---------- Practice 1: sort the tables (feedback and hints generated from each table) ----------
const BOX = { d1:1, d2:2, d3:3, none:0 };
const TOO_LOW = "That column isn’t constant all the way down. Check the next column.";
const TOO_HIGH = "An earlier column is already constant. The degree is the <strong>first</strong> constant column.";
const EXPO = "Look at the column you think is constant: it’s still growing. Exponential tables never settle.";
function sortItem(id, ys, why, h2, h3){
  const D = degreeOf(ys), box = D ? "d" + D : "none", c = cols(ys), wrong = {};
  for (const b of Object.keys(BOX)) {
    if (b === box) continue;
    if (!D) wrong[b] = EXPO;
    else if (!BOX[b]) wrong[b] = "Keep subtracting: column " + D + " is constant.";
    else wrong[b] = BOX[b] < D ? TOO_LOW : TOO_HIGH;
  }
  const hint3 = h3 || (D ? "The " + ORDW[D] + " differences are " + L(c[D]) + ": constant, so degree " + D + "." : "Every column keeps growing, so no column becomes constant.");
  return { id, ys, t:L(ys.slice(0, 3)) + ",<br>" + L(ys.slice(3)), answer:box, why, goal:[2, 4], wrong,
    hints:["Find the first differences.", h2 || (L(c[1]) + ". Constant? If not, find their differences."), hint3] };
}
const SORT = {
  i1:sortItem("i1", [3, 7, 11, 15, 19, 23], "First differences are all 4."),
  i2:sortItem("i2", [-4, -1, 2, 5, 8, 11], "First differences are all 3."),
  i3:sortItem("i3", [20, 14, 8, 2, -4, -10], "First differences are all −6."),
  i4:sortItem("i4", [1, 2, 5, 10, 17, 26], "First differences 1, 3, 5, 7, 9; second differences all 2."),
  i5:sortItem("i5", [10, 7, 2, -5, -14, -25], "Second differences are all −2."),
  i6:sortItem("i6", [1, 2, 4, 7, 11, 16], "First differences 1, 2, 3, 4, 5; second differences all 1."),
  i7:sortItem("i7", [0, 1, 8, 27, 64, 125], "Third differences are all 6."),
  i8:sortItem("i8", [2, 2, 4, 14, 38, 82], "Third differences are all 6.",
    "0, 2, 10, 24, 44: not constant. Their differences are 2, 8, 14, 20: still not constant.", "The third differences are 6, 6, 6: degree 3."),
  i9:sortItem("i9", [0, 1, 14, 51, 124, 245], "Third differences are all 12."),
  i10:sortItem("i10", [1, 3, 9, 27, 81, 243], "Each column is the last one times 2, 4, 8, …: exponential."),
  i11:sortItem("i11", [2, 3, 5, 9, 17, 33], "The differences are 1, 2, 4, 8, 16: doubling, so they never settle.",
    "1, 2, 4, 8, 16: each is double the one before.", "Every column repeats the doubling, so none becomes constant."),
  i12:sortItem("i12", [1, 1, 2, 6, 24, 120], "These are factorials. The fourth differences are 9 and 53: not constant.")
};
// Shown mixed up so the tray doesn't group the answers.
const SORT_ORDER = ["i7", "i1", "i10", "i4", "i8", "i11", "i2", "i5", "i12", "i9", "i6", "i3"];

export default {
  id:"04-finite-differences",
  kind:"topic",
  title:"Finite differences",
  topic:"Finite Differences",
  readyTopic:"finite differences",
  hero:{
    eq:"`a = Δ^n ÷ n!`", eqLabel:"a equals the constant nth difference divided by n factorial",
    headline:"Subtract until it stops changing",
    text:"Take a table of values with `x`-values 1 apart. Subtract each `y`-value from the next to get the <strong>first differences</strong>. Do it again to get the <strong>second differences</strong>, and again. For a polynomial of degree `n`, the `n`th differences come out <strong>constant</strong>. That number tells you the degree and, divided by `n!`, the <strong>leading coefficient</strong>.",
    fig:{ html:'<div class="hero-dt" id="hero-dt"></div><p class="hero-cap" id="hero-cap1" aria-live="polite"></p><p class="hero-cap" id="hero-cap2"></p>' }
  },
  goals:[
    "I can build first, second and third differences from a table whose `x`-values are 1 apart.",
    "I can find the degree of a polynomial from the first column of constant differences.",
    "I can find the leading coefficient using `a` = (constant `n`th difference) ÷ `n!`.",
    "I can tell when a table isn’t from a low-degree polynomial, or when the `n!` rule can’t be used.",
    "I can find a missing value or the whole equation of a polynomial from its table.",
    "I can use finite differences to model and predict from real data."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Differences", goal:1,
          prompt:"A table has `x = 0, 1, 2, 3` and `y = 7, 4, -1, -8`. What are the first differences?",
          options:[
            { t:"−3, −5, −7", ok:true, why:"Later minus earlier: 4 − 7 = −3, −1 − 4 = −5, −8 − (−1) = −7." },
            { t:"3, 5, 7", why:"The values are falling, so the differences must be negative. Always do later minus earlier." },
            { t:"−3, −5, −9", why:"−8 − (−1) = −8 + 1 = −7, not −9." },
            { t:"4, −1, −8", why:"Those are the `y`-values from `x = 1` on. A difference is one value minus the one before it." }],
          hints:["A first difference is the next `y`-value minus the current one.", "Start with 4 − 7. Watch the signs when you subtract a negative.", "4 − 7 = −3, −1 − 4 = −5, −8 − (−1) = −7."] },
        { id:"w2", skill:"Differences", goal:1,
          prompt:"For `y = x^2`, the table for `x = 0` to 4 is 0, 1, 4, 9, 16. What are the second differences?",
          options:[
            { t:"2, 2, 2", ok:true, why:"First differences 1, 3, 5, 7; their differences are all 2." },
            { t:"1, 3, 5, 7", why:"Those are the first differences. Subtract once more." },
            { t:"1, 1, 1", why:"The coefficient of `x^2` is 1, but the second differences are 2 × 1 = 2. You’ll see why in this module." },
            { t:"0, 0", why:"0, 0 are the third differences." }],
          hints:["Find the first differences, then their differences.", "First differences: 1 − 0, 4 − 1, 9 − 4, 16 − 9.", "1, 3, 5, 7 → 2, 2, 2."] },
        { id:"w3", skill:"Evaluating polynomials", goal:5,
          prompt:"`f(x) = 2x^3 - x + 4`. What is `f(-2)`?",
          options:[
            { t:"−14", why:"`-x` at `x = -2` is `-(-2) = +2`, not −2." },
            { t:"−10", ok:true, why:"`2(-8) - (-2) + 4 = -16 + 2 + 4 = -10`." },
            { t:"−6", why:"`(-2)^3 = (-2)(-2)(-2) = -8`, not −6." },
            { t:"22", why:"An odd power of a negative number is negative: `(-2)^3 = -8`." }],
          hints:["Substitute −2 for every `x`, with brackets.", "`2(-2)^3 - (-2) + 4`. `(-2)^3 = -8`.", "−16 + 2 + 4 = −10."] },
        { id:"w4", skill:"Evaluating polynomials", goal:5,
          prompt:"What is the value of `y = 3x^2 - 2` at `x = 4`?",
          options:[
            { t:"46", ok:true, why:"3 × 16 − 2 = 48 − 2 = 46." },
            { t:"142", why:"`3x^2` means 3 × `x^2`, so 3 × 16, not (3 × 4)²." },
            { t:"22", why:"`x^2` at 4 is 16, not 8." },
            { t:"50", why:"The constant is −2: 48 − 2 = 46." }],
          hints:["Square first, then multiply by 3.", "4² = 16, and 3 × 16 = 48.", "48 − 2 = 46."] },
        { id:"w5", skill:"Degree", goal:2,
          prompt:"What is the degree of `y = 5 - x + 2x^3 - x^2`?",
          options:[
            { t:"3", ok:true, why:"The highest power of `x` is 3, in `2x^3`." },
            { t:"0", why:"5 is the first term written, but the degree is the highest power anywhere in the expression." },
            { t:"1", why:"`-x` is the first `x`-term, but `2x^3` has a higher power." },
            { t:"2", why:"`-x^2` is last, but the highest power is 3." }],
          hints:["Look at every power of `x`.", "The powers are 0, 1, 3 and 2.", "The highest is 3."] },
        { id:"w6", skill:"Solving for a coefficient", goal:5,
          prompt:"`y = 3x^2 + bx + 1` passes through (1, 2). What is `b`?",
          options:[
            { t:"−2", ok:true, why:"`3(1)^2 + b(1) + 1 = 2`, so `4 + b = 2` and `b = -2`." },
            { t:"−1", why:"Don’t drop the +1: `3 + b + 1 = 2`." },
            { t:"2", why:"`4 + b = 2` means `b = 2 - 4 = -2`." },
            { t:"6", why:"`b = 2 - 3 - 1 = -2`, not 2 + 3 + 1." }],
          hints:["Substitute `x = 1` and `y = 2`.", "`3 + b + 1 = 2`, so `4 + b = 2`.", "`b = -2`."] }
      ],
      refreshers:{
        "Differences":"A first difference is later minus earlier: `y(x + 1) - y(x)`. Second differences are the differences of the first differences. Example: 0, 1, 4, 9, 16 → 1, 3, 5, 7 → 2, 2, 2. Falling values give negative differences.",
        "Evaluating polynomials":"Put the number in brackets for every `x`, then work powers first: `2(-2)^3 = 2(-8) = -16`. An odd power of a negative number is negative.",
        "Degree":"The degree is the highest power of `x` anywhere in the expression, not the first or last term written.",
        "Solving for a coefficient":"If a point (`x`, `y`) is on the graph, substitute both numbers and solve for the unknown. (1, 2) on `y = 3x^2 + bx + 1` gives `3 + b + 1 = 2`, so `b = -2`."
      }
    }
  },
  explore:{
    heading:"Difference table machine",
    intro:"Choose a function, then run the machine one column at a time. When a column comes out constant, the machine tells you the degree and the leading coefficient. Try the mystery tables too: not every table settles down.",
    // Mystery tables (x = 0, 1, 2, …): 8 values so the Rows control works up to 8.
    mystery:[
      { id:"garden", name:"Garden path", ys:[3, 7, 11, 15, 19, 23, 27, 31] },
      { id:"arch", name:"Arch", ys:[10, 7, 2, -5, -14, -25, -38, -53] },
      { id:"stack", name:"Stack", ys:[1, 4, 10, 20, 35, 56, 84, 120] },
      { id:"doubling", name:"Doubling", ys:[1, 2, 4, 8, 16, 32, 64, 128], note:"Each first difference equals the `y`-value above it: `2^x` copies itself." },
      { id:"tripling", name:"Tripling", ys:[2, 6, 18, 54, 162, 486, 1458, 4374], note:"Each first difference is 2 times the `y`-value above it: every column grows ×3." },
      { id:"factorial", name:"Factorial", ys:[1, 1, 2, 6, 24, 120, 720, 5040] }
    ],
    predIntro:"Make a prediction first. Then the machine will fill the columns so you can see what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"build", deg:2, a:1, co:[0, 0, 0, 0], start:0, step:1, rows:7, shown:1 },
        prompt:"What will the second differences be?",
        options:[{ t:"All 2", ok:true }, { t:"All 1" }, { t:"1, 3, 5, 7, 9, 11" }, { t:"2, 4, 6, 8, 10" }],
        explain:"The first differences of `x^2` are the odd numbers 1, 3, 5, …, which go up by 2 each time. So the second differences are all 2: that’s `a × 2! = 1 × 2`." },
      { id:"p2", start:{ mode:"build", deg:3, a:2, co:[0, 0, 0, 0], start:0, step:1, rows:6, shown:0 },
        prompt:"The third differences will be constant. What number will they be?",
        options:[{ t:"2" }, { t:"6" }, { t:"8" }, { t:"12", ok:true }],
        explain:"For degree 3, the constant difference is `a × 3! = 2 × 6 = 12`. It’s not `a` itself (2), not 3! alone (6), and not 2³ (8)." },
      { id:"p3", start:{ mode:"mystery", mys:"doubling", rows:8, shown:0 },
        prompt:"Which column will become constant?",
        options:[{ t:"None of them", ok:true }, { t:"The second" }, { t:"The third" }, { t:"The fourth" }],
        explain:"Each difference is `2^{x+1} - 2^x = 2^x`: the same values again. Every column copies the one before, so none is ever constant. Constant differences are a polynomial’s fingerprint; exponentials don’t have one." },
      { id:"p4", start:{ mode:"build", deg:2, a:1, co:[0, 0, 0, 0], start:0, step:2, rows:5, shown:0 },
        prompt:"The second differences will be constant. What number will they be?",
        options:[{ t:"2" }, { t:"4" }, { t:"8", ok:true }, { t:"16" }],
        explain:"With `x`-values 1 apart, `x^2` gives 2. Doubling the gap makes each second difference 2² = 4 times bigger: 8. So `a = 8 ÷ 2! = 4` would be wrong. That’s why the rule needs `x`-values 1 apart." }
    ],
    chalIntro:"Use <strong>Build a polynomial</strong> with `x`-values 1 apart unless the challenge says otherwise. Set the sliders, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Build a polynomial whose table has constant third differences of −18.",
        why:"The constant third difference is `a × 3! = 6a`, and `6a = -18`, so `a = -3`.",
        hints:["Constant third differences mean degree 3. What’s the link between `a` and the difference?", "The constant third difference is `a × 3! = 6a`.", "`6a = -18`, so `a = -3`."] },
      { id:"tc2", goal:[2, 3], prompt:"Build a polynomial whose table has constant <strong>fourth</strong> differences of 12.",
        why:"4! = 24, so `24a = 12` and `a = 12 ÷ 24 = 0.5`.",
        hints:["Which factorial goes with fourth differences?", "4! = 24, so `24a = 12`.", "`a = 12 ÷ 24 = 0.5`."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Switch the `x`-values to <strong>2 apart</strong>. Build `y = ax^2` (no other terms) so that the second differences are constant at 12.",
        why:"With `x`-values 2 apart, `x^2` gives second differences of 8, so `ax^2` gives `8a`. `8a = 12`, so `a = 1.5`.",
        hints:["Try `a = 1` first. What are the second differences of `x^2` with `x`-values 2 apart? (P4 showed 8.)", "`x^2` gives 8, so `ax^2` gives `8a`.", "`8a = 12`, so `a = 1.5`."] }
    ]
  },
  part3:{
    slug:"reverse", name:"Reverse",
    heading:"Reverse engineering: from a table to its equation",
    intro:"Each round gives you a table. Find the degree, then `a`, then peel off the leading term and finish the equation.",
    rounds:[
      { id:"r1", name:"Round 1", xs:[0, 1, 2, 3, 4], ys:[5, 8, 15, 26, 41],
        answer:{ deg:2, a:2, m:1, k:5, head:"`y - 2x^2`", eq:"`y = 2x^2 + x + 5`", alg:"`x = 4`: 2(16) + 4 + 5 = 41 ✓" } },
      { id:"r2", name:"Round 2", xs:[0, 1, 2, 3, 4, 5], ys:[1, -2, 7, 40, 109, 226],
        answer:{ deg:3, a:2, m:-5, k:1, head:"`y - 2x^3`", eq:"`y = 2x^3 - 5x + 1`", alg:"`x = 5`: 2(125) − 5(5) + 1 = 250 − 25 + 1 = 226 ✓" } },
      { id:"r3", name:"Round 3", xs:[-2, -1, 0, 1, 2, 3], ys:[6, 3, 3, 3, 0, -9], trap:true,
        trapFb:"Three equal values in a row aren’t enough. A constant column keeps its value all the way down.",
        answer:{ deg:3, a:-0.5, m:0.5, k:3, head:"`y - (-½x^3) = y + ½x^3`", eq:"`y = -½x^3 + ½x + 3`", alg:"`x = 3`: −½(27) + ½(3) + 3 = −13.5 + 1.5 + 3 = −9 ✓" } }
    ],
    quickCheck:{
      title:"Peel it", summary:"Peel it",
      items:[
        { id:"q1", goal:3, prompt:"Constant third differences of 30 (`x`-values 1 apart). What is `a`?",
          choices:[{ t:"5", ok:true, fb:"Right. Divide by 3! = 6: 30 ÷ 6 = 5." }, { t:"10", fb:"Divide by 3! = 6: 30 ÷ 6 = 5." }, { t:"15", fb:"Divide by 3! = 6: 30 ÷ 6 = 5." }, { t:"30", fb:"Divide by 3! = 6: 30 ÷ 6 = 5." }] },
        { id:"q2", goal:2, prompt:"The second differences are 4, 4, 4, 4. What is the degree?",
          choices:[{ t:"1", fb:"The first constant column is the second differences: degree 2." }, { t:"2", ok:true, fb:"Right. The first constant column is the second differences: degree 2." }, { t:"3", fb:"The first constant column is the second differences: degree 2." }, { t:"4", fb:"The first constant column is the second differences: degree 2." }] },
        { id:"q3", goal:2, prompt:"For the table of `y = 3^x`, which column becomes constant?",
          choices:[{ t:"None", ok:true, fb:"Right. Each difference column of `3^x` is the same pattern times 2, 4, 8, …: it never settles." }, { t:"First", fb:"Each difference column of `3^x` is the same pattern times 2, 4, 8, …: it never settles." }, { t:"Second", fb:"Each difference column of `3^x` is the same pattern times 2, 4, 8, …: it never settles." }, { t:"Third", fb:"Each difference column of `3^x` is the same pattern times 2, 4, 8, …: it never settles." }] },
        { id:"q4", goal:5, prompt:"After peeling `2x^2` off a quadratic table (`x = 0, 1, 2, 3`), the leftover column reads 7, 4, 1, −2. What is the rest of the equation?",
          choices:[{ t:"`-3x + 7`", ok:true, fb:"Right. The leftover column falls by 3 each step (slope −3) and is 7 at `x = 0` (intercept 7)." }, { t:"`3x + 7`", fb:"The leftover column falls by 3 each step (slope −3) and is 7 at `x = 0` (intercept 7)." }, { t:"`-3x - 2`", fb:"The leftover column falls by 3 each step (slope −3) and is 7 at `x = 0` (intercept 7)." }, { t:"`7x - 3`", fb:"The leftover column falls by 3 each step (slope −3) and is 7 at `x = 0` (intercept 7)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort the tables", summary:"Sort the tables", goal:[2, 4], noun:"table",
        instruction:"Sort each table by the degree its differences show. (`x = 0, 1, 2, 3, 4, 5` in every table.)",
        how:"Tap a table, then tap the box it belongs in. You can open a scratch difference machine for any table.",
        boxes:[{ id:"d1", label:"Degree 1" }, { id:"d2", label:"Degree 2" }, { id:"d3", label:"Degree 3" }, { id:"none", label:"No column becomes constant", sub:"(in these rows)" }],
        items:SORT_ORDER.map(k => SORT[k]) },
      { id:"missing", type:"numeric", title:"Missing pieces", summary:"Missing pieces", star:true, goal:[3, 5, 6],
        instruction:"Use differences to find each missing number. All tables have `x`-values 1 apart.",
        items:[
          { id:"n1", goal:3, prompt:"A quadratic table has constant second differences of −6. What is `a`?", answer:-3, display:"`a = -3`", keypad:"text",
            why:"−6 ÷ 2! = −6 ÷ 2 = −3.",
            wrong:[{ match:-6, fb:"Divide by 2! = 2." }, { match:3, fb:"Watch the sign." }],
            hints:["Which factorial goes with second differences?", "The constant second difference is `a × 2! = 2a`.", "`2a = -6`, so `a = -3`."] },
          { id:"n2", goal:3, prompt:"A cubic has leading coefficient 4. What are its constant third differences?", answer:24, display:"24",
            why:"`a × 3! = 4 × 6 = 24`.",
            wrong:[{ match:12, fb:"Multiply by 3! = 6, not 3." }, { match:4, fb:"The difference is `a × 3!`, not `a`." }],
            hints:["The constant third difference is `a × 3!`.", "3! = 3 × 2 × 1 = 6.", "4 × 6 = 24."] },
          { id:"n3", goal:5, star:true, prompt:"A quadratic’s table (`x = 0` to 4) reads 3, 6, ?, 18, 27. Find the missing value.", answer:11, display:"11",
            why:"With 11 in the gap, the second differences are 2, 2, 2.",
            wrong:[{ match:9, fb:"Call it `m` and write the second differences in terms of `m`: `m - 9`, `24 - 2m`, `m - 9`. They must be equal." },
              { match:12, fb:"Call it `m` and write the second differences in terms of `m`: `m - 9`, `24 - 2m`, `m - 9`. They must be equal." }],
            hints:["Call the missing value `m`. Write the first differences in terms of `m`.",
              "First differences: 3, `m - 6`, `18 - m`, 9. Second differences: `m - 9`, `24 - 2m`, `m - 9`.",
              "A quadratic has constant second differences: `m - 9 = 24 - 2m`, so `3m = 33` and `m = 11`. (Check: second differences 2, 2, 2.)"] },
          { id:"n4", goal:5, star:true, prompt:"A table (`x = 0, 1, 2, …`) has first differences 5, 9, 13, 17, … and `y(0) = -2`. Find `y(6)`.", answer:88, display:"`y(6) = 88`",
            why:"Adding the first differences 5, 9, 13, 17, 21, 25 to −2 gives 3, 12, 25, 42, 63, 88.",
            wrong:[{ match:25, fb:"That’s the 6th first difference. Add the differences to −2 one at a time." }, { match:63, fb:"That’s `y(5)`." }],
            hints:["Each `y`-value is the one before plus the next first difference.", "The first differences go up by 4: 5, 9, 13, 17, 21, 25. Start at `y(0) = -2` and add them on.", "−2 + 5 = 3, 3 + 9 = 12, 12 + 13 = 25, 25 + 17 = 42, 42 + 21 = 63, 63 + 25 = 88. So `y(6) = 88`."] },
          { id:"n5", goal:6, star:true, prompt:"A triangular pyramid of cans has 1, 4, 10, 20, 35 cans for 1 to 5 layers. How many cans for 8 layers?", answer:120, display:"120 cans",
            why:"The third differences stay at 1, so the table continues 56, 84, 120.",
            wrong:[{ match:84, fb:"That’s 7 layers. Extend the table one more row." }, { match:56, fb:"That’s 6 layers." }],
            hints:["Find the differences until a column is constant.", "First differences 3, 6, 10, 15; second differences 3, 4, 5; third differences 1, 1. Keep the third differences at 1 and extend the table.", "Second differences 6, 7, 8; first differences 21, 28, 36; cans 56, 84, 120. So 8 layers hold 120 cans."] },
          { id:"n6", goal:5, star:true, prompt:"A cubic with leading coefficient 1 has the table `x = 0, 1, 2, 3` → `y = 2, 1, 6, 23`. Find `y(5)`.", answer:117, display:"`y(5) = 117`",
            why:"Keeping the third differences at 6 extends the table to 58 and then 117.",
            wrong:[{ match:58, fb:"That’s `y(4)`." }, { match:93, fb:"That keeps the second differences at 12. A cubic’s <strong>third</strong> differences are constant (1 × 3! = 6), so the second differences keep growing: 6, 12, 18, 24." }],
            hints:["With only 4 rows you get one third difference. What must it be for `a = 1`?",
              "First differences −1, 5, 17; second 6, 12; third 6, which matches 1 × 3! = 6. Keep the third differences at 6 and build the table outward.",
              "Second differences 6, 12, 18, 24; first differences −1, 5, 17, 35, 59; `y` = 2, 1, 6, 23, 58, 117. So `y(5) = 117`. (It’s `y = x^3 - 2x + 2`.)"] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Liam", how:"",
        instruction:"Liam made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"`x = 0` to 4, `y = 1, 4, 19, 64, 157`. Find the degree and the leading coefficient.",
            steps:["First differences: 3, 15, 45, 93.", "Second differences: 12, 30, 48.", "Third differences: 18, 18. Constant, so degree 3.", "`a = 18 ÷ 3 = 6`."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`a = 18 ÷ 3! = 18 ÷ 6 = 3`.", ok:true, why:"The third difference is `a × 3!`." },
              { t:"`a = 18`.", why:"That forgets to divide at all." },
              { t:"`a = 18 ÷ 2 = 9`.", why:"2 is 2!, the factorial for degree 2. Degree 3 needs 3! = 6." },
              { t:"Step 4 is correct as written.", why:"3! = 3 × 2 × 1 = 6, not 3." }],
            hints:["Which factorial goes with third differences?", "3! = 3 × 2 × 1.", "Step 4 is wrong: `a = 18 ÷ 6 = 3`."] },
          { id:"e2", goal:1, task:"`x = 0` to 4, `y = 20, 17, 8, -7, -28`. Find `a` and say which way the parabola opens.",
            steps:["First differences (earlier minus later): 3, 9, 15, 21.", "Second differences: 6, 6, 6.", "Degree 2, so `a = 6 ÷ 2! = 3`.", "`a > 0`, so the parabola opens up."],
            answer:0,
            stepFb:["", "Step 2 follows from step 1. The mistake is earlier.", "The ÷ 2! is right. The sign comes from step 1.", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Later minus earlier: −3, −9, −15, −21. Then the second differences are −6, so `a = -3` and it opens down.", ok:true, why:"The `y`-values fall faster and faster: a downward parabola." },
              { t:"Keep 3, 9, 15, 21, but take `a = 6`.", why:"That keeps the sign error and forgets ÷ 2!." },
              { t:"Use the sizes only: `a = 3`, and decide the direction from the first `y`-value.", why:"The sign of the differences is the information you need. Don’t drop it." },
              { t:"Step 1 is correct as written.", why:"Differences are later minus earlier. Falling values give negative differences." }],
            hints:["Check the direction of the subtraction in step 1.", "The `y`-values go down: 20, 17, 8, …. Should the differences be positive?", "Step 1 is wrong: the first differences are −3, −9, −15, −21, so `a = -6 ÷ 2 = -3` and the parabola opens down."] },
          { id:"e3", goal:4, task:"Is this table from a polynomial? `x = 0` to 5, `y = 2, 6, 18, 54, 162, 486`.",
            steps:["First differences: 4, 12, 36, 108, 324.", "Second differences: 8, 24, 72, 216.", "Third differences: 16, 48, 144.", "The next column must be constant, so it’s degree 4."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Each column is the one above it times 2, and every column still grows ×3. No column will settle: it’s exponential, `y = 2 × 3^x`.", ok:true, why:"The pattern copies itself." },
              { t:"It’s degree 3, because there are three difference columns.", why:"The number of columns computed isn’t the degree." },
              { t:"It’s degree 5, because there are 6 rows.", why:"The number of rows isn’t the degree either." },
              { t:"Step 4 is correct as written.", why:"The fourth differences are 32, 96: still growing ×3. Nothing forces a column to become constant." }],
            hints:["Compare each column with the one above it.", "4, 12, 36, … is 2, 6, 18, … times 2. What does that say about the next column?", "Step 4 is wrong: every column grows ×3, so none is constant. It’s exponential, not a polynomial."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the difference machine: the doubling table, the `n!` rule, or the 2-apart spacing?" },
      { id:"j2", q:"In your own words, why do the `n`th differences of a degree `n` polynomial come out constant?" },
      { id:"j3", q:"Explain to a friend how to get from a table to an equation by peeling off the leading term." },
      { id:"j4", q:"Which step still trips you up: subtracting in the right order, choosing the factorial, or spotting when a table won’t settle? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A table with `x`-values 1 apart has constant third differences, and its second differences are not constant. What is the degree of the polynomial?", options:[
          { t:"2", why:"Constant third differences come one column later than degree 2." },
          { t:"3", ok:true, why:"The first constant column is the third differences: degree 3." },
          { t:"4", why:"Degree 4 would need constant fourth differences, not third." },
          { t:"6", why:"6 is 3!, which you use for the leading coefficient, not the degree." }] },
        b:{ prompt:"A table with `x`-values 1 apart has constant fourth differences, and its third differences are not constant. What is the degree of the polynomial?", options:[
          { t:"3", why:"Degree 3 would already be constant at the third differences." },
          { t:"4", ok:true, why:"The first constant column is the fourth differences: degree 4." },
          { t:"5", why:"Degree 5 would need constant fifth differences." },
          { t:"24", why:"24 is 4!, which you use for the leading coefficient, not the degree." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"A polynomial table (`x`-values 1 apart) has constant third differences of −24. What is the leading coefficient?", options:[
          { t:"−24", why:"That’s the difference itself. Divide by 3! = 6." },
          { t:"−8", why:"That divides by 3. Divide by 3! = 6." },
          { t:"−4", ok:true, why:"−24 ÷ 3! = −24 ÷ 6 = −4." },
          { t:"4", why:"The sign of the difference is the sign of `a`." }] },
        b:{ prompt:"A polynomial table (`x`-values 1 apart) has constant fourth differences of 48. What is the leading coefficient?", options:[
          { t:"48", why:"That’s the difference itself. Divide by 4! = 24." },
          { t:"12", why:"That divides by 4. Divide by 4! = 24." },
          { t:"8", why:"That divides by 3! = 6. Fourth differences need 4!." },
          { t:"2", ok:true, why:"48 ÷ 4! = 48 ÷ 24 = 2." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"`x = 0` to 4, `y = 4, 7, 14, 25, 40`. What are the second differences?", options:[
          { t:"4, 4, 4", ok:true, why:"First differences 3, 7, 11, 15; their differences are 4, 4, 4." },
          { t:"3, 7, 11, 15", why:"Those are the first differences." },
          { t:"−4, −4, −4", why:"The values rise faster and faster, so the differences are positive." },
          { t:"2, 2, 2", why:"That’s 4 ÷ 2!, the leading coefficient, not the differences." }] },
        b:{ prompt:"`x = 0` to 4, `y = 9, 6, -1, -12, -27`. What are the second differences?", options:[
          { t:"−4, −4, −4", ok:true, why:"First differences −3, −7, −11, −15; their differences are −4, −4, −4." },
          { t:"−3, −7, −11, −15", why:"Those are the first differences." },
          { t:"4, 4, 4", why:"The values fall faster and faster, so the differences are negative." },
          { t:"−2, −2, −2", why:"That’s −4 ÷ 2!, the leading coefficient, not the differences." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Each table has `x = 0` to 5. Which one could <strong>not</strong> come from a polynomial of degree 3 or less?", options:[
          { t:"0, 1, 8, 27, 64, 125", why:"Third differences are all 6: it’s `x^3`. Fast growth isn’t the test; constant differences are." },
          { t:"5, 5, 7, 11, 17, 25", why:"Second differences are all 2: a quadratic, even though it starts with a repeated value." },
          { t:"−2, 1, 4, 7, 10, 13", why:"First differences are all 3: linear." },
          { t:"1, 2, 4, 8, 16, 32", ok:true, why:"Its differences repeat 1, 2, 4, 8, …, so no column becomes constant: it’s `2^x`." }] },
        b:{ prompt:"Each table has `x = 0` to 5. Which one could <strong>not</strong> come from a polynomial of degree 3 or less?", options:[
          { t:"1, −1, 3, 19, 53, 111", why:"Third differences are all 6: a cubic (`x^3 - 3x + 1`)." },
          { t:"2, 3, 6, 11, 18, 27", why:"Second differences are all 2: a quadratic." },
          { t:"10, 8, 6, 4, 2, 0", why:"First differences are all −2: linear." },
          { t:"0, 1, 1, 2, 3, 5", ok:true, why:"Differences 1, 0, 1, 1, 2 → −1, 1, 0, 1 → 2, −1, 1: no column up to the third is constant." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A quadratic’s table has `x = 1` to 5 and `y = 2, 5, ?, 17, 26`. What is the missing value?", options:[
          { t:"8", why:"That assumes the first differences are constant (5 + 3). A quadratic has constant <strong>second</strong> differences." },
          { t:"9", why:"That guesses first differences 3, 4, …. Then 17 − 9 = 8 and 26 − 17 = 9 don’t continue the pattern." },
          { t:"10", ok:true, why:"With `m` missing, the second differences are `m - 8`, `22 - 2m`, `m - 8`. Setting `m - 8 = 22 - 2m` gives `m = 10` (second differences 2, 2, 2)." },
          { t:"11", why:"That averages 5 and 17. A quadratic isn’t a straight line, so the middle value isn’t the average." }] },
        b:{ prompt:"A quadratic’s table has `x = 1` to 5 and `y = 1, 6, ?, 28, 45`. What is the missing value?", options:[
          { t:"11", why:"That assumes the first differences are constant (6 + 5)." },
          { t:"12", why:"That guesses first differences 5, 6, …. Then 28 − 12 = 16 and 45 − 28 = 17 don’t continue the pattern." },
          { t:"15", ok:true, why:"With `m` missing, the second differences are `m - 11`, `34 - 2m`, `m - 11`. Setting them equal gives `m = 15` (second differences 4, 4, 4)." },
          { t:"17", why:"That averages 6 and 28. A quadratic isn’t a straight line." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`x = 0` to 4, `y = 3, 0, 1, 6, 15`. Which equation fits the table?", options:[
          { t:"`y = 4x^2 - 7x + 3`", why:"That uses `a = 4`, the second difference itself. It fits (0, 3) and (1, 0) but gives 5 at `x = 2`, not 1." },
          { t:"`y = 2x^2 - 5x + 3`", ok:true, why:"Second differences 4, so `a = 4 ÷ 2 = 2`. `y(0) = 3` gives the constant 3. `y(1) = 0` gives `2 + b + 3 = 0`, so `b = -5`." },
          { t:"`y = 2x^2 - 3x + 3`", why:"That uses the first difference −3 as `b`. At `x = 1` it gives 2, not 0." },
          { t:"`y = x^2 - 4x + 3`", why:"That divides by 2 twice (`a = 1`). It fits the first two points but gives −1 at `x = 2`, not 1." }] },
        b:{ prompt:"`x = 0` to 4, `y = -2, 1, 10, 25, 46`. Which equation fits the table?", options:[
          { t:"`y = 6x^2 - 3x - 2`", why:"That uses `a = 6`, the second difference itself. At `x = 2` it gives 16, not 10." },
          { t:"`y = 3x^2 - 2`", ok:true, why:"Second differences 6, so `a = 3`. `y(0) = -2`. `y(1) = 1` gives `3 + b - 2 = 1`, so `b = 0`." },
          { t:"`y = 3x^2 + 3x - 2`", why:"That uses the first difference 3 as `b`. At `x = 1` it gives 4, not 1." },
          { t:"`y = 1.5x^2 + 1.5x - 2`", why:"That divides by 2 twice (`a = 1.5`). It fits the first two points but gives 7 at `x = 2`, not 10." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is a correct statement of the leading-coefficient rule?", options:[
          { t:"If the `x`-values are 1 apart and the `n`th differences are constant at `D`, then `a = D ÷ n!`.", ok:true, why:"Both conditions and the factorial." },
          { t:"If the `n`th differences are constant at `D`, then `a = D ÷ n`.", why:"The divisor is `n!`, and the `x`-values must be 1 apart." },
          { t:"If the `x`-values are 1 apart and the `n`th differences are constant at `D`, then `a = D × n!`.", why:"That multiplies. `D = a × n!`, so `a = D ÷ n!`." },
          { t:"The constant difference is always equal to `a`.", why:"Only for degree 1, where 1! = 1." }] },
        b:{ prompt:"Which is a correct statement about the differences of a polynomial?", options:[
          { t:"If the `x`-values are 1 apart, a polynomial of degree `n` with leading coefficient `a` has constant `n`th differences equal to `a × n!`.", ok:true, why:"Both conditions and the factorial." },
          { t:"A polynomial of degree `n` has constant `n`th differences equal to `a × n`, for any spacing.", why:"The factor is `n!`, and the spacing matters." },
          { t:"If the `x`-values are 1 apart, a polynomial of degree `n` has constant `n`th differences equal to `a`.", why:"Only for degree 1." },
          { t:"If the `x`-values are 1 apart, a polynomial of degree `n` has constant differences in column `n - 1`.", why:"The constant column is column `n`: a line (degree 1) has constant <strong>first</strong> differences." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why the table of `y = 3^x` (`x = 0, 1, 2, …`) never gives a constant difference column?", options:[
          { t:"Each first difference is `3^{x+1} - 3^x = 2 × 3^x`, so the first differences are the same growing pattern times 2. The same happens in every column, so none ever settles.", ok:true, why:"The pattern copies itself." },
          { t:"Because 6 rows aren’t enough to see it.", why:"More rows don’t help: every column is `3^x` times a number." },
          { t:"Because the `y`-values are all odd.", why:"Odd values have nothing to do with it: 1, 3, 5, 7 has constant differences." },
          { t:"Because the `x`-values aren’t 1 apart.", why:"They are 1 apart. The problem is the function, not the spacing." }] },
        b:{ prompt:"A table has `x = 0, 1, 3, 6, 10` and its second differences are constant. Which is the best explanation of why you can’t conclude `a` = (second difference) ÷ 2! here?", options:[
          { t:"The `x`-values aren’t equally spaced 1 apart, so each difference measures change over a different width. The `n!` rule only works with `x`-values 1 apart.", ok:true, why:"The rule needs `x`-values 1 apart, and these gaps are 1, 2, 3 and 4." },
          { t:"Because the `y`-values aren’t equally spaced.", why:"The `y`-values never need to be equally spaced; the `x`-values do." },
          { t:"Because 10 is too big for the rule.", why:"The size of the numbers doesn’t matter." },
          { t:"Because finite differences only work for `x ≥ 1`.", why:"Tables can start anywhere, even at negative `x`." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Oranges are stacked in square pyramids. Stacks with 1, 2, 3, 4, 5 layers hold 1, 5, 14, 30, 55 oranges. If a polynomial models the number of oranges, what are its degree and leading coefficient?", options:[
          { t:"Degree 2, `a = 5/2`", why:"That stops at the second differences 5, 7, 9, which aren’t constant." },
          { t:"Degree 3, `a = 1/3`", ok:true, why:"Differences 4, 9, 16, 25 → 5, 7, 9 → 2, 2. `a = 2 ÷ 3! = 1/3`." },
          { t:"Degree 3, `a = 2/3`", why:"That divides by 3. Divide by 3! = 6." },
          { t:"Degree 3, `a = 2`", why:"That’s the difference itself." }] },
        b:{ prompt:"A sculptor builds `n × n × n` cubes from small blocks, plus `n` display blocks. For `n = 1` to 5 the totals are 2, 10, 30, 68, 130 blocks. If a polynomial models the total, what are its degree and leading coefficient?", options:[
          { t:"Degree 2, `a = 6`", why:"That stops at the second differences 12, 18, 24, which aren’t constant." },
          { t:"Degree 3, `a = 1`", ok:true, why:"Differences 8, 20, 38, 62 → 12, 18, 24 → 6, 6. `a = 6 ÷ 3! = 1`." },
          { t:"Degree 3, `a = 2`", why:"That divides by 3. Divide by 3! = 6." },
          { t:"Degree 3, `a = 6`", why:"That’s the difference itself." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A model rocket’s height, in metres, at `t = 0, 1, 2, 3, 4` s is 0, 35, 60, 75, 80. Assuming a quadratic model, when does it land?", options:[
          { t:"4 s", why:"That’s when it’s highest (the first differences shrink to 5, then turn negative). It lands later." },
          { t:"4.5 s", why:"That uses `a = -10`. The second differences are −10, so `a = -10 ÷ 2 = -5`." },
          { t:"8 s", ok:true, why:"Second differences −10, so `a = -5`; `h = -5t^2 + 40t = -5t(t - 8)`. It lands at `t = 8`." },
          { t:"9 s", why:"That counts the rows of the extended table (`t = 0` to 8 is 9 rows) instead of reading the `t`-value." }] },
        b:{ prompt:"A ball rolls up a ramp and back. Its distance up the ramp, in centimetres, at `t = 0, 1, 2, 3, 4` s is 0, 18, 32, 42, 48. Assuming a quadratic model, when is it back at the start?", options:[
          { t:"5 s", why:"That’s when it’s furthest up the ramp. It returns later." },
          { t:"5.5 s", why:"That uses `a = -4`. The second differences are −4, so `a = -2`." },
          { t:"10 s", ok:true, why:"Second differences −4, so `a = -2`; `d = -2t^2 + 20t = -2t(t - 10)`. It’s back at `t = 10`." },
          { t:"11 s", why:"That counts the rows of the extended table (`t = 0` to 10 is 11 rows) instead of reading the `t`-value." }] } }
    ]
  },
  task:{
    title:"Design to a difference spec", summary:"Design to a difference spec",
    statement:"<p>Build a polynomial whose table, for `x = 0` to 5, meets the whole spec below. There’s more than one answer. Can you find another?</p><div class=\"refresh\" style=\"margin:0 0 12px\"><h4>The spec</h4><ol class=\"spec\"><li>The second differences are constant at 6.</li><li>The table starts at (0, 2).</li><li>The table turns: its first differences include both negative and positive numbers.</li><li>Every `y`-value in the table is between −20 and 40.</li></ol></div>",
    checks:["Second differences constant at 6", "Starts at (0, 2)", "The table turns", "Every `y`-value between −20 and 40"],
    tips:["Constant second differences mean degree 2, and the constant is `a × 2!`.", "`y(0)` is the constant term.", "Choose `b` so the first of the first differences is negative and the last is positive.", "Keep every value between −20 and 40."],
    explainPrompt:"Explain how you chose `a`, the constant and `b`, using the first differences.",
    vocab:"Use the words second difference, 2!, first difference and leading coefficient.",
    success:"Your design works!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Every answer has `a = 3` and constant 2. Only `b` can change, and the first differences 3 + `b`, …, 27 + `b` explain why it must be between −26 and −4, with line 4 narrowing it to −16 … −8."
  },
  cards:[
    ["First difference", "Later minus earlier: `y(x + 1) - y(x)`. Falling values give negative differences."],
    ["Constant `n`th differences", "With `x`-values 1 apart, the polynomial has degree `n` (the <strong>first</strong> constant column)."],
    ["The leading-coefficient rule", "`a` = (constant `n`th difference) ÷ `n!`. Example: third differences 12 → `a = 12 ÷ 6 = 2`."],
    ["2!, 3!, 4!", "2, 6, 24. `n! = n × (n - 1) × … × 1`."],
    ["Linear table", "First differences constant, equal to the slope."],
    ["Quadratic table", "Second differences constant, equal to `2a`."],
    ["Cubic table", "Third differences constant, equal to `6a`."],
    ["Exponential table", "Differences never settle: for `2^x`, every column is 1, 2, 4, 8, … again."],
    ["Negative constant difference", "Negative leading coefficient: −6 as second difference means `a = -3`, opening down."],
    ["Peeling", "Once you know `a`, subtract `ax^n` from each `y`-value. The new column has a lower degree; repeat to find the rest of the equation."],
    ["`x`-values 2 apart", "The `n!` rule fails: each `n`th difference is `2^n` times bigger. `x^2` with `x = 0, 2, 4, …` has second differences 8, not 2."],
    ["How many rows do you need?", "To see constant `n`th differences you need at least `n + 2` rows, so the `n`th column has two entries to compare. Equal entries in a short column can be a coincidence."]
  ]
};
