// HFA4U 03 Micronutrients: Vitamins, Minerals, Water. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/03-micronutrients.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags; students see the plan's wording without them.
// Retention values, Sam's food record, the self-check food values and the drink cards are model data (labelled on screen).

// VERIFY: helpline numbers before release (course plan §2 support note).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "Fat-soluble vitamins are stored. High-dose supplements can build up to harmful levels.";
const M2 = "Water-soluble vitamins leach into the water. Pour it away, and they go too.";
const M3 = "B12 comes from animal foods and fortified foods; vegans need fortified foods or a supplement.";
const M4 = "Tea and coffee reduce non-heme iron absorption; vitamin C increases it.";
const M5 = "Spinach has calcium, but oxalates block most of it. Choose milk products, fortified beverages or calcium-set tofu.";
const M6 = "Iron-deficiency anemia is common today, and fortification policies still prevent goitre and neural tube defects.";
const M7 = "Water needs vary, and food and other drinks contribute; thirst is a useful guide for most healthy people.";

// Practice 1 (N6 sorter): the plan gives one "feedback if misplaced" line per item; it is used for every wrong box and as the why.
const BOXES = [{ id:"ws", label:"Water-soluble vitamin" }, { id:"fs", label:"Fat-soluble vitamin" }, { id:"maj", label:"Major mineral" }, { id:"tr", label:"Trace mineral" }];
const LAB = Object.fromEntries(BOXES.map(b => [b.id, b.label]));
const si = (id, t, box, fb) => ({ id, t, answer:box, why:fb, wrong:Object.fromEntries(BOXES.filter(b => b.id !== box).map(b => [b.id, fb])),
  hints:["Vitamin or mineral?", "Which group or amount?", LAB[box] + "."] });

// Explore Mode 2 and the task: retention model (vitamin C kept, %), model data based on typical findings. VERIFY all values.
// keptW = kept when the cooking water is used in a soup or sauce (boiling only). Cutting 1 hour early, uncovered: −5.
const METHODS = [
  { id:"raw", t:"Raw", kept:100, tex:"Crisp (raw)", where:"Nothing lost to cooking: it’s raw." },
  { id:"steam5", t:"Steam 5 min", kept:85, tex:"Tender-crisp", where:"A little broke down in the heat. Steam barely touches it, so little leached out." },
  { id:"steam10", t:"Steam 10 min", kept:75, tex:"Soft", where:"More broke down with the longer heating." },
  { id:"mic3", t:"Microwave 3 min (2 tbsp water)", short:"Microwave 3 min", kept:85, tex:"Tender-crisp", where:"A little broke down in the heat. With only 2 tbsp of water, little leached out." },
  { id:"mic6", t:"Microwave 6 min (2 tbsp water)", short:"Microwave 6 min", kept:75, tex:"Soft", where:"More broke down with the longer heating." },
  { id:"boil5", t:"Boil 5 min", kept:65, keptW:80, tex:"Tender", where:"About a third leached into the water you poured away.", whereW:"Some leached into the water, but you kept it in the soup or sauce." },
  { id:"boil10", t:"Boil 10 min", kept:50, keptW:65, tex:"Very soft", where:"About half leached into the water you poured away.", whereW:"Much leached into the water and you kept it, but the long boil broke more down." },
  { id:"stir4", t:"Stir-fry 4 min", kept:80, tex:"Tender-crisp", where:"Some broke down in the heat. There’s no water to leach into." }
];
const VEGS = [
  { id:"broccoli", t:"Broccoli", vitA:"Good source (dark green)", a:true },
  { id:"carrots", t:"Carrots", vitA:"Good source (orange: beta-carotene)", a:true },
  { id:"pepper", t:"Red pepper", vitA:"Good source (red-orange: beta-carotene)", a:true },
  { id:"spinach", t:"Spinach", vitA:"Good source (dark green)", a:true },
  { id:"potato", t:"Potato", vitA:"Not a source", a:false }
];

