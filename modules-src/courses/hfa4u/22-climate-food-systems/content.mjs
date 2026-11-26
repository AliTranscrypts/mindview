// HFA4U 22 Climate Change & Food Systems. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/22-climate-food-systems.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §1 and §6.5): footprints describe foods, not people; no diet is ranked; country foods are presented as
// central and threatened, never compared on carbon; the task requires both animal and plant dishes.
// VERIFY (plan §6.1): every chain value is a rounded model number built on the pattern in Poore & Nemecek (2018); the real
// means (beef about 100 kg CO₂e/kg, peas about 1) and the "about a third" share (Crippa et al., 2021) must be checked.
// VERIFY (plan §6.2): the heated-greenhouse row models fossil-fuel heating.
// VERIFY (plan §6.3): the Canada impacts levels are qualitative teaching levels; check against current Canadian climate
// assessments and adjust wording if needed.
// VERIFY (plan §6.4): R6 uses a model policy; name no specific federal target or regulation without checking it.

// Misconception core sentences (plan §3)
const M1 = "For most foods, transport is a small share; how the food is produced matters most. Air freight and heated greenhouses are the exceptions.";
const M2 = "Methane (cattle, rice, landfills) and nitrous oxide (fertilizer, manure) matter too, and both are far more powerful per kilogram than carbon dioxide.";
const M3 = "Plant foods are usually low, not zero. Flooded rice releases methane, and greenhouses use energy.";
const M4 = "One hot summer is weather. Climate is the average pattern over about 30 years.";
const M5 = "Some seasons get longer, but droughts, floods, heat and pests increase too.";
const M6 = "Mitigation cuts emissions. Adaptation copes with the impacts. Some actions do both.";
const M7 = "Footprints describe foods, not people. Choices depend on culture, cost, access and health; big changes come from farms, institutions and policy.";

// Stage names for the Chain view (plan table columns)
const STAGES = [
  { id:"land", t:"Land use" }, { id:"farm", t:"Farm" }, { id:"feed", t:"Animal feed" }, { id:"proc", t:"Processing" },
  { id:"trans", t:"Transport" }, { id:"retail", t:"Retail" }, { id:"pack", t:"Packaging" }
];

