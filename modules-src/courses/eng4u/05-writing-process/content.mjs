// ENG4U 05 The Writing Process. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/05-writing-process.md
// Katherine Mansfield, "Miss Brill" (1920), text of The Garden Party and Other Stories (1922), Project Gutenberg ebook #1429:
// 18 paragraphs, numbered as displayed. Pope, An Essay on Criticism (1711), lines 362–363 (Project Gutenberg #7409).
// The model writer's freewrite, cluster, theses and drafts, every student paragraph, and the model responses are original to the course.

// Misconception core sentences (plan §3), used where the plan tags an option with M1–M7 but gives no feedback text.
const M1 = "Writers loop. A draft is a way of finding out what you think, not the last word on it.";
const M3 = "Polishing a sentence in a paragraph you later cut is wasted effort. Fix the big things first.";
const M4 = "A topic names a subject. A thesis makes a claim someone could disagree with, and says how the text shows it.";
const M6 = "A quotation can’t speak for itself. Introduce it, then explain what its words are doing.";
const M7 = "The model writer’s first draft was a mess, and that’s normal. Messy drafts are where good writing starts.";

// "Miss Brill", one string per paragraph (curly quotes and dashes as in the edition).
const STORY = [
  "Although it was so brilliantly fine—the blue sky powdered with gold and great spots of light like white wine splashed over the Jardins Publiques—Miss Brill was glad that she had decided on her fur. The air was motionless, but when you opened your mouth there was just a faint chill, like a chill from a glass of iced water before you sip, and now and again a leaf came drifting—from nowhere, from the sky. Miss Brill put up her hand and touched her fur. Dear little thing! It was nice to feel it again. She had taken it out of its box that afternoon, shaken out the moth-powder, given it a good brush, and rubbed the life back into the dim little eyes. “What has been happening to me?” said the sad little eyes. Oh, how sweet it was to see them snap at her again from the red eiderdown!... But the nose, which was of some black composition, wasn’t at all firm. It must have had a knock, somehow. Never mind—a little dab of black sealing-wax when the time came—when it was absolutely necessary.... Little rogue! Yes, she really felt like that about it. Little rogue biting its tail just by her left ear. She could have taken it off and laid it on her lap and stroked it. She felt a tingling in her hands and arms, but that came from walking, she supposed. And when she breathed, something light and sad—no, not sad, exactly—something gentle seemed to move in her bosom.",
  "There were a number of people out this afternoon, far more than last Sunday. And the band sounded louder and gayer. That was because the Season had begun. For although the band played all the year round on Sundays, out of season it was never the same. It was like some one playing with only the family to listen; it didn’t care how it played if there weren’t any strangers present. Wasn’t the conductor wearing a new coat, too? She was sure it was new. He scraped with his foot and flapped his arms like a rooster about to crow, and the bandsmen sitting in the green rotunda blew out their cheeks and glared at the music. Now there came a little “flutey” bit—very pretty!—a little chain of bright drops. She was sure it would be repeated. It was; she lifted her head and smiled.",
  "Only two people shared her “special” seat: a fine old man in a velvet coat, his hands clasped over a huge carved walking-stick, and a big old woman, sitting upright, with a roll of knitting on her embroidered apron. They did not speak. This was disappointing, for Miss Brill always looked forward to the conversation. She had become really quite expert, she thought, at listening as though she didn’t listen, at sitting in other people’s lives just for a minute while they talked round her.",
  "She glanced, sideways, at the old couple. Perhaps they would go soon. Last Sunday, too, hadn’t been as interesting as usual. An Englishman and his wife, he wearing a dreadful Panama hat and she button boots. And she’d gone on the whole time about how she ought to wear spectacles; she knew she needed them; but that it was no good getting any; they’d be sure to break and they’d never keep on. And he’d been so patient. He’d suggested everything—gold rims, the kind that curved round your ears, little pads inside the bridge. No, nothing would please her. “They’ll always be sliding down my nose!” Miss Brill had wanted to shake her.",
  "The old people sat on the bench, still as statues. Never mind, there was always the crowd to watch. To and fro, in front of the flower-beds and the band rotunda, the couples and groups paraded, stopped to talk, to greet, to buy a handful of flowers from the old beggar who had his tray fixed to the railings. Little children ran among them, swooping and laughing; little boys with big white silk bows under their chins, little girls, little French dolls, dressed up in velvet and lace. And sometimes a tiny staggerer came suddenly rocking into the open from under the trees, stopped, stared, as suddenly sat down “flop,” until its small high-stepping mother, like a young hen, rushed scolding to its rescue. Other people sat on the benches and green chairs, but they were nearly always the same, Sunday after Sunday, and—Miss Brill had often noticed—there was something funny about nearly all of them. They were odd, silent, nearly all old, and from the way they stared they looked as though they’d just come from dark little rooms or even—even cupboards!",
  "Behind the rotunda the slender trees with yellow leaves down drooping, and through them just a line of sea, and beyond the blue sky with gold-veined clouds.",
  "Tum-tum-tum tiddle-um! tiddle-um! tum tiddley-um tum ta! blew the band.",
  "Two young girls in red came by and two young soldiers in blue met them, and they laughed and paired and went off arm-in-arm. Two peasant women with funny straw hats passed, gravely, leading beautiful smoke-coloured donkeys. A cold, pale nun hurried by. A beautiful woman came along and dropped her bunch of violets, and a little boy ran after to hand them to her, and she took them and threw them away as if they’d been poisoned. Dear me! Miss Brill didn’t know whether to admire that or not! And now an ermine toque and a gentleman in grey met just in front of her. He was tall, stiff, dignified, and she was wearing the ermine toque she’d bought when her hair was yellow. Now everything, her hair, her face, even her eyes, was the same colour as the shabby ermine, and her hand, in its cleaned glove, lifted to dab her lips, was a tiny yellowish paw. Oh, she was so pleased to see him—delighted! She rather thought they were going to meet that afternoon. She described where she’d been—everywhere, here, there, along by the sea. The day was so charming—didn’t he agree? And wouldn’t he, perhaps?... But he shook his head, lighted a cigarette, slowly breathed a great deep puff into her face, and even while she was still talking and laughing, flicked the match away and walked on. The ermine toque was alone; she smiled more brightly than ever. But even the band seemed to know what she was feeling and played more softly, played tenderly, and the drum beat, “The Brute! The Brute!” over and over. What would she do? What was going to happen now? But as Miss Brill wondered, the ermine toque turned, raised her hand as though she’d seen some one else, much nicer, just over there, and pattered away. And the band changed again and played more quickly, more gayly than ever, and the old couple on Miss Brill’s seat got up and marched away, and such a funny old man with long whiskers hobbled along in time to the music and was nearly knocked over by four girls walking abreast.",
  "Oh, how fascinating it was! How she enjoyed it! How she loved sitting here, watching it all! It was like a play. It was exactly like a play. Who could believe the sky at the back wasn’t painted? But it wasn’t till a little brown dog trotted on solemn and then slowly trotted off, like a little “theatre” dog, a little dog that had been drugged, that Miss Brill discovered what it was that made it so exciting. They were all on the stage. They weren’t only the audience, not only looking on; they were acting. Even she had a part and came every Sunday. No doubt somebody would have noticed if she hadn’t been there; she was part of the performance after all. How strange she’d never thought of it like that before! And yet it explained why she made such a point of starting from home at just the same time each week—so as not to be late for the performance—and it also explained why she had quite a queer, shy feeling at telling her English pupils how she spent her Sunday afternoons. No wonder! Miss Brill nearly laughed out loud. She was on the stage. She thought of the old invalid gentleman to whom she read the newspaper four afternoons a week while he slept in the garden. She had got quite used to the frail head on the cotton pillow, the hollowed eyes, the open mouth and the high pinched nose. If he’d been dead she mightn’t have noticed for weeks; she wouldn’t have minded. But suddenly he knew he was having the paper read to him by an actress! “An actress!” The old head lifted; two points of light quivered in the old eyes. “An actress—are ye?” And Miss Brill smoothed the newspaper as though it were the manuscript of her part and said gently; “Yes, I have been an actress for a long time.”",
  "The band had been having a rest. Now they started again. And what they played was warm, sunny, yet there was just a faint chill—a something, what was it?—not sadness—no, not sadness—a something that made you want to sing. The tune lifted, lifted, the light shone; and it seemed to Miss Brill that in another moment all of them, all the whole company, would begin singing. The young ones, the laughing ones who were moving together, they would begin, and the men’s voices, very resolute and brave, would join them. And then she too, she too, and the others on the benches—they would come in with a kind of accompaniment—something low, that scarcely rose or fell, something so beautiful—moving.... And Miss Brill’s eyes filled with tears and she looked smiling at all the other members of the company. Yes, we understand, we understand, she thought—though what they understood she didn’t know.",
  "Just at that moment a boy and girl came and sat down where the old couple had been. They were beautifully dressed; they were in love. The hero and heroine, of course, just arrived from his father’s yacht. And still soundlessly singing, still with that trembling smile, Miss Brill prepared to listen.",
  "“No, not now,” said the girl. “Not here, I can’t.”",
  "“But why? Because of that stupid old thing at the end there?” asked the boy. “Why does she come here at all—who wants her? Why doesn’t she keep her silly old mug at home?”",
  "“It’s her fu-fur which is so funny,” giggled the girl. “It’s exactly like a fried whiting.”",
  "“Ah, be off with you!” said the boy in an angry whisper. Then: “Tell me, ma petite chère—”",
  "“No, not here,” said the girl. “Not <em>yet</em>.”",
  "On her way home she usually bought a slice of honey-cake at the baker’s. It was her Sunday treat. Sometimes there was an almond in her slice, sometimes not. It made a great difference. If there was an almond it was like carrying home a tiny present—a surprise—something that might very well not have been there. She hurried on the almond Sundays and struck the match for the kettle in quite a dashing way.",
  "But to-day she passed the baker’s by, climbed the stairs, went into the little dark room—her room like a cupboard—and sat down on the red eiderdown. She sat there for a long time. The box that the fur came out of was on the bed. She unclasped the necklet quickly; quickly, without looking, laid it inside. But when she put the lid on she thought she heard something crying."
];

