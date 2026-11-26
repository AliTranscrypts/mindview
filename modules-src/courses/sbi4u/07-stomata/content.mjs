// SBI4U 07 Stomata Opening and Closing. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/07-stomata.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Guard cells <strong>swell</strong> to open the pore. Their thick inner walls make them bow apart.";
const M2 = "Water is never pumped. K⁺ is moved in, and water follows by osmosis.";
const M3 = "ABA overrides light: in a drought the stomata close even in bright sun.";
const M4 = "Open stomata let CO₂ in <strong>and</strong> water vapour out. That’s the trade-off.";
const M5 = "At the same opening, CO₂ uptake is the same; it’s the water loss that rises.";
const M6 = "High CO₂ inside the leaf means the leaf has plenty, so the stomata partly close.";
const M7 = "Compare with an uncoated leaf and a fully coated leaf before deciding where the stomata are.";
const D5W = "Without ABA, the drought doesn’t close the stomata: water keeps escaping.";

export default {
  id:"07-stomata",
  kind:"topic",
  title:"Stomata opening and closing",
  topic:"Stomata Opening and Closing",
  readyTopic:"stomata opening and closing",
  hero:{
    eq:'<span class="sto-heq">K⁺ in <span aria-hidden="true">→</span> water in <span aria-hidden="true">→</span> pore opens</span>',
    eqLabel:"K⁺ in, then water in, then the pore opens",
    eqSize:"sm",
    headline:"Two cells, one door, one hard choice",
    text:"Every leaf has to breathe in <strong>CO₂</strong>, and every opening it uses also lets <strong>water vapour</strong> escape. <strong>Guard cells</strong> decide how wide each <strong>stoma</strong> opens by moving <strong>K⁺ ions</strong> in or out. Water follows by <strong>osmosis</strong>: swollen guard cells open the door, and limp ones close it.",
    fig:{ html:'<div class="sto-hero" id="sto-hero" role="img" aria-label="A leaf surface seen from above, with one closed stoma between two bean-shaped guard cells. The sun brightens: magenta H⁺ dots leave the guard cells through pumps, ink K⁺ dots enter, and blue water arrows flow in. The guard cells swell and bow apart, and the pore opens. A blue CO₂ arrow enters the pore and a blue water vapour arrow leaves. Then a Dry soil card appears, grey ABA dots arrive, K⁺ and water leave, and the pore closes."></div>' }
  },
  goals:[
    "I can explain how guard cells open and close a stoma using K⁺, osmosis and turgor.",
    "I can name the conditions that open and close stomata, including the role of ABA.",
    "I can explain the trade-off between taking in CO₂ and losing water.",
    "I can predict how changes in light, CO₂, water and air affect stomata and gas exchange.",
    "I can interpret data from experiments on stomata and transpiration.",
    "I can apply these ideas to crops, greenhouses and plants in dry places."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Osmosis", goal:1,
          prompt:"A cell’s solute concentration rises above that of the water around it. What happens?",
          options:[
            { t:"Water moves into the cell by osmosis", ok:true, why:"Water moves toward the higher solute concentration." },
            { t:"Water moves out of the cell.", why:"Water moves toward more solute." },
            { t:"Solutes move in by osmosis.", why:"Osmosis is the movement of <strong>water</strong>." },
            { t:"Nothing; plant cells have walls.", why:"Walls stop bursting, not water movement." }],
          hints:["Osmosis moves which substance?", "Water, toward more dissolved solute.", "Into the cell."] },
        { id:"w2", skill:"Osmosis", goal:1,
          prompt:"What is turgor pressure in a plant cell?",
          options:[
            { t:"The push of the swollen cell contents against the cell wall", ok:true, why:"Water-filled cells press on their walls: that’s what keeps them firm." },
            { t:"The pull of the wall on the nucleus.", why:"It’s the contents pushing out." },
            { t:"The pressure of air in the leaf.", why:"Turgor is inside cells, from water." },
            { t:"The force of xylem pumping water.", why:"Xylem doesn’t pump; turgor is a cell’s own pressure." }],
          hints:["What makes lettuce crisp?", "Water-filled cells pressing on their walls.", "Turgor pressure."] },
        { id:"w3", skill:"Leaf gas exchange", goal:3,
          prompt:"During the day, which gases pass through open stomata?",
          options:[
            { t:"CO₂ in; O₂ and water vapour out", ok:true, why:"CO₂ comes in for photosynthesis; O₂ and water vapour leave." },
            { t:"O₂ in; CO₂ out.", why:"In daylight, photosynthesis uses more CO₂ than respiration makes." },
            { t:"Only O₂ out.", why:"CO₂ must come in and water vapour escapes too." },
            { t:"Only water vapour out.", why:"The point of opening is to let CO₂ in." }],
          hints:["What does photosynthesis need from the air?", "CO₂ in, O₂ out.", "And water vapour is lost."] },
        { id:"w4", skill:"Leaf gas exchange", goal:2,
          prompt:"In many broad leaves, where are most stomata found?",
          options:[
            { t:"On the lower surface", ok:true, why:"It’s shaded and cooler, so less water is lost." },
            { t:"On the upper surface.", why:"The sunny side would lose more water." },
            { t:"Only along the veins.", why:"Stomata are spread across the epidermis." },
            { t:"Inside the palisade layer.", why:"Stomata are pores in the epidermis." }],
          hints:["Which surface is cooler?", "The one facing the ground.", "Lower surface."] },
        { id:"w5", skill:"Active transport", goal:1,
          prompt:"A membrane pump moves H⁺ out of a cell against its gradient. What does it need?",
          options:[
            { t:"Energy, usually from ATP", ok:true, why:"Moving ions uphill takes energy, usually from ATP." },
            { t:"Nothing; ions cross freely.", why:"Charged ions need proteins and, uphill, energy." },
            { t:"Light hitting the pump directly.", why:"Light can trigger it, but ATP powers it." },
            { t:"A channel protein.", why:"Channels only allow downhill movement." }],
          hints:["Uphill or downhill?", "Uphill.", "Energy from ATP."] },
        { id:"w6", skill:"Active transport", goal:1,
          prompt:"After H⁺ is pumped out, the inside of a guard cell becomes more negative. Which ion is then pulled in through channels?",
          options:[
            { t:"K⁺", ok:true, why:"A positive ion is drawn toward the negative inside." },
            { t:"Cl⁻", why:"A negative ion would be pushed away from a negative inside. (In real guard cells Cl⁻ enters by a separate carrier; the main charge-driven entry is K⁺.)" },
            { t:"H⁺", why:"H⁺ was just pumped out against its gradient." },
            { t:"Water", why:"Water isn’t an ion; it follows by osmosis." }],
          hints:["Opposite charges attract.", "Which cation moves in?", "K⁺."] }
      ],
      refreshers:{
        "Osmosis":"Water moves across a membrane toward the side with more dissolved solute. Swollen plant cells push on their walls (turgor).",
        "Leaf gas exchange":"By day, CO₂ enters through stomata, O₂ leaves, and water vapour escapes (transpiration). Most stomata are on the lower surface.",
        "Active transport":"Pumps move ions uphill using ATP; channels let ions run downhill."
      }
    }
  },
  explore:{
    heading:"Guard cell simulator",
    intro:"Change the light, the CO₂ inside the leaf, the soil water and the air. Watch the guard cells, the pore and the leaf’s gas exchange.",
    modelNote:"Model rules. Real guard cells also take up Cl⁻ and make malate, and their responses blend gradually; the model uses K⁺ only and step rules.",
    dayNote:"In Normal air.",
    // Leaf over a day (plan table): pore width (μm) for hours 0–24
    days:[
      { id:"ww", t:"Well-watered summer day", w:[0, 0, 0, 0, 0, 0, 2, 4, 6, 8, 8, 8, 8, 8, 8, 8, 8, 6, 4, 2, 0, 0, 0, 0, 0] },
      { id:"dry", t:"Dry spell day", w:[0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0] }
    ],
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Start: Dark, Normal CO₂, Wet soil, Normal air. Change: Light → Bright. What happens to the K⁺ inside the guard cells?",
        options:[
          { t:"It rises (to 420 mmol/L)", ok:true },
          { t:"It falls" },
          { t:"It stays at 100" },
          { t:"K⁺ leaves and water enters" }],
        explain:"H⁺ pumping draws K⁺ in; water follows; the cells swell and the pore opens to 8 μm.",
        start:{ light:"dark", co2:"normal", soil:"wet", air:"normal" }, to:{ light:"bright" } },
      { id:"p2", prompt:"Start: Bright, Normal CO₂, Wet soil. Change: Soil → Dry. What happens to the pore?",
        options:[
          { t:"It closes completely, even in bright light", ok:true },
          { t:"It stays at 8 μm because it’s bright" },
          { t:"It opens wider to get more water" },
          { t:"It halves to 4 μm" }],
        explain:"ABA, the drought signal, overrides light.",
        start:{ light:"bright", co2:"normal", soil:"wet", air:"normal" }, to:{ soil:"dry" } },
      { id:"p3", prompt:"Start: Bright, Normal CO₂, Wet soil. Change: CO₂ → High. What happens to the pore?",
        options:[
          { t:"It narrows to 4 μm", ok:true },
          { t:"It widens to 12 μm" },
          { t:"It stays at 8 μm" },
          { t:"It closes completely" }],
        explain:"Lots of CO₂ inside means the leaf doesn’t need the door so wide; it saves water.",
        start:{ light:"bright", co2:"normal", soil:"wet", air:"normal" }, to:{ co2:"high" } },
      { id:"p4", prompt:"Start: Bright, Normal CO₂, Wet soil, Normal air. Change: Air → Hot and dry. What happens to CO₂ uptake and water loss?",
        options:[
          { t:"CO₂ uptake stays at 8; water loss rises from 16 to 24", ok:true },
          { t:"Both rise" },
          { t:"CO₂ uptake falls; water loss stays" },
          { t:"Both fall" }],
        explain:"The pore is the same width, so the same CO₂ enters. Drier, hotter air pulls out more water through it.",
        start:{ light:"bright", co2:"normal", soil:"wet", air:"normal" }, to:{ air:"hot" } }
    ],
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Open the stomata to exactly 8 μm.",
        why:"Bright light gives 8 μm, Normal CO₂ leaves it there, and wet soil means no ABA to halve it.",
        general:"Set the Guard cells mode controls so the pore is exactly 8 μm.",
        hints:["Which light setting gives the widest start?", "Bright gives 8 before any CO₂ change.", "Bright, Normal CO₂, Wet soil."] },
      { id:"tc2", goal:[2, 4], prompt:"Make the guard cells hold exactly 260 mmol/L of K⁺.",
        why:"260 = 100 + 40 × 4, so any setting with a 4 μm pore works.",
        general:"K⁺ = 100 + 40 × pore width. You need 260 mmol/L.",
        hints:["K⁺ = 100 + 40 × width.", "260 − 100 = 160, and 160 ÷ 40 = 4 μm.", "Any setting with a 4 μm pore: e.g. Dim, Normal, Wet."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"A greenhouse keeps the air Normal. Get the <strong>most</strong> CO₂ uptake possible while water loss stays <strong>below</strong> 12 units per hour.",
        why:"Bright light and Low CO₂ give 10 μm; moderate watering halves it to 5 μm: uptake 5, loss 10.",
        general:"In Normal air, loss = 2 × width. Keep it below 12 and make the width as big as you can.",
        hints:["Loss = 2 × width must be below 12, so the width must be 5 or less.", "Which settings give exactly 5 μm?", "Bright and Low CO₂ give 10; moderate watering halves it to 5."] }
    ]
  },
  part3:{
    slug:"tradeoff", name:"Trade-off", heading:"The transpiration trade-off",
    intro:"The simulator shows one moment. Here you read whole days, a classic experiment and a Prairie farm: from the mechanism to the evidence.",
    panel:"Check it with data",
    s1:{ title:"Station 1: two days",
      how:"Step through the day hour by hour. The running totals add up the hourly pore widths, in Normal air.",
      sums:[
        "<strong>Well-watered day:</strong> 2 + 4 + 6 + (8 × 8) + 6 + 4 + 2 = 88, so CO₂ uptake is 88 units and water loss 176.",
        "<strong>Dry spell day:</strong> 2 + 4 + 4 + 2 + 2 = 14, so CO₂ uptake is 14 units and water loss 28."],
      prompts:[
        { q:"Why does the dry-spell leaf close at 9 h?", a:"ABA: the soil dries in the heat, and the drought signal closes the stomata, even in bright light." },
        { q:"How much less sugar can the dry-spell leaf make, roughly?", a:"CO₂ 14 vs 88: about one-sixth as much." }] },
    s2:{ title:"Station 2: the petroleum-jelly leaves (investigation)",
      how:"Four identical leaves hang for 24 h. Petroleum jelly blocks stomata where it’s spread. Hang the leaves, then read the mass each one lost.",
      leaves:[
        { id:"A", coat:"none", up:false, low:false, loss:1.2 },
        { id:"B", coat:"upper only", up:true, low:false, loss:1.1 },
        { id:"C", coat:"lower only", up:false, low:true, loss:0.2 },
        { id:"D", coat:"both", up:true, low:true, loss:0.1 }],
      prompts:[
        { q:"Which surface has most of the stomata?", a:"The lower surface: coating it cut the loss the most." },
        { q:"What is leaf D for?", a:"The baseline: water lost even with every stoma blocked, through the cuticle." },
        { q:"What is the independent variable?", a:"Which surface is coated." }],
      m7:M7 },
    s3:{ title:"Station 3: zoom to the molecules and to the farm",
      how:"Step through the close-up of a guard cell’s membrane in a drought.",
      steps:[
        "A swollen guard cell: plenty of K⁺ inside, and the K⁺ channels are shut.",
        "The soil dries. ABA arrives at the guard cell.",
        "ABA binds receptors on the guard-cell membrane.",
        "K⁺ channels open outward, and K⁺ leaves.",
        "Water follows by osmosis. The guard cell goes limp, and the pore closes."],
      farmTitle:"A Prairie wheat field in a dry July",
      farm:"<p>In a dry July on the Prairies, the soil under a wheat field dries out. The plants make ABA, and their stomata close for much of the day. That saves water, but the same closed door keeps CO₂ out, so the plants make less sugar and fill smaller grains.</p><p>Plant breeders look for wheat varieties that keep more water in a drought, for example by closing their stomata sooner. The cost is the same trade-off: less CO₂ taken in, so a smaller harvest in a good year. Breeders try to balance the two for the weather a region usually gets.</p>" },
    quickCheck:{
      title:"Quick check", summary:"Trade-off quick check",
      items:[
        { id:"q1", goal:5, fixedOrder:true, prompt:"In the jelly experiment, which leaf is the control for ‘stomata open everywhere’?",
          right:"A has nothing blocked.", wrong:"A has nothing blocked.",
          choices:[{ t:"A", ok:true }, { t:"B" }, { t:"C" }, { t:"D" }] },
        { id:"q2", goal:5, prompt:"Leaf C lost far less than leaf B. So…",
          right:"Blocking the lower surface stopped most loss.", wrong:"Blocking the lower surface stopped most loss.",
          choices:[{ t:"most stomata are on the lower surface", ok:true }, { t:"most are on the upper surface" }, { t:"jelly adds mass" }, { t:"the leaves differ in size" }] },
        { id:"q3", goal:2, prompt:"On the dry-spell day, the stomata close at midday mainly because of…",
          right:"It’s bright and warm; the drought signal closes them.", wrong:"It’s bright and warm; the drought signal closes them.",
          choices:[{ t:"ABA", ok:true }, { t:"darkness" }, { t:"high CO₂" }, { t:"cold" }] },
        { id:"q4", goal:3, prompt:"Closing stomata in a drought saves water but also…",
          right:"The door that lets water out is the door CO₂ comes in.", wrong:"The door that lets water out is the door CO₂ comes in.",
          choices:[{ t:"cuts CO₂ intake and photosynthesis", ok:true }, { t:"raises CO₂ intake" }, { t:"makes more ABA in the air" }, { t:"speeds up the Calvin cycle" }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"steps", type:"custom", title:"Put the steps in order", summary:"Put the steps in order", goal:[1, 2],
        instruction:"Put each sequence of events in the order it happens.",
        how:"Tap a step, then use Move up and Move down to put it in place. Press Check when the order is right.",
        sequences:[
          { id:"s1", goal:1, prompt:"Opening.",
            steps:["Blue light is detected by the guard cells.", "H⁺ pumps, powered by ATP, push H⁺ out of the guard cells.", "K⁺ flows into the guard cells through channels.", "The solute concentration inside the guard cells rises.", "Water enters by osmosis, and the guard cells swell.", "The thick inner walls make the swollen cells bow apart, and the pore opens."],
            start:[4, 1, 5, 2, 0, 3],
            rules:[
              { first:[2, 3], then:[4], fb:"Water only follows once K⁺ has raised the solute concentration." },
              { first:[4], then:[5], fb:"Cells swell <strong>because</strong> water enters." }],
            why:"Light → pumps → K⁺ → solutes → water → bowing.",
            hints:["What has to happen before water can move in?", "Solutes must build up first.", "Light → pumps → K⁺ → solutes → water → bowing."] },
          { id:"s2", goal:2, prompt:"Closing in a drought.",
            steps:["The soil dries and the plant makes ABA.", "ABA reaches the guard cells and binds receptors.", "K⁺ leaves the guard cells.", "Water leaves by osmosis.", "The guard cells go limp and the pore closes."],
            start:[3, 0, 4, 2, 1],
            rules:[{ first:[2, 3], then:[4], fb:"The pore closes because the cells lose water, which follows K⁺." }],
            why:"Dry soil → ABA → K⁺ out → water out → limp guard cells → closed pore.",
            hints:["What starts the closing in a drought?", "The plant makes ABA, and it reaches the guard cells.", "ABA → K⁺ out → water out → limp cells → pore closes."] }
        ] },
      { id:"data", type:"custom", title:"Data and design", summary:"Data and design", star:true, goal:[3, 4, 5, 6],
        instruction:"Six problems on stomatal counts, the model and experiments. D3 to D6 are non-routine (★).",
        how:"",
        items:[
          { id:"d1", kind:"num", goal:5, prompt:"A microscope field of view covers 0.2 mm² of a leaf’s lower surface and shows 12 stomata. What is the stomatal density per mm²?",
            answer:60, display:"60 stomata per mm²", unit:"per mm²",
            why:"Density = count ÷ area: 12 ÷ 0.2 = 60.",
            wrong:[{ match:2.4, fb:"Divide the count by the area: 12 ÷ 0.2." }],
            general:"Divide the count by the area: 12 ÷ 0.2.",
            hints:["Density = count ÷ area.", "12 ÷ 0.2.", "60 per mm²."] },
          { id:"d2", kind:"num", goal:5, prompt:"The same leaf’s upper surface shows 3 stomata in 0.2 mm². How many times as dense is the lower surface?",
            answer:4, display:"4 times as dense", unit:"times",
            why:"Upper: 3 ÷ 0.2 = 15 per mm². Lower: 60 per mm². 60 ÷ 15 = 4.",
            general:"60 ÷ 15 = 4.",
            hints:["First find the upper surface’s density.", "3 ÷ 0.2 = 15 per mm².", "60 ÷ 15 = 4."] },
          { id:"d3", kind:"num", goal:3, star:true, prompt:"In the model, a pore of 6 μm in hot, dry air loses how much water per unit of CO₂ taken in?",
            answer:3, display:"3 units of water per unit of CO₂", unit:"units of water",
            why:"Loss = 6 × 3 = 18 and uptake = 6, so 18 ÷ 6 = 3.",
            wrong:[{ match:6, fb:"Loss = 6 × 3 = 18 and uptake = 6, so 18 ÷ 6 = 3." }],
            general:"Loss = 6 × 3 = 18 and uptake = 6, so 18 ÷ 6 = 3.",
            hints:["Find the water loss and the CO₂ uptake.", "Loss = 6 × 3 = 18; uptake = 6.", "18 ÷ 6 = 3."] },
          { id:"d4", kind:"num", goal:6, star:true, prompt:"A greenhouse raises CO₂ from Normal to High at Bright light, Wet soil, Normal air. By how much does water loss fall per hour?",
            answer:8, display:"8 units per hour", unit:"units per hour",
            why:"The pore goes from 8 to 4 μm: loss 16 → 8.",
            general:"The pore goes from 8 to 4 μm: loss 16 → 8.",
            hints:["What does High CO₂ do to an 8 μm pore?", "It narrows to 4 μm.", "Loss 16 → 8: it falls by 8."] },
          { id:"d5", kind:"mc", goal:4, star:true, prompt:"A mutant cannot make ABA. In the model, on Bright, Normal-CO₂, <strong>Dry</strong>-soil settings, its pore would be… and the risk is…",
            options:[
              { t:"8 μm; wilting", ok:true, why:D5W },
              { t:"0 μm; starvation", why:D5W },
              { t:"4 μm; none", why:D5W },
              { t:"8 μm; none", why:D5W }],
            hints:["In the model, what closes the stomata in dry soil?", "ABA. Without it, only the light and CO₂ rules apply.", "Bright and Normal CO₂ give 8 μm, so water keeps escaping: wilting."] },
          { id:"d6", kind:"num", goal:3, star:true, prompt:"Two leaves take in the same CO₂ in a day: leaf X in humid air, leaf Y in hot, dry air. If X loses 30 units of water, how much does Y lose?",
            answer:90, display:"90 units", unit:"units",
            why:"Same pore widths give the same CO₂; Y’s factor is 3 vs X’s 1, so Y loses 30 × 3 = 90.",
            wrong:[{ match:30, fb:"Same pore widths give the same CO₂; Y’s factor is 3 vs X’s 1." }],
            general:"Same pore widths give the same CO₂; Y’s factor is 3 vs X’s 1.",
            hints:["What sets CO₂ uptake?", "Only the pore width, so the widths match.", "Water loss × 3: 90."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Caleb", how:"",
        instruction:"Caleb made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain how a stoma opens in the morning.",
            steps:["Light is detected by the guard cells.", "Pumps in the guard cells use ATP to push water into the cells.", "The guard cells swell.", "Their thick inner walls make them bow apart, opening the pore."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. Look earlier.", "Step 4 is correct on its own."],
            fixes:[
              { t:"Pumps push H⁺ out; K⁺ flows in; water then follows by osmosis.", ok:true, why:M2 },
              { t:"Pumps push K⁺ out, and water follows.", why:"That closes the pore." },
              { t:"Pumps push glucose in.", why:"K⁺ is the main solute that moves." },
              { t:"Step 2 is correct.", why:"Water is never pumped." }],
            hints:["Can a pump move water?", "Water moves only by osmosis.", "K⁺ in first."] },
          { id:"e2", goal:4, task:"Predict what happens to the stomata when a greenhouse adds extra CO₂.",
            steps:["Extra CO₂ raises the CO₂ inside the leaf.", "Guard cells sense the high CO₂ and open wider to let in even more.", "So the plant loses more water.", "So it needs more watering."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier.", "Step 4 follows step 3."],
            fixes:[
              { t:"High CO₂ inside the leaf makes the stomata partly close, so the plant loses <strong>less</strong> water per hour.", ok:true, why:M6 },
              { t:"The stomata stay exactly the same.", why:"CO₂ level is one of the signals." },
              { t:"The stomata close completely.", why:"In bright light they only narrow." },
              { t:"Step 2 is correct.", why:M6 }],
            hints:["Does the leaf need a wide door if CO₂ is plentiful?", "No.", "They partly close."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the simulator: that ABA beats bright light, or that hot air costs water without changing CO₂ uptake?" },
      { id:"j2", q:"In your own words, explain why guard cells need K⁺ to open the pore." },
      { id:"j3", q:"Explain to a friend what the petroleum-jelly experiment shows, and why leaf D matters." },
      { id:"j4", q:"Which part of stomata control are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How do guard cells open a stoma?", options:[
          { t:"They take in K⁺, water follows by osmosis, and the swollen cells bow apart", ok:true, why:M1 },
          { t:"They shrink and pull apart.", why:M1 },
          { t:"They pump water in directly.", why:M2 },
          { t:"They dissolve the cell wall between them.", why:"The pore is a gap between intact cells." }] },
        b:{ prompt:"Why do guard cells close a stoma when they lose K⁺?", options:[
          { t:"Water leaves by osmosis, the cells go limp, and the pore closes", ok:true, why:"Losing K⁺ lowers the solute concentration, so water leaves and the cells lose their turgor." },
          { t:"They swell and press the pore shut.", why:M1 },
          { t:"Water is pumped out of them.", why:M2 },
          { t:"The pore fills with K⁺.", why:"K⁺ leaves the cells; it doesn’t plug the pore." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which set of conditions opens stomata the widest?", options:[
          { t:"Bright light, low CO₂ inside the leaf, plenty of soil water", ok:true, why:"Light and low CO₂ open stomata, and wet soil means no ABA to close them." },
          { t:"Darkness, high CO₂, dry soil.", why:"All three close stomata." },
          { t:"Bright light, high CO₂, dry soil.", why:M3 + " " + M6 },
          { t:"Darkness, low CO₂, wet soil.", why:"Darkness keeps them closed." }] },
        b:{ prompt:"In a drought, what closes the stomata even in bright light?", options:[
          { t:"The hormone abscisic acid (ABA)", ok:true, why:M3 },
          { t:"Extra K⁺ in the guard cells.", why:"Extra K⁺ opens them." },
          { t:"Low CO₂ inside the leaf.", why:"Low CO₂ opens them." },
          { t:"Bright light itself.", why:M3 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which is the trade-off that open stomata create?", options:[
          { t:"CO₂ enters for photosynthesis, but water vapour is lost", ok:true, why:M4 },
          { t:"O₂ enters, but CO₂ is lost.", why:"By day CO₂ enters and O₂ leaves." },
          { t:"Light enters, but heat is lost.", why:"Stomata are for gases, not light." },
          { t:"Only O₂ leaves; nothing is lost.", why:M4 }] },
        b:{ prompt:"What is transpiration?", options:[
          { t:"The loss of water vapour from a plant, mostly through open stomata", ok:true, why:"Most of the water a plant takes up leaves as vapour through its stomata." },
          { t:"The uptake of CO₂ through stomata.", why:"That’s gas exchange for photosynthesis." },
          { t:"The movement of sugar in the phloem.", why:"That’s translocation." },
          { t:"The splitting of water in the light reactions.", why:"That’s photolysis." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"In the model, a leaf has an 8 μm pore in Normal air. The air becomes Hot and dry, and nothing else changes. What happens to CO₂ uptake and water loss?", options:[
          { t:"CO₂ uptake stays at 8; water loss rises from 16 to 24", ok:true, why:M5 },
          { t:"Both rise by half.", why:M5 },
          { t:"CO₂ uptake falls to 4; water loss stays at 16.", why:M5 },
          { t:"Both stay the same.", why:"The air factor changes water loss." }] },
        b:{ prompt:"In the model, a leaf has a 6 μm pore in Humid air. The air becomes Normal, and nothing else changes. What happens to CO₂ uptake and water loss?", options:[
          { t:"CO₂ uptake stays at 6; water loss doubles from 6 to 12", ok:true, why:M5 },
          { t:"Both double.", why:M5 },
          { t:"CO₂ uptake halves; water loss stays at 6.", why:M5 },
          { t:"Both stay the same.", why:"The air factor changes water loss." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"A chemical blocks the H⁺ pumps in guard cells. What happens to the stomata in bright light, and why?", options:[
          { t:"They stay closed: without H⁺ pumping, K⁺ doesn’t enter, so water doesn’t follow and the cells don’t swell", ok:true, why:"Opening starts with the pumps: no H⁺ out, no K⁺ in, no water in." },
          { t:"They open wider, because H⁺ stays inside.", why:"H⁺ pumping is the first step of opening." },
          { t:"They open normally, because light opens stomata.", why:M3 + " Light works <strong>through</strong> the pumps." },
          { t:"They open, because water is pumped in instead.", why:M2 }] },
        b:{ prompt:"A mutant plant can’t make ABA. What happens to its stomata during a drought on a sunny day, and what’s the risk?", options:[
          { t:"They stay open, so it keeps losing water and may wilt", ok:true, why:"Without ABA, nothing tells the guard cells to close, so water keeps escaping." },
          { t:"They close, because the soil is dry.", why:"Without ABA, the drought signal never reaches the guard cells." },
          { t:"They close, because light closes stomata.", why:M3 },
          { t:"They open wider to draw up more water.", why:"Open stomata lose water; they don’t draw it in." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A floating water-lily leaf is tested with petroleum jelly for 24 h: uncoated loses 1.0 g; upper coated 0.2 g; lower coated 0.9 g; both coated 0.1 g. What do the data show?", options:[
          { t:"Most of its stomata are on the upper surface", ok:true, why:"Coating the upper surface cut the loss the most." },
          { t:"Most are on the lower surface.", why:"Coating the lower surface hardly changed the loss." },
          { t:"Stomata are equal on both surfaces.", why:"The two single-coat results differ a lot." },
          { t:"The jelly doesn’t work on water plants.", why:"Leaf D shows it blocks nearly all loss." }] },
        b:{ prompt:"An iris leaf grows upright, with both surfaces equally lit: uncoated 1.2 g; upper coated 0.6 g; lower coated 0.6 g; both coated 0.1 g. What do the data show?", options:[
          { t:"Its stomata are spread about equally between the two surfaces", ok:true, why:"Each single coating cut the loss by the same amount." },
          { t:"Most are on the upper surface.", why:"Each single coating cut the loss by the same amount." },
          { t:"Most are on the lower surface.", why:"Each single coating cut the loss by the same amount." },
          { t:"It has no stomata.", why:"Uncoated leaves lost much more than fully coated ones." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which best explains why many plants partly close their stomata around midday on a hot day?", options:[
          { t:"“Hot, dry air makes each unit of CO₂ cost more water, so the plant trades some photosynthesis for keeping its water.”", ok:true, why:"Partly closing saves water at the cost of some CO₂." },
          { t:"“There’s no light at midday.”", why:"Midday is the brightest time." },
          { t:"“The plant has made enough O₂.”", why:"O₂ isn’t what controls stomata." },
          { t:"“Closing stomata lets more CO₂ in.”", why:"Closing lets less of everything through." }] },
        b:{ prompt:"Which best explains why plants in humid air can keep their stomata open more cheaply?", options:[
          { t:"“Humid air pulls less water out of the leaf, so each unit of CO₂ taken in costs less water.”", ok:true, why:"The same opening loses less water in humid air." },
          { t:"“Humid air contains more CO₂.”", why:"Humidity is water vapour, not CO₂." },
          { t:"“Humid air makes guard cells pump water in.”", why:M2 },
          { t:"“In humid air, stomata don’t lose any water.”", why:"They lose less, not none." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which flow chart correctly shows a stoma opening?", options:[
          { t:"Light → H⁺ pumped out → K⁺ in → water in by osmosis → guard cells swell → pore opens", ok:true, why:"Pumps first, then K⁺, then water, then swelling." },
          { t:"Light → water pumped in → K⁺ in → pore opens", why:M2 },
          { t:"Light → K⁺ out → water out → cells shrink → pore opens", why:M1 },
          { t:"Light → ABA released → pore opens", why:"ABA closes stomata." }] },
        b:{ prompt:"Which flow chart correctly shows a stoma closing in a drought?", options:[
          { t:"Dry soil → ABA → K⁺ out → water out by osmosis → guard cells go limp → pore closes", ok:true, why:"ABA starts it; water follows K⁺ out; limp cells close the pore." },
          { t:"Dry soil → ABA → K⁺ in → water in → pore closes", why:M1 },
          { t:"Dry soil → water pumped out → pore closes", why:M2 },
          { t:"Dry soil → more light → pore closes", why:M3 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A greenhouse grower raises the CO₂ in the air for tomato plants. Besides faster photosynthesis, what other benefit does the model predict?", options:[
          { t:"The stomata partly close, so the plants lose less water", ok:true, why:M6 },
          { t:"The stomata open wider, so the plants need more water.", why:M6 },
          { t:"The plants stop transpiring completely.", why:"They narrow; they don’t shut." },
          { t:"The plants make more ABA.", why:"Extra CO₂ isn’t a drought signal." }] },
        b:{ prompt:"In a dry July, a Prairie wheat crop grows less, even in full sun. Which explanation fits?", options:[
          { t:"ABA closes the stomata to save water, so less CO₂ enters and less sugar is made", ok:true, why:"The drought signal shuts the door that CO₂ comes in through." },
          { t:"Full sun closes stomata.", why:"Light opens stomata; the drought signal closes them." },
          { t:"The plants have too much CO₂.", why:"Closed stomata mean <strong>less</strong> CO₂ inside." },
          { t:"Sunlight breaks down chlorophyll.", why:"The limit is CO₂ entry." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Pineapple plants open their stomata at night and close them by day. Why does this save water?", options:[
          { t:"Night air is cooler and more humid, so each unit of CO₂ taken in costs less water", ok:true, why:"The same opening loses less water in cool, humid night air (CAM, module 09)." },
          { t:"There’s no CO₂ in the air by day.", why:"CO₂ is always there." },
          { t:"Pineapples don’t need CO₂.", why:"All photosynthesis needs CO₂." },
          { t:"Stomata can’t lose water at night.", why:"They lose less, not none." }] },
        b:{ prompt:"Pine needles have their stomata sunk in pits. Why does this save water?", options:[
          { t:"Still, humid air trapped in the pit slows the loss of water vapour", ok:true, why:"Humid air right at the pore pulls less water out." },
          { t:"The pits stop CO₂ from entering.", why:"CO₂ still diffuses in." },
          { t:"The pits make the needle photosynthesize at night.", why:"That’s a different strategy (CAM)." },
          { t:"The pits pump water back in.", why:M2 }] } }
    ]
  },
  task:{
    title:"A leaf for a dry hillside", summary:"A leaf for a dry hillside",
    statement:"<p>Design a leaf for a shrub on a sunny, dry hillside. It’s a C3 plant, so its stomata must open by day. Can you find all the answers?</p><ol class=\"sto-conds\"><li>Water-loss score is 6 or less.</li><li>CO₂-uptake score is at least 2.</li><li>Stomata open by day.</li></ol>",
    inputs:[
      { id:"dens", label:"Stomatal density <em>D</em>", options:[["low", "Low"], ["med", "Medium"], ["high", "High"]] },
      { id:"place", label:"Where the stomata are", options:[["upper", "Upper only"], ["lower", "Lower only"], ["both", "Both"]] },
      { id:"cut", label:"Cuticle", options:[["thin", "Thin"], ["thick", "Thick"]] },
      { id:"pits", label:"Sunken stomata with hairs", options:[["no", "No"], ["yes", "Yes"]] },
      { id:"time", label:"Stomata open", options:[["day", "Day"], ["night", "Night"]] }],
    factors:{ dens:{ low:1, med:2, high:3 }, place:{ upper:2, lower:1, both:3 }, cut:{ thin:2, thick:1 }, pits:{ no:2, yes:1 }, time:{ day:2, night:1 }, uptake:{ upper:1, lower:1, both:2 } },
    modelTitle:"How the scores work",
    model:"<p><strong>Water-loss score</strong> = <em>D</em> × place × cuticle × pits × timing. Place: upper 2, lower 1, both 3. Cuticle: thin 2, thick 1. Pits: no 2, yes 1. Timing: day 2, night 1.</p><p><strong>CO₂-uptake score</strong> = <em>D</em> × place: upper 1, lower 1, both 2. Density <em>D</em>: Low 1, Medium 2, High 3.</p>",
    checks:["Water-loss score ≤ 6", "CO₂-uptake score ≥ 2", "Opens by day"],
    tips:["Which features cut water loss without cutting CO₂ uptake? A thick cuticle and sunken stomata with hairs cost no CO₂.", "More stomata, or stomata on both surfaces, raise CO₂ uptake.", "This shrub is C3: night-opening belongs to CAM plants."],
    explainPrompt:"Explain how your leaf balances taking in CO₂ against losing water, and why every answer shares some features.",
    vocab:"Use the words stomata, transpiration, cuticle and trade-off.",
    more:"Can you find all the answers?",
    after3:"Every answer has a thick cuticle and sunken stomata. Those two features save water without costing CO₂, so the leaf can afford enough stomata."
  },
  cards:[
    ["Stoma", "A pore in the leaf epidermis, opened and closed by two guard cells"],
    ["Opening", "H⁺ pumped out → K⁺ in → water in by osmosis → guard cells swell and bow apart"],
    ["Closing", "K⁺ out → water out → guard cells go limp → pore closes"],
    ["Why guard cells bow", "Their inner walls are thicker and the wall fibres run around the cell"],
    ["Signals that open stomata", "Light (especially blue), low CO₂ inside the leaf"],
    ["Signals that close stomata", "Darkness, high CO₂ inside the leaf, ABA during water stress"],
    ["ABA", "Abscisic acid: the drought hormone; overrides light and closes stomata"],
    ["Transpiration", "Loss of water vapour from leaves, mostly through stomata"],
    ["The trade-off", "Open stomata let CO₂ in but let water out"],
    ["Water-saving leaf features", "Thick cuticle, sunken stomata with hairs, stomata on the lower surface, fewer stomata"],
    ["Stomatal density", "Number of stomata ÷ area sampled (e.g. per mm²)"]
  ]
};
