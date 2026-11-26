// HFA4U 07 Infant & Toddler Nutrition. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/07-infant-toddler.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (vitamin D dose, allergen timing, cow's
// milk timing and amount, the choking list, juice, plant beverages, toddler formulas) or a value this module had to supply.
// Students see the plan's wording. Module-written text (not in the plan) is marked "module-written" in a comment.
// Part 3 products are practice models (fictional brands); no nutrient values are invented beyond the plan's label excerpts.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
// module-written: course plan §2 "health information, not advice", worded for babies; plan risk 3 (allergy safety)
const ADVICE = "General information only. For a baby’s or toddler’s own needs, families talk to a doctor, nurse or registered dietitian. Babies with severe eczema or a known allergy need personal advice from a health care provider.";

// Misconception core sentences (plan §3)
const M1 = "At about 6 months a baby’s iron stores run low. Offer iron-rich foods first, at least twice a day.";
const M2 = "Introducing common allergens around 6 months (not before 4 months), and then offering them regularly, may lower the risk of allergy.";
const M3 = "Too much milk fills a toddler up and crowds out iron-rich foods; about 2–3 cups a day is plenty.";
const M4 = "Many toddlers need 8–15 or more relaxed tries before accepting a new food.";
const M5 = "Pressure and rewards usually backfire. Adults decide what is offered; the child decides how much.";
const M6 = "Honey can carry <em>Clostridium botulinum</em> spores, which can cause infant botulism. No honey before 12 months.";
const M7 = "Round foods can block a small airway. Cut grapes into quarters lengthwise for children under 4.";
const M8 = "Most toddlers don’t need them; family foods plus milk meet their needs.";
const DOR = "Adults decide what, when and where food is offered; the child decides whether and how much to eat.";

const IRON_LIST = "meat, fish, poultry, well-cooked egg, tofu, lentils, iron-fortified infant cereal";
const VITD = "Vitamin D 400 IU daily if breastfed";

