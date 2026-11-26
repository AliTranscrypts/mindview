// MDM4U 04 Venn Diagrams & Set Operations. Source: /Users/ali/Desktop/MV/Modules/mdm4u/plan/modules/04-venn-diagrams.md
// Core feedback sentences for the plan's misconceptions (§3), adapted to each item.
const M2 = "∪ is “or” (everything in either circle); ∩ is “and” (only the overlap).";
const M3 = "“Not (`A` or `B`)” means in neither: `A′ ∩ B′`. The ∪ flips to ∩.";
const M4 = "Some people are in no circle. That region belongs in the rectangle too.";
const M5 = "Subtracting three pairs removes the centre three times, so add it back once.";
const M6 = "“`A` but not `B`” is inside `A` and outside `B`: `A ∩ B′`.";
const MODEL = '<span class="mdm-model">Model data</span> ';

// Two-circle region outlines as SVG paths (no ids needed): A only, both, B only, outside (rect + union, even-odd).
const R1 = x => Math.round(x * 10) / 10;
function venn2(cx1, cx2, cy, r, box){
  const d = cx2 - cx1, h = Math.sqrt(r * r - d * d / 4), mx = (cx1 + cx2) / 2, P = `${R1(mx)} ${R1(cy - h)}`, Q = `${R1(mx)} ${R1(cy + h)}`, A = `A${r} ${r} 0`;
  const [x, y, w, hh, rx] = box;
  const rect = `M${x + rx} ${y}H${x + w - rx}A${rx} ${rx} 0 0 1 ${x + w} ${y + rx}V${y + hh - rx}A${rx} ${rx} 0 0 1 ${x + w - rx} ${y + hh}H${x + rx}A${rx} ${rx} 0 0 1 ${x} ${y + hh - rx}V${y + rx}A${rx} ${rx} 0 0 1 ${x + rx} ${y}Z`;
  const union = `M${P}${A} 1 0 ${Q}${A} 1 0 ${P}Z`;
  return { a:`M${P}${A} 1 0 ${Q}${A} 0 1 ${P}Z`, ab:`M${P}${A} 0 1 ${Q}${A} 0 1 ${P}Z`, b:`M${P}${A} 1 1 ${Q}${A} 0 0 ${P}Z`, o:rect + union, rect };
}
// set notation inside SVG text: italic event letters
const svgM = s => s.replace(/[A-Z]/g, ch => `<tspan class="vh-i">${ch}</tspan>`);

// Practice: small shaded two-set pictures for "Name the region"
const MP = venn2(38, 60, 33, 21, [2, 2, 92, 60, 6]);
function mini(cs, cap){
  return '<span class="vn-pic"><svg viewBox="0 0 96 64" aria-hidden="true" focusable="false">' +
    `<path class="vn-u" d="${MP.rect}"/>` + cs.map(c => `<path class="vn-sh" fill-rule="evenodd" d="${MP[c]}"/>`).join("") +
    '<circle class="vn-a" cx="38" cy="33" r="21"/><circle class="vn-b" cx="60" cy="33" r="21"/>' +
    '<text class="vn-l vn-la" x="13" y="15">A</text><text class="vn-l vn-lb" x="83" y="15">B</text></svg></span>' +
    `<span class="vn-cap">${cap}</span>`;
}

// Hero: rectangle S, circles A and B; four regions with their names
const HP = venn2(160, 240, 122, 84, [8, 8, 384, 238, 12]);
const HERO = '<div class="vh-h" role="img" aria-label="A rectangle S with two overlapping circles A and B. The four regions light up one at a time with their names: A intersect B complement, A intersect B, A complement intersect B, and the complement of A union B. Then both circles fade and only the outside stays lit, labelled the complement of A union B equals A complement intersect B complement.">' +
  '<svg class="vh-svg" id="vw-hsvg" viewBox="0 0 400 256" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">' +
  `<path class="vh-u" d="${HP.rect}"/>` +
  '<circle class="vh-fa" cx="160" cy="122" r="84"/><circle class="vh-fb" cx="240" cy="122" r="84"/>' +
  ["a", "ab", "b", "o"].map(c => `<path class="vh-r" data-hr="${c}" fill-rule="evenodd" d="${HP[c]}"/>`).join("") +
  '<circle class="vh-ca" cx="160" cy="122" r="84"/><circle class="vh-cb" cx="240" cy="122" r="84"/>' +
  '<text class="vh-l vh-la" x="98" y="48" text-anchor="middle">A</text><text class="vh-l vh-lb" x="302" y="48" text-anchor="middle">B</text><text class="vh-s" x="27" y="31" text-anchor="middle">S</text>' +
  `<text class="vh-n" data-hn="a" x="116" y="127" text-anchor="middle">${svgM("A ∩ B′")}</text>` +
  `<text class="vh-n" data-hn="ab" x="200" y="127" text-anchor="middle">${svgM("A ∩ B")}</text>` +
  `<text class="vh-n" data-hn="b" x="284" y="127" text-anchor="middle">${svgM("A′ ∩ B")}</text>` +
  `<text class="vh-n" data-hn="o" x="200" y="234" text-anchor="middle">${svgM("(A ∪ B)′")}</text>` +
  `<text class="vh-fin" x="200" y="234" text-anchor="middle">${svgM("(A ∪ B)′ = A′ ∩ B′")}</text>` +
  "</svg></div>";

