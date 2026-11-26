// SCH4U 37 Solubility Equilibrium (Ksp). Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/37-ksp.md
// Ksp values for real salts come from the course table (MV.chem.data.Ksp) in app.js; the texts below quote the plan.
// Model salts (MA, MB₂, MX, MX₂, M₂X, MX₃) are labelled "model". The beaker, stations and task preview are drawn by app.js.

const K = "<i>K</i><sub>sp</sub>", Q = "<i>Q</i>", s = "<i>s</i>";

// Misconception core sentences (plan §3)
const M1 = `The solid’s concentration is constant; ${K} has only the ions.`;
const M2 = `For CaF₂, one Ca²⁺ and <strong>two</strong> F⁻ form: ${K} = ${s}(2${s})² = 4${s}³.`;
const M3 = `Mixing equal volumes doubles the volume: halve each concentration before finding ${Q}.`;
const M4 = `Compare ${s}, not ${K}, when the formulas differ: CaF₂ has the smaller ${K} but the larger ${s}.`;
const M5 = `${Q} > ${K} means too many ions: solid precipitates until ${Q} = ${K}.`;
const M6 = `${K} is unchanged. The extra ion shifts the equilibrium left, so less salt dissolves.`;
const M7 = `Each CaF₂ that dissolves gives 2 F⁻: [F⁻] = 2${s}, and it’s squared: (2${s})² = 4${s}².`;

// Activity 1 (N6): [salt and Ksp (model), molar solubility]
const PAIRS = [
  [`MX, ${K} = 4.0 × 10⁻¹²`, "2.0 × 10⁻⁶ mol/L"],
  [`MX, ${K} = 9.0 × 10⁻¹⁰`, "3.0 × 10⁻⁵ mol/L"],
  [`MX, ${K} = 2.5 × 10⁻¹³`, "5.0 × 10⁻⁷ mol/L"],
  [`MX₂, ${K} = 3.2 × 10⁻¹¹`, "2.0 × 10⁻⁴ mol/L"],
  [`MX₂, ${K} = 4.0 × 10⁻¹²`, "1.0 × 10⁻⁴ mol/L"],
  [`MX₂, ${K} = 1.08 × 10⁻¹⁰`, "3.0 × 10⁻⁴ mol/L"],
  [`M₂X, ${K} = 4.0 × 10⁻⁹`, "1.0 × 10⁻³ mol/L"],
  [`MX₃, ${K} = 2.7 × 10⁻⁷`, "1.0 × 10⁻² mol/L"]
];
const MATCH_ANS = {}; PAIRS.forEach((p, i) => { MATCH_ANS["l" + (i + 1)] = "r" + (i + 1); });
const MX3 = `MX₃: ${K} = ${s}(3${s})³ = 27${s}⁴.`;
const MATCH_WRONG = { "l5|r1":`√(4.0 × 10⁻¹²) is the AB rule; MX₂ needs 4${s}³.`, "l7|r9":`M₂X works like MX₂: ${K} = (2${s})²${s} = 4${s}³.` };
for (let r = 1; r <= 9; r++) if (r !== 8) MATCH_WRONG["l8|r" + r] = MX3;

