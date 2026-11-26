// HFA4U 05 Canada's Food Guide, DRIs & Energy Balance. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/05-food-guide-dri-energy.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags; students see the plan's wording without them.
// Model data (labelled on screen): Nour's day and food sliders, typical-intake stand-ins, persona energy values, MET values,
// the self-check food values, the recipe's ingredient values and the task prices. Safety (course plan §2): energy values
// appear only for fictional adult personas; the optional "My own day" check shows iron, calcium, fibre and vitamin D only.

// VERIFY: helpline numbers before release (course plan §2 support note; shown under the hero and again in Reflect).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "The 2019 guide uses plate proportions and eating habits; daily servings were dropped.";
const M2 = "The RDA covers about 97–98% of healthy people. An intake below it isn’t automatically too low; the EAR is the median need.";
const M3 = "Above the UL, the risk of harm rises. More isn’t better.";
const M4 = "Expenditure has three parts and changes with activity, growth and body composition; bodies adapt, and one day decides nothing.";
const M5 = "Whole fruit keeps its fibre; juice is a concentrated source of free sugars. The guide recommends water.";
const M6 = "Different shapes, similar evidence: more plants, fewer highly processed foods, eating together.";
const M7 = "Fat gives 9 kcal per gram; carbohydrate and protein give 4.";

// VERIFY: every DRI value below against Health Canada's DRI tables (women 31–50 for Nour), the sodium AI and CDRR,
// and the AMDR. Typical intakes are model values standing in for CCHS 2015 – Nutrition figures (replace before release).
const DRI_CARD = '<dl class="fg-defs">' +
  "<div><dt>EAR</dt><dd>Estimated Average Requirement: meets the needs of about half of a healthy group (the median need). Used to judge groups.</dd></div>" +
  "<div><dt>RDA</dt><dd>Recommended Dietary Allowance: meets the needs of nearly all (about 97–98%) healthy people.</dd></div>" +
  "<div><dt>AI</dt><dd>Adequate Intake: used when there isn’t enough evidence to set an EAR.</dd></div>" +
  "<div><dt>UL</dt><dd>Tolerable Upper Intake Level: the highest average daily intake unlikely to cause harm.</dd></div>" +
  "<div><dt>AMDR</dt><dd>Acceptable Macronutrient Distribution Range: energy ranges for carbohydrate, fat and protein.</dd></div>" +
  "<div><dt>CDRR</dt><dd>Chronic Disease Risk Reduction intake (sodium): marks where reducing intake lowers chronic disease risk.</dd></div></dl>" +
  "<p>DRIs are reference values for <strong>healthy populations</strong>, not personal targets. Intake below the RDA isn’t automatically deficient, and above the UL more isn’t better.</p>";