export default {
  id:"04-venn-diagrams",
  kind:"topic",
  title:"Venn diagrams and set operations",
  topic:"Venn Diagrams & Set Operations",
  readyTopic:"Venn diagrams and set operations",
  hero:{
    eq:"`(A ∪ B)′` `= A′ ∩ B′`", eqLabel:"the complement of A union B equals A complement intersect B complement", eqSize:"md",
    headline:"Every region has a name",
    text:"A <strong>Venn diagram</strong> shows the <strong>sample space</strong> as a rectangle and each event as a circle. Set notation names every region: <strong>union</strong> ∪, <strong>intersection</strong> ∩ and <strong>complement</strong> ′. Fill a diagram from the inside out and you can answer any “and”, “or”, “not” or “neither” question by counting.",
    fig:{ html:HERO }
  },
  goals:[
    "I can shade and name the regions of a two-set Venn diagram using ∪, ∩ and ′.",
    "I can translate between words (“`A` but not `B`”, “neither”) and set notation.",
    "I can complete a Venn diagram from survey totals, working from the inside out.",
    "I can use a three-set Venn diagram and the three-set counting formula.",
    "I can find probabilities from a completed Venn diagram.",
    "I can use De Morgan’s laws to rewrite the complement of a union or an intersection."
  ],
  start:{
    warmup:{
      questions:[
        { id:"w1", skill:"“And” vs “or”", goal:2, prompt:"`A = {1, 2, 3, 4}` and `B = {3, 4, 5}`. Which numbers are in `A` <strong>or</strong> `B`?",
          options:[
            { t:"1, 2, 3, 4, 5", ok:true, why:"Everything in at least one set." },
            { t:"3, 4", why:"That’s “and”." },
            { t:"1, 2, 5", why:"That leaves out the overlap." },
            { t:"1, 2, 3, 3, 4, 4, 5", why:"Each number is listed once." }],
          hints:["“Or” means at least one.", "Combine the lists.", "`{1, 2, 3, 4, 5}`."] },
        { id:"w2", skill:"“And” vs “or”", goal:2, prompt:"Same sets. Which numbers are in `A` but <strong>not</strong> in `B`?",
          options:[
            { t:"1, 2", ok:true, why:"In `A`, and not in `B`." },
            { t:"5", why:"That’s `B` but not `A`." },
            { t:"3, 4", why:"Those are in both." },
            { t:"1, 2, 5", why:"That’s “exactly one of them”." }],
          hints:["Start with `A`.", "Remove anything also in `B`.", "`{1, 2}`."] },
        { id:"w3", skill:"Additive principle", goal:3, prompt:"30 students play soccer, 20 play basketball and 8 play both. How many play at least one?",
          options:[
            { t:"42", ok:true, why:"30 + 20 − 8." },
            { t:"50", why:"The 8 are counted twice." },
            { t:"58", why:"That adds the overlap. Subtract it." },
            { t:"34", why:"That subtracts the overlap twice. Once is enough." }],
          hints:["Who’s counted twice in 30 + 20?", "The 8.", "42."] },
        { id:"w4", skill:"Additive principle", goal:3, prompt:"Same group. How many play soccer only?",
          options:[
            { t:"22", ok:true, why:"30 − 8." },
            { t:"30", why:"30 includes the 8 who also play basketball." },
            { t:"12", why:"That’s basketball only." },
            { t:"8", why:"That’s both." }],
          hints:["Who is inside the soccer circle?", "Soccer only, plus both.", "30 − 8 = 22."] },
        { id:"w5", skill:"Complements", goal:5, prompt:"A survey of 50 people finds 42 in at least one club. What is `P`(a random person is in no club)?",
          options:[
            { t:"4/25", ok:true, why:"8 of 50." },
            { t:"21/25", why:"That’s at least one club." },
            { t:"0", why:"8 people are in no club." },
            { t:"8/42", why:"Divide by all 50 people." }],
          hints:["How many are in no club?", "50 − 42 = 8.", "8/50 = 4/25."] },
        { id:"w6", skill:"Complements", goal:6, prompt:"Which phrase means the same as “not both `A` and `B`”?",
          options:[
            { t:"At most one of `A` and `B`", ok:true, why:"Neither, or exactly one." },
            { t:"Neither `A` nor `B`", why:"Neither is stricter: it excludes “exactly one”." },
            { t:"Exactly one of `A` and `B`", why:"Neither is also allowed." },
            { t:"Both `A` and `B`", why:"That’s the opposite." }],
          hints:["What does “not both” rule out?", "Only the overlap.", "Everything else: at most one."] }
      ],
      refreshers:{
        "“And” vs “or”":"“And” = in both (∩). “Or” = in at least one (∪). “But not” removes the other set.",
        "Additive principle":"`n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`; “only” regions are totals minus the overlap.",
        "Complements":"`A′` is everything outside `A`. “Neither” is outside both circles."
      }
    }
  },
  explore:{
    heading:"Venn workbench",
    intro:"Shade regions and see their names, or start from a name and shade it. Then fill diagrams from survey totals.",
    predIntro:"Make a prediction first. Then the workbench will show you what really happens.",
    chalIntro:"Use the workbench to meet each goal, then press <strong>Check challenge</strong>. Each one has three levels of help.",
    predictions:[
      { id:"p1", start:{ sets:2, mode:"shade" },
        prompt:"Which region or regions make up `(A ∪ B)′`?",
        options:[{ t:"Outside both circles", ok:true }, { t:"The overlap" }, { t:"`A` only and `B` only" }, { t:"Everything except the overlap" }],
        explain:"Not in `A` or `B` = in neither." },
      { id:"p2", start:{ sets:2, mode:"shade" },
        prompt:"Which region is `A′ ∩ B`?",
        options:[{ t:"`B` only", ok:true }, { t:"`A` only" }, { t:"The overlap" }, { t:"Outside both" }],
        explain:"Not in `A`, but in `B`." },
      { id:"p3", start:{ mode:"demorgan", law:"int" },
        prompt:"De Morgan mode. `(A ∩ B)′` is the same as …",
        options:[{ t:"`A′ ∪ B′`", ok:true }, { t:"`A′ ∩ B′`" }, { t:"`A ∪ B`" }, { t:"`(A ∪ B)′`" }],
        explain:"Not both = outside the overlap = not `A`, or not `B`." },
      { id:"p4", start:{ sets:3, mode:"shade" },
        prompt:"How many regions does a three-set Venn diagram have, counting the outside?",
        options:[{ t:"8", ok:true }, { t:"7" }, { t:"6" }, { t:"9" }],
        explain:"Each person is in or out of each of 3 sets: 2 × 2 × 2 = 8 (the counting principle from module 02)." }
    ],
    challenges:[
      { id:"tc1", goal:1, prompt:"Three sets, Name → shade: shade exactly `A ∩ B′ ∩ C`.",
        why:"`A ∩ B′ ∩ C` is inside `A` and `C` but outside `B`: the lens where `A` and `C` overlap, without the centre.",
        hints:["Which circles must you be in?", "`A` and `C`, but not `B`.", "The lens where `A` and `C` overlap, minus the centre."] },
      { id:"tc2", goal:3, prompt:"Survey fill, 2 sets: 60 people; 34 have a cat, 25 have a dog, 8 have both. Fill all four regions.",
        why:"Inside out: both 8, cat only 34 − 8 = 26, dog only 25 − 8 = 17, and neither 60 − 51 = 9.",
        hints:["Start in the middle.", "Cat only = 34 − 8; dog only = 25 − 8.", "26 + 8 + 17 = 51, so neither = 9."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Survey fill, 3 sets: 50 students; Robotics 20, Drama 18, Music 22; Robotics and Drama 7, Robotics and Music 8, Drama and Music 6; all three 3. Fill all 8 regions, then answer: how many are in <strong>exactly one</strong> club?",
        why:"Centre 3; exactly two 7 − 3 = 4, 8 − 3 = 5, 6 − 3 = 3; only regions 8, 8 and 11; none 8. Exactly one club: 8 + 8 + 11 = 27.",
        hints:["Centre first: 3.", "Exactly two: 7 − 3, 8 − 3, 6 − 3.", "R only = 20 − 4 − 5 − 3 = 8; D only 8; M only 11: 27."] }
    ],
    // workbench messages (plan §4 Explore: named wrong states)
    msg:{
      tc1Centre:"That’s `A ∩ C`; the centre is in `B`.",
      tc1Aonly:"You also need to be inside `C`.",
      tc2Cat:"34 includes the 8 who also have a dog.",
      tc2Dog:"25 includes the 8 who also have a cat.",
      tc2One:"60 − 59 used the totals instead of the regions.",
      tc2None:"Count the people in no circle.",
      tc3Pairs:"The 7 in Robotics and Drama includes the 3 in all three. Fill “exactly two” as 7 − 3 = 4 first.",
      tc3At:"That’s at least one club.",
      tc3Add:"That adds the club totals."
    },
    surveys:{
      "2":{ total:60, letters:["A", "B"], names:["has a cat", "has a dog"],
        intro:"60 people: 34 have a cat, 25 have a dog, 8 have both.",
        given:[{ lab:"`n(A)`", codes:["a", "ab"], v:34 }, { lab:"`n(B)`", codes:["b", "ab"], v:25 }, { lab:"`n(A ∩ B)`", codes:["ab"], v:8 }] },
      "3":{ total:50, letters:["R", "D", "M"], names:["Robotics", "Drama", "Music"],
        intro:"50 students: Robotics 20, Drama 18, Music 22; Robotics and Drama 7, Robotics and Music 8, Drama and Music 6; all three 3.",
        given:[{ lab:"`n(R)`", codes:["a", "ab", "ac", "abc"], v:20 }, { lab:"`n(D)`", codes:["b", "ab", "bc", "abc"], v:18 }, { lab:"`n(M)`", codes:["c", "ac", "bc", "abc"], v:22 },
          { lab:"`n(R ∩ D)`", codes:["ab", "abc"], v:7 }, { lab:"`n(R ∩ M)`", codes:["ac", "abc"], v:8 }, { lab:"`n(D ∩ M)`", codes:["bc", "abc"], v:6 }, { lab:"`n(R ∩ D ∩ M)`", codes:["abc"], v:3 }] }
    },
    // Name → shade: "New expression" cycles through these
    targets:{
      "2":["A ∩ B′", "(A ∪ B)′", "A′ ∪ B", "(A ∩ B)′", "A ∪ B′", "(A ∩ B′) ∪ (A′ ∩ B)"],
      "3":["A ∩ B′ ∩ C", "(A ∪ B) ∩ C′", "A ∩ (B ∪ C)", "(A ∪ B ∪ C)′", "A′ ∩ B′ ∩ C", "(A ∩ B) ∪ (A ∩ C) ∪ (B ∩ C)"]
    },
    // De Morgan mode: the two laws side by side
    laws:{
      uni:{ left:"(A ∪ B)′", right:"A′ ∩ B′", inner:"A ∪ B", first:["a", "b", "ab"], res:["o"], rule:"where both hatchings cross", same:"outside both circles" },
      int:{ left:"(A ∩ B)′", right:"A′ ∪ B′", inner:"A ∩ B", first:["ab"], res:["a", "b", "o"], rule:"anywhere with at least one hatching", same:"everything except the overlap" }
    }
  },
  part3:{
    slug:"three-sets", name:"Three sets",
    heading:"Three-set puzzles",
    intro:"Three sets are where working from the inside out really pays off. Fill a three-set diagram in order, watch the formula count each region, then read probabilities from the finished diagram.",
    letters:["X", "Y", "Z"], total:80,
    st1:{ title:"Station 1: inside out",
      text:MODEL + "A survey of 80 people and three streaming services: X 40, Y 35, Z 30; X and Y 15, X and Z 12, Y and Z 10; all three 5. Fill the regions in order: the centre, then “exactly two”, then “only”, then none.",
      steps:[
        { id:"f1", code:"abc", prompt:"The centre: how many use all three services?", answer:5, why:"The survey gives it: 5 use all three." },
        { id:"f2", code:"ab", prompt:"X and Y only (not Z)", answer:10, why:"15 − 5 = 10: the 15 who use X and Y include the 5 in the centre.",
          wrong:[{ match:15, fb:"The 15 who use X and Y include the 5 in the centre. Take the centre out first." }] },
        { id:"f3", code:"ac", prompt:"X and Z only (not Y)", answer:7, why:"12 − 5 = 7.",
          wrong:[{ match:12, fb:"The 12 who use X and Z include the 5 in the centre. Take the centre out first." }] },
        { id:"f4", code:"bc", prompt:"Y and Z only (not X)", answer:5, why:"10 − 5 = 5.",
          wrong:[{ match:10, fb:"The 10 who use Y and Z include the 5 in the centre. Take the centre out first." }] },
        { id:"f5", code:"a", prompt:"X only", answer:18, why:"40 − 10 − 7 − 5 = 18: take away every region inside X that’s already filled.",
          wrong:[{ match:40, fb:"40 is everyone inside X, including its overlaps." }, { match:13, fb:"40 − 15 − 12 takes the centre away twice. Use the regions you’ve filled: 10, 7 and 5." }] },
        { id:"f6", code:"b", prompt:"Y only", answer:15, why:"35 − 10 − 5 − 5 = 15.",
          wrong:[{ match:35, fb:"35 is everyone inside Y, including its overlaps." }, { match:10, fb:"35 − 15 − 10 takes the centre away twice. Use the regions you’ve filled: 10, 5 and 5." }] },
        { id:"f7", code:"c", prompt:"Z only", answer:13, why:"30 − 7 − 5 − 5 = 13.",
          wrong:[{ match:30, fb:"30 is everyone inside Z, including its overlaps." }, { match:8, fb:"30 − 12 − 10 takes the centre away twice. Use the regions you’ve filled: 7, 5 and 5." }] },
        { id:"f8", code:"o", prompt:"None of the three", answer:7, why:"The seven regions inside the circles hold 73 people, so 80 − 73 = 7 use none.",
          wrong:[{ match:0, fb:M4 }, { match:-25, fb:"80 − 40 − 35 − 30 uses the totals instead of the regions. Add the seven regions you’ve filled." }] }
      ] },
    st2:{ title:"Station 2: why the formula adds the centre back",
      text:"Step through the formula `n(X ∪ Y ∪ Z)` `= n(X) + n(Y) + n(Z)` `- n(X ∩ Y) - n(X ∩ Z)` `- n(Y ∩ Z)` `+ n(X ∩ Y ∩ Z)`. Each region shows how many times it has been counted so far." },
    st3:{ title:"Station 3: probabilities from the diagram",
      text:"A person is chosen at random from the 80. Choose a question, shade the regions that answer it, then type the probability. Every probability is a count ÷ `n(S)` = 80.",
      qs:[
        { id:"x", t:"uses X", answer:["a", "ab", "ac", "abc"] },
        { id:"yz", t:"uses Y or Z", answer:["b", "c", "ab", "ac", "bc", "abc"] },
        { id:"one", t:"uses exactly one service", answer:["a", "b", "c"] },
        { id:"zx", t:"uses Z but not X", answer:["c", "bc"] },
        { id:"most1", t:"uses at most one service", answer:["a", "b", "c", "o"] },
        { id:"all", t:"uses all three", answer:["abc"] }
      ] },
    quickCheck:{
      title:"Quick check", summary:"Three-set puzzles quick check", intro:"These questions use the finished diagram from station 1.",
      items:[
        { id:"q1", goal:4, prompt:"How many use exactly two services?",
          choices:[{ t:"22", ok:true }, { t:"37" }, { t:"27" }, { t:"15" }],
          right:"Right. 10 + 7 + 5 = 22.", wrong:"10 + 7 + 5. 37 forgets that each pair total includes the 5 in the centre." },
        { id:"q2", goal:5, prompt:"`P`(a random person uses none)?",
          choices:[{ t:"7/80", ok:true }, { t:"0" }, { t:"73/80" }, { t:"7/73" }],
          right:"Right. 7 of the 80 people use none.", wrong:"Divide by all 80 people." },
        { id:"q3", goal:2, prompt:"How many use X but not Y?",
          choices:[{ t:"25", ok:true }, { t:"18" }, { t:"40" }, { t:"15" }],
          right:"Right. X only (18) plus X and Z only (7).", wrong:"X only (18) plus X and Z only (7)." },
        { id:"q4", goal:4, prompt:"Which counts everyone in at least one service exactly once?",
          choices:[{ t:"The three totals − the pairs + the centre", ok:true }, { t:"The three totals" }, { t:"The three totals − the pairs" }, { t:"The three totals − the pairs − the centre" }],
          right:"Right. After the pairs come off, the centre isn’t counted at all, so it’s added back once.", wrong:"Subtracting the pairs removes the centre completely; add it back." }
      ]
    }
  },
  practice:{
    activities:[
      { id:"region", type:"match", title:"Name the region", summary:"Name the region", goal:[1, 2, 6],
        instruction:"Match each shaded picture with its set notation.",
        how:"Tap a picture on the left, then tap its notation on the right.",
        leftTitle:"Shaded picture", rightTitle:"Notation",
        left:[
          { id:"l1", t:mini(["a"], "`A` only"), goal:1 },
          { id:"l2", t:mini(["b"], "`B` only"), goal:1 },
          { id:"l3", t:mini(["ab"], "The overlap"), goal:1 },
          { id:"l4", t:mini(["o"], "Outside both circles"), goal:6 },
          { id:"l5", t:mini(["a", "ab", "b"], "Both circles, entirely"), goal:1 },
          { id:"l6", t:mini(["a", "b", "o"], "Everything except the overlap"), goal:6 },
          { id:"l7", t:mini(["a", "b"], "Exactly one circle (both crescents)"), goal:2,
            hints:["Which regions are in exactly one circle?", "`A` only and `B` only.", "Join them with ∪."] },
          { id:"l8", t:mini(["b", "o"], "Everything outside `A`"), goal:1 }
        ],
        right:[
          { id:"r1", t:"`A ∩ B′`" }, { id:"r2", t:"`A′ ∩ B`" }, { id:"r3", t:"`A ∩ B`" }, { id:"r4", t:"`A′ ∩ B′`" },
          { id:"r5", t:"`A ∪ B`" }, { id:"r6", t:"`(A ∩ B)′`" }, { id:"r7", t:"`(A ∩ B′) ∪ (A′ ∩ B)`" }, { id:"r8", t:"`A′`" }
        ],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{
          "l4|r6":"That also includes the two crescents. “Outside both” is `A′ ∩ B′`.",
          "l1|r3":"The overlap is in `B`.",
          "l5|r3":"∪ is “or”."
        },
        wrongDefault:"Read the notation as words, then shade." },
      { id:"survey", type:"numeric", title:"Survey solver", summary:"Survey solver", star:true, goal:[3, 4, 5],
        instruction:"Work from the inside out. The last problems need the three-set formula, and one runs backwards.",
        how:"Type a whole number, or a probability as a fraction such as 3/4, then press Check.",
        items:[
          { id:"s1", goal:3, prompt:MODEL + "80 people: 45 like hockey, 38 like basketball, 12 like neither. How many like both?", answer:15, display:"15",
            why:"80 − 12 = 68 like at least one, so both = 45 + 38 − 68 = 15.",
            wrong:[{ match:3, fb:"Use the 68 who like at least one: 45 + 38 − 68." }],
            hints:["How many like at least one of the two sports?", "80 − 12 = 68.", "45 + 38 − 68 = 15."] },
          { id:"s2", goal:3, prompt:"Same survey: how many like hockey only?", answer:30, display:"30",
            why:"45 − 15 = 30: the 45 include the 15 who also like basketball.",
            wrong:[{ match:45, fb:"The 45 who like hockey include the ones who also like basketball. Take the overlap out." }],
            hints:["Who is inside the hockey circle?", "Hockey only, plus both.", "45 − 15 = 30."] },
          { id:"s3", goal:4, star:true, prompt:MODEL + "100 students: French 45, Art 40, Coding 35; French and Art 15, French and Coding 12, Art and Coding 10; all three 4. How many take none?", answer:13, display:"13",
            why:"45 + 40 + 35 − 15 − 12 − 10 + 4 = 87 take at least one, so 100 − 87 = 13 take none.",
            wrong:[{ match:21, fb:"Add the centre back: 45 + 40 + 35 − 15 − 12 − 10 + 4 = 87." }],
            hints:["First find how many take at least one course.", "Totals − pairs + centre.", "45 + 40 + 35 − 15 − 12 − 10 + 4 = 87, and 100 − 87 = 13."] },
          { id:"s4", goal:4, star:true, prompt:"Same survey: how many take exactly one of the three?", answer:58, display:"58",
            why:"Exactly two: 11, 8 and 6. French only 45 − 11 − 8 − 4 = 22, Art only 19, Coding only 17: 22 + 19 + 17 = 58.",
            wrong:[{ match:46, fb:"Fill “exactly two” first (11, 8, 6). French only = 45 − 11 − 8 − 4 = 22; Art only 19; Coding only 17." }],
            hints:["Fill from the centre out.", "Exactly two: 15 − 4 = 11, 12 − 4 = 8, 10 − 4 = 6.", "22 + 19 + 17 = 58."] },
          { id:"s5", goal:5, star:true, prompt:"Same survey: `P`(a random student takes exactly two)?", answer:0.25, tol:5e-5, display:"1/4",
            why:"Exactly two: 11 + 8 + 6 = 25 of the 100 students, so 25/100 = 1/4.",
            wrong:[{ match:0.37, fb:"Pair totals include the centre: 11 + 8 + 6 = 25." }],
            hints:["Which regions hold “exactly two”?", "Each pair total minus the centre: 15 − 4, 12 − 4, 10 − 4.", "11 + 8 + 6 = 25, so 25/100 = 1/4."] },
          { id:"s6", goal:4, star:true, prompt:"40 people each play at least one of three sports: 20 basketball, 18 volleyball, 16 soccer; 6 basketball and volleyball, 5 basketball and soccer, 7 volleyball and soccer. How many play all three?", answer:4, display:"4",
            why:"The union is 40, so 40 = 20 + 18 + 16 − 6 − 5 − 7 + `x` = 36 + `x`, and `x` = 4.",
            wrong:[{ match:0, fb:"Use the formula backwards: 40 = 54 − 18 + `x`." }],
            hints:["Everyone is in at least one sport, so the union is 40.", "40 = 20 + 18 + 16 − 6 − 5 − 7 + `x`.", "40 = 36 + `x`, so `x` = 4."] }
        ] },
      { id:"spot", type:"spot", title:"Spot the error", student:"Delphine", how:"", goal:[3, 4, 6],
        instruction:"Delphine made one mistake in each solution. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:3, task:"70 students: 40 take Chemistry, 30 take Physics, 12 take both. Complete the Venn diagram.",
            steps:["Put 12 in the overlap.", "Put 40 in “Chemistry only” and 30 in “Physics only”.", "Neither: 70 − 40 − 30 − 12 = −12.", "A negative count means the data must be wrong."],
            answer:1,
            stepFb:["Step 1 is correct.", "", "Step 3 follows step 2. Look earlier.", "The data is fine. Look earlier."],
            fixes:[
              { t:"Chemistry only = 40 − 12 = 28 and Physics only = 30 − 12 = 18; neither = 70 − 58 = 12.", ok:true, why:"The 40 Chemistry students include the 12 who also take Physics, so “Chemistry only” is 40 − 12 = 28." },
              { t:"Put 40 − 30 = 10 in Chemistry only.", why:"That subtracts the wrong total." },
              { t:"Leave out the overlap.", why:"The overlap belongs in the diagram." },
              { t:"Step 2 is correct.", why:"40 includes the 12 who take both." }],
            hints:["Who is inside the Chemistry circle?", "Chemistry only, plus both.", "28, 12, 18; neither 12."] },
          { id:"e2", goal:6, task:"`B` = owns a bike, `K` = owns a skateboard. Write “does not own a bike or a skateboard” in set notation.",
            steps:["“Owns a bike or a skateboard” is `B ∪ K`.", "“Does not own a bike or a skateboard” is `(B ∪ K)′`.", "By De Morgan, `(B ∪ K)′ = B′ ∪ K′`.", "So these are people missing at least one of the two."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows step 3. Look earlier."],
            fixes:[
              { t:"`(B ∪ K)′ = B′ ∩ K′`: people who own neither.", ok:true, why:"“Not (`B` or `K`)” means in neither: `B′ ∩ K′`. The ∪ flips to ∩." },
              { t:"`(B ∪ K)′ = B ∩ K`.", why:"That’s owning both." },
              { t:"`(B ∪ K)′ = B′`.", why:"That ignores skateboards." },
              { t:"Step 3 is correct.", why:"The complement flips ∪ to ∩." }],
            hints:["Shade `(B ∪ K)′`.", "Only the outside region.", "That’s `B′ ∩ K′`."] },
          { id:"e3", goal:4, task:"`n(A) = 25`, `n(B) = 20`, `n(C) = 15`; each pairwise overlap is 6; the triple overlap is 2. Find `n(A ∪ B ∪ C)`.",
            steps:["Add the three sets: 25 + 20 + 15 = 60.", "Subtract the pairwise overlaps: 60 − 18 = 42.", "Subtract the triple overlap: 42 − 2 = 40.", "So 40 are in at least one set."],
            answer:2,
            stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 follows. Look earlier."],
            fixes:[
              { t:"Add the centre back: 42 + 2 = 44. Subtracting the three pairs removed the centre three times after adding it three times.", ok:true, why:M5 },
              { t:"Stop at 42.", why:"Then the centre isn’t counted at all." },
              { t:"Use 60 − 2 = 58.", why:"The pairwise overlaps must come off too." },
              { t:"Step 3 is correct.", why:"The formula ends with + `n(A ∩ B ∩ C)`." }],
            hints:["How many times is the centre counted after step 2?", "3 − 3 = 0 times.", "Add it back: 44."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What surprised you in the De Morgan view: that “not both” and “neither” are different?" },
      { id:"j2", q:"In your own words, why do we fill a Venn diagram from the inside out?" },
      { id:"j3", q:"Explain to a friend why the three-set formula adds the centre back." },
      { id:"j4", q:"Which notation still slows you down: ∪, ∩ or ′? How will you practise reading it as words?" }
    ]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"In a two-set Venn diagram, which region is `A ∩ B′`?", options:[
          { t:"In `A` but not in `B`", ok:true, why:M6 },
          { t:"In both `A` and `B`", why:"That’s `A ∩ B`." },
          { t:"In `B` but not in `A`", why:"That’s `A′ ∩ B`." },
          { t:"In neither", why:"That’s `A′ ∩ B′`." }] },
        b:{ prompt:"Which region is `A′ ∩ B`?", options:[
          { t:"In `B` but not in `A`", ok:true, why:"Outside `A` and inside `B`: `B` only." },
          { t:"In both `A` and `B`", why:"That’s `A ∩ B`. The ′ on `A` means outside `A`." },
          { t:"In `A` but not in `B`", why:"That’s `A ∩ B′`. Here the ′ is on `A`." },
          { t:"In neither", why:"That’s `A′ ∩ B′`." }] } },
      { id:"k2", cat:"K", goal:6,
        a:{ prompt:"Which expression is equivalent to `(A ∪ B)′`?", options:[
          { t:"`A′ ∩ B′`", ok:true, why:"Not either = neither." },
          { t:"`A′ ∪ B′`", why:"That’s “not both”. " + M3 },
          { t:"`A ∩ B`", why:"That’s “both”." },
          { t:"`(A ∩ B)′`", why:"That’s “not both”, too. " + M3 }] },
        b:{ prompt:"Which expression is equivalent to `(A ∩ B)′`?", options:[
          { t:"`A′ ∪ B′`", ok:true, why:"Not both = not `A` or not `B`." },
          { t:"`A′ ∩ B′`", why:"That’s “neither”." },
          { t:"`A ∪ B`", why:"That’s “either”." },
          { t:"`(A ∪ B)′`", why:"That’s “neither”, too. The complement flips ∩ to ∪." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"Which notation means “in at least one of `A` and `B`”?", options:[
          { t:"`A ∪ B`", ok:true, why:"∪ is “or”: everything in either circle." },
          { t:"`A ∩ B`", why:"That’s “in both”. " + M2 },
          { t:"`(A ∪ B)′`", why:"That’s “in neither”." },
          { t:"`A ∩ B′`", why:"That’s “`A` only”." }] },
        b:{ prompt:"Which notation means “in both `A` and `B`”?", options:[
          { t:"`A ∩ B`", ok:true, why:"∩ is “and”: only the overlap." },
          { t:"`A ∪ B`", why:M2 },
          { t:"`(A ∩ B)′`", why:"That’s “not both”." },
          { t:"`A′ ∩ B`", why:"That’s “`B` only”." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"95 people: 50 drink coffee, 40 drink tea, 15 drink both. How many drink coffee only?", options:[
          { t:"35", ok:true, why:"50 − 15." },
          { t:"50", why:"50 includes the 15 who drink both." },
          { t:"25", why:"That’s tea only." },
          { t:"20", why:"That’s the number who drink neither: 95 − 75." }] },
        b:{ prompt:"100 people: 60 cycle, 45 swim, 20 do both. How many swim only?", options:[
          { t:"25", ok:true, why:"45 − 20." },
          { t:"45", why:"45 includes the 20 who do both." },
          { t:"40", why:"That’s cycle only." },
          { t:"15", why:"That’s neither: 100 − 85." }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"`n(A) = 30`, `n(B) = 25`, `n(C) = 20`, `n(A ∩ B) = 10`, `n(A ∩ C) = 8`, `n(B ∩ C) = 6`, `n(A ∩ B ∩ C) = 4`. Find `n(A ∪ B ∪ C)`.", options:[
          { t:"55", ok:true, why:"75 − 24 + 4." },
          { t:"47", why:"The centre is added back, not subtracted." },
          { t:"51", why:"Without adding the centre back, it isn’t counted at all." },
          { t:"75", why:"That counts every overlap more than once." }] },
        b:{ prompt:"`n(A) = 28`, `n(B) = 22`, `n(C) = 18`, `n(A ∩ B) = 9`, `n(A ∩ C) = 7`, `n(B ∩ C) = 5`, `n(A ∩ B ∩ C) = 3`. Find `n(A ∪ B ∪ C)`.", options:[
          { t:"50", ok:true, why:"68 − 21 + 3." },
          { t:"44", why:"The centre is added back, not subtracted." },
          { t:"47", why:"Without adding the centre back, it isn’t counted at all." },
          { t:"68", why:"That counts overlaps more than once." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"A survey of 60 people: `n(A) = 30`, `n(B) = 25`, `n(C) = 20`, `n(A ∩ B) = 10`, `n(A ∩ C) = 8`, `n(B ∩ C) = 6`, `n(A ∩ B ∩ C) = 4`. What is `P`(a random person is in exactly one set)?", options:[
          { t:"13/20", ok:true, why:"`A` only 16, `B` only 13, `C` only 10: 39 of 60." },
          { t:"11/12", why:"55/60 is “at least one”." },
          { t:"39/55", why:"Divide by all 60 people." },
          { t:"9/20", why:"“Only” regions must add the centre back: 30 − 10 − 8 + 4 = 16, not 12." }] },
        b:{ prompt:"A survey of 60 people: `n(A) = 28`, `n(B) = 22`, `n(C) = 18`, `n(A ∩ B) = 9`, `n(A ∩ C) = 7`, `n(B ∩ C) = 5`, `n(A ∩ B ∩ C) = 3`. What is `P`(exactly one set)?", options:[
          { t:"7/12", ok:true, why:"`A` only 15, `B` only 11, `C` only 9: 35 of 60." },
          { t:"5/6", why:"50/60 is “at least one”." },
          { t:"7/10", why:"35/50 divides by the union." },
          { t:"13/30", why:"26/60 forgets to add the centre back in each “only” region." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"`S` = plays soccer, `G` = plays golf. Which sentence describes `(S ∪ G)′`?", options:[
          { t:"“People who play neither soccer nor golf.”", ok:true, why:"Not (`S` or `G`) means in neither: `S′ ∩ G′`." },
          { t:"“People who don’t play both.”", why:"That’s `(S ∩ G)′`." },
          { t:"“People who play exactly one of the two.”", why:"That’s the two crescents." },
          { t:"“People who play both.”", why:"That’s `S ∩ G`." }] },
        b:{ prompt:"Which sentence describes `(S ∩ G)′`?", options:[
          { t:"“People who don’t play both: they play at most one of the two.”", ok:true, why:"Not both = outside the overlap: `S′ ∪ G′`." },
          { t:"“People who play neither.”", why:"That’s `(S ∪ G)′`." },
          { t:"“People who play exactly one.”", why:"Neither is included too." },
          { t:"“People who play both.”", why:"That’s `S ∩ G`." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"What is the best first step for completing a two-set Venn diagram from totals?", options:[
          { t:"“Put the ‘both’ count in the overlap, then subtract it from each total to get the ‘only’ regions.”", ok:true, why:"Inside out: the overlap first, then each “only” region, then “neither”." },
          { t:"“Put each total in its ‘only’ region.”", why:"Each total includes the overlap, so the overlap would be counted twice." },
          { t:"“Start with the ‘neither’ region.”", why:"You need the other regions to find it." },
          { t:"“Divide the total by 4, one share per region.”", why:"Regions aren’t equal." }] },
        b:{ prompt:"What is the best order for completing a three-set Venn diagram?", options:[
          { t:"“The centre (all three), then the ‘exactly two’ regions, then the ‘only’ regions, then ‘none’.”", ok:true, why:"Inside out: each step uses only regions that are already filled." },
          { t:"“The ‘only’ regions first, using the set totals.”", why:"A set total includes its overlaps, so it can’t go straight into an “only” region." },
          { t:"“‘None’ first, then the centre.”", why:"“None” needs everything else first." },
          { t:"“Each pairwise total goes straight into its ‘exactly two’ region.”", why:"Each pairwise total includes the centre." }] } },
      { id:"a1", cat:"A", goal:3,
        a:{ prompt:"Model data: a gym has 200 members; 120 use the weights, 90 use the pool, 50 use both. What is `P`(a member uses neither)?", options:[
          { t:"1/5", ok:true, why:"120 + 90 − 50 = 160 use at least one; 40 of 200." },
          { t:"0", why:"Not every member uses one of these." },
          { t:"1/4", why:"50/200 is “both”." },
          { t:"9/20", why:"90/200 forgets the 50 who use both." }] },
        b:{ prompt:"Model data: 300 members; 160 run, 120 cycle, 70 do both. What is `P`(neither)?", options:[
          { t:"3/10", ok:true, why:"160 + 120 − 70 = 210; 90 of 300." },
          { t:"0", why:M4 },
          { t:"7/30", why:"70/300 is “both”." },
          { t:"8/15", why:"160/300 forgets the 70 who do both." }] } },
      { id:"a2", cat:"A", goal:4,
        a:{ prompt:"40 people all listen to at least one of podcasts, radio and audiobooks: 22 podcasts, 18 radio, 15 audiobooks; 7 podcasts and radio, 6 podcasts and audiobooks, 5 radio and audiobooks. How many listen to all three?", options:[
          { t:"3", ok:true, why:"40 = 55 − 18 + `x`." },
          { t:"15", why:"55 − 40 forgets to subtract the pairs." },
          { t:"0", why:"Assuming nobody is in all three doesn’t make the total 40." },
          { t:"33", why:"The pairs are subtracted, not added." }] },
        b:{ prompt:"50 people are each in at least one of three clubs: 25, 20 and 18 members; the pairs share 8, 6 and 5. How many are in all three?", options:[
          { t:"6", ok:true, why:"50 = 63 − 19 + `x`." },
          { t:"13", why:"63 − 50 forgets to subtract the pairs." },
          { t:"0", why:"Then the total would be 44, not 50." },
          { t:"32", why:"The pairs are subtracted, not added." }] } }
    ]
  },
  task:{
    title:"Club census", summary:"Club census",
    statement:"<p>" + MODEL + "60 students and three clubs (Robotics, Drama, Music). The census already knows: Robotics only 12, Drama only 9, Music only 10, all three 3, no club 8. You choose the three “exactly two” regions. Make every condition true. Can you find all the answers?</p>" +
      '<ol class="vw-conds"><li>The diagram accounts for all 60 students.</li><li>Robotics and Music have the same number of members.</li><li>`P`(a random student is in Drama) is at least 5/12.</li></ol>',
    checks:["All 60 students counted", "Robotics and Music equal", "`P`(Drama) ≥ 5/12"],
    tips:["The known regions add to 42, so the three you choose must add to 18.", "Write each club total from its four regions; `y` is in both Robotics and Music, so it cancels.", "5/12 of 60 is 25: Drama needs `x + z ≥ 13`."],
    explainPrompt:"Explain how you turned each condition into an equation or inequality about the regions.",
    vocab:"Use the words region, intersection, union and complement.",
    more:"There’s more than one answer. Can you find them all?",
    after3:"Conditions 1 and 2 give `y = 16 - 2x`, and condition 3 gives `x ≥ 6`. `y` can’t be negative, so `x ≤ 8`."
  },
  cards:[
    ["`A ∪ B`", "Union: in `A` or `B` or both."],
    ["`A ∩ B`", "Intersection: in both."],
    ["`A′`", "Complement: not in `A`."],
    ["`A ∩ B′`", "In `A` but not in `B` (“`A` only”)."],
    ["`(A ∪ B)′`", "Neither: = `A′ ∩ B′` (De Morgan)."],
    ["`(A ∩ B)′`", "Not both, at most one: = `A′ ∪ B′` (De Morgan)."],
    ["Inside out", "Fill the overlap first, then “only” regions, then “neither”."],
    ["“Only” region", "Total for the set minus everything shared."],
    ["Three-set regions", "8, including the outside."],
    ["Three-set formula", "Totals − pairs + centre."],
    ["Why + centre?", "It’s added 3 times and subtracted 3 times, so it needs adding back once."],
    ["Probability from a Venn", "Region count ÷ `n(S)`, the whole rectangle."]
  ]
};
