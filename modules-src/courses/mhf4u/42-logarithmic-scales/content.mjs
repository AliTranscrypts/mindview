// MHF4U 42 Logarithmic Scales. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/42-logarithmic-scales.md
const UV = h => '<p class="uses"><strong>Use these values</strong>' + h + "</p>";        // N20 box inside a prompt
const PH = '<span class="m">pH = −log[H⁺]</span>';                                            // pH and log upright (blueprint §7)
const HP = '<span class="m">10<sup>−pH</sup></span>';
const L_ = "`L = 10 log(I/I_0)`", M_ = "`M = log(A/A_0)`";

// ---------- Practice 1 (How many times?): feedback and hints built from each card (plan "Mistake feedback") ----------
const NEED = { b10:1, b100:2, b1000:3, b2:0.3 };            // the difference (in steps) each box needs
const BOXNAME = { b10:"×10", b100:"×100", b1000:"×1000", b2:"“about ×2”" };
const POW = { 1:"`10^1 = 10`", 2:"`10^2 = 100`", 3:"`10^3 = 1000`" };
function fmt1(v){ return String(v.toFixed(1)).replace("-", "−"); }
// card(id, tile text, scale "M" | "dB" | "pH", bigger-scale value a, other value b, why)
function card(id, t, sc, a, b, why, h3extra){
  const raw = Math.round(Math.abs(a - b) * 10) / 10, steps = sc === "dB" ? raw / 10 : raw;
  const box = steps === 1 ? "b10" : steps === 2 ? "b100" : steps === 3 ? "b1000" : "b2";
  const wrong = {};
  for (const k of Object.keys(NEED)) {
    if (k === box) continue;
    if (sc === "dB" && NEED[k] === raw) wrong[k] = raw + " dB isn’t " + raw + " steps. On the decibel scale one step of ×10 is 10 dB. What fraction of a step is " + raw + " dB?";
    else if (box === "b2" && k === "b10") wrong[k] = "0.3 is less than one whole step, so the factor is less than 10. Use `log 2 ≈ 0.301`.";
    else if (box !== "b2" && k === "b2") wrong[k] = "This pair is a whole number of steps apart, so the factor is a whole power of 10, not about 2.";
    else wrong[k] = "That box needs a difference of " + NEED[k] + " (or " + Math.round(NEED[k] * 10) + " dB on the decibel scale). Find this pair’s difference again." + (sc === "dB" ? " Then divide by 10, because it’s decibels." : "");
  }
  const hi = Math.max(a, b), lo = Math.min(a, b), unit = sc === "dB" ? " dB" : "";
  const h1 = sc === "dB" ? "Find the difference on the scale, then divide by 10, because it’s decibels." : sc === "pH" ? "Find the difference in pH." : "Find the difference in magnitude.";
  const diff = (sc === "dB" ? hi + " − " + lo : fmt1(hi) + " − " + fmt1(lo)) + " = " + raw + unit;
  const h2 = box === "b2" ? diff + ", which is " + (sc === "dB" ? "0.3 of a step of ×10." : "less than one step.")
    : diff + ", which is " + steps + (steps === 1 ? " step" : " steps") + " of ×10.";
  const h3 = box === "b2" ? "`10^{0.3} ≈ 2` (because `log 2 ≈ 0.301`), so it goes in “about ×2”." + (h3extra || "") : POW[steps] + ", so it goes in " + BOXNAME[box] + ".";
  return { id, t, answer:box, why, wrong, hints:[h1, h2, h3] };
}