// The model writer's working thesis after looping back (Draft 1, Draft 2 and the Final all open with it).
const THESIS = "In “Miss Brill,” Mansfield uses the fur, which Miss Brill treats as a companion, and her fantasy that the park is a play to show how loneliness can disguise itself as delight.";
// Body paragraphs of the model essay (one sentence per string).
const P_PARK = ["Miss Brill is an old woman who goes to the park every Sunday afternoon to listen to the band.", "Before she leaves she takes her fur out of its box brushes it and rubs the life back into its little eyes.",
  "She sits on her special seat next to an old couple who do not speak to each other, this is disappointing because she likes listening to other people talk.", "She watches the crowd walk past the band rotunda and she notices that most of the people sitting on the benches are odd silent and old."];
const P_CROWD = ["Lots of people walk past her seat while the band plays.", "A beautiful woman throws away the violets a little boy hands her and a woman in an ermine toque is snubbed by a gentleman in grey who blows smoke in her face.",
  "The band plays more softly when this happens and Miss Brill thinks it is all very interesting.", "She enjoys watching the people more than anything else in her week."];
const P_END1 = ["At home, the fur returns to its box, and she hears “something crying.”", "On the way home from the Jardin Publiques, she passes the baker’s by, she does not buy her Sunday slice of honey-cake.",
  "She sits sad and silent on the red eiderdown and puts the fur away without looking at it.", "Closing the lid, she “thought she heard something crying.”"];
const P_END2 = ["At home, the fur returns to its box, and she hears “something crying.”", "On the way home from the Jardins Publiques, she passes the baker’s by and does not buy her Sunday slice of honey-cake.",
  "She sits forlorn and silent on the red eiderdown and puts the fur away without looking at it.", "Closing the lid, she “thought she heard something crying” (Mansfield, par. 18).",
  "Mansfield never says that Miss Brill is the one crying: the vague word “something” lets the fur grieve for her, so the loneliness she has disguised all afternoon finally finds a voice."];
const P_FUR = ["From the first paragraph, Miss Brill treats her fur as a living companion.", "Taking it out of its box, she greets it with “Dear little thing!” (Mansfield, par. 1), the kind of tenderness people usually keep for a pet or a child, and her affection for a mere object quietly suggests how few people she has left to give it to."];
const P_PLAY = ["In the park, she imagines herself an actor in a play, needed and seen.", "Watching the crowd she decides that the scene is “exactly like a play” (Mansfield, par. 9) and that even she has a part.",
  "The fantasy turns a lonely woman on a bench into a member of a company so that watching becomes belonging."];
const P_PLAY_F = ["In the park, she imagines herself an actor in a play, needed and seen.", "Watching the crowd, she decides that the scene is “exactly like a play” (Mansfield, par. 9) and that even she has a part.",
  "The fantasy turns a solitary woman on a bench into a member of a company, so that watching becomes belonging."];
const P_COUPLE = ["The young couple’s mockery breaks Miss Brill’s illusion in a single exchange.", "When the boy asks why “she come[s] here at all,” the question erases the role she believed she played.",
  "Mansfield herself was born in New Zealand and later lived in Europe.", "The girl’s joke about the fur turns her companion into an object of ridicule.", "In two lines of dialogue, the audience Miss Brill imagined becomes a crowd that doesn’t want her."];

// Sorter hints: the first is shared; the second names the two closest stages; the third is the answer with its reason.
const SH = (h2, h3) => ["Is this move about ideas, order, getting words down, the argument, or the surface?", h2, h3];
// Revise it: the first hint is shared.
const RH = (h2, h3) => ["Name the problem first: focus, evidence, analysis, order or sentence?", h2, h3];

