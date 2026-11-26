// SCH4U 16 Electron Configuration. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/16-electron-configuration.md
// The pictures (hero ladder and mini table, the Orbital filler, the Part 3 tables, the task preview) are drawn by app.js.

// Configuration text: "4s2 3d6" -> 4s<sup>2</sup> 3d<sup>6</sup> (superscripts as HTML, not Unicode, so every digit renders alike)
const cf = s => s.replace(/([spdf])(\d+)/g, "$1<sup>$2</sup>");
// Ion: ion("Fe", "2+") -> Fe<sup>2+</sup> (true minus for negative charges)
const ion = (el, c) => el + "<sup>" + c.replace("-", "−") + "</sup>";
const N = "<em>n</em>";

// Misconception core sentences (plan §3)
const M1 = "For these atoms 4s is lower in energy than 3d, so it fills first: K is " + cf("[Ar] 4s1") + ".";
const M2 = "Within a sublevel, one electron per orbital first, all with the same spin.";
const M3 = "An orbital holds at most 2 electrons, and they must have opposite spins.";
const M4 = "Transition metals lose their 4s electrons first: " + ion("Fe", "2+") + " is " + cf("[Ar] 3d6") + ", not " + cf("[Ar] 4s2 3d4") + ".";

// Practice 1: configuration ↔ species (plan Activity 1). The 9th species, Fe, is offered as a partner for pair 7's mix-up.
const PAIRS = [
  ["[He] 2s2 2p4", "O", "2 + 2 + 4 = 8 electrons: oxygen (Z = 8)."],
  ["[Ne] 3s1", "Na", "10 + 1 = 11 electrons: sodium (Z = 11)."],
  ["[Ar] 4s2 3d10 4p2", "Ge", "18 + 2 + 10 + 2 = 32: germanium."],
  ["[Ar] 4s1 3d10", "Cu", "29 electrons with a filled 3d sublevel: the copper exception."],
  ["[Ar] 4s2 3d8", "Ni", "18 + 2 + 8 = 28: nickel."],
  ["[Ne] 3s2 3p6", "Ar", "10 + 2 + 6 = 18: argon."],
  ["[Ar] 3d6", ion("Fe", "2+"), "24 electrons and 26 protons: iron has lost both 4s electrons."],
  ["[Ne]", ion("Al", "3+"), ion("Al", "3+") + " has 13 − 3 = 10 electrons, the same as neon."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const PAIR_GOAL = [2, 2, 2, 4, 2, 2, 3, 3];
const PAIR_HINTS = {
  l7:["Count: 18 + 6 = 24 electrons.", "Iron has 26 protons.", "So it’s " + ion("Fe", "2+") + ", having lost both 4s electrons."],
  l8:["[Ne] is 10 electrons.", "Which listed species has 10?", ion("Al", "3+") + ": 13 − 3 = 10."]
};

export default {
  id:"16-electron-configuration",
  kind:"topic",
  title:"Electron configuration",
  topic:"Electron Configuration",
  readyTopic:"electron configurations",
  hero:{
    eq:"Fe: " + cf("1s2 2s2 2p6 3s2 3p6 4s2 3d6") + " = " + cf("[Ar] 4s2 3d6"), eqSize:"sm",
    eqLabel:"Iron: 1s2 2s2 2p6 3s2 3p6 4s2 3d6, or in shorthand, argon core 4s2 3d6",
    headline:"Every element has an address",
    text:"Electrons fill orbitals from the lowest energy up. Three rules control the filling: the <strong>aufbau principle</strong>, the <strong>Pauli exclusion principle</strong> and <strong>Hund’s rule</strong>. The result, an <strong>electron configuration</strong>, tells you where an element sits in the periodic table and how it behaves.",
    fig:{ html:'<div class="ec-hx"><svg class="ec-hx-svg" id="ec-hx-svg" viewBox="0 0 440 400" role="img" aria-label="An energy ladder of orbital boxes from 1s at the bottom to 4p at the top. Electron arrows drop in one at a time in aufbau order, spin up then spin down, and each full sublevel pulses. At the 26th electron the label [Ar] 4s2 3d6 appears and iron lights up on a mini periodic table, in the d block, period 4."></svg><div class="ec-hx-row"><p class="ec-hx-ctr" id="ec-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ec-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can use the aufbau principle, the Pauli exclusion principle and Hund’s rule to fill orbital box diagrams.",
    "I can write full and noble-gas configurations for elements, including the 3d elements.",
    "I can write configurations for ions, including transition-metal ions that lose 4s electrons first.",
    "I can explain the chromium and copper exceptions.",
    "I can count unpaired electrons and predict whether a substance is paramagnetic.",
    "I can find an element’s block, period and group from its configuration, and the reverse."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Orbitals and sublevels", goal:1,
          prompt:"How many orbitals are in a p sublevel?",
          options:[
            { t:"3", ok:true, why:"<em>m</em><sub>l</sub> = −1, 0, +1: three p orbitals." },
            { t:"6", why:"6 is the number of electrons a p sublevel holds." },
            { t:"1", why:"That’s an s sublevel." },
            { t:"5", why:"That’s a d sublevel." }],
          hints:["For p, <em>l</em> = 1.", "<em>m</em><sub>l</sub> runs from −1 to +1.", "Three orbitals."] },
        { id:"w2", skill:"Orbitals and sublevels", goal:1,
          prompt:"What is the greatest number of electrons the " + N + " = 3 shell can hold?",
          options:[
            { t:"18", ok:true, why:"2" + N + "² = 2 × 9." },
            { t:"8", why:"8 is the valence octet, not the shell’s capacity." },
            { t:"9", why:N + "² = 9 is the number of orbitals; each holds 2." },
            { t:"32", why:"That’s " + N + " = 4." }],
          hints:["Use 2" + N + "².", N + " = 3.", "18."] },
        { id:"w3", skill:"Counting electrons", goal:2,
          prompt:"How many electrons does a neutral sulfur atom (Z = 16) have?",
          options:[
            { t:"16", ok:true, why:"In a neutral atom, electrons = Z." },
            { t:"32", why:"That’s close to the mass number, not the electron count." },
            { t:"6", why:"That’s the number of valence electrons." },
            { t:"18", why:"That’s the sulfide ion, " + ion("S", "2-") + "." }],
          hints:["Neutral atom.", "Electrons equal protons.", "16."] },
        { id:"w4", skill:"Counting electrons", goal:3,
          prompt:"How many electrons does " + ion("Mg", "2+") + " (Z = 12) have?",
          options:[
            { t:"10", ok:true, why:"12 − 2." },
            { t:"12", why:"That’s neutral magnesium." },
            { t:"14", why:"A positive ion has lost electrons, not gained them." },
            { t:"2", why:"The 2+ means two electrons were removed, not two remain." }],
          hints:["What does 2+ mean?", "Two fewer electrons than protons.", "10."] },
        { id:"w5", skill:"Periodic table layout", goal:6,
          prompt:"Which period and group is phosphorus (Z = 15) in?",
          options:[
            { t:"Period 3, group 15", ok:true, why:"Row 3; columns are numbered 1–18." },
            { t:"Period 15, group 3", why:"Swapped: rows are periods." },
            { t:"Period 3, group 5", why:"This course numbers groups 1–18; phosphorus is in group 15." },
            { t:"Period 2, group 15", why:"Period 2 ends at neon (Z = 10)." }],
          hints:["Find Z = 15 on the table.", "Third row.", "Period 3, group 15."] },
        { id:"w6", skill:"Periodic table layout", goal:6,
          prompt:"How many elements are in period 4?",
          options:[
            { t:"18", ok:true, why:"K to Kr: 4s (2) + 3d (10) + 4p (6)." },
            { t:"8", why:"Periods 2 and 3 have 8; period 4 adds the 10 d-block elements." },
            { t:"32", why:"That’s period 6 (it includes the f block)." },
            { t:"10", why:"That’s only the d-block part." }],
          hints:["Count K (19) to Kr (36).", "36 − 19 + 1.", "18."] }
      ],
      refreshers:{
        "Orbitals and sublevels":"s has 1 orbital, p has 3, d has 5, f has 7. Each orbital holds 2 electrons, so a shell holds 2" + N + "².",
        "Counting electrons":"Neutral atom: electrons = Z. Positive ion: subtract the charge. Negative ion: add it.",
        "Periodic table layout":"Rows are periods (1–7); columns are groups (1–18). Period 4 runs from K to Kr."
      }
    }
  },
  explore:{
    heading:"Orbital filler",
    intro:"Pick an element and fill its orbitals, or watch them fill. Break a rule and the filler tells you which one.",
    how:"Tap an element on the table (or use the Z slider), then choose a mode. In <strong>Fill it yourself</strong>, tap an orbital box to place the next electron; arrow keys move between boxes, Space places an electron and S switches the spin.",
    modes:[{ id:"fill", t:"Fill it yourself" }, { id:"auto", t:"Auto-fill" }, { id:"ion", t:"Ions" }],
    flags:{
      pauli:"Pauli: an orbital holds at most 2 electrons, with opposite spins.",
      hund:"Hund: put one electron in each {sub} box first, all the same spin.",
      aufbau:"Aufbau: {lo} is lower in energy than {hi}, so it fills first."
    },
    predictions:[
      { id:"p1", prompt:"Potassium (Z = 19), Auto-fill paused after the argon core. Where does potassium’s 19th electron go?",
        options:[{ t:"4s", ok:true }, { t:"3d" }, { t:"4p" }, { t:"3p" }],
        explain:"For potassium, 4s is lower in energy than 3d, so it fills first." },
      { id:"p2", prompt:"Nitrogen (Z = 7), with " + cf("1s2 2s2") + " placed. How will nitrogen’s three 2p electrons arrange?",
        options:[{ t:"One in each 2p orbital, all with the same spin", ok:true }, { t:"Two paired in one orbital and one alone" }, { t:"All three in one orbital" }, { t:"Two in one orbital and the third in 3s" }],
        explain:"Hund’s rule: spread out, with parallel spins, before pairing. Three in one box would break Pauli." },
      { id:"p3", prompt:"Chromium (Z = 24), Auto-fill. What is chromium’s actual configuration?",
        options:[{ t:cf("[Ar] 4s1 3d5"), ok:true }, { t:cf("[Ar] 4s2 3d4") }, { t:cf("[Ar] 3d6") }, { t:cf("[Ar] 4s2 4p4") }],
        explain:"4s and 3d are very close in energy, and a half-filled d sublevel is especially stable." },
      { id:"p4", prompt:"Iron (Z = 26), Ions mode, charge stepped to +2. Which electrons leave when Fe becomes " + ion("Fe", "2+") + "?",
        options:[{ t:"Both 4s electrons", ok:true }, { t:"Two 3d electrons" }, { t:"One 4s and one 3d" }, { t:"Two 3p electrons" }],
        explain:"Transition metals lose their outermost (4s) electrons first, even though 4s filled first." }
    ],
    chalIntro:"Use the Orbital filler to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Fill phosphorus (Z = 15) yourself without breaking a rule.",
        why:cf("1s2 2s2 2p6 3s2 3p3") + ", with one electron in each 3p box and parallel spins: phosphorus has 3 unpaired electrons.",
        hints:["15 electrons, in energy order.", cf("1s2 2s2 2p6 3s2") + " uses 12, leaving 3 for 3p.", "One electron in each 3p box, same spin."] },
      { id:"tc2", goal:5, prompt:"Find the neutral period-4 atom with exactly 5 unpaired electrons.",
        why:"Manganese, " + cf("[Ar] 4s2 3d5") + ": five single 3d electrons, and the 4s pair adds none.",
        hints:["Five unpaired means a half-filled 3d set, with nothing else unpaired.", cf("3d5") + " with a full " + cf("4s2") + ".", "Manganese, " + cf("[Ar] 4s2 3d5") + "."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Ions mode: find two different ions with the configuration " + cf("[Ar] 3d5") + ".",
        why:"Each has 23 electrons and no 4s electrons left. " + ion("Cr", "+") + " gets there by losing its single 4s electron; " + ion("Mn", "2+") + " and " + ion("Fe", "3+") + " lose both 4s electrons (and iron one 3d electron too).",
        hints:[cf("[Ar] 3d5") + " means 23 electrons and <strong>no</strong> 4s electrons.", "So Z − charge = 23, and the ion must have lost all its 4s electrons.",
          ion("Mn", "2+") + " (25 − 2) and " + ion("Fe", "3+") + " (26 − 3); " + ion("Cr", "+") + " (24 − 1) also works, because chromium has only one 4s electron."] }
    ]
  },
  part3:{
    slug:"blocks", name:"The table", heading:"Configurations and the table",
    intro:"Now work from the periodic table instead of single boxes: label its blocks, read configurations backwards to find elements, and see how a family’s configuration shapes its behaviour.",
    s1:{ title:"Station 1: Colour the blocks",
      intro:"Choose a block letter, then tap the region of the table it names. A correct block fills with the sublevel its elements fill last.",
      width:"The width of a block is the number of electrons its sublevel holds: s 2, p 6, d 10, f 14.",
      data:"<p>Valence configurations by group:</p><ul><li>Group 1: " + N + "s<sup>1</sup></li><li>Group 2: " + N + "s<sup>2</sup></li><li>Groups 13–18: " + N + "s<sup>2</sup> " + N + "p<sup>1</sup> to " + N + "s<sup>2</sup> " + N + "p<sup>6</sup></li></ul>",
      rule:"s and p blocks: period = " + N + ". d block: period = " + N + " + 1 (3d is in period 4). f block: period = " + N + " + 2." },
    s2:{ title:"Station 2: Read it backwards",
      intro:"Each configuration belongs to one element. Tap it on the table.",
      method:"Add the core’s electrons to the outer ones, then compare with Z.",
      items:[
        { id:"b1", cfg:cf("[Ne] 3s2 3p5"), answer:"Cl", sum:"10 + 2 + 5 = 17" },
        { id:"b2", cfg:cf("[Ar] 4s2 3d10 4p5"), answer:"Br", sum:"18 + 2 + 10 + 5 = 35" },
        { id:"b3", cfg:cf("[Kr] 5s2 4d10 5p4"), answer:"Te", sum:"36 + 2 + 10 + 4 = 52" }] },
    s3:{ title:"Station 3: Family resemblance",
      intro:"Tap a family to light it up on the table below and see how its configuration shapes its behaviour.",
      cards:[
        { id:"alk", name:"Alkali metals", cfg:N + "s<sup>1</sup>", groups:[1], text:"They lose one electron easily, so they are very reactive metals." },
        { id:"hal", name:"Halogens", cfg:N + "s<sup>2</sup> " + N + "p<sup>5</sup>", groups:[17], text:"They gain one electron." },
        { id:"nob", name:"Noble gases", cfg:"filled " + N + "s<sup>2</sup> " + N + "p<sup>6</sup>", groups:[18], text:"They are unreactive." },
        { id:"tm", name:"Transition metals", cfg:"(" + N + " − 1)d with " + N + "s", groups:[3, 4, 5, 6, 7, 8, 9, 10, 11, 12], text:"They form more than one ion (" + ion("Fe", "2+") + " and " + ion("Fe", "3+") + ") because 4s and 3d electrons are close in energy." }] },
    quickCheck:{
      title:"Quick check", summary:"The table quick check",
      items:[
        { id:"q1", goal:6, prompt:"A configuration ends in " + cf("4p3") + ". Which block?",
          choices:[
            { t:"p", ok:true, fb:"Right. The last sublevel filled names the block." },
            { t:"s", fb:"The last sublevel filled names the block." },
            { t:"d", fb:"The last sublevel filled names the block." },
            { t:"f", fb:"The last sublevel filled names the block." }] },
        { id:"q2", goal:6, prompt:"Which element is " + cf("[Ar] 4s2 3d10 4p5") + "?",
          choices:[
            { t:"Br", ok:true, fb:"Right. 18 + 2 + 10 + 5 = 35." },
            { t:"Cl", fb:"18 + 2 + 10 + 5 = 35." },
            { t:"I", fb:"18 + 2 + 10 + 5 = 35." },
            { t:"Kr", fb:"18 + 2 + 10 + 5 = 35." }] },
        { id:"q3", goal:6, prompt:"Valence configuration " + N + "s<sup>2</sup> " + N + "p<sup>4</sup>. Which group?",
          choices:[
            { t:"16", ok:true, fb:"Right. s<sup>2</sup> p<sup>4</sup> is 6 valence electrons; in the p block that is group 10 + 6 = 16." },
            { t:"4", fb:"s<sup>2</sup> p<sup>4</sup> is 6 valence electrons; in the p block that is group 10 + 6 = 16." },
            { t:"6", fb:"s<sup>2</sup> p<sup>4</sup> is 6 valence electrons; in the p block that is group 10 + 6 = 16." },
            { t:"14", fb:"s<sup>2</sup> p<sup>4</sup> is 6 valence electrons; in the p block that is group 10 + 6 = 16." }] },
        { id:"q4", goal:6, prompt:"Which period is iron in?",
          choices:[
            { t:"4", ok:true, fb:"Right. Iron fills 3d, but its highest " + N + " is 4 (" + cf("4s2") + ")." },
            { t:"3", fb:"Iron fills 3d, but its highest " + N + " is 4 (" + cf("4s2") + ")." },
            { t:"8", fb:"Iron fills 3d, but its highest " + N + " is 4 (" + cf("4s2") + ")." },
            { t:"26", fb:"Iron fills 3d, but its highest " + N + " is 4 (" + cf("4s2") + ")." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Configuration ↔ species", summary:"Configuration ↔ species", goal:[2, 3, 4],
        instruction:"Match each configuration to the atom or ion it describes. One species is left over.",
        leftTitle:"Configuration", rightTitle:"Species",
        left:PAIRS.map((p, i) => {
          const L = { id:"l" + (i + 1), t:cf(p[0]), why:p[2], goal:PAIR_GOAL[i] };
          if (PAIR_HINTS[L.id]) L.hints = PAIR_HINTS[L.id];
          if (i === 2) L.wrong = "18 + 2 + 10 + 2 = 32: germanium.";
          return L;
        }),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r9", t:"Fe" }]),
        answer:MATCH_ANS,
        wrong:{
          "l4|r5":"Copper is the exception, " + cf("4s1 3d10") + " (29 electrons). Nickel is " + cf("[Ar] 4s2 3d8") + " (28).",
          "l7|r9":"Neutral iron keeps " + cf("4s2") + "; " + cf("[Ar] 3d6") + " has lost both 4s electrons, so it is " + ion("Fe", "2+") + "."
        },
        wrongDefault:"Add the core’s electrons to the outer ones, then compare with Z." },
      { id:"build", type:"custom", title:"Build and predict", summary:"Build and predict", star:true, goal:[1, 3, 5, 6],
        instruction:"Six items: number entry, choices and a configuration builder. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type a number, tap a choice, or build a configuration from the chips, then press Check.",
        items:[
          { id:"s1", kind:"num", goal:5, prompt:"How many unpaired electrons does oxygen have?",
            answer:2, display:"2 (↑↓ ↑ ↑)", unit:"unpaired",
            wrong:[{ match:0, fb:cf("2p4") + " is ↑↓ ↑ ↑ by Hund’s rule." }],
            fb:"Draw " + cf("2p4") + " in three boxes: one electron in each first, then pair the fourth.",
            // VERIFY: hints for S1, S2, S3 and S5 were written for the module (the plan gives hints for S4 and S6 only).
            hints:["Oxygen has 8 electrons: " + cf("1s2 2s2 2p4") + ".", "One electron in each 2p box, then pair the fourth.", "↑↓ ↑ ↑: 2 unpaired."] },
          { id:"s2", kind:"cfg", goal:3, prompt:"Shorthand configuration of " + ion("Se", "2-"),
            answer:"[Ar] 4s2 3d10 4p6", display:cf("[Ar] 4s2 3d10 4p6") + " (= [Kr])",
            wrong:[{ match:"[Ar] 4s2 3d10 4p4", fb:"That’s neutral Se; add 2 electrons." }],
            fb:"Count the electrons: " + ion("Se", "2-") + " has 34 + 2 = 36.",
            hints:["Se has 34 electrons; the 2− charge adds 2.", "36 electrons: [Ar] plus 18 more, in the order 4s, 3d, 4p.", cf("[Ar] 4s2 3d10 4p6") + " (the same as [Kr])."] },
          { id:"s3", kind:"chips", star:true, goal:5, prompt:"Which period-3 atom has 3 unpaired electrons?",
            options:[
              { t:"P", ok:true, why:cf("[Ne] 3s2 3p3") + ": one electron in each 3p box." },
              { t:"N", why:"Nitrogen also has 3, but it’s in period 2." },
              { t:"Si", why:"Silicon’s " + cf("3p2") + " has 2 unpaired electrons." },
              { t:"S", why:"Sulfur’s " + cf("3p4") + " (↑↓ ↑ ↑) has 2 unpaired electrons." }],
            hints:["Period 3 fills 3s and 3p.", "Three unpaired needs " + cf("3p3") + ", one per box.", cf("[Ne] 3s2 3p3") + ": phosphorus."] },
          { id:"s4", kind:"chips", star:true, goal:3, prompt:"An ion X<sup>3+</sup> has the configuration " + cf("[Ar] 3d3") + ". What is X?",
            options:[
              { t:"Cr", ok:true, why:"18 + 3 = 21 electrons, so Z = 21 + 3 = 24: chromium." },
              { t:"V", why:ion("V", "3+") + " is " + cf("[Ar] 3d2") + ": count 18 + 3 + 3 = 24 = Z." },
              { t:"Mn", why:ion("Mn", "3+") + " is " + cf("[Ar] 3d4") + ": count 18 + 3 + 3 = 24 = Z." },
              { t:"Sc", why:ion("Sc", "3+") + " is [Ar], with no d electrons: count 18 + 3 + 3 = 24 = Z." }],
            hints:["Electrons in X<sup>3+</sup>: 18 + 3 = 21.", "So Z = 21 + 3 = 24.", "Chromium: " + cf("[Ar] 4s1 3d5") + " loses " + cf("4s1") + " and two 3d electrons, giving " + cf("3d3") + "."] },
          { id:"s5", kind:"inv", star:true, goal:5,
            prompt:"<strong>Investigation:</strong> Two solid salts are brought equally close to the same strong magnet. Salt A, containing " + ion("Fe", "3+") + ", is pulled; salt B, containing " + ion("Zn", "2+") + ", is not. (a) Explain using configurations. (b) Name one variable that must be kept the same.",
            qa:"(a) Which explanation fits?", qb:"(b) Which variable must be kept the same?",
            optsA:[
              { t:ion("Fe", "3+") + " is " + cf("[Ar] 3d5") + " with 5 unpaired electrons, so it is paramagnetic; " + ion("Zn", "2+") + " is " + cf("[Ar] 3d10") + " with none, so it is diamagnetic.", ok:true },
              { t:ion("Fe", "3+") + " is " + cf("[Ar] 4s2 3d3") + " with 3 unpaired electrons; " + ion("Zn", "2+") + " is " + cf("[Ar] 4s2 3d8") + " with 2.", why:"Remove 4s electrons first." },
              { t:ion("Fe", "3+") + " has the larger charge, so the magnet pulls it harder.", why:"Magnetism comes from unpaired electrons, not charge." }],
            optsB:[
              { t:"Equal masses of the two salts", ok:true },
              { t:"The same distance from the magnet", ok:true },
              { t:"The same magnet", ok:true },
              { t:"The metal ion in the salt", why:"That’s what the test compares. A fair test changes only the salt." }],
            display:"(a) " + ion("Fe", "3+") + " is " + cf("[Ar] 3d5") + " with 5 unpaired electrons, so it is paramagnetic; " + ion("Zn", "2+") + " is " + cf("[Ar] 3d10") + " with none, so it is diamagnetic. (b) Any of: equal masses, the same distance from the magnet, the same magnet.",
            fbA:"(a) Remove 4s electrons first.", fbB:"(b) A fair test changes only the salt.",
            hints:["Write each ion’s configuration, removing 4s electrons first.", ion("Fe", "3+") + ": " + cf("[Ar] 3d5") + ". " + ion("Zn", "2+") + ": " + cf("[Ar] 3d10") + ". Count the unpaired electrons.",
              "(a) " + ion("Fe", "3+") + " has 5 unpaired electrons (paramagnetic); " + ion("Zn", "2+") + " has none (diamagnetic). (b) Keep the masses, the distance and the magnet the same."] },
          { id:"s6", kind:"cfg", star:true, goal:6, prompt:"Element 39 (yttrium) is the first period-5 element to fill 4d. Write its shorthand configuration.",
            answer:"[Kr] 5s2 4d1", display:cf("[Kr] 5s2 4d1"),
            wrong:[{ match:"[Kr] 4d3", fb:"5s fills before 4d, just as 4s fills before 3d." }],
            fb:"Yttrium has 39 electrons: 36 in the [Kr] core and 3 outside it.",
            hints:["Krypton is 36.", "Next come 5s, then 4d.", cf("[Kr] 5s2 4d1") + "."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ignacio", how:"", goal:[1, 2, 3],
        instruction:"Ignacio made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write the configuration of vanadium (Z = 23).",
            steps:["Argon core: 18 electrons, written [Ar].", "23 − 18 = 5 electrons are left.", "They go into 3d next: " + cf("[Ar] 3d5") + ".", "So vanadium has 5 unpaired electrons."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier."],
            fixes:[
              { t:"4s fills before 3d: " + cf("[Ar] 4s2 3d3") + ", with 3 unpaired.", ok:true, why:M1 },
              { t:cf("[Ar] 4s1 3d4") + ".", why:"Only Cr and Cu move a 4s electron." },
              { t:cf("[Ar] 4p5") + ".", why:"3d fills before 4p." },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Which is lower in energy for vanadium, 4s or 3d?", "4s.", cf("[Ar] 4s2 3d3") + "."] },
          { id:"e2", goal:3, task:"Write the configuration of " + ion("Fe", "3+") + ".",
            steps:["Iron has 26 electrons: " + cf("[Ar] 4s2 3d6") + ".", ion("Fe", "3+") + " has lost 3 electrons.", "Remove three 3d electrons: " + cf("[Ar] 4s2 3d3") + ".", "So " + ion("Fe", "3+") + " has 3 unpaired electrons."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"Remove both 4s electrons first, then one 3d: " + cf("[Ar] 3d5") + ", with 5 unpaired.", ok:true, why:M4 },
              { t:cf("[Ar] 4s1 3d4") + ".", why:"Both 4s electrons go before any 3d." },
              { t:cf("[Ar] 3d6") + ".", why:"That’s " + ion("Fe", "2+") + "." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["Which electrons are outermost?", "4s.", cf("[Ar] 3d5") + "."] },
          { id:"e3", goal:1, task:"Draw oxygen’s 2p orbital diagram and count the unpaired electrons.",
            steps:["Oxygen has 8 electrons: " + cf("1s2 2s2 2p4") + ".", "The 2p sublevel has 3 orbitals.", "Put two electrons in each of the first two 2p boxes and leave the third empty.", "So oxygen has 0 unpaired electrons."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"One electron in each 2p box first, then pair the fourth: ↑↓ ↑ ↑, so 2 unpaired.", ok:true, why:M2 },
              { t:"All four in one box.", why:"Pauli allows only 2 per box." },
              { t:"Put the fourth electron in 3s.", why:"2p isn’t full yet." },
              { t:"Step 3 is correct.", why:M2 }],
            hints:["Hund’s rule: what happens before pairing?", "Each box gets one electron.", "↑↓ ↑ ↑: 2 unpaired."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result in the orbital filler surprised you most: 4s before 3d, the chromium jump, or 4s leaving first in ions? Why?" },
      { id:"j2", q:"In your own words, what does each of the three filling rules prevent?" },
      { id:"j3", q:"Explain to a friend how to find an element’s period and block from its configuration." },
      { id:"j4", q:"Which kind of configuration still trips you up (ions, exceptions or shorthand)? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which rule says each orbital holds at most two electrons, with opposite spins?", options:[
          { t:"The Pauli exclusion principle", ok:true, why:"Exactly: two electrons per orbital, opposite spins." },
          { t:"Hund’s rule", why:"Hund’s rule is about spreading electrons out within a sublevel." },
          { t:"The aufbau principle", why:"Aufbau sets the filling order." },
          { t:"The octet rule", why:"The octet rule is about bonding, not orbitals." }] },
        b:{ prompt:"Which rule says electrons occupy empty orbitals of the same sublevel singly before any pair up?", options:[
          { t:"Hund’s rule", ok:true, why:"Singly first, with parallel spins." },
          { t:"The Pauli exclusion principle", why:"Pauli limits each orbital to two." },
          { t:"The aufbau principle", why:"Aufbau sets the order of sublevels." },
          { t:"The uncertainty principle", why:"That’s about position and momentum." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the configuration of calcium (Z = 20)?", options:[
          { t:cf("[Ar] 4s2"), ok:true, why:"18 + 2 = 20; 4s fills before 3d." },
          { t:cf("[Ar] 3d2"), why:"4s is lower in energy than 3d for calcium." },
          { t:cf("[Ne] 3s2 3p6 3d2"), why:"Same mistake, written out in full." },
          { t:cf("[Ar] 4s1 3d1"), why:"Only Cr and Cu shift a 4s electron." }] },
        b:{ prompt:"What is the configuration of selenium (Z = 34)?", options:[
          { t:cf("[Ar] 4s2 3d10 4p4"), ok:true, why:"18 + 2 + 10 + 4 = 34." },
          { t:cf("[Ar] 4s2 4p4"), why:"That’s only 24 electrons: the 3d sublevel fills before 4p." },
          { t:cf("[Ar] 3d10 4p6"), why:"4s fills first." },
          { t:cf("[Ar] 4s2 3d8 4p6"), why:"3d fills completely (10 electrons) before 4p starts." }] } },
      { id:"k3", cat:"K", goal:6,
        a:{ prompt:"An element’s configuration ends in " + cf("3d7") + ". Which block and period is it in?", options:[
          { t:"d block, period 4", ok:true, why:"3d elements sit in period 4 (cobalt)." },
          { t:"d block, period 3", why:"3d elements are in period 4." },
          { t:"p block, period 3", why:"It ends in d, so it’s in the d block." },
          { t:"s block, period 4", why:"The last sublevel filled is 3d." }] },
        b:{ prompt:"An element’s configuration ends in " + cf("5p2") + ". Which block and period is it in?", options:[
          { t:"p block, period 5", ok:true, why:"Tin: 5p elements are in period 5." },
          { t:"p block, period 2", why:"The 2 counts electrons in 5p, not the period." },
          { t:"s block, period 5", why:"The last sublevel filled is 5p." },
          { t:"d block, period 5", why:"It ends in p." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"What is the configuration of " + ion("Co", "2+") + " (Z = 27)?", options:[
          { t:cf("[Ar] 3d7"), ok:true, why:"Cobalt is " + cf("[Ar] 4s2 3d7") + "; it loses both 4s electrons." },
          { t:cf("[Ar] 4s2 3d5"), why:"4s electrons leave first." },
          { t:cf("[Ar] 4s2 3d7"), why:"That’s neutral cobalt." },
          { t:cf("[Ar] 3d9"), why:"A positive ion loses electrons; this has gained two." }] },
        b:{ prompt:"What is the configuration of " + ion("Ni", "2+") + " (Z = 28)?", options:[
          { t:cf("[Ar] 3d8"), ok:true, why:"Nickel is " + cf("[Ar] 4s2 3d8") + "; it loses both 4s electrons." },
          { t:cf("[Ar] 4s2 3d6"), why:"4s electrons leave first." },
          { t:cf("[Ar] 4s2 3d8"), why:"That’s neutral nickel." },
          { t:cf("[Ar] 3d10"), why:"That has gained electrons." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"How many unpaired electrons does " + ion("Mn", "2+") + " have, and is it paramagnetic?", options:[
          { t:"5; paramagnetic", ok:true, why:cf("[Ar] 3d5") + ": one electron in each 3d box." },
          { t:"3; paramagnetic", why:"That comes from removing two 3d electrons (" + cf("[Ar] 4s2 3d3") + ")." },
          { t:"0; diamagnetic", why:"Ions can have unpaired electrons; " + ion("Mn", "2+") + " has five." },
          { t:"7; paramagnetic", why:"Count unpaired electrons, not all the outer electrons." }] },
        b:{ prompt:"How many unpaired electrons does " + ion("Zn", "2+") + " have, and is it paramagnetic?", options:[
          { t:"0; diamagnetic", ok:true, why:cf("[Ar] 3d10") + ": every 3d box is full." },
          { t:"2; paramagnetic", why:"That comes from removing two 3d electrons." },
          { t:"10; paramagnetic", why:"All 10 d electrons are paired." },
          { t:"5; paramagnetic", why:"Hund’s rule applies while a sublevel fills; in " + cf("3d10") + " every box holds a pair." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A neutral period-4 atom has one electron in 4s and a completely filled 3d sublevel. What is it?", options:[
          { t:"Cu", ok:true, why:cf("[Ar] 4s1 3d10") + ": the copper exception." },
          { t:"K", why:"Potassium has " + cf("4s1") + ", but its 3d is empty." },
          { t:"Zn", why:"Zinc has " + cf("4s2") + "." },
          { t:"Cr", why:"Chromium has " + cf("4s1") + " but a half-filled 3d." }] },
        b:{ prompt:"A neutral period-4 atom has one electron in 4s and a half-filled 3d sublevel. What is it?", options:[
          { t:"Cr", ok:true, why:cf("[Ar] 4s1 3d5") + ": the chromium exception." },
          { t:"Mn", why:"Manganese is " + cf("4s2 3d5") + "." },
          { t:"V", why:"Vanadium is " + cf("4s2 3d3") + "." },
          { t:"Cu", why:"Copper’s 3d is full." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of copper’s configuration, " + cf("[Ar] 4s1 3d10") + "?", options:[
          { t:"“4s and 3d are very close in energy, and a completely filled 3d sublevel is especially stable, so one 4s electron moves into 3d.”", ok:true, why:"It names both reasons: 4s and 3d are close in energy, and a filled 3d sublevel is especially stable." },
          { t:"“Copper breaks the Pauli exclusion principle.”", why:"No orbital holds more than 2." },
          { t:"“3d always fills before 4s.”", why:"Only Cr and Cu shift an electron." },
          { t:"“Copper has only 28 electrons.”", why:"Copper has 29." }] },
        b:{ prompt:"Which is the best explanation of chromium’s configuration, " + cf("[Ar] 4s1 3d5") + "?", options:[
          { t:"“4s and 3d are very close in energy, and a half-filled 3d sublevel is especially stable, so one 4s electron moves into 3d.”", ok:true, why:"It names both reasons: 4s and 3d are close in energy, and a half-filled 3d sublevel is especially stable." },
          { t:"“Chromium has only 23 electrons.”", why:"Chromium has 24." },
          { t:"“In period 4, 4s can hold only one electron.”", why:"4s holds 2 in most period-4 atoms." },
          { t:"“Hund’s rule forbids " + cf("4s2") + ".”", why:"Hund’s rule applies within one sublevel." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which orbital diagram of nitrogen’s 2p electrons follows all three rules?", options:[
          { t:"[↑] [↑] [↑]", ok:true, why:"One per box, same spin." },
          { t:"[↑↓] [↑] [ ]", why:"That pairs electrons while a box is empty." },
          { t:"[↑↑] [↑] [ ]", why:"Two electrons in one box must have opposite spins." },
          { t:"[↑] [↓] [↑]", why:"Singly occupied boxes have parallel spins in the ground state." }] },
        b:{ prompt:"Which orbital diagram of carbon’s 2p electrons follows all three rules?", options:[
          { t:"[↑] [↑] [ ]", ok:true, why:"One per box, same spin." },
          { t:"[↑↓] [ ] [ ]", why:"That pairs electrons too early." },
          { t:"[↑] [↓] [ ]", why:"The spins should be parallel." },
          { t:"[↑↑] [ ] [ ]", why:"Same-spin pair." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A chemist holds two salts near a strong magnet. One contains " + ion("Fe", "3+") + " and the other " + ion("Sc", "3+") + ". Which salt is attracted, and why?", options:[
          { t:"The " + ion("Fe", "3+") + " salt: " + cf("[Ar] 3d5") + " has 5 unpaired electrons, while " + ion("Sc", "3+") + " ([Ar]) has none", ok:true, why:"Unpaired electrons make a substance paramagnetic." },
          { t:"The " + ion("Sc", "3+") + " salt, because a 3+ ion is strongly charged", why:"Magnetism comes from unpaired electrons, not charge." },
          { t:"Both, because both are transition-metal ions", why:ion("Sc", "3+") + " has no d electrons." },
          { t:"Neither, because ions never have unpaired electrons", why:ion("Fe", "3+") + " has five." }] },
        b:{ prompt:"One salt contains " + ion("Cu", "+") + " and the other " + ion("Cu", "2+") + ". Which is attracted by a strong magnet, and why?", options:[
          { t:"The " + ion("Cu", "2+") + " salt: " + cf("[Ar] 3d9") + " has 1 unpaired electron, while " + ion("Cu", "+") + " (" + cf("[Ar] 3d10") + ") has none", ok:true, why:"Unpaired electrons make a substance paramagnetic." },
          { t:"The " + ion("Cu", "+") + " salt, because it is " + cf("[Ar] 4s1 3d9"), why:ion("Cu", "+") + " loses its 4s electron: " + cf("[Ar] 3d10") + "." },
          { t:"Both", why:ion("Cu", "+") + " is fully paired." },
          { t:"Neither", why:ion("Cu", "2+") + " has one unpaired electron." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Element 116 (livermorium) is in period 7, below polonium. Predict its valence configuration and group.", options:[
          { t:cf("7s2 7p4") + ", group 16", ok:true, why:"Same pattern as oxygen’s group: " + N + "s<sup>2</sup> " + N + "p<sup>4</sup>." },
          { t:cf("7s2 7p6") + ", group 18", why:"That’s a noble-gas pattern." },
          { t:cf("7s2 6d4"), why:"Livermorium is in the p block." },
          { t:cf("6s2 6p4"), why:"Period 7 means " + N + " = 7." }] },
        b:{ prompt:"Element 117 (tennessine) is in period 7, below astatine. Predict its valence configuration and group.", options:[
          { t:cf("7s2 7p5") + ", group 17", ok:true, why:"The halogen pattern." },
          { t:cf("7s2 7p6") + ", group 18", why:"That’s one too many." },
          { t:cf("7s2 6d5"), why:"Tennessine is in the p block." },
          { t:cf("6s2 6p5"), why:"Period 7 means " + N + " = 7." }] } }
    ]
  },
  task:{
    title:"Three unpaired, no 4s", summary:"Three unpaired, no 4s",
    statement:"<p>Choose a period-4 element and a charge so that the species meets every condition. Can you find all the answers?</p><ol class=\"ec-conds\"><li>It is a d-block element.</li><li>It has no 4s electrons.</li><li>It has exactly 3 unpaired electrons.</li></ol>",
    qEl:"Element (K to Zn)", qQ:"Charge",
    checks:["d-block element", "No 4s electrons", "Exactly 3 unpaired electrons"],
    tips:["K and Ca are s-block elements.", "Remove both 4s electrons before touching 3d (only one for Cr and Cu).", cf("3d3") + " and " + cf("3d7") + " both leave 3 unpaired electrons."],
    explainPrompt:"Explain how you made sure no 4s electrons remained, and why both " + cf("3d3") + " and " + cf("3d7") + " give 3 unpaired electrons.",
    vocab:"Use the words Hund’s rule, unpaired, 4s first and paramagnetic.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:4,
    after3:"Two routes to 3 unpaired: three single electrons (" + cf("3d3") + "), or three pairs plus three singles (" + cf("3d7") + "). " + ion("Ni", "3+") + " is rare in real compounds, but the rules allow it."
  },
  cards:[
    ["Aufbau principle", "Fill orbitals from lowest energy up: 1s 2s 2p 3s 3p 4s 3d 4p …"],
    ["Pauli exclusion principle", "At most 2 electrons per orbital, with opposite spins."],
    ["Hund’s rule", "In a sublevel, one electron per orbital (parallel spins) before pairing."],
    ["Sublevel capacity", "s 2, p 6, d 10, f 14 (2 per orbital)."],
    ["Noble-gas shorthand", cf("[Ne] 3s2 3p4") + " for sulfur: the core in brackets, then the outer electrons."],
    ["4s vs 3d", "4s fills first, and 4s also leaves first when transition metals form ions."],
    [ion("Fe", "2+"), cf("[Ar] 3d6") + " (both 4s electrons gone)."],
    ["Chromium and copper", "Cr " + cf("[Ar] 4s1 3d5") + "; Cu " + cf("[Ar] 4s1 3d10") + " (half-filled and filled d are extra stable)."],
    ["Paramagnetic", "Has unpaired electrons, so it is attracted to a magnet."],
    ["Block", "The last sublevel filled: s, p, d or f."],
    ["Period from configuration", "The highest " + N + " with electrons (3d elements are in period 4)."],
    ["Group from valence electrons", "s block: group = valence electrons; p block: group = 10 + valence electrons."]
  ]
};
