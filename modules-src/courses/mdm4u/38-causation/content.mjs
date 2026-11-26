// MDM4U 38 Two-Variable Analysis & Causation. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/38-causation.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "`r` measures how closely the points follow a line, not why. A third variable or coincidence can produce the same `r`.";
const M2 = "Ask which variable could plausibly drive the other. Rain causes umbrella sales, not the reverse.";
const M3 = "Size and strength don’t fix self-selection. Only random assignment balances hidden variables.";
const M4 = "Compare within groups of the hidden variable: the overall pattern can disappear, or even flip.";
const M5 = "Common cause: a specific third variable is known to drive both. Presumed: it seems logical, but no cause has been established.";
const M6 = "Use ‘is linked to’ or ‘is associated with’ for observational data.";
const M7 = "Correlation is evidence worth following up, especially with an experiment.";

const TYPES = { ce:"Cause and effect", cc:"Common cause", rev:"Reverse cause and effect", acc:"Accidental", pre:"Presumed" };
const HINT12 = ["Could `x` produce `y`? Could `y` produce `x`?", "Is a third variable named? Is the link even logical?"];
function sortItem(id, t, answer, reason, wrong){ return { id, t, answer, why:reason, hints:[HINT12[0], HINT12[1], TYPES[answer] + ": " + reason], wrong:wrong || {} }; }

