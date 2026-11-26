// HFA4U 11 Cardiovascular Disease. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/11-cardiovascular-disease.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or text the builder had to supply. Every model value (labels, sodium sources, café menu) is model data
// and labelled on screen. Care note (plan §1 and §6): the artery model is a population-level teaching model for fictional
// personas only; nothing asks students about their own or their family's health, and no feedback blames individuals.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p><p>' + ADVICE + "</p></div>";

// Misconception core sentences (plan §3), used where an option or item names the misconception without its own feedback
// VERIFY: the share of sodium from processed and restaurant foods (M3).
const M1 = "Plaque grows inside the artery wall over years. Most heart attacks happen when a plaque ruptures and a clot forms.";
const M2 = "Replacing saturated and trans fats with unsaturated fats (olive or canola oil, nuts, fish) lowers LDL.";
const M3 = "Most sodium in Canadian diets comes from processed and restaurant foods.";
const M4 = "Age and family history set a starting point; eating, activity and smoking still change risk.";
const M5 = "This is a teaching model for fictional personas, built from population patterns. Only a health professional can assess a real person.";
const M6 = "Cost, time and access to food shape choices. Prevention has to work at the community level too.";
const M7 = "People who eat more nuts may differ in many ways. A randomized trial is needed to test cause.";
const NB = " "; // no-break space for 10 000

// ---------- Activity 1 (tap-to-sort): one helper per factor; the plan's misplaced line is the feedback for both wrong boxes ----------
const BOX = { mod:"Modifiable", non:"Non-modifiable", soc:"Social conditions" };
const sortItem = (id, t, box, line) => {
  const wrong = {}; Object.keys(BOX).filter(k => k !== box).forEach(k => { wrong[k] = line; });
  return { id, t, answer:box, why:line, wrong,
    hints:["Could this person change it themselves, tomorrow?", "If it depends on money, place or time, it’s a social condition.", BOX[box] + "."] };
};

// ---------- sorter box icons (stroke only; colour is never the only signal: every box has its word) ----------
const ICO_MOD = '<svg class="cv-bico mod" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2.4"/><circle cx="15" cy="17" r="2.4"/></svg>';
const ICO_NON = '<svg class="cv-bico non" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const ICO_SOC = '<svg class="cv-bico soc" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V10l5-4 5 4v10M13 20v-7h8v7M3 20h18"/><path d="M7 20v-4h2v4"/></svg>';

