// HFA4U 13 Cancer & Nutrition. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/13-cancer-nutrition.md
// Teacher notes: lines marked VERIFY carry the plan's "verify" flags (students see the plan's wording without them) and every
// value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan): population patterns only; risk numbers are model values, never a personal estimate; kind language and no
// blame (most cancers are not anyone's fault); health information, not advice; no individual supplement advice.

const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";
// VERIFY: Kids Help Phone numbers (course plan §2 support line). module-written: the plan's Reflect note ends "Talk to someone you
// trust (course plan §2 support line)"; the eating-disorder part of that line (NEDIC) doesn't fit this module, so only Kids Help
// Phone is named.
const SUPPORT_TXT = "If cancer touches your life or your family’s, it’s okay to step away and come back. Talk to someone you trust, or contact Kids Help Phone (<span class=\"nw\">1-800-668-6868</span>, text CONNECT to <span class=\"nw\">686868</span>).";

// Misconception core sentences (plan §3). VERIFY: M1 (risk sizes) and M4 (beta-carotene trials).
const M1 = "IARC groups rate how strong the evidence is, not how big the risk is. Processed meat and tobacco are both Group 1, but their risks differ hugely.";
const M2 = "An 18% higher relative risk on a 5-in-100 baseline is about 6 in 100.";
const M3 = "People who eat more of a food may differ in many ways. A trial tests cause.";
const M4 = "High-dose beta-carotene supplements raised lung cancer risk in trials among people who smoked.";
const M5 = "Many factors, including genes, age and chance, play a role. No one is to blame for their cancer.";
const M6 = "Patterns over years matter; no single food causes or cures cancer.";
const M7 = "During treatment, needs can rise (energy, protein) and food safety matters more. A dietitian individualizes this.";
// module-written lead-in where the plan names (M4) for a claim that isn't about beta-carotene
const M4N = "“Natural” isn’t proof that something is safe or works. " + M4;
const M2R = "That reads the relative change as an absolute one. " + M2;   // module-written lead-in for (M2) on other numbers

// VERIFY: every reference below (authors, years, titles, volume and page numbers).
const REFS = '<ul class="hfa-refs">' +
  "<li>Canadian Cancer Society. (n.d.). <i>Reduce your risk</i>. Canadian Cancer Society.</li>" +
  "<li>International Agency for Research on Cancer. (2015). <i>IARC Monographs evaluate consumption of red meat and processed meat</i> (Press Release No. 240). World Health Organization.</li>" +
  "<li>Omenn, G. S., Goodman, G. E., Thornquist, M. D., Balmes, J., Cullen, M. R., Glass, A., Keogh, J. P., Meyskens, F. L., Valanis, B., Williams, J. H., Barnhart, S., &amp; Hammar, S. (1996). Effects of a combination of beta carotene and vitamin A on lung cancer and cardiovascular disease. <i>New England Journal of Medicine, 334</i>(18), 1150–1155.</li>" +
  "<li>The Alpha-Tocopherol, Beta Carotene Cancer Prevention Study Group. (1994). The effect of vitamin E and beta carotene on the incidence of lung cancer and other cancers in male smokers. <i>New England Journal of Medicine, 330</i>(15), 1029–1035.</li>" +
  "<li>World Cancer Research Fund &amp; American Institute for Cancer Research. (2018). <i>Diet, nutrition, physical activity and cancer: A global perspective</i> (Continuous Update Project Expert Report).</li>" +
  "</ul>";

// Sorter hints (plan: 1 and 2 shared; 3 = the answer)
const SH = ["What rung does its evidence reach?", "Expert reviews → well supported; one study → limited; contradicted by trials → not supported."];
const B1 = "Well supported.", B2 = "Mixed or limited evidence.", B3 = "Not supported or contradicted.";

