// MDM4U 23 The Hypergeometric Distribution. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/23-hypergeometric-distribution.md
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "After a success is removed, fewer successes remain, so `p` changes on every draw. Use combinations.";
const M2 = "The other `r - x` items must be failures. Count those choices too.";
const M3 = "Use combinations top and bottom, so order is ignored everywhere.";
const M4 = "Each draw is a success with probability `a ÷ n`, and there are `r` draws: `ra ÷ n`.";
const M6 = "From 10 items it matters a lot; from 10 000 it barely matters.";

export default {
  id:"23-hypergeometric-distribution",
  kind:"topic",
  title:"The hypergeometric distribution",
  topic:"The Hypergeometric Distribution",
  readyTopic:"the hypergeometric distribution",
  hero:{
    eq:'<span class="hg-heq"><span class="hg-hp">`P(X = x) =`</span><span class="hg-hp hg-hb"><span class="hg-hm">`C(a, x)`</span><span class="hg-hu">successes chosen</span></span>' +
      '<span class="hg-hp">·</span><span class="hg-hp hg-hb"><span class="hg-hm">`C(n - a, r - x)`</span><span class="hg-hu">failures chosen</span></span>' +
      '<span class="hg-hp">÷</span><span class="hg-hp hg-hb"><span class="hg-hm">`C(n, r)`</span><span class="hg-hu">all selections</span></span></span>',
    eqLabel:"P of X equals x equals C of a, x, successes chosen, times C of n minus a, r minus x, failures chosen, divided by C of n, r, all selections.",
    eqSize:"sm",
    headline:"Once it’s drawn, it’s gone",
    text:"Deal cards, choose a committee, or pull a sample from a shipment: the items aren’t put back. Each draw changes the next, so the trials are <strong>dependent</strong>. Counting with <strong>combinations</strong> gives the <strong>hypergeometric distribution</strong>.",
    fig:{ html:'<div class="hg-hfig" id="hg-hfig"></div>' }
  },
  goals:[
    "I can recognize a hypergeometric situation: a fixed number of draws without replacement from a finite group with two types.",
    "I can calculate `P(X = x)` with combinations: successes chosen × failures chosen ÷ all selections.",
    "I can find and interpret `E(X) = ra ÷ n`.",
    "I can build the distribution table and probability histogram, including the smallest and largest possible values of `X`.",
    "I can compare the hypergeometric and binomial models and explain when the binomial is a good approximation.",
    "I can solve quality-control and committee problems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Combinations", goal:2, prompt:"Evaluate `C(6, 2)`.",
          options:[
            { t:"15", ok:true, why:"6 × 5 ÷ 2." },
            { t:"30", why:"That counts order. Divide by 2!." },
            { t:"12", why:"That’s 6 × 2." },
            { t:"36", why:"That’s 6²." }],
          hints:["`n! ÷ (r!(n - r)!)`.", "720 ÷ (2 × 24).", "15."] },
        { id:"w2", skill:"Combinations", goal:4, prompt:"Evaluate `C(5, 0)`.",
          options:[
            { t:"1", ok:true, why:"There’s exactly one way to choose nothing." },
            { t:"0", why:"Choosing nothing is one way, not zero ways." },
            { t:"5", why:"That’s `C(5, 1)`." },
            { t:"Undefined", why:"0! = 1, so it’s defined." }],
          hints:["How many ways can you choose no items?", "One: take none.", "1."] },
        { id:"w3", skill:"Probability with combinations", goal:2, prompt:"Two people are chosen at random from 4 girls and 3 boys. What is <i>P</i>(both girls)?",
          options:[
            { t:"`2/7`", ok:true, why:"`C(4, 2) ÷ C(7, 2) = 6/21`." },
            { t:"`16/49`", why:"That draws with replacement. The same girl can’t be chosen twice." },
            { t:"`4/7`", why:"That’s one girl." },
            { t:"`1/2`", why:"Girls aren’t half of the group." }],
          hints:["Ways to choose 2 girls?", "`C(4, 2) = 6`, out of `C(7, 2) = 21`.", "`2/7`."] },
        { id:"w4", skill:"Dependent events", goal:1, prompt:"Two cards are drawn without replacement. What is <i>P</i>(both are hearts)?",
          options:[
            { t:"`1/17`", ok:true, why:"`13/52 × 12/51`." },
            { t:"`1/16`", why:"That’s with replacement." },
            { t:"`1/2`", why:"Hearts are a quarter of the deck." },
            { t:"`25/102`", why:"That adds. ‘And’ multiplies along the path." }],
          hints:["After a heart is drawn, how many are left?", "12 of 51.", "`(13/52)(12/51) = 1/17`."] },
        { id:"w5", skill:"Expected value", goal:3, prompt:"`X` takes the values 0, 1, 2 with probabilities `1/6`, `2/3`, `1/6`. Find `E(X)`.",
          options:[
            { t:"1", ok:true, why:"`0 + 2/3 + 2/6`." },
            { t:"3", why:"That adds the values. Weight each value by its probability." },
            { t:"`2/3`", why:"That’s a probability." },
            { t:"`1/3`", why:"That averages the probabilities. Weight each value by its probability." }],
          hints:["`Σ x P(x)`.", "`1(2/3) + 2(1/6)`.", "1."] },
        { id:"w6", skill:"Probability with combinations", goal:6, prompt:"How many committees of 3 can be formed from 5 teachers and 4 students with exactly 1 student?",
          options:[
            { t:"40", ok:true, why:"`C(4, 1) × C(5, 2) = 4 × 10`." },
            { t:"4", why:"That forgets the teachers: choose 2 of the 5 teachers too." },
            { t:"10", why:"That forgets the student." },
            { t:"84", why:"That’s every committee of 3." }],
          hints:["Choose the student, then the teachers.", "`4 × C(5, 2)`.", "40."] }
      ],
      refreshers:{
        "Combinations":"`C(n, r)` counts unordered selections; `C(n, 0) = C(n, n) = 1`.",
        "Probability with combinations":"<i>P</i> = (ways to choose a favourable group) ÷ (ways to choose any group).",
        "Dependent events":"Without replacement, each draw’s probability depends on what was drawn before.",
        "Expected value":"`E(X) = Σ x P(X = x)`."
      }
    }
  },
  explore:{
    heading:"Draw without replacement",
    intro:"Fill the urn, choose how many to draw, and watch the distribution. Then switch on the binomial overlay to see when replacement matters.",
    predIntro:"Make a prediction first. Then the urn and its histogram will show you what really happens.",
    predictions:[
      { id:"p1", start:{ n:10, a:4, r:3, overlay:true, k:2 },
        prompt:"With replacement (binomial), `P(X = 2) = 0.288`. Without replacement it will be…",
        options:[{ t:"slightly larger (0.300)", ok:true }, { t:"much smaller" }, { t:"exactly the same" }, { t:"0" }],
        explain:"`36/120 = 0.3`. Without replacement, the outcomes cluster more tightly around the mean of 1.2. " + M1 },
      { id:"p2", start:{ n:8, a:3, r:5 },
        prompt:"What is the largest possible value of `X`?",
        options:[{ t:"3", ok:true }, { t:"5" }, { t:"8" }, { t:"2" }],
        explain:"There are only 3 successes to draw." },
      { id:"p3", start:{ n:8, a:3, r:6 },
        prompt:"What is the smallest possible value of `X`?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"3" }, { t:"6" }],
        explain:"There are only 5 failures, so 6 draws must include at least 1 success." },
      { id:"p4", start:{ n:10, a:4, r:3, overlay:true, k:2, to:100 },
        prompt:"With 1000 items (400 successes), how do the hypergeometric and binomial compare?",
        options:[{ t:"They’re almost identical", ok:true }, { t:"The gap gets bigger" }, { t:"The hypergeometric becomes uniform" }, { t:"The mean changes" }],
        explain:"Taking 3 items from 1000 barely changes the proportion 0.4. " + M6 }
    ],
    chalIntro:"Use the urn and its histogram to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"With `r = 4` draws, set `n` and `a` so that `E(X) = 2`.",
        why:"`E(X) = ra ÷ n = 4a ÷ n = 2` whenever `a ÷ n = 1/2`: any even `n` with `a = n ÷ 2`.",
        hints:["`E(X) = ra ÷ n`.", "`4a ÷ n = 2`, so `a ÷ n = 1/2`.", "For example, `n = 10` and `a = 5`."] },
      { id:"tc2", goal:2, prompt:"With `n = 10` and `r = 3`, choose `a` so that `P(X = 0) = 1/6`.",
        why:"`C(6, 3) ÷ C(10, 3) = 20/120 = 1/6`, so `a = 4`.",
        hints:["`X = 0` means all 3 drawn are failures: `C(10 - a, 3) ÷ 120`.", "You need `C(10 - a, 3) = 20`.", "`C(6, 3) = 20`, so `10 - a = 6` and `a = 4`."] },
      { id:"tc3", goal:[2, 6], stretch:true, prompt:"A box of 12 bulbs contains some defective ones. You test 3 at random. Find the <strong>smallest</strong> number of defective bulbs `a` for which <i>P</i>(at least one defective found) is at least `3/4`.",
        why:"With `a = 5`: `1 - C(7, 3) ÷ C(12, 3) = 1 - 35/220 = 185/220 ≈ 0.841`. With `a = 4` it’s only about 0.745.",
        hints:["At least one = 1 − <i>P</i>(none) = `1 - C(12 - a, 3) ÷ 220`.", "You need `C(12 - a, 3) <= 55`.", "`C(8, 3) = 56` is just too big; `C(7, 3) = 35` works, so `a = 5`."] }
    ]
  },
  part3:{
    slug:"quality", name:"Quality control",
    heading:"Quality control",
    intro:"A buyer can’t test every item in a shipment, so they test a random sample and decide. Work through three stations: build the probability, loosen the rule, then check the model against the binomial.",
    s1:{ scenario:"A shipment of 20 tablets has 3 defective ones. The buyer tests 4 at random and accepts the shipment if none is defective.",
      use:"`C(17, 4) = 2380` and `C(20, 4) = 4845`",
      fair:{ prompt:"Is this plan fair to the seller?",
        choices:[{ t:"No", ok:true, fb:"Right. A shipment with only 3 bad tablets is rejected about half the time." },
          { t:"Yes", fb:"<i>P</i>(accept) ≈ 0.491: a shipment with only 3 bad tablets is rejected about half the time." }] } },
    s2:{ scenario:"Same shipment, but the buyer now accepts if <strong>at most 1</strong> tablet is defective.",
      use:"`C(17, 4) = 2380`, `C(17, 3) = 680` and `C(20, 4) = 4845`" },
    s3:{ scenario:"For a big shipment (2000 items, 300 defective, test 4), compare the exact hypergeometric chance of finding no defective items with the binomial shortcut.",
      takeaway:"When `r` is tiny compared with `n`, the binomial with `p = a ÷ n` is a good shortcut. " + M6 },
    quickCheck:{
      title:"Quick check", summary:"Quality control quick check",
      items:[
        { id:"q1", goal:2, prompt:"`n = 6`, `a = 2`, `r = 2`. `P(X = 2)`?",
          choices:[
            { t:"`1/15`", ok:true, fb:"Right. `C(2, 2) ÷ C(6, 2) = 1/15`." },
            { t:"`1/9`", fb:"`C(2, 2) ÷ C(6, 2)`. `1/9` is with replacement." },
            { t:"`2/6`", fb:"`C(2, 2) ÷ C(6, 2)`." },
            { t:"`1/3`", fb:"`C(2, 2) ÷ C(6, 2)`." }] },
        { id:"q2", goal:3, prompt:"`n = 20`, `a = 5`, `r = 4`. `E(X)`?",
          choices:[
            { t:"1", ok:true, fb:"Right. 4 × 5 ÷ 20 = 1." },
            { t:"20", fb:"4 × 5 ÷ 20. " + M4 },
            { t:"`5/4`", fb:"4 × 5 ÷ 20. " + M4 },
            { t:"`4/5`", fb:"4 × 5 ÷ 20. " + M4 }] },
        { id:"q3", goal:5, prompt:"When is the binomial a good approximation?",
          choices:[
            { t:"Sample tiny compared with the group", ok:true, fb:"Right. " + M6 },
            { t:"Group tiny", fb:M6 },
            { t:"Always", fb:M6 },
            { t:"Never", fb:M6 }] },
        { id:"q4", goal:4, prompt:"`n = 7`, `a = 2`, `r = 4`. Largest possible `X`?",
          choices:[
            { t:"2", ok:true, fb:"Right. Only 2 successes exist." },
            { t:"4", fb:"Only 2 successes exist." },
            { t:"7", fb:"Only 2 successes exist." },
            { t:"3", fb:"Only 2 successes exist." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"hgorbin", type:"sorter", title:"Hypergeometric or binomial?", summary:"Hypergeometric or binomial?", goal:[1, 5], noun:"scenario", txt:true,
        instruction:"Sort each scenario: which model fits `X`?",
        boxes:[
          { id:"h1", label:"Hypergeometric" },
          { id:"h2", label:"Binomial" },
          { id:"h3", label:"Binomial is a fine approximation", sub:"without replacement, but from a huge group" }],
        items:[
          { id:"i1", t:"Deal 5 cards; `X` = number of kings", answer:"h1",
            why:"Dealing doesn’t put cards back, and 52 cards is a small group: each card changes the next.",
            hints:["Is there replacement?", "If not, is the group huge?", "No replacement, and only 52 cards: hypergeometric."] },
          { id:"i2", t:"Roll a die 5 times; `X` = number of 6s", answer:"h2",
            why:"Rolls are independent with `p = 1/6` every time.",
            hints:["Is there replacement?", "If not, is the group huge?", "Each roll starts fresh: binomial."] },
          { id:"i3", t:"Choose 3 of 12 club members (5 in Grade 12) for a trip; `X` = Grade 12s", answer:"h1",
            why:"Only 12 people, chosen without replacement.",
            hints:["Is there replacement?", "If not, is the group huge?", "Only 12 people, no replacement: hypergeometric."],
            wrong:{ h2:"Only 12 people: each choice changes the next." } },
          { id:"i4", t:"Poll 10 people from all of Ontario; `X` = people who own a canoe", answer:"h3",
            why:"No one is polled twice, but 10 from millions barely changes the proportion.",
            hints:["Is there replacement?", "If not, is the group huge?", "No replacement, but millions of people: the binomial is a fine approximation."],
            wrong:{ h1:"Technically yes, but 10 from millions makes replacement irrelevant." } },
          { id:"i5", t:"Draw 2 marbles from a bag of 6, replacing each; `X` = red", answer:"h2",
            why:"Each marble goes back, so every draw has the same chance.",
            hints:["Is there replacement?", "If not, is the group huge?", "Replaced each time: binomial."] },
          { id:"i6", t:"Pick 4 lottery balls from 49 without replacement; `X` = balls matching your ticket", answer:"h1",
            why:"49 balls is a small group and none goes back.",
            hints:["Is there replacement?", "If not, is the group huge?", "No replacement from 49: hypergeometric."] },
          { id:"i7", t:"Test 5 bulbs from a production run of 1 000 000; `X` = defective", answer:"h3",
            why:"5 from a million barely changes the defect rate.",
            hints:["Is there replacement?", "If not, is the group huge?", "No replacement, but a million bulbs: the binomial is a fine approximation."] },
          { id:"i8", t:"Draw 3 tiles from a bag of 9 letter tiles (3 vowels); `X` = vowels", answer:"h1",
            why:"Only 9 tiles, none put back.",
            hints:["Is there replacement?", "If not, is the group huge?", "Only 9 tiles, no replacement: hypergeometric."] }
        ],
        wrongDefault:"Is anything put back? How big is the group compared with the sample?" },
      { id:"count", type:"custom", title:"Count it", summary:"Count it", goal:[2, 3, 6], star:true,
        instruction:"Find each probability or value. Items marked ★ are non-routine; H6 and H7 go beyond the Final Check.",
        how:"Type a fraction such as 7/15, a decimal (4 places if it doesn’t end) or a whole number, then press Check.",
        items:[
          { id:"h1", goal:2, prompt:"`n = 10`, `a = 3`, `r = 2`: find `P(X = 1)`.", answer:7 / 15, display:"`7/15`",
            why:"`C(3, 1) C(7, 1) ÷ C(10, 2) = 21/45 = 7/15`.",
            wrong:[{ match:3 / 45, fb:"Also choose the failure: `C(7, 1)`." }, { match:42 / 45, fb:M3 }],
            hints:["Choose the success, choose the failure, divide by all pairs.", "`C(3, 1) × C(7, 1) = 21`; `C(10, 2) = 45`.", "`21/45 = 7/15`."] },
          { id:"h2", goal:2, prompt:"Same: find `P(X = 2)`.", answer:1 / 15, display:"`1/15`",
            why:"`C(3, 2) ÷ C(10, 2) = 3/45 = 1/15`.",
            wrong:[{ match:9 / 100, fb:"That’s with replacement. " + M1 }],
            hints:["Both drawn must be successes.", "`C(3, 2) = 3`, out of `C(10, 2) = 45`.", "`3/45 = 1/15`."] },
          { id:"h3", goal:3, prompt:"`n = 20`, `a = 5`, `r = 8`: find `E(X)`.", answer:2, display:"2",
            why:"`ra ÷ n = 8 × 5 ÷ 20 = 2`.",
            wrong:[{ match:40, fb:M4 }, { match:0.25, fb:M4 }],
            hints:["`E(X) = ra ÷ n`.", "`8 × 5 ÷ 20`.", "2."] },
          { id:"h4", goal:6, star:true, prompt:"A committee of 4 is chosen from 6 women and 4 men. Find <i>P</i>(exactly 2 women).", answer:3 / 7, display:"`3/7`",
            why:"`C(6, 2) C(4, 2) ÷ C(10, 4) = 15 × 6 ÷ 210 = 90/210 = 3/7`.",
            wrong:[{ match:15 / 210, fb:"Also choose the 2 men." }, { match:1 / 56, fb:M3 }],
            hints:["Choose 2 women and 2 men.", "`C(6, 2) = 15`, `C(4, 2) = 6`, `C(10, 4) = 210`.", "`90/210 = 3/7`."] },
          { id:"h5", goal:6, star:true, prompt:"Same committee: find <i>P</i>(at least one man).", answer:13 / 14, display:"`13/14`",
            why:"`1 - C(6, 4) ÷ C(10, 4) = 1 - 15/210 = 13/14`.",
            wrong:[{ match:1 / 14, fb:"That’s <i>P</i>(no men)." }],
            hints:["Use the complement: no men at all.", "No men: `C(6, 4) ÷ C(10, 4) = 15/210`.", "`1 - 1/14 = 13/14`."] },
          { id:"h6", goal:2, star:true, kind:"fill", prompt:"5 cards dealt from a deck: find <i>P</i>(exactly 2 aces). Fill in the combinations, then choose the value.",
            use:"`C(48, 3) = 17 296`; `C(52, 5) = 2 598 960`",
            answer:[4, 2, 48, 3, 52, 5], display:"`C(4, 2) C(48, 3) ÷ C(52, 5) ≈ 0.040`",
            why:"Choose 2 of the 4 aces and 3 of the 48 non-aces, out of every 5-card hand: `6 × 17 296 ÷ 2 598 960 ≈ 0.040`.",
            options:[
              { t:"≈ 0.040", ok:true, why:"`6 × 17 296 ÷ 2 598 960 ≈ 0.040`." },
              { t:"≈ 0.0000023", why:"That’s `C(4, 2) ÷ C(52, 5)`. " + M2 },
              { t:"≈ 0.0067", why:"That leaves out the `C(4, 2) = 6` ways to choose the aces." },
              { t:"≈ 0.40", why:"Check the decimal: 103 776 ÷ 2 598 960 is about 0.04." }],
            hints:["Choose 2 of the 4 aces.", "The other 3 cards come from the 48 non-aces.", "6 × 17 296 ÷ 2 598 960 ≈ 0.040."] },
          { id:"h7", goal:2, star:true, prompt:"A bag of 8 marbles has some red ones. Two are drawn; <i>P</i>(both red) = `3/28`. How many are red?", answer:3, display:"3",
            why:"`C(3, 2) ÷ C(8, 2) = 3/28`.",
            wrong:[{ match:4, fb:"`C(4, 2) ÷ 28 = 6/28`." }],
            hints:["`P = C(a, 2) ÷ C(8, 2) = C(a, 2) ÷ 28`.", "You need `C(a, 2) = 3`.", "`C(3, 2) = 3`, so `a = 3`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Yael", how:"", goal:[2, 3, 5],
        instruction:"Yael made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"A bag has 5 red and 5 blue marbles. Draw 3 without replacement. Find <i>P</i>(exactly 2 red).",
            steps:["`n = 10`, `a = 5`, `r = 3`, `x = 2`.", "`P = C(5, 2) ÷ C(10, 3)`.", "`= 10/120 = 1/12`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"`C(5, 2) × C(5, 1) ÷ C(10, 3) = 50/120 = 5/12`.", ok:true, why:"The third marble must be blue: `C(5, 1)` ways. " + M2 },
              { t:"`C(5, 2) × (1/2)^3`.", why:"Don’t mix counting with a binomial probability." },
              { t:"`C(10, 2) ÷ C(10, 3)`.", why:"Choose reds from the 5 reds." },
              { t:"Step 2 is correct.", why:"The third marble must be blue: `C(5, 1)` ways." }],
            hints:["What colour is the third marble?", "Blue: choose 1 of 5.", "`50/120 = 5/12`."] },
          { id:"e2", goal:5, task:"Two cards are drawn without replacement. Find <i>P</i>(both aces).",
            steps:["The first card is an ace with probability `4/52`.", "The draws are independent, so `P = (4/52)^2`.", "`= 1/169`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"`C(4, 2) ÷ C(52, 2) = 6/1326 = 1/221` (or `4/52 × 3/51`).", ok:true, why:"Without replacement, the draws are dependent: only 3 aces remain for the second card." },
              { t:"`(4/52) + (4/52)`.", why:"‘And’ multiplies." },
              { t:"`(4/52)(4/51)`.", why:"Only 3 aces remain." },
              { t:"Step 2 is correct.", why:"Without replacement, the draws are dependent. " + M1 }],
            hints:["After an ace is drawn, how many aces are left?", "3 of 51.", "`4/52 × 3/51 = 1/221`."] },
          { id:"e3", goal:3, task:"A jar has 12 marbles, 4 red. Draw 3. Find the expected number of red marbles.",
            steps:["`r = 3`, `a = 4`, `n = 12`.", "`E(X) = ra = 12`.", "So about 12 red marbles are expected."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2, but it’s impossible: only 3 are drawn."],
            fixes:[
              { t:"`E(X) = ra ÷ n = 12 ÷ 12 = 1`.", ok:true, why:M4 },
              { t:"`E(X) = a ÷ n = 1/3`.", why:"That’s for one draw." },
              { t:"`E(X) = r ÷ a = 3/4`.", why:"That’s not a formula for `E`." },
              { t:"Step 2 is correct.", why:"`E` can’t exceed the 3 marbles drawn. " + M4 }],
            hints:["Each draw is red with probability `4/12`.", "Three draws: `3 × 4/12`.", "1."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the urn: the limits on `X`, or how close the binomial got for big groups?" },
      { id:"j2", q:"In your own words, explain the three combinations in the hypergeometric formula." },
      { id:"j3", q:"Explain to a friend how to decide between the binomial and hypergeometric models." },
      { id:"j4", q:"Which step still slows you down: counting the failures, finding the possible values, or interpreting `E`? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which variable is hypergeometric?", options:[
          { t:"5 people are chosen from a club of 12 (7 seniors); `X` = seniors chosen", ok:true, why:"Fixed number of draws, no replacement, small group." },
          { t:"A coin is tossed 5 times; `X` = heads", why:"That’s binomial." },
          { t:"A die is rolled until a 6; `X` = rolls before it", why:"That’s geometric." },
          { t:"5 people are chosen with replacement from the club; `X` = seniors", why:"With replacement, it’s binomial." }] },
        b:{ prompt:"What makes a situation hypergeometric rather than binomial?", options:[
          { t:"Drawing without replacement from a small, finite group", ok:true, why:"Each draw changes what’s left, so the trials are dependent." },
          { t:"A fixed number of trials", why:"Both models have this." },
          { t:"Two outcomes per trial", why:"Both have this." },
          { t:"Counting successes", why:"Both do." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`n = 8`, `a = 3`, `r = 2`. Find `P(X = 1)`.", options:[
          { t:"`15/28`", ok:true, why:"`C(3, 1) C(5, 1) ÷ C(8, 2) = 15/28`." },
          { t:"`3/28`", why:"Also choose the failure." },
          { t:"`15/32`", why:"That’s `2(3/8)(5/8)`, with replacement." },
          { t:"`3/8`", why:"That’s one draw." }] },
        b:{ prompt:"`n = 9`, `a = 4`, `r = 2`. Find `P(X = 2)`.", options:[
          { t:"`1/6`", ok:true, why:"`C(4, 2) ÷ C(9, 2) = 6/36`." },
          { t:"`16/81`", why:"With replacement." },
          { t:"`4/9`", why:"That’s one draw." },
          { t:"`2/27`", why:"That divides `C(4, 2)` by 81, mixing two methods. " + M3 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`n = 15`, `a = 6`, `r = 5`. Find `E(X)`.", options:[
          { t:"2", ok:true, why:"5 × 6 ÷ 15." },
          { t:"30", why:"Divide by `n`." },
          { t:"2.5", why:"That’s `r ÷ 2`." },
          { t:"0.4", why:"That’s `a ÷ n`, for one draw." }] },
        b:{ prompt:"`n = 24`, `a = 8`, `r = 6`. Find `E(X)`.", options:[
          { t:"2", ok:true, why:"6 × 8 ÷ 24." },
          { t:"48", why:M4 },
          { t:"3", why:"That’s `r ÷ 2`." },
          { t:"`1/3`", why:M4 }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A class of 10 has 4 left-handed students. 3 are chosen at random. Find <i>P</i>(at least one left-handed student).", options:[
          { t:"`5/6`", ok:true, why:"`1 - C(6, 3) ÷ C(10, 3) = 1 - 20/120`." },
          { t:"`1/6`", why:"That’s <i>P</i>(none)." },
          { t:"`1/2`", why:"That’s <i>P</i>(exactly one) = `60/120`." },
          { t:"`98/125`", why:"That’s `1 - 0.6^3`, with replacement." }] },
        b:{ prompt:"A box of 12 bulbs has 3 defective. Two are tested. Find <i>P</i>(at least one defective).", options:[
          { t:"`5/11`", ok:true, why:"`1 - C(9, 2) ÷ C(12, 2) = 1 - 36/66`." },
          { t:"`6/11`", why:"That’s <i>P</i>(none)." },
          { t:"`9/22`", why:"That’s <i>P</i>(exactly one) = `27/66`." },
          { t:"`7/16`", why:"That’s `1 - (3/4)^2`, with replacement." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A lake holds 1000 fish, 200 of them tagged. You catch 5. Why is the binomial with `p = 0.2` a good approximation?", options:[
          { t:"Removing 5 fish barely changes the proportion tagged, so the catches are nearly independent", ok:true, why:"5 is tiny compared with 1000." },
          { t:"Fish are thrown back between catches", why:"The question says nothing about that, and it isn’t needed." },
          { t:"Because 0.2 is small", why:"Group size, not `p`, decides this." },
          { t:"The binomial is always exact", why:M6 }] },
        b:{ prompt:"In which case is the binomial a <strong>poor</strong> approximation to the hypergeometric?", options:[
          { t:"Drawing 6 cards from a set of 10", ok:true, why:"Each draw changes a small group a lot." },
          { t:"Drawing 6 people from 10 000", why:"Barely changes the proportion." },
          { t:"Drawing 2 items from 5000", why:"Tiny sample." },
          { t:"Drawing 3 people from all of Canada", why:"Huge group." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A jar has 10 candies, `a` of them red. Two are drawn without replacement, and <i>P</i>(both red) = `1/15`. Find `a`.", options:[
          { t:"3", ok:true, why:"`C(a, 2) ÷ 45 = 1/15`, so `C(a, 2) = 3`." },
          { t:"4", why:"`C(4, 2) ÷ 45 = 2/15`." },
          { t:"2", why:"`C(2, 2) ÷ 45 = 1/45`." },
          { t:"5", why:"`C(5, 2) ÷ 45 = 2/9`." }] },
        b:{ prompt:"A box has 12 items, `a` of them defective. Two are tested, and <i>P</i>(both defective) = `1/11`. Find `a`.", options:[
          { t:"4", ok:true, why:"`C(a, 2) ÷ 66 = 1/11`, so `C(a, 2) = 6`." },
          { t:"3", why:"`C(3, 2) ÷ 66 = 1/22`." },
          { t:"5", why:"`C(5, 2) ÷ 66 = 5/33`." },
          { t:"6", why:"`C(6, 2) ÷ 66 = 5/22`." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why drawing without replacement changes the probabilities?", options:[
          { t:"“Once a success is removed, fewer successes remain, so the chance of a success on the next draw goes down. The draws are dependent.”", ok:true, why:"Each draw changes what’s left." },
          { t:"“Without replacement, every draw has the same probability.”", why:"That’s only true with replacement." },
          { t:"“Without replacement, the probabilities no longer add to 1.”", why:"They still do." },
          { t:"“It only changes things if the first draw is a failure.”", why:"Both successes and failures change the next draw." }] },
        b:{ prompt:"Which is the best explanation of why `E(X) = ra ÷ n` for the hypergeometric?", options:[
          { t:"“Considered on its own, each of the `r` draws is a success with probability `a ÷ n`. Expected values add, so `E = r × a ÷ n`.”", ok:true, why:"Expected values add even when the draws are dependent." },
          { t:"“Because the draws are independent.”", why:"They aren’t; expected values add anyway." },
          { t:"“Because `E` is always `ra`.”", why:M4 },
          { t:"“Because the most likely value is `ra ÷ n`.”", why:"`E` is an average, not a mode." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which table shows the hypergeometric distribution for `n = 6`, `a = 2`, `r = 2`?", options:[
          { t:"0: `6/15` · 1: `8/15` · 2: `1/15`", ok:true, why:"`C(4, 2)`, `C(2, 1) C(4, 1)`, `C(2, 2)`, each out of 15." },
          { t:"0: `4/9` · 1: `4/9` · 2: `1/9`", why:"That’s the binomial with `p = 1/3`." },
          { t:"0: `1/3` · 1: `1/3` · 2: `1/3`", why:"The values aren’t equally likely." },
          { t:"0: `6/15` · 1: `8/15` · 2: `4/15`", why:"These add to `18/15`, more than 1." }] },
        b:{ prompt:"Which table shows the hypergeometric distribution for `n = 5`, `a = 3`, `r = 2`?", options:[
          { t:"0: `1/10` · 1: `6/10` · 2: `3/10`", ok:true, why:"`C(2, 2)`, `C(3, 1) C(2, 1)`, `C(3, 2)`, each out of `C(5, 2) = 10`." },
          { t:"0: 0.16 · 1: 0.48 · 2: 0.36", why:"That’s the binomial with `p = 0.6`, with replacement." },
          { t:"0: `1/3` · 1: `1/3` · 2: `1/3`", why:"The values aren’t equally likely." },
          { t:"0: `1/10` · 1: `6/10` · 2: `3/10` · 3: `1/10`", why:"`X` can’t be 3 with 2 draws." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A shipment of 20 phones has 2 defective. The buyer tests 3 and accepts the shipment if none is defective. Find <i>P</i>(accept).", use:"`C(18, 3) = 816` and `C(20, 3) = 1140`", options:[
          { t:"About 0.716", ok:true, why:"816 ÷ 1140 = `68/95`." },
          { t:"About 0.729", why:"That’s `0.9^3`, with replacement." },
          { t:"About 0.284", why:"That’s <i>P</i>(reject)." },
          { t:"About 0.900", why:"That’s one phone." }] },
        b:{ prompt:"A shipment of 25 items has 5 defective. The buyer tests 2 and accepts if none is defective. Find <i>P</i>(accept).", use:"`C(20, 2) = 190` and `C(25, 2) = 300`", options:[
          { t:"About 0.633", ok:true, why:"190 ÷ 300 = `19/30`." },
          { t:"0.64", why:"That’s `0.8^2`, with replacement." },
          { t:"About 0.367", why:"That’s <i>P</i>(reject)." },
          { t:"0.8", why:"That’s one item." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A committee of 4 is chosen at random from 5 Grade 11 and 5 Grade 12 students. Find <i>P</i>(more Grade 12s than Grade 11s on the committee).", options:[
          { t:"`11/42`", ok:true, why:"`X >= 3`: `[C(5, 3) C(5, 1) + C(5, 4)] ÷ C(10, 4) = 55/210`." },
          { t:"`5/21`", why:"That’s exactly 3 only." },
          { t:"`1/2`", why:"Ties (2 and 2) are possible, so it isn’t half." },
          { t:"`5/16`", why:"That’s the binomial with `p = 1/2`." }] },
        b:{ prompt:"A committee of 4 is chosen at random from 6 seniors and 4 juniors. Find <i>P</i>(more seniors than juniors).", options:[
          { t:"`19/42`", ok:true, why:"`[C(6, 3) C(4, 1) + C(6, 4)] ÷ 210 = 95/210`." },
          { t:"`8/21`", why:"That’s exactly 3 only." },
          { t:"About 0.475", why:"That’s the binomial with `p = 0.6`." },
          { t:"`1/2`", why:"Ties are possible." }] } }
    ]
  },
  task:{
    title:"Inspection plan", summary:"Inspection plan",
    statement:"<p>Boxes of 12 phone cases arrive. A <strong>good</strong> box has 2 defective cases; a <strong>bad</strong> box has 4. Design a plan: test `r` cases at random and accept the box if at most `c` are defective. Can you find all the plans that work?</p>" +
      '<ol class="hg-conds"><li>A good box is accepted at least 65% of the time.</li><li>A bad box is accepted at most 60% of the time.</li><li>You test at most 5 cases.</li></ol>',
    checks:["Good box accepted ≥ 65%", "Bad box accepted ≤ 60%", "Test at most 5"],
    tips:["A strict plan (`c = 0`) with many tests rejects good boxes too often.", "A loose plan (`c = 1` or 2) with few tests accepts bad boxes.", "Testing more cases separates good from bad, but testing costs time."],
    explainPrompt:"Explain which of your plans you’d recommend to the buyer, and why. Use the probabilities for both kinds of box.",
    vocab:"Use the words without replacement, hypergeometric, accept and probability.",
    more:"There’s more than one plan that works. Can you find them all?",
    after3:"The 5-test plan separates good from bad boxes best (0.85 vs 0.42), but it costs the most."
  },
  cards:[
    ["Hypergeometric situation", "`r` draws <strong>without replacement</strong> from `n` items, `a` of them successes; `X` = successes drawn."],
    ["`P(X = x)`", "`C(a, x) C(n - a, r - x) ÷ C(n, r)`."],
    ["The three combinations", "Successes chosen × failures chosen ÷ all possible selections."],
    ["`E(X)`", "`ra ÷ n`: e.g., 3 draws from 12 (4 red) gives 1."],
    ["Largest `X`", "The smaller of `r` and `a`."],
    ["Smallest `X`", "The larger of 0 and `r - (n - a)`."],
    ["Dependent trials", "Each draw changes the next one’s probability."],
    ["Hypergeometric vs binomial", "Same mean; the hypergeometric is less spread out."],
    ["When the binomial is OK", "When the sample is tiny compared with the group (e.g., 5 from 1000)."],
    ["“At least one”", "`1 - C(n - a, r) ÷ C(n, r)`."],
    ["Acceptance sampling", "Accept a shipment if a random sample has at most `c` defective items."],
    ["Check", "The probabilities in the table must add to 1."]
  ]
};
