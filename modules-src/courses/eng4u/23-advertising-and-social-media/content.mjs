// ENG4U 23 Advertising & Social Media Rhetoric. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/23-advertising-and-social-media.md
// Public-domain texts: Aristotle, Rhetoric, trans. W. Rhys Roberts (1924), Book I ch. 2; Abraham Lincoln, Temperance Address (1842).
// VERIFY: both quotations against a reliable PD edition (wording here follows the plan, which matches the standard texts).
// Every ad, post, brand, creator handle and persona below is a fictional practice model written for this module; no real brand,
// creator or logo appears. The plan's worked examples of real campaigns are left out of the page (owner's instruction: mock ads only).
// VERIFY: worked-example campaigns (plan Explore) if a teacher adds them: dates and attributions.
// VERIFY: search every practice-model name (Northwick, Zestlet, Emberlyn, Tamarack Hollow, Lanternhill, Pixelpine, FreshThread,
//   StudySpark, Gleam, Cushion+, Loon Lake Bottles, @juniper.ok) for real Canadian trademarks or accounts; rename any that match.
// VERIFY: Canadian disclosure guidance (Competition Act; Ad Standards influencer marketing disclosure guidelines): which connections
//   count (payment, free product, commission, employment, paid travel), wording and placement. Plan marks every specific "verify".
// VERIFY: Text C small print wording against the current Canadian caffeinated-energy-drink label requirement.
// REAL-EXAMPLE SLOT: the teacher chooses current real ads and posts each term (R-A to R-D, the disclosure audit, the ladder's real
//   campaign). The module shows the slot criteria and records the student's notes only; nothing scored depends on them.

const M1 = "Feeling is a fair part of a decision. Ask whether the emotion is relevant and honest, not whether it’s there.";
const M2 = "A statistic is only as strong as its sample. “9 out of 10 we asked” may mean 9 people.";
const M3 = "Ethos is credibility <em>on this subject</em>. Fame in one field doesn’t transfer automatically to another.";
const M4 = "Every choice of word, image and price narrows the audience. Ask who the text imagines.";
const M6 = "Payment, a free product or a commission makes it advertising, and it should say so up front.";   // VERIFY: Canadian guidance
const M7 = "A feed is ranked for <em>you</em>, from your data, to keep you watching. It isn’t neutral.";
const M8 = "Kairos is the fitting moment (exam season, a snowstorm). Scarcity claims a limited supply or deadline. They often travel together, but they aren’t the same appeal.";
const SET = (m) => " <button type='button' class='btn ghost sm rx-setup' data-setup='" + m + "'>Set it up</button>";
const RUB = "<details class='alg rx-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Criterion</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  "<tr><td>Knowledge: appeals used accurately</td><td>Appeals mislabelled or absent</td><td>Some appeals accurate</td><td>Three appeals used and labelled accurately</td><td>Appeals interwoven precisely, each doing distinct work</td></tr>" +
  "<tr><td>Thinking: fit to audience</td><td>Audience vague</td><td>Audience named but choices generic</td><td>Choices clearly suit the audience</td><td>Choices anticipate the audience’s beliefs and objections</td></tr>" +
  "<tr><td>Communication: diction and rhythm</td><td>Wordy or flat</td><td>Clear but plain</td><td>Vivid, concise, purposeful diction</td><td>Memorable phrasing; rhythm and word order serve emphasis</td></tr>" +
  "<tr><td>Application: ethics and transparency</td><td>Misleading claims</td><td>Mostly honest; some vagueness</td><td>Honest, transparent, respectful</td><td>Honesty becomes part of the persuasion itself</td></tr></tbody></table></div></details>";

// The practice model: six fictional texts (E12 layers). kind: image | copy | frame | small. Element ids are used by the challenges.
const TEXTS = [
  { id:"A", name:"Northwick Trail Boots", form:"Magazine ad", els:[
    { id:"img", kind:"image", lab:"Image", t:"A hiker on a granite ridge at sunrise above a lake" },
    { id:"head", kind:"copy", lab:"Headline", t:"Go where the map runs out." },
    { id:"body1", kind:"copy", lab:"Body", t:"Tested on 400 km of Shield trail." },
    { id:"body2", kind:"copy", lab:"Body", t:"9 out of 10 park staff we asked would wear them again." },
    { id:"tag", kind:"copy", lab:"Tagline", t:"Northwick. Made for the north in you." },
    { id:"small", kind:"small", lab:"Small print", t:"Survey of 10 staff at one private campground." }] },
  { id:"B", name:"@juniper.ok for Zestlet Gummies", form:"Creator post", els:[
    { id:"img", kind:"image", lab:"Photo", t:"A smoothie bowl beside a bottle of gummies on a desk with textbooks" },
    { id:"c1", kind:"copy", lab:"Caption", t:"Honestly obsessed 😍 these little guys got me through exam season." },
    { id:"c2", kind:"copy", lab:"Caption", t:"Everyone in my gym group is on them now!!" },
    { id:"c3", kind:"copy", lab:"Caption", t:"Link in bio for 20% off with code JUNI20, ends Sunday ⏰" },
    { id:"tags", kind:"small", lab:"Hashtags", t:"#studytok #examseason #wellness #gymlife #smoothiebowl #studygram #selfcare #glowup #gifted" }] },
  { id:"C", name:"Emberlyn Energy: “Solar Mango”", form:"15-second video storyboard", els:[
    { id:"f1", kind:"frame", lab:"F1", t:"Close-up of a sweating can; a low bass hum" },
    { id:"f2", kind:"frame", lab:"F2", t:"Slow-motion skateboarder mid-air" },
    { id:"f3", kind:"frame", lab:"F3", t:"On-screen text: “LIMITED SUMMER DROP.”" },
    { id:"f4", kind:"frame", lab:"F4", t:"A cheering festival crowd" },
    { id:"f5", kind:"frame", lab:"F5", t:"Voice-over: “Only till August. Don’t be the one who missed it.”" },
    { id:"f6", kind:"frame", lab:"F6", t:"Logo and “Emberlyn. Feel the spark.”" },
    { id:"small", kind:"small", lab:"Small print (2 seconds)", t:"Not recommended for children, pregnant or breastfeeding people, or people sensitive to caffeine" }] },
  { id:"D", name:"Tamarack Hollow Credit Union", form:"Billboard", els:[
    { id:"img", kind:"image", lab:"Image", t:"A grandparent and a child planting a sapling" },
    { id:"head", kind:"copy", lab:"Headline", t:"We grow with you." },
    { id:"body", kind:"copy", lab:"Body", t:"Local since 1952. No hidden fees. Just neighbours." }] },
  { id:"E", name:"Lanternhill Animal Rescue", form:"Charity ad (PSA)", els:[
    { id:"img", kind:"image", lab:"Image", t:"A black-and-white photo of a dog looking through a fence" },
    { id:"copy", kind:"copy", lab:"Copy", t:"She has waited 214 days. $5 a week brings her home." },
    { id:"btn", kind:"copy", lab:"Button", t:"Sponsor Juno" }] },
  { id:"F", name:"Pixelpine P9 phone", form:"Brand launch post", els:[
    { id:"img", kind:"image", lab:"Image", t:"A phone floating on a dark gradient" },
    { id:"c1", kind:"copy", lab:"Copy", t:"Pure. Bold. Yours." },
    { id:"c2", kind:"copy", lab:"Copy", t:"The camera the pros are switching to." },
    { id:"cd", kind:"copy", lab:"Countdown", t:"Drops in 3 days" }] }
];

