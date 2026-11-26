// MHF4U 27 Equivalent Trig Expressions. Source: /Users/ali/Desktop/MV/Modules/mhf4u/plan/modules/27-equivalent-trig-expressions.md

// ---------- Practice 1 (sorter): feedback and hints built from each item ----------
const FN = { sin:"sine", cos:"cosine" }, CO = { sin:"cos", cos:"sin" };
const BOX = { b1:["sin", 1], b2:["sin", -1], b3:["cos", 1], b4:["cos", -1] };
const BOXT = { b1:"`sin x`", b2:"`-sin x`", b3:"`cos x`", b4:"`-cos x`" };
// it: [id, item math, f, c (text), c is odd multiple of π/2?, angle text for the quadrant, quadrant, sign of f there, box, why, hint 1 verb, extra]
function rule(c, odd, f){ return odd ? "`" + c + "` is an odd multiple of π/2, so " + FN[f] + " switches to " + FN[CO[f]] : "`" + c + "` is a multiple of π, so " + FN[f] + " stays " + FN[f]; }
function sortItem(id, t, f, c, odd, ang, q, pos, box, why, verb, h2){
  const wrong = {};
  for (const b of ["b1", "b2", "b3", "b4"]) {
    if (b === box) continue;
    const fnWrong = BOX[b][0] !== BOX[box][0], sgWrong = BOX[b][1] !== BOX[box][1];
    const fnMsg = "Check the function. " + rule(c, odd, f) + ".";
    const sgMsg = "With `x` small, `" + ang + "` is in quadrant " + q + ", where " + FN[f] + " is " + (pos ? "positive" : "negative") + ".";
    wrong[b] = fnWrong && sgWrong ? fnMsg + " " + sgMsg : fnWrong ? fnMsg : "Right function, wrong sign. " + sgMsg;
  }
  const H1 = { added:"Is the angle added a multiple of π, or an odd multiple of π/2?", from:"Is the angle subtracted from a multiple of π, or from an odd multiple of π/2?", sub:"Is the angle subtracted a multiple of π, or an odd multiple of π/2?" }[verb];
  return { id, t:"`" + t + "`", answer:box, why, goal:odd ? [4, 2] : [4, 1], wrong,
    hints:[H1, h2 || (rule(c, odd, f) + ". With `x` small, `" + ang + "` is in quadrant " + q + "."), MCap(FN[f]) + " is " + (pos ? "positive" : "negative") + " in quadrant " + q + ", so `" + t + "` = " + BOXT[box] + "."] };
}
function MCap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ---------- Explore: the identity board texts ----------
export default {
  id:"27-equivalent-trig-expressions",
  kind:"topic",
  title:"Equivalent trig expressions",
  topic:"Equivalent Trig Expressions",
  readyTopic:"equivalent trig expressions",
  hero:{
    eq:"<span class=\"nw\">`sin(`<span class=\"hero-u\" id=\"hero-u\">`{π}/{2} - x`</span>`) = cos x`</span>", eqLabel:"sine of pi over 2 minus x equals cosine x", eqSize:"md",
    headline:"Sine and cosine are the same wave",
    text:"Slide the graph of `y = sin x` a quarter period to the left and it lands exactly on `y = cos x`. So expressions that look different, like `sin(x + π/2)` and `cos x`, can be <strong>equivalent</strong>: equal for every value of `x`. In this module you’ll find the <strong>related-angle identities</strong>, such as `sin(π - x) = sin x`, and the <strong>cofunction identities</strong>, such as `sin(π/2 - x) = cos x`, using graphs, the unit circle and right triangles.",
    fig:{ aria:"Animation: the graph of y = sin x slides left by pi over 2 onto the dashed graph of y = cos x, then flips in the y-axis and slides right by pi over 2 onto it again", shape:"",
      caps:["`sin(x + π/2) = cos x`", "`sin(-x) = -sin x`", "`sin(π/2 - x) = cos x`", "`sin(x + π/2) = cos x` and `sin(π/2 - x) = cos x`<br>Same wave, two names."] }
  },
  goals:[
    "I can use the unit circle to explain related-angle identities, such as `sin(π - x) = sin x` and `cos(π + x) = -cos x`.",
    "I can use a right triangle to explain the cofunction identities, such as `sin(π/2 - x) = cos x` and `sec(π/2 - x) = csc x`, and use the unit circle to show they hold for every angle.",
    "I can use slides and flips of graphs to show that two trig expressions are equivalent, such as `cos(x + π/2) = -sin x`.",
    "I can rewrite an expression such as `cos(3π/2 + x)` as `±sin x` or `±cos x` by deciding the function and the sign.",
    "I can use equivalent expressions to find values I don’t know directly, such as `cos(7π/10)` from `sin(π/5)`, and to solve problems."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"Sine and cosine graphs", goal:3,
          prompt:"On the graph of `y = sin x`, with `x` in radians, where is the first maximum to the right of `x = 0`?",
          options:[
            { t:"`x = π/2`", ok:true, why:"`sin x` is the height of the point on the unit circle, and the highest point is a quarter turn round: `sin(π/2) = 1`. (In degrees, that’s 90°.)" },
            { t:"`x = π`", why:"At `x = π` the graph crosses the `x`-axis: `sin π = 0`. The peak comes earlier, at π/2." },
            { t:"`x = 3π/2`", why:"At 3π/2, `sin x = -1`. That’s the lowest point." },
            { t:"`x = 2π`", why:"At 2π, `sin x = 0`: one period has just finished. It’s `cos x` that has a maximum at 2π." }],
          hints:["`sin x` is the `y`-coordinate of the point on the unit circle at angle `x`.", "The `y`-coordinate is largest at the top of the circle. Which angle points straight up?", "Straight up is π/2, and `sin(π/2) = 1`. So the first maximum is at `x = π/2`."] },
        { id:"w2", skill:"Unit circle", goal:1,
          prompt:"The point on the unit circle for angle θ is (0.6, 0.8). What is the point for the angle π − θ?",
          options:[
            { t:"(−0.6, 0.8)", ok:true, why:"π − θ is the mirror image of θ in the `y`-axis: same height, opposite `x`-coordinate." },
            { t:"(0.6, −0.8)", why:"That’s the mirror image in the `x`-axis, which is the angle −θ (or 2π − θ)." },
            { t:"(−0.6, −0.8)", why:"That’s a half turn, the angle π + θ: both coordinates change sign." },
            { t:"(0.8, 0.6)", why:"Swapping the coordinates is the reflection in the line `y = x`, which gives the angle π/2 − θ." }],
          hints:["θ is in quadrant 1. Which quadrant is π − θ in?", "π − θ is in quadrant 2 and has the same reference angle as θ. In quadrant 2, `x` is negative and `y` is positive.", "Same sizes, new signs: (−0.6, 0.8)."] },
        { id:"w3", skill:"Unit circle", goal:1,
          prompt:"What is the exact value of `cos(5π/6)`?",
          options:[
            { t:"`-√3/2`", ok:true, why:"5π/6 is in quadrant 2 with reference angle π/6. `cos(π/6) = √3/2`, and cosine is negative in quadrant 2." },
            { t:"`-1/2`", why:"1/2 is the cosine of π/3. The reference angle here is π/6, whose cosine is `√3/2`." },
            { t:"`1/2`", why:"1/2 is `sin(5π/6)`, the `y`-coordinate. Cosine is the `x`-coordinate." },
            { t:"`√3/2`", why:"Right size, wrong sign. 5π/6 is left of the `y`-axis, where cosine is negative." }],
          hints:["Find the quadrant and the reference angle of 5π/6.", "5π/6 is in quadrant 2, with reference angle π − 5π/6 = π/6. Cosine is negative in quadrant 2.", "`cos(π/6) = √3/2`, so `cos(5π/6) = -√3/2`."] },
        { id:"w4", skill:"Graph transformations", goal:3,
          prompt:"Compared with the graph of `y = f(x)`, the graph of `y = f(x + 2)` is …",
          options:[
            { t:"translated 2 units left", ok:true, why:"Each output now happens 2 units sooner: the value `f(0)` now appears at `x = -2`. So the graph moves left." },
            { t:"translated 2 units right", why:"Adding inside the brackets moves the graph left. Check: `y = f(x + 2)` gives `f(0)` when `x = -2`, so the point at `x = 0` has moved to `x = -2`." },
            { t:"translated 2 units up", why:"Moving up 2 is `y = f(x) + 2`, with the 2 outside. Inside the brackets, the change acts on `x`." },
            { t:"compressed horizontally by a factor of 1/2", why:"That’s `y = f(2x)`. Adding 2 to `x` translates; multiplying `x` by 2 compresses." }],
          hints:["Ask yourself: which `x`-value now gives the output `f(0)`?", "`f(x + 2) = f(0)` when `x + 2 = 0`, so at `x = -2`. The point that was at `x = 0` is now at `x = -2`.", "Every point moves 2 units left: the graph is translated 2 units left."] },
        { id:"w5", skill:"Graph transformations", goal:3,
          prompt:"How is the graph of `y = f(-x)` related to the graph of `y = f(x)`?",
          options:[
            { t:"It is reflected in the `y`-axis.", ok:true, why:"Replacing `x` with `-x` swaps left and right: the point `(2, f(2))` moves to `(-2, f(2))`." },
            { t:"It is reflected in the `x`-axis.", why:"That’s `y = -f(x)`, which changes the sign of the output. `y = f(-x)` changes the sign of the input." },
            { t:"It is reflected in the line `y = x`.", why:"Swapping `x` and `y` gives the inverse, not `y = f(-x)`." },
            { t:"It is rotated a half turn about the origin.", why:"That’s `y = -f(-x)`: both the input and the output change sign." }],
          hints:["In `f(-x)`, which changes sign: the input or the output?", "The input. A point at `x = 2` on `y = f(x)` appears at `x = -2` on `y = f(-x)`, at the same height.", "Same height, mirrored left to right: a reflection in the `y`-axis."] },
        { id:"w6", skill:"Right-triangle ratios", goal:2,
          prompt:"In right triangle `ABC`, the right angle is at `C`, `AC = 5`, `BC = 12` and `AB = 13`. What is `cos B`?",
          options:[
            { t:"`12/13`", ok:true, why:"From `B`’s corner, the adjacent side is `BC = 12` and the hypotenuse is 13, so `cos B = 12/13`. Notice that `sin A` is also 12/13." },
            { t:"`5/13`", why:"5/13 uses `AC`, the side opposite `B`. That’s `sin B`." },
            { t:"`5/12`", why:"5/12 is opposite over adjacent, which is `tan B`." },
            { t:"`13/12`", why:"13/12 is hypotenuse over adjacent, which is `sec B`, the reciprocal of `cos B`." }],
          hints:["Label the sides from `B`’s point of view: opposite, adjacent and hypotenuse.", "From `B`: the hypotenuse is `AB = 13`, the side opposite `B` is `AC = 5`, and the side adjacent to `B` is `BC = 12`.", "`cos B` = adjacent/hypotenuse = 12/13."] }
      ],
      refreshers:{
        "Sine and cosine graphs":"`sin x` is the `y`-coordinate of the unit-circle point at angle `x`, and `cos x` is its `x`-coordinate. As `x` runs from 0 to 2π, `sin x` goes 0 → 1 → 0 → −1 → 0, reaching 1 at π/2 and −1 at 3π/2. `cos x` goes 1 → 0 → −1 → 0 → 1, with maximums at 0 and 2π. Both graphs repeat every 2π.",
        "Unit circle":"The point for angle θ is (cos θ, sin θ). Mirror images give related angles: π − θ is the reflection in the `y`-axis (`x` changes sign), −θ is the reflection in the `x`-axis (`y` changes sign), and π + θ is a half turn (both change sign). If θ gives (0.6, 0.8), then π − θ gives (−0.6, 0.8). For a special angle, the reference angle gives the size and CAST gives the sign: `cos(5π/6) = -cos(π/6) = -√3/2`.",
        "Graph transformations":"Changes inside the brackets act on `x`, and they work the opposite way to how they look: `y = f(x + 2)` is `y = f(x)` translated 2 units left, and `y = f(x - 2)` is translated 2 units right. `y = f(-x)` is a reflection in the `y`-axis; `y = -f(x)` is a reflection in the `x`-axis.",
        "Right-triangle ratios":"Label the sides from the angle you’re using: opposite, adjacent and hypotenuse. sin = opp/hyp, cos = adj/hyp, tan = opp/adj, and csc, sec and cot are their reciprocals. With `AC = 5`, `BC = 12`, `AB = 13` and the right angle at `C`: `cos B = 12/13`. From `A`’s corner, `BC` is the opposite side, so `sin A = 12/13` as well. That match is the idea behind Part 3."
      }
    }
  },
  explore:{
    heading:"Slide, flip, match",
    intro:"The blue graph is yours to move. Slide it, flip it, and try to land it exactly on the dashed target. When it lands, the two expressions are equal for every `x`, and the unit circle beside the graph shows why.",
    bridge:"These graphs use radians. One full wave of `y = sin x` runs from 0 to 2π: it peaks at π/2, crosses the axis at π and dips to −1 at 3π/2. `y = cos x` peaks at 0 and at 2π.",
    ui:{
      fn:"Moving function `f`", flipA:"Flip in the `x`-axis (`@a{a} = -1`)", flipK:"Flip in the `y`-axis (`@k{k} = -1`)", slide:"Slide (`@d{d}`)", target:"Target", sample:"Sample angle", sweep:"Sweep `x`", reset:"Reset",
      views:["Graph", "Circle"], board:"Identity board", boardIntro:"Each match you make with `@a{a} = 1` fills a cell. Filling the board is optional.",
      found:"Identities found: {n} of 16", rows:["`sin(x + c)`", "`sin(c - x)`", "`cos(x + c)`", "`cos(c - x)`"], cols:["`= sin x`", "`= cos x`", "`= -sin x`", "`= -cos x`"],
      read:["Moving graph", "Angle form", "Target", "Largest gap", "Status", "On the circle", "The move", "Compare"],
      gap0:"0: the graphs are the same at every `x`", gapN:"Largest gap: {g}",
      match:"✓ Match for every `x`: {eq}", opp:"Upside-down match: {eq}. Flip it in the `x`-axis, or slide π further, to land it.", none:"No match yet.",
      aNote:"The board records matches with `a = 1`. Turn the `x`-axis flip off and find the slide that does the same job.",
      wrapNote:"{a} is the same as {b}: adding 2π changes nothing.",
      eight:"Notice: in every row, each of 0, π/2, π and 3π/2 appears exactly once. π/2 and 3π/2 always switch sine ↔ cosine. 0 and π never do; they can only change the sign.",
      circle:"`x` = {x}: `P` = {P}. The angle {ang} = {v}: `Q` = {Q}.",
      rot:"Rotation by {d} {dir}", half:"Half turn", still:"No move", refl:"Reflection in the line through the origin at angle {h}", reflNamed:"Reflection in the {line}",
      lines:{ x:"`x`-axis", y:"`y`-axis", yx:"line `y = x`", ynx:"line `y = -x`" },
      cmpQ:"{fn} is `Q`’s {c}-coordinate: {v}.", cmpQneg:"{fn} is the opposite of `Q`’s {c}-coordinate: {v}.", cmpP:"{fn} is `P`’s {c}-coordinate: {v}.", cmpPneg:"{fn} is the opposite of `P`’s {c}-coordinate: {v}.", equal:"Equal.", unequal:"Not equal at this `x`.",
      lockP:"Prediction {n} set the target.", lockC:"Challenge {n} is open, so its target is set.", unlockP:"Unlock the target", unlockC:"Close the challenge",
      tc3lock:"The slider stays locked until you press Check challenge.", tc3setup:"Turn both flips on (`a = -1` and `k = -1`) and choose `f = sin` first.", tc3empty:"Enter your slide `d` first."
    },
    predIntro:"Make a prediction first. Then the matcher will show you what really happens.",
    predictions:[
      { id:"p1", start:{ f:"sin", a:1, k:1, d:0, t:1 },
        prompt:"The blue graph is `y = sin x`. If it slides <strong>left</strong> by π/2, which graph will it land on?",
        options:[{ t:"`y = cos x`", ok:true }, { t:"`y = -cos x`" }, { t:"`y = -sin x`" }, { t:"A new wave that is neither a sine nor a cosine graph" }],
        explain:"Every peak of `y = sin x` moves from π/2 to 0, which is exactly where `y = cos x` peaks. Sliding left by π/2 replaces `x` with `x + π/2`, so `sin(x + π/2) = cos x` for every `x`. Sliding right by π/2 would give `-cos x`, and sliding by π would give `-sin x`." },
      { id:"p2", start:{ f:"cos", a:1, k:1, d:0, t:1 },
        prompt:"Now flip `y = cos x` in the `y`-axis. That makes `y = cos(-x)`. Which graph do you get?",
        options:[{ t:"The same graph, `y = cos x`", ok:true }, { t:"`y = -cos x`" }, { t:"`y = sin x`" }, { t:"`y = -sin x`" }],
        explain:"The cosine graph is symmetric about the `y`-axis (cosine is an even function), so the flip changes nothing: `cos(-x) = cos x`. On the circle, `-x` is the mirror image of `x` in the `x`-axis, which keeps the `x`-coordinate. Careful: `y = f(-x)` is a flip in the <strong>`y`-axis</strong>; a flip in the `x`-axis is `y = -f(x)`. Try the same flip on sine: `sin(-x) = -sin x`." },
      { id:"p3", start:{ f:"sin", a:1, k:-1, d:12, t:0 },
        prompt:"On the circle, `Q` is the point for `π - x`. As `x` sweeps all the way from 0 to 2π, how will `sin(π - x)` compare with `sin x`?",
        options:[{ t:"Equal for every `x`", ok:true }, { t:"Equal only while `x` is in quadrant 1" }, { t:"Opposite for every `x`" }, { t:"Equal only at `x = π/2`" }],
        explain:"`π - x` is the mirror image of `x` in the `y`-axis for every `x`, not just acute ones. A reflection in the `y`-axis keeps the height, so `sin(π - x) = sin x` always. The `x`-coordinates are opposites, so `cos(π - x) = -cos x`." },
      { id:"p4", start:{ f:"cos", a:1, k:1, d:0, t:0 },
        prompt:"In P1, sliding <strong>sine</strong> left by π/2 gave cosine. Now slide <strong>cosine</strong> left by π/2 to get `y = cos(x + π/2)`. What does it land on?",
        options:[{ t:"`y = -sin x`", ok:true }, { t:"`y = sin x`" }, { t:"`y = -cos x`" }, { t:"`y = cos x`" }],
        explain:"A quarter-period slide to the left moves one step around the cycle `sin x → cos x → -sin x → -cos x → sin x`. So sine becomes cosine, but cosine becomes <strong>negative</strong> sine. On the circle, a quarter turn sends `(cos x, sin x)` to `(-sin x, cos x)`, and the first coordinate of that point is `cos(x + π/2)`." }
    ],
    chalIntro:"Opening a challenge sets its target and locks the target chips until you close it. Set the matcher, then press <strong>Check challenge</strong>. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[3, 4], t:1,
        prompt:"Slide only. Keep both flips off, choose `f = sin`, and make `y = sin x` land on `y = cos x`.",
        why:"`d = -π/2` gives the angle form `sin(x + π/2)`, and `d = 3π/2` gives `sin(x - 3π/2)`: both equal `cos x`.",
        msgs:{ upside:"Your graph is `-cos x`: an upside-down match. Sliding right by π/2 (or left by 3π/2, which draws the same wave) puts a trough at `x = 0`, not a peak. The peak at π/2 has to move <strong>left</strong> by π/2 to land at 0.",
          half:"A half-period slide gives `-sin x`. The peaks of sine and cosine are only a quarter period apart.",
          whole:"That’s `y = sin x` itself: sliding a whole period, 2π, changes nothing.",
          flip:"This one is slide only. Turn both flips off.",
          fn:"This one starts from `y = sin x`: choose `f = sin`.",
          other:"Watch the peaks: `sin x` peaks at π/2 and `cos x` at 0. Which way, and how far, must the peak move?" },
        hints:["Compare where `y = sin x` and `y = cos x` first reach the value 1.", "`sin x` reaches 1 at π/2; `cos x` reaches 1 at 0. The sine graph must move left by π/2.", "Set `d = -π/2`: `y = sin(x + π/2) = cos x`. (`d = 3π/2` also works: sliding right by 3π/2 lines the peak up with the cosine peak at 2π.)"] },
      { id:"tc2", goal:[3, 4], t:0,
        prompt:"Use the `y`-axis flip. Choose `f = cos`, turn the `y`-axis flip on (`k = -1`), keep `a = 1`, and make the graph land on `y = sin x`.",
        why:"`d = π/2` gives the angle form `cos(π/2 - x)`, and `d = -3π/2` gives `cos(-3π/2 - x)`: both equal `sin x`.",
        msgs:{ whole:"That’s `cos(-x)`, which is still `cos x`. The flip alone changes nothing, because the cosine graph is symmetric about the `y`-axis.",
          upside:"You’ve made `cos(3π/2 - x)` (or `cos(-π/2 - x)`), which is `-sin x`: an upside-down match. Slide the other way.",
          half:"That’s `cos(π - x)` (or `cos(-π - x)`, the same wave), which is `-cos x`: a half-period slide changes the sign but keeps cosine.",
          flip:"For this challenge, keep `a = 1` and the `y`-axis flip on.",
          fn:"This one starts from `y = cos x`: choose `f = cos`.",
          other:"With the flip on, the angle form is `cos(d - x)`. Which `d` makes it equal `sin x`?" },
        hints:["With `k = -1` the moving graph is `y = cos(d - x)`. Test `x = 0`: what must `cos d` be?", "`sin 0 = 0`, so `cos d = 0`, which means `d` is ±π/2 or ±3π/2. Now test `x = π/2`: `sin(π/2) = 1`, so `cos(d - π/2)` must be 1.", "`d = π/2`: `cos(π/2 - x) = sin x` for every `x`. That’s a cofunction identity; Part 3 explains it with a triangle."] },
      { id:"tc3", goal:[3, 4], stretch:true, t:1,
        prompt:"Commit first. Turn <strong>both</strong> flips on (`a = -1` and `k = -1`) and choose `f = sin`. The target is `y = cos x`. Work out the slide `d` (from −2π to 2π) that makes it land, and enter it <strong>before</strong> the graph moves. The slider stays locked until you press Check challenge; then the graph glides to your `d`." +
          "<label class=\"tc3-in\"><span>Your slide: `@d{d} =`</span><input type=\"text\" class=\"numin short\" id=\"tc3-d\" inputmode=\"text\" autocomplete=\"off\" aria-describedby=\"tc3-how\"><span class=\"m\">π</span></label><span class=\"tiny muted\" id=\"tc3-how\">Type the number in front of π, for example −1/2 for −π/2.</span>",
        why:"`d = -π/2` gives the angle form `-sin(-π/2 - x)`, and `d = 3π/2` gives `-sin(3π/2 - x)`: both equal `cos x`.",
        msgs:{ whole:"Two flips together are a half turn about the origin, and a half turn leaves the sine graph unchanged (sine is odd): `-sin(-x) = sin x`. You still need a slide.",
          upside:"You’ve made `-sin(π/2 - x) = -cos x`: exactly upside down. With both flips on, the slide goes the other way.",
          half:"`-sin(π - x) = -sin x`.",
          range:"Keep `d` between −2π and 2π.",
          other:"Work it out before you check: with both flips on, the graph is `y = -sin(d - x)`. What does that simplify to?" },
        hints:["First simplify: `-sin(d - x) = sin(x - d)`, because sine is odd. So on sine, both flips together cancel out.", "Now you need `sin(x - d) = cos x`. From TC1, `sin(x + π/2) = cos x`, so you need `x - d = x + π/2`.", "`d = -π/2` (or −π/2 + 2π = 3π/2). Check `x = 0`: `-sin(-π/2) = 1 = cos 0`."] }
    ],
    blocks:[{ title:"What the matches mean", html:"<p><strong>Three ways to see one identity</strong></p><ul><li><strong>Graph:</strong> the two expressions draw the same curve. A slide of π/2 to the left moves one step around `sin x → cos x → -sin x → -cos x`; a flip in the `y`-axis leaves `cos x` alone and turns `sin x` upside down.</li><li><strong>Circle:</strong> `x + c` rotates the point for `x` by `c`; `c - x` reflects it. Read off the coordinates of the moved point.</li><li><strong>Every `x`:</strong> an identity must hold for every value of `x`. Matching at one point is not enough.</li></ul>" }]
  },
  part3:{
    slug:"cofunctions", name:"Cofunctions",
    heading:"Cofunction pairs from a right triangle",
    intro:"A right triangle has two acute angles, `x` and `π/2 - x`. Stand at one corner, then the other, and watch what happens to ‘opposite’ and ‘adjacent’.",
    ui:{
      tris:["8, 15, 17", "7, 24, 25", "1, √3, 2 (`x = π/6`)", "1, 1, √2 (`x = π/4`)"],
      caption:"The angles add to π, so the angle at `B` is `π - π/2 - x = π/2 - x`.",
      stand:["Stand at `A`", "Stand at `B`"], sides:["Numbers", "Letters `p`, `q`, `r`"], corner:"Corner", sideLab:"Side labels",
      r1:"Round 1: Pair-up board", r1how:"Tap a ratio of `x`, then the ratio of `π/2 - x` that has the same value. Stand at `B` to work out the right-hand ratios.",
      r1left:"Ratios of `x`", r1right:"Ratios of `π/2 - x`",
      same:"From `B`’s corner, {sides}, so {R} = {vR}, while {L} = {vL}. Changing corners swaps opposite and adjacent.",
      recip:"{L} = {vL}, but {R} = {vR}. A cofunction pair keeps the reciprocal type: the partner of a {Ln} is a {Lc}.",
      other:"From `B`’s corner, {R} = {s} = {vR}, but {L} = {vL}. Look for the ratio of `π/2 - x` that uses the same two sides, in the same order.",
      done1:"<strong>Co</strong> stands for <strong>complement</strong>. Cosine is the sine of the complementary angle, cotangent is the tangent of it, and cosecant is the secant of it.",
      r2:"Round 2: Now with letters", r2how:"The triangle relabels: `BC = p` (opposite `x`), `AC = q` (adjacent to `x`), `AB = r` (hypotenuse). For each ratio of `π/2 - x`, pick its fraction.",
      r2wrong:"{chip} is {name} from `A`’s corner. From `B`, the opposite side is `q` and the adjacent side is `p`.",
      alg:"From `A`: `sin x = p/r`, `cos x = q/r`, `tan x = p/q`. From `B`: `sin(π/2 - x) = q/r`, `cos(π/2 - x) = p/r`, `tan(π/2 - x) = q/p`. Comparing: `sin(π/2 - x) = cos x`, `cos(π/2 - x) = sin x`, `tan(π/2 - x) = cot x`, and taking reciprocals, `csc(π/2 - x) = sec x`, `sec(π/2 - x) = csc x`, `cot(π/2 - x) = tan x`. These six statements are the <strong>cofunction identities</strong>.",
      beyond:"Beyond acute angles", beyondIntro:"The triangle is drawn inside the unit circle with `A` at the origin and hypotenuse 1, so its top corner is `P = (cos x, sin x)`. The point for `π/2 - x` is `Q = (sin x, cos x)`: the reflection of `P` in the line `y = x`.",
      fade:"A right triangle can’t have an angle this big",
      read:"`P` = {P}. `π/2 - x` = {ang}, so `Q` = {Q}. `Q` is `P` with its coordinates swapped, so `sin(π/2 - x)` = {v} = `cos x`.",
      closing:"The triangle explains the identity for acute angles. The reflection in `y = x` shows it holds for every `x`."
    },
    pairs:{ answer:{ sin:"cos", cos:"sin", tan:"cot", cot:"tan", sec:"csc", csc:"sec" } },
    build:{ answer:{ sin:"q/r", cos:"p/r", tan:"q/p", csc:"r/q", sec:"r/p", cot:"p/q" } },
    blocks:[{ title:"The two-question rule", html:"<p><strong>Rewriting `f(c ± x)` when `c` is a multiple of π/2</strong></p><ol><li><strong>Which function?</strong> If `c` is a multiple of π (0, π, 2π), keep the function. If `c` is an odd multiple of π/2 (π/2, 3π/2), switch to the cofunction: sin ↔ cos, tan ↔ cot, sec ↔ csc.</li><li><strong>Which sign?</strong> Pretend `x` is a small positive angle. Find the quadrant of the whole angle and use CAST on the <strong>original</strong> function.</li></ol><p>Example: `cos(π/2 + x)`. π/2 is an odd multiple of π/2, so cosine becomes sine. With `x` small, `π/2 + x` is in quadrant 2, where cosine is negative. So `cos(π/2 + x) = -sin x`.</p><p>For `x - c`, think of it as `-c + x`: `x - π/2` is just past −π/2, in quadrant 4. The rule is a shortcut for what the graphs and the circle show, so it works for every `x`, not only small ones.</p>" }],
    quickCheck:{
      title:"Cofunction quick check", summary:"Cofunction quick check",
      items:[
        { id:"q1", goal:2, prompt:"In a right triangle, `sin x = 7/25`. What is `cos(π/2 - x)`?",
          choices:[
            { t:"`7/25`", ok:true, fb:"Right. `π/2 - x` is the other acute angle, and the side opposite `x` is adjacent to it: `cos(π/2 - x) = sin x = 7/25`." },
            { t:"`24/25`", fb:"24/25 is `cos x` (the third side is `√{25^2 - 7^2} = 24`). The cofunction identity says `cos(π/2 - x)` equals `sin x`, not `cos x`." },
            { t:"`25/7`", fb:"25/7 is `csc x`, the reciprocal of `sin x`. A cofunction isn’t a reciprocal." },
            { t:"`7/24`", fb:"7/24 is `tan x`. Cosine uses the hypotenuse." }] },
        { id:"q2", goal:2, prompt:"Is `sin(π/2 - x) = 1 - sin x` true for every `x`?",
          choices:[
            { t:"No: at `x = π/6`, the left side is `√3/2` but the right side is 1/2.", ok:true, fb:"Right. One counterexample is enough. The true identity is `sin(π/2 - x) = cos x`." },
            { t:"Yes: `sin(π/2) = 1`, so `sin(π/2 - x) = sin(π/2) - sin x`.", fb:"Sine doesn’t split over a subtraction. At `x = π/6`: `√3/2 ≠ 1/2`." },
            { t:"Yes: both sides equal 1 when `x = 0`.", fb:"It does work at `x = 0` (and at `x = π/2`), but an identity must work for every `x`. At `x = π/6` it fails." },
            { t:"Only for acute angles `x`, because it comes from a right triangle.", fb:"It fails at `x = π/6`, which is acute. The identity that does come from the triangle is `sin(π/2 - x) = cos x`." }] },
        { id:"q3", goal:2, prompt:"Which angle makes `sec(π/3) = csc( ? )` true?",
          choices:[
            { t:"π/6", ok:true, fb:"Right. Secant and cosecant are cofunctions: `sec(π/3) = csc(π/2 - π/3) = csc(π/6) = 2`." },
            { t:"π/3", fb:"`csc(π/3) = 2√3/3`, but `sec(π/3) = 2`. The cofunction uses the complement, `π/2 - π/3`." },
            { t:"2π/3", fb:"`csc(2π/3) = 2√3/3`. The complement of π/3 is `π/2 - π/3 = π/6`." },
            { t:"7π/6", fb:"`csc(7π/6) = -2`: the right size, but sine is negative in quadrant 3." }] },
        { id:"q4", goal:[2, 1], prompt:"Let `x = 2π/3`, which isn’t acute. Is `sin(π/2 - x) = cos x` still true?",
          choices:[
            { t:"Yes: both sides are −1/2.", ok:true, fb:"Right. `π/2 - 2π/3 = -π/6`, and `sin(-π/6) = -1/2 = cos(2π/3)`. The reflection in `y = x` works for every angle." },
            { t:"No: `sin(π/2 - x) = 1/2` but `cos x = -1/2`.", fb:"`sin(-π/6)` is −1/2, not 1/2: the angle −π/6 ends below the `x`-axis." },
            { t:"No: the identity only works for acute angles.", fb:"The triangle needs an acute angle, but the unit circle shows the identity for every `x`." },
            { t:"Yes: both sides are 1/2.", fb:"Both sides are −1/2: 2π/3 is in quadrant 2, where cosine is negative." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"rewrite", type:"sorter", title:"Rewrite it", summary:"Rewrite it", noun:"expression", goal:4,
        instruction:"Sort each expression into the box it equals for every `x`.", how:"Tap an expression, then tap the box it belongs in.",
        boxes:[{ id:"b1", label:"`sin x`" }, { id:"b2", label:"`-sin x`" }, { id:"b3", label:"`cos x`" }, { id:"b4", label:"`-cos x`" }],
        items:[
          sortItem("i1", "sin(π - x)", "sin", "π", false, "π - x", 2, true, "b1", "π keeps sine. With `x` small, `π - x` is in quadrant 2, where sine is positive.", "from"),
          sortItem("i2", "cos(π/2 - x)", "cos", "π/2", true, "π/2 - x", 1, true, "b1", "π/2 switches cosine to sine. `π/2 - x` is in quadrant 1, where cosine is positive.", "from"),
          sortItem("i3", "cos(3π/2 + x)", "cos", "3π/2", true, "3π/2 + x", 4, true, "b1", "3π/2 switches cosine to sine. `3π/2 + x` is in quadrant 4, where cosine is positive.", "added"),
          sortItem("i4", "sin(π + x)", "sin", "π", false, "π + x", 3, false, "b2", "π keeps sine. `π + x` is in quadrant 3, where sine is negative.", "added"),
          sortItem("i5", "cos(x + π/2)", "cos", "π/2", true, "π/2 + x", 2, false, "b2", "π/2 switches cosine to sine. `π/2 + x` is in quadrant 2, where cosine is negative.", "added",
            "π/2 is an odd multiple of π/2, so cosine switches to sine. With `x` small, `π/2 + x` is in quadrant 2."),
          sortItem("i6", "sin(2π - x)", "sin", "2π", false, "2π - x", 4, false, "b2", "2π keeps sine. `2π - x` is in quadrant 4, where sine is negative.", "from"),
          sortItem("i7", "sin(π/2 - x)", "sin", "π/2", true, "π/2 - x", 1, true, "b3", "π/2 switches sine to cosine. `π/2 - x` is in quadrant 1, where sine is positive.", "from"),
          sortItem("i8", "cos(2π - x)", "cos", "2π", false, "2π - x", 4, true, "b3", "2π keeps cosine. `2π - x` is in quadrant 4, where cosine is positive.", "from"),
          sortItem("i9", "sin(x + π/2)", "sin", "π/2", true, "π/2 + x", 2, true, "b3", "π/2 switches sine to cosine. `π/2 + x` is in quadrant 2, where sine is positive.", "added"),
          sortItem("i10", "cos(π - x)", "cos", "π", false, "π - x", 2, false, "b4", "π keeps cosine. `π - x` is in quadrant 2, where cosine is negative.", "from"),
          sortItem("i11", "sin(3π/2 - x)", "sin", "3π/2", true, "3π/2 - x", 3, false, "b4", "3π/2 switches sine to cosine. `3π/2 - x` is in quadrant 3, where sine is negative.", "from",
            "3π/2 is an odd multiple of π/2, so sine switches to cosine. With `x` small, `3π/2 - x` is just short of 3π/2, in quadrant 3."),
          sortItem("i12", "sin(x - π/2)", "sin", "π/2", true, "x - π/2 = -π/2 + x", 4, false, "b4", "π/2 switches sine to cosine. `x - π/2 = -π/2 + x` is in quadrant 4, where sine is negative. (On the graph: sine slid right by π/2 is cosine upside down.)", "sub")
        ] },
      { id:"wb", type:"custom", title:"Work backwards: find the angle", summary:"Work backwards", star:true, goal:[3, 4, 5],
        instruction:"Find the angle `c`, with 0 ≤ `c` < 2π, that makes each statement true for every `x`.",
        how:"Type the number in front of π as a fraction, for example 3/2 for 3π/2, then press Check. After each check, a small graph shows both sides, so you can see where they agree.",
        outside:"That angle works, but it’s outside 0 ≤ `c` < 2π. Add or subtract 2π.",
        fallback:"Your `c` gives a different graph. The preview shows both sides: where do they disagree first?",
        bad:"Enter the number in front of π, such as 1/2 or 3/2.",
        items:[
          { id:"wb1", goal:[3, 4], st:"`sin(x + c) = cos x`", answer:[0.5], show:"`c = π/2`",
            wrong:[{ match:1.5, fb:"`sin(x + 3π/2) = -cos x`: upside down. The sine graph must slide <strong>left</strong> a quarter period." }, { match:1, fb:"`sin(x + π) = -sin x`. A half period changes the sign but keeps sine." }, { match:0, fb:"`sin(x + 0)` is just `sin x`." }],
            hints:["Which slide turns sine into cosine? Compare where they peak.", "`sin x` peaks at π/2 and `cos x` peaks at 0, so the sine graph must slide left by π/2. Sliding left by π/2 replaces `x` with `x + π/2`.", "`sin(x + π/2) = cos x`, so `c = π/2`."] },
          { id:"wb2", goal:[1, 4], st:"`cos(c - x) = -cos x`", answer:[1], show:"`c = π`",
            wrong:[{ match:0, fb:"`cos(-x) = cos x`. Cosine is even, so the flip alone doesn’t change the sign." }, { match:0.5, fb:"`cos(π/2 - x) = sin x`: a cofunction, not the opposite." }, { match:1.5, fb:"`cos(3π/2 - x) = -sin x`." }],
            hints:["Which angle `c - x` ends at the point with the opposite `x`-coordinate to the point for `x`?", "On the unit circle, `π - x` is the mirror image of `x` in the `y`-axis, which changes the sign of the `x`-coordinate.", "`cos(π - x) = -cos x`, so `c = π`."] },
          { id:"wb3", goal:[3, 4], st:"`cos(x + c) = sin x`", answer:[1.5], show:"`c = 3π/2`",
            wrong:[{ match:0.5, fb:"`cos(x + π/2) = -sin x`: right function, wrong sign. Go a further half turn." }, { match:1, fb:"`cos(x + π) = -cos x`." }, { match:0, fb:"`cos(x + 0)` is just `cos x`." }],
            hints:["Which slide turns cosine into sine? Compare where they peak.", "`cos x` peaks at 0 and `sin x` peaks at π/2, so cosine must slide right by π/2: `cos(x - π/2) = sin x`. But `c` has to be between 0 and 2π.", "Sliding right by π/2 draws the same graph as sliding left by 3π/2, because the wave repeats every 2π. So `cos(x + 3π/2) = sin x`, and `c = 3π/2`."] },
          { id:"wb4", goal:[2, 4], st:"`sin(c - x) = -cos x`", answer:[1.5], show:"`c = 3π/2`",
            wrong:[{ match:0.5, fb:"`sin(π/2 - x) = cos x`: the sign is wrong." }, { match:1, fb:"`sin(π - x) = sin x`." }, { match:0, fb:"`sin(-x) = -sin x`." }],
            hints:["Switching sine to cosine needs an odd multiple of π/2. Which one gives the negative sign?", "Try `c = π/2`: `sin(π/2 - x) = cos x`, the wrong sign. With `x` small, `3π/2 - x` is in quadrant 3, where sine is negative.", "`sin(3π/2 - x) = -cos x`, so `c = 3π/2`."] },
          { id:"wb5", goal:[2, 5], two:true, st:"`tan(c - x) = cot x`, for every `x` where both sides are defined (enter <strong>both</strong> values of `c`)", answer:[0.5, 1.5], show:"`c = π/2` and `c = 3π/2`",
            one:"Correct, but tangent repeats every π, not every 2π. There’s a second angle.",
            wrong:[{ match:1, fb:"`tan(π - x) = -tan x`." }, { match:0, fb:"`tan(-x) = -tan x`." }],
            hints:["Which cofunction identity turns tangent into cotangent?", "`tan(π/2 - x) = cot x`, so `c = π/2` works. Tangent repeats every π, so adding π to the angle gives the same values.", "`c = π/2` and `c = π/2 + π = 3π/2`."] },
          { id:"wb6", goal:[4, 5], st:"`sin(x + c) = cos(x - π/3)`", answer:[1 / 6], show:"`c = π/6`",
            wrong:[{ match:7 / 6, fb:"`sin(x + 7π/6) = -cos(x - π/3)`: upside down. Use `cos θ = sin(θ + π/2)`, not `sin(θ - π/2)`." }, { match:5 / 6, fb:"5π/6 works in the other form, `sin(5π/6 - x)`, but here `x` has a plus sign. Check `x = π/3`: `sin(7π/6) = -1/2`, but `cos 0 = 1`." }],
            hints:["Write the right side as a sine first. Which identity turns `cos θ` into a sine?", "`cos θ = sin(θ + π/2)`. Use it with `θ = x - π/3`.", "`cos(x - π/3) = sin(x - π/3 + π/2) = sin(x + π/6)`, so `c = π/6`."] },
          { id:"wb7", goal:[4, 5], st:"`cos(c - x) = sin(x + π/4)`", answer:[0.25], show:"`c = π/4`",
            wrong:[{ match:0.75, fb:"It looks as if you added π/4 to π/2. The cofunction identity `sin θ = cos(π/2 - θ)` with `θ = x + π/4` gives `cos(π/2 - x - π/4) = cos(π/4 - x)`: subtract. Check `x = 0`: `cos(3π/4) = -√2/2`, but `sin(π/4) = √2/2`." }, { match:1.75, fb:"`cos(7π/4 - x) = cos(x + π/4)`: you switched sine to cosine but kept the angle `x + π/4`. Switching function always needs a quarter-period change in the angle. At `x = π/4` your side gives 0, not 1." }],
            hints:["Write the right side as a cosine first. Which identity turns `sin θ` into a cosine?", "`sin θ = cos(π/2 - θ)`. Use it with `θ = x + π/4`.", "`sin(x + π/4) = cos(π/2 - x - π/4) = cos(π/4 - x)`, so `c = π/4`."] },
          { id:"wb8", goal:[4, 5], st:"`-sin(c - x) = cos(x + π/6)`", answer:[4 / 3], show:"`c = 4π/3`",
            wrong:[{ match:2 / 3, fb:"`-sin(2π/3 - x) = -cos(x - π/6)`. Watch the sign when you rewrite: `-sin(c - x) = sin(x - c)`, so `x - c` must equal `x + 2π/3`, which gives `c = -2π/3`, or 4π/3." }, { match:1 / 3, fb:"`-sin(π/3 - x) = -cos(x + π/6)`: exactly upside down." }],
            hints:["Simplify the left side first. Sine is odd, so `-sin(c - x) = sin(x - c)`.", "Now write the right side as a sine: `cos θ = sin(θ + π/2)` gives `cos(x + π/6) = sin(x + 2π/3)`. So `x - c` must equal `x + 2π/3`, up to a multiple of 2π.", "`c = -2π/3`, and adding 2π gives `c = 4π/3`. Check `x = 0`: `-sin(4π/3) = √3/2 = cos(π/6)`."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", summary:"Spot the error", student:"Chloe", how:"",
        instruction:"Chloe made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Write `cos(π/2 + x)` in terms of `sin x` or `cos x`.",
            steps:["π/2 is an odd multiple of π/2, so cosine switches to its cofunction, sine.", "Treat `x` as a small positive angle. Then `π/2 + x` is just past π/2, in quadrant 2.", "In quadrant 2, sine is positive, so the sign is +.", "So `cos(π/2 + x) = sin x`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct. Keep checking.", "", "Step 4 uses step 3’s sign. The mistake is earlier."],
            fixes:[
              { t:"The sign comes from the original function. Cosine is negative in quadrant 2, so `cos(π/2 + x) = -sin x`.", ok:true, why:"The sign belongs to the function you started with. Check `x = π/6`: `cos(2π/3) = -1/2 = -sin(π/6)`." },
              { t:"In quadrant 2, sine is negative, so `cos(π/2 + x) = -sin x`.", why:"The final answer is right, but the reason isn’t: sine is positive in quadrant 2. The sign comes from cosine, the original function." },
              { t:"Cosine is negative in quadrant 2, so `cos(π/2 + x) = -cos x`.", why:"The sign is right now, but step 1’s switch to sine has been dropped." },
              { t:"Step 3 is correct as written.", why:"Check `x = π/6`: Chloe’s answer gives `sin(π/6) = 1/2`, but `cos(2π/3) = -1/2`." }],
            hints:["Which function’s sign decides the answer: the one you start with, or the one you switch to?", "The sign comes from the original function, cosine. Is cosine positive or negative in quadrant 2?", "Step 3 is wrong. Cosine is negative in quadrant 2, so `cos(π/2 + x) = -sin x`."] },
          { id:"e2", goal:1, task:"Use the unit circle to show what `sin(π - x)` equals.",
            steps:["Let `P` be the point on the unit circle for angle `x`, so `P = (cos x, sin x)`.", "The point `Q` for the angle `π - x` is the reflection of `P` in the `x`-axis.", "A reflection in the `x`-axis keeps the `x`-coordinate and changes the sign of `y`, so `Q = (cos x, -sin x)`.", "So `sin(π - x) = -sin x`."],
            answer:1,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "", "Step 3 describes a reflection in the `x`-axis correctly. The mistake is in choosing that reflection.", "Step 4 reads `Q`’s `y`-coordinate correctly. The mistake is earlier."],
            fixes:[
              { t:"`Q` is the reflection of `P` in the <strong>`y`-axis</strong>, so `Q = (-cos x, sin x)` and `sin(π - x) = sin x`.", ok:true, why:"`π - x` is measured back from the negative `x`-axis, so it mirrors `x` across the `y`-axis." },
              { t:"`Q` is `P` turned a half turn, so `Q = (-cos x, -sin x)`.", why:"A half turn gives the angle `π + x`, not `π - x`." },
              { t:"`Q` is the reflection of `P` in the line `y = x`, so `Q = (sin x, cos x)`.", why:"Reflecting in `y = x` gives the angle `π/2 - x`." },
              { t:"Step 2 is correct; the mistake is in step 4.", why:"Reflecting in the `x`-axis gives the angle `-x`. Check `x = π/6`: `sin(5π/6) = 1/2`, not −1/2." }],
            hints:["Try one value: where is the point for `π - x` when `x = π/6`?", "`π - π/6 = 5π/6`, in quadrant 2. It’s the mirror image of the π/6 point across the <strong>`y`-axis</strong>.", "Step 2 is wrong. `Q` is the reflection in the `y`-axis, `Q = (-cos x, sin x)`, so `sin(π - x) = sin x`."] },
          { id:"e3", goal:3, task:"Use the graphs to write `cos x` in terms of sine.",
            steps:["The graph of `y = sin x` has a maximum at `x = π/2`.", "The graph of `y = cos x` has a maximum at `x = 0`.", "To move the peak from `x = π/2` to `x = 0`, slide the sine graph right by π/2.", "Sliding right by π/2 replaces `x` with `x - π/2`, so `cos x = sin(x - π/2)`."],
            answer:2,
            stepFb:["Step 1 is correct. Keep checking the steps after it.", "Step 2 is correct. Keep checking.", "", "Step 4 applies the slide rule correctly to step 3’s direction. The mistake is earlier."],
            fixes:[
              { t:"Moving the peak from π/2 to 0 is a slide <strong>left</strong> by π/2. That replaces `x` with `x + π/2`, so `cos x = sin(x + π/2)`.", ok:true, why:"Check `x = 0`: `sin(π/2) = 1 = cos 0`." },
              { t:"The slide is right by π/2, but it replaces `x` with `x + π/2`, so `cos x = sin(x + π/2)`.", why:"The final identity is right, but two errors cancel: moving from π/2 to 0 is a move left, and a slide right replaces `x` with `x - π/2`." },
              { t:"The slide is left by π, so `cos x = sin(x + π)`.", why:"`sin(x + π) = -sin x`. The two peaks are only π/2 apart." },
              { t:"Step 3 is correct as written.", why:"Check `x = 0` in step 4: `sin(-π/2) = -1`, but `cos 0 = 1`. Going from π/2 to 0 is a move to the left." }],
            hints:["On the `x`-axis, is 0 to the left or to the right of π/2?", "0 is to the left of π/2, so the peak must move left.", "Step 3 is wrong. Slide left by π/2: `cos x = sin(x + π/2)`."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you when you slid or flipped the graphs in Explore?" },
      { id:"j2", q:"In your own words, why is `sin(π/2 - x)` equal to `cos x`? Use a right triangle, the unit circle, or both." },
      { id:"j3", q:"Explain to a friend how to rewrite `cos(π + x)` without any calculation: what decides the function, and what decides the sign?" },
      { id:"j4", q:"Which kind of identity, related-angle or cofunction, do you still find harder? What check will you use next time to catch a mistake?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"Which expression equals `cos x` for every `x`?", options:[
          { t:"`sin(π/2 - x)`", ok:true, why:"This is a cofunction identity: the sine of the complement is the cosine." },
          { t:"`cos(π/2 - x)`", why:"`cos(π/2 - x) = sin x`. The cofunction switches cosine to sine." },
          { t:"`sin(x - π/2)`", why:"That’s sine slid <strong>right</strong> by π/2, which is `-cos x`. Check `x = 0`: `sin(-π/2) = -1`, but `cos 0 = 1`." },
          { t:"`sin(π - x)`", why:"Subtracting from π keeps sine: `sin(π - x) = sin x`. Only an odd multiple of π/2 switches to cosine." }] },
        b:{ prompt:"Which expression equals `sin x` for every `x`?", options:[
          { t:"`cos(π/2 - x)`", ok:true, why:"Cofunction identity: the cosine of the complement is the sine." },
          { t:"`sin(π/2 - x)`", why:"`sin(π/2 - x) = cos x`." },
          { t:"`cos(x + π/2)`", why:"That’s cosine slid <strong>left</strong> by π/2, which is `-sin x`. To turn `cos x` into `sin x`, the peak at 0 must move right to π/2, which is `cos(x - π/2)`. Check `x = π/2`: `cos π = -1`, but `sin(π/2) = 1`." },
          { t:"`cos(π - x)`", why:"`cos(π - x) = -cos x`. Subtracting from π doesn’t switch to sine." }] } },
      { id:"k2", cat:"K", goal:1,
        a:{ prompt:"Which expression equals `sin(π + x)` for every `x`?", options:[
          { t:"`-sin x`", ok:true, why:"Adding π is a half turn on the unit circle, which changes the sign of both coordinates. So `sin(π + x) = -sin x`." },
          { t:"`sin x`", why:"With `x` small, `π + x` is in quadrant 3, where sine is negative." },
          { t:"`-cos x`", why:"Adding π keeps the function. Only odd multiples of π/2 switch sine to cosine." },
          { t:"`cos x`", why:"Adding π doesn’t switch to cosine, and the sign changes as well." }] },
        b:{ prompt:"Which expression equals `cos(2π - x)` for every `x`?", options:[
          { t:"`cos x`", ok:true, why:"`2π - x` ends at the same point as `-x`, the mirror image of `x` in the `x`-axis. That keeps the `x`-coordinate." },
          { t:"`-cos x`", why:"With `x` small, `2π - x` is in quadrant 4, where cosine is positive." },
          { t:"`sin x`", why:"Subtracting from 2π keeps the function." },
          { t:"`-sin x`", why:"2π is a multiple of π, so cosine stays cosine. It’s `sin(2π - x)` that equals `-sin x`." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"The two acute angles of a right triangle are α and β. Which statement is always true?", options:[
          { t:"`tan α = cot β`", ok:true, why:"`β = π/2 - α`, and tangent and cotangent are cofunctions: `cot(π/2 - α) = tan α`." },
          { t:"`tan α = -cot β`", why:"Both angles are acute, so all their ratios are positive. There’s no negative sign." },
          { t:"`sec α = cos β`", why:"`cos β = sin α`, but `sec α = 1/cos α`. A cofunction keeps the reciprocal type: `sec α = csc β`." },
          { t:"`sin α = sin β`", why:"Only when `α = β = π/4`. The side opposite α is adjacent to β, so `sin α = cos β`." }] },
        b:{ prompt:"The two acute angles of a right triangle are α and β. Which statement is always true?", options:[
          { t:"`sec α = csc β`", ok:true, why:"`β = π/2 - α`, and secant and cosecant are cofunctions: `csc(π/2 - α) = sec α`." },
          { t:"`sec α = -csc β`", why:"Both angles are acute, so all their ratios are positive." },
          { t:"`csc α = sin β`", why:"`sin β = cos α`, but `csc α = 1/sin α`. The cofunction of csc is sec: `csc α = sec β`." },
          { t:"`cos α = cos β`", why:"Only when `α = β = π/4`. The side adjacent to α is opposite β, so `cos α = sin β`." }] } },
      { id:"t1", cat:"T", goal:4,
        a:{ prompt:"Three of these expressions are equal to each other for every `x`. Which one is the odd one out?", options:[
          { t:"`cos(x + π/2)`", ok:true, why:"`cos(x + π/2) = -sin x`. Each of the other three equals `sin x`." },
          { t:"`sin(π - x)`", why:"You probably gave it a negative sign. With `x` small, `π - x` is in quadrant 2, where sine is positive: `sin(π - x) = sin x` (the reflection in the `y`-axis keeps the height). It’s one of the matching three." },
          { t:"`cos(π/2 - x)`", why:"You probably kept it as a cosine. π/2 is an odd multiple of π/2, so cosine switches to sine: `cos(π/2 - x) = sin x`. It matches." },
          { t:"`-sin(x + π)`", why:"You probably read `sin(x + π)` as `sin x`, so the leading minus made it look negative. A half turn changes the sign, `sin(x + π) = -sin x`, so `-sin(x + π) = sin x`: the two sign changes cancel. It matches." }] },
        b:{ prompt:"Three of these expressions are equal to each other for every `x`. Which one is the odd one out?", options:[
          { t:"`sin(x - π/2)`", ok:true, why:"`sin(x - π/2) = -cos x`. Each of the other three equals `cos x`." },
          { t:"`cos(-x)`", why:"You probably treated `cos(-x)` as `-cos x`. Cosine is even: the flip in the `y`-axis leaves its graph unchanged, so `cos(-x) = cos x`. It matches." },
          { t:"`sin(π/2 + x)`", why:"You probably gave it a negative sign, as in `cos(x + π/2) = -sin x`. With `x` small, `π/2 + x` is in quadrant 2, where sine is positive: `sin(π/2 + x) = cos x` (sine slid left by π/2). It matches." },
          { t:"`-cos(π - x)`", why:"You probably read `cos(π - x)` as `cos x`, so the leading minus made it look negative. `cos(π - x) = -cos x`, so `-cos(π - x) = cos x`: the two sign changes cancel. It matches." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"`cos(2π/9) = q`. Which expression equals `sin(13π/18)`?", options:[
          { t:"`q`", ok:true, why:"`13π/18 = π/2 + 2π/9`. π/2 switches sine to cosine, and `π/2 + 2π/9` is in quadrant 2, where sine is positive. So `sin(13π/18) = cos(2π/9) = q`." },
          { t:"`-q`", why:"The switch to cosine is right, but sine is positive in quadrant 2, so there’s no negative sign." },
          { t:"`√{1 - q^2}`", why:"`√{1 - q^2}` is `sin(2π/9)`. Adding π/2 switches sine to cosine, so the answer is a cosine: `q`." },
          { t:"`1/q`", why:"`1/q` is `sec(2π/9)`, a reciprocal. A cofunction isn’t a reciprocal." }] },
        b:{ prompt:"`sin(π/5) = s`. Which expression equals `cos(7π/10)`?", options:[
          { t:"`-s`", ok:true, why:"`7π/10 = π/2 + π/5`. π/2 switches cosine to sine, and `π/2 + π/5` is in quadrant 2, where cosine is negative. So `cos(7π/10) = -sin(π/5) = -s`." },
          { t:"`s`", why:"The switch to sine is right, but cosine is negative in quadrant 2." },
          { t:"`-√{1 - s^2}`", why:"`-√{1 - s^2}` is `-cos(π/5)`. Adding π/2 switches cosine to sine." },
          { t:"`-1/s`", why:"`-1/s` is `-csc(π/5)`, a reciprocal, not a cofunction." }] } },
      { id:"t3", cat:"T", goal:3,
        a:{ prompt:"For which value of `c`, with 0 ≤ `c` < 2π, is the graph of `y = sin(x + c)` the same as the graph of `y = -cos x`?", options:[
          { t:"3π/2", ok:true, why:"`y = -cos x` peaks at `x = π` and `x = -π`. `y = sin(x + c)` peaks where `x + c = π/2`, at `x = π/2 - c`. Setting `π/2 - c = -π` gives `c = 3π/2`: `sin(x + 3π/2) = -cos x`." },
          { t:"0", why:"`c = 0` gives `sin x` itself." },
          { t:"π/2", why:"`sin(x + π/2) = cos x`: the right shape, but upside down compared with `-cos x`." },
          { t:"π", why:"`sin(x + π) = -sin x`. A half-period slide keeps sine." }] },
        b:{ prompt:"For which value of `c`, with 0 ≤ `c` < 2π, is the graph of `y = cos(x + c)` the same as the graph of `y = -sin x`?", options:[
          { t:"π/2", ok:true, why:"`y = -sin x` peaks at `x = -π/2` (and 3π/2). `y = cos(x + c)` peaks where `x + c = 0`, at `x = -c`. Setting `-c = -π/2` gives `c = π/2`: `cos(x + π/2) = -sin x`." },
          { t:"0", why:"`c = 0` gives `cos x` itself." },
          { t:"π", why:"`cos(x + π) = -cos x`." },
          { t:"3π/2", why:"`cos(x + 3π/2) = sin x`: upside down compared with `-sin x`." }] } },
      { id:"c1", cat:"C", goal:1,
        a:{ prompt:"Which is the best explanation of why `cos(-x) = cos x` for every `x`?", options:[
          { t:"“On the unit circle, the angle `-x` ends at the mirror image, in the `x`-axis, of the point for `x`. That reflection keeps the `x`-coordinate, which is the cosine.”", ok:true, why:"This connects the angle, the point and the meaning of cosine, and it works for every `x`." },
          { t:"“The negative sign comes out in front, `cos(-x) = -cos x`, and then the two negatives cancel.”", why:"`cos(-x)` isn’t `-cos x`, and there’s no second negative to cancel. That’s sine’s rule: `sin(-x) = -sin x`." },
          { t:"“It’s true at `x = 0`, since both sides equal 1.”", why:"One value doesn’t prove an identity. It must hold for every `x`." },
          { t:"“`-x` is always in quadrant 4, where cosine is positive.”", why:"Only when `x` is between 0 and π/2. For `x = 3π/4`, `-x` is in quadrant 3, where cosine is negative, yet `cos(-x) = cos x` still holds. A sign alone can’t show that two values are equal." }] },
        b:{ prompt:"Which is the best explanation of why `sin(π - x) = sin x` for every `x`?", options:[
          { t:"“On the unit circle, the angle `π - x` ends at the mirror image, in the `y`-axis, of the point for `x`. That reflection keeps the `y`-coordinate, which is the sine.”", ok:true, why:"This connects the angle, the point and the meaning of sine, and it works for every `x`." },
          { t:"“`π - x` is always in quadrant 2, where sine is positive.”", why:"Only when `x` is between 0 and π/2. For `x = 3π/2`, `π - x = -π/2`, which isn’t in any quadrant. A sign alone can’t show that two values are equal." },
          { t:"“It’s true at `x = π/6`, since both sides equal 1/2.”", why:"One value doesn’t prove an identity. It must hold for every `x`." },
          { t:"“`sin(π - x) = sin π - sin x`, and `sin π = 0`, so the signs cancel.”", why:"Sine doesn’t split over a subtraction. (And `0 - sin x` would be `-sin x` anyway.)" }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which statement is written correctly and is true for every `x`?", options:[
          { t:"`cos(π/2 - x) = sin x`", ok:true, why:"The brackets show that cosine acts on the whole angle `π/2 - x`." },
          { t:"`cos π/2 - x = sin x`", why:"Without brackets this reads `cos(π/2) - x = -x`, which isn’t `sin x`." },
          { t:"`cos(π/2 - x) = sin`", why:"‘sin’ needs its angle: `sin x`. On its own, ‘sin’ isn’t a number." },
          { t:"`cos(π/2) - cos x = sin x`", why:"Cosine doesn’t split over a subtraction. The left side is `0 - cos x = -cos x`." }] },
        b:{ prompt:"Which statement is written correctly and is true for every `x`?", options:[
          { t:"`sin(π + x) = -sin x`", ok:true, why:"The brackets show that sine acts on the whole angle `π + x`." },
          { t:"`sin π + x = -sin x`", why:"Without brackets this reads `sin(π) + x = x`, which isn’t `-sin x`." },
          { t:"`sin(π + x) = -sin`", why:"‘sin’ needs its angle: `-sin x`." },
          { t:"`sin π + sin x = -sin x`", why:"Sine doesn’t split over a sum. The left side is `0 + sin x = sin x`." }] } },
      { id:"a1", cat:"A", goal:5,
        a:{ prompt:"A loading ramp is 5 m long and makes an angle `x` with the ground. The building plan gives the angle between the ramp and a vertical post instead, which is `π/2 - x`, and states `cos(π/2 - x) = 0.28`. How high does the ramp rise?", options:[
          { t:"1.4 m", ok:true, why:"`cos(π/2 - x) = sin x = 0.28`, and the rise is opposite `x`: 5 `sin x` = 5 × 0.28 = 1.4 m." },
          { t:"0.28 m", why:"0.28 is `sin x`, a ratio. Multiply by the length of the ramp, 5 m." },
          { t:"4.8 m", why:"4.8 m = 5 `cos x` is the horizontal run. The rise is opposite `x`, so it uses `sin x = cos(π/2 - x)`." },
          { t:"About 17.9 m", why:"That’s 5 ÷ 0.28. The rise can’t be longer than the 5 m ramp; multiply instead." }] },
        b:{ prompt:"A zip line is 25 m long and makes an angle `x` with the horizontal. A survey gives the angle between the line and the vertical instead, which is `π/2 - x`, and states `sin(π/2 - x) = 0.96`. How far apart are the two ends horizontally?", options:[
          { t:"24 m", ok:true, why:"`sin(π/2 - x) = cos x = 0.96`, and the horizontal distance is adjacent to `x`: 25 `cos x` = 25 × 0.96 = 24 m." },
          { t:"0.96 m", why:"0.96 is `cos x`, a ratio. Multiply by the length of the line, 25 m." },
          { t:"7 m", why:"7 m = 25 `sin x` is the vertical drop. The horizontal distance uses `cos x = sin(π/2 - x)`." },
          { t:"About 26.0 m", why:"That’s 25 ÷ 0.96. The horizontal distance can’t be longer than the 25 m line; multiply instead." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A wind turbine’s hub is at the origin. One 10 m blade points at the angle 13π/10, measured counterclockwise from the positive `x`-axis. How far above or below the hub is the tip of the blade?", use:" `sin(π/5) ≈ 0.588` and `cos(π/5) ≈ 0.809`", options:[
          { t:"About 8.09 m below the hub", ok:true, why:"The tip’s height is 10 `sin(13π/10)`. `13π/10 = 3π/2 - π/5`, so 3π/2 switches sine to cosine, and the angle is in quadrant 3, where sine is negative: `sin(13π/10) = -cos(π/5) ≈ -0.809`. The tip is about 8.09 m below the hub." },
          { t:"About 5.88 m below the hub", why:"That uses `sin(π/5)`. Writing `13π/10 = 3π/2 - π/5` brings in 3π/2, which switches sine to cosine. (5.88 m is how far the tip is to the <strong>left</strong> of the hub, not below it.)" },
          { t:"About 8.09 m above the hub", why:"13π/10 is in quadrant 3, where sine is negative, so the tip is below the hub." },
          { t:"About 5.88 m above the hub", why:"Both the function and the sign are off: the height is −10 `cos(π/5)`." }] },
        b:{ prompt:"A wind turbine’s hub is at the origin. One 10 m blade points at the angle 7π/10, measured counterclockwise from the positive `x`-axis. How far to the left or right of the hub is the tip of the blade?", use:" `sin(π/5) ≈ 0.588` and `cos(π/5) ≈ 0.809`", options:[
          { t:"About 5.88 m to the left of the hub", ok:true, why:"The tip’s horizontal position is 10 `cos(7π/10)`. `7π/10 = π/2 + π/5`, so π/2 switches cosine to sine, and the angle is in quadrant 2, where cosine is negative: `cos(7π/10) = -sin(π/5) ≈ -0.588`." },
          { t:"About 8.09 m to the left of the hub", why:"That uses `cos(π/5)`. Writing `7π/10 = π/2 + π/5` brings in π/2, which switches cosine to sine. (8.09 m is how far the tip is <strong>above</strong> the hub, not to the left.)" },
          { t:"About 5.88 m to the right of the hub", why:"7π/10 is in quadrant 2, where cosine is negative, so the tip is to the left." },
          { t:"About 8.09 m to the right of the hub", why:"Both the function and the sign are off: the position is −10 `sin(π/5)`." }] } }
    ]
  },
  task:{
    title:"Same wave, new name", summary:"Same wave, new name",
    statement:"<p>The dashed graph is `y = cos(x - π/3)`. Build a <strong>sine</strong> expression whose graph lands on it for every `x`. There are four different ones with 0 ≤ `c` < 2π. Can you find them all?</p>",
    checks:["Uses sine", "`c` is at least 0 and less than 2π", "Goes through the target’s `y`-intercept, (0, 1/2)", "Goes through the target’s peak, (π/3, 1)"],
    tips:["The target is written with cosine. Find a sine form of it: `cos θ = sin(θ + π/2)`.",
      "Choose `c` from 0 up to, but not including, 2π. If your `c` is 2π or more, subtract 2π: the wave repeats every 2π, so the graph won’t change.",
      "At `x = 0` your expression gives {v}, but the target gives 1/2. Check the sign and the angle.",
      "Your graph goes through (0, 1/2), but at `x = π/3` it gives {v}, not 1. One matching point isn’t enough. Try the other inside form, or a different `c`."],
    ui:{ fn:"Function", sign:"Outer sign", inside:"Inside", c:"`c` =", p:"`p`", q:"`q`", gap:"Largest gap: {g}", gap0:"Largest gap: 0 (the graphs match at every `x`)", needC:"Enter `c` first: a whole number `p` from 0 to 24, and `q` from the menu.",
      all4:"You found all four. Each comes from `sin(x + π/6)` by an identity: `sin(π - θ) = sin θ` gives `sin(5π/6 - x)`, and `-sin(θ + π) = sin θ` gives `-sin(x + 7π/6)`. Which identity turns `sin(5π/6 - x)` into `-sin(11π/6 - x)`?" },
    explainPrompt:"Choose one of your expressions. Use identities from this module to show why it equals `cos(x - π/3)` for every `x`.",
    vocab:"Use the words cofunction, related angle and for every x.",
    success:"Your design works!", more:"There’s more than one answer. Can you find another?"
  },
  cards:[
    ["Equivalent expressions", "Expressions that are equal for every value of `x` where both are defined. One matching value isn’t enough. Example: `sin(π - x)` and `sin x`."],
    ["Cofunction identities: sine and cosine", "`sin(π/2 - x) = cos x` and `cos(π/2 - x) = sin x`"],
    ["Cofunction identities: the other four", "`tan(π/2 - x) = cot x`, `cot(π/2 - x) = tan x`, `sec(π/2 - x) = csc x`, `csc(π/2 - x) = sec x`"],
    ["Why “co”?", "In a right triangle the acute angles `x` and `π/2 - x` are complements. Cosine is the sine of the complement; cotangent and cosecant work the same way."],
    ["The angle `π - x`", "`sin(π - x) = sin x`, `cos(π - x) = -cos x`, `tan(π - x) = -tan x`. On the unit circle: a reflection in the `y`-axis."],
    ["The angle `π + x`", "`sin(π + x) = -sin x`, `cos(π + x) = -cos x`, `tan(π + x) = tan x`. On the unit circle: a half turn."],
    ["The angle `-x` (and `2π - x`)", "`sin(-x) = -sin x`, `cos(-x) = cos x`, `tan(-x) = -tan x`. On the unit circle: a reflection in the `x`-axis. `2π - x` gives the same values."],
    ["The angle `π/2 + x`", "`sin(π/2 + x) = cos x` and `cos(π/2 + x) = -sin x`. On the unit circle: a quarter turn counterclockwise. On the graph: a slide left by π/2."],
    ["The two-question rule", "For `f(c ± x)` with `c` a multiple of π/2: (1) a multiple of π keeps the function; an odd multiple of π/2 switches to the cofunction. (2) For the sign, treat `x` as small and positive, find the quadrant, and use CAST on the original function."],
    ["Slides: `f(x + c)` and `f(x - c)`", "`y = f(x + c)` is the graph slid left by `c`; `y = f(x - c)` is slid right by `c`. `sin(x + π/2) = cos x`, but `sin(x - π/2) = -cos x`."],
    ["Flips: `f(-x)` and `-f(x)`", "`y = f(-x)` flips the graph in the `y`-axis; `y = -f(x)` flips it in the `x`-axis. `cos(-x) = cos x` (cosine is even); `sin(-x) = -sin x` (sine is odd)."],
    ["On the unit circle: `x + c` and `c - x`", "`x + c` rotates the point for `x` by `c`. `c - x` reflects it in the line through the origin at angle `c/2`. For `c = π/2` that’s the line `y = x`, which swaps the coordinates."]
  ]
};
