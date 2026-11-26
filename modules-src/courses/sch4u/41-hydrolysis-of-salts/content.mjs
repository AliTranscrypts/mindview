// SCH4U 41 Hydrolysis of Salts. Source: /Users/ali/Desktop/MV/Modules/sch4u/plan/modules/41-hydrolysis-of-salts.md
// The salt sorter (Sort / Zoom to the particles / Calculate), the Salts at work stations, the "Calculate the pH" number
// entry and the "Exactly pH 9" builder are drawn by app.js. Every K comes from MV.chem.data (course tables, C13).

const Ka = "<i>K</i><sub>a</sub>", Kb = "<i>K</i><sub>b</sub>", Kw = "<i>K</i><sub>w</sub>", x = "<i>x</i>", c = "<i>c</i>";

// Misconception core sentences (plan §3)
const M1 = "Neutralization makes a salt, but the salt’s ions may still react with water. Check each ion’s parent.";
const M2 = "Ions from strong acids and strong bases don’t react with water. Their parents ionize completely, so they have no pull on H⁺.";
const M3 = `Ethanoate is a base. Its constant is ${Kb} = ${Kw} ÷ ${Ka} = 5.6 × 10⁻¹⁰, not 1.8 × 10⁻⁵.`;
const M4 = "An anion like F⁻ <em>accepts</em> H⁺ from water. That leaves OH⁻, not H₃O⁺.";
const M5 = `${x} from a base is [OH⁻]. That gives pOH; then pH = 14.00 − pOH.`;
const M6 = `It’s the reverse. The weaker the acid, the stronger its conjugate base: ${Kb} = ${Kw} ÷ ${Ka}.`;
const M7 = `Both ions react, so compare them. NH₄F is acidic because ${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰ is larger than ${Kb}(F⁻) = 1.5 × 10⁻¹¹.`;

// Activity 1 hints 1 and 2 (plan)
const SH1 = "Name each ion’s parent acid or base.", SH2 = "Only ions with a <em>weak</em> parent react with water.";
const BOXN = { a:"Acidic", b:"Basic", n:"Neutral" };
function sortItem(id, t, box, why, wrong){
  return { id, t, answer:box, why, wrong:wrong || {}, hints:[SH1, SH2, BOXN[box] + ": " + why] };
}
const STRONG = "Which ion would react? Both parents ionize completely.";
// Activity 2 hints 1 and 2 for H1 to H4 (plan)
const CH1 = "Which ion reacts? Is it an acid or a base?", CH2 = `Convert to the right ${"<i>K</i>"}.`;

