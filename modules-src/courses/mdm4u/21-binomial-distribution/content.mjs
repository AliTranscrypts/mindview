// MDM4U 21 The Binomial Distribution. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/21-binomial-distribution.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "`p^x q^{n - x}` is the chance of one particular order, like SSFF. There are `C(n, x)` orders, so multiply by it.";
const M2 = "Without replacement from a small group, each draw changes the next one’s probability. That’s not binomial.";
const M3 = "‘At least 1’ means 1, 2, 3, …. Its complement is `X = 0`, so use `1 - P(X = 0)`.";
const M6 = "`σ = √{npq}`. Multiplying `n` by 4 multiplies `σ` by `√4 = 2`, not 4.";
const BINS = "Run BINS: two outcomes? independent? fixed `n`? same `p`?";

export default {
  id:"21-binomial-distribution",
  kind:"topic",
  title:"The binomial distribution",
  topic:"The Binomial Distribution",
  readyTopic:"the binomial distribution",
  hero:{
    eq:'<span class="bn-heq"><span class="bn-hp">`P(X = x) =`</span><span class="bn-hp bn-hb"><span class="bn-hm">`C(n, x)`</span><span class="bn-hu">how many orders</span></span>' +
      '<span class="bn-hp">·</span><span class="bn-hp bn-hb"><span class="bn-hm">`p^x · q^{n - x}`</span><span class="bn-hu">one order</span></span></span>',
    eqLabel:"P of X equals x equals C of n, x, how many orders, times p to the x times q to the n minus x, one order.",
    eqSize:"sm",
    headline:"Count the orders, then multiply",
    text:"Toss a coin, take a free throw, test a light bulb: when the same independent <strong>trial</strong> is repeated a fixed number of times, the number of <strong>successes</strong> follows a <strong>binomial distribution</strong>. Its probabilities come from counting orders (<strong>combinations</strong>) and multiplying probabilities along one path.",
    fig:{ html:'<div class="bn-hfig" id="bn-hfig"></div>' }
  },
  goals:[
    "I can decide whether a situation is binomial by checking the four conditions.",
    "I can calculate binomial probabilities with `P(X = x) = C(n, x) p^x q^{n - x}`.",
    "I can calculate ‘at least’ and ‘at most’ probabilities, using the complement when it’s shorter.",
    "I can find and interpret `E(X) = np` and `σ = √{npq}`.",
    "I can describe how `n` and `p` change the shape, centre and spread of a binomial distribution.",
    "I can solve real-world problems with the binomial model and judge what a result means."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Combinations", goal:2, prompt:"Evaluate `C(5, 2)`.",
          options:[
            { t:"10", ok:true, why:"5 × 4 ÷ 2 = 10." },
            { t:"20", why:"Choosing 2 from 5 ignores order: divide by 2!." },
            { t:"32", why:"That’s the sum of all of row 5." },
            { t:"5", why:"That’s `C(5, 1)`." }],
          hints:["`C(n, r) = n! ÷ (r!(n - r)!)`.", "5! ÷ (2! 3!) = 120 ÷ 12.", "10."] },
        { id:"w2", skill:"Combinations", goal:2, prompt:"In how many different orders can 2 heads and 3 tails occur in 5 coin tosses?",
          options:[
            { t:"10", ok:true, why:"Choose which 2 of the 5 tosses are heads: `C(5, 2)`." },
            { t:"1", why:"THHTT is a different order." },
            { t:"5", why:"That counts orders with exactly 1 head." },
            { t:"32", why:"That’s every possible sequence of 5 tosses." }],
          hints:["Pick the positions of the heads.", "2 positions out of 5.", "`C(5, 2) = 10`."] },
        { id:"w3", skill:"Independent events", goal:2, prompt:"A fair coin is tossed and a fair die is rolled. What is " + P("head and 6") + "?",
          options:[
            { t:"`1/12`", ok:true, why:"Independent: `1/2 × 1/6`." },
            { t:"`2/3`", why:"‘And’ for independent events multiplies." },
            { t:"`1/6`", why:"The head must happen too." },
            { t:"`1/36`", why:"That treats the coin like a die." }],
          hints:["Are the events independent?", "Multiply the probabilities.", "`1/2 × 1/6 = 1/12`."] },
        { id:"w4", skill:"Independent events", goal:2, prompt:"A spinner lands on red with probability `1/4`. It’s spun 3 times. What is " + P("red, red, not red") + ", <strong>in that order</strong>?",
          options:[
            { t:"`3/64`", ok:true, why:"`1/4 × 1/4 × 3/4`." },
            { t:"`9/64`", why:"That’s all 3 orders with exactly two reds; this asks for one order." },
            { t:"`1/64`", why:"<i>P</i>(not red) = `3/4`." },
            { t:"`1/2`", why:"Multiply along the path." }],
          hints:["Multiply along one path.", "<i>P</i>(not red) = 1 − `1/4`.", "`(1/4)(1/4)(3/4) = 3/64`."] },
        { id:"w5", skill:"Expected value", goal:4, prompt:"`X` takes the values 0, 1, 2 with probabilities `1/4`, `1/2`, `1/4`. Find `E(X)`.",
          options:[
            { t:"1", ok:true, why:"`0(1/4) + 1(1/2) + 2(1/4) = 1`." },
            { t:"3", why:"Weight each value by its probability." },
            { t:"`1/3`", why:"`E(X)` is a weighted average of the values." },
            { t:"`1/2`", why:"That’s a probability, not a value of `X`." }],
          hints:["`E(X) = Σ x P(x)`.", "`0 + 1/2 + 2/4`.", "1."] },
        { id:"w6", skill:"Complements", goal:3, prompt:"A die is rolled twice. What is " + P("at least one 6") + "?",
          options:[
            { t:"`11/36`", ok:true, why:"`1 - (5/6)^2 = 1 - 25/36`." },
            { t:"`1/3`", why:"Adding `1/6 + 1/6` counts double sixes twice." },
            { t:"`25/36`", why:"`25/36` is the chance of <strong>no</strong> sixes." },
            { t:"`1/36`", why:"That’s both rolls being 6." }],
          hints:["What’s the opposite of ‘at least one 6’?", "No sixes: `(5/6)^2`.", "`1 - 25/36 = 11/36`."] }
      ],
      refreshers:{
        "Combinations":"`C(n, r)` counts ways to choose `r` things from `n` when order doesn’t matter: `n! ÷ (r!(n - r)!)`. It also counts the orders of `r` successes among `n` trials.",
        "Independent events":"If one event doesn’t change the other’s probability, " + P("<i>A</i> and <i>B</i>") + " = `P(A) × P(B)`. A path in a tree multiplies its branch probabilities.",
        "Expected value":"`E(X) = Σ x P(X = x)`: each value weighted by its probability. It’s a long-run average.",
        "Complements":P("at least one") + " = 1 − " + P("none") + ". It’s often far shorter than adding many cases."
      }
    }
  },
  explore:{
    heading:"Binomial board",
    intro:"Set the number of trials and the chance of success. Watch the distribution form. Tap a bar or select a range to see its probability.",
    predIntro:"Make a prediction first. Then the binomial board will show you what really happens.",
    predictions:[
      { id:"p1", start:{ view:"galton", n:4, p:"1/2" },
        prompt:"How many different paths lead to bin 2 (exactly 2 successes)?",
        options:[{ t:"6", ok:true }, { t:"4" }, { t:"2" }, { t:"16" }],
        explain:"Choose which 2 of the 4 pegs send the ball right: `C(4, 2) = 6`. So `P(X = 2) = 6 × (1/2)^4 = 6/16`." },
      { id:"p2", start:{ view:"hist", n:10, p:"0.5", to:"0.2" },
        prompt:"What happens to the shape?",
        options:[{ t:"It becomes skewed right, with the peak near 2", ok:true }, { t:"It becomes skewed left" }, { t:"It stays symmetric but moves to 2" }, { t:"It flattens out evenly" }],
        explain:"`E = 10 × 0.2 = 2`. Values below 0 are impossible, but values up to 10 aren’t, so the tail stretches right." },
      { id:"p3", start:{ view:"hist", n:10, p:"0.3", to:40 },
        prompt:"What happens to `σ`?",
        options:[{ t:"It doubles (to about 2.90)", ok:true }, { t:"It quadruples" }, { t:"It stays the same" }, { t:"It halves" }],
        explain:"`σ = √{npq}`. Multiplying `n` by 4 multiplies `σ` by `√4 = 2`." },
      { id:"p4", start:{ view:"hist", n:5, p:"1/2" },
        prompt:"What is the most likely number of heads in 5 tosses?",
        options:[{ t:"2 and 3, equally", ok:true }, { t:"2.5" }, { t:"5" }, { t:"All values are equally likely" }],
        explain:"`E(X) = 2.5` is the long-run average, but no single experiment can give 2.5 heads." }
    ],
    chalIntro:"Use the binomial board to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"Set `n` and `p` so that `E(X) = 6` and `σ = 2`.",
        why:"`np = 6` and `npq = 4` give `q = 4 ÷ 6 = 2/3`, so `p = 1/3` and `n = 6 ÷ (1/3) = 18`.",
        hints:["You need `np = 6` and `npq = 4`.", "Divide: `q = 4 ÷ 6 = 2/3`.", "`p = 1/3`, so `n = 6 ÷ (1/3) = 18`."] },
      { id:"tc2", goal:4, prompt:"With `n = 6`, choose `p` so that the most likely value is 4.",
        why:"The peak sits close to `E = np`. With `p` from 0.6 to 0.7 (or `2/3`), the single tallest bar is at 4.",
        hints:["The peak sits close to `E = np`.", "You want `np` near 4, so `p` near `4/6`.", "`p = 2/3` gives `E = 4` and a peak at 4; 0.6 to 0.7 also work."] },
      { id:"tc3", goal:3, stretch:true, prompt:"A basketball player makes `3/4` of her free throws. Using the board, find the <strong>smallest</strong> number of shots `n` for which " + P("at least one miss") + " is greater than 0.9.",
        why:P("at least one miss") + " = `1 - (3/4)^9 ≈ 0.9249`. With 8 shots it’s only about 0.8999.",
        hints:[P("at least one miss") + " = 1 − " + P("no misses") + ".", P("no misses") + " = `(3/4)^n`. You need it below 0.1.", "`(3/4)^8 ≈ 0.1001` and `(3/4)^9 ≈ 0.0751`, so `n = 9`."] }
    ]
  },
  part3:{
    slug:"is-it", name:"Is it binomial?",
    heading:"Is it binomial?",
    intro:"The formula only works when the situation is binomial. Run the BINS check on six scenarios, repair the ones that fail, then build the formula from a tree.",
    bins:[
      { id:"B", t:"<strong>B</strong>inary outcomes" },
      { id:"I", t:"<strong>I</strong>ndependent trials" },
      { id:"N", t:"<strong>N</strong>umber of trials fixed" },
      { id:"S", t:"<strong>S</strong>ame `p` each time" }
    ],
    cards:[
      { id:"c1", t:"Roll a die 10 times; `X` = number of 6s.", answer:[],
        right:"Binomial: `n = 10`, `p = 1/6`. Each roll is a 6 or not, the rolls don’t affect each other, there are exactly 10, and `p = 1/6` every time.",
        extra:"Each roll is a 6 or not, the rolls are independent, there are exactly 10 and `p = 1/6` every time. Nothing fails." },
      { id:"c2", t:"Draw 5 cards from a deck without replacement; `X` = number of hearts.", answer:["I", "S"],
        right:"Not binomial: without replacement each draw depends on the ones before, so `p` changes after every card. " + M2,
        none:"After a heart is drawn, fewer hearts remain, so `p` changes.",
        miss:{ I:"Does one draw affect the next? A heart that’s gone can’t be drawn again.", S:"After a heart is drawn, fewer hearts remain, so `p` changes." },
        extra:"Each card is a heart or not (binary), and there are exactly 5 draws (fixed `n`)." },
      { id:"c3", t:"Toss a coin until the first head; `X` = tails before it.", answer:["N"],
        right:"Not binomial: you toss until the first head, so the number of tosses isn’t fixed. That’s a waiting-time situation (module 22).",
        miss:{ N:"How many tosses will there be? You can’t tell in advance." },
        extra:"Each toss is a head or a tail, the tosses are independent and `p = 1/2` every time. Only one condition fails." },
      { id:"c4", t:"Survey 8 randomly chosen students at a school of 2000, where 30% bike to school; `X` = bikers.", answer:[],
        right:"Close enough: binomial with `n = 8`, `p = 0.3`. Removing 8 people from 2000 barely changes 30%.",
        extraBy:{ I:"Strictly, yes, but with 2000 students, removing 8 changes 30% only in the third decimal. We treat it as binomial. Module 23 shows when that’s not safe.",
          S:"Strictly, yes, but with 2000 students, removing 8 changes 30% only in the third decimal. We treat it as binomial. Module 23 shows when that’s not safe." },
        extra:"Each student bikes or doesn’t, and exactly 8 are surveyed." },
      { id:"c5", t:"Roll a die 6 times; `X` = sum of the rolls.", answer:["B"],
        right:"Not binomial: `X` is a sum of the numbers rolled, not a count of successes, even though `n = 6` is fixed.",
        miss:{ B:"What does `X` count? The sum of the numbers isn’t a number of successes." },
        extra:"The rolls are independent, there are exactly 6, and each roll’s chances stay the same. Only the ‘count of successes’ part fails." },
      { id:"c6", t:"A goalie faces 12 shots, but her save rate drops as she tires; `X` = saves.", answer:["S"],
        right:"Not binomial: her save rate drops as she tires, so `p` isn’t the same on every shot.",
        miss:{ S:"Her save rate drops as she tires. Is `p` the same on every shot?" },
        extra:"Each shot is a save or not, she faces exactly 12, and one shot’s result doesn’t decide the next. The problem is that `p` drifts down." }
    ],
    fixes:[
      { id:"c2", t:"Draw 5 cards from a deck without replacement; `X` = number of hearts.",
        options:[
          { t:"Replace each card before the next draw", ok:true, why:"Now every draw has `p = 13/52 = 1/4`, and the draws are independent: binomial with `n = 5`, `p = 1/4`." },
          { t:"Draw 6 cards instead", why:"Still without replacement: each draw still changes the next one’s probability." }] },
      { id:"c3", t:"Toss a coin until the first head; `X` = tails before it.",
        options:[
          { t:"Toss exactly 10 times", ok:true, why:"Now `n = 10` is fixed: the number of tails in 10 tosses is binomial with `p = 1/2`." },
          { t:"Toss until 2 heads", why:"Still no fixed number of tosses: you wait for the second head." }] },
      { id:"c6", t:"A goalie faces 12 shots, but her save rate drops as she tires; `X` = saves.",
        options:[
          { t:"Assume every save chance is 0.8", ok:true, why:"With the same `p = 0.8` on all 12 shots, `X` is binomial with `n = 12`, `p = 0.8`." },
          { t:"Count only the first 6 shots", why:"Her save rate still drops during those 6 shots, so `p` still changes." }] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Is it binomial? quick check",
      items:[
        { id:"q1", goal:1, prompt:"Drawing 3 marbles without replacement from a bag of 5 (2 red): which condition fails?",
          choices:[
            { t:"Independent trials", ok:true, fb:"Right. Removing a red marble changes the next draw’s chances." },
            { t:"Fixed number of trials", fb:"Removing a red marble changes the next draw’s chances." },
            { t:"Two outcomes", fb:"Removing a red marble changes the next draw’s chances." },
            { t:"None fails", fb:"Removing a red marble changes the next draw’s chances." }] },
        { id:"q2", goal:2, prompt:"`X` is binomial with `n = 4` and `p = 1/2`. `P(X = 2)`?",
          choices:[
            { t:"`3/8`", ok:true, fb:"Right. 6 orders × `1/16` = `6/16 = 3/8`." },
            { t:"`1/16`", fb:M1 + " 6 orders × `1/16`." },
            { t:"`1/4`", fb:"6 orders × `1/16`." },
            { t:"`1/2`", fb:"6 orders × `1/16`." }] },
        { id:"q3", goal:1, prompt:"Which is binomial?",
          choices:[
            { t:"Number of 3s in 12 rolls", ok:true, fb:"Right. Fixed `n`, independent rolls, success = 3, `p = 1/6`." },
            { t:"Rolls until a 3", fb:"Fixed `n`, independent rolls, success = 3, `p = 1/6`." },
            { t:"Sum of 12 rolls", fb:"Fixed `n`, independent rolls, success = 3, `p = 1/6`." },
            { t:"Number of aces in 5 cards dealt", fb:"Fixed `n`, independent rolls, success = 3, `p = 1/6`." }] },
        { id:"q4", goal:2, prompt:"How many orders give exactly 3 successes in 5 trials?",
          choices:[
            { t:"10", ok:true, fb:"Right. `C(5, 3) = 10`." },
            { t:"5", fb:"`C(5, 3) = 10`." },
            { t:"3", fb:"`C(5, 3) = 10`." },
            { t:"15", fb:"`C(5, 3) = 10`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"binornot", type:"sorter", title:"Binomial or not?", summary:"Binomial or not?", goal:1, noun:"scenario", txt:true,
        instruction:"Sort each scenario: is `X` binomial? If not, which kind of failure is it?",
        boxes:[
          { id:"b1", label:"Binomial" },
          { id:"b2", label:"Not binomial: trials depend on each other or `p` changes" },
          { id:"b3", label:"Not binomial: no fixed `n`, or `X` isn’t a count of successes" }],
        items:[
          { id:"i1", t:"15 multiple-choice questions, each with 4 options, all guessed; `X` = number correct", answer:"b1",
            why:"15 trials, each right or wrong, independent guesses, `p = 1/4` every time.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Binomial: 15 independent guesses, each right with `p = 1/4`."] },
          { id:"i2", t:"Choose 4 people from a club of 9 (5 girls) for a committee; `X` = girls", answer:"b2",
            why:"Choosing without replacement from a small club changes the chance of a girl after each pick.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Depend: once a girl is chosen, fewer girls remain, so `p` changes."] },
          { id:"i3", t:"Fire a ball at a target until it hits; `X` = misses", answer:"b3",
            why:"You keep firing until a hit, so the number of trials isn’t fixed.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "No fixed `n`: you fire until it hits."] },
          { id:"i4", t:"20 seeds from a large bag, each sprouting with probability 0.85; `X` = sprouts", answer:"b1",
            why:"20 seeds, each sprouts or not, independently, with `p = 0.85` each.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Binomial: `n = 20`, `p = 0.85`."] },
          { id:"i5", t:"Roll two dice 10 times; `X` = number of doubles", answer:"b1",
            why:"10 rolls of the pair, each a double or not, with `p = 6/36 = 1/6`.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Binomial: `n = 10`, `p = 1/6`."],
            wrong:{ b3:"There are exactly 10 rolls of the pair; a double has probability `6/36`." } },
          { id:"i6", t:"A student writes 5 tests and studies less after each pass; `X` = passes", answer:"b2",
            why:"Studying less after each pass changes the chance of passing the next test.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Depend: `p` changes as she studies less."] },
          { id:"i7", t:"Measure the heights of 10 students; `X` = mean height", answer:"b3",
            why:"A mean height isn’t a count of successes.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Not a count: `X` is a mean, not a number of successes."] },
          { id:"i8", t:"Deal 13 cards from a deck; `X` = spades", answer:"b2",
            why:"Dealing without replacement changes the deck after every card.",
            hints:["Is there a fixed number of trials?", "Does each trial change the next?", "Depend: each card dealt changes the deck."],
            wrong:{ b1:"Each card dealt changes the deck." } }
        ],
        wrongDefault:BINS },
      { id:"calc", type:"custom", title:"Calculate it", summary:"Calculate it", goal:[2, 3, 4, 6],
        instruction:"Find each probability or value. Items marked ★ are non-routine; B6 and B7 go beyond the Final Check.",
        how:"Type a fraction such as 3/8 or a decimal (4 places if it doesn’t end), then press Check.",
        items:[
          { id:"b1", goal:2, prompt:"`n = 3`, `p = 1/2`: find `P(X = 2)`.", answer:3 / 8, display:"`3/8`",
            why:"`C(3, 2)(1/2)^2(1/2) = 3 × 1/8 = 3/8`.",
            wrong:[{ match:1 / 8, fb:"That’s one order; there are 3." }] },
          { id:"b2", goal:2, prompt:"`n = 4`, `p = 1/3`: find `P(X = 1)`.", answer:32 / 81, display:"`32/81`",
            why:"`C(4, 1)(1/3)(2/3)^3 = 4 × 8/81 = 32/81`.",
            wrong:[{ match:8 / 81, fb:"That’s one order only, or the exponents swapped. Use 4 orders × `(1/3)(2/3)^3`." },
              { match:16 / 27, fb:"The failure exponent is `n - x = 3`." }] },
          { id:"b3", goal:3, prompt:"`n = 5`, `p = 1/2`: find `P(X ≥ 4)`.", answer:3 / 16, display:"`3/16`",
            why:"`P(4) + P(5) = 5/32 + 1/32 = 6/32 = 3/16`.",
            wrong:[{ match:5 / 32, fb:"Include `X = 5` as well." }] },
          { id:"b4", goal:3, star:true, prompt:"`n = 4`, `p = 1/4`: find " + P("at least 1") + ".", answer:175 / 256, display:"`175/256`",
            why:"`1 - (3/4)^4 = 1 - 81/256 = 175/256`.",
            wrong:[{ match:108 / 256, fb:M3 }, { match:81 / 256, fb:"That’s " + P("none") + "; subtract it from 1." }] },
          { id:"b5", goal:4, star:true, prompt:"`n = 50`, `p = 0.2`: find `E(X)` and `σ`.", answer:[10, 2 * Math.SQRT2], tol:[5e-5, 0.005],
            parts:["`E(X)` =", "`σ` ="], display:"`E(X) = 10`, `σ = 2√2 ≈ 2.83`",
            why:"`E(X) = 50 × 0.2 = 10`; `σ = √{50 × 0.2 × 0.8} = √8 = 2√2 ≈ 2.83`.",
            wrong:[{ part:1, match:8, fb:"Take the square root of `npq`." }] },
          { id:"b6", goal:6, star:true, prompt:"A binomial distribution has `E(X) = 12` and `σ = 3`. Find `n` and `p`.", answer:[48, 0.25],
            parts:["`n` =", "`p` ="], display:"`n = 48`, `p = 1/4`",
            why:"`q = npq ÷ np = 9 ÷ 12 = 3/4`, so `p = 1/4` and `n = 12 ÷ 1/4 = 48`.",
            wrong:[{ all:[24, 0.5], fb:"Then `σ = √6`. Use `q = npq ÷ np = 9 ÷ 12`." }],
            hints:["`np = 12` and `npq = 9`.", "`q = 9/12 = 3/4`.", "`p = 1/4`, `n = 12 ÷ 1/4 = 48`."] },
          { id:"b7", goal:6, star:true, prompt:"A 4-question quiz has 4 options per question. A student guesses all 4. What’s " + P("at least 3 correct") + "?", answer:13 / 256, display:"`13/256`",
            why:"`P(3) + P(4) = 12/256 + 1/256 = 13/256`.",
            wrong:[{ match:12 / 256, fb:"Add " + P("4 correct") + " = `1/256`." }],
            hints:["At least 3 means 3 or 4.", "`P(3) = C(4, 3)(1/4)^3(3/4) = 12/256`.", "`12/256 + 1/256 = 13/256`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Veda", how:"", goal:[2, 3, 4],
        instruction:"Veda made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find " + P("exactly 2 sixes in 4 rolls of a die") + ".",
            steps:["Binomial: `n = 4`, `p = 1/6`, `x = 2`.", "`P = (1/6)^2(5/6)^2`.", "`= 25/1296`."],
            answer:1,
            stepFb:["Step 1 sets it up correctly. Keep checking.", "", "Step 3 does the arithmetic of step 2 correctly. The mistake is earlier."],
            fixes:[
              { t:"Multiply by `C(4, 2) = 6`: `P = 150/1296 = 25/216`.", ok:true, why:M1 },
              { t:"Use `(1/6)^2(5/6)^4`.", why:"The exponents must add to `n = 4`." },
              { t:"Add instead: `2/6 + 10/6`.", why:"Probabilities along a path multiply." },
              { t:"Step 2 is correct.", why:"`(1/6)^2(5/6)^2` is one order, like 66XX. There are 6 orders." }],
            hints:["Is SSFF the only way to get 2 sixes?", "Count the orders: `C(4, 2)`.", "`6 × 25/1296 = 25/216`."] },
          { id:"e2", goal:3, task:"Find " + P("at least one head in 5 tosses") + ".",
            steps:["‘At least one’ means 1 or more heads.", "`P(X ≥ 1) = 1 - P(X = 1)`.", "`P(X = 1) = 5/32`.", "Answer: `27/32`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 computes `P(X = 1)` correctly, but it’s the wrong thing to subtract.", "Step 4 follows step 3."],
            fixes:[
              { t:"`P(X ≥ 1) = 1 - P(X = 0) = 1 - 1/32 = 31/32`.", ok:true, why:M3 },
              { t:"`P(X ≥ 1) = P(X = 1) = 5/32`.", why:M3 },
              { t:"`P(X ≥ 1) = 5 × 1/2`.", why:"Probabilities can’t exceed 1." },
              { t:"Step 2 is correct.", why:"The complement of ‘at least 1’ is ‘none’ (`X = 0`)." }],
            hints:["What’s the opposite of ‘at least one head’?", "No heads at all.", "`1 - (1/2)^5 = 31/32`."] },
          { id:"e3", goal:4, task:"Find the standard deviation of the number of heads in 100 tosses.",
            steps:["`n = 100`, `p = 0.5`, `q = 0.5`.", "`E(X) = np = 50`.", "Variance = `npq = 25`.", "So `σ = 25`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`σ = √25 = 5`.", ok:true, why:"`σ` is the square root of the variance: `√{npq} = √25 = 5`." },
              { t:"`σ = 50`.", why:"That’s the mean." },
              { t:"`σ = 25 ÷ 100`.", why:"Don’t divide by `n`." },
              { t:"Step 4 is correct.", why:"`σ` is the square root of the variance." }],
            hints:["How are variance and standard deviation related?", "`σ = √variance`.", "`√25 = 5`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the binomial board: the Galton paths, the skewed shapes, or how slowly `σ` grows with `n`?" },
      { id:"j2", q:"In your own words, explain what each part of `C(n, x) p^x q^{n - x}` counts." },
      { id:"j3", q:"Explain to a friend how to decide whether a situation is binomial." },
      { id:"j4", q:"Which kind of question still trips you up: ‘at least’, working backwards, or checking conditions? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which of these is required for `X` to have a binomial distribution?", options:[
          { t:"The probability of success is the same on every trial", ok:true, why:"One of the four conditions." },
          { t:"The number of successes is fixed in advance", why:"The number of <strong>trials</strong> is fixed; the number of successes is what `X` counts." },
          { t:"Success and failure are equally likely", why:"`p` can be any value from 0 to 1." },
          { t:"The trials continue until a success", why:"That’s a waiting-time (geometric) situation." }] },
        b:{ prompt:"Which experiment gives a binomial random variable?", options:[
          { t:"Roll a die 8 times; `X` = number of 1s", ok:true, why:"Fixed `n = 8`, independent rolls, `p = 1/6`." },
          { t:"Draw 4 cards without replacement; `X` = number of aces", why:"The draws depend on each other." },
          { t:"Roll a die until a 1 appears; `X` = number of rolls", why:"No fixed number of trials." },
          { t:"Roll a die 8 times; `X` = sum of the rolls", why:"`X` isn’t a count of successes." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`X` is binomial with `n = 4` and `p = 1/2`. Find `P(X = 3)`.", options:[
          { t:"`1/4`", ok:true, why:"`C(4, 3)(1/2)^4 = 4/16`." },
          { t:"`1/16`", why:"That’s one order; there are 4." },
          { t:"`3/8`", why:"That uses `C(4, 2) = 6`." },
          { t:"`3/4`", why:"That’s `x ÷ n`, not a probability." }] },
        b:{ prompt:"`X` is binomial with `n = 5` and `p = 1/3`. Find `P(X = 1)`.", options:[
          { t:"`80/243`", ok:true, why:"`C(5, 1)(1/3)(2/3)^4 = 5 × 16/243`." },
          { t:"`16/243`", why:"Multiply by the 5 orders." },
          { t:"`10/243`", why:"That’s `5(1/3)^4(2/3)`: the exponents are swapped." },
          { t:"`1/5`", why:"That’s `x ÷ n`." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`X` is binomial with `n = 25` and `p = 0.2`. Find `E(X)` and `σ`.", options:[
          { t:"`E = 5`, `σ = 2`", ok:true, why:"`np = 5`; `√{25 × 0.2 × 0.8} = √4`." },
          { t:"`E = 5`, `σ = 4`", why:"4 is the variance." },
          { t:"`E = 5`, `σ = √5`", why:"`σ` uses `npq`, not `np`." },
          { t:"`E = 20`, `σ = 2`", why:"`E = np` uses `p = 0.2`, not `q`." }] },
        b:{ prompt:"`X` is binomial with `n = 36` and `p = 0.5`. Find `E(X)` and `σ`.", options:[
          { t:"`E = 18`, `σ = 3`", ok:true, why:"`√{36 × 0.25} = √9`." },
          { t:"`E = 18`, `σ = 9`", why:"`σ = √{npq}`: 9 is the variance, `npq`." },
          { t:"`E = 18`, `σ = √18`", why:"Use `npq`." },
          { t:"`E = 18`, `σ = 6`", why:"That’s `√36`: `q` is missing." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A spinner lands on blue `1/3` of the time. It’s spun 4 times. What is " + P("at least one blue") + "?", options:[
          { t:"`65/81`", ok:true, why:"`1 - (2/3)^4 = 1 - 16/81`." },
          { t:"`32/81`", why:"That’s " + P("exactly one blue") + "." },
          { t:"`49/81`", why:"That’s 1 − " + P("exactly one") + "." },
          { t:"`16/81`", why:"That’s " + P("no blue") + "; subtract it from 1." }] },
        b:{ prompt:"A spinner lands on blue `1/3` of the time. It’s spun 3 times. What is " + P("at least one blue") + "?", options:[
          { t:"`19/27`", ok:true, why:"`1 - (2/3)^3 = 1 - 8/27`." },
          { t:"`4/9`", why:"That’s " + P("exactly one blue") + " = `12/27`." },
          { t:"`5/9`", why:"That’s 1 − " + P("exactly one") + "." },
          { t:"`8/27`", why:"That’s " + P("none") + "." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A binomial distribution has `E(X) = 8` and `σ = 2`. What are `n` and `p`?", options:[
          { t:"`n = 16`, `p = 1/2`", ok:true, why:"`npq = 4` and `np = 8` give `q = 1/2`." },
          { t:"`n = 32`, `p = 1/4`", why:"`E = 8`, but `σ = √6`." },
          { t:"`n = 10`, `p = 0.8`", why:"`E = 8`, but `σ = √1.6`." },
          { t:"`n = 64`, `p = 1/8`", why:"`E = 8`, but `σ = √7`." }] },
        b:{ prompt:"A binomial distribution has `E(X) = 9` and `σ = √6`. What are `n` and `p`?", options:[
          { t:"`n = 27`, `p = 1/3`", ok:true, why:"`q = 6 ÷ 9 = 2/3`." },
          { t:"`n = 18`, `p = 1/2`", why:"`σ` would be `√4.5`." },
          { t:"`n = 12`, `p = 3/4`", why:"`σ` would be 1.5." },
          { t:"`n = 81`, `p = 1/9`", why:"`σ` would be `√8`." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Distribution P is binomial with `n = 10`, `p = 0.2`; distribution Q is binomial with `n = 10`, `p = 0.8`. Which statement is true?", options:[
          { t:"Q is the mirror image of P: same `σ`, skewed the opposite way", ok:true, why:"`npq` is the same; P peaks at 2 and Q at 8." },
          { t:"Q has the larger `σ`", why:"`npq = 1.6` for both." },
          { t:"Both are symmetric", why:"Only `p = 1/2` gives symmetry." },
          { t:"P is skewed left", why:"P’s tail stretches right, toward 10." }] },
        b:{ prompt:"P is binomial with `n = 20`, `p = 0.5`; Q is binomial with `n = 80`, `p = 0.5`. How do their standard deviations compare?", options:[
          { t:"Q’s `σ` is twice P’s", ok:true, why:"`√{80/20} = 2`." },
          { t:"Q’s `σ` is four times P’s", why:M6 },
          { t:"They’re the same", why:"`n` changed, so `σ` changed." },
          { t:"Q’s `σ` is half of P’s", why:"More trials spread the counts out." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why " + P("exactly 2 heads in 4 tosses") + " = `6 × (1/2)^4`, not just `(1/2)^4`?", options:[
          { t:"“`(1/2)^4` is the probability of one particular order, such as HHTT. There are `C(4, 2) = 6` different orders with exactly 2 heads.”", ok:true, why:"Each order has probability `(1/2)^4`, and there are 6 of them." },
          { t:"“There are 6 outcomes in the sample space.”", why:"There are 16 outcomes." },
          { t:"“We multiply by 6 because 2 + 4 = 6.”", why:"The 6 counts orders, not a sum." },
          { t:"“The tosses are dependent, so we multiply by 6.”", why:"The tosses are independent." }] },
        b:{ prompt:"Which is the best explanation of the `C(n, x)` factor in the binomial formula?", options:[
          { t:"“It counts the different orders in which `x` successes can occur among `n` trials; each order has the same probability `p^x q^{n - x}`.”", ok:true, why:"Count the orders, then multiply by one order’s probability." },
          { t:"“It makes the probabilities add to `n`.”", why:"They add to 1." },
          { t:"“It’s the number of successes expected.”", why:"That’s `np`." },
          { t:"“It corrects for dependent trials.”", why:"Binomial trials are independent." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"A 20-question true/false test is answered entirely by guessing. `E(X) = 10`. Which statement is correct?", options:[
          { t:"“Over many students guessing, the average score would be about 10.”", ok:true, why:"`E(X)` is a long-run average." },
          { t:"“Every student who guesses scores exactly 10.”", why:"`E(X)` is a long-run average, not a guaranteed score: guessers’ scores vary." },
          { t:"“A score of 10 has probability `1/2`.”", why:"`P(X = 10)` is about 0.18." },
          { t:"“Scores above 10 are impossible.”", why:"Any score from 0 to 20 is possible." }] },
        b:{ prompt:"Boxes of 12 items each contain defective items with probability 0.2 per item, independently. `E(X) = 2.4`. Which statement is correct?", options:[
          { t:"“Over many boxes, the average number of defective items per box is about 2.4.”", ok:true, why:"`E(X)` is a long-run average." },
          { t:"“Every box contains 2 or 3 defective items.”", why:"`E(X)` is a long-run average: a box can hold anywhere from 0 to 12 defective items." },
          { t:"“A box can’t contain 2.4 items, so `E(X)` is wrong.”", why:"`E(X)` is a long-run average. It doesn’t have to be a possible value." },
          { t:"“2.4 is the most likely number of defective items.”", why:"The most likely value is 2." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Five independent smoke detectors in a building each work with probability 0.9. What is the probability that at least 4 of them work?", use:"`(0.9)^5 ≈ 0.590` and `(0.9)^4 ≈ 0.656`", options:[
          { t:"About 0.92", ok:true, why:"`P(5) + P(4) = 0.590 + 5(0.656)(0.1) = 0.590 + 0.328`." },
          { t:"About 0.59", why:"That’s only " + P("all 5 work") + "." },
          { t:"About 0.33", why:"That’s only " + P("exactly 4 work") + "." },
          { t:"About 0.66", why:"That uses `(0.9)^4(0.1)` without the factor `C(5, 4) = 5`." }] },
        b:{ prompt:"A drone has 4 independent rotors, each working with probability 0.9. It flies if at least 3 work. What is " + P("it flies") + "?", use:"`(0.9)^4 ≈ 0.656` and `(0.9)^3 ≈ 0.729`", options:[
          { t:"About 0.95", ok:true, why:"`0.656 + 4(0.729)(0.1) = 0.656 + 0.292`." },
          { t:"About 0.66", why:"That’s only " + P("all 4 work") + "." },
          { t:"About 0.29", why:"That’s only " + P("exactly 3 work") + "." },
          { t:"About 0.73", why:"That leaves out `C(4, 3) = 4`." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A seed company claims 80% of its seeds sprout. You plant 5 seeds and only 2 sprout. If the claim is true, `P(X <= 2) ≈ 0.058`. What is the best conclusion?", options:[
          { t:"“A result this low would be unusual if the claim were true, so it casts some doubt on the claim, though it could happen by chance.”", ok:true, why:"0.058 is small, but not zero: unusual, not impossible." },
          { t:"“The claim is proven false.”", why:"A probability of 0.058 is small, not zero." },
          { t:"“2 of 5 is 40%, so the true rate is exactly 40%.”", why:"Five seeds can’t pin the rate down exactly." },
          { t:"“`E(X) = 4`, so getting 2 is impossible.”", why:"`E(X)` is a long-run average, not the only possible result: 2 sprouts can happen." }] },
        b:{ prompt:"A player claims to make 90% of her free throws. She makes 6 of 10. If the claim is true, `P(X <= 6) ≈ 0.013`. What is the best conclusion?", options:[
          { t:"“Making 6 or fewer would be very unusual for a true 90% shooter, so the result gives evidence against the claim, though it isn’t proof.”", ok:true, why:"0.013 is very small: strong evidence, but not proof." },
          { t:"“The claim is proven false.”", why:"Unusual isn’t impossible." },
          { t:"“Her true rate is exactly 60%.”", why:"One set of 10 shots can’t fix the rate." },
          { t:"“`E(X) = 9`, so 6 is impossible.”", why:"`E(X)` is a long-run average, not the only possible result: 6 makes can happen." }] } }
    ]
  },
  task:{
    title:"Design a binomial distribution", summary:"Design a binomial distribution",
    statement:"<p>Choose `n` and `p` for a binomial distribution that meets every condition. Can you find all the answers?</p>" +
      '<ol class="bn-conds"><li>On average there are 3 to 6 successes, and `E(X)` is a whole number.</li><li>It isn’t too spread out: `σ < 2`.</li><li>It’s skewed right.</li><li>Zero successes are rare: `P(X = 0) < 0.03`.</li></ol>',
    checks:["Mean 3 to 6, whole number", "`σ < 2`", "Skewed right", "`P(X = 0) < 0.03`"],
    tips:["`E(X) = np`: try `n = 3 ÷ p`, `4 ÷ p`, … for your `p`.", "`σ^2 = npq` must be under 4.", "Skewed right needs `p` below `1/2`.", "`P(X = 0) = q^n` shrinks as `n` grows: you may need more trials."],
    explainPrompt:"Explain how you chose `n` and `p`, and why conditions 2 and 4 pull in opposite directions.",
    vocab:"Use the words expected value, standard deviation, skewed and complement.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each answer balances `q^n` (needs large `n`) against `npq` (needs small `n`).",
    afterAt:6
  },
  cards:[
    ["Binomial conditions (BINS)", "<strong>B</strong>inary outcomes, <strong>I</strong>ndependent trials, <strong>N</strong>umber of trials fixed, <strong>S</strong>ame `p` each trial."],
    ["`P(X = x)`", "`C(n, x) p^x q^{n - x}`, where `q = 1 - p`."],
    ["Why `C(n, x)`?", "It counts the orders of `x` successes among `n` trials."],
    ["`E(X)`", "`np`: e.g., 20 rolls, `p = 1/6`: about 3.3 sixes on average."],
    ["`σ`", "`√{npq}`: e.g., `n = 100`, `p = 0.5`: `σ = 5`."],
    ["At least one success", "`1 - q^n`."],
    ["Shape", "`p = 1/2` symmetric; `p < 1/2` skewed right; `p > 1/2` skewed left."],
    ["Effect of `n`", "Multiplying `n` by 4 doubles `σ` (`√4 = 2`)."],
    ["`E(X)` isn’t a guarantee", "`n = 5`, `p = 1/2`: `E = 2.5`, which can’t happen in one experiment."],
    ["Galton board", "Each peg is a trial; `C(n, x)` paths lead to bin `x`."],
    ["Not binomial", "Drawing without replacement from a small group (use the hypergeometric)."],
    ["Working backwards", "`q = npq ÷ np`, then `p = 1 - q` and `n = E ÷ p`."]
  ]
};
