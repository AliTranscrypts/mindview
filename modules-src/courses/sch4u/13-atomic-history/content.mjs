// SCH4U 13 Atomic History. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/13-atomic-history.md
// The pictures (hero timeline and gold-foil storyboard, Model timeline cards, cathode ray tube, gold-foil lab, the
// Part 3 data graph and rink zoom, the task preview) are drawn by app.js. Model counts live in app.js (plan §4).

const N = " ";                                   // narrow no-break space for 100 000 and 1/100 000
const R = (a, b) => a + " : " + b;           // ratios such as 1 : 2 (no line break inside)
const TINY = "1/100" + N + "000";

// Misconception core sentences (plan §3)
const M1 = "Electrons are about 7000 times lighter than an alpha particle. Only a massive, positive nucleus can turn one around.";
const M2 = "Almost every alpha particle went straight through: the atom is mostly empty space.";
const M3 = "Each model explained the evidence of its time. New evidence refined it.";
const M4 = "The beam bends toward the <strong>positive</strong> plate, so the particles are negative.";
const M5 = "The nucleus is about " + TINY + " of the atom’s width: a grain of sand in a hockey rink.";
const M6 = "Rutherford’s model said nothing about electron energies. Spectra needed Bohr.";
const M7 = "The ratio is any small whole-number ratio: " + R(1, 2) + ", " + R(2, 3) + ", and so on.";

