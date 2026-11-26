// SBI4U 20 Alternate Pathways (Fermentation). Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/20-fermentation.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Converting pyruvate to lactate or ethanol makes <strong>no</strong> ATP. Its job is to turn NADH back into NAD⁺, so glycolysis can keep making its 2 ATP.";
const M2 = "Only alcohol fermentation removes CO₂ (pyruvate → acetaldehyde). Lactate keeps all three carbons.";
const M3 = "Fermentation <strong>uses</strong> NADH and <strong>gives back</strong> NAD⁺. NADH is made in glycolysis.";
const M4 = "With no O₂ to accept electrons at the end of the chain, everything upstream backs up. Only glycolysis plus fermentation keeps going.";
const M5 = "Lactate is carried to the liver and rebuilt into pyruvate and glucose. Soreness a day or two later comes from small muscle injuries, not lactate.";
const M6 = "Fatty acids are cut into acetyl-CoA by beta-oxidation and go straight into the Krebs cycle.";
const M7 = "Glycolysis makes 4 ATP but spends 2, so the net is 2.";
const C = (s) => '<span class="bio-tok" style="--tok:var(--bio-carbon)">' + s + "</span>";
const LOOP = '<span class="fe-arr"><span aria-hidden="true">→</span><small class="fe-loop"><span aria-hidden="true">↻</span> NADH → NAD⁺</small></span>';

