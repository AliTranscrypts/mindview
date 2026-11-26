// SBI4U 12 NAD⁺ and FAD. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/12-nad-and-fad.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "NAD⁺ takes two electrons and one H⁺, giving NADH; the second H⁺ is released, so the equation ends ‘+ H⁺’.";
const M2 = "Gaining electrons is reduction. NADH has gained them: it is the reduced, loaded form.";
const M3 = "Both carry 2 electrons. NADH’s enter the chain at complex I and pass three proton pumps; FADH₂’s enter at complex II and pass only two.";
const M4 = "Glycolysis needs NAD⁺. Without O₂, NADH can’t unload at the chain, so NAD⁺ runs out unless fermentation regenerates it.";
const M5 = "The same carriers are reloaded thousands of times. A small pool is enough if it keeps cycling.";
const M6 = "NADH carries electrons out of fuel (catabolism); NADPH carries electrons into building (anabolism: Calvin cycle, fat synthesis).";
const M7 = "Multiply: each NADH ≈ 3 ATP, each FADH₂ ≈ 2 ATP (textbook values).";

// Quick check: one feedback line for every wrong chip (plan's "Feedback if wrong"), a "Right." line on the answer
function qc(id, goal, prompt, list, right, wrong){
  return { id:id, goal:goal, prompt:prompt, choices:list.map(function(t, i){ return i === 0 ? { t:t, ok:true, fb:right } : { t:t, fb:wrong }; }) };
}

