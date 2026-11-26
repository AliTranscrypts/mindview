// SCH4U 26 Bond Energy. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/26-bond-energy.md
// The hero, Break and make (Explore), the fuel stations (Part 3) and the task's live diagram are drawn by app.js, which takes
// every bond energy from MV.chem.data.bond (799 for C=O in CO₂ from its bondNote) and every ΔH°f from MV.chem.data.dHf.

const DH = "Δ<i>H</i>", DHF = "Δ<i>H</i>°<sub>f</sub>";

// Misconception core sentences (plan §3)
const M1 = "Breaking a bond always takes energy in. The energy a fuel gives out comes from the stronger bonds that <strong>form</strong>.";
const M2 = DH + " ≈ Σ(broken) − Σ(formed). If more energy comes out than goes in, " + DH + " is negative.";
const M3 = "2H₂O means four O–H bonds: count every bond in every molecule.";
const M4 = "In CO₂, use 799 kJ/mol; the 745 value is for C=O in other molecules.";
const M5 = "Bond energies are averages from many compounds, and they apply to gases. Expect a close estimate, not an exact match.";
const M6 = "Per gram, divide by the molar mass. Hydrogen releases less per mole than methane but far more per gram.";
const M7 = "Count unchanged bonds on both sides or on neither; they cancel either way.";

// "Use these values" boxes (course bond-energy table, kJ/mol)
const U = (s) => s + " (kJ/mol)";
const U_H2O = U("H–H 436 · O=O 498 · O–H 463");
const U_NH3 = U("N≡N 945 · H–H 436 · N–H 391");
const U_ETH = U("C=C 614 · H–H 436 · C–C 347 · C–H 413");
const U_YNE = U("C≡C 839 · H–H 436 · C–C 347 · C–H 413");
const U_MCL = U("C–H 413 · Cl–Cl 243 · C–Cl 339 · H–Cl 432");
const ST = (s) => '<span class="be-st">Structures: ' + s + "</span>";

// Practice 1 items: [text, box, misplaced feedback]
const SORT = [
  ["Breaking the Cl–Cl bond", "in", "Breaking always takes energy in."],
  ["Forming an H–Cl bond", "out", "Forming always gives energy out."],
  ["2H(g) → H₂(g)", "out", "Atoms joining form a bond."],
  ["O₂(g) → 2O(g)", "in", "The O=O bond is broken."],
  ["Forming the C=O bonds in CO₂", "out", "Bond formation."],
  ["Breaking the C–H bonds in methane", "in", M1],
  ["H₂O(l) → H₂O(g)", "in", "Pulling molecules apart overcomes attractions: energy in."],
  ["Two Cl atoms joining", "out", "A bond forms."]
];
const BOXN = { in:"Energy absorbed", out:"Energy released" };
const sortItems = SORT.map((r, i) => ({ id:"s" + (i + 1), t:r[0], answer:r[1], goal:1,
  why:r[1] === "in" ? "Something is pulled apart: energy in." : "Something is joined: energy out.",
  wrong:{ [r[1] === "in" ? "out" : "in"]:r[2] },
  hints:["Is something being pulled apart or joined?", "Pulled apart → in; joined → out.", BOXN[r[1]] + "."] }));

