// HFA4U 18 Food Processing & Labelling. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/18-processing-labelling.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Safety (plan §1, §6.2): labels are read as a shopper's tool. Calories appear only as label information and product
// specifications ("snack-sized"), never as personal targets; no food is called good or bad. The support note (course plan §2)
// shows under the hero and again in Reflect.
// VERIFY (plan §6.1, whole module): the Daily Values; the 5% / 15% guidance; the front-of-package thresholds, exemptions and the
// January 1, 2026 date; the ingredient-list sugar grouping; the nutrient-content claim thresholds ("source", "high source",
// "very high source", "low in sodium"); the approved oat-fibre health-claim wording; CFIA's "natural" guidance; the
// fortification rules and dates; the trans-fat ban date; the Nutrition Facts update timeline; substitution and allergen guidance.
// The model applies the 15% front-of-package rule to every product (plan §6.3); the info box names the real 10% and 30% variants.

// VERIFY: helpline numbers before release (course plan §2 support note).
const ADVICE = "For your own health, talk to a doctor, nurse or registered dietitian.";
const SUPPORT = '<div class="hfa-support" role="note"><p>If food, eating or body image is weighing on you, you’re not alone. Talk to someone you trust, or contact Kids Help Phone (<span class="nw">1-800-668-6868</span>, text CONNECT to <span class="nw">686868</span>) or the National Eating Disorder Information Centre (NEDIC) helpline.</p><p>' + ADVICE + "</p></div>";

// Misconception core sentences (plan §3), "(verify)" flags moved here.
// VERIFY: M3 CFIA "natural" guidance; M5 sugar grouping; M6 additives approved by Health Canada; M7 oat fibre claim.
const M1 = "Different serving sizes make raw numbers misleading. Convert both to the same amount first.";
const M2 = "%DV compares the amount in one serving to a daily reference value. 15% sodium means 15% of the Daily Value, not 15% of the food.";
const M3 = "“Natural” means no added nutrients, additives or artificial flavours; it says nothing about sugar or salt. “Multigrain” means more than one grain, not necessarily whole grain.";
const M4 = "Foods like juice can be high in naturally occurring sugars. Check the sugars line and its %DV.";
const M5 = "Ingredients are listed by weight, and sugar-based ingredients are now grouped together after “Sugars”.";
const M6 = "Freezing, canning and fortifying are processing too. Additives are approved by Health Canada. The concern is with highly processed foods high in sodium, sugars or saturated fat.";
const M7 = "Some functional claims are backed by approved health claims (e.g. oat fibre and cholesterol); others are marketing. Look for the approved claim wording and the amount per serving.";

// Label detective helper: "Use these values" box (plan: "Use DV values from the info box").
const DVBOX = " Daily Values: sodium 2300 mg · saturated + trans fat 20 g · sugars 100 g · fibre 28 g · calcium 1300 mg · iron 18 mg.";
const PCT = "%DV = amount ÷ DV × 100.";   // module-written hint 1 (plan W4 hint 1)

