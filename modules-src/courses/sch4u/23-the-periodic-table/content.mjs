// SCH4U 23 The Periodic Table. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/23-the-periodic-table.md
// The pictures (hero, the Table builder with its Build / Mendeleev / Families modes, the Part 3 cards, the formula
// predictor and the task's main-group table) are drawn by app.js.

// Configuration text: "4s2 3d6" -> 4s<sup>2</sup> 3d<sup>6</sup>
const cf = s => s.replace(/([spdf])(\d+)/g, "$1<sup>$2</sup>");
// Ion: ion("Fe", "2+") -> Fe<sup>2+</sup> (true minus)
const ion = (el, c) => el + "<sup>" + c.replace("-", "−") + "</sup>";
// Formula: F("Ba3N2") -> Ba<sub>3</sub>N<sub>2</sub>
const F = s => s.replace(/(\d+)/g, "<sub>$1</sub>");
const N = "<em>n</em>";

// Misconception core sentences (plan §3)
const M1 = "It’s ordered by atomic number. That’s why Te (127.6) comes before I (126.9).";
const M2 = "Shells give the period. The group comes from the valence configuration.";
const M4 = "Metals lose electrons to reach a noble-gas configuration (" + ion("Na", "+") + "); halogens gain one (" + ion("Cl", "-") + ").";
const M5 = "The gaps were predictions, and germanium filled one almost exactly as forecast.";
const M6 = ion("Ba", "2+") + " and " + ion("N", "3-") + ": you need 3 " + ion("Ba", "2+") + " (6+) for 2 " + ion("N", "3-") + " (6−): " + F("Ba3N2") + ".";

