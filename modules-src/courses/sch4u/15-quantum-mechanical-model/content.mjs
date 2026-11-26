// SCH4U 15 Quantum Mechanical Model. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/15-quantum-mechanical-model.md
// The pictures (hero storyboard, Orbital viewer modes, Part 3 stations, task preview) are drawn by app.js.

// Misconception core sentences (plan §3)
const M1 = "An orbital is a region of probability, not a track. The electron’s exact path can’t be known.";
const M2 = "`l` runs from 0 up to `n - 1`. In shell 3: 0, 1, 2 (s, p, d).";
const M3 = "`m_l` runs from `-l` to `+l`, giving `2l + 1` orbitals.";
const M4 = "8 is the s + p total of the outer shell. Shell `n` holds `2n^2`: 2, 8, 18, 32.";
const M5 = "Pauli: each orbital holds at most two electrons, with opposite spins.";
const M6 = "Every s orbital is spherical. 2s is larger, with one node inside.";
const M7 = "Count orbitals first, then double for electrons.";

// Practice 1 hints (plan Activity 1)
const AH1 = "Check `n >= 1`, then `0 <= l <= n - 1`.";
const AH2 = "Then `-l <= m_l <= l`, and `m_s = ±½`.";
// Rules a set can break (Activity 1 follow-up question)
const RULES = [
  { id:"n", t:"`n >= 1`" },
  { id:"l", t:"`0 <= l <= n - 1`" },
  { id:"ml", t:"`-l <= m_l <= l`" },
  { id:"ms", t:"`m_s = +½` or `-½`" }
];
const RULE_FB = {
  n:"`n` counts shells from 1: there is no shell 0.",
  l:M2,
  ml:M3,
  ms:"Spin has only two values: `m_s = +½` or `-½`."
};
// [id, address, answer ("ok" or "no:<rule>"), notation or rule note]
const CARDS = [
  ["a1", "(1, 0, 0, +½)", "ok", "Allowed: 1s."],
  ["a2", "(2, 2, 0, +½)", "no:l", "Not allowed: `l < n`, so shell 2 has only `l = 0` and 1."],
  ["a3", "(3, 1, −2, +½)", "no:ml", "Not allowed: `|m_l| <= l`, so `l = 1` allows only −1, 0 and +1."],
  ["a4", "(4, 3, −3, −½)", "ok", "Allowed: 4f."],
  ["a5", "(1, 0, 0, 0)", "no:ms", "Not allowed: `m_s = ±½`, never 0."],
  ["a6", "(3, 2, 1, −½)", "ok", "Allowed: 3d."],
  ["a7", "(2, 1, 1, +½)", "ok", "Allowed: 2p."],
  ["a8", "(0, 0, 0, +½)", "no:n", "Not allowed: `n >= 1`. There is no shell 0."],
  ["a9", "(3, 0, 1, +½)", "no:ml", "Not allowed: `l = 0` allows only `m_l = 0`."],
  ["a10", "(5, 4, 4, +½)", "ok", "Allowed: 5g (exists in theory; no known element uses it)."]
];

