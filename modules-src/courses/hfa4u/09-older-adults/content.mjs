// HFA4U 09 Older Adult Nutrition. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/09-older-adults.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Food pool and Part 3 values are model data (labelled on screen). No Calories anywhere (plan §5 Language).
// Care note (plan §1 teacher note, §6 risk 4): personas only; journal prompts stay about learning, not family experience.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
// module-written, from the plan's teacher note and course plan §2 ("health information, not advice")
const ADVICE = "Health information here is general. It is not advice for any particular person. For your own health, or a family member’s, talk to a doctor, nurse, pharmacist or registered dietitian.";

// Misconception core sentences (plan §3)
const M1 = "Energy needs fall, but needs for vitamin D, calcium and B12 don’t. That’s why every bite has to count.";
const M2 = "The thirst signal weakens with age. Drinking regularly, and eating foods with lots of water like soups and fruit, prevents dehydration.";
const M3 = "Keep the protein; change the texture: lentil soup, eggs, fish, tofu, yogurt.";
// VERIFY: Health Canada's advice of a daily 400 IU (10 µg) vitamin D supplement for adults over 50.
const M4 = "Health Canada advises adults over 50 to take a daily 400 IU (10 µg) vitamin D supplement as well as eating well.";
const M5 = "Eating alone and having a tight budget both lower intake. Shared meals, community programs and low-cost nutrient-dense foods help.";
const M6 = "Herbs, spices, citrus and garlic add flavour without the sodium that raises blood pressure.";
const M7 = "Read the label. Some help (fortified, easy to open); some cost more for little extra nutrition.";

// ---------- food pool (30 items; model values: vitamin D in model µg, cost in model dollars) ----------
// tex soft | moderate | hard · p protein · ca calcium-rich · d vitamin D (model µg) · b12 dairy | fortified | animal | "" ·
// fl fluid-rich · grp vf vegetables and fruits | wg whole grains | pf protein foods | mx mixed dishes | dr drinks ·
// flags: meat, fish, egg (for the vegetarian / lacto-vegetarian tags), simple ("no-cook or simple"), halal ("halal option"), takeout.
const f = (id, t, tex, p, ca, d, b12, fl, cost, grp, flags, extra) => Object.assign({ id, t, tex, p:!!p, ca:!!ca, d, b12, fl:!!fl, cost, grp,
  meat:/\bmeat\b/.test(flags), fish:/\bfish\b/.test(flags), egg:/\begg\b/.test(flags), simple:/\bsimple\b/.test(flags), halal:/\bhalal\b/.test(flags), takeout:/\btakeout\b/.test(flags) }, extra || {});
const POOL = [
  // the plan's 18 items (plan table, model values)
  f("milk", "Fortified milk, 1 cup", "soft", 1, 1, 3, "dairy", 1, 0.40, "dr", "simple"),
  f("soy", "Fortified soy beverage, 1 cup", "soft", 1, 1, 2, "fortified", 1, 0.50, "dr", "simple"),
  f("yogurt", "Plain yogurt, ¾ cup", "soft", 1, 1, 0, "dairy", 0, 0.70, "pf", "simple"),
  f("salmon", "Baked salmon, 75 g", "soft", 1, 0, 10, "animal", 0, 3.00, "pf", "fish"),
  f("eggs", "Scrambled eggs (2)", "soft", 1, 0, 2, "animal", 0, 0.80, "pf", "egg simple"),
  f("lsoup", "Lentil and vegetable soup, 1 bowl", "soft", 1, 0, 0, "", 1, 0.90, "mx", ""),
  f("dal", "Dal with soft rice", "soft", 1, 0, 0, "", 0, 1.00, "mx", ""),
  f("paneer", "Paneer curry (soft)", "soft", 1, 1, 0, "dairy", 0, 1.80, "mx", ""),
  f("tofu", "Soft tofu stir-fry", "soft", 1, 1, 0, "", 0, 1.50, "mx", "", { caNote:"calcium-set" }),
  f("cereal", "Fortified breakfast cereal with milk", "moderate", 1, 1, 3, "fortified", 1, 0.90, "wg", "simple"),
  f("oatmeal", "Oatmeal made with milk", "soft", 1, 1, 3, "dairy", 1, 0.60, "wg", "simple"),
  f("peaches", "Canned peaches in juice", "soft", 0, 0, 0, "", 1, 0.50, "vf", "simple"),
  f("banana", "Banana", "soft", 0, 0, 0, "", 0, 0.30, "vf", "simple"),
  f("carrots", "Raw carrot sticks", "hard", 0, 0, 0, "", 0, 0.30, "vf", "simple"),
  f("steak", "Grilled steak", "hard", 1, 0, 0, "animal", 0, 4.00, "pf", "meat"),
  f("nuts", "Mixed nuts", "hard", 1, 0, 0, "", 0, 1.00, "pf", "simple"),
  f("tea", "Herbal tea", "soft", 0, 0, 0, "", 1, 0.10, "dr", "simple"),
  f("water", "Water, 1 glass", "soft", 0, 0, 0, "", 1, 0.00, "dr", "simple"),
  // VERIFY: the 12 items below and all their values are module-written (the plan's full pool is "in the build data").
  // The plan's sample plans use soft cooked vegetables, toast and a canned fish sandwich; the rest widen the choice.
  f("vegs", "Soft-cooked vegetables (frozen mix), ½ cup", "soft", 0, 0, 0, "", 0, 0.40, "vf", "simple"),
  f("toast", "Whole-grain toast, 2 slices", "moderate", 0, 0, 0, "", 0, 0.40, "wg", "simple"),
  f("pbtoast", "Whole-grain toast with peanut butter", "moderate", 1, 0, 0, "", 0, 0.60, "wg", "simple"),
  f("fishsand", "Canned fish sandwich (tuna or salmon)", "moderate", 1, 0, 2, "animal", 0, 2.00, "mx", "fish simple"),
  f("chicken", "Braised chicken in sauce", "soft", 1, 0, 0, "animal", 0, 2.00, "pf", "meat halal"),
  f("chsoup", "Chicken noodle soup (lower sodium)", "soft", 1, 0, 0, "animal", 1, 1.20, "mx", "meat simple halal"),
  f("beanstew", "Bean and sweet potato stew", "soft", 1, 0, 0, "", 1, 1.00, "mx", ""),
  f("congee", "Congee (rice porridge) with soft tofu", "soft", 1, 0, 0, "", 1, 0.80, "mx", ""),
  f("cheese", "Cheddar cheese, 2 slices", "moderate", 1, 1, 0, "dairy", 0, 0.70, "pf", "simple"),
  f("orange", "Orange slices", "moderate", 0, 0, 0, "", 1, 0.40, "vf", "simple"),
  f("apples", "Unsweetened applesauce", "soft", 0, 0, 0, "", 0, 0.40, "vf", "simple"),
  f("burger", "Takeout burger and fries", "moderate", 1, 0, 0, "animal", 0, 6.00, "mx", "meat takeout")
];

