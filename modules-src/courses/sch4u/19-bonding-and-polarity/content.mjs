// SCH4U 19 Chemical Bonding and Polarity. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/19-bonding-and-polarity.md
// The hero, the Polarity m&#101;ter (Explore), the inquiry bench (Part 3), the "Polar or not?" chips and the task's live model are
// drawn by app.js, which takes electronegativities from MV.chem.data.EN (Xe is a local course table addition).

const F = (s) => s.replace(/([A-Za-z)])(\d+)/g, "$1<sub>$2</sub>");
const TA = ' <span class="tiny muted">(course table addition)</span>';
const DN = "δ−", DP = "δ+";

// Misconception core sentences (plan §3)
const M1 = "Bond dipoles can cancel. In linear " + F("CO2") + " the two C=O dipoles point in opposite directions.";
const M2 = "Draw the 3D shape first; symmetry decides whether the dipoles cancel.";
const M3 = "The lone pair makes " + F("NH3") + " a pyramid, so the bond dipoles don’t cancel.";
const M4 = DN + " sits on the atom with the higher electronegativity; the dipole arrow points to it.";
const M5 = "The cut-offs are a guide. Bonding is a continuum, so check the model against properties.";
const M6 = "ΔEN is a difference: subtract the smaller value from the larger.";
const M7 = "‘Like’ means similar polarity. Salt dissolves in water (polar), not in hexane (nonpolar).";

const ENUSE = "Course table (Pauling): H 2.20 · B 2.04 · C 2.55 · N 3.04 · O 3.44 · F 3.98 · P 2.19 · S 2.58 · Cl 3.16 · Br 2.96 · I 2.66";

// Practice 1 items: [bond, working, box, why]
const SORT = [
  ["C–H", "2.55 − 2.20 = 0.35", "np", "0.35 is below 0.5: nonpolar covalent."],
  ["Cl–Cl", "3.16 − 3.16 = 0", "np", "Identical atoms share equally: ΔEN = 0."],
  ["C–S", "2.58 − 2.55 = 0.03", "np", "0.03 is far below 0.5: nonpolar covalent."],
  ["O–H", "3.44 − 2.20 = 1.24", "pc", "1.24 is between 0.5 and 1.7: polar covalent."],
  ["N–H", "3.04 − 2.20 = 0.84", "pc", "0.84 is between 0.5 and 1.7: polar covalent."],
  ["C–Cl", "3.16 − 2.55 = 0.61", "pc", "0.61 is between 0.5 and 1.7: polar covalent."],
  ["Al–Cl", "3.16 − 1.61 = 1.55", "pc", "1.55 is below 1.7: polar covalent, even though Al is a metal."],
  ["Na–Cl", "3.16 − 0.93 = 2.23", "io", "2.23 is above 1.7: mostly ionic."],
  ["Mg–O", "3.44 − 1.31 = 2.13", "io", "2.13 is above 1.7: mostly ionic."],
  ["K–Br", "2.96 − 0.82 = 2.14", "io", "2.14 is above 1.7: mostly ionic."]
];
const BOXN = { np:"nonpolar covalent", pc:"polar covalent", io:"mostly ionic" };
const sortItems = SORT.map((r, i) => {
  const wrong = {};
  if (r[2] !== "io") wrong.io = M6;
  if (r[0] === "Al–Cl") wrong.io = "Metal plus nonmetal isn’t automatically ionic: ΔEN is only 1.55.";
  if (r[0] === "C–H") wrong.pc = "0.35 is below 0.5.";
  return { id:"s" + (i + 1), t:r[0], answer:r[2], goal:i < 7 ? [1, 2] : 1, why:r[1] + ". " + r[3], wrong,
    hints:["Subtract the course-table values.", "Compare with 0.5 and 1.7.", r[0] + ": " + r[1] + ", so the bond is " + BOXN[r[2]] + "."] };
});

// Practice 2 items (R1–R5 hints: plan gives none; built from M2 and each item's own feedback)
const pol = (id, prompt, isPolar, why, star, extra) => ({ id, goal:3, star:!!star, prompt,
  options:[{ t:"Polar", ok:isPolar || undefined, why }, { t:"Nonpolar", ok:!isPolar || undefined, why }].map(o => { if (!o.ok) delete o.ok; return o; }),
  hints:[M2, extra, why + " " + (isPolar ? "Polar." : "Nonpolar.")] });