export default {
  id:"03-micronutrients",
  kind:"topic",
  title:"Micronutrients: vitamins, minerals, water",
  topic:"Micronutrients: Vitamins, Minerals, Water",
  readyTopic:"vitamins, minerals and water",
  hero:{
    headline:"Tiny amounts, enormous effects.",
    text:"<strong>Vitamins</strong> and <strong>minerals</strong> are needed in milligrams or micrograms, yet missing one can loosen teeth, bend bones or swell a thyroid. Sailors once died of <strong>scurvy</strong> for want of vitamin C. Today, <strong>fortified</strong> foods quietly prevent deficiencies across whole populations. In this module you’ll solve deficiency cases, learn to cook without losing vitamins, and look at <strong>water</strong>, the nutrient everyone needs most and not everyone can get safely.",
    fig:{ html:'<div class="mi-hero" id="mi-hero"></div>', caption:"" },
    // VERIFY: Lind's 1747 scurvy trial details (plan hero; risk 4). The log note paraphrases it.
    log:{ head:"Ship’s log", date:"1747", lines:["Two men given", "oranges and lemons…", "recovered."] },
    aria:"A ship’s log page dated 1747 reads “Two men given oranges and lemons… recovered.” A lemon slice slides onto the page. Then the page fades beside a modern carton of fortified milk, and the label line “Vitamin D added” glows.",
    caption:"From a sailor’s cure to a public health policy."
  },
  goals:[
    "I can classify vitamins as water- or fat-soluble and minerals as major or trace, and give food sources for each.",
    "I can link a deficiency disease to its nutrient from its symptoms and history.",
    "I can explain why excess intake is a bigger risk for some micronutrients than others.",
    "I can choose cooking and storage methods that keep more vitamins in food.",
    "I can explain water’s functions and discuss safe drinking water as a nutrition and equity issue.",
    "I can explain how fortification policies prevent deficiencies in a population."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Vitamin groups", goal:1,
          prompt:"Which vitamin is <strong>fat-soluble</strong>?",
          options:[
            { t:"Vitamin D", ok:true, why:"A, D, E and K are fat-soluble." },
            { t:"Vitamin C", why:"Vitamin C is water-soluble." },
            { t:"Folate", why:"A B vitamin, water-soluble." },
            { t:"Thiamin (B1)", why:"Water-soluble." }],
          hints:["Remember the four fat-soluble vitamins.", "A, D, E, K.", "Vitamin D."] },
        { id:"w2", skill:"Vitamin groups", goal:3,
          prompt:"Why are fat-soluble vitamins more likely to reach harmful levels from supplements?",
          options:[
            { t:"They’re stored in body fat and the liver instead of being excreted quickly", ok:true, why:M1 },
            { t:"They’re bigger molecules", why:"Size isn’t the reason." },
            { t:"They’re found only in supplements", why:"Foods contain them." },
            { t:"They give more energy", why:"Vitamins give no energy." }],
          // Plan hint 3 is "A." (an option letter); the build reorders options, so it names the answer instead.
          hints:["Where do they go when you have extra?", "Into storage.", "They’re stored in body fat and the liver instead of being excreted quickly."] },
        { id:"w3", skill:"Food sources", goal:1,
          prompt:"Which food is a rich source of <strong>vitamin C</strong>?",
          options:[
            { t:"Red bell pepper", ok:true, why:"Peppers, citrus, broccoli and strawberries are rich sources." },
            { t:"White rice", why:"Almost none." },
            { t:"Cheese", why:"Almost none." },
            { t:"Chicken", why:"Almost none." }],
          hints:["Think fruits and vegetables.", "Bright peppers are among the richest.", "Red pepper."] },
        { id:"w4", skill:"Food sources", goal:1,
          prompt:"Which food supplies <strong>heme</strong> iron?",
          options:[
            { t:"Beef", ok:true, why:"Heme iron comes from meat, fish and poultry and is well absorbed." },
            { t:"Lentils", why:"Non-heme iron." },
            { t:"Fortified cereal", why:"Non-heme iron." },
            { t:"Spinach", why:"Non-heme iron." }],
          hints:["Heme is in animal flesh.", "Meat, fish, poultry.", "Beef."] },
        { id:"w5", skill:"How cooking changes food", goal:4,
          prompt:"You boil broccoli for 10 minutes and pour the water down the drain. What happened to much of its vitamin C?",
          options:[
            { t:"It leached into the water and went down the drain", ok:true, why:M2 },
            { t:"It turned into vitamin A", why:"Vitamins don’t convert like that." },
            { t:"Nothing; vitamins can’t move", why:"Water-soluble vitamins dissolve out." },
            { t:"It became more concentrated", why:"It was lost, not concentrated." }],
          hints:["Water-soluble means…?", "It dissolves in water.", "It leached into the water and went down the drain."] },
        { id:"w6", skill:"How cooking changes food", goal:4,
          prompt:"Milk is often sold in opaque containers. Which vitamin does this protect?",
          options:[
            { t:"Riboflavin (B2), which light destroys", ok:true, why:"Light destroys riboflavin, so an opaque container keeps more of it." },
            { t:"Vitamin D, which needs light", why:"Light doesn’t add vitamin D to milk." },
            { t:"Iron", why:"Iron is a mineral; light doesn’t destroy it." },
            { t:"Calcium", why:"A mineral, not light-sensitive." }],
          hints:["Which nutrients are light-sensitive?", "Riboflavin.", "Riboflavin (B2), which light destroys."] }
      ],
      refreshers:{
        "Vitamin groups":"Fat-soluble: A, D, E, K (stored; absorbed with fat). Water-soluble: the B vitamins and C (not stored much; leach into water).",
        "Food sources":"Vitamin C: peppers, citrus, broccoli. Heme iron: meat, fish, poultry; non-heme iron: legumes, tofu, fortified cereals, leafy greens. Vitamin D: fortified milk and plant beverages, fatty fish, eggs.",
        "How cooking changes food":"Heat, light, air and water reduce vitamins. Cook briefly with little water, and keep the cooking liquid when you can."
      }
    }
  },
  explore:{
    heading:"Nutrient detective",
    intro:"Solve cases from history and today, then run the retention lab: cook a vegetable your way and see what’s left.",
    // Mode 1: the 14-nutrient panel and the nine case cards. Clue rows split the plan's clue text; notes use the plan's own facts.
    nutrients:[
      { id:"a", t:"Vitamin A", g:"v" }, { id:"c", t:"Vitamin C", g:"v" }, { id:"d", t:"Vitamin D", g:"v" }, { id:"k", t:"Vitamin K", g:"v" },
      { id:"thiamin", t:"Thiamin", g:"v" }, { id:"niacin", t:"Niacin", g:"v" }, { id:"folate", t:"Folate", g:"v" }, { id:"b12", t:"Vitamin B12", g:"v" },
      { id:"ca", t:"Calcium", g:"m" }, { id:"fe", t:"Iron", g:"m" }, { id:"i", t:"Iodine", g:"m" }, { id:"f", t:"Fluoride", g:"m" }, { id:"zn", t:"Zinc", g:"m" }, { id:"na", t:"Sodium", g:"m" }
    ],
    cases:[
      // VERIFY: historical details of each case (plan risk 4).
      { id:"c1", clues:[["Setting", "A sailor in the 1740s, months at sea"], ["Diet", "Salted meat and biscuits"], ["Symptoms", "Bleeding gums, bruising, slow-healing wounds"]],
        answer:"c|def", label:"Vitamin C deficiency (scurvy)", note:"In 1747, two sailors given oranges and lemons recovered. Ships began carrying citrus, which supplied vitamin C." },
      { id:"c2", clues:[["Setting", "A toddler in a smoky industrial city in the 1920s"], ["Twist", "Rarely outdoors"], ["Diet", "No fortified milk"], ["Symptoms", "Bowed legs"]],
        answer:"d|def", label:"Vitamin D deficiency (rickets)", note:"Few foods naturally contain vitamin D, and sunlight was scarce. Today Canada adds vitamin D to cow’s milk." },
      { id:"c3", clues:[["Setting", "A region with iodine-poor soil"], ["Twist", "Before salt was iodized"], ["Symptoms", "A swelling at the front of the neck"]],
        answer:"i|def", label:"Iodine deficiency (goitre)", note:"Iodized table salt now prevents goitre: most people get enough iodine without changing their habits." },
      { id:"c4", clues:[["Setting", "Early 1900s"], ["Diet", "Mostly corn not treated with lime"], ["Symptoms", "Rash on sun-exposed skin, diarrhea, confusion"]],
        answer:"niacin|def", label:"Niacin deficiency (pellagra)", note:"Corn not treated with lime holds its niacin in a form the body can’t use. Nixtamalization, a Mesoamerican Indigenous technique, releases it." },
      { id:"c5", clues:[["Setting", "Late 1800s"], ["Diet", "Mostly polished white rice"], ["Symptoms", "Weakness, nerve damage in the legs"]],
        answer:"thiamin|def", label:"Thiamin deficiency (beriberi)", note:"Polishing removes the rice’s thiamin-rich outer layers." },
      { id:"c6", clues:[["Setting", "Today: a teen"], ["Diet", "Stopped eating meat without planning other iron sources"], ["Symptoms", "Tired, pale, short of breath on stairs"]],
        answer:"fe|def", label:"Iron deficiency (anemia)", note:"Iron-deficiency anemia is common today. Legumes, tofu and fortified cereals supply non-heme iron; vitamin C helps the body absorb it." },
      { id:"c7", clues:[["Setting", "Today: a young child at home"], ["Twist", "Swallowed several of an adult’s iron pills"], ["Symptoms", "Stomach pain and vomiting: an emergency"]],
        answer:"fe|exc", label:"Iron excess (toxicity)", note:"Iron is the classic poisoning risk for young children. Keep supplements out of reach." },
      { id:"c8", clues:[["Setting", "Today: a child"], ["Twist", "Often swallowed fluoride toothpaste"], ["Symptoms", "Faint white streaks on the adult teeth"]],
        answer:"f|exc", label:"Fluoride excess (dental fluorosis)", note:"Excess matters too: too much fluoride while the adult teeth form leaves dental fluorosis." },
      { id:"c9", clues:[["Setting", "Today"], ["Who", "A pregnant person"], ["Twist", "Taking high-dose vitamin A supplements"]],
        answer:"a|exc", label:"Vitamin A excess (risk of birth defects)", note:"Fat-soluble vitamins are stored, so high doses build up. Excess vitamin A in pregnancy risks birth defects." }
    ],
    caseMsgs:{
      type:"Right nutrient. Is it missing, or is there too much?",
      wrong:"Not this one. The setting, the diet and the symptoms all point to one nutrient.",
      pick:"Choose a nutrient first, then deficiency or excess."
    },
    methods:METHODS, vegs:VEGS, cutEarly:5,
    // Mode 3: Sam (F1 persona, model data) for TC3. Bars are % of a general reference; ok marks the two below it.
    persona:{
      title:"Sam, 17, vegan",
      intro:"Sam eats a varied vegan diet. One day of his food record:",
      record:["Breakfast: iron-fortified cereal with an unfortified oat drink, and orange slices", "Lunch: lentil soup, and whole-grain bread with peanut butter", "Snack: an apple and a handful of almonds", "Dinner: tofu stir-fry with red pepper and broccoli, and brown rice"],
      bars:[{ id:"c", t:"Vitamin C", v:180 }, { id:"folate", t:"Folate", v:130 }, { id:"fe", t:"Iron", v:100 }, { id:"a", t:"Vitamin A", v:120 }, { id:"ca", t:"Calcium", v:55, ok:true }, { id:"b12", t:"Vitamin B12", v:5, ok:true }],
      // ok = contains B12 (the plan's accepted shelf items)
      shelf:[{ id:"soy", t:"Fortified soy beverage", ok:true }, { id:"yeast", t:"Fortified nutritional yeast", ok:true }, { id:"supp", t:"Vitamin B12 supplement", ok:true },
        { id:"spinach", t:"Spinach" }, { id:"mush", t:"Mushrooms" }, { id:"seaweed", t:"Seaweed (nori)" }, { id:"tofu", t:"Calcium-set tofu" }],
      advice:ADVICE
    },
    // Mode 3: optional private self check (opt-in; nothing saved, scored or sent). Values are % of a general reference per serving:
    // model data, rough teaching values, never a diet assessment. No calories.
    self:{
      intro:"Mark the foods you ate yesterday. The bars compare iron, calcium, vitamin D and vitamin C with a general reference. There are no calories here, and no score.",
      privacy:"Nothing you mark here is saved, scored or sent, and it isn’t added to your results summary. It clears when you leave this page. If you’d rather not, your teacher has another option, and Sam’s record works instead.",
      start:"Start the self check",
      foods:[
        { id:"milk", t:"Milk or fortified soy beverage (1 cup)", icon:"carton", ca:25, d:15 },
        { id:"yogurt", t:"Yogurt (¾ cup)", icon:"bowl", ca:20 },
        { id:"cheese", t:"Cheese (50 g)", icon:"wedge", ca:25 },
        { id:"tofu", t:"Calcium-set tofu (¾ cup)", icon:"block", ca:30, fe:20 },
        { id:"lentils", t:"Lentils or beans (¾ cup)", icon:"bean", fe:30 },
        { id:"meat", t:"Beef or chicken (75 g)", icon:"meat", fe:15 },
        { id:"fish", t:"Salmon or trout (75 g)", icon:"fish", d:60 },
        { id:"egg", t:"Egg", icon:"egg", fe:5, d:5 },
        { id:"cereal", t:"Iron-fortified cereal (1 serving)", icon:"bowl", fe:30 },
        { id:"bread", t:"Whole-grain bread (1 slice)", icon:"bread", fe:5 },
        { id:"orange", t:"Orange, or ½ cup orange juice", icon:"fruit", c:80 },
        { id:"pepper", t:"Red pepper (½ cup)", icon:"pepper", c:100 },
        { id:"broccoli", t:"Broccoli (½ cup)", icon:"leaf", c:50 },
        { id:"berries", t:"Strawberries (½ cup)", icon:"fruit", c:60 },
        { id:"spinach", t:"Spinach, cooked (½ cup)", icon:"leaf", fe:20, ca:5 },
        { id:"almonds", t:"Almonds (¼ cup)", icon:"nut", ca:7 }
      ],
      bars:[{ id:"fe", t:"Iron" }, { id:"ca", t:"Calcium" }, { id:"d", t:"Vitamin D" }, { id:"c", t:"Vitamin C" }],
      advice:ADVICE
    },
    // P3 and P4 prediction cards (no numbers: the meters are qualitative)
    cards:{
      p3:{ title:"Megadose of vitamin A vs megadose of vitamin C", a:"Vitamin A (fat-soluble)", c:"Vitamin C (water-soluble)", aEnd:"Stored in the liver and body fat: the tank keeps filling", cEnd:"Excess drains away: the level stays low" },
      p4:{ title:"Lentils with orange juice vs lentils with black tea", oj:"With orange juice", tea:"With black tea", meter:"Iron absorbed", ojEnd:"Rises: vitamin C helps", teaEnd:"Dips: tea’s polyphenols hinder" }
    },
    predictions:[
      { id:"p1", prompt:"Retention lab: broccoli, boil 10 min. How much vitamin C is left if you pour away the water?",
        options:[{ t:"About half", ok:true }, { t:"All of it" }, { t:"Almost none" }, { t:"Twice as much" }],
        explain:"Vitamin C dissolves into the water. The bar drops to 50%." },
      { id:"p2", prompt:"Retention lab: the same broccoli, steamed for 5 min. Steaming instead?",
        options:[{ t:"More kept, about 85%", ok:true }, { t:"Less kept" }, { t:"The same" }, { t:"None kept" }],
        explain:"Less contact with water means less leaching. The bar shows 85%." },
      { id:"p3", prompt:"A card: “Megadose of vitamin A vs megadose of vitamin C.” Which is more likely to build up to harmful levels?",
        options:[{ t:"Vitamin A", ok:true }, { t:"Vitamin C" }, { t:"Both equally" }, { t:"Neither" }],
        explain:"Fat-soluble vitamins are stored." },
      { id:"p4", prompt:"A plate of lentils with a glass of orange juice vs the same with black tea. Which drink helps the body absorb the lentils’ iron?",
        options:[{ t:"Orange juice", ok:true }, { t:"Black tea" }, { t:"Both" }, { t:"Neither" }],
        explain:"Vitamin C boosts non-heme iron absorption; tea’s polyphenols reduce it." }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Solve case C4.",
        answer:{ n:"niacin", t:"def" },
        why:"Niacin deficiency: pellagra.",
        banner:"Indigenous food knowledge prevented this disease for centuries before science explained it.",
        msgs:{ c:"Scurvy has bleeding gums, not a sun-exposed rash.", thiamin:"Beriberi follows polished rice, not corn.", type:"Right nutrient. Is it missing, or is there too much?",
          open:"Open case C4 in Detective cases, then choose a nutrient and whether it’s a deficiency or an excess." },
        general:"That nutrient doesn’t fit case C4’s clues. Use a hint if you’re stuck.",
        // VERIFY: hint 2's nixtamalization note.
        hints:["Rash where the sun hits, digestion trouble, confusion: three D’s.", "Corn not treated with lime holds its niacin in a form the body can’t use. Traditional nixtamalization, a Mesoamerican Indigenous technique, releases it.", "Niacin deficiency: pellagra."] },
      { id:"tc2", goal:4, prompt:"Cook broccoli until tender while keeping <strong>at least 80%</strong> of its vitamin C.",
        why:"Less water and less time keep more.",
        msgs:{ boil5:"Use the cooking water, or switch to steaming.", early:"That passes. Cutting just before would keep 5 more points.", raw:"The goal says cooked until tender.",
          veg:"The challenge is about broccoli. Choose broccoli in the Retention lab.", low:"That keeps {k}%. Less water and less time keep more." },
        hints:["Less water and less time keep more.", "Steam or microwave briefly.", "Steam 5 minutes: 85%."] },
      { id:"tc3", goal:6, stretch:true,
        prompt:"Persona <strong>Sam, 17, vegan</strong>: his food record (model data) shows two nutrients below the reference. Name them, then choose <strong>one</strong> food or product from the shelf that addresses the one plant foods can’t supply. (Food records, Mode 3)",
        why:M3,
        msgs:{ spinach:"Spinach’s calcium is poorly absorbed (oxalates). And the shelf choice should be the B12 gap.",
          // VERIFY: mushrooms and seaweed as unreliable B12 sources.
          mush:"These aren’t reliable B12 sources.",
          iron:"Sam’s record shows iron at the reference, from tofu, lentils and fortified cereal.",
          two:"In Food records, tap the two nutrients below the reference line.", pair:"Look again at Sam’s bars: which two fall short of the reference line?",
          shelf:"Now choose one item from the shelf.", tofu:"Calcium-set tofu helps with calcium, but the shelf choice should be the B12 gap." },
        hints:["Which vitamin comes only from animal or fortified foods?", "B12. And the mineral in milk, often low in vegan diets?", "B12 and calcium; choose fortified soy beverage, which also adds calcium."] }
    ],
    blocks:[{ title:"What the detective work shows", html:"<p>Each nutrient leaves a <strong>fingerprint</strong> when it’s missing. <strong>Water-soluble</strong> vitamins are the easiest to lose in the kitchen; <strong>fat-soluble</strong> ones are the easiest to overdo from pills.</p><p class=\"tiny muted\">" + ADVICE + "</p>" }]
  },
  part3:{
    slug:"water", name:"Water", heading:"Water, the forgotten nutrient",
    intro:"Water sits beside vitamins and minerals as a nutrient. Visit three stations: what water does in the body, what different drinks add, and the data on safe drinking water in First Nations communities. Then try the quick check.",
    jobs:{
      title:"Station 1: Water’s jobs",
      intro:"Tap each point on the body outline to open one of water’s jobs.",
      points:[
        { id:"temp", t:"Regulates temperature", sub:"sweat", text:"Sweat carries heat away as it evaporates from the skin." },
        { id:"trans", t:"Transports nutrients and wastes", sub:"blood, urine", text:"Blood carries nutrients to every cell; urine carries wastes out of the body." },
        { id:"cush", t:"Cushions joints and organs", sub:"joints, organs", text:"Watery fluids cushion the joints and protect organs." },
        { id:"react", t:"Takes part in chemical reactions", sub:"digestion", text:"Water takes part in reactions, such as breaking food down in digestion." }
      ],
      // VERIFY: body-water share and Health Canada's adequate intakes for total water (plan Station 1).
      facts:["Water is roughly 50–60% of adult body mass.", "Health Canada’s adequate intake for total water (from food <strong>and</strong> drinks) is about 2.7 L a day for adult women and 3.7 L for adult men; about 20% comes from food."],
      note:"There’s no single “eight glasses” rule; needs vary with heat, activity and body size."
    },
    drinks:{
      title:"Station 2: Drink choices",
      intro:"Tap each drink to see what it adds. Every one of them supplies water.",
      // VERIFY: Canada's Food Guide wording "Make water your drink of choice".
      cfg:"Canada’s Food Guide: “Make water your drink of choice.”",
      list:[
        { id:"water", t:"Water", adds:["Water", "No sugars and no energy"] },
        { id:"milk", t:"Milk", adds:["Water", "Protein", "Calcium", "Vitamin D (added in Canada)", "Naturally occurring sugar (lactose)"] },
        { id:"juice", t:"100% juice", adds:["Water", "Vitamin C", "Naturally occurring sugars", "Less fibre than the whole fruit"] },
        { id:"soda", t:"Sugar-sweetened soft drink", adds:["Water", "Added sugars", "Few or no vitamins or minerals"] }
      ]
    },
    data:{
      title:"Station 3: Check it with data",
      intro:"Safe drinking water in First Nations communities: long-term drinking water advisories on public systems on reserves, since November 2015.",
      // VERIFY: every figure and date before release, against Indigenous Services Canada's current page and the 2025 Auditor General report.
      // Points: [year as a decimal, lifted since Nov 2015 (null = not reported), remaining in effect]
      rows:[
        { when:"November 2015", x:2015.84, lifted:0, remain:105, src:"Indigenous Services Canada (2026)" },
        { when:"November 2020", x:2020.84, lifted:null, remain:60, src:"Office of the Auditor General of Canada (2025)" },
        { when:"March 2021", x:2021.2, lifted:101, remain:58, src:"Indigenous Services Canada (2021)" },
        { when:"Spring 2025", x:2025.23, lifted:147, remain:35, src:"Indigenous Services Canada (2025); Office of the Auditor General of Canada (2025)" },
        { when:"October 2026", x:2026.8, lifted:158, remain:39, src:"Indigenous Services Canada (2026)" }
      ],
      prompts:[{ id:"d1", q:"What changed over time?" }, { id:"d2", q:"What does “potable” mean?" }, { id:"d3", q:"Why is water access a nutrition issue as well as a health one?" }],
      check:[
        "Lifted plus remaining is more than 105: new long-term advisories were added after 2015, as well as lifted.",
        "Potable water is water that is safe to drink. A long-term advisory means water from that system hasn’t been safe to drink for more than 12 months.",
        "In 2025, nine of the advisories still in effect had lasted a decade or longer (Office of the Auditor General of Canada, 2025)."
      ],
      // VERIFY: AFNWA example (launched 2022) and National Indigenous Water Operator Day; review this framing with the board's Indigenous education lead.
      framing:"<p>Safe drinking water is a right and a responsibility. The advisories point to gaps in water systems, not to a deficit of the communities. First Nations are leading the work: <strong>First Nations water operators</strong> run and test community treatment plants (Canada marks National Indigenous Water Operator Day each March), and the <strong>Atlantic First Nations Water Authority</strong>, a First Nations-led utility, took over water services for participating communities in Atlantic Canada in 2022.</p><p class=\"tiny muted\">Your teacher may connect this station to module 20, Indigenous Food Sovereignty.</p>"
    },
    // VERIFY: reference years and titles before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li><li>Indigenous Services Canada. (2021). <i>In partnership with First Nations, more than 100 long-term drinking water advisories have now been lifted since 2015</i> [News release]. Government of Canada.</li><li>Indigenous Services Canada. (2025). <i>Statement on National Indigenous Water Operator Day 2025</i>. Government of Canada.</li><li>Indigenous Services Canada. (2026). <i>Ending long-term drinking water advisories</i>. Government of Canada.</li><li>Office of the Auditor General of Canada. (2025). <i>Follow-up on programs for First Nations</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Water quick check", summary:"Water quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which counts toward total water intake?",
          choices:[{ t:"Water, milk, soup and juicy fruit", ok:true, fb:"Right. Food and other drinks contribute." }, { t:"Only plain water", fb:"Food and other drinks contribute." }, { t:"Only drinks", fb:"Food and other drinks contribute." }, { t:"Only water and milk", fb:"Food and other drinks contribute." }] },
        { id:"q2", goal:5, prompt:"“Potable” water is water that is…",
          choices:[{ t:"Safe to drink", ok:true, fb:"Right. Potable = safe for drinking." }, { t:"Bottled", fb:"Potable = safe for drinking." }, { t:"Carbonated", fb:"Potable = safe for drinking." }, { t:"Heated", fb:"Potable = safe for drinking." }] },
        { id:"q3", goal:5, prompt:"Which job of water cools you during exercise?",
          choices:[{ t:"Temperature regulation (sweat)", ok:true, fb:"Right. Evaporating sweat carries heat away." }, { t:"Cushioning joints", fb:"Evaporating sweat carries heat away." }, { t:"Building bone", fb:"Evaporating sweat carries heat away." }, { t:"Storing energy", fb:"Evaporating sweat carries heat away." }] },
        // VERIFY: definition of a long-term advisory (more than 12 months).
        { id:"q4", goal:5, prompt:"A long-term drinking water advisory means…",
          choices:[{ t:"Water from that system hasn’t been safe to drink for over a year", ok:true, fb:"Right. Long-term means more than 12 months." }, { t:"The water is always safe", fb:"Long-term means more than 12 months." }, { t:"Only bottled water is sold", fb:"Long-term means more than 12 months." }, { t:"The community has no water source", fb:"Long-term means more than 12 months." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"classify", type:"sorter", title:"Classify the micronutrient", summary:"Classify the micronutrient", noun:"nutrient", txt:true, goal:1,
        instruction:"Sort each micronutrient into its group.",
        boxes:BOXES,
        items:[
          si("i1", "Vitamin C", "ws", "Leaches into water; not stored much."),
          si("i2", "Folate", "ws", "A B vitamin."),
          si("i3", "Vitamin B12", "ws", "A B vitamin, though the liver stores some."),
          si("i4", "Vitamin A", "fs", "A, D, E, K."),
          si("i5", "Vitamin D", "fs", "A, D, E, K."),
          si("i6", "Vitamin K", "fs", "Needed for blood clotting."),
          si("i7", "Calcium", "maj", "Needed in large amounts for bones."),
          si("i8", "Potassium", "maj", "Needed for fluid balance and nerves."),
          si("i9", "Iron", "tr", "Needed in small amounts, but vital for hemoglobin."),
          si("i10", "Iodine", "tr", "Tiny amounts for thyroid hormones.")
        ] },
      { id:"files", type:"mc", title:"Deficiency files and public policy", summary:"Deficiency files", star:true, goal:[2, 6, 3],
        instruction:"Six files on deficiencies and the policies that prevent them. Items marked ★ are non-routine.",
        items:[
          // VERIFY: Canadian rule on iodized table salt.
          { id:"d1", goal:6, prompt:"Canada requires table salt to be iodized. Which deficiency does this prevent?",
            options:[
              { t:"Goitre (iodine)", ok:true, why:"Iodine deficiency swells the thyroid; iodized salt prevents it." },
              { t:"Anemia (iron)", why:"Iron, not iodine." },
              { t:"Scurvy (vitamin C)", why:"That’s vitamin C. Salt carries iodine." },
              { t:"Rickets (vitamin D)", why:"That’s vitamin D, which is added to milk." }],
            hints:["Which nutrient does the salt carry?", "Iodine is needed for thyroid hormones.", "Goitre (iodine)."] },
          // VERIFY: vitamin D added to cow's milk in Canada.
          { id:"d2", goal:6, prompt:"Vitamin D is added to cow’s milk in Canada. Which condition does this help prevent in children?",
            options:[
              { t:"Rickets", ok:true, why:"Vitamin D deficiency in children: soft, bowed bones." },
              { t:"Scurvy", why:"That’s vitamin C." },
              { t:"Goitre", why:"That’s iodine." },
              { t:"Pellagra", why:"That’s niacin." }],
            hints:["What does vitamin D do for growing bones?", "Without it, children’s bones stay soft and can bend.", "Rickets."] },
          // VERIFY: folic acid in white flour since 1998.
          { id:"d3", goal:6, prompt:"Folic acid has been added to white flour in Canada since 1998. Which outcome fell afterward? <span class=\"tag\">★</span>",
            options:[
              { t:"Neural tube defects in newborns", ok:true, why:"Folate in early pregnancy supports neural tube closure; a policy reaches people before they know they’re pregnant." },
              { t:"Rickets in children", why:"That’s vitamin D. Folate in early pregnancy supports neural tube closure; a policy reaches people before they know they’re pregnant." },
              { t:"Goitre in adults", why:"That’s iodine. Folate in early pregnancy supports neural tube closure; a policy reaches people before they know they’re pregnant." },
              { t:"Scurvy in older adults", why:"That’s vitamin C. Folate in early pregnancy supports neural tube closure; a policy reaches people before they know they’re pregnant." }],
            hints:["Folic acid is a form of folate, a B vitamin.", "Folate matters most very early in pregnancy, for the neural tube.", "Neural tube defects in newborns."] },
          // VERIFY: B12 absorption changes with age (stomach acid, intrinsic factor).
          { id:"d4", goal:[2, 3], prompt:"An older adult eats meat but has low B12 levels. Most likely reason? <span class=\"tag\">★</span>",
            options:[
              { t:"Less stomach acid and intrinsic factor with age reduces B12 absorption", ok:true, why:"Intake isn’t the only factor: absorption changes with age." },
              { t:"Meat contains no B12", why:"Meat is a B12 source. Intake isn’t the only factor: absorption changes with age." },
              { t:"Older adults no longer need B12", why:"They still need it. Intake isn’t the only factor: absorption changes with age." },
              { t:"B12 is fat-soluble, so it builds up and stops working", why:"B12 is a water-soluble B vitamin. Intake isn’t the only factor: absorption changes with age." }],
            hints:["Does eating a nutrient guarantee the body takes it in?", "Absorption can change with age.", "Less stomach acid and intrinsic factor with age reduces B12 absorption."] },
          { id:"d5", goal:[1, 2], prompt:"A persona’s calcium comes mostly from spinach. A dietitian suggests calcium-set tofu or a fortified beverage. Why? <span class=\"tag\">★</span>",
            options:[
              { t:"Spinach’s oxalates block most of its calcium", ok:true, why:M5 },
              { t:"Spinach has no calcium", why:M5 },
              { t:"Tofu and fortified beverages have more vitamin C", why:M5 },
              { t:"Spinach has too much calcium", why:M5 }],
            hints:["Is all the calcium in a food absorbed?", "Spinach contains oxalates.", "Spinach’s oxalates block most of its calcium."] },
          { id:"d6", goal:6, prompt:"Two policies: (1) add iodine to salt; (2) a public campaign telling people to eat seaweed. Which reaches more people reliably, and why? <span class=\"tag\">★</span>",
            options:[
              { t:"Iodized salt: it works without anyone changing habits, because nearly everyone uses salt", ok:true, why:"Campaigns depend on behaviour change; fortification works in the background." },
              { t:"The seaweed campaign: seaweed is a natural source", why:"Campaigns depend on behaviour change; fortification works in the background." },
              { t:"Both equally: each one supplies iodine", why:"Campaigns depend on behaviour change; fortification works in the background." },
              { t:"The seaweed campaign: people follow health advice", why:"Campaigns depend on behaviour change; fortification works in the background." }],
            hints:["Which one needs people to change what they buy?", "Fortification works without any action.", "Iodized salt."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Clara", goal:[4, 3, 1], how:"",
        instruction:"Clara made one mistake in each piece of advice. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Advise a persona on cooking green beans to keep vitamins.",
            steps:["Wash the beans, then trim them.", "Cut them an hour early so dinner is quick.", "Boil them for 10 minutes and drain.", "Serve right away."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 has a problem too, but the first is earlier.", "Step 4 is fine."],
            fixes:[
              { t:"Cut just before cooking, then steam briefly or use the cooking water in a sauce.", ok:true, why:"Cut surfaces lose vitamin C to air, and water-soluble vitamins leach into the water." },
              { t:"Cut them the night before.", why:"More air exposure." },
              { t:"Peel them.", why:"Removes nutrients near the surface." },
              { t:"Step 2 is correct.", why:"Cut surfaces lose vitamin C to air." }],
            // Plan hint 3 is "Fix A."; fixes are reordered by the build, so it quotes the fix.
            hints:["Which step exposes the vegetable to air for a long time?", "Step 2.", "Cut just before cooking, then steam briefly or use the cooking water in a sauce."] },
          { id:"e2", goal:3, task:"Explain whether a persona should take high-dose vitamin A pills “to see better”.",
            steps:["Vitamin A deficiency can cause night blindness.", "So extra vitamin A will improve normal vision.", "High doses are safe because vitamins are natural."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 builds on the error."],
            fixes:[
              { t:"Extra vitamin A doesn’t improve normal vision, and high doses build up because it’s fat-soluble. Get it from food (orange and dark green vegetables) unless a health professional advises otherwise.", ok:true, why:M1 },
              { t:"Take vitamin C instead.", why:"Doesn’t address the claim." },
              { t:"Take double doses on weekends.", why:M1 },
              { t:"Step 2 is correct.", why:"Fixing a deficiency isn’t the same as boosting normal function." }],
            hints:["Does fixing a deficiency mean more is better?", "No; and A is stored.", "Extra vitamin A doesn’t improve normal vision, and high doses build up because it’s fat-soluble. Get it from food unless a health professional advises otherwise."] },
          { id:"e3", goal:1, task:"Plan a vegetarian meal to maximize iron absorption.",
            steps:["Base the meal on lentils and tofu for non-heme iron.", "Add red peppers to the stir-fry.", "Serve with a large cup of black tea to help absorption."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct: vitamin C helps.", ""],
            fixes:[
              { t:"Serve with water or orange juice; save tea for between meals, because tea reduces non-heme iron absorption.", ok:true, why:M4 },
              { t:"Add more tea.", why:M4 },
              { t:"Remove the peppers.", why:"They help." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Which drinks help or hinder iron absorption?", "Tea hinders; vitamin C helps.", "Serve with water or orange juice; save tea for between meals."] }
        ] }
    ]
  },
  reflect:{
    support:SUPPORT,
    journal:[
      { id:"j1", q:"Which deficiency case surprised you most, and what does its history say about how people learned about nutrition?" },
      { id:"j2", q:"In your own words, why are fat-soluble vitamins riskier as supplements?" },
      { id:"j3", q:"Explain to a friend two ways to cook vegetables that keep more vitamin C." },
      { id:"j4", q:"What do you think Canada should do about safe drinking water in First Nations communities, and what would you want to learn first?" }
    ],
    self:{
      title:"Self check summary",
      none:"You haven’t opened the self check. It’s optional: Explore, Mode 3 (Food records).",
      privacy:"This summary stays on this page. It isn’t saved, scored or added to your results summary.",
      open:"Go to the self check",
      advice:ADVICE
    }
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which group lists only <strong>fat-soluble</strong> vitamins?", options:[
          { t:"A, D, E, K", ok:true, why:"Absorbed with fat and stored." },
          { t:"B1, B2, B12, C", why:"Water-soluble." },
          { t:"A, C, D, K", why:"C is water-soluble." },
          { t:"Calcium, iron, iodine", why:"Minerals." }] },
        b:{ prompt:"Which group lists only <strong>trace</strong> minerals?", options:[
          { t:"Iron, iodine, zinc, fluoride", ok:true, why:"Trace minerals are needed in smaller amounts." },
          { t:"Calcium, phosphorus, potassium", why:"Major minerals." },
          { t:"Iron, calcium, sodium", why:"Calcium and sodium are major." },
          { t:"Vitamins A and D", why:"Vitamins." }] } },
      { id:"k2", cat:"K", goal:5,
        a:{ prompt:"Which is a function of water in the body?", options:[
          { t:"Regulating temperature through sweat", ok:true, why:"Evaporating sweat carries heat away." },
          { t:"Providing 4 kcal per gram", why:"Water has no energy." },
          { t:"Building bone mineral", why:"Calcium and phosphorus do that." },
          { t:"Storing vitamin A", why:"The liver stores it." }] },
        b:{ prompt:"Which statement about water intake is accurate?", options:[
          { t:"Food and other drinks also count toward total water intake", ok:true, why:M7 },
          { t:"Only plain water counts", why:M7 },
          { t:"Everyone needs exactly eight glasses", why:M7 },
          { t:"Thirst is never a useful signal", why:"For most healthy people it is." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which is the best-absorbed calcium source here?", options:[
          { t:"Milk or a fortified soy beverage", ok:true, why:"Milk products, fortified beverages and calcium-set tofu are well-absorbed sources." },
          { t:"Spinach", why:M5 },
          { t:"Apple juice", why:"Very little calcium unless fortified." },
          { t:"White bread", why:"Little calcium." }] },
        b:{ prompt:"Which food supplies <strong>non-heme</strong> iron?", options:[
          { t:"Lentils", ok:true, why:"Legumes supply non-heme iron." },
          { t:"Beef", why:"Heme." },
          { t:"Salmon", why:"Heme." },
          { t:"Chicken", why:"Heme." }] } },
      { id:"t1", cat:"T", goal:[1, 3],
        a:{ prompt:"Persona Sam is vegan and eats a wide variety of plant foods but no fortified products. Which nutrient is he most at risk of lacking, and why?", options:[
          { t:"Vitamin B12: it comes only from animal or fortified foods", ok:true, why:M3 },
          { t:"Vitamin C: plants lack it", why:"Plants are rich in vitamin C." },
          { t:"Fibre: plants lack it", why:"Plants are fibre’s source." },
          { t:"Vitamin K: plants lack it", why:"Leafy greens are rich in K." }] },
        // VERIFY: winter sun at Canadian latitudes makes little vitamin D.
        b:{ prompt:"Persona Ana avoids dairy and fortified beverages and spends winter in Winnipeg. Which nutrient is she most at risk of lacking, and why?", options:[
          { t:"Vitamin D: few foods supply it and winter sun at Canadian latitudes makes little", ok:true, why:"Few foods naturally contain vitamin D, and winter sun is weak at Canadian latitudes." },
          { t:"Vitamin C", why:"Plenty in fruits and vegetables." },
          { t:"Iron", why:"Not linked to dairy or sun." },
          { t:"Potassium", why:"Plenty in plant foods." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A persona takes a vitamin C supplement and a vitamin D supplement, both at very high doses. Which is the bigger concern for build-up, and why?", options:[
          { t:"Vitamin D: it’s fat-soluble and stored, so excess accumulates", ok:true, why:M1 },
          { t:"Vitamin C: it’s stored in fat", why:"Vitamin C is water-soluble." },
          { t:"Neither: vitamins are always safe", why:M1 },
          { t:"Both equally", why:"Storage differs." }] },
        b:{ prompt:"A child finds a bottle of adult iron supplements. Why is this an emergency?", options:[
          { t:"Iron in large doses is toxic and can cause serious harm to young children", ok:true, why:"Keep supplements out of reach." },
          { t:"Iron is harmless because it’s a mineral", why:"Toxic in excess." },
          { t:"It isn’t an emergency", why:"It is." },
          { t:"Only vitamin C pills are dangerous", why:"Iron is the classic poisoning risk." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Historical case: a community lives mostly on polished white rice and develops weakness and nerve damage. Which nutrient and why?", options:[
          { t:"Thiamin: polishing removes the rice’s thiamin-rich outer layers (beriberi)", ok:true, why:"Beriberi is thiamin deficiency, linked to polished white rice." },
          { t:"Vitamin C: rice has no C", why:"Scurvy shows bleeding gums." },
          { t:"Niacin: corn-based pellagra", why:"This is rice, and the symptoms differ." },
          { t:"Iodine: goitre", why:"No neck swelling." }] },
        b:{ prompt:"A community’s main food is corn not treated with lime; people develop a sun-sensitive rash and diarrhea. Which nutrient?", options:[
          { t:"Niacin (pellagra)", ok:true, why:"Pellagra is niacin deficiency, linked to untreated corn diets." },
          { t:"Thiamin", why:"Beriberi; polished rice." },
          { t:"Vitamin D", why:"Rickets; bones." },
          { t:"Iron", why:"Anemia; fatigue." }] } },
      { id:"c1", cat:"C", goal:[2, 6],
        a:{ prompt:"Which sentence best explains why scurvy disappeared on long voyages?", options:[
          { t:"“Ships began carrying citrus, which supplied vitamin C, the nutrient whose absence causes scurvy.”", ok:true, why:"It names the food, the nutrient and the disease it prevents." },
          { t:"“Sailors exercised more.”", why:"Not the cause." },
          { t:"“Scurvy is contagious and sailors stopped spreading it.”", why:"Not contagious." },
          { t:"“Salt meat had vitamin C.”", why:"Salted meat lacks it." }] },
        // VERIFY: iodized salt policy.
        b:{ prompt:"Which sentence best explains why goitre is now rare in Canada?", options:[
          { t:"“Table salt is iodized, so most people get enough iodine without changing their habits.”", ok:true, why:"Fortification works in the background." },
          { t:"“People eat more seaweed.”", why:"Not the main reason." },
          { t:"“Goitre was cured by antibiotics.”", why:"Not an infection." },
          { t:"“Thyroids evolved.”", why:"Not on that time scale." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which statement best explains why fortifying flour with folic acid is effective?", options:[
          { t:"“It reaches people in early pregnancy, often before they know they’re pregnant, when folate matters most for neural tube development.”", ok:true, why:M6 },
          { t:"“It makes bread taste better.”", why:"Not the purpose." },
          { t:"“Folic acid is a protein.”", why:"A B vitamin." },
          { t:"“Everyone needs extra folate equally.”", why:"Early pregnancy is the critical time." }] },
        // VERIFY: vitamin D in milk policy and the winter-sun statement.
        b:{ prompt:"Which statement best explains why vitamin D is added to milk in Canada?", options:[
          { t:"“Few foods naturally contain vitamin D, and winter sun is weak at Canadian latitudes, so fortifying a widely used food helps prevent deficiency.”", ok:true, why:"Fortification works in the background." },
          { t:"“Milk naturally lacks calcium.”", why:"Milk is rich in calcium." },
          { t:"“Vitamin D adds flavour.”", why:"No." },
          { t:"“Vitamin D replaces sunlight entirely.”", why:"It helps; it doesn’t replace." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A cafeteria boils vegetables for 20 minutes and drains them. Which change keeps the most vitamin C for the least effort?", options:[
          { t:"Steam them for a shorter time", ok:true, why:"Less water and less time keep more." },
          { t:"Boil them longer", why:"Loses more." },
          { t:"Add salt to the water", why:"Doesn’t stop leaching." },
          { t:"Cut them the night before", why:"Loses more to air." }] },
        b:{ prompt:"A family makes a soup from boiled vegetables. Which choice keeps the leached vitamins?", options:[
          { t:"Use the cooking water as the soup base", ok:true, why:M2 },
          { t:"Drain and add fresh water", why:M2 },
          { t:"Boil longer for flavour", why:"Destroys more vitamin C." },
          { t:"Leave the pot uncovered overnight before serving", why:"Air and time reduce vitamins and raise safety risks." }] } },
      { id:"a2", cat:"A", goal:[4, 1],
        a:{ prompt:"Plan a breakfast for a persona with low iron who doesn’t eat meat. Which pairing best supports iron absorption?", options:[
          { t:"Iron-fortified cereal with strawberries and a glass of water", ok:true, why:"Non-heme iron plus vitamin C." },
          { t:"Fortified cereal with black tea", why:M4 },
          { t:"White toast with coffee", why:"Little iron, plus a hindering drink." },
          // VERIFY: calcium competes with iron absorption.
          { t:"Cereal with a calcium supplement taken at the same time", why:"Calcium competes with iron." }] },
        b:{ prompt:"Plan a lunch for a persona with low iron who eats legumes. Which pairing best supports iron absorption?", options:[
          { t:"Chickpea curry with tomatoes and red pepper", ok:true, why:"Non-heme iron plus vitamin C." },
          { t:"Chickpea curry with strong tea", why:M4 },
          { t:"Chickpeas with a glass of milk and a calcium pill", why:"Calcium competes." },
          { t:"Chickpeas with coffee", why:M4 }] } }
    ]
  },
  task:{
    title:"Nutrient-kept side dish", summary:"Nutrient-kept side dish",
    statement:"<p>Plan a <strong>warm vegetable side dish</strong> for a persona’s dinner that keeps vitamin C and brings vitamin A. Many plans work. Find one, then try another.</p><p class=\"tiny muted\">The retention bar uses model data based on typical findings, like the Explore lab.</p>",
    checks:["Keeps at least 75% of the vitamin C", "Brings vitamin A", "Served warm", "Cut just before cooking"],
    tips:["Less water, less time: steam, microwave or stir-fry, or use the cooking water.", "Choose an orange or dark green vegetable.", "The persona wants a warm side; choose a cooking method.", "Cut surfaces lose vitamin C to air. Cut just before cooking."],
    explainPrompt:"Explain how your choices keep vitamin C and why your vegetable brings vitamin A.",
    vocab:"Use the words water-soluble, leach, retention and beta-carotene.",
    checkLabel:"Check my plan",
    success:"Your side dish plan works.",
    more:"There’s more than one answer. Can you find another?",
    // Kitchen card (B1.4): saved as a text file; printing is blocked on the site.
    kitchen:{
      title:"Nutrient-kept side dish",
      steps:["Wash hands and produce.", "Cut just before cooking.", "Cook by the planned method and time until tender-crisp.", "Serve at once."],
      safety:["Knife grip and claw hand.", "Open steaming lids away from your face.", "Use oven mitts with the microwave dish."],
      record:["The time taken", "Colour and texture", "One change for next time"]
    }
  },
  cards:[
    ["Fat-soluble vitamins", "A, D, E, K: absorbed with fat, stored; excess from supplements can build up."],
    ["Water-soluble vitamins", "The B vitamins and C: not stored much; leach into cooking water."],
    ["Scurvy", "Vitamin C deficiency: bleeding gums, bruising, slow healing."],
    ["Rickets", "Vitamin D deficiency in children: soft, bowed bones."],
    // VERIFY: iodized salt policy.
    ["Goitre", "Iodine deficiency: thyroid swelling; prevented by iodized salt."],
    ["Iron-deficiency anemia", "Tiredness, paleness, shortness of breath; heme iron is better absorbed than non-heme."],
    ["Pellagra", "Niacin deficiency; linked to untreated corn diets; prevented by nixtamalization."],
    ["Beriberi", "Thiamin deficiency; linked to polished white rice."],
    ["Vitamin B12", "From animal and fortified foods only; vegans need fortified foods or a supplement."],
    ["Nutrient retention", "Keep vitamins with less water, less heat time, less air and light exposure."],
    ["Iron absorption", "Vitamin C helps non-heme iron; tea and coffee reduce it."],
    // VERIFY: definition of a long-term advisory.
    ["Potable water", "Safe to drink; long-term drinking water advisories mean a system has been unsafe for over a year."]
  ]
};