export default {
  id:"11-cardiovascular-disease",
  kind:"topic",
  title:"Cardiovascular disease",
  topic:"Cardiovascular Disease",
  readyTopic:"cardiovascular disease",
  hero:{
    headline:"Your arteries keep score for decades",
    text:"Heart disease and stroke build slowly. <strong>Atherosclerosis</strong> (plaque growing inside artery walls) is shaped by <strong>blood pressure</strong> and <strong>LDL cholesterol</strong>, and eating patterns push on both. Some risk factors you can change; some you can’t; and some depend on where and how people live.",
    fig:{ html:'<div class="cv-hero" id="cv-hero"></div>', caption:"" },
    chips:[{ id:"na", t:"Sodium → blood pressure" }, { id:"sf", t:"Saturated fat → LDL" }, { id:"fi", t:"Soluble fibre → LDL ↓" }],
    chipB:"eating pattern + activity",
    caption:"Most heart attacks begin here: a rupture and a clot.",
    // storyboard captions (plan hero storyboard steps 1, 2 and 5, as captions)
    caps:{ start:"A healthy artery: blood flows smoothly.", grow:"Over decades, a thin streak in the wall thickens into plaque, and the opening narrows.", second:"Rewind: a second artery, with an eating pattern + activity, grows much less plaque." },
    aria:"Two lengthwise views of an artery, with blood flowing as dots through the opening. Over a timeline from age 20 to 60, plaque grows inside the first artery’s wall and narrows the opening; at 60 the plaque’s cap cracks, platelets gather, a clot forms and the flow stops. The timeline rewinds and a second artery, labelled “eating pattern + activity”, grows much less plaque and keeps flowing.",
    rmAria:"Before and after, side by side. Top row: the first artery at age 20 is wide open; at 60 its plaque has ruptured and a clot blocks the flow. Bottom row, labelled “eating pattern + activity”: the second artery at age 20 is wide open; at 60 it has only a little plaque and blood still flows."
  },
  goals:[
    "I can explain how atherosclerosis develops and how it leads to a heart attack or stroke.",
    "I can explain how sodium, saturated and trans fats, unsaturated fats and soluble fibre affect blood pressure and LDL cholesterol.",
    "I can sort CVD risk factors into modifiable and non-modifiable, and explain how social conditions shape them.",
    "I can use a population model to reason about how changing several factors changes risk, without treating it as a personal prediction.",
    "I can read a Nutrition Facts table to find sodium and judge %DV using the 5% / 15% guide.",
    "I can evaluate personal and community strategies to prevent CVD."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Types of fat", goal:2,
          prompt:"Which fat is mostly unsaturated?",
          options:[
            { t:"Canola oil", ok:true, why:"Liquid plant oils like canola and olive are mostly unsaturated." },
            { t:"Butter", why:"Butter is high in saturated fat." },
            { t:"Coconut oil", why:"It’s a plant oil, but it’s mostly saturated." },
            { t:"Lard", why:"Animal fats like lard are high in saturated fat." }],
          hints:["Is it solid or liquid at room temperature?", "Most liquid plant oils are unsaturated, with one notable exception.", "Canola oil."] },
        // VERIFY: the date of Canada's ban on partially hydrogenated oils (plan flag on this prompt).
        { id:"w2", skill:"Types of fat", goal:2,
          prompt:"Why did Canada ban partially hydrogenated oils (the main source of industrial trans fat) in foods?",
          options:[
            { t:"Trans fats raise LDL and lower HDL, increasing heart disease risk", ok:true, why:"They harm both lipoproteins." },
            { t:"They add too many calories compared with other fats", why:"All fats give 9 kcal/g; the issue is their effect on blood lipids." },
            { t:"They spoil quickly", why:"They were used <em>because</em> they kept foods fresh." },
            { t:"They contain sodium", why:"Fats don’t contain sodium." }],
          hints:["Think blood cholesterol.", "Which lipoproteins change?", "LDL up, HDL down."] },
        { id:"w3", skill:"Minerals and fibre", goal:2,
          prompt:"Which mineral is most closely linked to raising blood pressure when eaten in excess?",
          options:[
            { t:"Sodium", ok:true, why:"For many people, more sodium means higher blood pressure." },
            { t:"Calcium", why:"Calcium matters for bones; it isn’t the main blood-pressure concern." },
            { t:"Iron", why:"Iron carries oxygen in hemoglobin." },
            { t:"Potassium", why:"Potassium tends to <em>help lower</em> blood pressure." }],
          hints:["Think salt.", "Table salt is sodium chloride.", "Sodium."] },
        { id:"w4", skill:"Minerals and fibre", goal:2,
          prompt:"Which food is a good source of soluble fibre?",
          options:[
            { t:"Oats", ok:true, why:"Oats, barley, beans and lentils are rich in soluble fibre." },
            { t:"Chicken breast", why:"Animal foods have no fibre." },
            { t:"Cheddar cheese", why:"Dairy has no fibre." },
            { t:"White sugar", why:"Sugar is a carbohydrate but has no fibre." }],
          hints:["Fibre comes only from plants.", "Think breakfast grains and legumes.", "Oats."] },
        { id:"w5", skill:"Reading labels", goal:5,
          prompt:"On a Nutrition Facts table, sodium is 20% DV. Using the 5% / 15% guide, that is…",
          options:[
            { t:"A lot", ok:true, why:"15% or more is a lot." },
            { t:"A little", why:"5% or less is a little." },
            { t:"Exactly the recommended amount", why:"%DV compares one serving with a daily value; it isn’t a target." },
            { t:"Impossible to judge without the serving size", why:"%DV already uses the serving shown." }],
          hints:["What are the two cut-offs?", "5% and 15%.", "20% is above 15%: a lot."] },
        // VERIFY: the sodium Daily Value (2300 mg) on Canadian labels, and the sodium CDRR.
        { id:"w6", skill:"Reading labels", goal:5,
          prompt:"The Daily Value for sodium on Canadian labels is 2300 mg. What %DV is 230 mg?",
          options:[
            { t:"10%", ok:true, why:"230 ÷ 2300 = 0.10." },
            { t:"23%", why:"That’s 230 ÷ 1000." },
            { t:"1%", why:"That’s 23 ÷ 2300." },
            { t:"100%", why:"That would be 2300 mg." }],
          hints:["Divide by 2300.", "230 is one tenth of 2300.", "10%."] }
      ],
      refreshers:{
        "Types of fat":"Unsaturated fats (most liquid plant oils, nuts, fish) are the heart-friendly choice to swap in. Saturated fats (butter, lard, coconut oil, fatty meats) and trans fats raise LDL.",
        "Minerals and fibre":"Sodium tends to raise blood pressure; potassium (vegetables, fruits, legumes) tends to lower it. Soluble fibre (oats, barley, beans) helps lower LDL.",
        // VERIFY: sodium DV 2300 mg.
        "Reading labels":"%DV: 5% or less is a little, 15% or more is a lot. Sodium’s DV is 2300 mg."
      }
    }
  },
  explore:{
    heading:"Artery and heart model",
    intro:"Change a fictional persona’s eating pattern and lifestyle and watch the model respond. <strong>This is a teaching model built from population patterns. It can’t tell any real person their risk.</strong>",
    reminder:"Teaching model: population patterns, not a personal prediction.",
    modes:[{ id:"model", t:"Persona model" }, { id:"inside", t:"Inside the artery" }, { id:"presets", t:"Eating-pattern presets" }],
    // F7 model (plan §4, "Model rules (exact)"). Levels are ordered so more points sit to the right on every control.
    factors:[
      { id:"na", t:"Sodium", unit:"mg/day", group:"eat", levels:["1500", "2300", "2800", "3300", "3800"], pts:[0, 0, 1, 1, 2], fmt:"{v} mg/day" },
      { id:"sf", t:"Saturated fat", unit:"% of energy", group:"eat", levels:["6", "10", "14", "18"], pts:[0, 0, 1, 2], fmt:"{v}% of energy" },
      { id:"fi", t:"Fibre-rich foods", sub:"beans, oats, vegetables, whole grains", group:"eat", levels:["many", "some", "few"], pts:[0, 1, 2], fmt:"{v}" },
      { id:"act", t:"Activity", group:"life", levels:["active", "some", "inactive"], pts:[0, 1, 2], fmt:"{v}" },
      { id:"smk", t:"Smoking or vaping", group:"life", levels:["no", "yes"], pts:[0, 2], fmt:"{v}" },
      { id:"age", t:"Age band", group:"non", levels:["20s", "40s", "60s"], pts:[0, 1, 2], fmt:"{v}" },
      { id:"fam", t:"Family history of early heart disease", short:"Family history", group:"non", levels:["no", "yes"], pts:[0, 1], fmt:"{v}" }
    ],
    groups:[{ id:"eat", t:"Eating pattern", tag:"modifiable" }, { id:"life", t:"Lifestyle", tag:"modifiable" }, { id:"non", t:"Non-modifiable", tag:"locked for personas, open in Free mode" }],
    bands:{
      bp:[{ max:1, t:"typical" }, { max:2, t:"higher" }, { max:4, t:"much higher" }],
      ldl:[{ max:0, t:"lower" }, { max:2, t:"typical" }, { max:4, t:"higher" }],
      view:[{ max:2, t:"wide open" }, { max:5, t:"some narrowing" }, { max:8, t:"more narrowing" }, { max:13, t:"much narrowing" }]
    },
    rules:[
      "<strong>Index</strong> = the sum of all points (0–13).",
      "<strong>Blood-pressure trend</strong> = sodium points + activity points: 0–1 “typical”, 2 “higher”, 3–4 “much higher”.",
      "<strong>LDL trend</strong> = saturated fat points + fibre points: 0 “lower”, 1–2 “typical”, 3–4 “higher”.",
      "<strong>Artery view</strong> (by index): 0–2 “wide open”, 3–5 “some narrowing”, 6–8 “more narrowing”, 9+ “much narrowing”."
    ],
    // persona starting states as level indices (plan table). Free mode's start is the builder's: the model's "typical
    // Canadian" eating pattern, some activity, no smoking, 20s, no family history (index 4).
    personas:[
      { id:"marlon", t:"Marlon, 48", s:{ na:4, sf:2, fi:2, act:1, smk:0, age:1, fam:1 } },
      { id:"agnieszka", t:"Agnieszka, 63", s:{ na:3, sf:2, fi:1, act:1, smk:0, age:2, fam:1 } },
      { id:"jordan", t:"Jordan, 26", s:{ na:3, sf:3, fi:2, act:2, smk:0, age:0, fam:0 } },
      { id:"free", t:"Free mode", s:{ na:3, sf:2, fi:1, act:1, smk:0, age:0, fam:0 } }
    ],
    lockNote:"Locked: non-modifiable. Free mode opens these.",
    freeNote:M5,
    // Inside the artery (N13 step-through), five steps (plan)
    steps:[
      "LDL particles enter a damaged artery wall.",
      "Immune cells take up the cholesterol (foam cells).",
      "A plaque with a fibrous cap grows.",
      "The cap ruptures.",
      "A clot blocks blood flow (heart attack in a coronary artery; stroke in the brain)."
    ],
    // Eating-pattern presets (plan). VERIFY: the descriptions of the DASH and Mediterranean evidence; the "typical Canadian"
    // pattern is the plan's model setting (model data).
    presets:[
      { id:"typical", t:"Typical Canadian", set:{ na:3, sf:2, fi:1 }, foods:"The model’s typical Canadian pattern: sodium 3300 mg a day, saturated fat 14% of energy, some fibre-rich foods." },
      { id:"dash", t:"DASH-style", set:{ na:0, sf:0, fi:0 }, foods:"Vegetables, fruits, low-fat dairy, whole grains, legumes, nuts; less sodium.",
        // VERIFY: the three culture plates are the builder's (the plan names the traditions, not the dishes).
        plates:[
          { t:"Caribbean", d:"Steamed fish with callaloo, brown rice and kidney beans, and mango; thyme, lime and pepper add flavour instead of extra salt." },
          { t:"South Asian", d:"Chana masala (chickpeas) with brown basmati rice, cucumber raita made with low-fat yogurt, and a salad." },
          { t:"East Asian", d:"Tofu and vegetable stir-fry with brown rice, edamame and an orange; ginger and garlic with a little lower-sodium soy sauce." }] },
      { id:"med", t:"Mediterranean-style", set:{ na:1, sf:1, fi:0 }, foods:"Olive oil, vegetables, legumes, whole grains, fish, nuts.",
        plates:[
          { t:"Caribbean", d:"Grilled snapper with olive oil, a bean and vegetable stew, roasted sweet potato and pineapple." },
          { t:"South Asian", d:"Lentil dal cooked with canola or olive oil, whole-wheat roti, spinach saag and a handful of almonds." },
          { t:"East Asian", d:"Grilled mackerel or salmon, a mushroom and vegetable stir-fry in canola oil, brown rice and greens with sesame seeds." }] }
    ],
    flexible:"Both patterns are <strong>flexible across cultures</strong>. Each fits plates from many food traditions:",
    predictions:[
      { id:"p1", persona:"marlon", prompt:"<strong>Marlon.</strong> Sodium moves from 3800 to 2300 mg/day. Which readout changes most?",
        options:[{ t:"Blood-pressure trend", ok:true }, { t:"LDL trend" }, { t:"Non-modifiable points" }, { t:"Nothing changes" }],
        explain:"Sodium works mainly through blood pressure. The blood-pressure trend falls from “much higher” to “typical”, and the index drops 8 → 6." },
      { id:"p2", persona:"free", prompt:"<strong>Free mode</strong>, the same eating pattern for two settings: 20s with no family history vs 60s with family history. How much higher is the second index?",
        options:[{ t:"3 points", ok:true }, { t:"0 points" }, { t:"1 point" }, { t:"6 points" }],
        explain:"Age band 2 points + family history 1 point. Non-modifiable factors add to the same eating pattern." },
      { id:"p3", persona:"jordan", prompt:"<strong>Jordan.</strong> Saturated fat drops from 18% to 10% of energy (swapping butter for canola oil, for example). Which trend changes?",
        options:[{ t:"LDL trend", ok:true }, { t:"Blood-pressure trend" }, { t:"Both equally" }, { t:"Neither: all fat is the same" }],
        explain:"Swapping saturated for unsaturated fat lowers LDL. The LDL trend moves from “higher” (4) to “typical” (2)." },
      { id:"p4", prompt:"<strong>Inside the artery.</strong> In this model, what usually starts a heart attack?",
        options:[{ t:"A plaque’s cap ruptures and a clot blocks the artery", ok:true }, { t:"The artery fills completely with fat from one meal" }, { t:"The heart runs out of cholesterol" }, { t:"The blood becomes too salty to flow" }],
        explain:"Plaque grows over years inside the wall; the sudden event is a rupture and clot." }
    ],
    challenges:[
      { id:"tc1", goal:[3, 4],
        prompt:"<strong>Marlon:</strong> bring the index to <strong>4 or below</strong> by changing <strong>only his eating-pattern sliders</strong> (sodium, saturated fat, fibre).",
        // VERIFY: "why" line is the builder's (the plan gives none).
        why:"His eating points fell to 1 or less while his other 3 points stayed. Several modest changes add up.",
        msgs:{
          activity:"Good idea in life, but this challenge is about eating only.",
          five:"One more eating change: which factor still has points?",
          // the lines below are the builder's
          persona:"This challenge is Marlon’s. Choose Marlon in the persona chips.",
          smoking:"Put his smoking setting back to “no”: this challenge is about eating only.",
          general:"His index is {n}. Eating points must be 1 or less: which eating factors still carry points?" },
        hints:["His eating points start at 2 + 1 + 2 = 5. His other points add to 3.", "To reach 4, eating points must be 1 or less.", "For example: sodium 2300, saturated fat 10, fibre many gives index 3."] },
      { id:"tc2", goal:[3, 4],
        prompt:"<strong>Agnieszka</strong> has 3 non-modifiable points (60s, family history). Set her modifiable sliders so her index is as low as it can go.",
        why:"Her floor is 3, not 0. That’s why her screening and her eating pattern both matter.",
        msgs:{
          four:"One modifiable factor still has a point.",
          age:"Age is locked: it’s non-modifiable. That’s the point of this challenge.",
          // the lines below are the builder's
          persona:"This challenge is Agnieszka’s. Choose Agnieszka in the persona chips.",
          general:"Her index is {n}. Which modifiable factors still carry points?" },
        hints:["What’s the lowest a modifiable factor can score?", "Zero each. Her floor is her non-modifiable points.", "Sodium ≤ 2300, saturated fat ≤ 10, fibre many, active."] },
      { id:"tc3", goal:[3, 4], stretch:true,
        prompt:"<strong>Jordan</strong> (index 7): reach <strong>3 or below</strong> by changing <strong>exactly two</strong> sliders.",
        // VERIFY: "why" line is the builder's.
        why:"Two factors worth 2 points each, both taken to 0, remove 4 points: 7 → 3.",
        msgs:{
          sodium:"Sodium is only worth 1 point for Jordan (3300 → 2300). You need to remove 4.",
          three:"That reaches the goal, but the challenge is exactly two.",
          sat14:"18 → 14 removes only 1 point.",
          // the lines below are the builder's
          persona:"This challenge is Jordan’s. Choose Jordan in the persona chips.",
          count:"Change exactly two of the five modifiable controls ({n} changed so far).",
          general:"Jordan’s index is {n}. Two changes need to remove 4 points." },
        hints:["Which of Jordan’s factors carry 2 points?", "Saturated fat 18, fibre few and inactive are worth 2 each.", "Any two of those three, each taken all the way to 0."] }
    ]
  },
  part3:{
    slug:"sodium", name:"Sodium", heading:"Sodium sleuth",
    // VERIFY: intro and station instructions are the builder's wording of the plan's station descriptions.
    intro:"Move from the model to real labels. Find the sodium hiding in everyday foods, see where sodium in Canadian diets comes from, try some swaps, and meet sodium’s partner, potassium.",
    dv:2300,
    st1:{
      title:"Station 1: Hidden sodium",
      intro:"Six model labels (values rounded). Tap each label’s <strong>sodium line</strong>, then sort it: <strong>a little</strong> (5% or less), <strong>between</strong>, or <strong>a lot</strong> (15% or more).",
      labels:[
        { id:"soup", t:"Canned soup", serving:"1 cup", mg:690, dv:30 },
        { id:"turkey", t:"Deli turkey", serving:"4 slices", mg:575, dv:25 },
        { id:"bread", t:"Bread", serving:"2 slices", mg:345, dv:15 },
        { id:"cereal", t:"Breakfast cereal", serving:"1 cup", mg:115, dv:5 },
        { id:"peanuts", t:"Salted peanuts", serving:"¼ cup", mg:230, dv:10 },
        { id:"peas", t:"Plain frozen peas", serving:"½ cup", mg:0, dv:0 }
      ],
      levels:[{ id:"little", t:"a little" }, { id:"between", t:"between" }, { id:"lot", t:"a lot" }],
      done:"Soup, deli turkey and bread are a lot; cereal and peas are a little; the peanuts (10%) are the one “between” case.",
      // teacher slot (plan §5): credited real label photos; photos stay in this browser tab only
      real:{ title:"Teacher slot: add real labels", intro:"Your teacher may share photos of real labels. Add one here to compare its sodium line with the model labels. Photos stay on this page only and aren’t saved; the model values above stay the answer key.", credit:"Shown for education (fair dealing)." }
    },
    st2:{
      title:"Station 2: Where sodium comes from",
      intro:"Where does the sodium in Canadian diets come from? Turn the salt shaker off and watch the bar.",
      // VERIFY: real shares before release. These are model data (illustrative); the plan gives the categories, not the values.
      sources:[{ id:"proc", t:"Processed and packaged foods", pct:70 }, { id:"rest", t:"Restaurant foods", pct:20 }, { id:"home", t:"Salt added at home", pct:10 }],
      toggle:"Stop using the salt shaker",
      question:"If someone stopped using the salt shaker entirely, which bar shrinks? How much of the total would remain?",
      shrink:[{ t:"Processed and packaged foods" }, { t:"Restaurant foods" }, { t:"Salt added at home", ok:true }],
      remain:{ answer:90, label:"Sodium that would remain", unit:"%" },
      // feedback lines are the builder's
      fb:{ right:"Right. Only the “salt added at home” bar shrinks. 70% + 20% = 90% of the sodium would remain.", bar:"That bar doesn’t change: the shaker adds salt only at home.", num:"Add the two bars that stay: processed and packaged foods plus restaurant foods.", pick:"Choose a bar and type a percent first." }
    },
    st3:{
      title:"Station 3: Swap lab",
      intro:"A model day totals 3450 mg of sodium (150% DV). Make up to three swaps and watch the total and %DV update.",
      // VERIFY: the model day's items are the builder's, built from the plan's label values (Station 1), its frozen pizza
      // (Activity 2) and its swap amounts (quick check Q4).
      day:[
        { id:"cereal", meal:"Breakfast", t:"Breakfast cereal, 1 cup", mg:115 },
        { id:"toast", meal:"Breakfast", t:"Toast (bread, 2 slices)", mg:345 },
        { id:"soup", meal:"Lunch", t:"Canned soup, 1 cup", mg:690, swap:"soup" },
        { id:"bread", meal:"Lunch", t:"Sandwich bread, 2 slices", mg:345 },
        { id:"deli", meal:"Lunch", t:"Deli turkey, 4 slices", mg:575, swap:"deli" },
        { id:"nuts", meal:"Snack", t:"Salted peanuts, ¼ cup", mg:230, swap:"nuts" },
        { id:"pizza", meal:"Dinner", t:"Frozen pizza", mg:1150 }
      ],
      swaps:[
        { id:"soup", t:"Canned soup → homemade", to:"Homemade soup, 1 cup", mg:345 },
        { id:"deli", t:"Deli meat → leftover roast chicken", to:"Leftover roast chicken", mg:345 },
        { id:"nuts", t:"Salted → unsalted nuts", to:"Unsalted peanuts, ¼ cup", mg:0 }
      ]
    },
    st4:{
      title:"Station 4: Potassium partner",
      html:"<p>Potassium-rich foods help balance blood pressure. Good sources include:</p>",
      foods:["beans", "potatoes with skin", "bananas", "leafy greens", "yogurt"],
      note:"People with kidney disease may need different amounts of potassium: a health professional sets those."
    },
    // VERIFY: reference titles, years and details before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Appel, L. J., Moore, T. J., Obarzanek, E., Vollmer, W. M., Svetkey, L. P., Sacks, F. M., Bray, G. A., Vogt, T. M., Cutler, J. A., Windhauser, M. M., Lin, P.-H., &amp; Karanja, N. (1997). A clinical trial of the effects of dietary patterns on blood pressure. <i>New England Journal of Medicine, 336</i>(16), 1117–1124.</li><li>Estruch, R., Ros, E., Salas-Salvadó, J., Covas, M.-I., Corella, D., Arós, F., Gómez-Gracia, E., Ruiz-Gutiérrez, V., Fiol, M., Lapetra, J., Lamuela-Raventos, R. M., Serra-Majem, L., Pintó, X., Basora, J., Muñoz, M. A., Sorlí, J. V., Martínez, J. A., Fitó, M., Gea, A., … Martínez-González, M. A. (2018). Primary prevention of cardiovascular disease with a Mediterranean diet supplemented with extra-virgin olive oil or nuts. <i>New England Journal of Medicine, 378</i>(25), e34.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Sodium in Canada</i>. Government of Canada.</li></ul><p class="tiny muted">' + ADVICE + "</p>" }],
    quickCheck:{
      title:"Sodium sleuth quick check", summary:"Sodium sleuth quick check",
      // "Right." lines are the builder's; the wrong-choice feedback is the plan's.
      items:[
        { id:"q1", goal:5, prompt:"A cracker has sodium 3% DV. Using the guide, it’s…",
          choices:[{ t:"a little", ok:true, fb:"Right. 5% or less is a little." }, { t:"a lot", fb:"5% or less is a little." }, { t:"between", fb:"5% or less is a little." }, { t:"can’t tell", fb:"5% or less is a little." }] },
        // VERIFY: the share of sodium from the salt shaker (plan flag on this feedback).
        { id:"q2", goal:6, prompt:"Most sodium in Canadian diets comes from…",
          choices:[{ t:"processed and restaurant foods", ok:true, fb:"Right. Processed and restaurant foods carry most of it; the shaker is the smaller share." }, { t:"the salt shaker", fb:"The shaker is the smaller share." }, { t:"drinking water", fb:"The shaker is the smaller share." }, { t:"fresh vegetables", fb:"The shaker is the smaller share." }] },
        { id:"q3", goal:5, prompt:"Three servings: 345 mg + 230 mg + 115 mg. Total %DV?",
          choices:[{ t:"30%", ok:true, fb:"Right. 345 + 230 + 115 = 690 mg, and 690 ÷ 2300 = 0.30." }, { t:"690%", fb:"690 ÷ 2300 = 0.30." }, { t:"20%", fb:"690 ÷ 2300 = 0.30." }, { t:"3%", fb:"690 ÷ 2300 = 0.30." }] },
        { id:"q4", goal:6, prompt:"Which swap removes the most sodium in Station 3?",
          choices:[{ t:"canned soup → homemade (−345 mg)", ok:true, fb:"Right. 345 mg is the biggest cut of the three." }, { t:"salted → unsalted nuts (−230 mg)", fb:"Compare the amounts each swap removes." }, { t:"deli meat → roast chicken (−230 mg)", fb:"Compare the amounts each swap removes." }, { t:"none", fb:"Compare the amounts each swap removes." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Sort the risk factors", summary:"Sort the risk factors", goal:[3, 6], noun:"factor", txt:true,
        instruction:"Ten CVD risk factors. Sort each one: can a person change it, is it fixed, or is it a social condition that shapes choices?",
        boxes:[
          { id:"mod", label:"Modifiable", icon:ICO_MOD },
          { id:"non", label:"Non-modifiable", icon:ICO_NON },
          { id:"soc", label:"Social conditions", sub:"shape choices", icon:ICO_SOC }
        ],
        items:[
          sortItem("f1", "Family history of early heart disease", "non", "You can’t change your relatives, but knowing helps with screening."),
          sortItem("f2", "Eating pattern high in sodium", "mod", "Eating patterns can change, though cost and access matter."),
          sortItem("f3", "Age", "non", "Risk rises with age for everyone."),
          sortItem("f4", "Smoking or vaping", "mod", "Quitting lowers risk; support helps."),
          sortItem("f5", "Living far from a grocery store with fresh food", "soc", "This shapes choices rather than being a personal choice. " + M6),
          // VERIFY: the line for item 6 is the builder's (the plan gives none).
          sortItem("f6", "Physical activity", "mod", "Activity can change, though time, safety and cost shape it."),
          sortItem("f7", "Low household income", "soc", M6),
          sortItem("f8", "Genetic conditions that raise LDL (e.g. familial hypercholesterolemia)", "non", "Genes set LDL high from birth; treatment still helps."),
          sortItem("f9", "Long work shifts that leave little time to cook", "soc", M6),
          sortItem("f10", "Replacing butter with canola oil", "mod", M2)
        ] },
      { id:"budget", type:"custom", title:"Sodium budget and evidence", summary:"Sodium budget and evidence", star:true, goal:[4, 5, 6],
        instruction:"Six items: sodium arithmetic, a model question and two evidence questions. Items marked ★ are non-routine; B5 is an investigation.",
        how:"Type a number or tap a choice, then press Check.",
        // VERIFY: hints for B1–B5 and the distractor choices in B5 and B6 are the builder's (the plan gives B6's hints only).
        items:[
          { id:"b1", kind:"num", goal:5, prompt:"A soup has 805 mg sodium. %DV?",
            fields:[{ label:"%DV", unit:"%" }], answer:[35], display:"35%",
            wrong:[{ match:[80.5], fb:"Divide by 2300, not 1000." }], wrongDefault:"Divide the sodium by the Daily Value, 2300 mg.",
            hints:["Divide the sodium by the Daily Value, 2300 mg.", "805 ÷ 2300 = 0.35.", "35%."] },
          { id:"b2", kind:"num", goal:5, prompt:"A day’s foods: 690 + 575 + 345 + 230 + 115 mg. Total mg and %DV?",
            fields:[{ label:"Total sodium", unit:"mg" }, { label:"%DV", unit:"%" }], answer:[1955, 85], display:"1955 mg; 85%",
            wrongDefault:"Add first, then divide by 2300.",
            hints:["Add the five amounts first.", "690 + 575 + 345 + 230 + 115 = 1955 mg.", "1955 ÷ 2300 = 0.85: 85%."] },
          { id:"b3", kind:"chips", goal:[5, 6], star:true, fixedOrder:true,
            prompt:"Plan: keep the day under 2300 mg. The day above already has 1955 mg. Which dinner fits: (a) frozen pizza 1150 mg, (b) homemade stir-fry 345 mg, (c) takeout noodles 1610 mg?",
            chips:[{ t:"(a) frozen pizza, 1150 mg", fb:"1955 + 1150 = 3105 mg: well over 2300." }, { t:"(b) homemade stir-fry, 345 mg", ok:true }, { t:"(c) takeout noodles, 1610 mg", fb:"1955 + 1610 = 3565 mg: well over 2300." }],
            why:"1955 + 345 = 2300: just at the limit.",
            hints:["How much room is left under 2300 mg?", "2300 − 1955 = 345 mg.", "(b) homemade stir-fry: 1955 + 345 = 2300."] },
          { id:"b4", kind:"num", goal:4, star:true, prompt:"Model: Marlon at index 8 reaches 4. By how many points did his eating change, and what’s left that isn’t eating?",
            fields:[{ label:"His eating changed by", unit:"points" }, { label:"Left that isn’t eating", unit:"points" }], answer:[4, 3], display:"4 points; 3 points (activity 1 + age 1 + family 1)",
            wrongDefault:"Separate the eating points from the rest.",
            hints:["Marlon’s eating points start at 2 + 1 + 2 = 5.", "Index 8 → 4 means 4 points came off, all from eating.", "4 points from eating; 3 points left: activity 1 + age 1 + family history 1."] },
          { id:"b5", kind:"chips", goal:4, star:true, inquiry:true,
            prompt:"A study followed 10" + NB + "000 adults for 10 years. Those who ate nuts at least 5 times a week had fewer heart attacks. What’s the best next step to test whether nuts <em>cause</em> the drop?",
            chips:[{ t:"A randomized controlled trial assigning people to eat nuts or not, measuring heart outcomes", ok:true },
              { t:"Follow the same adults for another 10 years" }, { t:"Repeat the same study with 20" + NB + "000 adults" }, { t:"Ask the nut-eaters why they think they stayed healthy" }],
            fb:"Observational: nut-eaters may differ in income, activity or smoking.", why:M7,
            hints:["Is the nut study observational, or did researchers assign who ate nuts?", "Nut-eaters may differ in income, activity or smoking.", "A randomized controlled trial assigning people to eat nuts or not."] },
          { id:"b6", kind:"chips", goal:6, star:true,
            prompt:"A city wants to cut residents’ sodium. Strategy X: posters asking people to stop salting food. Strategy Y: working with restaurants and food makers to lower sodium in dishes. Which likely does more, and why?",
            chips:[{ t:"Y, because most sodium comes from processed and restaurant foods", ok:true }, { t:"X, because most sodium comes from the salt shaker", fb:M3 }, { t:"They would do about the same", fb:"The two strategies target different sources. " + M3 }],
            why:"Y: most sodium comes from processed and restaurant foods.",
            hints:["Where does most sodium come from?", "The shaker is a small share.", "Change the food supply: Y."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Kalani", goal:[2, 3, 5], how:"",
        instruction:"Kalani made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how a lower-sodium eating pattern helps prevent heart disease.",
            steps:["High sodium intake raises blood pressure for many people.", "High blood pressure strains artery walls and the heart.", "So lowering sodium mainly works by lowering LDL cholesterol.", "That’s why canned soups are a concern."],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 isn’t the first problem."],
            fixes:[
              { t:"Lowering sodium mainly works by lowering blood pressure, which reduces strain and damage to arteries.", ok:true, why:"Sodium’s main route is blood pressure." },
              { t:"Lowering sodium raises HDL.", why:"Sodium isn’t a cholesterol lever." },
              { t:"Lowering sodium removes plaque.", why:"It reduces a driver; it doesn’t scrub plaque away." },
              { t:"Step 3 is correct.", why:"Sodium’s main route is blood pressure." }],
            hints:["Which readout did sodium move in Explore?", "The BP trend.", "Blood pressure, not LDL."] },
          { id:"e2", goal:3, task:"Agnieszka is 63 with a family history. Explain her options.",
            steps:["Age and family history are non-modifiable.", "So nothing she does can change her risk.", "She should accept a high index."],
            answer:1, stepFb:["", "", "Step 3 follows step 2’s mistake."],
            fixes:[
              { t:"Her eating pattern, activity and not smoking can still lower her risk; non-modifiable factors set a floor, not a fate.", ok:true, why:M4 },
              { t:"She should change her age band.", why:"Impossible." },
              { t:"Her risk is only from family history.", why:"Several factors add together." },
              { t:"Step 2 is correct.", why:"TC2 showed her index can fall to 3." }],
            hints:["What did TC2 show?", "Her index fell from 7 to 3.", "Modifiable factors still matter."] },
          { id:"e3", goal:5, task:"Is a 460 mg sodium snack a little or a lot?",
            steps:["%DV = 460 ÷ 2300.", "460 ÷ 2300 = 2%.", "2% is a little, so it’s a low-sodium snack."],
            // VERIFY: step 3's tapped feedback is the builder's (mirrors E2's "follows" line).
            answer:1, stepFb:["", "", "Step 3 follows step 2’s mistake."],
            fixes:[
              { t:"460 ÷ 2300 = 0.20 = 20%: a lot.", ok:true, why:"15% or more is a lot." },
              { t:"460 ÷ 2300 = 46%.", why:"That’s 460 ÷ 1000." },
              { t:"460 ÷ 2300 = 5%.", why:"5% would be 115 mg." },
              { t:"Step 2 is correct.", why:"Check: 2% of 2300 is 46." }],
            hints:["What’s 10% of 2300?", "230. So 460 is…", "20%: a lot."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"Which result in the artery model surprised you most: how changes add up, or how non-modifiable factors set a floor?" },
      { id:"j2", q:"In your own words, explain the difference between how sodium and how saturated fat affect heart health." },
      { id:"j3", q:"Explain to a friend how to tell whether a food is high in sodium using the label." },
      { id:"j4", q:"Which CVD prevention idea are you still unsure about: personal choices or community strategies? What will you do to understand it better?" }
    ]
  },
  final:{
    // Options without feedback in the plan reuse its misconception sentences (M1–M7), its Activity 1 lines, or (marked) a builder line.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is atherosclerosis?", options:[
          { t:"Plaque building up inside artery walls, narrowing the arteries", ok:true, why:"It develops over years." },
          { t:"A sudden blockage of an artery by a fat droplet from one meal", why:"Plaque builds slowly inside the wall." },
          { t:"Weak heart muscle caused by too little protein", why:"That isn’t atherosclerosis." },
          { t:"Salt crystals collecting in blood vessels", why:"Sodium raises blood pressure; it doesn’t form crystals in arteries." }] },
        b:{ prompt:"Which event most often triggers a heart attack?", options:[
          { t:"A plaque ruptures and a clot blocks a coronary artery", ok:true, why:"Rupture plus clot." },
          { t:"An artery slowly fills with fat over one day", why:M1 },
          { t:"The heart runs out of cholesterol", why:"The heart doesn’t run on cholesterol." },
          { t:"Blood pressure drops too low after a salty meal", why:"Sodium tends to raise, not drop, blood pressure." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which change in eating pattern lowers LDL cholesterol for most people?", options:[
          { t:"Replacing saturated fats with unsaturated fats", ok:true, why:"For example, butter → canola or olive oil." },
          { t:"Cutting out all fats", why:"Unsaturated fats help; fats aren’t all the same." },
          { t:"Eating more sodium", why:"Sodium isn’t an LDL lever." },
          { t:"Replacing vegetables with fruit juice", why:"Juice adds sugar and loses fibre." }] },
        b:{ prompt:"Which food is the best source of soluble fibre to help lower LDL?", options:[
          { t:"Lentils", ok:true, why:"Legumes and oats are rich in soluble fibre." },
          { t:"Butter", why:"No fibre; high in saturated fat." },
          { t:"Chicken", why:"Animal foods have no fibre." },
          { t:"White rice", why:"Refined grains lose most of their fibre." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is a <strong>non-modifiable</strong> CVD risk factor?", options:[
          { t:"Family history of early heart disease", ok:true, why:"You can’t change your relatives, but knowing helps with screening." },
          { t:"High-sodium eating pattern", why:"That can change." },
          { t:"Physical inactivity", why:"That can change." },
          { t:"Smoking", why:"That can change, with support." }] },
        b:{ prompt:"Which is a <strong>modifiable</strong> CVD risk factor?", options:[
          { t:"An eating pattern high in saturated fat", ok:true, why:"Eating patterns can change, though cost and access matter." },
          { t:"Age", why:"Non-modifiable." },
          { t:"Genetic high LDL", why:"Non-modifiable, though treatable." },
          { t:"Family history", why:"Non-modifiable." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"In the module’s model, a persona has index 7: 4 modifiable points and 3 non-modifiable. What is the lowest index any change in eating, activity and smoking can reach?", options:[
          { t:"3", ok:true, why:"Modifiable points can fall to 0; the 3 non-modifiable remain." },
          { t:"0", why:"Non-modifiable points can’t be removed." },
          { t:"4", why:"That removes only 3 points." },
          { t:"7", why:"Modifiable changes do lower it." }] },
        b:{ prompt:"A persona has index 9: 7 modifiable points and 2 non-modifiable. What’s the lowest index reachable?", options:[
          // VERIFY: the line on the correct option is the builder's (adapted from version A).
          { t:"2", ok:true, why:"Modifiable points can fall to 0; the 2 non-modifiable remain." },
          { t:"0", why:M4 },
          { t:"7", why:"That removes only 2 points." },
          { t:"9", why:M4 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"A lunch has three items: 690 mg, 460 mg and 115 mg of sodium. What %DV is the lunch?", options:[
          { t:"55%", ok:true, why:"1265 ÷ 2300 = 0.55." },
          { t:"50%", why:"That’s 1150 mg." },
          { t:"12.65%", why:"That’s 1265 ÷ 10" + NB + "000." },
          { t:"126.5%", why:"That’s 1265 ÷ 1000." }] },
        b:{ prompt:"A snack plate: 345 mg + 230 mg + 115 mg. %DV?", options:[
          { t:"30%", ok:true, why:"690 ÷ 2300." },
          { t:"69%", why:"That’s 690 ÷ 1000." },
          { t:"25%", why:"That’s 575 mg." },
          { t:"3%", why:"That’s 69 mg." }] } },
      // VERIFY: the DASH trial description (plan flag on DASH and Mediterranean evidence).
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Researchers randomly assigned adults to a DASH-style eating pattern or a typical pattern for 8 weeks. Blood pressure fell more in the DASH group. Which conclusion is best supported?", options:[
          { t:"In this trial, the DASH pattern lowered blood pressure compared with the typical pattern", ok:true, why:"Random assignment supports a cause-and-effect conclusion for this outcome." },
          { t:"DASH prevents all heart attacks", why:"The trial measured blood pressure for 8 weeks, not heart attacks." },
          { t:"Sodium has no effect on blood pressure", why:"The trial doesn’t show that." },
          { t:"Everyone must eat exactly the same DASH menu", why:"DASH is a flexible pattern across cultures." }] },
        b:{ prompt:"A study observed that adults who ate nuts most days had fewer heart attacks over 10 years. Which conclusion is best supported?", options:[
          { t:"Eating nuts is associated with fewer heart attacks; other differences between groups could explain it", ok:true, why:M7 },
          { t:"Nuts prevent heart attacks", why:"Observational studies show association, not cause." },
          { t:"Nuts have no effect", why:"The study doesn’t show that either." },
          { t:"Only people with a family history should eat nuts", why:"Not supported." }] } },
      // VERIFY: the lines on the correct options of C1 (A and B) and C2 A are the builder's (the plan gives none).
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the clearest, most accurate explanation of why soluble fibre supports heart health?", options:[
          { t:"“Soluble fibre binds bile acids in the gut; the liver then uses more cholesterol to make new bile, which lowers LDL in the blood.”", ok:true, why:"It names the mechanism, step by step." },
          { t:"“Fibre scrubs fat off artery walls like a brush.”", why:"Fibre works in the gut, not in arteries." },
          { t:"“Fibre burns calories so you get less fat.”", why:"Not the mechanism." },
          { t:"“Fibre is healthy because it’s natural.”", why:"Not an explanation." }] },
        b:{ prompt:"Which is the clearest, most accurate explanation of why lowering sodium supports heart health?", options:[
          { t:"“For many people, less sodium means lower blood pressure, which reduces strain on artery walls and the heart.”", ok:true, why:"It names the route: sodium → blood pressure → strain." },
          { t:"“Sodium turns into cholesterol.”", why:"It doesn’t." },
          { t:"“Salt is bad, so less is good.”", why:"A moral label, not an explanation." },
          { t:"“Sodium dissolves plaque.”", why:"No." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which message for a school health poster is accurate <strong>and</strong> follows respectful-language guidelines?", options:[
          { t:"“Eating patterns rich in vegetables, legumes and whole grains are linked to lower heart disease risk across populations.”", ok:true, why:"Accurate, population-level and free of blame." },
          { t:"“Junk food clogs your arteries!”", why:"A moral food label, and inaccurate. " + M1 },
          { t:"“Overweight people will get heart disease.”", why:"Stigmatizing and inaccurate." },
          { t:"“Only older men get heart disease.”", why:"A myth: CVD affects all genders and ages." }] },
        b:{ prompt:"Which caption for the artery model is accurate and respectful?", options:[
          { t:"“This model shows population patterns for fictional personas; it can’t predict any real person’s heart health.”", ok:true, why:M5 },
          { t:"“Find out your personal heart attack risk!”", why:M5 },
          { t:"“Bad eaters get bad arteries.”", why:"Moral and blaming." },
          { t:"“Your genes decide everything.”", why:M4 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Soup X: sodium 30% DV per cup. Soup Y: 10% DV per cup. Using the 5% / 15% guide, which is true?", options:[
          // VERIFY: the lines on the correct options of A1 A and B are the builder's (B's reuses the plan's "3% ≤ 5%; 18% ≥ 15%").
          { t:"X is ‘a lot’; Y is between ‘a little’ and ‘a lot’", ok:true, why:"30% ≥ 15%; 10% is between 5% and 15%." },
          { t:"X is ‘a little’; Y is ‘a lot’", why:"Reversed." },
          { t:"Both are ‘a lot’", why:"10% is under 15%." },
          { t:"Both are ‘a little’", why:"30% is over 15%." }] },
        b:{ prompt:"Cereal P: sodium 3% DV. Cereal Q: 18% DV. Which is true?", options:[
          { t:"P is ‘a little’; Q is ‘a lot’", ok:true, why:"3% ≤ 5%; 18% ≥ 15%." },
          { t:"P is ‘a lot’; Q is ‘a little’", why:"Reversed." },
          { t:"Both are between", why:"3% ≤ 5%; 18% ≥ 15%." },
          { t:"Can’t compare without calories", why:"%DV compares directly." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Which strategy is most likely to lower sodium intake across a whole community?", options:[
          { t:"Working with food manufacturers and restaurants to lower sodium in their foods", ok:true, why:"Targets the largest source. " + M3 },
          { t:"Removing salt shakers from cafeteria tables", why:"A small source." },
          { t:"Telling each person to try harder", why:"Ignores where sodium comes from. " + M6 },
          { t:"Blood pressure pills for everyone", why:"Medical decisions are individual; not a food strategy." }] },
        b:{ prompt:"Which strategy best helps low-income households eat more vegetables and fruit?", options:[
          { t:"Programs that lower the cost of produce or raise household income", ok:true, why:M6 },
          { t:"Posters only", why:"Information alone doesn’t fix cost." },
          { t:"Banning fast food", why:"Doesn’t make produce affordable." },
          { t:"Telling people to grow all their own food", why:"Not realistic for most households." }] } }
    ]
  },
  task:{
    title:"Heart-smart lunch", summary:"Heart-smart lunch",
    statement:"<p>Build a lunch for <strong>Marlon</strong> from the café menu (model values) that meets every condition. There are many answers. Find at least two.</p><p class=\"tiny muted\">Choose one main, one side and one drink. Model values for learning; real foods vary. No Calories are shown.</p>",
    checks:["Sodium at most half the DV", "Saturated fat at most 4 g", "At least 8 g fibre", "A whole vegetable or fruit", "A drink without added sugar"],
    tips:["Find the saltiest item and swap it.", "The pizza and chocolate milk carry the saturated fat.", "Legumes and whole grains bring fibre.", "Add the apple or vegetables with hummus.", "Water is Canada’s Food Guide’s drink of choice."],
    explainPrompt:"Explain how your lunch supports both blood pressure and LDL cholesterol. Name the item that does the most work for each.",
    vocab:"Use sodium, %DV, saturated fat, soluble fibre and legumes.",
    checkLabel:"Check my lunch",
    // VERIFY: success and "more" lines are the builder's.
    success:"Marlon’s lunch meets every condition.",
    more:"There are many answers. Can you find another?",
    after2:"Every answer uses the lentil soup or the chickpea wrap. Legumes carry this task. Can you find one with the most fibre?",
    // café menu (plan table; model values). veg: counts as a whole vegetable or fruit; sugar: drink with added sugar.
    rows:[
      { id:"m", t:"Main", items:[
        { id:"M1", t:"Canned chicken noodle soup", na:690, sf:1, fi:1, veg:false },
        { id:"M2", t:"Homemade lentil soup", na:345, sf:0, fi:7, veg:true },
        { id:"M3", t:"Deli turkey sandwich, white bread", na:1150, sf:3, fi:2, veg:false },
        { id:"M4", t:"Chickpea salad wrap, whole wheat", na:460, sf:2, fi:6, veg:true },
        { id:"M5", t:"Cheese pizza slice", na:690, sf:6, fi:2, veg:false }] },
      { id:"s", t:"Side", items:[
        { id:"S1", t:"Apple", na:0, sf:0, fi:4, veg:true },
        { id:"S2", t:"Potato chips, small bag", na:230, sf:1, fi:1, veg:false },
        { id:"S3", t:"Raw vegetables with hummus", na:115, sf:0, fi:3, veg:true },
        { id:"S4", t:"Dill pickle", na:690, sf:0, fi:1, veg:true }] },
      { id:"d", t:"Drink", items:[
        { id:"D1", t:"Water", na:0, sf:0, fi:0, veg:false, sugar:false },
        { id:"D2", t:"Tomato juice, canned", na:460, sf:0, fi:1, veg:false, sugar:false, note:"juice isn’t counted as a whole vegetable" },
        { id:"D3", t:"Chocolate milk", na:115, sf:3, fi:0, veg:false, sugar:true }] }
    ],
    limits:{ na:1150, sf:4, fi:8 }
  },
  cards:[
    ["Cardiovascular disease", "Diseases of the heart and blood vessels, mainly coronary heart disease and stroke."],
    ["Atherosclerosis", "Plaque building up inside artery walls over years, narrowing them."],
    ["Heart attack trigger", "A plaque ruptures and a clot blocks a coronary artery."],
    ["LDL", "Lipoprotein that carries cholesterol to tissues; high levels feed plaque."],
    ["HDL", "Lipoprotein that carries cholesterol back to the liver."],
    ["Saturated vs unsaturated swap", "Replacing saturated fat with unsaturated fat lowers LDL."],
    ["Soluble fibre", "Oats, barley, beans and lentils; helps lower LDL."],
    ["Sodium and blood pressure", "For many people, more sodium raises blood pressure."],
    // VERIFY: %DV guide and the DASH description (plan flags).
    ["%DV guide", "5% or less is a little; 15% or more is a lot."],
    ["DASH pattern", "Vegetables, fruits, whole grains, legumes, low-fat dairy, nuts; less sodium."],
    ["Modifiable vs non-modifiable", "Eating, activity, smoking vs age, family history, genetics."],
    ["Population model", "Shows patterns across groups; can’t predict any one person’s health."]
  ]
};
