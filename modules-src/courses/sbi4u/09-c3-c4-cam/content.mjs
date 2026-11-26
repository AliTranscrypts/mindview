// SBI4U 09 C3, C4 and CAM Photosynthesis and Photorespiration. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/09-c3-c4-cam.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Photorespiration <strong>uses</strong> ATP and releases CO₂ without making sugar or ATP. It’s a costly side-reaction of rubisco.";
const M2 = "All three use the Calvin cycle and rubisco. C4 and CAM just deliver concentrated CO₂ to it.";
const M3 = "C4: two cell types (space). CAM: night and day (time).";
const M4 = "C4 costs about 2 extra ATP per CO₂. In cool climates, where photorespiration is low, C3 plants often do better.";
const M5 = "Closed stomata trap O₂ from the light reactions and let CO₂ run down, so photorespiration <strong>rises</strong>.";
const M6 = "At night CAM plants only <strong>capture</strong> CO₂. The Calvin cycle runs by day, when ATP and NADPH are made.";
const M7 = "C4 plants already concentrate CO₂. Extra CO₂ mostly helps C3 plants, by cutting their photorespiration.";
const MODEL = "Model: <i>o</i> = O₂ events per 10 rubisco reactions. CO₂ fixed = 10 − <i>o</i>; CO₂ lost = <i>o</i> ÷ 2; net carbon gained = 10 − 1.5<i>o</i>; ATP spent = 30 + 2<i>o</i>. C4: <i>o</i> = 0 and 5 ATP per CO₂.";

// Activity 1 sorter: [text, box, feedback if misplaced, hints?]
const BOXES = ["c3", "c4", "cam"];
const SORT = [
  ["Rubisco fixes CO₂ directly in mesophyll cells", "c3", "Only C3 skips the 4-carbon step."],
  ["CO₂ is first fixed into a 4-carbon acid in mesophyll cells and released in bundle-sheath cells", "c4", "Two cell types: separation in space.", ["How many cell types are involved?", "Two: mesophyll and bundle sheath.", "C4."]],
  ["Stomata open at night", "cam", "Night opening is CAM’s water saver."],
  ["Malic acid builds up in vacuoles overnight", "cam", "CO₂ is stored as acid until daylight."],
  ["Kranz anatomy: chloroplast-rich cells ringing each vein", "c4", "Kranz anatomy is the C4 ring of bundle-sheath cells, where rubisco works surrounded by CO₂."],
  ["Most photorespiration on hot, dry days", "c3", "No CO₂-concentrating step."],
  ["Corn and sugarcane", "c4", "Corn and sugarcane are C4 crops of hot, sunny places."],
  ["Wheat, canola and maple trees", "c3", "Wheat, canola and maple trees are C3 plants."],
  ["Pineapple and cacti", "cam", "Pineapple and cacti are CAM plants."],
  ["Spends about 2 extra ATP per CO₂ to concentrate it in other cells", "c4", "The cost of separating in space."],
  ["Captures CO₂ and runs the Calvin cycle at different times of day", "cam", M3, ["Separation in time or space?", "Time.", "CAM."]],
  ["Usually the best performer in cool, moist climates", "c3", M4]
];
function sortItems(){
  return SORT.map(function(s, i){
    const wrong = {}; BOXES.forEach(function(b){ if (b !== s[1]) wrong[b] = s[2]; });
    const it = { id:"i" + (i + 1), t:s[0], answer:s[1], why:s[2], wrong:wrong };
    if (s[3]) it.hints = s[3];
    return it;
  });
}
// Quick check: the same feedback for every wrong chip (plan's "Feedback if wrong"), a "Right." line on the answer
function qc(id, goal, prompt, list, right, wrong){
  return { id:id, goal:goal, prompt:prompt, choices:list.map(function(t, i){ return i === 0 ? { t:t, ok:true, fb:right } : { t:t, fb:wrong }; }) };
}

