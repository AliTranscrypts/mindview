// SCH4U 18 VSEPR Theory and Molecular Geometry. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/18-vsepr.md
// The shape predictor (Explore), the formula-to-shape pipeline (Part 3), the Shapes and angles set and the task's live
// 3D model are drawn by app.js, which also holds the species data (atoms, bond orders, lone pairs) and the 3D geometry.

// formula HTML (the same rules as MV.chem.f): digits after a letter become subscripts, "^2-" is a charge
const F = (s) => '<span class="chem">' + s.replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>").replace(/\^(\d*)([+-])/g, (_, d, c) => "<sup>" + d + (c === "+" ? "+" : "−") + "</sup>") + "</span>";
const AXE = (m, n) => '<span class="chem">AX<sub>' + m + "</sub>" + (n == null ? "" : "E<sub>" + n + "</sub>") + "</span>";
const AXmEn = 'AX<sub><i>m</i></sub>E<sub><i>n</i></sub>';
const CH4 = F("CH4"), NH3 = F("NH3"), H2O = F("H2O"), BF3 = F("BF3"), CO2 = F("CO2"), SO3 = F("SO3"), CH2O = F("CH2O"), HCN = F("HCN");
const O3 = F("O3"), NO2 = F("NO2^-"), NH4 = F("NH4^+"), H3O = F("H3O^+"), CO3 = F("CO3^2-"), PCL5 = F("PCl5"), SF4 = F("SF4"), CLF3 = F("ClF3");
const XEF2 = F("XeF2"), SF6 = F("SF6"), BRF5 = F("BrF5"), XEF4 = F("XeF4"), ICL2 = F("ICl2^-");

// Misconception core sentences (plan §3)
const M1 = "A multiple bond points in one direction, so it is one electron group.";
const M2 = "The electron groups are tetrahedral, but the shape is named from the atoms only: water is bent.";
const M3 = "Lone pairs occupy space. " + NH3 + " has four groups, so it is trigonal pyramidal, not planar.";
const M4 = "A lone pair spreads wider than a bonding pair, so it pushes the bonds closer together: 104.5° in water.";
const M5 = "Lone pairs go equatorial, where they have only two neighbours at 90°.";
const M6 = XEF2 + " has three lone pairs, all equatorial, so the two F atoms sit opposite each other: linear.";
const M7 = "Paper is flat, but molecules aren’t. " + CH4 + "’s bonds point to the corners of a tetrahedron at 109.5°.";