export default {
  id:"12-nad-and-fad",
  kind:"topic",
  title:"NAD⁺ and FAD",
  topic:"NAD⁺ and FAD",
  readyTopic:"NAD⁺ and FAD",
  hero:{
    eq:'<span class="nf-heq"><span class="nf-heq1"><span class="nf-sp nf-nad">NAD⁺<small>empty</small></span> + 2H → <span class="nf-sp nf-nad">NADH<small>loaded</small></span> + <span class="nf-hp">H⁺</span></span>' +
       '<span class="nf-heq2"><span class="nf-sp nf-fad">FAD<small>empty</small></span> + 2H → <span class="nf-sp nf-fad">FADH₂<small>loaded</small></span></span></span>',
    eqLabel:"NAD⁺ plus 2 H gives NADH plus H⁺. Underneath: FAD plus 2 H gives FADH₂. NAD⁺ and FAD are empty; NADH and FADH₂ are loaded.",
    eqSize:"sm",
    headline:"Electron taxis.",
    text:"Food’s electrons don’t jump straight to oxygen. They ride in <strong>electron carriers</strong>: <strong>NAD⁺</strong> and <strong>FAD</strong> pick them up as fuel is broken down, becoming <strong>NADH</strong> and <strong>FADH₂</strong>. The carriers then drop the electrons at the electron transport chain and go back for more. A cell has only a small fleet, so every carrier must keep cycling.",
    fig:{ html:'<div class="nf-hero" id="nf-hero" role="img" aria-label="A brown malate molecule sits on a dehydrogenase enzyme. Two hydrogen atoms lift off and split into two violet electrons and two magenta H⁺. An empty teal NAD⁺ taxi drives in; both electrons and one H⁺ hop in, and the taxi fills solid teal, now labelled NADH. The second H⁺ drifts away into the solution. The taxi drives to a doorway labelled complex I, unloads its electrons and returns empty."></div>' }
  },
  goals:[
    "I can write the loading reactions for NAD⁺ and FAD and name the reduced and oxidized forms.",
    "I can state where NADH and FADH₂ are loaded and where they are unloaded.",
    "I can explain why NADH yields more ATP than FADH₂, and calculate the textbook ATP value of a set of carriers.",
    "I can explain why NAD⁺ must be regenerated, and predict what happens when it runs out.",
    "I can compare NAD⁺/NADH with NADP⁺/NADPH and match each to catabolism or anabolism."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Oxidation and reduction", goal:1,
          prompt:"A molecule that <strong>gains</strong> two hydrogen atoms is…",
          options:[
            { t:"reduced", ok:true, why:"Each H brings an electron: gain of electrons is reduction." },
            { t:"oxidized", why:"Reversed. Losing H is oxidation." },
            { t:"hydrolyzed", why:"Hydrolysis is splitting with water." },
            { t:"unchanged", why:"Gaining electrons changes its redox state." }],
          hints:["Each H = H⁺ + e⁻.", "Gaining electrons is…", "Reduced."] },
        { id:"w2", skill:"Oxidation and reduction", goal:1,
          prompt:"In a reaction, malate loses 2 H to NAD⁺. Malate is…",
          options:[
            { t:"oxidized", ok:true, why:"It loses electrons (with the H)." },
            { t:"reduced", why:"Malate gives H away." },
            { t:"the oxidizing agent", why:"Agents swapped. It gives electrons: it’s the reducing agent." },
            { t:"neutralized", why:"No acid–base reaction here." }],
          hints:["Losing H means losing…", "Electrons.", "Oxidized."] },
        { id:"w3", skill:"Enzymes and coenzymes", goal:2,
          prompt:"What does a <strong>dehydrogenase</strong> enzyme do?",
          options:[
            { t:"Removes hydrogen atoms from a substrate", ok:true, why:"De- (remove) + hydrogen." },
            { t:"Adds water to a substrate", why:"That’s a hydrolase (hydrolysis)." },
            { t:"Adds phosphate to a substrate", why:"That’s a kinase." },
            { t:"Makes hydrogen gas", why:"The H atoms go to a carrier, not into H₂ gas." }],
          hints:["Break the word apart.", "De- means remove.", "Removes hydrogen."] },
        { id:"w4", skill:"Enzymes and coenzymes", goal:4,
          prompt:"A coenzyme is…",
          options:[
            { t:"a small organic molecule that helps an enzyme and is recycled", ok:true, why:"NAD⁺ is a coenzyme made from the vitamin niacin." },
            { t:"a second enzyme that copies the first", why:"Coenzymes aren’t enzymes." },
            { t:"the product of the reaction", why:"Coenzymes return to their starting form." },
            { t:"an inhibitor", why:"Coenzymes help, not block." }],
          hints:["Co- means ‘with’.", "It works with an enzyme and is reused.", "A small organic molecule that helps an enzyme and is recycled."] },
        { id:"w5", skill:"Reading carrier names", goal:1,
          prompt:"Which is the <strong>loaded</strong> (electron-carrying) form?",
          options:[
            { t:"NADH", ok:true, why:"NADH carries 2 electrons." },
            { t:"NAD⁺", why:"NAD⁺ is empty." },
            { t:"FAD", why:"FAD is the empty form." },
            { t:"ADP", why:"ADP is an energy molecule, not an electron carrier." }],
          hints:["Which one has the extra H?", "NADH.", "Loaded = reduced = NADH."] },
        { id:"w6", skill:"Reading carrier names", goal:5,
          prompt:"What is the only difference between NAD⁺ and NADP⁺?",
          options:[
            { t:"NADP⁺ has one extra phosphate group", ok:true, why:"The P in NADP⁺." },
            { t:"NADP⁺ carries protons instead of electrons", why:"Both carry electrons." },
            { t:"NADP⁺ is found only in animals", why:"Every cell has both." },
            { t:"NAD⁺ has two extra phosphates", why:"The extra P belongs to NADP⁺." }],
          hints:["Look at the letters.", "P stands for phosphate.", "One extra phosphate."] }
      ],
      refreshers:{
        "Oxidation and reduction":"Losing H (electrons) is oxidation; gaining H is reduction. The fuel is oxidized and the carrier reduced.",
        "Enzymes and coenzymes":"A dehydrogenase removes H atoms. Coenzymes such as NAD⁺ and FAD carry what the enzyme removes, then are recycled. NAD⁺ comes from niacin (vitamin B₃), FAD from riboflavin (vitamin B₂).",
        "Reading carrier names":"NAD⁺ and FAD are empty (oxidized); NADH and FADH₂ are loaded (reduced). NADP⁺ is NAD⁺ with an extra phosphate."
      }
    }
  },
  explore:{
    heading:"Electron shuttle",
    intro:"Load the carriers from real substrates, then run a whole cell’s carrier fleet with and without oxygen.",
    modes:{ a:"Load and unload", b:"Shuttle run" },
    // Mode A substrates (plan table): each sits on its dehydrogenase; answer = the carrier that dehydrogenase uses
    subs:[
      { id:"s1", n:"malate", prod:"oxaloacetate", stage:"Krebs cycle", enz:"malate dehydrogenase", answer:"nad" },
      { id:"s2", n:"succinate", prod:"fumarate", stage:"Krebs cycle", enz:"succinate dehydrogenase", answer:"fad" },
      { id:"s3", n:"G3P", prod:"1,3-bisphosphoglycerate", stage:"Glycolysis", enz:"G3P dehydrogenase", answer:"nad" },
      { id:"s4", n:"pyruvate", prod:"acetyl-CoA + CO₂", stage:"Pyruvate oxidation", enz:"pyruvate dehydrogenase", answer:"nad" },
      { id:"s5", n:"isocitrate", prod:"α-ketoglutarate + CO₂", stage:"Krebs cycle", enz:"isocitrate dehydrogenase", answer:"nad" }
    ],
    fb:{
      wrongS2:"Succinate’s electrons don’t have enough energy to reduce NAD⁺; succinate dehydrogenase uses FAD.",
      wrongFad:"This dehydrogenase uses NAD⁺.",
      nadhToII:"Complex II accepts FADH₂. NADH unloads at complex I.",
      fadhToI:"Complex I accepts NADH. FADH₂ unloads at complex II.",
      full:"The garage holds 12 loaded carriers. Unload some at the chain, or press Reset.",
      pickFirst:"Load a carrier first, then take it to a complex."
    },
    // S2 stepper captions for one loading reaction (Mode A)
    steps:{
      nad:["The dehydrogenase removes 2 H atoms from the substrate.", "Each H atom splits into an H⁺ and an electron (e⁻).", "NAD⁺ takes both electrons and one H⁺: it is reduced to NADH.", "The second H⁺ is released into the solution: NAD⁺ + 2H → NADH + H⁺."],
      fad:["The dehydrogenase removes 2 H atoms from the substrate.", "Each H atom splits into an H⁺ and an electron (e⁻).", "FAD takes both electrons and both H⁺: it is reduced to FADH₂.", "Nothing is released: FAD + 2H → FADH₂."]
    },
    stall:"Stalled: no NAD⁺ to accept electrons.",
    stallFerm:"Every NAD⁺ is already loaded with electrons from earlier glucose, and that NADH can unload only at the chain. Fermentation recycles only the NADH that glycolysis makes from now on. Turn O₂ on, or press Reset.",
    modelNote:"Model rules: each glucose fully processed loads 10 NADH and 2 FADH₂; glycolysis alone loads 2 NADH. With O₂ on, the chain unloads every carrier before the next glucose. Textbook ATP values: 3 per NADH, 2 per FADH₂. FAD is drawn as a carrier for the accounting, though in the cell it stays bound to its enzymes.",
    aha:"Carriers shuttle and must be emptied to keep working; oxygen is what empties them in the end; NADH is the more valuable taxi.",
    predIntro:"Make a prediction first. Then the shuttle will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"a", sub:"s1", car:"nad" },
        prompt:"<span class=\"muted\">Load and unload: S1 (malate) with NAD⁺.</span> Malate loses 2 H atoms. How many H⁺ end up free in solution?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"2" }, { t:"4" }],
        explain:"NAD⁺ takes both electrons and one proton; the other proton is released. That’s why we write NADH + H⁺." },
      { id:"p2", start:{ mode:"b", pool:20, o2:false, ferm:false },
        prompt:"<span class=\"muted\">Shuttle run: NAD⁺ pool 20, O₂ off.</span> How many glucose molecules can be fully processed before the cell stalls?",
        options:[{ t:"2", ok:true }, { t:"20" }, { t:"10" }, { t:"as many as you like, because glycolysis doesn’t need O₂" }],
        explain:"Each glucose needs 10 NAD⁺. With no O₂, nothing empties the carriers." },
      { id:"p3", start:{ mode:"a", sub:"s2" },
        prompt:"<span class=\"muted\">Load and unload: S2 (succinate).</span> Which carrier does succinate dehydrogenase use?",
        options:[{ t:"FAD", ok:true }, { t:"NAD⁺" }, { t:"NADP⁺" }, { t:"ATP" }],
        explain:"Succinate’s electrons are too low in energy to reduce NAD⁺. FAD accepts lower-energy electrons." },
      { id:"p4", start:{ mode:"a", loaded:true },
        prompt:"<span class=\"muted\">Unload one NADH at complex I and one FADH₂ at complex II.</span> Both deliver 2 electrons. Which leads to more protons pumped?",
        options:[{ t:"NADH", ok:true }, { t:"FADH₂" }, { t:"the same" }, { t:"neither pumps protons" }],
        explain:"NADH’s electrons enter earlier and pass one more pump, so NADH is worth more ATP." }
    ],
    chalIntro:"Use the shuttle to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Load exactly one NADH and one FADH₂, each from a correct substrate.",
        why:"Succinate dehydrogenase loads FAD; malate, G3P, pyruvate and isocitrate dehydrogenases load NAD⁺.",
        hints:["Only one substrate uses FAD.", "It’s the one that makes fumarate.", "S2 with FAD; any other with NAD⁺."] },
      { id:"tc2", goal:4, prompt:"Shuttle run: pool 30, O₂ off. Process as many glucose as you can, then switch O₂ on and let the chain unload everything. How many electrons reach O₂ in total? (Type your count in the Challenge 2 box under the readout.)",
        why:"3 glucose stall the pool: 30 NADH + 6 FADH₂ = 36 carriers, and 36 × 2 = 72 electrons reach O₂ once the chain runs.",
        general:"Count every carrier the chain unloads, at 2 electrons each.",
        hints:["How many glucose before stalling?", "3 glucose: 30 NADH + 6 FADH₂ = 36 carriers.", "36 × 2 = 72 electrons: that’s 24 per glucose, the same number module 11 counted."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Load and unload: using the fewest loading reactions, load carriers worth <strong>exactly 14 ATP</strong> at textbook values (3 per NADH, 2 per FADH₂).",
        why:"4 NADH (12 ATP) + 1 FADH₂ (2 ATP) = 14 ATP in 5 loads. NADH is worth more, so using as many as possible keeps the number of loads down.",
        hints:["Use as many NADH (3 each) as possible.", "4 NADH = 12; you need 2 more.", "4 NADH + 1 FADH₂ = 14 in 5 loads."] }
    ]
  },
  part3:{
    slug:"nadp", name:"NAD⁺ vs NADP⁺",
    heading:"NAD⁺ vs NADP⁺",
    intro:"You’ve met NADPH in photosynthesis and NADH in respiration. Why does a cell keep two carrier pools? Zoom in on the molecules, watch the two pools respond to events, then check what happens when the NAD⁺ pool can’t be refilled.",
    s1:{
      title:"Station 1: zoom to the molecules",
      panel:"Zoom to the molecules",
      intro:"Each carrier is two nucleotides joined together (hence <strong>dinucleotide</strong>). Tap <strong>Add 2 H</strong> on a molecule to see where the electrons attach.",
      cap0:"The highlighted ring is where electrons attach: the nicotinamide ring in NAD⁺ and NADP⁺, the flavin ring in FAD.",
      mols:[
        { id:"nad", name:"NAD⁺", full:"nicotinamide adenine dinucleotide", loaded:"NADH", vit:"niacin (vitamin B₃)",
          cap:"NAD⁺ + 2H → NADH + H⁺. Two electrons and one H⁺ attach to the nicotinamide ring; the second H⁺ is released." },
        { id:"nadp", name:"NADP⁺", full:"NAD⁺ with an extra phosphate", loaded:"NADPH", vit:"niacin (vitamin B₃)",
          cap:"NADP⁺ + 2H → NADPH + H⁺. The same ring takes the electrons. The extra phosphate (circled) doesn’t carry anything: it’s a tag that lets enzymes tell the two pools apart." },
        { id:"fad", name:"FAD", full:"flavin adenine dinucleotide", loaded:"FADH₂", vit:"riboflavin (vitamin B₂)",
          cap:"FAD + 2H → FADH₂. The flavin ring takes both electrons and both H⁺." }
      ]
    },
    s2:{
      title:"Station 2: two pools, two jobs",
      intro:"A cell keeps its two pools in opposite states. Tap an event to see which gauge moves.",
      nad:{ name:"NAD⁺ / NADH", role:"the catabolic pool", note:"Kept <strong>mostly empty</strong> (mostly NAD⁺), ready to accept electrons from fuel." },
      nadp:{ name:"NADP⁺ / NADPH", role:"the anabolic pool", note:"Kept <strong>mostly loaded</strong> (mostly NADPH), ready to donate electrons to building reactions." },
      events:[
        { id:"e1", t:"Glycolysis runs", pool:"nad", dir:1, cap:"Glycolysis runs: NAD⁺ → NADH. Electrons from fuel load the catabolic pool." },
        { id:"e2", t:"The Calvin cycle reduces 3-PGA", pool:"nadp", dir:-1, cap:"The Calvin cycle reduces 3-PGA: NADPH → NADP⁺. The anabolic pool donates electrons to build sugar." },
        { id:"e3", t:"Light reactions", pool:"nadp", dir:1, cap:"Light reactions: NADP⁺ → NADPH. Light-driven electrons reload the anabolic pool." },
        { id:"e4", t:"Fat is built in the liver", pool:"nadp", dir:-1, cap:"Fat is built in the liver: NADPH → NADP⁺. Building fatty acids is a reduction, so it spends NADPH." },
        { id:"e5", t:"The ETC runs", pool:"nad", dir:-1, cap:"The ETC runs: NADH → NAD⁺. The chain empties the catabolic pool, so it’s ready for more fuel." }
      ],
      cap0:"Tap an event. The NAD⁺ gauge moves only for breaking fuel down; the NADP⁺ gauge moves only for building."
    },
    s3:{
      title:"Station 3: check it with data (when NAD⁺ runs out)",
      panel:"Check it with data",
      intro:"Glycolysis rate of two model yeast strains after the O₂ supply is cut off at 0 min. <strong>Strain 1</strong> can ferment. <strong>Strain 2</strong> is a mutant that can’t. Move the time slider to read both rates.",
      yLabel:"glycolysis rate (% of rate with O₂)",
      ask:"Why do the two strains behave differently?",
      reveal:"Only fermentation regenerates NAD⁺ without O₂. Strain 1 keeps turning NADH back into NAD⁺, so glycolysis holds steady; strain 2’s NAD⁺ is all loaded within a few minutes, so glycolysis stops."
    },
    // VERIFY: Canadian flour-enrichment rule (Food and Drug Regulations, B.13.001) — authored for the course's STSE/Canadian item; the plan names no Canadian context.
    blocks:[
      { title:"STSE: vitamins that build carriers",
        html:"<p>Your cells can’t make the nicotinamide ring or the flavin ring from scratch: they build NAD⁺ and NADP⁺ from <strong>niacin</strong> (vitamin B₃) and FAD from <strong>riboflavin</strong> (vitamin B₂). A diet short of niacin causes <strong>pellagra</strong>, which hits energy-hungry tissues such as the skin, gut and nerves hardest. In Canada, white flour must be enriched with niacin, riboflavin and other B vitamins, one reason pellagra is now rare here.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"NAD⁺ vs NADP⁺ quick check",
      items:[
        qc("q1", 5, "Which carrier does the Calvin cycle use to reduce 3-PGA?", ["NADPH", "NADH", "FADH₂", "ATP only"],
          "Right. Building reactions use NADPH.", "Building reactions use NADPH."),
        qc("q2", 5, "Which pool does a cell keep mostly empty, ready to accept electrons?", ["NAD⁺/NADH", "NADP⁺/NADPH", "both", "neither"],
          "Right. The catabolic pool must be ready to take electrons from fuel.", "The catabolic pool must be ready to take electrons from fuel."),
        qc("q3", 4, "In station 3, why does strain 2’s glycolysis stop?", ["NAD⁺ runs out", "ATP runs out first", "glucose runs out", "O₂ is needed in glycolysis"],
          "Right. Glycolysis needs NAD⁺; without O₂ or fermentation, nothing regenerates it.", "Glycolysis needs NAD⁺; without O₂ or fermentation, nothing regenerates it."),
        qc("q4", 4, "Which vitamin is needed to make FAD?", ["riboflavin (B₂)", "niacin (B₃)", "vitamin C", "vitamin D"],
          "Right. Niacin makes NAD⁺; riboflavin makes FAD.", "Niacin makes NAD⁺; riboflavin makes FAD.")
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Where carriers load and unload", goal:[1, 2, 5],
        instruction:"Eight events. Match each one to what happens to a carrier there.",
        leftTitle:"Event", rightTitle:"What happens to a carrier",
        left:[
          { id:"l1", t:"G3P is oxidized in glycolysis", goal:[1, 2] },
          { id:"l2", t:"Pyruvate is oxidized to acetyl-CoA", goal:[1, 2] },
          { id:"l3", t:"Succinate → fumarate", goal:[1, 2] },
          { id:"l4", t:"Malate → oxaloacetate", goal:[1, 2] },
          { id:"l5", t:"Complex I of the chain", goal:2 },
          { id:"l6", t:"Complex II of the chain", goal:2 },
          { id:"l7", t:"Pyruvate → lactate (no O₂)", goal:2,
            hints:["Is O₂ there?", "No: the chain can’t run.", "Lactate formation unloads NADH."] },
          { id:"l8", t:"The Calvin cycle’s reduction step", goal:5 }
        ],
        right:[
          { id:"r1", t:"NAD⁺ → NADH in the cytosol" },
          { id:"r2", t:"NAD⁺ → NADH, and CO₂ is released" },
          { id:"r3", t:"FAD → FADH₂" },
          { id:"r4", t:"NAD⁺ → NADH at the last step of the Krebs cycle" },
          { id:"r5", t:"NADH → NAD⁺; electrons enter the chain" },
          { id:"r6", t:"FADH₂ → FAD; electrons pass to ubiquinone" },
          { id:"r7", t:"NADH → NAD⁺ without the chain" },
          { id:"r8", t:"NADPH → NADP⁺" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l3|r4":"Succinate uses FAD; malate uses NAD⁺.", "l4|r3":"Succinate uses FAD; malate uses NAD⁺.",
          "l5|r6":"NADH unloads at complex I; FADH₂ at complex II.", "l6|r5":"NADH unloads at complex I; FADH₂ at complex II.",
          "l8|r1":"The Calvin cycle uses NADPH, not NADH.", "l1|r8":"The Calvin cycle uses NADPH, not NADH.",
          "l7|r5":"Lactate formation empties NADH <em>without</em> the chain.", "l5|r7":"Lactate formation empties NADH <em>without</em> the chain."
        },
        wrongDefault:"Is the carrier being loaded (reduced) or unloaded (oxidized) here?" },
      { id:"accounting", type:"custom", title:"Carrier accounting", summary:"Carrier accounting", star:true, goal:[2, 3, 4],
        instruction:"Seven problems. Use textbook values (3 ATP per NADH, 2 per FADH₂) unless a problem says otherwise. Problems 4 to 7 are non-routine; the last two go beyond the Final Check.",
        how:"",
        items:[
          { id:"c1", goal:2, prompt:"One glucose, fully oxidized: how many NADH are loaded?",
            answer:[10], labels:["NADH"], display:"10 NADH",
            why:"2 (glycolysis) + 2 (pyruvate oxidation) + 6 (Krebs cycle) = 10.",
            wrong:[{ match:[8], fb:"Add glycolysis’s 2: 2 + 2 + 6 = 10." }] },
          { id:"c2", goal:2, prompt:"…and how many FADH₂?",
            answer:[2], labels:["FADH₂"], display:"2 FADH₂",
            why:"One per Krebs turn, and two turns per glucose.",
            wrong:[{ match:[1], fb:"One per Krebs turn, and 2 turns per glucose." }] },
          { id:"c3", goal:3, prompt:"Textbook ATP value of 10 NADH + 2 FADH₂?",
            answer:[34], labels:["ATP"], display:"34 ATP",
            why:"10 × 3 + 2 × 2 = 30 + 4 = 34.",
            wrong:[{ match:[12], fb:M7 }] },
          { id:"c4", goal:3, star:true, prompt:"How many electrons do 10 NADH and 2 FADH₂ carry in total?",
            answer:[24], labels:["electrons"], display:"24 electrons",
            why:"12 carriers × 2 electrons = 24.",
            wrong:[{ match:[12], fb:"Each carrier holds 2 electrons." }] },
          { id:"c5", goal:4, star:true, prompt:"A cell has 50 NAD⁺ and no O₂ or fermentation. How many glucose can be fully processed? How many could pass through glycolysis alone, if pyruvate went no further?",
            answer:[5, 25], labels:["Fully processed", "Glycolysis alone"], display:"5 glucose fully processed; 25 through glycolysis alone",
            why:"Full processing uses 10 NAD⁺ per glucose (50 ÷ 10 = 5); glycolysis alone uses 2 (50 ÷ 2 = 25).",
            wrong:[{ any:50, fb:"Glycolysis uses 2 NAD⁺ per glucose; full processing uses 10." }],
            general:"Divide the pool by the NAD⁺ each glucose needs.",
            hints:["Divide the pool by the NAD⁺ needed per glucose.", "Full: 10 per glucose. Glycolysis alone: 2.", "50 ÷ 10 = 5; 50 ÷ 2 = 25."] },
          { id:"c6", goal:3, star:true, prompt:"Using current estimates (2.5 per NADH, 1.5 per FADH₂), what are 10 NADH + 2 FADH₂ worth?",
            answer:[28], labels:["ATP"], display:"28 ATP",
            why:"10 × 2.5 + 2 × 1.5 = 25 + 3 = 28.",
            wrong:[{ match:[34], fb:"That’s the textbook value; use 2.5 and 1.5." }] },
          { id:"c7", goal:[2, 3], star:true, prompt:"3 acetyl-CoA enter the Krebs cycle (no glycolysis). Give the total NADH, FADH₂ and their textbook ATP value.",
            answer:[9, 3, 33], labels:["NADH", "FADH₂", "ATP"], display:"9 NADH, 3 FADH₂, 33 ATP",
            why:"Per turn: 3 NADH and 1 FADH₂. 9 × 3 + 3 × 2 = 27 + 6 = 33.",
            general:"Per turn: 3 NADH, 1 FADH₂. 27 + 6 = 33.",
            hints:["One acetyl-CoA = one turn.", "Each turn loads 3 NADH and 1 FADH₂.", "9 × 3 + 3 × 2 = 33."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Elena",
        instruction:"Elena made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        how:"",
        problems:[
          { id:"e1", goal:1, task:"Write the equation for loading NAD⁺ when malate is oxidized.",
            steps:["Malate dehydrogenase removes 2 H atoms from malate.", "Each H atom is one H⁺ and one electron.", "NAD⁺ takes both H atoms: NAD⁺ + 2H → NADH₂.", "So no H⁺ is released into the solution."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"NAD⁺ takes 2 electrons and 1 H⁺: NAD⁺ + 2H → NADH + H⁺, so one H⁺ is released.", ok:true, why:M1 },
              { t:"NAD⁺ takes 1 electron: NAD⁺ + H → NAD.", why:"NAD⁺ carries 2 electrons." },
              { t:"FAD should be used instead.", why:"Malate dehydrogenase uses NAD⁺." },
              { t:"Step 3 is correct.", why:"Step 3 is the first mistake. " + M1 }],
            hints:["Is ‘NADH₂’ a real molecule?", "NAD⁺ takes one of the two protons.", "The fix: NAD⁺ takes 2 electrons and 1 H⁺, and one H⁺ is released."] },
          { id:"e2", goal:3, task:"Explain which carrier yields more ATP.",
            steps:["NADH and FADH₂ each carry 2 electrons.", "FADH₂ has two H in its name and NADH only one.", "So FADH₂ carries more energy and yields more ATP.", "FADH₂ yields 3 ATP and NADH 2."],
            answer:2,
            stepFb:["Step 1 is correct.", "True of the names. Keep checking.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"The number of H in the name doesn’t matter. NADH’s electrons enter at complex I and pass three proton pumps, so NADH yields more (about 3 vs 2).", ok:true, why:M3 },
              { t:"They yield the same, since both carry 2 electrons.", why:"Entry point matters." },
              { t:"NADH yields more because it’s positively charged.", why:"NAD⁺ is the charged one." },
              { t:"Step 3 is correct.", why:"Step 3 is the first mistake. " + M3 }],
            hints:["Where does each carrier unload?", "Complex I vs complex II.", "The fix: the entry point decides it. NADH’s electrons enter at complex I and pass three pumps."] },
          { id:"e3", goal:4, task:"Predict what happens to glycolysis in a muscle cell with no O₂ and no fermentation.",
            steps:["Without O₂, the electron transport chain stops.", "Glycolysis doesn’t use O₂ directly.", "So glycolysis keeps running at the same rate.", "The cell keeps making 2 ATP per glucose forever."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Glycolysis needs NAD⁺. With the chain stopped, NADH can’t be unloaded, so NAD⁺ runs out and glycolysis stalls.", ok:true, why:M4 },
              { t:"Glycolysis speeds up because ATP is low.", why:"It can’t speed up without NAD⁺." },
              { t:"Glycolysis switches to using FAD.", why:"The G3P step needs NAD⁺." },
              { t:"Step 3 is correct.", why:"Step 3 is the first mistake. " + M4 }],
            hints:["Which carrier does glycolysis load?", "NAD⁺ → NADH.", "The fix: glycolysis needs NAD⁺, and with the chain stopped NAD⁺ runs out."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the shuttle run: how fast the cell stalled without oxygen, or how few carriers it needs?" },
      { id:"j2", q:"In your own words, why is NADH worth more ATP than FADH₂?" },
      { id:"j3", q:"Explain to a friend why oxygen is needed even though glycolysis doesn’t use it directly." },
      { id:"j4", q:"Which idea is still unclear: the loading equations, the ATP values or NADPH? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Complete the equation: NAD⁺ + 2H → ?", options:[
          { t:"NADH + H⁺", ok:true, why:"Two electrons and one proton go to NAD⁺; one H⁺ is released." },
          { t:"NADH₂", why:"NAD⁺ keeps only one of the two protons." },
          { t:"NAD + H₂", why:"The H atoms go to the carrier, not into H₂ gas." },
          { t:"NADPH", why:"NADPH comes from NADP⁺, not NAD⁺." }] },
        b:{ prompt:"Complete the equation: FAD + 2H → ?", options:[
          { t:"FADH₂", ok:true, why:"FAD takes both H atoms." },
          { t:"FADH + H⁺", why:"That’s NAD⁺’s pattern, not FAD’s." },
          { t:"FAD⁺", why:"FAD gains electrons; it doesn’t become positive." },
          { t:"FADH₄", why:"Two H, not four." }] } },
      { id:"k2", cat:"K", goal:[1, 2],
        a:{ prompt:"Which is the reduced, electron-carrying form?", options:[
          { t:"NADH", ok:true, why:M2 },
          { t:"NAD⁺", why:"NAD⁺ is empty: oxidized." },
          { t:"FAD", why:"FAD is empty." },
          { t:"NADP⁺", why:"NADP⁺ is empty." }] },
        b:{ prompt:"Which is the oxidized, empty form?", options:[
          { t:"FAD", ok:true, why:"FAD hasn’t gained any electrons yet: it is the oxidized, empty form." },
          { t:"FADH₂", why:"FADH₂ is loaded." },
          { t:"NADH", why:"NADH is loaded." },
          { t:"NADPH", why:"NADPH is loaded." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"FADH₂ is loaded during…", options:[
          { t:"the Krebs cycle, when succinate becomes fumarate", ok:true, why:"Succinate dehydrogenase passes 2 H to FAD in the Krebs cycle." },
          { t:"glycolysis", why:"Glycolysis loads only NADH." },
          { t:"the electron transport chain", why:"The chain <em>unloads</em> carriers." },
          { t:"fermentation", why:"Fermentation unloads NADH." }] },
        b:{ prompt:"NADH is unloaded at…", options:[
          { t:"complex I of the electron transport chain", ok:true, why:"NADH’s electrons enter the chain at complex I." },
          { t:"complex II", why:"Complex II takes FADH₂." },
          { t:"ATP synthase", why:"ATP synthase uses the proton gradient, not NADH." },
          { t:"the Krebs cycle", why:"The Krebs cycle loads NADH." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A cell oxidizes 2 malate (loading NAD⁺) and 2 succinate (loading FAD). At textbook values, what are the carriers worth?", options:[
          { t:"10 ATP", ok:true, why:"2 × 3 + 2 × 2." },
          { t:"8 ATP", why:"That uses the current estimates (2.5 and 1.5); the question asks for textbook values." },
          { t:"12 ATP", why:"Succinate loads FADH₂ (2), not NADH (3)." },
          { t:"4 ATP", why:"That counts carriers, not ATP." }] },
        b:{ prompt:"A cell loads 3 NADH and 1 FADH₂. At textbook values, what are they worth?", options:[
          { t:"11 ATP", ok:true, why:"9 + 2." },
          { t:"12 ATP", why:"FADH₂ is worth 2, not 3." },
          { t:"9 ATP", why:"Add the FADH₂." },
          { t:"4 ATP", why:M7 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"The oxygen supply to a cell is cut off, and the cell can’t ferment. What happens next?", options:[
          { t:"NADH can’t unload at the chain, so NAD⁺ runs out and glycolysis stalls", ok:true, why:M4 },
          { t:"Glycolysis continues normally, because it doesn’t use O₂", why:M4 },
          { t:"NAD⁺ builds up, because no electrons are being carried", why:"Carriers stay loaded, so NAD⁺ falls." },
          { t:"The cell switches to using FAD in glycolysis", why:"Glycolysis uses only NAD⁺." }] },
        b:{ prompt:"A poison blocks complex I. What builds up first in the mitochondria?", options:[
          { t:"NADH", ok:true, why:"It can’t unload at complex I." },
          { t:"NAD⁺", why:"NAD⁺ is used up, not built up." },
          { t:"O₂ use increases", why:"Electrons stop reaching O₂." },
          { t:"FAD", why:"FADH₂ can still unload at complex II, but NADH is stuck." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Liver cells build fatty acids from acetyl groups, a reduction that needs electrons. Which carrier supplies them?", options:[
          { t:"NADPH", ok:true, why:"Building (anabolic) reductions use NADPH." },
          { t:"NADH", why:"NADH mostly carries electrons away from fuel to the chain." },
          { t:"NADP⁺", why:"NADP⁺ is empty." },
          { t:"FAD", why:"FAD is empty, and it’s a catabolic carrier." }] },
        b:{ prompt:"In the Calvin cycle, which carrier (with ATP) reduces 3-PGA to G3P?", options:[
          { t:"NADPH", ok:true, why:"Building (anabolic) reductions such as the Calvin cycle use NADPH." },
          { t:"NADH", why:M6 },
          { t:"FADH₂", why:"FADH₂ belongs to the Krebs cycle." },
          { t:"NAD⁺", why:"NAD⁺ is empty." }] } },
      { id:"c1", cat:"C", goal:[3, 4],
        a:{ prompt:"Which is the best explanation of why NADH is worth more ATP than FADH₂?", options:[
          { t:"“NADH’s electrons enter the chain at complex I and pass more proton pumps than FADH₂’s, which enter at complex II.”", ok:true, why:"The entry point decides how many proton pumps the electrons pass." },
          { t:"“FADH₂ carries fewer electrons.”", why:"Both carry 2." },
          { t:"“NADH has more hydrogen atoms.”", why:"FADH₂’s name shows more H; that’s not the reason." },
          { t:"“NADH is made in glycolysis, which makes more ATP.”", why:"Most NADH is made in the Krebs cycle." }] },
        b:{ prompt:"Which is the best explanation of why a cell needs only a few thousand NAD⁺ molecules per mitochondrion, even though it processes millions of glucose molecules?", options:[
          { t:"“Each NAD⁺ is reloaded and unloaded over and over, so a small pool is enough as long as it keeps cycling.”", ok:true, why:M5 },
          { t:"“Each glucose makes its own new NAD⁺.”", why:"NAD⁺ is recycled, not made per glucose." },
          { t:"“NAD⁺ is only needed for the first glucose.”", why:"It’s needed for every one." },
          { t:"“Most glucose is oxidized without NAD⁺.”", why:"Glycolysis and the Krebs cycle both need NAD⁺." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which sentence uses the terms correctly?", options:[
          { t:"“NAD⁺ is reduced to NADH when it accepts two electrons and a proton.”", ok:true, why:"Accepting electrons is reduction, and NAD⁺ keeps one of the two protons." },
          { t:"“NAD⁺ is oxidized to NADH when it accepts electrons.”", why:"Accepting electrons is reduction." },
          { t:"“NADH₂ is formed when NAD⁺ takes two protons.”", why:M1 },
          { t:"“NADH is the oxidizing agent when it is loaded.”", why:"Loaded NADH gives electrons: it is a reducing agent." }] },
        b:{ prompt:"Which sentence uses the terms correctly?", options:[
          { t:"“FAD is reduced to FADH₂ when succinate is oxidized.”", ok:true, why:"Succinate loses 2 H (oxidized); FAD gains them (reduced)." },
          { t:"“FAD is oxidized to FADH₂.”", why:"Gaining H is reduction." },
          { t:"“Succinate is reduced by FAD.”", why:"Succinate loses H: oxidized." },
          { t:"“FADH₂ is the empty form of the carrier.”", why:"FADH₂ has gained electrons: it is the reduced, loaded form." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Pellagra is a disease caused by a lack of niacin (vitamin B₃). It especially affects tissues that use a lot of energy. Which is the best explanation?", options:[
          { t:"Without niacin, cells make less NAD⁺, so fewer carriers are available and ATP production falls", ok:true, why:"Niacin builds NAD⁺. Fewer carriers means fewer electrons reach the chain, so energy-hungry tissues suffer most." },
          { t:"Niacin is a fuel, like glucose", why:"Niacin builds a carrier; it isn’t burned for energy." },
          { t:"Niacin is needed to make FAD", why:"FAD comes from riboflavin." },
          { t:"Without niacin, cells can’t take in oxygen", why:"Breathing isn’t affected; the carriers are." }] },
        b:{ prompt:"A lack of riboflavin (vitamin B₂) would most directly slow which step?", options:[
          { t:"Succinate → fumarate in the Krebs cycle, which needs FAD", ok:true, why:"Riboflavin builds FAD, the carrier succinate dehydrogenase uses." },
          { t:"The G3P step of glycolysis", why:"That step uses NAD⁺ (from niacin)." },
          { t:"Pyruvate → lactate", why:"That uses NADH." },
          { t:"ATP synthase", why:"ATP synthase doesn’t use FAD." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"During a sprint, muscle cells can’t get O₂ fast enough, yet glycolysis keeps going. Which keeps it going?", options:[
          { t:"Turning pyruvate into lactate, which regenerates NAD⁺ from NADH", ok:true, why:"Lactate formation unloads NADH without the chain, so glycolysis has NAD⁺ again." },
          { t:"Making more FAD", why:"Glycolysis doesn’t use FAD." },
          { t:"Glycolysis runs without any carrier", why:M4 },
          { t:"The Krebs cycle speeding up", why:"The Krebs cycle also needs NAD⁺, and the chain to empty it." }] },
        b:{ prompt:"Bread dough rises in a closed bowl after the O₂ is used up. How does the yeast keep glycolysis going?", options:[
          { t:"It turns pyruvate into ethanol and CO₂, regenerating NAD⁺", ok:true, why:"The CO₂ makes the dough rise." },
          { t:"It uses NADPH instead of NAD⁺", why:M6 },
          { t:"It doesn’t; glycolysis stops when O₂ runs out", why:"Yeast ferment." },
          { t:"Its FADH₂ unloads in the cytosol", why:"Fermentation unloads NADH." }] } }
    ]
  },
  task:{
    title:"Fill the carriers",
    summary:"Fill the carriers",
    statement:"<p>Design how far a batch of glucose is broken down so that the cell loads <strong>exactly 12 NADH</strong> and the Krebs cycle runs. Can you find all the answers?</p>" +
      "<p class=\"nf-trule\"><strong>Per-stage loading:</strong> each glucose through glycolysis gives 2 NADH and 2 pyruvate. Each pyruvate oxidized gives 1 NADH and 1 acetyl-CoA. Each acetyl-CoA through the Krebs cycle gives 3 NADH and 1 FADH₂.</p>",
    inputs:{
      g:{ label:"Glucose through glycolysis", sym:"g", min:1, max:4 },
      p:{ label:"Pyruvates oxidized", sym:"p", min:0, max:8 },
      k:{ label:"Krebs turns", sym:"k", min:0, max:8 }
    },
    checks:[
      "The plan is possible: you can’t oxidize more pyruvate than glycolysis made, or run more Krebs turns than you have acetyl-CoA.",
      "Exactly 12 NADH are loaded.",
      "At least one FADH₂ is loaded (the Krebs cycle runs)."
    ],
    tips:[
      "Glycolysis makes 2 pyruvate per glucose, and each Krebs turn needs one acetyl-CoA from one pyruvate.",
      "Count NADH: 2 per glucose, 1 per pyruvate oxidized, 3 per Krebs turn.",
      "Run at least one Krebs turn to load an FADH₂."
    ],
    explainPrompt:"Explain how you balanced the NADH from each stage, and why your design is possible.",
    vocab:"Use the words glycolysis, pyruvate oxidation, Krebs cycle, NADH and FADH₂.",
    success:"Your design loads exactly 12 NADH, and the Krebs cycle runs!",
    more:"There’s more than one answer. Can you find another?",
    after3:"Each design loads 12 NADH but a different number of FADH₂ (2, 1 and 1). Their ATP values differ too: at textbook values, 40, 38 and 38."
  },
  cards:[
    ["NAD⁺ loading", "NAD⁺ + 2H → NADH + H⁺ (2 electrons, 1 proton taken; 1 H⁺ released)."],
    ["FAD loading", "FAD + 2H → FADH₂."],
    ["Reduced vs oxidized", "Loaded NADH, FADH₂ = reduced. Empty NAD⁺, FAD = oxidized."],
    ["Dehydrogenase", "An enzyme that removes 2 H atoms from a substrate and passes them to a carrier."],
    ["Per glucose", "10 NADH (2 glycolysis, 2 pyruvate oxidation, 6 Krebs) and 2 FADH₂ (Krebs)."],
    ["Unloading", "NADH at complex I; FADH₂ at complex II of the electron transport chain."],
    ["ATP value", "Textbook: NADH ≈ 3, FADH₂ ≈ 2. Current estimates: ≈ 2.5 and ≈ 1.5."],
    ["Why NADH is worth more", "Its electrons enter at complex I and pass more proton pumps."],
    ["No O₂", "NADH can’t unload → NAD⁺ runs out → glycolysis stalls unless fermentation regenerates NAD⁺."],
    ["NADP⁺/NADPH", "Anabolic carrier (Calvin cycle, fat synthesis); kept mostly loaded. NAD⁺ is kept mostly empty."],
    ["Vitamins", "Niacin (B₃) → NAD⁺ and NADP⁺; riboflavin (B₂) → FAD."]
  ]
};
