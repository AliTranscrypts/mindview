// SCH4U 49 Corrosion. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/49-corrosion.md
// Pictures (hero water drop, the Rusting simulator's drop view, side-by-side bars, nail tubes, the bridge map, the
// lead-pipe and aluminium sketches, the task's drop-and-scratch preview) are drawn by app.js. Reduction potentials
// come from MV.chem.data.E0 in app.js; the numbers below are the plan's wording.

const E = "<i>E</i>°";
const EC = "<i>E</i>°<sub>cell</sub>";

// Misconception core sentences (plan §3)
const M1 = "O₂ is the oxidizing agent. Salt only carries charge between the anode and the cathode, so the cell runs faster.";
const M2 = "A higher " + E + " means <em>more easily reduced</em>. The metal with the lower " + E + " gives up electrons: it’s the anode.";
const M3 = "A tin coat only blocks. Once scratched, iron (−0.45 V) is oxidized instead of tin (−0.14 V), so it rusts faster.";
const M4 = "Iron dissolves at the anode (the centre). Rust appears where Fe²⁺ meets OH⁻ from the cathode, between the centre and the edge.";
const M5 = EC + " = " + E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>, with both taken from the reduction table: 0.40 − (−0.45) = +0.85 V.";
const M6 = "Aluminium forms a thin, tight oxide layer that seals the metal underneath.";
const M7 = "The block must be wired or touching the steel so electrons can flow from it into the steel.";

