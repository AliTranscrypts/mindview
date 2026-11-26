// SBI4U 18 Energy Transfer. Source: /Users/ali/Desktop/MV/Modules/sbi4u/plan/modules/18-energy-transfer.md
// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback of its own.
const M1 = "Energy is converted, not destroyed. What isn’t captured in ATP leaves as heat.";
const M2 = "Every conversion loses some energy as heat. Only about 34–38% ends up in ATP.";
const M3 = "Breaking ATP releases ≈ 30.5 kJ/mol (ΔG negative); making it needs that much.";
const M4 = "Fermentation stops early: most of the energy is still in the lactate or ethanol.";
const M5 = "ATP is spent and remade within seconds. Long-term stores are glycogen and fat.";
const M6 = "Efficiency is captured ÷ total. Heat is the rest.";
const M7 = "Matter cycles; energy flows through and leaves as heat. About 10% passes each step.";
const NB = " ";   // narrow no-break space for thousands (20 000)

export default {
  id:"18-energy-transfer",
  kind:"topic",
  title:"Energy transfer",
  topic:"Energy Transfer",
  readyTopic:"energy transfer",
  hero:{
    eq:'<span class="et-heq"><span class="bio-chem">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O</span><span class="et-heq2"><span class="bio-chem">ΔG ≈ −2870 kJ/mol,</span> <span class="bio-chem">which becomes ≈ 1098 kJ in <span class="et-c-atp">36 ATP</span></span> <span class="bio-chem">+ ≈ 1772 kJ heat</span></span></span>',
    eqLabel:"C₆H₁₂O₆ plus 6 O₂ gives 6 CO₂ plus 6 H₂O, ΔG about −2870 kJ/mol, which becomes about 1098 kJ in 36 ATP plus about 1772 kJ of heat",
    eqSize:"sm",
    headline:"Where does a mole of glucose’s energy go?",
    text:"Energy can’t be created or destroyed. It can only change form (the <strong>first law</strong>). But every change lets some energy escape as <strong>heat</strong> (the <strong>second law</strong>). So when a cell oxidizes glucose, part of the energy is captured in <strong>ATP</strong>, and the rest warms you up. ATP isn’t a store: it’s spent and remade constantly in the <strong>ATP–ADP cycle</strong>.",
    fig:{ html:'<div class="et-hero" id="et-hero" role="img" aria-label="A brown glucose block labelled 2870 kJ. A flow band splits it in two: an orange stream flows into a stack of 36 ATP tokens labelled 1098 kJ, and a grey wavy stream labelled heat, 1772 kJ, rises off the top. The ATP tokens power a muscle, turning into ADP and Pᵢ, and are recharged from the glucose stream: the ATP–ADP cycle."></div>' }
  },
  goals:[
    "I can use the first and second laws of thermodynamics to explain where glucose’s energy goes in a cell.",
    "I can calculate the energy captured in ATP, the heat released and the efficiency for a given ATP yield.",
    "I can explain the ATP–ADP cycle and how ATP hydrolysis drives an uphill reaction (coupling).",
    "I can compare aerobic respiration and fermentation, including where the unreleased energy stays.",
    "I can connect cellular energy transfer to body heat and to energy flow in ecosystems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"ΔG and ATP", goal:3,
          prompt:"ATP → ADP + Pᵢ has ΔG ≈ −30.5 kJ/mol. What does the negative sign mean?",
          options:[
            { t:"Energy is released, so the reaction can happen on its own", ok:true, why:"Exergonic." },
            { t:"Energy must be added", why:"That would be a positive ΔG." },
            { t:"The reaction is very slow", why:"ΔG says nothing about speed; enzymes affect speed." },
            { t:"The reaction can’t happen", why:"Negative ΔG means it can." }],
          hints:["ΔG &lt; 0 is exergonic.", "Exergonic reactions release energy.", "Energy is released, so the reaction can happen on its own."] },
        { id:"w2", skill:"ΔG and ATP", goal:3,
          prompt:"Making ATP from ADP + Pᵢ has ΔG of about…",
          options:[
            { t:"+30.5 kJ/mol", ok:true, why:"The reverse reaction has the opposite sign." },
            { t:"−30.5 kJ/mol", why:"That’s hydrolysis." },
            { t:"+2870 kJ/mol", why:"That’s the reverse of glucose oxidation." },
            { t:"0 kJ/mol", why:"It needs energy." }],
          hints:["Reverse a reaction and the sign of ΔG flips.", "Hydrolysis is −30.5.", "+30.5."] },
        { id:"w3", skill:"ATP yield", goal:2,
          prompt:"The theoretical ATP yield per glucose in a eukaryotic cell (3 per NADH, 2 per FADH₂, glycerol-phosphate shuttle) is…",
          options:[
            { t:"36", ok:true, why:"Module 19 builds this count." },
            { t:"38", why:"That’s prokaryotes (or the malate–aspartate shuttle)." },
            { t:"2", why:"That’s fermentation." },
            { t:"4", why:"That’s only the substrate-level ATP." }],
          hints:["Eukaryote, theoretical values.", "Prokaryotes get 38.", "36."] },
        { id:"w4", skill:"ATP yield", goal:4,
          prompt:"How many ATP does fermentation make per glucose?",
          options:[
            { t:"2", ok:true, why:"Only glycolysis’s net ATP." },
            { t:"36", why:"That’s aerobic respiration." },
            { t:"0", why:"Glycolysis still runs." },
            { t:"4", why:"That’s the gross ATP: 2 were invested." }],
          hints:["Which stage still runs without O₂?", "Glycolysis.", "2."] },
        { id:"w5", skill:"Energy forms", goal:1,
          prompt:"A muscle contracts using ATP. Which energy change is happening?",
          options:[
            { t:"Chemical energy → mechanical energy (and heat)", ok:true, why:"Some always becomes heat." },
            { t:"Mechanical → chemical", why:"That’s backwards." },
            { t:"Heat → chemical", why:"Cells can’t run on heat." },
            { t:"Chemical → nothing; it’s used up", why:"Energy changes form." }],
          hints:["What does ATP hold?", "Chemical energy.", "It becomes motion plus heat."] },
        { id:"w6", skill:"Energy forms", goal:5,
          prompt:"Why do you get warm when you exercise?",
          options:[
            { t:"Faster respiration and muscle work release more energy as heat", ok:true, why:"Second law in action." },
            { t:"Exercise creates new energy", why:"Energy isn’t created." },
            { t:"Sweat produces heat", why:"Sweat removes heat." },
            { t:"ATP is a heat store", why:"ATP holds chemical energy." }],
          hints:["More work means more conversions.", "Each conversion loses some energy as heat.", "Faster respiration and muscle work release more energy as heat."] }
      ],
      refreshers:{
        "ΔG and ATP":"Negative ΔG: energy released. ATP hydrolysis ≈ −30.5 kJ/mol; making ATP ≈ +30.5 kJ/mol.",
        "ATP yield":"Theoretical 38 (prokaryote) or 36 (eukaryote); current estimate ≈ 30–32; fermentation 2.",
        "Energy forms":"Cells convert chemical energy into mechanical, electrical and chemical work, and always some heat."
      }
    }
  },
  explore:{
    heading:"Energy flow m&#101;ter",
    intro:"Choose how glucose is used and watch where its energy goes. Then run the ATP–ADP cycle and use ATP to push an uphill reaction.",
    // centrepiece data (plan: What students control)
    paths:[
      { id:"38", t:"Aerobic, 38 ATP", sub:"prokaryote, theoretical", atp:38 },
      { id:"36", t:"Aerobic, 36 ATP", sub:"eukaryote, theoretical", atp:36 },
      { id:"32", t:"Aerobic, 32 ATP", sub:"current estimate", atp:32 },
      { id:"30", t:"Aerobic, 30 ATP", sub:"current estimate, glycerol-phosphate shuttle", atp:30 },
      { id:"ferm", t:"Fermentation to lactate", sub:"2 ATP", atp:2, ferm:true }],
    acts:[
      { id:"rest", t:"Rest", demand:50 },
      { id:"walk", t:"Walk", demand:90 },
      { id:"sprint", t:"Sprint", demand:150 }],
    rxCards:[
      { id:"A", t:"join two amino acids", dg:20 },
      { id:"B", t:"make glutamine", dg:14 },
      { id:"C", t:"build a phosphate bond", dg:45 }],
    modelNote:"Course values: ATP → ADP + Pᵢ, ΔG ≈ −30.5 kJ/mol; glucose oxidation, ΔG ≈ −2870 kJ/mol; glucose → 2 lactate releases ≈ 200 kJ/mol (model value). The cycle mode uses whole ATP-units per second; the pool’s size is a model value.",
    predictions:[
      { id:"p1", prompt:"About what fraction of glucose’s energy ends up in ATP?",
        options:[
          { t:"About 40%", ok:true },
          { t:"About 10%" },
          { t:"About 90%" },
          { t:"100%" }],
        explain:"1098 of 2870 kJ (≈ 38%). Respiration is impressively efficient, but well under 100%.",
        start:{ mode:"where", path:"36" }, act:"atp" },
      { id:"p2", prompt:"Where does the rest go?",
        options:[
          { t:"It’s released as heat", ok:true },
          { t:"It’s destroyed" },
          { t:"It’s stored in CO₂" },
          { t:"It becomes matter" }],
        explain:"First law: it isn’t destroyed. Second law: conversions release heat. CO₂ and water are low-energy products.",
        start:{ mode:"where", path:"36" }, act:"heat" },
      { id:"p3", prompt:"Switch to fermentation. Where is most of glucose’s energy now?",
        options:[
          { t:"Still in the lactate", ok:true },
          { t:"Released as heat" },
          { t:"Captured in ATP" },
          { t:"Destroyed" }],
        explain:"Fermentation only goes as far as glycolysis. The lactate can be oxidized later, by the liver or heart.",
        start:{ mode:"where", path:"36" }, act:"ferm" },
      { id:"p4", prompt:"Rest (demand 50), aerobic supply 50. Your body holds only a small amount of ATP. What happens to the pool over a minute?",
        options:[
          { t:"It stays about the same, because ATP is remade as fast as it’s spent", ok:true },
          { t:"It runs out quickly" },
          { t:"It keeps growing as a store" },
          { t:"It’s replaced by glucose" }],
        explain:"ATP is a currency, spent and recharged constantly. Long-term stores are glycogen and fat.",
        start:{ mode:"cycle", act:"rest", aer:50, fer:0 }, act:"run" }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"<strong>Where it goes:</strong> choose the setting that captures <strong>just under 1000 kJ</strong> per mole of glucose.",
        why:"32 ATP × 30.5 = 976 kJ: the closest setting under 1000 kJ.",
        named:{ mode:"Switch to the Where it goes mode first.", over:"That’s over 1000.", under:"Under 1000, but not the closest." },
        hints:["30.5 kJ per ATP: how many ATP make about 1000 kJ?", "1000 ÷ 30.5 is a bit under 33.", "32 ATP: 976 kJ."] },
      { id:"tc2", goal:3, prompt:"<strong>Coupling:</strong> make card C (+45 kJ/mol) run, using the <strong>fewest</strong> ATP.",
        why:"45 − 61 = −16 kJ/mol: two ATP are enough to make the total negative.",
        named:{ mode:"Switch to the Coupling mode first.", card:"Choose card C (+45 kJ/mol).", n0:"+45 kJ/mol with no ATP coupled: still uphill.", n1:"+45 − 30.5 = +14.5: still uphill.", n3:"It runs, but 2 is enough." },
        hints:["Coupled ΔG must be negative.", "Each ATP gives −30.5.", "Two: −61 + 45 = −16."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>ATP–ADP cycle:</strong> Sprint (demand 150). Keep the ATP pool steady while using aerobic respiration as fully as possible.",
        why:"120 + 30 = 150: aerobic respiration at its O₂ limit, and fermentation makes up the gap.",
        named:{ mode:"Switch to the ATP–ADP cycle mode first.", act:"Choose Sprint (demand 150) first.", falls:"The pool falls by {n} per second.",
          steady:"Steady, but aerobic can supply more. Fermentation uses 18 times as much glucose per ATP (36 ÷ 2).", rises:"The pool rises; you’re burning extra glucose." },
        hints:["Supply must equal demand: aerobic + fermentation = 150.", "Use aerobic up to its maximum first.", "120 + 30 = 150."] }
    ]
  },
  part3:{
    slug:"ecosystems", name:"Beyond", heading:"Energy beyond the cell",
    intro:"The two laws that govern a mitochondrion also govern a body and a food chain. Zoom out through three stations, each a short reading of data.",
    st1:{
      title:"Station 1: body heat",
      text:"At rest, an adult releases roughly 100 J every second as heat (about 100 W, <strong>approximate</strong>). Where does it come from?",
      chips:[
        { t:"the ≈ 60% of food energy not captured in ATP, plus the energy of every ATP that’s spent", ok:true, fb:"Second law: every conversion releases heat, and the energy of spent ATP ends up as heat too." },
        { t:"the Sun", fb:"Sunlight can warm your skin, but the steady 100 W comes from your own cells." },
        { t:"friction only", fb:"Friction is a tiny part. Most body heat comes from respiration and ATP use." }],
      link:"Module 35 shows how the body controls this heat."
    },
    st2:{
      title:"Station 2: the trophic pyramid",
      how:"Use “about 10% passes on” to fill in each level, starting above the plants. Type the energy, then press Check.",
      levels:[
        { id:"l0", t:"Plants", kj:20000 },
        { id:"l1", t:"Herbivores", answer:2000 },
        { id:"l2", t:"Carnivores", answer:200 },
        { id:"l3", t:"Top carnivores", answer:20 }],
      wrongMore:"That keeps 90%. Only about 10% passes on: divide by 10.",
      wrongOther:"About 10% passes on: divide the level below by 10.",
      text:"At each level, most energy is used for life’s work and lost as heat, or never eaten. That’s why food chains rarely have more than 4–5 links. The 10% figure is an approximate average; real values vary (roughly 5–20%).",
      question:"Why can’t energy cycle back to the plants?",
      chips:[
        { t:"Heat can’t be used by plants to make food; only sunlight can.", ok:true, fb:"Energy flows through the chain once and leaves as heat." },
        { t:"The top carnivores keep all the energy.", fb:"They lose most of theirs as heat too." },
        { t:"The energy is destroyed at the top of the chain.", fb:M1 }]
    },
    st3:{
      title:"Station 3: engines vs cells",
      rows:[
        { t:"Cell respiration (theoretical)", v:"≈ 38%", lo:38, hi:38 },
        { t:"Cell respiration (current estimate)", v:"≈ 34%", lo:34, hi:34 },
        { t:"Typical car engine", v:"about 25–30% (<strong>approximate</strong>)", lo:25, hi:30 }],
      question:"Both obey the second law. What does that mean for both?",
      chips:[
        { t:"Some energy is always released as heat.", ok:true, fb:"No conversion is 100% efficient, in a cell or in an engine." },
        { t:"Both could reach 100% with a better design.", fb:"The second law rules that out: some energy always leaves as heat." },
        { t:"Both destroy the energy they don’t use.", fb:M1 }]
    },
    quickCheck:{
      title:"Quick check", summary:"Energy beyond the cell quick check",
      items:[
        { id:"q1", goal:5, prompt:`Plants capture 50${NB}000 kJ. Roughly how much reaches the next level (herbivores)?`,
          choices:[{ t:"5000 kJ", ok:true, fb:`About 10% of 50${NB}000 kJ.` },
            { t:"500 kJ", fb:"About 10% passes on." },
            { t:`45${NB}000 kJ`, fb:"About 10% passes on." },
            { t:`50${NB}000 kJ`, fb:"About 10% passes on." }] },
        { id:"q2", goal:5, prompt:"Which cycles in an ecosystem?",
          choices:[{ t:"Matter", ok:true, fb:"Atoms are reused; energy isn’t." },
            { t:"Energy", fb:"Energy flows through and leaves as heat." },
            { t:"Both", fb:"Energy flows through and leaves as heat." },
            { t:"Neither", fb:"Energy flows through and leaves as heat." }] },
        { id:"q3", goal:5, prompt:"Where does most of your body heat come from?",
          choices:[{ t:"Energy not captured by respiration, and energy released when ATP is used", ok:true, fb:"Second law: conversions release heat." },
            { t:"The air", fb:"Second law: conversions release heat." },
            { t:"Your clothes", fb:"Second law: conversions release heat." },
            { t:"Water", fb:"Second law: conversions release heat." }] },
        { id:"q4", goal:5, prompt:"Why are food chains short?",
          choices:[{ t:"Energy is lost at each level", ok:true, fb:"Only about 10% passes each step." },
            { t:"Matter runs out", fb:"Only about 10% passes each step." },
            { t:"Predators are rare by choice", fb:"Only about 10% passes each step." },
            { t:"Plants stop growing", fb:"Only about 10% passes each step." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"law", type:"sorter", title:"Which law?", summary:"Which law?", goal:1, noun:"statement", txt:true,
        instruction:"Sort each statement by the law it shows. A false statement goes in Neither.",
        boxes:[
          { id:"b1", label:"First law", sub:"energy is conserved" },
          { id:"b2", label:"Second law", sub:"some energy becomes heat; disorder increases" },
          { id:"b3", label:"Neither", sub:"a false statement" }],
        items:[
          { id:"i1", t:"The energy in glucose ends up as ATP energy plus heat, with the same total.", answer:"b1", why:"The total stays the same: energy is conserved." },
          { id:"i2", t:"No energy conversion in a cell is 100% efficient.", answer:"b2", why:"Every conversion releases some energy as heat." },
          { id:"i3", t:"A cell creates energy when it makes ATP.", answer:"b3", why:"False: ATP’s energy comes from glucose.", wrong:{ b1:"The cell converts energy; it doesn’t create it." } },
          { id:"i4", t:"A hawk gets far less energy from a field than the plants captured.", answer:"b2", why:"Each level loses most of its energy as heat.",
            hints:["Is energy disappearing, or being lost as heat?", "Each level releases heat.", "Second law."] },
          { id:"i5", t:"Light energy becomes chemical energy in photosynthesis, with none appearing from nothing.", answer:"b1", why:"Energy changes form; none is created." },
          { id:"i6", t:"Energy is used up when muscles contract.", answer:"b3", why:"False: the energy becomes motion and heat.", wrong:{ b1:"‘Used up’ breaks the first law; the energy changes form." } },
          { id:"i7", t:"Your body releases heat even when you’re sitting still.", answer:"b2", why:"Every conversion, even at rest, releases heat." },
          { id:"i8", t:"The heat a mitochondrion releases can be used to make more glucose.", answer:"b3", why:"False: cells can’t turn heat back into food energy.", wrong:{ b2:"Heat can’t power photosynthesis or respiration." } }],
        wrongDefault:"Ask: is the total conserved, is some energy lost as heat, or is the statement false?" },
      { id:"arith", type:"custom", title:"Energy arithmetic", summary:"Energy arithmetic", star:true, goal:[2, 3, 4],
        instruction:"Six calculations. Items 3–6 are non-routine (★); the last two go beyond the Final Check.",
        use:"30.5 kJ/mol per ATP; 2870 kJ/mol per glucose.",
        items:[
          { id:"e1", kind:"num", goal:2, prompt:"Energy captured in 38 ATP?", answer:1159, unit:"kJ", display:"1159 kJ",
            why:"38 × 30.5 = 1159 kJ.", wrong:[{ match:1140, fb:"38 × 30 = 1140; add 38 × 0.5 = 19." }],
            general:"Multiply the number of ATP by 30.5 kJ." },
          { id:"e2", kind:"num", goal:2, prompt:"Heat released when 38 ATP are made from one glucose?", answer:1711, unit:"kJ", display:"1711 kJ",
            why:"2870 − 1159 = 1711 kJ.", wrong:[{ match:1159, fb:"That’s the captured part." }],
            general:"Heat is what isn’t captured: 2870 kJ minus the energy in the ATP." },
          { id:"e3", kind:"dg", goal:3, star:true, prompt:"Coupled ΔG: a reaction of +12 kJ/mol driven by one ATP?", answer:-18.5, unit:"kJ/mol", display:"−18.5 kJ/mol",
            why:"+12 + (−30.5) = −18.5 kJ/mol: negative, so it runs.", wrong:[{ match:42.5, fb:"ATP adds −30.5." }, { match:18.5, fb:"A sign slip: +12 − 30.5 = −18.5." }],
            general:"Add the reaction’s ΔG and ATP’s −30.5." },
          { id:"e4", kind:"num", goal:4, star:true, prompt:"(Investigation) A student compares two yeast cultures. One ferments and one respires aerobically, each using 1 mole of glucose. How many times more ATP does the aerobic culture make (use 36)?", answer:18, unit:"times", display:"18 times",
            why:"36 ÷ 2 = 18.", wrong:[{ match:34, fb:"That’s the difference, not the ratio: 36 ÷ 2." }],
            general:"Compare by dividing: aerobic ATP ÷ fermentation ATP." },
          { id:"e5", kind:"num", goal:4, star:true, prompt:"Fermentation releases ≈ 200 kJ per mole of glucose and captures 2 ATP. What percent of the <strong>released</strong> energy is captured?", answer:30.5, unit:"%", display:"30.5%",
            why:"61 ÷ 200 = 0.305: 30.5%.", wrong:[{ match:2, fb:"That’s percent of glucose’s total. Here, divide by 200." }, { match:2.1, fb:"That’s percent of glucose’s total. Here, divide by 200." }],
            general:"Captured ÷ released × 100.",
            hints:["Captured = 2 × 30.5.", "61 of 200.", "61 ÷ 200 = 0.305: 30.5%."] },
          { id:"e6", kind:"ratio", goal:4, star:true, prompt:"A sprinter needs 150 ATP-units per second; aerobic respiration supplies at most 120. How many moles of glucose per second must fermentation use, compared with aerobic respiration (36 ATP each), to supply the gap? Give the ratio fermentation glucose : aerobic glucose.",
            answer:4.5, tol:0.06, label:"Fermentation : aerobic", display:"15 : 3⅓ (that is, 4.5 : 1)",
            why:"30 ÷ 2 = 15 for fermentation; 120 ÷ 36 = 3⅓ for aerobic.", wrong:[{ match:0.2222, fb:"That’s aerobic : fermentation. Put fermentation first." }],
            general:"30 ÷ 2 = 15 for fermentation; 120 ÷ 36 = 3⅓ for aerobic.",
            hints:["The gap is 150 − 120 = 30 ATP-units.", "Fermentation: 2 per glucose; aerobic: 36 per glucose.", "15 vs 3⅓, so 4.5 times as much glucose for one-fifth of the ATP."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Jaya", how:"",
        instruction:"Jaya made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"s1", goal:1, task:"Explain where glucose’s energy goes in aerobic respiration (36 ATP).",
            steps:["One mole of glucose releases about 2870 kJ when fully oxidized.", "36 ATP capture 36 × 30.5 = 1098 kJ.", "The other 1772 kJ is destroyed during the reactions.", "So respiration is about 38% efficient."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is true, but look at step 3’s reason."],
            fixes:[
              { t:"The other 1772 kJ is released as heat. Energy is never destroyed (first law), but each conversion releases heat (second law).", ok:true, why:M1 },
              { t:"The other 1772 kJ is stored in CO₂.", why:"CO₂ is a low-energy product." },
              { t:"The other 1772 kJ goes into making more glucose.", why:"That’s not where it goes." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Can energy be destroyed?", "No: first law.", "Heat."] },
          { id:"s2", goal:4, task:"Compare fermentation with aerobic respiration.",
            steps:["Fermentation makes 2 ATP per glucose; aerobic respiration makes about 36.", "Both start with glycolysis.", "In fermentation, the rest of glucose’s energy is released as heat, so fermenting cells get very hot.", "So fermentation wastes the energy forever."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows from step 3."],
            fixes:[
              { t:"Most of glucose’s energy is still in the lactate or ethanol. Only about 200 kJ per mole is released, and lactate can be oxidized later.", ok:true, why:M4 },
              { t:"Fermentation captures all the energy in ATP.", why:"Only 61 kJ." },
              { t:"Fermentation makes 36 ATP too.", why:"Only 2." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Where does fermentation stop?", "After glycolysis, with lactate or ethanol.", "The energy stays in those products."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the energy flow m&#101;ter: how much becomes heat, or how much fermentation leaves behind?" },
      { id:"j2", q:"In your own words, explain the first and second laws of thermodynamics using a cell as your example." },
      { id:"j3", q:"Explain to a friend why ATP is called an energy currency rather than an energy store." },
      { id:"j4", q:"Which energy calculation is still tricky for you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which statement is the first law of thermodynamics?", options:[
          { t:"Energy can’t be created or destroyed, only converted from one form to another", ok:true, why:"That’s the first law: the total is conserved." },
          { t:"Every energy conversion releases some energy as heat", why:"That’s the second law." },
          { t:"Energy is used up by living things", why:M1 },
          { t:"Energy cycles through ecosystems", why:M7 }] },
        b:{ prompt:"Which statement is the second law of thermodynamics, as it applies to cells?", options:[
          { t:"Every energy conversion releases some energy as heat, so none is 100% efficient", ok:true, why:"That’s the second law." },
          { t:"Energy can’t be created or destroyed", why:"That’s the first law." },
          { t:"Cells can create energy from ATP", why:M1 },
          { t:"Heat can power photosynthesis", why:M7 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What is ΔG for ATP → ADP + Pᵢ (use the course value)?", options:[
          { t:"≈ −30.5 kJ/mol", ok:true, why:"Hydrolysis releases energy, so ΔG is negative." },
          { t:"≈ +30.5 kJ/mol", why:"That’s making ATP." },
          { t:"≈ −2870 kJ/mol", why:"That’s glucose oxidation." },
          { t:"≈ −305 kJ/mol", why:"A decimal slip." }] },
        b:{ prompt:"What is ΔG for the complete oxidation of glucose (use the course value)?", options:[
          { t:"≈ −2870 kJ/mol", ok:true, why:"Oxidizing a mole of glucose releases about 2870 kJ." },
          { t:"≈ +2870 kJ/mol", why:"That’s photosynthesis’s direction." },
          { t:"≈ −30.5 kJ/mol", why:"That’s ATP hydrolysis." },
          { t:"≈ −1098 kJ/mol", why:"That’s the part captured in 36 ATP." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"In the ATP–ADP cycle, what recharges ADP + Pᵢ into ATP?", options:[
          { t:"Energy released by catabolism, such as cellular respiration", ok:true, why:"Catabolism recharges ADP + Pᵢ; cell work spends ATP." },
          { t:"Heat from the surroundings", why:M7 },
          { t:"Energy from ATP itself", why:"ATP is what’s being made." },
          { t:"Nothing: ATP is made once and stored", why:M5 }] },
        b:{ prompt:"Which best describes ATP’s role in a cell?", options:[
          { t:"A short-term energy currency, spent and remade constantly", ok:true, why:"ATP turns over in the ATP–ADP cycle." },
          { t:"A long-term energy store", why:"Glycogen and fat are the stores." },
          { t:"A source of new energy", why:M1 },
          { t:"A heat store", why:"ATP holds chemical energy." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"36 ATP capture 1098 kJ from a mole of glucose (2870 kJ). Which is closest to the efficiency?", options:[
          { t:"38%", ok:true, why:"1098 is a bit more than a third of 2870." },
          { t:"62%", why:"That’s the fraction released as heat." },
          { t:"3.8%", why:"A decimal slip." },
          { t:"100%", why:M2 }] },
        b:{ prompt:"32 ATP capture 976 kJ from a mole of glucose (2870 kJ). Which is closest to the efficiency?", options:[
          { t:"34%", ok:true, why:"976 is about a third of 2870." },
          { t:"66%", why:M6 },
          { t:"3.4%", why:"A decimal slip." },
          { t:"100%", why:M2 }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A reaction has ΔG = +20 kJ/mol. It’s coupled to one ATP hydrolysis. What is the overall ΔG, and does it run?", options:[
          { t:"−10.5 kJ/mol; it runs", ok:true, why:"+20 + (−30.5) = −10.5: negative, so it runs." },
          { t:"+50.5 kJ/mol; it doesn’t run", why:"ATP adds −30.5, not +30.5." },
          { t:"+10.5 kJ/mol; it doesn’t run", why:"A sign slip: 20 − 30.5 = −10.5." },
          { t:"−50.5 kJ/mol; it runs", why:"+20 is uphill: add it, don’t subtract." }] },
        b:{ prompt:"A reaction has ΔG = +12 kJ/mol. It’s coupled to one ATP hydrolysis. What is the overall ΔG, and does it run?", options:[
          { t:"−18.5 kJ/mol; it runs", ok:true, why:"+12 + (−30.5) = −18.5: negative, so it runs." },
          { t:"+42.5 kJ/mol; it doesn’t run", why:M3 },
          { t:"+18.5 kJ/mol; it doesn’t run", why:"A sign slip." },
          { t:"−42.5 kJ/mol; it runs", why:"Add +12 to −30.5." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Yeast ferment sugar into ethanol and CO₂, making 2 ATP per glucose. Why can ethanol still be burned as a fuel for cars?", options:[
          { t:"Fermentation releases only a small part of glucose’s energy, so most of it is still in the ethanol", ok:true, why:M4 },
          { t:"The yeast add energy to the ethanol", why:M1 },
          { t:"The energy came from the CO₂", why:"CO₂ is a low-energy product." },
          { t:"Ethanol isn’t really a fuel", why:"It’s burned in many vehicles." }] },
        b:{ prompt:"During a sprint, muscles make lactate. Later, the liver takes up the lactate and turns it back into glucose (or the heart oxidizes it). Why is this worthwhile?", options:[
          { t:"Lactate still holds most of the original glucose’s energy", ok:true, why:M4 },
          { t:"Lactate is pure waste with no energy", why:M4 },
          { t:"Lactate releases heat to keep the liver warm", why:M4 },
          { t:"The liver can create energy from lactate", why:M1 }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why a cell can’t capture 100% of glucose’s energy in ATP?", options:[
          { t:"“Each energy conversion releases some energy as heat (second law), so the energy captured in ATP is always less than the energy released.”", ok:true, why:"It names the law and says where the rest goes." },
          { t:"“Some energy is destroyed in each reaction.”", why:M1 },
          { t:"“Cells don’t need that much ATP.”", why:"Demand doesn’t change efficiency." },
          { t:"“The rest is stored in CO₂.”", why:"CO₂ is a low-energy product." }] },
        b:{ prompt:"Which is the best explanation of why ATP, not glucose, powers most cell work directly?", options:[
          { t:"“ATP releases energy in small packets (≈ 30.5 kJ/mol) that match the size of individual cell reactions, and it’s quickly remade.”", ok:true, why:"It gives the packet size and the quick turnover." },
          { t:"“ATP holds more energy than glucose.”", why:"A mole of glucose holds far more." },
          { t:"“Glucose can’t be broken down.”", why:"It’s broken down to make ATP." },
          { t:"“ATP is a long-term store.”", why:M5 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which energy flow summary is correct for 36 ATP per glucose?", options:[
          { t:"Glucose 2870 kJ → ATP 1098 kJ + heat 1772 kJ", ok:true, why:"36 × 30.5 = 1098; 2870 − 1098 = 1772." },
          { t:"Glucose 2870 kJ → ATP 1772 kJ + heat 1098 kJ", why:"Swapped." },
          { t:"Glucose 2870 kJ → ATP 2870 kJ", why:M2 },
          { t:"Glucose 2870 kJ → ATP 1098 kJ + heat 1098 kJ", why:"The parts must add to 2870." }] },
        b:{ prompt:"Which energy flow summary is correct for 38 ATP per glucose?", options:[
          { t:"Glucose 2870 kJ → ATP 1159 kJ + heat 1711 kJ", ok:true, why:"38 × 30.5 = 1159; 2870 − 1159 = 1711." },
          { t:"Glucose 2870 kJ → ATP 1711 kJ + heat 1159 kJ", why:M6 },
          { t:"Glucose 2870 kJ → ATP 2870 kJ", why:M2 },
          { t:"Glucose 2870 kJ → ATP 1159 kJ + heat 1159 kJ", why:"The parts must add to 2870." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:`Plants in a meadow capture 50${NB}000 kJ. Using about 10% per step, roughly how much reaches hawks in the chain plants → mice → snakes → hawks?`, options:[
          { t:"50 kJ", ok:true, why:"5000 → 500 → 50." },
          { t:"500 kJ", why:"That’s the snakes’ level." },
          { t:"5000 kJ", why:"That’s the mice’s level." },
          { t:`45${NB}000 kJ`, why:"That subtracts 10% once instead of keeping 10% each step." }] },
        b:{ prompt:`A pond’s algae capture 80${NB}000 kJ. Using about 10% per step, roughly how much reaches herons in the chain algae → insect larvae → small fish → herons?`, options:[
          { t:"80 kJ", ok:true, why:"8000 → 800 → 80." },
          { t:"800 kJ", why:"That’s the small fish." },
          { t:"8000 kJ", why:"That’s the larvae." },
          { t:`72${NB}000 kJ`, why:M7 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Why does shivering warm you up?", options:[
          { t:"Muscle contractions use ATP rapidly, so respiration speeds up, and most of the energy released becomes heat", ok:true, why:"More conversions, more heat: the second law at work." },
          { t:"Shivering creates new energy", why:M1 },
          { t:"Shivering stores ATP for later", why:M5 },
          { t:"Shivering reduces heat loss through the skin", why:"That’s narrowing blood vessels; shivering makes heat." }] },
        b:{ prompt:"A cyclist’s body temperature rises during a long climb. What’s the best explanation?", options:[
          { t:"ATP use and respiration both speed up; each conversion releases heat", ok:true, why:"More conversions, more heat: the second law at work." },
          { t:"Energy is being destroyed faster", why:M1 },
          { t:"ATP is a heat store", why:M5 },
          { t:"The sun is the only source of the extra heat", why:"Metabolic heat is the main source here." }] } }
    ]
  },
  task:{
    title:"Fuel a sprint", summary:"Fuel a sprint",
    statement:"<p>A sprinter’s muscle fibres need energy fast. Choose how many moles of glucose to use aerobically (36 ATP each, 6 O₂ each) and by fermentation (2 ATP each) so that every condition is met. Can you find all the answers?</p><ol class=\"et-conds\"><li>At least 80 ATP are made.</li><li>No more than 6 moles of glucose are used in total.</li><li>No more than 18 moles of O₂ are used (the blood can’t deliver more).</li><li>At least 1 mole of glucose is fermented (the burst outruns the O₂ supply).</li></ol>",
    inputs:{ a:"Aerobic glucose, <em>a</em> (moles)", f:"Fermented glucose, <em>f</em> (moles)" },
    checks:["At least 80 ATP", "At most 6 glucose", "At most 18 O₂", "Some fermentation"],
    tips:["Aerobic glucose gives far more ATP. How many can the O₂ supply allow?", "18 O₂ ÷ 6 = 3 aerobic at most. With 2 aerobic you need 8 more ATP from fermentation.", "The glucose limit caps fermentation once you’ve chosen <em>a</em>."],
    tip4:"At least 1 mole of glucose must be fermented: the burst outruns the O₂ supply.",
    previewNote:"Per mole of glucose: aerobic 36 ATP, 6 O₂, ≈ 1772 kJ heat; fermented 2 ATP, ≈ 139 kJ heat, ≈ 2670 kJ left in 2 lactate.",
    explainPrompt:"Explain how the O₂ limit and the ATP target together shaped your choice, and where the unused energy from the fermented glucose ends up.",
    vocab:"Use the words aerobic, fermentation, ATP yield and lactate.",
    afterAt:4,
    after3:"Each fermented glucose adds only 2 ATP and leaves most of its energy in lactate. That’s why the body prefers aerobic respiration when O₂ allows."
  },
  cards:[
    ["First law of thermodynamics", "Energy is converted, never created or destroyed."],
    ["Second law of thermodynamics", "Every conversion releases some energy as heat; none is 100% efficient."],
    ["Glucose oxidation", "ΔG ≈ −2870 kJ/mol."],
    ["ATP hydrolysis", "ΔG ≈ −30.5 kJ/mol; making ATP needs ≈ +30.5."],
    ["Efficiency (36 ATP)", "1098 ÷ 2870 ≈ 38%; the rest (1772 kJ) is heat."],
    ["ATP–ADP cycle", "ATP is spent for work and remade from ADP + Pᵢ by catabolism, constantly."],
    ["Coupling", "Uphill ΔG + ATP’s −30.5 must total less than 0 for the reaction to run."],
    ["Fermentation’s energy", "Only 2 ATP; most of the energy stays in lactate or ethanol."],
    ["Body heat", "Energy not captured in ATP, plus energy released when ATP is used."],
    ["10% rule", "About 10% of energy passes to the next trophic level; the rest is lost as heat."]
  ]
};
