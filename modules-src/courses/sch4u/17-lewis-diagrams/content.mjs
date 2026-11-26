// SCH4U 17 Lewis Diagrams. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/17-lewis-diagrams.md
// The Lewis builder (Explore), the formal-charge stations (Part 3), the count-and-build builder and the task's live
// diagram are drawn by app.js, which also holds the species data (atoms, charges) and the structures for Station 2.

const SUP = (s) => "<sup>" + s + "</sup>", SUB = (s) => "<sub>" + s + "</sub>";
const CO3 = "CO" + SUB(3) + SUP("2−"), NO3 = "NO" + SUB(3) + SUP("−"), NO2 = "NO" + SUB(2) + SUP("−"), NH4 = "NH" + SUB(4) + SUP("+");
const O3 = "O" + SUB(3), SF6 = "SF" + SUB(6), CO2 = "CO" + SUB(2), N2O = "N" + SUB(2) + "O", OCN = "OCN" + SUP("−");
const H3O = "H" + SUB(3) + "O" + SUP("+"), CH2O = "CH" + SUB(2) + "O", PCL5 = "PCl" + SUB(5);
const TA = ' <span class="tiny muted">(course table addition)</span>';

// Misconception core sentences (plan §3)
const M1 = "A negative charge means extra electrons: add 2 for " + CO3 + ". A positive charge means fewer: subtract 1 for " + NH4 + ".";
const M2 = "Lewis diagrams show only valence electrons: carbon brings 4, not 6.";
const M3 = "H forms only one bond, so it’s never central. The central atom is usually the least electronegative atom.";
const M4 = "Carbon, nitrogen and oxygen never exceed 8 valence electrons. Only atoms from period 3 on can expand.";
const M5 = "The real ion is a single blend: all three N–O bonds in nitrate are identical.";
const M5o = "The real molecule is a single blend: both O–O bonds in ozone are identical.";   // M5 applied to ozone
const M6 = "FC = valence − lone-pair electrons − (bonding electrons ÷ 2).";
const M7 = "If the central atom has fewer than 8, move an outer lone pair into a double bond.";

