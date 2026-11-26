// ENG4U 24 Creating an Original Media Text. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/24-creating-media.md
// Public-domain texts, quoted as the plan prints them:
//   Samuel Taylor Coleridge, Table Talk, 12 July 1827 ("prose = words in their best order; poetry = the best words in the best order").
//   William Strunk Jr., The Elements of Style, 1918 ("Vigorous writing is concise. …").
// VERIFY: both quotations against a public-domain edition (Coleridge's Table Talk, 1835; Strunk 1918, rule 13) before release;
// they were taken from the plan and not re-checked against an edition during this build.
// VERIFY: the fictional names "Maple Hollow Public Library" and "Signal Check" against real organizations and shows; rename if they match.
// VERIFY: copyright teaching stays general (credit vs permission, public domain, licences); add Canadian fair-dealing notes only if the teacher wants them.

const M1 = "Name who they are, what they already believe and where they’ll meet your text. “Teens” is a crowd; “Grade 9s who want friends but feel shy about clubs” is a person.";
const M2 = "Ask where and how your audience will meet the text. A commuter can’t read a poster while driving.";
const M3 = "Every element must earn its place. Strunk’s rule for sentences holds for frames and layouts too.";
const M4 = "Let the image show and the words anchor or extend. Repeating the picture in words wastes the reader’s three seconds.";
const M5 = "Write for the ear: short sentences, signposts, repetition. Never say “as you can see”.";
const M6 = "A storyboard is a plan of shots, timing and sound. Stick figures and clear notes are enough.";
const M7 = "Feedback is evidence about the audience’s experience. Ask questions whose answers you can act on.";
const M8 = "Credit isn’t permission. Use your own work, public-domain material or a licence that allows reuse, and credit it.";
const COLE = "I wish our clever young poets would remember my homely definitions of prose and poetry; that is, prose = words in their best order; poetry = the best words in the best order.";
const STRUNK = "Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences, for the same reason that a drawing should have no unnecessary lines and a machine no unnecessary parts.";
const CC = "(Samuel Taylor Coleridge, <i>Table Talk</i>, 12 July 1827)";
const SC = "(William Strunk Jr., <i>The Elements of Style</i>, 1918)";
const RUB = "<details class='alg cm-rubric'><summary>How your teacher reads it (levels 1–4)</summary><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Criterion</th><th scope='col'>Level 1</th><th scope='col'>Level 2</th><th scope='col'>Level 3</th><th scope='col'>Level 4</th></tr></thead><tbody>" +
  "<tr><td>Knowledge: forms and conventions</td><td>Few conventions; misused</td><td>Some conventions used correctly</td><td>Conventions used correctly and purposefully</td><td>Conventions used with economy; each earns its place</td></tr>" +
  "<tr><td>Thinking: brief, audience and revision</td><td>Vague audience; no revision logic</td><td>Audience named; generic revisions</td><td>Specific audience; revisions answer evidence</td><td>Choices anticipate the audience; revisions sharpen the message</td></tr>" +
  "<tr><td>Communication: craft of words, images and sound</td><td>Unclear message</td><td>Message clear but flat</td><td>Clear, vivid, well ordered</td><td>Memorable; order and rhythm make the meaning</td></tr>" +
  "<tr><td>Application: ethics, accessibility, credit</td><td>Uncredited assets or misleading content</td><td>Partial credit or accessibility</td><td>Credited, accessible, honest</td><td>Accessibility and honesty built into the design</td></tr></tbody></table></div></details>";

// P2's segment: one 42-word sentence, then the same ideas as three 14-word sentences
const LONG = "Most of us share a post within seconds of seeing it, before we even check who made it, who else reports it, or what the source really said, and that, right there, is exactly how a rumour spreads through a whole school.";
const SPLIT = "Most of us share a post within seconds of seeing it, before checking anything. We skip who made it, who else reports it, and what the source said. So that, right there, is exactly how a rumour spreads through a whole school.";

const P = (o) => Object.assign({ shot:"m", angle:"eye", move:"static", dur:5, vis:"", audio:"", text:"", km:false }, o);