export default {
  id:"49-corrosion",
  kind:"topic",
  title:"Corrosion",
  topic:"Corrosion",
  readyTopic:"corrosion",
  hero:{
    eq:'<span class="chem">2Fe(s) + O<sub>2</sub>(g) + 2H<sub>2</sub>O(l) → 2Fe<sup>2+</sup>(aq) + 4OH<sup>−</sup>(aq)</span>, <span class="nw">' + EC + " = +0.85 V</span>",
    eqLabel:"2 F e solid plus O 2 gas plus 2 H 2 O liquid gives 2 F e 2 plus aqueous plus 4 O H minus aqueous; E zero cell equals plus 0.85 volts",
    eqSize:"sm",
    headline:"Rust is a battery you didn’t ask for",
    text:"Wherever iron, <strong>water</strong> and <strong>oxygen</strong> meet, a tiny <strong>galvanic cell</strong> forms. Part of the iron becomes an <strong>anode</strong> and dissolves; another part becomes a <strong>cathode</strong> where oxygen is reduced. Stop the cell, or give it a different anode, and the iron is safe.",
    fig:{ html:'<div class="cr-hx"><svg class="cr-hx-svg" id="cr-hx-svg" viewBox="0 0 460 250" role="img" aria-label="A water drop sits on a grey iron plate. Small blue O₂ dots crowd the drop’s edge. At the centre, Fe²⁺ ions leave the plate. Violet electron dots run through the plate from the centre to the edge, where O₂ becomes OH⁻. A brown rust ring grows between the two. Anode at the centre, cathode at the edge."></svg><div class="cr-hx-row"><p class="cr-hx-ctr" id="cr-hx-ctr" aria-live="polite"></p><button type="button" class="btn ghost sm" id="cr-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can write the anode and cathode half-reactions for iron rusting and explain where each happens in a water drop.",
    "I can explain why rusting needs oxygen and water, and why salt speeds it up.",
    "I can use the reduction table to predict which of two metals in contact corrodes.",
    "I can calculate " + EC + " for a corrosion cell and judge whether corrosion is spontaneous.",
    "I can explain how painting, galvanizing, sacrificial anodes and impressed current protect steel, and choose a method for a situation.",
    "I can analyse health, safety and cost issues of corrosion, such as lead in drinking water and salt-damaged bridges."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Half-reactions", goal:1,
          prompt:"Which half-reaction is an oxidation?",
          options:[
            { t:"Fe(s) → Fe²⁺(aq) + 2e⁻", ok:true, why:"Electrons are lost, so the oxidation number rises from 0 to +2." },
            { t:"O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)", why:"Electrons are gained: that’s reduction." },
            { t:"Cu²⁺(aq) + 2e⁻ → Cu(s)", why:"Gaining electrons is reduction." },
            { t:"Zn²⁺(aq) + 2e⁻ → Zn(s)", why:"Electrons on the left mean they’re gained." }],
          hints:["OIL RIG.", "Where are the electrons: products or reactants?", "Fe loses 2e⁻: oxidation."] },
        { id:"w2", skill:"Half-reactions", goal:1,
          prompt:"In 2Fe + O₂ + 2H₂O → 2Fe²⁺ + 4OH⁻, what is the oxidizing agent?",
          options:[
            { t:"O₂", ok:true, why:"O₂ is reduced (0 → −2), so it causes the oxidation of iron." },
            { t:"Fe", why:"Fe is oxidized; it’s the reducing agent." },
            { t:"H₂O", why:"Hydrogen and oxygen in water keep their oxidation numbers (+1, −2)." },
            { t:"OH⁻", why:"OH⁻ is a product." }],
          hints:["The oxidizing agent is itself reduced.", "Which species gains electrons?", "O₂."] },
        { id:"w3", skill:"Reading the reduction table", goal:3,
          prompt:"Using the course table, which metal gives up electrons most easily: Fe (−0.45 V), Zn (−0.76 V), Cu (+0.34 V) or Sn (−0.14 V)?",
          options:[
            { t:"Zn", ok:true, why:"The lowest reduction potential means the reverse reaction, oxidation, is easiest." },
            { t:"Cu", why:"+0.34 V means Cu²⁺ is easily reduced, so Cu metal is hard to oxidize." },
            { t:"Sn", why:"−0.14 V is higher than −0.76 V." },
            { t:"Fe", why:"Fe’s −0.45 V is above Zn’s −0.76 V." }],
          hints:["Lower " + E + " means the metal is more easily oxidized.", "Find the most negative value.", "Zn, −0.76 V."] },
        { id:"w4", skill:"Reading the reduction table", goal:3,
          prompt:"Which species is the strongest oxidizing agent: O₂ (in water, +0.40 V), Cu²⁺ (+0.34 V), Fe²⁺ (−0.45 V) or Zn²⁺ (−0.76 V)?",
          options:[
            { t:"O₂", ok:true, why:"The highest reduction potential: most easily reduced." },
            { t:"Zn²⁺", why:"−0.76 V: hardest to reduce." },
            { t:"Fe²⁺", why:"−0.45 V is below +0.40 V." },
            { t:"Cu²⁺", why:"+0.34 V is close, but +0.40 V is higher." }],
          hints:["Oxidizing agents are reduced.", "Highest " + E + " wins.", "O₂."] },
        { id:"w5", skill:"E°cell", goal:4,
          prompt:"A cell has cathode " + E + " = +0.34 V and anode " + E + " = −0.76 V. " + EC + "?",
          options:[
            { t:"+1.10 V", ok:true, why:"0.34 − (−0.76)." },
            { t:"−0.42 V", why:"Subtract the anode’s reduction potential." },
            { t:"−1.10 V", why:"Cathode minus anode." },
            { t:"+0.42 V", why:"−(−0.76) = +0.76." }],
          hints:[EC + " = " + E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>.", "0.34 − (−0.76).", "+1.10 V."] },
        { id:"w6", skill:"E°cell", goal:4,
          prompt:"What does a positive " + EC + " tell you?",
          options:[
            { t:"The reaction is spontaneous as written", ok:true, why:"A galvanic cell runs on its own." },
            { t:"The reaction needs a power supply", why:"That’s a negative " + EC + " (electrolysis)." },
            { t:"The reaction is fast", why:"Potential says nothing about rate." },
            { t:"Electrons flow from the cathode to the anode", why:"They flow anode → cathode." }],
          hints:["Positive means ‘goes’.", "It says nothing about speed.", "Spontaneous."] }
      ],
      refreshers:{
        "Half-reactions":"Oxidation loses electrons (they appear as products); reduction gains them. The oxidizing agent is the species reduced.",
        "Reading the reduction table":"Higher " + E + ": more easily reduced (a strong oxidizing agent). Lower " + E + ": the metal is more easily oxidized (a strong reducing agent).",
        "E°cell":EC + " = " + E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>, using reduction potentials as listed. Positive means spontaneous."
      }
    }
  },
  explore:{
    heading:"Rusting simulator",
    intro:"Change the conditions and the protection. Watch where electrons go, which metal dissolves, and how fast.",
    how:"Choose a view, then set the environment, the oxygen and the protection. Drag the time slider (arrow keys; Shift for 10 weeks). The drop, the protection panel and the readout update as you go.",
    modelNote:"Model rates for comparison, not real-world speeds.",
    modes:[{ id:"drop", t:"Drop view" }, { id:"side", t:"Side-by-side" }, { id:"nail", t:"Nail inquiry" }],
    envs:[{ id:"dry", t:"Dry air" }, { id:"humid", t:"Humid air" }, { id:"fresh", t:"Fresh water" }, { id:"salt", t:"Salt water (road-salt slush)" }],
    o2s:[{ id:"on", t:"Present" }, { id:"off", t:"Removed (boiled water under an oil layer)" }],
    prots:[{ id:"none", t:"None" }, { id:"paintI", t:"Paint (intact)" }, { id:"paintS", t:"Paint (scratched)" }, { id:"galvI", t:"Galvanized (intact)" },
      { id:"galvS", t:"Galvanized (scratched)" }, { id:"tinI", t:"Tin-plated (intact)" }, { id:"tinS", t:"Tin-plated (scratched)" }, { id:"block", t:"Block connected" }, { id:"imp", t:"Impressed current" }],
    blocks:[{ id:"Mg", t:"Mg" }, { id:"Al", t:"Al" }, { id:"Zn", t:"Zn" }, { id:"Sn", t:"Sn" }, { id:"Cu", t:"Cu" }],
    tubes:[
      { id:"A", t:"Dry air with a drying agent", env:"dry", o2:"on" },
      { id:"B", t:"Boiled water under oil", env:"fresh", o2:"off" },
      { id:"C", t:"Tap water", env:"fresh", o2:"on" },
      { id:"D", t:"Salt water", env:"salt", o2:"on" }],
    obs:[{ id:"0", t:"No rust" }, { id:"1", t:"A little rust" }, { id:"2", t:"Lots of rust" }],
    nailIntro:"Four nails sit in four test tubes for 1 week. Run the inquiry, then record what you see in the results table.",
    nailDone:"A and C differ only in water: water is needed. B and C differ only in oxygen: oxygen is needed. C and D differ only in salt: dissolved ions speed rusting up.",
    predictions:[
      { id:"p1", prompt:"Drop view, fresh water, no protection. Where does the iron dissolve?",
        options:[{ t:"At the centre of the drop", ok:true }, { t:"At the edge of the drop" }, { t:"Evenly everywhere under the drop" }, { t:"Nowhere, because rust just forms on top" }],
        explain:"The centre gets the least oxygen, so it becomes the anode. Electrons travel through the iron to the oxygen-rich edge. " + M4 },
      { id:"p2", prompt:"Side-by-side: fresh water vs salt water. Which nail rusts faster, and why?",
        options:[{ t:"Salt water, because the ions carry charge between the anode and the cathode", ok:true }, { t:"Salt water, because salt oxidizes iron" }, { t:"Fresh water, because salt blocks oxygen" }, { t:"Same rate, because " + EC + " is the same" }],
        explain:EC + " doesn’t change, but the circuit through the water conducts better. " + M1 },
      { id:"p3", prompt:"Salt water, galvanized (scratched). What happens at the scratch?",
        options:[{ t:"The iron stays bright; the zinc around it corrodes", ok:true }, { t:"The iron rusts like bare iron" }, { t:"The iron rusts twice as fast" }, { t:"Both metals corrode equally" }],
        explain:"Zn (−0.76 V) is oxidized before Fe (−0.45 V), so it’s the anode." },
      { id:"p4", prompt:"Salt water, tin-plated (scratched). Compared with bare iron, the scratch…",
        options:[{ t:"rusts faster", ok:true }, { t:"rusts slower" }, { t:"doesn’t rust" }, { t:"rusts at the same rate" }],
        explain:"Sn (−0.14 V) is higher than Fe (−0.45 V), so the iron becomes the anode and the tin a large cathode. " + M3 }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. In Side-by-side, the challenge checks the panel you are editing. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 5], prompt:"Stop the iron rusting in salt water <strong>without</strong> coating it.",
        why:"A Mg, Al or Zn block is oxidized instead of the iron, and impressed current makes the steel the cathode. Either way, something else is the anode.",
        general:"The iron still rusts. Set salt water, then find a way to make something else the anode.",
        hints:["Make something else the anode.", "Choose a block with " + E + " below −0.45 V, or use a power supply.", "Mg, Al or Zn block, or impressed current."] },
      { id:"tc2", goal:[3, 5], prompt:"The iron is in salt water and its coating is scratched. Find the coating that still keeps the iron from rusting.",
        why:"Zinc (−0.76 V) is oxidized before iron (−0.45 V), so the zinc around the scratch keeps protecting the bare iron.",
        general:"Choose salt water and a scratched coating that keeps the iron rate at 0.",
        hints:["Which coating metal is oxidized before iron?", "Compare Zn −0.76 V and Sn −0.14 V with Fe −0.45 V.", "Galvanized."] },
      { id:"tc3", goal:[3, 5], stretch:true, prompt:"Block mode, salt water. Choose the 100 g block that protects the iron <strong>and</strong> lasts longest.",
        why:"Al: each 27 g gives 3 mol e⁻, the most per gram, so the block lasts 111 weeks. Real sacrificial anodes are often aluminium or zinc alloys. Pure aluminium seals itself with an oxide layer, so it’s alloyed to keep it active.",
        general:"Choose Block connected in salt water, then compare the blocks’ lifetimes.",
        hints:["First rule out blocks that don’t protect.", "A block lasts as long as its electrons last: compare moles of electrons per gram, <i>n</i> ÷ <i>M</i>.", "Al: each 27 g gives 3 mol e⁻, the most per gram."] }
    ]
  },
  part3:{
    slug:"protect", name:"Protect", heading:"Protect the bridge",
    intro:"Choose protection for a real structure. Each choice either blocks the cell or makes something else the anode. Open <strong>Check it with data</strong> to see each choice on the reduction table.",
    s1:{ title:"Station 1: The bridge",
      intro:"A Canadian highway bridge in winter. Tap a part of the bridge, then choose how to protect it.",
      parts:[
        { id:"g", name:"Steel girders in road-salt spray", short:"Girders",
          choices:[
            { t:"Paint plus galvanizing", ok:true, fb:"Right. The paint blocks salt spray, and the zinc (−0.76 V) is oxidized instead of the iron (−0.45 V) at any scratch." },
            { t:"Paint with sacrificial anodes", ok:true, fb:"Right. The paint blocks salt spray, and the anodes (Mg, Al or Zn, all below −0.45 V) are oxidized instead of the steel." },
            { t:"Tin plating", fb:"Tin (−0.14 V) is above iron (−0.45 V): at a scratch, the steel becomes the anode and rusts faster." },
            { t:"Paint only", fb:"Paint only blocks. Salt spray and scratches will reach bare steel, and nothing else is the anode." }] },
        { id:"r", name:"Steel reinforcing bars (rebar) inside concrete", short:"Rebar",
          choices:[
            { t:"Epoxy-coated rebar", ok:true, fb:"Right. The epoxy blocks the salty water that seeps into the concrete." },
            { t:"Galvanized rebar", ok:true, fb:"Right. Zinc (−0.76 V) is oxidized before iron (−0.45 V), even where the coat is damaged." },
            { t:"Impressed current", ok:true, fb:"Right. The power supply’s negative terminal makes the rebar the cathode, so it isn’t oxidized." },
            { t:"Copper-coated rebar", fb:"Copper (+0.34 V) is above iron (−0.45 V): where the coat is damaged, the steel becomes the anode." }] },
        { id:"p", name:"A steel pier in a river", short:"Pier",
          choices:[
            { t:"Sacrificial anodes", ok:true, fb:"Right. Mg, Al or Zn blocks (below −0.45 V) are oxidized instead of the steel, even where it is scratched underwater." },
            { t:"Impressed current", ok:true, fb:"Right. The steel is wired to the negative terminal, so it is the cathode." },
            { t:"Paint only", fb:"Underwater paint gets scratched and can’t be renewed; bare steel then rusts." },
            { t:"Tin plating", fb:"Tin (−0.14 V) is above iron (−0.45 V): a scratch makes the steel the anode." }] },
        { id:"c", name:"A copper drain fitting bolted to a steel beam", short:"Copper fitting",
          choices:[
            { t:"Insulate the joint", ok:true, fb:"Right. Cu (+0.34 V) would make the steel (−0.45 V) the anode. An insulating washer breaks the electrical contact, so there is no cell." },
            { t:"Bolt it on tighter", fb:"Better contact makes the cell work better: Cu (+0.34 V) makes the steel (−0.45 V) the anode." },
            { t:"Nothing: copper doesn’t rust", fb:"The copper is safe, but it is the cathode: the steel (−0.45 V) becomes the anode and corrodes faster." },
            { t:"Use a copper bolt as well", fb:"More copper touching the steel means a bigger cathode: the steel (−0.45 V) corrodes faster." }] }
      ],
      done:"All four parts are protected. Every good choice either blocks the cell or puts a metal below iron’s −0.45 V (or a power supply’s negative terminal) in charge of the electrons." },
    s2:{ title:"Station 2: Lead in drinking water",
      // VERIFY: Health Canada's guideline value for lead in drinking water (plan §6 risk 3). No value is shown to students.
      html:"<p>Many older homes have <strong>lead service pipes</strong>. Lead (Pb²⁺/Pb, −0.13 V) is oxidized more easily than copper (+0.34 V), so a lead pipe joined to copper corrodes faster at the joint, releasing Pb²⁺ into the water.</p><p>Water utilities adjust pH and add corrosion inhibitors to slow this; replacing lead pipes is the lasting fix. Health Canada sets a guideline for the most lead allowed in drinking water.</p>" },
    s3:{ title:"Station 3: Why aluminium siding doesn’t rust away",
      html:"<p>Al (−1.66 V) is very easily oxidized, but its oxide layer is thin, tight and sealing, so the metal underneath is protected (<strong>passivation</strong>). " + M6 + "</p><p>Iron’s rust, in contrast, flakes off and exposes fresh metal.</p>" },
    s4:{ title:"Station 4: Cost",
      // VERIFY: add a cost figure only after checking a source (plan §6 risk 3). None is shown.
      html:"<p>Corrosion is one of the largest maintenance costs for roads, bridges and pipelines. Every coat of paint, every zinc bath and every sacrificial anode is spent to keep a galvanic cell from eating the steel.</p>" },
    quickCheck:{
      title:"Quick check", summary:"Protect the bridge quick check",
      items:[
        { id:"q1", goal:3, prompt:"A copper fitting touches a steel beam in salty spray. Which corrodes?",
          choices:[
            { t:"The steel", ok:true, fb:"Right. Fe (−0.45 V) is below Cu (+0.34 V): iron is the anode." },
            { t:"The copper", fb:"Fe (−0.45 V) is below Cu (+0.34 V): iron is the anode." },
            { t:"Both equally", fb:"Fe (−0.45 V) is below Cu (+0.34 V): iron is the anode." },
            { t:"Neither", fb:"Fe (−0.45 V) is below Cu (+0.34 V): iron is the anode." }] },
        { id:"q2", goal:6, prompt:"Why do lead pipes joined to copper pipes raise lead levels?",
          choices:[
            { t:"Lead becomes the anode and dissolves", ok:true, fb:"Right. Pb (−0.13 V) is below Cu (+0.34 V)." },
            { t:"Copper dissolves and turns into lead", fb:"Pb (−0.13 V) is below Cu (+0.34 V)." },
            { t:"Lead is reduced", fb:"Pb (−0.13 V) is below Cu (+0.34 V)." },
            { t:"Water oxidizes copper only", fb:"Pb (−0.13 V) is below Cu (+0.34 V)." }] },
        { id:"q3", goal:6, prompt:"Why does aluminium resist corrosion outdoors?",
          choices:[
            { t:"A sealing oxide layer forms", ok:true, fb:"Right. " + M6 },
            { t:"Its " + E + " is high", fb:"Its " + E + " is actually very low; the oxide layer protects it." },
            { t:"It doesn’t react with oxygen", fb:"Its " + E + " is actually very low; the oxide layer protects it." },
            { t:"It is always painted", fb:"Its " + E + " is actually very low; the oxide layer protects it." }] },
        { id:"q4", goal:5, prompt:"Which protection keeps working if a bridge pier is scratched underwater?",
          choices:[
            { t:"Sacrificial anodes", ok:true, fb:"Right. A sacrificial anode keeps being oxidized instead of the steel." },
            { t:"Paint", fb:"Barriers fail at a scratch; a sacrificial anode doesn’t." },
            { t:"Tin plating", fb:"Barriers fail at a scratch; a sacrificial anode doesn’t." },
            { t:"Oil", fb:"Barriers fail at a scratch; a sacrificial anode doesn’t." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"custom", title:"Which metal corrodes?", summary:"Which metal corrodes?", goal:3,
        instruction:"Two metals touch in salt water. Tap the metal that corrodes.",
        how:"Tap a metal. Each pair has three levels of help.",
        items:[
          { id:"m1", a:"Fe", b:"Zn", answer:"Zn", fb:"Zn −0.76 V is below Fe −0.45 V. " + M2 },
          { id:"m2", a:"Fe", b:"Cu", answer:"Fe", fb:"Fe −0.45 V is below Cu +0.34 V." },
          { id:"m3", a:"Fe", b:"Sn", answer:"Fe", fb:"Sn −0.14 V is higher, so iron is the anode. " + M3 },
          { id:"m4", a:"Fe", b:"Mg", answer:"Mg", fb:"Mg −2.37 V is far below iron." },
          { id:"m5", a:"Cu", b:"Ag", answer:"Cu", fb:"Cu +0.34 V is below Ag +0.80 V." },
          { id:"m6", a:"Al", b:"Cu", answer:"Al", fb:"Al −1.66 V is below Cu (ignoring the oxide layer)." },
          { id:"m7", a:"Pb", b:"Cu", answer:"Pb", fb:"Pb −0.13 V is below Cu +0.34 V: the lead-pipe problem." },
          { id:"m8", a:"Fe", b:"Ni", answer:"Fe", fb:"Ni −0.26 V is higher than Fe −0.45 V." }
        ] },
      { id:"reason", type:"custom", title:"Corrosion reasoning", summary:"Corrosion reasoning", star:true, goal:[2, 4, 5],
        instruction:"Six items: number entry and choices. Items 3 to 6 are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer or tap your choice, then press Check. Signs count for cell potentials.",
        items:[
          { id:"r1", kind:"num", goal:4, prompt:EC + " for iron rusting in neutral water (cathode O₂ + 2H₂O + 4e⁻ → 4OH⁻).", answer:0.85, tol:0.005, unit:"V", display:"+0.85 V",
            wrong:[{ match:-0.05, fb:"Don’t add; subtract the anode. " + M5 }, { match:-0.85, fb:"Cathode minus anode, not anode minus cathode." }],
            fb:EC + " = " + E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>.", why:"0.40 − (−0.45) = +0.85 V: spontaneous.",
            hints:["The cathode is the O₂ half-reaction; the anode is iron.", "0.40 − (−0.45).", "+0.85 V."] },
          { id:"r2", kind:"num", goal:4, prompt:EC + " for iron rusting in acidic water (cathode O₂ + 4H⁺ + 4e⁻ → 2H₂O).", answer:1.68, tol:0.005, unit:"V", display:"+1.68 V",
            wrong:[{ match:0.78, fb:"1.23 − (−0.45) = 1.68. " + M5 }, { match:-1.68, fb:"Cathode minus anode." }],
            fb:EC + " = " + E + "<sub>cathode</sub> − " + E + "<sub>anode</sub>, keeping the table’s signs.", why:"1.23 − (−0.45) = +1.68 V.",
            hints:["The acidic cathode is +1.23 V.", "1.23 − (−0.45).", "+1.68 V."] },
          { id:"r3", kind:"num", star:true, goal:4, prompt:"How many moles of O₂ are used up when 0.20 mol of Fe is oxidized to Fe²⁺?", answer:0.10, tol:0.005, unit:"mol", display:"0.10 mol",
            wrong:[{ match:0.20, fb:"0.20 mol Fe gives 0.40 mol e⁻; each O₂ takes 4e⁻." }, { match:0.40, fb:"That’s the moles of electrons. Each O₂ takes 4e⁻." }],
            fb:"Count electrons: Fe gives 2e⁻ each; O₂ takes 4e⁻ each.", why:"0.20 mol Fe × 2 = 0.40 mol e⁻; 0.40 ÷ 4 = 0.10 mol O₂.",
            hints:["Fe → Fe²⁺ + 2e⁻.", "0.40 mol e⁻.", "O₂ takes 4 e⁻: 0.10 mol."] },
          { id:"r4", kind:"chips", star:true, goal:2, prompt:"<strong>Investigation:</strong> Nail inquiry: tubes A (dry air with a drying agent), B (boiled water under oil), C (tap water), D (salt water). Which pair shows that oxygen is needed?",
            options:[
              { t:"B and C", ok:true, why:"B and C both have water; only C has oxygen, and only C rusts." },
              { t:"A and C", why:"A and C differ in water, not oxygen." },
              { t:"C and D", why:"C and D differ in salt, not oxygen." },
              { t:"A and B", why:"Neither A nor B rusts, and they differ in more than one thing." }],
            hints:["A fair test changes one variable.", "Find two tubes that both have water but differ in oxygen.", "B (no oxygen) and C (oxygen)."] },
          { id:"r5", kind:"num", star:true, goal:5, prompt:"A 65.4 g zinc block protects a steel pipe. The corrosion current uses 0.050 mol e⁻ per week. How many weeks does the block last?", answer:40, tol:0.5, unit:"weeks", display:"40 weeks",
            wrong:[{ match:20, fb:"1.00 mol Zn gives <strong>2</strong>.00 mol e⁻." }, { match:80, fb:"65.4 g of zinc is 1.00 mol, which gives 2.00 mol e⁻." }],
            fb:"Find the moles of electrons the block can give, then divide by the electrons used per week.", why:"65.4 g ÷ 65.4 g/mol = 1.00 mol Zn → 2.00 mol e⁻; 2.00 ÷ 0.050 = 40 weeks.",
            hints:["Moles of Zn first.", "Each Zn gives 2 e⁻: 2.00 mol e⁻.", "2.00 ÷ 0.050 = 40 weeks."] },
          { id:"r6", kind:"two", star:true, goal:5, prompt:"Which zinc-coated part is protected longer: a 1 mm coating or a 2 mm coating on the same area, under the same conditions? By what factor?",
            options:[
              { t:"The 2 mm coating", ok:true },
              { t:"The 1 mm coating", why:"A thinner coat holds less zinc, so it runs out of electrons sooner." },
              { t:"They last the same time", why:"Same area: twice the zinc gives twice the electrons, so twice the time." }],
            answer:2, tol:0.01, unit:"times as long", display:"2 mm, by a factor of 2", label:"By what factor?",
            wrong:[{ match:4, fb:"Same area: twice the thickness is twice the zinc, not four times." }, { match:1, fb:"Same area: twice the zinc gives twice the electrons, so twice the time." }],
            fb:"Same area: twice the zinc gives twice the electrons, so twice the time.",
            hints:["A coating lasts as long as its zinc can give electrons.", "Same area, twice the thickness: twice the zinc.", "2 mm, by a factor of 2."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Kwabena", how:"", goal:[3, 4],
        instruction:"Kwabena made one mistake in each answer. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Explain why scratched galvanized steel doesn’t rust.",
            steps:["The steel is coated with zinc.", "From the table, Zn²⁺/Zn is −0.76 V and Fe²⁺/Fe is −0.45 V.", "Iron has the higher reduction potential, so iron is oxidized first.", "So the zinc only works as a paint."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 reads the table correctly.", "", "Step 4 follows from step 3. The mistake is earlier."],
            fixes:[
              { t:"Higher " + E + " means more easily <strong>reduced</strong>, so zinc, with the lower " + E + ", is oxidized and protects the iron.", ok:true, why:M2 },
              { t:"Both metals are oxidized equally.", why:"One metal is the anode: the one with the lower " + E + "." },
              { t:"Iron is oxidized, but more slowly.", why:"While zinc touches it, iron isn’t oxidized at all: zinc is the anode." },
              { t:"Step 3 is correct.", why:"Check: which metal is the better reducing agent? " + M2 }],
            hints:["What does a high " + E + " mean?", "Easily reduced.", "So zinc is oxidized."] },
          { id:"e2", goal:4, task:"Is rusting in acidic water spontaneous?",
            steps:["Anode: Fe → Fe²⁺ + 2e⁻ (" + E + " = −0.45 V).", "Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O (" + E + " = +1.23 V).", EC + " = 1.23 − 0.45 = +0.78 V.", "Positive, so it’s spontaneous."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "The conclusion happens to hold, but the value is wrong."],
            fixes:[
              { t:EC + " = 1.23 − (−0.45) = +1.68 V.", ok:true, why:"Keep the table’s sign: subtracting −0.45 adds 0.45." },
              { t:EC + " = −0.45 − 1.23 = −1.68 V.", why:"Cathode minus anode." },
              { t:EC + " = 1.23 + 0.45 + 0.40 V.", why:"Only two half-reactions." },
              { t:"Step 3 is correct.", why:"Subtracting −0.45 adds 0.45. " + M5 }],
            hints:["Keep the table’s sign.", "1.23 − (−0.45).", "+1.68 V."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you more: the tin scratch rusting faster, or the rust ring forming away from where the iron dissolves? Why?" },
      { id:"j2", q:"In your own words, explain why rusting is a galvanic cell." },
      { id:"j3", q:"Explain to a friend how to choose a metal for a sacrificial anode, using the reduction table." },
      { id:"j4", q:"Which part of corrosion are you least sure about? What will you check first?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In a rusting water drop, which half-reaction happens at the anode?", options:[
          { t:"Fe(s) → Fe²⁺(aq) + 2e⁻", ok:true, why:"Iron is oxidized at the oxygen-poor centre." },
          { t:"O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)", why:"That’s the cathode. " + M4 },
          { t:"Fe²⁺(aq) + 2e⁻ → Fe(s)", why:"That’s iron being reduced, the reverse." },
          { t:"2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻", why:"Water isn’t oxidized in rusting." }] },
        b:{ prompt:"In neutral water, which half-reaction happens at the cathode of a rusting drop?", options:[
          { t:"O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)", ok:true, why:"Oxygen is reduced at the edge." },
          { t:"Fe(s) → Fe²⁺(aq) + 2e⁻", why:"That’s the anode." },
          { t:"2H⁺(aq) + 2e⁻ → H₂(g)", why:"Neutral water has very little H⁺; O₂ is reduced." },
          { t:"Na⁺(aq) + e⁻ → Na(s)", why:"Salt ions only carry charge. " + M1 }] } },
      { id:"k2", cat:"K", goal:5,
        a:{ prompt:"Which method protects a steel hull with a sacrificial anode?", options:[
          { t:"Bolting magnesium blocks to the hull", ok:true, why:"Mg (−2.37 V) is oxidized instead of the steel." },
          { t:"Plating the hull with tin", why:"Tin is higher than iron. " + M3 },
          { t:"Painting the hull", why:"Paint is a barrier, not an anode." },
          { t:"Bolting copper plates to the hull", why:"Copper would make the steel the anode. " + M2 }] },
        b:{ prompt:"What is galvanizing?", options:[
          { t:"Coating steel with zinc", ok:true, why:"Zinc (−0.76 V) is oxidized instead of the iron, even at a scratch." },
          { t:"Coating steel with tin", why:"That’s tin plating." },
          { t:"Connecting steel to a power supply", why:"That’s impressed current." },
          { t:"Coating steel with copper", why:"Copper (+0.34 V) would make the steel the anode. " + M2 }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which two substances must both be present for iron to rust?", options:[
          { t:"Oxygen and water", ok:true, why:"O₂ is reduced at the cathode, and water completes the cell." },
          { t:"Salt and water", why:"Salt speeds it up, but O₂ is the oxidizing agent." },
          { t:"Oxygen and salt", why:"Without water there’s no cell." },
          { t:"Carbon dioxide and nitrogen", why:"These aren’t the reactants." }] },
        b:{ prompt:"Why does road salt make cars rust faster?", options:[
          { t:"Dissolved ions let charge flow more easily between anode and cathode areas", ok:true, why:"The cell is the same; the circuit through the water conducts better." },
          { t:"Salt is the oxidizing agent", why:M1 },
          { t:"Salt lowers iron’s reduction potential", why:E + " values don’t change." },
          { t:"Salt removes oxygen from the water", why:"Rusting would then slow down." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"A tin-plated can and a galvanized can are both scratched and left in salty water. Which rusts faster at the scratch, and why?", options:[
          { t:"The tin can: iron (−0.45 V) is oxidized in preference to tin (−0.14 V)", ok:true, why:"At the scratch, iron is the anode and the tin a large cathode." },
          { t:"The galvanized can: zinc is a weaker coating", why:M2 },
          { t:"Neither: any metal coating protects iron", why:M3 },
          { t:"Both equally: the scratch exposes bare iron in both", why:"Zinc keeps protecting; tin doesn’t." }] },
        b:{ prompt:"A copper bolt holds a steel plate on a boat. Where does corrosion speed up?", options:[
          { t:"In the steel around the bolt, because iron becomes the anode", ok:true, why:"Fe (−0.45 V) is below Cu (+0.34 V)." },
          { t:"In the copper bolt, because copper is more reactive", why:M2 },
          { t:"Nowhere: metals in contact protect each other", why:"Only a metal below iron protects it; copper is above. " + M3 },
          { t:"In both equally", why:"One metal is the anode." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:EC + " for iron corroding in neutral water (O₂ + 2H₂O + 4e⁻ → 4OH⁻, +0.40 V; Fe²⁺/Fe, −0.45 V)?", options:[
          { t:"+0.85 V", ok:true, why:"0.40 − (−0.45)." },
          { t:"−0.05 V", why:"Added instead of subtracting. " + M5 },
          { t:"−0.85 V", why:"Anode minus cathode." },
          { t:"+1.68 V", why:"That uses the acidic cathode (+1.23 V)." }] },
        b:{ prompt:EC + " for zinc corroding in neutral water (+0.40 V cathode; Zn²⁺/Zn, −0.76 V)?", options:[
          { t:"+1.16 V", ok:true, why:"0.40 − (−0.76)." },
          { t:"−0.36 V", why:"Added instead of subtracting: 0.40 − (−0.76) = +1.16 V." },
          { t:"−1.16 V", why:"Anode minus cathode." },
          { t:"+1.99 V", why:"That uses +1.23 V." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Which metal block would <strong>not</strong> protect a steel ship hull?", options:[
          { t:"Copper", ok:true, why:"Cu (+0.34 V) is above iron, so the steel becomes the anode." },
          { t:"Magnesium", why:"−2.37 V: protects." },
          { t:"Zinc", why:"−0.76 V: protects." },
          { t:"Aluminium", why:"−1.66 V: protects." }] },
        b:{ prompt:"Which metal, connected to steel in seawater, would make the steel corrode <strong>faster</strong>?", options:[
          { t:"Nickel", ok:true, why:"Ni (−0.26 V) is above Fe (−0.45 V)." },
          { t:"Magnesium", why:"Mg (−2.37 V) is below iron, so it protects the steel. " + M2 },
          { t:"Zinc", why:"Zn (−0.76 V) is below iron, so it protects the steel. " + M2 },
          { t:"Aluminium", why:"Al (−1.66 V) is below iron, so it protects the steel. " + M2 }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why rust appears in a ring away from the centre of a water drop on iron?", options:[
          { t:"“Iron dissolves at the oxygen-poor centre (the anode); Fe²⁺ ions drift out and meet OH⁻ made at the oxygen-rich edge (the cathode), forming rust between them.”", ok:true, why:"Anode at the centre, cathode at the edge, rust where the ions meet." },
          { t:"“Rust forms exactly where the iron dissolves.”", why:M4 },
          { t:"“The edge dries first, so rust forms there.”", why:"It’s about oxygen, not drying." },
          { t:"“Salt collects in a ring.”", why:M1 }] },
        b:{ prompt:"Which is the best explanation of why aluminium window frames don’t corrode away, even though Al has a very low " + E + "?", options:[
          { t:"“A thin, tight layer of aluminium oxide forms and seals the metal from oxygen and water.”", ok:true, why:"That’s passivation." },
          { t:"“Aluminium’s " + E + " is high, so it isn’t oxidized.”", why:"Its " + E + " is very low (−1.66 V). " + M6 },
          { t:"“Aluminium doesn’t react with oxygen.”", why:"It does; that’s what makes the layer." },
          { t:"“Rain washes away the corrosion.”", why:"The oxide layer stays and protects." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which description of cathodic protection with a magnesium block is correct?", options:[
          { t:"“Electrons flow from the magnesium through the wire into the steel, where O₂ is reduced. The magnesium is used up.”", ok:true, why:"Magnesium is the anode; the steel is the cathode." },
          { t:"“Electrons flow from the steel into the magnesium.”", why:"Then the steel would be the anode." },
          { t:"“The magnesium works without any connection.”", why:M7 },
          { t:"“The magnesium paints a layer on the steel.”", why:"It’s an anode, not a coating." }] },
        b:{ prompt:"Which description of impressed-current protection is correct?", options:[
          { t:"“The negative terminal of a power supply connects to the steel, so the steel is the cathode.”", ok:true, why:"The supply pushes electrons into the steel." },
          { t:"“The positive terminal connects to the steel.”", why:"That would make the steel the anode." },
          { t:"“The supply heats the steel to drive off water.”", why:"It supplies electrons." },
          { t:"“No connection to the steel is needed.”", why:M7 }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A steel gas pipeline will be buried in moist soil for 50 years and can’t be repainted. Which protection fits best?", options:[
          { t:"Cathodic protection (sacrificial anodes or impressed current), added to a coating", ok:true, why:"The coating blocks; the cathodic protection covers every scratch for decades." },
          { t:"One coat of paint only", why:"It will be scratched and can’t be renewed." },
          { t:"Tin plating", why:M3 },
          { t:"Wrapping it in copper foil", why:"Copper (+0.34 V) would make the steel the anode. " + M2 }] },
        b:{ prompt:"A steel boat trailer is dipped in salt water every weekend and often scraped on rocks. Which protection fits best?", options:[
          { t:"Galvanizing", ok:true, why:"The zinc keeps protecting even where it’s scraped." },
          { t:"Tin plating", why:M3 },
          { t:"Paint only", why:"Scrapes expose bare steel." },
          { t:"Copper plating", why:"Copper (+0.34 V) would make the steel the anode. " + M2 }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"An older home’s lead service pipe was joined to new copper pipe. Why can this raise lead levels in the tap water?", options:[
          { t:"Lead (−0.13 V) is oxidized in preference to copper (+0.34 V), so the lead dissolves as Pb²⁺", ok:true, why:"Lead is the anode at the joint." },
          { t:"Copper dissolves and becomes lead", why:"Elements don’t change." },
          { t:"Lead is reduced at the joint", why:"Reduced lead would stay as metal." },
          { t:"Water oxidizes only the copper", why:M2 }] },
        b:{ prompt:"A city makes its water slightly less acidic and adds a corrosion inhibitor. What is the main purpose?", options:[
          { t:"To slow pipe corrosion, so less dissolved metal (such as lead) reaches taps", ok:true, why:"Less corrosion means less Pb²⁺ in the water." },
          { t:"To make the water taste salty", why:"Not the purpose." },
          { t:"To raise the pipes’ reduction potential", why:E + " values are fixed." },
          { t:"To add oxygen to the water", why:"Oxygen drives corrosion." }] } }
    ]
  },
  task:{
    title:"Protect the steel", summary:"Protect the steel",
    statement:"<p>Design protection for a steel bridge beam in road-salt spray. It <strong>will</strong> get scratched. Can you find all the designs that meet every condition?</p><ol class=\"cr-conds\"><li>The iron doesn’t rust, even at a scratch.</li><li>Nothing joined to the steel makes corrosion worse.</li><li>The beam has a coating (a barrier against salt spray).</li><li>The design costs at most 3 points.</li></ol>",
    coatings:[{ id:"none", t:"None", cost:0 }, { id:"paint", t:"Paint", cost:1 }, { id:"zinc", t:"Zinc", cost:2 }, { id:"tin", t:"Tin", cost:2 }],
    blockOpts:[{ id:"none", t:"None", cost:0 }, { id:"Mg", t:"Mg", cost:2 }, { id:"Al", t:"Al", cost:2 }, { id:"Zn", t:"Zn", cost:1 }, { id:"Sn", t:"Sn", cost:1 }, { id:"Cu", t:"Cu", cost:1 }],
    checks:["No rust at a scratch", "No harmful contact", "Coating present", "Cost ≤ 3"],
    tips:["Paint and tin only block. At a scratch, you need a metal below −0.45 V.", "Sn (−0.14 V) and Cu (+0.34 V) are above iron: they make the steel the anode.", "Bridges need a barrier against salt spray too.", "Mg and Al blocks cost 2. Pair them with the cheapest coating."],
    explainPrompt:"Explain how your design protects the iron at a scratch, using reduction potentials.",
    vocab:"Use the words anode, sacrificial, reduction potential and barrier.",
    more:"There’s more than one answer. Can you find them all?",
    afterAt:6,
    after3:"Every design has a metal below iron’s −0.45 V doing the protecting: either the zinc coat or the block."
  },
  cards:[
    ["Corrosion", "Unwanted oxidation of a metal by its environment; an electrochemical (galvanic) process."],
    ["Rusting: anode", "Fe(s) → Fe²⁺(aq) + 2e⁻, at the oxygen-poor part of the surface."],
    ["Rusting: cathode", "O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq), at the oxygen-rich part."],
    [EC + " for rusting (neutral)", "0.40 − (−0.45) = +0.85 V: spontaneous."],
    ["What rusting needs", "Oxygen <strong>and</strong> water. Salt speeds it up by carrying charge."],
    ["Galvanizing", "Zinc coating; Zn (−0.76 V) is oxidized instead of iron, even at a scratch."],
    ["Sacrificial anode", "A more easily oxidized metal (Mg, Al, Zn) connected to steel; it corrodes instead."],
    ["Impressed current", "A power supply makes the steel the cathode (negative terminal to the steel)."],
    ["Tin plating", "A barrier only; a scratch makes the iron the anode and speeds up rusting."],
    ["Which metal corrodes?", "The one with the <strong>lower</strong> reduction potential."],
    ["Passivation", "A tight oxide layer that protects a metal, e.g. aluminium."]
  ]
};
