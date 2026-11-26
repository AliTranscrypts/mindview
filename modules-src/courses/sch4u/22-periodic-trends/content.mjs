// SCH4U 22 Periodic Trends. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/22-periodic-trends.md
// The pictures (hero atoms, Trend heat map, shell diagrams, IE graphs, Part 3 bar charts, task readouts) are drawn by app.js.

// Configuration text: "3s2 3p5" -> 3s<sup>2</sup> 3p<sup>5</sup>
const cf = s => s.replace(/([spdf])(\d+)/g, "$1<sup>$2</sup>");
// Ion: ion("Na", "+") -> Na<sup>+</sup>; ion("N", "3-") -> N<sup>3−</sup> (true minus)
const ion = (el, c) => el + "<sup>" + c.replace("-", "−") + "</sup>";
const ZE = "<em>Z</em><sub>eff</sub>";
const Z = "<em>Z</em>";
const N = "<em>n</em>";
const NB = "&#160;";

// Misconception core sentences (plan §3)
const M1 = "Across a period the electrons go into the same shell while the pull grows (" + ZE + " up), so the atom shrinks.";
const M2 = "Down a group the outer electron is in a new, farther shell behind more core electrons, so it is easier to remove.";
const M3 = "Core electrons shield the nucleus. Chlorine’s valence electrons feel about 17 − 10 = 7, not 17.";
const M4 = ion("Na", "+") + " has lost its only 3s electron, and with it a whole shell. " + ion("Cl", "-") + " gains an electron, adding repulsion with the same 17 protons.";
const M5 = "Same electrons; more protons pull them closer. " + ion("Mg", "2+") + " (12 protons) is smaller than " + ion("F", "-") + " (9 protons).";
const M6 = "Look for the biggest <em>jump</em> between consecutive values. The electrons before the jump are the valence electrons.";
const M7 = "IE₁ dips at B and O, for reasons in their configurations; the general trend still holds.";

