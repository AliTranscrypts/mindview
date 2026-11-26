// HFA4U 15 Foodborne Illness and Food Safety. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/15-food-safety.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// VERIFY (plan §6): every safe internal temperature, the danger-zone limits, fridge and freezer temperatures, the 2-hour and
// 1-hour rules, turkey thawing times and the cold-water method, pathogen onset ranges, whether freezing inactivates norovirus,
// burn-cooling and eye-flushing times, Canada's priority allergen list and labelling rules, and the roles of PHAC and CFIA.
// Model data (labelled on screen): the bacteria growth model and the outbreak data. No images of illness or injury.

const I = (s) => "<i>" + s + "</i>";
const LIS = I("Listeria");
// plan: the course plan §2 health-information line; the first sentence is module-written (as in HFA4U 12)
const ADVICE = "Health information here is general, not advice for any particular person. For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3). VERIFY: 71 °C for ground beef (M1).
const M1 = "Colour isn’t reliable: a burger can brown before it’s safe. Use a thermometer: 71 °C for ground beef.";
const M2 = "Cold slows most bacteria, but " + LIS + " can grow at fridge temperatures.";
const M3 = "Some bacteria make toxins that heat doesn’t destroy. Cool food fast to begin with.";
const M4 = "Onset ranges from hours to weeks, depending on the pathogen.";
const M5 = "Wash with hot, soapy water. Wiping spreads residue.";
const M6 = "The outside warms into the danger zone while the inside is still frozen. Thaw in the fridge, in cold water, or in the microwave and then cook right away.";
const M7 = "Water makes burning oil spatter and spread. Turn off the heat and cover with a lid.";

// Practice 2 (D5): one chip pool for all three variable slots. Items 4 and 5 are module-written distractors.
const POOL = ["Washing time", "Bacterial colonies on a swab plate", "Same soap and water temperature", "How clean the hands look", "A different soap for each washing time"];
const pool = (k) => POOL.map((t, i) => (i === k ? { t, ok:true } : { t }));

