// MDM4U 08 Permutations with Identical Objects. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/08-permutations-identical.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "Swapping the identical letters gives the same word: divide by the shuffles that change nothing.";
const M3 = "Divide by a separate factorial for <strong>each</strong> repeated letter.";
const M4 = "Only repeated objects create duplicates. A single letter contributes `1! = 1`.";
const M5 = "A path is a sequence of moves. Count arrangements of R’s and U’s.";
const M6 = "After you place a letter, recount the repeats among the <strong>remaining</strong> letters.";

export default {
  id:"08-permutations-identical",
  kind:"topic",
  title:"Permutations with identical objects",
  topic:"Permutations with Identical Objects",
  readyTopic:"permutations with identical objects",
  hero:{
    eq:'<span class="pi-eqw">arrangements</span> = `{n!}/{a! b! c! ⋯}`', eqLabel:"arrangements equals n factorial over a factorial times b factorial times c factorial and so on", eqSize:"md",
    headline:"Swapping twins makes nothing new",
    text:"BANANA has 6 letters, but not `6! = 720` different arrangements. Swap two A’s and the word doesn’t change. Every arrangement is counted once for each way to shuffle the 3 A’s (`3!`) and the 2 N’s (`2!`). So there are 720 ÷ (`3! × 2!`) = <strong>60</strong> distinct arrangements. <strong>Identical objects</strong> shrink the count by <strong>division</strong>.",
    fig:{ html:'<div class="pi-h" role="img" aria-label="The tiles B, A, N, A, N, A appear with labels A1, A2, A3 and N1, N2, and a counter shows 720 labelled line-ups. Twelve labelled line-ups that all spell BANANA appear. The A labels fade, and each group of six line-ups that differ only in their A labels slides into one stack, labelled divide by 3 factorial; the counter drops from 720 to 120. Then the N labels fade, and the two stacks that differ only in their N labels merge, labelled divide by 2 factorial; the counter drops to 60 distinct words.">' +
      '<svg class="pi-hsvg" id="pi-hsvg" viewBox="0 0 360 196" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg>' +
      '<div class="pi-hcnt" id="pi-hcnt" aria-hidden="true"></div></div>' }
  },
  goals:[
    "I can explain why identical objects reduce the number of distinct arrangements.",
    "I can count arrangements with repeated objects using `n!/(a! b! ⋯)`.",
    "I can count shortest grid paths as arrangements of R and U moves.",
    "I can count arrangements with identical objects and a simple condition (begins with, ends with, kept together).",
    "I can solve problems with identical objects in contexts."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Factorials", goal:2, prompt:"Evaluate `{6!}/{3! × 2!}`.",
          options:[
            { t:"60", ok:true, why:"720 ÷ 12 = 60." },
            { t:"720", why:"That ignores the denominator. Divide by `3! × 2! = 12`." },
            { t:"120", why:"That divides by `3!` only. Divide by `2!` as well." },
            { t:"360", why:"That divides by `2!` only. Divide by `3!` as well." }],
          hints:["Work out `3! × 2!`.", "6 × 2 = 12.", "720 ÷ 12 = 60."] },
        { id:"w2", skill:"Factorials", goal:2, prompt:"Evaluate `{5!}/{2! × 3!}`.",
          options:[
            { t:"10", ok:true, why:"120 ÷ 12 = 10." },
            { t:"120", why:"That’s `5!` with no division. Divide by `2! × 3! = 12`." },
            { t:"20", why:"That divides by `3!` only. Divide by `2!` as well." },
            { t:"60", why:"That divides by `2!` only. Divide by `3!` as well." }],
          hints:["`2! × 3! = 12`.", "120 ÷ 12.", "10."] },
        { id:"w3", skill:"Arrangements of distinct objects", goal:1, prompt:"How many ways can the letters of WORD be arranged?",
          options:[
            { t:"24", ok:true, why:"`4! = 24`." },
            { t:"4", why:"That counts the letters, not their arrangements." },
            { t:"16", why:"4 × 4 isn’t a counting rule: each letter is used once, so the choices shrink, 4 × 3 × 2 × 1." },
            { t:"256", why:"`4^4` lets a letter repeat. Each letter of WORD is used once." }],
          hints:["4 different letters.", "4 × 3 × 2 × 1.", "24."] },
        { id:"w4", skill:"Arrangements of distinct objects", goal:1, prompt:"Evaluate `P(5, 5)`.",
          options:[
            { t:"120", ok:true, why:"`5!/0! = 120`." },
            { t:"1", why:"`P(5, 5) = 5!/(5 - 5)! = 5!/0!`, not `5!/5!`." },
            { t:"25", why:"5 × 5 isn’t a counting rule: `P(5, 5) = 5!`." },
            { t:"0", why:"`0! = 1`, not 0." }],
          hints:["`P(n, n) = n!/0!`.", "`0! = 1`.", "120."] },
        { id:"w5", skill:"Listing small cases", goal:1, prompt:"List every different arrangement of the letters A, A, B. How many are there?",
          options:[
            { t:"3", ok:true, why:"AAB, ABA, BAA." },
            { t:"6", why:"Swapping the two A’s gives the same arrangement." },
            { t:"2", why:"B can be first, middle or last." },
            { t:"1", why:"The position of B changes the arrangement." }],
          hints:["Where can the B go?", "First, middle or last.", "3 arrangements."] },
        { id:"w6", skill:"Listing small cases", goal:3, prompt:"On a grid, you walk 1 block right and 1 block up, in either order. How many shortest routes are there?",
          options:[
            { t:"2", ok:true, why:"RU or UR." },
            { t:"1", why:"Right first or up first." },
            { t:"4", why:"Only 2 moves to order." },
            { t:"3", why:"List them: RU, UR." }],
          hints:["Which move comes first?", "R then U, or U then R.", "2."] }
      ],
      refreshers:{
        "Factorials":"Work out each factorial, multiply the ones in the denominator, then divide. `3! × 2! = 12`.",
        "Arrangements of distinct objects":"`n` different objects in a line: `n!` arrangements.",
        "Listing small cases":"List systematically: fix the position of the odd one out, then move it along."
      }
    }
  },
  explore:{
    heading:"Word scrambler",
    intro:"Scramble a word and see how repeated letters collapse many line-ups into one. Then switch to grid paths, where the ‘letters’ are moves.",
    predIntro:"Make a prediction first. Then the word scrambler will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"words", word:"BANANA", labels:true, view:"count" },
        prompt:"With labelled letters there are 720 line-ups. How many distinct words once the labels are removed?",
        options:[{ t:"60", ok:true }, { t:"360" }, { t:"120" }, { t:"720" }],
        explain:"Each word appears `3! × 2! = 12` times: 720 ÷ 12 = 60. " + M1 },
      { id:"p2", start:{ mode:"words", word:"OTTAWA", labels:false, view:"count" },
        prompt:"OTTAWA: which divisor gives the number of distinct arrangements?",
        options:[{ t:"`2! × 2!`", ok:true }, { t:"`2!`" }, { t:"`2! + 2!`" }, { t:"`4!`" }],
        explain:"T appears twice and A appears twice: one factorial for each repeated letter, multiplied. 720 ÷ 4 = 180." },
      { id:"p3", start:{ mode:"grid", R:3, U:2 },
        prompt:"Grid paths, `R = 3` and `U = 2`. How many shortest paths?",
        options:[{ t:"10", ok:true }, { t:"5" }, { t:"6" }, { t:"12" }],
        explain:"A path is RRRUU in some order: `{5!}/{3! × 2!} = 10`. It isn’t 3 + 2 or 3 × 2." },
      { id:"p4", start:{ mode:"words", word:"custom", custom:"AAAA", labels:false, view:"count" },
        prompt:"Make your own: AAAA. How many distinct arrangements of AAAA?",
        options:[{ t:"1", ok:true }, { t:"24" }, { t:"4" }, { t:"0" }],
        explain:"`4!/4! = 1`: every shuffle looks the same." }
    ],
    chalIntro:"Set up the word scrambler, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Choose a word from the list, or build one, with exactly 180 distinct arrangements.",
        why:"180 = 720 ÷ (`2! × 2!`): 6 letters, with two different letters each appearing twice.",
        hints:["180 = 720 ÷ 4.", "`4 = 2! × 2!`.", "Use 6 letters with two different letters each appearing twice."] },
      { id:"tc2", goal:3, prompt:"Grid mode: set `R` and `U` so there are exactly 35 shortest paths.",
        why:"`{7!}/{4! 3!} = 35`: every path is 4 R’s and 3 U’s in some order (or 3 R’s and 4 U’s).",
        hints:["`35 = 7!/(R! U!)`.", "Try 7 moves in total.", "4 R’s and 3 U’s: 5040 ÷ (24 × 6) = 35."] },
      { id:"tc3", goal:2, stretch:true, prompt:"Make your own: build a 6-letter word that uses <strong>at least three different letters</strong> and has as <strong>few</strong> distinct arrangements as possible.",
        why:"Letter counts {4, 1, 1}, such as AAAABC: 720 ÷ `4!` = 30, the fewest possible with three different letters.",
        hints:["Count = 720 ÷ (product of the factorials).", "Make that product as large as you can with three groups.", "`4! × 1! × 1! = 24` beats `3! × 2! × 1! = 12`: AAAABC gives 30."] }
    ]
  },
  part3:{
    slug:"paths", name:"Paths",
    heading:"Paths on a grid",
    intro:"A shortest route on a city grid is a word made of R’s (one block right, east) and U’s (one block up, north). Work through the four stations: trace routes, stop at a checkpoint, dodge road work, then label every corner with its route count.",
    stations:[
      { id:"s1", name:"Count the routes",
        task:"A city grid, 4 blocks east and 3 blocks north. Trace <strong>three different</strong> shortest routes from Start to End: tap <strong>R</strong> or <strong>U</strong>, press → or ↑, or tap the next corner. Each route’s word appears.",
        alg:["Every shortest route is 4 R’s and 3 U’s in some order.", "`{7!}/{4! 3!}` = 5040 ÷ (24 × 6) = 35 routes"] },
      { id:"s2", name:"Through a checkpoint",
        task:"A coffee shop sits at (2, 1). Show the routes to the shop and the routes from the shop to the end. Then trace a route that stops for coffee.",
        alg:["Routes = (routes to the shop) × (routes from the shop to the end)", "To the shop, 2 right and 1 up: `{3!}/{2! 1!}` = 3", "From the shop to the end, 2 right and 2 up: `{4!}/{2! 2!}` = 6", "3 × 6 = 18 routes through the shop"] },
      { id:"s3", name:"Avoid a blocked corner",
        task:"Road work blocks (2, 1). Trace a route that avoids it. Then show every route: the survivors stay blue and the blocked ones fade.",
        alg:["Routes that avoid (2, 1) = all routes − routes through (2, 1)", "35 − 18 = 17 routes"] },
      { id:"s4", name:"Zoom to the counting",
        task:"Label every corner with the number of shortest routes from Start to it. Tap a corner to fill it in: corners along the bottom and left edges have 1 route, and each inside corner is the sum of the corner to its left and the corner below it.",
        alg:["Along the edges: 1, 1, 1, … (one straight route).", "Inside: (corner to the left) + (corner below), because the last move into a corner is R or U.", "End: 15 + 20 = 35, matching `{7!}/{4! 3!}`.", "Read the diagonals: 1 3 3 1 and 1 4 6 4 1 are rows of Pascal’s triangle (module 13).", "With road work at (2, 1), that corner counts 0 and the end drops to 17."] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Paths on a grid quick check",
      items:[
        { id:"q1", goal:3, prompt:"Shortest paths on a 2 × 2 grid?",
          choices:[
            { t:"6", ok:true, fb:"Right. A path is RRUU in some order: `{4!}/{2! 2!} = 6`." },
            { t:"4", fb:"`{4!}/{2! 2!} = 6`. " + M5 },
            { t:"2", fb:"`{4!}/{2! 2!} = 6`. " + M5 },
            { t:"24", fb:"`{4!}/{2! 2!} = 6`. The R’s are identical, and so are the U’s." }] },
        { id:"q2", goal:3, prompt:"Shortest paths on a 3 × 3 grid?",
          choices:[
            { t:"20", ok:true, fb:"Right. RRRUUU in some order: `{6!}/{3! 3!} = 20`." },
            { t:"9", fb:"`{6!}/{3! 3!} = 20`." },
            { t:"6", fb:"`{6!}/{3! 3!} = 20`." },
            { t:"720", fb:"`{6!}/{3! 3!} = 20`." }] },
        { id:"q3", goal:3, prompt:"On a 2 × 2 grid, how many paths pass through the centre (1, 1)?",
          choices:[
            { t:"4", ok:true, fb:"Right. 2 ways to reach the centre × 2 ways onward = 4." },
            { t:"2", fb:"2 ways to reach it × 2 ways onward." },
            { t:"6", fb:"2 ways to reach it × 2 ways onward." },
            { t:"3", fb:"2 ways to reach it × 2 ways onward." }] },
        { id:"q4", goal:3, prompt:"On a 2 × 2 grid, how many paths avoid the centre (1, 1)?",
          choices:[
            { t:"2", ok:true, fb:"Right. 6 − 4 = 2: around the edges." },
            { t:"4", fb:"6 − 4 = 2: around the edges." },
            { t:"6", fb:"6 − 4 = 2: around the edges." },
            { t:"0", fb:"6 − 4 = 2: around the edges." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Word ↔ count", summary:"Word ↔ count", goal:[2, 3],
        instruction:"Match each word or grid with its number of distinct arrangements. Some counts are decoys.",
        leftTitle:"Word or grid", rightTitle:"Distinct arrangements",
        left:[
          { id:"l1", t:"CANADA", goal:2, why:"A × 3: `{6!}/{3!}` = 120.",
            hints:["Count each letter: C, A, N, A, D, A.", "A × 3; C, N and D are single.", "720 ÷ 6 = 120."] },
          { id:"l2", t:"BANANA", goal:2, why:"A × 3 and N × 2: `{6!}/{3! 2!}` = 60.",
            hints:["Count each letter: B, A, N, A, N, A.", "A × 3, N × 2.", "720 ÷ (6 × 2) = 60."] },
          { id:"l3", t:"OTTAWA", goal:2, why:"T × 2 and A × 2: `{6!}/{2! 2!}` = 180.",
            hints:["Count each letter: O, T, T, A, W, A.", "T × 2, A × 2.", "720 ÷ (2 × 2) = 180."] },
          { id:"l4", t:"KAYAK", goal:2, why:"K × 2 and A × 2: `{5!}/{2! 2!}` = 30.",
            hints:["Count each letter: K, A, Y, A, K.", "K × 2, A × 2.", "120 ÷ (2 × 2) = 30."] },
          { id:"l5", t:"GEESE", goal:2, why:"E × 3: `{5!}/{3!}` = 20.",
            hints:["Count each letter: G, E, E, S, E.", "E × 3; G and S are single.", "120 ÷ 6 = 20."] },
          { id:"l6", t:"QUEBEC", goal:2, why:"Only E repeats: `{6!}/{2!}` = 360.",
            hints:["Count each letter: Q, U, E, B, E, C.", "E × 2; every other letter is single.", "720 ÷ 2 = 360."] },
          { id:"l7", t:"TORONTO", goal:2, why:"T × 2 and O × 3: `{7!}/{2! 3!}` = 420.",
            hints:["Count each letter: T, O, R, O, N, T, O.", "T × 2, O × 3.", "5040 ÷ (2 × 6) = 420."] },
          { id:"l8", t:"Grid: 4 right, 2 up", goal:3, why:"A path is RRRRUU in some order: `{6!}/{4! 2!}` = 15.", wrong:"Count arrangements of RRRRUU.",
            hints:["A path is a word of R’s and U’s.", "RRRRUU: R × 4, U × 2.", "720 ÷ (24 × 2) = 15."] }
        ],
        right:[
          { id:"r1", t:"120" }, { id:"r2", t:"60" }, { id:"r3", t:"180" }, { id:"r4", t:"30" }, { id:"r5", t:"20" },
          { id:"r6", t:"360" }, { id:"r7", t:"420" }, { id:"r8", t:"15" }, { id:"r9", t:"840" }, { id:"r10", t:"8" }, { id:"r11", t:"6" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l6|r3":"Only E repeats in QUEBEC: `6!/2! = 360`. " + M4,
          "l7|r9":"There are 2 T’s <strong>and</strong> 3 O’s: divide by both.",
          "l8|r10":"Count arrangements of RRRRUU. " + M5,
          "l8|r11":"Count arrangements of RRRRUU. " + M5
        },
        wrongDefault:"List the repeated letters, then divide `6!` (or `7!`, or `5!`) by each one’s factorial." },
      { id:"cond", type:"numeric", title:"Arrangements with a condition", summary:"Arrangements with a condition", goal:[2, 4, 5], star:true,
        instruction:"Count the arrangements. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"n1", goal:4, prompt:"Arrangements of TORONTO that begin with T", answer:120, display:"120", label:"Number of arrangements:",
            why:"Place one T first. The other 6 letters, O, R, O, N, T, O, have only O repeated (3 times): `{6!}/{3!}` = 120.",
            wrong:[{ match:60, fb:"With one T placed, the rest has only one T: `6!/3!`. " + M6 }],
            hints:["Put a T first. Which letters are left?", "O, R, O, N, T, O: only O repeats, 3 times.", "720 ÷ 6 = 120."] },
          { id:"n2", goal:4, prompt:"Arrangements of CANADA with the three A’s together", answer:24, display:"24", label:"Number of arrangements:",
            why:"Glue AAA into one block. The block, C, N and D are 4 different items: `4! = 24`.",
            wrong:[{ match:4, fb:"Treat AAA as one block: block, C, N, D are 4 different items: `4!`." }],
            hints:["Glue the three A’s into one block.", "How many items are you arranging now, and are they all different?", "Block, C, N, D: `4! = 24`."] },
          { id:"n3", goal:4, star:true, prompt:"Arrangements of OTTAWA with the two T’s <strong>not</strong> together", answer:120, display:"120", label:"Number of arrangements:",
            why:"All arrangements: 180. With the T’s together, the TT block, O, A, W, A give `{5!}/{2!}` = 60. 180 − 60 = 120.",
            wrong:[{ match:60, fb:"That’s the number <strong>with</strong> the T’s together. Subtract it from 180." }],
            hints:["Count all the arrangements, then subtract the ones with the T’s together.", "All: `{6!}/{2! 2!}` = 180. Together: TT block, O, A, W, A: `{5!}/{2!}` = 60.", "180 − 60 = 120."] },
          { id:"n4", goal:5, star:true, prompt:"How many 7-digit numbers use the digits 1, 1, 1, 2, 2, 3, 3?", answer:210, display:"210", label:"Number of numbers:",
            why:"`{7!}/{3! × 2! × 2!}` = 5040 ÷ 24 = 210.",
            wrong:[{ match:5040, fb:"Identical digits: divide by `3! × 2! × 2!`." }],
            hints:["Which digits repeat, and how many times?", "1 × 3, 2 × 2, 3 × 2: divide `7!` by `3! × 2! × 2!`.", "5040 ÷ 24 = 210."] },
          { id:"n5", goal:[3, 5], star:true, prompt:"Shortest paths on a 5 × 3 grid that avoid the point (2, 2)", answer:32, display:"32", label:"Number of paths:",
            why:"All paths: 56. Through (2, 2): 6 × 4 = 24. 56 − 24 = 32.",
            wrong:[{ match:24, fb:"That’s the number <strong>through</strong> (2, 2). Subtract it from 56." }],
            hints:["All paths: `{8!}/{5! 3!}` = 56.", "Through (2, 2): (`{4!}/{2! 2!}`) × (`{4!}/{3! 1!}`) = 6 × 4 = 24.", "56 − 24 = 32."] },
          { id:"n6", goal:4, star:true, prompt:"Arrangements of BANANA with no two A’s next to each other", answer:12, display:"12", label:"Number of arrangements:",
            why:"Place B, N, N first (3 ways). Then each A goes in a separate gap: there are 4 gaps and 3 A’s, so leave one gap empty (4 ways). 3 × 4 = 12.",
            wrong:[{ match:60, fb:"Place B, N, N first (3 ways). Then each A goes in a separate gap: there are 4 gaps and 3 A’s, so leave one gap empty (4 ways). 3 × 4 = 12." }],
            hints:["Arrange the non-A letters: B, N, N.", "`3!/2! = 3` ways, which make 4 gaps: _ B _ N _ N _.", "Choose which gap stays empty: 4 ways. 3 × 4 = 12."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Hattie", how:"", goal:[2, 3, 4],
        instruction:"Hattie made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"How many distinct arrangements of BANANA?",
            steps:["BANANA has 6 letters.", "A appears 3 times and N appears 2 times.", "Arrangements = `6! - 3! - 2! = 712`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Divide instead: `{6!}/{3! × 2!}` = 720 ÷ 12 = 60.", ok:true, why:"Each word was counted `3! × 2!` times, so divide by `3! × 2!`." },
              { t:"`6! - 3! × 2! = 708`.", why:"Subtracting doesn’t remove duplicates." },
              { t:"`{6!}/{3! + 2!} = 90`.", why:"Multiply the factorials, don’t add." },
              { t:"Step 3 is correct.", why:"712 is more than the 60 you can list." }],
            hints:["How many times is each word counted among the 720?", "`3! × 2! = 12` times.", "720 ÷ 12 = 60."] },
          { id:"e2", goal:3, task:"Count the shortest paths on a grid 4 blocks right and 2 blocks up.",
            steps:["Each path has 6 moves.", "It’s an arrangement of RRRRUU.", "Paths = `{6!}/{4!} = 30`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Divide by both repeats: `{6!}/{4! × 2!}` = 15.", ok:true, why:"R repeats 4 times and U repeats twice: 720 ÷ 48 = 15." },
              { t:"`{6!}/{4 × 2}` = 90.", why:"Use factorials, not the counts." },
              { t:"4 × 2 = 8.", why:M5 },
              { t:"Step 3 is correct.", why:"The two U’s are identical too." }],
            hints:["Which letters repeat in RRRRUU?", "R × 4 and U × 2.", "720 ÷ 48 = 15."] },
          { id:"e3", goal:4, task:"How many arrangements of TORONTO begin with O?",
            steps:["Put an O first.", "The other 6 letters are T, R, O, N, T, O.", "Arrange them: `{6!}/{3! × 2!}` = 60."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Only 2 O’s remain: `{6!}/{2! × 2!}` = 180.", ok:true, why:M6 + " T × 2 and O × 2: 720 ÷ 4 = 180." },
              { t:"`{7!}/{3! × 2!}` = 420.", why:"That ignores the O in front." },
              { t:"`6! = 720`.", why:"The T’s and the O’s still repeat." },
              { t:"Step 3 is correct.", why:"One O is already used." }],
            hints:["How many O’s are left after placing one?", "Two.", "720 ÷ 4 = 180."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how much repeats shrink the count, or that grid paths are ‘words’?" },
      { id:"j2", q:"In your own words, explain why we divide (not subtract) when objects are identical." },
      { id:"j3", q:"Explain to a friend how to count the paths through a checkpoint on a grid." },
      { id:"j4", q:"Which step still slows you down: counting the repeats, the factorial arithmetic, or the conditions? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"How many distinct arrangements of the letters of KAYAK?", options:[
          { t:"30", ok:true, why:"`{5!}/{2! × 2!}` = 120 ÷ 4 = 30." },
          { t:"120", why:"The K’s and the A’s repeat." },
          { t:"116", why:"120 − 2 − 2 subtracts instead of dividing." },
          { t:"60", why:"Divide by `2!` for K <strong>and</strong> `2!` for A." }] },
        b:{ prompt:"How many distinct arrangements of the letters of GEESE?", options:[
          { t:"20", ok:true, why:"`5!/3! = 20`." },
          { t:"120", why:"The three E’s are identical. " + M1 },
          { t:"114", why:"120 − 6 subtracts instead of dividing." },
          { t:"40", why:"Divide by `3! = 6`, not by 3." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"How many shortest paths are there on a grid 3 blocks right and 3 blocks up?", options:[
          { t:"20", ok:true, why:"`{6!}/{3! × 3!}` = 20." },
          { t:"6", why:"3 + 3 counts moves, not paths." },
          { t:"9", why:"3 × 3 counts squares." },
          { t:"720", why:"The R’s are identical, and so are the U’s." }] },
        b:{ prompt:"How many shortest paths are there on a grid 2 blocks right and 4 blocks up?", options:[
          { t:"15", ok:true, why:"`{6!}/{2! × 4!}` = 15." },
          { t:"6", why:"2 + 4 counts moves, not paths. " + M5 },
          { t:"8", why:"2 × 4 counts squares. " + M5 },
          { t:"720", why:"The R’s are identical, and so are the U’s." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which expression counts the distinct arrangements of OTTAWA?", options:[
          { t:"`{6!}/{2! × 2!}`", ok:true, why:"T and A each appear twice: one factorial for each, multiplied." },
          { t:"`{6!}/{2!}`", why:"A repeats too." },
          { t:"`6! - 2! - 2!`", why:"Each word was counted `2! × 2!` times, so divide, don’t subtract." },
          { t:"`{6!}/{4!}`", why:"Use separate factorials, `2! × 2!`, not `(2 + 2)!`." }] },
        b:{ prompt:"Which expression counts the distinct arrangements of CANADA?", options:[
          { t:"`{6!}/{3!}`", ok:true, why:"Only A repeats, 3 times." },
          { t:"`6!`", why:"The three A’s are identical. " + M1 },
          { t:"`6! - 3!`", why:"Each word was counted `3!` times, so divide, don’t subtract." },
          { t:"`{6!}/{3! × 3!}`", why:"Only A repeats; C, N and D appear once." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"How many arrangements of CANADA begin <strong>and</strong> end with A?", options:[
          { t:"24", ok:true, why:"The middle letters C, N, D, A are all different: `4! = 24`." },
          { t:"12", why:"Only one A is left in the middle: no division needed." },
          { t:"120", why:"That’s every arrangement." },
          { t:"4", why:"The four middle letters can be ordered in `4!` ways." }] },
        b:{ prompt:"How many arrangements of BANANA begin with N?", options:[
          { t:"20", ok:true, why:"The rest, B, A, A, A, N, gives `5!/3! = 20`." },
          { t:"10", why:"Only one N is left: divide by `3!` only." },
          { t:"60", why:"That’s every arrangement." },
          { t:"120", why:"The three A’s that remain are identical: divide by `3!`." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"On a grid 4 right and 3 up, how many shortest paths pass through the point (2, 1)?", options:[
          { t:"18", ok:true, why:"`{3!}/{2! 1!}` = 3 to get there, `{4!}/{2! 2!}` = 6 onward; 3 × 6 = 18." },
          { t:"35", why:"That’s every path, not just those through the point." },
          { t:"9", why:"3 + 6: you go to the point <strong>and then</strong> onward, so multiply." },
          { t:"17", why:"That’s the number that <strong>avoid</strong> the point." }] },
        b:{ prompt:"On the same grid, how many shortest paths avoid the point (2, 1)?", options:[
          { t:"17", ok:true, why:"35 − 18 = 17." },
          { t:"18", why:"That’s the number through it." },
          { t:"35", why:"That’s every path. Subtract the 18 through the point." },
          { t:"26", why:"Subtract the paths through the point (18), not 9." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"A shelf holds 3 identical math books, 2 identical French books and 1 history book. How many distinct arrangements?", options:[
          { t:"60", ok:true, why:"`{6!}/{3! × 2!}` = 60." },
          { t:"720", why:"The math books are identical, and so are the French books. " + M1 },
          { t:"6", why:"That counts the books, not their arrangements." },
          { t:"120", why:"Divide by `2!` for the French books too." }] },
        b:{ prompt:"A flagpole displays 4 identical red flags and 2 identical blue flags in a column. How many distinct displays?", options:[
          { t:"15", ok:true, why:"`{6!}/{4! × 2!}` = 15." },
          { t:"720", why:"The red flags are identical, and so are the blue flags. Divide by `4! × 2!`." },
          { t:"30", why:"Divide by `2!` as well." },
          { t:"8", why:"4 × 2 doesn’t count arrangements." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why QUEBEC has `{6!}/{2!}` arrangements?", options:[
          { t:"If the two E’s were different, there would be `6!` arrangements. Each word appears twice (E₁…E₂ and E₂…E₁), so divide by `2!`.", ok:true, why:"Each word is counted once for each way to order the two E’s." },
          { t:"Because QUEBEC has 2 vowels.", why:"Q, U, E, B, E, C has three vowels, and that isn’t the reason." },
          { t:"Because E is used twice, subtract 2.", why:"Subtracting doesn’t remove duplicates: each word is counted twice, so divide by `2!`." },
          { t:"Because `{6!}/{2!}` works for every 6-letter word.", why:"Only when exactly one letter appears twice." }] },
        b:{ prompt:"Which is the best explanation of why a grid 4 right and 2 up has `{6!}/{4! × 2!}` shortest paths?", options:[
          { t:"Each path is an arrangement of RRRRUU. The R’s are identical and the U’s are identical, so divide by `4!` and `2!`.", ok:true, why:"A path is a word of moves with two repeated letters." },
          { t:"Because you take 4 + 2 = 6 steps.", why:"That gives the length, not the count." },
          { t:"Because the grid has 4 × 2 squares.", why:"Squares don’t count paths. " + M5 },
          { t:"Because paths can cross each other.", why:"Crossing doesn’t affect the count." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which work for TORONTO is correct?", options:[
          { t:"`{7!}/{3! × 2!}` = 5040 ÷ 12 = 420", ok:true, why:"O × 3 and T × 2: one factorial for each repeated letter." },
          { t:"`{7!}/{3!}` = 840", why:"Divide by `2!` for the T’s too. " + M3 },
          { t:"`7! - 3! - 2!` = 5032", why:"Subtracting doesn’t remove duplicates: divide." },
          { t:"`{7!}/{5!}` = 42", why:"Use separate factorials, `3! × 2!`, not `(3 + 2)!`." }] },
        b:{ prompt:"Which work for OTTAWA is correct?", options:[
          { t:"`{6!}/{2! × 2!}` = 720 ÷ 4 = 180", ok:true, why:"T × 2 and A × 2: one factorial for each repeated letter." },
          { t:"`{6!}/{2!}` = 360", why:"Both T and A repeat. " + M3 },
          { t:"`6! - 4` = 716", why:"Subtracting doesn’t remove duplicates: divide by `2! × 2!`." },
          { t:"`{6!}/{4!}` = 30", why:"Use separate factorials, `2! × 2!`, not `(2 + 2)!`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A radio station’s playlist has 7 slots: 4 identical copies of one ad and 3 different songs. How many distinct orders?", options:[
          { t:"210", ok:true, why:"`7!/4! = 210`." },
          { t:"5040", why:"The 4 ads are identical: divide by `4!`." },
          { t:"35", why:"The songs are different: don’t divide by `3!`." },
          { t:"28", why:"7 × 4 isn’t an arrangement count." }] },
        b:{ prompt:"A gardener plants 5 identical tulips and 2 different shrubs in a row of 7 spots. How many distinct rows?", options:[
          { t:"42", ok:true, why:"`7!/5! = 42`." },
          { t:"5040", why:"The 5 tulips are identical: divide by `5!`." },
          { t:"21", why:"The shrubs are different." },
          { t:"10", why:"5 × 2 isn’t an arrangement count." }] } },
      { id:"a2", cat:"A", goal:[3, 5],
        a:{ prompt:"A courier in a grid-shaped downtown drives 5 blocks east and 3 north to a first stop, then 2 east and 2 north to a second stop, always taking a shortest route. How many routes for the whole trip?", options:[
          { t:"336", ok:true, why:"`{8!}/{5! 3!}` = 56, then `{4!}/{2! 2!}` = 6; 56 × 6 = 336." },
          { t:"62", why:"56 + 6: the legs happen one after the other, so multiply." },
          { t:"792", why:"`{12!}/{7! 5!}` counts routes that might skip the first stop." },
          { t:"17", why:"That isn’t a route count." }] },
        b:{ prompt:"A cyclist rides 3 blocks east and 2 north to a café, then 3 east and 1 north to a park. How many shortest routes?", options:[
          { t:"40", ok:true, why:"`{5!}/{3! 2!}` = 10, then `{4!}/{3! 1!}` = 4; 10 × 4 = 40." },
          { t:"14", why:"Multiply the legs." },
          { t:"84", why:"`{9!}/{6! 3!}` ignores the café." },
          { t:"7", why:"That isn’t a route count." }] } }
    ]
  },
  task:{
    title:"Design a word", summary:"Design a word",
    statement:"<p>Build a ‘word’ from letter tiles (A–G, repeats allowed) that meets every condition. Different letter patterns count as different answers. Can you find all the patterns?</p>" +
      '<ol class="pi-conds"><li>The word has exactly 7 letters.</li><li>It uses exactly 3 different letters.</li><li>It has between 100 and 250 distinct arrangements.</li></ol>',
    checks:["7 letters", "Exactly 3 different letters", "100 to 250 arrangements"],
    tips:["Fill all 7 slots.",
          "Use exactly three different letters, e.g. some A’s, some B’s and some C’s.",
          "With three letters, the counts add to 7. Try splits like 4 + 2 + 1 and compute 5040 ÷ (`4! × 2! × 1!`)."],
    explainPrompt:"Explain how the way you split the 7 letters controls the number of arrangements.",
    vocab:"Use the words identical, factorial and divide.",
    more:"Different letter patterns count as different answers. Can you find all the patterns?",
    after3:"The split {5, 1, 1} gives only 42: one big group divides the count the most."
  },
  cards:[
    ["Identical objects", "`n!/(a! b! ⋯)`: one factorial per repeated kind."],
    ["Why divide?", "Each distinct arrangement appears `a! b! ⋯` times among the labelled ones."],
    ["BANANA", "`6!/(3! 2!) = 60`."],
    ["Single letters", "Contribute `1! = 1`: no division."],
    ["Divide, don’t subtract", "`6! - 3! - 2!` is wrong; `6!/(3! 2!)` is right."],
    ["Grid paths", "`R` right, `U` up: `(R + U)!/(R! U!)`."],
    ["3 × 3 grid", "`6!/(3! 3!) = 20` paths."],
    ["Through a checkpoint", "(paths to it) × (paths from it)."],
    ["Avoid a point", "All paths − paths through it."],
    ["A condition first", "Place the letter, then recount the repeats that remain."],
    ["Keep identical letters together", "Glue them into one block, then arrange."]
  ]
};