export default {
  id:"05-food-guide-dri-energy",
  kind:"topic",
  title:"Canada’s Food Guide, DRIs and energy balance",
  topic:"Canada’s Food Guide, DRIs & Energy Balance",
  readyTopic:"Canada’s Food Guide, DRIs and energy balance",
  hero:{
    eq:"½ + ¼ + ¼, and water", eqSize:"sm", eqLabel:"half vegetables and fruits, a quarter whole grains, a quarter protein foods, and water",
    headline:"A plate, not a points system.",
    text:"<strong>Canada’s Food Guide</strong> shows proportions, not portions to count, plus habits that matter as much as the food. <strong>Dietary Reference Intakes</strong> are the science behind it: reference values for whole populations. <strong>Energy balance</strong> describes how the energy in food meets the energy a body uses. Every person’s balance is different, and it isn’t a score.",
    fig:{ html:'<div class="fg-hero" id="fg-hero"></div>', caption:"" },
    aria:"A 1942 card titled Canada’s Official Food Rules changes into the 1992 rainbow, then the 2007 servings chart, then the 2019 plate: half vegetables and fruits, a quarter whole grains, a quarter protein foods, and a glass of water. Six habit icons ring the plate: a pot (cook more often), people at a table (eat with others), a label (use food labels), a magnifying glass (be mindful), a clock (enjoy your food) and a megaphone (be aware of food marketing).",
    // VERIFY: the years and titles in the hero storyboard (1942 Official Food Rules, 1992 rainbow, 2007 servings chart, 2019 plate).
    caption:"Same goal, better evidence (Health Canada, 2019)."
  },
  goals:[
    "I can describe Canada’s Food Guide’s plate proportions and healthy eating habits, and the main nutrients each food category provides.",
    "I can explain how and why Canada’s Food Guide changed from 1942 to 2019, using evidence.",
    "I can interpret DRIs (EAR, RDA, AI, UL, AMDR, CDRR) to assess a persona’s intake.",
    "I can explain energy balance and analyse data about what affects energy expenditure.",
    "I can compare Canada’s Food Guide with food guides from other countries.",
    "I can modify a recipe so it better reflects Canada’s Food Guide."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Food categories", goal:1,
          prompt:"In the 2019 guide, which food belongs to <strong>protein foods</strong>?",
          options:[
            { t:"Lentils", ok:true, why:"Legumes are protein foods, and the guide suggests choosing plant-based protein more often." },
            { t:"Potatoes", why:"Potatoes are a vegetable." },
            { t:"Brown rice", why:"Brown rice is a whole grain." },
            { t:"Avocado", why:"Avocado is a fruit." }],
          hints:["Which one would you use in place of meat?", "Beans, lentils, tofu, nuts, eggs, fish, dairy and meat are protein foods.", "Lentils."] },
        { id:"w2", skill:"Food categories", goal:1,
          prompt:"Which is a <strong>whole grain</strong>?",
          options:[
            { t:"Quinoa", ok:true, why:"It keeps the bran, germ and endosperm." },
            { t:"White rice", why:"The bran and germ have been removed." },
            { t:"Corn flakes made from milled corn", why:"Refined." },
            { t:"A white flour tortilla", why:"Refined flour." }],
          hints:["Whole grains keep all three parts of the kernel.", "Look for the one that isn’t milled white.", "Quinoa."] },
        { id:"w3", skill:"Energy and percentages", goal:3,
          prompt:"About how many kilocalories does <strong>1 g of fat</strong> provide?",
          options:[
            // module-written why for the correct option (the plan gives none); it repeats the refresher's fact
            { t:"9", ok:true, why:"Fat gives 9 kcal per gram; carbohydrate and protein give 4." },
            { t:"4", why:"4 is for carbohydrate and protein." },
            { t:"7", why:"7 is for alcohol." },
            { t:"1", why:"Far too low." }],
          hints:["Carbohydrate and protein give 4.", "Fat gives more than twice that.", "9."] },
        { id:"w4", skill:"Energy and percentages", goal:3,
          prompt:"What is 25% of 2000?",
          options:[
            { t:"500", ok:true, why:"25% is one quarter: 2000 ÷ 4 = 500." },
            { t:"250", why:"That’s 12.5%." },
            { t:"400", why:"That’s 20%." },
            { t:"800", why:"That’s 40%." }],
          hints:["25% is one quarter.", "2000 ÷ 4.", "500."] },
        { id:"w5", skill:"Reading reference data", goal:3,
          prompt:"A bar shows an iron intake of 12 mg, and a reference line sits at 18 mg. What does the bar show?",
          options:[
            { t:"Intake is below the reference line", ok:true, why:"12 < 18, so the bar stops short of the line." },
            { t:"Intake is above the reference line", why:"12 < 18." },
            { t:"Intake equals the reference", why:"They differ by 6 mg." },
            { t:"You can’t tell", why:"Compare the two values." }],
          hints:["Compare 12 and 18.", "Which is bigger?", "Below."] },
        { id:"w6", skill:"Reading reference data", goal:3,
          prompt:"If a value meets the needs of <strong>half</strong> the people in a group, what kind of value is it?",
          options:[
            { t:"A median", ok:true, why:"Half are above it and half below." },
            { t:"A maximum", why:"A maximum meets nearly everyone’s needs." },
            { t:"A minimum", why:"A minimum meets almost no one’s." },
            { t:"A total", why:"It’s one value, not a sum." }],
          hints:["Half above, half below.", "Think back to math class.", "A median."] }
      ],
      refreshers:{
        "Food categories":"The 2019 guide has three: vegetables and fruits; whole grain foods; protein foods (which include dairy and fortified soy beverages).",
        "Energy and percentages":"Carbohydrate and protein give 4 kcal per gram; fat gives 9. Percent of energy = (kcal from the nutrient ÷ total kcal) × 100.",
        "Reading reference data":"A reference line on a bar graph is a comparison point. A median splits a group in half."
      }
    }
  },
  explore:{
    heading:"Plate and scale",
    intro:"Build plates, check a persona’s day against the DRIs, explore energy balance with fictional adults, and travel through the guide’s history. Everything uses personas; nothing asks about your own body.",
    modes:[{ id:"plate", t:"1. Plate" }, { id:"dri", t:"2. DRIs" }, { id:"energy", t:"3. Energy balance" }, { id:"history", t:"4. History and world" }],
    // ===== Mode 1: plate builder (F2) =====
    plate:{
      how:"Tap a food, then tap a wedge (or drag a food onto a wedge with a mouse). Tap a filled wedge to clear it. Arrow keys move between wedges.",
      shelves:[
        { id:"vf", t:"Vegetables and fruits", foods:[
          { id:"broccoli", t:"broccoli" }, { id:"carrots", t:"carrots" }, { id:"bokchoy", t:"bok choy" }, { id:"namul", t:"spinach namul" }, { id:"kimchi", t:"kimchi" },
          { id:"apple", t:"apple" }, { id:"mango", t:"mango" }, { id:"berries", t:"berries" }, { id:"plantain", t:"plantain" }] },
        { id:"gr", t:"Grains", foods:[
          { id:"brownrice", t:"brown rice", whole:true }, { id:"mixedrice", t:"mixed-grain rice", whole:true }, { id:"whiterice", t:"white rice" },
          { id:"roti", t:"whole wheat roti", whole:true }, { id:"whitebread", t:"white bread" }, { id:"quinoa", t:"quinoa", whole:true }] },
        { id:"pr", t:"Protein foods", foods:[
          { id:"tofu", t:"tofu" }, { id:"dal", t:"lentil dal" }, { id:"eggs", t:"eggs" }, { id:"mackerel", t:"mackerel" }, { id:"chicken", t:"chicken" },
          { id:"beans", t:"black beans" }, { id:"yogurt", t:"unsweetened yogurt" }] }
      ],
      drinks:[{ id:"water", t:"Water", rec:true }, { id:"milk", t:"1% milk", rec:true }, { id:"soy", t:"Unsweetened fortified soy beverage", rec:true }, { id:"juice", t:"Fruit juice" }, { id:"cola", t:"Cola" }],
      drinkNo:"not the guide’s drink of choice",
      // The plan names three habits ("cooked at home, eaten with others, label checked, and others"); the other four are
      // module-written from the guide's habits list (course plan §3).
      habits:["Cooked at home", "Eaten with others", "Label checked", "Took time to enjoy it", "Noticed hunger and fullness", "Limited highly processed foods", "Thought about food marketing"],
      match:"matches the guide’s proportions"
    },
    // ===== Mode 2: DRI analyser (F1) with persona Nour =====
    dri:{
      persona:"<strong>Nour, 35</strong>, a nurse working night shifts.",
      base:{ fe:6, ca:500, d:100, fib:12, na:2100, pro:40 },
      baseNote:"Before these foods, the rest of Nour’s day gives iron 6 mg, calcium 500 mg, vitamin D 100 IU, fibre 12 g, sodium 2100 mg and protein 40 g.",
      // Food sliders. VERIFY: model values per serving (plan gives the iron values; the other nutrients are module-written
      // model values; the milk slider is a module addition so calcium and vitamin D can change too).
      foods:[
        { id:"lentils", t:"Lentils (¾ cup cooked)", max:3, fe:3, ca:20, d:0, fib:6, na:5, pro:13 },
        { id:"cereal", t:"Iron-fortified cereal (1 serving)", max:2, fe:4, ca:20, d:0, fib:3, na:150, pro:3 },
        { id:"spinach", t:"Cooked spinach (½ cup)", max:2, fe:3, ca:120, d:0, fib:2, na:60, pro:3 },
        { id:"beef", t:"Lean beef (75 g)", max:2, fe:2.5, ca:5, d:0, fib:0, na:50, pro:22 },
        { id:"milk", t:"1% milk (1 cup)", max:3, unit:"cup", fe:0, ca:300, d:100, fib:0, na:110, pro:8 }
      ],
      // VERIFY: DRI values (Health Canada, women 31–50; vitamin D in IU). typ = model typical intake (stand-in for CCHS 2015).
      nutrients:[
        { id:"fe", t:"Iron", unit:"mg", ear:8.1, rda:18, ul:45, max:50, typ:12, kind:"micro" },
        { id:"ca", t:"Calcium", unit:"mg", ear:800, rda:1000, ul:2500, max:2800, typ:850, kind:"micro", sd:100 },
        { id:"d", t:"Vitamin D", unit:"IU", ear:400, rda:600, ul:4000, max:1200, typ:200, kind:"micro", sd:100 },
        { id:"fib", t:"Fibre", unit:"g", ai:25, max:45, typ:17, kind:"carb" },
        { id:"na", t:"Sodium", unit:"mg", ai:1500, cdrr:2300, max:3200, typ:2700, kind:"micro" },
        { id:"pro", t:"Protein", unit:"g", ear:38, rda:46, max:120, typ:70, kind:"protein", sd:4 }
      ],
      typLabel:"Women 31–50, typical {n} intake: about {v} (model value standing in for the Canadian Community Health Survey, 2015)",
      bellLabel:"Show the spread of needs",
      bellNote:"Each person’s need is different. The curve shows how needs spread across healthy women 31–50; the shaded part is the share whose needs this intake meets.",
      absorb:"Iron from plants (non-heme) is absorbed better with a vitamin C food; iron from meat (heme) is absorbed more easily.",
      card:DRI_CARD,
      // Optional private self check (opt-in; in memory only: never saved, scored, summarized or sent). No calories, no weights.
      // VERIFY: model % of a general reference for teens per serving (iron, calcium, vitamin D values shared with module 03; fibre
      // values module-written).
      self:{
        intro:"Mark the foods you ate yesterday. The bars compare iron, calcium, fibre and vitamin D with a general reference for teens. There are no calories here, no weights and no score.",
        privacy:"Nothing you mark here is saved, scored or sent, and it isn’t added to your results summary. It clears when you leave this page. If you’d rather not, your teacher has another option, and Nour’s day works instead.",
        start:"Start “My own day”",
        foods:[
          { id:"milk", t:"Milk or fortified soy beverage (1 cup)", ca:25, d:15 },
          { id:"yogurt", t:"Yogurt (¾ cup)", ca:20 },
          { id:"cheese", t:"Cheese (50 g)", ca:25 },
          { id:"tofu", t:"Calcium-set tofu (¾ cup)", ca:30, fe:20, fib:5 },
          { id:"lentils", t:"Lentils or beans (¾ cup)", fe:30, fib:25 },
          { id:"meat", t:"Beef or chicken (75 g)", fe:15 },
          { id:"fish", t:"Salmon or trout (75 g)", d:60 },
          { id:"egg", t:"Egg", fe:5, d:5 },
          { id:"cereal", t:"Iron-fortified cereal (1 serving)", fe:30, fib:10 },
          { id:"bread", t:"Whole grain bread (1 slice)", fe:5, fib:8 },
          { id:"rice", t:"Brown rice or another whole grain (1 cup)", fe:5, fib:12 },
          { id:"apple", t:"Apple or pear", fib:15 },
          { id:"berries", t:"Berries (½ cup)", fib:10 },
          { id:"broccoli", t:"Broccoli (½ cup)", fib:8 },
          { id:"spinach", t:"Spinach, cooked (½ cup)", fe:20, ca:5, fib:8 },
          { id:"almonds", t:"Almonds (¼ cup)", ca:7, fib:12 }
        ],
        bars:[{ id:"fe", t:"Iron" }, { id:"ca", t:"Calcium" }, { id:"fib", t:"Fibre" }, { id:"d", t:"Vitamin D" }],
        reach:"reaches the general reference", below:"below the general reference; one day doesn’t tell the whole story",
        advice:ADVICE
      }
    },
    // ===== Mode 3: energy balance scale (F5), adult personas only =====
    // VERIFY: persona model values (kcal) and model MET values. Activity energy = MET-minutes × resting energy per minute
    // (BMR ÷ 1440), the usual MET teaching model; the thermic effect of food is 10% of intake. "About even" = within ±5%.
    energy:{
      note:"Persona model values, not targets for anyone.",
      rule:"Activity energy ≈ MET-minutes × the persona’s resting energy per minute (BMR ÷ 1440). The thermic effect of food is about 10% of intake.",
      adapt:"The balance shifts from day to day, and bodies adapt. One day decides nothing.",
      labels:{ more:"more in than out", even:"about even", less:"more out than in" },
      personas:[
        { id:"adaeze", name:"Adaeze", age:29, role:"competitive cyclist", bmr:1440, everyday:500,
          meals:[{ id:"rest", t:"Rest-day eating", kcal:2200 }, { id:"train", t:"Training-day eating", kcal:2900 }],
          acts:[{ id:"ride", t:"Training ride: cycling", min:90, met:8 }] },
        { id:"rui", name:"Rui", age:67, role:"retired gardener", bmr:1300, everyday:275,
          meals:[{ id:"usual", t:"Usual day", kcal:2200 }, { id:"party", t:"Family celebration dinner", kcal:2600 }],
          acts:[{ id:"garden", t:"Gardening", min:120, met:3, on:true }, { id:"walk", t:"Evening walk", min:30, met:4 }] },
        { id:"jiho", name:"Jiho", age:35, role:"office worker", bmr:1600, everyday:350,
          meals:[{ id:"usual", t:"Usual workday", kcal:2300 }, { id:"dinner", t:"Big family dinner", kcal:2700 }],
          acts:[{ id:"walk", t:"Walk at lunch", min:30, met:4, on:true }, { id:"dance", t:"Dance class", min:60, met:5 }] }
      ],
      everydayT:"everyday moving (chores, errands, work)",
      // Activity panel (TC3): 30-minute sessions, model MET values (plan). VERIFY.
      week:{
        title:"Activity panel: Rui’s active week",
        how:"Each session is 30 minutes on a different day. Tap an activity to add it to the next free day; tap a day to clear it.",
        tiles:[{ id:"walk", t:"Walk", met:4 }, { id:"swim", t:"Swim", met:6 }, { id:"garden", t:"Garden", met:3 }, { id:"dance", t:"Dance class", met:5 }],
        slots:5, min:30, target:600
      }
    },
    // ===== Mode 4: history and world (N13-style timeline) =====
    // VERIFY: every year, title, food-group name and description below (plan: "verify the dates and history before release";
    // module-written from the plan's outline).
    history:{
      timeline:[
        { year:1942, title:"Canada’s Official Food Rules", shape:"rules", short:"1942: food rules to prevent deficiencies in wartime",
          points:["Written during wartime rationing", "A short list of foods to eat every day, such as milk, fruits, vegetables, cereals and bread, and meat or fish", "Aimed at getting enough nutrients"],
          why:"With food rationed, the worry was nutrient deficiencies." },
        { year:1961, title:"Canada’s Food Guide", shape:"guide", short:"1961: the rules become “Canada’s Food Guide”",
          points:["Renamed from “rules” to a “guide”", "Still a list of food groups to eat each day"],
          why:"A guide gives advice people can adapt, rather than rules to obey." },
        { year:1977, title:"Canada’s Food Guide", shape:"circle", short:"1977: four food groups in a circle",
          points:["Four food groups: milk and milk products; breads and cereals; fruits and vegetables; meat, fish, poultry and alternates", "Shown as a circle graphic"],
          why:"Nutrition science was organizing foods by the nutrients each group supplies." },
        { year:1982, title:"Canada’s Food Guide", shape:"circle", short:"1982: variety and moderation",
          points:["The four food groups stay", "New messages about variety, and moderation in fat, sugar and salt"],
          why:"Concern was shifting from deficiency toward chronic diseases such as heart disease." },
        { year:1992, title:"Canada’s Food Guide to Healthy Eating", shape:"rainbow", short:"1992: the rainbow and a whole-diet approach",
          points:["The rainbow: grain products, vegetables and fruit, milk products, meat and alternatives", "Ranges of servings for each group", "Lower-fat choices encouraged"],
          why:"Evidence linked whole eating patterns, not single foods, with long-term health." },
        { year:2007, title:"Eating Well with Canada’s Food Guide", shape:"chart", short:"2007: servings by age and sex",
          points:["Numbers of daily servings by age and sex", "Advice on oils and fats, and on water", "A First Nations, Inuit and Métis version"],
          why:"Needs differ by age and sex, and the guide aimed to fit more Canadians." },
        { year:2019, title:"Canada’s Food Guide", shape:"plate", short:"2019: plate, habits, no servings",
          points:["A plate: half vegetables and fruits, a quarter whole grains, a quarter protein foods", "Water as the drink of choice; choose plant-based protein more often", "Healthy eating habits; no daily servings"],
          why:"A review of the evidence, a more diverse population and a food supply full of highly processed foods." }
      ],
      // VERIFY: descriptions of other countries' guides (plan: "verify details").
      world:[
        { id:"japan", t:"Japan: the spinning top", year:2005, shape:"top",
          points:["A spinning top: grain dishes in the widest band, then vegetable dishes, then fish, egg and meat dishes, with milk and fruit at the tip", "Water or tea is the top’s axis", "A figure running on top: physical activity keeps the diet “in balance”"],
          similar:"Like Canada’s guide, most of the top is plant foods, and eating goes together with being active." },
        { id:"brazil", t:"Brazil’s dietary guidelines", year:2014, shape:"brazil",
          points:["No plate or pyramid: advice is organized around how processed foods are", "Make natural or minimally processed foods the basis of meals; avoid ultra-processed foods", "Eat regularly, with others, and be wary of food advertising"],
          similar:"Like Canada’s guide: limit highly processed foods, cook, eat with others and question food marketing." },
        { id:"us", t:"United States: MyPlate", year:2011, shape:"myplate",
          points:["A plate split into fruits, vegetables, grains and protein", "Dairy shown as a cup beside the plate", "Make half your plate fruits and vegetables"],
          similar:"Like Canada’s guide, half the plate is vegetables and fruits. Canada folds dairy into protein foods and makes water the drink." },
        { id:"med", t:"A Mediterranean pyramid", year:1993, shape:"pyramid",
          points:["Base: being active and enjoying meals with others", "Every day: vegetables, fruits, whole grains, olive oil, beans and nuts", "Fish often; poultry, eggs and dairy in moderation; red meat and sweets less often"],
          similar:"Like Canada’s guide: mostly plants, fewer highly processed foods, and meals shared with others." }
      ],
      worldNote:"Different shapes, similar evidence: more plants, fewer highly processed foods, eating together. Healthy eating can fit any culture’s foods."
    },
    predIntro:"Make a prediction first. Then the plate, the bars, the scale or the timeline will show you what really happens.",
    predictions:[
      { id:"p1", mode:"plate",
        prompt:"In the 2019 guide, what fills <strong>half</strong> the plate?",
        options:[{ t:"Vegetables and fruits", ok:true }, { t:"Whole grains" }, { t:"Protein foods" }, { t:"Dairy" }],
        explain:"Half vegetables and fruits, a quarter whole grains, a quarter protein foods. Dairy is part of protein foods." },
      // VERIFY: calcium EAR 800 and RDA 1000 (plan).
      { id:"p2", mode:"dri",
        prompt:"Nour’s calcium is at 800 mg: her EAR is 800 mg and her RDA is 1000 mg. What does an intake <strong>at the EAR</strong> tell us?",
        options:[{ t:"About a 50% chance her intake meets her needs", ok:true }, { t:"She is definitely deficient" }, { t:"She definitely meets her needs" }, { t:"She is above the safe limit" }],
        explain:"The EAR is the median need. At the EAR, there’s about an even chance her intake is enough; at the RDA, it’s very likely enough." },
      { id:"p3", mode:"energy",
        prompt:"Adaeze adds a 90-minute training ride but eats the same as on a rest day. What does the scale show?",
        options:[{ t:"More energy out than in: she needs more fuel on training days", ok:true }, { t:"Nothing changes" }, { t:"Her intake rises automatically" }, { t:"Her BMR doubles" }],
        explain:"Athletes who regularly under-fuel can harm their performance, bones and health. Matching fuel to training matters." },
      { id:"p4", mode:"history",
        prompt:"The timeline is at 2007. What did the 2019 guide drop?",
        options:[{ t:"Recommended numbers of daily servings", ok:true }, { t:"Vegetables and fruits" }, { t:"Advice about drinks" }, { t:"All dairy products" }],
        explain:"The plate shows proportions instead, and habits were added. Milk and other dairy foods are still in protein foods." }
    ],
    chalIntro:"Use the plate, the food sliders or the activity panel to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:1,
        prompt:"Plate mode: Build a plate for <strong>Jiho</strong> using foods his family often eats, matching the guide’s proportions, with a whole grain and a drink the guide recommends.",
        msgs:{ white:"White rice is a refined grain. Mixed-grain or brown rice keeps the fibre.",
          // module-written: the plan names white rice only; white bread gets the same reasoning
          bread:"White bread is made from refined flour. Whole wheat roti or another whole grain keeps the fibre.",
          drink:"The guide makes water the drink of choice; milk or unsweetened fortified soy also fit.",
          half:"Vegetables and fruits should fill half: 4 of 8 wedges.",
          // module-written defaults for states the plan doesn't name
          quarters:"Half, quarter, quarter: 4, 2, 2 wedges.", noDrink:"Choose a drink too." },
        why:"Half vegetables and fruits, a quarter whole grains, a quarter protein foods, and a drink the guide recommends.",
        hints:["Half, quarter, quarter: 4, 2, 2 wedges.", "Check that each grain is whole.", "Swap white rice for mixed-grain rice and choose water."] },
      // VERIFY: Nour's iron RDA 18 mg and UL 45 mg; the slider values (plan).
      { id:"tc2", goal:3,
        prompt:"DRI mode: Use the food sliders so Nour’s iron is <strong>at or above her RDA (18 mg) and below the UL (45 mg)</strong>.",
        msgs:{ low:"Still below her RDA. Below the RDA isn’t automatically deficient, but adequacy is less certain.", high:"Above the UL, risk rises." },
        why:"At or above the RDA, her intake is very likely enough, and it stays below the UL, where risk would rise.",
        hints:["She starts at 6 mg; you need at least 12 more.", "Cereal gives 4, lentils and spinach 3 each.", "2 cereal + 2 lentils = 6 + 8 + 6 = 20 mg."] },
      // VERIFY: "600 MET-minutes ≈ 150 minutes of moderate activity" (Canada's adult movement guidelines) and the MET values.
      { id:"tc3", goal:4, stretch:true,
        prompt:"Energy balance mode, activity panel: Rui, 67, wants an active week: <strong>5 half-hour sessions</strong> on different days, at least <strong>2 of them gardening</strong> (he loves it), at most <strong>1 swim</strong> (one pool pass), and at least <strong>600 MET-minutes</strong> in total. (600 MET-minutes is about the 150 minutes of moderate activity in Canada’s adult movement guidelines.)",
        msgs:{ walks:"Gardening and walking are lighter; you’re 60 short.", swims:"Only one pool pass.", gardens:"Four gardens give 360, and one more session can’t make up 240.",
          // module-written defaults for states the plan doesn't name
          count:"Plan 5 sessions, one on each of 5 days.", garden2:"Rui wants at least 2 gardening sessions.", short:"Not enough yet: the week needs at least 600 MET-minutes." },
        why:"Five sessions, at least two of them gardening, one swim at most, and 600 MET-minutes or more.",
        hints:["Two gardens use 180 MET-minutes. You need 420 more from three sessions.", "Three sessions averaging 140: a swim plus two of walk or dance, or three dances.", "For example: garden, garden, swim, dance, dance = 660."] }
    ],
    blocks:[
      { title:"What the plate and the scale show", html:"<p>The guide is about <strong>proportions and habits</strong>, not points. DRIs describe <strong>populations</strong>, with a safe range between enough and too much. Energy balance is a <strong>moving relationship</strong> with three kinds of expenditure (basal metabolism, activity and the thermic effect of food), different for every body. Food guides from other countries look different but rest on similar evidence, and healthy eating can fit any culture’s foods.</p><p class=\"tiny\">" + ADVICE + "</p>" },
      // VERIFY: reference titles, years and publishers before release (APA 7).
      { title:"Sources (APA 7)", html:'<ul class="hfa-refs">' +
        "<li>Ainsworth, B. E., Haskell, W. L., Herrmann, S. D., Meckes, N., Bassett, D. R., Jr., Tudor-Locke, C., Greer, J. L., Vezina, J., Whitt-Glover, M. C., &amp; Leon, A. S. (2011). 2011 Compendium of Physical Activities: A second update of codes and MET values. <i>Medicine &amp; Science in Sports &amp; Exercise, 43</i>(8), 1575–1581.</li>" +
        "<li>Canadian Society for Exercise Physiology. (2021). <i>Canadian 24-hour movement guidelines for adults aged 18–64 years and adults aged 65 years or older</i>.</li>" +
        "<li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li>" +
        "<li>Health Canada. (2019). <i>Canada’s dietary guidelines for health professionals and policy makers</i>. Government of Canada.</li>" +
        "<li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li>" +
        "<li>Ministry of Health of Brazil. (2014). <i>Dietary guidelines for the Brazilian population</i> (2nd ed.).</li>" +
        "<li>Statistics Canada. (2017). <i>Canadian Community Health Survey – Nutrition (2015)</i>.</li>" +
        "<li>U.S. Department of Agriculture. (2011). <i>MyPlate</i>.</li></ul>" +
        '<p class="tiny muted">Nour’s day, the typical intakes, the persona energy values and the MET values in this module are model data for learning.</p>' }
    ]
  },
  part3:{
    slug:"recipe", name:"Recipe", heading:"Modify a recipe",
    // module-written intro (the plan gives the activity, not an intro line)
    intro:"Change “Weeknight fried rice” so it better reflects Canada’s Food Guide. Choose any combination of swaps, watch the readouts and the data, then save a kitchen card for cooking in class or at home with an adult.",
    recipe:{
      title:"Weeknight fried rice", serves:4, cupsPerServing:1.5,
      // VERIFY: model ingredient values for the whole recipe (sodium mg, saturated fat g, fibre g) against a nutrient database
      // such as the Canadian Nutrient File. Ham's sodium is set below the soy sauce's here, as the plan's Q1 answer requires;
      // real diced ham can be saltier. cups = volume added to the dish (servings are 1½ cups each).
      groups:[
        { id:"rice", t:"Rice", opts:[
          { id:"white", t:"White rice", line:"4 cups cooked white rice", na:0, sf:0.4, fib:2.4, cups:4 },
          { id:"brown", t:"Brown or mixed-grain rice", line:"4 cups cooked brown or mixed-grain rice", na:20, sf:1.2, fib:12, cups:4, whole:true }] },
        { id:"soy", t:"Soy sauce", opts:[
          { id:"reg", t:"Regular soy sauce", line:"3 tbsp regular soy sauce", na:2700 },
          { id:"low", t:"Lower-sodium soy sauce", line:"3 tbsp lower-sodium soy sauce", na:1600 },
          { id:"half", t:"Use half as much", line:"1½ tbsp regular soy sauce", na:1350 }] },
        { id:"fat", t:"Fat", opts:[
          { id:"butter", t:"Butter", line:"2 tbsp butter", na:180, sf:14.6, milk:true },
          { id:"canola", t:"Canola oil", line:"2 tbsp canola oil", na:0, sf:2 }] },
        { id:"pro", t:"Protein", opts:[
          { id:"ham", t:"Ham", line:"1 cup diced ham", na:1000, sf:3, cups:1, type:"processed meat" },
          { id:"tofu", t:"Firm tofu", line:"1 cup diced firm tofu", na:30, sf:1.5, fib:1, cups:1, type:"plant-based", soy:true },
          { id:"edamame", t:"Edamame", line:"1 cup shelled edamame", na:10, sf:0.8, fib:8, cups:1, type:"plant-based", soy:true },
          { id:"chicken", t:"Diced chicken", line:"1 cup diced cooked chicken", na:100, sf:1.5, cups:1, type:"poultry" }] }
      ],
      fixed:[
        { id:"eggs", line:"2 eggs", na:140, sf:3.2, cups:0.5 },
        { id:"peas", line:"½ cup frozen peas", na:60, sf:0.1, fib:3.5, cups:0.5, veg:true }
      ],
      adds:[
        { id:"veg", t:"Add 2 cups mixed vegetables (bok choy, carrots, peppers)", line:"2 cups mixed vegetables (bok choy, carrots, peppers)", na:60, fib:6, cups:2, veg:true },
        { id:"kimchi", t:"Add ½ cup kimchi (vegetables; also adds sodium)", line:"½ cup kimchi, chopped", na:400, fib:1.5, cups:0.5, veg:true, kimchi:true }
      ],
      // VERIFY: Daily Values (sodium 2300 mg; saturated plus trans fat 20 g).
      dv:{ na:2300, sf:20 },
      levels:{ na:"high (30% DV or more), medium (15–29%) or lower (under 15%)", sf:"high (15% DV or more) or lower" },
      // Kitchen card (plan). VERIFY: the cooked-rice storage guidance (Bacillus cereus) against current Health Canada advice.
      steps:["Wash hands.",
        "Cook the rice the day before, then cool it quickly and refrigerate it (cooked rice left out can grow <i>Bacillus cereus</i>; more in module 15, food safety).",
        "Heat the oil.", "Cook the eggs fully.", "Add the vegetables and protein.", "Add the rice and sauce.", "Taste before adding any more sauce."],
      safety:["Hot oil: keep handles turned in and add food gently.", "Knife grip: curl your fingertips and keep the blade away from them.", "Clean as you go."],
      allergens:"Allergen note: soy and egg.",
      // module-written allergen additions (accuracy): butter is milk; soy sauce often contains wheat; kimchi often contains fish or shellfish
      allergenMore:{ milk:"Butter contains milk.", wheat:"Many soy sauces also contain wheat: check the label.", kimchi:"Kimchi is often made with fish sauce or salted shrimp: check the label." },
      after:"There’s no single right version. Choose swaps that fit your family’s tastes, budget and culture."
    },
    blocks:[{ title:"Where the sodium comes from", html:"<p>In the original recipe, the soy sauce supplies most of the sodium, so changing the sauce matters most. Adding vegetables makes more servings from the same sauce, so each serving has less sodium. Kimchi adds vegetables but also sodium. Choosing plant-based protein more often brings fibre and usually less saturated fat.</p>" }],
    quickCheck:{
      title:"Recipe quick check", summary:"Recipe quick check",
      items:[
        { id:"q1", goal:6, prompt:"Which single swap cuts sodium most?",
          choices:[{ t:"Lower-sodium soy sauce", ok:true }, { t:"Brown rice" }, { t:"Canola oil" }, { t:"Tofu" }],
          right:"Right. Soy sauce supplies most of the sodium here.", wrong:"Soy sauce supplies most of the sodium here." },
        { id:"q2", goal:6, prompt:"Which swap moves the dish toward the guide’s grain advice?",
          choices:[{ t:"Brown or mixed-grain rice", ok:true }, { t:"More eggs" }, { t:"Butter" }, { t:"Ham" }],
          right:"Right. Choose whole grains.", wrong:"Choose whole grains." },
        { id:"q3", goal:[6, 1], prompt:"Why does the guide suggest choosing plant-based protein more often?",
          choices:[{ t:"More fibre and less saturated fat, on average", ok:true }, { t:"Plants have more protein than meat" }, { t:"Meat has no nutrients" }, { t:"It’s always cheaper" }],
          right:"Right. Plant proteins bring fibre and usually less saturated fat; meat still provides nutrients like iron and B12.",
          wrong:"Plant proteins bring fibre and usually less saturated fat; meat still provides nutrients like iron and B12." },
        { id:"q4", goal:6, prompt:"Adding kimchi does what?",
          choices:[{ t:"Adds vegetables but also sodium", ok:true }, { t:"Removes sodium" }, { t:"Makes it a whole grain" }, { t:"Adds saturated fat" }],
          right:"Right. Fermented vegetables are often salty; balance with the other swaps.", wrong:"Fermented vegetables are often salty; balance with the other swaps." }
      ]
    }
  },
  practice:{
    activities:[
      { id:"dri", type:"sorter", title:"Which DRI?", summary:"Which DRI?", goal:3, noun:"statement", txt:true,
        instruction:"Sort each statement into the DRI it describes.",
        boxes:[{ id:"ear", label:"EAR", sub:"Estimated Average Requirement" }, { id:"rda", label:"RDA", sub:"Recommended Dietary Allowance" }, { id:"ai", label:"AI", sub:"Adequate Intake" },
          { id:"ul", label:"UL", sub:"Tolerable Upper Intake Level" }, { id:"amdr", label:"AMDR", sub:"Acceptable Macronutrient Distribution Range" }, { id:"cdrr", label:"CDRR", sub:"Chronic Disease Risk Reduction intake" }],
        // module-written why lines (the plan gives the boxes and mismatch feedback)
        items:[
          { id:"d1", t:"Meets the needs of about half of healthy people in a life-stage group.", answer:"ear", why:"The EAR is the median need." },
          { id:"d2", t:"Meets the needs of nearly all (about 97–98%) healthy people.", answer:"rda", why:"The RDA sits above most people’s needs." },
          { id:"d3", t:"Used when there isn’t enough evidence to set an EAR.", answer:"ai", why:"Without an EAR there can be no RDA, so an AI is set instead." },
          { id:"d4", t:"The highest average daily intake unlikely to cause harm.", answer:"ul", why:"Above the UL, the risk of harm rises." },
          // VERIFY: fat AMDR 20–35% for adults
          { id:"d5", t:"Fat should provide 20–35% of an adult’s energy.", answer:"amdr", why:"The AMDR gives energy ranges for carbohydrate, fat and protein." },
          // VERIFY: sodium CDRR wording
          { id:"d6", t:"Reducing sodium intake to this level lowers chronic disease risk.", answer:"cdrr", why:"The CDRR is set for sodium." },
          { id:"d7", t:"The best value for judging how many people in a <strong>group</strong> may have inadequate intake.", answer:"ear",
            why:"Comparing a group’s intakes with the median need estimates the share falling short.",
            wrong:{ rda:"For groups, use the EAR; the RDA overestimates how many people fall short." },
            hints:["Which value marks the median need?", "Comparing a group’s intakes with the median need estimates the share falling short.", "EAR."] },
          // VERIFY: vitamin D UL 4000 IU for adults
          { id:"d8", t:"A supplement label lists 5000 IU of vitamin D; the adult reference here is 4000 IU.", answer:"ul",
            why:"4000 IU is the adult UL, so 5000 IU a day is above the upper safe limit.",
            wrong:{ rda:"This compares a dose with the upper safe limit." } }
        ],
        wrongDefault:"Re-read the DRI definitions card." },
      { id:"evidence", type:"custom", title:"Evidence, history and the world", summary:"Evidence, history and the world", star:true, goal:[1, 2, 4, 5],
        instruction:"Six items on the evidence behind the guide, its history and the world. Items marked ★ are non-routine; H6 is an investigation.",
        how:"Tap your choices (or type a number), then press Check.",
        items:[
          { id:"h1", kind:"sets", goal:1, prompt:"Match each 2019 category to a main nutrient it supplies.",
            sets:[
              { id:"vf", label:"Vegetables and fruits", chips:[{ t:"fibre and vitamin C", ok:true }, { t:"fibre and B vitamins" }, { t:"protein and iron" }] },
              { id:"wg", label:"Whole grains", chips:[{ t:"fibre and vitamin C" }, { t:"fibre and B vitamins", ok:true }, { t:"protein and iron" }] },
              { id:"pf", label:"Protein foods", chips:[{ t:"fibre and vitamin C" }, { t:"fibre and B vitamins" }, { t:"protein and iron", ok:true }] }
            ],
            fb:"The curriculum’s older group names map onto these: Grain Products became whole grain foods; Meat and Alternatives and Milk and Alternatives joined protein foods.",
            why:"Vegetables and fruits: fibre and vitamin C. Whole grains: fibre and B vitamins. Protein foods: protein and iron. The curriculum’s older group names map onto these: Grain Products became whole grain foods; Meat and Alternatives and Milk and Alternatives joined protein foods." },
          // module-written distractor chips (the plan gives the answer and its feedback)
          { id:"h2", kind:"chips", goal:1, prompt:"Why does the guide recommend whole fruit over juice?",
            chips:[{ t:"Whole fruit has fibre; juice is a source of free sugars", ok:true }, { t:"Juice has no vitamins" }, { t:"Whole fruit has more sugar than juice" }, { t:"Juice is harder to digest" }],
            fb:"Juice loses the fibre and is easy to drink in large amounts.", why:"Juice loses the fibre and is easy to drink in large amounts. " + M5 },
          { id:"h3", kind:"num", star:true, goal:[1, 4], prompt:"A day provides 2000 kcal with 250 g carbohydrate, 75 g protein and 60 g fat. What percent of energy comes from fat?",
            answer:27, unit:"%", label:"Fat",
            why:"60 × 9 = 540; 540 ÷ 2000 = 27%.",
            wrong:[{ match:12, fb:"You used 4 kcal/g; fat gives 9." }, { match:3, fb:"That divides grams by kcal. Find the kcal from fat first." }],
            wrongDefault:"Find the kcal from fat first (fat gives 9 kcal per gram), then divide by 2000.",
            hints:["Fat gives 9 kcal per gram.", "60 × 9 = 540 kcal.", "540 ÷ 2000 × 100 = 27%."] },
          // VERIFY: adult AMDR (carbohydrate 45–65, protein 10–35, fat 20–35)
          { id:"h4", kind:"sets", star:true, goal:[1, 4], prompt:"For the day in H3, is each macronutrient inside the adult AMDR (carbohydrate 45–65%, protein 10–35%, fat 20–35%)?",
            sets:[
              { id:"c", label:"Carbohydrate (250 g)", chips:[{ t:"Yes", ok:true }, { t:"No" }] },
              { id:"p", label:"Protein (75 g)", chips:[{ t:"Yes", ok:true }, { t:"No" }] },
              { id:"f", label:"Fat (60 g)", chips:[{ t:"Yes", ok:true }, { t:"No" }] }
            ],
            fb:"250 × 4 = 1000 (50%); 75 × 4 = 300 (15%).",
            why:"Carbohydrate 50%: yes. Protein 15%: yes. Fat 27%: yes. 250 × 4 = 1000 (50%); 75 × 4 = 300 (15%)." },
          // VERIFY: history card wording (plan). Module-written distractor chips.
          { id:"h5", kind:"chips", star:true, goal:2, prompt:"In 1942 Canada’s food rules were written during wartime rationing. Which change in Canada since then best explains the 2019 guide’s inclusion of foods like tofu, lentils and mixed-grain rice?",
            chips:[{ t:"Greater cultural diversity and more evidence for plant-based protein", ok:true }, { t:"Wartime rationing of meat continued until 2019" }, { t:"Canadians stopped eating meat" }, { t:"These foods became the cheapest in every store" }],
            fb:"Both the population and the evidence changed.", why:"Both the population and the evidence changed: Canadians’ food traditions are more diverse, and evidence supports plant-based protein." },
          // module-written distractor chips except the plan's "Do students like water?"
          { id:"h6", kind:"chips", star:true, inquiry:true, goal:[2, 5],
            prompt:"<span class=\"hfa-model\">Model data</span> In a school survey, 30% of students said water was their usual lunch drink in 2018 and 45% in 2022. Choose the best research question to investigate why.",
            chips:[{ t:"Did changes in the school’s food environment or the 2019 guide’s messaging change students’ drink choices?", ok:true }, { t:"Do students like water?" }, { t:"How many students go to the school?" }, { t:"Is water healthier than juice?" }],
            fb:"A good question names what changed and what might explain it; “Do students like water?” is too vague.",
            why:"A good question names what changed and what might explain it, so it can be investigated with data.",
            hints:["Which question could actually be investigated with data?", "It should name a possible cause.", "The food-environment and messaging question."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Haruka", goal:[2, 3], how:"",
        instruction:"Haruka made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          // VERIFY: calcium EAR 800 and RDA 1000
          { id:"e1", goal:3, task:"Judge Nour’s calcium intake of 900 mg (EAR 800, RDA 1000).",
            steps:["Her intake is 900 mg.", "That’s above the EAR of 800 mg.", "It’s below the RDA of 1000 mg, so she is calcium-deficient.", "She needs a supplement."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 rests on the mistake before it."],
            fixes:[
              { t:"Between the EAR and RDA, her intake is probably adequate, but less certainly so than at the RDA; one day of data also isn’t enough to judge.", ok:true, why:M2 },
              { t:"She’s above the UL.", why:"The UL is much higher." },
              { t:"Below the EAR means she’s fine.", why:"She’s above the EAR." },
              { t:"Step 3 is correct.", why:"The RDA isn’t a deficiency line. " + M2 }],
            // Plan hint 3 is "A." (a fix letter); fixes are reordered by the build, so it quotes the fix.
            hints:["Is the RDA a minimum?", "It covers nearly everyone’s needs; many people need less.", "Between the EAR and RDA, her intake is probably adequate, but less certainly so than at the RDA; one day of data also isn’t enough to judge."] },
          { id:"e2", goal:3, task:"Find the percent of energy from fat in a 1800 kcal day with 50 g fat.",
            steps:["Energy from fat = 50 g × 4 kcal/g = 200 kcal.", "200 ÷ 1800 ≈ 11%.", "That’s below the AMDR, so the day is too low in fat."],
            answer:0, stepFb:["", "Step 2 follows step 1. The mistake is earlier.", "This follows from the earlier mistake."],
            fixes:[
              { t:"50 g × 9 kcal/g = 450 kcal; 450 ÷ 1800 = 25%, inside the 20–35% AMDR.", ok:true, why:M7 },
              { t:"50 ÷ 1800 = 2.8%.", why:"That divides grams by kcal." },
              { t:"50 × 7 = 350.", why:"7 is for alcohol." },
              { t:"Step 1 is correct.", why:M7 }],
            hints:["How many kcal in a gram of fat?", "9.", "50 g × 9 kcal/g = 450 kcal; 450 ÷ 1800 = 25%, inside the 20–35% AMDR."] },
          { id:"e3", goal:2, task:"Explain what the 2019 guide says about milk.",
            steps:["The 2019 guide no longer has a separate “Milk and Alternatives” group.", "So the guide no longer recommends milk at all.", "People should avoid dairy."],
            answer:1, stepFb:["Step 1 is correct.", "", "This follows from step 2’s mistake."],
            fixes:[
              { t:"Dairy foods like milk and yogurt are now protein foods, and unsweetened milk is one of the healthy drink options alongside water.", ok:true, why:"Dairy moved into protein foods; it wasn’t dropped." },
              { t:"Milk became a whole grain.", why:"Milk isn’t a grain." },
              { t:"Milk is now a vegetable.", why:"It’s a protein food." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Where did dairy go in 2019?", "Protein foods.", "Dairy foods like milk and yogurt are now protein foods, and unsweetened milk is one of the healthy drink options alongside water."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you about how Canada’s Food Guide has changed since 1942?" },
      { id:"j2", q:"In your own words, why are DRIs written for groups of people rather than as personal targets?" },
      { id:"j3", q:"Explain to a friend how you’d change a family recipe you love to fit the guide, without losing what makes it yours." },
      { id:"j4", q:"Which DRI term is still fuzzy for you? What will you do to sort it out?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In the 2019 guide, what fills half the plate?", options:[
          { t:"Vegetables and fruits", ok:true, why:"Half vegetables and fruits, a quarter whole grains, a quarter protein foods." },
          { t:"Whole grains", why:"They fill a quarter." },
          { t:"Protein foods", why:"They fill a quarter." },
          { t:"Dairy", why:"Dairy is part of protein foods." }] },
        b:{ prompt:"Which drink does the 2019 guide name as the drink of choice?", options:[
          { t:"Water", ok:true, why:"Water is the guide’s drink of choice." },
          { t:"100% fruit juice", why:"Juice is a source of free sugars." },
          { t:"Sports drinks", why:"Not the drink of choice." },
          { t:"Chocolate milk", why:"Sweetened drinks aren’t the drink of choice." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which DRI is the highest daily intake unlikely to cause harm?", options:[
          { t:"UL", ok:true, why:M3 },
          { t:"RDA", why:"The RDA meets nearly everyone’s needs." },
          { t:"EAR", why:"The EAR is the median need." },
          { t:"AI", why:"Used when there’s no EAR." }] },
        b:{ prompt:"Which DRI meets the needs of about half of healthy people in a group?", options:[
          { t:"EAR", ok:true, why:"The EAR is the median need." },
          { t:"RDA", why:"The RDA covers about 97–98%." },
          { t:"UL", why:"The UL is an upper safety limit." },
          { t:"AMDR", why:"The AMDR is an energy range for macronutrients." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which change was new in the 2019 guide?", options:[
          { t:"It replaced daily servings with plate proportions and eating habits", ok:true, why:M1 },
          // VERIFY: "Canada had food rules from 1942"
          { t:"It was Canada’s first food guide", why:"Canada had food rules from 1942." },
          { t:"It added vegetables for the first time", why:"Earlier guides included vegetables." },
          { t:"It created a separate dairy group", why:"Dairy moved into protein foods." }] },
        // VERIFY: 1942 and the reason for the first food rules
        b:{ prompt:"Why were Canada’s first official food rules created in 1942?", options:[
          { t:"To prevent nutrient deficiencies during wartime rationing", ok:true, why:"With food rationed in wartime, the worry was getting enough nutrients." },
          { t:"To reduce rates of chronic disease", why:"That became a bigger focus later." },
          { t:"To promote plant-based eating", why:"A 2019 emphasis." },
          { t:"To set calorie targets for everyone", why:"They gave food rules, not calorie targets." }] } },
      // VERIFY: adult fat AMDR 20–35%
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A persona’s day has 2000 kcal and 60 g fat. What percent of energy comes from fat, and is it within the adult AMDR of 20–35%?", options:[
          { t:"27%; within the AMDR", ok:true, why:"60 × 9 = 540; 540 ÷ 2000 = 27%." },
          { t:"12%; below the AMDR", why:"Fat gives 9 kcal/g, not 4." },
          { t:"3%; below the AMDR", why:"You divided grams by kcal." },
          { t:"54%; above the AMDR", why:"540 ÷ 2000 is 27%, not 54%." }] },
        b:{ prompt:"A persona’s day has 2400 kcal and 80 g fat. What percent of energy comes from fat?", options:[
          { t:"30%", ok:true, why:"80 × 9 = 720; 720 ÷ 2400 = 30%." },
          { t:"13%", why:M7 },
          { t:"3%", why:"Grams ÷ kcal." },
          { t:"60%", why:"720 ÷ 2400 is 0.30." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Nour’s usual iron intake is between her EAR and RDA. What’s the best interpretation?", options:[
          { t:"Probably adequate, but with a higher chance of falling short than at the RDA", ok:true, why:"Between the EAR and RDA, intake is probably adequate, but less certainly so than at the RDA." },
          { t:"Definitely deficient", why:M2 },
          { t:"Definitely adequate", why:"Only likely, not certain." },
          { t:"Too high and harmful", why:"That would be above the UL." }] },
        b:{ prompt:"A persona takes supplements that put her vitamin D intake above the UL every day. What’s the best interpretation?", options:[
          { t:"The risk of harm rises; more isn’t better", ok:true, why:M3 },
          { t:"She’ll be extra healthy", why:M3 },
          { t:"It doesn’t matter because vitamins are always safe", why:"Fat-soluble vitamins can build up." },
          { t:"She is below her needs", why:"She’s above the UL." }] } },
      // VERIFY: model MET values (swimming 6, walking 4, cycling 8, yoga 3)
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Using model MET values (swimming 6, walking 4), which session uses more activity energy for the same person: 45 minutes of swimming or 60 minutes of walking?", options:[
          { t:"Swimming: 270 MET-minutes vs 240", ok:true, why:"6 × 45 = 270 and 4 × 60 = 240." },
          { t:"Walking, because it lasts longer", why:"Intensity matters too: 6 × 45 = 270." },
          { t:"They’re equal", why:"270 ≠ 240." },
          { t:"You can’t compare different activities", why:"MET-minutes make them comparable." }] },
        b:{ prompt:"Using model MET values (cycling 8, yoga 3), which uses more activity energy: 30 minutes of cycling or 50 minutes of yoga?", options:[
          { t:"Cycling: 240 MET-minutes vs 150", ok:true, why:"8 × 30 = 240 and 3 × 50 = 150." },
          { t:"Yoga, because it lasts longer", why:"3 × 50 = 150." },
          { t:"They’re equal", why:"240 ≠ 150." },
          { t:"You can’t compare them", why:"MET-minutes make them comparable." }] } },
      // VERIFY: the descriptions of Brazil's guidelines and Japan's spinning top
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which statement best compares Brazil’s dietary guidelines with Canada’s Food Guide?", options:[
          { t:"“Both emphasize mostly minimally processed foods and enjoying meals with others; Brazil organizes much of its advice around how processed foods are.”", ok:true, why:"It names what the two share and how Brazil’s differs." },
          { t:"“Brazil’s guide is wrong because it has no plate.”", why:M6 },
          { t:"“They disagree completely.”", why:"They share core advice." },
          { t:"“Brazil’s guide is only about vitamins.”", why:"It’s about whole diets and eating habits." }] },
        b:{ prompt:"Japan’s spinning-top food guide includes a figure running on the top. What idea does that communicate?", options:[
          { t:"“Physical activity keeps the diet ‘in balance’, just as spinning keeps the top upright.”", ok:true, why:"The running figure links eating with being active." },
          { t:"“Running is the only healthy activity.”", why:"It’s a symbol, not a rule." },
          { t:"“Food doesn’t matter if you’re active.”", why:"Both matter." },
          { t:"“The guide is for athletes only.”", why:"It’s for the general population." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the clearest, most accurate description of energy balance?", options:[
          { t:"“Energy balance compares the energy taken in from food and drink with the energy used for basal metabolism, digesting food and activity; it shifts from day to day, and bodies adapt.”", ok:true, why:"It names intake, all three parts of expenditure, and that the balance shifts and bodies adapt." },
          { t:"“Energy balance means eating the same number of calories every day.”", why:M4 },
          { t:"“Energy balance is only about exercise.”", why:"Intake and BMR are part of it." },
          { t:"“Energy balance tells you whether someone is healthy.”", why:"It’s one factor among many; health isn’t a single number." }] },
        b:{ prompt:"Which best explains why two 35-year-olds can have different energy needs?", options:[
          { t:"“Needs depend on body size and composition, activity, sex and other factors, so they differ between people.”", ok:true, why:"Needs differ from person to person." },
          { t:"“Everyone the same age has the same needs.”", why:M4 },
          { t:"“Only exercise changes needs.”", why:"BMR differs too." },
          { t:"“Needs depend only on how much someone eats.”", why:M4 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A family wants to lower the sodium in their fried rice without losing flavour. Which change fits best?", options:[
          { t:"Use lower-sodium soy sauce and add more vegetables and aromatics such as garlic and ginger", ok:true, why:"It cuts the biggest source of sodium, and the vegetables and aromatics keep the flavour." },
          { t:"Add more regular soy sauce", why:"That raises sodium." },
          { t:"Remove all vegetables", why:"Vegetables add flavour, fibre and nutrients." },
          { t:"Replace the rice with instant noodles and their seasoning", why:"The seasoning packet is often very high in sodium." }] },
        b:{ prompt:"A pasta recipe uses white pasta and a cream sauce. Which change best follows the guide?", options:[
          { t:"Use whole wheat pasta and add vegetables to the sauce", ok:true, why:"A whole grain and more vegetables move it toward the plate." },
          { t:"Use more cream", why:"That adds saturated fat." },
          { t:"Double the pasta", why:"That doesn’t change its type or add vegetables." },
          { t:"Add sugar to the sauce", why:"That adds free sugars." }] } },
      { id:"a2", cat:"A", goal:1,
        a:{ prompt:"A café wants to follow the guide’s advice on drinks. Which change fits best?", options:[
          { t:"Offer free tap water and unsweetened milk prominently, with sugary drinks not the default", ok:true, why:"Water is the guide’s drink of choice, and unsweetened milk is a healthy option too." },
          { t:"Offer only juice, since it’s fruit", why:M5 },
          { t:"Remove water to sell more drinks", why:"Water is the guide’s drink of choice." },
          { t:"Add sports drinks for everyone", why:"Not needed for most people." }] },
        b:{ prompt:"A school cafeteria wants to follow the guide’s protein advice. Which change fits best?", options:[
          { t:"Offer plant-based protein options more often, such as lentil soup, bean chili and tofu bowls", ok:true, why:"The guide suggests choosing plant-based protein foods more often." },
          { t:"Remove all protein foods", why:"Protein foods are a quarter of the plate." },
          { t:"Serve only processed meats", why:"The guide suggests limiting highly processed foods." },
          { t:"Offer protein bars instead of meals", why:"Whole foods and meals are preferred." }] } }
    ]
  },
  task:{
    title:"Rui’s plate", summary:"Rui’s plate",
    statement:"<p>Rui, 67, is lacto-ovo vegetarian, lives on a fixed income, and his doctor has reminded him about calcium and vitamin D. Build one lunch plate that meets every condition. Can you find three different plates?</p>",
    // VERIFY: model prices (plan: "verify typical values before release"). 27 of the 1200 plates pass every line (rechecked by search).
    // If a price changes, recount.
    rows:[
      { id:"v", t:"Two different vegetables or fruits (fill half the plate)", pick:2, items:[
        { id:"V1", t:"Frozen broccoli", c:75, veg:true }, { id:"V2", t:"Carrots", c:40, veg:true }, { id:"V3", t:"Bok choy", c:90, veg:true },
        { id:"V4", t:"Canned peaches in juice", c:60 }, { id:"V5", t:"Apple", c:50 }, { id:"V6", t:"Fresh berries", c:150 }] },
      { id:"g", t:"One grain (quarter)", items:[
        { id:"G1", t:"Brown rice", c:30, whole:true }, { id:"G2", t:"White rice", c:25 }, { id:"G3", t:"Whole wheat roti", c:40, whole:true }, { id:"G4", t:"Instant noodles with seasoning", c:50, salty:true }] },
      { id:"p", t:"One protein food (quarter)", items:[
        { id:"P1", t:"Lentil dal", c:60, vegn:true }, { id:"P2", t:"Calcium-set tofu", c:80, vegn:true }, { id:"P3", t:"Eggs", c:70, vegn:true }, { id:"P4", t:"Chicken thigh", c:140 }, { id:"P5", t:"Canned salmon", c:160 }] },
      { id:"d", t:"One drink", items:[
        { id:"D1", t:"Water", c:0 }, { id:"D2", t:"Unsweetened fortified soy beverage", c:40, cad:true }, { id:"D3", t:"1% milk", c:35, cad:true }, { id:"D4", t:"Fruit drink", c:30 }] }
    ],
    tags:{ veg:"vegetable", fruit:"fruit", whole:"whole grain", refined:"refined", salty:"high sodium", vegetarian:"vegetarian", cad:"calcium and vitamin D" },
    budget:250,
    checks:["Half the plate: at least one vegetable", "A whole grain", "Fits Rui’s vegetarian eating", "A drink with calcium and vitamin D", "Within his $2.50 lunch budget"],
    tips:["Pick at least one vegetable, not just fruit.", "Brown rice or whole wheat roti keeps the fibre.", "Rui doesn’t eat meat or fish; lentils, tofu and eggs work.",
      "Water is the guide’s drink of choice, but this plan asks for a drink that also gives calcium and vitamin D: milk or fortified soy.", "Berries and broccoli together cost a lot; try carrots or apples."],
    explainPrompt:"Explain how your plate follows Canada’s Food Guide and fits Rui’s needs and budget.",
    vocab:"Use the words proportions, whole grain, plant-based protein and calcium.",
    checkLabel:"Check my plate",
    success:"This plate works for Rui.",
    // VERIFY: Health Canada's advice that adults over 50 take a daily vitamin D supplement.
    after3:"There are 27 plates in all. Notice that the cheapest vegetables make room for tofu or eggs. Health Canada also advises adults over 50 to take a daily vitamin D supplement: a conversation for Rui and his doctor."
  },
  cards:[
    ["Canada’s Food Guide plate (2019)", "Half vegetables and fruits, a quarter whole grains, a quarter protein foods; water to drink."],
    ["Healthy eating habits", "Cook more often, enjoy food, eat with others, be mindful, use labels, limit highly processed foods, watch marketing."],
    ["Why servings were dropped", "Proportions and habits are easier to apply and fit different foods and cultures."],
    ["EAR", "Meets the needs of about half of a healthy group; used to assess groups."],
    ["RDA", "Meets the needs of nearly all (about 97–98%) healthy people."],
    ["AI", "Used when there isn’t enough evidence for an EAR."],
    ["UL", "Highest daily intake unlikely to cause harm; more isn’t better."],
    // VERIFY: AMDR values
    ["AMDR", "Energy ranges: carbohydrate 45–65%, fat 20–35%, protein 10–35% for adults."],
    ["Energy from macronutrients", "Carbohydrate 4, protein 4, fat 9 kcal per gram."],
    ["Energy expenditure", "BMR + activity + thermic effect of food (≈ 10%)."],
    ["MET", "A multiple of resting energy use; MET × minutes compares activities."],
    ["Guides around the world", "Japan’s spinning top, Brazil’s guidelines, US MyPlate, a Mediterranean pyramid: different shapes, similar evidence."]
  ]
};