export default {
  id:"37-ksp",
  kind:"topic",
  title:"Solubility equilibrium (Ksp)",
  topic:"Solubility Equilibrium (Ksp)",
  readyTopic:"solubility equilibrium",
  hero:{
    eq:'<span class="ks-eq"><span class="nw">CaF₂(s) ⇌ Ca²⁺(aq) + 2F⁻(aq)</span> <span class="nw">⟶ &nbsp;<i>K</i><sub>sp</sub> = [Ca²⁺][F⁻]²</span></span>', eqSize:"sm",
    eqLabel:"Calcium fluoride solid is in equilibrium with calcium ions and two fluoride ions in solution, so K s p equals the calcium ion concentration times the fluoride ion concentration squared",
    headline:"Even ‘insoluble’ salts dissolve a little",
    text:`A <strong>saturated solution</strong> is an equilibrium: ions leave the solid as fast as they return to it. The <strong>solubility product</strong>, ${K}, multiplies the ion concentrations, with coefficients as exponents. From it you can find the <strong>molar solubility</strong>, predict whether a <strong>precipitate</strong> forms, and see why a <strong>common ion</strong> makes a salt dissolve even less.`,
    fig:{ html:'<div class="ks-hx"><svg class="ks-hx-svg" id="ks-hx-svg" viewBox="0 0 440 300" role="img" aria-label="A beaker with a layer of white calcium fluoride solid at the bottom. Orange calcium ions and teal fluoride ions, two fluoride for every calcium, drift off the solid while others land back on it. A counter of ions leaving per second stays steady while ions returning per second climbs until both read the same. Caption: Saturated: dissolving equals precipitating, and K s p equals the calcium ion concentration times the fluoride ion concentration squared."></svg><div class="ks-hx-row"><p class="ks-hx-cap" id="ks-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="ks-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    `I can write the ${K} expression for a slightly soluble salt.`,
    `I can convert between molar solubility and ${K} for AB, AB₂ and A₂B salts.`,
    `I can predict whether a precipitate forms by comparing ${Q} with ${K}, allowing for dilution when solutions are mixed.`,
    "I can explain and calculate the common-ion effect.",
    "I can apply solubility equilibria to health and environmental problems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Equilibrium expressions", goal:1,
          prompt:"Which is <i>K</i> for CaCO₃(s) ⇌ CaO(s) + CO₂(g)?",
          options:[
            { t:"[CO₂]", ok:true, why:"Solids are left out (module 36)." },
            { t:"[CaO][CO₂] ÷ [CaCO₃]", why:"Pure solids don’t appear." },
            { t:"[CaCO₃] ÷ [CaO]", why:"Products go on top, and solids are out." },
            { t:"1 ÷ [CO₂]", why:"CO₂ is a product." }],
          hints:["Which species are solids?", "Both calcium compounds.", "Only [CO₂] remains."] },
        { id:"w2", skill:"Equilibrium expressions", goal:3,
          prompt:`For a reaction, ${Q} = 0.50 and <i>K</i> = 2.0. Which way does it shift?`,
          options:[
            { t:"Right", ok:true, why:`${Q} < <i>K</i>: more products form.` },
            { t:"Left", why:`${Q} < <i>K</i> means too few products.` },
            { t:"No shift", why:`${Q} ≠ <i>K</i>.` },
            { t:"It depends on the temperature only", why:`Compare ${Q} with <i>K</i> at this temperature.` }],
          hints:[`Which is bigger, ${Q} or <i>K</i>?`, "<i>K</i>.", "Shift right."] },
        { id:"w3", skill:"Dissociation and ion counts", goal:2,
          prompt:"How many moles of ions form when 1 mol of PbI₂ dissolves completely?",
          options:[
            { t:"3 mol (1 Pb²⁺ and 2 I⁻)", ok:true, why:"PbI₂ → Pb²⁺ + 2I⁻." },
            { t:"2 mol", why:"The subscript 2 means two iodide ions." },
            { t:"1 mol", why:"It splits into ions." },
            { t:"4 mol", why:"Count: 1 + 2." }],
          hints:["Write the dissociation.", "PbI₂ → Pb²⁺ + 2I⁻.", "3 mol of ions."] },
        { id:"w4", skill:"Dissociation and ion counts", goal:2,
          prompt:`If ${s} mol/L of Ag₂CO₃ dissolves, what is [Ag⁺]?`,
          options:[
            { t:`2${s}`, ok:true, why:"Each Ag₂CO₃ gives two Ag⁺." },
            { t:s, why:"Count the silver ions per formula unit." },
            { t:`${s}²`, why:"Concentrations add up by count, not by squaring." },
            { t:`${s} ÷ 2`, why:"That would be half a silver ion per unit." }],
          hints:["Ag₂CO₃ → ? Ag⁺ + CO₃²⁻.", "2Ag⁺.", `2${s}.`] },
        { id:"w5", skill:"Dilution", goal:3,
          prompt:"50.0 mL of 4.0 × 10⁻⁴ mol/L NaF is mixed with 50.0 mL of water. What is [F⁻] now?",
          options:[
            { t:"2.0 × 10⁻⁴ mol/L", ok:true, why:"Same moles, double the volume." },
            { t:"4.0 × 10⁻⁴ mol/L", why:"The volume doubled." },
            { t:"8.0 × 10⁻⁴ mol/L", why:"Adding water can’t raise a concentration." },
            { t:"1.0 × 10⁻⁴ mol/L", why:"That’s a quarter; the volume only doubled." }],
          hints:["Did the moles of F⁻ change?", "No; the volume went from 50.0 to 100.0 mL.", "Half: 2.0 × 10⁻⁴."] },
        { id:"w6", skill:"Dilution", goal:3,
          prompt:"10.0 mL of 1.0 × 10⁻⁴ mol/L BaCl₂ is added to 90.0 mL of another solution. What is [Ba²⁺] after mixing?",
          options:[
            { t:"1.0 × 10⁻⁵ mol/L", ok:true, why:"10.0 mL of 100.0 mL: one tenth." },
            { t:"1.0 × 10⁻⁴ mol/L", why:"The Ba²⁺ is now spread through 100.0 mL." },
            { t:"1.1 × 10⁻⁵ mol/L", why:"Divide by the <strong>total</strong> volume, 100.0 mL, not by 90.0 mL." },
            { t:"9.0 × 10⁻⁵ mol/L", why:"That’s nine tenths." }],
          hints:["Moles of Ba²⁺ = 1.0 × 10⁻⁴ × 0.0100 L.", "1.0 × 10⁻⁶ mol in 0.100 L.", "1.0 × 10⁻⁵ mol/L."] }
      ],
      refreshers:{
        "Equilibrium expressions":`Products over reactants, coefficients as exponents, solids and liquids left out. ${Q} < <i>K</i> shifts right; ${Q} > <i>K</i> shifts left.`,
        "Dissociation and ion counts":"Read the subscripts: CaF₂ gives 1 Ca²⁺ and 2 F⁻; Ag₂CO₃ gives 2 Ag⁺ and 1 CO₃²⁻.",
        "Dilution":"<i>c</i>₁<i>V</i>₁ = <i>c</i>₂<i>V</i>₂. Mixing equal volumes halves each concentration."
      }
    }
  },
  explore:{
    heading:"Saturated solution simulator",
    intro:"Dissolve a salt until it’s saturated, mix two solutions to see if a solid forms, then add a common ion and watch the solubility drop.",
    how:`Choose a mode. <strong>Dissolve</strong>: pick a salt (and one to compare it with). <strong>Mix</strong>: pick two solutions, their concentrations and volumes. <strong>Common ion</strong>: slide the added salt. The beaker, the ${Q}/${K} bar and the readout update as you go.`,
    modes:[{ id:"dis", t:"Dissolve" }, { id:"mix", t:"Mix" }, { id:"ci", t:"Common ion" }],
    predictions:[
      { id:"p1", prompt:`Dissolve mode, CaF₂. When ${s} mol/L of CaF₂ dissolves, what is [F⁻]?`,
        options:[{ t:`2${s}`, ok:true }, { t:s }, { t:`${s}²` }, { t:`${s} ÷ 2` }],
        explain:`CaF₂ → Ca²⁺ + 2F⁻, so [F⁻] = 2${s} and ${K} = ${s}(2${s})² = 4${s}³.` },
      { id:"p2", prompt:"Mix mode: 50.0 mL of 2.0 × 10⁻³ mol/L AgNO₃ with 50.0 mL of 2.0 × 10⁻³ mol/L NaCl. Will AgCl precipitate?",
        options:[{ t:"yes", ok:true }, { t:"no" }, { t:"only if stirred" }, { t:"only if heated" }],
        explain:`After mixing each ion is 1.0 × 10⁻³ mol/L. ${Q} is far above ${K} = 1.8 × 10⁻¹⁰.` },
      { id:"p3", prompt:"Common-ion mode, saturated AgCl, NaCl slider moved from 0 to 0.010 mol/L. What happens to the amount of AgCl dissolved?",
        options:[{ t:"it decreases", ok:true }, { t:"it increases" }, { t:"it stays the same" }, { t:`${K} decreases` }],
        explain:`Extra Cl⁻ pushes the equilibrium left (Le Chatelier). ${K} doesn’t change.` },
      { id:"p4", prompt:`Dissolve mode, AgCl and CaF₂ side by side. AgCl has ${K} = 1.8 × 10⁻¹⁰ and CaF₂ has ${K} = 3.5 × 10⁻¹¹. Which dissolves more (higher molar solubility)?`,
        options:[{ t:"CaF₂", ok:true }, { t:"AgCl" }, { t:"they’re equal" }, { t:"you can’t compare without masses" }],
        explain:`Different formula types: ${s} = √${K} for AgCl but ${s} = ∛(${K} ÷ 4) for CaF₂. Compare ${s}, not ${K}.` }
    ],
    chalIntro:"Use the simulator to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:`Dissolve mode, model salt MX₂ with ${K} = 3.2 × 10⁻¹¹ (model). Enter its molar solubility.`,
        why:`${K} = ${s}(2${s})² = 4${s}³, so ${s}³ = 8.0 × 10⁻¹² and ${s} = 2.0 × 10⁻⁴ mol/L.`,
        hints:[`${K} = ${s}(2${s})² = 4${s}³.`, `${s}³ = 3.2 × 10⁻¹¹ ÷ 4 = 8.0 × 10⁻¹².`, `${s} = 2.0 × 10⁻⁴ mol/L.`] },
      { id:"tc2", goal:3, prompt:"Mix mode: equal volumes (50.0 mL each) of AgNO₃ and NaCl at the <strong>same</strong> concentration. Choose the <strong>largest</strong> concentration chip that gives <strong>no</strong> precipitate. (Chips to try: 1.0 × 10⁻⁶, 1.0 × 10⁻⁵, 2.0 × 10⁻⁵, 4.0 × 10⁻⁵, 1.0 × 10⁻⁴ mol/L.)",
        why:`After mixing, ${Q} = (1.0 × 10⁻⁵)² = 1.0 × 10⁻¹⁰ < 1.8 × 10⁻¹⁰. The next chip, 4.0 × 10⁻⁵, gives ${Q} = 4.0 × 10⁻¹⁰: a precipitate.`,
        hints:["After mixing, each concentration is half the chip value.", `${Q} = (<i>c</i>/2)²; you need ${Q} < 1.8 × 10⁻¹⁰.`, "2.0 × 10⁻⁵ gives 1.0 × 10⁻¹⁰; 4.0 × 10⁻⁵ gives 4.0 × 10⁻¹⁰."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Common-ion mode, AgCl. Set the NaCl so that AgCl’s molar solubility drops to exactly 1.0 × 10⁻⁸ mol/L.",
        why:`[Cl⁻] = ${K} ÷ ${s} = 1.8 × 10⁻¹⁰ ÷ 1.0 × 10⁻⁸ = 0.018 mol/L. ${K} stayed 1.8 × 10⁻¹⁰; only ${s} changed.`,
        hints:[`With added Cl⁻, ${K} = ${s} × [Cl⁻] (the Cl⁻ from AgCl is tiny).`, `[Cl⁻] = ${K} ÷ ${s}.`, "1.8 × 10⁻¹⁰ ÷ 1.0 × 10⁻⁸ = 1.8 × 10⁻² = 0.018 mol/L."] }
    ]
  },
  part3:{
    slug:"real-world", name:"Real world", heading:"Solubility in the real world",
    intro:`Four short case stations apply ${Q} vs ${K} where it matters: in the body, in the kitchen, in wastewater and in hospitals. All numbers are model values.`,
    s1:{ title:"Station 1: Kidney stones",
      intro:`Calcium oxalate, CaC₂O₄, is the most common kind of kidney stone. A model urine sample has [Ca²⁺] = 2.5 × 10⁻³ and [C₂O₄²⁻] = 1.0 × 10⁻⁶ mol/L. Is ${Q} above ${K}? Then press <strong>Drink more water</strong>.`,
      note:"Model numbers, not medical advice." },
    s2:{ title:"Station 2: Kettle scale and hard water",
      intro:`Hard water carries Ca²⁺. Heating drives off CO₂, which raises [CO₃²⁻]. Tap the heating step where ${Q} first exceeds ${K} for CaCO₃: that’s when scale starts to form on the element.`,
      note:`Model numbers. This station uses the 25 °C ${K} at every step.` },
    s3:{ title:"Station 3: Cleaning up dissolved metals",
      intro:`Adding lime (calcium hydroxide) raises [OH⁻], so metal hydroxides precipitate and can be filtered out. Mg(OH)₂ stands in for the metal here. Choose a pH and step through the calculation of the most Mg²⁺ that can stay dissolved.`,
      note:"Lead and cadmium hydroxides behave the same way (their values aren’t in our table)." },
    s4:{ title:"Station 4: Barium ‘meals’ for X-rays",
      intro:`A patient drinks a suspension of BaSO₄ so the gut shows up on an X-ray. Ba²⁺ ions are toxic, but BaSO₄ is so insoluble that very little Ba²⁺ dissolves. Press <strong>Add a little sulfate</strong> to see the common-ion effect at work.`,
      use:"√1.1 ≈ 1.05",
      note:"Model numbers, not medical advice." },
    quickCheck:{
      title:"Quick check", summary:"Real world quick check",
      items:[
        { id:"q1", goal:5, prompt:"Why does drinking more water lower kidney-stone risk (Station 1)?",
          choices:[
            { t:`Both ion concentrations fall, so ${Q} drops below ${K}`, ok:true, fb:`Right. Dilution lowers ${Q}; ${K} is unchanged.` },
            { t:`Water changes ${K}`, fb:`Dilution lowers ${Q}; ${K} is unchanged.` },
            { t:"Water reacts with oxalate", fb:`Dilution lowers ${Q}; ${K} is unchanged.` },
            { t:"Water removes the calcium", fb:`Dilution lowers ${Q}; ${K} is unchanged.` }] },
        { id:"q2", goal:5, prompt:"Why does scale form when hard water is heated?",
          choices:[
            { t:`[CO₃²⁻] rises until ${Q} > ${K}`, ok:true, fb:`Right. Losing CO₂ shifts carbonate up; ${Q} passes ${K}.` },
            { t:`${K} becomes zero`, fb:`Losing CO₂ shifts carbonate up; ${Q} passes ${K}.` },
            { t:"Heat makes Ca²⁺", fb:`Losing CO₂ shifts carbonate up; ${Q} passes ${K}.` },
            { t:"Water evaporates completely", fb:`Losing CO₂ shifts carbonate up; ${Q} passes ${K}.` }] },
        { id:"q3", goal:5, prompt:"At pH 11.00, what is the most Mg²⁺ that can stay dissolved?",
          choices:[
            { t:"5.6 × 10⁻⁶ mol/L", ok:true, fb:`Right. [OH⁻] = 1.0 × 10⁻³; divide ${K} by [OH⁻]².` },
            { t:"5.6 × 10⁻⁹ mol/L", fb:`[OH⁻] = 1.0 × 10⁻³; divide ${K} by [OH⁻]².` },
            { t:"5.6 × 10⁻¹² mol/L", fb:`[OH⁻] = 1.0 × 10⁻³; divide ${K} by [OH⁻]².` },
            { t:"1.4 × 10⁻⁶ mol/L", fb:`[OH⁻] = 1.0 × 10⁻³; divide ${K} by [OH⁻]².` }] },
        { id:"q4", goal:4, prompt:"Why is adding sulfate to a barium meal helpful?",
          choices:[
            { t:"Common ion lowers [Ba²⁺]", ok:true, fb:"Right. More SO₄²⁻ shifts the equilibrium left." },
            { t:`It raises ${K}`, fb:`More SO₄²⁻ shifts the equilibrium left. ${M6}` },
            { t:"It makes BaSO₄ more soluble", fb:`More SO₄²⁻ shifts the equilibrium left. ${M6}` },
            { t:"It neutralizes barium", fb:`More SO₄²⁻ shifts the equilibrium left. ${M6}` }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"pairs", type:"match", title:`${K} ↔ molar solubility`, summary:"Ksp ↔ molar solubility", goal:[1, 2],
        instruction:"Match each model salt to its molar solubility. One value has no partner.",
        leftTitle:`Salt and ${K} (model)`, rightTitle:`Molar solubility ${s}`,
        left:PAIRS.map((p, i) => Object.assign({ id:"l" + (i + 1), t:p[0], why:i < 3 ? `AB: ${s} = √${K}.` : i < 6 ? `AB₂: ${K} = 4${s}³.` : i === 6 ? `A₂B: ${K} = (2${s})²${s} = 4${s}³.` : `MX₃: ${K} = 27${s}⁴ = 27 × (1.0 × 10⁻²)⁴.` },
          i === 7 ? { hints:["MX₃ → M³⁺ + 3X⁻.", `${K} = ${s}(3${s})³ = 27${s}⁴.`, "27 × (1.0 × 10⁻²)⁴ = 2.7 × 10⁻⁷."] } : {})),
        right:PAIRS.map((p, i) => ({ id:"r" + (i + 1), t:p[1] })).concat([{ id:"r9", t:"6.3 × 10⁻⁵ mol/L" }]),
        answer:MATCH_ANS,
        wrong:MATCH_WRONG,
        wrongDefault:`Write the ions, put ${s} or 2${s} in, and multiply.` },
      { id:"precip", type:"custom", title:"Precipitate or not?", summary:"Precipitate or not?", star:true, goal:[3, 4, 5],
        instruction:"Six problems: enter numbers in scientific notation and choose where asked. Problems 3 to 6 are non-routine; 5 and 6 go beyond the Final Check.",
        how:"Type the number part, then the power of ten (e.g. 1.0 and −6 for 1.0 × 10⁻⁶), choose where asked, then press Check.",
        uses:`${K}: AgCl 1.8 × 10⁻¹⁰ · AgBr 5.0 × 10⁻¹³ · BaSO₄ 1.1 × 10⁻¹⁰ · CaF₂ 3.5 × 10⁻¹¹ · Mg(OH)₂ 5.6 × 10⁻¹² (course table)`,
        items:[
          { id:"x1", goal:3, prompt:"50.0 mL of 2.0 × 10⁻³ mol/L AgNO₃ + 50.0 mL of 2.0 × 10⁻³ mol/L NaCl. <i>Q</i>? Precipitate?",
            display:`${Q} = 1.0 × 10⁻⁶; yes, AgCl precipitates`, fb:`Find the after-mixing concentrations first, then multiply them.`,
            parts:[
              { k:"num", label:`${Q} =`, answer:1.0e-6, unit:"", wrong:[{ match:4.0e-6, fb:"Halve each concentration first." }] },
              { k:"pick", label:"Precipitate?", options:[{ t:"yes", ok:true }, { t:"no", why:`${Q} is far above ${K} = 1.8 × 10⁻¹⁰.` }] }] },
          { id:"x2", goal:3, prompt:"10.0 mL of 1.0 × 10⁻⁴ mol/L BaCl₂ + 90.0 mL of 1.0 × 10⁻⁵ mol/L Na₂SO₄. <i>Q</i>? Precipitate of BaSO₄?",
            display:`${Q} = 9.0 × 10⁻¹¹; no (just below 1.1 × 10⁻¹⁰)`, fb:"Divide each ion’s moles by the total volume, 100.0 mL, then multiply.",
            parts:[
              { k:"num", label:`${Q} =`, answer:9.0e-11, unit:"", wrong:[{ match:1.0e-9, fb:"[Ba²⁺] = 1.0 × 10⁻⁵ and [SO₄²⁻] = 9.0 × 10⁻⁶ after mixing." }] },
              { k:"pick", label:"Precipitate?", options:[{ t:"no", ok:true }, { t:"yes", why:"[Ba²⁺] = 1.0 × 10⁻⁵ and [SO₄²⁻] = 9.0 × 10⁻⁶ after mixing." }] }],
            invest:{ prompt:`<strong>Investigation:</strong> In a real test, which variable must you control so that ${Q} can be compared with the table’s ${K}?`,
              options:[{ t:"temperature", ok:true, why:`${K} values are for 25 °C; ${K} changes with temperature.` }, { t:"beaker size", why:`${K} values are for 25 °C; ${K} changes with temperature.` },
                { t:"stirring speed", why:`${K} values are for 25 °C; ${K} changes with temperature.` }, { t:"lighting", why:`${K} values are for 25 °C; ${K} changes with temperature.` }] } },
          { id:"x3", goal:3, star:true, prompt:"50.0 mL of 2.0 × 10⁻³ mol/L Ca(NO₃)₂ + 50.0 mL of 8.0 × 10⁻⁴ mol/L NaF. <i>Q</i>? Precipitate of CaF₂?",
            display:`${Q} = 1.6 × 10⁻¹⁰; yes`, fb:`Halve both, then ${Q} = [Ca²⁺][F⁻]².`,
            parts:[
              { k:"num", label:`${Q} =`, answer:1.6e-10, unit:"", wrong:[{ match:4.0e-7, fb:"Square [F⁻]." }, { match:1.28e-9, fb:"Halve each concentration first." }] },
              { k:"pick", label:"Precipitate?", options:[{ t:"yes", ok:true }, { t:"no", why:`1.6 × 10⁻¹⁰ is above ${K} = 3.5 × 10⁻¹¹.` }] }] },
          { id:"x4", goal:5, star:true, prompt:"Most Mg²⁺ that can stay dissolved at pH 11.00?",
            display:"5.6 × 10⁻⁶ mol/L", fb:`Find [OH⁻] from the pH, then [Mg²⁺] = ${K} ÷ [OH⁻]².`,
            parts:[{ k:"num", label:"[Mg²⁺] =", answer:5.6e-6, unit:"mol/L", wrong:[{ match:5.6e-9, fb:"Square [OH⁻]." }] }] },
          { id:"x5", goal:4, star:true, prompt:"Molar solubility of CaF₂ in 0.10 mol/L NaF?",
            display:"3.5 × 10⁻⁹ mol/L", fb:`The F⁻ comes almost all from the NaF; put it into ${K} and solve for ${s}.`,
            parts:[{ k:"num", label:`${s} =`, answer:3.5e-9, unit:"mol/L", wrong:[{ match:2.1e-4, fb:"That’s in pure water; the common ion lowers it." }, { match:2.06e-4, fb:"That’s in pure water; the common ion lowers it." }, { match:3.5e-10, fb:"[F⁻] = 0.10 must be squared." }] }],
            hints:["[F⁻] ≈ 0.10 from the NaF.", `${K} = ${s}(0.10)².`, `${s} = 3.5 × 10⁻¹¹ ÷ 0.010 = 3.5 × 10⁻⁹.`] },
          { id:"x6", goal:3, star:true, prompt:"Ag⁺ is added slowly to a solution with 0.010 mol/L Cl⁻ and 0.010 mol/L Br⁻. Which salt precipitates first, and what is [Br⁻] when AgCl just starts to form?",
            use:"5.0 ÷ 1.8 ≈ 2.8",
            display:"AgBr first; [Br⁻] ≈ 2.8 × 10⁻⁵ mol/L", fb:`When AgCl starts, [Ag⁺] = ${K}(AgCl) ÷ 0.010; use that [Ag⁺] in AgBr’s ${K}.`,
            parts:[
              { k:"pick", label:"Precipitates first:", options:[{ t:"AgBr", ok:true }, { t:"AgCl", why:"AgBr needs only [Ag⁺] = 5.0 × 10⁻¹¹; AgCl needs 1.8 × 10⁻⁸." }] },
              { k:"num", label:"[Br⁻] =", answer:2.8e-5, unit:"mol/L", wrong:[{ match:5.0e-11, fb:"That’s the [Ag⁺] AgBr needs to start. Now find [Br⁻] when [Ag⁺] = 1.8 × 10⁻⁸." }] }],
            hints:[`Find the [Ag⁺] each salt needs to start precipitating: ${K} ÷ 0.010.`, "AgBr: 5.0 × 10⁻¹¹; AgCl: 1.8 × 10⁻⁸. The smaller one goes first.", "When [Ag⁺] reaches 1.8 × 10⁻⁸, [Br⁻] = 5.0 × 10⁻¹³ ÷ 1.8 × 10⁻⁸ ≈ 2.8 × 10⁻⁵ mol/L."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Tenzin", how:"", goal:[2, 3, 4],
        instruction:"Tenzin made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:`The molar solubility of CaF₂ is 2.0 × 10⁻⁴ mol/L in a model. Find ${K}.`,
            steps:["CaF₂(s) ⇌ Ca²⁺(aq) + 2F⁻(aq).", `[Ca²⁺] = ${s} and [F⁻] = ${s}.`, `${K} = ${s}² = 4.0 × 10⁻⁸.`],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:`[F⁻] = 2${s}, so ${K} = ${s}(2${s})² = 4${s}³ = 3.2 × 10⁻¹¹.`, ok:true, why:M7 },
              { t:`${K} = 2${s}² = 8.0 × 10⁻⁸.`, why:"[F⁻] is squared, so the 2 is squared too." },
              { t:`${K} = ${s}³ = 8.0 × 10⁻¹².`, why:`You need (2${s})², not ${s}².` },
              { t:"Step 2 is correct.", why:M7 }],
            hints:["How many F⁻ per CaF₂?", `Two, so [F⁻] = 2${s}.`, `4${s}³ = 3.2 × 10⁻¹¹.`] },
          { id:"e2", goal:3, task:`50.0 mL of 3.0 × 10⁻³ mol/L Pb(NO₃)₂ is mixed with 50.0 mL of 3.0 × 10⁻³ mol/L KI. Does PbI₂ (${K} 9.8 × 10⁻⁹) precipitate?`,
            steps:[`PbI₂(s) ⇌ Pb²⁺ + 2I⁻, so ${Q} = [Pb²⁺][I⁻]².`, `${Q} = (3.0 × 10⁻³)(3.0 × 10⁻³)² = 2.7 × 10⁻⁸.`, "2.7 × 10⁻⁸ > 9.8 × 10⁻⁹, so a precipitate forms."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 compares correctly; the mistake is earlier."],
            fixes:[
              { t:`After mixing, each is 1.5 × 10⁻³ mol/L: ${Q} = 3.4 × 10⁻⁹ < ${K}, so no precipitate.`, ok:true, why:M3 },
              { t:`${Q} = (3.0 × 10⁻³)(6.0 × 10⁻³)².`, why:"[I⁻] isn’t doubled here; KI gives one I⁻ each." },
              { t:`Use ${K} = 4${s}³ instead.`, why:"That’s for dissolving a pure salt, not for mixing." },
              { t:"Step 2 is correct.", why:M3 }],
            hints:["What happened to the volume?", "It doubled: halve each concentration.", `${Q} = 1.5 × 10⁻³ × (1.5 × 10⁻³)² = 3.4 × 10⁻⁹.`] },
          { id:"e3", goal:4, task:"Find the molar solubility of AgCl in 0.010 mol/L NaCl.",
            steps:[`AgCl(s) ⇌ Ag⁺ + Cl⁻; ${K} = 1.8 × 10⁻¹⁰.`, `[Cl⁻] = 0.010 + ${s} ≈ 0.010.`, `So ${s}² = 1.8 × 10⁻¹⁰ and ${s} = 1.3 × 10⁻⁵ mol/L.`],
            answer:2,
            stepFb:["Step 1 is correct.", `Step 2 is correct: ${s} is tiny.`, ""],
            fixes:[
              { t:`${s} × 0.010 = 1.8 × 10⁻¹⁰, so ${s} = 1.8 × 10⁻⁸ mol/L.`, ok:true, why:"Step 2 set [Cl⁻] ≈ 0.010, so that’s what goes into the expression." },
              { t:`${K} is now 1.8 × 10⁻¹².`, why:`${K} doesn’t change.` },
              { t:`${s} = 0.010 mol/L.`, why:"That’s the Cl⁻ from NaCl." },
              { t:"Step 3 is correct.", why:"Step 3 ignores the 0.010 mol/L of Cl⁻ that step 2 found." }],
            hints:["Which [Cl⁻] did step 2 decide on?", `0.010, not ${s}.`, `${s} = 1.8 × 10⁻⁸.`] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:`Which reveal surprised you: P4 (the smaller ${K} dissolved more) or P3 (a little salt made AgCl even less soluble)? Why?` },
      { id:"j2", q:`In your own words, explain the difference between ${K} and molar solubility.` },
      { id:"j3", q:"Explain to a friend how to decide whether a precipitate forms when two solutions are mixed." },
      { id:"j4", q:`Which step do you still skip by accident (dilution, the 2${s}, the square)? What will you do to catch it?` }
    ]
  },
  final:{
    intro:`${K} values come from the course table unless marked “model”. “Use these values” boxes give any roots you need.`,
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:`Which is the ${K} expression for PbI₂(s)?`, options:[
          { t:"[Pb²⁺][I⁻]²", ok:true, why:"Coefficients become exponents; the solid is left out." },
          { t:"[Pb²⁺][I⁻]² ÷ [PbI₂]", why:"The solid doesn’t appear." },
          { t:"[Pb²⁺][I⁻]", why:"Two iodide ions: square [I⁻]." },
          { t:"[Pb²⁺] × 2[I⁻]", why:"The 2 is an exponent, not a multiplier." }] },
        b:{ prompt:`Which is the ${K} expression for Ag₂CO₃(s)?`, options:[
          { t:"[Ag⁺]²[CO₃²⁻]", ok:true, why:"Coefficients become exponents; the solid is left out." },
          { t:"[Ag⁺]²[CO₃²⁻] ÷ [Ag₂CO₃]", why:"The solid doesn’t appear." },
          { t:"[Ag⁺][CO₃²⁻]", why:"Two silver ions: square [Ag⁺]." },
          { t:"2[Ag⁺][CO₃²⁻]", why:"The 2 is an exponent, not a multiplier." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"NaCl is added to a saturated solution of AgCl. What happens?", options:[
          { t:`Some AgCl precipitates; its solubility decreases and ${K} is unchanged`, ok:true, why:"The shared Cl⁻ shifts the equilibrium left." },
          { t:`${K} decreases, so less AgCl dissolves`, why:`${K} changes only with temperature.` },
          { t:"More AgCl dissolves to balance the Cl⁻", why:"Adding a product ion shifts the equilibrium left." },
          { t:"Nothing happens, because NaCl is a different salt", why:"The shared Cl⁻ matters." }] },
        b:{ prompt:"Ca(NO₃)₂ is added to a saturated solution of CaF₂. What happens?", options:[
          { t:`Some CaF₂ precipitates; its solubility decreases and ${K} is unchanged`, ok:true, why:"The shared Ca²⁺ shifts the equilibrium left." },
          { t:`${K} increases because there’s more calcium`, why:`${K} changes only with temperature.` },
          { t:"More CaF₂ dissolves", why:"Extra Ca²⁺ shifts the equilibrium left." },
          { t:"Nothing happens, because nitrate isn’t in CaF₂", why:"The shared ion is Ca²⁺." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:`For a mixture, the ion product ${Q} is greater than ${K}. What happens?`, options:[
          { t:`Solid precipitates until ${Q} = ${K}`, ok:true, why:"Too many ions: some leave the solution as solid." },
          { t:`More solid dissolves until ${Q} = ${K}`, why:"Too many ions means solid forms." },
          { t:`${K} rises to match ${Q}`, why:`${K} changes only with temperature.` },
          { t:"Nothing; the solution is unsaturated", why:`${Q} > ${K} is supersaturated.` }] },
        b:{ prompt:`For a solution, ${Q} is less than ${K}. What does this mean?`, options:[
          { t:"The solution is unsaturated: more solid could dissolve", ok:true, why:`${Q} < ${K}: room for more ions.` },
          { t:"A precipitate forms", why:`That needs ${Q} > ${K}.` },
          { t:"The solution is saturated", why:`Saturated means ${Q} = ${K}.` },
          { t:`${K} falls to match ${Q}`, why:`${K} changes only with temperature.` }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:`A model salt MX₂ has a molar solubility of 3.0 × 10⁻⁴ mol/L. What is its ${K}?`, options:[
          { t:"1.1 × 10⁻¹⁰ (1.08 × 10⁻¹⁰)", ok:true, why:`${K} = ${s}(2${s})² = 4${s}³ = 4 × 2.7 × 10⁻¹¹.` },
          { t:"9.0 × 10⁻⁸", why:`${s}² is the AB rule.` },
          { t:"2.7 × 10⁻¹¹", why:`${s}³ forgets that [X⁻] = 2${s}.` },
          { t:"5.4 × 10⁻¹¹", why:`2${s}³ forgets to square the 2.` }] },
        b:{ prompt:`A model salt MX₂ has a molar solubility of 1.0 × 10⁻³ mol/L. What is its ${K}?`, options:[
          { t:"4.0 × 10⁻⁹", ok:true, why:`4${s}³ = 4 × 1.0 × 10⁻⁹.` },
          { t:"1.0 × 10⁻⁶", why:`${s}² is the AB rule.` },
          { t:"1.0 × 10⁻⁹", why:`${s}³ forgets that [X⁻] = 2${s}.` },
          { t:"2.0 × 10⁻⁹", why:`2${s}³ forgets to square the 2.` }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:`50.0 mL of 2.0 × 10⁻⁴ mol/L Ca(NO₃)₂ is mixed with 50.0 mL of 6.0 × 10⁻⁴ mol/L NaF. Does CaF₂ (${K} 3.5 × 10⁻¹¹) precipitate?`, options:[
          { t:`No: after mixing, ${Q} = 9.0 × 10⁻¹², less than ${K}`, ok:true, why:`[Ca²⁺] = 1.0 × 10⁻⁴, [F⁻] = 3.0 × 10⁻⁴; ${Q} = 1.0 × 10⁻⁴ × 9.0 × 10⁻⁸.` },
          { t:`Yes: ${Q} = 7.2 × 10⁻¹¹, using the stock concentrations`, why:"Mixing halves both." },
          { t:`Yes: ${Q} = 3.0 × 10⁻⁸, because [Ca²⁺][F⁻] is above ${K}`, why:"[F⁻] must be squared." },
          { t:"Yes: whenever both ions are present, the solid forms", why:`Only if ${Q} > ${K}.` }] },
        b:{ prompt:`50.0 mL of 2.0 × 10⁻⁵ mol/L AgNO₃ is mixed with 50.0 mL of 2.0 × 10⁻⁵ mol/L NaCl. Does AgCl (${K} 1.8 × 10⁻¹⁰) precipitate?`, options:[
          { t:`No: after mixing, ${Q} = 1.0 × 10⁻¹⁰, less than ${K}`, ok:true, why:`Each ion is 1.0 × 10⁻⁵ after mixing; ${Q} = (1.0 × 10⁻⁵)².` },
          { t:`Yes: ${Q} = 4.0 × 10⁻¹⁰, using the stock concentrations`, why:"Mixing halves both." },
          { t:`Yes: ${Q} = 2.0 × 10⁻⁵, the sum of the concentrations`, why:`${Q} is a product, not a sum.` },
          { t:`No: ${Q} < ${K} means the solution is supersaturated`, why:`${Q} < ${K} means unsaturated.` }] } },
      { id:"t3", cat:"T", goal:2,
        a:{ prompt:`Which is more soluble in water (higher molar solubility): AgCl (${K} 1.8 × 10⁻¹⁰) or CaF₂ (${K} 3.5 × 10⁻¹¹)?`, use:"√1.8 ≈ 1.34; ∛8.75 ≈ 2.06", options:[
          { t:`CaF₂: ${s} ≈ 2.1 × 10⁻⁴ mol/L, compared with 1.3 × 10⁻⁵ mol/L for AgCl`, ok:true, why:`${s} = √${K} for AgCl; ${s} = ∛(${K} ÷ 4) for CaF₂.` },
          { t:`AgCl, because its ${K} is larger`, why:`Different formula types: compare ${s}.` },
          { t:`They’re equally soluble, since both ${K} values are tiny`, why:`${s} differs by more than tenfold.` },
          { t:"You can’t compare without molar masses", why:"Molar solubility compares moles per litre directly." }] },
        b:{ prompt:`Model salts: MA has ${K} = 1.0 × 10⁻¹⁰ and MB₂ has ${K} = 4.0 × 10⁻¹². Which has the higher molar solubility?`, options:[
          { t:`MB₂: ${s} = 1.0 × 10⁻⁴ mol/L, compared with 1.0 × 10⁻⁵ mol/L for MA`, ok:true, why:`${s} = √${K} for MA; ${s} = ∛(${K} ÷ 4) for MB₂.` },
          { t:`MA, because its ${K} is larger`, why:`Different formula types: compare ${s}.` },
          { t:"They’re equal", why:`${s} differs tenfold.` },
          { t:"You can’t compare without molar masses", why:"Molar solubility compares moles per litre directly." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"Which is the best explanation of why AgCl is less soluble in salt water than in pure water?", options:[
          { t:`“The extra Cl⁻ makes ${Q} bigger than ${K}, so the equilibrium shifts left until [Ag⁺] is smaller. ${K} stays the same.”`, ok:true, why:`It names the common ion, the shift and the unchanged ${K}.` },
          { t:`“Salt water lowers ${K}.”`, why:`${K} changes only with temperature.` },
          { t:"“Salt water is denser, so less can dissolve.”", why:"Density isn’t the cause; the common ion is." },
          { t:"“NaCl reacts with AgCl to make a new solid.”", why:"No new compound forms; the shared Cl⁻ shifts the equilibrium." }] },
        b:{ prompt:"Which is the best explanation of why adding sulfate to a BaSO₄ suspension lowers [Ba²⁺]?", options:[
          { t:`“Added SO₄²⁻ raises ${Q} above ${K}, so BaSO₄ precipitates until [Ba²⁺] × [SO₄²⁻] equals ${K} again, with less Ba²⁺.”`, ok:true, why:`It names the common ion, the shift and the unchanged ${K}.` },
          { t:`“Sulfate lowers ${K}.”`, why:`${K} changes only with temperature.` },
          { t:"“Sulfate reacts with barium to form a gas.”", why:"No gas forms." },
          { t:"“Sulfate makes BaSO₄ more soluble.”", why:"The common ion lowers solubility." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which statement correctly describes a saturated solution of PbI₂ that has excess solid at the bottom?", options:[
          { t:`“Dissolving and precipitating continue at equal rates, and ${Q} = ${K}.”`, ok:true, why:"It’s a dynamic equilibrium." },
          { t:"“Nothing dissolves any more.”", why:"It’s dynamic: both processes continue." },
          { t:`“${Q} is greater than ${K}.”`, why:"That would make more solid form." },
          { t:"“[Pb²⁺] = [I⁻].”", why:"Each PbI₂ gives two I⁻: [I⁻] = 2[Pb²⁺] if nothing else is added." }] },
        b:{ prompt:`Which statement correctly describes what ${Q} < ${K} tells you?`, options:[
          { t:`“The solution is unsaturated; any solid added would dissolve until ${Q} = ${K}.”`, ok:true, why:`${Q} < ${K}: room for more ions.` },
          { t:"“The solution is supersaturated.”", why:`${Q} < ${K} means unsaturated.` },
          { t:"“A precipitate is forming.”", why:`That needs ${Q} > ${K}.` },
          { t:`“${K} is too small to apply.”`, why:`${K} always applies; compare it with ${Q}.` }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:`Model numbers, not medical advice. Calcium oxalate, CaC₂O₄, has ${K} = 2.3 × 10⁻⁹. A model urine sample has [Ca²⁺] = 2.0 × 10⁻³ and [C₂O₄²⁻] = 2.0 × 10⁻⁶ mol/L. Which is correct?`, options:[
          { t:`${Q} = 4.0 × 10⁻⁹ > ${K}, so crystals can form; doubling the volume gives ${Q} = 1.0 × 10⁻⁹ < ${K}`, ok:true, why:`Halving both concentrations divides ${Q} by 4.` },
          { t:`${Q} = 4.0 × 10⁻⁹ > ${K}; doubling the volume gives ${Q} = 2.0 × 10⁻⁹`, why:`Both ions are diluted, so ${Q} falls to a quarter, not a half.` },
          { t:`${Q} = 4.0 × 10⁻⁹ < ${K}, so there’s no risk`, why:"4.0 × 10⁻⁹ is larger than 2.3 × 10⁻⁹." },
          { t:`Diluting doesn’t change the risk, because ${K} is constant`, why:`${K} is constant, but ${Q} falls.` }] },
        b:{ prompt:`Calcium carbonate, CaCO₃, has ${K} = 3.4 × 10⁻⁹. Heated tap water (model) has [Ca²⁺] = 2.0 × 10⁻³ and [CO₃²⁻] = 2.0 × 10⁻⁶ mol/L. Which is correct?`, options:[
          { t:`${Q} = 4.0 × 10⁻⁹ > ${K}, so scale forms; halving both concentrations gives ${Q} = 1.0 × 10⁻⁹ < ${K}`, ok:true, why:`Halving both concentrations divides ${Q} by 4.` },
          { t:`${Q} = 4.0 × 10⁻⁹ > ${K}; halving both concentrations gives ${Q} = 2.0 × 10⁻⁹`, why:`Both ions are diluted, so ${Q} falls to a quarter, not a half.` },
          { t:`${Q} = 4.0 × 10⁻⁹ < ${K}, so no scale forms`, why:"4.0 × 10⁻⁹ is larger than 3.4 × 10⁻⁹." },
          { t:`Scale can’t form, because ${K} is constant`, why:`${K} is constant, but ${Q} can rise above it.` }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Lime is added to wastewater (model) until pH = 12.00. What is the highest [Mg²⁺] that can stay dissolved? (<i>K</i><sub>sp</sub> of Mg(OH)₂ = 5.6 × 10⁻¹²)", options:[
          { t:"5.6 × 10⁻⁸ mol/L", ok:true, why:"[OH⁻] = 1.0 × 10⁻²; 5.6 × 10⁻¹² ÷ (1.0 × 10⁻²)²." },
          { t:"5.6 × 10⁻¹⁰ mol/L", why:"[OH⁻] must be squared." },
          { t:"5.6 × 10⁻¹² mol/L", why:`That’s ${K} itself, not [Mg²⁺].` },
          { t:"1.4 × 10⁻⁸ mol/L", why:"[OH⁻] is measured directly from the pH; don’t double it." }] },
        b:{ prompt:"Lime is added until pH = 11.00. What is the highest [Mg²⁺] that can stay dissolved? (<i>K</i><sub>sp</sub> of Mg(OH)₂ = 5.6 × 10⁻¹²)", options:[
          { t:"5.6 × 10⁻⁶ mol/L", ok:true, why:"[OH⁻] = 1.0 × 10⁻³; 5.6 × 10⁻¹² ÷ 1.0 × 10⁻⁶." },
          { t:"5.6 × 10⁻⁹ mol/L", why:"[OH⁻] must be squared." },
          { t:"5.6 × 10⁻¹² mol/L", why:`That’s ${K} itself, not [Mg²⁺].` },
          { t:"1.4 × 10⁻⁶ mol/L", why:"[OH⁻] is measured directly from the pH; don’t double it." }] } }
    ]
  },
  task:{
    title:"Just a little precipitate", summary:"Just a little precipitate",
    statement:`<p>For a class demonstration, mix 50.0 mL of a Ca(NO₃)₂ solution with 50.0 mL of a NaF solution so that a <strong>small</strong> amount of CaF₂ (${K} 3.5 × 10⁻¹¹) forms. Meet every condition. Can you find all the answers?</p><ol class="ks-conds"><li>A precipitate forms.</li><li>Only a little forms: ${Q} stays below 10 × ${K}.</li><li>Fluoride is in short supply: the NaF stock can’t be more concentrated than the Ca(NO₃)₂ stock.</li></ol>`,
    checks:["A precipitate forms", `Only a little: ${Q} < 10 × ${K}`, "Fluoride in short supply: NaF stock ≤ Ca(NO₃)₂ stock"],
    tips:[`Halve both stocks, then ${Q} = [Ca²⁺][F⁻]². Fluoride is squared, so it matters most.`, `Your ${Q} is too big; pick a weaker stock.`, "Swap toward more calcium and less fluoride."],
    explainPrompt:"Explain how you used the after-mixing concentrations and the squared fluoride term to choose your stocks.",
    vocab:`Use the words ion product, ${K}, dilution and precipitate.`,
    more:"There’s more than one answer. Can you find them all?",
    after3:`Fluoride is squared in ${Q}, so the F⁻ stock decides most of the outcome: no answer works with F⁻ below 4.0 × 10⁻⁴ mol/L.`,
    afterAt:4
  },
  cards:[
    ["Saturated solution", `Dynamic equilibrium: dissolving and precipitating at equal rates; ${Q} = ${K}.`],
    [`${K} expression`, "Ion concentrations with coefficients as exponents; the solid is left out. CaF₂: [Ca²⁺][F⁻]²."],
    [`Molar solubility ${s}`, "Moles of salt that dissolve per litre of saturated solution."],
    ["AB salt", `${K} = ${s}², so ${s} = √${K}.`],
    ["AB₂ or A₂B salt", `${K} = 4${s}³.`],
    ["Comparing solubility", `Compare ${s}, not ${K}, when formula types differ.`],
    [`Ion product ${Q}`, `Same form as ${K}, using the current concentrations.`],
    ["Will it precipitate?", `${Q} > ${K}: yes · ${Q} = ${K}: saturated · ${Q} < ${K}: no.`],
    ["Mixing solutions", "Find the after-mixing concentrations first (equal volumes: halve each)."],
    ["Common-ion effect", `A shared ion lowers solubility; ${K} is unchanged.`],
    ["Hydroxide precipitation", `Max [M²⁺] = ${K} ÷ [OH⁻]²: raising the pH removes metal ions.`],
    [`What changes ${K}?`, "Only temperature."]
  ]
};
