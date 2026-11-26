// SBI4U 08 The Calvin Cycle. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/08-the-calvin-cycle.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "For every 3 CO₂, 6 G3P are made, but 5 are needed to rebuild RuBP. Only 1 leaves.";
const M2 = "G3P has 3 carbons; glucose has 6. One glucose needs 2 G3P: 6 CO₂.";
const M3 = "It splits into two 3-PGA. ATP and NADPH then <strong>reduce</strong> 3-PGA to G3P.";
const M4 = "It needs ATP and NADPH from the light reactions, and its enzymes are switched on in the light.";
const M5 = "Lights off: 3-PGA is still made but no longer used, so it rises; RuBP isn’t rebuilt, so it falls.";
const M6 = "O₂ comes from splitting water in the light reactions. The Calvin cycle uses CO₂, ATP and NADPH.";
const M7 = "G3P becomes sucrose to travel and starch to store.";
const DOT = '<i class="cc-hd" aria-hidden="true"><b></b></i>';
const DOT3 = '<i class="cc-hd" aria-hidden="true"><b></b><b></b><b></b></i>';

export default {
  id:"08-the-calvin-cycle",
  kind:"topic",
  title:"The Calvin cycle",
  topic:"The Calvin Cycle",
  readyTopic:"the Calvin cycle",
  hero:{
    eq:'<span class="cc-heq bio-chem">3 <span class="cc-hc">CO₂' + DOT + '</span> + 9 <span class="cc-ha">ATP</span> + 6 <span class="cc-hn">NADPH</span> → <span class="cc-hc">G3P' + DOT3 + "</span> + 9 ADP + 8 Pᵢ + 6 NADP⁺</span>",
    eqLabel:"3 CO₂ plus 9 ATP plus 6 NADPH gives 1 G3P plus 9 ADP plus 8 Pᵢ plus 6 NADP⁺",
    eqSize:"sm",
    headline:"Three in, one out, and the wheel keeps turning",
    text:"In the stroma, the enzyme <strong>rubisco</strong> grabs CO₂ and attaches it to a 5-carbon sugar, <strong>RuBP</strong>. Energy from <strong>ATP</strong> and electrons from <strong>NADPH</strong> turn the products into <strong>G3P</strong>, a 3-carbon sugar. Most of the G3P is recycled to rebuild RuBP, so the wheel keeps turning. One G3P in every six is the plant’s profit.",
    fig:{ html:'<div class="cc-hero" id="cc-hero" role="img" aria-label="A wheel in the stroma holds three RuBP, five brown carbon dots each. Three CO₂ drop in and rubisco joins them to the RuBP, making six 3-PGA with three carbon dots each. Six orange ATP and six teal NADPH fly in from the thylakoid on the left and turn the six 3-PGA into six G3P. One G3P rolls out of the wheel to the sugar box. The other five, with three more ATP, are rebuilt into three RuBP. A counter reads 18 carbons in, 18 carbons out of the wheel."></div>' }
  },
  goals:[
    "I can describe what rubisco does in carbon fixation.",
    "I can name the three phases of the Calvin cycle and what happens in each.",
    "I can count the carbon, ATP and NADPH needed to make G3P, glucose and other sugars.",
    "I can predict how the cycle’s molecules change when light or CO₂ is removed.",
    "I can interpret labelling data from experiments on the Calvin cycle.",
    "I can apply the Calvin cycle to plants, crops and other organisms."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"The two stages", goal:2,
          prompt:"Where in the chloroplast does the Calvin cycle take place?",
          options:[
            { t:"In the stroma", ok:true, why:"Around the thylakoids, where ATP and NADPH are released." },
            { t:"In the thylakoid membrane", why:"That’s where the light reactions happen." },
            { t:"In the thylakoid lumen", why:"The lumen is where H⁺ builds up." },
            { t:"In the mitochondria", why:"Mitochondria run respiration, not the Calvin cycle." }],
          hints:["Where do ATP and NADPH end up?", "In the fluid around the thylakoids.", "The stroma."] },
        { id:"w2", skill:"The two stages", goal:2,
          prompt:"What does the Calvin cycle receive from the light reactions?",
          options:[
            { t:"ATP and NADPH", ok:true, why:"The light reactions make ATP and NADPH in the stroma; the Calvin cycle spends them." },
            { t:"O₂ and glucose", why:"O₂ is released to the air; glucose is made <strong>by</strong> the Calvin cycle." },
            { t:"CO₂ and water", why:"CO₂ comes from the air through the stomata." },
            { t:"Light energy directly", why:"The energy arrives packed in ATP and NADPH." }],
          hints:["What do the light reactions make that stays inside the chloroplast?", "Two energy carriers.", "ATP and NADPH."] },
        { id:"w3", skill:"Carbohydrates", goal:3,
          prompt:"How many carbon atoms are in one glucose molecule, C₆H₁₂O₆?",
          options:[
            { t:"6", ok:true, why:"The subscript after C is 6." },
            { t:"12", why:"C₆ means 6 carbons." },
            { t:"24", why:"Count only the C." },
            { t:"3", why:"That’s a 3-carbon sugar like G3P." }],
          hints:["Look at the subscript after C.", "C₆.", "6."] },
        { id:"w4", skill:"Carbohydrates", goal:6,
          prompt:"Which carbohydrate do plants mainly use to <strong>store</strong> glucose in their leaves and roots?",
          options:[
            { t:"Starch", ok:true, why:"Starch is the plant polymer of glucose for storage: a potato is mostly starch." },
            { t:"Cellulose", why:"Cellulose builds cell walls; it isn’t a fuel store." },
            { t:"Glycogen", why:"Glycogen is the animal and fungal store." },
            { t:"Sucrose", why:"Sucrose is the form plants <strong>ship</strong> in the phloem." }],
          hints:["What is a potato mostly made of?", "A plant polymer of glucose for storage.", "Starch."] },
        { id:"w5", skill:"Counting atoms", goal:3,
          prompt:"Three molecules of a 5-carbon sugar each gain one carbon from CO₂. How many carbon atoms is that altogether?",
          options:[
            { t:"18", ok:true, why:"3 × 5 + 3 = 18." },
            { t:"15", why:"That forgets the 3 carbons from CO₂." },
            { t:"8", why:"That adds 5 + 3, but there are three 5-carbon sugars." },
            { t:"6", why:"That counts only one sugar plus its CO₂." }],
          hints:["Carbons in three 5-carbon sugars?", "15.", "15 + 3 = 18."] },
        { id:"w6", skill:"Counting atoms", goal:3,
          prompt:"18 carbon atoms are shared out into 3-carbon molecules. How many molecules is that?",
          options:[
            { t:"6", ok:true, why:"18 ÷ 3 = 6." },
            { t:"3", why:"Divide 18 by 3." },
            { t:"9", why:"That would be 2-carbon pieces." },
            { t:"54", why:"That multiplies. Divide 18 by 3." }],
          hints:["Divide.", "18 ÷ 3.", "6."] }
      ],
      refreshers:{
        "The two stages":"The light reactions (thylakoids) make ATP, NADPH and O₂. The Calvin cycle (stroma) uses ATP, NADPH and CO₂ to make sugar.",
        "Carbohydrates":"Glucose (6 C) is a building block. Plants ship sucrose, store starch and build walls from cellulose.",
        "Counting atoms":"Count the carbons on each side. Carbon is never created or lost, only moved."
      }
    }
  },
  explore:{
    heading:"Carbon counter",
    intro:"Run the cycle yourself. Every carbon is a brown dot; the counter checks that none disappear.",
    // Model data and settings (plan: Explore model rules)
    products:[
      { id:"g3p", t:"G3P", c:3, one:"G3P", many:"G3P" },
      { id:"glucose", t:"glucose", c:6, one:"glucose", many:"glucose" },
      { id:"sucrose", t:"sucrose", c:12, one:"sucrose", many:"sucrose" },
      { id:"starch", t:"starch", c:6, one:"glucose unit of starch", many:"glucose units of starch" }
    ],
    factoryNote:"Only Calvin-cycle costs are counted. Joining sugars into sucrose or starch costs a little extra energy, not counted here.",
    exp:{
      times:[0, 10, 20, 30, 40, 50, 60],
      lights:{ rubp:[100, 60, 40, 30, 25, 20, 20], pga:[100, 140, 160, 170, 175, 180, 180] },
      co2:{ rubp:[100, 140, 160, 170, 175, 180, 180], pga:[100, 60, 40, 30, 25, 20, 20] }
    },
    expNote:"Relative levels: 100 is the level before the change.",
    predIntro:"Make a prediction first. Then the carbon counter will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: Turn the wheel, 3 RuBP. You press ‘Fix a CO₂’ three times. How many 3-PGA are there?",
        options:[{ t:"6", ok:true }, { t:"3" }, { t:"9" }, { t:"1" }],
        explain:"Each 5C + 1C = 6C splits into two 3C pieces.",
        start:{ mode:"wheel" } },
      { id:"p2", prompt:"Start: 6 3-PGA. After reducing all six and rebuilding the 3 RuBP, how many G3P are left to export?",
        options:[{ t:"1", ok:true }, { t:"6" }, { t:"3" }, { t:"0" }],
        explain:"15 of the 18 carbons rebuild RuBP; 3 carbons, one G3P, are the profit.",
        start:{ mode:"wheel", pga6:true } },
      { id:"p3", prompt:"Start: Experiment, normal. Change: ‘Lights off’. What happens to RuBP and 3-PGA over the next minute?",
        options:[{ t:"RuBP falls; 3-PGA rises", ok:true }, { t:"RuBP rises; 3-PGA falls" }, { t:"Both fall" }, { t:"Both stay the same" }],
        explain:"Without ATP and NADPH, 3-PGA can’t be reduced, so it piles up; RuBP keeps being used for fixation but isn’t rebuilt.",
        start:{ mode:"exp" }, to:"lights" },
      { id:"p4", prompt:"Start: Experiment, normal. Change: ‘CO₂ off’. What happens to RuBP and 3-PGA?",
        options:[{ t:"RuBP rises; 3-PGA falls", ok:true }, { t:"RuBP falls; 3-PGA rises" }, { t:"Both rise" }, { t:"Both fall" }],
        explain:"With no CO₂, RuBP isn’t used up but keeps being rebuilt; 3-PGA isn’t made but keeps being reduced.",
        start:{ mode:"exp" }, to:"co2" }
    ],
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Starting from 3 RuBP, export exactly 1 G3P and get back to 3 RuBP, with nothing left over.",
        why:"3 CO₂ fixed, 9 ATP and 6 NADPH used: 15 of the 18 carbons rebuilt the 3 RuBP, and the other 3 left as one G3P.",
        general:"Use Turn the wheel, starting from 3 RuBP. End with 3 RuBP, no 3-PGA, no G3P in the wheel and 1 G3P exported.",
        hints:["Fix 3 CO₂ first.", "Reduce all six 3-PGA.", "Export 1 G3P, then regenerate with the other 5."] },
      { id:"tc2", goal:[2, 3], prompt:"Factory order: enter the CO₂, ATP and NADPH needed for <strong>1 glucose</strong>.",
        why:"Glucose has 6 carbons: 6 CO₂ and 2 G3P, so 6 × 3 = 18 ATP and 6 × 2 = 12 NADPH.",
        general:"In Factory order, type your three numbers in the supply boxes.",
        hints:["How many carbons does glucose have?", "6 C, so 6 CO₂ and 2 G3P.", "6 × 3 = 18 ATP; 6 × 2 = 12 NADPH."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"A cell needs enough G3P to add 10 glucose units to its starch. Counting only the Calvin cycle, enter the CO₂, ATP and NADPH.",
        why:"10 glucose units hold 60 carbons: 60 CO₂, 60 × 3 = 180 ATP and 60 × 2 = 120 NADPH.",
        general:"In Factory order, type your three numbers in the supply boxes.",
        hints:["Carbons in 10 glucose units?", "60 C, so 60 CO₂.", "60 × 3 = 180 ATP; 60 × 2 = 120 NADPH."] }
    ]
  },
  part3:{
    slug:"sugar", name:"Sugar", heading:"Where the sugar goes",
    intro:"The carbon counter is a model. Here is the evidence that revealed the cycle, radioactive carbon, and where its product goes in the plant.",
    s1:{
      title:"Station 1: Following radioactive carbon",
      text:"Algae are given CO₂ made with radioactive carbon-14 for a few seconds, then killed, and the labelled compounds are separated.",
      caption:"Based on experiments by Melvin Calvin, Andrew Benson and James Bassham (1940s–1950s). The numbers below are model data.",
      head:["Share of the label (%)", "2 s", "5 s", "30 s", "90 s"],
      rows:[
        { id:"pga", t:"3-PGA", v:[85, 60, 25, 10] },
        { id:"g3p", t:"G3P and other sugar phosphates", v:[10, 25, 40, 30] },
        { id:"suc", t:"Sucrose", v:[0, 5, 20, 40] },
        { id:"aa", t:"Amino acids and others", v:[5, 10, 15, 20] }
      ],
      tap:{ prompt:"Which compound is the first stable product of fixation? Tap its row.", answer:"pga",
        good:"3-PGA: it holds most of the label earliest.", bad:"Look at the 2 s column: which compound holds the most label at the earliest time?" },
      prompts:[
        { id:"s1b", q:"Why does sucrose’s share rise last?", a:"It’s built from G3P after several steps." },
        { id:"s1c", q:"Each column adds to 100. Why?", a:"They’re shares of all the label." }
      ],
      graphTitle:"Check it with data",
      graphNote:"The same model data as a graph. Each line is one compound’s share of the label."
    },
    s2:{
      title:"Station 2: G3P’s destinations",
      text:"G3P is first made into glucose and fructose. Tap each destination to reveal where it goes.",
      dest:[
        { id:"suc", t:"Sucrose", d:"Shipped in the phloem, to roots and fruit." },
        { id:"sta", t:"Starch", d:"Stored in the chloroplast by day, broken down at night." },
        { id:"cel", t:"Cellulose", d:"Builds the cell walls." },
        { id:"aa", t:"Amino acids and fats", d:"Made from G3P with nitrogen and more energy." },
        { id:"fuel", t:"Fuel", d:"Fuel for the plant’s own mitochondria." }
      ],
      done:"G3P is the cell’s raw material: sucrose to travel, starch to store, cellulose to build, and more."
    },
    s3:{
      title:"Station 3: Zoom to the molecules: “dark reactions?”",
      text:"A rubisco close-up. Switch the light on and off and watch the active site.",
      on:"In the light, the stroma becomes less acidic (about pH 8) and richer in Mg²⁺. These two light switches turn rubisco on: CO₂ enters the active site and joins RuBP.",
      off:"In the dark, the stroma becomes more acidic and loses Mg²⁺, so rubisco switches off. ATP and NADPH stop arriving too.",
      slow:"Rubisco is slow, at about 3 CO₂ per second per enzyme, so leaves make huge amounts of it. (The animation is slowed down.)",
      concl:"So the Calvin cycle needs no light directly, but it stops within seconds in the dark.",
      more:"The real cycle has more steps and intermediates (such as 1,3-bisphosphoglycerate and several sugar phosphates). This module names only RuBP, 3-PGA and G3P, as Grade 12 texts do."
    },
    quickCheck:{
      title:"Quick check", summary:"Where the sugar goes quick check",
      items:[
        { id:"q1", goal:5, prompt:"After 2 s of labelling, most carbon-14 was in…",
          choices:[{ t:"3-PGA", ok:true, fb:"Fixation makes 3-PGA first." }, { t:"sucrose", fb:"Fixation makes 3-PGA first." },
            { t:"glucose", fb:"Fixation makes 3-PGA first." }, { t:"RuBP", fb:"Fixation makes 3-PGA first." }] },
        { id:"q2", goal:6, prompt:"Which form does a plant ship to its roots?",
          choices:[{ t:"Sucrose", ok:true, fb:"Sucrose travels in the phloem; starch is stored." }, { t:"Starch", fb:"Starch is stored; sucrose travels in the phloem." },
            { t:"Cellulose", fb:"Starch is stored; sucrose travels in the phloem." }, { t:"RuBP", fb:"Starch is stored; sucrose travels in the phloem." }] },
        { id:"q3", goal:2, prompt:"Why does the Calvin cycle stop soon after dark?",
          choices:[{ t:"No ATP or NADPH, and rubisco switches off", ok:true, fb:M4 }, { t:"CO₂ is used up", fb:M4 },
            { t:"O₂ builds up", fb:M4 }, { t:"G3P blocks rubisco", fb:M4 }] },
        { id:"q4", goal:1, prompt:"Why do leaves contain so much rubisco?",
          choices:[{ t:"It’s slow, so many copies are needed", ok:true, fb:"About 3 CO₂ per second per enzyme." }, { t:"It stores nitrogen only", fb:"About 3 CO₂ per second per enzyme." },
            { t:"It makes ATP", fb:"About 3 CO₂ per second per enzyme." }, { t:"It absorbs light", fb:"About 3 CO₂ per second per enzyme." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"books", type:"numeric", title:"Carbon bookkeeping", summary:"Carbon bookkeeping", goal:[2, 3],
        instruction:"Eight questions about one batch: the Calvin cycle fixes 6 CO₂.",
        how:"Each question is for <strong>6 CO₂ fixed</strong>. Type a whole number, then press Check.",
        items:[
          { id:"b1", prompt:"ATP used?", answer:18, display:"18 ATP", unit:"ATP",
            why:"Reduction uses 1 ATP per 3-PGA (12) and regeneration 3 per 3 RuBP (6): 12 + 6 = 18.",
            wrong:[{ match:12, fb:"That’s reduction only; regeneration uses 6 more." }],
            general:"ATP is used in two phases.",
            hints:["ATP is used in two phases.", "Reduction: 1 per 3-PGA; regeneration: 3 per 3 RuBP.", "12 + 6 = 18."] },
          { id:"b2", prompt:"NADPH used?", answer:12, display:"12 NADPH", unit:"NADPH",
            why:"2 NADPH per CO₂: 6 × 2 = 12.",
            wrong:[{ match:6, fb:"2 NADPH per CO₂." }], general:"2 NADPH per CO₂." },
          { id:"b3", prompt:"RuBP used in fixation?", answer:6, display:"6 RuBP", unit:"RuBP",
            why:"One RuBP per CO₂.", general:"One RuBP per CO₂." },
          { id:"b4", prompt:"3-PGA made?", answer:12, display:"12 3-PGA", unit:"3-PGA",
            why:"Each fixation makes two 3-PGA: 6 × 2 = 12.",
            wrong:[{ match:6, fb:"Each fixation makes <strong>two</strong> 3-PGA." }], general:"Each fixation makes <strong>two</strong> 3-PGA." },
          { id:"b5", prompt:"G3P made in total?", answer:12, display:"12 G3P", unit:"G3P",
            why:"Every 3-PGA becomes a G3P.", general:"Every 3-PGA becomes a G3P." },
          { id:"b6", prompt:"G3P exported?", answer:2, display:"2 G3P", unit:"G3P",
            why:"One G3P leaves for every 3 CO₂, so 2 leave for 6 CO₂. Most G3P is recycled.",
            wrong:[{ match:12, fb:"Most G3P is recycled." }], general:M1 },
          { id:"b7", prompt:"G3P recycled?", answer:10, display:"10 G3P", unit:"G3P",
            why:"12 − 2 = 10.", general:"12 − 2." },
          { id:"b8", prompt:"Carbons in the recycled G3P? (They rebuild 6 RuBP of 5 C each.)", answer:30, display:"30 carbons", unit:"C",
            why:"10 × 3 = 30 = 6 × 5: they match.", general:"10 × 3 = 30 = 6 × 5: they match." }
        ] },
      { id:"detective", type:"custom", title:"Calvin cycle detective", summary:"Calvin cycle detective", star:true, goal:[4, 5, 6], how:"",
        instruction:"Six puzzles from experiments, rates and costs. Puzzles 3 to 6 are non-routine (★); the last two go beyond the Final Check.",
        items:[
          { id:"c1", kind:"chips", goal:4,
            prompt:"A graph shows RuBP falling and 3-PGA rising after a change. Which change?",
            options:[
              { t:"lights off", ok:true, why:M5 },
              { t:"CO₂ off", why:"CO₂ off gives the opposite pattern." },
              { t:"more light", why:"Look for a change that stops 3-PGA being used and RuBP being rebuilt." },
              { t:"more CO₂", why:"Look for a change that stops 3-PGA being used and RuBP being rebuilt." }] },
          { id:"c2", kind:"chips", goal:4,
            prompt:"Which change makes RuBP pile up?",
            options:[
              { t:"CO₂ off", ok:true, why:"RuBP is rebuilt but not used." },
              { t:"lights off", why:"Lights off makes RuBP fall: it’s used but not rebuilt. RuBP piles up when it’s rebuilt but not used." },
              { t:"more ATP", why:"RuBP piles up when it’s rebuilt but not used." },
              { t:"more NADPH", why:"RuBP piles up when it’s rebuilt but not used." }] },
          { id:"c3", kind:"num", goal:[1, 6], star:true,
            prompt:"Each rubisco fixes about 3 CO₂ per second. A cell must fix 600 CO₂ per second. At least how many rubisco molecules does it need?",
            answer:200, display:"200 rubisco molecules", unit:"rubisco",
            why:"600 ÷ 3 = 200.",
            wrong:[{ match:1800, fb:"Divide, don’t multiply." }], general:"Each rubisco handles 3 CO₂ per second." },
          { id:"c4", kind:"chips", goal:5, star:true,
            prompt:"In a labelling experiment, which compound held the most label at the earliest time, and what does that tell you?",
            options:[
              { t:"3-PGA, first product", ok:true, why:"The first compound to be labelled is the one fixation makes." },
              { t:"sucrose, first product", why:"The first compound to be labelled is the one fixation makes." },
              { t:"glucose, first product", why:"The first compound to be labelled is the one fixation makes." },
              { t:"RuBP, first product", why:"The first compound to be labelled is the one fixation makes." }] },
          { id:"c5", kind:"chips", goal:[4, 6], star:true,
            prompt:"A mutant lacks one enzyme of the regeneration phase. With light and CO₂ available, what happens after a few turns?",
            options:[
              { t:"fixation stops because RuBP runs out", ok:true, why:"RuBP is the CO₂ acceptor; without regeneration it’s used up." },
              { t:"fixation speeds up", why:"RuBP is the CO₂ acceptor; without regeneration it’s used up." },
              { t:"G3P export rises forever", why:"RuBP is the CO₂ acceptor; without regeneration it’s used up." },
              { t:"nothing changes", why:"RuBP is the CO₂ acceptor; without regeneration it’s used up." }],
            hints:["What does fixation need besides CO₂?", "RuBP.", "No regeneration, no RuBP: fixation stops."] },
          { id:"c6", kind:"num", goal:[3, 6], star:true,
            prompt:"In an hour, a leaf makes 1 sucrose and adds 3 glucose units to starch. How many NADPH did its Calvin cycle use?",
            answer:60, display:"60 NADPH", unit:"NADPH",
            why:"Sucrose 12 C + starch 18 C = 30 C = 30 CO₂; 2 NADPH each.",
            general:"Sucrose 12 C + starch 18 C = 30 C = 30 CO₂; 2 NADPH each.",
            hints:["Count the carbons first.", "12 + 3 × 6 = 30 carbons, so 30 CO₂.", "30 × 2 = 60."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Chiara", how:"",
        instruction:"Chiara made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"How many ATP does the Calvin cycle need to make one glucose?",
            steps:["Glucose has 6 carbons.", "G3P has 3 carbons, so one glucose needs one G3P.", "Each G3P costs 9 ATP.", "So one glucose needs 9 ATP."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 is a correct fact.", "Step 4 follows step 2. Look earlier."],
            fixes:[
              { t:"6 ÷ 3 = 2, so one glucose needs <strong>two</strong> G3P: 18 ATP.", ok:true, why:M2 },
              { t:"One glucose needs six G3P: 54 ATP.", why:"That’s one G3P per carbon." },
              { t:"One glucose needs 3 ATP.", why:"That’s per CO₂." },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["How many 3-carbon pieces make 6 carbons?", "Two.", "2 × 9 = 18 ATP."] },
          { id:"e2", goal:2, task:"Describe carbon fixation.",
            steps:["Rubisco joins CO₂ to RuBP.", "The 6-carbon product splits into two G3P.", "The G3P then leaves the cycle as sugar."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier."],
            fixes:[
              { t:"It splits into two 3-PGA; ATP and NADPH then reduce 3-PGA to G3P.", ok:true, why:M3 },
              { t:"It splits into three CO₂.", why:"That would undo the fixation." },
              { t:"It becomes glucose directly.", why:"Glucose needs two G3P." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What happens in the reduction phase?", "3-PGA becomes G3P.", "So fixation makes 3-PGA."] },
          { id:"e3", goal:4, task:"Predict the effect of turning the lights off on 3-PGA.",
            steps:["With the lights off, the light reactions stop making ATP and NADPH.", "So 3-PGA can no longer be reduced to G3P.", "So the amount of 3-PGA falls.", "And RuBP rises."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows the same reasoning error."],
            fixes:[
              { t:"Fixation keeps making 3-PGA for a while, but it isn’t used, so 3-PGA <strong>rises</strong>; RuBP falls.", ok:true, why:M5 },
              { t:"3-PGA stays the same.", why:"It’s still being made." },
              { t:"3-PGA turns into RuBP.", why:"That needs G3P and ATP first." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Is 3-PGA still being made?", "Yes, while RuBP lasts.", "Made but not used: it rises."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the carbon counter: that only one G3P in six leaves, or the lights-off results?" },
      { id:"j2", q:"In your own words, explain why most of the G3P has to stay in the cycle." },
      { id:"j3", q:"Explain to a friend how to work out the ATP and NADPH needed for any sugar." },
      { id:"j4", q:"Which part of the Calvin cycle are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which enzyme fixes CO₂ in the Calvin cycle?", options:[
          { t:"Rubisco", ok:true, why:"Rubisco joins each CO₂ to RuBP." },
          { t:"ATP synthase", why:"It makes ATP in the thylakoid membrane." },
          { t:"NADP⁺ reductase", why:"It makes NADPH at the end of the electron chain." },
          { t:"Amylase", why:"Amylase breaks down starch." }] },
        b:{ prompt:"In carbon fixation, rubisco attaches CO₂ to which molecule?", options:[
          { t:"RuBP, a 5-carbon sugar", ok:true, why:"RuBP is the CO₂ acceptor; 5C + 1C = 6C, which splits into two 3-PGA." },
          { t:"G3P", why:"G3P is a product, not the acceptor." },
          { t:"3-PGA", why:"3-PGA is what fixation makes." },
          { t:"Glucose", why:"Glucose is far downstream." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which shows the Calvin cycle’s phases in order?", options:[
          { t:"Fixation → reduction → regeneration of RuBP", ok:true, why:"CO₂ is fixed, 3-PGA is reduced to G3P, then G3P rebuilds RuBP." },
          { t:"Reduction → fixation → regeneration", why:"CO₂ must be fixed first." },
          { t:"Fixation → regeneration → reduction", why:"3-PGA must be reduced to G3P before RuBP can be rebuilt." },
          { t:"Photolysis → fixation → reduction", why:"Photolysis belongs to the light reactions." }] },
        b:{ prompt:"In which phase is NADPH used?", options:[
          { t:"Reduction: turning 3-PGA into G3P", ok:true, why:"ATP and NADPH reduce each 3-PGA to G3P." },
          { t:"Fixation", why:"Fixation uses only RuBP, CO₂ and rubisco." },
          { t:"Regeneration", why:"Regeneration uses ATP only." },
          { t:"Photolysis", why:M6 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"For every 3 CO₂ fixed, what does the cycle export and what does it cost?", options:[
          { t:"1 G3P, costing 9 ATP and 6 NADPH", ok:true, why:"6 G3P are made and 5 rebuild RuBP; 3 ATP and 2 NADPH per CO₂." },
          { t:"3 G3P, costing 3 ATP and 3 NADPH", why:M1 },
          { t:"6 G3P, costing 9 ATP and 6 NADPH", why:"Five of the six are recycled." },
          { t:"1 glucose, costing 18 ATP", why:M2 }] },
        b:{ prompt:"To make one glucose, what does the Calvin cycle need?", options:[
          { t:"6 CO₂, 18 ATP and 12 NADPH", ok:true, why:"Glucose has 6 carbons: 6 CO₂, then 3 ATP and 2 NADPH per CO₂." },
          { t:"3 CO₂, 9 ATP and 6 NADPH", why:M2 },
          { t:"6 CO₂, 12 ATP and 18 NADPH", why:"ATP and NADPH are swapped." },
          { t:"1 CO₂, 3 ATP and 2 NADPH", why:"That’s per CO₂." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A leaf is suddenly put in the dark. Over the next minute, what happens to RuBP and 3-PGA, and why?", options:[
          { t:"RuBP falls and 3-PGA rises: fixation continues briefly, but without ATP and NADPH, 3-PGA isn’t reduced and RuBP isn’t rebuilt", ok:true, why:M5 },
          { t:"RuBP rises and 3-PGA falls, because rubisco stops in the dark", why:M5 },
          { t:"Both fall, because the cycle stops at once", why:"Fixation doesn’t need ATP, so it continues briefly." },
          { t:"Neither changes, because the Calvin cycle doesn’t need light", why:M4 }] },
        b:{ prompt:"The CO₂ supply to a lit leaf is cut off. What happens to RuBP and 3-PGA, and why?", options:[
          { t:"RuBP rises and 3-PGA falls: RuBP is still rebuilt but not used, and 3-PGA is still reduced but not made", ok:true, why:"With no CO₂, nothing uses RuBP, but reduction and regeneration keep going." },
          { t:"RuBP falls and 3-PGA rises", why:"That’s the lights-off pattern. With no CO₂, RuBP is rebuilt but not used." },
          { t:"Both rise", why:"3-PGA can’t be made without CO₂." },
          { t:"Both fall", why:"RuBP is still being rebuilt." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"How many ATP does the Calvin cycle use to make the sugar in one sucrose molecule (C₁₂)?", options:[
          { t:"36", ok:true, why:"12 C means 12 CO₂; 3 ATP each." },
          { t:"18", why:"That’s one glucose’s worth." },
          { t:"9", why:M1 },
          { t:"24", why:"That’s the NADPH (2 per CO₂)." }] },
        b:{ prompt:"How many NADPH does the Calvin cycle use to make 3 glucose units of starch?", options:[
          { t:"36", ok:true, why:"18 C means 18 CO₂; 2 NADPH each." },
          { t:"18", why:"That’s the number of CO₂." },
          { t:"54", why:"That’s the ATP (3 per CO₂)." },
          { t:"6", why:M2 }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A seaweed is given carbon-14 CO₂. At 3 s, compound X holds 80% of the label and compound Y holds 5%. At 60 s, X holds 15% and Y holds 45%. What do the data suggest?", options:[
          { t:"X is made first, and Y is made later from it (or from compounds made from it)", ok:true, why:"The label shows up in X first, then moves on to Y." },
          { t:"Y is made first, because it ends with more label", why:"Early shares show what’s made first." },
          { t:"X and Y are made at the same time", why:"Their shares change in opposite directions." },
          { t:"The label leaks out of X", why:"The total stays at 100%; it moves to other compounds." }] },
        b:{ prompt:"In a different labelling run, compound P holds 70% of the label at 2 s and 10% at 90 s, while compound Q holds 0% at 2 s and 50% at 90 s. Which is most likely 3-PGA, and which sucrose?", options:[
          { t:"P is 3-PGA and Q is sucrose", ok:true, why:"The first product of fixation is labelled first; sucrose is built later." },
          { t:"P is sucrose and Q is 3-PGA", why:"Sucrose is several steps after fixation." },
          { t:"Both are 3-PGA", why:"Their timing is very different." },
          { t:"Neither: the data can’t separate them", why:"Timing is exactly what separates them." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which best explains why ‘dark reactions’ is a misleading name for the Calvin cycle?", options:[
          { t:"“It doesn’t use light directly, but it needs ATP and NADPH from the light reactions, and its enzymes are switched on in the light, so it stops soon after dark.”", ok:true, why:M4 },
          { t:"“It happens only at night.”", why:M4 },
          { t:"“It needs darkness to work properly.”", why:M4 },
          { t:"“It makes light energy.”", why:"It stores chemical energy in sugar." }] },
        b:{ prompt:"Which best explains why the Calvin cycle is called a <strong>cycle</strong>?", options:[
          { t:"“The CO₂ acceptor, RuBP, is rebuilt from G3P every turn, so the same steps repeat.”", ok:true, why:"The name is about RuBP being regenerated." },
          { t:"“Carbon goes round and round without leaving.”", why:"One G3P in six leaves." },
          { t:"“It runs only in daylight cycles.”", why:"The name is about RuBP being regenerated." },
          { t:"“ATP and NADPH are made and used in a loop.”", why:"They come from the light reactions." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which best explains why only 1 G3P in 6 leaves the cycle?", options:[
          { t:"“5 G3P (15 carbons) are needed to rebuild the 3 RuBP (15 carbons) that fixed the 3 CO₂; only the remaining 3 carbons are new.”", ok:true, why:"It’s carbon bookkeeping: 15 of the 18 carbons rebuild RuBP." },
          { t:"“5 G3P are broken down for energy.”", why:"They’re rebuilt into RuBP, not broken down." },
          { t:"“Rubisco can only release one G3P at a time.”", why:"It’s carbon bookkeeping, not an enzyme limit." },
          { t:"“The other 5 G3P become starch.”", why:"Starch is made from the exported G3P." }] },
        b:{ prompt:"Which carbon count shows the cycle is balanced for 3 CO₂?", options:[
          { t:"3 RuBP (15 C) + 3 CO₂ (3 C) = 18 C = 6 G3P (18 C); 5 G3P (15 C) rebuild 3 RuBP; 1 G3P (3 C) leaves", ok:true, why:"Every carbon is accounted for: 18 in, 18 out." },
          { t:"3 RuBP (15 C) + 3 CO₂ (3 C) = 6 G3P (18 C); all 6 leave", why:M1 },
          { t:"3 CO₂ (3 C) = 1 glucose (6 C)", why:M2 },
          { t:"6 G3P (18 C) = 3 glucose (18 C)", why:"Three of those carbons are new; the rest rebuild RuBP." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A new weedkiller blocks an enzyme in the regeneration phase. Why do sprayed weeds stop growing even with light and CO₂ available?", options:[
          { t:"RuBP isn’t rebuilt, so fixation stops once it runs out; no new G3P means no sugar for growth", ok:true, why:"RuBP is the CO₂ acceptor; without regeneration it’s used up." },
          { t:"The weeds can’t absorb light", why:"The light reactions aren’t the target." },
          { t:"The weeds make too much starch", why:M7 },
          { t:"The weeds’ rubisco starts making O₂", why:"Rubisco doesn’t make O₂." }] },
        b:{ prompt:"Leaves invest a large share of their nitrogen in rubisco. Why do nitrogen-starved crops often photosynthesize slowly?", options:[
          { t:"They can’t make enough rubisco, and rubisco is slow, so less CO₂ is fixed", ok:true, why:"Rubisco fixes only about 3 CO₂ per second, so a leaf needs a lot of it, and building it takes nitrogen." },
          { t:"Nitrogen is part of glucose", why:"Glucose contains only C, H and O." },
          { t:"Without nitrogen, light can’t enter the leaf", why:"Light absorption isn’t the issue." },
          { t:"Rubisco needs nitrogen gas to fix CO₂", why:"Rubisco fixes CO₂ only." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Some bacteria near deep-sea vents run the Calvin cycle in total darkness, using energy from chemicals. What must their other reactions supply to the cycle?", options:[
          { t:"ATP and a reduced electron carrier (like NADPH), plus CO₂", ok:true, why:"It always needs ATP and reducing power, plus CO₂ to fix." },
          { t:"Light and water", why:M4 },
          { t:"O₂ and glucose", why:M6 },
          { t:"Nothing: the cycle runs on its own", why:"It always needs ATP and reducing power." }] },
        b:{ prompt:"An experimental ‘artificial leaf’ feeds ATP and NADPH from solar panels to isolated Calvin cycle enzymes. What must it supply to export 2 G3P?", options:[
          { t:"6 CO₂, 18 ATP and 12 NADPH", ok:true, why:"2 G3P hold 6 carbons: 6 CO₂, with 3 ATP and 2 NADPH per CO₂." },
          { t:"2 CO₂, 6 ATP and 4 NADPH", why:M1 },
          { t:"6 CO₂, 12 ATP and 12 NADPH", why:"Regeneration uses 6 more ATP." },
          { t:"6 H₂O and light", why:M6 }] } }
    ]
  },
  task:{
    title:"Plan a sugar order", summary:"Plan a sugar order",
    statement:"<p>Plan a batch of sugar for a leaf’s Calvin cycle. Choose the products and supply exactly the carbon and energy needed, within the energy budget. Can you find all the answers?</p><ol class=\"cc-conds\"><li>The batch has at least 3 glucose-sized units (each glucose counts 1, each sucrose counts 2).</li><li>The carbon balances: CO₂ fixed = 6 × units.</li><li>ATP supplied = 3 × CO₂ fixed.</li><li>NADPH supplied = 2 × CO₂ fixed.</li><li>ATP supplied is at most 72.</li></ol>",
    checks:["At least 3 units", "Carbon balances", "ATP matches", "NADPH matches", "Within budget"],
    tips:["A sucrose is two hexose units joined: 12 carbons.", "Each glucose-sized unit needs 6 CO₂.", "3 ATP per CO₂.", "2 NADPH per CO₂.", "72 ATP covers at most 24 CO₂: 4 units."],
    explainPrompt:"Explain how you worked out the CO₂, ATP and NADPH for your batch, and why the budget limits you to 3 or 4 units.",
    vocab:"Use the words G3P, carbon, ATP, NADPH and Calvin cycle.",
    success:"Your order works!",
    more:"Can you find all the answers?",
    allFound:"You’ve found all five answers.",
    afterAll:"The budget allows only 3 or 4 units. Sucrose and glucose cost the same per carbon, so only the number of units matters."
  },
  cards:[
    ["Calvin cycle", "The stroma’s cycle that fixes CO₂ into sugar using ATP and NADPH"],
    ["Rubisco", "The enzyme that joins CO₂ to RuBP; slow, so leaves make lots of it"],
    ["RuBP", "Ribulose bisphosphate: the 5-carbon CO₂ acceptor, rebuilt every turn"],
    ["3-PGA", "The 3-carbon first stable product of fixation"],
    ["G3P", "Glyceraldehyde 3-phosphate: the 3-carbon sugar the cycle exports"],
    ["Three phases", "Fixation → reduction (uses ATP and NADPH) → regeneration of RuBP (uses ATP)"],
    ["Per 3 CO₂", "6 G3P made, 1 exported; costs 9 ATP and 6 NADPH"],
    ["Per glucose", "6 CO₂, 18 ATP, 12 NADPH (2 G3P)"],
    ["Lights off", "3-PGA rises, RuBP falls"],
    ["CO₂ off", "RuBP rises, 3-PGA falls"],
    ["Where G3P goes", "Sucrose (shipped), starch (stored), cellulose (walls), amino acids, fats"],
    ["“Dark reactions”?", "Misleading: the cycle needs ATP and NADPH from light and is switched on in the light"]
  ]
};
