// ENG4U 21 Media Forms & Conventions. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/21-media-forms.md
// Texts: the Larchmere practice model (trailer storyboard, podcast intro, magazine cover, social post) and the "Read the Ice"
// PSA are fictional and written for the course (plan wording). The "Light One" poster is a mock print ad written for this
// module: it replaces the plan's Volkswagen "Think Small" worked example and model response 3, because this build uses no
// real brands or logos (orchestrator instruction).
// Public domain: Shakespeare, As You Like It 2.7.139–140 (Globe line numbers); Aristotle, Rhetoric, trans. W. Rhys Roberts (1924).
// EXCERPT SLOT: the four real-example slots (REAL below: R-T1 trailer, R-T2 podcast opening, R-T3 magazine cover, R-T4 social
//   post), the Part 3 "one story, four forms" slot (part3.stations.slot) and the real PSA for U6. The teacher fills each with a
//   current, credited example (title, maker, outlet or platform, date; a short description or transcript in `desc`). Nothing
//   scored depends on them; the activities work while they are empty.
// VERIFY: practice-model names (@larchmere.lantern.kid, Northbound, Small Town, Big Sky, Larchmere Hardware, Larchmere
//   Public Library) against real accounts, publications and businesses; rename any that match (plan risk 3).
// VERIFY: the key concepts of media literacy (attribution to Ontario, late 1980s, and their exact wording) and the McLuhan
//   paraphrase and dates (plan risk 4).
// VERIFY: The War of the Worlds (Orson Welles, Mercury Theatre, CBS radio, 30 October 1938); how widespread the panic was is
//   debated (plan: verify before release).

const KC = {
  construct:"All media are constructions",
  negotiate:"Audiences negotiate meaning",
  commercial:"Media have commercial implications",
  form:"Form and content are closely related"
};

// Misconception core sentences (plan §3)
const M1 = "That tells me what we see. Now tell me what the choice <em>does</em>: why a close-up, why here?";
const M2 = "Someone chose where to point the camera, what to cut and what music to add. All media are constructions.";
const M3 = "Ask: can the people <em>in</em> the scene hear it? If yes, it’s diegetic. If only we can, it’s non-diegetic.";
const M4 = "A low angle looks <em>up</em> at the subject, so it usually makes them seem bigger and stronger. A high angle looks down and makes them seem smaller.";
const M5 = "Audiences negotiate meaning. A teen and a cottage owner can read the same cover differently.";
const M6 = "Move the story into a new form and you change what it can say. A podcast can’t show the empty lake; a cover can’t let you hear it.";
const M7 = "Point to the conventions: the typography, the cover lines, the image. Those are your evidence for the audience.";

const SET = (id) => " <button type='button' class='btn ghost sm mf-setup' data-setup='" + id + "'>Set it up</button>";

// Technique tags (plan "Tag mode" menu). lay = the layer the tag belongs to.
const TAGS = [
  { id:"shot", t:"Shot size", tags:[{ id:"els", t:"extreme long shot", lay:"image" }, { id:"ls", t:"long shot", lay:"image" }, { id:"ms", t:"medium shot", lay:"image" }, { id:"cu", t:"close-up", lay:"image" }, { id:"ecu", t:"extreme close-up", lay:"image" }] },
  { id:"angle", t:"Angle", tags:[{ id:"overhead", t:"overhead (bird’s-eye)", lay:"image" }, { id:"high", t:"high angle", lay:"image" }, { id:"eye", t:"eye level", lay:"image" }, { id:"low", t:"low angle", lay:"image" }] },
  { id:"edit", t:"Editing", tags:[{ id:"cut", t:"cut", lay:"edit" }, { id:"montage", t:"montage", lay:"edit" }, { id:"titlecard", t:"title card", lay:"edit" }, { id:"pacing", t:"pacing (fast or slow)", lay:"edit" }] },
  { id:"sound", t:"Sound", tags:[{ id:"dieg", t:"diegetic", lay:"sound" }, { id:"nondieg", t:"non-diegetic", lay:"sound" }, { id:"vo", t:"voice-over", lay:"words" }, { id:"silence", t:"silence", lay:"sound" }, { id:"sting", t:"sting", lay:"sound" }, { id:"bed", t:"music bed", lay:"sound" }] },
  { id:"design", t:"Design", tags:[{ id:"masthead", t:"masthead", lay:"design" }, { id:"focal", t:"focal image", lay:"image" }, { id:"coverline", t:"cover line", lay:"words" }, { id:"flash", t:"flash", lay:"design" }, { id:"type", t:"typography", lay:"design" }, { id:"white", t:"white space", lay:"design" }] },
  { id:"social", t:"Social", tags:[{ id:"hook", t:"hook", lay:"words" }, { id:"cta", t:"call to action", lay:"words" }, { id:"hashtag", t:"hashtag", lay:"words" }, { id:"comment", t:"comment preview", lay:"words" }] }
];
// one tag per element from each of these sets
const EXCL = [["els", "ls", "ms", "cu", "ecu"], ["overhead", "high", "eye", "low"], ["dieg", "nondieg"]];
const LAYERS = [
  { id:"image", t:"Image", cls:"an-image", d:"framing, shot size, angle, focal image" },
  { id:"words", t:"Words", cls:"an-diction", d:"voice-over, on-screen text, cover lines, captions" },
  { id:"sound", t:"Sound", cls:"an-sound", d:"diegetic or non-diegetic, music, silence" },
  { id:"edit", t:"Editing and sequence", cls:"an-syntax", d:"cuts, montage, pacing, order" },
  { id:"design", t:"Design", cls:"mf-design", d:"typography, layout, colour, white space" }
];

