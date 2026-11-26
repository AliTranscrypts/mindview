// MDM4U 09 Permutations with Restrictions. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/09-permutations-restrictions.md
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "Fill the restricted position first; otherwise the number of choices left for it depends on earlier picks.";
const M2 = "Inside the block, the items can swap: multiply by `2!` (or `3!`, …).";
const M3 = "Apart = total − together, and ‘together’ includes the order inside the block.";
const M4 = "A 4-digit number can’t start with 0: the first digit has 9 choices, not 10.";
const M5 = "Cases must not overlap. Subtract the arrangements counted twice.";
const M6 = "‘Not all together’ still allows two side by side. For no two adjacent, use gaps.";
const M7 = "Ending in 0 frees up the first digit; ending in 2 or 4 doesn’t. Count each case separately.";
const NB = " ";   // no-break space for thousands (10 108 800)
const big = s => s.replace(/ /g, NB);

// Practice 1 (Which strategy?): the four boxes, and the three hint levels the plan describes
const BOX = { first:"Restriction first", block:"Block (together)", sub:"Subtract (apart / not)", cases:"Cases" };
const H1 = "Does the rule fix a position, glue items, forbid something, or split into types?";
const sortHints = (box, why) => [H1, "Look at the <strong>" + BOX[box] + "</strong> card.", "<strong>" + BOX[box] + ".</strong> " + why];

// Part 3: the four strategy cards (same order at every station)
const cards = (ans, fb) => [
  { id:"first", t:"Restriction first", ok:ans === "first", why:fb.first },
  { id:"block", t:"Block", ok:ans === "block", why:fb.block },
  { id:"sub", t:"Subtract (total − bad)", ok:ans === "sub", why:fb.sub },
  { id:"cases", t:"Cases", ok:ans === "cases", why:fb.cases }];

