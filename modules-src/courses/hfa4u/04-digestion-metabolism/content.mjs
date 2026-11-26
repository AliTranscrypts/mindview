// HFA4U 04 Digestion, Absorption & Metabolism. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/04-digestion-metabolism.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags; students see the plan's wording without them.
// Model data (labelled on screen): stop times, lactose per serving, villus surface units, the task's fibre values.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "The stomach starts protein digestion and churns food, but most chemical digestion and nearly all nutrient absorption happen in the small intestine.";
const M2 = "Bile emulsifies: it breaks fat into tiny droplets so lipase can reach it. Lipase does the chemical digestion.";
const M3 = "Fat products and fat-soluble vitamins travel in chylomicrons through the lacteals into the lymph before reaching the blood.";
const M4 = "Fibre adds bulk, slows how fast sugars are absorbed, and feeds gut bacteria that make short-chain fatty acids.";
const M5 = "An allergy involves the immune system and can be life-threatening. An intolerance, such as lactose intolerance, is digestive.";
const M6 = "Metabolism is every chemical reaction in your body. BMR changes with lean mass, age, growth, hormones, illness and pregnancy.";
const M7 = "Celiac testing is done while you’re still eating gluten. Gluten-free isn’t automatically healthier for people who don’t need it.";

const ROUTE_W = "Glucose → capillary → hepatic portal vein → liver";
const ROUTE_F = "fatty acids → micelles → chylomicrons → lacteal → lymph";

