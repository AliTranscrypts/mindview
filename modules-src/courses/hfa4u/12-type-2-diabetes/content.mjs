// HFA4U 12 Type 2 Diabetes. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/12-type-2-diabetes.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan): fictional personas and teaching-model glucose values only (no student enters their own numbers);
// higher rates framed through genetics AND social conditions, never individual or cultural failings; no weight targets,
// no weight-loss figures, no moral food labels. Trial and task values are model data (labelled on screen).
// Teacher note (course plan §2): the risk map's "Why higher rates" card mentions residential schools. It is written with
// trauma-informed framing and a content note; consider working with the board's Indigenous education lead.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
// plan: the course plan §2 health-information line (Reflect support note); the first sentence is module-written
const ADVICE = "Health information here is general, not advice for any particular person. For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3)
const M1 = "Type 2 develops from insulin resistance plus reduced insulin production, shaped by genes, age, activity and overall eating patterns.";
const M2 = "Carbohydrate stays on the plate: a quarter is starch. Type, amount and what it’s eaten with matter.";
const M3 = "Type 1: the immune system destroys beta cells. Type 2: cells resist insulin and the pancreas can’t keep up.";
const M4 = "Higher rates reflect genetics and social conditions, including colonization’s effects on food systems, not personal or cultural failings.";
const M5 = "Staples can stay: change the portion, pair them with vegetables and protein, add movement.";
const M6 = "These are teaching-model values for fictional personas. Real targets are set with a health professional.";
const M7 = "Muscles use glucose during activity, so even a short walk lowers the peak (in the model, by 1 mmol/L for the typical persona).";

// Sorter hints (plan: the same first two hints for every item; hint 3 is the answer)
const SH = ["Is the problem making insulin, or responding to it?", "Type 1 is autoimmune; type 2 involves resistance."];
const sh = (ans) => SH.concat(["The answer: " + ans + "."]);

