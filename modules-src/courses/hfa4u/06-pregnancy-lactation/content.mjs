// HFA4U 06 Pregnancy & Lactation. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/06-pregnancy-lactation.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value the builder had to supply. Plate-check and task card values are model data (labelled on screen).
// Care note (plan §1): pregnancy content always uses personas; nothing asks students about their own or their family's pregnancies.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";
const L = "<i>Listeria</i>";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "Needs for some nutrients rise a lot, but energy needs rise only a little, and not at all in the first trimester.";
const M2 = "The neural tube closes in about the first 4 weeks after conception, often before anyone knows. Folic acid has to be on board before then.";
const M3 = "Fish gives DHA for the baby’s brain and eyes. Choose low-mercury fish, and limit the high-mercury kinds.";
const M4 = L + " can grow at fridge temperatures after cooking. Heat deli meats until steaming hot, and use smoked fish only in a cooked dish.";
const M5 = "There’s no known safe amount of alcohol at any time in pregnancy.";
const M6 = "“Natural” isn’t evidence of safety. Some herbs aren’t recommended in pregnancy; check with a health care provider.";
const M7 = "Alcohol leaves milk as it leaves the blood. Only time lowers it; pumping doesn’t speed that up.";

// ---------- Explore: plate-check cards (plan table; model values, % of the pregnancy RDA per card; null = not counted) ----------
// flags: sp supplement · ip plant iron (for the vitamin C note) · vc vitamin C · an animal food · av avoid · ht heat first
// The plan's "Milk or fortified soy beverage" row is split into two cards with the same values, because TC3 (vegan) allows
// the soy beverage but not milk.
const pc = (id, t, v, dha, tags, flags, extra) => Object.assign({ id, t, f:v ? v[0] : null, fe:v ? v[1] : null, ca:v ? v[2] : null, d:v ? v[3] : null, dha:dha || "", tags,
  sp:/\bsp\b/.test(flags), ip:/\bip\b/.test(flags), vc:/\bvc\b/.test(flags), an:/\ban\b/.test(flags), av:/\bav\b/.test(flags), ht:/\bht\b/.test(flags) }, extra || {});
const PLATE = [
  pc("multi", "Prenatal multivitamin (0.4 mg folic acid, 16 mg iron)", [70, 60, 0, 25], "", ["supplement"], "sp"),
  pc("lentil", "Lentil curry (1 cup)", [60, 25, 5, 0], "", ["iron-rich plant", "folate-rich"], "ip"),
  pc("spinach", "Spinach, cooked (½ cup)", [20, 10, 10, 0], "", ["folate-rich"], "ip"),
  pc("cereal", "Fortified whole-grain cereal", [25, 30, 0, 0], "", ["fortified"], "ip"),
  pc("orange", "Orange", [10, 0, 5, 0], "", ["vitamin C"], "vc"),
  pc("pepper", "Red pepper strips", [5, 0, 0, 0], "", ["vitamin C"], "vc"),
  pc("salmon", "Baked salmon (75 g)", [5, 5, 0, 60], "yes", ["low-mercury fish"], "an"),
  pc("milk", "Milk (1 cup)", [5, 0, 30, 15], "", ["calcium"], "an"),
  pc("soy", "Fortified soy beverage (1 cup)", [5, 0, 30, 15], "", ["calcium"], ""),
  pc("yogurt", "Yogurt (¾ cup)", [5, 0, 25, 5], "", ["calcium"], "an"),
  pc("beef", "Beef stew (75 g beef)", [5, 15, 5, 0], "", ["iron-rich animal"], "an"),
  pc("chickpea", "Chickpea salad", [25, 10, 5, 0], "", ["folate-rich"], "ip"),
  pc("egg", "Hard-boiled egg", [10, 5, 0, 10], "small", ["cooked egg"], "an"),
  pc("algae", "Algae-based DHA supplement", [0, 0, 0, 0], "yes", ["supplement"], "sp"),
  pc("tofu", "Calcium-set tofu (150 g)", [10, 15, 40, 0], "", ["calcium", "iron-rich plant"], "ip"),
  pc("pate", "Liver pâté", null, "", ["avoid (" + L + "; very high vitamin A)"], "an av", { why:"Liver pâté is on the avoid list: " + L + " risk, and very high vitamin A, which can harm the baby." }),
  pc("deli", "Cold deli turkey sandwich", [5, 5, 5, 0], "", ["heat first"], "an ht"),
  pc("brie", "Unpasteurized brie", null, "", ["avoid (" + L + ")"], "an av", { why:"Raw-milk soft cheeses can carry " + L + "." }),
  pc("sword", "Swordfish steak", null, "", ["avoid or limit (mercury)"], "an av", { why:"Swordfish is high in mercury. Choose low-mercury fish like salmon or trout instead." })
];

// ---------- Performance task library (halal-friendly; plan's Explore cards plus its added cards) ----------
// VERIFY: model values for the cards the plan adds (not given in the plan; supplied by the builder, rough and illustrative).
// plate: vf vegetables and fruits · wg whole grains · pf protein foods · dr drink · sp supplement
// flags: ir iron-rich (15% iron or more) · ip iron-rich plant · vc vitamin C · ca calcium · vf vegetable or fruit ·
//        fish low-mercury fish · dha DHA source · av avoid · nh not halal · sp supplement
// "Whole-grain cereal with milk" is read as the fortified cereal plus milk (iron-rich and calcium), as the plan's valid answer 1 needs.
const tc = (id, t, g, plate, v, flags, extra) => Object.assign({ id, t, g, plate, f:v ? v[0] : null, fe:v ? v[1] : null, ca:v ? v[2] : null, d:v ? v[3] : null,
  ir:/\bir\b/.test(flags), ip:/\bip\b/.test(flags), vc:/\bvc\b/.test(flags), cal:/\bca\b/.test(flags), vf:/\bvf\b/.test(flags), dha:/\bdha\b/.test(flags),
  fish:/\bfish\b/.test(flags), av:/\bav\b/.test(flags), nh:/\bnh\b/.test(flags), sp:/\bsp\b/.test(flags) }, extra || {});
