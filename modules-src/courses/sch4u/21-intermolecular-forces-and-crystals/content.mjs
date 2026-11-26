// SCH4U 21 Intermolecular Forces and Crystals. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/21-intermolecular-forces-and-crystals.md
// The particle views, trend graphs, lattices (Explore), the test bench and material cards (Part 3), the "Which boils higher?"
// set and the staircase builder (task) are drawn by app.js, which also holds the substance and solid data tables.

// Misconception core sentence (plan §3 M5); the others are written into the items that catch them.
const M5 = "In the solid, the ions are locked in place. Melted or dissolved, they can move and carry charge.";

// Practice 1, sequence 3: every order that puts methoxymethane (step 1) above ethanol (step 2) gets the M2 feedback.
function perms(a){ if (a.length < 2) return [a]; const out = []; a.forEach((v, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(p => out.push([v].concat(p)))); return out; }
const S3WRONG = perms([0, 1, 2, 3]).filter(p => p.indexOf(1) > p.indexOf(2)).map(p => ({ order:p, fb:"Methoxymethane has no O–H, so no hydrogen bonds between its molecules." }));

const CLASSES = [{ id:"ionic", t:"ionic" }, { id:"molecular", t:"molecular" }, { id:"network", t:"covalent network" }, { id:"metallic", t:"metallic" }];

export default {
  id:"21-intermolecular-forces-and-crystals",
  kind:"topic",
  title:"Intermolecular forces and crystals",
  topic:"Intermolecular Forces and Crystals",
  readyTopic:"intermolecular forces and crystals",
  hero:{
    eq:'<span class="nw">H₂O(l) → H₂O(g)</span>',
    eqSize:"sm",
    eqLabel:"H 2 O liquid becomes H 2 O gas",
    headline:"Boiling pulls molecules apart, not atoms",
    text:"The forces <em>between</em> particles decide whether a substance is a gas, a liquid or a solid at room temperature. <strong>London dispersion forces</strong>, <strong>dipole–dipole forces</strong> and <strong>hydrogen bonds</strong> hold molecules together; <strong>ions</strong>, <strong>networks of covalent bonds</strong> and <strong>metallic bonding</strong> hold other solids together. Match the particle to the force, and you can predict melting, boiling, hardness and conductivity.",
    fig:{ html:'<div class="imf-hx"><svg class="imf-hx-svg" id="imf-hx-svg" viewBox="0 0 440 330" role="img" aria-label="A beaker of liquid water, zoomed to a cluster of water molecules joined by dotted violet hydrogen bonds. Inside each molecule the O–H bonds are solid lines. A flame appears under the beaker. The dotted lines stretch and snap one by one while every molecule stays whole, and single molecules drift upward as steam. Two molecules left in the liquid are still joined by a hydrogen bond, labelled hydrogen bond (between molecules)."></svg><div class="imf-hx-row"><p class="imf-hx-cap" id="imf-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="imf-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can tell intermolecular forces apart from the bonds inside molecules, and say which ones break when a substance melts or boils.",
    "I can identify the IMFs present in a substance (dispersion, dipole–dipole, hydrogen bonding, ion–dipole).",
    "I can rank boiling points by first comparing electron counts and then the strongest IMF.",
    "I can explain trends and anomalies in boiling-point data (the H₂O, HF and NH₃ anomaly; large nonpolar molecules).",
    "I can classify a solid as ionic, molecular, covalent network or metallic and describe its properties.",
    "I can use test data and IMF reasoning to choose or evaluate materials for a purpose."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Polarity", goal:2,
          prompt:"Which molecule is polar?",
          options:[
            { t:"H₂O", ok:true, why:"Bent shape: the bond dipoles don’t cancel." },
            { t:"CO₂", why:"Linear CO₂: the two C=O dipoles cancel." },
            { t:"CH₄", why:"ΔEN for C–H is 0.35, and the shape is symmetric." },
            { t:"Cl₂", why:"Two identical atoms: ΔEN = 0." }],
          hints:["Polar bonds <em>and</em> an unsymmetrical shape.", "Which molecule is bent?", "H₂O."] },
        { id:"w2", skill:"Polarity", goal:2,
          prompt:"Using the course electronegativity values, which bond is most polar?",
          options:[
            { t:"O–H (ΔEN 1.24)", ok:true, why:"3.44 − 2.20 = 1.24." },
            { t:"C–H (0.35)", why:"Smallest difference here." },
            { t:"C–Cl (0.61)", why:"Cl has a high EN, but C is fairly high too: 3.16 − 2.55 = 0.61." },
            { t:"N–H (0.84)", why:"3.04 − 2.20 = 0.84: less than O–H." }],
          hints:["Subtract the two EN values.", "Compute each ΔEN.", "O–H, 1.24."] },
        { id:"w3", skill:"Types of attraction", goal:2,
          prompt:"Which attraction exists between molecules of <em>every</em> substance?",
          options:[
            { t:"London dispersion forces", ok:true, why:"Moving electrons create temporary dipoles in any particle." },
            { t:"Hydrogen bonds", why:"Only with H on N, O or F." },
            { t:"Dipole–dipole forces", why:"Only between polar molecules." },
            { t:"None: nonpolar molecules don’t attract", why:"Then nitrogen could never be liquefied." }],
          hints:["Even helium can be liquefied. What holds it together?", "Temporary dipoles.", "Dispersion forces."] },
        { id:"w4", skill:"Types of attraction", goal:2,
          prompt:"Which substance can hydrogen bond between its own molecules?",
          options:[
            { t:"NH₃", ok:true, why:"H is bonded to N, and N has a lone pair." },
            { t:"CH₄", why:"H is bonded to C." },
            { t:"HCl", why:"Cl isn’t N, O or F; HCl has dipole–dipole forces." },
            { t:"CH₃OCH₃", why:"It has O, but every H is on a C." }],
          hints:["Look for H bonded <em>directly</em> to N, O or F.", "Check each H.", "NH₃."] },
        { id:"w5", skill:"Bonding in solids", goal:5,
          prompt:"Sodium chloride is made of…",
          options:[
            { t:"Na⁺ and Cl⁻ ions in a lattice", ok:true, why:"Electrons are transferred: an ionic compound." },
            { t:"NaCl molecules", why:"There are no separate molecules in an ionic lattice." },
            { t:"Na and Cl atoms sharing electrons", why:"ΔEN = 3.16 − 0.93 = 2.23: ionic, not shared." },
            { t:"Metal atoms in a sea of electrons", why:"That’s metallic bonding." }],
          hints:["Metal + nonmetal.", "ΔEN > 1.7.", "Ions in a lattice."] },
        { id:"w6", skill:"Bonding in solids", goal:5,
          prompt:"Why does a copper wire conduct electricity?",
          options:[
            { t:"Its delocalized electrons can move through the metal", ok:true, why:"The electron sea carries charge." },
            { t:"It contains Cu²⁺ ions that move along the wire", why:"The cations stay in place; electrons move." },
            { t:"Copper atoms are polar", why:"Polarity applies to molecules." },
            { t:"Copper is hot", why:"Conduction doesn’t need heat." }],
          hints:["What can move in a metal?", "Not the cations.", "Delocalized electrons."] }
      ],
      refreshers:{
        "Polarity":"A molecule is polar when it has polar bonds (ΔEN ≥ 0.5) and a shape that doesn’t cancel them (module 19).",
        "Types of attraction":"Dispersion forces are always present. Dipole–dipole forces need polar molecules. Hydrogen bonds need H on N, O or F, plus a lone pair on N, O or F nearby.",
        "Bonding in solids":"Ionic means ions in a lattice; metallic means cations plus delocalized electrons; covalent means shared electrons, in separate molecules or in a continuous network."
      }
    }
  },
  explore:{
    heading:"Force strength lab",
    intro:"Pick substances, see the forces between their particles, and test your predictions against real boiling points.",
    how:"Choose a mode. <strong>Between particles:</strong> tap one substance, or two to compare (a third tap replaces the older one). <strong>Trend graphs:</strong> pick a data set; in group 16, drag the prediction dot (or focus it and use ↑ ↓, Shift for 20 °C steps). <strong>Solid lattice:</strong> pick a solid, then run the tests.",
    modes:[{ id:"between", t:"Between particles" }, { id:"trend", t:"Trend graphs" }, { id:"solid", t:"Solid lattice" }],
    rows:[
      { lab:"10 electrons", ids:["Ne", "CH4", "NH3", "HF", "H2O"] },
      { lab:"18 electrons", ids:["Ar", "F2", "SiH4", "C2H6", "PH3", "HCl", "H2S", "CH3OH"] },
      { lab:"26 electrons", ids:["C3H8", "CH3OCH3", "C2H5OH"] },
      { lab:"42 electrons (C₅H₁₂)", ids:["pentane", "2-methylbutane", "2,2-dimethylpropane"] },
      { lab:"Halogens", ids:["Cl2", "Br2", "I2"] }
    ],
    sets:[
      { id:"g14", t:"Group 14 hydrides" }, { id:"g15", t:"Group 15 hydrides" }, { id:"g16", t:"Group 16 hydrides" }, { id:"g17", t:"Group 17 hydrides" },
      { id:"noble", t:"Noble gases" }, { id:"hal", t:"Halogens" }, { id:"alk", t:"Straight-chain alkanes" }],
    trendLabel:"Show trend line",
    solids:["NaCl", "MgO", "ice", "I2", "diamond", "SiO2", "graphite", "copper", "sodium"],
    mystery:[
      { id:"M1", answer:"network", like:"SiO2", desc:"melts at 1713 °C, very hard, never conducts, insoluble" },
      { id:"M2", answer:"ionic", like:"NaCl", desc:"melts at 801 °C, brittle, conducts only when molten or dissolved, soluble in water" },
      { id:"M3", answer:"molecular", like:"I2", desc:"melts at 114 °C, soft, never conducts, dissolves in hexane" }],
    classes:CLASSES,
    gapChips:[{ id:"disp", t:"dispersion" }, { id:"dip", t:"dipole–dipole" }, { id:"hb", t:"hydrogen bonding" }],
    whyChips:[{ id:"hb", t:"hydrogen bonds between water molecules" }, { id:"oh", t:"O–H bonds are strong" }, { id:"few", t:"water has fewer electrons" }],
    predIntro:"Each prediction sets up the lab. Choose an answer, then watch what really happens.",
    predictions:[
      { id:"p1", prompt:"Which boils higher, CH₄ or SnH₄?",
        options:[{ t:"SnH₄", ok:true }, { t:"CH₄" }, { t:"They boil at the same temperature" }, { t:"You can’t tell without knowing their polarity" }],
        explain:"Both are nonpolar. SnH₄ has 54 electrons to CH₄’s 10, so stronger dispersion forces." },
      { id:"p2", prompt:"H₂S has more electrons (18 vs 10). Which boils higher?",
        options:[{ t:"H₂O, by about 160 °C", ok:true }, { t:"H₂S, by about 40 °C" }, { t:"About the same" }, { t:"H₂O, because boiling breaks its strong O–H bonds" }],
        explain:"Hydrogen bonds between H₂O molecules outweigh H₂S’s slightly stronger dispersion. The O–H bonds aren’t broken by boiling." },
      { id:"p3", prompt:"Same formula, same electrons. Which boils higher?",
        options:[{ t:"pentane", ok:true }, { t:"2,2-dimethylpropane" }, { t:"Same" }, { t:"You can’t tell" }],
        explain:"More surface contact gives stronger dispersion forces." },
      { id:"p4", prompt:"Which sample of NaCl lights the bulb?",
        options:[{ t:"Only molten (or dissolved) NaCl", ok:true }, { t:"Only solid NaCl" }, { t:"Both" }, { t:"Neither" }],
        explain:"Moving charged particles carry current; locked ions can’t." }
    ],
    chalIntro:"Use the lab to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:3,
        prompt:"Using only the 10-electron substances, choose two whose boiling points differ by <strong>at least 100 °C</strong>. Then choose the force that explains the gap.",
        why:"Equal electrons means similar dispersion forces, so a gap of 100 °C or more comes from hydrogen bonds.",
        hints:["Equal electrons means similar dispersion forces.", "Pair a substance that hydrogen bonds with one that doesn’t.", "For example, CH₄ (−162 °C) and H₂O (100 °C)."] },
      { id:"tc2", goal:5,
        prompt:"Classify three mystery solids. Run tests in Solid lattice mode, then place each in a bin.",
        why:"M1 never conducts and melts very high: a covalent network. M2 conducts only when molten or dissolved: ionic. M3 melts low and never conducts: molecular.",
        hints:["Melting point first, conductivity second.", "Conducting only when molten is the ionic signature.", "M1 network, M2 ionic, M3 molecular."] },
      { id:"tc3", goal:4, stretch:true,
        prompt:"Trend graphs, group 16. Drag the prediction dot to where H₂O’s boiling point <em>would</em> be if water had no hydrogen bonds and simply followed the trend of H₂S, H₂Se and H₂Te. Then choose the reason for the real gap.",
        why:"The trend puts water near −80 °C. Its real boiling point is about 180 °C higher, because hydrogen bonds hold its molecules together.",
        hints:["From H₂Te to H₂S, the boiling point falls as electrons decrease.", "Continue the fall one more step to period 2.", "About −80 °C. Water’s real value is 180 °C higher, because of hydrogen bonds."] }
    ],
    msgs:{
      tc1:{ two:"Choose two substances in Between particles mode.", ten:"Use only the 10-electron substances: Ne, CH₄, NH₃, HF and H₂O.",
        neCh4:"Both have only dispersion forces, and with equal electrons their boiling points are close.",
        bothHb:"Both hydrogen bond, so the gap is smaller.",
        small:"That gap is under 100 °C. Pair a substance that hydrogen bonds with one that doesn’t.",
        chip:"Now choose the force that explains the gap.",
        disp:"Equal electrons means similar dispersion. The difference comes from hydrogen bonds.",
        dip:"None of the 10-electron substances relies on dipole–dipole forces. The difference comes from hydrogen bonds." },
      tc2:{ place:"Place all three mystery solids in a bin first.",
        m1ionic:"Ionic solids conduct when molten. M1 never conducts.",
        m3net:"A network solid doesn’t melt at 114 °C.",
        m2met:"A metal conducts as a solid too.",
        other:"Not every solid is in the right bin yet. Melting point first, conductivity second." },
      tc3:{ group:"Switch to Trend graphs and choose Group 16 hydrides.",
        real:"That’s water’s real boiling point. The question asks where the trend would put it.",
        high:"Fewer electrons means weaker dispersion, so the trend falls toward period 2.",
        notLow:"Not low enough yet: continue the fall from H₂Te through H₂Se and H₂S one more step.",
        tooLow:"Too low: from H₂Se to H₂S the boiling point falls by only 19 °C, so one more step falls about that much again.",
        chip:"Now choose the reason for the real gap.",
        oh:"Boiling doesn’t break O–H bonds.",
        few:"Fewer electrons would make water boil lower, not higher.",
        banner:"Without hydrogen bonds, water would be a gas at room temperature, and there’d be no liquid oceans." }
    },
    blocks:[
      { title:"The big idea", html:"<p>Compare like with like. With equal electrons, the stronger IMF wins by tens to hundreds of degrees. Across different electron counts, dispersion can dominate: I₂ boils at 184 °C, water at 100 °C.</p>" }
    ]
  },
  part3:{
    slug:"solids", name:"Solids", heading:"Identify the solid",
    intro:"A virtual test bench: choose tests, read the results table, and decide what kind of particles each unknown solid is made of. The “Check it with data” panel links every result to the particle picture that causes it.",
    s1:{ title:"Station 1: The test bench",
      intro:"Six unknown solids, U1 to U6. Each test costs one test token, and you have 12. Choose a solid, run the tests you need, then place it in a bin and press <strong>Check</strong>.",
      tokens:12,
      reset:"Reset the bench",
      tests:[
        { id:"mp", t:"Melting point", head:"Melting point" },
        { id:"scratch", t:"Scratch test", head:"Scratch" },
        { id:"cs", t:"Conducts as a solid?", head:"Conducts (solid)" },
        { id:"cm", t:"Conducts when molten?", head:"Conducts (molten)" },
        { id:"cw", t:"Conducts in water?", head:"Conducts (in water)" },
        { id:"sw", t:"Dissolves in water?", head:"Dissolves in water" },
        { id:"sh", t:"Dissolves in hexane?", head:"Dissolves in hexane" }],
      noTokens:"You’re out of test tokens. Classify with the results you have, or reset the bench to start again.",
      classes:CLASSES,
      unknowns:[
        { id:"U1", answer:"molecular", name:"sucrose (table sugar)", pic:"sugar", type:"Molecular (polar)",
          r:{ mp:"under 200 °C", scratch:"brittle crystals", cs:"no", cm:"no", cw:"dissolves; the solution doesn’t conduct", sw:"yes", sh:"no" },
          why:{ mp:"Only IMFs hold the molecules together, and they give way at a low temperature (sucrose melts and decomposes at about 186 °C).",
            scratch:"Weak IMFs between molecules: the crystals crumble easily.",
            cs:"Whole, neutral molecules carry no charge: no current.", cm:"Melting frees whole molecules, not ions: still no current.",
            cw:"Dissolved sucrose molecules are neutral: no current.", sw:"Its polar O–H groups hydrogen bond with water.", sh:"Its polar molecules don’t mix with nonpolar hexane." } },
        { id:"U2", answer:"ionic", name:"magnesium oxide (MgO)", pic:"MgO", type:"Ionic",
          r:{ mp:"over 1500 °C", scratch:"hard but brittle: it cracks", cs:"no", cm:"yes", cw:"doesn’t dissolve: nothing to test", sw:"no", sh:"no" },
          why:{ mp:"Mg²⁺ and O²⁻ attract strongly throughout the lattice: it melts at 2852 °C.",
            scratch:"Shifting a layer lines up like charges, which repel: the crystal cracks.",
            cs:"The ions are locked in place, so no current.", cm:"When molten, the ions are free to move and carry current.",
            cw:"MgO doesn’t dissolve, so there are no free ions in the water.", sw:"The attractions in the lattice are too strong for water to pull the ions apart.", sh:"Nonpolar hexane can’t attract ions." } },
        { id:"U3", answer:"metallic", name:"sodium", pic:"sodium", type:"Metallic",
          r:{ mp:"under 200 °C", scratch:"soft: a knife cuts it, and it bends", cs:"yes", cm:"yes", cw:"not tested: reacts", sw:"not tested: reacts", sh:"not tested" },
          why:{ mp:"Sodium’s metallic bonding is weak for a metal: it melts at 98 °C.",
            scratch:"Layers of cations slide through the electron sea without breaking: soft and malleable.",
            cs:"Delocalized electrons move through the metal and carry current.", cm:"The electron sea is still there in the liquid metal, so it still conducts.",
            cw:"Sodium reacts with water, so this test isn’t done.", sw:"Sodium reacts with water, so this test isn’t done.", sh:"Sodium is stored under oil; this test isn’t done." } },
        { id:"U4", answer:"network", name:"quartz (SiO₂)", pic:"SiO2", type:"Covalent network",
          r:{ mp:"over 1500 °C", scratch:"very hard: it scratches glass", cs:"no", cm:"no", cw:"doesn’t dissolve: nothing to test", sw:"no", sh:"no" },
          why:{ mp:"Every Si and O atom is covalently bonded to its neighbours: melting means breaking covalent bonds (1713 °C).",
            scratch:"Strong covalent bonds in every direction: very hard.",
            cs:"No ions and no free electrons: no current.", cm:"Even molten, there are no ions or free electrons: no current.",
            cw:"Quartz doesn’t dissolve, so there’s nothing to carry charge.", sw:"Covalent bonds hold the whole network together: it doesn’t dissolve.", sh:"Covalent bonds hold the whole network together: it doesn’t dissolve." } },
        { id:"U5", answer:"molecular", name:"paraffin wax", pic:"wax", type:"Molecular (nonpolar)",
          r:{ mp:"under 200 °C", scratch:"soft and waxy", cs:"no", cm:"no", cw:"doesn’t dissolve: nothing to test", sw:"no", sh:"yes" },
          why:{ mp:"Only dispersion forces hold its long molecules together: they give way at a low temperature.",
            scratch:"Weak IMFs let the molecules shift: soft.",
            cs:"Whole, neutral molecules carry no charge: no current.", cm:"Melting frees whole molecules, not ions: still no current.",
            cw:"Wax doesn’t dissolve in water, so there’s nothing to carry charge.", sw:"Nonpolar molecules don’t mix with polar water.", sh:"Dispersion forces let nonpolar wax mix with nonpolar hexane." } },
        { id:"U6", answer:"network", name:"graphite", pic:"graphite", type:"Covalent network (conducts)",
          r:{ mp:"over 1500 °C", scratch:"soft and slippery: it leaves a grey mark", cs:"yes (along its layers)", cm:"doesn’t melt below 3500 °C", cw:"doesn’t dissolve: nothing to test", sw:"no", sh:"no" },
          why:{ mp:"Covalent bonds hold each layer together: it doesn’t melt below 3500 °C.",
            scratch:"The layers are held to each other only by weak forces, so they slide: soft and slippery.",
            cs:"Each C bonds to only 3 others, leaving one electron free to move along the layers. This is the exception among network solids.",
            cm:"It doesn’t melt below 3500 °C, so there’s no liquid to test.",
            cw:"Graphite doesn’t dissolve.", sw:"Covalent bonds hold each layer together: it doesn’t dissolve.", sh:"Covalent bonds hold each layer together: it doesn’t dissolve." } }
      ],
      wrong:{
        ionic:"An ionic solid melts above 200 °C, is brittle and conducts only when molten or dissolved. Do the results fit?",
        molecular:"A molecular solid melts low (under 200 °C) and never conducts. Do the results fit?",
        network:"A covalent network solid melts very high and is hard; it doesn’t conduct (graphite is the exception). Do the results fit?",
        metallic:"A metal conducts as a solid and when molten, and is malleable. Do the results fit?",
        "U6|metallic":"Graphite conducts, but it isn’t a metal: it doesn’t melt below 3500 °C, and it’s made of covalently bonded carbon atoms." },
      typeWhy:{ ionic:"Ionic: when molten, the ions are free to move and carry current.",
        molecular:"Molecular: only weak IMFs hold the molecules, so it melts low; the molecules carry no charge, so it never conducts.",
        network:"Covalent network: every atom is bonded to its neighbours, so it melts very high; with no ions or free electrons it doesn’t conduct.",
        graphite:"Covalent network (the exception): each carbon bonds to three others, so one electron per atom is free to move along the layers.",
        metallic:"Metallic: delocalized electrons move through the cations, so it conducts as a solid and as a liquid, and the layers can slide." },
      done:"All six classified with {n} test tokens.",
      efficient:"An efficient test plan: about two well-chosen tests per solid is enough.",
      wasteful:"It worked. Next time, try melting point plus one conductivity test first: that pair separates most solids.",
      invest:{ title:"Investigation: plan the fewest tests",
        q:"Which two tests distinguish a covalent network solid from an ionic one with the fewest tokens? Choose two, then press <strong>Check</strong>.",
        answer:[["cm", "mp"], ["cm", "sw"]],
        right:"Efficient: an ionic solid conducts when molten and a network solid never does. The melting point or solubility in water backs it up.",
        noCm:"Both can melt above 1500 °C, and neither conducts as a solid. Which test sets them apart?",
        withCm:"Molten conductivity is the key test. Pair it with the melting point or solubility in water.",
        two:"Choose exactly two tests." } },
    s2:{ title:"Station 2: Check it with data", summary:"Check it with data",
      intro:"Choose a solid you’ve classified. Each test result is linked to the particle picture that causes it.",
      none:"Classify a solid at the test bench first. Its particle picture and the reasons for each result appear here." },
    s3:{ title:"Station 3: Specialized materials",
      intro:"Match each material’s key property to its structure and particles. Then tap one benefit and one environmental consideration for each.",
      structures:[
        { id:"sheet", t:"a single sheet of covalently bonded carbon atoms, with delocalized electrons" },
        { id:"chains", t:"long molecular chains held side by side by hydrogen bonds" },
        { id:"net", t:"a covalent network of Si and C atoms" }],
      envs:[{ id:"energy", t:"energy-intensive production" }, { id:"recycle", t:"recycling difficulty" }],
      cards:[
        { id:"graphene", name:"Graphene", prop:"A single layer of graphite: strong and conductive.", answer:"sheet",
          right:"Every carbon is covalently bonded in the sheet (strong), and the delocalized electrons carry current (conductive).",
          benefits:["flexible, conductive electronics", "light, strong composite materials"],
          env:{ energy:"Making large, clean sheets takes high temperatures and a lot of energy.", recycle:"Graphene mixed into other materials is hard to recover." } },
        { id:"aramid", name:"Aramid fibre", prop:"Molecular chains joined by hydrogen bonds: used in protective fabric.", answer:"chains",
          right:"Hydrogen bonds hold the long chains side by side, so the fibre is very strong for its mass.",
          benefits:["cut- and impact-resistant vests and gloves", "light, strong ropes"],
          env:{ energy:"It’s made from petroleum-based chemicals in an energy-intensive process.", recycle:"Woven into fabrics and composites, the fibres are hard to recycle." } },
        { id:"sic", name:"Silicon carbide ceramic", prop:"A network: heat-resistant.", answer:"net",
          right:"Covalent bonds run through the whole solid, so it stays hard and solid at very high temperatures.",
          benefits:["brake discs and furnace parts that resist heat", "hard cutting and grinding tools"],
          env:{ energy:"It’s made in electric furnaces at very high temperatures, which uses a lot of energy.", recycle:"A hard network ceramic can’t be melted down and reshaped like a metal." } }],
      wrong:"Not quite. Think about which particles and forces give that property." },
    quickCheck:{
      title:"Quick check", summary:"Identify the solid quick check",
      items:[
        { id:"q1", goal:5, prompt:"“Conducts as a solid and when molten; malleable.”",
          choices:[
            { t:"ionic", fb:"Only metals conduct as solids (graphite aside)." },
            { t:"metallic", ok:true, fb:"Right. Only metals conduct as solids (graphite aside)." },
            { t:"molecular", fb:"Only metals conduct as solids (graphite aside)." },
            { t:"network", fb:"Only metals conduct as solids (graphite aside)." }] },
        { id:"q2", goal:5, prompt:"“Melts at 2852 °C, brittle, conducts only when molten.”",
          choices:[
            { t:"ionic", ok:true, fb:"Right. Conducting when molten means mobile ions." },
            { t:"network", fb:"Conducting when molten means mobile ions." },
            { t:"metallic", fb:"Conducting when molten means mobile ions." },
            { t:"molecular", fb:"Conducting when molten means mobile ions." }] },
        { id:"q3", goal:5, prompt:"Why does graphite conduct when diamond doesn’t?",
          choices:[
            { t:"delocalized electrons in layers", ok:true, fb:"Right. Each C in graphite bonds to only 3 others, leaving one electron free to move." },
            { t:"graphite is ionic", fb:"Each C in graphite bonds to only 3 others, leaving one electron free to move." },
            { t:"graphite is a metal", fb:"Each C in graphite bonds to only 3 others, leaving one electron free to move." },
            { t:"diamond is molecular", fb:"Each C in graphite bonds to only 3 others, leaving one electron free to move." }] },
        { id:"q4", goal:5, prompt:"Which test best separates molecular from covalent network solids?",
          choices:[
            { t:"melting point", ok:true, fb:"Right. IMFs give way at low temperatures; covalent networks don’t." },
            { t:"colour", fb:"IMFs give way at low temperatures; covalent networks don’t." },
            { t:"mass", fb:"IMFs give way at low temperatures; covalent networks don’t." },
            { t:"shape", fb:"IMFs give way at low temperatures; covalent networks don’t." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"rank", type:"order", title:"Rank the boiling points", summary:"Rank the boiling points", goal:[3, 4],
        instruction:"Put each set in order of boiling point, lowest first.",
        sequences:[
          { id:"s1", goal:3, prompt:"Noble gases.", steps:["He", "Ne", "Ar", "Kr"], start:[2, 0, 3, 1],
            general:"More electrons, stronger dispersion.",
            why:"More electrons, stronger dispersion.",
            hints:["Group by electron count.", "Within a group, rank by strongest IMF; for isomers, by shape.", "He, Ne, Ar, Kr."] },
          { id:"s2", goal:4, prompt:"Alkanes.", steps:["2,2-dimethylpropane (C₅H₁₂)", "2-methylbutane (C₅H₁₂)", "pentane (C₅H₁₂)", "hexane (C₆H₁₄)"], start:[3, 1, 0, 2],
            general:"Branching lowers bp; a longer chain raises it.",
            why:"Branching lowers bp; a longer chain raises it. 2,2-dimethylpropane 10 °C, 2-methylbutane 28 °C, pentane 36 °C, hexane 69 °C.",
            hints:["Group by electron count.", "Within a group, rank by strongest IMF; for isomers, by shape.", "2,2-dimethylpropane, 2-methylbutane, pentane, hexane."] },
          { id:"s3", goal:3, prompt:"Propane, an ether and two alcohols.", steps:["propane (C₃H₈)", "methoxymethane (CH₃OCH₃)", "ethanol (C₂H₅OH)", "propan-1-ol (C₃H₇OH)"], start:[2, 3, 1, 0],
            wrong:S3WRONG,
            general:"Propane, methoxymethane and ethanol each have 26 electrons, so the strongest IMF decides. Propan-1-ol has more electrons and hydrogen bonds.",
            why:"Propane, methoxymethane and ethanol each have 26 electrons, so the strongest IMF decides. Propan-1-ol has more electrons and hydrogen bonds. Propane −42 °C, methoxymethane −24 °C, ethanol 78 °C, propan-1-ol 97 °C.",
            hints:["Group by electron count.", "Within a group, rank by strongest IMF; for isomers, by shape.", "Propane, methoxymethane, ethanol, propan-1-ol."] }
        ] },
      { id:"higher", type:"custom", title:"Which boils higher, and why?", summary:"Which boils higher?", star:true, goal:[2, 3, 4],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap a choice, then press <strong>Check</strong>.",
        items:[
          { id:"b1", goal:3, prompt:"HCl vs F₂ (both 18 electrons). Which boils higher, and why?",
            options:[
              { t:"HCl: dipole–dipole forces", ok:true, why:"HCl is polar and F₂ isn’t. With equal electrons, polarity decides." },
              { t:"F₂: fluorine is the most electronegative element", why:"F₂ is nonpolar; equal electrons, so polarity decides." },
              { t:"HCl: hydrogen bonds", why:"Cl isn’t N, O or F, so HCl has dipole–dipole forces, not hydrogen bonds." },
              { t:"Neither: equal electrons give equal boiling points", why:"Equal electrons means the strongest IMF decides." }],
            hints:["Both have 18 electrons, so dispersion is similar.", "Which one is polar?", "HCl: its dipole–dipole forces add to dispersion."] },
          { id:"b2", goal:2, prompt:"CH₃OH vs C₂H₆ (both 18 electrons). Which boils higher, and why?",
            options:[
              { t:"CH₃OH: hydrogen bonds", ok:true, why:"Its O–H lets its molecules hydrogen bond. C₂H₆ has only dispersion forces." },
              { t:"C₂H₆: it has more H atoms", why:"C₂H₆ has only dispersion forces." },
              { t:"CH₃OH: its covalent bonds are stronger", why:"Boiling separates whole molecules; covalent bonds don’t break." },
              { t:"Neither: equal electrons give equal boiling points", why:"Equal electrons means the strongest IMF decides." }],
            hints:["Both have 18 electrons.", "Which one has H on N, O or F?", "CH₃OH: its O–H gives hydrogen bonds."] },
          { id:"b3", goal:3, star:true, prompt:"Br₂ (70 electrons) vs HF (10 electrons, hydrogen bonded). Which boils higher, and why?",
            options:[
              { t:"Br₂: its many electrons give strong dispersion forces", ok:true, why:"Br₂ boils at 59 °C and HF at 20 °C. Seven times as many electrons gives very strong dispersion." },
              { t:"HF: hydrogen bonds always win", why:"Hydrogen bonds don’t always win. Seven times as many electrons gives very strong dispersion." },
              { t:"HF: it’s polar and Br₂ isn’t", why:"Polarity decides only when the electron counts match: here it’s 70 vs 10." },
              { t:"About the same: each has one strong force", why:"Br₂ boils at 59 °C and HF at 20 °C." }],
            hints:["Count electrons.", "70 vs 10.", "Br₂ boils higher (59 °C)."] },
          { id:"b4", goal:4, star:true, prompt:"NH₃ vs PH₃. Which boils higher, and why?",
            options:[
              { t:"NH₃: hydrogen bonds, despite fewer electrons", ok:true, why:"−33 °C vs −88 °C. N–H allows hydrogen bonding; P–H doesn’t." },
              { t:"PH₃: it has more electrons", why:"PH₃ has more electrons, but N–H allows hydrogen bonding; P–H doesn’t." },
              { t:"NH₃: its N–H bonds are stronger", why:"Boiling separates whole molecules; N–H bonds don’t break." },
              { t:"PH₃: it hydrogen bonds", why:"P isn’t N, O or F." }],
            hints:["Count electrons: 10 vs 18.", "Which one has H on N, O or F?", "NH₃ (−33 °C vs −88 °C): hydrogen bonds outweigh PH₃’s extra electrons."] },
          { id:"b5", goal:3, star:true, prompt:"<strong>Investigation:</strong> A student claims “polar molecules always boil higher than nonpolar ones” and cites HCl (−85 °C) and F₂ (−188 °C). Which pair would best <em>test</em> the claim fairly?",
            options:[
              { t:"Two molecules with equal electron counts, one polar and one not, e.g. H₂S vs SiH₄", ok:true, why:"Both have 18 electrons, so only polarity changes: a fair test." },
              { t:"HCl vs I₂", why:"Comparing HCl with I₂ changes two variables at once: polarity and electron count." },
              { t:"HCl vs HF", why:"Both are polar, so the pair can’t test the claim." },
              { t:"H₂O vs CH₄", why:"Equal electrons, but H₂O also hydrogen bonds, so the pair tests hydrogen bonding, not just polarity." }],
            hints:["A fair test changes one variable.", "Keep the electron count the same.", "H₂S (polar) vs SiH₄ (nonpolar): both have 18 electrons."] },
          { id:"b6", goal:4, star:true, prompt:"Octane (C₈H₁₈, 66 electrons, bp 126 °C) vs water. Which statement is true?",
            options:[
              { t:"Octane boils higher because its dispersion forces exceed water’s hydrogen bonding.", ok:true, why:"126 °C vs 100 °C: 66 electrons along a long chain give strong dispersion forces." },
              { t:"Water boils higher because hydrogen bonds always beat dispersion.", why:"Nonpolar doesn’t mean low bp when a molecule has many electrons." },
              { t:"Octane boils higher because it hydrogen bonds.", why:"Its H atoms are on C." },
              { t:"Octane has no attractions between its molecules, so its bp must be wrong.", why:"Every molecule has London dispersion forces." }],
            hints:["Compare the boiling points: 126 °C vs 100 °C.", "Octane is nonpolar, with 66 electrons.", "Octane’s dispersion forces exceed water’s hydrogen bonding."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Lars", how:"", goal:[1, 5],
        instruction:"Lars made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Explain why water boils at a much higher temperature than hydrogen sulfide.",
            steps:["H₂O has 10 electrons and H₂S has 18.", "So H₂S has slightly stronger dispersion forces.", "Water’s O–H bonds are stronger than H₂S’s S–H bonds, and boiling must break them.", "So water needs more energy to boil."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"Boiling separates whole molecules. Water molecules are held by hydrogen bonds (H on O, with a lone pair on O), which H₂S doesn’t have.", ok:true, why:"Steam is still H₂O: only the attractions between molecules are overcome." },
              { t:"Water’s dispersion forces are stronger.", why:"Water has fewer electrons." },
              { t:"H₂S molecules are ionic.", why:"H₂S is molecular." },
              { t:"Step 3 is correct.", why:"Boiling doesn’t break O–H bonds: steam is still H₂O." }],
            hints:["What is steam made of?", "Intact H₂O molecules.", "Boiling separates whole molecules. Water molecules are held by hydrogen bonds (H on O, with a lone pair on O), which H₂S doesn’t have."] },
          { id:"e2", goal:5, task:"Classify a solid that melts at 2852 °C, is brittle, doesn’t conduct as a solid, but conducts when molten.",
            steps:["Its melting point is very high.", "It doesn’t conduct as a solid, so it isn’t metallic.", "A very high melting point with no conduction as a solid means a covalent network solid.", "So it’s like quartz."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Conducting when molten shows mobile ions, so it’s ionic (like MgO).", ok:true, why:"Ions locked in the solid are freed by melting and carry charge." },
              { t:"It’s molecular.", why:"Molecular solids melt low." },
              { t:"It’s metallic after all.", why:"Metals conduct as solids." },
              { t:"Step 3 is correct.", why:"Network solids never conduct when molten." }],
            hints:["Which test hasn’t been used yet?", "Molten conductivity.", "Conducting when molten shows mobile ions, so it’s ionic (like MgO)."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: iodine out-boiling water, or branched isomers boiling lower?" },
      { id:"j2", q:"In your own words, explain the difference between a bond and an intermolecular force." },
      { id:"j3", q:"Explain to a friend the two-step method for ranking boiling points." },
      { id:"j4", q:"Which solid type is hardest for you to identify from test results? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"When liquid water boils, what is overcome?", options:[
          { t:"Hydrogen bonds and other attractions between H₂O molecules", ok:true, why:"Steam is still H₂O." },
          { t:"The O–H covalent bonds inside each molecule", why:"Then steam would be H and O." },
          { t:"Ionic bonds", why:"Water is molecular." },
          { t:"The bonds inside the oxygen atom", why:"Atoms aren’t broken by boiling." }] },
        b:{ prompt:"When solid iodine (I₂) turns to vapour, what is overcome?", options:[
          { t:"Dispersion forces between I₂ molecules", ok:true, why:"I₂ is nonpolar, so only dispersion forces hold the molecules together." },
          { t:"The I–I covalent bond", why:"Iodine vapour is still I₂." },
          { t:"Hydrogen bonds", why:"There is no H." },
          { t:"Ionic attractions", why:"I₂ is molecular." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which substance can hydrogen bond between its own molecules?", options:[
          { t:"CH₃OH", ok:true, why:"An O–H group." },
          { t:"CH₃OCH₃", why:"No H on O." },
          { t:"HCl", why:"Cl isn’t N, O or F." },
          { t:"CH₄", why:"Every H in CH₄ is bonded to C." }] },
        b:{ prompt:"Which substance can hydrogen bond between its own molecules?", options:[
          { t:"HF", ok:true, why:"H on F, with lone pairs on F." },
          { t:"H₂S", why:"S isn’t N, O or F." },
          { t:"CH₃F", why:"The H atoms are on C." },
          { t:"PH₃", why:"P isn’t N, O or F." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"A solid conducts electricity as a solid and as a liquid, and can be hammered into sheets. It is…", options:[
          { t:"metallic", ok:true, why:"Delocalized electrons carry charge in the solid and the liquid, and the layers of cations can slide." },
          { t:"ionic", why:"Ionic solids don’t conduct as solids." },
          { t:"covalent network", why:"Brittle and non-conducting (graphite aside)." },
          { t:"molecular", why:"Soft, low melting, non-conducting." }] },
        b:{ prompt:"A solid is extremely hard, melts above 1500 °C and never conducts, even when molten. It is…", options:[
          { t:"covalent network", ok:true, why:"Atoms covalently bonded throughout: very hard, very high melting, and no ions or free electrons." },
          { t:"ionic", why:"Ionic solids conduct when molten." },
          { t:"metallic", why:"Metals conduct." },
          { t:"molecular", why:"Molecular solids melt low." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Rank by boiling point, lowest first: C₃H₈, C₂H₅OH, CH₃OCH₃ (all 26 electrons).", options:[
          { t:"C₃H₈ < CH₃OCH₃ < C₂H₅OH", ok:true, why:"Dispersion only < dipole–dipole < hydrogen bonding." },
          { t:"CH₃OCH₃ < C₃H₈ < C₂H₅OH", why:"CH₃OCH₃ is polar, so it adds dipole–dipole forces." },
          { t:"C₃H₈ < C₂H₅OH < CH₃OCH₃", why:"CH₃OCH₃ has no O–H." },
          { t:"All equal, because the electron counts are equal", why:"Equal electrons means the strongest IMF decides." }] },
        b:{ prompt:"Rank by boiling point, lowest first: F₂, HCl, HF.", options:[
          { t:"F₂ < HCl < HF", ok:true, why:"F₂ and HCl both have 18 electrons, and HCl is polar. HF has only 10 electrons, but it hydrogen bonds." },
          { t:"HF < F₂ < HCl", why:"Fewer electrons, but hydrogen bonds." },
          { t:"F₂ < HF < HCl", why:"HF’s hydrogen bonds outweigh HCl’s dipoles." },
          { t:"HCl < F₂ < HF", why:"F₂ is nonpolar." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"I₂ (106 electrons, nonpolar) boils at 184 °C; water boils at 100 °C. Which explains this?", options:[
          { t:"I₂’s many electrons give dispersion forces stronger than water’s hydrogen bonds", ok:true, why:"106 electrons vs 10: very strong dispersion forces." },
          { t:"I₂ is secretly polar", why:"Two identical atoms: ΔEN = 0." },
          { t:"I₂ molecules hydrogen bond", why:"There is no H in I₂, so there are no hydrogen bonds." },
          { t:"Nonpolar molecules have no attractions, so the data must be wrong", why:"Every molecule has London dispersion forces." }] },
        b:{ prompt:"Octane (C₈H₁₈, 66 electrons) boils at 126 °C; water boils at 100 °C. Which explains this?", options:[
          { t:"Octane’s large electron count and long chain give dispersion forces stronger than water’s hydrogen bonds", ok:true, why:"66 electrons along a long chain: strong dispersion forces." },
          { t:"Octane hydrogen bonds", why:"Its H atoms are on C." },
          { t:"Octane is ionic", why:"It’s a hydrocarbon." },
          { t:"Boiling breaks octane’s C–C bonds", why:"Boiling separates whole molecules; the C–C bonds stay." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Solid Z melts at 770 °C, is brittle and dissolves in water. What will a water solution of Z do in a conductivity test?", options:[
          { t:"Conduct, because Z is ionic and its dissolved ions move", ok:true, why:"High melting, brittle and soluble: ionic. Dissolved ions move and carry charge." },
          { t:"Not conduct, because Z doesn’t conduct as a solid", why:M5 },
          { t:"Not conduct, because Z is a covalent network", why:"A network solid wouldn’t dissolve or melt at 770 °C." },
          { t:"Conduct, because Z is metallic", why:"Metals are malleable and don’t dissolve." }] },
        b:{ prompt:"Solid W melts at 80 °C, never conducts and dissolves in hexane but not water. Which forces hold W’s particles together?", options:[
          { t:"Dispersion forces between nonpolar molecules", ok:true, why:"Low melting, non-conducting and soluble only in hexane: nonpolar molecules." },
          { t:"Hydrogen bonds", why:"It would dissolve in water." },
          { t:"Ionic bonds", why:"It would melt high and conduct when molten." },
          { t:"A covalent network", why:"Networks don’t melt at 80 °C." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why ethanol (78 °C) boils higher than methoxymethane (−24 °C), though both are C₂H₆O?", options:[
          { t:"“Both have 26 electrons, so similar dispersion forces. Ethanol’s O–H lets its molecules hydrogen bond; methoxymethane’s H atoms are all on C, so it has only dipole–dipole forces.”", ok:true, why:"Equal electrons, so the strongest IMF decides." },
          { t:"“Ethanol’s covalent bonds are stronger.”", why:"Boiling separates whole molecules. The covalent bonds stay." },
          { t:"“Methoxymethane is nonpolar.”", why:"Its bent C–O–C makes it polar." },
          { t:"“Ethanol is heavier.”", why:"They have the same formula." }] },
        b:{ prompt:"Which is the best explanation of why NH₃ (−33 °C) boils higher than PH₃ (−88 °C)?", options:[
          { t:"“PH₃ has more electrons, but NH₃ forms hydrogen bonds (H on N, with a lone pair on N), and they outweigh the small dispersion difference.”", ok:true, why:"N–H allows hydrogen bonding; P–H doesn’t." },
          { t:"“N–H bonds are harder to break.”", why:"Boiling doesn’t break N–H bonds." },
          { t:"“PH₃ is ionic.”", why:"It’s molecular." },
          { t:"“NH₃ has more electrons.”", why:"It has 10; PH₃ has 18." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which sentence correctly explains why solid NaCl doesn’t conduct but molten NaCl does?", options:[
          { t:"“In the solid, Na⁺ and Cl⁻ are fixed in the lattice. When molten, the ions are free to move and carry charge.”", ok:true, why:"Moving charged particles carry current; locked ions can’t." },
          { t:"“Molten NaCl contains free electrons.”", why:"Charge is carried by ions here." },
          { t:"“Solid NaCl is molecular.”", why:"It’s an ionic lattice." },
          { t:"“Heat turns NaCl into a metal.”", why:"No new substance forms." }] },
        b:{ prompt:"Which sentence correctly explains why graphite conducts but diamond doesn’t?", options:[
          { t:"“In graphite each carbon bonds to three others, leaving one delocalized electron free to move along the layers; in diamond all four electrons are in bonds.”", ok:true, why:"Only graphite has electrons free to move." },
          { t:"“Graphite is ionic.”", why:"It’s all carbon." },
          { t:"“Diamond’s electrons are too heavy.”", why:"Electron mass doesn’t change." },
          { t:"“Graphite is a metal.”", why:"It’s a covalent network with delocalized electrons." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A tile must survive 1500 °C without melting, must not conduct electricity and must resist scratching. Which solid type fits?", options:[
          { t:"Covalent network (such as a silicon-based ceramic)", ok:true, why:"Very high melting point, hard, non-conducting." },
          { t:"Metallic", why:"Metals conduct." },
          { t:"Molecular", why:"It would melt far below 1500 °C." },
          { t:"Ionic", why:"Brittle, and it conducts if it melts. A network solid is the safer match." }] },
        b:{ prompt:"A material must conduct electricity, bend without breaking and melt above 1000 °C. Which solid type fits?", options:[
          { t:"Metallic (such as copper)", ok:true, why:"Metals conduct and bend without breaking; copper melts at 1085 °C." },
          { t:"Ionic", why:"No conduction as a solid; brittle." },
          { t:"Covalent network", why:"Brittle and non-conducting (graphite can’t be bent into wires)." },
          { t:"Molecular", why:"Low melting point." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Ice floats on water. Which explanation uses intermolecular forces correctly?", options:[
          { t:"“In ice, hydrogen bonds hold molecules in an open hexagonal arrangement that takes up more space than the liquid, so ice is less dense.”", ok:true, why:"The hydrogen bonds fix the molecules in an open pattern." },
          { t:"“Ice contains air bubbles.”", why:"Pure ice floats too." },
          { t:"“Freezing breaks O–H bonds.”", why:"Freezing doesn’t break O–H bonds: ice is still H₂O." },
          { t:"“Ice is ionic.”", why:"It’s molecular." }] },
        b:{ prompt:"Rubbing alcohol (propan-2-ol, bp 82 °C) evaporates faster than water at room temperature. Which explanation is correct?", options:[
          { t:"“Each water molecule can form more hydrogen bonds (two H atoms on O, plus two lone pairs) than a propan-2-ol molecule (one O–H), so water’s molecules are held more strongly overall.”", ok:true, why:"More hydrogen bonds per molecule: water’s molecules escape less easily." },
          { t:"“Propan-2-ol has fewer electrons.”", why:"It has more (34 vs 10)." },
          { t:"“Propan-2-ol is ionic.”", why:"It’s molecular." },
          { t:"“Water’s O–H bonds are stronger.”", why:"Evaporation doesn’t break O–H bonds." }] } }
    ]
  },
  task:{
    title:"Boiling-point staircase", summary:"Boiling-point staircase",
    statement:"<p>Build a three-step staircase for a poster on molecular compounds: three substances that show dispersion, then dipole–dipole, then hydrogen bonding, in a fair comparison. Can you find all the answers?</p><ol class=\"imf-conds\"><li>All three have the same number of electrons (a fair test: dispersion controlled).</li><li>The strongest IMFs are, in order: dispersion only, dipole–dipole, hydrogen bonding.</li><li>They’re placed in order of increasing boiling point.</li><li>All three are compounds (no elements).</li></ol>",
    cards:["Ne", "CH4", "NH3", "HF", "H2O", "F2", "Ar", "SiH4", "C2H6", "PH3", "HCl", "H2S", "CH3OH", "C3H8", "CH3OCH3", "C2H5OH"],
    how:"Tap a card, then tap a step to place it. Tap a filled step to clear it.",
    checks:["Same electron count", "Dispersion → dipole → hydrogen bond", "Boiling point rises at each step", "Compounds only"],
    tips:["Count electrons: C has 6, H 1, O 8, Si 14, P 15, S 16, Cl 17.", "The 10-electron group has no substance with only dipole–dipole forces.", "Check the order of your steps.", "Ne, Ar and F₂ are elements."],
    explainPrompt:"Explain why equal electron counts make this a fair comparison, and what each step adds.",
    vocab:"Use the words dispersion, dipole–dipole, hydrogen bond, electrons and controlled variable.",
    more:"There’s more than one answer. Can you find another?",
    afterAt:7,
    after3:"Notice that every dipole–dipole substance boils above every dispersion-only one with the same electrons, and the hydrogen-bonded one tops each staircase."
  },
  cards:[
    ["Intermolecular force", "An attraction <em>between</em> particles. It is broken in melting and boiling; covalent bonds are not."],
    ["London dispersion force", "A temporary-dipole attraction present between all particles; it grows with the number of electrons and with surface contact."],
    ["Dipole–dipole force", "An attraction between the δ+ end of one polar molecule and the δ− end of another."],
    ["Hydrogen bond", "H bonded to N, O or F, attracted to a lone pair on N, O or F in another molecule."],
    ["Ion–dipole force", "An ion attracted to the oppositely charged end of polar molecules: how salts dissolve in water."],
    ["Ranking boiling points", "Match electrons first; then the strongest IMF decides."],
    ["Branching", "Fewer contact points, so weaker dispersion and a lower bp (pentane 36 °C vs 2,2-dimethylpropane 10 °C)."],
    ["Ionic solid", "Ions in a lattice: high mp, brittle, conducts only when molten or dissolved."],
    ["Molecular solid", "Molecules held by IMFs: low mp, soft, doesn’t conduct."],
    ["Covalent network solid", "Atoms bonded throughout: very high mp, very hard, doesn’t conduct (graphite is the exception)."],
    ["Metallic solid", "Cations in an electron sea: conducts as solid and liquid; malleable."],
    ["Water’s anomaly", "Hydrogen bonds make water boil about 180 °C higher than the group 16 trend predicts."]
  ]
};