export default {
  id:"04-digestion-metabolism",
  kind:"topic",
  title:"Digestion, absorption and metabolism",
  topic:"Digestion, Absorption & Metabolism",
  readyTopic:"digestion, absorption and metabolism",
  hero:{
    eq:"food → molecules → you", eqSize:"sm", eqLabel:"food, then molecules, then you",
    headline:"Your lunch takes a journey of several metres.",
    text:"<strong>Digestion</strong> breaks food into molecules small enough to cross into your body. <strong>Absorption</strong> moves them across, mostly in the small intestine. <strong>Metabolism</strong> is what your cells then do with them: release energy, build tissue, store the rest.",
    fig:{ html:'<div class="dg-hero" id="dg-hero"></div>', caption:"" },
    aria:"A forkful of lentil curry and rice travels through the digestive tract. In the mouth, teeth chew and saliva (amylase) starts on starch. A peristalsis wave pushes the bolus down the esophagus, and the stomach churns. In the small intestine the food breaks into orange glucose hexagons, magenta amino-acid beads and teal fatty-acid chains. The hexagons and beads cross into a capillary (blood); the teal chains cross into a lacteal (lymph). Water-soluble → blood. Fat-soluble → lymph.",
    caption:"Water-soluble → blood. Fat-soluble → lymph.",
    // VERIFY: adult digestive tract length (plan: "given in the hero caption, verify before release"; the plan gives no figure).
    length:"In an adult, the whole digestive tract is roughly 5 to 9 m long."
  },
  goals:[
    "I can describe mechanical and chemical digestion from the mouth to the large intestine.",
    "I can match each macronutrient to the enzymes (and bile) that break it down and the products formed.",
    "I can explain where and how nutrients are absorbed, including the different routes for water-soluble and fat-soluble products.",
    "I can explain metabolism, catabolism, anabolism and basal metabolic rate, and the factors that affect them.",
    "I can explain how stress, fibre and the gut microbiome affect digestion.",
    "I can tell lactose intolerance, celiac disease and food allergy apart, and explain eating practices that help manage each."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Macronutrient basics", goal:2,
          prompt:"Which macronutrient is built from amino acids?",
          options:[
            { t:"Protein", ok:true, why:"Proteins are chains of amino acids." },
            { t:"Carbohydrate", why:"Carbohydrates are built from sugars such as glucose." },
            { t:"Fat", why:"Most dietary fats are triglycerides: glycerol plus three fatty acids." },
            { t:"Fibre", why:"Fibre is a carbohydrate that human enzymes can’t break down." }],
          hints:["Think “building blocks”.", "Muscle, enzymes and antibodies are all made of this.", "Protein."] },
        { id:"w2", skill:"Macronutrient basics", goal:3,
          prompt:"Which vitamin is fat-soluble?",
          options:[
            { t:"Vitamin D", ok:true, why:"A, D, E and K are the fat-soluble vitamins." },
            { t:"Vitamin C", why:"Vitamin C is water-soluble." },
            { t:"Folate", why:"Folate is a water-soluble B vitamin." },
            { t:"Potassium", why:"Potassium is a mineral, not a vitamin." }],
          hints:["Remember the four fat-soluble vitamins from module 03.", "A, D, E, K.", "Vitamin D."] },
        { id:"w3", skill:"Body systems", goal:2,
          prompt:"Which organ <strong>makes</strong> bile?",
          options:[
            { t:"The liver", ok:true, why:"The liver makes bile; the gallbladder stores and concentrates it." },
            { t:"The gallbladder", why:"The gallbladder stores bile but doesn’t make it." },
            { t:"The pancreas", why:"The pancreas makes digestive enzymes and bicarbonate, not bile." },
            { t:"The stomach", why:"The stomach makes acid and pepsin." }],
          hints:["One organ makes it, another stores it.", "It’s the largest internal organ.", "The liver."] },
        { id:"w4", skill:"Body systems", goal:3,
          prompt:"Which body system carries absorbed nutrients to the body’s cells?",
          options:[
            { t:"Circulatory system", ok:true, why:"The blood delivers nutrients to every cell." },
            { t:"Nervous system", why:"Nerves carry signals, not nutrients." },
            { t:"Respiratory system", why:"The lungs exchange gases." },
            { t:"Skeletal system", why:"Bones store minerals but don’t deliver nutrients." }],
          hints:["What travels through every part of your body?", "Blood.", "The circulatory system."] },
        { id:"w5", skill:"Enzymes", goal:2,
          prompt:"What does a digestive enzyme do?",
          options:[
            { t:"Speeds up one specific breakdown reaction without being used up", ok:true, why:"Enzymes are specific, reusable catalysts." },
            { t:"Supplies energy for digestion", why:"Enzymes lower the energy a reaction needs; they aren’t a fuel." },
            { t:"Is a nutrient you must eat each day", why:"Your body makes its digestive enzymes." },
            { t:"Breaks down every kind of molecule equally", why:"Each enzyme fits particular molecules." }],
          // Plan hint 3 is "A." (an option letter); the build reorders options, so it names the answer instead.
          hints:["Lock and key.", "Specific, and not used up.", "It speeds up one specific breakdown reaction without being used up."] },
        { id:"w6", skill:"Enzymes", goal:2,
          prompt:"Amylase breaks down…",
          options:[
            { t:"Starch", ok:true, why:"Amylase splits starch into shorter sugar chains." },
            { t:"Protein", why:"Proteases (like pepsin) break down protein." },
            { t:"Fat", why:"Lipase breaks down fat." },
            { t:"Cellulose (fibre)", why:"Humans have no enzyme for cellulose; that’s why it’s fibre." }],
          hints:["“-ase” names an enzyme; “amyl-” means starch.", "It starts working in your mouth.", "Starch."] }
      ],
      refreshers:{
        "Macronutrient basics":"Carbohydrates are built from sugars, proteins from amino acids, and most fats from glycerol plus fatty acids. Vitamins A, D, E and K are fat-soluble; B vitamins and C are water-soluble.",
        "Body systems":"The digestive system breaks food down and absorbs it; the circulatory system delivers nutrients; the lymphatic system carries absorbed fats into the blood.",
        "Enzymes":"An enzyme is a protein that speeds up one kind of reaction and is reused. Names ending in “-ase” are enzymes: amylase (starch), protease (protein), lipase (fat), lactase (lactose)."
      }
    }
  },
  explore:{
    heading:"Journey of a meal",
    intro:"Pick a meal and send it through the digestive tract. Stop at any organ to see what happens, which enzymes act, and where each nutrient ends up.",
    // Meals (plan M1–M4). "has" lists the meal's source foods per nutrient (module-written food descriptions, no amounts).
    meals:[
      { id:"m1", t:"Lentil curry, rice and cucumber raita", short:"Lentil curry and rice",
        has:{ starch:"rice and lentils", protein:"lentils and the raita’s yogurt", fat:"oil in the curry and the yogurt", fibre:"lentils and cucumber", lactose:"a little, in the raita’s yogurt", calcium:"the raita’s yogurt", water:"cucumber, raita and any drink" } },
      { id:"m2", t:"Turkey sandwich on whole wheat bread with an apple", short:"Turkey sandwich",
        has:{ starch:"whole wheat bread", protein:"turkey and bread", fat:"a little, in the turkey", fibre:"whole wheat bread and the apple", vitC:"the apple", water:"the apple and any drink" } },
      { id:"m3", t:"Tofu stir-fry with bok choy and noodles", short:"Tofu stir-fry",
        has:{ starch:"noodles", protein:"tofu", fat:"oil in the stir-fry", fibre:"bok choy", vitA:"bok choy (beta-carotene)", vitC:"bok choy", calcium:"tofu and bok choy", water:"bok choy and any drink" } },
      { id:"m4", t:"A glass of milk and a bowl of oatmeal", short:"Milk and oatmeal",
        has:{ starch:"oatmeal", protein:"milk and oats", fat:"milk", fibre:"oatmeal", lactose:"the milk", calcium:"the milk", water:"the milk" } }
    ],
    // The 7 stops (plan F4). VERIFY: every model time (plan: "times vary from person to person, verify ranges before release").
    // clock = model minutes on the stop clock [from, to]; the small intestine's ≈ 3 h runs across stops 4 and 5.
    stops:[
      { id:"mouth", t:"Mouth", short:"Mouth", clock:[0, 1], time:"≈ 1 min",
        mech:"Teeth chew food into small pieces; the tongue mixes it with saliva into a soft ball (bolus).",
        chem:[{ n:"starch", t:"Salivary amylase: starch → shorter sugar chains" }],
        help:"Saliva moistens food", abs:"Nothing yet", route:"Swallowed into the esophagus" },
      { id:"eso", t:"Esophagus", short:"Esophagus", clock:[0, 1 / 6], time:"≈ 10 s",
        mech:"Peristalsis: waves of muscle push the bolus down to the stomach.",
        chem:[], none:"No new enzymes act here",
        help:"Mucus helps the bolus slide", abs:"Nothing", route:"Into the stomach" },
      { id:"stom", t:"Stomach", short:"Stomach", clock:[0, 180], time:"≈ 3 h",
        mech:"Churning mixes food with gastric juice into a thick liquid (chyme).",
        chem:[{ n:"protein", t:"Pepsin: proteins → peptides (in acid)" }],
        help:"Stomach acid unfolds proteins; mucus protects the stomach lining", abs:"Very little: some water", route:"Chyme moves into the duodenum a little at a time" },
      { id:"duo", t:"Small intestine (duodenum)", short:"Duodenum", clock:[0, 30], time:"≈ 3 h in the small intestine",
        mech:"Segmentation mixes food with juices",
        chem:[{ n:"starch", t:"Pancreatic amylase: starch → maltose" }, { n:"fat", t:"lipase: triglycerides → fatty acids + monoglycerides" }, { n:"protein", t:"trypsin: proteins → peptides" }],
        help:"Bile (emulsifies fat; not an enzyme); bicarbonate (neutralizes stomach acid)", abs:"None yet (duodenum)", route:"On to the jejunum and ileum" },
      { id:"jej", t:"Small intestine (jejunum and ileum: absorption)", short:"Jejunum and ileum", clock:[30, 180], time:"≈ 3 h in the small intestine",
        mech:"Segmentation and peristalsis roll food past millions of villi.",
        chem:[{ n:"starch", t:"Maltase: maltose → glucose" }, { n:"protein", t:"peptidases: peptides → amino acids" }, { n:"lactose", t:"lactase: lactose → glucose + galactose" }],
        help:"Micelles (bile with fat products) ferry fats to the cell wall",
        absBy:{ starch:"glucose", lactose:"galactose", protein:"amino acids", fat:"fatty acids", micro:"vitamins and minerals", water:"most of the water" },
        route:ROUTE_W + "; " + ROUTE_F },
      { id:"li", t:"Large intestine", short:"Large intestine", clock:[0, 1440], time:"≈ 1 day",
        mech:"Slow contractions move what’s left; as water is absorbed, stool forms.",
        chem:[{ n:"fibre", t:"Colon bacteria ferment fibre into short-chain fatty acids and gas" }],
        help:"Gut bacteria (the microbiome), which also make some vitamin K", abs:"Water and electrolytes; short-chain fatty acids from fibre", route:"Water and electrolytes → capillaries → blood" },
      { id:"after", t:"After absorption (liver and cells)", short:"Liver and cells", clock:null, time:"Minutes after absorption, and all day long",
        mech:"None: digestion is finished.",
        chem:[{ n:"all", t:"Metabolism: catabolism breaks molecules down and releases energy; anabolism builds glycogen, proteins and stored fat" }],
        help:"The liver processes nutrients, stores some and sends the rest out in the blood", abs:"Nothing: absorption is done", route:"Liver → blood → every cell; the lymph joins the blood near the heart" }
    ],
    // shown at stop 7: the BMR note (plan overview; M6 caught in the Explore readouts)
    bmr:"<strong>Basal metabolic rate (BMR)</strong> is the energy used at rest for vital functions. It isn’t a fixed speed you’re born with: it depends on lean body mass, age, growth, hormones, illness and pregnancy.",
    // tapping a helper organ
    organs:{
      liver:"<strong>Liver:</strong> makes bile, and receives water-soluble nutrients first through the hepatic portal vein.",
      gall:"<strong>Gallbladder:</strong> stores and concentrates bile made by the liver, and squeezes it into the duodenum when fat arrives.",
      panc:"<strong>Pancreas:</strong> sends amylase, lipase, trypsin and bicarbonate into the duodenum.",
      cells:"<strong>Body cells:</strong> use the absorbed nutrients for energy, building and storage."
    },
    // Follow a nutrient (plan Mode 2): the stop-by-stop path for one nutrient, written from the plan's overview.
    // Each entry: [chemical action, absorbed here, route]; "" = nothing at that stop.
    nutrients:[
      { id:"starch", t:"Starch", kind:"carb", path:[
        ["Salivary amylase: starch → shorter sugar chains", "", ""],
        ["No new enzymes act here", "", ""],
        ["Stomach acid stops salivary amylase", "", ""],
        ["Pancreatic amylase: starch → maltose", "", ""],
        ["Maltase: maltose → glucose", "Glucose", ROUTE_W],
        ["Nothing left: the glucose was absorbed", "", ""],
        ["Cells break glucose down for energy (catabolism); the liver and muscles build glycogen from extra glucose (anabolism)", "", "Liver → blood → every cell"]] },
      { id:"protein", t:"Protein", kind:"protein", path:[
        ["Chewing only: no enzymes act on protein here", "", ""],
        ["No new enzymes act here", "", ""],
        ["Pepsin: proteins → peptides (in acid)", "", ""],
        ["Trypsin: proteins → peptides", "", ""],
        ["Peptidases: peptides → amino acids", "Amino acids", "Amino acids → capillary → hepatic portal vein → liver"],
        ["Nothing left: the amino acids were absorbed", "", ""],
        ["Cells build proteins from amino acids (anabolism); extra amino acids can be broken down for energy (catabolism)", "", "Liver → blood → every cell"]] },
      { id:"fat", t:"Fat", kind:"fat", path:[
        ["Chewing only: no enzymes act on fat here", "", ""],
        ["No new enzymes act here", "", ""],
        ["Churning breaks fat into droplets; fat slows stomach emptying", "", ""],
        ["Bile emulsifies the fat (bile is not an enzyme); lipase: triglycerides → fatty acids + monoglycerides", "", ""],
        ["Micelles ferry fatty acids and monoglycerides to the cells, which package them as chylomicrons", "Fatty acids and monoglycerides", "Fatty acids → micelles → chylomicrons → lacteal → lymph"],
        ["Nothing left: the fat was absorbed", "", ""],
        ["Cells use fatty acids for energy (catabolism) or store them as fat (anabolism)", "", "The lymph joins the blood near the heart → cells"]] },
      { id:"fibre", t:"Fibre", kind:"fibre", path:[
        ["Chewing breaks fibre into smaller pieces; no enzymes act on it", "", ""],
        ["No enzymes act on fibre", "", ""],
        ["No enzymes; fibre slows stomach emptying, so fullness lasts longer", "", ""],
        ["No human enzyme can break fibre down", "", ""],
        ["Not absorbed; fibre slows how fast sugars are absorbed", "", ""],
        ["Colon bacteria ferment fibre into short-chain fatty acids and gas; fibre adds bulk", "Short-chain fatty acids", "Short-chain fatty acids → colon cells and blood"],
        ["Short-chain fatty acids feed the cells of the colon", "", ""]] },
      { id:"vitA", t:"Vitamin A", kind:"micro", fat:true, path:[
        ["No digestion needed: vitamins aren’t broken down", "", ""],
        ["No digestion needed", "", ""],
        ["Freed from the food as it’s churned", "", ""],
        ["Gathered with the fat products by bile", "", ""],
        ["Travels in micelles with fat; packed into chylomicrons", "Vitamin A", "Vitamin A → micelles → chylomicrons → lacteal → lymph"],
        ["Nothing left: the vitamin A was absorbed", "", ""],
        ["Stored in the liver (fat-soluble vitamins are stored)", "", "The lymph joins the blood near the heart → liver"]] },
      { id:"vitC", t:"Vitamin C", kind:"micro", path:[
        ["No digestion needed: vitamins aren’t broken down", "", ""],
        ["No digestion needed", "", ""],
        ["No digestion needed", "", ""],
        ["No digestion needed", "", ""],
        ["Absorbed as it is", "Vitamin C", "Vitamin C → capillary → hepatic portal vein → liver"],
        ["Nothing left: the vitamin C was absorbed", "", ""],
        ["Carried in the blood; extra leaves in urine (water-soluble vitamins aren’t stored much)", "", "Liver → blood → every cell"]] },
      { id:"calcium", t:"Calcium", kind:"micro", path:[
        ["No digestion needed: minerals aren’t broken down", "", ""],
        ["No digestion needed", "", ""],
        ["No digestion needed", "", ""],
        ["No digestion needed", "", ""],
        ["Absorbed into the blood (vitamin D helps)", "Calcium", "Calcium → capillary → blood"],
        ["Calcium that wasn’t absorbed leaves with the stool", "", ""],
        ["Bones store most of the body’s calcium", "", "Blood → bones and every cell"]] },
      { id:"water", t:"Water", kind:"water", path:[
        ["No digestion needed", "", ""],
        ["No digestion needed", "", ""],
        ["No digestion needed", "A little water", "Water → capillaries → blood"],
        ["Juices add more water to the mix", "", ""],
        ["Absorbed as it is", "Most of the water", "Water → capillaries → blood"],
        ["Absorbed as it is", "More water, with electrolytes", "Water → capillaries → blood"],
        ["Water carries nutrients and wastes in the blood", "", ""]] }
    ],
    // What if? (plan Mode 3). Effects are exact plan text; "at" = the stop where each line shows, "all" = the line elsewhere.
    conditions:[
      { id:"stress", t:"Exam-day stress", all:"Stress: the “fight or flight” response slows digestion",
        at:{ stom:"Stomach emptying slows. Digestion slows under stress; some people get stomach-aches." } },
      { id:"lactase", t:"Low lactase", all:"Low lactase: watch the lactose at the brush border",
        at:{ jej:"Lactose passes undigested: too little lactase to split it", li:"Bacteria ferment the lactose, making gas; water is drawn in: bloating, cramps, loose stools possible" },
        noLactose:"This meal has no milk sugar (lactose), so low lactase changes nothing here." },
      { id:"gall", t:"Gallbladder removed", all:"Gallbladder removed: watch the bile in the duodenum",
        at:{ duo:"Bile drips steadily from the liver instead of arriving in a concentrated burst, so a large high-fat meal is harder to emulsify: large fatty meals may cause discomfort" } },
      { id:"fibre", t:"High-fibre meal", all:"High-fibre meal: more fibre on board at every stop",
        at:{ stom:"Stomach emptying slows (fullness lasts longer)", jej:"Glucose enters the blood more gradually", li:"More material reaches the colon for fermentation" } },
      { id:"abx", t:"After antibiotics (fewer gut bacteria)", all:"After antibiotics: watch the bacteria in the large intestine",
        at:{ li:"Fewer bacteria in the large intestine, so less fermentation and less vitamin K made by gut bacteria (temporary in most people)" } }
    ],
    timeNote:"Model times vary from person to person.",
    predIntro:"Make a prediction first. Then the journey will show you what really happens.",
    predictions:[
      { id:"p1", meal:"m2", mode:"meal", stop:0,
        prompt:"Which macronutrient’s chemical digestion begins in your mouth?",
        options:[{ t:"Carbohydrate (starch)", ok:true }, { t:"Protein" }, { t:"Fat" }, { t:"None; the mouth only chews" }],
        explain:"Salivary amylase starts on starch. Chew bread for a while and it tastes slightly sweeter." },
      { id:"p2", meal:"m1", mode:"meal", stop:2,
        prompt:"Where will most of this meal’s nutrients be absorbed?",
        options:[{ t:"Small intestine", ok:true }, { t:"Stomach" }, { t:"Large intestine" }, { t:"Mouth" }],
        explain:"The small intestine’s villi and microvilli give it a huge surface. The stomach absorbs very little, mostly water and alcohol." },
      { id:"p3", meal:"m1", mode:"follow", nut:"fat", stop:3,
        prompt:"After absorption, which vessel do the fats from the curry enter first?",
        options:[{ t:"A lacteal (lymph vessel)", ok:true }, { t:"A capillary (blood)" }, { t:"The hepatic portal vein" }, { t:"The large intestine" }],
        explain:"Fat products are too large for capillaries once they’re packaged into chylomicrons, so they travel through the lymph and join the blood near the heart." },
      { id:"p4", meal:"m4", mode:"whatif", cond:"lactase", stop:4,
        prompt:"Where do the uncomfortable symptoms come from?",
        options:[{ t:"Undigested lactose reaching the large intestine, where bacteria ferment it", ok:true }, { t:"The stomach making too much acid" }, { t:"The milk’s protein causing an allergic reaction" }, { t:"The oatmeal’s fibre" }],
        explain:"Without enough lactase, lactose isn’t split into glucose and galactose. Bacteria ferment it, making gas, and it draws water into the bowel. That’s an intolerance, not an allergy." }
    ],
    chalIntro:"Use the chips in each challenge (and the journey above) to meet the goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Starch to blood sugar: place the four steps in order.",
        how:"Tap the steps in order. Tap a placed step to take it back.",
        chips:[{ id:"sal", t:"salivary amylase in the mouth" }, { id:"pan", t:"pancreatic amylase in the small intestine" }, { id:"mal", t:"maltase at the brush border" }, { id:"cap", t:"glucose absorbed into a capillary" }],
        answer:["sal", "pan", "mal", "cap"],
        msgs:{ maltase:"Maltase works on maltose, which only exists after amylase has cut starch into shorter pieces.", cap:"Glucose must be a single sugar before it can be absorbed.", count:"Place all four steps, in order." },
        general:"Where does starch digestion begin?",
        why:"Mouth amylase → pancreatic amylase → maltase → capillary.",
        hints:["Where does starch digestion begin?", "Amylase in the mouth, then the pancreas sends more amylase into the duodenum.", "Mouth amylase → pancreatic amylase → maltase → capillary."] },
      { id:"tc2", goal:[2, 3], prompt:"Get the fat from M1 (lentil curry, rice and cucumber raita) absorbed. Choose the helpers and the route.",
        how:"Choose any chips that apply.",
        chips:[{ id:"bile", t:"bile", ok:true }, { id:"lipase", t:"lipase", ok:true }, { id:"pepsin", t:"pepsin" }, { id:"lactase", t:"lactase" }, { id:"micelles", t:"micelles", ok:true }, { id:"chylo", t:"chylomicrons", ok:true }, { id:"capillary", t:"capillary" }, { id:"lacteal", t:"lacteal", ok:true }],
        msgs:{ bile:"Without bile, fat stays in big droplets and lipase can only work on their surfaces, so much of the fat passes through unabsorbed.",
          capillary:"Chylomicrons are too large for capillaries; they enter the lacteals.", pepsin:"Pepsin digests protein, not fat.",
          // module-written: the plan names no lactase message; this reuses its TC3 sentence
          lactase:"Lactase digests lactose, not fat.", none:"Choose the chips that get fat absorbed." },
        general:"Something’s missing. Bile emulsifies; lipase digests; micelles ferry the products to the cell wall; cells package them as chylomicrons.",
        why:"Bile, lipase, micelles, chylomicrons, lacteal: fat takes the lymph road.",
        hints:["Fat and water don’t mix. What breaks fat into tiny droplets?", "Bile emulsifies; lipase digests; micelles ferry the products to the cell wall; cells package them as chylomicrons.", "Bile, lipase, micelles, chylomicrons, lacteal."] },
      { id:"tc3", goal:[6, 2], stretch:true,
        prompt:"What if? Gallbladder removed. Persona <strong>Sunil, 52</strong>, had his gallbladder removed and his health team suggested adjusting his meals. Choose the <strong>two</strong> strategies that best fit how his digestion now works.",
        how:"Choose two strategies.",
        chips:[{ id:"A", t:"Eat smaller amounts of fat at each meal.", ok:true }, { id:"B", t:"Spread meals and snacks through the day.", ok:true }, { id:"C", t:"Cut out all fat completely." }, { id:"D", t:"Drink extra water to dissolve the fat." }, { id:"E", t:"Take lactase tablets with meals." }, { id:"F", t:"Eat only protein foods." }],
        msgs:{ C:"Some fat is essential: it supplies essential fatty acids and carries vitamins A, D, E and K.", D:"Fat doesn’t dissolve in water; that’s why bile is needed.", E:"Lactase digests lactose, not fat.",
          F:"Protein foods still contain fat, and the body needs carbohydrates and fibre too.", count:"Choose exactly two strategies." },
        general:"Smaller fat loads, more often.",
        note:"General information only. People after surgery follow their own health team’s advice.",
        show:"Show “gallbladder removed” in the journey",
        why:"A steady trickle of bile handles smaller amounts of fat, spread through the day.",
        hints:["Without a gallbladder, bile drips steadily instead of arriving in a large burst. What kind of meal does a steady trickle handle best?", "Smaller fat loads, more often.", "A and B."] }
    ],
    blocks:[
      { title:"What the journey shows", html:"<p>The <strong>small intestine</strong> does most of the work. <strong>Fat takes a different road</strong>: into the lymph, not straight into the blood. <strong>Fibre isn’t wasted</strong>: it feeds your gut bacteria. And what you feel (“full”, “bloated”, a “nervous stomach”) has a reason you can trace.</p>" },
      { title:"Metabolism", html:"<p><strong>Metabolism</strong> is every chemical reaction in the body. <strong>Catabolism</strong> breaks molecules down and releases energy. <strong>Anabolism</strong> builds glycogen, proteins and stored fat. <strong>Basal metabolic rate (BMR)</strong>, the energy used at rest for vital functions, depends on lean body mass, age, growth, hormones, illness and pregnancy. Stress, fibre and conditions such as lactose intolerance and celiac disease all change how digestion works.</p>" }
    ]
  },
  part3:{
    slug:"conditions", name:"Conditions", heading:"When digestion works differently",
    intro:"These three conditions each break a different step of the journey. Visit each station, reason from the mechanism to the management, then try the quick check.",
    advice:ADVICE,
    lactose:{
      title:"Station 1: Lactose intolerance",
      mech:"Less <strong>lactase</strong> at the brush border, so lactose reaches the colon.",
      dataTitle:"Check it with data: lactose per serving",
      // VERIFY: lactose values per serving against a nutrient database (e.g. the Canadian Nutrient File). Model data.
      foods:[
        { id:"milk", t:"Milk", serve:"1 cup (250 mL)", g:12 },
        { id:"yogurt", t:"Yogurt", serve:"¾ cup (175 g)", g:8 },
        { id:"cheddar", t:"Aged cheddar", serve:"50 g", g:0.1, label:"under 0.5 g" },
        { id:"lfmilk", t:"Lactose-free milk", serve:"1 cup (250 mL)", g:0, label:"0 g (already split)" },
        { id:"soy", t:"Fortified soy beverage", serve:"1 cup (250 mL)", g:0, label:"0 g" }
      ],
      insight:"Aged hard cheeses contain very little lactose.",
      // VERIFY: the global lactase-persistence estimate (plan: verify before release); no figure is shown.
      context:"Lactase levels after childhood vary widely around the world and are lower in many populations. This is common and normal, not a disease.",
      manage:[
        { id:"lf", t:"Lactose-free milk", why:"Lactase has been added, so the lactose is already split into glucose and galactose." },
        { id:"soy", t:"Fortified soy beverage", why:"No lactose, and it’s fortified for calcium and vitamin D." },
        { id:"small", t:"Smaller amounts with meals", why:"Less lactose at a time, mixed with other food, gives the lactase you have time to work." },
        { id:"cheese", t:"Aged cheese", why:"Aged hard cheeses contain very little lactose." },
        { id:"tabs", t:"Lactase tablets", why:"They supply the missing enzyme with the meal." }
      ]
    },
    celiac:{
      title:"Station 2: Celiac disease",
      mech:"An <strong>autoimmune</strong> reaction to <strong>gluten</strong> (in wheat, barley and rye) flattens the villi, cutting the surface for absorption. Iron, folate, calcium and vitamin D can be affected.",
      manage:"<strong>Management:</strong> a strict, lifelong gluten-free diet, including avoiding cross-contact.",
      diagnosis:"<strong>Diagnosis:</strong> made by a doctor, <strong>while the person is still eating gluten</strong>.",
      // plan risk 2: "follow your health team's advice" stated with the celiac content
      note:"General information only. People with celiac disease follow their own health team’s advice.",
      dataTitle:"Check it with data: healthy vs flattened villi",
      // model surface-area units (same model as Trace it T5)
      healthy:30, flat:3,
      states:[{ id:"healthy", t:"Healthy villi" }, { id:"flat", t:"Untreated celiac disease" }],
      readHealthy:"Tall villi covered in microvilli: a huge absorbing surface.",
      readFlat:"Flattened villi with few microvilli: much less surface, so iron, folate, calcium and vitamin D are absorbed less."
    },
    allergy:{
      title:"Station 3: Allergy or intolerance?",
      intro:"Sort each case. Reactions are described only by what you’d notice.",
      // module-written cases (the plan gives the format, not the six cases)
      boxes:[{ id:"al", label:"Food allergy", sub:"immune system" }, { id:"in", label:"Food intolerance", sub:"digestive" }],
      cases:[
        { id:"a1", t:"Hives within minutes of eating a peanut butter cookie", answer:"al", why:"Hives come from the immune system: that’s an allergy." },
        { id:"a2", t:"Bloating and cramps a couple of hours after a large glass of milk", answer:"in", why:"Bloating hours later is typical of lactose intolerance: a digestive problem." },
        { id:"a3", t:"Swelling of the lips soon after eating shrimp", answer:"al", why:"Swelling comes from the immune system: that’s an allergy." },
        { id:"a4", t:"Trouble breathing minutes after a bite of a cashew", answer:"al", why:"Trouble breathing is an immune reaction and an emergency: call 911." },
        { id:"a5", t:"Bloating after ice cream, but fine after aged cheddar", answer:"in", why:"Aged cheddar has very little lactose: this points to lactose intolerance." },
        { id:"a6", t:"Cramps after milk in a smoothie, but fine with lactose-free milk", answer:"in", why:"Lactose-free milk has the lactose already split: a digestive intolerance." }
      ],
      // VERIFY: Canada's current priority food allergen list (Health Canada).
      allergens:["Eggs", "Milk", "Mustard", "Peanuts", "Crustaceans and molluscs", "Fish", "Sesame seeds", "Soy", "Sulphites", "Tree nuts", "Wheat and triticale"],
      allergensTitle:"Canada’s priority food allergens (Health Canada, n.d.)",
      // VERIFY: emergency wording against current Health Canada guidance.
      rule:"An allergic reaction can be life-threatening (anaphylaxis): use an epinephrine auto-injector if one has been prescribed and call 911."
    },
    // VERIFY: reference title and year before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (n.d.). <i>Common food allergens</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Conditions quick check", summary:"Conditions quick check",
      items:[
        { id:"q1", goal:6, prompt:"A student feels bloated after milk but fine after aged cheddar. Most likely?",
          choices:[{ t:"Lactose intolerance", ok:true, fb:"Right. Aged cheddar has very little lactose; an allergy to milk protein would react to cheese too." },
            { t:"Milk allergy", fb:"Aged cheddar has very little lactose; an allergy to milk protein would react to cheese too." },
            { t:"Celiac disease", fb:"Aged cheddar has very little lactose; an allergy to milk protein would react to cheese too." },
            { t:"Gallbladder problem", fb:"Aged cheddar has very little lactose; an allergy to milk protein would react to cheese too." }] },
        { id:"q2", goal:[6, 3], prompt:"Why can untreated celiac disease cause iron deficiency even when someone eats iron-rich foods?",
          choices:[{ t:"Damaged villi absorb less", ok:true, fb:"Right. Flattened villi mean less surface for absorption." },
            { t:"Gluten contains no iron", fb:"Flattened villi mean less surface for absorption." },
            { t:"The stomach destroys iron", fb:"Flattened villi mean less surface for absorption." },
            { t:"Iron causes the reaction", fb:"Flattened villi mean less surface for absorption." }] },
        { id:"q3", goal:6, prompt:"Which is a food <strong>allergy</strong> rather than an intolerance?",
          choices:[{ t:"Swelling of the lips and hives within minutes of eating peanuts", ok:true, fb:"Right. Hives and swelling come from the immune system: that’s an allergy." },
            { t:"Gas after beans", fb:"Hives and swelling come from the immune system: that’s an allergy." },
            { t:"Bloating after milk", fb:"Hives and swelling come from the immune system: that’s an allergy." },
            { t:"Heartburn after spicy food", fb:"Hives and swelling come from the immune system: that’s an allergy." }] },
        { id:"q4", goal:6, prompt:"Someone suspects celiac disease. Best first step?",
          choices:[{ t:"See a doctor for testing while still eating gluten", ok:true, fb:"Right. Removing gluten first can hide the signs the test looks for." },
            { t:"Stop eating gluten immediately", fb:"Removing gluten first can hide the signs the test looks for." },
            { t:"Take lactase tablets", fb:"Removing gluten first can hide the signs the test looks for." },
            { t:"Eat more fibre", fb:"Removing gluten first can hide the signs the test looks for." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"enzymes", type:"match", title:"Enzyme ↔ job", summary:"Enzyme ↔ job", goal:[1, 2],
        instruction:"Match each enzyme or helper to its job.",
        leftTitle:"Enzyme or helper", rightTitle:"Where and what it does",
        left:[
          { id:"l1", t:"Salivary amylase" }, { id:"l2", t:"Pepsin" }, { id:"l3", t:"Pancreatic lipase" },
          { id:"l4", t:"Bile", hints:["Which item isn’t an enzyme?", "It’s made by the liver.", "Bile emulsifies fat."] },
          { id:"l5", t:"Lactase" }, { id:"l6", t:"Trypsin" }, { id:"l7", t:"Maltase" }, { id:"l8", t:"Colon bacteria" }
        ],
        right:[
          { id:"r1", t:"Mouth: starch → shorter sugar chains" },
          { id:"r2", t:"Stomach: proteins → peptides (in acid)" },
          { id:"r3", t:"Small intestine: triglycerides → fatty acids + monoglycerides" },
          { id:"r4", t:"Small intestine: emulsifies fat (not an enzyme)" },
          { id:"r5", t:"Brush border: lactose → glucose + galactose" },
          { id:"r6", t:"Small intestine (from the pancreas): proteins and peptides → smaller peptides" },
          { id:"r7", t:"Brush border: maltose → glucose" },
          { id:"r8", t:"Large intestine: ferment fibre into short-chain fatty acids and gas" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l4|r3":"Bile prepares fat; lipase digests it.", "l3|r4":"Bile prepares fat; lipase digests it.",
          "l2|r6":"Both digest protein, but pepsin works in the acid of the stomach.", "l6|r2":"Both digest protein, but pepsin works in the acid of the stomach.",
          "l8|r1":"Humans have no enzyme for fibre; bacteria do the work.", "l1|r8":"Humans have no enzyme for fibre; bacteria do the work." },
        wrongDefault:"Check where the enzyme works and what it acts on." },
      { id:"trace", type:"custom", title:"Trace it", summary:"Trace it", star:true, goal:[3, 4, 5, 6],
        instruction:"Six items that trace nutrients through the body. Items marked ★ are non-routine; T6 is an investigation.",
        how:"Tap your choice (or type a number), then press Check.",
        items:[
          { id:"t1", kind:"chips", goal:3, prompt:"Vitamin A in carrots is absorbed best when the carrots are eaten with…",
            chips:[{ t:"hummus", ok:true }, { t:"water" }, { t:"plain rice cakes" }, { t:"black tea" }],
            fb:"Vitamin A is fat-soluble: it travels in micelles with fat.", why:"Hummus brings some fat, and vitamin A is fat-soluble: it travels in micelles with fat." },
          { id:"t2", kind:"chips", goal:3, prompt:"Which route does vitamin C take after absorption?",
            chips:[{ t:"capillary → liver", ok:true }, { t:"lacteal → lymph" }, { t:"stays in the colon" }, { t:"stored in fat tissue" }],
            fb:"Vitamin C is water-soluble, so it goes into the blood.", why:"Vitamin C is water-soluble, so it goes into the blood: capillary → hepatic portal vein → liver." },
          // module-written chips: the plan gives T3's answer, not its other chips
          { id:"t3", kind:"chips", star:true, goal:5, prompt:"Why does a lunch of whole grain bread and chickpeas keep you feeling full longer than white bread and juice?",
            chips:[{ t:"Fibre slows stomach emptying and glucose absorption", ok:true }, { t:"Human enzymes digest fibre slowly" }, { t:"Juice sugar stays in the stomach longer" }, { t:"Whole grains are absorbed in the stomach" }],
            fb:"Juice sugar is absorbed quickly; fibre slows the whole process.", why:"Juice sugar is absorbed quickly; fibre slows the whole process." },
          { id:"t4", kind:"chips", star:true, goal:5, prompt:"After a week of antibiotics, which vitamin might the gut bacteria make less of?",
            chips:[{ t:"Vitamin K", ok:true }, { t:"Vitamin C" }, { t:"Vitamin B12 from food" }, { t:"Vitamin D" }],
            fb:"Gut bacteria make some vitamin K; antibiotics reduce them for a while.", why:"Gut bacteria make some vitamin K; antibiotics reduce them for a while." },
          { id:"t5", kind:"num", star:true, goal:[6, 3], prompt:"A villus is drawn as a finger with microvilli. If the microvilli are lost (as in untreated celiac disease), the surface in a model drops from 30 units to 3 units. By what factor does the absorbing surface shrink?",
            answer:10, unit:"times", label:"Factor",
            why:"30 ÷ 3 = 10 times less surface.",
            wrong:[{ match:27, fb:"That’s the difference, 30 − 3. A factor compares by dividing." }, { match:0.1, fb:"That’s 3 ÷ 30. Divide the healthy surface by the damaged one." }],
            wrongDefault:"Compare the two surface sizes: divide the healthy surface by the damaged one.",
            hints:["Compare the two surface sizes.", "Divide the healthy surface by the damaged one.", "30 ÷ 3 = 10."] },
          // module-written chips for both sets: the plan gives T6's answers, not its other chips
          { id:"t6", kind:"two", star:true, inquiry:true, goal:2,
            prompt:"Students test amylase by mixing starch solution with saliva at 0, 2, 4 and 6 minutes, then adding iodine (blue-black means starch is present). Which is the <strong>independent</strong> variable, and which result shows amylase working?",
            sets:[
              { id:"iv", label:"Independent variable", chips:[{ t:"Time", ok:true }, { t:"Iodine colour" }, { t:"Amount of starch solution" }, { t:"Amount of saliva" }] },
              { id:"res", label:"Result that shows amylase working", chips:[{ t:"Blue-black fading to brown-yellow over time", ok:true }, { t:"Blue-black at every time" }, { t:"Blue-black getting darker over time" }, { t:"Brown-yellow at every time" }] }
            ],
            fbSets:{ iv:"Time is what the students change.", res:"Iodine stays blue-black while starch remains; as amylase breaks the starch down, the colour fades." },
            why:"Time is what the students change. Iodine stays blue-black while starch remains; as amylase breaks the starch down, the colour fades.",
            hints:["Which thing do the students choose to change?", "Iodine turns blue-black only when starch is present.", "Independent variable: time; amylase is working if the blue-black colour fades."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Dorian", goal:[2, 3, 6], how:"",
        instruction:"Dorian made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how fat in a meal is digested.",
            steps:["Fat reaches the small intestine mostly undigested.", "The gallbladder releases bile into the duodenum.", "Bile is the enzyme that breaks triglycerides into fatty acids.", "The fatty acids are then absorbed."],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Bile emulsifies fat into small droplets; lipase from the pancreas then breaks the triglycerides into fatty acids and monoglycerides.", ok:true, why:M2 },
              { t:"Bile is made by the gallbladder.", why:"The liver makes bile; the gallbladder stores it." },
              { t:"Pepsin breaks down the fat.", why:"Pepsin digests protein." },
              { t:"Step 3 is correct.", why:"Bile has no enzyme action on fat; it’s an emulsifier." }],
            // Plan hint 3 is "A." (a fix letter); fixes are reordered by the build, so it quotes the fix.
            hints:["Is bile an enzyme?", "It’s an emulsifier.", "Bile emulsifies fat into small droplets; lipase from the pancreas then breaks the triglycerides into fatty acids and monoglycerides."] },
          { id:"e2", goal:3, task:"Explain where the glucose from a slice of toast goes.",
            steps:["Amylase breaks starch into maltose, and maltase breaks maltose into glucose.", "Most of the glucose is absorbed in the stomach.", "It travels in the blood to the liver.", "Cells use it for energy or store it as glycogen."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is correct on its own, but step 2 has the wrong location.", "Step 4 is correct."],
            fixes:[
              { t:"Glucose is absorbed through the villi of the small intestine into capillaries.", ok:true, why:M1 },
              { t:"Glucose is absorbed in the large intestine.", why:"The large intestine mainly absorbs water and electrolytes." },
              { t:"Glucose enters the lacteals.", why:"Lacteals take fat products, not glucose." },
              { t:"Step 2 is correct.", why:"The stomach absorbs very little besides water and alcohol." }],
            hints:["Which organ has the villi?", "Not the stomach.", "Glucose is absorbed through the villi of the small intestine into capillaries."] },
          { id:"e3", goal:6, task:"Advise a friend who thinks they might have celiac disease.",
            steps:["Celiac disease is an immune reaction to gluten.", "Gluten is found in wheat, barley and rye.", "So stop eating gluten right away, and then get tested.", "If the test is negative, you’re fine."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 depends on the mistake before it."],
            fixes:[
              { t:"See a doctor and get tested <strong>while still eating gluten</strong>; removing it first can hide the signs the test looks for.", ok:true, why:M7 },
              { t:"Take lactase tablets.", why:"Lactase helps with lactose, not gluten." },
              { t:"Eat gluten-free for a month to see.", why:"That can make testing unreliable." },
              { t:"Step 3 is correct.", why:"Testing depends on gluten still being in the diet." }],
            hints:["What does the test look for?", "The body’s reaction to gluten.", "See a doctor and get tested while still eating gluten; removing it first can hide the signs the test looks for."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"Which stop on the journey surprised you most, and why?" },
      { id:"j2", q:"In your own words, why do fats take a different route from glucose after absorption?" },
      { id:"j3", q:"Explain to a friend why fibre matters even though you can’t digest it." },
      { id:"j4", q:"What’s still unclear about enzymes or absorption? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is an example of <strong>mechanical</strong> digestion?", options:[
          { t:"The stomach churning food", ok:true, why:"Churning physically breaks food apart without changing molecules." },
          { t:"Pepsin splitting proteins", why:"That’s chemical digestion." },
          { t:"Amylase splitting starch", why:"That’s chemical digestion." },
          { t:"Lipase splitting fats", why:"That’s chemical digestion." }] },
        b:{ prompt:"Which is an example of <strong>chemical</strong> digestion?", options:[
          { t:"Lactase splitting lactose into glucose and galactose", ok:true, why:"An enzyme changes the molecule." },
          { t:"Teeth grinding a carrot", why:"That’s mechanical." },
          { t:"Peristalsis moving food down the esophagus", why:"That’s movement, not digestion of molecules." },
          { t:"The stomach churning", why:"That’s mechanical." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is bile’s role in digestion?", options:[
          { t:"It emulsifies fat so lipase can reach it", ok:true, why:M2 },
          { t:"It digests fat into fatty acids", why:"That’s lipase’s job." },
          { t:"It digests protein", why:"Proteases digest protein." },
          { t:"It absorbs vitamins", why:"Absorption happens through intestinal cells." }] },
        b:{ prompt:"What does pancreatic lipase do?", options:[
          { t:"Breaks triglycerides into fatty acids and monoglycerides", ok:true, why:"Lipase does the chemical digestion of fat, once bile has emulsified it." },
          { t:"Emulsifies fat into droplets", why:"That’s bile." },
          { t:"Breaks starch into maltose", why:"That’s amylase." },
          { t:"Neutralizes stomach acid", why:"That’s bicarbonate." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Why does the small intestine absorb so much?", options:[
          { t:"Folds, villi and microvilli give it an enormous surface area", ok:true, why:M1 },
          { t:"Its strong acid dissolves nutrients", why:"The strong acid is in the stomach." },
          { t:"It is the first organ food reaches", why:"Food passes the mouth, esophagus and stomach first." },
          { t:"It contains the most bacteria", why:"Most gut bacteria live in the large intestine." }] },
        b:{ prompt:"What is the large intestine’s main absorption job?", options:[
          { t:"Absorbing water and electrolytes", ok:true, why:"The large intestine absorbs water and electrolytes, and its bacteria ferment fibre." },
          { t:"Absorbing most of the glucose", why:"That happens in the small intestine." },
          { t:"Absorbing fats into lacteals", why:"Lacteals are in the small intestine’s villi." },
          { t:"Absorbing protein", why:"Amino acids are absorbed in the small intestine." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A salad has spinach (rich in beta-carotene) and a dressing made with oil. Why does the dressing help the body use the vitamin A from the spinach?", options:[
          { t:"Vitamin A is fat-soluble, so it’s absorbed with fat in micelles and carried in chylomicrons", ok:true, why:M3 },
          { t:"Oil contains vitamin A", why:"This plain oil adds little vitamin A; it’s the absorption route that matters." },
          { t:"Oil speeds up the stomach", why:"Fat actually slows stomach emptying." },
          { t:"Vitamin A goes straight into the blood, and oil thins the blood", why:"Fat-soluble vitamins travel with fat through the lymph." }] },
        b:{ prompt:"A student takes a vitamin D supplement with a glass of water on an empty stomach every morning. What change would most likely improve absorption?", options:[
          { t:"Take it with a meal that contains some fat", ok:true, why:"Vitamin D is fat-soluble." },
          { t:"Take it with more water", why:"Water doesn’t carry fat-soluble vitamins." },
          { t:"Take it with orange juice", why:"Vitamin C helps iron absorption, not vitamin D." },
          { t:"Take it before bed without food", why:"Food with some fat helps." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Untreated celiac disease flattens the villi. Which problem is most likely to follow?", options:[
          { t:"Deficiencies of nutrients such as iron, folate and calcium", ok:true, why:"Less surface means less absorption." },
          { t:"Too much lactose absorbed", why:"Damaged villi make lactase <strong>lower</strong>, not higher." },
          { t:"Faster digestion of starch in the mouth", why:"The mouth isn’t affected." },
          { t:"More bile production", why:"Bile isn’t the issue." }] },
        b:{ prompt:"Why do some people with untreated celiac disease also have trouble digesting milk?", options:[
          { t:"Lactase sits on the brush border of the villi, which are damaged", ok:true, why:"Damaged villi make less lactase, so lactose reaches the colon." },
          { t:"Gluten is found in milk", why:"Milk doesn’t contain gluten." },
          { t:"The stomach stops making acid", why:"That isn’t the link." },
          { t:"Milk protein causes celiac disease", why:"Celiac disease is a reaction to gluten." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Amara drinks milk and feels bloated two hours later; her friend eats a peanut cookie and gets hives within minutes. Which statement is accurate?", options:[
          { t:"Amara’s reaction suggests an intolerance; her friend’s suggests an allergy", ok:true, why:M5 },
          { t:"Both are allergies", why:"Bloating hours later is typical of lactose intolerance." },
          { t:"Both are intolerances", why:"Hives within minutes involve the immune system." },
          { t:"Amara has an allergy; her friend has an intolerance", why:M5 }] },
        b:{ prompt:"Which situation needs emergency help right away?", options:[
          // VERIFY: emergency wording against current Health Canada guidance.
          { t:"Throat tightness and trouble breathing after eating shrimp", ok:true, why:"Possible anaphylaxis: use the prescribed auto-injector and call 911." },
          { t:"Gas after a bean salad", why:"Normal fermentation of fibre and certain carbohydrates." },
          { t:"Bloating after ice cream", why:"Typical of lactose intolerance." },
          { t:"Feeling full after a big meal", why:"Normal." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the clearest explanation of the difference between a food allergy and a food intolerance?", options:[
          { t:"“A food allergy is an immune-system reaction that can be life-threatening; an intolerance is a digestive problem, like too little lactase, that causes discomfort.”", ok:true, why:M5 },
          { t:"“An allergy is worse than an intolerance.”", why:"True, but it doesn’t explain <strong>why</strong>." },
          { t:"“An intolerance means you can never eat the food.”", why:"Many people with lactose intolerance tolerate small amounts." },
          { t:"“They’re the same thing with different names.”", why:M5 }] },
        b:{ prompt:"Which sentence best explains why lactose-free milk doesn’t cause symptoms?", options:[
          { t:"“The lactose has already been split into glucose and galactose, so there’s nothing left for gut bacteria to ferment.”", ok:true, why:"Lactose-free milk is cow’s milk with lactase added, so the splitting is already done." },
          { t:"“It has no calcium.”", why:"It keeps the calcium." },
          { t:"“It has no protein.”", why:"It keeps the protein." },
          { t:"“It’s made from soy.”", why:"Lactose-free milk is cow’s milk with lactase added." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement about basal metabolic rate is accurate?", options:[
          { t:"“BMR is the energy used at rest for vital functions, and it changes with lean body mass, age, growth and hormones.”", ok:true, why:M6 },
          { t:"“BMR is fixed at birth.”", why:M6 },
          { t:"“BMR is the energy used during exercise.”", why:"That’s activity energy." },
          { t:"“BMR only depends on how much you eat.”", why:"Body composition, age, growth and hormones all matter." }] },
        b:{ prompt:"Which best describes catabolism and anabolism?", options:[
          { t:"“Catabolism breaks molecules down and releases energy; anabolism uses energy to build molecules such as glycogen and proteins.”", ok:true, why:"Metabolism is every chemical reaction in the body: catabolism breaks down, anabolism builds." },
          { t:"“Catabolism builds; anabolism breaks down.”", why:"Reversed." },
          { t:"“Both are types of digestion.”", why:"They happen in cells after absorption." },
          { t:"“Anabolism only happens during exercise.”", why:"Building happens all the time, including growth and repair." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Lin, 16, is lactose intolerant. Which change best protects her calcium intake?", options:[
          { t:"Switch to lactose-free milk or a fortified soy beverage", ok:true, why:"Both supply calcium without the lactose." },
          { t:"Stop all calcium foods", why:"Calcium is still essential." },
          { t:"Drink juice instead of milk", why:"Most juice isn’t a calcium source." },
          { t:"Take lactase only on weekends", why:"Doesn’t solve daily calcium needs." }] },
        b:{ prompt:"Mo has celiac disease and wants a gluten-free breakfast with fibre. Which fits?", options:[
          { t:"Oatmeal labelled gluten-free, topped with berries", ok:true, why:"Oats labelled gluten-free avoid cross-contact, and oats and berries bring fibre." },
          { t:"Whole wheat toast", why:"Wheat contains gluten." },
          { t:"Barley cereal", why:"Barley contains gluten." },
          { t:"A plain gluten-free white bread", why:"Gluten-free but low in fibre." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A student says, “Fibre is pointless; it just passes through.” Which reply uses evidence best?", options:[
          { t:"“Fibre slows how fast sugars are absorbed, keeps you full, adds bulk, and feeds gut bacteria that make short-chain fatty acids.”", ok:true, why:M4 },
          { t:"“Fibre is digested in the stomach.”", why:"Human enzymes can’t digest it." },
          { t:"“Fibre gives a lot of energy.”", why:"Very little, compared with other carbohydrates." },
          { t:"“Fibre is only in supplements.”", why:"Vegetables, fruits, whole grains and legumes are rich in it." }] },
        b:{ prompt:"During exams, a student often gets a stomach-ache. Which explanation fits best?", options:[
          { t:"“The stress response shifts the body away from digestion, slowing it and sometimes causing discomfort.”", ok:true, why:"Digestion slows under stress; some people get stomach-aches." },
          { t:"“Stress digests food faster.”", why:"Stress usually slows digestion." },
          { t:"“Exam food has more bile.”", why:"Bile doesn’t come from food." },
          { t:"“Stress makes the stomach absorb more.”", why:M1 }] } }
    ]
  },
  task:{
    title:"Pack Lin’s lunch", summary:"Pack Lin’s lunch",
    statement:"<p>Lin, 16, is lactose intolerant and has soccer after school. Choose one item from each row to pack a lunch that meets every condition. Can you find three different lunches?</p>",
    // VERIFY: model fibre values per serving (plan). 26 of the 240 lunches pass every line (rechecked by search).
    rows:[
      { id:"g", t:"Grain", items:[
        { id:"G1", t:"Whole wheat pita", fibre:4 }, { id:"G2", t:"White bagel", fibre:1 }, { id:"G3", t:"Brown rice salad", fibre:3 }] },
      { id:"p", t:"Protein", items:[
        { id:"P1", t:"Hummus", fibre:2, fat:true }, { id:"P2", t:"Chickpea salad with oil dressing", fibre:6, fat:true },
        { id:"P3", t:"Turkey slices", fibre:0 }, { id:"P4", t:"Canned salmon with bones", fibre:0, fat:true, ca:true }] },
      { id:"v", t:"Vegetable or fruit", items:[
        { id:"V1", t:"Baby carrots", fibre:2, bc:true }, { id:"V2", t:"Apple", fibre:3 }, { id:"V3", t:"Cucumber slices", fibre:1 }, { id:"V4", t:"Mango", fibre:2, bc:true }] },
      { id:"d", t:"Drink", items:[
        { id:"D1", t:"Water" }, { id:"D2", t:"Regular milk", lactose:true, ca:true }, { id:"D3", t:"Lactose-free milk", ca:true },
        { id:"D4", t:"Fortified soy beverage", ca:true }, { id:"D5", t:"Sports drink", sugary:true }] }
    ],
    tags:{ fat:"contains fat", ca:"calcium source", bc:"beta-carotene", lactose:"contains lactose", sugary:"sugary" },
    checks:["Lactose-free lunch", "At least 6 g of fibre", "A calcium source", "Beta-carotene eaten with some fat", "Not a sugary drink"],
    tips:["Regular milk contains lactose; try lactose-free milk or fortified soy.", "Add up the fibre: whole grains and legumes help most.", "Calcium can come from the drink or from salmon with its bones.", "Vitamin A from carrots or mango is fat-soluble; pair it with a protein that contains fat.", "Water or milk is better than a sugary drink."],
    explainPrompt:"Explain how your lunch works with Lin’s digestion: lactose, fibre, and how vitamin A gets absorbed.",
    vocab:"Use the words lactase, fibre, fat-soluble and absorption.",
    checkLabel:"Check my lunch",
    success:"This lunch works for Lin.",
    more:"There’s more than one answer. Can you find another?",
    after3:"There are 26 lunches in all. Notice that water only works when the salmon brings the calcium."
  },
  cards:[
    ["Mechanical vs chemical digestion", "Physical breaking (chewing, churning) vs changing molecules (enzymes, acid)."],
    ["Salivary amylase", "Mouth: starts breaking starch into shorter chains."],
    ["Pepsin", "Stomach: starts protein digestion in acid."],
    ["Bile", "Made by the liver, stored in the gallbladder; <strong>emulsifies</strong> fat. Not an enzyme."],
    ["Lipase", "Pancreas → small intestine: triglycerides → fatty acids + monoglycerides."],
    ["Villi and microvilli", "Finger-like folds that give the small intestine a huge absorbing surface."],
    ["Two absorption routes", "Water-soluble → capillaries → liver; fat-soluble → chylomicrons → lacteals → lymph."],
    ["Large intestine", "Absorbs water and electrolytes; bacteria ferment fibre."],
    ["Fibre’s jobs", "Bulk, fullness, slower sugar absorption, food for gut bacteria."],
    ["Metabolism", "Every chemical reaction in the body: catabolism (break down) + anabolism (build)."],
    ["BMR", "Energy used at rest for vital functions; changes with lean mass, age, growth, hormones."],
    ["Allergy vs intolerance", "Immune reaction (can be life-threatening) vs digestive reaction (discomfort)."]
  ]
};
