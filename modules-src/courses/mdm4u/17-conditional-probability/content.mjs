// MDM4U 17 Conditional Probability. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/17-conditional-probability.md
const P = s => "<i>P</i>(" + s + ")";            // P(words) with an italic P and upright words
const A = "<i>A</i>", B = "<i>B</i>";
// Core feedback sentences for the plan's misconceptions (§3), used where an option names only its misconception.
const M1 = "The condition comes after the bar. " + P("job | Grade 12") + " restricts to Grade 12 students, not to students with jobs.";
const M2 = "Given " + A + ", only the outcomes in " + A + " count. Divide by `n(A)`, not by the total.";
const M3 = "“And” is a share of everyone; “given” is a share of the condition.";
const M4 = "Without replacement, the second draw comes from a smaller, changed group.";
const M5 = "Most positives can come from the large group without the condition.";
const M6 = "“Given” means “we know it”, not “it came first”. You can find " + P("first draw red | second draw red") + ".";
const M7 = "Mutually exclusive events can’t both happen; independent events don’t affect each other’s probability.";
// the job table (warm-up W1–W2, Explore table mode)
const JOB = '<div class="tbl-wrap"><table class="vt cp-qt"><caption class="vh">Students by grade and part-time job</caption><thead><tr><th scope="col"></th><th scope="col">Job</th><th scope="col">No job</th><th scope="col">Total</th></tr></thead><tbody>' +
  '<tr><th scope="row">Grade 11</th><td>18</td><td>42</td><td>60</td></tr><tr><th scope="row">Grade 12</th><td>30</td><td>30</td><td>60</td></tr><tr><th scope="row">Total</th><td>48</td><td>72</td><td>120</td></tr></tbody></table></div>';
// the licence survey (Practice activity 1)
const LIC = '<div class="tbl-wrap"><table class="vt cp-qt"><caption class="vh">A survey of 200 Grade 12 students: plans after high school and driver’s licence</caption><thead><tr><th scope="col"></th><th scope="col">Licence</th><th scope="col">No licence</th><th scope="col">Total</th></tr></thead><tbody>' +
  '<tr><th scope="row">University</th><td>60</td><td>40</td><td>100</td></tr><tr><th scope="row">College</th><td>36</td><td>24</td><td>60</td></tr><tr><th scope="row">Work</th><td>28</td><td>12</td><td>40</td></tr><tr><th scope="row">Total</th><td>124</td><td>76</td><td>200</td></tr></tbody></table></div>';

