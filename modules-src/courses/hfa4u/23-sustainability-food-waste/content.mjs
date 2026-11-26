// HFA4U 23 Sustainable Agriculture & Food Waste. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/23-sustainability-food-waste.md
// Teacher notes: lines marked VERIFY carry the plan's "verify before release" flags (students see the plan's wording without
// them) and every value or line this module had to supply. "module-written" marks text that isn't in the plan.
// Module rules (plan §5–6): Explore, Part 3 and the Final Check use model data (labelled on screen); the waste audit uses a
// model household only (students never enter their own household's waste); no blame: waste is framed through systems.
// VERIFY (plan §6, whole module): every real figure (Second Harvest & VCMI 2019: 58% lost or wasted, about a third avoidable;
// National Zero Waste Council / Love Food Hate Waste Canada; UNEP Food Waste Index Report 2024: about 1.05 billion tonnes in
// 2022); the Canadian version of the food recovery hierarchy and its wording; the CFIA rules on best-before dates, expiration
// dates, "packaged on" and "use by" labels; PROOF's finding that food insecurity in Canada comes mainly from low income.
// VERIFY: the animal-feed rule is a stated model rule (plant-based only, never mouldy), not Canadian law (plan §6.3).
// VERIFY: the model field indices are teaching values, not agronomic predictions (plan §6.4).

// Misconception core sentences (plan §3)
const M1 = "Waste happens at every stage, and households are a major source. Loss also happens on farms and in processing.";
// VERIFY: M2 (CFIA: best-before and expiration dates)
const M2 = "Best-before is about quality for unopened food stored properly. Expiration dates (on a few products, like infant formula) mean don’t use after the date.";
const M3 = "Prevention saves the land, water and energy used to make the food; compost only recovers some nutrients.";
const M4 = "Buried without air, food produces methane, a strong greenhouse gas.";
const M5 = "It depends on the practice. In the model, rotation with cover crops and no-till keeps yield at 100 while soil improves; summer fallow cuts yield.";
// VERIFY: M6 (PROOF)
const M6 = "Food rescue helps, but food insecurity in Canada comes mainly from low income.";
const M7 = "Only safe, properly handled food can feed people; food from someone’s plate is never re-served.";

// VERIFY: every reference below (authors, years, titles; web-page titles). The plan names the sources; the titles of the
// Second Harvest & VCMI report, the CFIA page, the Love Food Hate Waste page and the PROOF page are module-supplied.
const REFS = '<ul class="hfa-refs">' +
  "<li>Canadian Food Inspection Agency. (n.d.). <i>Date labelling on pre-packaged foods</i>. Government of Canada.</li>" +
  "<li>National Zero Waste Council. (n.d.). <i>Love Food Hate Waste Canada</i>.</li>" +
  "<li>PROOF. (n.d.). <i>Household food insecurity in Canada</i>. University of Toronto.</li>" +
  "<li>Second Harvest &amp; Value Chain Management International. (2019). <i>The avoidable crisis of food waste: Technical report</i>.</li>" +
  "<li>United Nations Environment Programme. (2024). <i>Food waste index report 2024</i>.</li>" +
  "</ul>";

