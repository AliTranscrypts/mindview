// SCH4U 11 Stereoisomers. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/11-stereoisomers.md
// The molecule drawings (hero, Isomer explorer, Part 3 particle views, task cards) are drawn by app.js.
// Module data (boiling and melting points, fat melting points, the ≈ 270 kJ/mol rotation barrier) lives in app.js
// (course table additions, plan §6 risk 1).
// Misconception core sentences (plan §3), reused where the plan points to them.
const M1 = "Same atoms joined the same way is the same compound, however it’s drawn. Trace the bonds, not the picture.";
const M2 = "Same formula, different shape. Shape changes the forces between molecules, so boiling points differ.";
const M3 = "Each carbon of the C=C needs two <strong>different</strong> groups. But-1-ene’s first carbon has two H atoms, so it has no cis–trans pair.";
const M4 = "Groups spin freely around a single bond. Only the double bond (or a ring) stops rotation.";
const M5 = "<em>Cis</em> = same side; <em>trans</em> = across.";
const M6 = "Same mass, but a branched molecule is more compact: less surface, weaker London forces, lower boiling point.";
const M7 = "The atoms are joined in the same order; only the arrangement in space differs. That makes them stereoisomers.";

// Hero object (plan): line structures of cis- and trans-but-2-ene, the C=C highlighted, a small "↻ ✗" lock on each double bond.
function line(x1, y1, x2, y2, w){ return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="${w || 3}" stroke-linecap="round"/>`; }
function butene(ox, cis, label){
  const P = cis ? [[0, 26], [20, 60], [60, 60], [80, 26]] : [[0, 26], [20, 60], [60, 60], [80, 94]];
  const q = P.map(p => [p[0] + ox, p[1]]);
  const lk = cis ? 82 : 40;
  return `<rect x="${q[1][0] - 6}" y="${q[1][1] - 13}" width="52" height="26" rx="13" fill="var(--hi-soft)"/>` +
    line(q[0][0], q[0][1], q[1][0], q[1][1]) + line(q[1][0], q[1][1], q[2][0], q[2][1]) + line(q[1][0] + 6, q[1][1] + (cis ? 7 : -7), q[2][0] - 6, q[2][1] + (cis ? 7 : -7)) + line(q[2][0], q[2][1], q[3][0], q[3][1]) +
    `<text x="${ox + 40}" y="${lk}" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" fill="var(--ink-2)">↻ ✗</text>` +
    `<text x="${ox + 40}" y="122" text-anchor="middle" font-size="19" font-style="italic" font-weight="700" fill="var(--ink)">${label}</text>`;
}
const HERO_EQ = `<span class="si-heq"><svg viewBox="-12 0 244 132" role="img" aria-label="Line structures of cis-but-2-ene and trans-but-2-ene side by side. Each C=C is highlighted and carries a lock: it can’t rotate.">${butene(0, true, "cis")}${butene(140, false, "trans")}</svg></span>`;

const ANS1 = (box, why) => ["Same formula?", "Same connections?", why];