export default {
  id:"19-bonding-and-polarity",
  kind:"topic",
  title:"Chemical bonding and polarity",
  topic:"Chemical Bonding and Polarity",
  readyTopic:"bonding and polarity",
  hero:{
    eq:'<span class="bp-heq"><span class="nw">ΔEN = 3.44 − 2.20 = 1.24</span> <span class="nw">(O–H: polar)</span> → <span class="nw">bent H<sub>2</sub>O</span> → <span class="nw">net dipole</span> → <span class="nw">polar molecule</span></span>',
    eqSize:"sm",
    eqLabel:"Delta E N equals 3.44 minus 2.20 equals 1.24, so the O–H bond is polar; water is bent, so it has a net dipole and is a polar molecule",
    headline:"Polar bonds, but is the molecule polar?",
    text:"When two atoms share electrons unequally, the bond is <strong>polar</strong>: the more <strong>electronegative</strong> atom carries δ−. Whether a whole molecule is polar depends on its <strong>shape</strong>. Symmetric molecules cancel their <strong>bond dipoles</strong>; lopsided ones keep a <strong>net dipole</strong>.",
    fig:{ html:'<div class="bp-hx"><svg class="bp-hx-svg" id="bp-hx-svg" viewBox="0 0 440 340" role="img" aria-label="A CO₂ molecule appears with two dipole arrows pointing outward toward the O atoms. The arrows slide tip to tail and cancel to a dot labelled net dipole 0. An H₂O molecule appears with its two O–H dipoles pointing up toward O; added tip to tail, they make one longer arrow labelled net dipole. A charged rod comes near two streams: water bends toward it, oil falls straight."></svg><div class="bp-hx-row"><p class="bp-hx-cap" id="bp-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="bp-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can calculate ΔEN from the course table and classify a bond as nonpolar covalent, polar covalent or mostly ionic.",
    "I can label partial charges and draw the bond dipole for a polar bond.",
    "I can decide whether a molecule is polar by combining its shape with its bond dipoles.",
    "I can use polarity to predict solubility (“like dissolves like”) and the behaviour of liquid streams.",
    "I can explain the limits of the ΔEN model using evidence."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Electronegativity", goal:1,
          prompt:"Using the course table, what is the electronegativity of chlorine?",
          use:ENUSE,
          options:[
            { t:"3.16", ok:true, why:"Chlorine is 3.16 in the course table." },
            { t:"2.96", why:"That’s bromine." },
            { t:"3.44", why:"That’s oxygen." },
            { t:"17", why:"17 is chlorine’s atomic number." }],
          hints:["Find Cl in the course table.", "It’s just below F.", "3.16."] },
        { id:"w2", skill:"Electronegativity", goal:2,
          prompt:"Which atom attracts shared electrons more strongly in an N–H bond?",
          use:"Course table (Pauling): N 3.04 · H 2.20",
          options:[
            { t:"N", ok:true, why:"3.04 > 2.20." },
            { t:"H", why:"Hydrogen’s value is lower." },
            { t:"Both equally", why:"The values differ by 0.84." },
            { t:"Neither", why:"One always pulls harder unless the atoms are identical." }],
          hints:["Compare the values.", "N 3.04, H 2.20.", "N."] },
        { id:"w3", skill:"VSEPR shapes", goal:3,
          prompt:"What is the shape of " + F("CCl4") + "?",
          options:[
            { t:"Tetrahedral", ok:true, why:"AX<sub>4</sub>." },
            { t:"Square planar", why:"Carbon has no lone pairs; four groups make a tetrahedron." },
            { t:"Trigonal pyramidal", why:"That needs a lone pair." },
            { t:"Bent", why:"Four atoms surround C." }],
          hints:["Lone pairs on C?", "None: AX<sub>4</sub>.", "Tetrahedral."] },
        { id:"w4", skill:"VSEPR shapes", goal:3,
          prompt:"What is the shape of " + F("BF3") + "?",
          options:[
            { t:"Trigonal planar", ok:true, why:"AX<sub>3</sub>." },
            { t:"Trigonal pyramidal", why:"Boron has no lone pair." },
            { t:"T-shaped", why:"That’s AX<sub>3</sub>E<sub>2</sub>." },
            { t:"Tetrahedral", why:"Only three groups." }],
          hints:["B has 6 electrons around it.", "Three groups, no lone pairs.", "Trigonal planar."] },
        { id:"w5", skill:"Adding arrows", goal:3,
          prompt:"Two equal arrows point in exactly opposite directions. What is their sum?",
          options:[
            { t:"Zero", ok:true, why:"They cancel." },
            { t:"Twice one arrow", why:"That’s when they point the same way." },
            { t:"One arrow", why:"They cancel completely." },
            { t:"It depends on their length only", why:"Direction matters." }],
          hints:["Place them tip to tail.", "You end up back at the start.", "Zero."] },
        { id:"w6", skill:"Adding arrows", goal:3,
          prompt:"Two equal arrows point up and to the left and up and to the right, at the same angle. Which way does their sum point?",
          options:[
            { t:"Straight up", ok:true, why:"The sideways parts cancel; the upward parts add." },
            { t:"Straight down", why:"Both arrows have upward parts." },
            { t:"To the left", why:"The left and right parts cancel." },
            { t:"Zero", why:"Only the sideways parts cancel." }],
          hints:["Split each arrow into sideways and up parts.", "The sideways parts are opposite.", "Straight up."] }
      ],
      refreshers:{
        "Electronegativity":"How strongly an atom pulls bonding electrons (course table). F is highest. Values rise across a period and fall down a group.",
        "VSEPR shapes":"Count electron groups and lone pairs; name the shape from the atoms (module 18).",
        "Adding arrows":"Arrows add tip to tail. Equal and opposite arrows cancel; symmetric arrangements cancel."
      }
    }
  },
  explore:{
    heading:"Polarity m&#101;ter",
    intro:"Measure bonds, then build whole molecules and add their dipoles. Swap atoms and watch the polarity change.",
    how:"Choose a mode. <strong>Bond m&#101;ter:</strong> tap two atoms in the electronegativity table. <strong>Molecule dipoles:</strong> pick a molecule. <strong>Swap an atom:</strong> tap any outer atom on the model to cycle it H → F → Cl. Drag the model or use the arrow keys to turn it. <strong>Add the dipoles</strong> slides the bond dipoles tip to tail.",
    modes:[{ id:"bond", t:"Bond m&#101;ter" }, { id:"mol", t:"Molecule dipoles" }, { id:"swap", t:"Swap an atom" }],
    mols:["co2", "h2o", "nh3", "ch4", "ccl4", "chcl3", "ch2cl2", "ch3cl", "bf3", "so3", "pcl5", "sf4", "xef4", "clf3", "sf6", "ch2o", "ch3oh", "hcn"],
    frames:[{ id:"tet", t:"Tetrahedral CX<sub>4</sub>" }, { id:"sq", t:"Square planar XeX<sub>4</sub>" }],
    rows:["ΔEN (each bond)", "Bond type (course model)", DN + " on", "Shape", "Bond dipoles", "Net dipole", "Molecule"],
    xeNote:"Xe 2.60" + TA,
    predIntro:"Each prediction sets up the polarity m&#101;ter. Choose an answer, then watch what happens.",
    predictions:[
      { id:"p1", prompt:"Each C=O bond is polar (ΔEN 0.89). Is " + F("CO2") + " polar?",
        options:[{ t:"No: its dipoles cancel", ok:true }, { t:"Yes: it has polar bonds" }, { t:"Yes: oxygen is more electronegative" }, { t:"No: its bonds are nonpolar" }],
        explain:"Linear and symmetric, so the dipoles are equal and opposite. " + M1 },
      { id:"p2", prompt:"Swap one Cl for H, making " + F("CHCl3") + ". Polar or nonpolar?",
        options:[{ t:"Polar", ok:true }, { t:"Nonpolar" }, { t:"It depends which Cl is swapped" }, { t:"It’s ionic now" }],
        explain:"C–H (0.35) and C–Cl (0.61) dipoles differ, so the tetrahedron is no longer balanced. In a tetrahedron, every position is equivalent. " + M2 },
      { id:"p3", prompt:"ΔEN = 3.16 − 0.93 = 2.23. Which bond type does the course model give?",
        options:[{ t:"Mostly ionic", ok:true }, { t:"Polar covalent" }, { t:"Nonpolar covalent" }, { t:"Metallic" }],
        explain:"Sodium chloride is an ionic lattice of Na<sup>+</sup> and Cl<sup>−</sup>." },
      { id:"p4", prompt:"Both have three polar bonds. Which is polar?",
        options:[{ t:F("NH3"), ok:true }, { t:F("BF3") }, { t:"Both" }, { t:"Neither" }],
        explain:F("NH3") + "’s lone pair makes it a pyramid. " + M3 }
    ],
    predSetup:{ p1:F("CO2") + " in Molecule dipoles mode.", p2:"Swap an atom mode, starting from " + F("CCl4") + ".", p3:"Bond m&#101;ter: Na with Cl.", p4:F("BF3") + " and " + F("NH3") + " side by side." },
    chalIntro:"Use the polarity m&#101;ter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Bond m&#101;ter: make a bond with ΔEN between 0.5 and 1.0.",
        why:"Between 0.5 and 1.0 the course model calls the bond polar covalent, at the low end of the range.",
        hints:["Pick atoms with nearby values.", "Try carbon with a halogen.", "C–Cl: 3.16 − 2.55 = 0.61."] },
      { id:"tc2", goal:3, prompt:"Swap mode (tetrahedral CX<sub>4</sub>, with H or Cl at each position): mark every combination as polar or nonpolar.",
        why:"Only " + F("CH4") + " and " + F("CCl4") + " have four identical outer atoms, so only their dipoles cancel. " + F("CH3Cl") + ", " + F("CH2Cl2") + " and " + F("CHCl3") + " are polar.",
        hints:["When are all four positions identical?", "Only " + F("CH4") + " and " + F("CCl4") + ".", "Any mixture in a tetrahedron is polar."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Square planar frame AX<sub>2</sub>Y<sub>2</sub> (two F and two Cl): arrange them to make one polar version and one nonpolar version.",
        why:"Opposite (trans) dipoles cancel; side by side (cis), they don’t. Module 11 calls these cis and trans isomers.",
        hints:["Which positions in a square point in opposite directions?", "Put the two F atoms opposite each other.", "Opposite (trans) cancels; side by side (cis) doesn’t. Module 11 calls these cis and trans isomers."] }
    ],
    msgs:{
      tc1:{ low:"Nonpolar by the course model.", high:"Too far apart for this range.", none:"Pick two atoms in the Bond m&#101;ter first." },
      tc2:{ ch2cl2:"In a tetrahedron, two Cl and two H can’t cancel. It’s polar however you arrange them.", ccl4:M1,
        unmarked:"Mark all five combinations in the table beside the model.", other:"Not every mark is right yet. Build each combination and read its net dipole." },
      tc3:{ none:"In a square plane, opposite positions cancel.", needPolar:"That’s the nonpolar version. Now make a polar one.", start:"Use the square planar frame with two F and two Cl." },
      marks:"Mark each combination", markHow:"Build each one with the model, then mark it.", found:"Versions you’ve made (two F, two Cl)",
      cis:"Polar version (F atoms side by side)", trans:"Nonpolar version (F atoms opposite)"
    },
    blocks:[
      { title:"The big idea", html:"<p>The same polar bonds can make a polar or a nonpolar molecule. Shape decides.</p>" }
    ]
  },
  part3:{
    slug:"polarity-tests", name:"Polarity tests", heading:"Does it bend? Does it dissolve?",
    intro:"A virtual inquiry bench. Test three liquids with a charged rod, then test which solids dissolve in water and in hexane. Record what you see, then zoom in to the particles to explain it.",
    s1:{ title:"Station 1: The charged rod",
      intro:"Three burettes release thin streams of water, ethanol and hexane. Hold the charged plastic rod next to each stream, at the same distance each time, and watch.",
      rodLabel:"Hold the rod next to", away:"No stream (rod away)",
      liquids:[
        { id:"water", t:"Water", pol:"polar", obs:"Bends strongly toward the rod" },
        { id:"ethanol", t:"Ethanol", pol:"polar", obs:"Bends, but less than water" },
        { id:"hexane", t:"Hexane", pol:"nonpolar", obs:"Doesn’t bend: falls straight" }],
      table:{ head:["Liquid", "Molecules", "What the stream does"], wait:"Not tested yet" },
      zoom:"Zoom to the particles",
      zoomText:{ polar:"The rod is negatively charged. Each polar molecule turns so its δ+ end (the H atoms) faces the rod, and the whole stream is pulled toward it.",
        hexane:"Hexane molecules are nonpolar: they have no δ+ or δ− ends, so nothing turns and nothing pulls. The stream falls straight.",
        away:"With the rod away, the molecules point every which way and the stream falls straight." },
      inv:{ prompt:"<strong>Investigation:</strong> Which variables must stay the same for a fair comparison? Choose all that apply.",
        chips:[{ id:"charge", t:"Rod charge", need:true }, { id:"dist", t:"Distance from the rod", need:true }, { id:"width", t:"Stream width", need:true }, { id:"colour", t:"Liquid colour" }],
        right:"Right. The rod’s charge, its distance from the stream and the stream’s width all change how far a stream bends, so they stay the same. Only the liquid changes. Its colour doesn’t affect bending, so it doesn’t need controlling.",
        colour:"A liquid’s colour doesn’t affect how far it bends, so it doesn’t need to be controlled.",
        missing:"Something else could also change how far a stream bends. Think about the rod and the stream itself." } },
    s2:{ title:"Station 2: Like dissolves like",
      intro:"Tap a test tube to add the solid and shake it. Test each solid in water (polar) and in hexane (nonpolar).",
      solvents:[{ id:"water", t:"Water (polar)" }, { id:"hexane", t:"Hexane (nonpolar)" }],
      solutes:[{ id:"i2", t:"Iodine (I<sub>2</sub>)" }, { id:"nacl", t:"Sodium chloride (NaCl)" }, { id:"sugar", t:"Sugar" }],
      res:{ "i2|water":{ d:"barely", t:"Barely dissolves: a pale brown tint, and most of the solid stays." },
        "i2|hexane":{ d:"yes", t:"Dissolves: a violet solution." },
        "nacl|water":{ d:"yes", t:"Dissolves: a clear, colourless solution." },
        "nacl|hexane":{ d:"no", t:"Doesn’t dissolve: the crystals stay at the bottom." },
        "sugar|water":{ d:"yes", t:"Dissolves: a clear, colourless solution." },
        "sugar|hexane":{ d:"no", t:"Doesn’t dissolve: the crystals stay at the bottom." } },
      table:{ title:"Check it with data", head:["Substance", "Water", "Hexane"], cells:{ "i2|water":"Barely dissolves", "i2|hexane":"Dissolves (violet solution)", "nacl|water":"Dissolves", "nacl|hexane":"Doesn’t", "sugar|water":"Dissolves", "sugar|hexane":"Doesn’t" }, wait:"?" },
      zoom:"Zoom to the particles",
      zoomText:"Water molecules surround each ion: the δ− O ends face Na<sup>+</sup>, and the δ+ H ends face Cl<sup>−</sup>. Hexane molecules have no charged ends, so the ions stay locked in the crystal. Iodine is the opposite case: nonpolar I<sub>2</sub> mixes with nonpolar hexane. (A first look at module 21.)" },
    s3:{ title:"Station 3: In the world",
      html:"<p><strong>Oil on a lake.</strong> Oil is a mixture of hydrocarbons, which are nonpolar. It doesn’t mix with polar water, and it’s less dense, so it spreads into a thin sheen on the surface.</p><p><strong>Oil-and-vinegar dressing.</strong> Vinegar is mostly water. Shake the bottle and the oil breaks into droplets, but the layers separate again, with the less dense oil on top.</p><p><strong>Why grease needs soap.</strong> A soap particle has a long nonpolar tail and a charged head. The tails dissolve in the grease and the heads face the water, so the grease lifts off in tiny droplets that rinse away.</p><p><strong>Oil spills in Canadian waters.</strong> Canada has the longest coastline in the world, and the Great Lakes and major rivers carry ships too. Clean-up methods depend on polarity: floating booms hold the oil on the surface, skimmers scoop up the top layer, sorbent pads made of nonpolar materials soak up oil but not water, and dispersants act like soap, breaking the oil into tiny droplets that spread through the water. Each method has trade-offs, so responders choose them case by case.</p>",
      aria:"A lake with a thin layer of oil floating on the water, and a bottle of salad dressing with a layer of oil on top of vinegar." },
    quickCheck:{
      title:"Quick check", summary:"Polarity tests quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which stream bends toward a charged rod?",
          choices:[{ t:"Water", ok:true, fb:"Right. Water molecules are polar, and only polar molecules turn to face the rod." }, { t:"Hexane", fb:"Only polar molecules turn to face the rod." }, { t:"Both", fb:"Only polar molecules turn to face the rod." }, { t:"Neither", fb:"Only polar molecules turn to face the rod." }] },
        { id:"q2", goal:4, prompt:"Iodine dissolves best in…",
          choices:[{ t:"Hexane", ok:true, fb:"Right. Nonpolar dissolves in nonpolar: I<sub>2</sub> and hexane are both nonpolar." }, { t:"Water", fb:"Nonpolar dissolves in nonpolar. " + M7 }, { t:"Salt water", fb:"Nonpolar dissolves in nonpolar. " + M7 }, { t:"Vinegar", fb:"Nonpolar dissolves in nonpolar. " + M7 }] },
        { id:"q3", goal:4, prompt:"Why does oil float on water instead of dissolving?",
          choices:[{ t:"Oil is nonpolar and less dense", ok:true, fb:"Right. Two separate facts: polarity stops it mixing; density makes it float." }, { t:"Oil is ionic", fb:"Two separate facts: polarity stops it mixing; density makes it float." }, { t:"Water is nonpolar", fb:"Two separate facts: polarity stops it mixing; density makes it float." }, { t:"Oil is denser", fb:"Two separate facts: polarity stops it mixing; density makes it float." }] },
        { id:"q4", goal:4, prompt:"In the rod test, which change would spoil the comparison?",
          choices:[{ t:"Moving the rod closer for hexane", ok:true, fb:"Right. Change only the liquid." }, { t:"Using equal stream widths", fb:"Change only the liquid. Equal widths keep the test fair." }, { t:"Using the same rod", fb:"Change only the liquid. The same rod keeps the test fair." }, { t:"Keeping the room still", fb:"Change only the liquid. A still room keeps the test fair." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sorter", type:"sorter", title:"Bond-type sorter", summary:"Bond-type sorter", noun:"bond", goal:[1, 2], txt:true,
        instruction:"Find ΔEN for each bond from the course table, then sort the bond into its box (course model).",
        how:"Tap a bond, then tap the box it belongs in. <span class=\"uses bp-uses\"><strong>Use these values</strong>H 2.20 · C 2.55 · N 3.04 · O 3.44 · S 2.58 · Cl 3.16 · Br 2.96 · Na 0.93 · K 0.82 · Mg 1.31 · Al 1.61</span>",
        boxes:[{ id:"np", label:"Nonpolar covalent", sub:"ΔEN below 0.5" }, { id:"pc", label:"Polar covalent", sub:"ΔEN 0.5 to 1.7" }, { id:"io", label:"Mostly ionic", sub:"ΔEN above 1.7" }],
        wrongDefault:"Subtract the course-table values, then compare with 0.5 and 1.7.",
        items:sortItems },
      { id:"polar", type:"custom", title:"Polar or not?", summary:"Polar or not?", star:true, goal:[3, 5],
        instruction:"Six molecules. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap a choice, then press <strong>Check</strong>.",
        items:[
          pol("r1", F("SO3") + " (trigonal planar)", false, "Three equal S–O dipoles at 120° cancel.", false, "Are all three S–O dipoles equal, and how are they spread?"),
          pol("r2", F("CH2O") + " (trigonal planar, C=O and two C–H)", true, "The C=O dipole isn’t balanced by the weaker C–H dipoles.", false, "Are the three bonds the same?"),
          pol("r3", F("SF4") + " (seesaw)", true, "The lone pair makes the shape lopsided.", true, "Where does the lone pair sit, and is the seesaw symmetric?"),
          pol("r4", F("XeF2") + " (linear)", false, "Opposite and equal: they cancel, despite three lone pairs.", true, "Which way do the two Xe–F dipoles point?"),
          pol("r5", F("ClF3") + " (T-shaped)", true, "The T isn’t symmetric: the stem dipole is left over.", true, "The two arms of the T are opposite each other. What about the stem?"),
          { id:"r6", goal:5, star:true,
            prompt:"<strong>Investigation:</strong> HF has ΔEN = 3.98 − 2.20 = 1.78, past the 1.7 cut-off, yet HF is a molecular substance (a gas just above room temperature, bp ≈ 20 °C" + TA + "). What should a careful chemist conclude?",
            options:[
              { t:"The cut-offs are a guide: HF is a very polar covalent molecule", ok:true, why:"Observed properties outrank a cut-off. " + M5 },
              { t:"HF is ionic", why:"Observed properties outrank a cut-off. " + M5 }],
            hints:["Ionic solids have high melting points.", "HF boils near room temperature.", "The model is a guide; the evidence says covalent."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Jiwoo", how:"", goal:[1, 3],
        instruction:"Jiwoo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Is " + F("CO2") + " polar?",
            steps:["ΔEN for C–O is 3.44 − 2.55 = 0.89.", "So each C=O bond is polar, with δ− on O.", "A molecule with polar bonds is polar, so " + F("CO2") + " is polar.", "So " + F("CO2") + " will bend toward a charged rod."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:F("CO2") + " is linear, so its two equal dipoles point in opposite directions and cancel: it’s nonpolar.", ok:true, why:M1 },
              { t:F("CO2") + " is polar because O is more electronegative.", why:M1 },
              { t:"The bonds are actually nonpolar.", why:"0.89 is polar." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["What is " + F("CO2") + "’s shape?", "Linear.", "The dipoles cancel."] },
          { id:"e2", goal:1, task:"Classify the C–F bond.",
            steps:["C is 2.55 and F is 3.98 (course table).", "ΔEN = 2.55 + 3.98 = 6.53.", "6.53 > 1.7, so the bond is ionic."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"ΔEN is a difference: 3.98 − 2.55 = 1.43, so the bond is polar covalent.", ok:true, why:"1.43 lies between 0.5 and 1.7. " + M6 },
              { t:"Divide: 3.98 ÷ 2.55.", why:M6 },
              { t:"Use atomic numbers: 9 − 6 = 3.", why:M6 },
              { t:"Step 2 is correct.", why:M6 }],
            hints:["What does Δ mean?", "Difference.", "1.43: polar covalent."] },
          { id:"e3", goal:3, task:"Is " + F("NH3") + " polar?",
            steps:["Each N–H bond has ΔEN 0.84: polar.", "The three N–H bonds are identical.", "Three identical dipoles always cancel, so " + F("NH3") + " is nonpolar."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", ""],
            fixes:[
              { t:"The lone pair makes " + F("NH3") + " trigonal pyramidal, so the three dipoles all lean toward the N side and add up: it’s polar.", ok:true, why:M3 },
              { t:"They cancel because N is in the middle.", why:M3 },
              { t:"N–H bonds are nonpolar.", why:"0.84 is polar." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Does " + F("NH3") + " have a lone pair?", "Yes, so its shape is a pyramid.", "Polar."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result in the polarity m&#101;ter surprised you most: " + F("CO2") + " being nonpolar, " + F("CHCl3") + " being polar, or the square-planar trick?" },
      { id:"j2", q:"In your own words, explain why you need both ΔEN and shape to decide polarity." },
      { id:"j3", q:"Explain to a friend what ‘like dissolves like’ really means, with one example." },
      { id:"j4", q:"Where do you still hesitate: calculating ΔEN, picturing shapes, or adding dipoles? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Using the course table, what are ΔEN and the bond type (course model) for an O–H bond?", use:"O 3.44 · H 2.20", options:[
          { t:"1.24; polar covalent", ok:true, why:"3.44 − 2.20." },
          { t:"5.64; mostly ionic", why:"That adds the two values. " + M6 },
          { t:"1.24; mostly ionic", why:"1.24 is below 1.7. " + M5 },
          { t:"0.24; nonpolar covalent", why:"Subtract carefully: 3.44 − 2.20 = 1.24." }] },
        b:{ prompt:"What are ΔEN and the bond type for a C–Cl bond?", use:"C 2.55 · Cl 3.16", options:[
          { t:"0.61; polar covalent", ok:true, why:"3.16 − 2.55." },
          { t:"5.71; mostly ionic", why:M6 },
          { t:"0.61; nonpolar covalent", why:"0.61 is above 0.5." },
          { t:"1.61; polar covalent", why:"Subtract carefully: 3.16 − 2.55 = 0.61." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In an N–H bond, which atom carries δ−, and which way does the dipole arrow point?", use:"N 3.04 · H 2.20", options:[
          { t:"N; toward N", ok:true, why:"N is more electronegative (3.04)." },
          { t:"H; toward H", why:M4 },
          { t:"N; toward H", why:"The arrow points to δ−. " + M4 },
          { t:"Neither; the bond is nonpolar", why:"0.84 is polar." }] },
        b:{ prompt:"In a C–O bond, which atom carries δ−, and which way does the dipole arrow point?", use:"C 2.55 · O 3.44", options:[
          { t:"O; toward O", ok:true, why:"O is more electronegative (3.44)." },
          { t:"C; toward C", why:M4 },
          { t:"O; toward C", why:M4 },
          { t:"Neither", why:"0.89 is polar." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which molecule is nonpolar?", options:[
          { t:F("CO2"), ok:true, why:"Linear: the dipoles cancel." },
          { t:F("H2O"), why:"Bent." },
          { t:F("NH3"), why:"Pyramidal. " + M3 },
          { t:F("CH3Cl"), why:"Mixed outer atoms." }] },
        b:{ prompt:"Which molecule is polar?", options:[
          { t:F("CHCl3"), ok:true, why:"The C–H and C–Cl dipoles don’t balance." },
          { t:F("CH4"), why:"Symmetric, with nearly nonpolar bonds." },
          { t:F("CCl4"), why:"Symmetric: the dipoles cancel. " + M1 },
          { t:F("BF3"), why:"Flat and symmetric. " + M1 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What are " + F("SF4") + "’s shape and polarity?", options:[
          { t:"Seesaw; polar", ok:true, why:"AX<sub>4</sub>E<sub>1</sub>: the lone pair makes it lopsided." },
          { t:"Tetrahedral; nonpolar", why:"S has a lone pair. " + M3 },
          { t:"Square planar; nonpolar", why:"That’s AX<sub>4</sub>E<sub>2</sub>." },
          { t:"Seesaw; nonpolar", why:"A seesaw isn’t symmetric. " + M2 }] },
        b:{ prompt:"What are " + F("XeF4") + "’s shape and polarity?", options:[
          { t:"Square planar; nonpolar", ok:true, why:"AX<sub>4</sub>E<sub>2</sub>: opposite Xe–F dipoles cancel." },
          { t:"Tetrahedral; nonpolar", why:"Right polarity, wrong shape: Xe has two lone pairs." },
          { t:"Square planar; polar", why:"Opposite dipoles cancel. " + M1 },
          { t:"Seesaw; polar", why:"That’s AX<sub>4</sub>E<sub>1</sub>." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which solvent dissolves solid iodine (I<sub>2</sub>) best?", options:[
          { t:"Hexane", ok:true, why:"Both are nonpolar." },
          { t:"Water", why:"Water is polar. " + M7 },
          { t:"Salt water", why:"Ions in water don’t help a nonpolar solute." },
          { t:"Vinegar", why:"Mostly water: polar." }] },
        b:{ prompt:"Which solvent dissolves potassium chloride best?", options:[
          { t:"Water", ok:true, why:"Polar water surrounds the K<sup>+</sup> and Cl<sup>−</sup> ions." },
          { t:"Hexane", why:M7 },
          { t:"Octane", why:M7 },
          { t:"Liquid iodine", why:"Nonpolar." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Two isomers of C<sub>2</sub>H<sub>2</sub>Cl<sub>2</sub> have a C=C with one Cl on each carbon: the Cl atoms on the same side (cis) or on opposite sides (trans). Which is polar?", options:[
          { t:"Cis", ok:true, why:"On the same side, the C–Cl dipoles add." },
          { t:"Trans", why:"The opposite C–Cl dipoles cancel." },
          { t:"Both", why:"In trans they cancel. " + M1 },
          { t:"Neither", why:"In cis they don’t cancel." }] },
        b:{ prompt:"Which dichlorobenzene isomer is nonpolar: 1,2- or 1,4-?", options:[
          { t:"1,4-dichlorobenzene", ok:true, why:"The Cl atoms are opposite, so the dipoles cancel." },
          { t:"1,2-dichlorobenzene", why:"Neighbouring Cl dipoles add." },
          { t:"Both", why:"Bond dipoles cancel only when they point in opposite directions. Neighbouring Cl dipoles in 1,2- add." },
          { t:"Neither", why:"1,4- cancels." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why " + F("CCl4") + " is nonpolar even though each C–Cl bond is polar?", options:[
          { t:"“The four equal C–Cl dipoles point to the corners of a tetrahedron, so they cancel.”", ok:true, why:"Symmetric shape, equal dipoles: they cancel." },
          { t:"“C–Cl bonds are nonpolar.”", why:"0.61 is polar." },
          { t:"“Carbon has no lone pairs, so nothing is polar.”", why:"Bonds can still be polar." },
          { t:"“Chlorine isn’t very electronegative.”", why:"Chlorine is 3.16." }] },
        b:{ prompt:"Which is the best explanation of why " + F("BF3") + " is nonpolar?", options:[
          { t:"“Its three equal B–F dipoles lie flat at 120° to each other and cancel.”", ok:true, why:"Flat, symmetric and equal: they cancel." },
          { t:"“B–F bonds are nonpolar.”", why:"ΔEN is large." },
          { t:"“Boron has an incomplete octet.”", why:"True, but not why it is nonpolar." },
          { t:"“Fluorine shares equally.”", why:"Fluorine is the most electronegative element." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which description correctly labels the HCl molecule?", use:"H 2.20 · Cl 3.16", options:[
          { t:"“δ+ on H and δ− on Cl, with the dipole arrow pointing to Cl”", ok:true, why:"Cl is more electronegative (3.16 vs 2.20)." },
          { t:"“δ− on H and δ+ on Cl.”", why:M4 },
          { t:"“δ+ on Cl, with the arrow pointing to H.”", why:M4 },
          { t:"“No charges: a covalent bond.”", why:"ΔEN 0.96 is polar." }] },
        b:{ prompt:"Which description correctly labels a water molecule?", options:[
          { t:"“δ− on O and δ+ on each H; the net dipole points toward the O side”", ok:true, why:"O is more electronegative, and the bent shape leaves a net dipole toward O." },
          { t:"“δ+ on O and δ− on H.”", why:M4 },
          { t:"“No net dipole because the two O–H bonds are equal.”", why:"Water is bent, so its two equal dipoles don’t cancel." },
          { t:"“The net dipole points toward the H atoms.”", why:M4 }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"After an oil spill on a lake, why does the oil spread on the surface instead of dissolving?", options:[
          { t:"Oil molecules are nonpolar and don’t mix with polar water, and oil is less dense, so it floats", ok:true, why:"Polarity stops it mixing; density makes it float." },
          { t:"Oil is ionic", why:"Hydrocarbons are nonpolar." },
          { t:"Oil molecules are polar but too large to dissolve", why:"They’re nonpolar." },
          { t:"Water molecules are nonpolar", why:"Water is polar." }] },
        b:{ prompt:"Why does an oil-and-vinegar salad dressing separate into layers?", options:[
          { t:"Oil is nonpolar, and vinegar is mostly polar water, so they don’t mix; the less dense oil rises", ok:true, why:"Polarity stops them mixing; density decides which layer is on top." },
          { t:"Vinegar is nonpolar", why:"Vinegar is mostly water." },
          { t:"Oil dissolves in vinegar, then falls out", why:M7 },
          { t:"The two liquids are the same polarity", why:M7 }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"AlCl<sub>3</sub> has ΔEN = 1.55. Solid AlCl<sub>3</sub> turns to vapour at a low temperature (about 180 °C), while NaCl (ΔEN 2.23) melts at 801 °C." + TA + " What is the best conclusion?", options:[
          { t:"AlCl<sub>3</sub> behaves more like a covalent substance, as its ΔEN predicts", ok:true, why:"1.55 is in the polar covalent range, and the low temperature fits separate molecules." },
          { t:"AlCl<sub>3</sub> must be ionic because it contains a metal", why:"A metal doesn’t guarantee an ionic bond. " + M5 },
          { t:"NaCl must be covalent", why:"Its high melting point fits an ionic lattice." },
          { t:"Melting points have nothing to do with bonding", why:"They do: lattices hold strongly." }] },
        b:{ prompt:"MgO (ΔEN 2.13) melts at about 2850 °C, while " + F("CO2") + " (C–O ΔEN 0.89) is a gas at room temperature." + TA + " What is the best conclusion?", options:[
          { t:"MgO is an ionic lattice with strong forces throughout; " + F("CO2") + " is made of separate molecules", ok:true, why:"The properties match the bond types the ΔEN model predicts." },
          { t:"Both are ionic", why:M5 },
          { t:F("CO2") + " is a gas because its bonds are weak", why:"Its C=O bonds are strong; the forces between molecules are weak." },
          { t:"MgO is covalent", why:M5 }] } }
    ]
  },
  task:{
    title:"Polar bonds, nonpolar molecule", summary:"Polar bonds, nonpolar molecule",
    statement:"<p>Choose a central atom and its outer atoms to build a molecule that meets every condition. Can you find all the answers?</p><ol class=\"bp-conds\"><li>It has at least one polar bond (ΔEN ≥ 0.5).</li><li>Its bond dipoles cancel (net dipole 0).</li><li>Every bond has ΔEN below 1.5.</li></ol>",
    inputs:{ centre:"Central atom", pos:"Position", centres:[{ id:"B", t:"B", sub:"3 outer positions" }, { id:"C", t:"C", sub:"4 outer positions" }, { id:"N", t:"N", sub:"3 positions, 1 lone pair" }, { id:"O", t:"O", sub:"2 positions, 2 lone pairs" }], outers:["H", "F", "Cl"] },
    checks:["At least one polar bond", "Dipoles cancel", "No bond near the ionic end"],
    tips:["C–H (0.35) and B–H (0.16) are nonpolar. Try F or Cl.", "A lone pair on the centre, or a mix of outer atoms, leaves a net dipole.", "B–F has ΔEN 1.94: too close to the ionic end for this design."],
    explainPrompt:"Explain how your molecule can have polar bonds but no net dipole.",
    vocab:"Use the words electronegativity difference, bond dipole, symmetric and lone pair.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each pairs polar bonds with a symmetric shape and no lone pair. " + F("BF3") + " also cancels, but its B–F bonds (1.94) break the third condition. A reminder that the cut-offs are only guides."
  },
  cards:[
    ["Electronegativity", "How strongly an atom pulls shared electrons (course table; F 3.98 is highest)."],
    ["ΔEN", "The difference in electronegativity: larger − smaller."],
    ["Bond types (course model)", "< 0.5 nonpolar covalent; 0.5–1.7 polar covalent; > 1.7 mostly ionic."],
    ["Partial charges", "δ− on the more electronegative atom; δ+ on the other."],
    ["Bond dipole", "An arrow from δ+ (crossed tail) toward δ−."],
    ["Polar molecule", "Bond dipoles add up to a net dipole (lopsided shape)."],
    ["Nonpolar despite polar bonds", "Symmetric shapes cancel: " + F("CO2") + ", " + F("BF3") + ", " + F("CCl4") + "."],
    ["Lone pairs and polarity", "Lone pairs usually make shapes lopsided: " + F("H2O") + ", " + F("NH3") + " are polar."],
    ["Like dissolves like", "Polar and ionic dissolve in polar; nonpolar dissolves in nonpolar."],
    ["Charged-rod test", "Polar liquids bend toward a charged rod; nonpolar ones don’t."],
    ["Cis and trans polarity", "Cis isomers with matching groups can be polar; trans versions often cancel."],
    ["Model limits", "HF (1.78) is molecular, not ionic: cut-offs are guides."]
  ]
};
