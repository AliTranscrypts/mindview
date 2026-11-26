// SCH4U 07 Addition Polymers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/07-addition-polymers.md
// The chain pictures (hero zipper, Polymer zipper, Pack mode, the stations and the task preview) are drawn by app.js.
// Module data (rounded monomer masses, densities, melting points) lives in app.js (course table additions, plan §6).

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "Addition polymers lose nothing: every atom of every monomer ends up in the chain.";
const M2 = "Only the two C=C carbons join the backbone. The CH₃ hangs off as a side group.";
const M3 = "The C=C opens to make the new links, so the backbone is all single bonds.";
const M4 = "No C=C, no addition polymer. Chloroethane has nothing to open.";
const NOCC = "No C=C, no addition polymer.";
const M5 = "Branches keep chains apart, so branched polyethene is less dense and softer.";
const M6 = "A chain of C–C single bonds isn’t broken by water or most microbes; buried bags last for decades or longer.";
const OPEN = "Open the C=C; everything else hangs off the two backbone carbons.";

// Monomer ↔ polymer (plan Activity 1): [monomer, repeating unit, why]
const PAIRS = [
  ["ethene, CH₂=CH₂", "–CH₂–CH₂–", "Open the C=C: each backbone carbon keeps its two H."],
  ["propene, CH₂=CHCH₃", "–CH₂–CH(CH₃)–", "The CH₃ hangs off the second backbone carbon."],
  ["chloroethene, CH₂=CHCl", "–CH₂–CHCl–", "The Cl hangs off the second backbone carbon."],
  ["phenylethene, CH₂=CHC₆H₅", "–CH₂–CH(C₆H₅)–", "The benzene ring hangs off the second backbone carbon."],
  ["tetrafluoroethene, CF₂=CF₂", "–CF₂–CF₂–", "Each backbone carbon keeps its two F."],
  ["but-2-ene, CH₃CH=CHCH₃", "–CH(CH₃)–CH(CH₃)–", "The double bond is in the middle, so each backbone carbon carries a CH₃."],
  ["1,1-dichloroethene, CH₂=CCl₂", "–CH₂–CCl₂–", "Both Cl stay on the same backbone carbon."],
  ["methyl 2-methylpropenoate, CH₂=C(CH₃)COOCH₃", "–CH₂–C(CH₃)(COOCH₃)– (acrylic sheet)", "Both groups hang from the second backbone carbon."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });

