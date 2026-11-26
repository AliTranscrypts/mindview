// HFA4U 10 Eating Disorders. Source: /Users/ali/Desktop/MV/Modules/hfa4u/plan/modules/10-eating-disorders.md
// Course plan §2 at its strictest: no numbers attached to eating or bodies, no descriptions of behaviours or methods, no body
// images (icons are abstract circles, cards and speech bubbles), and no moral food language except in the fictional
// diet-culture captions students critique. Nothing asks about the student's own eating or body.
// Teacher notes (plan, before scheduling): tell student services first; any student can switch to the shorter path
// (Start → Settings: Part 3 plus a C/A-only Final Check) without giving a reason; journals stay on the device and are left out
// of the summary unless the student opts in; follow the board's protocol if a student discloses. A clinician or school mental
// health lead should review the student-facing text before release (plan §6).
// Lines marked VERIFY carry the plan's "verify before release" flags and every source or detail the builder supplied.
// Lines marked AUTHORED are student-facing text the plan doesn't give word for word (flagged in the build report).

// VERIFY: Kids Help Phone (1-800-668-6868, text CONNECT to 686868) and NEDIC helpline (1-866-633-4220) numbers and hours.
const SUPPORT_TXT = "If food, eating or body image is weighing on you, or you’re worried about someone, you’re not alone. Talk to someone you trust: a parent, a teacher, a school counsellor or your doctor. You can also contact <strong>Kids Help Phone</strong>, <span class=\"nw\">1-800-668-6868</span> or text CONNECT to <span class=\"nw\">686868</span>, any time, or the <strong>National Eating Disorder Information Centre (NEDIC)</strong> helpline, <span class=\"nw\">1-866-633-4220</span>. If you are in danger, call 911.";
const SUPPORT = '<div class="hfa-support ed-sup" role="note"><p>' + SUPPORT_TXT + "</p></div>";

// Misconception core sentences (plan §3)
const M1 = "Eating disorders affect people of every size. Body size doesn’t show what someone is going through.";
const M2 = "People of every gender, age, culture and income can develop eating disorders. Boys and men are often missed.";
const M3 = "Eating disorders are serious mental illnesses with biological, psychological and social causes. No one chooses them.";
const M4 = "Binge-eating disorder is a recognized illness involving loss of control and distress; willpower isn’t the issue.";
const M5 = "Talk about the person and how they seem, not their weight or food. Comments on bodies can make things worse.";
const M6 = "When you’re worried about someone’s health or safety, telling a trusted adult is caring, not betrayal.";
const M7 = "Moral labels attach guilt to eating. Describing food plainly is healthier for everyone.";

