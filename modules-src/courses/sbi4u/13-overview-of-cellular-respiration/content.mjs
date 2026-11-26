// SBI4U 13 Overview of Cellular Respiration. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/13-overview-of-cellular-respiration.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "The oxygen atoms of O₂ end up in water at the end of the chain. CO₂’s oxygen comes from glucose (and water).";
const M2 = "Glycolysis: cytosol. Pyruvate oxidation and the Krebs cycle: matrix. Electron transport: inner membrane.";
const M3 = "O₂ is used in only one place: complex IV at the end of the chain. The other stages depend on O₂ only indirectly, because they need NAD⁺ back.";
const M4 = "Plants respire all the time, day and night. In bright light photosynthesis just outpaces it.";
const M5 = "Matter cycles; energy flows through once and leaves as heat.";
const M6 = "Limewater turns milky with CO₂. Bromothymol blue turns yellow as CO₂ (acid) builds up.";
const M7 = "Breathing moves air; cellular respiration is the chemistry in every cell that uses O₂ to release energy from food.";
const EQ = '<span class="bio-chem">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy</span>';

export default {
  id:"13-overview-of-cellular-respiration",
  kind:"topic",
  title:"Overview of cellular respiration",
  topic:"Overview of Cellular Respiration",
  readyTopic:"the overview of cellular respiration",
  hero:{
    eq:'<span class="cr-heq"><span class="bio-chem">C₆H₁₂O₆ + 6O₂ →</span> <span class="bio-chem">6CO₂ + 6H₂O</span> <span class="bio-chem">+ energy <span class="cr-heq-n">(ATP + heat)</span></span></span>',
    eqLabel:"C₆H₁₂O₆ plus 6 O₂ gives 6 CO₂ plus 6 H₂O plus energy, as ATP and heat",
    eqSize:"sm",
    headline:"One sugar, four stages, about 36 ATP.",
    text:"Every cell in your body breaks down glucose to release energy: <strong>cellular respiration</strong>. It happens in four stages: <strong>glycolysis</strong> in the cytosol, then <strong>pyruvate oxidation</strong>, the <strong>Krebs cycle</strong> and the <strong>electron transport chain</strong> in the mitochondria. Oxygen waits at the very end, ready to accept the electrons.",
    fig:{ html:'<div class="cr-hero" id="cr-hero" role="img" aria-label="A cell with a mitochondrion. A brown glucose hexagon enters the cytosol and splits into two pyruvates, making 2 ATP (glycolysis). The pyruvates enter the matrix, each losing a CO₂ (pyruvate oxidation), and two acetyl groups enter a turning wheel (the Krebs cycle), which releases 4 more CO₂. Teal NADH and cerulean FADH₂ carry electrons to the inner membrane, where blue O₂ becomes H₂O and ATP synthase turns out orange ATP. Total: about 36 ATP (textbook), about 30 to 32 (current estimate)."></div>' }
  },
  goals:[
    "I can write the summary equation for aerobic respiration and say where the energy goes.",
    "I can name the four stages of aerobic respiration and where in the cell each one happens.",
    "I can list the main inputs and outputs of each stage, per glucose.",
    "I can trace the carbon, hydrogen and oxygen atoms from the reactants to the products.",
    "I can compare respiration with photosynthesis using a flow chart or table.",
    "I can plan and interpret a simple investigation of the products of respiration."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Cell structures", goal:2,
          prompt:"Which organelle carries out most of aerobic cellular respiration?",
          options:[
            { t:"The mitochondrion", ok:true, why:"Pyruvate oxidation, the Krebs cycle and the chain all happen there." },
            { t:"The chloroplast", why:"Chloroplasts carry out photosynthesis." },
            { t:"The lungs", why:"Lungs are organs for breathing; respiration happens inside cells." },
            { t:"The nucleus", why:"The nucleus holds DNA." }],
          hints:["It’s called the powerhouse of the cell.", "It has a folded inner membrane.", "Mitochondrion."] },
        { id:"w2", skill:"Cell structures", goal:2,
          prompt:"The folds of the inner mitochondrial membrane are called…",
          options:[
            { t:"cristae", ok:true, why:"They give the membrane a large area for the electron transport chain." },
            { t:"thylakoids", why:"Those are in chloroplasts." },
            { t:"the matrix", why:"The matrix is the fluid inside the inner membrane." },
            { t:"ribosomes", why:"Ribosomes make proteins." }],
          hints:["It’s a Latin word for ‘crests’.", "Not the fluid, but the folds.", "Cristae."] },
        { id:"w3", skill:"The summary equation", goal:1,
          prompt:"Which are the reactants of aerobic respiration?",
          options:[
            { t:"Glucose and oxygen", ok:true, why:'<span class="bio-chem">C₆H₁₂O₆ + 6O₂ → …</span>' },
            { t:"Carbon dioxide and water", why:"Those are the products." },
            { t:"Glucose and carbon dioxide", why:"CO₂ is released, not used." },
            { t:"Oxygen and water", why:"Water is a product." }],
          hints:["What do you need to breathe in and eat?", "Food (glucose) and O₂.", "Glucose and oxygen."] },
        { id:"w4", skill:"The summary equation", goal:1,
          prompt:"How many CO₂ molecules form from one glucose?",
          options:[
            { t:"6", ok:true, why:"Glucose has 6 carbons, and each leaves as one CO₂." },
            { t:"1", why:"One per carbon atom." },
            { t:"12", why:"12 is the number of O atoms in 6CO₂." },
            { t:"3", why:"Two pyruvates of 3 C each: 6 total." }],
          hints:["Count glucose’s carbons.", "C₆.", "6 CO₂."] },
        { id:"w5", skill:"Electron carriers", goal:3,
          prompt:"Which carriers take electrons from glucose to the chain?",
          options:[
            { t:"NADH and FADH₂", ok:true, why:"Loaded in glycolysis, pyruvate oxidation and the Krebs cycle." },
            { t:"ATP and ADP", why:"ATP carries energy, not electrons." },
            { t:"O₂ and H₂O", why:"O₂ is the final acceptor." },
            { t:"NADPH and NADP⁺", why:"NADPH is the photosynthesis (anabolic) carrier." }],
          hints:["Think of module 12.", "The loaded forms.", "NADH and FADH₂."] },
        { id:"w6", skill:"Electron carriers", goal:3,
          prompt:"Per glucose, how many NADH are loaded altogether?",
          options:[
            { t:"10", ok:true, why:"2 + 2 + 6." },
            { t:"2", why:"That’s glycolysis only." },
            { t:"6", why:"That’s the Krebs cycle only." },
            { t:"12", why:"There are 10 NADH and 2 FADH₂." }],
          hints:["Add three stages.", "Glycolysis 2, pyruvate oxidation 2, Krebs 6.", "10."] }
      ],
      refreshers:{
        "Cell structures":"A mitochondrion has an outer membrane, an inner membrane folded into cristae, the intermembrane space between them, and the matrix inside.",
        "The summary equation":"C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy. Glucose’s 6 carbons give 6 CO₂.",
        "Electron carriers":"10 NADH and 2 FADH₂ per glucose carry electrons to the chain, where O₂ accepts them."
      }
    }
  },
  explore:{
    heading:"Respiration map",
    intro:"Place each stage where it happens, follow the atoms through the whole process, then switch stages on and off to see what each one contributes.",
    // centrepiece data (plan: What students control)
    stages:[
      { id:"gly", t:"Glycolysis", short:"Glycolysis" },
      { id:"po", t:"Pyruvate oxidation", short:"Pyruvate oxidation" },
      { id:"kr", t:"Krebs cycle", short:"Krebs cycle" },
      { id:"ch", t:"Electron transport and chemiosmosis", short:"Chain" }],
    zones:[
      { id:"cyto", t:"cytosol" },
      { id:"om", t:"outer membrane" },
      { id:"ims", t:"intermembrane space" },
      { id:"im", t:"inner membrane (cristae)" },
      { id:"matrix", t:"matrix" },
      { id:"nuc", t:"nucleus" }],
    atoms:[
      { id:"c", t:"Carbon from glucose", iso:"¹⁴C", end:"CO₂", short:"C from glucose" },
      { id:"h", t:"Hydrogen from glucose", iso:"³H", end:"H₂O", short:"H from glucose" },
      { id:"o2", t:"Oxygen from O₂", iso:"¹⁸O", end:"H₂O", short:"O from O₂" },
      { id:"og", t:"Oxygen from glucose", iso:"¹⁸O", end:"CO₂", short:"O from glucose" }],
    modelNote:"Per glucose. ATP: textbook (eukaryote) 36, current estimate ≈ 30–32; module 19 explains the difference. Energy: ATP ≈ 30.5 kJ/mol, glucose ≈ 2870 kJ/mol.",
    waterNote:"The chain forms 12 H₂O per glucose, but other steps use some water, so the net is 6 H₂O.",
    predictions:[
      { id:"p1", prompt:"Where does glycolysis happen?",
        options:[
          { t:"In the cytosol", ok:true },
          { t:"In the matrix" },
          { t:"On the inner membrane" },
          { t:"In the intermembrane space" }],
        explain:"Glycolysis happens outside the mitochondrion, which is why even cells without mitochondria (like red blood cells) can do it.",
        start:{ mode:"a" } },
      { id:"p2", prompt:"A cell is given O₂ labelled with ¹⁸O. Where will the label appear?",
        options:[
          { t:"In water", ok:true },
          { t:"In CO₂" },
          { t:"In glucose" },
          { t:"In ATP" }],
        explain:"O₂ is the final electron acceptor; it becomes water. The CO₂’s oxygen came from glucose and water.",
        start:{ mode:"b", atom:"o2", label:true } },
      { id:"p3", prompt:"Which stage releases the most CO₂ per glucose?",
        options:[
          { t:"The Krebs cycle (4)", ok:true },
          { t:"Pyruvate oxidation (2)" },
          { t:"Glycolysis (2)" },
          { t:"The chain (6)" }],
        explain:"Glycolysis releases no CO₂. Pyruvate oxidation releases 2 and the Krebs cycle 4.",
        start:{ mode:"c", on:[], o2:true } },
      { id:"p4", prompt:"All four stages are running. Then the O₂ is switched off. What happens?",
        options:[
          { t:"The chain stops; then pyruvate oxidation and the Krebs cycle stop because NAD⁺ isn’t regenerated; glycolysis continues only if the cell ferments", ok:true },
          { t:"Only the chain stops; the other stages carry on" },
          { t:"Everything stops at once, including glycolysis, which uses O₂" },
          { t:"Nothing changes" }],
        explain:"O₂ is used only at the chain, but the other stages need the NAD⁺ the chain gives back.",
        start:{ mode:"c", on:["gly", "po", "kr", "ch"], o2:true } }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"<strong>Place the stages:</strong> place all four stages correctly.",
        why:"Glycolysis: cytosol. Pyruvate oxidation and the Krebs cycle: matrix. Electron transport: inner membrane.",
        hints:["Only one stage happens outside the mitochondrion.", "Two stages share the matrix.", "Cytosol; matrix; matrix; inner membrane."] },
      { id:"tc2", goal:4, prompt:"<strong>Follow the atoms:</strong> follow the carbon. Enter how many of glucose’s carbons leave as CO₂ in pyruvate oxidation, and how many in the Krebs cycle.",
        why:"Each pyruvate (3C) loses one carbon as CO₂ in pyruvate oxidation (2 in all); the remaining 4 carbons leave in the Krebs cycle.",
        hints:["Each pyruvate (3C) becomes acetyl (2C) + CO₂.", "2 pyruvates → 2 CO₂.", "The remaining 4 carbons leave in the Krebs cycle."] },
      { id:"tc3", goal:3, stretch:true, prompt:"<strong>Stage switches:</strong> set the switches so that, per glucose, the cell loads <strong>exactly 4 NADH</strong> and releases <strong>exactly 2 CO₂</strong>.",
        why:"Glycolysis loads 2 NADH and releases no CO₂; pyruvate oxidation loads 2 NADH and releases 2 CO₂. Stopping before the Krebs cycle gives 4 NADH and 2 CO₂.",
        hints:["Which stages produce NADH? Which release CO₂?", "Glycolysis: 2 NADH, 0 CO₂. Pyruvate oxidation: 2 NADH, 2 CO₂.", "Run those two and stop before the Krebs cycle."] }
    ]
  },
  part3:{
    slug:"cycle", name:"The cycle", heading:"Photosynthesis and respiration as a cycle",
    intro:"The two processes are linked: each one’s products are the other’s reactants. Sort what they share, watch the atoms go round while the energy passes through, then check the idea with a sealed-tube experiment.",
    venn:{
      title:"Station 1: compare",
      how:"Tap a card, then tap the part of the diagram where it belongs: photosynthesis only, respiration only, or both.",
      boxes:[{ id:"ps", t:"Photosynthesis" }, { id:"both", t:"Both" }, { id:"resp", t:"Respiration" }],
      cards:[
        { id:"v1", t:"Happens in chloroplasts", answer:"ps", why:"Photosynthesis runs in chloroplasts." },
        { id:"v2", t:"Uses light energy", answer:"ps", why:"Light powers photosynthesis; respiration uses the energy in food." },
        { id:"v3", t:"Reduces CO₂ to sugar", answer:"ps", why:"The Calvin cycle reduces CO₂ to sugar.", wrong:{ resp:"Respiration does the opposite: it oxidizes sugar to CO₂." } },
        { id:"v4", t:"Carrier: NADPH", answer:"ps", why:"NADPH is the photosynthesis (anabolic) carrier.", wrong:{ resp:"Respiration’s carrier is NADH, without the P." } },
        { id:"v5", t:"Happens in mitochondria (and the cytosol)", answer:"resp", why:"Glycolysis runs in the cytosol; the other stages run in the mitochondria." },
        { id:"v6", t:"Oxidizes sugar to CO₂", answer:"resp", why:"Respiration oxidizes glucose; its carbons leave as CO₂.", wrong:{ ps:"Photosynthesis does the opposite: it reduces CO₂ to sugar." } },
        { id:"v7", t:"Carrier: NADH", answer:"resp", why:"NADH carries electrons from glucose to the chain.", wrong:{ ps:"Photosynthesis uses NADPH." } },
        { id:"v8", t:"O₂ is the final electron acceptor", answer:"resp", why:"O₂ accepts the electrons at the end of the respiratory chain and becomes water.", wrong:{ ps:"In photosynthesis O₂ is released (from water), not used to accept electrons.", both:"Only respiration uses O₂ to accept electrons; photosynthesis releases O₂." } },
        { id:"v9", t:"An electron transport chain", answer:"both", why:"Both have one: in the thylakoid membrane and in the inner mitochondrial membrane.", wrong:{ ps:"Respiration has one too, on the inner membrane.", resp:"Photosynthesis has one too, in the thylakoid membrane." } },
        { id:"v10", t:"Chemiosmosis with ATP synthase", answer:"both", why:"Both make ATP by letting H⁺ flow through ATP synthase.", wrong:{ ps:"Mitochondria make most of their ATP this way too.", resp:"Chloroplasts make their ATP this way too." } }],
      wrongDefault:"Ask: does it happen in the chloroplast, the mitochondrion, or both?",
      done:"All sorted. The two processes run in opposite directions in different organelles, but share the same machinery: a chain and ATP synthase."
    },
    loop:{
      title:"Station 2: matter cycles, energy flows",
      intro:"Watch the loop. Follow the atoms, then follow the energy.",
      caption:"Atoms are reused; energy isn’t."
    },
    jar:{
      title:"Station 3: check it with data (the jar experiment)",
      intro:"Four sealed tubes contain bromothymol blue (BTB). It is blue at low CO₂, green in between, and yellow at high CO₂. Tap each tube to see its colour after 2 hours.",
      tubes:[
        { id:"t1", n:1, contents:"Water plant (elodea)", light:"Light", colour:"blue", result:"Blue (CO₂ used up)",
          why:"In light, the elodea photosynthesizes faster than it respires, so it uses up the CO₂: the BTB turns blue." },
        { id:"t2", n:2, contents:"Elodea", light:"Dark", colour:"yellow", result:"Yellow (CO₂ added)",
          why:"In the dark there’s no photosynthesis, but the elodea still respires, so CO₂ builds up: the BTB turns yellow. Plants respire too." },
        { id:"t3", n:3, contents:"Snail", light:"Light", colour:"yellow", result:"Yellow",
          why:"The snail respires and can’t photosynthesize, so CO₂ builds up even in light: the BTB turns yellow." },
        { id:"t4", n:4, contents:"Snail + elodea", light:"Light", colour:"greenblue", result:"Green to blue (balanced or net uptake)",
          why:"The snail adds CO₂ and the elodea in light uses it: the BTB stays green (balanced) or turns blue (net uptake)." }],
      closing:"Tube 2 shows that <strong>plants respire too</strong>. In tube 1 the plant still respires, but in light its photosynthesis outpaces it."
    },
    quickCheck:{
      title:"Quick check", summary:"The cycle quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which happens in both photosynthesis and respiration?",
          choices:[{ t:"chemiosmosis with ATP synthase", ok:true, fb:"Both make ATP by letting H⁺ flow through ATP synthase." },
            { t:"reducing CO₂", fb:"Both make ATP by letting H⁺ flow through ATP synthase." },
            { t:"O₂ as the final acceptor", fb:"Both make ATP by letting H⁺ flow through ATP synthase." },
            { t:"using light", fb:"Both make ATP by letting H⁺ flow through ATP synthase." }] },
        { id:"q2", goal:6, prompt:"Why does tube 2 (elodea in the dark) turn yellow?",
          choices:[{ t:"the plant respires and releases CO₂", ok:true, fb:"Plants respire all the time; without light there’s no photosynthesis to use up the CO₂." },
            { t:"the plant photosynthesizes", fb:"Plants respire all the time; without light there’s no photosynthesis to use up the CO₂." },
            { t:"the BTB breaks down in the dark", fb:"Plants respire all the time; without light there’s no photosynthesis to use up the CO₂." },
            { t:"the plant releases O₂", fb:"Plants respire all the time; without light there’s no photosynthesis to use up the CO₂." }] },
        { id:"q3", goal:5, prompt:"Which statement is true?",
          choices:[{ t:"matter cycles; energy flows through once", ok:true, fb:"Energy ends as heat." },
            { t:"energy cycles; matter flows through", fb:"Energy ends as heat." },
            { t:"both cycle", fb:"Energy ends as heat." },
            { t:"neither cycles", fb:"Energy ends as heat." }] },
        { id:"q4", goal:6, prompt:"Limewater turns milky. Which gas is present?",
          choices:[{ t:"CO₂", ok:true, fb:"Limewater is the classic CO₂ test." },
            { t:"O₂", fb:"Limewater is the classic CO₂ test." },
            { t:"H₂", fb:"Limewater is the classic CO₂ test." },
            { t:"N₂", fb:"Limewater is the classic CO₂ test." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"stage", type:"sorter", title:"Which stage?", summary:"Which stage?", goal:[2, 3], noun:"card", txt:true,
        instruction:"Sort each event or fact by the stage it belongs to.",
        boxes:[
          { id:"b1", label:"Glycolysis" },
          { id:"b2", label:"Pyruvate oxidation" },
          { id:"b3", label:"Krebs cycle" },
          { id:"b4", label:"Electron transport and chemiosmosis" }],
        items:[
          { id:"i1", t:"Glucose is split into 2 pyruvate", answer:"b1", why:"Glycolysis splits 6C glucose into two 3C pyruvates." },
          { id:"i2", t:"2 ATP are used and 4 are made", answer:"b1", why:"Glycolysis invests 2 ATP and makes 4: a net gain of 2." },
          { id:"i3", t:"Happens in the cytosol", answer:"b1", why:"Glycolysis is the only stage outside the mitochondrion.", wrong:{ b3:M2 } },
          { id:"i4", t:"Each pyruvate loses a CO₂ and becomes acetyl-CoA", answer:"b2", why:"Pyruvate oxidation is the link step between glycolysis and the Krebs cycle.", wrong:{ b3:"Pyruvate oxidation is the link step <em>before</em> the cycle." } },
          { id:"i5", t:"Oxaloacetate is regenerated at the end of each turn", answer:"b3", why:"The Krebs cycle ends where it starts, with oxaloacetate ready for the next acetyl group." },
          { id:"i6", t:"2 FADH₂ are loaded per glucose", answer:"b3", why:"FAD is loaded once per turn of the Krebs cycle: 2 per glucose.",
            hints:["Which stage loads FAD?", "Succinate → fumarate.", "Krebs cycle."] },
          { id:"i7", t:"O₂ accepts electrons and forms water", answer:"b4", why:"O₂ is the final electron acceptor at the end of the chain.", wrong:{ b3:"O₂ is used only at the chain." } },
          { id:"i8", t:"ATP synthase makes most of the ATP", answer:"b4", why:"Chemiosmosis through ATP synthase makes about 32 of the 36 ATP (textbook)." },
          { id:"i9", t:"Proteins are embedded in the inner membrane", answer:"b4", why:"The chain’s complexes and ATP synthase sit in the inner membrane (cristae)." },
          { id:"i10", t:"4 CO₂ are released per glucose", answer:"b3", why:"The Krebs cycle releases 2 CO₂ per turn, 2 turns per glucose.", wrong:{ b2:"Pyruvate oxidation releases 2; the Krebs cycle 4." } }],
        wrongDefault:"Ask: where does it happen, and what goes in and comes out?" },
      { id:"lab", type:"custom", title:"Respiration lab data", summary:"Respiration lab data", star:true, goal:6,
        instruction:"Seven questions on a sealed-chamber experiment. The last four are non-routine (★).",
        context:"Sealed chambers, each with a CO₂ sensor. Readings in parts per million (ppm).",
        table:{ head:["Chamber", "Contents", "Temperature", "CO₂ at 0 min (ppm)", "CO₂ at 20 min (ppm)"],
          rows:[["A", "50 germinating peas", "25 °C", "400", "1200"], ["B", "50 germinating peas", "10 °C", "400", "600"], ["C", "50 boiled peas", "25 °C", "400", "400"], ["D", "Glass beads (same volume)", "25 °C", "400", "400"]] },
        items:[
          { id:"l1", kind:"mc", goal:6, prompt:"What is the independent variable when comparing A and B?",
            options:[
              { t:"temperature", ok:true, why:"Only the temperature differs between A and B." },
              { t:"CO₂ concentration", why:"CO₂ is what’s measured: the dependent variable." },
              { t:"the number of peas", why:"Both chambers have 50 peas: that’s kept the same." },
              { t:"the time", why:"Both are measured over the same 20 min." }],
            hints:["What is different between A and B?", "Both have 50 germinating peas; only one setting changes.", "Temperature."] },
          { id:"l2", kind:"num", goal:6, prompt:"Rate of CO₂ production in A (ppm/min)?",
            answer:40, display:"40 ppm/min", unit:"ppm/min",
            why:"(1200 − 400) ÷ 20 = 40 ppm/min.",
            wrong:[{ match:60, fb:"(1200 − 400) ÷ 20, not 1200 ÷ 20." }],
            general:"Rate = change in CO₂ ÷ time.",
            hints:["Rate = change ÷ time.", "1200 − 400 = 800.", "800 ÷ 20 = 40 ppm/min."] },
          { id:"l3", kind:"num", goal:6, prompt:"Rate in B (ppm/min)?",
            answer:10, display:"10 ppm/min", unit:"ppm/min",
            why:"(600 − 400) ÷ 20 = 10 ppm/min.",
            wrong:[{ match:30, fb:"(600 − 400) ÷ 20." }],
            general:"Rate = change in CO₂ ÷ time.",
            hints:["Rate = change ÷ time.", "600 − 400 = 200.", "200 ÷ 20 = 10 ppm/min."] },
          { id:"l4", kind:"num", goal:6, star:true, prompt:"How many times faster is A than B?",
            answer:4, display:"4 times faster", unit:"times",
            why:"40 ÷ 10 = 4.",
            general:"40 ÷ 10.",
            hints:["Compare the two rates by dividing.", "A: 40 ppm/min; B: 10 ppm/min.", "40 ÷ 10 = 4 times faster."] },
          { id:"l5", kind:"mc", goal:6, star:true, prompt:"Why include chamber C as well as D?",
            options:[
              { t:"C shows that living (respiring) peas cause the rise, not the peas’ material; D shows the chamber itself adds no CO₂", ok:true, why:"Each control rules out a different explanation." },
              { t:"C and D test the same thing, so one of them could be left out", why:"Each control rules out a different explanation." },
              { t:"C shows that the chamber leaks; D shows that peas need warmth", why:"Each control rules out a different explanation." },
              { t:"C and D give a second value of the independent variable", why:"Each control rules out a different explanation." }],
            hints:["What else, besides respiring peas, could make CO₂ rise?", "The peas’ material itself, or the chamber.", "C rules out the peas’ material; D rules out the chamber."] },
          { id:"l6", kind:"num", goal:6, star:true, prompt:"Predict CO₂ in chamber A after 30 min, if the rate stays steady.",
            answer:1600, display:"1600 ppm", unit:"ppm",
            why:"400 + 40 × 30 = 1600 ppm.",
            wrong:[{ match:1200, fb:"400 + 40 × 30." }],
            general:"Start at 400 ppm and add the rate × the time.",
            hints:["The rate stays at 40 ppm/min.", "In 30 min the CO₂ rises by 40 × 30 = 1200 ppm.", "400 + 1200 = 1600 ppm."] },
          { id:"l7", kind:"mc", goal:6, star:true, prompt:"A student wants to show that the CO₂ comes from respiration <em>needing O₂</em>. Which new chamber tests it?",
            options:[
              { t:"Germinating peas at 25 °C in a chamber flushed with nitrogen (no O₂)", ok:true, why:"Only the O₂ changes, so any difference is caused by the O₂." },
              { t:"Germinating peas at 10 °C in normal air", why:"Change only the O₂; keep the peas and temperature the same." },
              { t:"Boiled peas at 25 °C in a chamber flushed with nitrogen (no O₂)", why:"Change only the O₂; keep the peas and temperature the same." },
              { t:"100 germinating peas at 25 °C in normal air", why:"Change only the O₂; keep the peas and temperature the same." }],
            hints:["Which variable must change?", "Only the O₂ supply.", "Same peas, same temperature, no O₂."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Femi", how:"",
        instruction:"Femi made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Trace the oxygen atoms in respiration.",
            steps:["Glucose is oxidized and its carbons leave as CO₂.", "We breathe in O₂ so that it can combine with carbon.", "So the oxygen in exhaled CO₂ came from the air.", "Water is made from glucose’s hydrogen and oxygen."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "This follows from step 2. The mistake is earlier.", "This also depends on the mistaken step."],
            fixes:[
              { t:"O₂ is the final electron acceptor at the end of the chain, where it becomes water. CO₂’s oxygen comes from glucose and water.", ok:true, why:"The ¹⁸O experiments show it: labelled O₂ ends up in water, never in CO₂." },
              { t:"O₂ combines with glucose in glycolysis.", why:M3 },
              { t:"O₂ becomes ATP.", why:"O₂ isn’t part of ATP." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Where is O₂ used?", "Complex IV, at the end of the chain.", "Fix A."] },
          { id:"e2", goal:2, task:"Describe where each stage happens.",
            steps:["Glycolysis happens in the cytosol.", "Pyruvate moves into the mitochondrion.", "The Krebs cycle happens in the intermembrane space.", "The chain is on the inner membrane."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct; the mistake is earlier."],
            fixes:[
              { t:"The Krebs cycle happens in the matrix, inside the inner membrane.", ok:true, why:"The Krebs enzymes are dissolved in the matrix." },
              { t:"The Krebs cycle happens in the cytosol.", why:M2 },
              { t:"The Krebs cycle happens on the outer membrane.", why:"The outer membrane only encloses the mitochondrion; the Krebs enzymes are in the matrix." },
              { t:"Step 3 is correct.", why:"The intermembrane space is where H⁺ builds up, not where the Krebs cycle runs." }],
            hints:["Which compartment holds the Krebs enzymes?", "The innermost one.", "The matrix: fix A."] },
          { id:"e3", goal:6, task:"Interpret a lab: germinating peas in a sealed flask with limewater.",
            steps:["The limewater with germinating peas turned milky.", "The limewater with boiled peas stayed clear.", "Milky limewater shows that the peas produced oxygen.", "So germinating peas photosynthesize in the dark."],
            answer:2,
            stepFb:["Step 1 is an observation.", "Step 2 is an observation.", "", "This follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Milky limewater shows CO₂. Living peas respire and release CO₂; boiled (dead) peas don’t.", ok:true, why:"The boiled peas are the control: only living, respiring peas release CO₂." },
              { t:"Milky limewater shows water vapour.", why:"Limewater tests for CO₂." },
              { t:"Boiled peas respire faster.", why:"Boiled peas are dead." },
              { t:"Step 3 is correct.", why:M6 }],
            hints:["Which gas turns limewater milky?", "CO₂.", "Fix A."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: that O₂ ends up in water, or that only the last stage uses O₂?" },
      { id:"j2", q:"In your own words, why does a cell stop the Krebs cycle soon after O₂ runs out?" },
      { id:"j3", q:"Explain to a friend how photosynthesis and respiration recycle matter but not energy." },
      { id:"j4", q:"Which stage’s inputs and outputs are you least sure of? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Where does the Krebs cycle take place?", options:[
          { t:"The mitochondrial matrix", ok:true, why:"The Krebs enzymes are dissolved in the matrix, inside the inner membrane." },
          { t:"The cytosol", why:"That’s glycolysis." },
          { t:"The inner mitochondrial membrane", why:"That’s the chain." },
          { t:"The intermembrane space", why:"H⁺ builds up there; no cycle runs there." }] },
        b:{ prompt:"Where does glycolysis take place?", options:[
          { t:"The cytosol", ok:true, why:"Glycolysis runs outside the mitochondrion." },
          { t:"The matrix", why:M2 },
          { t:"The inner membrane", why:"That’s the chain." },
          { t:"The chloroplast", why:"Chloroplasts photosynthesize." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Per glucose, which stage releases 4 CO₂?", options:[
          { t:"The Krebs cycle", ok:true, why:"2 CO₂ per turn, 2 turns per glucose." },
          { t:"Glycolysis", why:"Glycolysis releases no CO₂." },
          { t:"Pyruvate oxidation", why:"It releases 2." },
          { t:"The electron transport chain", why:"The chain releases no CO₂." }] },
        b:{ prompt:"Per glucose, which stage makes the most ATP?", options:[
          { t:"Electron transport and chemiosmosis", ok:true, why:"About 32 of 36 (textbook)." },
          { t:"Glycolysis", why:"Net 2." },
          { t:"The Krebs cycle", why:"2 per glucose." },
          { t:"Pyruvate oxidation", why:"None directly." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"At which point is O₂ actually used?", options:[
          { t:"At the end of the electron transport chain, where it accepts electrons", ok:true, why:"O₂ is the final electron acceptor, at complex IV." },
          { t:"In glycolysis", why:M3 },
          { t:"In the Krebs cycle, to make CO₂", why:M1 },
          { t:"In pyruvate oxidation", why:M3 }] },
        b:{ prompt:"Which stage needs no mitochondria at all?", options:[
          { t:"Glycolysis", ok:true, why:"It runs in the cytosol." },
          { t:"The Krebs cycle", why:M2 },
          { t:"Pyruvate oxidation", why:"It happens in the matrix." },
          { t:"The chain", why:"It’s in the inner membrane." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"A mouse breathes O₂ labelled with ¹⁸O. In which product will most of the label first appear?", options:[
          { t:"Water", ok:true, why:"O₂ is reduced to H₂O at complex IV." },
          { t:"Carbon dioxide", why:M1 },
          { t:"Glucose", why:"Glucose is broken down, not made." },
          { t:"ATP", why:"O₂ isn’t built into ATP." }] },
        b:{ prompt:"Yeast is fed glucose labelled with ¹⁴C. In which product will the label appear?", options:[
          { t:"Carbon dioxide", ok:true, why:"All of glucose’s carbons leave as CO₂." },
          { t:"Water", why:"Water has no carbon." },
          { t:"O₂", why:"O₂ has no carbon." },
          { t:"ATP", why:"ATP’s carbon comes from its own ribose and adenine, not from this glucose." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"Bromothymol blue with germinating seeds turns from blue to yellow in 20 min; with boiled seeds it stays blue. What is the best conclusion?", options:[
          { t:"Living seeds respire and release CO₂, which acidifies the BTB", ok:true, why:"The boiled-seed control rules out everything except living, respiring seeds." },
          { t:"Living seeds release O₂, which turns BTB yellow", why:M6 },
          { t:"Boiled seeds respire faster", why:"Boiled seeds are dead." },
          { t:"BTB breaks down near seeds", why:"The control shows the BTB is stable." }] },
        b:{ prompt:"In a sealed flask, the limewater with germinating peas turns milky, and with glass beads it stays clear. What is the best conclusion?", options:[
          { t:"The peas released CO₂ by respiring", ok:true, why:"Milky limewater shows CO₂, and the glass-bead control shows the flask adds none." },
          { t:"The peas released O₂", why:M6 },
          { t:"The beads absorbed CO₂", why:"Beads are inert." },
          { t:"Limewater only reacts with peas", why:"Limewater reacts with CO₂." }] } },
      { id:"t3", cat:"T", goal:[2, 3],
        a:{ prompt:"Red blood cells have no mitochondria. Which stage of respiration can they still carry out?", options:[
          { t:"Only glycolysis (then they must ferment to regenerate NAD⁺)", ok:true, why:"Glycolysis runs in the cytosol; fermentation gives back the NAD⁺ it needs." },
          { t:"All four, using the cytosol", why:"The Krebs cycle and chain need mitochondria." },
          { t:"Only the Krebs cycle", why:"It needs a matrix." },
          { t:"None", why:"Glycolysis needs no mitochondria." }] },
        b:{ prompt:"Aerobic bacteria have no mitochondria. Where is their electron transport chain?", options:[
          { t:"In the cell (plasma) membrane", ok:true, why:"Their membrane does the job of the inner mitochondrial membrane." },
          { t:"In the cytosol, floating freely", why:"The chain needs a membrane to build an H⁺ gradient." },
          { t:"They have no chain, so they can’t respire aerobically", why:"Many bacteria respire aerobically." },
          { t:"In their nucleus", why:"Bacteria have no nucleus." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best description of cellular respiration?", options:[
          { t:"“A series of reactions in every cell that oxidizes glucose, using O₂ as the final electron acceptor, to capture energy as ATP.”", ok:true, why:"It says where (every cell), what changes (glucose is oxidized), the role of O₂ and the product (ATP)." },
          { t:"“Breathing in O₂ and out CO₂.”", why:M7 },
          { t:"“Burning glucose in one step to make heat.”", why:"It happens in many steps, capturing ATP." },
          { t:"“Making glucose from CO₂ and water.”", why:"That’s photosynthesis." }] },
        b:{ prompt:"Which flow chart best summarizes aerobic respiration?", options:[
          { t:"glucose → (glycolysis) → pyruvate → (pyruvate oxidation) → acetyl-CoA → (Krebs) → CO₂ + NADH/FADH₂ → (chain) → H₂O + ATP", ok:true, why:"The four stages in order, with each one’s main products." },
          { t:"glucose → (Krebs) → pyruvate → (glycolysis) → CO₂", why:"Glycolysis comes first." },
          { t:"O₂ → (glycolysis) → CO₂", why:M3 },
          { t:"glucose + light → O₂", why:"That mixes in photosynthesis." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which statement best compares photosynthesis and respiration?", options:[
          { t:"“Photosynthesis reduces CO₂ to sugar using light energy; respiration oxidizes sugar to CO₂ to make ATP. Atoms cycle between them, but energy ends as heat.”", ok:true, why:"It gives each process’s direction and energy, and says that matter cycles while energy flows through." },
          { t:"“Plants photosynthesize and animals respire.”", why:M4 },
          { t:"“Energy cycles between them just like carbon.”", why:M5 },
          { t:"“They are the same reactions in the same organelle.”", why:"Different organelles, opposite directions." }] },
        b:{ prompt:"Which statement about plants is correct?", options:[
          { t:"“Plants respire all the time; in bright light their photosynthesis is faster than their respiration.”", ok:true, why:"Respiration never stops; in light, photosynthesis runs on top of it." },
          { t:"“Plants respire only at night.”", why:M4 },
          { t:"“Plants don’t respire because they make their own O₂.”", why:M4 },
          { t:"“Plants photosynthesize at night and respire by day.”", why:"Photosynthesis needs light." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Grain stored in a damp, sealed silo warms up and its CO₂ level rises. What is the best explanation?", options:[
          { t:"Respiration by the grain and by microbes releases heat and CO₂", ok:true, why:"Heat and CO₂ are both products of respiration by living cells." },
          { t:"The grain is photosynthesizing", why:"No light in a silo." },
          { t:"The silo’s walls trap sunlight", why:"The CO₂ rise points to respiration." },
          { t:"Water reacts with grain to make CO₂", why:"That’s respiration, done by living cells." }] },
        b:{ prompt:"A compost heap’s centre can reach 60 °C. What is the main source of the heat?", options:[
          { t:"Respiration by decomposer microbes, releasing energy as heat", ok:true, why:"Most of the energy from respiring the plant material leaves as heat." },
          { t:"Photosynthesis inside the heap", why:"No light inside the heap." },
          { t:"Sunlight stored in the heap", why:"Sunlight doesn’t warm the centre of the heap." },
          { t:"Chemical reactions with no living things involved", why:"Microbes do the respiring." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Endurance training increases the number of mitochondria in muscle cells. Which benefit follows most directly?", options:[
          { t:"More ATP from aerobic respiration, so less reliance on fermentation", ok:true, why:"More mitochondria can run more pyruvate oxidation, Krebs cycle and chain." },
          { t:"More glycolysis in the mitochondria", why:M2 },
          { t:"Muscles need less O₂", why:"More mitochondria use more O₂, efficiently." },
          { t:"Muscles make glucose from CO₂", why:"That’s photosynthesis." }] },
        b:{ prompt:"A rare genetic disorder damages the electron transport chain. Which organs would you expect to be affected most?", options:[
          { t:"High-energy organs such as the brain and heart", ok:true, why:"They depend most on the chain’s ATP." },
          { t:"Only the lungs", why:"The problem is in every cell’s mitochondria." },
          { t:"Organs that photosynthesize", why:"Human organs don’t." },
          { t:"None, because glycolysis makes most of the ATP", why:"The chain makes about 32 of 36." }] } }
    ]
  },
  task:{
    title:"Design a fair respiration test", summary:"Design a fair respiration test",
    statement:"<p>Set up two tubes and an indicator to show that germinating seeds release CO₂ by respiring. Every condition must be met. Can you find all the answers?</p><ol class=\"cr-conds\"><li>Tube A will clearly respire: germinating peas at 25 °C.</li><li>Tube B (the control) can’t respire: boiled peas or glass beads.</li><li>It’s a fair test: both tubes are at the same temperature.</li><li>The indicator detects CO₂: limewater or bromothymol blue.</li></ol>",
    aList:[{ id:"germ", t:"germinating peas" }, { id:"dry", t:"dry peas" }, { id:"boiled", t:"boiled peas" }],
    bList:[{ id:"germ", t:"germinating peas" }, { id:"dry", t:"dry peas" }, { id:"boiled", t:"boiled peas" }, { id:"beads", t:"glass beads" }],
    temps:[10, 25],
    inds:[{ id:"lime", t:"limewater" }, { id:"btb", t:"bromothymol blue" }, { id:"iodine", t:"iodine" }],
    previewNote:"Model results after 20 min. Germinating peas respire fast at 25 °C and slowly at 10 °C; dry peas respire very slowly; boiled peas and glass beads don’t respire.",
    checks:["Tube A respires clearly", "Control can’t respire", "Fair test", "Indicator detects CO₂"],
    tips:["Germinating seeds respire fastest, and warmth speeds it up.", "A control should be the same in every way but unable to respire.", "Change only one thing between the tubes.", "Iodine tests for starch, not CO₂."],
    explainPrompt:"Explain what result you expect in each tube and what it would show about respiration.",
    vocab:"Use the words control, independent variable, dependent variable and carbon dioxide.",
    more:"Can you find all the answers?",
    allFound:"You’ve found all four answers.",
    afterAll:"Boiled peas control for ‘peas without life’; glass beads control for ‘something taking up the same space’. Doing both rules out more explanations."
  },
  cards:[
    ["Summary equation", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP + heat)."],
    ["Glycolysis", "Cytosol. Glucose → 2 pyruvate; net 2 ATP, 2 NADH."],
    ["Pyruvate oxidation", "Matrix. 2 pyruvate → 2 acetyl-CoA + 2 CO₂ + 2 NADH."],
    ["Krebs cycle (per glucose)", "Matrix. 4 CO₂, 6 NADH, 2 FADH₂, 2 ATP."],
    ["Electron transport and chemiosmosis", "Inner membrane. Carriers unload; O₂ → H₂O; ATP synthase makes most ATP."],
    ["Where O₂ is used", "Only at complex IV, as the final electron acceptor."],
    ["Where O₂’s atoms go", "Into water, not CO₂."],
    ["ATP per glucose", "≈ 36 (textbook, eukaryote); ≈ 30–32 (current estimate)."],
    ["Mitochondrion parts", "Outer membrane, intermembrane space, inner membrane (cristae), matrix."],
    ["Testing for CO₂", "Limewater turns milky; bromothymol blue turns yellow."],
    ["Photosynthesis vs respiration", "Reduce CO₂ with light energy vs oxidize sugar to make ATP. Matter cycles; energy flows."],
    ["Plants respire too", "All the time; in bright light photosynthesis outpaces respiration."]
  ]
};