export default {
  id:"22-periodic-trends",
  kind:"topic",
  title:"Periodic trends",
  topic:"Periodic Trends",
  readyTopic:"periodic trends",
  hero:{
    headline:"Two ideas explain every trend",
    text:"How strongly does the nucleus hold its outer electrons? Across a period, <strong>effective nuclear charge</strong> grows while the shell stays the same, so atoms shrink and hold their electrons tighter. Down a group, new <strong>shells</strong> put the outer electrons farther out behind more <strong>shielding</strong>. Radius, <strong>ionization energy</strong> and <strong>electronegativity</strong> all follow.",
    fig:{ html:'<div class="tr-hx"><svg class="tr-hx-svg" id="tr-hx-svg" viewBox="0 0 440 380" role="img" aria-label="A periodic-table outline. An arrow across a period reads: Z eff up, so radius down, ionization energy up, electronegativity up. An arrow down a group reads: shells up, so radius up, ionization energy down, electronegativity down. Below, a sodium atom (nucleus +11, 10 core electrons in a grey band, 1 outer electron) steps across period 3 to chlorine: the nucleus climbs to +17, the outer shell fills to 7 electrons and its ring tightens, so Z eff goes from 1 to 7. Then lithium, sodium and potassium step down group 1, each adding a ring."></svg><div class="tr-hx-row"><p class="tr-hx-ctr" id="tr-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="tr-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can describe the trends in atomic radius, ionization energy, electronegativity and electron affinity across periods and down groups.",
    "I can explain trends with effective nuclear charge and shielding, using the simple model " + ZE + " ≈ " + Z + " − core electrons.",
    "I can explain the exceptions in first ionization energy (B vs Be, O vs N) from electron configurations.",
    "I can compare the sizes of atoms and ions, including isoelectronic series.",
    "I can use successive ionization energies to find an element’s group.",
    "I can use trends to predict reactivity and bond type for unfamiliar elements."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Electron configurations", goal:2,
          prompt:"The electron configuration of chlorine (" + Z + " = 17) is…",
          options:[
            { t:cf("1s2 2s2 2p6 3s2 3p5"), ok:true, why:"2 + 2 + 6 + 2 + 5 = 17." },
            { t:cf("1s2 2s2 2p6 3s2 3p6"), why:"That’s 18 electrons (argon)." },
            { t:cf("1s2 2s2 2p6 3p7"), why:"A p subshell holds at most 6, and 3s fills first." },
            { t:"[Ne] " + cf("3s2 3d5"), why:"3p fills before 3d." }],
          hints:["Fill in aufbau order.", "After [Ne], 3s then 3p.", "[Ne] " + cf("3s2 3p5") + "."] },
        { id:"w2", skill:"Electron configurations", goal:3,
          prompt:"Which configuration has a paired electron in the 2p subshell?",
          options:[
            { t:"O: " + cf("1s2 2s2 2p4"), ok:true, why:"Four electrons in three 2p orbitals: one orbital has a pair (Hund’s rule)." },
            { t:"N: " + cf("1s2 2s2 2p3"), why:"Three electrons, one in each orbital: none paired." },
            { t:"C: " + cf("1s2 2s2 2p2"), why:"Two unpaired electrons." },
            { t:"B: " + cf("1s2 2s2 2p1"), why:"One electron." }],
          hints:["Three 2p orbitals.", "Hund’s rule: fill singly first.", "The fourth electron must pair: O."] },
        { id:"w3", skill:"Core and valence electrons", goal:2,
          prompt:"How many core (inner) electrons does a magnesium atom have?",
          options:[
            { t:"10", ok:true, why:"[Ne] core; 2 valence electrons in 3s." },
            { t:"2", why:"Those are the valence electrons." },
            { t:"12", why:"That’s all of them." },
            { t:"8", why:"The core is " + cf("1s2 2s2 2p6") + " = 10." }],
          hints:["Write the noble-gas shorthand.", "[Ne] " + cf("3s2") + ".", "The [Ne] core has 10."] },
        { id:"w4", skill:"Core and valence electrons", goal:2,
          prompt:"How many valence electrons does sulfur have?",
          options:[
            { t:"6", ok:true, why:"[Ne] " + cf("3s2 3p4") + "." },
            { t:"16", why:"That’s the total." },
            { t:"4", why:"Count both 3s and 3p: 2 + 4." },
            { t:"2", why:"3p electrons count too." }],
          hints:["Highest shell, " + N + " = 3.", cf("3s2 3p4") + ".", "6."] },
        { id:"w5", skill:"Reading the table", goal:1,
          prompt:"Which element is in period 3, group 13?",
          options:[
            { t:"Al", ok:true, why:"Third row, the first p-block column." },
            { t:"B", why:"Boron is period 2." },
            { t:"Ga", why:"Gallium is period 4." },
            { t:"Mg", why:"Mg is group 2." }],
          hints:["Period = row; group 13 = first p column.", "Row 3.", "Al."] },
        { id:"w6", skill:"Reading the table", goal:6,
          prompt:"Which pair are both in group 17?",
          options:[
            { t:"Cl and I", ok:true, why:"The halogens." },
            { t:"O and S", why:"Group 16." },
            { t:"Ne and Ar", why:"Group 18." },
            { t:"Cl and Ar", why:"Same period, not the same group." }],
          hints:["Group = column.", "Halogens.", "Cl and I."] }
      ],
      refreshers:{
        "Electron configurations":"Fill 1s 2s 2p 3s 3p 4s 3d …; s holds 2 and p holds 6; Hund’s rule puts electrons singly into equal orbitals before pairing.",
        "Core and valence electrons":"Valence electrons are those in the highest " + N + ". Core electrons are everything in the noble-gas shorthand.",
        "Reading the table":"Rows are periods (the highest shell number); columns are groups (similar valence configurations)."
      }
    }
  },
  explore:{
    heading:"Trend heat map",
    intro:"Colour the table by a property, then open any element to see <em>why</em> it sits where it does.",
    how:"Choose a <strong>property</strong> to colour the table (darker or brighter = larger value; the legend gives the numbers) and a <strong>mode</strong>. Tap an element, or use the arrow keys and Enter. <strong>Explain an element</strong> draws its shells; <strong>Compare two</strong> sets element 1, then element 2; <strong>Ion sizes</strong> puts an atom beside its common ion.",
    modes:[{ id:"heat", t:"Heat map" }, { id:"explain", t:"Explain an element" }, { id:"compare", t:"Compare two" }, { id:"ion", t:"Ion sizes" }],
    props:[{ id:"rad", t:"Atomic radius" }, { id:"ie", t:"First ionization energy" }, { id:"en", t:"Electronegativity" }, { id:"ea", t:"Electron affinity" }],
    predictions:[
      { id:"p1", prompt:"Radius heat map, period 3 hidden. Which period 3 atom is largest?",
        options:[{ t:"Na", ok:true }, { t:"Cl" }, { t:"Ar" }, { t:"They’re all the same size." }],
        explain:"Same shell, rising " + ZE + " (1 → 7): the electrons are pulled closer." },
      { id:"p2", prompt:"IE₁ map, group 1 hidden. Which has the lower first ionization energy: Na or K?",
        options:[{ t:"K", ok:true }, { t:"Na" }, { t:"Equal" }, { t:"You can’t tell." }],
        explain:"K’s outer electron is in shell 4, farther away and better shielded." },
      { id:"p3", prompt:"IE₁ graph against " + Z + " for Li → Ne. IE₁ generally rises across period 2. Which element breaks the pattern by being <em>lower</em> than the element before it?",
        options:[{ t:"B (lower than Be) and O (lower than N)", ok:true }, { t:"Only Ne" }, { t:"None: the rise is perfectly smooth" }, { t:"C (lower than B)" }],
        explain:"B’s electron is in 2p (higher energy than 2s). O’s fourth 2p electron is paired, and repulsion makes it easier to remove." },
      { id:"p4", prompt:"Ion sizes mode, Na. Is " + ion("Na", "+") + " larger or smaller than Na?",
        options:[{ t:"Much smaller", ok:true }, { t:"Larger" }, { t:"The same" }, { t:"Slightly larger" }],
        explain:"Losing the only 3s electron removes the whole third shell." }
    ],
    chalIntro:"Use the Trend heat map to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Compare two mode: find two elements <strong>in the same group</strong> whose electronegativities differ by <strong>more than 1.0</strong>.",
        why:"F–I: 3.98 − 2.66 = 1.32. F–Br (3.98 − 2.96 = 1.02) also works: electronegativity falls fastest down group 17.",
        hints:["EN falls down a group. Which group has the biggest spread?", "Start with the highest EN of all: F.", "F with Br or I."] },
      { id:"tc2", goal:4, prompt:"Ion sizes mode: arrange " + ion("N", "3-") + ", " + ion("O", "2-") + ", " + ion("F", "-") + ", " + ion("Na", "+") + " and " + ion("Mg", "2+") + " from largest to smallest.",
        why:ion("N", "3-") + " > " + ion("O", "2-") + " > " + ion("F", "-") + " > " + ion("Na", "+") + " > " + ion("Mg", "2+") + " (146 > 140 > 133 > 102 > 72 pm): the same 10 electrons, pulled closer by 7, 8, 9, 11 and 12 protons.",
        hints:["Count electrons: all 10.", "Count protons: 7, 8, 9, 11, 12.", "Fewest protons is largest: " + ion("N", "3-") + " first."] },
      { id:"tc3", goal:6, stretch:true, prompt:"Find the element whose valence electrons feel " + ZE + " = 6 (simple model) and which has 3 occupied shells. Then predict: is its IE₁ higher or lower than that of the element directly above it?",
        why:"Sulfur: 16 − 10 = 6, with 3 occupied shells. S has IE₁ 1000 kJ/mol; O, above it, has 1314, so sulfur’s is lower.",
        hints:[ZE + " = valence electrons in this model.", "6 valence electrons and 3 shells: period 3, group 16.", "S. Oxygen sits above it with a higher IE₁, so S is lower."] }
    ],
    blocks:[
      { title:"About this model", html:"<p>The simple model " + ZE + " ≈ " + Z + " − (core electrons) treats the core as a perfect shield and ignores the partial shielding by electrons in the same shell. Real effective nuclear charges are a little different, but the model explains every trend in this module. The data values are listed in the <strong>Atomic data</strong> table under the heat map.</p>" }
    ]
  },
  part3:{
    slug:"successive", name:"Successive IE", heading:"Successive ionization energies",
    intro:"Pull electrons off an atom one at a time and measure the energy each one needs. A huge jump means you have reached the core, and that tells you the group.",
    s1:{ title:"Station 1: Watch the jump",
      intro:"Magnesium is [Ne] " + cf("3s2") + ". Remove its electrons one at a time and watch the bars.",
      data:"After two electrons, the next one comes from the " + N + " = 2 core: much closer, much less shielded." },
    s2:{ title:"Station 2: Mystery elements",
      intro:"Tap the gap where the big jump happens, then pick the group.",
      items:[
        { id:"X", ies:[496, 4562], answer:1, el:"Na" },
        { id:"Y", ies:[578, 1817, 2745, 11577], answer:3, el:"Al" },
        { id:"Z", ies:[787, 1577, 3232, 4356, 16091], answer:4, el:"Si" },
        { id:"W", ies:[590, 1145, 4912], answer:2, el:"Ca" }],
      groups:[1, 2, 13, 14] },
    s3:{ title:"Station 3: Why each IE is larger than the last",
      text:"Even without a jump, IE₂ > IE₁: removing an electron from a positive ion is harder, because the same protons pull on fewer electrons." },
    quickCheck:{
      title:"Quick check", summary:"Successive IE quick check",
      items:[
        { id:"q1", goal:5, prompt:"IEs: 801, 2427, 3660, 25" + NB + "026 kJ/mol. Group?",
          choices:[
            { t:"13", ok:true, fb:"Right. The jump comes after the 3rd electron: 3 valence electrons, so group 13 (this is boron)." },
            { t:"3", fb:"The jump comes after the 3rd electron: 3 valence electrons." },
            { t:"14", fb:"The jump comes after the 3rd electron: 3 valence electrons." },
            { t:"1", fb:"The jump comes after the 3rd electron: 3 valence electrons." }] },
        { id:"q2", goal:5, prompt:"Why is IE₂ of Na (4562) so much larger than IE₁ (496)?",
          choices:[
            { t:"the 2nd electron is a core electron", ok:true, fb:"Right. It comes from the " + N + " = 2 shell, close and unshielded." },
            { t:ion("Na", "+") + " has more protons", fb:"It comes from the " + N + " = 2 shell, close and unshielded." },
            { t:"the 2nd electron is in 3p", fb:"It comes from the " + N + " = 2 shell, close and unshielded." },
            { t:ion("Na", "+") + " is bigger", fb:"It comes from the " + N + " = 2 shell, close and unshielded." }] },
        { id:"q3", goal:5, prompt:"Which IE of aluminium shows the big jump?",
          choices:[
            { t:"IE₄", ok:true, fb:"Right. Al has 3 valence electrons, so the 4th comes from the core." },
            { t:"IE₃", fb:"Al has 3 valence electrons, so the 4th comes from the core." },
            { t:"IE₂", fb:"Al has 3 valence electrons, so the 4th comes from the core." },
            { t:"IE₁", fb:"Al has 3 valence electrons, so the 4th comes from the core." }] },
        { id:"q4", goal:5, prompt:"A student says the group is the position of the <em>largest</em> IE. Correct?",
          choices:[
            { t:"No: it’s where the jump is", ok:true, fb:"Right. The last IE is always largest. Look for the biggest <em>jump</em>." },
            { t:"Yes", fb:"The last IE is always largest. Look for the biggest <em>jump</em>." },
            { t:"Only for metals", fb:"The last IE is always largest. Look for the biggest <em>jump</em>." },
            { t:"Only in period 2", fb:"The last IE is always largest. Look for the biggest <em>jump</em>." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"order", type:"order", title:"Order by trend", summary:"Order by trend", goal:[1, 4],
        instruction:"Put each set in order. Watch whether the trend runs across a period or down a group.",
        sequences:[
          { id:"o1", goal:1, prompt:"By atomic radius, largest first.", steps:["K", "Na", "Mg", "Cl"], start:[2, 1, 3, 0],
            wrong:[{ order:[1, 0, 2, 3], fb:"K has an extra shell." }],
            // VERIFY: the "general" lines for out-of-place steps were written for the module (the plan gives one example).
            general:"Down a group adds a shell; across a period the same shell is pulled in.",
            why:"Down then across: K (227) > Na (186) > Mg (160) > Cl (100).",
            hints:["Is the trend across or down?", "Use the arrows on the hero.", "K, Na, Mg, Cl."] },
          { id:"o2", goal:1, prompt:"By first ionization energy, lowest first.", steps:["Rb", "K", "Na", "Li"], start:[2, 0, 3, 1],
            wrong:[{ order:[3, 2, 1, 0], fb:"That’s highest first. " + M2 }],
            general:"Up group 1, the outer electron is closer and less shielded, so IE₁ rises.",
            why:"Up group 1, IE₁ rises: 403, 419, 496, 520.",
            hints:["Is the trend across or down?", "Use the arrows on the hero.", "Rb, K, Na, Li."] },
          { id:"o3", goal:1, prompt:"By electronegativity, lowest first.", steps:["Na", "Al", "P", "Cl"], start:[3, 1, 0, 2],
            wrong:[{ order:[3, 2, 1, 0], fb:"That’s highest first. Across a period " + ZE + " rises, so electronegativity rises." }],
            general:"Across period 3, " + ZE + " rises, so the pull on shared electrons grows.",
            why:"Across period 3: 0.93, 1.61, 2.19, 3.16.",
            hints:["Is the trend across or down?", "Use the arrows on the hero.", "Na, Al, P, Cl."] }
        ] },
      { id:"except", type:"mc", title:"Explain the exception", summary:"Explain the exception", star:true, goal:[2, 3, 4, 5],
        instruction:"Six items. Choose the best explanation. Items 3 to 6 (★) are non-routine; items 5 and 6 go beyond the Final Check.",
        items:[
          { id:"x1", goal:2, prompt:"Why is K’s IE₁ lower than Na’s?",
            options:[
              { t:"K’s outer electron is in " + N + " = 4, farther out and better shielded", ok:true, why:"The extra shell outweighs the extra protons." },
              { t:"K has more protons in its nucleus", why:"More protons doesn’t win: the extra shell does." },
              { t:"K has a higher " + ZE, why:"In the simple model both feel " + ZE + " = 1; the difference is the shell." },
              { t:"K is a nonmetal", why:"K is an alkali metal, like Na." }],
            // VERIFY: hints for X1–X5 were written for the module (the plan gives hints for X6 only).
            hints:["Which shell holds each outer electron?", "Na: " + N + " = 3; K: " + N + " = 4.", "K’s outer electron is farther out and better shielded."] },
          { id:"x2", goal:4, prompt:"Why is " + ion("Cl", "-") + " larger than Cl?",
            options:[
              { t:"An added electron increases repulsion; the protons are unchanged", ok:true, why:"Same 17 protons, one more electron to hold." },
              { t:ion("Cl", "-") + " has fewer protons", why:"The nucleus doesn’t change." },
              { t:"The extra electron starts a new shell", why:"It goes into 3p, the same shell." },
              { t:"Negative ions have more mass", why:"Size depends on electrons and protons, not mass." }],
            hints:["Does the nucleus change when Cl gains an electron?", "Same 17 protons, one more electron.", "More repulsion spreads the electrons out."] },
          { id:"x3", goal:3, star:true, prompt:"Why is IE₁ of O (1314) lower than that of N (1402)?",
            options:[
              { t:"O’s fourth 2p electron is paired; repulsion makes it easier to remove", ok:true, why:"N’s three 2p electrons are all unpaired; O’s fourth must pair." },
              { t:"O has a lower " + ZE + " than N", why:ZE + " is higher for O; the pairing explains the dip." },
              { t:"O’s outer electron is in a new shell", why:"Both have their valence electrons in shell 2." },
              { t:"O has fewer protons than N", why:"O has 8 protons; N has 7." }],
            hints:["Draw the 2p boxes for N and O.", "N: ↑ ↑ ↑. O: ↑↓ ↑ ↑.", "The paired electron is repelled by its partner, so it is easier to remove."] },
          { id:"x4", goal:3, star:true, prompt:"Why is IE₁ of Al (578) lower than that of Mg (738)?",
            options:[
              { t:"Al’s electron is in 3p, higher in energy and partly shielded by 3s", ok:true, why:"Mg’s outermost electron is in 3s; Al’s is in 3p." },
              { t:"Al’s 3p electron is paired, so repulsion pushes it out", why:"The same reason as B vs Be, one period down." },
              { t:"Al has a lower " + ZE + " than Mg", why:ZE + " is 3 for Al and 2 for Mg; the sublevel explains the dip." },
              { t:"Al is in a later period than Mg", why:"Both are in period 3." }],
            hints:["Write the outer configurations: Mg " + cf("3s2") + ", Al " + cf("3s2 3p1") + ".", "Which sublevel does Al’s outermost electron come from?", "3p is higher in energy than 3s and partly shielded by it."] },
          { id:"x5", goal:2, star:true, prompt:"<strong>Investigation:</strong> A graph of IE₁ vs atomic number from H to K peaks at He, Ne and Ar. Which conclusion is best supported?",
            options:[
              { t:"Full outer shells are especially stable; the next element starts a new shell", ok:true, why:"Each peak is followed by a sharp drop at Li, Na and K, the first element of a new shell." },
              { t:"Noble gases have the most protons", why:"The peaks are evidence; ‘noble gases have the most protons’ is false." },
              { t:"IE₁ always rises with atomic number", why:"The graph drops sharply after each peak (Li, Na, K)." },
              { t:"Group 1 elements have the highest IE₁", why:"They sit at the lowest points, right after each peak." }],
            hints:["Where does each new period start?", "Li, Na and K start new shells, right after the peaks.", "Full outer shells are especially stable; the next electron goes into a new shell."] },
          { id:"x6", goal:4, star:true, prompt:"Rank " + ion("S", "2-") + ", " + ion("Cl", "-") + ", " + ion("K", "+") + ", " + ion("Ca", "2+") + " from largest to smallest.",
            options:[
              { t:ion("S", "2-") + " > " + ion("Cl", "-") + " > " + ion("K", "+") + " > " + ion("Ca", "2+"), ok:true, why:"184, 181, 138, 100 pm: 18 electrons each, pulled by 16, 17, 19 and 20 protons." },
              { t:ion("Ca", "2+") + " > " + ion("K", "+") + " > " + ion("Cl", "-") + " > " + ion("S", "2-"), why:"All have 18 electrons; protons 16, 17, 19, 20." },
              { t:ion("K", "+") + " > " + ion("Ca", "2+") + " > " + ion("S", "2-") + " > " + ion("Cl", "-"), why:"Metal ions aren’t larger here: all have 18 electrons, and more protons pull them closer." },
              { t:ion("Cl", "-") + " > " + ion("S", "2-") + " > " + ion("K", "+") + " > " + ion("Ca", "2+"), why:ion("S", "2-") + " has fewer protons (16) than " + ion("Cl", "-") + " (17), so it is larger." }],
            hints:["Count electrons.", "All 18. Count protons.", "Fewest protons is largest."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Manon", how:"", goal:[2, 5],
        instruction:"Manon made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain why Cl is smaller than Na.",
            steps:["Both have their valence electrons in shell 3.", "Cl has 17 protons and Na has 11.", "Both have 10 core electrons, so " + ZE + " is 7 for Cl and 1 for Na.",
              "Cl’s extra electrons repel each other more, so Cl should be larger; it’s only smaller because it’s a nonmetal.", "So nonmetals are always smaller."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows step 4."],
            fixes:[
              { t:"The greater " + ZE + " pulls the shell-3 electrons closer, so Cl is smaller.", ok:true, why:M1 },
              { t:"Cl has more shells.", why:"Same shell." },
              { t:"Na’s protons repel its electrons.", why:"Protons attract electrons." },
              { t:"Step 4 is correct.", why:"Being a nonmetal isn’t a cause. " + ZE + " is." }],
            hints:["What did step 3 just show?", "Bigger " + ZE + " means a stronger pull.", "The greater " + ZE + " pulls the shell-3 electrons closer, so Cl is smaller."] },
          { id:"e2", goal:5, task:"Find the group of an element with IEs 590, 1145 and 4912 kJ/mol.",
            steps:["Each IE is larger than the one before.", "The largest value is the third, 4912.", "So the element has 3 valence electrons: group 13.", "It’s probably aluminium."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is true.", "", "Step 4 follows step 3."],
            fixes:[
              { t:"The jump comes between IE₂ and IE₃, so there are 2 valence electrons: group 2 (calcium).", ok:true, why:M6 },
              { t:"Group 3.", why:"Group 3 is in the d block; count the electrons before the jump." },
              { t:"Group 1, because IE₁ is smallest.", why:"IE₁ is always smallest." },
              { t:"Step 3 is correct.", why:"The largest value isn’t the clue; the jump is." }],
            hints:["Find the biggest gap.", "1145 → 4912.", "2 valence electrons."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result surprised you more: the IE dips at B and O, or how much smaller " + ion("Na", "+") + " is than Na?" },
      { id:"j2", q:"In your own words, explain effective nuclear charge and shielding." },
      { id:"j3", q:"Explain to a friend how to find an element’s group from successive ionization energies." },
      { id:"j4", q:"Which trend do you still mix up? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Moving across period 3 from Na to Cl, atomic radius…", options:[
          { t:"decreases", ok:true, why:ZE + " rises in the same shell." },
          { t:"increases", why:"More electrons, but the same shell and a stronger pull." },
          { t:"stays the same", why:"It falls from 186 to 100 pm." },
          { t:"increases, then decreases", why:"It falls steadily." }] },
        b:{ prompt:"Moving down group 1 from Li to Rb, first ionization energy…", options:[
          { t:"decreases", ok:true, why:"The outer electron is farther out and better shielded." },
          { t:"increases", why:M2 },
          { t:"stays the same", why:"520 → 403 kJ/mol." },
          { t:"increases, then decreases", why:"It falls steadily." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Using the simple model, what effective nuclear charge do chlorine’s valence electrons feel?", options:[
          { t:"7", ok:true, why:"17 − 10 core electrons." },
          { t:"17", why:"Core electrons shield the nucleus." },
          { t:"10", why:"That’s the number of core electrons." },
          { t:"1", why:"That’s sodium’s." }] },
        b:{ prompt:"Using the simple model, what effective nuclear charge do magnesium’s valence electrons feel?", options:[
          { t:"2", ok:true, why:"12 − 10." },
          { t:"12", why:"Core electrons shield the nucleus: subtract the 10 core electrons." },
          { t:"10", why:"That’s the core." },
          { t:"8", why:"Subtract the core: 12 − 10 = 2." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which particle is largest: " + ion("F", "-") + ", Ne, " + ion("Na", "+") + " or " + ion("Mg", "2+") + "?", options:[
          { t:ion("F", "-"), ok:true, why:"All have 10 electrons; " + ion("F", "-") + " has the fewest protons (9)." },
          { t:ion("Mg", "2+"), why:"Most protons, so smallest." },
          { t:"Ne", why:"10 protons, more than " + ion("F", "-") + "’s 9." },
          { t:ion("Na", "+"), why:ion("Na", "+") + " has lost its only 3s electron, and with it a whole shell; its 11 protons pull its 10 electrons in more than " + ion("F", "-") + "’s 9 do." }] },
        b:{ prompt:"Which particle is smallest: " + ion("S", "2-") + ", " + ion("Cl", "-") + ", " + ion("K", "+") + " or " + ion("Ca", "2+") + "?", options:[
          { t:ion("Ca", "2+"), ok:true, why:"18 electrons, 20 protons." },
          { t:ion("S", "2-"), why:"Fewest protons, so largest." },
          { t:ion("Cl", "-"), why:"17 protons." },
          { t:ion("K", "+"), why:"19 protons; " + ion("Ca", "2+") + " has 20." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"An element’s successive ionization energies are 578, 1817, 2745 and 11" + NB + "577 kJ/mol. Which group is it in?", options:[
          { t:"Group 13", ok:true, why:"The jump comes after 3 electrons." },
          { t:"Group 4", why:"The largest is the 4th, but the jump is after the 3rd." },
          { t:"Group 1", why:"The first gap is small." },
          { t:"Group 2", why:"1817 → 2745 is a smaller step than 2745 → 11" + NB + "577." }] },
        b:{ prompt:"An element’s successive ionization energies are 738, 1451 and 7733 kJ/mol. Which group is it in?", options:[
          { t:"Group 2", ok:true, why:"The jump comes after 2 electrons." },
          { t:"Group 3", why:"Look for the biggest jump, not the largest value: the jump comes after 2 electrons." },
          { t:"Group 1", why:"738 → 1451 is a modest step." },
          { t:"Group 13", why:"Only 2 valence electrons." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"Which has the higher first ionization energy, N or O, and why?", options:[
          { t:"N: O’s fourth 2p electron is paired, so repulsion makes it easier to remove", ok:true, why:"1402 vs 1314 kJ/mol: the paired electron is easier to remove." },
          { t:"O: it has a higher " + ZE + ", so the trend holds", why:"That’s the general trend, but here pairing wins." },
          { t:"N: N has more protons", why:"O has more (8 vs 7)." },
          { t:"They’re equal: both are in period 2", why:"1402 vs 1314." }] },
        b:{ prompt:"Which has the higher first ionization energy, Be or B, and why?", options:[
          { t:"Be: B’s outer electron is in 2p, higher in energy and partly shielded by 2s", ok:true, why:"900 vs 801 kJ/mol: the 2p electron is easier to remove." },
          { t:"B: higher " + ZE, why:M7 },
          { t:"Be: Be has more protons", why:"B has more (5 vs 4)." },
          { t:"They’re equal", why:"900 vs 801." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"Rubidium is directly below potassium. Predict its radius and first ionization energy compared with potassium’s.", options:[
          { t:"Larger radius, lower IE₁", ok:true, why:"A fifth shell: 248 vs 227 pm, and 403 vs 419 kJ/mol." },
          { t:"Smaller radius, higher IE₁", why:M2 },
          { t:"Larger radius, higher IE₁", why:"A bigger atom holds its outer electron less tightly." },
          { t:"The same as potassium’s, because it’s in the same group", why:"Same group gives similar chemistry, not equal values." }] },
        b:{ prompt:"Iodine is directly below bromine. Predict its electronegativity and radius compared with bromine’s.", options:[
          { t:"Lower electronegativity (2.66 vs 2.96), larger radius", ok:true, why:"A fifth shell puts the bonding electrons farther from the nucleus." },
          { t:"Higher EN, smaller radius", why:"Down a group the outer electrons are in a new, farther shell behind more core electrons." },
          { t:"Higher EN, larger radius", why:"Larger atoms attract shared electrons less." },
          { t:"The same EN, because it’s in the same group", why:"2.66 ≠ 2.96." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why atomic radius decreases across a period?", options:[
          { t:"“Protons are added while the electrons go into the same shell, so the effective nuclear charge increases and pulls the valence electrons closer.”", ok:true, why:"It names the cause: the same shell, with a rising " + ZE + "." },
          { t:"“Atoms gain electrons, which makes them smaller.”", why:M1 },
          { t:"“Nonmetals are naturally smaller than metals.”", why:"That’s a description, not a cause." },
          { t:"“The number of shells decreases across a period.”", why:"The shell number stays the same." }] },
        b:{ prompt:"Which is the best explanation of why atomic radius increases down a group?", options:[
          { t:"“Each element down a group has an additional occupied shell, and the inner shells shield the valence electrons from the extra protons.”", ok:true, why:"It names both ideas: a new shell, and shielding by the inner shells." },
          { t:"“More protons push the electrons outward.”", why:"Protons attract electrons." },
          { t:"“Atoms gain mass, so they get bigger.”", why:"Size depends on electron shells, not mass." },
          { t:"“" + ZE + " increases down a group.”", why:"In the simple model it stays the same down a group." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement correctly explains why " + ion("Na", "+") + " is smaller than Na?", options:[
          { t:"“" + ion("Na", "+") + " has lost its only 3s electron, so its outermost electrons are now in shell 2.”", ok:true, why:"A whole shell is gone." },
          { t:"“" + ion("Na", "+") + " has more protons.”", why:"Same 11 protons." },
          { t:"“Positive ions are always heavier.”", why:"Losing an electron makes it lighter, not smaller for that reason." },
          { t:"“" + ion("Na", "+") + " has gained an electron.”", why:ion("Na", "+") + " has lost one." }] },
        b:{ prompt:"Which statement correctly explains why " + ion("Cl", "-") + " is larger than Cl?", options:[
          { t:"“" + ion("Cl", "-") + " has one more electron in shell 3 but the same 17 protons, so repulsion spreads the electrons out.”", ok:true, why:"Same protons, more electrons: more repulsion." },
          { t:"“" + ion("Cl", "-") + " has an extra shell.”", why:"The extra electron goes into 3p." },
          { t:"“" + ion("Cl", "-") + " has fewer protons.”", why:"Same 17." },
          { t:"“Negative ions lose electrons.”", why:ion("Cl", "-") + " gains one." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"Potassium reacts more vigorously with water than sodium does. Which explanation uses periodic trends correctly?", options:[
          { t:"“Potassium’s lower first ionization energy (419 vs 496 kJ/mol) means it gives up its outer electron more easily.”", ok:true, why:"Its outer electron is farther out and better shielded, so it leaves more easily." },
          { t:"“Potassium has more protons, so it holds its electron more tightly.”", why:M2 },
          { t:"“Potassium is smaller.”", why:"It’s larger." },
          { t:"“Potassium is a nonmetal.”", why:"It’s an alkali metal." }] },
        b:{ prompt:"Fluorine is the most reactive nonmetal. Which explanation uses periodic trends correctly?", options:[
          { t:"“Fluorine has the highest electronegativity (3.98) and a small radius, so it attracts electrons very strongly.”", ok:true, why:"A high " + ZE + " acting over a short distance." },
          { t:"“Fluorine has the most electrons.”", why:"It has only 9." },
          { t:"“Fluorine has the lowest ionization energy.”", why:"It has one of the highest." },
          { t:"“Fluorine is the largest halogen.”", why:"It’s the smallest." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"Using the course electronegativity values, which pair forms the most ionic bond?", options:[
          { t:"K and F (ΔEN 3.16)", ok:true, why:"Lowest EN with highest EN." },
          { t:"Na and Cl (2.23)", why:"Ionic, but less so." },
          { t:"Mg and O (2.13)", why:"Ionic, but less so." },
          { t:"C and F (1.43)", why:"Polar covalent." }] },
        b:{ prompt:"Using the course electronegativity values, which bond is least polar?", options:[
          { t:"C–H (ΔEN 0.35)", ok:true, why:"The smallest difference: 2.55 − 2.20 = 0.35." },
          { t:"C–O (0.89)", why:"3.44 − 2.55 = 0.89: more polar than C–H." },
          { t:"H–Cl (0.96)", why:"3.16 − 2.20 = 0.96: more polar than C–H." },
          { t:"O–H (1.24)", why:"3.44 − 2.20 = 1.24: the most polar of these." }] } }
    ]
  },
  task:{
    title:"Ionic pair poster", summary:"Ionic pair poster",
    statement:"<p>Choose two elements X and Y for a poster showing a period trend and an ionic bond. Can you find all the pairs that work?</p><ol class=\"tr-conds\"><li>X and Y are in the same period.</li><li>X has the larger atomic radius.</li><li>Y has the higher first ionization energy.</li><li>The X–Y bond is mostly ionic: ΔEN > 1.7.</li></ol>",
    qX:"Element X", qY:"Element Y",
    checks:["Same period", "X is larger", "Y holds its electrons tighter", "Mostly ionic"],
    tips:["Use two cards from the same row.", "Radius falls across a period: X goes on the left.", "Watch the IE₁ dips: Al is below Mg.", "You need a big EN gap: a metal on the left with a nonmetal far to the right."],
    explainPrompt:"Explain why X is larger and holds its electrons less tightly than Y, using " + ZE + ".",
    vocab:"Use the words effective nuclear charge, shell, ionization energy and electronegativity.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:6,
    after3:"Notice that Na with S misses by a little (1.65), and Al with Cl (1.55) too. The ionic cut-off is a model line, and real bonding is a continuum."
  },
  cards:[
    ["Effective nuclear charge", "The net pull on valence electrons. Simple model: " + ZE + " ≈ " + Z + " − core electrons (Cl: 17 − 10 = 7)."],
    ["Shielding", "Inner electrons reduce the pull of the nucleus on outer electrons."],
    ["Atomic radius trend", "Decreases across a period; increases down a group."],
    ["Ionization energy", "The energy to remove an electron from a gaseous atom. IE₁ increases across and decreases down."],
    ["Electronegativity", "The pull of an atom on shared electrons. Highest at F (3.98); increases across, decreases down."],
    ["Electron affinity", "The energy change when an atom gains an electron; generally more negative across a period."],
    ["IE₁ dips", "B < Be (2p is higher in energy than 2s); O < N (the paired 2p electron repels)."],
    ["Cation size", "Smaller than the atom (" + ion("Na", "+") + " 102 pm vs Na 186 pm)."],
    ["Anion size", "Larger than the atom (" + ion("Cl", "-") + " 181 pm vs Cl 100 pm)."],
    ["Isoelectronic series", "Same electrons; more protons means smaller (" + ion("N", "3-") + " > " + ion("O", "2-") + " > " + ion("F", "-") + " > " + ion("Na", "+") + " > " + ion("Mg", "2+") + ")."],
    ["Successive IEs", "A big jump marks the first core electron; the electrons before the jump are the valence electrons."],
    ["Reactivity link", "Metals with low IE₁ react more readily; nonmetals with high EN gain electrons more readily."]
  ]
};