export default {
  id:"13-cancer-nutrition",
  kind:"topic",
  title:"Cancer and nutrition",
  topic:"Cancer & Nutrition",
  readyTopic:"cancer and nutrition",
  hero:{
    headline:"How strong is the evidence?",
    text:"Nutrition and cancer is full of bold claims. Some are backed by <strong>reviews of many studies</strong>; others rest on <strong>one mouse study</strong> or a <strong>testimonial</strong>. Learn to climb the evidence ladder, to tell <strong>relative risk</strong> from <strong>absolute risk</strong>, and to see how nutrition supports people <strong>during treatment</strong>.",
    // plan: the standard line, plus the close-to-home line and the course plan §2 health-information line
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later. If this topic is close to home for you, take it at your own pace. " + ADVICE,
    fig:{ html:'<div class="cn-hero" id="cn-hero"></div>', caption:"" },
    // VERIFY: (IARC, 2015) on the second card's stamp
    aria:"A ladder with five rungs, labelled from bottom to top: Someone said so, Lab dish or animal study, Observational study, Randomized trial, Review of many studies. A headline card, “Berry powder fights cancer!”, hovers beside the lowest rung, then climbs and stops at rung 2 with the stamp “Lab study only”. A second card, “Processed meat linked to colorectal cancer”, climbs to rung 5 with the stamp “Expert review (IARC, 2015)”.",
    caption:"Same newspaper, very different evidence.",
    cards:[
      { lines:["Berry powder", "fights cancer!"], to:2, stamp:"Lab study only" },
      { lines:["Processed meat linked", "to colorectal cancer"], to:5, stamp:"Expert review (IARC, 2015)" }
    ]
  },
  support:SUPPORT_TXT,
  advice:ADVICE,
  goals:[
    "I can describe which eating-related factors are linked to cancer risk, and how strong the evidence is.",
    "I can rank kinds of evidence (anecdote, lab, observational, trial, review) and explain what each can show.",
    "I can convert relative risk into absolute risk and explain why both matter.",
    "I can explain how cancer and its treatment change a person’s nutritional needs.",
    "I can evaluate nutrition-and-cancer claims in headlines and ads using evidence and respectful language."
  ],
  start:{
    // module-written: states the module rules plainly (plan §1 module rules; §6 risk 1)
    blocks:[{ title:"Before you start", html:"<p>Cancer touches many families, so this module uses careful words. It looks at <strong>patterns in large groups of people</strong>, never at any one person, and every risk number in it is a <strong>model value</strong>, not anyone’s personal risk. Cancer has many causes, including genes, age and chance. <strong>Most cancers are not anyone’s fault.</strong></p><p class=\"tiny muted\">This is health information, not advice, and it gives no supplement advice for any person. " + ADVICE + "</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Fibre and food sources", goal:1,
          prompt:"Which food is a whole grain?",
          options:[
            { t:"Brown rice", ok:true, why:"It keeps the bran and germ." },
            { t:"White rice", why:"The bran is removed." },
            { t:"White bread", why:"Refined flour." },
            { t:"Rice cakes from white rice", why:"Puffed refined grain." }],
          hints:["Whole grains keep all three parts.", "Bran, germ, endosperm.", "Brown rice."] },
        { id:"w2", skill:"Fibre and food sources", goal:1,
          prompt:"Which is a processed meat?",
          options:[
            { t:"Bacon", ok:true, why:"Cured and smoked." },
            { t:"Fresh chicken breast", why:"Unprocessed poultry." },
            { t:"A fresh beef steak", why:"Red meat, but not processed." },
            { t:"Lentils", why:"Plant protein." }],
          hints:["Processed means preserved by curing, salting, smoking or additives.", "Think deli meats.", "Bacon."] },
        { id:"w3", skill:"Study types", goal:2,
          prompt:"Researchers randomly assign people to two groups and compare outcomes. This is a…",
          options:[
            // module-written: the plan gives no feedback line for the right answer
            { t:"Randomized controlled trial", ok:true, why:"The researchers assign the groups by chance." },
            { t:"Observational study", why:"Observational studies don’t assign." },
            { t:"Case report", why:"That’s one patient." },
            { t:"Lab study", why:"Lab studies use cells or animals." }],
          hints:["Who decides the group?", "The researchers, by chance.", "RCT."] },
        { id:"w4", skill:"Study types", goal:2,
          prompt:"Why can an observational study not prove cause?",
          options:[
            { t:"The groups may differ in other ways that affect the outcome", ok:true, why:"Confounding." },
            { t:"Observational studies use too few people", why:"Many are very large." },
            { t:"They’re always done on animals", why:"They follow people." },
            { t:"They never measure outcomes", why:"They do." }],
          hints:["Did the researchers choose who ate what?", "No: people chose.", "Other differences could explain the result."] },
        { id:"w5", skill:"Percentages", goal:3,
          prompt:"What is 20% of 5?",
          options:[
            { t:"1", ok:true, why:"20% is one-fifth, and one-fifth of 5 is 1." },   // module-written why
            { t:"4", why:"That’s 80% of 5." },
            { t:"0.2", why:"That’s 20% of 1." },
            { t:"25", why:"That’s 5 × 5." }],
          hints:["20% = 1/5.", "One-fifth of 5.", "1."] },
        { id:"w6", skill:"Percentages", goal:3,
          prompt:"A risk goes from 4 in 100 to 3 in 100. What’s the relative decrease?",
          options:[
            { t:"25%", ok:true, why:"1 ÷ 4." },
            { t:"1%", why:"That’s the absolute change, in percentage points." },
            { t:"75%", why:"That’s 3 ÷ 4." },
            { t:"33%", why:"That’s 1 ÷ 3." }],
          hints:["Change ÷ starting value.", "1 ÷ 4.", "25%."] }
      ],
      refreshers:{
        "Fibre and food sources":"Whole grains keep bran and germ. Processed meats are preserved by curing, salting, smoking or additives.",
        "Study types":"Observational studies watch; trials assign. Only randomized trials can show cause directly.",
        "Percentages":"Relative change = change ÷ starting value. Absolute change = the difference itself."
      }
    }
  },
  explore:{
    heading:"Evidence ladder",
    // plan intro + M5 (the plan catches M5 in the Explore intro)
    intro:"Place each claim on the rung its evidence reaches, translate risks into people out of 100, and design a fair test. Numbers in the risk translator are <strong>model values</strong>. " + M5,
    modes:[{ id:"ladder", t:"Ladder" }, { id:"risk", t:"Risk translator" }, { id:"design", t:"Study designer" }],
    rungs:[
      // module-written "can show" lines, from the plan's overview (evidence ladder)
      { n:1, t:"Someone said so", show:"One person’s story. It can’t show what caused anything." },
      { n:2, t:"Lab dish or animal study", show:"Cells or animals. It can guide research, but it doesn’t show effects in people." },
      { n:3, t:"Observational study", show:"An association in people who chose their own food and habits." },
      { n:4, t:"Randomized trial", show:"A test of cause: researchers assign the groups by chance." },
      { n:5, t:"Review of many studies", show:"Expert panels (IARC, WCRF/AICR) weigh all the evidence together." }
    ],
    // VERIFY: each card's evidence summary (plan: "verify each before release")
    cards:[
      { id:"c1", t:"“My aunt beat cancer with a juice cleanse”", note:"One person’s story", answer:1 },
      { id:"c2", t:"“Berry extract slowed tumour cells in a dish”", note:"Cells in a lab", answer:2 },
      { id:"c3", t:"“Green tea compound shrank tumours in mice”", note:"Mice", answer:2 },
      { id:"c4", t:"“People eating more fibre had less colorectal cancer”", note:"Large cohort studies", answer:3 },
      { id:"c5", t:"“Beta-carotene supplements raised lung cancer in people who smoked”", note:"Randomized trials (1990s)", answer:4 },
      { id:"c6", t:"“Processed meat causes colorectal cancer (Group 1)”", note:"IARC expert review, 2015", answer:5 },
      { id:"c7", t:"“Alcohol is a cause of several cancers”", note:"IARC and WCRF/AICR reviews", answer:5 },
      { id:"c8", t:"“People who drink Sunleaf tea had less cancer”", note:"One observational study", fict:"Sunleaf tea is a fictional product.", answer:3 }
    ],
    // P1: the tobacco card (module-written wording) and the risk-size bar.
    // VERIFY: model values for the bar. Processed meat: about 18% higher colorectal cancer risk per 50 g a day (IARC, 2015).
    // Tobacco: "about 20 times" is a module-supplied illustrative value for lung cancer in people who smoke (published estimates
    // vary widely); it is labelled model data on screen.
    tobacco:{ id:"tob", t:"“Tobacco smoking causes lung cancer (Group 1)”", note:"IARC expert review" },
    compare:{ title:"Same group, different risk sizes", tag:"Model data",
      rows:[{ t:"Processed meat and colorectal cancer", v:1.18, label:"about 1.2 × the baseline risk (18% higher)" },
            { t:"Tobacco smoking and lung cancer", v:20, label:"about 20 × the baseline risk" }],
      note:"Bars show relative risk (baseline = 1×). Both agents are Group 1: strong evidence of a cause. The risk sizes are very different." },
    // P3 reveal: the plan's "possible other differences" panel (smoking, income, exercise)
    others:{ title:"Possible other differences between tea drinkers and non-drinkers", items:["Smoking", "Income", "Exercise"], note:"Any of these could explain the drop. A trial would assign the tea." },
    surprise:"Surprise result",
    translator:{
      base:[2, 4, 5, 10, 20],
      chg:[-50, -40, -25, -20, -10, 10, 20, 25, 40, 50],
      baseLabel:"Baseline (lifetime risk per 100 people)",
      chgLabel:"Relative change",
      preset:{ base:5, chg:18, shown:"about +20%" },
      tag:"Model values"
    },
    designer:{
      claim:"“Daily berry powder lowers a cancer-risk marker in adults.”",
      // module-written: neutral "what your choice does" lines (no verdicts; the challenge check gives the feedback)
      rows:[
        { id:"design", t:"Design", options:[
          { id:"lab", t:"Lab dish", does:"Tests the powder on cells in a dish.", rung:2 },
          { id:"obs", t:"Observational", does:"Watches adults who choose for themselves whether to take the powder.", rung:3 },
          { id:"rct", t:"Randomized trial", does:"Researchers assign adults to groups by chance.", rung:4 }] },
        { id:"comp", t:"Comparison", options:[
          { id:"none", t:"None", does:"There’s no comparison group." },
          { id:"self", t:"People who chose not to", does:"Compares with people who chose not to take the powder." },
          { id:"plac", t:"Placebo or usual diet assigned at random", does:"Compares with a look-alike fake powder or usual diet, assigned at random." }] },
        { id:"blind", t:"Blinding", options:[
          { id:"none", t:"None", does:"Everyone knows who got the powder." },
          { id:"part", t:"Participants", does:"Participants don’t know their group; the people measuring the results do." },
          { id:"both", t:"Participants and assessors", does:"Neither participants nor assessors know who got what." }] },
        { id:"out", t:"Outcome", options:[
          { id:"after", t:"Chosen after seeing data", does:"The measure is picked after looking at the results." },
          { id:"adv", t:"Chosen in advance", does:"The measure is fixed before the study starts." }] },
        { id:"len", t:"Length", options:[
          { id:"2", t:"2 weeks", does:"Runs for 2 weeks." },
          { id:"8", t:"8 weeks", does:"Runs for 8 weeks." },
          { id:"12", t:"12 weeks", does:"Runs for 12 weeks." },
          { id:"24", t:"24 weeks", does:"Runs for 24 weeks." }] }
      ]
    },
    predictions:[
      { id:"p1", prompt:"Processed meat and tobacco are both IARC Group 1. Does that mean they’re equally dangerous?",
        options:[{ t:"No: Group 1 means strong evidence of a cause, not equal risk", ok:true }, { t:"Yes, same risk" }, { t:"Yes, tobacco is safer" }, { t:"No, processed meat is riskier" }],
        explain:M1 },
      { id:"p2", prompt:"About how many more people per 100?",
        options:[{ t:"About 1", ok:true }, { t:"18" }, { t:"5" }, { t:"23" }],
        explain:M2 + " (5 × 0.18 is about 1 more person per 100.)" },
      { id:"p3", prompt:"One observational study links Sunleaf tea to less cancer. Can it show the tea <em>causes</em> the drop?",
        options:[{ t:"No: tea drinkers may differ in other ways", ok:true }, { t:"Yes, if the study is large" }, { t:"Yes, because tea is natural" }, { t:"No, because tea has no effect" }],
        explain:M3 },
      { id:"p4", prompt:"Before the trials, many expected beta-carotene supplements to <em>lower</em> lung cancer risk. What did trials in people who smoked find?",
        options:[{ t:"Risk went up in the supplement groups", ok:true }, { t:"Risk went down" }, { t:"No change at all" }, { t:"Trials were never done" }],
        explain:M4 }
    ],
    challenges:[
      { id:"tc1", goal:[2], prompt:"Place all eight claim cards on the correct rungs. (Use <strong>Ladder</strong>.)",
        why:"Each card sits where its evidence reaches: who or what was studied, and whether anyone assigned the groups.",   // module-written
        hints:["Ask: who or what was studied, and did anyone assign the groups?", "Cells and mice → rung 2; people who chose their own food → rung 3.", "Reviews (IARC, WCRF) → rung 5."],
        msgs:{
          c4r5:"Several cohort studies, but placed here as observational evidence; a review would weigh them together.",
          c5r3:"Participants were randomly assigned: it’s a trial.",
          c23r4:"Cells and mice aren’t people in a trial.",
          unplaced:"Place all eight cards first: {n} still waiting in the tray.",   // module-written
          count:"{k} of 8 cards are on the right rung. For the others, ask who or what was studied." } },   // module-written
      { id:"tc2", goal:[3], prompt:"Set the translator so the absolute change is <strong>exactly +2 in 100</strong>. (Use <strong>Risk translator</strong>.)",
        why:"The same +2 in 100 can be called “+10%” or “+50%”. Relative numbers depend on the baseline.",
        banner:"The same +2 in 100 can be called “+10%” or “+50%”. Relative numbers depend on the baseline.",
        hints:["Absolute change = baseline × percent.", "Which pairs multiply to 2?", "10 × 20% = 2, for example."],
        msgs:{
          b2c50:"Half of 2 is 1.",
          b10c40:"Too many.",
          preset:"The translator is on the +18% preset. Move the relative change slider to choose your own percent.",   // module-written
          minus:"That’s 2 fewer per 100, not 2 more.",   // module-written
          other:"The absolute change is now {v} in 100. Absolute change = baseline × percent." } },   // module-written
      { id:"tc3", goal:[2], stretch:true, prompt:"Design a fair test of the claim “Daily berry powder lowers a cancer-risk marker in adults.” (Use <strong>Study designer</strong>.)",
        why:"Random assignment, a placebo, double blinding, an outcome chosen in advance and enough time: a fair test like this can show the powder caused a change.",   // module-written
        hints:["What lets you say “the powder caused it”?", "Random assignment, a fake-powder comparison, and nobody knowing who got what.", "RCT + placebo + double-blinded + outcome chosen in advance + 8 weeks or more."],
        msgs:{
          self:"Self-selection brings back confounding.",
          after:"That lets researchers pick whichever result looks best.",
          short:"Too short for a risk marker to change.",
          unset:"Make a choice in every row of the designer first.",   // module-written (and the three below)
          design:"Only a randomized trial can test cause. Cells in a dish aren’t people, and an observational study lets people choose.",
          comp:"Without a placebo or usual-diet group assigned at random, you can’t tell what would have happened anyway.",
          blind:"Blind both participants and assessors, so nobody’s expectations can sway the results." } }
    ],
    // module-written: the plan's "aha" as a closing sheet
    blocks:[{ title:"What the ladder shows", html:"<p>A <strong>scary relative number</strong> can mean a <strong>small absolute change</strong>. <strong>Evidence strength</strong> and <strong>risk size</strong> are different questions. And only <strong>fair tests</strong> show cause.</p><p>At the population level, the Canadian Cancer Society estimates that a share of cancer cases is linked to things people can change, such as tobacco, alcohol, eating and activity patterns (Canadian Cancer Society, n.d.). That’s about large groups. For any one person, cancer has many causes, including genes, age and chance.</p><p class=\"tiny muted\">" + ADVICE + "</p>" }]
  },
  part3:{
    slug:"headlines", name:"Headlines", heading:"Headline vs study",
    intro:"Compare what a headline says with what the study actually did. Tap the words that <strong>overstate</strong> the study, then fix the headline.",   // module-written
    stations:[{ id:"s1", t:"1. Three pairs" }, { id:"s2", t:"2. A real example" }, { id:"s3", t:"3. During treatment" }],
    tag:"Practice model (fictional)",
    // Station 1 (plan table). answer.req = word indices that must be tapped; answer.opt = words that may be tapped (part of the
    // overstated phrase). VERIFY: pair 2's classification note. module-written: study-summary sentences, feedback and sample fixes.
    pairs:[
      { id:"h1", words:["Coffee", "CURES", "liver", "cancer"],
        design:"Observational", study:"An observational study compared liver cancer rates. People who drank coffee had lower rates than people who didn’t. Nobody was assigned to drink coffee.",
        answer:{ req:[1], opt:[] },
        good:"“CURES” claims cause and cure from an association. An observational study can only show a link.",
        data:"Design: observational. What it can show: an association. What it can’t show: cause, or a cure.",
        sample:"Coffee drinkers had lower liver cancer rates in an observational study" },
      { id:"h2", words:["Grilled", "meat", "as", "deadly", "as", "smoking"],
        design:"IARC classification note", study:"An expert panel placed processed meat in Group 1, the same group as tobacco smoking, because the evidence that it can cause colorectal cancer is strong. Groups rate the strength of the evidence; they don’t compare how big the risks are.",
        answer:{ req:[3], opt:[2, 4, 5] },
        good:"“As deadly as” mixes up evidence strength with risk size. " + M1,
        data:"Same group means equally strong evidence of a cause. Risk sizes can differ hugely (see Explore, prediction 1).",
        sample:"Processed meat is in the same evidence group as smoking, but its risk is much smaller" },
      { id:"h3", words:["Sunleaf", "tea", "slashes", "cancer", "risk", "25%!"],
        design:"One observational study", study:"One observational study of adults: 3 in 100 daily Sunleaf tea drinkers had cancer, compared with 4 in 100 non-drinkers. (Sunleaf tea is fictional.)",
        answer:{ req:[2, 5], opt:[], miss:{ "5":"Look at the number too: is 25% a relative change or an absolute one?", "2":"Look at the verb too: does the study show the tea caused a big drop?" } },
        good:"“Slashes” overstates one observational study, and “25%” gives only the relative change. In people, it’s 4 to 3 in 100: 1 fewer person per 100.",
        data:"4 → 3 in 100. Absolute change: 1 fewer per 100. Relative change: 1 ÷ 4 = 25% lower.",
        sample:"Sunleaf tea drinkers had somewhat lower cancer rates in one study (3 vs 4 in 100)" }
    ],
    station2:{
      intro:"Your teacher will give you a real, credited headline and the study behind it (chosen because it’s a nutrition–cancer claim in the news with a linked study). Type them in, then use the same tools: tap the words that overstate the study, and write a fixed headline.",
      note:"Unscored. It goes into your results summary for your teacher."
    },
    // Station 3 (plan: nausea, taste changes, mouth sores, low appetite, higher infection risk). VERIFY: every "what can help"
    // line (module-written from typical guidance; the plan's Final A1 and A1B wording).
    station3:{
      skip:"If this station feels close to home, it’s okay to skip it or come back later.",   // module-written (plan §6: teachers may let students skip)
      effects:[
        { id:"nausea", t:"Nausea", help:"Small, frequent meals and plain foods can be easier to keep down." },
        { id:"taste", t:"Taste changes", help:"Foods may taste metallic or bland. Trying different flavours, herbs or cold foods can help." },
        { id:"sores", t:"Mouth sores", help:"Soft, moist foods are easier. Spicy, crunchy or acidic foods can hurt." },
        { id:"appetite", t:"Low appetite", help:"Small, frequent meals and snacks rich in energy and protein make each bite count." },
        { id:"infection", t:"Higher infection risk", help:"Food safety matters more: clean, separate, cook, chill, and avoid higher-risk foods such as unpasteurized products and undercooked eggs and meat." }
      ],
      needs:"<p>The body needs <strong>energy</strong> and <strong>protein</strong> to repair tissue and keep muscle during treatment, so these needs can <strong>rise</strong>, even when eating is hard. That’s why advice meant for preventing cancer (such as eating less) can be the wrong advice during treatment.</p><p><strong>Registered dietitians</strong> on the care team individualize the plan for each person, including any questions about supplements.</p>",
      q:{ prompt:"Is “eat less to stay healthy” good advice during chemotherapy?",
        choices:[{ t:"Yes", fb:"Not quite. " + M7 }, { t:"No", ok:true, fb:"Right. " + M7 }] }
    },
    blocks:[{ title:"Sources (APA 7)", html:REFS + "<p class=\"tiny muted\">" + ADVICE + "</p>" }],
    quickCheck:{
      title:"Headlines quick check", summary:"Headlines quick check",
      items:[
        { id:"q1", goal:2, prompt:"“Linked to” in an observational study means…",
          choices:[{ t:"an association", ok:true, fb:"Right. An observational study shows an association, not cause." },
                   { t:"proven cause", fb:M3 }, { t:"cure", fb:M3 }, { t:"no effect", fb:M3 }] },
        { id:"q2", goal:3, prompt:"Baseline 4 in 100, relative drop 25%. New risk?",
          choices:[{ t:"3 in 100", ok:true, fb:"Right. 4 × 0.25 = 1 fewer, so 3 in 100." },
                   { t:"1 in 100", fb:"4 × 0.25 = 1 fewer." }, { t:"25 in 100", fb:"4 × 0.25 = 1 fewer." }, { t:"2 in 100", fb:"4 × 0.25 = 1 fewer." }] },
        { id:"q3", goal:4, prompt:"During cancer treatment, which matters more than usual?",
          choices:[{ t:"food safety and enough energy and protein", ok:true, fb:"Right. " + M7 },
                   { t:"cutting calories", fb:M7 }, { t:"avoiding all fat", fb:M7 }, { t:"fasting", fb:M7 }] },
        { id:"q4", goal:5, prompt:"Which headline is most accurate?",
          choices:[{ t:"“Fibre linked to lower colorectal cancer risk in large studies”", ok:true, fb:"Right. It reports a link, names the evidence and doesn’t overstate." },
                   { t:"“Fibre cures cancer”", fb:M6 }, { t:"“Fibre is useless”", fb:M6 }, { t:"“Eat fibre or get cancer”", fb:M6 }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Supported, mixed or not supported?", summary:"Supported or not", noun:"claim", txt:true, goal:[1, 4, 5],
        instruction:"Sort each claim by how well the evidence supports it.",   // module-written
        boxes:[{ id:"b1", label:"Well supported" }, { id:"b2", label:"Mixed or limited evidence" }, { id:"b3", label:"Not supported or contradicted" }],
        // VERIFY: every placement (plan: follows WCRF/AICR or IARC summaries). module-written: the "why" lines and the
        // misplacement lines for items 2 and 3, which the plan leaves blank.
        items:[
          { id:"s1", goal:1, t:"Processed meat is linked to higher colorectal cancer risk", answer:"b1",
            why:"Expert reviews (IARC, 2015; WCRF/AICR, 2018) conclude this.", hints:SH.concat([B1]),
            wrong:{ b2:"Expert reviews conclude this. " + M1, b3:"Expert reviews conclude this. " + M1 } },
          { id:"s2", goal:1, t:"Alcohol is linked to several cancers", answer:"b1",
            why:"IARC and WCRF/AICR reviews both conclude this.", hints:SH.concat([B1]),
            wrong:{ b2:"IARC and WCRF/AICR reviews both conclude this.", b3:"IARC and WCRF/AICR reviews both conclude this." } },
          { id:"s3", goal:1, t:"Fibre-rich and whole-grain eating patterns are linked to lower colorectal cancer risk", answer:"b1",
            why:"Expert reviews rate this link as strong for colorectal cancer.", hints:SH.concat([B1]),
            wrong:{ b2:"Expert reviews rate this link as strong for colorectal cancer.", b3:"Expert reviews rate this link as strong for colorectal cancer." } },
          { id:"s4", goal:5, t:"A specific “superfood” berry prevents cancer", answer:"b3",
            why:"No single food prevents cancer, and “superfood” claims rest on lab or animal studies at best.", hints:SH.concat([B3]),
            wrong:{ b1:M6 + " " + M4N, b2:M6 + " " + M4N } },
          { id:"s5", goal:5, t:"High-dose beta-carotene supplements protect people who smoke", answer:"b3",
            why:"Trials found the opposite: risk went up.", hints:SH.concat([B3]),
            wrong:{ b1:"Trials found the opposite. " + M4, b2:"Trials found the opposite. " + M4 } },
          { id:"s6", goal:1, t:"Red meat is probably linked to colorectal cancer", answer:"b1",
            why:"Reviews rate red meat as a probable cause (Group 2A), so it counts as well supported, as “probable”.", hints:SH.concat([B1 + " (as “probable”)"]),
            wrong:{ b2:"Reviews rate it probable (Group 2A).", b3:"Reviews rate it probable (Group 2A)." } },
          { id:"s7", goal:5, t:"Sugar directly “feeds” cancer, so cutting all sugar cures it", answer:"b3",
            why:"No single food or nutrient causes or cures cancer.", hints:SH.concat([B3]),
            wrong:{ b1:M6, b2:M6 } },
          { id:"s8", goal:1, t:"Coffee is linked to lower risk of some cancers", answer:"b2",
            why:"Some observational links; not established as a cause.", hints:SH.concat([B2]),
            wrong:{ b1:"Some observational links; not established as a cause.", b3:"Some observational links; not established as a cause." } },
          { id:"s9", goal:5, t:"Alkaline diets change blood pH to prevent cancer", answer:"b3",
            why:"The body tightly controls blood pH, whatever you eat.", hints:SH.concat([B3]),
            wrong:{ b1:"The body tightly controls blood pH.", b2:"The body tightly controls blood pH." } },
          { id:"s10", goal:4, t:"People in treatment often need more protein and energy", answer:"b1",
            why:"Needs for energy and protein can rise during treatment.", hints:SH.concat([B1]),
            wrong:{ b2:M7, b3:M7 } }
        ] },
      { id:"risk", type:"custom", title:"Risk arithmetic and study critique", summary:"Risk arithmetic and critique", star:true, goal:[2, 3, 5],
        instruction:"Work out the risks, then critique the studies. Items 3 to 6 are non-routine (★).",   // module-written
        // module-written: hints for K1–K4 and K6 (the plan gives K5's), the K4 and K6 distractors and every "why" line.
        // VERIFY: nothing here is a real statistic; every number is a model value.
        items:[
          { id:"k1", kind:"num", goal:3, prompt:"Baseline 10 in 100, +20% relative. New risk?", label:"New risk:", unit:"in 100", answer:12,
            why:"10 × 0.2 = 2 more, so 12 in 100.", wrong:[{ match:30, fb:"20% of 10 is 2." }, { match:2, fb:"That’s the change. Add it to the baseline." }],
            general:"20% of 10 is 2.",
            hints:["Find 20% of the baseline first.", "20% of 10 is 2. It’s an increase, so add it.", "10 + 2 = 12 in 100."] },
          { id:"k2", kind:"num", goal:3, prompt:"Baseline 20 in 100, −25%. New risk?", label:"New risk:", unit:"in 100", answer:15,
            why:"20 × 0.25 = 5 fewer, so 15 in 100.", wrong:[], general:"25% of 20 is 5.",
            hints:["Find 25% of 20.", "25% of 20 is 5. It’s a decrease, so subtract.", "20 − 5 = 15 in 100."] },
          { id:"k3", kind:"num", goal:3, star:true, prompt:"Two headlines about the same study: “Risk up 50%!” and “Risk up 1 in 100”. What baseline makes both true?", label:"Baseline:", unit:"in 100", answer:2,
            why:"2 × 0.5 = 1, so a baseline of 2 in 100 rising to 3 in 100 is both +50% and +1 in 100.", wrong:[], general:"Absolute = baseline × 0.5 = 1.",
            hints:["Absolute change = baseline × relative change.", "baseline × 0.5 = 1.", "Baseline = 2 in 100."] },
          { id:"k4", kind:"pick1", goal:2, star:true, inquiry:true, prompt:"Study: people who ate the most fruit had less lung cancer. Name a confounder that could explain it.",
            options:[
              { id:"smoking", t:"Smoking", why:"Smokers may eat less fruit, and smoking is a major cause of lung cancer." },
              { id:"income", t:"Income", why:"Income can shape both how much fruit people buy and many other health factors." },
              { id:"exercise", t:"Exercise", why:"People who eat more fruit may also exercise more." },
              { id:"lung", t:"Lung cancer", why:"That’s the outcome being measured, not another difference between the groups." },
              { id:"fruit", t:"Fruit", why:"That’s the food being studied, not another difference between the groups." },
              { id:"size", t:"The number of people in the study", why:"Study size affects precision, but it isn’t a difference between the groups." }],
            answer:["smoking", "income", "exercise"], wrongLead:M3,
            hints:["A confounder is another difference between the groups that could also affect lung cancer.", "Think of habits or circumstances that go with eating less fruit and also affect the lungs or health.", "Smoking (also income or exercise)."] },
          { id:"k5", kind:"num2", goal:3, star:true, prompt:"A trial: 100 people take supplement X, 100 take a placebo. Cancers over 5 years: 6 vs 4. Relative change and absolute change for X?",
            fields:[{ id:"rel", label:"Relative change:", unit:"%" }, { id:"abs", label:"Absolute change:", unit:"in 100" }],
            answer:{ rel:50, abs:2 }, why:"6 vs 4: 2 more per 100; 2 ÷ 4 = 50%.", general:"6 vs 4: 2 more per 100; 2 ÷ 4 = 50%.",
            wrongRel:[{ match:33, fb:"Divide by the comparison (placebo) group: 2 ÷ 4, not 2 ÷ 6." }, { match:2, fb:"2 is the absolute change. For the relative change, divide 2 by the placebo group’s 4." }],
            hints:["Subtract for absolute.", "Divide the difference by the comparison group.", "+2 in 100; +50%."] },
          { id:"k6", kind:"pick2", goal:5, star:true, prompt:"An ad cites a mouse study to say its pill “fights cancer in humans”. Write the two biggest problems (choose two).",
            options:[
              { id:"mice", t:"Mice aren’t people", why:"Animal evidence sits on rung 2." },
              { id:"trial", t:"There’s no human trial", why:"Only a trial in people could test the claim." },
              { id:"seller", t:"It’s seller-funded: the company profits from the claim", why:"A conflict of interest is a reason for extra caution." },
              { id:"fights", t:"“Fights” overstates", why:"A mouse result can’t show anything “fights cancer in humans”." },
              { id:"capsule", t:"The pill is a capsule, not a food", why:"The form of the pill isn’t the problem with the evidence." },
              { id:"useless", t:"Mouse studies are useless for research", why:"Mouse studies can guide research; they just can’t show effects in people." }],
            answer:["mice", "trial", "seller", "fights"],
            general:"Any two of the first three earn full credit; “fights” counts with one other.",
            hints:["Ask: what was studied, and who is making the claim?", "Think about rung 2, the missing human evidence, who profits, and the wording.", "For example: mice aren’t people, and there’s no human trial."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Maeve", goal:[2, 3, 4],
        instruction:"Maeve made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          // VERIFY: the 18% figure (IARC, 2015) and the 5-in-100 model baseline
          { id:"e1", goal:3, task:"Explain the headline “Processed meat raises colorectal cancer risk 18%”.",
            steps:["“18% is a relative increase.”", "“So 18 out of every 100 people who eat it will get cancer.”", "“That’s why it’s as dangerous as smoking.”"],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 builds on an earlier mistake. Find where the mistake starts."],   // step 3 line module-written
            fixes:[
              { t:"“On a 5-in-100 baseline (model), 18% more is about 6 in 100: roughly 1 extra person per 100.”", ok:true, why:M2 },
              { t:"“18 in 100 is correct.”", why:"That confuses relative with absolute." },
              { t:"“It means 18 grams is the limit.”", why:"Not what the number means." },
              { t:"“Step 2 is correct.”", why:M2 }],
            hints:["Relative to what?", "To the baseline.", "Multiply the baseline by 0.18."] },
          { id:"e2", goal:2, task:"Evaluate: “Green tea shrinks tumours.”",
            steps:["“The source is a study in mice.”", "“Mouse studies are randomized and controlled, so they prove it works in people.”", "“So everyone should drink green tea to prevent cancer.”"],
            answer:1,
            stepFb:["Step 1 is correct: the source is a mouse study. Keep checking.", "", "Step 3 builds on an earlier mistake. Find where the mistake starts."],   // module-written
            fixes:[
              { t:"“Mouse results can guide research but don’t show effects in people; human trials are needed.”", ok:true, why:"Animal evidence sits on rung 2. It points researchers to what to test in people." },   // why module-written
              { t:"“Mice are just small people.”", why:"Biology differs." },
              { t:"“Tea is natural, so it’s safe.”", why:M4N },
              { t:"“Step 2 is correct.”", why:"Animal evidence sits on rung 2." }],
            hints:["Which rung?", "Rung 2.", "Needs human trials."] },
          { id:"e3", goal:4, task:"Advise a friend’s parent starting chemotherapy who has lost their appetite.",
            steps:["“Treatment can cause nausea and taste changes.”", "“So they should eat less and cut fat to stay healthy.”", "“A dietitian isn’t needed.”"],
            answer:1,
            stepFb:["Step 1 is correct: nausea and taste changes are common. Keep checking.", "", "Step 3 builds on an earlier mistake. Find where the mistake starts."],   // module-written
            fixes:[
              { t:"“Needs for energy and protein often rise; small, frequent meals and food safety help, and the care team’s registered dietitian can individualize a plan.”", ok:true, why:M7 },
              { t:"“Fast until treatment ends.”", why:"Risky." },
              { t:"“Take high-dose supplements.”", why:"Some can interfere with treatment; ask the care team." },
              { t:"“Step 2 is correct.”", why:M7 }],
            hints:["Is prevention advice the same as treatment needs?", "No.", "Energy and protein; dietitian."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result surprised you most: the beta-carotene trials, or how a big relative risk can be a small absolute one?" },
      { id:"j2", q:"In your own words, explain why an IARC group isn’t a measure of how dangerous something is." },
      { id:"j3", q:"Explain to a friend how to check a “superfood fights cancer” post in under a minute." },
      { id:"j4", q:"What’s still confusing about nutrition and cancer? Where could you look for trustworthy information?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        // VERIFY: K1 A (expert reviews on processed meat)
        a:{ prompt:"Which eating-related factor do expert reviews link most strongly to <strong>higher</strong> colorectal cancer risk?",
          options:[
            { t:"Processed meat", ok:true, why:"Expert reviews (IARC, 2015) classify processed meat as a cause of colorectal cancer." },
            { t:"Whole grains", why:"Linked to lower risk." },
            { t:"Leafy greens", why:"Not linked to higher risk." },
            { t:"Water", why:"No link." }] },
        b:{ prompt:"Which pattern is linked to <strong>lower</strong> colorectal cancer risk?",
          options:[
            { t:"Fibre-rich, whole-grain eating", ok:true, why:"Expert reviews link fibre and whole grains to lower colorectal cancer risk." },
            { t:"High processed-meat intake", why:"Linked to higher risk." },
            { t:"High alcohol intake", why:"Linked to higher risk." },
            { t:"High-dose beta-carotene supplements", why:M4 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What does an IARC Group 1 classification mean?",
          options:[
            { t:"There is strong evidence the agent can cause cancer in humans", ok:true, why:"Group 1 describes the strength of the evidence, not the size of the risk." },
            { t:"The agent is as dangerous as every other Group 1 agent", why:M1 },
            { t:"The agent always causes cancer", why:"Not always: it’s about the evidence of a cause." },
            { t:"The agent is safe in small amounts", why:"Not what the group says." }] },
        b:{ prompt:"Two agents are both Group 1. What can you conclude?",
          options:[
            { t:"Both have strong evidence of causing cancer; their risk sizes may differ greatly", ok:true, why:M1 },
            { t:"They carry the same risk", why:M1 },
            { t:"Neither is a real risk", why:"Wrong: Group 1 means strong evidence of a cause." },
            { t:"Only one can be Group 1", why:"Many agents are." }] } },
      { id:"k3", cat:"K", goal:1,
        // VERIFY: K3 A (beta-carotene trial results)
        a:{ prompt:"What did large trials of high-dose beta-carotene supplements find in people who smoked?",
          options:[
            { t:"Higher lung cancer rates in the supplement groups", ok:true, why:M4 },
            { t:"Lower lung cancer rates", why:M4 },
            { t:"No difference at all", why:"There was a difference." },
            { t:"The trials weren’t completed", why:"They were." }] },
        b:{ prompt:"What’s the main lesson of the beta-carotene trials?",
          options:[
            { t:"High-dose supplements can have unexpected harms; trials are needed", ok:true, why:"The expected benefit didn’t appear, and only trials revealed the harm." },
            { t:"Vegetables cause cancer", why:"No: the trials studied high-dose supplements, not foods." },
            { t:"Natural means safe", why:M4 },
            { t:"Observational studies are always right", why:M3 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Baseline risk 5 in 100. A food is linked to a 40% higher relative risk. New absolute risk?",
          options:[
            { t:"7 in 100", ok:true, why:"5 × 0.4 = 2 more." },
            { t:"45 in 100", why:M2R },
            { t:"40 in 100", why:M2R },
            { t:"5.4 in 100", why:"That’s a 0.4 increase, not 40%." }] },
        b:{ prompt:"Baseline 20 in 100, a 10% lower relative risk. New risk?",
          options:[
            { t:"18 in 100", ok:true, why:"20 × 0.1 = 2 fewer." },
            { t:"10 in 100", why:M2R },
            { t:"19.9 in 100", why:"10% of 20 is 2." },
            { t:"2 in 100", why:"That’s the change, not the new risk." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Trial: 4 cancers per 100 with placebo, 6 per 100 with supplement Y. Which statement is correct?",
          options:[
            { t:"Y was linked to 2 more cases per 100, a 50% relative increase", ok:true, why:"6 − 4 = 2 more per 100; 2 ÷ 4 = 50%." },
            { t:"Y lowered risk", why:"6 > 4." },
            { t:"2% relative increase", why:"2 ÷ 4 = 50%." },
            { t:"6% absolute increase", why:"6 − 4 = 2 per 100." }] },
        b:{ prompt:"Trial: 10 per 100 in usual care, 8 per 100 with a diet program. Correct statement?",
          options:[
            { t:"2 fewer per 100; a 20% relative decrease", ok:true, why:"10 − 8 = 2 fewer; 2 ÷ 10 = 20%." },
            { t:"2% relative", why:"2 ÷ 10 = 20%." },
            { t:"8% decrease", why:"That’s the new rate." },
            { t:"No change", why:"10 ≠ 8." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Which design best tests whether a fibre supplement lowers a colorectal cancer-risk marker?",
          options:[
            { t:"Randomly assign adults to the supplement or a placebo, blinded, with the outcome chosen in advance", ok:true, why:"Random assignment, a placebo, blinding and a pre-set outcome make it a fair test of cause." },
            { t:"Survey people who already take fibre supplements", why:M3 },
            { t:"Give the supplement to mice", why:"Rung 2 only." },
            { t:"Ask a nutrition influencer", why:"Rung 1." }] },
        b:{ prompt:"A cohort study finds people who eat more nuts have less cancer. What’s the best next step to test cause?",
          options:[
            { t:"A randomized trial assigning nut intake, with a comparison group", ok:true, why:"Assigning intake at random is what tests cause." },
            { t:"Conclude nuts prevent cancer", why:M3 },
            { t:"Repeat the same survey", why:"Still observational." },
            { t:"Test nut extract on cells only", why:"Lower rung." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which headline most accurately reports a single observational study (4 → 3 in 100)?",
          options:[
            { t:"“Tea drinkers had somewhat lower cancer rates in one study (3 vs 4 in 100); trials are needed”", ok:true, why:"It names the study, gives the absolute numbers and doesn’t claim cause." },
            { t:"“Tea CURES cancer.”", why:M3 + " " + M6 },
            { t:"“Tea slashes cancer 25%!”", why:"Relative only, and “slashes” overstates." },
            { t:"“Avoid tea or get cancer.”", why:"Wrong and fear-based." }] },
        b:{ prompt:"Which caption for a “superfood” post is most accurate?",
          options:[
            { t:"“No single food prevents cancer; overall eating patterns over years are linked to risk.”", ok:true, why:M6 },
            { t:"“Eat this berry, never get cancer.”", why:M6 },
            { t:"“Superfoods are proven by science.”", why:M4N },
            { t:"“All foods cause cancer.”", why:"False." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which sentence about cancer and diet is accurate <strong>and</strong> kind?",
          options:[
            { t:"“Some eating patterns are linked to risk at the population level, but many factors, including genes, age and chance, play a role, and no one is to blame for their cancer.”", ok:true, why:M5 },
            { t:"“People get cancer from eating badly.”", why:M5 },
            { t:"“Diet has nothing to do with cancer.”", why:"Ignores the evidence." },
            { t:"“Only unhealthy people get cancer.”", why:M5 }] },
        b:{ prompt:"Which reply best supports a classmate whose relative has cancer?",
          options:[
            { t:"“I’m sorry. Cancer has many causes; it isn’t anyone’s fault. Want to talk or take a break?”", ok:true, why:"It’s kind and accurate, and it offers support without blame." },
            { t:"“They should have eaten better.”", why:M5 },
            { t:"“Juice cleanses cure it.”", why:M4N },
            { t:"“Just don’t think about it.”", why:"Dismissive." }] } },
      { id:"a1", cat:"A", goal:4,
        // VERIFY: A1 A (typical guidance during chemotherapy)
        a:{ prompt:"A person in chemotherapy has mouth sores and little appetite. Which plan best fits typical guidance?",
          options:[
            { t:"Soft, moist, protein- and energy-rich small meals, careful food safety, and support from the care team’s dietitian", ok:true, why:M7 },
            { t:"Fasting during treatment", why:"Risky." },
            { t:"Spicy, crunchy foods to stimulate appetite", why:"These can hurt mouth sores." },
            { t:"High-dose supplements instead of food", why:M4N }] },
        b:{ prompt:"Treatment has weakened a person’s immune system. Which food-safety step matters most?",
          options:[
            { t:"Avoid foods with a higher risk of foodborne illness (e.g. unpasteurized products, undercooked eggs and meat) and follow clean, separate, cook, chill", ok:true, why:"A weaker immune system makes foodborne illness more dangerous." },
            { t:"Eat only raw foods", why:"Higher risk." },
            { t:"Skip hand-washing", why:"Wrong: clean hands are the first food-safety step." },
            { t:"Food safety doesn’t matter during treatment", why:M7 }] } },
      { id:"a2", cat:"A", goal:5,
        // VERIFY: A2 A (school message: limit processed meat; avoid alcohol for youth)
        a:{ prompt:"A school wants one cancer-prevention nutrition message for families. Which is best supported?",
          options:[
            { t:"“Choose more vegetables, fruits, whole grains and legumes; limit processed meat; avoid alcohol for youth.”", ok:true, why:"It matches the patterns expert reviews support, not single foods." },
            { t:"“Buy our antioxidant supplement.”", why:M4N },
            { t:"“Cut out all sugar to starve cancer.”", why:M6 },
            { t:"“Superfood X prevents cancer.”", why:M6 }] },
        b:{ prompt:"An influencer says a cleanse “detoxes cancer”. What’s the best response?",
          options:[
            { t:"Check the evidence rung: testimonial only; there’s no human trial; the body’s liver and kidneys already clear waste", ok:true, why:"A testimonial sits on rung 1." },
            { t:"Try it, since it’s natural", why:M4N },
            { t:"Share it to be safe", why:"Spreads misinformation." },
            { t:"Assume it works if many people like the post", why:"Popularity isn’t evidence." }] } }
    ]
  },
  task:{
    title:"Fix the headline",
    summary:"Fix the headline",
    statement:"<p>A fictional study followed adults for 10 years. Those who drank Sunleaf tea daily had a cancer rate of 3 in 100; non-drinkers had 4 in 100 (observational; model values). Build a corrected headline from chips that meets every condition. There’s more than one good answer.</p><p class=\"tiny muted\">Sunleaf tea is a practice model. Choose one chip in each slot.</p>",
    template:"Daily Sunleaf tea [verb] cancer risk [number] [study]",
    slots:[
      { id:"v", t:"Verb", options:[{ id:"linked", t:"is linked to" }, { id:"may", t:"may be linked to" }, { id:"prevents", t:"prevents" }, { id:"cures", t:"cures" }] },
      { id:"n", t:"Number", options:[{ id:"abs", t:"about 3 in 100 people instead of 4" }, { id:"rel", t:"a 25% lower relative risk (about 3 in 100 instead of 4)" }, { id:"r75", t:"a 75% lower risk" }, { id:"miracle", t:"a miracle drop" }] },
      { id:"s", t:"Study", options:[{ id:"obs", t:"in one observational study" }, { id:"obstri", t:"in one observational study; trials are needed" }, { id:"proven", t:"proven by science" }, { id:"lab", t:"in a lab dish" }] }
    ],
    checks:["Verb matches the evidence", "Gives an absolute risk", "Names the study accurately", "No hype or fear words"],
    tips:["Observational studies show links, not causes.", "Readers need the “out of 100” numbers.", "It was one observational study of people, not a lab dish.", "Swap hype for precise words."],
    after2:"Which version would a careful editor choose, and why? Add your reasoning in the explanation box.",
    explainPrompt:"Explain why your headline is accurate: name the study type, the absolute numbers, and why the verb fits.",
    vocab:"Use observational, association, cause, relative risk and absolute risk.",
    success:"Your headline meets every condition!"
  },
  cards:[
    ["Evidence ladder", "Anecdote → lab or animal → observational → randomized trial → systematic review."],
    ["Observational study", "Watches what people do; shows association, not cause."],
    ["Randomized controlled trial", "Randomly assigns groups; can test cause."],
    ["Confounder", "Another difference between groups that could explain a result."],
    ["IARC group", "How strong the evidence is that something can cause cancer, not how big the risk is."],
    ["Relative risk", "Change compared with a baseline (e.g. +20%)."],
    ["Absolute risk", "The actual number affected (e.g. 5 → 6 in 100)."],
    // VERIFY: cards 8, 9 and 10
    ["Processed meat", "Linked to colorectal cancer in expert reviews."],
    ["Fibre and whole grains", "Linked to lower colorectal cancer risk."],
    ["Beta-carotene trials", "High-dose supplements raised lung cancer risk in people who smoked."],
    ["Nutrition during treatment", "Energy and protein needs can rise; food safety matters; a dietitian helps."],
    ["Kind language", "Many factors cause cancer; no one is to blame."]
  ]
};