export default {
  id:"18-processing-labelling",
  kind:"topic",
  title:"Food processing and labelling",
  topic:"Food Processing and Labelling",
  readyTopic:"food processing and labelling",
  hero:{
    headline:"The box is talking. Learn its language.",
    text:"The <strong>Nutrition Facts table</strong>, the <strong>ingredient list</strong> and the <strong>front-of-package symbol</strong> are regulated tools for comparing foods. <strong>Claims</strong> like “source of fibre” have legal meanings, while words like “natural” mean less than they seem. Learn to read all four, and the box can’t oversell itself.",
    fig:{ html:'<div class="pl-hero" id="pl-hero"></div>', caption:"" },
    // Hero box (module-written model cereal for the storyboard). VERIFY: model values only.
    box:{ name:"Oat Rings", serving:"Per 3/4 cup (30 g)",
      rows:[
        { t:"Calories", v:"120", cal:true },
        { t:"Fat", v:"1.5 g", dv:2 },
        { t:"Saturated", v:"0.5 g", dv:3, sub:true, two:"+ Trans 0 g" },
        { t:"Carbohydrate", v:"25 g" },
        { t:"Fibre", v:"2 g", dv:7, sub:true },
        { t:"Sugars", v:"15 g", dv:15, sub:true },
        { t:"Protein", v:"2 g" },
        { t:"Sodium", v:"115 mg", dv:5 }
      ],
      ingredients:["Ingredients: Sugars (sugar,", "glucose-fructose, honey),", "whole grain oats, corn flour,", "whole grain wheat, salt,", "natural flavour, vitamin E."] },
    // module-written description of the plan's storyboard (final frame)
    aria:"A cereal box turns to its side panel. The Nutrition Facts table glows: the serving size, per 3/4 cup (30 g), lights up, then the % Daily Value column lights up row by row. Fat 2%, saturated and trans fat 3% and sodium 5% are tagged “a little”; sugars 15% is tagged “a lot”. The ingredient list scrolls up beside the table, and a magnifying-glass symbol reading “High in sugars” fades in on the front of the box.",
    caption:"Sugars: 15% DV, a lot. So the front says “High in sugars”."   // module-written
  },
  goals:[
    "I can read a Nutrition Facts table, including serving size, Calories and %DV (5% a little, 15% a lot).",
    "I can compare two products fairly by adjusting to the same amount.",
    "I can use the ingredient list and front-of-package symbol to learn what’s in a food.",
    "I can tell regulated nutrient-content and health claims apart from vague marketing words.",
    "I can explain levels of food processing, fortification and additives, and how research changed Canadian food policy.",
    "I can evaluate a functional food and plan a recipe that uses one."
  ],
  start:{
    blocks:[{ html:SUPPORT }],
    warmup:{
      questions:[
        { id:"w1", skill:"Nutrient basics", goal:1,
          prompt:"How many Calories does 1 g of fat provide?",
          options:[
            { t:"9", ok:true, why:"Fat gives 9 kcal per gram; carbohydrate and protein give 4." },
            { t:"4", why:"That’s carbohydrate and protein." },
            { t:"7", why:"That’s alcohol." },
            { t:"0", why:"Fat is energy-dense." }],
          hints:["Recall the 4-9-4 rule.", "Carbohydrate 4, fat 9, protein 4.", "9."] },
        // VERIFY: most Canadians eat less fibre than recommended (W2 feedback)
        { id:"w2", skill:"Nutrient basics", goal:1,
          prompt:"Which nutrient does Canada’s Food Guide suggest most Canadians get more of from whole grains, vegetables and fruits?",
          options:[
            { t:"Fibre", ok:true, why:"Most Canadians eat less fibre than recommended." },
            { t:"Sodium", why:"Most Canadians already eat more than recommended." },
            { t:"Saturated fat", why:"The guide advises limiting it." },
            { t:"Added sugars", why:"The guide advises limiting them." }],
          hints:["Whole grains are rich in it.", "It helps digestion.", "Fibre."] },
        { id:"w3", skill:"Proportional reasoning", goal:2,
          prompt:"A 60 g serving has 8 g of sugars. How many grams are in 30 g?",
          options:[
            { t:"4 g", ok:true, why:"Half the amount, half the sugars." },
            { t:"8 g", why:"The amount changed." },
            { t:"16 g", why:"That doubles it." },
            { t:"2 g", why:"That’s a quarter." }],
          hints:["30 is what fraction of 60?", "Half.", "Half of 8 is 4."] },
        // VERIFY: the sodium Daily Value, 2300 mg (W4 prompt)
        { id:"w4", skill:"Proportional reasoning", goal:1,
          prompt:"The Daily Value for sodium is 2300 mg. What %DV is 230 mg?",
          options:[
            { t:"10%", ok:true, why:"230 ÷ 2300 = 0.10." },
            { t:"23%", why:"That treats 230 as a percent." },
            { t:"1%", why:"Check the decimal: 230 ÷ 2300 = 0.1." },
            { t:"50%", why:"1150 mg would be 50%." }],
          hints:["%DV = amount ÷ DV × 100.", "230 ÷ 2300.", "10%."] },
        { id:"w5", skill:"Food guide habits", goal:3,
          prompt:"Which healthy eating habit does Canada’s Food Guide (2019) list?",
          options:[
            { t:"Use food labels", ok:true, why:"It’s one of the guide’s habits." },
            { t:"Count every Calorie", why:"The guide doesn’t recommend counting Calories." },
            { t:"Avoid all packaged foods", why:"It advises limiting highly processed foods, not all packaged foods." },
            { t:"Eat only organic food", why:"Not part of the guide." }],
          hints:["The guide lists habits such as cooking more often.", "One involves reading packages.", "Use food labels."] },
        { id:"w6", skill:"Food guide habits", goal:5,
          prompt:"Canada’s Food Guide advises limiting highly processed foods mainly because many are high in…",
          options:[
            { t:"Sodium, sugars or saturated fat", ok:true, why:"Those are the nutrients of concern." },
            { t:"Fibre", why:"Fibre is a nutrient to get more of." },
            { t:"Water", why:"Not a concern." },
            { t:"Vitamins", why:"Vitamins aren’t the concern." }],
          hints:["The front-of-package symbol flags three nutrients.", "The same three.", "Sodium, sugars, saturated fat."] }
      ],
      refreshers:{
        "Nutrient basics":"Carbohydrate 4, fat 9, protein 4 kcal per gram. Fibre is a carbohydrate most Canadians need more of.",
        "Proportional reasoning":"To compare foods, scale to the same amount: multiply each value by (new amount ÷ serving size).",
        "Food guide habits":"Use food labels; limit highly processed foods; be aware of food marketing."
      }
    }
  },
  explore:{
    heading:"Label lab",
    intro:"Tap any part of a label to see what it means. Compare two products fairly. Then move the sliders and watch the front-of-package symbol appear and disappear.",
    modes:[{ id:"read", t:"Read the label" }, { id:"compare", t:"Compare" }, { id:"design", t:"Symbol designer" }],
    bases:[{ id:"serving", t:"Per serving shown" }, { id:"g30", t:"Per 30 g" }],
    // Model reference values (plan: "model; verify the current Daily Values before release"). VERIFY: every Daily Value.
    dv:{ na:2300, sat:20, sug:100, fib:28, ca:1300, fe:18, k:3400, fat:75 },
    fop:15,                                  // model front-of-package rule: ≥ 15% DV per reference amount (plan)
    fibreClaims:[{ min:6, t:"Very high source of fibre" }, { min:4, t:"High source of fibre" }, { min:2, t:"Source of fibre" }],   // VERIFY: thresholds
    info:{
      title:"Model reference values",
      dvLine:"<strong>Daily Values:</strong> sodium 2300 mg · saturated + trans fat 20 g · sugars 100 g · fibre 28 g · calcium 1300 mg · iron 18 mg · potassium 3400 mg · fat 75 g.",
      fopLine:"<strong>Front-of-package rule used in the model:</strong> the symbol appears when a nutrient is 15% DV or more per reference amount.",
      // VERIFY: the full rule (10% small reference amounts, 30% main dishes, exemptions) and the January 1, 2026 date.
      fullLine:"<strong>The full rule:</strong> 10% for foods with small reference amounts, 30% for main dishes, and exemptions such as whole vegetables and fruits and plain milk. Every model product here uses 15%.",
      fibreLine:"<strong>Fibre claims:</strong> source 2 g or more · high source 4 g or more · very high source 6 g or more, per reference amount and serving.",
      // module-written notes on how the model works
      roundLine:"Labels round %DV to a whole number. The symbol test uses the exact amount: 345 mg of sodium is 15.0% of 2300 mg, but 340 mg is 14.8%.",
      calLine:"In the Symbol designer, Calories = 9 × (saturated + unsaturated fat) + 4 × (sugars + other carbohydrate) + 4 × protein. The model counts fibre within other carbohydrate."
    },
    // Model products (plan table). The plan gives the granola bar in full and the cereals and soup in part; the soup's unsaturated
    // fat, other carbohydrate and protein, and the whole snack bar, are module-supplied model values (VERIFY) chosen so the
    // Calories match (soup 100) and so TC2 starts below the fibre threshold.
    products:[
      { id:"granola", t:"Granola bar", short:"granola bar", serving:"1 bar", cal:180, sat:3.5, unsat:4.5, sug:16, oc:9, fib:2, prot:2, na:120 },
      { id:"cerealA", t:"Cereal A", short:"Cereal A", serving:"30 g", grams:30, cal:120, sat:0.5, sug:6, fib:4, na:150 },
      { id:"cerealB", t:"Cereal B", short:"Cereal B", serving:"55 g", grams:55, cal:220, sat:1, sug:11, fib:5.5, na:220 },
      { id:"soup", t:"Vegetable soup", short:"vegetable soup", serving:"250 mL", cal:100, sat:0.5, unsat:1.5, sug:6, oc:12, fib:3, prot:2.5, na:600 },
      { id:"snack", t:"Snack bar", short:"snack bar", serving:"1 bar (30 g)", cal:115, sat:1, unsat:2, sug:7, oc:12, fib:1, prot:3, na:90 }
    ],
    designProducts:["soup", "snack", "granola"],
    sliders:[
      { id:"sat", t:"Saturated fat", unit:"g", min:0, max:5, step:0.5, role:"fat" },
      { id:"unsat", t:"Unsaturated fat", unit:"g", min:0, max:8, step:0.5, role:"fat" },
      { id:"sug", t:"Sugars", unit:"g", min:0, max:20, step:1, role:"carb" },
      { id:"oc", t:"Other carbohydrate", unit:"g", min:0, max:20, step:1, role:"carb" },
      { id:"fib", t:"Fibre", unit:"g", min:0, max:8, step:0.5, role:"carb" },
      { id:"na", t:"Sodium", unit:"mg", min:0, max:900, step:5, role:"micro" }
    ],
    // Granola bar ingredients (plan). Meanings and model weights for the P4 bar chart are module-written (model data).
    ingredients:[
      { id:"oats", t:"whole grain oats", w:18, mean:"First on the list, so it weighs the most. “Whole grain” tells you the whole kernel is used." },
      { id:"sugars", t:"sugars (brown sugar, honey, glucose syrup)", w:16, group:true, mean:"Every sugar-based ingredient is grouped after “Sugars”, so the group sits second: the bar has more sugars than anything except oats." },
      { id:"canola", t:"canola oil", w:3, mean:"A mostly unsaturated oil." },
      { id:"palm", t:"palm kernel oil", w:3, mean:"A plant oil that is mostly saturated fat. It’s a big part of this bar’s saturated fat." },
      { id:"almonds", t:"almonds", w:3, mean:"A tree nut. That’s why the label says “Contains: almonds”." },
      { id:"rice", t:"crisp rice", w:2, mean:"Puffed rice adds crunch and carbohydrate." },
      { id:"salt", t:"salt", w:0.4, mean:"Salt is sodium chloride: most of this bar’s 120 mg of sodium comes from it." },
      { id:"flavour", t:"natural flavour", w:0.2, mean:"A flavouring made from natural sources. It’s used in tiny amounts, so it comes last." }
    ],
    contains:"Contains: almonds.", mayContain:"May contain: peanuts.",
    allergenMean:{ contains:"“Contains” lists the priority allergens that are ingredients in the food.", may:"“May contain” warns that the food could pick up traces of an allergen during production (cross-contact)." },
    // Meanings for tappable label rows (module-written from the plan's goals, flashcards and Calorie line).
    rowMean:{
      serving:"Every number on the table is for this amount. Compare products by the same amount.",
      cal:"Energy in one serving: 9 × (3.5 + 4.5) + 4 × (16 + 9) + 4 × 2 = 72 + 100 + 8 = 180.",
      fat:"Total fat. Its %DV compares one serving with the 75 g Daily Value.",
      sat:"Saturated and trans fat are counted together. 15% DV or more triggers the “High in saturated fat” symbol.",
      carb:"Total carbohydrate: sugars plus other carbohydrate (fibre included).",
      fib:"A nutrient most Canadians need more of. 2 g or more allows a “source of fibre” claim.",
      sug:"All sugars, added and naturally occurring. 15% DV or more triggers the “High in sugars” symbol.",
      prot:"Protein has no %DV on the label.",
      na:"Sodium. 15% DV or more triggers the “High in sodium” symbol.",
      dv:"%DV answers “a little or a lot?”: 5% or less is a little, and 15% or more is a lot."
    },
    readLabels:{ serving:"Serving size", cal:"Calories", sat:"Saturated + trans fat", sug:"Sugars", fib:"Fibre", na:"Sodium", sym:"Front-of-package symbol", claim:"Fibre claim allowed" },
    levels:{ little:"a little", lot:"a lot", between:"in between" },
    nutr:{ sat:"saturated fat", sug:"sugars", na:"sodium" },
    symNone:"None", claimNone:"None",
    tapHint:"Tap a line on the label or an ingredient to see what it means.",   // module-written
    barTitle:"Ingredients by weight",   // module-written
    predIntro:"Make a prediction first. Then the label lab will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"What’s the fastest way to tell whether this bar has a lot of sugars?",
        options:[{ t:"Look at the %DV for sugars (16%)", ok:true }, { t:"Count the sugar names in the ingredients" }, { t:"Look at the Calories" }, { t:"Look at the brand name" }],
        explain:"%DV puts the grams on a little-to-a-lot scale for you." },
      { id:"p2", prompt:"Cereal B shows 5.5 g fibre and Cereal A 4 g. Switch to “per 30 g”. Which cereal has more fibre now?",
        options:[{ t:"Cereal A", ok:true }, { t:"Cereal B" }, { t:"They’re equal" }, { t:"Can’t tell" }],
        explain:"B’s serving is almost twice as big. Per 30 g, A has more fibre and B less sodium (120 vs 150 mg)." },
      { id:"p3", prompt:"Will the soup carry a “High in sodium” symbol?",
        options:[{ t:"Yes", ok:true }, { t:"No" }, { t:"Only if it’s organic" }, { t:"Only if it’s canned" }],
        explain:"26% is well over the 15% threshold. Soups are a common source of sodium." },
      // VERIFY: the sugar grouping (P4 explanation)
      { id:"p4", prompt:"Which single ingredient is present in the greatest amount?",
        options:[{ t:"Whole grain oats", ok:true }, { t:"Brown sugar" }, { t:"Almonds" }, { t:"Salt" }],
        explain:"Ingredients are listed by weight, and all the sugar-based ingredients are grouped together after “Sugars”, so you can see their combined place in the list." }
    ],
    chalIntro:"Use the Symbol designer, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Symbol designer, vegetable soup. Reformulate the sodium so the “High in sodium” symbol just disappears, keeping as much sodium as possible (for flavour).",
        why:"340 mg is 14.8% DV: under 15%, so no symbol, and 5 mg more would bring it back.",   // module-written
        hints:["15% of 2300 is 345.", "You need to be just under 345, in 5 mg steps.", "340 mg."] },
      { id:"tc2", goal:[1, 4], prompt:"Symbol designer, snack bar. Set the fibre so the bar can claim “source of fibre” but <strong>not</strong> “high source of fibre”.",
        why:"From 2 g up to (but not including) 4 g of fibre, the bar qualifies as a “source of fibre” only.",   // module-written
        hints:["Check the thresholds in the info box.", "Source ≥ 2 g; high source ≥ 4 g.", "Anything from 2 to 3.5 g."] },
      // VERIFY: the industry reformulation examples (after-success line)
      { id:"tc3", goal:[1, 3], stretch:true,
        prompt:"Reformulate the model granola bar so it carries <strong>no</strong> “High in” symbol, while keeping its Calories between 170 and 190 (the same snack size as before). Protein stays at 2 g and sodium at 120 mg.",
        why:"Food companies reformulate like this all the time, and the front-of-package rule pushes them to.",
        hints:["Cut saturated fat to 2.5 g and sugars to 14 g first.", "That removes 9 + 8 = 17 Calories. You need to add 7 to 27 back.", "Add 1 g unsaturated fat (+9) and 1 g other carbohydrate (+4): 176."] }
    ],
    // Named wrong states (plan) and module-written fallbacks
    msgs:{
      pickSoup:"Switch to the Symbol designer and pick the vegetable soup.",            // module-written
      pickSnack:"Switch to the Symbol designer and pick the snack bar.",                // module-written
      pickGranola:"Switch to the Symbol designer and pick the granola bar.",            // module-written
      na345:"345 ÷ 2300 = 15.0%: the symbol still shows.",
      naOver:"{v} ÷ 2300 is {p}%: still 15% or more, so the symbol still shows.",      // module-written
      naUnder:"The symbol’s gone, but you could keep a little more sodium.",
      fibLow:"Below the 2 g threshold for “source”.",
      fibHigh:"That’s “high source” (4 g or more).",
      keepNa:"Keep sodium at 120 mg.",                                                  // module-written
      sat:"{v} ÷ 20 = {p}%: the symbol stays.",
      sug15:"15% exactly still triggers the symbol.",
      sugOver:"{v} g of sugars is {v}% DV: the symbol stays.",                          // module-written
      calLow:"Too small now. Add back some oats (other carbohydrate) or nuts (unsaturated fat).",
      calHigh:"Too big now: keep the Calories between 170 and 190."                     // module-written
    },
    blocks:[{ title:"What the label lab shows", html:"<ul><li>%DV turns grams into “a little or a lot”.</li><li>Serving sizes must match before you compare.</li><li>The front-of-package symbol is the same 15% rule, applied for you.</li></ul>" }]
  },
  part3:{
    slug:"claims", name:"Claims", heading:"Claim check",
    // module-written intro (from the plan's "why this activity suits the topic")
    intro:"The label lab covered the numbers. Now look at the <strong>words</strong>: claims and processing labels, and the <strong>policy</strong> behind them. Then turn a functional food into a recipe plan.",
    stations:[{ id:"decode", t:"1. Decode the claim" }, { id:"func", t:"2. Functional foods" }, { id:"process", t:"3. Processing and policy" }, { id:"kitchen", t:"4. Kitchen card" }],
    decode:{
      title:"Station 1: decode the claim",
      ask:"Tap a claim, then tap the bin it belongs in. Open <strong>Check it with data</strong> to read each claim’s definition and source.",   // module-written
      bins:[{ id:"nc", t:"Regulated nutrient-content claim" }, { id:"hc", t:"Regulated health claim" }, { id:"mk", t:"Marketing word (no specific standard)" }, { id:"term", t:"Specific regulated term with conditions" }],
      // VERIFY: each classification, threshold and definition (plan). "Multigrain" goes in the specific-term bin (see report).
      chips:[
        { id:"fibre", t:"“Source of fibre”", answer:"nc", def:"A nutrient-content claim with a legal threshold: at least 2 g of fibre per reference amount and serving.", ref:"nc",
          wrong:"It names a nutrient and has a legal threshold (2 g or more), so it’s a nutrient-content claim." },
        { id:"sodium", t:"“Low in sodium”", answer:"nc", def:"A nutrient-content claim with a legal threshold: 140 mg of sodium or less per reference amount and serving.", ref:"nc",
          wrong:"It names a nutrient and has a legal threshold (140 mg or less), so it’s a nutrient-content claim." },
        { id:"oat", t:"“Oat fibre helps reduce cholesterol”", answer:"hc", def:"A health claim: it links a food to health, so it must use approved wording, and the food must provide enough oat fibre per serving.", ref:"hc",
          wrong:"It links a food to health (cholesterol), so it’s a health claim with approved wording." },
        { id:"natural", t:"“Natural”", answer:"term", def:"A term with CFIA conditions: no added vitamins or minerals, artificial flavours or food additives, and not significantly altered. It says nothing about sugar or salt.", ref:"nat",
          wrong:"“Natural” has CFIA conditions. " + M3 },
        { id:"multi", t:"“Multigrain”", answer:"term", def:"A descriptive word: more than one grain, not necessarily whole grain.", ref:"comp",
          wrong:"“Multigrain” has a specific meaning: more than one grain, not necessarily whole grain." },
        { id:"whole", t:"“Wholesome”", answer:"mk", def:"A marketing word: there’s no specific standard behind it.", ref:"",
          wrong:"No rule defines “wholesome”: it’s a marketing word." }
      ],
      // VERIFY: titles and years of every reference (APA 7).
      refs:{
        nc:"Canadian Food Inspection Agency. (n.d.). <i>Nutrient content claims</i>. Government of Canada.",
        hc:"Canadian Food Inspection Agency. (n.d.). <i>Health claims on food labels</i>. Government of Canada.",
        nat:"Canadian Food Inspection Agency. (n.d.). <i>Method of production claims on food labels</i>. Government of Canada.",
        comp:"Canadian Food Inspection Agency. (n.d.). <i>Composition and quality claims</i>. Government of Canada.",
        none:"No standard to cite: it’s a marketing word."
      },
      msgs:{ data:"Check it with data", pick:"Tap a claim first, then tap a bin.", done:"All six claims decoded. Regulated claims have rules behind them; marketing words don’t." }   // module-written
    },
    func:{
      title:"Station 2: functional food evaluator",
      ask:"For each product, rate the claim, the evidence and the cost. Then compare your ratings with the model verdict.",   // module-written
      note:"Practice models. Your teacher may add real packages (credited).",   // module-written from the plan's note
      rows:[
        { id:"claim", t:"Approved claim?", opts:[{ id:"yes", t:"Yes" }, { id:"no", t:"No" }] },
        { id:"ev", t:"Evidence strength", opts:[{ id:"strong", t:"Strong" }, { id:"mixed", t:"Mixed" }, { id:"weak", t:"Weak" }] },
        { id:"cost", t:"Cost per serving vs the plain alternative", opts:[{ id:"more", t:"Costs more" }, { id:"same", t:"About the same" }, { id:"less", t:"Costs less" }] }
      ],
      benefit:"Who might benefit? (your notes)",
      // Cards and verdicts: plan. Costs and plain alternatives are module-supplied model numbers (VERIFY).
      cards:[
        { id:"oat", t:"Oat cereal with an approved cholesterol claim", cost:"$0.30", alt:"Store-brand corn cereal", altCost:"$0.30",
          answer:{ claim:"yes", ev:"strong", cost:"same" }, verdict:"Approved claim and strong evidence, at a typical amount per serving." },   // VERIFY: oat claim
        { id:"yog", t:"Plain yogurt with live bacterial cultures", cost:"$0.85", alt:"A glass of milk", altCost:"$0.40",
          answer:{ claim:"no", ev:"mixed", cost:"more" }, verdict:"Mixed: benefits vary by strain or amount." },
        { id:"egg", t:"Omega-3 eggs", cost:"$1.00 for 2 eggs", alt:"Regular eggs", altCost:"$0.50 for 2 eggs",
          answer:{ claim:"no", ev:"mixed", cost:"more" }, verdict:"Mixed: benefits vary by strain or amount." },
        { id:"flax", t:"Ground flaxseed", cost:"$0.10 per tablespoon", alt:"Wheat bran", altCost:"$0.10 per tablespoon",
          answer:{ claim:"no", ev:"mixed", cost:"same" }, verdict:"Fibre and plant omega-3; mixed evidence for specific claims." },
        { id:"juice", t:"“Immunity boost” juice with added vitamin C", cost:"$1.50", alt:"An orange", altCost:"$0.60",
          answer:{ claim:"no", ev:"weak", cost:"more" }, verdict:"Weak, with no approved claim. High in sugars too." }
      ],
      msgs:{ verdict:"Model verdict", match:"Your ratings match the model.", differ:"The model rates {n} differently: {list}.", done:"All five products rated. A functional claim is only as good as its evidence and the amount per serving.", fill:"Rate all three rows to see the model verdict." }   // module-written
    },
    process:{
      title:"Station 3: processing spectrum and policy timeline",
      sortAsk:"Part 1. Tap a food, then tap its group.",   // module-written
      groups:[
        { id:"g1", t:"Unprocessed or minimally processed", sub:"washed, frozen, dried, pasteurized" },
        { id:"g2", t:"Processed culinary ingredients", sub:"pressed, refined or extracted" },
        { id:"g3", t:"Processed foods", sub:"a few ingredients, often with salt, sugar or oil" },
        { id:"g4", t:"Ultra-processed foods", sub:"industrial formulas, many ingredients" }
      ],
      // Group subtitles and wrong-group feedback are module-written (NOVA idea).
      foods:[
        { id:"apple", t:"An apple", answer:"g1" }, { id:"peas", t:"Frozen peas", answer:"g1" }, { id:"milk", t:"Plain milk", answer:"g1" }, { id:"oats", t:"Rolled oats", answer:"g1" },
        { id:"canola", t:"Canola oil", answer:"g2" }, { id:"sugar", t:"Sugar", answer:"g2" }, { id:"salt", t:"Salt", answer:"g2" },
        { id:"beans", t:"Canned beans with salt", answer:"g3" }, { id:"cheese", t:"Cheese", answer:"g3" }, { id:"bread", t:"Simple bread", answer:"g3" },
        { id:"soda", t:"Soft drinks", answer:"g4" }, { id:"cakes", t:"Packaged snack cakes", answer:"g4" }, { id:"noodles", t:"Flavoured instant noodles", answer:"g4" }
      ],
      why:{
        g1:"It’s a whole food, only washed, frozen, dried or pasteurized.",
        g2:"It’s pressed, refined or extracted from a food and used in cooking.",
        g3:"It’s made from a few ingredients, often with added salt, sugar or oil (canning, cheese-making, baking).",
        g4:"It’s an industrial formula with many ingredients, often with additives and flavours you wouldn’t use at home."
      },
      binFb:{
        g1:"That group is for whole foods that are only washed, frozen, dried or pasteurized.",
        g2:"That group is for oils, sugar and salt: pressed, refined or extracted from foods and used in cooking.",
        g3:"That group is for foods made from a few ingredients, often with added salt, sugar or oil.",
        g4:"That group is for industrial formulas with many ingredients, often with additives and flavours."
      },
      critique:{ title:"Critique card", html:"NOVA groups foods by processing, not nutrients. Some ultra-processed foods (e.g. some fortified whole-grain cereals) can fit a healthy pattern, and the definitions are debated." },
      tlAsk:"Part 2. Tap an event, then tap its year on the timeline. Then link the event to the research behind it.",   // module-written
      // VERIFY: every year and event (plan: all verify before release). Research links follow the plan's lists in order.
      years:[{ id:"y1998", t:"1998" }, { id:"y2005", t:"Mid-2000s" }, { id:"y2016", t:"2016–2022" }, { id:"y2018", t:"2018" }, { id:"y2026", t:"2026" }],
      events:[
        { id:"folic", t:"Mandatory folic acid fortification of white flour", answer:{ y:"y1998", r:"ntd" }, why:"Research linked folate to neural tube development, so white flour was fortified with folic acid." },
        { id:"nft", t:"Mandatory Nutrition Facts tables", answer:{ y:"y2005", r:"info" }, why:"Shoppers needed the same nutrition information on every package to compare foods." },
        { id:"pho", t:"Ban on partially hydrogenated oils", answer:{ y:"y2018", r:"heart" }, why:"Industrial trans fat raises LDL cholesterol and the risk of heart disease." },
        { id:"update", t:"Updated Nutrition Facts table", answer:{ y:"y2016", r:"sugars" }, why:"The update added a %DV for sugars and grouped sugar-based ingredients in the ingredient list." },
        { id:"fop", t:"Front-of-package symbol mandatory", answer:{ y:"y2026", r:"sodium" }, why:"Most Canadians eat more sodium than recommended; the symbol flags foods high in sodium, sugars or saturated fat." }
      ],
      research:[{ id:"ntd", t:"Neural tube defects" }, { id:"info", t:"Consumer information" }, { id:"heart", t:"Heart disease" }, { id:"sugars", t:"Sugars awareness" }, { id:"sodium", t:"High-sodium diets" }],
      msgs:{ pickFood:"Tap a food first.", pickEvent:"Tap an event first.", sortDone:"All 13 foods sorted.", tlDone:"Timeline complete: research shaped every one of these rules.",
        yearWrong:"Not that year. Look at the order: fortification came first and the front-of-package symbol last.", researchWrong:"Not quite. Which health problem or need did this rule respond to?", link:"Research behind it:" }   // module-written
    },
    kitchen:{
      title:"Station 4: kitchen card",
      dish:"Overnight oats with ground flax and berries",
      ask:"Adapt the plan, then save your kitchen card. Prepare it in the class kitchen or at home with an adult.",
      servings:[1, 2, 4],
      liquids:[{ id:"milk", t:"Milk" }, { id:"soy", t:"Fortified unsweetened soy beverage" }],
      gf:"Oats labelled gluten-free",
      // Measure (plan, E3.5); quantities scale with the servings chosen (module).
      measure:[{ n:1, d:3, u:"cup", t:"rolled oats" }, { n:1, d:1, u:"tbsp", t:"ground flax" }, { n:1, d:2, u:"cup", t:"{liquid}" }, { n:1, d:2, u:"cup", t:"blueberries" }],
      // VERIFY: 4 °C or colder; eat within 2 days; gluten-free oats for celiac disease; substitution guidance.
      method:["Mix the oats, flax and {liquid} in a jar or covered container.", "Top with the blueberries.", "Mix and refrigerate overnight, at 4 °C or colder."],
      notes:["Celiac disease: use oats labelled gluten-free.", "Dairy-free: swap the dairy for a fortified soy beverage.", "Functional ingredients: oats (oat fibre) and ground flax (fibre and plant omega-3)."],
      safety:"Eat within 2 days.",
      prepare:"Prepare in the class kitchen or at home with an adult."
    },
    // VERIFY: reference details (titles, years) before release.
    blocks:[{ title:"Sources to check (APA 7)", html:'<ul class="hfa-refs"><li>Canadian Food Inspection Agency. (n.d.). <i>Health claims on food labels</i>. Government of Canada.</li><li>Canadian Food Inspection Agency. (n.d.). <i>Method of production claims on food labels</i>. Government of Canada.</li><li>Canadian Food Inspection Agency. (n.d.). <i>Nutrient content claims</i>. Government of Canada.</li><li>Health Canada. (2019). <i>Canada’s food guide</i>. Government of Canada.</li><li>Health Canada. (n.d.). <i>Front-of-package nutrition symbol labelling</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Claims quick check", summary:"Claims quick check",
      // Correct-choice lines are module-written ("Right." + the plan's point). VERIFY: q2 threshold; q3 folate research.
      items:[
        { id:"q1", goal:4, prompt:"A bread says “multigrain”. What do you know for sure?",
          choices:[{ t:"It contains more than one grain", ok:true, fb:"Right. That’s all “multigrain” guarantees. Check the ingredients for “whole grain”." },
            { t:"It’s whole grain", fb:"Check the ingredients for “whole grain”." },
            { t:"It’s high in fibre", fb:"Check the ingredients for “whole grain”." },
            { t:"It’s organic", fb:"Check the ingredients for “whole grain”." }] },
        { id:"q2", goal:4, prompt:"Which is a regulated nutrient-content claim?",
          choices:[{ t:"Source of fibre", ok:true, fb:"Right. It has a legal threshold (≥ 2 g)." },
            { t:"Wholesome", fb:"The regulated claim has a legal threshold (≥ 2 g)." },
            { t:"Farm-fresh taste", fb:"The regulated claim has a legal threshold (≥ 2 g)." },
            { t:"Goodness inside", fb:"The regulated claim has a legal threshold (≥ 2 g)." }] },
        { id:"q3", goal:5, prompt:"Why did Canada add folic acid to white flour?",
          choices:[{ t:"To reduce neural tube defects in babies", ok:true, fb:"Right. Research linked folate to neural tube development." },
            { t:"To add flavour", fb:"Research linked folate to neural tube development." },
            { t:"To preserve flour", fb:"Research linked folate to neural tube development." },
            { t:"To lower Calories", fb:"Research linked folate to neural tube development." }] },
        { id:"q4", goal:5, prompt:"Frozen peas are…",
          choices:[{ t:"Minimally processed", ok:true, fb:"Right. Freezing preserves food without adding much." },
            { t:"Ultra-processed", fb:"Freezing preserves food without adding much." },
            { t:"Not food", fb:"Freezing preserves food without adding much." },
            { t:"Always unhealthy", fb:"Freezing preserves food without adding much." }] }
      ]
    }
  },
  practice:{
    activities:[
      // Activity 1 (custom N4 number entry with a choice for L5). Answers: number ranges; L7 accepts 6.8–7.0, L8 crackers 215–220.
      // Feedback lines are the plan's; correct-answer lines and hints for L1–L7 are module-written (L8 hints are the plan's).
      // VERIFY: the Daily Values (L2's "grams = %DV here" depends on the 100 g sugars DV).
      { id:"detective", type:"custom", title:"Label detective", summary:"Label detective", goal:[1, 2],
        instruction:"Work out each %DV or scaled amount. Use the Daily Values in the box.",
        how:"Type a number (the % sign is optional), then press Check.",
        use:DVBOX,
        items:[
          { id:"l1", goal:1, prompt:"Sodium 690 mg. %DV?", fields:[{ label:"%DV", unit:"%" }], answer:{ nums:[[30, 30]] }, display:"30%",
            wrong:[{ match:[6.9], fb:"Divide by 2300, then × 100." }], fb:"Divide by 2300, then × 100.", why:"690 ÷ 2300 = 0.3, so 30%: a lot.",
            hints:[PCT, "The sodium DV is 2300 mg: 690 ÷ 2300.", "690 ÷ 2300 = 0.3, so 30%."] },
          { id:"l2", goal:1, prompt:"Sugars 9 g. %DV?", fields:[{ label:"%DV", unit:"%" }], answer:{ nums:[[9, 9]] }, display:"9%",
            fb:"The sugars DV is 100 g, so grams = %DV here.", why:"9 ÷ 100 = 0.09, so 9%.",
            hints:[PCT, "The sugars DV is 100 g.", "9 ÷ 100 = 0.09, so 9%."] },
          { id:"l3", goal:1, prompt:"Fibre 7 g. %DV?", fields:[{ label:"%DV", unit:"%" }], answer:{ nums:[[25, 25]] }, display:"25%",
            fb:"7 ÷ 28 = 0.25.", why:"7 ÷ 28 = 0.25, so 25%: a lot.",
            hints:[PCT, "The fibre DV is 28 g: 7 ÷ 28.", "7 ÷ 28 = 0.25, so 25%."] },
          { id:"l4", goal:1, prompt:"Calcium 260 mg. %DV?", fields:[{ label:"%DV", unit:"%" }], answer:{ nums:[[20, 20]] }, display:"20%",
            fb:"260 ÷ 1300 = 0.2.", why:"260 ÷ 1300 = 0.2, so 20%.",
            hints:[PCT, "The calcium DV is 1300 mg: 260 ÷ 1300.", "260 ÷ 1300 = 0.2, so 20%."] },
          { id:"l5", goal:1, prompt:"Saturated + trans fat 1 g. %DV? A little or a lot?", fields:[{ label:"%DV", unit:"%" }],
            chips:[{ id:"little", t:"A little" }, { id:"between", t:"In between" }, { id:"lot", t:"A lot" }], chipLabel:"A little or a lot?",
            answer:{ nums:[[5, 5]], chip:"little" }, display:"5%, a little",
            fb:"1 ÷ 20 = 5%.", chipFb:"5% or less is a little.", why:"1 ÷ 20 = 0.05, so 5%: a little (5% or less).",
            hints:[PCT, "The saturated + trans fat DV is 20 g: 1 ÷ 20.", "1 ÷ 20 = 0.05, so 5%: a little."] },
          { id:"l6", goal:1, prompt:"Iron 3.6 mg. %DV?", fields:[{ label:"%DV", unit:"%" }], answer:{ nums:[[20, 20]] }, display:"20%",
            fb:"3.6 ÷ 18 = 0.2.", why:"3.6 ÷ 18 = 0.2, so 20%.",
            hints:[PCT, "The iron DV is 18 mg: 3.6 ÷ 18.", "3.6 ÷ 18 = 0.2, so 20%."] },
          { id:"l7", goal:2, prompt:"A yogurt’s serving is 175 g with 12 g sugars. Sugars per 100 g?", fields:[{ label:"Sugars per 100 g", unit:"g" }], answer:{ nums:[[6.8, 7.0]] }, display:"about 6.9 g",
            fb:"12 × 100 ÷ 175.", why:"12 × 100 ÷ 175 ≈ 6.9 g.",
            hints:["Scale from 175 g down to 100 g.", "Multiply 12 by 100 ÷ 175.", "12 × 100 ÷ 175 ≈ 6.9 g."] },
          { id:"l8", goal:2, prompt:"Chips: 150 Calories per 25 g. Crackers: 130 Calories per 30 g. Calories per 50 g for each?",
            fields:[{ label:"Chips, per 50 g", unit:"Calories" }, { label:"Crackers, per 50 g", unit:"Calories" }], answer:{ nums:[[300, 300], [215, 220]] }, display:"chips 300, crackers about 217",
            wrong:[{ match:[150, 130], fb:"Scale both to the same amount." }], fb:"Scale both to the same amount.", why:"Chips: 150 × 2 = 300. Crackers: 130 × 5/3 ≈ 216.7.",
            hints:["50 g is how many servings of each?", "Chips × 2; crackers × 5/3.", "300 and 216.7."] }
        ] },
      // Activity 2. Plan: choose 1 of 4, 6 items, ★ set (F3–F6). The plan gives the best answer and the most tempting wrong
      // answer (F4: all four chips); the other options, their feedback and the correct-answer lines are module-written.
      { id:"claims", type:"mc", title:"Processing and claims", summary:"Processing and claims", star:true, goal:[3, 4, 5, 6],
        instruction:"Six label puzzles. Choose the best answer. The ★ items are non-routine; the last two go beyond the Final Check.",   // module-written
        items:[
          { id:"f1", goal:4, prompt:"Apple juice says “no added sugar” and shows sugars 24 g (24% DV) per 250 mL. Which conclusion is best?",
            options:[
              { t:"It’s still a lot of sugars, naturally occurring", ok:true, why:M4 },
              { t:"It’s low in sugars", why:"“No added sugar” isn’t “low in sugars”." },
              { t:"The label must be wrong", why:"Both can be true: nothing was added, but juice is high in its own sugars." },
              { t:"24% of the juice is sugar", why:M2 }] },
          // VERIFY: the sugar grouping (F2)
          { id:"f2", goal:3, prompt:"A cereal’s ingredients begin: corn flour, sugars (sugar, glucose-fructose, honey), whole grain oats… What does the order tell you?",
            options:[
              { t:"The sugars group weighs more than the oats", ok:true, why:M5 },
              { t:"Oats are the main ingredient", why:"Ingredients are listed by weight; oats come after the sugars group." },
              { t:"Corn flour is the smallest ingredient", why:"The first ingredient weighs the most." },
              { t:"The ingredients are in alphabetical order", why:"Ingredients are listed by weight, not alphabetically." }] },
          // VERIFY: CFIA guidance on "natural" (F3)
          { id:"f3", goal:4, prompt:"★ A product claims “natural” and contains added vitamin C. Does the claim fit?",
            options:[
              { t:"The claim doesn’t fit CFIA’s guidance", ok:true, why:"“Natural” means no added vitamins or minerals, so added vitamin C conflicts with it." },
              { t:"That’s fine", why:"Added vitamins conflict with “natural”." },
              { t:"It fits, because vitamin C is healthy", why:"Health isn’t the test: “natural” means no added vitamins, minerals, additives or artificial flavours." },
              { t:"It fits only if the product is organic", why:"Organic is a separate claim." }] },
          { id:"f4", goal:2, prompt:"★ Two soups: A has 700 mg sodium per 250 mL; B has 490 mg per 175 mL. Which has less sodium per 250 mL?",
            options:[
              { t:"They’re equal", ok:true, why:"B is 700 mg per 250 mL too (490 × 250 ÷ 175 = 700)." },
              { t:"B has less", why:"B only looks lower because its serving is smaller." },
              { t:"A has less", why:"Scale B to 250 mL before you compare: 490 × 250 ÷ 175." },
              { t:"Can’t compare", why:M1 }],
            hints:["Scale B to 250 mL.", "490 × 250 ÷ 175.", "700 mg: equal."] },
          { id:"f5", goal:5, prompt:"★ A company removes partially hydrogenated oil and replaces it with palm oil. What should a label reader check?",
            options:[
              { t:"The saturated + trans fat line and its %DV", ok:true, why:"Palm oil is high in saturated fat, so the saturated + trans fat line can rise even as trans fat disappears." },
              { t:"Nothing, it’s trans-fat free", why:"Palm oil is high in saturated fat." },
              { t:"Only the Calories", why:"Swapping one oil for another changes the type of fat more than the Calories." },
              { t:"The sodium line", why:"Oils don’t add sodium. Check the fat lines." }] },
          { id:"f6", goal:2, prompt:"★ (Inquiry) You’ll compare the sodium in 5 brands of canned soup. Which method is fairest?",
            options:[
              { t:"Convert each brand’s sodium to the same amount (e.g. per 250 mL) and record the brand, date and source; then rank", ok:true, why:"The same amount for every brand makes the comparison fair, and the records let someone check it." },
              { t:"Compare the numbers per serving as printed", why:"Servings differ. " + M1 },
              { t:"Taste each soup and rank them by saltiness", why:"Taste isn’t a reliable measure of sodium." },
              { t:"Compare one brand’s %DV with another brand’s milligrams", why:"Use the same measure and the same amount for every brand." }] }
        ] },
      // Spot the Error. The plan's hint 3 ("Fix A.") names an option by letter; the build shuffles fixes, so hint 3 quotes the
      // fix instead. Wrong-fix feedback uses the plan's misconception sentences (E1 M1, E2 M2, E3 M3).
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Sapna", goal:[1, 2, 4], how:"",
        instruction:"Sapna made one mistake in each label analysis. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Which cereal has more fibre: Cereal B (5.5 g per 55 g) or Cereal A (4 g per 30 g)?",
            steps:["“Cereal B lists 5.5 g fibre; Cereal A lists 4 g.”", "“5.5 is more than 4, so Cereal B has more fibre.”", "“I’ll buy Cereal B for fibre.”"],
            answer:1, stepFb:["Step 1 reads the labels correctly.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"“Scale to the same amount: per 30 g, B has 3 g and A has 4 g, so A has more.”", ok:true, why:M1 },
              { t:"“Add the two servings.”", why:M1 },
              { t:"“Compare Calories instead.”", why:M1 },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Are the servings the same size?", "55 g vs 30 g.", "The fix: scale to the same amount. Per 30 g, B has 3 g and A has 4 g, so A has more."] },
          // VERIFY: "690 mg of 2300 mg" (E2 fix)
          { id:"e2", goal:1, task:"A soup shows sodium 30% DV. What does that mean?",
            steps:["“%DV compares to a daily reference value.”", "“So 30% of the soup’s weight is sodium.”", "“That’s why it tastes salty.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"“One serving provides 30% of the Daily Value for sodium (690 mg of 2300 mg), which is a lot (15% or more).”", ok:true, why:M2 },
              { t:"“30% means 30 g of sodium.”", why:M2 },
              { t:"“30% means the soup is 30% water.”", why:M2 },
              { t:"Step 2 is correct.", why:M2 }],
            hints:["Percent of what?", "Of the Daily Value.", "The fix: one serving provides 30% of the Daily Value for sodium (690 mg of 2300 mg), which is a lot."] },
          { id:"e3", goal:4, task:"A cracker box says “Natural multigrain”. Is it a whole-grain, low-sodium choice?",
            steps:["“The box says ‘natural’.”", "“‘Natural’ and ‘multigrain’ together mean whole grain and healthy.”", "“So I don’t need to check the label.”"],
            answer:1, stepFb:["Step 1 reads the box.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"“Neither word means whole grain or low sodium. Check the ingredient list for ‘whole grain’ and the sodium %DV.”", ok:true, why:M3 },
              { t:"“‘Natural’ means organic.”", why:M3 },
              { t:"“‘Multigrain’ means gluten-free.”", why:M3 },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What does “multigrain” guarantee?", "Only more than one grain.", "The fix: neither word means whole grain or low sodium. Check the ingredient list for “whole grain” and the sodium %DV."] }
        ] }
    ]
  },
  reflect:{
    blocks:[{ html:SUPPORT }],
    journal:[
      { id:"j1", q:"Which label trick surprised you most: serving sizes, sugar names, or claims like “natural”?" },
      { id:"j2", q:"In your own words, explain what “15% DV” tells you and why it’s useful." },
      { id:"j3", q:"Explain to a friend how to compare two cereals fairly in under a minute." },
      { id:"j4", q:"Which claim or label part are you still unsure about? How will you check it next time you shop?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7); correct-option lines without plan text are
    // module-written. VERIFY: every threshold and rule in the Final Check (plan: "marked (verify before release) in the build").
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"On a Nutrition Facts table, what does “5% DV” mean?", options:[
          { t:"One serving gives 5% of the Daily Value for that nutrient: a little", ok:true, why:"5% or less is a little." },
          { t:"5% of the food’s weight is that nutrient", why:M2 },
          { t:"You should eat 5 servings", why:"%DV isn’t a serving count." },
          { t:"It’s a lot of that nutrient", why:"15% or more is a lot." }] },
        b:{ prompt:"Which %DV means “a lot” of a nutrient?", options:[
          { t:"15% or more", ok:true, why:"15% or more is a lot; 5% or less is a little." },
          { t:"5% or less", why:"That’s a little." },
          { t:"Exactly 50%", why:"The guideline is 15%." },
          { t:"Any number with a % sign", why:"The guide is 5% and 15%." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Sodium is 460 mg per serving, and the DV is 2300 mg. What is the %DV?", options:[
          { t:"20%", ok:true, why:"460 ÷ 2300 = 0.2." },
          { t:"46%", why:"That reads mg as a percent." },
          { t:"2%", why:"Check the decimal." },
          { t:"5%", why:"That would be 115 mg." }] },
        b:{ prompt:"Fibre is 7 g per serving, and the DV is 28 g. What is the %DV?", options:[
          { t:"25%", ok:true, why:"7 ÷ 28 = 0.25." },
          { t:"7%", why:"That reads grams as a percent." },
          { t:"4%", why:"Invert the division." },
          { t:"50%", why:"That would be 14 g." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"How are ingredients ordered on a Canadian ingredient list?", options:[
          { t:"From greatest to least by weight, with sugar-based ingredients grouped together after “Sugars”", ok:true, why:M5 },
          { t:"Alphabetically", why:"By weight." },
          { t:"From least to greatest", why:"Greatest first." },
          { t:"Healthiest first", why:"By weight, not by health." }] },
        b:{ prompt:"Which nutrients does the front-of-package symbol flag?", options:[
          { t:"Saturated fat, sugars and sodium", ok:true, why:"It flags the three nutrients of concern." },
          { t:"Fibre, protein and iron", why:"Those are nutrients to get enough of." },
          { t:"Calories only", why:"It flags three nutrients of concern." },
          { t:"Vitamins A and C", why:"Not part of the symbol." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Crackers X: 120 mg sodium per 20 g. Crackers Y: 150 mg per 30 g. Which has less sodium per 60 g?", options:[
          { t:"Y (300 mg vs 360 mg)", ok:true, why:"Per 60 g: X is 120 × 3 = 360 mg; Y is 150 × 2 = 300 mg." },
          { t:"X, because 120 is less than 150", why:M1 },
          { t:"They’re equal", why:"Scale both: 360 vs 300." },
          { t:"Can’t compare different servings", why:"Scale to the same amount." }] },
        b:{ prompt:"Yogurt P: 12 g sugars per 175 g. Yogurt Q: 10 g sugars per 125 g. Which has less sugars per 100 g?", options:[
          { t:"P (about 6.9 g vs 8 g)", ok:true, why:"Per 100 g: P is 12 × 100 ÷ 175 ≈ 6.9 g; Q is 10 × 100 ÷ 125 = 8 g." },
          { t:"Q, because 10 is less than 12", why:M1 },
          { t:"They’re equal", why:"Scale them." },
          { t:"Can’t compare", why:"Scale to 100 g." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A juice says “no added sugar” and shows sugars 22% DV. Which conclusion is best?", options:[
          { t:"It has no added sugar, but it’s still high in naturally occurring sugars", ok:true, why:M4 },
          { t:"It’s low in sugars", why:M4 },
          { t:"The label must be wrong", why:"Both can be true." },
          { t:"22% means 22 g of added sugar", why:M2 }] },
        b:{ prompt:"A cereal says “source of fibre”. What is guaranteed?", options:[
          { t:"At least 2 g of fibre per reference amount and serving", ok:true, why:"“Source of fibre” is a nutrient-content claim with a 2 g threshold." },
          { t:"It’s whole grain", why:M3 },
          { t:"It’s low in sugars", why:"Fibre claims say nothing about sugars." },
          { t:"It has 15% DV fibre", why:"“Source” is a gram threshold, not 15%." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A soup (250 mL) has 330 mg sodium. With the 15% rule, will it show “High in sodium”?", options:[
          { t:"No: 330 ÷ 2300 is about 14%, under 15%", ok:true, why:"The cut-off is 345 mg (15% of 2300 mg)." },
          { t:"Yes: any soup with sodium shows the symbol", why:"Only at 15% or more." },
          { t:"Yes: 330 is over 300", why:"The cut-off is 345 mg." },
          { t:"No: soups are exempt", why:"Soups aren’t exempt." }] },
        b:{ prompt:"A snack bar has 3 g of saturated + trans fat (DV 20 g). Will it show “High in saturated fat”?", options:[
          { t:"Yes: 3 ÷ 20 = 15%, which meets the threshold", ok:true, why:"At or above 15% triggers the symbol." },
          { t:"No: 15% is the limit, so it must go over", why:"At or above 15% triggers it." },
          { t:"No: fat is never flagged", why:"Saturated fat is one of the three." },
          { t:"Only if it has trans fat", why:"Saturated and trans fat are counted together." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the clearest explanation of why Canada’s Food Guide says to limit highly processed foods?", options:[
          { t:"“Many highly processed foods are high in sodium, sugars or saturated fat, which most Canadians already eat too much of; processing itself isn’t automatically harmful.”", ok:true, why:"It gives the reason and avoids treating all processing as harmful." },
          { t:"“All processed food is poison.”", why:M6 },
          { t:"“Because additives are illegal.”", why:"Approved additives are legal." },
          { t:"“Because frozen vegetables lose all nutrients.”", why:"Freezing preserves most nutrients." }] },
        b:{ prompt:"Which sentence correctly explains fortification?", options:[
          { t:"“Adding nutrients to foods, such as vitamin D to milk or folic acid to white flour, to prevent deficiencies in the population.”", ok:true, why:"It defines fortification and gives two Canadian examples." },
          { t:"“Removing nutrients to make food last longer.”", why:"That’s the opposite." },
          { t:"“A kind of organic certification.”", why:"Unrelated." },
          { t:"“Adding sugar for taste.”", why:"That isn’t fortification." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which is the most accurate description of the claim “multigrain”?", options:[
          { t:"“The product contains more than one type of grain; it may or may not be whole grain.”", ok:true, why:M3 },
          { t:"“The product is whole grain.”", why:M3 },
          { t:"“The product is high in fibre.”", why:M3 },
          { t:"“The product is gluten-free.”", why:"Most grains contain gluten." }] },
        b:{ prompt:"Which statement about “natural” on Canadian labels is most accurate?", options:[
          { t:"“It means the food has no added vitamins or minerals, artificial flavours or additives, and wasn’t significantly altered. It doesn’t mean low in sugar or salt.”", ok:true, why:"That matches CFIA’s guidance." },
          { t:"“It means organic.”", why:M3 },
          { t:"“It means no sugar.”", why:M3 },
          { t:"“It has no meaning at all.”", why:"There’s CFIA guidance." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A student wants a breakfast with a functional-food ingredient and no “High in” nutrients. Which fits best?", options:[
          { t:"Overnight oats with ground flax and blueberries", ok:true, why:"Oats and flax are functional foods, with no high nutrients." },
          { t:"Frosted cereal with a sugary drink", why:"High in sugars." },
          { t:"An “immunity” juice alone", why:"Weak evidence and high in sugars." },
          { t:"Instant noodles", why:"Usually high in sodium." }] },
        b:{ prompt:"A family wants to add a food with an approved heart-health claim. Which label is best?", options:[
          { t:"An oat cereal carrying the approved oat-fibre cholesterol claim, with an amount per serving shown", ok:true, why:M7 },
          { t:"A drink labelled “supports wellness”", why:"Vague and unregulated." },
          { t:"Cookies labelled “natural”", why:M3 },
          { t:"Chips labelled “made with real potatoes”", why:"Not a health claim." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"An ad says a probiotic drink “boosts immunity”. How should a careful shopper respond?", options:[
          { t:"Look for approved claim wording and evidence for that specific strain; treat vague claims cautiously", ok:true, why:M7 },
          { t:"Believe it, because it’s sold in stores", why:M7 },
          { t:"Assume all probiotics are useless", why:"Evidence varies by strain." },
          { t:"Buy it only if it’s organic", why:"Organic status doesn’t test the claim." }] },
        b:{ prompt:"Omega-3 eggs cost twice as much as regular eggs. Which reasoning is best?", options:[
          { t:"They add some omega-3 fat; whether that’s worth the cost depends on the rest of your diet, such as eating fish", ok:true, why:"It weighs the real benefit against the cost and the rest of the diet." },
          { t:"They cure heart disease", why:M7 },
          { t:"They’re identical to regular eggs", why:"The omega-3 content differs." },
          { t:"Expensive means healthier", why:"Price doesn’t measure health." }] } }
    ]
  },
  task:{
    title:"Label-smart snack", summary:"Label-smart snack",
    statement:"<p>Combine exactly 3 ingredients into a snack that meets every condition. The lab builds its label as you go. More than one snack works; find as many as you can.</p>" +
      "<ol class=\"pl-conds\"><li>No “High in” symbol: saturated fat &lt; 3 g, sugars &lt; 15 g, sodium &lt; 345 mg (model 15% rule).</li><li>At least a “source of fibre”: fibre ≥ 2 g.</li><li>Includes at least one functional-food ingredient.</li><li>Snack-sized: 150–250 Calories, like most single-serve snacks on store shelves.</li><li>Includes a vegetable or fruit.</li></ol>",
    checks:["No “High in” symbol", "Source of fibre", "Functional ingredient", "Snack-sized", "Vegetable or fruit"],
    tips:["Cheese brings 6 g saturated fat on its own; bananas and honey push sugars up fast.", "Add oats, chia or flax for fibre.", "Oats, flax, chia, yogurt and walnuts count as functional.", "Too small? Add oats or walnuts. Too big? Swap to flax or blueberries.", "Add blueberries or a banana."],
    explainPrompt:"Explain how your label shows the snack meets each condition, and which functional ingredient you chose and why.",
    vocab:"Use %DV, front-of-package symbol, source of fibre and functional food.",
    checkLabel:"Check my snack",                       // module-written
    success:"This snack meets every condition.",       // module-written
    more:"There’s more than one answer. Can you find another?",
    // VERIFY: whole fruits are exempt from the symbol on real labels (after-3 note)
    after3:"Real labels exempt whole fruits from the symbol, but a mixed snack counts all its sugars, which is why banana plus honey fails here.",
    validMsg:"Choose exactly 3 ingredients. You have {n}.",   // module-written
    limits:{ sat:3, sug:15, na:345, fib:2, calLo:150, calHi:250 },
    // Model values per portion, rounded (plan table, labelled "model"). VERIFY: every value. al: allergen (peanut, tree nut, milk).
    ingredients:[
      { id:"oats", t:"Rolled oats", portion:"30 g", cal:110, sat:0.5, sug:0, na:0, fib:3, fn:"oat fibre", sec:"Whole grains" },
      { id:"flax", t:"Ground flaxseed", portion:"1 tbsp", cal:35, sat:0.5, sug:0, na:0, fib:2, fn:"fibre and plant omega-3", sec:"" },
      { id:"chia", t:"Chia seeds", portion:"1 tbsp", cal:60, sat:0.5, sug:0, na:0, fib:4, fn:"fibre", sec:"" },
      { id:"yogurt", t:"Plain yogurt 2%", portion:"175 g", cal:130, sat:2, sug:8, na:90, fib:0, fn:"live cultures", sec:"Protein foods", al:"milk", cold:true },
      { id:"blue", t:"Blueberries", portion:"1/2 cup", cal:40, sat:0, sug:7, na:0, fib:2, fn:"", sec:"Vegetables and fruits", vf:true },
      { id:"banana", t:"Banana", portion:"1 medium", cal:105, sat:0, sug:14, na:0, fib:3, fn:"", sec:"Vegetables and fruits", vf:true },
      { id:"crackers", t:"Whole-grain crackers", portion:"4", cal:90, sat:0.5, sug:1, na:150, fib:2, fn:"", sec:"Whole grains" },
      { id:"cheddar", t:"Cheddar cheese", portion:"30 g", cal:120, sat:6, sug:0, na:190, fib:0, fn:"", sec:"Protein foods", al:"milk", cold:true },
      { id:"pb", t:"Peanut butter", portion:"1 tbsp", cal:95, sat:1.5, sug:1.5, na:70, fib:1, fn:"", sec:"Protein foods", al:"peanut" },
      { id:"honey", t:"Honey", portion:"1 tsp", cal:20, sat:0, sug:6, na:0, fib:0, fn:"", sec:"" },
      { id:"walnuts", t:"Walnuts", portion:"2 tbsp", cal:100, sat:1, sug:0.5, na:0, fib:1, fn:"plant omega-3", sec:"Protein foods", al:"tree nut" }
    ],
    allergenNames:{ peanut:"peanut", "tree nut":"tree nut", milk:"milk" },
    // Kitchen card (plan): portions (E3.5), no-cook method or toasting the oats with oven safety, allergen notes with substitutions,
    // storage at 4 °C or colder for yogurt-based snacks (E2.4). VERIFY: sunflower seed butter substitution; storage line; oven steps.
    card:{
      noCook:"No-cook method: measure each ingredient, then combine in a bowl or container.",
      toast:"Optional: toast the oats on a baking sheet at 180 °C for 5 to 8 minutes. Use oven mitts, and let the pan cool before you touch it.",
      subs:{ peanut:"Peanut allergy: swap the peanut butter for sunflower seed butter.", "tree nut":"Tree nut allergy: swap the walnuts for pumpkin or sunflower seeds.", milk:"Milk allergy: choose a fortified soy yogurt or leave the cheese out." },
      cold:"Keep it at 4 °C or colder until you eat it.",
      prepare:"Prepare it in class or at home with an adult."
    }
  },
  cards:[
    ["Serving size", "The amount all the Nutrition Facts numbers refer to; compare products by the same amount."],
    ["% Daily Value (%DV)", "One serving’s nutrient amount as a percent of a daily reference: 5% or less a little, 15% or more a lot."],
    // VERIFY: cards 3–7 and 10 (sugar grouping; symbol date; claim thresholds; oat claim; CFIA "natural"; additive approval)
    ["Ingredient list", "Ingredients in descending order by weight; sugar-based ingredients grouped after “Sugars”."],
    ["Front-of-package symbol", "A magnifying glass marking foods “High in” saturated fat, sugars or sodium (mandatory by 2026)."],
    ["Nutrient-content claim", "A regulated claim with a threshold, e.g. “source of fibre” (≥ 2 g)."],
    ["Health claim", "A regulated statement linking a food to health, e.g. the oat fibre and cholesterol claim."],
    ["“Natural”", "No added vitamins, minerals, additives or artificial flavours, and not significantly altered (CFIA). Says nothing about sugar or salt."],
    ["“Multigrain”", "More than one type of grain; not necessarily whole grain."],
    ["Fortification", "Adding nutrients to foods, e.g. vitamin D in milk, folic acid in white flour."],
    ["Food additive", "A substance added for a purpose (preserving, thickening, colour), approved by Health Canada."],
    ["Highly processed (ultra-processed) food", "Industrially made foods, often high in sodium, sugars or saturated fat; Canada’s Food Guide advises limiting them."],
    ["Functional food", "A food with possible benefits beyond basic nutrition, e.g. oats (beta-glucan); the evidence varies."]
  ]
};