export default {
  id:"17-conditional-probability",
  kind:"topic",
  title:"Conditional probability",
  topic:"Conditional Probability",
  readyTopic:"conditional probability",
  hero:{
    eq:"`P(B | A)` `= P(A ∩ B) ÷ P(A)`",
    eqLabel:"P of B given A equals P of A and B, divided by P of A",
    eqSize:"sm",
    headline:"Knowing something changes the odds",
    text:"A <strong>conditional probability</strong> `P(B | A)` answers: <em>if we know " + A + " happened, how likely is " + B + "?</em> Knowing " + A + " throws away every outcome outside " + A + ", so the <strong>condition</strong> becomes the new whole. Flip the question to `P(A | B)` and the answer can change completely.",
    fig:{ html:'<div class="cph" id="cph" role="img" aria-label="120 students in a grid: 60 in Grade 11 on top (18 with jobs) and 60 in Grade 12 below (30 with jobs). Given Grade 12, the top half fades: 30 of 60 have jobs, 1/2. Given has a job, the students without jobs fade instead: 30 of 48 are in Grade 12, 5/8.">' +
      '<p class="cph-given" id="cph-given" aria-hidden="true"></p><div class="cph-grid" id="cph-grid" aria-hidden="true"></div>' +
      '<p class="cph-key tiny muted" aria-hidden="true"><span><i class="cph-k on"></i>has a job</span><span><i class="cph-k"></i>no job</span></p></div>' }
  },
  goals:[
    "I can explain `P(B | A)` as a probability within the restricted sample space " + A + ".",
    "I can find conditional probabilities from two-way tables and Venn diagrams.",
    "I can use `P(B | A) = P(A ∩ B) ÷ P(A)` and the multiplication rule `P(A ∩ B) = P(A) × P(B | A)`.",
    "I can use tree diagrams for dependent events, including “reversing” a tree to find " + P("first | second") + ".",
    "I can tell `P(B | A)` from `P(A | B)` and use conditional probability to test independence.",
    "I can solve and explain problems in context (screening tests, quality control) and account for base rates."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Two-way tables", goal:2,
          prompt:"From the table, what is " + P("a randomly chosen student is in Grade 12 <strong>and</strong> has a job") + "?" + JOB,
          options:[
            { t:"`1/4`", ok:true, why:"30 of all 120 students." },
            { t:"`5/8`", why:"30/48 divides by job-holders. “And” is a share of everyone." },
            { t:"`1/2`", why:"30/60 divides by Grade 12. That’s “given Grade 12”." },
            { t:"`2/5`", why:"48/120 counts job-holders only. That ignores the grade." }],
          hints:["Which cell is “Grade 12 and job”?", "30.", "`30/120 = 1/4`."] },
        { id:"w2", skill:"Two-way tables", goal:2,
          prompt:"How many students have no job?" + JOB,
          options:[
            { t:"72", ok:true, why:"The “No job” column total." },
            { t:"42", why:"That’s Grade 11 only. Add both grades." },
            { t:"30", why:"That’s Grade 12 only. Add both grades." },
            { t:"48", why:"That’s the “Job” total." }],
          hints:["Find the column.", "42 + 30.", "72."] },
        { id:"w3", skill:"Tree diagrams", goal:4,
          prompt:"A bag holds 3 red and 2 blue marbles. Two are drawn <strong>with</strong> replacement. What is " + P("red, then red") + "?",
          options:[
            { t:"`9/25`", ok:true, why:"`3/5 × 3/5`." },
            { t:"`3/10`", why:"`3/5 × 2/4` uses without-replacement values. The first marble goes back." },
            { t:"`6/5`", why:"That adds. Multiply along a branch." },
            { t:"`3/5`", why:"That’s one draw. Two draws are needed." }],
          hints:["Multiply along the path.", "`3/5` each time.", "`9/25`."] },
        { id:"w4", skill:"Tree diagrams", goal:3,
          prompt:"On a tree, `P(A) = 0.4`, and the branch from " + A + " to " + B + " is 0.5. What is " + P(A + " and " + B) + "?",
          options:[
            { t:"0.2", ok:true, why:"0.4 × 0.5." },
            { t:"0.9", why:"That adds. Multiply along the path." },
            { t:"0.5", why:"That’s the second branch only, `P(B | A)`. " + M3 },
            { t:"0.4", why:"That’s the first branch only." }],
          hints:["Multiply along the path.", "0.4 × 0.5.", "0.2."] },
        { id:"w5", skill:"Independence", goal:5,
          prompt:A + " and " + B + " are independent, with `P(A) = 0.3` and `P(B) = 0.5`. What is `P(A ∩ B)`?",
          options:[
            { t:"0.15", ok:true, why:"Independent: multiply." },
            { t:"0.8", why:"That adds. Independent events multiply." },
            { t:"0.65", why:"That’s `P(A ∪ B)`: “or”." },
            { t:"0", why:"Independent doesn’t mean no overlap. " + M7 }],
          hints:["Independent events: `P(A ∩ B)` = ?", "`P(A) × P(B)`.", "0.15."] },
        { id:"w6", skill:"Venn regions", goal:2,
          prompt:"In a class of 50: `n(A) = 20`, `n(B) = 15` and `n(A ∩ B) = 6`. How many are in " + A + " only?",
          options:[
            { t:"14", ok:true, why:"20 − 6." },
            { t:"20", why:"That’s all of " + A + ". That includes the overlap." },
            { t:"26", why:"That adds the overlap instead of taking it away." },
            { t:"6", why:"That’s the overlap itself." }],
          hints:[A + " only excludes the overlap.", "20 − 6.", "14."] }
      ],
      refreshers:{
        "Two-way tables":"Each cell is an “and”. Row and column totals are the single events.",
        "Tree diagrams":"Multiply along a path; add the paths that make the event.",
        "Independence":"Independent means `P(A ∩ B) = P(A)P(B)`. It is not the same as “no overlap”.",
        "Venn regions":"“" + A + " only” = `n(A) - n(A ∩ B)`."
      }
    }
  },
  explore:{
    heading:"Given-that filter",
    intro:"Choose a condition and watch the sample space shrink. Then choose what you’re looking for.",
    predIntro:"Make a prediction first. Then the filter will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Table: which is larger, " + P("job | Grade 12") + " or " + P("Grade 12 | job") + "?",
        options:[{ t:P("Grade 12 | job"), ok:true }, { t:P("job | Grade 12") }, { t:"They’re equal" }, { t:"You can’t compare them" }],
        explain:"Different conditions mean different denominators: 60 Grade 12 students vs 48 job-holders. " + P("job | Grade 12") + " = `30/60 = 1/2`, but " + P("Grade 12 | job") + " = `30/48 = 5/8`." },
      { id:"p2", prompt:"Tree (4 red and 2 blue, two draws without replacement): the first marble is not shown. Is " + P("second marble red") + " smaller than, equal to, or larger than " + P("first red") + " = `2/3`?",
        options:[{ t:"Equal: `2/3`", ok:true }, { t:"Smaller, because one red is probably gone" }, { t:"Larger" }, { t:"It depends on the first draw, so it can’t be found" }],
        explain:"Both second-draw paths are added: `2/5 + 4/15 = 2/3`. Averaged over both possible first draws, the second draw is just as likely to be red." },
      { id:"p3", prompt:"Dice: given the first die is even, is " + P("sum = 8") + " larger than, smaller than, or the same as without the condition?",
        options:[{ t:"Larger", ok:true }, { t:"Smaller" }, { t:"The same" }, { t:"It becomes 0" }],
        explain:"3 of the remaining 18 cells sum to 8: `3/18 = 1/6`, up from `5/36`. The condition removed 2 of the 5 sum-8 cells but half of all cells." },
      { id:"p4", prompt:"Dice: given the sum is 7, what is " + P("first die is 6") + "?",
        options:[{ t:"`1/6`", ok:true }, { t:"`1/36`" }, { t:"`1/11`" }, { t:"`1/7`" }],
        explain:"6 cells sum to 7, and 1 of them has first die 6. `1/6` equals " + P("first die is 6") + ", so for a sum of 7 these events are independent." }
    ],
    chalIntro:"Set up the filter, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Table: set the filter to show " + P("no job | Grade 11") + ".",
        why:"Given Grade 11, only those 60 students count, and 42 of them have no job: `42/60 = 7/10`.",
        hints:["The condition goes after the bar.", "Tap the Grade 11 row as “Given”.", "`42/60 = 0.7`."] },
      { id:"tc2", goal:2, prompt:"Venn: set the region counts so that `n(A ∩ B) = 4`, `P(A | B) = 1/3` and `P(B | A) = 1/2`.",
        why:"`n(B) = 4 + 8 = 12`, so `P(A | B) = 4/12 = 1/3`; `n(A) = 4 + 4 = 8`, so `P(B | A) = 4/8 = 1/2`. The “neither” count doesn’t matter.",
        hints:["`P(A | B) = 4 ÷ n(B) = 1/3`. What is `n(B)`?", "`n(B) = 12` and `n(A) = 8`.", B + " only = 12 − 4 = 8; " + A + " only = 8 − 4 = 4."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Tree: unlock the bag. Set `r` red and `b` blue marbles (`r` from 1 to 20, `b` from 1 to 10) so that drawing two <strong>without</strong> replacement gives " + P("both red") + " = `1/2` exactly.",
        why:"Two bags work: 3 red and 1 blue (`3/4 × 2/3 = 1/2`), and 15 red and 6 blue (`15/21 × 14/20 = 1/2`). They’re the only two in range.",
        hints:[P("both red") + " = `r/(r + b) × (r - 1)/(r + b - 1)`.", "Try `b = 1`: you need `(r - 1)/(r + 1) = 1/2`.", "`r = 3`, `b = 1`: `3/4 × 2/3 = 1/2`. (A second answer exists: 15 red and 6 blue.)"] }
    ]
  },
  part3:{
    slug:"tests", name:"Tests",
    heading:"Medical test puzzle",
    intro:"A screening test can be very good at finding a condition and still give mostly false alarms. Work through the three stations, then answer the quick check.",
    model:"<strong>The model</strong> (a model, not medical data): a condition affects <strong>2%</strong> of a population. A screening test detects <strong>90%</strong> of people who have it. It gives a false positive for <strong>5%</strong> of people who don’t.",
    stations:[
      { id:"s1", chip:"1. 10 000 people", title:"Station 1: 10 000 people",
        text:"Step through how the test sorts 10 000 people. Then find out who tested positive.",
        steps:["200 have the condition.", "180 of them test positive.", "9800 don’t have it.", "490 of them test positive anyway."],
        ask:P("condition | positive") + " =", answerNote:"`180/670 ≈ 0.27`. Only 180 of the 670 positives have the condition." },
      { id:"s2", chip:"2. The tree, and its flip", title:"Station 2: the tree, and its flip",
        text:"The same model as a tree: condition first, then the test result. Flip the tree to put the test result first." },
      { id:"s3", chip:"3. Change the base rate", title:"Station 3: change the base rate",
        text:"The <strong>base rate</strong> is how common the condition is before testing. Slide it and watch " + P("condition | positive") + ".",
        question:"When does a positive result become convincing?",
        reply:"When true positives outnumber false positives. With this test that needs a base rate of about 6% or more: at 5%, " + P("condition | positive") + " ≈ 0.49; at 6%, it’s about 0.53. For a rare condition, the 5% false positives from the huge group without it swamp the true positives, so a single positive result is weak evidence. That’s why a positive screening result is usually followed by a second, different test." }
    ],
    quickCheck:{
      title:"Quick check", summary:"Medical test quick check",
      items:[
        { id:"q1", goal:6, prompt:"In the model’s 10 000 people, how many have the condition?",
          right:"Right. 2% of 10 000 is 200.", wrong:"2% of 10 000.",
          choices:[{ t:"200", ok:true }, { t:"2" }, { t:"20" }, { t:"9800" }] },
        { id:"q2", goal:6, prompt:"All positive tests = true positives + …",
          right:"Right. False positives are people without the condition who test positive.", wrong:"People without the condition who test positive.",
          choices:[{ t:"false positives", ok:true }, { t:"true negatives" }, { t:"false negatives" }, { t:"everyone tested" }] },
        { id:"q3", goal:6, prompt:"If the condition becomes more common, " + P("condition | positive") + "…",
          right:"Right. True positives grow, and false positives shrink relative to them.", wrong:"True positives grow, and false positives shrink relative to them.",
          choices:[{ t:"increases", ok:true }, { t:"decreases" }, { t:"stays the same" }, { t:"becomes 0.9" }] },
        { id:"q4", goal:5, prompt:"Which number is " + P("positive | condition") + " in this model?",
          right:"Right. Given the condition, 90% test positive.", wrong:"Given the condition, 90% test positive. 0.27 is the reverse.",
          choices:[{ t:"0.9", ok:true }, { t:"0.27" }, { t:"0.05" }, { t:"0.02" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"tv", type:"custom", title:"Tables and Venns", summary:"Tables and Venns", goal:[2, 3, 5], prefix:"C",
        instruction:"Use the survey table and the Venn facts to find each probability.",
        how:"Type a fraction such as 3/5 or a decimal such as 0.6, then press Check. Equivalent fractions are fine.",
        data:'<p class="cp-dlab"><strong>Table:</strong> a survey of 200 Grade 12 students <span class="mdm-model">model data</span></p>' + LIC +
          '<p class="cp-dlab"><strong>Venn:</strong> a class of 50; 30 play soccer, 20 are in band, 8 do both.</p>',
        items:[
          { id:"c1", goal:2, prompt:P("licence | university"), answer:"3/5", why:"Given university, only those 100 students count: 60 of them have a licence.",
            wrong:[{ match:"60/124", fb:"The condition comes after the bar. " + P("licence | university") + " restricts to university students, not to students with licences." },
              { match:"60/200", fb:"Given university, only the 100 university students count. Divide by 100, not by the total." }] },
          { id:"c2", goal:2, prompt:P("university | licence"), answer:"15/31", why:"Given a licence, only those 124 students count: 60 of them are going to university, and `60/124 = 15/31`.",
            wrong:[{ match:"60/100", fb:"Now the condition is “licence”: 124 students." }] },
          { id:"c3", goal:2, prompt:P("no licence | work"), answer:"3/10", why:"Given work, only those 40 students count: 12 of them have no licence.",
            wrong:[{ match:"12/76", fb:"The condition comes after the bar. " + P("no licence | work") + " restricts to the 40 students going to work, not to students without licences." }] },
          { id:"c4", goal:3, prompt:P("college <strong>and</strong> licence"), answer:"9/50", why:"36 of all 200 students: `36/200 = 9/50`.",
            wrong:[{ match:"36/60", fb:"“And” is out of all 200. " + M3 }, { match:"36/124", fb:"“And” is out of all 200. " + M3 }] },
          { id:"c5", goal:5, prompt:"Is “licence” independent of “college”? Enter " + P("licence | college") + " and " + P("licence") + ", then choose.",
            parts:[{ label:P("licence | college") + " =" }, { label:P("licence") + " =" }, { label:"Independent?", choice:["Yes", "No"] }],
            answer:["0.6", "0.62", "No"], display:"0.6, 0.62; No",
            why:"0.6 ≠ 0.62, so they’re dependent (though only slightly).",
            wrong:[{ part:2, match:"Yes", fb:"0.6 ≠ 0.62, so they’re dependent (though only slightly)." }, { part:0, match:"36/200", fb:"Given college, only the 60 college students count: `36/60`." }, { part:1, match:"36/60", fb:P("licence") + " has no condition: 124 of all 200." }] },
          { id:"c6", goal:2, prompt:P("work | no licence"), answer:"3/19", why:"Given no licence, only those 76 students count: 12 of them are going to work, and `12/76 = 3/19`.",
            wrong:[{ match:"12/40", fb:"The condition comes after the bar. " + P("work | no licence") + " restricts to the 76 students without a licence, not to students going to work." }] },
          { id:"c7", goal:2, prompt:"Venn: " + P("band | soccer"), answer:"4/15", why:"Given soccer, only those 30 students count: 8 of them are in band, and `8/30 = 4/15`.",
            wrong:[{ match:"8/20", fb:"The condition comes after the bar. " + P("band | soccer") + " restricts to the 30 soccer players, not to the band." },
              { match:"8/50", fb:"Given soccer, only the 30 soccer players count. Divide by 30, not by the total." }] },
          { id:"c8", goal:2, prompt:"Venn: " + P("soccer | not band"), answer:"11/15", why:"Not band = 30 students, of whom 30 − 8 = 22 play soccer: `22/30 = 11/15`.",
            general:"Not band = 30 students, of whom 30 − 8 = 22 play soccer.",
            hints:["How many are not in band?", "50 − 20 = 30. Of those, soccer only = 22.", "`22/30 = 11/15`."] }
        ] },
      { id:"tr", type:"custom", title:"Trees and reversals", summary:"Trees and reversals", star:true, goal:[3, 4, 6], prefix:"R",
        instruction:"Use a tree for each problem. The ★ items are non-routine; the last two go beyond the Final Check.",
        how:"Type a fraction such as 3/7 or a decimal such as 0.25, then press Check. Equivalent fractions are fine.",
        data:'<p class="cp-dlab"><strong>Bag</strong> (R1–R4): 5 red and 3 blue marbles; two draws without replacement.</p>',
        items:[
          { id:"r1", goal:4, prompt:P("second blue | first red"), answer:"3/7", why:"After a red is drawn, 7 marbles are left and 3 of them are blue.",
            wrong:[{ match:"3/8", fb:"One red is gone: 7 left, 3 blue." }] },
          { id:"r2", goal:3, prompt:P("both blue"), answer:"3/28", why:"`3/8 × 2/7 = 6/56 = 3/28`.",
            wrong:[{ match:"9/64", fb:M4 + " After a blue, 2 of the 7 left are blue." }] },
          { id:"r3", goal:4, star:true, prompt:P("second blue"), answer:"3/8", why:"Add both paths: `15/56 + 6/56 = 21/56 = 3/8`, the same as " + P("first blue") + ".",
            wrong:[{ match:"3/7", fb:"Add both paths: `15/56 + 6/56 = 21/56`." }] },
          { id:"r4", goal:4, star:true, prompt:P("first red | second blue"), answer:"5/7", why:"Reverse the tree: `15/56 ÷ 21/56 = 15/21 = 5/7`.",
            wrong:[{ match:"15/56", fb:M3 + " Divide by " + P("second blue") + " = `21/56`." }],
            hints:["Reverse the tree.", "`P(R_1 ∩ B_2) = 5/8 × 3/7 = 15/56`.", "÷ `21/56 = 15/21 = 5/7`."] },
          { id:"r5", goal:6, star:true, prompt:"Machine A makes 60% of a factory’s parts, and 2% of its parts are defective. Machine B makes 40%, with 5% defective. " + P("made by A | defective") + "?",
            answer:"3/8", why:P("defective") + " = 0.012 + 0.020 = 0.032; then `0.012/0.032 = 3/8`.",
            wrong:[{ match:"0.6", fb:M5 + " " + P("defective") + " = 0.012 + 0.020 = 0.032; then 0.012/0.032." },
              { match:"0.02", fb:"That’s " + P("defective | A") + ": the condition is reversed. " + P("defective") + " = 0.012 + 0.020 = 0.032; then 0.012/0.032." }] },
          { id:"r6", goal:3, star:true, prompt:"`P(A) = 0.5`, `P(B) = 0.4`, `P(A | B) = 0.3`. Find `P(B | A)`, then `P(A ∪ B)`.",
            parts:[{ label:"`P(B | A)` =" }, { label:"`P(A ∪ B)` =" }],
            answer:["0.24", "0.78"], display:"0.24; 0.78",
            why:"`P(A ∩ B) = 0.4 × 0.3 = 0.12`, so `P(B | A) = 0.12/0.5 = 0.24` and `P(A ∪ B) = 0.5 + 0.4 - 0.12 = 0.78`.",
            wrong:[{ part:0, match:"0.3", fb:"That’s `P(A | B)`: the condition is reversed. First `P(A ∩ B) = 0.4 × 0.3 = 0.12`." }],
            hints:["Use the multiplication rule with the condition you know.", "`P(A ∩ B) = P(B) × P(A | B) = 0.12`.", "`P(B | A) = 0.12/0.5 = 0.24`; `P(A ∪ B) = 0.5 + 0.4 - 0.12 = 0.78`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Rhea", how:"", goal:[4, 5, 6],
        instruction:"Rhea made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Use the job table to find " + P("job | Grade 12") + ".",
            steps:["Restrict to students with jobs: 48.", "Of those, 30 are in Grade 12.", "`P = 30/48 = 5/8`."],
            answer:0,
            stepFb:["", "Step 2 counts correctly within step 1’s group, but the group is wrong.", "Step 3 follows. The mistake is earlier."],
            fixes:[
              { t:"Restrict to Grade 12 students: 60. Of those, 30 have jobs: `P = 1/2`.", ok:true, why:"The condition is Grade 12, so only the 60 Grade 12 students count." },
              { t:"`P = 30/120`.", why:"`30/120` is " + P("Grade 12 and job") + ": it divides by everyone." },
              { t:"`P = 48/60`.", why:"48 is every job-holder, in both grades. Count the job-holders inside Grade 12." },
              { t:"Step 1 is correct.", why:"The condition is Grade 12, the event after the bar." }],
            hints:["What comes after the bar?", "Grade 12.", "`30/60 = 1/2`."] },
          { id:"e2", goal:4, task:"Two cards are dealt without replacement. Find " + P("both aces") + ".",
            steps:[P("first ace") + " = `4/52`.", P("second ace") + " = `4/52`.", P("both") + " = `(1/13)^2 = 1/169`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:P("second ace | first ace") + " = `3/51`, so `P = 4/52 × 3/51 = 1/221`.", ok:true, why:"After one ace is dealt, 3 aces remain among 51 cards." },
              { t:"`4/51`.", why:"The first ace is gone, so only 3 aces are left." },
              { t:"`3/52`.", why:"The deck has 51 cards after the first one is dealt." },
              { t:"Step 2 is correct.", why:"After one ace is dealt, 3 aces remain among 51 cards." }],
            hints:["What’s left after the first ace?", "51 cards, 3 aces.", "`1/221`."] },
          { id:"e3", goal:6, task:"A test detects 90% of cases of a condition affecting 2% of people, with 5% false positives. Find " + P("condition | positive") + ".",
            steps:["Model 10 000 people: 200 have the condition.", "90% of 200: 180 true positives.", "5% of 9800: 490 false positives.", P("condition | positive") + " = `180/200 = 0.9`."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Given a positive result, divide by all positives: `180/(180 + 490) = 18/67 ≈ 0.27`.", ok:true, why:"The condition is “tested positive”, and 670 people tested positive." },
              { t:"`180/10 000`.", why:"That’s " + P("condition and positive") + ": it divides by everyone." },
              { t:"`490/670`.", why:"That’s " + P("no condition | positive") + ": the false positives." },
              { t:"Step 4 is correct.", why:"`180/200` is " + P("positive | condition") + ": the reverse. " + M5 }],
            hints:["The condition is “tested positive”.", "How many tested positive?", "670 → `180/670`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that " + P("second red") + " stayed `2/3` without replacement, or the medical test result?" },
      { id:"j2", q:"In your own words, why does the condition become the denominator?" },
      { id:"j3", q:"Explain to a friend why " + P("positive | condition") + " and " + P("condition | positive") + " can be so different." },
      { id:"j4", q:"Where do you still mix up “and” and “given”? What will you do to catch it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What does `P(B | A)` mean?", options:[
          { t:"The probability of " + B + ", given that " + A + " has occurred", ok:true, why:"The condition, " + A + ", comes after the bar." },
          { t:"The probability of " + A + ", given that " + B + " has occurred", why:"That’s `P(A | B)`. The condition comes after the bar." },
          { t:"The probability of " + A + " and " + B, why:"That’s `P(A ∩ B)`. " + M3 },
          { t:"The probability that " + A + " happens before " + B, why:M6 }] },
        b:{ prompt:"In " + P("rain | cloudy morning") + ", which event is the condition?", options:[
          { t:"A cloudy morning", ok:true, why:"The condition comes after the bar." },
          { t:"Rain", why:"Rain is the event being asked about. The condition comes after the bar." },
          { t:"Both events", why:"Only one is known." },
          { t:"Whichever happens first", why:M6 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"`P(A) = 0.5` and `P(A ∩ B) = 0.2`. Find `P(B | A)`.", options:[
          { t:"0.4", ok:true, why:"0.2 ÷ 0.5." },
          { t:"0.1", why:"Multiplying gives no conditional probability." },
          { t:"0.2", why:"That’s `P(A ∩ B)`. " + M3 },
          { t:"2.5", why:"0.5 ÷ 0.2 is upside down." }] },
        b:{ prompt:"`P(A) = 0.6` and `P(A ∩ B) = 0.15`. Find `P(B | A)`.", options:[
          { t:"0.25", ok:true, why:"0.15 ÷ 0.6." },
          { t:"0.09", why:"That’s a product." },
          { t:"0.15", why:"That’s `P(A ∩ B)`. " + M3 },
          { t:"4", why:"Upside down." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Using the job table (Grade 11: 18 job, 42 no job; Grade 12: 30 job, 30 no job), find " + P("Grade 11 | no job") + ".", options:[
          { t:"`7/12`", ok:true, why:"42 of the 72 students without jobs." },
          { t:"`7/10`", why:"`42/60` is " + P("no job | Grade 11") + ". The condition comes after the bar." },
          { t:"`7/20`", why:"`42/120` divides by everyone. " + M2 },
          { t:"`3/5`", why:"`72/120` is " + P("no job") + "." }] },
        b:{ prompt:"Using the same table (Grade 11: 18 job, 42 no job; Grade 12: 30 job, 30 no job), find " + P("job | Grade 11") + ".", options:[
          { t:"`3/10`", ok:true, why:"18 of the 60 Grade 11 students." },
          { t:"`3/8`", why:"`18/48` is " + P("Grade 11 | job") + ". The condition comes after the bar." },
          { t:"`3/20`", why:"`18/120` divides by everyone. " + M2 },
          { t:"`2/5`", why:"`48/120` is " + P("job") + "." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A bag has 3 red and 4 green marbles. Two are drawn without replacement. What is " + P("one of each colour") + "?", options:[
          { t:"`4/7`", ok:true, why:"`2 × (3/7)(4/6) = 24/42`." },
          { t:"`24/49`", why:"That replaces the first marble. " + M4 },
          { t:"`2/7`", why:"That’s one order only (red then green)." },
          { t:"`1/2`", why:"The colours aren’t equally likely." }] },
        b:{ prompt:"A bag has 5 red and 3 green marbles. Two are drawn without replacement. What is " + P("one of each colour") + "?", options:[
          { t:"`15/28`", ok:true, why:"`2 × (5/8)(3/7) = 30/56`." },
          { t:"`15/32`", why:"That replaces the first marble. " + M4 },
          { t:"`15/56`", why:"One order only." },
          { t:"`1/2`", why:"Not equally likely." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Machine A makes 70% of a factory’s items and 1% of them are defective; machine B makes 30% and 4% are defective. An item is defective. What is " + P("it came from B") + "?", options:[
          { t:"`12/19`", ok:true, why:P("defective") + " = 0.007 + 0.012 = 0.019; 0.012 ÷ 0.019." },
          { t:"0.04", why:"That’s " + P("defective | B") + ". The condition comes after the bar." },
          { t:"0.30", why:"That ignores the defect information. " + M5 },
          { t:"0.012", why:"That’s " + P("B and defective") + ". " + M3 }] },
        b:{ prompt:"Machine A makes 80% of items with 2% defective; machine B makes 20% with 6% defective. An item is defective. What is " + P("it came from B") + "?", options:[
          { t:"`3/7`", ok:true, why:"0.012 ÷ (0.016 + 0.012) = `12/28`." },
          { t:"0.06", why:"That’s " + P("defective | B") + ". The condition comes after the bar." },
          { t:"0.20", why:"That ignores the defect information. " + M5 },
          { t:"0.012", why:"That’s " + P("B and defective") + ". " + M3 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"`P(A) = 0.4`, `P(B) = 0.25` and `P(A ∪ B) = 0.55`. Are " + A + " and " + B + " independent?", options:[
          { t:"Yes: `P(A ∩ B) = 0.10`, so `P(B | A) = 0.25 = P(B)`", ok:true, why:"0.4 + 0.25 − 0.55 = 0.10, and 0.10 ÷ 0.4 = 0.25: knowing " + A + " doesn’t change " + P(B) + "." },
          { t:"No: they overlap, so they must be dependent", why:M7 },
          { t:"No: `P(A ∪ B) ≠ P(A) + P(B)`", why:"That shows they aren’t mutually exclusive; it says nothing about independence." },
          { t:"Yes: `P(A ∩ B) = 0`", why:"0.4 + 0.25 − 0.55 = 0.10, not 0. " + M7 }] },
        b:{ prompt:"`P(A) = 0.5`, `P(B) = 0.3` and `P(A ∪ B) = 0.7`. Are " + A + " and " + B + " independent?", options:[
          { t:"No: `P(A ∩ B) = 0.1`, so `P(B | A) = 0.2`, not 0.3", ok:true, why:"0.5 + 0.3 − 0.7 = 0.1, and 0.1 ÷ 0.5 = 0.2 ≠ 0.3: knowing " + A + " changes " + P(B) + "." },
          { t:"Yes: because they overlap", why:M7 },
          { t:"Yes: `P(A) × P(B) = 0.15 = P(A ∩ B)`", why:"`P(A ∩ B) = 0.5 + 0.3 - 0.7 = 0.1`." },
          { t:"No: because `P(A ∩ B) = 0`", why:"It’s 0.1." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which best explains why " + P("tall | professional basketball player") + " is not equal to " + P("professional basketball player | tall") + "?", options:[
          { t:"“The conditions restrict to different groups: most professional players are tall, but only a tiny fraction of tall people are professional players.”", ok:true, why:"Different conditions, different denominators. The condition comes after the bar." },
          { t:"“They are equal, because the same people are in both.”", why:"The overlap is the same, but the groups you divide by are not. The condition comes after the bar." },
          { t:"“The first is an ‘and’ probability; the second is conditional.”", why:"Both are conditional." },
          { t:"“They differ only because heights are measured inaccurately.”", why:"The difference comes from the group sizes, not measurement." }] },
        b:{ prompt:"Which best explains why " + P("positive | condition") + " = 0.9 does <strong>not</strong> mean " + P("condition | positive") + " = 0.9?", options:[
          { t:"“The second restricts to everyone who tested positive, and that group includes many false positives from the much larger group without the condition.”", ok:true, why:M5 },
          { t:"“Because tests are never accurate.”", why:"The test is 90% accurate for people with the condition." },
          { t:"“Because 0.9 is a probability, not a percentage.”", why:"0.9 is 90%." },
          { t:"“They are the same: the test is 90% reliable.”", why:"They restrict to different groups. The condition comes after the bar." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"In a Venn diagram, which comparison shows `P(B | A)`?", options:[
          { t:"The overlap `A ∩ B` compared with all of circle " + A, ok:true, why:"Given " + A + ", circle " + A + " is the new whole." },
          { t:"The overlap compared with the whole rectangle", why:"That’s `P(A ∩ B)`. " + M2 },
          { t:"Circle " + B + " compared with the whole rectangle", why:"That’s `P(B)`." },
          { t:"The overlap compared with all of circle " + B, why:"That’s `P(A | B)`. The condition comes after the bar." }] },
        b:{ prompt:"To find " + P("walks to school | Grade 9") + " from a two-way table, which division do you do?", options:[
          { t:"Grade 9 walkers ÷ all Grade 9 students", ok:true, why:"Given Grade 9, only the Grade 9 students count." },
          { t:"Grade 9 walkers ÷ all students", why:"That divides by everyone. Given Grade 9, divide by the Grade 9 students." },
          { t:"Grade 9 walkers ÷ all walkers", why:"That’s " + P("Grade 9 | walks to school") + ". The condition comes after the bar." },
          { t:"All walkers ÷ all students", why:"That’s " + P("walks") + "." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A screening test is used for a condition affecting 1% of people. It detects 90% of cases and gives false positives to 9% of people without the condition. In a model group of 10 000, how many positives are true positives, and about what is " + P("condition | positive") + "?", options:[
          { t:"90 of 981 positives; about 0.09", ok:true, why:"100 have it → 90 positives; 9900 × 0.09 = 891 false positives." },
          { t:"About 0.90", why:"That’s " + P("positive | condition") + ". " + M5 },
          { t:"About 0.01", why:"That’s the base rate before testing." },
          { t:"90 of 100; about 0.90", why:"The condition is “tested positive”, not “has the condition”." }] },
        b:{ prompt:"A test for a condition affecting 5% of people detects 80% of cases and gives false positives to 10% of people without it. In a model group of 10 000, how many positives are true positives, and about what is " + P("condition | positive") + "?", options:[
          { t:"400 of 1350 positives; about 0.30", ok:true, why:"500 have it → 400 positives; 9500 × 0.10 = 950 false positives." },
          { t:"About 0.80", why:"That’s " + P("positive | condition") + ". " + M5 },
          { t:"About 0.05", why:"That’s the base rate." },
          { t:"400 of 950; about 0.42", why:"The denominator must include the true positives too: 400 + 950." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A box of 10 phone chargers contains 2 faulty ones. An inspector tests 2 at random, without replacement. What is " + P("the second is faulty | the first works") + "?", options:[
          { t:"`2/9`", ok:true, why:"After a working charger is removed, 2 of the 9 left are faulty." },
          { t:"`1/5`", why:"`2/10` ignores the first draw. " + M4 },
          { t:"`1/45`", why:"That’s " + P("both faulty") + "." },
          { t:"`8/45`", why:"That’s " + P("first works <strong>and</strong> second faulty") + ". " + M3 }] },
        b:{ prompt:"A box of 12 batteries contains 3 dead ones. Two are tested without replacement. What is " + P("the second is dead | the first is dead") + "?", options:[
          { t:"`2/11`", ok:true, why:"2 dead left among 11." },
          { t:"`1/4`", why:"`3/12` ignores the first draw. " + M4 },
          { t:"`1/22`", why:"That’s " + P("both dead") + ". " + M3 },
          { t:"`3/11`", why:"Only 2 dead batteries remain." }] } }
    ]
  },
  task:{
    title:"Two-way table designer", summary:"Two-way table designer",
    statement:"<p>A survey of Grade 12 students records whether each plays a school sport (`S`) and whether each is in Grade 12 French (`F`). Fill in the four cells so the table meets every condition. Can you find all the answers?</p>" +
      '<ol class="cp-conds"><li>40 students were surveyed.</li><li>`P(S | F) = 1/2`.</li><li>`P(F | S) = 1/3`.</li><li>At least half of all students are in neither group.</li></ol>',
    checks:["40 students", "`P(S | F) = 1/2`", "`P(F | S) = 1/3`", "At least half in neither"],
    tips:["Check the total.",
      "Given `F`, half play a sport: the French column splits evenly, so `c = a`.",
      "Given `S`, a third take French: `b = 2a`.",
      "With `b = 2a` and `c = a`, `d = 40 - 4a`. How big can `a` be?"],
    explainPrompt:"Explain how each conditional probability told you which cells to compare, and why there are exactly five tables.",
    vocab:"Use the words given, condition, restricted sample space and two-way table.",
    after3:"Every answer has `b = 2a` and `c = a`. The “neither” condition caps `a` at 5.",
    afterAt:5
  },
  cards:[
    ["`P(B | A)`", "The probability of " + B + " given that " + A + " occurred."],
    ["Conditional formula", "`P(B | A) = P(A ∩ B) ÷ P(A)`."],
    ["Restricted sample space", "Given " + A + ", only outcomes in " + A + " count: `n(A ∩ B) ÷ n(A)`."],
    ["Multiplication rule", "`P(A ∩ B) = P(A) × P(B | A)`."],
    ["Independence test", A + " and " + B + " are independent if `P(B | A) = P(B)`."],
    ["Swapped condition", "`P(B | A)` and `P(A | B)` usually differ: different denominators."],
    ["“And” vs “given”", "“And” divides by everyone; “given” divides by the condition."],
    ["Without replacement", "Second-draw branches are conditional on the first draw."],
    ["Reversing a tree", P("first | second") + " = " + P("both on that path") + " ÷ " + P("second") + "."],
    ["Base rate", "How common the condition is before testing; a low base rate means many false positives."],
    ["False positive", "A positive result for someone without the condition."],
    ["Independent vs mutually exclusive", "Mutually exclusive: can’t both happen. Independent: one doesn’t change the other’s probability."]
  ]
};
