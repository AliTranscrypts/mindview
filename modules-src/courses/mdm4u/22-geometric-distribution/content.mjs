// MDM4U 22 The Geometric Distribution. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/22-geometric-distribution.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
// Core feedback sentences for the plan's misconceptions (§3).
const M3 = "`1 ÷ p` counts trials, including the success. Failures before it average `q ÷ p`.";
const M5 = "There’s only one order: all the failures come first, then the success. No `C(n, x)`.";
const M6 = (k, w) => "At least " + k + " " + (w || "failures") + " means the first " + k + " trials fail: `q^" + k + "`.";

export default {
  id:"22-geometric-distribution",
  kind:"topic",
  title:"The geometric distribution",
  topic:"The Geometric Distribution",
  readyTopic:"the geometric distribution",
  hero:{
    eq:'<span class="gm-heq">' +
      '<span class="gm-ht gm-htf"><span class="gm-tile">F</span><span class="gm-tile">F</span><span class="gm-tile">F</span><span class="gm-tdots">…</span><span class="gm-tile">F</span></span>' +
      '<span class="gm-ht gm-hts"><span class="gm-tile gm-tile-s">S</span></span>' +
      '<span class="gm-hu gm-huf">`x` failures</span><span class="gm-hu gm-hus">first success</span>' +
      '<span class="gm-hm gm-hml">`P(X = x) =`</span><span class="gm-hm gm-hmf">`q^x`</span><span class="gm-hm gm-hmd">·</span><span class="gm-hm gm-hms">`p`</span></span>',
    eqLabel:"P of X equals x equals q to the x, times p. Under F, F, F and so on to F: x failures. Under S: the first success.",
    eqSize:"sm",
    headline:"How long until the first success?",
    text:"Roll until you get a 6. Test phones until one is faulty. These are <strong>waiting-time</strong> problems: the trials repeat <strong>until the first success</strong>. `X` counts the <strong>failures</strong> before it, and its distribution is called <strong>geometric</strong>.",
    fig:{ html:'<div class="gm-hfig" id="gm-hfig"></div>' }
  },
  goals:[
    "I can recognize a waiting-time situation and define success and `p` correctly.",
    "I can calculate `P(X = x) = q^x p`, where `X` is the number of failures before the first success.",
    "I can calculate tail probabilities: `P(X ≥ k) = q^k` and `P(X ≤ k) = 1 - q^{k + 1}`.",
    "I can find and interpret `E(X) = q ÷ p`, and connect it to the average trial number `1 ÷ p`.",
    "I can solve waiting-time problems and tell them apart from binomial ones."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Independent events", goal:2, prompt:"A die is rolled 3 times. What is " + P("no 6s") + "?",
          options:[
            { t:"`125/216`", ok:true, why:"`(5/6)^3`." },
            { t:"`91/216`", why:"That’s " + P("at least one 6") + "." },
            { t:"`1/216`", why:"That’s three 6s in a row." },
            { t:"`1/2`", why:"Multiply probabilities of independent events." }],
          hints:[P("not 6") + " on one roll?", "`5/6` each time, multiplied.", "`125/216`."] },
        { id:"w2", skill:"Independent events", goal:2, prompt:"A coin is tossed 3 times. What is " + P("tail, tail, head") + ", in that order?",
          options:[
            { t:"`1/8`", ok:true, why:"`(1/2)^3`." },
            { t:"`3/8`", why:"The order is fixed here." },
            { t:"`1/2`", why:"Only the last toss is a head, but all three must happen." },
            { t:"`1/4`", why:"That’s two tosses." }],
          hints:["One specific path.", "`1/2 × 1/2 × 1/2`.", "`1/8`."] },
        { id:"w3", skill:"Powers of fractions", goal:3, prompt:"Evaluate `(3/4)^2 × 1/4`.",
          options:[
            { t:"`9/64`", ok:true, why:"`9/16 × 1/4`." },
            { t:"`6/16`", why:"`(3/4)^2 = 9/16`." },
            { t:"`3/16`", why:"Square it first." },
            { t:"`1/64`", why:"Only one factor is `1/4`." }],
          hints:["Square `3/4`.", "`9/16`.", "`9/16 × 1/4 = 9/64`."] },
        { id:"w4", skill:"Powers of fractions", goal:3, prompt:"Evaluate `(2/3)^3`.",
          options:[
            { t:"`8/27`", ok:true, why:"`2^3 ÷ 3^3`." },
            { t:"`6/9`", why:"Cube both parts." },
            { t:"`2/9`", why:"Cube the numerator too." },
            { t:"`8/9`", why:"`3^3 = 27`." }],
          hints:["Cube top and bottom.", "`2^3 = 8`, `3^3 = 27`.", "`8/27`."] },
        { id:"w5", skill:"Expected value", goal:4, prompt:"`X` takes the values 0, 1, 2, 3 with probabilities 0.4, 0.3, 0.2, 0.1. Find `E(X)`.",
          options:[
            { t:"1.0", ok:true, why:"0 + 0.3 + 0.4 + 0.3." },
            { t:"1.5", why:"Weight by probability." },
            { t:"0.25", why:"`E` uses the values." },
            { t:"6", why:"Multiply each value by its probability." }],
          hints:["`Σ xP(x)`.", "0(0.4) + 1(0.3) + 2(0.2) + 3(0.1).", "1.0."] },
        { id:"w6", skill:"Complements", goal:3, prompt:"A coin is tossed 3 times. What is " + P("at least one head") + "?",
          options:[
            { t:"`7/8`", ok:true, why:"`1 - (1/2)^3`." },
            { t:"`3/8`", why:"That’s exactly one head." },
            { t:"`1/8`", why:"That’s no heads." },
            { t:"`1/2`", why:"One toss only." }],
          hints:["Opposite of ‘at least one head’?", "All tails: `1/8`.", "`7/8`."] }
      ],
      refreshers:{
        "Independent events":"Multiply along a path: " + P("F, F, S") + " = `q · q · p`.",
        "Powers of fractions":"`(a/b)^n = a^n ÷ b^n`.",
        "Expected value":"`E(X) = Σ xP(X = x)`, a long-run average.",
        "Complements":P("at least one") + " = 1 − " + P("none") + "."
      }
    }
  },
  explore:{
    heading:"Waiting room",
    intro:"Choose the chance of success. Run the trials until the first success, or let the simulator run thousands of times. Then compare with the theory.",
    predIntro:"Make a prediction first. Then the waiting room will show you what really happens.",
    predictions:[
      { id:"p1", start:{ view:"theory", p:"1/6" },
        prompt:"Rolling a die until the first 6 (`p = 1/6`). Which number of failures before the first 6 is most likely?",
        options:[{ t:"0", ok:true }, { t:"5" }, { t:"6" }, { t:"All equally likely" }],
        explain:"`E(X) = 5`, but each extra failure multiplies the probability by `5/6`, so 0 wins." },
      { id:"p2", start:{ view:"theory", p:"1/2", sel:"X = 3" },
        prompt:"`p = 1/2`. What is `P(X = 3)`?",
        options:[{ t:"`1/16`", ok:true }, { t:"`1/8`" }, { t:"`3/8`" }, { t:"`1/2`" }],
        explain:"3 failures, then a success: four factors. `1/8` uses one factor too few. `3/8` adds `C(3, 1)`, but there’s only one order." },
      { id:"p3", start:{ view:"memory", p:"1/6", k:10 },
        prompt:"A die has shown no 6 in its last 10 rolls. What is " + P("the next roll is a 6") + "?",
        options:[{ t:"`1/6`", ok:true }, { t:"More than `1/6`, because a 6 is due" }, { t:"Less than `1/6`, because this die avoids 6s" }, { t:"`1/2`" }],
        explain:"The die doesn’t remember. Independent trials mean the wait starts fresh." },
      { id:"p4", start:{ view:"theory", p:"1/4", to:"1/2" },
        prompt:"`p` goes from `1/4` to `1/2`. What happens to `E(X) = q ÷ p`?",
        options:[{ t:"It drops from 3 to 1", ok:true }, { t:"It drops from 4 to 2" }, { t:"It drops from 3 to 1.5" }, { t:"It doubles" }],
        explain:"`(3/4) ÷ (1/4) = 3`; `(1/2) ÷ (1/2) = 1`. The values 4 and 2 count trials, not failures." }
    ],
    chalIntro:"Use the waiting room to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"Set `p` so that the expected number of failures before the first success is 4.",
        why:"`(1 - p) ÷ p = 4` gives `1 - p = 4p`, so `p = 1/5`: 4 failures on average, and the success comes on trial 5 on average.",
        hints:["`E(X) = q ÷ p = (1 - p) ÷ p`.", "Solve `(1 - p) ÷ p = 4`: `1 - p = 4p`.", "`p = 1/5`."] },
      { id:"tc2", goal:3, prompt:"With `p = 1/3`, select the event ‘at least 3 failures before the first success’ so the readout shows `8/27`.",
        why:"At least 3 failures means the first 3 trials all fail: `P(X ≥ 3) = (2/3)^3 = 8/27`.",
        hints:["At least 3 failures means the first 3 trials all fail.", "`(2/3)^3`.", "Select `X ≥ 3`: `8/27`."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Find the <strong>smallest</strong> `p` among the chips `1/6`, `1/5`, `1/4`, `1/3`, `2/5`, `1/2` for which " + P("the first success comes within the first 3 trials") + " is at least `1/2`.",
        why:"Within 3 trials means at most 2 failures: `P(X ≤ 2) = 1 - (3/4)^3 = 37/64 ≈ 0.578`. With `p = 1/5` it’s `61/125 = 0.488`, just under `1/2`.",
        hints:["Within 3 trials = at most 2 failures = 1 − " + P("first 3 all fail") + ".", "You need `q^3 ≤ 1/2`.", "`(4/5)^3 = 0.512` is too big; `(3/4)^3 = 27/64 ≈ 0.42` works, so `p = 1/4`."] }
    ]
  },
  part3:{
    slug:"waiting", name:"Waiting",
    heading:"Waiting-time problems",
    intro:"Now the trials come from real situations. In each station, decide what counts as a success, find `p` and `E(X)`, and tell waiting-time problems apart from binomial ones. Station 4 checks the formulas with algebra.",
    stations:[
      { id:"s1", title:"Quality checks",
        text:"A factory’s phones are faulty with probability `1/20`, independently. An inspector tests phones until she finds a faulty one. `X` = the number of good phones she tests before the first faulty one.",
        rows:[
          { id:"s1a", goal:1, label:"What counts as a success?",
            chips:[
              { t:"Finding a faulty phone", ok:true, fb:"Right. The inspector is waiting for a faulty phone, so that’s the success." },
              { t:"Finding a good phone", fb:"The event you’re waiting for is the success: here, a faulty phone." }] },
          { id:"s1b", goal:1, label:"`p` =",
            chips:[
              { t:"`1/20`", ok:true, fb:"Right. `p` = " + P("faulty") + " = `1/20`, so `q = 19/20`." },
              { t:"`19/20`", fb:"That’s the chance of a good phone, a failure here. `p` is the chance of the success: a faulty phone." }] },
          { id:"s1c", goal:4, label:"`E(X)` =",
            chips:[
              { t:"19", ok:true, fb:"Right. `q ÷ p = (19/20) ÷ (1/20) = 19` good phones first, so the faulty phone is the 20th test on average." },
              { t:"20", fb:M3 + " Here `1 ÷ p = 20` counts the faulty phone too." },
              { t:"`1/19`", fb:"That’s `p ÷ q`, upside down. Use `q ÷ p`." }] },
          { id:"s1d", goal:3, label:P("at least 10 good phones first") + " ≈", use:"`(0.95)^10 ≈ 0.599`",
            chips:[
              { t:"0.599", ok:true, fb:"Right. At least 10 good phones first means the first 10 phones are all good: `q^10 = (0.95)^10 ≈ 0.599`." },
              { t:"0.401", fb:"That’s `1 - q^10`, the chance that a faulty phone turns up within the first 10. " + M6(10, "good phones") }] }
        ] },
      { id:"s2", title:"Who’s the success?",
        text:"A shooter makes 4 of every 5 free throws. `X` = makes before her first miss.",
        rows:[
          { id:"s2a", goal:1, label:"What counts as a success?",
            chips:[
              { t:"A make", fb:"The event you’re waiting for is the success." },
              { t:"A miss", ok:true, fb:"Right. She’s waiting for her first miss, so a miss is the success." }] },
          { id:"s2b", goal:1, label:"`p` =",
            chips:[
              { t:"`4/5`", fb:"The event you’re waiting for is the success. `4/5` is the chance of a make; here success is a miss." },
              { t:"`1/5`", ok:true, fb:"Right. Success is a miss, so `p = 1/5` and `q = 4/5`." }] },
          { id:"s2c", goal:4, label:"`E(X)` =",
            chips:[
              { t:"4", ok:true, fb:"Right. `E(X) = q ÷ p = (4/5) ÷ (1/5) = 4` makes before her first miss, on average." },
              { t:"5", fb:M3 + " Here `1 ÷ p = 5` counts the miss too." },
              { t:"`1/4`", fb:"That’s `p ÷ q`, upside down. Use `q ÷ p`." }] }
        ] },
      { id:"s3", title:"Geometric or binomial?",
        text:"Two cards, both about rolling a die. Match each card with its formula.",
        cards:[
          { id:"s3a", goal:5, t:"Number of 6s in 6 rolls",
            chips:[
              { t:"`C(6, x)(1/6)^x(5/6)^{6 - x}`", ok:true, fb:"Right. Binomial: a fixed `n = 6` rolls, and the 6s can come in any order. `E(X) = np = 1`." },
              { t:"`(5/6)^x(1/6)`", fb:"Here the number of rolls is fixed at 6, and the 6s can be anywhere among them: count the orders with `C(6, x)`." }] },
          { id:"s3b", goal:5, t:"Non-6 rolls before the first 6",
            chips:[
              { t:"`C(6, x)(1/6)^x(5/6)^{6 - x}`", fb:M5 },
              { t:"`(5/6)^x(1/6)`", ok:true, fb:"Right. Geometric: you roll until the first 6, so there’s no fixed `n` and only one order. `E(X) = q ÷ p = 5`." }] }
        ] },
      { id:"s4", title:"Check it with algebra",
        text:"Two quick checks on the formulas: the probabilities add to 1, and counting trials instead of failures just shifts everything by 1." }
    ],
    quickCheck:{
      title:"Waiting-time quick check", summary:"Waiting-time quick check",
      items:[
        { id:"q1", goal:2, prompt:"`p = 1/2`. `P(X = 0)`?",
          right:"Right. `X = 0` means success on the first trial: `P(X = 0) = p = 1/2`.", wrong:"`X = 0` means success on the first trial.",
          choices:[{ t:"`1/2`", ok:true }, { t:"0" }, { t:"`1/4`" }, { t:"1" }] },
        { id:"q2", goal:4, prompt:"`p = 1/5`. Expected failures?",
          right:"Right. `q ÷ p = (4/5) ÷ (1/5) = 4`.", wrong:"`q ÷ p = (4/5) ÷ (1/5)`.",
          choices:[{ t:"4", ok:true }, { t:"5" }, { t:"`1/4`" }, { t:"`1/5`" }] },
        { id:"q3", goal:5, prompt:"No 6 in 10 rolls. " + P("6 on the next roll") + "?",
          right:"Right. Independent rolls: the die doesn’t remember.", wrong:"Independent rolls.",
          choices:[{ t:"`1/6`", ok:true }, { t:"more than `1/6`" }, { t:"less than `1/6`" }, { t:"`10/6`" }] },
        { id:"q4", goal:1, prompt:"Which is geometric?",
          right:"Right. Waiting for the first success.", wrong:"Waiting for the first success.",
          choices:[{ t:"Rolls before the first 6", ok:true }, { t:"Number of 6s in 10 rolls" }, { t:"Number of aces in 5 cards" }, { t:"Sum of 2 dice" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Situation ↔ probability", summary:"Situation ↔ probability", goal:[2, 3, 4],
        instruction:"Match each situation with its value. Two values have no partner.",
        leftTitle:"Situation", rightTitle:"Value",
        left:[
          { id:"l1", goal:2, t:"`p = 1/2`, `P(X = 3)`", why:"Three failures, then a success: `(1/2)^3(1/2) = 1/16`." },
          { id:"l2", goal:2, t:"`p = 1/6`, `P(X = 0)`", why:"Success on the first trial: `p = 1/6`." },
          { id:"l3", goal:2, t:"`p = 1/6`, `P(X = 2)`", why:"`(5/6)^2(1/6) = 25/216`." },
          { id:"l4", goal:3, t:"`p = 1/4`, `P(X ≥ 2)`", why:"The first 2 trials fail: `(3/4)^2 = 9/16`." },
          { id:"l5", goal:3, t:"`p = 1/4`, `P(X ≤ 1)`", why:"`1/4 + (3/4)(1/4) = 7/16`, or `1 - (3/4)^2`.",
            hints:["At most 1 failure: `X = 0` or 1.", "`1/4 + (3/4)(1/4)`.", "`7/16`."] },
          { id:"l6", goal:4, t:"`p = 1/3`, `E(X)`", why:"`(2/3) ÷ (1/3) = 2`." },
          { id:"l7", goal:4, t:"`p = 1/10`, `E(X)`", why:"`(9/10) ÷ (1/10) = 9`." }
        ],
        right:[
          { id:"r1", t:"`1/16`" }, { id:"r2", t:"`1/6`" }, { id:"r3", t:"`25/216`" }, { id:"r4", t:"`9/16`" }, { id:"r5", t:"`7/16`" },
          { id:"r6", t:"2" }, { id:"r7", t:"9" }, { id:"r8", t:"`9/64`" }, { id:"r9", t:"10" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7" },
        wrong:{
          "l4|r8":"That’s exactly 2. ‘At least 2’ is `q^2`.",
          "l7|r9":"That’s the average trial number `1 ÷ p`.",
          "l5|r4":"That’s the complement."
        },
        wrongDefault:"Write the failures first, then the success." },
      { id:"calc", type:"numeric", title:"Waiting calculations", summary:"Waiting calculations", goal:[2, 3, 4, 5],
        instruction:"Find each probability or value. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a fraction such as 3/8 or a decimal (4 places if it doesn’t end), then press Check.",
        items:[
          { id:"c1", goal:2, prompt:"`p = 1/3`: find `P(X = 2)`.", answer:4 / 27, tol:5e-5, display:"`4/27`",
            why:"Two failures, then a success: `(2/3)^2(1/3) = 4/27`.",
            wrong:[{ match:2 / 9, fb:"`X = 2` means F, F, then S: two factors of `q`, then `p`." }] },
          { id:"c2", goal:4, prompt:"`p = 1/4`: find `E(X)`.", answer:3, tol:5e-5, display:"`E(X) = 3`",
            why:"`q ÷ p = (3/4) ÷ (1/4) = 3`.",
            wrong:[{ match:4, fb:M3 }] },
          { id:"c3", goal:3, prompt:"`p = 1/2`: find `P(X ≥ 4)`.", answer:1 / 16, tol:5e-5, display:"`1/16`",
            why:"The first 4 trials all fail: `(1/2)^4 = 1/16`.",
            wrong:[{ match:1 / 32, fb:"That’s exactly 4." }] },
          { id:"c4", goal:3, star:true, prompt:"`p = 1/2`: find `P(X ≤ 2)`.", answer:7 / 8, tol:5e-5, display:"`7/8`",
            why:"`1 - (1/2)^3 = 7/8`.",
            wrong:[{ match:3 / 4, fb:"Include `X = 2`: `1 - (1/2)^3`." }] },
          { id:"c5", goal:4, star:true, prompt:"`E(X) = 9`. Find `p`.", answer:1 / 10, tol:5e-5, display:"`p = 1/10`",
            why:"`(1 - p) ÷ p = 9` gives `1 - p = 9p`, so `p = 1/10`.",
            wrong:[{ match:1 / 9, fb:"That makes `1 ÷ p = 9`; you need `q ÷ p = 9`." }] },
          { id:"c6", goal:2, star:true, prompt:"`P(X = 1) = 6/25` and `p < 1/2`. Find `p`.", answer:2 / 5, tol:5e-5, display:"`p = 2/5`",
            why:"`(1 - p)p = 6/25` gives `(5p - 2)(5p - 3) = 0`, and `p < 1/2`, so `p = 2/5`.",
            wrong:[{ match:3 / 5, fb:"That also gives `qp = 6/25`, but `p` must be under `1/2`." }],
            hints:["`P(X = 1) = qp = (1 - p)p`.", "`p - p^2 = 6/25`, so `25p^2 - 25p + 6 = 0`.", "`(5p - 2)(5p - 3) = 0`: `p = 2/5`."] },
          { id:"c7", goal:5, star:true, prompt:"Ana and Ben take turns rolling a die, Ana first. The first to roll a 6 wins. What is " + P("Ana wins") + "?", answer:6 / 11, tol:5e-5, display:"`6/11`",
            why:"Ana wins on roll 1, 3, 5, … of the game: `1/6 + (5/6)^2(1/6) + … = (1/6) ÷ (1 - 25/36) = 6/11`.",
            wrong:[{ match:1 / 2, fb:"Going first is an advantage." }, { match:1 / 6, fb:"That’s only her first roll." }],
            hints:["Ana wins on roll 1, 3, 5, … of the game.", "`P = 1/6 + (5/6)^2(1/6) + (5/6)^4(1/6) + …`.", "This sums to `(1/6) ÷ (1 - 25/36) = 6/11`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Wyatt", how:"", goal:[2, 4, 5],
        instruction:"Wyatt made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"`p = 1/4`. Find `P(X = 3)`, where `X` = failures before the first success.",
            steps:["`X = 3` means F, F, F, then S.", "`P = (3/4)^2(1/4)`.", "`= 9/64`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 computes step 2 correctly. The mistake is earlier."],
            fixes:[
              { t:"Three failures: `(3/4)^3(1/4) = 27/256`.", ok:true, why:"`X = 3` means F, F, F, then S: three factors of `q`, then `p`." },
              { t:"`(1/4)^3(3/4)`.", why:"The failures have probability `3/4`." },
              { t:"`C(4, 3)(3/4)^3(1/4)`.", why:M5 },
              { t:"Step 2 is correct.", why:"Step 1 lists three F’s, so three factors of `3/4`." }],
            hints:["Count the F’s in step 1.", "Three.", "`(3/4)^3(1/4)`."] },
          { id:"e2", goal:4, task:"`p = 1/5`. Find the expected number of failures before the first success.",
            steps:["`q = 4/5`.", "`E(X) = 1 ÷ p = 5`.", "So on average 5 failures come first."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"`E(X) = q ÷ p = 4`; the success comes on trial 5 on average.", ok:true, why:M3 },
              { t:"`E(X) = p ÷ q = 1/4`.", why:"That’s upside down." },
              { t:"`E(X) = 1 ÷ q = 5/4`.", why:"That’s not a geometric formula." },
              { t:"Step 2 is correct.", why:"`1 ÷ p` counts the success too." }],
            hints:["Does `1 ÷ p` count the success trial?", "Yes, so subtract 1.", "`q ÷ p = 4`."] },
          { id:"e3", goal:5, task:"A die has shown no 6 in 12 rolls. Is a 6 more likely on the next roll?",
            steps:["The rolls are independent.", P("no 6 in 12 rolls") + " = `(5/6)^{12}` is small, about 0.11.", "So a 6 is overdue, and the next roll is more likely to be a 6."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Independence means " + P("6 on the next roll") + " is still `1/6`, whatever happened before.", ok:true, why:"The trials are independent. After 12 misses, the next roll still has probability `1/6`." },
              { t:"The next roll is less likely to be a 6.", why:"The past doesn’t change it in either direction." },
              { t:"`P = 13/6`.", why:"Probabilities can’t exceed 1." },
              { t:"Step 3 is correct.", why:"That’s the gambler’s fallacy." }],
            hints:["Does the die remember?", "Step 1 says the rolls are independent.", "`1/6`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the waiting room: the falling staircase, or the memory test?" },
      { id:"j2", q:"In your own words, explain why `P(X = x) = q^x p` has no `C(n, x)` in it." },
      { id:"j3", q:"Explain to a friend the difference between ‘failures before the first success’ and ‘the trial of the first success’." },
      { id:"j4", q:"Which part still feels slippery: defining success, tails, or expected value? What will you do about it?" }
    ]
  },
  final:{
    intro:"This shows what you’ve learned, so there are no hints here. Answer all 10 questions and say how sure you are. Then submit to see your results. Each question is labelled with its achievement chart category. In every question, `X` is the number of <strong>failures</strong> before the first success.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which variable has a geometric distribution, as defined in this course?", options:[
          { t:"`X` = number of tails before the first head", ok:true, why:"Independent tosses, waiting for the first head." },
          { t:"`X` = number of heads in 10 tosses", why:"That’s binomial." },
          { t:"`X` = number of aces in 5 cards dealt", why:"That’s hypergeometric." },
          { t:"`X` = sum of two dice", why:"That’s not a count of trials." }] },
        b:{ prompt:"Which variable has a geometric distribution?", options:[
          { t:"`X` = number of losing tickets checked before the first winner, where each ticket wins independently with probability `1/10`", ok:true, why:"Independent tickets, waiting for the first winner." },
          { t:"`X` = number of winners among 20 tickets", why:"Fixed `n`: binomial." },
          { t:"`X` = number of winners among 5 tickets drawn from a box of 50", why:"Without replacement: hypergeometric." },
          { t:"`X` = the prize value of a winning ticket", why:"That’s not a waiting time." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`p = 1/3`. Find `P(X = 2)`.", options:[
          { t:"`4/27`", ok:true, why:"`(2/3)^2(1/3)`." },
          { t:"`2/9`", why:"That’s one failure, then a success." },
          { t:"`4/9`", why:"Multiply by `p` for the success." },
          { t:"`8/27`", why:"That’s " + P("the first 3 trials all fail") + "." }] },
        b:{ prompt:"`p = 1/2`. Find `P(X = 4)`.", options:[
          { t:"`1/32`", ok:true, why:"`(1/2)^4(1/2)`." },
          { t:"`1/16`", why:"`X = 4` means F, F, F, F, then S: four factors of `q`, then `p`." },
          { t:"`5/32`", why:"There’s only one order." },
          { t:"`1/2`", why:"That’s one trial." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"`p = 1/8`. Find `E(X)`.", options:[
          { t:"7", ok:true, why:"`(7/8) ÷ (1/8)`." },
          { t:"8", why:"That’s the average trial number." },
          { t:"`1/7`", why:"That’s `p ÷ q`." },
          { t:"`7/8`", why:"That’s `q`." }] },
        b:{ prompt:"`p = 2/5`. Find `E(X)`.", options:[
          { t:"`3/2`", ok:true, why:"`(3/5) ÷ (2/5)`." },
          { t:"`5/2`", why:"That’s the average trial number. " + M3 },
          { t:"`2/3`", why:"That’s `p ÷ q`." },
          { t:"`3/5`", why:"That’s `q`." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"`p = 1/4`. Find " + P("at least 2 failures before the first success") + ".", options:[
          { t:"`9/16`", ok:true, why:"The first 2 trials fail: `(3/4)^2`." },
          { t:"`27/64`", why:"That’s at least 3." },
          { t:"`3/4`", why:"That’s at least 1." },
          { t:"`9/64`", why:"That’s exactly 2." }] },
        b:{ prompt:"`p = 1/3`. Find " + P("the first success comes within the first 2 trials") + ".", options:[
          { t:"`5/9`", ok:true, why:"`X ≤ 1`: `1 - (2/3)^2`." },
          { t:"`19/27`", why:"That’s within 3 trials." },
          { t:"`4/9`", why:"That’s the complement: the first 2 both fail." },
          { t:"`2/9`", why:"That’s only `X = 1`." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"For a geometric variable, `P(X = 0) = 1/5`. Find `P(X = 2)`.", options:[
          { t:"`16/125`", ok:true, why:"`p = 1/5`, so `(4/5)^2(1/5)`." },
          { t:"`4/25`", why:"`X = 2` means F, F, then S: two factors of `q`, then `p`." },
          { t:"`1/125`", why:"The failures have probability `4/5`, not `1/5`." },
          { t:"`16/25`", why:"Multiply by `p`." }] },
        b:{ prompt:"`P(X = 0) = 1/4`. Find `P(X ≥ 2)`.", options:[
          { t:"`9/16`", ok:true, why:"`p = 1/4`; `q^2 = 9/16`." },
          { t:"`27/64`", why:M6(2) },
          { t:"`3/4`", why:M6(2) },
          { t:"`9/64`", why:"That’s exactly 2." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A die is rolled. Compare " + P("the first 6 comes after exactly 2 non-6s") + " with " + P("exactly one 6 in 3 rolls") + ".", options:[
          { t:"The binomial probability is 3 times as large: `75/216` vs `25/216`, because the 6 can be in any of 3 positions", ok:true, why:"The geometric event is one order (non-6, non-6, 6); the binomial event allows all 3 orders." },
          { t:"They’re equal.", why:"The geometric case allows only one order." },
          { t:"The geometric probability is larger.", why:"It’s one of the binomial’s three orders." },
          { t:"They can’t be compared.", why:"Both are probabilities of events from 3 rolls." }] },
        b:{ prompt:"A coin is tossed. Compare " + P("the first head comes after exactly 1 tail") + " with " + P("exactly one head in 2 tosses") + ".", options:[
          { t:"The binomial probability is twice as large: `1/2` vs `1/4`", ok:true, why:"The geometric event is one order (tail, head); the binomial event allows both orders." },
          { t:"They’re equal.", why:"The geometric case allows only one order: the tail first, then the head." },
          { t:"The geometric probability is larger.", why:"It’s one of the binomial’s two orders." },
          { t:"They can’t be compared.", why:"Both are probabilities of events from 2 tosses." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Each item from a machine is defective with probability `1/50`, independently. The last 100 items were fine. Which statement is correct?", options:[
          { t:"“The next item is still defective with probability `1/50`; the machine doesn’t ‘owe’ a defect.”", ok:true, why:"Independent trials: past results don’t change `p`." },
          { t:"“A defect is overdue, so the next item is more likely to be defective.”", why:"The trials are independent. After 100 fine items, the next item is still defective with probability `1/50`." },
          { t:"“A defect is now less likely, because the machine is on a good streak.”", why:"Independent trials have no streaks." },
          { t:"“The probability is now `100/50`.”", why:"Probabilities can’t exceed 1." }] },
        b:{ prompt:"A student has rolled no 6 in 8 rolls. Which statement is correct?", options:[
          { t:"“" + P("6 on the next roll") + " is still `1/6`; past rolls don’t affect it.”", ok:true, why:"Independent rolls: the die has no memory." },
          { t:"“A 6 is due, so the probability is higher now.”", why:"The rolls are independent. After 8 misses, the next roll still has probability `1/6`." },
          { t:"“The die must be unfair.”", why:"8 rolls without a 6 happens about 23% of the time." },
          { t:"“" + P("6") + " is now `9/6`.”", why:"Impossible." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"For a waiting-time situation, `E(X) = 5`, where `X` = failed attempts before the first success. Which interpretation is correct?", options:[
          { t:"“Over many repetitions, there are 5 failures on average before the first success, so the success comes on about the 6th try on average.”", ok:true, why:"5 failures on average, then the success: about the 6th try." },
          { t:"“The success always comes on the 5th try.”", why:"`E` is an average, not a guarantee." },
          { t:"“The success comes on the 5th try on average.”", why:"That mixes failures and trials." },
          { t:"“5 failures is the most likely outcome.”", why:"0 failures is the most likely." }] },
        b:{ prompt:"`E(X) = 2` for missed calls before a call is answered. Which interpretation is correct?", options:[
          { t:"“On average, 2 calls go unanswered before one is answered, so the answer comes on about the 3rd call.”", ok:true, why:"2 missed calls on average, then the answered call: about the 3rd call." },
          { t:"“Exactly 2 calls are always missed.”", why:"`E` is an average, not a guarantee." },
          { t:"“The answer comes on the 2nd call on average.”", why:"That mixes failures and trials." },
          { t:"“2 missed calls is the most likely outcome.”", why:"0 missed calls is the most likely." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Phones are faulty with probability `1/20`, independently. An inspector tests phones until she finds a faulty one, and each test takes 2 minutes. What is the expected testing time, including the faulty phone?", options:[
          { t:"40 minutes", ok:true, why:"20 phones tested on average (19 good + 1 faulty), × 2 min." },
          { t:"38 minutes", why:"That leaves out the faulty phone’s test." },
          { t:"20 minutes", why:"That’s the number of tests; multiply by 2 min." },
          { t:"10 minutes", why:"Multiply by 2, don’t divide." }] },
        b:{ prompt:"Each call is answered with probability `1/4`, independently. Each unanswered call wastes 30 s. What is the expected time wasted on unanswered calls before one is answered?", options:[
          { t:"90 s", ok:true, why:"`E(X) = 3` unanswered calls × 30 s." },
          { t:"120 s", why:"That counts the answered call too." },
          { t:"30 s", why:"That’s one call." },
          { t:"7.5 s", why:"That’s `p × 30`." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A shooter makes 4 of every 5 free throws, independently. What is the probability that her first miss comes on or after her 4th shot?", options:[
          { t:"`64/125`", ok:true, why:"Her first 3 shots are all made: `(4/5)^3`." },
          { t:"`256/625`", why:"That’s the first 4 all made." },
          { t:"`61/125`", why:"That’s the complement." },
          { t:"`64/625`", why:"That’s the first miss on exactly the 4th shot." }] },
        b:{ prompt:"Each seed sprouts with probability `3/4`, independently. Seeds are planted one at a time. What is the probability that the first seed that fails to sprout is the 3rd or a later one?", options:[
          { t:"`9/16`", ok:true, why:"The first 2 sprout: `(3/4)^2`." },
          { t:"`27/64`", why:"That’s the first 3 all sprouting. The 3rd or a later one only needs the first 2 to sprout: `(3/4)^2`." },
          { t:"`7/16`", why:"That’s the complement." },
          { t:"`9/64`", why:"That’s exactly the 3rd seed." }] } }
    ]
  },
  task:{
    title:"Prize within `k` tries", summary:"Prize within k tries",
    statement:"<p>Design a ‘keep trying’ carnival game. A player plays until the first win and gets a prize if the win comes within the first `k` tries. Choose the win probability `p` and the prize limit `k` so that the game meets every condition. Can you find all the answers? <span class=\"mdm-model\">model game</span></p>" +
      '<ol class="gm-conds"><li>Players are expected to lose at least twice before winning: `E(X) ≥ 2`.</li><li>At least half the players get a prize.</li><li>At most three-quarters of the players get a prize, so the game makes money.</li><li>The prize limit is short: `k ≤ 4`.</li></ol>',
    checks:["Expected losses ≥ 2", "At least half get a prize", "At most three-quarters get a prize", "`k ≤ 4`"],
    tips:["`q ÷ p ≥ 2` means `p ≤ 1/3`.", "A prize within `k` tries means at most `k - 1` losses: `1 - q^k`.", "If too many win a prize, shorten `k` or lower `p`.", "Keep `k` at 4 or less."],
    explainPrompt:"Explain how `p` and `k` work against each other in your design, and use `E(X)` to describe a typical player.",
    vocab:"Use the words waiting time, expected value, complement and independent.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Lower `p` needs a longer `k` to give half the players a prize.",
    afterAt:6
  },
  cards:[
    ["Geometric (waiting-time) situation", "Independent trials with constant `p`, repeated until the first success."],
    ["`X` in this course", "The number of <strong>failures</strong> before the first success: 0, 1, 2, …"],
    ["`P(X = x)`", "`q^x p`: `x` failures, then a success."],
    ["`P(X ≥ k)`", "`q^k`: the first `k` trials all fail."],
    ["`P(X ≤ k)`", "`1 - q^{k + 1}`."],
    ["`E(X)`", "`q ÷ p`: e.g., `p = 1/6` gives 5 failures on average."],
    ["Average trial of the first success", "`1 ÷ p = E(X) + 1`."],
    ["Most likely value", "0: the bars always decrease."],
    ["Memoryless", "Past failures don’t change the chance of the next success."],
    ["Gambler’s fallacy", "Believing a success is ‘due’. Independent trials have no memory."],
    ["Geometric vs binomial", "Geometric: no fixed `n`, one order. Binomial: fixed `n`, `C(n, x)` orders."]
  ]
};