export default {
  id:"38-causation",
  kind:"topic",
  title:"Two-variable analysis and causation",
  topic:"Two-Variable Analysis & Causation",
  readyTopic:"correlation and causation",
  hero:{
    eq:"`r` = 0.90 … but why?",
    eqLabel:"r equals 0.90, but why?",
    eqSize:"md",
    headline:"Together doesn’t mean because.",
    text:"Two variables can rise and fall together for many reasons. One might <strong>cause</strong> the other, a <strong>common cause</strong> might drive both, the cause might run in <strong>reverse</strong>, or it might be <strong>accidental</strong>. To claim cause and effect, you need an <strong>experiment</strong> with random assignment, not just a strong `r`.",
    fig:{ aria:"Twelve dots for shoe size against reading score rise in a strong pattern and r = 0.90 appears. An arrow labelled shoe size to reading draws, then fades with a question mark. The dots recolour into three grade groups, grades 2, 4 and 6, each a flat cloud: within each grade r = 0. A dashed circle labelled grade (age) appears with arrows to both axes.", shape:"wide" }
  },
  goals:[
    "I can classify a correlated relationship as cause and effect, common cause, reverse cause and effect, accidental or presumed.",
    "I can identify a likely hidden variable and explain how it could create or hide a correlation.",
    "I can use grouped data to test whether a hidden variable explains a relationship.",
    "I can explain why only a randomized controlled experiment can establish cause and effect.",
    "I can judge whether a media claim is supported by its data and rewrite it honestly."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Reading correlation", goal:1, prompt:"Hot-chocolate sales and hoodie sales at a school store have `r` = 0.997 over six weeks. Which is true?",
          options:[
            { t:"They have a very strong positive linear relationship", ok:true, why:"`r` = 0.997 is very close to 1: very strong and positive." },
            { t:"Hoodie sales cause hot-chocolate sales.", why:"`r` doesn’t show cause. " + M1 },
            { t:"They are unrelated.", why:"`r` near 1 means strongly related." },
            { t:"They have a strong negative relationship.", why:"`r` is positive." }],
          hints:["What does `r` measure?", "How closely the points follow a line, and the direction.", "Very strong and positive."] },
        { id:"w2", skill:"Reading correlation", goal:3, prompt:"Within one grade, shoe size and reading score have `r` = 0. What does that mean?",
          options:[
            { t:"Within that grade, shoe size gives no linear information about reading", ok:true, why:"`r` = 0 means no linear pattern." },
            { t:"Every student has the same score.", why:"Scores can vary; they just don’t follow shoe size." },
            { t:"Shoe size lowers reading.", why:"That would be a negative `r`." },
            { t:"The data were entered wrong.", why:"`r` = 0 is a real possible result." }],
          hints:["`r` = 0 means no linear pattern.", "Bigger feet don’t go with higher or lower scores here.", "No linear relationship."] },
        { id:"w3", skill:"Percentages and rates", goal:3, prompt:"180 of 200 patients recovered. What is the recovery rate?",
          options:[
            { t:"90%", ok:true, why:"180 ÷ 200." },
            { t:"20%", why:"That subtracts the counts (200 − 180 = 20). Divide the part by the whole: 180 ÷ 200." },
            { t:"111%", why:"200 ÷ 180: whole over part." },
            { t:"180%", why:"Divide by 200." }],
          hints:["Part ÷ whole.", "180 ÷ 200.", "0.9 = 90%."] },
        { id:"w4", skill:"Percentages and rates", goal:3, prompt:"Clinic A treats 250 patients; 190 recover. Clinic B treats 250; 96 recover. Which statement is correct?",
          options:[
            { t:"A’s overall rate is 76%; B’s is 38.4%", ok:true, why:"190 ÷ 250 = 0.76 and 96 ÷ 250 = 0.384." },
            { t:"A’s rate is 190%.", why:"Divide by 250." },
            { t:"B’s rate is 96%.", why:"96 is a count, not a percentage." },
            { t:"The rates can’t be compared.", why:"Same denominators: compare directly." }],
          hints:["Divide each count by 250.", "190 ÷ 250 = 0.76.", "96 ÷ 250 = 0.384."] },
        { id:"w5", skill:"Sampling ideas", goal:4, prompt:"Students choose for themselves whether to use a study app, and app users get higher marks. What’s the main problem with concluding the app works?",
          options:[
            { t:"Students who choose the app may differ in other ways (e.g. motivation)", ok:true, why:"Self-selection: motivation could explain both." },
            { t:"The sample is too large.", why:"Larger samples are better." },
            { t:"Marks can’t be measured.", why:"Marks are measurable." },
            { t:"Nothing; the comparison proves it.", why:M3 }],
          hints:["Who decided who used the app?", "The students did: self-selection.", "Motivation could explain both."] },
        { id:"w6", skill:"Sampling ideas", goal:4, prompt:"What does <strong>random assignment</strong> to groups do?",
          options:[
            { t:"It makes the groups alike, on average, in every other variable", ok:true, why:"Nothing about the person decides their group, so hidden variables balance out." },
            { t:"It guarantees a big effect.", why:"It removes bias; it doesn’t create effects." },
            { t:"It lets people choose their group.", why:"That’s self-selection." },
            { t:"It makes the sample representative of Canada.", why:"That’s random <strong>sampling</strong>, a different idea." }],
          hints:["Why flip a coin to decide groups?", "So nothing about the person decides their group.", "Hidden variables balance out."] }
      ],
      refreshers:{
        "Reading correlation":"`r` gives strength and direction of a linear pattern. It never tells you why.",
        "Percentages and rates":"Rate = part ÷ whole. Compare rates, not raw counts, when group sizes differ.",
        "Sampling ideas":"Random <strong>sampling</strong> gives a representative sample; random <strong>assignment</strong> gives comparable groups. Self-selected groups may differ in hidden ways."
      }
    }
  },
  explore:{
    heading:"Causation detective",
    intro:"Every case shows a real-looking correlation. Decide why the variables move together, then test your idea with the data.",
    predIntro:"Make a prediction first. Then the detective’s tools will show you what really happens.",
    // Case files (model data). answer = the relationship type id (ce, cc, rev, acc, pre).
    cases:[
      { id:"c1", title:"Space heater hours vs electricity used", xLab:"heater hours", yLab:"electricity (kWh)",
        pts:[[1, 1.6], [2, 3.1], [3, 4.4], [4, 6.2], [5, 7.4], [6, 9.1], [7, 10.4], [8, 12.1]],
        note:"One space heater, eight days. A power monitor on the outlet measured the electricity it drew each day.",
        answer:"ce", z:"", verdict:"Cause and effect: running the heater uses the electricity." },
      { id:"c2", title:"Hoodie sales vs hot-chocolate sales", xLab:"hoodies sold", yLab:"hot chocolates sold",
        pts:[[22, 40], [31, 62], [45, 80], [57, 106], [64, 124], [77, 146]],
        note:"Weekly sales at a school store over six weeks, October to November. The weeks got colder as they went.",
        answer:"cc", z:"temperature", verdict:"Common cause: cold weeks drive both hoodie and hot-chocolate sales." },
      { id:"c3", title:"Umbrellas sold vs that day’s rainfall", xLab:"umbrellas sold", yLab:"rainfall (mm)",
        pts:[[3, 0], [5, 1], [12, 4], [20, 9], [26, 11], [34, 18], [40, 17], [55, 25]],
        note:"Daily umbrella sales at a downtown shop, with rainfall from the nearest weather station.",
        answer:"rev", z:"", verdict:"Reverse cause and effect: rain (`y`) drives umbrella sales (`x`)." },
      { id:"c4", title:"A country’s name length vs its average rainfall", xLab:"letters in name", yLab:"rainfall (mm/year)",
        pts:[[4, 1200], [5, 640], [6, 1500], [7, 900], [8, 1750], [9, 1100], [10, 2100], [11, 1650]],
        note:"Eight countries picked from an atlas. Nobody can suggest any way a name could affect the weather, or the weather a name.",
        answer:"acc", z:"", verdict:"Accidental: there’s no logical link at all, so the pattern is coincidence." },
      { id:"c5", title:"Fires: trucks sent vs damage", xLab:"fire trucks sent", yLab:"damage ($1000s)",
        pts:[[1, 12], [2, 30], [2, 10], [3, 45], [4, 28], [5, 70], [6, 45], [8, 95]],
        note:"Eight fires in one city last year. Dispatchers send more trucks to bigger fires.",
        answer:"cc", z:"fire size", verdict:"Common cause: the size of the fire drives both the trucks sent and the damage." },
      { id:"c6", title:"Screen time vs sleep", xLab:"screen time (h/day)", yLab:"sleep (h/night)",
        pts:[[1, 8.5], [2, 8.8], [2.5, 7.8], [3, 8.6], [4, 7.7], [5, 8.3], [6, 7.3], [7, 7.8]],
        note:"A survey of eight teens. Follow-up: no common cause found; no experiment yet.",
        answer:"pre", z:"", verdict:"Presumed: screens keeping teens awake sounds logical, but no cause or common cause has been established." }
    ],
    predictions:[
      { id:"p1", start:{ mode:"lab", set:"shoe", col:"none" },
        prompt:"Why do shoe size and reading score move together?",
        options:[{ t:"Both increase with age (common cause)", ok:true }, { t:"Bigger feet help reading (cause and effect)" }, { t:"Reading makes feet grow (reverse)" }, { t:"Pure coincidence (accidental)" }],
        explain:"Older students have bigger feet and read better. Age (grade) is the common cause. " + M1 },
      { id:"p2", start:{ mode:"lab", set:"shoe", col:"grade" },
        prompt:"What is `r` within the grade 4 group?",
        options:[{ t:"About 0", ok:true }, { t:"About 0.9" }, { t:"About −0.9" }, { t:"Exactly 1" }],
        explain:"Once age is held fixed, shoe size tells you nothing about reading. " + M4 },
      { id:"p3", start:{ mode:"study", asg:"choose", ctl:"yes", n:"200" },
        prompt:"The app’s true effect in this model is +2 marks. What difference will this study show?",
        options:[{ t:"More than +2", ok:true }, { t:"Exactly +2" }, { t:"Less than +2" }, { t:"0" }],
        explain:"Motivated students chose the app; motivation adds its own +6. The study can’t separate them. " + M3 },
      { id:"p4", start:{ mode:"cases", card:5 },
        prompt:"Case file 5 (fires: trucks sent vs damage, `r` = 0.88). What best explains the correlation?",
        options:[{ t:"The size of the fire causes both (common cause)", ok:true }, { t:"Trucks cause damage (cause and effect)" }, { t:"Damage sends trucks back in time (reverse)" }, { t:"Coincidence (accidental)" }],
        explain:"Bigger fires get more trucks and do more damage. Sending fewer trucks would make damage worse, not better." }
    ],
    chalIntro:"Use the detective’s tools to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Case files: classify all six cards correctly.",
        why:"1 cause and effect; 2 common cause (temperature); 3 reverse (rain drives umbrella sales); 4 accidental; 5 common cause (fire size); 6 presumed.",
        hints:["For each card, ask: could `x` produce `y`? Could `y` produce `x`? Is there a third variable? Is it coincidence?", "Read each card’s note: it tells you what has been checked.", "Cause, common, reverse, accidental, common, presumed."] },
      { id:"tc2", goal:[2, 3], prompt:"Hidden-variable lab, hoodies vs hot chocolate (`r` = 0.997): choose the colouring that explains the correlation.",
        why:"Coloured by weekly temperature, the cold weeks sit at the top right and the warm weeks at the bottom left: temperature drives both.",
        hints:["What could make both go up together?", "Cold weeks.", "Colour by temperature."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Study designer: set up the study so its result matches the app’s true effect (+2.0) <strong>and</strong> it can support a cause-and-effect claim.",
        why:"Random assignment stops motivation from deciding who gets the app, the control group gives a comparison, and 200 students make chance error small: +2.0.",
        hints:["Which choice stops motivation from deciding who gets the app?", "Random assignment, with a control group to compare against.", "Then use enough students: 200."] }
    ]
  },
  part3:{
    slug:"headlines", name:"Headlines",
    heading:"Headlines on trial",
    intro:"Each news item below is made up (<span class=\"mdm-model\">model news</span>). Open <strong>Check it with data</strong> to see the study behind the headline, give your verdict, then finish the station’s follow-up.",
    verdicts:[{ id:"supported", t:"Supported" }, { id:"care", t:"Fair, but needs care" }, { id:"overstated", t:"Overstated" }, { id:"misleading", t:"Misleading" }],
    stations:[
      { id:"s1", goal:5, headline:"“Breakfast boosts marks, study proves.”",
        study:[["Design", "Online poll on one website (people chose to answer)"], ["Sample", "60 volunteers"], ["Result", "`r` = 0.31 between breakfasts per week and marks"], ["Source", "CrunchStart cereal’s own website"], ["Verb", "“boosts”, “proves”"]],
        answer:"misleading",
        wrong:{ supported:"Check the sample, the source, the strength and the verb before you trust it.", care:"“Needs care” suits a fair claim. This one uses causal words for a weak, volunteer poll run by the cereal maker.", overstated:"It’s worse than overstated: a voluntary-response sample, a weak `r`, causal language, and the source is the cereal company’s own website." },
        why:"Misleading: a voluntary-response sample, a weak `r`, causal language, and the source is the cereal company’s own website.",
        followPrompt:"Tap <strong>all</strong> the problems with this news item, then press Check.",
        multi:true,
        options:[
          { t:"Sample: 60 volunteers on one website (voluntary response)", ok:true },
          { t:"Source: the cereal company’s own website", ok:true },
          { t:"Strength: `r` = 0.31 is weak", ok:true },
          { t:"Causal verb: “boosts … proves” from a poll", ok:true },
          { t:"It uses a correlation coefficient", why:"Using `r` is fine; the problem is what the headline claims from it." },
          { t:"The study is about marks", why:"Marks are a fair thing to study." }],
        followWhy:"All four: the sample, the source, the strength and the causal verb.",
        after:"An honest version: “In an online poll of 60 volunteers on a cereal maker’s website, breakfast was weakly linked to marks.”" },
      { id:"s2", goal:5, headline:"“Teens who play sports are happier.”",
        study:[["Design", "National survey (observational)"], ["Sample", "400 teens"], ["Result", "`r` = 0.42 between weekly sports hours and happiness score"], ["Source", "A national youth survey"], ["Verb", "“are happier”"]],
        answer:"care",
        wrong:{ supported:"The verb is fair, but a survey can’t rule out other explanations and `r` = 0.42 is only moderate: it needs care.", overstated:"“Are happier” is association language, not a causal verb.", misleading:"The sample is national and the verb is associational: the claim is fair, with care." },
        why:"Fair, but needs care: the verb is associational, and the strength is moderate.",
        followPrompt:"Choose the most important caveat.",
        options:[
          { t:"Teens with more free time or friends may do both", ok:true, why:"Right. A common cause could link sports and happiness." },
          { t:"400 teens is too small a sample", why:"400 is a reasonable national sample. Think about what else could explain the link." },
          { t:"`r` = 0.42 is too weak to mean anything", why:"0.42 is moderate. " + M7 },
          { t:"The survey should have asked only athletes", why:"Asking only athletes would remove the comparison." }],
        followWhy:"Teens with more free time or friends may do both: a possible common cause.",
        after:"Even a fair headline should say it’s a survey and name the other explanations." },
      { id:"s3", goal:[4, 5], headline:"“Reading app raises marks by 2 points.”",
        study:[["Design", "Randomized experiment with a control group"], ["Sample", "200 students"], ["Result", "App group − control group = +2.0 marks"], ["Source", "A school board’s research office (independent of the app maker)"], ["When", "This school year"]],
        answer:"supported",
        wrong:{ care:"This is a randomized controlled experiment: a causal headline is supported.", overstated:"“Raises” is causal, and here that’s earned: random assignment, a control group, 200 students.", misleading:"Look at the design: random assignment with a control group, run by an independent source." },
        why:"Supported: random assignment, a control group, an independent source and current data.",
        followPrompt:"Note why: tap <strong>all</strong> the reasons the headline is supported, then press Check.",
        multi:true,
        options:[
          { t:"Random assignment", ok:true },
          { t:"A control group", ok:true },
          { t:"An independent source", ok:true },
          { t:"Current data", ok:true },
          { t:"The app is popular", why:"Popularity isn’t evidence that it works." },
          { t:"`r` is above 0.9", why:"No `r` was reported; the design is what matters." }],
        followWhy:"Random assignment, a control group, an independent source and current data.",
        after:"Only random assignment balances hidden variables such as motivation." }
    ],
    quickCheck:{
      title:"Headlines on trial quick check", summary:"Headlines on trial quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which study design supports a causal headline?",
          choices:[
            { t:"Randomized controlled experiment", ok:true, fb:"Right. Only random assignment balances hidden variables." },
            { t:"Large online poll", fb:"Only random assignment balances hidden variables." },
            { t:"Survey with `r` = 0.9", fb:"Only random assignment balances hidden variables." },
            { t:"Interviews of satisfied customers", fb:"Only random assignment balances hidden variables." }] },
        { id:"q2", goal:5, prompt:"A headline uses ‘is linked to’. That suits…",
          choices:[
            { t:"An observational study", ok:true, fb:"Right. Association language for association evidence." },
            { t:"Only an experiment", fb:"Association language for association evidence." },
            { t:"No study", fb:"Association language for association evidence." },
            { t:"Only anecdotes", fb:"Association language for association evidence." }] },
        { id:"q3", goal:5, prompt:"Which source is most trustworthy for national data?",
          choices:[
            { t:"Statistics Canada", ok:true, fb:"Right. Authoritative, independent, current." },
            { t:"A brand’s ad", fb:"Authoritative, independent, current." },
            { t:"An anonymous blog", fb:"Authoritative, independent, current." },
            { t:"A viral post", fb:"Authoritative, independent, current." }] },
        { id:"q4", goal:5, prompt:"A poll of 60 volunteers on one website is…",
          choices:[
            { t:"A voluntary-response sample", ok:true, fb:"Right. People chose to respond: likely biased." },
            { t:"A random sample", fb:"People chose to respond: likely biased." },
            { t:"A census", fb:"People chose to respond: likely biased." },
            { t:"A controlled experiment", fb:"People chose to respond: likely biased." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"name", type:"sorter", title:"Name the relationship", summary:"Name the relationship", goal:[1, 2], noun:"card", txt:true,
        instruction:"Tap a card, then tap the type of relationship it shows. Each card’s note tells you what has been checked.",
        boxes:[{ id:"ce", label:"Cause and effect" }, { id:"cc", label:"Common cause" }, { id:"rev", label:"Reverse cause and effect" }, { id:"acc", label:"Accidental" }, { id:"pre", label:"Presumed" }],
        wrongDefault:"Read the note: what has been checked, and in which direction could cause run?",
        items:[
          sortItem("r1", "Minutes a kettle runs vs water temperature (lab measurements)", "ce", "the kettle’s heat raises the water temperature."),
          sortItem("r2", "Ice-cream sales vs sunburn cases (both peak in hot, sunny weeks)", "cc", "hot, sunny weather drives both."),
          sortItem("r3", "Pain-medicine doses taken vs pain level reported (patients take more when pain is worse)", "rev", "worse pain leads to more medicine, so `y` drives `x`.",
            { ce:"Which direction? Worse pain leads to more medicine, so `y` drives `x`." }),
          sortItem("r4", "Number of letters in a hockey team’s name vs points scored in a season (no conceivable link)", "acc", "there’s no conceivable link, so it’s coincidence."),
          sortItem("r5", "Students who play an instrument vs math marks (no common cause found in a follow-up; no experiment yet)", "pre", "it seems logical, but no cause or common cause has been established.",
            { cc:"The note says none was found, so it’s presumed." }),
          sortItem("r6", "Number of police officers in a city vs number of crimes (larger cities have more of both)", "cc", "city size drives both.",
            { ce:"City size drives both." }),
          sortItem("r7", "Umbrellas sold vs rainfall that day", "rev", "rain drives umbrella sales; selling umbrellas can’t cause rain.",
            { ce:M2 }),
          sortItem("r8", "Hours of practice vs free-throw %, from a randomized training experiment", "ce", "a randomized experiment shows that practice raises free-throw %."),
          sortItem("r9", "Cheese eaten per person vs bedsheet-tangle accidents, by year (no plausible link)", "acc", "there’s no plausible link: coincidence."),
          sortItem("r10", "Screen time vs hours of sleep (checked for common causes; none found; no experiment)", "pre", "it seems logical, but nothing has been established.",
            { cc:"The note says none was found, so it’s presumed." })
        ] },
      { id:"hidden", type:"custom", title:"Hidden variables", summary:"Hidden variables", goal:[2, 3], star:true,
        instruction:"Use the clinic table (model data) to compare recovery rates. Items marked ★ are non-routine (a version of Simpson’s paradox); the last two go beyond the Final Check.",
        how:"Type a percentage such as 76 or 76%, or tap a choice, then press Check.",
        table:{ head:["Clinic", "Mild cases recovered", "Severe cases recovered", "All"], rows:[["A", "180 of 200", "10 of 50", "190 of 250"], ["B", "46 of 50", "50 of 200", "96 of 250"]] },
        items:[
          { id:"h1", goal:3, prompt:"Overall recovery rate at A? at B?", parts:["A (%):", "B (%):"], answer:[76, 38.4], display:"A 76%, B 38.4%",
            why:"190 ÷ 250 = 76%; 96 ÷ 250 = 38.4%.", fb:"Part ÷ whole for each clinic." },
          { id:"h2", goal:3, prompt:"Mild-case rate at A? at B?", parts:["A (%):", "B (%):"], answer:[90, 92], display:"A 90%, B 92%",
            why:"180 ÷ 200 = 90%; 46 ÷ 50 = 92%.", fb:"180 ÷ 200; 46 ÷ 50." },
          { id:"h3", goal:3, prompt:"Severe-case rate at A? at B?", parts:["A (%):", "B (%):"], answer:[20, 25], display:"A 20%, B 25%",
            why:"10 ÷ 50 = 20%; 50 ÷ 200 = 25%.", fb:"10 ÷ 50; 50 ÷ 200." },
          { id:"h4", goal:3, star:true, prompt:"Which clinic does better <strong>within each</strong> severity group?", parts:[{ t:"Better in both groups:", choices:["A", "B", "Tie", "Can’t tell"] }], answer:"B", display:"B",
            why:"92 > 90 and 25 > 20.", fb:"92 > 90 and 25 > 20. " + M4 },
          { id:"h5", goal:2, star:true, prompt:"Why is A better overall?", parts:[{ t:"Reason:", choices:["A treats mostly mild cases", "A’s doctors are better", "B lies", "B is bigger"] }], answer:"A treats mostly mild cases", display:"A treats mostly mild cases",
            why:"Severity is a hidden variable: B takes most of the severe cases.", fb:"Severity is a hidden variable: B takes most of the severe cases.",
            hints:["Look at the denominators.", "A: 200 mild, 50 severe. B: 50 mild, 200 severe.", "Severe cases recover less everywhere; B gets more of them."] },
          { id:"h6", goal:[2, 3], star:true, prompt:"Which clinic would you choose for a severe case, and why?", parts:[{ t:"Choice:", choices:["B: higher rate for severe cases (25% vs 20%)", "A: higher overall rate (76% vs 38.4%)", "A: higher rate for mild cases", "Either: the rates are about the same"] }], answer:"B: higher rate for severe cases (25% vs 20%)", display:"B: higher rate for severe cases (25% vs 20%)",
            why:"Compare like with like: within the severe group, B recovers 25% and A 20%.", fb:"Compare like with like: within the severe group.",
            investigate:"Name one more variable a fair comparison would need to check (e.g. age of patients)." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Nell", how:"", goal:[2, 4],
        instruction:"Nell made one mistake in each argument. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Does owning a pet lower stress? A survey of 500 adults found `r` = −0.62 between pets owned and stress score.",
            steps:["`r` = −0.62 is a moderate negative correlation.", "500 adults is a large sample.", "So owning more pets causes lower stress.", "Doctors should prescribe pets."],
            answer:2,
            stepFb:["Correct: 0.33–0.67 is moderate.", "True.", "", "Step 4 rests on step 3. The mistake is earlier."],
            fixes:[
              { t:"A survey shows association only. Calmer people (or people with more time or space) may choose more pets; test it with an experiment.", ok:true, why:"People weren’t assigned pets, so a survey shows association, not cause." },
              { t:"It’s weak, so ignore it.", why:"−0.62 is moderate, not weak. " + M7 },
              { t:"A larger sample would prove it.", why:M3 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["What kind of study was this?", "A survey: people weren’t assigned pets.", "Association, not cause."] },
          { id:"e2", goal:2, task:"Towns with more coffee shops have more car accidents (`r` = 0.81, 40 towns).",
            steps:["`r` = 0.81 is strong and positive.", "The relationship is clearly accidental: coffee has nothing to do with driving.", "So the data can be ignored."],
            answer:1,
            stepFb:["Correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"It’s likely common cause: larger towns have more coffee shops and more cars. Compare towns of similar population.", ok:true, why:"Town size grows with both, so compare towns of similar population." },
              { t:"It’s cause and effect: caffeine causes crashes.", why:M1 },
              { t:"It’s reverse: crashes cause coffee shops to open.", why:M2 },
              { t:"Step 2 is correct.", why:"A logical third variable (population) explains it, so it’s not coincidence." }],
            hints:["Is there a third variable that grows with both?", "Town size.", "Common cause."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which case in the detective surprised you most, and why?" },
      { id:"j2", q:"In your own words, explain why random assignment lets an experiment show cause when a survey can’t." },
      { id:"j3", q:"Explain to a friend how colouring a scatter plot by a third variable can reveal a hidden cause." },
      { id:"j4", q:"Think of a claim you once believed that confused correlation with cause. How would you test it now?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Hours a space heater runs vs electricity used (measured). Which type of relationship?", options:[
          { t:"Cause and effect", ok:true, why:"Running the heater uses the electricity." },
          { t:"Common cause", why:"No third variable is needed." },
          { t:"Reverse cause and effect", why:M2 },
          { t:"Accidental", why:"There’s a direct physical link." }] },
        b:{ prompt:"`x` = umbrellas sold, `y` = rainfall that day. Which type of relationship?", options:[
          { t:"Reverse cause and effect", ok:true, why:"Rain (`y`) drives umbrella sales (`x`)." },
          { t:"Cause and effect", why:"Selling umbrellas can’t cause rain. " + M2 },
          { t:"Accidental", why:"There’s a clear link." },
          { t:"Presumed", why:"The cause is clear; it just runs from `y` to `x`." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which describes a common-cause relationship?", options:[
          { t:"A third variable drives both `x` and `y`", ok:true, why:"That’s common cause." },
          { t:"`y` drives `x`.", why:"That’s reverse." },
          { t:"The link is pure coincidence.", why:"That’s accidental." },
          { t:"It seems logical, but no cause has been established.", why:"That’s presumed. " + M5 }] },
        b:{ prompt:"Which describes an accidental relationship?", options:[
          { t:"The variables are correlated by coincidence, with no causal link", ok:true, why:"That’s accidental." },
          { t:"A third variable drives both.", why:"That’s common cause." },
          { t:"`x` drives `y`.", why:"That’s cause and effect." },
          { t:"It seems logical but is unproven.", why:"That’s presumed. " + M5 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which study design can establish cause and effect?", options:[
          { t:"A randomized controlled experiment", ok:true, why:"Random assignment balances hidden variables, and the control group gives a comparison." },
          { t:"A survey of 10 000 people", why:M3 },
          { t:"An observational study with `r` = 0.95", why:M3 },
          { t:"A collection of customer testimonials", why:"Anecdotes, self-selected." }] },
        b:{ prompt:"In an experiment, what is random assignment for?", options:[
          { t:"To make the groups alike, on average, in every other variable", ok:true, why:"Hidden variables balance out between the groups." },
          { t:"To make the sample represent the whole country", why:"That’s random <strong>sampling</strong>." },
          { t:"To make the effect bigger", why:"It removes bias; it doesn’t create effects." },
          { t:"To let participants choose their group", why:"That’s self-selection. " + M3 }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Across 40 towns, the number of coffee shops and the number of car accidents have `r` = 0.81. What is the most likely explanation?", options:[
          { t:"Common cause: bigger towns have more of both", ok:true, why:"Population drives both." },
          { t:"Cause and effect: coffee causes accidents", why:M1 },
          { t:"Accidental: there’s no link", why:"Population links them." },
          { t:"Reverse: accidents create coffee shops", why:M2 }] },
        b:{ prompt:"Students who own more books score higher on reading tests (`r` = 0.55). A follow-up found that family income relates strongly to both. What is the best classification?", options:[
          { t:"Common cause: income relates to both book ownership and scores", ok:true, why:"A third variable has been identified." },
          { t:"Cause and effect: books raise scores", why:"Income wasn’t ruled out. " + M1 },
          { t:"Accidental", why:"There’s an identified third variable. " + M7 },
          { t:"Presumed", why:"A common cause has been found. " + M5 }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Shoe size vs reading score: `r` = 0.90 for all 12 students; within each of grades 2, 4 and 6, `r` = 0.00. What should you conclude?", options:[
          { t:"Grade (age) is a common cause; shoe size doesn’t affect reading", ok:true, why:"Within each grade the pattern disappears." },
          { t:"Bigger feet improve reading", why:M1 },
          { t:"The overall `r` must be a calculation error", why:"It’s real; it comes from the grade groups." },
          { t:"Reading makes feet grow", why:M2 }] },
        b:{ prompt:"Hoodie sales vs hot-chocolate sales: `r` = 0.997 over six weeks. Each is strongly correlated with weekly temperature (`r` ≈ −1). What should you conclude?", options:[
          { t:"Temperature is a common cause of both", ok:true, why:"Cold weeks drive both." },
          { t:"Hoodies cause hot-chocolate sales", why:M1 },
          { t:"The relationship is accidental", why:"A clear third variable explains it." },
          { t:"Hot chocolate causes hoodie sales", why:M2 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Clinic A: mild 180/200, severe 10/50 (overall 76%). Clinic B: mild 46/50, severe 50/200 (overall 38.4%). Which clinic has the better recovery rate for each type of case?", options:[
          { t:"B in both groups (92% vs 90%; 25% vs 20%)", ok:true, why:"Compare within groups: B is higher for mild and for severe cases." },
          { t:"A in both groups, because 76% > 38.4%", why:M4 },
          { t:"A for mild, B for severe", why:"Mild: 92% (B) vs 90% (A)." },
          { t:"They can’t be compared", why:"Compare within groups." }] },
        b:{ prompt:"Clinic P: minor 270/300, major 20/100 (overall 72.5%). Clinic Q: minor 92/100, major 75/300 (overall about 41.8%). Which clinic has the better rate for each type of case?", options:[
          { t:"Q in both groups (92% vs 90%; 25% vs 20%)", ok:true, why:"Compare within groups: Q is higher for minor and for major cases." },
          { t:"P in both groups, because 72.5% > 41.8%", why:M4 },
          { t:"P for minor, Q for major", why:"Minor: 92% (Q) vs 90% (P)." },
          { t:"They can’t be compared", why:"Compare within groups." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"A survey of 400 teens finds `r` = 0.42 between weekly sports hours and happiness. Which headline is most accurate?", options:[
          { t:"“Teens who play more sports tend to be somewhat happier, survey finds”", ok:true, why:"Association language, a moderate strength word and the source." },
          { t:"“Sports make teens happy.”", why:M6 },
          { t:"“Survey proves sports cure unhappiness.”", why:M6 + " " + M1 },
          { t:"“No link between sports and happiness.”", why:"`r` = 0.42 is moderate. " + M7 }] },
        b:{ prompt:"Which is the best explanation of why correlation doesn’t prove cause?", options:[
          { t:"“Variables can move together because of a third variable, a reverse direction or coincidence, not only because one causes the other.”", ok:true, why:"Each of those can produce the same `r`." },
          { t:"“Correlations are usually calculation errors.”", why:M7 },
          { t:"“Only negative correlations can show cause.”", why:"Sign is unrelated to cause." },
          { t:"“Correlation proves cause when `r` > 0.9.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which best describes a hidden (lurking) variable?", options:[
          { t:"A variable not included in the analysis that affects the variables being studied", ok:true, why:"It can create or hide a correlation." },
          { t:"The `y`-variable", why:"That’s measured." },
          { t:"An outlier", why:"That’s one data point." },
          { t:"A variable with `r` = 0", why:"That describes a relationship, not a variable." }] },
        b:{ prompt:"You suspect age explains a correlation. Which display best tests that?", options:[
          { t:"The scatter plot with points coloured by age group, and `r` within each group", ok:true, why:"If the pattern vanishes within groups, age explains it." },
          { t:"A histogram of the `y`-variable", why:"It ignores `x` and age." },
          { t:"The same scatter plot, larger", why:"It won’t reveal the third variable." },
          { t:"A circle graph of ages", why:"It shows ages only." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A school wants to know whether a new reading app improves marks. Which plan can answer that?", options:[
          { t:"Randomly assign 200 students to use the app or not; compare mean marks", ok:true, why:"Random assignment with a control group can show cause." },
          { t:"Survey students who chose the app", why:M3 },
          { t:"Ask teachers whether they like the app", why:"Opinions, not outcomes." },
          { t:"Compare this year’s marks with last year’s", why:"Too many other changes." }] },
        b:{ prompt:"A coach asks whether a sports drink speeds recovery compared with water. Which plan can answer that?", options:[
          { t:"Randomly assign 60 athletes to the drink or water (without telling them which), and compare recovery times", ok:true, why:"Random assignment with a control (water) group can show cause." },
          { t:"Ask athletes who already use the drink how they feel", why:M3 },
          { t:"Give everyone the drink and time them", why:"There’s no control group." },
          { t:"Compare pros (who use it) with amateurs", why:"Too many differences between the groups." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Headline: ‘Coffee makes students smarter.’ Behind it: 30 volunteers, an online poll, `r` = 0.35. Best verdict?", options:[
          { t:"Overstated: a small volunteer sample, a weak-to-moderate `r`, observational data and a causal verb", ok:true, why:"The data show at most a weak association." },
          { t:"Supported: `r` is positive", why:M1 },
          { t:"Supported if the sample were 300", why:M3 },
          { t:"Proven false", why:"It’s unsupported, not disproven. " + M7 }] },
        b:{ prompt:"Headline: ‘Phones ruin teen sleep.’ Behind it: a survey of 2000 teens, `r` = −0.48. Best verdict?", options:[
          { t:"Overstated: a moderate association from a survey; reverse cause (poor sleepers use phones more) and common causes are possible", ok:true, why:"A survey can’t rule out other explanations." },
          { t:"Supported: 2000 is a large sample", why:M3 },
          { t:"Supported: `r` is negative, so phones reduce sleep", why:M1 },
          { t:"Meaningless: `r` below 0.5 means no relationship", why:M7 }] } }
    ]
  },
  task:{
    title:"Honest headline", summary:"Honest headline",
    statement:"<p>Write a headline for this study that is honest about what it shows. Study <span class=\"mdm-model\">model data</span>: a survey of 400 Ontario teens; weekly sports hours vs happiness score; `r` = 0.42; observational. Can you find every honest version?</p>",
    checks:["No causal claim from a survey", "Strength matches `r` = 0.42", "A real caveat", "Source named"],
    tips:["It’s a survey: no ‘causes’ or ‘proves’.", "0.42 is between 0.33 and 0.67.", "A caveat should name another explanation. ‘Only athletes’ is false: the survey included all teens.", "Tell readers where the data came from."],
    explainPrompt:"Explain why your headline is honest: what the study can and can’t show.",
    vocab:"Use the words association, cause, survey and hidden variable.",
    more:"There’s more than one honest headline. Can you find every one?"
  },
  cards:[
    ["Correlation vs causation", "Correlation: variables move together. Causation: one produces change in the other."],
    ["Cause and effect", "A change in `x` directly produces a change in `y`."],
    ["Common cause", "A third variable drives both `x` and `y` (e.g. temperature for hoodies and hot chocolate)."],
    ["Reverse cause and effect", "`y` actually drives `x` (rain → umbrellas sold)."],
    ["Accidental relationship", "Correlation by coincidence; no causal link."],
    ["Presumed relationship", "Seems logical; no cause or common cause has been established yet."],
    ["Hidden (lurking) variable", "An unmeasured variable that affects the variables studied."],
    ["Checking a hidden variable", "Colour the scatter plot by it; compare `r` or rates within groups."],
    ["Randomized controlled experiment", "Random assignment plus a control group: the only design that can establish cause."],
    ["Random sampling vs random assignment", "Sampling: who is studied. Assignment: who gets which treatment."],
    ["Honest headline words", "“Linked to”, “associated with” for observational data; “causes” only for well-designed experiments."]
  ]
};