export default {
  id:"12-type-2-diabetes",
  kind:"topic",
  title:"Type 2 diabetes",
  topic:"Type 2 Diabetes",
  readyTopic:"type 2 diabetes",
  hero:{
    headline:"When the key sticks in the lock",
    text:"After a meal, <strong>insulin</strong> signals cells to take up <strong>glucose</strong>. In <strong>type 2 diabetes</strong>, cells respond less (<strong>insulin resistance</strong>) and the pancreas eventually can’t keep up. What’s on the plate, how it’s eaten and how we move all change the glucose curve, and so do genes and the conditions people live in.",
    fig:{ html:'<div class="dm-hero" id="dm-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A plate, half vegetables, a quarter roti and a quarter dal, is eaten. Two panels follow. Typical response: glucose dots enter the blood and a small glucose curve rises; insulin keys reach the cell’s locks, the keys turn, the gates open, glucose moves into the cell and the curve returns to its starting level. Insulin resistance: the locks are stiff, more keys crowd in, only one gate opens, most glucose stays in the blood, and the curve rises higher and stays up longer.",
    caption:"Same plate, different response: in insulin resistance the key sticks in the lock."   // module-written
  },
  goals:[
    "I can explain how insulin resistance leads to type 2 diabetes, and how it differs from type 1.",
    "I can explain how meal composition and activity change the blood-glucose response after eating.",
    "I can assess how genetics, age, family history and social conditions combine in type 2 diabetes risk, using respectful, accurate language.",
    "I can plan a meal using the plate method that respects a person’s cultural food traditions.",
    "I can interpret evidence from prevention trials and evaluate community prevention programs."
  ],
  start:{
    // module-written care note (plan module rules: personas only; no blame; health information, not advice)
    blocks:[{ html:SUPPORT }, { title:"Before you start", html:"<p>Diabetes is part of many families’ lives. This module uses <strong>fictional personas</strong> and <strong>teaching-model numbers</strong>; you never enter your own health information. Nobody is to blame for a health condition, and no food here is “good” or “bad”. " + ADVICE + "</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Carbohydrate and fibre", goal:2,
          prompt:"Which food has the most fibre per serving?",
          options:[
            { t:"A cup of cooked lentils", ok:true, why:"Legumes are among the highest-fibre foods." },
            { t:"A cup of white rice", why:"Refined grains lose most fibre." },
            { t:"A glass of orange juice", why:"Juice loses the fibre of whole fruit." },
            { t:"A slice of white bread", why:"Refined flour has little fibre." }],
          hints:["Fibre comes from plant parts like hulls and skins.", "Legumes and whole grains lead.", "Lentils."] },
        { id:"w2", skill:"Carbohydrate and fibre", goal:2,
          prompt:"Starch is digested into…",
          options:[
            { t:"Glucose", ok:true, why:"Starch is a chain of glucose units." },
            { t:"Amino acids", why:"Those come from protein." },
            { t:"Fatty acids", why:"Those come from fat." },
            { t:"Fibre", why:"Fibre isn’t digested by human enzymes." }],
          hints:["Starch is a polysaccharide.", "Made of which sugar?", "Glucose."] },
        { id:"w3", skill:"Digestion and glucose", goal:2,
          prompt:"Where is most glucose absorbed into the blood?",
          options:[
            { t:"The small intestine", ok:true, why:"Through the villi." },
            { t:"The stomach", why:"Little absorption happens there." },
            { t:"The large intestine", why:"Mostly water and fermentation there." },
            { t:"The liver", why:"The liver stores and releases glucose; it doesn’t absorb it from food." }],
          hints:["Module 04.", "The organ with villi.", "Small intestine."] },
        { id:"w4", skill:"Digestion and glucose", goal:2,
          prompt:"Which meal is likely to raise blood glucose more slowly?",
          options:[
            { t:"Whole-grain roti with dal and vegetables", ok:true, why:"Fibre, protein and fat slow digestion." },
            { t:"White bread with jam", why:"Refined starch plus sugar digests quickly." },
            { t:"A sugary drink", why:"Liquid sugar is absorbed fastest." },
            { t:"All meals raise glucose at the same speed", why:"Composition changes speed." }],
          hints:["What slows digestion?", "Fibre and protein.", "The roti, dal and vegetables."] },
        { id:"w5", skill:"Diabetes basics", goal:1,
          prompt:"Which organ makes insulin?",
          options:[
            { t:"The pancreas", ok:true, why:"Beta cells in the islets." },
            { t:"The liver", why:"The liver responds to insulin." },
            { t:"The kidneys", why:"They filter blood." },
            { t:"The stomach", why:"It digests protein." }],
          hints:["Islets of …", "Langerhans.", "Pancreas."] },
        // VERIFY: type 2 increasingly diagnosed in younger people (option C feedback).
        { id:"w6", skill:"Diabetes basics", goal:1,
          prompt:"Which statement about type 2 diabetes is accurate?",
          options:[
            // module-written feedback for the correct option
            { t:"It develops from insulin resistance and reduced insulin production, shaped by many factors", ok:true, why:"Several factors combine: insulin resistance comes first, and the insulin supply weakens later." },
            { t:"It’s caused only by eating sugar", why:M1 },
            { t:"It only affects older adults", why:"It’s increasingly diagnosed in younger people too." },
            { t:"It’s the same as type 1", why:M3 }],
          // plan hint 3 names the option by letter; the build reorders options, so it states the answer instead
          hints:["Is there just one cause?", "Think of insulin’s job.", "It develops from insulin resistance and reduced insulin production, shaped by many factors."] }
      ],
      refreshers:{
        "Carbohydrate and fibre":"Starches and sugars become glucose; fibre isn’t digested and slows the rise.",
        "Digestion and glucose":"Glucose is absorbed in the small intestine; fibre, protein and fat slow the rise.",
        "Diabetes basics":"Insulin from the pancreas lets cells take up glucose. Type 1: beta cells destroyed. Type 2: resistance plus a weakening supply."
      }
    }
  },
  explore:{
    heading:"Blood glucose model",
    intro:"Choose a fictional persona, a meal and what happens after eating. Watch the glucose curve. <strong>Teaching-model values: not clinical targets.</strong>",
    modes:[{ id:"curves", t:"Meal curves" }, { id:"cell", t:"Inside the cell" }, { id:"risk", t:"Risk map" }],
    // Model rules (plan, exact). The insulin-response sentences for Mei-Ling and Ahmad are module-written; Raj's is the plan's.
    personas:[
      { id:"typ", t:"Mei-Ling, 34", kind:"typical response", fast:5, factor:1, back:2,
        insulin:"The pancreas releases insulin, cells respond well, and glucose moves into cells." },
      { id:"ir", t:"Ahmad, 47", kind:"insulin resistance", fast:6, factor:1.5, back:3,
        insulin:"Cells respond less to insulin, so the pancreas makes extra to keep glucose in range, for now." },
      { id:"t2", t:"Raj, 52", kind:"type 2 diabetes", fast:8, factor:2, back:4,
        insulin:"The pancreas makes insulin, but cells respond weakly and the supply can’t keep up." }
    ],
    meals:[
      { id:"high", t:"High-GI: white bread, jam, juice", short:"high-GI meal", base:4 },
      { id:"med", t:"Medium: rice with curry", short:"medium meal", base:3 },
      { id:"low", t:"Lower-GI mixed: whole-grain roti, dal, vegetables", short:"lower-GI mixed meal", base:2 }
    ],
    tweak:"Add vegetables and protein to the plate.",
    walk:"15-minute walk.",
    rows:{ now:"Now showing", fast:"Fasting start", peak:"Peak", rise:"Rise", back:"Back to start in", insulin:"Insulin response", remind:"Reminder" },
    reminder:"Teaching model, not clinical targets.",
    // "About this model" panel (plan's exact rules; the peak table is built from them in app.js and matches the plan's table)
    about:{ title:"About this model",
      rules:[
        "<strong>Fasting start:</strong> typical 5.0, insulin resistance 6.0, type 2 8.0 mmol/L.",
        "<strong>Meal base rise:</strong> high-GI 4, medium 3, lower-GI 2.",
        "<strong>Tweak:</strong> −1 to the meal base (never below 1).",
        "<strong>Walk:</strong> −1 after the tweak; the rise never goes below 0.",
        "<strong>Response factor:</strong> typical ×1, insulin resistance ×1.5, type 2 ×2.",
        "<strong>Peak</strong> = fasting + (adjusted base × factor). <strong>Time back to start</strong> = 2, 3 or 4 hours by persona."
      ],
      note:M6 },
    // Inside the cell (N13 step-through; plan's four steps and type 1 contrast panel)
    cell:{
      steps:[
        "Insulin binds its receptor.",
        "A signal moves glucose transporters to the membrane.",
        "Glucose enters.",
        "In resistance, the signal is weaker, so fewer transporters move and more insulin is needed."
      ],
      contrastTitle:"Type 1 is different",
      contrast:"In type 1, no insulin is made: the immune system destroys the beta cells. It’s treated with insulin, not diet alone."
    },
    // Risk map (F7, population level). Card texts are module-written. VERIFY: every card before release (Diabetes Canada;
    // Public Health Agency of Canada).
    risk:{
      intro:"Tap a factor to see how it links to type 2 diabetes <strong>across populations</strong>. This map is not a personal risk calculator.",
      groups:[
        { id:"bio", t:"Biology and history" },
        { id:"day", t:"Daily patterns" },
        { id:"soc", t:"Social conditions" }
      ],
      tags:{ fixed:"can’t be changed", mod:"can change, with support", soc:"can change through community action and policy" },
      factors:[
        // VERIFY: type 2 increasingly diagnosed in younger people.
        { id:"age", t:"Age", g:"bio", k:"fixed", d:"Risk rises with age across populations, though type 2 is now diagnosed in younger people too." },
        { id:"family", t:"Family history", g:"bio", k:"fixed", d:"Having a parent, brother or sister with type 2 raises risk. Families share genes, and often meals, neighbourhoods and living conditions too." },
        { id:"genes", t:"Genetics", g:"bio", k:"fixed", d:"Many genes each nudge risk a little. Some populations carry gene variants that raise risk." },
        // VERIFY: gestational diabetes and later type 2 risk.
        { id:"gdm", t:"Past gestational diabetes", g:"bio", k:"fixed", d:"Diabetes during a pregnancy usually goes away after the birth, but it signals a higher risk of type 2 later. Regular check-ups help." },
        // VERIFY: prevention-trial finding (plan §1).
        { id:"pre", t:"Prediabetes", g:"bio", k:"mod", d:"Blood glucose higher than typical but below the diabetes range. In large trials, lifestyle programs delayed or prevented type 2 in people with prediabetes." },
        { id:"act", t:"Activity", g:"day", k:"mod", d:"Working muscles take up glucose, and regular activity lowers risk across populations. Safe, affordable places to be active make it easier." },
        { id:"eat", t:"Eating pattern", g:"day", k:"mod", d:"Patterns rich in vegetables, legumes, whole grains and fibre are linked to lower risk across populations. No single food causes type 2." },
        { id:"income", t:"Income", g:"soc", k:"soc", d:"Lower household income is linked to higher rates. Income shapes food budgets, housing, time to cook and be active, and stress." },
        { id:"access", t:"Food access", g:"soc", k:"soc", d:"Where affordable fresh food is hard to reach, protective eating patterns are harder to follow. That is a problem of the food environment, not of willpower." },
        // VERIFY: long-term stress and discrimination linked to higher risk.
        { id:"stress", t:"Stress", g:"soc", k:"soc", d:"Long-term stress, including from money worries and discrimination, affects hormones, sleep and eating, and is linked to higher risk." }
      ],
      // VERIFY: which communities have higher rates (plan list), the in-text sources and years, and the helpline number.
      why:{ t:"Why higher rates in some communities?",
        note:"This card talks about colonization and residential schools. Read it when you’re ready; you can come back to it later.",
        html:"<p>Type 2 diabetes is more common in some communities in Canada, including many Indigenous communities and people of South Asian, African, Caribbean, Hispanic and East Asian descent (Diabetes Canada, 2018; Public Health Agency of Canada, 2011). Rates differ widely from one community to another. Two kinds of reasons combine:</p>" +
          "<ul><li><strong>Genetics:</strong> some populations carry gene variants that raise risk.</li><li><strong>Social conditions:</strong> income, food access, housing and stress, which are shaped by history and policy.</li></ul>" +
          "<p>For Indigenous peoples, colonization disrupted traditional food systems: land was taken, hunting, fishing and gathering were restricted, and children were sent to residential schools, away from their families, languages and traditional foods. These harms cut many families off from foods and knowledge that had kept communities healthy, and their effects continue today.</p>" +
          "<p><strong>Higher rates are not a personal or cultural failing.</strong> Prevention works best when it is <strong>community-led and culturally grounded</strong>, like the programs in the next part. Module 20, Indigenous Food Sovereignty, goes deeper.</p>",
        help:"If this history affects you or your family, the Hope for Wellness Help Line offers support to Indigenous peoples across Canada, any time: <span class=\"nw\">1-855-242-3310</span>." },
      caption:"Risk comes from many combined factors, shown here at the population level."
    },
    predictions:[
      { id:"p1", prompt:"High-GI meal, plain. Which persona has the highest peak?",
        options:[{ t:"Raj (type 2)", ok:true }, { t:"Ahmad (insulin resistance)" }, { t:"Mei-Ling (typical)" }, { t:"All the same" }],
        explain:"The response factor doubles the rise, and Raj also starts higher. The peaks are 16.0, 12.0 and 9.0 mmol/L." },
      { id:"p2", prompt:"Mei-Ling, high-GI meal. With a 15-minute walk after eating, how much lower is her peak?",
        options:[{ t:"1.0 mmol/L", ok:true }, { t:"0" }, { t:"4.0" }, { t:"9.0" }],
        explain:"Working muscles take up glucose. Her peak drops from 9.0 to 8.0 mmol/L. " + M7 },
      { id:"p3", prompt:"Inside the cell. In insulin resistance, what changes first?",
        options:[{ t:"Cells respond less to insulin, so the pancreas works harder", ok:true }, { t:"The pancreas stops making insulin overnight" }, { t:"The stomach stops digesting starch" }, { t:"Glucose can’t be absorbed from food" }],
        explain:"Resistance comes first; the insulin supply weakens later. In the last step, the signal is weaker and fewer transporters reach the membrane." },
      { id:"p4", prompt:"Raj. Lower-GI mixed meal instead of the high-GI meal. How much lower is the peak?",
        options:[{ t:"4.0 mmol/L", ok:true }, { t:"0 (carbs are carbs)" }, { t:"8.0" }, { t:"16.0" }],
        explain:"Fibre, protein and the type of starch change the curve; carbohydrate is still on the plate. His peak drops from 16.0 to 12.0 mmol/L. " + M2 }
    ],
    challenges:[
      { id:"tc1", goal:2,
        prompt:"Ahmad: find a setting with a peak of <strong>7.5 or lower</strong>.",
        why:"An adjusted base of 1 or less, times 1.5, keeps the rise to 1.5 or less: 6.0 + 1.5 = 7.5 mmol/L.",   // module-written
        msgs:{ close:"Close. One more change.",
          // module-written
          who:"Choose Ahmad (insulin resistance) first.",
          high:"Ahmad’s peak is {v} mmol/L. It needs to be 7.5 or lower." },
        hints:["Each change lowers the base by 1, then it’s multiplied by 1.5.", "You need a rise of 1.5 or less, so an adjusted base of 1 or less.", "For example, the lower-GI meal with a walk."] },
      { id:"tc2", goal:2,
        prompt:"Raj: show that a walk can matter as much as a meal tweak. Pin two curves for the <strong>same meal</strong>: one with only a walk, one with only the tweak. Their peaks should match.",
        why:"In this model, a short walk and adding vegetables and protein each lower Raj’s peak by 2 mmol/L. Small, doable changes count.",
        msgs:{ meal:"Keep the meal the same.", both:"One curve gets only the walk; the other gets only the tweak.",
          // module-written
          pins:"Pin two curves: set Raj, a meal and one change, press “Pin this curve”, then switch the change and pin again. ({n} pinned so far.)",
          who:"Both pinned curves need to be Raj’s.",
          pair:"One pinned curve needs only the walk, and the other only the tweak." },
        hints:["Pin a curve, change one toggle, pin again.", "Each change takes 1 off the base.", "Any meal: walk-only vs tweak-only."] },
      { id:"tc3", goal:[2, 4], stretch:true,
        prompt:"Raj grew up with rice and curry, and it’s at the centre of family meals. <strong>Keep the medium meal</strong> and bring his peak to <strong>10.0 or lower</strong>.",
        why:"A staple food can stay. Portion, plate balance and movement do the work.",
        msgs:{ low:"That works in the model, but the goal is to keep the meal that matters to him. Change <em>how</em> it’s eaten instead.",
          one:"One more change.",
          // module-written
          who:"Choose Raj (type 2 diabetes) first.",
          lowHigh:"Keep the medium meal: rice with curry is the meal that matters to him. Change <em>how</em> it’s eaten instead.",
          high:"Keep the medium meal: rice with curry is the meal that matters to him.",
          plain:"Raj’s peak is 14.0 mmol/L. Change how the meal is eaten: the tweak and the walk each help." },
        hints:["His factor is ×2. To reach 10.0 from a start of 8.0, the rise must be 2 or less.", "So the adjusted base must be 1: medium is 3, and each change takes off 1.", "Tweak (more vegetables and protein, often a smaller rice portion) <strong>and</strong> a walk."] }
    ],
    // module-written summary of the plan's "aha"
    blocks:[{ title:"What the model shows", html:"<p>The <strong>same meal</strong> gives <strong>different curves</strong> for different bodies. Meal composition and a short walk both lower the peak, and nothing here requires giving up a meaningful food. Risk, meanwhile, comes from many factors at once: biology, daily patterns and the conditions people live in.</p><p class=\"tiny muted\">" + M6 + " " + ADVICE + "</p>" }]
  },
  part3:{
    slug:"community", name:"Community", heading:"Prevention at community level",
    // module-written intro
    intro:"Move from one person’s curve to whole communities. Read what prevention trials showed, look at community-led programs, then rate four prevention strategies against four criteria.",
    stations:[{ id:"trial", t:"1. What the trials showed" }, { id:"programs", t:"2. Community-led programs" }, { id:"rate", t:"3. Evaluate four strategies" }],
    trial:{
      title:"Station 1: what the trials showed",
      // VERIFY: the U.S. Diabetes Prevention Program's actual results; the bars are model numbers, not the trial's.
      text:"Large prevention trials compared lifestyle programs with usual care in adults with prediabetes (for example, the U.S. Diabetes Prevention Program; Diabetes Prevention Program Research Group, 2002). This panel uses <strong>model numbers</strong> based on that kind of trial: new diagnoses over about 3 years.",
      bars:[{ id:"usual", t:"Usual care", v:30 }, { id:"life", t:"Lifestyle program", v:15 }, { id:"med", t:"Medication", v:20 }],
      unit:"new diagnoses per 100 people",
      noWeight:"This panel reports diagnoses and the behaviours involved. It gives no weight figures.",   // module-written (plan: no weight-loss figures)
      q1:{ id:"rel", prompt:"How much lower was the lifestyle group’s rate, relative to usual care?", answer:50, unit:"%",
        // module-written feedback
        wrong:[{ match:15, fb:"15 per 100 is the absolute difference. Relative: compare the difference with the usual-care rate, 15 ÷ 30." }, { match:200, fb:"That compares the wrong way round. The usual-care rate is the starting point: 15 ÷ 30." }],
        wrongDefault:"Relative reduction = difference ÷ usual-care rate = (30 − 15) ÷ 30.",
        why:"30 − 15 = 15, and 15 ÷ 30 = 50%: the lifestyle group’s rate was half the usual-care rate." },
      q2:{ id:"what", prompt:"What did the program change?",
        // module-written distractors and feedback
        choices:[{ t:"Eating patterns and activity, with coaching and support", ok:true }, { t:"Only how much sugar people ate" }, { t:"A daily medication" }, { t:"Nothing: people just tried harder on their own" }],
        why:"Lifestyle programs changed eating patterns and activity, and gave people coaching and support to keep going.",
        wrong:"Look at what the lifestyle group did: eating patterns and activity, with coaching and support." },
      tableHeads:["Group", "New diagnoses per 100", "Difference from usual care", "Relative reduction"]
    },
    programs:{
      title:"Station 2: community-led programs",
      ask:"Read each card. Tap every feature the card describes, then check your tags.",
      features:[
        { id:"led", t:"community-led" }, { id:"culture", t:"culturally grounded" }, { id:"school", t:"school-based" },
        { id:"env", t:"changes the food environment" }, { id:"trad", t:"includes traditional foods" }, { id:"long", t:"long-term" }
      ],
      cards:[
        // VERIFY: every KSDPP detail (start year, partners, school program, school food and activity policies, duration)
        // against Macaulay et al. (1997) and KSDPP's own materials. The feature answer below follows this card's wording.
        { id:"ksdpp", t:"Kahnawake Schools Diabetes Prevention Project (KSDPP)", real:true,
          html:"Kahnawake is a Kanien’kehá:ka (Mohawk) community near Montréal, Quebec. Community members started the project in 1994 and lead it, with researchers as partners, and a community advisory board guides its decisions. Lessons in the community’s elementary schools teach healthy eating and active living in ways grounded in Kanien’kehá:ka culture and values. The project worked with the schools on healthier school food policies and more chances to be active, and it has continued for decades.",
          answer:["led", "culture", "school", "env", "long"] },
        // module-written practice model (fictional), so no real community's details are invented
        { id:"model", t:"The Neighbourhood Kitchen Table", real:false,
          html:"A community health centre in an Ontario city asked local families what would help. Members of the centre’s Punjabi, Tamil and Caribbean communities now co-lead weekly walking groups and cooking circles, where people adapt their own family recipes, such as adding vegetables and legumes and balancing portions of roti, rice or bread. It started this year as a pilot.",
          answer:["led", "culture", "trad"] }
      ],
      // module-written check messages
      msgs:{ none:"Tap at least one feature first.", done:"Your tags match this card.", miss:"Look again: the card describes {count} you haven’t tagged.", extra:"The card doesn’t describe {list}." }
    },
    rate:{
      title:"Station 3: evaluate four strategies",
      ask:"Rate each strategy against the four criteria, then check your ratings against the model ratings.",
      criteria:[
        { id:"reach", t:"Reaches many people", opts:[{ id:"yes", t:"yes" }, { id:"community", t:"the community" }, { id:"no", t:"no" }] },
        { id:"root", t:"Addresses root causes", opts:[{ id:"yes", t:"yes" }, { id:"partly", t:"partly" }, { id:"no", t:"no" }] },
        { id:"resp", t:"Culturally respectful", opts:[{ id:"yes", t:"yes" }, { id:"codes", t:"yes if co-designed" }, { id:"varies", t:"varies" }, { id:"no", t:"no" }] },
        { id:"evid", t:"Has evidence", opts:[{ id:"supported", t:"supported" }, { id:"moderate", t:"moderate" }, { id:"weak", t:"weak" }, { id:"none", t:"none" }] }
      ],
      // Model ratings (plan's answer key). VERIFY: evidence ratings for B and C. Explanations are module-written.
      strategies:[
        { id:"A", t:"Posters telling people to “eat less sugar”", answer:{ reach:"yes", root:"no", resp:"varies", evid:"weak" },
          why:"Posters reach many people, but advice alone doesn’t change income, food access or stress, and the evidence that it works is weak." },
        { id:"B", t:"A school food program with whole grains, vegetables and water as the default", answer:{ reach:"yes", root:"partly", resp:"codes", evid:"moderate" },
          why:"A default reaches every student and changes the food environment. It is respectful when families help design it." },
        { id:"C", t:"A community-led program combining traditional food, activity and coaching", answer:{ reach:"community", root:"yes", resp:"yes", evid:"supported" },
          why:"Led by the community and grounded in culture, it tackles root causes, and trials and community projects support it." },
        { id:"D", t:"Telling individuals to “just try harder”", answer:{ reach:"no", root:"no", resp:"no", evid:"none" },
          why:"Blame reaches no one usefully, ignores causes and does harm, and there is no evidence that it works. " + M4 }
      ],
      // module-written check messages
      msgs:{ partial:"Rate all four criteria first.", ok:"Your ratings match the model ratings.", off:"{count} from the model ratings (marked ✗). Rethink {list}." }
    },
    // VERIFY: reference details (authors, years, titles, journals, volumes, pages) before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Diabetes Canada Clinical Practice Guidelines Expert Committee. (2018). Diabetes Canada 2018 clinical practice guidelines for the prevention and management of diabetes in Canada. <i>Canadian Journal of Diabetes, 42</i>(Suppl. 1), S1–S325.</li><li>Diabetes Prevention Program Research Group. (2002). Reduction in the incidence of type 2 diabetes with lifestyle intervention or metformin. <i>New England Journal of Medicine, 346</i>(6), 393–403.</li><li>Macaulay, A. C., Paradis, G., Potvin, L., Cross, E. J., Saad-Haddad, C., McComber, A., Desrosiers, S., Kirby, R., Montour, L. T., Lamping, D. L., Leduc, N., &amp; Rivard, M. (1997). The Kahnawake Schools Diabetes Prevention Project: Intervention, evaluation, and baseline results of a diabetes primary prevention program with a Native community in Canada. <i>Preventive Medicine, 26</i>(6), 779–790.</li><li>Public Health Agency of Canada. (2011). <i>Diabetes in Canada: Facts and figures from a public health perspective</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Community quick check", summary:"Community quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:5, prompt:"Lifestyle-program rate 15 per 100 vs usual care 30 per 100. Relative reduction?",
          choices:[{ t:"50%", ok:true, fb:"Right. 15 is half of 30, so the rate fell by 50%." }, { t:"15%", fb:"15 is half of 30." }, { t:"30%", fb:"15 is half of 30." }, { t:"200%", fb:"15 is half of 30." }] },
        { id:"q2", goal:5, prompt:"Which feature most often appears in successful community programs?",
          choices:[{ t:"community-led and culturally grounded", ok:true, fb:"Right. Ownership and culture sustain change." }, { t:"posters only", fb:"Ownership and culture sustain change." }, { t:"one-time talks", fb:"Ownership and culture sustain change." }, { t:"blaming individuals", fb:"Ownership and culture sustain change." }] },
        { id:"q3", goal:3, prompt:"Higher type 2 rates in some Indigenous communities are best explained by…",
          choices:[{ t:"genetics and social conditions, including colonization’s effects on food systems", ok:true, fb:"Right. " + M4 }, { t:"personal choices only", fb:M4 }, { t:"traditional foods", fb:M4 }, { t:"culture", fb:M4 }] },
        { id:"q4", goal:5, prompt:"Which strategy changes the food environment rather than only giving advice?",
          choices:[{ t:"water as the default school drink", ok:true, fb:"Right. Defaults shape choices for everyone." }, { t:"a poster", fb:"Defaults shape choices for everyone." }, { t:"a pamphlet", fb:"Defaults shape choices for everyone." }, { t:"a one-time talk", fb:"Defaults shape choices for everyone." }] }
      ]
    },
    blocksAfter:[{ html:'<div class="hfa-support" role="note"><p>' + ADVICE + "</p></div>" }]
  },
  practice:{
    activities:[
      // Plan: tap-to-sort (N6), 10 items, boxes Type 1 · Type 2 · Both; item 9 opens a "Neither" option on tap. Custom so the
      // Neither box appears only for item 9. The "why" lines and the misplaced feedback for items 5, 7 and 8 are module-written.
      { id:"types", type:"custom", title:"Type 1, type 2 or both?", summary:"Type 1, type 2 or both", goal:[1, 3],
        instruction:"Sort each statement into the box where it belongs. One card is a myth: tapping it opens a <strong>Neither</strong> box.",
        how:"Tap a statement, then tap the box it belongs in.",
        boxes:[{ id:"t1", label:"Type 1" }, { id:"t2", label:"Type 2" }, { id:"both", label:"Both" }],
        neither:{ id:"none", label:"Neither", sub:"a myth" },
        items:[
          { id:"s1", t:"The immune system destroys the insulin-making beta cells", answer:"t1", goal:1, why:"In type 1, an autoimmune reaction destroys the beta cells, so little or no insulin is made.", wrong:{ t2:M3, both:M3 }, hints:sh("Type 1") },
          { id:"s2", t:"Begins with insulin resistance", answer:"t2", goal:1, why:"Type 2 starts when cells respond less to insulin.", wrong:{ t1:M3, both:M3 }, hints:sh("Type 2") },
          { id:"s3", t:"Blood glucose stays too high without management", answer:"both", goal:1, why:"Both types involve high blood glucose that needs managing.", wrong:{ t1:"Both involve high blood glucose.", t2:"Both involve high blood glucose." }, hints:sh("Both") },
          { id:"s4", t:"Always needs insulin from diagnosis", answer:"t1", goal:1, why:"Without working beta cells, people with type 1 need insulin from the start.", wrong:{ t2:"Type 2 may need insulin later, but not always.", both:"Type 2 may need insulin later, but not always." }, hints:sh("Type 1") },
          // VERIFY: about 9 in 10 diabetes cases in Canada are type 2.
          { id:"s5", t:"About 9 in 10 diabetes cases in Canada", answer:"t2", goal:1, why:"Type 2 is by far the most common type.", wrong:{ t1:"Type 1 is the less common type. Which type makes up most cases?", both:"Most cases are one type. Which is far more common?" }, hints:sh("Type 2") },
          { id:"s6", t:"Risk raised by family history", answer:"both", goal:3, why:"Family history raises risk for both types.", wrong:{ t1:"Family history matters for both.", t2:"Family history matters for both." }, hints:sh("Both") },
          { id:"s7", t:"Can sometimes be delayed by eating and activity changes in people at high risk", answer:"t2", goal:[1, 3], why:"Prevention trials found that eating and activity changes can delay type 2 in people at high risk.", wrong:{ t1:"Type 1 is autoimmune; eating and activity changes aren’t known to prevent it.", both:"Only one type has been delayed this way in trials. Which one involves resistance?" }, hints:sh("Type 2") },
          { id:"s8", t:"Planning meals around carbohydrate helps manage blood glucose", answer:"both", goal:1, why:"Matching meals and carbohydrate to the body’s needs helps in both types.", wrong:{ t1:"Carbohydrate planning helps people with either type.", t2:"Carbohydrate planning helps people with either type." }, hints:sh("Both") },
          { id:"s9", t:"Caused by eating too much sugar as a child", answer:"none", goal:1, why:"It’s a myth. " + M1, myth:true,
            wrong:{ t1:"That’s a myth: " + M1 + " This card belongs in neither box.", t2:"That’s a myth: " + M1 + " This card belongs in neither box.", both:"That’s a myth: " + M1 + " This card belongs in neither box." },
            hints:SH.concat(["The answer: neither. It’s a myth."]) },
          { id:"s10", t:"Higher rates linked to social conditions such as income and food access", answer:"t2", goal:3, why:"Income and food access shape type 2 rates across communities.", wrong:{ t1:M4, both:M4 }, hints:sh("Type 2") }
        ] },
      // ★ set (plan: N4 number entry and choice; R3–R6 ★; R5 and R6 above Final Check level). Hints for R1–R5, the R3/R4
      // "why" choices and their distractors, the R6 distractors and all correct-answer lines are module-written.
      // VERIFY: GL category cut-offs (low ≤ 10, medium 11–19, high ≥ 20); watermelon GI about 75 and about 10 g carbohydrate per cup.
      { id:"gl", type:"custom", title:"Glycemic load and trial data", summary:"Glycemic load and trial data", star:true, goal:[2, 5],
        instruction:"Glycemic load (GL) = GI × available carbohydrate (g) ÷ 100. Categories: low ≤ 10, medium 11–19, high ≥ 20. Items marked ★ are non-routine; R5 is an inquiry item.",
        how:"Type each number, choose from the chips where there are any, then press Check. Each item has three levels of help.",
        cats:[{ id:"low", t:"low" }, { id:"medium", t:"medium" }, { id:"high", t:"high" }],
        items:[
          { id:"r1", goal:2, prompt:"GI 70, 30 g carbohydrate. GL?",
            nums:[{ id:"v", label:"GL", answer:21 }], answer:"high",
            wrong:[{ match:2100, fb:"Divide by 100." }], wrongDefault:"GL = GI × carbohydrate ÷ 100.", catFb:"Check the category cut-offs: 20 or more is high.",
            why:"70 × 30 = 2100; ÷ 100 = 21, which is high.",
            hints:["GL = GI × carbohydrate ÷ 100.", "70 × 30 = 2100.", "2100 ÷ 100 = 21, which is high (20 or more)."] },
          { id:"r2", goal:2, prompt:"GI 40, 25 g carbohydrate. GL?",
            nums:[{ id:"v", label:"GL", answer:10 }], answer:"low",
            wrong:[{ match:1000, fb:"40 × 25 = 1000; ÷ 100 = 10." }], wrongDefault:"40 × 25 = 1000; ÷ 100 = 10.", catFb:"Check the category cut-offs: 10 or less is low.",
            why:"40 × 25 = 1000; ÷ 100 = 10, which is low.",
            hints:["Multiply GI by grams of carbohydrate, then divide by 100.", "40 × 25 = 1000.", "1000 ÷ 100 = 10, which is low (10 or less)."] },
          { id:"r3", goal:2, star:true, prompt:"Watermelon: GI about 75 (high) but about 10 g carbohydrate per cup. GL? Why does GL tell a different story?",
            nums:[{ id:"v", label:"GL", answer:7.5 }], answer:"low",
            choiceLabel:"Why GL tells a different story",
            choices:[{ t:"GL accounts for the amount of carbohydrate", ok:true }, { t:"GL ignores the GI" }, { t:"Watermelon has no carbohydrate" }, { t:"GI already includes the portion size" }],
            wrong:[{ match:750, fb:"Divide by 100." }], wrongDefault:"GI alone ignores portion. 75 × 10 ÷ 100 = ?", catFb:"GI alone ignores portion. A GL of 7.5 is in the low range.", choiceFb:"GI alone ignores portion.",
            why:"75 × 10 ÷ 100 = 7.5, which is low. GI alone ignores portion; GL accounts for the amount of carbohydrate.",
            hints:["Use about 75 and 10 g.", "75 × 10 = 750; ÷ 100 = 7.5.", "GL 7.5 is low: a cup has little carbohydrate, so the high GI matters less. GL accounts for the amount."] },
          { id:"r4", goal:2, star:true, prompt:"Raj’s model: with the tweak only, his medium-meal peak is 12.0. What’s the peak if he also walks, and why?",
            nums:[{ id:"v", label:"Peak", answer:10, unit:"mmol/L" }],
            choiceLabel:"Why",
            choices:[{ t:"The adjusted base goes from 2 to 1; ×2 = 2; plus 8.0", ok:true }, { t:"The walk takes 1 off the peak: 12.0 − 1" }, { t:"The walk takes 1 off after the ×2, then adds 8.0" }, { t:"A walk doesn’t change the peak" }],
            wrong:[{ match:11, fb:"Apply the walk before the ×2." }, { match:12, fb:"The walk lowers the base by 1. Apply the walk before the ×2." }], wrongDefault:"Apply the walk before the ×2.", choiceFb:"Apply the walk before the ×2.",
            why:"The adjusted base 2 → 1; 1 × 2 = 2; 8.0 + 2 = 10.0 mmol/L.",
            hints:["The walk takes 1 off the base before the ×2.", "Tweak: 3 − 1 = 2. Walk: 2 − 1 = 1.", "1 × 2 = 2; 8.0 + 2 = 10.0 mmol/L."] },
          { id:"r5", goal:5, star:true, inquiry:true, prompt:"Trial (model data): 1000 adults with prediabetes. Usual care: 300 diagnosed in 3 years. Lifestyle program: 150. Absolute difference per 100 people, and relative reduction?",
            nums:[{ id:"abs", label:"Absolute difference", answer:15, unit:"per 100" }, { id:"rel", label:"Relative reduction", answer:50, unit:"%" }],
            wrong:[], wrongDefault:"Separate absolute (30 − 15 per 100) from relative (15 ÷ 30).",
            why:"Usual care 30 per 100, program 15 per 100: the absolute difference is 15 per 100, and the relative reduction is 15 ÷ 30 = 50%.",
            hints:["Turn the counts into rates per 100: 300 of 1000 and 150 of 1000.", "30 per 100 and 15 per 100. Absolute: 30 − 15.", "Absolute: 15 per 100. Relative: 15 ÷ 30 = 50%."] },
          { id:"r6", goal:5, star:true, prompt:"A company says its “diabetes-reversing” tea cut glucose in 12 users. Name two reasons this claim is weak.",
            multi:true, need:2,
            choiceLabel:"Choose two or more reasons",
            choices:[{ t:"No control group", ok:true }, { t:"Tiny sample", ok:true }, { t:"No randomization", ok:true }, { t:"Company-funded", ok:true }, { t:"Outcome not defined", ok:true },
              { t:"The tea is made from plants" }, { t:"It measured blood glucose" }, { t:"The users were adults" }],
            choiceFb:"Compare with the trial in R5.",
            why:"Any two of: no control group, a tiny sample, no randomization, funded by the seller, and no clear outcome. The R5 trial had a comparison group and many more people.",
            hints:["What did the trial have that this lacks?", "A comparison group; random assignment.", "Also: 12 people, run by the seller."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Ludovic", goal:[1, 3, 4], how:"",
        instruction:"Ludovic made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain type 2 diabetes.",
            steps:["“Insulin lets cells take up glucose.”", "“In type 2, the immune system destroys the beta cells.”", "“So glucose stays high in the blood.”"],
            answer:1, stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"“In type 2, cells resist insulin, and over time the pancreas can’t make enough.”", ok:true, why:M3 },
              { t:"“In type 2, the liver makes insulin instead.”", why:"The pancreas makes insulin." },
              { t:"“In type 2, glucose isn’t absorbed.”", why:"Absorption is normal." },
              { t:"Step 2 is correct.", why:"That describes type 1." }],
            hints:["Which type is autoimmune?", "Type 1.", "Type 2: resistance."] },
          { id:"e2", goal:4, task:"Plan a lunch for someone managing type 2 diabetes.",
            steps:["“Use the plate method.”", "“Fill half the plate with non-starchy vegetables.”", "“Remove all starches, because carbohydrate raises glucose.”", "“Fill the rest with protein.”"],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct. Keep checking.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"“Keep a quarter plate of starch, ideally whole grain or higher fibre; carbohydrate is part of a balanced plate.”", ok:true, why:M2 },
              { t:"“Make half the plate starch.”", why:"That’s more than the plate method suggests." },
              { t:"“Replace starch with juice.”", why:"Juice raises glucose fast." },
              { t:"Step 3 is correct.", why:"The plate method keeps a quarter starch." }],
            hints:["What does the plate method say about starch?", "A quarter.", "Keep it; choose higher-fibre options."] },
          { id:"e3", goal:3, task:"Explain why type 2 rates are higher in some communities.",
            steps:["“Rates are higher in some communities.”", "“This is mainly because people in those communities make poor food choices.”", "“So education is the only solution.”"],
            answer:1, stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"“Genetics and social conditions (income, food access, and for Indigenous peoples the effects of colonization on food systems) combine to raise rates.”", ok:true, why:M4 },
              { t:"“It’s only genetics.”", why:"Social conditions matter too." },
              { t:"“It’s caused by traditional foods.”", why:"Traditional food systems are often protective (module 20)." },
              { t:"Step 2 is correct.", why:"That blames individuals and ignores causes." }],
            hints:["What did the risk map show?", "Several factor types combine.", "Genetics plus social conditions."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:'<div class="hfa-support" role="note"><p>' + ADVICE + "</p></div>" }, { html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you about how the same meal produced different curves for different personas?" },
      { id:"j2", q:"In your own words, explain insulin resistance to someone who has never heard of it." },
      { id:"j3", q:"Explain to a friend how a person can keep a meaningful food and still manage blood glucose." },
      { id:"j4", q:"What are you still unsure about: the biology, the risk factors or the community programs? What will you do next?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7); correct-option lines without plan
    // text are module-written.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is insulin resistance?", options:[
          { t:"Cells respond less to insulin, so more is needed to move glucose into them", ok:true, why:"Resistance comes first; the pancreas makes more insulin to keep up." },
          { t:"The pancreas stops making insulin overnight", why:"Resistance comes first; supply weakens later." },
          { t:"Glucose can’t be absorbed from food", why:"Absorption is normal." },
          { t:"A reaction caused only by eating sugar", why:M1 }] },
        b:{ prompt:"Which best describes how type 2 diabetes develops?", options:[
          { t:"Insulin resistance, then the pancreas gradually can’t keep up", ok:true, why:M1 },
          { t:"The immune system destroys beta cells", why:M3 },
          { t:"Eating sugar directly damages the pancreas", why:M1 },
          { t:"The liver stops storing glucose", why:"Not the main process." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which is true of type 1 but <strong>not</strong> type 2 diabetes?", options:[
          { t:"The immune system destroys the insulin-making beta cells", ok:true, why:"Type 1 is autoimmune; type 2 begins with insulin resistance." },
          { t:"Blood glucose runs high", why:"Both." },
          { t:"Family history affects risk", why:"Both." },
          { t:"Carbohydrate planning helps management", why:"Both." }] },
        b:{ prompt:"Which is true of type 2 but <strong>not</strong> type 1?", options:[
          { t:"It begins with insulin resistance", ok:true, why:"Type 1 begins with the immune system destroying beta cells." },
          { t:"It involves high blood glucose", why:"Both." },
          { t:"Insulin is involved", why:"Both." },
          { t:"Meal planning helps", why:"Both." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which set lists only <strong>risk factors</strong> for type 2 diabetes?", options:[
          { t:"Family history, older age, physical inactivity, past gestational diabetes", ok:true, why:"Each of these is an established risk factor." },
          { t:"Eating any sugar, cold weather, height", why:"Not established risk factors. " + M1 },
          { t:"Type 1 diabetes, tall stature, blood type", why:"No." },
          { t:"Drinking water, eating vegetables, walking", why:"Those are protective habits." }] },
        b:{ prompt:"Which is a <strong>social</strong> condition linked to type 2 risk?", options:[
          { t:"Low household income limiting access to fresh foods", ok:true, why:"Income and food access are social conditions." },
          { t:"Family history", why:"Biological." },
          { t:"Age", why:"Biological." },
          { t:"Insulin resistance", why:"Physiological." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"In the module’s model, Ahmad (×1.5, fasting 6.0) eats the high-GI meal (base 4) with the tweak and a walk. What’s his peak?", options:[
          { t:"9.0 mmol/L", ok:true, why:"(4 − 1 − 1) × 1.5 = 3; 6 + 3 = 9." },
          { t:"12.0 mmol/L", why:"That’s without the tweak or walk." },
          { t:"7.5 mmol/L", why:"That’s an adjusted base of 1." },
          { t:"10.0 mmol/L", why:"That uses ×2." }] },
        b:{ prompt:"Raj (×2, fasting 8.0), lower-GI meal (base 2), walk only. Peak?", options:[
          { t:"10.0 mmol/L", ok:true, why:"(2 − 1) × 2 = 2; 8 + 2." },
          { t:"12.0 mmol/L", why:"No walk." },
          { t:"9.0 mmol/L", why:"That uses ×1." },
          { t:"8.0 mmol/L", why:"That’s the tweak and the walk together." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Food P: GI 60, 50 g carbohydrate. Food Q: GI 80, 15 g carbohydrate. Which has the higher glycemic load?", options:[
          { t:"P (GL 30 vs 12)", ok:true, why:"60 × 50 ÷ 100 = 30; 80 × 15 ÷ 100 = 12." },
          { t:"Q, because its GI is higher", why:"GL includes the amount." },
          { t:"They’re equal", why:"30 ≠ 12." },
          { t:"Can’t tell without calories", why:"GL uses GI and carbohydrate." }] },
        b:{ prompt:"Food R: GI 50, 40 g carbohydrate. Food S: GI 90, 10 g. Higher GL?", options:[
          { t:"R (20 vs 9)", ok:true, why:"50 × 40 ÷ 100 = 20; 90 × 10 ÷ 100 = 9." },
          { t:"S, higher GI", why:"Portion matters." },
          { t:"Equal", why:"20 ≠ 9." },
          { t:"Can’t tell", why:"Use GI × carbohydrate ÷ 100." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Model trial: usual care, 24 of 100 diagnosed; lifestyle program, 12 of 100. Which statement is correct?", options:[
          { t:"The lifestyle program cut the rate by half (relative) and by 12 per 100 (absolute)", ok:true, why:"24 − 12 = 12 per 100 (absolute); 12 ÷ 24 = 50% (relative)." },
          { t:"It cut risk by 12%", why:"12 per 100 is the absolute difference; the relative drop is 50%." },
          { t:"It prevented all cases", why:"12 still developed diabetes." },
          { t:"It shows sugar causes diabetes", why:M1 }] },
        b:{ prompt:"Model trial: usual care 20 of 100; program 15 of 100. Correct statement?", options:[
          { t:"The relative reduction is 25% and the absolute reduction is 5 per 100", ok:true, why:"20 − 15 = 5 per 100; 5 ÷ 20 = 25%." },
          { t:"Relative 5%", why:"5 ÷ 20 = 25%." },
          { t:"Absolute 25 per 100", why:"Reversed." },
          { t:"No effect", why:"15 < 20." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which advice for someone managing type 2 diabetes is clearest and most accurate?", options:[
          { t:"“Use the plate method: half non-starchy vegetables, a quarter starch (higher fibre when possible), a quarter protein, and spread carbohydrate through the day.”", ok:true, why:"Specific, accurate and keeps carbohydrate on the plate." },
          { t:"“Cut out all carbohydrates.”", why:M2 },
          { t:"“Avoid all your cultural foods.”", why:M5 },
          { t:"“Only eat fruit.”", why:"Not balanced." }] },
        b:{ prompt:"Which description of carbohydrate in diabetes management is accurate?", options:[
          { t:"“Carbohydrate stays on the plate; amount, type and what it’s paired with affect blood glucose.”", ok:true, why:M2 },
          { t:"“Carbohydrate is bad.”", why:"A moral label, and inaccurate." },
          { t:"“Only sugar matters; starch doesn’t.”", why:"Starch becomes glucose." },
          { t:"“Fibre raises blood glucose fastest.”", why:"Fibre slows the rise." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which sentence about higher type 2 rates in some Indigenous communities is accurate and respectful?", options:[
          { t:"“Higher rates reflect genetics and social conditions, including colonization’s disruption of traditional food systems; community-led programs are a response.”", ok:true, why:"Accurate about causes, and it names a response without blame." },
          { t:"“Indigenous people make unhealthy choices.”", why:M4 },
          { t:"“Traditional foods cause diabetes.”", why:"Often the opposite." },
          { t:"“Nothing can be done.”", why:"Community-led programs show otherwise." }] },
        b:{ prompt:"Which caption for the risk map is accurate and respectful?", options:[
          { t:"“Risk comes from many combined factors (biology, activity, eating patterns and social conditions), shown here at the population level.”", ok:true, why:"Accurate, and it describes populations, not individuals." },
          { t:"“Diabetes is your own fault.”", why:M4 },
          { t:"“Only genes matter.”", why:"Several factors combine." },
          { t:"“Find out if you’ll get diabetes.”", why:"Population model, not personal." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Raj wants to keep rice at family dinners. Which plan best fits the plate method?", options:[
          { t:"A quarter-plate of rice, half the plate vegetable curry, a quarter dal, and a short walk after dinner", ok:true, why:M5 },
          { t:"No rice at all", why:M5 },
          { t:"A full plate of rice with a sugary drink", why:"Not balanced." },
          { t:"Rice only at breakfast", why:"Spreading helps, but plate balance matters at each meal." }] },
        b:{ prompt:"Ana loves tortillas at lunch. Which plan best fits?", options:[
          { t:"Two corn tortillas (a quarter plate), a half plate of vegetables, a quarter beans or chicken, and water", ok:true, why:M5 },
          { t:"No tortillas ever", why:M5 },
          { t:"Four tortillas and juice", why:"Too much fast carbohydrate." },
          { t:"Only salad", why:"Missing protein and starch." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A health unit wants to lower type 2 rates in a neighbourhood with few grocery stores. Which plan is strongest?", options:[
          { t:"Work with community members to open affordable produce markets and start a culturally matched walking and cooking program", ok:true, why:"Community-led, culturally matched, and it changes food access." },
          { t:"Hand out pamphlets about sugar", why:"Information alone." },
          { t:"Tell residents to drive to suburbs to shop", why:"Ignores access." },
          { t:"Screen residents but offer nothing else", why:"Screening alone doesn’t change conditions." }] },
        b:{ prompt:"A school board wants to support diabetes prevention. Which plan is strongest?", options:[
          { t:"Make water the default drink, offer whole-grain and vegetable-rich meals co-designed with families, and add daily activity", ok:true, why:"It changes the environment for every student, with families’ input." },
          { t:"A one-time assembly", why:"Short-lived." },
          { t:"Ban all carbohydrate", why:M2 },
          { t:"Weigh students publicly", why:"Harmful; violates privacy and dignity." }] } }
    ]
  },
  task:{
    title:"Raj’s plate", summary:"Raj’s plate",
    statement:"<p>Raj is 52, lives with type 2 diabetes, is vegetarian and Punjabi Sikh. His (fictional) dietitian’s plan for lunch: plate method, 45–60 g carbohydrate, at least 10 g fibre, and foods he loves. Build a lunch that meets every condition.</p><p class=\"tiny muted\">Choose one starch, one protein and one vegetable. All values are model values.</p>",
    checks:["Half the plate non-starchy vegetables", "Carbohydrate 45–60 g", "At least 10 g fibre", "Includes a food from Raj’s traditions"],
    tips:["Potatoes are a starchy vegetable; they count toward carbohydrate, not the vegetable half.", "Rice and naan push carbohydrate up fast; pair them with low-carbohydrate items, or choose roti.", "Legumes (dal, chickpeas) bring fibre.", "Raj’s traditions include roti, dal, sabzi, paneer, rice and naan."],
    explainPrompt:"Explain how your plate supports Raj’s blood glucose <strong>and</strong> respects his food traditions.",
    vocab:"Use plate method, carbohydrate, fibre, legumes and glycemic response.",
    checkLabel:"Check Raj’s plate",
    success:"This lunch meets every condition.",   // module-written
    more:"There’s more than one answer. Can you find another?",
    after3:"Whole-wheat roti is in every answer. Rice can fit too, on a different day’s plan with a smaller portion. Talk with the dietitian.",
    // Items (plan table, model values). Valid answers: exactly 3 of the 48 combinations (checked in the module's test).
    rows:[
      { id:"s", t:"Starch", items:[
        { id:"roti", t:"Roti, 2 small, whole wheat", short:"roti", carb:30, fib:6, trad:true },
        { id:"wrice", t:"White rice, 1 cup", short:"white rice", carb:45, fib:1, trad:true },
        { id:"brice", t:"Brown rice, 1 cup", short:"brown rice", carb:45, fib:3, trad:false },
        { id:"naan", t:"Naan, 1 piece", short:"naan", carb:50, fib:2, trad:true }] },
      { id:"p", t:"Protein", items:[
        { id:"dal", t:"Dal, 1 cup", short:"dal", carb:20, fib:8, trad:true },
        { id:"paneer", t:"Paneer, 100 g", short:"paneer", carb:3, fib:0, trad:true },
        { id:"chana", t:"Chickpea curry, 1 cup", short:"chickpea curry", carb:25, fib:7, trad:true },
        { id:"tofu", t:"Tofu, 150 g", short:"tofu", carb:4, fib:1, trad:false }] },
      { id:"v", t:"Vegetable", items:[
        { id:"sabzi", t:"Mixed-vegetable sabzi, 1 cup", short:"sabzi", carb:10, fib:4, trad:true, nsv:true },
        { id:"salad", t:"Green salad, 2 cups", short:"salad", carb:5, fib:2, trad:false, nsv:true },
        { id:"aloo", t:"Aloo (potato) curry, 1 cup", short:"aloo curry", carb:30, fib:3, trad:true, nsv:false }] }
    ],
    // Kitchen card (plan §6 risk 4, optional; strand E, C2.6 link). Ingredients and steps are module-written.
    // VERIFY: the 2-hour cooling guidance.
    kitchen:{ title:"Dal and vegetable sabzi with whole-wheat roti", label:"Save the kitchen card", file:"kitchen-card-dal-sabzi-roti.txt", lines:[
      "Serves 4.",
      "## Ingredients",
      "- Dal: 1 cup split yellow lentils (moong or toor dal), rinsed; 4 cups water; ½ tsp turmeric; 1 tsp cumin seeds; 1 tomato; garlic and ginger",
      "- Sabzi: 4 cups mixed vegetables (for example cauliflower, green beans, peppers and spinach); 1 onion; ½ tsp each cumin, coriander and turmeric",
      "- Roti: 8 small whole-wheat roti (homemade with atta, or store-bought)",
      "- 2 tsp vegetable oil in total",
      "## Steps",
      "1. Wash your hands. Rinse the lentils.",
      "2. Simmer the lentils with the turmeric in the water for 25 to 30 minutes, until soft.",
      "3. Warm the cumin seeds, garlic, ginger and chopped tomato in a little oil, then stir them into the dal.",
      "4. Soften the onion in a little oil, add the spices and vegetables with a splash of water, cover and cook until just tender.",
      "5. Warm the roti in a dry pan.",
      "6. Plate it: half the plate sabzi, a quarter roti (2 small), a quarter dal.",
      "## Safety",
      "- Hot liquids: dal can spit as it thickens; stir with a long spoon and turn pot handles inward.",
      "- Knife safety: curl your fingertips when chopping, and cut on a steady board.",
      "- Leftovers: cool and refrigerate within 2 hours; reheat until steaming hot.",
      "## Plate note",
      "- Model values for one plate: about 60 g carbohydrate and 18 g fibre, from foods in Raj’s traditions.",
      "## Health note",
      "- General information only. For your own health, talk to a doctor, nurse or registered dietitian."
    ] }
  },
  cards:[
    ["Insulin", "Hormone from the pancreas that lets cells take up glucose."],
    ["Insulin resistance", "Cells respond less to insulin; more is needed."],
    // VERIFY: about 9 in 10 cases in Canada (card 3); Diabetes Canada definitions (card 5).
    ["Type 2 diabetes", "Resistance plus a weakening insulin supply; about 9 in 10 cases in Canada."],
    ["Type 1 diabetes", "Autoimmune destruction of beta cells; insulin needed."],
    ["Prediabetes", "Blood glucose higher than typical but below the diabetes range (as Diabetes Canada defines it)."],
    ["Glycemic index (GI)", "How fast a carbohydrate food raises blood glucose compared with a reference."],
    ["Glycemic load (GL)", "GI × carbohydrate (g) ÷ 100; accounts for amount."],
    ["Plate method", "Half non-starchy vegetables, a quarter starch, a quarter protein."],
    ["Walking after meals", "Working muscles take up glucose; peaks drop."],
    ["Social determinants", "Income, food access and stress shape diabetes risk."],
    ["Community-led prevention", "Programs designed and run with the community, grounded in culture."],
    ["Relative vs absolute reduction", "30 → 15 per 100: 50% relative, 15 per 100 absolute."]
  ]
};