export default {
  id:"07-addition-polymers",
  kind:"topic",
  title:"Addition polymers",
  topic:"Addition Polymers",
  readyTopic:"addition polymers",
  hero:{
    eq:'<span class="ap-eq"><span class="nw"><i>n</i> CH₂=CH₂</span> <span class="nw">→ –[CH₂–CH₂]–<sub><i>n</i></sub></span></span>', eqSize:"sm",
    eqLabel:"n C H 2 double bond C H 2 gives a chain: C H 2, C H 2 in brackets, repeated n times",
    headline:"Open the double bond, join the chain",
    text:"A <strong>monomer</strong> with a C=C can open its double bond and link to the next monomer, and the next, thousands of times. The result is an <strong>addition polymer</strong>: shopping bags, pipes, foam cups, non-stick coatings. Nothing is lost along the way, which is also why these chains are so hard to break down.",
    fig:{ html:'<div class="ap-hx"><svg class="ap-hx-svg" id="ap-hx-svg" role="img" aria-label="Five ethene molecules float in a row. An initiator touches the first one: its C=C opens, and the freed electron pair reaches toward the next ethene. The zip runs down the row, each C=C opening and a new C–C bond forming. The finished chain has brackets around one –CH₂–CH₂– unit and the subscript n. Monomers in: 5. Atoms lost: 0."></svg><div class="ap-hx-row"><p class="ap-hx-cap" id="ap-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ap-hx-replay" hidden>Replay</button></div><p class="ap-hx-ctr" id="ap-hx-ctr" aria-live="polite"></p></div>' }
  },
  goals:[
    "I can identify monomers that can undergo addition polymerization (they have a C=C).",
    "I can draw the repeating unit of an addition polymer from its monomer, and find the monomer from a polymer section.",
    "I can explain that addition polymerization loses no atoms, and use this to relate monomer and polymer masses.",
    "I can explain how branching and side groups affect a polymer’s density, stiffness and melting point.",
    "I can evaluate the environmental impact of addition polymers and propose a personal course of action."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Alkene structure", goal:1,
          prompt:"Which molecule contains a carbon–carbon double bond?",
          options:[
            { t:"CH₂=CHCH₃", ok:true, why:"Propene: the = shows the double bond." },
            { t:"CH₃CH₂CH₃", why:"Propane has only single bonds." },
            { t:"CH₃CH₂Cl", why:"Chloroethane: all single bonds." },
            { t:"CH₃CH₂OH", why:"Ethanol: C–O single bond, no C=C." }],
          hints:["Look for ‘=’.", "Between two carbons.", "Propene."] },
        { id:"w2", skill:"Alkene structure", goal:2,
          prompt:"What is the name of CH₂=CHCl?",
          options:[
            { t:"Chloroethene", ok:true, why:"Two-carbon alkene with Cl." },
            { t:"Chloroethane", why:"-ane means single bonds." },
            { t:"Chloropropene", why:"Two carbons." },
            { t:"Dichloroethene", why:"Only one Cl." }],
          hints:["How many carbons?", "Two, with a double bond: ethene.", "Chloroethene."] },
        { id:"w3", skill:"Addition reactions", goal:3,
          prompt:"Ethene adds hydrogen: CH₂=CH₂ + H₂ → ?",
          options:[
            { t:"CH₃CH₃", ok:true, why:"Both atoms add across the double bond." },
            { t:"CH₃CH₃ + H₂O", why:"Addition makes only one product: nothing is released." },
            { t:"CH₂=CH₂ (no reaction)", why:"Alkenes react readily by addition." },
            { t:"CH₄ + CH₄", why:"The C–C bond stays." }],
          hints:["What happens to the double bond in an addition?", "It opens; each carbon gains an atom.", "Ethane."] },
        { id:"w4", skill:"Addition reactions", goal:3,
          prompt:"In an addition reaction, what happens to the number of atoms?",
          options:[
            { t:"All atoms of both reactants end up in one product", ok:true, why:"In an addition, the C=C opens and atoms add to each carbon; nothing is released." },
            { t:"A water molecule is lost", why:"That’s condensation. Addition makes only one product: nothing is released." },
            { t:"Some carbon is lost as CO₂", why:"That’s combustion." },
            { t:"Atoms are destroyed", why:"Atoms are conserved." }],
          hints:["Compare with condensation.", "Addition makes only one product.", "All atoms end up in the product."] },
        { id:"w5", skill:"Molar mass", goal:3,
          prompt:"Use C = 12 and H = 1. What is the molar mass of ethene, C₂H₄?",
          options:[
            { t:"28 g/mol", ok:true, why:"2(12) + 4(1)." },
            { t:"26 g/mol", why:"That’s C₂H₂." },
            { t:"30 g/mol", why:"That’s C₂H₆." },
            { t:"16 g/mol", why:"That’s CH₄." }],
          hints:["Multiply each atom by its count.", "24 + 4.", "28 g/mol."] },
        { id:"w6", skill:"Molar mass", goal:3,
          prompt:"A chain has molar mass 2800 g/mol and is made of units of 28 g/mol. How many units?",
          options:[
            { t:"100", ok:true, why:"2800 ÷ 28." },
            { t:"1000", why:"Decimal slip: 28 × 1000 = 28 000." },
            { t:"10", why:"28 × 10 = 280." },
            { t:"2828", why:"Divide total by unit mass." }],
          hints:["Total ÷ one unit.", "2800 ÷ 28.", "100."] }
      ],
      refreshers:{
        "Alkene structure":"Alkenes contain C=C; their names end in -ene. Halo prefixes don’t count as carbons.",
        "Addition reactions":"In an addition, the C=C opens and atoms add to each carbon; nothing is released.",
        "Molar mass":"Add atomic masses; to count units in a chain, divide the chain’s mass by one unit’s mass."
      }
    }
  },
  explore:{
    heading:"Polymer zipper",
    intro:"Pick a monomer and zip it into a chain. Bracket the repeating unit and watch what changes, and what doesn’t.",
    how:"Choose a mode and a monomer, set the chain length, then press <strong>Zip it</strong> (or use Play, Step and Back). Drag the two bracket marks <strong>[ ]</strong> along the finished chain, or tap one and use the arrow keys, to enclose one repeating unit.",
    uses:"C₂H₄ 28, C₃H₆ 42, C₂H₃Cl 62.5, C₈H₈ 104 g/mol",
    modes:[{ id:"build", t:"Build" }, { id:"co", t:"Copolymer" }, { id:"pack", t:"Pack" }],
    predictions:[
      { id:"p1", prompt:"Ethene, 6 units. When 6 ethene molecules zip together, what else is produced?",
        options:[{ t:"nothing", ok:true }, { t:"6 water molecules" }, { t:"5 water molecules" }, { t:"6 hydrogen molecules" }],
        explain:"Addition polymerization has no by-product." },
      { id:"p2", prompt:"Propene. Which is the repeating unit of poly(propene)?",
        options:[{ t:"–CH₂–CH(CH₃)–", ok:true }, { t:"–CH₂–CH₂–CH₂–" }, { t:"–CH=CH(CH₃)–" }, { t:"–CH₂–CH₂–" }],
        explain:"Only the two C=C carbons join the backbone." },
      { id:"p3", prompt:"Pack mode: polyethene chains, linear vs branched. Which packs more tightly?",
        options:[{ t:"linear", ok:true }, { t:"branched" }, { t:"both the same" }, { t:"it depends on the chain length only" }],
        explain:"Branches act like elbows, keeping chains apart." },
      { id:"p4", prompt:"Chloroethene, 100 units. What is the chain’s molar mass? (Use C₂H₃Cl = 62.5 g/mol.)",
        options:[{ t:"6250 g/mol", ok:true }, { t:"6232 g/mol" }, { t:"625 g/mol" }, { t:"62.5 g/mol" }],
        explain:"No atoms are lost, so just multiply." }
    ],
    chalIntro:"Use the zipper to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Make a polymer whose repeating unit contains chlorine, and bracket one repeating unit.",
        why:"Chloroethene, CH₂=CHCl, makes poly(chloroethene) (PVC). One repeating unit is two backbone carbons: –CH₂–CHCl–.",
        hints:["Which monomer has Cl?", "Chloroethene, CH₂=CHCl.", "Bracket –CH₂–CHCl–."] },
      { id:"tc2", goal:[2, 3], prompt:"Build a 6-unit chain whose molar mass is 252 g/mol, and bracket one repeating unit.",
        why:"6 × 42 = 252 g/mol: six propene units. The bracket holds –CH₂–CH(CH₃)–, with the CH₃ as a side group.",
        hints:["252 ÷ 6 = ?", "42 g/mol: propene.", "Six propene units; bracket CH₂–CH(CH₃)."] },
      { id:"tc3", goal:[1, 2], stretch:true, prompt:"Copolymer mode: a section reads –CH₂–CHCl–CH₂–CH₂–CH₂–CHCl–CH₂–CH₂–. Rebuild it and choose its monomer(s).",
        why:"Cut the backbone every two carbons: CH₂–CHCl, CH₂–CH₂, CH₂–CHCl, CH₂–CH₂. Put the double bond back in each piece: chloroethene and ethene.",
        hints:["Cut the backbone every two carbons.", "Pieces: CH₂–CHCl, CH₂–CH₂, CH₂–CHCl, CH₂–CH₂.", "Put the double bond back in each: chloroethene and ethene."] }
    ]
  },
  part3:{
    slug:"plastics", name:"Plastics", heading:"Plastics and the planet",
    intro:"Three stations tie the chain’s structure to what happens to plastics after you use them: the recycling codes, why an all-C–C backbone lasts, and a plan of your own built from evidence.",
    s1:{ title:"Station 1: Read the code",
      intro:"Each plastic item carries a resin code, 1 to 7, inside a triangle of arrows. Sort the seven codes by the kind of polymer they name.",
      items:[
        { id:"c1", code:1, ab:"PET", thing:"water bottle", answer:"cond", poly:"a polyester", why:"PET forms with water released at each ester link (module 08)." },
        { id:"c2", code:2, ab:"HDPE", thing:"milk jug", answer:"add", poly:"high-density polyethene", why:"Polyethene, from ethene (C=C): nothing is released as the chain forms." },
        { id:"c3", code:3, ab:"PVC", thing:"drain pipe", answer:"add", poly:"poly(chloroethene)", why:"Poly(chloroethene), from chloroethene (C=C): nothing is released as the chain forms." },
        { id:"c4", code:4, ab:"LDPE", thing:"shopping bag", answer:"add", poly:"low-density polyethene", why:"Branched polyethene, from ethene (C=C): nothing is released as the chain forms." },
        { id:"c5", code:5, ab:"PP", thing:"yogurt tub", answer:"add", poly:"poly(propene)", why:"Poly(propene), from propene (C=C): nothing is released as the chain forms." },
        { id:"c6", code:6, ab:"PS", thing:"foam cup", answer:"add", poly:"poly(phenylethene)", why:"Poly(phenylethene), from phenylethene (C=C): nothing is released as the chain forms." },
        { id:"c7", code:7, ab:"other", thing:"layered snack pouch", answer:"other", poly:"other or mixed plastics", why:"Code 7 means other or mixed plastics: it doesn’t name one polymer." }
      ],
      bins:[{ id:"add", label:"Addition polymer", sub:"monomer with a C=C; nothing released" }, { id:"cond", label:"Condensation polymer", sub:"a small molecule released at each link" }, { id:"other", label:"Mixed / other", sub:"no single polymer" }],
      wrongAdd:"Its monomer has a C=C, and nothing is released as the chain forms: an addition polymer.",
      data:"Recyclers shred plastics and drop the flakes into water. Flakes less dense than the liquid float; denser flakes sink. Densities are approximate data; real products vary." },
    s2:{ title:"Station 2: Why they last",
      intro:"Zoom to the particles: a polyethene chain and a polyester chain side by side, surrounded by water. Press <strong>Add water</strong> and watch where the water molecules can attack.",
      banner:"No weak link for water to attack." },
    s3:{ title:"Station 3: My plastics plan",
      intro:"Build a claim in three parts: an action, the evidence for it, and the reason it helps. Any action and evidence that logically match are accepted.",
      // VERIFY before release: the federal single-use plastics rules named here.
      canada:"Canada has federal rules restricting some single-use plastics, such as checkout bags and straws.",
      actions:[{ id:"bag", t:"carry a reusable bag" }, { id:"refill", t:"choose refillable containers" }, { id:"sort", t:"sort recycling by code" }, { id:"foam", t:"avoid single-use foam" }],
      evidence:[
        { id:"persist", t:"Persistence: polyethene’s all-C–C backbone has no link water can break, so it lasts for decades or longer." },
        { id:"density", t:"Density sorting: recyclers separate plastics by density (PP and PE float in water; PET and PVC sink), so each code must reach the right stream." },
        // VERIFY before release: 3 million tonnes and 9% recycled (builder-supplied figures).
        { id:"stat", t:"Waste: Canadians throw away about 3 million tonnes of plastic each year, and only about 9% is recycled." }],
      reasons:[{ id:"fewer", t:"fewer items made" }, { id:"sorted", t:"correct sorting" }, { id:"litter", t:"less litter" }] },
    quickCheck:{
      title:"Quick check", summary:"Plastics and the planet quick check",
      items:[
        { id:"q1", goal:1, prompt:"Code 1, PET, is which kind of polymer?",
          choices:[
            { t:"condensation", ok:true, fb:"Right. PET forms with water released at each ester link (module 08)." },
            { t:"addition", fb:"PET forms with water released at each ester link (module 08)." },
            { t:"natural", fb:"PET forms with water released at each ester link (module 08)." },
            { t:"not a polymer", fb:"PET forms with water released at each ester link (module 08)." }] },
        { id:"q2", goal:4, prompt:"Which pair floats in water (1.00 g/mL)?",
          choices:[
            { t:"PP and LDPE", ok:true, fb:"Right. Densities below 1.00 float: PP 0.90 and LDPE 0.92 g/cm³." },
            { t:"PET and PVC", fb:"Densities below 1.00 float." },
            { t:"PS and PVC", fb:"Densities below 1.00 float." },
            { t:"PET and HDPE", fb:"Densities below 1.00 float." }] },
        { id:"q3", goal:5, prompt:"Why does polyethene resist breakdown in landfills?",
          choices:[
            { t:"Its backbone is all C–C bonds, with no links water can attack", ok:true, fb:"Right. There’s no weak link for water to attack." },
            { t:"It contains C=C bonds", fb:"The C=C bonds were used up making the chain." },
            { t:"It dissolves slowly", fb:M6 },
            { t:"It is radioactive", fb:M6 }] },
        { id:"q4", goal:5, prompt:"Which action most directly reduces plastic made?",
          choices:[
            { t:"Reusing a durable bag many times", ok:true, fb:"Right. Every reuse is one less bag made." },
            { t:"Burying bags", fb:"Burning at home releases harmful products; burying doesn’t break them down." },
            { t:"Burning bags at home", fb:"Burning at home releases harmful products; burying doesn’t break them down." },
            { t:"Rinsing bags before trashing them", fb:"Rinsing doesn’t change persistence, and the bag is still made and thrown out." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Monomer ↔ polymer", summary:"Monomer ↔ polymer", goal:[1, 2],
        instruction:"Match each monomer to the repeating unit of its polymer. Two repeating units have no partner.",
        leftTitle:"Monomer", rightTitle:"Repeating unit",
        left:PAIRS.map((p, i) => Object.assign({ id:"l" + (i + 1), t:p[0], why:p[2] },
          i === 7 ? { hints:["Which two carbons are double-bonded?", "CH₂= and =C(CH₃)(COOCH₃).", "Both groups hang from the second backbone carbon."] } : {})),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r9", t:"–CH₂–CH(CH₂CH₃)–" }, { id:"r10", t:"–CH₂–CH₂–CH₂–" }]),
        answer:MATCH_ANS,
        wrong:{ "l6|r9":"In but-2-ene the double bond is in the middle; each backbone carbon carries a CH₃.", "l2|r10":M2 },
        wrongDefault:OPEN },
      { id:"reason", type:"custom", title:"Polymer reasoning", summary:"Polymer reasoning", star:true, goal:[2, 3, 4],
        instruction:"Six items: number entry and choose-one. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number or tap a choice, then press Check.",
        uses:"C₂H₄ 28, C₃H₆ 42, C₂H₃Cl 62.5 g/mol",
        items:[
          { id:"r1", kind:"num", goal:3, prompt:"A polyethene chain has molar mass 56 000 g/mol. How many monomer units?", answer:2000, unit:"units", display:"2000 units",
            wrong:[{ match:200, fb:"56 000 ÷ 28 = 2000." }], fb:"Divide the chain’s mass by one unit’s mass, 28 g/mol." },
          { id:"r2", kind:"chips", goal:1, prompt:"Which can be a monomer: ethanol, propene, propane, ethanoic acid?",
            options:[
              { t:"propene", ok:true, why:"Propene has a C=C to open." },
              { t:"ethanol", why:"No C=C." },
              { t:"propane", why:"No C=C." },
              { t:"ethanoic acid", why:"No C=C (the C=O doesn’t polymerize this way)." }] },
          { id:"r3", kind:"num", star:true, goal:3, prompt:"A chain is made of 300 propene units. What mass of polymer forms from 0.300 mol of propene?", answer:12.6, unit:"g", display:"12.6 g",
            wrong:[{ match:7.2, fb:M1 + " No water forms." }, { match:7.22, fb:M1 + " No water forms." }], fb:"Mass of polymer = mass of monomer used.",
            hints:["Mass of polymer = mass of monomer used.", "0.300 mol × 42 g/mol.", "12.6 g."] },
          { id:"r4", kind:"chips", star:true, goal:4, prompt:"<strong>Investigation:</strong> Two unlabelled plastic chips are dropped into an alcohol–water mix of density 0.94 g/mL. Chip X floats; chip Y sinks. Both are polyethene. Which is HDPE?",
            options:[
              { t:"chip X", why:M5 + " Denser chips sink." },
              { t:"chip Y", ok:true, why:"HDPE (0.96 g/cm³) is denser than the mix, so it sinks; LDPE (0.92) floats." }] },
          { id:"r5", kind:"num", star:true, goal:3, prompt:"Mass percent of chlorine in PVC? (Cl = 35.5, C₂H₃Cl = 62.5)", answer:56.8, unit:"%", display:"56.8%",
            wrong:[{ match:50, fb:"35.5 ÷ 62.5 = 0.568." }], fb:"One Cl per unit: divide its mass by the unit’s mass.",
            hints:["One Cl per unit.", "35.5 ÷ 62.5.", "71/125 = 0.568 → 56.8%."] },
          { id:"r6", kind:"num", star:true, goal:3, prompt:"A copolymer section has 40 ethene units and 20 propene units. Its molar mass?", answer:1960, unit:"g/mol", display:"1960 g/mol",
            wrong:[{ match:2100, fb:"40 × 28 + 20 × 42 = 1120 + 840 = 1960." }], fb:"Add each monomer’s share: units × molar mass for each." }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Celeste", how:"", goal:[1, 2, 3],
        instruction:"Celeste made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Draw three repeating units of poly(propene).",
            steps:["The monomer is CH₂=CHCH₃.", "The C=C opens to link monomers.", "All three carbons join the backbone: –CH₂–CH₂–CH₂–.", "Three units: –CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Only the two C=C carbons join; the CH₃ is a side group: –CH₂–CH(CH₃)–CH₂–CH(CH₃)–CH₂–CH(CH₃)–.", ok:true, why:M2 },
              { t:"Keep the double bond: –CH=CH(CH₃)–.", why:M3 },
              { t:"–CH(CH₃)–CH(CH₃)–.", why:"That’s from but-2-ene." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Which carbons had the double bond?", "Only those two.", "CH₃ hangs off."] },
          { id:"e2", goal:3, task:"Find the molar mass of a chain of 500 ethene units (C₂H₄ = 28 g/mol).",
            steps:["500 monomers join into one chain.", "Each link releases one water molecule.", "Mass = 500 × 28 − 499 × 18 = 5018 g/mol."],
            answer:1,
            stepFb:["Correct.", "", "Follows step 2."],
            fixes:[
              { t:"Addition releases nothing: mass = 500 × 28 = 14 000 g/mol.", ok:true, why:M1 },
              { t:"500 × 18 = 9000.", why:M1 },
              { t:"Mass = 28 g/mol.", why:"That’s one unit." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Is anything lost in addition?", "No.", "14 000 g/mol."] },
          { id:"e3", goal:1, task:"Name the monomer of PVC, –CH₂–CHCl–.",
            steps:["The repeating unit is –CH₂–CHCl–.", "The unit has 2 carbons and 1 Cl.", "So the monomer is CH₃CH₂Cl, chloroethane.", "It joins by opening a bond."],
            answer:2,
            stepFb:["Correct.", "Correct.", "", "Follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Put the double bond back between the two backbone carbons: CH₂=CHCl, chloroethene.", ok:true, why:"Every addition monomer has a C=C to open." },
              { t:"CH₂Cl–CH₂Cl.", why:NOCC + " Only one Cl per unit." },
              { t:"CHCl=CHCl.", why:"Only one Cl per unit." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["What must every addition monomer have?", "A C=C.", "Chloroethene."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: that nothing is lost when a polymer forms, or that branching makes plastic less dense?" },
      { id:"j2", q:"In your own words, explain how to find the monomer of an addition polymer." },
      { id:"j3", q:"Explain to a friend why a plastic bag buried in a backyard is still there years later." },
      { id:"j4", q:"Write one change you’ll make in how you use plastics, and the evidence behind it." }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which molecule can form an addition polymer?", options:[
          { t:"chloroethene, CH₂=CHCl", ok:true, why:"It has a C=C." },
          { t:"chloroethane, CH₃CH₂Cl", why:M4 },
          { t:"ethanol, CH₃CH₂OH", why:"No C=C." },
          { t:"ethanoic acid, CH₃COOH", why:"No C=C (the C=O doesn’t polymerize this way)." }] },
        b:{ prompt:"What must a monomer have to form an addition polymer?", options:[
          { t:"a carbon–carbon double bond", ok:true, why:"The C=C opens to make the new links." },
          { t:"two different functional groups", why:"That’s needed for condensation." },
          { t:"an –OH group", why:"Not required." },
          { t:"a ring of carbons", why:"Not required." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is the repeating unit of poly(propene)?", options:[
          { t:"–CH₂–CH(CH₃)–", ok:true, why:"Only the two C=C carbons join the backbone; the CH₃ hangs off the second one." },
          { t:"–CH₂–CH₂–CH₂–", why:M2 },
          { t:"–CH=CH(CH₃)–", why:M3 },
          { t:"–CH₂–CH₂–", why:"That’s polyethene." }] },
        b:{ prompt:"Which is the repeating unit of poly(phenylethene)?", options:[
          { t:"–CH₂–CH(C₆H₅)–", ok:true, why:"The ring hangs off the second backbone carbon as a side group." },
          { t:"–CH₂–CH₂–C₆H₄–", why:"The ring hangs off; it isn’t in the backbone." },
          { t:"–CH=CH(C₆H₅)–", why:M3 },
          { t:"–C₆H₅–CH₂–", why:"Only C=C carbons form the backbone." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which statement about addition polymerization is true?", options:[
          { t:"All atoms of the monomers end up in the polymer", ok:true, why:"Nothing is released, so the polymer has the same empirical formula as the monomer." },
          { t:"A water molecule is released at each link", why:M1 },
          { t:"The double bonds become triple bonds", why:"They become single bonds." },
          { t:"The backbone keeps its double bonds", why:M3 }] },
        b:{ prompt:"1000 propene molecules (42 g/mol) form one chain. What is its molar mass?", options:[
          { t:"42 000 g/mol", ok:true, why:"1000 × 42 = 42 000 g/mol: no atoms are lost." },
          { t:"24 018 g/mol", why:"That subtracts 999 waters. " + M1 },
          { t:"42 g/mol", why:"That’s one unit." },
          { t:"84 000 g/mol", why:"Each monomer counts once." }] } },
      { id:"t1", cat:"T", goal:[1, 2],
        a:{ prompt:"Which monomer makes –CH₂–C(CH₃)₂–CH₂–C(CH₃)₂–?", options:[
          { t:"2-methylpropene, CH₂=C(CH₃)₂", ok:true, why:"Both methyls sit on one backbone carbon." },
          { t:"propene", why:"Only one CH₃ per unit there." },
          { t:"but-2-ene", why:"That puts one CH₃ on each backbone carbon." },
          { t:"2-methylpropane", why:NOCC + " 2-methylpropane has nothing to open." }] },
        b:{ prompt:"Which monomer makes –CHCl–CHCl–CHCl–CHCl–?", options:[
          { t:"1,2-dichloroethene, CHCl=CHCl", ok:true, why:"One Cl on each backbone carbon: put the C=C back between them." },
          { t:"chloroethene", why:"That gives one Cl per two carbons." },
          { t:"1,1-dichloroethene", why:"That puts both Cl on one carbon." },
          { t:"1,2-dichloroethane", why:NOCC + " 1,2-dichloroethane has nothing to open." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Two polyethene samples: X has density 0.92 g/cm³ and melts at 110 °C; Y has density 0.96 g/cm³ and melts at 135 °C. Which is high-density polyethene, and why?", options:[
          { t:"Y: linear chains pack closely, raising density and melting point", ok:true, why:"Unbranched chains line up closely, so Y is denser and melts higher." },
          { t:"X: lower density means stronger forces", why:"Lower density means looser packing." },
          { t:"Y: it has more branches", why:M5 },
          { t:"Neither: they’re different polymers", why:"Both are polyethene; chain shape differs." }] },
        b:{ prompt:"Two samples of the same polymer: P has density 0.95 g/cm³, Q has density 0.91 g/cm³. Which has more branching, and why?", options:[
          { t:"Q: branches keep chains apart, so it packs less tightly", ok:true, why:"Lower density means looser packing: Q is the more branched sample." },
          { t:"P: more branches add mass", why:M5 },
          { t:"Q: branches add double bonds", why:M3 },
          { t:"Can’t tell without molar mass", why:"Packing explains density here." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A copolymer chain has 500 ethene units and 500 propene units. Use C₂H₄ = 28 and C₃H₆ = 42 g/mol. What is its molar mass?", options:[
          { t:"35 000 g/mol", ok:true, why:"500 × 28 + 500 × 42." },
          { t:"70 000 g/mol", why:"That counts 1000 of each." },
          { t:"35 g/mol", why:"Multiply by the number of units." },
          { t:"17 018 g/mol", why:"No water is lost. " + M1 }] },
        b:{ prompt:"A copolymer chain has 400 ethene units and 400 chloroethene units. Use 28 and 62.5 g/mol. What is its molar mass?", options:[
          { t:"36 200 g/mol", ok:true, why:"400 × 28 + 400 × 62.5 = 11 200 + 25 000." },
          { t:"72 400 g/mol", why:"That counts 800 of each." },
          { t:"25 000 g/mol", why:"That’s only the chloroethene part." },
          { t:"21 818 g/mol", why:"No water is lost. " + M1 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the clearest explanation of why addition polymers persist in the environment?", options:[
          { t:"“Their backbones are all C–C single bonds, with no ester or amide links for water or microbes to break.”", ok:true, why:"It names the structure and why water and microbes can’t break it." },
          { t:"“They still contain double bonds that resist reaction.”", why:M3 },
          { t:"“They’re too dense to break down.”", why:"Density isn’t the reason." },
          { t:"“They break down quickly if buried.”", why:M6 }] },
        b:{ prompt:"Which correctly describes how polyethene forms?", options:[
          { t:"“Each C=C opens; its electrons form new C–C bonds to neighbouring monomers, and no atoms are lost.”", ok:true, why:"It says what opens, what forms and that nothing is lost." },
          { t:"“Water is removed between –OH groups.”", why:M1 },
          { t:"“C–H bonds break so carbons can join.”", why:"The C=C, not C–H, opens." },
          { t:"“Monomers stack, held only by London forces.”", why:"They’re joined by covalent bonds." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which shows a correct three-unit section of poly(chloroethene)?", options:[
          { t:"–CH₂–CHCl–CH₂–CHCl–CH₂–CHCl–", ok:true, why:"Three –CH₂–CHCl– units: one Cl per unit, all single bonds." },
          { t:"–CH₂–CH₂Cl–CH₂–CH₂Cl–", why:"That gives a carbon five bonds." },
          { t:"–CHCl–CHCl–CHCl–CHCl–CHCl–CHCl–", why:"Two Cl per unit." },
          { t:"–CH=CCl–CH=CCl–CH=CCl–", why:M3 }] },
        b:{ prompt:"Which shows a correct three-unit section of poly(propene)?", options:[
          { t:"–CH₂–CH(CH₃)–CH₂–CH(CH₃)–CH₂–CH(CH₃)–", ok:true, why:"A CH₃ on every second backbone carbon, all single bonds." },
          { t:"–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–CH₂–", why:M2 },
          { t:"–CH=C(CH₃)–CH=C(CH₃)–", why:M3 },
          { t:"–CH(CH₃)–CH(CH₃)–CH(CH₃)–", why:"That’s from but-2-ene." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A recycling plant floats shredded plastics in water (1.00 g/mL). Densities: PP 0.90, HDPE 0.96, PS 1.05, PET 1.38, PVC 1.38 g/cm³. Which pair floats together?", options:[
          { t:"PP and HDPE", ok:true, why:"Both below 1.00." },
          { t:"PET and PVC", why:"Both sink." },
          { t:"PS and PVC", why:"Both sink." },
          { t:"PET and HDPE", why:"PET sinks." }] },
        b:{ prompt:"The same plastics are placed in a salt solution of density 1.20 g/mL. Which sinks?", options:[
          { t:"PVC and PET only", ok:true, why:"Only 1.38 is above 1.20." },
          { t:"PS only", why:"1.05 < 1.20: PS floats here." },
          { t:"HDPE and PP", why:"They float in both liquids." },
          { t:"All of them", why:"Only the denser ones sink." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A town wants fewer plastic bags in its landfill. Which plan is best supported by the chemistry?", options:[
          { t:"Encourage reusable bags used many times, because polyethene’s C–C backbone won’t break down in a landfill", ok:true, why:"Fewer bags made means fewer bags buried, and buried bags don’t break down." },
          { t:"Bury bags deeper so they biodegrade", why:M6 },
          { t:"Burn bags in backyards", why:"That releases harmful products." },
          { t:"Rinse bags before throwing them out", why:"Rinsing doesn’t change persistence." }] },
        b:{ prompt:"Which statement best explains why sorting plastics by resin code matters?", options:[
          { t:"Different polymers melt and behave differently, so mixing them ruins recycled plastic", ok:true, why:"Each code is a different polymer, so recyclers keep them apart." },
          { t:"All plastics are the same polymer", why:"Codes identify different polymers." },
          { t:"Sorting makes them biodegrade", why:M6 },
          { t:"Codes show how old the plastic is", why:"They identify the polymer." }] } }
    ]
  },
  task:{
    title:"Design a copolymer segment", summary:"Design a copolymer segment",
    statement:"<p>Build a 6-unit segment of a copolymer from ethene (E, 28 g/mol) and propene (P, 42 g/mol) that meets every condition. Can you find all the answers?</p><ol class=\"ap-conds\"><li>The segment has exactly 6 units.</li><li>Its molar mass is 210 g/mol.</li><li>It contains both monomers.</li><li>No two propene units are next to each other.</li></ol>",
    checks:["6 units", "210 g/mol", "Both monomers", "No P next to P"],
    tips:["With 6 units, every P adds 14 g/mol more than an E: 168 + 14 × (number of P).", "210 − 168 = 42, so you need 3 P.", "Three P among six positions with no two touching: try every other position.", "Put an E between each pair of P."],
    explainPrompt:"Explain how you used the molar mass to work out how many propene units you needed, and how you placed them.",
    vocab:"Use the words monomer, repeating unit, copolymer and molar mass.",
    more:"There’s more than one answer. Can you find them all?",
    after4:"Three propenes always; the E’s fill the gaps. The fifth possible spacing would need two P side by side."
  },
  cards:[
    ["Monomer", "A small molecule that joins with others to make a polymer."],
    ["Addition polymer", "A polymer made from monomers with C=C, with no atoms lost."],
    ["Repeating unit", "The two-carbon backbone piece with its side groups, e.g. –CH₂–CH(CH₃)–."],
    ["Finding the monomer", "Take one repeating unit; put the C=C back."],
    ["By-product of addition polymerization", "None."],
    ["Chain molar mass", "Number of units × monomer molar mass."],
    ["LDPE vs HDPE", "Branched (0.92 g/cm³, soft) vs linear (0.96 g/cm³, stiff)."],
    ["PVC", "Poly(chloroethene), –CH₂–CHCl–: pipes, siding."],
    ["Copolymer", "A chain made from two or more different monomers."],
    ["Why plastics persist", "An all-C–C backbone has no links water can break."],
    ["Resin codes", "1 PET · 2 HDPE · 3 PVC · 4 LDPE · 5 PP · 6 PS · 7 other."]
  ]
};
