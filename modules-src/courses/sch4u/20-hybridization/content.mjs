// SCH4U 20 Hybridization (sp/sp²/sp³). Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/20-hybridization.md
// The pictures (hero, the Orbital mixer's 3D view, energy diagram and labeller, Part 3 stations, task preview) are drawn by app.js.

// Misconception core sentences (plan §3)
const M1 = "Count electron groups, lone pairs included: water’s O has 4 groups, so it is sp³.";
const M2 = "A double bond is one σ bond plus one π bond. They overlap differently.";
const M3 = "A double or triple bond is one electron group. CO₂’s carbon has 2 groups, so it is sp.";
const M4 = "Mixing n orbitals always gives n hybrids: s + 3p gives four sp³.";
const M5 = "π bonds come from sideways overlap of unhybridized p orbitals, above and below the axis.";
const M6 = "Twisting a C=C breaks the π overlap. That costs a lot of energy, so the bond stays rigid.";
const M7 = "Draw the Lewis structure, count the groups on that atom, then assign.";

// Practice 1 sorter items: [tile, box, why, groups line for the worked-solution hint]
// VERIFY: the sorter "why" lines and worked-solution hints were written for the module (the plan gives the answers only).
const SORT = [
  ["C in CH₄", "sp3", "Four C–H bonds and no lone pairs: 4 groups.", "4 groups: sp³."],
  ["C in CO₂", "sp", "Two double bonds, each one group: 2 groups.", "2 groups (O=C=O): sp."],
  ["C in CH₂O", "sp2", "Two C–H bonds and one C=O: 3 groups.", "3 groups: sp²."],
  ["N in NH₃", "sp3", "Three bonds and one lone pair: 4 groups.", "4 groups (3 bonds + 1 lone pair): sp³."],
  ["B in BF₃", "sp2", "Three B–F bonds and no lone pair: 3 groups.", "3 groups: sp²."],
  ["C in HCN", "sp", "C–H and C≡N: 2 groups.", "2 groups: sp."],
  ["O in H₂O", "sp3", "Two bonds and two lone pairs: 4 groups.", "4 groups (2 bonds + 2 lone pairs): sp³."],
  ["C in C₂H₄", "sp2", "Two C–H bonds and one C=C: 3 groups.", "3 groups: sp²."],
  ["C in C₂H₂", "sp", "One C–H and one C≡C: 2 groups.", "2 groups: sp."],
  ["N in NH₄⁺", "sp3", "Four N–H bonds: 4 groups.", "4 groups: sp³."]
];
const SORT_WRONG = { i2:{ sp3:M3 }, i4:{ sp2:M1, sp:M1 }, i7:{ sp2:M1, sp:M1 }, i5:{ sp3:"Boron has 3 groups and no lone pair." } };