export default {
  id:"24-creating-media",
  kind:"topic",
  title:"Creating an original media text",
  topic:"Creating an Original Media Text",
  readyTopic:"creating media texts",
  hero:{
    headline:"The best things, in the best order",
    text:"Coleridge was talking about poems, but the rule holds for every medium. A poster is the best image and the fewest words, placed where the eye will find them. A podcast is the best sentences, in the order an ear can follow. A storyboard is the best shots, timed to the second. In this last module you’ll <strong>make</strong> something of your own: a <strong>brief</strong>, a <strong>form</strong>, its <strong>conventions</strong>, a test with a real <strong>audience</strong>, and a revision.",
    fig:{ html:"<div class='cm-hero' id='cm-hero' role='group' aria-label='Coleridge’s sentence appears. The phrase “the best words in the best order” becomes four tiles that shuffle and slide back into order, then become a poster grid, a strip of six storyboard panels and a podcast waveform marked “cold open”. Caption: Every medium is an order.'></div>", caption:"" },
    quote:COLE, cite:CC,
    tiles:["the best words", "in", "the best", "order"],
    caption:"Every medium is an order.",
    listen:"Listen", watch:"Watch again", noVoice:"Read it yourself: say the sentence aloud and slow down at “the best words in the best order”."
  },
  goals:[
    "I can write a brief that defines my topic, purpose, specific audience, key message and desired action.",
    "I can choose the media form that best fits my purpose and audience, and justify the choice.",
    "I can choose conventions and techniques of my form (layout, shots, sound, script structure, captions) and explain how each communicates my message.",
    "I can produce a polished media text that uses those conventions with craft and economy.",
    "I can test my text with an audience, ask questions that reveal whether the message landed, and revise with that evidence.",
    "I can reflect on my strengths as a maker and explain how my reading, writing, speaking and listening shaped my work."
  ],
  start:{
    blocks:[{ title:"Word story: medium and broadcast", html:"<p><strong><em>Medium</em></strong> comes from Latin <em>medius</em>, “middle”. A medium is whatever stands in the middle between a maker and an audience; <em>media</em> is simply its plural.</p><p><strong><em>Broadcast</em></strong> was a farming word before it was a radio word: to broadcast was to fling seed widely across a field by hand.</p><p class='cm-ws-q'>What stands in the middle between you and your audience? And where will your seed fall?</p><p class='q-actions'><button type='button' class='btn ghost sm' id='cm-ws-say' hidden>Listen</button><span class='tiny muted' id='cm-ws-note' hidden>No local voice on this device: read it aloud yourself.</span></p>" }],
    warmup:{
      questions:[
        { id:"w1", skill:"Audience and purpose", goal:1, prompt:"Which audience description is most useful for planning a media text?",
          options:[{ t:"“Grade 9 students new to the school who want to make friends but feel shy about joining clubs”", ok:true, why:"It names who they are, what they want, and what holds them back." },
            { t:"“Teenagers.”", why:"Too broad to guide a single choice." }, { t:"“Everyone at school.”", why:"A text aimed at everyone lands on no one in particular." }, { t:"“People who like good things.”", why:"That describes nobody in particular." }],
          hints:["Could you picture one real person from the description?", "Look for age, situation and a feeling or belief.", "The Grade 9 description."] },
        { id:"w2", skill:"Audience and purpose", goal:1, prompt:"A media text’s key message should be…",
          options:[{ t:"One sentence the audience should remember, ideally 12 words or fewer", ok:true, why:"If you can’t say it briefly, the audience won’t carry it away." },
            { t:"Every fact about the topic", why:"That’s research, not a message." }, { t:"The text’s title", why:"A title can echo the message, but it isn’t the message." }, { t:"The logo", why:"A logo identifies; it doesn’t say anything." }],
          hints:["What should the audience remember tomorrow?", "One idea, said simply.", "One short sentence."] },
        { id:"w3", skill:"Media conventions", goal:3, prompt:"Which is a convention of a film trailer?",
          options:[{ t:"A fast montage of key moments, ending with the title and release date", ok:true, why:"It teases, then tells you when." },
            { t:"Footnotes", why:"That’s a print or academic convention." }, { t:"A table of contents", why:"Books and reports use these." }, { t:"A byline and dateline", why:"Those are news conventions." }],
          hints:["Picture the last trailer you saw.", "Quick cuts, then…?", "Title and date."] },
        { id:"w4", skill:"Media conventions", goal:3, prompt:"What does a low-angle shot (the camera looking up at the subject) usually suggest?",
          options:[{ t:"Power or importance", ok:true, why:"Looking up makes the subject loom." },
            { t:"Weakness", why:"That’s a high angle, looking down." }, { t:"Distance", why:"Distance is about shot size, not angle." }, { t:"Confusion", why:"A tilted (“Dutch”) angle suggests unease; low angles suggest power." }],
          hints:["Imagine looking up at someone.", "How do they seem?", "Powerful."] },
        { id:"w5", skill:"Writing for the ear", goal:4, prompt:"Which line works best read aloud in a podcast?",
          options:[{ t:"“Here’s the problem. Most of us never check. So let’s change that.”", ok:true, why:"Short sentences, a signpost (“Here’s”), and a turn the ear can follow." },
            { t:"“The problem, which most people (as research from several sources has shown, though not conclusively) never consider, is checking.”", why:"The ear loses the thread in brackets and nested clauses." },
            { t:"“As you can see in Figure 2, checking rates are low.”", why:"A listener can’t see Figure 2." },
            { t:"“Checking; verification; confirmation: all are rarely practised.”", why:"Semicolons don’t read aloud; the rhythm stalls." }],
          hints:["Read each one aloud.", "Which could you follow while walking?", "The short sentences."] },
        { id:"w6", skill:"Revision", goal:5, prompt:"When revising, which should you deal with first?",
          options:[{ t:"Big changes: purpose, audience and structure", ok:true, why:"Polishing a part you’ll cut wastes time. Re-see first, then edit." },
            { t:"Spelling", why:"Spelling is editing, and it comes last." }, { t:"Colours and fonts", why:"That’s surface; check the message first." }, { t:"Nothing until the deadline", why:"Revision needs time." }],
          hints:["Recall “higher-order” and “lower-order” revision from module 05.", "Which changes could make other changes unnecessary?", "Purpose, audience and structure."] }
      ],
      refreshers:{
        "Audience and purpose":"Who are they, what do they believe, where will they meet this? What should they think, feel or do afterward?",
        "Media conventions":"Each form has expected parts and techniques. Trailers have montage and title cards; posters have hierarchy; podcasts have a cold open and sign-off. Conventions help an audience read you quickly.",
        "Writing for the ear":"Short sentences. Signposts (“First…”, “Here’s the thing…”). Repeat the key idea. Describe visuals in words.",
        "Revision":"Re-see the whole (purpose, audience, structure), then edit the parts (sentences, spelling, layout details)."
      }
    }
  },
  explore:{
    heading:"Media studio",
    intro:"Start with a brief, choose a form that fits it, then build. The readouts tell you what a viewer or listener will experience. They don’t judge your ideas; they show you your choices.",
    topics:[{ id:"club", t:"School club recruitment" }, { id:"library", t:"A library reading challenge" }, { id:"check", t:"Checking before you share (from module 22)" }, { id:"volunteer", t:"A local volunteer drive" }, { id:"own", t:"Your own topic" }],
    purposes:[{ id:"inform", t:"inform" }, { id:"persuade", t:"persuade" }, { id:"inspire", t:"inspire" }, { id:"entertain", t:"entertain" }, { id:"provoke", t:"provoke thought" }],
    ages:[{ id:"g78", t:"Grades 7–8" }, { id:"g910", t:"Grades 9–10" }, { id:"g1112", t:"Grades 11–12" }, { id:"a1824", t:"Ages 18–24" }, { id:"a2545", t:"Ages 25–45" }, { id:"a4664", t:"Ages 46–64" }, { id:"a65", t:"65 and over" }],
    habits:[{ id:"phone", t:"scrolls on a phone" }, { id:"commute", t:"listens while commuting or working" }, { id:"walk", t:"walks past in hallways or public spaces" }, { id:"video", t:"watches short videos" }],
    forms:[{ id:"poster", t:"Poster", short:"Poster" }, { id:"podcast", t:"Podcast script", short:"Podcast" }, { id:"psa", t:"PSA storyboard (30 or 60 s)", short:"PSA" }, { id:"social", t:"Social campaign (3 posts)", short:"Social" }],
    // fit score: points for [poster, podcast, psa, social]
    fit:{ habit:{ phone:[0, 0, 2, 3], commute:[0, 3, 0, 0], walk:[3, 0, 0, 1], video:[0, 0, 3, 2] }, complex:[0, 2, 1, 0], quick:[2, 0, 1, 2], inspire:[0, 1, 2, 1] },
    fitHow:"<p>The fit score adds points from your brief. It ranks the forms; it doesn’t choose for you. You may choose any form, but if it isn’t the top-ranked one, write one sentence saying why it fits.</p><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Brief detail</th><th scope='col'>Poster</th><th scope='col'>Podcast</th><th scope='col'>PSA storyboard</th><th scope='col'>Social campaign</th></tr></thead><tbody>" +
      "<tr><td>Habit: scrolls on a phone</td><td>+0</td><td>+0</td><td>+2</td><td>+3</td></tr><tr><td>Habit: listens while commuting or working</td><td>+0</td><td>+3</td><td>+0</td><td>+0</td></tr>" +
      "<tr><td>Habit: walks past in hallways or public spaces</td><td>+3</td><td>+0</td><td>+0</td><td>+1</td></tr><tr><td>Habit: watches short videos</td><td>+0</td><td>+0</td><td>+3</td><td>+2</td></tr>" +
      "<tr><td>Purpose: inform, with a complex explanation (the key message mentions how or why)</td><td>+0</td><td>+2</td><td>+1</td><td>+0</td></tr>" +
      "<tr><td>Desired action is one quick step (10 words or fewer)</td><td>+2</td><td>+0</td><td>+1</td><td>+2</td></tr><tr><td>Purpose: inspire or provoke thought</td><td>+0</td><td>+1</td><td>+2</td><td>+1</td></tr></tbody></table></div>",
    readHow:"<p><strong>Hierarchy</strong> orders the poster’s elements by size, then contrast, then position (cells 1–9, left to right, top to bottom). <strong>Reading path</strong> is a Z when the headline sits in the top row and the call to action in the bottom row; otherwise it’s “scattered”. <strong>Runtime</strong> is spoken words ÷ 150 words a minute (the music cue isn’t counted). <strong>Signposts</strong> counts first, here’s, so, next, remember and now. <strong>Key message appears</strong> lists every place you ticked “Key message here”.</p>",
    blocked:["everyone", "teens", "people", "students"],
    signposts:["first", "here’s", "heres", "so", "next", "remember", "now"],
    stop:["the", "a", "an", "to", "and", "or", "but", "of", "in", "on", "at", "for", "with", "by", "from", "is", "are", "was", "were", "be", "it", "its", "this", "that", "these", "those", "you", "your", "we", "our", "us", "they", "them", "their", "i", "me", "my", "he", "she", "his", "her", "as", "if", "so", "do", "does", "did", "not", "no", "can", "will", "would", "should", "about", "into", "up", "out", "what", "who", "how", "why", "when", "want", "wants", "think", "just", "all", "any", "some", "more", "get", "make", "go", "have", "has", "had", "s"],
    els:[{ id:"headline", t:"Headline" }, { id:"visual", t:"Visual" }, { id:"body", t:"Body" }, { id:"cta", t:"Call to action" }, { id:"logo", t:"Logo/credit line" }],
    icons:[{ id:"book", t:"book" }, { id:"phone", t:"phone" }, { id:"megaphone", t:"megaphone" }, { id:"calendar", t:"calendar" }, { id:"people", t:"people" }, { id:"heart", t:"heart" }, { id:"star", t:"star" }, { id:"music", t:"music" }],
    blocks:[{ id:"cold", t:"Cold open" }, { id:"music", t:"Intro music cue" }, { id:"host", t:"Host introduction" }, { id:"s1", t:"Segment 1", seg:true }, { id:"t1", t:"Transition" }, { id:"s2", t:"Segment 2", seg:true }, { id:"t2", t:"Transition" }, { id:"s3", t:"Segment 3", seg:true }, { id:"sign", t:"Sign-off" }],
    shots:[{ id:"ecu", t:"Extreme close-up" }, { id:"cu", t:"Close-up" }, { id:"m", t:"Medium" }, { id:"l", t:"Long" }, { id:"el", t:"Extreme long" }],
    angles:[{ id:"eye", t:"Eye level" }, { id:"low", t:"Low" }, { id:"high", t:"High" }],
    moves:[{ id:"static", t:"Static" }, { id:"pan", t:"Pan" }, { id:"zoom", t:"Zoom" }],
    posts:[{ id:"teaser", t:"Teaser" }, { id:"main", t:"Main post" }, { id:"follow", t:"Follow-up" }],
    notes:{ m4:M4, m6:M6, m7:M7, ear:"Writing for the ear: short sentences, signposts, repetition, and words for anything a listener can’t see.", p3:"Close-ups trade context for intensity." },
    readout:{ brief:"Brief strength", fit:"Fit", hier:"Hierarchy (poster)", path:"Reading path (poster)", run:"Runtime (podcast)", listen:"Listenability (podcast)", total:"Total time (PSA)", variety:"Shot variety (PSA)", km:"Key message appears", acc:"Accessibility (social)" },
    aha:"Form is a container with rules. When the brief and the form match, every convention has a job, and the readouts show whether each one is doing it.",
    // starting states for the four predictions (a sample project; the student's own project is kept and comes back)
    demos:{
      p1:{ open:"poster", brief:{ topic:"library", purpose:"persuade", age:"g910", belief:"used to love reading but stopped because of homework", habit:"walk", msg:"Read anything this summer and win", action:"Sign up at the library desk" },
        poster:{ headline:{ cell:9, size:"L", con:"high", text:"Read anything. Win something." }, visual:{ cell:5, size:"M", con:"high", icon:"book", text:"" }, body:{ cell:0, size:"S", con:"low", text:"" }, cta:{ cell:1, size:"M", con:"high", text:"Sign up at the desk by June 30" }, logo:{ cell:7, size:"S", con:"low", text:"Library logo" } } },
      p2:{ open:"podcast", podcast:{ s1:LONG } },
      p2after:SPLIT,
      p3:{ open:"psa", psa:[
        P({ shot:"l", vis:"A teen walks into the kitchen after school", audio:"Door closing" }),
        P({ shot:"m", vis:"She opens a group chat", audio:"Notification ping" }),
        P({ shot:"cu", vis:"A message: “Did you hear? The cafeteria is closing!”", audio:"Music sting" }),
        P({ shot:"m", vis:"She frowns, unsure", audio:"Clock ticking" }),
        P({ shot:"l", vis:"She sits at the kitchen table holding her phone, about to share the rumour", audio:"Heartbeat" }),
        P({ shot:"m", vis:"She puts the phone down and opens a search", audio:"Voice-over", text:"Pause. Check. Then share.", km:true })] },
      p3after:{ shot:"ecu", vis:"Her thumb hovers over “Share”" },
      p4:{ open:"social", social:[
        { cap:"Something big is coming to the library on June 14. Can you guess?", alt:"", tags:"#ReadTheNorth", time:"Mon 7:30 a.m." },
        { cap:"It’s free, it’s fun and comics count. Sign up at the desk by June 30!", alt:"", tags:"#ReadTheNorth", time:"Wed 12:15 p.m." },
        { cap:"Last call: three days left to join the summer challenge.", alt:"", tags:"#ReadTheNorth", time:"Fri 3:30 p.m." }] },
      p4alt:["A wrapped gift box with a question mark on its tag, sitting on a library shelf.", "A comic book, a novel, a phone and a cookbook side by side under the words Read anything.", "A calendar page for June with the 30th circled in thick marker."]
    },
    predictions:[
      { id:"p1", prompt:"The headline is in cell 9 (bottom right), the visual in cell 5 and the call to action in cell 1. Swap the headline and the call to action. What changes for a viewer?",
        options:[{ t:"The eye now meets the headline first and the call to action last: a clean Z-path", ok:true }, { t:"Nothing; position doesn’t matter" }, { t:"The poster becomes harder to read" }, { t:"The visual becomes the headline" }],
        explain:"Readers of English start at the top left. Put what they must notice first there, and what they must do last at the end of the path." },
      { id:"p2", prompt:"Segment 1 of this podcast contains one 42-word sentence. Split it into three short sentences without cutting any ideas. What happens to the readouts?",
        options:[{ t:"Runtime barely changes, but average sentence length drops from 42 to 14 words, so the ear can follow", ok:true }, { t:"Runtime halves" }, { t:"Listenability drops because there are more sentences" }, { t:"Nothing changes" }],
        explain:"The ear has no rereading. Shorter units give it places to rest. Press <strong>Hear both versions</strong> under the builder to listen." },
      { id:"p3", prompt:"Panel 5 is a long shot of a teen at a kitchen table holding a phone, about to share a rumour. Change it to an extreme close-up of her thumb hovering over “Share”. What happens to the moment?",
        options:[{ t:"The tension rises: we feel the decision, though we lose the room around her", ok:true }, { t:"The audience loses interest" }, { t:"It becomes more informative" }, { t:"Nothing changes; shots are interchangeable" }],
        explain:"Shot size controls how close the audience stands to the feeling." },
      { id:"p4", prompt:"These three social posts have no alt text. Add alt text to all three posts. What does the accessibility readout now say?",
        options:[{ t:"Screen-reader users can now follow all three posts", ok:true }, { t:"More likes are guaranteed" }, { t:"The posts are now sponsored" }, { t:"The captions get shorter" }],
        explain:"Alt text puts the image into words for people who can’t see it. It’s part of your audience, not an extra." }
    ],
    predIntro:"Each prediction opens a sample project in the studio. Your own project is kept: press <strong>Back to my project</strong> when you’re done.",
    chalIntro:"Use the studio to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right builder. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:1, prompt:"<strong>Write a brief that passes the strength check.</strong> <button type='button' class='btn ghost sm cm-setup' data-setup='brief'>Set it up</button>",
        msgs:{ long:"Cut to the one thing they must remember tomorrow.", everyone:"Name a person you could picture: who, what they believe, where they’ll meet you.", action:"What should they <em>do</em>?" },
        general:"Not yet. Read the Brief strength row: it lists what’s missing.",
        why:"Your brief names a person, a purpose, a message they can carry and an action. Now the form can follow.",
        hints:["Fill all five parts.", "Make the audience someone specific: an age, a belief, a habit.", "Message: 12 words or fewer. Action: begin with a verb."] },
      { id:"tc2", goal:3, prompt:"<strong>Lay out the poster so it reads in a clean Z.</strong> <button type='button' class='btn ghost sm cm-setup' data-setup='poster'>Set it up</button>",
        msgs:{ unplaced:"Place the headline, the visual, the call to action and the logo on the grid first.", mid:"The eye starts at the top. Give it the headline there.", top:"The action belongs at the end of the path.", logo:"The brand isn’t the message." },
        general:"Not yet. Check the conditions: headline L in the top row, the visual over the centre cell, call to action (M or L) and logo in the bottom row in different cells, body text (if used) S.",
        why:"Headline first, call to action last: the Z carries the eye through your message in order.",
        hints:["Trace a Z with your finger: top-left, top-right, centre, bottom.", "Headline at the start of the Z, call to action at the end.", "Headline in the top row (L), visual in the centre, call to action and logo in the bottom row."] },
      { id:"tc3", goal:4, stretch:true, prompt:"<strong>Build a 30-second PSA storyboard that holds the eye and lands the message.</strong> Exactly 6 panels; whole seconds from 1 to 8 each, totalling 30; at least 3 shot types, never the same one twice in a row; a close-up or extreme close-up at the turn (panel 4 or 5); the key message (ticked) as on-screen text or dialogue in the final panel. <button type='button' class='btn ghost sm cm-setup' data-setup='psa'>Set it up</button>",
        msgs:{ six:"This spot has exactly six panels. Add or remove panels until there are six.", shot:"Choose a shot type for every panel.", dur:"Give each panel a whole number of seconds from 1 to 8.", off:"Broadcast slots are exact. Find the missing or extra second.", sum:"The panels must total exactly 30 seconds; yours total {t}.", variety:"Use at least three different shot types.", repeat:"Change one; repetition flattens the rhythm.", turn:"Put a close-up or extreme close-up at the turn: panel 4 or 5.", end:"End on the message. The last frame is what they carry away." },
        general:"Not yet. Read the Total time and Shot variety rows.",
        why:"Thirty seconds, six choices, one message: that’s economy.",
        hints:["Plan the arc: set-up (panels 1–3), turn (4–5), message (6).", "Try 4 + 5 + 5 + 6 + 4 + 6 = 30.", "Alternate shot sizes; put the close-up at the turn and the message last."] }
    ],
    blocks:[]
  },
  part3:{
    slug:"test", name:"Test",
    heading:"Test with an audience",
    intro:"Explore built your text. Now treat it as a hypothesis. Write questions that reveal whether the message landed, run the test in class, then revise with evidence. Everything you log stays on this device.",
    bank:{
      purpose:[{ id:"pg", t:"After seeing this, what do you think it wants you to do?" }, { id:"pw", t:"Do you like it?", weak:"Liking doesn’t tell you if the message landed." }],
      audience:[{ id:"ag", t:"Who do you think this was made for?" }, { id:"aw", t:"Isn’t it great?", weak:"That’s leading; it asks for agreement." }],
      choice:[{ id:"cg", t:"What did you notice first?" }, { id:"cw", t:"Would you change anything?", weak:"Too vague to act on." }]
    },
    kinds:[{ id:"purpose", t:"Purpose question" }, { id:"audience", t:"Audience question" }, { id:"choice", t:"Question about a specific choice" }],
    s1:"<strong>Station 1: Write questions that reveal.</strong> Choose three questions from the bank, or write your own: one about <strong>purpose</strong>, one about the <strong>audience</strong> and one about a <strong>specific choice</strong>.",
    s2:"<strong>Station 2: Run the test (in class).</strong> Show your text to 3–5 classmates. Type each tester’s answers into the log (first names only, or none). For the purpose question, ask each tester for a one-sentence summary; it’s compared with your key message.",
    caveat:"This is a rough signal. Read what they actually said.",
    matchHow:"“Match” means the summary shares at least 2 content words with your key message (words such as “the”, “a” and “to” are ignored). Otherwise it’s a “miss”.",
    self:"Testing in class isn’t possible? Leave your text for 24 hours, then re-view it yourself and log what you notice as a self-test. Your teacher will see which you used.",
    s3:"<strong>Station 3: Revise with evidence.</strong> Save a “before” copy, then make <strong>two</strong> revisions in the builder that respond to the most common miss. Link each one to a logged response and say what you changed and why.",
    retest:"Re-test one tester (optional): show them the revised text and log their new one-sentence summary.",
    craft:"Craft → meaning",
    blocks:[],
    quickCheck:{ title:"Test with an audience: quick check", summary:"Test with an audience quick check",
      items:[
        { id:"q1", goal:5, prompt:"Which question best tests whether your purpose landed?",
          choices:[{ t:"“What do you think it wants you to do?”", ok:true }, { t:"“Do you like it?”" }, { t:"“Isn’t the colour great?”" }, { t:"“Any thoughts?”" }],
          right:"Right. Only this one checks the purpose.", wrong:"Only this one checks the purpose; the others measure taste, ask for agreement or are too vague. " + M7 },
        { id:"q2", goal:5, prompt:"Four of five testers say your poster is “selling books”. Your purpose was a free library event. Best first revision?",
          choices:[{ t:"Put “FREE” and the date in the headline zone", ok:true }, { t:"Make the logo bigger" }, { t:"Add more images" }, { t:"Change the font colour" }],
          right:"Right. Fix the miss where the eye looks first.", wrong:"Fix the miss where the eye looks first." },
        { id:"q3", goal:5, prompt:"A tester says, “I didn’t get it.” What’s your best next move?",
          choices:[{ t:"Ask what they noticed first and what they thought it was about", ok:true }, { t:"Explain it to them" }, { t:"Ignore it" }, { t:"Ask another tester to disagree" }],
          right:"Right. Gather evidence before defending your choices.", wrong:"Gather evidence before defending your choices." },
        { id:"q4", goal:4, prompt:"Strunk’s rule applied to a storyboard means…",
          choices:[{ t:"Every panel must earn its place", ok:true }, { t:"Use the fewest colours" }, { t:"Never use music" }, { t:"Always 6 panels" }],
          right:"Right. Economy is about necessity, not a fixed number.", wrong:"Economy is about necessity, not a fixed number. " + M3 }
      ] },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class='steal-line'>“" + STRUNK + "”</p><p class='eng-cite'>" + SC + "</p><p><strong>The pattern:</strong> “A ___ should contain no unnecessary ___, a ___ no unnecessary ___, for the same reason that ___.”</p><p><strong>Your turn:</strong> write it for your own medium.</p><p><strong>Example:</strong> “A poster should contain no unnecessary words, a storyboard no unnecessary panels, for the same reason that a joke should have no unnecessary pauses.”</p>",
      prompt:"Your imitation" }]
  },
  practice:{
    activities:[
      { id:"conv", type:"match", title:"Convention ↔ form", summary:"Convention ↔ form", goal:[2, 3],
        instruction:"Match each convention to the form where an audience meets it. Trivium: Grammar.", how:"Tap a convention on the left, then tap its form on the right.",
        leftTitle:"Convention", rightTitle:"Form",
        left:[
          { id:"L1", t:"Cold open", why:"An audio hook before the theme music." },
          { id:"L2", t:"Visual hierarchy and a reading path", why:"Size, contrast and position lead the eye." },
          { id:"L3", t:"Shot type, angle and duration for each frame", why:"A storyboard plans every frame.", wrong:"A storyboard plans shots and timing; the drawing can be simple." },
          { id:"L4", t:"Alt text and a campaign hashtag", why:"Platform conventions for posts." },
          { id:"L5", t:"Montage ending in a title card and date", why:"It teases, then tells you when." },
          { id:"L6", t:"Cover lines around a masthead", why:"The teasers around a publication’s name.", hints:["Where do you see the title of a publication in huge letters?", "That’s a masthead; the short teasers around it are…", "Cover lines, on a magazine cover."] },
          { id:"L7", t:"A call to action in the final frame", why:"A public service announcement ends on what to do." },
          { id:"L8", t:"Data shown as a chart or map with a short headline", why:"Information to scan, not to watch once." }
        ],
        right:[{ id:"podcast", t:"Podcast" }, { id:"poster", t:"Poster" }, { id:"storyboard", t:"Storyboard" }, { id:"social", t:"Social post" }, { id:"trailer", t:"Trailer" }, { id:"magazine", t:"Magazine cover" }, { id:"psa", t:"PSA" }, { id:"infographic", t:"Infographic" }],
        answer:{ L1:"podcast", L2:"poster", L3:"storyboard", L4:"social", L5:"trailer", L6:"magazine", L7:"psa", L8:"infographic" },
        wrong:{ "L1|trailer":"A trailer opens on images; a cold open is an <em>audio</em> hook before the theme music.", "L4|poster":"Posters can’t have alt text. Hashtags and alt text are platform conventions." },
        wrongDefault:"Ask where the audience meets this convention." },
      { id:"prob", type:"mc", title:"Producer’s problems", summary:"Producer’s problems", goal:[2, 3, 4], star:true,
        instruction:"Six problems from real productions. Choose the best fix. The starred ones (★) go beyond the Final Check. Trivium: Rhetoric.",
        items:[
          { id:"p1", goal:4, prompt:"Your audience listens to your podcast while driving, and your script says “as you can see on the map”.",
            options:[{ t:"Describe the route in words with landmarks (“past the library, then left at the arena”)", ok:true, why:"Landmarks put the map into the ear." },
              { t:"Keep “as you can see”", why:"A driver can’t look; write for the ear." },
              { t:"Put the map in the show notes and keep the line", why:"The line still asks a listener to look." },
              { t:"Read out the map’s coordinates", why:"Numbers the ear can’t hold aren’t directions." }],
            hints:["Where are the listener’s eyes?", "On the road. What can words give them instead?", "Describe the route in words, with landmarks."] },
          { id:"p2", goal:3, prompt:"The platform caps your video at 6 seconds; your message is 25 words.",
            options:[{ t:"One striking image and a 6-word line; move the detail to the caption", ok:true, why:"Six seconds holds one image and one line; the caption carries the rest." },
              { t:"Speed up the voice-over", why:"Faster isn’t clearer. Cut to the core." },
              { t:"Show all 25 words on screen at once", why:"Nobody reads 25 words in 6 seconds." },
              { t:"Split the message across ten quick cuts", why:"More cuts scatter the eye. " + M3 }],
            hints:["How much can anyone take in during 6 seconds?", "One image, one short line.", "Cut to a 6-word line and move the detail to the caption."] },
          { id:"p3", goal:3, prompt:"Your poster hangs in a hallway where people pass in about 3 seconds.",
            options:[{ t:"A headline of 6 words or fewer, one image, a call to action at the bottom", ok:true, why:"Three seconds is enough for one line, one image and one instruction." },
              { t:"Add a detailed paragraph", why:"Nobody stops for a paragraph in 3 seconds." },
              { t:"Use five small images to show every activity", why:"Five images scatter the eye." },
              { t:"Make the logo the largest element", why:"The brand isn’t the message." }],
            hints:["What can anyone read in 3 seconds?", "One line, one picture, one action.", "A short headline, one image, a call to action at the bottom."] },
          { id:"p4", goal:4, star:true, prompt:"★ Two of your five testers use screen readers; your campaign is all images with text baked into them.",
            options:[{ t:"Add alt text that includes the image’s words, and put the key message in the caption text", ok:true, why:"A screen reader reads alt text and captions, not pixels." },
              { t:"Make the images brighter", why:"Brightness doesn’t help a screen reader; words do." },
              { t:"Add more hashtags", why:"Hashtags don’t describe the image." },
              { t:"Make the baked-in text larger", why:"A screen reader still can’t read text inside an image." }],
            hints:["What does a screen reader read aloud?", "Words: alt text and captions.", "Put the image’s words in alt text and the key message in the caption."] },
          { id:"p5", goal:2, star:true, prompt:"★ Your message is the new bus routes from three schools, with times.",
            options:[{ t:"Switch the form to an infographic or map post, with a short headline", ok:true, why:"Routes and times are looked up, so they need a form people can scan." },
              { t:"Keep the 30-second PSA", why:"Times and routes need to be scanned, not watched once." },
              { t:"Record a 20-minute podcast reading every time", why:"No one can hold a timetable in their ear." },
              { t:"Make a poster with every route in one paragraph", why:"A paragraph of times can’t be scanned." }],
            hints:["How will the audience use this information?", "They’ll look up <em>their</em> route and time.", "A map or infographic they can scan."] },
          { id:"p6", goal:4, star:true, prompt:"★ Your favourite song fits your PSA perfectly, and you found it online. You’ll credit the artist.",
            options:[{ t:"Use your own music, public-domain music or a track whose licence allows reuse, with credit", ok:true, why:"Permission comes from ownership, the public domain or a licence. Then you credit it." },
              { t:"Credit is enough", why:"Credit isn’t permission. You need the right to use it." },
              { t:"Use only 30 seconds of it", why:"That’s a myth; length doesn’t create permission." },
              { t:"It’s for school, so any song is fine", why:"A school project shared publicly still needs the right to use the song." }],
            hints:["What’s the difference between credit and permission?", "Who decides whether you can use the song?", "Its owner or its licence. Choose your own, public-domain or properly licensed music."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the Error", summary:"Spot the error", student:"Cyrus", goal:[1, 4, 3],
        instruction:"Cyrus planned three media texts. Each plan has one mistake. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.", how:"",
        problems:[
          { id:"e1", goal:1, task:"A brief for a school-club recruitment poster.",
            steps:["Topic: recruiting new members for the robotics club.", "Audience: everyone at school.", "Key message: robotics is fun and you should join today.", "Form: poster, because I like drawing."],
            answer:1, stepFb:["A clear topic. Keep checking.", "", "This is reasonable, but it depends on a vague audience. Look earlier.", "This is a second issue, but the first mistake is earlier."],
            fixes:[{ t:"Audience: Grade 9 and 10 students who like building things but think robotics is only for experts.", ok:true, why:"Right: an age, an interest and a doubt you can answer." },
              { t:"Audience: students.", why:"Still a crowd, not a person." }, { t:"Audience: the robotics club.", why:"They’re already members." }, { t:"Sentence 2 is correct.", why:"“Everyone” guides no choices." }],
            hints:["Could you picture one person from sentence 2?", "Add an age, an interest and a doubt.", "Grade 9–10 builders who think robotics is only for experts."] },
          { id:"e2", goal:4, task:"Plan for a podcast segment about checking sources.",
            steps:["Cold open: a 10-second clip of a fake headline being read aloud.", "Then the theme music and the host’s introduction.", "Segment 1: “As you can see in the chart below, most people never check.”", "Sign-off: repeat the key message, “Pause, check, then share.”"],
            answer:2, stepFb:["A strong hook.", "The standard order.", "", "A good echo of the message."],
            fixes:[{ t:"Segment 1: “Here’s the surprising part. Most people never check. Not once.”", ok:true, why:"Right: short sentences and a signpost the ear can follow." },
              { t:"Add a link to the chart in the show notes and keep the line.", why:"The line still asks a listener to look." },
              { t:"Speak the chart’s numbers in one long sentence.", why:"The ear can’t hold a long list." }, { t:"Sentence 3 is correct.", why:"Listeners can’t see a chart." }],
            hints:["Which sentence only works if you can see something?", "“As you can see…”", "Turn the chart into a short spoken surprise."] },
          { id:"e3", goal:3, task:"A 30-second PSA storyboard plan.",
            steps:["Six panels: long shot, medium, close-up, extreme close-up, medium, long.", "Durations: 5, 5, 5, 6, 5, 5 seconds, which makes 30.", "The key message appears as on-screen text in panel 6."],
            answer:1, stepFb:["Good variety, with no repeats in a row.", "", "Correct placement."],
            fixes:[{ t:"Those durations total 31 seconds. Trim one 5-second panel to 4 seconds.", ok:true, why:"Right: 5 + 5 + 5 + 6 + 5 + 5 = 31, so one second has to go." },
              { t:"Add a seventh panel.", why:"That makes it longer still." }, { t:"31 seconds is close enough.", why:"Broadcast slots are exact." }, { t:"Sentence 2 is correct.", why:"5 + 5 + 5 + 6 + 5 + 5 = 31." }],
            hints:["Add the durations.", "5 + 5 + 5 + 6 + 5 + 5 = ?", "31: trim one second."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"What did your testers notice that you didn’t? What does that tell you about the distance between a maker and an audience?" },
      { id:"j2", q:"In your own words, what makes a convention “earn its place”? Give one you kept and one you cut." },
      { id:"j3", q:"Explain to a friend how to choose a form: what questions should they ask first?" },
      { id:"j4", q:"Which skill from earlier in the course (reading closely, writing concisely, speaking, listening) helped you most here, and how?" }
    ],
    blocks:[{ title:"Commonplace book", html:"<p>Save the one line, from anywhere in the course, that you most want to remember in ten years.</p><div id='cp-app'></div>" }],
    art:{
      intro:"Write the principle of making you’d pass on to next year’s students. Copy the master’s example that taught it to you (Coleridge, Strunk or any text in the course), then show it in a line or frame of your own.",
      placeholder:"Your principle of making, in your own words",
      examples:["poetry = the best words in the best order " + CC,
        "a drawing should have no unnecessary lines and a machine no unnecessary parts " + SC,
        "Vigorous writing is concise. " + SC]
    },
    artSamples:[
      { p:"Decide what they should carry away, then cut everything that doesn’t carry it.", m:"Strunk, “no unnecessary lines.”" },
      { p:"Order is meaning: what comes last is what stays.", m:"Coleridge, “the best words in the best order.”" }
    ],
    principleMin:6,
    book:{
      title:"Capstone: the preface to your Art of Language",
      intro:"Your Art of Language opens below as a book: every principle you’ve written across the course, grouped under Grammar, Logic and Rhetoric, with each master’s example and your imitation, followed by your commonplace book.",
      prompt:"Read your Art of Language from the first page to the last. Then write its preface: one paragraph (120–200 words) for a reader who will inherit this book. Answer four questions in your own order:",
      questions:["What does your art value most?", "Which principle do you return to again and again, and why?", "Which early principle would you now revise or argue with?", "What will you keep practising after this course ends?"],
      few:"You have only a few principles so far. Read the principles you have, and write the preface you’d want them to grow into.",
      checks:["120–200 words", "Quotes one of your principles (3 or more words in a row)", "Has a sentence beginning “I will” or “I’ll”"],
      closing:"This book is yours. Keep adding to it.",
      empty:"No principles saved yet on this device. Each module’s Reflect part adds one."
    }
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"Which shot best shows a character’s emotion at the moment of a decision?",
          options:[{ t:"A close-up or extreme close-up", ok:true, why:"Shot size brings the audience close to the feeling." }, { t:"An establishing shot", why:"That shows <em>where</em>, not how someone feels." },
            { t:"A long shot", why:"It shows the body in its setting; the face is small." }, { t:"A bird’s-eye view", why:"Very distant and detached." }] },
        b:{ prompt:"Which shot best tells an audience where a scene takes place?",
          options:[{ t:"An establishing (long or extreme long) shot", ok:true, why:"It shows the setting first." }, { t:"An extreme close-up", why:"Too close to show the place." },
            { t:"A close-up", why:"It shows a face, not a location." }, { t:"A point-of-view shot of a hand", why:"Too narrow to orient the audience." }] } },
      { id:"k2", cat:"K", goal:3,
        a:{ prompt:"In poster design, “visual hierarchy” means…",
          options:[{ t:"Arranging size, contrast and position so viewers notice the elements in the intended order", ok:true, why:"Size, contrast and position decide what the eye meets first." }, { t:"Listing sponsors by importance", why:"Hierarchy is about attention, not rank." },
            { t:"Using as many fonts as possible", why:"More variety usually breaks the hierarchy." }, { t:"Always making the logo largest", why:"The message, not the brand, usually leads." }] },
        b:{ prompt:"A podcast’s “cold open” is…",
          options:[{ t:"A short, gripping clip or line before the theme music and introduction", ok:true, why:"It hooks the ear before the show introduces itself." }, { t:"The silence at the end", why:"That’s not a convention." },
            { t:"The host reading the show notes", why:"That isn’t a hook." }, { t:"An advertisement break", why:"Ads aren’t the cold open." }] } },
      { id:"k3", cat:"K", goal:4,
        a:{ prompt:"Alt text on a social post is for…",
          options:[{ t:"Describing the image in words for people using screen readers, or when images don’t load", ok:true, why:"It puts the image into words." }, { t:"Adding extra hashtags", why:"Hashtags go in the caption." },
            { t:"Search ranking only", why:"It may help search, but accessibility is its purpose." }, { t:"Stating who owns the copyright", why:"That goes in the credit line." }] },
        b:{ prompt:"Which is the safest way to include music in a media text you’ll share publicly?",
          options:[{ t:"Use your own music, public-domain music, or a track whose licence allows reuse, with credit", ok:true, why:"Ownership, the public domain or a licence gives permission; credit names the source." }, { t:"Any song, if you use under 30 seconds", why:"That’s a myth; length doesn’t create permission." },
            { t:"Any song, if you credit the artist", why:"Credit isn’t permission." }, { t:"Any song, if your project is non-profit", why:"Being non-profit doesn’t grant rights." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"Audience: adults aged 25–45 who listen to audio while driving to work. Purpose: explain changes to bus routes. Which form fits best?",
          options:[{ t:"A short podcast or audio segment that describes the changes with landmarks", ok:true, why:"It meets them where they are: listening, eyes on the road." }, { t:"A poster at bus stops", why:"Drivers don’t stand at bus stops." },
            { t:"A silent social video", why:"They can’t watch while driving." }, { t:"An infographic", why:"They can’t read while driving." }] },
        b:{ prompt:"Audience: Grade 9 students who scroll their phones at lunch. Purpose: get them to sign up for a club by Friday. Which form fits best?",
          options:[{ t:"A short vertical video or social post with a clear sign-up link and the deadline", ok:true, why:"It meets them in the feed, with one quick action and a date." }, { t:"A 20-minute podcast", why:"Too long for lunch scrolling." },
            { t:"A printed brochure mailed home", why:"That misses where they are and when." }, { t:"A 2000-word article", why:"Far too long for one quick action." }] } },
      { id:"t2", cat:"T", goal:3,
        a:{ prompt:"A 30-second PSA storyboard has panels of 6, 5, 4, 7 and 6 seconds. The producer adds a final 4-second panel with the call to action. What must happen?",
          options:[{ t:"Trim 2 seconds from the earlier panels, because the total would be 32", ok:true, why:"6 + 5 + 4 + 7 + 6 = 28, and adding 4 makes 32." }, { t:"Nothing: it already totals 30", why:"28 + 4 = 32, not 30." },
            { t:"Add 2 seconds somewhere", why:"That makes it 34." }, { t:"Remove the call-to-action panel", why:"Then the message has no final frame." }] },
        b:{ prompt:"A 30-second PSA has panels of 5, 5, 6 and 8 seconds. The producer adds a final 4-second panel. What must happen?",
          options:[{ t:"Add 2 seconds to the earlier panels, because the total would be 28", ok:true, why:"5 + 5 + 6 + 8 = 24, and adding 4 makes 28." }, { t:"Trim 2 seconds", why:"That makes it 26." },
            { t:"Nothing: it totals 30", why:"24 + 4 = 28." }, { t:"Cut the final panel", why:"That loses the call to action." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"A poster’s message must become a 30-second radio spot. Which change best keeps the message?",
          options:[{ t:"Turn the headline into a spoken hook, repeat it at the end, and describe the key image in words", ok:true, why:"Audio needs repetition and description where the poster had sight." }, { t:"Read the poster’s text aloud exactly", why:"Poster text relies on layout the ear can’t see." },
            { t:"Add background music only", why:"Music can’t carry the message alone." }, { t:"Drop the call to action because audio can’t show it", why:"Say it aloud, with the time and place." }] },
        b:{ prompt:"A podcast segment must become a single poster. Which change best keeps the message?",
          options:[{ t:"Reduce it to a 6-word headline, one image and one call to action", ok:true, why:"A poster gets seconds, not minutes." }, { t:"Print the full transcript on the poster", why:"No one reads a transcript in a hallway." },
            { t:"Add a QR code only", why:"The poster still needs a message of its own." }, { t:"Use as many images as the segment had topics", why:"That scatters the eye." }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which sentence from a producer’s statement best explains a choice?",
          options:[{ t:"“Because my audience scrolls at lunch, I ended on a close-up of a thumb over ‘Share’ so the decision is the last thing they see.”", ok:true, why:"It names the audience, the convention and the effect." }, { t:"“I made a PSA about sharing.”", why:"That’s a summary, not a reason." },
            { t:"“I really like close-ups.”", why:"That’s taste, not purpose." }, { t:"“The PSA turned out great.”", why:"That’s an evaluation without a reason." }] },
        b:{ prompt:"Which sentence best explains a poster choice?",
          options:[{ t:"“I placed ‘FREE’ in the headline’s top-left slot because my testers missed that the event costs nothing, and the eye starts there.”", ok:true, why:"Evidence, choice and effect." }, { t:"“I used a nice blue.”", why:"Taste, not reason." },
            { t:"“The poster is about the library.”", why:"Summary." }, { t:"“Everyone will love it.”", why:"A claim with no basis." }] } },
      { id:"c2", cat:"C", goal:5,
        a:{ prompt:"Which feedback question best tests whether the audience understood the purpose?",
          options:[{ t:"“After seeing this, what do you think it wants you to do?”", ok:true, why:"It asks what they took away, not whether they liked it." }, { t:"“Do you like it?”", why:"That measures taste." },
            { t:"“Isn’t the colour great?”", why:"That’s leading." }, { t:"“Would you change anything?”", why:"Too vague to act on." }] },
        b:{ prompt:"Which is the best way to record feedback so you can act on it?",
          options:[{ t:"Log each tester’s exact words for each question, then look for the most common miss", ok:true, why:"Exact words are evidence you can act on." }, { t:"Remember the general vibe", why:"Memory blurs the evidence." },
            { t:"Record only the positive comments", why:"That hides what needs fixing." }, { t:"Ask testers to rate the text from 1 to 10 only", why:"A number doesn’t say what to change." }] } },
      { id:"a1", cat:"A", goal:[1, 2],
        a:{ prompt:"The Maple Hollow Public Library (fictional) wants teens to join a summer reading challenge. There’s no budget, and you have 2 weeks. Which brief is strongest?",
          options:[{ t:"“Audience: Grade 9–11 students who used to love reading but stopped because of homework. Message: ‘Read anything, even comics, and win summer prizes.’ Form: social campaign of 3 posts.”", ok:true, why:"A specific audience, a short message and a free, fast form." },
            { t:"“Audience: teens. Message: ‘reading is good.’ Form: TV commercial.”", why:"A vague audience, and an expensive form." },
            { t:"“Audience: everyone. Message: the library’s full history. Form: poster.”", why:"“Everyone” guides no choices, and a history isn’t a message." },
            { t:"“Audience: parents. Message: ‘make your kids read.’ Form: podcast.”", why:"The wrong audience for a teen challenge." }] },
        b:{ prompt:"A local food bank (fictional) needs Grade 12 volunteers for Saturday shifts. Which brief is strongest?",
          options:[{ t:"“Audience: Grade 12s who need volunteer hours and want something social. Message: ‘Saturday shifts, friends welcome, hours signed on the spot.’ Form: poster in the guidance office plus one social post.”", ok:true, why:"It names who they are, what they want and where they’ll meet it." },
            { t:"“Audience: students. Message: ‘volunteering matters.’ Form: documentary.”", why:"“Students” is a crowd, and a documentary is far too big for one quick action." },
            { t:"“Audience: everyone in town. Message: food bank statistics. Form: infographic.”", why:"A text aimed at everyone lands on no one, and statistics aren’t an ask." },
            { t:"“Audience: donors. Message: ‘give money.’ Form: poster.”", why:"The wrong audience and the wrong action." }] } },
      { id:"a2", cat:"A", goal:5,
        a:{ prompt:"Seven of ten testers said your poster was “selling books”. Your purpose: a free library event on June 14. What’s the most effective revision?",
          options:[{ t:"Put “FREE” and “June 14” in the headline zone, and make the event, not the books, the image", ok:true, why:"Fix the miss where the eye starts." }, { t:"Make the logo bigger", why:"That doesn’t fix the misunderstanding." },
            { t:"Add more book images", why:"That deepens the miss." }, { t:"Change the font colour only", why:"Surface, not message." }] },
        b:{ prompt:"Most podcast testers couldn’t say what you wanted them to do. What’s the most effective revision?",
          options:[{ t:"State the action plainly in the cold open and repeat it in the sign-off", ok:true, why:"The ear needs the action twice." }, { t:"Add more music", why:"More sound can’t say the action for you." },
            { t:"Make the episode longer", why:"More length isn’t more clarity." }, { t:"Speak faster", why:"Speed hurts comprehension." }] } }
    ]
  },
  task:{
    title:"Performance task: Make it", summary:"Make it",
    statement:"<p>Make an original media text for a real or realistic audience. Start with your brief, choose a form, build it with its conventions, test it if you can, revise, and explain your choices. Every form can pass; there are countless good texts.</p><p class='tiny muted'>Your brief and builder are the same ones as in the Media studio: changes here show there too. This checklist checks structure only; your teacher assesses the craft. Your full text, revision notes and producer’s statement go to your teacher in the results summary.</p>" + RUB,
    checks:["Brief complete", "Form built to its conventions", "Key message appears at least twice", "Assets credited", "Two revisions with reasons", "Producer’s statement"],
    tips:["Go back to your brief: who, what they believe, where they meet you, your message and the action.", "Check your form’s conventions in the side panel. One is missing.", "Say it twice: once to hook, once to land.", "Credit and licence every asset you didn’t make.", "What did you change, and what made you change it?", "Name your audience, two conventions, and what each does for them."],
    explainPrompt:"Producer’s statement (120–250 words): Who is your audience, and how do you know them? Name two conventions you used and what each does for that audience. What did your testers teach you, and what did you change?",
    explainLabel:"Producer’s statement",
    vocab:"Use audience, purpose, convention and revision.",
    checkLabel:"Check my media text",
    success:"Your media text has every part.",
    more:"Every form can pass. Try another form if you like: each complete one joins your list.",
    afterAt:5,
    conv:{
      poster:{ name:"Poster", list:["headline", "visual hierarchy", "hierarchy", "reading path", "z-pattern", "z-path", "call to action", "image", "visual", "contrast", "body text", "logo", "credit line", "layout", "white space"],
        need:"Headline of 8 words or fewer · a call-to-action element · a visual · body of 25 words or fewer · a credit line (logo/credit element)" },
      podcast:{ name:"Podcast script", list:["cold open", "signpost", "signposts", "theme music", "music cue", "host introduction", "segment", "segments", "transition", "sign-off", "repetition", "sound effect"],
        need:"A cold-open block · 3 or more segment blocks · a sign-off · 300–600 words in all (2–4 min at 150 wpm)" },
      psa:{ name:"PSA storyboard", list:["shot", "close-up", "extreme close-up", "long shot", "establishing shot", "medium shot", "angle", "low angle", "high angle", "pan", "zoom", "duration", "voice-over", "on-screen text", "sound effect", "call to action", "montage"],
        need:"6–10 panels · durations totalling 30 or 60 s · 3 or more shot types · a call to action (on-screen text or dialogue) in the final panel" },
      social:{ name:"Social campaign", list:["caption", "captions", "alt text", "hashtag", "hashtags", "teaser", "follow-up", "posting time", "sequence", "image", "call to action"],
        need:"3 posts (teaser, main, follow-up) · each caption 280 characters or fewer · each with alt text of 10 or more words · the same campaign hashtag on all 3" }
    },
    sources:[{ id:"mine", t:"Mine" }, { id:"pd", t:"Public domain" }, { id:"lic", t:"Licensed" }],
    kinds:[{ id:"image", t:"Image" }, { id:"sound", t:"Sound" }, { id:"music", t:"Music" }, { id:"other", t:"Other" }],
    licences:[{ id:"pdm", t:"Public domain" }, { id:"cc0", t:"CC0" }, { id:"ccby", t:"CC BY" }, { id:"ccbysa", t:"CC BY-SA" }, { id:"ccbync", t:"CC BY-NC" }, { id:"other", t:"Other licence (named in the credit)" }],
    labels:{ brief:"1. Your brief and form", build:"2. Your builder", assets:"3. Asset list", assetsHow:"List every image, sound or piece of music you used that you didn’t draw or write in the builder. Mark each one. Anything public domain or licensed needs a licence and a credit line; your own work needs neither. The built-in icons need no entry.", addAsset:"Add an asset", revs:"4. Revision notes", revsHow:"Your two revisions from Part 3 (Test). Each note: what you changed, and the tester’s words (or your own re-viewing) that made you change it, in 15 words or more.", toTest:"Open Part 3 (Test)", glance:"Your media text at a glance" },
    modelsLabel:"Three model responses (different forms and approaches)",
    models:[
      "<h5>1. Poster: “Read the North” summer challenge <small>(fictional Maple Hollow Public Library)</small></h5><p><strong>Brief:</strong> Grades 9–11, who used to love reading but stopped because of homework; they walk past posters in the hallways. Purpose: persuade. Key message: “Read anything this summer and win” (6 words). Action: “Sign up at the library desk by June 30.”</p><ul><li>cell 2: headline “Read anything. Win something.” (L, high contrast);</li><li>cells 4–5–6: an icon row of a comic book, a novel, a phone and a cookbook (L);</li><li>cell 5 overlaid with the body: “Comics count. Audiobooks count. Recipes count.” (S);</li><li>cell 8: call to action “Sign up at the desk by June 30” (M);</li><li>cell 9: library logo and a credit line (“icons: course built-in set”).</li></ul><p><strong>Key message tags:</strong> headline; body.</p><p><strong>Revision notes:</strong> “Testers thought only novels counted, so I added ‘Comics count’ and the icon row.” / “Two testers missed the deadline, so I moved ‘by June 30’ into the call to action.”</p>",
      "<h5>2. Podcast script: “Pause, Check, Share” <small>(a 3-minute episode; 330 words in the full script)</small></h5><p>An excerpt shows the conventions:</p><blockquote class='cm-model-pod'><p><strong>[Cold open]</strong> A voice, urgent: “Breaking: school cancelled tomorrow, the whole board!” Pause. “It wasn’t true.”</p><p><strong>[Theme music, 5 s]</strong></p><p><strong>[Host]</strong> “Welcome to <i>Signal Check</i>. I’m Priyam. Today: the ten seconds between seeing and sharing. Here’s the thing. Most of us share before we check. So let’s try three moves.”</p><p><strong>[Segment 1: Pause]</strong> “First, pause. If a post makes you furious or thrilled, that’s your cue. Strong feelings travel faster than facts.”</p><p><strong>[Segment 2: Check]</strong> “Next, check. Open a new tab. Search the claim. Who else is reporting it?”</p><p><strong>[Segment 3: Share, or don’t]</strong> “Now decide. If you can’t find a second source, don’t pass it on. Remember: pause, check, then share.”</p><p><strong>[Sign-off]</strong> “That’s <i>Signal Check</i>. Pause, check, then share. See you next week.”</p></blockquote><p><strong>Key message tags:</strong> segment 3; sign-off.</p><p><strong>Revision notes:</strong> “Testers forgot the third step, so I made the three moves the segment titles and repeated them in the sign-off.” / “One tester was lost in segment 2, so I split a 38-word sentence into four short ones.”</p>",
      "<h5>3. PSA storyboard: “Before You Share” <small>(30 s, links to module 22)</small></h5><div class='tbl-wrap'><table class='topic-tbl'><thead><tr><th scope='col'>Panel</th><th scope='col'>Shot / angle / movement</th><th scope='col'>Duration</th><th scope='col'>Visual</th><th scope='col'>Audio and text</th></tr></thead><tbody>" +
        "<tr><td>1</td><td>Long, eye level, static</td><td>5 s</td><td>Teen on a bus, scrolling</td><td>Bus hum</td></tr><tr><td>2</td><td>Medium, eye level, slow zoom</td><td>5 s</td><td>A notification: “SHOCKING: cafeteria closing!!”</td><td>A notification ping</td></tr>" +
        "<tr><td>3</td><td>Close-up, high angle</td><td>4 s</td><td>Her face: surprise</td><td>Music sting</td></tr><tr><td>4</td><td>Extreme close-up, static</td><td>6 s</td><td>Thumb hovering over “Share”</td><td>Heartbeat sound; on-screen: “Is it true?”</td></tr>" +
        "<tr><td>5</td><td>Medium, eye level, pan</td><td>5 s</td><td>She opens a new tab; a search shows “false”</td><td>Keyboard taps</td></tr><tr><td>6</td><td>Long, low angle, static</td><td>5 s</td><td>She pockets the phone and smiles</td><td>Voice-over and on-screen text: “Pause. Check. Then share.”</td></tr></tbody></table></div>" +
        "<p><strong>Total:</strong> 30 s; 4 shot types; no consecutive repeats; extreme close-up at the turn; the message in the final panel.</p><p><strong>Key message tags:</strong> panels 4 and 6.</p><p><strong>Revision notes:</strong> “Testers felt panel 5 was too fast, so I gave it 5 s and took 1 s from panel 3.” / “One tester didn’t see the search result, so I added the word ‘false’ on screen.”</p>"
    ]
  },
  cards:[
    ["Medium", "Whatever stands in the middle between maker and audience (Latin <em>medius</em>). Plural: media."],
    ["Brief", "Audience, purpose, key message (12 words or fewer) and desired action, written before you make anything."],
    ["Specific audience", "Who they are, what they believe, where they’ll meet your text. “Grade 9s who want friends but fear clubs.”"],
    ["Form fits brief", "Choose the form by where and how the audience meets it: a driver hears, a hallway glances, a feed scrolls."],
    ["Visual hierarchy", "Size, contrast and position make the eye see things in your intended order."],
    ["Reading path (Z)", "Top-left → top-right → centre → bottom. Headline first, call to action last."],
    ["Shot size", "Long and establishing shots show <em>where</em>; close-ups and extreme close-ups show <em>feeling</em>."],
    ["Storyboard", "A plan of panels: shot, angle, movement, duration, visual, audio, text. Stick figures are fine."],
    ["Writing for the ear", "Short sentences, signposts, repetition; describe what can’t be seen. “Here’s the thing.”"],
    ["Alt text", "Words for an image, for screen readers. Part of serving your whole audience."],
    ["Credit vs permission", "Credit names the source; permission (ownership, public domain or a licence) lets you use it."],
    ["Message match", "Ask “What does it want you to do?” and compare answers with your key message. Revise with evidence."]
  ]
};
