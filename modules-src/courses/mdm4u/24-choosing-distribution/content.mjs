// MDM4U 24 Choosing the Right Distribution. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/24-choosing-distribution.md
const P = s => "<i>P</i>(" + s + ")";        // P(words) with an italic P and upright words
// Core feedback sentences for the plan's misconceptions (§3).
const M1 = "Dealing cards changes the deck. Without replacement from a small group, use the hypergeometric.";
const M2 = "‘Until the first …’ means there’s no fixed number of trials: geometric.";
const M3 = "With replacement, every draw has the same `p`: binomial.";
const M4 = "Sums of dice aren’t equally likely: 7 has 6 ways, 2 has 1.";
const M5 = "Success is the event you’re counting or waiting for. A shooter waiting for her first miss has `p = P(miss)`.";
const M6 = "Sampling 10 people from millions is so close to independent that the binomial is the sensible model.";
const ASK = "Ask the four questions in order.";

// Hero equation: four mini-histograms (bar heights out of 40 px).
function mini(id, name, hs){
  const w = 60 / hs.length;
  const bars = hs.map((h, i) => '<rect x="' + (i * w + 1).toFixed(1) + '" y="' + (42 - h).toFixed(1) + '" width="' + (w - 2).toFixed(1) + '" height="' + h.toFixed(1) + '"/>').join("");
  return '<span class="cd-hh" data-m="' + id + '"><svg viewBox="0 0 60 44" aria-hidden="true" focusable="false">' + bars + '<line x1="0" y1="42.5" x2="60" y2="42.5"/></svg><span class="cd-hl">' + name + "</span></span>";
}