export default {
  id:"18-vsepr",
  kind:"topic",
  title:"VSEPR theory and molecular geometry",
  topic:"VSEPR Theory and Molecular Geometry",
  readyTopic:"VSEPR theory and molecular geometry",
  hero:{
    eq:'<span class="vs-heq"><span class="nw">' + AXmEn + ' → shape.</span> <span class="nw">' + NH3 + " = " + AXE(3, 1) + '</span> <span class="nw">→ trigonal pyramidal, ≈ 107°</span></span>',
    eqSize:"sm",
    eqLabel:"A X m E n gives the shape. N H 3 is A X 3 E 1, so it is trigonal pyramidal, about 107 degrees.",
    headline:"Electron groups push apart",
    text:"Electron groups around a central atom repel each other, so they spread out as far as they can. That gives the <strong>electron-group arrangement</strong>. Name what the <strong>atoms</strong> make, and you have the <strong>molecular shape</strong>. <strong>Lone pairs</strong> are invisible in the name, but they bend the bonds.",
    fig:{ html:'<div class="vs-hx"><svg class="vs-hx-svg" id="vs-hx-svg" viewBox="0 0 440 320" role="img" aria-label="Four balloons tied at their knots push apart into a tetrahedron. Each balloon becomes an electron cloud: three get H atoms at their tips and the fourth, fatter and violet, stays a lone pair on N. The H–N–H angle shrinks from 109.5° to 107°. With the lone pair hidden, the atoms make a pyramid labelled trigonal pyramidal."></svg><div class="vs-hx-row"><p class="vs-hx-cap" id="vs-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="vs-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can count electron groups around a central atom from a Lewis structure, counting a multiple bond as one group.",
    "I can name the electron-group arrangement and the molecular shape for AXₘEₙ, up to six groups.",
    "I can predict bond angles, including how lone pairs squeeze them.",
    "I can explain where lone pairs sit in five- and six-group arrangements.",
    "I can go from a formula to a 3D shape for molecules and polyatomic ions.",
    "I can draw and describe 3D shapes with wedge-and-dash diagrams."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Lewis structures", goal:1,
          prompt:"How many bonds does carbon form in " + CO2 + ", and what kind?",
          options:[
            { t:"Two double bonds", ok:true, why:"O=C=O gives carbon an octet." },
            { t:"Two single bonds", why:"Carbon would have only 4 electrons." },
            { t:"One triple bond and one single bond", why:"Possible, but formal charges make O=C=O better." },
            { t:"Four single bonds", why:"There are only two oxygen atoms." }],
          hints:["16 electrons.", "Carbon needs 8.", "O=C=O."] },
        { id:"w2", skill:"Lewis structures", goal:5,
          prompt:"How many valence electrons does " + NH4 + " have?",
          options:[
            { t:"8", ok:true, why:"5 + 4 − 1." },
            { t:"9", why:"Subtract 1 for the 1+ charge." },
            { t:"10", why:"A positive charge removes electrons." },
            { t:"11", why:"That uses nitrogen’s atomic number." }],
          hints:["N 5, H 1 each.", "Positive ion: subtract.", "8."] },
        { id:"w3", skill:"Lone pairs on the central atom", goal:1,
          prompt:"How many lone pairs are on oxygen in " + H2O + "?",
          options:[
            { t:"2", ok:true, why:"8 electrons: two bonds and two lone pairs." },
            { t:"0", why:"Oxygen keeps 4 non-bonding electrons." },
            { t:"1", why:"8 − 4 = 4 electrons, which is two pairs." },
            { t:"4", why:"4 is the number of non-bonding electrons, not pairs." }],
          hints:["O brings 6; each H brings 1.", "Two bonds use 4 of the 8.", "Two pairs."] },
        { id:"w4", skill:"Lone pairs on the central atom", goal:4,
          prompt:"How many lone pairs are on sulfur in " + SF4 + "?",
          options:[
            { t:"1", ok:true, why:"34 − 8 − 24 = 2 electrons, which is one pair." },
            { t:"0", why:"Two electrons are left over." },
            { t:"2", why:"Only 2 electrons remain: one pair." },
            { t:"3", why:"That’s " + XEF2 + "." }],
          hints:["S 6 + 4 × 7 = 34.", "Bonds use 8; the F atoms need 24.", "One pair."] },
        { id:"w5", skill:"Angles in 3D", goal:3,
          prompt:"What angle separates the bonds in a flat molecule with three identical bonds spread evenly?",
          options:[
            { t:"120°", ok:true, why:"360° ÷ 3." },
            { t:"90°", why:"That would leave a gap." },
            { t:"109.5°", why:"That’s the tetrahedral angle, in 3D." },
            { t:"180°", why:"That’s for two groups." }],
          hints:["A full turn is 360°.", "Split it into 3.", "120°."] },
        { id:"w6", skill:"Angles in 3D", goal:6,
          prompt:"In a wedge-and-dash drawing, what does a solid wedge mean?",
          options:[
            { t:"The bond points toward you, out of the page", ok:true, why:"Solid means near: the bond comes out of the page." },
            { t:"The bond points away from you", why:"That’s a dashed wedge." },
            { t:"A double bond", why:"Double bonds are drawn as two lines." },
            { t:"A lone pair", why:"Lone pairs are dots." }],
          hints:["Wedges show depth.", "Solid means near, dashed means far.", "Toward you."] }
      ],
      refreshers:{
        "Lewis structures":"Count valence electrons, connect, complete octets, and use multiple bonds if the centre is short.",
        "Lone pairs on the central atom":"Electrons left on the centre ÷ 2 = lone pairs. Expanded octets can have several.",
        "Angles in 3D":"Flat: 120° for three groups. In 3D, four groups at 109.5°. Solid wedge = toward you; dashed = away."
      }
    }
  },
  explore:{
    heading:"Shape predictor",
    intro:"Set the bonding groups and lone pairs, or pick a real molecule. Rotate it, hide the lone pairs, and measure the angles.",
    how:"Choose a mode. <strong>Build a shape</strong>: use the X (bonded atoms) and E (lone pairs) buttons; only the 13 standard combinations are allowed. <strong>Real species</strong>: pick a molecule or ion to see its Lewis structure beside the 3D model. <strong>Angle lab</strong>: tap three atoms (two outer atoms and the central atom) to measure an angle; on a keyboard, Tab to an atom and press Enter. Turn the model by dragging it or with the arrow keys (Shift for 15° steps); + and − zoom.",
    species:["ch4", "nh3", "h2o", "bf3", "co2", "so3", "ch2o", "hcn", "o3", "no2", "nh4", "h3o", "co3", "pcl5", "sf4", "clf3", "xef2", "sf6", "brf5", "xef4"],
    modes:[{ id:"build", t:"Build a shape" }, { id:"species", t:"Real species" }, { id:"lab", t:"Angle lab" }],
    toggles:{ lp:"Show lone pairs", poly:"Show electron-group arrangement", ideal:"Show ideal vs real angle" },
    rows:{ axe:"AXE notation", groups:"Electron groups", arr:"Electron-group arrangement", shape:"Molecular shape", ideal:"Ideal angle", pred:"Predicted angle", lpPos:"Lone-pair position" },
    lpSpot:{ label:"Lone pairs go", eq:"Equatorial", ax:"Axial (try it)" },
    lab:"Tap two outer atoms and the central atom, in any order. The angle is measured at the central atom.",
    compare:{ title:"Compare two species", intro:"For challenge 3: choose two species from the Real species list, then choose the bond-angle limit for each.",
      slot:"Species", angle:"Bond angle", angles:[{ id:"180", t:"180°" }, { id:"120", t:"120°" }, { id:"lt120", t:"Less than 120°" }, { id:"109", t:"109.5°" }, { id:"lt109", t:"Less than 109.5°" }, { id:"90", t:"90°" }] },
    predIntro:"Choose an answer. Then the shape predictor shows what really happens.",
    predictions:[
      { id:"p1", prompt:"What is the molecular shape of " + NH3 + "?",
        options:[{ t:"Trigonal pyramidal", ok:true }, { t:"Trigonal planar" }, { t:"Tetrahedral" }, { t:"Bent" }],
        explain:"Four electron groups give a tetrahedral arrangement. With one lone pair, the atoms form a pyramid." },
      { id:"p2", prompt:"What is the H–O–H angle?",
        options:[{ t:"≈ 104.5°", ok:true }, { t:"109.5°" }, { t:"120°" }, { t:"90°" }],
        explain:"Two lone pairs squeeze the bonds closer than the tetrahedral angle." },
      { id:"p3", prompt:"Where does " + SF4 + "’s lone pair go: axial or equatorial?",
        options:[{ t:"Equatorial, giving a seesaw", ok:true }, { t:"Axial, giving a trigonal pyramid" }, { t:"It doesn’t matter" }, { t:"Above the plane, giving a square plane" }],
        explain:"The equatorial position has fewer close neighbours." },
      { id:"p4", prompt:"What is the shape of " + CO2 + "?",
        options:[{ t:"Linear, 180°", ok:true }, { t:"Bent" }, { t:"Tetrahedral" }, { t:"Trigonal planar" }],
        explain:"Each double bond is one electron group, so two groups make a line." }
    ],
    caps:{
      p1a:"Lone pair hidden: three H atoms around N.",
      p1b:"The lone pair appears and pushes the three H atoms down into a pyramid.",
      p1c:"Trigonal pyramidal: four electron groups, one of them a lone pair.",
      p2a:"Tetrahedral angle first: 109.5°.",
      p2b:"Two lone pairs squeeze the bonds: the arc settles at ≈ 104.5°. The dashed lines show the tetrahedral 109.5°.",
      p3a:"Axial try: the lone pair has three neighbours at 90° (orange).",
      p3b:"Equatorial: only two neighbours at 90°. The atoms make a seesaw.",
      p4a:"Two double bonds from carbon…",
      p4b:"…point in opposite directions: 2 electron groups, linear, 180°."
    },
    chalIntro:"Use the shape predictor to meet each goal, then press <strong>Check challenge</strong>. Challenges 1 and 2 check your Build a shape settings; challenge 3 checks the Compare two species panel. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3],
        prompt:"Build a bent molecule with a bond angle less than 109.5°.",
        why:AXE(2, 2) + ", like water: four electron groups in a tetrahedral arrangement, and the two lone pairs squeeze the bond angle below 109.5° (≈ 104.5° in water).",
        hints:["Bent means two atoms on the centre.", "To get below 109.5°, start from four groups.", AXE(2, 2) + ", like water."] },
      { id:"tc2", goal:[2, 4],
        prompt:"Build a square planar molecule.",
        why:AXE(4, 2) + ": six electron groups in an octahedral arrangement, with the two lone pairs opposite each other, so the four atoms sit in one plane at 90°.",
        hints:["Square planar is octahedral with two positions empty.", "Six groups, four atoms.", AXE(4, 2) + ": the two lone pairs sit opposite each other."] },
      { id:"tc3", goal:[2, 3, 4], stretch:true,
        prompt:"Find two species in the Real species list that have the <strong>same</strong> molecular shape but <strong>different</strong> electron-group arrangements. Then choose the correct angle limit for each.",
        why:"Bent from a trigonal planar base (" + O3 + " or " + NO2 + ", less than 120°) and from a tetrahedral base (" + H2O + ", less than 109.5°); or linear from two groups (" + CO2 + ") and from five groups with three equatorial lone pairs (" + XEF2 + "), both 180°.",
        hints:["Look for shapes that appear twice in the AXE table: bent and linear.", "Bent comes from " + AXE(2, 1) + " (trigonal planar base) or " + AXE(2, 2) + " (tetrahedral base).", O3 + " (" + AXE(2, 1) + ") and " + H2O + " (" + AXE(2, 2) + "); or " + CO2 + " (" + AXE(2) + ") and " + XEF2 + " (" + AXE(2, 3) + ")."] }
    ],
    msgs:{
      tc1:{ x2e1:"Bent, but about 117–120° (trigonal planar base).", x2e3:"That’s linear: three lone pairs sit equatorial.", x3e1:"Three atoms make a pyramid, not a bent shape.",
        other:"Bent means two atoms on the centre, with lone pairs taking up the other positions." },
      tc2:{ x4e1:"That’s a seesaw.", x4e0:"That’s tetrahedral.", x6e0:"Octahedral; take away two opposite atoms and replace them with lone pairs.",
        other:"Square planar has four atoms around the centre in one plane, all at 90°." },
      tc3:{ empty:"Choose a species in both slots of the Compare two species panel, and a bond angle for each.",
        same:"Choose two different species.",
        h2oNh3:NH3 + " is trigonal pyramidal.",
        co2Hcn:"Both linear, but both have two electron groups: the same arrangement.",
        xef2:M6,
        diffShape:"Those two have different molecular shapes. Turn each one in the Real species view and compare the shape rows.",
        sameArr:"Same shape, but also the same number of electron groups: the same arrangement. Find a partner built on a different arrangement.",
        angle:"Right pair. Now check the bond angle you chose for {sp}: start from its arrangement’s ideal angle, then ask whether lone pairs squeeze it." },
      build:"Your build is {axe}: {shape}."
    },
    blocks:[
      { title:"The big idea", html:"<p>Count the electron groups to get the arrangement. Hide the lone pairs to name the shape. Then let the lone pairs squeeze the angles.</p>" }
    ]
  },
  part3:{
    slug:"formula", name:"Formula to shape", heading:"From formula to shape",
    intro:"Follow one species from its formula to its 3D shape, one stage at a time: valence count, Lewis structure, AXE, arrangement, shape, angle, and a wedge-and-dash drawing. Each stage has its own check.",
    sets:[
      { t:"Molecules", list:["ch4", "so3", "o2", "h2o"] },
      { t:"Ions", list:["nh4", "h3o", "no3"] },
      { t:"Expanded octets", list:["pcl5", "clf3", "brf5", "xef4"] }
    ],
    stages:[
      { id:"ve", t:"Valence count", q:"How many valence electrons does {sp} have in total?" },
      { id:"lewis", t:"Lewis structure", q:"Complete the Lewis structure. Set each bond and the lone pairs on the central atom; the outer atoms’ lone pairs fill in by themselves." },
      { id:"axe", t:"AXE", q:"Write the AXE notation: X = atoms bonded to the central atom, E = lone pairs on the central atom." },
      { id:"arr", t:"Arrangement", q:"Which electron-group arrangement do X + E groups make?" },
      { id:"shape", t:"Shape", q:"Name the molecular shape (atoms only)." },
      { id:"angle", t:"Angle", q:"Choose the bond angle." },
      { id:"wedge", t:"Wedge and dash", q:"Choose how to draw each bond: in the plane of the page, a wedge (toward you) or a dash (away from you). Tap a bond to change it." }
    ],
    angles:[{ id:"180", t:"180°" }, { id:"120", t:"120°" }, { id:"109", t:"109.5°" }, { id:"107", t:"≈ 107°" }, { id:"104", t:"≈ 104.5°" }, { id:"90", t:"90°" }, { id:"90-120", t:"90° and 120°" },
      { id:"lt120", t:"Less than 120°" }, { id:"lt109", t:"Less than 109.5°" }, { id:"lt90", t:"Less than 90°" }, { id:"none", t:"No bond angle (two atoms)" }],
    styles:{ p:"In the plane", w:"Wedge (toward you)", d:"Dash (away from you)" },
    msgs:{
      ve:{ charge:"Adjust for the charge: add 1 electron for each negative charge and subtract 1 for each positive charge.", sign:"A positive charge removes electrons; a negative charge adds them.",
        atomic:"Use valence electrons, not atomic numbers.", general:"Add each atom’s valence electrons (H 1, C 4, N 5, O 6, P 5, S 6, halogens 7, Xe 8), then adjust for any charge.", num:"Enter a whole number." },
      lewis:{ over:"That places {n} electrons, but there are only {t}. Remove a lone pair or a multiple bond.", under:"{n} of {t} electrons are placed. Put the leftover electrons on the central atom as lone pairs.",
        p2:"{el} is in period 2, so it can’t hold more than 8 electrons.", short:"The central atom has only {n} electrons. Turn an outer lone pair into a double bond." },
      axe:{ m1:M1 + " X counts the atoms bonded to the central atom.", x:"X counts the atoms bonded to the central atom.", e:"E counts the lone pairs on the central atom only. Read it from your Lewis structure.", pick:"Choose a value for X and for E." },
      arr:{ m3:"Lone pairs occupy space: count every electron group, X + E.", general:"Count the electron groups (X + E), then match: 2 linear, 3 trigonal planar, 4 tetrahedral, 5 trigonal bipyramidal, 6 octahedral." },
      shape:{ m2:"The electron groups are {arr}, but the shape is named from the atoms only.", m3:"Lone pairs occupy space, so the atoms can’t spread out as if the lone pairs weren’t there.",
        m5:M5, two:"Any molecule made of only two atoms is linear.", general:"Hide the lone pairs and name what the atoms make." },
      angle:{ m4:"A lone pair spreads wider than a bonding pair, so it pushes the bonds closer together.", h3o:"≈ 107° is the measured angle in " + NH3 + ". The course data has no measured value for " + H3O + ": say less than 109.5°.",
        none:"With only two atoms there’s no bond angle to measure.", notNone:"Several atoms surround the central atom, so there are bond angles.", eq:"With no lone pairs on the centre, the angle isn’t squeezed: it’s the arrangement’s ideal angle.",
        general:"Start from the arrangement’s ideal angle; lone pairs on the centre squeeze it.", h2o:"Measured: ≈ 104.5°." },
      wedge:{ m7:M7, depth:"Paper is flat, but molecules aren’t: some bonds point toward you and some away. Use one wedge and one dash.", flat:"This shape is flat: draw every bond in the plane of the page.", crowd:"That crowds bonds toward you: use one wedge and one dash.",
        partner:"A wedge needs a partner pointing away: use one wedge and one dash.", which:"Keep the bonds drawn far apart in the plane. The two drawn close together point toward you and away from you.", general:"Compare your drawing with the 3D model: which bonds point toward you, which point away?" },
      pick:"Choose an answer first.",
      done:"Pipeline complete. Turn the 3D model to check your drawing, then pick another species."
    },
    zoom:{ title:"Zoom to the particles: lone pairs and the angle",
      text:"Measured H–X–H angles for the three four-group species. Each lone pair on the centre squeezes the angle a little more.",
      aria:"Graph of measured bond angle against lone pairs on the central atom: CH₄ 109.5° at 0, NH₃ about 107° at 1, H₂O about 104.5° at 2. The angle falls as the number of lone pairs rises.",
      head:["Species", "Lone pairs on the centre", "Measured angle"], rows:[[CH4, "0", "109.5°"], [NH3, "1", "≈ 107°"], [H2O, "2", "≈ 104.5°"]] },
    quickCheck:{
      title:"Quick check", summary:"Formula to shape quick check",
      items:[
        { id:"q1", goal:2, prompt:"Shape of " + SO3 + "?",
          choices:[{ t:"Trigonal planar", ok:true, fb:"Right. 3 groups, no lone pairs on S." }, { t:"Trigonal pyramidal", fb:"3 groups, no lone pairs on S." }, { t:"Tetrahedral", fb:"3 groups, no lone pairs on S." }, { t:"Bent", fb:"3 groups, no lone pairs on S." }] },
        { id:"q2", goal:1, prompt:"AXE for " + CLF3 + "?",
          choices:[{ t:AXE(3, 2), ok:true, fb:"Right. 28 − 6 − 18 = 4: two lone pairs on Cl." }, { t:AXE(3, 1), fb:"28 − 6 − 18 = 4: two lone pairs on Cl." }, { t:AXE(3), fb:"28 − 6 − 18 = 4: two lone pairs on Cl." }, { t:AXE(3, 3), fb:"28 − 6 − 18 = 4: two lone pairs on Cl." }] },
        { id:"q3", goal:4, prompt:"Shape of " + CLF3 + "?",
          choices:[{ t:"T-shaped", ok:true, fb:"Right. Two equatorial lone pairs leave a T." }, { t:"Trigonal planar", fb:"Two equatorial lone pairs leave a T." }, { t:"Trigonal pyramidal", fb:"Two equatorial lone pairs leave a T." }, { t:"Seesaw", fb:"Two equatorial lone pairs leave a T." }] },
        { id:"q4", goal:5, prompt:"Shape of " + NH4 + "?",
          choices:[{ t:"Tetrahedral", ok:true, fb:"Right. Four bonds, no lone pairs." }, { t:"Trigonal pyramidal", fb:"Four bonds, no lone pairs." }, { t:"Square planar", fb:"Four bonds, no lone pairs." }, { t:"Bent", fb:"Four bonds, no lone pairs." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Species ↔ shape", summary:"Species ↔ shape", goal:[2, 5],
        instruction:"Match each species to its molecular shape.",
        leftTitle:"Species", rightTitle:"Shape",
        left:[
          { id:"l1", t:CO2, why:CO2 + " is " + AXE(2) + ": two groups make a line." },
          { id:"l2", t:H2O, why:H2O + " is " + AXE(2, 2) + ": four groups, two of them lone pairs." },
          { id:"l3", t:BF3, why:BF3 + " is " + AXE(3) + ": three groups in a flat triangle." },
          { id:"l4", t:NH3, why:NH3 + " is " + AXE(3, 1) + ": four groups, one of them a lone pair." },
          { id:"l5", t:CH4, why:CH4 + " is " + AXE(4) + ": four bonding groups." },
          { id:"l6", t:SF4, why:SF4 + " is " + AXE(4, 1) + ": the lone pair sits equatorial.", hints:["Lone pairs on S?", "One.", AXE(4, 1) + ": seesaw."] },
          { id:"l7", t:CLF3, why:CLF3 + " is " + AXE(3, 2) + ": two equatorial lone pairs leave a T." },
          { id:"l8", t:XEF4, why:XEF4 + " is " + AXE(4, 2) + ": the two lone pairs sit opposite each other." }],
        right:[{ id:"r1", t:"Linear" }, { id:"r2", t:"Bent" }, { id:"r3", t:"Trigonal planar" }, { id:"r4", t:"Trigonal pyramidal" }, { id:"r5", t:"Tetrahedral" }, { id:"r6", t:"Seesaw" }, { id:"r7", t:"T-shaped" }, { id:"r8", t:"Square planar" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l2|r5":M2, "l4|r3":M3, "l6|r5":SF4 + " has a lone pair as well as 4 bonds: 5 groups.", "l8|r5":XEF4 + " has two lone pairs: 6 groups." },
        wrongDefault:"Count the electron groups, then hide the lone pairs." },
      { id:"angles", type:"custom", title:"Shapes and angles", summary:"Shapes and angles", star:true, goal:[3, 4, 5],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number or tap a choice, then press <strong>Check</strong>.",
        items:[
          { id:"n1", kind:"num", goal:3, prompt:"F–B–F angle in " + BF3 + "?", unit:"°", label:"Angle", answer:120,
            wrong:[{ v:109.5, fb:BF3 + " is flat." }], general:"Three groups and no lone pairs spread evenly in a plane.",
            hints:["How many electron groups surround B, and are any of them lone pairs?", "Three bonding groups, no lone pairs: trigonal planar.", "360° ÷ 3 = 120°."] },
          { id:"n2", kind:"num", goal:3, prompt:"How many 90° F–S–F angles are there in " + SF6 + "?", label:"Number of 90° angles", answer:12,
            wrong:[{ v:6, fb:"Each F has 4 neighbours at 90°: 6 × 4 ÷ 2 = 12." }], general:"Count each F’s neighbours at 90°, then make sure you count each angle once.",
            hints:["Each F has a neighbour above, below, left and right.", "6 atoms × 4 neighbours.", "Divide by 2, since each angle is counted twice: 12."] },
          { id:"n3", kind:"num", goal:4, star:true, prompt:"How many Cl atoms in " + PCL5 + " are axial?", label:"Axial Cl atoms", answer:2,
            wrong:[{ v:3, fb:"Three are equatorial; two are axial." }], general:"A trigonal bipyramid has a triangle around the middle and one position above and one below.",
            hints:["Five groups make a trigonal bipyramid.", "Three positions form the triangle around the middle (equatorial); the rest are on the axis.", "Two axial, three equatorial: 2."] },
          { id:"n4", kind:"chips", goal:5, star:true, prompt:"Predict the shape of " + ICL2 + ".",
            options:[{ t:"Linear", ok:true, why:"22 electrons: " + AXE(2, 3) + ", with the three lone pairs equatorial, so the Cl atoms sit opposite each other." },
              { t:"Bent", why:"22 electrons: " + AXE(2, 3) + ", so the lone pairs are equatorial." },
              { t:"T-shaped", why:"Only two Cl atoms are bonded to I; count the lone pairs on I." },
              { t:"Trigonal planar", why:"Only two Cl atoms are bonded to I; count the lone pairs on I." }],
            hints:["I 7 + 2 × 7 + 1 = 22.", "Two bonds use 4 electrons; the Cl atoms need 12; 6 remain, which is three lone pairs.", AXE(2, 3) + ": linear."] },
          { id:"n5", kind:"chips", goal:3, star:true, prompt:"Order " + CH4 + ", " + NH3 + " and " + H2O + " by H–X–H angle, largest first.",
            options:[{ t:CH4 + " > " + NH3 + " > " + H2O, ok:true, why:"0, 1, then 2 lone pairs: 109.5°, ≈ 107°, ≈ 104.5°." },
              { t:H2O + " > " + NH3 + " > " + CH4, why:"Each extra lone pair squeezes the angle more." },
              { t:NH3 + " > " + CH4 + " > " + H2O, why:"Each extra lone pair squeezes the angle more." },
              { t:"All equal at 109.5°", why:"Each extra lone pair squeezes the angle more." }],
            hints:["Count the lone pairs on each central atom.", "All three have four electron groups; the lone pairs are 0, 1 and 2.", "More lone pairs, smaller angle: " + CH4 + " > " + NH3 + " > " + H2O + "."] },
          { id:"n6", kind:"two", goal:3, star:true,
            prompt:"<strong>Investigation:</strong> Measured angles: P 109.5°, Q 107°, R 104.5°. Each species has four electron groups. Which variable explains the trend, and which variable was kept the same?",
            parts:[
              { id:"a", label:"Explains the trend", options:[{ t:"Number of lone pairs (0, 1, 2)", ok:true }, { t:"Bond length" }, { t:"Size of the central atom" }, { t:"Total number of electron groups" }] },
              { id:"b", label:"Kept the same", options:[{ t:"Total number of electron groups (4)", ok:true }, { t:"Number of lone pairs" }, { t:"Bond length" }, { t:"Number of bonded atoms" }] }],
            why:"The number of lone pairs (0, 1, 2) explains the trend; the total number of electron groups (4) was kept the same.",
            fb:"Bond length or atom size isn’t the main factor here; the lone-pair count changes in step with the angle.",
            hints:["What changes from P to Q to R, in step with the angle?", "Four groups each time, but a different split between bonds and lone pairs.", "Explains it: the number of lone pairs (0, 1, 2). Kept the same: the total number of electron groups (4)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Jamie", how:"", goal:[1, 2, 4],
        instruction:"Jamie made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Predict the shape of " + CO2 + ".",
            steps:["Lewis structure: O=C=O with no lone pairs on C.", "Each double bond counts as 2 electron groups, so C has 4 groups.", "Four groups make a tetrahedral arrangement.", "So " + CO2 + " is bent, like water."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2.", "Step 4 follows the earlier mistake."],
            fixes:[
              { t:"A double bond is one electron group, so C has 2 groups: linear, 180°.", ok:true, why:"Each double bond points in one direction, so the two groups sit opposite each other." },
              { t:"Each double bond counts as 4 groups.", why:"Also wrong." },
              { t:"Count the lone pairs on O as groups on C.", why:"Only groups on the central atom count." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["How many directions do C’s bonds point?", "Two.", "Linear."] },
          { id:"e2", goal:2, task:"Name the shape of " + NH3 + ".",
            steps:["N has three bonds and one lone pair.", "That’s 4 electron groups.", "The electron groups are arranged tetrahedrally.", "So " + NH3 + " is tetrahedral."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"The shape is named from the atoms only: trigonal pyramidal, with angles ≈ 107°.", ok:true, why:"The lone pair takes up a position, but the name describes the N and three H atoms: a pyramid." },
              { t:"Trigonal planar.", why:M3 },
              { t:"Bent.", why:"That needs two lone pairs." },
              { t:"Step 4 is correct.", why:"The electron groups are tetrahedral, but the shape is named from the atoms only: " + NH3 + " is trigonal pyramidal." }],
            hints:["Is the lone pair part of the shape’s name?", "No: only the atoms.", "Trigonal pyramidal."] },
          { id:"e3", goal:4, task:"Predict the shape of " + SF4 + ".",
            steps:["34 electrons: four S–F bonds and one lone pair on S.", "5 electron groups: trigonal bipyramidal arrangement.", "The lone pair takes an axial position.", "So " + SF4 + " is a trigonal pyramid."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The lone pair goes equatorial (fewer 90° neighbours), giving a seesaw.", ok:true, why:"An equatorial lone pair has only two neighbours at 90°; an axial one would have three." },
              { t:"The lone pair goes in the middle.", why:"It occupies a position, like an atom." },
              { t:"It doesn’t matter where it goes.", why:"Axial and equatorial positions aren’t equivalent." },
              { t:"Step 3 is correct.", why:M5 }],
            hints:["Which position has fewer close neighbours?", "Equatorial: two at 90°.", "Seesaw."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: lone pairs bending angles, lone pairs choosing equatorial spots, or " + XEF2 + " being linear?" },
      { id:"j2", q:"In your own words, explain the difference between the electron-group arrangement and the molecular shape." },
      { id:"j3", q:"Explain to a friend the steps from a formula to a 3D shape." },
      { id:"j4", q:"Which shapes do you still mix up? How will you practise them?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"What is the molecular shape of an " + AXE(3, 1) + " molecule?", options:[
          { t:"Trigonal pyramidal", ok:true, why:"Four groups; one is a lone pair." },
          { t:"Tetrahedral", why:"That’s the electron-group arrangement." },
          { t:"Trigonal planar", why:"The lone pair counts as a group." },
          { t:"T-shaped", why:"That’s " + AXE(3, 2) + "." }] },
        b:{ prompt:"What is the molecular shape of an " + AXE(2, 2) + " molecule?", options:[
          { t:"Bent", ok:true, why:"Four groups; two are lone pairs." },
          { t:"Tetrahedral", why:"The electron groups are tetrahedral, but the shape is named from the atoms only: " + AXE(2, 2) + " is bent." },
          { t:"Linear", why:"Lone pairs occupy space: with four groups, the two atoms can’t sit opposite each other." },
          { t:"Trigonal planar", why:"That would be three groups with no lone pairs." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"What is the ideal bond angle in a trigonal planar molecule?", options:[
          { t:"120°", ok:true, why:"Three groups spread evenly in a plane: 360° ÷ 3." },
          { t:"109.5°", why:"That’s tetrahedral." },
          { t:"90°", why:"That’s octahedral." },
          { t:"180°", why:"That’s linear." }] },
        b:{ prompt:"What is the ideal bond angle in a tetrahedral molecule?", options:[
          { t:"109.5°", ok:true, why:"Four groups point to the corners of a tetrahedron." },
          { t:"120°", why:"That’s trigonal planar." },
          { t:"90°", why:"That’s a flat square, not a tetrahedron." },
          { t:"107°", why:"That’s squeezed by a lone pair, as in " + NH3 + "." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"How many electron groups surround C in methanal (" + CH2O + ")?", options:[
          { t:"3", ok:true, why:"Two C–H bonds and one C=O." },
          { t:"4", why:"The double bond is one group." },
          { t:"2", why:"There are two H atoms and one O." },
          { t:"6", why:"Count groups, not electrons." }] },
        b:{ prompt:"How many electron groups surround C in " + HCN + "?", options:[
          { t:"2", ok:true, why:"One C–H and one C≡N." },
          { t:"4", why:"The triple bond is one group." },
          { t:"3", why:"Carbon has no lone pairs here." },
          { t:"5", why:"Count groups, not bonds within the triple bond." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"What are the shape and bond angle of the ammonium ion, " + NH4 + "?", options:[
          { t:"Tetrahedral, 109.5°", ok:true, why:"8 electrons: four N–H bonds, no lone pair." },
          { t:"Trigonal pyramidal, ≈ 107°", why:NH4 + " has no lone pair; the fourth H uses it." },
          { t:"Square planar, 90°", why:"Paper is flat, but molecules aren’t. " + NH4 + "’s bonds point to the corners of a tetrahedron at 109.5°." },
          { t:"Tetrahedral, ≈ 107°", why:"With no lone pair, the angle isn’t squeezed." }] },
        b:{ prompt:"What are the shape and bond angle of the hydronium ion, " + H3O + "?", options:[
          { t:"Trigonal pyramidal, less than 109.5°", ok:true, why:"8 electrons: three O–H bonds and one lone pair." },
          { t:"Trigonal planar, 120°", why:"Lone pairs occupy space. " + H3O + " has four groups, so it is trigonal pyramidal, not planar." },
          { t:"Tetrahedral, 109.5°", why:"The electron groups are tetrahedral, but the shape is named from the atoms only: " + H3O + " is trigonal pyramidal." },
          { t:"Bent, ≈ 104.5°", why:"Subtract 1 for the charge: one lone pair, not two." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"What is the shape of " + CLF3 + "?", options:[
          { t:"T-shaped", ok:true, why:AXE(3, 2) + ", with the two lone pairs equatorial." },
          { t:"Trigonal planar", why:"Cl has two lone pairs." },
          { t:"Trigonal pyramidal", why:"Lone pairs go equatorial in a trigonal bipyramid." },
          { t:"Seesaw", why:"That’s " + AXE(4, 1) + "." }] },
        b:{ prompt:"What is the shape of " + BRF5 + "?", options:[
          { t:"Square pyramidal", ok:true, why:"42 electrons: " + AXE(5, 1) + ", octahedral arrangement." },
          { t:"Trigonal bipyramidal", why:"Br has a lone pair: 6 groups." },
          { t:"Octahedral", why:"That’s the arrangement, not the shape." },
          { t:"Seesaw", why:"That’s " + AXE(4, 1) + "." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Rank " + CH4 + ", " + NH3 + " and " + H2O + " by bond angle, largest first.", options:[
          { t:CH4 + " > " + NH3 + " > " + H2O, ok:true, why:"0, 1, then 2 lone pairs." },
          { t:"All equal at 109.5°", why:M4 },
          { t:H2O + " > " + NH3 + " > " + CH4, why:"Lone pairs shrink angles; they don’t widen them." },
          { t:NH3 + " > " + CH4 + " > " + H2O, why:CH4 + " has no lone pair, so its angle is the largest." }] },
        b:{ prompt:"Rank " + BF3 + ", " + CH4 + " and " + NH3 + " by bond angle, largest first.", options:[
          { t:BF3 + " > " + CH4 + " > " + NH3, ok:true, why:"120°, 109.5°, ≈ 107°." },
          { t:CH4 + " > " + BF3 + " > " + NH3, why:BF3 + " is flat: 120°." },
          { t:"All equal", why:"A lone pair spreads wider than a bonding pair, so it squeezes " + NH3 + "’s angle, and " + BF3 + "’s three groups spread to 120°." },
          { t:NH3 + " > " + CH4 + " > " + BF3, why:"Reversed." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why water is bent, not linear?", options:[
          { t:"“Oxygen has four electron groups (two bonds, two lone pairs) arranged tetrahedrally. Naming only the atoms gives a bent shape.”", ok:true, why:"It counts every group for the arrangement, then names the shape from the atoms." },
          { t:"“The H atoms repel each other more than the lone pairs do.”", why:"Lone pairs repel more." },
          { t:"“Oxygen forms two double bonds.”", why:"Water has single bonds." },
          { t:"“Water is tetrahedral.”", why:M2 }] },
        b:{ prompt:"Which is the best explanation of why ammonia is trigonal pyramidal, not trigonal planar?", options:[
          { t:"“Nitrogen has four electron groups (three bonds, one lone pair) arranged tetrahedrally. The lone pair pushes the three H atoms into a pyramid.”", ok:true, why:"It counts the lone pair as a group, then names the shape from the atoms." },
          { t:"“Nitrogen has three groups.”", why:M3 },
          { t:"“The H atoms attract each other.”", why:"Bonding pairs repel." },
          { t:"“Ammonia is tetrahedral.”", why:"The electron groups are tetrahedral, but the shape is named from the atoms only: ammonia is trigonal pyramidal." }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which wedge-and-dash description correctly shows " + CH4 + "?", options:[
          { t:"“Two bonds in the plane of the page, one wedge toward you, one dash away”", ok:true, why:"Two bonds in the page, one toward you and one away: a tetrahedron on flat paper." },
          { t:"“Four bonds in the plane at 90°”", why:M7 },
          { t:"“Three wedges and one dash”", why:"That crowds three bonds toward you." },
          { t:"“All four bonds drawn as wedges”", why:"Some must point away." }] },
        b:{ prompt:"Which description correctly shows " + NH3 + "?", options:[
          { t:"“N at the top with its lone pair above; one N–H in the plane, one wedge, one dash, all angled down”", ok:true, why:"Three bonds angle down from N, with the lone pair above: a pyramid on flat paper." },
          { t:"“All three N–H bonds in the plane at 120°”", why:M3 },
          { t:"“Three wedges pointing up”", why:"The H atoms sit below the N." },
          { t:"“A square with N in the middle”", why:"Paper is flat, but molecules aren’t. " + NH3 + "’s bonds point down toward three corners of a tetrahedron." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Sulfur hexafluoride (" + SF6 + ") is an insulating gas in electrical equipment. Predict its shape and its F–S–F angles.", options:[
          { t:"Octahedral; 90° and 180°", ok:true, why:AXE(6) + "." },
          { t:"Hexagonal and flat, with 60°", why:"The bonds point in 3D." },
          { t:"Trigonal bipyramidal, 90° and 120°", why:"That’s 5 groups." },
          { t:"Tetrahedral, 109.5°", why:"That’s 4 groups." }] },
        // VERIFY: the date and details of Bartlett's discovery (UBC, 1962) and of XeF4's first report (plan §6 item 5).
        b:{ prompt:"Neil Bartlett, at the University of British Columbia, made the first noble-gas compound in 1962, and xenon tetrafluoride was reported soon after. Predict the shape of " + XEF4 + ".", options:[
          { t:"Square planar", ok:true, why:AXE(4, 2) + ", with the lone pairs opposite." },
          { t:"Tetrahedral", why:"Xe has two lone pairs." },
          { t:"Seesaw", why:"That’s one lone pair." },
          { t:"Octahedral", why:"That’s the arrangement." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Predict the shape of the nitrite ion, " + NO2 + ".", options:[
          { t:"Bent, with an angle less than 120°", ok:true, why:AXE(2, 1) + ": two groups to O and one lone pair on N." },
          { t:"Linear", why:"N has a lone pair." },
          { t:"Bent, less than 109.5°", why:"N has only one lone pair: a trigonal planar arrangement." },
          { t:"Trigonal planar", why:"That’s the arrangement." }] },
        b:{ prompt:"Predict the shape of the carbonate ion, " + CO3 + ".", options:[
          { t:"Trigonal planar, 120°", ok:true, why:"Three groups (resonance doesn’t change the count), no lone pairs on C." },
          { t:"Trigonal pyramidal", why:"C has no lone pair." },
          { t:"Tetrahedral", why:"The C=O is one group." },
          { t:"Bent", why:"Three atoms surround the C." }] } }
    ]
  },
  task:{
    title:"Lone pairs in charge", summary:"Lone pairs in charge",
    statement:"<p>Design an " + AXmEn + " molecule that meets every condition. Can you find all the answers?</p><ol class=\"vs-conds\"><li>The central atom has at least one lone pair.</li><li>At least one pair of bonded atoms is 180° apart.</li><li>At least one pair of bonded atoms is 90° apart.</li><li>The central atom has at most 4 bonded atoms.</li></ol>",
    inputs:{ x:"Bonded atoms (X)", e:"Lone pairs (E)", note:"Only the 13 standard AXE combinations are allowed.", model:"Live 3D model", arcs:"Arcs mark the ideal angles between bonded atoms." },
    checks:["Lone pair on the centre", "A 180° pair of atoms", "A 90° pair of atoms", "At most 4 bonded atoms"],
    tips:["Add at least one lone pair.", "Atoms 180° apart appear in linear, five-group and six-group arrangements.", "90° angles come only from five- and six-group arrangements.", "Square pyramidal has 5 atoms: too many."],
    explainPrompt:"Explain why each answer needs 5 or 6 electron groups, and where the lone pairs sit.",
    vocab:"Use the words electron group, lone pair, equatorial and molecular shape.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Every answer has 5 or 6 electron groups. Only those arrangements have both 90° and 180° positions."
  },
  cards:[
    ["VSEPR idea", "Electron groups around a central atom repel and spread as far apart as possible."],
    ["Electron group", "A bonding region (single, double or triple) or a lone pair."],
    [AXmEn, "A = central atom, X = bonded atoms, E = lone pairs."],
    ["2, 3, 4 groups", "Linear 180°; trigonal planar 120°; tetrahedral 109.5°."],
    ["5, 6 groups", "Trigonal bipyramidal (90°, 120°); octahedral (90°)."],
    ["Arrangement vs shape", "The arrangement counts lone pairs; the shape names atoms only."],
    ["Four groups, three shapes", AXE(4) + " tetrahedral; AX<sub>3</sub>E trigonal pyramidal; " + AXE(2, 2) + " bent."],
    ["Lone pairs and angles", "Lone pairs squeeze bond angles: 109.5° → ≈ 107° → ≈ 104.5°."],
    ["Five groups with lone pairs", "Lone pairs go equatorial: seesaw (E<sub>1</sub>), T-shaped (E<sub>2</sub>), linear (E<sub>3</sub>)."],
    ["Six groups with lone pairs", "Square pyramidal (E<sub>1</sub>); square planar (E<sub>2</sub>, lone pairs opposite)."],
    ["Wedge and dash", "Solid wedge toward you; dashed wedge away; plain line in the page."],
    ["Route to a shape", "Formula → Lewis → AXE → arrangement → shape → angle."]
  ]
};
