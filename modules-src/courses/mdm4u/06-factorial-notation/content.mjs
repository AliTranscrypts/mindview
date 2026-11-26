// MDM4U 06 Factorial Notation. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/06-factorial-notation.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M1 = "`n!` multiplies <strong>every</strong> whole number from `n` down to 1.";
const M2 = "`0! = 1`: from `1! = 1 × 0!`, and there’s exactly one way to arrange nothing.";
const M3 = "Factorials don’t divide like that. Write out the factors and cancel the shared tail.";

// Numbers of five or more digits get a narrow no-break space as the thousands separator (3 628 800).
const NS = " ";
function thin(o){
  if (typeof o === "string") { let s = o, t; do { t = s; s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1" + NS); } while (s !== t); return s; }
  if (Array.isArray(o)) return o.map(thin);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = k === "id" ? o[k] : thin(o[k]); return r; }
  return o;
}

export default thin({
  id:"06-factorial-notation",
  kind:"topic",
  title:"Factorial notation",
  topic:"Factorial Notation",
  readyTopic:"factorial notation",
  hero:{
    eq:'<span class="fac-heq">`n! = n × (n - 1) × (n - 2) × ⋯ × 2 × 1`</span>', eqLabel:"n factorial equals n times n minus 1 times n minus 2, and so on, down to 2 times 1", eqSize:"sm",
    headline:"One symbol counts every line-up",
    text:"How many ways can 4 friends line up for a photo? 4 choices for the first spot, then 3, then 2, then 1. That product is written <strong>4!</strong> (“four factorial”). <strong>Factorial notation</strong> turns a long product into one symbol, and it <strong>cancels</strong> neatly when you divide one factorial by another.",
    fig:{ html:'<div class="fac-h" role="img" aria-label="Four tiles, A, B, C and D, sit above four empty slots. The first slot glows with 4 choices and A drops in. The second slot glows with 3 choices and C drops in, then the third with 2 choices and the fourth with 1 choice. The product builds under the slots: 4 × 3 × 2 × 1 = 24 = 4!. Then the tiles shuffle through every different order while a counter ticks up to 24 line-ups.">' +
      '<div class="fac-h-pool" id="fac-h-pool" aria-hidden="true"></div><div class="fac-h-slots" id="fac-h-slots" aria-hidden="true"></div>' +
      '<p class="fac-h-prod" id="fac-h-prod" aria-hidden="true"></p><p class="fac-h-ctr" id="fac-h-ctr" aria-hidden="true"></p></div>' }
  },
  goals:[
    "I can evaluate `n!` and explain it as the number of ways to arrange `n` different objects in a line.",
    "I can explain why `0! = 1`.",
    "I can simplify factorial expressions such as `12!/10!` or `(n + 2)!/n!` by cancelling.",
    "I can write a product of consecutive whole numbers, like 9 × 8 × 7, as a ratio of factorials.",
    "I can solve simple equations that involve factorials, such as `n!/(n - 2)! = 30`."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Fundamental counting principle", goal:1, prompt:"A food truck offers 3 breads, 4 fillings and 2 sauces. How many different sandwiches use one of each?",
          options:[
            { t:"24", ok:true, why:"3 × 4 × 2 = 24." },
            { t:"9", why:"Each bread can go with each filling, so multiply." },
            { t:"12", why:"Don’t forget the 2 sauces." },
            { t:"6", why:"All three stages count." }],
          hints:["Is it one stage <em>and then</em> another?", "Multiply the number of choices at each stage.", "3 × 4 × 2 = 24."] },
        { id:"w2", skill:"Fundamental counting principle", goal:1, prompt:"In how many ways can 3 runners finish first, second and third (no ties)?",
          options:[
            { t:"6", ok:true, why:"3 × 2 × 1 = 6." },
            { t:"3", why:"Each runner could be first." },
            { t:"9", why:"Once someone is first, only 2 are left for second." },
            { t:"27", why:"A runner can’t finish twice." }],
          hints:["How many could finish first?", "Then how many are left for second?", "3 × 2 × 1 = 6."] },
        { id:"w3", skill:"Products of consecutive numbers", goal:3, prompt:"Evaluate 6 × 5 × 4.",
          options:[
            { t:"120", ok:true, why:"6 × 5 = 30, and 30 × 4 = 120." },
            { t:"15", why:"× means multiply." },
            { t:"30", why:"There are three factors." },
            { t:"720", why:"The product stops at 4." }],
          hints:["Multiply left to right.", "6 × 5 = 30.", "30 × 4 = 120."] },
        { id:"w4", skill:"Products of consecutive numbers", goal:4, prompt:"Which product equals (8 × 7 × 6 × 5 × 4 × 3 × 2 × 1) ÷ (4 × 3 × 2 × 1)?",
          options:[
            { t:"8 × 7 × 6 × 5", ok:true, why:"The 4 × 3 × 2 × 1 cancels." },
            { t:"2 × 1", why:"Cancel matching factors; don’t divide the numbers." },
            { t:"4 × 3 × 2 × 1", why:"That’s the part that cancels." },
            { t:"8 × 7 × 6 × 5 × 4", why:"4 is in the denominator, so it cancels too." }],
          hints:["Which factors appear on top and bottom?", "4 × 3 × 2 × 1 is on both.", "8 × 7 × 6 × 5."] },
        { id:"w5", skill:"Cancelling and solving", goal:3, prompt:"Simplify (9 × 8 × 7 × 6) ÷ (7 × 6).",
          options:[
            { t:"72", ok:true, why:"7 × 6 cancels, leaving 9 × 8." },
            { t:"504", why:"7 is on the bottom too." },
            { t:"1.5", why:"Cancel the matching factors 7 and 6." },
            { t:"17", why:"9 × 8, not 9 + 8." }],
          hints:["Cross out factors that appear above and below.", "7 and 6 cancel.", "9 × 8 = 72."] },
        { id:"w6", skill:"Cancelling and solving", goal:5, prompt:"Find the positive whole number `n` with `n(n - 1) = 20`.",
          options:[
            { t:"5", ok:true, why:"5 × 4 = 20." },
            { t:"4", why:"4 × 3 = 12." },
            { t:"20", why:"20 × 19 is far bigger." },
            { t:"10", why:"10 × 9 = 90." }],
          hints:["Look for two consecutive numbers that multiply to 20.", "4 × 5.", "`n = 5` (or solve `n^2 - n - 20 = 0`)."] }
      ],
      refreshers:{
        "Fundamental counting principle":"If one choice can be made in `a` ways and then another in `b` ways, together there are `a × b` ways. In a line-up the choices shrink by one each time: 4 × 3 × 2 × 1.",
        "Products of consecutive numbers":"Multiply in order; a product like 8 × 7 × 6 × 5 has exactly four factors.",
        "Cancelling and solving":"In a fraction, a factor that appears above and below cancels to 1. To solve `n(n - 1) = 20`, look for consecutive numbers whose product is 20, or factor `n^2 - n - 20 = 0` and keep the positive root."
      }
    }
  },
  explore:{
    heading:"Line-up builder",
    intro:"Arrange objects in a line and watch the count build. Then explore how fast factorials grow and why `0! = 1`.",
    predIntro:"Make a prediction first. Then the line-up builder will show you what really happens.",
    predictions:[
      { id:"p1", start:{ mode:"list", n:4 },
        prompt:"How many different line-ups of 4 friends for a photo?",
        options:[{ t:"24", ok:true }, { t:"16" }, { t:"10" }, { t:"12" }],
        explain:"4 × 3 × 2 × 1 = 24. 16 would be 4 × 4, reusing people; 10 is 4 + 3 + 2 + 1." },
      { id:"p2", start:{ mode:"growth", n:5 },
        prompt:"Adding a 6th person changes 120 line-ups into…",
        options:[{ t:"720 (×6)", ok:true }, { t:"240 (×2)" }, { t:"126 (+6)" }, { t:"600 (×5)" }],
        explain:"`6! = 6 × 5!`: the new person can go in any of 6 places in each old line-up." },
      { id:"p3", start:{ mode:"down" },
        prompt:"In Pattern down, “Divide by `n`” steps from `5! = 120` down to `1! = 1`. One more step. What is `0!`?",
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"undefined" }, { t:"`-1`" }],
        explain:"`1! = 1 × 0!`, so `0! = 1`. There’s exactly one way to arrange nothing: the empty line-up." },
      { id:"p4", start:{ mode:"growth", n:10, cmp:true },
        prompt:"Which is larger: `10!` or `10^{10}`?",
        options:[{ t:"`10^{10}`", ok:true }, { t:"`10!`" }, { t:"They’re equal" }, { t:"You can’t tell without a calculator" }],
        explain:"Every factor of `10!` except the 10 itself is less than 10, so `10! < 10^{10}`: 3 628 800 vs 10 000 000 000. Factorials do overtake powers of 10, but only from `n = 25` on." }
    ],
    chalIntro:"Set up the line-up builder, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Make the <strong>Total line-ups</strong> readout show exactly 720.",
        why:"`6! = 6 × 5 × 4 × 3 × 2 × 1 = 720`: six objects.",
        hints:["Which factorial is 720?", "`5! = 120`; multiply by the next number.", "120 × 6 = 720, so `n = 6`."] },
      { id:"tc2", goal:[1, 3], prompt:"With `n = 7` in Build mode, fill slots until “Ways to finish” reads 24.",
        why:"3 slots filled leaves 4 objects, and `4! = 24` ways to finish.",
        hints:["Ways to finish = (objects left)!.", "Which factorial is 24?", "`4! = 24`, so leave 4 slots empty: fill 3."] },
      { id:"tc3", goal:3, stretch:true, prompt:"Growth mode: find every `n` from 0 to 15 for which `n!` ends in <strong>exactly two</strong> zeros. Mark each one.",
        why:"5 and 10 give two factors of 5 (and there are always more 2s), so `10!` to `14!` end in exactly two zeros. 15 adds a third 5.",
        hints:["A zero at the end comes from a factor 10 = 2 × 5.", "There are always more 2s than 5s, so count the factors of 5: 5 and 10 give two.", "From `10!` until 15 adds a third 5, there are exactly two: `n` = 10, 11, 12, 13, 14."] }
    ]
  },
  part3:{
    slug:"algebra", name:"Algebra",
    heading:"Factorial algebra",
    intro:"Each factorial is a strip of factor tiles. Divide one factorial by another and the shared tail cancels. Tap a tile to cancel it with its partner, or press <strong>Cancel the shared tail</strong> to strike every matching pair. Visit each station, and open <strong>Check it with algebra</strong> to see the same step in symbols.",
    quickCheck:{
      title:"Quick check", summary:"Factorial algebra quick check",
      items:[
        { id:"q1", goal:3, prompt:"Simplify `{12!}/{10!}`.",
          choices:[
            { t:"132", ok:true, fb:"Right. Cancel `10!`: 12 × 11 = 132." },
            { t:"2", fb:"Cancel `10!`: 12 × 11 = 132." },
            { t:"`2!`", fb:"Cancel `10!`: 12 × 11 = 132." },
            { t:"1.2", fb:"Cancel `10!`: 12 × 11 = 132." }] },
        { id:"q2", goal:3, prompt:"Simplify `{(n + 1)!}/{n!}`.",
          choices:[
            { t:"`n + 1`", ok:true, fb:"Right. `(n + 1)! = (n + 1) × n!`, and `n!` cancels." },
            { t:"`n`", fb:"`(n + 1)! = (n + 1) × n!`, and `n!` cancels." },
            { t:"1", fb:"`(n + 1)! = (n + 1) × n!`, and `n!` cancels." },
            { t:"`(n + 1)n`", fb:"`(n + 1)! = (n + 1) × n!`, and `n!` cancels." }] },
        { id:"q3", goal:5, prompt:"Solve `{n!}/{(n - 2)!} = 56`.",
          choices:[
            { t:"8", ok:true, fb:"Right. `n(n - 1) = 56 = 8 × 7`, so `n = 8`." },
            { t:"7", fb:"`n(n - 1) = 56 = 8 × 7`, so `n = 8`." },
            { t:"56", fb:"`n(n - 1) = 56 = 8 × 7`, so `n = 8`." },
            { t:"−7", fb:"`n(n - 1) = 56 = 8 × 7`, so `n = 8`." }] },
        { id:"q4", goal:4, prompt:"Write 11 × 10 × 9 × 8 as factorials.",
          choices:[
            { t:"`{11!}/{7!}`", ok:true, fb:"Right. Dividing by `7!` leaves 11 down to 8." },
            { t:"`{11!}/{8!}`", fb:"To keep the 8, divide by `7!`." },
            { t:"`{11!}/{4!}`", fb:"To keep the 8, divide by `7!`." },
            { t:"`{8!}/{11!}`", fb:"To keep the 8, divide by `7!`." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"evaluate", type:"numeric", title:"Evaluate or simplify", summary:"Evaluate or simplify", goal:[1, 2, 3],
        instruction:"Work out each value without a calculator. Write out the factors and cancel before you multiply.",
        how:"Type a whole number, then press Check.",
        items:[
          { id:"f1", goal:1, prompt:"`5!`", answer:120, why:"5 × 4 × 3 × 2 × 1 = 120.",
            wrong:[{ match:15, fb:"That’s 5 + 4 + 3 + 2 + 1." }, { match:20, fb:"Keep multiplying down to 1." }],
            hints:["`5!` multiplies every whole number from 5 down to 1.", "5 × 4 = 20, and 20 × 3 = 60.", "60 × 2 × 1 = 120."] },
          { id:"f2", goal:2, prompt:"`0! + 1!`", answer:2, why:"`0! = 1` and `1! = 1`, so 1 + 1 = 2.",
            wrong:[{ match:1, fb:"`0!` is 1, not 0." }],
            hints:["What is `0!`?", "`0! = 1` and `1! = 1`.", "1 + 1 = 2."] },
          { id:"f3", goal:3, prompt:"`{7!}/{5!}`", answer:42, why:"`7! = 7 × 6 × 5!`, so `{7!}/{5!} = 7 × 6 = 42`.",
            wrong:[{ match:2, fb:"`{7!}/{5!}` isn’t `(7 - 5)!`. Cancel `5!`: 7 × 6." }],
            hints:["Write `7!` as 7 × 6 × `5!`.", "The `5!` cancels.", "7 × 6 = 42."] },
          { id:"f4", goal:3, prompt:"`{10!}/{8! × 2!}`", answer:45, why:"`{10!}/{8!} = 10 × 9 = 90`, and 90 ÷ `2!` = 90 ÷ 2 = 45.",
            wrong:[{ match:90, fb:"Don’t forget to divide by `2! = 2`." }],
            hints:["Cancel `8!` first.", "`{10!}/{8!} = 10 × 9 = 90`, and `2!` is still below.", "90 ÷ 2 = 45."] },
          { id:"f5", goal:3, prompt:"`{6! - 5!}/{4!}`", answer:25, why:"720 − 120 = 600, and 600 ÷ 24 = 25.",
            general:"720 − 120 = 600, and 600 ÷ 24 = 25.",
            hints:["Work out each factorial first.", "`6! = 720`, `5! = 120`, `4! = 24`.", "600 ÷ 24 = 25."] },
          { id:"f6", goal:1, prompt:"`3! × 4!`", answer:144, why:"6 × 24 = 144.",
            wrong:[{ match:5040, fb:"`3! × 4!` isn’t `7!`: 6 × 24 = 144." }],
            hints:["Work out each factorial first.", "`3! = 6` and `4! = 24`.", "6 × 24 = 144."] },
          { id:"f7", goal:3, prompt:"`{8!}/{4! × 4!}`", answer:70, why:"`{8!}/{4!} = 8 × 7 × 6 × 5 = 1680`, and 1680 ÷ 24 = 70.",
            wrong:[{ match:1, fb:"`4! × 4! = 576`, not `8!`." }],
            hints:["Cancel one `4!` with part of `8!`.", "`{8!}/{4!} = 8 × 7 × 6 × 5 = 1680`.", "1680 ÷ 24 = 70."] },
          { id:"f8", goal:3, prompt:"`{(n + 2)!}/{n!}` when `n = 5`", answer:42, why:"`{7!}/{5!} = 7 × 6 = 42`.",
            wrong:[{ match:7, fb:"Two factors survive: 7 × 6." }],
            hints:["With `n = 5` this is `{7!}/{5!}`.", "`(n + 2)! = (n + 2)(n + 1)n!`, so two factors survive.", "7 × 6 = 42."] }
        ] },
      { id:"puzzles", type:"custom", title:"Factorial puzzles", summary:"Factorial puzzles", star:true, goal:[3, 5],
        instruction:"Cancel first, then look for consecutive numbers. The ★ puzzles go beyond the usual questions.",
        how:"Type a whole number and press Check, or tap a chip.",
        items:[
          { id:"r1", goal:5, kind:"num", prompt:"Solve `(n + 1)! = 20 × (n - 1)!`.", answer:4, label:"`n =`", display:"`n = 4`",
            why:"`(n + 1)n = 20 = 5 × 4`, so `n = 4`.",
            wrong:[{ match:20, fb:"Divide both sides by `(n - 1)!`: `(n + 1)n = 20`." }],
            hints:["`(n + 1)! = (n + 1)n(n - 1)!`.", "So `(n + 1)n = 20`.", "5 × 4 = 20: `n = 4`."] },
          { id:"r2", goal:5, kind:"num", prompt:"Solve `{n!}/{(n - 3)!} = 60`.", answer:5, label:"`n =`", display:"`n = 5`",
            why:"`n(n - 1)(n - 2) = 60 = 5 × 4 × 3`, so `n = 5`.",
            wrong:[{ match:6, fb:"`n(n - 1)(n - 2) = 60 = 5 × 4 × 3`." }],
            hints:["Cancel `(n - 3)!`: three factors survive.", "`n(n - 1)(n - 2) = 60`: look for three consecutive numbers.", "5 × 4 × 3 = 60, so `n = 5`."] },
          { id:"r3", goal:3, star:true, kind:"chips", prompt:"Which is larger: `2 × 5!` or `{6!}/{3}`?",
            why:"`2 × 5! = 2 × 120 = 240` and `{6!}/{3} = {720}/{3} = 240`.",
            choices:[{ t:"`2 × 5!`", fb:"Both are 240." }, { t:"`{6!}/{3}`", fb:"Both are 240." }, { t:"Equal", ok:true, fb:"Both are 240." }],
            hints:["Work out each one.", "`2 × 5! = 2 × 120`, and `6! = 720`.", "Both are 240: they’re equal."] },
          { id:"r4", goal:3, star:true, kind:"num", prompt:"How many zeros does `25!` end in?", answer:6, label:"Zeros at the end:", display:"6 zeros",
            why:"5, 10, 15 and 20 give one factor of 5 each and 25 gives two: 4 + 2 = 6. There are plenty of 2s to pair with them.",
            wrong:[{ match:5, fb:"25 = 5 × 5 contributes <strong>two</strong> factors of 5." }],
            hints:["Count factors of 5 in 1 × 2 × ⋯ × 25.", "5, 10, 15, 20 give one each; 25 gives two.", "4 + 2 = 6."] },
          { id:"r5", goal:3, star:true, kind:"chips", prompt:"Simplify `{n! - (n - 1)!}/{(n - 1)!}`.",
            why:"`n! = n(n - 1)!`, so the top is `(n - 1)!(n - 1)`, and `(n - 1)!` cancels.",
            choices:[{ t:"`n - 1`", ok:true, fb:"Factor out `(n - 1)!`: `{(n - 1)!(n - 1)}/{(n - 1)!}`." }, { t:"`n`", fb:"Factor out `(n - 1)!`: `{(n - 1)!(n - 1)}/{(n - 1)!}`." },
              { t:"1", fb:"Factor out `(n - 1)!`: `{(n - 1)!(n - 1)}/{(n - 1)!}`." }, { t:"`n! - 1`", fb:"Factor out `(n - 1)!`: `{(n - 1)!(n - 1)}/{(n - 1)!}`." }],
            hints:["Write `n!` as `n × (n - 1)!`.", "The top is `n(n - 1)! - (n - 1)! = (n - 1)!(n - 1)`.", "`(n - 1)!` cancels, leaving `n - 1`."] },
          { id:"r6", goal:3, star:true, kind:"num", prompt:"What is the largest `n` with `n! < 1 000 000`?", answer:9, label:"`n =`", display:"`n = 9`",
            why:"`9! = 362 880` is under a million, but `10! = 3 628 800` is over.",
            wrong:[{ match:10, fb:"`10! = 3 628 800` is over a million; `9! = 362 880`." }],
            hints:["Build up: each factorial is the one before times the next number.", "`8! = 40 320` and `9! = 362 880`.", "`10! = 3 628 800` is too big, so `n = 9`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Florence", how:"", goal:[2, 3, 5],
        instruction:"Florence made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"Simplify `{10!}/{5!}`.",
            steps:["`{10!}/{5!} = ({10}/{5})!`", "`= 2!`", "`= 2`"],
            answer:0,
            stepFb:["", "Step 2 follows step 1. The mistake is earlier.", "Step 3 follows step 2."],
            fixes:[
              { t:"`{10!}/{5!} = 10 × 9 × 8 × 7 × 6 = 30 240`, since `5!` cancels.", ok:true, why:"`10! = 10 × 9 × 8 × 7 × 6 × 5!`, and the `5!` cancels." },
              { t:"`{10!}/{5!} = 5!`.", why:"120 is far too small: `10!` is over 3 million." },
              { t:"`{10!}/{5!} = 2 × 5!`.", why:"Factorials don’t divide like ordinary numbers." },
              { t:"Step 1 is correct.", why:"Check: `{10!}/{5!}` = 3 628 800 ÷ 120 = 30 240, not 2." }],
            hints:["Write `10!` as 10 × 9 × 8 × 7 × 6 × `5!`.", "Cancel `5!`.", "10 × 9 × 8 × 7 × 6 = 30 240."] },
          { id:"e2", goal:5, task:"Solve `{n!}/{(n - 2)!} = 42`.",
            steps:["`{n!}/{(n - 2)!} = n(n - 1)`", "`n(n - 1) = 42`, so `n^2 - n - 42 = 0`", "`(n - 7)(n + 6) = 0`", "`n = 7` or `n = -6`, and both answers work."],
            answer:3,
            stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`n` must be a whole number at least 2, so `n = 7` only.", ok:true, why:"`n` counts objects, so reject −6. Check: 7 × 6 = 42." },
              { t:"`n = -6` only.", why:"−6 objects can’t be arranged." },
              { t:"`n = 42`.", why:"42 × 41 is far bigger than 42." },
              { t:"Step 4 is correct.", why:"`(-6)!` isn’t defined: factorials need whole numbers." }],
            hints:["Can `n` be negative?", "`n` counts objects.", "`n = 7`."] },
          { id:"e3", goal:2, task:"Find `0!` using the pattern of factorials.",
            steps:["`n! = n × (n - 1)!` for any whole number `n >= 1`.", "Put `n = 1`: `1! = 1 × 0!`.", "`1! = 1`, so `1 = 1 × 0!`.", "So `0! = 0`, because there is nothing to multiply."],
            answer:3,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "Step 3 is correct.", ""],
            fixes:[
              { t:"`1 = 1 × 0!` means `0! = 1`. It also fits the count: there’s exactly one way to arrange nothing.", ok:true, why:"Only 1 × 1 gives 1, so `0! = 1`." },
              { t:"`0!` is undefined.", why:"Step 3 gives a definite value." },
              { t:"`0! = -1`.", why:"1 × (−1) = −1, not 1." },
              { t:"Step 4 is correct.", why:"1 × 0 = 0, not 1." }],
            hints:["What number times 1 gives 1?", "`1 × 0! = 1`.", "`0! = 1`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you most: how fast factorials grow, `10!` vs `10^{10}`, or `0! = 1`?" },
      { id:"j2", q:"In your own words, explain why the number of line-ups of `n` people is `n!`." },
      { id:"j3", q:"Explain to a friend how to simplify `{15!}/{12!}` without a calculator." },
      { id:"j4", q:"Which factorial step still trips you up (cancelling, `0!`, or solving)? What will you do about it?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Evaluate `6!`.", options:[
          { t:"720", ok:true, why:"6 × 5 × 4 × 3 × 2 × 1 = 720." },
          { t:"21", why:"That’s 6 + 5 + 4 + 3 + 2 + 1." },
          { t:"30", why:"Keep multiplying down to 1." },
          { t:"120", why:"That’s `5!`." }] },
        b:{ prompt:"Evaluate `5!`.", options:[
          { t:"120", ok:true, why:"5 × 4 × 3 × 2 × 1 = 120." },
          { t:"15", why:"That’s a sum. " + M1 },
          { t:"20", why:"Keep multiplying down to 1." },
          { t:"24", why:"That’s `4!`." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"What is the value of `0!`?", options:[
          { t:"1", ok:true, why:"`1! = 1 × 0!`, so `0! = 1`." },
          { t:"0", why:"1 × 0 would give `1! = 0`." },
          { t:"Undefined", why:"The pattern gives a definite value." },
          { t:"10", why:"`0!` isn’t a digit pattern." }] },
        b:{ prompt:"Evaluate `4! + 0!`.", options:[
          { t:"25", ok:true, why:"24 + 1 = 25." },
          { t:"24", why:"`0! = 1`, not 0." },
          { t:"4", why:"`4! = 24`." },
          { t:"1", why:"`4! + 0!` is a sum of two factorials." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Simplify `{9!}/{7!}`.", options:[
          { t:"72", ok:true, why:"9 × 8 = 72." },
          { t:"2", why:"`{9!}/{7!}` isn’t `(9 - 7)!`." },
          { t:"9", why:"Two factors survive: 9 and 8." },
          { t:"504", why:"7 cancels too: 9 × 8, not 9 × 8 × 7." }] },
        b:{ prompt:"Simplify `{15!}/{13!}`.", options:[
          { t:"210", ok:true, why:"15 × 14 = 210." },
          { t:"2", why:"`{15!}/{13!}` isn’t `(15 - 13)!`. " + M3 },
          { t:"15", why:"Two factors survive: 15 and 14." },
          { t:"2730", why:"13 cancels too." }] } },
      { id:"t1", cat:"T", goal:5,
        a:{ prompt:"Solve `{n!}/{(n - 2)!} = 90`.", options:[
          { t:"`n = 10`", ok:true, why:"`n(n - 1) = 90 = 10 × 9`." },
          { t:"`n = 9`", why:"9 × 8 = 72." },
          { t:"`n = 10` or `n = -9`", why:"`n` counts objects, so reject −9." },
          { t:"`n = 45`", why:"45 × 44 is far bigger than 90." }] },
        b:{ prompt:"Solve `{(n + 1)!}/{(n - 1)!} = 72`.", options:[
          { t:"`n = 8`", ok:true, why:"`(n + 1)n = 72 = 9 × 8`." },
          { t:"`n = 9`", why:"That gives 10 × 9 = 90." },
          { t:"`n = 8` or `n = -9`", why:"Reject the negative root: `n` counts objects." },
          { t:"`n = 72`", why:"72 × 73 is far bigger." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Which expression equals 20 × 19 × 18 × 17?", options:[
          { t:"`{20!}/{16!}`", ok:true, why:"Dividing by `16!` leaves 20 × 19 × 18 × 17." },
          { t:"`{20!}/{17!}`", why:"That leaves only 20 × 19 × 18." },
          { t:"`{20!}/{4!}`", why:"`4! = 24` removes the wrong factors." },
          { t:"`4!`", why:"`4! = 24`, not a product of large numbers." }] },
        b:{ prompt:"Which expression equals 12 × 11 × 10 × 9 × 8?", options:[
          { t:"`{12!}/{7!}`", ok:true, why:"Dividing by `7!` leaves 12 down to 8." },
          { t:"`{12!}/{8!}`", why:"That stops at 9." },
          { t:"`{12!}/{5!}`", why:"That leaves 12 down to 6." },
          { t:"`5!`", why:"`5! = 120`." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"Simplify `{(n + 2)!}/{n!}`.", options:[
          { t:"`(n + 2)(n + 1)`", ok:true, why:"`(n + 2)! = (n + 2)(n + 1)n!`." },
          { t:"`n + 2`", why:"Two factors survive." },
          { t:"2", why:"It isn’t `(n + 2 - n)!`." },
          { t:"`(n + 2)(n + 1)n`", why:"`n` is part of `n!` and cancels." }] },
        b:{ prompt:"Simplify `{n!}/{(n - 3)!}`.", options:[
          { t:"`n(n - 1)(n - 2)`", ok:true, why:"`n! = n(n - 1)(n - 2)(n - 3)!`, and `(n - 3)!` cancels." },
          { t:"6", why:"It isn’t `3!`." },
          { t:"`n`", why:"Three factors survive: `n`, `n - 1` and `n - 2`." },
          { t:"`n(n - 1)(n - 2)(n - 3)`", why:"`(n - 3)` cancels: it is part of `(n - 3)!`." }] } },
      { id:"c1", cat:"C", goal:2,
        a:{ prompt:"Which is the best explanation of why `0! = 1`?", options:[
          { t:"Since `n! = n × (n - 1)!`, putting `n = 1` gives `1 = 1 × 0!`, so `0! = 1`. It also fits counting: there’s exactly one way to arrange no objects.", ok:true, why:"It uses both the pattern and the counting meaning." },
          { t:"Any number to the power 0 is 1, and `0!` is like `0^0`.", why:"Factorials aren’t powers." },
          { t:"`0! = 0` because there’s nothing to multiply.", why:M2 },
          { t:"`0!` is undefined, but we write 1 to avoid errors.", why:"It follows from the pattern; it isn’t a patch." }] },
        b:{ prompt:"Which is the best explanation of why `n! = n × (n - 1)!`?", options:[
          { t:"Arranging `n` objects: there are `n` choices for the first spot, and then the remaining `n - 1` objects can be arranged in `(n - 1)!` ways.", ok:true, why:"It explains the count: the first spot, then a line-up of the rest." },
          { t:"Because `n!` means `n × (n - 1)`.", why:"`n!` keeps going down to 1." },
          { t:"Because factorials add: `n! = n + (n - 1)!`.", why:M1 },
          { t:"Because you can cancel `n` from both sides.", why:"Cancelling isn’t an explanation of the count." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which work shows `{8!}/{6!}` correctly?", options:[
          { t:"`{8!}/{6!} = {8 × 7 × 6!}/{6!} = 8 × 7 = 56`", ok:true, why:"Write `8!` as 8 × 7 × `6!`, then cancel `6!`." },
          { t:"`{8!}/{6!} = ({8}/{6})! = ({4}/{3})!`", why:M3 },
          { t:"`{8!}/{6!} = 2! = 2`", why:"`{8!}/{6!}` isn’t `(8 - 6)!`. " + M3 },
          { t:"`{8!}/{6!} = 8 × 7 × 6 = 336`", why:"6 is part of `6!` and cancels too: 8 × 7." }] },
        b:{ prompt:"Which work shows `2 × 4!` correctly?", options:[
          { t:"`2 × 4! = 2 × 24 = 48`", ok:true, why:"Work out `4! = 24` first, then double it." },
          { t:"`2 × 4! = 8! = 40 320`", why:"`2 × 4! = 2 × 24 = 48`. `8! = 40 320` is far bigger." },
          { t:"`2 × 4! = 5! = 120`", why:"Multiplying by 2 doesn’t add a factor of 5." },
          { t:"`2 × 4! = (4!)^2 = 576`", why:"That multiplies by `4!` again. Multiplying by 2 only doubles `4!`: 2 × 24 = 48." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"In how many different orders can a DJ play 6 different songs?", options:[
          { t:"720", ok:true, why:"`6! = 720`." },
          { t:"36", why:"6 × 6 reuses songs." },
          { t:"21", why:"That’s a sum." },
          { t:"120", why:"That’s 5 songs." }] },
        b:{ prompt:"In how many ways can 7 different books be lined up on a shelf?", options:[
          { t:"5040", ok:true, why:"`7! = 5040`." },
          { t:"49", why:"7 × 7 reuses books." },
          { t:"28", why:"That’s 7 + 6 + 5 + 4 + 3 + 2 + 1. " + M1 },
          { t:"720", why:"That’s 6 books." }] } },
      { id:"a2", cat:"A", goal:[1, 3],
        a:{ prompt:"A photographer lines up 8 students for a photo. How many times as many line-ups are there as with only 6 students?", options:[
          { t:"56", ok:true, why:"`{8!}/{6!} = 8 × 7 = 56`." },
          { t:"2", why:"`{8!}/{6!}` isn’t `2!`." },
          { t:"8", why:"Two factors survive." },
          { t:"336", why:"6 cancels." }] },
        b:{ prompt:"A playlist of 10 songs vs a playlist of 9 songs: how many times as many orders?", options:[
          { t:"10", ok:true, why:"`{10!}/{9!} = 10`." },
          { t:"1", why:"It isn’t `(10 - 9)!`." },
          { t:"90", why:"9 cancels." },
          { t:"2", why:"`{10!}/{9!} = 10` exactly." }] } }
    ]
  },
  task:{
    title:"Factorial target", summary:"Factorial target",
    statement:"<p>Choose whole numbers `a` and `b` with `0 <= b < a <= 12` so that `{a!}/{b!}` meets every condition. Can you find all the answers?</p>" +
      '<ol class="fac-conds"><li>`{a!}/{b!}` is a product of exactly three consecutive whole numbers.</li><li>`{a!}/{b!}` is between 100 and 1000.</li><li>`{a!}/{b!}` is divisible by 10.</li></ol>',
    checks:["Three consecutive factors", "Between 100 and 1000", "Divisible by 10"],
    tips:["`{a!}/{b!}` keeps the factors from `a` down to `b + 1`. For three of them, `a - b = 3`.",
      "Try `a` from 5 up: 5 × 4 × 3 = 60 is too small; 12 × 11 × 10 = 1320 is too big.",
      "A multiple of 10 needs a factor 2 and a factor 5 among the three numbers."],
    explainPrompt:"Explain how you found every answer, and why a gap of 3 between `a` and `b` matters.",
    vocab:"Use the words factorial, cancel and consecutive.",
    more:"There’s more than one answer. Can you find them all?",
    afterAll:"8 × 7 × 6 = 336 and 9 × 8 × 7 = 504 miss line 3: no factor 5 or 10 among the three numbers."
  },
  cards:[
    ["`n!`", "`n × (n - 1) × ⋯ × 2 × 1`. Example: `5! = 120`."],
    ["What `n!` counts", "The number of ways to arrange `n` different objects in a line."],
    ["`0!`", "1. From `1! = 1 × 0!`, and there’s one way to arrange nothing."],
    ["`n! = n × (n - 1)!`", "Each factorial is `n` times the one before. Example: `6! = 6 × 120`."],
    ["`{10!}/{8!}`", "10 × 9 = 90. Cancel the shared tail `8!`."],
    ["Not a shortcut", "`{10!}/{5!} != 2!`. Write out the factors and cancel."],
    ["`2 × 4!`", "48, not `8!`."],
    ["9 × 8 × 7 as factorials", "`{9!}/{6!}`."],
    ["`{n!}/{(n - 2)!}`", "`n(n - 1)`."],
    ["Solving `n(n - 1) = 56`", "Consecutive numbers: 8 × 7, so `n = 8` (reject −7)."],
    ["Trailing zeros of `n!`", "Count the factors of 5 (25 gives two). `10!` ends in 2 zeros."]
  ]
});