export default {
  id:"09-c3-c4-cam",
  kind:"topic",
  title:"C3, C4 and CAM photosynthesis",
  topic:"C3, C4 and CAM Photosynthesis and Photorespiration",
  readyTopic:"C3, C4 and CAM photosynthesis",
  hero:{
    eq:'<span class="cc-heq"><span class="cc-heql">Rubisco + <span class="cc-co2"><i class="cc-cdot" aria-hidden="true"></i>CO₂</span> → sugar (Calvin cycle)</span><span class="cc-heql">Rubisco + <span class="cc-o2">O₂</span> → wasted carbon (photorespiration)</span></span>',
    eqLabel:"Rubisco plus CO₂ gives sugar (Calvin cycle). Rubisco plus O₂ gives wasted carbon (photorespiration).",
    eqSize:"sm",
    headline:"The world’s most important enzyme makes a costly mistake",
    text:"Rubisco fixes nearly all the carbon in the food you eat, but it can’t always tell CO₂ from O₂. When it grabs O₂, the plant loses carbon and energy; this is <strong>photorespiration</strong>. <strong>C4</strong> and <strong>CAM</strong> plants have found ways to keep rubisco surrounded by CO₂. One divides the work between cells; the other divides it between night and day.",
    fig:{ html:'<div class="cc-hero" id="cc-hero" role="img" aria-label="Rubisco, an enzyme with an open active site, sits in a leaf cell. CO₂ and O₂ molecules drift past. When CO₂ lands, its brown carbon dot joins a growing sugar chain and the Calvin cycle wheel turns. When O₂ lands, a carbon-lost badge appears, a carbon floats away as CO₂ and an orange ATP is spent. A thermometer rises and the stomata in the corner close: more O₂ lands. Then the picture splits into three panels: C3, a leaf cross-section; C4, a ring of bundle-sheath cells around a vein; CAM, a sun and moon clock."></div>' }
  },
  goals:[
    "I can explain photorespiration and why hot, dry conditions increase it.",
    "I can describe how C4 plants separate CO₂ capture and the Calvin cycle in space.",
    "I can describe how CAM plants separate CO₂ capture and the Calvin cycle in time.",
    "I can predict how temperature and stomata affect a C3 plant’s net carbon gain.",
    "I can interpret data to tell C3 plants from C4 plants.",
    "I can match plants and strategies to climates and apply this to crops and climate change."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Rubisco and the Calvin cycle", goal:1,
          prompt:"What does rubisco normally do?",
          options:[
            { t:"It joins CO₂ to RuBP at the start of the Calvin cycle", ok:true, why:"That’s carbon fixation: CO₂ + RuBP, the first step of the Calvin cycle." },
            { t:"It makes ATP in the thylakoid", why:"That’s ATP synthase." },
            { t:"It splits water to release O₂", why:"That happens at PSII." },
            { t:"It breaks glucose down", why:"That’s respiration." }],
          hints:["First step of the Calvin cycle?", "Carbon fixation.", "CO₂ + RuBP."] },
        { id:"w2", skill:"Rubisco and the Calvin cycle", goal:2,
          prompt:"How many ATP does the Calvin cycle use for each CO₂ fixed?",
          options:[
            { t:"3", ok:true, why:"9 ATP per 3 CO₂." },
            { t:"2", why:"That’s the NADPH per CO₂." },
            { t:"9", why:"That’s per 3 CO₂ (one G3P)." },
            { t:"18", why:"That’s per glucose." }],
          hints:["9 ATP make one G3P.", "One G3P needs 3 CO₂.", "9 ÷ 3 = 3."] },
        { id:"w3", skill:"Stomata and gases", goal:1,
          prompt:"On a hot, dry afternoon a plant closes its stomata. What happens to the CO₂ inside the leaf as photosynthesis continues?",
          options:[
            { t:"It falls, because no new CO₂ enters", ok:true, why:"The Calvin cycle keeps using CO₂, and none comes in to replace it." },
            { t:"It rises, because the leaf makes CO₂", why:"By day, photosynthesis uses more CO₂ than respiration makes." },
            { t:"It stays the same", why:"It’s being used with none coming in." },
            { t:"It turns into O₂", why:"O₂ comes from water, not CO₂." }],
          hints:["Is CO₂ coming in?", "No, the door is shut.", "It falls."] },
        { id:"w4", skill:"Stomata and gases", goal:1,
          prompt:"With the stomata closed, what happens to the O₂ inside the leaf?",
          options:[
            { t:"It builds up, because the light reactions keep making it", ok:true, why:"Water keeps being split, and the O₂ can’t get out." },
            { t:"It falls", why:"O₂ is produced, not used up, by photosynthesis." },
            { t:"It stays the same", why:"It can’t escape." },
            { t:"It becomes water", why:"That’s respiration’s final step, which uses little of it." }],
          hints:["What do the light reactions release?", "O₂.", "Trapped, it builds up."] },
        { id:"w5", skill:"Leaf anatomy", goal:2,
          prompt:"Which cells form a ring tightly around each vein in a leaf?",
          options:[
            { t:"Bundle-sheath cells", ok:true, why:"They wrap the vascular bundle (the vein) like a sheath." },
            { t:"Guard cells", why:"Guard cells surround stomata." },
            { t:"Palisade cells", why:"They line up under the upper epidermis." },
            { t:"Xylem cells", why:"Xylem is inside the vein." }],
          hints:["What’s ‘bundle’ short for?", "The vascular bundle (vein).", "Bundle-sheath cells."] },
        { id:"w6", skill:"Leaf anatomy", goal:3,
          prompt:"Which part of a plant cell can store large amounts of dissolved acids and other substances?",
          options:[
            { t:"The central vacuole", ok:true, why:"The big central vacuole is the cell’s storage sac." },
            { t:"The cell wall", why:"The wall is a structural layer." },
            { t:"The chloroplast’s lumen", why:"The lumen holds H⁺ during the light reactions, not stores of acid." },
            { t:"The nucleus", why:"The nucleus holds DNA." }],
          hints:["Which organelle is a big storage sac?", "It fills most of a mature plant cell.", "The vacuole."] }
      ],
      refreshers:{
        "Rubisco and the Calvin cycle":"Rubisco fixes CO₂ onto RuBP. Each CO₂ fixed costs 3 ATP and 2 NADPH.",
        "Stomata and gases":"Closed stomata stop CO₂ entering and O₂ leaving, so inside the leaf CO₂ falls and O₂ rises.",
        "Leaf anatomy":"Mesophyll cells fill the leaf; bundle-sheath cells wrap each vein; plant cells store substances in a large vacuole."
      }
    }
  },
  explore:{
    heading:"Rubisco’s dilemma",
    intro:"Change the temperature and the stomata, then switch pathways. Watch how often rubisco grabs O₂ instead of CO₂, and what that costs the plant.",
    modelNote:"Model values, rounded: each O₂ event loses half a CO₂ and costs 2 ATP to salvage; C4 spends 5 ATP per CO₂ (3 for the Calvin cycle, 2 to concentrate CO₂). Real values vary with species and conditions. The model shows rubisco’s surroundings, not the whole leaf’s CO₂ budget: a real C4 leaf still needs some CO₂ to enter.",
    aha:"Photorespiration depends on temperature and stomata. C4 trades ATP for freedom from photorespiration; CAM trades speed for water. There’s no single best pathway.",
    strategies:{
      intro:"Tap any step in a diagram to highlight the molecule’s path and read what happens, or press <strong>Play</strong> to run the pathway.",
      c3:{ name:"C3", sub:"one cell type", plants:"wheat, canola, soybeans, most trees",
        steps:[
          { t:"CO₂ enters by day", cap:"By day the stomata open and CO₂ diffuses into a mesophyll cell.", carbon:"CO₂: 1C" },
          { t:"Rubisco fixes CO₂", cap:"In the mesophyll cell’s chloroplast, rubisco joins CO₂ to RuBP. O₂ from the light reactions is right there too, so on hot days rubisco often grabs O₂ instead.", carbon:"1C (CO₂) + 5C (RuBP) = 6C → 2 × 3C" },
          { t:"Calvin cycle makes sugar", cap:"The Calvin cycle turns the fixed carbon into G3P and sugar, in the same mesophyll cell.", carbon:"3 CO₂ (3C) → 1 G3P (3C)" }] },
      c4:{ name:"C4", sub:"separated in space", plants:"corn, sugarcane",
        steps:[
          { t:"CO₂ enters by day", cap:"By day the stomata open and CO₂ diffuses into a mesophyll cell.", carbon:"CO₂: 1C" },
          { t:"PEP carboxylase fixes CO₂", cap:"PEP carboxylase, which ignores O₂, fixes the CO₂ (as bicarbonate) onto PEP, making a 4-carbon acid.", carbon:"1C (CO₂) + 3C (PEP) = 4C acid" },
          { t:"The acid moves inward", cap:"The 4-carbon acid passes into a tightly packed bundle-sheath cell next to the vein (Kranz anatomy).", carbon:"4C acid moves" },
          { t:"CO₂ is released around rubisco", cap:"The acid releases its CO₂, so rubisco in the bundle-sheath cell is surrounded by CO₂ and seldom meets O₂. The 3-carbon leftover returns to the mesophyll; rebuilding PEP costs about 2 ATP per CO₂.", carbon:"4C → 1C (CO₂) + 3C (back to the mesophyll)" },
          { t:"Calvin cycle makes sugar", cap:"The Calvin cycle runs in the bundle-sheath cell, turning the concentrated CO₂ into sugar.", carbon:"3 CO₂ (3C) → 1 G3P (3C)" }] },
      cam:{ name:"CAM", sub:"separated in time", plants:"pineapple, cacti, jade plant",
        steps:[
          { t:"Night: CO₂ enters", cap:"In the cool night the stomata open and CO₂ diffuses into a mesophyll cell, losing little water.", carbon:"CO₂: 1C" },
          { t:"Night: stored as malic acid", cap:"PEP carboxylase fixes the CO₂ into a 4-carbon acid, stored as malic acid in the vacuole. The vacuole’s pH falls all night.", carbon:"1C (CO₂) + 3C (PEP) = 4C malic acid" },
          { t:"Day: stomata close, CO₂ released", cap:"By day the stomata close to save water. Malic acid leaves the vacuole and releases its CO₂ inside the same cell.", carbon:"4C → 1C (CO₂) + 3C" },
          { t:"Day: Calvin cycle runs", cap:"With light-made ATP and NADPH, rubisco and the Calvin cycle turn the released CO₂ into sugar, surrounded by CO₂ behind closed stomata.", carbon:"3 CO₂ (3C) → 1 G3P (3C)" }] }
    },
    predIntro:"Make a prediction first. Then the simulator will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"dil", path:"c3", st:"open", T:20 }, to:{ T:40 },
        prompt:"<span class=\"muted\">C3, stomata open, 20 °C.</span> The leaf warms to 40 °C. How many of every 10 rubisco reactions will use O₂?",
        options:[{ t:"4 (up from 2)", ok:true }, { t:"1 (down from 2)" }, { t:"2 (no change)" }, { t:"10" }],
        explain:"Heat makes rubisco grab O₂ more often, and CO₂ dissolves less well in warm cell fluids than O₂ does." },
      { id:"p2", start:{ mode:"dil", path:"c3", st:"open", T:30 }, to:{ st:"closed" },
        prompt:"<span class=\"muted\">C3, stomata open, 30 °C.</span> The stomata close. What happens to the net carbon gained per 10 reactions?",
        options:[{ t:"It falls from 5.5 to 1", ok:true }, { t:"It rises, because water is saved" }, { t:"It stays at 5.5" }, { t:"It falls to 0 exactly" }],
        explain:"Closed stomata trap O₂ and starve rubisco of CO₂, so photorespiration jumps." },
      { id:"p3", start:{ mode:"dil", path:"c3", st:"closed", T:40 }, to:{ path:"c4" },
        prompt:"<span class=\"muted\">C3, stomata closed, 40 °C (net −0.5).</span> The pathway switches to C4. How often will rubisco now use O₂?",
        options:[{ t:"Almost never (0 in the model)", ok:true }, { t:"Just as often as in C3" }, { t:"More often, since C4 plants live in heat" }, { t:"Never, because C4 plants have no rubisco" }],
        explain:"PEP carboxylase pumps CO₂ into the bundle-sheath cells, where rubisco works surrounded by CO₂." },
      { id:"p4", start:{ mode:"dil", path:"cam", clock:20 }, to:{ clock:6 },
        prompt:"<span class=\"muted\">CAM, clock at 20 h (dusk).</span> The clock runs to 6 h (dawn). What happens to the pH of the vacuoles?",
        options:[{ t:"It falls from 6 to about 4", ok:true }, { t:"It rises to about 8" }, { t:"It stays at 6" }, { t:"It falls only in daylight" }],
        explain:"All night, captured CO₂ is stored as malic acid in the vacuole. By day it’s released to the Calvin cycle and the pH climbs back." }
    ],
    chalIntro:"Use the simulator (Rubisco’s dilemma mode) to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 4], prompt:"C3 pathway: make the net carbon gain exactly 7 per 10 reactions.",
        why:"2 O₂ events: 10 − 1.5 × 2 = 7. Open stomata at 20 °C and partly closed stomata at 10 °C both give 2.",
        hints:["Net = 10 − 1.5 × (O₂ events).", "7 means 2 O₂ events.", "Open at 20 °C, or partly closed at 10 °C."] },
      { id:"tc2", goal:[1, 4], prompt:"C3 pathway: find the setting where the leaf <strong>loses</strong> more carbon than it gains.",
        why:"Closed stomata at 40 °C: 7 O₂ events, so the net is 10 − 1.5 × 7 = −0.5. Photorespiration releases more carbon than rubisco fixes.",
        hints:["Net is below 0 when 1.5 × (O₂ events) is more than 10.", "That needs 7 O₂ events.", "Closed stomata at 40 °C."] },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"Use the ‘Compare C3 and C4’ switch. Mark every temperature-and-stomata cell where a <strong>C4</strong> leaf spends <strong>fewer</strong> ATP per carbon gained than a C3 leaf. (Use the grid below the readout.)",
        why:"C4 always costs 5.0 ATP per carbon. C3 costs more in the nine cells with 3 or more O₂ events per 10, and at closed stomata and 40 °C it gains no carbon at all. In cool, open conditions C3 is cheaper.",
        hints:["C4 always costs 5.0 ATP per carbon.", "C3’s cost passes 5.0 once there are 3 or more O₂ events per 10.", "Mark every cell with 3 or more O₂ events."] }
    ]
  },
  part3:{
    slug:"climates", name:"Climates",
    heading:"Which plant wins where?",
    intro:"The simulator explains the mechanism. Now test it against data and real places: read a graph, interpret an experiment, then match plants to climates.",
    s1:{
      title:"Station 1: rate vs temperature",
      panel:"Check it with data",
      intro:"Net photosynthesis of wheat (C3) and corn (C4) at four leaf temperatures. Read the graph and the table, then answer the prompts.",
      head:["Leaf temperature", "10 °C", "20 °C", "30 °C", "40 °C"],
      rows:[["Wheat (C3)", 40, 60, 45, 20], ["Corn (C4)", 20, 55, 80, 70]],
      yLabel:"net photosynthesis (relative units)",
      prompts:[
        { id:"s1a", prompt:"Between which temperatures do the curves cross?", options:[
          { t:"10 and 20 °C", why:"Wheat is ahead at both 10 °C (40 vs 20) and 20 °C (60 vs 55)." },
          { t:"20 and 30 °C", ok:true, why:"At 20 °C wheat leads (60 vs 55); at 30 °C corn leads (80 vs 45). The curves cross in between." },
          { t:"30 and 40 °C", why:"Corn is already ahead at 30 °C (80 vs 45) and stays ahead at 40 °C (70 vs 20)." }] },
        { id:"s1b", shuffle:true, prompt:"Why does wheat beat corn at 10 °C?", options:[
          { t:"Photorespiration is low in the cold, and C4’s extra ATP cost isn’t repaid", ok:true, why:M4 },
          { t:"Corn has no rubisco", why:M2 },
          { t:"Cold makes wheat’s rubisco grab O₂ more often", why:"Cold makes rubisco grab O₂ <strong>less</strong> often. That’s why C3 does well there." }] },
        { id:"s1c", shuffle:true, prompt:"Why does corn keep working at 40 °C?", options:[
          { t:"CO₂ is concentrated in its bundle-sheath cells, so rubisco seldom meets O₂", ok:true, why:"PEP carboxylase delivers CO₂ to rubisco in the bundle sheath, so heat doesn’t bring on photorespiration." },
          { t:"It opens its stomata at night", why:"That’s CAM. " + M3 },
          { t:"Corn has a different, heat-proof rubisco", why:"It’s the same enzyme. Corn keeps it surrounded by CO₂." }] }
      ]
    },
    s2:{
      title:"Station 2: the oxygen test",
      intro:"Two unknown plants are measured at normal air (21% O₂) and at low oxygen (2% O₂). Light, CO₂ and temperature (30 °C) are kept the same.",
      head:["Plant", "Rate at 21% O₂", "Rate at 2% O₂"],
      rows:[["A", 30, 45], ["B", 50, 51]],
      prompts:[
        { id:"s2a", prompt:"Which plant is C3?", options:[
          { t:"Plant A", ok:true, why:"Removing O₂ removes photorespiration, so plant A’s rate jumps from 30 to 45." },
          { t:"Plant B", why:"Plant B barely changed (50 to 51): it has little photorespiration to remove, so it’s probably C4." }] },
        { id:"s2b", prompt:"Which variables were controlled, and why?", options:[
          { t:"Light, CO₂ and temperature: so only O₂ explains the change", ok:true, why:"Each of these also changes photosynthesis, so keeping them the same makes O₂ the only possible cause." },
          { t:"The O₂ level: so the test is fair", why:"The O₂ level is the variable changed on purpose: the independent variable." },
          { t:"The rate of photosynthesis: so it can be compared", why:"The rate is what was measured: the dependent variable." },
          { t:"None: the plants were the only difference", why:"Light, CO₂ and temperature all change photosynthesis, so they had to be kept the same." }] },
        { id:"s2c", prompt:"What is the dependent variable?", options:[
          { t:"The rate of photosynthesis", ok:true, why:"It’s what was measured as the O₂ level changed." },
          { t:"The O₂ level", why:"That’s the independent variable: it was changed on purpose." },
          { t:"The temperature", why:"Temperature was a controlled variable, kept at 30 °C." },
          { t:"The amount of light", why:"Light was a controlled variable." }] }
      ]
    },
    s3:{
      title:"Station 3: the climate board",
      intro:"Tap a plant card, then tap the climate where it does best. Each card shows its pathway once it’s placed.",
      climates:[
        { id:"cool", t:"Cool, moist Ontario spring" },
        { id:"belt", t:"Hot, humid summer corn belt" },
        { id:"tropic", t:"Tropical lowland" },
        { id:"desert", t:"Hot desert" }],
      plants:[
        { id:"wheat", t:"Wheat", path:"C3", why:"Wheat is C3. In a cool, moist spring rubisco seldom grabs O₂, so wheat doesn’t need to pay for a CO₂ pump." },
        { id:"canola", t:"Canola", path:"C3", why:"Canola is C3: a cool-season crop that grows well where photorespiration is low." },
        { id:"corn", t:"Corn", path:"C4", why:"Corn is C4: in hot weather it concentrates CO₂ around rubisco and avoids photorespiration." },
        { id:"sugarcane", t:"Sugarcane", path:"C4", why:"Sugarcane is C4: heat and bright light suit a plant that concentrates CO₂." },
        { id:"pineapple", t:"Pineapple", path:"CAM", why:"Pineapple is CAM: it opens its stomata at night, so it gets through hot, dry spells with little water. It’s grown in the dry tropics." },
        { id:"saguaro", t:"Saguaro cactus", path:"CAM", why:"The saguaro is CAM: night-time stomata keep water loss low in the desert." },
        { id:"maple", t:"Maple tree", path:"C3", why:"Maples are C3 trees of cool, moist forests, where photorespiration is low." }],
      answer:{ wheat:["cool"], canola:["cool"], maple:["cool"], corn:["belt", "tropic"], sugarcane:["belt", "tropic"], saguaro:["desert"], pineapple:["desert", "tropic"] },
      wrong:{
        "C3|hot":"It’s a C3 plant: in the heat its rubisco grabs O₂ often, and photorespiration wastes much of its carbon.",
        "C3|desert":"It’s a C3 plant: on hot, dry days its stomata close and photorespiration soars.",
        "C4|cool":M4,
        "C4|desert":"C4 plants open their stomata by day. In a desert that loses too much water.",
        "CAM|cool":"CAM plants grow slowly. In a cool, moist climate photorespiration is already low, so C3 plants grow faster.",
        "CAM|hot":"Where water is plentiful, CAM’s night-only CO₂ capture is too slow, so faster C4 plants win."
      },
      done:"Board complete. C3 plants win in the cool, C4 plants in hot, wet places, and CAM plants where water is scarce.",
      zoom:{
        title:"Zoom to the molecules",
        intro:"Offer each enzyme a molecule and watch what it does.",
        co2:"CO₂ (as HCO₃⁻)",
        pep:"PEP carboxylase",
        rub:"Rubisco",
        capCO2:"Both enzymes bind CO₂. PEP carboxylase takes it as bicarbonate (HCO₃⁻) and fixes it onto PEP; rubisco fixes CO₂ onto RuBP.",
        capO2:"PEP carboxylase never binds O₂. Rubisco binds O₂ as well as CO₂: that’s photorespiration. So a C4 or CAM plant’s first step can’t be fooled by O₂.",
        cap0:"PEP carboxylase binds CO₂ (as bicarbonate) but never O₂; rubisco binds both."
      }
    },
    // VERIFY: status of the C4-rice research projects (plan: "verify the current status before release").
    blocks:[
      { title:"STSE: C4 rice and a rising-CO₂ world",
        html:"<p>Rice feeds billions of people, but it’s a C3 plant, so it loses carbon to photorespiration in hot weather. Research projects are trying to give rice C4 traits, such as Kranz anatomy and PEP carboxylase working in the mesophyll cells, to raise yields in hot climates. <span class=\"tiny muted\">(This research is ongoing.)</span></p><p>As CO₂ in the air rises, rubisco grabs O₂ less often. That tends to help C3 crops, such as Canada’s wheat, canola and soybeans, more than C4 crops such as corn. " + M7 + "</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Climates quick check",
      items:[
        qc("q1", 5, "In the oxygen test, plant B barely changed. B is probably…", ["C4", "C3", "not photosynthesizing", "a CAM plant at noon"],
          "Right. B has little photorespiration to remove, so lowering O₂ barely changes its rate.", "Little photorespiration to remove."),
        qc("q2", 5, "In the oxygen test, why keep the temperature the same?", ["Temperature also changes photorespiration", "It’s easier", "Plants need 30 °C", "It doesn’t matter"],
          "Right. Temperature also changes photorespiration: control every variable except O₂.", "Control every variable except O₂."),
        qc("q3", 6, "A crop for a cool, moist Ontario spring:", ["wheat (C3)", "corn (C4)", "pineapple (CAM)", "any, equally"],
          "Right. Photorespiration is low in the cool, so wheat doesn’t need a costly CO₂ pump.", M4),
        qc("q4", 2, "PEP carboxylase helps C4 plants because it…", ["ignores O₂", "makes ATP", "replaces the Calvin cycle", "opens stomata"],
          "Right. PEP carboxylase grabs CO₂ but never O₂, so it can deliver concentrated CO₂ to rubisco.", M2 + " The Calvin cycle still makes the sugar.")
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"C3, C4 or CAM?", noun:"statement", goal:[2, 3, 6], txt:true,
        instruction:"Twelve statements about the three pathways. Sort each one into C3, C4 or CAM.",
        boxes:[{ id:"c3", label:"C3" }, { id:"c4", label:"C4" }, { id:"cam", label:"CAM" }],
        items:sortItems() },
      { id:"probs", type:"custom", title:"Photorespiration problems", summary:"Photorespiration problems", star:true, goal:[1, 4, 5, 6],
        instruction:"Eight problems on the Rubisco’s dilemma model and on telling C3 plants from C4 plants. Problems 3 to 8 are non-routine; the last two go beyond the Final Check.", how:"",
        items:[
          { id:"r1", kind:"num", goal:4, prompt:"C3, 3 O₂ events per 10. Net carbon gained?",
            answer:5.5, display:"5.5 per 10 reactions", unit:"per 10 reactions",
            why:"CO₂ fixed = 10 − 3 = 7; CO₂ lost = 3 ÷ 2 = 1.5; net = 7 − 1.5 = 5.5.",
            wrong:[{ match:7, fb:"Each O₂ event also loses half a CO₂: 7 − 1.5." }] },
          { id:"r2", kind:"num", goal:1, prompt:"C3, 5 O₂ events per 10. CO₂ lost to photorespiration?",
            answer:2.5, display:"2.5 CO₂", unit:"CO₂",
            why:"Half a CO₂ per O₂ event: 5 ÷ 2 = 2.5.",
            general:"Half a CO₂ per O₂ event." },
          { id:"r3", kind:"num", goal:4, star:true, prompt:"C3, Partly closed, 30 °C: ATP per carbon gained?",
            answer:9.5, display:"9.5 ATP per carbon", unit:"ATP per carbon",
            why:"<i>o</i> = 4: ATP spent = 30 + 2 × 4 = 38; net gain = 10 − 1.5 × 4 = 4; 38 ÷ 4 = 9.5.",
            general:"<i>o</i> = 4: 38 ÷ 4." },
          { id:"r4", kind:"num", goal:4, star:true, prompt:"At what number of O₂ events per 10 does a C3 leaf gain no net carbon at all? Give the exact value.",
            answer:20 / 3, display:"20/3 (≈ 6.7) O₂ events", unit:"O₂ events per 10",
            why:"10 − 1.5<i>o</i> = 0, so <i>o</i> = 10 ÷ 1.5 = 20/3 ≈ 6.7.",
            general:"10 − 1.5<i>o</i> = 0.", near:"Close, but that’s a rounded decimal. Give the exact value as a fraction.",
            hints:["Set the net gain to 0.", "1.5<i>o</i> = 10.", "<i>o</i> = 10 ÷ 1.5 = 20/3 ≈ 6.7."] },
          { id:"r5", kind:"chips", goal:5, star:true,
            prompt:"Design the experiment: you want to know whether a new grass is C3 or C4. Which single variable should you change?",
            options:[
              { t:"O₂ level", ok:true, why:"Change only the O₂ level and keep light, CO₂ and temperature fixed: a big jump in rate at low O₂ means C3." },
              { t:"light and O₂ together", why:"Change one variable; keep light, CO₂ and temperature fixed." },
              { t:"species and O₂", why:"Change one variable; keep light, CO₂ and temperature fixed." },
              { t:"nothing", why:"Change one variable; keep light, CO₂ and temperature fixed." }] },
          { id:"r6", kind:"numchip", goal:5, star:true,
            prompt:"A plant’s rate rises from 40 to 60 when O₂ drops from 21% to 2%. By what percentage did removing O₂ raise its rate, and which pathway is it?",
            answer:[50, "C3"], label:"Rise in rate", unit:"%", chipLabel:"Pathway", chips:["C3", "C4", "CAM"], display:"50%; C3",
            why:"20 ÷ 40 = 50%: a big jump means much photorespiration, so it’s C3.",
            wrongFb:"20 ÷ 40 = 50%: a big jump means much photorespiration." },
          { id:"r7", kind:"pair", goal:[2, 6], star:true,
            prompt:"A C4 leaf fixes 10 CO₂. How many ATP does it spend in total, and how many of those are the C4 ‘extra’?",
            answer:[50, 20], labels:["ATP spent in total", "ATP that are the C4 ‘extra’"], display:"50 total; 20 extra",
            why:"5 per CO₂ in all: 10 × 5 = 50. The Calvin cycle uses 3 per CO₂ (30), so the extra is 20.",
            wrongFb:"5 per CO₂ in all; the Calvin cycle uses 3, so 2 per CO₂ is the C4 cost.",
            hints:["C4 spends 5 ATP per CO₂ in the model.", "10 × 5 = 50.", "The Calvin cycle’s share is 30, so the extra is 20."] },
          { id:"r8", kind:"pair", goal:3, star:true, use:"10<sup>1.6</sup> ≈ 40",
            prompt:"A CAM plant’s vacuole pH falls by 0.2 each hour of the night, from 6.0. What is its pH after 8 hours, and how many times more H⁺ does the vacuole hold than at dusk?",
            answer:[4.4, 40], tol:[0.001, 1], labels:["pH after 8 hours", "Times more H⁺ than at dusk"], display:"pH 4.4; about 40 times as much H⁺",
            why:"8 × 0.2 = 1.6, so the pH is 6.0 − 1.6 = 4.4. A 1.6-unit drop is 10<sup>1.6</sup> ≈ 40 times as much H⁺.",
            wrongFb:"6.0 − 1.6 = 4.4; a 1.6-unit drop is 10<sup>1.6</sup> times." }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Darius", how:"",
        instruction:"Darius made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain why photorespiration is wasteful.",
            steps:["Rubisco sometimes adds O₂ to RuBP instead of CO₂.", "This happens more when the leaf is hot and its stomata are closed.", "Photorespiration makes ATP, but less than cellular respiration does.", "So it’s only a little less efficient."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"Photorespiration <strong>uses</strong> ATP and <strong>releases</strong> CO₂ that was already fixed, without making any sugar.", ok:true, why:M1 },
              { t:"Photorespiration makes glucose more slowly.", why:"It makes no sugar." },
              { t:"Photorespiration happens only at night.", why:"It happens in the light, alongside photosynthesis." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Does photorespiration produce anything useful?", "It costs ATP and loses CO₂.", "It uses ATP; it doesn’t make it."] },
          { id:"e2", goal:2, task:"Describe how a corn plant avoids photorespiration.",
            steps:["Corn is a C4 plant.", "It opens its stomata at night and stores CO₂ as malic acid.", "By day it releases the CO₂ to rubisco."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Its mesophyll cells fix CO₂ into a 4-carbon acid and pass it to bundle-sheath cells, where CO₂ is released around rubisco.", ok:true, why:"C4 separates the steps in space. " + M3 },
              { t:"It has no rubisco.", why:M2 },
              { t:"It keeps its stomata closed all day and night.", why:"It still needs CO₂ from the air." },
              { t:"Step 2 is correct.", why:"That’s CAM, separation in time. " + M3 }],
            hints:["C4 separates the steps in space or in time?", "Space: two cell types.", "Mesophyll → bundle sheath."] },
          { id:"e3", goal:6, task:"Advise a farmer near Thunder Bay, where summers are cool and moist.",
            steps:["In cool weather, rubisco grabs O₂ less often.", "So photorespiration is low for C3 crops there.", "C4 crops are always more efficient, so the farmer should grow only C4 crops.", "Corn will out-yield wheat in this climate."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"C4’s extra ATP cost isn’t repaid when photorespiration is low, so C3 crops like wheat or canola are usually the better choice.", ok:true, why:M4 },
              { t:"Grow CAM crops for more growth.", why:"CAM plants grow slowly." },
              { t:"No crop can grow there.", why:"Plenty of C3 crops grow well in cool climates." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Is C4 free?", "It costs about 2 extra ATP per CO₂.", "In the cool, C3 is cheaper."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in Rubisco’s dilemma: that a C3 leaf can lose carbon on a hot day, or that C4 isn’t always cheaper?" },
      { id:"j2", q:"In your own words, explain the difference between separating steps in space (C4) and in time (CAM)." },
      { id:"j3", q:"Explain to a friend how the oxygen test can tell a C3 plant from a C4 plant." },
      { id:"j4", q:"Which part of this module are you still unsure about? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is photorespiration?", options:[
          { t:"Rubisco adding O₂ instead of CO₂ to RuBP, which uses ATP and releases fixed carbon as CO₂ without making sugar", ok:true, why:"It’s a costly side-reaction of rubisco: ATP is spent and carbon is lost, with nothing useful made." },
          { t:"Cellular respiration that happens in leaves in the light", why:M1 },
          { t:"The release of O₂ from splitting water", why:"That’s photolysis." },
          { t:"Making ATP from light in the thylakoids", why:"That’s photophosphorylation." }] },
        b:{ prompt:"Which conditions increase photorespiration in a C3 plant?", options:[
          { t:"Hot temperatures with closed stomata, which raise the O₂ : CO₂ ratio inside the leaf", ok:true, why:"Heat makes rubisco grab O₂ more often, and closed stomata trap O₂ and let CO₂ run down." },
          { t:"Cool temperatures with open stomata", why:"Those keep it low." },
          { t:"Darkness", why:"Rubisco and the light reactions are idle in the dark." },
          { t:"High CO₂ in the air", why:"More CO₂ makes O₂ grabs <strong>less</strong> likely." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"How does a C4 plant keep rubisco surrounded by CO₂?", options:[
          { t:"PEP carboxylase in mesophyll cells fixes CO₂ into a 4-carbon acid, which is moved to bundle-sheath cells and releases CO₂ around rubisco", ok:true, why:"The two cell types separate CO₂ capture from the Calvin cycle in space." },
          { t:"It stores CO₂ in its vacuoles at night", why:"That’s CAM." },
          { t:"It has no rubisco and makes sugar with PEP carboxylase", why:M2 },
          { t:"It closes its stomata permanently", why:"It still needs CO₂ from the air." }] },
        b:{ prompt:"What is Kranz anatomy?", options:[
          { t:"A ring of chloroplast-rich bundle-sheath cells around each vein, where C4 plants run the Calvin cycle", ok:true, why:"‘Kranz’ is German for wreath: the ring of bundle-sheath cells." },
          { t:"Sunken stomata with hairs", why:"That’s a water-saving feature." },
          { t:"A thick cuticle on desert plants", why:"That’s not specific to C4." },
          { t:"Chloroplasts arranged in stacks called grana", why:"Grana are inside every chloroplast." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"How does a CAM plant capture and use CO₂?", options:[
          { t:"It opens its stomata at night and stores CO₂ as malic acid, then releases it to the Calvin cycle by day with its stomata closed", ok:true, why:"CAM separates CO₂ capture and the Calvin cycle in time." },
          { t:"It runs the Calvin cycle at night", why:"There’s no ATP or NADPH from light at night." },
          { t:"It passes CO₂ from mesophyll to bundle-sheath cells", why:"That’s C4." },
          { t:"It takes in CO₂ through its roots", why:"CO₂ enters through stomata." }] },
        b:{ prompt:"Where and in what form does a CAM plant store its CO₂ overnight?", options:[
          { t:"In the vacuoles, as malic acid", ok:true, why:"The vacuole fills with malic acid all night, so its pH falls." },
          { t:"In the chloroplasts, as glucose", why:M6 },
          { t:"In the bundle-sheath cells, as CO₂ gas", why:M3 },
          { t:"In the air spaces, as O₂", why:"O₂ isn’t stored CO₂." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"In the model, a C3 leaf at 30 °C goes from open to closed stomata. Predict its net carbon gain per 10 rubisco reactions and explain.", options:[
          { t:"It falls from 5.5 to 1: O₂ events rise from 3 to 6, and each one also costs half a CO₂", ok:true, why:"10 − 1.5 × 3 = 5.5 and 10 − 1.5 × 6 = 1." },
          { t:"It rises, because closing stomata saves water", why:M5 },
          { t:"It stays at 5.5, because temperature hasn’t changed", why:M5 },
          { t:"It falls to 7", why:"7 corresponds to only 2 O₂ events." }] },
        b:{ prompt:"In the model, a C3 leaf with open stomata cools from 30 °C to 10 °C. Predict its net carbon gain and explain.", options:[
          { t:"It rises from 5.5 to 8.5: O₂ events fall from 3 to 1", ok:true, why:"10 − 1.5 × 3 = 5.5 and 10 − 1.5 × 1 = 8.5." },
          { t:"It falls, because cold slows rubisco", why:"In the model, cooling cuts photorespiration." },
          { t:"It stays at 5.5", why:"Temperature changes the O₂ events." },
          { t:"It rises to 10", why:"There’s still 1 O₂ event per 10." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Plant X photosynthesizes at 30 units in 21% O₂ and 45 units in 2% O₂. Plant Y gives 50 and 51. Which conclusion fits?", options:[
          { t:"X is a C3 plant: removing O₂ removed its photorespiration; Y is a C4 plant", ok:true, why:"A big rise at low O₂ means a lot of photorespiration was removed." },
          { t:"X is C4, because its rate changed more", why:"A big change means a lot of photorespiration to remove." },
          { t:"Both are C3, because both rates rose", why:"Y’s change of 1 unit is too small." },
          { t:"The data can’t tell them apart", why:"The O₂ effect is exactly the test." }] },
        b:{ prompt:"Two crops are grown at 10 °C and at 35 °C. Crop P’s rate falls from 50 to 30; crop Q’s rises from 25 to 70. Which conclusion fits?", options:[
          { t:"P is probably C3 and Q probably C4: Q copes with heat because it avoids photorespiration", ok:true, why:"C3 rates usually fall in heat as photorespiration rises; C4 rates keep climbing." },
          { t:"P is C4, because it does better in the cold", why:M4 },
          { t:"Both are CAM", why:"CAM plants grow slowly at both temperatures." },
          { t:"Q is C3, because its rate rose", why:"C3 rates usually fall in heat." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A newly described plant has thick, fleshy leaves; its stomata open at night; its leaf sap is far more acidic at dawn than at dusk. Which pathway and habitat are most likely?", options:[
          { t:"CAM, in a hot, dry place", ok:true, why:"Night-open stomata and acid that builds up overnight (malic acid) are CAM’s signature, a water saver for dry places." },
          { t:"C4, in a hot, humid grassland", why:"C4 plants open their stomata by day." },
          { t:"C3, in a cool forest", why:"C3 plants don’t build up acid overnight." },
          { t:"C4, in a cool marsh", why:M4 }] },
        b:{ prompt:"A newly described grass has a ring of chloroplast-rich cells around each vein; its outer leaf cells contain PEP carboxylase but almost no rubisco; its stomata open by day. Which pathway and habitat are most likely?", options:[
          { t:"C4, in a hot, sunny grassland", ok:true, why:"Kranz anatomy and PEP carboxylase in the outer (mesophyll) cells are C4’s signature, which pays off in heat and bright light." },
          { t:"CAM, in a desert", why:"CAM opens its stomata at night." },
          { t:"C3, in a cool, shady forest", why:"C3 plants lack this anatomy." },
          { t:"CAM, in a cool lake", why:M3 }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the clearest explanation of why C4 plants rarely photorespire?", options:[
          { t:"“They first fix CO₂ with PEP carboxylase, which ignores O₂, and release it in the bundle-sheath cells, so rubisco there is surrounded by CO₂ and seldom meets O₂.”", ok:true, why:"It names the enzyme that ignores O₂, where the CO₂ is released, and why rubisco then seldom meets O₂." },
          { t:"“They don’t have rubisco.”", why:M2 },
          { t:"“They keep their stomata closed all day.”", why:"Closed stomata would <strong>raise</strong> photorespiration in a C3 plant; C4 plants still take in CO₂." },
          { t:"“They photosynthesize only at night.”", why:M3 }] },
        b:{ prompt:"Which is the clearest explanation of how CAM saves water?", options:[
          { t:"“Stomata open only in the cool, humid night, when less water is lost per unit of CO₂; the CO₂ is stored as malic acid and used by day with the stomata shut.”", ok:true, why:"It says when the stomata open, why that saves water, and how the CO₂ is kept for the day." },
          { t:"“CAM plants don’t need CO₂.”", why:"All photosynthesis needs CO₂." },
          { t:"“CAM plants make water in their vacuoles.”", why:"Malic acid stores CO₂, not water." },
          { t:"“CAM plants run the Calvin cycle at night when it’s cooler.”", why:M6 }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which flow chart best shows why photorespiration is wasteful?", options:[
          { t:"Hot, dry day → stomata close → O₂ rises, CO₂ falls → rubisco adds O₂ to RuBP → ATP spent salvaging, CO₂ released → less net sugar", ok:true, why:"Each step follows from the one before, ending in the real cost: ATP spent and carbon lost." },
          { t:"Hot day → stomata open → more CO₂ → more sugar", why:M5 },
          { t:"Rubisco adds O₂ → ATP made → more growth", why:M1 },
          { t:"Cool day → more O₂ events → plant dies", why:"Cool weather lowers photorespiration." }] },
        b:{ prompt:"Which best explains why photorespiration rises as a C3 leaf heats up, even with its stomata open?", options:[
          { t:"“Warmth makes rubisco grab O₂ relatively more often, and CO₂ dissolves less well in warm cell fluid than O₂ does.”", ok:true, why:"Both effects raise the O₂ : CO₂ competition at rubisco." },
          { t:"“Warm leaves make extra O₂ by respiration.”", why:"Respiration uses O₂." },
          { t:"“Heat destroys the Calvin cycle.”", why:"It raises the O₂ : CO₂ competition at rubisco." },
          { t:"“Open stomata let in too much CO₂.”", why:M7 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"An Ontario farmer has a field in a region with hot, humid July weather. Why does corn often out-produce wheat in midsummer there?", options:[
          { t:"Corn is C4, so it avoids photorespiration in the heat, while wheat (C3) loses much of its fixed carbon", ok:true, why:"In July heat, C4’s extra ATP cost is repaid many times over." },
          { t:"Corn has no rubisco", why:M2 },
          { t:"Wheat closes its stomata at night", why:"Wheat is C3; its stomata open by day." },
          { t:"C4 plants are better everywhere", why:M4 }] },
        b:{ prompt:"A heat wave hits a Prairie wheat crop in July. Why does the crop’s growth drop more than a nearby corn field’s?", options:[
          { t:"Wheat is C3: heat and closed stomata raise its photorespiration, while corn’s C4 pathway keeps rubisco supplied with CO₂", ok:true, why:"The heat wave hurts the pathway with no CO₂ concentrator." },
          { t:"Corn opens its stomata at night", why:M3 },
          { t:"Wheat has more rubisco", why:"That isn’t why heat hurts it more." },
          { t:"Heat stops all photosynthesis in C3 plants", why:"It reduces the net gain; it doesn’t stop it." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"As CO₂ in the atmosphere rises, which crops would you expect to gain more in photosynthesis, and why?", options:[
          { t:"C3 crops, because more CO₂ makes rubisco grab O₂ less often, cutting their photorespiration", ok:true, why:M7 },
          { t:"C4 crops, because they love CO₂", why:"They already concentrate it." },
          { t:"CAM crops, because they store more CO₂", why:"Their bottleneck is night storage, not air CO₂." },
          { t:"No crops: CO₂ doesn’t affect photosynthesis", why:"CO₂ is the raw material." }] },
        b:{ prompt:"A greenhouse adds extra CO₂ to its air. Which plants benefit most: its tomatoes (C3) or its corn seedlings (C4)?", options:[
          { t:"The tomatoes: extra CO₂ reduces their photorespiration, while the corn already supplies rubisco with concentrated CO₂", ok:true, why:M7 },
          { t:"The corn, because C4 plants use more CO₂", why:M7 },
          { t:"Both equally", why:"Their response to CO₂ differs." },
          { t:"Neither: greenhouses are already full of CO₂", why:"Plants deplete greenhouse CO₂ during the day." }] } }
    ]
  },
  task:{
    title:"A plant for its place", summary:"A plant for its place",
    statement:"<p>Build a plant whose parts match its pathway and suit its home. Can you find all the answers?</p><ol class=\"cc-tlist\"><li>The parts match the pathway.</li><li>Little photorespiration in this region.</li><li>Water loss fits the region.</li><li>No wasted energy.</li><li>Fast growth where water allows it.</li></ol>",
    inputs:{
      path:{ label:"Pathway", options:[["C3", "C3"], ["C4", "C4"], ["CAM", "CAM"]] },
      enz:{ label:"First enzyme to fix CO₂", options:[["rub", "Rubisco"], ["pep", "PEP carboxylase"]] },
      loc:{ label:"Calvin cycle location", options:[["meso", "Mesophyll cells"], ["bs", "Bundle-sheath cells"]] },
      sto:{ label:"Stomata open", options:[["day", "Day"], ["night", "Night"]] },
      reg:{ label:"Region", options:[["cool", "Cool and moist (Ontario spring)"], ["humid", "Hot and humid (tropical lowland)"], ["dry", "Hot and dry (desert)"]] }
    },
    checks:["Parts match the pathway", "Little photorespiration here", "Water loss fits", "No wasted energy", "Fast growth where water allows"],
    tips:[
      "Check each pathway’s three parts: first enzyme, where the Calvin cycle runs, and when the stomata open.",
      "In hot places, rubisco needs a CO₂ concentrator.",
      "In a desert, only night-opening keeps water loss low enough.",
      "In a cool climate, photorespiration is already low, so concentrating CO₂ wastes ATP.",
      "Where water is plentiful, CAM’s night-only CO₂ capture is too slow."
    ],
    explainPrompt:"Explain why each pathway suits only one of the three regions.",
    vocab:"Use the words photorespiration, rubisco, PEP carboxylase, stomata and ATP.",
    more:"There’s more than one answer. Can you find another?",
    after3:"Each pathway has exactly one home where it beats the others. That’s why wheat, corn and pineapple grow in such different places."
  },
  cards:[
    ["Photorespiration", "Rubisco adds O₂ to RuBP; ATP is spent and fixed CO₂ is lost, with no sugar made"],
    ["What raises photorespiration", "Heat and closed stomata (high O₂ : CO₂ inside the leaf)"],
    ["C3 plant", "Rubisco fixes CO₂ directly in mesophyll cells (wheat, canola, maple)"],
    ["C4 plant", "CO₂ first fixed into a 4-carbon acid in mesophyll, then released around rubisco in bundle-sheath cells (corn, sugarcane)"],
    ["Kranz anatomy", "A ring of chloroplast-rich bundle-sheath cells around each vein"],
    ["PEP carboxylase", "The enzyme that first fixes CO₂ in C4 and CAM plants; it ignores O₂"],
    ["CAM plant", "Stomata open at night; CO₂ stored as malic acid; Calvin cycle by day (pineapple, cacti)"],
    ["Space vs time", "C4 separates the steps in space (two cell types); CAM in time (night and day)"],
    ["Cost of C4", "About 2 extra ATP per CO₂"],
    ["Best in the cool", "C3: photorespiration is low, so concentrating CO₂ isn’t worth it"],
    ["Oxygen test", "Lowering O₂ boosts a C3 plant’s rate a lot; a C4 plant’s barely changes"],
    ["Rising CO₂", "Helps C3 crops more, by cutting their photorespiration"]
  ]
};
