// HFA4U 14 Obesity, Osteoporosis & Other Diet-Related Issues. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/14-obesity-osteoporosis.md
// Teacher notes: lines marked VERIFY carry the plan's "verify" flags (students see the plan's wording without them) and every
// value or text the builder had to supply. Care notes (course plan §2, applied strictly): no student weights, weight targets,
// BMI numbers or calorie targets anywhere; no body images; every persona is fictional, described in words, with no gender
// assigned; person-first language; weight bias is named as a harm. Nothing asks about a student's own body, weight or diet.

// VERIFY: helpline numbers (course plan §2 support note). Shown at the top of Start, Explore, Reflect and the Final Check.
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p><p>' + ADVICE + "</p></div>";

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "Genes, sleep, stress, medications, income and food environments all feed in. Willpower is one small card on a very big map.";
const M2 = "BMI doesn’t measure fat, muscle, fitness or health. Health is judged by how the body is actually working.";
const M3 = "Weight stigma is linked to more stress, avoiding health care and less activity. It harms; it doesn’t help.";
const M4 = "Most bone mass is built by your late 20s. The habits you have now set the size of the bank.";
const M5 = "Fortified soy beverages, calcium-set tofu, canned salmon with bones, beans, almonds and greens all add calcium.";
const M6 = "An allergy is an immune reaction that can be life-threatening; celiac disease is an autoimmune reaction to gluten; an intolerance is trouble digesting something, like lactose.";
const M7 = "Tea and coffee reduce iron absorption from plant foods. Pair plant iron with vitamin C instead.";
const LEVELS = "Personal, community, policy. Changing conditions reaches more people than blaming individuals.";

// VERIFY: every reference (titles, years, author lists, volume and pages) before release.
const REFS = '<ul class="hfa-refs">' +
  "<li>Health Canada. (n.d.). <i>Vitamin D and calcium: Updated dietary reference intakes</i>. Government of Canada.</li>" +
  "<li>Institute of Medicine. (2011). <i>Dietary reference intakes for calcium and vitamin D</i>. The National Academies Press.</li>" +
  "<li>Osteoporosis Canada. (n.d.). <i>Osteoporosis facts and statistics</i>. Osteoporosis Canada.</li>" +
  "<li>Puhl, R. M., &amp; Heuer, C. A. (2010). Obesity stigma: Important considerations for public health. <i>American Journal of Public Health, 100</i>(6), 1019–1028.</li>" +
  "<li>Wharton, S., Lau, D. C. W., Vallis, M., Sharma, A. M., Biertho, L., Campbell-Scherer, D., … Wicklum, S. (2020). Obesity in adults: A clinical practice guideline. <i>CMAJ, 192</i>(31), E875–E891.</li></ul>" +
  '<p class="tiny muted">' + ADVICE + "</p>";