export default {
  id:"22-climate-food-systems",
  kind:"topic",
  title:"Climate change and food systems",
  topic:"Climate Change and Food Systems",
  readyTopic:"climate change and food systems",
  hero:{
    eq:"Food → emissions → warming → harvests", eqSize:"sm", eqLabel:"food, then emissions, then warming, then harvests, in a loop",
    headline:"The food system is both a cause and a victim of climate change",
    text:"Growing, processing, moving and wasting food releases <strong>carbon dioxide</strong>, <strong>methane</strong> and <strong>nitrous oxide</strong>. Together these come to about a third of human-caused emissions. Meanwhile <strong>droughts</strong>, <strong>floods</strong> and <strong>heat</strong> are already changing what farms can grow. You’ll follow emissions along the food chain, see how climate change reaches Canadian farms and northern communities, and weigh <strong>adaptation</strong> and <strong>mitigation</strong>.",
    fig:{ html:'<div class="cfs-hero" id="cfs-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A food chain runs left to right: a field, a barn, a truck, a store and a kitchen. Labelled puffs rise from the stages: CO₂, CH₄ and N₂O. They drift up into a thermometer that rises. An arrow loops back down to the field, which cracks in a drought and then floods. The final frame shows the loop labelled cause (emissions going up) and victim (impacts coming back to the farm).",
    // module-written caption (the reduced-motion final frame in words)
    caption:"Cause: every stage of the food chain releases greenhouse gases. Victim: the warming comes back to the farm as drought and flood."
  },
  goals:[
    "I can explain how food systems produce greenhouse gases (carbon dioxide, methane, nitrous oxide) at each stage.",
    "I can compare the life-cycle footprints of foods and explain why the type of food usually matters more than transport.",
    "I can explain how climate change affects food supply and production in Canada and around the world.",
    "I can tell adaptation from mitigation and evaluate strategies, including laws and policies.",
    "I can calculate and compare meal footprints from model data and describe the trade-offs respectfully.",
    "I can evaluate claims about food and climate using reliable evidence."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Greenhouse effect", goal:1,
          prompt:"Greenhouse gases warm the planet because they…",
          options:[
            { t:"trap some of the heat that Earth gives off, keeping it in the atmosphere", ok:true, why:"They let sunlight in but absorb outgoing heat." },
            { t:"make a hole in the ozone layer", why:"Ozone depletion is a separate issue." },
            { t:"block sunlight from reaching Earth", why:"That would cool the planet." },
            { t:"are hot gases released by fires", why:"Their effect isn’t about their own temperature." }],
          hints:["Sunlight comes in; heat goes out.", "Greenhouse gases absorb the outgoing heat.", "They trap heat."] },
        { id:"w2", skill:"Greenhouse effect", goal:1,
          prompt:"Which of these is a greenhouse gas?",
          options:[
            { t:"Methane (CH₄)", ok:true, why:"Methane traps heat strongly." },
            { t:"Oxygen (O₂)", why:"Oxygen doesn’t trap heat." },
            { t:"Nitrogen (N₂)", why:"N₂ makes up most of the air but doesn’t trap heat; nitrous oxide (N₂O) does." },
            { t:"Helium", why:"Not a greenhouse gas." }],
          hints:["Think of gases from cattle and landfills.", "CH₄.", "Methane."] },
        { id:"w3", skill:"Food supply chain", goal:2,
          prompt:"Put the stages in order for a loaf of bread: (1) store, (2) wheat farm, (3) bakery, (4) truck to store.",
          options:[
            { t:"2, 3, 4, 1", ok:true, why:"Farm → processing (bakery) → transport → retail." },
            { t:"2, 4, 3, 1", why:"The bakery comes before the truck to the store." },
            { t:"1, 2, 3, 4", why:"The store comes last." },
            { t:"3, 2, 4, 1", why:"Wheat must be grown before baking." }],
          hints:["Where does it start?", "Farm first.", "Farm, bakery, truck, store."] },
        { id:"w4", skill:"Food supply chain", goal:2,
          prompt:"Which stage of the food chain happens in your kitchen?",
          options:[
            { t:"Preparation, storage and (sometimes) waste at home", ok:true, why:"Households cook, store and sometimes throw out food." },
            { t:"Processing in a factory", why:"That’s before retail." },
            { t:"Retail", why:"That’s the store." },
            { t:"Land-use change", why:"That’s clearing land for farming." }],
          hints:["What happens after you buy food?", "You store, cook and sometimes waste it.", "Household stage."] },
        { id:"w5", skill:"Reading bar data", goal:2,
          prompt:"A bar chart shows Food P = 12 and Food Q = 3 (kg CO₂e per kg). How many times larger is P’s footprint?",
          options:[
            { t:"4 times", ok:true, why:"12 ÷ 3 = 4." },
            { t:"9 times", why:"12 − 3 = 9 is the difference, not the ratio." },
            { t:"3 times", why:"3 × 3 = 9, not 12." },
            { t:"36 times", why:"Divide to compare." }],
          hints:["“How many times” means divide.", "12 ÷ 3.", "4."] },
        { id:"w6", skill:"Reading bar data", goal:2,
          prompt:"A food’s total footprint is 10, and transport is 1 of that. What share is transport?",
          options:[
            { t:"10%", ok:true, why:"1 out of 10 = 10%." },
            { t:"1%", why:"1% would be 1 out of 100." },
            { t:"90%", why:"90% is everything <em>except</em> transport." },
            { t:"11%", why:"1 ÷ 9 is a different calculation." }],
          hints:["Share = part ÷ total.", "1 ÷ 10.", "10%."] }
      ],
      refreshers:{
        "Greenhouse effect":"Sunlight warms Earth; Earth gives off heat; greenhouse gases (carbon dioxide, methane, nitrous oxide) absorb some of that heat. More of these gases means more warming.",
        "Food supply chain":"Land use → farm → processing → transport → retail → household → (waste). Each stage uses energy or releases gases.",
        "Reading bar data":"Ratio = bigger ÷ smaller (“how many times”). Share = part ÷ total × 100%."
      }
    }
  },
  explore:{
    heading:"Emissions along the chain",
    intro:"Choose a food to see where its emissions come from. Then see how climate change reaches Canadian farms, and build a plan for a farm.",
    modes:[{ id:"chain", t:"Chain view" }, { id:"impacts", t:"Canada impacts" }, { id:"farm", t:"Farm plan" }],
    stages:STAGES,
    // Model data: Chain view (plan). kg CO₂e per kg of food; s = [land, farm, feed, processing, transport, retail, packaging].
    // VERIFY: model, rounded, based on the pattern in Poore & Nemecek (2018).
    foods:[
      { id:"beef", t:"Beef", s:[30.0, 60.0, 5.0, 2.0, 1.0, 1.0, 1.0], total:100.0, gas:"Methane" },
      { id:"cheese", t:"Cheese", s:[5.0, 13.0, 2.0, 3.0, 0.3, 0.4, 0.3], total:24.0, gas:"Methane" },
      { id:"chicken", t:"Chicken", s:[3.0, 2.5, 2.5, 1.0, 0.3, 0.3, 0.4], total:10.0, gas:"Carbon dioxide, nitrous oxide" },
      { id:"rice", t:"Rice", s:[0.0, 3.6, 0.0, 0.1, 0.1, 0.1, 0.1], total:4.0, gas:"Methane" },
      { id:"tofu", t:"Tofu", s:[1.0, 0.5, 0.0, 0.8, 0.2, 0.3, 0.2], total:3.0, gas:"Carbon dioxide" },
      { id:"peas", t:"Peas & lentils", s:[0.0, 0.6, 0.0, 0.1, 0.1, 0.0, 0.1], total:0.9, gas:"Nitrous oxide, carbon dioxide" },
      { id:"bananas", t:"Bananas (shipped by sea)", s:[0.0, 0.3, 0.0, 0.1, 0.3, 0.1, 0.1], total:0.9, gas:"Carbon dioxide" },
      { id:"berries", t:"Berries (air-freighted)", s:[0.0, 0.5, 0.0, 0.0, 9.0, 0.2, 0.3], total:10.0, gas:"Carbon dioxide" },
      { id:"tomGh", t:"Tomatoes, heated greenhouse", s:[0.0, 2.0, 0.0, 0.0, 0.1, 0.1, 0.2], total:2.4, gas:"Carbon dioxide" },
      { id:"tomField", t:"Tomatoes, field-grown and trucked", s:[0.0, 0.2, 0.0, 0.0, 0.3, 0.1, 0.1], total:0.7, gas:"Carbon dioxide" }
    ],
    chainNote:"Greenhouse footprints depend on the heating energy; greenhouses heated with low-carbon energy are much lower.",
    halfChip:"Transport is more than half",
    airCaption:"Air freight is the exception",
    // Model data: Canada impacts (plan; qualitative model levels for teaching). lv = [drought, flood, season, pests] per warming.
    // VERIFY: based on the kinds of risks described in Canadian climate assessments.
    warming:[{ id:"1", t:"+1 °C" }, { id:"2", t:"+2 °C" }, { id:"3", t:"+3 °C" }],
    regions:[
      { id:"prairies", t:"Prairies", lv:{ "1":["Medium", "Low", "Longer", "Medium"], "2":["High", "Medium", "Longer", "Medium"], "3":["High", "Medium", "Longer", "High"] } },
      { id:"ontario", t:"Southern Ontario", lv:{ "1":["Low", "Medium", "Longer", "Medium"], "2":["Medium", "Medium", "Longer", "High"], "3":["Medium", "High", "Longer", "High"] } },
      { id:"fraser", t:"Fraser Valley (BC)", lv:{ "1":["Low", "Medium", "Longer", "Low"], "2":["Medium", "High", "Longer", "Medium"], "3":["High", "High", "Longer", "Medium"] } },
      // Nunavut rows (plan): ice = how much shorter the sea-ice season is; access = access to country foods at risk; cost = store-food cost risk
      { id:"nunavut", t:"Nunavut", north:true, ice:{ "1":"moderate", "2":"large", "3":"very large" }, access:{ "1":"Medium", "2":"High", "3":"High" }, cost:{ "1":"Medium", "2":"High", "3":"High" } }
    ],
    risks:[{ id:"drought", t:"Drought risk", short:"Drought" }, { id:"flood", t:"Flood risk", short:"Flood" }, { id:"season", t:"Growing season", short:"Season" }, { id:"pests", t:"Pest pressure", short:"Pests" }],
    north:[{ id:"ice", t:"Sea-ice season", sub:"shorter" }, { id:"access", t:"Access to country foods at risk", sub:"hunting, fishing, travel on ice" }, { id:"cost", t:"Store-food cost risk", sub:"shipping season, supply disruptions" }],
    // Model data: Farm plan (plan; model effect sizes; effects add). e = emissions change (%), r = resilience points.
    farmTitle:"A model Prairie mixed farm (grain and cattle)",
    cards:[
      { id:"a", t:"4R fertilizer stewardship (right source, rate, time, place)", e:-10, r:0, type:"Mitigation" },
      { id:"b", t:"Cover crops with no-till", e:-10, r:2, type:"Both" },
      { id:"c", t:"Rotational grazing", e:-5, r:1, type:"Both" },
      { id:"d", t:"Feed additive that reduces cattle methane (model)", e:-15, r:0, type:"Mitigation" },
      { id:"e", t:"Solar panels for barns and grain dryers", e:-5, r:0, type:"Mitigation" },
      { id:"f", t:"Drought-tolerant varieties", e:0, r:2, type:"Adaptation" },
      { id:"g", t:"New irrigation reservoir (pumping energy)", e:5, r:3, type:"Adaptation" },
      { id:"h", t:"Crop insurance", e:0, r:1, type:"Adaptation" }
    ],
    dataLine:"Model data based on Poore & Nemecek (2018)",
    predIntro:"Make a prediction first. Then the model will show you.",   // module-written
    predictions:[
      { id:"p1", prompt:"Which stage makes up the largest part of beef’s footprint?",
        options:[{ t:"The farm (mostly methane from cattle)", ok:true }, { t:"Transport" }, { t:"Packaging" }, { t:"Retail refrigeration" }],
        explain:"Cattle digesting grass release methane. Land use is the second largest stage." },
      { id:"p2", prompt:"A tomato grown in a heated greenhouse nearby, or a field-grown tomato trucked 3000 km. Which has the smaller footprint in this model?",
        options:[{ t:"The field-grown, trucked tomato", ok:true }, { t:"The local greenhouse tomato" }, { t:"They’re equal" }, { t:"You can’t compare them" }],
        explain:"Heating a greenhouse can use more energy than trucking. Local isn’t automatically lower." },
      { id:"p3", prompt:"Rice is a plant. What will its footprint be?",
        options:[{ t:"Small but not zero; mostly methane from flooded fields", ok:true }, { t:"Zero, because plants absorb carbon dioxide" }, { t:"Larger than beef" }, { t:"The same as lentils" }],
        explain:"Flooded paddies release methane, so plant foods are low, not zero." },
      { id:"p4", prompt:"Move the warming to +3 °C. What happens to the Prairies’ risks?",
        options:[{ t:"The growing season gets longer, but drought and pest risks rise", ok:true }, { t:"Everything improves with a longer season" }, { t:"Nothing changes" }, { t:"Only flooding increases" }],
        explain:"A longer season doesn’t help much if water runs short and pests spread." }
    ],
    chalIntro:"Set the model, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",   // module-written
    challenges:[
      { id:"tc1", goal:2, prompt:"In Chain view, find the food where <strong>transport is more than half of the total footprint</strong>.",
        why:"Air freight is the big exception. For most foods, transport is a small share.",
        hints:["Compare each food’s transport bar with its total.", "Which foods travel by air?", "Berries (air-freighted): 9.0 of 10.0 is 90%."] },
      { id:"tc2", goal:3, prompt:"In Canada impacts, find the setting where <strong>drought risk and flood risk are both High</strong>.",
        why:"Fraser Valley at +3 °C: both High. More extremes in both directions.",   // plan hint 3 wording
        hints:["Find a region where flood risk becomes High first.", "The Fraser Valley floods at +2 °C. What happens to its drought risk as warming increases?", "Fraser Valley at +3 °C: both High. More extremes in both directions."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Farm plan: choose exactly 3 cards that <strong>cut emissions by at least 25%</strong> and reach <strong>resilience 3 or more</strong>.",
        why:"Which other answers can you find? Every answer uses card b.",
        hints:["Find a card that does both jobs.", "Card b (cover crops with no-till) gives −10% and +2. What else do you need?", "b + d gives −25% and resilience 2; add c, f or h for resilience (or swap d for a and c)."] }
    ],
    // Named wrong states (plan) and module-written fallbacks
    msgs:{
      tc1Mode:"Switch to Chain view and choose a food first.",                                     // module-written
      tc1Field:"Transport is this tomato’s largest stage (0.3 of 0.7), but that’s 43%, less than half.",
      tc1Bananas:"Transport is 0.3 of 0.9, a third.",
      tc1Beef:"Beef’s transport is 1 out of 100.",
      tc1Other:"This food’s transport share is {p}%, not more than half.",                          // module-written
      tc1Chip:"Berries it is. Now tap the “Transport is more than half” chip to confirm.",           // module-written
      tc2Mode:"Switch to Canada impacts first.",                                                   // module-written
      tc2Prairies:"Drought is High there, but flood risk is Medium.",
      tc2Ontario:"Flood risk is High, but drought is Medium.",
      tc2Fraser2:"Flood is High, but drought is still Medium.",
      tc2North:"Nunavut’s model shows sea ice and access to food, not drought and flood levels.",   // module-written
      tc2Other:"Here drought is {d} and flood is {f}. Find a setting where both are High.",          // module-written
      tc3Count:"Choose exactly 3 cards. You have {n}.",                                            // module-written
      tc3abd:"Emissions −35%, but resilience is only 2.",
      tc3bfg:"Resilience 7, but irrigation pumping adds emissions: only −5%.",
      tc3ade:"−30%, but resilience 0: all mitigation, no adaptation.",
      tc3Other:"This plan gives emissions {e} and resilience {r}. You need −25% or better and resilience 3 or more.",   // module-written
      full:"The tray holds 3 cards. Tap a chosen card to remove it first."                         // module-written
    },
    readLabels:{ food:"Food", total:"Total footprint", largest:"Largest stage", share:"Transport share", gas:"Main gas", region:"Region and warming", risks:"Risks", plan:"Farm plan", data:"Data" },
    blocks:[{ title:"What the model shows", html:"<ul><li>What you grow matters more than how far it travels: transport is a small share for most foods, with air freight the big exception.</li><li>Climate change brings more extremes, not just warmth.</li><li>Some actions both cut emissions and build resilience.</li></ul>" }]   // the plan's "aha"
  },
  part3:{
    slug:"footprints", name:"Plates", heading:"Plate footprints",
    // module-written intro from the plan's "why this activity suits the topic"
    intro:"Tap servings onto a plate and watch the footprint add up. Then compare the cafeteria dishes. This is about what an institution like a cafeteria can change, not a score for anyone’s own meals.",
    // Meal builder servings (plan): kg CO₂e per serving, model data from the Chain view table (per-kg value × serving size).
    // VERIFY: salmon, pork, milk and eggs have no Chain view row; their values are the plan's model numbers.
    servings:[
      { id:"beef", t:"Beef (100 g)", v:10.0 }, { id:"salmon", t:"Farmed salmon (100 g)", v:1.4 }, { id:"cheese", t:"Cheese (50 g)", v:1.2 },
      { id:"pork", t:"Pork (100 g)", v:1.2 }, { id:"chicken", t:"Chicken (100 g)", v:1.0 }, { id:"milk", t:"Milk (250 mL)", v:0.8 },
      { id:"eggs", t:"Eggs (2)", v:0.5 }, { id:"tofu", t:"Tofu (150 g)", v:0.5 }, { id:"rice", t:"Rice (1 cup cooked)", v:0.3 },
      { id:"bread", t:"Bread, tortilla or pastry crust (1 serving)", v:0.1 }, { id:"beans", t:"Beans, lentils or chickpeas (175 mL cooked)", v:0.1 },
      { id:"veg", t:"Vegetables (1 cup)", v:0.1 }, { id:"potato", t:"Potatoes (1 medium)", v:0.1 }, { id:"corn", t:"Corn or squash (1 cup)", v:0.1 }
    ],
    builderTitle:"Meal builder",                                                         // module-written
    builderAsk:"Tap <strong>Add serving</strong> to put food on the plate. The footprint adds up live.",   // module-written
    // Cafeteria dishes (plan; model; the same dishes as the performance task). f = footprint (kg CO₂e), cost ($), p = protein (g);
    // grp: animal or plant protein dish (task line 4).
    dishes:[
      { id:"1", t:"Beef chili", trad:"North American", f:10.3, cost:4, p:30, grp:"animal" },
      { id:"2", t:"Chicken shawarma bowl", trad:"Levantine", f:1.5, cost:4, p:30, grp:"animal" },
      { id:"3", t:"Chana masala with rice", trad:"South Asian", f:0.5, cost:2, p:15, grp:"plant" },
      { id:"4", t:"Tofu and vegetable stir-fry", trad:"East Asian", f:0.9, cost:3, p:20, grp:"plant" },
      { id:"5", t:"Bean and cheese burrito", trad:"Mexican", f:1.5, cost:3, p:22, grp:"animal" },
      { id:"6", t:"Salmon with potatoes", trad:"Pacific coast", f:1.5, cost:5, p:25, grp:"animal" },
      { id:"7", t:"Three Sisters soup (corn, beans, squash)", trad:"Haudenosaunee", f:0.3, cost:2, p:12, grp:"plant" },
      { id:"8", t:"Pork tourtière", trad:"Québécois", f:1.5, cost:3, p:20, grp:"animal" }
    ],
    dishTitle:"Cafeteria dishes",
    framing:"These numbers describe foods, not people. What we eat depends on culture, cost, access, health and taste. Institutions like cafeterias can change footprints at scale.",
    blocks:[
      // VERIFY: real per-kg values (beef herd about 100, peas about 1) and the APA details of all three references.
      { title:"Check it with data", html:"<p>Real per-kg values come from Poore & Nemecek (2018), as charted by Our World in Data. For example: beef (beef herd) about 100 kg CO₂e/kg; peas about 1.</p><p>Food systems’ share: about a third of human-caused greenhouse-gas emissions (Crippa et al., 2021).</p><p><strong>Country foods:</strong> Inuit and other northern communities rely on harvested foods such as caribou, seal and Arctic char. These are local, nutrient-rich and culturally central, and aren’t in most footprint tables. Climate change threatens access to them.</p>" +
        '<h4>References (APA 7)</h4><ul class="hfa-refs"><li>Crippa, M., Solazzo, E., Guizzardi, D., Monforti-Ferrario, F., Tubiello, F. N., & Leip, A. (2021). Food systems are responsible for a third of global anthropogenic GHG emissions. <i>Nature Food, 2</i>(3), 198–209.</li><li>Poore, J., & Nemecek, T. (2018). Reducing food’s environmental impacts through producers and consumers. <i>Science, 360</i>(6392), 987–992.</li><li>Ritchie, H., Rosado, P., & Roser, M. (2022). <i>Environmental impacts of food production</i>. Our World in Data.</li></ul>' }
    ],
    quickCheck:{
      title:"Plate footprints quick check", summary:"Plate footprints quick check",
      // Correct-choice lines are module-written ("Right." + the worked value).
      items:[
        { id:"q1", goal:5, prompt:"Model: chicken (1.0) + rice (0.3) + vegetables (0.1). The plate’s footprint?",
          choices:[{ t:"1.4", ok:true, fb:"Right. 1.0 + 0.3 + 0.1 = 1.4." }, { t:"1.3", fb:"Add the three servings." }, { t:"0.14", fb:"Add the three servings." }, { t:"14", fb:"Add the three servings." }] },
        { id:"q2", goal:5, prompt:"Replacing beef chili (10.3) with chana masala (0.5) cuts the footprint by…",
          choices:[{ t:"9.8", ok:true, fb:"Right. 10.3 − 0.5 = 9.8." }, { t:"10.8", fb:"10.3 − 0.5 = 9.8." }, { t:"0.5", fb:"10.3 − 0.5 = 9.8." }, { t:"20.6", fb:"10.3 − 0.5 = 9.8." }] },
        { id:"q3", goal:2, prompt:"Which statement is accurate?",
          choices:[{ t:"Per serving, beef’s footprint is far larger than lentils’", ok:true, fb:"Right. 10.0 vs 0.1 per serving in the model." },
            { t:"Lentils have zero footprint", fb:"Lentils are low, not zero (M3); transport is small (M1); footprints describe foods (M7)." },
            { t:"Footprints rank people", fb:"Lentils are low, not zero (M3); transport is small (M1); footprints describe foods (M7)." },
            { t:"Transport makes beef high", fb:"Lentils are low, not zero (M3); transport is small (M1); footprints describe foods (M7)." }] },
        { id:"q4", goal:3, prompt:"Why aren’t country foods like caribou in most footprint tables?",
          choices:[{ t:"Most life-cycle studies cover commercially farmed foods", ok:true, fb:"Right. Harvested foods are local and rarely studied in these tables." },
            { t:"They have no nutrients", fb:"Harvested foods are local and rarely studied in these tables." },
            { t:"They’re imported", fb:"Harvested foods are local and rarely studied in these tables." },
            { t:"They have huge footprints", fb:"Harvested foods are local and rarely studied in these tables." }] }
      ]
    }
  },
  practice:{
    activities:[
      // Activity 1 (plan): tap-to-sort, 8 items. Correct-placement "why" lines are module-written; hints only for item 7 (plan).
      { id:"gas", type:"sorter", title:"Which gas?", summary:"Which gas?", goal:1, noun:"source", txt:true,
        instruction:"Sort each source into the greenhouse gas it mainly releases.",   // module-written
        boxes:[{ id:"co2", label:"Carbon dioxide", sub:"CO₂" }, { id:"ch4", label:"Methane", sub:"CH₄" }, { id:"n2o", label:"Nitrous oxide", sub:"N₂O" }],
        wrongDefault:"Ask: burning fuel or clearing land (CO₂)? Digestion or rotting without air (CH₄)? Nitrogen in soil (N₂O)?",
        items:[
          { id:"i1", t:"Cattle digesting grass", answer:"ch4", why:"Cattle digestion releases methane.", wrong:{ co2:"Cattle digestion produces methane." } },
          { id:"i2", t:"Flooded rice paddies", answer:"ch4", why:"Flooded fields have no air in the soil, so microbes make methane." },
          { id:"i3", t:"Synthetic nitrogen fertilizer on fields", answer:"n2o", why:"Extra nitrogen in soil becomes nitrous oxide.", wrong:{ co2:"Nitrogen fertilizer releases nitrous oxide from soil." } },
          { id:"i4", t:"Clearing forest to make pasture", answer:"co2", why:"Clearing land releases the carbon stored in trees and soil." },
          { id:"i5", t:"Diesel tractors and trucks", answer:"co2", why:"Burning fuel releases carbon dioxide." },
          { id:"i6", t:"Food waste rotting in a landfill", answer:"ch4", why:"Without oxygen, buried food makes methane.", wrong:{ co2:"Without oxygen, buried food makes methane." } },
          { id:"i7", t:"Manure spread on fields", answer:"n2o", why:"Nitrogen in manure becomes nitrous oxide in soil.", hints:["Manure contains nitrogen.", "Nitrogen in soil becomes which gas?", "Nitrous oxide."] },
          { id:"i8", t:"Natural gas heating a greenhouse", answer:"co2", why:"Burning natural gas for heat releases carbon dioxide." }
        ] },
      // Activity 2 (plan): number entry (R1–R4) and choices (R5–R6), 6 items, ★ non-routine set (R3–R6).
      // R4 is entered as a menu chip plus a number. module-written: hints for R1, R2, R5 and R6; R5's and R6's other options
      // and their feedback lines; every "why" line on a correct answer; the general feedback lines.
      // VERIFY (plan, R5): "about 38 700 farms" in Poore & Nemecek (2018).
      { id:"reason", type:"custom", title:"Footprint reasoning", summary:"Footprint reasoning", star:true, goal:[2, 4, 5, 6],
        instruction:"Use the model values to answer each question. Items R3 to R6 are non-routine (★).",   // module-written
        how:"Type a number or choose an answer, then press Check. Each item has three levels of help.",
        items:[
          { id:"r1", kind:"num", n:"R1", goal:5, prompt:"Model: tofu’s total is 3.0 and its transport is 0.2. Transport share, to the nearest whole percent?",
            label:"Transport share:", unit:"%", answer:7, why:"0.2 ÷ 3.0 × 100% ≈ 6.7%, which rounds to 7%.",
            wrong:[{ match:0.2, fb:"Share = 0.2 ÷ 3.0 × 100%." }, { match:0.07, fb:"Share = 0.2 ÷ 3.0 × 100%." }], general:"Share = 0.2 ÷ 3.0 × 100%, then round to a whole percent.",
            hints:["Share = part ÷ total × 100%.", "0.2 ÷ 3.0 = 0.067.", "0.067 × 100% ≈ 6.7%, so 7%."] },
          { id:"r2", kind:"num", n:"R2", goal:5, prompt:"Model: a burrito plate has cheese (1.2), beans (0.1), a tortilla (0.1) and vegetables (0.1). Footprint?",
            label:"Footprint:", unit:"kg CO₂e", answer:1.5, why:"1.2 + 0.1 + 0.1 + 0.1 = 1.5.",
            wrong:[{ match:1.4, fb:"Count all four servings." }], general:"Add all four servings.",
            hints:["Add every serving on the plate.", "There are four servings: 1.2, 0.1, 0.1 and 0.1.", "1.2 + 0.3 = 1.5."] },
          { id:"r3", kind:"num", n:"R3", star:true, goal:2, prompt:"Model: a winter tomato from a heated local greenhouse (2.4) vs a field tomato trucked 3000 km (0.7). How many times larger is the greenhouse tomato’s footprint, to one decimal?",
            label:"Times larger:", unit:"times", answer:3.4, why:"2.4 ÷ 0.7 ≈ 3.4. " + M1,
            wrong:[{ match:1.7, fb:"That’s the difference. Divide 2.4 ÷ 0.7." }], general:"“How many times” means divide: 2.4 ÷ 0.7, to one decimal.",
            hints:["“How many times” means divide.", "2.4 ÷ 0.7.", "About 3.4 times."] },
          { id:"r4", kind:"menu", n:"R4", star:true, goal:5, prompt:"Two model menus. Menu X: beef chili + chana masala + Three Sisters soup. Menu Y: chicken shawarma + tofu stir-fry + chana masala. Which has the smaller total footprint, and by how much?",
            menus:[{ id:"X", t:"Menu X" }, { id:"Y", t:"Menu Y" }], label:"Smaller by:", unit:"kg CO₂e",
            answer:{ menu:"Y", by:8.2 }, why:"X = 11.1 and Y = 2.9, so Y is smaller by 8.2.",
            wrongMenu:"Add each menu: X = 10.3 + 0.5 + 0.3 = 11.1; Y = 1.5 + 0.9 + 0.5 = 2.9.",
            general:"Y is the smaller menu. Subtract the two totals: 11.1 − 2.9.",   // module-written
            hints:["Add each menu’s three dishes.", "X = 11.1; Y = 2.9.", "Y is smaller by 8.2."] },
          { id:"r5", kind:"mc", n:"R5", star:true, inquiry:true, goal:6,
            prompt:"You want reliable evidence on food footprints. Rank from most to least reliable: (a) a peer-reviewed review combining about 38 700 farms’ data (Poore & Nemecek, 2018); (b) a beef-industry ad saying “beef is climate-friendly”; (c) a plant-milk ad saying “the greenest choice ever”; (d) a viral post with no sources.",
            options:[
              { t:"a, then b and c (both commercial, tied), then d", ok:true, why:"Ads have a selling purpose, whatever they sell; peer-reviewed data with stated methods comes first; unsourced posts can’t be checked." },
              { t:"a, then c, then b, then d", why:"Ads have a selling purpose, whatever they sell; peer-reviewed data with stated methods comes first; unsourced posts can’t be checked." },
              { t:"b, then a, then c, then d", why:"Ads have a selling purpose, whatever they sell; peer-reviewed data with stated methods comes first; unsourced posts can’t be checked." },
              { t:"d, then a, then b and c (tied)", why:"Ads have a selling purpose, whatever they sell; peer-reviewed data with stated methods comes first; unsourced posts can’t be checked." }],
            hints:["Who made each source, and why?", "Both ads are selling something; a post with no sources can’t be checked.", "Peer-reviewed data first, the two ads tied, the unsourced post last."] },
          { id:"r6", kind:"mc", n:"R6", star:true, goal:4,
            prompt:"A province offers payments for 4R fertilizer stewardship and cover crops (model policy). Predict its effects on emissions, yields and farm resilience.",
            options:[
              { t:"Emissions fall (less nitrous oxide); yields stay about the same; resilience rises with cover crops", ok:true, why:"4R cuts nitrous oxide without cutting the fertilizer a crop needs, and cover crops protect soil and hold moisture." },
              { t:"Emissions fall, but yields collapse", why:"4R means using the right amount, not none; cover crops protect soil." },
              { t:"No effect on emissions, yields or resilience", why:"Both actions cut emissions in the model." },
              { t:"Emissions rise, because cover crops need more fertilizer", why:"Both actions cut emissions in the model." }],
            hints:["What does each action do in the Farm plan model?", "4R: −10%, resilience 0. Cover crops with no-till: −10%, resilience +2.", "Emissions fall, yields stay about the same, and resilience rises."] }
        ] },
      // Spot the Error (plan). Correct-fix "why" lines are module-written; wrong fixes use the plan's lines or M1/M4.
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Wanjiru", goal:[2, 3, 5], how:"",
        instruction:"Wanjiru made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Which tomato has the lower footprint in the model?",
            steps:["“The greenhouse tomato is grown nearby, so its transport is only 0.1.”", "“The trucked tomato travels 3000 km, so its transport is 0.3.”", "“Less transport means a lower footprint, so the greenhouse tomato is lower.”", "“Local food is always better for the climate.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Compare totals: heating gives the greenhouse tomato 2.4 vs the field tomato’s 0.7, so the field tomato is lower here.”", ok:true, why:M1 },
              { t:"“Transport is the only stage that matters.”", why:"Production (heating) is a bigger stage here." },
              { t:"“They’re equal because both are tomatoes.”", why:"Their totals differ: 2.4 vs 0.7." },
              { t:"Step 3 is correct.", why:"Totals decide it, not one stage." }],
            hints:["Which stage is biggest for the greenhouse tomato?", "The farm stage: heating, 2.0.", "Compare totals: 2.4 vs 0.7."] },
          { id:"e2", goal:3, task:"Is the Prairies’ climate getting drier?",
            steps:["“Climate means the average weather pattern over about 30 years.”", "“Last summer was cool and wet on my uncle’s farm.”", "“So the Prairies’ climate isn’t getting drier.”", "“Farmers don’t need to plan for drought.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 states a fact.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“One summer is weather. To judge climate, compare decades of averages and projections, which show rising drought risk.”", ok:true, why:M4 },
              { t:"“Wet summers prove the climate is getting wetter.”", why:"One summer can’t show a trend either way." },
              { t:"“Climate and weather mean the same thing.”", why:M4 },
              { t:"Step 3 is correct.", why:"Step 3 uses one summer to judge a 30-year pattern." }],
            hints:["How long is “climate”?", "About 30 years of averages.", "One summer is weather."] },
          { id:"e3", goal:5, task:"Footprint of a 100 g beef serving (model: 100.0 kg CO₂e per kg).",
            steps:["“The model value is 100.0 kg CO₂e per kilogram of beef.”", "“100 g is 0.1 kg.”", "“So the serving’s footprint is 100.0 × 100 = 10 000 kg CO₂e.”", "“That’s more than a car emits in a year.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Multiply by the mass in kilograms: 100.0 × 0.1 = 10.0 kg CO₂e.”", ok:true, why:"The model value is per kilogram, so use the mass in kilograms." },
              { t:"“Divide 100.0 by 100 = 1.0.”", why:"Dividing by 100 treats 100 g as 1/100 kg; it’s 1/10." },
              { t:"“100.0 × 1 = 100.0.”", why:"That’s a whole kilogram." },
              { t:"Step 3 is correct.", why:"Grams and kilograms are mixed up." }],
            hints:["Which unit does the model value use?", "Per kilogram, so convert 100 g to 0.1 kg.", "10.0 kg CO₂e."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: how small transport usually is, or how much footprints differ between foods?" },
      { id:"j2", q:"In your own words, what’s the difference between adaptation and mitigation? Give one farm example of each." },
      { id:"j3", q:"Explain to a friend why “eat local” isn’t always the lowest-carbon choice, without making anyone feel judged about what they eat." },
      { id:"j4", q:"Which climate impact on Canadian food (Prairie drought, BC floods, northern sea ice) would you most like to research? What source would you start with?" }
    ]
  },
  final:{
    // Values are model data unless a source is named. Correct-option lines for C1 (A and B) and C2 (A and B) are module-written.
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which greenhouse gas is released mainly when cattle digest grass?", options:[
          { t:"methane", ok:true, why:"Cattle digestion releases methane." },
          { t:"carbon dioxide", why:"Methane, not CO₂, comes from cattle digestion." },
          { t:"nitrous oxide", why:"That comes mainly from fertilizer and manure in soil." },
          { t:"oxygen", why:"Oxygen isn’t a greenhouse gas." }] },
        b:{ prompt:"Which greenhouse gas comes mainly from nitrogen fertilizer and manure in soils?", options:[
          { t:"nitrous oxide", ok:true, why:"Soil microbes release N₂O from extra nitrogen." },
          { t:"methane", why:"That’s from cattle, rice and landfills." },
          { t:"carbon dioxide", why:"CO₂ comes mainly from fuel and land clearing." },
          { t:"nitrogen gas", why:"N₂ isn’t a greenhouse gas." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which is an example of <strong>adaptation</strong> rather than mitigation?", options:[
          { t:"planting drought-tolerant crop varieties", ok:true, why:"It helps farms cope with drought." },
          { t:"using 4R fertilizer stewardship", why:"That cuts nitrous oxide: mitigation." },
          { t:"putting solar panels on barns", why:"That cuts emissions: mitigation." },
          { t:"a feed additive that reduces cattle methane", why:"That’s mitigation." }] },
        b:{ prompt:"Which is an example of <strong>mitigation</strong>?", options:[
          { t:"sending less food waste to landfill, so less methane forms", ok:true, why:"It cuts emissions." },
          { t:"building flood barriers around farmland", why:"That’s adaptation." },
          { t:"buying crop insurance", why:"That’s adaptation." },
          { t:"planting drought-tolerant varieties", why:"That’s adaptation." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which statement describes <strong>climate</strong> rather than weather?", options:[
          { t:"“Over the last 30 years, average Prairie summers have become drier.”", ok:true, why:"A long-term average pattern." },
          { t:"“It rained 40 mm in Regina yesterday.”", why:"One day is weather." },
          { t:"“Last July was unusually hot in Winnipeg.”", why:"One month is weather." },
          { t:"“A storm will hit Calgary tomorrow.”", why:"A forecast is weather." }] },
        // VERIFY: the B-version trend statements (Ontario growing seasons, Arctic sea ice since the 1980s, temperatures since 1948).
        b:{ prompt:"Which statement describes <strong>weather</strong> rather than climate?", options:[
          { t:"“A hailstorm damaged canola fields near Saskatoon last week.”", ok:true, why:"One event is weather." },
          { t:"“Growing seasons in southern Ontario have lengthened over decades.”", why:"That’s a climate trend." },
          { t:"“The Arctic sea-ice season has shortened since the 1980s.”", why:"A long-term trend: climate." },
          { t:"“Average Canadian temperatures have risen since 1948.”", why:"A long-term trend: climate." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Model: peas & lentils have a total of 0.9 with transport 0.1; beef has a total of 100.0 with transport 1.0. Which statement is correct?", options:[
          { t:"Transport is a bigger <em>share</em> for peas (about 11%) than for beef (1%), but beef’s total footprint is over 100 times larger", ok:true, why:"Shares and totals tell different stories." },
          { t:"Beef’s transport (1.0) is bigger, so transport explains beef’s high footprint", why:"1.0 of 100.0 is only 1%." },
          { t:"Peas have a larger footprint because their transport share is larger", why:"Their total is 0.9 vs 100.0." },
          { t:"Both have the same transport share", why:"11% vs 1%." }] },
        b:{ prompt:"Model: a heated local greenhouse tomato totals 2.4 (transport 0.1); a trucked field tomato totals 0.7 (transport 0.3). Which statement is correct?", options:[
          { t:"The trucked tomato has more transport but a lower total, so local isn’t automatically lower", ok:true, why:"Heating outweighs trucking here." },
          { t:"The greenhouse tomato is lower because it’s local", why:"2.4 > 0.7." },
          { t:"They’re equal because both are tomatoes", why:"Totals differ." },
          { t:"Transport decides which is lower", why:"The farm stage (heating) decides it here." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Model values per serving: chicken 1.0, rice 0.3, vegetables 0.1. A plate has chicken, rice and <strong>two</strong> servings of vegetables. What’s its footprint?", options:[
          { t:"1.5", ok:true, why:"1.0 + 0.3 + 0.1 + 0.1 = 1.5." },
          { t:"1.4", why:"That counts only one vegetable serving." },
          { t:"1.3", why:"That leaves out the vegetables." },
          { t:"2.4", why:"Check the addition: 1.0 + 0.3 + 0.2." }] },
        b:{ prompt:"Model values per serving: beef 10.0, bread 0.1, cheese 1.2, vegetables 0.1. A burger has beef, a bun (bread), cheese and one serving of vegetables. Its footprint?", options:[
          { t:"11.4", ok:true, why:"10.0 + 0.1 + 1.2 + 0.1 = 11.4." },
          { t:"10.0", why:"That’s the beef alone." },
          { t:"11.3", why:"Count all four items." },
          { t:"1.14", why:"Check the decimal: 10.0 + 1.4 = 11.4." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"In the model, the Fraser Valley at +3 °C shows High drought <strong>and</strong> High flood risk. What does this suggest for farms there?", options:[
          { t:"Farms need plans for both extremes, such as water storage for dry spells and drainage for floods", ok:true, why:"More extremes in both directions." },
          { t:"Floods and droughts cancel out, so nothing changes", why:"They happen at different times; both do damage." },
          { t:"A warmer climate only brings a longer, better season", why:"Risks rise alongside the longer season." },
          { t:"Only flood planning matters", why:"Drought risk is High too." }] },
        b:{ prompt:"In the model, Nunavut’s sea-ice season gets much shorter at +3 °C. What is the most direct effect on food?", options:[
          { t:"Harder, riskier hunting and travel for country foods, plus shipping disruptions that raise store-food costs", ok:true, why:"Both access routes are affected." },
          { t:"More wheat can be grown, so food security improves", why:"Soils and growing conditions remain very limited." },
          { t:"No effect, because stores sell food", why:"Store food arrives by ship and air, and costs rise." },
          { t:"Only acceptability changes", why:"Access and cost change most." }] } },
      { id:"c1", cat:"C", goal:[2, 6],
        a:{ prompt:"Which sentence best describes footprint data <strong>without judging people</strong>?", options:[
          { t:"“In life-cycle studies, a serving of beef has a much larger footprint than a serving of lentils; what people eat also depends on culture, cost, access and health.”", ok:true, why:"It states the data about foods and names what shapes people’s choices." },
          { t:"“People who eat beef are harming the planet.”", why:"Footprints describe foods, not people." },
          { t:"“Lentils have zero emissions.”", why:"Low, not zero." },
          { t:"“Footprint data proves local food is always best.”", why:"Production matters more than distance." }] },
        b:{ prompt:"Which caption best explains the Chain view bar for beef?", options:[
          { t:"“Most of beef’s footprint comes from the farm (methane from cattle) and land use; transport is about 1%.”", ok:true, why:"It names the two biggest stages and the small transport share." },
          { t:"“Beef’s footprint is mainly from long-distance shipping.”", why:"Transport is 1 of 100." },
          { t:"“Beef’s footprint is mostly packaging.”", why:"Packaging is 1 of 100." },
          { t:"“Beef has a footprint because it’s stored in fridges.”", why:"Retail is 1 of 100." }] } },
      { id:"c2", cat:"C", goal:[1, 4],
        a:{ prompt:"Which is the clearest description of how a government policy could cut food-system emissions while protecting food supply?", options:[
          { t:"“Supporting farmers to use fertilizer at the right source, rate, time and place reduces nitrous oxide while keeping yields steady.”", ok:true, why:"It names the policy, the gas it cuts and the effect on food supply." },
          { t:"“Banning all fertilizer at once cuts emissions with no effect on food supply.”", why:"Yields would drop sharply: a trade-off ignored." },
          { t:"“Government policies can’t affect farm emissions.”", why:"Targets, programs and rules can." },
          { t:"“Only individual diets can change emissions.”", why:"Farm practices and institutions matter greatly." }] },
        b:{ prompt:"Which best explains the effect of a rule requiring landfills to capture methane?", options:[
          { t:"“Methane from rotting food is captured instead of released, cutting emissions, though preventing food waste in the first place is still better.”", ok:true, why:"It explains the effect and its limit." },
          { t:"“It stops food from being wasted.”", why:"It deals with waste after it happens." },
          { t:"“It cuts carbon dioxide from trucks.”", why:"It targets methane at landfills." },
          { t:"“It has no effect on greenhouse gases.”", why:"Captured methane isn’t released." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A cafeteria wants to replace <strong>beef chili</strong> (10.3 kg, $4, 30 g protein) with a dish that keeps protein at 30 g and costs no more. Which choice cuts the footprint most while meeting both conditions?", options:[
          { t:"Chicken shawarma bowl (1.5 kg, $4, 30 g): cuts 8.8 kg", ok:true, why:"Same protein and cost." },
          { t:"Chana masala with rice (0.5 kg, $2, 15 g)", why:"Biggest cut, but protein drops to 15 g." },
          { t:"Bean and cheese burrito (1.5 kg, $3, 22 g)", why:"Protein drops to 22 g." },
          { t:"Salmon with potatoes (1.5 kg, $5, 25 g)", why:"Costs more and has less protein." }] },
        b:{ prompt:"A cafeteria wants to replace <strong>salmon with potatoes</strong> (1.5 kg, $5, 25 g) with a dish that has at least 20 g protein, costs less and has a smaller footprint. Which works?", options:[
          { t:"Tofu and vegetable stir-fry (0.9 kg, $3, 20 g)", ok:true, why:"Meets all three conditions." },
          { t:"Chana masala with rice (0.5 kg, $2, 15 g)", why:"Protein is below 20 g." },
          { t:"Pork tourtière (1.5 kg, $3, 20 g)", why:"Cheaper, but the footprint isn’t smaller." },
          { t:"Bean and cheese burrito (1.5 kg, $3, 22 g)", why:"Same footprint." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"A Prairie farm faces more droughts. Which single action helps it <strong>adapt and also cuts emissions</strong> (Farm plan model)?", options:[
          { t:"Cover crops with no-till (−10%, +2 resilience)", ok:true, why:"Holds soil moisture and stores carbon." },
          { t:"A new irrigation reservoir (+5%, +3)", why:"Adapts, but pumping adds emissions." },
          { t:"A methane feed additive (−15%, 0)", why:"Cuts emissions but doesn’t build drought resilience." },
          { t:"Crop insurance (0%, +1)", why:"Financial adaptation only." }] },
        b:{ prompt:"Which action <strong>cuts emissions but adds no drought resilience</strong> (Farm plan model)?", options:[
          { t:"A feed additive that reduces cattle methane (−15%, 0)", ok:true, why:"Mitigation only." },
          { t:"Cover crops with no-till (−10%, +2)", why:"That does both." },
          { t:"Drought-tolerant varieties (0%, +2)", why:"Adaptation only." },
          { t:"Rotational grazing (−5%, +1)", why:"That does a little of both." }] } }
    ]
  },
  task:{
    title:"Three-day cafeteria menu", summary:"Three-day cafeteria menu",
    statement:"<p>Plan the main dish for three days in a school cafeteria. Choose exactly three different dishes that meet every condition. Can you find all the answers?</p><p class=\"tiny muted\">Tap dish chips to put them on the tray. The tray shows the totals for footprint, cost and protein (model data).</p>",
    checks:["Total footprint 3.0 kg CO₂e or less", "Total cost $10 or less", "Total protein 60 g or more", "At least one animal-protein dish and at least one plant-protein dish", "Exactly three different dishes"],
    tips:["Beef chili alone is 10.3, so it can’t fit under 3.0.", "Cheaper dishes free up budget: chana masala and Three Sisters soup cost $2.", "Protein adds up fast with shawarma (30 g) or salmon (25 g).", "Mix: at least one dish from each protein group.", "Three dishes only."],
    explainPrompt:"Explain how you balanced footprint, cost and protein, and how your menu respects different food traditions.",
    vocab:"Use the words footprint, trade-off, protein and life-cycle.",
    success:"This menu meets every condition.",                     // module-written
    more:"There are three answers. Can you find them all?",         // module-written (plan: exactly 3 valid answers)
    after3:"Each answer pairs a protein-rich animal dish with two lower-footprint plant dishes. A menu can lower its footprint while still including animal foods and several food traditions.",
    validMsg:"Put at least one dish on the tray."                   // module-written
  },
  cards:[
    // VERIFY: card 1 (Crippa et al., 2021)
    ["Food systems’ share of emissions", "About a third of human-caused greenhouse gases (Crippa et al., 2021)."],
    ["Methane (CH₄)", "From cattle digestion, flooded rice and food rotting in landfills; traps heat strongly."],
    ["Nitrous oxide (N₂O)", "From nitrogen fertilizer and manure in soil; very powerful per kilogram."],
    ["Carbon dioxide (CO₂)", "From burning fuel and clearing land (e.g. diesel tractors, forest clearing)."],
    ["Life-cycle assessment", "Counting emissions at every stage: land, farm, feed, processing, transport, retail, packaging."],
    ["kg CO₂e", "All greenhouse gases converted to the warming effect of carbon dioxide."],
    ["Transport share", "Usually small (beef: about 1% in the model); air freight is the exception."],
    ["Adaptation", "Coping with impacts: drought-tolerant crops, water storage, drainage, insurance."],
    ["Mitigation", "Cutting emissions: 4R fertilizer use, methane reduction, less food waste."],
    ["4R nutrient stewardship", "Right source, right rate, right time, right place for fertilizer."],
    ["Weather vs climate", "Weather: one day or season. Climate: the average pattern over about 30 years."],
    ["Country foods and sea ice", "A shorter sea-ice season makes hunting and travel harder and raises northern food costs."]
  ]
};