export default {
  id:"15-food-safety",
  kind:"topic",
  title:"Foodborne illness and food safety",
  topic:"Foodborne Illness and Food Safety",
  readyTopic:"foodborne illness and food safety",
  hero:{
    eq:"Clean · Separate · Cook · Chill", eqSize:"sm", eqLabel:"clean, separate, cook, chill",
    headline:"Time plus temperature equals risk.",
    text:"Most <strong>foodborne illness</strong> is preventable. Bacteria multiply fastest in the <strong>danger zone</strong>, between 4 °C and 60 °C. Four habits keep food safe: <strong>clean</strong>, <strong>separate</strong>, <strong>cook</strong> and <strong>chill</strong>. A <strong>food thermometer</strong> settles every argument about doneness.",
    fig:{ html:'<div class="fs-hero" id="fs-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A thermometer with three bands: cold, 4 °C or colder; the danger zone, 4 °C to 60 °C; and hot, 60 °C or hotter. A tray of bacteria in the danger zone doubles at each tick: 1, 2, 4, 8. Every 20 minutes, in ideal conditions (model). Then the four steps appear: clean, separate, cook and chill.",
    model:"Every 20 minutes, in ideal conditions (model)",
    bands:{ cold:"Cold", dz:"Danger zone", hot:"Hot" }
  },
  goals:[
    "I can state safe food temperatures (the danger zone, fridge and freezer, and safe internal cooking temperatures).",
    "I can explain the causes, sources and symptoms of common foodborne illnesses, and who is most at risk.",
    "I can apply clean, separate, cook and chill, plus personal hygiene, to prevent contamination and allergen cross-contact.",
    "I can use a time-and-temperature growth model to make food-safety decisions.",
    "I can analyse outbreak data to identify a likely source.",
    "I can identify kitchen accidents and choose the correct first response."
  ],
  start:{
    // module-written (plan notes: model data labelled on screen; health information, not advice)
    blocks:[{ title:"Before you start", html:"<p>The bacteria growth model and the outbreak data in this module are <strong>model data</strong>: made up for teaching. Safe temperatures follow Health Canada’s guidance. " + ADVICE + "</p>" }],
    warmup:{
      questions:[
        // VERIFY: current handwashing guidance (at least 20 seconds). Plan prompt adds "(verify current guidance)".
        { id:"w1", skill:"Hygiene and handwashing", goal:3,
          prompt:"How long should you scrub your hands with soap before rinsing?",
          options:[
            { t:"At least 20 seconds", ok:true, why:"About the time it takes to hum ‘Happy Birthday’ twice." },
            { t:"2 seconds", why:"Too short to lift germs." },
            { t:"Only if they look dirty", why:"Germs are invisible." },
            { t:"Hand sanitizer always replaces washing", why:"Soap and water work better on greasy or visibly dirty hands, and on some germs." }],
          hints:["Longer than a quick rinse.", "Think of a short song.", "At least 20 seconds."] },
        { id:"w2", skill:"Hygiene and handwashing", goal:3,
          prompt:"When must you wash your hands while cooking?",
          options:[
            // module-written feedback for the correct option
            { t:"After touching raw meat, poultry, fish or eggs, and before touching ready-to-eat food", ok:true, why:"That’s when germs could move from raw food to ready-to-eat food." },
            { t:"Only at the start", why:"Raw-food germs get on your hands mid-recipe." },
            { t:"Only at the end", why:"Too late; you’ve already spread germs." },
            { t:"Never, if you wear gloves", why:"Gloves carry germs too, and must be changed." }],
          hints:["When could germs move from one food to another?", "Raw to ready-to-eat.", "After raw, before ready-to-eat."] },
        // VERIFY: fridge 4 °C or colder (plan prompt adds "(verify)").
        { id:"w3", skill:"Storage basics", goal:1,
          prompt:"What temperature should a refrigerator be?",
          options:[
            { t:"4 °C or colder", ok:true, why:"Just below the danger zone, which starts at 4 °C." },   // module-written (from the hints)
            { t:"10 °C", why:"That’s inside the danger zone." },
            { t:"0 °C exactly", why:"Colder than needed; 4 °C or colder is the rule." },
            { t:"−18 °C", why:"That’s the freezer." }],
          hints:["Just below the danger zone.", "The danger zone starts at 4 °C.", "4 °C or colder."] },
        // VERIFY: the 2-hour rule.
        { id:"w4", skill:"Storage basics", goal:4,
          prompt:"Leftovers should go into the fridge within…",
          options:[
            { t:"2 hours of cooking", ok:true, why:"Less time in the danger zone." },
            { t:"6 hours", why:"Far too long in the danger zone." },
            { t:"The next morning", why:"Overnight at room temperature is unsafe." },
            { t:"Only once they’re cold", why:"Waiting to cool on the counter is the problem; use shallow containers." }],
          hints:["Think of the danger zone.", "Short.", "Within 2 hours."] },
        { id:"w5", skill:"Illness basics", goal:2,
          prompt:"Which is a common symptom of foodborne illness?",
          options:[
            { t:"Diarrhea, cramps and vomiting", ok:true, why:"Foodborne pathogens mostly affect the digestive tract." },   // module-written
            { t:"A broken bone", why:"Unrelated." },
            { t:"Only a rash", why:"A rash can signal an allergy, a different problem." },
            { t:"Better appetite", why:"Usually the opposite." }],
          hints:["Where does food go?", "The digestive tract.", "Digestive symptoms."] },
        { id:"w6", skill:"Allergen labels", goal:3,
          prompt:"A label says ‘May contain peanuts’. What does that warn about?",
          options:[
            { t:"Possible cross-contact with peanuts during production", ok:true, why:"Peanuts could get in from shared equipment." },   // module-written (from the hints)
            { t:"Peanuts are a main ingredient", why:"Main ingredients are in the ingredient list." },
            { t:"The food is peanut-free", why:"The opposite." },
            { t:"Nothing; it’s marketing", why:"It’s a real precaution for people with allergies." }],
          hints:["‘May contain’ means possible.", "From shared equipment.", "Cross-contact."] }
      ],
      // VERIFY: storage values (plan "(verify)") and Canadian labelling rules (plan "(verify Canadian labelling rules)").
      refreshers:{
        "Hygiene and handwashing":"Soap, at least 20 seconds, rinse and dry; after raw food, after the washroom, before ready-to-eat food.",
        "Storage basics":"Fridge 4 °C or colder; freezer −18 °C or colder; refrigerate within 2 hours.",
        "Illness basics":"Pathogens (bacteria, viruses, parasites) cause digestive symptoms; some cause serious illness.",
        "Allergen labels":"Priority allergens appear in the ingredient list or a ‘Contains’ statement; ‘May contain’ warns of cross-contact."
      }
    }
  },
  explore:{
    heading:"Kitchen detective",
    intro:"Find the hazards, race the danger-zone clock, and check doneness the right way.",
    modes:[{ id:"hazard", t:"Spot the hazard" }, { id:"clock", t:"Danger-zone clock" }, { id:"thermo", t:"Thermometer check" }],
    steps:[{ id:"clean", t:"Clean" }, { id:"separate", t:"Separate" }, { id:"cook", t:"Cook" }, { id:"chill", t:"Chill" }, { id:"none", t:"Not a hazard" }],
    rows:{ found:"Hazards found", temp:"Temperature", time:"Time in danger zone", count:"Model count", reheat:"After reheating", food:"Food", reading:"Reading", probe:"Probe position", verdict:"Verdict" },
    // Mode A: Scene A (plan table). n = the number shown on the scene (reading order), so the plan's S-numbers aren't shown.
    // "aria" is the screen-reader label (plan build note); "short" is the visible name. Accepted steps are the plan's.
    scene:{
      how:"Tap a numbered spot, then choose the step that fixes it, or “Not a hazard”.",   // module-written
      spots:[
        { id:"s1", n:5, short:"Cutting board", aria:"Raw chicken on cutting board beside salad", t:"Raw chicken on the same cutting board as salad vegetables, with one knife", answer:["separate"] },
        { id:"s2", n:6, short:"Hand in the salad", aria:"The cook’s hand touching salad", t:"The cook touches salad right after handling raw chicken", answer:["clean"] },
        { id:"s3", n:4, short:"Milk carton", aria:"Milk carton on the counter", t:"A milk carton left on the counter", answer:["chill"] },
        { id:"s4", n:1, short:"Fridge thermometer", aria:"Fridge thermometer", t:"The fridge thermometer reads 8 °C", answer:["chill"] },
        { id:"s5", n:7, short:"Cut-open burger", aria:"Burger cut open on a plate", t:"A burger “checked” by cutting it to look at the colour", answer:["cook"] },
        { id:"s6", n:8, short:"Dishcloth", aria:"Dishcloth beside the plates", t:"One dishcloth used for raw meat juice, then for plates", answer:["clean", "separate"] },
        { id:"s7", n:9, short:"Bananas", aria:"Bananas on the counter", t:"Bananas on the counter", answer:["none"] },
        { id:"s8", n:3, short:"Bread box", aria:"Bread box on the shelf", t:"A loaf of bread in a bread box", answer:["none"] },
        { id:"s9", n:10, short:"Handwashing sink", aria:"Handwashing sink with soap", t:"A handwashing sink with soap", answer:["none"] },
        { id:"s10", n:2, short:"Canned beans", aria:"Canned beans in the pantry", t:"Canned beans in the pantry", answer:["none"] }
      ]
    },
    // Mode B (plan model rules, exact; on screen: "Model data: a teaching model")
    clock:{
      label:"Model data: a teaching model",
      foods:[
        { id:"salad", t:"Chicken salad" },
        { id:"stew", t:"Leftover stew" },
        { id:"rice", t:"Cooked rice", tox:true },
        { id:"pastry", t:"Cream pastry", tox:true }],
      toxin:"Some bacteria make toxins that heat doesn’t destroy.",
      reheat:"Then reheat to 74 °C",                 // module-written control label (P3 setup)
      reheated:"Most bacteria killed by the heat.",   // module-written
      toxinStays:"Most bacteria killed, but the toxin they made stays.",   // module-written (P3 reveal)
      rules:[
        "Between 4 °C and 60 °C, the count doubles at each full 20 minutes.",
        "At 4 °C or colder, and at 60 °C or hotter, there’s no change.",
        "A “toxin-former” tag on some foods (cooked rice, a cream pastry) notes: “Some bacteria make toxins that heat doesn’t destroy.”",
        // module-written (the reheat switch; P3)
        "Reheating to 74 °C kills most of the bacteria in the picture, but toxins already made on a toxin-former stay."
      ],
      // plan §6 risk 2 (the doubling model is simplified)
      note:"The doubling model is simplified: real growth depends on the organism, the food and the conditions.",
      big:{ t:"Big batch: a large pot of chili cools from 60 °C to 4 °C. Starting count 100.",
        methods:[
          { id:"counter", t:"Deep pot on the counter overnight", min:600 },
          { id:"fridge", t:"Deep pot straight into the fridge", min:360 },
          { id:"shallow", t:"Divide into shallow containers, then fridge", min:120 },
          { id:"ice", t:"Ice-water bath, then shallow containers", min:60 }] }
    },
    // Mode C. VERIFY: every temperature (Health Canada safe internal cooking temperatures).
    thermo:{
      foods:[
        { id:"gbeef", t:"Ground beef, pork, veal or lamb (burgers, sausages)", short:"ground beef", safe:71, shape:"patty" },
        { id:"gpoul", t:"Ground poultry", short:"ground poultry", safe:74, shape:"patty" },
        { id:"piece", t:"Poultry pieces", short:"poultry pieces", safe:74, shape:"leg", bone:true },
        { id:"whole", t:"Whole poultry", short:"whole poultry", safe:82, shape:"bird", bone:true },
        { id:"pork", t:"Pork chops and roasts", short:"pork chops and roasts", safe:71, shape:"chop", bone:true },
        { id:"fish", t:"Fish", short:"fish", safe:70, shape:"fish" },
        { id:"egg", t:"Egg dishes", short:"egg dishes", safe:74, shape:"dish" },
        { id:"left", t:"Leftovers and casseroles", short:"leftovers and casseroles", safe:74, shape:"dish" }],
      probes:[{ id:"thick", t:"Thickest part" }, { id:"bone", t:"Near bone" }, { id:"surface", t:"Surface" }],
      safe:"Safe: {s} °C reached ({f})",
      notYet:"Not yet safe: needs {s} °C",
      // module-written probe messages. VERIFY: Health Canada thermometer advice (thickest part, away from bone).
      move:{ bone:"Not a reliable reading: bone can give a false reading. Put the probe in the thickest part, away from bone.",
        surface:"Not a reliable reading: the surface heats first. Put the probe in the thickest part." },
      brown:"Looks done: brown inside",   // module-written (P4 setup: a burger with brown meat inside)
      tableTitle:"Safe internal temperatures (Health Canada, n.d.-c)"
    },
    predictions:[
      { id:"p1", prompt:"Chicken salad at 22 °C, starting count 100. After 2 hours on the counter, about how many bacteria are there (model)?",
        options:[{ t:"6400", ok:true }, { t:"200" }, { t:"600" }, { t:"1200" }],
        explain:"2 hours = 6 doublings: 100 × 64 = 6400. Growth multiplies; it doesn’t add." },
      { id:"p2", prompt:"The same salad in the fridge at 4 °C. After 2 hours in the fridge?",
        options:[{ t:"About 100: little or no growth in this model", ok:true }, { t:"6400" }, { t:"0 (the cold kills them)" }, { t:"3200" }],
        explain:"Cold slows growth. It doesn’t kill bacteria, and a few, like " + LIS + ", still grow slowly in real fridges." },
      { id:"p3", prompt:"Cooked rice (a toxin-former) was left out all day, then reheated to 74 °C. Is it safe now?",
        options:[{ t:"Not necessarily: some bacteria leave heat-stable toxins", ok:true }, { t:"Yes, reheating kills everything" }, { t:"Yes, if it smells fine" }, { t:"No, rice is never safe" }],
        explain:"Reheating kills many bacteria but not every toxin they’ve made. Cool and refrigerate rice promptly." },
      // VERIFY: 71 °C (plan explanation adds "(verify the temperature)").
      { id:"p4", prompt:"A burger with brown meat inside. Is it safely cooked?",
        options:[{ t:"You can’t tell by colour; check that it reaches 71 °C", ok:true }, { t:"Yes, brown means done" }, { t:"Yes, if the juices run clear" }, { t:"No, burgers can’t be made safe" }],
        explain:"Ground meat can brown early. A thermometer is the only reliable test." }
    ],
    challenges:[
      { id:"tc1", goal:3,
        prompt:"Spot the hazard: find all 6 food-safety hazards and assign each a correct step, without flagging anything that isn’t a hazard.",
        why:"All six hazards have a step that fixes them, and nothing safe is flagged.",   // module-written
        msgs:{ bananas:"Whole bananas are fine at room temperature.",
          chill:"Colour-checking is a cooking-doneness problem: use a thermometer.",
          fridge:"8 °C is inside the danger zone; the fridge should be 4 °C or colder.",
          // module-written
          none:"Tap a numbered spot, then choose a step. No hazards are tagged yet.",
          decoy:"{name} isn’t a food-safety hazard. Leave it untagged, or tag it “Not a hazard”.",
          step:"One of your tags names a step that doesn’t fix that hazard. Check each tag against what’s wrong.",
          count:"{n} of 6 hazards have a correct step so far. Keep looking." },
        // plan hint 3: "S1–S6; see the step table." (the scene doesn't show the plan's S-numbers, so it lists them)
        hints:["Look for raw meat touching ready-to-eat food.", "Check every temperature you can see.",
          "The six hazards and their steps: chicken on the salad board → Separate; the hand in the salad after raw chicken → Clean; the milk on the counter → Chill; the fridge at 8 °C → Chill; the burger checked by colour → Cook; one dishcloth for meat juice and plates → Clean or Separate."] },
      { id:"tc2", goal:4,
        prompt:"Danger-zone clock: leftover stew starts at 100 (model). It must stay below 1000 before it’s refrigerated. What’s the longest time it can sit at 22 °C?",
        why:"60 minutes is 3 doublings: 100 × 8 = 800, the last count under 1000.",   // module-written
        msgs:{ m80:"1600, which is past 1000.",
          m120:"6400. The 2-hour rule is an upper limit for real food; this model stew needs less.",
          m40:"Safe (400), but not the longest; 60 min gives 800.",
          // module-written
          setup:"Set the clock for the leftover stew: starting count 100, temperature 22 °C.",
          clockMode:"Use the danger-zone clock (not big-batch mode).",
          low:"Safe ({n}), but not the longest.",
          high:"{n}, which is past 1000." },
        hints:["Double every 20 minutes: 200, 400, 800, 1600…", "Which is the last count under 1000?", "800, at 60 minutes."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Danger-zone clock, big-batch mode: a large pot of chili at 60 °C must be cooled to 4 °C. Starting count 100. Choose a cooling method that keeps the count under 10 000.",
        why:"Big batches cooled slowly are a classic cause of " + I("Clostridium perfringens") + " illness. Shallow containers cool fast.",
        msgs:{ fridge:"6 h = 18 doublings: over 26 million. Big pots cool too slowly, even in the fridge.",
          counter:"10 hours in the danger zone.",
          // module-written
          setup:"Switch the clock to big-batch mode, then choose a cooling method." },
        hints:["Convert each time to doublings: 20 minutes each.", "2 h = 6 doublings (6400); 6 h = 18 doublings (far over).", "Shallow containers, or an ice bath and shallow containers."] }
    ],
    // plan "aha"
    blocks:[{ title:"What the kitchen detective shows", html:"<ul><li>Time and temperature multiply risk.</li><li>Cold slows but doesn’t kill.</li><li>Only a thermometer proves doneness.</li><li>Separate and clean stop germs travelling.</li></ul>" }]
  },
  part3:{
    slug:"outbreak", name:"Outbreak", heading:"Outbreak investigation",
    // module-written intro
    intro:"Work like a public-health investigator. Compare who ate what at a potluck, match the symptoms and timing to a pathogen, then see how Canada’s real system tracks outbreaks.",
    stations:[{ id:"rates", t:"1. The potluck" }, { id:"bugs", t:"2. Symptoms and timing" }, { id:"system", t:"3. The real system" }],
    potluck:{
      title:"Station 1: The potluck",
      text:"Forty people attended a community potluck; 20 became ill. Fill in the attack rates (% ill) for each food.",
      // module-written how-to and check messages
      how:"Attack rate = ill ÷ total × 100. Round to the nearest whole number.",
      heads:["Food", "Ate: ill / total", "Ate: % ill", "Didn’t eat: ill / total", "Didn’t eat: % ill"],
      foods:[
        { id:"turkey", t:"Turkey with gravy", ate:[18, 24], not:[2, 16] },
        { id:"green", t:"Green salad", ate:[10, 20], not:[10, 20] },
        { id:"potato", t:"Potato salad", ate:[8, 16], not:[12, 24] },
        { id:"fruit", t:"Fruit tray", ate:[6, 15], not:[14, 25] }],
      msgs:{ empty:"Fill in all eight boxes first, such as 50.", ok:"All eight attack rates are right.", off:"{n} of 8 rates need another look (marked ✗). Attack rate = ill ÷ total × 100.",
        count:"Some boxes hold the number of people who were ill. Divide by the total, then × 100." },
      rule:"The suspect food is the one with the largest gap between eaters and non-eaters.",
      chart:"% ill: ate the food vs didn’t eat it",
      ask:"Which food is the likely source?",
      answer:"turkey",
      // plan T2 feedback lines (module 15) for each pick
      pickFb:{ turkey:"75% vs 12.5%: the biggest gap.", green:"50% vs 50%: no difference.", potato:"50% vs 50%: no difference.", fruit:"Eaters were ill <em>less</em> often." }
    },
    bugs:{
      title:"Station 2: Symptoms and timing",
      notesTitle:"Case notes",
      notes:["Symptoms started about 8–16 hours after the meal.", "Cramps and diarrhea; little vomiting; no fever.", "The turkey was cooked the night before in one large roaster, cooled on the stove, and reheated on low."],
      ask:"Which pathogen card fits every clue?",   // module-written
      rows:{ src:"Typical sources", onset:"Onset", sym:"Symptoms" },
      // Sources are the plan's (§1). VERIFY: every onset and symptom line (Health Canada, n.d.-a); only the C. perfringens
      // onset (8–16 h) comes from the plan. Feedback lines are module-written.
      cards:[
        { id:"salm", t:I("Salmonella"), src:"Poultry and eggs", onset:"About 6–72 hours", sym:"Diarrhea, cramps and fever; sometimes vomiting",
          fb:"Turkey can carry " + I("Salmonella") + ", but it usually brings a fever, and these cases had none. Check the cooling clue too." },
        { id:"noro", t:"Norovirus", src:"Ill food handlers", onset:"About 12–48 hours", sym:"Sudden vomiting, diarrhea and cramps",
          fb:"Norovirus usually brings a lot of vomiting and spreads from ill food handlers. These cases had little vomiting." },
        { id:"perf", t:I("Clostridium perfringens"), src:"Large batches cooled slowly (meat, poultry, gravy, stews)", onset:"About 8–16 hours", sym:"Cramps and diarrhea; vomiting and fever are uncommon",
          fb:"Every clue fits: onset in 8–16 hours, cramps and diarrhea with little vomiting and no fever, and one large roaster cooled slowly on the stove." },
        { id:"list", t:LIS, src:"Deli meats and unpasteurized cheese; grows in the fridge", onset:"Days to weeks (about 3–70 days)", sym:"Fever and muscle aches; can be severe in pregnancy, for older adults and for people with weakened immune systems",
          fb:LIS + " takes days to weeks to cause illness, not 8–16 hours." },
        { id:"botu", t:I("Clostridium botulinum"), src:"Improperly home-canned low-acid foods", onset:"About 12–36 hours", sym:"Blurred or double vision, trouble swallowing, muscle weakness: a medical emergency",
          fb:"Botulism affects the nerves (vision, swallowing, muscle strength) and comes from improperly home-canned low-acid foods. These cases had cramps and diarrhea." }
      ],
      answer:"perf",
      after:M4   // shown once the match is found
    },
    // Station 3 (plan bullets; prose module-written). VERIFY: every line, the roles of PHAC and CFIA, and the references.
    system:{
      title:"Station 3: Check it with data, the real system",
      items:[
        { h:"How Canada detects and investigates outbreaks", html:"Labs identify the pathogen from ill people’s samples and compare its genetic “fingerprint”. When matching cases turn up, provincial public health and the Public Health Agency of Canada investigate together, asking ill people what they ate, just as you compared eaters and non-eaters (Public Health Agency of Canada, n.d.)." },
        { h:"How recalls work", html:"When a food is linked to illness, or another hazard such as an undeclared allergen is found, the Canadian Food Inspection Agency traces the product and issues a recall and a public warning (Canadian Food Inspection Agency, n.d.)." },
        { h:"What to do with a recalled product", html:"Don’t eat it, even if it looks and smells fine. Return it or throw it out, as the notice instructs." },
        { h:"Why reporting illness helps", html:"Each reported case is a data point. The more cases investigators can link, the faster they find the source and stop others from getting sick." }
      ],
      link:"In the potluck, the attack rates pointed to the turkey. Investigators use the same comparison with many more cases."
    },
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Canadian Food Inspection Agency. (n.d.). <i>Food recall warnings and allergy alerts</i>. Government of Canada.</li><li>Health Canada. (n.d.-a). <i>Causes of food poisoning</i>. Government of Canada.</li><li>Health Canada. (n.d.-b). <i>Common food allergens</i>. Government of Canada.</li><li>Health Canada. (n.d.-c). <i>Safe internal cooking temperatures chart</i>. Government of Canada.</li><li>Public Health Agency of Canada. (n.d.). <i>Canada’s foodborne illness outbreak response protocol</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Outbreak quick check", summary:"Outbreak quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:5, prompt:"Attack rate among turkey eaters?",
          choices:[{ t:"75%", ok:true, fb:"Right. 18 ill out of 24 who ate it." }, { t:"18%", fb:"18 ill out of 24 who ate it." }, { t:"45%", fb:"18 ill out of 24 who ate it." }, { t:"24%", fb:"18 ill out of 24 who ate it." }] },
        { id:"q2", goal:5, prompt:"Why isn’t green salad the suspect?",
          choices:[{ t:"Same % ill whether eaten or not", ok:true, fb:"Right. 50% vs 50%: no difference." }, { t:"It’s healthy", fb:"50% vs 50%: no difference." }, { t:"Few people ate it", fb:"50% vs 50%: no difference." }, { t:"It was cold", fb:"50% vs 50%: no difference." }] },
        { id:"q3", goal:[2, 5], prompt:"Symptoms began 12 hours after the meal. Why can’t you just blame breakfast that morning?",
          choices:[{ t:"Onset depends on the pathogen; this one fits the potluck", ok:true, fb:"Right. Onset times vary by pathogen." }, { t:"Breakfast is always safe", fb:"Onset times vary by pathogen." }, { t:"Symptoms start instantly", fb:"Onset times vary by pathogen." }, { t:"You can’t know anything", fb:"Onset times vary by pathogen." }] },
        { id:"q4", goal:5, prompt:"A recall notice matches a product in your fridge. Best action?",
          choices:[{ t:"Don’t eat it; follow the notice to return or discard it", ok:true, fb:"Right. Recalled food may look and smell fine." }, { t:"Cook it longer", fb:"Recalled food may look and smell fine." }, { t:"Smell-test it", fb:"Recalled food may look and smell fine." }, { t:"Give it away", fb:"Recalled food may look and smell fine." }] }
      ]
    }
  },
  practice:{
    activities:[
      // Plan: N6 matching, 8 pairs. The plan's mismatch feedback names wrong partners "water", "ice" and "catch it"; three
      // decoy cards (module-written texts) make those wrong partners tappable. Water-based responses also give the M7 line.
      // VERIFY: every first-aid step (current Canadian first-aid guidance), incl. burn-cooling and eye-flushing times.
      { id:"accidents", type:"match", title:"Kitchen accident ↔ first response", summary:"Accident ↔ first response", goal:6,
        instruction:"Match each kitchen situation to its first response. Three cards on the right have no partner. <strong>This isn’t first-aid training:</strong> a certified first-aid course teaches these skills properly.",
        leftTitle:"Situation", rightTitle:"First response",
        left:[
          { id:"l1", t:"Grease fire in a pan" },
          { id:"l2", t:"Minor burn from a hot pan" },
          { id:"l3", t:"Small cut from a knife" },
          { id:"l4", t:"Fire inside the oven" },
          { id:"l5", t:"Liquid spilled on the floor" },
          { id:"l6", t:"A knife slipping off the counter" },
          { id:"l7", t:"Someone in contact with a sparking appliance",
            hints:["What happens if you touch someone in contact with current?", "You can be shocked too.", "Cut the power first, if safe."] },
          { id:"l8", t:"Cleaning product splashed in an eye" }
        ],
        right:[
          { id:"r1", t:"Turn off the heat, cover with a lid; never water. If it spreads, get out and call 911" },
          { id:"r2", t:"Cool under cool running water; no ice, butter or creams" },
          { id:"r3", t:"Firm pressure with a clean cloth, then a bandage; seek care if deep" },
          { id:"r4", t:"Keep the door closed and turn off the oven" },
          { id:"r5", t:"Wipe it up immediately and warn others" },
          { id:"r6", t:"Step back and let it fall; never catch it" },
          { id:"r7", t:"Don’t touch them; cut the power at the source if safe, and call for help" },
          { id:"r8", t:"Flush with lukewarm running water and get help" },
          { id:"rw", t:"Throw water on it" },
          { id:"ri", t:"Put ice on it" },
          { id:"rc", t:"Catch it before it lands" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|rw":"Water makes burning oil spatter and spread.", "l1|r2":"Water makes burning oil spatter and spread.", "l1|r8":"Water makes burning oil spatter and spread.",
          "l4|rw":"Water makes burning oil spatter and spread.",
          "l2|ri":"Ice can damage skin further.",
          "l6|rc":"Catching a falling knife causes deep cuts." },
        wrongDefault:"Ask what stops this hazard without creating a new one." },   // module-written
      // Plan: ★ non-routine set, 6 items, number entry and chips (D6 is an N5 ordering). Custom so all six sit in one set.
      // Chip distractors for D3 and D5 are module-written; D1 alone has plan hints.
      { id:"decisions", type:"custom", title:"Food-safety decisions", summary:"Food-safety decisions", star:true, goal:[1, 2, 3, 4],
        instruction:"Six decisions. The ★ items are non-routine: name a risk, plan a fair test, put a routine in order.",
        how:"Type a number and press Check, or tap your choices. Units like °C are optional.",
        items:[
          { id:"d1", kind:"num", goal:4, prompt:"Model: start 25, 22 °C for 1 hour 40 minutes. Count?", answer:800, label:"Count",
            wrong:[{ match:400, fb:"1 h 40 min = 5 doublings: 25 × 32." }], wrongDefault:"Count the 20-minute blocks, then double that many times.",   // module-written default
            why:"1 h 40 min = 5 doublings: 25 × 32 = 800.",
            hints:["How many 20-minute blocks are in 1 h 40 min?", "5.", "25 × 2⁵ = 800."] },
          // VERIFY: 82 °C for whole poultry (plan prompt adds "(verify)").
          { id:"d2", kind:"num", goal:1, prompt:"Safe internal temperature for whole poultry?", answer:82, unit:"°C", label:"Temperature",
            wrong:[{ match:74, fb:"That’s for pieces." }], wrongDefault:"Check the safe internal temperature table in Explore.",   // module-written default
            why:"Whole poultry needs 82 °C." },
          { id:"d3", kind:"chips", star:true, goal:1, prompt:"A fridge reads 7 °C. Name the risk and the fix.",
            groups:[
              { id:"risk", label:"Risk", choices:[{ t:"In the danger zone: bacteria can multiply", ok:true }, { t:"Too cold: food will freeze" }, { t:"No risk: 7 °C is cold enough" }] },
              { id:"fix", label:"Fix", choices:[{ t:"Lower the setting to 4 °C or colder", ok:true }, { t:"Raise the setting" }, { t:"Leave it; eat food sooner" }] }],
            fb:"7 °C lets bacteria multiply.",
            why:"In the danger zone; lower the setting to 4 °C or colder." },
          // VERIFY: Listeria can cross the placenta (plan feedback adds "(verify)").
          { id:"d4", kind:"chips", star:true, goal:2, prompt:"Which group is at highest risk from " + LIS + "?",
            groups:[{ id:"who", label:"Group", choices:[{ t:"Pregnant people", ok:true }, { t:"Teen athletes" }, { t:"Office workers" }, { t:"Young adults" }] }],
            fb:LIS + " can cross the placenta.",
            why:"Pregnant people (also older adults and people with weakened immune systems)." },
          { id:"d5", kind:"chips", star:true, inquiry:true, goal:3, prompt:"Plan a fair test: does washing hands for 20 seconds reduce bacteria more than 5 seconds? Pick the independent variable, the dependent variable and one controlled variable.",
            groups:[
              { id:"iv", label:"Independent variable", choices:pool(0) },
              { id:"dv", label:"Dependent variable", choices:pool(1) },
              { id:"cv", label:"Controlled variable", choices:pool(2) }],
            fb:"Change only the washing time; keep everything else the same.",
            why:"IV: washing time · DV: bacterial colonies on a swab plate · Control: same soap and water temperature." },
          { id:"d6", kind:"order", star:true, goal:3, prompt:"A peanut-free table at a bake sale: put the steps in order.",
            steps:["Wash hands", "Clean the surface with hot soapy water", "Use separate utensils", "Label the ‘Contains’ allergens", "Store the peanut-free items apart"],
            start:[3, 1, 4, 0, 2],
            fb:"Cleaning and separating come before serving and labelling.",
            why:"Wash hands → clean the surface with hot soapy water → use separate utensils → label the ‘Contains’ allergens → store the peanut-free items apart." }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Oluwaseun", goal:[3, 4], how:"",
        instruction:"Oluwaseun made one mistake in each plan. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          // VERIFY: cold-water thawing (change every 30 minutes) and 74 °C (plan fix adds "verify").
          { id:"e1", goal:3, task:"Prepare frozen chicken thighs for dinner.",
            steps:["“Take the chicken out of the freezer in the morning.”", "“Leave it on the counter all day to thaw.”", "“Cook it until the juices look clear.”", "“Serve with salad.”"],
            answer:1, stepFb:["Step 1 is fine.", "", "Step 3 is also unsafe, but the first mistake is earlier.", "The salad isn’t the issue."],
            fixes:[
              { t:"“Thaw it in the fridge (or in cold water changed every 30 minutes), then cook to 74 °C, checked with a thermometer.”", ok:true, why:M6 },
              { t:"“Thaw in warm water.”", why:"Warm water puts the outside in the danger zone." },
              { t:"“It’s fine because it’s frozen at first.”", why:M6 },
              { t:"Step 2 is correct.", why:"Counter thawing warms the outside into the danger zone." }],
            hints:["Where does the outside of the chicken sit all day?", "In the danger zone.", "Thaw in the fridge."] },
          { id:"e2", goal:4, task:"Store a big pot of leftover rice and beans.",
            steps:["“Turn off the stove after dinner.”", "“Leave the full pot on the stove overnight to cool.”", "“Put it in the fridge in the morning.”", "“Reheat it to 74 °C at lunch, so it’s safe.”"],
            answer:1, stepFb:["Step 1 is fine.", "", "Too late; the mistake was before this.", "Reheating doesn’t remove heat-stable toxins."],
            fixes:[
              { t:"“Within 2 hours, divide it into shallow containers and refrigerate.”", ok:true, why:M3 },
              { t:"“Put the full hot pot in the freezer.”", why:"A big pot still cools slowly, and it warms the freezer." },
              { t:"“Reheat it longer tomorrow.”", why:M3 },
              { t:"Step 2 is correct.", why:"Hours in the danger zone let bacteria grow and make toxins." }],
            hints:["How long does a big pot spend in the danger zone overnight?", "Many hours.", "Shallow containers, into the fridge within 2 hours."] },
          { id:"e3", goal:3, task:"Make a nut-free lunch after making a peanut butter sandwich.",
            steps:["“Make the peanut butter sandwich first.”", "“Wipe the knife on a paper towel.”", "“Use the same knife to spread jam for the nut-free sandwich.”", "“Pack both in the same bag.”"],
            answer:1, stepFb:["Order doesn’t matter if cleanup is right.", "", "This follows from the inadequate cleaning in step 2.", "Also a cross-contact risk."],
            fixes:[
              { t:"“Wash the knife and board with hot, soapy water (or use clean ones), wash hands, and pack the nut-free sandwich separately.”", ok:true, why:M5 },
              { t:"“Wipe twice.”", why:M5 },
              { t:"“Rinse the knife under cold water.”", why:M5 },
              { t:"Step 2 is correct.", why:"Wiping leaves peanut protein behind." }],
            hints:["Does wiping remove allergen proteins?", "No; it smears them.", "Wash, or use clean tools; pack separately."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:'<div class="hfa-support" role="note"><p>' + ADVICE + "</p></div>" }],
    journal:[
      { id:"j1", q:"What surprised you most: the doubling clock, the colour myth, or the outbreak data?" },
      { id:"j2", q:"In your own words, why do time and temperature together decide risk?" },
      { id:"j3", q:"Explain to a friend how to keep a nut-free lunch truly nut-free." },
      { id:"j4", q:"Which food-safety habit in your own kitchen would you like to change, and how will you remember it?" }
    ]
  },
  final:{
    questions:[
      // VERIFY: danger zone and freezer temperature (plan prompts add "(verify)").
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the danger zone?",
          options:[
            { t:"4 °C to 60 °C", ok:true, why:"Bacteria multiply fastest between 4 °C and 60 °C." },   // module-written
            { t:"0 °C to 100 °C", why:"Too wide; the risky range is 4–60 °C." },
            { t:"−18 °C to 4 °C", why:"That’s frozen to fridge: the safe cold range." },
            { t:"60 °C to 100 °C", why:"That’s the hot-holding and cooking range." }] },
        b:{ prompt:"How cold should a freezer be?",
          options:[
            { t:"−18 °C or colder", ok:true, why:"Freezer −18 °C or colder; fridge 4 °C or colder." },   // module-written (refresher)
            { t:"4 °C", why:"That’s the fridge." },
            { t:"0 °C", why:"Water freezes there, but freezers should be colder." },
            { t:"−5 °C", why:"Not cold enough." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which pathogen can grow at refrigerator temperatures and is linked to deli meats and unpasteurized cheese?",
          options:[
            { t:I("Listeria monocytogenes"), ok:true, why:M2 },
            { t:I("Clostridium botulinum"), why:"Linked to improperly home-canned low-acid foods." },
            { t:"Norovirus", why:"Spread mostly by ill food handlers; it doesn’t grow in food." },
            { t:I("Salmonella"), why:"Linked mostly to poultry and eggs." }] },
        b:{ prompt:"Improperly home-canned low-acid foods are most linked to…",
          options:[
            { t:I("Clostridium botulinum") + " (botulism)", ok:true, why:"Botulism comes from improperly home-canned low-acid foods; it’s a medical emergency." },   // module-written (flashcard 9)
            { t:LIS, why:"Linked to deli meats and soft cheese." },
            { t:I("E. coli") + " O157:H7", why:"Linked to undercooked ground beef." },
            { t:"Norovirus", why:"Linked to ill food handlers." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"‘Use one cutting board for raw meat and another for vegetables.’ Which step is this?",
          options:[
            { t:"Separate", ok:true, why:"Separating keeps raw meat away from ready-to-eat food." },   // module-written
            { t:"Clean", why:"Cleaning is washing; this is keeping foods apart." },
            { t:"Cook", why:"Not about temperature." },
            { t:"Chill", why:"Not about cold storage." }] },
        // module-written feedback for the three wrong steps (plan lists them without feedback)
        b:{ prompt:"‘Check the burger with a food thermometer.’ Which step is this?",
          options:[
            { t:"Cook", ok:true, why:M1 },
            { t:"Clean", why:"Cleaning is washing; this is checking doneness." },
            { t:"Separate", why:"Separating keeps foods apart; this is checking doneness." },
            { t:"Chill", why:"Not about cold storage." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Model: a dish starts with 50 bacteria and sits at 25 °C for 1 hour 20 minutes. How many now?",
          options:[
            { t:"800", ok:true, why:"4 doublings: 50 × 16." },
            { t:"400", why:"That’s 3 doublings." },
            { t:"200", why:"That’s adding, not doubling." },
            { t:"1600", why:"That’s 5 doublings." }] },
        b:{ prompt:"Model: a dish starts with 200 bacteria and sits at 30 °C for 1 hour. How many now?",
          options:[
            { t:"1600", ok:true, why:"3 doublings: 200 × 8." },
            { t:"800", why:"That’s 2 doublings." },
            { t:"600", why:"That’s adding, not doubling." },
            { t:"3200", why:"That’s 4 doublings." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Potluck data (model): turkey eaters 18/24 ill, non-eaters 2/16; salad eaters 10/20, non-eaters 10/20; fruit eaters 6/15, non-eaters 14/25. Which food is the most likely source?",
          options:[
            { t:"Turkey", ok:true, why:"75% vs 12.5%: the biggest gap." },
            { t:"Salad", why:"50% vs 50%: no difference." },
            { t:"Fruit", why:"Eaters were ill <em>less</em> often." },
            { t:"Can’t tell", why:"The attack-rate gap points clearly to turkey." }] },
        b:{ prompt:"Picnic data (model): chicken skewers eaters 12/18 ill, non-eaters 3/12; rice eaters 8/16, non-eaters 7/14; cake eaters 6/14, non-eaters 9/16. Most likely source?",
          options:[
            { t:"Chicken skewers", ok:true, why:"About 67% vs 25%: the biggest gap." },
            { t:"Rice", why:"50% vs 50%." },
            { t:"Cake", why:"Eaters were ill <em>less</em> often." },
            { t:"Can’t tell", why:"The gap identifies the skewers." }] } },
      // VERIFY: health-agency advice to pregnant people (plan prompt adds "(verify)").
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Why do health agencies warn pregnant people specifically about deli meats and unpasteurized soft cheeses?",
          options:[
            { t:"These foods can carry " + LIS + ", which grows in the fridge and can harm the fetus", ok:true, why:M2 },
            { t:"These foods are high in calories", why:"Not the safety issue." },
            { t:"These foods cause allergies", why:"Not the main concern here." },
            { t:"Fridges kill " + LIS + ", so it’s only room-temperature foods", why:M2 }] },
        b:{ prompt:"Cooked rice sat out all day, then was reheated to 74 °C. Why might it still make people sick?",
          options:[
            { t:"Some bacteria form toxins that reheating doesn’t destroy", ok:true, why:M3 },
            { t:"74 °C is too cold to kill bacteria", why:"74 °C is the leftover target; the problem is toxins." },
            { t:"Rice is always unsafe", why:"Rice is safe if it’s cooled promptly." },
            { t:"Reheating adds new bacteria", why:"Not how it works." }] } },
      // VERIFY: 71 °C (option A) and turkey thawing time in the fridge (version B).
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which explanation best tells a friend why a brown burger might still be unsafe?",
          options:[
            { t:"“Ground meat can turn brown before it reaches a safe temperature. Only a thermometer reading of 71 °C shows it’s safe.”", ok:true, why:M1 },
            { t:"“Brown means it’s done.”", why:M1 },
            { t:"“Pink means it’s always unsafe.”", why:"Colour isn’t reliable either way." },
            { t:"“Cut it in half and look closer.”", why:M1 }] },
        b:{ prompt:"Which instruction for thawing a turkey is clearest and safest?",
          options:[
            { t:"“Thaw it in the fridge, allowing about a day for every few kilograms, and keep it on a tray on the bottom shelf.”", ok:true, why:"The fridge keeps every part of the turkey out of the danger zone, and the tray stops juices dripping onto other food." },   // module-written
            { t:"“Leave it on the counter overnight.”", why:M6 },
            { t:"“Thaw it in hot water.”", why:"Warms the surface into the danger zone." },
            { t:"“Cook it frozen, until it looks done.”", why:M1 }] } },
      // VERIFY: heat and allergen proteins (version A option feedback).
      { id:"c2", cat:"C", goal:[3, 6],
        a:{ prompt:"Which is the best explanation of allergen cross-contact?",
          options:[
            { t:"“Tiny amounts of an allergen can move to another food through shared tools, surfaces or hands, and can trigger a reaction, so wash tools with hot soapy water or use separate ones.”", ok:true, why:"Traces can cause reactions, so wash, don’t wipe." },   // module-written (flashcard 10)
            { t:"“Cooking destroys allergens.”", why:"Heat doesn’t remove most allergen proteins." },
            { t:"“Wiping the knife is enough.”", why:M5 },
            { t:"“Only eating the allergen directly matters.”", why:"Traces can cause reactions." }] },
        b:{ prompt:"Which is the best instruction for a grease fire in a pan?",
          options:[
            { t:"“Turn off the heat and slide a lid over the pan. Never use water. If it spreads, leave and call 911.”", ok:true, why:M7 },
            { t:"“Throw water on it.”", why:M7 },
            { t:"“Carry the pan outside.”", why:"Spills burning oil." },
            { t:"“Fan it to cool it.”", why:"Feeds the fire with air." }] } },
      // VERIFY: the 2-hour and 1-hour (above 32 °C) rules (version B).
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A caterer cooks 20 L of soup for tomorrow’s event. Which plan is safest?",
          options:[
            { t:"Divide it into shallow containers, cool quickly (an ice bath helps), and refrigerate within 2 hours; reheat to 74 °C tomorrow", ok:true, why:"Shallow containers cool fast, an ice bath speeds cooling, and 74 °C is the reheating target." },   // module-written (flashcard 6)
            { t:"Leave the pot on the stove overnight", why:"Hours in the danger zone. " + M3 },
            { t:"Put the full pot straight in the fridge", why:"Big pots cool too slowly." },
            { t:"Keep it at 40 °C all night", why:"That’s in the danger zone." }] },
        b:{ prompt:"A class picnic will last 4 hours on a hot day. Which plan keeps the chicken salad safe?",
          options:[
            { t:"Keep it in a cooler with ice packs at 4 °C or colder, take out only what’s served, and discard anything left out more than 2 hours (1 hour above 32 °C)", ok:true, why:"Cold food stays cold, and the time limit caps how long anything sits in the danger zone." },   // module-written
            { t:"Leave it on the table all afternoon", why:"Hours in the danger zone." },
            { t:"Cover it with a cloth in the sun", why:"Still in the danger zone." },
            { t:"Add extra mayonnaise", why:"That doesn’t change the time and temperature risk." }] } },
      // VERIFY: freezing and norovirus (version A); burn-cooling time (version B).
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"You learn that a brand of frozen berries in your freezer has been recalled for possible norovirus. What should you do?",
          options:[
            { t:"Don’t eat them; follow the recall instructions to return or discard them, and wash any surfaces they touched", ok:true, why:"Recalled food may look and smell fine." },   // module-written (quick check Q4)
            { t:"Cook them in a smoothie", why:"Blending doesn’t cook; follow the recall." },
            { t:"Eat them if they look fine", why:"Contamination isn’t visible." },
            { t:"Keep them frozen; freezing kills viruses", why:"Freezing doesn’t kill norovirus." }] },
        b:{ prompt:"During a class cooking lab, a student’s sleeve catches a hot burner and the student burns a hand. Best first response?",
          options:[
            { t:"Turn off the burner, cool the burn under cool running water, and tell the teacher", ok:true, why:"Stop the heat, cool the burn right away, and get help." },   // module-written
            { t:"Put ice on it", why:"Ice can damage skin." },
            { t:"Apply butter", why:"It traps heat." },
            { t:"Keep cooking and check it later", why:"Burns need cooling right away." }] } }
    ]
  },
  task:{
    title:"Safe potluck plan", summary:"Safe potluck plan",
    statement:"<p>You’re bringing a chicken and rice casserole with a creamy sauce (milk, wheat flour) to a school potluck. Build a plan that meets every food-safety condition. There’s more than one safe plan. Can you find them all?</p><ol class=\"fs-tklist\"><li>Thaw the chicken safely.</li><li>Cook to a safe internal temperature.</li><li>Keep it out of the danger zone on the way there.</li><li>Cool the leftovers fast.</li><li>Label the allergens correctly.</li></ol>",
    // VERIFY: 74 °C for poultry mixtures (check 2, tip 2).
    checks:["Thawed safely", "Cooked to a safe temperature", "Out of the danger zone in transit", "Leftovers cooled fast", "Allergens labelled"],
    tips:["Counter thawing puts the outside in the danger zone.", "Poultry mixtures need 74 °C.", "Hot food stays hot (60 °C or hotter), or cold food stays cold (4 °C or colder) and is reheated.", "Deep pots cool too slowly.", "Check the recipe: the sauce has milk; the flour is wheat."],
    explainPrompt:"Explain how your plan keeps the casserole out of the danger zone at every stage, and why the allergen card matters at a potluck.",
    vocab:"Use the words danger zone, internal temperature, cross-contact and shallow containers.",
    checkLabel:"Check my plan",
    success:"This plan meets every food-safety condition.",   // module-written
    more:"There’s more than one safe plan. Can you find another?",
    after3:"There are 12 safe plans. Every one keeps the food out of the danger zone at each stage: thaw, cook, carry, store.",
    // Inputs (plan table). Valid answers: exactly 12 of the 432 combinations (checked in the module's test).
    rows:[
      { id:"thaw", t:"Thaw", stage:"Thaw", opts:[
        { id:"fridge", t:"Fridge", short:"fridge" },
        { id:"water", t:"Cold water changed every 30 min", short:"cold water" },
        { id:"counter", t:"Counter", short:"counter" },
        { id:"micro", t:"Microwave, then cook right away", short:"microwave then cook" }] },
      { id:"temp", t:"Final internal temperature", stage:"Cook", opts:[
        { id:"63", t:"63 °C", short:"63 °C" }, { id:"71", t:"71 °C", short:"71 °C" }, { id:"74", t:"74 °C", short:"74 °C" }, { id:"82", t:"82 °C", short:"82 °C" }] },
      { id:"move", t:"Transport", stage:"Carry", opts:[
        { id:"hot", t:"Insulated hot carrier (kept at 60 °C or hotter)", short:"hot carrier" },
        { id:"room", t:"Room temperature for 3 h", short:"room temperature 3 h" },
        { id:"cool", t:"Cooler at 4 °C or colder, then reheated to 74 °C on site", short:"cooler then reheat" }] },
      { id:"left", t:"Leftovers", stage:"Store", opts:[
        { id:"shallow", t:"Shallow containers in the fridge within 2 h", short:"shallow containers" },
        { id:"deep", t:"Deep pot in the fridge", short:"deep pot" },
        { id:"out", t:"Left out overnight", short:"left out overnight" }] },
      { id:"card", t:"Allergen card", stage:"Label", opts:[
        { id:"mw", t:"“Contains: milk, wheat”", short:"milk, wheat" },
        { id:"none", t:"“No allergens”", short:"no allergens" },
        { id:"milk", t:"“Contains: milk”", short:"“Contains: milk”" }] }
    ],
    dish:"Chicken and rice casserole",
    // Optional kitchen card (course plan §1, strand E). Lines are module-written; the plan lines come from the choices.
    // VERIFY: the hygiene and leftover lines.
    kitchen:{ title:"Safe potluck plan: chicken and rice casserole", label:"Save my plan as a kitchen card", file:"kitchen-card-safe-potluck-plan.txt",
      top:["Dish: chicken and rice casserole with a creamy sauce (milk, wheat flour).", "## My plan"],
      bottom:["## Every stage", "- Wash your hands with soap for at least 20 seconds before you start and after touching raw chicken.",
        "- Use one cutting board for raw chicken and another for ready-to-eat food, or wash the board with hot, soapy water between them.",
        "- Check the temperature with a food thermometer in the thickest part, not by colour.",
        "- Serve with a clean spoon, and keep the allergen card beside the dish."] }
  },
  cards:[
    ["The four steps", "Clean, separate, cook, chill."],
    // VERIFY: cards 2–5 and 8 (plan "(verify)").
    ["Danger zone", "4 °C to 60 °C: where bacteria multiply fastest."],
    ["Fridge and freezer", "Fridge 4 °C or colder; freezer −18 °C or colder."],
    ["The 2-hour rule", "Refrigerate perishable food within 2 hours."],
    ["Doneness", "Use a thermometer, not colour: ground beef 71 °C, poultry pieces 74 °C, whole poultry 82 °C."],
    ["Cooling big batches", "Divide into shallow containers; an ice bath speeds cooling."],
    [LIS, "Grows in the fridge; deli meats, unpasteurized cheese; high risk in pregnancy."],
    [I("C. perfringens"), "Large batches cooled slowly; cramps and diarrhea within about 8–16 h."],
    ["Botulism", "Improperly home-canned low-acid foods; a medical emergency."],
    ["Cross-contact", "Allergen traces moved by tools, surfaces or hands; wash, don’t wipe."],
    ["Attack rate", "% of people ill among those who ate a food: compare eaters and non-eaters."],
    ["Grease fire", "Heat off, lid on, never water."]
  ]
};