export default {
  id:"07-infant-toddler",
  kind:"topic",
  title:"Infant and toddler nutrition",
  topic:"Infant & Toddler Nutrition",
  readyTopic:"infant and toddler nutrition",
  hero:{
    headline:"Three years, from milk to the family table.",
    text:"Babies grow faster in their first year than at any other time after birth. At first, <strong>breast milk or formula</strong> is all they need, plus <strong>vitamin D</strong> for breastfed babies. Around 6 months, <strong>iron-rich foods</strong> come first, textures change quickly, and <strong>common allergens</strong> join the menu. Then toddlers learn to eat with the family, while the adults decide <em>what</em> to serve and the child decides <em>how much</em>.",
    fig:{ html:'<div class="it-hero" id="it-hero"></div>', caption:"" },
    aria:"Six small dishes in a row, joined to an age line from 0 to 36 months: a bottle and a breastfeeding icon (0 to 6 months); a spoon of mashed lentils with an iron tag (6 months); a bowl of mashed and lumpy food (7 to 8 months); soft finger foods picked up with a pincer grasp (9 months); an open cup that replaces the bottle (12 months); and a toddler’s divided plate, half vegetables and fruits (2 years). Most of the change happens in the first year.",
    caption:"Most of the change happens in the first year."   // module-written caption (the dishes crowd the first year of the age line)
  },
  goals:[
    "I can describe how feeding changes from birth to age 3: milk, first foods, textures, family foods.",
    "I can explain why iron-rich first foods and vitamin D supplements matter for infants.",
    "I can prepare foods safely for babies and toddlers, including choking hazards, honey and allergen introduction.",
    "I can apply the division of responsibility to support healthy toddler eating.",
    "I can evaluate infant and toddler food products and claims.",
    "I can plan and prepare a day of food for a toddler that fits Canada’s Food Guide and the family’s culture."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Nutrient roles", goal:2,
          prompt:"Which mineral is needed for healthy blood and brain development, and runs low in babies at about 6 months?",
          options:[
            { t:"Iron", ok:true, why:"Babies are born with iron stores that run low at about 6 months." },
            { t:"Sodium", why:"Babies need very little added salt." },
            { t:"Calcium", why:"Calcium matters for bones, but iron is what runs low at 6 months." },
            { t:"Fluoride", why:"Fluoride protects teeth; it isn’t the 6-month concern." }],
          hints:["Which mineral carries oxygen in blood?", "The baby stored it during the last months of pregnancy.", "Iron."] },
        { id:"w2", skill:"Nutrient roles", goal:2,
          prompt:"Why does vitamin D matter for babies?",
          options:[
            { t:"It helps the body use calcium to build bones", ok:true, why:"A lack of vitamin D can cause rickets." },
            { t:"It provides energy", why:"Vitamins don’t provide energy." },
            // module-written: the plan marks this option "unrelated" without a sentence
            { t:"It prevents choking", why:"Choking is unrelated to vitamin D." },
            { t:"It replaces iron", why:"Different nutrients do different jobs." }],
          hints:["Think of the disease rickets.", "Bones need calcium plus a helper.", "Vitamin D helps the body use calcium."] },
        { id:"w3", skill:"Food safety", goal:3,
          prompt:"Why is honey not recommended for babies under 12 months?",
          options:[
            { t:"It can carry spores that cause infant botulism", ok:true, why:"A baby’s gut can’t yet stop the spores from growing." },
            { t:"It’s too sweet", why:"Sweetness isn’t the safety reason." },
            { t:"It causes cavities in new teeth", why:"Not the main reason for the 12-month rule." },
            { t:"It’s an allergen", why:"Honey isn’t one of the common food allergens." }],
          hints:["Which bacterium makes spores?", "<em>Clostridium botulinum</em>.", "Infant botulism."] },
        { id:"w4", skill:"Food safety", goal:3,
          prompt:"What is the temperature “danger zone” in which bacteria grow fastest?",
          options:[
            { t:"4 °C to 60 °C", ok:true, why:"Keep cold food at 4 °C or colder, and hot food at 60 °C or hotter." },
            { t:"−18 °C to 0 °C", why:"That’s freezer range; bacteria barely grow." },
            { t:"60 °C to 100 °C", why:"Hot holding is above 60 °C." },
            { t:"0 °C to 4 °C", why:"That’s fridge range: growth is slow (except <em>Listeria</em>)." }],
          hints:["Between fridge-cold and serving-hot.", "The fridge is 4 °C.", "4 °C to 60 °C."] },
        { id:"w5", skill:"Labels", goal:5,
          prompt:"On a Canadian ingredient list, ingredients are listed…",
          options:[
            // module-written why (the plan gives none for the correct option)
            { t:"From most to least by weight", ok:true, why:"The first ingredient is the biggest part by weight." },
            { t:"Alphabetically", why:"Order tells you amounts." },
            { t:"From healthiest to least healthy", why:"Order is by weight, not health." },
            { t:"In random order", why:"The order is required by law." }],
          hints:["The first ingredient is the biggest part.", "It’s ranked by amount.", "By weight."] },
        { id:"w6", skill:"Labels", goal:5,
          prompt:"Which ingredient name is a <strong>sugar</strong>?",
          options:[
            { t:"Concentrated fruit juice", ok:true, why:"Concentrated fruit juices are grouped with sugars on Canadian labels." },
            { t:"Whole grain oat flour", why:"That’s a grain." },
            { t:"Ascorbic acid", why:"That’s vitamin C." },
            { t:"Ferrous fumarate", why:"That’s an iron source." }],
          hints:["Sugars hide under many names.", "Juice concentrate is mostly sugar.", "Concentrated fruit juice."] }
      ],
      refreshers:{
        "Nutrient roles":"Iron builds blood and supports brain development; babies’ stores run low at about 6 months. Vitamin D helps the body use calcium; breast milk is naturally low in it.",
        "Food safety":"The danger zone is 4–60 °C. Honey can carry botulism spores, so no honey before 12 months.",
        "Labels":"Ingredients are listed by weight. Sugars have many names, including concentrated fruit juice."
      }
    }
  },
  explore:{
    heading:"First foods timeline",
    intro:"Slide from birth to age 3. See what changes, then try it with two personas: <strong>Ayo</strong> (7 months, breastfed) and <strong>Sasha</strong> (2 years).",
    modes:[{ id:"time", t:"Timeline" }, { id:"plate", t:"Safe plate" }, { id:"coach", t:"Mealtime coach" }],
    personas:[{ id:"ayo", t:"Ayo", sub:"7 months, breastfed" }, { id:"sasha", t:"Sasha", sub:"2 years" }],
    rowNames:{ milk:"Main milk", supp:"Supplement", iron:"Iron-rich foods", tex:"Textures", allerg:"Allergens", skills:"New skills", not:"Not yet" },
    // the plan's "Rules" column, shown under each row
    rules:{ milk:"Cow’s milk as main drink only from 9–12 months", supp:"Formula-fed babies get vitamin D from formula", iron:"From 6 months",
      tex:"Move steadily toward family textures", allerg:"Around 6 months, not before 4 months", skills:"Pincer grasp around 9 months" },
    notYet:{ solids:"Solid foods", water:"Water (small sips start at about 6 months)", honey:"Honey", nuts:"Whole nuts", cowmilk:"Cow’s milk as main drink",
      juice:"Juice", saltsugar:"Added salt and sugar", honey12:"Honey (until 12 months)", popcorn:"Whole nuts and popcorn (until age 4)",
      cut:"Whole grapes and hot dog rounds (cut them first)", juicepop:"Juice and pop (not needed)", candy:"Hard candy (until age 4)" },
    // The age steps. The 7–8 month row is the plan's example; the other ages are module-written from the plan's overview,
    // practice sorter and flashcards. VERIFY: every row against current Health Canada and CPS guidance (plan risk 1).
    ages:[
      { id:"a0", t:"0–6 months", short:"0–6 mo", dish:0, rows:{
        milk:"Breast milk or commercial infant formula: the baby’s whole diet",
        supp:VITD + "; formula-fed babies get vitamin D from formula",
        iron:"Not yet: babies use the iron stored before birth",
        tex:"Milk only: no solid foods yet",
        allerg:"Not yet (not before 4 months)",
        skills:"Feeding at the breast or from a bottle; the body and feeding skills aren’t ready for solids",
        not:["solids", "water", "honey", "cowmilk", "juice"] } },
      { id:"a1", t:"6 months", short:"6 mo", dish:1, rows:{
        milk:"Breast milk or commercial infant formula; small sips of water from an open cup can start",
        supp:VITD,
        iron:"Start now. Offer at least twice a day: " + IRON_LIST,
        tex:"Mashed, minced or ground first foods",
        allerg:"Start around now: peanut (thinned peanut butter, never whole nuts), well-cooked egg, and others",
        skills:"Ready for first foods: sitting with support",
        not:["honey", "nuts", "cowmilk", "juice", "saltsugar"] } },
      { id:"a2", t:"7–8 months", short:"7–8 mo", dish:2, rows:{
        milk:"Breast milk or commercial infant formula",
        supp:VITD,
        iron:"Offer at least twice a day: " + IRON_LIST,
        tex:"Mashed, minced, ground, lumpy; soft finger foods",
        allerg:"Peanut (thinned peanut butter, never whole nuts), well-cooked egg, and others, offered regularly",
        skills:"Sitting with support; bringing food to mouth",
        not:["honey", "nuts", "cowmilk", "juice", "saltsugar"] } },
      { id:"a3", t:"9–12 months", short:"9–12 mo", dish:3, rows:{
        milk:"Breast milk or formula; cow’s milk (3.25%) can become the main drink from 9–12 months",
        supp:VITD,
        iron:"Offer at least twice a day: " + IRON_LIST,
        tex:"Soft finger foods; chopped, lumpy family foods",
        allerg:"Keep offering peanut, egg and other common allergens regularly",
        skills:"Pincer grasp (around 9 months): picking up small soft pieces; drinking from an open cup",
        not:["honey12", "nuts", "juice", "saltsugar"] } },
      { id:"a4", t:"12–18 months", short:"12–18 mo", dish:4, rows:{
        milk:"Cow’s milk, about 2–3 cups a day, served in an open cup; breast milk can continue",
        supp:"If still breastfed, ask a health care provider about vitamin D drops; cow’s milk is a source of vitamin D",
        iron:"Iron-rich foods at meals every day; too much milk crowds them out",
        tex:"Family foods, cut up safely",
        allerg:"Keep common allergens in the diet regularly",
        skills:"Eats family foods at the table; a cup replaces the bottle",
        not:["popcorn", "cut", "juicepop"] } },
      { id:"a5", t:"18–24 months", short:"18–24 mo", dish:5, rows:{
        milk:"Cow’s milk, about 2–3 cups a day; water between meals",
        supp:"If still breastfed, ask a health care provider about vitamin D drops; cow’s milk is a source of vitamin D",
        iron:"Iron-rich foods at meals every day; too much milk crowds them out",
        tex:"Family foods, cut up safely",
        allerg:"Keep common allergens in the diet regularly",
        skills:"Uses a spoon with growing skill and some mess (spoon skills develop around 15–18 months)",
        not:["popcorn", "cut", "juicepop"] } },
      { id:"a6", t:"2–3 years", short:"2–3 yr", dish:6, rows:{
        milk:"Milk, about 2–3 cups a day; water as the drink of choice",
        supp:"Usually none needed when the child eats family foods and drinks milk; ask a health care provider",
        iron:"Iron-rich foods at meals every day",
        tex:"Family foods; round, hard and sticky foods still prepared to prevent choking until age 4",
        allerg:"Keep common allergens in the diet regularly",
        skills:"Eats with the family: the adult decides what, when and where; the child decides whether and how much",
        not:["popcorn", "cut", "candy", "juicepop"] } }
    ],
    plateGuide:"Half vegetables and fruits, a quarter whole grains, a quarter protein foods",   // hero / 2–3 year dish labels (Food Guide)
    tally:{ title:"Relaxed tries with broccoli", band:"Often 8–15 or more", max:15 },
    // ---- Safe plate (Sasha: the plan's TC2 table; Ayo: module-written from the plan's TC1 flags, E2 and C2 feedback) ----
    // VERIFY: the choking list against Health Canada and CPS guidance before release (plan TC2).
    plates:{
      sasha:{ title:"Sasha’s snack plate (2 years)", foods:[
        { id:"grapes", t:"Grapes", risk:"round", kind:"vf", preps:[
          { id:"whole", t:"Whole", fb:"Round foods can block the airway, even small ones." },
          { id:"half", t:"Halved crosswise", fb:"A half grape is still round enough to block a small airway. Quarter it lengthwise." },
          { id:"quarter", t:"Quartered lengthwise", ok:true, fb:"Quarters lengthwise are no longer round: safe for children under 4." }] },
        { id:"popcorn", t:"Popcorn", risk:"hard", kind:"grain", preps:[
          { id:"bowl", t:"Serve a small bowl", fb:"Popcorn isn’t for children under 4. Remove it from the plate." },
          { id:"remove", t:"Remove from plate", ok:true, fb:"Removed: popcorn isn’t for children under 4." }] },
        { id:"hotdog", t:"Hot dog", risk:"round", kind:"prot", preps:[
          { id:"rounds", t:"Rounds", fb:"Round slices match the size of a toddler’s airway. Cut it lengthwise into thin strips." },
          { id:"strips", t:"Thin lengthwise strips", ok:true, fb:"Thin strips are no longer round: safe." },
          // module-written feedback (the plan names no message for a whole hot dog)
          { id:"whole", t:"Whole", fb:"A whole hot dog is still round: bites match the size of a toddler’s airway. Cut it lengthwise into thin strips." }] },
        { id:"carrot", t:"Raw carrot", risk:"hard", kind:"vf", preps:[
          { id:"sticks", t:"Sticks", fb:"Hard raw vegetables are a choking hazard. Grate it or cook it until soft." },
          { id:"grated", t:"Grated", ok:true, fb:"Grated: the hard pieces are gone. Safe." },
          { id:"cooked", t:"Cooked until soft", ok:true, fb:"Cooked until soft: no longer hard. Safe." }] },
        { id:"pb", t:"Peanut butter", risk:"sticky", kind:"prot", preps:[
          { id:"spoon", t:"By the spoonful", fb:"Thick, sticky spoonfuls can block the airway. Spread it thinly." },
          { id:"spread", t:"Spread thinly on toast", ok:true, fb:"Spread thinly: no longer a sticky lump. Safe." }] }
      ] },
      // module-written plate for Ayo (7 months): each fact is from the plan (whole nuts are a choking hazard; thinned peanut
      // butter, never whole nuts; soft-cooked carrot sticks are a finger food; hard raw vegetables are a choking hazard)
      ayo:{ title:"Ayo’s finger foods (7 months)", foods:[
        { id:"peanut", t:"Peanut", risk:"hard", kind:"prot", preps:[
          { id:"whole", t:"Whole peanuts", fb:"Whole nuts are a choking hazard." },
          { id:"thinned", t:"Thinned peanut butter mixed into cereal", ok:true, fb:"Thinned into cereal: the safe way to offer peanut." }] },
        { id:"carrot", t:"Carrot", risk:"hard", kind:"vf", preps:[
          { id:"raw", t:"Raw sticks", fb:"Hard raw vegetables are a choking hazard." },
          { id:"soft", t:"Soft-cooked sticks", ok:true, fb:"Soft-cooked sticks are a finger food. Safe." }] },
        { id:"almond", t:"Almonds", risk:"hard", kind:"prot", preps:[
          { id:"whole", t:"Whole", fb:"Whole nuts are a choking hazard: not yet." },
          { id:"remove", t:"Remove from plate", ok:true, fb:"Removed: whole nuts are a choking hazard." }] }
      ] }
    },
    riskNames:{ round:"round", hard:"hard", sticky:"sticky" },
    // ---- Mealtime coach. Sasha: the plan's TC3 table. Ayo: module-written (one moment) from the plan's TC3 and M5/M6 wording.
    // side (wrong options only): where the "who decides?" meter points: "adult" = adults decide everything (pressure),
    // "child" = children decide everything (no structure); the best response points to the shared middle. Feedback marked module-written where the plan names none.
    coach:{
      meter:{ adult:"Adults decide everything, including how much: that’s pressure feeding.", child:"Children decide everything: that’s no structure at all.",
        ok:"Adult: what, when, where · Child: whether, how much", ends:["Adult decides everything", "Child decides everything"] },
      sasha:{ title:"Sasha (2) pushes away her broccoli at dinner.", moments:[
        { id:"m1", t:"She pushes the broccoli away.", options:[
          { t:"“Three bites, then you can leave”", side:"adult", fb:M5 },
          { t:"“Eat it and you’ll get dessert”", side:"adult", fb:"Rewards teach that vegetables are a chore and dessert is the prize." },
          { t:"Leave it on her plate, say nothing, and enjoy your own broccoli", ok:true, fb:"Leave it and model: no pressure, and she sees you enjoy it." },
          { t:"Make her a separate meal of her choice", side:"child", fb:"Short-order cooking takes the “what” decision away from the adult." }] },
        { id:"m2", t:"Planning tomorrow’s dinner.", options:[
          { t:"Never serve broccoli again", side:"child", fb:M4 },
          { t:"Serve broccoli again, next to a food she already likes", ok:true, fb:"Repeated, relaxed exposure works, and a familiar food makes the plate feel safe." },
          // module-written feedback for hiding vegetables
          { t:"Hide broccoli in everything", side:"adult", fb:"Hidden broccoli doesn’t give her the relaxed looks, smells and tastes she needs to learn to accept it." },
          { t:"Serve only foods she asks for", side:"child", fb:"That hands the “what” decision to the child. The adult still decides what is offered." }] },
        { id:"m3", t:"She says “full” after a few bites of pasta.", options:[
          { t:"“Clean your plate first”", side:"adult", fb:"Pressure overrides a child’s fullness cues." },
          { t:"“One more bite for me”", side:"adult", fb:"Pressure overrides a child’s fullness cues." },
          { t:"Trust her; offer the next snack at the usual time", ok:true, fb:"Trust her fullness cue: the child decides how much." },
          { t:"Give a cookie so she eats something", side:"child", fb:M5 }] }
      ] },
      ayo:{ title:"Ayo (7 months) is eating mashed lentils from a spoon.", moments:[
        { id:"a1", t:"He turns his head away from the spoon after a few spoonfuls.", options:[
          { t:"“One more spoonful for me”", side:"adult", fb:"Pressure overrides a child’s fullness cues." },
          { t:"Mix in a little honey to make it tastier", side:"adult", fb:"No honey before 12 months: infant botulism." },
          { t:"Trust him; offer the next feeding at the usual time", ok:true, fb:"Trust his fullness cue: the child decides how much." },
          { t:"Switch to fruit purée so he eats something", side:"child", fb:"Short-order cooking takes the “what” decision away from the adult, and iron-rich foods come first." }] }
      ] }
    },
    // ---- TC1 day planner: the plan's card library (flags shown on each card) ----
    tc1:{
      times:["Feeding time 1", "Feeding time 2", "Feeding time 3", "Feeding time 4"],
      vitD:"Vitamin D drops",
      cards:[
        { id:"cereal", t:"Iron-fortified infant cereal", iron:true },
        { id:"lentils", t:"Mashed lentils", iron:true },
        { id:"chicken", t:"Minced chicken", iron:true },
        { id:"egg", t:"Well-cooked scrambled egg", iron:true, allergen:"egg" },
        { id:"pb", t:"Thinned peanut butter mixed into cereal", allergen:"peanut" },
        { id:"avocado", t:"Mashed avocado" },
        { id:"carrot", t:"Soft-cooked carrot sticks", finger:true },
        { id:"banana", t:"Mashed banana" },
        { id:"yogurt", t:"Plain yogurt", allergen:"milk" },
        { id:"juice", t:"Apple juice", notYet:"not yet" },
        { id:"honey", t:"Honey on toast", notYet:"not yet: honey" },
        { id:"almonds", t:"Whole almonds", notYet:"not yet: choking" },
        { id:"cowmilk", t:"Cow’s milk in a bottle", notYet:"not yet as main drink" }
      ]
    },
    predIntro:"Make a prediction first. Then the timeline will show you what really happens.",
    predictions:[
      { id:"p1", age:1, hide:["iron", "not"],
        prompt:"Which foods should come first?",
        options:[{ t:"Iron-rich foods, like lentils, meat or iron-fortified infant cereal", ok:true }, { t:"Fruit purées, because babies like sweet tastes" }, { t:"Apple juice in a bottle" }, { t:"Cow’s milk" }],
        explain:"Iron stores run low at about 6 months. Iron-rich foods first, at least twice a day." },
      { id:"p2", age:0, to:1, hide:["allerg"],
        prompt:"When should most babies first try peanut (as thinned peanut butter, never whole nuts)?",
        options:[{ t:"Around 6 months, when they’re ready for solids (not before 4 months)", ok:true }, { t:"After their first birthday" }, { t:"After age 3" }, { t:"Only after a blood test" }],
        // VERIFY: CPS allergen-introduction guidance
        explain:"Introducing common allergens around 6 months, then keeping them in the diet, may lower allergy risk. Babies with severe eczema or a known allergy should get personal advice from a health care provider." },
      { id:"p3", age:5, hide:[],
        prompt:"Sasha spits out broccoli. How many relaxed tries might it take before she accepts it?",
        fixedOrder:true,
        options:[{ t:"1" }, { t:"2" }, { t:"Often 8–15 or more", ok:true }, { t:"She never will" }],
        explain:"Toddlers are often wary of new foods. Repeated, low-pressure exposure works." },
      { id:"p4", age:2, to:3, hide:["milk"],
        prompt:"When can cow’s milk become the main drink?",
        fixedOrder:true,
        options:[{ t:"At birth" }, { t:"At 4 months" }, { t:"At 9–12 months", ok:true }, { t:"At 5 years" }],
        // VERIFY: cow's milk timing and the toddler amount
        explain:"Before then, breast milk or formula. After 12 months, keep it to about 2–3 cups a day so it doesn’t crowd out iron-rich foods." }
    ],
    chalIntro:"Use the timeline’s modes (and the day planner in challenge 1) to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3],
        prompt:"Plan Ayo’s day (7 months, breastfed): 4 feeding times, each with 1–2 food cards.",
        how:"Choose a feeding time, then tap cards to add them (tap a card in a feeding time to take it back). Switch on the vitamin D drops if they’re needed.",
        msgs:{
          honey:"No honey before 12 months: infant botulism.",
          juice:"Babies don’t need juice; offer breast milk, and later water in an open cup.",
          // module-written from the plan's own feedback (E2 fix C, E1 fix C)
          almonds:"Whole nuts are a choking hazard.",
          cowmilk:"Not as the main milk before 9–12 months.",
          iron:"Offer iron-rich foods at least twice a day.",
          vitD:"Breastfed babies need a vitamin D supplement.",   // VERIFY: Health Canada vitamin D advice
          allergen:"Add one allergen card (egg or thinned peanut butter).",
          times:"Give each of the 4 feeding times 1–2 food cards.",   // module-written (the prompt's "4 feeding times, each with 1–2 food cards")
          full:"Each feeding time takes 1–2 food cards. Take one out first."
        },
        general:"Look for the iron-rich tags.",
        why:"Vitamin D drops, iron-rich foods at two or more feeding times, an allergen, and nothing from the “not yet” list.",   // module-written
        hints:["Look for the iron-rich tags.", "Add one allergen card (egg or thinned peanut butter).", "Cereal, lentils, egg, avocado, plus vitamin D drops."] },
      { id:"tc2", goal:3,
        prompt:"<strong>Safe plate</strong> mode: make Sasha’s (2 years) snack plate safe.",
        general:"Round, hard and sticky foods are the risky ones.",
        why:"Quarter, strip, grate or cook, spread thinly, and remove: changing the shape takes away the choking risk.",   // module-written
        hints:["Round, hard and sticky foods are the risky ones.", "Change the shape: quarter, strip, grate, spread.",
          "Grapes quartered lengthwise; popcorn removed from the plate; hot dog in thin lengthwise strips; carrot grated or cooked until soft; peanut butter spread thinly on toast."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"<strong>Mealtime coach</strong> mode: Sasha (2) pushes away her broccoli at dinner. Choose a response at each of 3 moments.",
        msgs:{ open:"Choose a response at each of the 3 moments." },   // module-written
        general:"No pressure, no bribes, no separate meals.",
        why:"The “who decides?” m&#101;ter reads “Adult: what, when, where · Child: whether, how much”.",
        hints:["Who decides <em>what</em>? Who decides <em>how much</em>?", "No pressure, no bribes, no separate meals.", "Leave it and model; serve it again with a familiar food; trust “full”."] }
    ],
    blocks:[
      { title:"What the timeline shows", html:"<p>The shift from milk to family foods is <strong>fast</strong>, <strong>iron-rich</strong> and <strong>textured</strong>. Safety comes from <em>how</em> food is prepared, and good eating comes from <em>how</em> adults respond.</p><p><strong>The division of responsibility (Ellyn Satter):</strong> " + DOR + " Pressure, bribes and “clean your plate” usually backfire. Repeated, relaxed exposure (often 8–15 tries or more) is how toddlers come to accept new foods.</p><p class=\"tiny muted\">" + ADVICE + "</p>" }
    ]
  },
  part3:{
    slug:"products", name:"Products", heading:"Products for the youngest",
    intro:"Six <strong>practice model</strong> products (fictional brands). For each one, choose <strong>Fits the guidance</strong>, <strong>Fine sometimes</strong> or <strong>Not needed or not recommended</strong>, then open <strong>Check it with data</strong> to compare the label with the guidance.",
    verdicts:[{ id:"fits", t:"Fits the guidance" }, { id:"some", t:"Fine sometimes" }, { id:"not", t:"Not needed or not recommended" }],
    note:"Teachers may add current real products, credited, as extra cards. These practice models are made up for the module.",
    // VERIFY: every guidance line before release (plan: all verify). Label excerpts are the plan's; packaging details are module-written.
    products:[
      { id:"pr1", brand:"SproutStart", name:"Iron-Fortified Infant Cereal", pack:"box", claim:"Iron-fortified", answer:"fits",
        label:{ rows:[["Iron", "40 %"]], per:"per serving" },
        guide:"Iron-fortified infant cereal is a recommended first food." },
      { id:"pr2", brand:"LittleSip", name:"Toddler Juice Box", pack:"juice", claim:"100% juice", answer:"not",
        label:{ ingr:"Concentrated apple juice (listed first)" },
        guide:"Juice isn’t needed; water and milk are the drinks for toddlers." },
      { id:"pr3", brand:"GrowRight", name:"Growing-Up Formula, 12+ months", pack:"tin", claim:"Supports brain development", answer:"not",
        label:{ text:"For toddlers 12 months and older" },
        guide:"Family foods plus about 2–3 cups of milk usually meet needs (CPS and Health Canada).", gloss:"Not needed (most toddlers)." },
      { id:"pr4", brand:"Squeeze & Go", name:"Veggie Pouch", pack:"pouch", claim:"Veggie", answer:"some",
        label:{ ingr:"Apple purée, pear purée, spinach purée" },
        guide:"Convenient now and then, but sucking from a pouch skips spoon and chewing practice, and fruit often dominates." },
      { id:"pr5", brand:"Crunchy Teethers", name:"Rice-Based Biscuits", pack:"biscuit", claim:"For 6+ months", answer:"some",
        label:{ text:"Rice-based biscuits for babies 6 months and older" },
        guide:"Can be offered, but they’re low in nutrients compared with iron-rich foods." },
      { id:"pr6", brand:"Organic Toddler", name:"Fruit Bites", pack:"bag", claim:"Organic", answer:"some",
        label:{ ingr:"Organic concentrated fruit juice (a source of sugars)" },
        guide:"“Organic” doesn’t mean low in sugar; read the ingredient list.", gloss:"Fine sometimes, at most." }
    ],
    // VERIFY: reference details before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Du Toit, G., Roberts, G., Sayre, P. H., Bahnson, H. T., Radulovic, S., Santos, A. F., Brough, H. A., Phippard, D., Basting, M., Feeney, M., Turcanu, V., Sever, M. L., Gomez Lorenzo, M., Plaut, M., &amp; Lack, G. (2015). Randomized trial of peanut consumption in infants at risk for peanut allergy. <i>New England Journal of Medicine, 372</i>(9), 803–813.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada, Canadian Paediatric Society, Dietitians of Canada, &amp; Breastfeeding Committee for Canada. (2014). <i>Nutrition for healthy term infants: Recommendations from six to 24 months</i>. Government of Canada.</li><li>Satter, E. (2000). <i>Child of mine: Feeding with love and good sense</i> (Rev. ed.). Bull Publishing.</li></ul>' }],
    quickCheck:{
      title:"Products quick check", summary:"Products quick check",
      items:[
        { id:"q1", goal:5, prompt:"A label says “supports brain development”. What’s the first thing to check?",
          choices:[{ t:"Evidence and the guidance", ok:true, fb:"Right. A claim isn’t evidence, so check it against the evidence and the guidance." },
            { t:"The colour of the box", fb:"A claim isn’t evidence." }, { t:"The price", fb:"A claim isn’t evidence." }, { t:"The number of flavours", fb:"A claim isn’t evidence." }] },
        { id:"q2", goal:[5, 1], prompt:"Which drink fits a 2-year-old’s day best?",
          choices:[{ t:"Water in an open cup", ok:true, fb:"Right. Water and milk are the drinks for toddlers." },
            { t:"Juice box", fb:"Water and milk are the drinks for toddlers." }, { t:"Sports drink", fb:"Water and milk are the drinks for toddlers." }, { t:"Pop", fb:"Water and milk are the drinks for toddlers." }] },
        { id:"q3", goal:5, prompt:"Why might a pouch be “fine sometimes” rather than “always”?",
          choices:[{ t:"It skips spoon and chewing practice", ok:true, fb:"Right. Feeding skills grow with spoons, cups and finger foods." },
            { t:"Pouches are illegal", fb:"Feeding skills grow with spoons, cups and finger foods." }, { t:"Pouches contain honey", fb:"Feeding skills grow with spoons, cups and finger foods." }, { t:"Pouches have no calories", fb:"Feeding skills grow with spoons, cups and finger foods." }] },
        { id:"q4", goal:5, prompt:"“Organic” on a toddler snack means…",
          choices:[{ t:"It was produced under organic rules", ok:true, fb:"Right. Organic is about production methods, not nutrition." },
            { t:"It’s low in sugar", fb:"Organic is about production methods, not nutrition." }, { t:"It’s iron-rich", fb:"Organic is about production methods, not nutrition." }, { t:"It’s allergen-free", fb:"Organic is about production methods, not nutrition." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"ages", type:"sorter", title:"Which age?", summary:"Which age?", goal:[1, 3], noun:"card", txt:true,
        instruction:"Sort each feeding fact into the age it belongs to.",
        boxes:[{ id:"b0", label:"0–6 months" }, { id:"b6", label:"6–12 months" }, { id:"b12", label:"12–36 months" }],
        items:[
          { id:"i1", t:"Breast milk or formula only, plus vitamin D if breastfed", answer:"b0", why:"Solids start around 6 months.", wrong:{ b6:"Solids start around 6 months.", b12:"Solids start around 6 months." } },
          { id:"i2", t:"First iron-rich foods, mashed or minced", answer:"b6", why:"Iron-rich foods begin around 6 months.", wrong:{ b0:"Iron-rich foods begin around 6 months.", b12:"Iron-rich foods begin around 6 months." } },
          { id:"i3", t:"Water offered in an open cup with meals", answer:"b6", why:"Small sips of water can start at about 6 months.", wrong:{ b0:"Small sips of water can start at about 6 months.", b12:"Small sips of water can start at about 6 months." } },
          // VERIFY: cow's milk timing
          { id:"i4", t:"Cow’s milk (3.25%) becomes the main milk", answer:"b6", why:"From 9–12 months.", wrong:{ b0:"From 9–12 months.", b12:"From 9–12 months." },
            hints:["Before this age, breast milk or formula is the main milk.", "It’s late in the first year.", "9–12 months."] },
          { id:"i5", t:"Honey on toast is OK", answer:"b12", why:"Never before 12 months.", wrong:{ b0:"Never before 12 months.", b6:"Never before 12 months." } },
          { id:"i6", t:"Pincer grasp: picking up small soft pieces", answer:"b6", why:"Around 9 months.", wrong:{ b0:"Around 9 months.", b12:"Around 9 months." } },
          // module-written feedback (the plan gives none for item 7)
          { id:"i7", t:"Eats family foods, cut up safely, at the table", answer:"b12", why:"Toddlers move on to family foods, cut up safely.", wrong:{ b0:"Toddlers move on to family foods, cut up safely.", b6:"Toddlers move on to family foods, cut up safely." } },
          { id:"i8", t:"Peanut first offered as thinned peanut butter", answer:"b6", why:"Around 6 months, not before 4.", wrong:{ b0:"Around 6 months, not before 4.", b12:"Around 6 months, not before 4." } },
          // VERIFY: the toddler milk amount
          { id:"i9", t:"About 2–3 cups of milk a day, not more", answer:"b12", why:"The toddler milk limit.", wrong:{ b0:"The toddler milk limit.", b6:"The toddler milk limit." } },
          { id:"i10", t:"Uses a spoon with growing skill and some mess", answer:"b12", why:"Spoon skills develop around 15–18 months.", wrong:{ b0:"Spoon skills develop around 15–18 months.", b6:"Spoon skills develop around 15–18 months." } }
        ] },
      // Options beyond the plan's best answer and its "most likely wrong choice" are module-written; their feedback reuses
      // the plan's own sentences where one fits. Question stems for C1–C5 ("What's the best advice?") are module-written.
      { id:"family", type:"mc", title:"Help the family", summary:"Help the family", star:true, goal:[2, 3, 4, 5, 6],
        instruction:"Six families, six questions. Choose the best advice. Cases marked ★ are non-routine; C6 is an investigation.",
        items:[
          { id:"c1", goal:3, prompt:"<strong>C1.</strong> A parent wants to make homemade formula from cow’s milk for a 3-month-old. What’s the best advice?",
            options:[
              // VERIFY: Health Canada guidance on homemade formula
              { t:"Use a commercial infant formula, prepared exactly as the label says", ok:true, why:"Homemade formulas can’t match infant needs and can be unsafe." },
              { t:"Make the homemade formula, following the recipe carefully", why:"Homemade formulas can’t match infant needs and can be unsafe." },
              { t:"Give plain cow’s milk in a bottle instead", why:"Not as the main milk before 9–12 months." },
              { t:"Sweeten plain milk with a little honey", why:"No honey before 12 months: infant botulism." }] },
          { id:"c2", goal:2, prompt:"<strong>C2.</strong> An 18-month-old drinks about 6 cups of milk a day and seems tired and pale. What’s the best advice?",
            options:[
              { t:"Too much milk may be crowding out iron-rich foods; talk to a provider and offer about 2–3 cups with iron-rich meals", ok:true, why:M3 },
              { t:"More milk will help", why:"Milk is low in iron and fills a small stomach." },
              { t:"Swap some milk for juice for energy", why:"Juice adds sugar, not iron." },
              { t:"Nothing needs to change: milk is always healthy", why:M3 }] },
          { id:"c3", goal:[2, 6], prompt:'<span class="it-star">★</span> <strong>C3.</strong> A vegetarian family is starting solids for a 6-month-old. What’s the best advice?',
            options:[
              { t:"Lentils, tofu, well-cooked egg and iron-fortified cereal, paired with a vitamin C food", ok:true, why:M1 + " Vitamin C helps the body absorb iron from plant foods." },
              { t:"Start with fruit only", why:M1 },
              { t:"Wait until 12 months to start solids", why:"Too late: iron needs aren’t met." },
              { t:"The baby must eat meat, so add it anyway", why:"Lentils, tofu, well-cooked egg and iron-fortified cereal are iron-rich vegetarian first foods." }] },
          // VERIFY: plant-beverage advice for young children
          { id:"c4", goal:[2, 5], prompt:'<span class="it-star">★</span> <strong>C4.</strong> A family offers an almond beverage as a 14-month-old’s main milk. What’s the best advice?',
            options:[
              { t:"Plant beverages like almond or rice are low in protein and energy and aren’t suitable as a young child’s main milk; ask a provider about alternatives", ok:true, why:"Not for a toddler’s main milk: a provider can suggest alternatives." },
              { t:"It’s just as good", why:"Not for a toddler’s main milk." },
              { t:"Offer more of it, about 6 cups a day", why:"More of a low-protein drink doesn’t fix it, and big drinks crowd out iron-rich foods." },
              { t:"Switch to apple juice", why:"Juice isn’t needed; water and milk are the drinks for toddlers." }] },
          { id:"c5", goal:[2, 3], prompt:'<span class="it-star">★</span> <strong>C5.</strong> A family follows baby-led weaning (finger foods from the start), but the baby rarely eats iron-rich foods. What’s the best advice?',
            options:[
              { t:"Any feeding style works if iron-rich foods come at least twice daily and foods are safe: offer soft strips of meat, lentil patties, egg", ok:true, why:"Either style can work when iron and safety are covered." },
              { t:"Baby-led weaning is unsafe", why:"Either style can work when iron and safety are covered." },
              { t:"Offer fruit finger foods only", why:M1 },
              { t:"Offer whole nuts as an iron-rich finger food", why:"Whole nuts are a choking hazard." }] },
          // VERIFY: LEAP trial details (2015)
          { id:"c6", goal:[3, 5], prompt:'<span class="it-star">★ Investigation</span> <strong>C6.</strong> In a large trial, babies at high risk of peanut allergy were <strong>randomly assigned</strong> to eat peanut early or avoid it; fewer in the early group developed the allergy (the LEAP trial, 2015). What can we conclude?',
            options:[
              { t:"Early introduction <strong>caused</strong> a lower allergy rate <strong>in high-risk infants</strong>; results may differ for other groups", ok:true, why:"Random assignment supports cause and effect, for the group studied." },
              { t:"Peanut avoidance prevents allergy", why:"That’s the opposite of the result." },
              { t:"It proves the result for every baby", why:"The trial studied high-risk infants." },
              { t:"It shows only a link, not cause and effect", why:"Random assignment supports cause and effect, for the group studied." }],
            hints:["What does random assignment allow you to conclude?", "It supports cause and effect, for the group studied.", "Early introduction lowered risk in high-risk infants."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Gwen", goal:[1, 2, 3], how:"",
        instruction:"Gwen made one mistake in each plan. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Plan the first week of solids for a 6-month-old.",
            steps:["Keep breastfeeding and giving vitamin D drops.", "Day 1: start with apple juice in a bottle so the baby gets used to new tastes.", "Day 2: add iron-fortified infant cereal.", "Day 3: add mashed lentils."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is good. The mistake is earlier.", "Step 4 is good."],
            fixes:[
              { t:"Start with iron-rich foods such as iron-fortified cereal or lentils; skip juice.", ok:true, why:M1 },
              { t:"Start with honey to make cereal tasty.", why:M6 },
              { t:"Start with cow’s milk in a bottle.", why:"Not as the main milk before 9–12 months." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["What runs low at 6 months?", "Iron.", "Iron-rich first; no juice."] },
          { id:"e2", goal:3, task:"Plan allergen introduction for a 6-month-old with no allergy history.",
            steps:["Wait until the baby is eating some solids.", "Avoid peanut and egg until age 3 to prevent allergies.", "Offer peanut as thinned peanut butter, never whole nuts.", "Once introduced, keep offering it regularly."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is correct form, but the mistake is earlier.", "Step 4 is correct."],
            fixes:[
              // VERIFY: CPS allergen guidance
              { t:"Introduce peanut and egg around 6 months (not before 4), in safe forms, and keep offering them regularly.", ok:true, why:M2 },
              { t:"Avoid all allergens until school age.", why:M2 },
              { t:"Introduce whole peanuts at 6 months.", why:"Whole nuts are a choking hazard." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Does delay prevent allergy?", "The evidence points the other way.", "Around 6 months, in safe forms."] },
          { id:"e3", goal:1, task:"Advise a parent of a 2-year-old on drinks.",
            steps:["Offer water between meals.", "Skip juice and pop.", "Milk is healthy, so let him drink as much as he wants.", "Serve milk in an open cup at meals."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is fine."],
            fixes:[
              // VERIFY: the toddler milk amount; plant-beverage advice
              { t:"About 2–3 cups of milk a day is enough; more can crowd out iron-rich foods.", ok:true, why:M3 },
              { t:"Stop milk completely.", why:"Milk provides calcium and vitamin D." },
              { t:"Switch to almond beverage.", why:"Not suitable as the main milk." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["What happens to iron if milk fills a toddler up?", "Milk is low in iron.", "About 2–3 cups a day."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"Which change on the timeline surprised you most: how early allergens are introduced, the iron-first rule, or how fast textures change?" },
      { id:"j2", q:"In your own words, explain the division of responsibility and why it works." },
      { id:"j3", q:"Explain to a new babysitter how to make a snack plate safe for a 2-year-old." },
      { id:"j4", q:"What’s one baby or toddler product claim you’d now question? What would you check first?" }
    ]
  },
  final:{
    // module-written: feedback for correct options the plan leaves bare, and for options the plan tags only with a misconception code
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Why does Health Canada advise a vitamin D supplement for breastfed babies?", options:[
          { t:"Breast milk is naturally low in vitamin D", ok:true, why:"The supplement helps prevent rickets." },   // VERIFY
          { t:"Breast milk has too much vitamin D", why:"The opposite is true." },
          { t:"Vitamin D replaces iron", why:"Different nutrients do different jobs." },
          { t:"Only premature babies need vitamin D", why:"The advice applies to all breastfed babies." }] },
        b:{ prompt:"What daily vitamin D supplement does Health Canada advise for breastfed babies?", options:[
          { t:"400 IU", ok:true, why:"Health Canada advises 400 IU a day for breastfed babies." },   // VERIFY: dose
          { t:"40 IU", why:"Ten times too low." },
          { t:"4000 IU", why:"That’s the upper limit for older children and adults, not an infant supplement." },
          { t:"None", why:"Breast milk is low in vitamin D." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Around what age do most babies start solid foods?", options:[
          { t:"About 6 months", ok:true, why:"Around 6 months, iron stores run low and babies are ready for solids." },
          { t:"2 months", why:"Too early: their bodies and skills aren’t ready." },
          { t:"12 months", why:"Too late: iron needs aren’t met." },
          { t:"18 months", why:"Far too late." }] },
        b:{ prompt:"Which should be among a baby’s very first foods?", options:[
          { t:"Iron-rich foods such as lentils or iron-fortified cereal", ok:true, why:M1 },
          { t:"Juice", why:M1 },
          { t:"Plain rice crackers only", why:"Low in iron." },
          { t:"Cow’s milk as the main drink", why:"Not before 9–12 months." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Why shouldn’t babies under 12 months have honey?", options:[
          { t:"It can cause infant botulism", ok:true, why:M6 },
          { t:"It’s too sticky", why:"Texture isn’t the reason." },
          { t:"It’s a common allergen", why:"It isn’t." },
          { t:"It has no nutrients", why:"That’s not the reason for the rule." }] },
        b:{ prompt:"How should grapes be cut for a 2-year-old?", options:[
          { t:"Into quarters lengthwise", ok:true, why:M7 },
          { t:"In half crosswise", why:M7 },
          { t:"Left whole if they’re small", why:"Round foods can block the airway." },
          { t:"Frozen whole", why:"Still a choking hazard." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Ayo is 6 months old, eats iron-rich foods well, and has no history of allergy or eczema. His parent wants to try peanut. What’s the best plan?", options:[
          { t:"Offer a little smooth peanut butter thinned into cereal now, then keep it in his diet regularly", ok:true, why:M2 },   // VERIFY
          { t:"Wait until age 3", why:M2 },
          { t:"Offer whole peanuts", why:"Choking hazard." },
          { t:"Offer it once, then avoid it", why:"Regular offering matters after introduction." }] },
        b:{ prompt:"A 6-month-old with no allergy history is ready for solids. How should egg be introduced?", options:[
          { t:"Well-cooked egg (e.g. scrambled), then offered regularly", ok:true, why:M2 },
          { t:"Raw egg in a smoothie", why:"Raw egg is a <em>Salmonella</em> risk." },
          { t:"Wait until age 2", why:M2 },
          { t:"Only egg white at age 5", why:"Delaying isn’t recommended." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"An 18-month-old drinks about 6 cups of milk a day, eats little at meals and is often tired. What is most likely happening?", options:[
          { t:"Too much milk is crowding out iron-rich foods, which can lead to low iron", ok:true, why:M3 },
          { t:"The child needs more milk", why:M3 },
          { t:"The child needs juice for energy", why:"Juice adds sugar, not iron." },
          { t:"Milk is causing too much iron", why:"Milk is low in iron." }] },
        b:{ prompt:"A 2-year-old drinks several cups of juice a day and refuses meals. Best first step?", options:[
          { t:"Replace juice with water between meals, and offer milk and meals at regular times", ok:true, why:"Water and milk are the drinks for toddlers, and regular meal times leave room for food." },
          { t:"Add more juice at meals", why:"Juice fills a small stomach." },
          { t:"Force them to finish meals", why:M5 },
          { t:"Switch to sports drinks", why:"Not suitable for toddlers." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"At daycare, a 3-year-old refuses lentil soup the first time it’s served. Which approach is most likely to work over time?", options:[
          { t:"Serve it again on other days beside familiar foods, without pressure", ok:true, why:M4 },
          { t:"Remove lentils from the menu forever", why:M4 },
          { t:"Offer a treat for each spoonful", why:M5 },
          { t:"Make the child sit until it’s finished", why:M5 }] },
        b:{ prompt:"At a family dinner, a toddler eats two helpings of pasta and no vegetables. What fits the division of responsibility?", options:[
          { t:"Keep serving balanced family meals; let the child decide how much of each to eat", ok:true, why:DOR },
          { t:"Remove the pasta until vegetables are eaten", why:M5 },
          { t:"Make vegetables the dessert reward", why:M5 },
          { t:"Cook only pasta from now on", why:"The adult still decides what is offered." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the clearest explanation of the division of responsibility?", options:[
          { t:"“Adults decide what, when and where food is offered; the child decides whether and how much to eat.”", ok:true, why:"That’s Ellyn Satter’s division of responsibility: structure from adults, trust in the child’s appetite." },
          { t:"“The child decides what to eat; adults decide how much.”", why:"Reversed." },
          { t:"“Adults decide everything, including how much.”", why:"That’s pressure feeding. " + M5 },
          { t:"“Children decide everything.”", why:"That’s no structure at all." }] },
        b:{ prompt:"Which is the clearest explanation of why rewarding vegetables with dessert backfires?", options:[
          { t:"“It teaches that vegetables are a chore and dessert is the prize, so children may like vegetables less.”", ok:true, why:"Rewards teach that vegetables are a chore and dessert is the prize." },
          { t:"“It works well every time.”", why:M5 },
          { t:"“Dessert has more vitamins.”", why:"Not the point." },
          { t:"“Because dessert is a bad food.”", why:"The course doesn’t use moral food labels; the problem is the reward." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which statement about textures is correct?", options:[
          { t:"“Babies move from mashed and minced foods to soft finger foods and family textures during the first year.”", ok:true, why:"Textures move quickly from mashed and minced to soft finger foods and then family foods." },
          { t:"“Babies should eat only smooth purées until age 2.”", why:"Delaying lumpy textures can make feeding harder." },   // VERIFY
          { t:"“Texture doesn’t matter for babies.”", why:"It matters for skills and safety." },
          { t:"“Babies should start with hard raw vegetables.”", why:"Choking hazard." }] },
        b:{ prompt:"Which statement about cow’s milk is correct?", options:[
          { t:"“Cow’s milk can become the main drink at 9–12 months; after that, about 2–3 cups a day is plenty.”", ok:true, why:"Before then, breast milk or formula; after 12 months, about 2–3 cups a day leaves room for iron-rich foods." },   // VERIFY
          { t:"“Cow’s milk is the best first drink at birth.”", why:"Breast milk or formula first." },
          { t:"“Toddlers should drink as much milk as they want.”", why:M3 },
          { t:"“Toddlers should never drink cow’s milk.”", why:"It’s an important source of calcium and vitamin D." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"An ad says a toddler formula “is essential for healthy brain growth.” What’s the best response?", options:[
          { t:"Most toddlers don’t need it; check the CPS and Health Canada guidance and the evidence", ok:true, why:M8 },   // VERIFY
          { t:"Buy it because the ad is from a big company", why:"Size isn’t evidence." },
          { t:"Switch the toddler off all milk", why:"Milk still fits." },
          { t:"Use it in place of meals", why:"Toddlers need family foods." }] },
        b:{ prompt:"A parent relies on fruit pouches for most of a toddler’s meals. What’s the best advice?", options:[
          { t:"Pouches are fine sometimes, but spoons, cups and finger foods build skills; include iron-rich foods and vegetables", ok:true, why:"Feeding skills grow with spoons, cups and finger foods." },
          { t:"Pouches are perfect for every meal", why:"They skip skills, and fruit dominates." },
          { t:"Pouches are dangerous and must be banned", why:"Over-generalizing." },
          { t:"Add honey to pouches for energy", why:"After 12 months honey is safe, but it adds sugar and isn’t needed." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Which lunch best fits Canada’s Food Guide for a 2-year-old?", options:[
          { t:"Soft-cooked vegetables, half a whole-wheat pita with hummus, strips of chicken, and water", ok:true, why:"Vegetables, a whole grain, protein foods and water, all safe for a 2-year-old." },
          { t:"Juice and crackers", why:"No vegetables, protein or water." },
          { t:"A bowl of popcorn and cheese", why:"Popcorn is a choking hazard." },
          { t:"Only milk, three cups", why:"Not a meal, and too much milk." }] },
        b:{ prompt:"Which snack fits a <strong>nut-free</strong> daycare for a 3-year-old?", options:[
          { t:"Plain yogurt with soft berries", ok:true, why:"Nut-free, and soft enough to be safe." },
          { t:"Peanut butter on toast", why:"Not nut-free." },
          { t:"Whole grapes", why:"Choking hazard unless quartered." },
          { t:"Hard candy", why:"Choking hazard." }] } }
    ]
  },
  task:{
    title:"Sasha’s day", summary:"Sasha’s day",
    statement:"<p>Plan one day of meals and snacks for <strong>Sasha (2 years)</strong>, whose family is Filipino-Canadian, that meets every condition. Then use the kitchen card to prepare one of the snacks.</p>",
    how:"Choose a meal or snack, then tap foods to add them (1–3 foods each). Choose the cut for any food that needs one, and add drinks below.",
    slots:[{ id:"b", t:"Breakfast" }, { id:"s1", t:"Morning snack" }, { id:"l", t:"Lunch" }, { id:"s2", t:"Afternoon snack" }, { id:"d", t:"Dinner" }],
    groups:[{ id:"family", t:"Family foods" }, { id:"other", t:"Other foods" }],
    // Flags from the plan. Cards with preps get a preparation chooser; prep "risk" marks an unsafe preparation (line 6).
    // Grapes, hot dog and peanut butter merge the plan's safe and hazard cards into one card with a chooser.
    // "Steamed rice" is added because the plan's valid plan 3 uses rice (module choice, see the report).
    // VERIFY: the Filipino-Canadian dishes with someone familiar with them (plan risk 2).
    foods:[
      { id:"arroz", t:"Arroz caldo (rice porridge with chicken and ginger)", short:"arroz caldo", group:"family", iron:true },
      { id:"pancit", t:"Pancit with vegetables", short:"pancit", group:"family", vf:true },
      { id:"sinigang", t:"Sinigang with soft vegetables", short:"sinigang", group:"family", vf:true },
      { id:"mango", t:"Mango cubes", short:"mango", group:"family", vf:true },
      { id:"oatmeal", t:"Oatmeal with mashed banana", short:"oatmeal with banana", group:"other", vf:true },
      { id:"toast", t:"Whole-wheat toast with peanut butter", short:"toast with peanut butter", group:"other",
        preps:[{ id:"thick", t:"thick and sticky", risk:true }, { id:"thin", t:"spread thinly" }] },
      { id:"egg", t:"Scrambled egg", short:"egg", group:"other", iron:true },
      { id:"patties", t:"Lentil and sweet potato patties", short:"lentil patties", group:"other", iron:true },
      { id:"broccoli", t:"Steamed broccoli", short:"broccoli", group:"other", vf:true },
      { id:"grapes", t:"Grapes", short:"grapes", group:"other", vf:true,
        preps:[{ id:"whole", t:"whole", risk:true }, { id:"quarter", t:"quartered lengthwise" }] },
      { id:"yogurt", t:"Plain yogurt", short:"yogurt", group:"other" },
      { id:"crackers", t:"Whole-grain crackers", short:"crackers", group:"other" },
      { id:"rice", t:"Steamed rice", short:"rice", group:"other" },
      { id:"popcorn", t:"Popcorn", short:"popcorn", group:"other", popcorn:true },
      { id:"hotdog", t:"Hot dog", short:"hot dog", group:"other",
        preps:[{ id:"rounds", t:"in rounds", risk:true }, { id:"strips", t:"in thin lengthwise strips" }] }
    ],
    drinks:{ milk:"Milk (½ cup)", water:"Water in an open cup", juice:"Apple juice", pop:"Pop" },
    tags:{ iron:"iron-rich", vf:"vegetables or fruits", family:"family food" },
    checks:["Vegetables or fruits at 3 or more times", "Iron-rich foods at 2 or more times", "About 2–3 cups of milk", "Water in an open cup", "No sugary drinks", "Choking-safe", "A family food"],
    tips:["Add fruit or vegetables to more meals.", "Iron-rich: arroz caldo with chicken, egg or lentil patties.", "Count the milk: 4–6 half-cups is about 2–3 cups.", "Offer water in an open cup between meals.", "Swap juice or pop for water or milk.", "Check the cut: quarter the grapes, spread the peanut butter thinly, no popcorn.", "Include a dish from Sasha’s family, like arroz caldo or pancit."],
    explainPrompt:"Explain how your plan keeps Sasha safe and covers iron, and how it respects her family’s food culture.",
    vocab:"Use the words iron-rich, choking hazard and division of responsibility.",
    checkLabel:"Check my plan",
    success:"This day works for Sasha.",   // module-written
    // Kitchen card (plan C1.4). VERIFY: texture guide, storage times.
    kitchen:{ title:"Lentil and sweet potato patties for little hands", label:"Save the kitchen card", lines:[
      "## Before you start",
      "- Wash hands.",
      "- Check allergies and school or daycare rules (nut-free, egg-free).",
      "## Prepare",
      "- Mash cooked lentils and sweet potato.",
      "- Shape small, soft, flat patties.",
      "- Bake until heated through.",
      "## Safety",
      "- Separate cutting boards for raw meat (if adding chicken).",
      "- Cook to safe temperatures (module 15).",
      "- Cool to lukewarm before serving.",
      "- No added salt or honey.",
      "## Texture check",
      "- Soft enough to squish between your fingers (a common guide for toddler foods).",
      "## Store",
      "- Refrigerate within 2 hours; use within 2–3 days.",
      "## Reflect",
      "- Which checklist lines does this snack help meet?"
    ] }
  },
  cards:[
    ["First 6 months", "Breast milk or commercial infant formula; vitamin D 400 IU a day if breastfed."],
    ["Around 6 months", "Start solids: iron-rich foods first, at least twice a day."],
    ["Iron-rich first foods", "Meat, fish, poultry, well-cooked egg, tofu, lentils, iron-fortified infant cereal."],
    ["Textures", "Move from mashed and minced to soft finger foods and family textures in the first year."],
    ["Common allergens", "Introduce around 6 months, not before 4, then keep offering regularly."],
    ["Honey", "Not before 12 months: risk of infant botulism."],
    ["Cow’s milk", "Main drink from 9–12 months; about 2–3 cups a day for toddlers."],
    ["Choking hazards", "Round, hard, sticky foods: quarter grapes lengthwise, cut hot dogs into strips, spread nut butter thinly."],
    ["Division of responsibility", "Adult: what, when, where. Child: whether and how much."],
    ["New foods", "Often 8–15+ relaxed tries before acceptance."],
    ["Juice", "Not needed; water and milk are the drinks for young children."],
    ["Toddler formulas", "Usually not needed; family foods plus milk meet most toddlers’ needs."]
  ]
};
