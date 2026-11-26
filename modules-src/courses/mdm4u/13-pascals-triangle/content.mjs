// MDM4U 13 Pascal's Triangle & Patterns. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/13-pascals-triangle.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "The top 1 is row 0. Row `n` starts with position 0, so `C(n, r)` is the `(r + 1)`th number in it.";
const M2 = (n) => "Row `n` has `n + 1` entries: row " + n + " has " + (n + 1) + ".";
const M3 = "The sum sits just below the last entry <strong>and one step over</strong>, on the next diagonal.";
const M4 = "Routes through a point: (routes to it) × (routes from it).";
const M5 = "A route is an arrangement of `a` R’s and `b` U’s: `C(a + b, b)`.";
const M6 = "Row `n` sums to `2^n`.";
const RW = (t) => '<span class="pt-rowtxt">' + t + "</span>";   // a row of the triangle written out, spaced
const M7 = "Patterns here have counting reasons. A pattern without a reason is a guess.";

// hero: a small triangle (rows 0–5) beside the rule, with 10 = 4 + 6 highlighted
function heroMini(){
  const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]];
  return '<span class="pt-hmini" aria-hidden="true">' + rows.map((row, n) => '<span class="pt-hmr">' + row.map((v, r) =>
    '<span class="pt-hmc' + (n === 4 && (r === 1 || r === 2) ? " ab" : "") + (n === 5 && r === 2 ? " hit" : "") + '">' + v + "</span>").join("") + "</span>").join("") + "</span>";
}

