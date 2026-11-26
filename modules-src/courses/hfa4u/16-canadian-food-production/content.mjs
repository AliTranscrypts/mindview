// HFA4U 16 Canadian Food Production. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/16-canadian-food-production.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §6): the ingredient table, shock table and tomato bars are simplified teaching data (labelled "model
// data" on screen); supply management is presented neutrally (mechanics and trade-offs only; positions only in the journal);
// farm labour is discussed factually and respectfully.
// VERIFY (plan §6.1, applies to the whole module): regional product facts (Saskatchewan's share of pulses, Quebec's share of
// maple syrup, Leamington's greenhouse cluster); CFIA origin-claim rules and wording; the supply-management description; the
// seasonal worker programs and the 2020 delays; the November 2021 BC floods; the food-miles and air-freight evidence; the
// January sources of lettuce.

// Misconception core sentences (plan §3), "(verify)" flags moved to these comments.
// VERIFY: M1 "mainly from the US and Mexico"; M3 the CFIA rule; M7 seasonal and temporary foreign workers.
const M1 = "Canada grows a lot, but in winter most fresh fruit and many fresh vegetables are imported, mainly from the US and Mexico. Stored crops like apples and potatoes, and greenhouse produce, fill some of the gap.";
const M2 = "Supply management covers dairy, poultry and eggs. It works through production quotas, import controls and cost-based farm prices. It keeps prices stable, not low.";
const M3 = "“Product of Canada” means all or virtually all of the major ingredients, processing and labour are Canadian. Food made here from imported ingredients must say so: “Made in Canada from imported ingredients”.";
const M4 = "For most foods, how they’re grown or raised produces more emissions than trucking or shipping them. Air freight is the big exception. Local has other benefits, but it isn’t automatically lower-carbon.";
const M5 = "Prairie crops become flour, oats, lentils and animal feed. When harvests fall, prices can rise for shoppers across the country.";
const M6 = "Storage, freezing, greenhouses and trade keep food available. Quality depends on handling, not on the passport.";
const M7 = "Many farms, especially fruit, vegetable and greenhouse operations, depend on seasonal and temporary foreign workers. Their working conditions are part of the food system.";

// The model's claim names (Part 3 station 1, quick check, Spot the Error)
const PC = "“Product of Canada”", DI = "“Made in Canada from domestic and imported ingredients”", IM = "“Made in Canada from imported ingredients”";