export default {
  id:"23-advertising-and-social-media",
  kind:"topic",
  title:"Advertising and social media rhetoric",
  topic:"Advertising & Social Media Rhetoric",
  readyTopic:"advertising and social media rhetoric",
  hero:{
    headline:"Twenty-four centuries old, and still selling you sneakers",
    text:"Every ad you scroll past is making an argument. It borrows your trust in a speaker (<strong>ethos</strong>), stirs a feeling (<strong>pathos</strong>), offers reasons (<strong>logos</strong>) and picks its moment (<strong>kairos</strong>). Learn to see the choices, and you can judge them. Then you can make them yourself, honestly.",
    muted:"Work through the six parts in order. Your answers save on this device as you go, so you can stop and come back later.",
    fig:{ html:"<div class='rx-hero' id='rx-hero' role='group' aria-label='Aristotle’s three modes of persuasion are read aloud. Three phrases lift out as labelled chips (ethos, pathos, logos) and land on a practice boot ad: ethos on the park-staff quote, pathos on the sunrise ridge, logos on “tested on 400 km”. A fourth chip, kairos, arrives late and lands on a “Fall sale ends Sunday” banner.'></div>", caption:"" },
    passage:["Of the modes of persuasion furnished by the spoken word there are three kinds.", "The first kind depends on the personal character of the speaker;", "the second on putting the audience into a certain frame of mind;", "the third on the proof, or apparent proof, provided by the words of the speech itself."],
    cite:"(Aristotle, <i>Rhetoric</i>, trans. W. Rhys Roberts, 1924, Book I, ch. 2)",
    chips:[{ ap:"ethos", phrase:"the personal character of the speaker", p:1, land:"On the park-staff quote" }, { ap:"pathos", phrase:"a certain frame of mind", p:2, land:"On the sunrise ridge" }, { ap:"logos", phrase:"the proof, or apparent proof", p:3, land:"On “tested on 400 km”" }],
    late:{ ap:"kairos", note:"Aristotle’s students added timing", land:"On “Fall sale ends Sunday”" },
    banner:"Fall sale ends Sunday",
    caption:"Same moves, new screens.",
    listen:"Listen", watch:"Watch again", noVoice:"Read it yourself: say the passage aloud, pausing at each semicolon."
  },
  goals:[
    "I can identify ethos, pathos, logos and kairos in an ad or post, and explain how each works on its audience.",
    "I can name persuasive techniques (bandwagon, scarcity, testimonial, plain folks, glittering generalities) and point to the exact words, images or sounds that create them.",
    "I can infer a text’s target audience and purpose from its choices, and explain why different audiences respond to it differently.",
    "I can explain how platforms, algorithms and data shape which persuasive messages I see.",
    "I can evaluate whether a persuasive text is honest and transparent, including whether sponsored content is disclosed.",
    "I can use rhetorical appeals deliberately and ethically in my own persuasive writing."
  ],
  start:{
    blocks:[{ title:"Word story: advertise, persuade", html:"<p><strong><em>Advertise</em></strong> comes from the Latin <em>advertere</em>, “to turn toward”: an ad is, literally, something that turns your attention.</p><p><strong><em>Persuade</em></strong> comes from <em>persuadere</em>, built on <em>suadere</em>, “to urge”. That root is related to <em>suavis</em>, “sweet”. To persuade is, at root, to make something sweet to someone.</p><p><strong>Keep both pictures in mind:</strong> what is this text turning me toward, and how is it sweetening the turn?</p><p><button type='button' class='btn ghost sm' id='rx-ws-listen' hidden>Listen</button></p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"The appeals", goal:1, prompt:"A speaker says: “As an emergency-room nurse for twenty years, I’ve treated too many falls from ladders.” Which appeal does the first half of the sentence mainly use?",
          options:[{ t:"Ethos", ok:true, why:"Her years of relevant experience make her credible on this subject." },
            { t:"Logos", why:"Twenty years is a credential, not a reason or a piece of evidence about ladders." },
            { t:"Pathos", why:"The word “too many” adds feeling, but the first half establishes who she is." },
            { t:"Kairos", why:"Nothing here is about timing." }],
          hints:["Is the phrase about the speaker, the audience or the argument?", "“As an emergency-room nurse…” tells you who is talking.", "Credibility from experience is ethos."] },
        { id:"w2", skill:"The appeals", goal:1, prompt:"“Each refill pouch uses 70% less plastic than a new bottle, so a family that switches keeps about 30 bottles a year out of the bin.” Which appeal?",
          options:[{ t:"Logos", ok:true, why:"It gives a figure and reasons from it to a consequence." },
            { t:"Pathos", why:"There’s no emotional language; it’s a calculation." },
            { t:"Ethos", why:"The speaker’s credibility isn’t mentioned." },
            { t:"Kairos", why:"No moment or deadline is invoked." }],
          hints:["Look for evidence plus a “so”.", "“70% less… so… 30 bottles” is reasoning.", "Logos."] },
        { id:"w3", skill:"Connotation", goal:2, prompt:"A furniture shop wants “old” to sound appealing. Which word does that best?",
          options:[{ t:"Vintage", ok:true, why:"It suggests style, character and value." },
            { t:"Used", why:"It’s accurate, but it suggests second-hand wear." },
            { t:"Aged", why:"It’s neutral to negative here; it can suggest decline." },
            { t:"Worn", why:"It points straight at damage." }],
          hints:["Same meaning, different feeling.", "Which word would appear on a price tag <em>raising</em> the price?", "Vintage."] },
        { id:"w4", skill:"Connotation", goal:2, prompt:"A rental listing calls an apartment “cozy”. What is the word most likely softening?",
          options:[{ t:"That the apartment is small", ok:true, why:"“Cozy” turns small into warm. That’s a euphemism." },
            { t:"That the apartment is cold", why:"In a listing, “cozy” is about size far more often than temperature." },
            { t:"That the rent is high", why:"“Cozy” says nothing about price." },
            { t:"Nothing; it’s a neutral description", why:"Connotations are never neutral in an ad." }],
          hints:["Why would a seller choose a feeling-word instead of a measurement?", "What would “cozy” replace if the listing had to be blunt?", "Small."] },
        { id:"w5", skill:"Audience and purpose", goal:3, prompt:"A poster beside a hospital elevator reads: “Wash your hands: 20 seconds protects everyone on this floor.” What is its main purpose?",
          options:[{ t:"To persuade people to act", ok:true, why:"It asks for a specific behaviour, with a reason." },
            { t:"To entertain", why:"Nothing is designed for enjoyment." },
            { t:"To sell soap", why:"No product or brand is named." },
            { t:"To report news", why:"It doesn’t describe an event." }],
          hints:["What does it want you to <em>do</em>?", "It’s an instruction plus a reason.", "To persuade."] },
        { id:"w6", skill:"Media forms", goal:4, prompt:"Which feature belongs to a social media post but not to a printed magazine ad?",
          options:[{ t:"Comments, shares and a ranking feed that decides who sees it", ok:true, why:"The audience interacts, and the platform chooses its readers." },
            { t:"A headline", why:"Print ads have headlines too." },
            { t:"An image", why:"Both use images." },
            { t:"A logo", why:"Both carry logos." }],
          hints:["What can a reader <em>do</em> to a post?", "And who decides which posts you see?", "Interaction and the feed."] }
      ],
      refreshers:{
        "The appeals":"Ethos: why trust this speaker? Pathos: what feeling is being stirred? Logos: what reasons or evidence? Kairos: why now? One line can use more than one.",
        "Connotation":"Words with the same dictionary meaning carry different feelings: vintage, used, aged, worn. Advertisers choose the feeling.",
        "Audience and purpose":"Every media text is made by someone, for someone, to do something. Ask all three questions.",
        "Media forms":"A form’s conventions shape its message. On social platforms, an algorithm also shapes who sees it."
      }
    }
  },
  explore:{
    heading:"Rhetoric x-ray",
    intro:"Start with real ads and posts: put them under the x-ray and tag what persuades. Then use the practice model to change one word and watch the effect, show a text to different people, and find out why a feed showed it to you.",
    modes:[{ id:"xray", t:"X-ray" }, { id:"dial", t:"Word dial" }, { id:"lens", t:"Audience lens" }, { id:"feed", t:"Feed simulator" }],
    how:{
      xray:"Choose a text. Tap an element (a line of copy, the image or a storyboard frame), then tag it with an appeal and, if you like, a technique. Add a one-line note: how does this work on its audience?",
      dial:"Choose a slot, then swap the highlighted word along its scale. The tone readout scores warmth, urgency and trust from 0 to 5.",
      lens:"Choose a text, then show it to a persona. The readout gives their likely response and the reason.",
      feed:"Choose the persona’s age band, then switch on data signals: up to 2 liked interests, 1 recent search and a time of day. The six cards rank by a score you can read in full."
    },
    modelNote:"The practice model: six fictional texts written for this module. Their brands, creators and people are invented, so they can be rewritten and tested without putting words in anyone’s mouth.",
    texts:TEXTS,
    appeals:[{ id:"ethos", t:"Ethos", role:"syntax", q:"trust in the speaker" }, { id:"pathos", t:"Pathos", role:"figure", q:"the audience’s feelings" }, { id:"logos", t:"Logos", role:"image", q:"reasons and evidence" }, { id:"kairos", t:"Kairos", role:"sound", q:"the fitting moment" }],
    techniques:[{ id:"bandwagon", t:"Bandwagon" }, { id:"scarcity", t:"Scarcity" }, { id:"testimonial", t:"Testimonial" }, { id:"plain", t:"Plain folks" }, { id:"glitter", t:"Glittering generality" }, { id:"transfer", t:"Transfer (borrowed associations)" }],
    notePh:"How does this work on its audience?",
    weakReasons:[{ id:"sample", t:"Ten staff at one private campground is too small and too narrow to support “park staff” in general.", ok:true }, { id:"tiny", t:"It’s in small print, so it doesn’t count." }, { id:"stats", t:"Statistics are always misleading." }, { id:"dull", t:"It’s dull next to the sunrise image." }],
    weakLabel:"Weak link (TC2)", weakMark:"Mark as the weak link", weakNone:"No element marked yet.",
    // P2's fixed x-ray of Text C (display only; the student's own tags are kept)
    demoC:{ f1:{ ap:["pathos"], tech:[] }, f2:{ ap:["pathos"], tech:["transfer"] }, f3:{ ap:["kairos"], tech:[] }, f4:{ ap:["pathos"], tech:["bandwagon"] }, f5:{ ap:[], tech:["scarcity"] } },
    urgency:{ before:4, after:1, label:"Urgency (summary bar)" },
    real:{
      title:"Real examples from your teacher",
      intro:"Your teacher chooses current real ads and posts each term and shares them as credited screenshots or clips. X-ray each one here: name the appeal or technique and point to the exact word, image or sound that creates it. These notes are unscored; your teacher reads them in your summary.",
      slots:[
        { id:"ra", t:"R-A Print or web ad", crit:"At least two of the four appeals, plus a headline and a tagline", task:"Tag every appeal and technique; write how each works on the target audience." },
        { id:"rb", t:"R-B Creator post", crit:"A post from a creator with a brand relationship (paid, gifted or affiliate)", task:"Tag the appeals; locate the disclosure (its wording and position); judge whether it’s clear." },
        { id:"rc", t:"R-C Video ad, 15–60 seconds", crit:"Scarcity or kairos (a deadline, a season, a limited drop)", task:"Tag the frames that create urgency; decide whether the urgency is true." },
        { id:"rd", t:"R-D Charity or public-service ad", crit:"Pathos as the main appeal", task:"Tag the pathos; apply the honest and relevant tests from Part 3." }
      ],
      creditPh:"Credit: brand or creator, agency if known, platform, date",
      notesPh:"Appeal or technique → the exact word, image or sound → how it works on the audience",
      hunt:"Technique hunt (unscored): match each technique (bandwagon, scarcity, testimonial, plain folks, glittering generality, transfer) to a line or image from these real examples, with a credit."
    },
    dial:{
      slots:[
        { id:"D", text:"D", lab:"Text D headline", before:"“", after:" grow with you.”", opts:[{ w:"We", v:[5, 1, 4] }, { w:"Banks", v:[1, 1, 2] }, { w:"Tamarack", v:[3, 1, 3] }, { w:"Somebody", v:[2, 1, 1] }] },
        { id:"C", text:"C", lab:"Text C voice-over", before:"“Only till ", after:".”", opts:[{ w:"August", v:[2, 3, 2] }, { w:"tonight", v:[2, 5, 1] }, { w:"forever", v:[2, 0, 2] }, { w:"stocks last", v:[2, 4, 1] }] },
        { id:"A", text:"A", lab:"Text A tagline", before:"“Made for the north ", after:".”", opts:[{ w:"in you", v:[5, 1, 3] }, { w:"in Canada", v:[3, 1, 3] }, { w:"in stores", v:[1, 1, 2] }, { w:"on the map", v:[2, 1, 2] }] }
      ],
      dims:["Warmth", "Urgency", "Trust"]
    },
    lens:{
      texts:["E", "C", "D"],
      personas:[
        { id:"ruth", n:"Ruth", d:"70, retired, adopted two dogs before" },
        { id:"dax", n:"Dax", d:"16, part-time job, allergic to dogs" },
        { id:"amira", n:"Amira", d:"29, nurse, works night shifts" }
      ],
      resp:{
        ruth:{ E:{ dim:"Act", lv:"high", why:"The $5 ask fits her budget, and she knows what a rescue dog gives back." }, C:{ dim:"Attention", lv:"low", why:"Nothing in it is addressed to her." }, D:{ dim:"Trust", lv:"high", why:"“Local since 1952” matches her sense of a trustworthy institution." } },
        dax:{ E:{ dim:"Act", lv:"low", why:"He’s moved, but he can’t have a dog and has little spare money; he might share it instead." }, C:{ dim:"Attention", lv:"high", why:"Skate and festival images are aimed squarely at his age group, which raises an ethics question (see Part 3)." }, D:{ dim:"Trust", lv:"medium", why:"Warm, but banks feel far from his life." } },
        amira:{ E:{ dim:"Act", lv:"medium", why:"She cares, but her schedule makes adoption hard; sponsorship is the easier yes." }, C:{ dim:"Attention", lv:"medium", why:"The caffeine pitch reaches her, but she knows the risks and reads the small print." }, D:{ dim:"Trust", lv:"medium", why:"“No hidden fees” is the line that matters to her." } }
      }
    },
    feed:{
      ages:["13–17", "18–24", "25–44", "45+"],
      interests:["outdoors", "fitness", "gaming", "finance", "pets", "tech"],
      searches:["hiking boots", "exam tips", "adopt a dog", "new phone"],
      times:["morning", "late night"],
      pts:{ age:2, interest:3, search:4, time:1 },
      cards:[
        { id:"A", ages:["25–44"], ints:["outdoors"], search:"hiking boots", time:"morning" },
        { id:"B", ages:["13–17", "18–24"], ints:["fitness"], search:"exam tips", time:"late night" },
        { id:"C", ages:["18–24"], gate:"13–17", ints:["gaming"], search:"", time:"late night" },
        { id:"D", ages:["45+"], ints:["finance"], search:"", time:"morning" },
        { id:"E", ages:"all", ints:["pets"], search:"adopt a dog", time:"" },
        { id:"F", ages:["18–24"], ints:["tech"], search:"new phone", time:"late night" }
      ],
      rules:"<ul><li>A matched age band: <strong>+2</strong>. A matched liked interest: <strong>+3</strong>. A matched recent search: <strong>+4</strong>. A matched time of day: <strong>+1</strong>.</li><li>Card C is <strong>age-gated</strong>: it scores 0 for ages 13–17.</li><li>Card E uses <strong>broad targeting</strong>: +2 for every age band.</li><li><strong>Ties:</strong> the card earlier in the list (A to F) ranks first.</li></ul>",
      rulesTable:[["A", "25–44", "outdoors", "“hiking boots”", "morning"], ["B", "13–17, 18–24", "fitness", "“exam tips”", "late night"], ["C", "18–24 only (age-gated: 0 for 13–17)", "gaming", "(none)", "late night"], ["D", "45+", "finance", "(none)", "morning"], ["E", "all ages (+2 for every persona: broad targeting)", "pets", "“adopt a dog”", "(none)"], ["F", "18–24", "tech", "“new phone”", "late night"]],
      why:[{ id:"rival", t:"B matched one of my signals and E, its only rival, matched none.", ok:true }, { id:"best", t:"B is the best product for teenagers." }, { id:"pop", t:"The feed shows the most popular post first." }, { id:"paid", t:"Zestlet paid the most to be shown." }],
      whyLabel:"Why did it work? (TC3)",
      followUp:"Optional, outside the module: open the “Why am I seeing this ad?” or ad-preferences page on a platform you use and compare its listed reasons with the simulator’s signals. Only your own notes are kept here.",
      followPh:"What reasons did the platform list? How do they compare with the simulator’s signals?"
    },
    readout:{ ap:"Appeals tagged", tech:"Techniques tagged", tone:"Tone (word dial)", resp:"Likely response (audience lens)", rank:"Feed ranking", why:"Why am I seeing this?" },
    aha:"Persuasion is a set of choices that can be pointed to. Change a word and the trust changes; change the viewer and the response changes; change your data and the persuasion that finds you changes.",
    predictions:[
      { id:"p1", start:{ mode:"dial", slot:"D", w:"We" },
        prompt:"Swap “We grow with you” to “Banks grow with you.” What happens?",
        options:[{ t:"Warmth and trust drop: “we” had cast the credit union as your neighbour", ok:true }, { t:"It becomes more logical" }, { t:"Nothing changes; it’s the same claim" }, { t:"Urgency rises" }],
        explain:"“We” is plain folks and ethos in one syllable: it puts speaker and reader on the same side. “Banks” turns a neighbour into an institution." },
      { id:"p2", start:{ mode:"xray", text:"C" },
        prompt:"Delete frame F5 (the voice-over “Only till August. Don’t be the one who missed it.”). Which tag disappears from the x-ray?",
        options:[{ t:"Scarcity, and much of the urgency", ok:true }, { t:"Ethos" }, { t:"All pathos" }, { t:"Logos" }],
        explain:"The skate and festival frames still carry feeling. Only the deadline line was doing the scarcity work. (The moment, summer, is kairos; the deadline is scarcity.)" },
      { id:"p3", start:{ mode:"lens", text:"E" },
        prompt:"Show the rescue ad to Ruth and to Dax. Who is more likely to act?",
        options:[{ t:"Ruth", ok:true }, { t:"Dax" }, { t:"Both equally, because the photo is so moving" }, { t:"Neither, because emotional ads don’t work" }],
        explain:"Same text, different lives. The $5-a-week ask fits Ruth’s means and history; Dax is moved but can’t adopt. Pathos isn’t a trick here: it’s honest and relevant. The question is whom it can move to act." },
      { id:"p4", start:{ mode:"feed", age:"18–24" },
        prompt:"Switch on the recent search “new phone”. Which card jumps to the top?",
        options:[{ t:"F, Pixelpine", ok:true }, { t:"B, Zestlet" }, { t:"E, Lanternhill" }, { t:"It depends on which ad is best" }],
        explain:"One search outweighed everything else. The feed ranks what matches your data, not what’s “best”." }
    ],
    chalIntro:"Use the x-ray and the feed simulator to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"<strong>X-ray Text A:</strong> tag at least one element for each of ethos, pathos and logos." + SET("tc1"),
        msgs:{ small:"Look again: the small print <em>weakens</em> the logos.", tagK:"Nothing here is about timing. “The north in you” is about identity, which is pathos.", headL:"“Go where the map runs out” gives no reason or evidence; it offers a feeling of freedom.", missing:"Tag Text A until ethos, pathos and logos each sit on an element that creates them." },
        general:"Not yet. Ask of each element: who vouches (ethos), what feeling (pathos), what evidence (logos)?",
        why:"Ethos sits with the park staff who vouch, logos with the 400 km test (and the staff figure), and pathos with the sunrise ridge and the identity lines. The park-staff sentence can carry ethos and logos at once.",
        hints:["Ethos is about who vouches; logos is about evidence; pathos is about feeling.", "Who vouches for the boots? What numbers are offered? What feeling does the sunrise create?", "Ethos: the park staff. Logos: 400 km tested. Pathos: the ridge at sunrise."] },
      { id:"tc2", goal:2, prompt:"<strong>Find the weak link:</strong> tap the element in Text A that most undermines its logos, mark it as the weak link, then choose why." + SET("tc2"),
        msgs:{ none:"Tap an element of Text A, press <strong>Mark as the weak link</strong>, then choose a reason.", tiny:"Small print counts legally. The problem is what it reveals: the sample.", img:"The image is pathos; it doesn’t claim evidence.", stats:"Many statistics are sound. This one isn’t, because of its sample." },
        general:"Not yet. Where does the ad tell you how its number was produced?",
        why:"Ten staff at one private campground is too few, and they aren’t “park staff” in general: the small print quietly takes back the body copy’s claim.",
        hints:["Where does the ad tell you how its number was produced?", "Read the small print: how many people, from where?", "Ten staff at one private campground: too few, and not “park staff” in general."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Feed simulator:</strong> the persona is 15. Make the Zestlet post (B) rank <strong>strictly first</strong> using <strong>exactly one</strong> signal. Then choose the sentence that explains why it worked." + SET("tc3"),
        msgs:{ age:"The persona is 15: set the age band to 13–17.", none:"B ties with E at 2, and the tie goes to default order. One matching signal breaks it.", many:"Ranked first, but the challenge asked for exactly one signal. Which single signal is enough?", gaming:"Gaming matches C, but C is age-gated for a 15-year-old, so B and E still tie.", pets:"That lifts E, the rescue ad, above B.", why:"B is first. Now choose the sentence that explains why it worked." },
        general:"Not yet. Open “How the score works”: you need one signal that B matches and E doesn’t.",
        why:"One data point decided what a 15-year-old saw. That’s the attention economy in a single click.",
        hints:["Open “How the score works”. With no signals, what do B and E each score?", "Both score 2. You need one signal that B matches and E doesn’t.", "Fitness, “exam tips” or late night: any one of them puts B strictly first."] }
    ],
    blocks:[]
  },
  part3:{
    slug:"disclosure", name:"Disclosure",
    heading:"Disclosure and responsibility",
    intro:"Explore taught you to <em>see</em> persuasion. Here you ask whether a piece of persuasion is <em>fair</em>, and who must say what. Sort, rewrite, then climb the ethics ladder.",
    craft:"Where the disclosure sits changes how the whole caption reads.",
    s1:{ title:"Station 1: Is it an ad?", how:"Each card says what a creator received. Sort it: must they disclose?",
      boxes:[{ id:"must", t:"Must disclose" }, { id:"no", t:"No disclosure needed" }],
      // VERIFY: Canadian guidance for each connection (free product, affiliate commission, employment, paid travel).
      cards:[
        { id:"c1", t:"Paid $300 by a brand to post", answer:"must", fb:"Payment is a material connection." },
        { id:"c2", t:"Received a free product, no payment", answer:"must", fb:"A gift is a connection, even if they love the product." },
        { id:"c3", t:"Uses an affiliate code that earns a commission", answer:"must", fb:"A commission is a material connection: they earn when you buy." },
        { id:"c4", t:"Posts about a product they bought themselves, with no connection to the brand", answer:"no", fb:"No payment, gift, commission or job: it’s an ordinary opinion." },
        { id:"c5", t:"Is employed by the company and posts about its product", answer:"must", fb:"Employment is a connection: their pay comes from the brand." },
        { id:"c6", t:"Reviews a library book they borrowed", answer:"no", fb:"Borrowing from a library creates no connection to the publisher." },
        { id:"c7", t:"Was flown to a product launch by the brand", answer:"must", fb:"Paid travel is a material benefit from the brand." },
        { id:"c8", t:"Promotes their own handmade jewellery shop", answer:"must", fb:"It’s their own business, so they should make that clear, e.g. “my shop”." }
      ],
      wrongMust:"Look again: something of value passed from the brand to the creator. A gift is a connection, even if they love the product.",
      wrongNo:"Look again: is there any payment, gift, commission or job here? If not, it’s an ordinary opinion." },
    audit:{ title:"Real disclosure audit", how:"Your teacher shares three current real creator posts that involve a brand relationship (credited). For each, record what you find. Unscored: your teacher reviews your judgments.",
      posts:["Post 1", "Post 2", "Post 3"],
      fields:[{ id:"words", t:"Exact disclosure wording, or “none found”" }, { id:"pos", t:"Position (which word of the caption, or where on screen)" }, { id:"clear", t:"Clear, early and plain? Why?" }],
      done:"✓ Every field is filled for all three posts. Your teacher reads your judgments.", notYet:"Fill every field for all three posts." },
    s2:{ title:"Station 2: Fix the disclosure",
      how:"Juniper’s caption buries “#gifted” as the ninth hashtag, and never mentions the commission. Rebuild it: tap chips in the order you want them. Tap a placed chip to take it out.",
      original:"Honestly obsessed 😍 these little guys got me through exam season. Everyone in my gym group is on them now!! Link in bio for 20% off with code JUNI20, ends Sunday ⏰ #studytok #examseason #wellness #gymlife #smoothiebowl #studygram #selfcare #glowup #gifted",
      chips:[
        { id:"ad", t:"Ad:", kind:"disc" },
        { id:"pp", t:"Paid partnership with Zestlet.", kind:"disc" },
        { id:"free", t:"Zestlet sent me these for free.", kind:"disc" },
        { id:"sp", t:"#sp", kind:"short" },
        { id:"p1", t:"Honestly obsessed 😍 these little guys got me through exam season.", kind:"pitch" },
        { id:"p2", t:"Everyone in my gym group is on them now!!", kind:"pitch" },
        { id:"p3", t:"Link in bio for 20% off with code JUNI20, ends Sunday ⏰", kind:"pitch" },
        { id:"com", t:"I earn a commission when you use my code.", kind:"com" },
        { id:"thx", t:"Thanks @Zestlet!!", kind:"thanks" },
        { id:"gift", t:"#gifted", kind:"late" }
      ],
      checks:["A clear disclosure (“Ad”, “Sponsored”, “Paid partnership” or “Zestlet sent me these for free”) within the first 10 words", "The affiliate code’s commission is mentioned", "No unclear shorthand (“#sp”)"],
      flagSp:"“#sp” is shorthand many readers won’t understand. Say it in plain words.",
      flagThx:"“Thanks @Zestlet!!” doesn’t say payment or a gift.",
      okMsg:"✓ Clear, early and plain. Now read the two versions side by side.",
      meaning:"The honest version opens with the relationship, so “Honestly obsessed” now reads as an opinion from a paid partner, which is fair, rather than as a friend’s tip.",
      before:"Before", after:"After" },
    s3:{ title:"Station 3: The ethics ladder",
      how:"Place each practice-model campaign on a rung. Four tests decide the rung.",
      rungs:[{ id:"inform", t:"Inform" }, { id:"persuade", t:"Persuade" }, { id:"manip", t:"Manipulate" }],
      tests:[["Honest", "Are the claims true?"], ["Relevant", "Does the appeal fit the decision?"], ["Transparent", "Do you know who is speaking and why?"], ["Respectful", "Does it leave you free to say no?"]],
      items:[
        { id:"e", t:"Text E: Lanternhill Animal Rescue (“She has waited 214 days.”)", answer:"persuade", fb:"Persuade. The emotion is honest and relevant, and the ask is clear.", wrong:M1 },
        { id:"c", t:"Text C: Emberlyn Energy, with festival and skate imagery reaching under-18s", answer:"manip", fb:"Manipulate. The imagery is aimed at an age group the label itself warns away, and the scarcity is manufactured. The problem is the target and the false urgency, not emotion itself.", wrong:"Look at who the skate and festival images reach, and whether “Only till August” is a real limit." },
        { id:"t", t:"A transit notice listing new bus times", answer:"inform", fb:"Inform. It gives facts you need and asks for nothing.", wrong:"Does it try to change your mind, or just tell you the times?" },
        { id:"b1", t:"Text B <em>before</em> the disclosure fix", answer:"manip", fb:"Manipulate: it isn’t transparent. A paid pitch passes as a friend’s tip.", wrong:"Apply the transparent test: do you know who is speaking, and why?" },
        { id:"b2", t:"Text B <em>after</em> the disclosure fix", answer:"persuade", fb:"Persuade. The relationship is up front, so you can weigh the opinion fairly.", wrong:"Now the relationship comes first. Which tests does it pass?" }
      ],
      debate:"Class debate: these placements are defensible, not absolute. Is guilt ever fair? Where would you put Text E if its photo were staged?",
      realLabel:"One real campaign from your teacher’s examples (unscored): name it, choose a rung, and justify it in one sentence.",
      realPh:"Campaign (with credit), rung, and one sentence: which test decides it?" },
    blocks:[],
    quickCheck:{ title:"Disclosure quick check", summary:"Disclosure quick check",
      items:[
        { id:"q1", goal:5, prompt:"A creator got a free jacket and posts about it. Disclosure?",
          choices:[{ t:"Needed", ok:true, fb:"Right. A free product is a material connection." }, { t:"Not needed: there was no payment", fb:"A free product is a material connection." }, { t:"Only if over $100", fb:"A free product is a material connection." }, { t:"Only on video posts", fb:"A free product is a material connection." }] },
        { id:"q2", goal:5, prompt:"Which placement is clearest?",
          choices:[{ t:"“Ad:” at the start of the caption", ok:true, fb:"Right. Disclosure must be seen before the pitch, not hidden after it." }, { t:"“#ad” as the last of 12 hashtags", fb:"Disclosure must be seen before the pitch, not hidden after it." }, { t:"“#sp” mid-caption", fb:"Disclosure must be seen before the pitch, not hidden after it." }, { t:"In the bio only", fb:"Disclosure must be seen before the pitch, not hidden after it." }] },
        { id:"q3", goal:5, prompt:"Which ethics test does a deadline that is quietly extended every week fail?",
          choices:[{ t:"Honest", ok:true, fb:"Right. A deadline that isn’t real is a false claim." }, { t:"Relevant", fb:"A deadline that isn’t real is a false claim." }, { t:"Transparent", fb:"A deadline that isn’t real is a false claim." }, { t:"Respectful", fb:"A deadline that isn’t real is a false claim." }] },
        { id:"q4", goal:5, prompt:"Text E uses a sad photo. On the ladder it sits at…",
          choices:[{ t:"Persuade", ok:true, fb:"Right. The emotion is honest and relevant to the decision, and you’re free to say no." }, { t:"Manipulate", fb:"The emotion is honest and relevant to the decision, and you’re free to say no." }, { t:"Inform", fb:"The emotion is honest and relevant to the decision, and you’re free to say no." }, { t:"Off the ladder", fb:"The emotion is honest and relevant to the decision, and you’re free to say no." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“If you would win a man to your cause, first convince him that you are his sincere friend.”</p><p class='eng-cite'>(Abraham Lincoln, Temperance Address, 1842)</p><p><strong>The pattern:</strong> “If you would ______, first ______.”</p><p><strong>Your turn:</strong> write your own version about persuasion or any craft.</p><p><strong>Example:</strong> “If you would sell a reader a sentence, first earn the word at its end.”</p><p class='tiny muted'>Lincoln’s “a man” reflects 1842 usage; your imitation can change it.</p>",
      prompt:"Your imitation" }]
  },
  practice:{
    activities:[
      { id:"match", type:"match", title:"Technique ↔ line", summary:"Technique ↔ line", goal:[1, 2],
        instruction:"Match each line with the technique or appeal it uses.",
        leftTitle:"Line", rightTitle:"Technique or appeal",
        left:[
          { id:"l1", t:"“Join the 2 million Canadians who already switched.”", why:"The size of the crowd is the argument: bandwagon." },
          { id:"l2", t:"“Only 40 tickets left at this price.”", why:"A limited supply hurries the decision: scarcity." },
          { id:"l3", t:"“‘I wouldn’t train without it.’ (Olympic rower Maya Tremblay, an invented example; no real athlete is quoted)”", why:"One named person vouches: testimonial." },
          { id:"l4", t:"“No fancy words. Just good bread, baked at 4 a.m. by people who live here.”", why:"The speaker poses as someone just like you: plain folks.", hints:["Who is the speaker pretending to be?", "Someone just like you.", "Plain folks."] },
          { id:"l5", t:"“Pure. Bold. Yours.”", why:"Shining words with no claim inside: glittering generality." },
          { id:"l6", t:"“First snow tonight. Are your tires ready?”", why:"The fitting moment does the work: kairos." },
          { id:"l7", t:"“Our filter removes 99% of lead, as tested by an accredited lab.”", why:"A measurable claim with its evidence: logos." },
          { id:"l8", t:"A tea ad set in a misty mountain monastery", why:"Calm, ancient and pure are borrowed from the setting: transfer.", hints:["What does the setting make you feel about the tea?", "Calm, ancient and pure, none of which the ad claims in words.", "Transfer: feelings borrowed from a setting."] }
        ],
        right:[{ id:"r1", t:"Bandwagon" }, { id:"r2", t:"Scarcity" }, { id:"r3", t:"Testimonial" }, { id:"r4", t:"Plain folks" }, { id:"r5", t:"Glittering generality" }, { id:"r6", t:"Kairos" }, { id:"r7", t:"Logos" }, { id:"r8", t:"Transfer (borrowed associations)" }],
        answer:{ l1:"r1", l2:"r2", l3:"r3", l4:"r4", l5:"r5", l6:"r6", l7:"r7", l8:"r8" },
        wrong:{ "l6|r2":"Nothing is in short supply. The appeal is the <em>moment</em>: first snow.", "l3|r1":"One named person vouching is testimonial; bandwagon is “everyone’s doing it”.", "l5|r7":"Three adjectives, no reasons: glittering generality." },
        wrongDefault:"Ask what the line is asking you to trust: a crowd, a deadline, a person, a moment or a fact." },
      { id:"unseen", type:"custom", title:"Unseen campaign", summary:"Unseen campaign", star:true, goal:[1, 2, 3, 4, 5],
        instruction:"A script you haven’t seen: a fictional fast-fashion “haul” video. Tag lines, choose, then rewrite. Items 4 to 6 sit above Final Check level.", how:"",
        scriptTitle:"FreshThread haul video script (30 seconds; practice model)",
        stage:"[Creator, bright bedroom, racks of clothes]",
        lines:["“OK so FreshThread just dropped 200 new pieces and I grabbed nine for under $60.", "Literally everyone at school asked where my top was from.", "They restock never, so if you see it, get it.", "Use RIA15 for 15% off.", "I’m not sponsored, I just love them.”"],
        screen:"[On screen, 1 second: “Gifted items. Affiliate code.”]",
        items:[
          { id:"u1", kind:"tap", goal:2, prompt:"<strong>U1.</strong> Tag the <strong>bandwagon</strong> line: tap it in the script.", answer:1,
            why:"“Everyone at school” is the crowd: bandwagon.", wrong:{ 2:"That’s not scarcity; it’s the crowd.", def:"Look for the line that points to what everyone else is doing." },
            hints:["Bandwagon is “everyone’s doing it”.", "Who is “everyone” in this script?", "“Literally everyone at school asked…”."] },
          { id:"u2", kind:"tap", goal:2, prompt:"<strong>U2.</strong> Tag the <strong>scarcity</strong> line.", answer:2,
            why:"“They restock never” threatens the supply: scarcity.", wrong:{ 1:"Urgency from supply, not from a moment. That line is the crowd.", def:"Urgency from supply, not from a moment." },
            hints:["Scarcity claims a limited supply or deadline.", "Which line says you may not get another chance?", "“They restock never, so if you see it, get it.”"] },
          { id:"u3", kind:"mc", goal:3, prompt:"<strong>U3.</strong> Who is the most likely target audience?",
            options:[{ t:"Teens on a tight budget who care about fitting in at school", ok:true, why:"“Everyone at school” and “under $60” narrow it." },
              { t:"Everyone who buys clothes", why:M4 }, { t:"Fashion professionals", why:"“Under $60” and “at school” point to students, not professionals." }, { t:"Parents shopping for their children", why:"The creator speaks as a student to students." }],
            hints:["Which words name a place and a price?", "“At school” and “under $60”.", "Teens on a budget who care about fitting in."] },
          { id:"u4", kind:"mc", goal:5, prompt:"<strong>U4 ★</strong> Which statement creates a transparency problem?",
            options:[{ t:"“I’m not sponsored, I just love them,” which is contradicted by the 1-second on-screen note", ok:true, why:"The spoken claim denies the connection the screen admits. That’s a false statement, not just poor placement." },
              { t:"“Use RIA15 for 15% off”", why:"A code is an offer; the problem is the denial that contradicts it." }, { t:"“FreshThread just dropped 200 new pieces”", why:"That’s a product detail, not a statement about the relationship." }, { t:"“Literally everyone at school asked where my top was from”", why:"That’s bandwagon. Transparency is about who is speaking and why." }],
            hints:["Compare what the creator <em>says</em> with what the screen <em>shows</em>.", "Can both be true?", "“Not sponsored” vs “Gifted items. Affiliate code.”"] },
          { id:"u5", kind:"mc", goal:1, prompt:"<strong>U5 ★</strong> Choose the strongest analytical sentence.",
            options:[{ t:"“By pairing a crowd claim (‘everyone at school asked’) with a supply threat (‘they restock never’), the script makes hesitation feel like social risk, while its 1-second disclosure contradicts the creator’s spoken denial of sponsorship.”", ok:true, why:"It names two techniques, quotes them, and says what they do to the viewer." },
              { t:"“The creator shows nine pieces she bought from FreshThread and gives a discount code.”", why:"This states what happens, not how it works on the viewer." },
              { t:"“Fast fashion is bad for the planet, so this video is wrong.”", why:"“Fast fashion is bad” is a view, not an analysis of this text." },
              { t:"“The script uses persuasion to sell clothes to people.”", why:"True of every ad: it names no technique and no effect." }],
            hints:["A strong analytical sentence names a technique, quotes it, and says what it does to the viewer.", "Which option links two techniques and names the effect?", "The option that connects the crowd claim, the supply threat and the contradiction."] },
          { id:"u6", kind:"build", goal:5, prompt:"<strong>U6 ★</strong> Rewrite the last two sentences honestly. Choose a chip for each slot.",
            slots:[
              { id:"open", t:"Opening", opts:[{ id:"ad", t:"Ad: FreshThread gifted these and I earn from my code." }, { id:"none", t:"(no opening line)" }, { id:"tag", t:"#gifted (at the very end instead)" }] },
              { id:"deny", t:"“I’m not sponsored, I just love them.”", opts:[{ id:"keep", t:"Keep it" }, { id:"del", t:"Delete it" }] },
              { id:"stock", t:"“They restock never, so if you see it, get it.”", opts:[{ id:"keep", t:"Keep it" }, { id:"true", t:"Replace: “This drop has 200 pieces; check sizes before you buy.”" }, { id:"cut", t:"Remove it" }] }
            ],
            answer:{ open:"ad", deny:"del", stock:["true", "cut"] },
            okMsg:"✓ Honest, relevant, transparent and respectful: the relationship comes first, the false denial is gone, and the urgency is either true or gone.",
            fb:"Every rung must pass: honest, relevant, transparent, respectful.",
            hints:["Where should the relationship appear: before or after the pitch?", "Can “I’m not sponsored” stay true next to a gift and a code?", "Disclosure at the start; delete the denial; replace “restock never” with a true detail or remove it."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Barnaby", goal:[1, 4, 5],
        instruction:"Barnaby wrote three short analyses. Each has one mistake. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:1, task:"Analyse the appeals in Text D (credit union billboard).",
            steps:["“The billboard shows a grandparent and child planting a sapling.”", "“This image uses pathos: it links saving money with family and growth.”", "“‘Local since 1952’ is logos, because it contains a number.”", "“So the ad relies mostly on reasoning.”"],
            answer:2, stepFb:["Accurate description. Keep checking.", "Sound: the feeling is named and connected.", "", "This follows from sentence 3. The mistake is earlier."],
            fixes:[{ t:"“‘Local since 1952’ is mainly ethos: it builds credibility through long history, not through a reason or evidence about the product.”", ok:true, why:"Right: a founding date builds trust in the speaker." },
              { t:"“‘Local since 1952’ is kairos, because it mentions a date.”", why:"A date isn’t a timely moment." },
              { t:"“It’s pathos, because 1952 feels old.”", why:"The claim is about trustworthiness." },
              { t:"“Sentence 3 is correct.”", why:"Numbers don’t make logos automatically." }],
            hints:["What does a founding date make you think about the speaker?", "Longevity suggests reliability.", "That’s credibility: ethos."] },
          { id:"e2", goal:4, task:"Explain why Dax keeps seeing energy-drink ads.",
            steps:["“Dax watches skateboarding videos late at night.”", "“The platform shows everyone the most popular ads, so he sees the energy drink because it’s popular.”", "“Popular ads are usually the best products.”"],
            answer:1, stepFb:["A relevant fact.", "", "This builds on sentence 2. Look earlier."],
            fixes:[{ t:"“The platform ranks ads for each user from their data. His interests and late-night viewing match the ad’s targeting.”", ok:true, why:"Right: the ranking is personal, built from his signals." },
              { t:"“The ads are random.”", why:"Ranking follows rules, as the feed simulator showed." },
              { t:"“His phone overheard him talking about energy drinks.”", why:"That claim is unsupported; the data he <em>gives</em> (views, likes, searches, time) is enough to explain it." },
              { t:"“Sentence 2 is correct.”", why:"Feeds are personalized, not one ranking for everyone." }],
            hints:["In the simulator, did everyone see the same top card?", "No; the score depended on each persona’s signals.", "His data matched the targeting."] },
          { id:"e3", goal:5, task:"Is Text B’s disclosure adequate?",
            steps:["“Juniper received the gummies for free and earns from her code.”", "“These are material connections, so the post should disclose them.”", "“She includes #gifted, so the disclosure is adequate.”", "“Readers can easily see that the post is sponsored.”"],
            answer:2, stepFb:["Accurate: two connections.", "Correct reasoning.", "", "This depends on sentence 3. Look earlier."],
            fixes:[{ t:"“#gifted is buried at the end, after the pitch, and the affiliate commission isn’t mentioned, so the disclosure isn’t clear or prominent.”", ok:true, why:"Right: clear means early and complete." },
              { t:"“Any hashtag counts, wherever it is.”", why:"Placement matters: it should be seen before the pitch." },
              { t:"“No disclosure is needed because she likes the product.”", why:M6 },
              { t:"“Sentence 3 is correct.”", why:"Look at where #gifted sits, and what’s missing." }],
            hints:["Where in the caption does #gifted appear?", "After nine other hashtags, and after the discount pitch.", "Clear means early and complete."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which result in Explore surprised you most: the one-word swap, the two personas reacting differently, or the one signal that decided the feed? Why?" },
      { id:"j2", q:"In your own words, what separates persuasion from manipulation? Use one example from this module." },
      { id:"j3", q:"Explain to a friend how to x-ray an ad in under a minute: what do they look for first, second and third?" },
      { id:"j4", q:"Think of an ad or post that worked on you recently. Which appeal did the work, and how would you notice it sooner next time?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line, from Aristotle, Lincoln or any text in this module, that you want to keep. Add a sentence on why it stays with you.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one rule of persuasion you now believe, in your own words. Then copy a line from this module that shows it (the master’s example), and write a sentence of your own that uses it (your imitation).",
      placeholder:"e.g. Earn trust before you ask for anything.",
      examples:["If you would win a man to your cause, first convince him that you are his sincere friend. (Lincoln, 1842)",
        "The first kind depends on the personal character of the speaker (Aristotle, trans. Roberts)",
        "the proof, or apparent proof, provided by the words of the speech itself (Aristotle, trans. Roberts)",
        "She has waited 214 days. $5 a week brings her home. (Text E, practice model)",
        "Ad: Zestlet pays me for this post and sent me these. (C2, practice model)"]
    },
    artSamples:[
      { p:"Earn trust before you ask for anything.", m:"Lincoln’s “first convince him that you are his sincere friend.”" },
      { p:"Urgency must be true, or it poisons everything else.", m:"the ethics ladder, Text C" }
    ],
    principleMin:6
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"A sunscreen ad says: “Formulated with a panel of three dermatologists.” Which appeal does this mainly use?",
          options:[{ t:"Ethos", ok:true, why:"Relevant experts lend credibility to the product." }, { t:"Logos", why:"The panel is a credential, not evidence about how well the sunscreen works." }, { t:"Pathos", why:"No feeling is stirred; it’s about who vouches." }, { t:"Kairos", why:"No timing is invoked." }] },
        b:{ prompt:"“Fourteen hours of battery life, the longest of any phone we’ve made.” Which appeal does this mainly use?",
          options:[{ t:"Logos", ok:true, why:"A measurable claim offered as a reason to buy." }, { t:"Ethos", why:"Nothing about the speaker’s credibility." }, { t:"Pathos", why:"No emotional language." }, { t:"Kairos", why:"No moment or deadline." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"“Join the 2 million Canadians who already switched.” Which technique is this?",
          options:[{ t:"Bandwagon", ok:true, why:"It persuades by the size of the crowd." }, { t:"Testimonial", why:"No single person vouches." }, { t:"Plain folks", why:"It doesn’t pose as “just like you”; it points to numbers of people." }, { t:"Glittering generality", why:"It’s specific, not vague praise words." }] },
        b:{ prompt:"“Only 40 left at this price.” Which technique is this?",
          options:[{ t:"Scarcity", ok:true, why:"It claims a limited supply to hurry the decision." }, { t:"Bandwagon", why:"No crowd is mentioned." }, { t:"Kairos", why:"It’s about supply, not a fitting moment." }, { t:"Testimonial", why:"No one vouches." }] } },
      { id:"k3", cat:"K", goal:[4, 5],
        a:{ prompt:"What does an algorithmic social feed mainly rank posts by?",
          options:[{ t:"Predicted engagement for you, based on your data", ok:true, why:"Your signals (views, likes, searches, timing) drive the ranking." }, { t:"Newest posts first, for everyone", why:"Most feeds aren’t purely chronological." }, { t:"Accuracy and quality", why:"Engagement, not truth, drives ranking." }, { t:"The same popularity list for every user", why:"Feeds are personalized." }] },
        // VERIFY: Canadian disclosure guidance before release.
        b:{ prompt:"Under Canadian disclosure guidance, when should a creator disclose a post?",
          options:[{ t:"Whenever they have a material connection to the brand, such as payment, a free product or a commission", ok:true, why:"Any of these connections should be disclosed." }, { t:"Only when paid more than $100", why:"The amount isn’t the test; the connection is." }, { t:"Only on video platforms", why:"The rule follows the connection, not the platform." }, { t:"Never, if they genuinely like the product", why:"Liking it doesn’t remove the connection." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"“Your first apartment deserves better than a mattress on the floor. Flat-pack sofa, delivered in 48 hours, assembled in 20 minutes. From $249.” Who is the most likely target audience?",
          options:[{ t:"Young adults moving out for the first time, on a budget", ok:true, why:"“First apartment”, “mattress on the floor” and “$249” all point there." }, { t:"Retirees downsizing", why:"“First apartment” rules this out." }, { t:"Families with young children", why:"Nothing addresses children or space." }, { t:"Luxury buyers", why:"Flat-pack at $249 signals budget, not luxury." }] },
        b:{ prompt:"“Still running at 6 a.m. every Saturday? So are your knees. Cushion+ insoles: 30 days, risk free.” Who is the most likely target audience?",
          options:[{ t:"Experienced recreational runners, probably older, who feel joint strain", ok:true, why:"“Still running” and “your knees” imply years of habit and its wear." }, { t:"Beginners who’ve never run", why:"“Still running” implies a long habit." }, { t:"Children’s sports teams", why:"Nothing addresses children or teams." }, { t:"Professional sprinters", why:"“Saturday at 6 a.m.” suggests a hobby routine." }] } },
      { id:"t2", cat:"T", goal:2,
        a:{ prompt:"“9 out of 10 students who tried StudySpark raised their marks!” Small print: “10 students, one summer tutoring class.” Which is the strongest critique?",
          options:[{ t:"The sample is tiny and self-selected, so it can’t support a general claim about students", ok:true, why:"Ten volunteers in a tutoring class may have improved for many reasons." }, { t:"Statistics in ads are always lies", why:"Over-general: some are sound. Judge this one’s sample." }, { t:"It uses pathos instead of logos", why:"It <em>does</em> use logos, a weak logos." }, { t:"“StudySpark” sounds made up", why:"The name is irrelevant to the reasoning." }] },
        b:{ prompt:"“4 out of 5 dentists we surveyed recommend Gleam.” Small print: “Survey of 5 dentists at Gleam’s sponsored conference.” Which is the strongest critique?",
          options:[{ t:"Five dentists at the brand’s own event is too small a sample and a biased one", ok:true, why:"Size and setting both undermine the claim." }, { t:"Dentists can’t be trusted", why:"Expertise is relevant here; the sample is the problem." }, { t:"Any survey is meaningless", why:"Too broad." }, { t:"It should use pathos instead", why:"Swapping appeals wouldn’t fix the evidence." }] } },
      { id:"t3", cat:"T", goal:[1, 3],
        a:{ prompt:"A charity ad shows a famous hockey player saying, “I give, and so can you.” Why might two audiences respond differently?",
          options:[{ t:"Fans may trust the player and feel invited, while others may see fame borrowed from a field unrelated to the cause", ok:true, why:"The same ethos works for some viewers and not for others." }, { t:"Everyone will respond the same way because the message is clear", why:M4 }, { t:"Only logos persuades adults, so adults will ignore it", why:"Adults respond to ethos and pathos too." }, { t:"Celebrity endorsements are illegal in charity ads", why:"They aren’t." }] },
        b:{ prompt:"A public-health ad features a well-known comedian joking about getting a flu shot. Why might two audiences respond differently?",
          options:[{ t:"Some viewers relax and listen because of the humour and familiarity; others may doubt a comedian’s authority on health", ok:true, why:"Ethos and pathos land differently with different viewers." }, { t:"Humour always weakens a health message", why:"Over-general: humour can widen reach." }, { t:"Everyone trusts famous people equally", why:M3 }, { t:"Audiences don’t affect how a message is received", why:M4 }] } },
      { id:"c1", cat:"C", goal:5,
        a:{ prompt:"Which sentence best <em>analyses</em> Juniper’s caption (Text B)?",
          options:[{ t:"“By burying ‘#gifted’ after nine hashtags and a discount deadline, the caption lets ‘Honestly obsessed’ read as a friend’s tip rather than a paid partner’s pitch.”", ok:true, why:"It names a choice, quotes it and explains its effect." }, { t:"“Juniper posts about gummies and a discount code.”", why:"That’s a summary." }, { t:"“Influencers shouldn’t advertise to students.”", why:"That’s an opinion, not an analysis of this text." }, { t:"“The caption uses logos because it has a percentage.”", why:"The 20% is an offer, not evidence." }] },
        b:{ prompt:"Which sentence best <em>analyses</em> the energy-drink storyboard (Text C)?",
          options:[{ t:"“Cutting from a sweating can to a skateboarder mid-air, then warning ‘Don’t be the one who missed it,’ the ad fuses thrill with fear of exclusion, and gives its health warning only two seconds.”", ok:true, why:"It links technique to effect, with evidence." }, { t:"“The ad shows a can, a skater and a crowd.”", why:"Summary." }, { t:"“Energy drinks are unhealthy.”", why:"An opinion about the product, not the text." }, { t:"“The ad uses ethos because a skater appears.”", why:"The skater isn’t vouching; the image transfers a feeling." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which caption discloses a sponsorship most clearly?",
          options:[{ t:"“Ad: Zestlet pays me for this post and sent me these. Here’s what I actually thought…”", ok:true, why:"The relationship comes first, in plain words." }, { t:"“Loving these!! … #wellness #studytok #gifted”", why:"The disclosure is buried after the pitch." }, { t:"“Thanks @Zestlet!!”", why:"Thanks doesn’t say payment or a gift." }, { t:"“#sp Loving these.”", why:"The shorthand is unclear to many readers." }] },
        b:{ prompt:"Which disclosure of an affiliate link is clearest?",
          options:[{ t:"“I earn a commission if you buy through my link.” (first line)", ok:true, why:"Plain words, before the pitch." }, { t:"“Link in bio 😉”", why:"That hides the relationship." }, { t:"“#aff” at the end", why:"Unclear and late." }, { t:"“Not sponsored!”", why:"A commission is a connection." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"Leila searched “best study music” and now sees ads for focus supplements. What is the most accurate explanation, and the best response?",
          options:[{ t:"The platform used her search to infer an interest and target her; she can check her ad settings and treat the ads as targeted pitches, not recommendations", ok:true, why:"That’s targeting based on her data." }, { t:"The ads are random, so there’s nothing to do", why:M7 }, { t:"So many ads must mean the supplements work", why:"Frequency reflects targeting and ad spending, not quality." }, { t:"Her phone recorded her conversations", why:"An unsupported claim; her search alone explains it." }] },
        b:{ prompt:"After liking three hiking videos, Owen’s feed fills with boot ads. What is the most accurate explanation, and the best response?",
          options:[{ t:"His likes signalled an interest that advertisers target; he can recognize it as targeting and adjust his ad preferences if he wants", ok:true, why:"His own signals explain it, and he can act on them." }, { t:"Boot companies chose him personally", why:"Targeting works on categories of signals, not personal selection." }, { t:"The feed shows the best boots first", why:M7 }, { t:"It’s a coincidence", why:"Three likes, then boot ads: that’s the targeting rule at work." }] } },
      { id:"a2", cat:"A", goal:[5, 6],
        a:{ prompt:"A school club needs a bake-sale ad. Which version is persuasive <strong>and</strong> ethical?",
          options:[{ t:"“Every $2 cupcake funds our food-bank drive; we raised $480 last year. Saturday, 11 to 2, main foyer.”", ok:true, why:"Honest logos, relevant pathos, a real time: it passes every rung." }, { t:"“Last chance EVER to help hungry kids!!” (the sale happens monthly)", why:"False scarcity fails the honesty test." }, { t:"“Ms. Lee says only bad people skip this.”", why:"Guilt aimed at the reader fails the respect test." }, { t:"“Scientifically proven best cupcakes in Canada.”", why:"An unsupported claim: false logos." }] },
        b:{ prompt:"A community garden needs volunteers. Which ad is persuasive <strong>and</strong> ethical?",
          options:[{ t:"“Two hours on a Saturday grows 50 kg of food for the Eastside pantry. Next work day: May 10, 9 a.m.”", ok:true, why:"True detail, a relevant feeling, a real moment." }, { t:"“Volunteer or the garden closes forever!” (it isn’t closing)", why:"False urgency." }, { t:"“Real Canadians volunteer. Do you?”", why:"Shame plus a glittering generality: it fails the respect test." }, { t:"“Volunteering cures stress, guaranteed.”", why:"An unsupported guarantee." }] } }
    ]
  },
  task:{
    title:"Performance task: Persuade, honestly", summary:"Persuade, honestly",
    statement:"<p>Write a short ad or creator caption for a cause or product. Use at least three appeals on purpose, and pass every honesty test. There are many good answers; find yours.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["60–90 words", "Three different appeals, tagged", "Logos with a real detail", "A clear call to action", "Urgency backed by a fact", "Disclosure up front (creator captions)", "Audience and craft statement"],
    tips:["Trim or build. Every word should earn its place.", "Mark where you build trust, stir a feeling, give a reason or pick a moment. Three different ones.", "Give your reason a real number: a date, a price, an amount.", "Tell the reader exactly what to do and when.", "You used an urgency word. Back it up: what’s the real deadline or quantity?", "Say the relationship first, in plain words.", "Who is this for, and why did you make these choices?"],
    explainPrompt:"Craft statement: Who is your audience? Which appeal did you lean on most, and why does it suit them? Name one word you chose carefully and the word you rejected.",
    explainLabel:"Craft statement",
    vocab:"Use ethos, pathos, logos or kairos, and audience.",
    success:"Your copy has every part.",
    more:"Try another subject or format: each complete version joins your list.",
    afterAt:4,
    min:60, max:90, craftMin:40,
    subjects:[{ id:"garden", t:"Eastside Community Garden volunteer drive" }, { id:"books", t:"Riverbend Secondary used-book sale" }, { id:"bottle", t:"“Loon Lake Bottles”, a refillable water bottle from a local maker" }, { id:"own", t:"A real school or community cause you’re genuinely part of" }],
    ownNote:"For example, your club’s fundraiser. A real commercial brand isn’t offered, because writing its sponsored post would put words in its mouth.",
    ownPh:"Name the cause (e.g. our robotics club’s bottle drive)",
    formats:[{ id:"brand", t:"Brand ad" }, { id:"creator", t:"Creator caption (paid partnership)" }, { id:"school", t:"School announcement" }],
    tags:[{ id:"ethos", t:"Ethos", role:"syntax" }, { id:"pathos", t:"Pathos", role:"figure" }, { id:"logos", t:"Logos", role:"image" }, { id:"kairos", t:"Kairos", role:"sound" }, { id:"cta", t:"Call to action", role:"theme" }],
    urgency:["only", "last", "limited", "ends", "hurry", "today"],
    disclose:["ad", "sponsored", "paid partnership", "sent me"],
    labels:{ subject:"Subject", format:"Format", audience:"Audience: one sentence (who they are, and one thing they already care about)", audiencePh:"e.g. Grade 9 and 10 students who want cheap summer reading",
      copy:"Your copy", offer:"Offer details (deadline, quantity or date): required if you use urgency words", offerPh:"e.g. Sale ends Friday at 3 p.m.",
      tag:"Tag your own words", tagHow:"Tap words in your copy (Shift+tap or Shift+arrows for a range), then choose a tag. Tap a tag in the list to remove it.", noWords:"Write your copy first; its words appear here to tag.", clear:"Remove", notNeeded:"not needed" },
    modelsLabel:"Three model responses (different approaches)",
    models:[
      { title:"Garden, school announcement, built on pathos and kairos", text:"The first warm Saturday of spring is coming, and the Eastside garden is ready for hands. Last year, forty volunteers grew 600 kg of vegetables for the food pantry. You don’t need a green thumb, just two hours and old shoes. We’ll supply gloves, coffee and the satisfaction of pulling your first carrot. Join us May 10 at 9 a.m., behind the community centre. Bring a friend; the soil has room.",
        tags:"kairos (“first warm Saturday”), logos (“600 kg”), pathos (“pulling your first carrot”), call to action (“Join us May 10…”)", offer:"not needed" },
      { title:"Book sale, brand ad, built on logos and plain folks", text:"Riverbend’s used-book sale: 3,000 books, every one under $3. Paperbacks a loonie, hardcovers a toonie, cookbooks you’ll actually use. Run by students, for students, with every dollar going to the library’s new graphic-novel shelf. Last year we raised $1,140. Doors open Thursday at lunch, room 114. Bring a tote bag and leave with a summer’s reading. Sale ends Friday at 3, or when the shelves are empty.",
        tags:"logos (“3,000 books… under $3”; “$1,140”), plain folks / ethos (“Run by students, for students”), kairos (“a summer’s reading”), call to action (“Doors open Thursday…”)", offer:"Thursday–Friday; ends Friday 3 p.m." },
      { title:"Bottles, creator caption, built on ethos with honest disclosure", text:"Ad: Loon Lake Bottles sent me this one and pays me for this post. I’ve carried it for a month through two hikes and one dropped-on-the-bus disaster: not a dent. It keeps water cold for 12 hours, and the maker lives twenty minutes from me. If you’re tired of buying plastic, this is a good swap. My code gives you 10% off until June 1, and I earn a commission.",
        tags:"ethos (“I’ve carried it for a month”), logos (“cold for 12 hours”), pathos (“tired of buying plastic”), call to action (“My code gives you…”)", offer:"Code valid until June 1." }
    ]
  },
  cards:[
    ["Ethos", "Credibility of the speaker on <em>this</em> subject. “As an ER nurse for twenty years…”"],
    ["Pathos", "Stirring the audience’s feelings. “She has waited 214 days.”"],
    ["Logos", "Reasons and evidence. “70% less plastic, so 30 bottles a year.”"],
    ["Kairos", "The fitting moment. “First snow tonight. Are your tires ready?”"],
    ["Bandwagon", "Persuasion by crowd: “Join the 2 million who switched.”"],
    ["Scarcity", "A limited supply or deadline: “Only 40 left.” Is it true?"],
    ["Testimonial", "One person vouches. Relevant expertise, or borrowed fame?"],
    ["Plain folks", "“Just like you”: “Run by students, for students.”"],
    ["Glittering generality", "Shining words with no claim inside: “Pure. Bold. Yours.”"],
    ["Target audience", "The specific people a text imagines, revealed by its words, images and price."],
    ["Material connection", "Payment, a free product, a commission or employment. Disclose it clearly, early."],
    ["Algorithmic feed", "Ranks posts for <em>you</em> from your data, to hold attention; not neutral, not “best”."]
  ]
};
