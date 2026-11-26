// HFA4U 08 Children, Adolescents & Adults. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/08-children-adolescents-adults.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// the "(verify)" tags) and every value the builder had to supply. Plate-check, drink-shelf, map and survey values are model data
// (labelled on screen). Safety (course plan §2): no Calories, weights, BMI or body images anywhere; the optional "My day" self
// mode is opt-in, memory only (never saved, scored or summarized) and shows nutrient adequacy only.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero, in Part 3 and in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback.
// VERIFY: M1 (peak bone mass by about the late 20s), M2 (iron 15 vs 11 mg), M7 (Health Canada caffeine limits; energy-drink labels).
const M1 = "Adolescence builds a large share of lifetime bone, and bone mass keeps growing until about the late 20s.";
const M2 = "Menstruation raises iron needs: 15 mg a day for females aged 14–18 vs 11 mg for males.";
const M3 = "Energy drinks contain caffeine and other stimulants, not hydration. For most practices, water is enough.";
const M4 = "Most teens get enough protein from food; training and regular meals build muscle.";
const M5 = "Regular meals and snacks support energy and focus. Quick options exist.";
const M6 = "Healthy bodies come in many shapes and sizes. Diet messages online are often marketing, not evidence.";
const M7 = "Health Canada sets caffeine limits that are lower for children and teens; energy drink labels say “not recommended for children”.";
const PPM = "PPM 150: at least 80% Sell Most, at most 20% Sell Less, and no Not Permitted items.";

// ---------- Explore: plate-check cards ----------
// ca, fe: the plan's model values as % of Lin's RDA (calcium 1300 mg, iron 15 mg); the app turns them into mg (ca × 13, fe × 0.15)
// so every persona's bars use the same foods. d (vitamin D, IU) and fib (fibre, g) are the builder's model values (VERIFY).
// flags: cal calcium card · ip plant iron · ir animal iron · vc vitamin C · tea (reduces plant-iron absorption at meals)
// Added by the builder: tea (so the plan's "lentils with tea" wrong state can happen), salmon and egg (vitamin D sources).
const pc = (id, t, ca, fe, d, fib, flags, tags) => ({ id, t, ca, fe, d, fib, tags,
  cal:/\bcal\b/.test(flags), ip:/\bip\b/.test(flags), ir:/\bir\b/.test(flags), vc:/\bvc\b/.test(flags), tea:/\btea\b/.test(flags) });
const PLATE = [
  pc("milk", "Milk or fortified soy beverage (1 cup)", 25, 0, 100, 0, "cal", ["calcium"]),
  pc("yogurt", "Yogurt (¾ cup)", 20, 0, 0, 0, "cal", ["calcium"]),
  pc("cheese", "Cheese (50 g)", 25, 0, 0, 0, "cal", ["calcium"]),
  pc("tofu", "Calcium-set tofu stir-fry with bok choy", 42, 15, 0, 4, "cal ip", ["calcium", "plant iron"]),
  pc("lentil", "Lentil soup (1 cup)", 5, 40, 0, 8, "ip", ["plant iron"]),
  pc("cereal", "Fortified whole-grain cereal", 0, 30, 0, 5, "ip", ["plant iron"]),
  pc("hummus", "Hummus and whole-wheat pita", 5, 20, 0, 6, "ip", ["plant iron"]),
  pc("beef", "Beef burger patty (75 g)", 0, 15, 0, 0, "ir", ["iron"]),
  pc("pumpkin", "Pumpkin seeds (¼ cup)", 0, 20, 0, 2, "ip", ["plant iron"]),
  pc("orange", "Orange", 5, 0, 0, 3, "vc", ["vitamin C"]),
  pc("pepper", "Red pepper strips", 0, 0, 0, 2, "vc", ["vitamin C"]),
  pc("almonds", "Almonds (¼ cup)", 7, 7, 0, 4, "", []),
  pc("salmon", "Baked salmon (75 g)", 0, 0, 360, 0, "", ["vitamin D"]),
  pc("egg", "Hard-boiled egg", 0, 5, 40, 0, "", ["vitamin D"]),
  pc("tea", "Tea (1 cup)", 0, 0, 0, 0, "tea", ["tea"])
];

// ---------- Performance task library (plan's cards and flags) ----------
// flags: p protein · gr grain (breakfast line "a grain or fruit") · ce carbohydrate-rich, easy pre-game · cd carbohydrate (dinner)
//        hv heavy pre-game · ca calcium · vf vegetables or fruits · dr drink · wa water · sp sports drink · en energy drink
// "gr" is the builder's reading of "grain" for line 1 (rice, wrap, toast, oatmeal, granola bar and the rice dishes).
// VERIFY: the Ghanaian-Canadian family foods with someone familiar with them (plan risk 4).
const tk = (id, t, g, flags) => ({ id, t, g, p:/\bp\b/.test(flags), gr:/\bgr\b/.test(flags), ce:/\bce\b/.test(flags), cd:/\bcd\b/.test(flags),
  hv:/\bhv\b/.test(flags), ca:/\bca\b/.test(flags), vf:/\bvf\b/.test(flags), dr:/\bdr\b/.test(flags), wa:/\bwa\b/.test(flags), sp:/\bsp\b/.test(flags), en:/\ben\b/.test(flags) });
const LIB = [
  tk("jollof", "Jollof rice with chicken", "fam", "p cd hv gr"),
  tk("waakye", "Waakye (rice and beans)", "fam", "p cd gr"),
  tk("plantain", "Boiled plantain", "fam", "ce cd vf"),
  tk("groundnut", "Groundnut (peanut) soup with chicken", "fam", "p hv"),
  tk("oatmeal", "Oatmeal with milk and berries", "oth", "p ca gr ce vf"),
  tk("eggs", "Eggs on whole-grain toast", "oth", "p cd gr"),
  tk("rice", "Rice", "oth", "cd gr"),
  tk("wrap", "Whole-grain wrap with beans and vegetables", "oth", "p cd gr vf"),
  tk("banana", "Banana", "oth", "ce vf"),
  tk("granola", "Granola bar", "oth", "ce gr"),
  tk("yogurt", "Yogurt", "oth", "p ca"),
  tk("apple", "Apple", "oth", "vf"),
  tk("cheese", "Cheese", "oth", "p ca"),
  tk("salad", "Vegetable salad", "oth", "vf"),
  tk("water", "Water", "drk", "dr wa"),
  tk("milk", "Milk", "drk", "dr p ca"),
  tk("chocmilk", "Chocolate milk", "drk", "dr ca"),
  tk("sports", "Sports drink", "drk", "dr sp"),
  tk("energy", "Energy drink", "drk", "dr en"),
  tk("cola", "Cola", "drk", "dr")
];