export default {
  id:"11-stereoisomers",
  kind:"topic",
  title:"Stereoisomers",
  topic:"Stereoisomers",
  readyTopic:"stereoisomers",
  hero:{
    eq:HERO_EQ, eqSize:"sm",
    eqLabel:"cis-but-2-ene and trans-but-2-ene, the same formula, C4H8, with the C=C locked",
    headline:"Same atoms, same bonds, different shape",
    text:"<strong>Isomers</strong> share a molecular formula but are different compounds. <strong>Structural isomers</strong> connect their atoms differently. <strong>Stereoisomers</strong> connect them the same way but point them differently in space. A C=C double bond can’t twist, so it can lock groups on the same side (<strong>cis</strong>) or opposite sides (<strong>trans</strong>).",
    caps:["Ethane: the C–C single bond spins freely.", "Ethene: twisting the C=C stretches the π bond, and the turn snaps back.", "The locked C=C gives two different molecules: cis and trans but-2-ene."],
    fig:{ html:'<div class="si-hx"><svg class="si-hx-svg" id="si-hx-svg" viewBox="0 0 480 300" role="img" aria-label="A ball-and-stick ethane spins freely about its C–C bond. Then ethene tries to turn: a π-bond band stretches and glows, and the turn snaps back. Finally two but-2-ene models slide apart: cis, with both CH₃ groups up, boils at about 4 °C; trans, one up and one down, at about 1 °C."></svg><div class="si-hx-row"><p class="si-hx-cap" id="si-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="si-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can decide whether two structures are the same compound, structural isomers, stereoisomers, or not isomers at all.",
    "I can name and draw chain, position and functional-group isomers for a molecular formula.",
    "I can explain why a C=C bond gives cis–trans isomers and decide whether a given alkene has them.",
    "I can name cis and trans isomers and draw each one from its name.",
    "I can explain differences in boiling point, melting point and polarity between isomers using shape and intermolecular forces.",
    "I can apply isomerism to real substances, such as fats in food."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Formulas from structures", goal:1,
          prompt:"What is the molecular formula of CH₃CH₂CH(CH₃)CH₃?",
          options:[
            { t:"C₅H₁₂", ok:true, why:"5 carbons; 3 + 2 + 1 + 3 + 3 = 12 H." },
            { t:"C₄H₁₀", why:"The CH₃ in brackets is a fifth carbon." },
            { t:"C₅H₁₀", why:"There is no double bond; alkanes are CₙH₂ₙ₊₂." },
            { t:"C₅H₁₁", why:"Count every H: 12." }],
          hints:["Count carbons, including the one in brackets.", "5 C.", "An alkane with 5 C has 2(5) + 2 = 12 H."] },
        { id:"w2", skill:"Formulas from structures", goal:2,
          prompt:"Which pair has the same molecular formula?",
          options:[
            { t:"Ethanol (CH₃CH₂OH) and methoxymethane (CH₃OCH₃)", ok:true, why:"Both are C₂H₆O." },
            { t:"Ethane and ethene", why:"C₂H₆ vs C₂H₄." },
            { t:"Propane and propan-1-ol", why:"C₃H₈ vs C₃H₈O." },
            { t:"Butane and but-1-ene", why:"C₄H₁₀ vs C₄H₈." }],
          hints:["Write each formula.", "Count C, H and O separately.", "C₂H₆O and C₂H₆O."] },
        { id:"w3", skill:"Alkene naming", goal:3,
          prompt:"Name CH₃CH=CHCH₃ (ignore cis–trans for now).",
          options:[
            { t:"But-2-ene", ok:true, why:"4 carbons; the double bond starts at C2." },
            { t:"But-1-ene", why:"The C=C is between C2 and C3." },
            { t:"But-3-ene", why:"Number to give the C=C the lowest locant: 2." },
            { t:"Butane", why:"There’s a double bond: -ene." }],
          hints:["Count the chain.", "Number so the C=C gets the lowest number.", "But-2-ene."] },
        { id:"w4", skill:"Alkene naming", goal:3,
          prompt:"Which structure is but-1-ene?",
          options:[
            { t:"CH₂=CHCH₂CH₃", ok:true, why:"The C=C starts at C1." },
            { t:"CH₃CH=CHCH₃", why:"That’s but-2-ene." },
            { t:"CH₂=C(CH₃)₂", why:"That’s 2-methylpropene." },
            { t:"CH₃CH₂CH₂CH₃", why:"That’s butane." }],
          hints:["Where does ‘1’ put the double bond?", "Between C1 and C2.", "CH₂=CHCH₂CH₃."] },
        { id:"w5", skill:"Intermolecular forces", goal:5,
          prompt:"Which force is present between <strong>all</strong> molecules?",
          options:[
            { t:"London dispersion forces", ok:true, why:"Every molecule has electrons that can shift briefly." },
            { t:"Hydrogen bonds", why:"Only with H on N, O or F." },
            { t:"Dipole–dipole forces", why:"Only between polar molecules." },
            { t:"Ionic bonds", why:"Those hold ions together, not molecules." }],
          hints:["Which force needs no polarity?", "Temporary dipoles.", "London dispersion."] },
        { id:"w6", skill:"Intermolecular forces", goal:5,
          prompt:"Two liquids have molecules of the same mass. One is polar and one is nonpolar. Which usually boils higher?",
          options:[
            { t:"The polar one", ok:true, why:"Dipole–dipole forces add to London forces." },
            { t:"The nonpolar one", why:"Nonpolar molecules lack the extra attraction." },
            { t:"They boil at the same temperature", why:"Same mass doesn’t mean same forces." },
            { t:"It can’t be predicted at all", why:"With the same mass, polarity is the deciding factor." }],
          hints:["What extra force does a polar molecule have?", "Dipole–dipole.", "Stronger attractions mean a higher boiling point."] }
      ],
      refreshers:{
        "Formulas from structures":"Count each element; check alkanes against CₙH₂ₙ₊₂ and alkenes against CₙH₂ₙ.",
        "Alkene naming":"Longest chain containing the C=C; number to give the C=C the lowest locant; -ene.",
        "Intermolecular forces":"London forces act between all molecules and grow with surface area. Polar molecules add dipole–dipole forces; O–H, N–H and F–H add hydrogen bonds. Stronger forces mean a higher boiling point."
      }
    }
  },
  explore:{
    heading:"Isomer explorer",
    intro:"Build molecules, then compare them. Rotate each model and try to twist its bonds.",
    how:"Choose a mode. In <strong>Structural isomers</strong>, pick a target formula, tap an atom or a bond in the drawing, then use the builder buttons. In <strong>Cis–trans</strong>, choose the group in each of the four places. Press <strong>Save for comparison</strong> to keep a molecule, and open <strong>Compare</strong> to see two saved molecules side by side. Turn the 3D model by dragging it, with the arrow keys, or with the view buttons.",
    cmpNote:"Compare mode shows the last two molecules you saved, side by side. Save molecules in the other two modes.",
    dataNote:"Boiling and melting points are rounded data; the ≈ 270 kJ/mol needed to twist a C=C is approximate (course table additions).",
    rules:{ m1:M1, m2:M2, m3:M3, m4:M4, m5:M5, m6:M6, m7:M7 },
    modes:[{ id:"struct", t:"Structural isomers" }, { id:"ct", t:"Cis–trans" }, { id:"cmp", t:"Compare" }],
    predictions:[
      { id:"p1", prompt:"Butane and 2-methylpropane are both C₄H₁₀. Which boils at the higher temperature?",
        options:[{ t:"butane", ok:true }, { t:"2-methylpropane" }, { t:"the same" }, { t:"it depends on the room" }],
        explain:"The branched isomer is more compact: less contact, weaker London forces." },
      { id:"p2", prompt:"Press Rotate on ethane’s C–C bond, then on ethene’s C=C bond. What happens?",
        options:[{ t:"ethane turns freely; ethene’s turn is blocked", ok:true }, { t:"both turn freely" }, { t:"neither turns" }, { t:"ethene turns but ethane doesn’t" }],
        explain:"The π bond needs the p orbitals side by side; twisting pulls them apart." },
      { id:"p3", prompt:"Cis–trans mode, with H and H on the left carbon and H and C₂H₅ on the right (but-1-ene). Does but-1-ene have cis and trans forms?",
        options:[{ t:"No", ok:true }, { t:"Yes, two" }, { t:"Yes, four" }, { t:"Only at low temperature" }],
        explain:"C1 has two H atoms. Swapping them changes nothing." },
      { id:"p4", prompt:"Compare mode: cis- and trans-1,2-dichloroethene. Which boils at the higher temperature?",
        options:[{ t:"cis", ok:true }, { t:"trans" }, { t:"the same" }, { t:"neither boils below 100 °C" }],
        explain:"Cis is polar, so dipole–dipole forces add to its London forces." }
    ],
    chalIntro:"Use the isomer explorer to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 5], prompt:"Build an isomer of pentane, C₅H₁₂, that boils <strong>below 20 °C</strong>.",
        why:"2,2-dimethylpropane is the most compact C₅H₁₂ isomer: the least surface, the weakest London forces, ≈ 10 °C.",
        hints:["Branching lowers the boiling point.", "Put as many branches as possible on the shortest chain.", "A central carbon with four CH₃ groups: 2,2-dimethylpropane, ≈ 10 °C."] },
      { id:"tc2", goal:[3, 4, 5], prompt:"In cis–trans mode, build the <strong>nonpolar</strong> isomer with formula C₂H₂Cl₂.",
        why:"trans-1,2-dichloroethene: the two C–Cl dipoles point in opposite directions across the molecule and cancel.",
        hints:["Where must the two C–Cl dipoles point to cancel?", "Opposite directions, across the molecule.", "Cl on different carbons, on opposite sides: trans."] },
      { id:"tc3", goal:[1, 2, 3], stretch:true, prompt:"Build <strong>every</strong> isomer of C₄H₈. Each new one is added to your list; duplicates are flagged.",
        why:"Four alkenes (but-1-ene, cis- and trans-but-2-ene, 2-methylpropene) and two rings (cyclobutane, methylcyclopropane): six isomers of C₄H₈.",
        hints:["CₙH₂ₙ means one double bond <strong>or</strong> one ring.", "Chains with C=C: where can the C=C go, and which carbons can branch? Then check each for cis–trans.", "4 alkenes (but-1-ene, cis- and trans-but-2-ene, 2-methylpropene) + 2 rings (cyclobutane, methylcyclopropane)."] }
    ]
  },
  part3:{
    slug:"properties", name:"Properties", heading:"Same formula, different properties",
    intro:"Isomers have the same formula, yet their boiling and melting points differ. Read the data at each station, then zoom to the particles to see the forces that explain it.",
    dataNote:"Rounded data. Butane, 2-methylpropane and the three C₅H₁₂ boiling points are from the course data table; the other values are course table additions.",
    s1:{ title:"Station 1: Three kinds of difference",
      intro:"Each card compares isomers. Press <strong>Zoom to the particles</strong> to see the forces between two molecules.",
      cards:[
        { id:"chain", title:"Chain isomers: C₅H₁₂", names:["pentane", "2-methylbutane", "2,2-dimethylpropane"], note:"More branching, less surface.",
          zaria:["Two long pentane molecules lie side by side, touching along their whole length: many London attractions.", "Two compact 2,2-dimethylpropane molecules touch at only one small spot: few London attractions."],
          zoom:"Long pentane molecules touch along their whole length; compact 2,2-dimethylpropane molecules touch at only a small spot, so their London forces are weaker." },
        { id:"fg", title:"Functional group isomers: C₂H₆O", names:["ethanol", "methoxymethane"], note:"Hydrogen bonding needs the O–H.",
          zaria:["Two ethanol molecules: the O–H hydrogen of one points at the O of the other, joined by a dotted hydrogen bond.", "Two methoxymethane molecules: no H on the O, so only a weak dipole–dipole attraction is drawn."],
          zoom:"Ethanol’s O–H hydrogen-bonds to the O of its neighbour. Methoxymethane’s O has no H attached, so it can only form weaker dipole–dipole attractions." },
        { id:"pos", title:"Position isomers: C₃H₈O", names:["propan-1-ol", "propan-2-ol"], note:"The OH at the end is more exposed for hydrogen bonding.",
          zaria:["Two propan-1-ol molecules: the O–H at the chain end reaches the next O easily, a dotted hydrogen bond.", "Two propan-2-ol molecules: the O–H sits in the middle, circled, with CH₃ groups around it; the hydrogen bond is faint."],
          zoom:"At the end of the chain, the O–H is easy to reach. In the middle, two CH₃ groups crowd it, so hydrogen bonds form less well." }
      ] },
    s2:{ title:"Station 2: Cis vs trans",
      intro:"cis- and trans-1,2-dichloroethene have the same atoms joined the same way. Which effect explains each difference? Choose one for each row, then check.",
      rows:[
        { id:"bp", t:"Boiling points: cis 60 °C, trans 48 °C", answer:"pol", why:"The cis molecule is polar, so dipole–dipole forces add to London forces when it boils." },
        { id:"mp", t:"Melting points: cis −80 °C, trans −50 °C", answer:"pack", why:"The trans shape packs into the crystal better, so the solid holds together until a higher temperature." }
      ],
      choices:[{ id:"pol", t:"polarity" }, { id:"pack", t:"packing" }],
      summary:"Polarity explains the boiling points; packing explains the melting points.",
      zoomL:"Liquid: cis molecules line up their dipoles (δ+ next to δ−).", zoomR:"Solid: flat trans molecules stack neatly in the crystal." },
    s3:{ title:"Station 3: Fats in food",
      intro:"Three 18-carbon fatty acid chains. Tap a chain, then tap where it belongs at room temperature (about 20 °C).",
      items:[
        { id:"sat", t:"Saturated (straight)", answer:"solid", why:"Straight chains line up closely, so the fat is solid: it melts at ≈ 70 °C." },
        { id:"cis", t:"Cis-unsaturated (kinked)", answer:"liquid", why:"The cis kink stops the chains packing, so the fat melts at ≈ 13 °C: a liquid oil." },
        { id:"trans", t:"Trans-unsaturated (nearly straight)", answer:"solid", why:"The trans double bond keeps the chain nearly straight, so it packs like a saturated fat and melts at ≈ 44 °C." }
      ],
      bins:[{ id:"solid", label:"Solid at room temperature" }, { id:"liquid", label:"Liquid at room temperature" }],
      // VERIFY: the trans fat ban date (2018) and the cholesterol wording are plan items marked "verify before release".
      note:"Partial hydrogenation (an addition reaction, module 02) can turn some cis double bonds into trans. Trans fats raise “bad” cholesterol, and Canada banned partially hydrogenated oils in foods in 2018." },
    quickCheck:{
      title:"Quick check", summary:"Same formula, different properties quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which C₅H₁₂ isomer has the lowest boiling point?",
          choices:[
            { t:"2,2-dimethylpropane", ok:true, fb:"Right. Most compact, least surface: ≈ 10 °C." },
            { t:"pentane", fb:"Most compact, least surface." },
            { t:"2-methylbutane", fb:"Most compact, least surface." },
            { t:"all equal", fb:"Most compact, least surface." }] },
        { id:"q2", goal:5, prompt:"Why does ethanol boil 100 °C higher than its isomer methoxymethane?",
          choices:[
            { t:"Ethanol hydrogen-bonds", ok:true, fb:"Right. Only ethanol has an O–H, so only ethanol hydrogen-bonds." },
            { t:"Ethanol is heavier", fb:"Same formula, so same mass and electrons; only ethanol has O–H." },
            { t:"Methoxymethane is ionic", fb:"Same formula, so same mass and electrons; only ethanol has O–H." },
            { t:"Ethanol has more electrons", fb:"Same formula, so same mass and electrons; only ethanol has O–H." }] },
        { id:"q3", goal:5, prompt:"Why does trans-1,2-dichloroethene melt at a higher temperature than cis?",
          choices:[
            { t:"Its shape packs better in a solid", ok:true, fb:"Right. The trans shape fits into the crystal better." },
            { t:"It is more polar", fb:"Trans is the nonpolar one; packing, not polarity, explains melting here." },
            { t:"It has more atoms", fb:"Trans is the nonpolar one; packing, not polarity, explains melting here." },
            { t:"Trans bonds are stronger", fb:"Trans is the nonpolar one; packing, not polarity, explains melting here." }] },
        { id:"q4", goal:6, prompt:"Why is a cis-unsaturated fat liquid at room temperature?",
          choices:[
            { t:"The kink stops chains from packing", ok:true, fb:"Right. Kinked chains can’t line up, so the forces between them are weaker." },
            { t:"It has more hydrogen", fb:"Kinked chains can’t line up, so the forces between them are weaker." },
            { t:"It is ionic", fb:"Kinked chains can’t line up, so the forces between them are weaker." },
            { t:"It has no double bonds", fb:"Kinked chains can’t line up, so the forces between them are weaker." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"rel", type:"sorter", title:"What’s the relationship?", summary:"What’s the relationship?", noun:"pair", txt:true, goal:[1, 2, 3],
        instruction:"Ten pairs of structures. Sort each pair by how the two are related.",
        boxes:[{ id:"same", label:"Same compound" }, { id:"struct", label:"Structural isomers" }, { id:"ct", label:"Cis–trans isomers" }, { id:"not", label:"Not isomers" }],
        wrongDefault:"Check the formulas first, then trace the connections.",
        items:[
          { id:"i1", goal:1, t:"CH₃CH₂CH₂CH₃ and CH₃CH₂CH₂CH₃ drawn as a zigzag pointing down", answer:"same", why:"Four carbons in a row both times: the same compound, drawn two ways.",
            wrong:{ struct:"Trace the chain: 4 carbons in a row both times.", ct:"Trace the chain: 4 carbons in a row both times." },
            hints:ANS1("same", "Same compound: both are butane, four carbons in a row; only the drawing differs.") },
          { id:"i2", goal:2, t:"Butane and 2-methylpropane", answer:"struct", why:"Both C₄H₁₀, with different carbon skeletons: chain isomers.",
            hints:ANS1("struct", "Structural isomers: both are C₄H₁₀, but one chain is straight and one is branched.") },
          { id:"i3", goal:3, t:"cis-but-2-ene and trans-but-2-ene", answer:"ct", why:"Same connections; the CH₃ groups are on the same side in one and opposite sides in the other.",
            wrong:{ struct:"Same connections; only the arrangement differs." },
            hints:ANS1("ct", "Cis–trans isomers: same connections, different arrangement around the C=C.") },
          { id:"i4", goal:2, t:"Propan-1-ol and propan-2-ol", answer:"struct", why:"Both C₃H₈O; the OH is on a different carbon: position isomers.",
            hints:ANS1("struct", "Structural isomers: both C₃H₈O, with the OH on C1 in one and C2 in the other.") },
          { id:"i5", goal:2, t:"Ethanol and methoxymethane", answer:"struct", why:"Both C₂H₆O: an alcohol and an ether, functional group isomers.",
            wrong:{ not:"Both are C₂H₆O." },
            hints:ANS1("struct", "Structural isomers: both C₂H₆O, but one is an alcohol and one is an ether.") },
          { id:"i6", goal:1, t:"Butane and but-1-ene", answer:"not", why:"Different formulas: C₄H₁₀ vs C₄H₈.",
            wrong:{ struct:"C₄H₁₀ vs C₄H₈.", ct:"C₄H₁₀ vs C₄H₈.", same:"C₄H₁₀ vs C₄H₈." },
            hints:ANS1("not", "Not isomers: C₄H₁₀ vs C₄H₈.") },
          { id:"i7", goal:1, t:"CH₂=CHCH₂CH₃ and CH₃CH₂CH=CH₂", answer:"same", why:"Read the second one from the right: it’s but-1-ene again.",
            wrong:{ struct:"Numbered from the other end, it’s but-1-ene again.", ct:"Numbered from the other end, it’s but-1-ene again." },
            hints:ANS1("same", "Same compound: both are but-1-ene, written from opposite ends.") },
          { id:"i8", goal:3, t:"cis- and trans-1,2-dimethylcyclopropane", answer:"ct", why:"The ring locks the groups: both CH₃ on the same side of the ring in one, on opposite sides in the other.",
            wrong:{ same:"The ring locks the groups: same side vs opposite sides." },
            hints:ANS1("ct", "Cis–trans isomers: the ring can’t rotate, so same side and opposite sides are different molecules.") },
          { id:"i9", goal:2, t:"Propanal and propanone", answer:"struct", why:"Both C₃H₆O: an aldehyde and a ketone, functional group isomers.",
            hints:ANS1("struct", "Structural isomers: both C₃H₆O, with the C=O at the end in one and in the middle in the other.") },
          { id:"i10", goal:1, t:"Butane, and butane with its two middle carbons rotated 180°", answer:"same", why:"Rotating about a single bond doesn’t make a new compound.",
            wrong:{ ct:"Single bonds rotate; no isomers.", struct:"Single bonds rotate; no isomers." },
            hints:ANS1("same", "Same compound: single bonds rotate freely, so it’s still butane.") }
        ] },
      { id:"puz", type:"custom", title:"Isomer puzzles", summary:"Isomer puzzles", star:true, goal:[2, 3, 4, 5],
        instruction:"Seven puzzles: number entry and choices. Puzzles 5 to 7 are non-routine; 6 and 7 go beyond the Final Check.",
        how:"Type a number or tap a choice, then press Check.",
        items:[
          { id:"p1", kind:"num", goal:2, prompt:"How many structural isomers does C₆H₁₄ have?", answer:5, unit:"isomers", display:"5",
            wrong:[{ match:4, fb:"Don’t forget 3-methylpentane." }, { match:6, fb:"Check for duplicates (2-methylpentane drawn from the other end)." }],
            fb:"Draw each carbon skeleton and check every one for duplicates." },
          { id:"p2", kind:"num", goal:2, prompt:"How many structural isomers does C₄H₉Cl have?", answer:4, unit:"isomers", display:"4",
            wrong:[{ match:2, fb:"Branch the chain too: 1-chloro-2-methylpropane and 2-chloro-2-methylpropane." }],
            fb:"Put the Cl on each different carbon of each chain, then check for duplicates." },
          { id:"p3", kind:"num", goal:3, prompt:"How many isomers of C₂H₂Cl₂ are there, counting cis and trans separately?", answer:3, unit:"isomers", display:"3",
            wrong:[{ match:2, fb:"1,2-dichloroethene has cis and trans forms." }],
            fb:"Both Cl on one carbon, or one on each carbon; then check for cis and trans." },
          { id:"p4", kind:"chips", goal:3, prompt:"Does 2-methylbut-2-ene have cis–trans isomers?",
            options:[{ t:"No", ok:true, why:"C2 carries two CH₃ groups, so swapping them gives the same molecule." }, { t:"Yes", why:"C2 carries two CH₃ groups." }] },
          { id:"p5", kind:"num", star:true, goal:3, prompt:"How many alkene isomers (including cis and trans) have formula C₅H₁₀?", answer:6, unit:"isomers", display:"6",
            wrong:[{ match:5, fb:"Pent-2-ene counts twice: cis and trans." }, { match:7, fb:"2-methylbut-2-ene has no cis–trans pair." }],
            fb:"List the chains, place the C=C, then check each for cis–trans.",
            hints:["List the chains: 5 carbons, then 4 with a branch.", "Pent-1-ene, pent-2-ene, 2-methylbut-1-ene, 3-methylbut-1-ene, 2-methylbut-2-ene.", "Only pent-2-ene has a cis–trans pair: 6 in all."] },
          { id:"p6", kind:"chips", star:true, goal:5, prompt:"<strong>Investigation:</strong> a student compares the boiling points of the two 1,2-dichloroethenes on different days, at different altitudes. Which variable must be controlled?",
            options:[
              { t:"air pressure", ok:true, why:"Boiling point depends on the pressure above the liquid, so both must be measured at the same pressure." },
              { t:"sample colour", why:"Boiling point depends on the pressure above the liquid." },
              { t:"beaker size", why:"Boiling point depends on the pressure above the liquid." },
              { t:"time of day", why:"Boiling point depends on the pressure above the liquid." }] },
          { id:"p7", kind:"chips", star:true, goal:5, prompt:"Hex-3-ene, CH₃CH₂CH=CHCH₂CH₃: predict which isomer, cis or trans, has the higher <strong>melting</strong> point, and why.",
            options:[
              { t:"Trans: its straighter shape packs better", ok:true, why:"Melting is about fitting into a solid: the straighter trans molecules pack better." },
              { t:"Cis: it is polar, so its molecules attract more", why:"Cis is the polar one, which matters for boiling. Melting is about packing." }],
            hints:["Which property is about fitting into a solid?", "Melting point.", "Trans is straighter, so it packs better and melts higher."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ezra", how:"", goal:[1, 3],
        instruction:"Ezra made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"List the structural isomers of C₅H₁₂.",
            steps:["Straight chain: pentane, CH₃CH₂CH₂CH₂CH₃.", "One branch on a 4-carbon chain: 2-methylbutane.", "Moving the branch: 3-methylbutane is a third isomer.", "Two branches on a 3-carbon chain: 2,2-dimethylpropane.", "So C₅H₁₂ has 4 isomers."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is fine on its own, but the mistake is earlier.", "This follows from step 3."],
            fixes:[
              { t:"Numbered from the other end, 3-methylbutane is 2-methylbutane, the same compound. C₅H₁₂ has 3 isomers.", ok:true, why:"Same connections, same compound: pentane, 2-methylbutane and 2,2-dimethylpropane." },
              { t:"3-methylbutane is a stereoisomer of 2-methylbutane.", why:"There’s no double bond or ring." },
              { t:"Add 4-methylbutane as a fifth isomer.", why:"That’s pentane." },
              { t:"Step 3 is correct.", why:"Trace the bonds: same connections." }],
            hints:["Number 3-methylbutane from the other end.", "The branch lands on C2.", "Same compound: 3 isomers in all."] },
          { id:"e2", goal:3, task:"Draw the cis–trans isomers of 2-methylbut-2-ene, (CH₃)₂C=CHCH₃.",
            steps:["The C=C is between C2 and C3.", "C3 carries H and CH₃: two different groups.", "C2 carries CH₃ and CH₃.", "So there are cis and trans forms: the CH₃ on C3 can be on the same side as a CH₃ on C2, or opposite.", "Cis-2-methylbut-2-ene has the higher boiling point."],
            answer:3,
            stepFb:["Correct. Keep checking.", "Correct.", "Correct.", "", "This builds on step 4."],
            fixes:[
              { t:"C2 has two identical groups, so swapping its top and bottom gives the same molecule. There are no cis–trans isomers.", ok:true, why:"Both carbons of the C=C need two different groups; C2 fails." },
              { t:"There are cis and trans forms, but trans is higher-boiling.", why:M3 },
              { t:"There are four stereoisomers.", why:M3 },
              { t:"Step 4 is correct.", why:"Both CH₃ groups on C2 are the same, so ‘same side’ and ‘opposite’ are identical." }],
            hints:["What does each carbon of the C=C need?", "Two different groups.", "C2 fails: no cis–trans pair."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the isomer explorer: the blocked rotation, the boiling-point gaps, or a duplicate you thought was new?" },
      { id:"j2", q:"In your own words, what makes two molecules stereoisomers rather than structural isomers?" },
      { id:"j3", q:"Explain to a friend how to decide whether an alkene has cis and trans forms." },
      { id:"j4", q:"Which isomer type still trips you up? What will you check first next time?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What is the relationship between CH₃CH₂CH₂OH and CH₃CH(OH)CH₃?", options:[
          { t:"Structural (position) isomers", ok:true, why:"Same formula, C₃H₈O; the OH is on a different carbon." },
          { t:"Cis–trans isomers", why:"No double bond; the connections differ." },
          { t:"The same compound", why:"The OH is on C1 in one and C2 in the other." },
          { t:"Not isomers", why:"Both are C₃H₈O." }] },
        b:{ prompt:"What is the relationship between cis-pent-2-ene and trans-pent-2-ene?", options:[
          { t:"Stereoisomers (cis–trans)", ok:true, why:"Same connections, different arrangement around the C=C." },
          { t:"Structural isomers", why:"The atoms are joined in the same order." },
          { t:"The same compound", why:"The C=C can’t rotate, so they can’t interconvert." },
          { t:"Not isomers", why:"Both are C₅H₁₀." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which is a <strong>functional group</strong> isomer of propanal, CH₃CH₂CHO?", options:[
          { t:"Propanone, CH₃COCH₃", ok:true, why:"Both are C₃H₆O; aldehyde vs ketone." },
          { t:"Propan-1-ol", why:"C₃H₈O: not the same formula." },
          { t:"Butanal", why:"C₄H₈O: one carbon too many." },
          { t:"Propanal drawn backwards", why:"That’s the same compound." }] },
        b:{ prompt:"Which is a <strong>chain</strong> isomer of hexane?", options:[
          { t:"3-methylpentane", ok:true, why:"C₆H₁₄ with a different carbon skeleton." },
          { t:"Hex-1-ene", why:"C₆H₁₂: not the same formula." },
          { t:"Cyclohexane", why:"C₆H₁₂." },
          { t:"Hexane drawn as a zigzag", why:M1 }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Which alkene has cis and trans isomers?", options:[
          { t:"Pent-2-ene", ok:true, why:"C2 has H and CH₃; C3 has H and C₂H₅." },
          { t:"Pent-1-ene", why:"C1 has two H." },
          { t:"2-methylbut-2-ene", why:"C2 has two CH₃." },
          { t:"Ethene", why:"Each carbon has two H." }] },
        b:{ prompt:"Which alkene has <strong>no</strong> cis–trans isomers?", options:[
          { t:"2-methylpropene", ok:true, why:"C1 has two H (and C2 has two CH₃)." },
          { t:"But-2-ene", why:"C2 and C3 each carry CH₃ and H, so but-2-ene has cis and trans forms." },
          { t:"Hex-3-ene", why:"C3 and C4 each carry H and C₂H₅, so hex-3-ene has cis and trans forms." },
          { t:"1,2-dichloroethene", why:"Each carbon carries H and Cl, so it has cis and trans forms." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Rank by boiling point, highest first: pentane, 2-methylbutane, 2,2-dimethylpropane.", options:[
          { t:"Pentane > 2-methylbutane > 2,2-dimethylpropane", ok:true, why:"More branching, less surface, weaker London forces." },
          { t:"2,2-dimethylpropane > 2-methylbutane > pentane", why:M6 },
          { t:"All the same", why:M2 },
          { t:"2-methylbutane > pentane > 2,2-dimethylpropane", why:"The straight chain has the most contact." }] },
        b:{ prompt:"Rank by boiling point, highest first: hexane, 2-methylpentane, 2,2-dimethylbutane.", options:[
          { t:"Hexane > 2-methylpentane > 2,2-dimethylbutane", ok:true, why:"More branching, less surface, weaker London forces." },
          { t:"2,2-dimethylbutane > 2-methylpentane > hexane", why:M6 },
          { t:"All the same", why:M2 },
          { t:"2-methylpentane > hexane > 2,2-dimethylbutane", why:"The straight chain has the most contact." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"How many isomers (structural and cis–trans) are alkenes with formula C₄H₈?", options:[
          { t:"4", ok:true, why:"But-1-ene, cis- and trans-but-2-ene, 2-methylpropene." },
          { t:"3", why:"But-2-ene counts twice." },
          { t:"6", why:"That count includes the two rings, which aren’t alkenes." },
          { t:"5", why:"Neither but-1-ene nor 2-methylpropene has a cis–trans pair." }] },
        b:{ prompt:"How many isomers of C₃H₅Cl contain a C=C (counting cis and trans separately)?", options:[
          { t:"4", ok:true, why:"1-chloropropene (cis and trans), 2-chloropropene, 3-chloropropene." },
          { t:"3", why:"1-chloropropene has cis and trans forms." },
          { t:"5", why:"2-chloropropene and 3-chloropropene have no cis–trans pair." },
          { t:"2", why:"Cl can sit on any of the three carbons." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"A student draws CH₃CH₂CH(CH₃)₂ and CH₃CH(CH₃)CH₂CH₃ and calls them two isomers. Is the student right?", options:[
          { t:"No: both are 2-methylbutane, drawn from opposite ends", ok:true, why:"Number each from the end nearer the branch: the CH₃ is on C2 both times." },
          { t:"Yes: they are position isomers", why:M1 },
          { t:"Yes: they are cis–trans isomers", why:M4 },
          { t:"No: they have different formulas", why:"Both are C₅H₁₂." }] },
        b:{ prompt:"A student draws CH₂ClCH₂CH₃ and CH₃CH₂CH₂Cl and calls them isomers. Is the student right?", options:[
          { t:"No: both are 1-chloropropane", ok:true, why:"The Cl is on an end carbon both times: the same compound, written from opposite ends." },
          { t:"Yes: position isomers", why:M1 },
          { t:"Yes: stereoisomers", why:M4 },
          { t:"No: different formulas", why:"Both are C₃H₇Cl." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why cis-1,2-dichloroethene boils at a higher temperature than the trans isomer?", options:[
          { t:"“In cis, both C–Cl dipoles point to one side, so the molecule is polar and has dipole–dipole forces; in trans they cancel.”", ok:true, why:"It names the cause (polarity) and the force it adds (dipole–dipole)." },
          { t:"“Cis has more atoms.”", why:"Same formula." },
          { t:"“Cis has a stronger double bond.”", why:"Boiling breaks attractions between molecules, not bonds." },
          { t:"“Trans molecules are heavier.”", why:"Same mass." }] },
        b:{ prompt:"Which is the best explanation of why ethanol boils far higher than methoxymethane?", options:[
          { t:"“Ethanol has an O–H group, so its molecules hydrogen-bond to each other; methoxymethane’s O has no H attached.”", ok:true, why:"It names the group (O–H) and the force it allows (hydrogen bonding)." },
          { t:"“Ethanol is heavier.”", why:"Same formula, same mass." },
          { t:"“Methoxymethane is ionic.”", why:"It’s molecular." },
          { t:"“Ethanol’s bonds are harder to break.”", why:"Boiling doesn’t break covalent bonds." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which name matches CH₃ and CH₃ on opposite sides of the C=C in CH₃CH=CHCH₃?", options:[
          { t:"trans-but-2-ene", ok:true, why:"Opposite sides: trans." },
          { t:"cis-but-2-ene", why:M5 },
          { t:"trans-but-1-ene", why:"The C=C starts at C2." },
          { t:"but-2-ene, which has no isomers", why:"C2 and C3 each carry CH₃ and H, so but-2-ene has cis and trans forms." }] },
        b:{ prompt:"Which name matches Cl and Cl on the same side of the C=C in ClCH=CHCl?", options:[
          { t:"cis-1,2-dichloroethene", ok:true, why:"Same side: cis." },
          { t:"trans-1,2-dichloroethene", why:M5 },
          { t:"1,1-dichloroethene", why:"The Cl atoms are on different carbons." },
          { t:"cis-1,1-dichloroethene", why:"1,1 has no cis–trans pair." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A margarine label lists ‘partially hydrogenated oil’. Why might its fat be more solid than the original oil?", options:[
          { t:"Hydrogenation removes some double bonds and turns some cis bonds trans; straighter chains pack better", ok:true, why:"Fewer kinks let the chains line up, so the fat melts higher." },
          { t:"Hydrogenation adds water", why:"It adds H₂ across C=C." },
          { t:"It makes the fat ionic", why:"It’s still molecular." },
          { t:"It adds more cis kinks", why:"Cis kinks make fats more liquid, not less." }] },
        b:{ prompt:"Olive oil is liquid but butter is solid at room temperature. Which best explains the difference?", options:[
          { t:"Olive oil’s fats have more cis double bonds whose kinks stop chains from packing", ok:true, why:"Kinked chains can’t line up, so the forces between them are weaker." },
          { t:"Olive oil has fewer carbons per molecule", why:"Both have long chains of similar length." },
          { t:"Butter’s fats are polar", why:"Both are mostly nonpolar." },
          { t:"Olive oil is a solution in water", why:"It’s a fat." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"But-2-enedioic acid, HOOC–CH=CH–COOH, has cis and trans isomers. One melts near 135 °C, the other near 287 °C. Which is which, and why?", options:[
          { t:"The trans isomer melts at 287 °C: its straighter shape packs into a tighter crystal", ok:true, why:"Melting is decided by packing, and the trans shape packs better." },
          { t:"Cis melts at 287 °C because it’s polar", why:"Polarity matters more for boiling; melting here is decided by packing." },
          { t:"They must melt at the same temperature", why:M2 },
          { t:"The cis isomer melts higher because it has more atoms", why:"Same formula." }] },
        b:{ prompt:"Two isomers of BrCH=CHBr boil at 112 °C and 108 °C. One has both Br on the same side. Which boils at 112 °C?", options:[
          { t:"The cis isomer, because it is polar", ok:true, why:"Both Br on one side: the dipoles add, so dipole–dipole forces raise the boiling point." },
          { t:"The trans isomer, because it packs better", why:"Packing matters for melting; boiling here follows polarity." },
          { t:"They can’t differ", why:M2 },
          { t:"1,1-dibromoethene", why:"Both isomers named here have Br on different carbons." }] } }
    ]
  },
  task:{
    title:"Isomer family", summary:"Isomer family",
    statement:"<p>Choose exactly three cards to make an isomer family that meets every condition. Can you find all the answers?</p><ol class=\"si-conds\"><li>All three molecules have the formula C₄H₈.</li><li>The family includes a cis–trans pair.</li><li>The third molecule is a structural isomer of that pair.</li><li>No two cards show the same molecule.</li></ol>",
    checks:["All C₄H₈", "Includes a cis–trans pair", "Third card is a structural isomer", "Three different molecules"],
    tips:["Count H atoms: butane is C₄H₁₀.", "Which card is cis? Pair it with a trans card.", "Rings are CₙH₂ₙ too.", "Turn the models of 2 and 3, and of 4 and 9: same molecule."],
    explainPrompt:"Explain why your three molecules are isomers of each other, and which pair are stereoisomers.",
    vocab:"Use the words molecular formula, structural isomer, stereoisomer and cis–trans.",
    more:"There’s more than one answer. Can you find another family?"
  },
  cards:[
    ["Isomers", "Same molecular formula, different compounds."],
    ["Structural isomers", "Atoms joined in a different order: chain, position or functional group."],
    ["Stereoisomers", "Same connections, different arrangement in space."],
    ["Why C=C makes cis–trans", "Twisting would break the π bond, so groups stay locked on one side."],
    ["Test for cis–trans", "Each carbon of the C=C must carry two <strong>different</strong> groups."],
    ["cis", "Matching groups on the same side of the C=C (or ring)."],
    ["trans", "Matching groups on opposite sides."],
    ["Branching and boiling point", "More branching, less surface, weaker London forces, lower boiling point."],
    ["cis vs trans boiling", "Cis is often polar, so it often boils higher."],
    ["cis vs trans melting", "Trans is straighter, so it packs better and often melts higher."],
    ["Same compound, drawn differently", "Trace the bonds: flipping or renumbering doesn’t make an isomer."],
    ["Trans fats", "Nearly straight chains that pack like saturated fats; formed in partial hydrogenation."]
  ]
};