const LIB = [
  // vegetables and fruits
  tc("orange", "Orange", "vf", ["vf"], [10, 0, 5, 0], "vc vf"),
  tc("pepper", "Red pepper strips", "vf", ["vf"], [5, 0, 0, 0], "vc vf"),
  tc("strawb", "Strawberries", "vf", ["vf"], [10, 0, 0, 0], "vc vf"),
  tc("broc", "Broccoli", "vf", ["vf"], [15, 5, 5, 0], "vc vf"),
  tc("spinach", "Spinach, cooked (½ cup)", "vf", ["vf"], [20, 10, 10, 0], "vf"),
  tc("cuke", "Cucumber slices", "vf", ["vf"], [5, 0, 0, 0], "vf"),
  tc("apple", "Apple", "vf", ["vf"], [0, 0, 0, 0], "vf"),
  tc("dates", "Dates and almonds", "vf", ["vf", "pf"], [5, 5, 5, 0], "vf"),
  tc("sprouts", "Raw bean sprouts", "vf", ["vf"], null, "vf av", { why:"Raw sprouts are on the avoid list." }),
  // whole grains
  tc("cereal", "Fortified whole-grain cereal", "wg", ["wg"], [25, 30, 0, 0], "ir ip"),
  tc("cerealmilk", "Whole-grain cereal with milk", "wg", ["wg", "pf"], [30, 30, 30, 15], "ir ip ca"),
  tc("pita", "Whole-wheat pita", "wg", ["wg"], [10, 10, 0, 0], ""),
  tc("toast", "Whole-wheat toast", "wg", ["wg"], [10, 5, 0, 0], ""),
  tc("rice", "Brown rice", "wg", ["wg"], [5, 5, 0, 0], ""),
  tc("quinoa", "Quinoa", "wg", ["wg"], [15, 10, 0, 0], ""),
  // protein foods
  tc("lentil", "Lentil curry (1 cup)", "pf", ["pf"], [60, 25, 5, 0], "ir ip"),
  tc("lsoup", "Lentil soup", "pf", ["pf"], [50, 20, 5, 0], "ir ip"),
  tc("ccurry", "Chickpea curry", "pf", ["pf"], [40, 20, 5, 0], "ir ip"),
  tc("hummus", "Hummus and whole-wheat pita", "pf", ["pf", "wg"], [20, 15, 5, 0], "ir ip"),
  tc("tofu", "Calcium-set tofu (150 g)", "pf", ["pf"], [10, 15, 40, 0], "ir ip ca"),
  tc("chickpea", "Chickpea salad", "pf", ["pf", "vf"], [25, 10, 5, 0], "vf"),
  tc("hstew", "Halal beef stew with carrots", "pf", ["pf", "vf"], [5, 15, 5, 0], "ir vf"),
  tc("beef", "Beef stew (75 g beef)", "pf", ["pf"], [5, 15, 5, 0], "ir"),
  tc("shawarma", "Chicken shawarma bowl with vegetables", "pf", ["pf", "vf", "wg"], [15, 10, 5, 0], "vf"),
  tc("salmon", "Baked salmon (75 g)", "pf", ["pf"], [5, 5, 0, 60], "fish dha"),
  tc("trout", "Baked trout (75 g)", "pf", ["pf"], [5, 5, 5, 60], "fish dha"),
  tc("egg", "Hard-boiled egg", "pf", ["pf"], [10, 5, 0, 10], ""),
  tc("almonds", "Almonds", "pf", ["pf"], [5, 5, 5, 0], ""),
  tc("yogurt", "Yogurt (¾ cup)", "pf", ["pf"], [5, 0, 25, 5], "ca"),
  tc("yberries", "Yogurt with berries", "pf", ["pf", "vf"], [10, 0, 25, 5], "ca vf"),
  tc("sword", "Swordfish steak", "pf", ["pf"], null, "av", { why:"Swordfish is high in mercury." }),
  tc("pate", "Liver pâté", "pf", ["pf"], null, "av", { why:"Liver pâté is on the avoid list (" + L + "; very high vitamin A)." }),
  tc("brie", "Unpasteurized brie", "pf", ["pf"], null, "av", { why:"Raw-milk soft cheese is on the avoid list." }),
  // VERIFY: the two non-halal cards are the builder's (the plan says the library marks pork and non-halal deli meats).
  tc("pork", "Grilled pork chop", "pf", ["pf"], [0, 5, 0, 5], "nh", { why:"Pork isn’t halal." }),
  // mixed dishes and drinks
  tc("deli", "Cold deli turkey sandwich", "mx", ["wg", "pf"], null, "av", { why:"Cold deli meat can carry " + L + "." }),
  tc("salami", "Salami sandwich (pork, cold deli)", "mx", ["wg", "pf"], null, "av nh", { why:"Cold deli meat can carry " + L + ", and salami made with pork isn’t halal." }),
  tc("milk", "Milk (1 cup)", "dr", ["dr"], [5, 0, 30, 15], "ca"),
  tc("soy", "Fortified soy beverage (1 cup)", "dr", ["dr"], [5, 0, 30, 15], "ca"),
  tc("water", "Water", "dr", ["dr"], [0, 0, 0, 0], ""),
  // supplements (don't count toward a slot's 3 food cards; the multivitamin is a separate toggle)
  tc("algae", "Algae-based DHA supplement", "sp", ["sp"], [0, 0, 0, 0], "dha sp")
];

