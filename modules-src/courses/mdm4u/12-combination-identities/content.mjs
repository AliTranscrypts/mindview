// MDM4U 12 Combination Identities. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/12-combination-identities.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M2 = (a, b, n) => "Symmetry gives a second solution: " + a + " + " + b + " = " + n + ".";
const M3 = (n, what) => "Each of the " + n + " " + (what || "items") + " is in or out: `2 × 2 × … × 2 = 2^" + n + "`.";
const M5 = (n, r) => "The two entries above `C(" + n + ", " + r + ")` are `C(" + (n - 1) + ", " + (r - 1) + ")` and `C(" + (n - 1) + ", " + r + ")`.";
const M6 = "Both sides of the story must count the <strong>same</strong> set of committees.";
const M7 = "There is exactly one way to choose nobody.";

// Numbers of five or more digits get a narrow no-break space as the thousands separator (48 620).
const NS = " ";
function thin(o){
  if (typeof o === "string") { let s = o, t; do { t = s; s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1" + NS); } while (s !== t); return s; }
  if (Array.isArray(o)) return o.map(thin);
  if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = k === "id" ? o[k] : thin(o[k]); return r; }
  return o;
}

export default thin({
  id:"12-combination-identities",
  kind:"topic",
  title:"Combination identities",
  topic:"Combination Identities",
  readyTopic:"combination identities",
  hero:{
    eq:'<span class="ci-heq">`C(n, r)` = <span class="ci-ht ci-hw">`C(n - 1, r - 1)`<small>with Sam</small></span> + <span class="ci-ht ci-hwo">`C(n - 1, r)`<small>without Sam</small></span></span>',
    eqLabel:"C of n, r equals C of n minus 1, r minus 1 (with Sam) plus C of n minus 1, r (without Sam)", eqSize:"sm",
    headline:"Count it two ways",
    text:"An <strong>identity</strong> is true for every `n` and `r`. You can prove it with algebra, or with a story: count one set of committees in two different ways. <strong>Symmetry</strong>, <strong>Pascal’s identity</strong> and the <strong>row sum `2^n`</strong> all have short stories.",
    fig:{ html:'<div class="ci-h" role="img" aria-label="Six people stand in a row; Sam wears a yellow ring. The 15 committees of 2 drop into a grid, then sort into two bins: with Sam, 5 committees, and without Sam, 10 committees. The caption reads C(6, 2) = C(5, 1) + C(5, 2): 15 = 5 + 10."><svg id="ci-h-svg" viewBox="0 0 400 330" aria-hidden="true" focusable="false"></svg></div>' }
  },
  goals:[
    "I can use `C(n, r) = C(n, n - r)` to simplify and to solve for `r` or `n`.",
    "I can use Pascal’s identity `C(n, r) = C(n - 1, r - 1) + C(n - 1, r)` to combine or split combinations.",
    "I can explain why `C(n, 0) + C(n, 1) + … + C(n, n) = 2^n`.",
    "I can solve equations such as `C(18, r) = C(18, r + 2)`.",
    "I can explain an identity with a committee story (a counting proof).",
    "I can use the identities in context: subsets, and teams with or without a particular person."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Evaluating combinations", goal:1, prompt:"Evaluate `C(7, 2)`.",
          options:[
            { t:"21", ok:true, why:"(7 × 6) ÷ 2." },
            { t:"42", why:"That’s `P(7, 2)`." },
            { t:"14", why:"`C(7, 2)` counts pairs." },
            { t:"49", why:"A person can’t be paired with themselves." }],
          hints:["`C(n, 2) = n(n - 1)/2`.", "7 × 6 = 42.", "42 ÷ 2 = 21."] },
        { id:"w2", skill:"Evaluating combinations", goal:1, prompt:"Evaluate `C(7, 5)`.",
          options:[
            { t:"21", ok:true, why:"`7!/(5! 2!) = 21`, the same as `C(7, 2)`." },
            { t:"2520", why:"That’s `P(7, 5)`. Divide by `5!`." },
            { t:"35", why:"That’s `C(7, 3)`. Check the bottom number." },
            { t:"0", why:"5 is less than 7, so it’s allowed." }],
          hints:["`7!/(5! × 2!)`.", "Cancel `5!`: `(7 × 6)/2!`.", "21."] },
        { id:"w3", skill:"Factorial algebra", goal:2, prompt:"Simplify `{8!}/{3! 5!} + {8!}/{4! 4!}`.",
          options:[
            { t:"126", ok:true, why:"56 + 70 = 126, which is `C(9, 4)`." },
            { t:"56", why:"That’s only the first term, `C(8, 3) = 56`. Add the second term, `C(8, 4) = 70`." },
            { t:"`16!`", why:"You add the values, not the `8!`s." },
            { t:"140", why:"`8!/(3! 5!) = 56`." }],
          hints:["Each term is a combination.", "`C(8, 3) = 56`, `C(8, 4) = 70`.", "126."] },
        { id:"w4", skill:"Factorial algebra", goal:1, prompt:"Which equals `{n!}/{r!(n - r)!}` with `r` replaced by `n - r`?",
          options:[
            { t:"`{n!}/{(n - r)! r!}`", ok:true, why:"The two factorials just swap places." },
            { t:"`{n!}/{(n - r)! (n - r)!}`", why:"Replace `r` everywhere: `n - (n - r) = r`." },
            { t:"`{(n - r)!}/{r! n!}`", why:"The `n!` stays on top." },
            { t:"`{n!}/{r!}`", why:"Both factorials remain below." }],
          hints:["Replace `r` with `n - r`.", "`n - (n - r) = r`.", "`n!/[(n - r)! r!]`: the same value."] },
        { id:"w5", skill:"Subsets", goal:3, prompt:"How many different selections (including choosing nothing) can be made from 3 toppings?",
          options:[
            { t:"8", ok:true, why:"Each topping in or out: 2 × 2 × 2." },
            { t:"6", why:"That’s 2 × 3. " + M3(3, "toppings") },
            { t:"7", why:"Choosing nothing is one of the selections. With it: 2 × 2 × 2 = 8." },
            { t:"9", why:"That’s `3^2`. " + M3(3, "toppings") }],
          hints:["List them: none, A, B, C, AB, AC, BC, ABC.", "Each topping has 2 states.", "`2^3 = 8`."] },
        { id:"w6", skill:"Subsets", goal:3, prompt:"How many ways are there to choose nobody from a group of 5?",
          options:[
            { t:"1", ok:true, why:"`C(5, 0) = 5!/(0! 5!) = 1`." },
            { t:"0", why:"Choosing nobody is one choice." },
            { t:"5", why:"There’s only one empty group." },
            { t:"120", why:"That’s `5!`." }],
          hints:["What’s `0!`?", "`0! = 1`.", "`C(5, 0) = 1`."] }
      ],
      refreshers:{
        "Evaluating combinations":"`C(n, r) = n!/[r!(n - r)!]`. Cancel the larger factorial below: `C(9, 3) = (9 × 8 × 7)/3! = 84`.",
        "Factorial algebra":"Swapping `r` and `n - r` swaps the two factorials below the line, so the value doesn’t change.",
        "Subsets":"With `n` items, each is in or out: `2^n` selections, including “nothing”."
      }
    }
  },
  explore:{
    heading:"Identity prover",
    intro:"Pick an identity. Watch the committees get counted two ways, then check the algebra.",
    predIntro:"Make a prediction first. Then the identity prover will count the committees for you.",
    predictions:[
      { id:"p1", start:{ mode:"sym", n:6, r:2 },
        prompt:'<span class="ci-pctx">Symmetry, `n = 6`, `r = 2`.</span> How many ways are there to choose the 4 people who <strong>aren’t</strong> on the committee?',
        options:[{ t:"15", ok:true }, { t:"360" }, { t:"4" }, { t:"30" }],
        explain:"Every committee of 2 leaves out exactly one group of 4: `C(6, 4) = C(6, 2) = 15`." },
      { id:"p2", start:{ mode:"pas", n:5, r:2 },
        prompt:'<span class="ci-pctx">With or without Sam, `n = 5`, `r = 2`.</span> How many committees of 2 include Sam?',
        options:[{ t:"4", ok:true }, { t:"6" }, { t:"10" }, { t:"5" }],
        explain:"Sam is in; choose 1 more from the other 4: `C(4, 1) = 4`." },
      { id:"p3", start:{ mode:"row", n:4, r:2 },
        prompt:'<span class="ci-pctx">Row sum, `n = 4`.</span> How many committees of <strong>any</strong> size (0 to 4) can be made from 4 people?',
        options:[{ t:"16", ok:true }, { t:"8" }, { t:"15" }, { t:"24" }],
        explain:"Each person is in or out: `2^4 = 16`." },
      { id:"p4", start:{ mode:"sym", n:7, r:0 },
        prompt:'<span class="ci-pctx">`n = 7`, `r = 0`.</span> How many ways can you choose nobody from 7?',
        options:[{ t:"1", ok:true }, { t:"0" }, { t:"7" }, { t:"5040" }],
        explain:"`C(7, 0) = 7!/(0! 7!) = 1`." }
    ],
    chalIntro:"Set up the identity prover, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"Find a value of `r` other than 3 with `C(9, r) = C(9, 3)`.",
        why:"`C(9, 6) = C(9, 3) = 84`: choosing 3 to serve is the same as choosing 6 to stay out.",
        hints:["Choosing 3 to serve = choosing ___ to stay out.", "9 − 3.", "`r = 6`."] },
      { id:"tc2", goal:2, prompt:"In Pascal mode (<strong>With or without Sam</strong>), set `n` and `r` so that “with Sam” and “without Sam” are both exactly 10.",
        why:"`C(5, 2) = C(5, 3) = 10`: the two neighbouring 10s in row 5 sit above `C(6, 3) = 20`.",
        hints:["You need `C(n - 1, r - 1) = C(n - 1, r) = 10`.", "Which row has two neighbouring 10s?", "Row 5: 1 5 10 10 5 1. So `n - 1 = 5` and `r = 3`."] },
      { id:"tc3", goal:[1, 2], stretch:true,
        prompt:"`C(n, r) = 15` and `C(n, r + 1) = 20`. Set `n` and `r`, then type the value of `C(n + 1, r + 1)` <strong>without</strong> using the triangle panel (it’s hidden for this challenge). <span class=\"tiny muted\">(Type your value in the <strong>Challenge 3</strong> box above; the triangle hides while the box has a value.)</span>",
        why:"`C(7, 3) = C(6, 2) + C(6, 3) = 15 + 20 = 35`.",
        hints:["Which row has 15 next to 20?", "Row 6: 1 6 15 20 15 6 1, so `n = 6`, `r = 2`.", "`C(7, 3) = C(6, 2) + C(6, 3) = 15 + 20 = 35`."] }
    ]
  },
  part3:{
    slug:"stories", name:"Stories",
    heading:"Counting proofs",
    intro:"A <strong>counting proof</strong> tells one story that counts the same set of committees in two ways, so the two counts must be equal. Build each story from the chips: tap a blank, then choose its words. Beside each story, <strong>Check it with algebra</strong> proves the same identity with factorials.",
    stations:[
      { id:"s1", title:"Station 1: symmetry story", identity:"`C(n, r) = C(n, n - r)`",
        tpl:"Choosing {a} people {b} is the same as choosing {c} people {d}, so `C(n, r) = C(n, n - r)`.",
        slots:{
          a:{ label:"how many go", chips:[
            { t:"`r`", ok:true },
            { t:"`n - r`", fb:"Start with the committee: `r` people go on the trip." },
            { t:"`n`", fb:"Not everyone goes: `r` of the `n` people go." }] },
          b:{ label:"what they do", chips:[
            { t:"<strong>to go</strong> on the trip", ok:true },
            { t:"to sit in order", fb:"A committee has no order. Sitting in order would count permutations, not combinations." },
            { t:"with Sam", fb:"Sam belongs to Pascal’s story. This story is about who goes and who stays." }] },
          c:{ label:"how many stay", chips:[
            { t:"`n - r`", ok:true },
            { t:"`r`", fb:"Everyone who doesn’t go stays: `n - r` people." },
            { t:"`n`", fb:"Everyone who doesn’t go stays: `n - r` people." }] },
          d:{ label:"what they do", chips:[
            { t:"<strong>to stay</strong>", ok:true },
            { t:"to sit in order", fb:"A committee has no order. Sitting in order would count permutations, not combinations." },
            { t:"with Sam", fb:"Sam belongs to Pascal’s story. This story is about who goes and who stays." }] }
        },
        done:"Each group that goes leaves exactly one group behind, and each group that stays fixes who goes. The two choices pair up one to one, so the counts are equal.",
        alg:['`C(n, n - r) = {n!}/{(n - r)! (n - (n - r))!}`', '`= {n!}/{(n - r)! r!} = C(n, r)`', '<small>The two factorials below the line just swap places.</small>', '<small>Example:</small> `C(6, 4) = {6!}/{4! 2!} = 15 = C(6, 2)`'] },
      { id:"s2", title:"Station 2: Pascal’s story", identity:"`C(n, r) = C(n - 1, r - 1) + C(n - 1, r)`",
        tpl:"Count the committees of {r} from {n} people. Those <strong>with Sam</strong> choose the other {a} from {b}; those <strong>without Sam</strong> choose all {c} from {d}. Every committee is in {e} group.",
        slots:{
          r:{ label:"committee size", chips:[
            { t:"`r`", ok:true },
            { t:"`r - 1`", fb:"The committees being counted have `r` members." },
            { t:"`n`", fb:"The committees being counted have `r` members, chosen from `n` people." }] },
          n:{ label:"group size", chips:[
            { t:"`n`", ok:true },
            { t:"`n - 1`", fb:"Start with the whole group: `n` people, Sam included." },
            { t:"`r`", fb:"Start with the whole group: `n` people, Sam included." }] },
          a:{ label:"how many more with Sam", chips:[
            { t:"`r - 1`", ok:true },
            { t:"`r`", fb:"Sam already fills one seat, so only `r - 1` are left to choose." },
            { t:"`n - 1`", fb:"Sam already fills one seat, so only `r - 1` are left to choose." }] },
          b:{ label:"chosen from (with Sam)", chips:[
            { t:"`n - 1`", ok:true },
            { t:"`n`", fb:"Sam is already chosen, so choose from the other `n - 1` people." },
            { t:"`r - 1`", fb:"Sam is already chosen, so choose from the other `n - 1` people." }] },
          c:{ label:"how many without Sam", chips:[
            { t:"`r`", ok:true },
            { t:"`r - 1`", fb:"Without Sam, all `r` seats still need people." },
            { t:"`n - 1`", fb:"Without Sam, all `r` seats still need people." }] },
          d:{ label:"chosen from (without Sam)", chips:[
            { t:"`n - 1`", ok:true },
            { t:"`n`", fb:"Sam is out, so choose from the other `n - 1` people." },
            { t:"`r`", fb:"Sam is out, so choose from the other `n - 1` people." }] },
          e:{ label:"how many groups", chips:[
            { t:"exactly one", ok:true },
            { t:"at least one", fb:"If a committee could sit in both groups, adding would count it twice. Each committee is in <strong>exactly one</strong> group: that is why adding is allowed." },
            { t:"both", fb:"A committee can’t both include Sam and leave Sam out. Each committee is in <strong>exactly one</strong> group: that is why adding is allowed." }] }
        },
        done:"Every committee is in <strong>exactly one</strong> group, so adding the two counts counts each committee once: `C(n, r) = C(n - 1, r - 1) + C(n - 1, r)`.",
        alg:['`C(n - 1, r - 1) + C(n - 1, r) = {(n - 1)!}/{(r - 1)! (n - r)!} + {(n - 1)!}/{r! (n - r - 1)!}`', '<small>Common denominator `r!(n - r)!`:</small>', '`= {r(n - 1)!}/{r!(n - r)!} + {(n - r)(n - 1)!}/{r!(n - r)!}`', '`= {(r + (n - r))(n - 1)!}/{r!(n - r)!} = {n!}/{r!(n - r)!} = C(n, r)`', '<small>Example:</small> `C(5, 1) + C(5, 2) = 5 + 10 = 15 = C(6, 2)`'] },
      { id:"s3", title:"Station 3: row-sum story", identity:"`C(n, 0) + C(n, 1) + … + C(n, n) = 2^n`",
        tpl:"Each of the {a} people is either {b}, so there are {c} possible committees of all sizes. Grouping them by size gives `C(n, 0) + … + C(n, n)`.",
        slots:{
          a:{ label:"how many people", chips:[
            { t:"`n`", ok:true },
            { t:"`r`", fb:"Every one of the `n` people makes the in-or-out choice, not just `r` of them." },
            { t:"2", fb:"Every one of the `n` people makes the in-or-out choice." }] },
          b:{ label:"the choice", chips:[
            { t:"in or out", ok:true },
            { t:"first or last", fb:"A committee has no order: each person is only in or out." },
            { t:"with Sam or without Sam", fb:"That splits by Sam only. Here every person makes the same in-or-out choice." }] },
          c:{ label:"how many committees", chips:[
            { t:"`2^n`", ok:true },
            { t:"`2n`", fb:"The choices multiply, they don’t add. Each of the `n` items is in or out: `2 × 2 × … × 2 = 2^n`." },
            { t:"`n^2`", fb:"Each of the `n` items is in or out: `2 × 2 × … × 2 = 2^n`." },
            { t:"`n!`", fb:"`n!` counts line-ups, not committees." }] }
        },
        done:"Every committee of every size, including the empty one, is exactly one in-or-out pattern, so `C(n, 0) + … + C(n, n) = 2^n`.",
        alg:['<small>Each of the `n` people has 2 choices, in or out:</small>', '`2 × 2 × … × 2 = 2^n` <small>(`n` factors)</small>', '<small>Group the patterns by how many people are in: size 0, 1, …, `n`.</small>', '<small>Example:</small> `1 + 4 + 6 + 4 + 1 = 16 = 2^4`'] },
      { id:"s4", title:"Station 4: a new identity", identity:"`C(n + 1, 2) = C(n, 2) + n`",
        ask:"Show `C(n + 1, 2) = C(n, 2) + n`. Pick the story that proves it.",
        stories:[
          { t:"`n + 1` people shake hands. The newcomer shakes `n` hands; the original `n` people shake `C(n, 2)` among themselves.", ok:true,
            fb:"Every handshake either includes the newcomer (`n` of them) or doesn’t (`C(n, 2)`), never both. Both sides count the same set of handshakes." },
          { t:"`n + 1` people each shake hands with the `n` others, so there are `(n + 1) × n` handshakes: `n` for the newcomer and the rest for everyone else.",
            fb:"That story counts ordered handshakes: Ana with Ben and Ben with Ana are counted as two. " + M6.replace("committees", "handshakes") }
        ],
        done:"A newcomer shakes `n` new hands.",
        alg:['`C(n + 1, 2) = {(n + 1)n}/{2} = {n(n - 1) + 2n}/{2}`', '`= {n(n - 1)}/{2} + n = C(n, 2) + n`', '<small>Example:</small> `C(5, 2) = 10 = 6 + 4 = C(4, 2) + 4`'] }
    ],
    quickCheck:{
      title:"Quick check", summary:"Stories quick check",
      items:[
        { id:"q1", goal:1, prompt:"`C(20, 17)` equals…",
          choices:[
            { t:"`C(20, 3)`", ok:true, fb:"Right. Symmetry: 20 − 17 = 3." },
            { t:"`C(17, 3)`", fb:"Symmetry: 20 − 17 = 3." },
            { t:"`C(20, 37)`", fb:"Symmetry: 20 − 17 = 3." },
            { t:"`C(3, 20)`", fb:"Symmetry: 20 − 17 = 3." }] },
        { id:"q2", goal:2, prompt:"`C(8, 3) + C(8, 4)` equals…",
          choices:[
            { t:"`C(9, 4)`", ok:true, fb:"Right. Down one row; take the larger `r`." },
            { t:"`C(16, 7)`", fb:"Down one row; take the larger `r`." },
            { t:"`C(9, 3)`", fb:"Down one row; take the larger `r`." },
            { t:"`C(8, 7)`", fb:"Down one row; take the larger `r`." }] },
        { id:"q3", goal:3, prompt:"Sum of row 6 of the triangle?",
          choices:[
            { t:"64", ok:true, fb:"Right. `2^6 = 64`." },
            { t:"12", fb:"`2^6`." },
            { t:"36", fb:"`2^6`." },
            { t:"63", fb:"`2^6`." }] },
        { id:"q4", goal:5, prompt:"“Choose 4 of 10 to go = choose 6 to stay” proves…",
          choices:[
            { t:"Symmetry", ok:true, fb:"Right. It pairs each group with its left-out group." },
            { t:"Pascal’s identity", fb:"It pairs each group with its left-out group." },
            { t:"Row sum", fb:"It pairs each group with its left-out group." },
            { t:"Nothing", fb:"It pairs each group with its left-out group." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"partners", type:"match", title:"Equal partners", summary:"Equal partners", goal:[1, 2, 3],
        instruction:"Match each expression with its equal partner.",
        leftTitle:"Expression", rightTitle:"Equal partner",
        left:[
          { id:"l1", t:"`C(12, 9)`", goal:1, why:"Symmetry: 12 − 9 = 3." },
          { id:"l2", t:"`C(7, 2) + C(7, 3)`", goal:2, why:"Pascal’s identity moves down one row, with the larger `r`: `C(8, 3)`." },
          { id:"l3", t:"`C(10, 0) + C(10, 1) + … + C(10, 10)`", goal:3, why:"Row 10 sums to `2^10 = 1024`." },
          { id:"l4", t:"`C(n, 1)`", goal:1, why:"There are `n` ways to choose 1 person from `n`." },
          { id:"l5", t:"`C(9, 4) - C(8, 3)`", goal:2, why:"`C(9, 4) = C(8, 3) + C(8, 4)`, so the difference is `C(8, 4)`.",
            hints:["Write `C(9, 4)` with Pascal’s identity.", "`C(9, 4) = C(8, 3) + C(8, 4)`.", "So the difference is `C(8, 4)`."] },
          { id:"l6", t:"`C(15, 15)`", goal:3, why:"There’s exactly one way to choose all 15: `C(15, 15) = C(15, 0) = 1`." },
          { id:"l7", t:"`C(6, 3)`", goal:1, why:"`C(6, 3) = (6 × 5 × 4)/3! = 20`." },
          { id:"l8", t:"`C(11, 5) + C(11, 6)`", goal:2, why:"Pascal’s identity: down one row, larger `r`: `C(12, 6)`." }
        ],
        right:[
          { id:"r1", t:"`C(12, 3)`" }, { id:"r2", t:"`C(8, 3)`" }, { id:"r3", t:"1024" }, { id:"r4", t:"`n`" },
          { id:"r5", t:"`C(8, 4)`" }, { id:"r6", t:"1" }, { id:"r7", t:"20" }, { id:"r8", t:"`C(12, 6)`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l2|r8":"`C(7, 2) + C(7, 3)` moves down one row to row 8, with the larger `r`: `C(8, 3)`.",
          "l5|r1":"`C(9, 4) = C(8, 3) + C(8, 4)`, so the difference is `C(8, 4)`.",
          "l3|r7":"Row 10 sums to `2^10 = 1024`."
        },
        wrongDefault:"Use symmetry, Pascal’s identity or the row sum." },
      { id:"uses", type:"custom", title:"Use the identities", summary:"Use the identities", star:true, goal:[1, 2, 3, 4, 6],
        instruction:"Use symmetry, Pascal’s identity or the row sum. The ★ problems go beyond the usual questions; the last two are harder than the Final Check.",
        how:"Type a whole number, then press Check. If there’s no answer, type “no solution”.",
        items:[
          { id:"i1", goal:1, prompt:"Evaluate `C(25, 23)`.", answer:300, display:"300",
            why:"`C(25, 23) = C(25, 2) = (25 × 24)/2 = 300`.",
            wrong:[{ match:600, fb:"`C(25, 2) = 25 × 24 ÷ 2`." }],
            hints:["Use symmetry first: `C(25, 23) = C(25, 2)`.", "`C(25, 2) = (25 × 24)/2`.", "600 ÷ 2 = 300."] },
          { id:"i2", goal:2, prompt:"Evaluate `C(10, 4) + C(10, 5)` as a single number.", answer:462, display:"462",
            why:"Pascal’s identity: `C(10, 4) + C(10, 5) = C(11, 5) = 462`. Adding 210 + 252 separately is fine too.",
            wrong:[{ match:252, fb:"That’s only `C(10, 5)`." }],
            hints:["Pascal’s identity: down one row, larger `r`.", "`C(10, 4) + C(10, 5) = C(11, 5)`.", "`C(11, 5) = 462` (or 210 + 252 = 462)."] },
          { id:"i3", goal:4, star:true, label:"`r =`", prompt:"Solve `C(14, r) = C(14, r + 4)`.", answer:5, display:"`r = 5`",
            why:"`r` and `r + 4` can’t be equal, so they add to 14: `2r + 4 = 14`, `r = 5`. Check: `C(14, 5) = C(14, 9)`.",
            words:[{ re:"no\\s*sol|none|impossible|no\\s*answer|^no$", fb:"Symmetry gives a second solution: `r + (r + 4) = 14`." }],
            hints:["When are two entries in one row equal?", "Same `r`, or `r`’s that add to `n`.", "`2r + 4 = 14`, so `r = 5`."] },
          { id:"i4", goal:6, star:true, prompt:"How many non-empty selections can be made from 5 toppings?", answer:31, display:"31",
            why:"`2^5 = 32` selections in all, minus the plain pizza: 31.",
            wrong:[{ match:32, fb:"Non-empty excludes the plain pizza." }],
            hints:["Each topping is in or out.", "`2^5 = 32` selections, including the plain pizza.", "32 − 1 = 31."] },
          { id:"i5", goal:4, star:true, label:"`n =`", prompt:"Find `n` if `C(n, 3) = C(n, 7)`.", answer:10, display:"`n = 10`",
            why:"3 ≠ 7, so symmetry: 3 + 7 = `n`, so `n = 10`.",
            wrong:[{ match:4, fb:"Symmetry: 3 + 7 = `n`." }],
            hints:["When are two entries in one row equal?", "`a = b` or `a + b = n`.", "3 + 7 = 10."] },
          { id:"i6", goal:2, star:true, prompt:"Evaluate `C(8, 3) + 2C(8, 2) + C(8, 1)` using Pascal’s identity twice.", answer:120, display:"120",
            why:"`[C(8, 3) + C(8, 2)] + [C(8, 2) + C(8, 1)] = C(9, 3) + C(9, 2) = C(10, 3) = 120`.",
            wrong:[{ match:84, fb:"Two applications: `[C(8, 3) + C(8, 2)] + [C(8, 2) + C(8, 1)] = C(9, 3) + C(9, 2) = C(10, 3)`." }],
            hints:["Split `2C(8, 2)` into `C(8, 2) + C(8, 2)`.", "Pair them: `C(9, 3) + C(9, 2)`.", "That’s `C(10, 3) = 120`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Lorenzo", how:"", goal:[1, 2, 3],
        instruction:"Lorenzo made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:2, task:"Write `C(9, 4) + C(9, 5)` as a single combination.",
            steps:["Pascal’s identity: `C(n - 1, r - 1) + C(n - 1, r) = C(n, r)`.", "Here the parts add: `C(9 + 9, 4 + 5) = C(18, 9)`.", "So the sum is `C(18, 9)`."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"`n - 1 = 9` and `r = 5`, so the sum is `C(10, 5) = 252`.", ok:true, why:"Pascal’s identity moves <strong>down one row</strong>: `C(9, 4) + C(9, 5) = C(10, 5)`." },
              { t:"`C(9, 9) = 1`.", why:"That adds the bottom numbers." },
              { t:"`C(10, 4)`.", why:"Take the larger `r`." },
              { t:"Step 2 is correct.", why:"Check: `C(9, 4) + C(9, 5) = 126 + 126 = 252`, but `C(18, 9) = 48 620`." }],
            hints:["Where do the two entries sit in the triangle?", "Side by side in row 9.", "The entry below them: `C(10, 5)`."] },
          { id:"e2", goal:1, task:"Prove `C(8, 3) = C(8, 5)` with algebra.",
            steps:["`C(8, 5) = 8!/(5! × 3!)`.", "`C(8, 3) = 8!/(3! × 8!)`.", "These are different, so the identity fails."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. The mistake is earlier."],
            fixes:[
              { t:"`C(8, 3) = 8!/(3! × 5!)`: the same as `C(8, 5)`.", ok:true, why:"The second factorial is `(n - r)! = (8 - 3)! = 5!`, so both are `8!/(3! 5!) = 56`." },
              { t:"`C(8, 3) = 8!/3!`.", why:"Divide by `(8 - 3)!` too." },
              { t:"`C(8, 3) = 8!/5!`.", why:"Divide by `3!` too." },
              { t:"Step 2 is correct.", why:"The second factorial is `(n - r)! = 5!`, not `n!`." }],
            hints:["What’s `n - r` here?", "8 − 3 = 5.", "`8!/(3! 5!)`."] },
          { id:"e3", goal:3, task:"How many different groups (of any size, including none) can be chosen from 6 people?",
            steps:["Each person is either in the group or not: 2 choices.", "With 6 people: 2 × 6 = 12 groups.", "So 12 groups."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2."],
            fixes:[
              { t:"2 choices for each of 6 people: `2^6 = 64`.", ok:true, why:M3(6, "people") + " The choices multiply." },
              { t:"`6^2 = 36`.", why:M3(6, "people") },
              { t:"`6! = 720`.", why:"That counts line-ups." },
              { t:"Step 2 is correct.", why:"Just the groups of 3 already number `C(6, 3) = 20`." }],
            hints:["Is it 2 + 2 + … or 2 × 2 × …?", "Choices multiply.", "`2^6 = 64`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which identity surprised you most when you saw the committees sorted: symmetry, Sam’s split or the row sum?" },
      { id:"j2", q:"In your own words, why does a story that counts the same committees two ways count as a proof?" },
      { id:"j3", q:"Explain to a friend how to solve `C(14, r) = C(14, r + 4)`." },
      { id:"j4", q:"Which identity would you forget first on a test? How will you remember its story?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which is equal to `C(15, 11)`?", options:[
          { t:"`C(15, 4)`", ok:true, why:"15 − 11 = 4." },
          { t:"`C(11, 4)`", why:"The top number stays 15." },
          { t:"`C(15, 5)`", why:"15 − 11 = 4, not 5." },
          { t:"`C(26, 11)`", why:"Symmetry doesn’t add." }] },
        b:{ prompt:"Which is equal to `C(13, 9)`?", options:[
          { t:"`C(13, 4)`", ok:true, why:"13 − 9 = 4." },
          { t:"`C(9, 4)`", why:"The top number stays 13." },
          { t:"`C(13, 3)`", why:"13 − 9 = 4." },
          { t:"`C(22, 9)`", why:"Symmetry doesn’t add." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"`C(7, 3) + C(7, 4)` equals…", options:[
          { t:"`C(8, 4)`", ok:true, why:"Down one row, larger `r`." },
          { t:"`C(14, 7)`", why:"Pascal’s identity moves <strong>down one row</strong>: `C(7, 3) + C(7, 4) = C(8, 4)`." },
          { t:"`C(8, 7)`", why:"That adds the bottom numbers." },
          { t:"`C(8, 3)`", why:"Take the larger `r`, 4." }] },
        b:{ prompt:"`C(11, 5) + C(11, 6)` equals…", options:[
          { t:"`C(12, 6)`", ok:true, why:"Down one row, larger `r`." },
          { t:"`C(22, 11)`", why:"Pascal’s identity moves <strong>down one row</strong>: `C(11, 5) + C(11, 6) = C(12, 6)`." },
          { t:"`C(12, 11)`", why:"That adds the bottom numbers." },
          { t:"`C(12, 5)`", why:M5(12, 6) + " Take the larger `r`, 6." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"`C(8, 0) + C(8, 1) + … + C(8, 8)` equals…", options:[
          { t:"256", ok:true, why:"`2^8`." },
          { t:"16", why:"That’s 2 × 8. " + M3(8) },
          { t:"64", why:"That’s `8^2`. " + M3(8) },
          { t:"255", why:"`C(8, 0) = 1` is part of the sum. " + M7 }] },
        b:{ prompt:"`C(7, 0) + C(7, 1) + … + C(7, 7)` equals…", options:[
          { t:"128", ok:true, why:"`2^7`." },
          { t:"14", why:"That’s 2 × 7. " + M3(7) },
          { t:"49", why:"That’s `7^2`. " + M3(7) },
          { t:"127", why:"`C(7, 0) = 1` is part of the sum. " + M7 }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Solve `C(18, r) = C(18, r + 2)`.", options:[
          { t:"`r = 8`", ok:true, why:"`r + (r + 2) = 18`." },
          { t:"`r = 9`", why:"`C(18, 9)` and `C(18, 11)` aren’t equal; 9 + 11 = 20." },
          { t:"`r = 16`", why:"Then `r + 2 = 18` and `C(18, 18) = 1 ≠ C(18, 16)`." },
          { t:"No solution", why:M2("`r`", "`(r + 2)`", 18) }] },
        b:{ prompt:"Solve `C(16, r) = C(16, r + 4)`.", options:[
          { t:"`r = 6`", ok:true, why:"`2r + 4 = 16`." },
          { t:"`r = 8`", why:"8 + 12 = 20, not 16." },
          { t:"`r = 12`", why:"12 + 16 = 28." },
          { t:"No solution", why:M2("`r`", "`(r + 4)`", 16) }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"`C(9, 4) - C(8, 4)` equals…", options:[
          { t:"`C(8, 3)`", ok:true, why:"`C(9, 4) = C(8, 3) + C(8, 4)`." },
          { t:"`C(1, 0)`", why:"Combinations don’t subtract part by part." },
          { t:"`C(8, 4)`", why:"That’s what you subtracted." },
          { t:"`C(9, 3)`", why:"Pascal’s identity uses row 8, not row 9." }] },
        b:{ prompt:"`C(10, 6) - C(9, 6)` equals…", options:[
          { t:"`C(9, 5)`", ok:true, why:"`C(10, 6) = C(9, 5) + C(9, 6)`." },
          { t:"`C(1, 0)`", why:"Combinations don’t subtract part by part." },
          { t:"`C(9, 6)`", why:"That’s what you subtracted. " + M5(10, 6) },
          { t:"`C(10, 5)`", why:"Pascal’s identity uses row 9, not row 10. " + M5(10, 6) }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A club of 9 includes Ana. How many 4-person committees include Ana?", options:[
          { t:"56", ok:true, why:"Ana is in; choose 3 of the other 8: `C(8, 3)`." },
          { t:"126", why:"That’s all committees, `C(9, 4)`." },
          { t:"70", why:"That’s the committees <strong>without</strong> Ana, `C(8, 4)`." },
          { t:"84", why:"`C(9, 3)` chooses 3 from all 9, including Ana again." }] },
        b:{ prompt:"A club of 10 includes Ben. How many 3-person committees do <strong>not</strong> include Ben?", options:[
          { t:"84", ok:true, why:"Choose all 3 from the other 9: `C(9, 3)`." },
          { t:"36", why:"That’s the committees with Ben, `C(9, 2)`." },
          { t:"120", why:"That’s all committees, `C(10, 3)`." },
          { t:"45", why:"`C(10, 2)`." }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which is the best story proof that `C(n, r) = C(n, n - r)`?", options:[
          { t:"Choosing the `r` people who go on a trip is the same as choosing the `n - r` people who stay home; each choice fixes the other.", ok:true, why:"It counts the same set of trips two ways: by who goes and by who stays." },
          { t:"Both sides have the same factorials.", why:"That’s the algebra proof, not a story." },
          { t:"Choosing `r` people in order and then forgetting the order.", why:"That proves `C = P ÷ r!`. " + M6 },
          { t:"Every committee either includes Sam or doesn’t.", why:"That’s Pascal’s identity. " + M6 }] },
        b:{ prompt:"Which is the best story proof of Pascal’s identity?", options:[
          { t:"Pick one person, Sam. Every committee of `r` either includes Sam (choose `r - 1` more from `n - 1`) or doesn’t (choose `r` from `n - 1`), never both.", ok:true, why:"It splits the same committees into two groups that don’t overlap, and counts each group." },
          { t:"Each person is in or out, so there are `2^n` committees.", why:"That’s the row sum. " + M6 },
          { t:"Choosing `r` to go = choosing `n - r` to stay.", why:"That’s symmetry. " + M6 },
          { t:"Add the two numbers above in the triangle.", why:"That restates the identity; it doesn’t explain it." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which is the best explanation of why row `n` of Pascal’s triangle sums to `2^n`?", options:[
          { t:"Each of the `n` items is either chosen or not, so there are `2^n` selections; the row lists how many have size 0, 1, …, `n`.", ok:true, why:"It counts every selection once, then groups them by size." },
          { t:"Each row doubles because it has one more entry.", why:"Entries add, not count." },
          { t:"There are `n + 1` entries, each about 2.", why:"Each of the `n` items is in or out: `2 × 2 × … × 2 = 2^n`." },
          { t:"`2^n` is the largest entry.", why:"The middle entry is much smaller than `2^n`." }] },
        b:{ prompt:"Which is the best explanation of why `C(n, 0) = 1`?", options:[
          { t:"There’s exactly one way to choose nobody: the empty group.", ok:true, why:"`C(n, 0)` counts the ways to choose nobody, and the empty group is the only one." },
          { t:"Because `0! = 0`.", why:"`0! = 1`." },
          { t:"Because you can’t choose zero things.", why:M7 },
          { t:"Because `n ÷ n = 1`.", why:"Not a reason." }] } },
      { id:"a1", cat:"A", goal:6,
        a:{ prompt:"A pizza shop has 8 toppings. How many different pizzas are possible if any number of toppings can be chosen (a plain pizza counts)?", options:[
          { t:"256", ok:true, why:"`2^8`." },
          { t:"255", why:"The plain pizza counts here." },
          { t:"40 320", why:"`8!` counts orders of toppings." },
          { t:"16", why:M3(8, "toppings") }] },
        b:{ prompt:"A pizza shop has 6 toppings. How many different pizzas are possible (a plain pizza counts)?", options:[
          { t:"64", ok:true, why:"`2^6`." },
          { t:"63", why:"The plain pizza counts here." },
          { t:"720", why:"`6!` counts orders." },
          { t:"12", why:M3(6, "toppings") }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A coach must leave 3 of 12 players out of a game. How many different line-ups of 9 (no positions) are possible?", options:[
          { t:"220", ok:true, why:"`C(12, 9) = C(12, 3)`." },
          { t:"1320", why:"`P(12, 3)` orders the players left out." },
          { t:"36", why:"12 × 3." },
          { t:"79 833 600", why:"`P(12, 9)` orders the 9 players." }] },
        b:{ prompt:"4 of 11 students must sit out. How many different teams of 7 are possible?", options:[
          { t:"330", ok:true, why:"`C(11, 7) = C(11, 4)`." },
          { t:"7920", why:"`P(11, 4)` orders those sitting out." },
          { t:"44", why:"11 × 4." },
          { t:"1 663 200", why:"`P(11, 7)`." }] } }
    ]
  },
  task:{
    title:"Sam’s fair split", summary:"Sam’s fair split",
    statement:"<p>Choose a club size `n` and a committee size `r` so that every condition holds. Can you find all the answers?</p>" +
      '<ol class="ci-conds"><li>Exactly as many committees include Sam as leave Sam out.</li><li>There are between 10 and 1000 committees in total.</li><li>At least 6 committees include <strong>both</strong> Sam and Tia.</li></ol>',
    checks:["Sam’s split is fair", "Between 10 and 1000 committees", "At least 6 with Sam and Tia"],
    tips:["Two neighbours in row `n - 1` are equal only in the middle: `r - 1 + r = n - 1`, so `n = 2r`.",
      "`C(4, 2) = 6` is too small; `C(14, 7)` is out of range.",
      "With Sam and Tia both in, choose `r - 2` of the other `n - 2`."],
    explainPrompt:"Explain why line 1 forces `n = 2r`, using Pascal’s identity or symmetry.",
    vocab:"Use the words symmetry, Pascal’s identity, with Sam and without Sam.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Line 1 forces `n = 2r`. Then (6, 3) fails line 3 (only `C(4, 1) = 4` with both)."
  },
  cards:[
    ["Symmetry", "`C(n, r) = C(n, n - r)`."],
    ["Symmetry story", "Choosing who goes = choosing who stays."],
    ["Pascal’s identity", "`C(n, r) = C(n - 1, r - 1) + C(n - 1, r)`."],
    ["Pascal story", "Split committees into “with Sam” and “without Sam”."],
    ["Row sum", "`C(n, 0) + … + C(n, n) = 2^n`."],
    ["Row-sum story", "Each of the `n` items is in or out."],
    ["`C(n, 0)` and `C(n, n)`", "Both 1."],
    ["`C(n, a) = C(n, b)`", "`a = b` or `a + b = n`."],
    ["Non-empty selections", "`2^n - 1`."],
    ["Counting proof", "Count one set two ways; the counts must be equal."],
    ["Committees with Sam", "`C(n - 1, r - 1)`."],
    ["`C(n + 1, 2) = C(n, 2) + n`", "A newcomer shakes `n` new hands."]
  ]
});