export default {
  id:"41-hydrolysis-of-salts",
  kind:"topic",
  title:"Hydrolysis of salts",
  topic:"Hydrolysis of Salts",
  readyTopic:"hydrolysis of salts",
  hero:{
    eq:"CH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)", eqSize:"sm",
    eqLabel:"ethanoate ion plus water, in equilibrium with ethanoic acid plus hydroxide ion",
    headline:"Some salts quietly change the pH.",
    text:"When a salt dissolves, its ions spread through the water. Some ions just float there. Others react with water: this is <strong>hydrolysis</strong>. The <strong>conjugate base</strong> of a weak acid pulls H⁺ off water and leaves OH⁻, making the solution <strong>basic</strong>. The <strong>conjugate acid</strong> of a weak base hands H⁺ to water, making it <strong>acidic</strong>.",
    fig:{ html:'<div class="hs-hx"><div id="hs-hx-svg"></div><div class="hs-hx-row"><p class="hs-hx-cap" id="hs-hx-cap" aria-live="polite"></p><button type="button" class="btn ghost sm" id="hs-hx-replay" hidden>Replay</button></div></div>' }
  },
  goals:[
    "I can predict whether a salt solution is acidic, basic or neutral from the acids and bases its ions came from.",
    "I can write the hydrolysis equation for an ion that reacts with water.",
    `I can find ${Kb} from ${Ka} (or ${Ka} from ${Kb}) using ${Ka} × ${Kb} = ${Kw}.`,
    "I can calculate the pH of a salt solution with an ICE table and the 5% check.",
    `I can predict the pH of a salt whose ions both hydrolyze by comparing ${Ka} and ${Kb}.`,
    "I can explain everyday effects of salt hydrolysis in food, cleaning, soil and water."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Conjugate pairs", goal:1,
          prompt:"What is the conjugate base of HF?",
          options:[
            { t:"F⁻", ok:true, why:"Remove one H⁺ from the acid." },
            { t:"H₂F⁺", why:"That’s HF acting as a base: its conjugate acid." },
            { t:"HF⁻", why:"A conjugate base differs by one H⁺, not one electron." },
            { t:"OH⁻", why:"OH⁻ is water’s conjugate base." }],
          hints:["Acid → conjugate base: take away what?", "One H⁺.", "HF − H⁺ = F⁻."] },
        { id:"w2", skill:"Conjugate pairs", goal:2,
          prompt:"What is the conjugate acid of NH₃?",
          options:[
            { t:"NH₄⁺", ok:true, why:"Add one H⁺." },
            { t:"NH₂⁻", why:"That’s the conjugate base." },
            { t:"H₃O⁺", why:"That’s water’s conjugate acid." },
            { t:"NH₃⁺", why:"Adding H⁺ adds a hydrogen atom too." }],
          hints:["Base → conjugate acid: add what?", "One H⁺.", "NH₃ + H⁺ = NH₄⁺."] },
        { id:"w3", skill:`${Ka} × ${Kb} = ${Kw}`, goal:3, use:"1 ÷ 1.8 ≈ 0.56",
          prompt:`${Ka} of ethanoic acid is 1.8 × 10⁻⁵. What is ${Kb} of the ethanoate ion?`,
          options:[
            { t:"5.6 × 10⁻¹⁰", ok:true, why:`${Kb} = ${Kw} ÷ ${Ka} = 1.0 × 10⁻¹⁴ ÷ 1.8 × 10⁻⁵.` },
            { t:"1.8 × 10⁻⁵", why:"That’s the acid’s constant, not its conjugate base’s." },
            { t:"1.8 × 10⁻¹⁹", why:`Divide ${Kw} by ${Ka}.` },
            { t:"5.6 × 10⁻⁹", why:"10⁻¹⁴ ÷ 10⁻⁵ = 10⁻⁹, and 1 ÷ 1.8 = 0.56 moves it to 5.6 × 10⁻¹⁰." }],
          hints:[`For a conjugate pair, ${Ka} × ${Kb} = ?`, `${Kw} = 1.0 × 10⁻¹⁴.`, "1.0 × 10⁻¹⁴ ÷ 1.8 × 10⁻⁵ = 0.56 × 10⁻⁹ = 5.6 × 10⁻¹⁰."] },
        { id:"w4", skill:"Weak acid and base calculations", goal:4,
          prompt:`For a weak base, ${x}² = 1.0 × 10⁻¹⁰, where ${x} = [OH⁻]. What is the pH?`,
          options:[
            { t:"9.00", ok:true, why:`${x} = 1.0 × 10⁻⁵, so pOH = 5.00 and pH = 9.00.` },
            { t:"5.00", why:"That’s the pOH." },
            { t:"10.00", why:"Take √(10⁻¹⁰) = 10⁻⁵ first." },
            { t:"4.00", why:"Square-root first." }],
          hints:[`Find ${x} first.`, `${x} = 1.0 × 10⁻⁵ mol/L is [OH⁻].`, "pOH 5.00; pH = 14.00 − 5.00."] },
        { id:"w5", skill:"Weak acid and base calculations", goal:4,
          prompt:`A weak acid has ${Ka} = 1.0 × 10⁻⁶ and ${c} = 0.010 mol/L. Does the 5% check pass for ${x} = √(${Ka}${c})?`,
          options:[
            { t:`Yes: ${x} = 1.0 × 10⁻⁴, which is 1% of 0.010`, ok:true, why:"Under 5%, so the approximation is fine." },
            { t:`No: ${x} is 10% of ${c}`, why:"1.0 × 10⁻⁴ ÷ 0.010 = 0.010 = 1%." },
            { t:"The check isn’t needed for weak acids", why:"The check is what makes the shortcut valid." },
            { t:`Yes, because ${Ka} is small`, why:`Small ${Ka} usually helps, but the check compares ${x} with ${c}.` }],
          hints:[`${x} = √(${Ka} × ${c}).`, "√(10⁻⁸) = 10⁻⁴.", "10⁻⁴ ÷ 10⁻² = 1%."] },
        { id:"w6", skill:"Strong vs weak", goal:1,
          prompt:"Which acid is strong?",
          options:[
            { t:"HNO₃", ok:true, why:"It ionizes completely in water." },
            { t:"HF", why:`HF is weak (${Ka} = 6.6 × 10⁻⁴).` },
            { t:"CH₃COOH", why:"Ethanoic acid is weak." },
            { t:"HOCl", why:`Hypochlorous acid is very weak (${Ka} = 3.0 × 10⁻⁸).` }],
          hints:["Strong acids ionize 100%.", "The common strong acids are HCl, HBr, HI, HNO₃, H₂SO₄ and HClO₄.", "HNO₃."] }
      ],
      refreshers:{
        "Conjugate pairs":"An acid and its conjugate base differ by one H⁺: HF/F⁻, NH₄⁺/NH₃, CH₃COOH/CH₃COO⁻.",
        [`${Ka} × ${Kb} = ${Kw}`]:`For any conjugate pair at 25 °C, ${Ka} × ${Kb} = 1.0 × 10⁻¹⁴. Knowing one gives the other.`,
        "Weak acid and base calculations":`${x}² = <i>K</i> × ${c}, then check ${x} ÷ ${c} &lt; 5%. For a base, ${x} is [OH⁻]: find pOH, then pH = 14.00 − pOH.`,
        "Strong vs weak":`Strong acids (HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄) and strong bases (group 1 hydroxides) ionize completely. Everything in the course ${Ka} and ${Kb} tables is weak.`
      }
    }
  },
  explore:{
    heading:"Salt sorter",
    intro:"Dissolve a salt, predict acidic, basic or neutral, then test it. Zoom in to see which ion reacts with water, and work out the pH.",
    how:"Choose a salt from the shelf and a concentration (arrow keys move through the chips). Predict <strong>Acidic</strong>, <strong>Basic</strong> or <strong>Neutral</strong>, then press <strong>Test</strong>. Switch the view to <strong>Zoom to the particles</strong> (Space steps the animation) or <strong>Calculate</strong> for the ICE workbench.",
    modes:[{ id:"sort", t:"Sort" }, { id:"zoom", t:"Zoom to the particles" }, { id:"calc", t:"Calculate" }],
    modelNote:`For NH₄CH₃COO and NH₄F (both ions react), the m&#101;ter uses the model pH = 7.00 − ½ log(${Ka} ÷ ${Kb}). This formula is beyond the course and is never assessed: compare ${Ka}(cation) with ${Kb}(anion) instead.`,
    predictions:[
      { id:"p1", prompt:"Three beakers, 0.18 mol/L each. Which one turns universal indicator blue (basic)?",
        options:[{ t:"CH₃COONa", ok:true }, { t:"NH₄Cl" }, { t:"NaCl" }, { t:"KNO₃" }],
        explain:"Ethanoate is the conjugate base of a weak acid. NH₄Cl is acidic; NaCl and KNO₃ are neutral." },
      { id:"p2", prompt:"NaCl, 0.30 mol/L. What is the pH?",
        options:[{ t:"7.00", ok:true }, { t:"below 7" }, { t:"above 7" }, { t:"it depends on the concentration" }],
        explain:"NaOH and HCl are both strong, so neither ion pulls on H⁺. " + M1 },
      { id:"p3", prompt:"CH₃COONa at 0.18 mol/L has pH 9.00. Now the concentration chip moves to 0.018. Ten times more dilute. The pH becomes:",
        options:[{ t:"8.50", ok:true }, { t:"8.00" }, { t:"9.00" }, { t:"9.50" }],
        explain:`[OH⁻] = √(${Kb} × ${c}). Dividing ${c} by 10 divides [OH⁻] by √10, so pOH rises by 0.50. A strong base would change by a full unit.` },
      { id:"p4", prompt:`NH₄CH₃COO. ${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰ and ${Kb}(CH₃COO⁻) = 5.6 × 10⁻¹⁰. The solution is:`,
        options:[{ t:"Neutral", ok:true }, { t:"Acidic" }, { t:"Basic" }, { t:"Impossible to tell" }],
        explain:"They pull equally. This salt is neutral because the two constants match, not because every weak–weak salt is neutral. Try NH₄F next." }
    ],
    chalIntro:"Use the sorter to meet each goal, then press <strong>Check challenge</strong>. Each challenge has three levels of help. For challenge 3, press <strong>Stretch mode</strong> under the pH readout toggle: the pH stays hidden until you check.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Make a solution with pH 5.00 using one salt from the shelf.",
        why:`NH₄Cl at 0.18 mol/L: ${Ka}(NH₄⁺) × ${c} = 5.6 × 10⁻¹⁰ × 0.18 = 1.0 × 10⁻¹⁰, so [H₃O⁺] = 1.0 × 10⁻⁵ and pH = 5.00.`,
        hints:[`pH 5.00 means [H₃O⁺] = 1.0 × 10⁻⁵, so ${Ka} × ${c} = 1.0 × 10⁻¹⁰.`, `Which acidic cation has ${Ka} near 10⁻¹⁰ to 10⁻⁹?`, `NH₄⁺: ${Ka} = 5.6 × 10⁻¹⁰, so ${c} = 1.0 × 10⁻¹⁰ ÷ 5.6 × 10⁻¹⁰ = 0.18 mol/L.`] },
      { id:"tc2", goal:[3, 4], prompt:"Make a solution with pH 10.00.",
        why:`NaOCl at 0.030 mol/L: ${Kb}(OCl⁻) × ${c} = 3.3 × 10⁻⁷ × 0.030 = 1.0 × 10⁻⁸, so [OH⁻] = 1.0 × 10⁻⁴, pOH 4.00 and pH 10.00.`,
        hints:[`pOH 4.00, so [OH⁻] = 1.0 × 10⁻⁴ and ${Kb} × ${c} = 1.0 × 10⁻⁸.`, `Which anion has the largest ${Kb}? Its parent has the smallest ${Ka}.`, `HOCl (${Ka} = 3.0 × 10⁻⁸) gives ${Kb}(OCl⁻) = 3.3 × 10⁻⁷, so ${c} = 10⁻⁸ ÷ 3.3 × 10⁻⁷ = 0.030 mol/L.`] },
      { id:"tc3", goal:[4, 6], stretch:true, prompt:"The pH readout is hidden. Choose a salt and concentration that give pH 8.50. There are three ways; find one, and justify it.",
        why:`All three ways have ${Kb} × ${c} = 1.0 × 10⁻¹¹: CH₃COONa at 0.018, C₆H₅COONa at 0.063 and HCOONa at 0.18 mol/L. Methanoate needs the <em>highest</em> concentration because methanoic acid is the <em>strongest</em> of the three acids, so its conjugate base is the weakest.`,
        hints:[`pOH 5.50, so [OH⁻] = 10<sup>−5.5</sup> and ${x}² = 1.0 × 10⁻¹¹.`, `So ${Kb} × ${c} must equal 1.0 × 10⁻¹¹. Find ${c} = 10⁻¹¹ ÷ ${Kb} for each basic anion.`, "Ethanoate: 10⁻¹¹ ÷ 5.6 × 10⁻¹⁰ = 0.018. Benzoate: 10⁻¹¹ ÷ 1.6 × 10⁻¹⁰ = 0.063. Methanoate: 10⁻¹¹ ÷ 5.6 × 10⁻¹¹ = 0.18."] }
    ],
    blocks:[{ title:"What the sorter shows", html:`<p>Only the ion with a <em>weak</em> parent matters, and its strength is set by how weak the parent is. Diluting tenfold moves the pH by only 0.50, because [OH⁻] (or [H₃O⁺]) is proportional to √${c}.</p>` }]
  },
  part3:{
    slug:"salts", name:"Salts at work", heading:"Salts at work",
    intro:"From the sorter to real products and places: salts in food, cleaning, soil and water treatment. Link each effect back to one ion’s reaction with water.",
    s1:{ title:"Station 1: Baking soda",
      intro:"NaHCO₃ dissolves to give HCO₃⁻, which is <strong>amphiprotic</strong>: it could give H⁺ or take it. Zoom to the particles and compare the two arrows.",
      acid:`As an acid: HCO₃⁻ + H₂O ⇌ CO₃²⁻ + H₃O⁺, with ${Ka}2 = 4.7 × 10⁻¹¹.`,
      base:`As a base: HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻, with ${Kb} = ${Kw} ÷ ${Ka}1 = 1.0 × 10⁻¹⁴ ÷ 4.3 × 10⁻⁷ = 2.3 × 10⁻⁸.`,
      verdict:`Since ${Kb} &gt; ${Ka}2, baking soda solution is mildly basic (pH ≈ 8.3, measured).` },
    s2:{ title:"Station 2: Ammonium fertilizer in the soil",
      intro:"Years of ammonium sulfate fertilizer, (NH₄)₂SO₄, slowly acidify farm soil. Tap each ion to see whether it reacts with water.",
      nh4:"NH₄⁺ reacts: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺. The H₃O⁺ acidifies the soil.",
      so4:"SO₄²⁻ doesn’t matter here: its parent, H₂SO₄, is strong in its first ionization.",
      lime:"A prairie farmer spreads agricultural lime (CaCO₃) to raise the pH again." },
    s3:{ title:"Station 3: A preservative that works best in acid",
      intro:"Sodium benzoate is added to a soft drink. Its solution is basic, but the drink is acidic (pH ≈ 3). In the drink most benzoate is converted to benzoic acid, which is the form that slows the growth of moulds.",
      check:`At pH 3.00 the ratio [benzoate] ÷ [benzoic acid] = ${Ka} ÷ [H₃O⁺] = 6.3 × 10⁻⁵ ÷ 1.0 × 10⁻³ = 0.063, so about 94% is in the acid form.` },
    s4:{ title:"Station 4: Clearing water with aluminium sulfate",
      intro:"Treatment plants add Al₂(SO₄)₃ to clump fine particles.",
      why:"Hydrated Al³⁺ ions are acidic: the small, highly charged ion pulls electron density from bound water, which releases H⁺. So the water’s pH drops and must be adjusted.",
      eq:"[Al(H₂O)₆]³⁺ + H₂O ⇌ [Al(H₂O)₅OH]²⁺ + H₃O⁺" },
    data:{ title:"Check it with data",
      intro:"Model data: 0.10 mol/L solutions. Sort each solution first (its pH shows when it’s in the right box), then rank them.",
      rows:[["NaCl", 7.0, "n"], ["NH₄Cl", 5.1, "a"], ["CH₃COONa", 8.9, "b"], ["NaHCO₃", 8.3, "b"], ["Na₂CO₃", 11.7, "b"], ["Al₂(SO₄)₃", 3.5, "a"]],
      why:{ "NaCl":"Both parents are strong: neutral.", "NH₄Cl":"NH₄⁺ gives H⁺ to water.", "CH₃COONa":"Ethanoate takes H⁺ from water.",
        "NaHCO₃":"HCO₃⁻ is amphiprotic; its base reaction wins.", "Na₂CO₃":"CO₃²⁻ takes H⁺ from water.", "Al₂(SO₄)₃":"Hydrated Al³⁺ releases H⁺." },
      prompt:"Why is Na₂CO₃ far more basic than NaHCO₃?",
      choices:[
        { t:`CO₃²⁻ is the conjugate base of HCO₃⁻, a much weaker acid (${Ka}2 = 4.7 × 10⁻¹¹), so CO₃²⁻ is a much stronger base.`, ok:true, fb:"Right. " + M6 },
        { t:"Na₂CO₃ has two Na⁺ ions, and each Na⁺ makes OH⁻.", fb:M2 },
        { t:`HCO₃⁻ is a weaker acid than H₂CO₃, so HCO₃⁻ is the stronger base.`, fb:"Compare the parents of the two ions: CO₃²⁻ comes from HCO₃⁻, the weakest acid here. " + M6 }] },
    quickCheck:{
      title:"Quick check", summary:"Salts at work quick check",
      items:[
        { id:"q1", goal:6, prompt:"Which ion makes ammonium sulfate fertilizer acidify soil?",
          choices:[
            { t:"NH₄⁺", ok:true, fb:"Right. NH₄⁺ gives H⁺ to water; sulfate is a spectator here." },
            { t:"SO₄²⁻", fb:"NH₄⁺ gives H⁺ to water; sulfate is a spectator here." },
            { t:"H₂O", fb:"NH₄⁺ gives H⁺ to water; sulfate is a spectator here." },
            { t:"Ca²⁺", fb:"NH₄⁺ gives H⁺ to water; sulfate is a spectator here." }] },
        { id:"q2", goal:6, prompt:"Baking soda solution is mildly basic because…",
          choices:[
            { t:`${Kb}(HCO₃⁻) &gt; ${Ka}(HCO₃⁻)`, ok:true, fb:"Right. HCO₃⁻ is amphiprotic; its base reaction wins." },
            { t:"Na⁺ makes OH⁻", fb:"HCO₃⁻ is amphiprotic; its base reaction wins. " + M2 },
            { t:"HCO₃⁻ contains OH⁻", fb:"HCO₃⁻ is amphiprotic; its base reaction wins." },
            { t:"CO₂ is a base", fb:"HCO₃⁻ is amphiprotic; its base reaction wins." }] },
        { id:"q3", goal:6, prompt:"In an acidic drink, most sodium benzoate ends up as…",
          choices:[
            { t:"benzoic acid", ok:true, fb:"Right. Excess H₃O⁺ converts the conjugate base to the acid." },
            { t:"benzoate", fb:"Excess H₃O⁺ converts the conjugate base to the acid." },
            { t:"Na⁺", fb:"Excess H₃O⁺ converts the conjugate base to the acid." },
            { t:"CO₂", fb:"Excess H₃O⁺ converts the conjugate base to the acid." }] },
        { id:"q4", goal:6, prompt:"Adding Al₂(SO₄)₃ to water makes the pH…",
          choices:[
            { t:"fall", ok:true, fb:"Right. Hydrated Al³⁺ releases H⁺." },
            { t:"rise", fb:"Hydrated Al³⁺ releases H⁺." },
            { t:"stay at 7", fb:"Hydrated Al³⁺ releases H⁺." },
            { t:"reach 14", fb:"Hydrated Al³⁺ releases H⁺." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Acidic, basic or neutral?", summary:"Acidic, basic or neutral?", goal:[1, 5], noun:"salt", txt:true,
        instruction:"Ten 0.10 mol/L salt solutions. Put each one in the box for its solution. Items marked ★ are non-routine.",
        boxes:[{ id:"a", label:"Acidic" }, { id:"b", label:"Basic" }, { id:"n", label:"Neutral" }],
        wrongDefault:"Check each ion’s parent: strong or weak?",
        items:[
          sortItem("i1", "KCl", "n", "K⁺ from KOH (strong), Cl⁻ from HCl (strong).", { a:STRONG + " " + M2, b:STRONG + " " + M2 }),
          sortItem("i2", "NH₄Br", "a", "NH₄⁺ (weak-base parent) gives H⁺; Br⁻ is a spectator."),
          sortItem("i3", "Na₂CO₃", "b", "CO₃²⁻ is the conjugate base of the very weak acid HCO₃⁻."),
          sortItem("i4", "KF", "b", "F⁻ is the conjugate base of HF, a weak acid.", { n:"F⁻ comes from a weak acid. " + M1 }),
          sortItem("i5", "NaNO₃", "n", "Both parents are strong.", { a:STRONG + " " + M2, b:STRONG + " " + M2 }),
          sortItem("i6", "CH₃NH₃Br", "a", "CH₃NH₃⁺ is the conjugate acid of methylamine, a weak base."),
          sortItem("i7", "C₆H₅COOK (potassium benzoate)", "b", "Benzoate is a weak acid’s conjugate base."),
          sortItem("i8", "NH₄CH₃COO", "n", `${Ka}(NH₄⁺) = ${Kb}(CH₃COO⁻) = 5.6 × 10⁻¹⁰.`),
          sortItem("i9", "NH₄F ★", "a", `${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰ &gt; ${Kb}(F⁻) = 1.5 × 10⁻¹¹.`, { n:"Both ions react; compare their constants. " + M7 }),
          sortItem("i10", "AlCl₃ ★", "a", "Hydrated Al³⁺ releases H⁺; Cl⁻ is a spectator.")
        ] },
      { id:"calc", type:"custom", title:"Calculate the pH", summary:"Calculate the pH", star:true, goal:[3, 4, 5, 6],
        instruction:"Six calculations. Items 4 to 6 (★) are non-routine; items 5 and 6 go beyond the Final Check.",
        how:"Type your answer and press Check. pH answers are accepted within 0.02. For a constant, type the number in front of × 10 and the power of ten in the two boxes.",
        use:"1 ÷ 1.8 ≈ 0.56, 1 ÷ 6.6 ≈ 0.15, 1 ÷ 3.0 ≈ 0.33, 1 ÷ 4.4 ≈ 0.23, log 2 = 0.30",
        wrongDefault:`Check which ion reacts, which <i>K</i> you used, and whether ${x} is [OH⁻] or [H₃O⁺].`,
        items:[
          { id:"h1", kind:"ph", goal:4, prompt:"pH of 0.18 mol/L NH₄Cl", answer:5.00, tol:0.02,
            wrong:[{ v:9.00, fb:`${x} here is [H₃O⁺], so it’s already the pH side.` }, { v:2.74, fb:`That used ${Kb}(NH₃) as if NH₄⁺ were an acid with ${Ka} = 1.8 × 10⁻⁵.` }],
            why:`NH₄⁺ is an acid: ${Ka} = ${Kw} ÷ ${Kb} = 5.6 × 10⁻¹⁰; ${x}² = 5.6 × 10⁻¹⁰ × 0.18 = 1.0 × 10⁻¹⁰; ${x} = [H₃O⁺] = 1.0 × 10⁻⁵; pH 5.00.`,
            hints:[CH1, CH2, `NH₄⁺ is an acid: ${Ka} = 5.6 × 10⁻¹⁰; ${x}² = 5.6 × 10⁻¹⁰ × 0.18 = 1.0 × 10⁻¹⁰; ${x} = [H₃O⁺] = 1.0 × 10⁻⁵; pH = 5.00.`] },
          { id:"h2", kind:"ph", goal:4, prompt:"pH of 0.72 mol/L CH₃COONa", answer:9.30, tol:0.02,
            wrong:[{ v:4.70, fb:"That’s pOH. " + M5 }],
            why:`CH₃COO⁻ is a base: ${Kb} = 5.6 × 10⁻¹⁰; ${x}² = 5.6 × 10⁻¹⁰ × 0.72 = 4.0 × 10⁻¹⁰; ${x} = [OH⁻] = 2.0 × 10⁻⁵; pOH = 5.00 − log 2 = 4.70; pH 9.30.`,
            hints:[CH1, CH2, `CH₃COO⁻ is a base: ${Kb} = 1.0 × 10⁻¹⁴ ÷ 1.8 × 10⁻⁵ = 5.6 × 10⁻¹⁰; ${x}² = 4.0 × 10⁻¹⁰; ${x} = [OH⁻] = 2.0 × 10⁻⁵; pOH 4.70; pH 9.30.`] },
          { id:"h3", kind:"ph", goal:4, prompt:"pH of 0.066 mol/L NaF", answer:8.00, tol:0.02,
            wrong:[{ v:6.00, fb:M5 }],
            why:`F⁻ is a base: ${Kb} = 1.0 × 10⁻¹⁴ ÷ 6.6 × 10⁻⁴ = 1.5 × 10⁻¹¹; ${x}² = 1.5 × 10⁻¹¹ × 0.066 = 1.0 × 10⁻¹²; ${x} = [OH⁻] = 1.0 × 10⁻⁶; pOH 6.00; pH 8.00.`,
            hints:[CH1, CH2, `F⁻ is a base: ${Kb} = 1.5 × 10⁻¹¹; ${x}² = 1.0 × 10⁻¹²; ${x} = [OH⁻] = 1.0 × 10⁻⁶; pOH 6.00; pH 8.00.`] },
          { id:"h4", kind:"ph", goal:4, star:true, prompt:"pH of 0.030 mol/L NaOCl (show the 5% check)", answer:10.00, tol:0.02,
            // VERIFY: the plan lists 4.72 for "used Ka(HOCl) directly"; that mistake gives 4.52 (or 9.48 via pOH), so all three get this feedback.
            wrong:[{ v:4.00, fb:M5 }, { v:4.72, fb:`You used ${Ka}(HOCl) directly. Hypochlorite is a base: ${Kb} = ${Kw} ÷ ${Ka} = 3.3 × 10⁻⁷.` },
              { v:4.52, fb:`You used ${Ka}(HOCl) directly. Hypochlorite is a base: ${Kb} = ${Kw} ÷ ${Ka} = 3.3 × 10⁻⁷.` }, { v:9.48, fb:`You used ${Ka}(HOCl) directly. Hypochlorite is a base: ${Kb} = ${Kw} ÷ ${Ka} = 3.3 × 10⁻⁷.` }],
            why:`OCl⁻ is a base: ${Kb} = 1.0 × 10⁻¹⁴ ÷ 3.0 × 10⁻⁸ = 3.3 × 10⁻⁷; ${x}² = 3.3 × 10⁻⁷ × 0.030 = 1.0 × 10⁻⁸; ${x} = [OH⁻] = 1.0 × 10⁻⁴; 5% check: 1.0 × 10⁻⁴ ÷ 0.030 = 0.33%, passes; pOH 4.00; pH 10.00.`,
            hints:[CH1, CH2, `OCl⁻ is a base: ${Kb} = 3.3 × 10⁻⁷; ${x}² = 1.0 × 10⁻⁸; ${x} = [OH⁻] = 1.0 × 10⁻⁴ (0.33% of 0.030: passes); pOH 4.00; pH 10.00.`] },
          { id:"h5", kind:"sci", goal:3, star:true, prompt:`A 0.044 mol/L solution of the salt BHCl has pH 6.00. Find ${Kb} of the base B.`, answer:4.4e-4, tol:0.03, label:`${Kb} =`,
            wrong:[{ v:2.3e-11, fb:`That’s ${Ka} of BH⁺. Convert: ${Kb} = ${Kw} ÷ ${Ka}.` }, { v:1.0e-12, fb:`Divide ${x}² by ${c}.` }],
            why:`[H₃O⁺] = 1.0 × 10⁻⁶; ${Ka}(BH⁺) = (10⁻⁶)² ÷ 0.044 = 2.3 × 10⁻¹¹; ${Kb} = 10⁻¹⁴ ÷ 2.3 × 10⁻¹¹ = 4.4 × 10⁻⁴ (methylamine).`,
            hints:["pH 6.00 means [H₃O⁺] = 1.0 × 10⁻⁶.", `${Ka}(BH⁺) = (10⁻⁶)² ÷ 0.044 = 2.3 × 10⁻¹¹.`, `${Kb} = 10⁻¹⁴ ÷ 2.3 × 10⁻¹¹ = 4.4 × 10⁻⁴ (methylamine).`] },
          { id:"h6", kind:"num", goal:6, star:true, unit:"mol/L", label:`${c} =`,
            prompt:"<strong>Investigation:</strong> A bottle labelled 0.18 mol/L sodium ethanoate reads pH 8.50 on a calibrated m&#101;ter. What concentration does the pH suggest?", answer:0.018, tol:0.06,
            wrong:[{ v:1.8, fb:"A higher concentration would give a <em>higher</em> pH." }],
            why:`pOH 5.50, so [OH⁻]² = 1.0 × 10⁻¹¹ and ${c} = 10⁻¹¹ ÷ 5.6 × 10⁻¹⁰ = 0.018 mol/L, one tenth of the label.`,
            follow:{ prompt:"What could explain it?", t:"Likely cause: the solution was diluted tenfold or mislabelled." },
            hints:["pOH 5.50, so [OH⁻]² = 1.0 × 10⁻¹¹.", `${c} = 10⁻¹¹ ÷ ${Kb}, where ${Kb} = 5.6 × 10⁻¹⁰.`, `${c} = 0.018 mol/L, one tenth of the label.`] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Zeynep", how:"",
        instruction:"Zeynep made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Find the pH of 0.18 mol/L sodium ethanoate.",
            steps:["Ethanoate is the conjugate base of a weak acid, so it reacts with water; Na⁺ is a spectator.", "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻", `Use ${Ka} = 1.8 × 10⁻⁵: ${x}²/0.18 = 1.8 × 10⁻⁵.`, `${x} = 1.8 × 10⁻³`, "pH = 2.74"],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 follows step 3. The mistake is earlier.", "An acidic answer for a basic salt is a warning sign."],
            fixes:[
              { t:`Use ${Kb} = ${Kw} ÷ ${Ka} = 5.6 × 10⁻¹⁰: ${x}² = 1.0 × 10⁻¹⁰, ${x} = [OH⁻] = 1.0 × 10⁻⁵, pOH 5.00, pH 9.00.`, ok:true, why:M3 },
              { t:`Use ${Kw} instead: ${x}² = 1.8 × 10⁻¹⁵.`, why:`${Kw} alone isn’t the base’s constant.` },
              { t:`Use ${Ka} but subtract from 14 at the end.`, why:"The constant is still wrong." },
              { t:"Step 3 is correct.", why:`Ethanoate is a base; it needs ${Kb}.` }],
            hints:["Is ethanoate acting as an acid or a base here?", `A base needs ${Kb}.`, `${Kb} = 5.6 × 10⁻¹⁰, giving pH 9.00.`] },
          { id:"e2", goal:4, task:"Find the pH of 0.030 mol/L sodium hypochlorite.",
            steps:[`OCl⁻ is basic; ${Kb} = 1.0 × 10⁻¹⁴ ÷ 3.0 × 10⁻⁸ = 3.3 × 10⁻⁷.`, `${x}² = 3.3 × 10⁻⁷ × 0.030 = 1.0 × 10⁻⁸`, `${x} = 1.0 × 10⁻⁴; 5% check: 0.33%, passes.`, "pH = −log(1.0 × 10⁻⁴) = 4.00", "So the solution is acidic."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", "", "Step 5 follows from step 4."],
            fixes:[
              { t:`${x} is [OH⁻], so −log ${x} = pOH = 4.00; pH = 14.00 − 4.00 = 10.00.`, ok:true, why:M5 },
              { t:"pH = log(1.0 × 10⁻⁴) = −4.00.", why:"pH is −log [H₃O⁺]." },
              { t:"pH = 4.00 ÷ 2 = 2.00.", why:"No halving step." },
              { t:"Step 4 is correct.", why:"Step 3 found [OH⁻], not [H₃O⁺]." }],
            hints:[`What does ${x} stand for in a base problem?`, "[OH⁻].", "pOH 4.00, so pH 10.00."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which salt surprised you most in the sorter, and why?" },
      { id:"j2", q:"In your own words, explain why the conjugate base of a <em>weaker</em> acid is a <em>stronger</em> base." },
      { id:"j3", q:"Explain to a friend how to find the pH of a 0.18 mol/L sodium ethanoate solution, step by step." },
      { id:"j4", q:"Which step still trips you up: choosing the ion, converting <i>K</i>, or pOH vs pH? What will you practise?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which 0.10 mol/L solution is basic?", options:[
          { t:"KF", ok:true, why:"F⁻ is the conjugate base of a weak acid." },
          { t:"KCl", why:"Both parents are strong: neutral. " + M2 },
          { t:"NH₄Cl", why:"NH₄⁺ makes the solution acidic." },
          { t:"NaNO₃", why:"Neutral. " + M2 }] },
        b:{ prompt:"Which 0.10 mol/L solution is acidic?", options:[
          { t:"NH₄Br", ok:true, why:"NH₄⁺ gives H⁺ to water." },
          { t:"NaBr", why:"Neutral. " + M2 },
          { t:"CH₃COOK", why:"Basic: ethanoate is a base." },
          { t:"NaF", why:"Basic." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"Which equation shows why sodium fluoride solution is basic?", options:[
          { t:"F⁻(aq) + H₂O(l) ⇌ HF(aq) + OH⁻(aq)", ok:true, why:"F⁻ takes H⁺ from water and leaves OH⁻." },
          { t:"Na⁺(aq) + H₂O(l) ⇌ NaOH(aq) + H⁺(aq)", why:"Na⁺ is a spectator. " + M2 },
          { t:"HF(aq) + H₂O(l) ⇌ F⁻(aq) + H₃O⁺(aq)", why:"That’s HF ionizing; the salt contains F⁻, not HF." },
          { t:"F⁻(aq) + H₂O(l) ⇌ HF(aq) + H₃O⁺(aq)", why:"F⁻ takes H⁺, leaving OH⁻; this equation isn’t balanced either." }] },
        b:{ prompt:"Which equation shows why ammonium chloride solution is acidic?", options:[
          { t:"NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)", ok:true, why:"NH₄⁺ gives H⁺ to water, forming H₃O⁺." },
          { t:"Cl⁻(aq) + H₂O(l) ⇌ HCl(aq) + OH⁻(aq)", why:M2 },
          { t:"NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)", why:"That’s ammonia acting as a base; the salt contains NH₄⁺." },
          { t:"NH₄⁺(aq) + OH⁻(aq) → NH₃(aq) + H₂O(l)", why:"That’s a reaction with a base, not with water." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:`${Ka} of benzoic acid is 6.3 × 10⁻⁵. What is ${Kb} of benzoate? (Use 1 ÷ 6.3 ≈ 0.16.)`, options:[
          { t:"1.6 × 10⁻¹⁰", ok:true, why:"1.0 × 10⁻¹⁴ ÷ 6.3 × 10⁻⁵." },
          { t:"6.3 × 10⁻⁵", why:`That’s the acid’s constant, not its conjugate base’s: ${Kb} = ${Kw} ÷ ${Ka}.` },
          { t:"1.6 × 10⁻⁹", why:"Exponent slip: 0.16 × 10⁻⁹ = 1.6 × 10⁻¹⁰." },
          { t:"6.3 × 10⁻¹⁹", why:"Divide, don’t multiply." }] },
        b:{ prompt:`${Kb} of methylamine is 4.4 × 10⁻⁴. What is ${Ka} of CH₃NH₃⁺? (Use 1 ÷ 4.4 ≈ 0.23.)`, options:[
          { t:"2.3 × 10⁻¹¹", ok:true, why:"1.0 × 10⁻¹⁴ ÷ 4.4 × 10⁻⁴." },
          { t:"4.4 × 10⁻⁴", why:`That’s the base’s constant, not its conjugate acid’s: ${Ka} = ${Kw} ÷ ${Kb}.` },
          { t:"2.3 × 10⁻¹⁰", why:"0.23 × 10⁻¹⁰ = 2.3 × 10⁻¹¹." },
          { t:"4.4 × 10⁻¹⁸", why:`Divide ${Kw} by ${Kb}.` }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:`Find the pH of 0.18 mol/L sodium ethanoate (${Ka} of ethanoic acid = 1.8 × 10⁻⁵).`, options:[
          { t:"9.00", ok:true, why:`${Kb} = 5.6 × 10⁻¹⁰; ${x}² = 1.0 × 10⁻¹⁰; [OH⁻] = 1.0 × 10⁻⁵; pOH 5.00.` },
          { t:"5.00", why:"That’s the pOH. " + M5 },
          { t:"2.74", why:"That treats ethanoate as ethanoic acid. " + M3 },
          { t:"7.00", why:"Ethanoate reacts with water. " + M1 }] },
        b:{ prompt:`Find the pH of 0.18 mol/L ammonium chloride (${Kb} of NH₃ = 1.8 × 10⁻⁵).`, options:[
          { t:"5.00", ok:true, why:`${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰; ${x}² = 1.0 × 10⁻¹⁰; [H₃O⁺] = 1.0 × 10⁻⁵.` },
          { t:"9.00", why:`${x} is already [H₃O⁺] here.` },
          { t:"11.26", why:"That’s the pH of 0.18 mol/L ammonia, not ammonium." },
          { t:"7.00", why:"NH₄⁺ reacts with water. " + M1 }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:`Ammonium fluoride, NH₄F. ${Kb}(NH₃) = 1.8 × 10⁻⁵ and ${Ka}(HF) = 6.6 × 10⁻⁴. Is its solution acidic, basic or neutral?`, options:[
          { t:`Acidic, because ${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰ is larger than ${Kb}(F⁻) = 1.5 × 10⁻¹¹`, ok:true, why:"Both ions react; the larger constant wins." },
          { t:"Neutral, because both ions react with water", why:M7 },
          { t:"Basic, because F⁻ is a base", why:"NH₄⁺ also reacts, and more strongly." },
          { t:"Acidic, because HF is a weak acid", why:"The right answer for the wrong reason: compare the <em>ions’</em> constants." }] },
        b:{ prompt:`Ammonium hypochlorite, NH₄OCl. ${Kb}(NH₃) = 1.8 × 10⁻⁵ and ${Ka}(HOCl) = 3.0 × 10⁻⁸. Is its solution acidic, basic or neutral?`, options:[
          { t:`Basic, because ${Kb}(OCl⁻) = 3.3 × 10⁻⁷ is larger than ${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰`, ok:true, why:"Both ions react; the larger constant wins." },
          { t:"Neutral, because both ions react", why:"Both ions react, so compare them: the larger constant wins." },
          { t:"Acidic, because NH₄⁺ is acidic", why:"OCl⁻ reacts more strongly." },
          { t:"Basic, because HOCl is a strong acid", why:"HOCl is very weak; that’s why OCl⁻ is a strong base." }] } },
      { id:"t3", cat:"T", goal:[3, 4],
        a:{ prompt:`A 0.066 mol/L NaF solution has pH 8.00. What ${Ka} for HF does this give?`, options:[
          { t:"6.6 × 10⁻⁴", ok:true, why:`[OH⁻] = 10⁻⁶; ${Kb} = 10⁻¹² ÷ 0.066 = 1.5 × 10⁻¹¹; ${Ka} = ${Kw} ÷ ${Kb}.` },
          { t:"1.5 × 10⁻¹¹", why:`That’s ${Kb}; convert it.` },
          { t:"1.0 × 10⁻¹²", why:`That’s ${x}². Divide by ${c}.` },
          { t:"1.5 × 10⁻¹⁵", why:`You used [H₃O⁺] = 10⁻⁸ as ${x}.` }] },
        b:{ prompt:`A 0.044 mol/L CH₃NH₃Cl solution has pH 6.00. What is ${Kb} of methylamine?`, options:[
          { t:"4.4 × 10⁻⁴", ok:true, why:`${Ka} = 10⁻¹² ÷ 0.044 = 2.3 × 10⁻¹¹; ${Kb} = ${Kw} ÷ ${Ka}.` },
          { t:"2.3 × 10⁻¹¹", why:`That’s ${Ka} of CH₃NH₃⁺; convert it.` },
          { t:"1.0 × 10⁻¹²", why:`That’s ${x}². Divide by ${c}.` },
          { t:"2.3 × 10⁻¹⁵", why:"You used [OH⁻] = 10⁻⁸." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why sodium ethanoate solution is basic?", options:[
          { t:"“Ethanoate, the conjugate base of a weak acid, takes H⁺ from water and leaves OH⁻. Na⁺ comes from a strong base and doesn’t react.”", ok:true, why:"It names the reacting ion, what it does, and why Na⁺ doesn’t matter." },
          { t:"“Sodium is a metal, and metals make bases.”", why:M2 },
          { t:"“Salts of weak acids are basic because the acid has been neutralized.”", why:"That doesn’t say which ion reacts, or how." },
          { t:"“Ethanoate releases the OH⁻ groups it contains.”", why:"Ethanoate has no OH⁻ to release; it takes H⁺ from water." }] },
        b:{ prompt:"Which is the best explanation of why ammonium chloride solution is acidic?", options:[
          { t:"“NH₄⁺, the conjugate acid of a weak base, gives H⁺ to water, forming H₃O⁺. Cl⁻ comes from a strong acid and doesn’t react.”", ok:true, why:"It names the reacting ion, what it does, and why Cl⁻ doesn’t matter." },
          { t:"“Chlorine is acidic.”", why:M2 },
          { t:"“Ammonium salts contain HCl.”", why:"The solid contains ions, not HCl molecules." },
          { t:"“NH₄⁺ takes OH⁻ out of the water.”", why:"The H⁺ transfer is the key idea; the equation is NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"Which is the correct hydrolysis equation for the methylammonium ion?", options:[
          { t:"CH₃NH₃⁺(aq) + H₂O(l) ⇌ CH₃NH₂(aq) + H₃O⁺(aq)", ok:true, why:"The cation gives H⁺ to water." },
          { t:"CH₃NH₃⁺(aq) + H₂O(l) ⇌ CH₃NH₂(aq) + OH⁻(aq)", why:"The charges don’t balance, and the cation gives H⁺." },
          { t:"CH₃NH₂(aq) + H₂O(l) ⇌ CH₃NH₃⁺(aq) + OH⁻(aq)", why:"That’s the base, methylamine, not the ion." },
          { t:"CH₃NH₃⁺(aq) + OH⁻(aq) → CH₃NH₂(aq) + H₂O(l)", why:"That’s a reaction with a strong base, not hydrolysis." }] },
        b:{ prompt:"Which is the correct hydrolysis equation for the hypochlorite ion?", options:[
          { t:"OCl⁻(aq) + H₂O(l) ⇌ HOCl(aq) + OH⁻(aq)", ok:true, why:"The anion takes H⁺ from water and leaves OH⁻." },
          { t:"OCl⁻(aq) + H₂O(l) ⇌ HOCl(aq) + H₃O⁺(aq)", why:M4.replace("F⁻", "OCl⁻") },
          { t:"HOCl(aq) + H₂O(l) ⇌ OCl⁻(aq) + H₃O⁺(aq)", why:"That’s the acid ionizing." },
          { t:"Na⁺(aq) + H₂O(l) ⇌ NaOH(aq) + H⁺(aq)", why:M2 }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"After years of ammonium sulfate fertilizer, a field’s soil became more acidic. What is the best explanation?", options:[
          { t:"NH₄⁺ reacts with water to form H₃O⁺: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺.", ok:true, why:"The ammonium ion is the conjugate acid of a weak base." },
          { t:"Sulfate ions react with water to form sulfuric acid.", why:"Sulfate is a spectator here." },
          { t:"The fertilizer contains sulfuric acid.", why:"The solid is a salt of ions." },
          { t:"Plant roots release OH⁻ into the soil.", why:"That would raise the pH." }] },
        b:{ prompt:"A pool’s pH rose after sodium hypochlorite was added. What is the best explanation?", options:[
          { t:"OCl⁻ reacts with water to form OH⁻: OCl⁻ + H₂O ⇌ HOCl + OH⁻.", ok:true, why:"Hypochlorite is the conjugate base of a very weak acid." },
          { t:"Na⁺ reacts with water to form NaOH.", why:M2 },
          { t:"Hypochlorite is the conjugate base of a strong acid.", why:"HOCl is very weak." },
          { t:"Chlorine in the pool releases H₃O⁺.", why:"That would lower the pH." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A food lab has four 0.18 mol/L solutions: sodium ethanoate, sodium methanoate, sodium benzoate and sodium fluoride. Which has the highest pH?", options:[
          { t:"Sodium ethanoate", ok:true, why:`Ethanoic acid has the smallest ${Ka} of the four (1.8 × 10⁻⁵), so ethanoate is the strongest base.` },
          { t:"Sodium fluoride", why:"HF is the <em>strongest</em> of these acids, so F⁻ is the weakest base." },
          { t:"Sodium methanoate", why:`Methanoic acid (${Ka} = 1.8 × 10⁻⁴) is stronger than ethanoic acid, so methanoate is the weaker base. ` + M6 },
          { t:"Sodium benzoate", why:"Benzoic acid (6.3 × 10⁻⁵) is stronger than ethanoic acid, so benzoate is weaker as a base." }] },
        b:{ prompt:"A cleaning-products lab has four 0.10 mol/L solutions: NH₄Cl, CH₃NH₃Cl, NaCl and NaF. Which has the lowest pH?", options:[
          { t:"NH₄Cl", ok:true, why:`${Ka}(NH₄⁺) = 5.6 × 10⁻¹⁰ is larger than ${Ka}(CH₃NH₃⁺) = 2.3 × 10⁻¹¹.` },
          { t:"CH₃NH₃Cl", why:"Methylamine is the <em>stronger</em> base, so its conjugate acid is weaker." },
          { t:"NaCl", why:"Neutral." },
          { t:"NaF", why:"Basic." }] } }
    ]
  },
  task:{
    title:"Exactly pH 9", summary:"Exactly pH 9",
    statement:"<p>Use one salt and one concentration from the shelf to make a solution with pH 9.00. There’s more than one answer. Can you find them all?</p><ol><li>The solution is basic.</li><li>Its pH is 9.00 (within 0.02).</li><li>Its concentration is at most 1.0 mol/L.</li><li>The 5% check passes.</li></ol>",
    checks:["Basic", "pH 9.00", "At most 1.0 mol/L", "5% check passes"],
    tips:["pH 9 is basic: which anions react with water to make OH⁻?",
      `pOH 5.00 means [OH⁻] = 1.0 × 10⁻⁵, so ${Kb} × ${c} = 1.0 × 10⁻¹⁰. Find ${c} = 10⁻¹⁰ ÷ ${Kb}.`,
      "Sodium methanoate would need 1.8 mol/L. Pick an anion with a larger " + Kb + ".",
      `A very small ${c} risks failing the 5% check; compute ${x} ÷ ${c}.`],
    explainPrompt:`Explain how you used ${Kb} and the target pH to choose the concentration.`,
    vocab:`Use the words conjugate base, ${Kb}, hydrolysis and pOH.`,
    more:"There are three answers. Can you find them all?",
    after3:`Every answer has ${Kb} × ${c} = 1.0 × 10⁻¹⁰. The weaker the parent acid, the less salt you need.`
  },
  cards:[
    ["Hydrolysis (of a salt)", "An ion reacts with water, making H₃O⁺ or OH⁻."],
    ["Spectator ions", "Na⁺, K⁺, Cl⁻, Br⁻, NO₃⁻: their parents are strong, so they don’t react with water."],
    ["Anion of a weak acid", "A base: A⁻ + H₂O ⇌ HA + OH⁻ (basic solution)."],
    ["Cation of a weak base", "An acid: BH⁺ + H₂O ⇌ B + H₃O⁺ (acidic solution)."],
    [`${Ka} × ${Kb} = ${Kw}`, "For a conjugate pair at 25 °C: 1.0 × 10⁻¹⁴."],
    ["Weaker acid → …", `Stronger conjugate base (larger ${Kb}), more basic salt.`],
    ["Salt pH method", `Which ion reacts? → convert <i>K</i> → ${x}² = <i>K</i> × ${c} → 5% check → pH (via pOH for bases).`],
    ["0.18 mol/L sodium ethanoate", `${Kb} = 5.6 × 10⁻¹⁰; [OH⁻] = 1.0 × 10⁻⁵; pH 9.00.`],
    ["0.18 mol/L ammonium chloride", `${Ka} = 5.6 × 10⁻¹⁰; [H₃O⁺] = 1.0 × 10⁻⁵; pH 5.00.`],
    ["Both ions react", `Compare ${Ka}(cation) and ${Kb}(anion); NH₄F is acidic, NH₄OCl is basic, NH₄CH₃COO is neutral.`],
    ["Hydrated Al³⁺, Fe³⁺", "Small, highly charged metal ions make solutions acidic."],
    ["Diluting a salt solution tenfold", `pH moves 0.50 toward 7, because [OH⁻] or [H₃O⁺] ∝ √${c}.`]
  ]
};
