// SBI4U 42 Insulin and Glucagon. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/42-insulin-and-glucagon.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
// VERIFY: thresholds (4–7 mmol/L band, 4.0 hypoglycemia line, 10 mmol/L kidney limit) against current Diabetes Canada guidance.
// VERIFY: history details (order of events, patent sale, Nobel sharing, "since the early 1980s") before release.
const M1 = "<strong>Beta</strong> cells make insulin; <strong>alpha</strong> cells make glucagon.";
const M2 = "Glucag<strong>on</strong> is a hormone; glycog<strong>en</strong> is the stored carbohydrate that glucagon tells the liver to break down.";
const M3 = "Type 1: little or no insulin is made. Type 2: insulin is made, but cells respond poorly.";
const M4 = "Working muscles take up glucose on their own, so less insulin is needed.";
const M5 = "Insulin is a signal: it makes cells take in and store glucose. The glucose stays in the body.";
const M6 = "The kidney is working; there’s simply more glucose than its carriers can reabsorb (above about 10 mmol/L).";
const M7 = "Bacteria make insulin only after the human gene is inserted; the genetic code is shared, so they read it.";
const RULE = "Model rule: a meal adds <em>r</em>; each 2 units of insulin remove 1; a run after the meal removes 1; target 5.0 at 3 h.";
const NOTMED = "Model numbers for learning, not medical advice.";
const STRESS = "Stress hormones raise glucose to fuel a response (module 37).";