export default {
  id:"20-hybridization",
  kind:"topic",
  title:"Hybridization (sp, sp², sp³)",
  topic:"Hybridization (sp/sp²/sp³)",
  readyTopic:"hybridization",
  hero:{
    eq:"2s + 2p + 2p + 2p → 4 sp³ (109.5°) · double bond = σ + π · triple bond = σ + 2π", eqSize:"sm",
    eqLabel:"2s plus three 2p orbitals give four sp3 hybrid orbitals at 109.5 degrees. A double bond is one sigma plus one pi bond; a triple bond is one sigma plus two pi bonds.",
    headline:"Orbitals mix to match the shape",
    text:"To make four identical bonds, carbon <strong>hybridizes</strong>: its 2s and 2p orbitals blend into equivalent <strong>hybrid orbitals</strong> that point where VSEPR says the bonds go. Head-on overlap makes <strong>σ bonds</strong>; sideways overlap of leftover p orbitals makes <strong>π bonds</strong>, and π bonds lock double bonds in place.",
    fig:{ html:'<div class="hy-hx"><canvas class="hy-hxc" id="hy-hxc" role="img" aria-label="A 2s sphere and three 2p dumbbells sit at different heights on a small energy diagram. They swirl together and level out into four equal teardrop lobes pointing to the corners of a tetrahedron. Four H atoms approach and overlap head-on, and each overlap glows as sigma. Then ethene: two side-by-side p lobes merge above and below the C–C axis, glowing as pi."></canvas><div class="hy-hxrow"><p class="hy-hxctr" id="hy-hxctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="hy-hxreplay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain why carbon forms four equivalent bonds even though its ground state has two unpaired electrons.",
    "I can assign sp, sp² or sp³ hybridization from the number of electron groups.",
    "I can relate each hybridization to its geometry and bond angle.",
    "I can tell σ bonds from π bonds and count both in a molecule.",
    "I can explain why double bonds can’t rotate and how that leads to cis–trans isomers.",
    "I can assign the hybridization of each C, N and O atom in an organic molecule."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Carbon’s configuration", goal:1,
          prompt:"What is the ground-state configuration of carbon?",
          options:[
            { t:"1s² 2s² 2p²", ok:true, why:"6 electrons." },
            { t:"1s² 2s² 2p⁴", why:"That’s oxygen." },
            { t:"1s² 2p⁴", why:"2s fills before 2p." },
            { t:"1s² 2s¹ 2p³", why:"That’s the “promoted” state, not the ground state." }],
          hints:["Z = 6.", "Fill 1s, 2s, then 2p.", "1s² 2s² 2p²."] },
        { id:"w2", skill:"Carbon’s configuration", goal:1,
          prompt:"How many unpaired electrons does a ground-state carbon atom have?",
          options:[
            { t:"2", ok:true, why:"2p² puts one electron in each of two p orbitals (Hund’s rule)." },
            { t:"4", why:"Four bonds, but only 2 unpaired in the ground state." },
            { t:"0", why:"Hund’s rule spreads the two 2p electrons out." },
            { t:"6", why:"That’s the total number of electrons." }],
          hints:["Look at 2p².", "Hund’s rule.", "2."] },
        { id:"w3", skill:"Orbital shapes", goal:4,
          prompt:"What is the shape of a p orbital?",
          options:[
            // VERIFY: the plan gives no feedback line for the correct option; this one was written for the module.
            { t:"Two lobes on opposite sides of the nucleus (a dumbbell)", ok:true, why:"A p orbital is a dumbbell: one lobe on each side of the nucleus." },
            { t:"A sphere", why:"That’s an s orbital." },
            { t:"Four lobes", why:"That’s most d orbitals." },
            { t:"A ring", why:"Orbitals are 3D regions, not rings." }],
          hints:["Recall module 15.", "Two lobes.", "A dumbbell."] },
        { id:"w4", skill:"Orbital shapes", goal:3,
          prompt:"How are the three 2p orbitals arranged?",
          options:[
            // VERIFY: the plan gives no feedback line for the correct option; this one was written for the module.
            { t:"At 90° to each other, along the x, y and z axes", ok:true, why:"One p orbital lies along each axis, so they meet at 90°." },
            { t:"At 120°, in a plane", why:"That’s sp² hybrids." },
            { t:"At 109.5°", why:"That’s sp³ hybrids." },
            { t:"All along one axis", why:"There’s one along each axis." }],
          hints:["p<sub><i>x</i></sub>, p<sub><i>y</i></sub>, p<sub><i>z</i></sub>.", "One per axis.", "90°."] },
        { id:"w5", skill:"Electron groups", goal:2,
          prompt:"How many electron groups surround the N in NH₃?",
          options:[
            { t:"4", ok:true, why:"Three bonds and one lone pair." },
            { t:"3", why:"The lone pair counts." },
            { t:"5", why:"Count groups, not electrons." },
            { t:"2", why:"There are three N–H bonds." }],
          hints:["Lewis structure?", "Three bonds and a lone pair.", "4."] },
        { id:"w6", skill:"Electron groups", goal:3,
          prompt:"How many electron groups surround the C in CO₂?",
          options:[
            { t:"2", ok:true, why:"Two double bonds, each one group." },
            { t:"4", why:"A double bond is one group." },
            { t:"6", why:"Count groups, not bonds." },
            { t:"3", why:"There are no lone pairs on C." }],
          hints:["O=C=O.", "Each double bond points one way.", "2."] }
      ],
      refreshers:{
        "Carbon’s configuration":"1s² 2s² 2p², with two unpaired 2p electrons in the ground state.",
        "Orbital shapes":"s is a sphere; p is a dumbbell, with one along each axis.",
        "Electron groups":"Bonds (single, double or triple each count as 1) plus lone pairs on the atom."
      }
    }
  },
  explore:{
    heading:"Orbital mixer",
    intro:"Mix orbitals, then build bonds from them. Try twisting a double bond and see what happens.",
    how:"Choose a mode. <strong>Mix</strong>: pick s + p, s + 2p or s + 3p, then press Mix. <strong>Bond</strong>: pick a molecule and tap an atom to read it. <strong>Count</strong>: tap a bond, then σ or π (keys S and P); tap an atom, then sp, sp² or sp³ (keys 1, 2, 3). <strong>Build</strong>: make your own molecule. Drag the view or use the arrow keys to turn it.",
    modes:[{ id:"mix", t:"Mix" }, { id:"bond", t:"Bond" }, { id:"count", t:"Count" }, { id:"build", t:"Build" }],
    mixes:[{ id:"1", t:"s + p" }, { id:"2", t:"s + 2p" }, { id:"3", t:"s + 3p" }],
    rule:"n orbitals in → n hybrids out",
    lockedT:"Locked: twisting breaks the π overlap",
    freeT:"Free: σ overlap is unchanged by twisting",
    twistBanner:"Twisting a double bond breaks the π bond. That costs a lot of energy.",
    fb:{ twoSig:M2, piSingle:"Every single bond is σ: head-on overlap along the axis.", noSig:"The first bond of every multiple bond is σ.",
      atom:"count its electron groups, lone pairs included (2 → sp, 3 → sp², 4 → sp³)." },
    buildNote:"H atoms fill in automatically, so the parts bin offers C, N and O. Tap an atom, choose a bond type, then add an atom to it. Tap a bond to change its type.",
    modelNote:"Promotion, then mixing, is a <strong>model</strong> that explains the evidence (four identical C–H bonds in CH₄). It isn’t a series of steps that physically happen.",
    predIntro:"Make a prediction first. Then the Orbital mixer will show you what really happens.",
    predictions:[
      { id:"p1", prompt:"Carbon in Mix mode, before Promote. How many unpaired electrons does ground-state carbon have, and how many bonds does it form in CH₄?",
        options:[{ t:"2 unpaired; 4 bonds", ok:true }, { t:"4 unpaired; 4 bonds" }, { t:"2 unpaired; 2 bonds" }, { t:"0 unpaired; 4 bonds" }],
        explain:"Mixing makes four equal orbitals, each ready for one bond." },
      { id:"p2", prompt:"Ethene in Count mode. How many σ and π bonds does ethene (C₂H₄) have?",
        options:[{ t:"5 σ and 1 π", ok:true }, { t:"6 σ and 0 π" }, { t:"4 σ and 2 π" }, { t:"5 σ and 2 π" }],
        explain:"The double bond is one σ plus one π." },
      { id:"p3", prompt:"Water in Bond mode. What is the hybridization of the O in water?",
        options:[{ t:"sp³", ok:true }, { t:"sp" }, { t:"sp²" }, { t:"Unhybridized" }],
        explain:"Four electron groups, lone pairs included." },
      { id:"p4", prompt:"Ethene in Bond mode, with the twist slider. What happens if one CH₂ end is twisted by 90°?",
        options:[{ t:"The π overlap is lost", ok:true }, { t:"Nothing changes" }, { t:"The σ bond breaks" }, { t:"The molecule becomes linear" }],
        explain:"The p orbitals end up at right angles and can’t overlap sideways." }
    ],
    chalIntro:"Use the Orbital mixer to meet each goal, then press <strong>Check challenge</strong>. Challenges 1 and 2 use <strong>Count</strong> mode; Challenge 3 uses <strong>Build</strong> mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 6], prompt:"Label the hybridization of every atom except H in HCN.",
        why:"C has two groups (C–H and C≡N) and N has two (C≡N and a lone pair), so both are sp.",
        wrongN:"N has one triple bond and one lone pair: 2 groups.", wrongC:"C has two groups: C–H and C≡N.",
        hints:["Draw H–C≡N with a lone pair on N.", "Count groups on each atom.", "Both have 2 groups: sp."] },
      { id:"tc2", goal:4, prompt:"Count the σ and π bonds in propyne (CH≡C–CH₃).",
        why:"4 C–H, the C–C single bond and the σ of C≡C make 6 σ; the triple bond adds 2 π.",
        wrong8:"Each multiple bond has only one σ.", wrong3:"A triple bond has 2 π, and C–C single bonds have none.",
        hints:["Count the C–H bonds: 1 + 3.", "The C–C single bond and the σ in C≡C: 2 more.", "6 σ; the triple bond adds 2 π."] },
      { id:"tc3", goal:[2, 6], stretch:true, prompt:"Build mode (parts bin of C, H, O and N with single, double and triple bonds): make a molecule with the <strong>fewest possible carbon atoms</strong> that contains at least one sp carbon, one sp² carbon and one sp³ carbon.",
        why:"Three carbons is the fewest: one needs only single bonds (sp³), one a double bond (sp²), and one a triple bond or two double bonds (sp), as in CH₃–CH=C=O or CH₃–C(=O)–C≡N.",
        wrongPropyne:"Two sp carbons and one sp³, but no sp². A carbon in a triple bond’s partner is sp too.",
        wrongAcrylo:"sp², sp² and sp, but no sp³.",
        wrongTwo:"Two carbons can’t be all three types.",
        hints:["An sp carbon needs a triple bond or two double bonds.", "If the sp carbon has a triple bond to another carbon, that carbon is sp too, so give it a double bond to O instead, or a triple bond to N.", "CH₃–CH=C=O: sp³, then sp², then sp (two double bonds)."] }
    ],
    blocks:[{ title:"The big idea", html:"<p>The hybridization is just VSEPR in orbital language: count the electron groups (2 → sp, 3 → sp², 4 → sp³) and the hybrids point where the groups go. The leftover p orbitals are where the π bonds come from.</p>" }]
  },
  part3:{
    slug:"organic", name:"Organic molecules", heading:"Hybridization in organic molecules",
    intro:"Unit 1’s structures look different through σ and π bonds. Label atoms on line structures, test which bonds can rotate, and see why benzene is flat.",
    s1:{ title:"Station 1: Label every atom",
      intro:"Tap each C, N and O, then choose sp, sp² or sp³. Press <strong>Check</strong> when every atom in a molecule has a label.",
      mols:[
        { id:"ethanol", name:"Ethanol", smi:"CCO", answer:["sp3", "sp3", "sp3"] },
        { id:"acid", name:"Ethanoic acid", smi:"CC(=O)O", answer:["sp3", "sp2", "sp2", "sp3"] },
        { id:"propanone", name:"Propanone", smi:"CC(=O)C", answer:["sp3", "sp2", "sp2", "sp3"] },
        { id:"nitrile", name:"Ethanenitrile (CH₃CN)", smi:"CC#N", answer:["sp3", "sp", "sp"] }
      ],
      data:"Real bond angles match the hybridization:" },
    s2:{ title:"Station 2: Rigid or free?",
      intro:"Pick a pair, then twist the middle bond of both models with one slider.",
      pairs:[{ id:"but", t:"Butane vs but-2-ene" }, { id:"eth", t:"Ethane vs ethene" }],
      text:"Rotation is free about C–C but locked about C=C, so but-2-ene has cis and trans forms (module 11)." },
    s3:{ title:"Station 3: Flat benzene",
      text:"All six carbons are sp², so every atom lies in one plane. The six leftover p orbitals overlap all around the ring, making a continuous π cloud above and below it (delocalized). That explains benzene’s equal C–C bonds and why it resists addition (module 02)." },
    quickCheck:{
      title:"Quick check", summary:"Organic molecules quick check",
      items:[
        { id:"q1", goal:6, prompt:"Hybridization of the carbonyl C in propanone?",
          choices:[
            { t:"sp²", ok:true, fb:"Right. Three groups: two C–C and one C=O." },
            { t:"sp³", fb:"Three groups: two C–C and one C=O." },
            { t:"sp", fb:"Three groups: two C–C and one C=O." },
            { t:"sp³d", fb:"Three groups: two C–C and one C=O." }] },
        { id:"q2", goal:2, prompt:"Hybridization of the O in the O–H of ethanoic acid?",
          choices:[
            { t:"sp³", ok:true, fb:"Right. Two bonds and two lone pairs: 4 groups." },
            { t:"sp²", fb:"Two bonds and two lone pairs." },
            { t:"sp", fb:"Two bonds and two lone pairs." },
            { t:"Unhybridized", fb:"Two bonds and two lone pairs." }] },
        { id:"q3", goal:5, prompt:"Why does but-2-ene have cis and trans forms but butane doesn’t?",
          choices:[
            { t:"The π bond stops rotation about C=C", ok:true, fb:"Right. " + M6 },
            { t:"Butane has no H", fb:M6 },
            { t:"σ bonds can’t rotate", fb:M6 },
            { t:"But-2-ene is sp³", fb:M6 }] },
        { id:"q4", goal:3, prompt:"Why are all the atoms of benzene in one plane?",
          choices:[
            { t:"Every carbon is sp²", ok:true, fb:"Right. sp² gives flat 120° geometry." },
            { t:"Every carbon is sp³", fb:"sp² gives flat 120° geometry." },
            { t:"It has no π bonds", fb:"sp² gives flat 120° geometry." },
            { t:"Hydrogen forces it flat", fb:"sp² gives flat 120° geometry." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sorter", type:"sorter", title:"Hybridization sorter", summary:"Hybridization sorter", goal:[2, 3], noun:"atom", txt:true,
        instruction:"Sort each atom by its hybridization.",
        boxes:[{ id:"sp", label:"sp", sub:"2 groups, linear" }, { id:"sp2", label:"sp²", sub:"3 groups, trigonal planar" }, { id:"sp3", label:"sp³", sub:"4 groups, tetrahedral" }],
        items:SORT.map((s, i) => {
          const id = "i" + (i + 1);
          const it = { id, t:s[0], answer:s[1], why:s[2], hints:["Count electron groups on that atom.", "2 → sp, 3 → sp², 4 → sp³.", s[3]] };
          if (SORT_WRONG[id]) it.wrong = SORT_WRONG[id];
          return it;
        }),
        wrongDefault:"Count electron groups on that atom: 2 → sp, 3 → sp², 4 → sp³." },
      { id:"count", type:"custom", title:"Count the σ and π bonds", summary:"Count the σ and π bonds", star:true, goal:[1, 4],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type the number of σ bonds and π bonds, or tap a choice, then press Check.",
        items:[
          { id:"c1", kind:"sp", goal:4, prompt:"Ethyne, C₂H₂", answer:[3, 2],
            wrong:[{ s:5, fb:M2 }], fb:"Every single bond is σ, and each multiple bond has exactly one σ; the rest are π.",
            // VERIFY: hints for C1, C2, C4 and C6 were written for the module (the plan gives hints for C3 and C5 only).
            hints:["H–C≡C–H: count the C–H bonds first.", "2 C–H plus the σ in C≡C.", "3 σ and 2 π."] },
          { id:"c2", kind:"sp", goal:4, prompt:"CO₂", answer:[2, 2],
            wrong:[{ s:4, fb:M2 }], fb:"Each C=O is one σ plus one π.",
            hints:["O=C=O: two double bonds.", "Each double bond is σ + π.", "2 σ and 2 π."] },
          { id:"c3", kind:"sp", star:true, goal:4, prompt:"Propene, CH₂=CH–CH₃", answer:[8, 1],
            wrong:[{ s:9, fb:"Only one σ in the C=C." }], fb:"Count the C–H bonds, then the C–C bonds; the double bond adds one π.",
            hints:["Count the C–H bonds: 2 + 1 + 3 = 6.", "C–C single 1, C=C σ 1.", "8 σ and 1 π."] },
          { id:"c4", kind:"sp", star:true, goal:4, prompt:"Ethanoic acid, CH₃COOH", answer:[7, 1],
            fb:"C–H 3, C–C 1, C=O σ 1, C–O 1, O–H 1.",
            hints:["Draw CH₃–C(=O)–O–H.", "Every bond gives one σ; only the C=O adds a π.", "7 σ and 1 π."] },
          { id:"c5", kind:"sp", star:true, goal:4, prompt:"Benzene, C₆H₆ (one Kekulé structure)", answer:[12, 3],
            fb:"6 C–H and 6 C–C σ; three π (shared around the ring).",
            hints:["Six C–H.", "Six C–C σ around the ring.", "Three π in a Kekulé drawing."] },
          { id:"c6", kind:"pick", star:true, goal:1, prompt:"<strong>Investigation:</strong> All four C–H bonds in methane have the same length and bond energy. Which model explains this: bonds from one 2s and three 2p orbitals, or bonds from four sp³ orbitals?",
            options:[
              { t:"Bonds from four sp³ orbitals", ok:true, why:"Four equivalent hybrids give four identical C–H bonds, matching the evidence." },
              { t:"Bonds from one 2s and three 2p orbitals", why:"Unmixed orbitals would make one bond different from the other three; the evidence shows four identical bonds." }],
            hints:["What does the evidence say about the four bonds?", "Would a bond made from 2s match bonds made from 2p?", "Four sp³ orbitals: four identical bonds."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Kamal", how:"", goal:[2, 4, 6],
        instruction:"Kamal made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Find the hybridization of the O in water.",
            steps:["Water’s Lewis structure: two O–H bonds and two lone pairs on O.", "O is bonded to 2 atoms, so it has 2 electron groups.", "2 groups means sp.", "So water is linear."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows the earlier mistake."],
            fixes:[
              { t:"Lone pairs count: 4 groups, so O is sp³, and water is bent at ≈ 104.5°.", ok:true, why:M1 },
              { t:"3 groups: sp².", why:"Two bonds plus two lone pairs is 4." },
              { t:"O isn’t hybridized.", why:"The model applies to O too." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["Did you count the lone pairs?", "Two of them.", "sp³."] },
          { id:"e2", goal:4, task:"Count the σ and π bonds in ethene.",
            steps:["Ethene has four C–H bonds and one C=C.", "Each C–H is a σ bond: 4 σ.", "The C=C is two σ bonds: 2 more σ.", "Total: 6 σ and 0 π."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The C=C is one σ plus one π: 5 σ and 1 π in total.", ok:true, why:M2 },
              { t:"The C=C is two π bonds.", why:"The first bond is always σ." },
              { t:"C–H bonds are π.", why:"Single bonds are σ." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Can two bonds both lie along the same axis?", "No: the second overlaps sideways.", "σ + π."] },
          { id:"e3", goal:6, task:"Find the hybridization of the C in CO₂.",
            steps:["Lewis structure: O=C=O, with no lone pairs on C.", "Each double bond counts as 2 electron groups, so C has 4.", "4 groups: sp³."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"Each double bond is one group, so C has 2 groups: sp, linear, 180°.", ok:true, why:M3 },
              { t:"3 groups: sp².", why:"There are only two bonding directions." },
              { t:"Count the O lone pairs too.", why:"Only groups on C count." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["How many directions do C’s bonds point?", "Two.", "sp."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: carbon having only two unpaired electrons, or the π overlap vanishing when you twisted ethene?" },
      { id:"j2", q:"In your own words, how does hybridization connect to VSEPR?" },
      { id:"j3", q:"Explain to a friend how to count σ and π bonds in any molecule." },
      { id:"j4", q:"Which part still feels uncertain: assigning hybridization, picturing π bonds, or counting? What will you do?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"What geometry and bond angle go with sp² hybrid orbitals?", options:[
          { t:"Trigonal planar, 120°", ok:true, why:"Three sp² hybrids lie in a plane, 120° apart." },
          { t:"Tetrahedral, 109.5°", why:"That’s sp³." },
          { t:"Linear, 180°", why:"That’s sp." },
          { t:"Trigonal pyramidal, ≈ 107°", why:"That’s an sp³ atom with a lone pair." }] },
        b:{ prompt:"What geometry and bond angle go with sp hybrid orbitals?", options:[
          { t:"Linear, 180°", ok:true, why:"Two sp hybrids point in opposite directions." },
          { t:"Trigonal planar, 120°", why:"That’s sp²." },
          { t:"Tetrahedral, 109.5°", why:"That’s sp³." },
          { t:"Bent, ≈ 104.5°", why:"That’s an sp³ atom with two lone pairs." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"A triple bond contains…", options:[
          { t:"1 σ bond and 2 π bonds", ok:true, why:"The first bond is σ; the other two are π." },
          { t:"3 σ bonds", why:"Only one bond can lie along the axis: a triple bond is one σ plus two π. They overlap differently." },
          { t:"2 σ bonds and 1 π bond", why:"Only the first bond is σ." },
          { t:"3 π bonds", why:"The first bond is always σ." }] },
        b:{ prompt:"A double bond contains…", options:[
          { t:"1 σ bond and 1 π bond", ok:true, why:"The first bond is σ; the second is π." },
          { t:"2 σ bonds", why:M2 },
          { t:"2 π bonds", why:"The first bond is always σ. " + M5 },
          { t:"1 σ bond and 2 π bonds", why:"That’s a triple bond." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"What is the hybridization of N in NH₃?", options:[
          { t:"sp³", ok:true, why:"Three bonds and one lone pair: 4 groups." },
          { t:"sp²", why:"The lone pair counts." },
          { t:"sp", why:"Count electron groups, lone pairs included: NH₃’s N has 4 groups, so it is sp³." },
          { t:"Unhybridized", why:"The model applies." }] },
        b:{ prompt:"What is the hybridization of B in BF₃?", options:[
          { t:"sp²", ok:true, why:"Three groups, no lone pair." },
          { t:"sp³", why:"Boron has only 3 groups." },
          { t:"sp", why:"That would need 2 groups." },
          { t:"Unhybridized", why:"The model applies." }] } },
      { id:"t1", cat:"T", goal:6,
        a:{ prompt:"What is the hybridization of each carbon in propene, CH₂=CH–CH₃, from left to right?", options:[
          { t:"sp², sp², sp³", ok:true, why:"Both C=C carbons have 3 groups; the CH₃ carbon has 4." },
          { t:"sp³, sp³, sp³", why:"The double-bonded carbons have 3 groups." },
          { t:"sp², sp², sp²", why:"CH₃ has four single bonds." },
          { t:"sp, sp, sp³", why:"A double bond gives sp², not sp." }] },
        b:{ prompt:"What is the hybridization of each carbon in propyne, CH≡C–CH₃, from left to right?", options:[
          { t:"sp, sp, sp³", ok:true, why:"Each carbon of the triple bond has 2 groups; CH₃ has 4." },
          { t:"sp², sp², sp³", why:"Triple-bonded carbons are sp." },
          { t:"sp, sp, sp", why:"CH₃ is sp³." },
          { t:"sp³, sp³, sp³", why:"A triple bond is one electron group, so each triple-bonded carbon has only 2 groups." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"How many σ and π bonds are there in ethanenitrile, CH₃CN?", options:[
          { t:"5 σ and 2 π", ok:true, why:"3 C–H, 1 C–C, and the σ of C≡N; 2 π." },
          { t:"7 σ and 0 π", why:"A triple bond has only one σ." },
          { t:"4 σ and 2 π", why:"Count all three C–H bonds." },
          { t:"5 σ and 3 π", why:"A triple bond has 2 π." }] },
        b:{ prompt:"How many σ and π bonds are there in propanone, CH₃COCH₃?", options:[
          { t:"9 σ and 1 π", ok:true, why:"6 C–H, 2 C–C, and the σ of C=O; 1 π." },
          { t:"10 σ and 0 π", why:M2 },
          { t:"8 σ and 1 π", why:"There are six C–H bonds." },
          { t:"9 σ and 2 π", why:"One double bond means one π." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Why does but-2-ene have cis and trans isomers while butane does not?", options:[
          { t:"The π bond in C=C stops rotation, so groups keep their sides; butane’s single bonds rotate freely", ok:true, why:M6 },
          { t:"Butane has no hydrogen atoms", why:"Butane has 10." },
          { t:"σ bonds can’t rotate", why:"σ bonds rotate freely; π bonds lock." },
          { t:"But-2-ene’s carbons are sp³", why:"The C=C carbons are sp²." }] },
        b:{ prompt:"Why can’t the two CH₂ groups of ethene twist relative to each other?", options:[
          { t:"Twisting would destroy the sideways p–p overlap of the π bond", ok:true, why:M6 },
          { t:"The σ bond is too short", why:"The σ bond alone would allow rotation." },
          { t:"The hydrogen atoms collide", why:"They are far apart." },
          { t:"Ethene’s carbons are sp³", why:"They’re sp²." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of methane’s four identical C–H bonds?", options:[
          { t:"“Carbon’s 2s and three 2p orbitals mix into four equivalent sp³ orbitals; each overlaps with an H 1s orbital to form a σ bond.”", ok:true, why:"It explains why all four bonds are the same: four equivalent hybrids, each making a σ bond." },
          { t:"“Carbon’s three 2p orbitals form three bonds, and the 2s forms a weaker fourth.”", why:"The evidence shows four identical bonds." },
          { t:"“Carbon has four unpaired electrons in its ground state.”", why:"It has 2 in its ground state." },
          { t:"“Mixing turns four orbitals into two stronger ones.”", why:"Four in, four out." }] },
        b:{ prompt:"Which is the best explanation of why BF₃ is flat with 120° angles?", options:[
          { t:"“Boron’s 2s and two 2p orbitals mix into three equivalent sp² orbitals in a plane, each forming a σ bond with F.”", ok:true, why:"Three sp² hybrids lie in a plane at 120°, so the three B–F bonds do too." },
          { t:"“Boron uses three unmixed p orbitals.”", why:"Those would be at 90°." },
          { t:"“Boron’s lone pair pushes the bonds flat.”", why:"Boron has no lone pair." },
          { t:"“Mixing gives two sp hybrids.”", why:"Three orbitals in, three out." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which description of a π bond is correct?", options:[
          { t:"“Sideways overlap of unhybridized p orbitals, with electron density above and below the bond axis”", ok:true, why:M5 },
          { t:"“Head-on overlap along the bond axis.”", why:"That’s a σ bond." },
          { t:"“Overlap of two sp³ hybrid orbitals.”", why:M5 },
          { t:"“A bond made between two lone pairs.”", why:"π bonds share one pair from p orbitals." }] },
        b:{ prompt:"Which description of a σ bond is correct?", options:[
          { t:"“Head-on overlap of orbitals along the line between the two nuclei”", ok:true, why:"σ overlap lies along the bond axis." },
          { t:"“Sideways overlap above and below the axis.”", why:"That’s π." },
          { t:"“Only found in double bonds.”", why:"Every single bond is σ." },
          { t:"“Made only from unhybridized p orbitals.”", why:"σ bonds often use hybrid orbitals." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Ethyne (acetylene) is the fuel in oxy-acetylene welding torches. What are its carbons’ hybridization and its H–C–C angle?", options:[
          { t:"sp; 180°", ok:true, why:"Each carbon has 2 groups: linear." },
          { t:"sp²; 120°", why:"Triple-bonded carbons have 2 groups." },
          { t:"sp³; 109.5°", why:"A triple bond is one electron group, so each carbon has 2 groups: sp." },
          { t:"sp; 120°", why:"sp gives 180°." }] },
        b:{ prompt:"Ethene is the raw material for polyethylene. What are its carbons’ hybridization and its H–C–H angle?", options:[
          { t:"sp²; about 120°", ok:true, why:"Each carbon has 3 groups: trigonal planar." },
          { t:"sp; 180°", why:"Double-bonded carbons have 3 groups." },
          { t:"sp³; 109.5°", why:"A double bond is one electron group, so each carbon has 3 groups: sp²." },
          { t:"sp²; 109.5°", why:"sp² gives about 120°." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Vanillin (vanilla flavour, module 04) has an aldehyde group (–CHO) and a methoxy group (–OCH₃). What are the hybridizations of the aldehyde carbon and the methoxy CH₃ carbon?", options:[
          { t:"sp² and sp³", ok:true, why:"The C=O carbon has 3 groups; CH₃ has 4." },
          { t:"sp³ and sp³", why:"Draw the C=O." },
          { t:"sp² and sp²", why:"CH₃ has four single bonds." },
          { t:"sp and sp³", why:"A double bond gives sp²." }] },
        b:{ prompt:"In ethyl ethanoate (a fruity ester, CH₃COOCH₂CH₃), what are the hybridizations of the carbonyl carbon and the CH₂ carbon?", options:[
          { t:"sp² and sp³", ok:true, why:"The C=O carbon has 3 groups; CH₂ has 4." },
          { t:"sp³ and sp³", why:M7 },
          { t:"sp² and sp²", why:"CH₂ has four single bonds." },
          { t:"sp and sp³", why:"A double bond is one electron group, so the C=O carbon has 3 groups: sp²." }] } }
    ]
  },
  task:{
    title:"sp, sp³ and two π bonds", summary:"sp, sp³ and two π bonds",
    statement:"<p>Build a four-carbon chain by choosing the bond between each pair of neighbouring carbons. Hydrogens fill in automatically. Meet every condition. Can you find all the answers?</p><ol class=\"hy-conds\"><li>At least one carbon is sp³.</li><li>At least one carbon is sp.</li><li>The molecule has exactly 2 π bonds.</li></ol>",
    checks:["An sp³ carbon", "An sp carbon", "Exactly 2 π bonds"],
    tips:["An sp³ carbon needs all single bonds, so leave a single bond at one end.", "sp needs a triple bond, or two double bonds on the same carbon.", "Each double bond adds 1 π and each triple bond adds 2."],
    answers:{ "3,1,1":"But-1-yne, CH≡C–CH₂–CH₃", "1,3,1":"But-2-yne, CH₃–C≡C–CH₃", "2,2,1":"Buta-1,2-diene, CH₂=C=CH–CH₃" },
    explainPrompt:"Explain how each bond choice decided the hybridization of the carbons on either side, and how you reached exactly two π bonds.",
    vocab:"Use the words hybridization, electron groups, σ bond and π bond.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"One triple bond, or two double bonds sharing a carbon, both give 2 π and an sp carbon. A single bond at the end gives the sp³."
  },
  cards:[
    ["Hybridization", "Mixing atomic orbitals on one atom into equivalent hybrid orbitals."],
    ["Orbitals in, orbitals out", "n atomic orbitals mix into n hybrid orbitals."],
    ["sp³", "s + 3p → 4 hybrids, tetrahedral, 109.5° (4 electron groups)."],
    ["sp²", "s + 2p → 3 hybrids, trigonal planar, 120°, one p left over."],
    ["sp", "s + p → 2 hybrids, linear, 180°, two p left over."],
    ["Assigning hybridization", "Count electron groups on the atom (lone pairs count; multiple bonds count once)."],
    ["σ bond", "Head-on overlap along the axis; every single bond."],
    ["π bond", "Sideways overlap of unhybridized p orbitals above and below the axis."],
    ["Double and triple bonds", "Double = σ + π; triple = σ + 2π."],
    ["Rigid C=C", "Twisting breaks the π overlap, so C=C doesn’t rotate; this gives cis and trans isomers."],
    ["Benzene", "Six sp² carbons; a ring of delocalized π electrons above and below a flat ring."],
    ["Carbon’s puzzle", "The ground state has 2 unpaired electrons, but CH₄ has four identical bonds: sp³ explains it."]
  ]
};
