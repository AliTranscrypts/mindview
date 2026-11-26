// HFA4U 02 Macronutrients: Carbohydrates, Lipids, Proteins. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/02-macronutrients.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags; students see the plan's wording without them.
// All food, label and amino-acid values are the plan's practice-model numbers (model data), not real products.

// VERIFY: helpline numbers before release (course plan §2 support note).
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p></div>';

// Misconception core sentences (plan §3), used where an option names the misconception without its own feedback
const M1 = "Fat has 9 kcal per gram. Convert to kcal before finding percentages.";
const M2 = "Fats carry vitamins A, D, E and K and supply essential fatty acids. The type matters more than avoiding fat.";
const M3 = "A trans bond keeps the chain straight, so trans fats pack like saturated fat and raise LDL.";
const M4 = "Pair a grain with a legume: each covers the other’s low amino acid.";
const M7 = "AMDRs describe healthy patterns over time. One food doesn’t need to match them.";

// Lunch-box foods (task table; per serving, practice-model values). c, f, p, fi = grams of carbohydrate, fat, protein, fibre.
// g: "wg" whole grain, "vf" vegetable or fruit. The Explore Measure mode reuses them as food chips.
const FOODS = [
  { id:"wrap", t:"Whole-grain wrap", c:30, f:4, p:6, fi:4, g:"wg" },
  { id:"bun", t:"White bun", c:28, f:2, p:5, fi:1 },
  { id:"hummus", t:"Hummus (¼ cup)", c:8, f:8, p:4, fi:3 },
  { id:"chicken", t:"Chicken breast (75 g)", c:0, f:3, p:23, fi:0 },
  { id:"cheddar", t:"Cheddar (30 g)", c:0, f:10, p:7, fi:0 },
  { id:"apple", t:"Apple", c:25, f:0, p:0, fi:4, g:"vf", sug:19 },
  { id:"carrots", t:"Baby carrots (1 cup)", c:12, f:0, p:1, fi:3, g:"vf" },
  { id:"yogurt", t:"Plain yogurt (¾ cup)", c:12, f:4, p:8, fi:0 },
  { id:"chips", t:"Potato chips (small bag)", c:15, f:10, p:2, fi:1 },
  { id:"almonds", t:"Almonds (¼ cup)", c:7, f:18, p:8, fi:4 },
  { id:"cookie", t:"Chocolate chip cookie", c:20, f:7, p:2, fi:1 },
  { id:"rice", t:"Brown rice salad (1 cup)", c:40, f:5, p:5, fi:3, g:"wg" }
];

// Protein bench: 20 amino acids (9 essential), and plant foods with model amino-acid bars (% of the reference pattern,
// essential amino acids in the order of ESS). Model rules (plan): grains low in lysine, legumes low in methionine, tofu complete,
// spinach too low in protein to count. A pair shows the average of the two foods (equal parts).
const ESS = ["his", "ile", "leu", "lys", "met", "phe", "thr", "trp", "val"];
const AMINO = [
  ["his", "Histidine", "His", 1], ["ile", "Isoleucine", "Ile", 1], ["leu", "Leucine", "Leu", 1], ["lys", "Lysine", "Lys", 1], ["met", "Methionine", "Met", 1],
  ["phe", "Phenylalanine", "Phe", 1], ["thr", "Threonine", "Thr", 1], ["trp", "Tryptophan", "Trp", 1], ["val", "Valine", "Val", 1],
  ["ala", "Alanine", "Ala", 0], ["arg", "Arginine", "Arg", 0], ["asn", "Asparagine", "Asn", 0], ["asp", "Aspartic acid", "Asp", 0], ["cys", "Cysteine", "Cys", 0],
  ["glu", "Glutamic acid", "Glu", 0], ["gln", "Glutamine", "Gln", 0], ["gly", "Glycine", "Gly", 0], ["pro", "Proline", "Pro", 0], ["ser", "Serine", "Ser", 0], ["tyr", "Tyrosine", "Tyr", 0]
].map(([id, t, ab, e]) => ({ id, t, ab, e:!!e }));
const PLANT = [
  { id:"rice", t:"Rice", k:"grain", aa:[110, 115, 125, 62, 140, 130, 105, 112, 120] },
  { id:"pita", t:"Whole-wheat pita", k:"grain", aa:[112, 112, 122, 60, 145, 132, 108, 115, 118] },
  { id:"corn", t:"Corn tortilla", k:"grain", aa:[110, 110, 140, 60, 140, 128, 106, 110, 116] },
  { id:"oats", t:"Oats", k:"grain", aa:[114, 118, 124, 65, 140, 134, 110, 118, 122] },
  { id:"lentils", t:"Lentils", k:"legume", aa:[118, 120, 122, 145, 60, 126, 116, 106, 116] },
  { id:"chickpeas", t:"Chickpeas (hummus)", k:"legume", aa:[116, 118, 120, 140, 62, 128, 114, 110, 114] },
  { id:"beans", t:"Black beans", k:"legume", aa:[120, 122, 124, 142, 60, 124, 118, 108, 118] },
  { id:"peanuts", t:"Peanuts", k:"legume", aa:[115, 116, 118, 140, 65, 130, 112, 112, 115] },
  { id:"tofu", t:"Tofu", k:"soy", aa:[125, 130, 130, 145, 140, 135, 125, 120, 125] },
  { id:"spinach", t:"Spinach", k:"leafy", aa:[20, 22, 20, 25, 15, 22, 20, 25, 22] }
];

// Matching: right-hand jobs and sources; r9 is the starch card behind the plan's "3 ↔ starch" mismatch line.
const RJ = {
  r1:"Helps lower LDL cholesterol; oats, beans", r2:"Adds bulk and keeps digestion regular; wheat bran", r3:"Stored glucose in liver and muscle",
  r4:"Essential; flaxseed, walnuts, fatty fish", r5:"Straight chain from partial hydrogenation; raises LDL", r6:"Nine the body can’t make; must come from food",
  r7:"Rice with lentils; hummus with pita", r8:"Form cell membranes", r9:"Plant glucose store"
};
const H1 = "Think shape, then job.";
const ml = (id, t, ans, alt, goal) => ({ id, t, goal, hints:[H1, "It’s one of these two: “" + RJ[ans] + "” or “" + RJ[alt] + "”.", t + " ↔ " + RJ[ans] + "."] });