export default {
  id:"20-fermentation",
  kind:"topic",
  title:"Alternate pathways (fermentation)",
  topic:"Alternate Pathways (Fermentation)",
  readyTopic:"fermentation",
  hero:{
    eq:'<span class="fe-heq"><span class="fe-hl">' + C("glucose") + ' <span class="fe-arr"><span aria-hidden="true">→</span></span> ' + C("2 pyruvate") + " " + LOOP + " " + C("2 lactate") + "</span>" +
      '<span class="fe-hl">' + C("glucose") + ' <span class="fe-arr"><span aria-hidden="true">→</span></span> ' + C("2 pyruvate") + " " + LOOP + " " + '<span class="fe-nw">' + C("2 ethanol") + " + " + C("2 CO₂") + "</span></span></span>",
    eqLabel:"Lactate fermentation: glucose, then 2 pyruvate, then 2 lactate. Alcohol fermentation: glucose, then 2 pyruvate, then 2 ethanol plus 2 CO₂. Under each second arrow, NADH is turned back into NAD⁺.",
    eqSize:"sm",
    headline:"No oxygen? Recycle the carrier.",
    text:"Glycolysis needs a steady supply of <strong>NAD⁺</strong>. With oxygen, the electron transport chain recycles NADH back to NAD⁺. Without it, cells use <strong>fermentation</strong>: pyruvate takes the electrons instead, becoming <strong>lactate</strong> in your muscles or <strong>ethanol and CO₂</strong> in yeast. The cell gets only the <strong>2 ATP</strong> from glycolysis, but it stays alive.",
    fig:{ html:'<div class="fe-hero" id="fe-hero" role="img" aria-label="A muscle cell. A blue O₂ supply bar drains to empty. Inside, the glycolysis lane keeps turning while a teal NAD⁺ gauge falls toward zero. Just before it hits zero, an arrow from pyruvate to lactate lights up and a teal loop, NADH to NAD⁺, spins. The gauge refills and glycolysis keeps running."></div>' }
  },
  goals:[
    "I can explain why fermentation is needed: it regenerates NAD⁺ so glycolysis can continue.",
    "I can describe lactate and alcohol fermentation: reactants, products, CO₂ and ATP per glucose.",
    "I can predict what happens to a cell when oxygen or a fermentation enzyme is missing.",
    "I can compare the ATP yield of aerobic respiration and fermentation, and use it in calculations.",
    "I can describe how fats and proteins enter cellular respiration.",
    "I can apply fermentation to food, fuel and exercise, and interpret data from a fermentation experiment."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Glycolysis totals", goal:4,
          prompt:"What is the <strong>net</strong> ATP yield of glycolysis per glucose?",
          options:[
            { t:"2 ATP", ok:true, why:"4 made by substrate-level phosphorylation, minus 2 invested." },
            { t:"4 ATP", why:"Gross, not net. Two ATP were spent in the investment phase." },
            { t:"36 ATP", why:"That’s the theoretical total for all four stages." },
            { t:"0 ATP", why:"4 made − 2 spent = 2." }],
          hints:["Glycolysis has an investment phase and a payoff phase.", "Spent 2, made 4.", "Net 2 ATP."] },
        { id:"w2", skill:"Glycolysis totals", goal:2,
          prompt:"Glycolysis splits one glucose (6C) into…",
          options:[
            { t:"2 pyruvate (3C each)", ok:true, why:"6 carbons become 2 × 3." },
            { t:"3 pyruvate (2C each)", why:"Acetyl groups (2C) come later, in pyruvate oxidation." },
            { t:"6 CO₂", why:"CO₂ is released later, in pyruvate oxidation and the Krebs cycle." },
            { t:"2 lactate", why:"Lactate is made <strong>after</strong> glycolysis, only without O₂." }],
          hints:["Count the carbons.", "6 = 2 × 3.", "2 pyruvate."] },
        { id:"w3", skill:"NAD⁺ and NADH", goal:1,
          prompt:"During glycolysis, NAD⁺ is…",
          options:[
            { t:"reduced to NADH", ok:true, why:"It gains electrons (and a hydrogen) from the sugar." },
            { t:"oxidized to NADH", why:"OIL RIG: gaining electrons is reduction." },
            { t:"turned into ATP", why:"NADH carries electrons; ATP is separate." },
            { t:"used up and never regenerated", why:"Carriers are recycled; that’s what this module is about." }],
          hints:["Does NAD⁺ gain or lose electrons in glycolysis?", "It picks up 2 electrons and a proton.", "Reduced to NADH."] },
        { id:"w4", skill:"NAD⁺ and NADH", goal:1,
          prompt:"A cell has a fixed, small pool of NAD⁺. What happens if NADH is never turned back into NAD⁺?",
          options:[
            { t:"Glycolysis stops once the NAD⁺ is used up", ok:true, why:"Glycolysis needs NAD⁺ to accept electrons." },
            { t:"Glycolysis speeds up", why:"More NADH doesn’t mean more energy here. Without NAD⁺, the step that needs it can’t happen." },
            { t:"The cell makes NAD⁺ from glucose", why:"NAD⁺ is a carrier made from a vitamin (niacin), not from glucose." },
            { t:"Nothing; NADH works just as well", why:"NADH is already full of electrons; it can’t accept more." }],
          hints:["Which form accepts electrons?", "NAD⁺, the empty form.", "No NAD⁺ → glycolysis stops."] },
        { id:"w5", skill:"Aerobic respiration", goal:4,
          prompt:"In aerobic respiration, what is the final electron acceptor?",
          options:[
            { t:"O₂, forming water", ok:true, why:"Oxygen pulls the electrons at the end of the chain." },
            { t:"NAD⁺", why:"NAD⁺ starts the electrons’ journey; O₂ ends it." },
            { t:"CO₂", why:"CO₂ is a waste product, released from carbon compounds." },
            { t:"Pyruvate", why:"That’s fermentation. Pyruvate accepts electrons only when O₂ is absent (lactate fermentation)." }],
          hints:["What do you breathe in, and why?", "It ends up as H₂O.", "O₂."] },
        { id:"w6", skill:"Aerobic respiration", goal:4,
          prompt:"Using the theoretical count (3 ATP per NADH, 2 per FADH₂), how many ATP does a eukaryotic cell make per glucose aerobically?",
          options:[
            { t:"36", ok:true, why:"The glycerol-phosphate shuttle costs 2 of the 38." },
            { t:"38", why:"That’s the prokaryote figure. Prokaryotes skip the mitochondrial shuttle cost." },
            { t:"2", why:"That’s the fermentation figure: glycolysis alone." },
            { t:"30", why:"About 30–32 is the <strong>current estimate</strong> (2.5 and 1.5 per carrier), not the theoretical count." }],
          hints:["Check the assumption in the question.", "Theoretical eukaryote, using the glycerol-phosphate shuttle.", "36."] }
      ],
      refreshers:{
        "Glycolysis totals":"Per glucose: 2 ATP spent, 4 made (net 2), 2 NADH made, 2 pyruvate (3C) formed. It happens in the cytosol and needs no O₂.",
        "NAD⁺ and NADH":"NAD⁺ is the empty carrier; NADH is loaded with 2 electrons. A cell has only a small pool, so NADH must be emptied back to NAD⁺ for glycolysis to continue.",
        "Aerobic respiration":"O₂ is the final electron acceptor. The theoretical yield is 36 ATP (eukaryote) or 38 (prokaryote); current estimates are about 30–32."
      }
    }
  },
  explore:{
    heading:"Oxygen switch",
    intro:"Choose a cell, then turn the oxygen off. Watch where pyruvate goes, what happens to the NAD⁺ supply, and how much ATP the cell gets per glucose.",
    chalIntro:"Use the oxygen switch to meet each goal, then press <strong>Check challenge</strong>. For challenge 3, switch to <strong>Other fuels</strong> and type your numbers in the answer boxes under the controls. Each challenge has three levels of help.",
    modelNote:"Glycolysis runs at 10 glucose/s while it has NAD⁺. The NAD⁺ pool starts at 100 units, and each glucose uses 2. O₂ (through the chain) or a working fermentation enzyme returns them. Settings apply from 0 s.",
    enzNote:"Muscle cell: lactate dehydrogenase. Yeast cell: alcohol dehydrogenase (pyruvate decarboxylase stays on).",
    predictions:[
      { id:"p1", prompt:"Yeast in a sealed bottle of sugar water: what gas bubbles out?",
        options:[{ t:"CO₂", ok:true }, { t:"O₂" }, { t:"H₂" }, { t:"No gas" }],
        explain:"Pyruvate (3C) loses one carbon as CO₂ to become acetaldehyde (2C), which is then reduced to ethanol.",
        reveal:"Brown CO₂ tokens leave each pyruvate as acetaldehyde forms. The CO₂ row reads 2 per glucose.",
        start:{ cell:"yeast", o2:"absent", enz:"working", t:0 }, to:8 },
      { id:"p2", prompt:"How much CO₂ does lactate fermentation release per glucose?",
        options:[{ t:"0", ok:true }, { t:"2" }, { t:"6" }, { t:"1" }],
        explain:"NADH hands its electrons straight to pyruvate. No carbon is removed.",
        reveal:"Pyruvate became lactate with all three carbons kept. The CO₂ row reads 0.",
        start:{ cell:"muscle", o2:"absent", enz:"working", t:0 }, to:8 },
      { id:"p3", prompt:"Muscle cell, O₂ absent, enzyme <strong>blocked</strong>; Play from 0 s. What happens to glycolysis?",
        options:[{ t:"It stops when the NAD⁺ runs out", ok:true }, { t:"It keeps making 2 ATP per glucose" }, { t:"It switches to the Krebs cycle" }, { t:"It speeds up to make up for the lost ATP" }],
        explain:"Without O₂ <strong>and</strong> without fermentation, nothing turns NADH back into NAD⁺. Fermentation’s whole job is that recycling.",
        reveal:"The NAD⁺ gauge drained to 0 at 5 s and the glycolysis lane froze.",
        start:{ cell:"muscle", o2:"absent", enz:"blocked", t:0 }, to:8 },
      { id:"p4", prompt:"Yeast, O₂ absent → switch O₂ to present (theoretical count). ATP per glucose jumps from 2 to…",
        options:[{ t:"36", ok:true }, { t:"4" }, { t:"38" }, { t:"18" }],
        explain:"Yeast are eukaryotes, so with the 3/2 assumption and the glycerol-phosphate shuttle the theoretical total is 36: 18 times the fermentation yield.",
        reveal:"The route switched to the mitochondrion; the ledger reads 36 ATP per glucose.",
        start:{ cell:"yeast", o2:"absent", enz:"working", t:10 }, to:10 }
    ],
    challenges:[
      { id:"tc1", goal:[1, 3], prompt:"Keep a muscle cell’s glycolysis running for the full 60 s with <strong>no oxygen</strong>.",
        why:"Lactate dehydrogenase hands NADH’s electrons to pyruvate, so NAD⁺ keeps coming back and the pool stays at 100 units.",
        general:"Run the time all the way to 60 s with glycolysis still running.",
        named:{ mode:"Switch to <strong>Oxygen switch</strong> mode first.", cell:"The challenge is about a muscle cell.",
          blocked:"The NAD⁺ ran out at 5 s. Something has to take the electrons from NADH.",
          o2:"That works, but the challenge says no oxygen.", time:"Glycolysis is running. Now run the time to 60 s (press Play, or drag the time slider)." },
        hints:["What does glycolysis need a constant supply of?", "NAD⁺. Which pathway recycles it without O₂?", "Lactate fermentation: keep the enzyme working."] },
      { id:"tc2", goal:3, prompt:"Set up a cell that makes <strong>2 CO₂ and 2 ATP</strong> per glucose.",
        why:"Alcohol fermentation: each pyruvate loses one CO₂, and the cell keeps glycolysis’s net 2 ATP.",
        general:"Look at the ATP and CO₂ rows of the ledger: you need 2 and 2.",
        named:{ mode:"Switch to <strong>Oxygen switch</strong> mode first.", muscle:"2 ATP, but lactate fermentation makes no CO₂.",
          aerobic:"That’s aerobic: 6 CO₂ and 36 ATP.", blocked:"Glycolysis stopped at 5 s; acetaldehyde piles up." },
        hints:["Which fermentation releases CO₂?", "Alcohol fermentation, in yeast.", "Yeast, O₂ absent, enzyme working."] },
      { id:"tc3", goal:5, stretch:true,
        prompt:"Other fuels: choose the fatty-acid length that gives <strong>exactly 7 acetyl-CoA</strong>, then enter the number of NADH and FADH₂ made by its beta-oxidation (before the Krebs cycle).",
        why:"14 carbons make 7 two-carbon acetyl-CoA. Cutting a strip into 7 pieces takes 6 cuts, and each round of beta-oxidation makes 1 NADH and 1 FADH₂: 6 and 6.",
        general:"Check the chain length first, then count the rounds of beta-oxidation.",
        named:{ fuel:"Choose <strong>Other fuels</strong>, then <strong>Fatty acid</strong>.", len:"Each acetyl-CoA has 2 carbons, so 7 of them need 14.",
          blank:"Type the NADH and FADH₂ numbers in the answer boxes for challenge 3.",
          n7:"Count the cuts, not the pieces: 7 two-carbon pieces need only 6 cuts, and each cut (round) makes 1 NADH and 1 FADH₂.",
          n21:"Those are the Krebs-cycle NADH (3 per acetyl-CoA); the question stops before the Krebs cycle." },
        hints:["Acetyl-CoA is a 2-carbon unit.", "14 carbons → 7 pieces. How many cuts does it take to cut a strip into 7 pieces?", "6 rounds: 6 NADH and 6 FADH₂."] }
    ]
  },
  part3:{
    slug:"industry", name:"At work", heading:"Fermentation at work",
    intro:"Five stations: bread, yogurt and cheese, fuel ethanol, a yeast experiment, and a sprinter’s muscles. Each one runs on the pathways from the oxygen switch. Work through them, then try the quick check.",
    st1:{ title:"Station 1: Bread",
      steps:[
        { id:"mix", t:"Mix", cap:"Flour, water, sugar and yeast are mixed. The yeast cells start to ferment the flour’s sugars." },
        { id:"rise", t:"Let it rise", cap:"Yeast cells ferment the flour’s sugars. The CO₂ bubbles are trapped by gluten, and the dough rises." },
        { id:"bake", t:"Bake", cap:"In the oven, the ethanol evaporates and the yeast die. The trapped bubbles set into bread." }],
      note:"In real dough, yeast ferment even before the O₂ is gone when sugar is plentiful; this module’s model keeps the simpler textbook switch." },
    st2:{ title:"Station 2: Yogurt and cheese",
      text:"Lactic acid bacteria ferment lactose (milk sugar) into lactate. The pH falls from about 6.5 to about 4.5, milk proteins clump, and the milk thickens and sours.",
      zoom:"Zoom to the molecules", zoomText:"The same pyruvate → lactate step as in your muscles: lactate dehydrogenase hands NADH’s electrons to pyruvate and gives back NAD⁺. No CO₂ is released." },
    st3:{ title:"Station 3: Fuel ethanol",
      chain:["Corn or wheat starch", "glucose", "yeast fermentation", "ethanol", "blended into gasoline"],
      left:"Renewable carbon", right:"Land, water and energy inputs",
      ask:"Weigh it: which side do you think is heavier?",
      views:[{ id:"l", t:"Renewable carbon weighs more" }, { id:"e", t:"About balanced" }, { id:"r", t:"The inputs weigh more" }],
      after:"There’s no single right answer here. Scientists and governments weigh the same two sides, and the balance changes with the crop, the farm and the energy used to make the fuel." },
    st4:{ title:"Station 4: The yeast experiment",
      setup:"Five flasks, each with the same mass of yeast, 10 g of sugar and 100 mL of water, sealed with balloons and kept at different temperatures for 20 min.",
      temps:[15, 25, 35, 45, 55], co2:[4, 10, 14, 6, 0],
      vars:[
        { id:"temp", t:"Temperature", answer:"ind" }, { id:"co2", t:"CO₂ volume", answer:"dep" }, { id:"yeast", t:"Mass of yeast", answer:"con" },
        { id:"sugar", t:"Mass of sugar", answer:"con" }, { id:"water", t:"Volume of water", answer:"con" }, { id:"time", t:"Time", answer:"con" }],
      roles:[{ id:"ind", t:"Independent variable", sub:"what you change" }, { id:"dep", t:"Dependent variable", sub:"what you measure" }, { id:"con", t:"Controlled variables", sub:"kept the same (find two)" }],
      varsDone:"✓ Temperature is the independent variable, the CO₂ volume is the dependent variable, and the mass of yeast, mass of sugar, volume of water and time are all kept the same.",
      conclusion:{ prompt:"Choose the best conclusion.",
        options:[
          { t:"The rate rises to a maximum in the tested range near 35 °C, then falls as the enzymes denature.", ok:true, why:"It describes the whole pattern, stays within the tested range, and gives the reason." },
          { t:"The warmer the yeast, the faster they ferment.", why:"That fits 15–35 °C only. At 45 °C and 55 °C the volume falls." },
          { t:"35 °C is the exact best temperature for every kind of yeast.", why:"Only five temperatures were tested, 10 °C apart, with one kind of yeast. The data say “near 35 °C” for this yeast." },
          { t:"Temperature has no effect on fermentation.", why:"The volumes range from 0 mL to 14 mL as the temperature changes." }] },
      control:{ label:"yeast + water, no sugar, 35 °C", why:"It shows the gas comes from fermenting the sugar." } },
    st5:{ title:"Station 5: After the sprint",
      text:"Blood lactate is about 1 mmol/L at rest. It rises to about 12 mmol/L after a 400 m sprint and falls back over the next hour, while extra oxygen use stays high for the first minutes.",
      zoom:"Zoom to the molecules",
      zoomSteps:["In the muscle: pyruvate + NADH → lactate + NAD⁺, while O₂ delivery can’t keep up.", "The blood carries the lactate to the liver.", "In the liver, lactate is oxidized back to pyruvate and rebuilt into glucose. That uses ATP made with the extra O₂: the “oxygen debt”."],
      card:M5 },
    quickCheck:{
      title:"Fermentation at work quick check", summary:"Fermentation at work quick check",
      items:[
        { id:"q1", goal:6, prompt:"What makes bread dough rise?",
          choices:[{ t:"CO₂ from yeast", ok:true, fb:"Alcohol fermentation releases CO₂, trapped as bubbles." },
            { t:"O₂ from yeast", fb:"Alcohol fermentation releases CO₂, trapped as bubbles." },
            { t:"Ethanol vapour", fb:"Alcohol fermentation releases CO₂, trapped as bubbles." },
            { t:"Lactate", fb:"Alcohol fermentation releases CO₂, trapped as bubbles." }] },
        { id:"q2", goal:6, prompt:"In the yeast data, why is the volume 0 mL at 55 °C?",
          choices:[{ t:"Enzymes denatured", ok:true, fb:"At high temperature, enzyme shapes change and fermentation stops." },
            { t:"No sugar was added", fb:"At high temperature, enzyme shapes change and fermentation stops." },
            { t:"O₂ was present", fb:"At high temperature, enzyme shapes change and fermentation stops." },
            { t:"Ethanol is a gas", fb:"At high temperature, enzyme shapes change and fermentation stops." }] },
        { id:"q3", goal:6, prompt:"Which is a controlled variable in the yeast experiment?",
          choices:[{ t:"Mass of sugar", ok:true, fb:"Temperature is what’s changed; CO₂ is what’s measured." },
            { t:"Temperature", fb:"Temperature is what’s changed; CO₂ is what’s measured." },
            { t:"CO₂ volume", fb:"Temperature is what’s changed; CO₂ is what’s measured." },
            { t:"Balloon colour", fb:"Temperature is what’s changed; CO₂ is what’s measured." }] },
        { id:"q4", goal:6, prompt:"After a sprint, where is most lactate turned back into glucose?",
          choices:[{ t:"The liver", ok:true, fb:"Lactate travels in the blood to the liver." },
            { t:"The lungs", fb:"Lactate travels in the blood to the liver." },
            { t:"The kidneys", fb:"Lactate travels in the blood to the liver." },
            { t:"It’s breathed out", fb:"Lactate travels in the blood to the liver." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"which", type:"sorter", title:"Which pathway?", summary:"Which pathway?", goal:[1, 2], noun:"statement", txt:true,
        instruction:"Ten statements. Sort each one into the route it describes.",
        boxes:[{ id:"b1", label:"Aerobic respiration only" }, { id:"b2", label:"Lactate fermentation only" }, { id:"b3", label:"Alcohol fermentation only" }, { id:"b4", label:"All three" }],
        wrongDefault:"Check what happens to pyruvate in that route. Try another box.",
        items:[
          { id:"i1", t:"O₂ is the final electron acceptor", answer:"b1", why:"Only the chain uses O₂, at its very end." },
          { id:"i2", t:"Pyruvate takes electrons from NADH directly, losing no carbon", answer:"b2", why:"Lactate keeps all three carbons.",
            wrong:{ b3:"Alcohol fermentation removes a carbon first; lactate keeps all three." } },
          { id:"i3", t:"Pyruvate loses CO₂ to become acetaldehyde", answer:"b3", why:"Only alcohol fermentation removes CO₂ (pyruvate → acetaldehyde).",
            hints:["Which route makes a gas?", "Yeast: CO₂ is removed first.", "Alcohol only."] },
          { id:"i4", t:"Begins with glycolysis, making a net 2 ATP", answer:"b4", why:"Every route starts with glycolysis.",
            wrong:{ b1:"Every route starts with glycolysis." } },
          { id:"i5", t:"Lets a sprinter’s muscles keep going when O₂ delivery lags", answer:"b2", why:"Muscle cells make lactate when O₂ can’t keep up." },
          { id:"i6", t:"Makes bread dough rise", answer:"b3", why:"Yeast’s CO₂ is trapped as bubbles in the dough." },
          { id:"i7", t:"The Krebs cycle runs", answer:"b1", why:"Without O₂ the chain stops, and the Krebs cycle backs up too." },
          { id:"i8", t:"NADH is turned back into NAD⁺", answer:"b4", why:"The chain recycles NADH with O₂; fermentation recycles it without.",
            wrong:{ b1:"Fermentation also regenerates NAD⁺; that’s its whole purpose." },
            hints:["Which molecule does glycolysis need back?", "NAD⁺. The chain recycles it with O₂; fermentation recycles it without.", "All three."] },
          { id:"i9", t:"Used to make yogurt", answer:"b2", why:"Lactic acid bacteria ferment lactose to lactate." },
          { id:"i10", t:"Releases 6 CO₂ per glucose", answer:"b1", why:"2 CO₂ in pyruvate oxidation + 4 in the Krebs cycle = 6.",
            wrong:{ b3:"Alcohol fermentation releases only 2 CO₂ per glucose." } }
        ] },
      { id:"fuel", type:"numeric", title:"Fuel accounting", summary:"Fuel accounting", goal:[4, 5],
        instruction:"Six problems. Problems 3–6 are non-routine (★); 5 and 6 go beyond the Final Check.",
        how:"Type a number, then press Check.",
        items:[
          { id:"f1", goal:5, prompt:"How many acetyl-CoA come from a 16-carbon fatty acid?", answer:8, display:"8 acetyl-CoA", unit:"acetyl-CoA",
            why:"16 carbons ÷ 2 carbons per acetyl-CoA = 8.", wrong:[{ match:16, fb:"Each acetyl-CoA carries <strong>2</strong> carbons." }] },
          { id:"f2", goal:5, prompt:"How many rounds of beta-oxidation does that 16-carbon chain need?", answer:7, display:"7 rounds", unit:"rounds",
            why:"8 two-carbon pieces need 7 cuts.", wrong:[{ match:8, fb:"The last cut makes <strong>two</strong> acetyl-CoA, so 8 pieces need 7 cuts." }] },
          { id:"f3", goal:4, star:true, prompt:"A yeast culture ferments 4 glucose molecules. How many CO₂ molecules are released?", answer:8, display:"8 CO₂", unit:"CO₂",
            why:"Alcohol fermentation releases 2 CO₂ per glucose: 4 × 2 = 8.", wrong:[{ match:24, fb:"That’s aerobic (6 per glucose). Alcohol fermentation releases 2 per glucose." }] },
          { id:"f4", goal:4, star:true, prompt:"A muscle cell needs 72 ATP. How many glucose molecules must it use by lactate fermentation?", answer:36, display:"36 glucose", unit:"glucose",
            why:"Fermentation gives 2 ATP per glucose: 72 ÷ 2 = 36.", wrong:[{ match:2, fb:"That’s the aerobic answer (36 ATP each). Fermentation gives only 2 per glucose." }] },
          { id:"f5", goal:[4, 5], star:true, prompt:"Using the values box, how many ATP does a 12-carbon fatty acid yield in total?", answer:95, display:"95 ATP", unit:"ATP",
            use:"Per acetyl-CoA through the Krebs cycle and chain: 12 ATP. Per NADH: 3 ATP. Per FADH₂: 2 ATP. Activating a fatty acid costs 2 ATP.",
            why:"6 acetyl-CoA × 12 = 72; 5 rounds give 5 × 3 + 5 × 2 = 25; 72 + 25 − 2 = 95.",
            wrong:[{ match:97, fb:"Subtract the 2 ATP used to activate it." }, { match:72, fb:"Add the NADH and FADH₂ from the 5 rounds: 5 × 3 + 5 × 2 = 25." }],
            hints:["12 carbons: how many acetyl-CoA, and how many rounds?", "6 acetyl-CoA (72 ATP); 5 rounds give 5 NADH (15) and 5 FADH₂ (10).", "72 + 15 + 10 − 2 = 95."] },
          { id:"f6", goal:5, star:true, prompt:"Fat stores about 37 kJ/g; glycogen about 17 kJ/g. A runner stores 0.5 kg of glycogen and 10 kg of fat. About how many times more energy is in the fat?",
            answer:43.5, tol:0.0115, display:"about 44 times", unit:"times",
            why:"Fat: 10 000 g × 37 = 370 000 kJ. Glycogen: 500 g × 17 = 8500 kJ. 370 000 ÷ 8500 ≈ 43.5, about 44 times.",
            wrong:[{ match:20, fb:"Compare the energies, not the masses: 10 000 × 37 ÷ (500 × 17)." }],
            hints:["Energy = mass × energy per gram.", "Fat: 10 000 g × 37 = 370 000 kJ. Glycogen: 500 g × 17 = 8500 kJ.", "370 000 ÷ 8500 ≈ 43.5, about 44 times."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Karim", how:"",
        instruction:"Karim made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain why yeast make ethanol when oxygen runs out.",
            steps:["Without O₂, the electron transport chain stops.", "So NADH can’t unload its electrons, and NAD⁺ runs low.", "Yeast convert pyruvate to ethanol to make extra ATP.", "The products are ethanol and CO₂."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is true, but the mistake is earlier."],
            fixes:[
              { t:"Yeast convert pyruvate to ethanol to turn NADH back into NAD⁺, so glycolysis can keep making its 2 ATP.", ok:true, why:M1 },
              { t:"Yeast convert ethanol into pyruvate to make NADH.", why:"That’s backwards. " + M3 },
              { t:"Yeast convert pyruvate to lactate to make extra ATP.", why:"Wrong product, and still no extra ATP." },
              { t:"Step 3 is correct.", why:"The ethanol step makes no ATP at all." }],
            hints:["Does the pyruvate → ethanol route make any ATP?", "No. What does it make instead?", "NAD⁺."] },
          { id:"e2", goal:4, task:"Count the ATP from one glucose by lactate fermentation.",
            steps:["Glycolysis spends 2 ATP.", "Glycolysis makes 4 ATP.", "So glycolysis nets 2 ATP.", "Turning 2 pyruvate into 2 lactate makes 2 more ATP, for a total of 4."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Turning pyruvate into lactate makes no ATP, so the total stays at 2.", ok:true, why:M1 },
              { t:"It makes 4 more ATP, for a total of 6.", why:M1 },
              { t:"The total is 4, because gross glycolysis is 4.", why:M7 },
              { t:"Step 4 is correct.", why:M1 }],
            hints:["What does lactate dehydrogenase do?", "It moves electrons from NADH to pyruvate.", "No ATP: total 2."] },
          { id:"e3", goal:2, task:"Describe lactate fermentation in a sprinter’s leg muscle.",
            steps:["O₂ delivery can’t keep up with demand.", "Glycolysis continues, making pyruvate and NADH.", "Each pyruvate releases one CO₂ and becomes lactate.", "The lactate is later carried to the liver."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is true; the mistake is earlier."],
            fixes:[
              { t:"Each pyruvate takes electrons from NADH and becomes lactate, with no CO₂ released.", ok:true, why:M2 },
              { t:"Each pyruvate releases two CO₂.", why:M2 },
              { t:"Each pyruvate becomes ethanol.", why:"That’s yeast." },
              { t:"Step 3 is correct.", why:"Only alcohol fermentation releases CO₂." }],
            hints:["How many carbons does lactate have?", "Three, the same as pyruvate.", "No CO₂ is lost."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the oxygen switch: that fermentation makes no ATP, or how fast glycolysis stopped when the enzyme was blocked?" },
      { id:"j2", q:"In your own words, why does a cell that can’t get oxygen still need fermentation?" },
      { id:"j3", q:"Explain to a friend the difference between what happens to pyruvate in your muscles and in yeast." },
      { id:"j4", q:"Which part of fuel accounting (fats, proteins, ATP totals) still feels shaky? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the main job of fermentation?", options:[
          { t:"To regenerate NAD⁺ so glycolysis can continue", ok:true, why:"Fermentation passes NADH’s electrons to pyruvate (or a product of it), giving back the NAD⁺ that glycolysis needs." },
          { t:"To make extra ATP from pyruvate", why:"The pyruvate step makes no ATP." },
          { t:"To release CO₂ from glucose", why:"Only one kind of fermentation releases CO₂, and that isn’t its purpose." },
          { t:"To store energy as lactate for later", why:"Lactate is a by-product; the point is recycling NAD⁺." }] },
        b:{ prompt:"Which molecule do both kinds of fermentation regenerate?", options:[
          { t:"NAD⁺", ok:true, why:"Both hand NADH’s electrons to pyruvate (or acetaldehyde), giving back NAD⁺." },
          { t:"ATP", why:M1 },
          { t:"NADH", why:"NADH is used up; NAD⁺ is regenerated." },
          { t:"Pyruvate", why:"Pyruvate is consumed, not regenerated." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What does alcohol fermentation produce from one glucose?", options:[
          { t:"2 ethanol, 2 CO₂ and a net 2 ATP", ok:true, why:"Each pyruvate loses one CO₂ and becomes ethanol; the ATP is glycolysis’s net 2." },
          { t:"2 lactate and a net 2 ATP", why:"That’s lactate fermentation." },
          { t:"2 ethanol, 2 CO₂ and a net 4 ATP", why:"Net glycolysis is 2." },
          { t:"6 CO₂, 6 H₂O and 36 ATP", why:"That’s aerobic respiration." }] },
        b:{ prompt:"What does lactate fermentation produce from one glucose?", options:[
          { t:"2 lactate and a net 2 ATP", ok:true, why:"Pyruvate is reduced straight to lactate: no CO₂, and the ATP is glycolysis’s net 2." },
          { t:"2 lactate, 2 CO₂ and a net 2 ATP", why:"Lactate fermentation releases no CO₂." },
          { t:"2 ethanol, 2 CO₂ and a net 2 ATP", why:"That’s yeast." },
          { t:"2 lactate and a net 4 ATP", why:M7 }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"How do the fatty acids from fats enter cellular respiration?", options:[
          { t:"Beta-oxidation cuts them into 2-carbon acetyl-CoA units, which enter the Krebs cycle", ok:true, why:"Each round cuts off one 2-carbon unit, making 1 NADH and 1 FADH₂." },
          { t:"They are converted into glucose first", why:"Fatty acids can’t be turned into glucose in animals." },
          { t:"They enter glycolysis as 3-carbon pieces", why:"That’s glycerol, not the fatty acids." },
          { t:"They are deaminated and enter as pyruvate", why:"Deamination is for amino acids." }] },
        b:{ prompt:"What must happen to an amino acid before its carbon skeleton can be used for energy?", options:[
          { t:"Its amino group is removed (deamination), and the nitrogen leaves the body as urea", ok:true, why:"The carbon skeleton then enters as pyruvate, acetyl-CoA or a Krebs-cycle intermediate." },
          { t:"It’s cut into 2-carbon units by beta-oxidation", why:"That’s fatty acids." },
          { t:"It’s converted into glycerol", why:"Glycerol comes from fats." },
          { t:"Nothing; it enters the chain directly", why:"The electron transport chain takes electrons, not amino acids." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A mutant bacterium can do <strong>only</strong> lactate fermentation for anaerobic life, but its lactate-making enzyme is broken. It’s placed in a flask with glucose and <strong>no O₂</strong>. Predict what happens.", options:[
          { t:"Glycolysis runs briefly, then stops when NAD⁺ runs out, so the cell can make no ATP", ok:true, why:"With no O₂ and no working fermentation enzyme, nothing turns NADH back into NAD⁺." },
          { t:"It keeps making 2 ATP per glucose from glycolysis alone", why:"Glycolysis needs NAD⁺ back." },
          { t:"It switches to the Krebs cycle to recycle NAD⁺", why:"The Krebs cycle also makes NADH, and needs O₂ to keep going." },
          { t:"It makes ethanol instead", why:"It has no alcohol fermentation enzymes." }] },
        b:{ prompt:"Yeast are given a drug that blocks alcohol dehydrogenase (acetaldehyde → ethanol) and are kept with sugar and <strong>no O₂</strong>. Predict what happens.", options:[
          { t:"CO₂ and acetaldehyde build up briefly, then glycolysis stops as NAD⁺ runs out", ok:true, why:"Pyruvate decarboxylase still works, but nothing regenerates NAD⁺." },
          { t:"Ethanol production speeds up", why:"The ethanol step is blocked." },
          { t:"Glycolysis continues normally, since CO₂ is still released", why:"Releasing CO₂ doesn’t recycle NAD⁺; the blocked step does." },
          { t:"The yeast switch to the electron transport chain", why:M4 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Using 36 ATP per glucose for aerobic respiration, how many times more glucose must a cell use by fermentation to get the same ATP?", options:[
          { t:"18", ok:true, why:"36 ÷ 2." },
          { t:"9", why:"That uses 4 ATP for fermentation." },
          { t:"34", why:"That’s the difference, not the ratio." },
          { t:"2", why:"That’s the fermentation yield itself." }] },
        b:{ prompt:"Using 30 ATP per glucose for aerobic respiration, how many times more glucose must a cell use by fermentation to get the same ATP?", options:[
          { t:"15", ok:true, why:"30 ÷ 2." },
          { t:"7.5", why:M7 },
          { t:"28", why:"Difference, not ratio." },
          { t:"30", why:"That’s the aerobic yield." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Before a 400 m race, a runner’s blood lactate is 1 mmol/L. Just after, it’s 12 mmol/L. An hour later, it’s back near 1 mmol/L, and the runner breathed hard for several minutes after finishing. Which explanation fits all the data?", options:[
          { t:"Muscles fermented pyruvate to lactate when O₂ delivery fell behind; afterwards, extra O₂ supported the liver in turning lactate back into pyruvate and glucose", ok:true, why:"It explains the rise, the fall over the hour and the hard breathing." },
          { t:"The lactate was breathed out as CO₂ during the hard breathing", why:"Lactate isn’t exhaled; it’s processed, mainly in the liver." },
          { t:"Lactate built up because the Krebs cycle sped up during the race", why:"Lactate builds when the chain can’t keep up, not when the Krebs cycle speeds up." },
          { t:"The lactate stayed in the muscles and caused soreness the next day", why:M5 }] },
        b:{ prompt:"A rower’s blood lactate rises from 2 to 14 mmol/L during a 2 km race and returns to 2 mmol/L over the following hour. Oxygen use stays high for several minutes after the race. Which explanation fits?", options:[
          { t:"Lactate fermentation regenerated NAD⁺ when O₂ supply lagged; the extra O₂ afterwards supports converting the lactate back to pyruvate and glucose in the liver", ok:true, why:"It explains the rise, the return to 2 mmol/L and the extra O₂ use." },
          { t:"Fermentation made extra ATP, which is why lactate rose", why:M1 },
          { t:"Oxygen use stays high because muscles keep fermenting after the race", why:"Fermentation doesn’t use O₂." },
          { t:"The lactate was turned into ethanol and excreted", why:"Humans make lactate, not ethanol." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of how fermentation lets a cell survive without oxygen?", options:[
          { t:"“It passes electrons from NADH to pyruvate (or a product of it), regenerating the NAD⁺ that glycolysis needs, so glycolysis can keep making 2 ATP per glucose.”", ok:true, why:"It names the electron transfer, the NAD⁺ it regenerates, and where the ATP comes from." },
          { t:"“It makes a lot of extra ATP from pyruvate when oxygen is gone.”", why:M1 },
          { t:"“It replaces oxygen as the final electron acceptor of the electron transport chain.”", why:"Fermentation doesn’t use the chain at all." },
          { t:"“It turns lactate back into glucose so the cell can respire again.”", why:"That happens later, in the liver." }] },
        b:{ prompt:"Which is the best explanation of why fermentation yields only 2 ATP per glucose?", options:[
          { t:"“Only glycolysis makes ATP; the fermentation step only regenerates NAD⁺, and without O₂ the Krebs cycle and the chain can’t run.”", ok:true, why:"It says where the 2 ATP come from and why nothing else adds to them." },
          { t:"“Fermentation makes 2 ATP and glycolysis makes none.”", why:"It’s the other way round." },
          { t:"“Fermentation makes 4 ATP but uses 2.”", why:M7 },
          { t:"“Fermentation stops after 2 cycles.”", why:"There are no cycles in fermentation." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which flow chart correctly shows alcohol fermentation?", options:[
          { t:"glucose → 2 pyruvate (2 NADH made) → 2 acetaldehyde + 2 CO₂ → 2 ethanol (2 NADH → 2 NAD⁺)", ok:true, why:"Pyruvate first, then CO₂ removed, then NADH reduces acetaldehyde, giving back NAD⁺." },
          { t:"glucose → 2 pyruvate (2 NADH made) → 2 lactate + 2 CO₂ (2 NADH → 2 NAD⁺)", why:"Lactate fermentation releases no CO₂." },
          { t:"glucose → 2 pyruvate (2 NAD⁺ made) → 2 acetaldehyde + 2 CO₂ → 2 ethanol (2 NAD⁺ → 2 NADH)", why:"The carriers are reversed." },
          { t:"glucose → 2 acetaldehyde + 2 CO₂ → 2 pyruvate → 2 ethanol", why:"Pyruvate comes first, from glycolysis." }] },
        b:{ prompt:"Which flow chart correctly shows lactate fermentation?", options:[
          { t:"glucose → 2 pyruvate (2 NADH made) → 2 lactate (2 NADH → 2 NAD⁺)", ok:true, why:"NADH reduces pyruvate directly to lactate: no CO₂, and NAD⁺ comes back." },
          { t:"glucose → 2 pyruvate → 2 lactate + 2 CO₂", why:M2 },
          { t:"glucose → 2 pyruvate (2 NAD⁺ made) → 2 lactate (2 NAD⁺ → 2 NADH)", why:M3 },
          { t:"glucose → 2 lactate → 2 pyruvate (2 ATP made)", why:"Lactate is the end product, and that step makes no ATP." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A baker finds dough rises faster in a 30 °C room than a 10 °C room, but dough left in a 60 °C oven to rise doesn’t rise at all. Which explanation is best?", options:[
          { t:"Yeast enzymes work faster as temperature rises toward an optimum; at 60 °C they denature and the yeast die, so no CO₂ is made", ok:true, why:"It explains both observations with the enzymes’ optimum." },
          { t:"Warm dough rises because the air in it expands; yeast aren’t involved", why:"Expansion is small; the gas comes from fermentation." },
          { t:"At 60 °C the yeast switch to lactate fermentation, which makes no gas", why:"Yeast make ethanol; above about 50 °C they die." },
          { t:"Yeast make O₂ faster when warm", why:"Yeast make CO₂, not O₂." }] },
        b:{ prompt:"Milk left with lactic acid bacteria at 40 °C thickens and tastes sour. Which explanation is best?", options:[
          { t:"The bacteria ferment lactose into lactate; the falling pH makes milk proteins clump together", ok:true, why:"Lactate makes the milk sour, and the lower pH sets the proteins." },
          { t:"The bacteria make ethanol, which thickens milk", why:"Lactic acid bacteria make lactate." },
          { t:"The bacteria release CO₂, which curdles the milk", why:M2 },
          { t:"The heat alone thickens the milk", why:"Without bacteria, warm milk doesn’t sour or set." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Late in a marathon, a runner’s glycogen is nearly gone and fat supplies more of the energy. Why does fat hold more energy per gram than glycogen?", options:[
          { t:"Fatty acids are long chains rich in C–H bonds (highly reduced), so beta-oxidation and the Krebs cycle strip many electron pairs (NADH and FADH₂) from each gram", ok:true, why:"More C–H bonds per gram means more electrons to hand to the chain." },
          { t:"Fat is turned into glucose, which is then respired twice", why:M6 },
          { t:"Fat contains more oxygen atoms per gram, which give more energy", why:"Fat has <strong>fewer</strong> O atoms; it’s more reduced." },
          { t:"Fat is used by fermentation, which is more efficient", why:"Fermentation uses only glucose and yields little." }] },
        b:{ prompt:"During long fasting, the body breaks down some muscle protein for energy. Which waste product rises in the urine as a result?", options:[
          { t:"Urea, made in the liver from the nitrogen removed by deamination", ok:true, why:"Deamination removes the amino groups; the liver turns the nitrogen into urea." },
          { t:"Lactate, from fermenting the amino acids", why:"Amino acids aren’t fermented to lactate in the body." },
          { t:"Glucose, released from the protein", why:"Glucose in urine is a sign of high blood sugar, not protein use." },
          { t:"Ethanol", why:"Humans don’t make ethanol by fermentation." }] } }
    ]
  },
  task:{
    title:"Rise to the occasion", summary:"Rise to the occasion",
    statement:"<p>Set up a fermenter for bread dough that meets every condition. Can you find all the answers?</p>" +
      '<ol class="fe-conds"><li>It produces CO₂ gas.</li><li>The cells are fermenting (making only 2 ATP per glucose).</li><li>It collects at least 30 mL of CO₂ in 30 min.</li><li>It’s kept at 35 °C or cooler (the dough can’t be cooked).</li></ol>',
    inputs:{ org:"Organism", o2:"O₂", sugar:"Sugar", temp:"Temperature" },
    modelNote:"Yeast: CO₂ in 30 min = (sugar in g ÷ 10) × 6, 15, 30, 24 or 0 mL at 10, 20, 30, 40 or 50 °C. Lactic acid bacteria make no gas.",
    checks:["Produces CO₂", "Fermenting", "At least 30 mL in 30 min", "35 °C or cooler"],
    tips:["Lactic acid bacteria don’t release CO₂. Which organism does?", "With O₂ present, the yeast respire aerobically (36 ATP). Take the O₂ away.", "More sugar or a warmer temperature (up to the optimum) gives more gas.", "40 °C and 50 °C are too hot for the dough."],
    success:"Your fermenter works!",
    explainPrompt:"Explain why each setting you chose matters, using the yeast data pattern.",
    vocab:"Use the words fermentation, NAD⁺, CO₂, enzyme and optimum.",
    after3:"There’s a trade-off: less sugar needs a warmer temperature. And 40 °C would give more gas than 20 °C, but it’s too hot for dough."
  },
  cards:[
    ["Purpose of fermentation", "Regenerates NAD⁺ so glycolysis can keep running without O₂."],
    ["Lactate fermentation", "Pyruvate + NADH → lactate + NAD⁺. No CO₂. Muscle cells, yogurt bacteria."],
    ["Alcohol fermentation", "Pyruvate → acetaldehyde + CO₂; acetaldehyde + NADH → ethanol + NAD⁺. Yeast."],
    ["ATP from fermentation", "Net 2 per glucose, all from glycolysis. The fermentation step makes none."],
    ["Aerobic vs anaerobic yield", "About 36 (theoretical, eukaryote) or about 30–32 (current estimate) vs 2 ATP per glucose."],
    ["Obligate vs facultative anaerobe", "Obligate: can’t use O₂ (often harmed by it). Facultative: respires with O₂, ferments without (yeast)."],
    ["Oxygen debt", "Extra O₂ used after exercise, partly to turn lactate back into glucose in the liver."],
    ["Beta-oxidation", "Cuts fatty acids into 2-carbon acetyl-CoA; each round makes 1 NADH and 1 FADH₂."],
    ["Glycerol", "Enters glycolysis as a 3-carbon sugar phosphate (G3P)."],
    ["Deamination", "Removes an amino acid’s amino group; the nitrogen becomes urea in the liver."],
    ["Energy per gram", "Fat ≈ 37 kJ/g; carbohydrate and protein ≈ 17 kJ/g."],
    ["Fermentation in industry", "Bread (CO₂), yogurt and cheese (lactate), fuel ethanol, brewing."]
  ]
};