export default {
  id:"08-children-adolescents-adults",
  kind:"topic",
  title:"Children, adolescents and adults",
  topic:"Children, Adolescents & Adults",
  readyTopic:"nutrition for children, teens and adults",
  hero:{
    headline:"The years you build on.",
    text:"From childhood to adulthood, your body’s needs change. The teen years bring a <strong>growth spurt</strong>, the highest <strong>calcium</strong> needs of your life, and higher <strong>iron</strong> needs for anyone who menstruates. At the same time, <strong>busy schedules</strong>, <strong>food environments</strong>, <strong>drinks</strong> and <strong>online messages</strong> all pull on what you eat. This module is about understanding those pulls.",
    fig:{ html:'<div class="ty-hero" id="ty-hero"></div>', caption:"" },
    aria:"Two bar charts of RDAs by age group. Calcium: 1000 mg a day at 4–8, 1300 mg at 9–13 and 14–18, and 1000 mg at 19–50; the two teen bars are tallest, under a bracket labelled “bone-building years”. Iron: 10 mg at 4–8 and 8 mg at 9–13; at 14–18 the bar splits into female 15 mg and male 11 mg, with a note “menstruation”; at 19–50, female 18 mg and male 8 mg.",
    caption:"Calcium and iron RDAs by age, in mg a day"   // module-written caption
  },
  goals:[
    "I can explain how nutrient needs change from childhood through adolescence to adulthood, especially calcium and iron.",
    "I can describe how family, culture, peers, schedules, money and media influence food choices at different life stages.",
    "I can evaluate drinks (caffeine, sugar) and sports-nutrition claims for teens.",
    "I can explain how stress, busy schedules and body-shape pressures can affect eating, and where to find support.",
    "I can apply Ontario’s school food policy to a menu.",
    "I can plan and prepare a meal that fits a busy teen’s needs and culture."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Nutrient roles", goal:1,
          prompt:"Which two nutrients work together to build strong bones?",
          options:[
            { t:"Calcium and vitamin D", ok:true, why:"Vitamin D helps the body absorb and use calcium." },
            { t:"Iron and vitamin C", why:"That pair is about absorbing iron." },
            { t:"Sodium and potassium", why:"They’re about fluid balance and blood pressure." },
            { t:"Fibre and water", why:"They help digestion." }],
          hints:["Which mineral is most of bone?", "Which vitamin helps absorb it?", "Calcium and vitamin D."] },
        { id:"w2", skill:"Nutrient roles", goal:1,
          prompt:"Which pairing helps the body absorb iron from plant foods?",
          options:[
            { t:"Lentils with red pepper", ok:true, why:"Vitamin C boosts plant-iron absorption." },
            { t:"Lentils with tea", why:"Tea reduces plant-iron absorption at meals." },
            { t:"Lentils with a calcium supplement", why:"Calcium can compete with iron at the same meal." },
            { t:"Lentils with coffee", why:"Coffee reduces absorption too." }],
          hints:["Which vitamin helps iron?", "Vitamin C.", "Red pepper is rich in it."] },
        { id:"w3", skill:"Canada’s Food Guide", goal:3,
          prompt:"What does Canada’s Food Guide call the drink of choice?",
          options:[
            { t:"Water", ok:true, why:"Water is the drink of choice: no sugar, no Calories, and it comes from the tap." },   // why: builder's
            { t:"Juice", why:"Juice isn’t recommended as a regular drink." },
            { t:"Sports drinks", why:"Only for long, intense activity." },
            { t:"Milk only", why:"Milk fits, but water is the drink of choice." }],
          hints:["It has no sugar or Calories.", "It comes from the tap.", "Water."] },
        { id:"w4", skill:"Canada’s Food Guide", goal:6,
          prompt:"Which part of the Food Guide plate is the largest?",
          options:[
            { t:"Vegetables and fruits (half)", ok:true, why:"Half the plate is vegetables and fruits; whole grains and protein foods each fill a quarter." },   // why: builder's
            { t:"Whole grains (half)", why:"Whole grains are a quarter." },
            { t:"Protein foods (half)", why:"Protein foods are a quarter." },
            { t:"All three are equal", why:"Vegetables and fruits get half." }],
          hints:["Picture the plate.", "One section is twice the size of the others.", "Vegetables and fruits."] },
        { id:"w5", skill:"Labels", goal:3,
          prompt:"A drink’s label says <strong>sugars 26% DV</strong>. That’s…",
          options:[
            { t:"A lot (15% DV or more)", ok:true, why:"26% is more than 15%, so it’s a lot." },   // why: builder's
            { t:"A little", why:"5% or less is a little." },
            { t:"Exactly a day’s sugar", why:"%DV compares one serving with a daily value." },
            { t:"Not useful information", why:"%DV is a quick comparison tool." }],
          hints:["5 and 15.", "Is 26 over 15?", "A lot."] },
        { id:"w6", skill:"Labels", goal:3,
          prompt:"About how many grams of sugar are in 1 teaspoon?",
          options:[
            { t:"About 4 g", ok:true, why:"So 40 g of sugar is about 10 teaspoons." },
            { t:"About 1 g", why:"Too small: a teaspoon holds about 4 g." },
            { t:"About 15 g", why:"That’s closer to a tablespoon." },
            { t:"About 100 g", why:"Far too large." }],
          hints:["It’s a small number.", "Between 3 and 5.", "About 4 g."] }
      ],
      refreshers:{
        "Nutrient roles":"Calcium and vitamin D build bone; vitamin C helps the body absorb plant iron, while tea and coffee at meals reduce it.",
        "Canada’s Food Guide":"Half vegetables and fruits, a quarter whole grains, a quarter protein foods; water is the drink of choice.",
        "Labels":"5% DV is a little and 15% DV is a lot. About 4 g of sugar is 1 teaspoon."
      }
    }
  },
  explore:{
    heading:"Life-stage switcher",
    intro:"Pick a nutrient and watch how needs change with age. Then check a persona’s day, or compare drinks on the shelf.",
    stages:[{ id:"s4", t:"4–8" }, { id:"s9", t:"9–13" }, { id:"s14", t:"14–18" }, { id:"s19", t:"19–50" }],
    driNote:"DRI tables are organized by sex and life stage. Individual needs vary; a health professional can give personal guidance. You can use either table, or the personas.",   // last sentence: builder's (plan risk 3)
    // Needs curve (F6). [4–8, 9–13, 14–18, 19–50]; f = female table, m = male table.
    // VERIFY: every DRI value before release. Calcium, iron and vitamin D are the plan's; fibre (AI) and protein (RDA) were
    // supplied by the builder from Health Canada's DRI tables. "Why it changes" lines, food sources and tips are the builder's
    // except iron 14–18 female ("Menstrual losses and growth"), iron food sources and the iron tip (plan readout example).
    nutrients:[
      { id:"ca", t:"Calcium", col:"micro", kind:"RDA", unit:"mg", f:[1000, 1300, 1300, 1000], m:[1000, 1300, 1300, 1000],
        why:{ f:["Steady growth: bones grow longer and stronger.", "The growth spurt begins, and bones build fast.", "Growth spurt and bone building: much of adult bone is laid down now.", "Growth has finished; calcium keeps bones strong, and bone mass keeps building until about the late 20s."] },
        sources:"Milk, fortified soy beverage, yogurt, cheese, calcium-set tofu, canned salmon with bones",
        tip:"Spread calcium across the day; it’s absorbed better in smaller amounts." },
      { id:"fe", t:"Iron", col:"micro", kind:"RDA", unit:"mg", f:[10, 8, 15, 18], m:[10, 8, 11, 8],
        why:{ f:["Steady growth and a growing blood supply.", "Steady growth; the RDA is 8 mg for everyone this age.", "Menstrual losses and growth", "Menstrual losses continue through these years."],
              m:["Steady growth and a growing blood supply.", "Steady growth; the RDA is 8 mg for everyone this age.", "Growth spurt: more muscle and a bigger blood supply.", "Growth has finished, so the need falls."] },
        sources:"Lentils, beef, tofu, fortified cereal, pumpkin seeds",
        tip:"Pair plant iron with a vitamin C food." },
      { id:"vd", t:"Vitamin D", col:"micro", kind:"RDA", unit:"IU", ug:true, f:[600, 600, 600, 600], m:[600, 600, 600, 600],
        why:{ f:["Works with calcium to build bones.", "Works with calcium through the growth spurt.", "Works with calcium while bone builds fastest.", "Works with calcium to keep bones strong; the RDA is the same from age 1 to 70."] },
        sources:"Milk, fortified soy beverage, salmon and trout, eggs",
        tip:"Milk and fortified soy beverage give vitamin D and calcium together." },
      { id:"fib", t:"Fibre", col:"carb", kind:"AI", unit:"g", f:[25, 26, 26, 25], m:[25, 31, 38, 38],
        why:{ f:["Fibre keeps digestion regular as children eat more family foods.", "Needs grow with body size and appetite.", "Needs stay at the adult level.", "Needs level off."],
              m:["Fibre keeps digestion regular as children eat more family foods.", "Needs grow with body size and appetite.", "Needs rise with growth and appetite.", "Needs level off."] },
        sources:"Whole grains, beans and lentils, vegetables, fruits, nuts and seeds",
        tip:"Choose whole grains, and keep the skins on fruits and vegetables." },
      { id:"pro", t:"Protein", col:"protein", kind:"RDA", unit:"g", f:[19, 34, 46, 46], m:[19, 34, 52, 56],
        why:{ f:["Building muscle, organs and other tissues as the body grows.", "Growth speeds up.", "Growth spurt: more muscle and other tissue.", "Growth has finished; protein maintains and repairs the body."],
              m:["Building muscle, organs and other tissues as the body grows.", "Growth speeds up.", "Growth spurt: more muscle and other tissue.", "Growth has finished; protein maintains and repairs the body."] },
        sources:"Beans, lentils, tofu, eggs, fish, chicken, meat, milk, yogurt, nuts",
        tip:"Most teens get enough protein from food; include a protein food at each meal." }
    ],
    bracket:"bone-building years",
    // Personas (fictional; F6 + F1). Lin's family background is the builder's (the plan names a "flavour from Lin's food culture"
    // in Part 3); VERIFY with the teacher, who may swap in personas that reflect the class (plan risk 4).
    personas:[
      { id:"rina", t:"Rina", age:9, sex:"f", stage:"s9", desc:"9 · Grade 4 · Brampton · her family is Punjabi Sikh and vegetarian" },
      { id:"kwasi", t:"Kwasi", age:15, sex:"m", stage:"s14", desc:"15 · Grade 10 · Ottawa · plays soccer · his family is Ghanaian-Canadian" },
      { id:"lin", t:"Lin", age:16, sex:"f", stage:"s14", desc:"16 · Grade 11 · Richmond Hill · works weekend shifts · her family is Chinese-Canadian" },
      { id:"marco", t:"Marco", age:35, sex:"m", stage:"s19", desc:"35 · a night-shift warehouse worker in Windsor" }
    ],
    plate:{
      label:"Model values for learning: real foods vary. Bars show % of the persona’s RDA (fibre: % of the AI). No Calories are shown.",
      times:[{ id:"b", t:"Breakfast" }, { id:"l", t:"Lunch" }, { id:"s", t:"Snack" }, { id:"d", t:"Dinner" }],
      vitC:"Vitamin C helps the body absorb plant iron. Add a red pepper or orange to the same eating time.",
      teaNote:"Tea reduces plant-iron absorption at meals.",
      cards:PLATE,
      // optional private self mode (opt-in; in memory only: never saved, scored, summarized or sent). Nutrient adequacy only.
      self:{
        name:"My day (optional, private)",
        privacy:"Optional and private: nothing you add here is saved, scored or sent, and it isn’t added to your results summary. It clears when you leave this page. It shows nutrient adequacy only: no Calories, no weights. If you’d rather not, the personas work instead.",
        start:"Start “My day”",
        intro:"Add foods that are close to what you ate on a recent day. The bars compare them with the DRIs for ages 14–18; choose the female or male table above (either is fine).",
        stop:"Close “My day”"
      }
    },
    // Drink shelf. VERIFY: model values (plan: "Model values for comparison: real products vary; verify before release").
    // Milk is the builder's addition (TC2's example answer and the task use it); its values are the builder's model values.
    // Notes are the builder's except the sports drink note (plan P3 reveal).
    drinks:{
      label:"Model values for comparison: real products vary.",
      list:[
        { id:"water", t:"Water", size:"500 mL", caf:0, tsp:0, note:"Canada’s Food Guide’s drink of choice." },
        { id:"coffee", t:"Brewed coffee", size:"250 mL", caf:100, tsp:0, note:"Caffeine; no sugar unless you add it." },
        { id:"cola", t:"Cola", size:"355 mL can", caf:35, tsp:10, note:"Sugar and caffeine." },
        // VERIFY: energy-drink labelling rules (Health Canada).
        { id:"energy", t:"Energy drink", size:"473 mL can", caf:160, tsp:13, note:"Caffeine and other stimulants; labels say not recommended for children. Not for hydration." },
        { id:"sports", t:"Sports drink", size:"591 mL bottle", caf:0, tsp:8, note:"For long, intense activity (over about an hour)." },
        { id:"chocmilk", t:"Chocolate milk", size:"250 mL", caf:5, tsp:6, tspNote:"about half naturally from milk", note:"Calcium, protein and vitamin D, with added sugar." },
        { id:"icedtea", t:"Iced tea", size:"500 mL", caf:25, tsp:7, note:"Sugar and some caffeine." },
        { id:"milk", t:"Milk", size:"250 mL", caf:0, tsp:3, tspNote:"naturally from milk", note:"Calcium, protein and vitamin D; no added sugar." }
      ],
      moments:[{ id:"b", t:"Breakfast" }, { id:"l", t:"Lunch" }, { id:"p", t:"Practice (90 min)" }, { id:"e", t:"Evening homework" }],
      kwasi:"Kwasi’s drinks for one school day"
    },
    // TC3 cafeteria menu (stretch). VERIFY: the category labels are model assignments for learning; check them against
    // PPM 150's nutrient criteria (and the policy's percentages) before release. The three swap-in options are the builder's.
    menu:{
      title:"School cafeteria menu (10 items)",
      note:"Category labels are model assignments for learning.",
      cats:[{ id:"most", t:"Sell Most" }, { id:"less", t:"Sell Less" }, { id:"np", t:"Not Permitted for Sale" }],
      items:[
        { id:"wrap", t:"Whole-grain wrap with vegetables", cat:"most" },
        { id:"soup", t:"Lentil soup", cat:"most" },
        { id:"fruit", t:"Fruit cup", cat:"most" },
        { id:"milk", t:"Plain milk", cat:"most" },
        { id:"salad", t:"Garden salad", cat:"most" },
        { id:"rice", t:"Brown rice bowl", cat:"most" },
        { id:"pizza", t:"Cheese pizza slice", cat:"less" },
        { id:"choc", t:"Chocolate milk", cat:"less" },
        { id:"chips", t:"Baked chips", cat:"less" },
        { id:"soda", t:"Large sugary soft drink", cat:"np" }
      ],
      swaps:["Vegetables and hummus cup", "Whole-grain pasta with tomato sauce", "Bottled water"]
    },
    predictions:[
      // VERIFY: calcium RDA 1300 mg for 9–18 (plan).
      { id:"p1", prompt:"Needs curve, calcium. Which age group has the highest calcium RDA?",
        options:[{ t:"4–8" }, { t:"9–18", ok:true }, { t:"19–50" }, { t:"They’re all the same" }], fixedOrder:true,
        explain:"These are the bone-building years: much of adult bone is laid down now." },
      // VERIFY: iron 15 vs 11 mg (plan).
      { id:"p2", prompt:"Needs curve, iron, ages 14–18. How does iron need compare for female and male teens?",
        options:[{ t:"The same" }, { t:"Higher for females (15 vs 11 mg)", ok:true }, { t:"Higher for males" }, { t:"Iron isn’t needed by teens" }],
        explain:"Menstruation raises iron needs." },
      { id:"p3", prompt:"Drink shelf: Kwasi before a 45-minute gym class. Which drink does he need?",
        options:[{ t:"Water", ok:true }, { t:"A sports drink" }, { t:"An energy drink" }, { t:"Iced tea" }],
        explain:"For most activity under an hour, water replaces what’s lost." },
      // VERIFY: Canadian energy-drink labelling.
      { id:"p4", prompt:"Drink shelf: energy drink vs sports drink. What’s the key difference?",
        options:[{ t:"Energy drinks contain caffeine and other stimulants; sports drinks don’t", ok:true }, { t:"They’re the same thing" }, { t:"Energy drinks hydrate better" }, { t:"Sports drinks have more caffeine" }],
        explain:"Canadian energy drink labels say they’re not recommended for children. They’re not for hydration." }
    ],
    challenges:[
      { id:"tc1", goal:1,
        prompt:"Plate check for <strong>Lin (16)</strong>: build her school day so <strong>calcium and iron both reach 100%</strong>, with calcium at <strong>2 or more eating times</strong> and one <strong>plant-iron food paired with a vitamin C food</strong>.",
        why:"Calcium spread over the day, and plant iron with vitamin C at the same eating time.",   // builder's
        msgs:{
          close:"Close. Add pumpkin seeds or hummus.",
          spread:"Spread calcium across the day; it’s absorbed better in smaller amounts.",
          tea:"Tea reduces plant-iron absorption at meals. Swap in an orange or red pepper.",
          // the lines below are the builder's (the plan names no wrong state for them)
          persona:"This challenge is Lin’s day. Choose Lin in Plate check, then build her day.",
          empty:"Open Plate check, choose Lin, and add food cards to her eating times.",
          calcium:"Calcium is at {v}%; it needs to reach 100%. Milk, yogurt, cheese and the tofu stir-fry are calcium cards.",
          iron:"Iron is at {v}%; it needs to reach 100%. Lentil soup, fortified cereal and hummus are iron-rich.",
          pair:"Put a plant-iron food and a vitamin C food (an orange or red pepper) in the same eating time." },
        hints:["Start with cereal and milk at breakfast.", "Lentil soup is an iron powerhouse; add red pepper.",
          "Breakfast: fortified cereal + milk + orange (calcium 30, iron 30). Lunch: lentil soup + red pepper (5, 40). Snack: yogurt + pumpkin seeds (20, 20). Dinner: tofu stir-fry + milk (67, 15). Totals: calcium 122%, iron 105%."] },
      { id:"tc2", goal:3,
        prompt:"Drink shelf: choose Kwasi’s drinks for 4 moments: <strong>breakfast</strong>, <strong>lunch</strong>, a <strong>90-minute soccer practice</strong>, and <strong>evening homework</strong>.",
        why:"No energy drinks, water most of the day, and a caffeine-free evening.",   // builder's
        msgs:{
          energy:"Energy drinks aren’t for teens or for hydration.",
          evening:"Caffeine late in the day can disrupt sleep.",
          sports:"Sports drinks are for long, intense activity.",
          // the lines below are the builder's
          choc:" Chocolate milk has a little caffeine (about 5 mg) from the cocoa.",
          empty:"Choose a drink for all 4 moments: {list}.",
          sweet:"Cola and iced tea add sugar and caffeine: choose them at most once in the day.",
          water:"Water is the drink of choice: use it at 2 or more moments." },
        hints:["Start with water.", "Practice is 90 minutes: water works, and a sports drink is optional there.", "Water, water, water, plus milk or chocolate milk at a meal."] },
      { id:"tc3", goal:5, stretch:true,
        prompt:"A school cafeteria’s 10-item menu has 6 “Sell Most”, 3 “Sell Less” and 1 “Not Permitted for Sale” item. <strong>Swap exactly 2 items</strong> for options from the “Sell Most” list so it meets Ontario’s PPM 150 (at least 80% Sell Most, at most 20% Sell Less, none Not Permitted).",
        why:"8 Sell Most (80%), 2 Sell Less (20%), 0 Not Permitted.",   // builder's
        how:"Tap <strong>Swap out</strong> on an item to replace it with a Sell Most option. Tap <strong>Undo</strong> to put it back.",
        msgs:{
          np:"The soft drink is still there; Not Permitted items can’t stay on the regular menu.",
          less:"Sell Less is still {n} out of 10 ({p}%), over the 20% limit.",
          // the lines below are the builder's
          count:"Swap exactly 2 items: you’ve swapped {n}.",
          full:"That’s 2 swaps. Undo one to swap a different item." },
        hints:["Which item can’t stay at all?", "After removing it, how many Sell Less items are allowed out of 10?", "Swap the soft drink and one Sell Less item."] }
    ],
    blocks:[
      { title:"What the switcher shows", html:"<p>Needs peak in the <strong>teen years</strong>, exactly when schedules, money and marketing pull hardest on what people eat.</p><p class=\"tiny muted\">" + ADVICE + "</p>" },
      // VERIFY: reference titles, years and details before release.
      { title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Caffeine in foods</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li><li>Ontario Ministry of Education. (2010). <i>Policy/Program Memorandum No. 150: School food and beverage policy</i>. Queen’s Printer for Ontario.</li></ul>' }
    ]
  },
  part3:{
    slug:"teens", name:"Realities", heading:"Teen food realities",
    support:SUPPORT,   // shown again after station 3 (plan)
    intro:"Four stations about real teen life: time, place and pressure. Try each one, then plan a quick meal for a busy teen.",   // builder's
    stations:[
      { id:"s1", t:"Station 1: the 5-minute morning",
        intro:"Tap quick breakfast ideas to put them in the <strong>ready in 5 minutes</strong> box. Then check each one with data.",   // builder's wording
        box:"Ready in 5 minutes",
        // Plate sections are the builder's classification (Canada's Food Guide 2019: milk and yogurt are protein foods).
        ideas:[
          { id:"toast", t:"Whole-grain toast with peanut butter and a banana", plate:["vf", "wg", "pf"] },
          { id:"yog", t:"Yogurt with fruit and cereal", plate:["vf", "wg", "pf"] },
          { id:"rice", t:"Leftover rice with an egg", plate:["wg", "pf"] },
          { id:"wrap", t:"A cheese and whole-grain wrap", plate:["wg", "pf"] },
          { id:"oats", t:"Overnight oats made the night before (oats soaked in milk, with fruit)", plate:["vf", "wg", "pf"] }
        ],
        sections:{ vf:"Vegetables and fruits", wg:"Whole grains", pf:"Protein foods" },
        data:"Each quick breakfast covers two or three plate sections. Adding a piece of fruit to any of them adds a third." },
      { id:"s2", t:"Station 2: the food environment",
        intro:"A model map of a school neighbourhood. Tap each place to see how distance, price and time shape a lunch-hour choice.",
        lunch:"Lunch is 40 minutes.",
        // VERIFY: all distances, times and prices are model values (builder's).
        pins:[
          { id:"school", t:"School", short:"School", kind:"school", info:"Lunch is 40 minutes. Everything inside the dashed circle is within 500 m: a short walk." },
          { id:"ff1", t:"Burgers", short:"Burgers", kind:"ff", dist:"about 350 m", walk:"5 minutes", price:"a combo about $10", time:"ready in a few minutes" },
          { id:"ff2", t:"Pizza by the slice", short:"Pizza", kind:"ff", dist:"about 400 m", walk:"5 minutes", price:"a slice and a drink about $5", time:"ready right away" },
          { id:"ff3", t:"Fried chicken", short:"Chicken", kind:"ff", dist:"about 400 m", walk:"5 minutes", price:"a meal about $11", time:"ready in a few minutes" },
          { id:"ff4", t:"Sub shop", short:"Sub shop", kind:"ff", dist:"about 450 m", walk:"6 minutes", price:"a sub about $8", time:"made while you wait" },
          { id:"conv", t:"Convenience store", short:"Store", kind:"conv", dist:"about 250 m", walk:"3 minutes", price:"chips and pop about $4", time:"grab and go; few fresh foods" },
          { id:"groc", t:"Grocery store", short:"Grocery →", kind:"groc", dist:"1.5 km", walk:"about 20 minutes each way", price:"bread, fruit, cheese and milk for less per serving", time:"the round trip uses the whole lunch hour" }
        ],
        terms:[
          { t:"Food environment", d:"The food places, prices, marketing and access around where people live, learn and work, which shape what’s easy to choose." },
          { t:"Food swamp", d:"An area crowded with fast food and convenience stores, where fresher options are farther away." }
        ],
        fair:"None of these choices is wrong. The setting makes some choices quicker and cheaper than others, often without anyone noticing.",
        // VERIFY: the sources before release (plan).
        data:"Research links neighbourhood food environments, such as how many fast-food outlets and convenience stores are near a school, to people’s eating patterns. Most of these studies are observational: they show links, not proof of cause (Minaker et al., 2016)." },
      { id:"s3", t:"Station 3: stress, schedules and pressure",
        intro:"Four short scenarios. For each one, choose the most supportive next step.",
        // Scenarios, options and feedback are the builder's (plan gives the situations and three example steps). No numbers, no
        // bodies, no diet details (course plan §2).
        scen:[
          { id:"x1", who:"Amara, Grade 12", t:"Amara has three exams this week. She’s been studying through lunch and skipping it.",
            opts:[
              { t:"Keep skipping lunch until exams are over", fb:"Skipping meals can drain energy and focus, right when she needs them." },
              { t:"Pack a snack the night before and eat it between study sessions", ok:true, fb:"A small plan keeps energy and focus steady during exams." },
              { t:"Drink an energy drink instead of lunch", fb:"Energy drinks aren’t food, and their labels say they’re not recommended for children." }] },
          { id:"x2", who:"Lin, Grade 11", t:"Lin’s weekend shifts run late, and the only food near the break room is a vending machine.",
            opts:[
              { t:"Pack a snack and a water bottle from home for her break", ok:true, fb:"Planning ahead gives her more choice, wherever she works." },
              { t:"Wait until she gets home after midnight to eat", fb:"A long gap can leave her low on energy; a planned snack helps." },
              { t:"Skip the break so the shift goes faster", fb:"Breaks are for resting and eating; regular snacks support energy." }] },
          { id:"x3", who:"Jordan, Grade 10", t:"Jordan’s group chat is full of “what I eat in a day” videos.",
            opts:[
              { t:"Copy one creator’s meals exactly", fb:"Everyone’s needs differ, and content isn’t evidence." },
              { t:"Decide that everyone should eat like the videos", fb:"Bodies and needs vary; one person’s day isn’t a rule for anyone else." },
              { t:"Notice that these videos are often ads or personal choices, not evidence", ok:true, fb:"Noticing the marketing helps. It’s also fine to mute accounts that make you feel worse." }] },
          { id:"x4", who:"Kwasi, Grade 10", t:"After practice, a teammate makes a comment about Kwasi’s body size. It stays on his mind.",
            opts:[
              { t:"Change how he eats to fit the comment", fb:"A comment about body size isn’t health advice. Healthy bodies come in many shapes and sizes." },
              { t:"Talk to a coach or counsellor he trusts", ok:true, fb:"A trusted adult can help, and the comment may need to be addressed with the team." },
              { t:"Keep it to himself", fb:"Holding it in can make it heavier. Talking to someone he trusts is a good step." }] }
        ] },
      { id:"s4", t:"Station 4: plan a meal for a busy teen",
        intro:"Plan a dinner that’s ready in about 15 minutes. Pick a base, a protein, vegetables and a flavour from Lin’s or Kwasi’s food culture.",
        // VERIFY: options and model times are the builder's; check the flavours with someone familiar with each food culture.
        who:[{ id:"lin", t:"Lin" }, { id:"kwasi", t:"Kwasi" }],
        parts:[
          { id:"base", t:"Base", opts:[
            { id:"rice", t:"Leftover brown rice, reheated", min:2, plate:"wg" },
            { id:"noodle", t:"Whole-wheat noodles", min:6, plate:"wg" },
            { id:"wrap", t:"Whole-grain wrap", min:1, plate:"wg" },
            { id:"plantain", t:"Boiled plantain, cooked ahead", min:3, plate:"vf" }] },
          { id:"pro", t:"Protein", opts:[
            { id:"eggs", t:"Scrambled eggs", min:4, plate:"pf" },
            { id:"beans", t:"Canned black-eyed peas or beans, rinsed", min:3, plate:"pf" },
            { id:"tofu", t:"Tofu cubes, pan-fried", min:7, plate:"pf" },
            { id:"chicken", t:"Leftover chicken", min:2, plate:"pf" }] },
          { id:"veg", t:"Vegetables", opts:[
            { id:"frozen", t:"Frozen mixed vegetables", min:5, plate:"vf" },
            { id:"bokchoy", t:"Bok choy", min:4, plate:"vf" },
            { id:"spinach", t:"Baby spinach", min:2, plate:"vf" },
            { id:"tomcuc", t:"Sliced tomato and cucumber", min:3, plate:"vf" }] },
          { id:"flav", t:"Flavour", byWho:{
            lin:[{ id:"gg", t:"Ginger and green onion", min:2 }, { id:"gs", t:"Garlic and soy sauce", min:1 }, { id:"bb", t:"Black bean sauce", min:1 }],
            kwasi:[{ id:"shito", t:"Shito (Ghanaian pepper sauce)", min:1 }, { id:"tos", t:"Tomato, onion and ginger stew base", min:5 }, { id:"gn", t:"Groundnut (peanut) sauce", min:3 }] } }
        ],
        timeNote:"Model times: steps can overlap in a real kitchen.",
        over:"Over 15 minutes: try a leftover or a quicker option.",
        link:"The performance task at the end of the Final Check has a ready-made kitchen card too: a plantain and bean wrap for Kwasi’s game day." }
    ],
    blocks:[
      // VERIFY: reference details before release (plan: verify the food-environment sources).
      { title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Minaker, L. M., Shuh, A., Olstad, D. L., Engler-Stringer, R., Black, J. L., &amp; Mah, C. L. (2016). Retail food environments research in Canada: A scoping review. <i>Canadian Journal of Public Health, 107</i>(Suppl. 1), eS4–eS13.</li></ul>' }
    ],
    quickCheck:{
      title:"Teen food realities quick check", summary:"Teen food realities quick check",
      items:[
        { id:"q1", goal:6, prompt:"Which 5-minute breakfast covers at least two Food Guide plate sections?",
          choices:[{ t:"Yogurt with fruit and cereal", ok:true }, { t:"A can of iced tea" }, { t:"A plain coffee" }, { t:"Skipping breakfast" }],
          right:"Right. Protein foods, fruit and a grain.", wrong:"Protein foods, fruit and a grain." },
        { id:"q2", goal:2, prompt:"A “food swamp” is…",
          choices:[{ t:"An area crowded with fast food and convenience stores", ok:true }, { t:"A farm with wet soil" }, { t:"A food bank" }, { t:"A grocery store" }],
          right:"Right. It describes the food environment.", wrong:"It describes the food environment." },
        { id:"q3", goal:4, prompt:"Your feed is full of “what I eat in a day” videos. A helpful thought is…",
          choices:[{ t:"These are often ads or personal choices, not evidence", ok:true }, { t:"I must copy exactly" }, { t:"Bodies should all look the same" }, { t:"Skipping meals is normal" }],
          right:"Right. Bodies and needs vary; content isn’t evidence.", wrong:"Bodies and needs vary; content isn’t evidence." },
        { id:"q4", goal:4, prompt:"A friend keeps skipping lunch during exams. A supportive step is…",
          choices:[{ t:"Suggest packing a simple snack together", ok:true }, { t:"Tell them to skip dinner too" }, { t:"Ignore it" }, { t:"Joke about it" }],
          right:"Right. Small, kind, practical steps help.", wrong:"Small, kind, practical steps help." }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Life stage ↔ priority", summary:"Life stage ↔ priority", goal:[1, 2],
        instruction:"Match each life stage with its main nutrition priority.",
        leftTitle:"Life stage", rightTitle:"Priority",
        left:[
          { id:"l1", t:"Ages 9–18" },
          { id:"l2", t:"Females 14–50" },
          { id:"l3", t:"Children 4–8" },
          { id:"l4", t:"Teen athletes" },
          { id:"l5", t:"Adults 19–50" },
          { id:"l6", t:"Shift workers" },
          // VERIFY: vitamin D RDA 600 IU for ages 1–70.
          { id:"l7", t:"All ages 1–70", hints:["Which vitamin has the same RDA across most ages?", "It’s measured in IU.", "Vitamin D, 600 IU."] },
          { id:"l8", t:"Teens with part-time jobs" }
        ],
        right:[
          { id:"r1", t:"Highest calcium RDA (1300 mg) for building bone" },
          { id:"r2", t:"Higher iron needs because of menstrual losses" },
          { id:"r3", t:"Steady growth; regular meals and snacks; adults set the menu" },
          { id:"r4", t:"Enough energy and carbohydrate, water, and recovery meals with protein" },
          { id:"r5", t:"Needs level off; patterns now shape long-term health" },
          { id:"r6", t:"Planning meals and snacks around irregular hours" },
          { id:"r7", t:"Vitamin D RDA 600 IU" },
          { id:"r8", t:"Packing food and choosing quick, balanced options" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        // the plan's mismatch lines (pairs written both ways)
        wrong:{
          "l1|r2":"Calcium peaks for all teens; the iron difference is about menstruation.", "l2|r1":"Calcium peaks for all teens; the iron difference is about menstruation.",
          "l4|r5":"Athletes have extra needs for energy and fluid.", "l5|r4":"Athletes have extra needs for energy and fluid." },
        wrongDefault:"Read each life stage’s main need, then try another match." },
      // ★ data set: the plan gives each item's answer and the feedback for its most likely wrong choice (plus D5's hints). The
      // other options, the correct options' feedback and the other hints are the builder's (flagged in the build report).
      { id:"data", type:"mc", title:"Read the data", summary:"Read the data", star:true, goal:[1, 2, 3, 4],
        instruction:"Use the model chart above the questions. Choose the best answer for each. Items marked ★ are non-routine; the last two go beyond the Final Check.",
        // VERIFY: model data based on the shape of national survey results (Canadian Community Health Survey); verify the real
        // figures before release. Values are the builder's (% below the EAR for calcium) and only show the shape.
        chart:{ title:"Share of Canadians below the EAR for calcium, by age and sex",
          tag:"Model data based on the shape of national survey results; verify the real figures",
          groups:["9–13", "14–18", "19–30", "31–50", "51–70", "71+"], f:[60, 82, 52, 56, 76, 74], m:[44, 50, 30, 34, 54, 66] },
        items:[
          { id:"d1", goal:1, prompt:"Which group has the highest share below the calcium EAR?",
            options:[
              { t:"Teen girls (14–18), in this model chart", ok:true, why:"Their bar is the longest in this model chart." },
              { t:"Women 51–70", why:"Read the tallest bar. Women 51–70 are high, but teen girls are higher here." },
              { t:"Teen boys (14–18)", why:"Read the tallest bar. The teen boys’ bar is shorter." },
              { t:"Men 19–30", why:"Read the tallest bar. Men 19–30 have one of the shortest." }],
            hints:["Look for the longest bar.", "Compare the female bars for 14–18 and 51–70.", "Teen girls (14–18)."] },
          { id:"d2", goal:2, prompt:"Why might teen girls be lower in calcium than teen boys?",
            options:[
              { t:"Many factors, e.g. drinking less milk and other drink choices; the data alone doesn’t say why", ok:true, why:"The chart shows how many, not why. Drink choices are one possible factor." },
              { t:"Girls don’t need calcium", why:"The RDA is the same for both." },
              { t:"Girls’ bodies can’t absorb calcium", why:"Nothing in the chart shows that; the data alone doesn’t say why." },
              { t:"The survey only asked girls", why:"The chart shows both girls and boys." }],
            hints:["Does the chart tell you the reason?", "It shows how many, not why.", "Many factors; the data alone doesn’t say why."] },
          { id:"d3", goal:1, prompt:"The survey asked people to recall one day of eating. What’s a limitation? <span class=\"tag\">★</span>",
            options:[
              { t:"One day may not represent usual intake, and recall can be inaccurate", ok:true, why:"A single day can be unusual, and people forget or misjudge what they ate." },
              { t:"There’s no limitation", why:"Every method has limits." },
              { t:"Recall surveys always overestimate everything", why:"Errors can go either way; the main issues are one day and memory." },
              { t:"The survey had too many people", why:"A large sample is a strength, not a limit." }],
            hints:["Is one day typical?", "Can people remember everything they ate?", "One day may not be usual, and memory isn’t perfect."] },
          // VERIFY: teen protein intake (plan).
          { id:"d4", goal:3, prompt:"A protein-powder ad says “teens need 2× the protein to build muscle”. Best response? <span class=\"tag\">★</span>",
            options:[
              { t:"Most teens get enough protein from food; training and regular meals build muscle", ok:true, why:"Food first: the ad is selling a product." },
              { t:"Buy it to be safe", why:M4 },
              { t:"Double every protein food at every meal", why:"There’s no need to double. " + M4 },
              { t:"Trust it, because ads are checked for accuracy", why:"Ads sell products; they aren’t evidence." }],
            hints:["Who wrote this claim, and why?", "Do most Canadian teens fall short on protein?", "Food first: training and regular meals build muscle."] },
          { id:"d5", goal:1, prompt:"If the chart showed 30% below the EAR, does that mean 30% have a deficiency disease? <span class=\"tag\">★</span>",
            options:[
              { t:"No: below the EAR means intake is below the average requirement; it doesn’t diagnose deficiency", ok:true, why:"The EAR is a population tool: it flags risk in a group, not illness in a person." },
              { t:"Yes, exactly 30%", why:"The EAR is a population tool, not a diagnosis." },
              { t:"Yes, and everyone else gets too much calcium", why:"Being above the EAR isn’t “too much”, and the EAR doesn’t diagnose anyone." },
              { t:"No, because the EAR is the upper limit", why:"The upper limit is the UL. The EAR is the Estimated Average Requirement." }],
            hints:["What does EAR stand for?", "Estimated Average Requirement: half of healthy people need more, half less.", "Below it suggests a risk at population level, not a diagnosis."] },
          { id:"d6", goal:4, prompt:"Design a better question for a school survey on breakfast habits. <span class=\"tag\">★ Inquiry</span>",
            options:[
              { t:"“On how many of the last 7 school days did you eat something before first period?”", ok:true, why:"It’s specific, neutral and countable, with a clear time frame." },
              { t:"“Do you eat a healthy breakfast?”", why:"“Healthy” means different things to different people: a vague, leading question." },
              { t:"“You eat breakfast every day, right?”", why:"That’s a leading question: it pushes people toward one answer." },
              { t:"“Is breakfast the most important meal?”", why:"That asks for an opinion, not a habit." }],
            hints:["A good survey question is specific and neutral.", "Give a time frame and a clear action.", "Count the school days in the last week."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Hamish", goal:[1, 3], how:"",
        instruction:"Hamish made one mistake in each plan. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Plan for a Saturday soccer tournament.",
            steps:["“Eat a balanced breakfast 2–3 hours before the first game.”", "“Drink an energy drink before kickoff for extra energy.”", "“Sip water between games.”", "“Eat a meal with protein and carbohydrate afterward.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is correct. The mistake is earlier.", "Step 4 is correct."],
            fixes:[
              { t:"“Skip the energy drink; use water, and a carbohydrate snack like a banana if needed.”", ok:true, why:M3 },
              { t:"“Drink two energy drinks for a longer tournament.”", why:M7 },
              { t:"“Drink nothing until the end.”", why:"Fluids matter during activity." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What’s in an energy drink?", "Caffeine and stimulants, not hydration.", "Water and a carbohydrate snack instead."] },
          // VERIFY: teen protein guidance (fix A).
          { id:"e2", goal:3, task:"Advise a 15-year-old who wants to build muscle.",
            steps:["“Strength train under a coach’s guidance.”", "“Eat regular meals that include protein foods.”", "“Add protein shakes to every meal, because teens can’t get enough protein from food.”", "“Get enough sleep for recovery.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"“Most teens get enough protein from varied foods; shakes are usually unnecessary.”", ok:true, why:M4 },
              { t:"“Replace meals with shakes.”", why:"Meals give many nutrients that shakes don’t." },
              { t:"“Avoid protein entirely.”", why:"Protein is needed." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Is a protein shortage common among Canadian teens?", "Usually not.", "Food first."] },
          // VERIFY: peak bone mass by about the late 20s (fix A).
          { id:"e3", goal:1, task:"Explain why teens should care about calcium.",
            steps:["“Bones are living tissue that keeps changing.”", "“Bones are finished growing by about age 12, so calcium matters less now.”", "“Calcium and vitamin D work together.”", "“Weight-bearing activity helps bones too.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 is correct.", "Step 4 is correct."],
            fixes:[
              { t:"“The teen years build a large share of adult bone, and bone mass grows until about the late 20s, so calcium matters now.”", ok:true, why:M1 },
              { t:"“Bones stop growing at age 5.”", why:M1 },
              { t:"“Calcium only matters for older adults.”", why:"Building bone early protects later." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Look at the calcium RDA for 9–18.", "It’s the highest of any age.", "These are the bone-building years."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"Which result on the needs curve surprised you most: the calcium peak, the iron difference, or how flat adult needs are?" },
      { id:"j2", q:"In your own words, explain how a food environment can shape someone’s choices without them noticing." },
      { id:"j3", q:"Explain to a younger sibling the difference between a sports drink and an energy drink." },
      { id:"j4", q:'<span class="hfa-private">Optional and private</span> What’s one realistic change that would make eating well easier on your busiest day? Who could help? (A private journal: it stays on your device and is never scored on content.)' }
    ]
  },
  final:{
    // Options without feedback in the plan reuse its misconception sentences (M1–M7) or a short line by the builder.
    questions:[
      { id:"k1", cat:"K", goal:1,
        // VERIFY: calcium RDAs.
        a:{ prompt:"Which age group has the highest calcium RDA?", options:[
          { t:"9–18 years", ok:true, why:"1300 mg a day." },
          { t:"4–8 years", why:"1000 mg." },
          { t:"19–50 years", why:"1000 mg." },
          { t:"All ages are equal", why:"Teens need the most." }] },
        // VERIFY: iron 15 vs 11 mg.
        b:{ prompt:"Why is the iron RDA higher for females aged 14–18 than for males?", options:[
          { t:"Menstrual losses", ok:true, why:M2 },
          { t:"Females grow taller", why:"Not the main reason." },
          { t:"Females exercise more", why:"Not a rule." },
          { t:"It isn’t higher", why:"15 vs 11 mg." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What’s the key difference between energy drinks and sports drinks?", options:[
          { t:"Energy drinks contain caffeine and other stimulants; sports drinks contain sugars and electrolytes for long activity", ok:true, why:M3 },
          { t:"They’re the same drink with different labels", why:M3 },
          { t:"Sports drinks have more caffeine", why:"Sports drinks usually have none." },
          { t:"Energy drinks are better for hydration", why:"They aren’t for hydration." }] },
        b:{ prompt:"For a 45-minute practice, what’s the best drink for most teens?", options:[
          { t:"Water", ok:true, why:"For most activity under an hour, water replaces what’s lost." },
          { t:"An energy drink", why:M3 },
          { t:"A sports drink every 10 minutes", why:"Not needed for under an hour." },
          { t:"Cola", why:"Sugar and caffeine, not needed." }] } },
      { id:"k3", cat:"K", goal:5,
        // VERIFY: PPM 150 percentages.
        a:{ prompt:"Under Ontario’s PPM 150, at least what share of food choices sold must be “Sell Most”?", options:[
          { t:"80%", ok:true, why:PPM },
          { t:"20%", why:"That’s the maximum for Sell Less." },
          { t:"50%", why:"Not the rule." },
          { t:"100%", why:"Sell Less items are allowed up to 20%." }] },
        b:{ prompt:"Under PPM 150, which category may make up <strong>at most</strong> 20% of choices?", options:[
          { t:"Sell Less", ok:true, why:PPM },
          { t:"Sell Most", why:"At least 80%." },
          { t:"Not Permitted for Sale", why:"Not allowed on the regular menu." },
          { t:"All categories", why:"Each has its own rule." }] } },
      { id:"t1", cat:"T", goal:1,
        a:{ prompt:"Lin (16) meets her calcium but her iron is at 60%. Which change helps most?", options:[
          { t:"Add lentil soup with red pepper at lunch", ok:true, why:"Plant iron plus vitamin C." },
          { t:"Add another glass of milk", why:"Milk is low in iron." },
          { t:"Add tea at lunch", why:"Tea reduces plant-iron absorption." },
          { t:"Add a second yogurt", why:"Low in iron." }] },
        b:{ prompt:"Rina (9, vegetarian) meets her iron but her calcium is at 60%. Which change helps most?", options:[
          { t:"Add yogurt at snack and milk or fortified soy beverage at dinner", ok:true, why:"Two calcium-rich foods, spread over the day, that fit a vegetarian diet." },
          { t:"Add more pasta", why:"Low in calcium." },
          { t:"Add an orange", why:"Some calcium, but not enough." },
          { t:"Add pumpkin seeds", why:"Iron, not much calcium." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A 17-year-old plans to drink energy drinks to stay up for exams. What’s the best evidence-based advice?", options:[
          { t:"Avoid energy drinks; their labels say they’re not recommended for children, and sleep and regular meals support studying better", ok:true, why:M7 },
          { t:"Two cans a night are fine", why:M7 },
          { t:"Mix energy drinks with coffee for focus", why:"More caffeine, more risk." },
          { t:"Replace dinner with an energy drink", why:"Skipping meals harms focus. " + M5 }] },
        // VERIFY: protein guidance for teens.
        b:{ prompt:"A 15-year-old wants to start protein powder for basketball. Best advice?", options:[
          { t:"Most teens get enough protein from food; focus on regular meals and talk to a dietitian if concerned", ok:true, why:M4 },
          { t:"Take as much powder as possible", why:M4 },
          { t:"Stop eating protein foods and use powder", why:"Food gives many nutrients." },
          { t:"Avoid all protein", why:"Protein is needed." }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:"Marco (35) works night shifts and relies on vending machines. What’s the most practical strategy?", options:[
          { t:"Plan and pack meals and snacks that fit his shift, using foods he enjoys", ok:true, why:"Planning around the shift keeps his energy steady, and foods he enjoys make the plan last." },
          { t:"Skip eating during shifts", why:M5 },
          { t:"Drink energy drinks to stay awake", why:M7 },
          { t:"Only eat once a day", why:M5 }] },
        b:{ prompt:"A family new to Canada finds familiar foods expensive. Which approach fits Canada’s Food Guide <strong>and</strong> their culture?", options:[
          { t:"Keep familiar staples while adding affordable seasonal, frozen or canned vegetables, and use community resources", ok:true, why:"It keeps the family’s food culture and fits the budget: frozen and canned vegetables count." },
          { t:"Give up their traditional foods entirely", why:"Culture is part of healthy eating." },
          { t:"Eat only fast food because it’s cheap", why:"Not the only option." },
          { t:"Skip meals to save money", why:M5 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the most helpful way to describe how stress can affect eating?", options:[
          { t:"“Stress can change appetite and routines; noticing it kindly and planning simple meals can help, and talking to someone you trust is a good step.”", ok:true, why:"It’s accurate and kind, and it points to support." },
          { t:"“Stress eating means you lack willpower.”", why:"Judgemental and inaccurate." },
          { t:"“Stress never affects eating.”", why:"It often does." },
          { t:"“Skipping meals under stress is the best plan.”", why:M5 }] },
        b:{ prompt:"A friend skips meals and often talks about wanting a different body. What’s the most supportive response?", options:[
          { t:"“Say you care, listen without commenting on their body, and encourage them to talk to a trusted adult or counsellor (and share support resources).”", ok:true, why:"Care, listening without body comments and a trusted adult: that’s the supportive path." },
          { t:"Give them diet tips", why:"Not supportive; it can make things worse." },
          { t:"Comment on their weight", why:"Never helpful. " + M6 },
          { t:"Ignore it", why:"Showing care matters." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which statement best describes a food environment?", options:[
          { t:"“The food places, prices, marketing and access around where people live, learn and work, which shape what’s easy to choose.”", ok:true, why:"It names the places, prices, marketing and access that shape easy choices." },
          { t:"“The temperature of a fridge.”", why:"That’s food safety." },
          { t:"“A person’s favourite foods.”", why:"That’s preference." },
          { t:"“A list of banned foods.”", why:"Not the meaning." }] },
        b:{ prompt:"Which statement about breakfast is most accurate?", options:[
          { t:"“Regular meals, including something in the morning, support energy and focus; quick options can fit a busy schedule.”", ok:true, why:"Regular meals support energy and focus, and quick options count." },
          { t:"“Skipping breakfast is required for focus.”", why:M5 },
          { t:"“Only one ‘right’ breakfast exists.”", why:"Many options work." },
          { t:"“Breakfast must be a large hot meal.”", why:"Quick options count." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Kwasi has 15 minutes to make dinner after practice. Which plan best fits his needs?", options:[
          { t:"Waakye-style rice and beans with a fried egg and sliced tomato and cucumber, plus water", ok:true, why:"Carbohydrate, protein, vegetables, quick." },
          { t:"An energy drink and chips", why:M3 },
          { t:"Nothing until breakfast", why:M5 },
          { t:"Only a large bowl of plain rice", why:"Missing protein and vegetables." }] },
        b:{ prompt:"Which pre-practice snack (1–2 hours before) fits best?", options:[
          { t:"A banana and a whole-grain granola bar, with water", ok:true, why:"Easy-to-digest carbohydrate." },
          { t:"A large greasy meal", why:"Heavy before activity." },
          { t:"An energy drink", why:M3 },
          { t:"Nothing at all", why:"A small snack helps fuel practice." }] } },
      { id:"a2", cat:"A", goal:5,
        // VERIFY: PPM 150 rules.
        a:{ prompt:"A menu of 10 has 7 Sell Most, 2 Sell Less and 1 Not Permitted. Which single swap makes it compliant with PPM 150?", options:[
          { t:"Replace the Not Permitted item with a Sell Most item", ok:true, why:"8 / 2 / 0." },
          { t:"Replace a Sell Less item with a Sell Most item", why:"The Not Permitted item remains." },
          { t:"Replace a Sell Most item with a Sell Less item", why:"Makes it worse." },
          { t:"No swap is needed", why:"Not Permitted items can’t stay." }] },
        b:{ prompt:"A menu of 10 has 8 Sell Most, 2 Sell Less and 0 Not Permitted. Is it compliant?", options:[
          { t:"Yes: at least 80% Sell Most, at most 20% Sell Less, none Not Permitted", ok:true, why:"8 of 10 is 80% Sell Most and 2 of 10 is 20% Sell Less, with none Not Permitted." },
          { t:"No: it needs 100% Sell Most", why:"Up to 20% Sell Less is allowed." },
          { t:"No: it needs 3 Sell Less", why:"There’s no minimum for Sell Less." },
          { t:"Only if it adds a soft drink", why:"Not Permitted items aren’t allowed." }] } }
    ]
  },
  task:{
    title:"Fuel Kwasi’s game day", summary:"Fuel Kwasi’s game day",
    statement:"<p>Plan <strong>Kwasi’s</strong> Saturday (a 90-minute game at 3 p.m.) so it meets every condition. Then use the kitchen card to make his pre-game snack.</p><p class=\"tiny muted\">Each slot takes 1 to 3 cards; the game drink takes drinks only. There are many good answers: find one, then try another. No Calories are shown.</p>",
    how:"Choose a slot, then tap cards to add them (tap again to take one out).",
    slots:[{ id:"b", t:"Breakfast" }, { id:"l", t:"Lunch" }, { id:"pg", t:"Pre-game snack (1:00–2:00)" }, { id:"g", t:"Game drink" }, { id:"d", t:"Post-game dinner" }, { id:"e", t:"Evening snack" }],
    groups:[{ id:"fam", t:"Family foods" }, { id:"oth", t:"Other foods" }, { id:"drk", t:"Drinks" }],
    tags:{ p:"protein", ce:"easy carbohydrate", cd:"carbohydrate", hv:"heavy before a game", ca:"calcium", vf:"vegetables or fruits", gr:"grain" },
    library:LIB,
    checks:["Breakfast with protein and a grain or fruit", "Light carbohydrate pre-game snack", "Water at the game", "Recovery dinner", "Calcium twice", "No energy drinks", "Vegetables or fruits 3+ times"],
    tips:["Add eggs, milk or yogurt to breakfast.", "Choose a banana, granola bar or plantain; save the heavy meal for dinner.", "Water works; a sports drink is fine for a 90-minute game.", "Dinner: protein + carbohydrate + vegetables, e.g. jollof rice with chicken and salad.", "Milk at breakfast and yogurt in the evening.", "Remove the energy drink.", "Add fruit or vegetables to more slots."],
    explainPrompt:"Explain how your plan fuels Kwasi before and after the game and how it fits his family’s foods.",
    vocab:"Use the words carbohydrate, protein, hydration and calcium.",
    checkLabel:"Check my plan",
    success:"Kwasi’s game day is fuelled.",   // module-written
    more:"There’s more than one answer. Can you find another?",
    // Kitchen card (plan C1.4). VERIFY: the 2-hour refrigeration rule.
    kitchen:{ title:"Plantain and bean wrap, ready in 15 minutes", label:"Save the kitchen card", lines:[
      "## Before you start",
      "- Wash your hands.",
      "- Check allergies (this recipe can be made peanut-free).",
      "## Prepare",
      "- Warm canned black-eyed peas or beans (rinsed).",
      "- Slice boiled plantain.",
      "- Layer in a whole-grain wrap with tomato, cucumber and a spoon of yogurt sauce.",
      "## Safety",
      "- Use a clean cutting board for vegetables.",
      "- Refrigerate leftovers within 2 hours.",
      "## Timing",
      "- Eat 1–2 hours before activity, with water.",
      "## Reflect",
      "- Which checklist lines does this snack meet?"] }
  },
  cards:[
    // VERIFY: values on cards 1–4, 7 and 10 (plan).
    ["Calcium, ages 9–18", "1300 mg a day, the highest of any age: the bone-building years."],
    ["Iron, females 14–18", "15 mg a day vs 11 for males, because of menstrual losses."],
    ["Vitamin D", "600 IU a day for ages 1–70; works with calcium."],
    ["Peak bone mass", "Reached by about the late 20s; the teen years build much of it."],
    ["Water", "Canada’s Food Guide’s drink of choice."],
    ["Sports drinks", "For long, intense activity (over about an hour); not everyday drinks."],
    ["Energy drinks", "Contain caffeine and stimulants; labels say not recommended for children."],
    ["Protein for teens", "Most get enough from food; supplements are usually unnecessary."],
    ["Food environment", "The places, prices, marketing and access that shape easy choices."],
    ["PPM 150", "Ontario school food policy: ≥ 80% Sell Most, ≤ 20% Sell Less, no Not Permitted."],
    ["EAR", "Estimated Average Requirement: a population tool, not a diagnosis."],
    ["Supportive response", "Care, listen, no body comments, and encourage a trusted adult."]
  ]
};