export default {
  id:"02-macronutrients",
  kind:"topic",
  title:"Macronutrients: carbohydrates, lipids, proteins",
  topic:"Macronutrients: Carbohydrates, Lipids, Proteins",
  readyTopic:"carbohydrates, lipids and proteins",
  hero:{
    headline:"Three nutrients, three shapes, three jobs.",
    text:"<strong>Carbohydrates</strong> fuel you and, as <strong>fibre</strong>, keep digestion moving. <strong>Lipids</strong> store energy, carry vitamins and build every cell membrane. <strong>Proteins</strong> build, repair and run your body as enzymes and hormones. The shape of each molecule explains what it does: a kink in a fat, a missing amino acid in a plant protein, a bond your enzymes can’t break in fibre.",
    fig:{ html:'<div class="mn-hero" id="mn-hero"></div>', caption:"" },
    aria:"Three molecule sketches, each labelled. Carbohydrate: glucose hexagons click together into a starch chain, 4 kcal/g. Lipid: glycerol with three fatty-acid tails; one tail gains a cis double bond and bends, so the tails stack loosely as a liquid oil, 9 kcal/g. Protein: amino-acid beads link into a chain that folds, 4 kcal/g.",
    caption:"Shape → function."
  },
  goals:[
    "I can describe the structure, functions and food sources of carbohydrates, including fibre.",
    "I can explain the difference between saturated, unsaturated and trans fats, and why omega-3 and omega-6 fats are essential.",
    "I can explain essential amino acids and how complementary proteins work.",
    "I can calculate the energy and % of energy from each macronutrient in a food.",
    "I can use a Nutrition Facts table to compare foods’ fats, sugars and fibre.",
    "I can judge whether a meal’s macronutrient pattern fits the AMDRs for a persona, without moral labels."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Energy arithmetic", goal:4,
          prompt:"A food has 10 g of fat. How many kilocalories come from fat?",
          options:[
            { t:"90 kcal", ok:true, why:"10 × 9 = 90." },
            { t:"40 kcal", why:"Fat gives 9 kcal per gram." },
            { t:"10 kcal", why:"Multiply by kcal per gram." },
            { t:"19 kcal", why:"10 × 9, not 10 + 9." }],
          hints:["kcal per gram of fat?", "9.", "10 × 9 = 90."] },
        { id:"w2", skill:"Energy arithmetic", goal:4,
          prompt:"A snack has 120 kcal from carbohydrate out of 240 kcal total. What percentage of its energy is from carbohydrate?",
          options:[
            { t:"50%", ok:true, why:"120 ÷ 240 = 0.5." },
            { t:"120%", why:"Divide by the total." },
            { t:"30%", why:"Use kcal, not grams." },
            { t:"2%", why:"Part ÷ whole." }],
          hints:["Part ÷ whole.", "120 ÷ 240.", "50%."] },
        { id:"w3", skill:"Food sources", goal:1,
          prompt:"Which food is the richest source of <strong>fibre</strong> per serving?",
          options:[
            { t:"¾ cup of cooked lentils", ok:true, why:"Legumes are among the highest-fibre foods." },
            { t:"A cup of white rice", why:"Refined grains have lost most of their bran." },
            { t:"A glass of apple juice", why:"Juicing removes most of the fibre." },
            { t:"A cup of milk", why:"Milk has no fibre." }],
          hints:["Fibre comes from plants.", "Whole and less processed plants keep it.", "Lentils."] },
        { id:"w4", skill:"Food sources", goal:2,
          prompt:"Which is mostly <strong>unsaturated</strong> fat?",
          options:[
            { t:"Canola oil", ok:true, why:"Liquid at room temperature; mostly unsaturated." },
            { t:"Butter", why:"Mostly saturated; solid when cool." },
            // VERIFY: coconut oil described as mostly saturated (plan W4, risk 2).
            { t:"Coconut oil", why:"A plant oil that is mostly saturated." },
            { t:"Lard", why:"Mostly saturated and monounsaturated, solid at room temperature." }],
          hints:["Liquid or solid at room temperature?", "Liquid oils are mostly unsaturated, except coconut and palm.", "Canola."] },
        { id:"w5", skill:"Nutrition Facts", goal:5,
          prompt:"A label shows Sugars 15 g, 15% DV. By Health Canada’s rule of thumb, is that a little or a lot?",
          options:[
            { t:"A lot: 15% or more is a lot", ok:true, why:"5% or less is a little; 15% or more is a lot." },
            { t:"A little: under 50%", why:"The rule is 5% and 15%, not 50%." },
            { t:"Can’t tell without the calories", why:"The %DV already compares it." },
            { t:"A little, because it’s grams", why:"Use %DV, not grams." }],
          hints:["Recall the 5/15 rule.", "15% is the “a lot” line.", "A lot."] },
        { id:"w6", skill:"Nutrition Facts", goal:5,
          prompt:"On a Canadian Nutrition Facts table, what does “%DV” compare the amount to?",
          options:[
            { t:"A reference daily amount for that nutrient (the Daily Value)", ok:true, why:"It shows how much of a day’s reference the serving gives." },
            { t:"The percentage of the food’s weight", why:"It’s not by weight." },
            { t:"Your personal needs", why:"It’s a general reference, not personal." },
            { t:"Other brands", why:"It’s a fixed reference." }],
          // Plan hint 3 is "A." (an option letter); the build reorders options, so it names the answer instead.
          hints:["DV = Daily Value.", "A reference amount.", "A reference daily amount for that nutrient: the Daily Value."] }
      ],
      refreshers:{
        "Energy arithmetic":"kcal = grams × 4 (carbohydrate, protein) or × 9 (fat). % of energy = nutrient kcal ÷ total kcal × 100.",
        "Food sources":"Fibre comes from whole plant foods (legumes, whole grains, vegetables, fruit). Liquid oils are mostly unsaturated (except coconut and palm); solid animal fats are more saturated.",
        "Nutrition Facts":"%DV compares a serving with a reference daily amount: 5% or less is a little, 15% or more is a lot."
      }
    }
  },
  explore:{
    heading:"Macronutrient lab",
    intro:"Build each nutrient from its pieces, then measure where a food’s energy comes from.",
    // Carbohydrate bench: tiles, the three double sugars and the notes shown in the readout (plan K1 feedback lines)
    sugars:{ glc:{ t:"Glucose", ab:"Glc", note:"The body’s main fuel and the brain’s preferred one." }, fru:{ t:"Fructose", ab:"Fru", note:"A single sugar." }, gal:{ t:"Galactose", ab:"Gal", note:"A single sugar." } },
    pairs:{ "fru+glc":{ t:"Sucrose", note:"Split into glucose and fructose." }, "gal+glc":{ t:"Lactose", note:"Milk sugar." }, "glc+glc":{ t:"Maltose", note:"Two glucose units." } },
    chains:{ starch:{ t:"Starch", note:"Plant storage. Digested to glucose." }, glycogen:{ t:"Glycogen", note:"Stored in liver and muscle. Digested to glucose." }, cellulose:{ t:"Cellulose (insoluble fibre)", note:"Plant cell walls; fibre." } },
    // Fat bench presets for the triglyceride (cis double-bond positions counted from the omega end, one list per tail): model data
    fatPresets:{ butter:{ t:"Butter (model: mostly saturated)", tails:[[], [], [9]] }, canola:{ t:"Canola oil (model: mostly unsaturated)", tails:[[9], [6, 9], [3, 6, 9]] } },
    amino:AMINO, essential:ESS, plant:PLANT,
    // Measure mode chips: the lunch-box foods plus the candy from P4 (practice model)
    candy:{ id:"candy", t:"Candy", c:19, f:0, p:0, fi:0, sug:19 },
    predictions:[
      { id:"p1", prompt:"Which has more energy: 10 g of fat or 20 g of carbohydrate?",
        options:[{ t:"10 g of fat", ok:true }, { t:"20 g of carbohydrate" }, { t:"They’re equal" }, { t:"Can’t tell" }],
        explain:"Fat’s 9 kcal/g beats twice the grams of carbohydrate at 4 kcal/g. The bars show 90 kcal vs 80 kcal." },
      { id:"p2", prompt:"A recipe swaps butter for canola oil. What happens to the saturated fat?",
        options:[{ t:"It drops, and unsaturated fat rises", ok:true }, { t:"It rises" }, { t:"No change" }, { t:"The fat disappears" }],
        explain:"Swapping saturated for unsaturated fats is the evidence-based change; removing all fat isn’t." },
      { id:"p3", prompt:"Chain glucose with β-bonds (as in cellulose). How much energy do humans get from it?",
        options:[{ t:"Very little: our enzymes can’t break β-bonds", ok:true }, { t:"The same as starch" }, { t:"Twice as much" }, { t:"Only at night" }],
        explain:"That’s fibre: valuable for digestion, not for fuel." },
      { id:"p4", prompt:"An apple and a candy have the same 19 g of sugar. Which also brings about 4 g of fibre and lots of water?",
        options:[{ t:"The apple", ok:true }, { t:"The candy" }, { t:"Both" }, { t:"Neither" }],
        explain:"Same sugar grams, different package." }
    ],
    challenges:[
      { id:"tc1", goal:4,
        prompt:"A granola bar’s label shows 30 g of carbohydrate, 4 g of fat and 11 g of protein. Enter the % of energy from each.",
        why:"120 + 36 + 44 = 200 kcal, so 60%, 18% and 22%.",
        general:"Each box needs that nutrient’s kcal ÷ total kcal × 100. Type your answers in the “Your % of energy” boxes in Measure mode.",
        msgs:{ grams:"Those are % of grams. Convert to kcal first: fat × 9.", boxes:"Check which box is which.", empty:"Type a % in each of the three boxes in Measure mode." },
        hints:["kcal: 30 × 4, 4 × 9, 11 × 4.", "120 + 36 + 44 = 200 kcal.", "120/200 = 60%, 36/200 = 18%, 44/200 = 22%."] },
      { id:"tc2", goal:2,
        prompt:"On the fat bench, build an 18-carbon fatty acid that is <strong>liquid at room temperature</strong> and is an <strong>omega-3</strong>.",
        why:"Every double bond is cis, so the chain kinks (liquid), and the first one is at carbon 3 from the omega end.",
        msgs:{ omega:"Liquid, but that’s an omega-{n}.", trans:"A trans bond keeps the chain straight, like saturated fat.", none:"Saturated: solid at room temperature." },
        hints:["Count from the omega (methyl) end.", "Put a cis double bond at carbon 3 from that end.", "For example, cis bonds at omega-3, 6 and 9 (alpha-linolenic acid)."] },
      { id:"tc3", goal:3, stretch:true,
        prompt:"Choose <strong>two</strong> plant foods so that every essential amino-acid bar reaches 100% of the reference.",
        why:"Each food covers the other’s low amino acid.",
        msgs:{ grains:"Both are low in lysine.", legumes:"Both are low in methionine.", spinach:"Spinach has too little protein to fill the gap.", two:"Choose two plant foods on the protein bench." },
        hints:["Which amino acid is each food low in?", "Grains lack lysine; legumes lack methionine.", "Rice and lentils, pita and hummus, or a corn tortilla and black beans."] }
    ],
    blocks:[{ title:"What the lab shows", html:"<p>Structure explains behaviour and value: <strong>kinks make oils</strong>, <strong>β-bonds make fibre</strong>, and <strong>missing amino acids make complementary pairs</strong>. Fat’s 9 kcal/g means percentages need kcal, not grams.</p>" }]
  },
  part3:{
    slug:"fats-sugars", name:"Fats & sugars", heading:"Read the fats and sugars",
    intro:"Leave the molecule benches for <strong>labels</strong>: the same structures, as shoppers see them. Work through three stations, then the quick check.",
    fat:{
      title:"Station 1: The fat lines",
      intro:"A label (practice model) shows Fat 10 g; Saturated 3 g + Trans 0 g, 15% DV; Cholesterol 10 mg. Tap each line to see what it means.",
      rows:[
        { id:"fat", t:"Fat 10 g", mean:"All the fat in one serving. At 9 kcal per gram, 10 g gives 90 kcal." },
        { id:"sat", t:"Saturated 3 g", dv:"15 %", sub:true, mean:"Saturated and trans fats are grouped because both raise LDL cholesterol. Together they give 15% DV: a lot, by the 5/15 rule." },
        // VERIFY: date and wording of Canada's ban on partially hydrogenated oils (2018).
        { id:"trans", t:"+ Trans 0 g", sub:true, mean:"Canada prohibited partially hydrogenated oils in foods in 2018, so most labels now show 0 g." },
        { id:"chol", t:"Cholesterol 10 mg", mean:"Cholesterol is listed on its own line, in milligrams: 10 mg is 0.01 g." }
      ]
    },
    yogurt:{
      title:"Station 2: Check it with data, two yogurts",
      intro:"Two practice-model yogurt labels. Tap each ingredient to see whether it brings sugar.",
      // VERIFY: Daily Value for sugars (100 g) and the current rule for grouping sugars in ingredient lists.
      labels:[
        { id:"plain", t:"Plain yogurt", sug:6, dv:"6 %", ing:["milk", "cultures"] },
        { id:"vanilla", t:"Vanilla yogurt", sug:16, dv:"16 %", ing:["milk", "sugar", "cultures"] }
      ],
      ing:{ milk:{ t:"Milk", kind:"natural", fb:"Milk contains lactose: naturally occurring sugar." }, sugar:{ t:"Sugar", kind:"added", fb:"Added sugar." }, cultures:{ t:"Bacterial cultures", kind:"none", fb:"No sugar here." } },
      prompt:"Which sugars are naturally occurring?",
      answerText:"The lactose in the milk: about the 6 g in both.",
      data:[
        "Plain: 6 g of sugars and no sugar in the ingredients, so all 6 g come from the milk’s lactose.",
        "Vanilla: 16 g − 6 g = 10 g of added sugar, about.",
        "The Daily Value for sugars is 100 g, so grams and %DV match: 6 g is 6% DV and 16 g is 16% DV.",
        "Labels now show total sugars, so check the ingredient list for added sugars. Ingredient lists group sugars."
      ]
    },
    bread:{
      title:"Station 3: Fibre finder",
      intro:"Three bread labels (practice model). Tap each bread to read its fibre line and its first ingredient.",
      breads:[
        { id:"white", t:"White bread", fi:1, ing:["Enriched wheat flour", "water", "yeast", "salt"] },
        { id:"multi", t:"“Multigrain” bread", fi:2, ing:["Enriched wheat flour", "water", "oats", "flaxseed", "millet", "yeast", "salt"] },
        { id:"whole", t:"100% whole grain whole wheat bread", fi:4, ing:["Whole grain whole wheat flour", "water", "yeast", "salt"] }
      ],
      point:"“Multigrain” isn’t the same as whole grain. Read the fibre line and the first ingredient."
    },
    real:{
      title:"Real examples (your teacher chooses)",
      intro:"Your teacher will share two current real products from a store or flyer, photographed and credited with the brand and date: a pair where the front of the package suggests “healthy” but the label tells a fuller story. Add a photo to look at it here. The picture stays on this page only: it isn’t saved or sent anywhere.",
      slots:["Product 1", "Product 2"],
      prompts:["The fat lines: what do Saturated + Trans and its %DV tell you?", "Sugars: which are naturally occurring, and which are added? Check the ingredient list.", "Fibre: what do the fibre line and the first ingredient tell you?"],
      credit:"Shown for education (fair dealing)."
    },
    // VERIFY: reference years and titles before release.
    blocks:[{ title:"Sources (APA 7)", html:'<ul class="hfa-refs"><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Dietary reference intakes tables</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Nutrition labelling: Nutrition facts table</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Fats & sugars quick check", summary:"Fats & sugars quick check",
      items:[
        { id:"q1", goal:2, prompt:"Why are saturated and trans fat combined on Canadian labels?",
          choices:[{ t:"Both raise LDL cholesterol", ok:true, fb:"Right. They share a health effect." }, { t:"Both are essential", fb:"They share a health effect." }, { t:"Both come from fish", fb:"They share a health effect." }, { t:"Both are carbohydrates", fb:"They share a health effect." }] },
        { id:"q2", goal:5, prompt:"Plain yogurt shows 6 g of sugars and no sugar in the ingredients. Where do the sugars come from?",
          choices:[{ t:"Lactose in milk", ok:true, fb:"Right. Naturally occurring sugar." }, { t:"Added sugar", fb:"Naturally occurring sugar." }, { t:"Fibre", fb:"Naturally occurring sugar." }, { t:"Fat", fb:"Naturally occurring sugar." }] },
        { id:"q3", goal:[1, 5], prompt:"Which bread is whole grain?",
          choices:[{ t:"First ingredient “whole grain whole wheat flour”", ok:true, fb:"Right. Names and colours can mislead." }, { t:"Name says “multigrain”", fb:"Names and colours can mislead." }, { t:"Brown colour", fb:"Names and colours can mislead." }, { t:"Contains seeds", fb:"Names and colours can mislead." }] },
        { id:"q4", goal:5, prompt:"A cereal has Sugars 3% DV. A little or a lot?",
          choices:[{ t:"A little", ok:true, fb:"Right. 5% or less is a little." }, { t:"A lot", fb:"5% or less is a little." }, { t:"Medium", fb:"5% or less is a little." }, { t:"Can’t tell", fb:"5% or less is a little." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"jobs", type:"match", title:"Nutrient ↔ job or source", summary:"Nutrient ↔ job", goal:[1, 2, 3],
        instruction:"Match each nutrient to its job or a food source. One card on the right has no partner.",
        leftTitle:"Nutrient", rightTitle:"Job or source",
        left:[
          ml("l1", "Soluble fibre", "r1", "r2", 1), ml("l2", "Insoluble fibre", "r2", "r1", 1), ml("l3", "Glycogen", "r3", "r9", 1),
          ml("l4", "Omega-3 fatty acids", "r4", "r5", 2), ml("l5", "Trans fat", "r5", "r4", 2), ml("l6", "Essential amino acids", "r6", "r7", 3),
          ml("l7", "Complementary proteins", "r7", "r6", 3), ml("l8", "Phospholipids", "r8", "r4", 2)
        ],
        right:Object.keys(RJ).map(id => ({ id, t:RJ[id] })),
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l1|r2":"Soluble fibre forms a gel; insoluble fibre adds bulk.", "l2|r1":"Soluble fibre forms a gel; insoluble fibre adds bulk.",
          "l3|r9":"Starch is the plant store; glycogen is the animal store.",
          "l5|r4":"Omega-3s are kinked cis fats; trans fats are straight.", "l4|r5":"Omega-3s are kinked cis fats; trans fats are straight." },
        wrongDefault:"Match the structure to its job." },
      { id:"detective", type:"custom", title:"Energy detective", summary:"Energy detective", star:true, goal:[4, 6],
        instruction:"Six energy puzzles. The ★ items are non-routine: work backwards, add to a meal, or plan a day.",
        how:"Type a number and press Check, or tap your choices. Units like % or g are optional.",
        items:[
          { id:"n1", kind:"num", goal:4, prompt:"A snack: 45 g carbohydrate, 8 g fat, 12 g protein. Total kcal?", answer:300, unit:"kcal",
            why:"45 × 4 + 8 × 9 + 12 × 4 = 180 + 72 + 48 = 300 kcal.", wrong:[{ match:65, fb:"Those are grams; convert to kcal." }],
            hints:["Convert each nutrient to kcal: carbohydrate and protein give 4 kcal/g, fat 9 kcal/g.", "45 × 4 = 180, 8 × 9 = 72, 12 × 4 = 48.", "180 + 72 + 48 = 300 kcal."] },
          { id:"n2", kind:"num", goal:4, prompt:"Same snack: % of energy from fat?", answer:24, unit:"%",
            why:"Fat: 8 × 9 = 72 kcal, and 72 ÷ 300 = 24%.", wrong:[{ match:12, fb:"8 ÷ 65 grams. Use kcal: 72 ÷ 300." }],
            hints:["Use kcal, not grams: fat kcal ÷ total kcal.", "Fat: 8 × 9 = 72 kcal, out of 300 kcal.", "72 ÷ 300 = 0.24, so 24%."] },
          { id:"n3", kind:"multi", star:true, goal:[4, 6], prompt:"A meal: 50 g carbohydrate, 20 g fat, 30 g protein. Which nutrients are outside the 4–18 AMDR? <strong>(Choose all that apply.)</strong>",
            options:[
              { t:"Carbohydrate", ok:true, miss:"Check carbohydrate too: 200 ÷ 500 = 40%, below 45%." },
              { t:"Fat", ok:true, miss:"Check fat too: 180 ÷ 500 = 36%, just above 35%." },
              { t:"Protein", why:"120 ÷ 500 = 24%, inside 10–30%." }],
            why:"Carbohydrate (200 ÷ 500 = 40%) and fat (180 ÷ 500 = 36%) are outside the ranges; protein (24%) is inside.",
            hints:["Find each nutrient’s % of energy, then compare it with 45–65%, 25–35% and 10–30%.", "Total: 200 + 180 + 120 = 500 kcal.", "Carbohydrate 200 ÷ 500 = 40% (below 45%), fat 180 ÷ 500 = 36% (above 35%), protein 120 ÷ 500 = 24% (inside). Choose carbohydrate and fat."] },
          { id:"n4", kind:"num", star:true, goal:4, prompt:"A 200 kcal drink gets 25% of its energy from protein. How many grams of protein?", answer:12.5, unit:"g",
            why:"25% of 200 kcal = 50 kcal, and 50 ÷ 4 kcal/g = 12.5 g.", wrong:[{ match:50, fb:"25% of 200 kcal is 50 kcal; ÷ 4 kcal/g." }],
            hints:["Work backwards: find the protein kcal first.", "25% of 200 kcal = 50 kcal.", "50 kcal ÷ 4 kcal/g = 12.5 g."] },
          { id:"n5", kind:"num", star:true, goal:[4, 6], prompt:"A 315 kcal lunch has 5 g of fat. You add 5 g of olive oil. What percentage of the <strong>new</strong> total energy is from fat?", answer:25, unit:"%",
            why:"Fat: 45 + 45 = 90 kcal. Total: 315 + 45 = 360 kcal. 90 ÷ 360 = 25%.",
            wrong:[{ match:14, fb:"That’s the old lunch (45 ÷ 315). Add the oil to both the fat and the total: 90 ÷ 360." }, { match:50, fb:"The total changes too: 315 + 45 = 360 kcal." }],
            hints:["Both the fat and the total change when you add oil.", "Fat: 5 g + 5 g = 10 g, so 90 kcal. Total: 315 + 45 = 360 kcal.", "90 ÷ 360 = 0.25, so 25%."] },
          // VERIFY: fibre AI for the persona (26 g).
          { id:"n6", kind:"pair", star:true, goal:6, need:26, have:14,
            prompt:"Persona Jordan (16) needs about 26 g of fibre a day (AI). Lunch gave 9 g and breakfast 5 g. Which dinner-and-snack pair from the chips reaches 26 g with the fewest items?",
            chips:[{ id:"curry", t:"Lentil curry", g:8 }, { id:"rice", t:"Brown rice", g:3 }, { id:"apple", t:"Apple", g:4 }, { id:"rasp", t:"Raspberries, 1 cup", g:8 }, { id:"pasta", t:"White pasta", g:2 }],
            answer:[["apple", "curry"], ["apple", "rasp"], ["curry", "rasp"]],
            wrong:{ "curry+rice":"That adds 11 g, so 25 g in total, 1 g short.", pasta:"Only 2 g; it can’t close a 12 g gap with one partner.", short:"That adds {a} g, so {t} g in total, {s} g short.", count:"Choose two chips: one dinner-and-snack pair." },
            why:"Three pairs work: lentil curry + apple (12 g → 26 g), raspberries + apple (12 g → 26 g), lentil curry + raspberries (16 g → 30 g).",
            hints:["How much more fibre is needed? 26 − 14 = 12 g.", "Which two chips add to 12 g or more?", "Lentil curry (8 g) + apple (4 g) = 12 g, or lentil curry + raspberries = 16 g."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Benedikt", goal:[2, 3, 4], how:"",
        instruction:"Benedikt made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Find the % of energy from fat in a muffin: 40 g carbohydrate, 15 g fat, 5 g protein.",
            steps:["Total grams: 40 + 15 + 5 = 60 g.", "Fat: 15 ÷ 60 = 25%.", "So 25% of the muffin’s energy is from fat."],
            answer:0, stepFb:["", "Step 2 uses step 1’s grams. The mistake is earlier.", "Step 3 repeats it."],
            fixes:[
              { t:"Convert to kcal: 160 + 135 + 20 = 315 kcal; fat 135 ÷ 315 ≈ 43%.", ok:true, why:M1 },
              { t:"Fat: 15 × 4 = 60 kcal.", why:"Fat is 9 kcal/g." },
              { t:"Use 100 g as the total.", why:"Use the real total." },
              { t:"Step 1 is correct.", why:"Percent of energy needs kcal." }],
            hints:["Grams or kcal?", "Fat × 9.", "About 43%."] },
          { id:"e2", goal:2, task:"Advise a persona who wants to eat “as little fat as possible”.",
            steps:["Fat has 9 kcal per gram, the most of the three.", "So the healthiest diet has close to zero fat.", "Choose fat-free products for everything."],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Fats carry vitamins A, D, E and K and provide essential omega-3 and omega-6 fats. The AMDR for adults is 20–35% of energy; choose mostly unsaturated sources.", ok:true, why:M2 },
              { t:"So eat only butter.", why:"Swinging to saturated fats doesn’t help." },
              { t:"So count every gram.", why:"Counting isn’t the issue; the type and pattern are." },
              { t:"Step 2 is correct.", why:M2 }],
            // Plan hint 3 is "Fix A."; fixes are reordered by the build, so it quotes the fix.
            hints:["What jobs do fats do?", "Vitamins and essential fatty acids.", "Fats carry vitamins A, D, E and K and provide essential omega-3 and omega-6 fats; aim for 20–35% of energy (adults), mostly from unsaturated sources."] },
          { id:"e3", goal:3, task:"Plan a complete-protein vegetarian lunch.",
            steps:["Plant foods are often low in one essential amino acid.", "Grains are low in lysine.", "So pair rice with whole-wheat bread to cover lysine.", "That makes the lunch complete."],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Pair rice with a legume such as lentils or black beans, which supply lysine.", ok:true, why:M4 },
              { t:"Add more rice.", why:"More rice adds more of the same gap." },
              { t:"Plant proteins can’t be complete.", why:"Pairs can be; soy and quinoa are complete alone." },
              { t:"Step 3 is correct.", why:"Both are grains, both low in lysine." }],
            hints:["Which foods are rich in lysine?", "Legumes.", "Pair rice with a legume such as lentils or black beans, which supply lysine."] }
        ] }
    ]
  },
  reflect:{
    support:SUPPORT,
    journal:[
      { id:"j1", q:"Which structure in the lab (the kink, the β-bond, the missing amino acid) best explained a food fact you already knew?" },
      { id:"j2", q:"In your own words, why must you convert grams to kcal before finding % of energy?" },
      { id:"j3", q:"Explain to a friend how to build a complete-protein meal without meat." },
      { id:"j4", q:"Which label line will you look at differently now, and why?" }
    ],
    // Optional private self check (plan Reflect): opt-in, nothing saved, scored or added to the summary, no calories.
    self:{
      title:"Self check: one typical lunch",
      intro:"Pick one typical lunch you eat. Does it include a carbohydrate source, a protein source and a fat source? About how many grams of fibre?",
      privacy:"Nothing you enter here is scored, saved or sent. It stays on this page, on this device, and it isn’t added to your results summary.",
      open:"Open the self check",
      sources:["A carbohydrate source", "A protein source", "A fat source"],
      fibreLabel:"About how many grams of fibre?",
      // VERIFY: the 26 g reference is the persona's AI from Energy detective.
      ref:26, refText:"General reference used in this module: about 26 g of fibre a day (Jordan’s AI). It’s a reference for a whole day, not a target for you.",
      advice:"For your own health, talk to a doctor, nurse or registered dietitian."
    }
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which carbohydrate do human digestive enzymes <strong>not</strong> break down for energy?", options:[
          { t:"Cellulose (insoluble fibre)", ok:true, why:"Its β-bonds resist human enzymes." },
          { t:"Starch", why:"Digested to glucose." },
          { t:"Sucrose", why:"Split into glucose and fructose." },
          { t:"Glycogen", why:"Digested to glucose." }] },
        b:{ prompt:"Which carbohydrate is the storage form of glucose in animals?", options:[
          { t:"Glycogen", ok:true, why:"Stored in liver and muscle." },
          { t:"Starch", why:"Plant storage." },
          { t:"Cellulose", why:"Plant cell walls; fibre." },
          { t:"Lactose", why:"Milk sugar." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Why are trans fats harmful compared with cis unsaturated fats?", options:[
          { t:"Their straight chains pack like saturated fat, and they raise LDL and lower HDL", ok:true, why:M3 },
          { t:"They contain no carbon", why:"They are fatty acids." },
          { t:"They are essential", why:"Not essential." },
          { t:"They are carbohydrates", why:"They are lipids." }] },
        b:{ prompt:"What makes omega-3 fatty acids “essential”?", options:[
          { t:"The body can’t make them, so they must come from food", ok:true, why:"Omega-3 and omega-6 fatty acids are essential: the body can’t make them." },
          { t:"They give more than 9 kcal/g", why:"All fats give about 9 kcal/g." },
          { t:"They are saturated", why:"They are polyunsaturated." },
          { t:"They’re found only in supplements", why:"Flaxseed, walnuts and fish are food sources." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"A food has 20 g of carbohydrate, 5 g of fat and 10 g of protein. Total energy?", options:[
          { t:"165 kcal", ok:true, why:"80 + 45 + 40." },
          { t:"140 kcal", why:"Fat counted at 4 kcal/g." },
          { t:"35 kcal", why:"Those are grams." },
          { t:"315 kcal", why:"All counted at 9 kcal/g." }] },
        b:{ prompt:"A food has 30 g of carbohydrate, 10 g of fat and 5 g of protein. Total energy?", options:[
          { t:"230 kcal", ok:true, why:"120 + 90 + 20." },
          { t:"180 kcal", why:"Fat at 4 kcal/g." },
          { t:"45 kcal", why:"Grams." },
          { t:"405 kcal", why:"All at 9." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A 300 kcal smoothie has 9 g of fat. Is its fat within the 4–18 AMDR (25–35%)?", options:[
          { t:"Yes: 9 × 9 = 81 kcal, and 81 ÷ 300 = 27%", ok:true, why:"27% is inside 25–35%." },
          { t:"No: 9 ÷ 300 = 3%", why:"Grams ÷ kcal mixes units." },
          { t:"No: 9 g is too much fat", why:"Judge by % of energy." },
          { t:"Can’t tell without carbohydrate grams", why:"Fat kcal and the total are enough." }] },
        b:{ prompt:"A 400 kcal bowl has 16 g of fat. Is its fat within 25–35%?", options:[
          { t:"No: 16 × 9 = 144 kcal, and 144 ÷ 400 = 36%, just above 35%", ok:true, why:"Close, but outside the range." },
          { t:"Yes: 16 ÷ 400 = 4%", why:M1 },
          { t:"Yes: 16 g is moderate", why:"Judge by % of energy." },
          { t:"Can’t tell", why:"Fat kcal and the total suffice." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A family’s traditional meal is corn tortillas with black beans. A cousin says it “lacks complete protein”. Best response?", options:[
          { t:"Corn (low in lysine) and beans (low in methionine) cover each other, so the pair supplies all essential amino acids", ok:true, why:M4 },
          { t:"The cousin is right; only meat is complete", why:M4 },
          { t:"Add more tortillas", why:"More of the same gap." },
          { t:"Protein completeness doesn’t matter", why:"It matters over a day’s eating." }] },
        b:{ prompt:"A student eats peanut butter on whole-wheat toast. Complete protein?", options:[
          { t:"Yes, in effect: a legume with a grain covers lysine and methionine", ok:true, why:"Peanuts are legumes and whole wheat is a grain: each covers the other’s low amino acid." },
          { t:"No; peanuts are nuts, not legumes", why:"Peanuts are legumes." },
          { t:"No; toast has no protein", why:"Whole wheat has protein, low in lysine." },
          { t:"Only with meat added", why:M4 }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A persona’s lunch is 50% carbohydrate, 30% fat and 20% protein, and includes vegetables and a whole grain. Which statement fits?", options:[
          { t:"The pattern fits the 4–18 AMDRs, and the food groups match Canada’s Food Guide", ok:true, why:"50%, 30% and 20% sit inside 45–65%, 25–35% and 10–30%." },
          { t:"It’s unhealthy because 30% is fat", why:M2 },
          { t:"It must be 33% of each", why:"AMDRs are ranges, not equal splits." },
          { t:"It fails because it has carbohydrates", why:"45–65% is the recommended range." }] },
        b:{ prompt:"A persona’s dinner is 55% carbohydrate, 28% fat and 17% protein, with vegetables and brown rice. Which statement fits?", options:[
          { t:"It fits the 4–18 AMDRs and the Food Guide’s plate idea", ok:true, why:"55%, 28% and 17% sit inside 45–65%, 25–35% and 10–30%." },
          { t:"Too much carbohydrate", why:"55% is inside 45–65%." },
          { t:"Fat must be under 20%", why:"The 4–18 range is 25–35%." },
          { t:"Protein must be above 30%", why:"10–30% is the range." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the clearest explanation for a classmate who says “fat makes you unhealthy”?", options:[
          { t:"“Fat is essential: it carries vitamins A, D, E and K and supplies omega-3s. Replacing saturated and trans fats with unsaturated ones is what’s linked to better heart health.”", ok:true, why:M2 },
          { t:"“Fat is fine, eat as much as you like.”", why:"Overcorrects." },
          { t:"“Fat is bad but tasty.”", why:M2 },
          { t:"“Only fish oil is fat.”", why:"Many foods contain fat." }] },
        b:{ prompt:"Which is the clearest explanation of why canola oil is liquid but butter is solid?", options:[
          { t:"“Canola’s fatty acids are mostly unsaturated, with cis double bonds that kink the chains so they can’t pack tightly; butter’s are mostly saturated and straight.”", ok:true, why:"Unsaturated fatty acids have double bonds that make kinks, so they are liquid oils." },
          { t:"“Canola is warmer.”", why:"Same room." },
          { t:"“Butter has more protein.”", why:"Fat type, not protein." },
          { t:"“Oils have no fat.”", why:"Oils are almost pure fat." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which caption best describes a persona’s dessert of a cookie with milk?", options:[
          { t:"“A sometimes food: the cookie adds sugar and fat; the milk adds protein and calcium. It can fit within a balanced day.”", ok:true, why:M7 },
          { t:"“A bad choice that ruins the day.”", why:M7 },
          { t:"“A cheat meal.”", why:M7 },
          { t:"“Zero nutrition.”", why:"Milk adds protein and calcium." }] },
        b:{ prompt:"Which caption best describes a persona’s snack of chips and salsa?", options:[
          { t:"“The chips add fat and salt; the salsa adds vegetables and flavour. As a sometimes snack it fits a varied day.”", ok:true, why:"It describes what each food adds, with no moral label." },
          { t:"“Junk food.”", why:M7 },
          { t:"“A guilty pleasure.”", why:M7 },
          { t:"“No nutrients at all.”", why:"Salsa brings vegetables." }] } },
      { id:"a1", cat:"A", goal:5,
        // VERIFY: the fibre DV behind "18% DV".
        a:{ prompt:"Two cereals: A has Sugars 12 g (12% DV), Fibre 1 g; B has Sugars 6 g (6% DV), Fibre 5 g (18% DV). For a persona aiming for more fibre and less added sugar, which and why?", options:[
          { t:"B: half the sugars and a lot of fibre (18% DV)", ok:true, why:"15% or more is a lot, so 18% DV is a lot of fibre." },
          { t:"A: more sugar means more energy", why:"The goal is fibre and less added sugar." },
          { t:"Either; they’re cereals", why:"The labels differ." },
          { t:"A: 12% is a little", why:"12% is between a little and a lot; B is better on both lines." }] },
        b:{ prompt:"Two granola bars: X has Saturated + Trans 4 g (20% DV), Fibre 2 g; Y has Saturated + Trans 1 g (5% DV), Fibre 4 g. For a persona choosing for heart health, which and why?", options:[
          { t:"Y: saturated and trans fat is a little (5% DV) and the fibre is higher", ok:true, why:"5% or less is a little; 15% or more is a lot." },
          { t:"X: more fat is more filling", why:"The heart-health lines favour Y." },
          { t:"Either", why:"The labels differ." },
          { t:"X: 20% is a little", why:"15% or more is a lot." }] } },
      { id:"a2", cat:"A", goal:[6, 4],
        a:{ prompt:"Adjust a 500 kcal pasta lunch that gets 15% of its energy from protein so that protein rises to about 25%. Which change best does it while keeping the meal similar?", options:[
          { t:"Add lentils to the sauce", ok:true, why:"Adds protein and fibre, and lifts the protein share." },
          { t:"Add more pasta", why:"Raises carbohydrate share." },
          { t:"Add butter", why:"Raises fat share." },
          { t:"Remove the vegetables", why:"Lowers fibre; protein barely changes." }] },
        b:{ prompt:"Adjust a stir-fry so that more of its fat is unsaturated. Which change best does it?", options:[
          { t:"Cook in canola oil instead of butter", ok:true, why:"Swapping saturated for unsaturated fats is the evidence-based change; removing all fat isn’t." },
          // VERIFY: coconut oil described as mostly saturated.
          { t:"Add coconut oil", why:"Mostly saturated." },
          { t:"Remove all oil", why:"Overcorrects; the meal needs some fat for vitamins." },
          { t:"Add more rice", why:"Doesn’t change the fat type." }] } }
    ]
  },
  task:{
    title:"Balanced lunch box", summary:"Balanced lunch box",
    statement:"<p>Choose <strong>four</strong> foods for the lunch of persona <strong>Jordan, 16</strong>, so the lunch matches the patterns below. There are many good answers. Find one, then try a different one.</p><p class=\"tiny muted\">Per serving; practice-model values. Tap a food to add it; tap it again to remove it. The bars compare the lunch’s % of energy with the 4–18 AMDR bands.</p>",
    foods:FOODS,
    checks:["Carbohydrate 45–65% of energy", "Fat 25–35% of energy", "Protein 10–30% of energy", "Fibre 8 g or more", "Includes a vegetable or fruit", "Includes a whole grain"],
    tips:["Carbohydrate is low: add a grain or fruit.", "Fat is low: hummus, cheese or almonds add some.", "Protein is low: add chicken, yogurt, hummus or cheese.", "Add a higher-fibre food: the wrap, the apple, almonds or hummus.", "Canada’s Food Guide fills half the plate with vegetables and fruit.", "Choose the whole-grain wrap or the brown rice salad."],
    tipsHigh:["Carbohydrate is high: add a protein or fat source.", "Fat is high: swap a high-fat item.", "Protein is high: add a grain or fruit."],
    explainPrompt:"Explain how your lunch balances the three macronutrients and why you chose its fibre sources.",
    vocab:"Use the words % of energy, AMDR, fibre, complete protein and unsaturated.",
    checkLabel:"Check my lunch",
    success:"This lunch fits every pattern.",
    more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["kcal per gram", "Carbohydrate 4 · Protein 4 · Fat 9."],
    ["% of energy", "Nutrient kcal ÷ total kcal × 100, e.g. 36 kcal fat in 200 kcal = 18%."],
    ["Fibre", "Plant carbohydrate humans can’t digest; soluble (oats) lowers LDL, insoluble (bran) adds bulk."],
    ["Glycogen vs starch", "Animal glucose store (liver, muscle) vs plant glucose store."],
    ["Saturated fat", "No double bonds; straight chains; solid at room temperature, e.g. butter."],
    ["Unsaturated fat", "Cis double bonds kink chains; liquid oils, e.g. canola, olive."],
    // VERIFY: 2018 date of the trans-fat restriction.
    ["Trans fat", "Straight chain from partial hydrogenation; raises LDL; restricted in Canada since 2018."],
    ["Omega-3", "Essential polyunsaturated fat; first double bond at carbon 3 from the omega end; flax, walnuts, fish."],
    ["Essential amino acids", "Nine the body can’t make; food must supply them."],
    ["Complementary proteins", "Grain + legume, e.g. rice and lentils, cover each other’s low amino acid."],
    // VERIFY: AMDR values (Health Canada DRI tables).
    ["AMDR (ages 4–18)", "Carbohydrate 45–65%, fat 25–35%, protein 10–30% of energy."],
    ["%DV rule", "5% or less is a little; 15% or more is a lot."]
  ]
};