export default {
  id:"06-pregnancy-lactation",
  kind:"topic",
  title:"Pregnancy and lactation",
  topic:"Pregnancy & Lactation",
  readyTopic:"pregnancy and lactation",
  hero:{
    headline:"Not twice the food: twice the care.",
    text:"During pregnancy, the need for some <strong>nutrients</strong> rises a lot, while the need for <strong>energy</strong> rises only a little, and only later on. <strong>Folate</strong> matters most at the very start, <strong>iron</strong> builds blood for two, and <strong>DHA</strong> helps build a brain. Some foods need extra care because of <strong>" + L + "</strong>, <strong>mercury</strong> or <strong>alcohol</strong>.",
    fig:{ html:'<div class="pl-hero" id="pl-hero"></div>', caption:"" },
    aria:"A timeline runs from before pregnancy through trimesters 1, 2 and 3 to breastfeeding. At about 4 weeks a marker reads “neural tube closes”, with “often before a pregnancy is known” beneath it, while a folate icon pulses. An iron icon grows across trimesters 2 and 3 as a blood band thickens, and vitamin D and DHA icons sit above the later trimesters. Last, a breastfeeding band appears with a water-drop icon for fluids.",
    caption:"Before pregnancy → three trimesters → breastfeeding"
  },
  goals:[
    "I can explain why needs for folate, iron, vitamin D and omega-3 fats change before and during pregnancy.",
    "I can describe how nutrition needs change across the trimesters and while breastfeeding.",
    "I can choose food sources and a prenatal supplement that meet key needs, using Canada’s Food Guide and labels.",
    "I can identify foods and drinks to avoid or handle carefully during pregnancy, and explain why.",
    "I can evaluate pregnancy and breastfeeding products and claims using evidence."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Nutrient roles", goal:1,
          prompt:"Which nutrient helps red blood cells carry oxygen around the body?",
          options:[
            { t:"Iron", ok:true, why:"Iron is part of hemoglobin, which carries oxygen." },
            { t:"Calcium", why:"Calcium builds bones and teeth and helps muscles contract." },
            { t:"Vitamin C", why:"Vitamin C helps the body absorb plant iron, but it doesn’t carry oxygen." },
            { t:"Fibre", why:"Fibre helps digestion; it isn’t absorbed into the blood." }],
          hints:["Think of the protein in red blood cells.", "Hemoglobin needs one mineral at its centre.", "Iron."] },
        { id:"w2", skill:"Nutrient roles", goal:1,
          prompt:"Folate is a B vitamin. What is it especially needed for?",
          options:[
            { t:"Making new cells and DNA", ok:true, why:"Folate is needed whenever cells divide quickly, as in early pregnancy." },
            { t:"Blood clotting", why:"That’s vitamin K. Vitamin K helps blood clot." },
            { t:"Building bones", why:"That’s calcium and vitamin D. Bones need calcium and vitamin D." },
            { t:"Seeing in dim light", why:"That’s vitamin A. Vitamin A helps night vision." }],
          hints:["When do cells divide fastest?", "Folate helps copy DNA.", "Making new cells and DNA."] },
        { id:"w3", skill:"Canada’s Food Guide and labels", goal:3,
          prompt:"Canada’s Food Guide (2019) suggests filling half your plate with…",
          options:[
            { t:"Vegetables and fruits", ok:true, why:"Half the plate is vegetables and fruits." },
            { t:"Whole grain foods", why:"Whole grains fill a quarter." },
            { t:"Protein foods", why:"Protein foods fill a quarter." },
            { t:"Milk and dairy", why:"The 2019 guide has no separate dairy group; dairy foods are protein foods." }],
          hints:["Picture the plate.", "The biggest section is the most colourful.", "Vegetables and fruits."] },
        { id:"w4", skill:"Food safety basics", goal:4,
          prompt:"Which bacterium can <strong>grow in the fridge</strong> and is a special concern with ready-to-eat deli meats?",
          options:[
            { t:"<i>Listeria monocytogenes</i>", ok:true, why:L + " can grow at fridge temperatures." },
            { t:"<i>Salmonella</i>", why:"<i>Salmonella</i> is mostly linked to raw poultry and eggs, and it grows best at warm temperatures." },
            { t:"<i>E. coli</i> O157:H7", why:"It’s mostly linked to undercooked ground beef and unwashed produce." },
            { t:"<i>Clostridium botulinum</i>", why:"It’s linked to improperly canned foods and, for infants, honey." }],
          hints:["Which one is unusual because cold doesn’t stop it?", "Its name starts with L.", L + "."] },
        { id:"w5", skill:"Canada’s Food Guide and labels", goal:3,
          prompt:"A cereal’s Nutrition Facts table shows <strong>iron 30% DV</strong>. By Health Canada’s quick guide, that’s…",
          options:[
            { t:"A lot", ok:true, why:"15% DV or more is a lot." },
            { t:"A little", why:"5% or less is a little." },
            { t:"Exactly the daily need, because 30% is a third of a day", why:"%DV compares one serving with a daily value; it isn’t a full day’s need." },
            { t:"Can’t tell without the grams", why:"%DV already does that comparison for you." }],
          hints:["Remember 5 and 15.", "Is 30 above or below 15?", "A lot."] },
        { id:"w6", skill:"Food safety basics", goal:4,
          prompt:"What does <strong>pasteurized</strong> mean on a milk or cheese label?",
          options:[
            { t:"Heated enough to kill harmful microbes", ok:true, why:"Pasteurization uses heat to make milk safer." },
            { t:"Organic", why:"Organic is about how the food is produced, not about killing microbes." },
            { t:"Raw and unprocessed", why:"That’s the opposite. Raw milk is <strong>un</strong>pasteurized." },
            { t:"Freeze-dried", why:"Freeze-drying removes water; it isn’t pasteurization." }],
          hints:["It’s named after Louis Pasteur.", "It involves heat.", "Heated to kill harmful microbes."] }
      ],
      refreshers:{
        "Nutrient roles":"Iron carries oxygen in hemoglobin; folate helps make DNA and new cells; calcium and vitamin D build bones; DHA is an omega-3 fat that helps build the brain and eyes.",
        "Canada’s Food Guide and labels":"Half the plate is vegetables and fruits, a quarter whole grains, a quarter protein foods. On labels, 5% DV or less is a little and 15% DV or more is a lot.",
        "Food safety basics":"Pasteurized means heated to kill harmful microbes. " + L + " is unusual because it can grow in the fridge."
      }
    }
  },
  explore:{
    heading:"Nine months of nutrition",
    intro:"Slide along the timeline. Watch which nutrients matter most at each stage, then check a persona’s day of food.",
    // F6 life-stage switcher. Milestones for "before", trimester 2 and breastfeeding are the builder's (the plan gives three).
    stages:[
      { id:"pre", t:"Before pregnancy", short:"Before", milestone:"Folate and iron stores built now are ready for the very first weeks." },
      { id:"w14", t:"Weeks 1–4", short:"Weeks 1–4", tri:1, milestone:"The neural tube forms and closes." },
      { id:"t1", t:"Weeks 5–13 (trimester 1)", short:"Weeks 5–13", tri:1, milestone:"Major organs are forming." },
      { id:"t2", t:"Weeks 14–27 (trimester 2)", short:"Weeks 14–27", tri:2, milestone:"The baby grows quickly, and the bones begin to harden." },
      { id:"t3", t:"Weeks 28–40 (trimester 3)", short:"Weeks 28–40", tri:3, milestone:"Rapid brain growth; the baby stores iron." },
      // VERIFY: Health Canada's advice on breastfeeding alone for about the first 6 months (module 07 covers it).
      { id:"bf", t:"Breastfeeding 0–6 months", short:"Breastfeeding", milestone:"The baby grows on breast milk, and making milk raises the parent’s fluid needs." }
    ],
    personas:[
      { id:"noura", t:"Noura", age:29, teen:false, desc:"29 · a family physician’s patient in Hamilton · eats halal" },
      { id:"jess", t:"Jess", age:17, teen:true, desc:"17 · in Grade 12 · eats a vegan diet" },
      { id:"dana", t:"Dana", age:34, teen:false, desc:"34 · a nurse in Thunder Bay · breastfeeding twins" }
    ],
    // Needs by stage [pre, w14, t1, t2, t3, bf] from Health Canada's DRI tables (females; teen = 14–18, adult = 19–50).
    // VERIFY: every DRI value before release. The plan gives folate 400 → 600, iron 18 → 27 and calcium 1000 (teen 1300);
    // the rest (teen iron 15, lactation values, vitamin D, total water AIs) were supplied by the builder.
    nutrients:[
      { id:"folate", t:"Folate", col:"micro", unit:"µg DFE a day", kind:"RDA",
        adult:[400, 600, 600, 600, 600, 500], teen:[400, 600, 600, 600, 600, 500],
        why:{ pre:"The neural tube closes in about the first 4 weeks after conception, often before a pregnancy is known.", w14:"The neural tube closes in about the first 4 weeks after conception, often before a pregnancy is known.", preg:"Folate supports rapid cell division.", bf:"Folate passes into breast milk, so the need stays above the usual." },
        sources:"Lentils, chickpeas, spinach, asparagus, oranges, fortified grain products" },
      { id:"iron", t:"Iron", col:"micro", unit:"mg a day", kind:"RDA",
        adult:[18, 27, 27, 27, 27, 9], teen:[15, 27, 27, 27, 27, 10],
        why:{ pre:"Good iron stores before pregnancy help with what comes next.", preg:"Blood volume rises sharply, and the baby stores iron for the first months of life.", bf:"The need drops below the usual: little iron goes into milk, and periods often haven’t returned yet." },
        sources:"Beef, lentils, chickpeas, calcium-set tofu, fortified cereal; pair plant iron with vitamin C (an orange, red pepper)" },
      { id:"vitd", t:"Vitamin D", col:"micro", unit:"µg a day", kind:"RDA", iu:40,
        adult:[15, 15, 15, 15, 15, 15], teen:[15, 15, 15, 15, 15, 15],
        why:{ pre:"Works with calcium to build and keep bones.", preg:"Works with calcium to build the baby’s bones.", bf:"Works with calcium for bones; the need stays the same." },
        sources:"Milk, fortified soy beverage, salmon and trout, eggs" },
      { id:"calcium", t:"Calcium", col:"micro", unit:"mg a day", kind:"RDA",
        adult:[1000, 1000, 1000, 1000, 1000, 1000], teen:[1300, 1300, 1300, 1300, 1300, 1300],
        why:{ pre:"Calcium builds bones; teens need more (1300 mg) than adults (1000 mg).", preg:"Absorption rises in pregnancy, so the recommended amount doesn’t change. Getting <strong>enough</strong> still matters, especially for teens, whose RDA is higher (1300 mg).", bf:"The RDA stays the same while breastfeeding; getting enough still matters." },
        sources:"Milk, yogurt, fortified soy beverage, calcium-set tofu, canned salmon with bones" },
      // VERIFY: Health Canada's advice of at least 150 g of cooked fish a week in pregnancy and breastfeeding (no RDA for DHA).
      { id:"dha", t:"DHA (omega-3)", col:"fat", none:true,
        noneText:"no RDA is set for DHA. Health Canada advises at least 150 g of cooked fish a week, choosing fish low in mercury.",
        why:{ pre:"Choosing fish low in mercury is a good habit before pregnancy.", preg:"Helps build the baby’s brain and eyes.", t3:"Rapid brain growth in trimester 3: DHA helps build the brain and eyes.", bf:"DHA passes into breast milk for the baby’s brain and eyes." },
        sources:"Salmon, trout and other low-mercury fish; algae-based DHA supplements" },
      { id:"energy", t:"Energy", col:"ink", words:true,
        why:{ all:M1 },
        sources:"Nutrient-rich foods from every part of the plate: vegetables and fruits, whole grains, protein foods" },
      { id:"fluids", t:"Fluids", col:"water", unit:"L a day (total water from food and drinks)", kind:"AI",
        adult:[2.7, 3, 3, 3, 3, 3.8], teen:[2.3, 3, 3, 3, 3, 3.8],
        why:{ pre:"Water carries nutrients and wastes and helps control body temperature.", preg:"Fluids support the higher blood volume, and milk production later.", bf:"Making milk raises fluid needs, and thirst rises." },
        sources:"Water (the drink of choice), milk or fortified soy beverage, soups, juicy fruits" }
    ],
    // Energy is words only (plan; no Calories). VERIFY: Health Canada energy guidance.
    energy:{ pre:"Usual needs: no extra energy.", w14:"No extra energy needed in trimester 1.", t1:"No extra energy needed in trimester 1.",
      t2:"A little more: about one or two extra small snacks a day.", t3:"A little more: about one or two extra small snacks a day.", bf:"A little more energy (and fluid) while breastfeeding." },
    // VERIFY: Health Canada's folic acid (0.4 mg) and iron (16–20 mg) multivitamin advice.
    supp:{ pre:"Health Canada: a daily multivitamin with 0.4 mg folic acid for anyone who could become pregnant.",
      preg:"Health Canada: a daily multivitamin with 0.4 mg folic acid (and 16–20 mg iron during pregnancy).",
      bf:"Keep taking a multivitamin while breastfeeding.",
      dha:"An algae-based DHA supplement is an option without fish; discuss it with a provider." },
    plate:{
      label:"Model values for learning: % of the pregnancy RDA per card; real foods vary.",
      // VERIFY: teen calcium RDA 1300 mg (plan: each calcium card counts at 1000/1300 of its value, rounded down).
      teenNote:"Jess is 17: a teen’s calcium RDA is 1300 mg, higher than an adult’s, so each card’s calcium counts at 1000/1300 of its value, rounded down.",
      vitC:"Vitamin C helps the body absorb plant iron. Add a red pepper or orange.",
      cards:PLATE
    },
    fridge:{
      title:"Dana’s fridge",
      bins:[{ id:"enjoy", t:"Enjoy" }, { id:"cook", t:"Cook or heat first" }, { id:"avoid", t:"Avoid or limit" }],
      // VERIFY: Health Canada guidance for each item.
      items:[
        { id:"yogurt", t:"Pasteurized yogurt", answer:"enjoy" },
        { id:"sprouts", t:"Raw bean sprouts", answer:"avoid" },
        { id:"ham", t:"Cold deli ham", answer:"cook" },
        { id:"cheese", t:"Unpasteurized (raw-milk) soft cheese", answer:"avoid" },
        { id:"eggs", t:"Eggs with runny yolks", answer:"cook" },
        { id:"sword", t:"Swordfish steak", answer:"avoid" },
        { id:"salmon", t:"Cooked salmon fillet", answer:"enjoy" },
        { id:"wine", t:"Wine spritzer", answer:"avoid" }
      ]
    },
    predictions:[
      { id:"p1", prompt:"Timeline at “Before pregnancy”, focus: folate. When does the neural tube close?",
        options:[{ t:"Within about the first 4 weeks after conception", ok:true }, { t:"Around the end of the first trimester" }, { t:"In the second trimester" }, { t:"Just before birth" }],
        explain:"The neural tube closes by about day 28 after conception, often before a pregnancy is known. That’s why folic acid matters <em>before</em> pregnancy." },
      // VERIFY: iron RDA 18 → 27 mg (plan: verify before release).
      { id:"p2", prompt:"Focus: iron, Noura (age 29). How does the iron RDA change from before pregnancy to during pregnancy?",
        options:[{ t:"It stays the same" }, { t:"It rises by about half (18 → 27 mg a day)", ok:true }, { t:"It doubles" }, { t:"It triples" }],
        explain:"Blood volume rises sharply, and the baby stores iron for the first months of life." },
      // VERIFY: calcium RDA 1000 mg for adults, 1300 mg for teens.
      { id:"p3", prompt:"Focus: calcium, Noura. Does the calcium RDA go up during pregnancy?",
        options:[{ t:"No: the body absorbs calcium more efficiently instead", ok:true }, { t:"Yes, it doubles" }, { t:"Yes, by half" }, { t:"Only in the first trimester" }],
        explain:"Absorption rises in pregnancy, so the recommended amount doesn’t change. Getting <strong>enough</strong> still matters, especially for teens, whose RDA is higher (1300 mg)." },
      { id:"p4", prompt:"Focus: energy, trimester 1. How much extra energy does Health Canada suggest in the first trimester?",
        options:[{ t:"None", ok:true }, { t:"Twice the usual" }, { t:"An extra full meal" }, { t:"An extra 1000 Calories" }],
        explain:"Energy needs rise only a little, and only in the second and third trimesters. “Eating for two” is a myth." }
    ],
    challenges:[
      { id:"tc1", goal:[3, 4],
        prompt:"Plate check: build Noura’s trimester-1 day so that <strong>folate and iron both reach 100%</strong>, with at least <strong>3 food cards</strong> (the multivitamin doesn’t count as a food) and <strong>no avoid items</strong>.",
        why:"Nutrient-rich foods plus the multivitamin meet the need, with no risky foods.",
        msgs:{
          persona:"This challenge is Noura’s day. Choose Noura, then build the day in Plate check.",
          empty:"Open Plate check and add cards to Noura’s day.",
          multi:"Supplements add to food; they don’t replace it. Add at least 3 foods.",
          foods:"Add at least 3 food cards. The multivitamin doesn’t count as a food.",
          pate:"Liver pâté is on the avoid list: " + L + " risk, and very high vitamin A, which can harm the baby.",
          deli:M4 + " Turn on “heated until steaming”, or remove the sandwich.",
          ironClose:"Close. A fortified cereal or beef stew adds iron. Pair plant iron with an orange or red pepper to help absorb it.",
          // the two lines below are the builder's (the plan names no wrong state for low folate or very low iron)
          folate:"Folate is at {v}%; it needs to reach 100%. Start with the multivitamin, then add folate-rich foods.",
          iron:"Iron is at {v}%; it needs to reach 100%. Lentil curry, fortified cereal and beef stew are iron-rich." },
        hints:["Start with the multivitamin, then add folate-rich foods.", "Lentil curry is high in both folate and iron.", "Multivitamin + lentil curry + fortified cereal + orange works."] },
      { id:"tc2", goal:4,
        prompt:"Fridge sort: put Dana’s 8 items in the right bins.",
        why:"Heat fixes the " + L + " risk in deli meats and eggs; nothing fixes mercury or alcohol.",
        msgs:{
          ham:"Deli meats can carry " + L + ", which grows in the fridge. Heat until steaming hot.",
          sword:"Swordfish is high in mercury. Choose low-mercury fish like salmon or trout instead.",
          wine:"Cooking isn’t the issue: there’s no known safe amount of alcohol in pregnancy.",
          // the two lines below are the builder's
          unplaced:"Put all 8 items in a bin first: {n} still in the fridge.",
          count:"{k} of 8 items are in the right bins. Ask of each item: is the risk " + L + ", mercury or alcohol?" },
        hints:["Ask of each item: is the risk " + L + ", mercury or alcohol?", "Heat fixes the " + L + " risk in deli meats and eggs; nothing fixes mercury or alcohol.",
          "Enjoy: pasteurized yogurt, cooked salmon fillet. Cook or heat first: cold deli ham (until steaming hot), eggs with runny yolks (until the yolk is firm). Avoid or limit: raw bean sprouts, unpasteurized (raw-milk) soft cheese, swordfish steak (mercury), wine spritzer (no known safe amount of alcohol)."] },
      { id:"tc3", goal:[3, 4], stretch:true,
        prompt:"Plate check for <strong>Jess</strong> (17, vegan, trimester 3): reach 100% for <strong>folate, iron and calcium</strong>, include a <strong>DHA source</strong>, and use no animal foods. Cards may be added more than once.",
        why:"Plant foods, fortified foods and an algae-based DHA supplement cover the needs without animal foods.",
        msgs:{
          persona:"This challenge is Jess’s day. Choose Jess, then build the day in Plate check.",
          empty:"Open Plate check and add cards to Jess’s day.",
          salmon:"Jess is vegan. An algae-based DHA supplement provides DHA without fish.",
          calcium:"Teens need more calcium. Add another calcium-set tofu or fortified soy beverage.",
          // the lines below are the builder's
          animal:"Jess is vegan: remove the animal foods ({list}).",
          dha:"Add a DHA source. Which cards give DHA without fish?",
          folate:"Folate is at {v}%; it needs to reach 100%.",
          iron:"Iron is at {v}%; it needs to reach 100%." },
        hints:["Which cards give DHA without fish?", "For calcium, use calcium-set tofu and fortified soy beverage, which count for less at Jess’s age.", "Tofu × 2 + soy beverage × 2 + lentil curry + fortified cereal + multivitamin + algae DHA + red pepper."] }
    ],
    blocks:[{ title:"What the timeline shows", html:"<p>The bars move far more for <strong>folate</strong> and <strong>iron</strong> than any energy readout would. Good planning means <strong>nutrient-rich</strong> choices, a prenatal multivitamin, and care with a short list of risky foods.</p><p class=\"tiny muted\">" + ADVICE + "</p>" }]
  },
  part3:{
    slug:"myths", name:"Myths", heading:"Myth or fact?",
    intro:"Pregnancy attracts a flood of advice and products. Check eight common claims, one at a time: choose <strong>Myth</strong>, <strong>Fact</strong> or <strong>It depends</strong>, then open <strong>Check it with data</strong> to see the evidence.",
    verdicts:[{ id:"myth", t:"Myth" }, { id:"fact", t:"Fact" }, { id:"depends", t:"It depends" }],
    // VERIFY: every source and statement before release (plan). Source-type labels are the builder's.
    claims:[
      { id:"c1", t:"“You’re eating for two, so double your portions.”", answer:"myth", core:M1, src:"Health Canada guidance",
        data:"Health Canada: no extra energy in trimester 1; a modest increase in trimesters 2–3." },
      // VERIFY: 1998 fortification and the size of the drop.
      { id:"c2", t:"“Folic acid only matters once you know you’re pregnant.”", answer:"myth", core:M2, src:"Health Canada guidance and a large population study",
        data:"The neural tube closes by about 4 weeks after conception. Canada’s 1998 fortification of white flour and enriched pasta with folic acid was followed by a large drop in neural tube defects." },
      // VERIFY: the high-mercury fish list.
      { id:"c3", t:"“Avoid all fish during pregnancy.”", answer:"myth", core:M3, src:"Health Canada guidance",
        data:"Health Canada encourages fish low in mercury for their omega-3 fats, and advises limiting high-mercury fish (fresh or frozen tuna, shark, swordfish, marlin, orange roughy, escolar)." },
      { id:"c4", t:"“A glass of wine in the third trimester is fine.”", answer:"myth", core:M5, src:"Health Canada guidance",
        data:"No known safe amount of alcohol in pregnancy; fetal alcohol spectrum disorder (FASD) is preventable." },
      { id:"c5", t:"“Herbal ‘pregnancy teas’ are safe because they’re natural.”", answer:"depends", core:M6, src:"Expert consensus",
        data:"Some herbs aren’t recommended in pregnancy; ask a health care provider about specific products." },
      // VERIFY: breastfeeding fluid and energy guidance.
      { id:"c6", t:"“Breastfeeding parents need extra fluids and a little more energy.”", answer:"fact", src:"Health Canada guidance",
        data:"Thirst rises; a little extra food helps meet the demands of milk production." },
      // VERIFY: Health Canada's caffeine guidance (about 300 mg a day).
      { id:"c7", t:"“Pregnant people should keep caffeine to about 300 mg a day.”", answer:"fact", src:"Health Canada guidance",
        data:"Health Canada’s guidance for people who are pregnant, planning to be or breastfeeding: about 300 mg a day, about two small cups of coffee." },
      { id:"c8", t:"“Cravings mean your body needs that exact nutrient.”", answer:"myth-mostly", src:"Expert consensus from reviews of studies",
        data:"Evidence doesn’t support that cravings reliably signal a specific nutrient need. Cravings for non-foods (pica) should be mentioned to a provider." }
    ],
    // Inquiry link (A3.3) after card 2. Model data: illustrative shape only. VERIFY: the real Canadian figures before release.
    inquiry:{
      title:"Check it with data: fortification and neural tube defects",
      tag:"Model data: illustrative shape; verify the real figures",
      // relative rates, not real figures (1 = the average before 1998)
      years:[1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002],
      rate:[1, 1.02, 0.97, 0.99, 0.96, 0.84, 0.62, 0.55, 0.54, 0.53],
      prompt:"What else would you want to rule out before saying fortification <em>caused</em> the drop?",
      // feedback lines are the builder's (plan: "Feedback explains confounding")
      choices:[
        { t:"Other changes at the same time (e.g. better prenatal screening)", ok:true, fb:"Right. Anything else that changed around 1998 and could also lower the rate, such as better prenatal screening, is a possible <strong>confounder</strong>. It has to be ruled out before you can say fortification caused the drop." },
        { t:"The bars’ colours", fb:"Not quite. The colours don’t change the rate. Look for something else that changed at the same time and could also lower the rate: a possible confounder." },
        { t:"Whether flour is healthy", fb:"Not quite. That doesn’t explain the drop. Look for something else that changed at the same time and could also lower the rate: a possible confounder." },
        { t:"The number of bakeries", fb:"Not quite. That wouldn’t change the defect rate. Look for something else that changed at the same time and could also lower the rate: a possible confounder." }]
    },
    // VERIFY: reference titles, years and details before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>De Wals, P., Tairou, F., Van Allen, M. I., Uh, S.-H., Lowry, R. B., Sibbald, B., Evans, J. A., Van den Hof, M. C., Zimmer, P., Crowley, M., Fernandez, B., Lee, N. S., &amp; Niyonsenga, T. (2007). Reduction in neural-tube defects after folic acid fortification in Canada. <i>New England Journal of Medicine, 357</i>(2), 135–142.</li><li>Health Canada. (2009). <i>Prenatal nutrition guidelines for health professionals</i>. Government of Canada.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Food safety for pregnant women</i>. Government of Canada.</li><li>MRC Vitamin Study Research Group. (1991). Prevention of neural tube defects: Results of the Medical Research Council Vitamin Study. <i>The Lancet, 338</i>(8760), 131–137.</li></ul>' }],
    quickCheck:{
      title:"Myth or fact? quick check", summary:"Myth or fact? quick check",
      items:[
        { id:"q1", goal:1, prompt:"Why should anyone who could become pregnant take folic acid?",
          choices:[{ t:"The neural tube closes early, often before pregnancy is known", ok:true, fb:"Right. Timing is the point: it closes in the first 4 weeks." }, { t:"Folic acid speeds up digestion", fb:"Timing is the point: it closes in the first 4 weeks." }, { t:"It replaces the need for iron", fb:"Timing is the point: it closes in the first 4 weeks." }, { t:"It prevents morning sickness", fb:"Timing is the point: it closes in the first 4 weeks." }] },
        { id:"q2", goal:4, prompt:"Which fish is the better choice in pregnancy?",
          choices:[{ t:"Trout", ok:true, fb:"Right. Trout is low in mercury; the others are high." }, { t:"Swordfish", fb:"Trout is low in mercury; the others are high." }, { t:"Shark", fb:"Trout is low in mercury; the others are high." }, { t:"Marlin", fb:"Trout is low in mercury; the others are high." }] },
        { id:"q3", goal:5, prompt:"A “natural” tea claims to “prepare your body for labour”. Best response?",
          choices:[{ t:"Check the evidence and ask a health care provider", ok:true, fb:"Right. “Natural” isn’t evidence of safety or of benefit." }, { t:"Natural means safe, so drink it", fb:"“Natural” isn’t evidence of safety or of benefit." }, { t:"Avoid all tea forever", fb:"“Natural” isn’t evidence of safety or of benefit." }, { t:"Double the dose for faster results", fb:"“Natural” isn’t evidence of safety or of benefit." }] },
        { id:"q4", goal:4, prompt:"How much alcohol is safe in pregnancy?",
          choices:[{ t:"No known safe amount", ok:true, fb:"Right. Health Canada: no known safe amount at any time." }, { t:"One drink a week", fb:"Health Canada: no known safe amount at any time." }, { t:"Only beer", fb:"Health Canada: no known safe amount at any time." }, { t:"Any amount after 20 weeks", fb:"Health Canada: no known safe amount at any time." }] }
      ]
    },
    blocksAfter:[{ html:'<div class="hfa-support" role="note"><p>Every pregnancy is different. Health care providers, including registered dietitians, give personal advice; this module gives general information.</p></div>' }]
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Nutrient ↔ why it matters in pregnancy", summary:"Nutrient ↔ why it matters", goal:[1, 3],
        instruction:"Match each nutrient with the reason it matters in pregnancy.",
        leftTitle:"Nutrient", rightTitle:"Why it matters in pregnancy",
        left:[
          { id:"l1", t:"Folate (folic acid)" },
          { id:"l2", t:"Iron" },
          { id:"l3", t:"DHA (omega-3)" },
          { id:"l4", t:"Vitamin D" },
          // VERIFY: iodized table salt in Canada (hint 1).
          { id:"l5", t:"Iodine", hints:["Which mineral is added to table salt in Canada?", "It’s needed to make thyroid hormones.", "Iodine ↔ thyroid hormones for brain development."] },
          { id:"l6", t:"Calcium" },
          { id:"l7", t:"Vitamin C" },
          { id:"l8", t:"Fluids" }
        ],
        right:[
          { id:"r1", t:"Helps the neural tube form and close in the first weeks" },
          { id:"r2", t:"Builds the extra blood and the baby’s iron stores" },
          { id:"r3", t:"Helps build the baby’s brain and eyes" },
          { id:"r4", t:"Works with calcium to build the baby’s bones" },
          { id:"r5", t:"Supports the thyroid hormones needed for brain development" },
          { id:"r6", t:"Builds the baby’s skeleton; absorption rises in pregnancy" },
          { id:"r7", t:"Helps the body absorb iron from plant foods" },
          { id:"r8", t:"Support the higher blood volume, and milk production later" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        // the plan's mismatch lines (pairs written both ways)
        wrong:{
          "l1|r2":"Iron builds blood; folate is about early cell division and the neural tube.", "l2|r1":"Iron builds blood; folate is about early cell division and the neural tube.",
          "l3|r6":"DHA is a fat for brain and eyes; calcium builds bone.", "l6|r3":"DHA is a fat for brain and eyes; calcium builds bone.",
          "l7|r2":"Vitamin C doesn’t build blood itself; it helps iron get absorbed.", "l2|r7":"Vitamin C doesn’t build blood itself; it helps iron get absorbed." },
        wrongDefault:"Read the nutrient’s main job, then try another match." },
      // ★ case set: the plan gives each case's best answer and its most likely wrong choice. The other options, the correct
      // options' feedback and the hints for C1–C5 are the builder's (flagged in the build report).
      { id:"cases", type:"mc", title:"Plan for the person", summary:"Plan for the person", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Six persona cases. Choose the best plan for each. Cases marked ★ are non-routine; the last two go beyond the Final Check.",
        items:[
          { id:"c1", goal:3, prompt:"Lin, trimester 2, is lactose intolerant. How can she meet calcium needs?",
            options:[
              { t:"Lactose-free milk, fortified soy beverage, calcium-set tofu, canned salmon with bones", ok:true, why:"Each of these gives calcium with little or no lactose." },
              { t:"Avoid all calcium sources", why:"Lactose-free and plant options exist." },
              { t:"Drink regular milk and put up with the symptoms", why:"There’s no need: lactose-free and plant options give calcium without the discomfort." },
              { t:"Rely on spinach as the main calcium source", why:"Spinach’s oxalates block most of its calcium. Lactose-free and plant options work better." }],
            hints:["Which foods give calcium without lactose?", "Lactose-free milk, fortified soy beverage and calcium-set tofu all count.", "Lactose-free milk, fortified soy beverage, calcium-set tofu, canned salmon with bones."] },
          { id:"c2", goal:2, prompt:"Amara (persona) has morning sickness in trimester 1. Which tip fits?",
            options:[
              { t:"Small, frequent meals and snacks; dry crackers; sip fluids between meals", ok:true, why:"These often help; tell a provider if vomiting is severe." },
              { t:"Skip meals until it passes", why:"Small, frequent meals usually help more; tell a provider if vomiting is severe." },
              { t:"Eat three large meals to make up for lost food", why:"Large meals often make nausea worse; small, frequent meals usually help more." },
              { t:"Drink large glasses of fluid with every meal", why:"Sipping fluids between meals usually sits better than large drinks with food." }],
            hints:["What usually helps nausea: big meals or small ones?", "Small, frequent meals and dry foods often sit better.", "Small, frequent meals and snacks; dry crackers; sip fluids between meals."] },
          { id:"c3", goal:[1, 3], prompt:"A persona with iron-deficiency anemia eats vegetarian. Which plan best raises iron absorption? <span class=\"tag\">★</span>",
            options:[
              { t:"Iron-rich legumes and tofu <strong>with</strong> a vitamin C food, tea and coffee <strong>between</strong> meals, plus a provider-recommended supplement", ok:true, why:"Vitamin C helps plant iron get absorbed, tea and coffee are kept away from meals, and a provider sets any supplement." },
              { t:"Drink tea with every meal", why:"Tea and coffee reduce plant-iron absorption when taken with meals." },
              { t:"Add a glass of milk to every meal", why:"Milk is great for calcium, but calcium can reduce iron absorption at the same meal." },
              { t:"Take extra iron pills without telling a provider", why:"A provider sets the dose: too much iron can be harmful." }],
            hints:["What helps plant iron get absorbed, and what blocks it?", "Vitamin C helps; tea and coffee with meals block it.", "Iron-rich legumes and tofu with a vitamin C food, tea and coffee between meals, plus a provider-recommended supplement."] },
          { id:"c4", goal:2, prompt:"A persona develops gestational diabetes. Which general idea is part of the usual plan? <span class=\"tag\">★</span>",
            options:[
              { t:"Spread carbohydrate across meals and snacks, with guidance from the care team", ok:true, why:"Spreading carbohydrate out is the key idea. Personal plans come from the care team." },
              { t:"Cut out all carbohydrate", why:"Carbohydrate is still needed; spreading it out is the key idea. Personal plans come from the care team." },
              { t:"Eat most of the day’s carbohydrate at one large meal", why:"Spreading carbohydrate across meals and snacks is the key idea, not bunching it together." },
              { t:"Skip meals to keep blood sugar low", why:"Regular meals and snacks, with carbohydrate spread out, are the usual idea. Personal plans come from the care team." }],
            hints:["Is carbohydrate removed, or spread out?", "Spreading carbohydrate across meals and snacks is the usual idea.", "Spread carbohydrate across meals and snacks, with guidance from the care team."] },
          { id:"c5", goal:[2, 5], prompt:"A persona observes Ramadan and is pregnant. What’s the respectful, evidence-informed response? <span class=\"tag\">★</span>",
            options:[
              { t:"Many faith traditions allow exemptions in pregnancy; the decision is personal, made with religious guidance and the care team", ok:true, why:"It respects the person’s choice, and planning with the care team matters." },
              { t:"Fasting is always forbidden", why:"Respect the person’s choice; planning with the care team matters." },
              { t:"Fasting needs no planning", why:"Respect the person’s choice; planning with the care team matters." },
              { t:"Decide for the person, based on what most people do", why:"The decision is personal: respect the person’s choice, made with religious guidance and the care team." }],
            hints:["Who makes the decision?", "The person, with religious guidance and the care team.", "Many faith traditions allow exemptions in pregnancy; the decision is personal, made with religious guidance and the care team."] },
          // VERIFY: the 1991 UK MRC trial.
          { id:"c6", goal:5, prompt:"Neural tube defects in Canada fell after 1998 (model graph). Which study design would test <em>causation</em> most strongly? <span class=\"tag\">★ Inquiry</span>",
            options:[
              { t:"A randomized trial of folic acid vs no folic acid before conception (historically done: the 1991 UK MRC trial)", ok:true, why:"Random assignment balances other factors, so a difference can be put down to folic acid." },
              { t:"Compare two years of data", why:"Before-and-after data can’t rule out other changes; a randomized trial controls for them." },
              { t:"Survey people about how much bread they remember eating", why:"A survey is observational and can’t rule out other factors; a randomized trial controls for them." },
              { t:"Compare provinces with high and low bread sales", why:"That’s still observational: other differences between provinces could explain it. A randomized trial controls for them." }],
            hints:["Which design assigns the treatment at random?", "Random assignment balances other factors.", "A randomized controlled trial."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Fabian", goal:[2, 4], how:"",
        instruction:"Fabian made one mistake in each plan. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Advise a friend who just learned she’s 8 weeks pregnant.",
            steps:["“Keep taking a multivitamin with 0.4 mg folic acid every day.”", "“Since you’re eating for two, double your portions now.”", "“Fill half your plate with vegetables and fruits.”", "“Choose low-mercury fish like salmon twice a week.”"],
            answer:1, stepFb:["Step 1 is correct: folic acid matters throughout early pregnancy.", "", "Step 3 is good advice. The mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"“In the first trimester you don’t need extra energy; focus on nutrient-rich foods and your multivitamin.”", ok:true, why:M1 },
              { t:"“Triple your portions in the first trimester.”", why:"That’s worse. " + M1 },
              { t:"“Eat less to stay small.”", why:"Restricting food isn’t safe in pregnancy; a provider gives personal guidance." },
              { t:"Step 2 is correct.", why:"Energy needs don’t rise in trimester 1." }],
            hints:["What does “eating for two” get wrong?", "Check the trimester-1 energy readout.", "No extra energy in trimester 1."] },
          // VERIFY: refrigerated smoked seafood on Health Canada's list.
          { id:"e2", goal:4, task:"Plan a picnic lunch for a pregnant friend.",
            steps:["“Pack whole-grain buns and cut vegetables.”", "“Add refrigerated smoked salmon: it’s already cooked, so it’s safe straight from the cooler.”", "“Bring pasteurized cheddar and grapes.”", "“Keep everything in a cooler with ice packs.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is fine. The mistake is earlier.", "Step 4 is good practice."],
            fixes:[
              { t:"“Swap the smoked salmon for canned salmon, or use smoked salmon only cooked into a hot dish.”", ok:true, why:M4 },
              { t:"“Smoked salmon is fine if it’s from a good store.”", why:L + " risk doesn’t depend on the store." },
              { t:"“Freeze the smoked salmon first.”", why:"Freezing doesn’t reliably kill " + L + "." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Which bacterium grows in the cold?", "Refrigerated smoked seafood is on Health Canada’s list.", "Use canned salmon or cook it into a dish."] },
          // VERIFY: Health Canada guidance on alcohol and breastfeeding (fix wording).
          { id:"e3", goal:2, task:"Explain alcohol and breastfeeding to a new parent.",
            steps:["“Alcohol passes into breast milk.”", "“Its level in milk rises and falls with the level in the blood.”", "“So pump and discard right after a drink to clear it faster.”", "“Then you can feed immediately.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 depends on step 3’s mistake."],
            fixes:[
              { t:"“Pumping doesn’t speed up how fast alcohol leaves; only time does. Not drinking is safest; anyone choosing to drink should plan feeds around the time alcohol takes to leave.”", ok:true, why:M7 },
              { t:"“Drink water to flush it out of the milk faster.”", why:"Water doesn’t speed alcohol elimination." },
              { t:"“Alcohol never enters breast milk.”", why:"Step 1 is correct: it does." },
              { t:"Step 3 is correct.", why:M7 }],
            hints:["What lowers the blood alcohol level?", "Only time: the liver breaks alcohol down.", "Pumping can relieve fullness but doesn’t clear alcohol faster."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you most on the timeline: the timing of folate, the small change in energy needs, or the iron jump?" },
      { id:"j2", q:"In your own words, why does Health Canada give folic acid advice to people who <em>could</em> become pregnant, not just those who are?" },
      { id:"j3", q:"Explain to a friend how to tell whether a pregnancy food product’s claim is trustworthy." },
      { id:"j4", q:"Which part of this module still feels unclear? Where could you find reliable information (e.g. Health Canada, a registered dietitian)?" }
    ]
  },
  final:{
    // Options without feedback in the plan reuse its misconception sentences (M1–M7) or a short line by the builder.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Why is folic acid most important <strong>before</strong> pregnancy and in its first weeks?", options:[
          { t:"The neural tube closes in about the first 4 weeks after conception", ok:true, why:"Often before a pregnancy is known." },
          { t:"Folic acid prevents morning sickness", why:"There’s no evidence it does." },
          { t:"The baby’s bones form in the first week", why:"Bones form later; that’s calcium and vitamin D." },
          { t:"Folic acid is only absorbed early in pregnancy", why:"It’s absorbed throughout; timing is about the neural tube." }] },
        // VERIFY: Health Canada's 0.4 mg folic acid advice.
        b:{ prompt:"Health Canada advises a daily multivitamin with 0.4 mg folic acid for…", options:[
          { t:"Everyone who could become pregnant", ok:true, why:"Because the neural tube closes so early." },
          { t:"Only people in the third trimester", why:"Too late for the neural tube." },
          { t:"Only people who have been pregnant before", why:"The advice applies to anyone who could become pregnant." },
          { t:"Only people who eat no vegetables", why:"Food alone rarely provides enough; the advice applies to all." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which food should be avoided during pregnancy because of " + L + "?", options:[
          { t:"Unpasteurized soft cheese", ok:true, why:"Raw-milk soft cheeses can carry " + L + "." },
          { t:"Pasteurized cheddar", why:"Pasteurized hard cheese is fine." },
          { t:"Canned salmon", why:"Canned fish is heat-processed." },
          { t:"A well-cooked chicken breast", why:"Thorough cooking kills " + L + "." }] },
        b:{ prompt:"Which food should be avoided <strong>unless cooked into a hot dish</strong>?", options:[
          { t:"Refrigerated smoked salmon", ok:true, why:M4 },
          { t:"Canned light tuna", why:"Canned fish is heat-processed; follow Health Canada’s limits on the amount." },
          { t:"Pasteurized yogurt", why:"Pasteurized yogurt is fine." },
          { t:"Hard-cooked eggs", why:"Firm-cooked eggs are fine." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Health Canada says extra energy is needed in…", options:[
          { t:"The second and third trimesters, a modest amount", ok:true, why:M1 },
          { t:"All three trimesters, double the usual", why:M1 },
          { t:"Only the first trimester", why:"None is needed in trimester 1." },
          { t:"None of pregnancy", why:"A modest amount is needed later." }] },
        b:{ prompt:"How much extra energy is suggested in the <strong>first</strong> trimester?", options:[
          { t:"None", ok:true, why:M1 },
          { t:"Double the usual amount", why:M1 },
          { t:"One extra full meal a day", why:M1 },
          { t:"It depends only on cravings", why:"Cravings don’t set energy needs." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Persona Ravi is a vegetarian partner helping plan meals for his pregnant spouse, whose iron is low. Which single change best raises iron absorbed from dinner?", options:[
          { t:"Add lentils and serve them with red pepper strips", ok:true, why:"Plant iron plus vitamin C." },
          { t:"Add a cup of tea with dinner", why:"Tea reduces plant-iron absorption." },
          { t:"Add extra rice", why:"Rice is low in iron." },
          { t:"Add a glass of milk with dinner", why:"Milk is great for calcium, but calcium can reduce iron absorption at the same meal." }] },
        b:{ prompt:"A pregnant persona doesn’t eat meat and needs more iron. Which lunch is best for iron absorption?", options:[
          { t:"Tofu stir-fry with broccoli and an orange", ok:true, why:"Plant iron plus vitamin C." },
          { t:"Cheese sandwich with coffee", why:"Low in iron; coffee reduces absorption." },
          { t:"Plain pasta with butter", why:"Low in iron." },
          { t:"Salad with lettuce and tea", why:"Low in iron; tea reduces absorption." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"At a restaurant, a pregnant persona wants fish. Which order is safest?", options:[
          { t:"Fully cooked salmon", ok:true, why:"Low in mercury and cooked." },
          { t:"Sushi with raw tuna", why:"Raw fish carries infection risk, and tuna can be higher in mercury." },
          { t:"Grilled swordfish", why:"High in mercury." },
          { t:"Cold smoked salmon platter", why:M4 }] },
        b:{ prompt:"Which sandwich is safest for a pregnant persona?", options:[
          { t:"A deli turkey sandwich heated until steaming hot", ok:true, why:M4 },
          { t:"A cold deli turkey sandwich", why:M4 },
          { t:"A sandwich with raw sprouts", why:"Raw sprouts are on the avoid list." },
          { t:"A sandwich with unpasteurized brie", why:"Raw-milk soft cheese is on the avoid list." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"A breastfeeding persona eats a vegan diet. Which nutrient most needs a reliable non-animal source for her baby’s sake?", options:[
          { t:"Vitamin B12, from fortified foods or a supplement", ok:true, why:"B12 isn’t reliably found in plant foods, and the baby depends on it." },
          { t:"Vitamin C", why:"Plentiful in plant foods." },
          { t:"Fibre", why:"Plentiful in plant foods." },
          { t:"Carbohydrate", why:"Plentiful in plant foods." }] },
        b:{ prompt:"A pregnant persona who never eats fish wants a DHA source. Best option?", options:[
          { t:"An algae-based DHA supplement, discussed with a provider", ok:true, why:"An algae-based DHA supplement provides DHA without fish." },
          { t:"Extra bread", why:"Bread doesn’t provide DHA." },
          { t:"Swordfish once a month", why:"She doesn’t eat fish, and it’s high in mercury." },
          { t:"Orange juice", why:"No DHA." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the clearest explanation of why “eating for two” is misleading?", options:[
          { t:"“Needs for some nutrients rise a lot, but energy needs rise only a little, and not at all in the first trimester.”", ok:true, why:"It says what rises a lot, what rises only a little, and when." },
          { t:"“Pregnant people shouldn’t eat more at all.”", why:"A modest increase is needed later." },
          { t:"“Babies don’t need nutrients until birth.”", why:"They need them throughout." },
          { t:"“It’s misleading because twins need four times as much.”", why:"That’s not how needs work." }] },
        // VERIFY: folic acid added to white flour in Canada.
        b:{ prompt:"Which is the clearest explanation of why Canada adds folic acid to white flour?", options:[
          { t:"“Many pregnancies aren’t planned, so fortifying common foods raises folate before anyone knows they’re pregnant.”", ok:true, why:"It links fortification to the timing of the neural tube." },
          { t:"“To make bread taste better.”", why:"Taste isn’t the reason." },
          { t:"“Because flour has no other nutrients.”", why:"That’s not the reason." },
          { t:"“So no one needs vegetables.”", why:"Fortification adds to a healthy diet; it doesn’t replace it." }] } },
      { id:"c2", cat:"C", goal:2,
        // VERIFY: breastfeeding energy, fluid and multivitamin guidance.
        a:{ prompt:"Which statement about breastfeeding and nutrition is correct?", options:[
          { t:"“Breastfeeding parents need a little more energy and fluid, and should continue a multivitamin.”", ok:true, why:"Thirst rises; a little extra food helps meet the demands of milk production." },
          { t:"“Breastfeeding parents should restrict food to lose weight quickly.”", why:"Restriction can reduce milk supply; recovery is gradual." },
          { t:"“Pumping and discarding clears alcohol faster.”", why:M7 },
          { t:"“No foods affect breastfeeding.”", why:"Alcohol and caffeine pass into milk." }] },
        b:{ prompt:"Which statement about alcohol in pregnancy is correct?", options:[
          { t:"“There’s no known safe amount at any time in pregnancy.”", ok:true, why:"Health Canada: no known safe amount at any time." },
          { t:"“A little wine after 20 weeks is safe.”", why:M5 },
          { t:"“Only spirits are harmful.”", why:"Any alcohol carries risk." },
          { t:"“Alcohol doesn’t reach the baby.”", why:"It crosses the placenta." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A social post sells a “natural lactation tea” that “doubles milk supply”. What’s the best response?", options:[
          { t:"Look for evidence from reliable sources and ask a health care provider; “natural” doesn’t mean safe or effective", ok:true, why:M6 },
          { t:"Buy it, because natural products can’t hurt", why:M6 },
          { t:"Assume all teas are dangerous", why:"Over-generalizing; evaluate each product." },
          { t:"Believe it if the post has many likes", why:"Popularity isn’t evidence." }] },
        // VERIFY: iron 16–20 mg in a pregnancy multivitamin.
        b:{ prompt:"A prenatal gummy vitamin has folic acid but <strong>no iron</strong>. What should a shopper consider?", options:[
          { t:"Health Canada advises a pregnancy multivitamin with iron (16–20 mg); compare products, or ask a pharmacist or provider", ok:true, why:"Iron needs rise by about half in pregnancy, so the multivitamin should include iron." },
          { t:"Gummies are always better because they taste good", why:"Taste isn’t the point." },
          { t:"Iron isn’t needed in pregnancy", why:"Iron needs rise by about half." },
          { t:"Take three gummies to make up the iron", why:"There’s no iron to make up, and extra doses risk too much of other nutrients." }] } },
      { id:"a2", cat:"A", goal:3,
        // VERIFY: the Canada Prenatal Nutrition Program's current name and scope.
        a:{ prompt:"A low-income pregnant persona in Ontario wants help eating well. Which resource is designed for this?", options:[
          { t:"A community program funded by the Canada Prenatal Nutrition Program", ok:true, why:"The program funds community projects that help pregnant people facing challenges such as low income eat well." },
          { t:"A sports-supplement store", why:"Not designed for prenatal nutrition." },
          { t:"A weight-loss program", why:"Not appropriate in pregnancy." },
          { t:"A social media diet challenge", why:"Not a reliable or appropriate source." }] },
        b:{ prompt:"Which plan best fits Canada’s Food Guide for a pregnant persona’s dinner?", options:[
          { t:"Half vegetables, a quarter brown rice, a quarter baked salmon, with water", ok:true, why:"It matches the Food Guide plate, with water as the drink." },
          { t:"Half rice, half chicken, with juice", why:"Missing vegetables; water is the drink of choice." },
          { t:"A double portion of pasta", why:M1 },
          { t:"Salad only, to keep it light", why:"Missing whole grains and protein foods." }] } }
    ]
  },
  task:{
    title:"Plan a prenatal day", summary:"Plan a prenatal day",
    statement:"<p>Plan one day of meals (breakfast, lunch, dinner and two snacks) for <strong>Noura (29, trimester 2, eats halal)</strong> that meets every condition. There are many good answers: find one, then try another.</p><p class=\"tiny muted\">Each slot takes 1 to 3 food cards (a DHA supplement doesn’t count toward the 3). Breakfast, lunch and dinner need at least one card. Model values for learning: % of the pregnancy RDA per card; real foods vary. No Calories are shown.</p>",
    // VERIFY: Health Canada's multivitamin advice (tip 1).
    checks:["Multivitamin with folic acid", "Two or more iron-rich foods, at least one paired with vitamin C", "Calcium at two or more eating occasions", "A DHA source", "No avoid-list items", "Vegetables or fruits at three or more eating occasions", "Halal"],
    tips:["Turn on the prenatal multivitamin: Health Canada advises one throughout pregnancy.", "Add lentils, chickpeas, beef stew or tofu, and pair a plant one with an orange or red pepper.", "Spread calcium out: milk at breakfast, yogurt as a snack.", "Baked trout or salmon gives DHA; an algae supplement works without fish.", "Check the flags: swap any avoid item for a safe one.", "Add fruit or vegetables to more meals: half the plate is the goal.", "Choose halal options: the library marks the items that aren’t."],
    explainPrompt:"Explain two choices you made and the nutrient need each one meets.",
    vocab:"Use the words folate, iron, DHA and Listeria (or mercury).",
    checkLabel:"Check my plan",
    success:"Your prenatal day works.",
    more:"There’s more than one answer. Can you find another?",
    slots:[{ id:"b", t:"Breakfast" }, { id:"s1", t:"Snack 1" }, { id:"l", t:"Lunch" }, { id:"s2", t:"Snack 2" }, { id:"d", t:"Dinner" }],
    groups:[{ id:"vf", t:"Vegetables and fruits" }, { id:"wg", t:"Whole grains" }, { id:"pf", t:"Protein foods" }, { id:"mx", t:"Mixed dishes" }, { id:"dr", t:"Drinks" }, { id:"sp", t:"Supplements" }],
    library:LIB
  },
  cards:[
    // VERIFY: values on cards 1, 3, 7, 9 and 10 (plan).
    ["Folic acid advice", "A daily multivitamin with 0.4 mg folic acid for anyone who could become pregnant (Health Canada)."],
    ["Neural tube", "Becomes the brain and spinal cord; closes in about the first 4 weeks after conception."],
    ["Iron in pregnancy", "RDA rises from 18 to 27 mg a day for adults; pair plant iron with vitamin C."],
    ["Energy in pregnancy", "None extra in trimester 1; a modest amount in trimesters 2–3."],
    ["DHA", "An omega-3 fat for the baby’s brain and eyes; from low-mercury fish or algae supplements."],
    ["<i>Listeria</i>", "Grows in the fridge; avoid unpasteurized soft cheese, cold deli meats, refrigerated smoked fish and raw sprouts."],
    ["High-mercury fish", "Fresh or frozen tuna, shark, swordfish, marlin, orange roughy, escolar: limit."],
    ["Alcohol", "No known safe amount at any time in pregnancy."],
    ["Caffeine", "Up to about 300 mg a day in pregnancy and breastfeeding (Health Canada)."],
    ["Breastfeeding needs", "A little more energy and fluid; keep taking a multivitamin."],
    ["Calcium in pregnancy", "The RDA doesn’t rise because absorption increases; teens still need 1300 mg."],
    ["“Natural” products", "Not evidence of safety: check the evidence and ask a provider."]
  ]
};