export default {
  id:"42-insulin-and-glucagon",
  kind:"topic",
  title:"Insulin and glucagon",
  topic:"Insulin and Glucagon",
  readyTopic:"insulin and glucagon",
  hero:{
    eq:'<span class="ig-heq"><span class="ig-hins">insulin</span> lowers glucose <span aria-hidden="true">⇄</span> <span class="ig-hglu">glucagon</span> raises glucose</span>',
    eqLabel:"Insulin lowers glucose; glucagon raises glucose",
    eqSize:"sm",
    headline:"Two hormones, one target",
    text:"After a meal, blood glucose rises and the <strong>beta cells</strong> of the pancreas release <strong>insulin</strong>: cells take glucose in, and the liver stores it as <strong>glycogen</strong>. Hours later, as glucose dips, <strong>alpha cells</strong> release <strong>glucagon</strong>, and the liver sends glucose back out. Each hormone switches itself off by fixing the problem that started it: <strong>negative feedback</strong>.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later. All numbers in this module are model values for learning, not medical advice.",
    fig:{ html:'<div class="ig-hero" id="ig-hero" role="img" aria-label="A balance scale. Left pan: glucose high, beta cells, insulin, glucose into cells and stored as glycogen. Right pan: glucose low, alpha cells, glucagon, liver releases glucose. The pointer sits in the 4 to 7 millimoles per litre band. Below, a 24-hour timeline: a meal at 07:00 makes glucose rise, insulin follows it up, and glucose dots enter the liver and muscle; glucose returns to 5. At 02:00 glucose dips slightly, glucagon rises, glucose dots leave the liver, and glucose levels off at 5."></div>' }
  },
  goals:[
    "I can identify the cells that release insulin and glucagon, and what each hormone makes the liver, muscle and fat cells do.",
    "I can explain blood glucose regulation as negative feedback, with meals, fasting and exercise as disturbances.",
    "I can distinguish type 1 and type 2 diabetes using glucose and insulin data.",
    "I can use the module’s model rule to predict how a meal, an insulin dose and exercise combine.",
    "I can describe how insulin was discovered in Canada and how recombinant DNA technology produces it today."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Negative feedback", goal:2,
          prompt:"In a negative feedback loop, the response…",
          options:[
            { t:"reverses the change that triggered it", ok:true, why:"It brings the variable back toward the set point." },
            { t:"makes the change larger.", why:"That’s positive feedback." },
            { t:"has no effect on the stimulus.", why:"The response acts on the stimulus." },
            { t:"permanently moves the set point.", why:"The set point stays put." }],
          hints:["‘Negative’ means opposite.", "Opposite to the change.", "It reverses it."] },
        { id:"w2", skill:"Negative feedback", goal:2,
          prompt:"Two hormones have opposite effects on the same variable. They are called…",
          options:[
            { t:"antagonistic", ok:true, why:"Like a pair of brakes and accelerator pedals on one car." },
            { t:"synergistic.", why:"Synergistic hormones work in the same direction." },
            { t:"identical.", why:"Their effects are opposite." },
            { t:"inhibitory only.", why:"One raises, one lowers." }],
          hints:["They work against each other.", "‘Anti-’ means against.", "Antagonistic."] },
        { id:"w3", skill:"Carbohydrates and storage", goal:1,
          prompt:"How do animals store glucose for later use?",
          options:[
            { t:"As glycogen, mainly in the liver and muscles", ok:true, why:"A branched chain of glucose." },
            { t:"As starch in the liver.", why:"Starch is the plant storage form." },
            { t:"As cellulose.", why:"Cellulose is a plant cell-wall material." },
            { t:"As glucagon.", why:"Glucagon is a hormone. " + M2 }],
          hints:["Plants use starch; animals use…", "It ends in ‘-gen’.", "Glycogen."] },
        { id:"w4", skill:"Carbohydrates and storage", goal:1,
          prompt:"Breaking a polysaccharide into glucose units uses which type of reaction?",
          options:[
            { t:"Hydrolysis", ok:true, why:"Water is used to split the bonds." },
            { t:"Condensation.", why:"Condensation builds the polymer and releases water." },
            { t:"Redox only.", why:"Splitting glycogen is hydrolysis." },
            { t:"Neutralization.", why:"That’s acid + base." }],
          hints:["Hydro- means water; -lysis means splitting.", "Water splits the bond.", "Hydrolysis."] },
        { id:"w5", skill:"Reading time graphs", goal:3,
          prompt:"A graph shows glucose rising after 12:00 and peaking at 13:00. When should the insulin peak be, if insulin responds to glucose?",
          options:[
            { t:"Around 13:00, as glucose peaks", ok:true, why:"Insulin follows glucose." },
            { t:"At 11:00, before the meal.", why:"Insulin responds to the rise; it doesn’t predict it." },
            { t:"At 18:00.", why:"Too late; glucose is back to normal by then." },
            { t:"Insulin stays flat all day.", why:"It rises and falls with glucose." }],
          hints:["What triggers insulin?", "High glucose.", "When glucose peaks."] },
        { id:"w6", skill:"Reading time graphs", goal:4,
          prompt:"A line starts at 5, rises by 3 and then falls by 3. Where does it end?",
          options:[
            { t:"At 5", ok:true, why:"5 + 3 − 3." },
            { t:"At 8.", why:"That forgets the fall." },
            { t:"At 2.", why:"That forgets the rise." },
            { t:"At 11.", why:"Rises and falls cancel." }],
          hints:["Start at 5.", "Add 3, then subtract 3.", "5."] }
      ],
      refreshers:{
        "Negative feedback":"The response opposes the change. Antagonistic hormones push the same variable in opposite directions.",
        "Carbohydrates and storage":"Glucose is stored as glycogen in the liver and muscles. Building glycogen is condensation; breaking it down is hydrolysis.",
        "Reading time graphs":"Read the cause first (a meal, exercise), then the responses that follow it in time."
      }
    }
  },
  explore:{
    heading:"Blood glucose day",
    intro:"Run a 24-hour day and watch glucose, insulin and glucagon. Then switch to diabetes modes and see what changes, and what insulin injections can do.",
    modelNote:"Model rules: glucose in mmol/L, hormones in arbitrary units (AU). Every value comes from fixed rules, so the same settings always give the same day. " + NOTMED,
    predIntro:"Make a prediction first. Then the day will play and show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: Normal, 07:00 (breakfast). Change: Play to 08:00. Which hormone rises over the next hour?",
        options:[{ t:"Insulin", ok:true }, { t:"Glucagon" }, { t:"Both equally" }, { t:"Neither" }],
        explain:"Glucose 8.0; insulin 70; glucagon stays 10. High glucose stimulates the beta cells.",
        start:{ mode:"normal", i:2 }, to:{ i:4 } },
      { id:"p2", prompt:"Start: Normal, 01:00. Change: Play to 04:00. No food for hours. What stops glucose from falling too low?",
        options:[{ t:"Glucagon makes the liver release glucose from glycogen", ok:true }, { t:"Insulin makes the liver release glucose" }, { t:"Muscles release glucose into the blood" }, { t:"Nothing; glucose falls steadily" }],
        explain:"Glucose holds at 4.8; glucagon 14; the liver arrow points out. Glucagon’s job is to raise glucose between meals. " + M2,
        start:{ mode:"normal", i:38 }, to:{ i:44 } },
      { id:"p3", prompt:"Start: Type 1, untreated, 12:00. Change: Play to 14:00. What happens?",
        options:[{ t:"Glucose climbs to 14 mmol/L and appears in urine", ok:true }, { t:"Glucose returns to 5" }, { t:"Glucagon brings glucose down" }, { t:"The kidneys stop working" }],
        explain:"Glucose 14.0; glucose in urine: yes. With no insulin, cells can’t take up glucose. Above about 10 mmol/L, the kidneys can’t reabsorb it all. " + M6,
        start:{ mode:"t1u", i:12 }, to:{ i:16 } },
      { id:"p4", prompt:"Start: Normal, 08:00. Change: switch to Type 2 at the same time. Compared with Normal, insulin is…",
        options:[{ t:"Higher, yet glucose is also higher", ok:true }, { t:"Lower, which is why glucose is high" }, { t:"The same" }, { t:"Zero" }],
        explain:"Insulin is twice the normal formula (200 AU instead of 70), and glucose is 9.5. In insulin resistance, the pancreas makes plenty of insulin, but cells respond poorly. " + M3,
        start:{ mode:"normal", i:4 }, to:{ mode:"t2" } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Normal mode: find the time after breakfast when insulin is highest.",
        why:"Glucose peaks 1 hour after the meal (8.0 mmol/L with a medium breakfast), and insulin follows it.",
        general:"Move the time to the moment insulin peaks after breakfast.",
        hints:["Insulin follows glucose.", "When does glucose peak after a meal?", "1 hour after: 08:00."] },
      { id:"tc2", goal:[2, 4], prompt:"Type 1 with insulin, medium meals, no run: set the doses so glucose is 5.0 three hours after <strong>every</strong> meal.",
        why:"A medium meal adds 3, and each 2 units remove 1, so 6 units bring every meal back to 5.0.",
        general:"Each 2 units lower the 3-h value by 1.",
        hints:["Each 2 units lower the 3-h value by 1.", "A medium meal adds 3.", "3 × 2 = 6 units."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Type 1 with insulin: a run follows lunch. Choose the lunch dose so glucose is 5.0 three hours after lunch and never below 4.0.",
        why:"The meal adds 3 and the run removes 1, so the dose must remove 2: 4 units. " + M4,
        general:"The meal adds 3; the run removes 1.",
        hints:["What does exercise do to glucose?", "Muscles take glucose in during the run, lowering the 3-h value by 1.", "The meal adds 3 and the run removes 1, so the dose must remove 2: 4 units."] }
    ]
  },
  part3:{
    slug:"discovery", name:"Discovery", heading:"A Canadian discovery",
    intro:"The day simulator shows the loop. Here you use historical and lab data: how insulin was found in Toronto, how bacteria make it today, and how a dish experiment shows insulin at work.",
    panel:"Check it with data",
    s1:{ title:"Station 1: Toronto, 1921–22",
      how:"Put the events in order. Tap an event, then use Move up and Move down. Press Check when the order is right.",
      // VERIFY: order of events, dates and the patent / Nobel-sharing details before release (plan §6, risk 3).
      events:[
        "Frederick Banting proposes isolating the pancreas’s internal secretion (1920).",
        "Banting and Charles Best begin experiments in J. J. R. Macleod’s laboratory at the University of Toronto (1921).",
        "James Collip purifies the extract so it is safe enough for people (winter 1921–22).",
        "A teenage patient with diabetes is successfully treated at Toronto General Hospital (January 1922).",
        "The Nobel Prize goes to Banting and Macleod (1923); Banting shares his award with Best, and Macleod shares his with Collip."],
      start:[2, 4, 0, 3, 1],
      orderWhy:"Proposal → first experiments → purification → first successful treatment → Nobel Prize.",
      patent:"The discoverers sold the patent to the University of Toronto for a token sum so insulin could be made widely.",
      dataNote:"Model data illustrating the reported result.",
      days:[{ d:0, g:25, u:"yes" }, { d:1, g:15, u:"yes" }, { d:2, g:9, u:"no" }, { d:3, g:7, u:"no" }],
      tapPrompt:"Tap the first day glucose drops below the kidney limit (10 mmol/L). Then explain why the urine test changes then.",
      dayFb:[
        "Day 0 is before treatment: 25 mmol/L is far above the kidney limit.",
        "15 mmol/L is still above the kidney limit, so glucose still spills into the urine.",
        "",
        "Glucose is below the limit on day 3, but it first dropped below it a day earlier."],
      dayRight:"Day 2: glucose 9 mmol/L is below the kidney limit, so the kidney’s carriers reabsorb all the filtered glucose and none is left in the urine. " + M6 },
    s2:{ title:"Station 2: from pancreases to bacteria",
      // VERIFY: "since the early 1980s" before release.
      text:"<ul><li>Early insulin came from cow and pig pancreases.</li><li>Since the early 1980s, human insulin has been made by bacteria (or yeast) given the human insulin gene in a plasmid, cut and joined with restriction enzymes and ligase (module 33). It was the first medicine made by recombinant DNA.</li></ul>",
      how:"Match each feature of recombinant insulin to what it makes possible. Tap a feature, then tap its result.",
      left:[
        { id:"f1", t:"Same amino acid sequence as human insulin" },
        { id:"f2", t:"Grown in large fermenters" },
        { id:"f3", t:"Genetic code shared by bacteria and humans" }],
      right:[
        { id:"r2", t:"Reliable supply" },
        { id:"r3", t:"Bacteria can read the human gene" },
        { id:"r1", t:"Fewer immune reactions" }],
      pairs:{ f1:"r1", f2:"r2", f3:"r3" },
      pairWhy:{ f1:"The body recognizes it as its own hormone.", f2:"Big tanks of bacteria make insulin in large, steady amounts.", f3:M7 },
      wrong:"Not quite. Ask what that feature makes possible.",
      wrongF3:M7 },
    s3:{ title:"Station 3: test it in a dish (investigation)",
      how:"Muscle cells in three dishes. Glucose taken up in 1 hour (AU).",
      dataNote:"Model data.",
      dishes:[{ t:"No insulin", v:10 }, { t:"Insulin", v:50 }, { t:"Insulin + a drug that blocks insulin receptors", v:12 }],
      q1:{ prompt:"Which dish is the control?", choices:[{ t:"No insulin", ok:true }, { t:"Insulin" }, { t:"Insulin + receptor blocker" }],
        right:"The control shows uptake without the factor being tested: insulin.", wrong:"The control shows uptake without the factor being tested." },
      q2:{ prompt:"What does the third dish show?", choices:[
          { t:"Insulin works through its receptor; block the receptor, and uptake stays low, as in insulin resistance.", ok:true },
          { t:"The drug destroys glucose." },
          { t:"Insulin has no effect on muscle cells." },
          { t:"The blocker makes cells take up more glucose." }],
        right:"Insulin works through its receptor; block the receptor, and uptake stays low, as in insulin resistance.",
        wrong:"Compare the third dish with the other two: insulin is present, yet uptake is close to the no-insulin dish." } },
    quickCheck:{
      title:"A Canadian discovery quick check", summary:"A Canadian discovery quick check",
      items:[
        { id:"q1", goal:5, prompt:"Who purified the extract so it could be used safely in people?",
          right:"Banting and Best did the first experiments; Collip purified the extract.", wrong:"Banting and Best did the first experiments; Collip purified the extract.",
          choices:[{ t:"James Collip", ok:true }, { t:"Charles Best" }, { t:"J. J. R. Macleod" }, { t:"Frederick Banting" }] },
        { id:"q2", goal:5, prompt:"Why can bacteria make human insulin?",
          right:M7, wrong:M7,
          choices:[{ t:"The human gene was inserted, and the genetic code is shared", ok:true }, { t:"Bacteria naturally make insulin" }, { t:"Bacteria eat pancreas tissue" }, { t:"Insulin forms by itself in sugar water" }] },
        { id:"q3", goal:2, prompt:"In the dish experiment, which dish is the control?",
          right:"The control shows uptake without the factor being tested.", wrong:"The control shows uptake without the factor being tested.",
          choices:[{ t:"No insulin", ok:true }, { t:"Insulin" }, { t:"Insulin + receptor blocker" }, { t:"All three" }] },
        { id:"q4", goal:2, prompt:"Why did glucose disappear from the patient’s urine by day 2?",
          right:"Below that level the kidneys reabsorb all the glucose.", wrong:"Below that level the kidneys reabsorb all the glucose. " + M6,
          choices:[{ t:"Blood glucose fell below about 10 mmol/L", ok:true }, { t:"The kidneys stopped filtering" }, { t:"The patient stopped eating" }, { t:"Insulin is excreted in urine" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Raises or lowers?", summary:"Raises or lowers?", goal:[1, 2], noun:"card", txt:true,
        instruction:"Sort each hormone, process or event by its effect on blood glucose.",
        boxes:[{ id:"lo", label:"Lowers blood glucose" }, { id:"hi", label:"Raises blood glucose" }],
        wrongDefault:"Does it put glucose into the blood or take it out?",
        items:[
          { id:"i1", t:"Insulin", answer:"lo", why:"Insulin makes cells take up glucose and the liver store it." },
          { id:"i2", t:"Glucagon", answer:"hi", why:"Glucagon makes the liver release glucose.", wrong:{ lo:"Glucagon raises glucose; insulin lowers it." } },
          { id:"i3", t:"Liver building glycogen (glycogenesis)", answer:"lo", why:"Building glycogen stores glucose, taking it out of the blood.", wrong:{ hi:"Building glycogen stores glucose, taking it out of the blood. " + M2 } },
          { id:"i4", t:"Liver breaking down glycogen (glycogenolysis)", answer:"hi", why:"Breaking glycogen down sends glucose into the blood." },
          { id:"i5", t:"Liver making glucose from amino acids (gluconeogenesis)", answer:"hi", why:"New glucose goes into the blood.",
            hints:["Gluco-neo-genesis: glucose, new, making.", "New glucose goes into the blood.", "Raises."] },
          { id:"i6", t:"Muscle and fat cells taking up glucose", answer:"lo", why:"Glucose leaves the blood and enters the cells." },
          { id:"i7", t:"Eating a meal", answer:"hi", why:"Digested carbohydrate enters the blood as glucose." },
          { id:"i8", t:"A 30-minute run", answer:"lo", why:"Working muscles use glucose.", wrong:{ hi:"Working muscles use glucose. " + M4 } },
          { id:"i9", t:"Epinephrine during a sudden scare", answer:"hi", why:STRESS, wrong:{ lo:STRESS } },
          { id:"i10", t:"Cortisol during long-term stress", answer:"hi", why:STRESS, wrong:{ lo:STRESS } }
        ] },
      { id:"chart", type:"custom", title:"Read the glucose chart", summary:"Read the glucose chart", star:true, goal:[3, 4],
        instruction:"Six problems on glucose charts and the dose rule. R3 to R6 are non-routine (★).",
        how:"",
        rule:RULE + " " + NOTMED,
        items:[
          { id:"r1", kind:"mc", goal:3, prompt:"Chart A: glucose 13 mmol/L at noon and rising; insulin near 0 all day. Which pattern?",
            options:[
              { t:"Type 1, untreated", ok:true, why:"Glucose keeps climbing because almost no insulin is made." },
              { t:"Type 2 (insulin resistance)", why:"In type 2, insulin is usually high. " + M3 },
              { t:"Normal", why:"In a normal day, insulin rises after meals and glucose returns to about 5." },
              { t:"Type 1 with insulin", why:"Injected insulin would show up, and glucose would come back toward 5." }],
            hints:["Look at the insulin line first.", "Insulin near 0 means the beta cells aren’t making it.", "Type 1, untreated."] },
          { id:"r2", kind:"mc", goal:3, prompt:"Chart B: glucose 9.5 mmol/L at 15:00; insulin twice the normal level. Which pattern?",
            options:[
              { t:"Type 2 (insulin resistance)", ok:true, why:"Plenty of insulin, yet glucose stays high: the cells respond poorly." },
              { t:"Type 1, untreated", why:"Type 1 has little insulin; this chart has plenty. " + M3 },
              { t:"Normal", why:"Normal glucose is back to 5.0 three hours after lunch." },
              { t:"Type 1 with insulin", why:"In type 1 the body makes little insulin; twice the normal level points to resistance." }],
            hints:["Is insulin low or high?", "High insulin with high glucose means the cells aren’t responding.", "Type 2 (insulin resistance)."] },
          { id:"r3", kind:"num", goal:4, star:true, prompt:"Large meal (+4), no run. Dose to reach 5.0 at 3 h?",
            answer:8, display:"8 units", unit:"units",
            why:"The meal adds 4, and 8 units remove 4: 5 + 4 − 4 = 5.0.",
            wrong:[{ match:6, fb:"6 units remove 3; a large meal adds 4." }],
            general:"A large meal adds 4, and each 2 units remove 1.",
            hints:["How much does a large meal add?", "It adds 4, so the dose must remove 4.", "4 × 2 = 8 units."] },
          { id:"r4", kind:"num", goal:4, star:true, prompt:"Medium meal (+3), run after the meal. Dose to reach 5.0 at 3 h?",
            answer:4, display:"4 units", unit:"units",
            why:"5 + 3 = 8; the run takes 1 off (7); 4 units remove the last 2.",
            wrong:[{ match:6, fb:"The run removes 1 already. " + M4 }],
            general:"Start from 5 + 3 = 8, then count what the run removes.",
            hints:["Start from 5 + 3 = 8.", "The run takes 1 off: 7.", "Remove 2 more: 4 units."] },
          { id:"r5", kind:"mc", goal:3, star:true, prompt:"On chart A, the kidney limit is about 10 mmol/L. Glucose is 8.0 at 06:00, 11.0 after breakfast, 14.0 after lunch. From which meal on is glucose in the urine, and why?",
            options:[
              { t:"From breakfast on: 11.0 is above the limit", ok:true, why:"Above about 10 mmol/L, the kidneys can’t reabsorb all the filtered glucose." },
              { t:"Before breakfast: 8.0 is already high", why:"8.0 is below 10; the kidneys reabsorb it all. " + M6 },
              { t:"From lunch on: 14.0 is above the limit", why:"11.0 after breakfast is already above the limit." },
              { t:"Never: the kidneys are healthy", why:M6 }],
            hints:["Compare each value with 10.", "8.0 is below 10; 11.0 is above.", "From breakfast on."] },
          { id:"r6", kind:"mc", goal:4, star:true, prompt:"<strong>Investigation:</strong> You want to test whether a run lowers your 3-h glucose after breakfast. Which comparison is fair?",
            options:[
              { t:"The same breakfast and dose on two days, one with a run and one without", ok:true, why:"Only the run changes, so any difference in the 3-h glucose comes from the run." },
              { t:"Different breakfasts on two days", why:"Change only the variable you’re testing; keep the meal and dose the same." },
              { t:"A run one day and a large dinner the next", why:"Change only the variable you’re testing; keep the meal and dose the same." },
              { t:"Two different people, one runs", why:"Change only the variable you’re testing; keep the meal and dose the same." }],
            hints:["What is the one variable you’re testing?", "The run. Everything else must stay the same.", "Same breakfast and dose; run one day, not the other."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Emeka", how:"",
        instruction:"Emeka made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain what happens after a meal.",
            steps:["After a meal, blood glucose rises.", "Alpha cells in the islets release insulin.", "Muscle and fat cells take up glucose.", "The liver stores glucose as glycogen, and blood glucose falls."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"Beta cells in the islets release insulin.", ok:true, why:M1 },
              { t:"Alpha cells release glucagon.", why:"Glucagon is for low glucose, not after a meal." },
              { t:"The liver releases insulin.", why:"Insulin comes from the pancreas." },
              { t:"Step 2 is correct.", why:"Alpha cells make glucagon; beta cells make insulin." }],
            hints:["Which islet cells respond to high glucose?", "Beta cells.", "Beta → insulin."] },
          { id:"e2", goal:3, task:"Explain type 1 diabetes.",
            steps:["In type 1 diabetes, body cells ignore insulin even though plenty is made.", "So glucose stays high after meals.", "Above about 10 mmol/L, glucose appears in urine.", "Injected insulin, matched to food and activity, is the treatment."],
            answer:0,
            stepFb:["", "Step 2 is true, but step 1’s cause is wrong.", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"In type 1 diabetes, the immune system destroys the beta cells, so little or no insulin is made.", ok:true, why:M3 },
              { t:"In type 1 diabetes, the liver can’t store glycogen.", why:"The liver is fine; insulin is missing." },
              { t:"In type 1 diabetes, alpha cells make too much insulin.", why:M1 },
              { t:"Step 1 is correct.", why:"That describes insulin resistance, the main feature of type 2." }],
            hints:["Is insulin present in type 1?", "Very little.", "The beta cells are destroyed."] },
          { id:"e3", goal:4, task:"Medium meal (+3) at lunch, then a 30-minute run (−1). What dose returns glucose to 5.0 at 3 h?",
            steps:["Start at 5.0; the meal adds 3, giving 8.0.", "Each 2 units of insulin remove 1.", "To remove 3, I need 6 units.", "So the dose is 6 units."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The run removes 1, so insulin must remove only 2: 4 units.", ok:true, why:M4 },
              { t:"The run adds 1, so I need 8 units.", why:"Exercise lowers glucose. " + M4 },
              { t:"To remove 3, I need 3 units.", why:"Each 2 units remove 1." },
              { t:"Step 3 is correct.", why:"With the run as well, 6 units would take glucose to 4.0. " + M4 }],
            hints:["What else lowers glucose after this lunch?", "The run removes 1.", "8 − 1 = 7; remove 2 more: 4 units."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: insulin being high in type 2, or how exercise changes the dose?" },
      { id:"j2", q:"In your own words, why are insulin and glucagon an example of negative feedback?" },
      { id:"j3", q:"Explain to a friend why glucose shows up in urine in untreated diabetes, even though the kidneys are healthy." },
      { id:"j4", q:"Insulin was discovered in Toronto and is now made by bacteria. What do you think was the most important step from discovery to everyday treatment, and why?" }
    ]
  },
  final:{
    intro:"Ten questions, no hints. Dose questions use the module’s model rule (stated in each question); the numbers are model values, not medical advice.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which cells release insulin?", options:[
          { t:"Beta cells of the pancreatic islets", ok:true, why:M1 },
          { t:"Alpha cells of the pancreatic islets.", why:M1 },
          { t:"Liver cells.", why:"The liver responds to insulin." },
          { t:"Cells of the adrenal gland.", why:"They release epinephrine." }] },
        b:{ prompt:"Which cells release glucagon?", options:[
          { t:"Alpha cells of the pancreatic islets", ok:true, why:M1 },
          { t:"Beta cells of the pancreatic islets.", why:M1 },
          { t:"Muscle cells.", why:"Muscles store glycogen but don’t release glucagon." },
          { t:"Cells of the anterior pituitary.", why:"Not part of this loop." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"What is glycogenolysis?", options:[
          { t:"The breakdown of glycogen into glucose, mainly in the liver", ok:true, why:"Glycogen-lysis: splitting glycogen. Glucagon triggers it." },
          { t:"The building of glycogen from glucose.", why:"That’s glycogenesis." },
          { t:"The release of glucagon.", why:M2 },
          { t:"Making glucose from amino acids.", why:"That’s gluconeogenesis." }] },
        b:{ prompt:"What does insulin make the liver do?", options:[
          { t:"Take up glucose and store it as glycogen", ok:true, why:"Insulin lowers blood glucose: the liver stores it as glycogen." },
          { t:"Break glycogen down into glucose.", why:"That’s glucagon’s effect." },
          { t:"Release glucagon.", why:M2 },
          { t:"Excrete glucose into bile.", why:"The liver stores glucose." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"What is the main cause of type 1 diabetes?", options:[
          { t:"The immune system destroys the beta cells, so little insulin is made", ok:true, why:M3 },
          { t:"Cells respond poorly to insulin.", why:M3 },
          { t:"The liver makes too much glycogen.", why:"Glycogen storage isn’t the cause." },
          { t:"Eating too much sugar in childhood.", why:"Type 1 is autoimmune." }] },
        b:{ prompt:"What is insulin resistance, the main feature of type 2 diabetes?", options:[
          { t:"Cells respond poorly to insulin, so glucose stays high even with plenty of insulin", ok:true, why:M3 },
          { t:"The beta cells are destroyed.", why:"That’s type 1. " + M3 },
          { t:"Glucagon is missing.", why:"Glucagon isn’t the problem." },
          { t:"The kidneys can’t filter glucose.", why:"The kidneys aren’t the cause." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Data: fasting glucose 9.0 mmol/L; insulin much higher than normal. Which explanation fits best?", options:[
          { t:"Insulin resistance (type 2 pattern)", ok:true, why:"High glucose with high insulin: the cells respond poorly." },
          { t:"No insulin is made (type 1 pattern).", why:"Insulin is high, not missing. " + M3 },
          { t:"Too much glucagon only.", why:"That doesn’t explain the high insulin." },
          { t:"A normal result after an overnight fast.", why:"Fasting glucose above 7 is above the band." }] },
        b:{ prompt:"Data: glucose 15 mmol/L after lunch; insulin almost zero; glucose in urine. Which explanation fits best?", options:[
          { t:"Little or no insulin is made (type 1 pattern)", ok:true, why:"High glucose with almost no insulin: the beta cells aren’t making it." },
          { t:"Insulin resistance (type 2 pattern).", why:"Insulin would be high in that case. " + M3 },
          { t:"Kidney failure.", why:M6 },
          { t:"A normal response to a large lunch.", why:"Healthy insulin would bring glucose back down." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:RULE + " A large meal (+4) with no run. What dose?", options:[
          { t:"8 units", ok:true, why:"8 units remove 4: 5 + 4 − 4 = 5.0." },
          { t:"4 units", why:"4 units remove 2, leaving 7.0." },
          { t:"6 units", why:"6 units remove 3, leaving 6.0." },
          { t:"10 units", why:"10 units remove 5, leaving 4.0." }] },
        b:{ prompt:"Same rule (" + RULE.replace("Model rule: ", "").replace(/\.$/, "") + "). A medium meal (+3) followed by a run. What dose?", options:[
          { t:"4 units", ok:true, why:"5 + 3 − 1 = 7.0 after the run; 4 units remove the last 2." },
          { t:"6 units", why:"The run removes 1, so 6 units would leave 4.0. " + M4 },
          { t:"8 units", why:"Exercise lowers glucose; it doesn’t call for more insulin. " + M4 },
          { t:"2 units", why:"2 units remove 1: 5 + 3 − 1 − 1 = 6.0." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"A rare condition stops the liver responding to glucagon. When is the person most at risk of low blood glucose?", options:[
          { t:"During long fasts, such as overnight, because the liver can’t release stored glucose", ok:true, why:"Between meals, glucagon is what makes the liver send glucose out." },
          { t:"Right after meals, because insulin is high.", why:"After meals, glucose is high." },
          { t:"Never, because insulin can raise glucose.", why:"Insulin lowers glucose." },
          { t:"Only during sleep, because glucagon is made only then.", why:"Glucagon is released whenever glucose falls." }] },
        b:{ prompt:"A tumour of beta cells releases insulin all the time, even when glucose is low. What happens?", options:[
          { t:"Glucose falls too low, and glucagon rises to try to correct it", ok:true, why:"Insulin keeps lowering glucose; the falling glucose triggers the alpha cells." },
          { t:"Glucose rises because of extra insulin.", why:"Insulin lowers glucose." },
          { t:"Nothing, because glucagon cancels it exactly.", why:"A constant insulin release can overwhelm the correction." },
          { t:"Glucose appears in urine.", why:"That happens when glucose is high." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of how insulin returns blood glucose to normal after a meal?", options:[
          { t:"“Rising glucose stimulates beta cells to release insulin; insulin makes muscle and fat cells take up glucose and the liver store it as glycogen, so blood glucose falls and insulin release slows.”", ok:true, why:"Stimulus, hormone, effects and the loop switching itself off: negative feedback." },
          { t:"“Insulin breaks glucose down into water and carbon dioxide in the blood.”", why:M5 },
          { t:"“Insulin carries glucose out of the body in urine.”", why:M5 },
          { t:"“Glucagon is converted into insulin after a meal.”", why:M2 }] },
        b:{ prompt:"Which is the best explanation of why glucose appears in urine in untreated diabetes?", options:[
          { t:"“Blood glucose is so high that more glucose is filtered into the nephrons than the carriers can reabsorb, so the excess stays in the urine.”", ok:true, why:M6 },
          { t:"“The kidneys are damaged and leak glucose.”", why:"The kidneys are working at full capacity. " + M6 },
          { t:"“Insulin makes the kidneys release glucose.”", why:"Insulin is low or ineffective here." },
          { t:"“Glucagon sends glucose to the bladder.”", why:"Glucagon acts on the liver." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which flow chart is correct?", options:[
          { t:"Glucose low → alpha cells → glucagon → liver breaks down glycogen → glucose rises", ok:true, why:"Low glucose triggers the alpha cells; glucagon makes the liver release glucose." },
          { t:"Glucose low → beta cells → insulin → liver stores glycogen → glucose rises", why:"That lowers glucose." },
          { t:"Glucose low → alpha cells → glycogen → liver releases glucagon", why:M2 },
          { t:"Glucose high → alpha cells → glucagon → glucose falls", why:"Glucagon raises glucose." }] },
        b:{ prompt:"Which statement uses the terms correctly?", options:[
          { t:"“Insulin and glucagon are antagonistic hormones: insulin lowers blood glucose and glucagon raises it.”", ok:true, why:"Antagonistic: opposite effects on the same variable." },
          { t:"“Insulin and glucagon are synergistic: both lower glucose.”", why:"They work in opposite directions." },
          { t:"“Glycogen is the hormone that raises glucose.”", why:M2 },
          { t:"“Glucagon is stored in the liver as glycogen.”", why:M2 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Today most insulin is made by microorganisms. Why can bacteria make human insulin?", options:[
          { t:"The human insulin gene was inserted into a plasmid, and bacteria read the same genetic code", ok:true, why:M7 },
          { t:"Bacteria have always made human insulin.", why:M7 },
          { t:"Bacteria convert sugar into insulin without any gene.", why:"Proteins are made from genes." },
          { t:"The insulin is taken from human pancreases and copied by bacteria.", why:"The gene, not the protein, is put into the bacteria." }] },
        b:{ prompt:"Why did recombinant human insulin replace insulin from pig and cow pancreases?", options:[
          { t:"It has the same amino acid sequence as human insulin and can be made reliably in large amounts", ok:true, why:"Fewer immune reactions and a reliable supply." },
          { t:"Animal insulin doesn’t lower glucose at all.", why:"It does; it differs slightly in sequence." },
          { t:"Bacteria make insulin naturally, so it was cheaper to collect.", why:M7 },
          { t:"Recombinant insulin needs no injection.", why:"It’s still injected." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"An athlete with type 1 diabetes usually takes 6 units with a medium lunch. Today a training session follows lunch. Using the model rule (" + RULE.replace("Model rule: ", "").replace(/\.$/, "") + "), what should the lunch dose be to reach 5.0 at 3 h?", options:[
          { t:"4 units, because exercising muscles take up glucose too", ok:true, why:M4 },
          { t:"8 units, because exercise uses energy.", why:M4 },
          { t:"6 units, because exercise doesn’t affect glucose.", why:"The run removes 1." },
          { t:"0 units, because exercise replaces insulin completely.", why:"0 units leaves 5 + 3 − 1 = 7.0." }] },
        b:{ prompt:"Someone with type 1 diabetes took their usual dose, then ran, and now feels shaky with glucose at 3.5 mmol/L. Which response would raise glucose most directly, and why?", options:[
          { t:"Fast-acting sugar, because it is absorbed quickly into the blood", ok:true, why:"Low glucose needs glucose in the blood quickly." },
          { t:"More insulin, to help cells use glucose.", why:"Insulin would lower glucose further." },
          { t:"A long run, to burn off the insulin.", why:"Exercise lowers glucose. " + M4 },
          { t:"Waiting for the next meal.", why:"Low glucose needs a prompt response." }] } }
    ]
  },
  task:{
    title:"Plan a model day", summary:"Plan a model day",
    statement:"<p>Plan meal sizes, insulin doses and one run for a model day with type 1 diabetes. Meet every condition. These are model numbers for learning, not a real treatment plan. Can you find all the answers?</p><ol class=\"ig-conds\"><li>Every meal returns glucose to exactly 5.0 mmol/L three hours later.</li><li>There is a 30-minute run after exactly one meal.</li><li>The total insulin for the day is at most 14 model units.</li><li>Lunch is the large meal.</li></ol>",
    model:"Each meal’s 3-h value = 5 + <em>r</em> − <em>d</em>/2 − <em>e</em> (<em>e</em> = 1 if the run follows that meal).",
    checks:["Every meal back to 5.0", "One run", "Total insulin ≤ 14", "Large lunch"],
    tips:["For each meal, the dose must remove what the meal adds, minus anything the run removes.", "Pick one meal to follow with a run.", "Each meal size adds 2 units to the total. Smaller meals elsewhere leave room for a large lunch.", "Set lunch to large."],
    explainPrompt:"Explain how you chose each dose, including how the run changed one of them.",
    vocab:"Use the words insulin, glucose uptake, set point and negative feedback.",
    more:"Can you find all the answers?",
    after3:"The total is always 2 × (2 + 4 + 2 − 1) = 14. A run anywhere saves 2 units, and a large lunch forces small meals elsewhere."
  },
  cards:[
    ["Islets of Langerhans", "Clusters of hormone cells in the pancreas: beta cells (insulin) and alpha cells (glucagon)."],
    ["Insulin", "Released when glucose is high; makes cells take up glucose and the liver store glycogen. Lowers blood glucose."],
    ["Glucagon", "Released when glucose is low; makes the liver break down glycogen and make new glucose. Raises blood glucose."],
    ["Glycogen", "The animal storage form of glucose, in the liver and muscles. (Not the same as glucagon!)"],
    ["Glycogenesis vs glycogenolysis", "Building glycogen (insulin) vs breaking it down (glucagon)."],
    ["Gluconeogenesis", "Making new glucose from non-carbohydrates, such as amino acids."],
    ["Normal fasting glucose (model)", "About 4–7 mmol/L."],
    ["Type 1 diabetes", "The immune system destroys the beta cells: little or no insulin. Treated with insulin."],
    ["Type 2 diabetes", "Insulin resistance: cells respond poorly; insulin is often high."],
    ["Glucose in urine", "Appears above about 10 mmol/L, when the kidneys can’t reabsorb it all."],
    ["Exercise and glucose", "Working muscles take up glucose, so glucose falls (and less insulin is needed)."],
    ["Toronto, 1921–22", "Banting, Best, Macleod and Collip discover and purify insulin; Nobel Prize 1923."]
  ]
};
