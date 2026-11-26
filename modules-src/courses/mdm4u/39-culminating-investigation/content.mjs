// MDM4U 39 Culminating Data-Management Investigation. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/39-culminating-investigation.md
// Core feedback sentences for the plan's misconceptions (§3), used where the plan names only the code.
const M1 = "An investigable question names measurable variables and a population your data actually represent.";
const M2 = "Two numerical variables: scatter plot and `r`. A numerical variable across groups: side-by-side box plots with a centre and spread for each.";
const M3 = "Strong is |`r`| ≥ 0.67, moderate 0.33–0.67, weak &lt; 0.33. The sign is only the direction.";
const M4 = "These data are observational: say ‘is associated with’ and name a possible hidden variable.";
const M5 = "Conclusions apply to the population your sample represents. A convenience sample represents only itself.";
const M6 = "A difference in centres matters more when the spreads are small and the boxes don’t overlap much.";
const M7 = "Name specific limitations: sample size, representativeness, hidden variables, measurement, model data.";
const M8 = "Constructive critique names a criterion, the evidence, and a specific improvement.";

export default {
  id:"39-culminating-investigation",
  kind:"topic",
  title:"Culminating data-management investigation",
  topic:"Culminating Data-Management Investigation",
  readyTopic:"your investigation",
  hero:{
    eq:"Question → Plan → Data → Analysis → Conclusion → Report",
    eqLabel:"The investigation cycle: question, plan, data, analysis, conclusion, report, then new questions.",
    eqSize:"sm",
    headline:"Ask a question data can answer, then answer it honestly.",
    text:"This is where everything in the course comes together. You’ll pose a <strong>question</strong>, choose <strong>data</strong>, build the right <strong>summaries</strong> and <strong>graphs</strong>, and write a <strong>conclusion</strong> that says exactly what the evidence supports, with its <strong>limitations</strong>. Then you’ll critique other investigations the way a statistician would.",
    muted:"Your answers and any data you enter save on this device only. Don’t enter names or anything that identifies a person.",
    fig:{ aria:"A six-step cycle draws step by step: Question, Plan, Data, Analysis, Conclusion, Report, with an arrow from Report back to Question labelled new questions. At Data a small table fills; at Analysis a scatter plot appears; at Conclusion the sentence strong negative association (r = −0.99) types out; at Report it folds into a page icon.", shape:"wide" }
  },
  goals:[
    "I can pose an investigable question with clear variables and a population that matches my data.",
    "I can plan an investigation: data source (primary or secondary), sample, and variables.",
    "I can choose and produce the numerical and graphical summaries that fit my question.",
    "I can draw a conclusion that matches the evidence, using correct strength words and no unsupported causal claims.",
    "I can identify limitations, including bias and hidden variables, and suggest further investigation.",
    "I can critique another investigation constructively, using clear criteria."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Types of data", goal:2, prompt:"You download last year’s attendance figures from a school board’s website. What kind of data is that?",
          options:[
            { t:"Secondary data", ok:true, why:"Someone else collected it." },
            { t:"Primary data", why:"Primary data is collected by you, for your question." },
            { t:"Experimental data", why:"Nothing was assigned or controlled." },
            { t:"Categorical data only", why:"Attendance counts are numerical." }],
          hints:["Who collected it?", "The school board, not you.", "Secondary."] },
        { id:"w2", skill:"Types of data", goal:1, prompt:"Which variable is categorical?",
          options:[
            { t:"Plays a school sport (yes or no)", ok:true, why:"Yes or no is a label (a group), not a number." },
            { t:"Hours of sleep", why:"Numerical (continuous)." },
            { t:"Mark (%)", why:"Numerical." },
            { t:"Number of siblings", why:"Numerical (discrete)." }],
          hints:["Categorical = groups or labels.", "Which values are words, not numbers?", "Yes or no."] },
        { id:"w3", skill:"Choosing graphs", goal:3, prompt:"Best graph to show the relationship between screen time and sleep (both numerical)?",
          options:[
            { t:"Scatter plot", ok:true, why:"Two numerical variables, paired: each student is one (`x`, `y`) point." },
            { t:"Circle graph", why:"Circle graphs show parts of a whole. " + M2 },
            { t:"Histogram of sleep", why:"That ignores screen time." },
            { t:"Bar graph of averages", why:"That hides the individual pairs." }],
          hints:["Two numerical variables, paired.", "Each student is one (`x`, `y`) point.", "Scatter plot."] },
        { id:"w4", skill:"Choosing graphs", goal:3, prompt:"Best graph to compare marks of students who play a sport and those who don’t?",
          options:[
            { t:"Side-by-side box plots", ok:true, why:"One numerical variable, two groups: show each group’s distribution." },
            { t:"Scatter plot", why:"One variable is categorical. " + M2 },
            { t:"Line graph", why:"There’s no time sequence." },
            { t:"A single histogram of all marks", why:"That mixes the groups." }],
          hints:["One numerical variable, two groups.", "Show each group’s distribution.", "Side-by-side box plots."] },
        { id:"w5", skill:"Summaries and strength words", goal:4, prompt:"`r = -0.52`. Which description fits?",
          options:[
            { t:"Moderate negative linear relationship", ok:true, why:"0.52 is between 0.33 and 0.67." },
            { t:"Strong negative", why:"Strong needs |`r`| ≥ 0.67." },
            { t:"Weak positive", why:"The sign is negative." },
            { t:"No relationship", why:"0.52 is moderate." }],
          hints:["Use the strength guide.", "|−0.52| = 0.52.", "Moderate, negative."] },
        { id:"w6", skill:"Summaries and strength words", goal:3, prompt:"Which pair summarizes a skewed set of marks best?",
          options:[
            { t:"Median and IQR", ok:true, why:"Both resist the pull of a long tail." },
            { t:"Mean and range", why:"Both are pulled by extremes." },
            { t:"Mode and maximum", why:"Neither describes centre and spread well." },
            { t:"Mean only", why:"Always add a spread." }],
          hints:["Which measures resist outliers?", "The median, and quartiles.", "Median and IQR."] }
      ],
      refreshers:{
        "Types of data":"Primary: you collect it. Secondary: someone else did. Categorical: groups. Numerical: counts or measurements.",
        "Choosing graphs":"Relationship: scatter plot. Compare groups: side-by-side box plots. One variable: histogram (numerical) or bar or circle graph (categorical).",
        "Summaries and strength words":"Centre plus spread. Strength: |`r`| ≥ 0.67 strong, 0.33–0.67 moderate, &lt; 0.33 weak."
      }
    }
  },
  explore:{
    heading:"Investigation planner",
    intro:"Choose a data set, pose a question, plan your analysis, and let the tools build the summaries. Each milestone has a check. Everything you build here flows into your report.",
    predIntro:"Make a prediction first. Then the planner will show you what really happens.",
    predictions:[
      { id:"p1", start:{ ds:"m1", tpl:"rel", v1:"sleep", v2:"mark", pop:"s20", an:["scatter", "r"], stage:2 },
        prompt:"M1: which question needs a scatter plot?",
        options:[{ t:"Is there a relationship between sleep and mark?", ok:true }, { t:"Do sport and non-sport students differ in mark?" }, { t:"What percentage play a sport?" }, { t:"What is the most common mark?" }],
        explain:"Two numerical variables, paired by student. The scatter plot shows `r = 0.92`." },
      { id:"p2", start:{ ds:"m1", tpl:"diff", v1:"sport", v2:"mark", pop:"s20", an:["box", "medians", "iqr"], stage:2 },
        prompt:"M1: sport players’ median mark is 77 and non-players’ is 70.5; both IQRs are 8. How do the box plots compare?",
        options:[{ t:"They overlap a lot, with the sport box shifted higher", ok:true }, { t:"No overlap" }, { t:"Identical" }, { t:"The non-sport box is higher" }],
        explain:"The sport box runs 73–81, the non-sport box 69–77. A 6.5-point difference in medians, but the middle halves overlap from 73 to 77." },
      { id:"p3", start:{ ds:"m2", tpl:"rel", v1:"soup", v2:"drinks", pop:"d20", an:["scatter", "r"], stage:2 },
        prompt:"M2: soup vs cold drinks has `r = -0.979`. Do cold drinks reduce soup sales?",
        options:[{ t:"No: temperature drives both (common cause)", ok:true }, { t:"Yes: strong `r` proves it" }, { t:"Yes, but only on hot days" }, { t:"No: `r` is negative, so they’re unrelated" }],
        explain:"Colour by temperature shows the gradient. Hot days: more drinks, less soup. Neither causes the other." },
      { id:"p4", start:{ ds:"m1", stage:0 },
        prompt:"M1 is 20 model students from one school. How far can a conclusion reach?",
        options:[{ t:"Only to these 20 students (or, cautiously, similar students)", ok:true }, { t:"All Ontario teens" }, { t:"All Canadians" }, { t:"Everyone, if `r` is strong" }],
        explain:"Conclusions extend only to the population the sample represents. The population chip “all Ontario teens” is now greyed out for the built-in data." }
    ],
    chalIntro:"These are your planning milestones. Use the planner to meet each one, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"<strong>An investigable question.</strong> Build a question for M1 or M2 that passes all three checks: the variables exist in the data set, the template matches the variable types, and the population matches the data.",
        why:"Your variables exist, the template matches their types, and the population is the one your data represent.",
        hints:["Check each variable’s type in the Plan tab.", "Numerical + numerical → relationship; group + numerical → differ.", "e.g. “Is there a relationship between screen time and mark for these 20 model students?”"] },
      { id:"tc2", goal:3, prompt:"<strong>The right analysis.</strong> Choose the analysis items your question needs.",
        why:"Your analysis matches your question: a relationship needs a scatter plot, `r` and a line; groups need side-by-side box plots with a centre and a spread for each.",
        hints:["What does your question compare?", "Relationship: pattern, strength, line. Groups: distribution, centre, spread.", "Relationship: scatter plot, `r` and line of best fit. Groups: side-by-side box plots, group means or medians, and IQRs or standard deviations."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>A conclusion that matches the evidence.</strong> For “Is there a relationship between screen time and mark for these 20 model students?”, build a conclusion that passes every check.",
        why:"Strong (|`r`| = 0.86 ≥ 0.67), negative, association language, a specific limitation and a plausible hidden variable.",
        hints:["Read `r`: sign, then size.", "Use association language.", "Strong negative association; limitation: `n = 20` model students; possible hidden variable: sleep."] }
    ]
  },
  part3:{
    slug:"critique", name:"Critique",
    heading:"Critique an investigation",
    intro:"Here are two complete sample investigations (both model). Rate each one against the rubric, choose its most important improvement, then write a constructive comment. The same five criteria will check your own report.",
    rubric:["Question: investigable, with clear variables and population.", "Data and sample: source, size, how representative.", "Analysis: the right summaries and graphs.", "Conclusion: matches the evidence; no unsupported cause.", "Limitations and next steps."],
    rubricShort:["Question", "Data and sample", "Analysis", "Conclusion", "Limitations"],
    levels:["Level 1 (limited)", "Level 2", "Level 3", "Level 4 (thorough)"],
    investigations:[
      { id:"A", title:"Investigation A: “Breakfast and marks”",
        parts:[["Question", "“Does eating breakfast cause higher marks?”"],
          ["Data", "An online poll of 14 of the author’s friends (primary, voluntary)."],
          ["Analysis", "Two means (breakfast 81%, none 74%) shown in a bar graph whose `y`-axis starts at 70."],
          ["Conclusion", "“Breakfast causes 7% higher marks for all students.”"],
          ["Limitations", "“None.”"]],
        answer:[2, 1, 2, 1, 1],
        reasons:["It names variables, but it asks about cause, which a poll can’t show.",
          "14 friends who chose to answer: small, voluntary and not representative.",
          "Two means fit the question, but no spread is shown and the axis starting at 70 exaggerates the gap.",
          "It claims cause from observational data and stretches to all students.",
          "No limitations are listed."],
        improve:[
          { t:"Use a random sample and don’t claim cause; name hidden variables such as sleep or family routines.", ok:true, why:"That fixes the two biggest problems: who was asked, and the causal claim. " + M4 },
          { t:"Use more colours in the bar graph.", why:"Colours don’t change what the evidence can support." },
          { t:"Report the means to two decimal places.", why:"Precision isn’t the problem: the sample and the causal claim are." },
          { t:"Ask the same 14 friends again next month.", why:"That’s still a small voluntary sample of friends. " + M5 }] },
      { id:"B", title:"Investigation B: “Temperature and soup”",
        parts:[["Question", "“Is there a relationship between daily high temperature and soup sold at the model cafeteria?”"],
          ["Data", "M2 (20 days, secondary)."],
          ["Analysis", "Scatter plot, `r = -0.991`, `ŷ = -1.34x + 52.41`, residual plot with no pattern."],
          ["Conclusion", "“There is a strong negative association. Colder days are associated with more soup sold.”"],
          ["Limitations", "“20 days at one cafeteria; menu changes and holidays weren’t recorded; model data.”"]],
        answer:[4, 3, 4, 4, 4],
        reasons:["Investigable: two measurable variables and a clear population.",
          "Secondary model data, but only 20 days at one cafeteria.",
          "Scatter plot, `r`, line and a residual check match a relationship question.",
          "It matches the evidence and uses association language.",
          "Specific: scope, possible hidden variables and model data."],
        improve:[
          { t:"Collect a full year at several schools.", ok:true, why:"More days and more cafeterias would show whether the pattern holds beyond these 20 model days." },
          { t:"Remove the coldest days.", why:"Don’t remove data to tidy a result." },
          { t:"Say that cold weather causes soup sales.", why:M4 },
          { t:"Switch to a bar graph of the averages.", why:"That hides the individual days." }] }
    ],
    comment:{
      criteria:["Question", "Data and sample", "Analysis", "Conclusion", "Limitations"],
      evidence:[
        { id:"e1", t:"the poll was voluntary and reached only 14 friends, so the result may not represent all students" },
        { id:"e2", t:"the `y`-axis starts at 70, so the 7-point gap looks huge" },
        { id:"e3", t:"the conclusion says “causes”, but the data are observational" },
        { id:"e4", t:"the limitations section says “None”" },
        { id:"e5", t:"the data cover only 20 days at one cafeteria" }],
      suggestions:[
        { id:"e1", t:"use a random sample" },
        { id:"e2", t:"start the axis at 0" },
        { id:"e3", t:"say “is associated with” and name a hidden variable such as sleep" },
        { id:"e4", t:"list the sample size, how the sample was chosen and possible hidden variables" },
        { id:"e5", t:"collect a full year at several schools" }]
    },
    quickCheck:{
      title:"Critique quick check", summary:"Critique quick check",
      items:[
        { id:"q1", goal:6, prompt:"Investigation A’s biggest data problem?",
          choices:[
            { t:"Voluntary sample of 14 friends", ok:true, fb:"Right. Small and self-selected: it represents only those friends." },
            { t:"The marks were percentages", fb:"Small and self-selected: it represents only those friends. " + M5 },
            { t:"The poll was online in the evening", fb:"Small and self-selected: it represents only those friends. " + M5 },
            { t:"It used means", fb:"Small and self-selected: it represents only those friends. " + M5 }] },
        { id:"q2", goal:6, prompt:"What’s wrong with A’s graph?",
          choices:[
            { t:"The `y`-axis starts at 70, exaggerating the gap", ok:true, fb:"Right. Truncated axes make small differences look large." },
            { t:"It’s a bar graph", fb:"Truncated axes make small differences look large." },
            { t:"It has two bars", fb:"Truncated axes make small differences look large." },
            { t:"It has a title", fb:"Truncated axes make small differences look large." }] },
        { id:"q3", goal:6, prompt:"Which comment is constructive?",
          choices:[
            { t:"“Your sample was voluntary; a random sample would make the conclusion more trustworthy.”", ok:true, fb:"Right. Criterion, evidence, suggestion." },
            { t:"“This is bad.”", fb:"Criterion, evidence, suggestion. " + M8 },
            { t:"“I disagree.”", fb:"Criterion, evidence, suggestion. " + M8 },
            { t:"“Use more colours.”", fb:"Criterion, evidence, suggestion. " + M8 }] },
        { id:"q4", goal:[3, 6], prompt:"B’s strongest point?",
          choices:[
            { t:"Analysis matches the question, with a residual check", ok:true, fb:"Right. Scatter plot, `r`, line and residual plot fit a relationship question." },
            { t:"It has the most data", fb:"Scatter plot, `r`, line and residual plot fit a relationship question." },
            { t:"It has a positive `r`", fb:"Scatter plot, `r`, line and residual plot fit a relationship question." },
            { t:"It found cause", fb:"Scatter plot, `r`, line and residual plot fit a relationship question." }] }
      ]
    }
  },
  practice:{
    intro:"Three stages of an investigation. If you get stuck, each item has three levels of help: a small hint, a bigger hint, then the worked solution. Use only as much as you need.",
    activities:[
      { id:"sort", type:"sorter", title:"Stage 1: question and plan", summary:"Stage 1: question and plan", goal:[1, 2], noun:"question", txt:true,
        instruction:"Tap a question, then tap the box it belongs in.",
        boxes:[{ id:"inv", label:"Investigable as written" }, { id:"fix", label:"Needs a fix" }],
        items:[
          { id:"i1", t:"“Is there a relationship between hours of part-time work and mark for Grade 12 students at our school?”", answer:"inv",
            why:"Two measurable variables, clear population.", wrong:{ fix:"Two measurable variables, clear population: it’s investigable as written." },
            hints:["Are the variables measurable?", "Does the population match the data?", "Investigable as written: two measurable variables, clear population."] },
          { id:"i2", t:"“Is pizza the best food?”", answer:"fix",
            why:"Opinion: no measurable variable.", wrong:{ inv:"Opinion: no measurable variable. " + M1 },
            hints:["Are the variables measurable?", "Does the population match the data?", "Needs a fix: it’s an opinion with no measurable variable."] },
          { id:"i3", t:"“Do students who bike to school and students who take the bus differ in commute time?”", answer:"inv",
            why:"Group and numerical variable.", wrong:{ fix:"Group (bike or bus) and a numerical variable (commute time): it’s investigable." },
            hints:["Are the variables measurable?", "Does the population match the data?", "Investigable as written: a group and a numerical variable."] },
          { id:"i4", t:"“Why do teens like music?”", answer:"fix",
            why:"‘Why’ needs a measurable variable: try ‘hours of music per day vs …’.", wrong:{ inv:"‘Why’ needs a measurable variable: try ‘hours of music per day vs …’." },
            hints:["Are the variables measurable?", "Does the population match the data?", "Needs a fix: ‘why’ needs a measurable variable, such as hours of music per day."] },
          { id:"i5", t:"“Is there a relationship between temperature and soup sales for all Canadians?” (M2 data)", answer:"fix",
            why:"The data are 20 days at one model cafeteria.", wrong:{ inv:"The data are 20 days at one model cafeteria. " + M5 },
            hints:["Are the variables measurable?", "Does the population match the data?", "Needs a fix: the data are 20 days at one model cafeteria, not all Canadians."] },
          { id:"i6", t:"“Do players and non-players of school sports differ in weekly screen time, for the 20 model students?”", answer:"inv",
            why:"It matches M1.", wrong:{ fix:"It matches M1: a group, a numerical variable and the right population." },
            hints:["Are the variables measurable?", "Does the population match the data?", "Investigable as written: it matches M1."] },
          { id:"i7", t:"“Does social media cause anxiety?” (using a survey)", answer:"fix",
            why:"A survey can’t show cause. Rephrase as ‘Is there a relationship between …?’", wrong:{ inv:"A survey can’t show cause. Rephrase as ‘Is there a relationship between …?’" },
            hints:["Are the variables measurable?", "Does the population match the data?", "Needs a fix: a survey can’t show cause, so ask about a relationship."] },
          { id:"i8", t:"“What is the distribution of sleep hours for the 20 model students?”", answer:"inv",
            why:"A one-variable question: histogram and summaries.", wrong:{ fix:"A one-variable question is investigable too: histogram and summaries." },
            hints:["Are the variables measurable?", "Does the population match the data?", "Investigable as written: a one-variable question (histogram and summaries)."] }
        ],
        followUp:{ prompt:"Plan follow-up for question 1 (not scored): which sampling method would represent the whole grade?",
          options:[
            { t:"Stratified random sample by homeroom", ok:true, why:"Every homeroom is represented, and chance picks the students." },
            { t:"Ask my friends at lunch", why:"A convenience sample represents only itself." },
            { t:"Post a voluntary online poll", why:"Volunteers choose themselves, so the sample may not represent the grade." },
            { t:"Survey one Grade 12 class", why:"One class may differ from the rest of the grade." }],
          prompt2:"Would the data be primary?",
          options2:[
            { t:"Yes: I’d collect it myself", ok:true, why:"You collect it, for your question: primary data." },
            { t:"No: it would be secondary", why:"You’d collect it yourself, so it’s primary." }] } },
      { id:"analysis", type:"custom", title:"Stage 2: analysis", summary:"Stage 2: analysis", goal:[3, 4], star:true,
        instruction:"Choose, calculate and interpret. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        how:"Choose or type your answer, then press Check.",
        items:[
          { id:"a1", kind:"multi", goal:3, prompt:"Question: relationship between sleep and mark (M1). Which three items are required?",
            options:[{ t:"Scatter plot", ok:true }, { t:"`r`", ok:true }, { t:"Line of best fit", ok:true },
              { t:"Side-by-side box plots", why:"Box plots compare groups. " + M2 }, { t:"Histogram of marks", why:"A histogram shows one variable; your question links two." }, { t:"Circle graph", why:"Circle graphs show parts of a whole." }],
            general:"A relationship needs its pattern (scatter plot), its strength (`r`) and a line of best fit.",
            why:"Scatter plot, `r` and line of best fit: pattern, strength and line.",
            hints:["Two numerical variables: what shows a relationship?", "Pattern, strength, line.", "Scatter plot, `r`, line of best fit."] },
          { id:"a2", kind:"chips", goal:4, prompt:"M1 sleep vs mark: `r = 0.920`. Strength and direction?",
            options:[{ t:"Strong positive", ok:true }, { t:"Moderate positive", why:"0.92 ≥ 0.67, so it’s strong." }, { t:"Strong negative", why:"`r` is positive, so the direction is positive." }, { t:"Weak positive", why:"0.92 ≥ 0.67 and positive." }],
            why:"0.92 ≥ 0.67 and positive.",
            hints:["Read the sign, then the size.", "|0.920| ≥ 0.67.", "Strong positive."] },
          { id:"a3", kind:"num", goal:3, prompt:"M2: use `ŷ = 1.15x + 15.68` to predict cold drinks at 20 °C, to the nearest whole drink.", answer:39, label:"Cold drinks:",
            wrong:[{ match:38.68, fb:"Round to the nearest whole drink." }, { match:23, fb:"Add the intercept, 15.68." }, { match:16, fb:"That’s the intercept, the prediction at 0 °C." }, { match:337, fb:"Multiply the slope by 20 first, then add 15.68." }],
            general:"Substitute `x = 20`: multiply the slope by 20, then add 15.68.",
            why:"1.15 × 20 = 23; 23 + 15.68 = 38.68.",
            hints:["Substitute `x = 20`.", "1.15 × 20 = 23.", "23 + 15.68 = 38.68, so about 39 drinks."] },
          { id:"a4", kind:"chips", goal:4, star:true, prompt:"Sport vs mark (M1): medians 77 and 70.5, IQRs 8 and 8. Which conclusion is best?",
            options:[{ t:"Players tended to score higher (median about 6.5 points higher), but the middle halves overlap from 73 to 77", ok:true },
              { t:"Players had a higher median mark", why:"Mention the overlap and spread. " + M6 },
              { t:"There is no difference, because the boxes overlap", why:"The centres differ; overlap means the difference isn’t clear-cut." },
              { t:"Playing a sport raises marks by 6.5 points", why:M4 }],
            why:"Higher centre, big overlap: a tendency, not a clear separation.",
            hints:["Compare centres, then spreads.", "IQRs: 73–81 vs 69–77.", "Higher centre, big overlap: a tendency, not a clear separation."] },
          { id:"a5", kind:"chips", goal:4, star:true, prompt:"M1: sport players averaged 4.0 h of screen time; non-players 5.1 h. Why does this matter for the sport vs mark comparison?",
            options:[{ t:"Screen time could be a hidden variable linked to both sport and marks", ok:true },
              { t:"It’s just an interesting extra fact", why:"Not just trivia: it’s a possible common cause." },
              { t:"It proves that sport lowers screen time", why:"Observational data can’t prove cause. " + M4 },
              { t:"It means the mark comparison is wrong", why:"The comparison still stands; screen time is a possible common cause to name as a limitation." }],
            why:"Screen time differs between the groups and is linked to marks, so it could explain part of the gap.",
            hints:["Is screen time linked to marks in M1?", "Yes: `r = -0.86` for screen time vs mark.", "Screen time could be a hidden variable linked to both sport and marks."] },
          { id:"a6", kind:"textchips", goal:4, star:true, prompt:"M2: soup vs drinks `r = -0.979`. Enter the variable you’d colour by to test a common cause, then choose the expected within-group pattern.",
            answer:"temperature", label:"Colour by:", pickLabel:"Within narrow temperature bands:",
            textWrong:"Which variable could drive both soup sales and cold-drink sales?",
            options:[{ t:"The soup–drinks link weakens", ok:true },
              { t:"The soup–drinks link gets even stronger", why:"If temperature drives both, holding it nearly fixed removes most of the link." },
              { t:"Soup and drinks rise together", why:"With temperature held nearly fixed, there’s little left to link them." },
              { t:"Nothing changes: `r` stays −0.979", why:"Temperature drives both (module 38); fixing it changes the picture." }],
            why:"Temperature drives both (module 38). Within narrow temperature bands, the soup–drinks link weakens.",
            hints:["What changes from day to day that affects both?", "Hot days: more drinks, less soup.", "Temperature; within narrow temperature bands, the soup–drinks link weakens."] }
        ] },
      { id:"spot", type:"spot", title:"Stage 3: conclusion and limitations", summary:"Spot the error", student:"Orla", how:"", goal:[4, 5],
        instruction:"Orla made one mistake in each report section. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Conclusion for “Is there a relationship between screen time and mark for these 20 model students?”",
            steps:["`r = -0.86`, so the linear relationship is strong and negative.", "The line `ŷ = -2.81x + 87.20` predicts about 2.8 fewer points per extra hour.", "Therefore cutting screen time by 1 hour will raise a student’s mark by 2.8 points.", "Schools should limit screen time."],
            answer:2,
            stepFb:["Correct.", "Correct interpretation of the slope.", "", "Step 4 depends on step 3. The mistake is earlier."],
            fixes:[
              { t:"These are observational model data: screen time is <em>associated</em> with lower marks, but a hidden variable such as sleep or homework load could explain both. An experiment would be needed to test cause.", ok:true, why:"Association, not cause." },
              { t:"Use `r^2` instead: 74% of marks are caused by screen time.", why:"`r^2` is variation explained, not causation." },
              { t:"The relationship is moderate, not strong.", why:"0.86 is strong." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["What type of study produced these data?", "Observational: no one was assigned screen time.", "Association, not cause."] },
          { id:"e2", goal:5, task:"Limitations section for the soup investigation (M2).",
            steps:["The data cover only 20 days at one cafeteria.", "Menu changes and holidays weren’t recorded.", "Because `r = -0.991` is so strong, the results apply to every school cafeteria in Canada.", "Further study: a full year at several schools."],
            answer:2,
            stepFb:["Good: sample size and scope.", "Good: possible hidden variables.", "", "Step 4 is a good idea but contradicts step 3. The mistake is earlier."],
            fixes:[
              { t:"A strong `r` in one cafeteria doesn’t make the sample representative. The results describe these 20 model days; other schools may differ.", ok:true, why:"Don’t generalize beyond the sample." },
              { t:"Remove the coldest days.", why:"Don’t remove data to tidy a result." },
              { t:"`r = -0.991` means 99.1% of soup sales are explained.", why:"`r^2 = 0.98`, and it’s still only this cafeteria." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Who or what do the data represent?", "20 days, one cafeteria.", "Don’t generalize beyond the sample."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What question did you investigate, and why did it interest you? Did the data surprise you?" },
      { id:"j2", q:"In your own words, explain how your question decided your graphs and summaries." },
      { id:"j3", q:"Explain to a classmate the most important limitation of your investigation and how you’d fix it with more time." },
      { id:"j4", q:"Rate your report against the five criteria from Part 3. Which criterion is weakest, and what will you change before you present?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"You survey 50 students yourself for your investigation. That’s…", options:[
          { t:"primary data", ok:true, why:"You collected it yourself, for your question." },
          { t:"secondary data", why:"You collected it yourself." },
          { t:"experimental data", why:"Nothing was assigned." },
          { t:"census data", why:"A census includes everyone in the population." }] },
        b:{ prompt:"In “a survey of 50 students from a school of 900”, the 900 students are the…", options:[
          { t:"population", ok:true, why:"The whole group you want to describe." },
          { t:"sample", why:"The 50 are the sample." },
          { t:"variable", why:"A variable is what’s measured." },
          { t:"parameter", why:"A parameter is a number describing the population." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which question is investigable with data?", options:[
          { t:"“Is there a relationship between hours of sleep and reaction time for Grade 12 students at our school?”", ok:true, why:"Two measurable variables and a clear population." },
          { t:"“Is sleep important?”", why:"Too vague to measure. " + M1 },
          { t:"“Why do people dream?”", why:"Not answerable with your data. " + M1 },
          { t:"“Should school start later?”", why:"A value judgement. " + M1 }] },
        b:{ prompt:"Which variable is categorical?", options:[
          { t:"Type of transportation to school", ok:true, why:"Its values are groups (bus, bike, car, walk)." },
          { t:"Commute time (min)", why:"Numerical." },
          { t:"Distance (km)", why:"Numerical." },
          { t:"Number of stops", why:"Numerical (discrete)." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which belongs in a report’s limitations section?", options:[
          { t:"“The sample was 20 students from one school, so results may not represent other schools.”", ok:true, why:"A specific limitation: sample size and representativeness." },
          { t:"“`r = -0.86`.”", why:"That’s a result." },
          { t:"“I enjoyed this project.”", why:"That’s reflection." },
          { t:"“The scatter plot of screen time vs mark.”", why:"That’s analysis." }] },
        b:{ prompt:"An actuary is a professional who…", options:[
          { t:"uses probability and statistics to estimate risk, e.g. for insurance and pensions", ok:true, why:"Actuaries price risk with data." },
          { t:"designs survey questions only", why:"That’s part of survey research." },
          { t:"grades students’ investigations", why:"That’s a teacher." },
          { t:"writes computer games", why:"Not a data-management role." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Question: “Is there a relationship between daily high temperature and cold drinks sold?” Which analysis fits?", options:[
          { t:"Scatter plot, `r` and a line of best fit (with a residual plot)", ok:true, why:"Two numerical variables: pattern, strength and line." },
          { t:"Side-by-side box plots", why:M2 },
          { t:"A circle graph of drinks", why:M2 },
          { t:"A histogram of temperature only", why:M2 }] },
        b:{ prompt:"Question: “Do students who bike and students who bus differ in commute time?” Which analysis fits?", options:[
          { t:"Side-by-side box plots, with a centre and a spread for each group", ok:true, why:"A numerical variable across two groups." },
          { t:"Scatter plot and `r`", why:M2 },
          { t:"A line of best fit", why:M2 },
          { t:"A circle graph of transportation type", why:"That shows group sizes, not commute times. " + M2 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"M1: screen time vs mark, `r = -0.86`, `n = 20` model students. Which conclusion is best?", options:[
          { t:"“A strong negative association: students with more screen time tended to have lower marks.”", ok:true, why:"|−0.86| ≥ 0.67, negative, and association language." },
          { t:"“A moderate negative association.”", why:M3 },
          { t:"“More screen time causes lower marks.”", why:M4 },
          { t:"“No relationship, because `r` is negative.”", why:M3 }] },
        b:{ prompt:"M1: sport players’ median mark 77, non-players’ 70.5; both IQRs 8; boxes overlap from 73 to 77. Which conclusion is best?", options:[
          { t:"“Sport players tended to have higher marks, but the distributions overlap a lot, and the data are observational.”", ok:true, why:"Higher centre, big overlap, and no causal claim." },
          { t:"“Playing sports raises marks by 6.5 points.”", why:M4 },
          { t:"“There’s no difference, because the boxes overlap.”", why:"The centres differ; overlap means the difference isn’t clear-cut." },
          { t:"“Every sport player scored higher than every non-player.”", why:M6 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"To study screen time of all Ontario teens, a student posts a survey on a gaming forum. The main problem?", options:[
          { t:"A voluntary-response sample from gamers over-represents heavy screen users", ok:true, why:"Who answers decides the result: this sample leans toward heavy screen users." },
          { t:"The sample is too random.", why:"It isn’t random at all." },
          { t:"Screen time can’t be measured.", why:"It can be self-reported or tracked." },
          { t:"Nothing, if 500 people respond.", why:"Size doesn’t fix bias. " + M5 }] },
        b:{ prompt:"A survey asks, “You get enough sleep, don’t you?” What kind of bias does this cause?", options:[
          { t:"Response bias from a leading question", ok:true, why:"The wording pushes people toward “yes”." },
          { t:"Non-response bias", why:"That’s when many people don’t respond." },
          { t:"Sampling bias", why:"That’s about who is chosen." },
          { t:"No bias", why:"The wording pushes a yes." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"M2: temperature vs soup, `r = -0.991`. Which conclusion is clearest and most accurate?", options:[
          { t:"“At this cafeteria, colder days were strongly associated with more soup sold (`r = -0.99`).”", ok:true, why:"Strength, direction, association language and the right scope." },
          { t:"“Cold weather causes soup sales everywhere.”", why:M4 + " " + M5 },
          { t:"“Soup and temperature are 99% the same.”", why:"`r` isn’t a percentage of sameness." },
          { t:"“There is a weak relationship.”", why:M3 }] },
        b:{ prompt:"Which limitation statement is most useful?", options:[
          { t:"“Data come from 20 days at one cafeteria, and menu changes weren’t recorded, so other factors may have affected sales.”", ok:true, why:"Specific: scope, and a possible hidden variable." },
          { t:"“There might have been human error.”", why:"Name the specific risk. " + M7 },
          { t:"“The data could be wrong.”", why:M7 },
          { t:"“None: `r` is very strong.”", why:M7 }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which graph best shows a relationship between two numerical variables?", options:[
          { t:"Scatter plot", ok:true, why:"Each individual is one (`x`, `y`) point." },
          { t:"Circle graph", why:M2 },
          { t:"Side-by-side box plots", why:"Those compare groups. " + M2 },
          { t:"Pictograph", why:"It shows counts of categories." }] },
        b:{ prompt:"Which graph best compares one numerical variable across two groups?", options:[
          { t:"Side-by-side box plots", ok:true, why:"They show each group’s centre, spread and overlap." },
          { t:"Scatter plot", why:M2 },
          { t:"Circle graph", why:M2 },
          { t:"Line graph", why:"There’s no time order." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"M2: `ŷ = -1.34x + 52.41` models soup vs temperature (−8 °C to 27 °C). Predict soup sold at 16 °C, to the nearest bowl.", options:[
          { t:"31", ok:true, why:"−21.44 + 52.41 = 30.97." },
          { t:"74", why:"The slope is negative: subtract." },
          { t:"21", why:"That’s only the −1.34 × 16 part." },
          { t:"52", why:"That’s the intercept, the prediction at 0 °C." }] },
        b:{ prompt:"M2: `ŷ = 1.15x + 15.68` models cold drinks vs temperature. Predict at 20 °C, to the nearest drink.", options:[
          { t:"39", ok:true, why:"23 + 15.68 = 38.68." },
          { t:"23", why:"Add 15.68." },
          { t:"16", why:"That’s the intercept." },
          { t:"337", why:"That adds the slope and intercept first (16.83), then multiplies by 20." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A classmate concludes from M1: “Screen time causes lower marks for Ontario teens (`r = -0.86`).” Which critique is most constructive?", options:[
          { t:"“Your `r` shows a strong association, but the data are 20 observational model students. Say ‘associated with’, limit the claim to this group, and name a possible hidden variable like sleep.”", ok:true, why:"Criterion, evidence and a specific improvement." },
          { t:"“Your conclusion is wrong.”", why:"Name the criterion and a fix. " + M8 },
          { t:"“Use a bigger font.”", why:"Not about the mathematics. " + M8 },
          { t:"“Great work, no changes needed.”", why:M8 }] },
        b:{ prompt:"A classmate surveyed 12 friends and concluded that most Ontario students prefer online classes. Which critique is most constructive?", options:[
          { t:"“Twelve friends is a small convenience sample. Use a random sample from several schools before generalizing to Ontario.”", ok:true, why:"Criterion, evidence and a fix. " + M5 },
          { t:"“Online classes are bad.”", why:"That’s opinion, not critique." },
          { t:"“You should have used a circle graph.”", why:"The graph isn’t the main problem." },
          { t:"“Ask more friends.”", why:"More friends is still a convenience sample. " + M5 }] } }
    ]
  },
  task:{
    title:"Investigation report builder", summary:"Investigation report",
    statement:"<p>Build your investigation report. Use M1, M2 or your own data (at least 15 rows). There are many good reports. The checks make sure yours says only what your evidence supports.</p>" +
      "<p class=\"tiny muted\">Your question, plan, analysis and conclusion come from the planner in Explore. Add an introduction, an explanation and a further-investigation idea here.</p>",
    checks:["Investigable question", "Data source described", "Right summaries", "Right graph", "Conclusion fits the evidence", "Specific limitations", "Explained in words"],
    tips:["Match your template to the variable types, and your population to your data.",
      "Built-in data sets are secondary; data you gathered yourself is primary.",
      "Relationships need `r` and a line; groups need a centre and a spread for each group.",
      "Relationship → scatter plot; groups → side-by-side box plots.",
      "Read `r`: |`r`| decides the strength word. Observational data → ‘is associated with’.",
      "Name the most likely hidden variable and one other limitation.",
      "Explain what the numbers mean, in your own words."],
    explainPrompt:"Explanation: what your summaries show (at least 50 words)",
    explainLabel:"Explanation",
    vocab:"Use the words sample, correlation or median, strength of evidence, limitation and hidden variable.",
    checkLabel:"Check my report",
    success:"Your report passes all 7 checks.",
    more:"There’s more than one good investigation. Try a different question or data set and compare what each can and can’t tell you."
  },
  cards:[
    ["Investigation cycle", "Question → plan → data → analysis → conclusion → report (→ new questions)."],
    ["Investigable question", "Measurable variables and a population your data represent."],
    ["Primary vs secondary data", "Primary: you collect it. Secondary: someone else did."],
    ["Relationship question", "Scatter plot, `r`, line of best fit (and a residual plot)."],
    ["Group comparison", "Side-by-side box plots; a centre and a spread for each group."],
    ["Strength words", "|`r`| ≥ 0.67 strong; 0.33–0.67 moderate; &lt; 0.33 weak."],
    ["Association language", "“Is associated with” / “is linked to” for observational data."],
    ["Generalizing", "Conclusions reach only the population the sample represents."],
    ["Specific limitations", "Sample size, representativeness, hidden variables, measurement, model data."],
    ["Constructive critique", "Criterion + evidence + suggestion."],
    ["Overlapping boxes", "Different centres with big overlap: a tendency, not a clean separation."],
    ["Careers using data", "Statisticians, actuaries, epidemiologists, market researchers, data analysts."]
  ]
};