export default {
  id:"05-writing-process",
  kind:"topic",
  title:"The writing process",
  topic:"The Writing Process",
  readyTopic:"the writing process",
  hero:{
    headline:"Ease is earned",
    text:"The sentences you admire didn’t fall onto the page finished. They were <strong>generated</strong>, <strong>focused</strong>, <strong>drafted</strong>, <strong>revised</strong> and <strong>edited</strong>, often more than once. This module walks you through that loop with one short story, Katherine Mansfield’s “Miss Brill”, and one paragraph of your own. By the end you’ll have a draft, a better draft, and a principle about revision that is yours.",
    fig:{ html:'<div class="wp-hero" id="wp-hero" role="group" aria-label="Alexander Pope’s couplet on writing, read aloud, with layered drafts behind it"></div>', caption:"" },
    couplet:["True ease in writing comes from art, not chance,", "As those move easiest who have learned to dance."],
    cite:"Alexander Pope, <i>An Essay on Criticism</i> (1711), lines 362–363",
    glow:["art,", "chance,"], glowTag:"the couplet’s argument in two words",
    caption:"Every clean page has messy ones underneath.",
    noVoice:"Read it aloud yourself; your ear is the best editor."
  },
  goals:[
    "I can describe the stages of the writing process and explain why writers loop back through them.",
    "I can generate and focus ideas using freewriting, clustering and questioning.",
    "I can turn a focused idea into a working thesis and an outline that builds.",
    "I can tell revising (focus, evidence, organization) from editing (sentences, conventions), and do them in that order.",
    "I can revise a paragraph so that every sentence serves its claim and every quotation is introduced and explained.",
    "I can reflect on my own writing habits and choose strategies that help me."
  ],
  start:{
    story:{ title:"Miss Brill", author:"Katherine Mansfield",
      cite:"Katherine Mansfield, “Miss Brill” (1920), from <i>The Garden Party and Other Stories</i> (1922). Public domain. Paragraphs are numbered 1–18 for MLA citations: (Mansfield, par. 9).",
      pars:STORY },
    blocks:[
      { title:"Word story", html:"<p><strong><em>Revise</em></strong> comes from Latin <em>revisere</em>, “to look at again” (<em>re-</em>, “again”, plus <em>visere</em>, “to look at”, from <em>videre</em>, “to see”).</p><p>To revise is literally to <strong>re-see</strong>. That is why fixing commas isn’t revising: you haven’t looked at the writing again with new eyes, only tidied its surface. The word for the whole process is in the word.</p>" },
      { title:"The writing subject: “Miss Brill”", html:"<p>Everything you write in this module is about one short story: Katherine Mansfield’s “Miss Brill” (1920). It is short and rich, and its single Sunday afternoon turns on a cruelty that rewards rereading. Read it once now, just for what happens. You’ll reread it for how it’s told.</p><p>The story opens from the <strong>Story</strong> button at the top of every part, with numbered paragraphs, so you can cite it like this: (Mansfield, par. 9).</p><div class=\"q-actions\"><button type=\"button\" class=\"btn primary sm\" data-story=\"1\">Read “Miss Brill”</button></div>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Analytical paragraphs", goal:5,
          prompt:"Which sentence is <strong>analysis</strong>, not summary?",
          options:[
            { t:"“By calling her fur a ‘little rogue’, Miss Brill treats it as a friend, which hints at how few real friends she has.”", ok:true, why:"It explains what a detail suggests and why it matters." },
            { t:"“Miss Brill takes her fur out of its box and brushes it.”", why:"This retells what happens. Analysis explains what it means." },
            { t:"“‘Miss Brill’ was written by Katherine Mansfield in 1920.”", why:"True, but it says nothing about how the story works." },
            { t:"“Miss Brill is a lonely woman who goes to the park.”", why:"This states a trait without showing how the writing reveals it." }],
          hints:["Which sentence explains <em>how</em> or <em>why</em>, not just <em>what</em>?", "Look for a sentence that connects a detail to a bigger idea.", "The sentence about the nickname “little rogue”: it reveals her loneliness."] },
        { id:"w2", skill:"Analytical paragraphs", goal:5,
          prompt:"A good analytical paragraph usually moves in which order?",
          options:[
            { t:"Claim → evidence → analysis → link back", ok:true, why:"Say it, show it, explain it, connect it." },
            { t:"Evidence → evidence → evidence → claim", why:"Three quotations with no explanation leave the reader to do your thinking." },
            { t:"Summary → opinion → quotation", why:"Summary first buries the claim." },
            { t:"Claim → claim → claim", why:"Claims need proof from the text." }],
          hints:["What does the reader need first: your point or your proof?", "The point first, then the proof, then the explanation.", "Claim → evidence → analysis → link."] },
        { id:"w3", skill:"Thesis statements", goal:3,
          prompt:"Which is a <strong>thesis</strong>, not a topic?",
          options:[
            { t:"“Mansfield uses Miss Brill’s fur to show how loneliness can disguise itself as delight.”", ok:true, why:"It makes an arguable claim and says how the text shows it." },
            { t:"“This essay is about loneliness in ‘Miss Brill’.”", why:"This names a topic; it claims nothing." },
            { t:"“Miss Brill goes to the park on Sundays.”", why:"No one could disagree; there’s nothing to argue." },
            { t:"“Loneliness is a serious problem in society.”", why:"It doesn’t mention the story at all." }],
          hints:["Could someone reasonably disagree?", "A thesis names the text, a claim and how it’s shown.", "The sentence about Mansfield using the fur to show loneliness disguised as delight."] },
        { id:"w4", skill:"Thesis statements", goal:3,
          prompt:"A working thesis is…",
          options:[
            { t:"a best current claim that may change as you draft", ok:true, why:"“Working” means it’s still being worked on." },
            { t:"a final sentence you must never change", why:"Drafting often reveals a sharper claim; change it." },
            { t:"a summary of the plot", why:"A thesis argues; a summary reports." },
            { t:"a question for the reader", why:"A question can start your thinking, but the thesis answers it." }],
          hints:["What does “working” suggest?", "It’s still in progress.", "A best current claim that may change as you draft."] },
        { id:"w5", skill:"Quotation use", goal:5,
          prompt:"Which sentence <strong>integrates</strong> a quotation best?",
          options:[
            { t:"Miss Brill imagines that the park’s visitors are actors, deciding that “It was exactly like a play” (Mansfield, par. 9).", ok:true, why:"A signal phrase introduces it, the quotation fits the sentence’s grammar, and it’s cited." },
            { t:"“It was exactly like a play.” This shows she is imaginative.", why:"This is a dropped quotation: it arrives with no introduction." },
            { t:"Miss Brill thinks it was exactly like a play.", why:"That’s borrowing words without credit." },
            { t:"In paragraph 9 there is a quote about a play.", why:"Quote the words and explain them." }],
          hints:["Is the quotation introduced?", "Does it fit the sentence and carry a citation?", "The sentence with a signal phrase and the citation (Mansfield, par. 9)."] },
        { id:"w6", skill:"Reading for detail", goal:2,
          prompt:"In “Miss Brill”, what overheard comment changes the afternoon?",
          options:[
            { t:"A young couple mocks her and her fur", ok:true, why:"Their cruelty breaks her sense of belonging." },
            { t:"The band leader thanks her for coming", why:"No one thanks her." },
            { t:"An old man asks her to dance", why:"Nothing like this happens." },
            { t:"A child asks her name", why:"The decisive voices are the couple’s." }],
          hints:["Think about the end of her afternoon.", "Two young people sit near her.", "A young couple mocks her and her fur."] }
      ],
      refreshers:{
        "Analytical paragraphs":"Claim, evidence, analysis, link. Analysis answers <em>how</em> and <em>why</em>: “The word ‘rogue’ makes the fur a mischievous friend, which tells us how little company she has.”",
        "Thesis statements":"Text + claim + how. Test: could a thoughtful reader disagree? If not, it’s a fact or a topic.",
        "Quotation use":"Introduce (signal phrase), quote (exact words in quotation marks), cite (par. or page), explain (what the words do).",
        "Reading for detail":"Before writing, reread the story once just for what happens and once for how it’s told."
      }
    }
  },
  explore:{
    heading:"The draft workspace",
    intro:"Watch a writer get from a mess to a paragraph that works, then take your own idea through the same loop.",
    modes:[{ id:"time", t:"Drafts timeline" }, { id:"mine", t:"My draft" }],
    stages:[{ id:"generate", t:"Generate" }, { id:"focus", t:"Focus" }, { id:"plan", t:"Plan" }, { id:"draft", t:"Draft" }, { id:"revise", t:"Revise" }, { id:"edit", t:"Edit" }],
    loopNote:"Looping back is what writers do.",
    aha:"The biggest improvements happen in revision, when the writer re-sees <em>what</em> they are claiming. Editing makes good writing shine; it can’t make weak thinking strong.",
    writer:"an anonymous Grade 12 writer",
    snaps:[
      { id:"fw", label:"Freewrite", meta:"5 min · 112 words", stage:"generate", kind:"freewrite",
        html:"ok Miss Brill. the fur. she talks to the fur like its a pet <s>a dog</s> a friend, dear little thing, and it has eyes, why do the eyes matter <s>because</s> maybe nobody else looks at her?? the park is like a play she says that, everybody is acting and she thinks she has a part but nobody knows <s>shes there</s> she’s there until the couple. the couple!! they call her a stupid old thing and the fur a fried fish <s>whiting</s> and she goes home, no honey cake and puts the fur in the box and hears crying is it her or the fur, its her but she can’t say it",
        note:"Ugly on purpose. Don’t stop, don’t fix." },
      { id:"cl", label:"Cluster", meta:"7 bubbles", stage:"generate", kind:"cluster",
        nodes:[{ id:"fur", t:"fur", x:20, y:44 }, { id:"park", t:"park", x:46, y:18 }, { id:"band", t:"band", x:80, y:14 }, { id:"play", t:"“play”", x:76, y:46 },
          { id:"couple", t:"couple", x:54, y:72 }, { id:"box", t:"box", x:30, y:86 }, { id:"crying", t:"crying", x:84, y:84 }],
        links:[["fur", "park"], ["park", "band"], ["park", "play"], ["play", "couple"], ["couple", "fur"], ["fur", "box"]],
        key:{ a:"fur", b:"crying", label:"the box" },
        note:"fur, box, crying: that’s where the story hurts. Focus here?" },
      { id:"th", label:"Working thesis", meta:"three tries", stage:"plan", kind:"thesis",
        v:[{ t:"Miss Brill is about a lonely woman.", note:"Topic, not claim." },
          { t:"Mansfield uses the fur, which Miss Brill treats as a companion, to show loneliness disguised as delight.", note:"A claim, and how the story shows it." },
          { t:THESIS, note:"Looped back while drafting: she’s performing, not just watching!", loop:true }] },
      { id:"d1", label:"Draft 1", meta:"five paragraphs, two mostly summary", stage:"draft", kind:"draft", thesis:THESIS,
        pars:[P_PARK, P_CROWD, P_END1, P_PLAY, P_COUPLE],
        notes:{ t:"New working thesis, written after looping back.", 0:"This is just retelling. What does it <em>mean</em>?", 1:"More plot. Do I need it?", 2:"Quotation dropped in. Explain it, and cite it." },
        commas:[[0, "leaves"], [0, "box"], [0, "brushes"], [0, "other,"], [0, "rotunda"], [0, "odd"], [0, "silent"], [1, "hands"], [1, "happens"], [2, "by,"]] },
      { id:"d2", label:"Draft 2", meta:"revised", stage:"revise", kind:"draft", thesis:THESIS,
        pars:[P_FUR, P_PLAY, P_COUPLE, P_END2],
        notes:{ 0:"Claim first, then one good quotation.", 3:"Moved to the end, so the essay builds to its strongest moment." } },
      { id:"fn", label:"Final", meta:"edited", stage:"edit", kind:"draft", thesis:THESIS,
        pars:[P_FUR, P_PLAY_F, [P_COUPLE[0], P_COUPLE[1], P_COUPLE[3], P_COUPLE[4]], P_END2],
        notes:{ 1:"Two commas and one sharper word (“lonely” → “solitary”). Polish last.", 2:"One last loop on the final read: I cut the sentence about Mansfield’s life. It didn’t serve the claim." } }
    ],
    logs:{
      "d1|d2":[
        { id:"c1", t:"Cut the plot-summary opening", answer:"rev" },
        { id:"c2", t:"Replaced the topic sentence with a claim", answer:"rev" },
        { id:"c3", t:"Added an explanation after the quotation", answer:"rev" },
        { id:"c4", t:"Moved the ending paragraph to last", answer:"rev" },
        { id:"c5", t:"Fixed a comma splice", answer:"edit" },
        { id:"c6", t:"Changed “sad” to “forlorn”", answer:"edit" },
        { id:"c7", t:"Corrected “Jardin” to “Jardins”", answer:"edit" },
        { id:"c8", t:"Added a paragraph-number citation", answer:"edit" }],
      "d2|fn":[
        { t:"Cut the sentence about Mansfield’s life", tag:"rev" },
        { t:"Added a comma after “Watching the crowd”", tag:"edit" },
        { t:"Added a comma before “so that”", tag:"edit" },
        { t:"Changed “lonely” to “solitary”", tag:"edit" }]
    },
    story:[
      { snap:"fw", cap:"Ugly on purpose." },
      { snap:"cl", cap:"The cluster grows bubble by bubble. “fur” and “crying” glow, linked by a new line: the box." },
      { snap:"th", v:1, cap:"Thesis 1 appears. A margin note slides in: “Topic, not claim.”" },
      { snap:"th", v:2, cap:"Thesis 2: a claim, and how the story shows it." },
      { snap:"d2", cmp:"d1", cap:"Draft 1 → Draft 2: summary strikes through, analysis appears, and the ending paragraph moves down to build to the end." },
      { snap:"fn", cmp:"d2", cap:"Editing comes last. It’s the polish, not the shape." }
    ],
    my:{
      tabs:[{ id:"generate", t:"Generate" }, { id:"focus", t:"Focus" }, { id:"plan", t:"Plan" }, { id:"draft", t:"Draft" }, { id:"revise", t:"Revise and edit" }],
      minutes:5,
      focusQs:["What surprised you?", "What object matters most?", "Where does the tone change?"],
      higher:["<strong>Claim:</strong> my first sentence says what the story shows, and how.", "<strong>Evidence:</strong> every quotation is exact, introduced and cited (Mansfield, par. N).",
        "<strong>Analysis:</strong> after each quotation, I explain what its words do.", "<strong>Order:</strong> my points build; the strongest comes last."],
      lower:["<strong>Word choice:</strong> I replaced vague words (very, really, things) with precise ones.", "<strong>Sentences:</strong> I cut dead words and fixed comma splices.",
        "<strong>Conventions:</strong> spelling, capitals, quotation marks and the MLA citation format.", "<strong>Read aloud:</strong> I read it aloud and fixed what my ear caught."],
      gateNote:"You can edit now if you like. Most writers find it pays to settle the argument first: polishing a sentence you later cut is wasted effort."
    },
    forge:{
      intro:"Optional help: tap one chip in each row, then build a sentence you can rewrite in your own words.",
      how:["Miss Brill’s fur", "the park imagined as a play", "the band’s changing music", "the young couple’s overheard words", "the ending’s “something crying”"],
      claim:["how loneliness can disguise itself as delight", "how imagination can be both a comfort and a trap", "how one careless remark can break an illusion", "how a person can perform belonging without having it"],
      why:["so that the reader sees what Miss Brill cannot", "so that the ending lands as grief rather than surprise", "so that her cheerfulness reads as courage"]
    },
    predIntro:"Make a prediction first. Then the timeline shows you what happened to the model writer’s drafts.",
    predictions:[
      { id:"p1",
        prompt:"Draft 1, paragraph 1 is four sentences retelling the park scene. The writer deletes all four summary sentences and replaces them with one claim and one quotation. What happens to the paragraph?",
        options:[{ t:"It gets shorter but says more", ok:true }, { t:"It gets weaker because it has less detail" }, { t:"Nothing changes; summary and analysis do the same job" }, { t:"It becomes off-topic" }],
        explain:"Your reader already knows the plot. One claim and one well-chosen quotation do more work than four sentences of retelling.",
        claims:[0, 1] },
      { id:"p2",
        prompt:"In the Draft 2 outline, the writer moves the paragraph about the ending (the fur back in its box, the sound of “something crying”) from second to last. What’s the likely effect?",
        options:[{ t:"The essay builds to its most powerful point", ok:true }, { t:"The essay becomes confusing" }, { t:"The thesis no longer fits" }, { t:"No effect; order doesn’t matter in analysis" }],
        explain:"Climactic order saves the strongest evidence for last, so the reader finishes on it.",
        from:["a", "d", "b", "c"] },
      { id:"p3",
        prompt:"Suppose the writer had spent 20 minutes fixing every comma in Draft 1 before revising. What would have happened to that work?",
        options:[{ t:"Much of it would be lost, because two of those paragraphs were later cut", ok:true }, { t:"It would have saved time later" }, { t:"It would have improved the argument" }, { t:"Nothing; commas never change" }],
        explain:"Edit last. Polishing what you’ll cut is wasted art." },
      { id:"p4",
        prompt:"While drafting paragraph 2, the writer realizes the real point is that Miss Brill is performing, not just watching. What should she do?",
        options:[{ t:"Loop back: revise the working thesis, then adjust the outline", ok:true }, { t:"Ignore it and finish the plan" }, { t:"Add the new idea as a last sentence" }, { t:"Start over from nothing" }],
        explain:"Drafting is a way of thinking. When it shows you a better claim, take it." }
    ],
    chalIntro:"Use the timeline to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right draft. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:4,
        prompt:"Sort the model writer’s 8 changes between Draft 1 and Draft 2 into <strong>Revising</strong> (higher-order) or <strong>Editing</strong> (lower-order). <button type=\"button\" class=\"btn ghost sm wp-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Cutting summary, sharpening the claim, adding analysis and reordering change what the essay argues. The rest is polish.",
        hints:["Ask: does this change what the paragraph <em>argues</em> or <em>proves</em>?", "Cutting summary, sharpening the claim, adding analysis and reordering all change the argument.", "Revising: 1, 2, 3, 4. Editing: 5, 6, 7, 8."] },
      { id:"tc2", goal:[3, 5],
        prompt:"Order the model writer’s four body-paragraph topic sentences so the essay builds to its strongest point. <button type=\"button\" class=\"btn ghost sm wp-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"The fur, the play, the couple, the box: the illusion is built, broken, then sealed away. Here chronological and climactic order coincide, so the story’s own order already builds.",
        hints:["What does the reader need to see before the cruelty can hurt?", "The illusion has to be built (the fur, the play) before it breaks (the couple).", "The fur, the play, the couple, the box."] },
      { id:"tc3", goal:5, stretch:true,
        prompt:"Draft 2’s third paragraph has one sentence the claim doesn’t support. Find it, then choose a repair. <button type=\"button\" class=\"btn ghost sm wp-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"Biography isn’t evidence for a claim about the couple. Cut it, or replace it with something that serves the claim.",
        hints:["Read the claim (sentence 1). Which sentence doesn’t help prove it?", "One sentence is about the author, not the story.", "Sentence 3. Cut it, or replace it with something about the couple."] }
    ],
    tc1:{
      wrong:{ "c6|rev":"A sharper word is a sentence-level polish, valuable but lower-order. It doesn’t change the argument.",
        "c3|edit":"Adding analysis changes what the paragraph proves. That’s revision.",
        "c8|rev":"Citations matter, but they’re a convention, fixed at the editing stage." },
      general:"Ask of each change: does it change what the paragraph argues or proves?" },
    tc2:{
      cards:[{ id:"a", t:"From the first paragraph, Miss Brill treats her fur as a living companion.", lift:1 },
        { id:"b", t:"In the park, she imagines herself an actor in a play, needed and seen.", lift:2 },
        { id:"c", t:"The young couple’s mockery breaks that illusion in a single exchange.", lift:3 },
        { id:"d", t:"At home, the fur returns to its box, and she hears “something crying.”", lift:4 }],
      answer:["a", "b", "c", "d"], setup:["d", "c", "a", "b"],
      dFirst:"Opening with the ending gives away your strongest evidence.",
      cBeforeB:"The couple can’t break an illusion the reader hasn’t seen built.",
      general:"Build the illusion before it breaks, and save the strongest moment for last." },
    tc3:{
      par:2, answer:2,
      sentFb:["Sentence 1 is the claim the others must serve.", "Sentence 2 is evidence: it quotes the boy.", "", "Sentence 4 is evidence too: the girl’s joke about the fur.", "Sentence 5 is the link back to the claim, so it belongs."],
      repairs:[
        { id:"A", t:"Cut sentence 3.", ok:true },
        { id:"B", t:"Replace it with “Their laughter comes from exactly the kind of young couple she had imagined as fellow actors.”", ok:true },
        { id:"C", t:"Move sentence 3 to the start.", fb:"Moving an off-topic sentence doesn’t make it serve the claim." },
        { id:"D", t:"Add more biography.", fb:"Biography isn’t evidence for this claim." }],
      replaceWith:"Their laughter comes from exactly the kind of young couple she had imagined as fellow actors." }
  },
  part3:{
    slug:"revision", name:"Re-seeing",
    heading:"Revision is re-seeing",
    intro:"Explore showed revision happening to someone else. Now you do it: three deliberate passes on one paragraph, watching what each pass lets the paragraph <em>do</em> for a reader.",
    re:{
      intro:"The model paragraph below is original and deliberately flawed. Revise it in three passes: focus first, then evidence and analysis, then sentences.",
      sents:[
        { t:"In “Miss Brill” by Katherine Mansfield there is a lady named Miss Brill.", answer:"summary" },
        { t:"She goes to the park every Sunday.", answer:"summary" },
        { t:"She likes to listen to the band and watch the people.", answer:"summary" },
        { t:"She has a fur that she takes out of a box.", answer:"summary" },
        { t:"“Dear little thing!”", answer:"evidence" },
        { t:"Then there is a couple who say mean things about her and her fur.", answer:"summary" },
        { t:"She goes home sad and puts the fur away.", answer:"summary" },
        { t:"This shows that Miss Brill is lonely and that is very sad.", answer:"point" },
        { t:"Loneliness is a big problem for old people today and many people feel this way.", answer:"off" },
        { t:"Mansfield shows loneliness in a really interesting way in this story that makes the reader think about loneliness.", answer:"link" }],
      claims:[
        { id:"c1", t:"Mansfield uses the fur to show loneliness disguised as delight", ok:true, fb:"A claim about how the story works, and how it shows it." },
        { id:"c2", t:"Miss Brill is a story about a woman", fb:M4 },
        { id:"c3", t:"Old people are lonely", fb:"That claim is about society, not about how the story works." }],
      fb:{ summary:"Sentence {n} retells the plot. Your reader has read the story. Tell them what it <em>means</em> and <em>how</em> the writing makes that meaning.",
        off:"Sentence 9 generalizes beyond the text. The claim is about how the story works, not about society in general.",
        offRewrite:"Sentence 9 leaves the story behind; no rewrite will put it back. Cut it.",
        evidence:"Sentence 5 is the paragraph’s only evidence. Keep it: Pass 2 will introduce and explain it.",
        noClaim:"Choose a claim first (or write one): every sentence you keep has to serve it.",
        ownClaim:"Your claim needs at least 8 words, and it should make a claim rather than announce a topic.",
        done:"Pass 1 done. Every sentence left serves one claim." },
      sig:["Miss Brill greets her fur as if it were a pet,", "Mansfield writes,", "the narrator, close to Miss Brill’s thoughts, exclaims"],
      quote:"“Dear little thing!”", quotePar:1,
      ana:[
        { t:"The affectionate exclamation shows she lavishes on an object the tenderness she has no one else to give.", ok:true, fb:"It explains what the words do and why it matters." },
        { t:"This quote is about the fur.", fb:"That names what the quotation is about. Say what its words do." },
        { t:"This is a nice quote.", fb:"Praise isn’t analysis. What do the words reveal?" }],
      fb2:{ sig:"Choose a signal phrase to introduce the quotation.", cite:"Add the citation with the builder: the quotation needs a paragraph number.",
        wrongPar:"Check the story: “Dear little thing!” is in paragraph 1.", ana:"Choose the sentence that explains what the quotation’s words do.",
        done:"Pass 2 done. The quotation is introduced, cited and explained." },
      labs:[
        { id:"L3", of:"claim", label:"Your claim", segs:[{ k:"open", opts:[{ t:"" }, { t:"In “Miss Brill,” ", why:"names the story" }] }, { t:"Mansfield uses the fur to " },
          { k:"verb", opts:[{ t:"show" }, { t:"reveal", why:"a stronger verb" }] }, { t:" loneliness disguised as delight." }] },
        { id:"L1", of:7, label:"Sentence 8", segs:[{ k:"verb", opts:[{ t:"This shows" }, { t:"This reveals", why:"a stronger verb" }] }, { t:" that Miss Brill is lonely" },
          { k:"tail", opts:[{ t:" and that is very sad." }, { t:".", why:"cut the dead words “and that is very sad”" }] }] },
        { id:"L2", of:9, label:"Sentence 10", segs:[
          { k:"verb", opts:[{ t:"Mansfield shows loneliness" }, { t:"Mansfield reveals loneliness", why:"a stronger verb" }, { t:"Mansfield disguises loneliness as delight", why:"a stronger verb that names the claim" }] },
          { k:"mid", opts:[{ t:" in a really interesting way in this story" }, { t:"", why:"cut the dead words “really interesting” and “in this story”" }] },
          { k:"end", opts:[{ t:" that makes the reader think about loneliness." }, { t:", so readers see what Miss Brill cannot admit: a fur is her only company.", why:"end on the key word" }] }] }],
      strong:{ company:"strong", lonely:"strong", delight:"strong", give:"strong", loneliness:"weak: it repeats the subject", sad:"weak: vague", way:"weak: vague" },
      deadWords:["really", "very"],
      thereIs:["there is", "there are"]
    },
    quickCheck:{
      title:"Revision is re-seeing quick check", summary:"Revision is re-seeing quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which pass should come first?",
          right:"Right. Settle what you’re claiming before you polish how you say it.", wrong:"Settle what you’re claiming before you polish how you say it.",
          choices:[{ t:"Focus", ok:true }, { t:"Sentences" }, { t:"Spelling" }, { t:"Formatting" }] },
        { id:"q2", goal:5, prompt:"A paragraph has a perfect quotation with no explanation after it. Which pass fixes this?",
          right:"Right. A quotation needs your explanation of what its words do.", wrong:"A quotation needs your explanation of what its words do.",
          choices:[{ t:"Evidence and analysis", ok:true }, { t:"Focus" }, { t:"Sentences" }, { t:"None needed" }] },
        { id:"q3", goal:5, prompt:"“Loneliness is a big problem for old people today.” Why cut it from a paragraph on “Miss Brill”?",
          right:"Right. The claim is about how the story works, not about society in general.", wrong:"The claim is about how the story works, not about society in general.",
          choices:[{ t:"It generalizes beyond the text", ok:true }, { t:"It’s too short" }, { t:"It has a spelling error" }, { t:"It uses a quotation" }] },
        { id:"q4", goal:4, prompt:"Which change is lower-order?",
          right:"Right. A sharper word is sentence-level polish.", wrong:"A sharper word is sentence-level polish.",
          choices:[{ t:"Replacing “really sad” with “forlorn”", ok:true }, { t:"Changing the claim" }, { t:"Cutting summary" }, { t:"Reordering paragraphs" }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"wp-steal\">“Although it was so brilliantly fine—the blue sky powdered with gold and great spots of light like white wine splashed over the Jardins Publiques—Miss Brill was glad that she had decided on her fur.”</p><p class=\"eng-cite\">(Mansfield, par. 1)</p><p><strong>The shape:</strong> a subordinate clause (“Although it was…”) → a dash-framed image that pauses the sentence to paint the world → the main clause, with the character’s small, telling decision.</p><p><strong>The challenge:</strong> Write one sentence about an ordinary moment in your own week with the same shape: <em>Although</em> + condition, a dash, an image, a dash, then someone’s small decision.</p><p><strong>Model imitation:</strong> “Although the bus was already twenty minutes late—the shelter glass fogged with breath and a paper cup rolling in slow circles at the curb—Daniyar was glad he had brought the book.”</p>",
      prompt:"Your imitation:" }],
    stealChecks:["Starts with “Although”", "Has two dashes (or em dashes)", "At least 25 words"]
  },
  practice:{
    activities:[
      { id:"moves", type:"sorter", title:"Where does this move belong?", summary:"Where does this move belong?", noun:"move", txt:true, goal:[1, 2, 4],
        instruction:"Tap a writer’s move, then tap the stage it belongs to. Some writers loop, but each move has a home stage.",
        how:"Tap a move, then tap its stage.",
        boxes:[{ id:"gen", label:"Generate", sub:"making ideas" }, { id:"plan", label:"Plan", sub:"shaping them" }, { id:"draft", label:"Draft", sub:"getting them down" },
          { id:"rev", label:"Revise", sub:"re-seeing them" }, { id:"edit", label:"Edit", sub:"polishing them" }],
        wrongDefault:"Ask: is this move making ideas, shaping them, getting them down, re-seeing them, or polishing them?",
        items:[
          { id:"i1", goal:2, t:"“Freewrite for five minutes about the fur without stopping.”", answer:"gen", why:"Freewriting makes ideas; nothing is judged yet.",
            hints:SH("Generate or Draft?", "Generate: nonstop writing is for finding ideas, not for writing the essay itself.") },
          { id:"i2", goal:2, t:"“List three questions the ending raises.”", answer:"gen", why:"Questions open up ideas you might focus on.",
            hints:SH("Generate or Plan?", "Generate: questions are a way of making ideas before you choose one.") },
          { id:"i3", goal:1, t:"“Write a working thesis and three topic sentences.”", answer:"plan", why:"A thesis and topic sentences give the essay its shape before you draft.",
            hints:SH("Plan or Draft?", "Plan: a working thesis and topic sentences are an outline.") },
          { id:"i4", goal:1, t:"“Decide whether to order paragraphs by time or by importance.”", answer:"plan", why:"Choosing an order before drafting is planning the essay’s shape.",
            hints:SH("Plan or Revise?", "Plan: before drafting, choosing the order is part of the outline.") },
          { id:"i5", goal:1, t:"“Write the body paragraphs quickly, leaving [quote here] gaps.”", answer:"draft", why:"Getting words down fast, gaps and all, is drafting.",
            hints:SH("Draft or Edit?", "Draft: get it down first and fill the gaps later.") },
          { id:"i6", goal:4, t:"“Cut a paragraph that only retells the plot.”", answer:"rev", why:"Cutting summary changes what the essay argues: that’s re-seeing.",
            wrong:{ edit:"Cutting a whole paragraph changes the argument. That’s revising." },
            hints:SH("Revise or Edit?", "Revise: cutting a whole paragraph changes the argument.") },
          { id:"i7", goal:4, t:"“Add a sentence explaining how a quotation proves the claim.”", answer:"rev", why:"Adding analysis changes what the paragraph proves.",
            hints:SH("Revise or Draft?", "Revise: new analysis re-sees how the evidence proves the claim.") },
          { id:"i8", goal:1, t:"“Sharpen the thesis after realizing the real point.”", answer:"rev", why:"After drafting, a sharper thesis is revision: you’ve re-seen your claim.",
            wrong:{ plan:"If it happens after drafting, sharpening the thesis is revision: you’ve re-seen your claim." },
            hints:SH("Plan or Revise?", "Revise: it happens after drafting, when you re-see your claim.") },
          { id:"i9", goal:4, t:"“Fix comma splices and check MLA citations.”", answer:"edit", why:"Punctuation and citation format are conventions, polished last.",
            hints:SH("Edit or Revise?", "Edit: comma splices and citation format are surface conventions.") },
          { id:"i10", goal:4, t:"“Read aloud to catch repeated words and typos.”", answer:"edit", why:"Reading aloud for repeats and typos is surface polish.",
            wrong:{ rev:"Reading aloud for typos is editing; reading aloud for whether the argument holds would be revising." },
            hints:SH("Edit or Revise?", "Edit: you’re listening for repeated words and typos, not for the argument.") }
        ] },
      { id:"revise", type:"custom", title:"Revise it", summary:"Revise it", star:true, goal:[3, 4, 5],
        instruction:"Each item shows part of a paragraph about “Miss Brill” (original student writing) and four revisions. Choose the one that best improves it, and say what kind of revision it is. Items 5 and 6 go beyond the Final Check.",
        how:"Choose a revision. When you find the best one, say what kind of revision it is.",
        kinds:[{ id:"hi", t:"Revising (higher-order)" }, { id:"lo", t:"Editing (lower-order)" }],
        kindFb:{ hi:"Right: it changes what the paragraph claims or proves, so it’s higher-order.", lo:"Look again: the best revision changes what the paragraph claims or proves. That makes it higher-order." },
        items:[
          { id:"r1", goal:3, label:"Topic sentence", orig:"“This paragraph is about the band.”", answer:"hi",
            options:[
              { t:"“The band’s music rises and falls with Miss Brill’s mood, as if the park were tuned to her feelings.”", ok:true, why:"It turns a topic into a claim." },
              { t:"“This paragraph is about the band and its music.”", why:"Still a topic." },
              { t:"“The band plays in the green rotunda every Sunday.”", why:"A plot fact: no one could disagree, so there’s nothing to prove." },
              { t:"“This paragraph will discuss the band.”", why:"It still announces a topic instead of making a claim." }],
            hints:RH("The problem is focus, a higher-order kind: the sentence names a subject but claims nothing.", "The sentence about the music rising and falling with her mood: it turns a topic into a claim.") },
          { id:"r2", goal:5, label:"Evidence", orig:"“‘It was exactly like a play.’ She likes the park.”", answer:"hi",
            options:[
              { t:"“Miss Brill decides that the Sunday crowd is ‘exactly like a play’ (Mansfield, par. 9), casting herself as one of the actors.”", ok:true, why:"It introduces, integrates, cites and begins to explain the quotation." },
              { t:"“‘It was exactly like a play.’ ‘They were all on the stage.’ She likes the park.”", why:"Two dropped quotations are worse than one." },
              { t:"“‘It was exactly like a play’ (Mansfield, par. 9). She likes the park.”", why:"The citation helps, but the quotation still arrives with no introduction or explanation." },
              { t:"“‘It was exactly like a play.’ She really likes the park.”", why:"An intensifier doesn’t explain the quotation." }],
            hints:RH("The problem is evidence and analysis, a higher-order kind: the quotation is dropped in.", "The sentence where Miss Brill decides the crowd is “exactly like a play” (Mansfield, par. 9): it introduces, integrates, cites and begins to explain.") },
          { id:"r3", goal:5, label:"Analysis", orig:"“The couple are mean. This is mean of them.”", answer:"hi",
            options:[
              { t:"“The couple’s casual cruelty works like a reviewer’s verdict on the ‘play’ she imagined.”", ok:true, why:"It replaces a repeated judgment with analysis that links back to the play metaphor." },
              { t:"“The couple are very, very mean.”", why:"Intensifiers aren’t analysis." },
              { t:"“The couple are cruel. This is cruel of them.”", why:"Swapping a word keeps the repetition; it still doesn’t explain anything." },
              { t:"“The couple sit down where the old couple had been.”", why:"That’s plot. It drops the judgment without adding analysis." }],
            hints:RH("The problem is analysis, a higher-order kind: the sentences judge but don’t explain.", "The sentence comparing their cruelty to a reviewer’s verdict on her “play”: it links back to the play metaphor.") },
          { id:"r4", goal:4, star:true, label:"A paragraph", orig:"“Miss Brill takes her fur out of its box. She walks to the Jardins Publiques and sits on her special seat. She listens to the band and watches the crowd. A young couple sits beside her and laughs at her fur. She goes home and puts the fur back in its box.”", note:"Grammatically perfect: five accurate plot sentences and no claim.", answer:"hi",
            options:[
              { t:"Add a claim sentence and cut three plot sentences", ok:true, why:"Correct grammar can’t rescue a paragraph with nothing to prove. The problem is higher-order." },
              { t:"Fix two commas", why:"That’s editing a paragraph that needs rebuilding." },
              { t:"Add two more plot sentences about the band", why:"More plot won’t give the paragraph something to prove." },
              { t:"Replace “walks” with “strolls” and “laughs” with “giggles”", why:"Sharper words polish sentences; the paragraph still has no claim." }],
            hints:RH("The grammar is fine, so the problem is higher-order: there is nothing to prove.", "Add a claim sentence and cut three plot sentences: correct grammar can’t rescue a paragraph with nothing to prove.") },
          { id:"r5", goal:3, star:true, label:"A conclusion", orig:"Thesis: “In ‘Miss Brill,’ Mansfield uses the fur to show how loneliness can disguise itself as delight.”<br>Conclusion: “In conclusion, in ‘Miss Brill,’ Mansfield uses the fur to show how loneliness can disguise itself as delight.”", note:"The conclusion repeats the thesis word for word.", answer:"hi",
            options:[
              { t:"Restate the claim in new words, then say what the story suggests about how loneliness hides from itself", ok:true, why:"A conclusion should widen the meaning (the “so what”), not repeat." },
              { t:"Add a new quotation in the conclusion", why:"New evidence belongs in the body." },
              { t:"Delete “In conclusion” and keep the rest", why:"Removing the label still leaves a word-for-word repeat." },
              { t:"Summarize the plot one more time so the reader remembers it", why:"Your reader has read the story. A conclusion widens the meaning; it doesn’t retell." }],
            hints:RH("The problem is focus, a higher-order kind: the conclusion adds no meaning.", "Restate the claim in new words, then widen it: what does the story suggest about how loneliness hides from itself?") },
          { id:"r6", goal:3, star:true, label:"A thesis and its body", orig:"Thesis: “Mansfield uses the fur to show that Miss Brill is lonely.”<br>Topic sentences: “In the park, Miss Brill imagines that everyone is acting in a play.” · “She believes she has a part and that she would be missed.” · “The young couple’s mockery is like a bad review that ends her performance.”", note:"The essay drifted toward the theatre metaphor; the thesis no longer fits the body.", answer:"hi",
            options:[
              { t:"Revise the thesis to match the stronger argument the draft discovered", ok:true, why:"When the draft finds a better claim, change the thesis. Don’t force the paragraphs back." },
              { t:"Delete the theatre paragraphs", why:"You’d be throwing away the draft’s best thinking." },
              { t:"Keep the thesis and add “and the theatre” to the end", why:"Tacking on words doesn’t make one argument. Rewrite the thesis around the claim the draft found." },
              { t:"Check the spelling and commas in every paragraph", why:"That’s editing. The mismatch between the thesis and the body is higher-order." }],
            hints:RH("The problem is focus, a higher-order kind: the thesis and the body argue different things.", "Revise the thesis to match the stronger argument the draft discovered.") }
        ] },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Finn", goal:[4, 5],
        instruction:"Finn made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:5, task:"An analytical paragraph on the fur.",
            steps:["Mansfield uses Miss Brill’s fur to reveal how much she depends on small comforts.", "Miss Brill takes the fur out of its box and brushes it.", "Then she goes to the park and sits on her special seat.",
              "She listens to the band and watches the people walk by.", "This shows that she depends on small comforts."],
            answer:1,
            stepFb:["Sentence 1 is a clear claim. Keep reading.", "", "Sentence 3 is more summary, but the first mistake comes earlier.", "Sentence 4 is summary too. Look earlier.", "Sentence 5 is an unsupported link, but the first mistake comes earlier."],
            fixes:[
              { t:"Replace sentence 2 with evidence and analysis: she addresses the fur as “Dear little thing!” (Mansfield, par. 1), treating an object as a companion who returns her affection.", ok:true, why:"It turns summary into evidence that proves the claim, then explains it." },
              { t:"Add more detail about the park.", why:"More plot won’t prove the claim." },
              { t:"Move sentence 1 to the end.", why:"The claim belongs first; the problem is the summary that follows it." },
              { t:"Sentence 2 is correct.", why:"It retells. Your reader needs to know what the brushing <em>means</em>." }],
            hints:["After the claim, what should come next?", "Evidence that proves the claim, not plot.", "Sentence 2. Replace it with a quotation and analysis."] },
          { id:"e2", goal:5, task:"An analytical paragraph on the play metaphor.",
            steps:["In the park, Miss Brill imagines herself part of a performance.", "Mansfield gives her a sense of belonging through this illusion.", "“It was exactly like a play.”", "This makes the later mockery more painful."],
            answer:2,
            stepFb:["Sentence 1 is the claim.", "Sentence 2 sharpens the claim.", "", "Sentence 4 follows the mistake. Look earlier."],
            fixes:[
              { t:"Introduce and cite it: She decides that the scene is “exactly like a play” (Mansfield, par. 9), and that even she has a part.", ok:true, why:"A signal phrase, an embedded quotation and a citation." },
              { t:"Delete the quotation.", why:"The evidence is good. It just needs an introduction and a citation." },
              { t:"Add another quotation right after it.", why:"Two dropped quotations are worse than one." },
              { t:"Sentence 3 is correct.", why:"A quotation standing alone with no signal phrase or citation is a dropped quotation." }],
            hints:["Does every quotation have a signal phrase and a citation?", "One sentence is only a quotation.", "Sentence 3. Introduce and cite it."] },
          { id:"e3", goal:4, task:"Finn’s revision plan, written as a paragraph.",
            steps:["My draft’s thesis says the fur represents her loneliness.", "My teacher noted that my second and third paragraphs mostly retell the plot.", "So first I will fix all my commas and check my spelling.",
              "Then I’ll see whether there’s time to change the paragraphs.", "I’ll hand it in after that."],
            answer:2,
            stepFb:["Sentence 1 states the current thesis.", "Sentence 2 is useful feedback.", "", "Sentence 4 follows from the mistake in the plan. Look earlier.", "Sentence 5 follows too. Look earlier."],
            fixes:[
              { t:"First I’ll rebuild paragraphs two and three around claims and analysis; then I’ll edit commas and spelling.", ok:true, why:"Revise the higher-order problem first, then edit." },
              { t:"First I’ll change the title.", why:"Cosmetic. The feedback was about summary." },
              { t:"First I’ll add more summary so it’s longer.", why:"That deepens the problem." },
              { t:"Sentence 3 is correct.", why:"Editing paragraphs you’ll rebuild wastes effort. Revise first." }],
            hints:["Which concern did the teacher raise: higher- or lower-order?", "Summary is a higher-order problem.", "Sentence 3. Revise the paragraphs before editing."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Look at the model writer’s freewrite and your own. What surprised you about how messy good writing starts?" },
      { id:"j2", q:"In your own words, explain the difference between revising and editing, and why the order matters." },
      { id:"j3", q:"Explain to a friend how to turn a summary sentence into an analysis sentence, using one example from “Miss Brill”." },
      { id:"j4", q:"Which stage of the loop is hardest for you? Name one strategy from this module you’ll try next time, and when." }
    ],
    blocks:[
      { title:"Commonplace book", html:"<p>Save one line from “Miss Brill” that you’d like to remember, and in one sentence say why it stays with you.</p><div id=\"cp-app\"></div>" }
    ],
    art:{
      intro:"Write one principle about revision or process that you believe, in your own words, in one sentence. Then choose a master’s example (a line from “Miss Brill” or the Pope couplet that shows the principle) and write your own imitation, a sentence of yours that obeys it.",
      placeholder:"Your principle about revision or process, in one sentence (at least 6 words)",
      examples:[
        "True ease in writing comes from art, not chance, / As those move easiest who have learned to dance. (Pope, lines 362–363)",
        "Although it was so brilliantly fine—the blue sky powdered with gold and great spots of light like white wine splashed over the Jardins Publiques—Miss Brill was glad that she had decided on her fur. (Mansfield, par. 1)",
        "It was like a play. It was exactly like a play. (Mansfield, par. 9)",
        "Sometimes there was an almond in her slice, sometimes not. It made a great difference. (Mansfield, par. 17)",
        "But when she put the lid on she thought she heard something crying. (Mansfield, par. 18)"]
    },
    artSamples:"<p class=\"tiny muted\" style=\"margin:0 0 6px\">Two sample principles (for inspiration only; write your own):</p><p class=\"an-note an-syntax\">“Write it badly first, then make it true.” <span class=\"muted\">Example: the Pope couplet, “True ease in writing comes from art, not chance.”</span></p><p class=\"an-note an-theme\">“Every sentence in a paragraph should earn its place by proving the claim.”</p>",
    artMin:6, artMinMsg:"Your principle needs at least 6 words.",
    commonplaceLines:[
      "Dear little thing! (Mansfield, par. 1)",
      "She had become really quite expert, she thought, at listening as though she didn’t listen, at sitting in other people’s lives just for a minute while they talked round her. (Mansfield, par. 3)",
      "It was exactly like a play. (Mansfield, par. 9)",
      "Even she had a part and came every Sunday. (Mansfield, par. 9)",
      "Yes, we understand, we understand, she thought—though what they understood she didn’t know. (Mansfield, par. 10)",
      "If there was an almond it was like carrying home a tiny present—a surprise—something that might very well not have been there. (Mansfield, par. 17)",
      "But when she put the lid on she thought she heard something crying. (Mansfield, par. 18)"]
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:1,
        a:{ prompt:"Which activity belongs to <strong>revising</strong> rather than editing?", options:[
          { t:"Moving a paragraph so the argument builds to its strongest point", ok:true, why:"Reordering changes the argument." },
          { t:"Fixing a comma splice", why:"That’s editing." },
          { t:"Correcting the spelling of a character’s name", why:"Editing." },
          { t:"Formatting the title in italics or quotation marks", why:"A convention, fixed in editing." }] },
        b:{ prompt:"Which activity belongs to <strong>generating</strong> ideas?", options:[
          { t:"Freewriting for five minutes without stopping to judge", ok:true, why:"Freewriting makes ideas; judging comes later." },
          { t:"Checking MLA citations", why:"That’s editing." },
          { t:"Rewriting the thesis to match the draft", why:"That’s revising." },
          { t:"Reading aloud to catch typos", why:"That’s editing." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"Which is a <strong>higher-order</strong> concern?", options:[
          { t:"Whether the evidence actually proves the thesis", ok:true, why:"Evidence and argument are higher-order." },
          { t:"Whether commas are placed correctly", why:"Lower-order." },
          { t:"Whether a word is spelled correctly", why:"Lower-order." },
          { t:"Whether the font is consistent", why:"Presentation, lower-order." }] },
        b:{ prompt:"Which is a <strong>lower-order</strong> concern?", options:[
          { t:"Replacing a vague word with a precise one", ok:true, why:"Word choice is sentence-level polish." },
          { t:"Whether the paragraphs are in the best order", why:"Organization is higher-order." },
          { t:"Whether the thesis is arguable", why:"Higher-order." },
          { t:"Whether each quotation is explained", why:"Analysis is higher-order." }] } },
      { id:"k3", cat:"K", goal:2,
        a:{ prompt:"What is the main purpose of freewriting?", options:[
          { t:"To generate ideas quickly without stopping to judge or correct them", ok:true, why:"Freewriting makes ideas; judging and correcting come later." },
          { t:"To produce a polished first paragraph", why:"Polish comes much later." },
          { t:"To check grammar", why:"Freewriting deliberately ignores grammar." },
          { t:"To find quotations", why:"That’s gathering evidence." }] },
        b:{ prompt:"What does a cluster (bubble map) help a writer do?", options:[
          { t:"See connections between ideas that might become a focus", ok:true, why:"Links between bubbles can become a focus." },
          { t:"Fix sentence fragments", why:"That’s editing." },
          { t:"Format a Works Cited list", why:"That’s a convention." },
          { t:"Count words", why:"A word count does that." }] } },
      { id:"t1", cat:"T", goal:3,
        a:{ prompt:"Which working thesis about “Miss Brill” is both focused and arguable?", options:[
          { t:"“Mansfield uses Miss Brill’s fur, which she treats as a companion, to show how loneliness can disguise itself as delight.”", ok:true, why:"Focused on the fur, arguable, and it says how the story shows its claim." },
          { t:"“This essay will discuss loneliness in ‘Miss Brill’.”", why:"A topic, not a claim." },
          { t:"“Miss Brill visits the Jardins Publiques on Sundays.”", why:"A plot fact; no one could disagree." },
          { t:"“Loneliness affects many people in our society.”", why:"Too broad; it leaves the story behind." }] },
        b:{ prompt:"Which working thesis about “Miss Brill” is both focused and arguable?", options:[
          { t:"“By imagining the park as a play in which she has a part, Miss Brill builds a belonging that the young couple’s mockery exposes as an illusion.”", ok:true, why:"Focused on the play, arguable, and it says how the story shows its claim." },
          { t:"“This essay is about the park scene in ‘Miss Brill’.”", why:M4 },
          { t:"“A young couple sit on Miss Brill’s bench.”", why:"A plot fact." },
          { t:"“Everyone wants to belong somewhere.”", why:"Too broad; off the text." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"<p>(1) The band’s music mirrors Miss Brill’s changing mood. (2) When she feels part of the scene, the band plays “louder and gayer.” (3) Mansfield was a modernist writer interested in inner life. (4) The music becomes a measure of how connected she feels.</p>Which sentence should be cut?", options:[
          { t:"Sentence 3", ok:true, why:"It’s about the author, not evidence for the claim." },
          { t:"Sentence 1", why:"That’s the claim." },
          { t:"Sentence 2", why:"That’s the evidence (cite it, but keep it)." },
          { t:"Sentence 4", why:"That’s the link back." }] },
        b:{ prompt:"<p>(1) The fur is Miss Brill’s closest companion. (2) She calls it a “little rogue,” as if it had a personality. (3) Furs were fashionable in the 1920s. (4) An object stands in for the friendship she lacks.</p>Which sentence should be cut?", options:[
          { t:"Sentence 3", ok:true, why:"Fashion history doesn’t prove the claim." },
          { t:"Sentence 1", why:"The claim." },
          { t:"Sentence 2", why:"Evidence." },
          { t:"Sentence 4", why:"Analysis and link." }] } },
      { id:"t3", cat:"T", goal:5,
        a:{ prompt:"<p>A paragraph on Shelley’s “Ozymandias” (studied in module 04):</p><p>(1) Shelley shows that power does not last. (2) “Look on my works, ye Mighty, and despair!” (3) The statue is broken in the desert. (4) Power does not last forever.</p>What is the most important revision?", options:[
          { t:"Introduce and explain the quotation, showing how the boast becomes ironic beside the ruin", ok:true, why:M6 },
          { t:"Fix the punctuation in sentence 2", why:"The quotation’s punctuation is correct; the problem is that it’s dropped." },
          { t:"Add a sentence about Shelley’s life", why:"Biography doesn’t help this claim." },
          { t:"Make sentence 4 longer", why:"Sentence 4 only repeats sentence 1. It needs analysis, not length." }] },
        b:{ prompt:"<p>A paragraph on the Pope couplet:</p><p>(1) Pope argues that good writing takes practice. (2) “As those move easiest who have learned to dance.” (3) Dancing is an art. (4) So writing takes practice.</p>What is the most important revision?", options:[
          { t:"Introduce the line and explain how the dance comparison makes ease the product of training", ok:true, why:M6 },
          { t:"Fix the spelling", why:"Nothing is misspelled." },
          { t:"Add a second quotation", why:"Two dropped quotations compound the problem." },
          { t:"Delete sentence 1", why:"That’s the claim." }] } },
      { id:"c1", cat:"C", goal:4,
        a:{ prompt:"A classmate’s paragraph claims the fur shows loneliness, but its sentences mostly retell the plot. Which feedback is most helpful?", options:[
          { t:"“Your claim is strong, but sentences 2–4 retell the plot. Replace one with a quotation about the fur, and explain what it reveals.”", ok:true, why:"It names the higher-order problem and gives a direction." },
          { t:"“Good job! I liked it.”", why:"Kind, but gives no direction." },
          { t:"“Fix your grammar.”", why:"Grammar isn’t the problem described." },
          { t:"“Make it longer.”", why:"Length won’t fix summary." }] },
        b:{ prompt:"A classmate’s essay has perfect grammar, but the thesis doesn’t match what the body paragraphs argue. Which feedback is most helpful?", options:[
          { t:"“Your paragraphs argue that Miss Brill performs a role. Revise the thesis to match that stronger idea.”", ok:true, why:"It names the mismatch and points to the draft’s best thinking." },
          { t:"“Check your commas once more.”", why:M3 },
          { t:"“Add more quotations.”", why:"More evidence for a mismatched thesis won’t help." },
          { t:"“Start over.”", why:"The draft’s best thinking is worth keeping." }] } },
      { id:"c2", cat:"C", goal:3,
        a:{ prompt:"Which outline order best builds an essay on how Mansfield structures Miss Brill’s afternoon?", options:[
          { t:"The fur as companion → the park as a play → the couple’s mockery → the fur back in its box", ok:true, why:"The illusion is built, broken, then sealed away." },
          { t:"The couple’s mockery → the fur → the play → the box", why:"Opening with the break gives away the climax." },
          { t:"The box → the play → the fur → the couple", why:"Scrambled. The reader can’t follow the build." },
          { t:"The fur → the box → the couple → the play", why:"Ends on a minor point." }] },
        b:{ prompt:"Which outline order best builds an essay arguing that Miss Brill’s imagination is both her comfort and her trap?", options:[
          { t:"Imagination as comfort (fur, band) → imagination as belonging (the play) → imagination exposed (the couple) → imagination as retreat (the box)", ok:true, why:"Comfort, belonging, exposure, retreat: the trap is set, then sprung." },
          { t:"Exposed → comfort → retreat → belonging", why:"The trap is sprung before it’s set." },
          { t:"Retreat → exposed → belonging → comfort", why:"Backwards." },
          { t:"Comfort → retreat → comfort → exposed", why:"Repeats a point; no build." }] } },
      { id:"a1", cat:"A", goal:1,
        a:{ prompt:"You have two days to write a 500-word personal essay for a scholarship. Which plan best uses the writing process?", options:[
          { t:"Day 1: freewrite, choose a focus, outline, draft. Day 2: revise for focus and examples, then edit and read aloud.", ok:true, why:"Every stage gets time, and revising comes before editing." },
          { t:"Day 1: write the final version. Day 2: check spelling.", why:M1 },
          { t:"Day 1: nothing. Day 2: write and submit.", why:"No time to revise." },
          { t:"Day 1: edit a draft you haven’t written. Day 2: draft.", why:M3 }] },
        b:{ prompt:"You have 75 minutes for an in-class literary essay. Which plan is best?", options:[
          { t:"About 10 minutes to plan (thesis and outline), 50 to draft, 15 to revise the key paragraphs and then edit", ok:true, why:"A short plan, a full draft, and time to revise before editing." },
          { t:"75 minutes drafting with no plan", why:"No plan and no revision." },
          { t:"40 minutes planning, 35 drafting", why:"Too little time left to finish or revise." },
          { t:"60 minutes drafting, 15 fixing commas", why:"No revision of the argument." }] } },
      { id:"a2", cat:"A", goal:6,
        a:{ prompt:"A writer notices that her paragraphs keep drifting into plot summary. Which strategy targets that habit?", options:[
          { t:"Before each paragraph, write its claim in one sentence; after drafting, check every sentence against it", ok:true, why:"It catches summary at the level where it happens: the paragraph’s claim." },
          { t:"Run a spell-check twice", why:"Spelling isn’t the problem." },
          { t:"Use longer words", why:"Vocabulary won’t stop summary." },
          { t:"Add more quotations", why:"Without analysis, more quotations make it worse." }] },
        b:{ prompt:"Another writer’s drafts are full of wordy sentences (“In my opinion, I personally think that…”). Which strategy targets that habit?", options:[
          { t:"In a final pass, read aloud and cut any word that doesn’t change the meaning", ok:true, why:"Wordiness is a sentence-level habit, so a sentence-level pass fixes it." },
          { t:"Write a longer conclusion", why:"That adds words." },
          { t:"Change the thesis", why:"The argument isn’t the issue." },
          { t:"Add a second body paragraph", why:"That doesn’t touch sentence-level wordiness." }] } }
    ]
  },
  task:{
    title:"From freewrite to focused paragraph", summary:"From freewrite to focused paragraph",
    statement:"<p>Take your own idea about “Miss Brill” through the whole loop: generate, focus, draft, revise. You’ll hand in a revised paragraph, your change log and a short craft statement. The checklist makes sure the parts are there; your teacher reads the writing.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing. Everything you write here stays on this device.</p><details class=\"alg wp-rubric\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Category</th><th scope=\"col\">Level 1</th><th scope=\"col\">Level 2</th><th scope=\"col\">Level 3</th><th scope=\"col\">Level 4</th></tr></thead><tbody><tr><th scope=\"row\">Knowledge (process and conventions)</th><td>Few stages evident; citation errors throughout</td><td>Some stages; citations inconsistent</td><td>Clear progression through the stages; citations mostly correct</td><td>A purposeful, looping process; citations precise</td></tr><tr><th scope=\"row\">Thinking (focus and analysis)</th><td>Mostly summary; claim unclear</td><td>A claim present; analysis thin</td><td>A clear claim; evidence explained</td><td>An insightful claim; analysis illuminates <em>how</em> the writing works</td></tr><tr><th scope=\"row\">Communication (organization and style)</th><td>Disorganized; wordy</td><td>Some order; uneven sentences</td><td>Logical order; clear, concise sentences</td><td>Builds deliberately; precise, vivid style</td></tr><tr><th scope=\"row\">Application (revision)</th><td>Changes are cosmetic only</td><td>Some higher-order change</td><td>Meaningful higher-order revision, explained</td><td>Revision transforms the paragraph; the craft statement shows real insight into the writer’s own process</td></tr></tbody></table></div></details>",
    checks:["You freewrote", "Your working thesis names the text and the author", "Your thesis is a full claim", "Your revised paragraph is the right length",
      "Your revised paragraph quotes and cites the story", "You revised, not just edited", "You explained your choices"],
    tips:["Set the timer and keep your pen moving. Ugly is fine.",
      "Name the story and its author in your thesis: …in Mansfield’s “Miss Brill”…",
      "Turn the topic into a claim: what does the story <em>show</em>, and <em>how</em>?",
      "Aim for one full analytical paragraph, 120–200 words: claim, evidence, analysis, link.",
      "Quote the story’s exact words in quotation marks, then cite the paragraph number in parentheses: (Mansfield, par. 9).",
      "Revision means re-seeing. Change what a sentence argues, not only how it’s punctuated, and tag that change “Revising”.",
      "Tell your reader what you changed and why. What did you notice on the second look?"],
    citeClose:"Close! MLA writes (Mansfield, par. 9), with a comma and a period after “par”.",
    explainPrompt:"Craft statement: What did you change between Draft 1 and Draft 2, and why? What did you <em>re-see</em>?",
    explainLabel:"Craft statement",
    vocab:"Use the words claim, evidence, analysis, revise and edit.",
    checkLabel:"Check my paragraph",
    success:"Every part is here. There’s more than one good paragraph to write about this story. Want to try a different focus?",
    more:"There’s more than one good paragraph to write about this story. Want to try a different focus?",
    models:[
      { title:"Model response 1: the fur as companion",
        thesis:"In Mansfield’s “Miss Brill,” the fur that Miss Brill treats as a living friend reveals how loneliness can disguise itself as delight.",
        text:"From the opening paragraph, Miss Brill treats her fur less like clothing than like company. She brushes it, worries over its “dim little eyes,” and greets it with “Dear little thing!” (Mansfield, par. 1), the kind of tenderness people usually reserve for a pet or a child. Mansfield lets the narration slip so close to Miss Brill’s thoughts that we share her pleasure before we notice its cost: she lavishes affection on an object because there is no one else to receive it. The fur’s “eyes” even seem to answer her, which makes her later humiliation sharper. When the young couple mock the fur, they are not only insulting an old piece of clothing; they are laughing at the only companion she has. The fur, in other words, is where her loneliness hides in plain sight.",
        log:"cut two plot sentences (Revising); added an analysis of the narration (Revising); replaced “sad” with “humiliation” (Editing); fixed the citation format (Editing).",
        craft:"My first draft retold the opening scene. On the second look I asked what the brushing <em>meant</em>, and realized that the fur’s “eyes” make it a companion. I cut the summary, kept one quotation, and added a sentence about how close the narration is to her thoughts. I fixed the citation last." },
      { title:"Model response 2: the park as a play",
        thesis:"Mansfield’s “Miss Brill” builds its heroine’s sense of belonging through her fantasy that the park is a play, so that the couple’s mockery reads as a brutal review.",
        text:"Miss Brill’s Sunday afternoon is a performance she has quietly scripted for herself. Watching the crowd, she decides that the scene is “exactly like a play” (Mansfield, par. 9) and, more daringly, that she too has a part. The metaphor gives a solitary woman a role, an audience and a company of fellow actors; it turns watching into belonging. Mansfield makes the fantasy convincing by letting its excitement swell in short exclamations, so the reader is swept up with her. That is why the young couple’s remarks land so hard: they are the first voices in the story to speak from outside her script, and they review her performance with contempt. The fantasy that held her up is the same fantasy that leaves her exposed.",
        log:"changed the thesis from “Miss Brill likes the park” to the play claim (Revising); moved the couple to the end of the paragraph (Revising); added the exclamations point (Revising); tightened two sentences (Editing).",
        craft:"My draft changed when I stopped asking what happens and started asking what she <em>imagines</em>. The play metaphor connected everything, so I rewrote my thesis around it. Moving the couple to the end let the paragraph build to the break." },
      { title:"Model response 3: the ending’s sound",
        thesis:"Mansfield ends “Miss Brill” with a sound rather than a statement, letting the “something crying” in the box carry a grief Miss Brill cannot name.",
        text:"The last sentence of “Miss Brill” refuses to tell us how its heroine feels. Instead, as she puts the fur away, “she thought she heard something crying” (Mansfield, par. 18). The vague word “something” is a small masterpiece of restraint and tact. Miss Brill cannot admit that she is the one crying, so the grief is displaced onto the fur, the companion she has just shut in the dark. The verb “thought” keeps even the sound uncertain, as if she can no longer trust her own perceptions after the afternoon’s humiliation. By ending on what she hears rather than what she knows, Mansfield lets the reader complete the recognition that Miss Brill cannot bear. The silence that surrounds that single, uncertain sound is where the story’s deepest sorrow lives.",
        log:"replaced a summary of her walk home with an analysis of the last sentence (Revising); added a sentence on the verb “thought” (Revising); cut “very sad” (Editing).",
        craft:"I began by summarizing the ending. Reading it aloud, I noticed how odd “something” is: why not “she”? That question became my analysis. I cut the walk-home summary and spent my words on the last sentence." }
    ]
  },
  cards:[
    ["Writing process", "A loop: generate → focus → plan → draft → revise → edit, looping back when a draft reveals a better idea."],
    ["Freewriting", "Writing nonstop for a set time without judging, to discover ideas. Example: five minutes on “the fur”."],
    ["Clustering", "A bubble map linking ideas so that connections (fur ↔ box ↔ crying) become a focus."],
    ["Working thesis", "Your best current claim, which can change as the draft teaches you."],
    ["Revise (word story)", "Latin <em>revisere</em>, “to look at again”. Re-seeing the argument, evidence and order."],
    ["Edit", "Polishing sentences and conventions: word choice, punctuation, spelling, citations. Done last."],
    ["Higher-order concerns", "Focus, thesis, evidence, analysis, organization. Fix these first."],
    ["Lower-order concerns", "Sentences, word choice, grammar, spelling, formatting. Fix these last."],
    ["Analytical paragraph", "Claim → evidence → analysis → link. “Say it, show it, explain it, connect it.”"],
    ["Dropped quotation", "A quotation with no signal phrase or explanation. Fix: introduce, cite, explain."],
    ["Climactic order", "Arranging points so the strongest comes last."],
    ["“True ease in writing comes from art, not chance”", "Pope, <i>An Essay on Criticism</i> (1711): skill that looks effortless is practised, like dance."]
  ]
};