// Practice 1: model ↔ evidence (plan Activity 1)
const PAIRS = [
  ["Dalton’s atoms", "Elements combine in fixed whole-number mass ratios", "Solid, indivisible atoms combine in fixed numbers, so their masses come in fixed ratios."],
  ["Thomson’s electron", "Cathode rays bend toward a + plate, from any metal", "A negative particle that every metal gives off: the electron."],
  ["Millikan’s charge", "Charged oil drops held still between plates", "Balancing a drop’s weight with the electric push gave the charge on one electron."],
  ["Rutherford’s nucleus", "A few alpha particles bounce back from gold foil", "Only a tiny, dense, positive centre can turn an alpha particle straight back."],
  ["Chadwick’s neutron", "A neutral particle with about a proton’s mass, knocked out of nuclei", "No charge, about a proton’s mass: the neutron."],
  ["Bohr’s energy levels", "Hydrogen’s light shows only certain colours", "Fixed energy levels mean only certain energy jumps, so only certain colours."],
  ["Quantum mechanical orbitals", "Electrons behave like waves; exact paths can’t be known", "Waves have no exact path, so orbitals give where an electron is likely to be."]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const MATCH_H1 = "Put the models in time order.", MATCH_H2 = "Each was built to explain one new observation.";

export default {
  id:"13-atomic-history",
  kind:"topic",
  title:"Atomic history",
  topic:"Atomic History",
  readyTopic:"atomic history",
  hero:{
    headline:"Every model was the best answer to the evidence of its day",
    text:"Nobody has seen inside an atom directly. Chemists built <strong>models</strong> to explain what they could measure, such as mass ratios, glowing beams and bouncing <strong>alpha particles</strong>. When an observation didn’t fit, the model changed. The biggest change came from a sheet of gold foil.",
    fig:{ html:'<div class="ah-hx"><svg class="ah-hx-svg" id="ah-hx-svg" viewBox="0 0 480 330" role="img" aria-label="A timeline of five atom pictures: a solid ball (1808), a plum pudding (1904), a nucleus with orbiting electrons (1911), rings of energy levels (1913) and a fuzzy orbital cloud (1926). Below it, a stream of alpha particles flies at a column of gold atoms drawn as plum puddings, and all pass straight through. The puddings then shrink into tiny nuclei; most particles pass straight, a few swerve, and one bounces straight back. Counter: 1 in 8000."></svg><div class="ah-hx-row"><p class="ah-hx-ctr" id="ah-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ah-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can describe the Dalton, Thomson, Rutherford, Bohr and quantum mechanical models and the key evidence for each.",
    "I can explain how the gold-foil results led to the nuclear model.",
    "I can use data, such as mass ratios and deflection counts, as evidence for or against a model.",
    "I can explain each model’s limits and why it was replaced.",
    "I can describe Rutherford’s work at McGill and apply these ideas to new situations."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Subatomic particles", goal:1,
          prompt:"Which particle has a negative charge and very little mass?",
          options:[
            { t:"The electron", ok:true, why:"Electrons carry the negative charge, with about 1/1800 of a proton’s mass." },
            { t:"The proton", why:"Positive, about 1800 times heavier than an electron." },
            { t:"The neutron", why:"Neutral." },
            { t:"The alpha particle", why:"Positive: 2 protons and 2 neutrons." }],
          hints:["Which particle orbits the nucleus?", "It’s about 1/1800 of a proton’s mass.", "The electron."] },
        { id:"w2", skill:"Subatomic particles", goal:2,
          prompt:"An alpha particle is made of…",
          options:[
            { t:"2 protons and 2 neutrons (a helium nucleus)", ok:true, why:"A helium nucleus: 2p + 2n, charge 2+." },
            { t:"2 electrons", why:"That would be negative." },
            { t:"1 proton", why:"That’s a hydrogen nucleus." },
            { t:"A photon", why:"Alpha particles have mass and charge." }],
          hints:["It has a charge of 2+.", "It’s the nucleus of a light element.", "Helium: 2p, 2n."] },
        { id:"w3", skill:"Charges and forces", goal:2,
          prompt:"Two positive charges are brought close together. They…",
          options:[
            { t:"Repel, more strongly the closer they get", ok:true, why:"Like charges repel, and the force grows as the distance shrinks." },
            { t:"Attract", why:"Like charges repel." },
            { t:"Don’t affect each other", why:"Charges exert forces." },
            { t:"Repel, more weakly when closer", why:"The force grows as the distance shrinks." }],
          hints:["Like charges…", "…repel.", "Closer means stronger."] },
        { id:"w4", skill:"Charges and forces", goal:3,
          prompt:"A beam of negative particles passes between a positive plate and a negative plate. It bends…",
          options:[
            { t:"Toward the positive plate", ok:true, why:"Opposites attract." },
            { t:"Toward the negative plate", why:"Like charges repel." },
            { t:"Straight on", why:"Charged particles feel the plates." },
            { t:"Back the way it came", why:"The plates bend it sideways." }],
          hints:["Negative is attracted to…", "…positive.", "Toward the + plate."] },
        { id:"w5", skill:"Evidence and inference", goal:3,
          prompt:"Which is an <strong>observation</strong> rather than an inference?",
          options:[
            { t:"Most alpha particles passed straight through the foil", ok:true, why:"That’s what was seen and counted: an observation." },
            { t:"The atom is mostly empty space", why:"That’s what the observation suggests: an inference." },
            { t:"The nucleus is positive", why:"An inference." },
            { t:"Electrons orbit the nucleus", why:"A model, not an observation." }],
          hints:["An observation is what was measured or seen.", "An inference explains it.", "Particles passing through is what was seen."] },
        { id:"w6", skill:"Evidence and inference", goal:4,
          prompt:"A new, reliable observation contradicts a model. What should scientists do?",
          options:[
            { t:"Revise or replace the model so it explains all the evidence", ok:true, why:"A model has to explain all the reliable evidence." },
            { t:"Ignore the observation", why:"Reliable evidence can’t be ignored." },
            { t:"Keep the model, because it’s older", why:"Age isn’t evidence." },
            { t:"Stop using models", why:"Models are how we explain what we can’t see." }],
          hints:["What’s a model for?", "To explain evidence.", "Revise it."] }
      ],
      refreshers:{
        "Subatomic particles":"Protons (+, mass 1), neutrons (0, mass 1), electrons (−, mass ≈ 1/1800). An alpha particle is a helium nucleus: 2p + 2n, charge 2+.",
        "Charges and forces":"Like charges repel; opposites attract; the force grows quickly as charges get closer.",
        "Evidence and inference":"Observations are measured; inferences explain them; models tie the inferences together."
      }
    }
  },
  explore:{
    heading:"Model timeline",
    intro:"Step through the models. In each lab, run the experiment that changed everyone’s mind.",
    how:"Choose a mode. <strong>Play</strong>, <strong>Step</strong> and <strong>Reset</strong> run each one; the readouts update as you change the controls.",
    modes:[{ id:"tl", t:"Timeline" }, { id:"crt", t:"Cathode ray tube" }, { id:"gf", t:"Gold foil" }],
    cards:[
      { id:"dalton", name:"Dalton", year:"1808", sub:"Solid, indivisible atoms",
        explained:"Fixed mass ratios in compounds, and why mass is conserved in a reaction: atoms join and separate but don’t change.",
        couldnt:"Cathode rays: tiny negative particles come out of atoms, so atoms aren’t indivisible.",
        evidence:"Elements combine in fixed whole-number mass ratios." },
      { id:"thomson", name:"Thomson", year:"1904", sub:"Electrons embedded in a positive sphere (plum pudding)",
        explained:"Electrons in every atom, and why atoms are neutral: the positive sphere balances the electrons.",
        couldnt:"A few alpha particles bouncing straight back from gold foil.",
        evidence:"Cathode rays bend toward the + plate and come from every metal." },
      { id:"rutherford", name:"Rutherford", year:"1911", sub:"A tiny, dense, positive nucleus in mostly empty space",
        explained:"Most alpha particles pass straight through (empty space); a very few bounce back (a tiny nucleus).",
        couldnt:"Why electrons don’t spiral into the nucleus, or why atoms give off light only at certain colours.",
        evidence:"Gold foil: about 1 in 8000 alpha particles bounced back." },
      { id:"bohr", name:"Bohr", year:"1913", sub:"Electrons in fixed energy levels",
        explained:"Hydrogen’s line spectrum: each colour is one jump between fixed levels (module 14).",
        couldnt:"Atoms with more than one electron, and the fact that an electron can’t be pinned to an exact path.",
        evidence:"Line spectra: hydrogen glows only at certain colours." },
      { id:"qm", name:"Quantum mechanical", year:"1926", sub:"Orbitals: clouds of probability",
        explained:"Electrons behave like waves; orbitals give where an electron is likely to be, in every atom (module 15).",
        couldnt:"It’s today’s model. It keeps being refined, not thrown out.",
        evidence:"Electrons behave like waves; exact paths can’t be known." }
    ],
    // TC3 evidence board: answer = the model each piece of evidence ruled out or couldn’t explain
    evidence:[
      { id:"e1", t:"Cathode rays come from every metal.", answer:"dalton" },
      { id:"e2", t:"A few alpha particles bounce back.", answer:"thomson" },
      { id:"e3", t:"Hydrogen glows only at four visible colours.", answer:"rutherford" },
      { id:"e4", t:"An electron can’t be pinned to an exact path.", answer:"bohr" }
    ],
    targets:["dalton", "thomson", "rutherford", "bohr"],
    crtNote:"Model values: the plates move the beam 1 unit toward the + plate per kV; the magnet moves it 1 unit per step of strength.",
    gfNote:"Counts are model values per 8000 alpha particles. 40 of the paths are drawn, and any rare large turn is always among them. Nuclei are drawn far larger than scale.",
    predictions:[
      { id:"p1", prompt:"Gold foil, plum pudding. If atoms were plum puddings, what would the alpha particles do?",
        options:[{ t:"Almost all pass through, barely deflected", ok:true }, { t:"Many bounce back" }, { t:"All stop in the foil" }, { t:"Half pass, half bounce" }],
        explain:"The positive charge is spread thin, so nothing pushes hard enough to turn an alpha particle around." },
      { id:"p2", prompt:"Nuclear model, nucleus " + TINY + " of the atom’s width. Out of 8000 alpha particles, about how many bounce back past 90°?",
        options:[{ t:"About 1", ok:true }, { t:"About 4000" }, { t:"None" }, { t:"All 8000" }],
        explain:"A direct hit on the tiny nucleus is rare, but when it happens the repulsion is huge." },
      { id:"p3", prompt:"Nucleus width 1/10" + N + "000 (10 times wider). What happens to the bounce-backs?",
        options:[{ t:"About 100 times more", ok:true }, { t:"10 times more" }, { t:"No change" }, { t:"They stop" }],
        explain:"A 10-times-wider target is 100 times bigger in area." },
      { id:"p4", prompt:"Cathode ray tube, plates at 3 kV. Which way does the beam bend?",
        options:[{ t:"Toward the + plate", ok:true }, { t:"Toward the − plate" }, { t:"No bending" }, { t:"It splits in two" }],
        explain:"Negative particles are attracted to the positive plate." }
    ],
    chalIntro:"Use the labs to meet each goal, then press <strong>Check challenge</strong>. Challenge 3 uses the <strong>Evidence board</strong> in Timeline mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[2, 3], prompt:"Set the gold-foil lab to reproduce Geiger and Marsden’s result.",
        why:"A nuclear atom with a nucleus " + TINY + " of its width: about 1 bounce-back in 8000, just as Geiger and Marsden counted.",
        hints:["About 1 in 8000 bounced back.", "That needs a nuclear model.", "The smallest nucleus: " + TINY + "."] },
      { id:"tc2", goal:[1, 3], prompt:"In the cathode ray tube, make the beam go <strong>straight</strong> while the plates are on.",
        why:"The magnet pushes the beam back exactly as hard as the plates pull it, so the beam goes straight.",
        hints:["The magnet can push the opposite way.", "Point it up.", "Match its strength to the plate setting. Thomson balanced the two to measure the electron’s charge-to-mass ratio."] },
      { id:"tc3", goal:[1, 4], stretch:true, prompt:"Drag each piece of evidence onto the model it <strong>ruled out</strong> or <strong>couldn’t explain</strong>.",
        why:M3 + " Cathode rays ended Dalton’s indivisible atom, the bounce-backs ended the plum pudding, line spectra needed Bohr’s levels, and electron waves replaced Bohr’s fixed orbits.",
        hints:["Each piece of evidence led to the <strong>next</strong> model.", "Who proposed the model just before that evidence arrived?",
          "Cathode rays from every metal → Dalton. A few bounce-backs → Thomson. Hydrogen’s four colours → Rutherford. No exact path → Bohr."] }
    ]
  },
  part3:{
    slug:"gold-foil", name:"Rutherford’s data", heading:"Read Rutherford’s data",
    intro:"Here you work from data, not the simulation: read a table of deflection counts, see just how small the nucleus is, and meet the Canadian chapter of Rutherford’s story.",
    s1:{ title:"Station 1: Check it with data",
      intro:"Geiger and Marsden counted the flashes on their screen at each angle. These model counts per hour are shaped like the real results.",
      angles:[5, 15, 30, 60, 120, 150], counts:[550000, 7000, 450, 32, 4, 2],
      ask:"Which inferences do the data support? Tap every one that fits, then press <strong>Check</strong>.",
      chips:[
        { id:"i1", t:"Most particles barely turn", ok:true, why:"550" + N + "000 per hour at 5°, far more than at any other angle." },
        { id:"i2", t:"Large turns are rare but real", ok:true, why:"Only 6 per hour past 90°, but they never drop to zero." },
        { id:"i3", t:"Atoms are solid", why:"Almost every particle passed through, so atoms are mostly empty space." },
        { id:"i4", t:"The deflecting object is negative", why:"A negative centre would pull the positive alpha particles around it, not push them straight back." }] },
    s2:{ title:"Station 2: How small?",
      intro:"Zoom from the atom to the nucleus. If an atom were a 60 m hockey rink, how big would its nucleus be?",
      result:"60 m ÷ 100" + N + "000 = 0.6 mm: a grain of sand at centre ice." },
    blocks:[
      { title:"Station 3: Rutherford in Montreal",
        // VERIFY: Rutherford's McGill dates (1898–1907), the work with Soddy, the naming of alpha and beta radiation, and the 1908 Nobel Prize in Chemistry (plan §6 risk 2); also the builder-added line that Geiger and Marsden ran the gold foil in his Manchester lab.
        html:"<p>From 1898 to 1907, at McGill University in Montreal, Ernest Rutherford and Frederick Soddy studied radioactivity. They showed that radioactive elements change into other elements, and they identified alpha and beta radiation. This work earned the 1908 Nobel Prize in Chemistry.</p><p>Alpha particles from radioactive sources later became his probe for the gold foil, run by Hans Geiger and Ernest Marsden in his lab in Manchester, England.</p>" }
    ],
    quickCheck:{
      title:"Quick check", summary:"Read Rutherford’s data quick check",
      items:[
        { id:"q1", goal:3, prompt:"In the table, what fraction of particles turn more than 90° (roughly)?",
          choices:[
            { t:"A tiny fraction", ok:true, fb:"Right. 6 per hour against hundreds of thousands." },
            { t:"About half", fb:"6 per hour against hundreds of thousands." },
            { t:"Most", fb:"6 per hour against hundreds of thousands." },
            { t:"None", fb:"6 per hour against hundreds of thousands." }] },
        { id:"q2", goal:3, prompt:"Why did the team use very thin foil?",
          choices:[
            { t:"So each particle meets at most one nucleus", ok:true, fb:"Right. Thick foil would mix many deflections together." },
            { t:"To make it cheaper", fb:"Thick foil would mix many deflections together." },
            { t:"To stop the alpha particles", fb:"Thick foil would mix many deflections together." },
            { t:"To make it magnetic", fb:"Thick foil would mix many deflections together." }] },
        { id:"q3", goal:5, prompt:"If the atom were a hockey rink, the nucleus would be about the size of…",
          choices:[
            { t:"a grain of sand", ok:true, fb:"Right. " + TINY + " of 60 m is 0.6 mm." },
            { t:"a hockey puck", fb:TINY + " of 60 m is 0.6 mm." },
            { t:"the net", fb:TINY + " of 60 m is 0.6 mm." },
            { t:"the whole rink", fb:TINY + " of 60 m is 0.6 mm." }] },
        { id:"q4", goal:5, prompt:"What did Rutherford study at McGill?",
          choices:[
            { t:"Radioactivity", ok:true, fb:"Right. The gold foil came later, in England." },
            { t:"Cathode rays", fb:"The gold foil came later, in England." },
            { t:"Line spectra", fb:"The gold foil came later, in England." },
            { t:"Oil drops", fb:"The gold foil came later, in England." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:"Model ↔ evidence", summary:"Model ↔ evidence", goal:[1, 4],
        instruction:"Match each model or discovery to the evidence it was built to explain.",
        leftTitle:"Model or discovery", rightTitle:"Evidence",
        left:PAIRS.map((p, i) => ({ id:"l" + (i + 1), t:p[0], why:p[2], hints:[MATCH_H1, MATCH_H2, p[0] + ": " + p[1].charAt(0).toLowerCase() + p[1].slice(1) + "."] })),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })),
        answer:MATCH_ANS,
        wrong:{ "l4|r2":"Cathode rays revealed electrons, not the nucleus.", "l6|r4":"The gold foil said nothing about electron energies." },
        wrongDefault:"Which observation was this model invented to explain?" },
      { id:"reason", type:"custom", title:"Reasoning from evidence", summary:"Reasoning from evidence", star:true, goal:[2, 3],
        instruction:"Six items: choices and number entry. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer or tap a choice, then press Check.",
        items:[
          { id:"r1", kind:"ratio", goal:3, prompt:"12.0 g of carbon combines with 16.0 g of oxygen in one compound and 32.0 g in another. What is the whole-number ratio of oxygen masses?",
            answer:[1, 2], display:R(1, 2), wrong:[{ match:[16, 32], fb:R(16, 32) + " is right but simplify: " + R(1, 2) + "." }, { match:[2, 1], fb:"Reversed: list the oxygen masses in the order the question gives them." }],
            simplify:"Right ratio, but simplify it to the smallest whole numbers.", fb:"Compare the two oxygen masses: divide each by the smaller one.",
            hints:["Compare the two oxygen masses for the same 12.0 g of carbon.", "16.0 : 32.0. Divide both by 16.0.", R(1, 2) + "."] },
          { id:"r2", kind:"chips", goal:2, prompt:"Thomson’s beam gave the same charge-to-mass ratio from every metal. What did this suggest?",
            options:[
              { t:"Electrons are in all atoms", ok:true, why:"Different metals, same particle." },
              { t:"Each metal gives off its own kind of particle", why:"Different metals, same particle." },
              { t:"The beam is a kind of light", why:"Light isn’t bent by charged plates. Different metals, same particle." },
              { t:"Atoms can’t be divided", why:"A particle came out of every atom, so atoms can be divided." }],
            hints:["The ratio didn’t depend on the metal.", "So the particle is the same in every metal.", "Electrons are in all atoms."] },
          { id:"r3", kind:"ratio", star:true, goal:3, prompt:"32.0 g of sulfur combines with 32.0 g of oxygen in one oxide and 48.0 g in another. Oxygen ratio?",
            answer:[2, 3], display:R(2, 3), wrong:[{ match:[1, 2], fb:M7 + " " + R(32, 48) + " = " + R(2, 3) + "." }, { match:[3, 2], fb:"Reversed: list the oxygen masses in the order the question gives them." }],
            simplify:"Right ratio, but simplify it to the smallest whole numbers.", fb:"Compare the two oxygen masses for the same 32.0 g of sulfur.",
            hints:["Compare 32.0 g and 48.0 g.", "Divide both by 16.0.", R(32, 48) + " = " + R(2, 3) + "."] },
          { id:"r4", kind:"chips", star:true, goal:3, prompt:"<strong>Investigation:</strong> Why did Geiger and Marsden count flashes on a screen at many angles, not just straight ahead?",
            options:[
              { t:"To measure how often each size of deflection happens", ok:true, why:"Counting at every angle shows how many particles turn by each amount, including the rare large turns." },
              { t:"To count the particles that passed straight through", why:"Straight ahead only shows the particles that didn’t turn." },
              { t:"To make the experiment faster", why:"Straight ahead only shows the particles that didn’t turn." },
              { t:"Because the screen only glows at large angles", why:"The screen glows wherever a particle hits it. Straight ahead only shows the particles that didn’t turn." }],
            hints:["What would a screen straight ahead miss?", "The particles that turned.", "Counting at many angles measures how often each size of turn happens."] },
          { id:"r5", kind:"num", star:true, goal:2, prompt:"The foil is made twice as thick (still thin). Predict the number of bounce-backs per 8000.",
            answer:2, unit:"per 8000", display:"about 2 per 8000",
            wrong:[{ match:1, fb:"Twice as many nuclei lie in the path." }, { match:4, fb:"Thickness adds nuclei in a line, not in area." }],
            fb:"How many more nuclei lie in each particle’s path when the foil is twice as thick?",
            hints:["The thin foil gave about 1 bounce-back per 8000.", "Twice the thickness puts twice as many nuclei in each particle’s path.", "1 × 2 = about 2 per 8000."] },
          { id:"r6", kind:"chips", star:true, goal:2, prompt:"Imagine the nucleus were <strong>negative</strong>. How would the large deflections change?",
            options:[
              { t:"Alpha particles would be pulled around the nucleus, not pushed straight back", ok:true, why:"Attraction swings a particle around; only repulsion turns a head-on particle straight back." },
              { t:"Even more alpha particles would bounce straight back", why:"Attraction swings a particle around; only repulsion turns a head-on particle straight back." },
              { t:"Nothing would change", why:"Attraction swings a particle around; only repulsion turns a head-on particle straight back." },
              { t:"The alpha particles would all pass straight through", why:"A negative nucleus still pulls hard on a nearby positive particle. Attraction swings a particle around; only repulsion turns a head-on particle straight back." }],
            hints:["Alpha particles are positive.", "A negative nucleus would attract them.", "Attraction curves the path around the nucleus, so head-on bounce-backs wouldn’t happen."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Gideon", how:"", goal:[1, 2],
        instruction:"Gideon made one mistake in each explanation. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Explain the gold-foil results.",
            steps:["Most alpha particles passed straight through.", "So the atom is mostly empty space.", "A few bounced back because they hit electrons.", "So electrons are concentrated in the centre."],
            answer:2,
            stepFb:["Correct. Keep checking.", "Correct.", "", "This follows from step 3."],
            fixes:[
              { t:"They bounced off a tiny, dense, positive nucleus; electrons are far too light to turn an alpha particle around.", ok:true, why:M1 },
              { t:"They bounced off neutrons.", why:"Neutrons are neutral; the bounce needs strong repulsion." },
              { t:"They bounced off the gold surface.", why:M2 },
              { t:"Step 3 is correct.", why:M1 }],
            hints:["Compare an electron’s mass with an alpha particle’s.", "About 7000 times lighter.", "Only a massive, positive centre could do it."] },
          { id:"e2", goal:1, task:"Explain Thomson’s cathode ray evidence.",
            steps:["A beam came from the cathode in every metal tested.", "The beam bent toward the negative plate.", "So the particles are positive.", "So every atom contains positive particles that can be pulled out."],
            answer:1,
            stepFb:["Correct.", "", "This follows from step 2.", "This builds on step 3."],
            fixes:[
              { t:"The beam bent toward the <strong>positive</strong> plate, so the particles are negative: electrons, found in every atom.", ok:true, why:M4 + " They come from every metal, so every atom has them." },
              { t:"The beam didn’t bend at all.", why:"It did." },
              { t:"The beam bent toward the magnet.", why:"The plates show the charge." },
              { t:"Step 2 is correct.", why:M4 }],
            hints:["Opposite charges attract.", "A negative beam is pulled toward…", "…the positive plate."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: how empty the atom is, or how rare the bounce-backs were?" },
      { id:"j2", q:"In your own words, why did one bounce in 8000 change the model of the atom?" },
      { id:"j3", q:"Explain to a friend why scientists replace models instead of throwing out science." },
      { id:"j4", q:"Which model’s evidence is still fuzzy for you? What will you review?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"What did Thomson’s cathode ray experiments show?", options:[
          { t:"Atoms contain small negative particles (electrons)", ok:true, why:"The beam bent toward the + plate and came from every metal: small negative particles in all atoms." },
          { t:"Atoms have a tiny dense nucleus", why:"That was Rutherford." },
          { t:"Electrons occupy energy levels", why:"That was Bohr." },
          { t:"Atoms are indivisible", why:"Thomson showed the opposite." }] },
        b:{ prompt:"What did Rutherford conclude from the gold foil?", options:[
          { t:"The atom has a tiny, dense, positive nucleus", ok:true, why:"Most particles went straight through, but a few bounced back: a tiny, dense, positive centre." },
          { t:"Atoms contain electrons", why:"That was Thomson." },
          { t:"Electrons have fixed energies", why:"That was Bohr." },
          { t:"Atoms are solid spheres", why:M2 }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In the gold-foil experiment, what did <strong>most</strong> alpha particles do?", options:[
          { t:"Passed straight through", ok:true, why:M2 },
          { t:"Bounced back", why:"Only about 1 in 8000." },
          { t:"Stuck in the foil", why:"Most passed through." },
          { t:"Turned into electrons", why:"They stayed alpha particles." }] },
        b:{ prompt:"About what fraction of the alpha particles bounced back past 90°?", options:[
          { t:"About 1 in 8000", ok:true, why:"Rare, but real: that was the surprise." },
          { t:"About half", why:M2 },
          { t:"None", why:"A few did; that was the surprise." },
          { t:"Most", why:M2 }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Which was a problem with Rutherford’s model?", options:[
          { t:"It couldn’t explain why electrons don’t spiral into the nucleus, or why atoms give off only certain colours", ok:true, why:M6 },
          { t:"It had no nucleus", why:"It introduced the nucleus." },
          { t:"It had no electrons", why:"It had electrons around the nucleus." },
          { t:"It explained line spectra too well", why:M6 }] },
        b:{ prompt:"What did the discovery of the neutron explain?", options:[
          { t:"Why most atoms have more mass than their protons alone provide", ok:true, why:"Neutrons add about a proton’s mass each, with no charge." },
          { t:"Why cathode rays bend", why:"That’s the electron." },
          { t:"Why alpha particles bounce back", why:"That’s the positive nucleus." },
          { t:"Why hydrogen emits colours", why:"That’s Bohr’s levels." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"If the nucleus were 10 times wider than it really is, how would the number of bounce-backs change?", options:[
          { t:"About 100 times more", ok:true, why:"The target’s area grows by 10²." },
          { t:"About 10 times more", why:"Area, not width, sets the chance of a hit." },
          { t:"No change", why:M5 + " A bigger target is hit more often." },
          { t:"Fewer", why:"A bigger target is hit more often." }] },
        b:{ prompt:"If the foil were made 3 times thicker (still thin), how would the number of bounce-backs change?", options:[
          { t:"About 3 times more", ok:true, why:"Three times as many nuclei in the path." },
          { t:"About 9 times more", why:"Thickness adds nuclei in a line, not in area." },
          { t:"No change", why:"More nuclei, more hits." },
          { t:"Fewer", why:"More nuclei can’t mean fewer hits." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"32.0 g of sulfur combines with 32.0 g of oxygen in one oxide and with 48.0 g of oxygen in another. What is the ratio of oxygen masses?", options:[
          { t:R(2, 3), ok:true, why:R(32, 48) + " = " + R(2, 3) + "." },
          { t:R(1, 2), why:M7 },
          { t:R(1, 1), why:"The oxygen masses differ." },
          { t:R(3, 2), why:"Reversed." }] },
        b:{ prompt:"55.8 g of iron combines with 71.0 g of chlorine in one compound and with 106.5 g in another. What is the ratio of chlorine masses?", options:[
          { t:R(2, 3), ok:true, why:"71.0 : 106.5 = " + R(2, 3) + " (divide both by 35.5)." },
          { t:R(1, 2), why:M7 },
          { t:R(1, 1), why:"The chlorine masses differ." },
          { t:R(3, 2), why:"Reversed." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"A beam bends toward the positive plate, and its charge-to-mass ratio is the same for every cathode metal. What can you conclude?", options:[
          { t:"The beam is made of negative particles found in all atoms", ok:true, why:"Toward + means negative; the same ratio from every metal means the same particle in all atoms." },
          { t:"The particles are positive", why:M4 },
          { t:"The particles are different for each metal", why:"Same ratio, same particle." },
          { t:"The beam is light, not particles", why:"Light isn’t bent by charged plates." }] },
        b:{ prompt:"If cathode rays were neutral, what would the charged plates do to the beam?", options:[
          { t:"Nothing: the beam would go straight", ok:true, why:"Charged plates push only on charged particles." },
          { t:"Bend it toward +", why:"Only charged particles bend." },
          { t:"Bend it toward −", why:"Only charged particles bend." },
          { t:"Stop it", why:"Plates don’t stop neutral particles." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why the plum pudding model was rejected?", options:[
          { t:"“It predicts that no alpha particles turn sharply, but some bounced back. That needs a tiny, dense, positive centre.”", ok:true, why:"It names the prediction, the observation that broke it and what that observation needs." },
          { t:"“It had no electrons.”", why:"It did." },
          { t:"“Alpha particles bounced off its electrons.”", why:M1 },
          { t:"“It was too old.”", why:M3 }] },
        b:{ prompt:"Which is the best explanation of why Dalton’s model had to change?", options:[
          { t:"“Thomson found electrons inside every atom, so atoms aren’t indivisible.”", ok:true, why:"Electrons come out of atoms, so atoms have parts." },
          { t:"“Dalton’s mass ratios were wrong.”", why:"His ratios still hold." },
          { t:"“Atoms turned out to be bigger.”", why:"Size wasn’t the issue." },
          { t:"“The gold foil disproved it directly.”", why:"Electrons came first." }] } },
      { id:"c2", cat:"C", goal:1,
        a:{ prompt:"Which order of models is correct?", options:[
          { t:"Dalton → Thomson → Rutherford → Bohr → quantum mechanical", ok:true, why:"1808, 1904, 1911, 1913, 1926: each model followed the evidence that broke the one before." },
          { t:"Thomson → Dalton → Bohr → Rutherford → quantum", why:"Dalton came first; the nucleus came before energy levels." },
          { t:"Rutherford → Thomson → Dalton → Bohr → quantum", why:"Electrons were found before the nucleus." },
          { t:"Dalton → Rutherford → Thomson → quantum → Bohr", why:"The electron came before the nucleus; Bohr before the quantum model." }] },
        b:{ prompt:"Which description matches Thomson’s model?", options:[
          { t:"Electrons embedded in a sphere of spread-out positive charge", ok:true, why:"The plum pudding: negative electrons in a positive sphere." },
          { t:"A tiny positive nucleus with electrons around it", why:"That’s Rutherford." },
          { t:"Electrons in fixed energy levels", why:"That’s Bohr." },
          { t:"A solid indivisible ball", why:"That’s Dalton." }] } },
      { id:"a1", cat:"A", goal:5,
        // VERIFY: McGill result (radioactive elements change into other elements; with Soddy, 1898–1907; Nobel Prize 1908).
        a:{ prompt:"What did Rutherford’s work at McGill University show?", options:[
          { t:"Radioactive elements change into other elements as they give off radiation", ok:true, why:"With Frederick Soddy in Montreal, he showed that radioactive elements turn into other elements: the 1908 Nobel Prize in Chemistry." },
          { t:"Atoms have a nucleus", why:"That came later, in England." },
          { t:"Electrons exist", why:"That was Thomson." },
          { t:"Light comes in fixed colours", why:"That’s spectroscopy." }] },
        b:{ prompt:"A modern lab fires alpha particles at a thin foil of aluminium, whose nuclei carry much less positive charge than gold’s. Predict the large-angle deflections compared with gold.", options:[
          { t:"Fewer: the weaker repulsion turns fewer particles sharply", ok:true, why:"Less positive charge means a weaker push, so fewer sharp turns." },
          { t:"More: aluminium is lighter", why:"Charge, not lightness, sets the repulsion." },
          { t:"The same", why:"Nuclear charge matters." },
          { t:"None at all", why:"Aluminium nuclei still repel." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"If an atom were the size of a 60 m hockey rink, about how wide would its nucleus be?", options:[
          { t:"About 0.6 mm (a grain of sand)", ok:true, why:"60 m ÷ 100" + N + "000." },
          { t:"About 6 m", why:"That’s 1/10. " + M5 },
          { t:"About 60 cm", why:M5 },
          { t:"About 6 cm", why:"Still 100 times too big. " + M5 }] },
        b:{ prompt:"If a nucleus were 1 cm wide (a marble), about how wide would its atom be?", options:[
          { t:"About 1 km", ok:true, why:"1 cm × 100" + N + "000 = 1000 m." },
          { t:"About 10 cm", why:M5 },
          { t:"About 1 m", why:M5 },
          { t:"About 10 m", why:M5 }] } }
    ]
  },
  task:{
    title:"A model that fits", summary:"A model that fits",
    statement:"<p>Build an atom model that agrees with the gold-foil evidence. Can you find all the answers?</p><ol class=\"ah-conds\"><li>Most alpha particles pass straight through.</li><li>A very few bounce straight back.</li><li>The electrons are placed consistently with where the positive charge is.</li></ol>",
    qA:"A. Where are the positive charge and most of the mass?",
    optsA:[{ id:"spread", t:"Spread through the whole atom" }, { id:"tenth", t:"In a centre about 1/10 of the atom’s width" }, { id:"tiny", t:"In a centre about " + TINY + " of the atom’s width" }],
    qB:"B. Where are the electrons?",
    optsB:[{ id:"inside", t:"Scattered inside the positive material" }, { id:"moving", t:"Moving through the space around the centre" }, { id:"orbits", t:"In fixed circular orbits" }, { id:"cloud", t:"In a cloud of probability around the centre" }],
    checks:["Most pass straight", "A few bounce back", "Electrons placed consistently"],
    tips:["A centre 1/10 the atom’s width would turn far too many particles.", "Spread-out charge can’t turn any particle back.", "If the positive charge is a tiny centre, the electrons can’t be scattered inside it."],
    tipSpread:"With the positive charge spread through the atom, the electrons sit scattered inside it.",
    explainPrompt:"Explain how each part of the evidence fixes one feature of your model, and why the evidence can’t decide where the electrons are.",
    vocab:"Use the words nucleus, alpha particle, deflection and empty space.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"The gold foil can’t tell these three apart. It only shows where the positive charge is. Hydrogen’s light (module 14) and electron waves (module 15) decided between them."
  },
  cards:[
    ["Dalton (1808)", "Solid, indivisible atoms; compounds in fixed whole-number ratios."],
    ["Law of multiple proportions", "Masses of one element combining with a fixed mass of another are in small whole-number ratios."],
    ["Thomson (1897–1904)", "Cathode rays are electrons; plum pudding model."],
    ["Cathode ray evidence", "The beam bends toward the + plate; same from every metal."],
    ["Gold-foil observations", "Most alpha particles go straight; about 1 in 8000 bounces back."],
    ["Rutherford (1911)", "Tiny, dense, positive nucleus; atom mostly empty space."],
    ["Nucleus size", "About " + TINY + " of the atom’s width."],
    ["Rutherford’s gap", "Couldn’t explain stable electrons or line spectra."],
    ["Chadwick (1932)", "The neutron: neutral, about a proton’s mass."],
    ["Bohr (1913)", "Electrons in fixed energy levels; explains hydrogen’s colours."],
    // VERIFY: Rutherford at McGill; Nobel Prize 1908.
    ["Rutherford at McGill", "Showed radioactive elements change into others (Nobel Prize 1908)."]
  ]
};