export default {
  id:"16-canadian-food-production",
  kind:"topic",
  title:"Canadian food production",
  topic:"Canadian Food Production",
  readyTopic:"Canadian food production",
  hero:{
    headline:"Every plate has a map",
    text:"Canada’s <strong>food-producing regions</strong> each grow what their climate, soil and water allow. <strong>Supply management</strong>, <strong>trade</strong> and the <strong>people who work on farms</strong> decide what reaches the store and what it costs. Then a drought, a flood or a border delay can redraw the map overnight.",
    fig:{ html:'<div class="cf-hero" id="cf-hero"></div>', caption:"" },
    // module-written description of the plan's storyboard
    aria:"A map of Canada with five glowing regions: Pacific, Prairies, Central, Atlantic and North. A lunch tray beside it holds bread, cheese, an apple and a salad. Lines run from the bread to the Prairies, the cheese to Ontario and Quebec, the apple to the Okanagan Valley and the lettuce to Ontario. The month flips from August to January: the lettuce’s line swings south to California and becomes dashed (imported), while the apple’s line stays put (stored).",
    // module-written caption: both months' origins as text (the reduced-motion final frame)
    caption:"August: bread from the Prairies, cheese from Ontario and Quebec, the apple from the Okanagan Valley, lettuce from Ontario. January: the lettuce is imported from California; the apple is stored."
  },
  goals:[
    "I can describe Canada’s main food-producing regions and explain how climate, soil and water shape what each produces.",
    "I can explain how supply management and trade shape what’s in Canadian stores and what it costs.",
    "I can predict how a shock (drought, flood, labour shortage, disease, border delay) affects food supply and prices, and who is affected.",
    "I can explain what “Product of Canada” and “Made in Canada” claims mean on a label.",
    "I can evaluate local and global food-distribution systems for food security and the environment.",
    "I can plan a meal from Canadian, in-season foods and explain the trade-offs."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Canada’s geography", goal:1,
          prompt:"Which region of Canada grows most of the country’s wheat and canola?",
          options:[
            { t:"The Prairies (Alberta, Saskatchewan, Manitoba)", ok:true, why:"Flat land, deep soils and a growing season long enough for grains and oilseeds." },
            { t:"Atlantic Canada", why:"Atlantic Canada is known for fisheries, potatoes and wild blueberries." },
            { t:"The North", why:"The growing season there is too short for field grains." },
            { t:"Southern British Columbia", why:"BC’s valleys favour fruit, berries and greenhouse crops." }],
          // VERIFY: Saskatchewan's share of Canada's wheat (hint 2)
          hints:["Think of the wide, flat farmland in the middle of the country.", "Saskatchewan alone grows a large share of Canada’s wheat.", "The Prairies."] },
        { id:"w2", skill:"Canada’s geography", goal:1,
          prompt:"Why can southern Ontario grow peaches and grapes while most of Canada can’t?",
          options:[
            { t:"The Great Lakes moderate the temperature, giving a longer frost-free season", ok:true, why:"The Niagara region sits between two lakes that slow spring and fall frosts." },
            { t:"The soil is the only reason", why:"Soil matters, but tender fruit needs enough frost-free days." },
            { t:"Ontario gets the most rain in Canada", why:"Coastal BC gets more rain." },
            { t:"Greenhouses cover the whole region", why:"Niagara’s tender fruit grows outdoors." }],
          hints:["What’s special about the Niagara peninsula’s location?", "Large lakes hold heat.", "Lake effect: a longer frost-free season."] },
        { id:"w3", skill:"The food system", goal:2,
          prompt:"Which list follows food from the land to you, in order?",
          options:[
            { t:"Farm → processing → distribution → retail → consumer", ok:true, why:"That’s the food system’s supply chain." },
            { t:"Consumer → retail → farm → processing", why:"That runs backwards." },
            { t:"Farm → consumer → processing → retail", why:"Processing happens before food reaches stores." },
            { t:"Processing → farm → retail → consumer", why:"Raw food comes from farms first." }],
          hints:["Where does food start?", "It’s grown, then changed, then moved.", "Farm, processing, distribution, retail, consumer."] },
        { id:"w4", skill:"The food system", goal:3,
          prompt:"A frost destroys half of a region’s apple blossoms in spring. What is the most likely effect that fall?",
          options:[
            { t:"Fewer local apples and higher prices for them", ok:true, why:"Less supply with the same demand pushes prices up." },
            { t:"More apples, because trees recover", why:"Lost blossoms mean lost fruit that year." },
            // VERIFY: Canada's in-season apple production
            { t:"No effect, because apples are imported", why:"Canada grows many apples in season." },
            { t:"Lower prices", why:"Lower supply usually means higher prices." }],
          hints:["Blossoms become fruit.", "Less fruit, same number of shoppers.", "Fewer apples, higher price."] },
        { id:"w5", skill:"Reading origin information", goal:4,
          prompt:"A bag of frozen blueberries says “Product of Chile”. What does that tell you?",
          options:[
            { t:"Where the blueberries were grown and packed", ok:true, why:"Origin labels tell you where the food comes from." },
            { t:"That they are lower quality", why:"Origin says nothing about quality." },
            { t:"That they are organic", why:"Organic needs its own certification logo." },
            { t:"That they were air-freighted", why:"Frozen fruit usually travels by ship or truck." }],
          hints:["What question does an origin label answer?", "Where it’s from.", "Grown and packed in Chile."] },
        { id:"w6", skill:"Reading origin information", goal:5,
          prompt:"Which is a reason some people choose locally grown food?",
          options:[
            { t:"To support nearby farms and keep money in the local economy", ok:true, why:"That’s a common, well-founded reason." },
            { t:"Because local food is always cheaper", why:"Local food can cost more or less depending on the season and the farm." },
            { t:"Because local food never needs packaging", why:"Many local foods are packaged too." },
            { t:"Because local food always has the lowest emissions", why:"How food is grown often matters more than distance." }],
          hints:["Which answer is true every time?", "Check “always” and “never”.", "Supporting local farms."] }
      ],
      refreshers:{
        "Canada’s geography":"The Prairies grow grains, oilseeds, pulses and beef. Ontario and Quebec have dairy, poultry, eggs, field crops and fruit and vegetables. BC has fruit, berries, seafood and greenhouses. The Atlantic provinces have fisheries, potatoes and wild blueberries. The North has short summers and relies on harvested foods and shipped groceries.",
        "The food system":"Farm → processing → distribution → retail → consumer, with waste and recovery at every step. A change at one link travels down the chain.",
        "Reading origin information":"An origin label tells you where a food comes from: not its quality, safety or emissions."
      }
    }
  },
  explore:{
    heading:"Farm-to-table Canada",
    intro:"Tap a region to see what it produces. Then build a meal, switch the month, and see where every ingredient comes from. Finally, hit the system with a shock and watch what changes.",
    modes:[{ id:"region", t:"Region explorer" }, { id:"trace", t:"Meal trace" }, { id:"shock", t:"Shock mode" }],
    months:[{ id:"jan", t:"January" }, { id:"aug", t:"August" }],
    sections:[{ id:"vf", t:"Vegetables and fruits" }, { id:"grain", t:"Whole grains" }, { id:"protein", t:"Protein foods" }, { id:"other", t:"Other" }],
    // Region explorer cards (plan). VERIFY: every regional fact on these cards (plan: all marked "verify before release").
    regions:[
      { id:"pac", t:"Pacific (BC)", short:"Pacific", lead:"Products",
        products:[{ t:"Tree fruit in the Okanagan Valley (apples, cherries)" }, { t:"Berries in the Fraser Valley" }, { t:"Seafood (salmon, shellfish)" }, { t:"Greenhouse vegetables" }],
        why:"Mild coastal climate, valleys, ocean." },
      { id:"pra", t:"Prairies", short:"Prairies", lead:"Products",
        products:[{ t:"Wheat, canola, barley, oats" }, { t:"Pulses such as lentils and peas (Saskatchewan)" }, { t:"Beef cattle (Alberta)" }],
        why:"Flat land, deep fertile soils, long summer days.", risk:"Drought." },
      // P2's reveal badges dairy, chicken, turkey and eggs (sm:true); the plan's "poultry" is shown as chicken and turkey.
      { id:"cen", t:"Central (Ontario and Quebec)", short:"Central", lead:"Products",
        products:[{ t:"Dairy", sm:true }, { t:"Poultry: chicken", sm:true }, { t:"Poultry: turkey", sm:true }, { t:"Eggs", sm:true }, { t:"Pork" }, { t:"Corn and soybeans" },
          { t:"Fruit and vegetables (Niagara tender fruit, Holland Marsh vegetables)" }, { t:"Greenhouse vegetables (Leamington)" }, { t:"Maple syrup (Quebec produces most of the world’s supply)" }],
        why:"The Great Lakes and St. Lawrence moderate the climate; large markets nearby." },
      { id:"atl", t:"Atlantic", short:"Atlantic", lead:"Products",
        products:[{ t:"Fisheries (lobster, snow crab)" }, { t:"Potatoes (PEI, New Brunswick)" }, { t:"Wild blueberries (Nova Scotia, New Brunswick)" }],
        why:"Ocean access, sandy soils, cool climate." },
      { id:"nor", t:"North", short:"North", lead:"Food sources",
        products:[{ t:"Country foods (caribou, Arctic char, seal, berries) harvested by Indigenous communities" }, { t:"Groceries flown or shipped in" }, { t:"A few community greenhouses" }],
        why:"A short, cool growing season and permafrost.",
        more:"Modules 19 and 20 look at food in the North in more depth." }   // module-written wording of the plan's "Leads to modules 19 and 20"
    ],
    smBadge:"supply-managed",
    // Model ingredient table (plan; simplified teaching data). origin codes: ca = Canada, stored, frozen, us = imported (US).
    // VERIFY: the general patterns before release (plan).
    ingredients:[
      { id:"bread", t:"Whole-wheat bread", short:"bread", sec:"grain", reg:"pra", jan:"ca", aug:"ca" },
      { id:"oats", t:"Rolled oats", short:"oats", sec:"grain", reg:"pra", jan:"ca", aug:"ca" },
      { id:"rice", t:"Brown rice", short:"brown rice", sec:"grain", reg:"", jan:"us", aug:"us" },
      { id:"lentils", t:"Lentils", short:"lentils", sec:"protein", reg:"pra", jan:"ca", aug:"ca" },
      { id:"beef", t:"Beef", short:"beef", sec:"protein", reg:"pra", jan:"ca", aug:"ca" },
      { id:"chicken", t:"Chicken", short:"chicken", sec:"protein", reg:"cen", jan:"ca", aug:"ca" },
      { id:"eggs", t:"Eggs", short:"eggs", sec:"protein", reg:"cen", jan:"ca", aug:"ca" },
      { id:"yogurt", t:"Plain yogurt", short:"yogurt", sec:"protein", reg:"cen", jan:"ca", aug:"ca" },
      { id:"salmon", t:"Salmon", short:"salmon", sec:"protein", reg:"pac", jan:"ca", aug:"ca" },
      { id:"potatoes", t:"Potatoes", short:"potatoes", sec:"vf", reg:"atl", jan:"stored", aug:"ca" },
      { id:"apples", t:"Apples", short:"apples", sec:"vf", reg:"cen", jan:"stored", aug:"ca" },
      { id:"blueberries", t:"Wild blueberries (frozen)", short:"wild blueberries", sec:"vf", reg:"atl", jan:"frozen", aug:"ca" },
      { id:"lettuce", t:"Lettuce", short:"lettuce", sec:"vf", reg:"cen", jan:"us", aug:"ca" },
      { id:"strawberries", t:"Strawberries", short:"strawberries", sec:"vf", reg:"cen", jan:"us", aug:"ca" },
      { id:"oranges", t:"Oranges", short:"oranges", sec:"vf", reg:"", jan:"us", aug:"us" },
      { id:"maple", t:"Maple syrup", short:"maple syrup", sec:"other", reg:"cen", jan:"ca", aug:"ca" }
    ],
    origins:{ ca:"Canada", stored:"Canada (stored)", frozen:"Canada (frozen)", us:"Imported (US)" },
    // Model shock effects (plan: teaching numbers, not forecasts). when: "imported" applies the change only to ingredients
    // imported in the chosen month; "aug" applies it only in August (plan's "In January" / "In August" columns; see report).
    // VERIFY: the November 2021 BC floods example.
    shocks:[
      { id:"none", t:"None" },
      { id:"drought", t:"Prairie drought", eff:[{ id:"bread", v:18 }, { id:"oats", v:15 }, { id:"lentils", v:15 }, { id:"beef", v:8, note:"feed costs" }],
        who:"Prairie farmers; then shoppers everywhere" },
      { id:"flood", t:"Flood cuts BC highway and rail links", eff:[{ id:"salmon", v:5, note:"delayed reaching the rest of Canada" }, { id:"oranges", v:4, note:"in BC stores" }, { id:"rice", v:4, note:"in BC stores" }],
        who:"BC shoppers and exporters (a real example: the November 2021 BC floods)" },
      { id:"border", t:"Border slowdown for US trucks", when:"imported", eff:[{ id:"lettuce", v:20 }, { id:"strawberries", v:20 }, { id:"oranges", v:10 }, { id:"rice", v:3 }],
        who:"Shoppers buying imported produce" },
      { id:"labour", t:"Farm labour shortage", when:"aug", eff:[{ id:"strawberries", v:15 }, { id:"lettuce", v:10 }, { id:"apples", v:10 }],
        who:"Hand-harvested crops; grains barely change",
        offNote:"This model applies the labour shortage in August, during the harvest." },   // module-written
      { id:"avian", t:"Avian influenza in poultry flocks", eff:[{ id:"eggs", v:12 }, { id:"chicken", v:8 }],
        who:"Poultry farmers and egg buyers" }
    ],
    // P4 emissions bars (plan: "for the heated greenhouse, the growing bar is longest (model)"). Bar lengths are unitless
    // module-chosen model values. VERIFY: food-miles and air-freight evidence; studies vary.
    tomato:{ title:"Tomatoes: where do the emissions come from?",
      items:[{ id:"gh", t:"Greenhouse tomatoes, heated, 50 km away", grow:84, trans:3 }, { id:"field", t:"Field tomatoes, trucked 3000 km, in season", grow:24, trans:12 }],
      parts:{ grow:"growing", trans:"transport", total:"emissions" } },
    // module-written note (plan §6.2)
    modelNote:"Simplified teaching data: real supply chains are more mixed (for example, some winter lettuce is grown in Canadian greenhouses).",
    predIntro:"Make a prediction first. Then the map will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Switch to January. Where will the lettuce in an Ontario grocery store most likely come from?",
        options:[{ t:"The US (California or Arizona)", ok:true }, { t:"Ontario fields" }, { t:"Northern Canada" }, { t:"It disappears from stores" }],
        // VERIFY: winter lettuce mostly trucked from the southwestern US
        explain:"In winter, most fresh lettuce in Canadian stores is trucked from the southwestern US. Some Canadian greenhouse lettuce exists, but field lettuce can’t grow here in January." },
      { id:"p2", prompt:"Which of these foods is supply-managed in Canada?",
        options:[{ t:"Milk", ok:true }, { t:"Wheat" }, { t:"Apples" }, { t:"Lentils" }],
        // VERIFY: supply-management description
        explain:"Supply management covers dairy, poultry and eggs: farmers hold production quotas, imports above set amounts face high tariffs, and farm prices are based on production costs." },
      { id:"p3", prompt:"Which ingredient’s model price rises most?",
        options:[{ t:"Whole-wheat bread", ok:true }, { t:"Chicken" }, { t:"Apples" }, { t:"Maple syrup" }],
        explain:"Wheat comes from the Prairies, so the drought hits bread hardest. Shoppers in Halifax feel a drought in Saskatchewan." },
      { id:"p4", prompt:"Tomatoes from a heated greenhouse 50 km away vs field tomatoes trucked 3000 km in season. Which usually has lower greenhouse-gas emissions?",
        options:[{ t:"It depends: how they’re grown often matters more than the distance", ok:true }, { t:"The local ones, always" }, { t:"The trucked ones, always" }, { t:"They’re always equal" }],
        // VERIFY: air freight exception; studies vary (plan)
        explain:"Transport is usually a small share of a food’s emissions. Heating a greenhouse in winter can outweigh a long truck trip. Air-freighted food is the big exception (studies vary)." }
    ],
    chalIntro:"Set the map, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 6], prompt:"It’s January. Build a 4-ingredient lunch that is 100% Canadian.",
        why:"Every one of your 4 ingredients is Canadian in January, stored and frozen foods included.",   // module-written
        hints:["Switch the month first, then check each chip’s origin.", "Stored and frozen foods (potatoes, apples, frozen blueberries) stay Canadian in winter.", "Example: bread, chicken, potatoes, apples."] },
      { id:"tc2", goal:[1, 6], prompt:"In the “summer salad” (lettuce, strawberries, apples, potatoes), find the two ingredients whose origin changes between August and January. Leave only those two in your meal.",
        why:"Lettuce and strawberries are Canadian in August but imported in January. Stored apples and potatoes stay Canadian.",   // module-written
        hints:["Toggle the month and watch which lines turn dashed.", "Which items can’t be stored for months?", "Lettuce and strawberries."] },
      { id:"tc3", goal:[3, 6], stretch:true,
        prompt:"Shock mode, January, Prairie drought on. Build a 5-ingredient dinner that has at least 4 Canadian ingredients, no Prairie ingredients, and at least one item from each plate section (vegetables and fruits, whole grains, protein foods).",
        why:"Real food systems spread risk by buying from many regions. That’s one argument for diverse supply chains, local and global.",
        hints:["Which Canadian whole grains aren’t from the Prairies?", "None in this model, so your whole grain has to be your one import.", "Brown rice, salmon, potatoes, apples, yogurt."] }
    ],
    // Named wrong states (plan) and module-written fallbacks
    msgs:{
      count4:"Choose exactly 4 ingredients. You have {n}.",                       // module-written
      count5:"Choose exactly 5 ingredients. You have {n}.",                       // module-written
      janImp:"Those are Canadian in August, but imported in January.",
      allYear:"Those are imported all year.",
      tc2Apples:"Stored Canadian apples carry the supply through winter.",
      tc2Potatoes:"Potatoes store well for months.",
      tc2Other:"Use only the summer salad’s ingredients: lettuce, strawberries, apples and potatoes.",   // module-written
      tc2Missing:"Keep both ingredients whose origin changes. Toggle the month and watch which lines turn dashed.",   // module-written
      prairieGrain:"Every Canadian whole grain in this model comes from the Prairies.",
      prairieOther:"Lentils and beef come from the Prairies too. This dinner needs zero Prairie ingredients.",   // module-written
      twoImports:"Two imports: you only have room for one.",
      sections:"Check the plate-sections row.",
      full:"Your meal already has 5 ingredients. Tap one to remove it first."     // module-written
    },
    readLabels:{ ca:"Canadian ingredients", imp:"Imported", regions:"Regions represented", secs:"Plate sections", prairie:"Prairie ingredients", shock:"Shock effect", who:"Who is affected first" },
    blocks:[{ title:"What the map shows", html:"<ul><li>Where a food comes from depends on the region <strong>and</strong> the month.</li><li>A shock’s damage depends on where your food comes from.</li><li>In this model, every Canadian whole grain comes from the Prairies, so a Prairie drought reaches every plate.</li></ul>" }]
  },
  part3:{
    slug:"meal-origin", name:"Origins", heading:"Where did this meal come from?",
    // module-written intro (from the plan's "why this activity suits the topic")
    intro:"The map showed where food grows. Now look at what labels and distribution systems tell shoppers: decode origin claims on five product cards, compare a local and a national and global food system, and place Ontario foods on a seasonal wheel.",
    stations:[{ id:"claims", t:"1. Decode the origin claim" }, { id:"grid", t:"2. Two ways to get food to people" }, { id:"wheel", t:"3. In season in Ontario" }],
    claims:{
      title:"Station 1: decode the origin claim",
      ask:"Tap the claim each product may carry. Open <strong>Check it with data</strong> to see its ingredients.",
      // VERIFY: CFIA wording of each rule before release (plan)
      rules:[
        { id:"pc", t:"Product of Canada", rule:"All or virtually all major ingredients, processing and labour are Canadian. Small amounts of ingredients not grown here (e.g. spices, vitamins) may be imported." },
        { id:"di", t:"Made in Canada from domestic and imported ingredients", rule:"The last substantial change happened in Canada, using a mix of ingredients." },
        { id:"im", t:"Made in Canada from imported ingredients", rule:"The last substantial change happened in Canada, with imported main ingredients." }
      ],
      // Practice-model cards (plan). Ingredient rows and all feedback are module-written from the plan's card text and rules.
      cards:[
        { id:"c1", t:"Apple juice", html:"Apple juice from Ontario apples, pressed and packed in Ontario.", answer:"pc",
          data:[["Apples (main ingredient)", "Ontario, Canada"], ["Pressed and packed", "Ontario, Canada"]],
          why:"Its main ingredient, processing and labour are all Canadian.",
          wrong:{ di:"Every major ingredient here is Canadian, so there is no imported part to name.", im:"The apples are from Ontario, not imported." } },
        { id:"c2", t:"Cookies", html:"Cookies baked in Quebec from Canadian flour with imported cocoa and sugar.", answer:"di",
          data:[["Wheat flour", "Canada"], ["Sugar", "Imported"], ["Cocoa", "Imported"], ["Baked and packed", "Quebec, Canada"]],
          why:"They were made here from a mix of Canadian and imported major ingredients.",
          wrong:{ pc:"Sugar and cocoa are major ingredients, and they’re imported. " + M3, im:"The flour is Canadian, so the ingredients are a mix." } },
        { id:"c3", t:"Pasta", html:"Pasta made in Saskatchewan from Canadian durum wheat.", answer:"pc",
          data:[["Durum wheat (main ingredient)", "Canada"], ["Made and packed", "Saskatchewan, Canada"]],
          why:"Its main ingredient, processing and labour are all Canadian.",
          wrong:{ di:"Every major ingredient here is Canadian, so there is no imported part to name.", im:"The durum wheat is Canadian, not imported." } },
        // VERIFY: the plan's note that coffee may instead carry a specific claim such as "roasted in Canada".
        { id:"c4", t:"Coffee", html:"Coffee roasted in Vancouver from imported beans.", answer:"im",
          data:[["Coffee beans (main ingredient)", "Imported"], ["Roasted and packed", "Vancouver, Canada"]],
          why:"It was roasted here, but its main ingredient is imported. It could also carry a specific claim such as “Roasted in Canada”.",
          wrong:{ pc:"Coffee beans aren’t grown in Canada. " + M3, di:"Nothing major in it is Canadian: the beans are imported." } },
        { id:"c5", t:"Frozen fish sticks", html:"Frozen fish sticks breaded in Nova Scotia from imported fish.", answer:"im",
          data:[["Fish (main ingredient)", "Imported"], ["Breaded, frozen and packed", "Nova Scotia, Canada"]],
          why:"They were made here, but the main ingredient, the fish, is imported.",
          wrong:{ pc:"The fish is imported. Processing in Nova Scotia isn’t enough. " + M3, di:"The main ingredient, the fish, is imported. Breading it here is the processing, not a Canadian ingredient." } }
      ],
      msgs:{ done:"All five cards decoded.", data:"Check it with data", made:"Where it was made" }   // module-written
    },
    grid:{
      title:"Station 2: two ways to get food to people",
      ask:"For each criterion, decide which system is stronger. Then read the evidence and compare your rating with the model rating.",
      systems:{ local:"A local system: a farmers’ market or community-supported agriculture (CSA)", global:"A national and global system: a grocery chain’s supply chain" },
      choices:[{ id:"local", t:"Local stronger" }, { id:"global", t:"National and global stronger" }, { id:"depends", t:"It depends: both" }],
      // Criteria (plan). Model ratings and evidence lines are module-written from the plan's own statements (Q3, W6, TC3, Q4, P4).
      criteria:[
        { id:"avail", t:"Availability in January", answer:"global",
          ev:["Trade brings in produce that can’t grow here in winter.", "Stored crops like apples and potatoes, and greenhouse produce, fill some of the gap locally."] },
        { id:"cost", t:"Cost to the shopper", answer:"depends",
          ev:["Local food can cost more or less depending on the season and the farm.", "Large supply chains buy in bulk, but shocks and border delays raise their prices too."] },
        { id:"resil", t:"Resilience to a regional shock", answer:"depends",
          ev:["Buying from many regions spreads the risk: a Prairie drought doesn’t empty every shelf (TC3).", "If a flood cuts the highway, nearby farms and stored food still reach the town (quick check)."] },
        { id:"farms", t:"Support for local farms", answer:"local",
          ev:["Buying directly supports nearby farms and keeps money in the local economy."] },
        { id:"env", t:"Environmental impact", answer:"depends",
          ev:["For most foods, how they’re grown matters more than how far they travel (P4).", "Air freight is the big exception."] }
      ],
      msgs:{ match:"Matches the model rating.", differ:"The model rates this differently: {r}.", model:"Model rating", ev:"Evidence",   // module-written
        key:"Each system is strong where the other is weak. A food-secure community usually needs both." }
    },
    wheel:{
      title:"Station 3: in season in Ontario",
      ask:"Tap a food, then tap its harvest window. Each food you place appears on the seasonal wheel.",
      // Model windows (Foodland Ontario-style availability). VERIFY: every window, and the stored and day-neutral extensions
      // (module-chosen extents: stored through November to March; day-neutral strawberries August to October).
      windows:[{ id:"mj", t:"May–June", m:[4, 5] }, { id:"jj", t:"June–July", m:[5, 6] }, { id:"au", t:"August", m:[7, 7] }, { id:"fa", t:"Fall (September–October)", m:[8, 9] }],
      foods:[
        { id:"asparagus", t:"Asparagus", answer:"mj", why:"Asparagus is harvested in May and June.", hint:"Asparagus is one of the first local crops of spring." },
        { id:"strawberries", t:"Strawberries", answer:"jj", ext:{ m:[7, 9], t:"day-neutral varieties" }, why:"June and July, with day-neutral varieties into fall.", hint:"Field strawberries ripen in early summer." },
        { id:"corn", t:"Sweet corn", answer:"au", why:"Sweet corn is an August crop.", hint:"Sweet corn ripens in late summer." },
        { id:"apples", t:"Apples", answer:"fa", ext:{ m:[10, 2], t:"stored" }, why:"Apples are picked in the fall, then stored.", hint:"Apples are picked as the weather cools." },
        { id:"roots", t:"Root vegetables", answer:"fa", ext:{ m:[10, 2], t:"stored" }, why:"Root vegetables are dug in the fall and stored through winter.", hint:"Root vegetables are dug late in the season, then stored." }
      ],
      msgs:{ pick:"Tap a food first.", done:"Every food is on the wheel. Storage, greenhouses and new varieties stretch the local season.", months:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] }   // module-written
    },
    // VERIFY: reference details (title, year, URL) before release.
    blocks:[{ title:"Source to check (APA 7)", html:'<ul class="hfa-refs"><li>Canadian Food Inspection Agency. (n.d.). <i>Origin claims on food labels</i>. Government of Canada.</li></ul>' }],
    quickCheck:{
      title:"Origins quick check", summary:"Origins quick check",
      // Correct-choice lines are module-written ("Right." + the plan's feedback line).
      items:[
        // VERIFY: minor imported ingredients such as spices allowed (q1)
        { id:"q1", goal:4, prompt:"“Pasta made in Canada from Canadian wheat, with a pinch of imported spice.”",
          choices:[{ t:"Product of Canada", ok:true, fb:"Right. Virtually all of it is Canadian; minor imported ingredients like spices are allowed." },
            { t:"Made in Canada from imported ingredients", fb:"Virtually all of it is Canadian; minor imported ingredients like spices are allowed." },
            { t:"No claim allowed", fb:"Virtually all of it is Canadian; minor imported ingredients like spices are allowed." },
            { t:"Organic", fb:"Virtually all of it is Canadian; minor imported ingredients like spices are allowed." }] },
        { id:"q2", goal:4, prompt:"“Chocolate bars made in Ontario from imported cocoa, sugar and milk powder.”",
          choices:[{ t:"Made in Canada from imported ingredients", ok:true, fb:"Right. Made here, but the main ingredients are imported." },
            { t:"Product of Canada", fb:"Made here, but the main ingredients are imported." },
            { t:"Product of Ghana", fb:"Made here, but the main ingredients are imported." },
            { t:"Local", fb:"Made here, but the main ingredients are imported." }] },
        { id:"q3", goal:5, prompt:"Which system usually offers more variety of fresh produce in January?",
          choices:[{ t:"National and global supply chain", ok:true, fb:"Right. Trade brings in produce that can’t grow here in winter." },
            { t:"Farmers’ market", fb:"Trade brings in produce that can’t grow here in winter." },
            { t:"Both equal", fb:"Trade brings in produce that can’t grow here in winter." },
            { t:"Neither", fb:"Trade brings in produce that can’t grow here in winter." }] },
        { id:"q4", goal:5, prompt:"Which system helps a town keep eating if a flood cuts its highway?",
          choices:[{ t:"A mix of local farms and stored food", ok:true, fb:"Right. Diverse sources spread the risk." },
            { t:"Only distant suppliers", fb:"Diverse sources spread the risk." },
            { t:"Only one big warehouse", fb:"Diverse sources spread the risk." },
            { t:"Neither matters", fb:"Diverse sources spread the risk." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"regions", type:"match", title:"Region ↔ product", summary:"Region ↔ product", goal:1,
        instruction:"Match each region to the product it’s known for.",   // module-written
        leftTitle:"Region", rightTitle:"Product it’s known for",
        left:[
          { id:"l1", t:"Saskatchewan" }, { id:"l2", t:"Alberta" }, { id:"l3", t:"Prince Edward Island" }, { id:"l4", t:"Quebec" },
          { id:"l5", t:"Okanagan Valley, BC" },
          // VERIFY: Leamington's greenhouse cluster (hint 2)
          { id:"l6", t:"Leamington, Ontario", hints:["Which product is grown under glass?", "Leamington has one of North America’s largest greenhouse clusters.", "Greenhouse vegetables."] },
          { id:"l7", t:"Niagara, Ontario" }, { id:"l8", t:"Atlantic coast" }
        ],
        right:[
          { id:"r1", t:"Lentils and durum wheat" }, { id:"r2", t:"Beef cattle" }, { id:"r3", t:"Potatoes" }, { id:"r4", t:"Maple syrup" },
          { id:"r5", t:"Apples and cherries" }, { id:"r6", t:"Greenhouse tomatoes, cucumbers and peppers" }, { id:"r7", t:"Peaches and grapes" }, { id:"r8", t:"Lobster and snow crab" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        // VERIFY: Alberta raises the most cattle; Saskatchewan grows the most pulses
        wrong:{
          "l6|r7":"Niagara grows tender fruit outdoors; Leamington is known for greenhouses.", "l7|r6":"Niagara grows tender fruit outdoors; Leamington is known for greenhouses.",
          "l1|r2":"Alberta raises the most cattle; Saskatchewan grows the most pulses.", "l2|r1":"Alberta raises the most cattle; Saskatchewan grows the most pulses."
        },
        wrongDefault:"Check that region’s climate and soil on the map." },
      // Plan: choose 1 of 4, 6 items, ★ non-routine set (S3–S6). The plan gives the best answer and the most tempting wrong
      // answer; the other two options per item, their feedback and the correct-answer lines are module-written.
      { id:"ripple", type:"mc", title:"Ripple effects", summary:"Ripple effects", star:true, goal:3,
        instruction:"Six shocks to the food system. Choose the most likely effect. The ★ items are non-routine.",   // module-written
        items:[
          { id:"s1", goal:3, prompt:"“Avian influenza forces some poultry farms to cull their flocks.”",
            options:[
              { t:"Egg and chicken supplies tighten and prices may rise", ok:true, why:"Fewer birds means less supply of eggs and chicken, so prices may rise." },
              { t:"Prices fall", why:"Fewer birds means less supply." },
              { t:"Beef prices double", why:"Avian influenza affects poultry flocks, not cattle." },
              { t:"Nothing changes, because Canada imports its eggs", why:"Canadian eggs and chicken come from Canadian farms; they’re supply-managed." }] },
          // VERIFY: the 2020 delays of seasonal workers
          { id:"s2", goal:3, prompt:"“Travel restrictions delay seasonal farm workers arriving in spring (as happened in 2020).”",
            options:[
              { t:"Hand-harvested crops like strawberries and greenhouse vegetables are at risk", ok:true, why:M7 },
              { t:"Wheat harvests collapse", why:"Grain harvesting is highly mechanized; fruit and vegetable picking relies on hands." },
              { t:"Nothing changes, because farm families do all the work", why:M7 },
              { t:"Only imported oranges are affected", why:"Oranges are imported all year. This delay affects work on Canadian farms." }] },
          { id:"s3", goal:3, prompt:"★ “A late spring frost hits Niagara during peach blossom.”",
            options:[
              { t:"Fewer Ontario peaches that summer, more imports and higher local prices", ok:true, why:"Lost blossoms mean lost fruit that year. Less supply with the same demand pushes prices up." },
              { t:"No effect", why:"Blossoms lost in spring are fruit lost in summer." },
              { t:"More peaches, because the trees recover", why:"Lost blossoms mean lost fruit that year." },
              { t:"Lower peach prices", why:"Lower supply usually means higher prices." }] },
          { id:"s4", goal:3, prompt:"★ “A drought raises the price of feed grain on the Prairies.”",
            options:[
              { t:"Beef and pork costs rise later as feed costs pass through", ok:true, why:"Grain is also animal feed, so higher feed costs reach meat prices later." },
              { t:"Only bread is affected", why:"Grain is also animal feed." },
              { t:"Nothing changes outside the Prairies", why:M5 },
              { t:"Milk prices double immediately", why:"Feed costs can matter later, but dairy prices are set through supply management." }] },
          { id:"s5", goal:3, prompt:"★ “In February, a trucking slowdown at the US border lasts two weeks. A Montreal shopper’s cart has milk, eggs, lettuce, oranges, potatoes and frozen blueberries. Which items are most affected?”",
            options:[
              { t:"Lettuce and oranges", ok:true, why:"In February they cross the US border. Milk and eggs are Canadian, and the potatoes and frozen blueberries are stored or frozen Canadian food." },
              { t:"Milk and eggs", why:"Those are Canadian and supply-managed; they don’t cross the border." },
              { t:"Potatoes and frozen blueberries", why:"Stored potatoes and frozen blueberries are Canadian in winter." },
              { t:"All six items equally", why:"Only the items that cross the US border are hit first." }],
            hints:["Which items cross the US border in February?", "Canadian-produced and supply-managed items stay domestic.", "Lettuce and oranges."] },
          { id:"s6", goal:5, prompt:"★ (Inquiry) “You want to find out how much of your school cafeteria’s menu is Canadian-grown. Which research plan is strongest?”",
            options:[
              { t:"List one week’s menu items, ask the food-service manager for supplier origin information, classify each item by origin, and calculate the share", ok:true, why:"It gets origin data from the suppliers and turns it into a share you can report." },
              { t:"Survey students about where they think the food comes from", why:"That measures opinions, not origins." },
              { t:"Look up which foods grow in Canada and assume the cafeteria buys them", why:"That’s a guess. Origins come from suppliers, not guesses." },
              { t:"Taste one day’s lunch and decide which items seem Canadian", why:"Taste can’t tell you origin, and one day is a small sample." }],
            hints:["What data answers the question directly?", "Origins come from suppliers, not guesses.", "Menu list → supplier origins → classify → calculate."] }
        ] },
      // Spot the Error. The plan's hint 3 ("Fix A.") names an option by letter; the build shuffles fixes, so hint 3 quotes
      // the fix instead. Wrong-fix feedback: E1 uses the plan's line; E2 and E3 use M3 and M4.
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Pascale", goal:[2, 4, 5], how:"",
        instruction:"Pascale made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain how supply management works.",
            steps:["“Supply management covers dairy, poultry and eggs.”", "“Farmers buy quota, which sets how much each farm can produce.”", "“The government sets a maximum price, so these foods stay cheap.”", "“Imports above set amounts face high tariffs.”"],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is correct, but an earlier step isn’t."],
            fixes:[
              { t:"“Farm prices are set from production costs, which keeps prices stable, not necessarily low.”", ok:true, why:M2 },
              { t:"“There are no prices at all.”", why:"Supply management stabilizes farm prices; it isn’t a price cap." },
              { t:"“Prices are set by other countries.”", why:"Supply management stabilizes farm prices; it isn’t a price cap." },
              { t:"Step 3 is correct.", why:"Supply management stabilizes farm prices; it isn’t a price cap." }],
            hints:["Is the aim low prices or stable prices?", "Cost-based pricing.", "The fix: farm prices are set from production costs, which keeps prices stable, not necessarily low."] },
          { id:"e2", goal:4, task:"Decide what claim a frozen pizza can carry. It’s made in Ontario from Canadian flour and cheese, with imported tomato paste and spices.",
            steps:["“The pizza was made in Ontario.”", "“Any food made in Canada can say ‘Product of Canada’.”", "“So the box can say ‘Product of Canada’.”"],
            answer:1, stepFb:["Step 1 is correct.", "", "Step 3 follows step 2; the error is earlier."],
            fixes:[
              { t:"“‘Product of Canada’ needs all or virtually all major ingredients to be Canadian. Tomato paste is a major ingredient, so the claim is ‘Made in Canada from domestic and imported ingredients’.”", ok:true, why:M3 },
              { t:"“It must say ‘Product of Italy’.”", why:M3 },
              { t:"“No claim is allowed.”", why:M3 },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["Is tomato paste a major ingredient of pizza?", "Yes.", "The fix: “Product of Canada” needs all or virtually all major ingredients to be Canadian, so the claim is “Made in Canada from domestic and imported ingredients”."] },
          { id:"e3", goal:5, task:"Which tomato has the lower carbon footprint in January?",
            steps:["“Tomato A grows in a heated greenhouse 50 km away.”", "“Tomato B grows in an unheated field in Mexico and travels 3500 km by truck.”", "“The shorter trip always means lower emissions.”", "“So Tomato A is lower.”"],
            answer:2, stepFb:["Step 1 is a fact from the task.", "Step 2 is a fact from the task.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Distance is only one part. Heating a greenhouse in winter can produce more emissions than trucking, so you’d need data on both.”", ok:true, why:M4 },
              { t:"“Trucks produce no emissions.”", why:M4 },
              { t:"“Imported food always has lower emissions.”", why:M4 },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["What else produces emissions besides transport?", "Heating.", "The fix: distance is only one part; heating a greenhouse in winter can produce more emissions than trucking, so you’d need data on both."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the map: how much switches to imports in winter, or how far a Prairie drought reaches?" },
      { id:"j2", q:"In your own words, why does supply management make some prices stable but not cheap?" },
      { id:"j3", q:"Explain to a friend why “local” doesn’t automatically mean “lower-carbon”." },
      { id:"j4", q:"What’s one thing you’d still like to know about where your own meals come from, and how could you find out?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7); correct-option lines without plan
    // text are module-written. VERIFY: all Final Check facts (plan: "All facts are marked (verify before release)").
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which province grows most of Canada’s lentils and other pulses?", options:[
          { t:"Saskatchewan", ok:true, why:"Prairie soils and climate suit pulses." },
          { t:"Nova Scotia", why:"Known for wild blueberries and fisheries." },
          { t:"British Columbia", why:"Known for tree fruit, berries and seafood." },
          { t:"Nunavut", why:"The growing season is too short." }] },
        b:{ prompt:"In January, where does most of the fresh lettuce sold in Ontario come from?", options:[
          { t:"The southwestern United States", ok:true, why:"Field lettuce can’t grow in Ontario in winter." },
          { t:"Ontario fields", why:M1 },
          { t:"Prince Edward Island", why:"Known for potatoes." },
          { t:"The North", why:"Too cold, and fresh produce is shipped in." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which three tools make up supply management?", options:[
          { t:"Production quotas, import controls and cost-based farm prices", ok:true, why:M2 },
          { t:"Price caps, subsidies and export bans", why:M2 },
          { t:"Organic certification, labelling and inspections", why:"Those are other systems." },
          { t:"Crop insurance, weather forecasts and loans", why:"Those are risk tools, not supply management." }] },
        b:{ prompt:"Which product is <strong>not</strong> supply-managed in Canada?", options:[
          { t:"Canola", ok:true, why:"Canola is traded on open markets." },
          { t:"Milk", why:M2 },
          { t:"Eggs", why:M2 },
          { t:"Chicken", why:M2 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What does “Product of Canada” mean?", options:[
          { t:"All or virtually all major ingredients, processing and labour are Canadian", ok:true, why:M3 },
          { t:"The food was packaged in Canada", why:M3 },
          { t:"At least half the ingredients are Canadian", why:"The rule is all or virtually all." },
          { t:"The food is organic", why:"Origin and organic are separate claims." }] },
        b:{ prompt:"Crackers are made in Manitoba from imported flour and Canadian canola oil. Which claim fits?", options:[
          { t:DI, ok:true, why:"The last substantial change happened in Canada, using a mix of Canadian and imported ingredients." },
          { t:PC, why:"The flour, a major ingredient, is imported." },
          { t:"“Product of Manitoba”", why:"There isn’t a standard claim like that here." },
          { t:"“Imported product”", why:"The last major change happened in Canada." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A severe drought cuts Prairie wheat and canola harvests. Which chain of effects is most likely?", options:[
          { t:"Smaller harvests → higher prices for flour, baked goods and canola oil across Canada → lower income for affected farmers", ok:true, why:M5 },
          // VERIFY: Canada is a major wheat exporter
          { t:"Smaller harvests → no change for shoppers, because Canada imports its wheat", why:"Canada is a major wheat exporter." },
          { t:"Smaller harvests → milk prices double immediately", why:"Feed costs can matter later, but dairy prices are set through supply management." },
          { t:"Smaller harvests → lower bread prices", why:"Less supply usually means higher prices." }] },
        b:{ prompt:"Floods cut the highway and rail links between BC’s interior and the Port of Vancouver. Which chain is most likely?", options:[
          { t:"Shipments stall → shortages in some BC stores and delayed exports of Prairie grain through the port", ok:true, why:"The routes to the port are the bottleneck, so BC stores and exporters feel it first." },
          { t:"Shipments stall → shortages only in Nova Scotia", why:"The effects centre on BC and the routes through it." },
          { t:"Nothing changes, because food travels by air", why:"Most food moves by truck, rail and ship." },
          { t:"Prices fall everywhere", why:"Disrupted supply doesn’t lower prices." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Which statement best fits the evidence on food miles?", options:[
          { t:"For most foods, production causes more emissions than transport; air-freighted foods are the main exception", ok:true, why:M4 },
          { t:"Local food always has the lowest emissions", why:M4 },
          { t:"Transport is the main source of emissions for all foods", why:M4 },
          { t:"Distance and emissions are unrelated in every case", why:"Air freight shows distance can matter a lot." }] },
        b:{ prompt:"In January, a Toronto shopper compares strawberries trucked from California with strawberries air-freighted from overseas. Which likely has higher transport emissions?", options:[
          { t:"The air-freighted strawberries", ok:true, why:"Flying food produces far more emissions per kilometre than trucking or shipping." },
          { t:"The trucked strawberries", why:"Trucks emit less per kilometre than planes." },
          { t:"They’re equal because both are imported", why:"The mode of transport matters." },
          { t:"Neither has any transport emissions", why:"Both use fuel." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Why are fresh vegetables usually much more expensive in a fly-in northern community than in Toronto?", options:[
          { t:"They must be flown or barged in, in small loads, with spoilage on long trips", ok:true, why:"Transport costs and losses add up (links to module 19)." },
          { t:"Northern stores choose to charge more for no reason", why:"The costs are real; how they’re shared is a policy question." },
          { t:"Northern soils grow vegetables cheaply but stores import anyway", why:"The growing season is very short." },
          { t:"Vegetables are taxed more in the North", why:"That isn’t the main reason." }] },
        b:{ prompt:"Why might an Ontario strawberry farm grow day-neutral varieties or use tunnels and greenhouses?", options:[
          { t:"To extend the season beyond June and July and sell local berries longer", ok:true, why:"Day-neutral varieties, tunnels and greenhouses stretch the local season." },
          { t:"To make berries supply-managed", why:"Berries aren’t supply-managed." },
          { t:"Because the berries become imported", why:"They’re still Ontario-grown." },
          { t:"To avoid needing any workers", why:"Picking still needs workers." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the clearest explanation of a trade-off of supply management?", options:[
          { t:"“It gives dairy, poultry and egg farmers stable incomes and steady supply, but shoppers may pay more than in an open market.”", ok:true, why:"It names a benefit and a cost, and says who gets each." },
          { t:"“It makes all food cheaper for everyone.”", why:M2 },
          { t:"“It has no effect on prices.”", why:"Cost-based pricing and import controls do affect prices." },
          { t:"“It only helps importers.”", why:"Its main effect is on domestic farmers." }] },
        b:{ prompt:"Which sentence correctly describes supply management?", options:[
          { t:"“Quotas match production to Canadian demand, and tariffs limit imports above set amounts.”", ok:true, why:"It names two of supply management’s tools and what each one does." },
          { t:"“Quotas limit how much Canadians may eat.”", why:"Quotas limit production, not eating." },
          { t:"“It covers wheat, canola and beef.”", why:M2 },
          { t:"“It was replaced by free trade in all products.”", why:"It still exists for dairy, poultry and eggs." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which label wording is written correctly for cookies made in Canada from imported chocolate and Canadian flour?", options:[
          { t:DI, ok:true, why:"The flour is Canadian and the chocolate is imported, so the claim names both." },
          { t:"“Product of Canada (mostly)”", why:"There is no “mostly” version." },
          { t:"“Made in Canada” with no qualifier", why:"The claim must say which ingredients." },
          { t:"“Canadian-ish”", why:"Not a recognized claim." }] },
        b:{ prompt:"Which explanation of " + IM + " is clearest?", options:[
          { t:"“The food was made or transformed here, but its main ingredients came from other countries.”", ok:true, why:"That matches the rule: the last substantial change happened here, with imported main ingredients." },
          { t:"“The food was grown in Canada.”", why:M3 },
          { t:"“The food is lower quality.”", why:"Quality depends on handling, not on the passport." },
          { t:"“The food was only repackaged here.”", why:"A substantial change happened here." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A school cafeteria wants a January lunch with mostly Canadian ingredients and all three plate sections. Which menu fits best?", options:[
          { t:"Chicken, brown rice, roasted potatoes and apple slices", ok:true, why:"Only the rice is imported." },
          { t:"Lettuce salad, oranges and rice", why:"All three are imported in January." },
          { t:"Strawberries, lettuce and lentils", why:"Two winter imports." },
          { t:"Bread and maple syrup only", why:"Missing vegetables and fruits and protein foods." }] },
        b:{ prompt:"A caterer wants an August menu that is entirely Canadian. Which works?", options:[
          { t:"Salmon, lettuce and strawberry salad, and whole-wheat bread", ok:true, why:"In August, all four are Canadian in this model." },
          { t:"Oranges and brown rice", why:"Imported all year." },
          { t:"Chicken with oranges", why:"Oranges are imported." },
          { t:"Lentils with brown rice", why:"Rice is imported." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A town of 8000 wants to improve its food security. Which plan uses local and global systems best?", options:[
          { t:"Support a farmers’ market and storage of local crops, while keeping grocery supply chains for winter variety", ok:true, why:"It keeps the strengths of both systems, and diverse sources spread the risk." },
          { t:"Close the grocery store so everyone buys local", why:"That cuts winter availability." },
          { t:"Rely only on one distant warehouse", why:"A single source is fragile." },
          { t:"Do nothing, because shocks never happen", why:"Floods and droughts do happen." }] },
        // VERIFY: the seasonal worker program details (correct option)
        b:{ prompt:"A greenhouse operation can’t find enough local workers. Which response best balances food production and fairness?", options:[
          { t:"Hire seasonal workers through an official program, with safe housing and the full rights the law requires", ok:true, why:M7 },
          { t:"Stop growing vegetables entirely", why:"That cuts supply." },
          { t:"Hire workers without contracts", why:"That’s unsafe and illegal." },
          { t:"Import all vegetables instead", why:"That shifts the problem rather than solving it." }] } }
    ]
  },
  task:{
    title:"Canadian plate, any season", summary:"Canadian plate, any season",
    statement:"<p>Design a 5-ingredient meal for January or August that is mostly Canadian, balanced on the plate, spread across regions, and ready for a Prairie drought. There’s more than one answer.</p><p class=\"tiny muted\">Choose a month and 5 ingredients from the model table. The map and readout show origins, regions and plate sections.</p>",
    checks:["Mostly Canadian: at least 4 of the 5 ingredients are Canadian in the chosen month", "Balanced plate: vegetables and fruits, whole grains and protein foods", "Spread across Canada: the Canadian ingredients come from at least 3 different regions", "Drought-ready: at most 1 ingredient comes from the Prairies"],
    tips:["Check the month: lettuce and strawberries are imports in January.", "Add the missing plate section.", "Try a Pacific or Atlantic ingredient, like salmon, potatoes or wild blueberries.", "Bread, oats, lentils and beef are all Prairie foods: keep just one."],
    explainPrompt:"Explain how your meal balances being Canadian-grown, nutritious and resilient to a shock. What trade-off did you make?",
    vocab:"Use the words region, season, import and supply.",
    checkLabel:"Check my meal",   // module-written
    success:"This meal meets every condition.",   // module-written
    more:"There’s more than one answer. Can you find another?",
    validMsg:"Choose exactly 5 ingredients. You have {n}."   // module-written
  },
  cards:[
    ["Food system", "Farm → processing → distribution → retail → consumer, with waste and recovery at each step."],
    ["The Prairies", "Wheat, canola, oats, barley, pulses (lentils, peas) and beef. Main risk: drought."],
    ["Central Canada", "Dairy, poultry, eggs, pork, corn, soybeans, fruit and vegetables, greenhouses, maple syrup."],
    ["Supply management", "Dairy, poultry and eggs: quotas, import controls and cost-based farm prices, giving stable (not low) prices."],
    ["Quota", "A farm’s permitted share of production under supply management."],
    // VERIFY: cards 6 and 10 (CFIA rule; federal seasonal worker programs)
    ["“Product of Canada”", "All or virtually all major ingredients, processing and labour are Canadian."],
    ["“Made in Canada from … ingredients”", "Made here; says whether the ingredients are domestic, imported or both."],
    ["Seasonality", "Fresh produce follows the growing season; storage, freezing, greenhouses and trade extend it."],
    ["Food miles", "Distance food travels. Usually a small part of its emissions, except air freight."],
    ["Seasonal agricultural workers", "Workers who come for the growing season, often through federal programs, vital to fruit, vegetable and greenhouse farms."],
    ["Supply shock", "A sudden drop in supply (drought, flood, disease, border delay) that raises prices and can cause shortages."],
    ["Resilient food supply", "Diverse sources (local, national, global), storage and transport routes that spread the risk."]
  ]
};