export default {
  id:"26-bond-energy",
  kind:"topic",
  title:"Bond energy",
  topic:"Bond Energy",
  readyTopic:"bond energy",
  hero:{
    eq:'<span class="be-heq">' + DH + " ≈ Σ(bonds broken) − Σ(bonds formed)</span>",
    eqSize:"sm",
    eqLabel:"Delta H is approximately the sum of the bonds broken minus the sum of the bonds formed",
    headline:"Pull apart, then put together.",
    text:"Every reaction <strong>breaks</strong> some bonds and <strong>forms</strong> others. Breaking takes energy <strong>in</strong>; forming gives energy <strong>out</strong>. Add up the <strong>bond energies</strong> on each side, and the difference estimates the reaction’s <strong>enthalpy change</strong>.",
    fig:{ html:'<div class="be-hx"><svg class="be-hx-svg" id="be-hx-svg" viewBox="0 0 440 290" role="img" aria-label="An H₂ molecule and a Cl₂ molecule float in. An energy-in bar rises as both bonds snap: plus 436, then plus 243, 679 kJ in total. The four atoms pair up as two HCl molecules, and an energy-out bar drops: minus 432, then minus 432, 864 kJ in total. An orange ΔH arrow shows the difference: minus 185 kJ, more out than in."></svg><div class="be-hx-row"><p class="be-hx-cap" id="be-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="be-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can explain why breaking bonds absorbs energy and forming bonds releases energy.",
    "I can estimate Δ<i>H</i> for a gas-phase reaction using Δ<i>H</i> ≈ Σ(broken) − Σ(formed).",
    "I can count the bonds broken and formed from structural formulas and coefficients.",
    "I can work backwards from a known Δ<i>H</i> to find an unknown bond energy.",
    "I can explain why bond-energy estimates differ from table values, and use bond energies to compare fuels."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Counting bonds", goal:3,
          prompt:"How many C–H bonds are in one molecule of propane, C₃H₈?",
          options:[
            { t:"8", ok:true, why:"Each of the 8 hydrogens is bonded to a carbon." },
            { t:"10", why:"That adds the 2 C–C bonds." },
            { t:"3", why:"Count bonds, not atoms of carbon." },
            { t:"6", why:"Ethane has 6; propane has 8." }],
          hints:["Each H forms one bond.", "Propane has 8 H atoms.", "8 C–H bonds."] },
        { id:"w2", skill:"Counting bonds", goal:3,
          prompt:"Which bonds are in one CO₂ molecule?",
          options:[
            { t:"Two C=O double bonds", ok:true, why:"O=C=O gives carbon its octet." },
            { t:"Two C–O single bonds", why:"With two single bonds, carbon and both oxygens fall short of an octet." },
            { t:"One C≡O triple bond", why:"There are two oxygens." },
            { t:"One C=O and one C–O", why:"That leaves the single-bonded O short of an octet." }],
          hints:["Draw the Lewis diagram.", "Carbon needs 4 bonds.", "O=C=O."] },
        { id:"w3", skill:"Sign of ΔH", goal:1,
          prompt:"A reaction has " + DH + " = −92 kJ. What does the sign tell you?",
          options:[
            { t:"It is exothermic: energy is released to the surroundings", ok:true, why:"Negative " + DH + ": the system lost energy." },
            { t:"It is endothermic", why:"Negative " + DH + " means the system lost energy." },
            { t:"It is slow", why:DH + " says nothing about speed." },
            { t:"No energy change", why:DH + " ≠ 0." }],
          hints:[DH + " is the system’s change.", "Negative: the system lost energy.", "Exothermic."] },
        { id:"w4", skill:"Sign of ΔH", goal:1,
          prompt:"A cold pack feels cold when activated. Which describes the change inside it?",
          options:[
            { t:"Endothermic, " + DH + " > 0", ok:true, why:"It absorbs heat from your hand." },
            { t:"Exothermic, " + DH + " < 0", why:"Heat flows <strong>into</strong> the pack." },
            { t:"Endothermic, " + DH + " < 0", why:"Endothermic changes have positive " + DH + "." },
            { t:"Exothermic, " + DH + " > 0", why:"Signs are reversed." }],
          hints:["Which way does heat flow: into or out of the pack?", "Into the pack.", "Endothermic, positive " + DH + "."] },
        { id:"w5", skill:"Coefficients", goal:3,
          prompt:"In 2H₂(g) + O₂(g) → 2H₂O(g), how many H–H bonds are broken?",
          options:[
            { t:"2", ok:true, why:"Two H₂ molecules, one bond each." },
            { t:"1", why:"Multiply the bonds in one molecule by the molecule’s coefficient: 2H₂ means two H–H bonds." },
            { t:"4", why:"4 atoms, but 2 bonds." },
            { t:"3", why:"Only H₂ has H–H bonds." }],
          hints:["How many H₂ molecules?", "Two.", "2 bonds."] },
        { id:"w6", skill:"Coefficients", goal:3,
          prompt:"In the same reaction, how many O–H bonds are formed?",
          options:[
            { t:"4", ok:true, why:"Each H₂O has 2 O–H bonds, and there are 2 H₂O." },
            { t:"2", why:"Two molecules × two bonds." },
            { t:"1", why:"Water has two O–H bonds." },
            { t:"3", why:"2 × 2 = 4." }],
          hints:["How many O–H bonds in one water?", "Two.", "2 × 2 = 4."] }
      ],
      refreshers:{
        "Counting bonds":"Draw the structural formula. Count single, double and triple bonds separately; each double bond counts once as ‘C=O’, not as two singles.",
        "Sign of ΔH":"Exothermic: the system loses energy, so Δ<i>H</i> < 0. Endothermic: it gains energy, so Δ<i>H</i> > 0.",
        "Coefficients":"Multiply the bonds in one molecule by the molecule’s coefficient."
      }
    }
  },
  explore:{
    heading:"Break and make",
    intro:"Break the reactants’ bonds, then form the products’ bonds. Watch the energy go in and come out.",
    how:"Choose a reaction and a mode. <strong>Guided:</strong> tap each reactant bond to break it, then tap <strong>Form</strong> to make each product bond. <strong>Tally:</strong> type how many of each bond break and form, then enter your " + DH + " estimate. <strong>Compare:</strong> see the estimate beside the course-table value.",
    modes:[{ id:"guided", t:"Guided" }, { id:"tally", t:"Tally" }, { id:"compare", t:"Compare" }],
    rxns:[
      { id:"r1", t:"R1: H2(g) + Cl2(g) -> 2HCl(g)" },
      { id:"r2", t:"R2: 2H2(g) + O2(g) -> 2H2O(g)" },
      { id:"r3", t:"R3: CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)" },
      { id:"r4", t:"R4: N2(g) + 3H2(g) -> 2NH3(g)" },
      { id:"r5", t:"R5: CH4(g) + Cl2(g) -> CH3Cl(g) + HCl(g)" },
      { id:"r6", t:"R6: C2H6(g) + 3½O2(g) -> 2CO2(g) + 3H2O(g)", note:"shown per mole of ethane" }
    ],
    rows:["Bonds broken", "Σ broken", "Bonds formed", "Σ formed", DH + " estimate", "Table value", "Difference"],
    noTable:"none (CH₃Cl isn’t in the course table)",
    p4note:"The C–H value 413 is an average over many compounds; in ethane it’s slightly different.",
    predIntro:"Each prediction sets up Break and make. Choose an answer, then watch what happens.",
    predictions:[
      { id:"p1", prompt:"When you break the H–H bond, energy is…",
        options:[{ t:"absorbed (taken in)", ok:true }, { t:"released" }, { t:"neither" }, { t:"released, then absorbed" }],
        explain:"Pulling bonded atoms apart always takes energy. " + M1 },
      { id:"p2", prompt:"Forming the two H–Cl bonds will release 864 kJ. Overall the reaction will be…",
        options:[{ t:"exothermic", ok:true }, { t:"endothermic" }, { t:"neither" }, { t:"can’t tell" }],
        explain:"864 out vs 679 in: more out, so " + DH + " < 0." },
      { id:"p3", prompt:"Which single bond releases the most energy when it forms once?",
        options:[{ t:"C=O in CO₂", ok:true }, { t:"O–H" }, { t:"C–H" }, { t:"O=O" }],
        explain:"799 kJ/mol is the largest in this reaction. Strong C=O bonds are why burning carbon fuels releases so much energy." },
      { id:"p4", prompt:"The estimate is −1406 kJ; the table gives −1428 kJ. Why the gap?",
        options:[{ t:"Bond energies are averages from many molecules", ok:true }, { t:"The arithmetic must be wrong" }, { t:"The table is out of date" }, { t:"Ethane has no C–C bond" }],
        explain:"Estimates are close, not exact. " + M5 }
    ],
    predSetup:{ p1:"R1 in Guided mode, before any tap.", p2:"R1 with both reactant bonds broken.", p3:"R3 with every reactant bond broken.", p4:"R6 in Compare mode." },
    chalIntro:"Use Break and make to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"In Tally mode, find " + DH + " for R5, CH₄ + Cl₂ → CH₃Cl + HCl.",
        why:"Only one C–H and the Cl–Cl break; one C–Cl and one H–Cl form. Unchanged C–H bonds cancel, so " + DH + " ≈ −115 kJ.",
        hints:["Which bonds actually change?", "One C–H and one Cl–Cl break; one C–Cl and one H–Cl form.", "(413 + 243) − (339 + 432) = 656 − 771 = −115 kJ."] },
      { id:"tc2", goal:4, prompt:"Mystery bond: the course table gives " + DHF + "(HCl) = −92.3 kJ/mol, so H₂ + Cl₂ → 2HCl has " + DH + " = −184.6 kJ. Using H–H = 436 and Cl–Cl = 243, find the H–Cl bond energy.",
        why:"436 + 243 − 2<i>x</i> = −184.6, so <i>x</i> = 431.8 kJ/mol, close to the table’s 432.",
        hints:["Write 436 + 243 − 2<i>x</i> = −184.6.", "2<i>x</i> = 679 + 184.6 = 863.6.", "<i>x</i> = 431.8 kJ/mol, close to the table’s 432."] },
      { id:"tc3", goal:5, stretch:true, prompt:"Which releases more energy <strong>per mole of O₂ used</strong>: burning hydrogen (R2) or burning methane (R3)? Enter both values, then choose.",
        why:"R2 uses 1 mol O₂ and releases 482 kJ; R3 uses 2 mol O₂, so −802 ÷ 2 = −401 kJ per mol O₂. Hydrogen wins.",
        hints:["How many moles of O₂ does each equation use?", "R2 uses 1; R3 uses 2.", "H₂: −482 kJ per mol O₂. CH₄: −401 kJ per mol O₂. Hydrogen wins."] }
    ],
    msgs:{
      tc1:{ rx:"Choose R5 (CH₄ + Cl₂ → CH₃Cl + HCl) and fill in its tally.", m2:"Σ(broken) − Σ(formed), not the reverse.",
        m7:"Methane has four C–H bonds and CH₃Cl keeps three. Count unchanged bonds on both sides or on neither.",
        dhOnly:"Your " + DH + " is right, but the tally doesn’t match it yet. Fill in the bonds you counted.",
        tallyOnly:"Your tally works. Now enter Σ(broken) − Σ(formed) as your " + DH + " estimate.",
        other:"Not yet. Check the tally against the structures: which bonds break, and which form?" },
      tc2:{ set:"In Tally mode, choose R1, make H–Cl the mystery bond, and enter its energy <i>x</i>.",
        two:"That’s for <strong>two</strong> H–Cl bonds; divide by 2.", signs:"Check your signs: 679 − 2<i>x</i> = −184.6.",
        other:"Not yet. Set Σ(broken) − Σ(formed) equal to −184.6 and solve for <i>x</i>." },
      tc3:{ empty:"Enter a value for each fuel and choose one.", ch4:"That’s per mole of methane, which uses <strong>2</strong> mol O₂.",
        h2mol:"That’s per mole of H₂. Per mole of O₂, R2 releases all 482 kJ.", sign:"Energy is released, so both values are negative.",
        other:"Divide each " + DH + " by the moles of O₂ in its equation." },
      fuel:{ title:"Per mole of O₂ (challenge 3)", h2:"R2, burning hydrogen", ch4:"R3, burning methane", unit:"kJ per mol O₂", pick:"More per mole of O₂", opts:[{ id:"h2", t:"Hydrogen" }, { id:"ch4", t:"Methane" }] },
      tally:{ head:["Bond", "Energy (kJ/mol)", "Broken", "Formed"], mystery:"Mystery bond", none:"None", x:"Its energy <i>x</i>", dh:"Your " + DH + " estimate", hint:"Count every bond in every molecule (multiply by the coefficients), or count only the bonds that change." },
      formBtn:"Form", formNext:"Form the next bond", breakFirst:"Break every reactant bond first.", reset:"Start again", allDone:"Every bond is broken and formed."
    },
    blocks:[
      { title:"The big idea", html:"<p>A reaction is a two-step energy story: in to break, out to form. The sign of " + DH + " depends on which bonds are stronger.</p>" }
    ]
  },
  part3:{
    slug:"fuels", name:"Fuels", heading:"Why fuels release energy",
    intro:"Where does a fuel’s energy really come from? Check each idea against bond-energy data.",
    s1:{ title:"Station 1: Where does the energy come from?",
      intro:"Burning methane, R3: CH₄ + 2O₂ → CO₂ + 2H₂O. The bars show what goes in and what comes out. Tap the statement that best explains it.",
      stmts:[
        { id:"a", t:"The products’ bonds are stronger than the reactants’ bonds.", right:true },
        { id:"b", t:"Methane’s bonds hold stored energy that escapes when they break." },
        { id:"c", t:"Oxygen gives its energy to the methane." }] },
    s2:{ title:"Station 2: Per mole or per gram?",
      intro:"The table is computed for you. Rank the fuels by energy released per mole, then per gram. Tap the fuels in order, most energy first.",
      head:["Fuel", DH + " estimate (kJ per mol fuel, gas phase)", "Molar mass (use these values)", "Energy per gram"],
      perMol:"Rank per mole (most first)", perG:"Rank per gram (most first)", reset:"Clear" },
    s3:{ title:"Station 3: The catch",
      // VERIFY: plan marks the hydrogen-production fact "(verify before release)": most hydrogen today is made from natural gas, releasing CO₂.
      text:"Burning hydrogen makes only water, but most hydrogen today is made from natural gas, which releases CO₂. A fuel is only as clean as the way it’s made.",
      benefit:{ label:"Choose one benefit of hydrogen", opts:[
        { id:"b1", t:"Burning it makes only water", ok:true, fb:"Right. 2H₂ + O₂ → 2H₂O: no carbon, so no CO₂ from the flame." },
        { id:"b2", t:"It releases the most energy per gram in the table", ok:true, fb:"Right. About 120 kJ/g, more than CH₄ (50) or ethanol (27)." },
        { id:"b3", t:"Burning it releases CO₂", fb:"Not quite. Burning hydrogen makes only water; any CO₂ comes from how the hydrogen is made." }] },
      drawback:{ label:"Choose one drawback", opts:[
        { id:"d1", t:"Most hydrogen today is made from natural gas, which releases CO₂", ok:true, fb:"Right. A fuel is only as clean as the way it’s made." },
        { id:"d2", t:"It releases little energy per gram", fb:"Not quite. Per gram, it beats every fuel in the table." }] },
      data:"Check it with data", dataText:"H₂ releases more energy per gram than any other fuel in the table: about 120 kJ/g, against about 50 kJ/g for methane and 27 kJ/g for ethanol." },
    quickCheck:{
      title:"Quick check", summary:"Fuels quick check",
      items:[
        { id:"q1", goal:1, prompt:"Burning methane releases energy mainly because…",
          choices:[{ t:"stronger bonds form in the products", ok:true, fb:"Right. Forming the C=O and O–H bonds releases more than breaking C–H and O=O takes in." }, { t:"bonds in methane release energy as they break", fb:"Breaking always takes energy in." }, { t:"oxygen is a fuel", fb:"Breaking always takes energy in." }, { t:"heat is stored in CH₄", fb:"Breaking always takes energy in." }] },
        { id:"q2", goal:5, prompt:"Which fuel gives the most energy per gram?",
          choices:[{ t:"H₂", ok:true, fb:"Right. Per gram: about 120, 50 and 27 kJ/g." }, { t:"CH₄", fb:"Per gram: about 120, 50 and 27 kJ/g." }, { t:"C₂H₅OH", fb:"Per gram: about 120, 50 and 27 kJ/g." }, { t:"all equal", fb:"Per gram: about 120, 50 and 27 kJ/g." }] },
        { id:"q3", goal:5, prompt:"Ethanol releases more per <strong>mole</strong> than methane but less per <strong>gram</strong> because…",
          choices:[{ t:"each mole of ethanol is much heavier", ok:true, fb:"Right. 46 g/mol vs 16 g/mol." }, { t:"ethanol has no C–H bonds", fb:"46 g/mol vs 16 g/mol." }, { t:"ethanol isn’t a fuel", fb:"46 g/mol vs 16 g/mol." }, { t:"bond energies don’t apply", fb:"46 g/mol vs 16 g/mol." }] },
        { id:"q4", goal:5, prompt:"<strong>Investigation:</strong> A student’s calorimeter gives −700 kJ/mol for methane; the bond-energy estimate is −802. The most likely main reason?",
          choices:[{ t:"heat escaped to the surroundings", ok:true, fb:"Right. Lost heat makes measured values less negative (module 25)." }, { t:"bond energies are always too low", fb:"Lost heat makes measured values less negative (module 25)." }, { t:"methane absorbed heat", fb:"Lost heat makes measured values less negative (module 25)." }, { t:"the balance was wrong", fb:"Lost heat makes measured values less negative (module 25)." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"inout", type:"sorter", title:"Energy in or energy out?", summary:"Energy in or out?", noun:"change", goal:1, txt:true,
        instruction:"Decide whether each change absorbs or releases energy.",
        how:"Tap a change, then tap the box it belongs in.",
        boxes:[{ id:"in", label:"Energy absorbed" }, { id:"out", label:"Energy released" }],
        wrongDefault:"Pulled apart → in; joined → out.",
        items:sortItems },
      { id:"calc", type:"numeric", title:"Bond-energy calculations", summary:"Bond-energy calculations", star:true, goal:[2, 3, 4],
        instruction:"Estimate each Δ<i>H</i> from bond energies. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer (use − for negative values), then press Check. Answers within 1 kJ are accepted.",
        items:[
          { id:"b1", goal:2, prompt:"2H₂(g) + O₂(g) → 2H₂O(g)" + ST("H–H, H–H, O=O → H–O–H, H–O–H"), use:U_H2O,
            answer:-482, tol:1 / 482, unit:"kJ", keypad:"text", display:"−482 kJ", why:"(2(436) + 498) − 4(463) = 1370 − 1852.",
            wrong:[{ match:482, fb:M2 }, { match:444, fb:"Four O–H bonds form, not two." }],
            hints:["Broken: 2 H–H and 1 O=O. Formed: 4 O–H.", "Σ broken = 2(436) + 498 = 1370; Σ formed = 4(463) = 1852.", "1370 − 1852 = −482 kJ."] },
          { id:"b2", goal:2, prompt:"N₂(g) + 3H₂(g) → 2NH₃(g)" + ST("N≡N, 3 H–H → 2 NH₃, each with 3 N–H"), use:U_NH3,
            answer:-93, tol:1 / 93, unit:"kJ", keypad:"text", display:"−93 kJ", why:"(945 + 3(436)) − 6(391) = 2253 − 2346.",
            wrong:[{ match:93, fb:M2 }, { match:1080, fb:"Six N–H bonds form." }],
            hints:["Broken: 1 N≡N and 3 H–H. Formed: 6 N–H.", "Σ broken = 945 + 3(436) = 2253; Σ formed = 6(391) = 2346.", "2253 − 2346 = −93 kJ."] },
          { id:"b3", goal:3, star:true, prompt:"Ethene + H₂ → ethane: H₂C=CH₂ + H–H → H₃C–CH₃", use:U_ETH,
            answer:-123, tol:1 / 123, unit:"kJ", keypad:"text", display:"−123 kJ", why:"(614 + 436) − (347 + 2(413)) = 1050 − 1173.",
            wrong:[{ match:-390, fb:"The C=C also changes to C–C." }, { match:-559, fb:"Don’t forget to break the H–H bond." }, { match:123, fb:M2 }],
            hints:["Only the C=C and the H–H change: they break, and one C–C and two C–H form.", "Broken: 614 + 436 = 1050. Formed: 347 + 2(413) = 1173.", "1050 − 1173 = −123 kJ."] },
          { id:"b4", goal:3, star:true, prompt:"C₂H₅OH(g) + 3O₂(g) → 2CO₂(g) + 3H₂O(g) (ethanol has 5 C–H, 1 C–C, 1 C–O, 1 O–H)" + ST("CH₃–CH₂–O–H, 3 O=O → 2 O=C=O, 3 H–O–H"),
            use:U("C–H 413 · C–C 347 · C–O 358 · O–H 463 · O=O 498 · C=O in CO₂ 799"),
            answer:-1247, tol:1 / 1247, unit:"kJ", keypad:"text", display:"−1247 kJ", why:"4727 − 5974 = −1247 kJ.",
            // plan lists −1059 for the 745 slip; with C=O 745 the result is −1031 (4727 − 5758). Missing ethanol's O–H gives −1710.
            wrong:[{ match:-1031, fb:"Use 799 for C=O in CO₂." }, { match:-1710, fb:"Ethanol has one O–H to break too." }, { match:1247, fb:M2 }],
            hints:["List ethanol’s bonds: 5 C–H, 1 C–C, 1 C–O, 1 O–H.", "Broken: 3233 + 3(498) = 4727. Formed: 4(799) + 6(463) = 5974.", "4727 − 5974 = −1247 kJ."] },
          { id:"b5", goal:4, star:true, prompt:"Work backwards: H₂ + Cl₂ → 2HCl has " + DH + " = −185 kJ. With H–H = 436 and H–Cl = 432, find Cl–Cl." + ST("H–H, Cl–Cl → H–Cl, H–Cl"),
            answer:243, tol:1 / 243, unit:"kJ/mol", keypad:"text", display:"243 kJ/mol", why:"436 + <i>x</i> − 864 = −185.",
            wrong:[{ match:613, fb:DH + " is negative: 436 + <i>x</i> − 864 = −185." }],
            hints:["Write 436 + <i>x</i> − 2(432) = −185.", "436 + <i>x</i> − 864 = −185, so <i>x</i> − 428 = −185.", "<i>x</i> = 243 kJ/mol."] },
          { id:"b6", goal:2, star:true, prompt:"C₂H₂(g) + 2½O₂(g) → 2CO₂(g) + H₂O(g) (ethyne: H–C≡C–H)" + ST("H–C≡C–H, 2½ O=O → 2 O=C=O, H–O–H"),
            use:U("C≡C 839 · C–H 413 · O=O 498 · C=O in CO₂ 799 · O–H 463"),
            answer:-1212, tol:1 / 1212, unit:"kJ", keypad:"text", display:"−1212 kJ", why:"2910 − 4122 = −1212 kJ.",
            // plan lists −1588 for using C=C; with C=C 614 the result is −1437 (2685 − 4122).
            wrong:[{ match:-1437, fb:"Ethyne has a C≡C (839), not a C=C." }, { match:1212, fb:M2 }],
            hints:["Broken: 1 C≡C, 2 C–H, 2½ O=O.", "839 + 826 + 1245 = 2910; formed 4(799) + 2(463) = 4122.", "2910 − 4122 = −1212 kJ."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Nolan", how:"", goal:[2, 3],
        instruction:"Nolan made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Estimate " + DH + " for H₂(g) + Cl₂(g) → 2HCl(g).",
            steps:["Bonds broken: 1 H–H and 1 Cl–Cl.", "Σ broken = 436 + 243 = 679 kJ.", "Bonds formed: 1 H–Cl.", "Σ formed = 432 kJ.", DH + " = 679 − 432 = +247 kJ, so it’s endothermic."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier.", "Step 5 follows from step 4."],
            fixes:[
              { t:"Two HCl molecules form, so 2 H–Cl bonds: Σ formed = 864 and " + DH + " = −185 kJ.", ok:true, why:"679 − 864 = −185 kJ: exothermic." },
              { t:DH + " = 432 − 679 = −247 kJ.", why:M2 },
              { t:"Count H–Cl once because there’s one kind of product.", why:M3 },
              { t:"Step 3 is correct.", why:"The coefficient 2 means two H–Cl bonds." }],
            hints:["What does the 2 in 2HCl mean?", "Two molecules, each with one bond.", "−185 kJ."] },
          { id:"e2", goal:2, task:"Estimate " + DH + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g).",
            steps:["Broken: 4 C–H and 2 O=O.", "Σ broken = 1652 + 996 = 2648 kJ.", "Formed: 2 C=O (799 each) and 4 O–H: 1598 + 1852 = 3450 kJ.", DH + " = Σ formed − Σ broken = 3450 − 2648 = +802 kJ.", "So burning methane is endothermic."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows from step 4."],
            fixes:[
              { t:DH + " = Σ broken − Σ formed = 2648 − 3450 = −802 kJ: exothermic.", ok:true, why:"Energy in counts as +, energy out as −." },
              { t:DH + " = 3450 + 2648.", why:"Adding both sums ignores which way the energy flows." },
              { t:"Use 745 for C=O.", why:M4 },
              { t:"Step 4 is correct.", why:"Burning methane clearly gives out heat." }],
            hints:["Energy in counts as +, energy out as −.", "In: 2648. Out: 3450.", "−802 kJ."] },
          { id:"e3", goal:3, task:"Estimate " + DH + " for CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g).",
            steps:["Broken: 4 C–H and 2 O=O: 2648 kJ.", "Formed: 2 C=O at 745 each = 1490 kJ.", "Formed: 4 O–H = 1852 kJ; total 3342 kJ.", DH + " = 2648 − 3342 = −694 kJ."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 is fine; the mistake is earlier.", "Step 4 follows."],
            fixes:[
              { t:"C=O in CO₂ is 799 kJ/mol: formed = 3450 and " + DH + " = −802 kJ.", ok:true, why:M4 },
              { t:"C=O in CO₂ is 2 × 745.", why:"799 is the measured value for CO₂." },
              { t:"Count only one C=O.", why:M3 },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Check the bond table’s CO₂ row.", "799, not 745.", "−802 kJ."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Before this module, did you think breaking bonds released energy? What changed your mind?" },
      { id:"j2", q:"In your own words, explain why Δ<i>H</i> ≈ Σ(broken) − Σ(formed) has that order." },
      { id:"j3", q:"Explain to a friend how to count the bonds formed in 2H₂O." },
      { id:"j4", q:"Which step still trips you up: counting bonds, choosing values or the subtraction? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"When a chemical bond is broken, energy is…", options:[
          { t:"absorbed", ok:true, why:"Separating bonded atoms takes energy in." },
          { t:"released", why:"Breaking never releases energy." },
          { t:"neither absorbed nor released", why:"Bonds have energy; breaking them costs it." },
          { t:"released only if the bond is weak", why:"Even weak bonds need energy to break." }] },
        b:{ prompt:"When a chemical bond forms, energy is…", options:[
          { t:"released", ok:true, why:"Atoms settling into a bond give energy out." },
          { t:"absorbed", why:M1 },
          { t:"neither", why:"Forming a bond lowers the energy." },
          { t:"absorbed only for double bonds", why:"Every bond formation releases energy." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which expression estimates a reaction’s " + DH + " from bond energies?", options:[
          { t:"Σ(bonds broken) − Σ(bonds formed)", ok:true, why:"Energy in minus energy out." },
          { t:"Σ(bonds formed) − Σ(bonds broken)", why:M2 },
          { t:"Σ(bonds broken) + Σ(bonds formed)", why:"Energy in and out have opposite signs." },
          { t:"Σ(bonds formed) ÷ Σ(bonds broken)", why:"It’s a difference, not a ratio." }] },
        b:{ prompt:"In the bond-energy method, the ‘bonds broken’ are the bonds in…", options:[
          { t:"the reactants", ok:true, why:"Reactant bonds break; product bonds form." },
          { t:"the products", why:"Product bonds are formed." },
          { t:"both reactants and products", why:"Only reactant bonds break." },
          { t:"the catalyst", why:"Catalysts aren’t part of the count." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Why is a bond-energy " + DH + " only an estimate?", options:[
          { t:"Bond energies are averages from many different molecules", ok:true, why:M5 },
          { t:"Bonds don’t really have energies", why:"They do; the values are averages." },
          { t:"The method ignores coefficients", why:"Coefficients are always included." },
          { t:"It only works for endothermic reactions", why:"It works for both." }] },
        b:{ prompt:"For methane burning, which value is more reliable?", options:[
          { t:"The one from the " + DHF + " table", ok:true, why:"It’s measured for these exact substances." },
          { t:"The bond-energy estimate", why:M5 },
          { t:"They are always identical", why:M5 },
          { t:"Neither can be used", why:"Both can; the table is more precise." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Estimate " + DH + " for 2H₂(g) + O₂(g) → 2H₂O(g).", use:U_H2O, options:[
          { t:"−482 kJ", ok:true, why:"(2(436) + 498) − 4(463) = 1370 − 1852." },
          { t:"+482 kJ", why:M2 },
          { t:"+444 kJ", why:"Four O–H bonds form, not two." },
          { t:"−1852 kJ", why:"That’s only the bonds formed." }] },
        b:{ prompt:"Estimate " + DH + " for N₂(g) + 3H₂(g) → 2NH₃(g).", use:U_NH3, options:[
          { t:"−93 kJ", ok:true, why:"(945 + 3(436)) − 6(391) = 2253 − 2346." },
          { t:"+93 kJ", why:M2 },
          { t:"+1080 kJ", why:"2 NH₃ have six N–H bonds." },
          { t:"−2346 kJ", why:"That’s only the bonds formed." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"H₂(g) + Cl₂(g) → 2HCl(g) has " + DH + " = −185 kJ. With H–H = 436 and H–Cl = 432, what is the Cl–Cl bond energy?", options:[
          { t:"243 kJ/mol", ok:true, why:"436 + <i>x</i> − 864 = −185." },
          { t:"613 kJ/mol", why:"That uses +185: " + DH + " is negative." },
          { t:"185 kJ/mol", why:DH + " isn’t a bond energy." },
          { t:"432 kJ/mol", why:"There’s no reason Cl–Cl equals H–Cl." }] },
        b:{ prompt:"2H₂(g) + O₂(g) → 2H₂O(g) has " + DH + " = −482 kJ. With H–H = 436 and O=O = 498, what is the O–H bond energy?", options:[
          { t:"463 kJ/mol", ok:true, why:"1370 − 4<i>x</i> = −482, so 4<i>x</i> = 1852." },
          { t:"222 kJ/mol", why:"That uses +482. " + M2 },
          { t:"926 kJ/mol", why:"Four O–H bonds, not two." },
          { t:"482 kJ/mol", why:DH + " isn’t a bond energy." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Estimate " + DH + " for ethene + hydrogen → ethane: H₂C=CH₂ + H₂ → H₃C–CH₃.", use:U_ETH, options:[
          { t:"−123 kJ", ok:true, why:"(614 + 436) − (347 + 2(413)) = 1050 − 1173." },
          { t:"+123 kJ", why:M2 },
          { t:"−390 kJ", why:"The C=C becomes C–C; include that change." },
          { t:"−559 kJ", why:"The H–H bond must break too." }] },
        b:{ prompt:"Estimate " + DH + " for ethyne + 2H₂ → ethane: HC≡CH + 2H₂ → H₃C–CH₃.", use:U_YNE, options:[
          { t:"−288 kJ", ok:true, why:"(839 + 2(436)) − (347 + 4(413)) = 1711 − 1999." },
          { t:"+288 kJ", why:M2 },
          { t:"−724 kJ", why:"Two H₂ molecules break: 2 H–H." },
          { t:"−780 kJ", why:"The C≡C becomes C–C; include that change." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why burning methane is exothermic?", options:[
          { t:"“More energy is released forming the C=O and O–H bonds in the products than is absorbed breaking the C–H and O=O bonds in the reactants.”", ok:true, why:"Energy out is larger than energy in." },
          { t:"“Energy is released as methane’s C–H bonds break.”", why:M1 },
          { t:"“Methane contains stored heat that escapes when it burns.”", why:M1 },
          { t:"“Oxygen has weak bonds, so it doesn’t need energy to react.”", why:"Breaking O=O still absorbs 498 kJ/mol." }] },
        b:{ prompt:"Which is the best explanation of why splitting water into H₂ and O₂ needs an energy input?", options:[
          { t:"“Breaking the strong O–H bonds absorbs more energy than forming H–H and O=O bonds releases.”", ok:true, why:"Energy in is larger than energy out." },
          { t:"“Water stores no energy, so energy must be added.”", why:"It’s about the balance of bond strengths." },
          { t:"“Forming H₂ and O₂ absorbs energy.”", why:M1 },
          { t:"“Water is a liquid, so it can’t react.”", why:"States affect the value, not whether energy is needed." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"A student’s bond-energy estimate for burning ethane is −1406 kJ/mol; the " + DHF + " table gives −1428 kJ/mol. Which explanation is best?", options:[
          { t:"“Bond energies are averages over many compounds, so the estimate is close but not exact.”", ok:true, why:M5 },
          { t:"“The student must have made an arithmetic error.”", why:M5 },
          { t:"“The table must be wrong.”", why:"Table values are measured for these substances." },
          { t:"“Bond energies only work for endothermic reactions.”", why:"They work for both." }] },
        b:{ prompt:"Why does a bond-energy estimate drift further from the table when a product is liquid water?", options:[
          { t:"“Bond energies apply to gases; condensing water releases extra energy that the bonds don’t count.”", ok:true, why:"Attractions between water molecules release extra energy." },
          { t:"“Liquids have no bonds.”", why:"Liquid water still has O–H bonds." },
          { t:"“Liquid water has stronger O–H bonds.”", why:"The extra energy comes from attractions <strong>between</strong> molecules." },
          { t:"“The coefficients change for liquids.”", why:"Coefficients don’t depend on state." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Use these values: H₂ releases 241 kJ/mol (2.0 g/mol); CH₄ releases 802 kJ/mol (16 g/mol). Which fuel releases more energy <strong>per gram</strong>?", options:[
          { t:"H₂, about 120 kJ/g vs about 50 kJ/g", ok:true, why:"241 ÷ 2.0 ≈ 120; 802 ÷ 16 ≈ 50." },
          { t:"CH₄, because 802 > 241", why:M6 },
          { t:"They’re equal per gram", why:"241 ÷ 2 and 802 ÷ 16 differ." },
          { t:"CH₄, about 50 kJ/g vs about 12 kJ/g", why:"241 ÷ 2.0 = 120, not 12." }] },
        b:{ prompt:"Use these values: ethanol releases 1247 kJ/mol (46 g/mol); methane releases 802 kJ/mol (16 g/mol). Which releases more energy per gram?", options:[
          { t:"Methane, about 50 kJ/g vs about 27 kJ/g", ok:true, why:"802 ÷ 16 ≈ 50; 1247 ÷ 46 ≈ 27." },
          { t:"Ethanol, because 1247 > 802", why:M6 },
          { t:"They’re equal", why:"1247 ÷ 46 ≈ 27; 802 ÷ 16 ≈ 50." },
          { t:"Ethanol, about 50 kJ/g", why:"Divide each by its own molar mass." }] } },
      { id:"a2", cat:"A", goal:[2, 5],
        a:{ prompt:"Hydrogen can react with oxygen (2H₂ + O₂ → 2H₂O(g), " + DH + " = −482 kJ) or with chlorine (H₂ + Cl₂ → 2HCl, " + DH + " = −185 kJ). Per mole of H₂ used, which reaction releases more energy?", options:[
          { t:"With oxygen: −241 kJ per mol H₂ vs −185 kJ", ok:true, why:"−482 ÷ 2 = −241, which is more negative than −185." },
          { t:"With chlorine, because it makes 2 mol of product", why:"Compare per mole of H₂: −482 ÷ 2 = −241." },
          { t:"With oxygen: −482 kJ per mol H₂", why:"The equation uses <strong>2</strong> mol H₂." },
          { t:"They’re equal", why:"−241 vs −185." }] },
        b:{ prompt:"In industry, chloromethane is made by CH₄ + Cl₂ → CH₃Cl + HCl. Estimate " + DH + ".", use:U_MCL, options:[
          { t:"−115 kJ", ok:true, why:"(413 + 243) − (339 + 432) = 656 − 771." },
          { t:"+115 kJ", why:M2 },
          { t:"−771 kJ", why:"That’s only the bonds formed." },
          { t:"−1354 kJ", why:"You counted CH₃Cl’s three C–H bonds as formed but broke only one C–H. Count unchanged bonds on both sides or on neither." }] } }
    ]
  },
  task:{
    title:"Between −100 and −200", summary:"Between −100 and −200",
    statement:"<p>Pick a reaction and a scale so that the estimated " + DH + " lands between −100 kJ and −200 kJ, while meeting every condition. Can you find all the answers?</p>",
    inputs:{ tile:"Reaction", scale:"Scale",
      tiles:[{ id:"hcl", t:"H2 + Cl2 -> 2HCl" }, { id:"nh3", t:"N2 + 3H2 -> 2NH3" }, { id:"mcl", t:"CH4 + Cl2 -> CH3Cl + HCl" },
        { id:"c2h4", t:"C2H4 + H2 -> C2H6" }, { id:"c2h2", t:"C2H2 + 2H2 -> C2H6" }, { id:"h2o", t:"2H2 + O2 -> 2H2O(g)" }],
      scales:[{ id:"0.5", t:"×½" }, { id:"1", t:"×1" }, { id:"2", t:"×2" }] },
    checks:[DH + " between −200 and −100 kJ", "A multiple bond breaks", "Hydrogen gas is a reactant"],
    tips:["Multiply the tile’s " + DH + " by your scale. Halving halves " + DH + ".", "Look for N≡N, C=C, C≡C or O=O in the reactants.", "Choose a tile with H₂ on the left."],
    explainPrompt:"Explain how you used bond energies and the scale to land in the range.",
    vocab:"Use the words bonds broken, bonds formed, ΔH and coefficient.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Each answer breaks a strong multiple bond, yet the overall change stays modest because strong bonds also form."
  },
  cards:[
    ["Bond energy", "Energy needed to break 1 mol of a bond in gas molecules, in kJ/mol (e.g. H–H 436)"],
    ["Breaking a bond", "Always absorbs energy (endothermic step)"],
    ["Forming a bond", "Always releases energy (exothermic step)"],
    ["Δ<i>H</i> from bond energies", "Δ<i>H</i> ≈ Σ(broken) − Σ(formed)"],
    ["Exothermic by bonds", "Bonds formed are stronger overall than bonds broken"],
    ["Counting bonds", "Bonds per molecule × coefficient; doubles and triples have their own values"],
    ["C=O in CO₂", "799 kJ/mol (the general C=O value is 745)"],
    ["Why “≈”?", "Bond energies are averages for gases, so the result is an estimate"],
    ["Fuel energy", "Comes from strong bonds forming in CO₂ and H₂O, not from bonds “storing” energy"],
    ["Per gram vs per mole", "Per gram = (kJ/mol) ÷ (g/mol); hydrogen leads per gram"],
    ["Working backwards", "Put the unknown bond energy as <i>x</i> in Σ(broken) − Σ(formed) = Δ<i>H</i> and solve"]
  ]
};
