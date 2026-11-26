// MDM4U 03 Mutually Exclusive Events & the Additive Principle. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/03-mutually-exclusive.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "The king of hearts is in both events. Adding counts it twice, so subtract it once.";
const M2 = "Mutually exclusive means they can’t happen together: `P(A and B) = 0`. Nothing is multiplied.";
const M4 = "“Or” includes everything in `A`, everything in `B`, and the overlap, not just the overlap.";
const M5 = "Probabilities of `A` and `A′` add to 1, so `P(A′) = 1 - P(A)`.";
const M7 = "Some people are in neither group: the union is the total minus “neither”.";
const ME_HINTS = (h3) => ["Can one outcome be in both events?", "Try to find such an outcome.", h3];

export default {
  id:"03-mutually-exclusive",
  kind:"topic",
  title:"Mutually exclusive events and the additive principle",
  topic:"Mutually Exclusive Events & the Additive Principle",
  readyTopic:"mutually exclusive events and the additive principle",
  hero:{
    eq:"`P(A ∪ B)` `= P(A) + P(B)` `- P(A ∩ B)`", eqLabel:"P of A union B equals P of A plus P of B minus P of A intersect B", eqSize:"sm",
    headline:"Add the events, then take out the double count",
    text:"Two events are <strong>mutually exclusive</strong> if they can’t happen at the same time; then the probability that one <strong>or</strong> the other happens is just the sum. When they <strong>overlap</strong>, adding counts the shared outcomes twice, so subtract the overlap once. The same idea counts “or” situations: the <strong>additive principle</strong>.",
    fig:{ html:'<div class="me-h" role="img" aria-label="Two overlapping circles. The 13 hearts slide into circle A and the 12 face cards slide into circle B. The jack, queen and king of hearts try to sit in both circles, so they stack up in the overlap, glowing times 2: counted twice. The counter reads 13 + 12 = 25, then minus 3 strikes through the extra copies and shows 22.">' +
      '<svg class="me-hsvg" id="me-hsvg" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true"></svg>' +
      '<p class="me-hcount" id="me-hcount" aria-hidden="true"></p></div>' }
  },
  goals:[
    "I can decide whether two events are mutually exclusive.",
    "I can find `P(A or B)` for mutually exclusive events by adding.",
    "I can find `P(A or B)` for overlapping events by subtracting the overlap once.",
    "I can use the additive counting principle to count “or” situations.",
    "I can use complements for “not” and “neither” questions.",
    "I can solve “or” problems in context, including working backwards to find an overlap."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sample spaces and probability", goal:2, prompt:"A die is rolled. What is `P`(a number less than 3)?",
          options:[
            { t:"1/3", ok:true, why:"1 or 2: 2 of 6." },
            { t:"1/2", why:"Only 1 and 2 are less than 3." },
            { t:"1/6", why:"Both 1 and 2 count." },
            { t:"2/3", why:"That’s 3 or more." }],
          hints:["Which outcomes are less than 3?", "1 and 2.", "2/6 = 1/3."] },
        { id:"w2", skill:"Sample spaces and probability", goal:1, prompt:"Which outcomes of one die roll are both even <strong>and</strong> greater than 3?",
          options:[
            { t:"4 and 6", ok:true, why:"Even: 2, 4, 6. Greater than 3: 4, 5, 6. Both: 4 and 6." },
            { t:"2, 4 and 6", why:"2 isn’t greater than 3." },
            { t:"4, 5 and 6", why:"5 isn’t even." },
            { t:"2, 4, 5 and 6", why:"That’s “or”. “And” needs both." }],
          hints:["List each event.", "{2, 4, 6} and {4, 5, 6}.", "Common: 4 and 6."] },
        { id:"w3", skill:"Standard deck", goal:6, prompt:"How many face cards are in a standard 52-card deck?",
          options:[
            { t:"12", ok:true, why:"J, Q, K in each of 4 suits." },
            { t:"16", why:"Aces aren’t face cards." },
            { t:"3", why:"3 per suit, 4 suits." },
            { t:"4", why:"That’s one rank, like kings." }],
          hints:["Which ranks are face cards?", "J, Q, K.", "3 × 4 = 12."] },
        { id:"w4", skill:"Standard deck", goal:1, prompt:"How many cards are hearts <strong>and</strong> face cards?",
          options:[
            { t:"3", ok:true, why:"J♥, Q♥, K♥." },
            { t:"25", why:"25 is hearts plus face cards." },
            { t:"0", why:"Hearts have face cards too." },
            { t:"12", why:"That’s all face cards." }],
          hints:["Which hearts are face cards?", "Jack, queen and king of hearts.", "3."] },
        { id:"w5", skill:"Complements", goal:5, prompt:"`P`(snow tomorrow) = 0.3. What is `P`(no snow tomorrow)?",
          options:[
            { t:"0.7", ok:true, why:"1 − 0.3." },
            { t:"−0.7", why:"That’s 0.3 − 1." },
            { t:"3.33", why:"1 ÷ 0.3 isn’t a complement." },
            { t:"0.3", why:"That’s snow." }],
          hints:["Snow and no snow cover every possibility.", "They add to 1.", "0.7."] },
        { id:"w6", skill:"Complements", goal:5, prompt:"Two coins are flipped. `P`(at least one head) = ?",
          options:[
            { t:"3/4", ok:true, why:"1 − `P`(TT) = 1 − 1/4." },
            { t:"1/2", why:"Only TT lacks a head." },
            { t:"1", why:"TT is possible." },
            { t:"2/3", why:"HT and TH are separate outcomes." }],
          hints:["What’s the opposite of “at least one head”?", "No heads: TT.", "1 − 1/4 = 3/4."] }
      ],
      refreshers:{
        "Sample spaces and probability":"List the outcomes in each event. “And” means in both lists; “or” means in at least one.",
        "Standard deck":"52 cards: 4 suits (♥ ♦ red, ♣ ♠ black) of 13 ranks. Face cards are J, Q, K: 12 in all.",
        "Complements":"`P(A′) = 1 - P(A)`. “At least one” is often easiest as 1 − `P`(none)."
      }
    }
  },
  explore:{
    heading:"Overlap detector",
    intro:"Choose two events. Watch where their outcomes land, then decide whether you can just add.",
    predIntro:"Make a prediction first. Then the overlap detector will show you what really happens.",
    chalIntro:"Use the overlap detector to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    predictions:[
      { id:"p1", start:{ mode:"deck", a:"heart", b:"face" },
        prompt:"Deck: `A` = heart, `B` = face card. What is `P`(heart or face card)?",
        options:[{ t:"11/26", ok:true }, { t:"25/52" }, { t:"3/52" }, { t:"1/2" }],
        explain:"13 + 12 − 3 = 22 cards: 22/52 = 11/26." },
      { id:"p2", start:{ mode:"deck", a:"king", b:"queen" },
        prompt:"Deck: `A` = king, `B` = queen. Are “king” and “queen” mutually exclusive?",
        options:[{ t:"Yes: no card is both", ok:true }, { t:"No: both are face cards" }, { t:"No: they come in the same suits" }, { t:"You can’t tell" }],
        explain:"Being alike doesn’t create an overlap; sharing an outcome does." },
      { id:"p3", start:{ mode:"tiles", a:"even", b:"m5" },
        prompt:"Tiles 1–30: `A` = even, `B` = multiple of 5. How many tiles are even <strong>or</strong> a multiple of 5?",
        options:[{ t:"18", ok:true }, { t:"21" }, { t:"3" }, { t:"15" }],
        explain:"15 + 6 − 3 = 18. 21 double-counts 10, 20, 30; 3 is only the overlap." },
      { id:"p4", start:{ mode:"tiles", a:"prime", b:"sq" },
        prompt:"Tiles 1–30: `A` = prime. What is `P`(not prime)?",
        options:[{ t:"2/3", ok:true }, { t:"1/3" }, { t:"−2/3" }, { t:"3" }],
        explain:"10 primes, so 1 − 10/30 = 20/30." }
    ],
    challenges:[
      { id:"tc1", goal:1, prompt:"Tiles: choose two <strong>mutually exclusive</strong> events whose union has probability <strong>greater than 1/2</strong>.",
        why:"No tile is in both events, so `P(A ∪ B) = P(A) + P(B)`: Even/Odd gives 30/30 and Greater than 20/Less than 8 gives 17/30, both more than 1/2.",
        hints:["First find pairs with no tile in common.", "Only three pairs share nothing: Even/Odd, Prime/Perfect square, Greater than 20/Less than 8.", "Even/Odd covers all 30; Greater than 20/Less than 8 covers 17."] },
      { id:"tc2", goal:3, prompt:"Tiles: `A` = prime, `B` = greater than 20. Enter `n(A ∩ B)`, then `P(A ∪ B)`.",
        why:"23 and 29 are in both events: 10 + 10 − 2 = 18 tiles, so `P(A ∪ B)` = 18/30 = 3/5.",
        hints:["Which primes are greater than 20?", "23 and 29.", "10 + 10 − 2 = 18: 18/30 = 3/5."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Survey mode: 40 students; 22 play a sport, 15 play an instrument, 9 do neither. Fill all four regions.",
        why:"40 − 9 = 31 students are in the union, so both = 22 + 15 − 31 = 6. Then sport only 16, instrument only 9, neither 9.",
        hints:["How many do at least one?", "40 − 9 = 31.", "22 + 15 − both = 31, so both = 6."] }
    ],
    // explorer messages (plan §4 Explore: named wrong states and the formula check)
    msg:{
      tc1PrimeSq:"Mutually exclusive, but 10 + 5 = 15 is exactly half, not more.",
      tc1EvenM5:"They overlap at 10, 20 and 30.",
      tc2Zero:"23 and 29 are prime and greater than 20.",
      tc2Add:"That adds without subtracting the overlap.",
      tc3Neg:"22 + 15 − 40 forgets the 9 who do neither: only 31 are in the union.",
      tc3Zero:"Then the union would be 37, but it’s 31.",
      tc3Sport:"22 includes the students who do both."
    },
    survey:{ total:40, a:22, b:15, given:"neither", g:9, nameA:"plays a sport", nameB:"plays an instrument", short:["Sport", "Instrument"] }
  },
  part3:{
    slug:"additive", name:"Or problems",
    heading:"Counting “or” problems",
    intro:"These stations count outcomes, not probabilities. Split a count into cases that can’t overlap and add them, or add and then subtract the double count. Check each result by listing a small version.",
    st1:{ title:"Station 1: same-group pairs", text:"Co-leaders must come from the same grade. Grade 11: A, B, C. Grade 12: D, E, F, G. How many pairs?",
      done:"The cases can’t overlap, so 3 + 6 = 9." },
    st2:{ title:"Station 2: starts with or ends with", text:"Three-digit codes (digits 0–9, repeats allowed) that start with 7 or end with 7.",
      list:"Check it by listing: two-digit codes from the digits 1–3 that start with 1 or end with 1 are 11, 12, 13, 21, 31, so 3 + 3 − 1 = 5." },
    st3:{ title:"Station 3: divisible by one or the other", text:"Numbers 1–100 divisible by 2 or by 5." },
    quickCheck:{
      title:"Quick check", summary:"Counting “or” problems quick check",
      items:[
        { id:"q1", goal:4, prompt:"How many numbers from 1 to 50 are divisible by 3 or by 4?",
          choices:[{ t:"24", ok:true }, { t:"28" }, { t:"4" }, { t:"26" }],
          right:"Right. 16 + 12 − 4 (multiples of 12) = 24.", wrong:"16 + 12 − 4 (multiples of 12) = 24." },
        { id:"q2", goal:4, prompt:"Two co-captains from the same group: 4 juniors or 3 seniors.",
          choices:[{ t:"9", ok:true }, { t:"12" }, { t:"18" }, { t:"7" }],
          right:"Right. Junior pairs 6, senior pairs 3: 6 + 3.", wrong:"Junior pairs 6, senior pairs 3: 6 + 3." },
        { id:"q3", goal:4, prompt:"Two-digit numbers (10–99) that start with 5 or end with 5.",
          choices:[{ t:"18", ok:true }, { t:"19" }, { t:"1" }, { t:"20" }],
          right:"Right. 10 + 9 − 1 (55).", wrong:"10 + 9 − 1 (55)." },
        { id:"q4", goal:1, prompt:"For the numbers 1–10, are “prime” and “even” mutually exclusive?",
          choices:[{ t:"No: 2 is both", ok:true }, { t:"Yes: primes are odd" }, { t:"Yes: different events" }, { t:"You can’t tell" }],
          right:"Right. 2 is prime and even.", wrong:"2 is prime and even." }
      ]
    }
  },
  practice:{
    activities:[
      { id:"mesort", type:"sorter", title:"Mutually exclusive or not?", summary:"Mutually exclusive or not?", goal:1, noun:"pair", txt:true,
        instruction:"Decide whether the two events can happen together.",
        how:"Tap a pair of events, then tap the box it belongs in.",
        boxes:[{ id:"me", label:"Mutually exclusive", sub:"no outcome is in both" }, { id:"not", label:"Not mutually exclusive", sub:"some outcome is in both" }],
        items:[
          { id:"i1", t:"Die: “even” and “odd”", answer:"me", why:"No number is both.", wrong:{ not:"No number is both." }, hints:ME_HINTS("None exists.") },
          { id:"i2", t:"Die: “even” and “greater than 3”", answer:"not", why:"4 and 6 are both.", wrong:{ me:"4 and 6 are both." }, hints:ME_HINTS("4 (or 6) is in both.") },
          { id:"i3", t:"Card: “heart” and “spade”", answer:"me", why:"One card has one suit.", wrong:{ not:"One card has one suit." }, hints:ME_HINTS("None exists.") },
          { id:"i4", t:"Card: “heart” and “king”", answer:"not", why:"The king of hearts.", wrong:{ me:"The king of hearts." }, hints:ME_HINTS("The king of hearts.") },
          { id:"i5", t:"Card: “face card” and “ace”", answer:"me", why:"Aces aren’t face cards.", wrong:{ not:"Aces aren’t face cards." }, hints:ME_HINTS("None exists.") },
          { id:"i6", t:"Two coins: “two heads” and “at least one tail”", answer:"me", why:"HH has no tail.", wrong:{ not:"HH has no tail." }, hints:ME_HINTS("None exists.") },
          { id:"i7", t:"Two coins: “at least one head” and “at least one tail”", answer:"not", why:"HT and TH are both.", wrong:{ me:"HT and TH are both." }, hints:ME_HINTS("HT (or TH).") },
          { id:"i8", t:"A student: “in Grade 12” and “takes MDM4U”", answer:"not", why:"Many Grade 12 students take MDM4U.", wrong:{ me:"Many Grade 12 students take MDM4U." }, hints:ME_HINTS("Any Grade 12 student who takes MDM4U.") },
          { id:"i9", t:"Two dice: “sum is 7” and “doubles”", answer:"me", why:"Doubles have even sums.", wrong:{ not:"Doubles have even sums." }, hints:ME_HINTS("None exists.") },
          { id:"i10", t:"Two dice: “sum is 8” and “doubles”", answer:"not", why:"(4, 4).", wrong:{ me:"(4, 4)." }, hints:ME_HINTS("(4, 4).") }
        ] },
      { id:"orprob", type:"numeric", title:"“Or” problems", summary:"“Or” problems", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Add when the events can’t overlap; subtract the overlap once when they can. Some problems run backwards.",
        how:"Type a fraction such as 3/4 or a decimal such as 0.75, then press Check.",
        items:[
          { id:"s1", goal:3, prompt:"One card: `P`(red or ace)", answer:7 / 13, tol:5e-5, display:"7/13",
            why:"26 + 4 − 2 = 28 cards: 28/52 = 7/13.",
            wrong:[{ match:15 / 26, fb:"The 2 red aces are counted twice: 26 + 4 − 2 = 28." }],
            hints:["How many cards are red? How many are aces?", "26 red cards and 4 aces; the 2 red aces are in both.", "26 + 4 − 2 = 28: 28/52 = 7/13."] },
          { id:"s2", goal:2, prompt:"One card: `P`(club or diamond)", answer:0.5, tol:5e-5, display:"1/2",
            why:"Mutually exclusive: 13 + 13 = 26 of 52.",
            general:"Mutually exclusive: 13 + 13 = 26 of 52.",
            hints:["Can one card be a club and a diamond?", "No: nothing to subtract, so just add.", "13 + 13 = 26 of 52: 1/2."] },
          { id:"s3", goal:4, star:true, prompt:"Numbers 1–60 divisible by 4 or 6", answer:20, display:"20",
            why:"15 + 10 − 5 = 20: the multiples of 12 are in both lists.",
            wrong:[{ match:25, fb:"Multiples of both are multiples of 12, not 24: 15 + 10 − 5." }, { match:23, fb:"Multiples of both are multiples of 12, not 24: 15 + 10 − 5." }],
            hints:["Which numbers are multiples of both 4 and 6?", "Multiples of 12.", "15 + 10 − 5 = 20."] },
          { id:"s4", goal:6, star:true, prompt:"`P(A) = 0.5`, `P(B) = 0.4`, `P(A or B) = 0.7`. Find `P(A and B)`.", answer:0.2, tol:5e-5, display:"0.2",
            why:"0.5 + 0.4 − 0.7 = 0.2.",
            wrong:[{ match:0.9, fb:"Work backwards: 0.5 + 0.4 − overlap = 0.7." }],
            hints:["Write the formula: `P(A or B) = P(A) + P(B) - P(A and B)`.", "0.7 = 0.5 + 0.4 − overlap.", "Overlap = 0.9 − 0.7 = 0.2."] },
          { id:"s5", goal:6, star:true, prompt:"`P(A) = 0.6` and `P(B) = 0.7`. What is the <strong>smallest</strong> possible `P(A and B)`?", answer:0.3, tol:5e-5, display:"0.3",
            why:"`P(A ∪ B)` = 1.3 − overlap can’t be more than 1, so the overlap is at least 0.3.",
            wrong:[{ match:0, fb:"They can’t be mutually exclusive: 0.6 + 0.7 > 1. `P(A ∪ B) ≤ 1`, so the overlap is at least 0.3." }],
            hints:["Can the union be bigger than 1?", "`P(A ∪ B)` = 1.3 − overlap ≤ 1.", "Overlap ≥ 0.3."] },
          { id:"s6", goal:5, star:true, prompt:"A class of 30: 18 take French, 14 take Spanish, 5 take both. How many take neither?", answer:3, display:"3",
            why:"18 + 14 − 5 = 27 take at least one, leaving 3.",
            wrong:[{ match:0, fb:"18 + 14 − 5 = 27 take at least one, leaving 3." }],
            hints:["How many take at least one language?", "18 + 14 − 5 = 27.", "30 − 27 = 3."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Cassius", how:"", goal:[2, 3, 6],
        instruction:"Cassius made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"One card is drawn. Find `P`(heart or king).",
            steps:["`P`(heart) = 13/52.", "`P`(king) = 4/52.", "`P`(heart or king) = 13/52 + 4/52 = 17/52.", "So the probability is about 0.33."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"The king of hearts is counted twice: 13/52 + 4/52 − 1/52 = 16/52 = 4/13.", ok:true, why:M1 },
              { t:"Multiply: 13/52 × 4/52.", why:"Nothing is multiplied for “or”: add the two events, then subtract the card that is in both once." },
              { t:"Use only 1/52, the king of hearts.", why:M4 },
              { t:"Step 3 is correct.", why:"One card is both a heart and a king." }],
            hints:["Is any card both a heart and a king?", "K♥.", "16/52 = 4/13."] },
          { id:"e2", goal:6, task:"50 people: 30 like hockey, 25 like soccer, 10 like both. How many like neither?",
            steps:["People who like at least one: 30 + 25 = 55.", "55 is more than 50, so the survey must be wrong."],
            answer:0,
            stepFb:["", "Step 2 follows step 1. Look earlier."],
            fixes:[
              { t:"30 + 25 − 10 = 45 like at least one, so 50 − 45 = 5 like neither.", ok:true, why:"The 10 who like both were counted twice, so subtract them once: 45 in the union, 5 neither." },
              { t:"50 − 10 = 40 like neither.", why:"10 is the overlap, not the union." },
              { t:"0 like neither.", why:M7 },
              { t:"Step 1 is correct.", why:"The 10 who like both were counted twice." }],
            hints:["Who did 30 + 25 count twice?", "The 10 who like both.", "45 in the union; 5 neither."] },
          { id:"e3", goal:2, task:"`A` and `B` are mutually exclusive, `P(A) = 0.3`, `P(B) = 0.5`. Find `P(A or B)`.",
            steps:["Mutually exclusive means `A` and `B` can’t happen together.", "So `P(A or B)` = 0.3 + 0.5 − 0.3 × 0.5.", "= 0.8 − 0.15 = 0.65."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "The arithmetic follows step 2."],
            fixes:[
              { t:"The overlap is 0, so `P(A or B)` = 0.3 + 0.5 = 0.8.", ok:true, why:M2 },
              { t:"Use 0.3 × 0.5 = 0.15.", why:M2 },
              { t:"Use 0.5 − 0.3 = 0.2.", why:"Subtracting events isn’t “or”." },
              { t:"Step 2 is correct.", why:"0.3 × 0.5 is the overlap only for independent events; here the overlap is 0." }],
            hints:["What is `P(A and B)` for mutually exclusive events?", "0.", "0.3 + 0.5 = 0.8."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which overlap surprised you most in Explore: the heart face cards, the multiples of 10, or the two large primes?" },
      { id:"j2", q:"In your own words, why do we subtract the overlap only once?" },
      { id:"j3", q:"Explain to a friend how to tell whether two events are mutually exclusive." },
      { id:"j4", q:"Which kind of “or” problem still feels risky? What will you draw before you calculate?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"One card is drawn. Which pair of events is mutually exclusive?", options:[
          { t:"Drawing a club and drawing a red card", ok:true, why:"Clubs are black." },
          { t:"Drawing a king and drawing a heart", why:"The king of hearts is both." },
          { t:"Drawing a face card and drawing a black card", why:"Black face cards exist." },
          { t:"Drawing an ace and drawing a spade", why:"The ace of spades." }] },
        b:{ prompt:"One die is rolled. Which pair of events is mutually exclusive?", options:[
          { t:"Rolling a 1 and rolling an even number", ok:true, why:"1 is odd, so no roll is both." },
          { t:"Rolling an even number and rolling a number greater than 4", why:"6 is both." },
          { t:"Rolling an odd number and rolling a prime", why:"3 and 5 are both." },
          { t:"Rolling a number less than 3 and rolling a 2", why:"2 is both." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A bag holds 4 blue, 3 yellow and 5 purple marbles. One is drawn. What is `P`(blue or yellow)?", options:[
          { t:"7/12", ok:true, why:"Mutually exclusive: 4/12 + 3/12." },
          { t:"0", why:"That’s `P`(blue <strong>and</strong> yellow)." },
          { t:"1/12", why:"4/12 × 3/12 multiplies, but “or” adds." },
          { t:"5/12", why:"That’s purple, the complement." }] },
        b:{ prompt:"A bag holds 4 blue, 2 yellow and 3 purple marbles. What is `P`(yellow or purple)?", options:[
          { t:"5/9", ok:true, why:"2/9 + 3/9." },
          { t:"0", why:"That’s `P`(yellow <strong>and</strong> purple). " + M4 },
          { t:"2/27", why:"2/9 × 3/9 multiplies." },
          { t:"4/9", why:"That’s blue, the complement." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"`P`(rain tomorrow) = 0.35. What is `P`(no rain tomorrow)?", options:[
          { t:"0.65", ok:true, why:"1 − 0.35." },
          { t:"−0.65", why:"That’s 0.35 − 1. " + M5 },
          { t:"2.86", why:"1 ÷ 0.35 isn’t a complement." },
          { t:"0.35", why:"That’s rain." }] },
        b:{ prompt:"`P`(the bus is late) = 0.12. What is `P`(the bus is not late)?", options:[
          { t:"0.88", ok:true, why:"1 − 0.12." },
          { t:"−0.88", why:"That’s 0.12 − 1. " + M5 },
          { t:"8.33", why:"1 ÷ 0.12 isn’t a complement. " + M5 },
          { t:"0.12", why:"That’s late." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A tile is drawn from tiles numbered 1–30. What is `P`(multiple of 3 or multiple of 5)?", options:[
          { t:"7/15", ok:true, why:"10 + 6 − 2 (15 and 30) = 14 of 30." },
          { t:"8/15", why:"16/30 counts 15 and 30 twice." },
          { t:"1/15", why:"2/30 is only the overlap." },
          { t:"2/5", why:"12/30 subtracts the overlap twice." }] },
        b:{ prompt:"Tiles 1–30. What is `P`(even or multiple of 3)?", options:[
          { t:"2/3", ok:true, why:"15 + 10 − 5 (6, 12, 18, 24, 30) = 20 of 30." },
          { t:"5/6", why:"25/30 counts 6, 12, 18, 24 and 30 twice." },
          { t:"1/6", why:"5/30 is only the overlap." },
          { t:"1/2", why:"15/30 subtracts the overlap twice." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"`P(A) = 0.45`, `P(B) = 0.30` and `P(A or B) = 0.60`. Find `P(A and B)`.", options:[
          { t:"0.15", ok:true, why:"0.45 + 0.30 − 0.60." },
          { t:"0.75", why:"That’s the sum, not the overlap." },
          { t:"0.135", why:"0.45 × 0.30 assumes independence." },
          { t:"0", why:"If the overlap were 0, the union would be 0.75." }] },
        b:{ prompt:"`P(A) = 0.5`, `P(B) = 0.35` and `P(A or B) = 0.65`. Find `P(A and B)`.", options:[
          { t:"0.2", ok:true, why:"0.5 + 0.35 − 0.65." },
          { t:"0.85", why:"That’s the sum, not the overlap." },
          { t:"0.175", why:"0.5 × 0.35 assumes independence." },
          { t:"0", why:"If the overlap were 0, the union would be 0.85." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"How many integers from 1 to 100 are divisible by 4 or by 6?", options:[
          { t:"33", ok:true, why:"25 + 16 − 8: numbers divisible by both are multiples of 12." },
          { t:"41", why:"25 + 16 counts the multiples of 12 twice." },
          { t:"8", why:"That’s only the overlap." },
          { t:"37", why:"Multiples of both 4 and 6 are multiples of 12, not 24." }] },
        b:{ prompt:"How many integers from 1 to 120 are divisible by 6 or by 9?", options:[
          { t:"27", ok:true, why:"20 + 13 − 6: the overlap is multiples of 18." },
          { t:"33", why:"20 + 13 counts the multiples of 18 twice." },
          { t:"6", why:"That’s only the overlap." },
          { t:"31", why:"The overlap is multiples of 18, not 54." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `P`(king or heart) ≠ 4/52 + 13/52?", options:[
          { t:"The king of hearts is in both events, so adding counts it twice. Subtract 1/52: the answer is 16/52.", ok:true, why:"It names the outcome in both events and subtracts it once." },
          { t:"Because kings are more likely than hearts.", why:"4 kings vs 13 hearts; likelihood isn’t the issue." },
          { t:"Because you should multiply for “or”.", why:"Nothing is multiplied for “or”. The king of hearts is in both events, so it’s counted twice." },
          { t:"It does equal 17/52; the events are different.", why:"A heart and a king sound different, but the king of hearts is both." }] },
        b:{ prompt:"Which best explains why `P`(two heads or at least one tail) for two coins equals `P`(two heads) + `P`(at least one tail)?", options:[
          { t:"No outcome is in both events (HH has no tail), so nothing is double counted: 1/4 + 3/4 = 1.", ok:true, why:"The events are mutually exclusive, so adding is enough." },
          { t:"Because coins are independent.", why:"Independence is about “and”, not overlap." },
          { t:"Because you always add for “or”.", why:"Only when the events don’t overlap." },
          { t:"Because both events have probability 1/2.", why:"They’re 1/4 and 3/4." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which description of a Venn diagram explains `n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`?", options:[
          { t:"Adding the two circles counts the overlapping region twice, so subtract it once.", ok:true, why:"The overlap sits inside both circles, so it’s in both counts." },
          { t:"Adding the circles misses the overlap, so subtract it.", why:"Adding includes the overlap twice, not zero times." },
          { t:"The overlap is subtracted because it’s outside both circles.", why:"The overlap is inside both." },
          { t:"Subtract the overlap twice, once for each circle.", why:"The overlap was counted twice, so subtract it <strong>once</strong>." }] },
        b:{ prompt:"Which statement correctly describes mutually exclusive events in a Venn diagram?", options:[
          { t:"The circles don’t overlap: `A ∩ B` is empty, so `n(A ∪ B) = n(A) + n(B)`.", ok:true, why:"No region is shared, so nothing is counted twice." },
          { t:"The circles overlap completely.", why:"That would make the events the same." },
          { t:"One circle is inside the other.", why:"Then every `A` outcome would also be in `B`." },
          { t:"The circles overlap, but you ignore the overlap.", why:"Ignoring a shared region counts its outcomes twice." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Model survey of 120 students: 70 play a team sport, 45 play an instrument, 20 do both. How many do neither?", options:[
          { t:"25", ok:true, why:"120 − (70 + 45 − 20) = 120 − 95." },
          { t:"5", why:"120 − 115 counts the 20 twice." },
          { t:"45", why:"120 − 75 leaves out the 20 who do both." },
          { t:"0", why:"Not everyone is in a group." }] },
        b:{ prompt:"Model survey of 150 students: 80 read fiction, 60 read non-fiction, 25 read both. How many read neither?", options:[
          { t:"35", ok:true, why:"150 − (80 + 60 − 25)." },
          { t:"10", why:"150 − 140 counts the 25 twice." },
          { t:"60", why:"150 − 90 leaves out the 25 who read both." },
          { t:"0", why:"Not everyone is in a group." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A forecast gives `P`(rain Saturday) = 0.4, `P`(rain Sunday) = 0.5 and `P`(rain both days) = 0.2. What is `P`(no rain all weekend)?", options:[
          { t:"0.3", ok:true, why:"1 − (0.4 + 0.5 − 0.2) = 1 − 0.7." },
          { t:"0.1", why:"1 − 0.9 counts “both days” twice." },
          { t:"0.8", why:"1 − 0.2 treats “both” as “at least one”." },
          { t:"0.7", why:"That’s rain on at least one day." }] },
        b:{ prompt:"A store gives `P`(shoes on sale) = 0.3, `P`(jackets on sale) = 0.25 and `P`(both) = 0.1. What is `P`(neither on sale)?", options:[
          { t:"0.55", ok:true, why:"1 − (0.3 + 0.25 − 0.1) = 1 − 0.45." },
          { t:"0.45", why:"That’s at least one on sale." },
          { t:"0.9", why:"1 − 0.1 treats “both” as “at least one”." },
          { t:"0.35", why:"1 − 0.65 counts “both” twice." }] } }
    ]
  },
  task:{
    title:"Two events, one overlap", summary:"Two events, one overlap",
    statement:"<p>A tile is drawn from tiles numbered 1–30. Design event `A` = “a multiple of `k`” and event `B` = “greater than `m`” so that every condition holds. Can you find all the answers?</p>" +
      '<ol class="me-conds"><li>Exactly 2 tiles are in both `A` and `B`.</li><li>`P(A or B) = 1/2`.</li><li>`B` is at least twice as likely as `A`.</li></ol>',
    checks:["Exactly 2 in both", "`P(A or B) = 1/2`", "`B` at least twice as likely"],
    tips:["The overlap is the multiples of `k` above `m`. Move `m` until exactly two are left.", "Use the additive principle: `n(A) + n(B) - 2` must be 15.", "Large `k` makes `A` small, which helps condition 3."],
    explainPrompt:"Explain how you used the additive principle to hit exactly half the tiles.",
    vocab:"Use the words union, intersection, overlap and mutually exclusive.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"Conditions 1 and 2 force `n(A) + n(B) = 17`. Condition 3 then needs `n(A)` small, which is why `k` = 4 fails."
  },
  cards:[
    ["Mutually exclusive", "Can’t happen together: `A ∩ B = ∅`."],
    ["“Or” for mutually exclusive events", "`P(A or B) = P(A) + P(B)`."],
    ["“Or” for overlapping events", "`P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`."],
    ["Why subtract?", "Adding counts the overlap twice; subtract it once."],
    ["Additive counting principle", "`n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`."],
    ["Complement", "`P(A′) = 1 - P(A)`."],
    ["Neither", "`P`(neither) = 1 − `P(A ∪ B)`."],
    ["Working backwards", "`P(A ∩ B) = P(A) + P(B) - P(A ∪ B)`."],
    ["Heart and king", "Not mutually exclusive: K♥ is both."],
    ["Multiples of 4 or 6", "Overlap = multiples of 12 (the lowest common multiple), not 24."],
    ["Mutually exclusive ≠ independent", "Mutually exclusive events with non-zero probabilities affect each other: if one happens, the other can’t."],
    ["Probabilities over 1?", "If `P(A) + P(B) > 1`, the events must overlap."]
  ]
};
