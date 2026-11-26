// MDM4U 15 Combinations & Probability. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/15-combinations-probability.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item where the plan names only the code.
const M3 = "‘At least one’ = 1 − " + P("none") + ".";
const M4 = "At least one includes 2, 3, … as well.";
const M5 = "Count the top and bottom the same way: both ordered or both unordered.";

export default {
  id:"15-combinations-probability",
  kind:"topic",
  title:"Combinations and probability",
  topic:"Combinations & Probability",
  readyTopic:"combinations and probability",
  hero:{
    eq:'<span class="cp-heq"><span class="cp-hhand" aria-hidden="true"><span class="cp-hcard">7<b>♥</b></span><span class="cp-hcard">Q<b>♥</b></span><span class="cp-hhl">a hand of 2 hearts</span></span>' +
      '<span class="cp-hmain">' + P("event") + " = <i>C</i>(favourable) ÷ <i>C</i>(total)</span>" +
      '<span class="cp-hex">`C(13, 2) ÷ C(52, 2) = 78/1326 = 1/17`</span></span>',
    eqLabel:"P of an event equals C of the favourable selections divided by C of all selections. For a dealt hand of 2 hearts: C of 13, 2 divided by C of 52, 2 equals 78 over 1326, which is 1 over 17.",
    eqSize:"sm",
    headline:"Count the good hands, count all the hands, divide",
    text:"When every hand, committee or draw is <strong>equally likely</strong>, probability is a counting problem. Count the <strong>favourable</strong> selections and <strong>all</strong> selections with <strong>combinations</strong>, then divide. For ‘at least one’, the <strong>complement</strong> is often faster.",
    fig:{ html:'<div class="cp-h" role="img" aria-label="A deck of 52 cards fans out and two cards are dealt face down. A counter shows possible hands: C(52, 2) = 1326. The 13 hearts lift out of the fan: hands with 2 hearts: C(13, 2) = 78. The fraction 78 over 1326 reduces to 1 over 17. Then a ghost fraction, one quarter squared = 1 over 16, appears and is crossed out with the note: the second card comes from 51.">' +
      '<svg class="cp-hsvg" id="cp-hsvg" viewBox="0 0 400 236" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can count the total number of equally likely selections with a combination.",
    "I can find the probability of an “exactly” event by multiplying combinations from each group.",
    "I can find “at least” and “at most” probabilities by cases or by the complement.",
    "I can explain why drawing without replacement differs from multiplying single-draw probabilities.",
    "I can find the probability that particular people or items are included in a random selection.",
    "I can apply these methods to quality control, lotteries and fair games, and explain why lotteries lose on average."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Basic probability", goal:1, prompt:"A bag has 3 red and 5 blue marbles. One marble is drawn. What is " + P("red") + "?",
          options:[
            { t:"`3/8`", ok:true, why:"3 favourable out of 8 equally likely." },
            { t:"`3/5`", why:"That’s red ÷ blue. Divide by the total, 8." },
            { t:"`1/2`", why:"There are two colours, but the colours aren’t equally likely." },
            { t:"`5/8`", why:"That’s " + P("blue") + "." }],
          hints:["Favourable ÷ total.", "3 red, 8 marbles.", "`3/8`."] },
        { id:"w2", skill:"Basic probability", goal:4, prompt:"A fair die is rolled twice. What is " + P("two sixes") + "?",
          options:[
            { t:"`1/36`", ok:true, why:"`1/6 × 1/6`: independent rolls." },
            { t:"`2/6`", why:"That adds. Both must happen: multiply." },
            { t:"`1/12`", why:"That’s `1/6 + 1/6`, halved. Both must happen: multiply." },
            { t:"`1/6`", why:"That’s one roll only. Both rolls must be sixes: multiply." }],
          hints:["Are the rolls independent?", "Yes: multiply.", "`1/36`."] },
        { id:"w3", skill:"Combinations", goal:1, prompt:"How many 3-person committees can be chosen from 9 people?",
          options:[
            { t:"84", ok:true, why:"`C(9, 3)` = 504 ÷ 6." },
            { t:"504", why:"That’s `P(9, 3)`, which orders the committee. Divide by `3! = 6`." },
            { t:"27", why:"That’s 9 × 3, which isn’t a counting rule." },
            { t:"729", why:"That’s `9^3`, which lets one person be chosen more than once." }],
          hints:["Order doesn’t matter.", "`C(9, 3) = (9 × 8 × 7)/3!`.", "84."] },
        { id:"w4", skill:"Combinations", goal:2, prompt:"In how many ways can 2 girls be chosen from 4 <strong>and</strong> 1 boy from 5?",
          options:[
            { t:"30", ok:true, why:"`C(4, 2) × C(5, 1)` = 6 × 5." },
            { t:"11", why:"That adds (6 + 5). Two stages: multiply." },
            { t:"84", why:"`C(9, 3)` ignores the condition: 2 girls <strong>and</strong> 1 boy." },
            { t:"60", why:"`P(4, 2) × 5` orders the girls." }],
          hints:["Two stages: multiply.", "`C(4, 2) = 6` and `C(5, 1) = 5`.", "30."] },
        { id:"w5", skill:"Complements", goal:3, prompt:"If " + P("no defective items") + " = 0.35, what is " + P("at least one defective item") + "?",
          options:[
            { t:"0.65", ok:true, why:"1 − 0.35." },
            { t:"0.35", why:"That’s " + P("none") + ". " + M3 },
            { t:"1.35", why:"That adds 1. Probabilities can’t exceed 1: subtract from 1." },
            { t:"0.5", why:"‘Either it happens or it doesn’t’ doesn’t make it 50–50. Use 1 − 0.35." }],
          hints:["‘At least one’ and ‘none’ cover everything.", "They add to 1.", "0.65."] },
        { id:"w6", skill:"Complements", goal:3, prompt:"Which event is the complement of ‘at least one head in 3 tosses’?",
          options:[
            { t:"No heads (all tails)", ok:true, why:"Everything that isn’t ‘at least one head’ has zero heads." },
            { t:"Exactly one head", why:M4 + " Exactly one head is part of the event, not its complement." },
            { t:"At least one tail", why:"HHT has at least one head <strong>and</strong> at least one tail." },
            { t:"Three heads", why:"Three heads is part of ‘at least one head’, not its complement." }],
          hints:["The complement is everything else.", "What’s left if there isn’t at least one head?", "Zero heads."] }
      ],
      refreshers:{
        "Basic probability":"With equally likely outcomes, <i>P</i> = favourable ÷ total. Independent events multiply.",
        "Combinations":"`C(n, r)` counts selections without order; from two groups, multiply the choices.",
        "Complements":"`P(A′) = 1 - P(A)`. ‘None’ is the complement of ‘at least one’."
      }
    }
  },
  explore:{
    heading:"Hand dealer",
    intro:"Choose what to draw from, describe the event, and compare the exact count with thousands of simulated deals.",
    predIntro:"Make a prediction first. Then the hand dealer will show you what really happens.",
    predictions:[
      { id:"p1", start:{ src:"group", a:4, b:5, names:"gb", r:3, who:"A", kind:"ex", k:3, mode:"count" },
        prompt:"Group: 4 girls and 5 boys; a committee of 3. What is " + P("all three are girls") + "?",
        options:[{ t:"`1/21`", ok:true }, { t:"`4/9`" }, { t:"`64/729`" }, { t:"`1/84`" }],
        explain:"4 all-girl committees out of 84: `C(4, 3) ÷ C(9, 3) = 4/84 = 1/21`. (`(4/9)^3 = 64/729` would put each girl back before the next pick.)" },
      { id:"p2", start:{ src:"group", a:4, b:5, names:"gb", r:3, who:"A", kind:"al", k:1, mode:"count" },
        prompt:"Same group; the event is “at least 1 girl”. Which is the fastest correct route?",
        options:[{ t:"1 − " + P("no girls"), ok:true }, { t:"Add " + P("1 girl") + " and " + P("2 girls") }, { t:P("1 girl") + " × 3" }, { t:"`4/9 × 3`" }],
        explain:"The complement needs one count; the cases need three. `1 - 10/84 = 74/84 = 37/42`, and the cases route `(40 + 30 + 4)/84` agrees." },
      { id:"p3", start:{ src:"deck", cat:"h", r:2, kind:"ex", k:2, mode:"sim" },
        prompt:"Deck; 2 cards; the event is “both hearts”. How does " + P("both hearts") + " compare with `1/4 × 1/4 = 1/16`?",
        options:[{ t:"It’s a little smaller: `1/17`", ok:true }, { t:"It’s exactly `1/16`" }, { t:"It’s larger" }, { t:"It’s `1/8`" }],
        explain:"After a heart is dealt, only 12 of the 51 cards left are hearts. `78/1326 = 1/17` ≈ 0.0588, and the simulated deals settle near 0.059, a little below `1/16 = 0.0625`." },
      { id:"p4", start:{ src:"deck", cat:"h", r:2, kind:"ex", k:2, mode:"order" },
        prompt:"Order check mode, same event. If you count ordered pairs of cards instead, will the probability change?",
        options:[{ t:"No, it’s the same", ok:true }, { t:"It doubles" }, { t:"It halves" }, { t:"It depends on which card comes first" }],
        explain:"Both counts doubled, so the fraction didn’t change: `P(13, 2) ÷ P(52, 2) = 156/2652 = 1/17`." }
    ],
    chalIntro:"Set up the hand dealer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Set up a bag of 10 marbles (red and blue) so that drawing 2 gives " + P("both red") + " = `1/3`.",
        why:"`C(6, 2) ÷ C(10, 2) = 15/45 = 1/3`: 6 red and 4 blue.",
        hints:["<i>P</i> = `C(red, 2) ÷ C(10, 2) = C(red, 2) ÷ 45`.", "You need `C(red, 2) = 15`.", "`C(6, 2) = 15`: 6 red, 4 blue."] },
      { id:"tc2", goal:[2, 3], prompt:"Group: 4 girls, 5 boys, committee of 3. Build an event whose probability is `5/14`.",
        why:"`C(4, 2) × C(5, 1) = 30` committees, and `30/84 = 5/14`. Exactly 2 girls is the same event as exactly 1 boy.",
        hints:["`5/14 = 30/84`.", "Which event has 30 committees?", "`C(4, 2) × C(5, 1) = 30`: exactly 2 girls."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Choose a group of 10 people (`g` girls and `b` boys) and a committee size of 3 so that " + P("at least one girl") + " = `5/6`.",
        why:"`1 - C(6, 3)/C(10, 3) = 1 - 20/120 = 5/6`: 4 girls and 6 boys.",
        hints:[P("at least one girl") + " = `1 - C(b, 3)/C(10, 3)`.", "You need `C(b, 3)/120 = 1/6`, so `C(b, 3) = 20`.", "`C(6, 3) = 20`: 6 boys, 4 girls."] }
    ]
  },
  part3:{
    slug:"lotteries", name:"Lotteries",
    heading:"Lotteries and fair games",
    intro:"Lotteries are the best-known use of combinations in probability. At each station, check a ticket and count the match cases, see how big a real lottery is, then compare what a ticket costs with what it pays back on average. A lottery here is a probability model, not advice: on average, players lose money.",
    stations:[
      { id:"s1", title:"A mini-lottery",
        problem:"A school fundraiser draws 3 numbers from 1 to 10. A ticket has 3 numbers.",
        task:"Build each match case with combinations: choose from your 3 numbers, then from the other 7.",
        sumNote:"The four cases total 120/120: every draw has 0, 1, 2 or 3 matches.",
        cases:[
          { m:3, lab:"All 3 match", v:1, p:"`1/120`" },
          { m:2, lab:"Exactly 2 match", v:21, p:"`C(3, 2) × C(7, 1)/120 = 21/120 = 7/40`" },
          { m:1, lab:"Exactly 1 matches", v:63, p:"`C(3, 1) × C(7, 2)/120 = 63/120 = 21/40`" },
          { m:0, lab:"None match", v:35, p:"`C(7, 3)/120 = 35/120 = 7/24`" }] },
      { id:"s2", title:"Scale",
        problem:"A 6-of-49 lottery: `C(49, 6)` = 13 983 816 possible tickets.",
        picture:"If every ticket were a 1 mm grain of rice in a row, the row would be about 14 km long, with one winning grain." },
      { id:"s3", title:"Is it fair?",
        problem:"A ticket costs $2. A prize of $100 is paid if all 3 numbers match (`1/120`).",
        payout:"The average payout per ticket is 100 × `1/120` ≈ $0.83, so on average a player loses about $1.17 per ticket.",
        more:"Buying 10 tickets for one draw raises the chance of winning to `10/120`, but the average loss is 10 times as large.",
        m6:"Each ticket loses money on average; more tickets just lose more.",
        why:"This is why lotteries raise money: the prizes are always set below the ticket price on average. Module 19 names this the <strong>expected value</strong>." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Lotteries quick check",
      items:[
        { id:"q1", goal:[1, 6], prompt:"Pick 3 numbers from 1–8; 3 are drawn. " + P("all match") + "?",
          choices:[
            { t:"`1/56`", ok:true, fb:"Right. `C(8, 3) = 56` equally likely draws, and one of them matches your ticket." },
            { t:"`3/8`", fb:"That’s 3 numbers out of 8. `C(8, 3) = 56` equally likely draws." },
            { t:"`1/336`", fb:"336 is `P(8, 3)`, which counts orders. `C(8, 3) = 56` equally likely draws." },
            { t:"`1/8`", fb:"That’s one number’s chance. `C(8, 3) = 56` equally likely draws." }] },
        { id:"q2", goal:[2, 6], prompt:"Pick 2 from 1–6; 2 are drawn. " + P("exactly one match") + "?",
          choices:[
            { t:"`8/15`", ok:true, fb:"Right. `C(2, 1) × C(4, 1)/C(6, 2) = 8/15`." },
            { t:"`1/15`", fb:"That’s both matching. `C(2, 1) × C(4, 1)/C(6, 2) = 8/15`." },
            { t:"`1/3`", fb:"`C(2, 1) × C(4, 1)/C(6, 2) = 8/15`." },
            { t:"`2/6`", fb:"That’s one number’s chance. `C(2, 1) × C(4, 1)/C(6, 2) = 8/15`." }] },
        { id:"q3", goal:6, prompt:"A game costs $1 and pays $10 with probability `1/20`. Is it fair?",
          choices:[
            { t:"No: average payout $0.50", ok:true, fb:"Right. 10 × `1/20` = $0.50 back per $1: an average loss of $0.50 a play." },
            { t:"Yes: you can win $10", fb:"Winning is possible but rare. 10 × `1/20` = $0.50 back per $1." },
            { t:"Yes: it costs only $1", fb:"A cheap game can still lose on average. 10 × `1/20` = $0.50 back per $1." },
            { t:"Can’t tell", fb:"Compare the average payout with the cost: 10 × `1/20` = $0.50 back per $1." }] },
        { id:"q4", goal:6, prompt:"Why doesn’t buying more tickets in one draw make a lottery worth it?",
          choices:[
            { t:"Each ticket loses money on average", ok:true, fb:"Right. More tickets: more chance, but a bigger average loss." },
            { t:"Tickets cancel each other", fb:"Different tickets don’t cancel. More tickets: more chance, but a bigger average loss." },
            { t:"The odds get worse", fb:"Each ticket’s chance stays the same. More tickets: more chance, but a bigger average loss." },
            { t:"It does make it worth it", fb:"More tickets: more chance, but a bigger average loss." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"setup", type:"match", title:"Set it up", summary:"Set it up", goal:[1, 2, 3, 5], shuffle:false,
        instruction:"Match each situation with the probability expression that answers it. Three expressions are left over.",
        leftTitle:"Situation", rightTitle:"Probability expression",
        left:[
          { id:"l1", goal:2, t:"3 chosen from 4 girls and 5 boys: all girls", why:"All 3 from the 4 girls: `C(4, 3)` of the `C(9, 3)` committees." },
          { id:"l2", goal:2, t:"3 chosen from 4 girls and 5 boys: exactly 2 girls", why:"2 of the 4 girls <strong>and</strong> 1 of the 5 boys: multiply." },
          { id:"l3", goal:3, t:"3 chosen from 4 girls and 5 boys: at least 1 girl", why:"Subtract the all-boy committees from 1: " + M3 },
          { id:"l4", goal:1, t:"2 cards: both hearts", why:"2 of the 13 hearts, out of all `C(52, 2)` hands." },
          { id:"l5", goal:2, t:"2 cards: one heart and one spade", why:"1 of the 13 hearts <strong>and</strong> 1 of the 13 spades." },
          { id:"l6", goal:3, t:"4 of 10 phones tested, 3 defective: none defective", why:"All 4 tested phones come from the 7 working ones." },
          { id:"l7", goal:5, t:"Team of 3 from 10 including both Ana and Ben", why:"Put Ana and Ben on the team, then choose 1 more from the other 8.",
            hints:["If Ana and Ben are both on it, how many spots are left?", "1 spot, from the other 8.", "`C(8, 1)/C(10, 3)`."] },
          { id:"l8", goal:1, t:"2 cards: no aces", why:"Both cards come from the 48 non-aces." }
        ],
        right:[   // a fixed, deliberately scrambled order (shuffle:false): no situation sits beside its own expression
          { id:"r7", t:"`{C(8, 1)}/{C(10, 3)}`" },
          { id:"r3", t:"`1 - {C(5, 3)}/{C(9, 3)}`" },
          { id:"r11", t:"`{C(26, 2)}/{C(52, 2)}`" },
          { id:"r8", t:"`{C(48, 2)}/{C(52, 2)}`" },
          { id:"r1", t:"`{C(4, 3)}/{C(9, 3)}`" },
          { id:"r10", t:"`{C(5, 3)}/{C(9, 3)}`" },
          { id:"r5", t:"`{C(13, 1) × C(13, 1)}/{C(52, 2)}`" },
          { id:"r6", t:"`{C(7, 4)}/{C(10, 4)}`" },
          { id:"r9", t:"`{C(4, 2)}/{C(9, 3)}`" },
          { id:"r4", t:"`{C(13, 2)}/{C(52, 2)}`" },
          { id:"r2", t:"`{C(4, 2) × C(5, 1)}/{C(9, 3)}`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r9":"The third member must be a boy: multiply by `C(5, 1)`.",
          "l3|r10":"That’s " + P("no girls") + "; subtract it from 1.",
          "l5|r11":"That allows two hearts or two spades."
        },
        wrongDefault:"Count the favourable selections group by group, then divide by all selections." },
      { id:"compute", type:"numeric", title:"Compute it", summary:"Compute it", goal:[2, 3, 4, 5, 6], star:true,
        instruction:"Find each probability. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a fraction in lowest terms such as 5/12 (an equivalent fraction is fine) or a decimal to 4 places, then press Check.",
        items:[
          { id:"r1", goal:2, prompt:"6 red and 4 blue; draw 3. " + P("exactly 2 red") + "?", answer:1 / 2, tol:5e-5, display:"`1/2`",
            why:"`C(6, 2) × C(4, 1) ÷ C(10, 3)` = 15 × 4 ÷ 120 = `60/120 = 1/2`.",
            wrong:[{ match:1 / 8, fb:"Choose the blue one too: × `C(4, 1)`." }] },
          { id:"r2", goal:3, prompt:"Same bag. " + P("no red") + "?", answer:1 / 30, tol:5e-5, display:"`1/30`",
            why:"All 3 from the 4 blue: `C(4, 3) ÷ C(10, 3) = 4/120 = 1/30`.",
            wrong:[{ match:4 / 10, fb:"`C(4, 3)/C(10, 3) = 4/120`." }] },
          { id:"r3", goal:3, star:true, prompt:"10 phones, 3 defective; 4 are tested. " + P("at least one defective") + "?", answer:5 / 6, tol:5e-5, display:"`5/6`",
            why:"`1 - C(7, 4)/C(10, 4) = 1 - 35/210 = 1 - 1/6 = 5/6`.",
            wrong:[{ match:1 / 6, fb:"That’s " + P("none") + "." }] },
          { id:"r4", goal:4, star:true, prompt:"2 cards are dealt. " + P("both face cards") + "?", answer:11 / 221, tol:5e-5, display:"`11/221`",
            why:"`C(12, 2) ÷ C(52, 2) = 66/1326 = 11/221` ≈ 0.0498.",
            wrong:[{ match:9 / 169, fb:"`(12/52)^2` treats the draws as independent." }] },
          { id:"r5", goal:3, star:true, prompt:"A committee of 4 is chosen from 5 women and 4 men. " + P("at least 2 women") + "?", answer:5 / 6, tol:5e-5, display:"`5/6`",
            why:"2, 3 or 4 women: 60 + 40 + 5 = 105 of the `C(9, 4)` = 126 committees, and `105/126 = 5/6`.",
            wrong:[{ match:10 / 21, fb:"That’s exactly 2 women: add exactly 3 and exactly 4." }],
            hints:["At least 2 women: 2, 3 or 4 women.", "60 + 40 + 5 = 105 committees.", "`105/126 = 5/6`."] },
          { id:"r6", goal:5, star:true, prompt:"A class of 12 includes twins. A committee of 4 is chosen at random. " + P("both twins are on it") + "?", answer:1 / 11, tol:5e-5, display:"`1/11`",
            why:"Put both twins on, then choose the other 2 from 10: `C(10, 2) ÷ C(12, 4) = 45/495 = 1/11`.",
            wrong:[{ match:1 / 9, fb:"`(4/12)^2` treats the twins as independent; count instead: `C(10, 2)/C(12, 4) = 45/495`." }],
            hints:["Put both twins on the committee.", "Choose the other 2 from 10: `C(10, 2) = 45`.", "`45/C(12, 4) = 45/495 = 1/11`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Odette", how:"", goal:[1, 2, 3],
        instruction:"Odette made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"2 cards are dealt from a standard deck. Find " + P("both hearts") + ".",
            steps:["Possible hands of 2: `C(52, 2)` = 1326.", "Hands with 2 hearts: 13 × 13 = 169.", "<i>P</i> = `169/1326`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"Hands with 2 hearts: `C(13, 2)` = 78, so <i>P</i> = `78/1326 = 1/17`.", ok:true, why:"Choose 2 of the 13 hearts: `C(13, 2)` = 78 hands, counted the same way as the 1326 below." },
              { t:"13 × 12 = 156, so <i>P</i> = `156/1326`.", why:"That counts ordered pairs on top but unordered hands below. " + M5 },
              { t:"<i>P</i> = `1/4 × 1/4`.", why:"After one heart is drawn, only 12 of 51 cards are hearts. Count combinations instead." },
              { t:"Step 2 is correct.", why:"13 × 13 isn’t a count of 2-heart hands: choose 2 of the 13 hearts." }],
            hints:["How many ways to choose 2 of the 13 hearts?", "`C(13, 2)`.", "`78/1326 = 1/17`."] },
          { id:"e2", goal:3, task:"A committee of 3 is chosen from 4 girls and 5 boys. Find " + P("at least one girl") + ".",
            steps:["All committees: `C(9, 3)` = 84.", "Committees with no girls: `C(5, 3)` = 10.", P("at least one girl") + " = `10/84 = 5/42`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"<i>P</i> = `1 - 10/84 = 74/84 = 37/42`.", ok:true, why:"10/84 is " + P("no girls") + ". " + M3 },
              { t:"<i>P</i> = `4/9`.", why:"That’s one random person being a girl." },
              { t:"<i>P</i> = `10/84` + 1.", why:"Probabilities can’t exceed 1." },
              { t:"Step 3 is correct.", why:"10/84 is " + P("no girls") + "." }],
            hints:["What does `10/84` measure?", "The committees with no girls.", "Subtract from 1."] },
          { id:"e3", goal:2, task:"A bag has 6 red and 4 blue marbles. 3 are drawn. Find " + P("exactly 2 red") + ".",
            steps:["Possible draws: `C(10, 3)` = 120.", "Ways to choose the 2 red: `C(6, 2)` = 15.", "<i>P</i> = `15/120 = 1/8`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"The third marble must be blue: 15 × `C(4, 1)` = 60, so <i>P</i> = `60/120 = 1/2`.", ok:true, why:"Choosing 2 red <strong>and</strong> 1 blue: multiply `C(6, 2)` by `C(4, 1)`." },
              { t:"<i>P</i> = `15/C(6, 3) = 15/20`.", why:"The bottom must count all draws from the whole bag." },
              { t:"<i>P</i> = `(6/10)^2` = 0.36.", why:"After one red marble is drawn, only 5 of the 9 left are red. Count combinations instead." },
              { t:"Step 3 is correct.", why:"15 counts only the red pair; each pair goes with 4 possible blues." }],
            hints:["What colour is the third marble?", "Blue: 4 choices.", "`60/120 = 1/2`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that two hearts is `1/17` rather than `1/16`, or how small a 6-of-49 lottery chance is?" },
      { id:"j2", q:"In your own words, why can you count either ordered or unordered selections, as long as you’re consistent?" },
      { id:"j3", q:"Explain to a friend how to find " + P("at least one") + " with the complement." },
      { id:"j4", q:"Which step do you skip most: choosing the ‘other’ items, or using the complement? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A committee of 3 is chosen at random from 9 people. How many equally likely committees are there?", options:[
          { t:"84", ok:true, why:"`C(9, 3)`." },
          { t:"504", why:"`P(9, 3)` counts ordered slates." },
          { t:"27", why:"9 × 3 isn’t a combination." },
          { t:"729", why:"`9^3` repeats people." }] },
        b:{ prompt:"2 cards are dealt from a standard deck. How many equally likely hands are there?", options:[
          { t:"1326", ok:true, why:"`C(52, 2)`." },
          { t:"2652", why:"`P(52, 2)` counts ordered pairs." },
          { t:"104", why:"52 × 2 isn’t a combination." },
          { t:"2704", why:"`52^2` repeats cards." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A committee of 3 is chosen at random from 4 girls and 5 boys. What is " + P("all three are girls") + "?", options:[
          { t:"`1/21`", ok:true, why:"`C(4, 3)/C(9, 3) = 4/84`." },
          { t:"`4/9`", why:"That’s one person being a girl." },
          { t:"`64/729`", why:"`(4/9)^3` puts each girl back." },
          { t:"`1/3`", why:"3 places out of 9 people isn’t this event." }] },
        b:{ prompt:"A committee of 3 is chosen at random from 5 girls and 4 boys. What is " + P("all three are girls") + "?", options:[
          { t:"`5/42`", ok:true, why:"`C(5, 3)/C(9, 3) = 10/84`." },
          { t:"`5/9`", why:"That’s one person being a girl." },
          { t:"`125/729`", why:"`(5/9)^3` puts each girl back." },
          { t:"`1/3`", why:"3 places out of 9 people isn’t this event." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is always true?", options:[
          { t:P("at least one") + " = 1 − " + P("none"), ok:true, why:"Every selection has none or at least one, so the two probabilities add to 1." },
          { t:P("at least one") + " = " + P("none") + " − 1", why:"That’s negative." },
          { t:P("at least one") + " = 1 + " + P("none"), why:"That’s more than 1." },
          { t:P("at least one") + " = " + P("exactly one"), why:M4 }] },
        b:{ prompt:"If " + P("no defective items") + " = `1/6`, what is " + P("at least one defective item") + "?", options:[
          { t:"`5/6`", ok:true, why:"`1 - 1/6 = 5/6`." },
          { t:"`1/6`", why:"That’s " + P("none") + ". " + M3 },
          { t:"`1/5`", why:"That’s `1/6 ÷ 5/6`." },
          { t:"`6/5`", why:"Probabilities can’t exceed 1." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A bag has 6 red and 4 blue marbles. 3 are drawn at random without replacement. What is " + P("exactly 2 red") + "?", options:[
          { t:"`1/2`", ok:true, why:"`C(6, 2) × C(4, 1)/C(10, 3) = 60/120`." },
          { t:"`1/8`", why:"Choose the blue marble too." },
          { t:"0.432", why:"That treats the draws as replaced." },
          { t:"`2/3`", why:"That’s 2 red out of 3 drawn, not a probability." }] },
        b:{ prompt:"A bag has 5 red and 5 blue marbles. 3 are drawn at random without replacement. What is " + P("exactly 2 red") + "?", options:[
          { t:"`5/12`", ok:true, why:"`C(5, 2) × C(5, 1)/C(10, 3) = 50/120`." },
          { t:"`1/12`", why:"Choose the blue marble too: × `C(5, 1)`." },
          { t:"0.375", why:"That treats the draws as replaced." },
          { t:"`2/3`", why:"That’s 2 red out of 3 drawn, not a probability." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A committee of 3 is chosen at random from 4 girls and 6 boys. What is " + P("at least one girl") + "?", options:[
          { t:"`5/6`", ok:true, why:"`1 - C(6, 3)/C(10, 3) = 1 - 20/120`." },
          { t:"`1/6`", why:"That’s " + P("no girls") + "." },
          { t:"`1/2`", why:"That’s exactly one girl: `60/120`." },
          { t:"`2/5`", why:"`4/10` is one person being a girl." }] },
        b:{ prompt:"A committee of 3 is chosen at random from 5 girls and 5 boys. What is " + P("at least one boy") + "?", options:[
          { t:"`11/12`", ok:true, why:"`1 - C(5, 3)/120 = 1 - 10/120`." },
          { t:"`1/12`", why:"That’s " + P("no boys") + ". " + M3 },
          { t:"`5/12`", why:"That’s exactly one boy: `50/120`." },
          { t:"`1/2`", why:"`5/10` is one person." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A class of 10 includes Ana and Ben. A team of 3 is chosen at random. What is " + P("both Ana and Ben are on the team") + "?", options:[
          { t:"`1/15`", ok:true, why:"Both in: choose 1 more from 8. `C(8, 1)/C(10, 3) = 8/120`." },
          { t:"`1/45`", why:"`1/C(10, 2)` treats the team as only 2 people." },
          { t:"`3/10`", why:"That’s one person’s chance." },
          { t:"`9/100`", why:"`(3/10)^2` treats their selections as independent." }] },
        b:{ prompt:"A class of 12 includes Cy and Di. A team of 4 is chosen at random. What is " + P("both are on the team") + "?", options:[
          { t:"`1/11`", ok:true, why:"`C(10, 2)/C(12, 4) = 45/495`." },
          { t:"`1/66`", why:"`1/C(12, 2)` treats the team as only 2 people." },
          { t:"`1/3`", why:"That’s one person’s chance: 4 places among 12 people." },
          { t:"`1/9`", why:"`(1/3)^2` treats their selections as independent." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why " + P("both hearts in 2 cards") + " is `1/17`, not `1/16`?", options:[
          { t:"The cards aren’t replaced: after one heart is dealt, 12 of the remaining 51 cards are hearts, so the second chance is `12/51`, not `13/52`.", ok:true, why:"It names the real reason: the second card comes from 51 cards, 12 of them hearts." },
          { t:"Because one card could be a joker.", why:"A standard deck has no jokers." },
          { t:"Because combinations always give smaller answers.", why:"That’s not a reason." },
          { t:"Because order matters for cards.", why:"Order doesn’t change the probability if counted consistently." }] },
        b:{ prompt:"Which is the best explanation of why counting ordered pairs gives the same probability as counting unordered hands?", options:[
          { t:"Both the favourable count and the total count are multiplied by the same factor, `2! = 2`, so the fraction is unchanged.", ok:true, why:"Each hand is 2 ordered pairs, on the top and on the bottom, so the factor cancels." },
          { t:"Because order never matters in probability.", why:"It matters for counts; it cancels in the ratio." },
          { t:"Because `P(n, r) = C(n, r)`.", why:"They differ by `r!`." },
          { t:"Because the deck is shuffled.", why:"Shuffling makes hands equally likely; it isn’t why the counts cancel." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which expression gives " + P("at least one red") + " when 3 marbles are drawn from 5 red and 5 blue?", options:[
          { t:"`1 - C(5, 3)/C(10, 3)`", ok:true, why:"Subtract the all-blue draws." },
          { t:"`C(5, 1)/C(10, 3)`", why:"That counts single reds, not draws." },
          { t:"`C(5, 1) × C(9, 2)/C(10, 3)`", why:"Guaranteeing one red double-counts." },
          { t:"`1 - C(5, 1)/C(10, 3)`", why:"`C(5, 1)` isn’t the number of all-blue draws. " + M3 + " Here " + P("none") + " = `C(5, 3)/C(10, 3)`." }] },
        b:{ prompt:"Which expression gives " + P("no aces") + " in a 2-card hand?", options:[
          { t:"`C(48, 2)/C(52, 2)`", ok:true, why:"Both cards come from the 48 non-aces." },
          { t:"`1 - C(4, 2)/C(52, 2)`", why:"That’s " + P("not both aces") + "." },
          { t:"`C(4, 0)/C(52, 2)`", why:"`C(4, 0) = 1` counts only the aces part." },
          { t:"`(48/52)^2`", why:"`(48/52)^2` treats the cards as replaced: after one non-ace is dealt, only 47 of the 51 cards left are non-aces." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A school fundraiser draws 3 numbers from 1 to 12. A ticket has 3 numbers. What is " + P("the ticket matches all 3") + "?", options:[
          { t:"`1/220`", ok:true, why:"`C(12, 3)` = 220 equally likely draws." },
          { t:"`3/12`", why:"That’s one number’s chance." },
          { t:"`1/1320`", why:"`P(12, 3)` counts orders, but the draw’s order doesn’t matter." },
          { t:"`1/12`", why:"That’s the chance of one particular number, not all three." }] },
        b:{ prompt:"A draw picks 2 numbers from 1 to 10. A ticket has 2 numbers. What is " + P("the ticket matches both") + "?", options:[
          { t:"`1/45`", ok:true, why:"`C(10, 2)` = 45." },
          { t:"`2/10`", why:"That’s one number’s chance." },
          { t:"`1/90`", why:"`P(10, 2)` counts orders, but the draw’s order doesn’t matter." },
          { t:"`1/10`", why:"That’s the chance of one particular number, not both." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A shipment of 10 phones contains 3 defective ones. An inspector tests 4 at random. What is " + P("exactly 1 defective") + "?", options:[
          { t:"`1/2`", ok:true, why:"`C(3, 1) × C(7, 3)/C(10, 4) = 105/210`." },
          { t:"`3/10`", why:"That’s one phone’s chance." },
          { t:"`1/6`", why:"That’s " + P("no defective") + "." },
          { t:"0.4116", why:"That treats the phones as replaced." }] },
        b:{ prompt:"A box of 12 bulbs contains 2 defective ones. 3 are tested at random. What is " + P("exactly 1 defective") + "?", options:[
          { t:"`9/22`", ok:true, why:"`C(2, 1) × C(10, 2)/C(12, 3) = 90/220`." },
          { t:"`1/6`", why:"`2/12` is one bulb’s chance." },
          { t:"`6/11`", why:"That’s " + P("no defective") + ": `120/220`." },
          { t:"`25/72`", why:"`3 × (1/6) × (5/6)^2` treats the bulbs as replaced." }] } }
    ]
  },
  task:{
    title:"Design a marble bag", summary:"Design a marble bag",
    statement:"<p>Fill a bag with red and blue marbles. Two marbles will be drawn at random without replacement. Meet every condition. Can you find all the answers?</p>" +
      '<ol class="cp-conds"><li>' + P("one of each colour") + " is at least `1/2`.</li><li>" + P("both red") + " is greater than " + P("both blue") + ".</li><li>Drawing two blue marbles is possible.</li><li>The bag holds at most 8 marbles.</li></ol>",
    checks:["One of each at least `1/2`", "Both red more likely than both blue", "Two blue is possible", "At most 8 marbles"],
    tips:["Mixed pairs are likeliest when the colours are close in number.", "More red than blue makes two red likelier than two blue.", "You need at least 2 blue.", "Keep the bag small: 8 or fewer."],
    explainPrompt:"Explain how you counted each probability with combinations, and why the bag needs slightly more red than blue.",
    vocab:"Use the words combination, favourable, total and without replacement.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"In every answer the bag has one or two more red than blue. With an even split (line 2 fails) or a lopsided bag such as 6 and 2 (line 1 fails), at least one condition breaks."
  },
  cards:[
    ["Equally likely selections", "<i>P</i> = <i>C</i>(favourable) ÷ <i>C</i>(total)."],
    ["Exactly 2 red of 3 (6 red, 4 blue)", "`C(6, 2) × C(4, 1) ÷ C(10, 3) = 1/2`."],
    ["At least one", "1 − " + P("none") + "."],
    ["At most one", P("none") + " + " + P("exactly one") + "."],
    ["Without replacement", "Count combinations; don’t multiply single-draw chances."],
    ["Two hearts in 2 cards", "`C(13, 2)/C(52, 2) = 1/17`."],
    ["Ordered vs unordered", "Either works if the top and bottom are counted the same way."],
    ["Particular people both chosen", "Put them in, then choose the rest from the others."],
    ["One person’s chance of selection", "`r/n` for `r` places among `n` people."],
    ["6-of-49 lottery", "1 chance in `C(49, 6)` = 13 983 816."],
    ["Is a game fair?", "Compare the average payout per play with the cost."],
    ["Lotteries", "Prizes are set so players lose money on average."]
  ]
};