export default {
  id:"13-pascals-triangle",
  kind:"topic",
  title:"Pascal’s triangle and patterns",
  topic:"Pascal’s Triangle & Patterns",
  readyTopic:"Pascal’s triangle and its patterns",
  hero:{
    eq:'<span class="pt-heq">' + heroMini() + '<span class="pt-hrule">`C(n, r) = C(n - 1, r - 1) + C(n - 1, r)`<span class="pt-hex">`10 = 4 + 6`</span></span></span>',
    eqLabel:"A small Pascal’s triangle, rows 0 to 5, beside the rule C of n, r equals C of n minus 1, r minus 1, plus C of n minus 1, r. In row 5, 10 equals 4 plus 6.",
    eqSize:"sm",
    headline:"Add the two above",
    text:"Start with 1. Each new entry is the <strong>sum of the two entries above it</strong>. The result is <strong>Pascal’s triangle</strong>, where row `n`, position `r` (both counted from <strong>0</strong>) is exactly <strong>`C(n, r)`</strong>. It hides patterns, and it counts routes on a grid.",
    fig:{ html:'<div class="pt-h" role="img" aria-label="A single 1 appears, labelled row 0. Rows 1 to 6 grow downward. Each new entry is drawn by two short arrows from the entries above it, and their sum appears. Then the entry 15 in row 6 lights up with the label C of 6, 2.">' +
      '<svg class="pt-hsvg" id="pt-hsvg" viewBox="0 0 360 262" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can build rows of Pascal’s triangle by adding, and number rows and positions from 0.",
    "I can read any entry as `C(n, r)` and find `C(n, r)` in the triangle.",
    "I can describe patterns (symmetry, row sums, diagonals, odd and even) and explain them.",
    "I can use the hockey-stick pattern to add a run of diagonal entries quickly.",
    "I can count shortest routes on a grid, including grids with a blocked point.",
    "I can use the triangle to solve problems in context (routes, selections of any size)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Combinations", goal:2, prompt:"Evaluate `C(6, 2)`.",
          options:[
            { t:"15", ok:true, why:"`(6 × 5)/2`." },
            { t:"30", why:"That’s `P(6, 2)`. Divide by `2!` as well." },
            { t:"12", why:"That’s 6 × 2. `C(6, 2) = (6 × 5)/2`." },
            { t:"36", why:"That’s `6^2`. `C(6, 2) = (6 × 5)/2`." }],
          hints:["`C(n, 2) = n(n - 1)/2`.", "6 × 5 = 30.", "15."] },
        { id:"w2", skill:"Combinations", goal:2, prompt:"Evaluate `C(5, 0)`.",
          options:[
            { t:"1", ok:true, why:"One way to choose nothing." },
            { t:"0", why:"Choosing nothing is one choice." },
            { t:"5", why:"That’s `C(5, 1)`." },
            { t:"120", why:"That’s `5!`." }],
          hints:["`0! = 1`.", "`5!/(0! 5!)`.", "1."] },
        { id:"w3", skill:"Arrangements with repeats", goal:5, prompt:"How many different arrangements of the letters R R R U U are there?",
          options:[
            { t:"10", ok:true, why:"`5!/(3! 2!) = 10`." },
            { t:"120", why:"Swapping two R’s doesn’t make a new arrangement." },
            { t:"6", why:"That’s 3 × 2. Arrangements of 3 R’s and 2 U’s: `5!/(3! 2!)`." },
            { t:"32", why:"That’s `2^5`, which lets each letter be R or U freely. You have exactly 3 R’s and 2 U’s." }],
          hints:["5 letters, 3 alike and 2 alike.", "`5!/(3! × 2!)`.", "120/12 = 10."] },
        { id:"w4", skill:"Arrangements with repeats", goal:5, prompt:"Which equals the number of arrangements of 4 R’s and 2 U’s?",
          options:[
            { t:"`C(6, 2)`", ok:true, why:"Choose the 2 places for the U’s." },
            { t:"`P(6, 2)`", why:"Swapping the two U’s changes nothing." },
            { t:"4 × 2", why:"4 × 2 isn’t an arrangement count. " + M5 },
            { t:"`6!`", why:"That treats all letters as different." }],
          hints:["Six slots; where do the U’s go?", "Choose 2 of 6 slots.", "`C(6, 2) = 15`."] },
        { id:"w5", skill:"Powers of 2", goal:3, prompt:"Evaluate `2^7`.",
          options:[
            { t:"128", ok:true, why:"Double 7 times: 2, 4, 8, 16, 32, 64, 128." },
            { t:"14", why:"That’s 2 × 7. `2^7` means 7 factors of 2." },
            { t:"49", why:"That’s `7^2`. `2^7` means 7 factors of 2." },
            { t:"256", why:"That’s `2^8`." }],
          hints:["Double 7 times.", "2, 4, 8, 16, 32, 64, …", "128."] },
        { id:"w6", skill:"Powers of 2", goal:3, prompt:"A set has 5 items. How many selections (including none) are there?",
          options:[
            { t:"32", ok:true, why:"Each item is in or out: `2^5`." },
            { t:"10", why:"That’s 2 × 5. Each item is in or out: 2 × 2 × 2 × 2 × 2." },
            { t:"25", why:"That’s `5^2`. Each item has 2 states: `2^5`." },
            { t:"31", why:"That forgets the empty selection." }],
          hints:["Each item has 2 states.", "2 × 2 × 2 × 2 × 2.", "32."] }
      ],
      refreshers:{
        "Combinations":"`C(n, r) = n!/[r!(n - r)!]`; `C(n, 0) = C(n, n) = 1`.",
        "Arrangements with repeats":"Arrangements of `a` R’s and `b` U’s = `(a + b)!/(a! b!) = C(a + b, b)`.",
        "Powers of 2":"`2^n` means `n` factors of 2: `2^5 = 32`, `2^10 = 1024`."
      }
    }
  },
  explore:{
    heading:"Triangle explorer",
    intro:"Build the triangle, tap any entry to see which combination it is, then switch on a pattern.",
    predIntro:"Make a prediction first. Then the triangle explorer will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"pattern", pat:"sums", rows:4 },
        prompt:"What is the sum of row 5?",
        options:[{ t:"32", ok:true }, { t:"25" }, { t:"10" }, { t:"31" }],
        explain:"Each row sum doubles: 1, 2, 4, 8, 16, 32 = `2^5`. " + M6 },
      { id:"p2", start:{ mode:"pattern", pat:"hockey", rows:6, hs:{ n:2, r:2, dir:"L", len:4 } },
        prompt:"The cells `C(2, 2)`, `C(3, 2)`, `C(4, 2)` and `C(5, 2)` are shaded (1, 3, 6, 10). Which entry equals their sum?",
        options:[{ t:"20, the entry `C(6, 3)`", ok:true }, { t:"15, the next entry on the same diagonal" }, { t:"35" }, { t:"10" }],
        explain:"The sum sits below the last entry and one step over." },
      { id:"p3", start:{ mode:"pattern", pat:"mod", mod:2, rows:8 },
        prompt:"Colour by remainder ÷ 2, rows 0–8. How many odd entries does row 8 have?",
        options:[{ t:"2", ok:true }, { t:"9" }, { t:"4" }, { t:"0" }],
        explain:"Row 8 is 1 8 28 56 70 56 28 8 1: only the end 1s are odd. Rows 2, 4 and 8 (powers of 2) have odd entries only at the ends." },
      { id:"p4", start:{ mode:"pattern", pat:"diag", diag:2, rows:5 },
        prompt:"The third diagonal (position 2) reads 1, 3, 6, 10, … What comes next?",
        options:[{ t:"15", ok:true }, { t:"14" }, { t:"13" }, { t:"21" }],
        explain:"`C(6, 2) = 15`. These are the triangular numbers: each adds one more than the last." }
    ],
    chalIntro:"Set up the triangle explorer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Build row 7 in Build mode with no errors.",
        why:"Row 7 is 1 7 21 35 35 21 7 1: 8 entries, each the sum of the two entries above it.",
        hints:["Copy row 6: 1 6 15 20 15 6 1.", "Add neighbours: 1 + 6, 6 + 15, 15 + 20, …", "1 7 21 35 35 21 7 1."] },
      { id:"tc2", goal:4, prompt:"Shade a hockey stick whose sum is <strong>56</strong>.",
        why:"1 + 3 + 6 + 10 + 15 + 21 = 56 = `C(8, 3)`, and 1 + 5 + 15 + 35 = 56 = `C(8, 5)`. Their mirror images work too.",
        hints:["56 appears in row 8 as `C(8, 3)` and `C(8, 5)`.", "The stick ends just above and beside 56.", "Shade 1, 3, 6, 10, 15, 21 down the third diagonal."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Colour by remainder ÷ 2. Row 7 is all odd. Find the next row (up to 15) in which <strong>every</strong> entry is odd. Tap an entry in that row.",
        why:"Row 15 is all odd. The all-odd rows 0, 1, 3, 7, 15 are each one less than a power of 2.",
        hints:["All-odd rows so far: 0, 1, 3, 7.", "Each is one less than a power of 2.", "16 − 1 = 15."] }
    ]
  },
  part3:{
    slug:"paths", name:"Paths",
    heading:"Paths and Pascal",
    intro:"Every route to a corner arrives either from the left or from below, so route counts add, just like the triangle. Label a street grid, close a corner for construction, then watch a Galton board sort balls into a row of the triangle.",
    stations:[
      { id:"s1", name:"Label the grid",
        task:"A street grid from A (bottom left) to B, 4 blocks right and 3 blocks up; moves are right or up only. Tap each corner and type its route count. The left and bottom edges are all 1s, and each corner is the sum of the corner to its left and the corner below.",
        alg:["A route is an arrangement of RRRRUUU.", "`{7!}/{4! 3!} = C(7, 3) = 35`"] },
      { id:"s2", name:"A blocked corner",
        task:"The same grid, but the corner 2 right and 1 up is closed for construction. Relabel the grid: the blocked corner gets 0, and the sums after it are redone.",
        alg:["Routes that avoid it = all routes − routes through the closed corner", "Routes through it: `C(3, 1) × C(4, 2) = 3 × 6 = 18`", "35 − 18 = 17"] },
      { id:"s3", name:"The Galton board",
        task:"Balls fall through a triangle of pegs, bouncing left or right at each peg. A ball’s route on this 6-row board is a word of 6 L’s and R’s, and the bin it lands in counts its R’s. Drop balls, then send each of the 64 routes once.",
        alg:["Routes into bin `k` (`k` right bounces): `C(6, k)`", "1 : 6 : 15 : 20 : 15 : 6 : 1, out of `2^6 = 64` routes", "That’s row 6 of the triangle. Module 21 turns these counts into probabilities."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Paths quick check",
      items:[
        { id:"q1", goal:5, prompt:"Shortest routes on a grid 3 right and 2 up?",
          choices:[
            { t:"10", ok:true, fb:"Right. `C(5, 2) = 10`." },
            { t:"6", fb:"`C(5, 2) = 10`. " + M5 },
            { t:"32", fb:"`C(5, 2) = 10`. " + M5 },
            { t:"20", fb:"`C(5, 2) = 10`. " + M5 }] },
        { id:"q2", goal:2, prompt:"The entry in row 9, position 2?",
          choices:[
            { t:"36", ok:true, fb:"Right. `C(9, 2) = 36`." },
            { t:"28", fb:"`C(9, 2) = 36`; row and position start at 0." },
            { t:"9", fb:"`C(9, 2) = 36`; row and position start at 0." },
            { t:"84", fb:"`C(9, 2) = 36`; row and position start at 0." }] },
        { id:"q3", goal:5, prompt:"Grid 2 right and 2 up; the centre corner is blocked. Routes?",
          choices:[
            { t:"2", ok:true, fb:"Right. 6 − (2 × 2) = 2." },
            { t:"6", fb:"6 − (2 × 2) = 2. " + M4 },
            { t:"4", fb:"6 − (2 × 2) = 2. " + M4 },
            { t:"3", fb:"6 − (2 × 2) = 2. " + M4 }] },
        { id:"q4", goal:1, prompt:"Each entry of the triangle is…",
          choices:[
            { t:"The sum of the two above", ok:true, fb:"Right. That’s the building rule." },
            { t:"Double the one above", fb:"Each entry is the sum of the two entries above it. That’s the building rule." },
            { t:"The row number times the position", fb:"Each entry is the sum of the two entries above it. That’s the building rule." },
            { t:"The sum of its row", fb:"Each entry is the sum of the two entries above it. That’s the building rule." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"fill", type:"numeric", title:"Fill the triangle", summary:"Fill the triangle", goal:[1, 2, 3],
        instruction:"Find each entry or sum. Count rows and positions from 0.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"f1", goal:2, prompt:"`C(9, 2)`", answer:36, display:"36", label:"Entry:",
            why:"`C(9, 2) = (9 × 8)/2 = 36`.",
            wrong:[{ match:28, fb:"That’s `C(8, 2)`; row 9 is one row lower." }],
            hints:["Row 9 begins 1, 9, …", "`C(9, 2) = (9 × 8)/2`.", "36."] },
          { id:"f2", goal:2, prompt:"`C(9, 4)`", answer:126, display:"126", label:"Entry:",
            why:"`C(9, 4) = {9 × 8 × 7 × 6}/{4!} = 126`.",
            wrong:[{ match:84, fb:"That’s `C(9, 3)`." }],
            hints:["Position 4 of row 9, counting from 0.", "`{9 × 8 × 7 × 6}/{4!}` = 3024 ÷ 24.", "126."] },
          { id:"f3", goal:[1, 2], prompt:"Row 10, position 3", answer:120, display:"120", label:"Entry:",
            why:"Row 10, position 3 is `C(10, 3) = 120`.",
            wrong:[{ match:84, fb:"Count the row from 0. " + M1 }],
            hints:["Row 10, position 3 is `C(10, 3)`.", "`{10 × 9 × 8}/{3!}` = 720 ÷ 6.", "120."] },
          { id:"f4", goal:[1, 2], prompt:"Row 12, position 1", answer:12, display:"12", label:"Entry:",
            why:"Row `n`, position 1 is `C(n, 1) = n`.",
            wrong:[{ match:11, fb:M1 }],
            hints:["Position 1 is the second number in the row.", "Row `n`, position 1 is `C(n, 1) = n`.", "12."] },
          { id:"f5", goal:3, prompt:"The sum of row 9", answer:512, display:"512", label:"Sum:",
            why:"Row 9 sums to `2^9 = 512`.",
            wrong:[{ match:18, fb:M6 }],
            hints:["Row `n` sums to `2^n`.", "`2^9 = 2 × 2^8`.", "512."] },
          { id:"f6", goal:1, prompt:"The two entries above `C(11, 5)` add to…", answer:462, display:"462", label:"Sum:",
            why:"`C(10, 4) + C(10, 5)` = 210 + 252 = 462, which is `C(11, 5)`.",
            wrong:[{ match:252, fb:"Add both entries above: `C(10, 4) + C(10, 5)` = 210 + 252." }],
            hints:["Pascal’s rule gives `C(11, 5)`.", "`C(11, 5) = 462`.", "462."] },
          { id:"f7", goal:[1, 2], prompt:"Row 6, position 3", answer:20, display:"20", label:"Entry:",
            why:"Row 6 is 1 6 15 20 15 6 1; position 3 is the middle, 20.",
            wrong:[{ match:15, fb:M1 }],
            hints:["Row 6 is 1 6 15 20 15 6 1.", "Position 3 is the 4th number: the middle.", "20."] },
          { id:"f8", goal:3, prompt:"The 5th number on the tetrahedral diagonal (1, 4, 10, 20, …)", answer:35, display:"35", label:"Entry:",
            why:"The diagonal is `C(3, 3), C(4, 3), C(5, 3), …`; the 5th is `C(7, 3) = 35`.",
            wrong:[{ match:30, fb:"The next is `C(7, 3) = 35`, not a jump of 10." }],
            hints:["The diagonal is `C(3, 3), C(4, 3), C(5, 3), …`", "The 5th is `C(7, 3)`.", "35."] }
        ] },
      { id:"pattern", type:"numeric", title:"Pattern problems", summary:"Pattern problems", goal:[3, 4, 5, 6], star:true,
        instruction:"Use a pattern to answer each one. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"r1", goal:4, prompt:"Use the hockey stick: 1 + 3 + 6 + 10 + 15 + 21 + 28 = ?", answer:84, display:"84", label:"Sum:",
            why:"These are `C(2, 2)` to `C(8, 2)`, so the sum is `C(9, 3) = 84`.",
            wrong:[{ match:36, fb:"That’s the next entry on the same diagonal. " + M3 }],
            hints:["These are `C(2, 2)` to `C(8, 2)`.", "The sum is one row below the last cell and one step over: `C(9, 3)`.", "84."] },
          { id:"r2", goal:3, prompt:"The shallow diagonal from row 6’s left 1 goes up and right: `C(6, 0), C(5, 1), C(4, 2), C(3, 3)`. Its sum?", answer:13, display:"13", label:"Sum:",
            why:"1 + 5 + 6 + 1 = 13, a Fibonacci number.",
            wrong:[{ match:12, fb:"1 + 5 + 6 + 1 = 13, a Fibonacci number." }],
            hints:["Look up each entry: `C(5, 1) = 5`, `C(4, 2) = 6`.", "1 + 5 + 6 + 1.", "13."] },
          { id:"r3", goal:5, star:true, prompt:"Shortest routes on a grid 5 right and 3 up?", answer:56, display:"56", label:"Routes:",
            why:"A route is an arrangement of RRRRRUUU: `C(8, 3) = 56`.",
            wrong:[{ match:15, fb:"That’s 5 × 3. " + M5 }, { match:256, fb:"That’s `2^8`. " + M5 }],
            hints:["A route is an arrangement of 5 R’s and 3 U’s.", "`C(8, 3)`.", "56."] },
          { id:"r4", goal:5, star:true, prompt:"Same grid, but the corner 3 right and 1 up is blocked. Routes?", answer:32, display:"32", label:"Routes:",
            why:"Through the corner: 4 × 6 = 24 routes, so 56 − 24 = 32 avoid it.",
            wrong:[{ match:46, fb:"Through the corner: 4 × 6 = 24, not 4 + 6 = 10. " + M4 }],
            hints:["Routes through the corner = to it × from it.", "To it: `C(4, 1) = 4`; from it (2 right, 2 up): `C(4, 2) = 6`.", "56 − 24 = 32."] },
          { id:"r5", goal:3, star:true, prompt:"How many entries of row 10 are odd?", answer:4, display:"4", label:"Odd entries:",
            why:"Row 10: 1 10 45 120 210 252 210 120 45 10 1. The two 1s and the two 45s are odd.",
            wrong:[{ match:2, fb:"Row 10: 1 10 45 120 210 252 210 120 45 10 1: the 45s are odd too." }],
            hints:["Write out row 10.", "1 10 45 120 210 252 210 120 45 10 1.", "4: two 1s and two 45s."] },
          { id:"r6", goal:[3, 6], star:true, prompt:"Find the row in which three neighbouring entries are in the ratio 1 : 2 : 3.", answer:14, display:"Row 14", label:"Row:",
            why:"Row 14 has 1001, 2002, 3003 at positions 4–6. Use `C(n, r + 1)/C(n, r) = (n - r)/(r + 1)`.",
            general:"Use `C(n, r + 1)/C(n, r) = (n - r)/(r + 1)`.",
            hints:["Neighbours: `C(n, r + 1)/C(n, r) = (n - r)/(r + 1)`.", "Set it to 2, then the next ratio to `3/2`.", "`n - r = 2r + 2` and `2(n - r - 1) = 3(r + 2)` give `r = 4`, `n = 14`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Marisol", how:"", goal:[2, 4, 5],
        instruction:"Marisol made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Use Pascal’s triangle to find `C(7, 3)`.",
            steps:["The top row is row 1.", "So row 7 is 1 6 15 20 15 6 1.", "Counting the first 1 as position 1, position 3 is 15.", "`C(7, 3) = 15`."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier.", "This follows the same numbering. Look earlier.", "This follows. The mistake is earlier."],
            fixes:[
              { t:"The top row is row 0, so row 7 is 1 7 21 35 35 21 7 1, and position 3 (from 0) is 35.", ok:true, why:M1 },
              { t:"Use position 4 of the same row: 20.", why:"Fix the row first. " + M1 },
              { t:"`C(7, 3) = 7 × 3 = 21`.", why:"Not a counting formula." },
              { t:"Step 1 is correct.", why:"Row 1 is 1 1, the second row." }],
            hints:["Which row is 1 1?", "Row 1, so the single 1 is row 0.", "35."] },
          { id:"e2", goal:4, task:"Find 1 + 3 + 6 + 10 + 15 using a pattern.",
            steps:["These are `C(2, 2), C(3, 2), C(4, 2), C(5, 2), C(6, 2)` on one diagonal.", "The hockey stick says the sum is the next entry on the same diagonal, `C(7, 2) = 21`.", "So the sum is 21."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"The sum is the entry below the last one and one step over: `C(7, 3) = 35`. Check: 1 + 3 + 6 + 10 + 15 = 35.", ok:true, why:M3 },
              { t:"`C(6, 3) = 20`.", why:"That’s above, not below." },
              { t:"`C(8, 3) = 56`.", why:"One row too far." },
              { t:"Step 2 is correct.", why:"1 + 3 + 6 + 10 + 15 is 35, not 21. " + M3 }],
            hints:["Add them directly.", "35.", "35 is `C(7, 3)`, on the next diagonal."] },
          { id:"e3", goal:5, task:"Routes on a grid 4 right and 3 up, avoiding the corner 2 right and 1 up.",
            steps:["All routes: `C(7, 3) = 35`.", "Routes to the blocked corner: `C(3, 1) = 3`. Routes from it to the end: `C(4, 2) = 6`.", "Routes through it: 3 + 6 = 9.", "Answer: 35 − 9 = 26."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Each way in can pair with each way out: 3 × 6 = 18, so 35 − 18 = 17.", ok:true, why:M4 },
              { t:"35 − 3 = 32.", why:"That ignores the routes after the corner." },
              { t:"35 + 9 = 44.", why:"You must remove the blocked routes." },
              { t:"Step 3 is correct.", why:"Through-routes combine two stages: multiply." }],
            hints:["Is a route through the corner ‘in <strong>and</strong> out’ or ‘in <strong>or</strong> out’?", "And: multiply.", "18 through, so 17 avoid it."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which pattern surprised you most: the hockey stick, the Fibonacci diagonals or the odd/even colouring?" },
      { id:"j2", q:"Pick one pattern and explain <strong>why</strong> it’s true, not just that it works." },
      { id:"j3", q:"Explain to a friend how to count routes on a grid with a blocked corner." },
      { id:"j4", q:"Which do you still mix up: row numbers, positions, or which way the hockey stick bends? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is row 6 of Pascal’s triangle?", options:[
          { t:RW("1 6 15 20 15 6 1"), ok:true, why:"Row 6 has 7 entries, each the sum of the two entries above it in row 5." },
          { t:RW("1 5 10 10 5 1"), why:"That’s row 5. " + M1 },
          { t:RW("1 6 15 15 6 1"), why:M2(6) },
          { t:RW("1 6 12 20 12 6 1"), why:"6 + 6 isn’t how 15 is made: 5 + 10 = 15." }] },
        b:{ prompt:"Which is row 7 of Pascal’s triangle?", options:[
          { t:RW("1 7 21 35 35 21 7 1"), ok:true, why:"Row 7 has 8 entries, each the sum of the two entries above it in row 6." },
          { t:RW("1 6 15 20 15 6 1"), why:"That’s row 6. " + M1 },
          { t:RW("1 7 21 35 21 7 1"), why:M2(7) + " 35 appears twice in the middle." },
          { t:RW("1 7 14 35 35 14 7 1"), why:"6 + 15 = 21." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the entry in row 8, position 3?", options:[
          { t:"56", ok:true, why:"`C(8, 3)`." },
          { t:"28", why:"That’s position 2. " + M1 },
          { t:"21", why:"That’s row 7, position 2. " + M1 },
          { t:"70", why:"That’s position 4, the middle." }] },
        b:{ prompt:"What is the entry in row 9, position 2?", options:[
          { t:"36", ok:true, why:"`C(9, 2) = 36`." },
          { t:"84", why:"That’s position 3." },
          { t:"28", why:"That’s row 8. " + M1 },
          { t:"9", why:"That’s position 1." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What is the sum of row 9?", options:[
          { t:"512", ok:true, why:"`2^9`." },
          { t:"18", why:"That’s 2 × 9. " + M6 },
          { t:"81", why:"That’s `9^2`. " + M6 },
          { t:"256", why:"That’s row 8. " + M1 }] },
        b:{ prompt:"What is the sum of row 11?", options:[
          { t:"2048", ok:true, why:"`2^11`." },
          { t:"22", why:"That’s 2 × 11. " + M6 },
          { t:"121", why:"That’s `11^2`. " + M6 },
          { t:"1024", why:"That’s `2^10`, the sum of row 10. " + M1 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"1 + 4 + 10 + 20 + 35 are consecutive entries on one diagonal. What is their sum?", options:[
          { t:"70", ok:true, why:"`C(3, 3)` to `C(7, 3)` sum to `C(8, 4)`." },
          { t:"56", why:"`C(8, 3)` is the next entry on the same diagonal. " + M3 },
          { t:"35", why:"That’s the last entry, not the sum." },
          { t:"126", why:"`C(9, 4)` is one row too far." }] },
        b:{ prompt:"1 + 5 + 15 + 35 are consecutive entries on one diagonal. What is their sum?", options:[
          { t:"56", ok:true, why:"`C(4, 4)` to `C(7, 4)` sum to `C(8, 5)`." },
          { t:"70", why:"`C(8, 4)` is the next entry on the same diagonal. " + M3 },
          { t:"35", why:"That’s the last entry." },
          { t:"126", why:"One row too far." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"How many shortest routes are there on a grid 5 blocks right and 2 blocks up?", options:[
          { t:"21", ok:true, why:"`C(7, 2)`." },
          { t:"10", why:"5 × 2. " + M5 },
          { t:"42", why:"`P(7, 2)` treats the two U’s as different." },
          { t:"128", why:"`2^7` allows any number of each move. " + M5 }] },
        b:{ prompt:"How many shortest routes are there on a grid 3 right and 4 up?", options:[
          { t:"35", ok:true, why:"`C(7, 3)`." },
          { t:"12", why:"3 × 4. " + M5 },
          { t:"210", why:"That’s `P(7, 3)`, which treats the R’s as different." },
          { t:"128", why:"`2^7` allows any number of each move. " + M5 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A grid is 3 right and 3 up. The corner 1 right and 1 up is blocked. How many shortest routes avoid it?", options:[
          { t:"8", ok:true, why:"20 − (2 × 6) = 8." },
          { t:"12", why:"That’s the number of routes <strong>through</strong> the corner (or 20 − (2 + 6), which adds instead of multiplying). " + M4 },
          { t:"18", why:"20 − 2 subtracts only the routes into the corner." },
          { t:"20", why:"That’s every route; remove the ones through the blocked corner." }] },
        b:{ prompt:"A grid is 4 right and 2 up. The corner 2 right and 1 up is blocked. How many routes avoid it?", options:[
          { t:"6", ok:true, why:"15 − (3 × 3) = 6." },
          { t:"9", why:"That’s the routes through the corner (or 15 − (3 + 3), which adds instead of multiplying). " + M4 },
          { t:"12", why:"15 − 3 subtracts only the routes into the corner." },
          { t:"15", why:"That’s every route; remove the ones through the blocked corner." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why each entry is the sum of the two entries above it?", options:[
          { t:"On a grid, every route to a corner arrives either from the left or from below, never both, so the route counts add.", ok:true, why:"Two cases that can’t overlap, so their counts add." },
          { t:"Because the triangle is symmetric.", why:"Symmetry doesn’t explain addition." },
          { t:"Because each row doubles.", why:"That’s the row sum, a different pattern." },
          { t:"Because it works for the first five rows.", why:M7 }] },
        b:{ prompt:"Which is the best explanation of why the triangle is symmetric?", options:[
          { t:"`C(n, r) = C(n, n - r)`: choosing `r` items is the same as choosing the `n - r` to leave out.", ok:true, why:"Each choice of the items you take matches exactly one choice of the items you leave out." },
          { t:"Because each row starts and ends with 1.", why:"Only the ends." },
          { t:"Because each entry is the sum of the two above.", why:"That’s the building rule." },
          { t:"Because it looks the same in every row I checked.", why:M7 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which correctly names the entry 10 in row 5?", options:[
          { t:"`C(5, 2)`, and also `C(5, 3)`", ok:true, why:"10 sits at positions 2 and 3 of row 5, counting from 0." },
          { t:"`C(5, 10)`", why:"The bottom number (the second one in `C(n, r)`) is the position." },
          { t:"`C(4, 2)`", why:M1 },
          { t:"`C(10, 5)`", why:"The row comes first." }] },
        b:{ prompt:"Which correctly names the entry 15 in row 6?", options:[
          { t:"`C(6, 2)`, and also `C(6, 4)`", ok:true, why:"15 sits at positions 2 and 4 of row 6, counting from 0." },
          { t:"`C(6, 15)`", why:"The bottom number (the second one in `C(n, r)`) is the position." },
          { t:"`C(5, 2)`", why:M1 },
          { t:"`C(15, 6)`", why:"The row comes first." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A taxi drives from home to school on a street grid: 4 blocks east and 3 blocks north, only east or north. How many routes are there?", options:[
          { t:"35", ok:true, why:"`C(7, 3)`." },
          { t:"12", why:"4 × 3. " + M5 },
          { t:"7", why:"That’s the number of blocks." },
          { t:"840", why:"`P(7, 4)` treats the east moves as different." }] },
        b:{ prompt:"A courier rides 5 blocks east and 3 blocks north, only east or north. How many routes are there?", options:[
          { t:"56", ok:true, why:"`C(8, 3)`." },
          { t:"15", why:"5 × 3. " + M5 },
          { t:"8", why:"That’s the number of blocks." },
          { t:"6720", why:"That’s `P(8, 5)`, which treats the east moves as different." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A pizza shop has 9 toppings. How many different pizzas have an <strong>odd</strong> number of toppings?", options:[
          { t:"256", ok:true, why:"Row 9’s odd-position entries make up half of `2^9 = 512`." },
          { t:"512", why:"That’s all pizzas." },
          { t:"255", why:"Exactly half of 512 is 256." },
          { t:"128", why:"That’s half of row 8." }] },
        b:{ prompt:"A shop has 7 toppings. How many different pizzas have an <strong>even</strong> number of toppings (a plain pizza counts as 0)?", options:[
          { t:"64", ok:true, why:"Half of `2^7 = 128`." },
          { t:"128", why:"That’s all pizzas." },
          { t:"63", why:"The plain pizza is included." },
          { t:"32", why:"That’s half of row 6." }] } }
    ]
  },
  task:{
    title:"Hockey stick hunt", summary:"Hockey stick hunt",
    statement:"<p>Choose a diagonal and a length. Your hockey stick starts at the 1 that begins that diagonal (the entry `C(k, k)`) and runs down it. Meet every condition. Can you find all the answers?</p>" +
      '<ol class="pt-conds"><li>The stick’s sum is between 30 and 80.</li><li>The sum is even.</li><li>The stick is on diagonal 2 or higher (not the counting numbers).</li></ol>',
    checks:["Sum between 30 and 80", "Even sum", "Diagonal 2 or higher"],
    tips:["The sum is the blade: one row below the last cell, one step over.",
          "Find the even entries between 30 and 80 in rows 4–13.",
          "Diagonal 1 is 1, 2, 3, …; start on the triangular numbers or beyond."],
    explainPrompt:"Explain how you predicted each sum without adding, and why two different sticks gave 56.",
    vocab:"Use the words hockey stick, diagonal, row and symmetry.",
    success:"Your hockey stick works!",
    more:"There’s more than one answer. Can you find all of them?",
    after3:"Two different sticks both make 56. That’s symmetry: `C(8, 3) = C(8, 5)`."
  },
  cards:[
    ["Building rule", "Each entry is the sum of the two entries above it."],
    ["Numbering", "The top 1 is row 0; positions start at 0."],
    ["Row `n`, position `r`", "`C(n, r)`."],
    ["Entries in row `n`", "`n + 1`."],
    ["Row sum", "`2^n`."],
    ["Symmetry", "`C(n, r) = C(n, n - r)`."],
    ["Diagonals", "1s; counting numbers; triangular numbers; tetrahedral numbers."],
    ["Hockey stick", "A diagonal run from the edge sums to the entry below the last cell, one step over."],
    ["Fibonacci", "Shallow diagonals sum to 1, 1, 2, 3, 5, 8, 13, …"],
    ["Odd/even colouring", "A Sierpiński triangle; rows 1, 3, 7, 15 are all odd."],
    ["Grid routes", "`a` right and `b` up: `C(a + b, b)`."],
    ["Blocked corner", "All routes − (routes in × routes out)."]
  ]
};
