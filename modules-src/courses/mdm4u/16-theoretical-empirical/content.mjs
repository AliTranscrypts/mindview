// MDM4U 16 Theoretical & Empirical Probability. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/16-theoretical-empirical.md
const P = s => "<i>P</i>(" + s + ")";            // P(words) with an italic P and upright words
const A = "<i>A</i>";
// Core feedback sentences for the plan's misconceptions (§3), used where an option names only its misconception.
const M1c = "The spinner has no memory. Each spin is still 0.25, whatever came before.";
const M1d = "The die has no memory. Each roll is still `1/6`, whatever came before.";
const M2 = "Short runs rarely match exactly.";
const M4 = "Empirical probability is successes ÷ <strong>total trials</strong>, not ÷ failures.";

export default {
  id:"16-theoretical-empirical",
  kind:"topic",
  title:"Theoretical and empirical probability",
  topic:"Theoretical & Empirical Probability",
  readyTopic:"theoretical and empirical probability",
  hero:{
    eq:'<span class="te-heq"><span class="te-hl">empirical <i>P</i>(<i>A</i>) = (times <i>A</i> happened) ÷ (trials)</span><span class="te-hl"><span class="te-arrow">⟶</span> theoretical <i>P</i>(<i>A</i>) as trials → ∞</span></span>',
    eqLabel:"Empirical P of A, the times A happened divided by the trials, approaches theoretical P of A as the trials go to infinity",
    eqSize:"sm",
    headline:"In the long run, the data find the truth",
    text:"<strong>Theoretical probability</strong> counts equally likely outcomes. <strong>Empirical probability</strong> counts what actually happened in trials. Run enough trials and the two meet: that’s the <strong>law of large numbers</strong>. But in a short run, anything can happen, and the coin never “owes” you heads.",
    fig:{ html:'<div class="te-hero"><div class="te-hero-top" aria-hidden="true"><span class="te-coin" id="te-coin">H</span><span class="te-hcount" id="te-hcount">Trials: 0</span><button type="button" class="btn ghost sm" id="te-hreplay">Replay</button></div>' +
      '<canvas class="plot" id="te-hplot" role="img" aria-label="A coin is flipped 1000 times. The relative frequency of heads starts jagged and smooths as the trials climb from 10 to 100 to 1000, settling inside a thin band around the dashed line at 0.5."></canvas></div>' }
  },
  goals:[
    "I can tell theoretical, empirical and subjective probabilities apart and explain where each comes from.",
    "I can calculate theoretical probabilities, including complements, for outcomes that are or aren’t equally likely.",
    "I can calculate empirical probabilities from data and use them to predict counts.",
    "I can convert between probabilities and odds in favour or against.",
    "I can design a simulation whose random device matches a real situation’s probabilities.",
    "I can explain the law of large numbers and judge whether a gap between empirical and theoretical results is reasonable."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Theoretical probability", goal:2,
          prompt:"A bag has 3 red, 5 blue and 2 green marbles. One is drawn at random. What is " + P("blue") + "?",
          options:[
            { t:"`1/2`", ok:true, why:"5 blue out of 10 marbles." },
            { t:"`1/3`", why:"There are 3 colours, but not equal numbers of each." },
            { t:"1", why:"That’s odds of 5 : 5, so <i>P</i> = `5/10`." },
            { t:"`5/3`", why:"A probability can’t be more than 1." }],
          hints:["How many marbles in total?", "10 marbles, 5 blue.", "`5/10 = 1/2`."] },
        { id:"w2", skill:"Theoretical probability", goal:2,
          prompt:"Two dice are rolled. What is " + P("sum = 7") + "?",
          options:[
            { t:"`1/6`", ok:true, why:"6 of the 36 equally likely outcomes give 7." },
            { t:"`1/11`", why:"Sums aren’t equally likely; count the 36 outcomes." },
            { t:"`7/36`", why:"Count the pairs that make 7." },
            { t:"`1/12`", why:"(6, 1) is a different outcome from (1, 6)." }],
          hints:["List the outcome grid: 6 × 6.", "(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1).", "`6/36 = 1/6`."] },
        { id:"w3", skill:"Complements", goal:2,
          prompt:P("rain tomorrow") + " = 0.35. What is " + P("no rain") + "?",
          options:[
            { t:"0.65", ok:true, why:"1 − 0.35." },
            { t:"0.35", why:"No rain is the complement." },
            { t:"2.86", why:"Probabilities can’t exceed 1." },
            { t:"1.35", why:"Subtract from 1." }],
          hints:["Rain and no rain together are certain.", P(A) + " + " + P(A + "′") + " = 1.", "0.65."] },
        { id:"w4", skill:"Counting outcomes", goal:2,
          prompt:"A coin is flipped and a die is rolled. How many outcomes are in the sample space?",
          options:[
            { t:"12", ok:true, why:"2 × 6." },
            { t:"8", why:"Each coin result pairs with each die result: multiply." },
            { t:"6", why:"Heads-3 and tails-3 are different outcomes." },
            { t:"36", why:"There’s one die and one coin." }],
          hints:["Fundamental counting principle.", "2 choices, then 6.", "12."] },
        { id:"w5", skill:"Comparing values", goal:3,
          prompt:"Which is largest: 0.4, `3/8`, 41%, `2/5`?",
          options:[
            { t:"41%", ok:true, why:"0.41 beats 0.400, 0.375 and 0.400." },
            { t:"0.4", why:"0.4 = 0.40 < 0.41." },
            { t:"`2/5`", why:"`2/5` = 0.40." },
            { t:"`3/8`", why:"`3/8` = 0.375." }],
          hints:["Write each as a decimal.", "0.40, 0.375, 0.41, 0.40.", "41%."] },
        { id:"w6", skill:"Combinations and probability", goal:2,
          prompt:"Two cards are dealt from a standard deck. What is " + P("both hearts") + "?",
          options:[
            { t:"`1/17`", ok:true, why:"`C(13, 2) ÷ C(52, 2) = 78 ÷ 1326 = 1/17`." },
            { t:"`1/16`", why:"After one heart, 12 of 51 cards are hearts." },
            { t:"`1/26`", why:"That isn’t a count of two-card hands." },
            { t:"`1/4`", why:"Both cards must be hearts." }],
          hints:["Favourable hands ÷ all hands.", "`C(13, 2) = 78`; `C(52, 2) = 1326`.", "`78/1326 = 1/17`."] }
      ],
      refreshers:{
        "Theoretical probability":P(A) + " = favourable ÷ total, only when outcomes are equally likely. Colours or sums aren’t automatically equally likely; count the underlying outcomes.",
        "Complements":P(A + "′") + " = 1 − " + P(A) + ". Use it when “not " + A + "” is easier.",
        "Counting outcomes":"Multiply the number of choices at each stage.",
        "Comparing values":"Convert to decimals before comparing.",
        "Combinations and probability":"<i>P</i> = (number of favourable selections) ÷ (number of possible selections)."
      }
    }
  },
  explore:{
    heading:"Law of large numbers lab",
    intro:"Run trials and watch the relative frequency. Where does it settle, and how fast?",
    predIntro:"Make a prediction first. Then the lab will run the trials and show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Seeded coin run. The first 10 flips gave 7 heads. Over the next 10 flips, what’s most likely?",
        options:[{ t:"About 5 heads; past flips don’t matter", ok:true }, { t:"Fewer than 5 heads, to balance things out" }, { t:"More heads; the coin is on a streak" }, { t:"Exactly 3 heads, to make 10 out of 20" }],
        explain:"Each flip is `1/2`. The coin has no memory." },
      { id:"p2", prompt:"Coin, single run to 10 000. As the trials go from 100 to 10 000, what happens to the <strong>count</strong> difference (heads − half the flips)?",
        options:[{ t:"It typically gets larger, even though the proportion gets closer to 0.5", ok:true }, { t:"It shrinks to 0" }, { t:"It stays about the same" }, { t:"It must be exactly 0 at 10 000" }],
        explain:"A gap of 30 heads in 10 000 flips is only 0.003 as a proportion." },
      { id:"p3", prompt:"Many-runs view. 20 runs of 10 flips vs 20 runs of 1000 flips: which set of empirical probabilities is more spread out?",
        options:[{ t:"The runs of 10", ok:true }, { t:"The runs of 1000" }, { t:"About the same" }, { t:"You can’t tell" }],
        explain:"More trials per run means each estimate is closer to the truth." },
      { id:"p4", prompt:"Two dice. Is " + P("sum = 7") + " the same as " + P("sum = 12") + "?",
        options:[{ t:"No: 7 is six times as likely", ok:true }, { t:"Yes: both are `1/11`" }, { t:"12 is more likely" }, { t:"7 is twice as likely" }],
        explain:"6 ways vs 1 way out of 36." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 6], prompt:"Mystery spinner (seed 3): estimate " + P("blue") + " from at least 500 spins. Type your estimate to 2 decimal places.",
        why:"The hidden mix is revealed: " + P("blue") + " = 0.30.",
        hints:["Empirical <i>P</i> = successes ÷ trials.", "Read the “Empirical probability” row.", "Round it to 2 decimals."] },
      { id:"tc2", goal:4, prompt:"Recolour the 12-sector spinner so that " + P("red") + " = `1/3`, " + P("blue") + " = `1/4` and the rest is yellow.",
        why:"`1/3` of 12 is 4 red sectors and `1/4` of 12 is 3 blue sectors, so the other 5 are yellow. The 15- and 18-sector spinners are now unlocked.",
        hints:["Each sector is `1/12`.", "`1/3 = 4/12` and `1/4 = 3/12`.", "Red 4, blue 3, yellow 5."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Choose the number of sectors (12, 15 or 18) and colour the spinner so that the <strong>odds in favour of yellow are 1 : 5</strong> and red is <strong>twice as likely as blue</strong>. Use only red, blue and yellow.",
        why:"Yellow 3 of 18 = `1/6`, odds 1 : 5; blue `5/18`; red `10/18`. Only 18 sectors work: with 12 sectors, yellow is 2 and red + blue = 10 can’t split 2 : 1; with 15 sectors, `1/6` of 15 isn’t whole.",
        hints:["Odds 1 : 5 in favour means " + P("yellow") + " = 1 ÷ (1 + 5).", "`1/6` of 18 sectors is 3, which leaves 15 for red and blue.", "Red = 2 × blue and red + blue = 15: blue 5, red 10."] }
    ]
  },
  part3:{
    slug:"simulation", name:"Simulation",
    heading:"Design a simulation",
    intro:"A simulation models a real situation with a random device. Choose a device whose probabilities match the situation, run it, then check the estimate against the exact value.",
    stations:[
      { id:"s1", name:"Match the device", task:"A goalie saves 75% of shots. Pick the random device that models one shot.",
        cards:[
          { id:"c1", t:"Two random digits 00–99; 00–74 = save", p:"0.75", ok:true, fb:"00–74 is 75 of the 100 two-digit numbers, so " + P("save") + " = 0.75, just like the goalie." },
          { id:"c2", t:"A coin", p:"0.5", fb:"A coin models 50%, not 75%: " + P("save") + " would be 0.5." },
          { id:"c3", t:"A die where 1–4 = save", p:"0.67", fb:"1–4 on a die is `4/6` ≈ 0.67, not 0.75." },
          { id:"c4", t:"One digit 0–9 where 0–7 = save", p:"0.8", fb:"0–7 is 8 of 10 digits: 0.8, not 0.75." }] },
      { id:"s2", name:"Run it", task:"One trial = 20 simulated shots, using two-digit numbers with 00–74 as a save. The event is “at least 16 saves”. Run 1, 10, 100 and then 1000 trials.",
        exact:0.4148, exactNote:"The exact value, 0.4148, will be calculated in module 21 with the binomial distribution." },
      { id:"s3", name:"Your own model", task:"A basketball player makes 60% of free throws. Estimate " + P("makes at least 4 of 5") + ". Set the device, the shots per trial and the number of trials, then run it.",
        exact:0.33696, exactWork:"`0.6^5 + 5(0.6^4)(0.4) = 0.07776 + 0.2592 = 0.33696`" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Design a simulation quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which device models an event with probability 0.4?",
          right:"Right. 4 of the 10 digits: 0.4.", wrong:"0–4 is 5 digits: 0.5. A die’s 1–4 is `4/6`.",
          choices:[{ t:"Digits 0–3 out of 0–9", ok:true }, { t:"A coin" }, { t:"A die showing 1–4" }, { t:"Digits 0–4 out of 0–9" }] },
        { id:"q2", goal:3, prompt:"A simulation of 50 trials gave 31 successes. Empirical probability?",
          right:"Right. Successes ÷ trials = `31/50` = 0.62.", wrong:"Successes ÷ trials = `31/50`.",
          choices:[{ t:"0.62", ok:true }, { t:"`31/19`" }, { t:"0.31" }, { t:"0.5" }] },
        { id:"q3", goal:6, prompt:"To make a simulation’s estimate more reliable, you should…",
          right:"Right. The law of large numbers needs many trials.", wrong:"The law of large numbers needs many trials.",
          choices:[{ t:"Run more trials", ok:true }, { t:"Change the device every trial" }, { t:"Stop when the result looks right" }, { t:"Use fewer digits" }] },
        { id:"q4", goal:5, prompt:"Digits 00–74 represent a save. Is 75 a save?",
          right:"Right. 00–74 is exactly 75 numbers out of 100, so 75 is a miss.", wrong:"00–74 is exactly 75 numbers out of 100.",
          choices:[{ t:"No", ok:true }, { t:"Yes" }, { t:"Only after a miss" }, { t:"Only on even trials" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"kind", type:"sorter", title:"What kind of probability?", goal:1, noun:"statement", txt:true,
        instruction:"Sort each statement by where its probability comes from.",
        boxes:[{ id:"th", label:"Theoretical", sub:"counting equally likely outcomes" }, { id:"em", label:"Empirical", sub:"data from trials" }, { id:"su", label:"Subjective", sub:"judgement or belief" }],
        wrongDefault:"Did it come from counting equal outcomes, from data, or from judgement?",
        items:[
          { id:"i1", t:P("drawing a heart") + " = `1/4`.", answer:"th", why:"13 of the 52 equally likely cards are hearts.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Theoretical."] },
          { id:"i2", t:"A goalie stopped 412 of 500 shots, so " + P("save") + " ≈ 0.82.", answer:"em", why:"It counts what happened in 500 shots.",
            wrong:{ th:"This comes from counting what happened, not from equally likely outcomes." },
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Empirical."] },
          { id:"i3", t:"I’m 90% sure I’ll pass my driver’s test.", answer:"su", why:"It’s a personal belief, not a count.",
            wrong:{ em:"There’s no data, only a belief." },
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Subjective."] },
          { id:"i4", t:"Of 1200 surveyed adults, 300 cycle to work, so <i>P</i> ≈ 0.25.", answer:"em", why:"It comes from survey data: 300 of 1200.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Empirical."] },
          { id:"i5", t:P("sum of 7 on two dice") + " = `1/6`.", answer:"th", why:"6 of the 36 equally likely outcomes.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Theoretical."] },
          { id:"i6", t:"Our coach thinks we have a 60% chance in the final.", answer:"su", why:"It’s the coach’s judgement.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Subjective."] },
          { id:"i7", t:"In 10 000 simulated spins, red came up 24.8% of the time.", answer:"em", why:"It counts what happened in 10 000 simulated trials.",
            wrong:{ th:"A simulation’s result is empirical, even though the device is designed." },
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Empirical."] },
          { id:"i8", t:"A fair four-sided die: " + P("4") + " = `1/4`.", answer:"th", why:"1 of 4 equally likely faces.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Theoretical."] },
          { id:"i9", t:"A fisher’s hunch that the lake will freeze early this year.", answer:"su", why:"A hunch is a judgement, not data.",
            hints:["Did it come from counting equal outcomes, from data, or from judgement?", "Data → empirical.", "Subjective."] }
        ] },
      { id:"odds", type:"custom", title:"Odds and evidence", summary:"Odds and evidence", star:true, goal:[3, 4, 6],
        instruction:"Answer each question. Ratios go in the two boxes; they don’t need to be reduced.",
        how:"Type a number, a fraction such as 4/13, or a ratio in the two boxes, then press Check.",
        items:[
          { id:"n1", goal:4, kind:"ratio", prompt:P("event") + " = 0.15. Odds <strong>against</strong>? (reduced ratio)",
            answer:[17, 3], display:"17 : 3", why:"Unfavourable : favourable = 0.85 : 0.15 = 85 : 15 = 17 : 3.",
            wrong:[{ ratio:[3, 17], fb:"That’s odds in favour." }, { ratio:[17, 20], fb:"Compare unfavourable to favourable: 85 : 15." }],
            hints:["Odds against = unfavourable : favourable.", "0.85 unfavourable to 0.15 favourable is 85 : 15.", "Divide both parts by 5: 17 : 3."] },
          { id:"n2", goal:4, kind:"num", prompt:"Odds in favour are 4 : 9. " + P("event") + "?",
            answer:0.3076923076923077, tol:5e-5, display:"`4/13`", why:"4 favourable out of 4 + 9 = 13.",
            wrong:[{ match:0.4444444444444444, fb:"Add the parts: 4 + 9 = 13." }],
            hints:["Odds 4 : 9 mean 4 favourable for every 9 unfavourable.", "There are 4 + 9 = 13 parts in all.", "`4/13`."] },
          { id:"n3", goal:3, kind:"num", prompt:"500 bulbs tested, 12 defective. Expected defective bulbs in a shipment of 2000?",
            answer:48, tol:1e-9, display:"48", why:"`12/500` × 2000 = 12 × 4 = 48.",
            wrong:[{ match:12, fb:"Scale by 2000 ÷ 500 = 4." }],
            hints:["Empirical " + P("defective") + " = `12/500`.", "2000 is 4 times 500.", "12 × 4 = 48."] },
          { id:"n4", goal:6, kind:"pair", star:true,
            prompt:"A die rolled 300 times shows 62 sixes. Enter the count difference from expected, then the proportion difference (2 decimals).",
            labels:["Count difference", "Proportion difference"], answer:[12, 0.04], tol:[1e-9, 5e-4], display:"12; 0.04",
            why:"Expected 50 sixes; 62 − 50 = 12. `62/300` ≈ 0.207 vs `1/6` ≈ 0.167: a difference of 0.04.",
            general:"Expected 50 sixes; `62/300` ≈ 0.207 vs `1/6` ≈ 0.167.",
            hints:["Expected sixes = 300 × `1/6`.", "Expected 50, so the count difference is 62 − 50; the proportion difference is `62/300` − `1/6`.", "12; `12/300` = 0.04."] },
          { id:"n5", goal:3, kind:"num", star:true,
            prompt:"A bag holds 4 marbles, each red or blue (mix unknown). 200 draws <strong>with replacement</strong> gave 148 red. Most likely number of red marbles?",
            answer:3, tol:1e-9, display:"3", why:"`148/200` = 0.74 ≈ `3/4`.",
            wrong:[{ match:4, fb:"Then every draw would be red." }, { match:2, fb:"That predicts about 100 reds." }],
            general:"`148/200` = 0.74 ≈ `3/4`.",
            hints:["Empirical " + P("red") + " ≈ ?", "0.74.", "Closest to 3 of 4 marbles."] },
          { id:"n6", goal:4, kind:"ratio", star:true,
            prompt:"Events " + A + " and <i>B</i> are mutually exclusive. The odds in favour of " + A + " are 2 : 3 and of <i>B</i> are 1 : 4. Odds in favour of " + A + " or <i>B</i>?",
            answer:[3, 2], display:"3 : 2", why:P(A) + " = `2/5`, " + P("<i>B</i>") + " = `1/5`, so " + P(A + " or <i>B</i>") + " = `3/5`: 3 : 2 in favour.",
            wrong:[{ ratio:[3, 7], fb:"Convert first: " + P(A) + " = `2/5`, " + P("<i>B</i>") + " = `1/5`, so " + P(A + " or <i>B</i>") + " = `3/5`." }],
            hints:["Turn each set of odds into a probability.", "`2/5 + 1/5 = 3/5` (mutually exclusive).", "`3/5` in favour → 3 : 2."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Percy",
        instruction:"Percy made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:4, task:"Find the odds against drawing a heart from a standard deck.",
            steps:["There are 13 hearts in 52 cards.", P("heart") + " = `13/52 = 1/4`.", "So the odds against a heart are 4 : 1.", "A heart is unlikely."],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Odds against = not heart : heart = 39 : 13 = 3 : 1.", ok:true, why:"Odds against compare the 39 non-hearts to the 13 hearts." },
              { t:"Odds against = 1 : 4.", why:"That’s 1 heart for 4 cards, not a comparison of outcomes." },
              { t:"Odds against = 4 : 3.", why:"Odds against compare unfavourable to favourable: 39 non-hearts to 13 hearts." },
              { t:"Step 3 is correct.", why:"4 : 1 uses the denominator of <i>P</i>; odds compare 39 non-hearts to 13 hearts." }],
            hints:["Odds against compare unfavourable to favourable.", "39 non-hearts, 13 hearts.", "3 : 1."] },
          { id:"e2", goal:6, task:"A coin has landed tails 6 times in a row. What is " + P("heads") + " on the next flip?",
            steps:["Each flip has " + P("heads") + " = `1/2`.", "6 tails in a row had probability `(1/2)^6 = 1/64`.", "7 tails in a row is even rarer, so heads is now more likely than `1/2`.", "So " + P("heads") + " is about 0.98."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct, but it’s about the past.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Flips are independent: " + P("heads next") + " is still `1/2`.", ok:true, why:"The coin has no memory." },
              { t:P("heads") + " = `63/64`.", why:"`63/64` isn’t about the next flip; the next flip is a fresh `1/2`." },
              { t:P("heads") + " = `1/64`.", why:"`1/64` was the chance of the streak, which has already happened." },
              { t:"Step 3 is correct.", why:"The coin has no memory; “rarer streaks” don’t change the next flip." }],
            hints:["Does the coin know what happened?", "No: each flip is a fresh `1/2`.", "`1/2`."] },
          { id:"e3", goal:3, task:"A spinner landed on red 20 times in 80 spins. Estimate " + P("red") + " and the number of reds in 300 spins.",
            steps:["Reds: 20.", "Non-reds: 60.", P("red") + " ≈ `20/60 = 1/3`.", "So expect 100 reds in 300 spins."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 uses step 3’s value."],
            fixes:[
              { t:P("red") + " ≈ `20/80 = 1/4`, so expect 75 reds in 300 spins.", ok:true, why:"Divide by all 80 spins: `1/4` of 300 is 75." },
              { t:P("red") + " ≈ `20/100`.", why:"There were 80 spins, not 100." },
              { t:P("red") + " ≈ `60/80`.", why:"60 is the number of non-reds." },
              { t:"Step 3 is correct.", why:"Divide by all 80 spins, not the 60 non-reds." }],
            hints:["Empirical <i>P</i> = successes ÷ total.", "Total = 80.", "`1/4`, so 75."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the lab: how jagged short runs were, or that the count difference grew?" },
      { id:"j2", q:"In your own words, what does the law of large numbers promise, and what doesn’t it promise?" },
      { id:"j3", q:"Explain to a friend how to turn odds of 2 : 7 in favour into a probability, and back." },
      { id:"j4", q:"Which kind of probability (theoretical, empirical or subjective) do you find hardest to use well? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A forecaster says there’s a 70% chance of rain, because 70% of past days with similar conditions had rain. What kind of probability is this?",
          options:[
            { t:"Empirical", ok:true, why:"It comes from past data." },
            { t:"Theoretical", why:"It doesn’t come from equally likely outcomes." },
            { t:"Subjective", why:"It’s based on records, not a hunch." },
            { t:"Conditional odds", why:"It’s a probability from data, not odds." }] },
        b:{ prompt:"A fair eight-sided die has faces 1–8. “" + P("8") + " = `1/8`.” What kind of probability is this?",
          options:[
            { t:"Theoretical", ok:true, why:"8 equally likely outcomes, 1 favourable." },
            { t:"Empirical", why:"No trials were run." },
            { t:"Subjective", why:"It isn’t an opinion." },
            { t:"Simulated", why:"Nothing was simulated." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"The odds in favour of an event are 3 : 5. What is its probability?",
          options:[
            { t:"`3/8`", ok:true, why:"3 favourable out of 3 + 5 = 8." },
            { t:"`3/5`", why:"Odds aren’t a fraction of the total." },
            { t:"`5/8`", why:"That’s the probability against." },
            { t:"`5/3`", why:"A probability can’t exceed 1." }] },
        b:{ prompt:P("win") + " = `2/7`. What are the odds <strong>against</strong> winning?",
          options:[
            { t:"5 : 2", ok:true, why:"5 losing outcomes to 2 winning ones." },
            { t:"2 : 5", why:"That’s odds in favour." },
            { t:"2 : 7", why:"Odds compare the two parts, not part to total." },
            { t:"7 : 2", why:"7 is the total, not the losing count." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"One card is drawn from a standard deck. What is " + P("not a face card") + "?",
          options:[
            { t:"`10/13`", ok:true, why:"12 face cards, so 40 of 52 aren’t: `40/52`." },
            { t:"`3/13`", why:"That’s " + P("face card") + "; take the complement." },
            { t:"`9/13`", why:"Aces aren’t face cards: only J, Q and K are." },
            { t:"`13/10`", why:"1 ÷ <i>P</i> isn’t the complement." }] },
        b:{ prompt:"A die is rolled. What is " + P("not less than 3") + "?",
          options:[
            { t:"`2/3`", ok:true, why:"Less than 3 is {1, 2}; not less than 3 is {3, 4, 5, 6}: `4/6`." },
            { t:"`1/3`", why:"That’s " + P("less than 3") + "." },
            { t:"`1/2`", why:"“Less than 3” is 1 and 2 only, not 3." },
            { t:"`3/2`", why:"Probabilities can’t exceed 1." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A survey of 200 Grade 12 students found 46 walk, 84 take the bus, 50 are driven and 20 bike to school. Estimate " + P("a randomly chosen student takes the bus or bikes") + ".",
          options:[
            { t:"0.52", ok:true, why:"(84 + 20)/200 = `104/200`." },
            { t:"0.42", why:"That’s the bus only; “or” adds the bikers." },
            { t:"1.08", why:"104 ÷ 96 divides by the other students, not by all 200." },
            { t:"0.50", why:"Two of four categories isn’t half; the categories aren’t equal in size." }] },
        b:{ prompt:"A thumbtack tossed 250 times landed point up 155 times. Estimate " + P("point down") + " and the expected number of point-down landings in 1000 tosses.",
          options:[
            { t:"0.38 and 380", ok:true, why:"`95/250` = 0.38; 0.38 × 1000." },
            { t:"0.62 and 620", why:"That’s point up." },
            { t:"0.38 and 95", why:"Scale to 1000 tosses." },
            { t:"0.61 and 613", why:"95 ÷ 155 divides by point-up, not by all tosses." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"A spinner has theoretical " + P("red") + " = 0.25. After 400 spins there were 92 reds. Which statement is correct?",
          options:[
            { t:"The empirical probability is 0.23; being 8 short of the expected 100 is ordinary, and more spins should bring the proportion closer to 0.25", ok:true,
              why:"`92/400` = 0.23. A gap of 8 in 400 spins is ordinary; the proportion settles toward 0.25 as the spins add up." },
            { t:"The spinner must be unfair, because 92 ≠ 100", why:M2 },
            { t:"The next spins are more likely to land on red to catch up", why:M1c },
            { t:"The empirical probability is `92/308`", why:M4 }] },
        b:{ prompt:"A die has theoretical " + P("6") + " = `1/6`. In 600 rolls there were 92 sixes. Which statement is correct?",
          options:[
            { t:"The empirical probability is about 0.153; 8 short of the expected 100 is ordinary, and more rolls should bring the proportion closer to `1/6`", ok:true,
              why:"`92/600` ≈ 0.153. A gap of 8 in 600 rolls is ordinary; the proportion settles toward `1/6` as the rolls add up." },
            { t:"The die must be unfair, because 92 ≠ 100", why:M2 },
            { t:"Sixes are now due, so the next roll is more likely to be a 6", why:M1d },
            { t:"The empirical probability is `92/508`", why:M4 }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"A spinner has sectors of 180° red, 120° blue and 60° green. It is spun twice. What is " + P("both spins the same colour") + "?",
          options:[
            { t:"`7/18`", ok:true, why:"`(1/2)^2 + (1/3)^2 + (1/6)^2 = 9/36 + 4/36 + 1/36 = 14/36`." },
            { t:"`1/3`", why:"Treats the 3 colours as equally likely: 3 matching pairs of 9." },
            { t:"1", why:"Adding `1/2 + 1/3 + 1/6` gives the chance of <em>some</em> colour on one spin." },
            { t:"`1/4`", why:"That’s red-red only." }] },
        b:{ prompt:"A spinner has sectors of 240° red and 120° blue. It is spun twice. What is " + P("the two spins are different colours") + "?",
          options:[
            { t:"`4/9`", ok:true, why:"Red-blue or blue-red: 2 × `(2/3)(1/3)`." },
            { t:"`1/2`", why:"The colours aren’t equally likely." },
            { t:"`2/9`", why:"That counts only red then blue." },
            { t:"`5/9`", why:"That’s " + P("same colour") + "." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why “" + P("rain") + " = `1/2`, because it either rains or it doesn’t” is wrong?",
          options:[
            { t:"“Two possible outcomes aren’t necessarily equally likely; the probability must come from data (empirical) or a justified model.”", ok:true,
              why:"Two outcomes aren’t automatically equally likely, so `1/2` needs data or a justified model." },
            { t:"“Probabilities about weather are always subjective.”", why:"Forecasts use data, so they’re empirical." },
            { t:"“It should be `1/3`: rain, snow or neither.”", why:"Listing more outcomes doesn’t make them equally likely either." },
            { t:"“It’s correct for a theoretical probability.”", why:"Theoretical probability needs equally likely outcomes." }] },
        b:{ prompt:"Which is the best explanation of why a coach’s “60% chance to win” is subjective?",
          options:[
            { t:"“It’s a judgement based on the coach’s experience, not a count of equally likely outcomes or a record of trials.”", ok:true,
              why:"It isn’t a count of outcomes or a record of trials; it’s the coach’s judgement." },
            { t:"“It’s subjective because 60% isn’t a simple fraction.”", why:"Any value can be subjective or not." },
            { t:"“It’s subjective because games have two outcomes.”", why:"Two outcomes aren’t automatically equally likely, and counting them isn’t what makes a probability subjective." },
            { t:"“It’s subjective because it’s about the future.”", why:"Theoretical probabilities are about the future too." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A player makes 60% of free throws. Which simulation best estimates " + P("makes at least 4 of 5") + "?",
          options:[
            { t:"“Generate random digits 0–9 with 0–5 as a make; use 5 digits per trial; run many trials; find the fraction of trials with at least 4 makes.”", ok:true,
              why:"0–5 is 6 of 10 digits, so the device matches 60%, with 5 shots per trial and many trials." },
            { t:"“Flip a coin 5 times per trial and count heads as makes.”", why:"A coin models 50%." },
            { t:"“Roll a die 5 times per trial with 1–4 as a make.”", why:"1–4 on a die is `4/6` ≈ 67%." },
            { t:"“Use digits 0–5 as a make, 5 digits, and run one trial.”", why:"One trial can’t estimate a probability." }] },
        b:{ prompt:"A goalie saves 75% of shots. Which simulation best estimates " + P("at least 8 saves in 10 shots") + "?",
          options:[
            { t:"“Use two-digit random numbers 00–99 with 00–74 as a save; 10 numbers per trial; many trials; find the fraction with at least 8 saves.”", ok:true,
              why:"00–74 is 75 of 100 numbers, so the device matches 75%, with 10 shots per trial and many trials." },
            { t:"“Roll a die 10 times per trial with 1–4 as a save.”", why:"1–4 on a die is `4/6` ≈ 67%, not 75%." },
            { t:"“Flip a coin 10 times per trial.”", why:"A coin models 50%, not 75%." },
            { t:"“Use one digit 0–9 with 0–7 as a save.”", why:"0–7 is 80%." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A cereal company claims 1 in 6 boxes has a prize. A class opened 120 boxes and found 14 prizes. <strong>Based on the class’s data</strong>, about how many prizes would be in 600 boxes?",
          options:[
            { t:"70", ok:true, why:"`14/120` × 600 = 14 × 5." },
            { t:"100", why:"That uses the company’s `1/6`, not the data." },
            { t:"84", why:"14 × 6 mixes the claim’s 6 with the data; the scale factor is 600 ÷ 120 = 5." },
            { t:"14", why:"That’s the count in 120 boxes." }] },
        b:{ prompt:"A batter has 24 hits in 80 at-bats. <strong>Based on these data</strong>, about how many hits in the next 50 at-bats?",
          options:[
            { t:"15", ok:true, why:"`24/80` = 0.30; 0.30 × 50." },
            { t:"24", why:"That’s the old count." },
            { t:"21", why:"24 ÷ 56 divides by the outs, not all at-bats." },
            { t:"30", why:"0.30 × 100; the question asks about 50 at-bats." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A school charity raffle sells 60 tickets with one prize. You buy 4 tickets. What are the odds <strong>against</strong> winning?",
          options:[
            { t:"14 : 1", ok:true, why:P("win") + " = `4/60 = 1/15`, so 14 losing chances to 1 winning." },
            { t:"15 : 1", why:"15 is the total of the parts, not the losing part." },
            { t:"1 : 14", why:"That’s odds in favour." },
            { t:"4 : 60", why:"That’s a probability written with a colon." }] },
        b:{ prompt:"A raffle sells 80 tickets with one prize. You buy 5. What are the odds <strong>in favour</strong> of winning?",
          options:[
            { t:"1 : 15", ok:true, why:"<i>P</i> = `5/80 = 1/16`: 1 winning to 15 losing." },
            { t:"1 : 16", why:"16 is the total of the parts, not the losing part." },
            { t:"15 : 1", why:"That’s odds against." },
            { t:"5 : 80", why:"That’s a probability written with a colon." }] } }
    ]
  },
  task:{
    title:"Spinner designer", summary:"Spinner designer",
    statement:"<p>Colour a 12-sector spinner (red, blue, green, yellow; each colour at least one sector) so that it meets every condition. Can you find all the answers?</p>" +
      "<ol><li>The odds in favour of red are 1 : 2.</li><li>Blue is the least likely colour (strictly fewer sectors than each other colour).</li><li>The odds against yellow are at most 3 : 1.</li><li>Yellow is not the single most likely colour (a tie for most likely is allowed).</li></ol>",
    checks:["Odds in favour of red 1 : 2", "Blue least likely", "Odds against yellow at most 3 : 1", "Yellow not the single most likely"],
    tips:["Odds 1 : 2 means " + P("red") + " = `1/3 = 4/12`.", "Blue needs fewer sectors than every other colour.", "Odds against 3 : 1 means " + P("yellow") + " = `1/4` at the least: 3 sectors.", "Yellow can tie red at 4, but can’t beat it."],
    explainPrompt:"Explain how you turned each odds condition into a number of sectors, and how you know you’ve found every answer.",
    vocab:"Use the words odds in favour, odds against, probability and sector.",
    checkLabel:"Check my spinner",
    success:"Your spinner meets every condition!",
    more:"There’s more than one answer. Can you find all of them?",
    after3:"Red is fixed at 4. Blue had to be 1 or 2, and yellow had to land at 3 or 4, so only three ways remain."
  },
  cards:[
    ["Theoretical probability", "Favourable ÷ total, for equally likely outcomes. Die: " + P("6") + " = `1/6`."],
    ["Empirical probability", "Times the event happened ÷ number of trials. 31 of 50 → 0.62."],
    ["Subjective probability", "A judgement from experience or belief, not from counting or data."],
    ["Law of large numbers", "As trials increase, the relative frequency settles toward the theoretical probability."],
    ["Gambler’s fallacy", "Believing an outcome is “due” after a streak. Independent trials have no memory."],
    ["Count vs proportion", "The proportion gap shrinks with more trials; the count gap typically grows."],
    ["Odds in favour", "Favourable : unfavourable. <i>P</i> = `3/8` → odds 3 : 5."],
    ["Odds against", "Unfavourable : favourable. <i>P</i> = `3/8` → odds 5 : 3."],
    ["Odds → probability", "Odds <i>a</i> : <i>b</i> in favour → <i>P</i> = <i>a</i> ÷ (<i>a</i> + <i>b</i>)."],
    ["Complement", P(A + "′") + " = 1 − " + P(A) + "."],
    ["Simulation", "A random device whose probabilities match the situation, run for many trials."],
    ["Digits model", "00–74 out of 00–99 models 75%; 0–5 out of 0–9 models 60%."]
  ]
};
