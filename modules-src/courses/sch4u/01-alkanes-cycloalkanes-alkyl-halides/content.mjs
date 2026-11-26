// SCH4U 01 Alkanes, Cycloalkanes and Alkyl Halides. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/01-alkanes-cycloalkanes-alkyl-halides.md
// Molecule pictures inside content are drawn by app.js (figures hook): <canvas data-fig="key"> stubs get an SVG from C1.
const fig = (key, alt) => '<canvas class="ab-figc" data-fig="' + key + '" aria-hidden="true"></canvas><span class="vh">' + alt + "</span>";

// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "Bends don’t make branches. Trace every path and count the longest continuous chain.";
const M2 = "Number from the end that gives the substituents the lowest set of locants.";
const M4 = "Branching makes the molecule compact: less surface contact, weaker London forces, lower boiling point.";
const M5 = "Closing a ring removes two H atoms: cycloalkanes are CₙH₂ₙ.";
const M6 = "Equivalent positions give the same product. Propane has 8 H but only 2 different environments, so 2 products.";
const M7 = "In combustion, every H ends up in H₂O. Count H atoms, then halve to get H₂O.";

export default {
  id:"01-alkanes-cycloalkanes-alkyl-halides",
  kind:"topic",
  title:"Alkanes, cycloalkanes and alkyl halides",
  topic:"Alkanes, Cycloalkanes and Alkyl Halides",
  readyTopic:"alkanes, cycloalkanes and alkyl halides",
  hero:{
    eq:"CH₄ → C₂H₆ → C₃H₈ → … → CₙH₂ₙ₊₂", eqSize:"sm", eqLabel:"C H 4, then C 2 H 6, then C 3 H 8, and so on, up to C n H 2n plus 2",
    headline:"One set of rules names millions of molecules",
    text:"Carbon forms four bonds and links to itself in chains and rings. <strong>Alkanes</strong> are chains joined only by single bonds: they’re <strong>saturated</strong>, with the formula CₙH₂ₙ₊₂. Close the chain into a ring and you have a <strong>cycloalkane</strong>; swap an H for a halogen and you have an <strong>alkyl halide</strong>. IUPAC names say exactly which structure you mean.",
    fig:{ html:'<div class="hx"><div class="hx-stage"><svg class="hx-svg" id="hx-svg" viewBox="0 0 640 420" role="img" aria-label="Ball-and-stick models: methane grows into ethane, propane and butane; butane becomes 2-methylpropane, then cyclobutane, then 1-chlorobutane"></svg><svg class="hx-th" id="hx-th" viewBox="0 0 70 170" aria-hidden="true"></svg></div><div class="hx-row"><p class="hx-name" id="hx-name" aria-live="polite"></p><button type="button" class="btn ghost sm" id="hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can name and draw straight-chain and branched alkanes using IUPAC rules.",
    "I can name and draw cycloalkanes and alkyl halides.",
    "I can write molecular formulas (CₙH₂ₙ₊₂, CₙH₂ₙ for rings) and recognize structural isomers.",
    "I can explain boiling-point trends using chain length, branching and London dispersion forces.",
    "I can write balanced equations for complete and incomplete combustion.",
    "I can predict substitution products with halogens and count the different monosubstituted products."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Bonding and valence", goal:1,
          prompt:"How many covalent bonds does a carbon atom form in a neutral molecule?",
          options:[
            { t:"4", ok:true, why:"Carbon has 4 valence electrons and shares all four." },
            { t:"2", why:"That’s oxygen’s usual count." },
            { t:"3", why:"That’s nitrogen." },
            { t:"6", why:"Carbon has no lone pairs in alkanes." }],
          hints:["How many valence electrons does C have?", "Four, and each bond shares one of them.", "4 bonds."] },
        { id:"w2", skill:"Bonding and valence", goal:3,
          prompt:"How many H atoms are in CH₃–CH₂–CH₂–CH₃?",
          options:[
            { t:"10", ok:true, why:"3 + 2 + 2 + 3 = 10." },
            { t:"8", why:"Add every subscript." },
            { t:"12", why:"Middle carbons bond to two carbons, so they keep only 2 H." },
            { t:"4", why:"That’s the number of C." }],
          hints:["Add the H subscripts.", "3 + 2 + 2 + 3.", "10."] },
        { id:"w3", skill:"Formulas", goal:3,
          prompt:"What is the molecular formula of CH₃CH₂CH₂CH₂CH₃?",
          options:[
            { t:"C₅H₁₂", ok:true, why:"5 C; H = 3 + 2 + 2 + 2 + 3 = 12." },
            { t:"C₅H₁₀", why:"No ring here." },
            { t:"C₅H₁₁", why:"Count again: 12 H." },
            { t:"CH₃", why:"That’s one group, not the molecule." }],
          hints:["Count C, then count H.", "CₙH₂ₙ₊₂ with <i>n</i> = 5.", "C₅H₁₂."] },
        { id:"w4", skill:"Intermolecular forces", goal:4,
          prompt:"Which force is the only one acting between methane molecules?",
          options:[
            { t:"London dispersion forces", ok:true, why:"Methane is nonpolar." },
            { t:"Hydrogen bonding", why:"H-bonds need H on N, O or F." },
            { t:"Dipole–dipole forces", why:"Methane has no net dipole." },
            { t:"Ionic attraction", why:"No ions in methane." }],
          hints:["Is methane polar?", "No: C–H bonds are nearly nonpolar and the shape is symmetric.", "London forces only."] },
        { id:"w5", skill:"Intermolecular forces", goal:4,
          prompt:"Two nonpolar molecules: one has 10 electrons, the other 42. Which boils higher?",
          options:[
            { t:"The one with 42 electrons", ok:true, why:"More electrons → larger, more easily distorted clouds → stronger London forces." },
            { t:"The one with 10 electrons", why:"Fewer electrons means weaker forces." },
            { t:"They boil at the same temperature", why:"London forces grow with size." },
            { t:"Neither boils; nonpolar molecules sublime", why:"They boil, at different temperatures." }],
          hints:["What makes London forces stronger?", "More electrons, more contact.", "The 42-electron molecule."] },
        { id:"w6", skill:"Balancing equations", goal:5,
          prompt:"CH₄ + __O₂ → CO₂ + 2H₂O. What coefficient balances O₂?",
          options:[
            { t:"2", ok:true, why:"Right side O: 2 + 2 = 4, so 2 O₂." },
            { t:"1", why:"Only 2 O atoms on the left." },
            { t:"3", why:"6 O atoms is too many." },
            { t:"4", why:"4 O atoms = 2 O₂." }],
          hints:["Count O on the right.", "CO₂ has 2, 2H₂O has 2.", "4 O atoms = 2 O₂."] }
      ],
      refreshers:{
        "Bonding and valence":"C makes 4 bonds, H makes 1, halogens make 1. Count bonds on every atom to check a structure.",
        "Formulas":"Count each element. Alkanes: CₙH₂ₙ₊₂ (C₄H₁₀); a ring removes 2 H.",
        "Intermolecular forces":"Nonpolar molecules attract by London forces, which grow with the number of electrons and the contact area.",
        "Balancing equations":"Balance C first, then H, then O last, because O₂ appears alone."
      }
    }
  },
  explore:{
    heading:"Chain builder",
    intro:"Build carbon skeletons and watch the name, formula and boiling point respond. Every structure you build is named the IUPAC way.",
    how:"Set the main chain length and the shape. Tap a carbon in the drawing (or Tab to it and press Enter), then tap a group to add it. Tap a group you added, then Remove, to take it off. Arrow keys move along the chain.",
    predictions:[
      { id:"p1", prompt:"Butane boils at −1 °C. Move the end carbon onto C2 to make 2-methylpropane. Its boiling point will be…",
        options:[{ t:"lower", ok:true }, { t:"higher" }, { t:"the same" }, { t:"it won’t boil" }],
        explain:"Same formula, same number of electrons, but the compact shape touches its neighbours less, so London forces are weaker. 2-methylpropane boils at −12 °C." },
      { id:"p2", prompt:"What is this molecule’s name?" + fig("p2", "A 5-carbon chain drawn with an L-shaped bend at the last carbon: CH₃–CH₂–CH₂–CH₂ with a CH₃ drawn below the last CH₂."),
        options:[{ t:"pentane", ok:true }, { t:"1-methylbutane" }, { t:"2-methylbutane" }, { t:"butane" }],
        explain:"A bend isn’t a branch. The longest continuous chain has 5 carbons." },
      { id:"p3", prompt:"Start: hexane, C₆H₁₄. Join the two ends into a ring. How many H atoms does cyclohexane have?",
        options:[{ t:"12", ok:true }, { t:"14" }, { t:"10" }, { t:"6" }],
        explain:"Each end carbon gives up one H to make the new C–C bond: C₆H₁₂." },
      { id:"p4", prompt:"Start: propane. Replace <strong>one</strong> H with Cl. How many different products are possible?",
        options:[{ t:"2", ok:true }, { t:"8" }, { t:"3" }, { t:"1" }],
        explain:"There are 8 H but only 2 kinds of position: end or middle." }
    ],
    chalIntro:"Use the chain builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Build <strong>2,3-dimethylpentane</strong>.",
        why:"CH₃CH(CH₃)CH(CH₃)CH₂CH₃: a 5-carbon chain with methyl groups on C2 and C3. A drawing numbered 3,4 from the other end is the same molecule.",
        hints:["Start with 5 carbons in a row: pentane.", "Number it 1 to 5. Put methyls on C2 and C3.", "CH₃CH(CH₃)CH(CH₃)CH₂CH₃."] },
      { id:"tc2", goal:[1, 2], prompt:"In <strong>Name it</strong> mode, structure 1 is CH₃CH(Cl)CH(CH₃)CH₂CH₃. Assemble its name with the chips.",
        why:"2-chloro-3-methylpentane: the longest chain has 5 carbons, numbering from the Cl end gives {2, 3}, and chloro comes before methyl.",
        hints:["Longest chain first.", "Number from the end nearer a substituent: Cl lands on C2.", "2-chloro-3-methylpentane."] },
      { id:"tc3", goal:4, stretch:true, prompt:"In the <strong>Boiling-point lab</strong>: among the five isomers of C₆H₁₄, build the one that boils lowest <strong>while having only one carbon that carries branches</strong>.",
        why:"2,2-dimethylbutane, 50 °C: the most ball-shaped C₆H₁₄ with one branch point.",
        hints:["More compact means lower boiling point.", "Put both methyl groups on the same carbon.", "2,2-dimethylbutane, 50 °C: the most ball-shaped C₆H₁₄ with one branch point."] }
    ],
    blocks:[{ title:"Why the shape matters", html:"<p>A name is a set of instructions for a structure; formula patterns tell families apart; the same formula can hide different shapes with different boiling points.</p>" }]
  },
  part3:{
    slug:"reactions", name:"Reactions", heading:"Reactions of alkanes",
    intro:"Alkanes react in two main ways. At Station 1, burn propane with more or less oxygen. At Station 2, swap one H for a halogen and count the different products. Each station has a “Check it with data” panel.",
    s1:{ title:"Station 1: Combustion",
      intro:"A burner with propane and an <strong>O₂ supply</strong> slider, from limited to plenty. Watch the products change, and check that the atoms balance.",
      steps:["Very limited", "Limited", "Partly limited", "Nearly enough", "Plenty"],
      data:"<p>O₂ needed per mole of propane for each outcome:</p>",
      stse:"<strong>STSE:</strong> Carbon monoxide is colourless, odourless and toxic. This is why homes with fuel-burning appliances need CO alarms. (The burner here is a diagram only.)" },
    s2:{ title:"Station 2: Substitution with halogens",
      intro:"In light, a halogen replaces one H: CH₄ + Cl₂ → CH₃Cl + HCl. Pick an alkane and tap one H. The symmetry highlighter colours every equivalent H the same and lists the different products.",
      data:"<p>Product names for each choice:</p>" },
    quickCheck:{
      title:"Quick check", summary:"Reactions quick check",
      items:[
        { id:"q1", goal:5, prompt:"C₂H₆ + __O₂ → 2CO₂ + 3H₂O",
          choices:[
            { t:"7/2", ok:true, fb:"Right. O on the right: 4 + 3 = 7 atoms, which is 7/2 O₂ (or double everything: 2C₂H₆ + 7O₂)." },
            { t:"3", fb:"O on the right: 4 + 3 = 7 atoms, which is 7/2 O₂ (or double everything: 2C₂H₆ + 7O₂)." },
            { t:"5", fb:"O on the right: 4 + 3 = 7 atoms, which is 7/2 O₂ (or double everything: 2C₂H₆ + 7O₂)." },
            { t:"7", fb:"O on the right: 4 + 3 = 7 atoms, which is 7/2 O₂ (or double everything: 2C₂H₆ + 7O₂)." }] },
        { id:"q2", goal:6, prompt:"How many different monochloro products from butane?",
          choices:[
            { t:"2", ok:true, fb:"Right. Ends (C1, C4) are equivalent; so are C2 and C3." },
            { t:"4", fb:"Ends (C1, C4) are equivalent; so are C2 and C3." },
            { t:"10", fb:"Ends (C1, C4) are equivalent; so are C2 and C3." },
            { t:"1", fb:"Ends (C1, C4) are equivalent; so are C2 and C3." }] },
        { id:"q3", goal:5, prompt:"Incomplete combustion can produce…",
          choices:[
            { t:"CO and C, plus H₂O", ok:true, fb:"Right. H still goes to water; the carbon is under-oxidized." },
            { t:"H₂", fb:"H still goes to water; the carbon is under-oxidized." },
            { t:"only CO₂", fb:"H still goes to water; the carbon is under-oxidized." },
            { t:"CH₄", fb:"H still goes to water; the carbon is under-oxidized." }] },
        { id:"q4", goal:6, prompt:"CH₄ + Br₂ → CH₃Br + HBr is…",
          choices:[
            { t:"substitution", ok:true, fb:"Right. One H is swapped for Br." },
            { t:"addition", fb:"One H is swapped for Br." },
            { t:"elimination", fb:"One H is swapped for Br." },
            { t:"combustion", fb:"One H is swapped for Br." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Name ↔ structure", summary:"Name ↔ structure", goal:[1, 2],
        instruction:"Match each structure with its IUPAC name. Some names don’t match any structure.",
        how:"Tap a structure on the left, then tap its name on the right.",
        leftTitle:"Structure", rightTitle:"Name",
        left:[
          { id:"l1", t:"CH₃CH(CH₃)CH₂CH₃", goal:1 },
          { id:"l2", t:"CH₃C(CH₃)₂CH₃", goal:1 },
          { id:"l3", t:"CH₃CH₂CH(CH₂CH₃)CH₂CH₃", goal:1, hints:["Trace the longest path.", "Ethyl–C–ethyl gives 5 carbons in a row.", "3-ethylpentane."] },
          { id:"l4", t:fig("m4", "5-carbon ring with one CH₃"), goal:2 },
          { id:"l5", t:fig("m5", "6-carbon ring, Cl on two neighbouring carbons"), goal:2 },
          { id:"l6", t:"CH₃CHBrCH₃", goal:2 },
          { id:"l7", t:"CH₃CH(CH₃)CH(CH₃)CH₂CH₃", goal:1, hints:["5-carbon main chain.", "Methyls on C2 and C3.", "2,3-dimethylpentane."] },
          { id:"l8", t:"CH₂ClCH₂CH₂CH₃", goal:2 }
        ],
        right:[
          { id:"r1", t:"2-methylbutane" }, { id:"r2", t:"2,2-dimethylpropane" }, { id:"r3", t:"3-ethylpentane" }, { id:"r4", t:"methylcyclopentane" },
          { id:"r5", t:"1,2-dichlorocyclohexane" }, { id:"r6", t:"2-bromopropane" }, { id:"r7", t:"2,3-dimethylpentane" }, { id:"r8", t:"1-chlorobutane" },
          { id:"r9", t:"2-ethylbutane" }, { id:"r10", t:"1,3-dichlorocyclohexane" }, { id:"r11", t:"3-methylbutane" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l3|r9":"The longest chain runs through the ethyl group: 5 carbons.", "l5|r10":"The Cl atoms are on neighbouring carbons.", "l1|r11":"Number from the end nearer the branch." },
        wrongDefault:"Find the longest chain, number it, then read the substituents." },
      { id:"formulas", type:"custom", title:"Formulas, isomers and boiling points", summary:"Formulas, isomers and boiling points", star:true, goal:[2, 3, 4, 6],
        instruction:"Six items: formulas, isomer counts, boiling-point order, a fair test and a symmetry puzzle. Items 3 to 6 are non-routine.",
        how:"Type a formula or number, or tap chips, then press Check.",
        items:[
          { id:"s1", kind:"formula", goal:3, prompt:"Molecular formula of 3-ethyl-2-methylhexane?", answer:"C9H20", display:"C₉H₂₀",
            wrong:[{ match:"C8H18", fb:"Count the branch carbons too: 6 + 2 + 1 = 9." }],
            hints:["Count the carbons in the parent chain, then the carbons in each branch.", "Hexane has 6 C, ethyl 2 and methyl 1: 9 carbons. Use CₙH₂ₙ₊₂.", "C₉H₂₀."] },
          { id:"s2", kind:"formula", goal:[2, 3], prompt:"Formula of cyclooctane?", answer:"C8H16", display:"C₈H₁₆",
            wrong:[{ match:"C8H18", fb:M5 }],
            hints:["Is cyclooctane a chain or a ring?", M5, "C₈H₁₆."] },
          { id:"s3", kind:"num", star:true, goal:3, prompt:"How many structural isomers does C₆H₁₄ have?", answer:5, display:"5",
            wrong:[{ match:6, fb:"Check for repeats: 2-methylpentane drawn backwards is 4-methylpentane, the same molecule." }],
            hints:["Start with the 6-chain, then 5-chain with a methyl, then 4-chain with two methyls.", "hexane; 2- and 3-methylpentane; 2,2- and 2,3-dimethylbutane.", "5."] },
          { id:"s4", kind:"order", star:true, goal:4, prompt:"Order by boiling point, lowest first: hexane, 2,2-dimethylbutane, pentane.",
            tiles:["hexane", "2,2-dimethylbutane", "pentane"], answer:[2, 1, 0], display:"pentane (36 °C) < 2,2-dimethylbutane (50 °C) < hexane (69 °C)",
            fb:"Branching lowers the boiling point, but adding a carbon raises it more here.",
            hints:["Compare chain length first, then branching.", "Branching lowers the boiling point, but adding a carbon raises it more here.", "pentane (36 °C) < 2,2-dimethylbutane (50 °C) < hexane (69 °C)."] },
          { id:"s5", kind:"chips", star:true, goal:4, prompt:"<strong>Investigation:</strong> A student wants to test ‘branching lowers boiling point’. Which set of compounds makes a fair test?",
            options:[
              { t:"isomers of C₅H₁₂", ok:true, why:"Compare molecules with the same number of electrons, so only the shape changes. Molar mass is the controlled variable." },
              { t:"pentane, hexane, heptane", why:"Compare molecules with the same number of electrons, so only the shape changes. Molar mass is the controlled variable." },
              { t:"methane and 2,2-dimethylpropane", why:"Compare molecules with the same number of electrons, so only the shape changes. Molar mass is the controlled variable." },
              { t:"any five alkanes", why:"Compare molecules with the same number of electrons, so only the shape changes. Molar mass is the controlled variable." }],
            hints:["What should change, and what should stay the same?", "Compare molecules with the same number of electrons, so only the shape changes.", "Isomers of C₅H₁₂: molar mass is the controlled variable."] },
          { id:"s6", kind:"chips", star:true, goal:6, prompt:"Which C₆H₁₄ isomer gives exactly <strong>two</strong> different monochloro products?",
            options:[
              { t:"2,3-dimethylbutane", ok:true, why:"In 2,3-dimethylbutane all four CH₃ groups are equivalent, and so are the two CH. Two environments → two products." },
              { t:"2,2-dimethylbutane", why:"That gives 3: the three methyls on C2, C3, C4." },
              { t:"hexane", why:"That gives 3." },
              { t:"2-methylpentane", why:"That gives 5." },
              { t:"3-methylpentane", why:"That gives 4." }],
            hints:["Look for the most symmetric isomer.", "In 2,3-dimethylbutane all four CH₃ groups are equivalent, and so are the two CH.", "Two environments → two products."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Adrian", how:"",
        instruction:"Adrian made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Name CH₃CH₂CH(CH₃)CH₂CH₂CH₃.",
            steps:["The longest chain has 6 carbons, so the parent is hexane.", "The branch is a CH₃ group: methyl.", "Number from the right end: the methyl is on C4.", "Write the locant before the prefix: 4-methyl.", "Name: 4-methylhexane."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier.", "Follows from step 3."],
            fixes:[
              { t:"Number from the left so the methyl gets the lower locant: 3-methylhexane.", ok:true, why:M2 },
              { t:"Number from the right; the name 4-methylhexane is correct.", why:"4 > 3: lowest locant wins." },
              { t:"The parent is pentane.", why:"The chain has 6 carbons." },
              { t:"Name it 3-methylpentane.", why:"Wrong parent." }],
            hints:["Which end is closer to the branch?", "From the left, the methyl is on C3.", "3-methylhexane."] },
          { id:"e2", goal:5, task:"Balance the complete combustion of butane.",
            steps:["C₄H₁₀ + O₂ → CO₂ + H₂O", "Balance C: C₄H₁₀ + O₂ → 4CO₂ + H₂O", "Balance H: C₄H₁₀ + O₂ → 4CO₂ + 10H₂O", "Balance O: 8 + 10 = 18 O atoms, so 9O₂.", "C₄H₁₀ + 9O₂ → 4CO₂ + 10H₂O"],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3.", "Follows from step 3."],
            fixes:[
              { t:"10 H atoms make 5 H₂O. Then O = 8 + 5 = 13 atoms: 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O.", ok:true, why:M7 },
              { t:"Use 10H₂ instead of 10H₂O.", why:M7 },
              { t:"Step 3 is correct.", why:"10H₂O has 20 H atoms." },
              { t:"Balance O first.", why:"O₂ is balanced last." }],
            hints:["Each H₂O has 2 H.", "10 ÷ 2 = 5 H₂O.", "Then 13/2 O₂; double to whole numbers."] },
          { id:"e3", goal:6, task:"How many different monochloro products can 2-methylbutane give?",
            steps:["2-methylbutane is CH₃CH(CH₃)CH₂CH₃.", "Cl replaces one H at a time.", "There are 12 H atoms, so 12 different products.", "So 12 monochloro isomers form."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Follows from step 3."],
            fixes:[
              { t:"Group equivalent H: the two CH₃ on C2, the CH, the CH₂ and the end CH₃. That’s 4 environments, so 4 products.", ok:true, why:M6 },
              { t:"12 products is correct.", why:M6 },
              { t:"3 products: one per carbon type.", why:"The two CH₃ groups on C2 are one environment, but the end CH₃ is another." },
              { t:"1 product: all H are the same.", why:"That’s 2,2-dimethylpropane." }],
            hints:["Would swapping either methyl on C2 give the same molecule?", "Yes: they’re equivalent.", "4."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the chain builder: that bends aren’t branches, or that branching lowers the boiling point?" },
      { id:"j2", q:"In your own words, explain why a straight chain boils higher than a branched isomer." },
      { id:"j3", q:"Explain to a friend the order you follow to name a branched alkyl halide." },
      { id:"j4", q:"Which naming rule still trips you up? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Name CH₃CH(CH₃)CH(CH₃)CH₃.", options:[
          { t:"2,3-dimethylbutane", ok:true, why:"4-carbon chain, methyls on C2 and C3." },
          { t:"2-methyl-3-methylbutane", why:"Repeated prefixes combine with di-." },
          { t:"1,2,3-trimethylpropane", why:"A methyl on C1 extends the chain." },
          { t:"2,3-methylbutane", why:"Two methyls need the prefix di-." }] },
        b:{ prompt:"Name CH₃C(CH₃)₂CH₂CH₃.", options:[
          { t:"2,2-dimethylbutane", ok:true, why:"Both methyls on C2 of a butane chain." },
          { t:"2-dimethylbutane", why:"Each methyl needs its own locant: 2,2-." },
          { t:"3,3-dimethylbutane", why:"Number from the end nearer the branches." },
          { t:"2-ethyl-2-methylpropane", why:"The ethyl is part of the longest chain." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What is the molecular formula of cyclopentane?", options:[
          { t:"C₅H₁₀", ok:true, why:"CₙH₂ₙ for a ring." },
          { t:"C₅H₁₂", why:"That’s pentane." },
          { t:"C₅H₈", why:"That’s two H too few." },
          { t:"C₆H₁₂", why:"Cyclopentane has 5 carbons." }] },
        b:{ prompt:"What is the molecular formula of an open-chain alkane with 8 carbons?", options:[
          { t:"C₈H₁₈", ok:true, why:"CₙH₂ₙ₊₂." },
          { t:"C₈H₁₆", why:"That’s the ring formula." },
          { t:"C₈H₁₄", why:"Too few H for a saturated chain." },
          { t:"C₈H₂₀", why:"2(8) + 2 = 18." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Name CH₃CHClCH₂Br.", options:[
          { t:"1-bromo-2-chloropropane", ok:true, why:"From the CH₂Br end the locants are {1, 2}; bromo comes first alphabetically." },
          { t:"2-chloro-1-bromopropane", why:"Alphabetical: bromo before chloro." },
          { t:"3-bromo-2-chloropropane", why:"{1, 2} is lower than {2, 3}." },
          { t:"1-chloro-2-bromopropane", why:"Cl is on the middle carbon." }] },
        b:{ prompt:"Name a 5-carbon ring with Br on one carbon and CH₃ two carbons away.", options:[
          { t:"1-bromo-3-methylcyclopentane", ok:true, why:"Locants {1, 3} either way; the alphabetically first prefix gets 1." },
          { t:"3-bromo-1-methylcyclopentane", why:"Tie in locants: bromo comes first, so it gets C1." },
          { t:"1-methyl-3-bromocyclopentane", why:"Prefixes go alphabetically." },
          { t:"1-bromo-3-methylpentane", why:"It’s a ring: cyclopentane." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Order by boiling point, lowest first: hexane, 2-methylpentane, 2,2-dimethylbutane.", options:[
          { t:"2,2-dimethylbutane < 2-methylpentane < hexane", ok:true, why:"Same formula; more compact means weaker London forces." },
          { t:"hexane < 2-methylpentane < 2,2-dimethylbutane", why:"That reverses the branching effect." },
          { t:"All three boil at the same temperature.", why:"Same formula, different shapes." },
          { t:"2-methylpentane < 2,2-dimethylbutane < hexane", why:"More branching lowers it further." }] },
        b:{ prompt:"Order by boiling point, lowest first: pentane, 2-methylbutane, 2,2-dimethylpropane.", options:[
          { t:"2,2-dimethylpropane < 2-methylbutane < pentane", ok:true, why:"10 °C, 28 °C, 36 °C." },
          { t:"pentane < 2-methylbutane < 2,2-dimethylpropane", why:M4 },
          { t:"All the same.", why:"Shapes differ." },
          { t:"2-methylbutane < 2,2-dimethylpropane < pentane", why:"The most branched is lowest." }] } },
      { id:"t2", cat:"T", goal:6,
        a:{ prompt:"How many different monochloro products can 3-methylpentane give?", options:[
          { t:"4", ok:true, why:"C1/C5, C2/C4, C3 and the methyl branch." },
          { t:"14", why:"That counts H atoms, not environments." },
          { t:"3", why:"The branch CH₃ is a separate environment." },
          { t:"6", why:"C1 and C5 are equivalent; so are C2 and C4." }] },
        b:{ prompt:"How many different monochloro products can 2,2-dimethylbutane give?", options:[
          { t:"3", ok:true, why:"The three CH₃ on C2, the CH₂ at C3, the CH₃ at C4." },
          { t:"14", why:M6 },
          { t:"4", why:"The three methyls on C2 are equivalent." },
          { t:"2", why:"The C4 methyl isn’t equivalent to the C2 methyls." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Balance the complete combustion of pentane, C₅H₁₂, with the smallest whole numbers. What is the coefficient of O₂?", options:[
          { t:"8", ok:true, why:"C₅H₁₂ + 8O₂ → 5CO₂ + 6H₂O: O = 10 + 6 = 16 atoms." },
          { t:"11", why:"That uses 12H₂O; 12 H atoms make 6 H₂O." },
          { t:"5", why:"That counts only the O in CO₂." },
          { t:"16", why:"16 O <strong>atoms</strong> = 8 O₂ molecules." }] },
        b:{ prompt:"Balance the complete combustion of hexane, C₆H₁₄, with the smallest whole numbers. What is the coefficient of O₂?", options:[
          { t:"19", ok:true, why:"2C₆H₁₄ + 19O₂ → 12CO₂ + 14H₂O." },
          { t:"19/2", why:"Correct ratio, but the question asks for whole numbers." },
          { t:"13", why:"That uses 14H₂O for one hexane; 14 H atoms make 7 H₂O." },
          { t:"12", why:"That counts only the O in CO₂." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why pentane (36 °C) boils higher than 2,2-dimethylpropane (10 °C)?", options:[
          { t:"Both are C₅H₁₂ with the same number of electrons, but the straight chain has more surface contact with its neighbours, so its London forces are stronger.", ok:true, why:M4 },
          { t:"Pentane forms hydrogen bonds.", why:"No H on N, O or F." },
          { t:"Pentane has more atoms.", why:"Same formula, same atoms." },
          { t:"Branching makes the covalent bonds stronger.", why:"Boiling separates molecules; it doesn’t break covalent bonds." }] },
        b:{ prompt:"Which is the best explanation of why octane boils higher than butane?", options:[
          { t:"Octane has more electrons and a longer chain, so its London forces are stronger.", ok:true, why:"More electrons → larger, more easily distorted clouds → stronger London forces." },
          { t:"Octane’s C–C bonds are stronger.", why:"Boiling doesn’t break covalent bonds." },
          { t:"Octane is polar.", why:"Both are nonpolar." },
          { t:"Octane forms hydrogen bonds.", why:"No O–H, N–H or F–H." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which equation correctly shows incomplete combustion of methane producing carbon monoxide?", options:[
          { t:"2CH₄ + 3O₂ → 2CO + 4H₂O", ok:true, why:"C 2 = 2; H 8 = 8; O 6 = 2 + 4." },
          { t:"CH₄ + O₂ → CO + 2H₂", why:"Hydrogen ends up in water." },
          { t:"CH₄ + 2O₂ → CO₂ + 2H₂O", why:"That’s complete combustion." },
          { t:"2CH₄ + 3O₂ → 2CO + 2H₂O", why:"H isn’t balanced: 8 vs 4." }] },
        b:{ prompt:"Which equation correctly shows incomplete combustion of propane producing soot (C)?", options:[
          { t:"C₃H₈ + 2O₂ → 3C + 4H₂O", ok:true, why:"O 4 = 4." },
          { t:"C₃H₈ + 5O₂ → 3CO₂ + 4H₂O", why:"That’s complete combustion." },
          { t:"C₃H₈ + O₂ → 3C + 4H₂", why:M7 },
          { t:"C₃H₈ + 2O₂ → 3C + 2H₂O", why:"H isn’t balanced: 8 vs 4." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A furnace burning natural gas (methane) has a partly blocked air intake. Which product becomes more likely, and why does it matter?", options:[
          { t:"CO, because less O₂ means incomplete combustion; CO is toxic, which is why homes need CO alarms", ok:true, why:"Carbon monoxide is colourless, odourless and toxic. This is why homes with fuel-burning appliances need CO alarms." },
          { t:"More CO₂, because the flame gets hotter", why:"Less O₂ can’t make more fully oxidized carbon." },
          { t:"H₂, because H can’t find O", why:M7 },
          { t:"Nothing changes; combustion always gives CO₂ and H₂O", why:"Only with enough O₂." }] },
        b:{ prompt:"A camp stove burning propane leaves black soot on the bottom of a pot. What does this show?", options:[
          { t:"Incomplete combustion: there wasn’t enough O₂, so some carbon formed as solid C", ok:true, why:"Too little O₂: CO and/or C (soot) form, plus H₂O." },
          { t:"Complete combustion makes soot.", why:"Complete combustion gives only CO₂ and H₂O." },
          { t:"The propane contained soot.", why:"The carbon came from the propane molecules." },
          { t:"Hydrogen burned to soot.", why:"H forms water; soot is carbon." }] } },
      { id:"a2", cat:"A", goal:2,
        a:{ prompt:"CFC-12, a refrigerant phased out under the 1987 Montreal Protocol (signed in Montreal), is dichlorodifluoromethane. What is its formula?", options:[
          { t:"CCl₂F₂", ok:true, why:"One carbon with two Cl and two F: all four bonds used." },
          { t:"CH₂Cl₂F₂", why:"Carbon can’t make six bonds." },
          { t:"C₂Cl₂F₂", why:"Methane has one carbon." },
          { t:"CCl₂F", why:"Carbon needs four bonds." }] },
        b:{ prompt:"Its replacement, 1,1,1,2-tetrafluoroethane, has which structure?", options:[
          { t:"CF₃CH₂F", ok:true, why:"Three F on C1 and one F on C2." },
          { t:"CF₂HCF₂H", why:"That’s 1,1,2,2-tetrafluoroethane." },
          { t:"CH₃CF₃", why:"That’s only three F." },
          { t:"C₂F₄", why:"That’s tetrafluoroethene, with a C=C." }] } }
    ]
  },
  task:{
    title:"Three-product heptane", summary:"Three-product heptane",
    statement:"<p>Build an isomer of C₇H₁₆ that meets every condition, then name it. Can you find all the answers?</p><ol class=\"ab-conds\"><li>Its formula is C₇H₁₆.</li><li>It gives exactly 3 different monochloro products.</li><li>Its IUPAC parent chain has 5 carbons.</li><li>You named it correctly.</li></ol><p class=\"tiny muted\">Build with carbon and hydrogen only: set the main chain, then tap a carbon and add methyl or ethyl branches. Name it with the chips. The IUPAC name of your structure appears after you check a name.</p>",
    checks:["Formula C₇H₁₆", "Exactly 3 monochloro products", "Parent chain of 5 carbons", "Named correctly"],
    tips:["Count all carbons, including branches.", "Fewer environments means more symmetry: aim for a molecule that looks the same from several directions.", "Find the longest path through the skeleton; it must be 5.", "Number for the lowest locants; list prefixes alphabetically."],
    explainPrompt:"Explain how symmetry in your molecule reduces the number of monochloro products.",
    vocab:"Use the words equivalent, environment, parent chain and substitution.",
    more:"There’s more than one answer. Can you find all of them?",
    after3:"2,2,3-trimethylbutane also gives 3 products, but its parent chain is butane. Symmetry is what keeps the count low."
  },
  cards:[
    ["Alkane", "Saturated hydrocarbon, single bonds only: CₙH₂ₙ₊₂ (e.g. C₄H₁₀)."],
    ["Cycloalkane", "A ring of carbons with single bonds: CₙH₂ₙ (cyclohexane C₆H₁₂)."],
    ["Alkyl halide", "An alkane with H replaced by F, Cl, Br or I (prefixes fluoro, chloro, bromo, iodo)."],
    ["Longest chain", "The parent name comes from the longest continuous chain; bends aren’t branches."],
    ["Lowest locants", "Number from the end that gives substituents the lowest set of numbers."],
    ["Alphabetical order", "Prefixes listed alphabetically, ignoring di-, tri-: 2-chloro-3-methylpentane."],
    ["Structural isomers", "Same molecular formula, different structure (butane and 2-methylpropane)."],
    ["Branching and boiling point", "More branching → more compact → weaker London forces → lower boiling point."],
    ["Complete combustion", "Alkane + O₂ → CO₂ + H₂O (C₃H₈ + 5O₂ → 3CO₂ + 4H₂O)."],
    ["Incomplete combustion", "Too little O₂: CO and/or C (soot) form, plus H₂O."],
    ["Substitution", "One H replaced by another atom: CH₄ + Cl₂ → CH₃Cl + HCl (light)."],
    ["Counting products", "Monosubstituted products = number of different H environments."]
  ]
};
