// MDM4U 18 Discrete Random Variables & Probability Distributions. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/18-discrete-random-variables.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
const X = "<i>X</i>";
// Core feedback sentences for the plan's misconceptions (§3), adapted where the plan names only the code.
const M1 = "‘Heads, tails, heads’ is an outcome; `X = 2` heads is the number we record.";
const M5 = "Goals in a game can be counted; the time of the first goal can’t.";

export default {
  id:"18-discrete-random-variables",
  kind:"topic",
  title:"Discrete random variables",
  topic:"Discrete Random Variables & Probability Distributions",
  readyTopic:"discrete random variables",
  hero:{
    eq:'<span class="dr-heq">outcome <span class="dr-har" aria-hidden="true">⟶</span> `X` = number <span class="dr-har" aria-hidden="true">⟶</span> table of `P(X = x)` <span class="dr-har" aria-hidden="true">⟶</span> probability histogram</span>',
    eqLabel:"An outcome becomes a number X, the numbers become a table of P of X equals x, and the table becomes a probability histogram.",
    eqSize:"sm",
    headline:"Turn outcomes into numbers",
    text:"A <strong>random variable</strong> `X` attaches a number to every outcome. Gather the outcomes that share a number and you get a <strong>probability distribution</strong>: each value with its probability. Draw it as a <strong>probability histogram</strong>, where every bar’s area is a probability and the areas add to 1.",
    fig:{ aria:"The 36 outcomes of rolling two dice appear as a 6 by 6 grid. Each cell shows its sum. Cells with equal sums slide down into stacks above a number line from 2 to 12, forming a triangular histogram. Labels read 6/36 over 7 and 1/36 over 2 and 12. Caption: total area = 1.", shape:"square" }
  },
  goals:[
    "I can identify a discrete random variable and list its possible values, and tell it apart from a continuous one.",
    "I can build a probability distribution table from a sample space.",
    "I can check that a distribution is valid and find a missing probability.",
    "I can draw and read a probability histogram, using area as probability.",
    "I can recognize a uniform distribution and find probabilities like `P(X <= k)`.",
    "I can compare a simulated distribution with the theoretical one and judge the differences."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Outcomes vs numbers", goal:1, prompt:"Three coins are tossed. Let `X` = the number of heads. Which is a value of `X`?",
          options:[
            { t:"2", ok:true, why:"`X` counts heads, so its values are 0, 1, 2, 3." },
            { t:"HTH", why:"HTH is an outcome; `X = 2` for it." },
            { t:"Heads", why:"‘Heads’ describes an outcome, not a number. " + M1 },
            { t:"`1/8`", why:"`1/8` is `P(X = 0)`." }],
          hints:["What does `X` count?", "Heads in three tosses.", "0, 1, 2 or 3."] },
        { id:"w2", skill:"Sample spaces", goal:2, prompt:"Three coins are tossed. How many outcomes give exactly 1 head?",
          options:[
            { t:"3", ok:true, why:"HTT, THT, TTH." },
            { t:"1", why:"The head can be in any of 3 positions." },
            { t:"4", why:"That counts the 4 values of `X`." },
            { t:"8", why:"8 counts every outcome. Only HTT, THT and TTH have exactly 1 head." }],
          hints:["Where can the single head be?", "First, second or third coin.", "3."] },
        { id:"w3", skill:"Sample spaces", goal:2, prompt:"Two dice are rolled. How many outcomes have a sum of 4?",
          options:[
            { t:"3", ok:true, why:"(1, 3), (2, 2), (3, 1)." },
            { t:"2", why:"(1, 3) and (3, 1) are different." },
            { t:"4", why:"(2, 2) is one cell." },
            { t:"1", why:"Count the outcomes behind the value: (1, 3), (2, 2) and (3, 1) all give 4." }],
          hints:["List the pairs.", "(1, 3), (2, 2), (3, 1).", "3."] },
        { id:"w4", skill:"Probability sums", goal:3, prompt:"The probabilities of all outcomes of an experiment add to…",
          options:[
            { t:"1", ok:true, why:"Something must happen." },
            { t:"100", why:"100% = 1." },
            { t:"The number of outcomes", why:"That counts outcomes. Their probabilities add to 1." },
            { t:"It depends on the experiment", why:"Always 1." }],
          hints:["What’s the probability that <em>some</em> outcome happens?", "Certain.", "1."] },
        { id:"w5", skill:"Without replacement", goal:2, prompt:"A bag has 2 red and 3 blue marbles. Two are drawn without replacement. What is " + P("both blue") + "?",
          options:[
            { t:"`3/10`", ok:true, why:"`3/5 × 2/4`." },
            { t:"`9/25`", why:"The first blue isn’t put back." },
            { t:"`2/5`", why:"That’s not ‘both blue’." },
            { t:"`6/5`", why:"Both draws must be blue: multiply, don’t add. A probability can’t be more than 1." }],
          hints:["Second draw: what’s left?", "4 marbles, 2 blue.", "`3/5 × 2/4 = 3/10`."] },
        { id:"w6", skill:"Discrete vs continuous", goal:1, prompt:"Which variable is continuous?",
          options:[
            { t:"The time to run 100 m", ok:true, why:"Any value in a range is possible." },
            { t:"The number of siblings", why:"Siblings are counted." },
            { t:"The number of goals in a game", why:M5 },
            { t:"The number on a die", why:"A die shows 1, 2, 3, 4, 5 or 6: values you can count." }],
          hints:["Can you count the possible values?", "Time can be 12.3 s, 12.31 s, …", "Time."] }
      ],
      refreshers:{
        "Outcomes vs numbers":"An outcome is what happens; the random variable is the number you record for it.",
        "Sample spaces":"List or grid every outcome; ordered pairs like (1, 3) and (3, 1) are different.",
        "Probability sums":"All the probabilities of a sample space add to 1.",
        "Without replacement":"After each draw, the bag has one fewer marble.",
        "Discrete vs continuous":"Discrete: countable values. Continuous: any value in an interval."
      }
    }
  },
  explore:{
    heading:"Variable builder",
    intro:"Pick an experiment and a rule. The outcomes gather into a distribution.",
    predIntro:"Make a prediction first. Then the variable builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ exp:"dice", rule:"max" },
        prompt:"Two dice, maximum. Which value of the larger number is most likely?",
        options:[{ t:"6", ok:true }, { t:"3 or 4" }, { t:"They’re all equally likely" }, { t:"1" }],
        explain:"For the maximum to be 6, either die can be 6: 11 cells. The stacks hold 1, 3, 5, 7, 9 and 11 cells." },
      { id:"p2", start:{ exp:"dice", rule:"diff" },
        prompt:"Two dice, difference. Which difference is most likely?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"5" }, { t:"All equally likely" }],
        explain:"A difference of 1 has 10 cells: (1, 2), (2, 1), …, (5, 6), (6, 5). The stacks hold 6, 10, 8, 6, 4 and 2 cells." },
      { id:"p3", start:{ exp:"coins", rule:"heads" },
        prompt:"Three coins. How many times as likely is `X = 1` as `X = 0`?",
        options:[{ t:"3 times", ok:true }, { t:"Equally likely" }, { t:"Twice" }, { t:"8 times" }],
        explain:"HTT, THT, TTH vs TTT: 3 outcomes vs 1." },
      { id:"p4", start:{ exp:"dice", rule:"sum", seed:2 },
        prompt:"Compare mode, two-dice sum, 36 simulated rolls. Will the simulated bars match the theoretical bars exactly?",
        options:[{ t:"No: they’ll wobble, and get closer with more rolls", ok:true }, { t:"Yes, exactly" }, { t:"Yes, after 36 rolls every sum appears its expected number of times" }, { t:"No, and more rolls make it worse" }],
        explain:"Simulated bars wobble around the theoretical ones; more trials, smaller wobble. The total difference shrank from 36 to 360 to 3600 rolls." }
    ],
    chalIntro:"Use the variable builder to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Build the distribution of `X` = the number of sixes when two dice are rolled. (Build mode, Auto off: tap the cells yourself.)",
        why:"25 cells have no 6, 10 have exactly one and only (6, 6) has two: `P(0) = 25/36`, `P(1) = 10/36`, `P(2) = 1/36`.",
        hints:["How many cells have no 6?", "5 × 5 = 25 with no 6; (6, 6) is the only cell with two.", "36 − 25 − 1 = 10 cells with exactly one 6."] },
      { id:"tc2", goal:[3, 5], prompt:"Check mode: a table has `x` = 0, 1, 2, 3 with probabilities 0.1, 0.3, `k`, `2k`. Set `k` to make it valid, then set the probe to show `P(X ≥ 2)`.",
        why:"0.1 + 0.3 + `k` + `2k` = 1 gives `3k = 0.6`, so `k = 0.2`. Then `P(X ≥ 2) = 0.2 + 0.4 = 0.6`.",
        hints:["Everything adds to 1.", "0.1 + 0.3 + `k` + `2k` = 1.", "`3k = 0.6`, so `k = 0.2`; `P(X ≥ 2) = 0.2 + 0.4 = 0.6`."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Custom table: design a distribution for `X` with values 1, 2, 3, 4 and probabilities in steps of 0.05 (none zero), so that:<ul class=\"dr-conds\"><li>`P(X = 4) = 2 × P(X = 1)`;</li><li>`P(X <= 2) = 0.4`;</li><li>3 is the single most likely value.</li></ul>",
        why:"`p_4 = 2p_1`, `p_1 + p_2 = 0.4`, the total is 1 and `p_3` beats every other value. Only two designs work in steps of 0.05: (0.05, 0.35, 0.50, 0.10) and (0.10, 0.30, 0.40, 0.20).",
        hints:["If `P(X <= 2) = 0.4`, then `p_3 + p_4 = 0.6`.", "`p_4 = 2p_1`, so `p_3 = 0.6 - 2p_1`. It must beat `p_2 = 0.4 - p_1` and `p_4 = 2p_1`.", "`p_1` must be less than 0.15: try 0.05 or 0.10."] }
    ]
  },
  part3:{
    slug:"compare", name:"Compare",
    heading:"Simulated vs theoretical",
    intro:"A probability histogram is a prediction. Here you test it: compare simulated bars with the exact ones, judge two dice from their data, and read a probability as an area.",
    stations:[
      { id:"s1", title:"How close is close?",
        text:"The sum of two dice, simulated with 36, 360 and 3600 rolls (the same seeded rolls every time). The total difference adds up the gaps between the simulated and theoretical bars: Σ|simulated − theoretical|.",
        after:"The total difference shrinks as the rolls pile up: simulated bars wobble around the theoretical ones and settle with more trials." },
      { id:"s2", title:"Is this die fair?",
        text:"Two dice were each rolled 600 times. A fair die should show each face about 600 × `1/6` = 100 times. Which die is likely loaded?",
        a:[98, 104, 95, 101, 99, 103], b:[86, 87, 85, 86, 84, 172],
        right:"Die B shows a six 172 times, about twice as often as each other face (about 86). That gap is far too big for chance. Die A’s counts all sit within 5 of 100: ordinary chance variation.",
        wrongA:"Die A’s counts all sit within 5 of 100. That’s ordinary chance variation. Look at Die B’s sixes.",
        wrongBoth:"Die A’s counts all sit within 5 of 100: ordinary chance variation. Only one die has a gap too big for chance.",
        wrongNone:"Die B shows 172 sixes, far above the expected 100, while its other faces sit near 86. That’s too big a gap for chance.",
        explain:"Explain your judgement in a sentence or two." },
      { id:"s3", title:"Area = probability",
        text:"A spinner shows 1 with probability `1/4`, 2 with `1/2` and 3 with `1/4`. Drag the edges of the shaded region over the bars to find `P(X ≥ 2)` as an area.",
        counts:[10, 20, 10],
        freqNote:"The heights are now counts out of 40 spins (model data), so the total area is 40, not 1. Bar heights are probabilities, so the total area is 1, not the number of trials." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Simulated vs theoretical quick check",
      items:[
        { id:"q1", goal:4, prompt:"The total area of a probability histogram is…",
          choices:[
            { t:"1", ok:true, fb:"Right. Heights are probabilities and widths are 1, so the areas add to 1." },
            { t:"the number of trials", fb:"Heights are probabilities and widths are 1." },
            { t:"100", fb:"Heights are probabilities and widths are 1." },
            { t:"the largest value", fb:"Heights are probabilities and widths are 1." }] },
        { id:"q2", goal:6, prompt:"In 36 simulated rolls, a sum of 7 came up 9 times. Empirical `P(7)`?",
          choices:[
            { t:"`1/4`", ok:true, fb:"Right. `9/36 = 1/4`; the theoretical value is `1/6`." },
            { t:"`1/6`", fb:"`9/36`; the theoretical value is `1/6`." },
            { t:"`9/7`", fb:"`9/36`; the theoretical value is `1/6`." },
            { t:"`7/36`", fb:"`9/36`; the theoretical value is `1/6`." }] },
        { id:"q3", goal:6, prompt:"With more simulated trials, the simulated histogram…",
          choices:[
            { t:"gets closer to the theoretical one", ok:true, fb:"Right. Law of large numbers: more trials, smaller wobble." },
            { t:"matches it exactly", fb:"Law of large numbers." },
            { t:"drifts away", fb:"Law of large numbers." },
            { t:"stays equally far", fb:"Law of large numbers." }] },
        { id:"q4", goal:6, prompt:"Die B (600 rolls) shows 172 sixes and about 86 of each other face. Best conclusion?",
          choices:[
            { t:"Likely loaded toward 6", ok:true, fb:"Right. 172 is far above the expected 100, while the others are near 86: too big a gap for chance." },
            { t:"Fair: dice vary", fb:"172 is far above the expected 100, while the others are near 86: too big a gap for chance." },
            { t:"Fair: 172 is close to 100", fb:"172 is far above the expected 100, while the others are near 86: too big a gap for chance." },
            { t:"Can’t judge with 600 rolls", fb:"172 is far above the expected 100, while the others are near 86: too big a gap for chance." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Experiment ↔ distribution", summary:"Experiment ↔ distribution", goal:[2, 5],
        instruction:"Match each experiment and variable with its distribution. One distribution is left over.",
        leftTitle:"Experiment and variable", rightTitle:"Distribution",
        left:[
          { id:"l1", goal:2, t:"Two coins: `X` = number of heads", why:"HH, HT, TH, TT: 1 head happens two ways, so `P(1) = 2/4 = 1/2`." },
          { id:"l2", goal:5, t:"One fair die: `X` = the number shown", why:"Six equally likely faces: a uniform distribution." },
          { id:"l3", goal:2, t:"Two dice: `X` = number of sixes", why:"25 cells with no 6, 10 with one, 1 with two." },
          { id:"l4", goal:2, t:"Two draws without replacement from 2 red and 3 blue: `X` = number of red", why:"`3/5 × 2/4 = 3/10` for no red, `2/5 × 1/4 = 1/10` for two red, and `6/10` for one." },
          { id:"l5", goal:2, t:"Two dice: `X` = the larger number", why:"The larger number is `x` in `2x - 1` cells.",
            hints:["When is the larger number 3?", "(3, 1), (3, 2), (3, 3), (1, 3), (2, 3): 5 cells.", "`(2 × 3 - 1)/36`."] },
          { id:"l6", goal:2, t:"Two dice: `X` = sum", why:"Sums near 7 have the most cells: 6 of 36 for a sum of 7." }
        ],
        right:[
          { id:"r1", t:"0: `1/4` · 1: `1/2` · 2: `1/4`" },
          { id:"r2", t:"`1/6` for each of 1–6 (uniform)" },
          { id:"r3", t:"0: `25/36` · 1: `10/36` · 2: `1/36`" },
          { id:"r4", t:"0: `3/10` · 1: `6/10` · 2: `1/10`" },
          { id:"r5", t:"`(2x - 1)/36` for `x` = 1–6" },
          { id:"r6", t:"`1/36`, `2/36`, …, `6/36`, …, `1/36` for 2–12" },
          { id:"r7", t:"0: `9/25` · 1: `12/25` · 2: `4/25`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6" },
        wrong:{
          "l4|r7":"That puts the first marble back.",
          "l1|r2":"1 head can happen two ways."
        },
        wrongDefault:"List the outcomes and group them by `X`." },
      { id:"builder", type:"custom", title:"Distribution builder", summary:"Distribution builder", goal:[2, 3, 5], star:true,
        instruction:"Find each probability. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a fraction such as 3/8 or a decimal such as 0.375 (round to 4 places if it doesn’t end), then press Check.",
        items:[
          { id:"n1", goal:2, prompt:"Three coins: " + P(X + " = 2 heads") + "?", answer:3 / 8, display:"`3/8`",
            why:"HHT, HTH, THH: 3 of the 8 outcomes.",
            wrong:[{ match:1 / 4, fb:"4 values aren’t equally likely." }] },
          { id:"n2", goal:3, prompt:"A table has probabilities 0.15, 0.25, 0.35 and `k`. Find `k`.", answer:0.25, display:"`k = 0.25`", label:"`k` =",
            why:"1 − (0.15 + 0.25 + 0.35) = 1 − 0.75 = 0.25.",
            wrong:[{ match:0.35, fb:"0.15 + 0.25 + 0.35 = 0.75." }] },
          { id:"n3", goal:5, prompt:"Two dice, sum: `P(X ≥ 10)`?", answer:1 / 6, display:"`1/6`",
            why:"Sums 10, 11 and 12: 3 + 2 + 1 = 6 of the 36 cells.",
            wrong:[{ match:1 / 12, fb:"Include 10: 3 + 2 + 1 = 6 cells." }] },
          { id:"n4", goal:5, star:true, prompt:"Two dice, maximum: `P(X <= 3)`?", answer:1 / 4, display:"`1/4`",
            why:"Maximum 1, 2 or 3: 1 + 3 + 5 = 9 of the 36 cells.",
            wrong:[{ match:5 / 36, fb:"≤ 3 means 1, 2 or 3: 1 + 3 + 5 = 9 cells." }] },
          { id:"n5", goal:3, star:true, prompt:"`P(X = x) = (x + 1)/c` for `x` = 0, 1, 2, 3. Find `c`, then `P(X = 3)`.", answer:[10, 0.4], display:"`c = 10`; `P(X = 3) = 0.4`",
            parts:["`c` =", "`P(X = 3)` ="],
            why:"(1 + 2 + 3 + 4)/`c` = 1, so `c = 10`; `P(X = 3) = 4/10 = 0.4`.",
            wrong:[{ part:0, match:6, fb:"Add (0 + 1) + (1 + 1) + (2 + 1) + (3 + 1) = 10." }],
            hints:["The probabilities must add to 1.", "(1 + 2 + 3 + 4)/`c` = 1.", "`c = 10`; `P(3) = 4/10`."] },
          { id:"n6", goal:2, star:true, prompt:"A bag has 3 red and 2 blue marbles. Draw without replacement <strong>until</strong> a blue appears; `X` = number of draws. Find `P(X = 3)`.", answer:1 / 5, display:"`1/5`",
            why:"Red, red, then blue: `3/5 × 2/4 × 2/3 = 12/60 = 1/5`.",
            wrong:[{ match:18 / 125, fb:"That’s with replacement. Without replacement: `3/5 × 2/4 × 2/3`." }],
            hints:["`X = 3` means red, red, then blue.", "`3/5`, then `2/4`, then `2/3`.", "`= 12/60 = 1/5`. Check: `P(1) = 2/5`, `P(2) = 3/10`, `P(3) = 1/5`, `P(4) = 1/10`, which add to 1."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Sebastian", how:"", goal:[2, 3, 5],
        instruction:"Sebastian made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find `P(X = 7)`, where `X` is the sum of two dice.",
            steps:["The possible sums are 2, 3, …, 12.", "That’s 11 values, so each has probability `1/11`.", "`P(X = 7) = 1/11`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Count outcomes: 6 of the 36 give 7, so `P = 1/6`.", ok:true, why:"Count the outcomes behind each value: a sum of 7 has 6 ways, a sum of 2 has 1." },
              { t:"`P = 7/36`.", why:"7 is the sum, not the number of cells. 6 of the 36 cells give 7." },
              { t:"`P = 1/12`.", why:"The sums still aren’t equally likely. 6 of the 36 cells give 7." },
              { t:"Step 2 is correct.", why:"Sums aren’t equally likely." }],
            hints:["Is a sum of 2 as likely as a sum of 7?", "1 way vs 6 ways.", "`6/36`."] },
          { id:"e2", goal:3, task:"Build the distribution of `X` = number of heads in 3 coin tosses.",
            steps:["The values of `X` are 1, 2, 3.", "`P(1) = 3/8`, `P(2) = 3/8`, `P(3) = 1/8`.", "That’s the whole distribution."],
            answer:0,
            stepFb:["", "These probabilities are right for those values, but one value is missing.", "The probabilities add to `7/8`, not 1."],
            fixes:[
              { t:"Values 0, 1, 2, 3; add `P(0) = 1/8` (TTT), so the total is 1.", ok:true, why:"Did you include `X = 0`? A valid distribution adds to 1." },
              { t:"Make `P(3) = 2/8`.", why:"HHH is the only outcome with 3 heads. The missing `1/8` belongs to TTT, `X = 0`." },
              { t:"Divide each by `7/8`.", why:"That changes correct probabilities. The missing `1/8` belongs to TTT, `X = 0`." },
              { t:"Step 1 is correct.", why:"TTT gives `X = 0`." }],
            hints:["Can you get no heads?", "TTT.", "Include `X = 0`."] },
          { id:"e3", goal:5, task:"`X` = the larger of two dice. Find `P(X <= 2)`.",
            steps:["`P(X = m) = (2m - 1)/36`.", "`P(X <= 2) = P(X = 2)`.", "`= 3/36 = 1/12`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"`P(X <= 2) = P(1) + P(2) = 1/36 + 3/36 = 1/9`.", ok:true, why:"‘≤ 2’ includes 2 and 1. List the values: 1 and 2." },
              { t:"`P(X = 1) = 1/36`.", why:"‘≤ 2’ includes 2 as well as 1." },
              { t:"`P(X = 3) = 5/36`.", why:"3 isn’t ≤ 2. List the values: 1 and 2." },
              { t:"Step 2 is correct.", why:"‘≤ 2’ includes 1 as well as 2." }],
            hints:["Which values are ≤ 2?", "1 and 2.", "`4/36 = 1/9`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the variable builder: the maximum’s shape, the difference’s shape, or how fast the simulation settled?" },
      { id:"j2", q:"In your own words, what makes a table a valid probability distribution?" },
      { id:"j3", q:"Explain to a friend why each bar’s area in a probability histogram is a probability." },
      { id:"j4", q:"Which step in building a distribution still trips you up (listing outcomes, grouping, or checking)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is a discrete random variable?", options:[
          { t:"The number of goals scored in a hockey game", ok:true, why:"Goals are counted: 0, 1, 2, …" },
          { t:"The time until the first goal", why:"Time takes any value in a range." },
          { t:"The height of a player", why:"Height takes any value in a range, so it’s continuous." },
          { t:"“Goal or no goal” on a shot", why:"That’s an outcome; a random variable is a number." }] },
        b:{ prompt:"Which is <strong>not</strong> a discrete random variable?", options:[
          { t:"The mass of an apple", ok:true, why:"Mass is continuous." },
          { t:"The number of seeds in an apple", why:"Seeds are counted: 0, 1, 2, … That’s discrete." },
          { t:"The number of apples in a bag", why:"Apples are counted. That’s discrete." },
          { t:"The number of bruised apples in a crate", why:"Bruised apples are counted. That’s discrete." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which table could be a probability distribution for `X` = 1, 2, 3?", options:[
          { t:"0.2, 0.3, 0.5", ok:true, why:"Each is between 0 and 1, and they add to 1." },
          { t:"0.3, 0.3, 0.3", why:"Adds to 0.9." },
          { t:"0.5, 0.6, −0.1", why:"A probability can’t be negative." },
          { t:"0.4, 0.4, 0.4", why:"Adds to 1.2." }] },
        b:{ prompt:"Which table could be a probability distribution for `X` = 0, 1, 2?", options:[
          { t:"`1/6`, `1/2`, `1/3`", ok:true, why:"`1/6 + 3/6 + 2/6 = 1`." },
          { t:"`1/3`, `1/3`, `1/4`", why:"Adds to `11/12`." },
          { t:"`1/2`, `1/2`, `1/2`", why:"Adds to `3/2`." },
          { t:"`2/3`, `1/2`, `-1/6`", why:"Negative." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"In a probability histogram, the bar for `X = 3` has height 0.25. What does this mean?", options:[
          { t:"`P(X = 3) = 0.25`", ok:true, why:"Width 1, so area = height = probability." },
          { t:"3 came up 25 times", why:"Heights are probabilities, not counts." },
          { t:"`P(X <= 3) = 0.25`", why:"One bar is one value." },
          { t:"25% of the values are 3 or more", why:"One bar is one value: the bar at 3 gives `P(X = 3)` only." }] },
        b:{ prompt:"What is the total area of the bars in a probability histogram?", options:[
          { t:"1", ok:true, why:"Heights are probabilities and widths are 1, so the areas add to 1." },
          { t:"The number of trials", why:"Bar heights are probabilities, so the total area is 1, not the number of trials." },
          { t:"The sum of the `x`-values", why:"Area adds probabilities." },
          { t:"100", why:"Probabilities add to 1, or 100%." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A bag has 2 red and 3 blue marbles. Two are drawn without replacement. `X` = the number of red. Find `P(X = 1)`.", options:[
          { t:"`3/5`", ok:true, why:"Red-blue or blue-red: `2/5 × 3/4 + 3/5 × 2/4 = 6/20 + 6/20`." },
          { t:"`12/25`", why:"That assumes replacement." },
          { t:"`1/3`", why:"`X` = 0, 1, 2 aren’t equally likely." },
          { t:"`3/10`", why:"That’s one order only." }] },
        b:{ prompt:"A bag has 3 red and 2 blue marbles. Two are drawn without replacement. `X` = the number of red. Find `P(X = 2)`.", options:[
          { t:"`3/10`", ok:true, why:"`3/5 × 2/4`." },
          { t:"`9/25`", why:"That assumes replacement: after one red is drawn, only 2 of the 4 left are red." },
          { t:"`1/3`", why:"`X` = 0, 1, 2 aren’t equally likely." },
          { t:"`3/5`", why:"That’s `P(X = 1)`." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"`X` takes the values 1, 2, 3, 4 with `P(X = x) = kx`. Find `k` and `P(X ≥ 3)`.", options:[
          { t:"`k = 1/10`; `P(X ≥ 3) = 7/10`", ok:true, why:"`k(1 + 2 + 3 + 4) = 1`; `(3 + 4)/10`." },
          { t:"`k = 1/4`; `P = 1/2`", why:"That treats the values as equally likely." },
          { t:"`k = 1/10`; `P = 3/10`", why:"‘≥ 3’ includes 4." },
          { t:"`k = 1/10`; `P = 4/10`", why:"Include 3." }] },
        b:{ prompt:"`X` takes the values 1, 2, 3, 4 with `P(X = x) = k(5 - x)`. Find `k` and `P(X <= 2)`.", options:[
          { t:"`k = 1/10`; `P(X <= 2) = 7/10`", ok:true, why:"`(4 + 3)/10`." },
          { t:"`k = 1/4`; `P = 1/2`", why:"That treats the values as equally likely." },
          { t:"`k = 1/10`; `P = 3/10`", why:"That’s `P(X = 2)` only." },
          { t:"`k = 1/10`; `P = 4/10`", why:"That’s `P(X = 1)` only." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Two dice are rolled. `X` = the larger of the two numbers. Find `P(X = 4)`.", options:[
          { t:"`7/36`", ok:true, why:"(4, 1), (4, 2), (4, 3), (4, 4), (1, 4), (2, 4), (3, 4)." },
          { t:"`1/6`", why:"Six values aren’t equally likely." },
          { t:"`1/9`", why:"`4/36` counts only the first die being 4." },
          { t:"`2/9`", why:"`8/36` counts (4, 4) twice." }] },
        b:{ prompt:"Two dice are rolled. `X` = the difference (larger − smaller). Find `P(X = 2)`.", options:[
          { t:"`2/9`", ok:true, why:"8 cells: (1, 3), (3, 1), (2, 4), (4, 2), (3, 5), (5, 3), (4, 6), (6, 4)." },
          { t:"`1/6`", why:"The six differences aren’t equally likely." },
          { t:"`1/9`", why:"`4/36` is one order only." },
          { t:"`5/18`", why:"`10/36` is `P(X = 1)`." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which best describes how to draw a probability histogram for a discrete `X`?", options:[
          { t:"“Draw a bar of width 1 centred on each value, with height equal to its probability, so the total area is 1.”", ok:true, why:"Each bar’s area is its probability, and the areas add to 1." },
          { t:"“Draw bars with heights equal to how often each value came up in one experiment.”", why:"Bar heights are probabilities, so the total area is 1, not the number of trials." },
          { t:"“Join the probabilities with a line graph.”", why:"That’s a different graph; a histogram uses bars whose areas are probabilities." },
          { t:"“Draw one bar for every outcome in the sample space.”", why:"Bars are for values of `X`, not outcomes." }] },
        b:{ prompt:"Why do the bars of a probability histogram have width 1?", options:[
          { t:"“So each bar’s area equals its probability, and the areas add to 1.”", ok:true, why:"Width 1 makes area = height = probability." },
          { t:"“So the bars don’t overlap.”", why:"Overlap isn’t the reason; area is." },
          { t:"“Because each value happens once.”", why:"Values aren’t equally likely, and the width has nothing to do with how often a value happens." },
          { t:"“So the histogram fits on the page.”", why:"Widths are chosen for area, not size." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"A die was rolled 60 times: the counts for 1–6 were 8, 12, 9, 11, 7, 13. Which conclusion is best?", options:[
          { t:"“The counts vary around the expected 10. Variation this size is normal for 60 rolls, so there’s no strong evidence the die is unfair.”", ok:true, why:"Simulated or real counts wobble around the expected value; these gaps are ordinary for 60 rolls." },
          { t:"“The die is unfair, because the counts aren’t all 10.”", why:"Counts wobble around the expected 10; they’re almost never all exactly 10." },
          { t:"“6 is favoured, because 13 is the largest count.”", why:"A gap of 3 in 60 rolls is ordinary." },
          { t:"“The die is fair, because the counts add to 60.”", why:"Any 60 rolls add to 60." }] },
        b:{ prompt:"A spinner with equal sectors 1–4 was spun 400 times: 104, 97, 95, 104. Which conclusion is best?", options:[
          { t:"“All counts are close to the expected 100; this looks like ordinary chance variation, consistent with a fair spinner.”", ok:true, why:"Every count is within 5 of 100: ordinary chance variation." },
          { t:"“It’s unfair: 104 ≠ 100.”", why:"Counts wobble around the expected 100; a gap of 4 is ordinary." },
          { t:"“3 is the least likely value.”", why:"95 is a small, ordinary dip below 100, not evidence that 3 is less likely." },
          { t:"“You can’t conclude anything from data.”", why:"Data are exactly what we compare." }] } },
      { id:"a1", cat:"A", goal:2,
        a:{ prompt:"A fundraiser game: draw one card from a standard deck. `X` = $10 for an ace, $2 for a face card (J, Q, K), and $0 otherwise. Find `P(X ≥ 2)`.", options:[
          { t:"`4/13`", ok:true, why:"Aces 4 + face cards 12 = 16 of 52." },
          { t:"`1/13`", why:"That’s aces only." },
          { t:"`3/13`", why:"That’s face cards only." },
          { t:"`2/3`", why:"Two of three values isn’t `2/3`: the values aren’t equally likely." }] },
        b:{ prompt:"Draw one card. `X` = 5 points for a heart, 1 point for a spade, 0 otherwise. Find `P(X ≥ 1)`.", options:[
          { t:"`1/2`", ok:true, why:"Hearts 13 + spades 13 = 26 of 52." },
          { t:"`1/4`", why:"That’s hearts only." },
          { t:"`2/3`", why:"Two of three values isn’t `2/3`: the values aren’t equally likely." },
          { t:"`3/4`", why:"Clubs and diamonds give 0." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A random digit generator gives 0–9, each equally likely. `X` = the remainder when the digit is divided by 3. Find `P(X = 0)`.", options:[
          { t:"`2/5`", ok:true, why:"0, 3, 6 and 9: 4 of 10." },
          { t:"`1/3`", why:"The remainders 0, 1, 2 aren’t equally likely here." },
          { t:"`3/10`", why:"0 ÷ 3 has remainder 0 too." },
          { t:"`1/10`", why:"Four digits give remainder 0." }] },
        b:{ prompt:"`X` = the remainder when a random digit 0–9 is divided by 4. Find `P(X = 0)`.", options:[
          { t:"`3/10`", ok:true, why:"0, 4, 8." },
          { t:"`1/4`", why:"The remainders 0, 1, 2, 3 aren’t equally likely here." },
          { t:"`1/5`", why:"Include 0." },
          { t:"`1/10`", why:"Three digits give remainder 0: 0, 4 and 8." }] } }
    ]
  },
  task:{
    title:"Design a distribution", summary:"Design a distribution",
    statement:"<p>`X` can be 0, 1, 2 or 3. Choose the four probabilities (steps of 0.1) so the distribution meets every condition. Can you find all the answers?</p>" +
      '<ol class="dr-conds"><li>It’s a valid probability distribution.</li><li>`P(X ≥ 2) = 0.6`.</li><li>`X = 1` is the least likely value (strictly less than each of the others).</li><li>Every value has a probability greater than 0.</li></ol>',
    checks:["Valid distribution", "`P(X ≥ 2) = 0.6`", "`X = 1` least likely", "No zero probabilities"],
    tips:["The bars’ total area must be 1.", "‘≥ 2’ means 2 and 3 together.", "`X = 1` must be strictly below every other bar.", "With `p_0 + p_1 = 0.4` and `p_1` the smallest (but not 0), what can `p_1` be?"],
    explainPrompt:"Explain how the conditions forced `p_0` and `p_1`, and why the remaining 0.6 can be split in exactly three ways.",
    vocab:"Use the words probability distribution, valid, histogram and least likely.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"`p_1 = 0.1` and `p_0 = 0.3` are forced; only the split of 0.6 between `X = 2` and `X = 3` can change, and neither part may drop to 0.1."
  },
  cards:[
    ["Random variable", "A rule that assigns a number to each outcome. `X` = number of heads."],
    ["Discrete", "Countable values: 0, 1, 2, … (goals, heads, siblings)."],
    ["Continuous", "Any value in a range (time, mass, height)."],
    ["Probability distribution", "Every value `x` with `P(X = x)`."],
    ["Valid distribution", "Each `0 <= P <= 1`, and the probabilities add to 1."],
    ["Probability histogram", "Bars of width 1 centred on each `x`, with height `P(X = x)`; total area 1."],
    ["Uniform distribution", "Every value equally likely: a fair die gives `1/6` each."],
    ["Two-dice sum", "`P(7) = 6/36` is the largest; `P(2) = P(12) = 1/36`."],
    ["Two-dice maximum", "`P(X = m) = (2m - 1)/36`."],
    ["`P(X <= k)`", "Add the probabilities of every value up to <strong>and including</strong> `k`."],
    ["Missing `X = 0`", "A common error: check that the probabilities add to 1."],
    ["Simulated vs theoretical", "Simulated bars wobble around the theoretical ones and settle with more trials."]
  ]
};