// Practice 1: configuration ↔ family (8 pairs)
const PAIRS = [
  [N + "s<sup>1</sup>", "alkali metals", "One s electron to lose: group 1."],
  [N + "s<sup>2</sup> (in the s block)", "alkaline earth metals", "Two s electrons, nothing filling in d: group 2."],
  [N + "s<sup>2</sup> " + N + "p<sup>5</sup>", "halogens", "Seven valence electrons, one short of full: group 17."],
  [N + "s<sup>2</sup> " + N + "p<sup>6</sup>", "noble gases", "A full outer shell: group 18."],
  ["(" + N + "−1)d<sup>1–10</sup> " + N + "s<sup>1–2</sup>", "transition metals", "The d subshell is filling: the d block."],
  [N + "s<sup>2</sup> " + N + "p<sup>4</sup>", "group 16 (oxygen family)", "Six valence electrons: group 16."],
  [N + "s<sup>2</sup> " + N + "p<sup>3</sup>", "group 15 (nitrogen family)", "Five valence electrons: group 15."],
  ["(" + N + "−2)f filling", "lanthanides and actinides (f block)", "The f subshell is filling: the f block."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const PAIR_GOAL = [3, 3, 3, 3, 3, 2, 2, 2];

export default {
  id:"23-the-periodic-table",
  kind:"topic",
  title:"The periodic table",
  topic:"The Periodic Table",
  readyTopic:"the periodic table",
  hero:{
    eq:"period = highest shell · block = subshell being filled · group = shared valence configuration", eqSize:"sm",
    eqLabel:"Period equals the highest shell. Block equals the subshell being filled. Group equals a shared valence configuration.",
    headline:"A table that predicted elements before anyone found them",
    text:"Mendeleev grouped elements by their properties and left <strong>gaps</strong> for elements nobody had discovered. Today we know why his pattern works: the table is a map of <strong>electron configurations</strong>. The <strong>period</strong> tells you the outer shell, the <strong>block</strong> tells you the subshell being filled, and a <strong>group</strong> shares one valence configuration, so it shares its chemistry too.",
    fig:{ html:'<div class="pt-hx"><svg class="pt-hx-svg" id="pt-hx-svg" viewBox="0 0 440 300" role="img" aria-label="Mendeleev-style cards slide into rows by atomic mass, leaving a gap below silicon marked with a question mark. The question-mark card flips to show his prediction, mass about 72, grey, forms EO2, then flips again to germanium, found in 1886. The cards then re-flow into the modern long-form periodic table, and its four blocks light up in turn: s, p, d and f, each labelled with the subshell it fills. Germanium’s cell glows under the tag 1871: predicted."></svg><div class="pt-hx-row"><p class="pt-hx-ctr" id="pt-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="pt-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain how Mendeleev built his table and how his predictions supported it.",
    "I can read an element’s period, group and block from its electron configuration, and the reverse.",
    "I can describe the properties of the main families and of metals, nonmetals and metalloids.",
    "I can predict an unfamiliar element’s ion charge, compound formulas and properties from its position.",
    "I can explain why elements in a group behave similarly, using valence configurations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Configurations", goal:2,
          prompt:"Which configuration belongs to potassium (Z = 19)?",
          options:[
            { t:cf("[Ar] 4s1"), ok:true, why:"18 + 1 = 19; 4s fills before 3d." },
            { t:cf("[Ar] 3d1"), why:"4s fills first." },
            { t:cf("[Ne] 3s1"), why:"That’s sodium." },
            { t:cf("[Ar] 4s2"), why:"That’s calcium." }],
          hints:["Argon has 18.", "One more electron.", cf("[Ar] 4s1") + "."] },
        { id:"w2", skill:"Configurations", goal:2,
          prompt:"An element is " + cf("[Ne] 3s2 3p3") + ". Which period is it in?",
          options:[
            { t:"Period 3", ok:true, why:"The highest shell is " + N + " = 3." },
            { t:"Period 5", why:"5 is the number of valence electrons. " + M2 },
            { t:"Period 15", why:"15 is the group." },
            { t:"Period 2", why:"Neon’s core is period 2; the outer shell is " + N + " = 3." }],
          hints:["Period = the highest " + N + ".", "3s and 3p.", "Period 3."] },
        { id:"w3", skill:"Ions", goal:4,
          prompt:"Which ion does magnesium usually form?",
          options:[
            { t:ion("Mg", "2+"), ok:true, why:"It loses its two 3s electrons." },
            { t:ion("Mg", "2-"), why:"Metals lose electrons. " + M4 },
            { t:ion("Mg", "+"), why:"It loses both valence electrons." },
            { t:ion("Mg", "6-"), why:"Gaining 6 electrons isn’t realistic for a metal." }],
          hints:["Group 2.", "Lose the valence electrons.", ion("Mg", "2+") + "."] },
        { id:"w4", skill:"Ions", goal:4,
          prompt:"Which ion does sulfur usually form?",
          options:[
            { t:ion("S", "2-"), ok:true, why:"It gains 2 electrons to reach the argon configuration." },
            { t:ion("S", "6+"), why:"Losing 6 takes far more energy than gaining 2." },
            { t:ion("S", "2+"), why:M4 },
            { t:ion("S", "-"), why:"It needs 2 to fill 3p." }],
          hints:["Group 16: 6 valence electrons.", "2 short of 8.", ion("S", "2-") + "."] },
        { id:"w5", skill:"Families", goal:3,
          prompt:"Which family is made of very unreactive gases?",
          options:[
            { t:"Noble gases", ok:true, why:"Full outer shells." },
            { t:"Halogens", why:"Halogens are very reactive." },
            { t:"Alkali metals", why:"Those are very reactive metals." },
            { t:"Alkaline earth metals", why:"Those are reactive metals." }],
          hints:["Group 18.", "Full shells.", "Noble gases."] },
        { id:"w6", skill:"Families", goal:3,
          prompt:"Which element is a metalloid?",
          options:[
            { t:"Si", ok:true, why:"On the staircase; a semiconductor." },
            { t:"S", why:"Sulfur is a nonmetal." },
            { t:"Al", why:"Aluminium is a metal, though it’s next to the staircase." },
            { t:"Na", why:"Sodium is a metal." }],
          hints:["Look along the staircase line.", "B, Si, Ge, As, Sb, Te.", "Si."] }
      ],
      refreshers:{
        "Configurations":"Period = the highest shell number. The last subshell filled gives the block.",
        "Ions":"Main-group metals lose their valence electrons; nonmetals gain enough to fill their p subshell.",
        "Families":"Group 1 alkali metals, group 2 alkaline earth metals, group 17 halogens, group 18 noble gases; the metalloids sit on the staircase."
      }
    }
  },
  explore:{
    heading:"Table builder",
    intro:"Build the table from configurations, test Mendeleev’s method, then explore the families.",
    how:"Choose a mode. <strong>Build:</strong> tap a configuration card, then tap its cell. <strong>Mendeleev:</strong> tap the gap, then two or four neighbours, then <strong>Average</strong>. <strong>Families:</strong> tap a group number above the table. Tap any element to read it. Arrow keys move between cells; Enter places the selected card.",
    modes:[{ id:"build", t:"Build" }, { id:"mend", t:"Mendeleev" }, { id:"fam", t:"Families" }],
    layers:[{ id:"blocks", t:"Blocks" }, { id:"metal", t:"Metals–nonmetals" }, { id:"val", t:"Valence electrons" }],
    // Build deck: each card shows only a configuration; answer = the element's Z (cards c1–c5 are TC1's five)
    deck:[
      { id:"c1", cfg:cf("[Ne] 3s2 3p3"), answer:15 },
      { id:"c2", cfg:cf("[Ar] 4s1"), answer:19 },
      { id:"c3", cfg:cf("[Kr] 5s2 4d10 5p5"), answer:53 },
      { id:"c4", cfg:cf("[Ar] 4s2 3d6"), answer:26 },
      { id:"c5", cfg:cf("[Xe] 6s2"), answer:56 },
      { id:"c6", cfg:cf("[Ar] 4s2 3d10 4p5"), answer:35 },
      { id:"c7", cfg:cf("[He] 2s2 2p4"), answer:8 },
      { id:"c8", cfg:cf("[Ar] 4s2 3d10 4p1"), answer:31 }
    ],
    wrongP1:"Count the shells, not the valence electrons. " + M2,
    wrongFe:"3d is being filled: d block.",
    // Mendeleev mode: an 1871-style table (groups I–VII by series, ordered by atomic mass); "?" is eka-silicon's gap
    mend:{
      cols:["I", "II", "III", "IV", "V", "VI", "VII"],
      rows:[
        { n:"2", els:["Li", "Be", "B", "C", "N", "O", "F"] },
        { n:"3", els:["Na", "Mg", "Al", "Si", "P", "S", "Cl"] },
        { n:"4", els:["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn"] },
        { n:"5", els:["Cu", "Zn", "Ga", "?", "As", "Se", "Br"] },
        { n:"6", els:["Rb", "Sr", "Y", "Zr", "Nb", "Mo", ""] },
        { n:"7", els:["Ag", "Cd", "In", "Sn", "Sb", "Te", "I"] },
        { n:"11", els:["Au", "Hg", "Tl", "Pb", "Bi", "", ""] }
      ],
      later:{ Sc:"gap in 1871; found 1879", Ga:"gap in 1871; found 1875" },
      note:"Series 8–10 and group VIII are left out. Scandium and gallium also filled gaps Mendeleev left; germanium’s gap is still open here.",
      steps:"Tap the gap (?), then tap two or four neighbouring elements, then press <strong>Average</strong>.",
      ge:{
        title:"Germanium vs Mendeleev’s eka-silicon",
        head:["Property", "Predicted (1871)", "Observed (germanium, 1886)"],
        rows:[
          ["Atomic mass", "≈ 72", "72.6"],
          ["Density", "≈ 5.5 g/cm³", "5.35 g/cm³"],
          ["Colour", "dark grey", "greyish-white"],
          ["Oxide", "EO<sub>2</sub>", "GeO<sub>2</sub>"],
          ["Chloride", "ECl<sub>4</sub>, boiling a little under 100 °C", "GeCl<sub>4</sub>, 86 °C"]
        ],
        after:"The gap was a prediction, not a mistake. Winkler found germanium in 1886, and it matched closely."
      }
    },
    families:{
      g1:{ name:"Alkali metals", cfg:N + "s<sup>1</sup>", ion:"1+ (" + ion("Na", "+") + ", " + ion("K", "+") + ")", props:"Soft, very reactive metals that form 1+ ions. Reactivity increases down the group.", clip:"alkali" },
      g2:{ name:"Alkaline earth metals", cfg:N + "s<sup>2</sup>", ion:"2+ (" + ion("Mg", "2+") + ", " + ion("Ca", "2+") + ")", props:"Reactive metals that form 2+ ions; less reactive than the alkali metals beside them." },
      tm:{ name:"Transition metals (groups 3–12)", cfg:"(" + N + "−1)d<sup>1–10</sup> " + N + "s<sup>1–2</sup>", ion:"several (" + ion("Fe", "2+") + " and " + ion("Fe", "3+") + ")", props:"d-block metals with several possible ion charges, coloured compounds, and uses as catalysts." },
      g13:{ name:"Group 13 (boron family)", cfg:N + "s<sup>2</sup> " + N + "p<sup>1</sup>", ion:"3+ for the metals (" + ion("Al", "3+") + ", " + ion("Ga", "3+") + ")", props:"Boron is a metalloid; aluminium, gallium, indium and thallium are metals." },
      g14:{ name:"Group 14 (carbon family)", cfg:N + "s<sup>2</sup> " + N + "p<sup>2</sup>", ion:"C, Si and Ge share electrons; Sn and Pb form 2+ or 4+ ions", props:"Runs from a nonmetal (C) through metalloids (Si, Ge) to metals (Sn, Pb)." },
      g15:{ name:"Group 15 (nitrogen family)", cfg:N + "s<sup>2</sup> " + N + "p<sup>3</sup>", ion:"3− for the nonmetals (" + ion("N", "3-") + ", " + ion("P", "3-") + ")", props:"Nonmetals N and P, metalloids As and Sb, and the metal Bi: metallic character increases down the group." },
      g16:{ name:"Group 16 (oxygen family)", cfg:N + "s<sup>2</sup> " + N + "p<sup>4</sup>", ion:"2− (" + ion("O", "2-") + ", " + ion("S", "2-") + ")", props:"Nonmetals O, S and Se and the metalloid Te gain 2 electrons to fill the p subshell." },
      g17:{ name:"Halogens", cfg:N + "s<sup>2</sup> " + N + "p<sup>5</sup>", ion:"1− (" + ion("Cl", "-") + ", " + ion("Br", "-") + ")", props:"Reactive nonmetals, diatomic (Cl<sub>2</sub>, Br<sub>2</sub>), forming 1− ions. Reactivity decreases down the group.", clip:"halogen" },
      g18:{ name:"Noble gases", cfg:N + "s<sup>2</sup> " + N + "p<sup>6</sup> (He: 1s<sup>2</sup>)", ion:"none (noble gas)", props:"Full outer shells: very unreactive gases." }
    },
    clips:{
      alkali:{ title:"Group 1 metals added to water (observations only)", frames:[["Li", "fizzes"], ["Na", "melts into a ball and skims"], ["K", "bursts into a lilac flame"]], note:"The vigour increases down the group: Li, then Na, then K." },
      halogen:{ title:"The halogens at room temperature", frames:[["Cl<sub>2</sub>", "pale yellow-green gas"], ["Br<sub>2</sub>", "red-brown liquid"], ["I<sub>2</sub>", "purple-black solid"]], note:"Same valence configuration, but the larger molecules go from gas to liquid to solid down the group." }
    },
    predictions:[
      { id:"p1", prompt:"Build mode, a card showing " + cf("[Ar] 4s2 3d10 4p5") + ". Which group does this element belong to?",
        options:[{ t:"Group 17 (a halogen)", ok:true }, { t:"Group 7" }, { t:"Group 5" }, { t:"Group 15" }],
        explain:cf("4s2 4p5") + " means 7 valence electrons in the p block: group 17. " + M2 + " The block is the subshell being filled." },
      { id:"p2", prompt:"Mendeleev mode, with tellurium and iodine highlighted. Mendeleev put tellurium (127.6) before iodine (126.9), against the mass order. Why?",
        options:[{ t:"Iodine’s properties match the halogens", ok:true }, { t:"He made a mistake" }, { t:"Tellurium is heavier" }, { t:"Iodine was unknown then" }],
        explain:"Properties came first. Atomic number later confirmed his order. " + M1 },
      { id:"p3", prompt:"Iron’s configuration ends in " + cf("3d6") + ". Which block is iron in?",
        options:[{ t:"d block", ok:true }, { t:"s block" }, { t:"p block" }, { t:"f block" }],
        explain:"The block is the subshell being filled." },
      { id:"p4", prompt:"Strontium is in group 2, period 5. Which ion does it form?",
        options:[{ t:ion("Sr", "2+"), ok:true }, { t:ion("Sr", "2-") }, { t:ion("Sr", "+") }, { t:ion("Sr", "5+") }],
        explain:"It loses its two 5s electrons, like every group 2 metal. " + M4 }
    ],
    chalIntro:"Use the Table builder to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Build mode: place these five cards: " + cf("[Ne] 3s2 3p3") + " · " + cf("[Ar] 4s1") + " · " + cf("[Kr] 5s2 4d10 5p5") + " · " + cf("[Ar] 4s2 3d6") + " · " + cf("[Xe] 6s2") + ".",
        why:"P, K, I, Fe and Ba: the highest " + N + " gives the period, the last subshell gives the block, and the valence electrons give the group.",
        hints:["Period = highest " + N + ".", "Block = last subshell; group = valence electrons for s and p.", "P, K, I, Fe, Ba."] },
      { id:"tc2", goal:1, prompt:"Mendeleev mode: use the neighbour-average tool to predict eka-silicon’s atomic mass to within ±2 of Mendeleev’s 72.",
        why:"The neighbours of the gap average to about 72–73, just as Mendeleev predicted. Germanium’s mass turned out to be 72.6.",
        hints:["Which elements touch the gap?", "Si above, Sn below, Ga and As on each side.", "Average them: about 72–73."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Clue card: “I have 3 occupied shells. I form a 3− ion. I’m a solid nonmetal.” Find me. Then find the element in my group with the most metallic character.",
        why:"Phosphorus: period 3, group 15 (" + cf("3s2 3p3") + "), gains 3 electrons. Metallic character increases down a group, so bismuth at the bottom is the most metallic.",
        hints:["3− means 5 valence electrons: group 15.", "Period 3 in group 15.", "P. Metallic character increases down a group, so the bottom member, Bi."] }
    ]
  },
  part3:{
    slug:"predict", name:"Predict", heading:"Predict an element",
    intro:"Do what Mendeleev did: from a position alone, predict an element’s chemistry, then check your predictions against real data.",
    s1:{ title:"Station 1: Three mystery cards",
      intro:"Each card shows only a position. Choose a chip in every row, then press <strong>Commit my predictions</strong>.",
      cards:[
        { id:"A", pos:"Period 5, group 1", el:"Rb", name:"rubidium", cfg:cf("[Kr] 5s1"), real:ion("Rb", "+") + " ions; compounds " + F("RbCl") + " and " + F("Rb2O"),
          qs:[
            { id:"type", label:"Type", options:[{ t:"metal", ok:true, why:"Everything in group 1 below hydrogen is a metal." }, { t:"metalloid" }, { t:"nonmetal" }] },
            { id:"ion", label:"Common ion", options:[{ t:ion("X", "+"), ok:true, why:"One valence electron (5s<sup>1</sup>) to lose: " + ion("Rb", "+") + "." }, { t:ion("X", "2+") }, { t:ion("X", "-") }, { t:ion("X", "2-") }] },
            { id:"cl", label:"Chloride formula", options:[{ t:"XCl", ok:true, why:ion("Rb", "+") + " and " + ion("Cl", "-") + " balance one-to-one: RbCl." }, { t:F("XCl2") }, { t:F("X2Cl") }, { t:F("XCl3") }] },
            { id:"ox", label:"Oxide formula", options:[{ t:F("X2O"), ok:true, why:"Two " + ion("Rb", "+") + " balance one " + ion("O", "2-") + ": " + F("Rb2O") + "." }, { t:"XO" }, { t:F("XO2") }, { t:F("X2O3") }] },
            { id:"re", label:"Reactivity", options:[{ t:"More reactive than K", ok:true, why:"Reactivity increases down group 1: the 5s electron is farther from the nucleus and easier to lose." }, { t:"Less reactive than K" }] }
          ] },
        { id:"B", pos:"Period 4, group 16", el:"Se", name:"selenium", cfg:cf("[Ar] 4s2 3d10 4p4"), real:ion("Se", "2-") + " ions; compound " + F("Na2Se"),
          qs:[
            { id:"type", label:"Type", options:[{ t:"nonmetal", ok:true, why:"Selenium sits to the right of the staircase: a nonmetal." }, { t:"metalloid" }, { t:"metal" }] },
            { id:"ion", label:"Common ion", options:[{ t:ion("X", "2-"), ok:true, why:"Six valence electrons (4s<sup>2</sup> 4p<sup>4</sup>): it gains 2 to reach the krypton configuration." }, { t:ion("X", "2+") }, { t:ion("X", "6+") }, { t:ion("X", "-") }] },
            { id:"na", label:"Formula with sodium", options:[{ t:F("Na2X"), ok:true, why:"Two " + ion("Na", "+") + " balance one " + ion("Se", "2-") + ": " + F("Na2Se") + "." }, { t:"NaX" }, { t:F("NaX2") }, { t:F("Na2X3") }] },
            { id:"re", label:"Reactivity", options:[{ t:"Less reactive than S as an electron gainer", ok:true, why:"Down a nonmetal group the atoms get larger, so they gain electrons less readily." }, { t:"More reactive than S as an electron gainer" }] }
          ] },
        { id:"C", pos:"Period 6, group 2", el:"Ba", name:"barium", cfg:cf("[Xe] 6s2"), real:ion("Ba", "2+") + " ions; compounds " + F("BaCl2") + " and BaO",
          qs:[
            { id:"type", label:"Type", options:[{ t:"metal", ok:true, why:"Group 2 elements are metals." }, { t:"metalloid" }, { t:"nonmetal" }] },
            { id:"ion", label:"Common ion", options:[{ t:ion("X", "2+"), ok:true, why:"Two valence electrons (6s<sup>2</sup>) to lose: " + ion("Ba", "2+") + "." }, { t:ion("X", "+") }, { t:ion("X", "2-") }, { t:ion("X", "3+") }] },
            { id:"cl", label:"Chloride formula", options:[{ t:F("XCl2"), ok:true, why:ion("Ba", "2+") + " needs two " + ion("Cl", "-") + ": " + F("BaCl2") + "." }, { t:"XCl" }, { t:F("X2Cl") }, { t:F("XCl3") }] },
            { id:"ox", label:"Oxide formula", options:[{ t:"XO", ok:true, why:ion("Ba", "2+") + " and " + ion("O", "2-") + " balance one-to-one: BaO." }, { t:F("X2O") }, { t:F("XO2") }, { t:F("X2O3") }] },
            { id:"re", label:"Reactivity", options:[{ t:"More reactive than Sr", ok:true, why:"Reactivity increases down group 2: the 6s electrons are easier to lose." }, { t:"Less reactive than Sr" }] }
          ] }
      ] },
    s2:{ title:"Station 2: Check it with data", intro:"After you commit, the element’s real data appears here and each prediction is marked." },
    s3:{ title:"Station 3: How close was Mendeleev?",
      intro:"Percent difference = (predicted − observed) ÷ observed × 100%. Compare two of Mendeleev’s eka-silicon predictions with germanium’s data.",
      rows:[["Atomic mass", "≈ 72", "72.6"], ["Density", "≈ 5.5 g/cm³", "5.35 g/cm³"]],
      use:"<strong>Use these values:</strong> 0.15 ÷ 5.35 ≈ 0.028 · 0.6 ÷ 72.6 ≈ 0.008",
      q1:{ prompt:"Percent difference for density, (5.5 − 5.35) ÷ 5.35 × 100%:", options:[{ t:"≈ 2.8%", ok:true, why:"(5.5 − 5.35) ÷ 5.35 = 0.15 ÷ 5.35 ≈ 0.028, so about 2.8%." }, { t:"≈ 0.15%", why:"0.15 is the difference itself; divide it by 5.35, then multiply by 100%." }, { t:"≈ 28%", why:"0.028 × 100% = 2.8%." }, { t:"≈ 0.8%", why:"That’s the atomic-mass difference: (72.6 − 72) ÷ 72.6 ≈ 0.8%." }] },
      q2:{ prompt:"Which prediction was closest to the observed value?", options:[{ t:"Atomic mass (≈ 0.8%)", ok:true, why:"0.8% beats 2.8%: his mass prediction was the closer one, and both are remarkably close." }, { t:"Density (≈ 2.8%)", why:"2.8% is a bigger difference than the atomic mass’s 0.8%." }] } },
    quickCheck:{
      title:"Quick check", summary:"Predict an element quick check",
      items:[
        { id:"q1", goal:4, prompt:"Formula of the compound of Ca and Br?",
          choices:[
            { t:F("CaBr2"), ok:true, fb:"Right. " + ion("Ca", "2+") + " needs two " + ion("Br", "-") + "." },
            { t:"CaBr", fb:ion("Ca", "2+") + " needs two " + ion("Br", "-") + ". " + M6 },
            { t:F("Ca2Br"), fb:ion("Ca", "2+") + " needs two " + ion("Br", "-") + "." },
            { t:F("CaBr3"), fb:ion("Ca", "2+") + " needs two " + ion("Br", "-") + "." }] },
        { id:"q2", goal:2, prompt:"Element in period 4 with valence configuration " + cf("4s2 4p2") + "?",
          choices:[
            { t:"Ge", ok:true, fb:"Right. Period 4, group 14." },
            { t:"Ti", fb:"Period 4, group 14." },
            { t:"Sn", fb:"Period 4, group 14." },
            { t:"Si", fb:"Period 4, group 14." }] },
        { id:"q3", goal:3, prompt:"Which is most metallic: N, P, As or Bi?",
          choices:[
            { t:"Bi", ok:true, fb:"Right. Metallic character increases down a group." },
            { t:"N", fb:"Metallic character increases down a group." },
            { t:"P", fb:"Metallic character increases down a group." },
            { t:"As", fb:"Metallic character increases down a group." }] },
        { id:"q4", goal:4, prompt:"Gallium is below aluminium. Its oxide formula?",
          choices:[
            { t:F("Ga2O3"), ok:true, fb:"Right. " + ion("Ga", "3+") + " and " + ion("O", "2-") + ": 2 × 3+ = 3 × 2−." },
            { t:"GaO", fb:ion("Ga", "3+") + " and " + ion("O", "2-") + ": 2 × 3+ = 3 × 2−." },
            { t:F("GaO2"), fb:ion("Ga", "3+") + " and " + ion("O", "2-") + ": 2 × 3+ = 3 × 2−." },
            { t:F("Ga3O2"), fb:ion("Ga", "3+") + " and " + ion("O", "2-") + ": 2 × 3+ = 3 × 2−." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Configuration ↔ family", summary:"Configuration ↔ family", goal:[2, 3],
        instruction:"Match each valence configuration to its family or block.",
        leftTitle:"Valence configuration", rightTitle:"Family or block",
        left:PAIRS.map((p, i) => {
          const L = { id:"l" + (i + 1), t:p[0], why:p[2], goal:PAIR_GOAL[i] };
          if (i === 4) L.hints = ["Which subshell is filling?", "(" + N + "−1)d.", "Transition metals."];
          return L;
        }),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        wrong:{
          "l3|r4":N + "p<sup>5</sup> is one short of full.",
          "l2|r5":N + "s<sup>2</sup> alone (nothing filling in d) is group 2."
        },
        wrongDefault:"Count the valence electrons, then find the block." },
      { id:"formula", type:"custom", title:"Formula predictor", summary:"Formula predictor", star:true, goal:4,
        instruction:"Predict the formula of the compound of each pair of elements. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap a subscript chip for each element (1 means no subscript), then press Check.",
        items:[
          { id:"f1", goal:4, a:"Sr", b:"Cl", answer:"1,2", display:F("SrCl2"),
            wrong:[{ match:"1,1", fb:ion("Sr", "2+") + " needs two " + ion("Cl", "-") + "." }],
            fb:"Work out each ion’s charge from its group, then balance the charges.",
            // VERIFY: hints for F1–F3, F5 and F6 were written for the module (the plan gives hints for F4 only).
            hints:["Ion charges first.", ion("Sr", "2+") + " (group 2) and " + ion("Cl", "-") + " (group 17).", F("SrCl2") + "."] },
          { id:"f2", goal:4, a:"Rb", b:"S", answer:"2,1", display:F("Rb2S"),
            wrong:[{ match:"1,1", fb:ion("Rb", "+") + " and " + ion("S", "2-") + ": two " + ion("Rb", "+") + " balance one " + ion("S", "2-") + "." }],
            fb:"Work out each ion’s charge from its group, then balance the charges.",
            hints:["Ion charges first.", ion("Rb", "+") + " and " + ion("S", "2-") + ".", F("Rb2S") + "."] },
          { id:"f3", goal:4, star:true, a:"Ga", b:"O", answer:"2,3", display:F("Ga2O3"),
            wrong:[{ match:"1,1", fb:"Ga is in group 13: " + ion("Ga", "3+") + "." }],
            fb:"Work out each ion’s charge from its group, then balance the charges.",
            hints:["Ion charges first.", ion("Ga", "3+") + " (group 13) and " + ion("O", "2-") + ".", "Lowest common multiple 6: " + F("Ga2O3") + "."] },
          { id:"f4", goal:4, star:true, a:"Ba", b:"N", answer:"3,2", display:F("Ba3N2"),
            wrong:[{ match:"1,1", fb:ion("Ba", "2+") + " and " + ion("N", "3-") + ": 6+ and 6−. " + M6 }],
            fb:"Work out each ion’s charge from its group, then balance the charges.",
            hints:["Ion charges first.", ion("Ba", "2+") + ", " + ion("N", "3-") + ".", "Lowest common multiple 6: " + F("Ba3N2") + "."] },
          { id:"f5", goal:4, star:true, a:"Al", b:"Se", answer:"2,3", display:F("Al2Se3"),
            wrong:[{ match:"1,1", fb:"Se is below O, so " + ion("Se", "2-") + "." }],
            fb:"Work out each ion’s charge from its group, then balance the charges.",
            hints:["Ion charges first.", ion("Al", "3+") + " and " + ion("Se", "2-") + " (group 16, like O).", "Lowest common multiple 6: " + F("Al2Se3") + "."] },
          { id:"f6", goal:4, star:true, kind:"chips", prompt:"Element X is in period 5, group 13; element Y is in period 3, group 15. Formula of their compound?",
            display:"XY (that is, InP)",
            options:[
              { t:"XY", ok:true, why:ion("X", "3+") + " and " + ion("Y", "3-") + " balance one-to-one: InP." },
              { t:F("X3Y2"), why:ion("X", "3+") + " and " + ion("Y", "3-") + " balance one-to-one." },
              { t:F("X2Y3"), why:"That would need " + ion("X", "3+") + " with " + ion("Y", "2-") + "; group 15 gives " + ion("Y", "3-") + "." },
              { t:F("XY3"), why:"That would need " + ion("X", "3+") + " with " + ion("Y", "-") + "; group 15 gives " + ion("Y", "3-") + "." }],
            hints:["Find each element’s group, then its ion.", "X is in group 13: " + ion("X", "3+") + ". Y is in group 15: " + ion("Y", "3-") + ".", "3+ and 3− balance one-to-one: XY (InP)."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Obi", how:"", goal:[2, 4],
        instruction:"Obi made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Locate the element " + cf("[Ar] 4s2 3d10 4p3") + " in the table.",
            steps:["The core is argon, so 18 electrons; there are 15 more.", "The highest shell is " + N + " = 4, so period 4.", "The last subshell filled is 4p, so the p block.", "It has 4 shells, so it’s in group 4.", "So it’s titanium."],
            answer:3,
            stepFb:["Step 1 is correct (Z = 33).", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"Valence electrons " + cf("4s2 4p3") + " = 5, so group 15: arsenic.", ok:true, why:M2 },
              { t:"Group 3.", why:"Count 4s and 4p." },
              { t:"Group 13.", why:"4p<sup>3</sup> is the third p column, so group 15." },
              { t:"Step 4 is correct.", why:"Shells give the period, not the group. " + M2 }],
            hints:["What does the shell number tell you?", "The period.", "Valence electrons " + cf("4s2 4p3") + " = 5, so group 15: arsenic."] },
          { id:"e2", goal:4, task:"Predict the formula of the compound of aluminium and oxygen.",
            steps:["Al is in group 13, so it forms " + ion("Al", "3+") + ".", "O is in group 16, so it forms " + ion("O", "+") + ".", "So the formula is " + F("Al2O3") + "?"],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 doesn’t follow from step 2; the mistake is earlier."],
            fixes:[
              { t:"O gains 2 electrons: " + ion("O", "2-") + ". Then 2 " + ion("Al", "3+") + " (6+) balance 3 " + ion("O", "2-") + " (6−): " + F("Al2O3") + ".", ok:true, why:M4 },
              { t:"O forms " + ion("O", "6+") + ".", why:"Nonmetals gain electrons." },
              { t:"O forms " + ion("O", "2+") + ".", why:M4 },
              { t:"Step 2 is correct.", why:ion("O", "+") + " would be a cation; oxygen gains electrons. " + M4 }],
            hints:["Does a nonmetal gain or lose electrons?", "It gains 2.", "O gains 2 electrons: " + ion("O", "2-") + ". Then 2 " + ion("Al", "3+") + " (6+) balance 3 " + ion("O", "2-") + " (6−): " + F("Al2O3") + "."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how close Mendeleev’s germanium predictions were, or that the table’s shape comes from subshells?" },
      { id:"j2", q:"In your own words, explain why elements in the same group behave similarly." },
      { id:"j3", q:"Explain to a friend how to predict a formula from two elements’ positions." },
      { id:"j4", q:"Which part of reading the table is still shaky for you? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"An element’s configuration ends in " + cf("4p3") + ". Which block and period is it in?", options:[
          { t:"p block, period 4", ok:true, why:"4p is a p subshell, and its shell is " + N + " = 4." },
          { t:"d block, period 4", why:"4p is a p subshell. The block is the subshell being filled: " + cf("4p3") + " is in the p block." },
          { t:"p block, period 3", why:N + " = 4." },
          { t:"p block, period 5", why:"5 is the number of valence electrons. " + M2 }] },
        b:{ prompt:"An element’s configuration ends in " + cf("3d5") + " (after " + cf("4s2") + "). Which block and period is it in?", options:[
          { t:"d block, period 4", ok:true, why:cf("4s2") + " is the highest shell; 3d is filling." },
          { t:"d block, period 3", why:"The period comes from 4s." },
          { t:"p block, period 4", why:"The block is the subshell being filled: " + cf("3d5") + " is in the d block." },
          { t:"s block, period 4", why:"3d is filling, so the d block." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Elements with valence configuration " + N + "s<sup>1</sup> are the…", options:[
          { t:"alkali metals", ok:true, why:"One s electron to lose: group 1." },
          { t:"alkaline earth metals", why:"Those are " + N + "s<sup>2</sup>." },
          { t:"halogens", why:"Those are " + N + "s<sup>2</sup> " + N + "p<sup>5</sup>." },
          { t:"noble gases", why:"Those have full shells." }] },
        b:{ prompt:"Elements with valence configuration " + N + "s<sup>2</sup> " + N + "p<sup>6</sup> are the…", options:[
          { t:"noble gases", ok:true, why:"A full outer shell: group 18." },
          { t:"halogens", why:"Halogens are one electron short." },
          { t:"alkaline earth metals", why:"Those are " + N + "s<sup>2</sup> only." },
          { t:"transition metals", why:"Those are in the d block." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"The modern periodic table is ordered by…", options:[
          { t:"atomic number", ok:true, why:"That’s why Te (127.6) comes before I (126.9)." },
          { t:"atomic mass", why:"That was Mendeleev’s main order, with exceptions. " + M1 },
          { t:"number of neutrons", why:"Isotopes differ in neutrons." },
          { t:"date of discovery", why:"No: discovery dates play no part in the order." }] },
        b:{ prompt:"Mendeleev mainly ordered the elements by…", options:[
          { t:"atomic mass, adjusted where properties demanded it", ok:true, why:"Mass first, with properties overruling it (Te before I)." },
          { t:"atomic number", why:"Atomic number wasn’t understood until later." },
          { t:"electron configuration", why:"Electrons weren’t discovered yet." },
          { t:"alphabetical order", why:"No: he used atomic mass and properties." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Indium is in group 13, period 5. Predict the formula of indium chloride.", options:[
          { t:F("InCl3"), ok:true, why:ion("In", "3+") + " with three " + ion("Cl", "-") + "." },
          { t:"InCl", why:"Group 13 gives 3+." },
          { t:F("InCl5"), why:"5 is the period." },
          { t:F("In3Cl"), why:"The charges are uncrossed incorrectly." }] },
        b:{ prompt:"Barium is in group 2. Predict the formula of barium nitride.", options:[
          { t:F("Ba3N2"), ok:true, why:ion("Ba", "2+") + " × 3 = 6+; " + ion("N", "3-") + " × 2 = 6−." },
          { t:"BaN", why:M6 },
          { t:F("Ba2N3"), why:"That gives 4+ and 9−." },
          { t:F("BaN2"), why:"That gives 2+ and 6−." }] } },
      { id:"t2", cat:"T", goal:1,
        a:{ prompt:"Use the neighbour average of S (32.1) and Te (127.6) to predict selenium’s atomic mass.", options:[
          { t:"About 80 (the actual value is 79.0)", ok:true, why:"(32.1 + 127.6) ÷ 2 ≈ 79.9." },
          { t:"About 160", why:"That’s the sum, not the average." },
          { t:"About 48", why:"That’s half of the difference." },
          { t:"About 127", why:"That’s tellurium’s mass." }] },
        b:{ prompt:"Use the neighbour average of Cl (−34 °C) and I (184 °C) to predict bromine’s boiling point.", options:[
          { t:"75 °C (the actual value is 59 °C)", ok:true, why:"(−34 + 184) ÷ 2 = 75: close." },
          { t:"150 °C", why:"That’s the sum." },
          { t:"109 °C", why:"That’s half of the difference, 218 ÷ 2." },
          { t:"184 °C", why:"That’s iodine’s boiling point." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Francium is in group 1, period 7. Predict its oxide formula and its reactivity compared with cesium.", options:[
          { t:F("Fr2O") + "; more reactive than Cs", ok:true, why:"Group 1 forms 1+ ions; reactivity rises down the group." },
          { t:"FrO; less reactive", why:"1+, and further down means more reactive." },
          { t:F("Fr2O") + "; less reactive", why:"Lower IE<sub>1</sub> means more reactive." },
          { t:F("FrO2") + "; more reactive", why:ion("Fr", "+") + " needs half an " + ion("O", "2-") + " each: " + F("Fr2O") + "." }] },
        b:{ prompt:"Astatine is in group 17, period 6. Predict the formula of sodium astatide and how its reactivity compares with iodine’s.", options:[
          { t:"NaAt; less reactive than iodine", ok:true, why:ion("At", "-") + "; halogen reactivity falls down the group." },
          { t:"NaAt; more reactive", why:"For halogens, reactivity decreases down the group." },
          { t:F("Na2At"), why:"At gains one electron. " + M4 },
          { t:F("NaAt7"), why:"7 is the number of valence electrons." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best explanation of why sodium and potassium react with water in similar ways?", options:[
          { t:"“Both have one valence electron (" + N + "s<sup>1</sup>) that they lose easily, forming 1+ ions.”", ok:true, why:"Same valence configuration, same chemistry." },
          { t:"“They have the same number of shells.”", why:M2 },
          { t:"“They have similar masses.”", why:"23 vs 39." },
          { t:"“Both are in period 3.”", why:"K is in period 4." }] },
        b:{ prompt:"Which is the best explanation of why chlorine and bromine form similar compounds?", options:[
          { t:"“Both have the valence configuration " + N + "s<sup>2</sup> " + N + "p<sup>5</sup> and gain one electron to form 1− ions.”", ok:true, why:"Same valence configuration, same chemistry." },
          { t:"“Both are gases.”", why:"Bromine is a liquid." },
          { t:"“They’re in the same period.”", why:"Different periods, same group." },
          { t:"“They have the same number of protons.”", why:"17 vs 35." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which statement uses Mendeleev’s work as evidence correctly?", options:[
          { t:"“He left a gap below silicon and predicted its properties; germanium, discovered later, matched them closely, supporting the periodic pattern.”", ok:true, why:"A prediction that came true is strong evidence for the pattern." },
          { t:"“His gaps showed that the table was wrong.”", why:M5 },
          { t:"“He discovered germanium himself.”", why:"Winkler discovered it in 1886." },
          { t:"“His table was ordered exactly by atomic number.”", why:M1 }] },
        b:{ prompt:"Which statement correctly describes the transition metals?", options:[
          { t:"“d-block metals that often form ions of more than one charge and coloured compounds, and that are used as catalysts.”", ok:true, why:"All three properties come from the filling d subshell." },
          { t:"“Very unreactive gases.”", why:"Those are the noble gases." },
          { t:"“Metals that always form 1+ ions.”", why:"That describes group 1." },
          { t:"“Nonmetals in the p block.”", why:"They’re metals in the d block." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Why are silicon and germanium used to make computer chips?", options:[
          { t:"“They’re metalloids (semiconductors): their conductivity sits between a metal’s and a nonmetal’s and can be tuned.”", ok:true, why:"Metalloids on the staircase have in-between properties." },
          { t:"“They’re the best metallic conductors.”", why:"Copper conducts far better." },
          { t:"“They’re noble gases.”", why:"They’re group 14 metalloids." },
          { t:"“They’re very reactive.”", why:"Their usefulness is electrical, not reactivity." }] },
        b:{ prompt:"Why is argon used to fill the space around a hot filament or a weld?", options:[
          { t:"“As a noble gas with a full outer shell, it doesn’t react with hot metal.”", ok:true, why:"Full shells make noble gases very unreactive." },
          { t:"“It’s a good conductor.”", why:"It’s an insulating gas." },
          { t:"“It’s very reactive and removes oxygen.”", why:"It’s unreactive." },
          { t:"“It’s a metalloid.”", why:"It’s a noble gas." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Lithium is used in rechargeable batteries. Which property follows from its position?", options:[
          { t:"“As a group 1 metal it loses its single 2s electron easily, and it’s the lightest metal.”", ok:true, why:"Group 1, period 2: one 2s electron to lose." },
          { t:"“It gains electrons easily.”", why:M4 },
          { t:"“It’s a noble gas.”", why:"It’s an alkali metal." },
          { t:"“It forms " + ion("Li", "2+") + ".”", why:"Group 1 forms 1+." }] },
        b:{ prompt:"The magnets in many wind turbines contain neodymium (Z = 60). Which block is it in?", options:[
          { t:"The f block (lanthanides), because it fills 4f", ok:true, why:"Neodymium is a lanthanide: 4f is filling." },
          { t:"d block", why:"Lanthanides fill 4f." },
          { t:"p block", why:"No: it’s a lanthanide, filling 4f." },
          { t:"s block", why:"No: it’s a lanthanide, filling 4f." }] } }
    ]
  },
  task:{
    title:"Find the element", summary:"Find the element",
    statement:"<p>Tap a cell of the main-group table (periods 2–5) that meets every clue. Can you find all the answers?</p><ol class=\"pt-conds\"><li>It’s in the p block.</li><li>It usually forms an ion with charge 2−.</li><li>It’s in period 3 or a later period.</li><li>It isn’t a metal.</li></ol>",
    checks:["p block", "Forms 2−", "Period ≥ 3", "Not a metal"],
    tips:["The p block is groups 13–18.", "2− ions come from 6 valence electrons.", "Period 2 is too high up the table.", "Check the staircase: metalloids count as ‘not a metal’."],
    explainPrompt:"Explain how the group gives the ion charge, and how the period and the staircase narrowed your choice.",
    vocab:"Use the words valence electrons, block, period and metalloid.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each gains 2 electrons to reach a noble-gas configuration. Going down, metallic character grows: Te is already a metalloid, and the next one, polonium, is more metallic still."
  },
  cards:[
    ["Mendeleev’s table", "Ordered mainly by atomic mass, grouped by properties, with gaps for undiscovered elements."],
    ["Eka-silicon", "Mendeleev’s predicted element below Si; discovered as germanium (1886)."],
    ["Modern order", "By atomic number, which fixes the Te/I order."],
    ["Period", "The highest occupied shell (" + N + ")."],
    ["Block", "The subshell being filled: s, p, d or f."],
    ["Group", "Shared valence configuration, so shared chemistry."],
    ["Alkali metals", N + "s<sup>1</sup>: soft, very reactive, 1+ ions, reactivity increases down the group."],
    ["Halogens", N + "s<sup>2</sup> " + N + "p<sup>5</sup>: reactive nonmetals, diatomic, 1− ions, reactivity decreases down the group."],
    ["Noble gases", "Full outer shells: very unreactive."],
    ["Transition metals", "d block: several ion charges, coloured compounds, catalysts."],
    ["Metalloids", "Along the staircase (B, Si, Ge, As, Sb, Te): in-between properties, semiconductors."]
  ]
};