export default {
  id:"23-sustainability-food-waste",
  kind:"topic",
  title:"Sustainable agriculture and food waste",
  topic:"Sustainable Agriculture & Food Waste",
  readyTopic:"sustainable agriculture and food waste",
  hero:{
    // VERIFY: the Canadian version of the hierarchy (plan)
    eq:"Prevent → feed people → feed animals → industrial use → compost → landfill", eqSize:"sm",
    eqLabel:"prevent, then feed people, then feed animals, then industrial use, then compost, then landfill",
    headline:"The best way to deal with food waste is to never make it",
    text:"Between the field and the fork, a large share of food is <strong>lost</strong> (on farms and in processing) or <strong>wasted</strong> (in stores, restaurants and homes). Each wasted apple also wastes the land, water and energy that grew it, and in a landfill it releases <strong>methane</strong>. You’ll follow food along the chain, route surplus food up the <strong>food recovery hierarchy</strong>, test <strong>sustainable farming practices</strong>, and read <strong>date labels</strong> like an expert.",
    fig:{ html:'<div class="fw-hero" id="fw-hero"></div>', caption:"" },
    // module-written: the storyboard as a description
    aria:"One hundred apples start on a farm. A few drop off at each stage: farm, processing, store and home, and slide into a pile of lost or wasted apples. The pile tips into the food recovery hierarchy, an upside-down pyramid of six steps, widest at the top: prevent, feed people, feed animals, industrial use, compost, landfill. The top tiers glow; a small arrow at the bottom points from landfill to methane. Start at the top.",
    final:"Start at the top",
    stages:["Farm", "Processing", "Store", "Home"],
    drops:[12, 3, 8, 17],   // model apples (plan's Along the chain table)
    pile:"lost or wasted",
    methane:"landfill → methane",
    tiers:["Prevent", "Feed people", "Feed animals", "Industrial use", "Compost", "Landfill"]
  },
  goals:[
    "I can tell food loss from food waste and identify causes at each stage of the supply chain.",
    "I can apply the food recovery hierarchy to choose the best safe use for surplus food.",
    "I can explain how sustainable agriculture practices affect soil, yields and the environment.",
    "I can read Canadian date labels correctly (best-before vs expiration).",
    "I can analyse food waste data and evaluate strategies to reduce it.",
    "I can plan an action that reduces waste and supports food security."
  ],
  start:{
    // module-written from plan §5 (privacy) and §6.5 (no blame)
    blocks:[{ title:"Before you start", html:"<p>Food waste is shaped by systems: portion sizes, store standards, confusing date labels. This module uses a <strong>model household</strong> and model data; you never enter what your own household throws out.</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Food supply chain", goal:1,
          prompt:"Which stage comes <strong>before</strong> retail?",
          options:[
            { t:"Processing (e.g. a cannery or bakery)", ok:true, why:"Food is processed before stores sell it." },
            { t:"The household", why:"Households come after retail." },
            { t:"A restaurant serving customers", why:"Food service is at the same level as retail." },
            { t:"The compost bin", why:"That’s after food is wasted." }],
          hints:["Farm → ? → store.", "What happens to wheat before it’s sold as bread?", "Processing."] },
        { id:"w2", skill:"Food supply chain", goal:1,
          prompt:"Potatoes left in a field because a machine missed them are lost at which stage?",
          options:[
            { t:"Farm and harvest", ok:true, why:"They never left the farm." },
            { t:"Processing", why:"They weren’t processed." },
            { t:"Retail", why:"They never reached a store." },
            { t:"Household", why:"No one bought them." }],
          hints:["Where are the potatoes?", "Still in the field.", "Farm and harvest."] },
        { id:"w3", skill:"Food safety basics", goal:4,
          prompt:"What temperature should a refrigerator be to keep food safe?",
          options:[
            { t:"4 °C or colder", ok:true, why:"That slows bacterial growth." },
            { t:"10 °C", why:"That’s inside the danger zone (4–60 °C)." },
            { t:"−18 °C", why:"That’s a freezer." },
            { t:"20 °C", why:"That’s room temperature." }],
          hints:["The danger zone starts at 4 °C.", "Stay below it.", "4 °C or colder."] },
        { id:"w4", skill:"Food safety basics", goal:4,
          prompt:"Which saying is the safest rule for food that looks, smells or has been stored wrong?",
          options:[
            { t:"“When in doubt, throw it out.”", ok:true, why:"Some harmful bacteria can’t be seen or smelled." },
            { t:"“If it smells fine, it’s always safe.”", why:"Some pathogens cause no smell." },
            { t:"“Cooking makes any food safe.”", why:"Some bacterial toxins survive cooking." },
            { t:"“Cutting off the mould makes anything safe.”", why:"That isn’t safe for soft foods; mould can spread unseen." }],
          hints:["Can you always see or smell bacteria?", "No.", "When in doubt, throw it out."] },
        { id:"w5", skill:"Percentages", goal:5,
          prompt:"Out of 100 kg of lettuce, 60 kg is lost or wasted. What percentage is that?",
          options:[
            { t:"60%", ok:true, why:"60 out of 100." },
            { t:"40%", why:"40% is the share eaten." },
            { t:"6%", why:"60 ÷ 100 = 0.6 = 60%, not 6%." },
            { t:"0.6%", why:"0.6 is the decimal; as a percentage it’s 60%." }],
          hints:["Out of 100, the number is the percentage.", "60 of 100.", "60%."] },
        { id:"w6", skill:"Percentages", goal:5,
          prompt:"A household wasted 2.0 kg of food in a week; 0.9 kg was forgotten in the fridge. What share was forgotten food?",
          options:[
            { t:"45%", ok:true, why:"0.9 ÷ 2.0 = 0.45." },
            { t:"9%", why:"That treats 0.9 as out of 10." },
            { t:"90%", why:"0.9 ÷ 1.0 would be 90%; the total is 2.0." },
            { t:"18%", why:"Divide part by whole: 0.9 ÷ 2.0." }],
          hints:["Share = part ÷ total.", "0.9 ÷ 2.0.", "45%."] }
      ],
      refreshers:{
        "Food supply chain":"Farm and harvest → processing → retail and food service → household. <em>Loss</em> happens in the first two stages; <em>waste</em> in the last two.",
        "Food safety basics":"Fridge at 4 °C or colder; freezer at −18 °C or colder; danger zone 4–60 °C. When in doubt, throw it out.",
        "Percentages":"Share = part ÷ total × 100%. If the total is 100, the part is the percentage."
      }
    }
  },
  explore:{
    heading:"Waste tracker",
    intro:"Follow food along the chain to see where it’s lost or wasted, route surplus food up the recovery hierarchy, and test farming practices on a model field.",
    modes:[{ id:"chain", t:"Along the chain" }, { id:"rescue", t:"Rescue routes" }, { id:"field", t:"Sustainable field" }],
    modelTag:"Model data",
    // VERIFY: model data based on the pattern in Canadian and global reports (plan)
    chainNote:"Kilograms per 100 kg produced. Model data, built to match the pattern in Canadian and global reports.",
    stages:[
      { id:"farm", t:"Farm & harvest", kind:"loss", causes:["cosmetic standards (shape, size)", "weather damage", "overproduction", "pests"] },
      { id:"proc", t:"Processing", kind:"loss", causes:["trimming", "equipment faults", "overproduction"] },
      { id:"retail", t:"Retail & food service", kind:"waste", causes:["overstocking", "damaged packaging", "date confusion", "large portions"] },
      { id:"home", t:"Household", kind:"waste", causes:["buying too much", "forgetting food in the fridge", "date confusion", "cooking too much"] }
    ],
    foods:[
      { id:"lettuce", t:"Lettuce", kg:[20, 5, 10, 25], eaten:40 },
      { id:"bread", t:"Bread", kg:[3, 5, 10, 20], eaten:62 },
      { id:"milk", t:"Milk", kg:[2, 3, 5, 15], eaten:75 },
      { id:"potatoes", t:"Potatoes", kg:[20, 10, 5, 10], eaten:55 },
      { id:"apples", t:"Apples", kg:[12, 3, 8, 17], eaten:60 }
    ],
    groupLabel:"Loss vs waste",
    lossT:"Loss", lossSub:"farm + processing", wasteT:"Waste", wasteSub:"retail + household", eatenT:"Eaten",
    cmpAsk:"Which is bigger for this food?",   // module-written control text
    cmp:[{ id:"loss", t:"Loss > waste" }, { id:"waste", t:"Waste > loss" }],
    rulesTitle:"Rescue rules (a model policy, not a law)",
    rules:[
      "The food rescue partner accepts unopened food stored properly up to 7 days past its best-before date. It never accepts anything past an expiration date, mouldy, or already served.",
      "The farm partner accepts plant-based food that isn’t fit for people. It never accepts mouldy food or animal products.",
      "Every item goes to the <strong>highest level its rules allow</strong>."
    ],
    prevent:{ t:"Prevent", sub:"waste at the source" },
    dests:[
      { id:"people", t:"Feed people", sub:"food rescue partner" },
      { id:"animals", t:"Feed animals", sub:"farm partner" },
      { id:"industrial", t:"Industrial use", sub:"anaerobic digester → energy" },
      { id:"compost", t:"Compost" },
      { id:"landfill", t:"Landfill" }
    ],
    // answer = the highest allowed level (plan TC2). no = destinations the rules forbid, with the rule message (module-written
    // except the two the plan gives: formula → feed people and strawberries → feed animals). rule = the rule number to highlight.
    items:[
      { id:"yogurt", t:"Unopened yogurt, 2 days past best-before, kept refrigerated", short:"Yogurt", answer:"people",
        no:{ animals:"The farm partner never accepts animal products." } },
      { id:"formula", t:"Infant formula, 1 day past its expiration date", short:"Infant formula", answer:"industrial",
        no:{ people:"It’s past an <strong>expiration</strong> date. Never use it.", animals:"The farm partner accepts only plant-based food." } },
      { id:"apples", t:"Bruised but safe apples (5 kg)", short:"Apples", answer:"people",
        no:{ animals:"The farm partner accepts only plant food that isn’t fit for people, and these apples are safe to eat." } },
      { id:"bread", t:"Day-old bread (10 loaves, safe)", short:"Bread", answer:"people",
        no:{ animals:"The farm partner accepts only plant food that isn’t fit for people, and this bread is safe to eat." } },
      { id:"berries", t:"Mouldy strawberries", short:"Strawberries", answer:"industrial",
        no:{ people:"The food rescue partner never accepts mouldy food.", animals:"Mouldy food isn’t safe for animals either." } },
      { id:"peels", t:"Carrot peels and trimmings from the prepared-food counter", short:"Carrot peels", answer:"animals",
        no:{ people:"Trimmings aren’t fit to serve people." } }
    ],
    allowed:"✓ Allowed by the rules.",   // module-written
    field:{
      // VERIFY: model field values (plan: index values over a 4-year cycle; effects add)
      note:"Index values over a 4-year cycle. Baseline = continuous corn with tillage, no cover crops and calendar spraying. Effects add. Model data.",
      base:{ y:100, soil:-2, ero:6, pest:100 },
      practices:[
        { id:"rot", t:"Crop rotation", y:3, soil:1, ero:-1, pest:-20 },
        { id:"cc", t:"Cover crops", y:-1, soil:1, ero:-2, pest:0 },
        { id:"nt", t:"No-till", y:-2, soil:1, ero:-2, pest:10, note:"more herbicide" },
        { id:"ipm", t:"Integrated pest management (IPM)", short:"IPM", y:0, soil:0, ero:0, pest:-30 },
        { id:"ic", t:"Intercropping", y:1, soil:0, ero:-1, pest:-10 },
        { id:"fal", t:"Summer fallow", y:-25, soil:-1, ero:2, pest:-10 }
      ],
      soilLabels:{ low:"falling", mid:"steady", high:"rising" },
      eroLabels:{ high:"high", mid:"medium", low:"low" },
      labelRules:"Soil organic matter: −1 or lower is “falling”; 0 is “steady”; +1 or higher is “rising”. Erosion score: 5 or more is “high”; 3–4 is “medium”; 2 or less is “low”."
    },
    predictions:[
      { id:"p1", prompt:"Where is the most lettuce lost or wasted?",
        options:[{ t:"In households (25 kg)", ok:true }, { t:"In stores and restaurants" }, { t:"In processing" }, { t:"Equally at every stage" }],
        explain:"Homes are a major source of waste, which is why household habits matter." },
      { id:"p2", prompt:"Which destination is best for 10 safe loaves of day-old bread?",
        options:[{ t:"Feed people through the food rescue partner", ok:true }, { t:"Compost" }, { t:"Landfill" }, { t:"Feed animals" }],
        explain:"Safe food that can feed people should feed people. Compost recovers far less, and a landfill creates methane." },
      { id:"p3", prompt:"Can the yogurt go to the food rescue partner?",
        options:[{ t:"Yes: best-before is about quality, and the partner’s rule allows unopened, refrigerated food up to 7 days past it", ok:true }, { t:"No: it’s unsafe after its best-before date" }, { t:"No: dairy can never be rescued" }, { t:"Only if it’s frozen first" }],
        explain:"Best-before isn’t a safety date. Expiration dates are different." },
      { id:"p4", prompt:"Turn on Summer fallow. What happens to yield?",
        options:[{ t:"It drops sharply (to 75), because the field grows nothing one year in four", ok:true }, { t:"It rises" }, { t:"No change" }, { t:"Soil organic matter starts rising" }],
        explain:"Bare fallow rests the field but cuts yield and leaves soil exposed to wind and water." }
    ],
    challenges:[
      { id:"tc1", goal:1, prompt:"Along the chain: find the food where <strong>food loss (before retail) is greater than food waste (after)</strong>.",
        why:"Potatoes: 30 lost before retail vs 15 wasted after (cosmetic standards and storage).",   // module-written (hint 3)
        hints:["Use the Loss vs waste toggle.", "Compare the two grouped bars for each food.", "Potatoes: 30 lost before retail vs 15 wasted after (cosmetic standards and storage)."],
        msgs:{
          mode:"Switch to <strong>Along the chain</strong> first.",   // module-written
          lettuce:"Loss 25, waste 35. Waste is bigger.",
          apples:"Loss 15, waste 25.",
          bread:"Most of their losses happen after retail.",
          milk:"Most of their losses happen after retail.",
          chip:"Potatoes are the food. Now confirm it with the <strong>Loss > waste</strong> chip.",   // module-written
          wrongChip:"Look again: for potatoes, loss is 30 and waste is 15." } },   // module-written
      { id:"tc2", goal:[2, 4], prompt:"Rescue routes: send <strong>all six items to their highest allowed level</strong>.",
        why:"Yogurt, apples and bread feed people; the peels feed animals; the expired formula and the mouldy berries go to industrial use.",   // module-written (hint 3)
        hints:["Start at the top of the pyramid for each item and move down only if a rule says no.", "Only two items can’t feed people or animals: the expired formula and the mouldy berries.", "Those two go to industrial use; the peels go to animals; the other three feed people."],
        msgs:{
          mode:"Switch to <strong>Rescue routes</strong> first.",   // module-written
          all:"Route all six items first: {n} still on the cart.",   // module-written
          "yogurt|compost":"Best-before is about quality. Unopened and cold, the rescue rules allow it up to 7 days past.",
          "formula|people":"It’s past an <strong>expiration</strong> date. Never use it.",
          "bread|compost":"Safe food that can feed people belongs higher up.",
          "berries|animals":"Mouldy food isn’t safe for animals either.",
          "peels|compost":"The farm partner accepts plant trimmings, and animal feed ranks above compost.",
          other:"{n} of 6 items are at their highest allowed level. Check {list} again." } },   // module-written
      { id:"tc3", goal:3, stretch:true, prompt:"Sustainable field: make soil organic matter <strong>rising</strong> and erosion <strong>low</strong>, keep yield at <strong>98 or higher</strong>, and use <strong>as few practices as possible</strong>.",
        why:"Real results vary by soil and climate. The model shows why many Canadian farms combine these practices.",
        hints:["Which practices raise soil organic matter? You need +3 to go from −2 to +1.", "Only rotation, cover crops and no-till add +1 each.", "Check yield: 100 + 3 − 1 − 2 = 100. Erosion: 6 − 1 − 2 − 2 = 1."],
        msgs:{
          mode:"Switch to <strong>Sustainable field</strong> first.",   // module-written
          ccnt:"Soil organic matter is steady (0), and yield is 97.",
          ipm:"That works, but uses four practices. IPM doesn’t change soil or erosion, so drop it.",
          more:"That works, but uses more practices than it needs. Which ones don’t change soil organic matter?",   // module-written
          fallow:"Fallow cuts yield to about 75.",
          ricc:"Erosion is low enough (2), but soil is only steady (0).",
          other:"Now: yield {y}, soil organic matter {soil} ({sl}), erosion {ero} ({el}). You need rising soil, low erosion and yield 98 or higher." } }   // module-written
    ],
    // module-written: the plan's "aha" as a closing sheet
    blocks:[{ title:"What the tracker shows", html:"<ul><li><strong>Waste happens at every stage</strong>, not just one, and households are a major source.</li><li><strong>Prevention beats every other option.</strong> " + M3 + "</li><li><strong>Date labels mean different things.</strong> " + M2 + "</li><li><strong>Some farming practices improve soil without costing yield.</strong> " + M5 + "</li></ul>" }]
  },
  part3:{
    slug:"audit", name:"Audit", heading:"Waste audit",
    // module-written intro from the plan's stations
    intro:"Audit one week of a <strong>model household’s</strong> food waste. Sort the log by reason and watch the shares build, read four date labels, then choose two fixes and see the waste drop.",
    stations:[{ id:"s1", t:"1. The week’s log" }, { id:"s2", t:"2. Date labels" }, { id:"s3", t:"3. Two fixes" }],
    log:{
      ask:"Tap an item, then tap the reason bin it belongs in.",   // module-written
      bins:[{ id:"forgot", t:"Forgot" }, { id:"date", t:"Date confusion" }, { id:"cooked", t:"Cooked too much" }, { id:"bought", t:"Bought too much" }],
      items:[
        { id:"g1", t:"Half a bag of salad greens", kg:0.2, reason:"Forgot it in the fridge", answer:"forgot" },
        { id:"g2", t:"Three slices of bread", kg:0.1, reason:"Bought too much (went stale)", answer:"bought" },
        { id:"g3", t:"Leftover rice", kg:0.3, reason:"Cooked too much", answer:"cooked" },
        { id:"g4", t:"An unopened yogurt cup, thrown out the day after its best-before date", kg:0.2, reason:"Date confusion", answer:"date" },
        { id:"g5", t:"Two overripe bananas", kg:0.3, reason:"Forgot them", answer:"forgot" },
        { id:"g6", t:"Milk, unopened, thrown out at its best-before date", kg:0.5, reason:"Date confusion", answer:"date" },
        { id:"g7", t:"Cooked chicken left in the fridge for a week", kg:0.4, reason:"Forgot it (unsafe by then: correctly thrown out)", answer:"forgot", note:true }
      ],
      total:2.0,
      wrong:"Read the reason in the log again.",   // module-written
      chicken:"Some waste is about safety. Throwing out food that’s been stored too long is the right call. The fix is planning so it’s eaten in time.",
      done:"All seven items sorted. Forgot: 0.9 kg (45%); date confusion: 0.7 kg (35%); cooked too much: 0.3 kg (15%); bought too much: 0.1 kg (5%). Total: 2.0 kg."   // module-written from the plan's totals
    },
    // VERIFY: CFIA date-label rules (plan: "Rules come from CFIA guidance (verify before release)")
    labels:{
      ask:"What does each label tell you? Choose a meaning for each, then check.",   // module-written
      meanings:[{ id:"quality", t:"Quality of unopened food" }, { id:"dont", t:"Don’t use after" }, { id:"packed", t:"When the store packaged it" }, { id:"follow", t:"Follow the label" }],
      items:[
        { id:"d1", t:"Best before / Meilleur avant 2026 NO 28", on:"", answer:"quality", fb:"Best-before is about quality for unopened food stored properly; it isn’t a safety date." },
        { id:"d2", t:"Expiry date / Exp 2026 NO 28", on:"on infant formula", answer:"dont", fb:"Expiration dates appear on a few products, such as infant formula, and mean don’t use after this date." },
        { id:"d3", t:"Packaged on", on:"", answer:"packed", fb:"A “packaged on” date tells you when the store packaged the food." },
        { id:"d4", t:"Use by", on:"on an imported product", answer:"follow", fb:"On an imported product, follow what the label says." }
      ],
      done:"All four labels read correctly. " + M2   // module-written lead-in
    },
    fixes:{
      ask:"Choose <strong>two</strong> fixes for the biggest reasons and watch the model week’s waste drop.",   // module-written
      // VERIFY: each fix's effect is module-supplied model data (the plan gives none). Matched to Practice S3: planning meals
      // halves "forgot", freezing bread removes "bought too much". Two fixes on the same reason multiply (half of the half).
      list:[
        { id:"shelf", t:"A “use it up first” shelf", target:"forgot", keep:0.5 },
        { id:"plan", t:"Planning meals before shopping", target:"forgot", keep:0.5 },
        { id:"freeze", t:"Freezing bread", target:"bought", keep:0 },
        { id:"learn", t:"Learning best-before vs expiration", target:"date", keep:0 },
        { id:"small", t:"Cooking smaller batches", target:"cooked", keep:0 }
      ],
      effect:"Model effects: a shelf or meal planning halves forgotten food; learning the labels, freezing bread and smaller batches remove their reason.",   // module-written
      good:"These two fixes target the two biggest reasons: forgotten food and date confusion.",   // module-written
      off:"These fixes help, but look at the two biggest bins: forgotten food (45%) and date confusion (35%).",   // module-written
      same:"Both fixes target forgotten food. Is there a fix for the second-biggest reason?"   // module-written
    },
    // VERIFY: all three figures and their sources (plan: "real; verify before release")
    data:{
      title:"Check it with data",
      rows:[
        { t:"Canada, all stages", h:"Second Harvest &amp; VCMI estimated that 58% of food produced in Canada is lost or wasted, and that about a third of all food produced was avoidable loss or waste.", cite:"(Second Harvest &amp; Value Chain Management International, 2019)" },
        { t:"Canadian households", h:"The National Zero Waste Council’s Love Food Hate Waste Canada campaign reports household food waste in millions of tonnes per year, costing households over a thousand dollars each.", cite:"(National Zero Waste Council, n.d.)" },
        { t:"Global", h:"UNEP’s <i>Food Waste Index Report 2024</i> estimated about 1.05 billion tonnes of food wasted in 2022.", cite:"(United Nations Environment Programme, 2024)" }
      ],
      note:"These numbers count different things: all stages, households only, or the whole world. Check what a figure counts before you compare it."   // module-written (S5)
    },
    blocks:[{ title:"Sources (APA 7)", html:REFS }],
    quickCheck:{
      title:"Waste audit quick check", summary:"Waste audit quick check",
      items:[
        { id:"q1", goal:5, prompt:"In the audit, what share of waste came from date confusion?",
          choices:[{ t:"35%", ok:true, fb:"Right. 0.7 ÷ 2.0 = 0.35." }, { t:"0.7%", fb:"0.7 ÷ 2.0 = 0.35." }, { t:"7%", fb:"0.7 ÷ 2.0 = 0.35." }, { t:"70%", fb:"0.7 ÷ 2.0 = 0.35." }] },
        { id:"q2", goal:2, prompt:"Food buried in a landfill mostly releases…",
          choices:[{ t:"Methane", ok:true, fb:"Right. Without air, decomposing food makes methane." }, { t:"Oxygen", fb:"Without air, decomposing food makes methane." }, { t:"Nothing harmful", fb:"Without air, decomposing food makes methane." }, { t:"Only water", fb:"Without air, decomposing food makes methane." }] },
        { id:"q3", goal:4, prompt:"Which label means “don’t use after this date”?",
          choices:[{ t:"Expiration date", ok:true, fb:"Right. Expiration dates mean don’t use after the date." }, { t:"Best-before", fb:"Best-before is about quality." }, { t:"Packaged on", fb:"Best-before is about quality, and “packaged on” is when the food was packaged. Look for the expiration date." }, { t:"Display until", fb:"Best-before is about quality, and “display until” is for the store. Look for the expiration date." }] },
        { id:"q4", goal:4, prompt:"Why was throwing out the week-old chicken correct?",
          choices:[{ t:"Stored too long to be safe", ok:true, fb:"Right. Safety comes first; the fix is planning." }, { t:"It was past best-before", fb:"Safety comes first; the fix is planning." }, { t:"All chicken must be thrown out", fb:"Safety comes first; the fix is planning." }, { t:"Chicken can’t be frozen", fb:"Safety comes first; the fix is planning." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"chain", type:"sorter", title:"Where along the chain?", summary:"Where along the chain?", goal:1, noun:"event", txt:true,
        instruction:"Sort each event into the stage where the food was lost or wasted.",
        boxes:[{ id:"farm", label:"Farm & harvest" }, { id:"proc", label:"Processing" }, { id:"retail", label:"Retail & food service" }, { id:"home", label:"Household" }],
        // why lines: module-written
        items:[
          { id:"i1", t:"Carrots too crooked for store standards are ploughed back into the field.", answer:"farm", why:"Loss at harvest: cosmetic standards.",
            wrong:{ retail:"The carrots never left the farm. Cosmetic standards cause loss at harvest." } },
          { id:"i2", t:"A juice plant discards apple pulp left after pressing.", answer:"proc", why:"Loss in processing: trimming and by-products.",
            hints:["Where is apple pulp made?", "At the juice plant.", "Processing."] },
          { id:"i3", t:"A grocery store throws out dented cans.", answer:"retail", why:"Retail waste: damaged packaging." },
          { id:"i4", t:"A family’s leftovers go mouldy at the back of the fridge.", answer:"home", why:"Household waste: forgotten food." },
          { id:"i5", t:"Hail damages a peach orchard just before harvest.", answer:"farm", why:"Loss at the farm: weather damage." },
          { id:"i6", t:"A restaurant serves huge portions, and half of each plate comes back.", answer:"retail", why:"Food-service waste: large portions.",
            wrong:{ home:"Restaurants are food service." } },
          { id:"i7", t:"A bakery overproduces and the extra dough is discarded before baking.", answer:"proc", why:"Loss in processing: overproduction." },
          { id:"i8", t:"Someone throws out unopened crackers on their best-before date.", answer:"home", why:"Household waste: date confusion.",
            wrong:{ retail:"The crackers were already bought, so this happened at home." } }
        ],
        wrongDefault:"Ask where the food was when it was thrown out." },
      { id:"math", type:"custom", title:"Waste math and judgement", summary:"Waste math and judgement", star:true, goal:[2, 5, 6],
        instruction:"Six items: number entry and choices. Items S3 to S6 are non-routine (★).",   // module-written
        how:"Type a number and press Check, or choose an answer.",   // module-written
        items:[
          { id:"s1", kind:"num", goal:5, prompt:"Model: of 100 kg of apples, 12 + 3 + 8 + 17 kg are lost or wasted. What percentage is eaten?",
            answer:60, unit:"%", label:"Eaten", why:"12 + 3 + 8 + 17 = 40 kg lost or wasted, so 100 − 40 = 60 kg eaten: 60%.",   // module-written why
            wrong:[{ match:40, fb:"That’s lost or wasted; 100 − 40 = 60 eaten." }], wrongDefault:"Add the four stages, then subtract from 100." },   // module-written default
          { id:"s2", kind:"ratio", goal:5, prompt:"Model bread: farm 3, processing 5, retail 10, household 20. Ratio of waste after retail to loss before retail?",
            answer:3.75, label:"Ratio", placeholder:"e.g. 2 : 1",
            why:"30 : 8, which simplifies to 15 : 4 (3.75 times).",
            wrong:[{ match:0.26666666666666666, fb:"Waste after retail is 10 + 20 = 30; loss before is 3 + 5 = 8." }], wrongDefault:"Waste after retail is retail + household; loss before is farm + processing." },   // module-written default
          { id:"s3", kind:"num", star:true, goal:5, prompt:"In the audit, the household freezes bread and plans meals, cutting “forgot” by half and removing “bought too much”. New weekly total?",
            answer:1.45, unit:"kg", label:"New total", why:"2.0 − 0.45 − 0.1 = 1.45 kg.",
            wrong:[{ match:1, fb:"Half of 0.9 is 0.45; remove 0.1: 2.0 − 0.45 − 0.1 = 1.45." }], wrongDefault:"Change one reason at a time.",   // module-written default (hint 1)
            hints:["Change one reason at a time.", "“Forgot” drops from 0.9 to 0.45; “bought too much” (0.1) disappears.", "2.0 − 0.45 − 0.1 = 1.45 kg."] },
          { id:"s4", kind:"mc", star:true, goal:2, prompt:"The food rescue partner has room for only one more item tonight: 10 safe day-old loaves or 5 kg of bruised but safe apples. For this item only, the farm partner accepts any safe plant food. What’s the best plan for both items?",
            why:"Either assignment is accepted, because both keep each item as high on the hierarchy as space allows.",
            options:[
              { t:"One item to the rescue partner and the other to the farm partner (either way round)", ok:true, why:"Either assignment is accepted, because both keep each item as high on the hierarchy as space allows." },
              { t:"One item to the rescue partner and the other to compost", why:"Compost ranks below animal feed, and the farm partner can take it." },
              { t:"Both items to compost", why:"Both items can still feed people or animals. " + M3 },
              { t:"Both items to the rescue partner", why:"The partner has room for only one more item tonight." }],   // module-written option
            hints:["Each item should go as high on the pyramid as its rules allow.", "Only one can take the people slot; where can the other go?", "The other goes to the farm partner (animal feed)."] },
          // VERIFY: S5 both figures (58%; households about 2 million tonnes a year)
          { id:"s5", kind:"mc", star:true, inquiry:true, goal:5, prompt:"One report says “58% of food is lost or wasted in Canada”. Another says households waste about 2 million tonnes a year. Why might these numbers look so different?",
            why:"They measure different things: all stages vs households only, and total vs avoidable.",
            options:[
              { t:"They measure different things: all stages vs households only, and total vs avoidable (inedible parts like bones and peels are included in some totals)", ok:true, why:"Check what each number counts: which stages, and whether inedible parts are included." },   // module-written why
              { t:"One of the reports must be wrong", why:"Check what each counts before deciding a source is wrong." },
              { t:"A percentage and a mass can never be compared", why:"They can, once you know what each one counts." },   // module-written option
              { t:"Food waste must have changed a lot between the reports", why:"Nothing here says the years differ. First check what each number counts." }] },   // module-written option
          { id:"s6", kind:"mc", star:true, goal:6, prompt:"A student club has $50 and one month. Which plan best tackles both food waste and food insecurity?",
            why:"It cuts waste safely, gets food to people, and works on income, the main cause of food insecurity.",   // module-written
            options:[
              { t:"Set up a share table for unopened items with the cafeteria, partner with a local food rescue group, and write to their MPP supporting income-based solutions", ok:true, why:"It cuts waste safely, gets food to people, and works on income, the main cause of food insecurity." },
              { t:"Collect plate scraps for families", why:"Unsafe, and plate food is never shared. " + M7 },
              { t:"Run a food drive only", why:"Helps, but doesn’t address waste or income. " + M6 },
              { t:"Buy compost bins for the cafeteria", why:"Composting keeps food out of landfill, but it feeds no one and doesn’t touch income." }] }   // module-written option
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Xander", goal:[2, 4, 5],
        instruction:"Xander made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:4, task:"Decide what to do with unopened, refrigerated yogurt one day past its best-before date.",
            steps:["“The yogurt is unopened and has been kept in the fridge.”", "“The best-before date was yesterday.”", "“Best-before means the food becomes unsafe after that date.”", "“So it must go in the garbage.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Best-before is about quality for unopened food stored properly. It may still be good: check it, and when in doubt, throw it out.”", ok:true, why:M2 },
              { t:"“Best-before dates don’t mean anything.”", why:"They tell you about freshness and quality." },
              { t:"“Expiration and best-before mean the same thing.”", why:"Expiration dates are different and appear on only a few products." },
              { t:"“Step 3 is correct.”", why:"Best-before isn’t a safety date." }],
            hints:["What does “best before” describe?", "Freshness and quality.", "Not a safety date: check it."] },
          { id:"e2", goal:2, task:"A store has 20 safe, unsold sandwiches at closing. Choose the best option.",
            steps:["“The sandwiches are safe and were kept cold.”", "“Landfill is the worst option because it creates methane.”", "“Composting returns nutrients to soil, so composting is the best option.”", "“Send them to the compost.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Safe food that can feed people should go to a food rescue partner first; compost is near the bottom of the hierarchy.”", ok:true, why:M3 },
              { t:"“Send them to landfill.”", why:"That’s the least preferred option." },
              { t:"“Feed them to animals first.”", why:"People come before animals for safe food." },
              { t:"“Step 3 is correct.”", why:"Compost recovers only nutrients; feeding people uses the whole food." }],
            hints:["What’s second on the pyramid, after prevention?", "Feed people.", "Food rescue partner."] },
          // VERIFY: E3 figures (58%; about a third avoidable)
          { id:"e3", goal:5, task:"Interpret the claim “about a third of all food produced in Canada was avoidable loss or waste”.",
            steps:["“The report estimates that 58% of food is lost or wasted overall.”", "“About a third of all food produced was avoidable: edible food that could have been rescued.”", "“So all 58% could have been eaten if people tried harder.”", "“Waste is entirely about individual effort.”"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"“Part of the 58% is unavoidable (bones, peels, inedible parts), and much of the avoidable part happens in farms, processing and stores, not just homes.”", ok:true, why:"Not everything lost was edible, and waste happens at every stage." },   // module-written why (fix D's line)
              { t:"“None of it is avoidable.”", why:"About a third of all food produced was avoidable." },
              { t:"“Only households waste food.”", why:M1 },
              { t:"“Step 3 is correct.”", why:"Not everything lost was edible, and waste happens at every stage." }],
            hints:["Is every lost or wasted item edible?", "No: bones, peels and trimmings count too.", "Avoidable is the smaller share, spread across every stage."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: where along the chain food is lost, or what best-before dates actually mean?" },
      { id:"j2", q:"In your own words, why is prevention better than composting?" },
      { id:"j3", q:"Explain to a friend the difference between a best-before date and an expiration date, with an example of each." },
      { id:"j4", q:"Which waste-reduction idea could your school or community try? What would you need to find out first?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is an example of <strong>food loss</strong> rather than food waste?",
          options:[
            { t:"Potatoes left in the field because they’re the wrong shape for store standards", ok:true, why:"Lost before reaching retail." },
            { t:"A family throwing out leftovers", why:"That’s household waste." },
            { t:"A restaurant discarding unsold soup", why:"That’s food-service waste." },
            { t:"A store throwing out dented cans", why:"That’s retail waste." }] },
        b:{ prompt:"Which is an example of <strong>food waste</strong> rather than food loss?",
          options:[
            { t:"A family throwing out bread that went stale", ok:true, why:"Wasted after retail, at home." },
            { t:"Apples damaged by hail before harvest", why:"That’s loss at the farm." },
            { t:"Milk spilled at a dairy processing plant", why:"That’s loss in processing." },
            { t:"Fish that spoil on the boat before landing", why:"That’s loss at harvest." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"In Canada, a <strong>best-before date</strong> tells you…",
          options:[
            { t:"How long an unopened food, stored properly, keeps its freshness and quality", ok:true, why:"It’s about quality, not safety." },
            { t:"The date after which the food is unsafe", why:"That isn’t what best-before means." },
            { t:"The date the food was packaged", why:"That’s a “packaged on” date." },
            { t:"Nothing useful at all", why:"It tells you about freshness and quality." }] },
        // VERIFY: K2 B (expiration dates on infant formula and meal replacements)
        b:{ prompt:"Which product must carry an <strong>expiration date</strong> in Canada?",
          options:[
            { t:"Infant formula", ok:true, why:"Expiration dates appear on a few products like formula and meal replacements." },
            { t:"Bread", why:"Bread may have a best-before date." },
            { t:"Yogurt", why:"Yogurt has a best-before date." },
            { t:"Fresh apples", why:"Fresh produce usually has no date." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"On the food recovery hierarchy, which option comes <strong>first</strong>?",
          options:[
            { t:"Preventing waste at the source", ok:true, why:"It saves all the resources used to make the food." },
            { t:"Composting", why:"Compost is near the bottom." },
            { t:"Feeding animals", why:"That’s third." },
            { t:"Landfill", why:"That’s last." }] },
        b:{ prompt:"On the food recovery hierarchy, which option is <strong>least preferred</strong>?",
          options:[
            { t:"Landfill", ok:true, why:"It wastes everything and creates methane." },
            { t:"Composting", why:"Composting is better than landfill." },
            { t:"Feeding animals", why:"That’s third from the top." },
            { t:"Feeding people", why:"That’s second from the top." }] } },
      { id:"t1", cat:"T", goal:[1, 5],
        a:{ prompt:"Model lettuce, per 100 kg: farm 20, processing 5, retail 10, household 25. What share is lost <strong>before</strong> retail, and which single stage is largest?",
          options:[
            { t:"25% lost before retail; the household stage (25 kg) is largest", ok:true, why:"20 + 5 = 25; 25 is the biggest single bin." },
            { t:"35% before retail; retail is largest", why:"Before retail means farm + processing = 25." },
            { t:"60% before retail; farm is largest", why:"60% is the total lost and wasted." },
            { t:"25% before retail; farm is largest", why:"Farm is 20; the household is 25." }] },
        b:{ prompt:"Model apples, per 100 kg: farm 12, processing 3, retail 8, household 17. What share is lost <strong>before</strong> retail, and which single stage is largest?",
          options:[
            { t:"15% lost before retail; the household stage (17 kg) is largest", ok:true, why:"12 + 3 = 15; 17 is the biggest single bin." },   // module-written why
            { t:"25% before retail; retail is largest", why:"Before retail = 12 + 3 = 15." },
            { t:"40% before retail; farm is largest", why:"40% is everything lost and wasted." },
            { t:"15% before retail; farm is largest", why:"Farm is 12; the household is 17." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"A bakery has 20 unsold loaves of safe day-old bread. Best choice?",
          options:[
            { t:"A food rescue partner, so it feeds people", ok:true, why:"Safe food that people can eat ranks just below prevention." },
            { t:"Compost", why:"Compost ranks below feeding people and animals." },
            { t:"Animal feed", why:"People come before animals for safe food." },
            { t:"Landfill", why:"The least preferred option." }] },
        b:{ prompt:"A café has carrot peels and trimmings: safe, but not fit to serve people. Best choice?",
          options:[
            { t:"A farm partner for animal feed", ok:true, why:"The highest level they qualify for." },
            { t:"A food rescue partner", why:"Trimmings aren’t fit to serve people." },
            { t:"Landfill", why:"Animal feed and compost both rank higher." },
            { t:"Compost", why:"Animal feed ranks above compost." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Model baseline (continuous corn): yield 100, soil organic matter falling, erosion high. Which practices make soil <strong>rising</strong> and erosion <strong>low</strong> while keeping yield ≥ 98?",
          options:[
            { t:"Crop rotation + cover crops + no-till", ok:true, why:"Yield 100, soil +1, erosion 1." },
            { t:"Cover crops + no-till only", why:"Soil only reaches steady, and yield is 97." },
            { t:"Summer fallow + no-till", why:"Fallow cuts yield to about 73." },
            { t:"IPM + intercropping", why:"Neither raises soil organic matter." }] },
        b:{ prompt:"In the model, what would adding <strong>summer fallow</strong> to rotation + cover crops + no-till do?",
          options:[
            { t:"Cut yield sharply (by 25) and raise erosion", ok:true, why:"Bare fallow grows nothing one year in four and exposes soil." },
            { t:"Raise yield", why:"Fallow lowers yield." },
            { t:"Have no effect", why:"Every practice changes the model." },
            { t:"Make soil organic matter rise faster", why:"Fallow lowers it (−1)." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the clearest advice about unopened yogurt kept in the fridge and 2 days past its best-before date?",
          options:[
            { t:"“Best-before is about quality, not safety. Unopened and kept cold, it may still be good. Check it, and when in doubt, throw it out.”", ok:true, why:M2 },   // module-written why (M2)
            { t:"“Throw it out; it’s unsafe after the date.”", why:"Best-before isn’t a safety date." },
            { t:"“Best-before dates are just marketing.”", why:"They give real information about quality." },
            { t:"“Eat any food no matter what the label says.”", why:"Expiration dates and storage still matter." }] },
        // VERIFY: C1 B (CFIA wording on expiration dates)
        b:{ prompt:"Which sentence correctly explains an <strong>expiration date</strong>?",
          options:[
            { t:"“Don’t buy, sell or use the product after this date; it may no longer have the nutrients its label promises.”", ok:true, why:"Expiration dates appear on a few products, such as infant formula, and mean don’t use after the date." },   // module-written why
            { t:"“It’s the same as a best-before date.”", why:M2 },
            { t:"“It tells you when the product was packaged.”", why:"That’s “packaged on”." },
            { t:"“It means the food is better after the date.”", why:"The opposite." }] } },
      { id:"c2", cat:"C", goal:5,
        // VERIFY: C2 A (Second Harvest & VCMI, 2019 figures)
        a:{ prompt:"Which caption best describes the Canadian food-waste estimate (Second Harvest &amp; VCMI, 2019)?",
          options:[
            { t:"“Food is lost or wasted at every stage in Canada, and about a third of all food produced was avoidable loss or waste.”", ok:true, why:"The estimate covers every stage, and only part of it was avoidable." },   // module-written why
            { t:"“Households waste 58% of Canada’s food.”", why:"58% covers every stage, not just households." },
            { t:"“Food waste happens only in grocery stores.”", why:"It happens at every stage." },
            { t:"“All 58% could have been eaten.”", why:"Some is inedible: bones, peels, trimmings." }] },
        b:{ prompt:"Which caption best describes the model household audit (2.0 kg total)?",
          options:[
            { t:"“Forgotten food was the biggest reason (45%), followed by date confusion (35%).”", ok:true, why:"0.9 kg forgotten and 0.7 kg date confusion, out of 2.0 kg." },   // module-written why
            { t:"“Date confusion was the biggest reason.”", why:"0.7 kg < 0.9 kg." },
            { t:"“Most waste came from buying too much.”", why:"That was 0.1 kg (5%)." },
            { t:"“The household wasted 45 kg.”", why:"45% of 2.0 kg = 0.9 kg." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A school cafeteria wants to cut waste. Which action is <strong>highest on the hierarchy</strong>?",
          options:[
            { t:"Smaller default portions with free seconds (prevention)", ok:true, why:"Prevents waste before it happens." },
            { t:"Composting plate scraps", why:"That’s recycling, near the bottom." },
            { t:"Donating unserved surplus", why:"Good, but prevention ranks higher." },
            { t:"Buying bigger garbage bins", why:"That doesn’t reduce waste." }] },
        b:{ prompt:"Which cafeteria action is <strong>unsafe</strong> and must be rejected?",
          options:[
            { t:"Re-serving food left on students’ plates", ok:true, why:"Food from someone’s plate is never re-served." },
            { t:"A share table for unopened, packaged items", why:"Unopened items can be shared safely." },
            { t:"Donating unserved surplus through a food rescue group", why:"Safe when handled properly." },
            { t:"Composting plate scraps", why:"Safe and better than landfill." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A student group wants to tackle both food waste and food insecurity in their town. Which plan does both and reflects food insecurity’s main cause?",
          options:[
            { t:"Partner with a food rescue organization, and write to their MPP supporting income-based solutions", ok:true, why:"Rescue reduces waste; food insecurity is mainly about income." },
            { t:"Collect plate leftovers from the cafeteria for families", why:"Unsafe." },
            { t:"Run a food drive, because food rescue alone will end food insecurity", why:"Helpful, but income is the main cause." },
            { t:"Compost cafeteria waste", why:"Reduces landfill only." }] },
        // VERIFY: A2 B (PROOF)
        b:{ prompt:"Why doesn’t food rescue alone solve food insecurity in Canada?",
          options:[
            { t:"Most food insecurity comes from low income; rescued food helps, but can’t replace adequate income", ok:true, why:M6 },   // module-written why (M6)
            { t:"Rescued food is unsafe to eat", why:"Rescued food is handled under safety rules." },
            { t:"Canada has no food waste to rescue", why:"There’s plenty of avoidable waste." },
            { t:"Food insecurity only exists in other countries", why:"It affects many Canadian households." }] } }
    ]
  },
  task:{
    title:"Cafeteria waste plan",
    summary:"Cafeteria waste plan",
    statement:"<p>Your school cafeteria sends too much to landfill. Choose exactly three actions that together meet every condition. Can you find all the answers?</p><p class=\"tiny muted\">Landfill cuts and costs are per week. <span class=\"hfa-model\">Model data</span></p>",
    // plan's action chips (model data per week)
    chips:[
      { id:"a", t:"Trayless lunch line", cut:6, cost:0, type:"Prevention" },
      { id:"b", t:"Smaller default portions with free seconds", cut:8, cost:0, type:"Prevention" },
      { id:"c", t:"Pre-order lunch system", cut:10, cost:15, type:"Prevention" },
      { id:"d", t:"Share table for unopened items", cut:5, cost:5, type:"Recovery" },
      { id:"e", t:"Donate unserved surplus to a food rescue group", cut:9, cost:10, type:"Recovery" },
      { id:"f", t:"Compost plate scraps", cut:12, cost:20, type:"Recycling" },
      { id:"g", t:"Re-serve food left on students’ plates", cut:10, cost:0, type:"Recovery", unsafe:true },
      { id:"h", t:"Buy bigger garbage bins", cut:0, cost:10, type:"None" }
    ],
    checks:["Cuts at least 22 kg a week", "Costs $20 a week or less", "Includes a prevention action", "Includes a recovery or recycling action", "Food-safe", "Exactly three actions"],
    tips:["Prevention actions a and b are free. Use the budget for the others.", "Composting is the biggest cut but costs $20.", "Re-serving plate food is never safe.", "Bigger bins cut nothing.", "Three actions only."],
    afterAt:4,
    after3:"Every answer starts with prevention and adds a way to recover or recycle what’s left: the hierarchy in action.",
    more:"There’s more than one answer. Can you find all of them?",   // module-written (the plan's statement asks for all the answers)
    explainPrompt:"Explain why your plan follows the food recovery hierarchy, and why you rejected the actions you left out.",
    vocab:"Use the words prevention, recovery, hierarchy and food safety.",
    success:"Your plan meets every condition!"   // module-written
  },
  cards:[
    ["Food loss", "Food lost before retail: on farms, at harvest, in storage and processing (e.g. misshapen carrots left in the field)."],
    ["Food waste", "Food thrown out by stores, restaurants and households (e.g. stale bread at home)."],
    // VERIFY: card 3 (Canadian hierarchy wording)
    ["Food recovery hierarchy", "Prevent → feed people → feed animals → industrial use → compost → landfill."],
    ["Why prevention first", "It saves the land, water, energy and work used to make the food."],
    ["Landfill and methane", "Food buried without air releases methane, a strong greenhouse gas."],
    // VERIFY: cards 6 and 7 (CFIA)
    ["Best-before date", "Quality and freshness of unopened food stored properly; not a safety date."],
    ["Expiration date", "Don’t use after it; found on a few products such as infant formula."],
    ["Crop rotation", "Changing crops each season: breaks pest cycles and builds soil."],
    ["Cover crops and no-till", "Keep soil covered and undisturbed: less erosion, more organic matter."],
    ["Integrated pest management (IPM)", "Monitoring pests and using several methods, spraying only when needed."],
    ["Avoidable vs unavoidable waste", "Avoidable = edible food; unavoidable = bones, peels and other inedible parts."],
    ["“When in doubt, throw it out”", "Safety comes first; some harmful bacteria can’t be seen or smelled."]
  ]
};