// The Larchmere practice model (plan). key = tags the key requires; also = other tags the key accepts.
// note = the one-line maker’s note (Layers mode); sug = “What this choice suggests”; kc = key concept in play.
const PRACTICE = [
  { id:"T1", chip:"T1 Trailer", title:"No Ice This Year", kind:"trailer",
    head:"<em>No Ice This Year</em>, a short documentary: trailer storyboard, 8 frames, 0:00–0:56",
    form:"Documentary trailer (time-based, moving image, sound)", purpose:"Persuade you to watch; build feeling",
    aud:"Local families; documentary viewers", ev:["on-screen text", "library screening"],
    els:[
      { id:"F1", ref:"F1 · 0:00", pic:"Overhead extreme long shot: grey open water, one tiny empty dock", snd:"Wind (heard in the scene)",
        key:["els"], also:["overhead", "dieg"], note:"Why overhead? It makes the dock tiny against the water.",
        sug:"The dock shrinks to a speck: the missing ice feels vast, bigger than any one person.", kc:KC.construct },
      { id:"F2", ref:"F2 · 0:06", pic:"Long shot: an empty festival field; stacked, unused lantern moulds", snd:"Wind fades; a single piano note (music only we hear)",
        key:["ls"], also:["nondieg", "cut"], note:"Why a long shot? It shows the whole empty field, so the absence has a shape.",
        sug:"The single piano note tells us how to feel: this emptiness is a loss, not just a quiet field.", kc:KC.construct },
      { id:"F3", ref:"F3 · 0:12", pic:"Close-up: an elder’s hands turning an old festival photograph", snd:"Voice-over (Ruth Mercier, 79): “Forty winters, and I never missed one.”",
        key:["cu"], also:["vo", "cut"], note:"Why a close-up? Hands and a photo make the memory personal.",
        sug:"The town’s loss gets a face, or at least a pair of hands: the grief becomes one person’s.", kc:KC.construct },
      { id:"F4", ref:"F4 · 0:20", pic:"Medium shot, eye level: Dev, 17, on the dock, phone in hand", snd:"Voice-over (Dev): “My grandmother says the lake used to sing.”",
        key:["ms"], also:["eye", "vo", "cut"], note:"Why eye level? We meet Dev as an equal, not a hero yet.",
        sug:"Dev is ordinary and close to us: the story passes from the elder to the young.", kc:KC.negotiate },
      { id:"F5", ref:"F5 · 0:28", pic:"Extreme close-up: a thermometer taped to a shed: +3 °C", snd:"The music cuts out: silence",
        key:["ecu"], also:["silence", "cut"], note:"Why silence here? The missing music makes the number land.",
        sug:"One detail fills the frame and the sound drops away: the fact feels like a held breath.", kc:KC.construct },
      { id:"F6", ref:"F6 · 0:34", pic:"Montage: six quick cuts of archive footage (skaters, glowing lanterns, children) in four seconds", snd:"Music swells",
        key:["montage"], also:["pacing", "cut", "nondieg", "bed"], note:"Why a montage? Fast cuts flood the screen with what is gone.",
        sug:"Memory rushes back all at once: what the town has lost feels huge and bright.", kc:KC.construct },
      { id:"F7", ref:"F7 · 0:44", pic:"Low angle: Dev standing on the dock against the sky", snd:"On-screen text: “This winter, they’re building a festival without ice.”",
        key:["low"], also:["cut"], note:"Why a low angle? We look up at Dev, so he seems strong.",
        sug:"Looking up at Dev makes him seem strong, a turning point from loss to action.", kc:KC.construct },
      { id:"F8", ref:"F8 · 0:52", pic:"Title card: white serif letters on black, “NO ICE THIS YEAR”", snd:"One sharp crack of ice",
        key:["titlecard"], also:["type", "cut", "dieg", "nondieg"], note:"Why end on a title card? It names the loss and closes the sequence.",
        sug:"Plain letters on black, then a crack of ice: the title lands like a verdict.", kc:KC.form }
    ] },
  { id:"T2", chip:"T2 Podcast", title:"Small Town, Big Sky", kind:"podcast",
    head:"<em>Small Town, Big Sky</em>, episode 12, “The Lake That Forgot”: podcast intro, 0:00–0:45",
    form:"Podcast intro (time-based, sound only)", purpose:"Hook listeners; build trust in the host",
    aud:"Regular listeners; people who know small towns", ev:["a local host", "a sponsor from the town"],
    els:[
      { id:"c1", ref:"0:00 · boots", pic:"Cold open, no music: boots on slush (recorded on the dock)", snd:"Field recording",
        key:["dieg"], also:[], note:"Why start with boots? We arrive on the dock before we know the show.",
        sug:"A real place, heard first: the episode feels like it begins in the world, not in a studio.", kc:KC.construct },
      { id:"c2", ref:"0:00 · Ruth", pic:"Ruth’s voice: “At night we’d hear it: a long groan, like a whale under the ice.”", snd:"Recorded on the dock",
        key:["dieg"], also:[], note:"Why her memory first? A human voice hooks us before any branding.",
        sug:"Her simile makes the lost sound vivid: we want to hear what the lake used to do.", kc:KC.construct },
      { id:"c3", ref:"0:09 · silence", pic:"One second of silence", snd:"Nothing",
        key:["silence"], also:["pacing", "cut"], note:"Why a silence? It lets the whale image hang in the air.",
        sug:"The gap sounds like the missing groan of the ice itself.", kc:KC.form },
      { id:"c4", ref:"0:10 · sting", pic:"Theme music sting (banjo and synth), 5 seconds", snd:"Added music",
        key:["nondieg", "sting"], also:[], note:"Why a sting now? It announces that the show has begun.",
        sug:"Banjo for the small town, synth for the present day: the brand arrives after the hook.", kc:KC.form },
      { id:"c5", ref:"0:15 · music bed", pic:"Music bed under the host", snd:"Added music, low",
        key:["nondieg", "bed"], also:[], note:"Why a music bed? It tells us the show has begun and how to feel.",
        sug:"Warm and steady: the bed frames the host as a familiar guide.", kc:KC.construct },
      { id:"c6", ref:"0:15 · host", pic:"Host: “From Larchmere, Ontario, this is <em>Small Town, Big Sky</em>. I’m Rowan Achebe.”", snd:"Studio voice",
        key:["vo"], also:["nondieg"], note:"Why name the town first? Place is the show’s promise.",
        sug:"The host speaks to us directly: a guide we can trust.", kc:KC.negotiate },
      { id:"c7", ref:"0:24 · host", pic:"Host: “This winter, for the first time in forty years, the lake didn’t freeze. Today: what a town loses when its winter goes missing.”", snd:"Studio voice",
        key:["vo"], also:["nondieg", "hook"], note:"Why state the stakes now? Specific numbers and a question keep us listening.",
        sug:"“Forty years” and “goes missing” turn weather into a mystery.", kc:KC.construct },
      { id:"c8", ref:"0:33 · sponsor", pic:"Host-read sponsor message: “This episode is supported by Larchmere Hardware, open late every Thursday.”", snd:"Studio voice",
        key:["vo"], also:["nondieg", "cta"], note:"Why does the host read the ad? A trusted voice sells better.",
        sug:"The intimacy that makes the story feel close also makes the ad feel like a neighbour’s advice.", kc:KC.commercial }
    ] },
  { id:"T3", chip:"T3 Cover", title:"Northbound", kind:"cover",
    head:"<em>Northbound</em>, February issue: magazine cover (a fictional regional magazine)",
    form:"Magazine cover (print, seen in a glance)", purpose:"Sell the issue; rank its stories",
    aud:"Adults who travel to cottage country", ev:["cabins under $150", "snowshoe gear", "classic serif type"],
    els:[
      { id:"m1", ref:"Masthead", pic:"NORTHBOUND", snd:"Heavy capitals across the top",
        key:["masthead"], also:["type"], note:"Why so big? The masthead is the brand you spot across a newsstand.",
        sug:"The name promises the north: travel, cold, open space.", kc:KC.commercial },
      { id:"m2", ref:"Focal image", pic:"Ruth holding an unlit ice lantern on a bare dock", snd:"The largest picture on the cover",
        key:["focal"], also:[], note:"Why an unlit lantern? It’s the festival that didn’t happen, in one object.",
        sug:"An elder with a dark lantern: memory and loss, aimed at adult readers.", kc:KC.construct },
      { id:"m3", ref:"Main cover line", pic:"“The Winter That Didn’t Come”", snd:"Small type at the bottom",
        key:["coverline"], also:["type", "white"], note:"Why does size matter? The biggest words win the first glance.",
        sug:"Placed small and low, the climate story reads as one story among several.", kc:KC.construct },
      { id:"m4", ref:"Secondary cover lines", pic:"“12 Cozy Cabins Under $150” · “Snowshoe Gear, Tested”", snd:"Smaller lines down the side",
        key:["coverline"], also:["type"], note:"Why cabins and gear? They tell us who buys this magazine.",
        sug:"Prices and tested gear point to adults with money and time for trips.", kc:KC.commercial },
      { id:"m5", ref:"Corner flash", pic:"“Special Climate Issue”", snd:"A small burst in the corner",
        key:["flash"], also:["type"], note:"Why a flash? It signals something new about this issue.",
        sug:"“Special” sells the issue as one to keep.", kc:KC.commercial }
    ] },
  { id:"T4", chip:"T4 Post", title:"@larchmere.lantern.kid", kind:"post",
    head:"A post by the creator @larchmere.lantern.kid (Dev)",
    form:"Social post (image and caption, seen in a scrolling feed)", purpose:"Stop the scroll; get people to come",
    aud:"Local followers; friends and families in Larchmere", ev:["the library lawn", "hashtags for the town"],
    els:[
      { id:"s1", ref:"Image", pic:"A vertical photo of a paper lantern glowing above open black water", snd:"Fills a phone screen",
        key:["focal"], also:["white"], note:"Why vertical? It fills the phone, so the light fills the feed.",
        sug:"One small light over black water: hope against the missing ice.", kc:KC.construct },
      { id:"s2", ref:"Caption, first line", pic:"“40 years of ice lanterns. Zero ice this year.”", snd:"The line a scroller sees first",
        key:["hook"], also:[], note:"Why numbers? Contrast and specifics stop a scrolling thumb.",
        sug:"Forty against zero: the contrast creates curiosity and stakes.", kc:KC.form },
      { id:"s3", ref:"Caption, rest", pic:"“So we’re making them out of paper. Come Saturday, 6 pm, library lawn.”", snd:"A time and a place",
        key:["cta"], also:[], note:"Why the time and place? A post can ask you to do something now.",
        sug:"Loss turns into an invitation with a deadline.", kc:KC.form },
      { id:"s4", ref:"Hashtags", pic:"#LarchmereLights #NoIceThisYear", snd:"Searchable tags",
        key:["hashtag"], also:[], note:"Why hashtags? They join the post to a shared conversation.",
        sug:"The town’s story becomes something others can find and add to.", kc:KC.negotiate },
      { id:"s5", ref:"Comment preview", pic:"“my nan cried when she saw this 🧡”", snd:"Shown under the post",
        key:["comment"], also:[], note:"Why show a comment? Other people’s feelings tell us how to feel.",
        sug:"One reader’s tears become social proof: this post matters.", kc:KC.negotiate }
    ] }
];

// EXCERPT SLOT: real examples. The teacher fills credit and desc each term (plan: current examples; fair dealing for
// criticism, review and education; shown only inside the module).
const REAL = [
  { id:"R1", chip:"R-T1 Trailer", kind:"trailer", form:"Trailer (time-based, moving image, sound)",
    criteria:"An official trailer, 1–3 minutes, with at least three shot sizes, one moment of silence or sound shift, and a closing title card.",
    task:"Tag at least 6 elements across image, sound and editing; write a maker’s note for 2 of them.",
    credit:{ title:"", maker:"", outlet:"", date:"" }, desc:"" },
  { id:"R2", chip:"R-T2 Podcast", kind:"podcast", form:"Podcast or radio opening (time-based, sound only)",
    criteria:"The first 30–60 seconds of an episode, with a cold open or theme music, and a host introduction.",
    task:"Tag every sound cue (diegetic or non-diegetic, music, silence); explain the order.",
    credit:{ title:"", maker:"", outlet:"", date:"" }, desc:"" },
  { id:"R3", chip:"R-T3 Cover", kind:"cover", form:"Magazine cover (print, seen in a glance)",
    criteria:"A current cover with a masthead, a focal image, a main cover line and at least two secondary cover lines.",
    task:"Tag the design conventions; infer the audience from at least 3 pieces of evidence.",
    credit:{ title:"", maker:"", outlet:"", date:"" }, desc:"" },
  { id:"R4", chip:"R-T4 Post", kind:"post", form:"Social post (image or video and caption, seen in a feed)",
    criteria:"A public post from an organization or creator, with an image or video, a caption with a hook, and a call to action or hashtags.",
    task:"Tag the hook, call to action and other social conventions; say what the first line does.",
    credit:{ title:"", maker:"", outlet:"", date:"" }, desc:"" }
];

const RUBRIC = [
  ["Knowledge: terms for conventions", "Few or misused", "Some accurate", "Accurate and varied", "Precise and nuanced"],
  ["Thinking: analysis of effect", "Mostly description", "Some effects named", "Effects explained and linked to purpose", "Insightful, with layered effects"],
  ["Communication: organization and style", "Unclear", "Somewhat clear", "Clear and coherent", "Fluent, with a distinctive voice"],
  ["Application: key concept and audience", "Missing", "Mentioned", "Applied", "Used to open a new insight"]
];
const RUB = "<details class='alg mf-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Criterion</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  RUBRIC.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div></details>";

const STEAL = "Rhetoric may be defined as the faculty of observing in any given case the available means of persuasion.";
const HERO_LINES = ["All the world’s a stage,", "And all the men and women merely players."];

