// SCH4U 12 Chirality, Enantiomers and Diastereomers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/12-chirality.md
// Group ids (app.js catalogue): H, CH3, C2H5, C3H7 (propyl), OH, Cl, Br, NH2, COOH, CH2OH, OCH3. Slots: w (wedge), d (dash),
// l (left), r (right). Structures for "Find the chiral centres" are SMILES strings drawn by app.js (C1 view).

// Misconception core sentences (plan §3)
const M1 = "Compare the whole groups. Two C₂H₅ groups are identical however they’re drawn.";
const M2 = "Every molecule has a mirror image. It’s a different molecule only if it can’t be rotated onto the original.";
const M3 = "Enantiomers have identical physical properties. They differ only toward polarized light and other chiral things.";
const M4 = "Equal amounts rotate equally in opposite directions, so the rotations cancel: 0°.";
const M5 = "Enantiomers are mirror images. If only some chiral centres differ, they’re diastereomers.";
const M6 = "Each centre doubles the count: 2, 4, 8, …";
const M7 = "A chiral centre has four groups on four single bonds. A double-bonded carbon has only three groups.";

export default {
  id:"12-chirality",
  kind:"topic",
  title:"Chirality, enantiomers and diastereomers",
  topic:"Chirality, Enantiomers and Diastereomers",
  readyTopic:"chirality",
  hero:{
    eq:'<span class="ml-eq">CH₃–C<span class="ml-star">*</span>H(<span class="ml-o">OH</span>)–CH₂CH₃</span>', eqSize:"sm",
    eqLabel:"butan-2-ol, C H 3, C star H, O H, C H 2 C H 3, with the chiral centre starred",
    headline:"Some molecules come in left and right hands",
    text:"A carbon with <strong>four different groups</strong> is a <strong>chiral centre</strong>. Its molecule and its mirror image are <strong>enantiomers</strong>: alike in almost every way, but no more superimposable than your two hands. They rotate polarized light in opposite directions, and they can smell, taste or act differently in your body.",
    fig:{ html:'<div class="ml-hx"><div id="ml-hx-svg"></div><div class="ml-hx-row"><p class="ml-hx-cap" id="ml-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ml-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can find the chiral centres in a structure by checking for four different groups.",
    "I can explain what makes a molecule chiral, using mirror images and superimposition.",
    "I can tell enantiomers from diastereomers and count the possible stereoisomers.",
    "I can describe how enantiomers differ (optical activity) and how they are the same (most physical properties).",
    "I can explain why handedness matters in taste, smell and medicine."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Tetrahedral carbon", goal:2,
          prompt:"A carbon with four single bonds arranges them in which shape?",
          options:[
            { t:"Tetrahedral, about 109.5° apart", ok:true, why:"Four groups spread out in 3D." },
            { t:"Square planar, 90° apart", why:"The drawing is flat; the molecule isn’t." },
            { t:"Trigonal planar, 120°", why:"That’s three groups." },
            { t:"Linear, 180°", why:"That’s two groups." }],
          hints:["Four groups, as far apart as possible in 3D.", "Think of a tripod with one leg pointing up.", "Tetrahedral, 109.5°."] },
        { id:"w2", skill:"Tetrahedral carbon", goal:2,
          prompt:"In a wedge-and-dash drawing, what does a solid wedge mean?",
          options:[
            { t:"The bond points toward you", ok:true, why:"Solid wedges come toward you; dashed wedges go away." },
            { t:"The bond points away from you", why:"That’s a dashed wedge." },
            { t:"A double bond", why:"Double bonds are two lines." },
            { t:"A stronger bond", why:"Wedges show direction, not strength." }],
          hints:["Wedges show 3D direction.", "Solid vs dashed.", "Solid = toward you."] },
        { id:"w3", skill:"Identical groups", goal:1,
          prompt:"In CH₃CH₂CH(CH₃)CH₂CH₃, what four groups are on the third carbon?",
          options:[
            { t:"H, CH₃, C₂H₅, C₂H₅", ok:true, why:"The chain continues as an ethyl group on each side." },
            { t:"H, CH₃, CH₂, CH₂", why:"Compare whole groups, not just the first atom." },
            { t:"H, CH₃, C₂H₅, C₃H₇", why:"Count each side: 2 carbons left, 2 right." },
            { t:"CH₃, CH₃, C₂H₅, H", why:"Only one CH₃ branch." }],
          hints:["Walk outward along each bond from C3.", "Left: CH₂CH₃. Right: CH₂CH₃.", "H, CH₃, C₂H₅, C₂H₅."] },
        { id:"w4", skill:"Identical groups", goal:1,
          prompt:"Which carbon in CH₃CH(OH)CH₂CH₃ has four different groups?",
          options:[
            { t:"C2", ok:true, why:"H, OH, CH₃ and C₂H₅." },
            { t:"C1", why:"C1 has three H atoms." },
            { t:"C3", why:"C3 has two H atoms." },
            { t:"None", why:"C2 qualifies." }],
          hints:["List the groups on each carbon.", "C2: H, OH, CH₃, CH₂CH₃.", "C2."] },
        { id:"w5", skill:"Stereoisomer types", goal:3,
          prompt:"Cis- and trans-but-2-ene are…",
          options:[
            { t:"Stereoisomers", ok:true, why:"Same connections, different arrangement." },
            { t:"Structural isomers", why:"The atoms are joined in the same order." },
            { t:"The same compound", why:"The C=C can’t rotate." },
            { t:"Not isomers", why:"Both are C₄H₈." }],
          hints:["Same order of atoms?", "Yes, but a different shape.", "Stereoisomers."] },
        { id:"w6", skill:"Stereoisomer types", goal:3,
          prompt:"Which is true of every pair of stereoisomers?",
          options:[
            { t:"Same molecular formula and same connections", ok:true, why:"Only the 3D arrangement differs." },
            { t:"Same boiling point", why:"Cis and trans boil differently." },
            { t:"Mirror images", why:"Cis and trans aren’t mirror images." },
            { t:"Different formulas", why:"Isomers share a formula." }],
          hints:["What makes isomers ‘stereo’?", "Only the 3D arrangement differs.", "Same formula, same connections."] }
      ],
      refreshers:{
        "Tetrahedral carbon":"Four single bonds point to the corners of a tetrahedron (109.5°). Wedges come toward you; dashes go away.",
        "Identical groups":"To compare groups on a carbon, walk out along each branch to its end. Two branches match only if they’re the same all the way.",
        "Stereoisomer types":"Stereoisomers have the same connections in different arrangements. Cis–trans isomers are one kind; mirror-image isomers are another."
      }
    }
  },
  explore:{
    heading:"Mirror lab",
    intro:"Build a carbon with four groups, reflect it, and try to make the reflection sit exactly on the original.",
    how:"Tap a slot on the model (or Tab to it and press Enter), then choose a group from the palette. Turn the model with the arrow keys, the turn buttons or by dragging it.",
    modes:[{ id:"one", t:"One centre" }, { id:"two", t:"Two centres" }, { id:"pol", t:"Polarimeter" }],
    start:{ w:"OH", d:"H", l:"CH3", r:"C2H5" },
    polNote:"<strong>Polarimeter model:</strong> a pure sample rotates the plane of polarized light by 40° in this tube (a model value, not data for a real compound). The rotation is proportional to the excess of one enantiomer: net rotation = 40° × (% (+) − % (−)) ÷ 100.",
    twoNote:"Each chiral centre has two forms, A and B. Tap two cards, then say how they’re related.",
    rules:{ m1:M1, m2:M2, m3:M3, m4:M4, m5:M5, m6:M6, m7:M7 },
    predictions:[
      { id:"p1", g:{ w:"OH", d:"H", l:"CH3", r:"CH3" },
        prompt:"One centre with H, OH, CH₃, CH₃ (propan-2-ol). Reflect it and try to superimpose. Will the mirror image match?",
        options:[{ t:"Yes, it matches", ok:true }, { t:"No: it’s an enantiomer" }, { t:"Only if you break a bond" }, { t:"It has no mirror image" }],
        explain:"Two identical CH₃ groups: the molecule isn’t chiral. " + M2 },
      { id:"p2", g:{ w:"OH", d:"H", l:"CH3", r:"C2H5" },
        prompt:"One centre with H, OH, CH₃, C₂H₅ (butan-2-ol). Will this mirror image match?",
        options:[{ t:"No: it’s a different molecule", ok:true }, { t:"Yes" }, { t:"Yes, after two rotations" }, { t:"Only at low temperature" }],
        explain:"Four different groups: chiral. The two forms are enantiomers." },
      { id:"p3", g:{ w:"OH", d:"H", l:"CH3", r:"C2H5" },
        prompt:"Swap the OH and CH₃ on butan-2-ol. What do you get?",
        options:[{ t:"Its enantiomer", ok:true }, { t:"The same molecule" }, { t:"A structural isomer" }, { t:"A diastereomer" }],
        explain:"Swapping any two groups on a chiral centre inverts it." },
      { id:"p4", pct:50,
        prompt:"Polarimeter, 50% (+). What rotation will a 50 : 50 mixture show?",
        options:[{ t:"0°", ok:true }, { t:"+20°" }, { t:"+40°" }, { t:"−40°" }],
        explain:"A racemic mixture: the rotations cancel. " + M4 }
    ],
    chalIntro:"Use the mirror lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Build a <strong>chiral</strong> molecule with formula C₄H₉Cl.",
        why:"2-chlorobutane: H, Cl, CH₃ and C₂H₅ are four different groups, and 1 + 1 + 2 = 4 carbons gives C₄H₉Cl. Either enantiomer counts.",
        twoH:"Two H atoms: not chiral.", threeMe:"Three identical CH₃ groups.", c5:"That’s C₅H₁₁Cl.",
        hints:["Cl and H take two slots; the other two must hold three carbons and differ.", "1 + 2 = 3 carbons.", "H, Cl, CH₃ and C₂H₅: 2-chlorobutane."] },
      { id:"tc2", goal:4, prompt:"Polarimeter mode: make the reading <strong>−20°</strong>.",
        why:"25% (+) and 75% (−): a 50% excess of (−), so 40° × (25 − 75) ÷ 100 = −20°.",
        p75:"That gives +20°: wrong direction.", p50:"Racemic: 0°.", p20:"That gives 40 × (20 − 80) ÷ 100 = −24°.",
        hints:["Pure (−) gives −40°. You want half of that.", "The excess of (−) over (+) must be 50%.", "75% (−) and 25% (+)."] },
      { id:"tc3", goal:3, stretch:true,
        prompt:"Two-centre mode, 3-chlorobutan-2-ol: tap a pair of <strong>enantiomers</strong>, then a pair of <strong>diastereomers</strong>. Then switch to 2,3-dichlorobutane and find the arrangement that is identical to its own mirror image.",
        why:"Enantiomers differ at every centre (AA/BB, AB/BA); diastereomers differ at only some (AA/AB). In 2,3-dichlorobutane, AB has an internal mirror plane, so it is identical to BA: meso. That’s 3 stereoisomers, not 4.",
        calledEn:"Only one centre differs: diastereomers.", mesoAA:"AA’s mirror image is BB, a different molecule.", mesoBB:"BB’s mirror image is AA, a different molecule.",
        hints:["Mirror images differ at <strong>every</strong> centre.", "In 2,3-dichlorobutane both ends are the same (CH₃ and Cl at each centre).", "AB has an internal mirror plane, so it’s identical to BA: meso. That’s 3 stereoisomers, not 4."] }
    ],
    blocks:[{ title:"What the mirror lab shows", html:"<p>Four different groups give handedness; any repeat removes it. Enantiomers are invisible to most measurements, but they show up in a polarimeter and in a chiral receptor.</p>" }]
  },
  part3:{
    slug:"handedness", name:"Handedness", heading:"Handedness in taste and medicine",
    intro:"Why does handedness matter outside the textbook? Visit three stations: a receptor site that works like a glove, two smells with one formula, and medicines.",
    s1:{ title:"Station 1: The glove test",
      intro:"This receptor site has three shaped pockets (for OH, CH₃ and C₂H₅) and a flat wall where H sits. Move each enantiomer of butan-2-ol in, then turn it and tip it to find its best fit.",
      caption:"A chiral site tells enantiomers apart, just as a glove tells hands apart.",
      zoom:"Zoom to the molecules",
      zoomHTML:"<p>Look at the fit from the flat wall, with H pointing at you. In one enantiomer, OH → CH₃ → C₂H₅ run clockwise, matching the pockets. In its mirror image they run anticlockwise, so no turn can put all three in place: at best two groups sit in their pockets and the other two trade places.</p><p>That’s <strong>three-point contact</strong>. With only one or two contact points, both enantiomers could fit; it takes three to tell a left hand from a right hand.</p>" },
    s2:{ title:"Station 2: Two smells, one formula",
      intro:"Carvone comes in two mirror-image forms. One smells of spearmint; the other smells of caraway (the seed in rye bread). Read the data, then mark each property “the same” or “differ”.",
      // VERIFY: (R)-(−)-carvone is the spearmint form and (S)-(+)-carvone the caraway form; app.js draws the spearmint form with
      // the isopropenyl wedge on the lower-left ring carbon (R). Comparisons use relative wording only (plan §6, risk 4).
      cols:["Property", "Carvone from spearmint oil", "Carvone from caraway seed"],
      rows:[
        { id:"f", p:"Molecular formula", a:"C₁₀H₁₄O", b:"C₁₀H₁₄O", answer:"same", fb:"Isomers share a formula." },
        { id:"bp", p:"Boiling point", a:"the same value", b:"the same value", answer:"same", fb:M3 },
        { id:"d", p:"Density", a:"the same value", b:"the same value", answer:"same", fb:M3 },
        { id:"pol", p:"Polarimeter reading", a:"(−): turns the plane anticlockwise", b:"(+): turns the plane clockwise by the same angle", answer:"differ", fb:"Enantiomers rotate light in opposite directions." },
        { id:"sm", p:"Smell", a:"spearmint", b:"caraway", answer:"differ", fb:"Their physical properties match; only a chiral partner tells them apart." }],
      done:"Everything matches except the polarimeter reading and the smell: the two places where a chiral partner (polarized light or a smell receptor) is involved." },
    s3:{ title:"Station 3: Medicines",
      // VERIFY: the pain-reliever statement (sold as racemic mixtures; one enantiomer binds the target enzyme well; the body converts
      // part of the other form for some of them) and the history card's dates and Canada's involvement (plan §6, risk 3).
      cards:[
        { t:"Pain relievers", html:"Many common pain relievers are sold as racemic mixtures, but only one enantiomer binds the target enzyme well. For some, the body converts part of the other form." },
        { t:"History card", html:"In the late 1950s and early 1960s a sedative given in pregnancy caused serious birth defects, including in Canada. One enantiomer was linked to the harm, but in the body the two forms interconvert, so a “pure” dose would not have stayed pure. Drug testing rules changed worldwide as a result." }],
      stse:"Why do regulators now ask for each enantiomer to be tested?",
      stseNote:"Your answer saves on this device. It isn’t marked here; bring it to class." },
    quickCheck:{
      title:"Handedness quick check", summary:"Handedness quick check",
      items:[
        { id:"q1", goal:5, prompt:"Why do the two carvones smell different?",
          choices:[
            { t:"Smell receptors are chiral", ok:true, fb:"Right. Their physical properties match; only a chiral partner tells them apart." },
            { t:"They boil differently", fb:"Their physical properties match; only a chiral partner tells them apart." },
            { t:"Different formulas", fb:"Their physical properties match; only a chiral partner tells them apart." },
            { t:"One is ionic", fb:"Their physical properties match; only a chiral partner tells them apart." }] },
        { id:"q2", goal:4, prompt:"Which measurement tells the two carvones apart?",
          choices:[
            { t:"Polarimeter reading", ok:true, fb:"Right. Enantiomers rotate light in opposite directions." },
            { t:"Boiling point", fb:"Enantiomers rotate light in opposite directions." },
            { t:"Density", fb:"Enantiomers rotate light in opposite directions." },
            { t:"Mass", fb:"Enantiomers rotate light in opposite directions." }] },
        { id:"q3", goal:5, prompt:"In the glove test, how many pockets must match for a site to ‘tell hands apart’?",
          choices:[
            { t:"3", ok:true, fb:"Right. With three contact points, only one enantiomer can match all three." },
            { t:"1", fb:"With three contact points, only one enantiomer can match all three." },
            { t:"2", fb:"With three contact points, only one enantiomer can match all three." },
            { t:"4", fb:"With three contact points, only one enantiomer can match all three." }] },
        { id:"q4", goal:5, prompt:"Why might a drug sold as one pure enantiomer still become a mixture in the body?",
          choices:[
            { t:"The forms can interconvert", ok:true, fb:"Right. Some chiral centres flip under body conditions." },
            { t:"Enantiomers are unstable solids", fb:"Some chiral centres flip under body conditions." },
            { t:"The body adds a chiral centre", fb:"Some chiral centres flip under body conditions." },
            { t:"Mixtures form in the bottle", fb:"Some chiral centres flip under body conditions." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"centres", type:"custom", title:"Find the chiral centres", summary:"Find the chiral centres", goal:1,
        instruction:"Tap every chiral centre, then press Done. If there are none, press None.",
        how:"Tap a carbon to star it (tap again to remove the star). Grey numbers are the carbon numbers. Use Next and Previous to move between structures.",
        hintsAll:["List the four groups on each carbon.", "Ignore carbons with 2 or 3 H atoms and any double-bonded carbon."],
        items:[
          { id:"c1", name:"butan-2-ol", cf:"CH₃CH(OH)CH₂CH₃", smi:"CC(O)CC", locs:[1, 2, null, 3, 4], answer:[1],
            reason:"C2: H, OH, CH₃ and C₂H₅ are all different." },
          { id:"c2", name:"propan-2-ol", cf:"CH₃CH(OH)CH₃", smi:"CC(O)C", locs:[1, 2, null, 3], answer:[],
            tap:{ "1":"Two CH₃ groups." },
            reason:"None. C2 has two CH₃ groups, and C1 and C3 have three H atoms." },
          { id:"c3", name:"3-methylpentane", cf:"CH₃CH₂CH(CH₃)CH₂CH₃", smi:"CCC(C)CC", locs:[1, 2, 3, null, 4, 5], answer:[],
            tap:{ "2":"Two C₂H₅ groups. " + M1 },
            reason:"None. C3 has two C₂H₅ groups, and every other carbon has two or three H atoms." },
          { id:"c4", name:"3-methylhexane", cf:"CH₃CH₂CH(CH₃)CH₂CH₂CH₃", smi:"CCC(C)CCC", locs:[1, 2, 3, null, 4, 5, 6], answer:[2],
            miss:{ "2":"C3 has H, CH₃, C₂H₅ and C₃H₇: all different." },
            reason:"C3: H, CH₃, C₂H₅ and C₃H₇ are all different." },
          { id:"c5", name:"2-aminopropanoic acid (alanine)", cf:"CH₃CH(NH₂)COOH", smi:"CC(N)C(=O)O", locs:[3, 2, null, 1, null, null], answer:[1],
            reason:"C2: H, NH₂, CH₃ and COOH are all different. C1, the COOH carbon, has a C=O." },
          { id:"c6", name:"aminoethanoic acid (glycine)", cf:"H₂NCH₂COOH", smi:"NCC(=O)O", locs:[null, 2, 1, null, null], answer:[],
            tap:{ "1":"Two H atoms on the carbon." },
            reason:"None. The CH₂ carbon has two H atoms, and the COOH carbon has a C=O." },
          { id:"c7", name:"butanone", cf:"CH₃COCH₂CH₃", smi:"CC(=O)CC", locs:[1, 2, null, 3, 4], answer:[],
            tap:{ "1":"C2 has a C=O: only three groups. " + M7 },
            reason:"None. C2 has a C=O (only three groups), and C1, C3 and C4 have two or three H atoms." },
          { id:"c8", name:"3-chlorobutan-2-ol", cf:"CH₃CH(OH)CH(Cl)CH₃", smi:"CC(O)C(Cl)C", locs:[1, 2, null, 3, null, 4], answer:[1, 3],
            miss:{ "3":"Check C3 too: H, Cl, CH₃ and CH(OH)CH₃.", "1":"Check C2 too: H, OH, CH₃ and CH(Cl)CH₃." },
            reason:"C2 and C3. C2 has H, OH, CH₃ and CH(Cl)CH₃; C3 has H, Cl, CH₃ and CH(OH)CH₃." }
        ] },
      { id:"stereo", type:"custom", title:"Stereo reasoning", summary:"Stereo reasoning", star:true, goal:[3, 4],
        instruction:"Six questions. Type a number or choose an answer, then press Check.",
        how:"Type numbers only (the units are already there). Each question has three levels of help.",
        items:[
          { id:"r1", kind:"num", goal:3, prompt:"Maximum number of stereoisomers for a molecule with 2 chiral centres (no symmetry)?", answer:4, display:"4",
            why:"2² = 4.", wrong:[{ match:2, fb:M6 + " Each centre doubles: 2²." }, { match:3, fb:M6 + " Each centre doubles: 2²." }],
            hints:["Each chiral centre has two forms.", "2 × 2.", "2² = 4."] },
          { id:"r2", kind:"num", goal:4, prompt:"Two enantiomers of a compound: one boils at 92 °C. The other?", answer:92, unit:"°C", display:"92 °C",
            why:"Enantiomers have identical boiling points.", general:M3,
            hints:["Enantiomers have identical physical properties.", "Boiling point is a physical property.", "92 °C."] },
          { id:"r3", kind:"num", goal:3, star:true, prompt:"How many stereoisomers does pent-3-en-2-ol, CH₃CH(OH)CH=CHCH₃, have?", answer:4, display:"4",
            why:"C2 is a chiral centre (2 forms) and the C=C has cis and trans forms (2): 2 × 2 = 4.",
            wrong:[{ match:2, fb:"The C=C also has cis–trans forms: 2 (centre) × 2 (C=C)." }],
            hints:["Count the chiral centres, and check the C=C for cis–trans forms.", "C2 is a chiral centre; the C=C can be cis or trans.", "2 × 2 = 4."] },
          { id:"r4", kind:"mc", goal:4, star:true,
            prompt:"Investigation: two unlabelled bottles each contain one carvone enantiomer. Without smelling them, which instrument identifies them?",
            options:[
              { t:"A polarimeter", ok:true, why:"The two forms rotate polarized light in opposite directions." },
              { t:"A thermometer", why:"Same boiling points. " + M3 },
              { t:"A balance", why:"Same formula, same mass." },
              { t:"A hydrometer (density)", why:"Same density. " + M3 }],
            hints:["Which property differs between enantiomers?", "They rotate polarized light in opposite directions.", "A polarimeter."] },
          { id:"r5", kind:"num", goal:4, star:true, prompt:"A pure (+) sample rotates +50°. A mixture is 60% (+) and 40% (−). Predict the rotation.", answer:10, unit:"°", display:"+10°",
            why:"The 40% (−) cancels 40% (+), leaving a 20% excess of (+): 20% of +50° = +10°.",
            wrong:[{ match:30, fb:"Subtract the (−) part: 50 × (60 − 40) ÷ 100." }, { match:-10, fb:"Check the direction: there’s more (+) than (−), so the reading is positive." }],
            hints:["The (−) part cancels an equal part of the (+).", "The 40% (−) cancels 40% (+), leaving a 20% excess of (+).", "20% of +50° = +10°."] },
          { id:"r6", kind:"num", goal:3, star:true, prompt:"How many stereoisomers does 2,3-dichlorobutane have?", answer:3, display:"3",
            why:"Two chiral centres allow at most 4, but the arrangement with an internal mirror plane is meso, so there are 3.",
            wrong:[{ match:4, fb:"One arrangement is meso: its mirror image is itself." }],
            hints:["There are two chiral centres, so at most 4.", "Both centres carry the same groups (H, Cl, CH₃, CHClCH₃).", "The ‘opposite’ arrangement has an internal mirror plane: meso. 3 in all."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Fiona", how:"",
        instruction:"Fiona made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Is 3-methylpentane chiral?",
            steps:["The structure is CH₃CH₂CH(CH₃)CH₂CH₃.", "C3 is the only carbon with one H.", "C3’s groups: H, CH₃, CH₂ on the left, and CH₂CH₃ on the right.", "These four are different, so C3 is a chiral centre.", "So 3-methylpentane is chiral."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Correct.", "", "This follows from step 3.", "This follows from step 4."],
            fixes:[
              { t:"The left branch is CH₂CH₃ too. C3 has H, CH₃, C₂H₅ and C₂H₅, so it’s not a chiral centre and the molecule isn’t chiral.", ok:true, why:M1 },
              { t:"C2 is the chiral centre instead.", why:"C2 has two H atoms." },
              { t:"It’s chiral because it has a branch.", why:"Branching alone doesn’t make a chiral centre." },
              { t:"Step 3 is correct.", why:"Follow each branch to its end." }],
            hints:["Walk to the end of the left branch.", "CH₂ then CH₃: an ethyl group.", "Two ethyl groups: not chiral."] },
          { id:"e2", goal:4, task:"Compare the two enantiomers of butan-2-ol.",
            steps:["Both are C₄H₁₀O with the same connections.", "They are non-superimposable mirror images.", "Their boiling points differ by a few degrees because their shapes differ.", "So they can be separated by distillation."],
            answer:2,
            stepFb:["Correct.", "Correct.", "", "This builds on step 3."],
            fixes:[
              { t:"Enantiomers have identical boiling points; they differ only in rotating polarized light and toward chiral partners. Distillation can’t separate them.", ok:true, why:M3 },
              { t:"They differ by a lot, not a few degrees.", why:M3 },
              { t:"Only the (+) form boils.", why:M3 },
              { t:"Step 3 is correct.", why:"Mirror-image molecules have identical forces between them." }],
            hints:["Are the forces between the molecules any different in a mirror world?", "No.", "Same boiling point."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the mirror lab: propan-2-ol matching its mirror image, or swapping two groups?" },
      { id:"j2", q:"In your own words, what makes a molecule chiral?" },
      { id:"j3", q:"Explain to a friend the difference between enantiomers and diastereomers." },
      { id:"j4", q:"Which part of chirality still feels slippery? How will you practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which molecule is chiral?", options:[
          { t:"Butan-2-ol", ok:true, why:"C2 has H, OH, CH₃ and C₂H₅." },
          { t:"Propan-2-ol", why:"Two CH₃ groups." },
          { t:"Butan-1-ol", why:"C1 has two H atoms." },
          { t:"2-methylpropan-2-ol", why:"Three CH₃ groups." }] },
        b:{ prompt:"Which molecule has a chiral centre?", options:[
          { t:"2-chlorobutane", ok:true, why:"C2 has H, Cl, CH₃ and C₂H₅." },
          { t:"1-chlorobutane", why:"Two H atoms on C1." },
          { t:"2-chloropropane", why:"Two CH₃ groups." },
          { t:"2-chloro-2-methylpropane", why:"Three CH₃ groups." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Enantiomers are…", options:[
          { t:"Non-superimposable mirror images", ok:true, why:"Mirror images that can’t be rotated onto each other." },
          { t:"Any two stereoisomers", why:M5 },
          { t:"Isomers with different formulas", why:"Isomers share a formula." },
          { t:"Structural isomers", why:"Same connections." }] },
        b:{ prompt:"Diastereomers are…", options:[
          { t:"Stereoisomers that are not mirror images of each other", ok:true, why:"Cis–trans isomers are diastereomers too." },
          { t:"Mirror-image stereoisomers", why:M5 },
          { t:"Structural isomers", why:"Same connections." },
          { t:"Identical molecules drawn twice", why:"They’re different compounds." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which property differs between two enantiomers?", options:[
          { t:"The direction they rotate plane-polarized light", ok:true, why:M3 },
          { t:"Boiling point", why:M3 },
          { t:"Density", why:M3 },
          { t:"Molecular formula", why:"Isomers share a formula." }] },
        b:{ prompt:"A racemic mixture of a chiral compound is placed in a polarimeter. What is the reading?", options:[
          { t:"0°", ok:true, why:"Equal opposite rotations cancel." },
          { t:"Twice the pure value", why:M4 },
          { t:"The pure (+) value", why:M4 },
          { t:"Half the pure value", why:"Both halves cancel completely." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A molecule has 3 chiral centres and no internal symmetry. What is the maximum number of stereoisomers?", options:[
          { t:"8", ok:true, why:"2³." },
          { t:"6", why:"2 × 3 counts each centre once." },
          { t:"3", why:"Each centre has two forms." },
          { t:"9", why:"3² isn’t the rule; it’s 2ⁿ." }] },
        b:{ prompt:"A molecule has 4 chiral centres and no internal symmetry. What is the maximum number of stereoisomers?", options:[
          { t:"16", ok:true, why:"2⁴." },
          { t:"8", why:M6 },
          { t:"4", why:"Each centre doubles the count." },
          { t:"12", why:"2⁴ = 16." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"How many chiral centres are in 2,3-dihydroxypropanal, HOCH₂–CH(OH)–CHO?", options:[
          { t:"1", ok:true, why:"C2 has H, OH, CHO and CH₂OH. C1 is double-bonded; C3 has two H." },
          { t:"0", why:"C2 has four different groups." },
          { t:"2", why:"The CHO carbon has a C=O." },
          { t:"3", why:M7 }] },
        b:{ prompt:"How many chiral centres are in CH₃–CH(OH)–CH(NH₂)–COOH?", options:[
          { t:"2", ok:true, why:"C2 (H, NH₂, COOH, the rest of the chain) and C3 (H, OH, CH₃, the rest)." },
          { t:"1", why:"Check both CH carbons." },
          { t:"3", why:"The COOH carbon has a C=O." },
          { t:"0", why:"Both CH carbons qualify." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Pure (+) rotates light +30°. A mixture of the (+) and (−) forms rotates it +15°. What percent of the mixture is (+)?", options:[
          { t:"75%", ok:true, why:"A 50% excess of (+): 75% (+), 25% (−)." },
          { t:"50%", why:"50% would give 0°." },
          { t:"25%", why:"That’s the (−) part." },
          { t:"15%", why:"Rotation isn’t a percentage." }] },
        b:{ prompt:"Pure (−) rotates light −20°. A mixture rotates it −16°. What percent is (−)?", options:[
          { t:"90%", ok:true, why:"16 ÷ 20 = an 80% excess: 90% (−), 10% (+)." },
          { t:"80%", why:"That’s the excess; add half of the rest." },
          { t:"10%", why:"That’s the (+) part." },
          { t:"16%", why:"Rotation isn’t a percentage." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why butan-2-ol is chiral?", options:[
          { t:"“C2 has four different groups (H, OH, CH₃, C₂H₅), so its mirror image can’t be rotated to sit on the original.”", ok:true, why:"It names the four different groups and the mirror-image test." },
          { t:"“It contains an OH group.”", why:"Many alcohols with OH aren’t chiral." },
          { t:"“It has a mirror image.”", why:"Every molecule does." },
          { t:"“Its boiling point is unusual.”", why:"Chirality is about shape." }] },
        b:{ prompt:"Which is the best explanation of why propan-2-ol is <strong>not</strong> chiral?", options:[
          { t:"“C2 carries two identical CH₃ groups, so its mirror image can be rotated onto the original.”", ok:true, why:"A repeated group removes the handedness." },
          { t:"“It has no mirror image.”", why:M2 },
          { t:"“It has too few carbons.”", why:"Size isn’t the test." },
          { t:"“Its OH is on the middle carbon.”", why:"The position alone doesn’t decide it." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Stereoisomers P and Q of a molecule with two chiral centres differ at only one centre. They are…", options:[
          { t:"Diastereomers", ok:true, why:"Only some centres differ, so they aren’t mirror images." },
          { t:"Enantiomers", why:M5 },
          { t:"The same compound", why:"One centre is different." },
          { t:"Structural isomers", why:"Same connections." }] },
        b:{ prompt:"Stereoisomers R and S of a molecule with two chiral centres (no symmetry) differ at both centres. They are…", options:[
          { t:"Enantiomers", ok:true, why:"Mirror images differ at every centre." },
          { t:"Diastereomers", why:M5 },
          { t:"The same compound", why:"Both centres differ." },
          { t:"Structural isomers", why:"Same connections." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Two oils have the same formula, boiling point and density, but one smells of spearmint and the other of caraway. What best explains this?", options:[
          { t:"They are enantiomers, and smell receptors are chiral, so each fits a different receptor", ok:true, why:"Only a chiral partner tells enantiomers apart." },
          { t:"They are structural isomers", why:"Same connections, same boiling point." },
          { t:"One contains an impurity", why:"The difference is in the molecules themselves." },
          { t:"They have different masses", why:"Same formula, same mass." }] },
        b:{ prompt:"Only one enantiomer of a pain reliever binds its target enzyme well. Why can handedness matter?", options:[
          { t:"The enzyme’s binding site is chiral, so only one hand fits all its contact points", ok:true, why:"Like a glove, a chiral site fits only one hand." },
          { t:"The other enantiomer has a different formula", why:"Same formula." },
          { t:"The other enantiomer doesn’t dissolve", why:"Same solubility in water." },
          { t:"Enzymes only bind racemic mixtures", why:"They bind single molecules." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A drug’s inactive enantiomer is harmless. Which is a reasonable advantage of selling only the active enantiomer?", options:[
          { t:"The same effect comes from about half the mass of drug", ok:true, why:"In a racemic mixture, half the mass is the inactive form." },
          { t:"It changes the drug’s formula", why:"Same formula." },
          { t:"It makes the drug boil at a different temperature", why:M3 },
          { t:"It makes the drug achiral", why:"One enantiomer is still chiral." }] },
        b:{ prompt:"A chemist makes lactic acid (2-hydroxypropanoic acid) from non-chiral starting materials, with no chiral catalyst. Predict the polarimeter reading of the product.", options:[
          { t:"0°: a racemic mixture forms", ok:true, why:"With no chiral influence, both hands form equally." },
          { t:"The pure (+) value", why:"Nothing favours one hand." },
          { t:"The pure (−) value", why:"Nothing favours one hand." },
          { t:"It can’t be measured, because lactic acid isn’t chiral", why:"C2 has four different groups." }] } }
    ]
  },
  task:{
    title:"Build a chiral alcohol", summary:"Build a chiral alcohol",
    statement:"<p>Fill the four slots on the central carbon to build a molecule that meets every condition. Can you find all the answers?</p><ol class=\"ml-conds\"><li>The molecular formula is C₅H₁₂O.</li><li>The central carbon is a chiral centre.</li><li>The molecule is an alcohol.</li></ol>",
    groups:["H", "CH3", "C2H5", "C3H7", "OH", "CH2OH", "OCH3", "Cl"],
    start:{ w:"H", d:"OH", l:"CH3", r:"C2H5" },
    checks:["Formula C₅H₁₂O", "Chiral centre", "An alcohol"],
    tips:["Count carbons: the central C plus the groups must make 5.", "Any repeated group kills the chiral centre.", "OCH₃ makes an ether, not an alcohol."],
    explainPrompt:"Explain why your molecule is chiral and how you would make its enantiomer.",
    vocab:"Use the words chiral centre, four different groups, mirror image and enantiomer.",
    success:"Your molecule works!",
    more:"Swap any two groups to get the other enantiomer: a different molecule that also counts."
  },
  cards:[
    ["Chiral centre", "A carbon with four different groups on four single bonds."],
    ["Chiral molecule", "Its mirror image can’t be superimposed on it."],
    ["Enantiomers", "Non-superimposable mirror-image stereoisomers."],
    ["Diastereomers", "Stereoisomers that aren’t mirror images (including cis–trans pairs)."],
    ["Swapping two groups", "Turns a chiral centre into its enantiomer."],
    ["Same for enantiomers", "Boiling point, melting point, density, solubility in water."],
    ["Different for enantiomers", "Direction of rotating polarized light; fit with chiral receptors and enzymes."],
    ["Racemic mixture", "50 : 50 enantiomers; polarimeter reads 0°."],
    ["Maximum stereoisomers", "2ⁿ for <em>n</em> chiral centres."],
    ["Meso form", "Has chiral centres but is identical to its mirror image (internal mirror plane)."],
    ["Polarimeter", "Measures how far a sample turns plane-polarized light."],
    ["Why chirality matters", "Smell, taste and drugs depend on fitting chiral sites in the body."]
  ]
};