export default {
  id:"15-quantum-mechanical-model",
  kind:"topic",
  title:"Quantum mechanical model",
  topic:"Quantum Mechanical Model",
  readyTopic:"the quantum mechanical model",
  hero:{
    headline:"Not orbits: clouds with addresses",
    text:"Electrons act like <strong>waves</strong>, so we can’t track their paths. Instead, the quantum mechanical model gives each electron an <strong>orbital</strong>: a region where it’s likely to be. Four <strong>quantum numbers</strong> work like an address: shell, shape, direction and spin. No two electrons in an atom share the same address.",
    fig:{ html:'<div class="qm-hx"><canvas class="qm-hxc" id="qm-hxc" role="img" aria-label="A dot races around a Bohr circle. The dot blurs and the circle dissolves into a fuzzy, spherical 1s cloud of dots, densest near the nucleus. Beside it, a sphere morphs into a dumbbell-shaped 2p orbital with blue and orange lobes, and an address strip fills in: n = 2, l = 1, m sub l = 0, m sub s = +½."></canvas><p class="qm-hxaddr" id="qm-hxaddr" aria-live="polite"></p><div class="qm-hxrow"><p class="qm-hxctr" id="qm-hxctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="qm-hxreplay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain why the quantum mechanical model replaced fixed orbits, and what an orbital is.",
    "I can state the allowed values of `n`, `l`, `m_l` and `m_s` and decide whether a set is allowed.",
    "I can count orbitals and electrons in sublevels and shells (`2l + 1`, `n^2`, `2n^2`).",
    "I can describe the shapes and sizes of s, p and d orbitals.",
    "I can describe a Canadian contribution and apply the model to unfamiliar cases."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Bohr energy levels", goal:1,
          prompt:"Bohr’s model explained hydrogen’s spectrum. What could it <strong>not</strong> explain?",
          options:[
            { t:"The spectra of atoms with more than one electron", ok:true, why:"It worked for hydrogen’s one electron but failed for atoms with more." },
            { t:"Why hydrogen has lines at all", why:"It explained that." },
            { t:"Why falls to `n = 1` give UV", why:"It explained that too." },
            { t:"The existence of the nucleus", why:"That came from Rutherford." }],
          hints:["Bohr’s model was built for one atom.", "Hydrogen has one electron.", "Many-electron atoms."] },
        { id:"w2", skill:"Bohr energy levels", goal:3,
          prompt:"In Bohr–Rutherford diagrams from Grade 11, how many electrons fit in the first shell?",
          options:[
            { t:"2", ok:true, why:"Helium’s two electrons fill the first shell." },
            { t:"8", why:"That’s the second shell." },
            { t:"1", why:"Helium has two in the first shell." },
            { t:"18", why:"That’s the third shell’s full capacity." }],
          hints:["Think of helium.", "It fills the first shell.", "2."] },
        { id:"w3", skill:"Waves", goal:1,
          prompt:"A guitar string fixed at both ends can only vibrate in certain patterns. Why?",
          options:[
            { t:"Only whole numbers of half-wavelengths fit between the fixed ends", ok:true, why:"Both ends stay still, so only patterns that fit last." },
            { t:"Strings can vibrate at any frequency equally", why:"Only certain patterns last." },
            { t:"The string is too short to vibrate", why:"It does vibrate." },
            { t:"Sound waves need air", why:"That’s about how sound travels, not the string’s patterns." }],
          hints:["Both ends must stay still.", "The wave has to “fit”.", "Whole numbers of half-wavelengths."] },
        { id:"w4", skill:"Waves", goal:1,
          prompt:"Two waves meet crest to trough. What happens?",
          options:[
            { t:"They cancel", ok:true, why:"Destructive interference." },
            { t:"They double in height", why:"That’s crest meeting crest." },
            { t:"They bounce apart", why:"Waves pass through each other." },
            { t:"Nothing changes", why:"They combine." }],
          hints:["A crest is up, a trough is down.", "Up + down = …", "They cancel."] },
        { id:"w5", skill:"Counting patterns", goal:3,
          prompt:"If `l = 3`, how many whole numbers run from `-l` to `+l`?",
          options:[
            { t:"7", ok:true, why:"−3, −2, −1, 0, 1, 2, 3." },
            { t:"6", why:"Don’t forget 0." },
            { t:"3", why:"Include the negatives." },
            { t:"4", why:"That’s 0 to 3." }],
          hints:["List them.", "−3 … 3.", "7 = 2(3) + 1."] },
        { id:"w6", skill:"Counting patterns", goal:3,
          prompt:"What is `2n^2` when `n = 3`?",
          options:[
            { t:"18", ok:true, why:"3² = 9, and 2 × 9 = 18." },
            { t:"36", why:"Square first, then double: 2 × 9." },
            { t:"12", why:"3² = 9, not 6." },
            { t:"8", why:M4 }],
          hints:["`n^2` first.", "3² = 9.", "2 × 9 = 18."] }
      ],
      refreshers:{
        "Bohr energy levels":"Bohr gave hydrogen fixed energy levels. It worked for one electron but failed for others, and it gave electrons exact paths.",
        "Waves":"Standing waves only fit in whole-number patterns; waves that don’t fit cancel themselves out.",
        "Counting patterns":"From `-l` to `+l` there are `2l + 1` whole numbers. `2n^2`: square, then double."
      }
    }
  },
  explore:{
    heading:"Orbital viewer",
    intro:"Set the quantum numbers and see the orbital. Then find out why only certain waves fit.",
    how:"Choose a mode. In <strong>Orbital</strong> mode, tap a value for each quantum number. Drag the view or use the arrow keys to turn it.",
    modes:[{ id:"orb", t:"Orbital" }, { id:"ring", t:"Standing-wave ring" }, { id:"find", t:"Find the electron" }],
    orbNote:"Blue and orange are the two phases (signs) of the electron wave; dashed lines mark nodes, where the electron is never found. Each `m_l` value shows one representative shape.",
    ringNote:"A simplified picture: real orbitals come from 3D waves (Schrödinger’s equation), not waves on a ring.",
    findNote:"Each dot is one measurement of a hydrogen electron’s position. The measurements are random but repeatable: the same dots appear every time.",
    cntLabel:"Challenge 3: how many electrons?",
    predictions:[
      { id:"p1", prompt:"Orbital mode with `n = 2`. Which values of `l` are allowed?",
        options:[{ t:"0 and 1", ok:true }, { t:"1 and 2" }, { t:"0, 1 and 2" }, { t:"only 2" }],
        explain:"`l` runs from 0 to `n - 1`: 2s and 2p." },
      { id:"p2", prompt:"Ring mode at 2.5 wavelengths. What happens to the wave?",
        options:[{ t:"It overlaps itself out of step and cancels", ok:true }, { t:"It glows steadily" }, { t:"It doubles in size" }, { t:"It turns into a particle" }],
        explain:"Only whole numbers of wavelengths fit, so only certain energies are allowed." },
      { id:"p3", prompt:"How many orbitals does the 3d sublevel have?",
        options:[{ t:"5", ok:true }, { t:"3" }, { t:"10" }, { t:"2" }],
        explain:"`2l + 1 = 5`. (10 is the number of electrons.)" },
      { id:"p4", prompt:"Find the electron, 1s. Measure the position 500 times. What will the dots look like?",
        options:[{ t:"A fuzzy ball, densest near the nucleus", ok:true }, { t:"A neat circle" }, { t:"One dot" }, { t:"A figure-8" }],
        explain:"No track, just probability. The orbital’s surface holds about 90% of the dots." }
    ],
    chalIntro:"Use the viewer to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses the <strong>count box</strong> in Orbital mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 4], prompt:"Show a <strong>4f</strong> orbital.",
        why:"f means `l = 3`, and `l = 3` first appears in shell 4. Any `m_l` from −3 to +3 is one of the seven 4f orbitals.",
        hints:["f means `l = 3`.", "`l = 3` needs `n >= 4`.", "`n = 4`, `l = 3`, `m_l` any of −3 to 3."] },
      { id:"tc2", goal:2, prompt:"Set the address of an electron in a <strong>3p</strong> orbital with `m_l = -1` and spin −½.",
        why:"(3, 1, −1, −½): shell 3, a p sublevel, one of its three orientations, spin down.",
        hints:["p means `l = 1`.", "Then set `m_l` and spin.", "(3, 1, −1, −½)."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"How many electrons in one atom can have `n = 4` <strong>and</strong> `m_l = 0`? Enter the number, then show each orbital they occupy.",
        why:"4s, 4p, 4d and 4f each have exactly one orbital with `m_l = 0`: 4 orbitals × 2 electrons = 8.",
        hints:["Which `l` values exist in shell 4?", "`l = 0`, 1, 2, 3, and each has exactly one orbital with `m_l = 0`.", "4 orbitals × 2 electrons = 8."] }
    ]
  },
  part3:{
    slug:"quantum-numbers", name:"Quantum numbers", heading:"Quantum numbers puzzle",
    intro:"Three stations, away from the viewer: build the counting table by hand, sort addresses into allowed and not allowed, then see how a Canadian chemist read atoms and bonds from electron density.",
    s1:{ title:"Station 1: Build the table",
      intro:"Fill in each shell. Separate several values with commas (for example 0, 1). A row checks itself when every box is filled.",
      cols:[
        { id:"l", label:"Allowed `l` values" },
        { id:"let", label:"Sublevel letters" },
        { id:"orb", label:"Orbitals per sublevel" },
        { id:"sh", label:"Orbitals per shell (`n^2`)" },
        { id:"el", label:"Electrons per shell (`2n^2`)" }],
      data:{ summary:"Check it with data: does `2n^2` match the periodic table?",
        intro:"Compare the shell capacities with the lengths of the periods (rows) of the periodic table.",
        periods:[2, 8, 8, 18, 18, 32, 32],
        note:"Periods don’t equal `2n^2`, because sublevels fill in energy order (module 16)." } },
    s2:{ title:"Station 2: Allowed or not?",
      intro:"Decide whether each address card is allowed. The card flips to show its rule.",
      cards:[
        { id:"c1", t:"(2, 1, 0, +½)", answer:"ok", back:"Allowed: 2p." },
        { id:"c2", t:"(2, 2, 1, +½)", answer:"no", back:"Not allowed: `l < n`." },
        { id:"c3", t:"(3, 1, 2, −½)", answer:"no", back:"Not allowed: `|m_l| <= l`." },
        { id:"c4", t:"(4, 0, 0, −½)", answer:"ok", back:"Allowed: 4s." },
        { id:"c5", t:"(1, 0, 0, 1)", answer:"no", back:"Not allowed: spin is `+½` or `-½`." },
        { id:"c6", t:"(3, 2, −2, +½)", answer:"ok", back:"Allowed: 3d." }],
      wrong:"Check the four rules in turn: `n >= 1`; `0 <= l <= n - 1`; `-l <= m_l <= l`; `m_s = ±½`." },
    // VERIFY: Bader's affiliation (McMaster University, Hamilton) and his "atoms in molecules" work, as described (plan §6 risk 4).
    s3:{ title:"Station 3: Seeing electron density",
      html:"<p>Richard F. W. Bader at McMaster University in Hamilton developed ways to read molecules from their electron density. Within a molecule, an atom is the region its own density surrounds, and bonds show up as ridges of density.</p>",
      task:"Compare the density map of methanal (H₂CO) with its ball-and-stick model. Tap a bond in the model, then tap the ridge it matches on the map.",
      mapNote:"Model density map, drawn from the sum of the atoms’ densities. The map is flipped left to right compared with the model, so use the sizes of the peaks: bigger atoms have taller peaks.",
      bonds:[{ id:"co", t:"C=O" }, { id:"ch1", t:"C–H (top)" }, { id:"ch2", t:"C–H (bottom)" }],
      done:"Every bond sits on a ridge of density, and there’s no ridge between atoms that aren’t bonded, such as O and H. That’s how Bader’s method finds bonds from density alone." },
    quickCheck:{
      title:"Quick check", summary:"Quantum numbers puzzle quick check",
      items:[
        { id:"q1", goal:3, prompt:"How many orbitals are in shell 3?",
          choices:[
            { t:"9", ok:true, fb:"Right. `n^2 = 9` (one 3s, three 3p, five 3d)." },
            { t:"3", fb:"`n^2 = 9` (one 3s, three 3p, five 3d)." },
            { t:"18", fb:"`n^2 = 9` (one 3s, three 3p, five 3d)." },
            { t:"8", fb:"`n^2 = 9` (one 3s, three 3p, five 3d)." }] },
        { id:"q2", goal:2, prompt:"Which address is not allowed?",
          choices:[
            { t:"(3, 3, 0, +½)", ok:true, fb:"Right. `l` must be less than `n`." },
            { t:"(3, 2, 0, +½)", fb:"`l` must be less than `n`." },
            { t:"(3, 0, 0, −½)", fb:"`l` must be less than `n`." },
            { t:"(3, 1, 1, +½)", fb:"`l` must be less than `n`." }] },
        { id:"q3", goal:2, prompt:"Two electrons share `n`, `l` and `m_l`. What must differ?",
          choices:[
            { t:"Spin", ok:true, fb:"Right. Pauli: opposite spins." },
            { t:"Shell", fb:"Pauli: opposite spins." },
            { t:"Shape", fb:"Pauli: opposite spins." },
            { t:"Nothing", fb:"Pauli: opposite spins." }] },
        // VERIFY: Bader's electron-density work (plan §6 risk 4).
        { id:"q4", goal:5, prompt:"What did Bader’s work map?",
          choices:[
            { t:"Electron density in molecules", ok:true, fb:"Right. Atoms and bonds read from density." },
            { t:"Alpha-particle tracks", fb:"Atoms and bonds read from density." },
            { t:"Hydrogen’s spectral lines", fb:"Atoms and bonds read from density." },
            { t:"Nuclear sizes", fb:"Atoms and bonds read from density." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"allowed", type:"custom", title:"Allowed or not?", summary:"Allowed or not?", goal:2,
        instruction:"Sort the ten address cards (`n`, `l`, `m_l`, `m_s`). After you sort a card into <strong>Not allowed</strong>, choose the rule it breaks.",
        how:"Tap a card, then tap the box it belongs in.",
        boxes:[{ id:"ok", label:"Allowed" }, { id:"no", label:"Not allowed" }],
        rules:RULES, ruleFb:RULE_FB,
        ruleAsk:"Which rule does it break?",
        okWrong:"Check each rule again: this set passes all four.",
        items:CARDS.map(c => ({ id:c[0], t:c[1], answer:c[2], why:c[3], goal:2,
          wrongFb:c[2] === "ok" ? "" : RULE_FB[c[2].slice(3)],
          hints:[AH1, AH2, c[3]] })) },
      { id:"counting", type:"custom", title:"Counting with quantum numbers", summary:"Counting with quantum numbers", star:true, goal:[1, 3, 4],
        instruction:"Seven items: six number entries and one choice. Items 4 to 7 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer or tap a choice, then press Check.",
        items:[
          { id:"n1", kind:"num", goal:3, prompt:"Orbitals in shell 3?", answer:9, display:"9 orbitals",
            wrong:[{ match:18, fb:"That’s electrons. " + M7 }], fb:"Add the orbitals in 3s, 3p and 3d.",
            hints:["Shell 3 has 3s, 3p and 3d.", "1 + 3 + 5.", "`n^2 = 9`."] },
          { id:"n2", kind:"num", goal:3, prompt:"Electrons in a full 4d sublevel?", answer:10, display:"10 electrons",
            wrong:[{ match:5, fb:M7 }], fb:"Count the orbitals in a d sublevel, then double.",
            hints:["d means `l = 2`.", "`2l + 1 = 5` orbitals.", "5 × 2 = 10."] },
          { id:"n3", kind:"num", goal:3, prompt:"Electrons with `n = 3` and `l = 1`?", answer:6, display:"6 electrons",
            wrong:[{ match:3, fb:M7 }], fb:"Which sublevel is `n = 3`, `l = 1`? Count its orbitals, then double.",
            hints:["`n = 3`, `l = 1` is the 3p sublevel.", "3p has 3 orbitals.", "3 × 2 = 6."] },
          { id:"n4", kind:"num", star:true, goal:3, prompt:"Electrons with `n = 4` and `m_l = -1`?", answer:6, display:"6 electrons",
            wrong:[{ match:2, fb:"`l = 1`, 2 and 3 each have an `m_l = -1` orbital: 3 orbitals × 2." }], fb:"Find every sublevel in shell 4 that has an `m_l = -1` orbital.",
            hints:["Which `l` values in shell 4 allow `m_l = -1`?", "`l >= 1`: that is `l = 1`, 2, 3.", "3 orbitals × 2 = 6."] },
          { id:"n5", kind:"num", star:true, goal:3, prompt:"Electrons with `n = 3` and `m_s = +½`?", answer:9, display:"9 electrons",
            wrong:[{ match:18, fb:"Only half of shell 3’s 18 electrons have spin +½." }], fb:"How many orbitals are in shell 3, and how many +½ electrons fit in each?",
            hints:["Shell 3 holds `2n^2 = 18` electrons.", "Each orbital holds one +½ electron and one −½ electron.", "18 ÷ 2 = 9."] },
          { id:"n6", kind:"num", star:true, goal:4, prompt:"Total nodes in a 3p orbital?", answer:2, display:"2 nodes",
            wrong:[{ match:1, fb:"3p has one spherical node and one nodal plane: `n - 1 = 2`." }], fb:"Add the spherical nodes and the nodal planes.",
            hints:["Spherical nodes: `n - l - 1`.", "Nodal planes: `l`.", "1 + 1 = 2."] },
          { id:"n7", kind:"chips", star:true, goal:1, prompt:"<strong>Investigation:</strong> a student claims a 2p electron travels along a figure-8 path. Which idea contradicts this?",
            options:[
              { t:"The uncertainty principle: exact paths can’t be known; the orbital is a probability region", ok:true, why:"The dumbbell is where the electron is likely to be, not a track." },
              { t:"The Pauli exclusion principle: two electrons can’t share the figure-8", why:"Pauli is about sharing an address, not about paths. The dumbbell is where the electron is likely to be, not a track." },
              { t:"Bohr’s model: electrons follow fixed paths", why:"That supports the claim instead of contradicting it. The dumbbell is where the electron is likely to be, not a track." },
              { t:"The `2n^2` rule: shell 2 holds 8 electrons", why:"That counts electrons; it says nothing about paths. The dumbbell is where the electron is likely to be, not a track." }],
            hints:["Can anyone track an electron’s exact path?", "Exact paths can’t be known.", "The uncertainty principle: the dumbbell is a probability region."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Harper", how:"", goal:[2, 3],
        instruction:"Harper made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"List the orbitals in the 3d sublevel.",
            steps:["3d means `n = 3` and `l = 2`.", "`m_l` can be 0, 1 or 2.", "So 3d has 3 orbitals and holds 6 electrons."],
            answer:1,
            stepFb:["Correct. Keep checking.", "", "This follows from step 2."],
            fixes:[
              { t:"`m_l` runs from −2 to +2: −2, −1, 0, 1, 2. So 3d has 5 orbitals holding 10 electrons.", ok:true, why:M3 },
              { t:"`m_l` can be 1, 2 or 3.", why:"`m_l` can’t exceed `l`." },
              { t:"3d has 3 orbitals, but they hold 10 electrons.", why:"At most 2 electrons per orbital." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What range does `m_l` cover?", "`-l` to `+l`.", "5 orbitals, 10 electrons."] },
          { id:"e2", goal:3, task:"How many electrons can shell 3 hold?",
            steps:["Shell 3 has 3s, 3p and 3d sublevels.", "Orbitals: 1 + 3 + 5 = 9.", "But a shell is full with 8 electrons, so shell 3 holds 8."],
            answer:2,
            stepFb:["Correct.", "Correct.", ""],
            fixes:[
              { t:"9 orbitals × 2 electrons = 18 (`2n^2`). Eight is only the 3s + 3p total.", ok:true, why:"Each orbital holds 2 electrons. " + M4 },
              { t:"9 orbitals × 1 electron = 9.", why:"Each orbital holds 2." },
              { t:"Shell 3 holds 32.", why:"That’s shell 4." },
              { t:"Step 3 is correct.", why:M4 }],
            hints:["How many electrons per orbital?", "2.", "9 × 2 = 18."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: the wave cancelling on the ring, or the dot cloud with no track?" },
      { id:"j2", q:"In your own words, what is an orbital, and how is it different from a Bohr orbit?" },
      { id:"j3", q:"Explain to a friend how to tell whether a set of four quantum numbers is allowed." },
      { id:"j4", q:"Which counting rule (`2l + 1`, `n^2`, `2n^2`) do you still mix up? How will you remember it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which values of `l` are allowed when `n = 3`?", options:[
          { t:"0, 1, 2", ok:true, why:M2 },
          { t:"1, 2, 3", why:M2 },
          { t:"0, 1, 2, 3", why:"`l` stops at `n - 1`." },
          { t:"3 only", why:M2 }] },
        b:{ prompt:"Which values of `m_l` are allowed when `l = 2`?", options:[
          { t:"−2, −1, 0, 1, 2", ok:true, why:M3 },
          { t:"0, 1, 2", why:M3 },
          { t:"−1, 0, 1", why:"That’s for `l = 1`." },
          { t:"1, 2", why:M3 }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"How many orbitals are in a p sublevel?", options:[
          { t:"3", ok:true, why:"For p, `l = 1`, so `2l + 1 = 3`." },
          { t:"1", why:"That’s s." },
          { t:"5", why:"That’s d." },
          { t:"6", why:"That’s electrons. " + M7 }] },
        b:{ prompt:"What is the maximum number of electrons in a d sublevel?", options:[
          { t:"10", ok:true, why:"5 orbitals × 2 electrons." },
          { t:"5", why:"That’s orbitals. " + M7 },
          { t:"6", why:"That’s p." },
          { t:"14", why:"That’s f." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"In the quantum mechanical model, an orbital is…", options:[
          { t:"A region where an electron is likely to be found", ok:true, why:"Its surface is drawn to hold about 90% of the chance of finding the electron." },
          { t:"The circular path an electron travels", why:M1 },
          { t:"The nucleus", why:"The nucleus is at the centre." },
          { t:"A photon of fixed energy", why:"Photons are light." }] },
        b:{ prompt:"What does the uncertainty principle mean for electrons in atoms?", options:[
          { t:"Their exact position and motion can’t both be known, so exact paths can’t be drawn", ok:true, why:"So the model uses orbitals: regions of probability." },
          { t:"Electrons have no energy", why:"They have definite energies." },
          { t:"Electrons are always at the nucleus", why:"They’re spread in orbitals." },
          { t:"Electrons move in circles of known size", why:M1 }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"How many electrons can have `n = 4`?", options:[
          { t:"32", ok:true, why:"`2(4^2) = 32`." },
          { t:"16", why:"That’s orbitals. " + M7 },
          { t:"18", why:"That’s shell 3." },
          { t:"8", why:M4 }] },
        b:{ prompt:"How many electrons can have `n = 3` and `l = 2`?", options:[
          { t:"10", ok:true, why:"A full 3d sublevel." },
          { t:"5", why:M7 },
          { t:"18", why:"That’s the whole shell." },
          { t:"6", why:"That’s 3p." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"Which set is <strong>not</strong> allowed?", options:[
          { t:"(3, 2, 3, +½)", ok:true, why:"`m_l` can’t exceed `l = 2`." },
          { t:"(3, 1, −1, +½)", why:"Allowed: 3p." },
          { t:"(2, 0, 0, −½)", why:"Allowed: 2s." },
          { t:"(4, 3, −2, −½)", why:"Allowed: 4f." }] },
        b:{ prompt:"Which set <strong>is</strong> allowed?", options:[
          { t:"(4, 2, −2, +½)", ok:true, why:"4d." },
          { t:"(2, 2, 1, +½)", why:M2 },
          { t:"(3, 0, 1, −½)", why:"`l = 0` allows only `m_l = 0`." },
          { t:"(1, 1, 0, +½)", why:M2 }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"How many electrons in an atom can have `n = 3` and `m_l = +1`?", options:[
          { t:"4", ok:true, why:"3p and 3d each have one `m_l = +1` orbital: 2 orbitals × 2." },
          { t:"2", why:"Two sublevels qualify." },
          { t:"6", why:"Only `l = 1` and `l = 2` have `m_l = +1`." },
          { t:"18", why:"That’s the whole shell." }] },
        b:{ prompt:"How many orbitals in shell 4 are d or f orbitals?", options:[
          { t:"12", ok:true, why:"5 + 7." },
          { t:"8", why:"Count both: 5 d and 7 f." },
          { t:"10", why:"That’s d electrons. " + M7 },
          { t:"16", why:"That’s every orbital in shell 4." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why the quantum mechanical model replaced Bohr’s orbits?", options:[
          { t:"“Electrons behave as waves and their exact paths can’t be known, so the model uses orbitals, which work for atoms with many electrons.”", ok:true, why:"It names the evidence (waves, no exact paths), the new idea (orbitals) and what it fixed (many-electron atoms)." },
          { t:"“Bohr’s model had no energy levels.”", why:"It did." },
          { t:"“Electrons were found to orbit faster.”", why:M1 },
          { t:"“The nucleus turned out to be bigger.”", why:"Nucleus size isn’t the reason." }] },
        b:{ prompt:"Which is the best explanation of why an electron in an atom can have only certain energies?", options:[
          { t:"“As a wave, only patterns that fit, like whole numbers of wavelengths around a ring, last; the rest cancel.”", ok:true, why:"Fitting waves set the allowed energies." },
          { t:"“The nucleus blocks other energies.”", why:"Fitting waves set the energies." },
          { t:"“Electrons are too small to have other energies.”", why:"Size isn’t the reason." },
          { t:"“Photons force them into place.”", why:"Photons are absorbed or emitted between allowed levels." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which description of the 2p orbitals is correct?", options:[
          { t:"Three dumbbell-shaped orbitals at right angles, along x, y and z", ok:true, why:"`m_l = -1`, 0 and +1: three dumbbells, one along each axis." },
          { t:"One sphere", why:"That’s s." },
          { t:"Five cloverleaf orbitals", why:"That’s d." },
          { t:"Three circular paths", why:M1 }] },
        b:{ prompt:"How do the 1s and 2s orbitals compare?", options:[
          { t:"Both spherical; 2s is larger and has one spherical node inside", ok:true, why:M6 },
          { t:"2s is dumbbell-shaped", why:M6 },
          { t:"2s is smaller than 1s", why:"Higher `n`, larger orbital." },
          { t:"They are identical", why:"2s is larger." }] } },
      { id:"a1", cat:"A", goal:5,
        // VERIFY: Bader at McMaster University; reading atoms and bonds from electron density (plan §6 risk 4).
        a:{ prompt:"What did Richard Bader’s work at McMaster University contribute?", options:[
          { t:"Ways to read atoms and bonds in molecules from their electron density", ok:true, why:"Atoms are the regions their density surrounds; bonds are ridges of density." },
          { t:"The discovery of the electron", why:"That was Thomson." },
          { t:"The gold-foil experiment", why:"That was Rutherford’s team." },
          { t:"Hydrogen’s line spectrum", why:"That’s Bohr’s era." }] },
        b:{ prompt:"Electron density maps (from X-ray studies of crystals) show molecules as smooth clouds that are densest near the nuclei. Which model do they support?", options:[
          { t:"The quantum mechanical model", ok:true, why:"Smooth clouds of density are what orbitals predict." },
          { t:"Bohr’s model of fixed circular orbits", why:M1 },
          { t:"Thomson’s plum pudding", why:"Thomson’s model has no nucleus." },
          { t:"Dalton’s solid spheres", why:"Dalton’s atoms have no inner structure." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Theory predicts g orbitals with `l = 4` (no known element uses them yet). How many orbitals would a g sublevel have?", options:[
          { t:"9", ok:true, why:"2(4) + 1." },
          { t:"4", why:M3 },
          { t:"18", why:"That’s electrons. " + M7 },
          { t:"8", why:"Count from −4 to +4 including 0." }] },
        b:{ prompt:"How many electrons could shell 5 hold in theory?", options:[
          { t:"50", ok:true, why:"2(5²)." },
          { t:"25", why:M7 },
          { t:"32", why:"That’s shell 4." },
          { t:"18", why:M4 }] } }
    ]
  },
  task:{
    title:"Quantum address", summary:"Quantum address",
    statement:"<p>Write the quantum address of an electron that meets every condition. Can you find all the answers?</p><ol class=\"qm-conds\"><li>The set is allowed.</li><li>The electron is in the third shell.</li><li>It is in a p or d sublevel.</li><li>Its `m_l` is +1.</li></ol>",
    checks:["Allowed", "Third shell", "p or d", "`m_l = +1`"],
    tips:["`m_l` can’t be bigger than `l`.", "Shell 3 has s, p and d.", "`m_l = +1` needs `l >= 1`.", "Don’t forget spin: two electrons can share an orbital."],
    lTip:M2,
    explainPrompt:"Explain what each of your four numbers tells about the electron, and why exactly four addresses work.",
    vocab:"Use the words shell, sublevel, orbital, spin and Pauli exclusion principle.",
    success:"That address meets every condition.",
    more:"There’s more than one answer. Don’t forget spin: two electrons can share an orbital.",
    after3:"Four addresses, four electrons: two in one 3p orbital and two in one 3d orbital, each pair with opposite spins (Pauli).",
    afterAt:4
  },
  cards:[
    ["Orbital", "A 3D region where an electron is likely to be found (the boundary holds about 90% of the chance)."],
    ["Uncertainty principle", "An electron’s exact position and motion can’t both be known, so there are no exact paths."],
    ["Standing-wave idea", "Only whole-number wave patterns fit, so only certain energies are allowed."],
    ["`n`", "Principal quantum number: shell, energy and size (1, 2, 3, …)."],
    ["`l`", "Shape: 0 to `n - 1` (s, p, d, f)."],
    ["`m_l`", "Orientation: `-l` to `+l`; `2l + 1` orbitals per sublevel."],
    ["`m_s`", "Spin: +½ or −½."],
    ["Pauli exclusion principle", "No two electrons in an atom share all four quantum numbers: at most 2 per orbital, with opposite spins."],
    ["Shell capacity", "`n^2` orbitals; `2n^2` electrons (2, 8, 18, 32)."],
    ["Sublevel capacity", "s 2 · p 6 · d 10 · f 14."],
    ["Shapes", "s: sphere · p: dumbbell (×3) · d: mostly cloverleaf (×5)."],
    // VERIFY: Bader at McMaster; atoms and bonds from electron density.
    ["Bader (McMaster)", "Read atoms and bonds in molecules from electron density."]
  ]
};