export default {
  id:"09-permutations-restrictions",
  kind:"topic",
  title:"Permutations with restrictions",
  topic:"Permutations with Restrictions",
  readyTopic:"permutations with restrictions",
  hero:{
    eq:"apart = total − together", eqLabel:"apart equals total minus together", eqSize:"sm",
    headline:"Restrictions first",
    text:"Six friends line up, but two of them insist on standing together. Glue them into one <strong>block</strong>: now there are 5 items, so `5! = 120` line-ups, and the pair can stand in `2!` orders inside the block, giving <strong>240</strong>. If two friends must stand <strong>apart</strong>, take all 720 line-ups and subtract the 240 where they’re together: <strong>480</strong>. Restrictions first, then everything else.",
    fig:{ html:'<div class="pr-h" role="img" aria-label="Six people, Cy, Ana, Di, Bo, Ed and Fay, stand in a row, and a counter shows 6! = 720. Ana and Bo slide together and are wrapped in a rounded block outline; the row now has 5 items, and the counter shows 5! = 120. Ana and Bo swap places inside the block, and the counter shows 5! × 2! = 240. A split bar then shows the 720 line-ups divided into 240 together and 480 apart.">' +
      '<svg class="pr-hsvg" id="pr-hsvg" viewBox="0 0 360 206" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can count arrangements when a position must hold a particular object or type of object.",
    "I can count arrangements where certain objects must be together, using a block.",
    "I can count arrangements where objects must be apart, by subtracting or by using gaps.",
    "I can choose a strategy (restriction first, block, subtract, gaps or cases) and explain why it fits.",
    "I can count numbers with digit conditions (no leading zero, even or odd, greater than a value).",
    "I can solve multi-condition arrangement problems in context."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Permutations", goal:1, prompt:"In how many ways can 5 people stand in a line?",
          options:[
            { t:"120", ok:true, why:"`5! = 120`." },
            { t:"25", why:"That’s 5 × 5." },
            { t:"15", why:"That’s 5 + 4 + 3 + 2 + 1. Multiply the choices instead." },
            { t:"5", why:"That counts the people, not the line-ups." }],
          hints:["5 choices for the first spot, then 4…", "5 × 4 × 3 × 2 × 1.", "120."] },
        { id:"w2", skill:"Permutations", goal:5, prompt:"Evaluate `P(7, 3)`.",
          options:[
            { t:"210", ok:true, why:"7 × 6 × 5 = 210." },
            { t:"35", why:"That ignores order." },
            { t:"343", why:"That’s `7^3`, which allows repeats." },
            { t:"840", why:"That’s `7!/3!`. Divide by `4!`, the objects left out." }],
          hints:["3 places.", "7, then 6, then 5 choices.", "210."] },
        { id:"w3", skill:"Identical objects", goal:2, prompt:"How many distinct arrangements of the letters A, A, B, C?",
          options:[
            { t:"12", ok:true, why:"`4!/2! = 12`." },
            { t:"24", why:"That ignores the repeat." },
            { t:"6", why:"That divides by `2!` twice." },
            { t:"22", why:"That’s `4! - 2!`. Divide by `2!` instead." }],
          hints:["Which letter repeats?", "A twice.", "24 ÷ 2 = 12."] },
        { id:"w4", skill:"Complements and overlap", goal:3, prompt:"Of 30 students, 12 play hockey. How many don’t play hockey?",
          options:[
            { t:"18", ok:true, why:"30 − 12 = 18." },
            { t:"42", why:"That adds. ‘Not hockey’ is all students minus the hockey players." },
            { t:"12", why:"That’s the number who do play hockey." },
            { t:"30", why:"That ignores the condition." }],
          hints:["All students minus the hockey players.", "30 − 12.", "18."] },
        { id:"w5", skill:"Complements and overlap", goal:6, prompt:"Set `A` has 10 outcomes and set `B` has 8; 3 outcomes are in both. How many outcomes are in `A` or `B`?",
          options:[
            { t:"15", ok:true, why:"10 + 8 − 3 = 15." },
            { t:"18", why:"That counts the overlap twice. " + M5 },
            { t:"21", why:"That adds the overlap instead of subtracting it." },
            { t:"5", why:"That subtracts wrongly: 10 + 8 − 3, not 8 − 3." }],
          hints:["Adding 10 + 8 counts the overlap twice.", "Subtract it once.", "15."] },
        { id:"w6", skill:"Factorial arithmetic", goal:3, prompt:"Evaluate `5! - 4!`.",
          options:[
            { t:"96", ok:true, why:"120 − 24 = 96." },
            { t:"1", why:"That’s `(5 - 4)!`. Factorials don’t subtract like that." },
            { t:"116", why:"That’s 120 − 4. Evaluate `4!` too." },
            { t:"24", why:"That’s `4!` alone." }],
          hints:["Work out each factorial.", "120 and 24.", "96."] }
      ],
      refreshers:{
        "Permutations":"`n` objects in a line: `n!`. `r` of them in order: `P(n, r) = n!/(n - r)!`.",
        "Identical objects":"Divide by the factorial of each repeat count.",
        "Complements and overlap":"‘Not `A`’ = total − `A`. ‘`A` or `B`’ = `A` + `B` − both.",
        "Factorial arithmetic":"Evaluate each factorial before you add or subtract."
      }
    }
  },
  explore:{
    heading:"Rule-bound line-up",
    intro:"Add rules to a line-up and watch the count change. The strategy panel shows how to count it; List mode checks small cases.",
    predIntro:"Make a prediction first. Then the line-up will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"people", n:5, rules:["first"] },
        prompt:"`n = 5`, rule “Ana is first”. How many line-ups?",
        options:[{ t:"24", ok:true }, { t:"120" }, { t:"96" }, { t:"20" }],
        explain:"Ana’s spot is decided; the other 4 fill `4! = 24` ways." },
      { id:"p2", start:{ mode:"people", n:5, rules:["tog"] },
        prompt:"`n = 5`, “Ana and Bo together”. How many line-ups?",
        options:[{ t:"48", ok:true }, { t:"24" }, { t:"120" }, { t:"72" }],
        explain:"4 items (the block + 3 people): `4! = 24`, times `2!` inside the block = 48." },
      { id:"p3", start:{ mode:"people", n:5, rules:["apart"] },
        prompt:"`n = 5`, “Ana and Bo apart”. How many line-ups?",
        options:[{ t:"72", ok:true }, { t:"48" }, { t:"96" }, { t:"24" }],
        explain:"120 − 48 = 72." },
      { id:"p4", start:{ mode:"people", n:6, rules:["before"] },
        prompt:"`n = 6`, “Ana before Bo”. How many line-ups have Ana somewhere before Bo?",
        options:[{ t:"360", ok:true }, { t:"720" }, { t:"120" }, { t:"240" }],
        explain:"Swap Ana and Bo in any line-up and you get one where Bo is first. So exactly half: 720 ÷ 2." }
    ],
    chalIntro:"Set up the line-up, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:5, prompt:"Digit mode: digits {0, 1, 2, 3, 4}, 3-digit numbers, no repeated digit. Choose rules so the count is 48.",
        why:"No leading zero: the first digit has 4 choices (1–4), then 4, then 3: 4 × 4 × 3 = 48.",
        hints:["What makes 012 not a 3-digit number?", "The first digit has 4 choices (1–4), then 4, then 3.", "Turn on ‘No leading zero’: 4 × 4 × 3 = 48."] },
      { id:"tc2", goal:[1, 2, 4], prompt:"`n = 6`. Choose <strong>one</strong> rule so that exactly 240 line-ups satisfy it.",
        why:"Two rules give 240: “Ana and Bo together” (`5! × 2! = 240`) and “Ana is at an end” (`2 × 5! = 240`).",
        hints:["240 = 720 ÷ 3, or 2 × 120.", "Which rule doubles `5!`?", "Together (block × `2!`) or ‘at an end’ (2 ends × `5!`)."] },
      { id:"tc3", goal:3, stretch:true, prompt:"`n = 6`: Ana, Bo and Cy must <strong>all</strong> be apart (no two of them side by side). Enter your prediction, then build it in the Gap builder.",
        why:"`3! × P(4, 3) = 6 × 24 = 144`: seat Di, Ed and Fay (`3!` ways), then give Ana, Bo and Cy their own gaps among the 4.",
        hints:["Place Di, Ed and Fay first: `3!` ways.", "That makes 4 gaps: _ Di _ Ed _ Fay _. Ana, Bo and Cy each need their own gap.", "Choose and order 3 of the 4 gaps: `P(4, 3) = 24`. 6 × 24 = 144."] }
    ]
  },
  part3:{
    slug:"strategies", name:"Strategies",
    heading:"Strategy chooser",
    intro:"The hard part of restrictions is choosing the method. At each station, pick a strategy card, fill in its template, then check it by listing a smaller version of the problem.",
    stations:[
      { id:"s1", title:"Restriction first", problem:"Arrange the letters of MAPLE so that a vowel comes first.", fixedOrder:true,
        options:cards("first", {
          first:"A vowel must come first: fill that spot first (2 choices), then arrange the rest.",
          block:"Block is for items that must stand together. Here one position has a rule.",
          sub:"Subtracting the consonant-first arrangements works too, but filling the restricted spot first is quicker.",
          cases:"There’s only one kind of first letter to count (a vowel), so no cases are needed." }),
        rows:[
          { t:"Choices for the first letter (a vowel): [[]]", answer:2, wrong:[{ match:5, fb:"Only A and E are vowels." }, { match:3, fb:"That counts the consonants M, P and L." }] },
          { t:"Ways to arrange the other 4 letters, `4!`: [[]]", answer:24, wrong:[{ match:120, fb:"Only 4 letters are left once the first is placed: `4! = 24`." }] },
          { t:"Total: [[]]", answer:48, wrong:[{ match:26, fb:"Stages multiply: 2 × 24." }, { match:120, fb:"That ignores the rule." }, { match:72, fb:"That’s ‘starts with a consonant’." }] }],
        done:"2 × `4!` = 48.",
        list:{ small:{ letters:"MAPE", rule:"vowelFirst", task:"MAPE so that a vowel comes first", f:"2 × `3!` = 12" },
               full:{ letters:"MAPLE", rule:"vowelFirst", task:"MAPLE so that a vowel comes first", f:"2 × `4!` = 48" } } },
      { id:"s2", title:"Block", problem:"Arrange MAPLE with M and P together.", fixedOrder:true,
        options:cards("block", {
          first:"No position is fixed. M and P can be anywhere, as long as they’re side by side.",
          block:"M and P must be together: glue them into one block, arrange the items, then multiply by the order inside the block.",
          sub:"Subtract is for ‘not together’. Here they must be together.",
          cases:"Counting every position of the pair works, but gluing them into a block is quicker." }),
        rows:[
          { t:"Items to arrange (the MP block + A, L, E): [[]]", answer:4, wrong:[{ match:5, fb:"Glue M and P into one block: 5 letters become 4 items." }, { match:3, fb:"Count the block as one item: the block + A, L, E." }] },
          { t:"Ways to arrange the items, `4!`: [[]]", answer:24, wrong:[{ match:120, fb:"There are 4 items, not 5: `4! = 24`." }] },
          { t:"Orders inside the block (MP or PM): [[]]", answer:2, wrong:[{ match:1, fb:M2 }] },
          { t:"Total: [[]]", answer:48, wrong:[{ match:24, fb:M2 }, { match:26, fb:"Orders multiply: 24 × 2." }] }],
        done:"`4! × 2!` = 48.",
        list:{ small:{ letters:"MAPE", rule:"mpTogether", task:"MAPE with M and P together", f:"`3! × 2!` = 12" },
               full:{ letters:"MAPLE", rule:"mpTogether", task:"MAPLE with M and P together", f:"`4! × 2!` = 48" } } },
      { id:"s3", title:"Subtract", problem:"Arrange MAPLE with the vowels <strong>not</strong> together.", fixedOrder:true,
        options:cards("sub", {
          first:"No position is fixed. The rule is about the vowels being side by side.",
          block:"Block counts ‘together’. For ‘not together’, subtract the block count from the total.",
          sub:"Count all arrangements, then subtract the ones with the vowels together.",
          cases:"Counting ‘apart’ directly is messy; subtract the together cases." }),
        rows:[
          { t:"All arrangements, `5!`: [[]]", answer:120, wrong:[{ match:24, fb:"Arrange all 5 letters: `5! = 120`." }] },
          { t:"Vowels together, `4! × 2!`: [[]]", answer:48, wrong:[{ match:24, fb:M3 }] },
          { t:"Vowels not together: [[]]", answer:72, wrong:[{ match:96, fb:M3 }, { match:168, fb:"Subtract the together arrangements; don’t add them." }, { match:48, fb:"That’s the number with the vowels together." }] }],
        done:"`5! - 4! × 2!` = 120 − 48 = 72.",
        list:{ small:{ letters:"MAPE", rule:"vowelsApart", task:"MAPE with the vowels not together", f:"`4! - 3! × 2!` = 24 − 12 = 12" },
               full:{ letters:"MAPLE", rule:"vowelsApart", task:"MAPLE with the vowels not together", f:"`5! - 4! × 2!` = 120 − 48 = 72" } } },
      { id:"s4", title:"Cases", problem:"4-digit even numbers with distinct digits from {0, 1, 2, 3, 4, 5}.", fixedOrder:true,
        options:cards("cases", {
          first:"The last digit and the first digit both have rules that interact when 0 is involved, so split into cases.",
          block:"No items have to stand together here.",
          sub:"Total − bad can work, but it needs cases of its own. " + M7,
          cases:"Ending in 0 frees up the first digit; ending in 2 or 4 doesn’t. Count each case, then add." }),
        rows:[
          { t:"Ends in 0. Choices for the first digit (1 to 5): [[]]", answer:5, wrong:[{ match:6, fb:"0 is used as the last digit and can’t lead anyway: 1 to 5." }] },
          { t:"Ends in 0. Count, 5 × 4 × 3: [[]]", answer:60 },
          { t:"Ends in 2 or 4. Choices for the first digit (not 0, not the last digit): [[]]", answer:4, wrong:[{ match:5, fb:"0 can’t lead either: " + M7 }] },
          { t:"Ends in 2 or 4. Count, 2 × 4 × 4 × 3: [[]]", answer:96, wrong:[{ match:120, fb:"The first digit has 4 choices, not 5: 2 × 4 × 4 × 3." }] },
          { t:"Total (add the cases): [[]]", answer:156, wrong:[{ match:180, fb:"That lets 0 lead. " + M7 }, { match:5760, fb:"The cases don’t overlap, so add them: 60 + 96." }] }],
        done:"60 + 96 = 156.",
        list:{ small:{ digits:[0, 1, 2, 3], r:3, rule:"evenNumber", task:"3-digit even numbers with distinct digits from {0, 1, 2, 3}", f:"ends in 0: 3 × 2 = 6; ends in 2: 2 × 2 = 4; total 10" } } }
    ],
    quickCheck:{
      title:"Quick check", summary:"Strategy chooser quick check",
      items:[
        { id:"q1", goal:4, prompt:"Best strategy for ‘Bo and Cy not next to each other’?",
          choices:[
            { t:"Total − together", ok:true, fb:"Right. Counting ‘apart’ directly is messy; subtract the together cases." },
            { t:"Fill Bo first", fb:"Counting ‘apart’ directly is messy; subtract the together cases." },
            { t:"Cases by height", fb:"Counting ‘apart’ directly is messy; subtract the together cases." },
            { t:"Ignore the rule", fb:"Counting ‘apart’ directly is messy; subtract the together cases." }] },
        { id:"q2", goal:1, prompt:"Arrangements of MAPLE that start with a consonant?",
          choices:[
            { t:"72", ok:true, fb:"Right. 3 consonants (M, P, L) × `4!` = 72." },
            { t:"48", fb:"3 consonants (M, P, L) × `4!` = 72." },
            { t:"120", fb:"3 consonants (M, P, L) × `4!` = 72." },
            { t:"24", fb:"3 consonants (M, P, L) × `4!` = 72." }] },
        { id:"q3", goal:2, prompt:"4 people in a line with 2 particular people together?",
          choices:[
            { t:"12", ok:true, fb:"Right. `3! × 2! = 12`." },
            { t:"6", fb:"`3! × 2! = 12`." },
            { t:"24", fb:"`3! × 2! = 12`." },
            { t:"18", fb:"`3! × 2! = 12`." }] },
        { id:"q4", goal:5, prompt:"Even 3-digit numbers with distinct digits from {1, 2, 3, 4, 5}?",
          choices:[
            { t:"24", ok:true, fb:"Right. Last digit 2 or 4, then 4 × 3: 2 × 12 = 24." },
            { t:"60", fb:"Last digit 2 or 4, then 4 × 3: 2 × 12 = 24." },
            { t:"30", fb:"Last digit 2 or 4, then 4 × 3: 2 × 12 = 24." },
            { t:"12", fb:"Last digit 2 or 4, then 4 × 3: 2 × 12 = 24." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"which", type:"sorter", title:"Which strategy?", summary:"Which strategy?", goal:4, noun:"problem", txt:true,
        instruction:"Sort each problem by the strategy that fits it best.",
        boxes:[
          { id:"first", label:BOX.first },
          { id:"block", label:BOX.block },
          { id:"sub", label:BOX.sub },
          { id:"cases", label:BOX.cases }],
        wrongDefault:H1,
        items:[
          { id:"i1", t:"Arrange 6 books with the dictionary at the left end", answer:"first",
            why:"The dictionary’s spot is fixed: fill it first, then arrange the other 5 books.",
            hints:sortHints("first", "The dictionary’s spot is fixed: fill it first, then arrange the other 5 books: 1 × `5!`.") },
          { id:"i2", t:"Seat 7 friends in a row with the twins side by side", answer:"block",
            why:"The twins must be side by side: glue them into a block, then multiply by `2!` for the order inside it.",
            hints:sortHints("block", "Glue the twins into a block: `6! × 2!`.") },
          { id:"i3", t:"Seat 7 friends in a row with the twins <strong>not</strong> side by side", answer:"sub",
            why:"‘Not side by side’: all seatings minus the ones with the twins together.",
            wrong:{ block:"Block counts ‘together’. For ‘not together’, subtract the block count from the total." },
            hints:sortHints("sub", "All seatings minus the ones with the twins together: `7! - 6! × 2!`.") },
          { id:"i4", t:"4-digit even numbers from digits 0–6, no repeats", answer:"cases",
            why:"Ending in 0 frees up the first digit; ending in 2, 4 or 6 doesn’t. Count each case, then add.",
            wrong:{ first:"The last digit and the first digit both have rules that interact when 0 is involved, so split into cases." },
            hints:sortHints("cases", "Ending in 0 frees up the first digit; ending in 2, 4 or 6 doesn’t. Count each case, then add.") },
          { id:"i5", t:"Line up 5 children with the shortest at the front", answer:"first",
            why:"The front spot is fixed: fill it with the shortest child, then arrange the other 4.",
            hints:sortHints("first", "The front spot is fixed: 1 × `4!`.") },
          { id:"i6", t:"Shelve 3 math and 4 science books with all math books together", answer:"block",
            why:"The math books must stay together: glue them into a block, arrange the 5 items, then multiply by `3!` inside the block.",
            hints:sortHints("block", "Block the 3 math books: `5! × 3!`.") },
          { id:"i7", t:"Arrange the letters of PRAIRIE so that the two R’s are not together", answer:"sub",
            why:"‘Not together’: all arrangements minus the ones with the R’s together.",
            hints:sortHints("sub", "All arrangements minus the ones with the R’s together.") },
          { id:"i8", t:"3-digit numbers from 1–9, no repeats, either less than 300 or ending in 5", answer:"cases",
            why:"Two conditions joined by ‘or’: count each case, then subtract the overlap (numbers under 300 ending in 5).",
            wrong:{ first:"Two separate conditions joined by ‘or’ need cases, and the overlap (numbers under 300 ending in 5) must be subtracted once." },
            hints:sortHints("cases", "Count ‘less than 300’ and ‘ends in 5’, then subtract the numbers that are both.") }
        ] },
      { id:"multi", type:"numeric", title:"Multi-condition counts", summary:"Multi-condition counts", goal:[2, 3, 5, 6], star:true,
        instruction:"Count the arrangements. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number (1440 and 1 440 are both fine), then press Check.",
        items:[
          { id:"r1", goal:2, prompt:"Arrange the letters of CALGARY with the two A’s together.", answer:720, display:"720", label:"Number of ways:",
            why:"Glue the A’s into one block: 6 different items, `6! = 720`. The A’s are identical, so there’s no × `2!`.",
            wrong:[{ match:1440, fb:"The A’s are identical, so swapping them inside the block changes nothing: no × `2!`." }],
            hints:["Glue the two A’s into one block.", "That makes 6 items: the AA block and C, L, G, R, Y.", "The A’s are identical, so the block has only one order: `6! = 720`."] },
          { id:"r2", goal:3, star:true, prompt:"Arrange the letters of CALGARY with the two A’s <strong>not</strong> together.", answer:1800, display:"1800", label:"Number of ways:",
            why:"All arrangements: `7!/2! = 2520`. Together: 720. 2520 − 720 = 1800.",
            wrong:[{ match:4320, fb:"Total is `7!/2! = 2520` (the A’s repeat), not `7!`." }],
            hints:["All arrangements: `7!/2! = 2520`.", "Together (from R1): 720.", "2520 − 720 = 1800."] },
          { id:"r3", goal:5, star:true, prompt:"4-digit numbers greater than 5000 from {1, 2, 3, 5, 7, 9}, no repeats.", answer:180, display:"180", label:"Number of ways:",
            why:"The first digit must be 5, 7 or 9: 3 choices. Then `P(5, 3) = 60`. 3 × 60 = 180.",
            wrong:[{ match:360, fb:"The first digit must be 5, 7 or 9: 3 × `P(5, 3)`." }],
            hints:["Which digits can go first?", "5, 7 or 9: 3 choices. Then fill 3 places from the 5 digits left.", "3 × `P(5, 3)` = 3 × 60 = 180."] },
          { id:"r4", goal:6, star:true, prompt:"4 boys and 3 girls line up, alternating boy–girl.", answer:144, display:"144", label:"Number of ways:",
            why:"The pattern must be B G B G B G B: the boys fill their 4 places in `4!` ways and the girls fill theirs in `3!` ways. 24 × 6 = 144.",
            wrong:[{ match:5040, fb:"The pattern must be B G B G B G B: `4! × 3!`." }],
            hints:["With 4 boys and 3 girls, where must the boys stand?", "The pattern must be B G B G B G B.", "`4! × 3!` = 24 × 6 = 144."] },
          { id:"r5", goal:[2, 6], star:true, prompt:"4 Grade 12s and 4 Grade 11s sit in a row: all Grade 12s together and all Grade 11s together.", answer:1152, display:"1152", label:"Number of ways:",
            why:"Two blocks in either order: `2!`. Inside each block: `4!`. 2 × 24 × 24 = 1152.",
            wrong:[{ match:576, fb:"The two groups can go in either order: × 2." }],
            hints:["Glue each grade into its own block.", "2 blocks: `2!` orders. Inside each block: `4!` orders.", "`2! × 4! × 4!` = 2 × 24 × 24 = 1152."] },
          { id:"r6", goal:[3, 6], star:true, prompt:"3 adults and 4 children sit in a row with no two adults side by side.", answer:1440, display:"1440", label:"Number of ways:",
            why:"Seat the 4 children: `4! = 24`. That makes 5 gaps; the adults take 3 different gaps: `P(5, 3) = 60`. 24 × 60 = 1440.",
            wrong:[{ match:3600, fb:"‘Not all together’ isn’t the same as ‘no two together’. Use gaps: `4! × P(5, 3)`." },
                   { match:4320, fb:"‘Not all together’ isn’t the same as ‘no two together’. Use gaps: `4! × P(5, 3)`." }],
            hints:["Seat the 4 children first: `4!` ways.", "That makes 5 gaps; each adult needs a different gap.", "`P(5, 3) = 60`, and 24 × 60 = 1440."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Iker", how:"", goal:[2, 3, 5],
        instruction:"Iker made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"6 friends line up; Mia and Noor must stand together.",
            steps:["Treat Mia and Noor as one block.", "That gives 5 items to arrange: `5! = 120`.", "So there are 120 line-ups."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Multiply by `2!` for the order inside the block: 120 × 2 = 240.", ok:true, why:"Inside the block, Mia and Noor can swap: multiply by `2!`." },
              { t:"Divide by `2!`: 60.", why:"Mia–Noor and Noor–Mia are different line-ups." },
              { t:"Add 2: 122.", why:"Orders multiply." },
              { t:"Step 3 is correct.", why:"Swap Mia and Noor: is it a new line-up?" }],
            hints:["Can Mia and Noor swap inside the block?", "Yes: 2 orders.", "240."] },
          { id:"e2", goal:3, task:"6 friends line up; Mia and Noor must <strong>not</strong> stand together.",
            steps:["All line-ups: `6! = 720`.", "Together: `5! = 120`.", "Apart: 720 − 120 = 600."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Together: `5! × 2! = 240`, so apart = 720 − 240 = 480.", ok:true, why:M3 },
              { t:"Together: `4! = 24`.", why:"There are 5 items (the block + 4 people)." },
              { t:"Apart: `4! × 2 = 48`.", why:"That’s not how ‘apart’ is counted." },
              { t:"Step 2 is correct.", why:"The pair has 2 orders inside the block." }],
            hints:["Check the ‘together’ count.", "Block × `2!`.", "720 − 240 = 480."] },
          { id:"e3", goal:5, task:"4-digit even numbers with distinct digits from {0, 1, 2, 3, 4, 5}.",
            steps:["The last digit must be 0, 2 or 4: 3 choices.", "First digit: 5 choices (anything but the last digit).", "Then 4 and 3 choices: 3 × 5 × 4 × 3 = 180."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Split into cases. Ends in 0: 5 × 4 × 3 = 60. Ends in 2 or 4: the first digit can’t be 0 either, so 4 × 4 × 3 = 48 each, 96 in all. Total 156.", ok:true, why:M7 },
              { t:"First digit: 6 choices.", why:"Even more over-counting. " + M4 },
              { t:"Use 3 × `P(5, 3)` = 180.", why:"That still lets 0 lead." },
              { t:"Step 2 is correct.", why:"When the last digit is 2, the first digit could still be 0: 0 is not allowed there." }],
            hints:["If the last digit is 2, which digits can lead?", "1, 3, 4, 5: only 4, because 0 can’t lead.", "Cases: 60 + 96 = 156."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which rule surprised you: ‘Ana before Bo’ being exactly half, or ‘all apart’ needing gaps?" },
      { id:"j2", q:"In your own words, explain why ‘apart’ is easier to count as total − together." },
      { id:"j3", q:"Explain to a friend how to decide between ‘restriction first’, ‘block’, ‘subtract’ and ‘cases’." },
      { id:"j4", q:"Which kind of restriction still trips you up? Write one problem of your own that uses it." }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"7 people line up; two of them must stand together. How many line-ups?", options:[
          { t:"1440", ok:true, why:"`6! × 2! = 1440`." },
          { t:"720", why:"Multiply by `2!` for the pair’s order." },
          { t:"5040", why:"That ignores the rule." },
          { t:"3600", why:"That’s the number with the two <strong>apart</strong>." }] },
        b:{ prompt:"6 people line up; two of them must stand together. How many line-ups?", options:[
          { t:"240", ok:true, why:"`5! × 2! = 240`." },
          { t:"120", why:"Multiply by `2!` for the pair’s order." },
          { t:"720", why:"That ignores the rule." },
          { t:"480", why:"That’s ‘apart’." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"How many arrangements of the letters of PRINCE begin with a vowel?", options:[
          { t:"240", ok:true, why:"2 vowels (I, E) × `5!` = 240." },
          { t:"720", why:"That ignores the rule." },
          { t:"120", why:"There are 2 vowels to choose from." },
          { t:"480", why:"That’s ‘begin with a consonant’." }] },
        b:{ prompt:"How many arrangements of PRINCE end with a consonant?", options:[
          { t:"480", ok:true, why:"4 consonants × `5!` = 480." },
          { t:"720", why:"That ignores the rule." },
          { t:"120", why:"There are 4 consonants to choose from." },
          { t:"240", why:"That’s ‘end with a vowel’." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which expression counts the line-ups of 8 people where Kai and Lee are <strong>not</strong> side by side?", options:[
          { t:"`8! - 7! × 2!`", ok:true, why:M3 },
          { t:"`8! - 7!`", why:"The pair has 2 orders in the ‘together’ count." },
          { t:"`7! × 2!`", why:"That’s ‘together’." },
          { t:"`8!/2!`", why:"Kai and Lee aren’t identical." }] },
        b:{ prompt:"Which expression counts the line-ups of 10 people where two particular people are <strong>not</strong> side by side?", options:[
          { t:"`10! - 9! × 2!`", ok:true, why:M3 },
          { t:"`10! - 9!`", why:"The pair has 2 orders in the ‘together’ count." },
          { t:"`9! × 2!`", why:"That’s ‘together’." },
          { t:"`10! - 2!`", why:"Subtract every line-up with the pair together: `9! × 2!`, not `2!`." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"How many 3-digit even numbers with distinct digits can be made from {0, 1, 2, 3, 4, 5, 6}?", options:[
          { t:"105", ok:true, why:"Ends in 0: 6 × 5 = 30. Ends in 2, 4 or 6: 5 × 5 each, so 75. Total 105." },
          { t:"100", why:"4 even digits × 5 × 5 doesn’t treat the 0 case separately." },
          { t:"120", why:"That lets 0 lead." },
          { t:"75", why:"Add the numbers ending in 0." }] },
        b:{ prompt:"How many 3-digit odd numbers with distinct digits can be made from {0, 1, 2, 3, 4, 5, 6}?", options:[
          { t:"75", ok:true, why:"Last digit 1, 3 or 5; first digit 5 choices (not 0, not the last digit); middle 5. 3 × 5 × 5 = 75." },
          { t:"90", why:"That lets 0 lead." },
          { t:"105", why:"That’s the even count." },
          { t:"60", why:"The middle digit can be 0." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"5 friends sit in a row of 5 seats. Ana must sit in an end seat, and Bo must not sit next to Ana. How many seatings?", options:[
          { t:"36", ok:true, why:"Ana: 2 ends. Bo: 3 seats not beside her. Others: `3! = 6`. 2 × 3 × 6 = 36." },
          { t:"48", why:"That ignores Bo’s rule." },
          { t:"72", why:"Ana has only the 2 end seats." },
          { t:"12", why:"Bo has 3 allowed seats, not 1." }] },
        b:{ prompt:"5 friends sit in a row. Ana must sit in the middle seat, and Bo must not sit next to Ana. How many seatings?", options:[
          { t:"12", ok:true, why:"Ana: 1 seat. Bo: the 2 end seats. Others: `3! = 6`. 1 × 2 × 6 = 12." },
          { t:"24", why:"That ignores Bo’s rule." },
          { t:"18", why:"Bo has 2 choices, not 3." },
          { t:"36", why:"Ana’s seat is fixed." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Arrange the letters of LAKES so that L is first <strong>and</strong> the vowels A and E are together.", options:[
          { t:"12", ok:true, why:"L fixed; then the block AE plus K and S: `3! × 2! = 12`." },
          { t:"24", why:"That ignores the vowel rule." },
          { t:"48", why:"That ignores ‘L first’." },
          { t:"6", why:"The vowels can be AE or EA." }] },
        b:{ prompt:"Arrange the letters of LAKES so that S is last <strong>and</strong> the vowels are <strong>not</strong> together.", options:[
          { t:"12", ok:true, why:"S fixed; arrange L, A, K, E: `4! - 3! × 2!` = 24 − 12 = 12." },
          { t:"24", why:"That ignores the vowel rule." },
          { t:"72", why:"That ignores ‘S last’." },
          { t:"18", why:"Together = `3! × 2!` = 12, not 6." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best strategy explanation for counting line-ups of 9 people where 3 particular people must all stand together?", options:[
          { t:"Glue the 3 into one block, arrange the 7 items in `7!` ways, then multiply by `3!` for the order inside the block.", ok:true, why:"Block, arrange the items, then multiply by the order inside the block." },
          { t:"Arrange all 9, then divide by `3!`.", why:"That’s for identical objects." },
          { t:"Subtract `3!` from `9!`.", why:"‘Together’ is counted with a block, and it includes the order inside the block." },
          { t:"Arrange the 3 first, then the rest: `3! + 6!`.", why:"Stages multiply, and the block’s position matters." }] },
        b:{ prompt:"Which is the best strategy explanation for counting line-ups of 9 people where 2 particular people must <strong>not</strong> stand together?", options:[
          { t:"Count all `9!` line-ups, then subtract the `8! × 2!` where they’re together.", ok:true, why:M3 },
          { t:"Arrange the other 7, then add 2.", why:"Adding doesn’t place people." },
          { t:"Apart is `(9 - 2)!`.", why:M3 },
          { t:"Divide `9!` by `2!`.", why:"They aren’t identical." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which work correctly counts 4-digit numbers with no repeated digit (digits 0–9)?", options:[
          { t:"9 × 9 × 8 × 7 = 4536: the first digit can’t be 0, but 0 is available afterward.", ok:true, why:"The first digit has 9 choices (1–9); after that, 0 is allowed." },
          { t:"10 × 9 × 8 × 7 = 5040.", why:M4 },
          { t:"9 × 8 × 7 × 6 = 3024.", why:"That removes 0 entirely." },
          { t:"`P(10, 4)` − 1 = 5039.", why:"More than one arrangement starts with 0." }] },
        b:{ prompt:"Which work correctly counts 3-digit numbers with no repeated digit (digits 0–9)?", options:[
          { t:"9 × 9 × 8 = 648", ok:true, why:"The first digit has 9 choices (1–9); after that, 0 is allowed." },
          { t:"10 × 9 × 8 = 720.", why:"A 3-digit number can’t start with 0: the first digit has 9 choices, not 10." },
          { t:"9 × 8 × 7 = 504.", why:"0 can be used after the first digit." },
          { t:"720 − 1 = 719.", why:"72 arrangements start with 0." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A band plans a setlist of 8 different songs. The hit must close the show, and the two slow songs can’t be back to back. How many setlists?", options:[
          { t:"3600", ok:true, why:"Hit last; arrange the other 7: `7! - 6! × 2!` = 5040 − 1440 = 3600." },
          { t:"5040", why:"That ignores the slow-song rule." },
          { t:"4320", why:"Together is `6! × 2!`, not `6!`." },
          { t:"1440", why:"That’s the number with the slow songs together." }] },
        b:{ prompt:"A setlist of 8 different songs: the opener is fixed, and the two ballads must be back to back. How many setlists?", options:[
          { t:"1440", ok:true, why:"Opener fixed; the 7 others with the ballads together: `6! × 2!` = 1440." },
          { t:"720", why:"Multiply by `2!` for the ballads’ order." },
          { t:"5040", why:"That ignores the ballad rule." },
          { t:"3600", why:"That’s ‘apart’." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"A licence plate has 3 different letters followed by 3 different digits, and the digit part can’t start with 0. How many plates?", options:[
          { t:big("10 108 800"), ok:true, why:big("26 × 25 × 24 = 15 600 and 9 × 9 × 8 = 648; 15 600 × 648.") },
          { t:big("11 232 000"), why:"That lets the digits start with 0." },
          { t:big("16 248"), why:big("15 600 + 648: multiply the stages.") },
          { t:big("11 389 248"), why:"`26^3` allows repeated letters." }] },
        b:{ prompt:"A code has 2 different letters followed by 4 different digits, and the last digit must be odd. How many codes?", options:[
          { t:big("1 638 000"), ok:true, why:"650 for the letters; digits: last digit odd (5 choices), then 9 × 8 × 7 = 504, so 2520. 650 × 2520." },
          { t:big("3 276 000"), why:"That ignores ‘odd’." },
          { t:"3170", why:"650 + 2520: multiply the stages." },
          { t:big("1 703 520"), why:"`26^2` allows repeated letters." }] } }
    ]
  },
  task:{
    title:"Seating planner", summary:"Seating planner",
    statement:"<p>Six guests (Ana, Bo, Cy, Di, Ed, Fay) sit in a row. Pick up to three rules from the menu so that the plan meets every condition. Can you find all the answers?</p>" +
      '<ol class="pr-conds"><li>At least one rule keeps two people together or apart (R4 or R5).</li><li>At least one rule controls a seat position (R1, R2, R3 or R7).</li><li>The number of seatings is between 100 and 200.</li></ol>',
    rules:[
      { id:"R1", t:"Ana sits first" },
      { id:"R2", t:"Ana sits at an end" },
      { id:"R3", t:"Ana doesn’t sit at an end" },
      { id:"R4", t:"Bo and Cy sit together" },
      { id:"R5", t:"Bo and Cy sit apart" },
      { id:"R6", t:"Di sits somewhere before Ed" },
      { id:"R7", t:"Fay sits last" }],
    checks:["A together/apart rule", "A seat-position rule", "100 to 200 seatings"],
    tips:["Choose R4 or R5.", "Add a rule about where someone sits.", "Too many? Add a rule. Too few? Loosen one: ‘Ana at an end’ allows more than ‘Ana first’."],
    explainPrompt:"Explain how you predicted whether adding a rule would push the count into the range.",
    vocab:"Use the words block, subtract and restriction.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"R2 + R4 gives 96 and R1 + R5 gives 72, just under the range. Rules that fix a seat cut the count fast."
  },
  cards:[
    ["Restriction first", "Fill the restricted positions before the free ones."],
    ["Together", "Glue into a block; arrange the blocks; × the order inside the block."],
    ["Apart (two items)", "Total − together."],
    ["All apart (no two adjacent)", "Place the others, then put each restricted item in its own gap."],
    ["6 people, 2 together", "`5! × 2! = 240`."],
    ["6 people, 2 apart", "720 − 240 = 480."],
    ["`A` before `B`", "Half of all arrangements (by symmetry)."],
    ["No leading zero", "First digit: 9 choices from 1–9."],
    ["Even, with 0 available", "Cases: ends in 0, or ends in another even digit."],
    ["Cases with “or”", "Add the cases, then subtract any overlap."],
    ["Identical items together", "Block them, but don’t multiply by their (identical) orders."],
    ["Check small cases", "List them to confirm the strategy."]
  ]
};