export default {
  id:"24-choosing-distribution",
  kind:"topic",
  title:"Choosing the right distribution",
  topic:"Choosing the Right Distribution",
  readyTopic:"choosing the right distribution",
  hero:{
    eq:'<span class="cd-heq"><span class="cd-hrow">' + mini("uni", "Uniform", [24, 24, 24, 24, 24]) + mini("bin", "Binomial", [6, 22, 34, 22, 6]) +
      mini("geo", "Geometric", [36, 24, 16, 11, 7, 5]) + mini("hyp", "Hypergeometric", [2, 14, 38, 14, 2]) + '</span><span class="cd-hq">Which one fits?</span></span>',
    eqLabel:"Four small histograms side by side: Uniform (flat), Binomial (a hump), Geometric (a staircase) and Hypergeometric (a narrow hump). Which one fits?",
    eqSize:"sm",
    headline:"Four models, one decision",
    text:"Before you calculate, decide <strong>which model</strong> fits. Ask: are all values equally likely? Is the number of trials <strong>fixed</strong>? Are we <strong>waiting</strong> for a first success? Are items drawn <strong>without replacement</strong> from a small group? The answers point to the <strong>uniform</strong>, <strong>binomial</strong>, <strong>geometric</strong> or <strong>hypergeometric</strong> distribution.",
    fig:{ html:'<div class="cd-hfig" id="cd-hfig"></div>' }
  },
  goals:[
    "I can recognize a uniform distribution and find its expected value.",
    "I can choose between the binomial, geometric and hypergeometric models using key questions about the situation.",
    "I can identify the parameters and write the correct probability expression once the model is chosen.",
    "I can compare the means, spreads and shapes of different discrete distributions.",
    "I can solve mixed problems and justify my choice of model."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Binomial", goal:3, prompt:"`n = 3`, `p = 1/2`. Find `P(X = 1)`.",
          options:[
            { t:"`3/8`", ok:true, why:"`C(3, 1)(1/2)^3`." },
            { t:"`1/8`", why:"That’s one order only. There are 3 orders." },
            { t:"`1/3`", why:"That’s 1 ÷ `n`." },
            { t:"`1/2`", why:"That’s one trial." }],
          hints:["`C(n, x) p^x q^{n - x}`.", "3 × `1/8`.", "`3/8`."] },
        { id:"w2", skill:"Binomial", goal:2, prompt:"Which is a condition of the binomial model?",
          options:[
            { t:"The same `p` on every trial", ok:true, why:"Constant `p` is required." },
            { t:"Drawing without replacement", why:"That breaks independence." },
            { t:"Waiting for the first success", why:"That’s geometric." },
            { t:"All values equally likely", why:"That’s uniform." }],
          hints:["Remember BINS.", "S stands for ‘same `p`’.", "The same `p` on every trial."] },
        { id:"w3", skill:"Geometric", goal:3, prompt:"`p = 1/4`. Find `E(X)`, where `X` = failures before the first success.",
          options:[
            { t:"3", ok:true, why:"`q ÷ p`." },
            { t:"4", why:"That’s the average trial of the success, 1 ÷ `p`." },
            { t:"`1/3`", why:"That’s `p ÷ q`." },
            { t:"`1/4`", why:"That’s `p`." }],
          hints:["`E = q ÷ p`.", "`(3/4) ÷ (1/4)`.", "3."] },
        { id:"w4", skill:"Hypergeometric", goal:3, prompt:"From 5 red and 3 blue marbles, 2 are drawn without replacement. Find " + P("both blue") + ".",
          options:[
            { t:"`3/28`", ok:true, why:"`C(3, 2) ÷ C(8, 2)`." },
            { t:"`9/64`", why:"That’s with replacement: `(3/8)^2`. These draws aren’t replaced." },
            { t:"`3/8`", why:"That’s one draw." },
            { t:"`1/28`", why:"`C(3, 2) = 3`, not 1." }],
          hints:["Choose 2 of the 3 blues.", "Out of `C(8, 2) = 28`.", "`3/28`."] },
        { id:"w5", skill:"Hypergeometric", goal:4, prompt:"`n = 12`, `a = 3`, `r = 4`. Find `E(X)`.",
          options:[
            { t:"1", ok:true, why:"4 × 3 ÷ 12." },
            { t:"12", why:"Divide `ra` by `n`." },
            { t:"`1/4`", why:"That’s `a ÷ n`." },
            { t:"3", why:"That’s `a`." }],
          hints:["`ra ÷ n`.", "12 ÷ 12.", "1."] },
        { id:"w6", skill:"Uniform", goal:1, prompt:"A fair spinner has 4 equal sectors labelled 1, 2, 3, 4. Find `E(X)`.",
          options:[
            { t:"2.5", ok:true, why:"Equally likely values: the average is (1 + 4) ÷ 2." },
            { t:"10", why:"That adds the values. Divide the total by 4." },
            { t:"`1/4`", why:"That’s each probability." },
            { t:"2", why:"The middle of 1 to 4 is 2.5." }],
          hints:["Each value has probability `1/4`.", "(1 + 2 + 3 + 4) ÷ 4.", "2.5."] }
      ],
      refreshers:{
        "Binomial":"Fixed `n`, independent trials, constant `p`: `C(n, x) p^x q^{n - x}`; `E = np`.",
        "Geometric":"Waiting for the first success: `q^x p`; `E = q ÷ p`.",
        "Hypergeometric":"Without replacement from a small group: `C(a, x) C(n - a, r - x) ÷ C(n, r)`; `E = ra ÷ n`.",
        "Uniform":"`k` equally likely values, each with probability `1/k`; `E` is their average."
      }
    }
  },
  explore:{
    heading:"Distribution detective",
    intro:"Route each scenario through the questions, enter its parameters and see its distribution. Then compare two models side by side.",
    // Scenario deck (plan: S1–S12). fit = the model the card routes to; par = its stored parameters (n = group size for the hypergeometric).
    cards:[
      { id:"s1", t:"A fair 10-sided die (1–10) is rolled once; `X` = the number", fit:"uni", par:{ k:10 }, say:{ k:"the die has 10 faces" } },
      { id:"s2", t:"8 coin tosses; `X` = heads", fit:"bin", par:{ n:8, p:"1/2" }, say:{ n:"8 tosses", p:"a fair coin: heads has probability `1/2`" } },
      { id:"s3", t:"Roll a die until a 6; `X` = non-6 rolls first", fit:"geo", par:{ p:"1/6" }, say:{ p:"success is rolling a 6" } },
      { id:"s4", t:"Deal 4 cards; `X` = aces", fit:"hyp", par:{ n:52, a:4, r:4 }, say:{ n:"a deck has 52 cards", a:"a deck has 4 aces", r:"4 cards are dealt" } },
      { id:"s5", t:"Guess 10 multiple-choice questions with 5 options each; `X` = number correct", fit:"bin", par:{ n:10, p:"1/5" }, say:{ n:"10 questions", p:"1 of 5 options is right" } },
      { id:"s6", t:"A 3-person committee from 5 girls and 4 boys; `X` = girls", fit:"hyp", par:{ n:9, a:5, r:3 }, say:{ n:"5 + 4 = 9 people", a:"5 girls", r:"a 3-person committee" } },
      { id:"s7", t:"Spin (red `1/4`) until red; `X` = non-red spins first", fit:"geo", par:{ p:"1/4" }, say:{ p:"red has probability `1/4`" } },
      { id:"s8", t:"A random student number from 1 to 30 wins a prize; `X` = the number", fit:"uni", par:{ k:30 }, say:{ k:"the numbers run from 1 to 30" } },
      { id:"s9", t:"Test 3 bulbs from a box of 12 with 2 defective; `X` = defective found", fit:"hyp", par:{ n:12, a:2, r:3 }, say:{ n:"a box of 12", a:"2 are defective", r:"3 bulbs are tested" } },
      { id:"s10", t:"Rain on each of 7 days, 30% each day independently; `X` = rainy days", fit:"bin", par:{ n:7, p:"0.3" }, say:{ n:"7 days", p:"30% each day" } },
      { id:"s11", t:"Roll two dice; `X` = the sum", fit:"none", par:{}, say:{} , note:"Values 2–12, not equally likely." },
      { id:"s12", t:"Phone calls, each answered with probability `1/3`, until one is answered; `X` = unanswered calls", fit:"geo", par:{ p:"1/3" }, say:{ p:"each call is answered with probability `1/3`" } }
    ],
    predIntro:"Make a prediction first. Then the detective will show you what really happens.",
    predictions:[
      { id:"p1", start:{ view:"route", card:1 },
        prompt:"Which model fits a single roll of a fair 10-sided die?",
        options:[{ t:"Uniform", ok:true }, { t:"Binomial" }, { t:"Geometric" }, { t:"Hypergeometric" }],
        explain:"Each value 1–10 is equally likely; `E = 5.5`." },
      { id:"p2", start:{ view:"compare", a:"binomial (4, 1/2)", b:"hypergeometric (8, 4, 4)" },
        prompt:"Both have mean 2. Which has the larger spread?",
        options:[{ t:"The binomial", ok:true }, { t:"The hypergeometric" }, { t:"They’re equal" }, { t:"Neither has any spread" }],
        explain:"Without replacement, extreme results are less likely: drawing 4 of the 4 successes from 8 is rare." },
      { id:"p3", start:{ view:"compare", a:"geometric (1/3)", b:"binomial (6, 1/3)" },
        prompt:"How do their means compare?",
        options:[{ t:"They’re equal (2), but the geometric spreads much further", ok:true }, { t:"The geometric’s mean is 3" }, { t:"The binomial’s mean is larger" }, { t:"They’re identical distributions" }],
        explain:"`(2/3) ÷ (1/3) = 2 = 6 × 1/3`. Same centre, very different shapes." },
      { id:"p4", start:{ view:"route", card:11 },
        prompt:"Is the sum of two dice uniform?",
        options:[{ t:"No: 7 is the most likely sum", ok:true }, { t:"Yes: 11 equally likely sums" }, { t:"Yes, between 2 and 12" }, { t:"It’s binomial" }],
        explain:"Count the ways: 1 way for 2, 6 ways for 7." }
    ],
    chalIntro:"Use the detective to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:4, prompt:"In Compare view, set a binomial and a hypergeometric distribution so that <strong>both</strong> have mean 2.",
        why:"`np = 2` and `ra ÷ n = 2`: for example, binomial (4, `1/2`) with hypergeometric (10, 5, 4).",
        hints:["Binomial: `np`. Hypergeometric: `ra ÷ n`.", "Pick `n = 4`, `p = 1/2` for the binomial.", "Then try `r = 4` with `a ÷ n = 1/2`."] },
      { id:"tc2", goal:4, prompt:"Choose `p` for a geometric distribution with the same mean as the binomial (6, `1/3`).",
        why:"Geometric `p = 1/3`: `(2/3) ÷ (1/3) = 2 = 6 × 1/3`. Both means are 2.",
        hints:["The binomial mean is `6 × 1/3 = 2`.", "You need `q ÷ p = 2`.", "`p = 1/3`."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Build a scenario that the detective routes to <strong>geometric</strong> with `E(X) = 3`. Use the scenario builder in Route it view.",
        why:"A spinner with `p = 1/4` (or the bag <strong>with</strong> replacement, `3/12 = 1/4`), until the first red, counting non-reds: `(3/4) ÷ (1/4) = 3`.",
        hints:["Geometric needs ‘until the first success’, a constant `p`, and counting failures.", "You need `q ÷ p = 3`, so `p = 1/4`.", "A spinner with `p = 1/4`, or the bag with replacement (3 of 12 is `1/4`)."] }
    ]
  },
  part3:{
    slug:"mixed", name:"Mixed problems",
    heading:"Mixed problems",
    intro:"Real problems don’t announce their model. At each station, name the model before you calculate. The “Check it with algebra” panel shows why another model would give a different answer.",
    stations:{
      s1:{ t:"A bag holds 6 red and 4 blue marbles.",
        parts:[
          { id:"a", q:"Draw 3 <strong>with</strong> replacement; `X` = reds. Find `P(X = 2)`.", fit:"bin",
            calc:"Binomial (3, 0.6): `P(X = 2) = 3(0.36)(0.4) = 0.432`.", v:0.432,
            wrong:{ hyp:"With replacement, every draw has the same `p`: binomial.", geo:"There’s a fixed number of draws: 3.", uni:"The values 0–3 aren’t equally likely." } },
          { id:"b", q:"Draw 3 <strong>without</strong> replacement; `X` = reds. Find `P(X = 2)`.", fit:"hyp",
            calc:"Hypergeometric: `C(6, 2) C(4, 1) ÷ C(10, 3) = 60/120 = 0.5`.", v:0.5,
            wrong:{ bin:"Without replacement from a small group, use the hypergeometric.", geo:"There’s a fixed number of draws: 3.", uni:"The values 0–3 aren’t equally likely." } },
          { id:"c", q:"Draw <strong>with</strong> replacement until the first blue; `X` = reds first. Find `P(X = 2)`.", fit:"geo",
            calc:"Geometric (0.4): `P(X = 2) = (0.6)^2(0.4) = 0.144`.", v:0.144,
            wrong:{ bin:"‘Until the first …’ means there’s no fixed number of trials: geometric.", hyp:"The marbles go back, and you’re waiting for the first blue.", uni:"The values aren’t equally likely." } }
        ] },
      s2:{ t:"A goalie stops `3/4` of penalty shots. `X` = saves before the first goal.",
        right:"Success = a goal, the event you’re waiting for. So `p = 1/4` and `E(X) = (3/4) ÷ (1/4) = 3`.",
        wrong:"Success is the event you’re counting or waiting for. Here the wait ends at the first goal, so success = a goal.",
        alt:"With `p = 3/4` you’d get `E = (1/4) ÷ (3/4) = 1/3`: that counts goals before the first save, not saves before the first goal." },
      s3:{ t:"10 people are polled from a city of 2 000 000, where 40% bike to work. `X` = people who bike.",
        right:"Strictly, the people are chosen without replacement from a fixed population: hypergeometric.",
        wrong:"No one is polled twice: the people are chosen without replacement. Strictly, that’s hypergeometric.",
        after:M6 },
      s4:{ t:"A spinner with 4 equal sectors (1, 2, 3, 4) is spun twice, and `X` = the larger number.",
        lesson:"Not every variable has a named model. You can always build the table from the sample space." }
    },
    quickCheck:{
      title:"Quick check", summary:"Mixed problems quick check",
      items:[
        { id:"q1", goal:2, prompt:"Deal 5 cards; `X` = hearts.",
          choices:[
            { t:"Hypergeometric", ok:true, fb:"Right. A fixed number of cards, dealt without replacement from a 52-card deck." },
            { t:"Binomial", fb:M1 },
            { t:"Geometric", fb:M1 },
            { t:"Uniform", fb:M1 }] },
        { id:"q2", goal:2, prompt:"Roll until a 1; `X` = rolls before it.",
          choices:[
            { t:"Geometric", ok:true, fb:"Right. You wait for the first 1, with `p = 1/6` each roll." },
            { t:"Binomial", fb:M2 },
            { t:"Uniform", fb:M2 },
            { t:"Hypergeometric", fb:M2 }] },
        { id:"q3", goal:1, prompt:"A fair 12-sided die; `X` = the number shown.",
          choices:[
            { t:"Uniform", ok:true, fb:"Right. Each of 1–12 has probability `1/12`." },
            { t:"Binomial", fb:"Each of 1–12 is equally likely, with probability `1/12`: uniform." },
            { t:"Geometric", fb:"Each of 1–12 is equally likely, with probability `1/12`: uniform." },
            { t:"None", fb:"Each of 1–12 is equally likely, with probability `1/12`: uniform." }] },
        { id:"q4", goal:2, prompt:"Flip a coin 9 times; `X` = heads.",
          choices:[
            { t:"Binomial", ok:true, fb:"Right. 9 independent flips, each a head with `p = 1/2`." },
            { t:"Uniform", fb:"9 fixed, independent flips with the same `p = 1/2`: binomial." },
            { t:"Geometric", fb:"9 fixed, independent flips with the same `p = 1/2`: binomial." },
            { t:"Hypergeometric", fb:"9 fixed, independent flips with the same `p = 1/2`: binomial." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"route", type:"sorter", title:"Route the scenario", summary:"Route the scenario", goal:[1, 2], noun:"scenario", txt:true,
        instruction:"Sort each scenario into the model that fits it.",
        boxes:[
          { id:"uni", label:"Uniform" },
          { id:"bin", label:"Binomial" },
          { id:"geo", label:"Geometric" },
          { id:"hyp", label:"Hypergeometric" },
          { id:"none", label:"None of these" }],
        items:[
          { id:"r1", t:"Pick a random day of the week; `X` = its number (1–7)", answer:"uni", goal:1,
            why:"7 values, each with probability `1/7`.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Uniform."] },
          { id:"r2", t:"12 penalty shots, each saved with probability 0.7; `X` = saves", answer:"bin", goal:2,
            why:"A fixed 12 shots, each saved with the same `p = 0.7`.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Binomial."] },
          { id:"r3", t:"Shoot until the first goal; `X` = misses first", answer:"geo", goal:2,
            why:"Waiting for the first goal: geometric.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Geometric."],
            wrong:{ bin:"There’s no fixed number of shots." } },
          { id:"r4", t:"Choose 5 of 20 songs for a playlist (8 are Canadian); `X` = Canadian songs", answer:"hyp", goal:2,
            why:"5 songs chosen without replacement from a small group of 20.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Hypergeometric."] },
          { id:"r5", t:"Roll two dice; `X` = the product", answer:"none", goal:1,
            why:"Products aren’t equally likely, and they aren’t a count of successes: no named model fits.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "None of these."],
            wrong:{ uni:"Products aren’t equally likely: 6 comes up 4 ways, 1 only once." } },
          { id:"r6", t:"Draw 4 marbles with replacement from 3 red and 7 blue; `X` = reds", answer:"bin", goal:2,
            why:"With replacement, all 4 draws have `p = 0.3`.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Binomial."],
            wrong:{ hyp:"With replacement, every draw has `p = 0.3`." } },
          { id:"r7", t:"Open boxes until finding a prize (1 in 10 has one); `X` = empty boxes first", answer:"geo", goal:2,
            why:"Waiting for the first prize, `p = 1/10` each box.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Geometric."] },
          { id:"r8", t:"Draw 3 tiles from 10 (4 vowels) without replacement; `X` = vowels", answer:"hyp", goal:2,
            why:"3 tiles drawn without replacement from a small group of 10.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Hypergeometric."] },
          { id:"r9", t:"A random integer from 1 to 100; `X` = the integer", answer:"uni", goal:1,
            why:"100 values, each with probability `1/100`.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "Uniform."] },
          { id:"r10", t:"Toss a coin 6 times; `X` = the length of the longest run of heads", answer:"none", goal:2,
            why:"`X` is a run length, not a count of successes, and its values aren’t equally likely: no named model fits.",
            hints:["Equally likely values?", "Fixed trials? Replacement? Waiting?", "None of these."] }
        ],
        wrongDefault:ASK },
      { id:"calc", type:"custom", title:"Mixed calculations", summary:"Mixed calculations", goal:[1, 3, 4, 5],
        instruction:"Choose the model, then find each value. Items marked ★ are non-routine; M5 and M7 go beyond the Final Check.",
        how:"Type a whole number, a fraction such as 9/64 or a decimal, then press Check.",
        items:[
          { id:"m1", goal:1, prompt:"A spinner has 4 equal sectors labelled 2, 4, 6, 8. `E(X)`?", answer:5, display:"5",
            why:"Uniform: `(2 + 4 + 6 + 8) ÷ 4 = 20 ÷ 4 = 5`.",
            wrong:[{ match:20, fb:"Divide the total by 4." }] },
          { id:"m2", goal:3, prompt:"`n = 3`, `p = 1/4`: binomial `P(X = 2)`.", answer:9 / 64, display:"`9/64`",
            why:"`C(3, 2)(1/4)^2(3/4) = 3 × 3/64 = 9/64`.",
            wrong:[{ match:3 / 64, fb:"Multiply by `C(3, 2) = 3`." }] },
          { id:"m3", goal:3, prompt:"Geometric, `p = 1/5`: `P(X = 2)`.", answer:16 / 125, display:"`16/125`",
            why:"`(4/5)^2(1/5) = 16/125`.",
            wrong:[{ match:4 / 25, fb:"Two failures: `(4/5)^2`, then the success, `1/5`." }] },
          { id:"m4", goal:3, prompt:"Hypergeometric, `n = 7`, `a = 3`, `r = 2`: `P(X = 1)`.", answer:4 / 7, display:"`4/7`",
            why:"`C(3, 1) C(4, 1) ÷ C(7, 2) = 12/21 = 4/7`.",
            wrong:[{ match:24 / 49, fb:"That’s with replacement. " + M1 }] },
          { id:"m5", goal:5, star:true, prompt:"A bag has 6 items, 2 of them prizes. Draw <strong>without replacement</strong> until the first prize. " + P("the first prize is on the 3rd draw") + "?", answer:1 / 5, display:"`1/5`",
            why:"Not geometric: the bag changes. `(4/6)(3/5)(2/4) = 24/120 = 1/5`.",
            wrong:[{ match:4 / 27, fb:"That’s geometric, but the bag changes after each draw: `(4/6)(3/5)(2/4)`." }],
            hints:["Is the probability constant from draw to draw?", "No. Multiply: non-prize, non-prize, prize.", "`(4/6)(3/5)(2/4) = 1/5`."] },
          { id:"m6", goal:4, star:true, prompt:"Hypergeometric with `r = 3` and `a = 4` has `E(X) = 2`. Find the group size `n`.", answer:6, display:"6",
            why:"`ra ÷ n = 12 ÷ n = 2`, so `n = 6`.",
            wrong:[{ match:24, fb:"`ra ÷ n = 2`, so `n = 12 ÷ 2`." }] },
          { id:"m7", goal:4, star:true, prompt:"A binomial (`n`, `1/4`) and a geometric (`1/4`) have equal means. Find `n`.", answer:12, display:"12",
            why:"Geometric `E = q ÷ p = (3/4) ÷ (1/4) = 3`, so `n × 1/4 = 3` and `n = 12`.",
            wrong:[{ match:16, fb:"Geometric `E = q ÷ p = 3`, not 4." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Zuri", how:"", goal:[1, 2, 3],
        instruction:"Zuri made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"4 cards are dealt from a deck. Find " + P("exactly 1 heart") + ".",
            steps:["Each card is either a heart or not.", "So it’s binomial with `n = 4`, `p = 1/4`.", "`P = C(4, 1)(1/4)(3/4)^3 = 27/64`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Dealing is without replacement: hypergeometric, `P = C(13, 1) C(39, 3) ÷ C(52, 4)`.", ok:true, why:M1 },
              { t:"Geometric with `p = 1/4`.", why:"We’re not waiting for a first heart." },
              { t:"Uniform: `P = 1/5`.", why:"The 5 values aren’t equally likely." },
              { t:"Step 2 is correct.", why:"Each card dealt changes the deck." }],
            hints:["Is each card put back?", "No: dependent draws.", "Hypergeometric."] },
          { id:"e2", goal:3, task:"A shooter makes `4/5` of her free throws. `X` = makes before her first miss. Find `E(X)`.",
            steps:["This is a waiting time: geometric.", "`p = 4/5`, her success rate.", "`E = q ÷ p = (1/5) ÷ (4/5) = 1/4`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"She’s waiting for a miss, so success = miss and `p = 1/5`: `E = (4/5) ÷ (1/5) = 4`.", ok:true, why:M5 },
              { t:"Use `E = 1 ÷ p = 5/4`.", why:"That’s not the fix." },
              { t:"It’s binomial with `n = 5`.", why:"There’s no fixed `n`." },
              { t:"Step 2 is correct.", why:"Success is the event you’re waiting for." }],
            hints:["Which event ends the wait?", "A miss.", "`p = 1/5`, `E = 4`."] },
          { id:"e3", goal:1, task:"Two dice are rolled. Find " + P("sum = 7") + ".",
            steps:["The sums run from 2 to 12: 11 values.", "Each sum is equally likely, so the sum is uniform.", "`P(7) = 1/11`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Count the outcomes: 6 of 36 give 7, so `P = 1/6`. The sums aren’t uniform.", ok:true, why:M4 },
              { t:"`P(7) = 7/12`.", why:"That’s not a probability model." },
              { t:"`P(7) = 2/36`.", why:"Six pairs give 7." },
              { t:"Step 2 is correct.", why:"1 + 1 is the only way to get 2; there are six ways to get 7." }],
            hints:["How many ways give 2? Give 7?", "1 and 6.", "`6/36 = 1/6`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which comparison surprised you more: binomial vs hypergeometric spread, or geometric vs binomial with the same mean?" },
      { id:"j2", q:"In your own words, list the questions you ask to choose a model, and say why their order matters." },
      { id:"j3", q:"Explain to a friend how one bag of marbles can lead to three different models." },
      { id:"j4", q:"Which model do you most often mix up? What clue will you look for next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A bag has 6 red and 4 blue marbles. 3 are drawn <strong>without</strong> replacement; `X` = reds. Which model fits?", options:[
          { t:"Hypergeometric", ok:true, why:"Fixed draws, no replacement, a small group." },
          { t:"Binomial", why:"Without replacement, the probability changes. " + M1 },
          { t:"Geometric", why:"There’s no waiting for a first success." },
          { t:"Uniform", why:"The values aren’t equally likely." }] },
        b:{ prompt:"The same bag, but 3 are drawn <strong>with</strong> replacement; `X` = reds. Which model fits?", options:[
          { t:"Binomial", ok:true, why:"Each draw has `p = 0.6`." },
          { t:"Hypergeometric", why:"With replacement, the draws are independent. " + M3 },
          { t:"Geometric", why:"There’s a fixed number of draws." },
          { t:"Uniform", why:"The values 0–3 aren’t equally likely." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which variable has a uniform distribution?", options:[
          { t:"The number on a fair 8-sided die", ok:true, why:"Each of 1–8 has probability `1/8`." },
          { t:"The sum of two dice", why:M4 },
          { t:"The number of heads in 2 tosses", why:"0, 1 and 2 have probabilities `1/4`, `1/2` and `1/4`." },
          { t:"Tails before the first head", why:"That’s geometric." }] },
        b:{ prompt:"A spinner has 5 equal sectors numbered 1 to 5. Find `E(X)`.", options:[
          { t:"3", ok:true, why:"(1 + 5) ÷ 2." },
          { t:"15", why:"That’s the sum." },
          { t:"2.5", why:"The middle of 1 to 5 is 3." },
          { t:"`1/5`", why:"That’s each probability." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"A die is rolled until a 6 appears; `X` = non-6 rolls before it. Which model and parameter?", options:[
          { t:"Geometric with `p = 1/6`", ok:true, why:"Waiting for the first 6, which has probability `1/6` on each roll." },
          { t:"Binomial with `n = 6`, `p = 1/6`", why:M2 },
          { t:"Geometric with `p = 5/6`", why:"Success is the event you’re waiting for: the 6, with `p = 1/6`." },
          { t:"Uniform on 1 to 6", why:"That describes the face on one roll, not the wait for a 6." }] },
        b:{ prompt:"A shooter makes 80% of her free throws. She shoots until her first miss; `X` = makes before it. Which model and parameter?", options:[
          { t:"Geometric with `p = 0.2`", ok:true, why:"Success = the miss she’s waiting for." },
          { t:"Geometric with `p = 0.8`", why:M5 },
          { t:"Binomial with `p = 0.8`", why:"‘Until her first miss’ means there’s no fixed number of trials: geometric." },
          { t:"Hypergeometric", why:"Nothing is drawn from a small group; she shoots until a miss." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"A 5-question true/false quiz is answered by guessing. Find " + P("exactly 4 correct") + ".", options:[
          { t:"`5/32`", ok:true, why:"Binomial: `C(5, 4)(1/2)^5`." },
          { t:"`1/32`", why:"That’s one order." },
          { t:"`10/32`", why:"That’s `P(exactly 2)` or `P(exactly 3)`." },
          { t:"`1/2`", why:"The scores aren’t equally likely." }] },
        b:{ prompt:"A class of 6 has 2 left-handed students. 3 are chosen at random. Find " + P("exactly 1 left-handed") + ".", options:[
          { t:"`3/5`", ok:true, why:"Hypergeometric: `C(2, 1) C(4, 2) ÷ C(6, 3) = 12/20`." },
          { t:"`4/9`", why:"That’s the binomial with `p = 1/3`. " + M1 },
          { t:"`1/10`", why:"Also choose the 2 right-handed students." },
          { t:"`1/3`", why:"That’s 2 ÷ 6." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Binomial (`n = 4`, `p = 1/2`) and hypergeometric (`n = 8`, `a = 4`, `r = 4`). Which statement is true?", options:[
          { t:"Both have mean 2; the hypergeometric has the smaller spread", ok:true, why:"`σ = 1` for the binomial and `σ ≈ 0.76` for the hypergeometric: without replacement narrows it." },
          { t:"Both have mean 2; the binomial has the smaller spread", why:"Without replacement narrows the distribution." },
          { t:"Their means differ", why:"`4 × 1/2 = 4 × 4/8 = 2`." },
          { t:"They’re identical", why:"Their probabilities differ: `P(X = 4)` is `1/16` vs `1/70`." }] },
        b:{ prompt:"Geometric (`p = 1/3`) and binomial (`n = 4`, `p = 1/2`). Which statement is true?", options:[
          { t:"Both have mean 2, but the geometric can take any whole-number value and is skewed right, so it’s more spread out", ok:true, why:"`(2/3) ÷ (1/3) = 2 = 4 × 1/2`, but the geometric’s tail runs on past 4." },
          { t:"Both have mean 2 and the same spread", why:"The geometric runs far past 4." },
          { t:"The binomial has the larger mean", why:"Both are 2." },
          { t:"The geometric’s mean is 3", why:"That’s 1 ÷ `p`, the trial number." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A carton of 12 eggs has 2 cracked. Eggs are taken one at a time without replacement until a cracked one appears. Find " + P("the first cracked egg is the 3rd one taken") + ".", options:[
          { t:"`3/22`", ok:true, why:"`(10/12)(9/11)(2/10)`." },
          { t:"`25/216`", why:"That’s the geometric, but the carton changes after each egg." },
          { t:"`9/22`", why:"That’s " + P("exactly one cracked egg among 3") + "." },
          { t:"`1/6`", why:"That’s the first egg only." }] },
        b:{ prompt:"A box of 10 pens has 3 dry. Pens are tested one at a time without replacement until a dry one is found. Find " + P("the first dry pen is the 2nd tested") + ".", options:[
          { t:"`7/30`", ok:true, why:"`(7/10)(3/9)`." },
          { t:"`21/100`", why:"Geometric, but the box changes." },
          { t:"`7/15`", why:"That’s " + P("exactly one dry pen among 2") + "." },
          { t:"`3/10`", why:"That’s the first pen." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"10 people are surveyed from a city of 2 000 000, where 40% bike. Which is the best justification for using the binomial?", options:[
          { t:"“The population is so large that removing 10 people barely changes the 40%, so the responses are nearly independent with constant `p`.”", ok:true, why:M6 },
          { t:"“People are surveyed with replacement.”", why:"They aren’t, and it doesn’t matter here." },
          { t:"“Surveys are always binomial.”", why:"Small groups need the hypergeometric." },
          { t:"“40% is less than 50%.”", why:"`p`’s size doesn’t decide the model." }] },
        b:{ prompt:"Why is ‘rolls until a 6’ geometric rather than binomial?", options:[
          { t:"“There’s no fixed number of trials: we keep rolling until the first success.”", ok:true, why:M2 },
          { t:"“Because a 6 is rare.”", why:"Rarity doesn’t decide the model." },
          { t:"“Because the rolls are dependent.”", why:"They’re independent." },
          { t:"“Because each value is equally likely.”", why:"That describes a single roll." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which expression gives " + P("exactly 2 aces in a 5-card hand") + "?", options:[
          { t:"`C(4, 2) C(48, 3) ÷ C(52, 5)`", ok:true, why:"Choose 2 of the 4 aces and 3 of the 48 other cards, out of all 5-card hands." },
          { t:"`C(5, 2)(1/13)^2(12/13)^3`", why:"Cards aren’t replaced. " + M1 },
          { t:"`C(4, 2) ÷ C(52, 5)`", why:"Also choose the 3 non-aces." },
          { t:"`(12/13)^2(1/13)`", why:"That’s a waiting time." }] },
        b:{ prompt:"Which expression gives " + P("exactly 2 heads in 5 coin tosses") + "?", options:[
          { t:"`C(5, 2)(1/2)^5`", ok:true, why:"`C(5, 2)` orders, each with probability `(1/2)^2(1/2)^3 = (1/2)^5`." },
          { t:"`(1/2)^2(1/2)`", why:"That’s a waiting time." },
          { t:"`C(5, 2)(1/2)^2`", why:"The 3 tails need probability factors too." },
          { t:"`2/5`", why:"The outcomes 0–5 aren’t equally likely." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A factory says 1 in 10 of its bulbs is defective. You buy a pack of 4 bulbs taken from a huge production run. Find " + P("at least one defective") + ".", use:"`0.9^4 = 0.6561` and `0.9^3 = 0.729`", options:[
          { t:"About 0.344", ok:true, why:"Binomial: `1 - 0.9^4`." },
          { t:"0.4", why:"That adds 0.1 four times." },
          { t:"About 0.656", why:"That’s " + P("none") + "." },
          { t:"About 0.292", why:"That’s " + P("exactly one") + " = `4(0.1)(0.729)`." }] },
        b:{ prompt:"In a game, you roll a die until a 6 appears and win if fewer than 2 non-6 rolls come first. Find " + P("win") + ".", options:[
          { t:"`11/36`", ok:true, why:"Geometric: `X <= 1`, so `1 - (5/6)^2`." },
          { t:"`1/3`", why:"That adds `1/6 + 1/6`." },
          { t:"`25/36`", why:"That’s the complement." },
          { t:"`5/36`", why:"That’s only `X = 1`." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A teacher picks 4 students at random from a class of 12, of whom 5 play hockey. Find the expected number of hockey players chosen.", options:[
          { t:"`5/3`", ok:true, why:"Hypergeometric: `ra ÷ n = 20/12`." },
          { t:"20", why:"Divide by 12." },
          { t:"`5/4`", why:"That’s `a ÷ r`." },
          { t:"`12/5`", why:"That’s `n ÷ a`." }] },
        b:{ prompt:"You roll a die until a 6 appears. Find the expected number of non-6 rolls first.", options:[
          { t:"5", ok:true, why:"Geometric: `(5/6) ÷ (1/6)`." },
          { t:"6", why:"That’s the average roll number of the 6." },
          { t:"`1/5`", why:"That’s `p ÷ q`." },
          { t:"`1/6`", why:"That’s `p`." }] } }
    ]
  },
  task:{
    title:"Same mean, different model", summary:"Same mean, different model",
    statement:"<p>Set up a binomial model and a hypergeometric model of the <strong>same</strong> situation (the same number of draws and the same proportion of successes), so that replacement makes a visible difference. Can you find all the answers?</p>" +
      '<ol class="cd-conds"><li>The binomial has mean exactly 2.</li><li>Same set-up: the hypergeometric draws `r = n` items, and its proportion `a ÷` (group size) equals `p`.</li><li>Replacement matters: the hypergeometric’s `σ` is at most 90% of the binomial’s.</li><li>The group is small: at most 15 items.</li></ol>',
    checks:["Binomial mean 2", "Same set-up", "Replacement matters", "Small group"],
    tips:["`np = 2`: try `n = 4` with `p = 1/2`, `n = 6` with `p = 1/3`, and so on.", "Match the hypergeometric: `r = n`, and pick `a` so that `a ÷` group `= p`.", "The hypergeometric’s `σ` shrinks when you draw a big share of the group.", "Keep the group at 15 or fewer items."],
    explainPrompt:"Explain why the two models have the same mean but different spreads, and how drawing a larger share of the group changes the difference.",
    vocab:"Use the words with replacement, without replacement, mean and standard deviation.",
    more:"There’s more than one answer. Can you find another? The bigger the share of the group you draw, the more replacement matters.",
    after3:"Each answer draws a large share of a small group: that’s what makes the hypergeometric narrower.",
    afterAt:9
  },
  cards:[
    ["Question 1", "Are all values equally likely? Yes → <strong>uniform</strong>."],
    ["Question 2", "Is the number of trials fixed? No → waiting → <strong>geometric</strong>."],
    ["Question 3", "Fixed trials, without replacement from a small group? Yes → <strong>hypergeometric</strong>; no → <strong>binomial</strong>."],
    ["Uniform", "`k` equally likely values; `P = 1/k`; `E` = their average."],
    ["Binomial", "`C(n, x) p^x q^{n - x}`; `E = np`."],
    ["Geometric", "`q^x p` (failures before the first success); `E = q ÷ p`."],
    ["Hypergeometric", "`C(a, x) C(n - a, r - x) ÷ C(n, r)`; `E = ra ÷ n`."],
    ["Same set-up, with vs without replacement", "Same mean; without replacement is less spread out."],
    ["Defining success", "The event you count or wait for, even if it’s a “miss”."],
    ["Huge population", "Sampling without replacement ≈ binomial."],
    ["Sum of two dice", "Not uniform: 7 is the most likely sum."],
    ["No named model?", "Build the table from the sample space."]
  ]
};