export default {
  id:"21-media-forms",
  kind:"topic",
  title:"Media forms and conventions",
  topic:"Media Forms & Conventions",
  readyTopic:"reading media forms",
  hero:{
    headline:"Every frame is a choice.",
    text:"A trailer, a podcast, a magazine cover and a social post can all tell the same story, but none of them is a window. Each is <strong>constructed</strong> from <strong>conventions</strong>: shot sizes, camera angles, cuts, music, cover lines, hooks. Learn to read that grammar and you’ll see the makers’ hands everywhere. Learn to write it, and the hands are yours.",
    fig:{ html:"<div class='mf-hero' id='mf-hero' role='group' aria-label='Two lines from As You Like It, “All the world’s a stage, and all the men and women merely players”, appear on a dark stage under a sweeping spotlight. The frame pulls back: the lines sit inside a phone screen, inside a magazine page, inside a cinema frame. Four small panels slide in: a trailer, a podcast waveform, a magazine cover and a phone post. Caption: Someone built every one of these.'></div>", caption:"" },
    lines:HERO_LINES,
    cite:"(<i>As You Like It</i> 2.7.139–140)",
    frames:["Cinema", "Magazine", "Phone"],
    panels:[{ id:"trailer", t:"Trailer" }, { id:"podcast", t:"Podcast" }, { id:"cover", t:"Magazine cover" }, { id:"post", t:"Social post" }],
    caption:"Someone built every one of these.",
    listen:"▶ Read it aloud", watch:"Watch again"
  },
  goals:[
    "I can identify the characteristics of several media forms and explain how each form shapes what it can say.",
    "I can name conventions and techniques (shot size, angle, editing, sound, design, hooks) and analyse the effects they create.",
    "I can explain how a media text is built for a particular purpose and audience, using evidence from the text.",
    "I can interpret a media text’s message, including how its form and content work together.",
    "I can use the key concepts of media literacy to ask strong questions about any media text.",
    "I can write an analytical paragraph that links a convention to its effect and to the text’s purpose."
  ],
  start:{
    blocks:[{ title:"Word story: medium and broadcast", html:"<p><strong><em>Medium</em></strong> comes from Latin <em>medius</em>, “middle”. A medium is whatever stands in the middle, between a message and the people it reaches. Its plural, <em>media</em>, became a word for whole industries.</p><p><strong><em>Broadcast</em></strong> began on farms: to <em>broadcast</em> seed was to fling it widely by hand, rather than planting it in rows. When radio arrived in the 1920s, the word was waiting. Ask yourself, as you work: what is each form <em>scattering</em>, and where?</p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Device and effect", goal:2, prompt:"In a poem, the line “The wind <em>whispered</em> through the empty field” uses personification. What is its most likely effect?",
          options:[{ t:"It makes the field feel lonely and almost alive, as if something is speaking in the emptiness.", ok:true, why:"Giving the wind a human action creates mood." },
            { t:"It tells us the wind was quiet.", why:"True, but what does the human verb <em>add</em>?" },
            { t:"It proves the poem is set in autumn.", why:"Nothing in the line fixes the season." },
            { t:"It is a simile because it compares the wind to a person.", why:"No <em>like</em> or <em>as</em>: it’s personification." }],
          hints:["Name the device, then ask what feeling it creates.", "Wind can’t really whisper. Why give it a voice?", "It animates an empty place, making it eerie and lonely."] },
        { id:"w2", skill:"Device and effect", goal:2, prompt:"A short story ends with a one-word paragraph: “Gone.” What does the <em>form</em> of that paragraph do?",
          options:[{ t:"Isolating one word makes the loss land hard, giving it a pause and weight that a long sentence would soften.", ok:true, why:"Form creates emphasis." },
            { t:"Nothing. Paragraph length doesn’t matter.", why:"Read it aloud. The white space is a silence." },
            { t:"It shows the writer ran out of ideas.", why:"Assume the choice is deliberate and ask why." },
            { t:"It is a grammatical error.", why:"Fragments are a deliberate stylistic tool." }],
          hints:["Picture the page: one word, alone.", "What does white space do to a reader’s pace?", "It forces a pause and makes the word heavy."] },
        { id:"w3", skill:"Analysis vs description", goal:6, prompt:"Which sentence <em>analyses</em> rather than describes?",
          options:[{ t:"“By ending on the empty dock, the photographer makes absence itself the subject.”", ok:true, why:"It names a choice and its effect." },
            { t:"“The photo shows a dock and some water.”", why:"That’s what we see, not what it does." },
            { t:"“The photo is very good and I liked it.”", why:"Say <em>why</em>, using the choices." },
            { t:"“The photo was taken in January.”", why:"A date isn’t an interpretation." }],
          hints:["Look for a verb that says what a choice <em>does</em>.", "“Makes absence the subject” is an effect.", "“By ending on the empty dock, the photographer makes absence itself the subject.”"] },
        { id:"w4", skill:"Analysis vs description", goal:6, prompt:"Which verb best upgrades “The ending shows the town is sad”?",
          options:[{ t:"“The ending <em>suggests</em> the town is grieving something it cannot name.”", ok:true, why:"“Suggests” signals interpretation, and “grieving” is more precise than “sad”." },
            { t:"“The ending <em>says</em> the town is sad.”", why:"The ending doesn’t <em>say</em> it; you infer it." },
            { t:"“The ending <em>is</em> the town being sad.”", why:"Unclear. What does the ending <em>do</em>?" },
            { t:"“The ending <em>has</em> sadness.”", why:"Choose a verb of analysis: suggests, implies, reveals." }],
          hints:["Find the verb from the analysis bank.", "Suggests, implies, reveals, undercuts…", "“The ending <em>suggests</em> the town is grieving something it cannot name.”"] },
        { id:"w5", skill:"Purpose and audience", goal:3, prompt:"A poster uses large print, a simple map and the phrase “Your bus, your stop: here’s what’s changing.” Who is its most likely audience?",
          options:[{ t:"Regular transit riders who need clear, quick information.", ok:true, why:"Large print, a map and “your stop” all point there." },
            { t:"City engineers.", why:"Engineers would get technical detail, not “your stop”." },
            { t:"Tourists looking for attractions.", why:"Nothing here sells attractions." },
            { t:"Everyone equally.", why:"Every text chooses an audience; find the evidence." }],
          hints:["Look at the words “your bus, your stop”.", "Who needs a map of changed stops?", "Regular riders."] },
        { id:"w6", skill:"Purpose and audience", goal:3, prompt:"A text’s main purpose is to make you <em>buy</em> something. Which is it?",
          options:[{ t:"A post that ends “Tap the link: 20% off until Sunday.”", ok:true, why:"A call to action plus a deadline: selling." },
            { t:"A weather report.", why:"Its purpose is to inform." },
            { t:"A short poem about winter.", why:"Its purpose is to express or entertain." },
            { t:"A city bylaw notice.", why:"Its purpose is to inform or regulate." }],
          hints:["Look for a call to action.", "Which one mentions a price?", "The post that ends “Tap the link: 20% off until Sunday.”"] }
      ],
      refreshers:{
        "Device and effect":"Name the technique, then ask: what does it make the reader feel, notice or believe? “Personification → the empty field feels alive and lonely.”",
        "Analysis vs description":"Description says <em>what</em>. Analysis says <em>how</em> and <em>why</em>: “By choosing X, the maker makes us feel Y, which serves purpose Z.”",
        "Purpose and audience":"Purpose: inform, persuade, entertain, express, sell. Audience: find it in the evidence (words, images, design), not in your own taste."
      }
    }
  },
  explore:{
    heading:"Media deconstructor",
    intro:"Start with real media: a trailer, a podcast opening, a magazine cover and a post. Peel back their layers and tag the conventions. Then use the practice model to test your eye against a key, and remix it to watch the meaning change.",
    modes:[{ id:"layers", t:"Layers" }, { id:"tag", t:"Tag and check" }, { id:"remix", t:"Remix" }],
    modeHow:{
      layers:"Explore and tag freely. Turn layers on to see coloured overlays, each with a text tag. On the practice model, tap an element to read its maker’s note; on a real example, write your own.",
      tag:"Practice model only. Tap an element, choose its technique tags, then press <strong>Check my tags</strong> to compare with the key.",
      remix:"Practice model only. Swap one convention and watch the reading change in the readout."
    },
    textsLabel:"Text", realLabel:"Real examples", practiceLabel:"Practice model: the Larchmere set",
    layers:LAYERS, tagGroups:TAGS, excl:EXCL,
    practice:PRACTICE,
    real:REAL,
    realNote:"<strong>Real-example slot.</strong> Your teacher chooses a current example that meets these criteria and credits it here. If the slot is empty, use any example that meets them (your teacher can suggest one), or practise on the Larchmere set first.",
    realAdd:"Add an element", realAddPh:"e.g. 0:12, the opening shot, the masthead, the first line",
    realNotePh:"Why this choice? What does it make us feel, notice or believe?",
    realCredit:{ title:"Title", maker:"Maker", outlet:"Outlet or platform", date:"Date" },
    larchmere:"<strong>The Larchmere set</strong> is fictional, made for the course: the town, people, outlets and creator are invented. Four texts tell one story: the winter the lake in Larchmere, Ontario, didn’t freeze, and the town’s ice-lantern festival was cancelled. It’s fictional for two reasons: the challenges need a fixed answer key, and Remix changes a text, which a real maker’s work should never be shown doing.",
    readout:{ form:"Form", purpose:"Purpose", aud:"Likely audience", sel:"Selected element", sug:"What this choice suggests", tags:"Tags placed", credit:"Credit", kc:"Key concept in play" },
    remix:{
      F6:{ label:"Frame F6", options:[
        { id:"montage", t:"Montage of archive footage (as made)", pic:"Montage: six quick cuts of archive footage (skaters, glowing lanterns, children) in four seconds", sug:"Memory rushes back all at once: what the town has lost feels huge and bright." },
        { id:"lantern", t:"Extreme close-up: one cracked old lantern", pic:"Extreme close-up: one cracked old lantern", sug:"Intimate, personal grief: one broken object holds one family’s loss." },
        { id:"lake", t:"Extreme long shot: the empty lake", pic:"Extreme long shot: the empty lake, grey to the horizon", sug:"Scale: a whole town’s absence." }] },
      c5:{ label:"Music bed at 0:15", options:[
        { id:"on", t:"Music bed on (as made)", sug:"Warm and steady: the bed tells us the show has begun and frames the host as a familiar guide." },
        { id:"off", t:"Music bed off", sug:"Stark and documentary-like: with nothing under it, the host’s voice becomes more intimate and we lean in." }] },
      m3:{ label:"Main cover line", options:[
        { id:"bottom", t:"Small type at the bottom", sug:"Placed small and low, the climate story reads as one story among several." },
        { id:"across", t:"Large type across the focal image", sug:"The climate story now dominates: the issue’s emphasis shifts to the missing winter." }] },
      s2:{ label:"Caption hook", options:[
        { id:"forty", t:"“40 years of ice lanterns. Zero ice this year.” (as made)", pic:"“40 years of ice lanterns. Zero ice this year.”", sug:"Forty against zero: the contrast creates curiosity and stakes.", stop:78 },
        { id:"cancel", t:"“Festival cancelled 😞”", pic:"“Festival cancelled 😞”", sug:"A generic sad feeling: easy to scroll past.", stop:31 }] }
    },
    stopLabel:"Thumb-stop m&#101;ter (model)",
    stopNote:"A model of how many scrollers might stop, not real data.",
    audience:{
      label:"Audience remix (challenge 3)", how:"Change the cover for a new audience. The budget is three changes from the default.",
      rows:[
        { id:"focal", t:"Focal image", options:[{ id:"def", t:"Ruth with an unlit lantern", p:"" }, { id:"teen", t:"Dev and two friends launching paper lanterns", p:"teen" }, { id:"aerial", t:"Aerial photo of the lake (neutral)", p:"" }] },
        { id:"line", t:"Main cover line", options:[{ id:"def", t:"“The Winter That Didn’t Come”", p:"" }, { id:"teen", t:"“No Ice. No Festival. Now What? Larchmere Teens Take Over”", p:"teen" }, { id:"biz", t:"“Climate Costs: Tourism Losses in Cottage Country”", p:"biz" }] },
        { id:"type", t:"Typography", options:[{ id:"def", t:"Classic serif", p:"" }, { id:"teen", t:"Bold hand-lettered sans", p:"teen" }] },
        { id:"colour", t:"Colour", options:[{ id:"def", t:"Muted blues", p:"" }, { id:"teen", t:"High-contrast neon accents", p:"teen" }] }
      ],
      changes:"Changes from the default", teen:"Teen signals", biz:"Business signals",
      reads:{ teen:"Teens aged 15–19", biz:"Adults in the tourism trade", mixed:"Mixed signals: the cover speaks to no one clearly", adult:"Adults who travel to cottage country" }
    },
    aha:"The same facts can be re-felt through a single change of convention. Makers choose, and the choices mean.",
    workedTitle:"Two worked examples",
    worked:[
      { t:"Design and white space: the “Light One” poster (a mock print ad written for this module)", d:"One small paper lantern glows near the top of a nearly empty midnight-blue page, above the two-word headline “Light one.” Only at the bottom, in small type, does the tagline give the facts: “Paper lanterns · Saturday, 6 pm · library lawn.” The emptiness <em>is</em> the argument: one small light looks brave rather than lonely." },
      { t:"Borrowed form: <em>The War of the Worlds</em> (radio, 1938)", d:"Orson Welles’s 1938 radio adaptation of <em>The War of the Worlds</em> told an invasion as news bulletins interrupting a music program. It borrowed the conventions of live news, which is why some listeners took it as real. How widespread the panic was is still debated by historians." }
    ],
    predIntro:"Make a prediction first. Then the deconstructor makes the change and the readout shows the new reading.",
    predictions:[
      { id:"p1", start:{ text:"T1", el:"F6", mode:"remix" },
        prompt:"The trailer cuts from the hands in F3 to an <strong>extreme close-up of one cracked old lantern</strong> instead of the montage. Then we try an <strong>extreme long shot of the empty lake</strong> in the same slot. How does the feeling change between the two?",
        options:[{ t:"The close-up makes the loss personal and intimate; the long shot makes it vast and shared", ok:true }, { t:"Both feel the same, because the subject is still the festival" }, { t:"The long shot is more personal because it shows more" }, { t:"The close-up makes the scene feel more hopeful" }],
        explain:"Shot size controls distance, and distance controls feeling. Close is personal; far is vast. The readout moved from “intimate, personal grief” to “scale: a whole town’s absence”." },
      { id:"p2", start:{ text:"T2", el:"c5", mode:"remix" },
        prompt:"What happens if we <strong>remove the music bed</strong> under the host’s first line?",
        options:[{ t:"It feels starker and more documentary-like, and the host’s voice becomes more intimate", ok:true }, { t:"Nothing changes, because music is just background" }, { t:"Listeners can no longer tell it’s a podcast" }, { t:"It becomes more cheerful" }],
        explain:"Music tells us how to feel and that “the show has begun”. Without it, we lean in. Silence is a convention too." },
      { id:"p3", start:{ text:"T3", el:"m3", mode:"remix" },
        prompt:"Move the main cover line, “The Winter That Didn’t Come”, from small type at the bottom to <strong>large type across the focal image</strong>. What does the cover now say the issue is mostly about?",
        options:[{ t:"The climate story; the issue’s emphasis shifts to the missing winter", ok:true }, { t:"The cabins, because they’re listed first" }, { t:"Nothing, because cover lines don’t signal importance" }, { t:"Snowshoe gear" }],
        explain:"Size and placement rank the stories. The biggest words win the reader’s first glance." },
      { id:"p4", start:{ text:"T4", el:"s2", mode:"remix" },
        prompt:"Swap the caption’s first line from “Festival cancelled 😞” to “40 years of ice lanterns. Zero ice this year.” What is the likely effect in a scrolling feed?",
        options:[{ t:"The contrast of numbers creates curiosity and stakes, so more people stop to read", ok:true }, { t:"People scroll past faster because it’s longer" }, { t:"It changes the post from persuasive to purely informative" }, { t:"No effect, because only the photo matters on social media" }],
        explain:"The first line is the hook. Specific numbers and contrast beat a generic feeling. The model thumb-stop m&#101;ter rose." }
    ],
    chalIntro:"Use the deconstructor to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right text and mode. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:2, prompt:"Tag the <strong>shot size</strong> of trailer frames F1–F5." + SET("tc1"),
        answer:{ F1:"els", F2:"ls", F3:"cu", F4:"ms", F5:"ecu" },
        msgs:{ F1:"The dock is tiny and the water fills the frame. That vastness is an <em>extreme</em> long shot.",
          F3:"We see whole hands and a photo: close-up. Extreme close-up would fill the frame with one detail, like F5’s thermometer.",
          F4:"Dev is framed from the waist up: medium shot.",
          missing:"Tag a shot size on each of F1 to F5 first." },
        general:"Not yet. Check each frame’s shot size: how much of the subject fills the frame?",
        why:"Far to near: extreme long, long, close-up, medium, extreme close-up. Shot size is the trailer’s first tool for distance and feeling.",
        hints:["Shot size is about how much of the subject fills the frame.", "Order from far to near: extreme long, long, medium, close-up, extreme close-up.", "F1 ELS · F2 LS · F3 CU · F4 MS · F5 ECU."] },
      { id:"tc2", goal:2, prompt:"In the podcast intro, tag every sound cue as <strong>diegetic</strong> or <strong>non-diegetic</strong>: the boots (0:00), Ruth’s voice (0:00), the theme sting (0:10) and the music bed (0:15)." + SET("tc2"),
        answer:{ c1:"dieg", c2:"dieg", c4:"nondieg", c5:"nondieg" },
        msgs:{ c2:"Her voice was recorded <em>in</em> the world of the story, on the dock. It belongs there.",
          c4:"No one on the dock hears the banjo. It’s added for us.",
          missing:"Tag each of the four cues as diegetic or non-diegetic first." },
        general:"Not yet. " + M3,
        why:"Field recordings belong to the world of the story; added music is for us alone.",
        hints:["Ask: could someone standing on the dock hear it?", "Field recordings are diegetic; added music is not.", "Boots ✔ diegetic, Ruth ✔ diegetic, sting and bed: non-diegetic."] },
      { id:"tc3", goal:[2, 3], stretch:true, prompt:"Remix the <em>Northbound</em> cover so it targets <strong>teens aged 15–19</strong> instead of its usual adult readers, using <strong>no more than three changes</strong>." + SET("tc3"),
        msgs:{ two:"Two signals aren’t enough to shift the whole cover. Find one more convention.",
          biz:"That cover line speaks to adults in the tourism trade, not teens.",
          over:"Over budget. Which single change matters least?" },
        general:"Not yet. Which conventions signal <em>who</em> a cover is for?",
        banner:"You changed the audience without changing a single fact. That’s the power of convention.",
        why:"You changed the audience without changing a single fact. That’s the power of convention.",
        hints:["Which conventions signal <em>who</em> a cover is for? Faces, words, type and colour.", "Swap in images and words about teens acting; then choose a type or colour signal.", "For example: the teen image, the “Teens Take Over” cover line and hand-lettered type."] }
    ]
  },
  part3:{
    slug:"forms", name:"Four forms", heading:"Same story, four forms",
    intro:"Explore took texts apart layer by layer. Now put the forms side by side: what can each <em>form</em> do, and what can’t it?",
    stations:{
      // EXCERPT SLOT: one real event or release covered in at least three forms (teacher fills title, credits and desc).
      slot:{ title:"Real example: one story, four forms", credit:"", desc:"",
        how:"Your teacher chooses one real event or release covered in at least three forms (for example a documentary’s trailer, a radio or podcast interview with its maker, a newspaper or magazine page, and the official social post). For each version, note one thing that form does that the others can’t.",
        empty:"No example has been added yet, so the stations below run on their built-in descriptions. You can still fill in the notes for an example your teacher suggests.",
        ph:"One thing this form does that the others can’t" },
      forms:[{ id:"trailer", t:"Trailer" }, { id:"podcast", t:"Podcast" }, { id:"cover", t:"Magazine cover" }, { id:"post", t:"Social post" }],
      s1:{ title:"Station 1: what can each form do?", how:"Tap each cell to change it, then press <strong>Check the grid</strong>. Every cell explains itself when it’s checked.",
        rows:[
          { id:"r1", t:"Moving images", opts:["y", "n"], answer:["y", "n", "n", "y"],
            why:["Moving pictures are what a trailer is made of.", "A podcast is sound only.", "A cover is a still page.", "Yes, sometimes: a post can carry video."] },
          { id:"r2", t:"Sound and voice", opts:["y", "n"], answer:["y", "y", "n", "y"],
            why:["Music, voice and sound effects.", "Voice is the whole form.", "A cover is silent.", "Yes, sometimes: video posts have sound, though many play muted."] },
          { id:"r3", t:"Control of time (pace, pauses)", opts:["y", "n", "p"], answer:["y", "y", "n", "p"],
            why:["Editing sets the pace, second by second.", "Pauses and music set the pace.", "The eye wanders a cover in any order.", "Partial: a video sets its pace, but the viewer can scroll away at any moment."] },
          { id:"r4", t:"Room for nuance and detail", opts:["lo", "hi"], answer:["lo", "hi", "lo", "lo"],
            why:["Low: a minute or two of promises.", "High: minutes of voices, pauses and context.", "Low on the cover itself: a few words and one image.", "Low: a caption and a few seconds of attention."] },
          { id:"r5", t:"Talk back (comments, shares)", opts:["y", "n"], answer:["n", "n", "n", "y"],
            why:["A trailer plays to us; it doesn’t take replies.", "Listeners hear; the episode can’t answer.", "A cover can’t take replies.", "Comments and shares are built into the form."] },
          { id:"r6", t:"Seen in a glance", opts:["y", "n"], answer:["n", "n", "y", "y"],
            why:["It takes a minute or two to watch.", "It takes time to listen.", "Built for a two-second glance at a newsstand.", "Built for a thumb that may not stop."] }
        ],
        labels:{ y:"✔", n:"✗", p:"Partial", lo:"Low", hi:"High", blank:"?" },
        check:"Check the grid", reset:"Start over", done:"Every cell matches. Each form can do some things brilliantly and others badly." },
      s2:{ title:"Station 2: what does each form say best?", how:"Tap a kind of content, then tap the form that carries it best. Read the maker’s reason.",
        items:[
          { id:"c1", t:"A survivor’s grief, in her own voice" },
          { id:"c2", t:"The scale of a flooded valley" },
          { id:"c3", t:"The time and place of a vigil this Saturday" },
          { id:"c4", t:"“This is a climate story” in two seconds" }
        ],
        answer:{ c1:"podcast", c2:"trailer", c3:"post", c4:"cover" },
        why:{ c1:"Voice carries emotion no caption can.", c2:"An extreme long shot shows vastness.", c3:"Timely and shareable, with a call to action.", c4:"The biggest words on the newsstand." },
        partial:{
          "c2|cover":"Partly: a cover could also carry scale through its focal image. But a still photo can’t sweep across the valley the way a moving extreme long shot can. Try another form.",
          "c1|trailer":"Partly: a trailer can carry her voice, but only in seconds, between images. Which form gives a voice room to pause? Try another form.",
          "c3|cover":"Partly: a cover could print the date, but it’s on the stand for a month. Which form is timely and shareable? Try another form.",
          "c4|post":"Partly: a post can say it fast too, but it competes with a feed. Which form ranks its stories with the biggest words? Try another form."
        },
        wrong:"That form can carry it, but not best. " + M6 + " Try another form." },
      s3:{ title:"Station 3: form and content",
        reading:"<p><strong>The key concepts.</strong> A set of key concepts of media literacy was developed in Ontario in the late 1980s and has long been used in Ontario schools. Four of them, for example: <em>all media are constructions</em>; <em>audiences negotiate meaning</em>; <em>media have commercial implications</em>; <em>form and content are closely related</em>.</p><p><strong>McLuhan.</strong> The Canadian thinker Marshall McLuhan argued in the 1960s that a medium shapes us as much as any message it carries (a paraphrase).</p>",
        how:"For each of your Station 2 matches, tap the key concept that best explains it.",
        concepts:[{ id:"construct", t:KC.construct }, { id:"negotiate", t:KC.negotiate }, { id:"commercial", t:KC.commercial }, { id:"form", t:KC.form }],
        answer:{ c1:"form", c2:"form", c3:"form", c4:"form" },
        why:{ c1:"Grief told in her own voice is different content from grief in a caption: the form decides what we feel.",
          c2:"Vastness needs a moving frame; change the form and the scale shrinks.",
          c3:"A post’s timeliness and shareability make it the right home for a call to action.",
          c4:"A cover’s glance-speed form decides which story wins." },
        fb:{ construct:"True of every text, but it doesn’t explain why <em>this</em> form fits <em>this</em> content.",
          negotiate:"That concept is about how readers make meaning, not why the content suits this form.",
          commercial:"Money shapes media, but this match is about what the form can carry." } }
    },
    blocks:[{ title:"Craft → meaning", html:"<p>Choosing a form <em>is</em> choosing a meaning. When you write in Module 24, you’ll pick the form first, because it decides what your story can be.</p>" }],
    quickCheck:{ title:"Four forms quick check", summary:"Four forms quick check",
      items:[
        { id:"q1", goal:1, prompt:"Which form can’t control the <em>pace</em> at which you take it in?",
          choices:[{ t:"Magazine cover", ok:true, fb:"Right. A reader’s eye wanders a cover in any order; time-based forms set the pace." },
            { t:"Trailer", fb:"A reader’s eye wanders a cover in any order; time-based forms set the pace." },
            { t:"Podcast", fb:"A reader’s eye wanders a cover in any order; time-based forms set the pace." },
            { t:"None of them", fb:"A reader’s eye wanders a cover in any order; time-based forms set the pace." }] },
        { id:"q2", goal:1, prompt:"An elder’s spoken memory, with her pauses and the catch in her voice, is strongest in which form?",
          choices:[{ t:"Podcast", ok:true, fb:"Right. Voice carries tone, pause and texture." },
            { t:"Magazine cover", fb:"Voice carries tone, pause and texture." },
            { t:"Hashtag", fb:"Voice carries tone, pause and texture." },
            { t:"Title card", fb:"Voice carries tone, pause and texture." }] },
        { id:"q3", goal:5, prompt:"Which key concept says that a teen and a cottage owner may read the cover differently?",
          choices:[{ t:KC.negotiate, ok:true, fb:"Right. Meaning is made by readers as well as makers." },
            { t:KC.commercial, fb:"Meaning is made by readers as well as makers. " + M5 },
            { t:KC.form, fb:"Meaning is made by readers as well as makers. " + M5 },
            { t:KC.construct, fb:"Meaning is made by readers as well as makers. " + M5 }] },
        { id:"q4", goal:5, prompt:"Why do many free podcasts include host-read sponsor messages?",
          choices:[{ t:KC.commercial, ok:true, fb:"Right. Shows need money; sponsorship shapes what we hear and how." },
            { t:KC.negotiate, fb:"Shows need money; sponsorship shapes what we hear and how." },
            { t:"It’s a sound effect", fb:"Shows need money; sponsorship shapes what we hear and how." },
            { t:"It’s a diegetic sound", fb:"Shows need money; sponsorship shapes what we hear and how." }] }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“" + STEAL + "”</p><p class='eng-cite'>Aristotle, <i>Rhetoric</i>, translated by W. Rhys Roberts, 1924 (public domain)</p><p><strong>The pattern:</strong> <em>[Thing] may be defined as the faculty/art of [verb-ing] [where] [what].</em></p><p><strong>Your turn:</strong> write your own definition of a media form in the same shape.</p><p><strong>Model imitation:</strong> “A trailer may be defined as the art of promising, in a minute, the feeling of an hour.”</p>",
      prompt:"Your definition of a media form" }],
    steal:{ master:STEAL, source:"Aristotle, Rhetoric (trans. W. Rhys Roberts)", save:"Save it to my commonplace book" }
  },
  practice:{
    activities:[
      { id:"sort", type:"sorter", title:"Convention sort", summary:"Convention sort", goal:[2, 1], noun:"convention", txt:true,
        instruction:"Sort each convention into the layer it belongs to.",
        boxes:[{ id:"image", label:"Image" }, { id:"sound", label:"Sound" }, { id:"edit", label:"Editing and sequence" }, { id:"design", label:"Design" }],
        items:[
          { id:"i1", t:"A low-angle shot of a coach at a podium", answer:"image", why:"Angle is where the camera sits: an image choice. Low angle: bigger, stronger.",
            wrong:{ edit:"Angle is about where the camera sits, not how shots join." },
            hints:["Is it about what we see, what we hear, how shots join, or how a page is laid out?", "Where does the camera sit?", "Image."] },
          { id:"i2", t:"Music the characters can’t hear", answer:"sound", why:"Non-diegetic music: a sound choice.",
            wrong:{ edit:"It’s a sound choice: non-diegetic music." },
            hints:["Is it about what we see, what we hear, how shots join, or how a page is laid out?", "We hear it.", "Sound."] },
          { id:"i3", t:"Six quick cuts in four seconds", answer:"edit", why:"Cutting shots together fast is editing: a montage.",
            wrong:{ image:"The individual shots are images, but cutting them fast is editing." },
            hints:["Is it one shot or how shots join?", "Cuts join shots.", "Editing and sequence."] },
          { id:"i4", t:"A masthead in heavy capitals", answer:"design", why:"Typography and layout are design.",
            wrong:{ image:"Typography belongs to design." },
            hints:["Is it a picture or lettering?", "Lettering and layout belong together.", "Design."] },
          { id:"i5", t:"A one-second silence before the theme", answer:"sound", why:"Silence is a sound choice: what you don’t hear.",
            wrong:{ edit:"Silence is a sound choice. It’s what you <em>don’t</em> hear." },
            hints:["Which sense notices it?", "You notice it with your ears.", "Sound."] },
          { id:"i6", t:"An extreme close-up of a thermometer", answer:"image", why:"Shot size is an image convention.",
            wrong:{ design:"Shot size is an image convention." },
            hints:["Is it about how close the camera is?", "Shot size is framing.", "Image."] },
          { id:"i7", t:"A title card at the end of a trailer", answer:"edit", why:"Its placement at the end closes the sequence.",
            wrong:{ design:"Its lettering is design, but its <em>placement</em> at the end is sequence." },
            hints:["Is it about how something looks, or <em>where</em> it sits in time?", "Title cards close a sequence.", "Editing and sequence."] },
          { id:"i8", t:"White space around a single cover line", answer:"design", why:"Empty space is a layout choice.",
            wrong:{ image:"Empty space is a layout choice." },
            hints:["Is it a picture, or the space around words?", "Layout includes what’s left empty.", "Design."] },
          { id:"i9", t:"A sound bridge (the next scene’s sound starts before its picture)", answer:"sound", why:"A sound technique that smooths a cut.",
            wrong:{ edit:"It’s a sound technique that smooths a cut. Sound is the better box." },
            hints:["What starts early, the sound or the picture?", "The sound.", "Sound."] },
          { id:"i10", t:"A high-angle shot looking down on a lone skater", answer:"image", why:"Angle is an image choice. High angle: smaller, vulnerable.",
            wrong:{ sound:"Angle is an image choice. (High angle: smaller, vulnerable.)" },
            hints:["Where does the camera sit?", "Above the skater, looking down.", "Image."] }
        ] },
      { id:"story", type:"custom", title:"Unseen storyboard: “Read the Ice”", summary:"Unseen storyboard", star:true, goal:[2, 3, 4],
        instruction:"“Read the Ice” is a 6-frame public service announcement from the practice model: fictional, so the ★ items keep a fixed answer key. The last item moves to a real PSA.",
        frames:[
          ["R1", "Extreme long shot: a frozen bay at dawn, a few distant ice huts", "Wind"],
          ["R2", "Close-up: a teen’s boot stepping onto grey, slushy ice", "A creak (diegetic)"],
          ["R3", "Extreme close-up: a crack spreading", "Silence"],
          ["R4", "Medium shot, eye level: a grandmother handing the teen an ice auger", "Voice-over: “Before you step, test.”"],
          ["R5", "Montage: an auger drilling, a measuring stick, a thickness chart", "Upbeat music"],
          ["R6", "Title card: “Read the Ice. 10 cm or don’t go.”", "Non-diegetic chime"]
        ],
        items:[
          { id:"u1", goal:2, prompt:"What does the silence in R3 do?",
            options:[{ t:"Builds dread at the moment of danger", ok:true, why:"Silence after a creak is a held breath." },
              { t:"It’s background quiet", why:"Silence after a creak is a held breath. It’s dramatic." },
              { t:"It shows the sound equipment failed", why:"Assume the choice is deliberate and ask what it does." },
              { t:"It tells us the ice is safe", why:"A crack is spreading; the quiet makes it worse, not better." }],
            hints:["What just happened in R2?", "A creak, then nothing: what do you do when you hear a creak?", "It builds dread at the moment of danger."] },
          { id:"u2", goal:2, prompt:"Why does the music turn upbeat at R5?",
            options:[{ t:"It shifts from danger to empowerment: testing is the solution", ok:true, why:"The music tells us that action fixes the danger." },
              { t:"To show it’s a happy ending", why:"It signals that <em>action</em> fixes the danger, not that nothing was ever wrong." },
              { t:"Because montages always need music", why:"Music is a choice; ask what this choice signals." },
              { t:"To make the ad shorter", why:"Music doesn’t change the length; it changes the feeling." }],
            hints:["What is happening on screen in R5?", "The teen is testing the ice: drilling and measuring.", "It shifts from danger to empowerment: testing is the solution."] },
          { id:"u3", goal:3, prompt:"Who is the primary audience, and what’s your best evidence?",
            options:[{ t:"Teens new to the ice; the teen’s boot and the grandmother passing on a skill", ok:true, why:"The boot that steps first is the viewer’s stand-in, and the skill is passed down to the young." },
              { t:"Grandparents, because one appears", why:"She’s the <em>messenger</em>; the boot that steps first is the viewer’s stand-in. " + M7 },
              { t:"Ice-hut owners, because huts appear in R1", why:"The huts are distant scenery; the close-ups belong to the teen." },
              { t:"Everyone equally", why:"Every text chooses an audience; find the evidence in the frames." }],
            hints:["Whose point of view does the camera take in R2?", "The boot is the viewer’s boot.", "Teens new to the ice; evidence: R2’s point of view and the passing-on of a skill in R4."] },
          { id:"u4", goal:3, prompt:"Which single change would most effectively re-target the PSA to experienced adult anglers?",
            options:[{ t:"Replace R4 with an angler checking a thickness chart and add “Even after 30 winters, test.”", ok:true, why:"Casting and words decide who a text addresses." },
              { t:"Make the music louder", why:"Volume doesn’t change <em>who</em> the text addresses; casting and words do." },
              { t:"Change the title card’s colour to blue", why:"Colour alone won’t tell experienced anglers the message is for them." },
              { t:"Cut the silence in R3", why:"That changes the mood, not the audience." }],
            hints:["Who is on screen, and who is spoken to?", "Change the casting and the words.", "Replace R4 with an angler checking a thickness chart and add “Even after 30 winters, test.”"] },
          { id:"u5", goal:5, prompt:"Which key concept best explains why the PSA ends on a rule (“10 cm or don’t go”)?",
            options:[{ t:"Media construct reality: it frames a complex judgment as a simple rule", ok:true, why:"Safe ice depends on many things; the PSA builds a simple version of reality we can act on." },
              { t:"Media have commercial implications", why:"Nothing is being sold here. Think about how it simplifies reality." },
              { t:"Audiences negotiate meaning", why:"True of every text, but the rule is about how the PSA <em>builds</em> its message." },
              { t:"Silence is non-diegetic", why:"That’s not a key concept, and the ending isn’t silent." }],
            hints:["Is ice safety really one number?", "The PSA simplifies a complex judgment.", "Media construct reality."] }
        ],
        write:{ id:"u6", goal:[2, 4],
          // EXCERPT SLOT: the teacher selects a current real PSA (30–90 seconds, a sound or music shift, a closing call to action; credited).
          prompt:"Now watch a real PSA (your teacher selects a current example: 30–90 seconds, with a sound or music shift and a closing call to action; credited). In one sentence, name one convention it uses and analyse its effect.",
          credit:"", min:15, max:40, label:"Your sentence (15–40 words)",
          good:"Your sentence names a convention and says what it does. Your teacher reads the analysis.",
          bad:"That describes the frame; add what it <em>does</em> to the viewer.",
          noConv:"Name the convention: a shot size, angle, sound, edit or design choice from the menu.",
          len:"Write one sentence of 15–40 words.",
          check:"Check my sentence",
          hints:["Name one convention from the menu (a shot size, an angle, a sound choice, an edit).", "Then use a verb that says what it does: suggests, builds, makes, signals…", "“The sudden silence before the final title builds dread, so the call to action lands like a warning.”"] } },
      { id:"spot", type:"spot", title:"Spot the Error", summary:"Spot the error", goal:[2, 3, 6], student:"Zelda",
        instruction:"Zelda made one mistake in each analysis. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:6, task:"Analyse frame F7 of the <em>No Ice This Year</em> trailer.",
            steps:["In frame F7, Dev stands on the dock against the sky.", "The on-screen text says they’re building a festival without ice.", "This makes the trailer interesting.", "So the trailer works well."],
            answer:0,
            stepFb:["", "Step 2 repeats the problem; look earlier.", "Step 3 is vague, but the first problem is earlier.", "Step 4 follows from the earlier steps."],
            fixes:[{ t:"“In frame F7, a low-angle shot looks up at Dev against the sky, making him seem strong and determined, the trailer’s turn from loss to action.”", ok:true, why:"It names the convention, its effect and the trailer’s purpose." },
              { t:"“In frame F7, Dev is wearing a blue jacket.”", why:"More description." },
              { t:"“In frame F7, the trailer is really good.”", why:"Opinion without evidence." },
              { t:"“Step 1 is fine.”", why:"It tells what we see, never what the choice does. " + M1 }],
            hints:["Which convention is used in F7?", "Low angle.", "Name it, then say what it makes us feel."] },
          { id:"e2", goal:3, task:"Identify the audience of the <em>Northbound</em> cover.",
            steps:["The cover’s main line, “The Winter That Didn’t Come”, is in a classic serif font.", "The secondary lines advertise cabins under $150 and snowshoe gear.", "I find the cover boring, so it must be aimed at older people.", "Older readers like boring things."],
            answer:2,
            stepFb:["Step 1 is accurate evidence.", "Step 2 is accurate evidence.", "", "Step 4 builds on the faulty step 3."],
            fixes:[{ t:"“The cabins, gear and classic typography suggest adults who travel to the outdoors, people with money and time for cottage-country trips.”", ok:true, why:"It infers the audience from the conventions." },
              { t:"“So it’s aimed at everyone.”", why:"Every text chooses an audience." },
              { t:"“I like it, so it’s aimed at me.”", why:"Same mistake: taste isn’t evidence. " + M7 },
              { t:"“Step 3 is fine.”", why:"It uses personal taste, not the conventions." }],
            hints:["Is “I find it boring” evidence from the text?", "Use the cover lines and typography.", "Adults planning outdoor trips."] },
          { id:"e3", goal:2, task:"Explain the sound in the podcast’s first 15 seconds.",
            steps:["The episode opens without music, using a field recording of boots on slush.", "Ruth’s voice is non-diegetic because it was added in a studio.", "Then a theme sting announces the show.", "Together, these make the opening feel real before it feels like a show."],
            answer:1,
            stepFb:["Correct: a cold open.", "", "Step 3 is accurate: the sting announces the show.", "Step 4 is a fair conclusion. The problem is earlier."],
            fixes:[{ t:"“Ruth’s voice is diegetic: it was recorded on the dock, in the world of the story.”", ok:true, why:M3 },
              { t:"“Ruth’s voice is a sound effect.”", why:"It’s speech, recorded on location." },
              { t:"“Ruth’s voice is the theme music.”", why:"The theme comes at 0:10." },
              { t:"“Step 2 is fine.”", why:"The script says she was recorded on the dock." }],
            hints:["Where was Ruth recorded?", "On the dock.", "Diegetic."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Which remix in Explore surprised you most? What did it teach you about how small choices change meaning?" },
      { id:"j2", q:"In your own words, explain why a media text is never a neutral window." },
      { id:"j3", q:"Explain to a friend how to tell diegetic from non-diegetic sound, using an example from a show you love." },
      { id:"j4", q:"Which convention do you still find hard to name or analyse? What will you watch for this week?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save one line, image or sound from today that you’d like to remember, and add a sentence on why it stuck.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write one craft principle about media in your own words. Then add a master’s example from this module (a frame, cue, cover line or the Aristotle sentence), and an imitation: one choice you would make in your own media text that follows your principle.",
      placeholder:"e.g. Distance is feeling: move the camera closer to make it personal, farther to make it vast.",
      examples:["Frame F1: an overhead extreme long shot shrinks the dock to a speck (<em>No Ice This Year</em>)", "0:09: one second of silence after Ruth’s memory (<em>Small Town, Big Sky</em>)", "Cover line: “The Winter That Didn’t Come” (<em>Northbound</em>)", "Hook: “40 years of ice lanterns. Zero ice this year.”", "“" + STEAL + "” (Aristotle, <i>Rhetoric</i>)"]
    },
    artSamples:[
      { p:"Distance is feeling: move the camera closer to make it personal, farther to make it vast.", m:"frames F1 and F3 of <em>No Ice This Year</em>" },
      { p:"The first line of a post is a door. Make it a door people want to open.", m:"“40 years of ice lanterns. Zero ice this year.”" }
    ],
    principleMin:6,
    cpLines:[HERO_LINES.join(" "), STEAL, "At night we’d hear it: a long groan, like a whale under the ice.", "Forty winters, and I never missed one.", "40 years of ice lanterns. Zero ice this year.", "The Winter That Didn’t Come"]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:2,
        a:{ prompt:"A shot shows a person from the waist up. What is it called?",
          options:[{ t:"Medium shot", ok:true, why:"Waist up is the classic medium shot." }, { t:"Close-up", why:"A close-up fills the frame with a face or object." },
            { t:"Long shot", why:"A long shot shows the whole body in its setting." }, { t:"Low angle", why:"That’s an angle, not a shot size." }] },
        b:{ prompt:"A shot fills the frame with a single eye. What is it called?",
          options:[{ t:"Extreme close-up", ok:true, why:"One detail fills the frame." }, { t:"Close-up", why:"A close-up shows the whole face." },
            { t:"Medium shot", why:"A medium shot frames a person from the waist up." }, { t:"Overhead shot", why:"That’s an angle." }] } },
      { id:"k2", cat:"K", goal:2,
        a:{ prompt:"In a film, a car horn that the characters hear is…",
          options:[{ t:"diegetic sound", ok:true, why:"It exists in the world of the story." }, { t:"non-diegetic sound", why:"Only music or narration added for the audience is non-diegetic. " + M3 },
            { t:"a voice-over", why:"A voice-over is narration." }, { t:"a sound bridge", why:"A sound bridge links two scenes." }] },
        b:{ prompt:"Music that only the audience hears is…",
          options:[{ t:"non-diegetic sound", ok:true, why:"It’s added for us, not heard in the scene." }, { t:"diegetic sound", why:M3 },
            { t:"a cold open", why:"A cold open is a way to begin." }, { t:"silence", why:"Music isn’t silence." }] } },
      { id:"k3", cat:"K", goal:5,
        a:{ prompt:"Which key concept of media literacy says that every media text is made by people making choices?",
          options:[{ t:KC.construct, ok:true, why:"Choices of framing, cutting and wording build every text." }, { t:KC.negotiate, why:"That concept is about readers, not makers." },
            { t:KC.commercial, why:"That one is about money." }, { t:"Each medium has a unique aesthetic form", why:"That one is about form, not construction." }] },
        b:{ prompt:"Which key concept says that two viewers can make different meanings from the same ad?",
          options:[{ t:KC.negotiate, ok:true, why:"Meaning is made by readers as well as makers." }, { t:KC.construct, why:"That’s about how texts are made." },
            { t:KC.commercial, why:"That one is about money and who pays." }, { t:KC.form, why:"That one is about how form shapes content." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"A news segment shows a mayor at a podium in a <strong>low-angle</strong> shot. What does the angle most likely suggest?",
          options:[{ t:"Authority and power: we look up at her", ok:true, why:"We look up at her, so she seems bigger." }, { t:"Weakness, because the camera is low", why:"A low <em>camera</em> looks <em>up</em>; the subject seems bigger." },
            { t:"Neutrality, like an eye-level shot", why:"Eye level is neutral; low angle isn’t." }, { t:"Confusion, because the angle is unusual", why:"The angle has a conventional meaning: power." }] },
        b:{ prompt:"A trailer shows a lone skater on slush in a <strong>high-angle</strong> shot. What does the angle most likely suggest?",
          options:[{ t:"Vulnerability: she seems small and exposed", ok:true, why:"We look down on her, so she seems smaller." }, { t:"Strength, because we see her from above", why:M4 },
            { t:"Speed, because angles show motion", why:"Angle shows status and vulnerability, not speed." }, { t:"Nothing; angle is a technical detail", why:M2 }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A magazine cover has a teen-run skate park as its focal image, the cover line “Build It Yourself”, and neon hand-lettered type. Which conclusion about its audience is best supported?",
          options:[{ t:"Young readers interested in DIY and action, shown by the image, the imperative cover line and the type", ok:true, why:"Three conventions point the same way." }, { t:"Parents, because parents buy magazines", why:"That’s an assumption, not evidence from the cover." },
            { t:"Engineers, because building is involved", why:"“Build it yourself” and neon type don’t point to professionals." }, { t:"Everyone equally", why:"Every cover targets someone; the conventions show who." }] },
        b:{ prompt:"A podcast opens with thirty seconds of a child’s voice recorded at a rink before any music. What is the cold open’s main purpose?",
          options:[{ t:"To hook listeners with a real moment before branding the show", ok:true, why:"A real voice first, the brand second." }, { t:"To save money on music", why:"It’s a deliberate convention, not a budget choice." },
            { t:"To show the podcast is for children", why:"The child is a subject; the audience isn’t defined by who speaks." }, { t:"To make the episode shorter", why:"It adds time; its purpose is engagement." }] } },
      { id:"t3", cat:"T", goal:1,
        a:{ prompt:"A transit authority wants commuters at a bus shelter to grasp, in three seconds, that winter ice days on the lake have dropped by half since 1980 (model statistic). Which design best fits the form?",
          options:[{ t:"One huge number (“½”), a five-word headline and a simple two-bar chart", ok:true, why:"A glance form needs one dominant element." }, { t:"A 300-word explanation in small type", why:"Commuters won’t read paragraphs at a glance." },
            { t:"A QR code linking to a podcast, with nothing else on the poster", why:"The poster itself must carry the message in three seconds." }, { t:"A collage of twelve photos", why:"Too many focal points for a glance." }] },
        b:{ prompt:"In 1938, Orson Welles’s radio adaptation of <em>The War of the Worlds</em> told a Martian invasion as a series of news bulletins interrupting a music program. Why did this choice of form make the drama feel real to some listeners?",
          options:[{ t:"It borrowed the conventions of live radio news (bulletins breaking into music, on-the-scene reports), so listeners heard fiction through a news frame", ok:true, why:"Form carries expectations; a news form signals “this is real”. How widespread the panic actually was is debated by historians." },
            { t:"Radio can’t carry fiction, so listeners assumed it was true", why:"Radio drama was common; the <em>news</em> conventions did the work." },
            { t:"The music made it frightening", why:"The music was the interruptible “normal”; the bulletins created the alarm." }, { t:"Listeners couldn’t hear the actors clearly", why:"Clarity wasn’t the issue; the form was." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which sentence best analyses the trailer’s opening frame (an overhead extreme long shot of grey open water and a tiny empty dock)?",
          options:[{ t:"“The overhead extreme long shot shrinks the dock to a speck, making the missing ice feel vast and the town’s loss bigger than any one person.”", ok:true, why:"It names the convention and its effect." },
            { t:"“The first frame shows the lake from above, and there is a dock.”", why:"Description, not analysis." },
            { t:"“The first frame is beautiful and sets the scene well.”", why:"Opinion with no named choice or effect." },
            { t:"“The first frame is a close-up of the dock, which shows sadness.”", why:"Wrong term: it’s an extreme long shot." }] },
        b:{ prompt:"Which sentence best analyses the podcast’s one-second silence at 0:09?",
          options:[{ t:"“The one-second silence after Ruth’s memory lets her image of ‘a whale under the ice’ hang in the air before the theme breaks in.”", ok:true, why:"It names the choice and what it does." },
            { t:"“There is a silence at 0:09.”", why:"Description, not analysis." },
            { t:"“The silence is a mistake in the editing.”", why:"Assume deliberate choice." }, { t:"“The silence is diegetic music.”", why:"Silence isn’t music." }] } },
      { id:"c2", cat:"C", goal:4,
        a:{ prompt:"Which sentence correctly explains the relationship between form and content?",
          options:[{ t:"“The same story becomes a different story in each form, because each form can show, sound or say different things.”", ok:true, why:"Form and content work together." },
            { t:"“Form is just the packaging; the content stays the same.”", why:M6 },
            { t:"“Content always matters more than form.”", why:"They work together." }, { t:"“Form is only about colours and fonts.”", why:"Form includes time, sound, image and structure." }] },
        b:{ prompt:"Which sentence uses <em>target audience</em> correctly?",
          options:[{ t:"“The hand-lettered type and teen faces suggest the target audience is readers aged 15–19.”", ok:true, why:"It names the audience and the evidence." },
            { t:"“The target audience is whoever happens to see it.”", why:"That’s reach, not target." },
            { t:"“My target audience opinion is that it’s good.”", why:"Not a meaningful use." }, { t:"“The target audience is the magazine’s editor.”", why:"The editor makes it; the audience receives it." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"A town council wants teens to vote on a skate-park design within one week. Which form and conventions fit best?",
          options:[{ t:"A short social video with a hook in the first two seconds, the designs on screen and a clear call to action with the deadline", ok:true, why:"Right form for the audience, the purpose and the deadline." },
            { t:"A 20-page printed report mailed to homes", why:"Wrong form for a teen audience and a one-week deadline." },
            { t:"A radio ad at 6 a.m.", why:"Wrong time and form for teens." }, { t:"A magazine cover with no date or instructions", why:"No call to action or deadline." }] },
        b:{ prompt:"A seniors’ centre needs to explain a bus-route change to its members. Which form and conventions fit best?",
          options:[{ t:"A printed poster and handout with large type, a simple map and the new stop times", ok:true, why:"Clear, lasting information they can keep." },
            { t:"A fast-cut montage video", why:"Fast cuts work against clear, lasting information." },
            { t:"A hashtag campaign", why:"Not the best form for this audience or purpose. " + M6 }, { t:"A podcast episode with no visuals", why:"A route change needs a map." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"Midway through a free podcast, the host reads an ad for a winter-tire shop in her own voice. What is the most important implication for listeners?",
          options:[{ t:"The show is funded by sponsors, and an ad in a trusted host’s voice may persuade more than a separate commercial", ok:true, why:"Media have commercial implications; notice them." },
            { t:"None; it’s just part of the show", why:"Every text has commercial implications. Notice them." },
            { t:"The host must own the tire shop", why:"Unsupported claim." }, { t:"The ad is diegetic sound", why:"It’s a commercial message; diegesis isn’t the point." }] },
        b:{ prompt:"A creator posts a photo in a new jacket a brand sent her for free, praising it. What is the key media-literacy observation?",
          options:[{ t:"This is a commercial relationship; the post works like an ad and should be clearly identified as one", ok:true, why:"Free goods plus praise is a commercial relationship." },
            { t:"It’s purely personal, so there’s nothing to analyse", why:M2 },
            { t:"Jackets can’t be media texts", why:"The <em>post</em> is the media text." }, { t:"The comments prove the jacket is good", why:"Comments aren’t evidence of quality." }] } }
    ]
  },
  task:{
    title:"Performance task: Convention map",
    summary:"Convention map",
    statement:"<p><strong>Choose a real media text: one of your teacher’s real examples, or one you find yourself (a trailer, podcast opening, magazine cover, ad or post). Map its conventions, then write one analytical paragraph showing how the form shapes the message.</strong> There’s no single right paragraph. Make it yours.</p><p>The practice-model texts stay available if you want a rehearsal first.</p><p class='tiny muted'>This checklist makes sure the parts are there. Your teacher reads the writing.</p>" + RUB,
    checks:["Text chosen and credited", "Four conventions mapped, across two layers", "Claim names the text and uses an analysis verb", "Evidence points to two specific moments", "Links to a key concept", "Length"],
    tips:["Choose a text, and fill in its title, maker and date so your teacher can find it.", "Tag at least four elements, and use two layers (for example, Image and Sound).", "Put the title in your claim, and use a verb such as <em>suggests</em>, <em>reframes</em> or <em>intensifies</em>.", "Point to two exact moments: “In frame F5…”, “At 0:09…”.", "Which key concept does your analysis show? Name it.", "Aim for 150–220 words: room for two pieces of evidence, each analysed."],
    explainLabel:"Craft statement",
    explainPrompt:"Craft statement: Which convention mattered most to your reading, and why did you choose to end your paragraph where you did?",
    vocab:"Use <em>convention</em>, <em>effect</em>, <em>purpose</em> and <em>audience</em>.",
    checkLabel:"Check my convention map",
    success:"Your convention map has every part.",
    more:"Try another text or another approach.",
    min:150, max:220,
    afterAt:4,
    labels:{ text:"Text", real:"A real text", credit:"Credit the real text", title:"Title", maker:"Maker or outlet", platform:"Platform", date:"Date (with the year)", link:"Screenshot note or link (stays on this device)",
      map:"Map the conventions", add:"Add an element", addPh:"e.g. 0:12, the opening shot, the masthead", slots:"Paragraph builder", claim:"Claim", evidence:"Evidence", analysis:"Analysis", link2:"Link",
      join:"Put the slots together in my paragraph", para:"Your paragraph (150–220 words)", glance:"Your map at a glance" },
    slotPh:{ claim:"Name the text and say what it does: “<Title> reframes…”", evidence:"Point to an exact moment: frame F3, 0:09, the cover line…", analysis:"What does that choice make us feel, notice or believe?", link2:"Link to a key concept and the purpose." },
    verbs:["suggest", "imply", "reveal", "reframe", "intensif", "undercut", "emphasi", "evoke", "signal", "convey", "build", "heighten", "invite", "transform", "shrink", "amplif", "underscore", "highlight", "establish", "persuade", "teach", "turn", "make", "create"],
    concepts:["all media are constructions", "construction", "constructed", "construct", "audiences negotiate meaning", "negotiate meaning", "negotiates meaning", "commercial implications", "commercial", "form and content", "each medium has a unique aesthetic form"],
    refWords:["cover line", "masthead", "focal image", "caption", "hook", "title card", "headline", "body copy", "white space", "logo", "tagline"],
    models:[
      { title:"Model 1: trailer, shot-size approach",
        text:"<em>No Ice This Year</em> reframes a cancelled festival as a loss too large for any one person to hold. Its opening frame F1, an overhead extreme long shot, shrinks the dock to a speck against open water, so absence itself becomes the subject. Then the camera moves in: frame F3’s close-up of Ruth’s hands turning an old photograph makes that vast absence intimate, and her voice-over (“Forty winters…”) gives it a face. The editing completes the argument. The silence at frame F5, as the thermometer reads +3 °C, holds our breath, and the montage that follows floods the screen with what is gone. By moving from far to near to remembered, the trailer teaches us how to feel before it asks us to watch. It shows that all media are constructions: the same empty lake could have been filmed as a postcard, but these choices make it an elegy." },
      { title:"Model 2: podcast, sound approach",
        text:"<em>Small Town, Big Sky</em> reframes a warm winter as a sound the town has lost. At 0:00 the episode opens cold, with no music: boots on slush, recorded on the dock, and Ruth remembering how the ice groaned “like a whale under the ice.” Because both sounds are diegetic, we arrive inside Larchmere before anyone tells us where we are. At 0:09 one second of silence follows her memory, and that gap suggests the missing sound itself: the lake that no longer sings. Only then does the theme sting announce the show, so the episode earns our trust before it brands itself. Yet at 0:33 the host reads a sponsor message for Larchmere Hardware in the same warm voice. That moment reveals the episode’s commercial implications: the intimacy that makes Ruth’s grief feel close also makes the ad sound like a neighbour’s advice. The form that builds our trust is the form that spends it." },
      { title:"Model 3: print poster, design approach (the mock “Light One” poster)",
        text:"The “Light One” poster reframes a cancelled festival as an invitation small enough to accept. Its white space does most of the work: one paper lantern glows near the top of a nearly empty midnight-blue page, so the darkness reads as the missing winter and the single light as hope. The emptiness suggests that one small act still matters, rather than that the festival has shrunk. The two-word headline, “Light one.”, turns loss into an instruction; its imperative verb hands the reader a job instead of a sorrow. Only at the bottom, in small type, does the tagline give the facts: Saturday, 6 pm, library lawn. The order is the argument: feeling first, details last. The poster shows that all media are constructions: the same notice could have been a crowded list of times and rules, but these choices of space, scale and word make a cancellation feel like a beginning." }
    ],
    modelsLabel:"Three model responses", modelsNote:"Three different approaches; all pass the checklist. Yours should be your own.",
    rubric:RUBRIC
  },
  cards:[
    ["Medium", "From Latin <em>medius</em>, “middle”: what stands between a message and its audience. Plural: media."],
    ["Convention", "An expected technique of a form (the cover line, the cold open, the title card) that audiences know how to read."],
    ["Shot sizes", "Extreme long → long → medium → close-up → extreme close-up. Distance shapes feeling."],
    ["Low angle", "The camera looks up; the subject seems powerful. (“This winter, they’re building a festival without ice.”)"],
    ["High angle", "The camera looks down; the subject seems small or vulnerable."],
    ["Diegetic sound", "Sound that exists in the story’s world (boots on slush)."],
    ["Non-diegetic sound", "Sound added for the audience only (theme music, a sting)."],
    ["Montage", "A rapid series of shots that compresses time or builds feeling."],
    ["Cover line", "A headline on a magazine cover; its size and placement rank the stories."],
    ["Hook", "The opening seconds or first line designed to stop a scrolling viewer."],
    ["All media are constructions", "Every text is built from choices, never a neutral window."],
    ["Form and content", "Change the form and you change what the content can say. “All the world’s a stage…”"]
  ]
};