export default {
  id:"17-lewis-diagrams",
  kind:"topic",
  title:"Lewis diagrams",
  topic:"Lewis Diagrams",
  readyTopic:"Lewis diagrams",
  hero:{
    eq:'<span class="lw-heq"><span class="nw">' + CO3 + ":</span> <span class=\"nw\">4 + 3(6) + 2 = 24</span> valence electrons → <span class=\"nw\">one C=O</span> and <span class=\"nw\">two C–O" + SUP("−") + "</span>, with three resonance structures</span>",
    eqSize:"sm",
    eqLabel:"Carbonate, C O 3 2 minus: 4 plus 3 times 6 plus 2 equals 24 valence electrons, giving one C double bond O and two C single bond O minus, with three resonance structures",
    headline:"Count, connect, complete",
    text:"A <strong>Lewis diagram</strong> shows where every <strong>valence electron</strong> sits: in <strong>bonds</strong> or in <strong>lone pairs</strong>. Count the electrons, connect the atoms, complete the octets. When there’s a choice, <strong>formal charge</strong> picks the best structure, and <strong>resonance</strong> describes molecules that no single diagram fits.",
    fig:{ html:'<div class="lw-hx"><svg class="lw-hx-svg" id="lw-hx-svg" viewBox="0 0 440 240" role="img" aria-label="An electron budget bar fills to 24. Carbonate’s skeleton appears: C in the centre with three O atoms. Single bonds draw in and lone pairs drop onto the O atoms until the bar is empty. Carbon flashes 6 electrons. A lone pair from the top O swings in to make C=O, and carbon shows 8. Formal charges appear: C 0, the double-bonded O 0, and −1 on each single-bonded O. The double bond slides to each O in turn, and the three structures merge into one blend with three identical dashed partial bonds."></svg><div class="lw-hx-row"><p class="lw-hx-cap" id="lw-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="lw-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can count the total valence electrons in a molecule or polyatomic ion.",
    "I can draw Lewis structures that follow the octet rule, including double and triple bonds.",
    "I can draw expanded-octet structures for central atoms from period 3 on, and recognize boron’s incomplete octet.",
    "I can calculate formal charges and use them to choose the best structure.",
    "I can draw resonance structures and describe what the real structure is like."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Valence electrons", goal:1,
          prompt:"How many valence electrons does a nitrogen atom have?",
          options:[
            { t:"5", ok:true, why:"Group 15: 2s² 2p³." },
            { t:"7", why:"7 is nitrogen’s atomic number." },
            { t:"3", why:"Nitrogen usually forms 3 bonds, but it has 5 valence electrons." },
            { t:"2", why:"Nitrogen is in period 2; it has 5 valence electrons." }],
          hints:["Valence electrons = outer shell.", "2s² 2p³.", "5."] },
        { id:"w2", skill:"Valence electrons", goal:1,
          prompt:"How many valence electrons are there in total in " + CO2 + "?",
          options:[
            { t:"16", ok:true, why:"4 + 2 × 6." },
            { t:"22", why:"22 adds atomic numbers (6 + 8 + 8)." },
            { t:"10", why:"That counts only one oxygen." },
            { t:"12", why:"Each O brings 6, not 4." }],
          hints:["C brings 4; each O brings 6.", "4 + 6 + 6.", "16."] },
        { id:"w3", skill:"Ions and charge", goal:1,
          prompt:"How does the number of electrons in Cl" + SUP("−") + " compare with a neutral Cl atom?",
          options:[
            { t:"One more", ok:true, why:"The 1− charge means one extra electron." },
            { t:"One fewer", why:"A negative ion has gained an electron." },
            { t:"The same", why:"The charge comes from the extra electron." },
            { t:"Seven more", why:"Only one electron is gained." }],
          hints:["What does a negative charge mean?", "More electrons than protons.", "One more."] },
        { id:"w4", skill:"Ions and charge", goal:1,
          prompt:"How many valence electrons does the hydroxide ion, OH" + SUP("−") + ", have?",
          options:[
            { t:"8", ok:true, why:"6 + 1 + 1 for the charge." },
            { t:"7", why:"Add 1 for the 1− charge." },
            { t:"6", why:"H contributes 1, and the charge adds 1." },
            { t:"9", why:"Only one extra electron for a 1− charge." }],
          hints:["O 6, H 1.", "Add one for the negative charge.", "8."] },
        { id:"w5", skill:"Electronegativity", goal:2,
          prompt:"Using the course table, which of C, N, O and F has the lowest electronegativity?",
          use:"Course table (Pauling): C 2.55 · N 3.04 · O 3.44 · F 3.98",
          options:[
            { t:"C (2.55)", ok:true, why:"Electronegativity rises across period 2." },
            { t:"F (3.98)", why:"Fluorine has the highest." },
            { t:"O (3.44)", why:"Oxygen is second highest." },
            { t:"N (3.04)", why:"N is higher than C." }],
          hints:["Look up the four values.", "C 2.55, N 3.04, O 3.44, F 3.98.", "C."] },
        { id:"w6", skill:"Electronegativity", goal:4,
          prompt:"In a C–O bond, which atom pulls the shared electrons more strongly?",
          options:[
            { t:"O", ok:true, why:"3.44 > 2.55." },
            { t:"C", why:"Carbon’s value is lower." },
            { t:"Both equally", why:"Their values differ by 0.89." },
            { t:"Neither; covalent bonds share equally", why:"Only identical atoms share exactly equally." }],
          hints:["Compare electronegativities.", "O 3.44, C 2.55.", "O."] }
      ],
      refreshers:{
        "Valence electrons":"Main-group atoms: the group’s last digit (C 4, N 5, O 6, halogens 7, noble gases 8). Add them up for the molecule.",
        "Ions and charge":"Negative ion: add 1 electron per unit of charge. Positive ion: subtract.",
        "Electronegativity":"How strongly an atom pulls bonding electrons. It rises across a period and falls down a group. Use the course table."
      }
    }
  },
  explore:{
    heading:"Lewis builder",
    intro:"Build each species from its electron budget. The builder checks every octet and every formal charge as you go.",
    how:"Pick a species and a mode. Choose <strong>Make central</strong> and tap an atom, then use <strong>Bond</strong> (tap two atoms; tap them again to raise the bond to double, then triple) and <strong>Lone pair</strong> (tap an atom). <strong>Remove</strong> takes away one lone pair or one bond pair. Keyboard: Tab moves between atoms; B starts a bond to the next atom you choose; L adds a lone pair; Delete removes.",
    species:["h2o", "nh3", "ch4", "co2", "hcn", "ch2o", "n2", "nh4", "h3o", "oh", "co3", "no3", "no2", "o3", "bf3", "pcl5", "sf4", "sf6", "clf3", "xef2", "ocn"],
    modes:[{ id:"build", t:"Build" }, { id:"guided", t:"Guided" }, { id:"res", t:"Resonance" }],
    tools:[{ id:"central", t:"Make central" }, { id:"bond", t:"Bond" }, { id:"lp", t:"Lone pair" }, { id:"remove", t:"Remove" }],
    steps:[
      "Count the total valence electrons, adding one for each negative charge and subtracting one for each positive charge.",
      "Choose the central atom: usually the least electronegative, and never H.",
      "Join the atoms with single bonds.",
      "Complete the octets of the outer atoms.",
      "Put any leftover electrons on the central atom.",
      "If the central atom is still short of an octet, turn outer lone pairs into double or triple bonds."
    ],
    resHow:"Tap a double bond, then another bonded atom, to move it. <strong>Show each structure</strong> steps through the equivalent structures; <strong>Blend</strong> shows the real species.",
    predictions:[
      { id:"p1", prompt:"All 16 electrons are placed, but carbon has only 4. What fixes it?",
        options:[{ t:"Move a lone pair from each O into a double bond", ok:true }, { t:"Add 4 more electrons to carbon" }, { t:"Give carbon two lone pairs" }, { t:"Nothing: carbon is fine with 4" }],
        explain:"The budget is fixed at 16. Sharing more pairs gives carbon its octet without adding electrons." },
      { id:"p2", prompt:"How many valence electrons does " + NH4 + " have?",
        options:[{ t:"8", ok:true }, { t:"9" }, { t:"10" }, { t:"11" }],
        explain:"Subtract one electron for the 1+ charge. 9 forgets the charge; 10 adds instead of subtracting; 11 uses nitrogen’s atomic number." },
      { id:"p3", prompt:"How many equivalent resonance structures does nitrate have?",
        options:[{ t:"3", ok:true }, { t:"1" }, { t:"2" }, { t:"4" }],
        explain:"Nitrate isn’t switching between the three. It is one structure with identical bonds." },
      { id:"p4", prompt:"How many electrons surround sulfur in " + SF6 + "?",
        options:[{ t:"12", ok:true }, { t:"8" }, { t:"6" }, { t:"48" }],
        explain:"Sulfur is in period 3, and atoms from period 3 on can hold more than 8. A carbon atom could never do this." }
    ],
    predIntro:"Each prediction sets up the builder. Choose an answer, then watch the builder show what happens.",
    chalIntro:"Build each species in the Lewis builder, then press <strong>Check challenge</strong>. The builder remembers every species, so you can switch back and forth. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, sp:"ch2o",
        prompt:"Build methanal (" + CH2O + ") with every atom satisfied and all 12 electrons used.",
        why:"Carbon in the centre with two C–H bonds and C=O; O keeps two lone pairs. Every octet is full and every formal charge is 0.",
        hints:["Count: 4 + 2 + 6 = 12.", "Skeleton: H–C(–H)–O; complete O’s octet.", "Carbon is short by 2, so make C=O; O keeps two lone pairs."] },
      { id:"tc2", goal:1, sp:"co3",
        prompt:"Build the carbonate ion with formal charges that add up to the ion’s charge.",
        why:"One C=O and two C–O with three lone pairs each: 24 electrons, and the formal charges 0 + 0 − 1 − 1 add up to −2, the ion’s charge.",
        hints:["24 electrons.", "Three single bonds and full O octets use 24, but C has only 6.", "One O lends a pair: C=O. The two single-bonded O atoms carry −1 each."] },
      { id:"tc3", goal:4, sp:"ocn", stretch:true,
        prompt:"The cyanate ion, " + OCN + " (C in the centre), can be drawn three ways. Build the one with the best formal charges.",
        why:"[O–C≡N]" + SUP("−") + ": O −1, C 0, N 0. Only one atom is charged, and the −1 sits on oxygen, the most electronegative atom.",
        hints:["Count: 6 + 4 + 5 + 1 = 16.", "Build all three bond patterns and turn on formal charges.", "Two of them have one −1; choose the one that puts it on oxygen."] }
    ],
    msgs:{
      tc1:{ single:"Carbon has only 6. Make a double bond.", ocentre:"Carbon is less electronegative. Put it in the centre." },
      tc2:{ e22:"Add 2 for the 2− charge.", twoDouble:"Carbon would have 10. Period-2 atoms stop at 8." },
      tc3:{ oddN:"Valid, but the −1 sits on N; O is more electronegative (3.44 vs 3.04), so the −1 belongs on O.",
        tripleO:"Large charges, and a positive charge on the most electronegative atom: the worst choice.",
        centre:"Carbon is the least electronegative, so it goes in the centre." },
      m1:M1, m2:M2, m3:M3, m4:M4, m7:M7
    },
    blocks:[
      { title:"The big idea", html:"<p>The electron count fixes everything. Formal charge chooses among valid options. Resonance is a blend, not a flip.</p>" }
    ]
  },
  part3:{
    slug:"formal-charge", name:"Best structure", heading:"Choose the best structure",
    intro:"Several structures can obey the octet rule. Here you calculate formal charges, compare candidate structures and check the choice against measured bond lengths.",
    s1:{ title:"Station 1: The formal-charge calculator",
      intro:"Pick a finished structure, then tap any atom to see its formal charge worked out. Each term lights up on the diagram as it’s counted.",
      list:["no3", "co3", "no2", "o3", "nh4", "ocn"] },
    s2:{ title:"Station 2: The three rules",
      intro:"Each pair obeys the octet rule. Tap the better structure, choose the rule that decides, then press <strong>Check</strong>.",
      rules:[
        { id:"r1", t:"Formal charges closest to 0" },
        { id:"r2", t:"Negative charge on the more electronegative atom" },
        { id:"r3", t:"Formal charges add up to the species’ charge" }],
      r3note:"Both structures add up to the species’ charge, so this rule can’t choose between them. It’s checked automatically below each pair.",
      pairs:[
        { id:"co2", sp:"co2", title:CO2 + ": O=C=O or O≡C–O?", show:["a", "b"], answer:{ best:"a", rule:"r1" },
          labels:{ a:"O=C=O", b:"O≡C–O" },
          wrongPick:"O≡C–O carries +1 and −1; O=C=O has every formal charge 0.",
          wrongRule:"Both structures have their negative charge, if any, on O. What decides is that O=C=O has no formal charges at all.",
          right:"O=C=O: every formal charge is 0, as close to 0 as possible." },
        { id:"n2o", sp:"n2o", title:N2O + " (N in the centre): N≡N–O or N=N=O?", show:["b", "a"], answer:{ best:"a", rule:"r2" },
          labels:{ a:"N≡N–O", b:"N=N=O" },
          wrongPick:"N=N=O puts the −1 on N. O is more electronegative (3.44 vs 3.04), so the −1 belongs on O.",
          wrongRule:"Both have one +1 and one −1, so they’re equally close to 0. Look at where the −1 sits.",
          right:"N≡N–O: the −1 sits on O, the most electronegative atom." },
        { id:"ocn", sp:"ocn", title:OCN + " (from challenge 3): O–C≡N or O=C=N?", show:["b", "a"], answer:{ best:"a", rule:"r2" },
          labels:{ a:"[O–C≡N]" + SUP("−"), b:"[O=C=N]" + SUP("−") },
          wrongPick:"Both have one −1. O=C=N puts it on N; O is more electronegative, so the −1 belongs on O.",
          wrongRule:"Both have a single −1, so they’re equally close to 0. Look at which atom carries it.",
          right:"O–C≡N: the −1 sits on O, the more electronegative atom." }
      ] },
    s3:{ title:"Station 3: Check it with data",
      intro:"Measured bond lengths are evidence for resonance. A double bond is shorter than a single bond between the same atoms.",
      table:{ head:["Bond", "Length (pm)"], rows:[["C–O (typical single)", "≈ 143"], ["C=O (typical double)", "≈ 120"], ["All three C–O in " + CO3, "≈ 129"], ["O–O (single)", "≈ 148"], ["O=O", "≈ 121"], ["Both O–O in " + O3, "≈ 128"]] },
      tableNote:"Approximate values (course table additions).",
      ask:"Drag the marker (or use the arrow keys) to the measured length from the table, then press <strong>Check</strong>.",
      scales:[
        { id:"co3", bond:"C–O", what:"each C–O bond in " + CO3, single:143, dbl:120, measured:129, order:"1⅓",
          done:"129 pm sits between a single C–O (143 pm) and a double C=O (120 pm). All three C–O bonds are the same blend, bond order about 1⅓. A flip between structures would give two different lengths." },
        { id:"o3", bond:"O–O", what:"each O–O bond in " + O3, single:148, dbl:121, measured:128, order:"1½",
          done:"128 pm sits between O–O (148 pm) and O=O (121 pm). Both bonds are the same blend, bond order about 1½." }
      ],
      wrong:"Read the measured length from the table: it’s the third value for this species." },
    quickCheck:{
      title:"Quick check", summary:"Best structure quick check",
      items:[
        { id:"q1", goal:4, prompt:"Formal charge on the single-bonded O in " + NO2 + "?",
          choices:[{ t:"−1", ok:true, fb:"Right. 6 − 6 − 1 = −1." }, { t:"0", fb:"6 − 6 − 1 = −1." }, { t:"+1", fb:"6 − 6 − 1 = −1." }, { t:"−2", fb:"6 − 6 − 1 = −1." }] },
        { id:"q2", goal:4, prompt:"Which rule decides between [O=C=N]" + SUP("−") + " and [O–C≡N]" + SUP("−") + "?",
          choices:[
            { t:"Negative charge on the more electronegative atom", ok:true, fb:"Right. Both have one −1. Put it on O." },
            { t:"Fewest bonds", fb:"Both have one −1. Put it on O." },
            { t:"Most lone pairs", fb:"Both have one −1. Put it on O." },
            { t:"Longest bonds", fb:"Both have one −1. Put it on O." }] },
        { id:"q3", goal:5, prompt:"What do the identical bond lengths in " + O3 + " show?",
          choices:[
            { t:"It’s a resonance blend", ok:true, fb:"Right. " + M5o },
            { t:"It flips between two structures", fb:M5o },
            { t:"It has two double bonds", fb:M5o },
            { t:"It has two single bonds", fb:M5o }] },
        { id:"q4", goal:4, prompt:"The formal charges in SO" + SUB(4) + SUP("2−") + " must add up to…",
          choices:[{ t:"−2", ok:true, fb:"Right. They always add up to the species’ charge." }, { t:"0", fb:"They always add up to the species’ charge." }, { t:"+2", fb:"They always add up to the species’ charge." }, { t:"−4", fb:"They always add up to the species’ charge." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"count", type:"custom", title:"Count and build", summary:"Count and build", goal:[1, 2, 3],
        instruction:"Enter the total valence electrons and the number of lone pairs on the central atom, then build the species to confirm.",
        how:"Type both numbers and press <strong>Check</strong>. Then press <strong>Build it</strong> to confirm in the builder below the list.",
        labels:{ ve:"Valence electrons", lp:"Lone pairs on the central atom" },
        general:{ ve:"Add each atom’s valence electrons, then adjust for any charge.", lp:"Subtract the bonding electrons and the outer atoms’ lone-pair electrons from the total. Pairs left over go on the centre." },
        items:[
          { id:"c1", sp:"h2o", goal:1, answer:[8, 2], wrong:[{ ve:10, fb:"Use valence electrons, not atomic numbers." }],
            hints:["O 6 + 2 × H 1.", "Two O–H bonds use 4; H atoms need no lone pairs.", "8 − 4 = 4 left: two lone pairs on O."] },
          { id:"c2", sp:"nh3", goal:1, answer:[8, 1],
            hints:["N 5 + 3 × H 1.", "Three N–H bonds use 6.", "8 − 6 = 2 left: one lone pair on N."] },
          { id:"c3", sp:"hcn", goal:2, answer:[10, 0], note:"(on C)", wrong:[{ ve:16, fb:M2 }],
            hints:["H 1 + C 4 + N 5.", "H–C and C–N use 4; N takes 6 as lone pairs, so C has only 4.", "Two N pairs move in to make C≡N: no lone pairs on C, one on N."] },
          { id:"c4", sp:"co3", goal:1, answer:[24, 0], wrong:[{ ve:22, fb:M1 }],
            hints:["C 4 + 3 × O 6, plus 2 for the 2− charge.", "Three bonds use 6; each O needs 6 more (18).", "24 − 6 − 18 = 0: none left for C. C has only 6, so one O lends a pair (C=O). No lone pairs on C."] },
          { id:"c5", sp:"nh4", goal:1, answer:[8, 0], wrong:[{ ve:10, fb:M1 }],
            hints:["N 5 + 4 × H 1, minus 1 for the 1+ charge.", "Four N–H bonds use 8.", "8 − 8 = 0: no lone pairs on N."] },
          { id:"c6", sp:"bf3", goal:3, answer:[24, 0], note:"(B has 6)", wrong:[{ lp:1, fb:"Boron is stable with 6 here; don’t force a double bond." }],
            lpfb:"Boron is stable with 6 here; don’t force a double bond.",
            hints:["B 3 + 3 × F 7.", "Three bonds use 6; each F needs 6 more (18).", "24 − 6 − 18 = 0: no lone pairs on B. Boron is stable with 6 here."] },
          { id:"c7", sp:"sf4", goal:3, answer:[34, 1], wrong:[{ lp:0, fb:"34 − 8 (bonds) − 24 (F lone pairs) = 2 left: one pair on S." }],
            hints:["S 6 + 4 × 7.", "Four bonds use 8; each F needs 6 more.", "34 − 8 − 24 = 2: one lone pair on S."] },
          { id:"c8", sp:"xef2", goal:3, answer:[22, 3], wrong:[{ lp:1, fb:"22 − 4 − 12 = 6: three pairs on Xe." }],
            hints:["Xe 8 + 2 × F 7.", "Two bonds use 4; each F needs 6 more (12).", "22 − 4 − 12 = 6: three lone pairs on Xe."] }
        ] },
      { id:"best", type:"custom", title:"Which structure is best?", summary:"Which structure is best?", star:true, goal:[3, 4, 5],
        instruction:"Six items. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Tap a choice, then press <strong>Check</strong>.",
        items:[
          { id:"r1", goal:3, prompt:"Lone pairs on Cl in ClF" + SUB(3) + "?",
            options:[{ t:"2", ok:true, why:"28 − 6 − 18 = 4: two pairs." }, { t:"1", why:"28 − 6 − 18 = 4: two pairs." }, { t:"0", why:"28 − 6 − 18 = 4: two pairs." }, { t:"3", why:"28 − 6 − 18 = 4: two pairs." }],
            hints:["Cl 7 + 3 × F 7 = 28.", "Three bonds use 6; the F atoms’ lone pairs use 18.", "28 − 6 − 18 = 4: two lone pairs on Cl."] },
          { id:"r2", goal:5, prompt:"Resonance structures for " + O3 + "?",
            options:[{ t:"2", ok:true, why:"The double bond can sit on either side." }, { t:"1", why:"The double bond can sit on either side." }, { t:"3", why:"Only the two end atoms can carry the double bond." }, { t:"4", why:"Only the two end atoms can carry the double bond." }],
            hints:["Ozone has 18 electrons: O=O–O.", "Which O atoms could carry the double bond?", "Either end: 2 structures."] },
          { id:"r3", goal:4, star:true, prompt:"Formal charge on N in " + NO3 + "?",
            options:[{ t:"+1", ok:true, why:"5 − 0 − 8 ÷ 2 = +1." }, { t:"0", why:M6 + " 5 − 0 − 8 ÷ 2." }, { t:"−1", why:M6 + " 5 − 0 − 8 ÷ 2." }, { t:"+2", why:M6 + " 5 − 0 − 8 ÷ 2." }],
            hints:["N has 5 valence electrons.", "In nitrate N has no lone pairs and four bonding pairs (8 electrons).", "5 − 0 − 8 ÷ 2 = +1."] },
          { id:"r4", goal:5, star:true, prompt:"Nitrite (" + NO2 + "): how many lone pairs on N, and how many resonance structures?",
            options:[{ t:"1 lone pair; 2 structures", ok:true, why:"18 electrons: O=N–O" + SUP("−") + " with one pair on N; the double bond can sit on either O." },
              { t:"0 lone pairs; 2 structures", why:"18 electrons: O=N–O" + SUP("−") + " with one pair on N; the double bond can sit on either O." },
              { t:"1 lone pair; 1 structure", why:"18 electrons: O=N–O" + SUP("−") + " with one pair on N; the double bond can sit on either O." },
              { t:"2 lone pairs; 2 structures", why:"18 electrons: O=N–O" + SUP("−") + " with one pair on N; the double bond can sit on either O." }],
            hints:["Count: 5 + 2 × 6 + 1 = 18.", "Two bonds and full O octets use 16; 2 left go on N, which then has 6.", "One O lends a pair: O=N–O" + SUP("−") + ", one lone pair on N, and the double bond can sit on either O."] },
          { id:"r5", goal:5, star:true, prompt:"<strong>Investigation:</strong> Both N–O bonds in nitrite measure ≈ 124 pm, between N–O (≈ 140 pm) and N=O (≈ 120 pm)." + TA + " Which conclusion does the evidence support?",
            options:[{ t:"The bonds are identical, a resonance blend", ok:true, why:"One length between single and double: each bond is the same blend." },
              { t:"One single and one double", why:"That predicts two different lengths, but the data show one." },
              { t:"The ion flips between two structures", why:M5 }],
            hints:["How many different lengths were measured?", "One length, partway between single and double.", "Both bonds are the same blend: a resonance hybrid."] },
          { id:"r6", goal:4, star:true, prompt:"HCN or HNC: which arrangement has every formal charge 0?",
            options:[{ t:"HCN", ok:true, why:"In H–C≡N, C is 4 − 0 − 4 = 0 and N is 5 − 2 − 3 = 0." }, { t:"HNC", why:"In H–N≡C, N is +1 and C is −1." }],
            hints:["Both have 10 electrons with a triple bond.", "Compute the formal charges for H–C≡N.", "C: 4 − 2 − 3 = −1 in HNC; in HCN, C is 4 − 0 − 4 = 0 and N is 5 − 2 − 3 = 0."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Ingrid", how:"", goal:[1, 2, 4],
        instruction:"Ingrid made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:1, task:"Draw the Lewis structure of the hydronium ion, " + H3O + ".",
            steps:["Valence electrons: 6 + 3 + 1 = 10, adding 1 for the positive charge.", "Three O–H bonds use 6 electrons.", "The remaining 4 go on O as two lone pairs.", "O has 10 electrons, which is fine."],
            answer:0,
            stepFb:["", "Step 2 is fine on its own; the count before it is wrong.", "Step 3 follows the wrong count.", "Step 4 follows the earlier mistake."],
            fixes:[
              { t:"Subtract 1 for the 1+ charge: 6 + 3 − 1 = 8, so O has three bonds and one lone pair.", ok:true, why:"8 electrons: three O–H bonds use 6, and the last 2 make one lone pair on O." },
              { t:"Add 3 more for the three H atoms.", why:"They’re already counted." },
              { t:"Use oxygen’s atomic number, 8.", why:M2 },
              { t:"Step 1 is correct.", why:M1 }],
            hints:["Does a positive ion have more or fewer electrons?", "Fewer.", "8 electrons: one lone pair on O."] },
          { id:"e2", goal:2, task:"Draw HCN.",
            steps:["Valence electrons: 1 + 4 + 5 = 10.", "Skeleton H–C–N with single bonds uses 4.", "Put 6 electrons on N as lone pairs: N has 8.", "All 10 electrons are used, so the structure is done, even though C has 4."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Move two N lone pairs into the C–N bond: H–C≡N with one lone pair on N, so both C and N have 8.", ok:true, why:"Two more shared pairs give C its octet, and the budget stays at 10." },
              { t:"Add 4 electrons to C.", why:"The budget is fixed at 10." },
              { t:"Put a lone pair on H.", why:"H holds only 2 electrons." },
              { t:"Step 4 is correct.", why:M7 }],
            hints:["Does carbon have an octet?", "No: 4.", "Make a triple bond."] },
          { id:"e3", goal:4, task:"Choose the better structure for " + CO2 + ": O=C=O or O≡C–O.",
            steps:["Both use 16 electrons, and every atom has an octet.", "In O=C=O, every formal charge is 0.", "In O≡C–O, the formal charges are +1, 0 and −1.", "Both add up to 0, so they’re equally good."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"Adding up to the charge is required, but the best structure has formal charges closest to 0 on every atom: O=C=O.", ok:true, why:"Every formal charge in O=C=O is 0, so it’s the better structure." },
              { t:"O≡C–O is better because triple bonds are stronger.", why:"Bond strength isn’t the rule." },
              { t:"Neither is valid.", why:"Both obey the octet rule." },
              { t:"Step 4 is correct.", why:M6 }],
            hints:["What’s the first formal-charge rule?", "Keep each charge as close to 0 as possible.", "O=C=O."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result surprised you most: the 1+ charge removing an electron, the triple bond in HCN, or sulfur holding 12?" },
      { id:"j2", q:"In your own words, why can sulfur expand its octet when oxygen can’t?" },
      { id:"j3", q:"Explain to a friend how formal charge helps you choose between two Lewis structures." },
      { id:"j4", q:"What part of drawing Lewis structures still slows you down? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"How many valence electrons does the nitrate ion, " + NO3 + ", have in total?", options:[
          { t:"24", ok:true, why:"5 + 3 × 6 + 1." },
          { t:"23", why:"Add 1 for the 1− charge." },
          { t:"22", why:"A negative charge adds electrons; it doesn’t subtract them." },
          { t:"32", why:"That uses atomic numbers (7 + 24) plus 1." }] },
        b:{ prompt:"How many valence electrons does the phosphate ion, PO" + SUB(4) + SUP("3−") + ", have in total?", options:[
          { t:"32", ok:true, why:"5 + 4 × 6 + 3." },
          { t:"29", why:"Add 3 for the 3− charge." },
          { t:"26", why:"Adding, not subtracting." },
          { t:"50", why:"Atomic numbers (15 + 32) plus 3." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which molecule has an expanded octet on its central atom?", options:[
          { t:PCL5, ok:true, why:"Phosphorus (period 3) holds 10." },
          { t:"NF" + SUB(3), why:"Nitrogen (period 2) has exactly 8." },
          { t:"CF" + SUB(4), why:"Carbon has 8." },
          { t:"OF" + SUB(2), why:"Oxygen has 8." }] },
        b:{ prompt:"Which molecule has a central atom with fewer than 8 electrons?", options:[
          { t:"BF" + SUB(3), ok:true, why:"Boron has 6." },
          { t:"NH" + SUB(3), why:"Nitrogen has 8 (three bonds and a lone pair)." },
          { t:"CH" + SUB(4), why:"Carbon has 8." },
          { t:"H" + SUB(2) + "O", why:"Oxygen has 8." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"How many equivalent resonance structures does the carbonate ion have?", options:[
          { t:"3", ok:true, why:"The double bond can sit on any of the three O atoms." },
          { t:"1", why:"Three equivalent placements exist." },
          { t:"2", why:"There are three O atoms." },
          { t:"4", why:"Only three oxygens can carry it." }] },
        b:{ prompt:"How many equivalent resonance structures does ozone have?", options:[
          { t:"2", ok:true, why:"The double bond can sit on either end." },
          { t:"1", why:"Two placements exist." },
          { t:"3", why:"Only the two end atoms can carry it." },
          { t:"4", why:"There are only two O–O bonds." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"In the best structure of ozone (O=O–O), what are the formal charges on the central O, the double-bonded O and the single-bonded O?", options:[
          { t:"+1, 0, −1", ok:true, why:"Central: 6 − 2 − 3 = +1; double-bonded: 6 − 4 − 2 = 0; single-bonded: 6 − 6 − 1 = −1." },
          { t:"0, 0, 0", why:"Count each lone-pair electron, and half of each bond’s electrons." },
          { t:"−1, 0, +1", why:"Swapped: the central O has only one lone pair." },
          { t:"+2, 0, −2", why:"Use half the bonding electrons, not all of them." }] },
        b:{ prompt:"In the best structure of nitrite (O=N–O" + SUP("−") + "), what are the formal charges on N, the double-bonded O and the single-bonded O?", options:[
          { t:"0, 0, −1", ok:true, why:"N: 5 − 2 − 3 = 0; O(=): 6 − 4 − 2 = 0; O(–): 6 − 6 − 1 = −1." },
          { t:"0, 0, 0", why:"They must add up to −1." },
          { t:"−1, 0, 0", why:"N has one lone pair and three bonds, so its formal charge is 0." },
          { t:"+1, 0, −2", why:"The single-bonded O is 6 − 6 − 1." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which is the best Lewis structure of " + N2O + " (N in the centre)?", options:[
          { t:"N≡N–O, with formal charges 0, +1, −1", ok:true, why:"The negative charge sits on O, the most electronegative atom." },
          { t:"N=N=O, with −1, +1, 0", why:"Valid, but the −1 sits on N instead of O." },
          { t:"N–N≡O, with −2, +1, +1", why:"Large charges, and + on O." },
          { t:"N=O=N, with O in the centre", why:"The most electronegative atom shouldn’t be central." }] },
        b:{ prompt:"Which is the best Lewis structure of the cyanate ion, " + OCN + "?", options:[
          { t:"[O–C≡N]" + SUP("−") + ", with formal charges −1, 0, 0", ok:true, why:"The −1 sits on O." },
          { t:"[O=C=N]" + SUP("−") + ", with 0, 0, −1", why:"Valid, but the −1 is on the less electronegative N." },
          { t:"[O≡C–N]" + SUP("−") + ", with +1, 0, −2", why:"Large charges." },
          { t:"[O–N≡C]" + SUP("−") + ", with N in the centre", why:"Carbon, the least electronegative, belongs in the centre." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"How many lone pairs are on the central atom of XeF" + SUB(4) + "?", options:[
          { t:"2", ok:true, why:"8 + 28 = 36; 4 bonds (8) and 24 for the F atoms leave 4, or two pairs." },
          { t:"0", why:"Xenon can hold more than 8." },
          { t:"1", why:"36 − 8 − 24 = 4 electrons, which is two pairs." },
          { t:"4", why:"4 is the number of electrons left, not pairs." }] },
        b:{ prompt:"How many lone pairs are on the central atom of ICl" + SUB(4) + SUP("−") + "?", options:[
          { t:"2", ok:true, why:"7 + 28 + 1 = 36; 36 − 8 − 24 = 4, or two pairs." },
          { t:"1", why:"Add 1 for the charge: 36, not 35." },
          { t:"0", why:"Iodine expands." },
          { t:"3", why:"Four electrons remain: two pairs." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which statement best describes the real structure of the nitrate ion?", options:[
          { t:"“It is one structure in which all three N–O bonds are identical, partway between single and double.”", ok:true, why:M5 },
          { t:"“It switches rapidly among three structures.”", why:M5 },
          { t:"“It has one N=O and two N–O bonds that never change.”", why:"The measured bonds are identical." },
          { t:"“It has three N=O double bonds.”", why:"Nitrogen would have 12." }] },
        b:{ prompt:"Which statement best describes the real structure of ozone?", options:[
          { t:"“It is one structure with two identical O–O bonds, partway between single and double.”", ok:true, why:M5o },
          { t:"“It flips between two structures.”", why:M5o },
          { t:"“It has one O=O and one O–O that differ in length.”", why:"The measured lengths are equal." },
          { t:"“It has two O=O double bonds.”", why:"The central O would have 10." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which description of HCN’s Lewis structure is correct?", options:[
          { t:"“H–C≡N, with one lone pair on N.”", ok:true, why:"C and N each have 8, H has 2, and every formal charge is 0." },
          { t:"“H–C=N, with two lone pairs on N.”", why:"Carbon would have only 6." },
          { t:"“H–N≡C, with one lone pair on C.”", why:"This puts the wrong atom in the centre." },
          { t:"“H=C≡N.”", why:"H forms only one bond." }] },
        b:{ prompt:"Which description of methanal’s (" + CH2O + "’s) Lewis structure is correct?", options:[
          { t:"“C in the centre with two C–H bonds and a C=O, and two lone pairs on O.”", ok:true, why:"Every atom has its octet (H 2), and every formal charge is 0." },
          { t:"“C–O single bond, with three lone pairs on O.”", why:"Carbon would have 6." },
          { t:"“O in the centre, bonded to C and to an H.”", why:M3 },
          { t:"“C≡O, with one lone pair on O.”", why:"Carbon would have 10." }] } },
      { id:"a1", cat:"A", goal:3,
        // VERIFY: SF6's greenhouse-gas status and how utilities track leaks (plan §6 item 5).
        a:{ prompt:"Sulfur hexafluoride (" + SF6 + ") insulates high-voltage equipment. It’s also a very strong greenhouse gas, so utilities track leaks. How many electrons surround S, and why is that possible?", options:[
          { t:"12; sulfur is in period 3 and can expand its octet", ok:true, why:"Six S–F bonds hold 12 electrons, and period-3 atoms can exceed 8." },
          { t:"8; the octet rule always applies", why:"Period-3 atoms can exceed 8." },
          { t:"12; any atom can expand its octet", why:"Period-2 atoms can’t." },
          { t:"6; sulfur has 6 valence electrons", why:"It shares six bonds: 12 electrons." }] },
        b:{ prompt:"Phosphorus pentachloride (" + PCL5 + ") is used to make other phosphorus compounds. How many electrons surround P, and why is that possible?", options:[
          { t:"10; phosphorus is in period 3 and can expand its octet", ok:true, why:"Five P–Cl bonds hold 10 electrons, and period-3 atoms can exceed 8." },
          { t:"8; the octet rule always applies", why:"Period-3 atoms can exceed 8." },
          { t:"10; any atom can expand its octet", why:M4 },
          { t:"5; phosphorus has 5 valence electrons", why:"Five bonds hold 10 electrons." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A chemist finds both N–O bonds in the nitrite ion measure ≈ 124 pm, between a typical N–O (≈ 140 pm) and N=O (≈ 120 pm)." + TA + " Which conclusion fits?", options:[
          { t:"Nitrite is a resonance blend, so its two bonds are identical", ok:true, why:"One length between single and double: the same blend in both bonds." },
          { t:"One bond is double and one is single", why:"That predicts two different lengths." },
          { t:"Nitrite has two N=O double bonds", why:"N would have 10." },
          { t:"It’s an error; the two bonds must differ", why:"The data agree with the resonance model." }] },
        b:{ prompt:"Both O–O bonds in ozone measure ≈ 128 pm, between O–O (≈ 148 pm) and O=O (≈ 121 pm)." + TA + " Which conclusion fits?", options:[
          { t:"Ozone is a resonance blend, so its two bonds are identical", ok:true, why:M5o },
          { t:"One bond is double and one is single", why:"That predicts two lengths." },
          { t:"Ozone has two double bonds", why:"The central O would have 10." },
          { t:"It’s an error", why:M5o }] } }
    ]
  },
  task:{
    title:"One lone pair, room to spare", summary:"One lone pair, room to spare",
    statement:"<p>Design a fluoride molecule or ion AF<sub><i>n</i></sub> (with charge −1, 0 or +1) that meets every condition. Can you find all the answers?</p><ol class=\"lw-conds\"><li>The total number of valence electrons is even.</li><li>The central atom has exactly one lone pair.</li><li>The central atom has more than 8 electrons around it.</li><li>It follows the expansion rule: only atoms from period 3 on expand, and never beyond 12 electrons.</li></ol>",
    inputs:{ centre:"Central atom", n:"Number of F atoms", q:"Charge", centres:["B", "C", "N", "O", "P", "S", "Cl", "Xe"] },
    checks:["Even electron count", "Exactly one lone pair on the centre", "More than 8 around the centre", "Expansion rule"],
    tips:["An odd count would leave an unpaired electron.", "Lone-pair electrons on the centre = V − <i>n</i> − charge; you need 2.", "With one lone pair, more than 8 means at least 4 F atoms.", "B, C, N and O are period-2 atoms; they can’t exceed 8. Nothing goes past 12 here."],
    explainPrompt:"Explain how you used the electron count to get exactly one lone pair, and why your central atom can hold more than 8.",
    vocab:"Use the words valence electrons, lone pair, expanded octet and period 3.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:6,
    after3:"Every answer satisfies <i>n</i> = V − 2 − charge. Some (PF<sub>4</sub><sup>−</sup>, ClF<sub>4</sub><sup>+</sup>) are rare in the lab, but they all follow the rules. In module 18 you’ll see they make seesaw or square pyramidal shapes."
  },
  cards:[
    ["Valence electron count", "Add the group electrons; add 1 per negative charge, subtract 1 per positive charge."],
    ["Central atom", "Usually the least electronegative atom; never H."],
    ["Order of steps", "Count → skeleton → outer octets → leftovers on the centre → multiple bonds if needed."],
    ["Short octet on the centre", "Move an outer lone pair into a double (or triple) bond."],
    ["Expanded octet", "Central atoms from period 3 on can hold 10 or 12 (" + PCL5 + ", " + SF6 + ")."],
    ["Period-2 limit", "C, N, O and F never exceed 8."],
    ["Boron", "Often has only 6 (BF" + SUB(3) + ")."],
    ["Formal charge", "FC = valence − lone-pair electrons − ½ × bonding electrons."],
    ["Best structure", "FCs closest to 0; any negative FC on the most electronegative atom; FCs add up to the charge."],
    ["Resonance", "Equivalent structures for one species; the real species is one blend."],
    ["Evidence for resonance", "Identical bond lengths between single and double (" + CO3 + ": ≈ 129 pm)."],
    [NH4, "8 electrons, four N–H bonds, formal charge +1 on N."]
  ]
};
