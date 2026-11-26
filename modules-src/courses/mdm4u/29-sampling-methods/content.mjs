// MDM4U 29 Population, Sample & Sampling Methods. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/29-sampling-methods.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "500 gym-goers still aren’t typical adults. Size reduces random error, not bias.";
const M2 = "Random means every member has a known chance, decided by a random process, not by convenience.";
const M3 = "Stratified: <strong>some</strong> from <strong>every</strong> group. Cluster: <strong>all</strong> from <strong>some</strong> groups.";
const M4 = "<strong>P</strong>arameter goes with <strong>p</strong>opulation; <strong>s</strong>tatistic goes with <strong>s</strong>ample.";
const M5 = "The margin covers random sampling variation only, at 95% confidence. It says nothing about bias.";
const M6 = "Interval = population ÷ sample size; start at a random spot within the first interval.";
const M7 = "Jersey numbers are labels: averaging them means nothing. They’re qualitative.";

const TYPES = ["Qualitative nominal", "Qualitative ordinal", "Quantitative discrete", "Quantitative continuous"];

export default {
  id:"29-sampling-methods",
  kind:"topic",
  title:"Population, sample and sampling methods",
  topic:"Population, Sample & Sampling Methods",
  readyTopic:"sampling methods",
  hero:{
    eq:"sample statistic 47.5% → population parameter 46.5%?",
    eqLabel:"A sample statistic of 47.5 percent estimates an unknown population parameter, 46.5 percent.",
    eqSize:"sm",
    headline:"Ask 40, learn about 400",
    text:"You rarely get to ask everyone. A <strong>sample</strong> stands in for the <strong>population</strong>, and a <strong>statistic</strong> from the sample estimates a <strong>parameter</strong> of the population. Whether the estimate can be trusted depends on <strong>how</strong> the sample was chosen: random methods give honest estimates; convenience and volunteers can mislead, however many people you ask.",
    fig:{ aria:"A school of 400 students drawn as a 20 by 20 grid of dots, one row per homeroom, banded by grade. A random-number ticker lights 40 dots scattered across the grid and a bar for “plays a sport” rises to 47.5%, beside a dashed line at the true 46.5%. Then 40 dots clustered near the gym door light up instead and a second bar rises to 72.5%. Caption: Same size. Very different answer.", shape:"wide" }
  },
  goals:[
    "I can distinguish a population, a sample, a census, a parameter and a statistic.",
    "I can identify and describe sampling methods: simple random, systematic, stratified, cluster, multi-stage, convenience and voluntary response.",
    "I can set up a stratified or systematic sample (stratum sizes, interval and start).",
    "I can classify data: quantitative or qualitative, discrete or continuous, nominal or ordinal, primary or secondary.",
    "I can explain what makes a good sample, and the roles of randomization, replication and control.",
    "I can interpret a margin of error and a confidence level, and explain how sample size affects them."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Percents and proportions", goal:1, prompt:"186 of a school’s 400 students play a school sport. What percent is that?",
          options:[
            { t:"46.5%", ok:true, why:"186 ÷ 400 = 0.465." },
            { t:"18.6%", why:"Divide by 400." },
            { t:"53.5%", why:"That’s the percent who don’t play." },
            { t:"2.15%", why:"Part ÷ whole." }],
          hints:["Part ÷ whole.", "186 ÷ 400.", "0.465 = 46.5%."] },
        { id:"w2", skill:"Percents and proportions", goal:3, prompt:"Grade 9 students make up 30% of a school. In a sample of 40 that matches the school’s proportions, how many should be in Grade 9?",
          options:[
            { t:"12", ok:true, why:"30% of 40." },
            { t:"30", why:"30% of 40, not 30." },
            { t:"9", why:"Grade 9 is a label, not a count." },
            { t:"4", why:"0.30 × 40 = 12." }],
          hints:["Find 30% of the sample size.", "0.30 × 40.", "12."] },
        { id:"w3", skill:"Random selection", goal:5, prompt:"Which method gives every one of 400 students the same chance of being chosen for a sample of 40?",
          options:[
            { t:"Draw 40 names from a hat holding all 400 names", ok:true, why:"Every name has the same chance." },
            { t:"Ask the first 40 students into the cafeteria", why:"Early arrivals aren’t a random group. " + M2 },
            { t:"Ask for 40 volunteers", why:"Volunteers choose themselves. " + M2 },
            { t:"Ask 40 of your friends", why:"Friends are likely to be similar to you. " + M2 }],
          hints:["Who decides who is chosen?", "It should be a random process.", "Names from a hat."] },
        { id:"w4", skill:"Random selection", goal:3, prompt:"Students are numbered 1 to 400, and a random number generator outputs 37. What does that mean for the sample?",
          options:[
            { t:"Student number 37 on the list is chosen", ok:true, why:"Each output picks one student." },
            { t:"37 students are chosen", why:"The number is an ID, not a count." },
            { t:"Every 37th student is chosen", why:"That would be a systematic sample." },
            { t:"37% of students are chosen", why:"It’s an ID number." }],
          hints:["What does each number stand for?", "A position on the list.", "Student 37 is in the sample."] },
        { id:"w5", skill:"Types of data", goal:4, prompt:"“Number of siblings” is which type of data?",
          options:[
            { t:"Quantitative, discrete", ok:true, why:"Counts: 0, 1, 2, …" },
            { t:"Quantitative, continuous", why:"You can’t have 1.7 siblings." },
            { t:"Qualitative, nominal", why:"It’s a meaningful number you can average." },
            { t:"Qualitative, ordinal", why:"It’s a count, not a ranked category." }],
          hints:["Is it a number you can do arithmetic with?", "Yes: it’s a count.", "Counts are discrete."] },
        { id:"w6", skill:"Types of data", goal:4, prompt:"A basketball player’s jersey number is which type of data?",
          options:[
            { t:"Qualitative (a label)", ok:true, why:"Jersey numbers name players; arithmetic on them means nothing." },
            { t:"Quantitative, discrete", why:"Averaging jersey numbers tells you nothing. " + M7 },
            { t:"Quantitative, continuous", why:M7 },
            { t:"Ordinal", why:"Number 30 isn’t “more” than number 7." }],
          hints:["Would the average jersey number mean anything?", "No.", "So it’s a label: qualitative."] }
      ],
      refreshers:{
        "Percents and proportions":"Percent = part ÷ whole × 100. A proportional sample gives each group the same share of the sample as it has of the population: 30% of 40 is 12.",
        "Random selection":"Random means the choice is made by a chance process (numbered lists, random number generators), so every member has a known chance. “Whoever is handy” isn’t random.",
        "Types of data":"Quantitative data are numbers you can calculate with: discrete (counts) or continuous (measurements). Qualitative data are categories: nominal (no order) or ordinal (ordered)."
      }
    }
  },
  explore:{
    heading:"Sampling lab",
    intro:"Choose a sampling method, draw a sample from the school, and compare its statistic with the true parameter. Then draw many samples to see how much the statistic wobbles.",
    predIntro:"Make a prediction first. Then the sampling lab will show you what really happens.",
    predictions:[
      { id:"p1", start:{ m:"conv", n:40 },
        prompt:"Method Convenience, `n = 40`. Compared with the true 46.5%, the gym sample’s percent of sport players will be…",
        options:[{ t:"much higher", ok:true }, { t:"about the same" }, { t:"much lower" }, { t:"exactly 46.5%" }],
        explain:"Sport players hang out in the gym. Then try `n = 100`: still about 72%. " + M1 },
      { id:"p2", start:{ m:"srs", n:100 },
        prompt:"Simple random, repeated mode. Sample size goes from 25 to 100. What happens to the spread of the 100 sample proportions?",
        options:[{ t:"It shrinks to about half", ok:true }, { t:"It shrinks to about a quarter" }, { t:"It stays the same" }, { t:"It doubles" }],
        explain:"Spread shrinks like `1/√n`: four times the sample, half the spread." },
      { id:"p3", start:{ m:"sys", k:10, s:3 },
        prompt:"Systematic, `n = 40`, start 3. Which students are chosen?",
        options:[{ t:"3, 13, 23, 33, …", ok:true }, { t:"1, 2, 3, …, 40" }, { t:"3, 6, 9, …" }, { t:"40, 80, 120, …" }],
        explain:"Interval = 400 ÷ 40 = 10; start at 3, then add 10 each time. " + M6 },
      { id:"p4", start:{ m:"clus", rooms:2 },
        prompt:"Repeated mode: Cluster (2 homerooms) vs Simple random (`n = 40`). Which method’s results spread out more?",
        options:[{ t:"Cluster", ok:true }, { t:"Simple random" }, { t:"The same" }, { t:"Neither varies" }],
        explain:"Each homeroom is a single grade, so a cluster sample might be all Grade 9s (60%) or all Grade 12s (30%). " + M3 }
    ],
    chalIntro:"Use the sampling lab to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:3, prompt:"Set up a stratified sample of 40 that matches the school’s grade proportions.",
        why:"12, 10, 10 and 8 are 30%, 25%, 25% and 20% of 40: the same shares as Grades 9 to 12 have of the school.",
        hints:["What fraction of the school is in Grade 9?", "120 ÷ 400 = 30%, so 30% of 40.", "12, 10, 10, 8."] },
      { id:"tc2", goal:3, prompt:"Set up a systematic sample of 50.",
        why:"Interval = 400 ÷ 50 = 8, and a start from 1 to 8 gives exactly 50 students, with every student able to be chosen.",
        hints:["How many students per pick?", "400 ÷ 50 = 8.", "Interval 8, random start from 1 to 8."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Using simple random samples, find the <strong>smallest</strong> sample size on the slider for which the margin of error is at most 10 percentage points.",
        why:"At `n = 100` the margin is `2√{0.465 × 0.535/100}` ≈ 9.98%; at `n = 90` it is about 10.5%.",
        hints:["The margin is about `2√{p(1 - p)/n}`; with `p` near 0.5, that’s about `1/√n`.", "`1/√n ≤ 0.10` needs `√n ≥ 10`.", "`n ≥ 100`; check the readout."] }
    ]
  },
  part3:{
    slug:"margin", name:"Margins of error",
    heading:"Margins of error",
    intro:"Polls report a statistic with a margin of error and a confidence level. Read and judge each poll statement, then open <strong>Check it with data</strong> to see what “19 times out of 20” looks like.",
    stations:[
      { id:"s1", title:"Reading the sentence", goal:6,
        text:"“A poll of 1000 Canadians finds 52% support, accurate to within ±3 percentage points, 19 times out of 20.” Build the interpretation: tap a blank, then tap a chip.",
        parts:["The true support is probably between", "and", "; the method captures the true value in about", "of polls."],
        bank:["49%", "55%", "95%", "52%", "3%", "52% of people are 95% sure", "3% of answers were wrong"],
        answer:["49%", "55%", "95%"],
        fb:{ "52%":"52% is the poll’s statistic, the middle of the interval. The interval runs 3 points either side of it.",
          "3%":"3 is the margin, not an end of the interval: 52 − 3 and 52 + 3.",
          "52% of people are 95% sure":"The 95% describes the method, not how sure people are. " + M5,
          "3% of answers were wrong":"±3 isn’t a count of wrong answers: it’s how far the true value may be from 52%. " + M5,
          "49%":"49% is the bottom of the interval.", "55%":"55% is the top of the interval.", "95%":"95% is the confidence level: 19 ÷ 20." },
        why:"52 ± 3 gives 49% to 55%, and “19 times out of 20” is 19 ÷ 20 = 95% confidence." },
      { id:"s2", title:"The size rule", goal:6,
        text:"For `p` near 0.5 at 95% confidence, the margin is about `1/√n`. Move the slider and watch the margin.",
        prompt:"To halve the margin, multiply the sample size by…",
        options:[{ t:"4", ok:true, why:"`1/√{4n} = 1/(2√n)`: four times the sample halves the margin." },
          { t:"2", why:"Doubling the sample only shrinks the margin by a factor of √2: 400 → 800 takes 5% to about 3.5%." },
          { t:"8", why:"Eight times the sample shrinks the margin by a factor of √8 ≈ 2.8, more than half." },
          { t:"½", why:"A smaller sample makes the margin bigger." }] },
      { id:"s3", title:"Too close to call", goal:6,
        text:"A poll finds Party A at 41% and Party B at 38%, each with a margin of ±4 percentage points.",
        prompt:"What can the poll say?",
        choices:[{ t:"It can’t tell who leads", ok:true, why:"The intervals 37–45 and 34–42 overlap a lot, and the 3-point gap is smaller than the 4-point margin." },
          { t:"A leads by 3", why:"The margin (4) is larger than the gap (3): B could really be ahead." }] },
      { id:"s4", title:"The big-but-biased poll", goal:[5, 6],
        text:"“A news site’s online poll of 10 000 readers claims ±1%.”",
        prompt:"Choose the best response.",
        options:[{ t:"The margin assumes a random sample; this is voluntary response, so the margin is meaningless.", ok:true, why:"Readers chose to answer, so the result can be biased however many reply. " + M5 },
          { t:"10 000 readers is a huge sample, so ±1% makes it trustworthy.", why:"Size reduces random error, not bias. Readers chose themselves." },
          { t:"The margin should be ±3%, not ±1%.", why:"`1/√{10 000}` = 1%, so the arithmetic is fine. The problem is who answered." },
          { t:"The ±1% already includes any bias from who answered.", why:M5 }] }
    ],
    quickCheck:{
      title:"Margins of error quick check", summary:"Margins of error quick check",
      items:[
        { id:"q1", goal:6, prompt:"“19 times out of 20” means a confidence level of…",
          choices:[
            { t:"95%", ok:true, fb:"Right. 19 ÷ 20 = 0.95." },
            { t:"19%", fb:"19 ÷ 20 = 0.95." },
            { t:"5%", fb:"19 ÷ 20 = 0.95." },
            { t:"90%", fb:"19 ÷ 20 = 0.95." }] },
        { id:"q2", goal:6, prompt:"A poll of 400 has margin ±5%. About what margin for 1600?",
          choices:[
            { t:"±2.5%", ok:true, fb:"Right. Four times the sample halves the margin." },
            { t:"±1.25%", fb:"Four times the sample halves the margin." },
            { t:"±5%", fb:"Four times the sample halves the margin." },
            { t:"±10%", fb:"Four times the sample halves the margin." }] },
        { id:"q3", goal:[5, 6], prompt:"Which error does the margin of error <strong>not</strong> include?",
          choices:[
            { t:"Bias from a voluntary sample", ok:true, fb:"Right. It covers random variation only." },
            { t:"Random sampling variation", fb:"It covers random variation only." },
            { t:"Both", fb:"It covers random variation only." },
            { t:"Neither", fb:"It covers random variation only." }] },
        { id:"q4", goal:6, prompt:"A poll of 2500 has margin ±2%. What margin would a poll of 100 on the same question have?",
          choices:[
            { t:"±10%", ok:true, fb:"Right. `1/√100` = 10%: a sample 25 times smaller has a margin 5 times larger." },
            { t:"±4%", fb:"`1/√100` = 10%: a sample 25 times smaller has a margin 5 times larger." },
            { t:"±50%", fb:"`1/√100` = 10%: a sample 25 times smaller has a margin 5 times larger." },
            { t:"±2%", fb:"`1/√100` = 10%: a sample 25 times smaller has a margin 5 times larger." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"name", type:"match", title:"Name the method", summary:"Name the method", goal:[1, 2],
        instruction:"Tap a scenario, then tap the method it uses.",
        leftTitle:"Scenario", rightTitle:"Method",
        left:[
          { id:"l1", t:"“Number all 1200 students and choose 60 with a random number generator.”", why:"Every group of 60 has the same chance: simple random." },
          { id:"l2", t:"“Pick a random student among the first 20 on the list, then every 20th after that.”", why:"A random start, then a fixed interval: systematic." },
          { id:"l3", t:"“Randomly choose students from every grade, in proportion to each grade’s size.”", why:"Some from every group: stratified." },
          { id:"l4", t:"“Randomly choose 3 homerooms and survey everyone in them.”", why:"All from some groups: cluster." },
          { id:"l5", t:"“Randomly choose 4 schools, then 2 classes in each, then 5 students per class.”", why:"Three rounds of random choice: multi-stage.",
            hints:["How many rounds of random choice?", "Three: schools, classes, students.", "Multi-stage."] },
          { id:"l6", t:"“Post a link on the school’s social media page and count the replies.”", why:"People chose to reply: voluntary response." },
          { id:"l7", t:"“Ask the people at your lunch table.”", why:"Whoever is handy: convenience." },
          { id:"l8", t:"“Survey every student in the school.”", why:"Everyone is measured: a census." }
        ],
        right:[
          { id:"srs", t:"Simple random" }, { id:"sys", t:"Systematic" }, { id:"strat", t:"Stratified" }, { id:"clus", t:"Cluster" },
          { id:"multi", t:"Multi-stage" }, { id:"vol", t:"Voluntary response" }, { id:"conv", t:"Convenience" }, { id:"census", t:"Census" }
        ],
        answer:{ l1:"srs", l2:"sys", l3:"strat", l4:"clus", l5:"multi", l6:"vol", l7:"conv", l8:"census" },
        wrong:{
          "l3|clus":"Cluster takes <strong>everyone</strong> in a few groups; this takes <strong>some</strong> from <strong>every</strong> group.",
          "l4|strat":M3,
          "l6|srs":"People chose to reply; that’s not random.",
          "l8|srs":"Everyone is measured: that’s a census, not a sample.", "l8|sys":"Everyone is measured: that’s a census, not a sample.",
          "l8|strat":"Everyone is measured: that’s a census, not a sample.", "l8|clus":"Everyone is measured: that’s a census, not a sample.",
          "l8|multi":"Everyone is measured: that’s a census, not a sample.", "l8|vol":"Everyone is measured: that’s a census, not a sample.",
          "l8|conv":"Everyone is measured: that’s a census, not a sample."
        },
        wrongDefault:"Look at who chooses, and whether groups are sampled in part or in full." },
      { id:"plan", type:"custom", title:"Plan it", summary:"Plan it", goal:[3, 4, 5, 6],
        instruction:"Plan each sample and classify each variable. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Type a whole number or tap a choice, then press Check.",
        items:[
          { id:"s1", goal:3, prompt:"A town has 2400 adults: 1200 in North, 800 in Centre and 400 in South. For a proportional stratified sample of 150, how many from each?",
            parts:["North:", "Centre:", "South:"], answer:[75, 50, 25], tol:0, display:"75, 50 and 25",
            why:"North is 1200/2400 = 50% of the town, Centre `1/3` and South `1/6`: 50% of 150 = 75, then 50 and 25.",
            wrong:[{ part:0, match:50, fb:"Equal isn’t proportional." }, { part:2, match:50, fb:"Equal isn’t proportional." }],
            fb:"Each neighbourhood’s share of the sample should match its share of the town: 1200/2400 × 150 for North." },
          { id:"s2", goal:3, prompt:"A systematic sample of 60 from a list of 1500 names uses what interval?",
            label:"Interval:", answer:25, tol:0, display:"25",
            why:"1500 ÷ 60 = 25: start at a random name from 1 to 25, then take every 25th.",
            wrong:[{ match:0.04, fb:"Population ÷ sample, not sample ÷ population. " + M6 }],
            fb:M6 },
          { id:"s3", goal:2, star:true, prompt:"Multi-stage: 5 of 40 schools, then 3 of each school’s 12 classes, then 6 students from each class. How many students are sampled?",
            label:"Students:", answer:90, tol:0, display:"90",
            why:"5 schools × 3 classes = 15 classes; 15 × 6 = 90 students.",
            wrong:[{ match:240, fb:"Only the chosen schools and classes count: 5 × 3 × 6." }, { match:2880, fb:"Only the chosen schools and classes count: 5 × 3 × 6." }],
            fb:"Multiply the numbers chosen at each stage.",
            hints:["Multiply the numbers chosen at each stage.", "5 schools × 3 classes.", "15 classes × 6 students = 90."] },
          { id:"s4", goal:4, star:true, prompt:"Classify each variable.",
            parts:[{ t:"(a) postal code", choices:TYPES }, { t:"(b) time to run 100 m", choices:TYPES }, { t:"(c) shirt size S/M/L", choices:TYPES }, { t:"(d) goals scored in a season", choices:TYPES }],
            answer:["Qualitative nominal", "Quantitative continuous", "Qualitative ordinal", "Quantitative discrete"],
            display:"(a) qualitative nominal; (b) quantitative continuous; (c) qualitative ordinal; (d) quantitative discrete",
            why:"A postal code is an unordered label; a time is a measurement; shirt sizes are ordered categories; goals are counts.",
            wrong:[{ part:0, match:"Quantitative discrete", fb:"Postal codes are labels, like jersey numbers: arithmetic on them means nothing. They’re qualitative." },
              { part:0, match:"Quantitative continuous", fb:"Postal codes are labels, like jersey numbers: arithmetic on them means nothing. They’re qualitative." }] },
          { id:"s5", goal:6, star:true, prompt:"A poll of 400 has margin ±5%. About how many people are needed for ±2.5%?",
            label:"People:", answer:1600, tol:0, display:"1600",
            why:"The margin is about `1/√n`: `1/√1600` = 2.5%. Halving the margin takes four times the people.",
            wrong:[{ match:800, fb:"Halving the margin needs <strong>four</strong> times the people." }, { match:200, fb:"A smaller sample makes the margin bigger." }],
            fb:"The margin is about `1/√n`. What `n` gives 2.5%?" },
          { id:"s6", goal:5, star:true, prompt:"Which design best tests whether a new study app improves marks?",
            parts:[{ t:"Design:", choices:[
              "Let students choose whether to use it, then compare",
              "Randomly assign 100 of 200 volunteers to use it for a month and 100 not to, then compare",
              "Survey students who already use it",
              "Use it in one class and compare with last year’s class"] }],
            answer:["Randomly assign 100 of 200 volunteers to use it for a month and 100 not to, then compare"],
            display:"random assignment of 100 of 200 volunteers",
            why:"Randomization, a control group, and many students (replication).",
            wrong:[{ part:0, match:"Let students choose whether to use it, then compare", fb:"Students who choose it may already be keener: no randomization." },
              { part:0, match:"Use it in one class and compare with last year’s class", fb:"Different years differ in many ways: no control." },
              { part:0, match:"Survey students who already use it", fb:"Students who already use it chose it themselves, and there’s no comparison group." }],
            hints:["Which design uses chance to decide who gets the app?", "Random assignment balances other differences between the groups.", "Random assignment of 100 of the 200 volunteers: randomization, a control group, and many students (replication)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Elsa", goal:[1, 3, 5],
        instruction:"Elsa made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"A school has 300 Grade 9, 250 Grade 10, 250 Grade 11 and 200 Grade 12 students. Plan a proportional stratified sample of 80.",
            steps:["The school has 1000 students.", "There are 4 grades, so take 80 ÷ 4 = 20 from each grade.", "Choose 20 at random from each grade’s list."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Random choice within each grade is right; the numbers are the problem."],
            fixes:[
              { t:"Use each grade’s share: 300/1000 × 80 = 24, then 20, 20 and 16.", ok:true, why:"Each grade gets its share of the 80: 24, 20, 20 and 16." },
              { t:"Take 80 from each grade.", why:"That makes 320." },
              { t:"Choose 2 grades and survey everyone in them.", why:"That’s cluster sampling. " + M3 },
              { t:"Step 2 is correct.", why:"Equal numbers aren’t proportional when the grades differ in size." }],
            hints:["What fraction of the school is Grade 9?", "300 ÷ 1000 = 30%.", "24, 20, 20, 16."] },
          { id:"e2", goal:5, task:"A sports drink company surveys 2000 people at marathon finish lines and reports that “78% of Canadians exercise daily”.",
            steps:["The population is Canadian adults.", "The sample is 2000 marathon finishers.", "2000 is a very large sample, so the 78% is reliable for all Canadians."],
            answer:2,
            stepFb:["Step 1 names the population correctly.", "Step 2 is accurate.", ""],
            fixes:[
              { t:"Marathon finishers exercise far more than typical Canadians. It’s a convenience sample, so it’s biased whatever its size.", ok:true, why:"Size can’t fix how the sample was chosen." },
              { t:"The sample should be 20 000.", why:M1 },
              { t:"The margin of error fixes this.", why:M5 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Are marathoners typical?", "No: they exercise much more.", "Size can’t fix how they were chosen."] },
          { id:"e3", goal:1, task:"A poll of 500 of a city’s 80 000 voters finds 61% support a new library. Label the numbers.",
            steps:["The population is the city’s 80 000 voters.", "61% is the parameter, because it describes support for the library.", "The true percent of all 80 000 voters is the statistic."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 repeats the same swap."],
            fixes:[
              { t:"61% comes from the sample, so it’s a statistic. The true percent of all voters is the parameter, which the 61% estimates.", ok:true, why:M4 },
              { t:"Both numbers are parameters.", why:"The 61% comes from the 500 people asked, so it’s a statistic." },
              { t:"Both numbers are statistics.", why:"The true percent of all 80 000 voters describes the population, so it’s a parameter." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Where does the 61% come from?", "The 500 people asked.", "Sample → statistic."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the Sampling lab: the gym sample staying wrong at every size, or the cluster samples swinging so widely?" },
      { id:"j2", q:"In your own words, why does <strong>how</strong> you sample matter more than <strong>how many</strong> you sample?" },
      { id:"j3", q:"Explain to a friend the difference between stratified and cluster sampling, using your own school as the example." },
      { id:"j4", q:"Think of a poll or survey you’ve seen. What would you want to know about how it was sampled before trusting it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A survey of 250 voters finds that 58% support a plan. The 58% is…", options:[
          { t:"a statistic", ok:true, why:"It comes from the sample." },
          { t:"a parameter", why:"Parameters describe the whole population. " + M4 },
          { t:"a census", why:"A census measures everyone." },
          { t:"a population", why:"The population is all voters." }] },
        b:{ prompt:"The true percent of all 30 000 voters who support the plan is…", options:[
          { t:"a parameter", ok:true, why:"It describes the whole population." },
          { t:"a statistic", why:M4 },
          { t:"a sample", why:"A sample is a group of people, not a number." },
          { t:"a margin of error", why:"That’s how far a statistic may be from the parameter." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"A researcher randomly selects 4 of a city’s 60 neighbourhoods and surveys every household in them. Which method is this?", options:[
          { t:"Cluster", ok:true, why:"Everyone in a few randomly chosen groups." },
          { t:"Stratified", why:M3 },
          { t:"Systematic", why:"There’s no fixed interval." },
          { t:"Simple random", why:"Households weren’t chosen individually from the whole city." }] },
        b:{ prompt:"A researcher randomly selects 20 households from each of a city’s 60 neighbourhoods. Which method is this?", options:[
          { t:"Stratified", ok:true, why:"Some from every group." },
          { t:"Cluster", why:M3 },
          { t:"Systematic", why:"No interval." },
          { t:"Convenience", why:"The households were chosen at random." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which variable is quantitative and continuous?", options:[
          { t:"The time to finish a puzzle", ok:true, why:"A measurement on a continuous scale." },
          { t:"The number of pets", why:"Counts are discrete." },
          { t:"Favourite colour", why:"A category." },
          { t:"Jersey number", why:"A label. " + M7 }] },
        b:{ prompt:"Which variable is qualitative and ordinal?", options:[
          { t:"A satisfaction rating: poor, fair, good, excellent", ok:true, why:"Ordered categories." },
          { t:"Postal code", why:"Categories with no order: nominal." },
          { t:"Number of texts sent today", why:"Quantitative." },
          { t:"Height", why:"Quantitative, continuous." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A school has 300 Grade 9, 250 Grade 10, 250 Grade 11 and 200 Grade 12 students. In a proportional stratified sample of 80, how many are in Grade 12?", options:[
          { t:"16", ok:true, why:"200/1000 × 80." },
          { t:"20", why:"That’s an equal split, not proportional." },
          { t:"200", why:"That’s the whole grade." },
          { t:"8", why:"That uses a sample of 40." }] },
        b:{ prompt:"Same school. In a proportional stratified sample of 80, how many are in Grade 9?", options:[
          { t:"24", ok:true, why:"300/1000 × 80." },
          { t:"20", why:"That’s an equal split." },
          { t:"300", why:"That’s the whole grade." },
          { t:"12", why:"That uses a sample of 40." }] } },
      { id:"t2", cat:"T", goal:[2, 5],
        a:{ prompt:"A gym surveys the first 500 members who arrive one Monday morning about how often they exercise, and concludes that the average adult exercises 5 times a week. What is the main flaw?", options:[
          { t:"It’s a convenience sample of gym-goers, who exercise more than most adults; a large sample doesn’t fix that", ok:true, why:"Size can’t fix how the sample was chosen." },
          { t:"The sample is too small.", why:M1 },
          { t:"It should have been a census of the gym.", why:"That still wouldn’t represent all adults." },
          { t:"The question was leading.", why:"Nothing suggests leading wording; the sample is the problem." }] },
        b:{ prompt:"A radio station invites listeners to call in about a new law; 2000 call and 80% oppose it. What is the main flaw?", options:[
          { t:"It’s a voluntary response sample: people with strong feelings are the most likely to call", ok:true, why:"Callers chose themselves, so strong opinions are over-represented." },
          { t:"2000 callers is too few.", why:"Size reduces random error, not bias. Callers chose themselves." },
          { t:"It’s a cluster sample.", why:"Callers chose themselves." },
          { t:"Nothing: 2000 is large enough.", why:"Size reduces random error, not bias. Callers chose themselves." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A poll of 1000 people has a margin of error of ±3.2%. About how many people are needed for ±1.6%?", options:[
          { t:"4000", ok:true, why:"Halving the margin needs four times the sample." },
          { t:"2000", why:"Doubling the sample only shrinks the margin by a factor of √2." },
          { t:"500", why:"Fewer people make the margin bigger." },
          { t:"1600", why:"The margin and `n` aren’t added like that." }] },
        b:{ prompt:"A poll of 400 people has margin ±5%. What margin would a poll of 100 have?", options:[
          { t:"±10%", ok:true, why:"A quarter of the sample doubles the margin." },
          { t:"±2.5%", why:"Smaller samples have bigger margins." },
          { t:"±20%", why:"The margin scales with `1/√n`, not `1/n`." },
          { t:"±5%", why:"Sample size matters." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"A report says: “Support is 52%, accurate to within ±3 percentage points, 19 times out of 20.” Which is the best interpretation?", options:[
          { t:"“The true support is probably between 49% and 55%: the method used produces intervals that contain the true value about 95% of the time.”", ok:true, why:"52 ± 3, and “19 times out of 20” is the method’s 95% confidence level." },
          { t:"“52% of people are 95% sure of their answer.”", why:M5 },
          { t:"“Exactly 52% support it, and 3% are undecided.”", why:"±3 isn’t a group of undecided people." },
          { t:"“19 out of 20 people support the policy.”", why:M5 }] },
        b:{ prompt:"Party A has 41% and Party B 38%, each with a margin of ±4 percentage points. Which is the best statement?", options:[
          { t:"“The intervals 37–45 and 34–42 overlap a lot, so the poll can’t tell which party is really ahead.”", ok:true, why:"The 3-point gap is smaller than the 4-point margin." },
          { t:"“Party A leads by 3 points.”", why:"The margin is larger than the gap." },
          { t:"“Party B is ahead once the margin is applied.”", why:"The margin applies to both equally." },
          { t:"“Party A is 4% ahead.”", why:"The 4 is the margin, not the lead." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why random selection matters in a survey?", options:[
          { t:"“It gives every member of the population a known chance of being chosen, so no group is systematically over- or under-represented.”", ok:true, why:M2 },
          { t:"“It guarantees the sample matches the population exactly.”", why:"Random samples vary; they’re right on average." },
          { t:"“It makes the sample larger.”", why:"Size and randomness are separate." },
          { t:"“It means you don’t need many people.”", why:"Randomness removes bias, but a small random sample still has a large margin of error: you need enough people too." }] },
        b:{ prompt:"Which is the best explanation of why an experiment includes a control group?", options:[
          { t:"“It shows what happens without the treatment, so a difference between the groups can be attributed to the treatment.”", ok:true, why:"The control group is the comparison." },
          { t:"“It makes the experiment bigger.”", why:"That’s replication." },
          { t:"“It lets people choose their group.”", why:"Choosing undoes randomization." },
          { t:"“It removes the need for random assignment.”", why:"Both are needed." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"A province’s three regions have 600 000, 300 000 and 100 000 adults. A pollster plans 2000 interviews, stratified proportionally. How many are in the smallest region?", options:[
          { t:"200", ok:true, why:"100 000 is 10% of 1 000 000; 10% of 2000." },
          { t:"667", why:"That’s an equal split." },
          { t:"20", why:"10% of 2000 is 200." },
          { t:"1200", why:"That’s the largest region." }] },
        b:{ prompt:"Same province. How many interviews are in the largest region?", options:[
          { t:"1200", ok:true, why:"60% of 2000." },
          { t:"667", why:"That’s an equal split." },
          { t:"600", why:"60% of 2000, not 600." },
          { t:"200", why:"That’s the smallest region." }] } },
      { id:"a2", cat:"A", goal:[2, 5],
        a:{ prompt:"A city wants residents’ views on bus service. Which plan gives the most trustworthy results?", options:[
          { t:"A stratified random sample of residents from the city’s address list, by neighbourhood", ok:true, why:"Random selection from a full list, with every neighbourhood represented." },
          { t:"Survey people waiting at bus stops", why:"Convenience: it misses residents who don’t ride." },
          { t:"An online poll on the transit website", why:"Voluntary response." },
          { t:"Survey every resident of one randomly chosen neighbourhood", why:"One cluster can’t represent the city. " + M3 }] },
        b:{ prompt:"A school board wants students’ views on school start times. Which plan gives the most trustworthy results?", options:[
          { t:"A simple random sample of 300 students from the board’s full enrolment list", ok:true, why:"Every student on the full list has the same chance." },
          { t:"Ask students who arrive late", why:"Convenience, and a biased group." },
          { t:"Post a poll on social media", why:"Voluntary response." },
          { t:"Survey every student at one school", why:"One cluster." }] } }
    ]
  },
  task:{
    title:"Town survey", summary:"Town survey",
    statement:"<p>A town of 6000 adults has three neighbourhoods: North (3000), Centre (2000) and South (1000). Plan a survey about a new community centre that meets every condition. Can you find all the answers? <span class=\"mdm-model\">model town</span></p>" +
      "<ol class=\"ts-conds\"><li>The margin of error is about ±5% or better (at least 400 people in total).</li><li>The budget allows at most 600 interviews.</li><li>Each neighbourhood is represented in proportion to its size.</li><li>People are chosen at random within each neighbourhood.</li></ol>",
    checks:["Margin ±5% or better", "Within budget", "Proportional", "Random within each neighbourhood"],
    tips:["`1/√400` = 5%: you need at least 400 interviews.", "Stay at or under 600.", "The neighbourhoods are in the ratio 3 : 2 : 1.", "The mall and the flyer let people choose themselves or depend on who’s around."],
    explainPrompt:"Explain how your plan balances the margin of error, the budget and fairness to each neighbourhood.",
    vocab:"Use the words stratified, proportional, random and margin of error.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"A total of 6 × South between 400 and 600, in steps of 10 for South, gives exactly these four. A bigger survey in the same ratio costs more but narrows the margin: 600 gives about ±4.1%.",
    afterAt:4
  },
  cards:[
    ["Population vs sample", "Everyone the question is about vs the part actually measured."],
    ["Parameter vs statistic", "Describes the population vs describes the sample (and estimates the parameter)."],
    ["Census", "Measuring every member of the population."],
    ["Simple random sample", "Every group of `n` has the same chance; use a random number generator on a numbered list."],
    ["Systematic sample", "Interval `k = N ÷ n`; random start from 1 to `k`; then every `k`th."],
    ["Stratified sample", "Some from <strong>every</strong> group, usually in proportion to group size."],
    ["Cluster sample", "<strong>Everyone</strong> in a few randomly chosen groups."],
    ["Multi-stage sample", "Random choices in rounds (schools → classes → students)."],
    ["Convenience and voluntary samples", "Non-random; often biased, at any size."],
    ["Types of data", "Quantitative (discrete or continuous) vs qualitative (nominal or ordinal); primary vs secondary."],
    ["Randomization, replication, control", "Chance assignment; enough subjects; a comparison group."],
    ["Margin of error", "“±3%, 19 times out of 20” = 95% confidence; about `1/√n`; covers random variation, not bias."]
  ]
};
