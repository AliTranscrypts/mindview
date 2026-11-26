// MDM4U 19 Expected Value. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/19-expected-value.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "Unlikely values should count less. Multiply each value by its probability, then add.";
const M2 = "`E(X) = 3.5` for a die: you’ll never roll it, but it’s the long-run average.";
const M3 = "You paid to play. Net gain = prize − cost.";
const M5 = "Fair means expected net gain 0. A 1-in-10 game can be fair if the prize is big enough.";
const M6 = "`E` describes many plays. One play can still lose.";
const M7 = "`E(X)` is a sum of products `x × P(x)`.";

export default {
  id:"19-expected-value",
  kind:"topic",
  title:"Expected value",
  topic:"Expected Value",
  readyTopic:"expected value",
  hero:{
    eq:"`E(X) = Σ xP(X = x)` = the balance point",
    eqLabel:"E of X equals the sum of x times P of X equals x, which is the balance point.",
    eqSize:"sm",
    headline:"The average you’d get in the long run",
    text:"Weight each value by its probability and add: that’s the <strong>expected value</strong> `E(X)`. It’s where the probability histogram would balance, and it’s the average you’d see over many trials. For games, compute the expected <strong>net gain</strong>: if it’s 0, the game is <strong>fair</strong>.",
    fig:{ aria:"A probability histogram for a fair die, six equal bars, sits on a seesaw. A fulcrum slides to 3.5 and the seesaw levels. Then the bar for 6 grows, the seesaw tips to the right, and the fulcrum slides right to 4 to restore balance. Caption: balance point = expected value.", shape:"wide" }
  },
  goals:[
    "I can calculate `E(X) = Σ xP(X = x)` from a distribution.",
    "I can interpret `E(X)` as a long-run average, which need not be a possible or most likely value.",
    "I can find the expected net gain of a game, decide whether it is fair, and find a fair price or prize.",
    "I can use expected value to compare choices like insurance and warranties, and say what it leaves out.",
    "I can work backwards from a given expected value to a missing value or probability.",
    "I can connect `E(X)` to the running average of a simulation."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Weighted averages", goal:1, prompt:"A course mark is 40% tests and 60% assignments. A student has 70 on tests and 80 on assignments. Final mark?",
          options:[
            { t:"76", ok:true, why:"0.4 × 70 + 0.6 × 80 = 28 + 48." },
            { t:"75", why:"That’s the plain average of 70 and 80. The weights aren’t equal." },
            { t:"150", why:"Adding the marks gives a total, not a mark. Multiply each mark by its weight, then add." },
            { t:"74", why:"That swaps the weights: 0.6 × 70 + 0.4 × 80. Tests count 40%." }],
          hints:["Multiply each mark by its weight.", "28 + 48.", "76."] },
        { id:"w2", skill:"Weighted averages", goal:1, prompt:"In a class, 10 students have 1 sibling, 6 have 2 and 4 have 0. What is the mean number of siblings?",
          options:[
            { t:"1.1", ok:true, why:"(10 × 1 + 6 × 2 + 4 × 0) ÷ 20 = 22 ÷ 20." },
            { t:"1", why:"That’s the average of the values 0, 1 and 2. " + M1 },
            { t:"2", why:"2 is the largest value, not the mean. Total siblings ÷ total students." },
            { t:"7.3", why:"That’s 22 ÷ 3. Divide by the number of students." }],
          hints:["Total siblings ÷ total students.", "22 ÷ 20.", "1.1."] },
        { id:"w3", skill:"Distributions", goal:1, prompt:"`X` = 0, 1, 2 with `P` = 0.5, 0.3, `k`. Find `k`.",
          options:[
            { t:"0.2", ok:true, why:"Probabilities add to 1." },
            { t:"0.8", why:"0.5 + 0.3 = 0.8 is what’s used; `k` is what’s left to reach 1." },
            { t:"1", why:"That would make the total 1.8." },
            { t:"0.3", why:"That copies a value from the table. `k` is what’s left to reach 1: 1 − 0.8." }],
          hints:["Add to 1.", "0.5 + 0.3 = 0.8.", "0.2."] },
        { id:"w4", skill:"Distributions", goal:2, prompt:"For the sum of two dice, which value is most likely?",
          options:[
            { t:"7", ok:true, why:"6 of 36 outcomes." },
            { t:"12", why:"12 is the largest value, but only (6, 6) gives it: 1 of 36." },
            { t:"All equally likely", why:"The values aren’t equally likely: a sum of 7 has 6 ways, a sum of 12 has 1." },
            { t:"6.5", why:"6.5 isn’t a possible sum." }],
          hints:["Count the ways.", "7 has 6 ways.", "7."] },
        { id:"w5", skill:"Net gain", goal:3, prompt:"You pay $3 for a ticket and win a $10 prize. What is your net gain?",
          options:[
            { t:"$7", ok:true, why:"10 − 3." },
            { t:"$10", why:M3 },
            { t:"$13", why:"Don’t add the cost. Net gain = prize − cost." },
            { t:"−$3", why:"That’s the net gain when you lose." }],
          hints:["What did you pay?", "Prize − cost.", "$7."] },
        { id:"w6", skill:"Long-run frequency", goal:6, prompt:"A spinner lands on red with probability 0.2. In 500 spins, about how many reds?",
          options:[
            { t:"100", ok:true, why:"0.2 × 500." },
            { t:"20", why:"That’s 0.2 × 100. Use all 500 spins." },
            { t:"250", why:"That’s half of the spins, but red has probability 0.2, not 0.5." },
            { t:"2", why:"500 ÷ 0.2 = 2500; 0.2 × 500 = 100." }],
          hints:["Expected count = <i>P</i> × trials.", "0.2 × 500.", "100."] }
      ],
      refreshers:{
        "Weighted averages":"Multiply each value by its weight (or frequency share) and add.",
        "Distributions":"Probabilities add to 1; values are rarely equally likely.",
        "Net gain":"Net gain = what you receive − what you paid.",
        "Long-run frequency":"Expected count = probability × number of trials."
      }
    }
  },
  explore:{
    heading:"Balance point",
    intro:"Shape a distribution and watch where it balances. Then design a game and test it over many plays.",
    predIntro:"Make a prediction first. Then the balance board will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"bal", preset:"die" },
        prompt:"Balance, a fair die. Where does the histogram balance?",
        options:[{ t:"3.5", ok:true }, { t:"3" }, { t:"6" }, { t:"Nowhere: 3.5 can’t be rolled" }],
        explain:"`E(X) = (1 + 2 + … + 6)/6 = 3.5`. It’s an average, not a roll." },
      { id:"p2", start:{ mode:"bal", preset:"zeroTen" },
        prompt:"Balance, values 0 and 10 with `P` = 0.9 and 0.1. `E(X)` = ?",
        options:[{ t:"1", ok:true }, { t:"5" }, { t:"0" }, { t:"10" }],
        explain:"0 × 0.9 + 10 × 0.1 = 1. The plain average 5 ignores the probabilities; 0 is only the most likely value." },
      { id:"p3", start:{ mode:"game" },
        prompt:"Game designer: $2 to play, roll a die, a 6 pays $10. Who does the game favour?",
        options:[{ t:"The host", ok:true }, { t:"The player" }, { t:"It’s fair" }, { t:"You can’t tell without playing" }],
        explain:"Expected prize $10/6 ≈ $1.67 is less than the $2 cost, so `E`(net) ≈ −$0.33." },
      { id:"p4", start:{ mode:"long" },
        prompt:"Long run on the same game. After 10 000 simulated plays, the average net gain per play will be close to…",
        options:[{ t:"−$0.33", ok:true }, { t:"$0" }, { t:"−$2" }, { t:"$8" }],
        explain:"The long-run average is the expected value. The running average wobbled early, then flattened near −$0.33." }
    ],
    chalIntro:"Use the balance board to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Game designer: $2 to play, roll a die. Set the prize for a 6 (other faces pay $0) so the game is fair.",
        why:"A $12 prize gives an expected prize of $12 × `1/6` = $2, the cost to play, so `E`(net) = 0.",
        hints:["Fair: expected prize = cost.", "Prize × `1/6` = $2.", "Prize = $12."] },
      { id:"tc2", goal:[1, 5], prompt:"Balance mode: values 1, 2, 3, 4. Set the probabilities (steps of 0.1, none zero) so that `P(X = 4) = 0.4` and `E(X) = 3`.",
        why:"(0.1, 0.2, 0.3, 0.4) gives `E(X)` = 0.1 + 0.4 + 0.9 + 1.6 = 3, and it is the only distribution that works.",
        hints:["`p_1 + p_2 + p_3 = 0.6` and `p_1 + 2p_2 + 3p_3 = 3 - 1.6 = 1.4`.", "Subtract: `p_2 + 2p_3 = 0.8`.", "`p_3 = 0.3` gives `p_2 = 0.2` and `p_1 = 0.1`."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"A charity raffle sells 500 tickets. Prizes: one $500, two $100 and five $20. Set the ticket price (steps of $0.10) so the raffle is fair, then read the expected net gain at the actual price of $5.",
        why:"Expected prize per ticket = (500 + 200 + 100) ÷ 500 = $1.60, so $1.60 is fair. At the actual $5 price, each ticket expects −$3.40: that’s the charity’s share.",
        hints:["Expected prize per ticket = total prizes ÷ tickets.", "(500 + 200 + 100) ÷ 500.", "$1.60 is fair; at $5, each ticket expects −$3.40, which is the charity’s share."] }
    ]
  },
  part3:{
    slug:"worth-it", name:"Worth it?",
    heading:"Is it worth it?",
    intro:"Warranties and insurance are bets on bad luck. Use expected value to decide whether each one pays on average, then name what expected value leaves out: risk.",
    stations:[
      { id:"s1", title:"The extended warranty",
        text:"A $60 two-year warranty on a laptop. Without it, there’s a 10% chance of a $300 repair and a 5% chance of a $500 replacement.",
        items:[
          { id:"s1a", goal:4, label:"Expected cost without the warranty: $", answer:55,
            why:"0.10 × 300 + 0.05 × 500 = 30 + 25 = $55.",
            wrong:[{ match:800, fb:"That adds the costs. Weight each cost by its chance: 0.10 × 300 + 0.05 × 500." },
              { match:400, fb:M1 },
              { match:30, fb:"Include the $500 replacement too: + 0.05 × 500." },
              { match:5, fb:"That’s the gap to the $60 warranty. First find the expected cost without it." }] }],
        after:"On average, the warranty costs $5 more: 60 − 55. Now change the repair chance and watch the verdict." },
      { id:"s2", title:"The insurer’s view",
        text:"Phone insurance for one year costs $90. The insurer’s model gives an 8% chance of an $800 loss.",
        items:[
          { id:"s2a", goal:[4, 6], label:"Expected payout per policy: $", answer:64,
            why:"0.08 × 800 = $64.",
            wrong:[{ match:800, fb:"Weight the $800 loss by its 8% chance." }, { match:6.4, fb:"8% is 0.08: 0.08 × 800." }] },
          { id:"s2b", goal:[4, 6], label:"Insurer’s expected profit per policy: $", answer:26,
            why:"90 − 64 = $26 per policy.",
            wrong:[{ match:64, fb:"That’s the expected payout. Profit = premium − expected payout." }, { match:-26, fb:"The insurer collects $90 and expects to pay $64." }, { match:90, fb:"Subtract the expected payout." }] }],
        after:"Over 1000 policies, $26 each adds up to about $26 000. Open <strong>Check it with data</strong> to test it." },
      { id:"s3", title:"Why buy it anyway?",
        text:"For the buyer, insurance has a negative expected value: on average it costs more than it pays out. Yet many people buy it. Sort each situation: is <strong>expected value</strong> or <strong>risk</strong> making the call?",
        bins:[{ id:"ev", t:"Expected value says" }, { id:"risk", t:"Risk says" }],
        cards:[
          { id:"c1", goal:4, t:"“Losing $800 at once would mean missing rent.”", answer:"risk",
            why:"Risk says buy: one big loss would be unaffordable, so insurance is sensible here despite `E < 0`.",
            wrong:"Expected value says skip the insurance, but this person can’t absorb one big loss. That’s risk talking: insurance is sensible despite `E < 0`." },
          { id:"c2", goal:4, t:"“A $60 loss wouldn’t matter.”", answer:"ev",
            why:"Expected value says self-insure: skipping costs less on average, and a loss this size is affordable.",
            wrong:"A small, affordable loss carries little risk, so go with the expected value: self-insure." }],
        after:"Expected value ignores risk: how far results can spread from the average. Module 20 measures that spread with σ." }
    ],
    quickCheck:{
      title:"Is it worth it? quick check", summary:"Is it worth it? quick check",
      items:[
        { id:"q1", goal:4, prompt:"Warranty $60; expected repair cost $55. On average, buying the warranty…",
          choices:[
            { t:"costs $5 more", ok:true, fb:"Right. 60 − 55 = 5." },
            { t:"saves $5", fb:"60 − 55." },
            { t:"costs $55", fb:"60 − 55." },
            { t:"breaks even", fb:"60 − 55." }] },
        { id:"q2", goal:4, prompt:"Why might someone buy insurance with a negative expected value?",
          choices:[
            { t:"It protects against a large loss they can’t afford", ok:true, fb:"Right. Expected value ignores risk." },
            { t:"It always pays off", fb:"Expected value ignores risk." },
            { t:"`E` doesn’t apply to insurance", fb:"Expected value ignores risk." },
            { t:"The premium is refunded", fb:"Expected value ignores risk." }] },
        { id:"q3", goal:4, prompt:"Premium $90, expected payout $64. Insurer’s expected profit per policy?",
          choices:[
            { t:"$26", ok:true, fb:"Right. 90 − 64 = 26." },
            { t:"$90", fb:"90 − 64." },
            { t:"$64", fb:"90 − 64." },
            { t:"−$26", fb:"90 − 64." }] },
        { id:"q4", goal:2, prompt:"A raffle ticket has `E`(net) = −$3. This means…",
          choices:[
            { t:"On average, buyers lose $3 per ticket", ok:true, fb:"Right. It’s a long-run average; individual results vary." },
            { t:"Every buyer loses $3", fb:"It’s a long-run average; individual results vary." },
            { t:"You’ll win after enough tickets", fb:"It’s a long-run average; individual results vary." },
            { t:"The raffle is fair", fb:"It’s a long-run average; individual results vary." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"find", type:"custom", title:"Find the expected value", summary:"Find the expected value", goal:[1, 3],
        instruction:"Find each expected value.",
        how:"Type a number such as 1.5, a fraction such as 7/2, or an amount such as −$0.33, then press Check.",
        items:[
          { id:"e1", goal:1, prompt:"A fair die: `E(X)`?", answer:3.5, display:"`E(X) = 3.5`",
            why:"`(1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = 3.5`.",
            wrong:[{ match:3, fb:"Add 1 to 6 and divide by 6: `21/6`." }] },
          { id:"e2", goal:1, prompt:"`X` = 0, 1, 2 with `P` = 0.2, 0.5, 0.3: `E(X)`?", answer:1.1, display:"`E(X) = 1.1`",
            why:"0(0.2) + 1(0.5) + 2(0.3) = 0 + 0.5 + 0.6 = 1.1.",
            wrong:[{ match:1, fb:M1 }] },
          { id:"e3", goal:1, prompt:"Number of heads in 3 coin tosses: `E(X)`?", answer:1.5, display:"`E(X) = 1.5`",
            why:"`0(1/8) + 1(3/8) + 2(3/8) + 3(1/8) = 12/8 = 1.5`.",
            wrong:[{ match:2, fb:"Use `0(1/8) + 1(3/8) + 2(3/8) + 3(1/8)`." }] },
          { id:"e4", goal:3, prompt:"Pay $1, roll a die; a 6 pays a $4 prize. `E`(net gain)? (2 decimals)", answer:-1 / 3, tol:0.005, money:true, display:"−$0.33",
            why:"Expected prize = $4 × `1/6` ≈ $0.67; 0.67 − 1 ≈ −0.33.",
            wrong:[{ match:2 / 3, fb:M3 }] },
          { id:"e5", goal:1, prompt:"Spinner: `1/2` → $0, `1/3` → $3, `1/6` → $12. `E`(prize)?", answer:3, money:true, display:"$3",
            why:"`0 + 3 × 1/3 + 12 × 1/6 = 0 + 1 + 2 = 3`.",
            wrong:[{ match:5, fb:"Average of 0, 3 and 12 ignores the probabilities. " + M1 }],
            hints:["Multiply each prize by its probability.", "`0 + 3 × 1/3 + 12 × 1/6`.", "0 + 1 + 2 = 3."] },
          { id:"e6", goal:1, prompt:"Sum of two dice: `E(X)`?", answer:7, display:"`E(X) = 7`",
            why:"The distribution is symmetric about 7, so it balances at 7.",
            wrong:[{ match:6.5, fb:"Use symmetry: the distribution balances at 7." }] }
        ] },
      { id:"decide", type:"custom", title:"Decide and work backwards", summary:"Decide and work backwards", goal:[3, 4, 5], star:true,
        instruction:"Find each fair price, prize or missing value, and make each decision. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a number or an amount such as $2.50, choose where asked, then press Check.",
        items:[
          { id:"d1", goal:3, prompt:"A game pays a $30 prize with probability `1/12` (nothing otherwise). Fair price to play?", answer:2.5, tol:0.005, money:true, display:"$2.50",
            label:"Fair price: $",
            why:"Fair price = expected prize = $30 × `1/12` = $2.50.",
            wrong:[{ match:30, fb:"Fair price = expected prize." }] },
          { id:"d2", goal:3, prompt:"A game costs $2 and you win with probability `1/5`. What prize makes it fair?", answer:10, tol:0.005, money:true, display:"$10",
            label:"Prize: $",
            why:"Fair means expected prize = cost: prize ÷ 5 = 2, so the prize is $10.",
            wrong:[{ match:8, fb:"Fair means expected prize = cost: prize/5 = 2." }] },
          { id:"d3", goal:5, star:true, prompt:"`X` = 2 or `x`, with `P(2) = 0.75` and `E(X) = 4`. Find `x`.", answer:10, display:"`x = 10`",
            label:"`x` =",
            why:"2(0.75) + `x`(0.25) = 4, so 1.5 + 0.25`x` = 4 and `x` = 10.",
            wrong:[{ match:6, fb:"Weighted: 2(0.75) + `x`(0.25) = 4. " + M1 }],
            hints:["Write `E(X)` with `x`.", "1.5 + 0.25`x` = 4.", "`x = 10`."] },
          { id:"d4", goal:4, star:true, prompt:"Warranty $45. Without it: 12% chance of a $250 repair, 3% chance of a $600 replacement. On expected cost alone: buy or skip, and by how much?", answer:3, tol:0.005, money:true, display:"Buy, by $3",
            pickLabel:"On expected cost alone:", label:"By how much? $",
            pick:[
              { t:"Buy the warranty", ok:true },
              { t:"Skip the warranty", why:"`E` = 30 + 18 = $48 > $45." }],
            why:"Expected cost without it = 0.12 × 250 + 0.03 × 600 = 30 + 18 = $48, which is $3 more than the $45 warranty.",
            general:"`E` = 0.12 × 250 + 0.03 × 600; compare it with $45." },
          { id:"d5", goal:3, star:true, prompt:"Flip a coin. Heads: roll a die and win $(the number). Tails: win $2. `E`(winnings)?", answer:2.75, tol:0.005, money:true, display:"$2.75",
            why:"0.5(3.5) + 0.5(2) = 1.75 + 1 = $2.75.",
            wrong:[{ match:3.5, fb:"Only half the time do you roll: 0.5(3.5) + 0.5(2)." }] },
          { id:"d6", goal:3, star:true, prompt:"A fundraiser game costs $5. Draw 2 of 4 cards without replacement: two say $10 and two say $0. You win the total. `E`(net gain)? Who does it favour?", answer:5, tol:0.005, money:true, display:"+$5; the player",
            label:"`E`(net gain) = $", pickLabel:"It favours:",
            pick:[
              { t:"The player", ok:true },
              { t:"The host", why:"A positive expected net gain favours the player." },
              { t:"Neither: it’s fair", why:"Fair means `E`(net) = 0." }],
            why:"`E` = `20/6 + 40/6` = 10; net = 10 − 5 = +5. This fundraiser would lose money!",
            general:"<i>P</i>($20) = `1/6`, <i>P</i>($10) = `4/6`, <i>P</i>($0) = `1/6`: `E`(total) = $10.",
            hints:["List the totals: 20, 10, 0.", "<i>P</i>(both $10) = `2/4 × 1/3 = 1/6`; <i>P</i>(one of each) = `4/6`.", "`E` = `20/6 + 40/6` = 10; net = 10 − 5 = +5. This fundraiser would lose money!"] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Tallulah", how:"", goal:[1, 2, 3],
        instruction:"Tallulah made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"`X` = 0, 5, 10 with `P` = 0.5, 0.3, 0.2. Find `E(X)`.",
            steps:["The values are 0, 5 and 10.", "`E(X)` = (0 + 5 + 10) ÷ 3 = 5.", "So the long-run average is 5."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 uses step 2’s value."],
            fixes:[
              { t:"`E(X)` = 0(0.5) + 5(0.3) + 10(0.2) = 3.5.", ok:true, why:"Weight each value by its probability: 0 + 1.5 + 2 = 3.5." },
              { t:"`E(X)` = 0.5 + 0.3 + 0.2 = 1.", why:M7 },
              { t:"`E(X)` = 10, the largest value.", why:"The largest value isn’t the average. " + M1 },
              { t:"Step 2 is correct.", why:"The values aren’t equally likely." }],
            hints:["Weight by probability.", "1.5 + 2.", "3.5."] },
          { id:"e2", goal:3, task:"Pay $3, roll a die; a 6 pays a $12 prize. Is the game fair?",
            steps:["`P(6) = 1/6`.", "Expected prize = $12 × `1/6` = $2.", "So the expected gain is $2, and the game favours the player."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"Expected net gain = $2 − $3 = −$1, so the game favours the host.", ok:true, why:"Subtract the $3 cost from the $2 expected prize." },
              { t:"Expected gain = $12 − $3 = $9.", why:"$12 is paid only on a 6. Use the expected prize, $2, then subtract the cost." },
              { t:"Expected gain = $2 + $3 = $5.", why:"Don’t add the cost. " + M3 },
              { t:"Step 3 is correct.", why:"The $3 cost must be subtracted." }],
            hints:["What did the player pay?", "$3.", "2 − 3 = −1."] },
          { id:"e3", goal:2, task:"Interpret `E(X) = 3.5` for a die.",
            steps:["`E(X) = 21/6 = 3.5`.", "So on the next roll I expect a 3 or a 4.", "Rolling a 6 next would be unexpected."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"3.5 is the average over many rolls; any face is equally likely on the next roll.", ok:true, why:"`E` is a long-run average, not a prediction for one roll." },
              { t:"I expect exactly 3.5 next.", why:"You can’t roll 3.5. " + M2 },
              { t:"I expect a 3.", why:"Every face is equally likely on one roll. " + M2 },
              { t:"Step 2 is correct.", why:"`E` is a long-run average, not a prediction for one roll." }],
            hints:["Can you roll 3.5?", "No.", "It’s a long-run average."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that 3.5 is the ‘expected’ die roll, or that a 1-in-10 game can be fair?" },
      { id:"j2", q:"In your own words, why is expected value a balance point?" },
      { id:"j3", q:"Explain to a friend how to tell whether a game is fair." },
      { id:"j4", q:"Describe a decision where you’d choose the option with the worse expected value. Why?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"`X` = 0, 1, 2, 3 with `P` = 0.1, 0.3, 0.4, 0.2. Find `E(X)`.", options:[
          { t:"1.7", ok:true, why:"0 + 0.3 + 0.8 + 0.6." },
          { t:"1.5", why:"That’s the plain average of 0–3." },
          { t:"2", why:"That’s the most likely value." },
          { t:"1", why:"That’s the sum of the probabilities." }] },
        b:{ prompt:"`X` = 1, 2, 5 with `P` = 0.5, 0.3, 0.2. Find `E(X)`.", options:[
          { t:"2.1", ok:true, why:"0.5 + 0.6 + 1.0." },
          { t:"2.67", why:"8 ÷ 3 ignores the probabilities." },
          { t:"1", why:"That’s the most likely value." },
          { t:"8", why:"That’s the sum of the values." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A team’s goals per game, `X`, has `E(X) = 2.4`. What does this mean?", options:[
          { t:"Over many games, the team averages about 2.4 goals per game", ok:true, why:"`E(X)` is the long-run average." },
          { t:"Most games end with 2.4 goals.", why:"No game ends with 2.4 goals: `E(X)` is a long-run average, not a possible or most likely value." },
          { t:"The team will score 2 or 3 goals next game.", why:"`E` describes many games. One game can be far from 2.4." },
          { t:"2.4 is the most the team can score.", why:"`E` isn’t a maximum." }] },
        b:{ prompt:"A game has `E`(net gain) = +$0.50 for players. What does this mean?", options:[
          { t:"Over many plays, players gain about $0.50 per play on average", ok:true, why:"`E` is the long-run average per play." },
          { t:"Every player gains $0.50.", why:M6 },
          { t:"A player can’t lose.", why:M6 },
          { t:"The game is fair.", why:"Fair means `E = 0`." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A game is fair when…", options:[
          { t:"The expected net gain for a player is 0", ok:true, why:"Fair means `E`(net) = 0." },
          { t:"Winning and losing are equally likely.", why:M5 },
          { t:"The prize equals the cost to play.", why:"The prize also depends on how likely it is." },
          { t:"The player wins at least half the time.", why:M5 }] },
        b:{ prompt:"A game costs $3 and its expected prize is $3. What is the expected net gain?", options:[
          { t:"$0", ok:true, why:"3 − 3; the game is fair." },
          { t:"$3", why:M3 },
          { t:"$6", why:"Don’t add the cost." },
          { t:"−$3", why:"That’s the net gain when you lose." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"You pay $3 to roll a die. A 6 pays a $10 prize, a 5 pays a $5 prize, and anything else pays nothing. Expected net gain?", options:[
          { t:"−$0.50", ok:true, why:"Expected prize = `10/6 + 5/6` = $2.50; 2.50 − 3." },
          { t:"+$2.50", why:"That’s the expected prize before the cost." },
          { t:"+$2.00", why:"The average of 10, 5 and 0 ignores the probabilities." },
          { t:"−$3.00", why:"That’s the net gain on a losing roll." }] },
        b:{ prompt:"You pay $2 to spin a spinner with 4 equal sectors: $5, $2, $0, $0. Expected net gain?", options:[
          { t:"−$0.25", ok:true, why:"Expected prize = `7/4` = $1.75; 1.75 − 2." },
          { t:"+$1.75", why:"That’s the expected prize before the cost. " + M3 },
          { t:"+$0.33", why:"The average of 5, 2 and 0 is `7/3`. " + M1 },
          { t:"−$2.00", why:"That’s a losing spin." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`X` = 0, 2, 5 with `P(X = 0) = 0.5`, `P(X = 2) = p` and `P(X = 5) = q`. If `E(X) = 1.6`, find `p` and `q`.", options:[
          { t:"`p = 0.3`, `q = 0.2`", ok:true, why:"`p + q = 0.5` and `2p + 5q = 1.6` give `1 + 3q = 1.6`." },
          { t:"`p = 0.2`, `q = 0.3`", why:"That gives `E` = 0.4 + 1.5 = 1.9." },
          { t:"`p = 0.25`, `q = 0.25`", why:"Equal split: `E` = 1.75." },
          { t:"`p = 0.8`, `q = 0`", why:"The probabilities would add to 1.3." }] },
        b:{ prompt:"`X` = 1, 3, 6 with `P(X = 1) = 0.4`, `P(X = 3) = p` and `P(X = 6) = q`. If `E(X) = 2.8`, find `p` and `q`.", options:[
          { t:"`p = 0.4`, `q = 0.2`", ok:true, why:"`p + q = 0.6` and `3p + 6q = 2.4` give `1.8 + 3q = 2.4`." },
          { t:"`p = 0.2`, `q = 0.4`", why:"That gives `E` = 0.4 + 0.6 + 2.4 = 3.4." },
          { t:"`p = 0.3`, `q = 0.3`", why:"`E` = 3.1." },
          { t:"`p = 0.6`, `q = 0`", why:"Then `E` = 2.2." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"An extended warranty on a laptop costs $120. Without it, there’s a 15% chance of a $400 repair and a 5% chance of a $900 replacement. On expected cost alone, which costs less, and by how much?", options:[
          { t:"No warranty, by $15", ok:true, why:"`E`(cost) = 60 + 45 = $105 < $120." },
          { t:"The warranty, by $15", why:"The sign is reversed." },
          { t:"The warranty, by $10", why:"Averaging $400 and $900 first, then × 0.20, isn’t weighting each cost by its own probability." },
          { t:"They’re equal", why:"105 ≠ 120." }] },
        b:{ prompt:"A phone protection plan costs $80. Without it, there’s a 10% chance of a $300 screen repair and a 4% chance of a $1000 replacement. Which costs less on average, and by how much?", options:[
          { t:"No plan, by $10", ok:true, why:"`E` = 30 + 40 = $70." },
          { t:"The plan, by $10", why:"Reversed." },
          { t:"The plan, by $11", why:"(300 + 1000)/2 × 0.14 = $91 isn’t the expected cost." },
          { t:"They’re equal", why:"`E` = 30 + 40 = $70, not $80." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which best explains why `E(X) = 3.5` for a fair die even though 3.5 can’t be rolled?", options:[
          { t:"“It’s the average of the results over many rolls: the balance point of the distribution, not a single outcome.”", ok:true, why:"`E(X)` is a long-run average and a balance point; it need not be a possible roll." },
          { t:"“It’s the most likely roll, rounded.”", why:"Every face is equally likely. " + M2 },
          { t:"“It’s the middle of 1 and 6, which is always the expected value.”", why:"That works only for symmetric distributions." },
          { t:"“It’s a mistake: `E` must be a whole number.”", why:M2 }] },
        b:{ prompt:"A lottery ticket has an expected value of $0.40. Which best explains what this means?", options:[
          { t:"“Averaged over many tickets, each returns about $0.40 in prizes; most tickets return $0 and a few return a lot.”", ok:true, why:"A few big prizes pull the average up to $0.40. Lotteries charge more than that per ticket, so the expected net gain for players is negative." },
          { t:"“Every ticket wins $0.40.”", why:"`E` describes many tickets. Most tickets win nothing." },
          { t:"“Most tickets win about $0.40.”", why:"No ticket wins $0.40: it’s the long-run average, not a possible or most likely prize." },
          { t:"“You’ll win $0.40 if you buy enough tickets.”", why:"`E` describes the average per ticket; buying more tickets guarantees nothing." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"A game: win $9 with probability `1/10`, otherwise lose $1. Which statement is correct?", options:[
          { t:"“The game is fair: expected net gain = 9(0.1) − 1(0.9) = 0, even though you lose 90% of the time.”", ok:true, why:"Fair means expected net gain 0, not equal chances." },
          { t:"“It’s unfair because you usually lose.”", why:M5 },
          { t:"“It favours the player because $9 > $1.”", why:"Weight each amount by its probability: 0.9 − 0.9 = 0." },
          { t:"“It’s fair because there are only two outcomes.”", why:"Fair depends on the expected net gain, not on the number of outcomes." }] },
        b:{ prompt:"A game: win $4 with probability `1/5`, otherwise lose $1. Which statement is correct?", options:[
          { t:"“The game is fair: expected net gain = 4(0.2) − 1(0.8) = 0.”", ok:true, why:"Fair means expected net gain 0, not equal chances." },
          { t:"“It’s unfair because you lose 80% of the time.”", why:M5 },
          { t:"“It favours the player because 4 > 1.”", why:"Weight each amount by its probability: 0.8 − 0.8 = 0." },
          { t:"“It’s fair because `1/5 + 4/5 = 1`.”", why:"Every distribution adds to 1." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"An insurer sells one-year bicycle theft coverage for $60. In its model, 4% of insured bikes are stolen and each claim pays $1000. Expected profit per policy?", options:[
          { t:"$20", ok:true, why:"Expected payout 0.04 × 1000 = $40; 60 − 40." },
          { t:"$60", why:"The payouts must be subtracted." },
          { t:"$40", why:"That’s the expected payout." },
          { t:"−$940", why:"That’s the loss on one stolen bike, not an average." }] },
        b:{ prompt:"A premium is $150; the model gives a 2% chance of a $5000 claim. Expected profit per policy?", options:[
          { t:"$50", ok:true, why:"150 − 0.02 × 5000." },
          { t:"$150", why:"The expected payout must be subtracted: 0.02 × 5000 = $100." },
          { t:"$100", why:"That’s the expected payout." },
          { t:"−$4850", why:"That’s one claim." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A charity raffle sells 1000 tickets at $10 each. Prizes: one $2000 and five $200. Expected net gain per ticket?", options:[
          { t:"−$7", ok:true, why:"Expected prize = 3000 ÷ 1000 = $3; 3 − 10. On average, each ticket gives $7 to the charity." },
          { t:"+$3", why:"That’s the expected prize." },
          { t:"−$10", why:"Prizes are paid to some tickets." },
          { t:"+$2990", why:"That’s the net gain of the top ticket only." }] },
        b:{ prompt:"A raffle sells 2000 tickets at $5. Prizes: one $1000 and ten $100. Expected net gain per ticket?", options:[
          { t:"−$4", ok:true, why:"Expected prize = 2000 ÷ 2000 = $1; 1 − 5. On average, each ticket gives $4 to the raffle." },
          { t:"+$1", why:"That’s the expected prize. " + M3 },
          { t:"−$5", why:"Prizes are paid to some tickets: the expected prize is $1." },
          { t:"+$995", why:"That’s the net gain of the top ticket only." }] } }
    ]
  },
  task:{
    title:"Design a fair game", summary:"Design a fair game",
    statement:"<p>Design a spinner game with 4 equal sectors. Choose the cost to play and a prize for each sector so that the game meets every condition. Can you find all the answers? <span class=\"mdm-model\">model game</span></p>" +
      '<ol class="xv-conds"><li>The game is fair (expected net gain = 0).</li><li>At least two sectors pay nothing.</li><li>No prize is more than $12.</li><li>Exactly one sector pays more than the cost to play.</li></ol>' +
      '<p class="tiny muted">Designs that differ only in the order of the sectors count as the same.</p>',
    checks:["Fair", "At least two $0 sectors", "No prize over $12", "Exactly one winning sector"],
    tips:["Fair means the prizes add to 4 × cost.", "Use $0 for at least two sectors.", "Big prizes are capped at $12.", "Only one sector may pay more than the cost; any other paying sector must pay at most the cost."],
    explainPrompt:"Explain how you made the game fair and why your game still loses money for most players on most spins.",
    vocab:"Use the words expected value, net gain, fair and long run.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"At $5 the prizes would need to add to $20 with only one above $5 and that one at most $12, which is impossible. That’s why there are exactly six.",
    afterAt:6
  },
  cards:[
    ["Expected value", "`E(X) = Σ xP(X = x)`."],
    ["Balance point", "`E(X)` is where the probability histogram balances."],
    ["Long-run average", "Over many trials, the average of `X` approaches `E(X)`."],
    ["Die", "`E(X) = 3.5`: not a possible roll, still the expected value."],
    ["Not the most likely value", "`X` = 0 or 10 with `P` = 0.9, 0.1: most likely 0, `E = 1`."],
    ["Net gain", "Prize received − cost paid."],
    ["Fair game", "Expected net gain = 0."],
    ["Fair price", "The expected prize."],
    ["Raffles and lotteries", "Designed so players’ expected net gain is negative."],
    ["Insurance", "The insurer’s expected profit = premium − expected payout."],
    ["Working backwards", "Write `E(X)` with the unknown, set it equal to the given value, solve."],
    ["What `E` ignores", "Risk: how far results spread (see σ in module 20)."]
  ]
};
