// MDM4U 05 Independent vs Dependent Events. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/05-independent-dependent.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
const PBA = '<span class="m"><i>P</i>(<i>B</i> after <i>A</i>)</span>';
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M2 = "Mutually exclusive events can’t happen together, so if `A` happens, `P(B)` becomes 0. That’s dependence.";
const M3 = "The coin doesn’t remember. " + P("heads") + " is still `1/2`.";
const M4 = "“And” (both) is smaller than either event, so it can’t be found by adding.";
const M6 = "Seeming related (or unrelated) isn’t a test. Check the numbers.";

export default {
  id:"05-independent-dependent",
  kind:"topic",
  title:"Independent and dependent events",
  topic:"Independent vs Dependent Events",
  readyTopic:"independent and dependent events",
  hero:{
    eq:'<span class="m"><i>P</i>(<i>A</i> and <i>B</i>)</span> <span class="m">= <i>P</i>(<i>A</i>)</span> <span class="m">× <i>P</i>(<i>B</i> after <i>A</i>)</span>',
    eqLabel:"P of A and B equals P of A times P of B after A", eqSize:"sm",
    headline:"Does the first result change the second?",
    text:"Two events are <strong>independent</strong> when one tells you nothing about the other; then you multiply their probabilities. When the first result changes what’s left, as in drawing <strong>without replacement</strong>, the events are <strong>dependent</strong>, and the second probability must be <strong>updated</strong> before you multiply.",
    fig:{ html:'<div class="ixh" role="img" aria-label="A bag of 3 blue (B) and 2 yellow (Y) marbles beside a two-level tree. A blue marble is drawn and dropped back in, so the second branch after blue reads 3/5 and P(both blue) is 9/25. The scene rewinds: this time the blue marble is set aside, the bag shrinks to 4, the branch updates to 2/4, and P(both blue) changes to 3/10.">' +
      '<div class="ixh-top" aria-hidden="true"><div class="ixh-bagbox"><span class="ixh-lab">Bag</span><div class="ixh-bag" id="ixh-bag"></div></div><div class="ixh-shelfbox"><span class="ixh-lab">Set aside</span><div class="ixh-shelf" id="ixh-shelf"></div></div></div>' +
      '<p class="ixh-sw" id="ixh-sw" aria-hidden="true"></p><div class="ixh-tree" id="ixh-tree" aria-hidden="true"></div></div>' }
  },
  goals:[
    "I can decide whether two events are independent or dependent.",
    "I can find `P(A and B)` for independent events by multiplying.",
    "I can find `P(A and B)` for dependent events by updating the second probability.",
    "I can use tree diagrams for draws with and without replacement, including “one of each”.",
    "I can test for independence with data by comparing `P(A and B)` with `P(A) × P(B)`.",
    "I can explain why mutually exclusive events (with non-zero probabilities) aren’t independent."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Multiplying fractions", goal:2, prompt:"What is `3/5 × 2/4`?",
          options:[
            { t:"`3/10`", ok:true, why:"`6/20 = 3/10`." },
            { t:"`5/9`", why:"Multiply top × top, bottom × bottom." },
            { t:"`6/5`", why:"That’s `3/5 × 2`." },
            { t:"`22/20`", why:"`3/5 + 2/4` is “or”-style adding." }],
          hints:["Multiply the numerators, then the denominators.", "`6/20`.", "`3/10`."] },
        { id:"w2", skill:"Multiplying fractions", goal:2, prompt:"What is `1/2 × 1/6`?",
          options:[
            { t:"`1/12`", ok:true, why:"1 × 1 over 2 × 6." },
            { t:"`1/8`", why:"2 × 6 = 12." },
            { t:"`2/3`", why:"That’s `1/2 + 1/6`." },
            { t:"`1/3`", why:"6 ÷ 2 isn’t the product." }],
          hints:["Multiply across.", "1 × 1 over 2 × 6.", "`1/12`."] },
        { id:"w3", skill:"Counting what’s left", goal:3,
          prompt:"A bag has 5 blue and 3 yellow marbles. One blue marble is removed. What is " + P("blue") + " for the next draw?",
          options:[
            { t:"`4/7`", ok:true, why:"4 blue left among 7." },
            { t:"`5/8`", why:"The bag changed." },
            { t:"`4/8`", why:"The total also dropped to 7." },
            { t:"`5/7`", why:"One blue is gone." }],
          hints:["How many blue are left?", "4.", "4 of 7."] },
        { id:"w4", skill:"Counting what’s left", goal:4,
          prompt:"From a standard deck, an ace is drawn and not replaced. What is " + P("ace") + " for the next card?",
          options:[
            { t:"`3/51`", ok:true, why:"3 aces left among 51." },
            { t:"`4/52`", why:"After an ace is drawn, only 3 aces are left among 51 cards: `3/51`, not `4/52`." },
            { t:"`3/52`", why:"The deck has 51 cards now." },
            { t:"`4/51`", why:"One ace is gone." }],
          hints:["How many aces are left?", "How many cards?", "`3/51`."] },
        { id:"w5", skill:"“And” vs “or”", goal:6,
          prompt:"Events `A` and `B` are mutually exclusive. What is `P(A and B)`?",
          options:[
            { t:"`0`", ok:true, why:"They can’t happen together." },
            { t:"`P(A) × P(B)`", why:"That’s for independent events." },
            { t:"`P(A) + P(B)`", why:"That’s `P(A or B)` for these events." },
            { t:"`1`", why:"1 means certain." }],
          hints:["What does mutually exclusive mean?", "No outcome is in both.", "0."] },
        { id:"w6", skill:"“And” vs “or”", goal:2,
          prompt:"A coin is flipped and a die is rolled. Which is " + P("heads and a 6") + "?",
          options:[
            { t:"`1/12`", ok:true, why:"`1/2 × 1/6`, or 1 of the 12 outcomes." },
            { t:"`2/3`", why:"`1/2 + 1/6` adds." },
            { t:"`1/6`", why:"That ignores the coin." },
            { t:"`1/8`", why:"There are 12 outcomes, not 8." }],
          hints:["List the 12 outcomes (module 01).", "Only H6 works.", "`1/12`."] }
      ],
      refreshers:{
        "Multiplying fractions":"Multiply numerators and denominators; simplify at the end.",
        "Counting what’s left":"Without replacement, subtract one from the drawn colour <strong>and</strong> one from the total.",
        "“And” vs “or”":"“Or” (at least one) uses the additive principle. “And” (both) uses multiplication, with an update if the events are dependent."
      }
    }
  },
  explore:{
    heading:"Replacement switch",
    intro:"Fill a bag, draw twice, and flip the replacement switch. Watch the tree’s second branches, and the answer, change.",
    predIntro:"Make a prediction first. Then the replacement switch will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Bag: 3 blue, 2 yellow, with replacement. What is " + P("both blue") + "?",
        options:[{ t:"`9/25`", ok:true }, { t:"`3/10`" }, { t:"`6/5`" }, { t:"`3/5`" }],
        explain:"Independent draws: `3/5 × 3/5`. `6/5` adds, which can’t be right because it’s more than 1." },
      { id:"p2", prompt:"Same bag, without replacement. Now what is " + P("both blue") + "?",
        options:[{ t:"`3/10`", ok:true }, { t:"`9/25`" }, { t:"`6/5`" }, { t:"`2/5`" }],
        explain:"`3/5 × 2/4 = 3/10`." },
      { id:"p3", prompt:"The cards are replaced by a coin, and the history shows H H H H H. What is " + P("heads") + " on the next flip?",
        options:[{ t:"`1/2`", ok:true }, { t:"Less than `1/2`: tails is due" }, { t:"More than `1/2`: heads is hot" }, { t:"`1/64`" }],
        explain:"Flips are independent; the coin has no memory." },
      { id:"p4", prompt:"Cards: `A` = first card is a heart, `B` = first card is a spade (same card). `A` and `B` are mutually exclusive. Are they independent?",
        options:[{ t:"No: if `A` happens, `P(B)` becomes 0", ok:true }, { t:"Yes: they don’t overlap" }, { t:"Yes: always" }, { t:"You can’t tell" }],
        explain:"`P(A and B) = 0`, but `P(A) × P(B) = 1/16`. 0 ≠ `1/16`, so dependent." }
    ],
    chalIntro:"Set up the replacement switch, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"With replacement and no purple, set the bag so " + P("both blue") + " = `1/4`.",
        why:"Equal blue and yellow makes " + P("blue") + " = `1/2` on each draw, and `(1/2)^2 = 1/4`.",
        hints:["`1/4 = (1/2)^2`.", "You need " + P("blue") + " = `1/2` on each draw.", "Equal blue and yellow, e.g. 3 and 3."] },
      { id:"tc2", goal:[3, 4], prompt:"Without replacement and no purple, set the bag so " + P("both blue") + " = `1/5`.",
        why:"`3/6 × 2/5 = 1/5`. Another works too: 7 blue and 8 yellow, since `7/15 × 6/14 = 1/5`.",
        hints:[P("both blue") + " = `(b/n) × ((b - 1)/(n - 1))`.", "Try equal counts first: 3 and 3.", "`3/6 × 2/5 = 1/5`. Another works too: 7 blue and 8 yellow."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Two-way table mode: 200 students; 120 play a sport and 80 have a part-time job. Enter the number who do both so that “plays a sport” and “has a job” are independent.",
        why:"48 of 200 is 0.24, which equals " + P("sport") + " × " + P("job") + " = 0.6 × 0.4.",
        hints:["Independent means " + P("both") + " = " + P("sport") + " × " + P("job") + ".", "0.6 × 0.4 = 0.24.", "0.24 × 200 = 48."] }
    ]
  },
  part3:{
    slug:"test", name:"Test it",
    heading:"Test for independence",
    intro:"Real situations come as data, not marbles. At each station, make your call, then step through the test: compare `P(A and B)` with `P(A) × P(B)`. The square shows the same test as areas.",
    stations:[
      { id:"s1", chip:"1. Grade and phone brand", title:"Station 1: independent data",
        text:"100 students by grade (11 or 12) and phone brand (X or Y).",
        rowA:"Grade 12", rowNotA:"Grade 11", colB:"Brand X", colNotB:"Brand Y", a:"G12", b:"X",
        total:100, nA:50, nB:60, nAB:30,
        verdict:P("G12") + " × " + P("X") + " = 0.5 × 0.6 = 0.30 = " + P("both") + ". <strong>Independent:</strong> knowing the grade tells you nothing about the brand." },
      { id:"s2", chip:"2. Breakfast and on time", title:"Station 2: dependent data",
        text:"200 students: who ate breakfast, and who arrived on time.",
        rowA:"Ate breakfast", rowNotA:"No breakfast", colB:"On time", colNotB:"Late", a:"breakfast", b:"on time",
        total:200, nA:120, nB:150, nAB:100,
        verdict:"0.6 × 0.75 = 0.45, but " + P("both") + " = 0.50, so the events are <strong>dependent</strong>.",
        note:"Dependent isn’t the same as “causes” (module 38)." },
      { id:"s3", chip:"3. Check it with algebra", title:"Station 3: check it with algebra", data:"s2",
        text:"Station 2 again, by a second route: compare " + P("on time <strong>after</strong> knowing breakfast") + " with " + P("on time") + ".",
        steps:[
          "Look only at the 120 students who ate breakfast: 100 of them arrived on time. " + P("on time after knowing breakfast") + " = `100/120 = 5/6`.",
          "Now look at everyone: " + P("on time") + " = `150/200 = 3/4`.",
          "`5/6 ≠ 3/4`. Different, so <strong>dependent</strong>; the same verdict as station 2, by a second route."],
        alg:[
          P("on time after knowing breakfast") + " = `100/120 = 5/6`",
          P("on time") + " = `150/200 = 3/4`",
          "`5/6 ≠ 3/4` <small>Knowing about breakfast changes the probability, so the events are dependent.</small>"] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Test for independence quick check",
      items:[
        { id:"q1", goal:5, prompt:"`P(A) = 0.5`, `P(B) = 0.4`, `P(A and B) = 0.2`. Independent?",
          right:"Right. 0.5 × 0.4 = 0.2 matches.", wrong:"0.5 × 0.4 = 0.2 matches.",
          choices:[{ t:"Yes", ok:true }, { t:"No" }, { t:"Only if mutually exclusive" }, { t:"You can’t tell" }] },
        { id:"q2", goal:5, prompt:"`P(A) = 0.3`, `P(B) = 0.5`, `P(A and B) = 0.1`. Independent?",
          right:"Right. 0.3 × 0.5 = 0.15 ≠ 0.1.", wrong:"0.3 × 0.5 = 0.15 ≠ 0.1.",
          choices:[{ t:"Yes" }, { t:"No", ok:true }, { t:"Only if mutually exclusive" }, { t:"You can’t tell" }] },
        { id:"q3", goal:1, prompt:"Two cards drawn without replacement: are “first is an ace” and “second is an ace” independent?",
          right:"Right. If the first is an ace, " + P("second ace") + " is `3/51`, not `4/52`.", wrong:"If the first is an ace, " + P("second ace") + " is `3/51`, not `4/52`.",
          choices:[{ t:"No", ok:true }, { t:"Yes" }, { t:"Only for hearts" }, { t:"You can’t tell" }] },
        { id:"q4", goal:5, prompt:"In station 2, what is " + P("on time") + " among those who ate breakfast?",
          right:"Right. 100 of the 120 breakfast-eaters: `100/120 = 5/6`.", wrong:"100 of the 120 breakfast-eaters. `2/3` is breakfast among the on-time students, the reverse.",
          choices:[{ t:"`5/6`", ok:true }, { t:"`3/4`" }, { t:"`1/2`" }, { t:"`2/3`" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Independent or dependent?", summary:"Independent or dependent?", goal:1, noun:"pair of events", txt:true,
        instruction:"Decide whether each pair of events is independent or dependent.",
        boxes:[{ id:"ind", label:"Independent", sub:"one doesn’t change the other" }, { id:"dep", label:"Dependent", sub:"one changes the other’s probability" }],
        items:[
          { id:"i1", t:"Flip a coin; then roll a die", answer:"ind", why:"The coin can’t affect the die.", wrong:{ dep:"The coin can’t affect the die." } },
          { id:"i2", t:"Draw a card, keep it, draw another: both aces", answer:"dep", why:"The second draw has 51 cards.", wrong:{ ind:"The second draw has 51 cards." } },
          { id:"i3", t:"Draw a card, replace it, shuffle, draw again", answer:"ind", why:"The deck is restored.", wrong:{ dep:"The deck is restored." } },
          { id:"i4", t:"Roll a die twice: first is 6, second is 6", answer:"ind", why:"Dice have no memory.", wrong:{ dep:"Dice have no memory." } },
          { id:"i5", t:"Pick 2 marbles at once from a bag", answer:"dep", why:"At once is the same as without replacement.", wrong:{ ind:"At once is the same as without replacement." } },
          { id:"i6", t:"Spin a spinner; flip a coin", answer:"ind", why:"Separate devices.", wrong:{ dep:"Separate devices." } },
          { id:"i7", goal:6, t:"One card: “heart” and “spade”", answer:"dep", why:"Mutually exclusive, so dependent.", wrong:{ ind:"Mutually exclusive, so dependent." } },
          { id:"i8", t:"One card: “heart” and “red”", answer:"dep", why:P("red given heart") + " = 1, not `1/2`.", wrong:{ ind:P("red given heart") + " = 1, not `1/2`." } },
          { id:"i9", t:"Two different, randomly chosen students: both born in March", answer:"ind", why:"One birthday doesn’t affect the other.", wrong:{ dep:"One birthday doesn’t affect the other." } },
          { id:"i10", t:"One card: “heart” and “king”", answer:"ind",
            why:P("K♥") + " = `1/52 = 1/4 × 1/13`. They seem related, but the numbers say independent.",
            wrong:{ dep:P("K♥") + " = `1/52 = 1/4 × 1/13`. They seem related, but the numbers say independent." },
            hints:["Compute " + P("heart and king") + ".", "`1/52`.", "Compare with `1/4 × 1/13 = 1/52`: equal."] }
        ] },
      { id:"calc", type:"numeric", title:"Calculate it", summary:"Calculate it", star:true, goal:[2, 3, 4],
        instruction:"Find each probability. Give a fraction (an equivalent fraction is fine) or a decimal.",
        how:"Type a fraction such as 8/15 or a decimal such as 0.84, then press Check.",
        items:[
          { id:"s1", goal:2, prompt:"A die and a coin: " + P("even and heads"), answer:1 / 4, tol:5e-5, display:"`1/4`",
            why:"`3/6 × 1/2 = 1/4`.", wrong:[{ match:1, fb:M4 }] },
          { id:"s2", goal:3, prompt:"A bag of 4 blue and 6 yellow; two draws without replacement: " + P("both yellow"), answer:1 / 3, tol:5e-5, display:"`1/3`",
            why:"`6/10 × 5/9 = 30/90 = 1/3`.", wrong:[{ match:9 / 25, fb:"After a yellow, 5 of 9 are yellow." }] },
          { id:"s3", goal:4, star:true, prompt:"Same bag, without replacement: " + P("one of each colour"), answer:8 / 15, tol:5e-5, display:"`8/15`",
            why:"`4/10 × 6/9 + 6/10 × 4/9 = 48/90 = 8/15`.", wrong:[{ match:4 / 15, fb:"Add yellow-then-blue: `24/90 + 24/90`." }],
            hints:["Two paths: BY and YB.", "`4/10 × 6/9` and `6/10 × 4/9`.", "`48/90 = 8/15`."] },
          { id:"s4", goal:4, star:true, prompt:"Same bag, without replacement: " + P("at least one blue"), answer:2 / 3, tol:5e-5, display:"`2/3`",
            why:"1 − " + P("both yellow") + " = `1 - 1/3 = 2/3`.", general:"1 − " + P("both yellow") + " = `1 - 1/3`." },
          { id:"s5", goal:3, star:true, prompt:"Two cards without replacement: " + P("both aces"), answer:1 / 221, tol:5e-5, display:"`1/221`",
            why:"`4/52 × 3/51 = 12/2652 = 1/221`.", wrong:[{ match:1 / 169, fb:"`4/52 × 3/51 = 12/2652`." }] },
          { id:"s6", goal:2, star:true, prompt:"A spinner lands on A with probability `q`; spins are independent. " + P("A twice in a row") + " = 0.36. What is " + P("at least one A in two spins") + "?",
            answer:0.84, tol:5e-5, display:"0.84",
            why:"`q = 0.6`, so " + P("no A twice") + " = `0.4^2 = 0.16` and `1 - 0.16 = 0.84`.",
            wrong:[{ match:0.6, fb:"`q = 0.6`, so " + P("no A twice") + " = `0.4^2 = 0.16` and `1 - 0.16 = 0.84`." }],
            hints:["`q^2 = 0.36`.", "`q = 0.6`, so " + P("not A") + " = 0.4.", "`1 - 0.4 × 0.4 = 0.84`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Edwin", how:"", goal:[3, 4, 6],
        instruction:"Edwin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"A bag has 5 blue and 3 yellow marbles. Two are drawn without replacement. Find " + P("both blue") + ".",
            steps:[P("first blue") + " = `5/8`.", P("second blue") + " = `5/8`.", P("both blue") + " = `5/8 × 5/8 = 25/64`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier."],
            fixes:[
              { t:"After a blue, 4 blue remain among 7: `5/8 × 4/7 = 20/56 = 5/14`.", ok:true, why:"After a blue marble is drawn, only 4 blue are left among 7 marbles: `4/7`, not `5/8`." },
              { t:"Use `5/8 × 4/8`.", why:"The total dropped too." },
              { t:"Use `5/8 + 4/7`.", why:M4 },
              { t:"Step 2 is correct.", why:"Without replacement, the second draw depends on the first." }],
            hints:["What’s in the bag after a blue is drawn?", "4 blue, 3 yellow.", "`5/8 × 4/7 = 5/14`."] },
          { id:"e2", goal:6, task:"`A` and `B` are mutually exclusive, `P(A) = 0.3`, `P(B) = 0.4`. Find `P(A and B)`.",
            steps:["Mutually exclusive events don’t overlap.", "So `A` and `B` are independent.", "`P(A and B) = 0.3 × 0.4 = 0.12`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier."],
            fixes:[
              { t:"Not overlapping means they can’t happen together: `P(A and B) = 0`. Because 0 ≠ 0.12, they’re dependent.", ok:true, why:"They can’t both happen, so `P(A and B) = 0`, and knowing `A` happened makes `B` impossible." },
              { t:"`P(A and B) = 0.3 + 0.4 = 0.7`.", why:"That’s `P(A or B)`." },
              { t:"`P(A and B) = 0.4 - 0.3`.", why:"That has no meaning here." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Can `A` and `B` both happen?", "No.", "0."] },
          { id:"e3", goal:4, task:"A bag has 2 blue and 3 yellow. Two are drawn without replacement. Find " + P("one of each colour") + ".",
            steps:[P("blue first") + " = `2/5`.", P("yellow second, after a blue") + " = `3/4`.", "So " + P("one of each") + " = `2/5 × 3/4 = 3/10`."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Add the yellow-first path: `3/5 × 2/4 = 3/10`. Total `3/10 + 3/10 = 3/5`.", ok:true, why:"Blue then yellow, or yellow then blue: add both paths." },
              { t:"Double `2/5`: `4/5`.", why:"Doubling the first branch isn’t a path." },
              { t:"Use `2/5 × 3/5 = 6/25`.", why:"That puts the marble back. Without replacement, the second branch is `3/4`." },
              { t:"Step 3 is correct.", why:"One of each can happen in two orders." }],
            hints:["Is blue-then-yellow the only way to get one of each?", "Yellow-then-blue too.", "`3/10 + 3/10 = 3/5`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that the overall " + P("second blue") + " never changed, or that heart and king are independent?" },
      { id:"j2", q:"In your own words, what makes two events independent?" },
      { id:"j3", q:"Explain to a friend how to build the tree for drawing two marbles without replacement." },
      { id:"j4", q:"Which do you still mix up: mutually exclusive or independent? How will you tell them apart next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which pair of events is independent?", options:[
          { t:"Rolling a 6 on a die, then flipping heads on a coin", ok:true, why:"Separate devices." },
          { t:"Drawing an ace, then another ace, without replacement", why:"After an ace is drawn, only 3 aces are left among 51 cards, so the second draw depends on the first." },
          { t:"Drawing a heart and drawing a red card, on the same draw", why:P("red given heart") + " = 1." },
          { t:"Choosing two different students, one after the other, for two roles from the same small group: “first is in Grade 12” and “second is in Grade 12”", why:"The first choice changes who’s left." }] },
        b:{ prompt:"Which pair of events is dependent?", options:[
          { t:"Drawing two marbles without replacement: first blue, second blue", ok:true, why:"The first marble isn’t put back, so it changes what’s left for the second draw." },
          { t:"Flipping two coins: first heads, second heads", why:M3 },
          { t:"Rolling two dice: first even, second even", why:"Separate dice." },
          { t:"Spinning a spinner twice: first A, second A", why:"The spinner doesn’t remember: each spin has the same probabilities." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A die is rolled and a coin is flipped. What is " + P("a number greater than 4 and tails") + "?", options:[
          { t:"`1/6`", ok:true, why:"`2/6 × 1/2`." },
          { t:"`5/6`", why:"`1/3 + 1/2` adds." },
          { t:"`1/12`", why:"“Greater than 4” is 5 or 6: `2/6`, not `1/6`." },
          { t:"`1/2`", why:"That ignores the die." }] },
        b:{ prompt:"A die is rolled and a coin is flipped. What is " + P("an even number and heads") + "?", options:[
          { t:"`1/4`", ok:true, why:"`3/6 × 1/2`." },
          { t:"`1`", why:"`1/2 + 1/2`." },
          { t:"`1/12`", why:"Even is 2, 4 or 6: `3/6`." },
          { t:"`1/2`", why:"That ignores the die." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"`A` and `B` are mutually exclusive with `P(A) = 0.2` and `P(B) = 0.5`. Which is true?", options:[
          { t:"`P(A and B) = 0`, so `A` and `B` are dependent", ok:true, why:"0 ≠ 0.2 × 0.5." },
          { t:"`P(A and B) = 0.1`, so they’re independent", why:M2 },
          { t:"`P(A and B) = 0.7`", why:M4 },
          { t:"They’re independent because they don’t overlap", why:M2 }] },
        b:{ prompt:"`A` and `B` are mutually exclusive with `P(A) = 0.25` and `P(B) = 0.6`. Which is true?", options:[
          { t:"`P(A and B) = 0`, so `A` and `B` are dependent", ok:true, why:"0 ≠ 0.25 × 0.6." },
          { t:"`P(A and B) = 0.15`, so they’re independent", why:M2 },
          { t:"`P(A and B) = 0.85`", why:M4 },
          { t:"They’re independent because they don’t overlap", why:M2 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A bag has 4 blue and 6 yellow marbles. Two are drawn without replacement. What is " + P("both blue") + "?", options:[
          { t:"`2/15`", ok:true, why:"`4/10 × 3/9 = 12/90`." },
          { t:"`4/25`", why:"`4/10 × 4/10` replaces the marble." },
          { t:"`8/45`", why:"`4/10 × 4/9` forgets that a blue was removed." },
          { t:"`4/5`", why:"`4/10 + 4/10` adds." }] },
        b:{ prompt:"A bag has 5 blue and 5 yellow marbles. Two are drawn without replacement. What is " + P("both yellow") + "?", options:[
          { t:"`2/9`", ok:true, why:"`5/10 × 4/9 = 20/90`." },
          { t:"`1/4`", why:"`5/10 × 5/10` replaces the marble." },
          { t:"`5/18`", why:"`5/10 × 5/9`: if the first marble was yellow, take one away from yellow <strong>and</strong> from the total." },
          { t:"`1`", why:"`5/10 + 5/10` adds. " + M4 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A bag has 3 blue and 2 yellow marbles. Two are drawn without replacement. What is " + P("one of each colour") + "?", options:[
          { t:"`3/5`", ok:true, why:"`3/5 × 2/4 + 2/5 × 3/4 = 6/20 + 6/20`." },
          { t:"`3/10`", why:"That’s only blue then yellow." },
          { t:"`12/25`", why:"`2 × 3/5 × 2/5` replaces the marble." },
          { t:"`6/25`", why:"One order, with replacement." }] },
        b:{ prompt:"A bag has 4 blue and 2 yellow marbles. Two are drawn without replacement. What is " + P("one of each colour") + "?", options:[
          { t:"`8/15`", ok:true, why:"`2 × (4/6 × 2/5) = 16/30`." },
          { t:"`4/15`", why:"That’s only one order. Blue then yellow, or yellow then blue: add both paths." },
          { t:"`4/9`", why:"`2 × 4/6 × 2/6` replaces the marble." },
          { t:"`2/9`", why:"One order, with replacement." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Model data: 250 adults; 150 exercise regularly, 100 sleep 8+ hours, 60 do both. Are “exercises” and “sleeps 8+ hours” independent?", options:[
          { t:"Yes: 0.6 × 0.4 = 0.24 = `60/250`", ok:true, why:"`P(A and B)` equals `P(A) × P(B)`." },
          { t:"No: 60 isn’t equal to 100", why:"That compares the wrong things." },
          { t:"No: 60 isn’t half of 150", why:"Half has nothing to do with the test." },
          { t:"You can’t tell without knowing what causes what", why:"Independence is checked with numbers, not causes." }] },
        b:{ prompt:"Model data: 300 students; 180 take the bus, 120 play an instrument, 60 do both. Are the events independent?", options:[
          { t:"No: 0.6 × 0.4 = 0.24, but `60/300` = 0.20", ok:true, why:"`P(A and B)` doesn’t equal `P(A) × P(B)`, so the events are dependent." },
          { t:"Yes: the activities seem unrelated", why:M6 },
          { t:"Yes: 60 is less than 120", why:"Size alone doesn’t test independence." },
          { t:"No: 180 is more than 120", why:"That compares the wrong things." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why, for one card, “heart” and “spade” are not independent?", options:[
          { t:"They’re mutually exclusive: if the card is a heart, " + P("spade") + " drops from `1/4` to 0, so one event changes the other’s probability.", ok:true, why:"It names the change: knowing one event happened makes the other impossible." },
          { t:"They’re independent because they don’t overlap.", why:M2 },
          { t:"They’re dependent because hearts and spades are different colours.", why:"Colour isn’t the reason." },
          { t:"They’re independent because each suit has 13 cards.", why:"Equal sizes don’t make events independent." }] },
        b:{ prompt:"Which best explains why “first card is an ace” and “second card is an ace” are dependent without replacement?", options:[
          { t:"If the first card is an ace, only 3 aces remain among 51 cards, so " + P("second ace") + " changes from `4/52` to `3/51`.", ok:true, why:"It shows the second probability changing." },
          { t:"Because aces are rare.", why:"Rarity isn’t dependence." },
          { t:"Because the second ace is counted twice.", why:"Nothing is double counted here." },
          { t:"They’re independent because the deck is shuffled.", why:"Shuffling doesn’t put the first card back: the second draw comes from 51 cards." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which tree correctly shows drawing 2 marbles <strong>without</strong> replacement from 3 blue and 2 yellow?", options:[
          { t:"First branches `3/5` blue and `2/5` yellow; after blue: `2/4` blue, `2/4` yellow; after yellow: `3/4` blue, `1/4` yellow", ok:true, why:"Each second branch has 4 marbles, with one fewer of the colour just drawn." },
          { t:"Every branch is `3/5` blue and `2/5` yellow", why:"That’s with replacement." },
          { t:"After blue: `2/5` blue, `2/5` yellow", why:"The total drops to 4." },
          { t:"After blue: `3/4` blue, `1/4` yellow", why:"Blue drops, not yellow." }] },
        b:{ prompt:"Which tree correctly shows drawing 2 marbles <strong>with</strong> replacement from 3 blue and 2 yellow?", options:[
          { t:"Every branch is `3/5` blue and `2/5` yellow", ok:true, why:"The bag is restored after each draw, so the branches repeat." },
          { t:"After blue: `2/4` blue, `2/4` yellow", why:"That’s without replacement." },
          { t:"After blue: `2/5` blue, `3/5` yellow", why:"The bag is restored, so nothing changes." },
          { t:"After blue: `3/4` blue, `1/4` yellow", why:"The bag still holds 5." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A goalie stops 80% of penalty shots, and shots are independent. What is " + P("she stops the next two") + "?", options:[
          { t:"0.64", ok:true, why:"0.8 × 0.8." },
          { t:"1.6", why:"A probability can’t exceed 1." },
          { t:"0.8", why:"That’s one shot." },
          { t:"0.16", why:"0.8 × 0.2 is a stop, then a goal." }] },
        b:{ prompt:"A basketball player makes 70% of free throws, independently. What is " + P("she makes the next two") + "?", options:[
          { t:"0.49", ok:true, why:"0.7 × 0.7." },
          { t:"1.4", why:"A probability can’t exceed 1. " + M4 },
          { t:"0.7", why:"That’s one shot." },
          { t:"0.21", why:"0.7 × 0.3 is a make, then a miss." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"An inspector takes 2 phones, without replacement, from a box of 10 in which 2 are defective. What is " + P("both are defective") + "?", options:[
          { t:"`1/45`", ok:true, why:"`2/10 × 1/9`." },
          { t:"`1/25`", why:"`2/10 × 2/10` replaces the phone." },
          { t:"`2/5`", why:"`2/10 + 2/10` adds. " + M4 },
          { t:"`2/45`", why:"`2/10 × 2/9` forgets that one defective phone is gone." }] },
        b:{ prompt:"A box of 12 batteries has 3 dead ones. Two are taken without replacement. What is " + P("both are dead") + "?", options:[
          { t:"`1/22`", ok:true, why:"`3/12 × 2/11 = 6/132`." },
          { t:"`1/16`", why:"`3/12 × 3/12` replaces the battery." },
          { t:"`1/2`", why:"`3/12 + 3/12` adds. " + M4 },
          { t:"`3/44`", why:"`3/12 × 3/11` forgets that one dead battery is gone." }] } }
    ]
  },
  task:{
    title:"Bag designer", summary:"Bag designer",
    statement:"<p>Design a bag of blue, yellow and purple marbles. Two marbles will be drawn <strong>without replacement</strong>. Make every condition true. Can you find all the answers?</p><ol class=\"ix-conds\"><li>Every colour is in the bag.</li><li>The first marble drawn is purple exactly `1/4` of the time.</li><li>The bag holds at most 12 marbles.</li><li>" + P("both marbles are blue") + " is between `1/10` and `1/5`, inclusive.</li></ol>",
    checks:["Every colour present", "First purple `1/4` of the time", "At most 12 marbles", "Both blue between `1/10` and `1/5`"],
    tips:["Add at least one of each colour.",
      "Purple must be a quarter of the bag, so `n` is a multiple of 4: 4, 8 or 12.",
      "Keep the total at 12 or less.",
      P("both blue") + " = `(b/n) × ((b - 1)/(n - 1))`. Too few blue gives too small a probability; too many gives too large."],
    explainPrompt:"Explain why the second branch of your tree uses `n - 1` and `b - 1`, and how you found the right number of blue marbles.",
    vocab:"Use the words dependent, without replacement, tree diagram and probability.",
    more:"There’s more than one answer. Can you find another?",
    after3:"Condition 2 forces `n` = 4, 8 or 12, with 1, 2 or 3 purple. For each size, exactly one number of blue marbles lands between `1/10` and `1/5`."
  },
  cards:[
    ["Independent events", "One doesn’t change the probability of the other."],
    ["“And” for independent events", "`P(A and B) = P(A) × P(B)`."],
    ["“And” for dependent events", "`P(A and B) = P(A) ×` " + PBA + "."],
    ["With replacement", "Draws are independent: the branches repeat."],
    ["Without replacement", "Draws are dependent: subtract 1 from the colour <strong>and</strong> the total."],
    ["One of each colour", "Add both orders: blue-yellow and yellow-blue."],
    ["Test for independence", "Does `P(A and B)` equal `P(A) × P(B)`?"],
    ["Mutually exclusive vs independent", "Mutually exclusive (non-zero) events are always <strong>dependent</strong>."],
    ["Gambler’s fallacy", "A streak doesn’t change the next independent trial."],
    ["At least one", "1 − " + P("none") + ", e.g. `1 - (0.4)^2` for two independent trials."],
    ["Heart and king", "Independent: `1/52 = 1/4 × 1/13`."],
    ["Drawing “at once”", "Same as without replacement."]
  ]
};
