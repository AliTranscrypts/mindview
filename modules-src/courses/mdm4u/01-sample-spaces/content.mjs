// MDM4U 01 Sample Spaces & Counting Outcomes. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/01-sample-spaces.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
const M1 = "The first coin and the second coin are different coins. HT and TH are two different outcomes.";
const M2 = "There are 11 sums, but they aren’t equally likely. Count the 36 equally likely ordered pairs instead.";

export default {
  id:"01-sample-spaces",
  kind:"topic",
  title:"Sample spaces and counting outcomes",
  topic:"Sample Spaces & Counting Outcomes",
  readyTopic:"sample spaces and counting outcomes",
  hero:{
    eq:"`P(A) = {n(A)}/{n(S)}`", eqLabel:"P of A equals n of A divided by n of S", eqSize:"md",
    headline:"Count what can happen, then count what you want",
    text:"The <strong>sample space</strong> is every outcome an experiment can produce. When those outcomes are <strong>equally likely</strong>, the probability of an <strong>event</strong> is the number of outcomes in the event divided by the number in the sample space. The hard part is making sure the outcomes really are equally likely.",
    fig:{ html:'<div class="ssh" role="img" aria-label="A coin flips and a tree sprouts H and T. A second flip splits each branch, giving HH, HT, TH and TT. The two middle leaves, HT and TH, glow: one of each is 2 out of 4. Beside it, the list two heads, one of each, no heads is crossed out: 3 results, but not equally likely."><div class="ssh-top"><span class="ssh-coin" id="ssh-coin" aria-hidden="true">H</span><span class="ssh-flip tiny muted" id="ssh-flip" aria-hidden="true"></span></div><div class="ssh-tree" id="ssh-tree" aria-hidden="true"></div><div class="ssh-list" id="ssh-list" aria-hidden="true"><p class="ssh-items"><span>two heads</span><span>one of each</span><span>no heads</span></p><p class="ssh-note">3 results, but not equally likely</p></div></div>' }
  },
  goals:[
    "I can list a sample space using a list, a table or a tree diagram.",
    "I can tell a discrete sample space from a continuous one.",
    "I can calculate a theoretical probability as `n(A) ÷ n(S)` when the outcomes are equally likely.",
    "I can use the complement: `P(A′) = 1 - P(A)`.",
    "I can decide whether outcomes are equally likely, and fix the sample space when they aren’t."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Fractions", goal:3, prompt:"Write `9/36` in lowest terms.",
          options:[
            { t:"`1/4`", ok:true, why:"Divide top and bottom by 9." },
            { t:"`3/12`", why:"Equivalent, but divide by 3 again." },
            { t:"`1/3`", why:"9 × 3 = 27, not 36." },
            { t:"`9/4`", why:"The part goes on top." }],
          hints:["What’s the largest number that divides 9 and 36?", "9.", "`9/36 = 1/4`."] },
        { id:"w2", skill:"Fractions", goal:4, prompt:"What is `1 - 5/12`?",
          options:[
            { t:"`7/12`", ok:true, why:"`1 = 12/12`, and `12/12 - 5/12 = 7/12`." },
            { t:"`-4/12`", why:"Write 1 as `12/12` first." },
            { t:"`5/12`", why:"That’s what you took away, not what’s left." },
            { t:"`12/5`", why:"Subtracting from 1 isn’t flipping." }],
          hints:["Write 1 with denominator 12.", "`12/12 - 5/12`.", "`7/12`."] },
        { id:"w3", skill:"Listing systematically", goal:1,
          prompt:"List every two-letter arrangement of A, B and C with no letter used twice (AB and BA are different). How many are there?",
          options:[
            { t:"6", ok:true, why:"AB, AC, BA, BC, CA, CB." },
            { t:"3", why:"AB and BA are different arrangements here." },
            { t:"9", why:"AA isn’t allowed." },
            { t:"5", why:"List by first letter: 2 each." }],
          hints:["Fix the first letter.", "A first: AB, AC. Then B first, then C first.", "3 × 2 = 6."] },
        { id:"w4", skill:"Listing systematically", goal:1,
          prompt:"A coin is flipped and a spinner with sectors 1, 2 and 3 is spun. How many outcomes are there?",
          options:[
            { t:"6", ok:true, why:"H1, H2, H3, T1, T2, T3." },
            { t:"5", why:"Each coin result pairs with each spinner result." },
            { t:"3", why:"The coin doubles the list." },
            { t:"9", why:"3 × 3 would be two spinners." }],
          hints:["Make a tree: coin first.", "Each of H and T has 3 branches.", "2 × 3 = 6."] },
        { id:"w5", skill:"Probability language", goal:3,
          prompt:"Which number is the probability of an event that is certain to happen?",
          options:[
            { t:"1", ok:true, why:"Probabilities run from 0 (impossible) to 1 (certain)." },
            { t:"0", why:"0 means impossible." },
            { t:"`1/2`", why:"`1/2` means as likely as not." },
            { t:"100", why:"100% is the same as 1. As a fraction or decimal, probability never exceeds 1." }],
          hints:["What’s the largest a probability can be?", "100% as a decimal.", "1."] },
        { id:"w6", skill:"Probability language", goal:5,
          prompt:"A bag holds 2 blue and 6 white marbles, all the same size. Which statement is true?",
          options:[
            { t:"Drawing white is 3 times as likely as drawing blue.", ok:true, why:P("white") + " = `6/8` and " + P("blue") + " = `2/8`." },
            { t:"Blue and white are equally likely, because there are two colours.", why:"There are 8 marbles, not 2 outcomes." },
            { t:P("blue") + " = `2/6`", why:"That’s blue ÷ white. Divide by all 8." },
            { t:P("white") + " = `6/2 = 3`", why:"A probability can’t be more than 1." }],
          hints:["How many marbles in total?", "8.", P("white") + " = `6/8`, " + P("blue") + " = `2/8`: white is 3 times as likely."] }
      ],
      refreshers:{
        "Fractions":"Simplify by dividing top and bottom by their greatest common factor. To find `1 - a/b`, write 1 as `b/b`.",
        "Listing systematically":"Fix the first stage, list every choice for the next, then move on. Count by multiplying the number of choices at each stage.",
        "Probability language":"Probability is a number from 0 to 1. With equally likely outcomes, `P` = favourable ÷ total."
      }
    }
  },
  explore:{
    heading:"Outcome mapper",
    intro:"Pick an experiment and a view. Mark an event and watch its probability, then test it with the simulator.",
    predIntro:"Make a prediction first. Then the outcome mapper will show you what really happens.",
    predictions:[
      { id:"p1", start:{ exp:"c3", view:"tree", reveal:0 },
        prompt:"Three coins, tree view. How many outcomes are in the sample space?",
        options:[{ t:"8", ok:true }, { t:"6" }, { t:"4" }, { t:"3" }],
        explain:"Each flip doubles the number of outcomes: 2 × 2 × 2 = 8." },
      { id:"p2", start:{ exp:"d2", view:"table", comb:"sum" },
        prompt:"Two dice, Sum view. Which sum is most likely?",
        options:[{ t:"7", ok:true }, { t:"6" }, { t:"12" }, { t:"They’re all equally likely" }],
        explain:"Six ordered pairs give 7: (1, 6) through (6, 1). Only one gives 12." },
      { id:"p3", start:{ exp:"c2", view:"list", grouped:true },
        prompt:"Two coins, and the list shows “two heads / one of each / no heads”. What is the probability of getting one head and one tail?",
        options:[{ t:"`1/2`", ok:true }, { t:"`1/3`" }, { t:"`1/4`" }, { t:"`2/3`" }],
        explain:"HT and TH are different outcomes, so “one of each” is 2 of 4 equally likely outcomes." },
      { id:"p4", start:{ exp:"d2", view:"table", comb:"pairs" },
        prompt:"Two dice, ordered pairs. What is the probability of rolling doubles?",
        options:[{ t:"`1/6`", ok:true }, { t:"`1/36`" }, { t:"`1/12`" }, { t:"`1/11`" }],
        explain:"6 doubles out of 36 ordered pairs: `6/36 = 1/6`." }
    ],
    chalIntro:"Set up the outcome mapper, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Two dice, tap mode: mark an event whose probability is exactly `1/4`.",
        why:"`9/36 = 1/4`, so any 9 cells work.",
        hints:["How many cells are there altogether?", "`1/4` of 36 = 9.", "Mark every cell where both dice are odd: 3 × 3 = 9."] },
      { id:"tc2", goal:[1, 3], prompt:"Three coins: choose an event from the menu whose probability is `3/8`.",
        why:"Exactly one head (HTT, THT, TTH) and exactly two heads (HHT, HTH, THH) each happen 3 ways out of 8.",
        hints:["`3/8` means 3 of the 8 leaves.", "Which head count happens 3 ways?", "Exactly two heads: HHT, HTH, THH."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Two dice, Product view: find a product value whose probability is exactly `1/9`.",
        why:"6 and 12 each appear in exactly 4 of the 36 cells: `4/36 = 1/9`.",
        hints:["`1/9` of 36 is how many cells?", "You need a product that appears in exactly 4 cells.", "6 = 1 × 6 = 6 × 1 = 2 × 3 = 3 × 2, and 12 = 2 × 6 = 6 × 2 = 3 × 4 = 4 × 3."] }
    ]
  },
  part3:{
    slug:"equally-likely", name:"Equally likely?",
    heading:"Is it equally likely?",
    intro:"Dividing by the number of outcomes only works when the outcomes are equally likely. Visit each station: spot the outcomes that aren’t, fix the sample space, then check it with data.",
    quickCheck:{
      title:"Quick check", summary:"Is it equally likely? quick check",
      items:[
        { id:"q1", goal:5, prompt:"A spinner has A = 240° and B = 120°. `P(B)`?",
          choices:[
            { t:"`1/3`", ok:true, fb:"Right. 120/360 = 1/3: B covers a third of the circle." },
            { t:"`1/2`", fb:"120/360 = 1/3. Two letters doesn’t mean 1/2." },
            { t:"`2/3`", fb:"120/360 = 1/3. Two letters doesn’t mean 1/2." },
            { t:"`1/120`", fb:"120/360 = 1/3. Two letters doesn’t mean 1/2." }] },
        { id:"q2", goal:3, prompt:"Two coins. " + P("no heads") + "?",
          choices:[
            { t:"`1/4`", ok:true, fb:"Right. Only TT has no heads: 1 of the 4 equally likely outcomes." },
            { t:"`1/3`", fb:"Only TT, out of HH, HT, TH, TT." },
            { t:"`1/2`", fb:"Only TT, out of HH, HT, TH, TT." },
            { t:"0", fb:"Only TT, out of HH, HT, TH, TT." }] },
        { id:"q3", goal:5, prompt:"Which sample space is equally likely?",
          choices:[
            { t:"The 6 faces of a fair die", ok:true, fb:"Right. Each face of a fair die has probability 1/6." },
            { t:"The sums 2–12 of two dice", fb:"The others are events with different numbers of underlying outcomes." },
            { t:"The head counts 0–3 in three flips", fb:"The others are events with different numbers of underlying outcomes." },
            { t:"“Win” and “lose” for a raffle ticket", fb:"The others are events with different numbers of underlying outcomes." }] },
        { id:"q4", goal:5, prompt:"In 600 spins, A came up 296 times. Best statement?",
          choices:[
            { t:"`296/600 ≈ 0.49` is close to the theoretical `1/2`", ok:true, fb:"Right. Random results vary, and 0.49 is close to 0.5." },
            { t:"The spinner is unfair because 296 ≠ 300", fb:"Random results vary. A small gap from 300 is expected." },
            { t:"`P(A) = 296`", fb:"Random results vary. A small gap from 300 is expected. A probability is a number from 0 to 1." },
            { t:"The next spin is more likely to be A", fb:"Random results vary. A small gap from 300 is expected, and a run of results never changes the next spin’s probability." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"count", type:"numeric", title:"How many outcomes?", summary:"How many outcomes?", goal:1,
        instruction:"Find the number of outcomes in each sample space.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"n1", prompt:"Three coins", label:"`n(S)` =", keypad:"decimal", answer:8, display:"8 outcomes", why:"2 × 2 × 2 = 8.",
            wrong:[{ match:6, fb:"Each flip doubles: 2 × 2 × 2." }],
            hints:["Make a tree: each coin splits every branch in two.", "2 × 2 × 2.", "8 outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT."] },
          { id:"n2", prompt:"A die and a coin", label:"`n(S)` =", answer:12, display:"12 outcomes", why:"6 × 2 = 12.",
            wrong:[{ match:8, fb:"6 × 2, not 6 + 2." }],
            hints:["Each die result pairs with each coin result.", "6 die results × 2 coin results.", "6 × 2 = 12."] },
          { id:"n3", prompt:"Two dice", label:"`n(S)` =", answer:36, display:"36 ordered pairs", why:"6 × 6 = 36 ordered pairs.",
            wrong:[{ match:12, fb:"Each of the 6 results on die 1 pairs with each of the 6 results on die 2: 6 × 6 = 36, not 6 + 6." },
                   { match:21, fb:"21 counts unordered pairs; (2, 5) and (5, 2) differ." }],
            hints:["Make a 6 by 6 table.", "Each row has 6 cells.", "36."] },
          { id:"n4", prompt:"A 4-sector spinner spun twice", label:"`n(S)` =", answer:16, display:"16 outcomes", why:"4 × 4 = 16.",
            wrong:[{ match:8, fb:"Each of the 4 results on the first spin pairs with each of the 4 results on the second: 4 × 4 = 16, not 4 + 4." }],
            hints:["List spin 1 down the side and spin 2 across the top.", "Each of the 4 rows has 4 cells.", "4 × 4 = 16."] },
          { id:"n5", prompt:"Two-digit codes from the digits 1, 2, 3, repeats allowed", label:"`n(S)` =", answer:9, display:"9 codes", why:"3 × 3 = 9.",
            wrong:[{ match:6, fb:"11, 22 and 33 are allowed." }],
            hints:["The first digit has 3 choices. How many does the second digit have?", "Repeats are allowed, so the second digit also has 3 choices.", "3 × 3 = 9: 11, 12, 13, 21, 22, 23, 31, 32, 33."] },
          { id:"n6", prompt:"Two-digit codes from the digits 1, 2, 3, no repeats", label:"`n(S)` =", answer:6, display:"6 codes", why:"3 × 2 = 6.",
            wrong:[{ match:9, fb:"No repeats removes 11, 22, 33." }],
            hints:["Start from the 9 codes with repeats allowed.", "Remove 11, 22 and 33.", "9 − 3 = 6: 12, 13, 21, 23, 31, 32."] },
          { id:"n7", prompt:"Two 4-sided dice (1–4): how many <strong>different sums</strong>?", label:"Different sums:", answer:7, display:"7 different sums",
            why:"The sums run from 2 to 8: 7 different sums, made from 16 equally likely ordered pairs.",
            wrong:[{ match:16, fb:"16 ordered pairs, but the sums are only 2 to 8." }],
            hints:["What’s the smallest sum? The largest?", "2 and 8.", "2, 3, 4, 5, 6, 7, 8: 7 sums."] },
          { id:"n8", prompt:"A coin flipped 4 times", label:"`n(S)` =", answer:16, display:"16 outcomes", why:"2 × 2 × 2 × 2 = 2⁴ = 16.",
            wrong:[{ match:8, fb:"Four doublings: 2⁴." }],
            hints:["Each flip doubles the number of outcomes.", "2 × 2 × 2 × 2.", "2⁴ = 16."] }
        ] },
      { id:"prob", type:"numeric", title:"Find the probability", summary:"Find the probability", star:true, goal:[3, 4, 5],
        instruction:"Find each probability. Give a fraction in lowest terms or a decimal to 4 places.",
        how:"Type a fraction such as 5/12 (an equivalent fraction is fine) or a decimal to 4 places, then press Check.",
        items:[
          { id:"r1", goal:5, prompt:"Two dice: " + P("the sum is prime"), answer:5 / 12, tol:5e-5, display:"`5/12`",
            why:"The prime sums 2, 3, 5, 7 and 11 happen 1 + 2 + 4 + 6 + 2 = 15 ways: `15/36 = 5/12`.",
            wrong:[{ match:5 / 11, fb:"Five prime sums, but not equally likely: 1 + 2 + 4 + 6 + 2 = 15 of 36." }],
            hints:["Which sums are prime?", "2, 3, 5, 7 and 11. In the 6 × 6 table they fill 1, 2, 4, 6 and 2 cells.", "1 + 2 + 4 + 6 + 2 = 15, so `15/36 = 5/12`."] },
          { id:"r2", goal:4, prompt:"Two dice: " + P("the product is even"), answer:3 / 4, tol:5e-5, display:"`3/4`",
            why:"The product is odd only when both dice are odd (9 cells), so " + P("even") + " = `1 - 9/36 = 27/36 = 3/4`.",
            wrong:[{ match:1 / 2, fb:"The product is odd only when both dice are odd: 9 of 36. So even is 27/36." }],
            hints:["When is a product odd?", "Only when both dice are odd: 3 × 3 = 9 cells. Use the complement.", "`1 - 9/36 = 27/36 = 3/4`."] },
          { id:"r3", goal:3, star:true, prompt:"Two dice: " + P("the larger number is 4"), answer:7 / 36, tol:5e-5, display:"`7/36`",
            why:"Seven pairs have a 4 and nothing bigger: (4, 1), (4, 2), (4, 3), (4, 4), (1, 4), (2, 4), (3, 4).",
            wrong:[{ match:1 / 6, fb:"Count pairs with a 4 and nothing bigger: (4, 1), (4, 2), (4, 3), (4, 4), (1, 4), (2, 4), (3, 4)." }],
            hints:["The larger number is 4 when one die shows 4 and the other shows 4 or less.", "In the 6 × 6 table, look along row 4 and down column 4, up to 4.", "(4, 1), (4, 2), (4, 3), (4, 4), (1, 4), (2, 4), (3, 4): `7/36`."] },
          { id:"r4", goal:3, star:true, prompt:"A die is rolled twice: " + P("the second roll is greater than the first"), answer:5 / 12, tol:5e-5, display:"`5/12`",
            why:"Ties (doubles) take 6 of the 36 cells, and the other 30 split evenly above and below the diagonal: `15/36 = 5/12`.",
            wrong:[{ match:1 / 2, fb:"Ties (doubles) take 6 of the 36 cells. The other 30 split evenly: 15/36." }],
            hints:["Use the 6 × 6 table.", "Cells above the diagonal vs below.", "(36 − 6) ÷ 2 = 15, so `15/36 = 5/12`."] },
          { id:"r5", goal:5, star:true, prompt:"The spinner A = 180°, B = 120°, C = 60° is spun twice: " + P("the same letter both times"), answer:7 / 18, tol:5e-5, display:"`7/18`",
            why:"With six equal parts A, A, A, B, B, C, two spins give 36 equally likely pairs, and 9 + 4 + 1 = 14 of them match: `14/36 = 7/18`.",
            wrong:[{ match:1 / 3, fb:"Split into 6 equal parts (A, A, A, B, B, C). Same letter: 3² + 2² + 1² = 14 of 36." }],
            hints:["Make the spinner equally likely first.", "Six equal parts: A, A, A, B, B, C; spinning twice gives 6 × 6 = 36 equally likely pairs.", "AA: 9, BB: 4, CC: 1. `14/36 = 7/18`."] },
          { id:"r6", goal:3, star:true, prompt:"Three coins: " + P("more heads than tails"), answer:1 / 2, tol:5e-5, display:"`1/2`",
            why:"More heads means 2 or 3 heads: 3 + 1 = 4 of the 8 outcomes.",
            wrong:[{ match:3 / 8, fb:"More heads means 2 or 3 heads: 3 + 1 = 4 of 8." }],
            hints:["With 3 coins, more heads than tails means 2 or 3 heads.", "Exactly two heads: 3 ways. Exactly three heads: 1 way.", "3 + 1 = 4 of 8, so `4/8 = 1/2`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Aarav", how:"", goal:[3, 5],
        instruction:"Aarav made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Two dice are rolled. Find " + P("the sum is 9") + ".",
            steps:["The possible sums are 2, 3, 4, …, 12.", "That’s 11 possible sums.", "Each sum is equally likely, so `P(9) = 1/11`.", "So " + P("sum is 9") + " ≈ 0.09."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct: there are 11 different sums.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Use the 36 equally likely ordered pairs: (3, 6), (4, 5), (5, 4), (6, 3) give `4/36 = 1/9`.", ok:true, why:"The sums aren’t equally likely, so count ordered pairs instead: 4 of the 36." },
              { t:"Use `9 ÷ 12`, since 12 is the largest sum.", why:"The sum isn’t a fraction of the maximum." },
              { t:"There are 2 ways to get 9, so `2/36`.", why:"That treats (3, 6) and (6, 3) as one. The two dice are different dice, so they’re two different outcomes." },
              { t:"Step 3 is correct.", why:"Sums aren’t equally likely: 7 happens 6 ways, 12 only once." }],
            hints:["Are all 11 sums equally likely?", "No: count ordered pairs.", "`4/36 = 1/9`."] },
          { id:"e2", goal:3, task:"Two coins are flipped. Find " + P("at least one head") + ".",
            steps:["The outcomes are two heads, one head, no heads.", "Two of the three outcomes have at least one head.", "So " + P("at least one head") + " = `2/3`."],
            answer:0,
            stepFb:["", "Step 2 counts step 1’s list correctly. The list is the problem.", "Step 3 follows. Look earlier."],
            fixes:[
              { t:"List the equally likely outcomes HH, HT, TH, TT: 3 of 4 have a head, so `3/4`.", ok:true, why:"“One head” happens two ways, HT and TH, so the equally likely list has 4 outcomes." },
              { t:"Use `1/2 + 1/2 = 1`.", why:"Adding the two coins’ probabilities gives 1, which would mean certain: TT is possible." },
              { t:"Use `1/4`, for HH.", why:"“At least one” includes HT and TH." },
              { t:"Step 1 is correct.", why:"“One head” happens two ways: HT and TH." }],
            hints:["Is “one head” one outcome or two?", "HT and TH.", "`3/4`, or `1 -` " + P("TT") + " `= 1 - 1/4`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which prediction surprised you most: the most likely sum, or one head and one tail being `1/2`?" },
      { id:"j2", q:"In your own words, why can’t you divide by 11 to find the probability of a sum of two dice?" },
      { id:"j3", q:"Explain to a friend how to build the sample space for a coin and a die, and how big it is." },
      { id:"j4", q:"When would you choose a tree over a table? Which one will you practise more?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How many outcomes are in the sample space for rolling a die and flipping a coin?", options:[
          { t:"12", ok:true, why:"6 × 2." },
          { t:"8", why:"6 + 2 adds the stages; each die result pairs with each coin result." },
          { t:"6", why:"That ignores the coin." },
          { t:"36", why:"That’s two dice." }] },
        b:{ prompt:"A spinner with 5 equal sectors is spun and a coin is flipped. How many outcomes?", options:[
          { t:"10", ok:true, why:"5 × 2." },
          { t:"7", why:"5 + 2 adds the stages; each spinner result pairs with each coin result." },
          { t:"5", why:"That ignores the coin." },
          { t:"25", why:"That’s two spinners." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"A bag holds 3 blue, 5 white and 2 black marbles. One is drawn at random. What is " + P("white") + "?", options:[
          { t:"`1/2`", ok:true, why:"5 white out of 10 marbles." },
          { t:"`1/3`", why:"Three colours aren’t three equally likely outcomes." },
          { t:"1", why:"5 ÷ 5 is white ÷ not white." },
          { t:"`1/10`", why:"That’s the chance of one particular marble." }] },
        b:{ prompt:"A bag holds 2 green, 5 yellow and 3 purple marbles. What is " + P("purple") + "?", options:[
          { t:"`3/10`", ok:true, why:"3 purple out of 10." },
          { t:"`1/3`", why:"Three colours aren’t three equally likely outcomes: there are 10 marbles." },
          { t:"`3/7`", why:"3 ÷ 7 is purple ÷ not purple." },
          { t:"`1/10`", why:"That’s one particular marble." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which experiment has a <strong>continuous</strong> sample space?", options:[
          { t:"Timing how long a runner takes to finish 100 m", ok:true, why:"Time can take any value in a range." },
          { t:"Counting the goals in a hockey game", why:"Goals are counted: 0, 1, 2, …" },
          { t:"Counting the students absent today", why:"Students are counted: 0, 1, 2, … Times and lengths are the ones that take any value in a range." },
          { t:"Rolling a die", why:"Six countable faces." }] },
        b:{ prompt:"Which experiment has a <strong>discrete</strong> sample space?", options:[
          { t:"Counting the red cars that pass in an hour", ok:true, why:"Cars are counted." },
          { t:"Measuring the mass of an apple", why:"Mass can take any value." },
          { t:"Timing a phone call", why:"Time is continuous." },
          { t:"Measuring the temperature at noon", why:"Temperature is continuous." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Two dice are rolled. What is " + P("the sum is 10 or more") + "?", options:[
          { t:"`1/6`", ok:true, why:"Sums 10, 11, 12 happen 3 + 2 + 1 = 6 ways out of 36." },
          { t:"`3/11`", why:"Three of the 11 sums, but sums aren’t equally likely." },
          { t:"`1/12`", why:"That’s only a sum of 10." },
          { t:"`1/9`", why:"Unordered pairs {4, 6}, {5, 5}, {5, 6}, {6, 6} miss (6, 4) and (6, 5)." }] },
        b:{ prompt:"Two dice are rolled. What is " + P("the sum is 4 or less") + "?", options:[
          { t:"`1/6`", ok:true, why:"Sums 2, 3, 4 happen 1 + 2 + 3 = 6 ways out of 36." },
          { t:"`3/11`", why:"Three of the 11 sums, but sums aren’t equally likely." },
          { t:"`1/12`", why:"That’s only a sum of 4." },
          { t:"`1/9`", why:"Unordered pairs miss (2, 1) and (3, 1)." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Three coins are flipped. What is " + P("at least one tail") + "?", options:[
          { t:"`7/8`", ok:true, why:"1 − " + P("HHH") + " = `1 - 1/8`." },
          { t:"`3/8`", why:"That’s exactly one tail." },
          { t:"`3/4`", why:"Three of the four tail counts (1, 2, 3 of 0–3), but tail counts aren’t equally likely." },
          { t:"`1/2`", why:"Only one outcome, HHH, has no tail." }] },
        b:{ prompt:"Four coins are flipped. What is " + P("at least one head") + "?", options:[
          { t:"`15/16`", ok:true, why:"1 − " + P("TTTT") + " = `1 - 1/16`." },
          { t:"`1/4`", why:"`4/16` is exactly one head." },
          { t:"`4/5`", why:"Head counts 0–4 aren’t equally likely." },
          { t:"`1/2`", why:"Only TTTT has no head." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Two dice are rolled and the numbers are multiplied. What is " + P("the product is 12") + "?", options:[
          { t:"`1/9`", ok:true, why:"(2, 6), (6, 2), (3, 4), (4, 3): 4 of 36." },
          { t:"`1/18`", why:"Two unordered pairs, but each happens two ways." },
          { t:"`1/12`", why:"That misses one of the four ordered pairs." },
          { t:"`1/36`", why:"There’s more than one way to make 12." }] },
        b:{ prompt:"Two dice are rolled and the numbers are multiplied. What is " + P("the product is 4") + "?", options:[
          { t:"`1/12`", ok:true, why:"(1, 4), (4, 1), (2, 2): 3 of 36." },
          { t:"`1/18`", why:"Unordered {1, 4} and {2, 2} miss (4, 1)." },
          { t:"`1/9`", why:"(2, 2) can only happen one way, not two." },
          { t:"`1/36`", why:"There’s more than one way to make 4." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why " + P("sum = 7") + " for two dice isn’t `1/11`?", options:[
          { t:"The 11 sums aren’t equally likely. There are 36 equally likely ordered pairs, and 6 of them give 7, so `P = 1/6`.", ok:true, why:"It names the problem and fixes it: count the 36 equally likely ordered pairs." },
          { t:"Because 7 is odd.", why:"Oddness has nothing to do with it." },
          { t:"Because dice are random, so you can’t calculate it.", why:"You can, using the 36 ordered pairs." },
          { t:"It is `1/11`, since 7 is one of 11 sums.", why:M2 }] },
        b:{ prompt:"Which is the best explanation of why " + P("one head and one tail") + " for two coins isn’t `1/3`?", options:[
          { t:"HT and TH are different equally likely outcomes, so “one of each” is 2 of the 4 outcomes: `1/2`.", ok:true, why:"It explains why the three-result list fails: “one of each” happens two ways." },
          { t:"Because coins can land on their edge.", why:"That isn’t the issue." },
          { t:"It is `1/3`: two heads, one of each, no heads.", why:M1 },
          { t:"Because there are 2 coins, the answer is `1/2` for everything.", why:P("two heads") + " is `1/4`." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which representation shows every outcome of flipping a coin and then rolling a die most clearly?", options:[
          { t:"A tree with 2 first branches, each splitting into 6 (12 leaves)", ok:true, why:"Every coin result branches into every die result: 2 × 6 = 12 outcomes, none missed and none counted twice." },
          { t:"A list of 8 results: H, T, 1, 2, 3, 4, 5, 6", why:"That lists stage results, not outcomes." },
          { t:"A Venn diagram with “heads” and “even” circles", why:"That shows events, not the full sample space." },
          { t:"A number line from 1 to 6", why:"It leaves out the coin." }] },
        b:{ prompt:"Which representation best organizes the outcomes of spinning two 4-sector spinners?", options:[
          { t:"A 4 × 4 table with spinner 1 down the side and spinner 2 across the top (16 cells)", ok:true, why:"Each cell is one ordered pair, so all 16 equally likely outcomes appear exactly once." },
          { t:"A list of 8 results: 1, 2, 3, 4, 1, 2, 3, 4", why:"That lists each spinner’s results, not outcomes. Each result on spinner 1 pairs with each result on spinner 2: 4 × 4 = 16, not 4 + 4." },
          { t:"A table of the 7 possible sums", why:"Sums aren’t equally likely outcomes." },
          { t:"A single list of 4 numbers", why:"That’s one spinner." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A video game’s reward wheel has three sectors: coins 160°, gem 80°, key 120°. What is " + P("gem") + " on one spin?", options:[
          { t:"`2/9`", ok:true, why:"80/360 = 2/9." },
          { t:"`1/3`", why:"Three rewards, but the sectors aren’t equal." },
          { t:"`2/7`", why:"80/280 compares the gem with the other sectors, not the whole wheel." },
          { t:"`7/9`", why:"That’s the probability of <strong>not</strong> getting the gem." }] },
        b:{ prompt:"A reward wheel has coins 200°, gem 100°, key 60°. What is " + P("key") + "?", options:[
          { t:"`1/6`", ok:true, why:"60/360 = 1/6." },
          { t:"`1/3`", why:"Three rewards, but the sectors aren’t equal." },
          { t:"`1/5`", why:"60/300 compares with the other sectors only." },
          { t:"`5/6`", why:"That’s not the key: it’s the probability of <strong>not</strong> getting the key." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A school raffle sells 300 tickets, and one is drawn as the winner. You bought 6. What is " + P("you win") + "?", options:[
          { t:"`1/50`", ok:true, why:"6/300." },
          { t:"`1/300`", why:"That’s for one ticket." },
          { t:"`1/49`", why:"6/294 is your tickets ÷ everyone else’s." },
          { t:"`1/6`", why:"Having 6 tickets doesn’t mean a 1 in 6 chance." }] },
        b:{ prompt:"A raffle sells 240 tickets, one winner. You bought 8. What is " + P("you win") + "?", options:[
          { t:"`1/30`", ok:true, why:"8/240." },
          { t:"`1/240`", why:"That’s for one ticket." },
          { t:"`1/29`", why:"8/232 is yours ÷ everyone else’s." },
          { t:"`1/8`", why:"8 tickets doesn’t mean 1 in 8." }] } }
    ]
  },
  task:{
    title:"Twenty-four sectors", summary:"Twenty-four sectors",
    statement:"<p>A spinner has 24 equal sectors. Label each A, B or C so that every condition holds. Can you find all the answers?</p><ol class=\"ss-conds\"><li>Every letter appears at least once.</li><li>A is exactly twice as likely as B.</li><li>`P(C)` is at least `1/4`.</li><li>If the spinner is spun twice, the two spins show the same letter at most half the time.</li></ol><p class=\"tiny muted\">Set `a`, the number of A sectors, and `b`, the number of B sectors. The rest, `c = 24 - a - b`, are C.</p>",
    checks:["Every letter appears", "A is twice as likely as B", "`P(C) ≥ 1/4`", "Same letter at most half the time"],
    tips:["Each letter needs at least one sector.",
      "`P(A) = a/24` and `P(B) = b/24`, so you need `a = 2b`.",
      "`1/4` of 24 sectors is 6.",
      "Spinning twice gives 24 × 24 = 576 equally likely pairs. Same-letter pairs number `a^2 + b^2 + c^2`; you need at most 288. A big `c` makes this too large."],
    explainPrompt:"Explain how you used equally likely sectors to turn each condition into a statement about `a`, `b` and `c`.",
    vocab:"Use the words sample space, equally likely, outcome and probability.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"With `a = 2b`, `c = 24 - 3b`. Condition 3 caps `b` at 6, and condition 4 rules out `b = 1` and `b = 2`, where C takes too many sectors and repeats too often."
  },
  cards:[
    ["Sample space `S`", "The set of all possible outcomes. Two coins: {HH, HT, TH, TT}."],
    ["Event", "A set of outcomes, a subset of `S`. “At least one head” = {HH, HT, TH}."],
    ["Theoretical probability", "`P(A) = n(A) ÷ n(S)`, only when outcomes are equally likely."],
    ["Range of a probability", "0 (impossible) to 1 (certain)."],
    ["Complement `A′`", "Everything not in `A`. `P(A′) = 1 - P(A)`."],
    ["Sum of all probabilities", "The probabilities of all outcomes in `S` add to 1."],
    ["Ordered outcomes", "(2, 5) and (5, 2) are different outcomes for two dice."],
    ["Two dice", "36 equally likely ordered pairs. Sum 7 is most likely: `6/36`."],
    ["Not equally likely", "Sums, head counts, colours and unequal sectors: go back to equally likely outcomes."],
    ["Discrete", "Outcomes can be counted: goals, heads, cars."],
    ["Continuous", "Any value in a range: time, mass, length. Described with an interval."]
  ]
};
