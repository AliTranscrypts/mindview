// MDM4U 02 The Fundamental Counting Principle. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/02-fundamental-counting-principle.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M2 = n => "No repeats means each later stage has one fewer choice: " + n + ".";
const M4 = (a, b, t) => "“Or” means one of " + a + " + " + b + " = " + t + " choices. You only multiply stages you do one after another.";
const M7 = "Each of the 4 flips has 2 outcomes: 2 × 2 × 2 × 2 = 2⁴.";

export default {
  id:"02-fundamental-counting-principle",
  kind:"topic",
  title:"The fundamental counting principle",
  topic:"The Fundamental Counting Principle",
  readyTopic:"the fundamental counting principle",
  hero:{
    eq:"`3 × 4 × 2 = 24`", eqLabel:"3 times 4 times 2 equals 24", eqSize:"md",
    headline:"Multiply the choices, don’t list them",
    text:"When a task happens in <strong>stages</strong>, the number of ways to do it is the <strong>product</strong> of the number of choices at each stage. That’s the <strong>fundamental counting principle</strong>. It counts a million licence plates as easily as a dozen lunches.",
    fig:{ html:'<div class="fcp-h" role="img" aria-label="A café board lists 3 sandwiches, 4 drinks and 2 desserts. A tree sprouts 3 sandwich branches. Each splits into 4 drink branches: 12 leaves, 3 × 4. Each of those splits into 2 dessert branches: 24 leaves, 3 × 4 × 2. The tree then shrinks into a row of three slots labelled 3, 4 and 2, equal to 24.">' +
      '<div class="fcp-board" aria-hidden="true"><span class="fcp-bt">Café board</span><span class="fcp-b" data-b="0">Sandwiches <b>3</b></span><span class="fcp-b" data-b="1">Drinks <b>4</b></span><span class="fcp-b" data-b="2">Desserts <b>2</b></span></div>' +
      '<div class="fcp-stage" aria-hidden="true"><svg class="fcp-svg" id="fcp-svg" viewBox="0 0 360 176" preserveAspectRatio="xMidYMid meet" focusable="false"></svg>' +
      '<div class="fcp-slots" id="fcp-slots"><span class="fcp-s">3</span><span class="fcp-x">×</span><span class="fcp-s">4</span><span class="fcp-x">×</span><span class="fcp-s">2</span><span class="fcp-eq">= 24</span></div></div></div>' }
  },
  goals:[
    "I can explain why a tree diagram’s leaves are counted by multiplying.",
    "I can apply the fundamental counting principle to tasks with several stages.",
    "I can count with repetition allowed and with no repetition.",
    "I can handle a restricted position by filling it first.",
    "I can decide when to multiply (“and then”) and when to add (“or”)."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sample spaces", goal:1, prompt:"A coin is flipped and a die is rolled. How many outcomes?",
          options:[
            { t:"12", ok:true, why:"6 outcomes for each of H and T." },
            { t:"8", why:"Each coin result pairs with all 6 die results." },
            { t:"6", why:"The coin doubles the list." },
            { t:"36", why:"That’s two dice." }],
          hints:["Draw the tree.", "H splits into 6, T splits into 6.", "12."] },
        { id:"w2", skill:"Sample spaces", goal:1, prompt:"How many leaves does a tree have if the first stage has 3 branches and each of those splits into 5?",
          options:[
            { t:"15", ok:true, why:"3 groups of 5." },
            { t:"8", why:"Count the leaves: 5 under each of 3 branches." },
            { t:"5", why:"There are 3 groups." },
            { t:"125", why:"5³ would be three stages of 5." }],
          hints:["How many leaves under one first branch?", "5.", "3 × 5 = 15."] },
        { id:"w3", skill:"Multiplication and powers", goal:3, prompt:"What is 10 × 9 × 8?",
          options:[
            { t:"720", ok:true, why:"10 × 9 = 90, and 90 × 8 = 720." },
            { t:"1000", why:"That’s 10 × 10 × 10." },
            { t:"27", why:"That’s 10 + 9 + 8." },
            { t:"504", why:"That’s 9 × 8 × 7." }],
          hints:["Multiply the first two.", "90.", "90 × 8 = 720."] },
        { id:"w4", skill:"Multiplication and powers", goal:2, prompt:"Which expression equals 2 × 2 × 2 × 2 × 2?",
          options:[
            { t:"`2^5`", ok:true, why:"Five factors of 2." },
            { t:"`5^2`", why:"`5^2 = 5 × 5 = 25`, but `2^5 = 32`." },
            { t:"2 × 5", why:"That’s 2 + 2 + 2 + 2 + 2." },
            { t:"10", why:"That’s 2 + 2 + 2 + 2 + 2." }],
          hints:["How many 2s are multiplied?", "Five.", "`2^5 = 32`."] },
        { id:"w5", skill:"Reading conditions", goal:4, prompt:"Which of these is a three-digit number?",
          options:[
            { t:"307", ok:true, why:"It starts with a non-zero digit." },
            { t:"037", why:"037 is the two-digit number 37." },
            { t:"3007", why:"That has four digits." },
            { t:"30.7", why:"That isn’t a whole number." }],
          hints:["Can a number start with 0?", "No: 037 is 37.", "307."] },
        { id:"w6", skill:"Reading conditions", goal:5, prompt:"For lunch you may choose <strong>either</strong> a soup (3 kinds) <strong>or</strong> a salad (2 kinds), not both. How many choices?",
          options:[
            { t:"5", ok:true, why:"One item from 3 + 2 options." },
            { t:"6", why:"3 × 2 would be a soup <strong>and</strong> a salad." },
            { t:"3", why:"That ignores the salads." },
            { t:"1", why:"There are several options." }],
          hints:["Do you choose both, or one?", "One: from all 5 items.", "3 + 2 = 5."] }
      ],
      refreshers:{
        "Sample spaces":"A tree splits once per stage. If every branch splits the same way, the number of leaves is a product.",
        "Multiplication and powers":"Multiply step by step. A repeated factor is a power: 2 × 2 × 2 = 2³.",
        "Reading conditions":"Look for “no repeats”, “can’t start with 0”, “or”. Each one changes how you count."
      }
    }
  },
  explore:{
    heading:"Choice chain",
    intro:"Build a task stage by stage. Set the choices, switch repetition on or off, and watch the tree and the product grow.",
    predIntro:"Make a prediction first. Then the choice chain will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"scen", scen:"cafe" },
        prompt:"Café meal. How many meals with one sandwich, one drink and one dessert?",
        options:[{ t:"24", ok:true }, { t:"9" }, { t:"12" }, { t:"6" }],
        explain:"3 × 4 × 2 = 24." },
      { id:"p2", start:{ mode:"scen", scen:"lock", repD:true },
        prompt:"Bike lock, repeats allowed. How many combinations?",
        options:[{ t:"1000", ok:true }, { t:"720" }, { t:"30" }, { t:"27" }],
        explain:"Each dial has 10 settings, whatever the others show." },
      { id:"p3", start:{ mode:"scen", scen:"lock", repD:false },
        prompt:"Bike lock, repeats off. Now how many?",
        options:[{ t:"720", ok:true }, { t:"1000" }, { t:"504" }, { t:"30" }],
        explain:"10 × 9 × 8 = 720." },
      { id:"p4", start:{ mode:"build", menus:true },
        prompt:"Lunch is a soup (3 kinds) <strong>or</strong> a sandwich (4 kinds). How many lunches?",
        options:[{ t:"7", ok:true }, { t:"12" }, { t:"4" }, { t:"3" }],
        explain:"You pick one item from 3 + 4. Multiply only for one thing <strong>and then</strong> another." }
    ],
    chalIntro:"Set up the choice chain, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Build a chain of exactly 3 stages, each with at least 2 choices, that gives exactly 60 outcomes.",
        why:"60 = 2 × 2 × 3 × 5, so {2, 5, 6}, {3, 4, 5}, {2, 3, 10} and {2, 2, 15} all work, in any order.",
        hints:["Factor 60.", "60 = 2 × 2 × 3 × 5: group into three numbers.", "3 × 4 × 5 works."] },
      { id:"tc2", goal:3, prompt:"Password scenario (2 letters, then 2 digits): set the repetition switches so there are exactly 65 000 passwords.",
        why:"26 × 25 × 10 × 10 = 65 000: the letters can’t repeat, the digits can.",
        hints:["65 000 = 650 × 100.", "650 = 26 × 25.", "Letters no repeats, digits repeats allowed."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Number builder: count the <strong>odd</strong> three-digit numbers with <strong>no repeated digits</strong>. Set the restrictions and the counting order so the counting check passes.",
        why:"Units first (5 odd digits), then hundreds (not 0 and not the units digit: 8), then tens (8): 5 × 8 × 8 = 320.",
        hints:["Which position has the strongest restriction?", "Units: 5 odd digits. Then hundreds: not 0 and not the units digit.", "5 × 8 × 8 = 320."] }
    ]
  },
  part3:{
    slug:"multiply", name:"Multiply or add?",
    heading:"When to multiply",
    intro:"Multiplying counts one choice <strong>and then</strong> another. Visit each station: sort the scenarios, count a tree whose branches aren’t equal, then check a count by listing.",
    sort:{ id:"p3sort", type:"sorter", noun:"card", txt:true,
      how:"Tap a card, then tap the box it belongs in.",
      boxes:[{ id:"mul", label:"Multiply", sub:"“and then”: one stage after another" }, { id:"add", label:"Add", sub:"“or”: choose one of them" }],
      items:[
        { id:"c1", t:"a shirt and then pants", answer:"mul", why:"“And then”: you choose a shirt, then pants. Multiply.", wrong:{ add:"The deciding words are “and then”: you choose both, one after the other." } },
        { id:"c2", t:"a bus or a train to school", answer:"add", why:"“Or”: you take one of them. Add the choices.", wrong:{ mul:"The deciding word is “or”: you take a bus or a train, not both." } },
        { id:"c3", t:"a first-place and then a second-place finisher", answer:"mul", why:"“And then”: two places filled one after the other. Multiply.", wrong:{ add:"The deciding words are “and then”: both places get filled, one after the other." } },
        { id:"c4", t:"one elective from arts or from technology", answer:"add", why:"“Or”: one elective from either list. Add.", wrong:{ mul:"The deciding word is “or”: you take one elective, from one list or the other." } },
        { id:"c5", t:"a PIN digit and then another digit", answer:"mul", why:"“And then”: one digit after another. Multiply.", wrong:{ add:"The deciding words are “and then”: you choose both digits, one after the other." } },
        { id:"c6", t:"one movie: a comedy or a drama", answer:"add", why:"“Or”: one movie of either kind. Add.", wrong:{ mul:"The deciding word is “or”: you watch one movie, a comedy or a drama." } }
      ] },
    quickCheck:{
      title:"Quick check", summary:"When to multiply quick check",
      items:[
        { id:"q1", goal:5, prompt:"Movie night: one of 5 comedies or one of 3 dramas.",
          choices:[
            { t:"8", ok:true, fb:"Right. One movie from 5 + 3 = 8." },
            { t:"15", fb:"One movie from 5 + 3." },
            { t:"5", fb:"One movie from 5 + 3." },
            { t:"3", fb:"One movie from 5 + 3." }] },
        { id:"q2", goal:5, prompt:"One of 5 comedies, and then one of 3 snacks.",
          choices:[
            { t:"15", ok:true, fb:"Right. A movie and then a snack: 5 × 3 = 15." },
            { t:"8", fb:"A movie and then a snack: 5 × 3." },
            { t:"5", fb:"A movie and then a snack: 5 × 3." },
            { t:"3", fb:"A movie and then a snack: 5 × 3." }] },
        { id:"q3", goal:5, prompt:"Eggs (3 styles) or pancakes (2 toppings), then juice (2 kinds).",
          choices:[
            { t:"10", ok:true, fb:"Right. The breakfast is one of 3 + 2 = 5, then a juice: (3 + 2) × 2 = 10." },
            { t:"12", fb:"(3 + 2) × 2 = 10." },
            { t:"7", fb:"(3 + 2) × 2 = 10." },
            { t:"6", fb:"(3 + 2) × 2 = 10." }] },
        { id:"q4", goal:2, prompt:"A coin is flipped 5 times. How many outcomes?",
          choices:[
            { t:"32", ok:true, fb:"Right. Each of the 5 flips has 2 outcomes: 2⁵ = 32." },
            { t:"25", fb:"2⁵ = 32; 5² swaps base and exponent." },
            { t:"10", fb:"2⁵ = 32; 5² swaps base and exponent." },
            { t:"120", fb:"2⁵ = 32; 5² swaps base and exponent." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"count", type:"custom", title:"Count it", summary:"Count it", goal:[2, 3],
        instruction:"Count the ways for each task.",
        how:"Type a whole number, or a product such as 26 × 26 × 10 (powers like 26^4 or 26⁴ are fine), then press Check.",
        items:[
          { id:"n1", goal:2, prompt:"An outfit: 4 shirts, 3 pants, 2 pairs of shoes", answer:24, why:"4 × 3 × 2 = 24.",
            wrong:[{ match:9, fb:"Each of the 4 shirts goes with each of the 3 pants, and each of those outfits with each of the 2 pairs of shoes: 4 × 3 × 2, not 4 + 3 + 2." }],
            hints:["How many stages are there?", "Shirts, then pants, then shoes: 4, 3 and 2 choices.", "4 × 3 × 2 = 24."] },
          { id:"n2", goal:3, prompt:"A 4-digit PIN, digits 0–9, repeats allowed", answer:10000, why:"10 × 10 × 10 × 10 = 10 000.",
            wrong:[{ match:5040, fb:"Repeats are allowed here." }],
            hints:["How many choices does each of the 4 digits have?", "Repeats are allowed, so 10 each.", "10 × 10 × 10 × 10 = 10 000."] },
          { id:"n3", goal:3, prompt:"A 4-digit PIN with no repeated digits", answer:5040, why:"10 × 9 × 8 × 7 = 5040.",
            wrong:[{ match:10000, fb:M2("10 × 9 × 8 × 7, not 10 × 10 × 10 × 10") }],
            hints:["No repeats: each later digit has one fewer choice.", "10, then 9, then 8, then 7.", "10 × 9 × 8 × 7 = 5040."] },
          { id:"n4", goal:2, factors:true, prompt:"An Ontario licence plate: 4 letters then 3 digits, repeats allowed (fill in the factors)", answer:456976000,
            label:"Product of the factors:", placeholder:"e.g. 26 × 26 × …", display:"26 × 26 × 26 × 26 × 10 × 10 × 10 = 456 976 000",
            why:"Every position keeps all its choices: `26^4 × 10^3`.",
            wrong:[{ plus:true, fb:"That adds the positions. Each letter choice goes with every choice for the other positions: multiply 26 for each letter and 10 for each digit." },
                   { match:134, fb:"That adds the positions. Each letter choice goes with every choice for the other positions: multiply 26 for each letter and 10 for each digit." }],
            hints:["There are 7 positions: 4 letters, then 3 digits.", "Each letter has 26 choices and each digit has 10, repeats allowed.", "26 × 26 × 26 × 26 × 10 × 10 × 10 = `26^4 × 10^3` = 456 976 000."] },
          { id:"n5", goal:2, prompt:"Answer a true/false quiz with 8 questions", answer:256, why:"`2^8 = 256`.",
            wrong:[{ match:16, fb:"2 × 8 adds 2 eight times; you need `2^8`." }],
            hints:["Each question has 2 answers.", "8 stages of 2.", "`2^8 = 256`."] },
          { id:"n6", goal:3, prompt:"3 friends line up for a photo", answer:6, why:"3 × 2 × 1 = 6.",
            wrong:[{ match:9, fb:"Each friend can be used once: 3 × 2 × 1." }],
            hints:["Who stands first? How many are left for the second spot?", "3 choices, then 2, then 1.", "3 × 2 × 1 = 6."] },
          { id:"n7", goal:3, prompt:"Choose a president, then a vice-president, from 10 students", answer:90, why:"10 × 9 = 90.",
            wrong:[{ match:100, fb:"The president can’t also be vice-president." }],
            hints:["How many choices for president?", "10, then 9 left.", "90."] },
          { id:"n8", goal:2, prompt:"Flip a coin, roll a die, then spin a 4-sector spinner", answer:48, why:"2 × 6 × 4 = 48.",
            wrong:[{ match:12, fb:"Each coin result goes with each of the 6 die results, and each of those with each of the 4 sectors: 2 × 6 × 4, not 2 + 6 + 4." }],
            hints:["Three stages: coin, die, spinner.", "2, 6 and 4 outcomes.", "2 × 6 × 4 = 48."] }
        ] },
      { id:"cases", type:"custom", title:"Restrictions and cases", summary:"Restrictions and cases", star:true, goal:[3, 4, 5], prefix:"S",
        instruction:"Fill restricted positions first, and split into cases when a count depends on an earlier choice.",
        how:"Type a whole number, or a product such as 26 × 25 × 24 (powers are fine), then press Check.",
        items:[
          { id:"s1", goal:4, prompt:"4-digit PINs that start with 9 and end with an even digit (repeats allowed)", answer:500, why:"1 × 10 × 10 × 5 = 500.",
            wrong:[{ match:1000, fb:"The last digit has only 5 even choices: 1 × 10 × 10 × 5." }],
            hints:["Which positions are restricted?", "First digit: 1 choice (9). Last digit: 5 even choices. The middle two: 10 each.", "1 × 10 × 10 × 5 = 500."] },
          { id:"s2", goal:3, prompt:"3-letter codes from A, B, C, D, E with no repeats", answer:60, why:"5 × 4 × 3 = 60.",
            wrong:[{ match:125, fb:M2("5 × 4 × 3, not 5 × 5 × 5") }],
            hints:["No repeats: one fewer letter each time.", "5, then 4, then 3.", "5 × 4 × 3 = 60."] },
          { id:"s3", goal:5, star:true, prompt:"Of the codes in S2, how many contain the letter A?", answer:36, why:"60 − 4 × 3 × 2 = 60 − 24 = 36.",
            wrong:[{ match:12, fb:"Count all codes, then subtract those without A: 60 − 4 × 3 × 2." }],
            hints:["It’s easier to count the codes <strong>without</strong> A.", "Without A there are 4 letters: 4 × 3 × 2 = 24 codes.", "60 − 24 = 36."] },
          { id:"s4", goal:4, star:true, prompt:"Even three-digit numbers with no repeated digits", answer:328, why:"Units 0: 9 × 8 = 72. Units 2, 4, 6 or 8: 4 × 8 × 8 = 256. 72 + 256 = 328.",
            wrong:[{ match:360, fb:"Split by the units digit: if it’s 0, the hundreds has 9 choices; if it’s 2, 4, 6 or 8, the hundreds has 8 (not 0, not the units digit). 72 + 256." }],
            hints:["The units digit must be even, and 0 behaves differently.", "Case 1: units 0: 9 × 8. Case 2: units 2, 4, 6 or 8: 4 choices, then hundreds 8, tens 8.", "72 + 256 = 328."] },
          { id:"s5", goal:5, star:true, prompt:"How many positive divisors does `360 = 2^3 × 3^2 × 5` have?", answer:24, why:"4 × 3 × 2 = 24.",
            wrong:[{ match:6, fb:"Each prime can appear 0 times too: 4 × 3 × 2." }],
            hints:["Every divisor is `2^a × 3^b × 5^c`.", "`a` can be 0–3, `b` 0–2, `c` 0–1.", "4 × 3 × 2 = 24."] },
          { id:"s6", goal:[3, 4], star:true, prompt:"Plates with 3 letters (no repeats) then 3 digits (repeats allowed, first digit not 0)", answer:14040000, why:"26 × 25 × 24 × 9 × 10 × 10 = 14 040 000.",
            wrong:[{ match:15600000, fb:"The first digit has 9 choices, not 10: 26 × 25 × 24 × 9 × 10 × 10." }],
            hints:["Fill the restricted position first.", "Letters: 26 × 25 × 24. Digits: the first can’t be 0 (9 choices), then 10 and 10.", "26 × 25 × 24 × 9 × 10 × 10 = 14 040 000."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Beau", how:"", goal:[4, 5],
        instruction:"Beau made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"How many three-digit numbers have no repeated digits?",
            steps:["There are 3 positions to fill.", "The first digit can be any of the 10 digits.", "Then 9 choices for the second and 8 for the third.", "10 × 9 × 8 = 720."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. Look earlier.", "The arithmetic is right; the counts aren’t."],
            fixes:[
              { t:"The first digit can’t be 0: 9 choices. Then 9 (0 is now allowed) and 8: 9 × 9 × 8 = 648.", ok:true, why:"A three-digit number can’t start with 0, but 0 is fine in the tens and units." },
              { t:"Use 9 × 8 × 7 = 504.", why:"That bans 0 everywhere; 0 is fine in the tens and units." },
              { t:"Use 10 × 10 × 10.", why:M2("10 × 9 × 8, not 10 × 10 × 10") },
              { t:"Step 2 is correct.", why:"A number can’t start with 0." }],
            hints:["Can a three-digit number start with 0?", "No: 9 choices first.", "9 × 9 × 8 = 648."] },
          { id:"e2", goal:5, task:"Lunch is a soup (3 kinds) or a sandwich (5 kinds), plus a drink (4 kinds). How many lunches?",
            steps:["A lunch has two parts: a main, then a drink.", "Mains: soup or sandwich, so 3 × 5 = 15.", "With a drink: 15 × 4 = 60."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier."],
            fixes:[
              { t:"The main is one item from 3 + 5 = 8, so 8 × 4 = 32.", ok:true, why:"Soup or sandwich means one of 3 + 5 = 8 mains; then each main goes with each of the 4 drinks." },
              { t:"3 × 5 × 4 is right.", why:M4(3, 5, 8) },
              { t:"3 + 5 + 4 = 12.", why:"Each of the 8 mains goes with each of the 4 drinks: 8 groups of 4, so 8 × 4." },
              { t:"Step 2 is correct.", why:"“Or” means you choose one, not both." }],
            hints:["Does a lunch have both a soup and a sandwich?", "No: one main from 8.", "8 × 4 = 32."] },
          { id:"e3", goal:4, task:"How many odd three-digit numbers have no repeated digits?",
            steps:["Hundreds digit: 9 choices (1–9).", "Tens digit: 9 choices (anything but the hundreds digit).", "Units digit: 5 choices (1, 3, 5, 7, 9).", "9 × 9 × 5 = 405."],
            answer:2,
            stepFb:["True on its own. Keep checking.", "True on its own.", "", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"Fill the units first: 5 odd choices. Then hundreds: 8 (not 0, not the units digit). Then tens: 8. Total 5 × 8 × 8 = 320.", ok:true, why:"The units digit has the strongest restriction, so it goes first; then every later count is the same whatever was chosen before." },
              { t:"Units: 4 choices.", why:"Sometimes 5 odd digits are left, sometimes fewer; that’s why it must go first." },
              { t:"Divide 648 by 2.", why:"Odd and even numbers aren’t split evenly when 0 is involved." },
              { t:"Step 3 is correct.", why:"Some odd digits may already be used. If the hundreds digit used up an odd digit, the units has fewer odd digits left. Fill the units first." }],
            hints:["Could the hundreds or tens digit already be odd?", "Yes, so the units count isn’t fixed.", "Units first: 5 × 8 × 8 = 320."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: how fast the totals grow, or how much the fill order mattered?" },
      { id:"j2", q:"In your own words, why can you multiply to count the leaves of a tree?" },
      { id:"j3", q:"Explain to a friend how you decide between multiplying and adding." },
      { id:"j4", q:"Which kind of restriction still trips you up? What will you check first next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A restaurant offers 4 appetizers, 6 mains and 3 desserts. How many three-course meals (one of each)?", options:[
          { t:"72", ok:true, why:"4 × 6 × 3." },
          { t:"13", why:"Adding counts choices, not meals." },
          { t:"24", why:"That leaves out the desserts." },
          { t:"216", why:"6³ uses 6 for every course." }] },
        b:{ prompt:"A restaurant offers 5 appetizers, 4 mains and 3 desserts. How many three-course meals?", options:[
          { t:"60", ok:true, why:"5 × 4 × 3." },
          { t:"12", why:"Adding counts choices, not meals." },
          { t:"20", why:"That leaves out the desserts." },
          { t:"125", why:"5³ uses 5 for every course." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which expression counts 3-letter codes from the 26 letters if letters <strong>may</strong> repeat?", options:[
          { t:"26 × 26 × 26", ok:true, why:"Every position has all 26 letters." },
          { t:"26 × 25 × 24", why:"That’s for no repeats." },
          { t:"26 + 26 + 26", why:"Each of the 26 first letters goes with each of the 26 second letters, and so on: multiply, don’t add." },
          { t:"`3^{26}`", why:"The base is the number of choices, 26." }] },
        b:{ prompt:"Which expression counts 3-letter codes if letters may <strong>not</strong> repeat?", options:[
          { t:"26 × 25 × 24", ok:true, why:"One fewer letter each time." },
          { t:"26 × 26 × 26", why:M2("26 × 25 × 24, not 26 × 26 × 26") },
          { t:"26 + 25 + 24", why:"Each choice for the first letter goes with every choice for the next: multiply, don’t add." },
          { t:"3 × 26", why:"That’s 26 + 26 + 26." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"A student chooses one book: one of 6 novels or one of 4 biographies. How many choices?", options:[
          { t:"10", ok:true, why:"One book from 6 + 4." },
          { t:"24", why:"That would be a novel <strong>and</strong> a biography." },
          { t:"6", why:"That ignores the biographies." },
          { t:"2", why:"There are 2 kinds, but 10 books." }] },
        b:{ prompt:"A student picks one elective: one of 3 arts courses or one of 5 technology courses. How many choices?", options:[
          { t:"8", ok:true, why:"3 + 5." },
          { t:"15", why:M4(3, 5, 8) },
          { t:"5", why:"That ignores the arts courses." },
          { t:"2", why:"2 kinds, 8 courses." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"How many four-digit numbers have no repeated digits?", options:[
          { t:"9 × 9 × 8 × 7 = 4536", ok:true, why:"First digit 1–9; then 9, 8, 7 (0 is allowed later)." },
          { t:"10 × 9 × 8 × 7 = 5040", why:"That allows a leading 0." },
          { t:"9 × 10 × 10 × 10 = 9000", why:"That allows repeats." },
          { t:"9 × 8 × 7 × 6 = 3024", why:"That bans 0 from every position." }] },
        b:{ prompt:"How many three-digit numbers have no repeated digits?", options:[
          { t:"9 × 9 × 8 = 648", ok:true, why:"First digit 1–9; then 9 (0 is allowed now) and 8." },
          { t:"10 × 9 × 8 = 720", why:"That allows a leading 0. A three-digit number can’t start with 0: 9 choices for the first digit." },
          { t:"9 × 10 × 10 = 900", why:"That allows repeats." },
          { t:"9 × 8 × 7 = 504", why:"That bans 0 from every position." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How many <strong>even</strong> three-digit numbers can be made from the digits 1, 2, 3, 4, 5 with no repeats?", options:[
          { t:"24", ok:true, why:"Units first: 2 (2 or 4); then hundreds 4, tens 3: 2 × 4 × 3." },
          { t:"60", why:"That ignores “even”: 5 × 4 × 3." },
          { t:"50", why:"That allows repeats: 5 × 5 × 2." },
          { t:"32", why:"The tens digit can’t reuse the hundreds digit: 3 choices, not 4." }] },
        b:{ prompt:"How many <strong>odd</strong> three-digit numbers can be made from 1, 2, 3, 4, 5 with no repeats?", options:[
          { t:"36", ok:true, why:"Units: 3 (1, 3, 5); hundreds 4; tens 3." },
          { t:"60", why:"That ignores “odd”." },
          { t:"75", why:"That allows repeats: 5 × 5 × 3." },
          { t:"48", why:"The tens digit has 3 choices left, not 4." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"How many positive divisors does `72 = 2^3 × 3^2` have?", options:[
          { t:"12", ok:true, why:"A divisor is `2^a × 3^b` with `a` = 0–3 and `b` = 0–2: 4 × 3." },
          { t:"6", why:"That forgets that each prime may appear 0 times: 3 × 2." },
          { t:"7", why:"4 + 3 adds the choices." },
          { t:"5", why:"Adding the exponents doesn’t count divisors." }] },
        b:{ prompt:"How many positive divisors does `180 = 2^2 × 3^2 × 5` have?", options:[
          { t:"18", ok:true, why:"3 × 3 × 2." },
          { t:"4", why:"That forgets the 0 exponent: 2 × 2 × 1." },
          { t:"8", why:"3 + 3 + 2 adds the choices." },
          { t:"5", why:"Adding the exponents doesn’t count divisors." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why “a soup (3) or a sandwich (5), and a drink (4)” gives 32 lunches, not 60?", options:[
          { t:"The main is one item chosen from 3 + 5 = 8, so there are 8 × 4 = 32 lunches. Multiplying 3 × 5 would mean having both a soup and a sandwich.", ok:true, why:"It explains both parts: the main is one choice from 8, and only the drink stage multiplies." },
          { t:"Because 60 is too many for a café.", why:"Size isn’t the reason." },
          { t:"Because you should always add when there are three menus.", why:"Each of the 8 mains goes with each of the 4 drinks: 8 groups of 4, so 8 × 4. Adding every menu never counts lunches." },
          { t:"It is 60: 3 × 5 × 4.", why:M4(3, 5, 8) }] },
        b:{ prompt:"Which best explains why “pasta (2) or pizza (6), and a dessert (3)” gives 24 meals, not 36?", options:[
          { t:"The main is one of 2 + 6 = 8 dishes, so 8 × 3 = 24. 2 × 6 would mean ordering both.", ok:true, why:"The main is one choice from 8; then the dessert stage multiplies." },
          { t:"Because pizza has more toppings.", why:"That isn’t the reason." },
          { t:"Always add every menu: 2 + 6 + 3 = 11.", why:"Each of the 8 mains goes with each of the 3 desserts: 8 groups of 3, so 8 × 3." },
          { t:"It is 36: 2 × 6 × 3.", why:M4(2, 6, 8) }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which best explains why flipping a coin 4 times has 2⁴ outcomes, not 4²?", options:[
          { t:"Each of the 4 flips has 2 outcomes, so the tree doubles 4 times: 2 × 2 × 2 × 2.", ok:true, why:"The base is the 2 outcomes of one flip; the exponent is the 4 flips. The tree doubles once per flip." },
          { t:"Because there are 4 coins and 2 sides, so 4 × 4.", why:M7 },
          { t:"Because 2 + 2 + 2 + 2 = 8 outcomes.", why:"Each flip doubles the number of outcomes, so multiply: 2 × 2 × 2 × 2 = 16, not 8." },
          { t:"Because 4² and 2⁴ are both 16, it doesn’t matter.", why:"They happen to match here, but 5 flips give 2⁵ = 32, not 5² = 25." }] },
        b:{ prompt:"Which best explains why a tree for 3 shirts and 4 pants has 12 leaves?", options:[
          { t:"Each of the 3 shirt branches splits into the same 4 pant branches: 3 groups of 4.", ok:true, why:"Every branch splits the same way, so the leaves come in equal groups: 3 × 4 = 12." },
          { t:"Because 3 + 4 + 5 = 12.", why:"There’s no 5 in the problem." },
          { t:"Because 3 + 4 = 7 outfits, plus 5 combinations.", why:"Each of the 3 shirts goes with each of the 4 pants: 3 groups of 4, so 3 × 4." },
          { t:"Because 4³ = 12.", why:"4³ = 64." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"An Ontario licence plate has 4 letters followed by 3 digits, with repeats allowed. How many plates are possible?", options:[
          { t:"`26^4 × 10^3`", ok:true, why:"26 × 26 × 26 × 26 × 10 × 10 × 10." },
          { t:"26 × 4 + 10 × 3", why:"That adds. Each letter choice goes with every choice for the other positions: multiply 26 four times and 10 three times." },
          { t:"`4^{26} × 3^{10}`", why:"The base is the number of choices (26 or 10) and the exponent is the number of positions: `26^4 × 10^3`." },
          { t:"26 × 25 × 24 × 23 × 10 × 9 × 8", why:"Repeats are allowed." }] },
        b:{ prompt:"A plate has 3 letters followed by 3 digits, repeats allowed. How many plates?", options:[
          { t:"`26^3 × 10^3`", ok:true, why:"26 × 26 × 26 × 10 × 10 × 10: every position keeps all its choices." },
          { t:"26 × 3 + 10 × 3", why:"That adds. Multiply the choices for each position: 26 for each letter and 10 for each digit." },
          { t:"`3^{26} × 3^{10}`", why:"The base is the number of choices and the exponent is the number of positions: `26^3 × 10^3`." },
          { t:"26 × 25 × 24 × 10 × 9 × 8", why:"Repeats are allowed, so every position keeps all its choices." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A club of 12 chooses a president, a vice-president and a treasurer (one role each). Ana must be president. How many ways?", options:[
          { t:"110", ok:true, why:"1 × 11 × 10." },
          { t:"1320", why:"That ignores the condition on Ana: 12 × 11 × 10." },
          { t:"121", why:"The same person can’t be vice-president and treasurer." },
          { t:"21", why:"11 + 10 adds." }] },
        b:{ prompt:"A team of 9 chooses a captain, an assistant and a manager (one role each). Ben must be captain. How many ways?", options:[
          { t:"56", ok:true, why:"1 × 8 × 7." },
          { t:"504", why:"That ignores the condition on Ben: 9 × 8 × 7." },
          { t:"64", why:"The same person can’t be assistant and manager: 8 × 7, not 8 × 8." },
          { t:"15", why:"8 + 7 adds." }] } }
    ]
  },
  task:{
    title:"Code system", summary:"Code system",
    statement:"<p>Design a login-code system for a school library. Letters never repeat in a code. Choose how many letter and digit positions, and whether digits may repeat, so that every condition holds. Can you find all the answers?</p>" +
      '<ol class="cs-conds"><li>Each code has at least one letter and at least one digit.</li><li>A code is at most 5 characters long.</li><li>There are at least 100 000 possible codes.</li><li>There are fewer than 1 000 000 possible codes.</li></ol>',
    checks:["Letters and digits", "At most 5 characters", "At least 100 000 codes", "Fewer than 1 000 000 codes"],
    tips:["Add at least one of each kind.", "Count the characters.", "Too few codes: add a position, or allow digit repeats.", "Too many: drop a letter, or switch digit repeats off."],
    explainPrompt:"Explain how you used the counting principle to land between 100 000 and 1 000 000 codes.",
    vocab:"Use the words stage, choices, repetition and product.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"Each letter multiplies the count by about 25 and each digit by up to 10. That’s why 3 letters + 2 digits (1 560 000) already overshoots."
  },
  cards:[
    ["Fundamental counting principle", "Stages with `m`, `n`, … choices: `m × n` × … ways in total."],
    ["Why it works", "A tree where every branch splits the same way: groups of equal size."],
    ["Repeats allowed", "Every stage keeps all its choices: 10 × 10 × 10."],
    ["No repeats", "One fewer each time: 10 × 9 × 8."],
    ["Leading digit", "A number can’t start with 0: 9 choices first."],
    ["Restricted position", "Fill it first so later counts don’t depend on luck."],
    ["“And then”", "Multiply."],
    ["“Or” (one or the other)", "Add the cases: 3 soups or 5 sandwiches = 8 choices."],
    ["`k` stages of `n` choices", "`n^k` (e.g. 4 coin flips: `2^4 = 16`)."],
    ["Splitting into cases", "When counts depend on a choice (units digit 0 or not), count each case and add."],
    ["Why not list?", "456 976 000 Ontario plates: the product takes seconds; a list never ends."]
  ]
};
