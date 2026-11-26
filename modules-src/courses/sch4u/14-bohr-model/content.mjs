// SCH4U 14 Bohr Model. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/14-bohr-model.md
// Pictures (hero ladder and spectrum, the C12 energy ladder with its spectrum strip, the Part 3 spectra, the task
// preview) are drawn by app.js. Hydrogen's levels come from MV.chem.data.hLevel; the line table is in app.js.

const L = n => "`n = " + n + "`";                     // a level, n italic
const LEVELS = "`E_1` = −13.60 eV, `E_2` = −3.40 eV, `E_3` = −1.51 eV, `E_4` = −0.85 eV, `E_5` = −0.54 eV, `E_6` = −0.38 eV";

// Misconception core sentences (plan §3)
const M1 = "The photon carries the <strong>difference</strong>: −0.85 − (−3.40) = 2.55 eV, not 0.85 + 3.40.";
const M1f = (a, b, d) => "The photon carries the <strong>difference</strong>: −" + a + " − (−" + b + ") = " + d + " eV, not " + a + " + " + b + ".";
const M2 = "Energy and wavelength go opposite ways: violet (short) carries more energy than red (long).";
const M3 = "The photon must match a gap <strong>exactly</strong>. Only an energy above the ionization energy can remove the electron outright.";
const M4 = "Jumping up absorbs a photon; falling down emits one; staying put does neither.";
const M5 = "Only falls to " + L(2) + " (from 3–6) are visible. Falls to " + L(1) + " are UV; falls to " + L(3) + " or higher are IR.";
const M6 = "It predicts hydrogen exactly but fails for atoms with two or more electrons.";
const M7 = "A flame colour mixes several lines; a spectroscope separates them.";