export default {
  id:"09-older-adults",
  kind:"topic",
  title:"Older adult nutrition",
  topic:"Older Adult Nutrition",
  readyTopic:"older adult nutrition",
  hero:{
    headline:"Fewer calories, same nutrients: every bite counts.",
    text:"As we age, the body usually needs a little less <strong>energy</strong> but just as much, or more, of key <strong>nutrients</strong> like vitamin D, calcium and vitamin B12. Normal changes in <strong>thirst</strong>, <strong>taste</strong>, <strong>chewing</strong> and <strong>muscle</strong> shape what older adults eat, and so do living alone, income and medications. <strong>Nutrient-dense</strong> meals that fit a person’s culture, budget and texture needs make the difference.",
    fig:{ html:'<div class="oa-hero" id="oa-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A balance with two pans. An age dial turns from 50 to 85. On the left pan, labelled “Energy needed”, one weight shrinks a little. On the right pan, labelled “Nutrients needed”, the weights for vitamin D, calcium, vitamin B12 and protein stay the same or grow, so the balance tips toward nutrients. Then a plate slides in with lentil soup, a glass of fortified milk and orange slices.",
    caption:"Small plate, big nutrition."
  },
  goals:[
    "I can explain why energy needs usually fall with age while many nutrient needs stay the same or rise.",
    "I can describe normal age-related body changes (thirst, taste and smell, chewing, B12 absorption, muscle, bone) and how each affects nutrition.",
    "I can identify nutrients of special concern for older adults (vitamin D, calcium, vitamin B12, protein, fibre, fluids) and foods rich in them.",
    "I can explain how social, economic and health factors (living alone, income, medications) affect older adults’ eating.",
    "I can evaluate food products and services marketed to older adults.",
    "I can plan a meal that fits an older adult’s texture, culture, budget and nutrient needs."
  ],
  start:{
    // module-written care note (plan §1 teacher note; §6 risk 4)
    blocks:[{ html:SUPPORT }, { title:"Before you start", html:"<p>Many of us live with, care for or miss an older relative. This module uses fictional people, and it talks about older adults with respect. " + ADVICE + "</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Nutrient functions", goal:3,
          prompt:"Which pair of nutrients works together most directly to build and keep strong bones?",
          options:[
            { t:"Calcium and vitamin D", ok:true, why:"Vitamin D helps the body absorb calcium, and calcium is the main mineral in bone." },
            { t:"Vitamin C and iron", why:"Vitamin C helps iron absorption, which matters for blood, not mainly bones." },
            { t:"Sodium and potassium", why:"These balance fluids and nerve signals." },
            { t:"Fibre and water", why:"These help digestion, not bone mineral." }],
          hints:["Which mineral makes bones hard?", "Which vitamin helps you absorb it?", "Calcium and vitamin D."] },
        { id:"w2", skill:"Nutrient functions", goal:3,
          prompt:"Vitamin B12 is needed mainly for…",
          options:[
            { t:"healthy nerves and making red blood cells", ok:true, why:"A shortage can cause anemia and nerve problems." },
            { t:"seeing in dim light", why:"That’s vitamin A." },
            { t:"clotting blood", why:"That’s vitamin K." },
            { t:"building tooth enamel", why:"That’s mainly calcium, phosphorus and fluoride." }],
          hints:["It’s a B vitamin found mostly in animal foods and fortified foods.", "Think blood and nerves.", "Red blood cells and nerves."] },
        // VERIFY: the RDA covers about 97–98% of healthy people (hint 2).
        { id:"w3", skill:"Canada’s Food Guide and the DRIs", goal:1,
          prompt:"In the DRIs, what does an RDA tell you?",
          options:[
            { t:"The daily intake that meets the needs of nearly all healthy people in a life-stage group", ok:true, why:"It’s set above the average requirement (the EAR)." },
            { t:"The most anyone should ever eat", why:"That’s the UL (tolerable upper intake level)." },
            { t:"The exact amount every individual needs", why:"Needs vary; the RDA covers nearly everyone in a group." },
            { t:"The energy a person burns at rest", why:"That’s basal metabolic rate, not a DRI." }],
          hints:["There are several DRI values: EAR, RDA, AI, UL.", "One covers about 97–98% of healthy people.", "The RDA."] },
        { id:"w4", skill:"Canada’s Food Guide and the DRIs", goal:3,
          prompt:"Canada’s Food Guide (2019) recommends what as the drink of choice?",
          options:[
            { t:"Water", ok:true, why:"Water, plus unsweetened milk and plant-based beverages, fit healthy eating." },
            { t:"Fruit juice", why:"Whole fruit is recommended over juice." },
            { t:"Sports drinks", why:"Not needed for most people." },
            { t:"Tea with sugar", why:"Sugary drinks aren’t recommended." }],
          hints:["Look at the Food Guide’s plate image.", "There’s a glass beside the plate.", "Water."] },
        { id:"w5", skill:"Life-stage thinking", goal:1,
          prompt:"Which change usually happens to energy needs as an adult moves from 40 to 80?",
          options:[
            { t:"They usually go down", ok:true, why:"Less muscle mass and often less activity lower energy needs." },
            { t:"They usually go up", why:"That’s adolescence: growth spurts raise teen needs." },
            { t:"They stay exactly the same", why:"Basal metabolic rate tends to fall with muscle loss." },
            { t:"They drop to zero after retirement", why:"The body always needs energy." }],
          hints:["What happens to muscle mass with age?", "Muscle uses energy even at rest.", "They usually go down."] },
        { id:"w6", skill:"Life-stage thinking", goal:4,
          prompt:"Which factor is <strong>social</strong>, not biological, when it comes to an older adult’s eating?",
          options:[
            { t:"Eating alone after a partner dies", ok:true, why:"Grief and eating alone often reduce appetite and meal variety." },
            { t:"A weaker thirst signal", why:"That’s a body change." },
            { t:"Less stomach acid", why:"Biological." },
            { t:"Loss of muscle mass", why:"Biological." }],
          hints:["Social factors involve other people and situations.", "Which option is about relationships?", "Eating alone."] }
      ],
      refreshers:{
        "Nutrient functions":"Calcium and vitamin D build bone; B12 supports nerves and red blood cells; protein maintains muscle; fibre and fluids support digestion.",
        "Canada’s Food Guide and the DRIs":"The Food Guide gives food patterns (half vegetables and fruits, a quarter whole grains, a quarter protein foods, water to drink). The DRIs give nutrient amounts by life stage: EAR, RDA, AI, UL.",
        "Life-stage thinking":"Needs change with growth, body changes and life situation. Ask: what’s changing in the body, and what’s changing in the person’s life?"
      }
    }
  },
  explore:{
    heading:"The ageing body explorer",
    intro:"Turn the age dial and switch on life situations. Watch which needs change and which flags appear. Then plan meals that respond.",
    modes:[{ id:"wheel", t:"Systems wheel" }, { id:"planner", t:"Meal planner" }],
    // plan: the medication toggle is generic (no particular medication is named)
    toggles:[
      { id:"alone", t:"Lives alone" },
      { id:"chew", t:"Dentures or chewing difficulty" },
      { id:"med", t:"Takes a medication that can lower appetite or B12 absorption" },
      { id:"income", t:"Limited income" },
      { id:"winter", t:"Rarely outdoors in winter" }
    ],
    // Flags row: one line per active toggle. The plan gives the first two; the other three are module-written.
    flags:{
      alone:"Lives alone: risk of skipping meals or eating less variety",
      chew:"Chewing difficulty: soft textures, keep protein",
      med:"Medication: can lower appetite or B12 absorption; ask a pharmacist or doctor",
      income:"Limited income: low-cost nutrient-dense staples; community meals help",
      winter:"Rarely outdoors in winter: little vitamin D from sunlight; the supplement note matters more",
      none:"None yet: switch on a life situation."
    },
    // Readout panel (plan table). VERIFY: every DRI value before release (Health Canada DRI tables).
    rows:{
      energy:{ t:"Energy needs (compared with age 50)", same:"About the same", little:"A little lower", lower:"Usually lower" },
      vitd:{ t:"Vitamin D RDA" },
      supp:{ t:"Vitamin D supplement note", txt:"Health Canada advises a daily 10 µg (400 IU) supplement for adults over 50, alongside healthy eating" },
      calcium:{ t:"Calcium RDA" },
      // module-written: the stronger wording when the medication toggle is on
      b12:{ t:"Vitamin B12", base:"Absorption from food may fall; fortified foods or a supplement may be advised",
        med:"A medication that can lower B12 absorption is switched on, so absorption from food is even more likely to fall. Fortified foods or a supplement may be advised: ask a doctor or pharmacist" },
      protein:{ t:"Protein", txt:"Include protein at every meal; some experts suggest older adults need more than younger adults" },
      // module-written: the line shown before age 65
      thirst:{ t:"Thirst", weak:"Thirst signal weaker: drink regularly", usual:"No thirst flag yet: water is the drink of choice" },
      flags:{ t:"Flags" }
    },
    // The systems wheel (plan): seven system cards, schematic only, no body images. Two-line explanations are module-written.
    // VERIFY: the ages at which each card lights up are schematic teaching thresholds, not clinical cut-offs.
    systems:[
      { id:"mouth", t:"Mouth and teeth",
        what:"Dentures, missing teeth or a sore mouth can make chewing hard, so meat, raw vegetables and crusty bread get skipped.",
        food:"Soft, moist textures keep protein and vegetables on the plate: stews, eggs, fish, lentil soup, cooked vegetables." },
      { id:"taste", t:"Taste and smell",
        what:"Taste and smell fade gradually with age, and some medications change how food tastes.",
        food:M6 },
      { id:"stomach", t:"Stomach and absorption",
        what:"Less stomach acid makes it harder to free vitamin B12 from food, and some medications lower absorption further.",
        food:"The B12 in fortified foods and supplements is easier to absorb; a health professional advises on supplements." },
      { id:"muscles", t:"Muscles",
        what:"Muscle mass and strength tend to shrink with age (sarcopenia), which also lowers energy needs.",
        food:"Protein at every meal, plus strength activity, helps slow the loss." },
      { id:"bones", t:"Bones",
        what:"Bone loss continues with age, and the vitamin D RDA rises at 71. In a Canadian winter, the sun is too weak for the skin to make much vitamin D.",
        food:"Calcium-rich foods, vitamin D sources, and Health Canada’s daily 10 µg vitamin D supplement for adults over 50." },
      { id:"kidneys", t:"Kidneys and thirst",
        what:"The thirst signal weakens with age, so feeling thirsty is a late signal for many older adults.",
        food:"Offer drinks at set times, and count soups, milk, tea and juicy fruit as fluids." },
      { id:"mood", t:"Mood and social life",
        what:"Living alone, grief and a tight budget often mean smaller, simpler meals and less variety.",
        food:"Shared meals, community dining, delivered meals and low-cost nutrient-dense staples help." }
    ],
    // short reasons shown on the cards (module-written)
    reasons:{ chew:"Dentures or chewing difficulty", taste70:"Age 70+: taste and smell often fade", med:"Medication switched on",
      b12:"From 50: B12 absorption may fall", musc60:"From 60: muscle loss", musc75:"From 75: muscle loss speeds up",
      bone50:"From 50: bone loss continues", bone71:"From 71: vitamin D RDA rises to 20 µg", winter:"Rarely outdoors in winter",
      thirst65:"From 65: thirst signal weaker", alone:"Lives alone", income:"Limited income" },
    thirstBars:{ title:"Thirst signal and fluid need", note:"Schematic, not measured.", signal:"Thirst signal", need:"Fluid need" },
    hub:{ plate:"Plate (energy)", list:"Nutrient checklist: vitamin D · calcium · B12 · protein · fibre · fluids", same:"same or more at every age" },
    // Personas (plan). Sex is shown because the calcium RDA differs (plan).
    personas:[
      { id:"ruth", t:"Ruth", age:84, sex:"f", sit:["alone", "chew"], desc:"84, lives alone in a small Ontario town, wears dentures, small appetite" },
      { id:"gurdeep", t:"Gurdeep", age:76, sex:"m", sit:["med"], desc:"76, lacto-vegetarian (dairy yes; no meat, fish or eggs), lives with his daughter’s family, takes a medication that can lower B12 absorption" },
      { id:"harold", t:"Harold", age:69, sex:"m", sit:["alone", "income"], desc:"69, recently widowed, active, never did much cooking, tight budget" }
    ],
    slots:[{ id:"b", t:"Breakfast", meal:true }, { id:"l", t:"Lunch", meal:true }, { id:"s1", t:"Snack 1" }, { id:"d", t:"Dinner", meal:true }, { id:"s2", t:"Snack 2" }],
    // Ruth's current day (module-written): 4 model µg of vitamin D from food (TC2), steak at dinner (P3), no calcium at lunch (TC1).
    current:{ ruth:{ b:["eggs", "tea"], l:["lsoup", "peaches"], s1:["banana"], d:["steak", "vegs", "water"], s2:["soy"] } },
    supplement:"Include Health Canada’s vitamin D supplement note (adds 10 µg a day)",
    modelNote:"Model values; real foods vary. Vitamin D in model µg; costs in model dollars.",
    budget:8,
    pool:POOL,
    predictions:[
      // VERIFY: vitamin D RDA 15 µg (51–70) and 20 µg (71+).
      { id:"p1", prompt:"Systems wheel at age 50; the dial will turn to 80. As age goes from 50 to 80, what happens to energy needs and to the vitamin D RDA?",
        options:[{ t:"Energy needs usually fall; the vitamin D RDA rises", ok:true }, { t:"Both fall" }, { t:"Both rise" }, { t:"Energy needs rise; vitamin D falls" }],
        explain:"Less energy, more of some nutrients: nutrient density matters most now. The energy row changes to “Usually lower”, while vitamin D steps from 15 to 20 µg at 71." },
      { id:"p2", prompt:"Systems wheel at age 80. Now switch on “Lives alone”. Which flag will appear?",
        options:[{ t:"Risk of skipping meals or eating less variety", ok:true }, { t:"Higher vitamin C needs" }, { t:"Better protein absorption" }, { t:"Lower fluid needs" }],
        explain:"Eating alone often means smaller, simpler meals. Shared meals and community dining help." },
      { id:"p3", prompt:"Meal planner, persona Ruth (dentures). Her dinner contains grilled steak. Ruth finds steak hard to chew. What’s the best change?",
        options:[{ t:"Swap to a soft protein (baked salmon, eggs, lentil soup)", ok:true }, { t:"Remove the protein food" }, { t:"Replace it with juice" }, { t:"Add salt to the steak" }],
        explain:"Change the texture, keep the protein. The texture flag turns to “all soft” and protein at every meal stays ticked." },
      { id:"p4", prompt:"Systems wheel at age 75, with the “Kidneys and thirst” card open. Why does the readout say “drink regularly” rather than “drink when thirsty”?",
        options:[{ t:"The thirst signal weakens with age", ok:true }, { t:"The kidneys stop working" }, { t:"Water needs triple" }, { t:"Older adults can’t absorb water" }],
        explain:"Feeling thirsty is a late signal for many older adults. The thirst-signal bar shrinks while the fluid-need bar stays the same." }
    ],
    challenges:[
      { id:"tc1", goal:[3, 6],
        prompt:"Meal planner, Ruth: build a lunch that is all soft, includes a protein food and includes a calcium-rich item.",
        why:"Soft textures, protein and calcium together: the lunch fits Ruth’s dentures and her needs.",
        msgs:{
          // module-written: empty and moderate-texture lines
          empty:"Add foods to Ruth’s lunch in the Meal planner.",
          hard:"That item is hard to chew. Choose a soft form.",
          moderate:"{item} isn’t soft enough for Ruth’s dentures. Every lunch item needs to be soft.",
          protein:"Ruth still needs protein at every meal.",
          calcium:"Add milk, yogurt, fortified soy beverage, paneer or calcium-set tofu." },
        hints:["Filter the pool by texture = soft.", "Find one soft item that has protein and calcium together.", "Paneer curry, or yogurt with lentil soup."] },
      { id:"tc2", goal:[3, 6],
        prompt:"Ruth is 84. Her current day gives 4 model µg of vitamin D from food. Change her day so that food plus Health Canada’s recommended supplement reaches at least her RDA.",
        why:"With the 10 µg supplement on, food needs to give at least 10 µg: 10 + 10 = 20 µg, Ruth’s RDA.",
        msgs:{
          // VERIFY: the 10 µg daily supplement advice for adults over 50.
          supp:"Health Canada advises a 10 µg daily supplement for adults over 50. Switch the note on.",
          nine:"Just short. One more fortified item does it.",
          // module-written: food totals below 9
          low:"Food gives {v} µg of vitamin D (model). With the supplement’s 10 µg, food needs to give at least 10 µg to reach Ruth’s RDA of 20 µg." },
        // VERIFY: vitamin D RDA 20 µg for 71+ (hint 1); salmon 10 µg is a model value (hint 3).
        hints:["Ruth is over 70: the RDA is 20 µg.", "The supplement gives 10 µg, so food must give at least 10.", "One serving of salmon gives 10 (model value)."] },
      { id:"tc3", goal:[3, 6], stretch:true,
        prompt:"Plan a full day for Gurdeep (lacto-vegetarian; his medication can lower B12 absorption): no meat, fish or eggs; a protein food at every meal; at least 3 B12 sources (dairy or fortified) across the day; at least 4 fluid-rich items.",
        why:"Plant proteins plus dairy cover protein; dairy and fortified drinks cover B12; milk, tea, soup and water cover fluids.",
        msgs:{
          empty:"Add foods to Gurdeep’s day in the Meal planner.",
          eggs:"Gurdeep’s lacto-vegetarian diet includes dairy but not eggs.",
          // module-written: meat or fish, and too few fluid-rich items
          meat:"Gurdeep’s lacto-vegetarian diet has no meat or fish. Remove {list}.",
          b12:"B12 comes from dairy and fortified foods for him, so count your milk, yogurt, paneer and fortified soy beverage.",
          protein:"Every meal needs a protein food: dal, paneer, yogurt, tofu or milk.",
          fluids:"{n} fluid-rich item{s} so far: he needs at least 4. Milk, fortified soy beverage, tea, soups and water all count." },
        hints:["Start with his culture and diet filter: lacto-vegetarian.", "Plant proteins (dal, tofu) plus dairy cover protein; dairy and fortified drinks cover B12.", "Put milk or yogurt at three different times of day."] }
    ],
    // module-written summary of the plan's "aha"
    blocks:[{ title:"What the explorer shows", html:"<p>As the dial turns, the plate (energy) gets smaller, but the nutrient checklist stays the same. With less room on the plate, choose <strong>nutrient-dense</strong> foods that each tick several boxes, like oatmeal made with milk, fortified milk or baked salmon.</p><p class=\"tiny muted\">" + ADVICE + "</p>" }]
  },
  part3:{
    slug:"design", name:"Design", heading:"Design for an older adult",
    // module-written intro
    intro:"Adapt one dinner for <strong>texture</strong>, compare foods for <strong>nutrient density</strong>, and fit Harold’s day to his <strong>budget</strong>. Work through the three stations, check your choices with data, then save a kitchen card for class or home.",
    stations:[{ id:"tex", t:"1. Texture" }, { id:"dense", t:"2. Nutrient density" }, { id:"budget", t:"3. Budget" }],
    texture:{
      title:"Station 1: Texture",
      dinner:"Roast chicken, raw salad and crusty bread",
      // VERIFY: IDDSI as the framework care settings use, and the level names below (module-written descriptions).
      levels:[
        { id:"reg", t:"Regular", d:"Roast chicken, raw salad, crusty bread" },
        { id:"soft", t:"Soft and bite-sized", d:"Tender chicken pieces in sauce, soft-cooked vegetables, soft bread" },
        { id:"mince", t:"Minced and moist", d:"Minced chicken in gravy, mashed vegetables, bread soaked in soup" }
      ],
      note:"Care settings describe food textures with a standard framework of levels (the IDDSI framework). A health professional, such as a speech-language pathologist or a dietitian, decides a person’s level. Planners don’t assign one.",
      ask:"Choose a swap for each part of the dinner that keeps protein and vegetables but softens the texture.",
      // Swap feedback is module-written (the plan names the three good swaps).
      parts:[
        { id:"chicken", t:"Roast chicken", kind:"p", swaps:[
          { t:"Leave out the chicken", fb:M3 },
          { t:"Braised chicken in sauce", ok:true, fb:"Braising makes the chicken tender and moist, and the protein stays." },
          { t:"Chicken broth only", fb:"Broth has very little protein. Keep the chicken; change its texture." }] },
        { id:"salad", t:"Raw salad", kind:"v", swaps:[
          { t:"Cooked vegetables", ok:true, fb:"Cooking softens vegetables and keeps them on the plate." },
          { t:"A glass of juice", fb:"Whole vegetables and fruit are recommended over juice. Cook the vegetables instead." },
          { t:"Leave out the vegetables", fb:"Half the plate is vegetables and fruits. Soften them instead of dropping them." }] },
        { id:"bread", t:"Crusty bread", kind:"g", swaps:[
          { t:"Crackers", fb:"Crackers are dry and crumbly, which makes them hard to chew and swallow." },
          { t:"Leave out the bread", fb:"Keep the whole grain; soften it instead." },
          { t:"Soft whole-grain bread soaked in soup", ok:true, fb:"Soaking softens the bread and keeps the whole grain." }] }
      ],
      done:"Dinner adapted: every part is soft, and the protein and vegetables stay."
    },
    density:{
      title:"Station 2: Nutrient density",
      ask:"Each pair has a similar cost and energy. Choose the more nutrient-dense food, then check it with data.",
      // VERIFY: model values per serving (protein g, calcium mg, fibre g, vitamin D µg), rounded for learning. Module-written.
      // Oatmeal and fortified milk use the food pool's model vitamin D (3 µg).
      pairs:[
        { id:"d1", items:[
          { t:"Tea biscuits (3)", v:[2, 10, 0.5, 0] },
          { t:"Oatmeal made with milk", ok:true, v:[10, 300, 4, 3] }],
          fb:"Protein, calcium and fibre for similar cost.", bad:"Compare the data: the biscuits give little protein, calcium or fibre." },
        { id:"d2", items:[
          { t:"Fortified milk, 1 cup", ok:true, v:[8, 300, 0, 3] },
          { t:"A soft drink, 1 can", v:[0, 10, 0, 0] }],
          fb:"Milk brings protein, calcium and vitamin D; the soft drink brings sugar and little else.", bad:"Compare the data: the soft drink gives almost nothing but sugar." },
        { id:"d3", items:[
          { t:"White toast (2 slices)", v:[4, 60, 1, 0] },
          { t:"Whole-grain toast with peanut butter", ok:true, v:[12, 70, 6, 0] }],
          fb:"Whole grain plus peanut butter adds protein and fibre for a similar cost.", bad:"Compare the data: white toast has less protein and fibre." }
      ],
      heads:["Protein (g)", "Calcium (mg)", "Fibre (g)", "Vitamin D (µg)"],
      label:"Model values per serving for learning; real foods vary. No Calories are shown.",
      done:"All three denser choices found: each gives more nutrition per bite."
    },
    budget:{
      title:"Station 3: Budget",
      ask:"Harold has a model budget of $8 a day for food. His current day costs $11.20 and is heavy on takeout. Swap in lower-cost, nutrient-dense staples (eggs, canned fish, frozen vegetables, oats, lentils, milk) until the day fits, keeping protein at every meal.",
      limit:8,
      // VERIFY: model costs (module-written; the plan gives the $8 budget and the $11.20 total).
      slots:[
        { id:"b", t:"Breakfast", meal:true, opts:[
          { id:"cur", t:"Coffee-shop breakfast sandwich and coffee", cost:3.20, p:true, cur:true },
          { id:"oat", t:"Oatmeal made with milk", cost:0.60, p:true, ca:true },
          { id:"egg", t:"Scrambled eggs on whole-grain toast", cost:1.20, p:true },
          { id:"skip", t:"Skip breakfast", cost:0, skip:true }] },
        { id:"l", t:"Lunch", meal:true, opts:[
          { id:"cur", t:"Takeout burger and fries", cost:4.80, p:true, cur:true },
          { id:"fish", t:"Canned fish sandwich and a glass of milk", cost:2.40, p:true, ca:true },
          { id:"lent", t:"Lentil soup and a glass of milk", cost:1.30, p:true, ca:true, vf:true },
          { id:"skip", t:"Skip lunch", cost:0, skip:true }] },
        { id:"d", t:"Dinner", meal:true, opts:[
          { id:"cur", t:"Toast with jam, and tea", cost:0.60, cur:true },
          { id:"egg", t:"Scrambled eggs with frozen vegetables", cost:1.40, p:true, vf:true },
          { id:"lent", t:"Lentil and vegetable soup with yogurt", cost:1.60, p:true, ca:true, vf:true },
          { id:"skip", t:"Skip dinner", cost:0, skip:true }] },
        { id:"s", t:"Snack", opts:[
          { id:"cur", t:"Bag of chips and a pop", cost:2.60, cur:true },
          { id:"milk", t:"A glass of milk and a banana", cost:0.70, p:true, ca:true, vf:true },
          { id:"yog", t:"Yogurt with canned peaches", cost:1.20, p:true, ca:true, vf:true },
          { id:"skip", t:"Skip the snack", cost:0, skip:true }] }
      ],
      // module-written station messages
      msgs:{ over:"Over budget by {v}. Swap a takeout item for a staple.", skip:"Skipping meals saves money but harms health. Choose a low-cost staple instead.",
        protein:"{meal} has no protein food. Keep protein at every meal.", done:"Harold’s day fits his budget, with protein at every meal and more calcium than before." },
      // VERIFY: OAS and GIS details, and the research link to lower food insecurity among seniors (PROOF; McIntyre et al., 2016).
      note:"Many seniors in Canada get Old Age Security (OAS) and the Guaranteed Income Supplement (GIS). Research by the PROOF food insecurity research program links these programs to lower food insecurity among seniors (McIntyre et al., 2016)."
    },
    // Kitchen card (plan). Ingredients and steps are module-written. VERIFY: the 2-hour cooling guidance and the model cost.
    kitchen:{ title:"Soft lentil and vegetable soup with a yogurt side", label:"Save the kitchen card", file:"kitchen-card-soft-lentil-soup.txt", lines:[
      "Serves 4.",
      "## Ingredients",
      "- 1 cup red lentils, rinsed",
      "- 1 onion and 2 carrots, chopped small",
      "- 1 cup frozen mixed vegetables",
      "- 1 can diced tomatoes (no salt added)",
      "- 5 cups lower-sodium vegetable broth or water",
      "- 1 tsp ground cumin, 1 clove garlic, a squeeze of lemon",
      "- Side: ¾ cup plain yogurt per person",
      "## Cultural swaps (optional)",
      "- Use masoor dal (split red lentils) and finish with cumin seeds warmed in a little oil.",
      "- Or keep red lentils and season with cumin and garlic.",
      "## Steps",
      "1. Wash your hands. Rinse the lentils.",
      "2. Soften the onion and carrots in a little oil over medium heat.",
      "3. Add the lentils, tomatoes, broth, cumin and garlic. Simmer about 20 minutes, until the lentils are very soft.",
      "4. Add the frozen vegetables and simmer 5 more minutes.",
      "5. Season with lemon, herbs and pepper instead of extra salt.",
      "6. Serve with plain yogurt on the side.",
      "## Safety",
      "- Hot liquids: turn pot handles inward, ladle slowly, and let the soup cool a little before blending or serving.",
      "- Leftovers: cool and refrigerate within 2 hours; reheat until steaming hot.",
      "## Texture tip",
      "- Blend half the soup for an even softer texture.",
      "## Nutrient note",
      "- Protein from lentils, calcium from yogurt.",
      "## Cost",
      "- About $1.50 a serving (model data)."
    ] },
    // VERIFY: reference titles, years and details before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (2012). <i>Vitamin D and calcium: Updated dietary reference intakes</i>. Government of Canada.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li><li>International Dysphagia Diet Standardisation Initiative. (2019). <i>Complete IDDSI framework: Detailed definitions 2.0</i>. IDDSI.</li><li>McIntyre, L., Dutton, D. J., Kwok, C., &amp; Emery, J. C. H. (2016). Reduction of food insecurity among low-income Canadian seniors as a likely impact of a guaranteed annual income. <i>Canadian Public Policy, 42</i>(3), 274–286.</li></ul>' }],
    quickCheck:{
      title:"Design quick check", summary:"Design quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        { id:"q1", goal:6, prompt:"Which swap keeps protein but softens texture?",
          choices:[{ t:"Grilled steak → baked fish in sauce", ok:true, fb:"Right. Keep the protein; change the form." }, { t:"Steak → juice", fb:"Keep the protein; change the form." }, { t:"Steak → crackers", fb:"Keep the protein; change the form." }, { t:"Steak → salad", fb:"Keep the protein; change the form." }] },
        { id:"q2", goal:[3, 6], prompt:"Which is more nutrient-dense for the same cost?",
          choices:[{ t:"Oatmeal with milk", ok:true, fb:"Right. Protein, calcium and fibre for similar cost." }, { t:"Tea biscuits", fb:"Protein, calcium and fibre for similar cost." }, { t:"A soft drink", fb:"Protein, calcium and fibre for similar cost." }, { t:"White toast with jam", fb:"Protein, calcium and fibre for similar cost." }] },
        { id:"q3", goal:6, prompt:"Who decides a person’s texture level in care settings?",
          choices:[{ t:"A health professional (e.g. speech-language pathologist, dietitian)", ok:true, fb:"Right. Texture levels are clinical decisions." }, { t:"The cook", fb:"Texture levels are clinical decisions." }, { t:"A family member alone", fb:"Texture levels are clinical decisions." }, { t:"The student planner", fb:"Texture levels are clinical decisions." }] },
        // VERIFY: Health Canada's supplement advice (choice 1).
        { id:"q4", goal:3, prompt:"Why include a vitamin D supplement note for people over 50?",
          choices:[{ t:"Health Canada advises it alongside healthy eating", ok:true, fb:"Right. Food alone often falls short for this age group." }, { t:"Food has no vitamin D", fb:"Food alone often falls short for this age group." }, { t:"It replaces calcium", fb:"Food alone often falls short for this age group." }, { t:"It cures osteoporosis", fb:"Food alone often falls short for this age group." }] }
      ]
    },
    blocksAfter:[{ html:'<div class="hfa-support" role="note"><p>' + ADVICE + "</p></div>" }]
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Change → effect → food response", summary:"Change → response", goal:[2, 3, 4],
        // module-written instruction
        instruction:"Match each age-related change with the best food response. Some responses on the right don’t match any change.",
        leftTitle:"Change", rightTitle:"Best food response",
        left:[
          { id:"l1", t:"Weaker thirst signal", goal:2 },
          // VERIFY: hint 2 (B12 absorption from fortified foods and supplements).
          { id:"l2", t:"Less B12 absorbed from food", goal:[2, 3], hints:["Why would B12 absorption fall?", "Less stomach acid makes it harder to free B12 from food; the B12 in fortified foods and supplements is easier to absorb.", "Fortified foods or a supplement."] },
          { id:"l3", t:"Loss of muscle (sarcopenia)", goal:[2, 3] },
          { id:"l4", t:"Fading taste and smell", goal:2 },
          { id:"l5", t:"Dentures or chewing difficulty", goal:2 },
          { id:"l6", t:"Small appetite", goal:3 },
          { id:"l7", t:"Eating alone", goal:4 },
          { id:"l8", t:"Lower energy needs, steady nutrient needs", goal:[1, 3] }
        ],
        // r9–r11 are distractors built from the plan's named mismatches ("more salt", "remove protein", "drink when thirsty")
        right:[
          { id:"r1", t:"Offer fluids at set times; soups, milk, fruit" },
          { id:"r2", t:"Fortified foods or a supplement, as a health professional advises" },
          { id:"r3", t:"Protein at each meal plus strength activity" },
          { id:"r4", t:"Herbs, spices, citrus, garlic instead of more salt" },
          { id:"r5", t:"Soft, moist textures that keep protein and vegetables" },
          { id:"r6", t:"Smaller, more frequent, nutrient-dense meals" },
          { id:"r7", t:"Shared meals, community dining, delivered meals" },
          { id:"r8", t:"Choose nutrient-dense foods" },
          { id:"r9", t:"Add more salt" },
          { id:"r10", t:"Remove protein foods that are hard to chew" },
          { id:"r11", t:"Drink only when thirsty" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l4|r9":"Extra sodium raises blood pressure; flavour can come from herbs.", "l5|r10":M3, "l1|r11":M2 },
        wrongDefault:"Ask what the change makes harder, then what makes it easier." },
      // ★ case set: the plan gives each case's best answer and the most likely wrong answer's feedback (and N3's hints).
      // The other options, the best answers' feedback, the closing questions on N1–N4 and the hints for N1, N2 and N4–N6
      // are module-written.
      { id:"cases", type:"mc", title:"Cases: the best first step", summary:"Cases", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"Six cases. Choose the best first step for each. Cases marked ★ are non-routine; the last two go beyond the Final Check.",
        items:[
          { id:"n1", goal:2, prompt:"Mrs. Ferreira, 79, says food “tastes like nothing” and has started salting heavily. What’s the best first step?",
            options:[
              { t:"Suggest herbs, lemon and spices; mention it to her doctor if taste changed suddenly", ok:true, why:"Flavour without extra sodium, and a sudden change in taste is worth checking with a doctor." },
              { t:"More salt, so she enjoys her food", why:M6 },
              { t:"Stop serving foods she can’t taste", why:"Eating less makes it harder to meet her needs. Make food tastier without salt instead." },
              { t:"Add sugar to everything, since sweet tastes last longest", why:"Sugar adds little nutrition. Herbs, spices and citrus add flavour without salt or sugar." }],
            hints:["What is fading, and what is she adding to cover it?", "Extra sodium raises blood pressure.", "Herbs, lemon and spices; mention a sudden taste change to her doctor."] },
          { id:"n2", goal:4, prompt:"Mr. Abenaki-Clarke, 72, skips lunch since his wife died. What’s the best first step?",
            options:[
              { t:"Shared or community meals; simple ready-to-eat nutrient-dense options", ok:true, why:M5 },
              { t:"Tell him to try harder", why:"Grief is real; make eating easier and social." },
              { t:"Replace lunch with coffee", why:"Coffee isn’t a meal: he still needs protein and nutrients." },
              { t:"Wait until his appetite returns on its own", why:"Grief can lower appetite for a long time. Make eating easier and social now." }],
            hints:["Is the problem cooking, company or both?", "Grief and eating alone often lower intake.", "Shared or community meals, plus simple ready-to-eat options."] },
          // VERIFY: RDAs 1200 mg calcium and 20 µg vitamin D for women 71+.
          { id:"n3", goal:[1, 3], prompt:"A day plan for an 81-year-old woman gives 1000 mg calcium and 8 µg vitamin D from food. Which change matters most? <span class=\"tag\">★</span>",
            options:[
              { t:"Add the vitamin D supplement note and one more calcium-rich item", ok:true, why:"Her RDA is 1200 mg calcium and 20 µg vitamin D, so she’s short on both. A fortified milk or soy beverage adds calcium and some vitamin D at once." },
              { t:"Add more energy", why:M1 },
              { t:"Nothing: 1000 mg of calcium is enough at any age", why:"Women over 50 need 1200 mg." },
              { t:"Add one more calcium-rich item only", why:"That helps calcium, but vitamin D is still far short. Health Canada advises a 10 µg supplement for adults over 50." }],
            hints:["Look up her RDAs: calcium 1200 mg, vitamin D 20 µg.", "She’s short on both.", "Add the supplement note and one more calcium-rich item, such as yogurt."] },
          { id:"n4", goal:5, prompt:"A grandson buys “Senior Formula” nutrition drinks at $3 a bottle for his grandfather, who eats well and has no appetite problems. What’s the best first step? <span class=\"tag\">★</span>",
            options:[
              { t:"Compare the label with milk plus a snack: the drink may add little for him and costs more", ok:true, why:"For someone who eats well, regular food usually does the job for less. These drinks help most when a person can’t eat enough." },
              { t:"Seniors always need them", why:M7 },
              { t:"Replace two meals a day with the drinks", why:"Meals give more variety, fibre and time together. Drinks are for people who can’t eat enough." },
              { t:"Throw out every fortified food in the house", why:"Many fortified foods help. Judge each one by its label." }],
            hints:["Does the grandfather have a problem the drink solves?", "Compare the label and price with ordinary foods.", "Compare it with milk plus a snack: it may add little and cost more."] },
          { id:"n5", goal:4, prompt:"Which research question best investigates whether a community meal program helps seniors eat better? <span class=\"tag\">★ Inquiry</span>",
            options:[
              { t:"“How does attending a weekly community meal program relate to the variety of foods older adults in our town eat?”", ok:true, why:"It names the group, the program and something you can measure about eating." },
              { t:"“Are seniors lonely?”", why:"Too broad and not about the program’s effect on eating." },
              { t:"“Do seniors like soup?”", why:"Too narrow, and not about the program." },
              { t:"“Should the town spend more money on seniors?”", why:"That’s a question about values and policy, not a research question about eating." }],
            hints:["A good research question names a group, a factor and something you can measure.", "Which question links the program to what people eat?", "The question about attending the program and food variety."] },
          { id:"n6", goal:5, prompt:"An online ad says a supplement “reverses ageing and rebuilds bones in 30 days.” Which response shows good source evaluation? <span class=\"tag\">★ Inquiry</span>",
            options:[
              { t:"Check who makes the claim, look for peer-reviewed evidence or Health Canada information, and note that a 30-day “reversal” is not a plausible claim", ok:true, why:"Good evaluation checks the source, the evidence and whether the claim is plausible." },
              { t:"It has testimonials, so it works", why:"Testimonials aren’t evidence." },
              { t:"It’s for sale online, so the claim must be true", why:"Being for sale isn’t evidence that a claim is true." },
              { t:"Share it with grandparents right away", why:"Check the evidence before sharing a health claim." }],
            hints:["Who is making the claim, and what do they gain?", "Look for peer-reviewed studies or Health Canada information.", "Check the source and the evidence, and notice that a 30-day reversal isn’t plausible."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Itzel", goal:[1, 2, 3], how:"",
        instruction:"Itzel made one mistake in each plan for her grandmother. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain how Grandma’s needs have changed at 82.",
            steps:["“Grandma is less active now, so she usually needs less energy.”", "“So she needs less of every nutrient too.”", "“I’ll give her smaller portions of everything.”", "“That will cover her needs.”"],
            answer:1, stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier.", "Step 4 follows the earlier mistake."],
            fixes:[
              { t:"“Energy needs fall, but needs for calcium, vitamin D and B12 stay the same or rise, so I’ll choose nutrient-dense foods.”", ok:true, why:M1 },
              { t:"“She needs more energy than before.”", why:"Energy usually falls." },
              { t:"Step 2 is correct.", why:"Lower energy doesn’t mean lower nutrient needs." },
              { t:"“She needs only protein now.”", why:"She needs a full range of nutrients." }],
            hints:["Do vitamin D needs go down with age?", "No: they rise after 70.", "Fix step 2."] },
          { id:"e2", goal:2, task:"Plan Grandma’s drinks for a hot July day.",
            steps:["“It’s hot, so fluid needs may rise.”", "“Grandma will tell me when she’s thirsty.”", "“So I’ll offer water only when she asks.”", "“Soup and fruit don’t count as fluids.”", "“That keeps her hydrated.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "There’s a mistake here too, but an earlier step goes wrong first.", "Step 5 follows the earlier mistakes."],
            fixes:[
              { t:"“Her thirst signal may be weaker, so I’ll offer drinks at set times.”", ok:true, why:M2 },
              { t:"“She should avoid water to protect her kidneys.”", why:"Healthy kidneys need fluids." },
              { t:"Step 2 is correct.", why:M2 },
              { t:"“Give her sports drinks instead.”", why:"Water is the drink of choice." }],
            hints:["Is thirst a reliable signal at 82?", "It often weakens with age.", "Offer fluids regularly."] },
          // VERIFY: vitamin D RDA 20 µg for 71+ (step 1) and the supplement advice (fix 1).
          { id:"e3", goal:3, task:"Check Grandma’s vitamin D.",
            steps:["“Grandma is over 70, so her vitamin D RDA is 20 µg.”", "“She drinks two cups of fortified milk a day.”", "“Milk is fortified, so she gets all the vitamin D she needs and no supplement is needed.”", "“Her bones are protected.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is a fact about her day.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Two cups give only part of her RDA; Health Canada advises adults over 50 to take a daily 10 µg supplement as well.”", ok:true, why:M4 },
              { t:"“She should stop drinking milk.”", why:"Milk helps." },
              { t:"Step 3 is correct.", why:M4 },
              { t:"“Vitamin D doesn’t matter after 70.”", why:"It matters for bones and muscles." }],
            hints:["How much vitamin D is in a cup of fortified milk (model value)?", "About 3 µg in the module’s model; two cups give about 6 µg.", "Add the supplement note."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you on the systems wheel: which change in ageing had you never thought about?" },
      { id:"j2", q:"In your own words, why do older adults need nutrient-dense foods?" },
      { id:"j3", q:"Explain to a friend how you’d adapt a family recipe for a grandparent who has trouble chewing, without losing protein." },
      { id:"j4", q:"Which goal still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7) or a short module-written line.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement about nutrition after age 70 is accurate?", options:[
          { t:"Energy needs usually fall, while vitamin D and calcium needs stay the same or rise", ok:true, why:"That’s why nutrient density matters." },
          { t:"All nutrient needs fall with energy needs", why:M1 },
          { t:"Energy needs rise because of retirement", why:"Activity often falls." },
          { t:"Nutrient needs no longer matter", why:"They matter as much as ever." }] },
        b:{ prompt:"Why do dietitians stress nutrient-dense foods for older adults?", options:[
          { t:"Because energy needs usually fall while many nutrient needs don’t", ok:true, why:"With less room on the plate, every bite has to count." },
          { t:"Because older adults need more total energy", why:"Usually less." },
          { t:"Because older adults can’t digest any fats", why:"Fats are still digested." },
          { t:"Because nutrient-dense foods are always cheaper", why:"Not always; some are." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which age-related change most directly raises the risk of dehydration?", options:[
          { t:"A weaker thirst signal", ok:true, why:"People may not feel thirsty even when they need fluids." },
          { t:"Fading taste", why:"Affects flavour, not mainly fluids." },
          { t:"Loss of bone", why:"Not directly about fluids." },
          { t:"Dentures", why:"Affects chewing." }] },
        // VERIFY: stomach acid and B12 release (correct-option feedback).
        b:{ prompt:"Which change can make vitamin B12 from food harder to absorb?", options:[
          { t:"Less stomach acid", ok:true, why:"Stomach acid helps release B12 from food." },
          { t:"A weaker thirst signal", why:"About fluids." },
          { t:"Fading smell", why:"About flavour." },
          { t:"Lower energy needs", why:"Not about absorption." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is the best way to add flavour for an older adult whose taste is fading, while protecting blood pressure?", options:[
          { t:"Herbs, spices, citrus and garlic", ok:true, why:"Flavour without the sodium." },
          { t:"Extra salt at the table", why:M6 },
          { t:"Soy sauce on everything", why:"High in sodium. " + M6 },
          { t:"Sugar on vegetables", why:"Adds sugar, not flavour depth." }] },
        b:{ prompt:"Which food is both soft and a good source of calcium?", options:[
          { t:"Plain yogurt", ok:true, why:"Soft, and calcium-rich." },
          { t:"Raw almonds", why:"Calcium, but hard to chew." },
          { t:"Herbal tea", why:"Fluid, but little calcium." },
          { t:"Canned peaches", why:"Soft, but low in calcium." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"Ruth, 84, eats about the same foods as she did at 60, but in smaller portions. What is the most likely result?", options:[
          { t:"She may fall short on vitamin D, calcium and B12 even if her energy intake is enough", ok:true, why:"Smaller portions of the same foods shrink every nutrient, but her needs for these didn’t shrink." },
          { t:"She’ll get excess vitamin D", why:"Smaller portions mean less." },
          { t:"Her needs will be fully met because energy needs fell", why:M1 },
          { t:"She’ll have more protein than before", why:"Less food means less protein." }] },
        b:{ prompt:"An 80-year-old’s energy intake matches her needs, but her plate is mostly white bread, tea biscuits and jam. What is the main concern?", options:[
          { t:"Low nutrient density: likely short on protein, calcium, vitamin D and fibre", ok:true, why:"Bread, biscuits and jam give energy but little protein, calcium, vitamin D or fibre." },
          { t:"Too much energy", why:"The energy matches her needs." },
          { t:"Too much calcium", why:"Little calcium here." },
          { t:"No concern, because energy is met", why:M1 }] } },
      // VERIFY: RDA 20 µg (A) and the vitamin D UL (B).
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Mr. Osei, 73, eats fish twice a week and drinks one cup of fortified milk a day. His food gives about 8 µg of vitamin D (model). What should a plan add to reach his RDA of 20 µg?", options:[
          { t:"The 10 µg supplement Health Canada advises, plus at least 2 µg more from food", ok:true, why:"10 + 8 + 2 = 20." },
          { t:"Nothing: fish is enough", why:M4 },
          { t:"The supplement alone, because 8 + 10 = 20", why:"8 + 10 = 18, which is still 2 short." },
          { t:"More energy", why:M1 }] },
        b:{ prompt:"Ms. Kaur, 75, gets about 12 µg of vitamin D from food (model). What does adding the 10 µg supplement do?", options:[
          { t:"Brings her to about 22 µg, above her RDA of 20 µg", ok:true, why:"12 + 10 = 22, which is above 20." },
          { t:"Nothing, because food covers it", why:"12 is below 20. " + M4 },
          { t:"Brings her to exactly 20", why:"12 + 10 = 22." },
          { t:"Exceeds the UL", why:"22 µg is far below the UL." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Harold, 69, recently widowed, eats takeout most days and spends more than he can afford. Which plan addresses both his health and his situation?", options:[
          { t:"Low-cost staples that are easy to prepare (eggs, canned fish, frozen vegetables, oats), plus a community meal twice a week", ok:true, why:"It tackles cost, cooking skills and eating alone." },
          { t:"A strict diet plan with exact calories", why:"Doesn’t address cooking skills, cost or loneliness." },
          { t:"Expensive meal-replacement drinks", why:"Costly and not social. " + M7 },
          { t:"Tell him to eat at home alone more often", why:"Ignores grief and isolation. " + M5 }] },
        b:{ prompt:"A senior on a fixed income lives far from a grocery store and doesn’t drive. Which response best fits?", options:[
          { t:"Grocery delivery or a community shuttle, plus shelf-stable nutrient-dense foods (canned fish, beans, milk powder, oats)", ok:true, why:"It works around transport and keeps nutrient-dense food on hand." },
          { t:"Tell her to walk farther", why:"Ignores mobility." },
          { t:"Only fresh foods every day", why:"Hard without transport." },
          { t:"Skip meals to save money", why:"Harms health." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which sentence best explains sarcopenia to a family?", options:[
          { t:"“With age, muscle tends to shrink and weaken; eating protein at each meal and staying active help slow it.”", ok:true, why:"It says what happens and what helps, in plain words." },
          { t:"“Sarcopenia means bones get thinner.”", why:"That’s osteoporosis." },
          { t:"“Sarcopenia is caused by eating too much protein.”", why:"Protein helps." },
          { t:"“Sarcopenia can’t be affected by anything.”", why:"Activity and protein help." }] },
        b:{ prompt:"Which sentence best explains why an older adult might not drink enough water?", options:[
          { t:"“The body’s thirst signal often weakens with age, so people may not feel thirsty even when they need fluids.”", ok:true, why:"It gives the cause and what it means, in plain words." },
          { t:"“Older adults don’t need water.”", why:M2 },
          { t:"“Water is harmful to older kidneys.”", why:"Healthy kidneys need fluids." },
          { t:"“Older adults get all their water from coffee.”", why:"Not a reliable plan." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"A grandmother has trouble chewing. Which meal-plan note is clearest and most helpful?", options:[
          { t:"“Keep protein at every meal in soft forms (baked fish, eggs, lentil soup, yogurt); cook vegetables until tender; offer drinks with meals.”", ok:true, why:"Specific, keeps protein, and covers texture and fluids." },
          { t:"“Avoid protein because it’s hard to chew.”", why:M3 },
          { t:"“Give her liquid meals only.”", why:"Not needed; soft foods work." },
          { t:"“Use more salt so she eats more.”", why:M6 }] },
        b:{ prompt:"Which label for a plan for a lacto-vegetarian older adult is most accurate?", options:[
          { t:"“No meat, fish or eggs; protein from dal, paneer, tofu and milk; B12 from dairy and fortified foods.”", ok:true, why:"Accurate about the diet and about where protein and B12 come from." },
          { t:"“No dairy; protein from eggs.”", why:"Lacto-vegetarians eat dairy, not eggs." },
          { t:"“Protein from fish twice a week.”", why:"Not vegetarian." },
          { t:"“B12 isn’t needed for vegetarians.”", why:"Everyone needs B12." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Your town is choosing between two programs to improve seniors’ nutrition. Which choice best fits what you learned?", options:[
          { t:"A twice-weekly community lunch with transport, because it improves food intake and social connection", ok:true, why:M5 },
          { t:"A pamphlet telling seniors to cook more", why:"Doesn’t address isolation or skills." },
          { t:"A store discount on candy", why:"Not nutrient-dense." },
          { t:"Nothing, because seniors’ food security is never a concern", why:"Some seniors are food insecure. " + M5 }] },
        b:{ prompt:"A long-term care home wants residents to eat more at lunch. Which change is most likely to help?", options:[
          { t:"Serve lunch in a shared dining room with familiar, culturally appropriate foods and help for those who need it", ok:true, why:"Company, familiar foods and help with eating all raise intake." },
          { t:"Serve meals in residents’ rooms only", why:"Isolation lowers intake. " + M5 },
          { t:"Cut portion variety to save time", why:"Less appealing." },
          { t:"Remove all desserts", why:"Not the main issue." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A store sells “Senior Strong” cookies with added calcium for $6 a box. Which response shows the best evaluation?", options:[
          { t:"Compare the label: check calcium, sugar and price against milk, yogurt or fortified soy beverage", ok:true, why:M7 },
          { t:"Buy them: anything “for seniors” is better", why:M7 },
          { t:"Avoid all fortified foods", why:"Many fortified foods help." },
          { t:"Trust the name", why:M7 }] },
        b:{ prompt:"A meal-replacement drink is marketed to older adults. For whom is it most likely to be useful?", options:[
          { t:"Someone who can’t eat enough food, with advice from a health professional", ok:true, why:"These drinks help most when a person can’t eat enough, with a professional’s guidance." },
          { t:"Everyone over 65, instead of meals", why:M7 },
          { t:"People who eat well and have a good appetite", why:"Little added benefit." },
          { t:"Teenagers who skip breakfast", why:"Not the target, and food is better." }] } }
    ]
  },
  task:{
    title:"A good day for…", summary:"A good day for…",
    statement:"<p>Choose <strong>Ruth</strong>, <strong>Gurdeep</strong> or <strong>Harold</strong>. Plan a full day (breakfast, lunch, dinner, two snacks) that meets every condition for that person. Then pick one dish for a kitchen card. There are many good plans.</p><p class=\"tiny muted\">Model values; real foods vary. Vitamin D in model µg; costs in model dollars. No Calories are shown.</p>",
    checks:["Protein at every meal", "Calcium-rich foods", "Vitamin D covered", "Fluids through the day", "Fits the person", "Kitchen card chosen"],
    tips:["Every meal needs a protein food.", "Milk, yogurt, paneer, fortified soy beverage and calcium-set tofu are calcium-rich.", "Switch on the supplement note, then check the food total.", "Soups, milk, tea and water all count as fluid-rich.", "Check what this person needs.", "Pick the dish you’d most like to cook."],
    tips5:{ ruth:"Ruth: filter by soft.", gurdeep:"Gurdeep: dairy yes, eggs no; count B12 sources.", harold:"Harold: check the cost bar." },
    explainPrompt:"Explain how your plan responds to two body changes and one life-situation factor for your person.",
    vocab:"Use the words nutrient-dense, protein, calcium, vitamin D and texture or budget.",
    checkLabel:"Check my plan",
    success:"This day works for your person.",   // module-written
    more:"There are many good plans. Try another, or plan for another person.",   // module-written
    // module-written: what each checklist line tests, shown under the list
    rules:"Protein: breakfast, lunch and dinner each have a protein food. Calcium: at least 3 calcium-rich items. Vitamin D: the supplement note is on and food gives at least 10 µg (Ruth, Gurdeep: 71+) or 5 µg (Harold: 51–70). Fluids: at least 4 fluid-rich items. Fits the person: Ruth, every item soft; Gurdeep, no meat, fish or eggs and at least 3 B12 sources (dairy or fortified); Harold, the day costs $8.00 or less and at least 3 items are “no-cook or simple”.",
    // Kitchen-card dishes (module-written). VERIFY: safe internal temperature for fish (70 °C), the 2-hour cooling guidance
    // and every model cost.
    dishes:[
      { id:"lsoup", t:"Soft lentil and vegetable soup with a yogurt side", from:"part3" },
      { id:"oat", t:"Oatmeal made with milk, with soft fruit", lines:[
        "Serves 1.",
        "## Ingredients",
        "- ½ cup quick or large-flake oats",
        "- 1 cup fortified milk (or fortified soy beverage)",
        "- ½ banana, sliced, or ½ cup canned peaches in juice",
        "- A pinch of cinnamon",
        "## Cultural swaps (optional)",
        "- Add cardamom and a few soft chopped dates.",
        "- Cook it like a rice pudding with soft rice in place of oats.",
        "## Steps",
        "1. Wash your hands.",
        "2. Stir the oats and milk together in a small pot.",
        "3. Simmer over low heat for about 5 minutes, stirring, until thick and soft.",
        "4. Top with the fruit and cinnamon.",
        "## Safety",
        "- Hot liquids: milk can boil over quickly; stay at the stove, stir, and turn the handle inward.",
        "- Knife safety: slice the banana on a cutting board, cutting away from your fingers.",
        "- Leftovers: cool and refrigerate within 2 hours.",
        "## Texture tip",
        "- Cook a few minutes longer with a splash more milk for a softer, smoother texture.",
        "## Nutrient note",
        "- Protein, calcium and vitamin D from fortified milk; fibre from oats.",
        "## Cost",
        "- About $0.90 a serving (model data)."] },
      { id:"dal", t:"Dal with soft rice", lines:[
        "Serves 4.",
        "## Ingredients",
        "- 1 cup split red or yellow lentils (masoor or toor dal), rinsed",
        "- 4 cups water; 1 cup rice",
        "- ½ tsp turmeric, 1 tsp cumin seeds, 1 tomato, garlic and ginger",
        "- Side: plain yogurt (raita)",
        "## Cultural swaps (optional)",
        "- Use the family’s own dal recipe and spice blend.",
        "- Serve with soft roti torn into the dal instead of rice.",
        "## Steps",
        "1. Wash your hands. Rinse the lentils and rice.",
        "2. Simmer the lentils with turmeric in the water for 25 to 30 minutes, until very soft.",
        "3. Cook the rice with a little extra water so it is very soft.",
        "4. Warm the cumin seeds, garlic, ginger and chopped tomato in a little oil, then stir them into the dal.",
        "5. Serve the dal over the rice, with yogurt on the side.",
        "## Safety",
        "- Hot liquids: dal can spit as it thickens; stir with a long spoon and turn the handle inward.",
        "- Knife safety: curl your fingertips when chopping the tomato, garlic and ginger.",
        "- Leftovers: cool and refrigerate within 2 hours; reheat until steaming hot.",
        "## Texture tip",
        "- Whisk the dal smooth and add water to loosen it if needed.",
        "## Nutrient note",
        "- Protein from lentils; the yogurt side adds calcium and B12.",
        "## Cost",
        "- About $1.00 a serving (model data)."] },
      { id:"salmon", t:"Baked salmon with soft-cooked vegetables", lines:[
        "Serves 4.",
        "## Ingredients",
        "- 4 salmon fillets (about 75 g each)",
        "- 2 cups frozen mixed vegetables or chopped carrots and squash",
        "- Lemon, dill, a little oil",
        "## Cultural swaps (optional)",
        "- Use trout or another fish the family enjoys.",
        "- Season with ginger and garlic, or a mild curry sauce, in place of dill.",
        "## Steps",
        "1. Wash your hands. Heat the oven to 200 °C.",
        "2. Place the fish on a lined tray, brush with a little oil, and season with lemon and dill.",
        "3. Bake 12 to 15 minutes, until the fish flakes easily and reaches 70 °C inside.",
        "4. Steam or simmer the vegetables until very tender.",
        "## Safety",
        "- Hot liquids and steam: lift pot lids away from you; use oven mitts for the tray.",
        "- Knife safety: curl your fingertips when cutting the vegetables.",
        "- Leftovers: cool and refrigerate within 2 hours.",
        "## Texture tip",
        "- Flake the fish and add a spoonful of sauce or broth to keep it moist.",
        "## Nutrient note",
        "- Protein, vitamin D and B12 from salmon; add a glass of fortified milk for calcium.",
        "## Cost",
        "- About $3.40 a serving (model data)."] }
    ]
  },
  cards:[
    ["Nutrient density", "Lots of nutrients per serving compared with its energy. Example: oatmeal made with milk vs tea biscuits."],
    ["Energy vs nutrients with age", "Energy needs usually fall; vitamin D, calcium, B12 and protein needs stay the same or rise."],
    // VERIFY: values on cards 3, 4 and 5 (plan).
    ["Vitamin D after 50", "RDA 15 µg (51–70), 20 µg (71+); Health Canada advises a 10 µg (400 IU) daily supplement for adults over 50."],
    ["Calcium after 50", "RDA 1200 mg for women 51+ and men 71+; 1000 mg for men 51–70."],
    ["Vitamin B12", "Less stomach acid can lower absorption from food; fortified foods or supplements may be advised."],
    ["Sarcopenia", "Age-related loss of muscle mass and strength; protein at each meal plus activity helps."],
    ["Thirst", "The thirst signal weakens with age: offer fluids regularly."],
    ["Taste and smell", "They fade with age; use herbs, spices and citrus, not extra salt."],
    ["Texture-modified foods", "Softer, moist or minced foods for chewing or swallowing difficulty; levels are set by health professionals."],
    ["Eating alone", "Linked to lower intake; shared and community meals help."],
    ["Drug–nutrient interactions", "Some medications change appetite, absorption or needs; ask a pharmacist or doctor."],
    ["Products “for seniors”", "Judge them by the label and price, not the name."]
  ]
};
