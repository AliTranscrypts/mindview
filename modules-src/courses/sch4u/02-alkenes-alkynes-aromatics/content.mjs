// SCH4U 02 Alkenes, Alkynes and Aromatics. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/02-alkenes-alkynes-aromatics.md
// Molecule pictures (rings, flasks, the lab) are drawn by app.js; structures in questions are condensed formulas.

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "The multiple bond gets the lowest locant first; substituents come second.";
const M2 = "CₙH₂ₙ fits one C=C <strong>or</strong> one ring. Look at the structure.";
const M3 = "The H goes to the carbon that already has more H atoms; the other atom goes to the more substituted carbon.";
const M4 = "Benzene’s electrons are delocalized. It stays a ring and substitutes, and only with a catalyst.";
const M5 = "In addition, both atoms of the reagent add, one to each carbon of the multiple bond.";
const M7 = "Number from the end nearer the multiple bond: pent-1-ene, not pent-4-ene.";

export default {
  id:"02-alkenes-alkynes-aromatics",
  kind:"topic",
  title:"Alkenes, alkynes and aromatics",
  topic:"Alkenes, Alkynes and Aromatics",
  readyTopic:"alkenes, alkynes and aromatics",
  hero:{
    eq:'<span class="nw">CH₂=CH₂ + Br₂ →</span> <span class="nw">CH₂Br–CH₂Br</span>', eqSize:"sm", eqLabel:"C H 2 double bond C H 2, plus B r 2, gives C H 2 B r, single bond, C H 2 B r",
    headline:"A double bond is a place where atoms can add",
    text:"Alkanes are saturated: every carbon already has four single bonds. <strong>Alkenes</strong> and <strong>alkynes</strong> have double or triple bonds, so they’re <strong>unsaturated</strong>: atoms can <strong>add</strong> across the multiple bond. <strong>Aromatic</strong> compounds like benzene look unsaturated on paper but behave very differently.",
    fig:{ html:'<div class="ae-hx"><svg class="ae-hx-svg" id="ae-hx-svg" viewBox="0 0 640 420" role="img" aria-label="Ethene, a flat molecule with 120° angles, meets Br₂. The double bond opens, one Br adds to each carbon, and the molecule becomes 1,2-dibromoethane with 109.5° angles while orange-brown bromine water turns colourless. Then Br₂ bounces off a benzene ring: no catalyst, no reaction."></svg><div class="ae-hx-row"><p class="ae-hx-cap" id="ae-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ae-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can name and draw alkenes and alkynes, giving the multiple bond the lowest locant.",
    "I can name simple aromatic compounds such as methylbenzene and 1,4-dimethylbenzene.",
    "I can predict the products of addition reactions, using Markovnikov’s rule.",
    "I can explain why benzene undergoes substitution rather than addition.",
    "I can tell saturated from unsaturated compounds using formulas and the bromine test.",
    "I can compare the shapes and rotation of single, double and triple bonds."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Naming alkanes", goal:1,
          prompt:"Name CH₃CH(CH₃)CH₂CH₃.",
          options:[
            { t:"2-methylbutane", ok:true, why:"4-carbon chain, methyl on C2." },
            { t:"3-methylbutane", why:"Lowest locant: 2." },
            { t:"2-methylpentane", why:"Count the chain again: 4." },
            { t:"isopentane", why:"That’s a common name; the IUPAC name is 2-methylbutane." }],
          hints:["Longest chain?", "4 carbons, methyl on C2.", "2-methylbutane."] },
        { id:"w2", skill:"Naming alkanes", goal:1,
          prompt:"Which part of a name tells you the number of carbons in the parent chain?",
          options:[
            { t:"The root (meth-, eth-, prop-, but-, pent-…)", ok:true, why:"but- means 4." },
            { t:"The suffix", why:"The suffix tells the family (-ane, -ene)." },
            { t:"The locant", why:"Locants give positions." },
            { t:"The prefix (methyl, chloro)", why:"Prefixes are substituents." }],
          hints:["but-ane, but-ene: what’s shared?", "The root.", "Root = chain length."] },
        { id:"w3", skill:"Formulas", goal:5,
          prompt:"Which formula fits a saturated open-chain hydrocarbon?",
          options:[
            { t:"C₆H₁₄", ok:true, why:"CₙH₂ₙ₊₂." },
            { t:"C₆H₁₂", why:"Two H short: a ring or a double bond." },
            { t:"C₆H₁₀", why:"Four H short." },
            { t:"C₆H₆", why:"Far too few H: that’s benzene." }],
          hints:["Saturated alkanes are CₙH₂ₙ₊₂.", "<i>n</i> = 6 gives 14.", "C₆H₁₄."] },
        { id:"w4", skill:"Bonding and shape", goal:6,
          prompt:"What is the bond angle around a carbon with four single bonds?",
          options:[
            { t:"109.5°", ok:true, why:"Tetrahedral." },
            { t:"120°", why:"That’s trigonal planar, as around a C=C." },
            { t:"180°", why:"That’s linear, as around C≡C." },
            { t:"90°", why:"Electron groups spread as far apart as possible." }],
          hints:["Four groups around the carbon.", "Tetrahedral.", "109.5°."] },
        { id:"w5", skill:"Bonding and shape", goal:6,
          prompt:"How many electrons are shared in a C=C double bond?",
          options:[
            { t:"4", ok:true, why:"Two pairs." },
            { t:"2", why:"That’s a single bond." },
            { t:"6", why:"That’s a triple bond." },
            { t:"8", why:"Too many." }],
          hints:["A single bond shares one pair.", "A double bond shares two pairs.", "4 electrons."] },
        { id:"w6", skill:"Reaction types", goal:3,
          prompt:"CH₄ + Cl₂ → CH₃Cl + HCl is which type of reaction?",
          options:[
            { t:"Substitution", ok:true, why:"An H is replaced by Cl." },
            { t:"Addition", why:"Nothing adds; one atom swaps for another." },
            { t:"Combustion", why:"No O₂." },
            { t:"Elimination", why:"No double bond forms." }],
          hints:["What happened to one H?", "Replaced.", "Substitution."] }
      ],
      refreshers:{
        "Naming alkanes":"Root = chain length, suffix = family, prefixes = substituents with locants.",
        "Formulas":"CₙH₂ₙ₊₂ is saturated; each ring or C=C removes 2 H; each C≡C removes 4.",
        "Bonding and shape":"4 groups → 109.5°; 3 groups (around C=C) → 120°; 2 groups (around C≡C) → 180°.",
        "Reaction types":"Substitution swaps an atom; addition adds atoms across a multiple bond; combustion burns in O₂."
      }
    }
  },
  explore:{
    heading:"Multiple-bond lab",
    intro:"Build chains with double and triple bonds, see their shapes, and react them with a reagent.",
    how:"Set the chain length. Tap a C–C bond in the drawing (or Tab to it), then choose single, double or triple; with the keyboard, Enter cycles the bond type. Tap a carbon to see its bond angle and to add or remove the methyl group.",
    modes:[{ id:"shape", t:"Name and shape" }, { id:"react", t:"Reactions" }, { id:"benz", t:"Benzene vs cyclohexene" }],
    reagents:[{ id:"H2", t:"H₂ (metal catalyst)" }, { id:"Br2", t:"Br₂" }, { id:"Cl2", t:"Cl₂" }, { id:"HBr", t:"HBr" }, { id:"HCl", t:"HCl" }, { id:"H2O", t:"H₂O (acid catalyst)" }],
    benzReagents:[{ id:"plain", t:"Br₂ (no catalyst)" }, { id:"fe", t:"Br₂ with FeBr₃ catalyst" }],
    predictions:[
      { id:"p1", prompt:"Propene + HBr. What is the major product?",
        options:[{ t:"2-bromopropane", ok:true }, { t:"1-bromopropane" }, { t:"1,2-dibromopropane" }, { t:"propane" }],
        explain:"H attaches to C1 (which had 2 H), Br to C2. Markovnikov: H goes to the carbon that already has more H." },
      { id:"p2", prompt:"Benzene vs cyclohexene, Br₂ with no catalyst. Which flask loses its orange-brown colour quickly?",
        options:[{ t:"cyclohexene only", ok:true }, { t:"benzene only" }, { t:"both" }, { t:"neither" }],
        explain:"The cyclohexene flask goes colourless; the benzene flask stays orange-brown. Cyclohexene adds Br₂ across its C=C. Benzene’s delocalized ring resists addition." },
      { id:"p3", prompt:"But-2-ene in Name and shape mode. Try to rotate the C2=C3 bond. What happens?",
        options:[{ t:"it won’t rotate", ok:true }, { t:"it spins freely" }, { t:"it rotates 90° then stops" }, { t:"the molecule breaks apart" }],
        explain:"The handle resists: rotating would break the π bond. That’s why cis and trans forms exist (module 11)." },
      { id:"p4", prompt:"Ethyne + H₂ (metal catalyst), with “add twice” on. What forms?",
        options:[{ t:"ethane", ok:true }, { t:"ethene" }, { t:"nothing" }, { t:"methane" }],
        explain:"One H₂ gives ethene, the second gives ethane. A triple bond can add two molecules of H₂." }
    ],
    chalIntro:"Use the Multiple-bond lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Build <strong>but-2-ene</strong>.",
        why:"CH₃CH=CHCH₃: 4 carbons, with the double bond starting at C2 from either end.",
        hints:["4 carbons.", "The double bond must start at C2 from either end.", "CH₃CH=CHCH₃."] },
      { id:"tc2", goal:3, prompt:"In <strong>Reactions</strong> mode, choose an alkene and a reagent that give <strong>2-chlorobutane as the only product</strong>.",
        why:"A symmetric alkene gives one product: but-2-ene + HCl.",
        hints:["A symmetric alkene gives one product.", "Which butene has the same groups on both C=C carbons?", "but-2-ene + HCl."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Design the starting alkene so that adding water (acid catalyst) gives <strong>2-methylpropan-2-ol</strong> as the major product.",
        why:"CH₂=C(CH₃)₂: H adds to CH₂, OH to the central carbon.",
        hints:["Work backwards: where is the OH? On a carbon bonded to three other carbons.", "That carbon must be the C=C carbon with fewer H.", "CH₂=C(CH₃)₂: H adds to CH₂, OH to the central carbon."] }
    ],
    blocks:[{ title:"What the lab shows", html:"<p>The multiple bond is the reactive site <strong>and</strong> the rigid part of the molecule. Markovnikov’s rule decides where the atoms go when HX or H₂O adds. Benzene’s delocalized ring stays intact.</p>" }]
  },
  part3:{
    slug:"bromine-test", name:"Bromine test", heading:"Test for unsaturation",
    intro:"Bromine water is orange-brown. A multiple bond adds Br₂, and the colour disappears. Run the test on six samples, choose a control, then compare two oils. Bromine and benzene are hazardous, so this test is virtual only: no procedure or amounts are given.",
    s1:{ title:"Station 1: Run the test",
      intro:"Tap a sample to add bromine water (in the dark, no catalyst). Read the observation card, then record what you saw in the results table.",
      samples:[
        { id:"hexane", name:"hexane", f:"C6H14", dec:false },
        { id:"hexene", name:"hex-1-ene", f:"C6H12", dec:true, prod:"1,2-dibromohexane", eq:"CH2=CHCH2CH2CH2CH3 + Br2 -> CH2BrCHBrCH2CH2CH2CH3" },
        { id:"chx", name:"cyclohexane", f:"C6H12", dec:false },
        { id:"chxe", name:"cyclohexene", f:"C6H10", dec:true, prod:"1,2-dibromocyclohexane", eq:"C6H10 + Br2 -> C6H10Br2" },
        { id:"benz", name:"benzene", f:"C6H6", dec:false },
        { id:"oil", name:"a vegetable oil", f:"", dec:true, prod:"Br adds across each C=C in the oil’s chains (a dibromo unit at every C=C)" }],
      yes:"orange-brown → colourless within seconds", no:"stays orange-brown",
      tableNote:"Record each observation. The last column fills in once your record matches the card." },
    s2:{ title:"Station 2: Controls and conclusions",
      q:"Which sample is the best negative control, and why?",
      options:[
        { t:"hexane", ok:true, why:"Same carbon count as hex-1-ene, no multiple bonds: it shows what ‘no reaction’ looks like." },
        { t:"cyclohexane", why:"No multiple bond, but it’s a ring: it differs from hex-1-ene in more than one way." },
        { t:"benzene", why:"Benzene also stays coloured, but it differs from hex-1-ene in more than one way, so hexane is the cleaner control." },
        { t:"hex-1-ene", why:"Hex-1-ene decolourizes the bromine water: it’s a positive result, not a negative control." }],
      data:"<p>The addition product for each positive sample. Hexane and hex-1-ene have the same number of carbons and similar boiling points, so the C=C is the only real difference.</p>" },
    s3:{ title:"Station 3: How unsaturated?",
      intro:"Add bromine one unit at a time to 1 g of each oil. While C=C bonds remain, the colour disappears; once they’re used up, the orange-brown stays. Model data.",
      cap:{ P:2, Q:1 },
      q:"Oil P absorbs 2 units of bromine per gram; oil Q absorbs 1. Compared with Q, how many C=C bonds per gram does P have?",
      options:[
        { t:"about twice as many", ok:true, why:"Each C=C adds one Br₂, so twice the bromine means about twice as many C=C bonds per gram." },
        { t:"half as many", why:"P absorbed <strong>more</strong> bromine: more C=C bonds, not fewer." },
        { t:"the same number", why:"Different uptake means different numbers of C=C bonds." },
        { t:"four times as many", why:"2 units vs 1 unit is a ratio of 2, not 4." }],
      stse:"<strong>STSE:</strong> Margarine is made by adding H₂ (metal catalyst) to some C=C bonds in a liquid vegetable oil. The chains become more saturated, the melting point rises, and the product absorbs less bromine." },
    quickCheck:{
      title:"Quick check", summary:"Bromine test quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which decolourizes bromine water quickly?",
          choices:[
            { t:"pent-2-ene", ok:true, fb:"Right. Only the multiple bond adds Br₂." },
            { t:"pentane", fb:"Only the multiple bond adds Br₂." },
            { t:"benzene", fb:"Only the multiple bond adds Br₂." },
            { t:"cyclopentane", fb:"Only the multiple bond adds Br₂." }] },
        { id:"q2", goal:3, prompt:"Product of cyclohexene + Br₂?",
          choices:[
            { t:"1,2-dibromocyclohexane", ok:true, fb:"Right. Addition puts one Br on each C=C carbon." },
            { t:"bromocyclohexane", fb:"Addition puts one Br on each C=C carbon." },
            { t:"bromobenzene", fb:"Addition puts one Br on each C=C carbon." },
            { t:"cyclohexane", fb:"Addition puts one Br on each C=C carbon." }] },
        { id:"q3", goal:5, prompt:"Why use hexane in the test set?",
          choices:[
            { t:"negative control", ok:true, fb:"Right. Same size, no multiple bond: it shows what ‘no reaction’ looks like." },
            { t:"positive control", fb:"Same size, no multiple bond: it shows what ‘no reaction’ looks like." },
            { t:"catalyst", fb:"Same size, no multiple bond: it shows what ‘no reaction’ looks like." },
            { t:"solvent only", fb:"Same size, no multiple bond: it shows what ‘no reaction’ looks like." }] },
        { id:"q4", goal:4, prompt:"Benzene + Br₂ with FeBr₃ gives…",
          choices:[
            { t:"bromobenzene + HBr", ok:true, fb:"Right. Substitution: one ring H is replaced by Br." },
            { t:"1,2-dibromobenzene only", fb:"Substitution: one ring H is replaced by Br." },
            { t:"no change", fb:"Substitution: one ring H is replaced by Br." },
            { t:"cyclohexane", fb:"Substitution: one ring H is replaced by Br." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"names", type:"custom", title:"Name it", summary:"Name it", goal:[1, 2],
        instruction:"Eight structures: alkenes, alkynes, a diene, a cycloalkene and three aromatic compounds. Build each IUPAC name with the chips.",
        how:"Tap chips to build the name, then press Check name. Use Previous and Next (or the numbered buttons) to move between structures.",
        items:[
          { id:"n1", goal:1, t:"CH₃CH=CHCH₂CH₃", answer:"pent-2-ene",
            wrong:{ "pent-3-ene":"Number from the end nearer the multiple bond. From the other end it starts at C2." } },
          { id:"n2", goal:1, t:"CH₂=CHCH(CH₃)CH₃", answer:"3-methylbut-1-ene",
            wrong:{ "2-methylbut-3-ene":M1 },
            hints:["The double bond gets the lowest number.", "C=C at C1, methyl on C3.", "3-methylbut-1-ene."] },
          { id:"n3", goal:1, t:"CH₃CH₂C≡CCH₂CH₃", answer:"hex-3-yne",
            wrong:{ "hex-3-ene":"Triple bond: -yne." } },
          { id:"n4", goal:1, t:"CH₂=CHCH=CH₂", answer:"buta-1,3-diene",
            wrong:{ "but-1,3-ene":"Two C=C: -diene, with an ‘a’ added: buta-." },
            hints:["How many double bonds?", "Two, starting at C1 and C3.", "buta-1,3-diene."] },
          { id:"n5", goal:1, t:"5-carbon ring with one C=C", ring:{ n:5, dbl:[0] }, answer:"cyclopentene",
            wrong:{ "pentene":"It’s a ring." } },
          { id:"n6", goal:2, t:"benzene ring with CH₃", ring:{ n:6, arom:true, subs:[[0, "CH₃"]] }, answer:"methylbenzene",
            wrong:{ "methylcyclohexane":"It’s an aromatic ring." } },
          { id:"n7", goal:2, t:"benzene ring, CH₃ on opposite carbons", ring:{ n:6, arom:true, subs:[[0, "CH₃"], [3, "CH₃"]] }, answer:"1,4-dimethylbenzene",
            wrong:{ "1,3-dimethylbenzene":"Opposite carbons are 1 and 4." } },
          { id:"n8", goal:2, t:"benzene ring with CH₂CH₃", ring:{ n:6, arom:true, subs:[[0, "CH₂CH₃"]] }, answer:"ethylbenzene",
            wrong:{ "phenylethane":"Name it as a substituted benzene: ethylbenzene." } }
        ] },
      { id:"products", type:"custom", title:"Predict the product", summary:"Predict the product", star:true, goal:[3, 4, 5],
        instruction:"Six items. Items 3 to 6 are non-routine; items 4 and 6 go beyond the Final Check.",
        how:"Tap your answer (in item 4, tap every answer that fits), then press Check.",
        items:[
          { id:"r1", kind:"chips", goal:3, prompt:"but-1-ene + Br₂",
            options:[
              { t:"1,2-dibromobutane", ok:true, why:"Br adds to C1 and C2: one Br on each carbon of the double bond." },
              { t:"1-bromobutane", why:"Both Br atoms add." },
              { t:"1,1-dibromobutane", why:M5 },
              { t:"butane", why:"That’s addition of H₂." }] },
          { id:"r2", kind:"chips", goal:3, prompt:"2-methylbut-2-ene + HBr (major)",
            options:[
              { t:"2-bromo-2-methylbutane", ok:true, why:"H goes to C3, which already has an H; Br goes to C2, which has none." },
              { t:"2-bromo-3-methylbutane", why:"H goes to C3, which has an H." },
              { t:"2-methylbutane", why:"That’s addition of H₂." },
              { t:"2,3-dibromo-2-methylbutane", why:"That’s addition of Br₂." }] },
          { id:"r3", kind:"chips", star:true, goal:3, prompt:"propyne + 2 HBr (major)",
            options:[
              { t:"2,2-dibromopropane", ok:true, why:"Markovnikov applies to both additions: Br goes to C2 twice." },
              { t:"1,2-dibromopropane", why:"Markovnikov applies to both additions: Br goes to C2 twice." },
              { t:"1,1-dibromopropane", why:M3 },
              { t:"2-bromopropene", why:"That’s only the first addition: the second HBr adds too." }],
            hints:["First addition: propyne → 2-bromopropene.", "Second addition: H to the CH₂ end.", "2,2-dibromopropane."] },
          { id:"r4", kind:"all", star:true, goal:3, prompt:"Select <strong>all</strong> alkenes that give 3-bromo-3-methylpentane as the major product with HBr.",
            options:[
              { t:"3-methylpent-2-ene", ok:true },
              { t:"2-ethylbut-1-ene", ok:true },
              { t:"3-methylpent-1-ene", why:"Br goes to C2: 2-bromo-3-methylpentane." },
              { t:"2-methylpent-2-ene", why:"Br on C2: 2-bromo-2-methylpentane." }],
            why:"3-methylpent-2-ene and 2-ethylbut-1-ene both put Br on the carbon bonded to an ethyl, an ethyl and a methyl.",
            hints:["Where must the Br end up? On a carbon bonded to an ethyl, an ethyl and a methyl.", "That carbon must be the C=C carbon with fewer H.", "3-methylpent-2-ene and 2-ethylbut-1-ene both put Br there."] },
          { id:"r5", kind:"chips", star:true, goal:5, prompt:"<strong>Investigation:</strong> Three unlabelled liquids: hexane, hex-1-ene, benzene. Bromine water (dark, no catalyst) decolourizes only liquid B. What is B, and which of the others serves as the negative control?",
            options:[
              { t:"B is hex-1-ene; hexane is the negative control", ok:true, why:"Only the C=C in hex-1-ene adds Br₂. Hexane has the same carbon count and no multiple bond. Benzene also stays coloured, but it differs from hex-1-ene in more than one way, so hexane is the cleaner control." },
              { t:"B is hex-1-ene; benzene is the negative control", why:"Benzene also stays coloured, but it differs from hex-1-ene in more than one way, so hexane is the cleaner control." },
              { t:"B is benzene; hexane is the negative control", why:"Benzene’s delocalized ring resists addition, so benzene stays coloured. Only the C=C adds Br₂." },
              { t:"B is hexane; benzene is the negative control", why:"Hexane has no multiple bond, so it can’t add Br₂: it stays coloured." }] },
          { id:"r6", kind:"chips", star:true, goal:5, prompt:"A hydrocarbon C₆H₁₀ adds exactly 2 mol of H₂ per mole to become hexane. Which could it be?",
            options:[
              { t:"hex-2-yne", ok:true, why:"C₆H₁₀ with one C≡C: two H₂ add and the open chain becomes hexane, C₆H₁₄." },
              { t:"cyclohexene", why:"It adds only 1 H₂ and gives cyclohexane." },
              { t:"benzene", why:"C₆H₆, not C₆H₁₀." },
              { t:"hex-1-ene", why:"C₆H₁₂." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Alana", how:"",
        instruction:"Alana made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Name CH₂=CHCH₂CH₂CH₃.",
            steps:["The chain has 5 carbons: root pent-.", "There is one C=C, so the suffix is -ene.", "Number from the right end: the double bond starts at C4.", "Name: pent-4-ene."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"Number from the left so the double bond starts at C1: pent-1-ene.", ok:true, why:M1 },
              { t:"pent-4-ene is correct.", why:M7 },
              { t:"Name it pentane.", why:"The C=C makes it an alkene." },
              { t:"Name it pent-1-yne.", why:"Double bond: -ene." }],
            hints:["Which end is nearer the C=C?", "The left end.", "pent-1-ene."] },
          { id:"e2", goal:3, task:"Predict the major product of propene + HCl.",
            steps:["Propene is CH₂=CHCH₃.", "HCl adds across the double bond.", "H adds to C2 and Cl to C1.", "The product is 1-chloropropane."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"H adds to C1, which already has 2 H; Cl goes to C2: 2-chloropropane.", ok:true, why:M3 },
              { t:"Both H and Cl add to C1.", why:M5 },
              { t:"Cl replaces an H: 1-chloropropene.", why:"That’s substitution, not addition." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Which C=C carbon has more H?", "C1 has 2; C2 has 1.", "2-chloropropane."] },
          { id:"e3", goal:4, task:"Predict what happens when benzene is mixed with Br₂ in the dark, with no catalyst.",
            steps:["Benzene’s formula is C₆H₆.", "It’s often drawn with alternating double bonds.", "So it adds Br₂ like an alkene and decolourizes the bromine.", "The product is 1,2-dibromocyclohexadiene."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct: that’s one way it’s drawn.", "", "Follows from step 3."],
            fixes:[
              { t:"Benzene’s electrons are delocalized, so it resists addition: no reaction without a catalyst. With FeBr₃ it substitutes: bromobenzene + HBr.", ok:true, why:M4 },
              { t:"It burns instead.", why:"No O₂ source here." },
              { t:"It adds three Br₂ at once.", why:M4 },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Does benzene behave like cyclohexene in the bromine test?", "No: it stays coloured.", "No reaction; substitution only with a catalyst."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you: the double bond refusing to rotate, or benzene ignoring bromine?" },
      { id:"j2", q:"In your own words, explain Markovnikov’s rule and when you need it." },
      { id:"j3", q:"Explain to a friend how the bromine test tells an alkene from an alkane." },
      { id:"j4", q:"Which kind of addition product is still hard for you to predict? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Name CH₃CH=CHCH₂CH₃.", options:[
          { t:"pent-2-ene", ok:true, why:"Number from the end nearer the C=C." },
          { t:"pent-3-ene", why:"From the other end it starts at C2." },
          { t:"pentene", why:"A locant is needed: there are two possible positions." },
          { t:"pent-2-yne", why:"It’s a double bond." }] },
        b:{ prompt:"Name CH≡CCH(CH₃)CH₃.", options:[
          { t:"3-methylbut-1-yne", ok:true, why:"Triple bond at C1, methyl on C3." },
          { t:"2-methylbut-3-yne", why:"The triple bond gets the lowest number." },
          { t:"3-methylbut-1-ene", why:"It’s a triple bond: -yne." },
          { t:"2-methylbutyne", why:"Locants are needed." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which describes 1,3-dimethylbenzene?", options:[
          { t:"A benzene ring with methyl groups on carbons separated by one ring carbon", ok:true, why:"Ring carbons 1 and 3 have one ring carbon (C2) between them." },
          { t:"Methyl groups on neighbouring ring carbons", why:"That’s 1,2-." },
          { t:"Methyl groups on opposite ring carbons", why:"That’s 1,4-." },
          { t:"A cyclohexane ring with two methyl groups", why:"Benzene is aromatic, not cyclohexane." }] },
        b:{ prompt:"Name a benzene ring carrying one CH₂CH₃ group.", options:[
          { t:"ethylbenzene", ok:true, why:"Name it as a substituted benzene: ethylbenzene." },
          { t:"ethylcyclohexane", why:"The ring is aromatic." },
          { t:"methylbenzene", why:"The group has 2 carbons." },
          { t:"1-ethylhexene", why:"Aromatic rings aren’t named as hexenes." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which formula could be an alkyne?", options:[
          { t:"C₅H₈", ok:true, why:"CₙH₂ₙ₋₂." },
          { t:"C₅H₁₀", why:"One C=C or a ring." },
          { t:"C₅H₁₂", why:"Saturated." },
          { t:"C₅H₁₄", why:"Too many H for 5 carbons." }] },
        b:{ prompt:"Which compound is saturated?", options:[
          { t:"cyclohexane", ok:true, why:"Only single bonds." },
          { t:"cyclohexene", why:"Has a C=C." },
          { t:"benzene", why:"Aromatic ring, unsaturated." },
          { t:"hex-1-ene", why:"Has a C=C." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is the major product of 2-methylpropene + HCl?", options:[
          { t:"2-chloro-2-methylpropane", ok:true, why:"H goes to the CH₂ carbon; Cl to the carbon with no H." },
          { t:"1-chloro-2-methylpropane", why:M3 },
          { t:"2-methylpropane", why:"That’s addition of H₂." },
          { t:"1,2-dichloro-2-methylpropane", why:"That’s addition of Cl₂." }] },
        b:{ prompt:"What is the major product of 1-methylcyclohexene + HBr?", options:[
          { t:"1-bromo-1-methylcyclohexane", ok:true, why:"Br on the ring carbon that carries the methyl (it had no H)." },
          { t:"1-bromo-2-methylcyclohexane", why:M3 },
          { t:"methylcyclohexane", why:"That’s addition of H₂." },
          { t:"bromocyclohexane", why:"The methyl doesn’t leave." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Which alkene gives butan-2-ol as the major product when water adds (acid catalyst)?", options:[
          { t:"but-2-ene", ok:true, why:"Either C=C carbon gets the OH: butan-2-ol." },
          { t:"2-methylpropene", why:"That gives 2-methylpropan-2-ol." },
          { t:"propene", why:"That gives propan-2-ol: only 3 carbons." },
          { t:"butane", why:"No double bond, no addition." }] },
        b:{ prompt:"Which alkene gives 2-bromo-2-methylbutane as the major product with HBr?", options:[
          { t:"2-methylbut-2-ene", ok:true, why:"Br goes to C2, which has no H." },
          { t:"3-methylbut-1-ene", why:"That gives 2-bromo-3-methylbutane." },
          { t:"pent-2-ene", why:"No branch: you’d get bromopentanes." },
          { t:"2-methylbutane", why:"No double bond." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Benzene reacts with Br₂ only when FeBr₃ is present, and HBr is released. What does this show?", options:[
          { t:"Substitution: one ring H is replaced by Br and the delocalized ring stays intact", ok:true, why:"HBr comes from the H that Br replaces; the ring keeps its delocalized electrons." },
          { t:"Addition across one C=C", why:"Addition wouldn’t release HBr." },
          { t:"Combustion of benzene", why:"No O₂ involved." },
          { t:"Benzene is saturated", why:"C₆H₆ is far from saturated; it’s stabilized, not saturated." }] },
        b:{ prompt:"Cyclohexene decolourizes bromine water instantly; benzene doesn’t. What is the best conclusion?", options:[
          { t:"Benzene’s π electrons are delocalized, which makes the ring stable and resistant to addition", ok:true, why:M4 },
          { t:"Benzene has no double bonds at all", why:"It has π electrons, spread around the ring." },
          { t:"Benzene is saturated", why:"C₆H₆ has far fewer H than a saturated C₆." },
          { t:"Cyclohexene is aromatic", why:"Cyclohexene has one ordinary C=C." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which is the best explanation of why but-2-ene has cis and trans forms but butane doesn’t?", options:[
          { t:"“The π part of the C=C prevents rotation, so groups are locked on the same side or opposite sides. The C–C single bonds in butane rotate freely.”", ok:true, why:"The π part of the double bond locks the two carbons; no rotation without breaking it." },
          { t:"“But-2-ene has more atoms than butane.”", why:"It has two fewer H." },
          { t:"“Double bonds are longer than single bonds.”", why:"They’re shorter; length isn’t the reason." },
          { t:"“Butane is a ring.”", why:"Butane is an open chain." }] },
        b:{ prompt:"Which correctly states the shape around each carbon in ethyne?", options:[
          { t:"Linear, 180°", ok:true, why:"Two electron groups (the triple bond and the C–H)." },
          { t:"Trigonal planar, 120°", why:"That’s around a C=C." },
          { t:"Tetrahedral, 109.5°", why:"That’s around a carbon with four single bonds." },
          { t:"Bent, 104.5°", why:"Carbon has no lone pairs here." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which equation correctly shows complete hydrogenation of propyne?", options:[
          { t:"CH≡CCH₃ + 2H₂ → CH₃CH₂CH₃ (metal catalyst)", ok:true, why:"A triple bond can add two molecules of H₂: one gives propene, the second gives propane." },
          { t:"CH≡CCH₃ + H₂ → CH₃CH₂CH₃", why:"H isn’t balanced: one H₂ only gives propene." },
          { t:"CH≡CCH₃ + 2H₂ → CH₂=CHCH₃", why:"That’s not balanced either: propene needs only one H₂." },
          { t:"CH≡CCH₃ + H₂O → CH₃CH₂CH₂OH", why:"That’s not hydrogenation." }] },
        b:{ prompt:"Which equation correctly shows bromine adding to ethene?", options:[
          { t:"CH₂=CH₂ + Br₂ → CH₂BrCH₂Br", ok:true, why:M5 },
          { t:"CH₂=CH₂ + Br₂ → CH₂=CHBr + HBr", why:"That’s substitution." },
          { t:"CH₂=CH₂ + Br₂ → CH₃CH₂Br", why:"Both Br atoms add, and no H appears." },
          { t:"CH₂=CH₂ + Br₂ → CH₂Br₂ + CH₂", why:"The carbon chain stays intact." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Liquid vegetable oils are hydrogenated to make solid margarine. What happens to the oil molecules?", options:[
          { t:"H₂ adds across some C=C bonds, making the chains more saturated and raising the melting point", ok:true, why:"Hydrogenation is addition of H₂: fewer C=C bonds, more saturated chains, a higher melting point." },
          { t:"H₂ replaces C=C bonds with C≡C bonds", why:"Adding H₂ removes multiple bonds." },
          { t:"The oil molecules lose hydrogen", why:"They gain it." },
          { t:"Bromine adds to the oil", why:"Hydrogen is added, not bromine." }] },
        b:{ prompt:"Oil P absorbs twice as much bromine per gram as oil Q in a test. What can you conclude?", options:[
          { t:"P has about twice as many C=C bonds per gram, so it is more unsaturated", ok:true, why:"More Br₂ added means more C=C bonds." },
          { t:"P is more saturated", why:"More Br₂ added means more C=C bonds." },
          { t:"P has more benzene rings", why:"Rings resist addition." },
          { t:"The two oils are identical", why:"Different uptake means different unsaturation." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"Naphthalene (two fused benzene rings, C₁₀H₈) is used in mothballs. With Br₂ and a catalyst, which reaction type is expected on the ring?", options:[
          { t:"Substitution", ok:true, why:"Aromatic rings keep their delocalized system." },
          { t:"Addition", why:M4 },
          { t:"Elimination", why:"Nothing is removed to form a new multiple bond." },
          { t:"No reaction under any conditions", why:"With a catalyst, aromatic rings substitute." }] },
        b:{ prompt:"Methylbenzene reacts with Cl₂ in the presence of FeCl₃. Which products are expected?", options:[
          { t:"A chloromethylbenzene and HCl", ok:true, why:"Substitution on the ring." },
          { t:"1,2-dichloro-methylcyclohexadiene", why:"That would be addition." },
          { t:"Methylcyclohexane", why:"That needs H₂ and harsh conditions." },
          { t:"Benzene and chloromethane", why:"The methyl group stays." }] } }
    ]
  },
  task:{
    title:"Tertiary target", summary:"Tertiary target",
    statement:"<p>Design an alkene so that adding HBr gives one clear product with Br on a carbon bonded to three other carbons. Then name your alkene. Can you find every answer?</p><ol class=\"ae-conds\"><li>The alkene has 5 or 6 carbons.</li><li>HBr gives one clear product (a single product or a clear Markovnikov major product).</li><li>In that product, Br is on a carbon bonded to three other carbons.</li><li>You named the alkene correctly.</li></ol><p class=\"tiny muted\">Choose the main chain length, where the C=C starts and (optionally) one methyl group on an inner carbon. The builder renumbers a structure entered from the “wrong” end. Name your alkene with the chips; its IUPAC name appears after you check a name.</p>",
    checks:["5 or 6 carbons", "One clear product", "Br on a carbon bonded to three carbons", "Named correctly"],
    tips:["Count the methyl branch as well as the chain.", "If both C=C carbons carry one H each, HBr gives a mixture.", "Put the methyl on one of the C=C carbons.", "The double bond gets the lowest locant; then the methyl."],
    explainPrompt:"Explain how Markovnikov’s rule guided where you put the methyl group.",
    vocab:"Use the words addition, Markovnikov’s rule, major product and double bond.",
    more:"There’s more than one answer. Can you find every one?",
    after3:"Every answer puts the methyl on a C=C carbon. That carbon has no H, so Markovnikov sends Br there."
  },
  cards:[
    ["Alkene", "Hydrocarbon with a C=C; suffix -ene; one C=C gives CₙH₂ₙ (propene C₃H₆)."],
    ["Alkyne", "Hydrocarbon with a C≡C; suffix -yne; CₙH₂ₙ₋₂ (ethyne C₂H₂)."],
    ["Locant rule", "The multiple bond gets the lowest number: but-1-ene, not but-3-ene."],
    ["Diene", "Two C=C bonds: buta-1,3-diene."],
    ["Shapes", "Single 109.5°, double 120° (planar), triple 180° (linear)."],
    ["No rotation", "A C=C can’t rotate without breaking its π bond."],
    ["Addition", "Both atoms of H₂, X₂, HX or H₂O add across the multiple bond."],
    ["Markovnikov’s rule", "In HX or H₂O addition, H goes to the C=C carbon that already has more H."],
    ["Benzene", "C₆H₆ ring with delocalized electrons; stable; substitutes rather than adds."],
    ["Aromatic names", "methylbenzene, ethylbenzene, 1,4-dimethylbenzene; C₆H₅– is phenyl."],
    ["Bromine test", "Alkenes and alkynes decolourize bromine water quickly; alkanes and benzene don’t."],
    ["Hydrogenation", "Adding H₂ (metal catalyst) to C=C or C≡C makes the compound more saturated."]
  ]
};