// Practice 1: transition ↔ line (plan Activity 1)
const PAIRS = [
  ["3 → 2", "656 nm, red", "1.89 eV, the smallest visible gap: the longest visible wavelength, red."],
  ["4 → 2", "486 nm, blue-green", "2.55 eV: a visible fall to " + L(2) + ", blue-green."],
  ["5 → 2", "434 nm, violet-blue", "2.86 eV: a bigger visible gap, so a shorter wavelength."],
  ["6 → 2", "410 nm, violet", "3.02 eV, the largest visible gap: the shortest visible wavelength, violet."],
  ["2 → 1", "122 nm, ultraviolet", "10.20 eV: every fall to " + L(1) + " is far above visible-light energies."],
  ["3 → 1", "103 nm, ultraviolet", "12.09 eV: a fall to " + L(1) + ", ultraviolet."],
  ["4 → 3", "1875 nm, infrared", "0.66 eV: a small gap, so a long wavelength in the infrared."],
  ["5 → 3", "1282 nm, infrared", "0.97 eV: a fall to " + L(3) + ", infrared."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const MATCH_WRONG = { "l1|r4":"656 nm is the <strong>smallest</strong> visible gap: red, not violet." };
["r1", "r2", "r3", "r4"].forEach(r => { MATCH_WRONG["l5|" + r] = "Falls to " + L(1) + " are UV."; });

export default {
  id:"14-bohr-model",
  kind:"topic",
  title:"Bohr model",
  topic:"Bohr Model",
  readyTopic:"the Bohr model",
  hero:{
    headline:"Hydrogen glows in only four visible colours. Why?",
    text:"Heat hydrogen gas and pass its light through a prism. Instead of a rainbow you get a few sharp <strong>lines</strong>. Niels Bohr explained them: the electron can only sit on certain <strong>energy levels</strong>. Each fall from one level to a lower one releases a <strong>photon</strong> whose energy matches the gap exactly.",
    fig:{ html:'<div class="bm-hx"><svg class="bm-hx-svg" id="bm-hx-svg" viewBox="0 0 480 350" role="img" aria-label="A glowing hydrogen tube shines through a prism, which spreads its light into four sharp lines on a black spectrum: 410 nm violet, 434 nm violet-blue, 486 nm blue-green and 656 nm red. Beside it, an energy ladder with levels n = 1 to 6. The electron drops from n = 3 to n = 2 and a red wavy photon arrow flies to the 656 nm line; then drops from 4, 5 and 6 to n = 2 send blue-green, violet-blue and violet photons to the other three lines."></svg><div class="bm-hx-row"><p class="bm-hx-ctr" id="bm-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="bm-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can describe Bohr’s model: electrons in fixed energy levels that absorb or emit photons only when they jump between levels.",
    "I can connect a transition to its photon’s energy, wavelength and region (UV, visible, IR).",
    "I can calculate photon energies from an energy-level diagram and count the possible lines.",
    "I can explain emission and absorption line spectra as evidence for quantized energy.",
    "I can use spectra to identify elements and describe the model’s limits and uses."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Electromagnetic spectrum", goal:2,
          prompt:"Which list goes from <strong>lowest</strong> to <strong>highest</strong> photon energy?",
          options:[
            { t:"Infrared, visible, ultraviolet", ok:true, why:"IR < visible < UV: ultraviolet photons carry the most energy." },
            { t:"Ultraviolet, visible, infrared", why:"Reversed: UV carries the most energy." },
            { t:"Visible, infrared, ultraviolet", why:"Infrared is below visible." },
            { t:"Infrared, ultraviolet, visible", why:"Visible sits between IR and UV." }],
          hints:["Which one gives a sunburn?", "UV: high energy.", "IR < visible < UV."] },
        { id:"w2", skill:"Electromagnetic spectrum", goal:2,
          prompt:"Which visible colour has the shortest wavelength?",
          options:[
            { t:"Violet", ok:true, why:"About 400 nm." },
            { t:"Red", why:"Red is longest, about 700 nm." },
            { t:"Green", why:"In the middle." },
            { t:"Yellow", why:"Longer than violet." }],
          hints:["Visible light runs from about 400 to 700 nm.", "Red is at the long end.", "Violet."] },
        { id:"w3", skill:"Energy differences", goal:3,
          prompt:"A ball drops from a shelf at −1.5 J to a shelf at −3.4 J (energies measured from the ceiling). How much energy is released?",
          options:[
            { t:"1.9 J", ok:true, why:"−1.5 − (−3.4) = 1.9." },
            { t:"4.9 J", why:"That adds the sizes." },
            { t:"−4.9 J", why:"Subtract: final from initial." },
            { t:"3.4 J", why:"That’s one shelf, not the gap." }],
          hints:["Released energy = higher level − lower level.", "−1.5 − (−3.4).", "1.9 J."] },
        { id:"w4", skill:"Energy differences", goal:3,
          prompt:"Subtract: −0.85 − (−13.60) = ?",
          options:[
            { t:"12.75", ok:true, why:"Minus a negative is plus: −0.85 + 13.60 = 12.75." },
            { t:"14.45", why:M1f("0.85", "13.60", "12.75") },
            { t:"−14.45", why:M1f("0.85", "13.60", "12.75") },
            { t:"12.85", why:"Check the hundredths: 13.60 − 0.85 = 12.75." }],
          hints:["Minus a negative is plus.", "−0.85 + 13.60.", "12.75."] },
        { id:"w5", skill:"Continuous vs line spectra", goal:4,
          prompt:"A hot, glowing solid, like a light bulb filament, gives which kind of spectrum?",
          options:[
            { t:"Continuous: all colours", ok:true, why:"Solids glow across all colours: a rainbow." },
            { t:"A few bright lines", why:"That’s a hot gas." },
            { t:"Dark lines only", why:"That’s light passing through a cool gas." },
            { t:"No visible light", why:"A glowing filament is visible." }],
          hints:["Think of a rainbow.", "Solids glow across all colours.", "Continuous."] },
        { id:"w6", skill:"Continuous vs line spectra", goal:4,
          prompt:"A glowing gas tube viewed through a prism shows…",
          options:[
            { t:"Bright lines at certain colours", ok:true, why:"Each atom emits only certain photons, so a hot gas gives bright lines." },
            { t:"A full rainbow", why:"That’s a hot solid." },
            { t:"Only white light", why:"The prism separates colours." },
            { t:"Dark lines on a rainbow", why:"That’s absorption." }],
          hints:["Gas atoms behave individually.", "Each atom emits only certain photons.", "Bright lines."] }
      ],
      refreshers:{
        "Electromagnetic spectrum":"Radio < microwave < infrared < visible (red → violet) < ultraviolet < X-ray. Shorter wavelength means higher photon energy.",
        "Energy differences":"Energy released = <i>E</i>(high) − <i>E</i>(low). With negative levels, subtract carefully: −1.51 − (−3.40) = +1.89.",
        "Continuous vs line spectra":"Hot solids give continuous spectra. Hot gases give bright lines. Cool gases in front of white light give dark lines at the same places."
      }
    }
  },
  explore:{
    heading:"Energy level ladder",
    intro:"Give the electron energy, let it fall, and watch which lines appear.",
    how:"Choose a mode. Place the electron and let it fall, send it a photon, or shine white light through hydrogen gas. The readout and the spectrum update as you go.",
    modes:[{ id:"em", t:"Emission" }, { id:"ab", t:"Absorption" }, { id:"gas", t:"Gas and light" }],
    chips:[1.89, 2.00, 2.55, 10.20, 11.00, 12.09, 12.75, 13.60, 14.00],
    temps:[{ id:"cool", t:"Cool (about room temperature)" }, { id:"hot", t:"Very hot (like a star’s surface)" }],
    tags:[{ id:"n1", t:"they start at " + L(1) }, { id:"n2", t:"they start at " + L(2) }, { id:"n3", t:"they start at " + L(3) }],
    evNote:"Energies are in electron volts: 1 eV = 1.60 × 10<sup>−19</sup> J.",
    gasNote:"Model: the “very hot” setting stands in for the real effect of temperature. In a very hot gas, some atoms sit at " + L(2) + "; in a cool gas almost all sit at " + L(1) + ".",
    predictions:[
      { id:"p1", prompt:"Emission, electron at " + L(3) + ". It falls to " + L(2) + ". What colour is the photon?",
        options:[{ t:"Red", ok:true }, { t:"Violet" }, { t:"Ultraviolet" }, { t:"Infrared" }],
        explain:"1.89 eV is the smallest visible gap: the longest wavelength, red." },
      { id:"p2", prompt:"Absorption, electron at " + L(2) + ", photon 2.00 eV. What happens?",
        options:[{ t:"Nothing: the photon passes through", ok:true }, { t:"The electron jumps to " + L(3) }, { t:"It jumps partway" }, { t:"The atom ionizes" }],
        explain:"Gaps from " + L(2) + " are 1.89 eV, 2.55 eV and so on. 2.00 eV matches none." },
      { id:"p3", prompt:"Emission, electron at " + L(4) + ". Falling one or more steps at a time, how many <strong>different</strong> lines could atoms like this produce?",
        options:[{ t:"6", ok:true }, { t:"3" }, { t:"4" }, { t:"10" }],
        explain:"Every pair of levels from 1 to 4: 4 × 3 ÷ 2 = 6." },
      { id:"p4", prompt:"Emission 2 → 1. Where on the spectrum does this line appear?",
        options:[{ t:"Ultraviolet: invisible to us", ok:true }, { t:"Red" }, { t:"Violet" }, { t:"Infrared" }],
        explain:"10.2 eV is far above visible-light energies." }
    ],
    chalIntro:"Use the ladder to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses <strong>Gas and light</strong> mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 2], prompt:"Make hydrogen emit its <strong>blue-green</strong> line.",
        why:"4 → 2 gives out 2.55 eV: the blue-green line at 486 nm.",
        general:"No blue-green line recorded yet. In Emission mode, place the electron and choose a level for it to fall to.",
        hints:["Visible lines end at " + L(2) + ".", "Blue-green is 486 nm, the second-lowest visible gap.", "Fall from 4 to 2."] },
      { id:"tc2", goal:[1, 3], prompt:"Start in the ground state. Choose the <strong>lowest-energy single photon</strong> that lets the atom later emit the red line.",
        why:"12.09 eV is exactly the 1 → 3 gap. From " + L(3) + " the electron can fall 3 → 2 and emit the red line; no smaller photon reaches " + L(3) + ".",
        general:"In Absorption mode, start the electron at " + L(1) + " and send a photon.",
        hints:["The red line is 3 → 2, so the electron must reach at least " + L(3) + ".", "Gap from 1 to 3: −1.51 − (−13.60).", "12.09 eV."] },
      { id:"tc3", goal:[2, 4], stretch:true, prompt:"Gas and light mode: make hydrogen’s four <strong>visible</strong> dark lines appear. Then tag the level those absorbing electrons start on.",
        why:"Only a very hot gas has many atoms at " + L(2) + ", and every visible gap (1.89–3.02 eV) starts there. That’s why stars’ atmospheres show hydrogen’s visible dark lines.",
        hints:["Which level do visible transitions connect to?", L(2) + ".", "Only a very hot gas has many atoms at " + L(2) + ", as in a star’s atmosphere."] }
    ]
  },
  part3:{
    slug:"spectra", name:"Fingerprints", heading:"Spectra as fingerprints",
    intro:"Astronomers and testing labs use spectra as evidence. Every element has its own set of energy gaps, so its lines identify it. Match unknown spectra to their elements, see how helium was found in the Sun, and find where Bohr’s model breaks down.",
    // Station 1 reference lines (nm; rounded; course table addition, plan §6). Na is a close pair.
    refs:[
      { id:"H", name:"Hydrogen", sym:"H", lines:[410, 434, 486, 656] },
      { id:"He", name:"Helium", sym:"He", lines:[447, 502, 588, 668] },
      { id:"Na", name:"Sodium", sym:"Na", lines:[589], pair:true },
      { id:"Hg", name:"Mercury", sym:"Hg", lines:[405, 436, 546, 578] }
    ],
    unknowns:[
      { id:"A", answer:["He"] },
      { id:"B", answer:["Hg"] },
      { id:"C", answer:["H", "Na"] }
    ],
    s1:{ title:"Station 1: Match the fingerprint",
      intro:"Each reference spectrum shows an element’s main visible lines. Tap an unknown spectrum, then tap the element (or elements) it matches, or drag it there. One unknown is a <strong>mixture</strong>: its lines come from two elements.",
      fb:{ ok:"Each unknown’s lines are explained, and every element’s full set of lines is there. The mixture shows the union of hydrogen’s and sodium’s lines.",
        cH:"Four lines are hydrogen’s, but 589 nm isn’t. Which element has a line at 589 nm?",
        cNa:"589 nm is sodium’s, but the other four lines aren’t. Which element has lines at 410, 434, 486 and 656 nm?",
        aNa:"588 nm is close to sodium’s 589, but sodium has no lines at 447, 502 or 668 nm. The whole set of lines must match.",
        part:"Not every unknown is tagged correctly yet. Open <strong>Check it with data</strong> and compare the lines.",
        empty:"Tag all three unknowns first." } },
    s2:{ title:"Station 2: An element found in the Sun",
      // VERIFY: the 1868 helium story (the year, and the yellow line near 588 nm; plan §6 risk 3).
      html:"<p>In 1868 the Sun’s spectrum showed a yellow line at 588 nm that matched no known element. It was named <strong>helium</strong>, after the Greek word for the Sun, and found on Earth decades later.</p>",
      prompt:"Why can a dark or bright line name an element?" },
    s3:{ title:"Station 3: Where Bohr fails",
      intro:"Bohr’s ladder has one electron. Compare its predicted lines with the lines really observed.",
      cap:"Two or more electrons push on each other; Bohr’s model has no way to include that." },
    blocks:[
      { title:"Canadian connection: Gerhard Herzberg",
        // VERIFY: Herzberg's dates (came to Canada 1935; NRC Ottawa) and the 1971 Nobel Prize in Chemistry citation (plan §6 risk 3).
        html:"<p>Gerhard Herzberg came to Canada in 1935 and worked at the National Research Council in Ottawa. His spectroscopy revealed the structures of molecules and short-lived fragments of molecules, and he won the Nobel Prize in Chemistry in 1971.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Spectra as fingerprints quick check",
      items:[
        { id:"q1", goal:5, prompt:"An unknown shows lines at 410, 434, 486, 589 and 656 nm. What’s in it?",
          choices:[
            { t:"Hydrogen and sodium", ok:true, fb:"Right. Four lines are hydrogen’s; 589 nm is sodium’s." },
            { t:"Helium only", fb:"Four lines are hydrogen’s; 589 nm is sodium’s." },
            { t:"Mercury and helium", fb:"Four lines are hydrogen’s; 589 nm is sodium’s." },
            { t:"Sodium only", fb:"Four lines are hydrogen’s; 589 nm is sodium’s." }] },
        { id:"q2", goal:4, prompt:"Why is each element’s spectrum unique?",
          choices:[
            { t:"Its energy gaps are unique", ok:true, fb:"Right. Lines come from gaps between levels." },
            { t:"It has a unique mass", fb:"Lines come from gaps between levels." },
            { t:"Its atoms are a unique colour", fb:"Lines come from gaps between levels." },
            { t:"Its electrons move at unique speeds", fb:"Lines come from gaps between levels." }] },
        { id:"q3", goal:5, prompt:"How was helium first identified?",
          choices:[
            { t:"A spectral line in sunlight", ok:true, fb:"Right. It was seen in the Sun first." },
            { t:"A gas collected from rocks", fb:"It was seen in the Sun first." },
            { t:"Gold foil", fb:"It was seen in the Sun first." },
            { t:"Cathode rays", fb:"It was seen in the Sun first." }] },
        { id:"q4", goal:5, prompt:"Why does Bohr’s model fail for helium?",
          choices:[
            { t:"It ignores electron–electron repulsion", ok:true, fb:"Right. The model only works with one electron." },
            { t:"Helium has no levels", fb:"The model only works with one electron." },
            { t:"Helium emits no light", fb:"The model only works with one electron." },
            { t:"Helium has no nucleus", fb:"The model only works with one electron." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Transition ↔ line", summary:"Transition ↔ line", goal:2,
        instruction:"Match each electron fall to the line it gives out.",
        leftTitle:"Transition", rightTitle:"Line",
        left:PAIRS.map((p, i) => ({ id:"l" + (i + 1), t:p[0], why:p[0] + ": " + p[2], hints:["Which level does it end on?", L(1) + " is UV, " + L(2) + " visible, " + L(3) + " IR.", p[0] + " gives " + p[1] + "."] })),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        wrong:MATCH_WRONG,
        wrongDefault:"Where the fall ends sets the region; the bigger the gap, the shorter the wavelength." },
      { id:"calc", type:"custom", title:"Energy ladder calculations", summary:"Energy ladder calculations", star:true, goal:[3, 4],
        instruction:"Seven items: number entry and choices. Items 5 to 7 are non-routine; items 6 and 7 go beyond the Final Check.",
        how:"Type your answer or tap your choice, then press Check. Energies within 0.01 eV are accepted.",
        use:"Hydrogen’s energy levels: " + LEVELS + ".",
        items:[
          { id:"c1", kind:"num", goal:3, prompt:"Photon energy for 5 → 2?", answer:2.86, tol:0.01, unit:"eV", display:"2.86 eV",
            wrong:[{ match:3.94, fb:M1f("0.54", "3.40", "2.86") }],
            fb:"Photon energy = <i>E</i>(upper) − <i>E</i>(lower).",
            why:"−0.54 − (−3.40) = 2.86 eV.",
            hints:["The photon carries the gap.", "−0.54 − (−3.40).", "2.86 eV."] },
          { id:"c2", kind:"num", goal:3, prompt:"Energy needed to remove the electron completely from " + L(2) + "?", answer:3.40, tol:0.01, unit:"eV", display:"3.40 eV",
            wrong:[{ match:13.60, fb:"That’s from " + L(1) + "." }],
            fb:"Removing the electron means lifting it from its level all the way to 0 eV.",
            why:"From −3.40 eV up to 0 eV: 3.40 eV.",
            hints:["A removed electron has 0 eV.", "0 − (−3.40).", "3.40 eV."] },
          { id:"c3", kind:"num", goal:3, prompt:"How many different lines can atoms excited to " + L(5) + " produce?", answer:10, tol:0, unit:"lines", display:"10 lines", keypad:"numeric",
            wrong:[{ match:4, fb:"Count every pair of levels: 5 × 4 ÷ 2." }],
            fb:"Count every pair of levels from 1 to 5.",
            why:"5 × 4 ÷ 2 = 10.",
            hints:["Each line joins two levels.", "Count the pairs among levels 1 to 5: " + "`n(n - 1) ÷ 2`" + ".", "5 × 4 ÷ 2 = 10."] },
          { id:"c4", kind:"chips", goal:4, prompt:"<strong>Investigation:</strong> Why must a flame-test wire be cleaned between samples?",
            options:[
              { t:"Traces of one salt (especially sodium’s bright yellow) can hide another’s colour", ok:true, why:"Contamination adds another element’s lines." },
              { t:"So the wire cools down before the next test", why:"Contamination adds another element’s lines." },
              { t:"So the wire itself doesn’t glow", why:"Contamination adds another element’s lines." },
              { t:"To make the flame hotter", why:"Contamination adds another element’s lines." }],
            hints:["What could be left on the wire from the last sample?", "A trace of the last salt gives out its own lines too.", "Traces of one salt (especially sodium’s bright yellow) can hide another’s colour."] },
          { id:"c5", kind:"multi", star:true, goal:4, prompt:"Which of these photons can a ground-state hydrogen atom absorb: 10.20, 11.00, 12.09, 13.00 eV? (Select all.)",
            options:[
              { t:"10.20 eV", ok:true, why:"Exactly the 1 → 2 gap." },
              { t:"11.00 eV", why:"Not a gap: it passes through." },
              { t:"12.09 eV", ok:true, why:"Exactly the 1 → 3 gap." },
              { t:"13.00 eV", why:"Not a gap either (5 → 1 is 13.06 eV), and it’s below the 13.60 eV ionization energy: it passes through." }],
            why:"10.20 eV (1 → 2) and 12.09 eV (1 → 3) match gaps exactly. " + M3,
            hints:["List the gaps from " + L(1) + ": 10.20, 12.09, 12.75, 13.06, 13.22 eV.", "Which photons match one of them exactly?", "10.20 and 12.09."] },
          { id:"c6", kind:"num", star:true, goal:3, prompt:"An electron falls 6 → 2, then 2 → 1. Total energy given out?", answer:13.22, tol:0.01, unit:"eV", display:"13.22 eV",
            wrong:[{ match:3.02, fb:"Add the second photon: 10.20." }, { match:10.20, fb:"Add the first photon: 3.02." }],
            fb:"Add the energies of the two photons.",
            why:"3.02 + 10.20 = 13.22 eV: the same as one fall from 6 to 1.",
            hints:["Two falls, two photons.", "3.02 eV + 10.20 eV.", "13.22 eV."] },
          { id:"c7", kind:"two", star:true, goal:4, prompt:"A photon of 14.00 eV hits a ground-state atom. What happens, and how much energy does the freed electron carry away?",
            options:[
              { t:"The atom ionizes: the electron is removed", ok:true },
              { t:"The electron jumps to " + L(6), why:"A jump to " + L(6) + " needs exactly 13.22 eV. Is 14.00 eV more than the 13.60 eV ionization energy?" },
              { t:"The photon passes straight through", why:"14.00 eV is more than the 13.60 eV ionization energy, so it can remove the electron outright." }],
            answer:0.40, tol:0.01, unit:"eV", display:"ionization; 0.40 eV of motion", label:"Energy the freed electron carries away:",
            fb:"13.60 eV frees it; the rest, 0.40 eV, is motion.",
            hints:["Is 14.00 eV more than the ionization energy?", "Yes, by 14.00 − 13.60.", "The electron leaves with 0.40 eV."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Hadiya", how:"", goal:[3, 4],
        instruction:"Hadiya made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the energy of the photon emitted when the electron falls from " + L(4) + " to " + L(2) + ".",
            steps:["`E_4` = −0.85 eV and `E_2` = −3.40 eV.", "Photon energy = 0.85 + 3.40 = 4.25 eV.", "That’s above 3.1 eV, so the photon is ultraviolet."],
            answer:1,
            stepFb:["Correct. Keep checking.", "", "This follows from step 2."],
            fixes:[
              { t:"Photon energy = `E_4 - E_2` = −0.85 − (−3.40) = 2.55 eV: visible, blue-green (486 nm).", ok:true, why:"The photon carries the gap between the levels." },
              { t:"Photon energy = 3.40 − 0.85 = −2.55 eV.", why:"Energies of emitted photons are positive." },
              { t:"Photon energy = −0.85 × −3.40.", why:"Multiply? No: subtract." },
              { t:"Step 2 is correct.", why:M1 }],
            hints:["The photon carries the gap.", "Gap = higher − lower.", "2.55 eV."] },
          { id:"e2", goal:4, task:"Will a ground-state hydrogen atom absorb an 11.00 eV photon?",
            steps:["The gap from " + L(1) + " to " + L(2) + " is 10.20 eV.", "11.00 eV is more than 10.20 eV.", "So the atom absorbs it and jumps to " + L(2) + ", keeping the extra 0.80 eV.", "Then it emits a 10.20 eV photon."],
            answer:2,
            stepFb:["Correct.", "Correct.", "", "This builds on step 3."],
            fixes:[
              { t:"11.00 eV matches no gap from " + L(1) + " (the next is 12.09 eV), and it’s below the 13.60 eV ionization energy, so the photon passes through.", ok:true, why:"For a jump between levels the photon must match the gap exactly." },
              { t:"It jumps to " + L(3) + ".", why:"That needs 12.09 eV exactly." },
              { t:"The atom ionizes.", why:"That needs 13.60 eV." },
              { t:"Step 3 is correct.", why:M3 }],
            hints:["Must the photon match exactly?", "Yes, for jumps between levels.", "No match: it passes through."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you on the ladder: photons passing straight through, or lines you couldn’t see?" },
      { id:"j2", q:"In your own words, why do line spectra prove that electron energies are fixed?" },
      { id:"j3", q:"Explain to a friend how to find a photon’s energy from an energy-level diagram." },
      { id:"j4", q:"Which part (signs, regions or counting lines) still trips you up? How will you practise it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In Bohr’s model, when does a hydrogen atom emit light?", options:[
          { t:"When its electron falls from a higher energy level to a lower one", ok:true, why:"Falling down emits a photon whose energy matches the gap." },
          { t:"When its electron jumps to a higher level", why:M4 },
          { t:"While its electron stays in one level", why:M4 },
          { t:"Whenever the atom is heated, at any energy", why:"Heat lifts electrons; light comes as they fall." }] },
        b:{ prompt:"In Bohr’s model, when can a photon lift the electron to a higher level?", options:[
          { t:"When the photon’s energy exactly matches the gap", ok:true, why:"Only an exact match is absorbed for a jump between levels." },
          { t:"Whenever its energy is at least as big as the gap", why:M3 },
          { t:"Whenever it is visible light", why:"Many gaps aren’t visible." },
          { t:"Only when the atom is cold", why:"Temperature affects which level electrons start from, not this rule." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which transition produces hydrogen’s red line (656 nm)?", options:[
          { t:"3 → 2", ok:true, why:"1.89 eV, the smallest visible gap: red." },
          { t:"2 → 1", why:"That’s UV." },
          { t:"6 → 2", why:"That’s violet." },
          { t:"4 → 3", why:"That’s IR." }] },
        b:{ prompt:"In which region are transitions that end at " + L(1) + "?", options:[
          { t:"Ultraviolet", ok:true, why:"Falls to " + L(1) + " are the biggest gaps (10.20 eV and up): UV." },
          { t:"Visible", why:M5 },
          { t:"Infrared", why:"Those gaps are the largest: UV." },
          { t:"Radio", why:"Far too low in energy." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"What is an emission line spectrum?", options:[
          { t:"Bright lines at certain wavelengths, given off by a hot gas", ok:true, why:"A hot gas gives out only the photons that match its gaps." },
          { t:"A full rainbow of colours", why:"That’s continuous." },
          { t:"Dark lines on a rainbow", why:"That’s absorption." },
          { t:"White light only", why:"The lines are separate colours." }] },
        b:{ prompt:"A cool gas sits between a white light and a prism. What appears?", options:[
          { t:"Dark lines on a rainbow, at wavelengths the gas would emit", ok:true, why:"The gas absorbs the photons that match its gaps, leaving dark lines." },
          { t:"Bright lines on black", why:"That’s emission." },
          { t:"A plain rainbow", why:"The gas removes certain wavelengths." },
          { t:"Nothing", why:"Light still passes through." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Using the energy levels, what is the energy of the photon emitted in a fall from " + L(5) + " to " + L(2) + "?", use:LEVELS + ".", options:[
          { t:"2.86 eV", ok:true, why:"−0.54 − (−3.40)." },
          { t:"3.94 eV", why:M1f("0.54", "3.40", "2.86") },
          { t:"13.06 eV", why:"That’s 5 → 1." },
          { t:"0.54 eV", why:"That’s one level, not the gap." }] },
        b:{ prompt:"What is the energy of the photon emitted in a fall from " + L(6) + " to " + L(2) + "?", use:LEVELS + ".", options:[
          { t:"3.02 eV", ok:true, why:"−0.38 − (−3.40)." },
          { t:"3.78 eV", why:M1f("0.38", "3.40", "3.02") },
          { t:"13.22 eV", why:"That’s 6 → 1." },
          { t:"0.38 eV", why:"That’s one level." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A sample of hydrogen atoms has electrons excited to levels up to " + L(5) + ". How many different emission lines can it produce?", options:[
          { t:"10", ok:true, why:"5 × 4 ÷ 2." },
          { t:"4", why:"That counts only falls to " + L(1) + "." },
          { t:"5", why:"Count pairs of levels." },
          { t:"20", why:"Each pair counts once: divide by 2." }] },
        b:{ prompt:"A sample of hydrogen atoms has electrons excited to levels up to " + L(6) + ". How many different emission lines can it produce?", options:[
          { t:"15", ok:true, why:"6 × 5 ÷ 2." },
          { t:"5", why:"That counts only falls to " + L(1) + "." },
          { t:"6", why:"Count pairs of levels." },
          { t:"30", why:"Divide by 2." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"Which photon can a ground-state hydrogen atom absorb?", use:LEVELS + ".", options:[
          { t:"10.20 eV", ok:true, why:"Exactly the 1 → 2 gap." },
          { t:"1.89 eV", why:"That gap starts at " + L(2) + ", not 1." },
          { t:"11.00 eV", why:"No gap matches." },
          { t:"5.00 eV", why:M3 }] },
        // Plan wording plus "lifting the electron to a higher level": 10.20 eV is more than the 3.40 eV needed to ionize
        // from n = 2, so without the clause it would also be absorbed (deviation, see report).
        b:{ prompt:"An atom with its electron at " + L(2) + " is hit by four photons. Which one is absorbed, lifting the electron to a higher level?", use:LEVELS + ".", options:[
          { t:"2.55 eV", ok:true, why:"Exactly the 2 → 4 gap." },
          { t:"2.00 eV", why:M3 },
          { t:"10.20 eV", why:"That’s the 1 → 2 gap; from " + L(2) + " the gaps are different. (10.20 eV is more than the 3.40 eV needed to remove the electron from " + L(2) + ", so it would ionize the atom, not lift the electron to a level.)" },
          { t:"1.00 eV", why:M3 }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why hydrogen gives a line spectrum, not a continuous one?", options:[
          { t:"“Its electron can only have certain energies, so only photons matching the gaps between levels are emitted.”", ok:true, why:"Fixed levels mean fixed gaps, so only certain photons, and only certain lines." },
          { t:"“Hydrogen is a small atom.”", why:"Size doesn’t explain lines." },
          { t:"“The prism only lets some colours through.”", why:"A prism spreads all colours." },
          { t:"“Hydrogen’s electrons move in every possible orbit.”", why:"Then the spectrum would be continuous." }] },
        b:{ prompt:"Which is the best explanation of why each element has its own line spectrum?", options:[
          { t:"“Each element has a different set of energy levels, so its gaps, and its photons, are unique.”", ok:true, why:"Different levels, different gaps, different lines." },
          { t:"“Each element has a different mass.”", why:"Mass doesn’t set photon energies." },
          { t:"“Each element is a different colour as a solid.”", why:"Spectra come from atoms’ energy gaps." },
          { t:"“Bohr’s model applies equally to all elements.”", why:M6 }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"On an energy-level diagram, which arrow shows the emission of hydrogen’s violet 410 nm line?", options:[
          { t:"Downward from " + L(6) + " to " + L(2), ok:true, why:"3.02 eV, the largest visible gap: violet." },
          { t:"Downward from " + L(3) + " to " + L(2), why:"That’s red." },
          { t:"Upward from " + L(2) + " to " + L(6), why:"Upward is absorption." },
          { t:"Downward from " + L(6) + " to " + L(1), why:"That’s UV." }] },
        b:{ prompt:"Which arrow shows hydrogen <strong>absorbing</strong> the 486 nm (blue-green) photon?", options:[
          { t:"Upward from " + L(2) + " to " + L(4), ok:true, why:"Absorbing 2.55 eV lifts the electron from 2 to 4." },
          { t:"Downward from " + L(4) + " to " + L(2), why:"Downward is emission." },
          { t:"Upward from " + L(1) + " to " + L(4), why:"That gap is 12.75 eV: UV." },
          { t:"Upward from " + L(2) + " to " + L(3), why:"That’s 656 nm." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"An astronomer sees dark lines at 410, 434, 486 and 656 nm in a star’s spectrum. What can she conclude?", options:[
          { t:"The star’s outer layers contain hydrogen", ok:true, why:"These are exactly hydrogen’s visible lines, absorbed by hot hydrogen at " + L(2) + "." },
          { t:"The star contains sodium", why:"Sodium’s line is at 589 nm." },
          { t:"The star contains no hydrogen", why:"These are exactly hydrogen’s lines." },
          { t:"The star is cold", why:"Visible hydrogen absorption needs a hot gas (atoms at " + L(2) + ")." }] },
        b:{ prompt:"Why could helium be discovered in the Sun before it was found on Earth?", options:[
          { t:"Its spectral line in sunlight matched no known element", ok:true, why:"An unmatched line meant an unknown element." },
          { t:"Helium only exists in the Sun", why:"It was later found on Earth." },
          { t:"The Sun is made only of helium", why:"The Sun is mostly hydrogen." },
          { t:"Helium was seen in gold-foil experiments", why:"Gold foil showed the nucleus, not helium." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A salt gives a lilac flame, and a spectroscope shows lines that match potassium’s reference spectrum. What does this show?", options:[
          { t:"The salt contains potassium", ok:true, why:"The whole set of lines matches potassium’s." },
          { t:"The salt contains every element with a purple line", why:"The whole set of lines must match." },
          { t:"The salt is pure, with nothing else in it", why:"Other lines could be hidden; only potassium is confirmed." },
          { t:"Nothing, because flame colours are just one wavelength", why:M7 }] },
        b:{ prompt:"A lab passes light through a vapourized drinking-water sample and sees absorption exactly at lead’s wavelengths. What does this show?", options:[
          { t:"The water contains lead", ok:true, why:"Absorption at exactly lead’s lines names lead." },
          { t:"The water contains no metals", why:"Absorption at lead’s lines means lead is present." },
          { t:"Only that the water is hot", why:"Wavelength matching identifies the element." },
          { t:"The lead is in an ionic compound", why:"The lines name the element, not its compound." }] } }
    ]
  },
  task:{
    title:"Light a sign", summary:"Light a sign",
    statement:"<p>Design a hydrogen sign by choosing exactly <strong>three</strong> electron falls. Your sign must meet every condition. Can you find all the answers?</p><ol class=\"bm-conds\"><li>Exactly two of the lines are visible.</li><li>Exactly one line is ultraviolet (for a hidden UV security mark).</li><li>No electron starts above level 4.</li></ol>",
    checks:["Exactly two visible lines", "Exactly one UV line", "No start above level 4"],
    tips:["Visible lines end at " + L(2) + ".", "UV lines end at " + L(1) + "; IR lines end at " + L(3) + " or higher.", "With starts ≤ 4, which visible falls are possible?"],
    explainPrompt:"Explain why every visible line in your sign ends at the same level, and why the UV line is invisible.",
    vocab:"Use the words energy level, photon, gap and wavelength.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Starting no higher than " + L(4) + " leaves only two visible falls, so both must be used. The UV line can be any fall to " + L(1) + "."
  },
  cards:[
    ["Energy level", "One of the fixed energies an electron can have (" + "`n = 1, 2, 3, …`" + ")."],
    ["Photon", "A packet of light energy; its energy equals the gap the electron jumps."],
    ["Emission", "The electron falls; a photon is given off."],
    ["Absorption", "The electron jumps up; the photon’s energy must match the gap exactly."],
    ["Photon energy", "<i>E</i>(upper) − <i>E</i>(lower), e.g. −1.51 − (−3.40) = 1.89 eV."],
    ["Energy vs wavelength", "Bigger gap → higher energy → shorter wavelength."],
    ["Hydrogen’s visible lines", "Falls to " + L(2) + ": 656 (red), 486, 434, 410 nm (violet)."],
    ["Falls to " + L(1), "Ultraviolet."],
    ["Falls to " + "`n ≥ 3`", "Infrared."],
    ["Number of lines from level " + "`n`", "`n(n - 1) ÷ 2`" + "."],
    ["Absorption spectrum", "Dark lines on a rainbow, where the gas absorbs."],
    ["Bohr’s limit", "Exact only for one-electron atoms such as hydrogen."]
  ]
};