export default {
  id:"10-eating-disorders",
  kind:"topic",
  title:"Eating disorders",
  topic:"Eating Disorders",
  readyTopic:"the rest of this module",
  support:SUPPORT_TXT,
  hero:{
    headline:"Serious illnesses. Real recovery. You can help.",
    text:"<strong>Eating disorders</strong> are serious mental illnesses that affect the body and mind. They come from a <strong>mix of factors</strong>, not a single cause and never a choice. They affect people of <strong>every gender, culture and body size</strong>. With <strong>early help</strong> and <strong>support</strong>, people recover. This module is about understanding, supporting others and questioning the messages around us.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later. This module includes the support note above. You can return to it any time from the header.",
    fig:{ html:'<div class="ed-hero" id="ed-hero"></div>', caption:"" },
    circles:["Biology", "Mind", "World around us"], overlap:"risk is a mix",
    cards:["early help", "supportive people", "media literacy", "recovery is possible"],
    caption:"Understanding → support → help → recovery.",
    aria:"Three circles labelled Biology, Mind and World around us slide together until they overlap. The shared centre glows softly and is labelled “risk is a mix”. Beneath them, four small cards appear one at a time: early help, supportive people, media literacy, recovery is possible."
  },
  goals:[
    "I can describe the main types of eating disorders (anorexia nervosa, bulimia nervosa, binge-eating disorder, ARFID) by their effects and general warning signs.",
    "I can explain how biological, psychological and social factors combine to raise risk, and name protective factors.",
    "I can correct common myths, including that you can tell by looking at someone.",
    "I can choose supportive ways to talk with a friend I’m worried about, and know when and how to involve a trusted adult.",
    "I can critically analyse diet-culture messages in media and explain who benefits from them.",
    "I can evaluate prevention strategies and reliable sources of help."
  ],
  // Settings (plan build notes: Sam's pronoun; the teacher alternative path). AUTHORED: the labels and the note.
  settings:{
    title:"Settings",
    intro:"Choose the pronoun for <strong>Sam</strong>, the friend in the Explore conversation. Sam can be any gender.",
    pron:[{ id:"they", t:"they/them" }, { id:"she", t:"she/her" }, { id:"he", t:"he/him" }],
    pathIntro:"If this topic is hard for you right now, you can switch to a shorter path at any time: <strong>Media</strong> (Part 3) and a short Final Check. You don’t need to give a reason.",
    paths:[{ id:"full", t:"Full module" }, { id:"alt", t:"Shorter path: Media and a short Final Check" }],
    altNote:"You’re on the shorter path. The Explore part and the Practice part are hidden, and the Final Check has its Communication and Application questions only. Switch back here any time.",
    reload:"Switching paths reloads the page. Your saved work stays."
  },
  start:{
    blocks:[{ title:"Settings", html:'<div id="ed-settings"></div>' }],
    warmup:{
      questions:[
        { id:"w1", skill:"Mental health basics", goal:2,
          prompt:"Which statement best describes mental illness?",
          options:[
            { t:"A health condition affecting thoughts, feelings or behaviour, with biological, psychological and social causes", ok:true, why:"Like physical illnesses, mental illnesses have real causes and real treatments." },
            { t:"A sign of personal weakness", why:"Illness isn’t weakness." },
            { t:"Something people can simply decide to stop", why:"It’s not a choice." },
            { t:"Something that only happens to adults", why:"Mental illnesses often begin in childhood or adolescence." }],
          hints:["Think of how we describe physical illness.", "Causes can be biological, psychological and social.", "A health condition with several causes."] },
        { id:"w2", skill:"Mental health basics", goal:6,
          prompt:"Which person is a trained professional who can help with mental health concerns?",
          options:[
            { t:"A school counsellor, family doctor or psychologist", ok:true, why:"They can listen, assess and connect people to care." },
            { t:"A fitness influencer", why:"Not trained in mental health care." },
            { t:"An app that counts food", why:"Not a source of care, and can be unhelpful." },
            { t:"Any friend who has read about it online", why:"Friends support; professionals treat." }],
          hints:["Who is trained to assess and treat?", "Look for professional roles.", "Counsellor, doctor or psychologist."] },
        { id:"w3", skill:"Media literacy", goal:5,
          prompt:"A post advertises a product with the line “Get the body you deserve.” What is the main persuasive technique?",
          options:[
            { t:"It suggests your worth depends on your body, to sell a product", ok:true, why:"It links self-worth to appearance to create a need." },
            { t:"It gives scientific evidence", why:"There’s no evidence in the line." },
            { t:"It’s a neutral description", why:"It’s designed to persuade." },
            { t:"It’s a health guideline", why:"Guidelines come from health authorities, not ads." }],
          hints:["What feeling is the line trying to create?", "What is being sold?", "Worth linked to body, to sell."] },
        { id:"w4", skill:"Media literacy", goal:5,
          prompt:"Which question is most useful when judging a nutrition claim online?",
          options:[
            // AUTHORED: the feedback on the correct option (the plan gives none)
            { t:"Who made this, what’s their evidence, and do they profit from my belief?", ok:true, why:"Source, evidence and profit: the three checks that matter." },
            { t:"How many likes does it have?", why:"Popularity isn’t accuracy." },
            { t:"Does the person look healthy?", why:"Appearance isn’t evidence." },
            { t:"Is it posted often?", why:"Repetition isn’t truth." }],
          hints:["Think about source and evidence.", "And who benefits.", "Who, what evidence, and profit."] },
        { id:"w5", skill:"Supportive communication", goal:4,
          prompt:"A friend seems quieter than usual. Which opener is most supportive?",
          options:[
            { t:"“I’ve noticed you seem down lately, and I care about you. Want to talk?”", ok:true, why:"An “I” statement, specific, caring and open." },
            { t:"“What’s wrong with you?”", why:"Sounds blaming." },
            { t:"“Everyone’s noticed you’re acting weird.”", why:"Shaming and public." },
            { t:"“You need to cheer up.”", why:"Dismisses feelings." }],
          // The plan's third hint names the option by letter; options are reordered at build time, so it quotes the opener.
          hints:["Start with what you’ve noticed and that you care.", "Use “I”, not “you’re…”.", "“I’ve noticed you seem down lately, and I care about you. Want to talk?”"] },
        { id:"w6", skill:"Supportive communication", goal:4,
          prompt:"When is it right to tell a trusted adult about a friend’s struggle, even if they asked you not to?",
          options:[
            { t:"When you’re worried about their health or safety", ok:true, why:"Their safety matters more than keeping a secret." },
            { t:"Never: a promise is a promise", why:M6 },
            { t:"Only if they agree first", why:"Safety can’t wait for permission." },
            { t:"Only after posting about it online", why:"Never post private concerns publicly." }],
          hints:["What matters most: the secret or their safety?", "Health and safety come first.", "When you’re worried about health or safety."] }
      ],
      refreshers:{
        "Mental health basics":"Mental illnesses are health conditions with biological, psychological and social causes. They’re treatable, and asking for help is a strength.",
        "Media literacy":"Ask who made a message, how it tries to persuade you, what evidence it gives, and who profits.",
        "Supportive communication":"Use “I” statements, describe what you’ve noticed, listen without judging, and involve a trusted adult when you’re worried about safety."
      }
    }
  },
  explore:{
    heading:"Understanding, not instructing",
    intro:"Three tools: map the factors behind eating disorders, test common myths, and practise a supportive conversation with a friend. Nothing here asks about your own eating or body.",
    modes:[{ id:"map", t:"Influence map" }, { id:"myth", t:"Myth or fact" }, { id:"talk", t:"Supportive conversation" }],
    // Influence map (plan cards and key). kt = the card's type in the plan (type tags aren't tested).
    map:{
      cols:[{ id:"risk", t:"Can raise risk" }, { id:"protect", t:"Can help protect" }],
      types:[{ id:"bio", t:"Biology", circle:"Biology" }, { id:"mind", t:"Mind", circle:"Mind" }, { id:"world", t:"World", circle:"World around us" }],
      message:"No single factor causes an eating disorder; several combine.",
      cards:[
        { id:"fam", t:"Family history", kt:"bio", answer:"risk" },
        { id:"perf", t:"Temperament such as perfectionism", kt:"mind", answer:"risk" },
        { id:"anx", t:"Anxiety or depression", kt:"mind", answer:"risk" },
        { id:"trauma", t:"Experiences of trauma", kt:"mind", answer:"risk" },
        { id:"tease", t:"Weight-based teasing or bullying", kt:"world", answer:"risk" },
        { id:"diet", t:"Diet culture and appearance-focused media", kt:"world", answer:"risk" },
        { id:"sport", t:"Sports or activities that emphasize weight or appearance", kt:"world", answer:"risk" },
        { id:"stress", t:"Major life changes or stress", kt:"mind", answer:"risk" },
        { id:"support", t:"Supportive relationships", kt:"world", answer:"protect" },
        { id:"media", t:"Media literacy skills", kt:"mind", answer:"protect" },
        { id:"env", t:"Environments that respect all body sizes", kt:"world", answer:"protect" },
        // VERIFY: shared meals as protective (plan §6.2; stated qualitatively, no figures).
        { id:"meals", t:"Regular shared meals with family or friends", kt:"world", answer:"protect" }
      ],
      // P1's reveal: sample cards that drop into the risk column, one of each type
      sample:["fam", "anx", "diet"]
    },
    // Myth or fact: the plan gives statement 1 (P2) and says the reveal names a reliable source type. AUTHORED: statements
    // 2–8, built from the plan's misconceptions and overview, and the source-type labels.
    myths:[
      { id:"s1", t:"“You can tell if someone has an eating disorder by looking at their body size.”", answer:"myth",
        flip:"People of every body size can have an eating disorder.", fix:M1, src:"a national eating disorder organization" },
      { id:"s2", t:"“Eating disorders are serious mental illnesses that affect both body and mind.”", answer:"fact",
        flip:"They’re serious illnesses with physical effects, not choices, phases or vanity.", fix:"Recovery is possible, and early help makes a real difference.", src:"a national eating disorder organization" },
      { id:"s3", t:"“Only teenage girls get eating disorders.”", answer:"myth",
        flip:"Eating disorders affect people of every gender, age, culture and income.", fix:M2, src:"peer-reviewed research" },
      { id:"s4", t:"“Biological, psychological and social factors combine to raise the risk of an eating disorder.”", answer:"fact",
        flip:"No single thing causes an eating disorder.", fix:"Social factors include weight stigma, diet culture and media messages.", src:"peer-reviewed research" },
      { id:"s5", t:"“Eating disorders are a choice, a phase or about vanity.”", answer:"myth",
        flip:"No one chooses an eating disorder.", fix:M3, src:"a national mental health organization" },
      { id:"s6", t:"“Recovery is possible, and getting help early makes a real difference.”", answer:"fact",
        flip:"People recover, often with help from a treatment team.", fix:"A doctor, therapist, dietitian and family can all be part of that team.", src:"clinical practice guidelines" },
      { id:"s7", t:"“Binge-eating disorder is just a lack of willpower.”", answer:"myth",
        flip:"Binge-eating disorder is a recognized illness.", fix:M4, src:"clinical practice guidelines" },
      { id:"s8", t:"“The best way to help a friend is to comment on what they eat.”", answer:"myth",
        flip:"Helping is about the person, not their food or body.", fix:M5, src:"a national eating disorder organization" }
    ],
    // Supportive conversation. The plan gives the scenario, the six turns, each best response and the named other choices
    // with their results. AUTHORED: Sam's lines, the situation lines, the second supportive options at turns 2 and 6,
    // the remaining choices at turns 3, 4 and 5, and the replies. {they} {them} {their} follow the pronoun in Settings.
    // answer: choice id → tr (L listened to, D defensive, S shut down) and what the choice does
    //   (i = concern with an "I" statement, ls = listened, pro = professional help, ad = trusted adult, fb = food or body comment,
    //    sec = promised secrecy, ok = a supportive option, self = "handle it myself").
    talk:{
      scenario:"Your friend <strong>Sam</strong> has been skipping lunch with the group, seems tired and withdrawn, and changes the subject when food comes up. You decide to talk with {them}.",
      trust:[{ id:"S", t:"shut down" }, { id:"D", t:"defensive" }, { id:"L", t:"listened to" }],
      moves:[
        { id:"i", t:"concern with an “I” statement" },
        { id:"ls", t:"listened" },
        { id:"pro", t:"suggested professional help" },
        { id:"ad", t:"involved a trusted adult" },
        { id:"nofb", t:"no comments on weight, food or appearance" }],
      turns:[
        { id:"t1", t:"Opening", situation:"You find Sam alone at {their} locker at lunch. It’s quiet, just the two of you.",
          says:[
            { id:"a", t:"“I’ve noticed you haven’t been at lunch and you seem tired. I care about you. Is everything okay?”", reply:"Sam looks up, surprised. “I… thanks for noticing.”" },
            { id:"b", t:"“You need to eat more.”", reply:"“Why is everyone watching me?” Sam crosses {their} arms." },
            { id:"c", t:"“You look different.”", reply:"Sam looks away and goes quiet." },
            { id:"d", t:"“Everyone’s talking about you.”", reply:"Sam’s face falls. “Great. Just great.”" }],
          answer:{ a:{ tr:"L", i:1 }, b:{ tr:"D", fb:1 }, c:{ tr:"S", fb:1 }, d:{ tr:"S" } } },
        { id:"t2", t:"Sam deflects", situation:"Sam shrugs. “I’m fine. Drop it.”",
          says:[
            { id:"a", t:"“Okay. I’m here whenever you want to talk, and I’m not going anywhere.”", reply:"Sam nods slowly. “…Okay.”" },
            { id:"b", t:"“That’s okay. You don’t have to talk now. Want to walk to class together?”", reply:"“Yeah. Okay.” Sam’s shoulders relax a little." },
            { id:"c", t:"“Not until you tell me.”", reply:"“Seriously? Back off.”" },
            { id:"d", t:"“Come on, you’re being so dramatic.”", reply:"“Wow. Thanks a lot.” Sam turns away." }],
          answer:{ a:{ tr:"L", ok:1 }, b:{ tr:"L", ok:1 }, c:{ tr:"D" }, d:{ tr:"D" } } },
        { id:"t3", t:"Sam shares a little", situation:"A few days later, Sam finds you after class. “Honestly? I’ve been really stressed. Everything feels like too much, and I feel like I’m not in control.”",
          says:[
            { id:"a", t:"“That sounds really hard. Thank you for telling me.”", reply:"Sam takes a breath. “It feels good to say it out loud.”" },
            { id:"b", t:"“You’d feel better if you just ate more.”", reply:"“That’s not what this is about.” Sam pulls back." },
            { id:"c", t:"“Just stop worrying.”", reply:"“Right. Like it’s that easy.” Sam stops talking." },
            { id:"d", t:"“Everyone gets stressed. It’s not a big deal.”", reply:"Sam shrugs. “Forget I said anything.”" }],
          answer:{ a:{ tr:"L", ls:1 }, b:{ tr:"D", fb:1 }, c:{ tr:"S" }, d:{ tr:"S" } } },
        { id:"t4", t:"Sam asks you to keep it secret", situation:"Sam looks worried. “Promise you won’t tell anyone.”",
          says:[
            { id:"a", t:"“I care about you too much to keep this to myself if I’m worried about your health. Can we talk to someone together?”", reply:"Sam is quiet for a moment. “…Okay. Maybe. If you come with me.”" },
            { id:"b", t:"“I promise.”", reply:"Sam looks relieved. “Thanks.” But you’re still worried, and no adult knows." },
            { id:"c", t:"“I’ll tell the whole group so we can all help.”", reply:"“No! Please don’t.” Sam walks away." },
            { id:"d", t:"“Only if you promise to eat more.”", reply:"“Forget it. You don’t get it.”" }],
          answer:{ a:{ tr:"L", ad:1 }, b:{ tr:"L", sec:1 }, c:{ tr:"S" }, d:{ tr:"D", fb:1 } } },
        { id:"t5", t:"Next steps", situation:"Sam sighs. “So… what do I even do now?”",
          says:[
            { id:"a", t:"“Would you talk to the school counsellor or your doctor? I can come with you.”", reply:"“If you come with me… yeah. Let’s go tomorrow.”" },
            { id:"b", t:"“You could try a meal-plan app. I’ll send you one.”", reply:"“That’s not what I need.” Sam frowns." },
            { id:"c", t:"“Look it up online and figure it out yourself.”", reply:"“Okay…” Sam sounds alone again." },
            { id:"d", t:"“You just need to be more positive.”", reply:"Sam looks down. “I’m trying.”" }],
          answer:{ a:{ tr:"L", pro:1, ad:1 }, b:{ tr:"D", fb:1 }, c:{ tr:"S" }, d:{ tr:"S" } } },
        { id:"t6", t:"Looking after yourself", situation:"That night, you notice you feel worried and tired yourself. What will you do?",
          says:[
            { id:"a", t:"“I’ll talk to a trusted adult about how I’m feeling too.”", reply:"Good thinking: helpers need support too. Sam is glad you’re still there." },
            { id:"b", t:"“I’ll do something I enjoy to recharge, and keep checking in with Sam as a friend.”", reply:"Looking after yourself helps you keep being there for Sam." },
            { id:"c", t:"“I’ll handle it all myself.”", reply:"Helpers need support too. You don’t have to carry this alone: talk to a trusted adult about how you’re feeling." },
            { id:"d", t:"“I’ll keep an eye on what Sam eats every day.”", reply:"Sam notices you watching and pulls away. “I don’t want to be watched.”" }],
          answer:{ a:{ tr:"L", ok:1 }, b:{ tr:"L", ok:1 }, c:{ tr:"L", self:1 }, d:{ tr:"D", fb:1 } } }
      ],
      // TC3: Riley's conversation (plan's three unhelpful responses; Riley's name, Sam's lines and turn 2 are AUTHORED)
      repair:{
        intro:"Another friend, Riley, tried to talk with Sam. Three of Riley’s responses were unhelpful. Choose a turn, then choose a supportive response from the bank to replace it.",
        turns:[
          { id:"r1", n:1, sam:"Riley finds Sam alone at lunch.", bad:"“You’ve gotten so thin.”" },
          { id:"r2", n:2, sam:"“I’m fine. Drop it.”", keep:"“Okay. I’m here if you want to talk.”" },
          { id:"r3", n:3, sam:"“I’ve been really stressed. I feel like I’m not in control.”", bad:"“Just eat normally and you’ll be fine.”" },
          { id:"r4", n:4, sam:"“Promise you won’t tell anyone.”", bad:"“Okay, I won’t tell anyone.”" }],
        // bank of 8 (plan: "You look fine to me" and "Have you tried a meal plan?"; the rest AUTHORED). answer = the turn it repairs.
        bank:[
          { id:"k1", t:"“I’ve noticed you seem tired and quiet lately, and I care about you. Is everything okay?”", answer:"r1" },
          { id:"k2", t:"“You look fine to me.”", answer:"" },
          { id:"k3", t:"“That sounds really hard. Thank you for telling me.”", answer:"r3" },
          { id:"k4", t:"“It sounds like you’re carrying a lot right now. I’m glad you told me.”", answer:"r3" },
          { id:"k5", t:"“Have you tried a meal plan?”", answer:"" },
          { id:"k6", t:"“I care about you too much to keep this to myself. Can we talk to a trusted adult together?”", answer:"r4" },
          { id:"k7", t:"“Okay, it’ll be our secret.”", answer:"" },
          { id:"k8", t:"“Just stop worrying so much.”", answer:"" }]
      }
    },
    predictions:[
      { id:"p1", mode:"map", prompt:"Which kinds of factors do researchers say contribute to eating disorders?",
        options:[{ t:"A mix of biological, psychological and social factors", ok:true }, { t:"Mainly vanity" }, { t:"A single gene" }, { t:"Only social media" }],
        explain:"No single cause, and never a choice. " + M3 },
      { id:"p2", mode:"myth", prompt:"“You can tell if someone has an eating disorder by looking at their body size.” Myth or fact?",
        options:[{ t:"Myth", ok:true }, { t:"Fact" }, { t:"Only for boys" }, { t:"Only for adults" }],
        explain:M1 },
      { id:"p3", mode:"talk", turn:0, prompt:"Which opening is most likely to help Sam feel listened to?",
        options:[{ t:"Share what you’ve noticed and that you care, using “I”", ok:true }, { t:"Tell Sam to eat more" }, { t:"Comment on how Sam looks" }, { t:"Mention that others are talking about Sam" }],
        explain:"Focus on the person, not food or appearance. " + M5 },
      { id:"p4", mode:"talk", turn:3, prompt:"Sam asks you to promise to keep a secret, and you’re worried about Sam’s health. What’s the caring choice?",
        options:[{ t:"Explain that you care too much to keep it to yourself, and offer to talk to a trusted adult together", ok:true }, { t:"Promise and say nothing" }, { t:"Post about it to get advice" }, { t:"Ignore it" }],
        explain:M6 }
    ],
    challenges:[
      { id:"tc1", goal:2, prompt:"Place all 12 factor cards correctly in the <strong>influence map</strong>.",
        why:"Eight cards can raise risk and four can help protect. No single factor causes an eating disorder; several combine.",
        msgs:{
          support:"Supportive people protect.",
          diet:"Diet culture attaches worth to body size and food rules, which raises risk.",
          // VERIFY: shared meals as protective (plan: "linked with lower risk (verify)")
          meals:"Shared meals are linked with lower risk.",
          // AUTHORED (no named wrong state in the plan)
          unplaced:"Place every card first: {n} still in the tray.",
          count:"{k} of 12 cards are in the right column. Ask of each card: does this make things harder or easier for someone?" },
        hints:["Ask: does this make things harder or easier for someone?", "Four cards are protective.", "Protective: supportive relationships, media literacy, body-respectful environments, shared meals."] },
      { id:"tc2", goal:4, prompt:"Complete the conversation with Sam so that all five key moves are ✓ and the safety step reads “yes”.",
        why:"Concern, listening, no body or food talk, professional help and a trusted adult: helping is about the person, not their food or body.",
        msgs:{
          fb:"That comment focuses on Sam’s food or body. Try focusing on Sam.",
          sec:"Safety step not done.",
          // AUTHORED (no named wrong state in the plan)
          unfinished:"Finish all six turns first: you’re on turn {n}.",
          i:"Start at turn 1 with what you’ve noticed and that you care, using “I”.",
          t2:"At turn 2, Sam asked you to drop it. Pushing or teasing makes Sam defensive; keep the door open instead.",
          ls:"At turn 3, Sam shared something hard. Listen and reflect first.",
          ad:"At turn 4, offer to talk to a trusted adult together.",
          pro:"At turn 5, suggest a professional (a school counsellor or doctor) and offer to go along.",
          self:"Helpers need support too. At turn 6, choose a way to look after yourself that includes support." },
        hints:["Five moves: concern, listening, no body or food talk, professional help, a trusted adult.", "Turn 4 is the safety step.", "At turn 4, offer to talk to a trusted adult together."] },
      { id:"tc3", goal:4, stretch:true, prompt:"Repair this conversation. (In <strong>Supportive conversation</strong>, choose <strong>Repair a conversation</strong>, then replace Riley’s three unhelpful responses from the bank of 8.)",
        why:"Each repair focuses on Sam: concern with an “I” statement, listening, and getting a trusted adult involved.",
        msgs:{
          k2:"Still about appearance. " + M5,
          k5:"Still advice about food; listen first.",
          // AUTHORED (no named wrong state in the plan)
          empty:"Replace all three unhelpful responses first: turn {n} still has Riley’s response.",
          k7:"That still keeps the secret. " + M6,
          k8:"That dismisses Sam’s feelings.",
          r1:"Turn 1 is the opening: share what you’ve noticed and that you care, using “I”.",
          r3:"At turn 3, Sam has just shared something hard: listen or reflect it back.",
          r4:"Turn 4 needs the trusted-adult choice." },
        hints:["Find the three responses that focus on body, food or secrecy.", "Swap each for one about Sam’s feelings, listening, or getting help.", "Turn 4 needs the trusted-adult choice."] }
    ],
    // AUTHORED wrapper; the type descriptions are flashcards 2–5 and 11 (plan), and the warning signs are the ones in Sam's story.
    blocks:[{ title:"What the tools show", html:'<p><strong>The big idea:</strong> eating disorders come from a mix of factors, and helping is about the person, not their food or body.</p>' +
      '<h4>The main types, described by their effects</h4><ul class="ed-types">' +
      '<li><strong>Anorexia nervosa:</strong> an illness involving restriction of food and an intense fear related to weight and shape; it can seriously harm the heart, bones and other organs.</li>' +
      '<li><strong>Bulimia nervosa:</strong> an illness involving repeated cycles of binge eating followed by behaviours meant to “undo” eating, which harm the body.</li>' +
      '<li><strong>Binge-eating disorder:</strong> an illness involving repeated episodes of eating with loss of control and distress. Not a willpower problem.</li>' +
      '<li><strong>ARFID</strong> (avoidant/restrictive food intake disorder): avoiding or restricting food for reasons other than body image (sensory, fear, low interest).</li></ul>' +
      '<p><strong>General warning signs</strong> are changes like the ones in Sam’s story: pulling away from shared meals, seeming tired or withdrawn, and avoiding talk about food. You can’t tell by looking at someone’s body.</p>' +
      '<p><strong>Treatment and recovery:</strong> early help from a team (doctor, therapist, dietitian, family); recovery is possible.</p>' }]
  },
  part3:{
    slug:"media", name:"Media", heading:"Media, bodies and messages",
    // AUTHORED intro (from the plan's "practice models" note)
    intro:"Now move from the person to the world around us. Four stations: spot diet-culture messages, rewrite them, follow the money, and curate a feed. Every caption here is a <strong>fictional practice text</strong> written for this module. It’s text only, with no images of bodies.",
    s1:{
      title:"Station 1: Spot the diet-culture message",
      how:"Tag each caption: a diet-culture message, neutral, or body-respectful.",
      tags:[{ id:"diet", t:"Diet-culture message" }, { id:"neutral", t:"Neutral" }, { id:"respect", t:"Body-respectful" }],
      // the plan's six example captions plus two AUTHORED ones (cap7, cap8); the feedback lines are AUTHORED
      captions:[
        { id:"cap1", t:"“Earn your dinner today!”", answer:"diet", why:"Food doesn’t have to be earned. This attaches rules and guilt to eating." },
        { id:"cap2", t:"“Guilt-free dessert”", answer:"diet", why:"“Guilt-free” suggests other desserts should make you feel guilty: a moral label." },
        { id:"cap3", t:"“Clean eating changed my life”", answer:"diet", why:"“Clean” suggests other food is dirty: a moral label." },
        { id:"cap4", t:"“Swap your ‘bad’ snacks for good ones”", answer:"diet", why:"Sorting food into good and bad attaches guilt to eating." },
        { id:"cap5", t:"“Every body deserves food and rest”", answer:"respect", why:"It respects every body and puts no conditions on eating." },
        { id:"cap6", t:"“Fuel for the game: pasta, veg and milk”", answer:"neutral", why:"It describes food plainly, by what it does." },
        { id:"cap7", t:"“Lentil soup and fresh bread for lunch today”", answer:"neutral", why:"A plain description: no rules and no guilt." },
        { id:"cap8", t:"“All bodies deserve respect, at every size”", answer:"respect", why:"It respects people of every size." }]
    },
    // Check it with data (plan: research linking weight stigma and appearance-focused media to body dissatisfaction; sources
    // named; no numbers). AUTHORED summary. VERIFY: every reference and the wording of each finding before release.
    data:'<p>Reviews that pull together many studies point the same way:</p><ul>' +
      '<li><strong>Appearance-focused media.</strong> Across experiments and surveys, viewing appearance-focused images and posts is linked with feeling worse about one’s own body (Grabe et al., 2008; Holland &amp; Tiggemann, 2016).</li>' +
      '<li><strong>Weight stigma.</strong> Teasing and unfair treatment based on body size are linked with body dissatisfaction and harm to health (Puhl &amp; Suh, 2015).</li>' +
      '<li><strong>Why it matters.</strong> Body dissatisfaction is one of the risk factors for eating disorders (Stice, 2002), while regular shared meals are linked with lower risk (Neumark-Sztainer et al., 2004).</li></ul>' +
      '<p class="tiny muted">These findings describe patterns across groups of people. They don’t predict what will happen to any one person.</p>' +
      '<ul class="hfa-refs">' +
      '<li>Grabe, S., Ward, L. M., &amp; Hyde, J. S. (2008). The role of the media in body image concerns among women: A meta-analysis of experimental and correlational studies. <i>Psychological Bulletin, 134</i>(3), 460–476.</li>' +
      '<li>Holland, G., &amp; Tiggemann, M. (2016). A systematic review of the impact of the use of social networking sites on body image and disordered eating outcomes. <i>Body Image, 17</i>, 100–110.</li>' +
      '<li>Neumark-Sztainer, D., Wall, M., Story, M., &amp; Fulkerson, J. A. (2004). Are family meal patterns associated with disordered eating behaviors among adolescents? <i>Journal of Adolescent Health, 35</i>(5), 350–359.</li>' +
      '<li>Puhl, R. M., &amp; Suh, Y. (2015). Health consequences of weight stigma: Implications for obesity prevention and treatment. <i>Current Obesity Reports, 4</i>(2), 182–190.</li>' +
      '<li>Stice, E. (2002). Risk and maintenance factors for eating pathology: A meta-analytic review. <i>Psychological Bulletin, 128</i>(5), 825–848.</li></ul>',
    s2:{
      title:"Station 2: Rewrite it",
      how:"Rewrite each diet-culture caption in plain, weight-neutral language. Tap a word in the bank to add it to the caption you’re working on.",
      captions:[
        // AUTHORED sample rewrites (shown on request)
        { id:"rw1", t:"“Earn your dinner today!”", sample:"Enjoy a satisfying dinner together tonight." },
        { id:"rw2", t:"“Guilt-free dessert”", sample:"A dessert full of flavour to share." },
        { id:"rw3", t:"“Clean eating changed my life”", sample:"Eating a variety of foods gives me energy for what I love." }],
      bank:["enjoy", "energy", "together", "satisfying", "flavour", "rest"],
      clear:"✓ No moral food words or body-size words.",
      flagged:"Flagged: {w}. Try describing flavour, energy, rest or who you share it with."
    },
    s3:{
      title:"Station 3: Who benefits?",
      how:"Follow the chain. Tap a label, then tap the step it belongs to.",
      // flow chart (plan); labels go on steps 1, 3, 4 and 5 (step 2 is the message itself). Feedback lines AUTHORED.
      steps:[
        { id:"f1", t:"Diet products and programs", slot:true, answer:"profit", why:"Companies selling diet products and programs are after profit." },
        { id:"f2", t:"Advertising", note:"the message" },
        { id:"f3", t:"Algorithms that show more of what keeps people scrolling", slot:true, answer:"attention", why:"Algorithms compete for your attention: they show more of whatever keeps you scrolling." },
        { id:"f4", t:"Feelings of not being enough", slot:true, answer:"insecurity", why:"Feeling that you’re not enough is insecurity." },
        { id:"f5", t:"More purchases", slot:true, answer:"purchase", why:"Insecurity drives the purchase, and the cycle starts again." }],
      labels:[{ id:"profit", t:"profit" }, { id:"attention", t:"attention" }, { id:"insecurity", t:"insecurity" }, { id:"purchase", t:"purchase" }],
      loop:"…and the cycle repeats.",
      // F12 claim–evidence–reasoning frame (AUTHORED, revealed when the chain is complete)
      cer:[["Claim", "Companies selling diet products and programs benefit when people feel their bodies aren’t good enough."],
        ["Evidence", "The chain: ads and algorithms capture attention, repeated messages build insecurity, and insecurity leads to purchases."],
        ["Reasoning", "Insecurity can be profitable. Questioning these messages, and the business behind them, builds a healthier environment for everyone."]]
    },
    s4:{
      title:"Station 4: Curate your feed",
      how:"Four protective habits. Open each one to see why it helps.",
      // plan strategies; the "why" lines are AUTHORED
      tips:[
        { t:"Unfollow or mute accounts that make you feel worse about your body.", why:"What you see often shapes how you feel. You choose what stays in your feed." },
        { t:"Follow accounts focused on interests, skills and diverse people.", why:"A feed about what people do, make and care about leaves less room for appearance." },
        { t:"Turn off “suggested” content where possible.", why:"Suggestions show more of whatever keeps you scrolling, not what’s good for you." },
        { t:"Talk about what you see.", why:"Naming a diet-culture message with a friend or a trusted adult takes away some of its power." }]
    },
    quickCheck:{
      title:"Media quick check", summary:"Media quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which caption is body-respectful?",
          choices:[
            { t:"“Every body deserves food and rest”", ok:true, fb:"Right. It respects every body and attaches no rules to eating." },
            { t:"“Earn your dinner”", fb:"The others attach guilt or rules to eating. " + M7 },
            { t:"“Guilt-free dessert”", fb:"The others attach guilt or rules to eating. " + M7 },
            { t:"“Clean eating changed my life”", fb:"The others attach guilt or rules to eating. " + M7 }] },
        { id:"q2", goal:5, prompt:"Why do moral food words matter?",
          choices:[
            { t:"They attach guilt and shame to eating", ok:true, fb:"Right. " + M7 },
            { t:"They make food taste better", fb:M7 },
            { t:"They’re required on labels", fb:M7 },
            { t:"They improve nutrition", fb:M7 }] },
        { id:"q3", goal:5, prompt:"Who most benefits when people feel their bodies aren’t good enough?",
          choices:[
            { t:"Companies selling diet products and programs", ok:true, fb:"Right. Insecurity can be profitable." },
            { t:"Public health agencies", fb:"Insecurity can be profitable." },
            { t:"Teachers", fb:"Insecurity can be profitable." },
            { t:"Grocery store cashiers", fb:"Insecurity can be profitable." }] },
        { id:"q4", goal:6, prompt:"Which is a protective media habit?",
          choices:[
            { t:"Muting accounts that make you feel worse about your body", ok:true, fb:"Right. Curating your feed protects your well-being." },
            { t:"Following more “body goals” accounts", fb:"Curating your feed protects your well-being." },
            { t:"Comparing yourself with influencers", fb:"Curating your feed protects your well-being." },
            { t:"Posting your meals for feedback", fb:"Curating your feed protects your well-being." }] }
      ]
    }
  },
  practice:{
    activities:[
      { id:"myths", type:"sorter", title:"Myth or fact?", summary:"Myth or fact", goal:[1, 3], txt:true, noun:"statement",
        instruction:"Ten statements about eating disorders. Is each one a myth or a fact?",
        boxes:[{ id:"myth", label:"Myth" }, { id:"fact", label:"Fact" }],
        items:[
          { id:"m1", t:"“You can tell someone has an eating disorder by their size.”", answer:"myth", why:M1, wrong:{ fact:M1 } },
          { id:"m2", t:"“Eating disorders are serious mental illnesses.”", answer:"fact", why:"With physical and psychological effects.", wrong:{ myth:"It’s a fact: eating disorders are serious mental illnesses, with physical and psychological effects." } },
          { id:"m3", t:"“Only teenage girls get eating disorders.”", answer:"myth", why:M2, wrong:{ fact:M2 } },
          { id:"m4", t:"“Recovery is possible, especially with early help.”", answer:"fact", why:"Treatment teams help people recover.", wrong:{ myth:"It’s a fact: treatment teams help people recover." } },
          { id:"m5", t:"“Binge-eating disorder is just a lack of willpower.”", answer:"myth", why:M4, wrong:{ fact:M4 } },
          { id:"m6", t:"“Eating disorders can affect people from every culture and income level.”", answer:"fact", why:M2, wrong:{ myth:"It’s a fact. " + M2 } },
          { id:"m7", t:"“ARFID is about wanting to change body shape.”", answer:"myth",
            why:"ARFID involves avoiding or restricting food for other reasons, such as sensory sensitivity, fear of choking, or low interest in eating; it isn’t driven by body image.",
            wrong:{ fact:"ARFID involves avoiding or restricting food for other reasons, such as sensory sensitivity, fear of choking, or low interest in eating; it isn’t driven by body image." },
            hints:["What does the “A” in ARFID stand for?", "Avoidant.", "It’s not about body image: Myth."] },
          // VERIFY: weight stigma as a risk factor (plan §6.2)
          { id:"m8", t:"“Weight-based teasing can raise the risk of eating disorders.”", answer:"fact", why:"Weight stigma is a known risk factor.", wrong:{ myth:"It’s a fact: weight stigma is a known risk factor." } },
          { id:"m9", t:"“If someone says they’re fine, you should never bring it up again.”", answer:"myth", why:"Keep the door open: “I’m here when you want to talk.”", wrong:{ fact:"Keep the door open: “I’m here when you want to talk.”" } },
          // VERIFY: mortality among mental illnesses (plan §6.2; stated qualitatively, no figures)
          { id:"m10", t:"“Eating disorders have among the highest risks of death of any mental illness.”", answer:"fact", why:"That’s why early help matters.", wrong:{ myth:"It’s a fact. That’s why early help matters." } }
        ] },
      // ★ set. The plan gives each scenario's best response, the feedback for the most likely wrong answer and W3's hints.
      // AUTHORED: the other two options in each item, their feedback, and the feedback on the best responses.
      { id:"help", type:"mc", title:"What would help?", summary:"What would help?", star:true, goal:[4, 6],
        instruction:"Six scenarios. Choose the best response for each. Scenarios marked ★ are non-routine; the last two go beyond the Final Check.",
        items:[
          { id:"h1", goal:4, prompt:"Your friend jokes about “needing to earn” their lunch.",
            options:[
              { t:"Gently question the idea that food has to be earned, and keep the focus on your friend and how they’re doing", ok:true, why:"Food doesn’t have to be earned. A gentle question that stays on your friend keeps the door open." },
              { t:"Join in the joke", why:"That reinforces diet culture. " + M7 },
              { t:"Tell your friend what they should eat for lunch", why:"Advice about food isn’t the way to help. " + M5 },
              { t:"Laugh it off and change the subject", why:"Ignoring it leaves the idea that food must be earned unquestioned." }] },
          { id:"h2", goal:4, prompt:"A teammate’s coach praises one athlete’s weight loss in front of the team.",
            options:[
              { t:"Talk to a trusted adult (another coach, a parent, a counsellor) about body comments in sport", ok:true, why:"Adults can change the team culture." },
              { t:"Say nothing", why:"Weight-focused comments in sport are a known risk factor; adults can change the team culture." },
              { t:"Post about the coach online", why:"Posting publicly can shame people and doesn’t fix the problem. Talk to a trusted adult." },
              { t:"Compliment the athlete too", why:"More body comments add to the problem. Comments on bodies can make things worse." }] },
          { id:"h3", goal:6, prompt:"<span class=\"tag\">★</span> Your younger cousin eats only a few foods and gags on new textures, but says nothing about weight. The family thinks it’s picky eating.",
            options:[
              { t:"Suggest the family talk to a doctor: this pattern can be a sign of ARFID, which is not about body image", ok:true, why:"A doctor can assess it, and ARFID isn’t driven by body image." },
              { t:"Force new foods", why:"Pressure can make it worse; a professional can help." },
              { t:"Ignore it: all kids are picky", why:"Some picky eating is common, but a pattern like this can be a sign of ARFID. A doctor can tell the difference." },
              { t:"Tell the cousin not to worry about weight", why:"The cousin says nothing about weight: ARFID isn’t about body image." }],
            hints:["Is the cousin’s eating about body image?", "No; it’s about textures and fear.", "Suggest a doctor; it could be ARFID."] },
          { id:"h4", goal:4, prompt:"<span class=\"tag\">★</span> A friend shares that they’ve been struggling with eating and asks you to keep it secret. You’re worried.",
            options:[
              { t:"Thank them for trusting you; say you care too much to keep it to yourself; offer to go together to a counsellor", ok:true, why:"It’s caring and honest, and it gets help started. " + M6 },
              { t:"Promise to keep it secret", why:M6 },
              { t:"Tell everyone in your friend group", why:"Private concerns shouldn’t be shared with the group. Involve a trusted adult instead." },
              { t:"Give them advice about what to eat", why:M5 }] },
          { id:"h5", goal:6, prompt:"<span class=\"tag\">★ Inquiry</span> Which research question would best investigate how social media relates to body image in Grade 12 students?",
            options:[
              { t:"“How does time spent viewing appearance-focused content relate to how Grade 12 students describe their body image, according to published studies?”", ok:true, why:"It’s focused, measurable and answerable from published research." },
              { t:"“Is social media bad?”", why:"Too broad and not measurable." },
              { t:"“What is the best social media app?”", why:"That’s about opinion, not body image, and evidence can’t settle it." },
              { t:"“Why does social media cause eating disorders?”", why:"It assumes a single cause. Eating disorders have many causes, and a good question doesn’t assume its answer." }] },
          { id:"h6", goal:6, prompt:"<span class=\"tag\">★ Inquiry</span> Two sources describe eating disorders. Source A is a national eating disorder organization’s page citing research; Source B is a wellness influencer’s video saying they’re “caused by bad habits.” Which evaluation is best?",
            options:[
              { t:"Source A is more reliable: it cites research and has no product to sell. Source B makes an unsupported claim and may profit from its audience", ok:true, why:"Check the evidence and who benefits." },
              { t:"Source B has more views, so it’s better", why:"Popularity isn’t reliability." },
              { t:"Both are equally reliable because both are online", why:"Where something is posted doesn’t make it reliable; evidence and motive do." },
              { t:"Source B is more reliable because the influencer looks healthy", why:"Appearance isn’t evidence." }] }
        ] },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", student:"Joaquin", goal:[1, 4, 5], how:"",
        instruction:"Joaquin made one mistake in each plan. Tap the step where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:4, task:"Joaquin’s plan to help a friend he’s worried about.",
            steps:["“Find a private, calm time to talk.”", "“Start with ‘I’ve noticed you seem stressed, and I care about you.’”", "“Tell her she looks too thin and needs to eat more.”", "“Suggest she talk to the school counsellor.”", "“Tell a trusted adult if I’m still worried.”"],
            answer:2, stepFb:["Step 1 is correct. Keep checking.", "Step 2 is correct.", "", "Step 4 is fine, but an earlier step goes wrong first.", "Step 5 is a good safety step."],
            fixes:[
              { t:"“Listen to how she’s feeling, and avoid comments about her body or food.”", ok:true, why:"It keeps the focus on her, not her body or food." },
              { t:"“Tell her she looks fine.”", why:"Still about appearance. " + M5 },
              { t:"Step 3 is correct.", why:"Comments about bodies and food can make things worse." },
              { t:"“Send her a diet plan.”", why:"Not helpful." }],
            hints:["Which step talks about her body?", "Step 3.", "Replace it with listening."] },
          { id:"e2", goal:5, task:"Joaquin’s draft poster for Healthy Schools Week.",
            steps:["“Title: Food, friends and feeling good.”", "“Enjoy a variety of foods with people you like.”", "“Say no to junk and eat clean!”", "“Need to talk? Kids Help Phone and the school counsellor are here.”"],
            answer:2, stepFb:["Step 1 is fine.", "Step 2 is fine.", "", "Step 4 is good."],
            fixes:[
              { t:"“Try new foods and enjoy meals together.”", ok:true, why:"Welcoming and neutral: no moral labels." },
              { t:"“Ban dessert at school.”", why:"Moral rules about food." },
              { t:"Step 3 is correct.", why:"“Junk” and “clean” are moral labels." },
              { t:"“Eat less and move more!”", why:"Weight-focused and not helpful." }],
            hints:["Which words label food as good or bad?", "“Junk” and “clean”.", "Rewrite it in neutral, welcoming words."] },
          { id:"e3", goal:1, task:"Joaquin’s explanation of eating disorders for a class presentation.",
            steps:["“Eating disorders are serious mental illnesses.”", "“They’re caused by a mix of biological, psychological and social factors.”", "“Binge-eating disorder happens when people don’t have enough willpower.”", "“Recovery is possible with help from a treatment team.”"],
            answer:2, stepFb:["Step 1 is correct.", "Step 2 is correct.", "", "Step 4 is correct."],
            fixes:[
              { t:"“Binge-eating disorder is a recognized illness involving loss of control and distress; it isn’t about willpower.”", ok:true, why:"Accurate: it’s an illness, not a willpower problem." },
              { t:"“Binge-eating disorder isn’t a real illness.”", why:"It is a recognized eating disorder." },
              { t:"Step 3 is correct.", why:M4 },
              { t:"“Binge-eating disorder only affects adults.”", why:"It can affect people of any age." }],
            hints:["Which step blames the person?", "Step 3.", "It’s an illness, not a willpower problem."] }
        ] }
    ]
  },
  reflect:{
    journalNote:"These entries stay on your device. They are not added to your summary unless you choose to add them.",
    optIn:"Add my journal entries to my results summary",
    journal:[
      { id:"j1", q:"Which myth did you believe before this module, and what changed your mind?" },
      { id:"j2", q:"In your own words, why can’t you tell by looking whether someone is struggling?" },
      { id:"j3", q:"Explain to a friend the five moves of a supportive conversation." },
      { id:"j4", q:"Which media message about food or bodies will you question differently now?" }
    ]
  },
  final:{
    // Options without feedback in the plan use its misconception sentences (M1–M7); feedback on correct options the plan
    // leaves blank is AUTHORED (short restatements).
    altIntro:"The shorter path’s Final Check: its Communication and Application questions. There are no hints. Answer all four and say how sure you are, then submit to see your results.",
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which description of binge-eating disorder is accurate?", options:[
          { t:"Repeated episodes of eating with a sense of loss of control and distress; a recognized illness", ok:true, why:"It’s a recognized illness; willpower isn’t the issue." },
          { t:"A lack of willpower", why:M4 },
          { t:"A phase that always passes without help", why:M3 },
          { t:"A condition that only affects teenagers", why:M2 }] },
        b:{ prompt:"Which description of ARFID is accurate?", options:[
          { t:"Avoiding or restricting food for reasons such as sensory sensitivity, fear of choking or low interest in eating, not body image", ok:true, why:"ARFID isn’t driven by body image." },
          { t:"A type of picky eating that is never serious", why:"It can seriously affect health." },
          { t:"Restriction driven mainly by wanting to change body shape", why:"That isn’t ARFID’s defining feature." },
          { t:"An eating disorder that only adults develop", why:"It often begins in childhood." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"Which statement about who can develop an eating disorder is accurate?", options:[
          { t:"People of every gender, age, culture, income and body size", ok:true, why:"Anyone can be affected, and you can’t tell by looking." },
          { t:"Only people with very small bodies", why:M1 },
          { t:"Only teenage girls", why:M2 },
          { t:"Only people who diet", why:"Many factors are involved." }] },
        b:{ prompt:"A classmate in a larger body tells you they’re struggling with eating. Which belief is a myth?", options:[
          { t:"“People in larger bodies can’t have eating disorders.”", ok:true, why:"They can, and they’re often missed. " + M1 },
          { t:"“Eating disorders are serious illnesses.”", why:"That’s a fact." },
          { t:"“Early help improves recovery.”", why:"That’s a fact." },
          { t:"“A trusted adult can help connect them to care.”", why:"That’s a fact." }] } },
      { id:"k3", cat:"K", goal:3,
        a:{ prompt:"Why are boys and men with eating disorders often missed?", options:[
          { t:"Because of the myth that eating disorders only affect girls and women", ok:true, why:"The myth means people don’t look for it in boys and men. " + M2 },
          { t:"Because boys can’t develop eating disorders", why:M2 },
          { t:"Because their eating disorders are never serious", why:"They can be very serious." },
          { t:"Because doctors don’t treat boys", why:"They do." }] },
        b:{ prompt:"Which statement about culture and eating disorders is accurate?", options:[
          { t:"Eating disorders occur across all cultures and communities", ok:true, why:M2 },
          { t:"They only occur in wealthy countries", why:M2 },
          { t:"They only occur in one ethnic group", why:M2 },
          { t:"Culture has nothing to do with food and body messages", why:"Culture shapes messages about food and bodies." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A student has a parent with an eating disorder, is very perfectionistic, and plays a sport where coaches comment on weight. What’s the best analysis?", options:[
          { t:"Biological, psychological and social risk factors combine here; supportive adults and changing the team culture could help protect them", ok:true, why:"Several factors combine, and protective factors can lower risk." },
          { t:"Only the sport matters", why:"Several factors combine." },
          { t:"This student will definitely develop an eating disorder", why:"Risk factors raise risk; they don’t decide outcomes." },
          { t:"It’s this student’s choice", why:M3 }] },
        b:{ prompt:"Which combination of factors best fits the idea that eating disorders have biological, psychological <strong>and</strong> social influences?", options:[
          { t:"Family history, anxiety, and weight-based teasing", ok:true, why:"One biological, one psychological and one social factor." },
          { t:"Family history only", why:"One type." },
          { t:"Social media only", why:"One type." },
          { t:"Choosing to diet", why:M3 }] } },
      { id:"t2", cat:"T", goal:4,
        a:{ prompt:"Your friend says “I’m fine, stop asking” after you express concern. What’s the best next step?", options:[
          { t:"Respect their wish for now, say you’re there whenever they want to talk, and talk to a trusted adult if you remain worried", ok:true, why:"It respects their wish, keeps the door open and keeps them safe." },
          { t:"Keep pressing until they tell you", why:"Pressure can push them away." },
          { t:"Comment on their eating so they understand your worry", why:M5 },
          { t:"Drop it completely and never mention it again", why:"Keep the door open." }] },
        b:{ prompt:"A friend opens up about struggling with eating. Which response best shows listening?", options:[
          { t:"“That sounds really hard. Thank you for telling me. I’m here for you.”", ok:true, why:"It reflects their feelings and thanks them for trusting you." },
          { t:"“You just need to eat normally.”", why:M5 },
          { t:"“You don’t look like you have a problem.”", why:M1 + " " + M5 },
          { t:"“Everyone feels that way; don’t worry.”", why:"Dismisses their feelings." }] } },
      { id:"t3", cat:"T", goal:6,
        a:{ prompt:"A school wants to prevent eating disorders. Which strategy is best supported?", options:[
          { t:"Media-literacy lessons, a no-body-comments policy in sports and classes, and clear ways to reach counsellors", ok:true, why:"Each part is protective: media literacy, no body comments, and easy access to help." },
          { t:"Weighing all students each term", why:"Focuses on weight and can harm." },
          { t:"Posters labelling foods ‘good’ and ‘bad’", why:M7 },
          { t:"Banning all discussion of eating disorders", why:"Silence prevents help-seeking." }] },
        b:{ prompt:"Which prevention idea is most likely to backfire?", options:[
          { t:"A class challenge comparing what students eat in a day", ok:true, why:"Encourages comparison and rules." },
          { t:"Teaching students to question appearance-focused ads", why:"Protective." },
          { t:"Training coaches to avoid weight comments", why:"Protective." },
          { t:"Sharing where to get confidential help", why:"Protective." }] } },
      { id:"c1", cat:"C", goal:3,
        a:{ prompt:"Which sentence best corrects the myth “you can tell by looking”?", options:[
          { t:"“Eating disorders affect people of every body size, so you can’t tell by looking; what matters is how someone is doing.”", ok:true, why:"It corrects the myth and focuses on the person." },
          { t:"“Most people with eating disorders look very thin.”", why:M1 },
          { t:"“You can usually tell by how much someone eats at lunch.”", why:"Observing someone’s eating isn’t the way to judge, or to help." },
          { t:"“Only doctors can tell by looking.”", why:"Not by looking: by assessment." }] },
        b:{ prompt:"Which sentence best explains that eating disorders aren’t a choice?", options:[
          { t:"“Eating disorders are serious illnesses with biological, psychological and social causes; no one chooses them.”", ok:true, why:"It names the causes and says plainly that no one chooses them." },
          { t:"“People choose them to get attention.”", why:M3 },
          { t:"“They’re a phase teens grow out of.”", why:M3 },
          { t:"“They’re caused only by social media.”", why:"One factor among many." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which message to a worried friend is clearest and most supportive?", options:[
          { t:"“I care about you and I’ve noticed you seem stressed. Would you talk to the counsellor with me? I can come too.”", ok:true, why:"Caring, specific and private, and it offers a way to get help." },
          { t:"“You need to eat more, seriously.”", why:M5 },
          { t:"“I’m telling everyone so they can help.”", why:"Public, not private." },
          { t:"“Promise me you’ll just stop.”", why:"It isn’t that simple." }] },
        b:{ prompt:"Which sentence best explains why we don’t comment on a friend’s weight or food when we’re worried?", options:[
          { t:"“Comments about bodies or food can increase shame and make it harder to reach out; focusing on the person helps them feel safe.”", ok:true, why:"It explains the effect: shame makes reaching out harder." },
          { t:"“Because it’s rude.”", why:"True, but it doesn’t explain the effect." },
          { t:"“Because weight never matters for health.”", why:"Not the point here." },
          { t:"“Because they’ll stop eating at lunch.”", why:"Not an accurate or helpful explanation." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"At a sleepover, a friend tells you they’re struggling with eating and asks you to keep it secret. The next day you’re still worried. What should you do?", options:[
          { t:"Tell a trusted adult (a parent, counsellor or teacher), and let your friend know you’re doing it because you care", ok:true, why:M6 },
          { t:"Keep the secret forever", why:"Their health and safety matter more than a secret. " + M6 },
          { t:"Post about it anonymously online for advice", why:"Private information shouldn’t be posted." },
          { t:"Confront them in front of the group", why:"Shaming and public." }] },
        b:{ prompt:"Your friend’s younger sibling has stopped eating with the family and seems withdrawn. Your friend asks what to do. What’s the best advice?", options:[
          { t:"Tell their parents or another trusted adult so the sibling can see a doctor", ok:true, why:"Early help matters, and a doctor can assess what’s going on." },
          { t:"Wait until the sibling asks for help", why:"Early help matters." },
          { t:"Give the sibling a meal plan", why:"Professionals guide treatment. " + M5 },
          { t:"Tease the sibling into eating", why:"Harmful." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"A fictional brand’s post reads “Guilt-free snacks to earn your body goals.” Which analysis is strongest?", options:[
          { t:"It uses moral food words (“guilt-free”, “earn”) and links worth to body goals to sell snacks; it profits from insecurity", ok:true, why:M7 + " And it profits from insecurity." },
          { t:"It’s a neutral product description", why:"It’s persuasive and moralizing." },
          { t:"It’s helpful nutrition advice", why:"No evidence; it’s marketing." },
          { t:"It’s fine because the snacks might be nutritious", why:"The message is the issue." }] },
        b:{ prompt:"Which rewrite of “Clean eating for a better you!” is body-respectful?", options:[
          { t:"“Enjoy a variety of foods that give you energy for what you love.”", ok:true, why:"Plain, welcoming words: no moral labels and no body talk." },
          { t:"“Eat clean, get lean!”", why:M7 },
          { t:"“Cut the junk, love your body!”", why:M7 },
          { t:"“Guilt-free meals for summer!”", why:M7 }] } }
    ]
  },
  task:{
    title:"Support card", summary:"Support card",
    statement:"<p>Create a one-page support card for students at your school: what eating disorders are, myths and facts, how to support a friend, and where to get help. Your card must be accurate, supportive and free of numbers and body talk.</p>",
    statementB:"<p><strong>Option B: Media critique.</strong> Analyse three fictional diet-culture captions from Part 3 and rewrite them, with a short paragraph on who benefits.</p>",
    options:[{ id:"card", t:"Support card" }, { id:"critique", t:"Option B: Media critique" }],
    checks:["Accurate information", "Myths corrected", "How to help", "Where to get help", "No numbers or body talk", "Message length"],
    // AUTHORED: option B's lines 1–3 (the plan: "the checklist adapts lines 1–3 to the critique")
    checksB:["Three diet-culture captions analysed", "Each caption rewritten", "Who benefits", "Where to get help", "No numbers or body talk", "Message length"],
    tips:["Pick two statements that explain what eating disorders are.", "Correct at least two myths, like “you can tell by looking”.", "Don’t leave out “involve a trusted adult”.", "Include at least one helpline.", "Your message flagged a word: {w}. Try describing feelings, people and help instead.", "Aim for 40–100 words."],
    tipsB:["Choose three diet-culture captions and name what each one does.", "Rewrite each caption in plain, welcoming words (at least three words each).", "Say who benefits: name the companies, products or profit behind the message."],
    numTip:"Your card has a number in it. Leave numbers out of what you write (helpline numbers are added for you).",
    explainPrompt:"Explain two choices you made to keep your card supportive and safe, and why they matter.",
    vocab:"Use the words stigma, supportive, trusted adult and recovery.",
    checkLabel:"Check my card",
    success:"Your card works.",
    more:"There’s more than one good card. Can you make another?",
    audiences:[{ id:"g910", t:"Grade 9–10" }, { id:"g1112", t:"Grade 11–12" }],
    // AUTHORED vetted bank (built from the plan's overview, misconceptions and flashcards)
    whatBank:[
      { id:"w1", t:"Eating disorders are serious mental illnesses with physical effects." },
      { id:"w2", t:"Eating disorders affect people of every size and gender." },
      { id:"w3", t:"Eating disorders affect people of every age, culture and income." },
      { id:"w4", t:"They come from a mix of biological, psychological and social factors. No one chooses them." },
      { id:"w5", t:"You can’t tell by looking whether someone is struggling." },
      { id:"w6", t:"Recovery is possible, and early help makes a real difference." },
      { id:"w7", t:"Anorexia nervosa, bulimia nervosa, binge-eating disorder and ARFID are serious, treatable illnesses." },
      { id:"w8", t:"Binge-eating disorder is a recognized illness involving loss of control and distress. It isn’t about willpower." },
      { id:"w9", t:"ARFID means avoiding or restricting food for reasons other than body image, such as sensory sensitivity, fear of choking or low interest in eating." },
      { id:"w10", t:"Treatment teams (doctors, therapists, dietitians and families) help people recover." },
      { id:"w11", t:"Boys and men can develop eating disorders, and they’re often missed." },
      { id:"w12", t:"Asking for help is a strength." }],
    mythBank:[
      { id:"p1", myth:"You can tell by looking at someone’s size.", fact:M1 },
      { id:"p2", myth:"Only teenage girls get eating disorders.", fact:M2 },
      { id:"p3", myth:"Eating disorders are a choice, a phase or about vanity.", fact:M3 },
      { id:"p4", myth:"Binge-eating disorder is just a lack of willpower.", fact:M4 },
      { id:"p5", myth:"The way to help is to comment on their eating or appearance.", fact:M5 },
      { id:"p6", myth:"If a friend asks you to keep it secret, you must.", fact:M6 }],
    moves:[
      { id:"mi", t:"Share your concern with an “I” statement" },
      { id:"ml", t:"Listen without judging" },
      { id:"mn", t:"Don’t comment on weight, food or appearance" },
      { id:"mp", t:"Suggest professional help" },
      { id:"ma", t:"Involve a trusted adult", key:true }],
    // VERIFY: helpline numbers and hours before release (plan)
    contacts:[
      { id:"khp", t:"Kids Help Phone", detail:"1-800-668-6868, or text CONNECT to 686868", line:true },
      { id:"nedic", t:"NEDIC helpline", detail:"1-866-633-4220", line:true },
      { id:"coun", t:"School counsellor" },
      { id:"doc", t:"Family doctor" },
      { id:"adult", t:"A trusted adult" }],
    blocked:["calorie", "kg", "lb", "pound", "BMI", "skinny", "thin", "fat", "overweight", "underweight", "slim", "diet", "clean", "junk", "guilt", "cheat", "earn", "burn"],
    // the own-words myth and option B's "who benefits" paragraph name what they correct, so they're checked for digits and these only
    blockedBody:["calorie", "kg", "lb", "pound", "BMI", "skinny", "thin", "fat", "overweight", "underweight", "slim"],
    // option B: techniques (AUTHORED), "who benefits" words for line 3 (AUTHORED structural check)
    techniques:[{ id:"earn", t:"Food has to be earned" }, { id:"moral", t:"Moral words (guilt, clean)" }, { id:"goodbad", t:"Foods sorted into good and bad" }, { id:"worth", t:"Links worth to body" }],
    benefitWords:["company", "companies", "business", "brand", "profit", "sell", "money", "industry", "advertiser"]
  },
  cards:[
    ["Eating disorder", "A serious mental illness affecting eating, thoughts and feelings, with physical effects; treatable."],
    ["Anorexia nervosa", "An illness involving restriction of food and an intense fear related to weight and shape; it can seriously harm the heart, bones and other organs."],
    ["Bulimia nervosa", "An illness involving repeated cycles of binge eating followed by behaviours meant to “undo” eating, which harm the body."],
    ["Binge-eating disorder", "An illness involving repeated episodes of eating with loss of control and distress. Not a willpower problem."],
    ["ARFID", "Avoidant/restrictive food intake disorder: avoiding or restricting food for reasons other than body image (sensory, fear, low interest)."],
    ["Risk factors", "Biological (family history), psychological (anxiety, perfectionism) and social (weight stigma, diet culture) factors combine."],
    ["Protective factors", "Supportive relationships, media literacy, body-respectful environments, shared meals."],
    ["Weight stigma", "Negative attitudes and treatment based on body size; a harm and a risk factor."],
    ["Diet culture", "Messages that link worth to body size and moralize food (“clean”, “guilt-free”, “earn it”)."],
    ["Supporting a friend", "“I” statements, listen, no comments on weight, food or looks, suggest professional help, involve a trusted adult."],
    ["Treatment and recovery", "Early help from a team (doctor, therapist, dietitian, family); recovery is possible."],
    // VERIFY: helpline numbers (plan)
    ["Where to get help", "A trusted adult, school counsellor or doctor; Kids Help Phone; NEDIC."]
  ]
};