export default {
  id:"42-logarithmic-scales",
  kind:"topic",
  title:"Logarithmic scales",
  topic:"Logarithmic Scales",
  readyTopic:"logarithmic scales",
  hero:{
    eq:"`log(10x) = log x + 1`", eqLabel:"log of 10 x equals log x plus 1", eqSize:"md",
    headline:"Multiply in the world, add on the scale",
    text:"Some things in nature come in sizes that differ by billions: the shaking of an earthquake, the intensity of a sound, the acidity of a liquid. A <strong>logarithmic scale</strong> records the exponent instead of the size, so each equal step on the scale means <strong>10 times</strong> as much. On the <strong>Richter scale</strong> and the <strong>pH scale</strong> that step is 1 unit (pH runs backwards: a lower pH means more); on the <strong>decibel scale</strong> it’s 10 dB. To compare two values, you don’t divide the scale numbers: you take their <strong>difference on the scale</strong> and turn it into a <strong>ratio</strong>.",
    fig:{ aria:"A ruler of amplitude from 0 to 10 to the 9. Ten dots for 1, 10, 100 and so on up to 10 to the 9 pile up near 0 on the linear ruler, then spread out evenly when it becomes a log ruler labelled with magnitudes 0 to 9. A marker hops from magnitude 2 to magnitude 5, times 10 each hop.",
      caption:"3 steps up the scale: 10 × 10 × 10 = 1000 times the amplitude." }
  },
  goals:[
    "I can explain why pH, decibels and the Richter scale are logarithmic: each step (1 pH unit, 1 magnitude, or 10 dB) is a factor of 10 in the quantity, so a huge range fits on a short scale.",
    "I can use " + PH + ", " + L_ + " and " + M_ + " to go from a quantity to its scale value and back, such as [H⁺] = " + HP + ".",
    "I can compare two values on a logarithmic scale by finding how many times as large one quantity is as the other, including the direction for pH and differences that aren’t whole numbers.",
    "I can work backwards from a ratio to a change on the scale, such as doubling an intensity (+3 dB) or combining identical sources, using the laws of logarithms.",
    "I can solve multi-step problems with logarithmic scales, including scales I haven’t seen before, and pose my own comparison questions."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Powers of ten", goal:2,
          prompt:"Write `10^{-4}` as a decimal.",
          options:[
            { t:"0.0001", ok:true, why:"`10^{-4} = 1/10^4` = 1/10 000 = 0.0001. The 1 lands in the fourth decimal place." },
            { t:"0.000 01", why:"In 0.000 01 the 1 is in the fifth place: that’s `10^{-5}`. For `10^{-4}` the 1 sits in the fourth place, so only three zeros come before it." },
            { t:"−10 000", why:"A negative exponent means “one over”, not “negative”: `10^{-4}` = 1/10 000, a small positive number." },
            { t:"−40", why:"That’s 10 × (−4). An exponent counts repeated multiplication: `10^{-4}` = 1/(10 × 10 × 10 × 10)." }],
          hints:["A negative exponent means “one over the positive power”.", "`10^{-4} = 1/10^4` = 1/10 000.", "1/10 000 = 0.0001: the 1 is in the fourth decimal place."] },
        { id:"w2", skill:"Powers of ten", goal:3,
          prompt:"How many times as large as `10^{-5}` is `10^{-2}`?",
          options:[
            { t:"1000", ok:true, why:"Divide: `10^{-2} ÷ 10^{-5} = 10^{-2 - (-5)} = 10^3` = 1000. Check: 0.01 ÷ 0.000 01 = 1000." },
            { t:"3", why:"3 is the difference of the exponents. The numbers themselves differ by a factor of `10^3` = 1000." },
            { t:"1/1000", why:"That’s `10^{-5} ÷ 10^{-2}`. But `10^{-2}` = 0.01 is the bigger number, so the answer is more than 1." },
            { t:"`10^7`", why:"That uses 2 + 5 = 7. Dividing powers subtracts exponents: −2 − (−5) = 3, so the factor is `10^3`." }],
          hints:["To compare, divide the bigger number by the smaller one.", "`10^{-2} ÷ 10^{-5}`: subtract the exponents, −2 − (−5).", "−2 − (−5) = 3, so `10^{-2}` is `10^3` = 1000 times as large as `10^{-5}`."] },
        { id:"w3", skill:"Common logarithms", goal:2,
          prompt:"Evaluate `log 0.001`.",
          options:[
            { t:"−3", ok:true, why:"0.001 = `10^{-3}`, and log asks “what power of 10?”, so `log 0.001 = -3`." },
            { t:"3", why:"`log 1000 = 3`. 0.001 is one over 1000, so its log is −3." },
            { t:"−2", why:"0.001 has two zeros after the point, but its 1 is in the third place: 0.001 = `10^{-3}`." },
            { t:"It isn’t defined, because 0.001 is less than 1.", why:"Logs are undefined only for 0 and negative numbers. Every number between 0 and 1 has a negative log: `log 0.001 = -3`." }],
          hints:["Write 0.001 as a power of 10.", "0.001 = 1/1000 = `10^{-3}`.", "`log(10^{-3}) = -3`."] },
        { id:"w4", skill:"Common logarithms", goal:3,
          prompt:"Which is closest to `10^{2.5}`?", use:"`√10 ≈ 3.16`",
          options:[
            { t:"25", why:"That’s 10 × 2.5. `10^{2.5}` is a power: `10^2 × 10^{0.5}`." },
            { t:"316", ok:true, why:"`10^{2.5} = 10^2 × 10^{0.5} = 100 × √10 ≈ 100 × 3.16` = 316." },
            { t:"500", why:"`10^{0.5}` is the square root of 10, about 3.16, not 5. Check: 5 × 5 = 25, not 10." },
            { t:"550", why:"550 is halfway between 100 and 1000. But `10^{2.5}` is halfway in the <strong>exponent</strong>, and that’s much closer to 100: 100 × 3.16 ≈ 316." }],
          hints:["Split the exponent: `10^{2.5} = 10^2 × 10^{0.5}`.", "`10^{0.5}` means `√10 ≈ 3.16`.", "100 × 3.16 = 316."] },
        { id:"w5", skill:"Laws of logarithms", goal:4,
          prompt:"Simplify `log 5000 - log 5`.",
          options:[
            { t:"3", ok:true, why:"Quotient law: `log 5000 - log 5 = log(5000/5) = log 1000 = 3`." },
            { t:"1000", why:"5000 ÷ 5 = 1000 is right so far, but the answer is `log 1000 = 3`." },
            { t:"`log 4995`", why:"`log x - log y` is `log(x/y)`, not `log(x - y)`. Subtracting logs divides the numbers." },
            { t:"`(log 5000)/(log 5)`", why:"`(log 5000)/(log 5)` is `log_5 5000` by change of base, about 5.29. Subtracting logs divides the numbers <strong>inside</strong>: `log(5000/5)`." }],
          hints:["Which law turns a difference of logs into one log?", "`log x - log y = log(x/y)`.", "`log(5000/5) = log 1000 = 3`."] },
        { id:"w6", skill:"Laws of logarithms", goal:4,
          prompt:"Which is closest to `log 200`?", use:"`log 2 ≈ 0.301`",
          options:[
            { t:"0.602", why:"The log of a product is the <strong>sum</strong> of the logs: `log 2 + log 100`, not `log 2 × log 100`." },
            { t:"2.301", ok:true, why:"`log 200 = log(2 × 100) = log 2 + log 100 ≈ 0.301 + 2` = 2.301." },
            { t:"3.301", why:"100 = `10^2`, so `log 100 = 2`, not 3. Check: `log 200` must be between `log 100 = 2` and `log 1000 = 3`." },
            { t:"30.1", why:"`100 log 2` would be `log(2^{100})`. 200 is 2 × 100, a product, so its log is a sum." }],
          hints:["Write 200 as 2 × 100.", "Product law: `log(2 × 100) = log 2 + log 100`.", "0.301 + 2 = 2.301."] }
      ],
      refreshers:{
        "Powers of ten":"`10^n` with a positive `n` is 1 followed by `n` zeros: `10^3` = 1000. A negative exponent means “one over”: `10^{-4}` = 1/10 000 = 0.0001 (the 1 is in the fourth decimal place). To compare two powers of 10, divide them by subtracting the exponents: `10^{-2} ÷ 10^{-5} = 10^3`, so `10^{-2}` is 1000 times as large as `10^{-5}`.",
        "Common logarithms":"`log x` (base 10) is the power of 10 that gives `x`: `log 1000 = 3`, `log 1 = 0`, `log 0.001 = -3`. Logs of numbers between 0 and 1 are negative; logs of 0 and of negative numbers don’t exist. A decimal exponent is still a power: `10^{2.5} = 10^2 × 10^{0.5} = 100√10 ≈ 316`.",
        "Laws of logarithms":"Product law: `log(xy) = log x + log y`, so `log 200 = log 2 + log 100 ≈ 2.301`. Quotient law: `log(x/y) = log x - log y`, so `log 5000 - log 5 = log 1000 = 3`. Power law: `log(x^n) = n log x`, so `log(10^k) = k`."
      }
    }
  },
  explore:{
    heading:"The scale switcher",
    intro:"Pick a scale. Switch the ruler between linear and logarithmic and watch the everyday examples move. Then compare any two values: the switcher turns the difference on the scale into how many times as much.",
    predictions:[
      { id:"p1", prompt:"The ruler is about to switch to a <strong>linear</strong> ruler of amplitude, from 0 to `10^9 A_0` (the amplitude of a magnitude 9 quake). Where will the magnitude 6 dot end up?",
        options:[{ t:"Within the first 1% of the ruler, almost on top of 0", ok:true }, { t:"About 1/30 of the way along" }, { t:"About 10% of the way along" }, { t:"About two-thirds of the way along" }],
        explain:"`10^6 ÷ 10^9` = 1/1000, so the magnitude 6 quake sits 0.1% of the way along. Two-thirds (6 out of 9) would be right only if the scale were linear. 10% is where magnitude <strong>8</strong> lands (`10^8 ÷ 10^9`); magnitude 6 is two more steps down. And 1/30 would mean three steps are “divide by 30”, but three steps down are 10 × 10 × 10 = 1000 times smaller." },
      { id:"p2", prompt:"Lemon juice is about pH 2 and black coffee about pH 5. How do their hydrogen ion concentrations compare?",
        options:[{ t:"Lemon juice has 1000 times the [H⁺] of coffee", ok:true }, { t:"Coffee has 1000 times the [H⁺] of lemon juice" }, { t:"Lemon juice has 30 times the [H⁺] of coffee" }, { t:"Coffee has 2.5 times the [H⁺] of lemon juice" }],
        explain:"The pH values differ by 3, so the concentrations differ by `10^3` = 1000. Because " + PH + ", the <strong>lower</strong> pH has more hydrogen ions: lemon juice, the more acidic liquid. 30 would be 10 × 3, and 2.5 is 5 ÷ 2, which treats the pH numbers as if they were the concentrations." },
      { id:"p3", prompt:"One machine makes 80 dB at your ear. An identical second machine is switched on beside it, so the sound intensity doubles. What will the sound level be?",
        options:[{ t:"About 80.3 dB" }, { t:"About 83 dB", ok:true }, { t:"90 dB" }, { t:"160 dB" }],
        explain:"Intensities add, so two machines make twice the intensity. The level goes up by `10 log 2 ≈ 10 × 0.301 ≈ 3` dB, to about 83 dB. Adding the levels (160 dB) treats decibels like intensities. 90 dB would need 10 machines. 80.3 dB forgets the 10 in " + L_ + "." },
      { id:"p4", prompt:"`Q` is about to slide below 0 dB, to −10 dB. What does a level of −10 dB mean?",
        options:[{ t:"An intensity of `10^{-13}` W/m², one-tenth of `I_0`", ok:true }, { t:"An intensity of `10^{-11}` W/m², ten times `I_0`" }, { t:"No sound at all: an intensity of 0" }, { t:"A negative intensity, less than no sound at all" }],
        explain:"0 dB is the reference intensity `I_0 = 10^{-12}` W/m², a very faint sound, not silence. −10 dB is one step of ×10 <strong>below</strong> it: `10 log(I/I_0) = -10` gives `I/I_0 = 10^{-1}`, so `I = 10^{-13}` W/m². Intensity is never negative, and silence (`I = 0`) has no decibel level at all, because `log 0` doesn’t exist. Earthquakes work the same way: the Earthquakes ruler goes down to magnitude −1.0, an amplitude of `0.1A_0`." }
    ],
    chalIntro:"Set the switcher, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], prompt:"Compare mode, Earthquakes. Set `P` to magnitude 4.0. Then set `Q` so that `Q`’s amplitude is 1000 times `P`’s.",
        why:"1000 = `10^3`, so `Q` is 3 steps above `P`: 4.0 + 3 = 7.0.",
        hints:["Each step of 1 in magnitude multiplies the amplitude by 10. How many tens make 1000?", "1000 = `10^3`, so `Q` must be 3 steps above `P`.", "4.0 + 3 = 7.0."] },
      { id:"tc2", goal:[3, 4], prompt:"Compare mode, Sound. Set `P` to 40 dB. Then set `Q` so that `Q`’s intensity is about <strong>twice</strong> `P`’s (the Ratio row should read about 2). Work out the level first, then set it." + UV("`log 2 ≈ 0.301`"),
        why:"Doubling adds `10 log 2 ≈ 3` dB: 43 dB is `10^{0.3} ≈ 2.00` times as intense as 40 dB.",
        hints:["On the decibel scale, a ratio `r` changes the level by `10 log r`.", "`log 2 ≈ 0.301`, so ×2 adds 10 × 0.301 ≈ 3 dB.", "40 + 3 = 43 dB."] },
      { id:"tc3", goal:[3, 4], stretch:true, prompt:"Commit first. Compare mode, pH. A solution has 500 times the [H⁺] of pure water. Set `P` to pure water (pH 7.0) and `Q` to the solution. While this challenge is open, the `Q` row, the Ratio rows, the hops and the bars are hidden; they appear when you check." + UV("`log 5 ≈ 0.699`"),
        why:"7 − log 500 = 7 − 2.699 = 4.301. At pH 4.3 the ratio is `10^{2.7} ≈ 501`, the closest position to 500.",
        hints:["500 = 5 × 100. What is `log 500`?", "`log 500 = log 5 + log 100 ≈ 0.699 + 2` = 2.699. More hydrogen ions means a lower pH.", "7 − 2.699 = 4.301, so set `Q` to 4.3."] }
    ],
    blocks:[{ title:"What the switcher shows", html:"<p><strong>Comparing on a logarithmic scale</strong></p><ul>" +
      "<li><strong>pH and the Richter scale:</strong> each step of 1 is ×10, so ratio = <span class=\"m\">10<sup>difference</sup></span>.</li>" +
      "<li><strong>Decibels:</strong> each step of 10 dB is ×10, so ratio = <span class=\"m\">10<sup>difference ÷ 10</sup></span>.</li>" +
      "<li><strong>Steps multiply:</strong> 3 steps is 10 × 10 × 10 = 1000, not 30. Half a step is ×`√10 ≈ 3.16`, not ×5.</li>" +
      "<li><strong>pH runs backwards:</strong> the lower pH has the bigger [H⁺].</li>" +
      "<li><strong>0 is the reference,</strong> not “nothing”: 0 dB means `I = I_0`.</li></ul>" }]
  },
  part3:{
    slug:"ratios", name:"Ratios",
    heading:"Same ratio, same rise",
    intro:"Put two points on the graph of `y = log x`, one `r` times as far along as the other. Slide the pair and watch the rise. Then see why every log scale compares by ratios.",
    trailNote:"The run grew 100 times. The rise didn’t change: it depends only on the ratio.",
    puzzles:[
      { id:"r1", goal:[3, 4], prompt:"Make a pair whose rise is exactly 1.",
        hints:["The rise is `log r`. Which ratio has a log of exactly 1?", "`log 10 = 1`.", "Choose ×10. Any position of `U` works."] },
      { id:"r2", goal:[3, 4], prompt:"Make a pair whose rise is about 0.477 and whose run is exactly 60.",
        hints:["Which ratio gives a rise of `log 3 ≈ 0.477`?", "×3. Then the run is `3u - u = 2u`.", "`2u = 60`, so `u = 30`."] },
      { id:"r3", goal:[3, 4], prompt:"The pair from `x = 50` to `x = 250` has a certain rise. Make a pair that starts at `U = (4, log 4)` with the same rise.",
        hints:["The rise depends only on the ratio.", "250 ÷ 50 = 5.", "Choose ×5 with `U` at 4: `V = (20, log 20)`. Both pairs rise by `log 5 ≈ 0.699`."] }
    ],
    blocks:[{ title:"", html:"<details class=\"alg ls-alg\"><summary>Check it with algebra</summary><p style=\"margin:10px 0 6px\"><strong>Why a difference on the scale is a ratio in the world</strong></p><ul>" +
      "<li><strong>Earthquakes:</strong> `M_2 - M_1 = log(A_2/A_0) - log(A_1/A_0)` `= (log A_2 - log A_0) - (log A_1 - log A_0)` `= log A_2 - log A_1 = log(A_2/A_1)`. So `A_2/A_1 = 10^{M_2 - M_1}`.</li>" +
      "<li><strong>Sound:</strong> `L_2 - L_1 = 10 log(I_2/I_0) - 10 log(I_1/I_0)` `= 10 log(I_2/I_1)`. So `I_2/I_1 = 10^{(L_2 - L_1) ÷ 10}`.</li>" +
      "<li><strong>Acidity:</strong> <span class=\"m\">pH<sub>2</sub> − pH<sub>1</sub> = −log[H⁺]<sub>2</sub> + log[H⁺]<sub>1</sub></span> <span class=\"m\">= log([H⁺]<sub>1</sub>/[H⁺]<sub>2</sub>)</span>. So <span class=\"m\">[H⁺]<sub>1</sub>/[H⁺]<sub>2</sub> = 10<sup>pH<sub>2</sub> − pH<sub>1</sub></sup></span>: the solution with the lower pH has the larger concentration.</li>" +
      "<li><strong>The reference cancels.</strong> `A_0` and `I_0` disappear, which is why you can compare two earthquakes without knowing `A_0`.</li>" +
      "<li><strong>Working backwards:</strong> a ratio `r` changes the scale by `log r` (magnitude, pH) or `10 log r` (decibels). Doubling: `log 2 ≈ 0.301`, or `10 log 2 ≈ 3.01` dB.</li></ul></details>" }],
    quickCheck:{
      title:"Quick check: “Same ratio, same rise”", summary:"Same ratio, same rise quick check",
      items:[
        { id:"q1", goal:3, prompt:"On the graph of `y = log x`, `U` is at `x = 20` and `V` is at `x = 60`. What is the rise from `U` to `V`?" + UV("`log 3 ≈ 0.477`"),
          choices:[{ t:"About 0.477", ok:true, fb:"Right. 60 ÷ 20 = 3, so the rise is `log 60 - log 20 = log 3 ≈ 0.477`." }, { t:"About 1.602", fb:"That’s `log 40`, the log of the run. The rise is the log of the <strong>ratio</strong>: `log 3`." }, { t:"3", fb:"3 is the ratio. The rise is its log." }, { t:"40", fb:"40 is the run, across. The rise is up: `log 3`." }] },
        { id:"q2", goal:4, prompt:"Two sounds’ intensities differ by a factor of 100. How far apart are their levels?",
          choices:[{ t:"2 dB", fb:"`log 100 = 2`, but decibels multiply the log by 10." }, { t:"10 dB", fb:"10 dB is a factor of 10. A factor of 100 is two steps." }, { t:"20 dB", ok:true, fb:"Right. `10 log 100` = 10 × 2 = 20 dB." }, { t:"100 dB", fb:"The level difference is 10 log(ratio), not the ratio itself." }] },
        { id:"q3", goal:3, prompt:"Solution X has 10 times the [H⁺] of solution Y. Compared with Y’s pH, X’s pH is …",
          choices:[{ t:"1 lower", ok:true, fb:"Right. " + PH + ", so 10 times the [H⁺] lowers the pH by 1." }, { t:"1 higher", fb:"More hydrogen ions means more acidic, and that’s a <strong>lower</strong> pH." }, { t:"10 lower", fb:"A factor of 10 is one step on the pH scale, not 10 steps." }, { t:"10 times as large", fb:"pH values differ by the log of the ratio; they aren’t multiplied by it." }] },
        { id:"q4", goal:4, prompt:"A pair on `y = log x` has a rise of about 0.699. `U` is at `x = 40`. Where is `V`?" + UV("`log 5 ≈ 0.699`"),
          choices:[{ t:"`x = 8`", fb:"That divides by 5. The rise is positive, so `V` is to the right: 40 × 5." }, { t:"`x ≈ 40.7`", fb:"That adds the rise to `x`. A rise of `log 5` means `V` is 5 times as far along." }, { t:"`x = 45`", fb:"That adds 5. A rise of `log 5` means multiplying by 5." }, { t:"`x = 200`", ok:true, fb:"Right. A rise of `log 5` means a ratio of 5: 40 × 5 = 200." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"times", type:"sorter", title:"How many times?", summary:"How many times?", noun:"card", goal:[3, 1], txt:true,
        instruction:"Each card names two values on the same scale. Sort it by how many times as large the bigger quantity is.",
        how:"Tap a card, then tap the box it belongs in.<span class=\"uses ls-uses\"><strong>Use these values</strong>`log 2 ≈ 0.301`</span>",
        boxes:[{ id:"b10", label:"×10" }, { id:"b100", label:"×100" }, { id:"b1000", label:"×1000" }, { id:"b2", label:"about ×2" }],
        items:[
          card("i1", "Magnitude 8.0 vs magnitude 7.0 (amplitude)", "M", 8, 7, "A difference of 1 is one step: ×10."),
          card("i2", "75 dB vs 65 dB (intensity)", "dB", 75, 65, "10 dB is one step on the decibel scale: ×10."),
          card("i3", "pH 9.0 vs pH 10.0 ([H⁺])", "pH", 10, 9, "1 pH unit is one step. pH 9.0 has 10 times the [H⁺] of pH 10.0."),
          card("i4", "Magnitude 6.5 vs magnitude 4.5", "M", 6.5, 4.5, "A difference of 2: `10^2` = 100."),
          card("i5", "90 dB vs 70 dB", "dB", 90, 70, "20 dB is two steps of 10 dB: `10^2` = 100."),
          card("i6", "pH 2.0 vs pH 4.0", "pH", 4, 2, "A difference of 2 pH units: `10^2` = 100. pH 2.0 has the larger [H⁺]."),
          card("i7", "Magnitude 7.2 vs magnitude 4.2", "M", 7.2, 4.2, "A difference of 3: `10^3` = 1000. The decimals don’t matter; only the difference does."),
          card("i8", "100 dB vs 70 dB", "dB", 100, 70, "30 dB is three steps: `10^3` = 1000."),
          card("i9", "pH 3.5 vs pH 6.5", "pH", 6.5, 3.5, "A difference of 3: `10^3` = 1000."),
          card("i10", "63 dB vs 60 dB", "dB", 63, 60, "3 dB is 0.3 of a step: `10^{0.3} ≈ 2`, because `log 2 ≈ 0.301`."),
          card("i11", "Magnitude 5.3 vs magnitude 5.0", "M", 5.3, 5, "A difference of 0.3: `10^{0.3} ≈ 2`."),
          card("i12", "pH 4.7 vs pH 5.0", "pH", 5, 4.7, "A difference of 0.3: pH 4.7 has about twice the [H⁺] of pH 5.0.", " pH 4.7 has about twice the [H⁺].")
        ] },
      { id:"fbc", type:"custom", title:"Forwards, backwards, combined", summary:"Forwards, backwards, combined", star:true, goal:[2, 3, 4, 5],
        instruction:"Find each value. Type a number, then press Check. Each question gives any values you need.",
        how:"Round as the question asks. After each check, the mini ruler shows your two values and the hops between them.",
        fallback:"Not this one. Find the difference on the scale or the ratio first, then convert, and check your answer by working it the other way.",
        items:[
          { id:"n1", goal:2, prompt:"Find the pH of a solution with [H⁺] = 0.000 01 mol/L.", answer:{ v:5, lo:5, hi:5 }, display:"pH 5", label:"pH =",
            ruler:{ sc:"ph", a:0, b:"ans", aLab:"1 mol/L" },
            wrong:[{ match:-5, fb:"That’s log[H⁺], not the pH. Look at the sign in " + PH + "." }, { match:4, fb:"Count decimal places, not zeros: which decimal place is the 1 in?" }, { match:100000, fb:"100 000 is 1/[H⁺]. The pH is a logarithm: take the log of that." }],
            why:"0.000 01 = `10^{-5}`, so pH = −(−5) = 5.",
            hints:["Write 0.000 01 as a power of 10.", "0.000 01 = `10^{-5}`, so log[H⁺] = −5.", "pH = −log[H⁺] = −(−5) = 5."] },
          { id:"n2", goal:4, prompt:"A sound is 1000 times as intense as a 45 dB sound. Find its level, in decibels.", answer:{ v:75, lo:75, hi:75 }, display:"75 dB", unit:"dB",
            ruler:{ sc:"snd", a:45, b:"ans" },
            wrong:[{ match:48, fb:"×1000 is 3 steps of ×10, and each step is 10 dB, not 1 dB." }, { match:135, fb:"That triples the level. The intensity is multiplied, but the level goes up by a fixed number of decibels: how many for ×1000?" }, { match:45000, fb:"That multiplies the level by 1000. The intensity is multiplied; the level goes up by `10 log 1000`." }],
            why:"×1000 is 3 steps of ×10, and each step is 10 dB: 45 + 30 = 75 dB.",
            hints:["How many steps of ×10 make ×1000?", "×1000 = `10^3`: 3 steps, and each step is 10 dB, so the level rises by `10 log 1000` = 30 dB.", "45 + 30 = 75 dB."] },
          { id:"n3", goal:3, prompt:"Two earthquakes have magnitudes 6.2 and 4.7. How many times the amplitude of the smaller one is the amplitude of the larger one? Give 3 significant figures.", use:"`√10 ≈ 3.16`",
            answer:{ v:31.6, lo:31.55, hi:31.65 }, display:"about 31.6 times", label:"Times as large:",
            ruler:{ sc:"eq", a:4.7, b:"logans", target:6.2 },
            wrong:[{ match:15, fb:"That’s 10 × 1.5. A difference of 1.5 means `10^{1.5}`: one whole step and a half step." }, { match:50, fb:"That uses `10^{0.5}` = 5. Half a step is `√10 ≈ 3.16`." }, { match:1.32, fb:"That divides the magnitudes. Magnitudes are exponents: subtract them." }, { match:3.16, fb:"That’s only the half step. A difference of 1.5 also includes one whole step of ×10." }],
            why:"6.2 − 4.7 = 1.5, and `10^{1.5} = 10 × 10^{0.5} ≈ 10 × 3.16` = 31.6.",
            hints:["Subtract the magnitudes.", "6.2 − 4.7 = 1.5 steps, so the ratio is `10^{1.5} = 10^1 × 10^{0.5}`.", "`10 × √10 ≈ 10 × 3.16` = 31.6."] },
          { id:"n4", goal:4, prompt:"Three identical machines each make 70 dB at your ear. Find the level when all three run together, to 1 decimal place.", use:"`log 3 ≈ 0.477`",
            answer:{ v:74.8, lo:74.75, hi:74.85 }, display:"about 74.8 dB", unit:"dB",
            ruler:{ sc:"snd", a:70, b:"ans" },
            wrong:[{ match:210, fb:"Levels don’t add; intensities do. Three machines make 3 times the intensity." }, { match:70.5, fb:"70 + `log 3` forgets the 10 in " + L_ + ": tripling the intensity raises the level by `10 log 3`, not `log 3`." }, { match:100, fb:"Three machines make 3 times the intensity, not 1000 times." }, { match:74.7, fb:"Close. Check your rounding to 1 decimal place." }],
            why:"Tripling the intensity adds `10 log 3 ≈ 4.77` dB: 70 + 4.77 ≈ 74.8 dB.",
            hints:["Intensities add. Three machines make 3 times the intensity of one.", "Tripling the intensity adds `10 log 3` decibels.", "`10 log 3 ≈ 10 × 0.477` = 4.77, so 70 + 4.77 ≈ 74.8 dB."] },
          { id:"n5", goal:4, prompt:"An earthquake’s amplitude is 20 times that of a magnitude 4.6 quake. Find its magnitude, to 1 decimal place.", use:"`log 2 ≈ 0.301`",
            answer:{ v:5.9, lo:5.9, hi:5.9 }, display:"magnitude 5.9", label:"Magnitude:",
            ruler:{ sc:"eq", a:4.6, b:"ans" },
            wrong:[{ match:24.6, fb:"That adds the ratio. The magnitude changes by the <strong>log</strong> of the ratio." }, { match:4.9, fb:"`log 2 ≈ 0.301` is the change for ×2. ×20 is ×2 and ×10." }, { match:6.6, fb:"×20 isn’t two steps: two steps would be ×100. ×20 is between ×10 and ×100, so the change is between 1 and 2." }, { match:3.3, fb:"A bigger amplitude means a bigger magnitude: add, don’t subtract." }],
            why:"×20 changes the magnitude by `log 20 = log 2 + 1 ≈ 1.301`: 4.6 + 1.301 ≈ 5.9.",
            hints:["The magnitude changes by the log of the ratio.", "`log 20 = log 2 + log 10 ≈ 0.301 + 1` = 1.301.", "4.6 + 1.301 = 5.901 ≈ 5.9."] },
          { id:"n6", goal:4, prompt:"A swimming pool should be at pH 7.5. A test shows that its [H⁺] is twice the target value. Find the pool’s pH, to 1 decimal place.", use:"`log 2 ≈ 0.301`",
            answer:{ v:7.2, lo:7.2, hi:7.2 }, display:"pH 7.2", label:"pH =",
            ruler:{ sc:"ph", a:7.5, b:"ans" },
            wrong:[{ match:7.8, fb:"More hydrogen ions means a <strong>lower</strong> pH. Check the direction." }, { match:5.5, fb:"That subtracts the ratio 2 itself. The pH changes by the <strong>log</strong> of the ratio." }, { match:3.75, fb:"That halves the pH. Doubling [H⁺] changes the pH by `log 2`; it doesn’t divide it." }],
            why:"Twice the [H⁺] lowers the pH by `log 2 ≈ 0.301`: 7.5 − 0.301 = 7.199 ≈ 7.2.",
            hints:["Twice the [H⁺] means the pool is more acidic, so its pH is lower than 7.5.", "×2 changes the pH by `log 2 ≈ 0.301`.", "7.5 − 0.301 = 7.199 ≈ 7.2."] },
          { id:"n7", goal:5, prompt:"A chainsaw makes 115 dB at the operator’s ear. Earmuffs cut the intensity to 1/200 of what it would be without them. What level reaches the ear, to the nearest decibel?", use:"`log 2 ≈ 0.301`",
            answer:{ v:92, lo:92, hi:92 }, display:"about 92 dB", unit:"dB",
            ruler:{ sc:"snd", a:115, b:"ans" },
            wrong:[{ match:112, fb:"That’s 115 − `10 log 2`: ÷2. The muffs divide by 200 = 2 × 100." }, { match:95, fb:"That’s ÷100 only. 200 = 2 × 100, so the ÷2 is still missing." }, { match:113, fb:"115 − `log 200` ≈ 112.7 forgets the 10 in the decibel formula." }, { match:1, fb:"That divides the level by 200. The muffs divide the <strong>intensity</strong>; the level drops by `10 log 200`." }],
            why:"÷200 lowers the level by `10 log 200 = 10(log 2 + 2) ≈ 23.01` dB: 115 − 23.01 ≈ 92 dB.",
            hints:["Dividing the intensity by 200 lowers the level by `10 log 200`.", "`log 200 = log 2 + log 100 ≈ 2.301`, so the level drops by about 23.01 dB.", "115 − 23.01 = 91.99 ≈ 92 dB."] },
          { id:"n8", goal:5, prompt:"A 70 dB sound and a 60 dB sound play at the same time. Find the combined level, to 1 decimal place.", use:"`log 11 ≈ 1.041`",
            answer:{ v:70.4, lo:70.4, hi:70.4 }, display:"about 70.4 dB", unit:"dB",
            ruler:{ sc:"snd", a:70, b:"ans" },
            wrong:[{ match:130, fb:"Levels don’t add; intensities do: `10^{-5} + 10^{-6}` W/m²." }, { match:65, fb:"Averaging the levels doesn’t work. Add the intensities, then take 10 log." }, { match:73, fb:"That treats the sounds as equal: two 70 dB sounds would make about 73 dB. The 60 dB sound is only 1/10 as intense." }, { match:80, fb:"To rise a full 10 dB, the second sound would need 9 times the first one’s intensity." }],
            why:"The intensities are `10^{-5}` and `10^{-6}` W/m², so the total is `1.1 × 10^{-5} = 11 × 10^{-6}` W/m². `L = 10 log(11 × 10^6) = 10(1.041 + 6) ≈ 70.4` dB. Adding a sound one-tenth as intense barely moves the level.",
            hints:["Levels don’t add. Find each sound’s intensity first.", "70 dB is `10^{-5}` W/m² and 60 dB is `10^{-6}` W/m², so the total is `11 × 10^{-6}` W/m², which is `11 × 10^6` times `I_0`.", "`L = 10 log(11 × 10^6) = 10(1.041 + 6)` = 70.41 ≈ 70.4 dB."] },
          { id:"n9", goal:5, prompt:"One machine makes 80 dB. What is the smallest number of these machines that, running together, make at least 95 dB?", use:"`√10 ≈ 3.16`",
            answer:{ v:32, lo:32, hi:32 }, display:"32 machines", label:"Machines:",
            ruler:{ sc:"snd", a:80, b:"tenlogans", target:95 },
            wrong:[{ match:31, fb:"31 machines give about 94.9 dB, just short of 95. Check which way you rounded." }, { match:15, fb:"That’s 10 × 1.5. 1.5 steps multiply the intensity by `10^{1.5}`, not by 15." }, { match:3, fb:"If each doubling added 10 dB, 15 dB would take about 2.8 machines. A doubling adds only about 3 dB." }, { match:16, fb:"16 machines give `80 + 10 log 16 ≈ 92` dB." }],
            why:"95 − 80 = 15 dB is 1.5 steps, so you need `N` × (one machine’s intensity) with `N ≥ 10^{1.5} = 10√10 ≈ 31.6`. The smallest whole number is 32 (`80 + 10 log 32 ≈ 95.05` dB).",
            hints:["From 80 dB to 95 dB is 15 dB. How many steps of ×10 is that?", "1.5 steps, so you need `N ≥ 10^{1.5} = 10 × √10 ≈ 31.6` machines.", "`N` must be a whole number at least 31.6, so `N` = 32. (31 machines give about 94.9 dB, just short.)"] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the Error", student:"Gabriel", how:"", goal:[3, 4],
        instruction:"Gabriel made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"How many times the amplitude of a magnitude 5.4 earthquake is the amplitude of a magnitude 7.4 earthquake?",
            steps:["The difference in magnitude is 7.4 − 5.4 = 2.", "On the Richter scale, each step of 1 multiplies the amplitude by 10.", "So the amplitude is 10 × 2 = 20 times as large.", "The magnitude 7.4 quake has 20 times the amplitude of the magnitude 5.4 quake."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: " + M_ + ", so +1 in `M` is ×10 in `A`.", "", "Step 4 repeats step 3’s number. The mistake is earlier."],
            fixes:[
              { t:"Two steps multiply by 10 twice: 10 × 10 = `10^2` = 100 times as large.", ok:true, why:"Each step multiplies again, so the ratio is 10 to the power of the difference." },
              { t:"The difference is 2, so the amplitude is 2 times as large.", why:"That treats the magnitudes as if they were the amplitudes. A difference of 1 is already ×10." },
              { t:"Divide the magnitudes: 7.4 ÷ 5.4 ≈ 1.4 times as large.", why:"Magnitudes are exponents. Subtract them; don’t divide them." },
              { t:"Step 3 is correct as written.", why:"10 × 2 adds two tens. Two steps of ×10 multiply: 10 × 10 = 100." }],
            hints:["What does a second step of ×10 do to the first ×10?", "Steps multiply: 2 steps is 10 × 10.", "Step 3 is wrong: `10^2` = 100, so the amplitude is 100 times as large."] },
          { id:"e2", goal:4, task:"Solution X has 50 times the [H⁺] of a solution with pH 6.0. Find the pH of solution X.", fig:UV("`log 5 ≈ 0.699`"),
            steps:["The pH 6.0 solution has [H⁺] = `10^{-6}` mol/L.", "Multiplying [H⁺] by 10 changes the pH by 1.", "50 = 5 × 10, so ×50 changes the pH by `log 50 = log 5 + 1 ≈ 1.699`.", "More hydrogen ions means a higher pH, so pH ≈ 6.0 + 1.699 ≈ 7.7.", "Solution X has a pH of about 7.7, so it’s slightly basic."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: one step of ×10 is 1 pH unit.", "Step 3 is correct: product law.", "", "Step 5 follows from step 4. The mistake is earlier."],
            fixes:[
              { t:"More hydrogen ions means a lower pH: pH ≈ 6.0 − 1.699 ≈ 4.3.", ok:true, why:PH + ", so when [H⁺] goes up, the pH goes down. X is more acidic than the pH 6.0 solution." },
              { t:"pH = 6.0 − 50 = −44.", why:"The pH changes by the log of the ratio, not by the ratio." },
              { t:"pH ≈ 6.0 + 0.699 ≈ 6.7.", why:"That uses `log 5` for ×50, and it still goes the wrong way." },
              { t:"Step 4 is correct as written.", why:"Because of the minus sign in " + PH + ", more hydrogen ions make a lower pH." }],
            hints:["Does adding hydrogen ions make a solution more acidic or less acidic?", "More acidic means a lower pH.", "Step 4 is wrong: pH ≈ 6.0 − 1.699 ≈ 4.3."] },
          { id:"e3", goal:4, task:"Two speakers each produce 95 dB at a seat. Find the level at the seat when both play.", fig:UV("`log 2 ≈ 0.301`"),
            steps:["For one speaker, `95 = 10 log(I/I_0)`, so `I = 10^{9.5} I_0`.", "With both speakers, the intensities add: the total is `2 × 10^{9.5} I_0`.", "`L = 10 log(2 × 10^{9.5})` `= 10 × log 2 × log 10^{9.5}`.", "`L ≈ 10 × 0.301 × 9.5` `≈ 28.6` dB."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct: intensities add.", "", "Step 4 does step 3’s arithmetic correctly. The mistake is earlier."],
            fixes:[
              { t:"`L = 10(log 2 + log 10^{9.5})` `≈ 10(0.301 + 9.5) ≈ 98` dB.", ok:true, why:"Product law: the log of a product is the <strong>sum</strong> of the logs. Two speakers add about 3 dB." },
              { t:"`L` = 95 + 95 = 190 dB.", why:"Levels don’t add; intensities do." },
              { t:"`L = 95 + log 2 ≈ 95.3` dB.", why:"That forgets the 10: doubling adds `10 log 2 ≈ 3` dB." },
              { t:"Step 3 is correct as written.", why:"`log(xy) = log x + log y`, not `log x × log y`. Two speakers can’t be quieter than one." }],
            hints:["Check step 3 against the product law.", "`log(2 × 10^{9.5}) = log 2 + log 10^{9.5}`.", "Step 3 is wrong: `L = 10(0.301 + 9.5)` `≈ 98` dB."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when the ruler switched from linear to logarithmic in Explore?" },
      { id:"j2", q:"In your own words, why does a difference on a log scale tell you a ratio of the real quantities? Use the words exponent and ratio." },
      { id:"j3", q:"Explain to a friend how to work out, without a calculator, how many times as intense an 85 dB sound is as a 60 dB sound. (<em>Use this value:</em> `√10 ≈ 3.16`.)" },
      { id:"j4", q:"Which still trips you up: the direction of pH, the factor of 10 in decibels, or working backwards from a ratio? What will you do about it before module 43?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A solution has [H⁺] = 0.0001 mol/L. What is its pH?", options:[
          { t:"4", ok:true, why:"0.0001 = `10^{-4}`, so pH = −log `10^{-4}` = −(−4) = 4." },
          { t:"−4", why:"`log 0.0001 = -4`, but " + PH + ". The minus sign makes it 4." },
          { t:"3", why:"0.0001 has three zeros after the point, but its 1 is in the fourth place: `10^{-4}`." },
          { t:"10 000", why:"10 000 is 1/[H⁺]. The pH is its log: `log 10 000 = 4`." }] },
        b:{ prompt:"A solution has [H⁺] = 0.000 001 mol/L. What is its pH?", options:[
          { t:"6", ok:true, why:"0.000 001 = `10^{-6}`, so pH = −log `10^{-6}` = 6." },
          { t:"−6", why:"`log 0.000 001 = -6`, but " + PH + "." },
          { t:"5", why:"Its 1 is in the sixth decimal place: `10^{-6}`." },
          { t:"1 000 000", why:"That’s 1/[H⁺]. The pH is its log: 6." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"How many times the amplitude of a magnitude 5 earthquake is the amplitude of a magnitude 7 earthquake?", options:[
          { t:"100", ok:true, why:"The difference is 2 steps, and each step is ×10: `10^2` = 100." },
          { t:"1.4", why:"That’s 7 ÷ 5. Magnitudes are exponents: subtract them, then raise 10 to the difference." },
          { t:"2", why:"2 is the difference in magnitude. Each unit of difference is a factor of 10." },
          { t:"20", why:"That’s 10 × 2. Steps multiply: 10 × 10 = 100." }] },
        b:{ prompt:"How many times the amplitude of a magnitude 5 earthquake is the amplitude of a magnitude 8 earthquake?", options:[
          { t:"1000", ok:true, why:"3 steps of ×10: `10^3` = 1000." },
          { t:"1.6", why:"That’s 8 ÷ 5. Subtract the magnitudes instead." },
          { t:"3", why:"3 is the difference. Each unit is a factor of 10." },
          { t:"30", why:"That’s 10 × 3. Steps multiply: 10 × 10 × 10." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Sound level is " + L_ + ", with `I_0 = 10^{-12}` W/m². A sound has intensity `10^{-4}` W/m². What is its level?", options:[
          { t:"80 dB", ok:true, why:"`I/I_0 = 10^{-4} ÷ 10^{-12} = 10^8`, and `10 log 10^8` = 10 × 8 = 80 dB." },
          { t:"−160 dB", why:"That uses −4 − 12 = −16 as the exponent. Dividing by `10^{-12}` subtracts a negative exponent, which adds: −4 − (−12) = 8." },
          { t:"−40 dB", why:"That’s `10 log 10^{-4}`, without dividing by `I_0` first." },
          { t:"8 dB", why:"`log 10^8 = 8` is right so far, but the decibel formula multiplies by 10." }] },
        b:{ prompt:"Sound level is " + L_ + ", with `I_0 = 10^{-12}` W/m². A sound has intensity `10^{-5}` W/m². What is its level?", options:[
          { t:"70 dB", ok:true, why:"`I/I_0 = 10^7`, and `10 log 10^7` = 70 dB." },
          { t:"−170 dB", why:"That uses −5 − 12 = −17 as the exponent. Dividing by `10^{-12}` subtracts a negative exponent, which adds: −5 − (−12) = 7." },
          { t:"−50 dB", why:"That’s `10 log 10^{-5}`, without dividing by `I_0`." },
          { t:"7 dB", why:"`log 10^7 = 7`, but the formula multiplies by 10." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Solution P has pH 3.0 and solution Q has pH 5.5. Which statement is true?", use:"`√10 ≈ 3.16`", options:[
          { t:"P’s [H⁺] is about 316 times Q’s.", ok:true, why:"The pH values differ by 2.5. The lower pH has more hydrogen ions, and `10^{2.5} = 100 × √10 ≈ 316`." },
          { t:"Q’s [H⁺] is about 316 times P’s.", why:"The size is right, but the direction isn’t. A lower pH means more hydrogen ions, so P has more." },
          { t:"P’s [H⁺] is about 25 times Q’s.", why:"That’s 10 × 2.5. A difference of 2.5 means `10^{2.5} ≈ 316`." },
          { t:"P’s [H⁺] is about 500 times Q’s.", why:"That uses `10^{0.5}` = 5. Half a step is `√10 ≈ 3.16`, so `10^{2.5} ≈ 316`." }] },
        b:{ prompt:"Solution P has pH 4.0 and solution Q has pH 7.5. Which statement is true?", use:"`√10 ≈ 3.16`", options:[
          { t:"P’s [H⁺] is about 3160 times Q’s.", ok:true, why:"A difference of 3.5: `10^{3.5} = 1000 × √10 ≈ 3160`, and the lower pH has more hydrogen ions." },
          { t:"Q’s [H⁺] is about 3160 times P’s.", why:"Right size, wrong direction: P, with the lower pH, has more hydrogen ions." },
          { t:"P’s [H⁺] is about 35 times Q’s.", why:"That’s 10 × 3.5. The ratio is `10^{3.5}`." },
          { t:"P’s [H⁺] is about 5000 times Q’s.", why:"That uses `10^{0.5}` = 5. Half a step is about 3.16." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"A lawn mower makes 90 dB. How many identical mowers, running together, would make 100 dB?", options:[
          { t:"10", ok:true, why:"100 − 90 = 10 dB is one step of ×10 in intensity. Intensities add, so you need 10 mowers." },
          { t:"2", why:"Doubling the intensity adds only `10 log 2 ≈ 3` dB, not 10 dB. Two mowers make about 93 dB." },
          { t:"8", why:"Three doublings add about 3 × 3 = 9 dB, so 8 mowers make about 99 dB: just short. 10 dB needs ×10." },
          { t:"`10^{10}`", why:"That uses the whole 10 dB as the exponent. On the decibel scale ×10 is 10 dB: the ratio is `10^{10 ÷ 10}` = 10." }] },
        b:{ prompt:"A fan makes 50 dB. How many identical fans, running together, would make 70 dB?", options:[
          { t:"100", ok:true, why:"70 − 50 = 20 dB is two steps of ×10: `10^2` = 100 fans." },
          { t:"4", why:"If each doubling added 10 dB, 4 fans would be enough. A doubling adds only about 3 dB: 4 fans make about 56 dB." },
          { t:"64", why:"Six doublings add about 6 × 3 = 18 dB, so 64 fans make about 68 dB: short. 20 dB needs ×100." },
          { t:"`10^{20}`", why:"That uses 20 dB as the exponent. The ratio is `10^{20 ÷ 10}` = 100." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"Astronomers measure star brightness with <strong>apparent magnitude</strong>. A difference of 5 magnitudes means exactly 100 times the brightness, and a <strong>smaller</strong> magnitude means a <strong>brighter</strong> star. Star P has magnitude 1 and star Q has magnitude 11. Which statement is true?", options:[
          { t:"P is 10 000 times as bright as Q.", ok:true, why:"11 − 1 = 10 magnitudes, which is two groups of 5. Each group is ×100, so 100 × 100 = 10 000. The smaller magnitude, P, is the brighter star." },
          { t:"Q is 10 000 times as bright as P.", why:"Right size, wrong direction: on this scale a smaller magnitude is brighter. Like pH, it runs backwards." },
          { t:"P is 200 times as bright as Q.", why:"Two groups of 5 multiply: 100 × 100, not 100 × 2." },
          { t:"P is `10^{10}` times as bright as Q.", why:"That treats each magnitude as ×10, like the Richter scale. On this scale 5 magnitudes make ×100." }] },
        b:{ prompt:"Astronomers measure star brightness with <strong>apparent magnitude</strong>. A difference of 5 magnitudes means exactly 100 times the brightness, and a <strong>smaller</strong> magnitude means a <strong>brighter</strong> star. Star P has magnitude 2 and star Q has magnitude 17. Which statement is true?", options:[
          { t:"P is 1 000 000 times as bright as Q.", ok:true, why:"17 − 2 = 15 magnitudes, three groups of 5: `100^3` = 1 000 000. P has the smaller magnitude, so it’s brighter." },
          { t:"Q is 1 000 000 times as bright as P.", why:"Right size, wrong direction: a smaller magnitude is brighter." },
          { t:"P is 300 times as bright as Q.", why:"Three groups of 5 multiply: 100 × 100 × 100." },
          { t:"P is `10^{15}` times as bright as Q.", why:"That treats each magnitude as ×10. Here 5 magnitudes make ×100." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why earthquakes are measured on a logarithmic scale?", options:[
          { t:"Earthquake amplitudes range from tiny to billions of times larger. Each step of 1 in magnitude multiplies the amplitude by 10, so that whole range fits on a scale of about 0 to 9.", ok:true, why:"This names the huge range, what one step means, and why it helps." },
          { t:"Earthquake amplitudes grow steadily from small quakes to large ones. Each step of 1 in magnitude adds the same amount of amplitude, so equal steps mean equal increases in shaking.", why:"That describes a linear scale. On the Richter scale each step multiplies the amplitude by 10." },
          { t:"Large earthquakes are alarming to report. Taking the logarithm makes their amplitudes smaller, so the scale turns a dangerous quake into a less powerful one with a small number.", why:"A logarithm changes the numbers we write down, not the earthquake. A magnitude 8 quake still has 1000 times the amplitude of a magnitude 5." },
          { t:"The magnitude counts how many times the amplitude has been multiplied by 10. So it must be a whole number, and no earthquake can have a magnitude between 6 and 7, such as 6.4.", why:"Magnitudes like 6.4 are common: " + M_ + " can be any real number. A magnitude 6.4 quake has an amplitude between `10^6 A_0` and `10^7 A_0`." }] },
        b:{ prompt:"Which is the best explanation of why sound levels are measured in decibels, a logarithmic scale?", options:[
          { t:"Sound intensities people hear range from `10^{-12}` W/m² to about 1 W/m², a factor of `10^{12}`. Each 10 dB multiplies the intensity by 10, so that range fits on a scale of 0 to about 120 dB.", ok:true, why:"This names the huge range, what each 10 dB means, and why it helps." },
          { t:"Sound intensities grow steadily from quiet sounds to loud ones. Each decibel adds the same amount of intensity, so a sound with twice the decibels has twice the intensity.", why:"That describes a linear scale. 20 dB more is 100 times the intensity, not twice." },
          { t:"Loud sounds are alarming to report. Taking the logarithm makes their intensities smaller, so the scale turns a dangerous sound into a less intense one with a small number.", why:"The scale changes the numbers we write down, not the sound. A 100 dB sound is just as intense whatever scale you use." },
          { t:"The level counts how many times the intensity has been multiplied by 10, in steps of 10 dB. So it must be a multiple of 10, and no sound can have a level between 60 and 70 dB, such as 63 dB.", why:"Levels like 63 dB are common: " + L_ + " can be any real number. A 63 dB sound has about twice the intensity of a 60 dB sound." }] } },
      { id:"c2", cat:"C", goal:2,
        a:{ prompt:"A solution has pH 3.2. Which statement about its hydrogen ion concentration is written correctly?", options:[
          { t:"[H⁺] = `10^{-3.2}` mol/L", ok:true, why:"From " + PH + ": log[H⁺] = −3.2, so [H⁺] = `10^{-3.2}` mol/L, about `6.3 × 10^{-4}` mol/L." },
          { t:"[H⁺] = `10^{3.2}` mol/L", why:"That drops the minus sign. `10^{3.2} ≈ 1585` mol/L would be impossibly concentrated." },
          { t:"[H⁺] = `-10^{3.2}` mol/L", why:"A concentration can’t be negative. The minus belongs in the exponent." },
          { t:"[H⁺] = `log(-3.2)` mol/L", why:"To undo a log, raise 10 to the power; don’t take another log. And `log(-3.2)` doesn’t exist." }] },
        b:{ prompt:"A solution has pH 8.4. Which statement about its hydrogen ion concentration is written correctly?", options:[
          { t:"[H⁺] = `10^{-8.4}` mol/L", ok:true, why:"From " + PH + ": log[H⁺] = −8.4, so [H⁺] = `10^{-8.4}` mol/L, about `4.0 × 10^{-9}` mol/L." },
          { t:"[H⁺] = `10^{8.4}` mol/L", why:"That drops the minus sign. `10^{8.4} ≈ 2.5 × 10^8` mol/L would be impossibly concentrated." },
          { t:"[H⁺] = `-10^{8.4}` mol/L", why:"A concentration can’t be negative. The minus belongs in the exponent." },
          { t:"[H⁺] = `log(-8.4)` mol/L", why:"To undo a log, raise 10 to the power; don’t take another log. And `log(-8.4)` doesn’t exist." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"Seismologists estimate that each step of 1 in magnitude multiplies the <strong>energy</strong> an earthquake releases by `10^{1.5}` (about 32). About how many times as much energy does a magnitude 7.0 quake release as a magnitude 5.0 quake?", options:[
          { t:"1000", ok:true, why:"Two steps multiply by `10^{1.5}` twice: `(10^{1.5})^2 = 10^3` = 1000. Check: 32 × 32 = 1024, about 1000." },
          { t:"3", why:"That’s 1.5 × 2, the exponent. The ratio is `10^3` = 1000." },
          { t:"64", why:"That’s 32 × 2. Two steps multiply by 32 twice: 32 × 32 ≈ 1000." },
          { t:"100", why:"100 is the ratio of the <strong>amplitudes</strong>. Energy grows faster: `10^{1.5}` per step." }] },
        b:{ prompt:"Seismologists estimate that each step of 1 in magnitude multiplies the <strong>energy</strong> an earthquake releases by `10^{1.5}` (about 32). About how many times as much energy does a magnitude 8.0 quake release as a magnitude 4.0 quake?", options:[
          { t:"1 000 000", ok:true, why:"Four steps: `(10^{1.5})^4 = 10^6`. Check: `32^4` = 1 048 576, about a million." },
          { t:"6", why:"That’s 1.5 × 4, the exponent. The ratio is `10^6`." },
          { t:"128", why:"That’s 32 × 4. Four steps multiply by 32 four times." },
          { t:"10 000", why:"10 000 is the ratio of the amplitudes. Energy grows by `10^{1.5}` per step." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"Normal rain has a pH of about 5.6. A sample of acid rain has 50 times the [H⁺] of normal rain. What is its pH, to 1 decimal place?", use:"`log 5 ≈ 0.699`", options:[
          { t:"3.9", ok:true, why:"×50 changes the pH by `log 50 = log 5 + log 10 ≈ 1.699`. More hydrogen ions means a lower pH: 5.6 − 1.699 ≈ 3.9." },
          { t:"−44.4", why:"That subtracts the ratio itself. The pH changes by the log of the ratio." },
          { t:"4.9", why:"That subtracts `log 5 ≈ 0.699`, the change for ×5. ×50 is ×5 and ×10: 1.699." },
          { t:"7.3", why:"That adds. More hydrogen ions means a lower pH." }] },
        b:{ prompt:"A stream had a pH of 6.5. After a spill, its [H⁺] is 20 times as large. What is its new pH, to 1 decimal place?", use:"`log 2 ≈ 0.301`", options:[
          { t:"5.2", ok:true, why:"×20 changes the pH by `log 20 = log 2 + 1 ≈ 1.301`, and more hydrogen ions means a lower pH: 6.5 − 1.301 ≈ 5.2." },
          { t:"−13.5", why:"That subtracts the ratio itself." },
          { t:"6.2", why:"That subtracts `log 2`, the change for ×2. ×20 is ×2 and ×10: 1.301." },
          { t:"7.8", why:"That adds. More hydrogen ions means a lower pH." }] } }
    ]
  },
  task:{
    title:"Loud but safe", summary:"Loud but safe",
    statement:"<p>You’re setting up the sound for a concert. The room must be loud, at least 100 dB, but the crew wears earplugs, and the level at their ears must be safe (at most 85 dB) and still clear (at least 75 dB). Choose the number of speaker stacks, the level of one stack, and the earplugs. There are many designs. Can you find a <strong>lean</strong> one, with no stack you could remove, for every stack level that works?</p>",
    checks:["More than one stack", "The room is loud: at least 100 dB", "Safe at the ear: at most 85 dB with earplugs in", "Clear at the ear: at least 75 dB"],
    bonus:"Lean (bonus): removing a stack would break line 1 or line 2",
    tips:["One stack isn’t a concert rig. Use at least 2.",
      "The room is about {T} dB. Doubling the stacks adds only about 3 dB; ten times the stacks adds 10 dB. With {S} dB stacks you need at least {need} of them.",
      "The crew hears about {E} dB, more than 85. Each earplug class cuts 10 dB (one step of ÷10 in intensity). Try stronger earplugs.",
      "The crew hears only about {E} dB, under 75. Your earplugs are stronger than they need to be: try the next lighter class."],
    tipLow:"With {S} dB stacks, even 16 of them give only about {T16} dB. Choose louder stacks.",
    tipHeavy:"Even Heavy earplugs leave {E} dB. Use fewer or quieter stacks.",
    explainPrompt:"Explain why adding one more stack raised the room level by only a few decibels, and how you chose the earplugs.",
    vocab:"Use the words intensity, ratio, decibel and logarithm.",
    success:"Your design works.",
    more:"There’s more than one answer. Can you find another?",
    leanAll:"To reach 100 dB you need <span class=\"m\">10<sup>(100 − <i>S</i>)/10</sup></span> times one stack’s intensity: exactly 10 stacks at 90 dB, about 3.16 (so 4) at 95 dB, and 1 or fewer at 100 and 105 dB, where the two-stack minimum decides. Each earplug class always removes exactly 10 dB, because ÷10 in intensity is one step on the scale."
  },
  cards:[
    ["Logarithmic scale", "A scale that records the exponent instead of the size. Equal gaps mean equal ratios: 1 magnitude, 1 pH unit or 10 dB is a factor of 10 in the quantity."],
    ["pH", PH + ", with [H⁺] in mol/L. Pure water has [H⁺] = `10^{-7}` mol/L, so pH 7. A lower pH is more acidic."],
    ["From pH back to [H⁺]", "[H⁺] = " + HP + ". For pH 3.5: [H⁺] = `10^{-3.5} ≈ 3.16 × 10^{-4}` mol/L."],
    ["Decibels", L_ + ", with `I_0 = 10^{-12}` W/m². Every 10 dB is ×10 intensity. 60 dB means `I = 10^{-6}` W/m²."],
    ["Richter magnitude", M_ + ", where `A` is the amplitude of the seismograph trace. Each step of 1 is ×10 amplitude."],
    ["Comparing two values", "Ratio = <span class=\"m\">10<sup>difference</sup></span> for pH and magnitude; <span class=\"m\">10<sup>difference ÷ 10</sup></span> for decibels. Magnitude 7 vs 4: `10^3` = 1000 times the amplitude."],
    ["pH runs backwards", "10 times the [H⁺] is 1 pH unit <strong>lower</strong>. pH 3 has 100 times the [H⁺] of pH 5."],
    ["Half a step", "`10^{0.5} = √10 ≈ 3.16`, not 5. pH 4.5 has about 3.16 times the [H⁺] of pH 5."],
    ["Working backwards", "Change on the scale = log(ratio), or 10 log(ratio) in decibels. ×2: +0.301 in magnitude, or about +3 dB. ×1000: +3, or +30 dB."],
    ["Combining identical sounds", "Intensities add, so `N` equal sounds are `10 log N` dB louder than one. Two 60 dB sounds make about 63 dB, not 120 dB."],
    ["Why the reference cancels", "`L_2 - L_1 = 10 log(I_2/I_0) - 10 log(I_1/I_0) = 10 log(I_2/I_1)`. You can compare without knowing `I_0` (or `A_0`)."],
    ["Zero and negative values", "0 is the reference: 0 dB means `I = I_0`, not silence. −10 dB means `I_0`/10. Magnitudes can be negative too."]
  ]
};