export default {
  id:"14-obesity-osteoporosis",
  kind:"topic",
  title:"Obesity, osteoporosis and other diet-related issues",
  topic:"Obesity, Osteoporosis and Other Diet-Related Issues",
  readyTopic:"obesity, osteoporosis and other diet-related issues",
  support:SUPPORT,
  hero:{
    eq:"Many causes, many paths.", eqSize:"sm",
    headline:"No single cause, no single fix.",
    text:"Diet-related conditions such as <strong>obesity</strong>, <strong>osteoporosis</strong>, <strong>anemia</strong> and <strong>celiac disease</strong> don’t come from one choice. They come from biology, income, places, stress and habits working together. In this module you’ll map those causes, see why <strong>BMI</strong> can’t tell the whole story, and learn how the <strong>bone bank</strong> you build now protects you for life.",
    fig:{ html:'<div class="ob-hero" id="ob-hero"></div>', caption:"" },
    // storyboard: ten word cards (plan order) link into a web; then a bone-mass curve. The web's lines are decorative.
    words:["Genes", "Sleep", "Stress", "Medications", "Income", "Grocery access", "Marketing", "Streets", "Stigma", "Hormones"],
    caps:{ web:"Many causes", bone:"Build the bank early" },
    aria:"Ten word cards drift in: genes, sleep, stress, medications, income, grocery access, marketing, streets, stigma and hormones. Thin lines link them into a web. The web moves to the left, and a line draws bone mass across a lifetime: rising through childhood and the teens to a peak near age 30, then gently declining.",
    rmAria:"Two images side by side. Left, labelled “Many causes”: ten word cards (genes, sleep, stress, medications, income, grocery access, marketing, streets, stigma and hormones) linked by thin lines into a web. Right, labelled “Build the bank early”: a bone-mass curve rising to a peak near age 30, then gently declining."
  },
  goals:[
    "I can explain obesity as a complex chronic disease with many interacting causes, not a matter of willpower.",
    "I can evaluate strategies at the personal, community and policy levels, and recognize which ones blame people and which ones change conditions.",
    "I can explain the limits of BMI and use respectful, person-first language about weight and health.",
    "I can explain how bone mass builds and declines across life, and which factors affect it.",
    "I can plan food choices that meet the needs of a specific condition (bone health, celiac disease, anemia, lactose intolerance, food allergy).",
    "I can assess how heredity, income, geography and lifestyle each contribute to diet-related conditions."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Bone nutrients", goal:4,
          prompt:"Which two nutrients work most directly together to build and keep bone?",
          options:[
            { t:"Calcium and vitamin D", ok:true, why:"Calcium is the mineral in bone; vitamin D helps the body absorb it." },
            { t:"Iron and vitamin C", why:"That pair helps with iron absorption, not bone." },
            { t:"Protein and fat", why:"Protein matters for bone, but fat isn’t a bone builder." },
            { t:"Sodium and potassium", why:"These are electrolytes; high sodium can even increase calcium loss." }],
          hints:["Which mineral makes up bone?", "Calcium. Which vitamin helps you absorb it?", "Calcium and vitamin D."] },
        { id:"w2", skill:"Bone nutrients", goal:5,
          prompt:"Which of these is a good <strong>non-dairy</strong> source of calcium?",
          options:[
            { t:"Calcium-set tofu", ok:true, why:"Tofu made with calcium sulphate is rich in calcium." },
            { t:"White rice", why:"Rice is mostly starch, with little calcium." },
            { t:"An apple", why:"Fruit has little calcium." },
            { t:"Chicken breast", why:"Meat has little calcium." }],
          hints:["Look for a food made with a calcium salt.", "Tofu can be set with calcium sulphate.", "Calcium-set tofu."] },
        { id:"w3", skill:"Canada’s Food Guide", goal:5,
          prompt:"Canada’s Food Guide (2019) suggests making half your plate…",
          options:[
            { t:"vegetables and fruits", ok:true, why:"Half vegetables and fruits, a quarter whole grains, a quarter protein foods." },
            { t:"protein foods", why:"Protein foods are a quarter." },
            { t:"whole grains", why:"Whole grains are a quarter." },
            { t:"milk and dairy", why:"The 2019 guide has no separate milk group; milk and fortified soy beverages are protein foods." }],
          hints:["Picture the plate.", "The biggest section is colourful produce.", "Vegetables and fruits."] },
        { id:"w4", skill:"Reading health claims", goal:6,
          prompt:"A study finds that people who drink more milk have fewer fractures. What can you conclude?",
          options:[
            { t:"There’s an association; other factors (activity, income, vitamin D) might explain it", ok:true, why:"Observational data show links, not proof of cause." },
            { t:"Milk prevents fractures", why:"The study didn’t test cause." },
            { t:"Fractures make people drink less milk", why:"That’s possible but not shown; we can’t tell direction from this." },
            { t:"Nothing at all", why:"An association is useful evidence; it just isn’t proof." }],
          hints:["Was anything assigned, or just observed?", "Observed: so it’s an association.", "Other factors could explain it."] },
        { id:"w5", skill:"Conditions of digestion", goal:5,
          prompt:"Celiac disease is an immune reaction to…",
          options:[
            { t:"gluten (in wheat, barley and rye)", ok:true, why:"It damages the small intestine’s lining when gluten is eaten." },
            { t:"lactose", why:"That’s lactose intolerance, a digestion problem." },
            { t:"sugar", why:"Celiac disease isn’t about sugar." },
            { t:"food additives", why:"The trigger is the protein gluten." }],
          hints:["It’s a protein in some grains.", "Wheat, barley, rye.", "Gluten."] },
        { id:"w6", skill:"Conditions of digestion", goal:5,
          prompt:"Which best describes lactose intolerance?",
          options:[
            { t:"Difficulty digesting milk sugar because of low lactase", ok:true, why:"Symptoms are digestive, not an immune reaction." },
            { t:"An immune reaction to milk protein", why:"That’s a milk allergy." },
            { t:"A reaction to gluten", why:"That’s celiac disease." },
            { t:"A vitamin D deficiency", why:"Vitamin D is a separate issue." }],
          hints:["Lactose is a sugar.", "Lactase is the enzyme that digests it.", "Low lactase, so trouble digesting lactose."] }
      ],
      refreshers:{
        "Bone nutrients":"Calcium is the main mineral in bone; vitamin D helps you absorb it. Weight-bearing activity tells bone to stay strong.",
        "Canada’s Food Guide":"Half vegetables and fruits, a quarter whole grains, a quarter protein foods (including milk, yogurt, fortified soy beverages, beans and tofu); water to drink.",
        "Reading health claims":"Observational studies show associations; experiments (trials) can test causes. Always ask what else could explain a link.",
        "Conditions of digestion":"Allergy = immune reaction (can be severe). Celiac disease = autoimmune reaction to gluten. Intolerance = trouble digesting (e.g. lactose)."
      }
    }
  },
  explore:{
    heading:"Many causes, many paths",
    intro:"Three views of diet-related health. Map the causes of obesity, compare BMI with a full health picture, then build a bone bank and watch it over a lifetime.",
    modes:[{ id:"causes", t:"Causes map" }, { id:"bmi", t:"BMI vs full picture" }, { id:"bone", t:"Bone bank" }],
    // ----- Mode A: causes map (F7). answer = the accepted domain(s) (plan TC1 table). fixed = non-modifiable (course plan §4:
    // non-modifiable --ink-2, modifiable blue). VERIFY: the modifiable / non-modifiable tag on each card is the builder's.
    domains:[
      { id:"bio", t:"Biology & genetics" },
      { id:"env", t:"Food & activity environment" },
      { id:"soc", t:"Social & economic conditions" },
      { id:"psy", t:"Psychological factors" },
      { id:"care", t:"Health care & medications" }
    ],
    cards:[
      { id:"c1", t:"Genes that affect appetite regulation", short:"Genes", answer:["bio"], fixed:true },
      { id:"c2", t:"Hormone changes (puberty, menopause)", short:"Hormones", answer:["bio"], fixed:true },
      { id:"c3", t:"Neighbourhood with few grocery stores", short:"Grocery stores", answer:["env"] },
      { id:"c4", t:"Heavy marketing of highly processed foods", short:"Marketing", answer:["env"] },
      { id:"c5", t:"Streets that aren’t safe or easy to walk", short:"Streets", answer:["env"] },
      { id:"c6", t:"Low income and food insecurity", short:"Low income", answer:["soc"] },
      { id:"c7", t:"Shift-work schedules", short:"Shift work", answer:["soc"] },
      { id:"c8", t:"Chronic stress", short:"Stress", answer:["psy"] },
      { id:"c9", t:"Weight stigma and teasing", short:"Stigma", answer:["psy", "soc"] },
      { id:"c10", t:"Medications that can increase appetite", short:"Medications", answer:["care"] }
    ],
    kindKey:"Blue edge: modifiable (people, communities or policy can change it). Grey edge: non-modifiable.",
    // VERIFY: the 14 links and their one-line reasons are the builder's (the plan gives the idea and one example chain,
    // low income → food insecurity → stress, and the count of 14 in its readout example).
    links:[
      { a:"c6", b:"c8", t:"Worry about money and food adds stress." },
      { a:"c6", b:"c3", t:"Lower-income neighbourhoods often have fewer full grocery stores." },
      { a:"c6", b:"c5", t:"Lower-income areas often have busier roads and fewer safe places to walk." },
      { a:"c6", b:"c7", t:"Many lower-paid jobs involve shift work." },
      { a:"c7", b:"c8", t:"Shifting schedules cut sleep and add stress." },
      { a:"c7", b:"c2", t:"Night shifts disrupt sleep and the hormones that help regulate appetite." },
      { a:"c9", b:"c8", t:"Stigma and teasing are a source of chronic stress." },
      { a:"c9", b:"c10", t:"Weight stigma in health care can keep people from seeking care, including reviews of their medications." },
      { a:"c4", b:"c9", t:"Ads often promote narrow body ideals, which feed weight stigma." },
      { a:"c4", b:"c3", t:"Where fresh food is hard to find, highly processed foods and their ads fill the gap." },
      { a:"c5", b:"c3", t:"Unsafe streets make it harder to walk to a store." },
      { a:"c1", b:"c2", t:"Genes and hormones work together to regulate appetite." },
      { a:"c8", b:"c2", t:"Stress hormones act alongside the body’s other hormones to affect appetite." },
      { a:"c10", b:"c8", t:"Some medications used for mental health conditions can increase appetite." }
    ],
    // ----- Mode B: BMI vs full picture (plan table). Fictional personas, words only; no weights or BMI numbers; no gender.
    personas:[
      { id:"jordan", name:"Jordan", age:17, role:"competitive rower", bmi:"higher", bp:"healthy", sugar:"healthy", fit:"high", sleep:"healthy", mental:"healthy" },
      { id:"morgan", name:"Morgan", age:45, role:"office worker", bmi:"in range", bp:"concern", sugar:"healthy", fit:"low", sleep:"concern", mental:"healthy" },
      { id:"sam", name:"Sam", age:60, role:"retired teacher", bmi:"higher", bp:"concern", sugar:"concern", fit:"low", sleep:"healthy", mental:"healthy" },
      { id:"alex", name:"Alex", age:30, role:"nurse on night shifts", bmi:"in range", bp:"healthy", sugar:"healthy", fit:"moderate", sleep:"concern", mental:"concern" }
    ],
    measures:[{ id:"bp", t:"Blood pressure" }, { id:"sugar", t:"Blood sugar" }, { id:"fit", t:"Fitness" }, { id:"sleep", t:"Sleep" }, { id:"mental", t:"Mental health" }],
    bmiNote:"A word only. BMI uses weight and height, so it can’t tell muscle from fat, where fat is stored, or whether the body is working well.",
    // ----- Mode C: bone bank (plan "Model rules (exact)")
    bone:{
      habits:[
        { id:"ca", t:"Calcium intake", levels:[{ id:"adequate", t:"adequate", pts:0 }, { id:"low", t:"low", pts:-10 }] },
        { id:"vd", t:"Vitamin D", levels:[{ id:"adequate", t:"adequate", pts:0 }, { id:"low", t:"low", pts:-5 }] },
        { id:"act", t:"Weight-bearing activity", levels:[{ id:"low", t:"low", pts:-10 }, { id:"moderate", t:"moderate", pts:0 }, { id:"high", t:"high", pts:5 }] },
        { id:"smk", t:"Smoking", levels:[{ id:"no", t:"no", pts:0 }, { id:"yes", t:"yes", pts:-5 }] }
      ],
      base:{ ca:"adequate", vd:"adequate", act:"moderate", smk:"no", meno:"off" },
      meno:"Menopause toggle",
      zone:70,
      rules:[
        "<strong>Peak index</strong> = 100 − 10 (low calcium) − 5 (low vitamin D) − 10 (low activity) + 5 (high activity) − 5 (smoking). Moderate activity adds 0.",
        "The index rises to its peak at age 30, holds until 40, then falls 0.5 points per year.",
        "With the menopause toggle on, it falls an extra 1 point per year from age 50 to 60.",
        "The <strong>fracture-risk zone</strong> is an index of 70 or below."
      ],
      note:"A teaching model; real bone health depends on many more factors."
    },
    predictions:[
      { id:"p1", prompt:"<strong>Causes map.</strong> A headline says obesity is ‘a lack of willpower’. After you place all 10 cards, how many of the 5 domains will hold at least one card?",
        options:[{ t:"5", ok:true }, { t:"1" }, { t:"2" }, { t:"3" }],
        explain:"Every domain holds a cause, and only one card (stress) is even partly about personal control. ‘Willpower’ misses most of the map." },
      { id:"p2", prompt:"<strong>BMI vs full picture.</strong> Jordan’s BMI category is ‘higher’. What will the full health panel show?",
        options:[{ t:"All five measures in the healthy range", ok:true }, { t:"Concerns in every measure" }, { t:"Concerns in blood pressure only" }, { t:"It can’t be shown without a weight" }],
        explain:"BMI can’t tell muscle from fat. Jordan’s body is working well." },
      { id:"p3", prompt:"<strong>Bone bank</strong>, all youth habits at baseline (peak 100). Rowan’s teen activity drops from moderate to low. What happens to the peak index?",
        options:[{ t:"It drops to 90", ok:true }, { t:"It stays at 100" }, { t:"It drops to 95" }, { t:"It rises to 105" }],
        explain:"Weight-bearing activity builds bone. In this model, low activity costs 10 points of peak bone mass." },
      { id:"p4", prompt:"<strong>Bone bank</strong>, peak 100. Two people both have a peak index of 100. One has the menopause toggle on. When does each enter the fracture-risk zone?",
        options:[{ t:"Toggle on: age 80; toggle off: not before 100", ok:true }, { t:"Both at age 80" }, { t:"Toggle on: 60; toggle off: 80" }, { t:"Neither ever does" }],
        explain:"<strong>Toggle on:</strong> 100 → 95 by 50 → 80 by 60, then 0.5 a year to 70 at 80. <strong>Toggle off:</strong> falling 0.5 a year from 40 reaches 70 only at age 100." }
    ],
    challenges:[
      { id:"tc1", goal:1,
        prompt:"<strong>Causes map:</strong> place all 10 cards in a correct domain.",
        why:"Obesity isn’t one cause: every domain has a card.",
        msgs:{
          c2care:"Hormone changes are biology; medications are the health-care card.",
          c3soc:"Grocery access is part of the food environment. Low income is the social and economic card.",
          c10bio:"The cause is the medication, which is a health-care factor.",
          // the lines below are the builder's
          tray:"Place all 10 cards: {n} still in the tray.",
          demo:"That was the reveal’s map. Your own map is back: place the cards yourself.",
          general:"{n} of the cards sit in a domain that doesn’t fit. Ask: is this inside the body, around the person, about money and work, about the mind, or about treatment?" },
        hints:["Ask: is this inside the body, around the person, about money and work, about the mind, or about treatment?", "Streets, stores and ads are the environment.",
          "Biology & genetics: cards 1 and 2. Food & activity environment: cards 3, 4 and 5. Social & economic conditions: cards 6 and 7. Psychological factors: card 8, and card 9 (card 9 also fits Social & economic conditions). Health care & medications: card 10."] },
      { id:"tc2", goal:3,
        prompt:"<strong>BMI vs full picture:</strong> find the persona whose BMI category is ‘in range’ but whose full panel shows at least one concern linked to heart health.",
        why:"BMI can flag a healthy rower and miss a person with high blood pressure.",
        msgs:{
          alex:"Alex’s concerns are sleep and mental health, not heart-health measures.",
          jordan:"Jordan’s BMI category is ‘higher’, and the panel is healthy.",
          sam:"Sam’s BMI category is ‘higher’.",
          // the lines below are the builder's
          mode:"Switch to BMI vs full picture, then choose a persona.",
          none:"Choose a persona first." },
        hints:["Filter to ‘in range’.", "Of those, which has a blood pressure concern?", "Morgan."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"<strong>Bone bank, menopause toggle on:</strong> choose youth habits so the curve stays out of the fracture-risk zone until at least age 80.",
        why:"Peak bone mass is your margin. Youth habits set how long it lasts.",
        banner:"Peak bone mass is your margin. Youth habits set how long it lasts.",
        msgs:{
          p95:"With the toggle on, 95 → 90 by 50 → 75 by 60 → 70 at age 70.",
          lowca:"Low calcium alone costs 10 points; you’d need +10 elsewhere, and the most activity adds is +5.",
          // the lines below are the builder's
          mode:"Switch to Bone bank.",
          meno:"Turn the menopause toggle on: this challenge is about that curve.",
          general:"Peak {p}: the curve enters the zone {age}. With the toggle on, the peak must be at least 100." },
        hints:["Work out how many points the curve loses from age 40 to 60 with the toggle on.",
          "5 (age 40 to 50) + 15 (age 50 to 60) = 20 by age 60. Then 0.5 a year. To reach 70 no earlier than 80, the index must be at least 80 at 60.",
          "So the peak must be at least 100: adequate calcium, and the rest adding up to no net loss."] }
    ]
  },
  part3:{
    slug:"bones", name:"Build bones", heading:"Build bones",
    // VERIFY: the intro and the station instructions are the builder's.
    intro:"Move from the model to real food and real words. Plan calcium and vitamin D from everyday foods, read the fracture facts, then audit weight-bias language.",
    st1:{
      title:"Station 1: Calcium and vitamin D, beyond the milk glass",
      intro:"Tap foods to add one serving each to a model day. The bars compare the day’s total with the RDAs for ages 14–18: a population reference, not a personal target.",
      // VERIFY: model values, rounded; check against the Canadian Nutrient File before release (plan table).
      foods:[
        { id:"soy", t:"Fortified soy beverage", short:"soy beverage", serving:"250 mL", ca:300, vd:100, note:"Non-dairy" },
        { id:"tofu", t:"Calcium-set tofu", short:"tofu", serving:"150 g", ca:250, vd:0, note:"Non-dairy" },
        { id:"salmon", t:"Canned salmon with bones", short:"salmon", serving:"75 g", ca:200, vd:300, note:"Fish", fish:true },
        { id:"milk", t:"Milk", short:"milk", serving:"250 mL", ca:300, vd:100, note:"Dairy", dairy:true },
        { id:"bokchoy", t:"Cooked bok choy", short:"bok choy", serving:"125 mL", ca:100, vd:0, note:"Vegetable", veg:true },
        { id:"beans", t:"White beans", short:"white beans", serving:"175 mL", ca:100, vd:0, note:"Plant protein" },
        { id:"almonds", t:"Almonds", short:"almonds", serving:"60 mL", ca:100, vd:0, note:"Tree nut" },
        { id:"egg", t:"Egg", short:"egg", serving:"1 large", ca:25, vd:40, note:"" }
      ],
      label:"Model values, rounded for hand arithmetic.",
      // VERIFY: calcium RDAs (1300 mg ages 14–18; 1000 mg ages 19–50) and the vitamin D RDA (600 IU ages 1–70).
      refs:{ ca:1300, vd:600 },
      hide:"Hide dairy and fish (Rowan’s needs)",
      // VERIFY: each line of the data panel (RDAs, the supplement advice for adults over 50, winter sunlight in Canada).
      data:'<ul class="ob-facts"><li><strong>Calcium RDAs:</strong> 1300 mg a day for ages 14–18; 1000 mg for adults 19–50 (Institute of Medicine, 2011).</li>' +
        "<li><strong>Vitamin D RDA:</strong> 600 IU a day for ages 1–70 (Institute of Medicine, 2011).</li>" +
        "<li><strong>Adults over 50:</strong> Health Canada advises a daily vitamin D supplement of 400 IU (Health Canada, n.d.).</li>" +
        "<li><strong>Winter in Canada:</strong> sunlight makes little vitamin D in the skin in winter, so food sources matter more (Health Canada, n.d.).</li></ul>"
    },
    st2:{
      title:"Station 2: Fracture facts",
      // VERIFY: Osteoporosis Canada's lifetime fracture estimate (1 in 3 women, 1 in 5 men) and its source page; the hip-fracture
      // paragraph is the builder's; the age of peak bone mass.
      html:'<ul class="ob-facts"><li><strong>How common:</strong> Osteoporosis Canada estimates that at least 1 in 3 women and 1 in 5 men will have a fracture caused by osteoporosis during their lifetime (Osteoporosis Canada, n.d.).</li>' +
        "<li><strong>Why hips matter:</strong> a hip fracture usually means surgery and a long recovery. Many older adults need more help with daily life afterward, and some can no longer live on their own. Strong bones protect independence.</li>" +
        "<li><strong>When the bank fills:</strong> bone mass peaks in early adulthood, around the late 20s to 30 (Osteoporosis Canada, n.d.). After that, the goal is to keep what you’ve built.</li></ul>"
    },
    st3:{
      title:"Station 3: Weight-bias language audit",
      intro:"Six sentences. Tap <strong>Respectful</strong> or <strong>Needs rewriting</strong>. If a sentence needs rewriting, choose the rewrite that fixes it.",
      sentences:[
        { id:"s1", t:"“Obese people should just eat less.”", answer:{ v:"rewrite", r:"r1" } },
        { id:"s2", t:"“People living with obesity deserve respectful health care.”", answer:{ v:"respect" } },
        { id:"s3", t:"“She let herself go.”", answer:{ v:"rewrite", r:"r2" } },
        { id:"s4", t:"“A person’s size doesn’t tell you their habits or health.”", answer:{ v:"respect" } },
        { id:"s5", t:"“Shaming kids about weight will motivate them.”", answer:{ v:"rewrite", r:"r3" } },
        { id:"s6", t:"“Bodies come in many sizes.”", answer:{ v:"respect" } }
      ],
      rewrites:[
        { id:"r1", t:"“People living with obesity face many causes, and support works better than blame.”" },
        { id:"r2", t:"“Her health needs have changed.”" },
        { id:"r3", t:"“Weight stigma harms children’s health; supportive environments help.”" }
      ],
      // VERIFY: the audit feedback lines are the builder's.
      fb:{
        respect:"Right. This sentence is respectful: it doesn’t label or blame anyone.",
        notRespect:"Not quite. This sentence labels or blames people. Look for a label in place of a person, or blame in place of causes.",
        notRewrite:"Not quite. This one is already respectful: it doesn’t label or blame anyone.",
        rewrite:"Right, it needs rewriting. Now choose the rewrite that fixes it.",
        rightR:"Right. The rewrite keeps the person first and drops the blame.",
        wrongR:"Not quite. That rewrite answers a different sentence. Choose the one that replaces this sentence’s message."
      }
    },
    blocks:[{ title:"Sources (APA 7)", html:REFS }],
    quickCheck:{
      title:"Build bones quick check", summary:"Build bones quick check",
      // "Right." lines are the builder's; the wrong-choice feedback is the plan's.
      items:[
        { id:"q1", goal:5, prompt:"Rowan avoids dairy. Which pair adds the most calcium?",
          choices:[{ t:"Soy beverage + tofu", ok:true, fb:"Right. 300 + 250 = 550 mg; the others are 200 mg or less." },
            { t:"Almonds + bok choy", fb:"300 + 250 = 550 mg; the others are 200 mg or less." },
            { t:"Egg + beans", fb:"300 + 250 = 550 mg; the others are 200 mg or less." },
            { t:"Bok choy + beans", fb:"300 + 250 = 550 mg; the others are 200 mg or less." }] },
        { id:"q2", goal:5, prompt:"Which food in the table supplies the most vitamin D per serving?",
          choices:[{ t:"Canned salmon", ok:true, fb:"Right. 300 IU, but Rowan doesn’t eat fish; that’s why fortified soy beverage matters." },
            { t:"Milk", fb:"300 IU, but Rowan doesn’t eat fish; that’s why fortified soy beverage matters." },
            { t:"Egg", fb:"300 IU, but Rowan doesn’t eat fish; that’s why fortified soy beverage matters." },
            { t:"Tofu", fb:"300 IU, but Rowan doesn’t eat fish; that’s why fortified soy beverage matters." }] },
        { id:"q3", goal:3, prompt:"Which sentence is person-first?",
          choices:[{ t:"“People living with obesity…”", ok:true, fb:"Right. Name the person before the condition." },
            { t:"“Obese people…”", fb:"Name the person before the condition." },
            { t:"“The obese…”", fb:"Name the person before the condition." },
            { t:"“Fatties…”", fb:"Name the person before the condition." }] },
        { id:"q4", goal:4, prompt:"Why does teen activity matter for a 70-year-old’s hips?",
          choices:[{ t:"It builds the peak bone bank", ok:true, fb:"Right. Most bone mass is banked by your late 20s." },
            { t:"It burns calories", fb:"Most bone mass is banked by your late 20s." },
            { t:"It lowers BMI", fb:"Most bone mass is banked by your late 20s." },
            { t:"It doesn’t", fb:"Most bone mass is banked by your late 20s." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Condition ↔ nutrition strategy", summary:"Condition ↔ nutrition strategy", goal:[5, 6],
        // VERIFY: the instruction and the default mismatch line are the builder's.
        instruction:"Eight conditions and situations. Match each one with the nutrition strategy that meets its needs.",
        leftTitle:"Condition or situation", rightTitle:"Nutrition strategy",
        left:[
          { id:"l1", t:"Celiac disease" },
          { id:"l2", t:"Iron-deficiency anemia" },
          { id:"l3", t:"Lactose intolerance" },
          { id:"l4", t:"Peanut allergy" },
          { id:"l5", t:"Low peak bone mass risk in a teen" },
          { id:"l6", t:"An older adult over 50 in a Canadian winter",
            hints:["What happens to vitamin D from sunlight in winter?", "In Canada it’s low; older adults also make less.", "Food plus the supplement advice."] },
          { id:"l7", t:"A family living with food insecurity" },
          { id:"l8", t:"A person living with obesity seeking care" }
        ],
        right:[
          { id:"r1", t:"Strictly gluten-free: no wheat, barley or rye; watch for cross-contact" },
          { id:"r2", t:"Iron-rich foods paired with vitamin C; tea and coffee away from meals" },
          { id:"r3", t:"Lactose-free milk or non-dairy calcium sources (fortified soy beverage, calcium-set tofu)" },
          { id:"r4", t:"Strict avoidance; read every label; no cross-contact" },
          { id:"r5", t:"Calcium and vitamin D foods plus weight-bearing activity" },
          // VERIFY: Health Canada's vitamin D supplement advice for adults over 50.
          { id:"r6", t:"Vitamin D-rich foods and Health Canada’s supplement advice" },
          { id:"r7", t:"Income and access supports; affordable nutrient-dense staples (canned fish, beans, frozen vegetables)" },
          { id:"r8", t:"Respectful, individualized support from a health team, focused on health outcomes, not blame" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        // the plan's mismatch lines (written "1 ↔ 3" etc.), used in both directions
        wrong:{
          "l1|r3":"Celiac disease is an immune reaction to gluten, not a problem digesting lactose.",
          "l3|r1":"Celiac disease is an immune reaction to gluten, not a problem digesting lactose.",
          "l2|r5":"Calcium and vitamin D build bone; iron needs vitamin C.",
          "l5|r2":"Calcium and vitamin D build bone; iron needs vitamin C.",
          "l4|r3":"An allergy needs strict avoidance; an intolerance is about digestion.",
          "l3|r4":"An allergy needs strict avoidance; an intolerance is about digestion.",
          "l7|r8":"Food insecurity is about income and access first.",
          "l8|r7":"Food insecurity is about income and access first."
        },
        wrongDefault:"Read the condition again: what does the body, or the situation, need first?" },
      { id:"data", type:"custom", title:"Bone and body data", summary:"Bone and body data", star:true, goal:[2, 4, 6],
        instruction:"Six items: calcium arithmetic, two bone-model questions, an investigation and a policy question. Items marked ★ are non-routine; B5 is an investigation.",
        how:"Type a number or tap a choice, then press Check.",
        // VERIFY: hints for B1–B3, B5 and B6, and the two wrong choices in B5, are the builder's (the plan gives B4's hints).
        items:[
          { id:"b1", kind:"num", goal:4, prompt:"Using the Station 1 table, how much calcium is in 2 servings of soy beverage plus 1 of tofu?",
            fields:[{ label:"Calcium", unit:"mg" }], answer:[850], display:"850 mg",
            wrong:[{ match:[550], fb:"Two soy beverages: 600, plus 250." }], wrongDefault:"Add 300 + 300 + 250.",
            hints:["One soy beverage has 300 mg; one tofu serving has 250 mg.", "Two soy beverages: 2 × 300 = 600 mg.", "600 + 250 = 850 mg."] },
          { id:"b2", kind:"num", goal:4, prompt:"A 16-year-old’s RDA is 1300 mg. How much more calcium is needed after B1’s foods?",
            fields:[{ label:"More calcium needed", unit:"mg" }], answer:[450], display:"450 mg",
            wrong:[{ match:[1300], fb:"Subtract what’s already eaten." }], wrongDefault:"Subtract what’s already eaten.",
            hints:["B1’s foods give 850 mg.", "Subtract: 1300 − 850.", "450 mg."] },
          { id:"b3", kind:"num", goal:4, star:true, prompt:"Bone model, toggle off: peak 90. At what age does the curve enter the zone?",
            fields:[{ label:"Age", unit:"years" }], answer:[80], display:"age 80",
            wrong:[{ match:[60], fb:"That’s with the toggle on. Off: 90 − 0.5 × (age − 40) = 70 gives 80." }], wrongDefault:"Off: 90 − 0.5 × (age − 40) = 70.",
            hints:["The index holds at 90 until 40, then falls 0.5 a year.", "It must fall 20 points: 20 ÷ 0.5 = 40 years after age 40.", "Age 80."] },
          { id:"b4", kind:"num", goal:4, star:true, prompt:"Bone model, toggle on: peak 95. Age entering the zone?",
            fields:[{ label:"Age", unit:"years" }], answer:[70], display:"age 70",
            wrong:[{ match:[80], fb:"95 → 90 by 50 → 75 by 60 → 70 at 70." }], wrongDefault:"95 → 90 by 50 → 75 by 60, then 0.5 a year.",
            hints:["Points lost from 40 to 50?", "5, then 15 more from 50 to 60.", "75 at 60, then 0.5 a year: 70 at 70."] },
          { id:"b5", kind:"chips", goal:6, star:true, inquiry:true,
            prompt:"A researcher compares fracture rates in teens who play impact sports and teens who don’t, and finds fewer fractures later in the sports group. Name one variable that could confound this.",
            chips:[{ t:"Income (access to sports and food)", ok:true }, { t:"Calcium intake", ok:true }, { t:"Family history", ok:true },
              { t:"Whether they play impact sports", fb:"That’s the variable being compared, not a confounder." },
              { t:"The number of fractures later", fb:"That’s the outcome being measured, not a confounder." }],
            fb:"Sports aren’t assigned at random; other differences can explain the link.",
            why:"Income, calcium intake and family history could each differ between the groups. Sports aren’t assigned at random; other differences can explain the link.",
            hints:["Were the teens assigned to play sports, or did they choose?", "They chose. What else might differ between the two groups and also affect bones?", "Income, calcium intake or family history: any of these."] },
          { id:"b6", kind:"chips", goal:2, star:true,
            prompt:"Policy evaluation: which strategy changes conditions for the most people?",
            chips:[{ t:"Weighing students at school", fb:"Weighing at school can increase stigma and harm." },
              { t:"Free school breakfast with fortified milk or soy options", ok:true },
              { t:"A poster saying ‘try harder’", fb:"Blame-based messages don’t change conditions." },
              { t:"Banning birthday cake", fb:"Restriction without support doesn’t change conditions." }],
            why:LEVELS,
            hints:["Which choice changes what’s available to everyone, without singling anyone out?", "Three of the choices blame, restrict or label students.", "Free school breakfast with fortified milk or soy options."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Niamh", goal:[1, 5], how:"",
        instruction:"Niamh made one mistake in each piece of work. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"Plan calcium for Niamh’s 15-year-old cousin, who eats dairy.",
            steps:["Calcium builds bone, so I’ll plan calcium-rich foods.", "The target is 1000 mg a day.", "Milk (300) + yogurt (250) + cheese (350) = 900 mg.", "Add tofu (250): 1150 mg, which meets the target."],
            answer:1, stepFb:["Step 1 is correct. Keep checking.", "", "Step 3’s arithmetic is fine; the target before it is wrong.", "This follows the wrong target."],
            fixes:[
              // VERIFY: the calcium RDA for ages 14–18 (1300 mg).
              { t:"Ages 14–18 need 1300 mg a day, so add another serving or two.", ok:true, why:"Teens need more, while the bone bank is growing." },
              { t:"Ages 14–18 need 600 mg.", why:"That’s vitamin D’s number, in IU." },
              { t:"Teens need less than adults.", why:"Teens need more, while the bone bank is growing." },
              { t:"Step 2 is correct.", why:"1000 mg is the adult (19–50) RDA." }],
            hints:["Check the RDA for ages 14–18.", "It’s higher than for adults.", "1300 mg."] },
          // VERIFY: that obesity rates have risen over recent decades (step 1).
          { id:"e2", goal:1, task:"Explain why obesity rates have risen in Canada.",
            steps:["Rates of obesity have risen over recent decades.", "Food environments changed: more highly processed foods and more marketing.", "So the real cause is that people today have less willpower.", "Therefore, the best solution is to shame people into changing."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows a wrong conclusion."],
            fixes:[
              { t:"So many interacting factors (environment, income, sleep, stress, genes, medications) shape weight; changing conditions helps more than blaming individuals.", ok:true, why:M1 },
              { t:"So people today eat more because they’re lazier.", why:M1 },
              { t:"So genes alone explain it.", why:"Genes didn’t change in a few decades; environments did." },
              { t:"Step 3 is correct.", why:"Step 2 named the environment, then step 3 blamed people. That doesn’t follow." }],
            hints:["Does step 3 follow from step 2?", "Step 2 is about environments, not character.", "Many causes; change conditions."] },
          { id:"e3", goal:5, task:"Plan a lunch to help with low iron for a vegetarian.",
            steps:["Choose iron-rich plant foods: lentils and spinach.", "Add whole-grain bread for more iron and fibre.", "Drink a big cup of black tea with the meal.", "Finish with an orange later in the evening."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows; but the vitamin C should come with the meal."],
            fixes:[
              { t:"Have the orange or red pepper with the meal, and save tea for between meals.", ok:true, why:M7 },
              { t:"Add more tea to wash it down.", why:M7 },
              { t:"Skip the lentils.", why:"Lentils are a key iron source." },
              { t:"Step 3 is correct.", why:"Tea’s tannins reduce absorption of plant iron." }],
            hints:["What helps plant iron absorb?", "Vitamin C, at the same meal.", "Move the orange to lunch; tea later."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"What surprised you most in the causes map or the BMI comparison?" },
      { id:"j2", q:"In your own words, why is obesity described as having many causes?" },
      { id:"j3", q:"Explain to a friend why their teen years matter for bone health, using the bone bank idea." },
      { id:"j4", q:"Where have you heard weight-bias language (in media, jokes or conversations)? How could it be said more respectfully?" }
    ]
  },
  final:{
    // Options without feedback in the plan reuse its misconception sentences (M1–M7) or other plan lines; the lines on
    // correct options that the plan leaves blank reuse plan text too, except where marked.
    questions:[
      // VERIFY: Obesity Canada's guideline wording (K1 A and B).
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How does Obesity Canada’s 2020 guideline describe obesity?", options:[
          { t:"A complex chronic disease in which excess or abnormal body fat impairs health", ok:true, why:"It focuses on health impact, not size alone." },
          { t:"Any BMI above a set number", why:"The guideline doesn’t diagnose by BMI alone." },
          { t:"A result of poor willpower", why:"The guideline rejects this framing." },
          { t:"A temporary condition fixed by dieting", why:"It’s described as chronic and complex." }] },
        b:{ prompt:"Which statement matches current Canadian clinical guidance on obesity?", options:[
          { t:"Diagnosis should consider how body fat affects a person’s health, not just BMI", ok:true, why:"It focuses on health impact, not size alone." },
          { t:"BMI alone is enough to diagnose", why:M2 },
          { t:"Obesity is a lifestyle choice", why:M1 },
          { t:"Weight loss is the only goal of care", why:"Care focuses on health and quality of life." }] } },
      // VERIFY: the age of peak bone mass (K2 A).
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Roughly when does bone mass reach its peak?", options:[
          { t:"By about the late 20s to 30", ok:true, why:"Youth habits set the size of the bank." },
          { t:"In middle age, around 50", why:M4 },
          { t:"In old age", why:M4 },
          { t:"In early childhood, by age 5", why:"It keeps building through the teens." }] },
        b:{ prompt:"Which combination best supports building peak bone mass?", options:[
          { t:"Calcium, vitamin D and weight-bearing activity", ok:true, why:"Calcium is the main mineral in bone; vitamin D helps you absorb it. Weight-bearing activity tells bone to stay strong." },
          { t:"Calcium alone", why:"Vitamin D and activity matter too." },
          { t:"Iron and vitamin C", why:"That pair is for iron." },
          { t:"Low-sodium foods alone", why:"Helpful, but not the main builders." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which meal is safe for someone with celiac disease?", options:[
          { t:"Rice, grilled chicken and vegetables, made with no gluten-containing sauces", ok:true, why:"Strictly gluten-free: no wheat, barley or rye; watch for cross-contact." },
          { t:"Whole-wheat pasta with tomato sauce", why:"Wheat contains gluten." },
          { t:"Barley soup", why:"Barley contains gluten." },
          { t:"Lactose-free milk with regular bread", why:"Lactose isn’t the issue; the bread has gluten." }] },
        b:{ prompt:"Which lunch best supports iron absorption for a vegetarian?", options:[
          { t:"Lentil soup with red pepper strips, with water to drink", ok:true, why:M7 },
          { t:"Lentil soup with black tea", why:M7 },
          { t:"A plain bagel with coffee", why:"Little iron, and coffee reduces absorption." },
          { t:"Cheese and crackers", why:"Little iron." }] } },
      { id:"t1", cat:"T", goal:[1, 6],
        a:{ prompt:"A city has high obesity rates in neighbourhoods with low incomes, few grocery stores and busy roads. Which explanation fits the evidence best?", options:[
          { t:"Income, food access and unsafe streets together limit options, alongside other factors", ok:true, why:"Several domains, interacting." },
          { t:"People there care less about health", why:M1 },
          { t:"Genes alone explain neighbourhood differences", why:"Genes don’t sort by street; conditions do." },
          { t:"It’s a coincidence", why:"The pattern matches known causes." }] },
        b:{ prompt:"A night-shift nurse and a day-shift nurse eat similar foods, but the night-shift nurse has more health concerns. Which factor best explains the difference?", options:[
          { t:"Shift-work schedules disrupt sleep and hormones, which affect appetite and health", ok:true, why:M1 },
          { t:"The night-shift nurse lacks willpower", why:M1 },
          { t:"BMI explains it", why:M2 },
          { t:"Food choice is the only factor", why:"They eat similar foods." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Bone model, menopause toggle on. A person’s peak index is 95. At what age do they enter the fracture-risk zone?", options:[
          { t:"70", ok:true, why:"95 → 90 by 50 → 75 by 60 → 70 at 70." },
          { t:"80", why:"That’s for peak 100." },
          { t:"60", why:"That’s for peak 90." },
          { t:"90", why:"That’s with the toggle off." }] },
        b:{ prompt:"Bone model, toggle off. Peak index 90. At what age do they enter the zone?", options:[
          { t:"80", ok:true, why:"90 − 0.5 × 40 = 70 at age 80." },
          { t:"60", why:"That’s with the toggle on." },
          { t:"70", why:"Check: 90 − 0.5 × 30 = 75 at 70." },
          { t:"100", why:"That’s for peak 100." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Riley’s BMI category is ‘in range’, but Riley has high blood pressure and high blood sugar. Which conclusion is supported?", options:[
          { t:"Riley has health concerns that BMI alone would miss", ok:true, why:M2 },
          { t:"Riley is healthy because BMI is in range", why:M2 },
          { t:"Riley’s BMI must be wrong", why:"BMI is just limited, not wrong." },
          { t:"Riley needs to gain weight", why:"Not supported by anything here." }] },
        b:{ prompt:"Casey’s BMI category is ‘higher’, and every health measure is in the healthy range. Which conclusion is supported?", options:[
          { t:"BMI alone doesn’t show a health problem for Casey", ok:true, why:M2 },
          { t:"Casey must have hidden disease", why:M2 },
          { t:"Casey should be told to lose weight", why:M3 },
          { t:"Casey’s health measures must be wrong", why:"No reason to doubt them." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which sentence is the most respectful and accurate?", options:[
          { t:"“People living with obesity often face weight bias, which can harm their health and their care.”", ok:true, why:M3 },
          { t:"“Obese people need to try harder.”", why:M3 },
          { t:"“The obese cost the health system the most.”", why:"Labels people and blames them." },
          { t:"“Fat people are lazy.”", why:"Stigmatizing and false." }] },
        b:{ prompt:"A coach wants to encourage healthy habits on a team. Which message is best?", options:[
          // VERIFY: the line on this correct option is the builder's.
          { t:"“Let’s fuel well and train well. Strong bodies come in all sizes.”", ok:true, why:"It encourages habits for the whole team and respects every body size." },
          { t:"“Some of you need to lose weight.”", why:M3 },
          { t:"“No dessert for anyone heavy.”", why:M3 },
          { t:"“Weigh-ins every Monday will keep you honest.”", why:"Weigh-ins can increase stigma and harm." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the clearest explanation of why BMI alone can’t diagnose obesity?", options:[
          { t:"“BMI uses only weight and height, so it can’t tell muscle from fat, where fat is stored, or whether a person’s body is working well.”", ok:true, why:M2 },
          { t:"“BMI is always wrong.”", why:"It’s a useful screening tool, just limited." },
          { t:"“BMI is only for adults.”", why:"Irrelevant here." },
          { t:"“BMI measures fat exactly.”", why:M2 }] },
        b:{ prompt:"Which is the clearest summary of the ‘many causes’ idea?", options:[
          { t:"“Biology, environment, income, stress, sleep, medications and stigma interact, so no single factor or single fix explains obesity.”", ok:true, why:M1 },
          { t:"“It’s mostly genes.”", why:"One domain only." },
          { t:"“It’s mostly willpower.”", why:M1 },
          { t:"“It’s mostly fast food.”", why:"One card only." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A 16-year-old who doesn’t eat dairy needs more calcium. Using the Station 1 table, which addition gets them closest to 1300 mg from a current 800 mg?", options:[
          { t:"Fortified soy beverage + calcium-set tofu (550 mg), reaching 1350 mg", ok:true, why:"300 + 250 = 550 mg, and 800 + 550 = 1350 mg." },
          { t:"Almonds + bok choy (200 mg)", why:"That only reaches 1000 mg." },
          { t:"Milk + cheese", why:"They don’t eat dairy. " + M5 },
          { t:"Two eggs (50 mg)", why:"Eggs have little calcium." }] },
        b:{ prompt:"An older adult with lactose intolerance wants foods that give both calcium and vitamin D. Which pair from the table is best?", options:[
          { t:"Fortified soy beverage and canned salmon with bones", ok:true, why:"500 mg calcium, 400 IU vitamin D." },
          { t:"Milk and cheese", why:"Lactose intolerance; choose lactose-free or non-dairy options." },
          { t:"Almonds and bok choy", why:"Calcium but no vitamin D." },
          { t:"Tofu and egg", why:"Little vitamin D." }] } },
      { id:"a2", cat:"A", goal:[2, 6],
        a:{ prompt:"A school wants to support students’ health. Which plan is most likely to help without harm?", options:[
          { t:"Free breakfast with fortified options, more active-play time, and staff training to prevent weight teasing", ok:true, why:LEVELS },
          { t:"Weighing students and sending results home", why:M3 },
          { t:"Posters telling students to try harder", why:M1 },
          { t:"Banning all treats with no other changes", why:"Restriction without support doesn’t change conditions." }] },
        b:{ prompt:"A rural community has few grocery stores and long winters. Which strategy addresses the biggest causes?", options:[
          { t:"A community food hub with affordable produce, plus winter indoor activity space", ok:true, why:LEVELS },
          { t:"A campaign shaming unhealthy choices", why:M3 },
          { t:"Telling people to drive further to shop", why:"Ignores the cost and access barriers." },
          { t:"Doing nothing; it’s personal choice", why:M1 }] } }
    ]
  },
  task:{
    title:"Build Rowan’s bones", summary:"Build Rowan’s bones",
    statement:"<p>Rowan is 16, doesn’t eat dairy (lactose intolerance) and doesn’t eat fish. Plan one day of calcium and vitamin D foods from the Station 1 table that meets every condition. Can you find all the answers?</p>" +
      "<ol class=\"ob-conds\"><li>At least 1300 mg calcium.</li><li>At least 200 IU vitamin D from food.</li><li>No dairy, no fish (Rowan’s needs).</li><li>A realistic day: 6 servings or fewer.</li><li>Includes a vegetable.</li></ol>" +
      "<p class=\"tiny muted\">Use the − and + buttons: 0 to 2 servings of each food. Model values from Station 1.</p>",
    checks:["At least 1300 mg calcium", "At least 200 IU vitamin D from food", "Fits Rowan: no dairy, no fish", "6 servings or fewer", "Includes a vegetable"],
    tips:["Which non-dairy chips give the most calcium per serving?",
      "Vitamin D: only soy beverage, salmon, milk and egg have any. Rowan can’t have salmon or milk, and eggs are small.",
      "Rowan’s choices are limited, so this is a real test of planning.",
      "Six servings is the most.",
      "Bok choy is the vegetable."],
    limits:{ ca:1300, vd:200, servings:6, max:2 },
    explainPrompt:"Explain how you met both the calcium and vitamin D targets within Rowan’s needs, and which single food mattered most.",
    vocab:"Use the words calcium, vitamin D, fortified, peak bone mass and serving.",
    checkLabel:"Check Rowan’s day",
    // VERIFY: the success line is the builder's.
    success:"Rowan’s day meets every condition.",
    more:"Can you find all the answers?",
    // VERIFY: the winter vitamin D supplement line.
    after3:"Rowan’s plan needs two fortified soy beverages for vitamin D, and two tofu servings for calcium. In real life, a health professional might also suggest a vitamin D supplement in winter.",
    kitchen:{
      title:"Bone-builder tofu and bok choy stir-fry",
      intro:"Teacher-arranged: cook in the school kitchen or at home with an adult.",
      // VERIFY: the gluten-free option wording and the 2-hour refrigeration rule (module 15).
      lines:["## Ingredients", "- Calcium-set tofu", "- Bok choy", "- Garlic", "- Ginger", "- Low-sodium soy sauce (or a soy sauce labelled gluten-free)", "- Rice", "- Fortified soy beverage to drink",
        "## Allergens", "- Soy", "- Wheat in most soy sauces. Gluten-free option: use a soy sauce labelled gluten-free.",
        "## Steps", "- Wash hands.", "- Rinse the bok choy.", "- Press and cube the tofu.", "- Stir-fry on medium-high heat.", "- Serve hot.", "- Cool leftovers in a shallow container and refrigerate within 2 hours (module 15).",
        "## Safety", "- Hot oil and knives under supervision."]
    }
  },
  cards:[
    // VERIFY: card 1 (Obesity Canada wording) and card 6 (age of peak bone mass).
    ["Obesity (clinical framing)", "A complex chronic disease where excess or abnormal body fat impairs health (Obesity Canada, 2020)."],
    ["Many causes", "Biology, environment, income, stress, sleep, medications and stigma interact."],
    ["Weight bias", "Negative attitudes about body size; linked to stress and avoiding care. It harms health."],
    ["Person-first language", "“People living with obesity”, not “obese people”."],
    ["BMI", "Weight relative to height: a population screening tool that can’t measure fat, muscle or health."],
    ["Peak bone mass", "The most bone you’ll have; reached by about the late 20s to 30."],
    ["Bone builders", "Calcium, vitamin D, weight-bearing activity; not smoking."],
    ["Non-dairy calcium", "Fortified soy beverage, calcium-set tofu, canned salmon with bones, beans, almonds, greens."],
    ["Celiac disease", "Autoimmune reaction to gluten (wheat, barley, rye): strictly gluten-free."],
    ["Iron absorption", "Pair plant iron with vitamin C; keep tea and coffee away from meals."],
    ["Allergy vs intolerance", "Allergy = immune reaction (can be severe); intolerance = trouble digesting."],
    ["Strategy levels", LEVELS]
  ]
};
