// ENG4U 02 Close Reading of Short Fiction. Source: /Users/ali/Desktop/MV/Modules/eng4u/plan/modules/02-close-reading-short-fiction.md
// Kate Chopin, "The Story of an Hour" (1894) is public domain (standard 23-paragraph text). "The Raise", the context cards,
// the word notes and every other passage, example and model are original to the course.
// In the story, "col&#111;r" and "gr&#97;y" keep Chopin's American spelling (the spelling check reads plain text).

// Misconception core sentences (plan §3), used where the plan tags a wrong option with M1–M7 but gives no feedback text.
const M1 = "Plot is what happens. Close reading asks how the telling makes us feel and think it.";
const M4 = "The narrator tells the story in the third person, but some sentences carry Louise’s own voice. Listen for exclamations and questions.";
const M6 = "Introduce it, cite it, then say what the words do. A quotation can’t explain itself.";
const M7 = "Chopin compresses a lifetime’s change into one hour. The title is a clue to the structure.";

// Whose words? sort (Activity 1): the first two hints are shared; the third is the answer with its reason.
const WH = (h3) => ["Are there quotation marks?", "Is there a “she knew” or “she thought”?", h3];

// The story, one entry per paragraph; s = sentences {t: text, m: main clause (string or parts), v: voice, c: 1 = two main clauses}.
// m:1 = the whole sentence is the main clause. v: "rep" reported thought, "fid" free indirect, "dia" dialogue; default narrator. see: who is seeing (default Louise).
const STORY = [
  { see:"out", s:[{ t:"Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband’s death.", m:"great care was taken" }] },
  { see:"out", s:[
    { t:"It was her sister Josephine who told her, in broken sentences; veiled hints that revealed in half concealing.", m:"It was her sister Josephine" },
    { t:"Her husband’s friend Richards was there, too, near her.", m:"Her husband’s friend Richards was there" },
    { t:"It was he who had been in the newspaper office when intelligence of the railroad disaster was received, with Brently Mallard’s name leading the list of “killed.”", m:"It was he" },
    { t:"He had only taken the time to assure himself of its truth by a second telegram, and had hastened to forestall any less careful, less tender friend in bearing the sad message.", m:"He had only taken the time" }] },
  { see:"near", s:[
    { t:"She did not hear the story as many women have heard the same, with a paralyzed inability to accept its significance.", m:"She did not hear the story" },
    { t:"She wept at once, with sudden, wild abandonment, in her sister’s arms.", m:"She wept at once" },
    { t:"When the storm of grief had spent itself she went away to her room alone.", m:"she went away to her room alone" },
    { t:"She would have no one follow her.", m:1 }] },
  { s:[
    { t:"There stood, facing the open window, a comfortable, roomy armchair.", m:["There stood", "a comfortable, roomy armchair."] },
    { t:"Into this she sank, pressed down by a physical exhaustion that haunted her body and seemed to reach into her soul.", m:"Into this she sank" }] },
  { s:[
    { t:"She could see in the open square before her house the tops of trees that were all aquiver with the new spring life.", m:["She could see", "the tops of trees"] },
    { t:"The delicious breath of rain was in the air.", m:1 },
    { t:"In the street below a peddler was crying his wares.", m:"a peddler was crying his wares." },
    { t:"The notes of a distant song which some one was singing reached her faintly, and countless sparrows were twittering in the eaves.", m:["The notes of a distant song", "reached her faintly", "countless sparrows were twittering in the eaves."], c:1 }] },
  { s:[{ t:"There were patches of blue sky showing here and there through the clouds that had met and piled one above the other in the west facing her window.", m:"There were patches of blue sky" }] },
  { s:[{ t:"She sat with her head thrown back upon the cushion of the chair, quite motionless, except when a sob came up into her throat and shook her, as a child who has cried itself to sleep continues to sob in its dreams.", m:"She sat" }] },
  { s:[
    { t:"She was young, with a fair, calm face, whose lines bespoke repression and even a certain strength.", m:"She was young" },
    { t:"But now there was a dull stare in her eyes, whose gaze was fixed away off yonder on one of those patches of blue sky.", m:"there was a dull stare in her eyes" },
    { t:"It was not a glance of reflection, but rather indicated a suspension of intelligent thought.", m:"It was not a glance of reflection" }] },
  { s:[
    { t:"There was something coming to her and she was waiting for it, fearfully.", m:["There was something coming to her", "she was waiting for it"], c:1 },
    { t:"What was it?", m:1, v:"fid" },
    { t:"She did not know; it was too subtle and elusive to name.", m:"She did not know", v:"rep" },
    { t:"But she felt it, creeping out of the sky, reaching toward her through the sounds, the scents, the col&#111;r that filled the air.", m:"she felt it", v:"rep" }] },
  { s:[
    { t:"Now her bosom rose and fell tumultuously.", m:1 },
    { t:"She was beginning to recognize this thing that was approaching to possess her, and she was striving to beat it back with her will—as powerless as her two white slender hands would have been.", m:["She was beginning to recognize this thing", "she was striving to beat it back"], c:1, v:"rep" }] },
  { s:[
    { t:"When she abandoned herself a little whispered word escaped her slightly parted lips.", m:"a little whispered word escaped her slightly parted lips." },
    { t:"She said it over and over under her breath: “free, free, free!”", m:"She said it over and over under her breath:", v:"dia" },
    { t:"The vacant stare and the look of terror that had followed it went from her eyes.", m:["The vacant stare and the look of terror", "went from her eyes."] },
    { t:"They stayed keen and bright.", m:1 },
    { t:"Her pulses beat fast, and the coursing blood warmed and relaxed every inch of her body.", m:["Her pulses beat fast,", "the coursing blood warmed and relaxed every inch of her body."], c:1 }] },
  { s:[
    { t:"She did not stop to ask if it were or were not a monstrous joy that held her.", m:"She did not stop to ask", v:"rep" },
    { t:"A clear and exalted perception enabled her to dismiss the suggestion as trivial.", m:1 }] },
  { s:[
    { t:"She knew that she would weep again when she saw the kind, tender hands folded in death; the face that had never looked save with love upon her, fixed and gr&#97;y and dead.", m:"She knew", v:"rep" },
    { t:"But she saw beyond that bitter moment a long procession of years to come that would belong to her absolutely.", m:["she saw", "a long procession of years to come"], v:"rep" },
    { t:"And she opened and spread her arms out to them in welcome.", m:"she opened and spread her arms out to them in welcome." }] },
  { s:[
    { t:"There would be no one to live for during those coming years; she would live for herself.", m:["There would be no one to live for", "she would live for herself."], c:1, v:"fid" },
    { t:"There would be no powerful will bending hers in that blind persistence with which men and women believe they have a right to impose a private will upon a fellow-creature.", m:"There would be no powerful will bending hers", v:"fid" },
    { t:"A kind intention or a cruel intention made the act seem no less a crime as she looked upon it in that brief moment of illumination.", m:"A kind intention or a cruel intention made the act seem no less a crime", v:"rep" }] },
  { s:[
    { t:"And yet she had loved him—sometimes.", m:"she had loved him—sometimes.", v:"fid" },
    { t:"Often she had not.", m:1, v:"fid" },
    { t:"What did it matter!", m:1, v:"fid" },
    { t:"What could love, the unsolved mystery, count for in face of this possession of self-assertion which she suddenly recognized as the strongest impulse of her being!", m:["What could love,", "count for"], v:"fid" }] },
  { s:[{ t:"“Free! Body and soul free!” she kept whispering.", m:"she kept whispering.", v:"dia" }] },
  { s:[
    { t:"Josephine was kneeling before the closed door with her lips to the keyhole, imploring for admission.", m:"Josephine was kneeling before the closed door" },
    { t:"“Louise, open the door! I beg; open the door—you will make yourself ill. What are you doing, Louise? For heaven’s sake open the door.”", m:"", v:"dia" }] },
  { s:[
    { t:"“Go away. I am not making myself ill.”", m:"", v:"dia" },
    { t:"No; she was drinking in a very elixir of life through that open window.", m:"she was drinking in a very elixir of life", v:"fid" }] },
  { s:[
    { t:"Her fancy was running riot along those days ahead of her.", m:"Her fancy was running riot" },
    { t:"Spring days, and summer days, and all sorts of days that would be her own.", m:"", v:"fid" },
    { t:"She breathed a quick prayer that life might be long.", m:"She breathed a quick prayer" },
    { t:"It was only yesterday she had thought with a shudder that life might be long.", m:"It was only yesterday", v:"rep" }] },
  { s:[
    { t:"She arose at length and opened the door to her sister’s importunities.", m:"She arose at length and opened the door" },
    { t:"There was a feverish triumph in her eyes, and she carried herself unwittingly like a goddess of Victory.", m:["There was a feverish triumph in her eyes,", "she carried herself unwittingly"], c:1 },
    { t:"She clasped her sister’s waist, and together they descended the stairs.", m:["She clasped her sister’s waist,", "together they descended the stairs."], c:1 },
    { t:"Richards stood waiting for them at the bottom.", m:"Richards stood waiting" }] },
  { see:"door", s:[
    { t:"Some one was opening the front door with a latchkey.", m:"Some one was opening the front door" },
    { t:"It was Brently Mallard who entered, a little travel-stained, composedly carrying his grip-sack and umbrella.", m:"It was Brently Mallard" },
    { t:"He had been far from the scene of the accident, and did not even know there had been one.", m:"He had been far from the scene of the accident," },
    { t:"He stood amazed at Josephine’s piercing cry; at Richards’ quick motion to screen him from the view of his wife.", m:"He stood amazed" }] },
  { see:"door", s:[{ t:"But Richards was too late.", m:"Richards was too late." }] },
  { see:"end", s:[{ t:"When the doctors came they said she had died of heart disease—of the joy that kills.", m:"they said" }] }
];

// Master’s-example chips for My Art of Language: [paragraph, sentences] in STORY (app.js turns them into "… (Chopin, par. N)").
const ART = [[23, [0]], [15, [0, 1, 2]], [14, [0]], [16, [0]], [19, [2]], [2, [0]], [18, [1]], [5, [0]]];

export default {
  id:"02-close-reading-short-fiction",
  kind:"topic",
  title:"Close reading of short fiction",
  topic:"Close Reading of Short Fiction",
  readyTopic:"close reading of short fiction",
  hero:{
    headline:"One hour. Two sentences about a heart. Everything in between changes what they mean.",
    text:"<strong>Close reading</strong> means slowing down until the words start to show their workings. In this module you’ll read Kate Chopin’s 1894 story four ways: as a whole, by paragraph, by sentence, and word by word. You’ll watch <strong>point of view</strong> slip inside a character’s mind, and discover how an <strong>ironic</strong> ending makes you reread everything that came before.",
    fig:{ html:'<div class="hh" id="hero-hour" role="group" aria-label="The first and last sentences of The Story of an Hour, with 23 bars between them, one for each paragraph, labelled one hour"></div>', caption:"" },
    first:{ par:1, glow:[{ g:"heart trouble", tag:"heart" }] },   // the story's first and last sentences (start.story)
    last:{ par:23, glow:[{ g:"heart disease", tag:"heart" }, { g:"of the joy that kills", tag:"Irony" }] },
    hour:"one hour"
  },
  goals:[
    "I can read a story at four zoom levels (whole, paragraph, sentence, word) and say what each reveals.",
    "I can make subtle inferences about a character from indirect details, and support them with quotations.",
    "I can identify point of view, including free indirect discourse, and explain its effect.",
    "I can explain situational, dramatic and verbal irony, and show how an ending reframes earlier details.",
    "I can trace a pattern of images (window, door, spring) and connect it to a theme.",
    "I can write an analytical paragraph with integrated quotations and MLA citations."
  ],
  start:{
    story:{ title:"The Story of an Hour", cite:"Kate Chopin, “The Story of an Hour” (1894). Public domain. Paragraphs are numbered 1–23 for MLA citations: (Chopin, par. 5).", pars:STORY },
    blocks:[
      { type:"write", id:"firstRead", title:"The reading",
        html:"<p class=\"muted\"><strong>Content note:</strong> This story involves sudden death and grief. Read it with its time (the 1890s) in mind.</p><p>Read the whole story once before you begin.</p><div id=\"story-app\"></div><h4 class=\"fr-h\">First-read notes</h4><p class=\"tiny muted\">These notes save on this device. They come back in Part 3, when you read the story a second time.</p>",
        prompt:"What surprised you? What do you expect to happen?" },
      { title:"Word story", html:"<p><strong><em>Text</em></strong>, from Latin <em>texere</em>, “to weave”. The same root gives <em>textile</em> and <em>texture</em>. A text is woven, and close reading means following single threads (one word, one image) to see how they hold the whole cloth together.</p><p class=\"tiny muted\">Word stories are short histories; see a dictionary’s etymology for more.</p>" }
    ],
    warmup:{
      questions:[
        { id:"w1", skill:"Point of view", goal:3,
          prompt:"“Maya checked her phone again. Still nothing. Why had she even bothered?” Which point of view is this?",
          options:[
            { t:"Third person, close to Maya’s thoughts", ok:true, why:"“Maya” and “her” are third person, but “Why had she even bothered?” carries her own feeling." },
            { t:"First person", why:"First person would use “I”." },
            { t:"Second person", why:"Second person addresses “you”." },
            { t:"Third-person objective (camera only)", why:"A camera can’t record “Why had she even bothered?”; we’re inside her head." }],
          hints:["Which pronouns are used?", "She/her: third person. Does the narrator know her thoughts?", "Third person, close to Maya."] },
        { id:"w2", skill:"Point of view", goal:3,
          prompt:"A narrator who knows the thoughts of <em>every</em> character is called:",
          options:[
            { t:"omniscient", ok:true, why:"Omniscient means “all-knowing”." },
            { t:"limited", why:"A limited narrator stays close to one character." },
            { t:"unreliable", why:"Unreliable means we can’t fully trust the narrator, which is a different question." },
            { t:"first person", why:"A first-person narrator is a character who says “I”." }],
          hints:["Think of the Latin <em>omni</em>, “all”.", "All-knowing.", "Omniscient."] },
        { id:"w3", skill:"Inference", goal:2,
          prompt:"“Jonah set the table for two, then quietly put one plate back in the cupboard.” What can you infer?",
          options:[
            { t:"Someone Jonah expected or hoped for isn’t coming, and he feels it", ok:true, why:"The action shows disappointment without naming it." },
            { t:"Jonah has too many plates", why:"The detail is about the missing person, not dishes." },
            { t:"Jonah is angry at the cupboard", why:"Nothing shows anger." },
            { t:"Jonah is having a party", why:"He reduces the table to one." }],
          hints:["What does setting a place mean?", "Why put one back?", "Someone isn’t coming."] },
        { id:"w4", skill:"Inference", goal:2,
          prompt:"Which is an <strong>inference</strong> rather than a stated fact, about a character who “answered every question in class but never once looked up from her desk”?",
          options:[
            { t:"She is knowledgeable but shy or anxious about being seen", ok:true, why:"It joins two details into a judgment the text implies." },
            { t:"She answered every question", why:"That’s stated, not inferred." },
            { t:"She never looked up", why:"Also stated." },
            { t:"She sits at a desk", why:"Stated, and not meaningful on its own." }],
          hints:["Which option goes beyond the words?", "Combine the two details.", "Knowledgeable but shy."] },
        { id:"w5", skill:"Irony", goal:4,
          prompt:"A fire station burns down. This is an example of:",
          options:[
            { t:"situational irony", ok:true, why:"What happens is the opposite of what you’d expect from the place." },
            { t:"verbal irony", why:"Verbal irony is <em>saying</em> the opposite of what you mean." },
            { t:"dramatic irony", why:"Dramatic irony needs the audience to know something a character doesn’t." },
            { t:"foreshadowing", why:"Foreshadowing hints at a later event." }],
          hints:["Is anyone speaking?", "Is it the opposite of what you’d expect?", "Situational irony."] },
        { id:"w6", skill:"Quotation integration", goal:6,
          prompt:"Which sentence integrates a quotation correctly in MLA style?",
          options:[
            { t:"The narrator notes that the trees were “all aquiver with the new spring life” (Chopin, par. 5).", ok:true, why:"Signal phrase, quotation marks, citation before the period." },
            { t:"“All aquiver with the new spring life.” This shows spring.", why:"A dropped quotation: no signal phrase or citation." },
            { t:"The trees were all aquiver with the new spring life (Chopin).", why:"The quotation marks and paragraph number are missing." },
            { t:"The trees were “all aquiver with the new spring life.” (Chopin, par. 5)", why:"In MLA, the period goes after the citation." }],
          hints:["Introduce, quote, cite.", "Where does the period go?", "After the parentheses."] }
      ],
      refreshers:{
        "Point of view":"First person uses “I”. Third person uses “she/he/they”: <em>omniscient</em> knows everyone’s mind; <em>limited</em> stays close to one character. <strong>Free indirect discourse</strong> is third person that slips into a character’s own thoughts without quotation marks.",
        "Inference":"An inference is a conclusion the text implies but doesn’t state. Combine details, then check that the text supports you.",
        "Irony":"<em>Verbal</em>: saying the opposite of what you mean. <em>Situational</em>: the opposite of what you’d expect happens. <em>Dramatic</em>: the audience knows something a character doesn’t.",
        "Quotation integration":"Introduce the quotation with your own words, quote exactly, cite in parentheses (here, the paragraph number: par. 5), then put the period after the citation."
      }
    }
  },
  explore:{
    heading:"Close-reading zoom",
    intro:"Read the story at four distances. Each zoom level asks a different question. Turn on a lens to see what a careful reader notices.",
    levels:[{ id:"story", label:"Story", q:"How is it built?" }, { id:"paragraph", label:"Paragraph", q:"How does this part move?" },
      { id:"sentence", label:"Sentence", q:"Whose voice? What shape?" }, { id:"word", label:"Word", q:"Why this word and not another?" }],
    lenses:[{ id:"pov", label:"Point of view", role:"sound" }, { id:"imagery", label:"Imagery", role:"image" }, { id:"irony", label:"Irony", role:"theme" },
      { id:"diction", label:"Diction", role:"diction" }, { id:"structure", label:"Structure", role:"syntax" }],
    figure:{ id:"figure", label:"Figure", role:"figure", lens:"imagery" },
    seeing:{ out:"The narrator, outside Louise: the family’s careful plan", near:"The narrator, moving in toward Louise", lou:"Louise (third person, limited)",
      door:"The narrator, at the front door: Louise can’t see this", end:"The narrator, reporting the doctors’ verdict", story:"Mostly Louise (third person, limited)" },
    voices:{ nar:"narrator", rep:"reported thought: the narrator tells us what she thinks", fid:"Blended: the narrator’s grammar, Louise’s voice (free indirect)", dia:"dialogue: spoken words in quotation marks" },
    key:[
      { par:1, lens:"irony", span:"afflicted with a heart trouble", note:"On a second read: the “heart” that fails is about more than health" },
      { par:1, lens:"irony", span:"great care was taken to break to her as gently as possible", note:"The family’s care is for the wrong danger" },
      { par:2, lens:"diction", span:"veiled hints that revealed in half concealing", note:"The paradox of telling and hiding: a story about what’s concealed" },
      { par:4, lens:"structure", span:"facing the open window, a comfortable, roomy armchair", note:"Louise alone, facing outward; the room becomes a stage for change" },
      { par:5, lens:"imagery", span:"all aquiver with the new spring life", note:"Renewal outside, right after news of death" },
      { par:5, lens:"imagery", span:"The delicious breath of rain was in the air.", note:"Sensory pleasure where grief is expected" },
      { par:6, lens:"imagery", span:"patches of blue sky", note:"Openings in the clouds: possibility" },
      { par:8, lens:"diction", span:"lines bespoke repression and even a certain strength", note:"Her calm face hides held-back life, and strength" },
      { par:9, lens:"pov", span:"There was something coming to her and she was waiting for it, fearfully.", note:"The narrator withholds the name of the feeling, as Louise does" },
      { par:11, lens:"pov", span:"“free, free, free!”", note:"Her own word, repeated: the climax of recognition" },
      { par:12, lens:"diction", span:"a monstrous joy", note:"The narrator names the guilt society would attach to her joy" },
      { par:14, lens:"diction", span:"no powerful will bending hers", note:"Marriage as the bending of one will by another" },
      { par:15, lens:"pov", span:"And yet she had loved him—sometimes. Often she had not. What did it matter!", note:"Free indirect discourse: Louise’s mind in the narrator’s grammar" },
      { par:17, lens:"structure", span:"kneeling before the closed door", note:"The closed door: the household’s claims on her" },
      { par:18, lens:"imagery", span:"drinking in a very elixir of life through that open window", note:"The window as a source of life" },
      { par:19, lens:"irony", span:"She breathed a quick prayer that life might be long.", note:"Situational irony: within minutes she will die" },
      { par:20, lens:"figure", span:"like a goddess of Victory", note:"Simile: triumph, power, near-myth" },
      { par:21, lens:"structure", span:"opening the front door with a latchkey", note:"The door that admits the old life back" },
      { par:23, lens:"irony", span:"of the joy that kills", note:"Dramatic irony: the doctors misread her joy" }
    ],
    // Other defensible tags (challenge sets outside the lens key): counted as good finds, never as extras.
    also:[
      { par:5, lens:"imagery", span:"countless sparrows were twittering in the eaves", note:"Birdsong: more new life" },
      { par:2, lens:"irony", span:"He had only taken the time to assure himself of its truth by a second telegram", note:"The news was “confirmed”, and still wrong" },
      { par:3, lens:"irony", span:"She did not hear the story as many women have heard the same", note:"Her response is different from what society expects" }
    ],
    words:[
      { w:"heart", par:1, den:"the organ that pumps blood; also the centre of feeling", con:"love, courage, the self", why:"On a first read “heart trouble” is medical. By the end it is emotional too: the word holds both meanings until the last line." },
      { w:"afflicted", par:1, den:"troubled by an illness or pain", con:"suffering, a burden to be managed", why:"“Had a weak heart” would be plain. “Afflicted” makes Louise a sufferer to be handled with care, which is how the household treats her." },
      { w:"veiled", par:2, den:"covered, partly hidden", con:"mourning veils, modesty, secrets", why:"The news itself wears a veil, like a widow. Telling and hiding happen in the same breath." },
      { w:"aquiver", par:5, den:"trembling, quivering", con:"excited, alive, thrilled", why:"“Shaking” could mean fear or cold. “Aquiver” is pleasurable and alive: the trees feel what Louise will soon feel." },
      { w:"delicious", par:5, den:"very pleasant to taste or smell", con:"appetite, sensual delight", why:"A word of pleasure, placed just after news of a death. Her senses wake before her mind admits why." },
      { w:"bespoke", par:8, den:"showed; gave evidence of", con:"formal, a little old-fashioned; the face itself speaks", why:"Her face “speaks” what she has never said aloud: years of holding back, and the strength to stop." },
      { w:"fearfully", par:9, den:"with fear", con:"dread mixed with awe", why:"Set last, after a comma, the word makes the waiting suspenseful. She fears what she is about to want." },
      { w:"free", par:11, den:"not under someone else’s control", con:"release, possibility, owning yourself", why:"Said three times, it stops being a description and becomes a discovery." },
      { w:"monstrous", par:12, den:"huge; shockingly wrong", con:"something others would condemn", why:"“A great joy” would be harmless. “Monstrous” names the judgment others would pass on her joy, and she sets it aside." },
      { w:"bending", par:14, den:"forcing into a curve; making something give way", con:"pressure, control, a will that yields", why:"A will that “bends” another treats a person like a branch: marriage as force, even when it is kind." },
      { w:"matter", par:15, den:"to be important", con:"weight, consequence, what counts", why:"“What did it matter!” weighs love against selfhood and finds love lighter. A whole moral world turns on one small verb." },
      { w:"elixir", par:18, den:"a magic potion said to give long life", con:"medicine, magic, immortality", why:"Josephine fears she is making herself ill. Instead she drinks a cure, and it comes through the open window." },
      { w:"riot", par:19, den:"wild disorder; “running riot”: growing out of control", con:"excitement, abandon", why:"Her imagination breaks its banks. The phrase fits a mind let loose for the first time." },
      { w:"importunities", par:20, den:"repeated, urgent requests", con:"nagging, pressure", why:"Josephine’s kindness is felt as pressure: one more claim the household makes on her." },
      { w:"Victory", par:20, den:"winning", con:"a goddess (Nike), triumph, a statue", why:"The capital V turns victory into a goddess. Louise descends like a figure of triumph, moments before her fall." },
      { w:"latchkey", par:21, den:"a key to an outside door", con:"ordinary, domestic; the right to come home", why:"A small, everyday object lets the old life back in. The plot turns on the most ordinary thing in the house." },
      { w:"kills", par:23, den:"causes death", con:"violence; “the joy that kills” was a sentimental phrase", why:"The doctors’ phrase sounds tender. The reader hears its irony: joy didn’t kill her; losing it did." }
    ],
    model:[1, 1, 2, 1, 1, 1, 1, 1, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 2, 2, 0],
    modelLabel:"One careful reading (not scored)",
    ironyCard:{ left:"What the doctors think", right:"What the reader knows", doctors:"She died of joy at seeing her husband alive.", reader:"Her joy was freedom, and its loss killed her." },
    aha:"The same sentence means differently at different distances. “What did it matter!” is a plot detail at Story zoom, a turning point at Paragraph zoom, a voice at Sentence zoom, and a whole moral world in the single word “matter”.",
    predIntro:"Make a prediction first. Then the zoom will show you what a careful reader sees.",
    predictions:[
      { id:"p1",
        prompt:"The story is called “The Story of an Hour.” What does that title predict about its structure?",
        options:[{ t:"Events and change will be compressed into a very short time, so every moment counts", ok:true }, { t:"The story will cover Louise’s whole life in order" }, { t:"The story is mostly about a clock" }, { t:"Nothing; titles are labels" }],
        explain:"Chopin squeezes a lifetime’s change (grief, recognition, freedom, loss) into an hour. Compression makes each paragraph a step." },
      { id:"p2",
        prompt:"Right after news of a death, Chopin describes trees “aquiver with the new spring life”, “the delicious breath of rain” and “patches of blue sky”. Predict the effect of placing these images here.",
        options:[{ t:"They create tension: the world outside promises renewal, hinting that Louise’s feelings won’t be simple grief", ok:true }, { t:"They show it is a nice day for a funeral" }, { t:"They have no connection to Louise" }, { t:"They show that Louise loves gardening" }],
        explain:"Setting can mirror or contradict a character. Here it quietly announces what Louise can’t yet name." },
      { id:"p3",
        prompt:"Louise whispers “free, free, free!” Whose words are these, and what does the narrator do next?",
        options:[{ t:"They are Louise’s own words; soon after, the narrator’s sentences begin to sound like her thoughts too", ok:true }, { t:"They are the narrator’s judgment of Louise" }, { t:"They are Josephine’s words through the door" }, { t:"They are the doctors’ diagnosis" }],
        explain:"We hear her say it, and then the narration itself starts speaking in her voice. That’s how Chopin lets us share a joy no one else in the house can see." },
      { id:"p4",
        prompt:"Predict what the Irony lens will flag in “she had died of heart disease—of the joy that kills.”",
        options:[{ t:"The doctors believe she died of joy at seeing her husband alive; the reader knows her joy was freedom, and its loss killed her", ok:true }, { t:"The doctors are simply correct" }, { t:"Louise is speaking sarcastically" }, { t:"There is no irony; it’s a medical fact" }],
        explain:"That gap between characters’ belief and readers’ knowledge is dramatic irony. It rewrites the whole story." }
    ],
    chalIntro:"Use the zoom to meet each goal, then press <strong>Check challenge</strong>. <strong>Set it up</strong> opens the right mode and paragraph. Each challenge has three levels of help.",
    challenges:[
      { id:"tc1", goal:[1, 5],
        prompt:"<strong>Find the spring.</strong> In Annotate mode, paragraphs 5–6: tag three images of renewal. <button type=\"button\" class=\"btn ghost sm cz-setup\" data-setup=\"tc1\">Set it up</button>",
        why:"Spring, rain, birds and sky: renewal outside, right after news of a death.",
        hints:["Look for spring, weather and birds.", "Four images suggest new life; you need three.", "Trees “aquiver”, “breath of rain”, “sparrows”, “patches of blue sky”."] },
      { id:"tc2", goal:3,
        prompt:"<strong>Hear her voice.</strong> In Sentence zoom, paragraphs 12–16: select the sentence (or sentences) where the narrator’s voice and Louise’s thoughts blend most completely: free indirect discourse. <button type=\"button\" class=\"btn ghost sm cz-setup\" data-setup=\"tc2\">Set it up</button>",
        why:"Free indirect discourse: Louise’s mind in the narrator’s grammar.",
        answer:["15-0", "15-1", "15-2"],
        hints:["Look for questions or exclamations not inside quotation marks.", "Which sentence sounds like her arguing with herself?", "“What did it matter!” in paragraph 15."] },
      { id:"tc3", goal:[1, 4], stretch:true,
        prompt:"<strong>The second read.</strong> In Annotate mode, paragraphs 1–3: tag two details that the ending makes ironic, and choose the reason for each. <button type=\"button\" class=\"btn ghost sm cz-setup\" data-setup=\"tc3\">Set it up</button>",
        why:"This is the reward of rereading: the ending reaches back and changes the beginning.",
        hints:["Reread paragraph 1 knowing how the story ends.", "What did everyone think was the danger to her heart?", "“heart trouble” and “great care… as gently as possible”."] }
    ],
    tc1:{ items:[{ par:5, span:"all aquiver with the new spring life" }, { par:5, span:"The delicious breath of rain was in the air" }, { par:5, span:"countless sparrows were twittering in the eaves" }, { par:6, span:"patches of blue sky" }],
      peddler:{ par:5, span:"a peddler was crying his wares", msg:"That’s an image of ordinary street life. Is it about renewal? Keep looking." },
      song:{ par:5, span:"The notes of a distant song", msg:"A song can suggest life, but the clearest renewal images are about spring, rain, birds and sky." } },
    tc2:{ wrong:{ "13-0":"That’s <em>reported</em> thought: the narrator tells us “She knew”. Look for a sentence that sounds like Louise talking to herself.",
      "16-0":"That’s her speech, in quotation marks, with a dialogue tag. Look for her voice <em>without</em> quotation marks." } },
    tc3:{ reasons:[{ id:"r1", t:"Her “heart” fails for reasons no one guesses" }, { id:"r2", t:"Everyone protects her from the wrong shock" },
        { id:"r3", t:"The news was “confirmed”, and still wrong" }, { id:"r4", t:"Her response is different from what society expects, and the story will show how" }],
      items:[{ par:1, span:"afflicted with a heart trouble", answer:"r1" }, { par:1, span:"great care was taken to break to her as gently as possible", answer:"r2" },
        { par:2, span:"He had only taken the time to assure himself of its truth by a second telegram", answer:"r3" }, { par:3, span:"She did not hear the story as many women have heard the same", answer:"r4" }],
      armchair:{ par:4, span:"a comfortable, roomy armchair", msg:"It matters (it’s where her change happens), but the ending doesn’t make it ironic." },
      mismatch:"Good detail. Which reason explains why the <em>ending</em> changes it?" }
  },
  part3:{
    slug:"reread", name:"Reread",
    heading:"Read it twice",
    intro:"Set your first reading beside a second one and watch your understanding grow. Three stations: what the ending changes, the pattern of windows and doors, and Louise’s world.",
    reread:{
      details:[
        { id:"d1", par:1, q:"afflicted with a heart trouble", label:"heart trouble" },
        { id:"d2", par:1, q:"great care was taken to break to her as gently as possible", label:"great care" },
        { id:"d3", par:2, q:"by a second telegram", label:"second telegram" },
        { id:"d4", par:12, q:"a monstrous joy", label:"“monstrous joy”" },
        { id:"d5", par:19, q:"She breathed a quick prayer that life might be long.", label:"“prayer that life might be long”" },
        { id:"d6", par:23, q:"of the joy that kills", label:"“joy that kills”" }],
      seen:[{ id:"then", t:"I noticed this the first time" }, { id:"now", t:"I see it differently now" }],
      house:[
        { id:"window", label:"The open window", pars:"pars. 4–6, 18", quotes:[{ par:4, q:"There stood, facing the open window, a comfortable, roomy armchair." }, { par:18, q:"No; she was drinking in a very elixir of life through that open window." }] },
        { id:"door", label:"The closed door", pars:"par. 17", quotes:[{ par:17, q:"Josephine was kneeling before the closed door with her lips to the keyhole, imploring for admission." }] },
        { id:"stairs", label:"The stairs", pars:"par. 20", quotes:[{ par:20, q:"She clasped her sister’s waist, and together they descended the stairs." }] },
        { id:"front", label:"The front door and latchkey", pars:"par. 21", quotes:[{ par:21, q:"Some one was opening the front door with a latchkey." }] }],
      pattern:{ q:"What pattern do the window and the doors make?", a:"The open window stands for", b:"while the doors stand for",
        windows:[{ id:"w1", t:"the world of possibility" }, { id:"w2", t:"freedom" }, { id:"w3", t:"death, as windows always do in literature", fb:"A symbol means what this text builds. Here the window lets in spring and “a very elixir of life”." }],
        doors:[{ id:"d1", t:"the household’s claims on her" }, { id:"d2", t:"the return of her old life" }, { id:"d3", t:"Louise’s love for Josephine", fb:"Josephine’s pleading at the door is a claim on her, not a sign of Louise’s affection." }],
        answer:["w1|d1", "w1|d2", "w2|d1", "w2|d2"],
        right:"The window lets in renewal (“a very elixir of life”, par. 18); the doors (Josephine kneeling at the closed door, par. 17; Brently’s latchkey, par. 21) mark the claims that pull her back." },
      world:{
        cards:[
          { title:"Married women in the 1890s United States", text:"Under the old legal idea of <em>coverture</em>, a wife’s legal identity was largely folded into her husband’s. State Married Women’s Property Acts (from the 1840s on) slowly let wives own property and keep wages, but many women still depended on a husband’s income, divorce was hard to get and carried shame, and women could not vote in most states." },
          { title:"What propriety required of a widow", text:"A respectable widow was expected to grieve visibly: to wear black mourning clothes for a year or more, to withdraw from social life, and to speak of her husband only with sorrow. Relief, let alone joy, was not something a widow could say aloud." },
          { title:"Chopin’s reputation", text:"Kate Chopin (1850–1904), herself widowed in 1882, wrote stories for national magazines; this one first appeared in <i>Vogue</i> in 1894 as “The Dream of an Hour”. Her novel <i>The Awakening</i> (1899), about a married woman claiming her own life, was condemned by many reviewers. Chopin was known as a writer who challenged the conventions of her time." }],
        verify:"For teachers: verify details before release.",
        prompt:"Reread paragraph 14 (“There would be no powerful will bending hers…”). Does knowing her world change how you judge her joy?" }
    },
    quickCheck:{
      title:"Read it twice quick check", summary:"Read it twice quick check",
      items:[
        { id:"q1", goal:4, prompt:"Which detail from paragraph 1 does the ending make ironic?",
          right:"Right. Everyone guards her heart against grief; the real shock is the opposite.", wrong:"Everyone guards her heart against grief; the real shock is the opposite.",
          choices:[{ t:"“great care was taken to break to her as gently as possible”", ok:true }, { t:"“Mrs. Mallard”" }, { t:"“the news”" }, { t:"“her husband’s”" }] },
        { id:"q2", goal:4, prompt:"The doctors’ diagnosis in paragraph 23 is an example of:",
          right:"Right. The reader knows what the doctors don’t.", wrong:"The reader knows what the doctors don’t.",
          choices:[{ t:"dramatic irony", ok:true }, { t:"verbal irony" }, { t:"foreshadowing" }, { t:"hyperbole" }] },
        { id:"q3", goal:5, prompt:"In this story, the open window is best described as:",
          right:"Right. A symbol means what the text makes it mean; here the spring images and the “elixir of life” build it.", wrong:"A symbol means what the text makes it mean; here the spring images and the “elixir of life” build it.",
          choices:[{ t:"a pattern the story builds into an image of possibility", ok:true }, { t:"a symbol that always means freedom in literature" }, { t:"a sign that it’s summer" }, { t:"a hiding place" }] },
        { id:"q4", goal:1, prompt:"Why does Chopin set the story in a single hour?",
          right:"Right. Time is a tool. Compression intensifies.", wrong:"Time is a tool. Compression intensifies.",
          choices:[{ t:"Compression makes each step of Louise’s change feel urgent and makes the reversal sudden", ok:true }, { t:"Because short stories must take an hour" }, { t:"To save paper" }, { t:"Because Louise is always late" }] }
      ]
    },
    blocksAfter:[{ type:"write", id:"steal", title:"Sentence to steal",
      html:"<p class=\"steal-line\">“There would be no one to live for during those coming years; she would live for herself.”</p><p class=\"eng-cite\">(Chopin, par. 14)</p><p><strong>Its shape:</strong> “There would be no one to [verb] for during those [time]; [pronoun] would [verb] for [reflexive].” The semicolon balances two halves, and “for” turns from others to the self.</p><p><strong>Model imitation:</strong> “There would be no one to perform for that whole summer; I would play for myself.”</p><p>Keep the shape. Change the content.</p>",
      prompt:"Your imitation:" }]
  },
  practice:{
    activities:[
      { id:"whose", type:"sorter", title:"Whose words?", summary:"Whose words?", noun:"sentence", txt:true, goal:3,
        instruction:"Sort eight sentences from the story by whose words they carry.",
        how:"Tap a sentence, then tap whose words it carries.",
        boxes:[{ id:"b1", label:"Narrator describes" }, { id:"b2", label:"Reported thought" }, { id:"b3", label:"Free indirect thought" }, { id:"b4", label:"Dialogue" }],
        wrongDefault:M4,
        items:[
          { id:"i1", t:"“There stood, facing the open window, a comfortable, roomy armchair.” (par. 4)", answer:"b1", why:"The narrator sets the scene; no one’s voice or thought is reported.",
            wrong:{ b3:"This is the narrator setting the scene, not Louise’s voice." }, hints:WH("Narrator describes: the narrator sets the scene, with no one’s thought or voice in it.") },
          { id:"i2", t:"“She knew that she would weep again when she saw the kind, tender hands folded in death;” (par. 13)", answer:"b2", why:"“She knew that…” reports her thought from outside.",
            wrong:{ b3:"“She knew that…” reports her thought from outside." }, hints:WH("Reported thought: “She knew that…” reports her thought from outside.") },
          { id:"i3", t:"“What did it matter!” (par. 15)", answer:"b3", why:"No quotation marks and no “she thought”, yet the exclamation is hers: Louise’s mind in the narrator’s grammar.",
            wrong:{ b1:"Would a neutral narrator exclaim this? It’s Louise’s mind." }, hints:WH("Free indirect thought: no quotation marks, no “she thought”, but the exclamation is Louise’s.") },
          { id:"i4", t:"“‘Go away. I am not making myself ill.’” (par. 18)", answer:"b4", why:"Quotation marks and spoken words make it dialogue.",
            wrong:{ b3:"Quotation marks and spoken words make it dialogue." }, hints:WH("Dialogue: quotation marks and spoken words.") },
          { id:"i5", t:"“There would be no one to live for during those coming years; she would live for herself.” (par. 14)", answer:"b3", why:"There’s no “she thought”: her plans speak directly through the narration.",
            wrong:{ b2:"There’s no “she thought”. Her plans speak directly through the narration." }, hints:WH("Free indirect thought: no “she thought”; her plans speak directly through the narration.") },
          { id:"i6", t:"“‘Louise, open the door! I beg; open the door—you will make yourself ill.’” (par. 17)", answer:"b4", why:"Josephine speaks these words aloud.",
            wrong:{ b1:"Josephine speaks these words aloud." }, hints:WH("Dialogue: Josephine speaks these words aloud.") },
          { id:"i7", t:"“Knowing that Mrs. Mallard was afflicted with a heart trouble, great care was taken to break to her as gently as possible the news of her husband’s death.” (par. 1)", answer:"b1", why:"No one’s thought is reported; the narrator explains the situation.",
            wrong:{ b2:"No one’s thought is reported; the narrator explains the situation." }, hints:WH("Narrator describes: no one’s thought is reported; the narrator explains the situation.") },
          { id:"i8", t:"“It was only yesterday she had thought with a shudder that life might be long.” (par. 19)", answer:"b2", why:"“She had thought” reports the thought from outside.",
            wrong:{ b3:"“She had thought” reports the thought from outside." }, hints:WH("Reported thought: “she had thought” reports the thought from outside.") }
        ] },
      { id:"unseen", type:"custom", title:"Unseen short-short story", summary:"Unseen short-short story", star:true, goal:[2, 3, 4, 5],
        instruction:"Read “The Raise”, then choose the best answer to each question. Questions 5 and 6 go beyond the Final Check.",
        how:"Pick an answer, then press Check answer. Wrong answers show why; try again.",
        passage:["For eleven years Agnes had opened the shop at seven. She knew which floorboard groaned, which customer wanted the paper folded twice, which week in March the pipes would knock like an impatient guest. When Mr. Avila asked her to stay after closing, she smoothed her apron and practised her thanks in the stockroom mirror. Eleven years. Surely now.",
          "He was kind about it. A company in Hamilton had bought the shop; there would be new machines, new hours, a manager from head office. He shook her hand for a long time. On the walk home the streetlights came on one after another, as if the town were applauding someone else.",
          "At the corner she stopped. A sign in the bakery window said HELP WANTED—EARLY MORNINGS. She read it twice. Then she laughed, alone on the sidewalk, a sound so sudden that a pigeon lifted off the wire, and she found she could not remember the last time she had heard it."],
        cite:"“The Raise”: original, written for this course.",
        items:[
          { id:"u1", goal:3, prompt:"“Eleven years. Surely now.” Whose voice is this?",
            options:[
              { t:"Agnes’s thoughts, in free indirect discourse", ok:true, why:"No quotation marks and no “she thought”, but the hope is hers: her mind in the narrator’s grammar." },
              { t:"The narrator’s opinion", why:"A neutral narrator wouldn’t say “Surely now”. It’s her hope." },
              { t:"Mr. Avila’s words to Agnes", why:"Mr. Avila hasn’t spoken yet, and there are no quotation marks." },
              { t:"Words Agnes says aloud to a customer", why:"There are no quotation marks or speech tag, and the shop is closed." }],
            hints:["Are there quotation marks, or a “she thought”?", "Whose hope does “Surely now” carry?", "Agnes’s thoughts in free indirect discourse: her hope in the narrator’s grammar."] },
          { id:"u2", goal:4, prompt:"What makes “practised her thanks in the stockroom mirror” ironic?",
            options:[
              { t:"She expects a reward, but she is about to lose her job", ok:true, why:"Events overturn her expectation: situational irony." },
              { t:"It is verbal irony: she says the opposite of what she means", why:"No one says the opposite of what they mean; events overturn her expectation." },
              { t:"It shows she is vain about her looks", why:"Nothing suggests vanity; she rehearses thanks for a raise she expects." },
              { t:"It foreshadows that she will get the raise", why:"The raise never comes; the detail sets up a reversal." }],
            hints:["What does she expect to happen?", "What actually happens?", "She expects a reward, but she is about to lose her job."] },
          { id:"u3", goal:[2, 5], prompt:"“as if the town were applauding someone else”: effect?",
            options:[
              { t:"It shows her isolation: the world seems to celebrate everyone but her", ok:true, why:"The simile turns the streetlights into applause meant for “someone else”." },
              { t:"The town is literally clapping", why:"Read the simile for feeling." },
              { t:"It shows the town is celebrating her eleven years", why:"The applause is for “someone else”, not her." },
              { t:"It shows she is proud of the new owners", why:"Nothing suggests pride; the applause is for “someone else”." }],
            hints:["Who is the applause for?", "“Someone else”: how would that feel on the walk home?", "Her isolation: the world seems to celebrate everyone but her."] },
          { id:"u4", goal:2, prompt:"“the pipes would knock like an impatient guest”: what does the detail reveal?",
            options:[
              { t:"Her intimate, almost affectionate knowledge of the shop, which makes the loss deeper", ok:true, why:"She knows the shop’s habits like a home’s, so losing it costs more." },
              { t:"The pipes are broken", why:"It’s about what she knows, not about plumbing." },
              { t:"She dislikes having guests", why:"The simile describes the pipes, not her feelings about visitors." },
              { t:"The shop is about to close for repairs", why:"Nothing points to repairs; the detail shows how well she knows the place." }],
            hints:["What does knowing “which week in March” say about her?", "She knows the shop like a home. What will losing it cost?", "Intimate, almost affectionate knowledge, which deepens the loss."] },
          { id:"u5", goal:[2, 4], prompt:"<span class=\"tag\">★</span> Which reading of the ending is best supported?",
            options:[
              { t:"The laugh is a reversal: loss opens an unexpected sense of freedom or possibility, left open rather than resolved", ok:true, why:"She finds a laugh she can’t remember hearing; the story turns, then stops." },
              { t:"She will definitely take the bakery job", why:"The story never says so; it stops at the laugh." },
              { t:"She laughs bitterly because her life is ruined", why:"The laugh is sudden and surprising, a sound she has missed: it reads as release, not bitterness." },
              { t:"The ending proves the shop was a prison", why:"That overreaches: she knew the shop with affection. The ending is left open." }],
            hints:["What does she “find” at the very end?", "Laughter she can’t remember hearing: what has she lost, and gained?", "A reversal, left open."] },
          { id:"u6", goal:4, prompt:"<span class=\"tag\">★</span> Which statement best compares this ending with Chopin’s?",
            options:[
              { t:"Both turn on a sudden reversal of expectation and an unexpected joy, but Chopin’s ends in death and dramatic irony, while “The Raise” ends on an open, possibly hopeful note", ok:true, why:"It names what the endings share and exactly where they part." },
              { t:"Both endings are tragic", why:"Agnes laughs and the ending is open; only Chopin’s ends in death." },
              { t:"Both stories end with dramatic irony", why:"Only Chopin’s doctors misread what the reader knows; “The Raise” ends on Agnes’s own discovery." },
              { t:"The two endings have nothing in common", why:"Both turn on a sudden reversal and an unexpected joy." }],
            hints:["What happens to each character’s expectation?", "Which ending is closed by death, and which is left open?", "Both turn on a reversal and an unexpected joy; Chopin’s ends in death and dramatic irony, “The Raise” on an open note."] }
        ] },
      { id:"spot", type:"custom", title:"Spot the error", summary:"Spot the error", student:"Catalina", goal:[4, 6],
        instruction:"Catalina made one mistake in each paragraph. Tap the sentence where the <strong>first</strong> mistake happens, then choose the fix.",
        problems:[
          { id:"e1", goal:6, task:"Analyse how setting reveals Louise’s feelings.",
            steps:["In “The Story of an Hour,” Chopin uses setting to reveal a desire Louise cannot yet name.", "Alone upstairs, Louise sits facing “the open window” (Chopin, par. 4).",
              "Then she sees the trees, then she smells rain, then she sees blue sky, and then she whispers “free.”", "Therefore the setting shows her freedom."],
            answer:2,
            stepFb:["A clear, arguable claim. Keep checking.", "Correctly integrated and cited.", "", "Sentence 4 can’t do much after a list of events. The problem is earlier."],
            fixes:[
              { t:"The “new spring life” and “patches of blue sky” she sees (pars. 5–6) promise renewal at the very moment of death, so the setting voices the change rising in her before she can name it.", ok:true, why:"It picks two images, cites them and says what they suggest." },
              { t:"Then she sits in the armchair for a long time.", why:"More plot. This needs analysis." },
              { t:"She sees the trees (Chopin).", why:"Still summary, and the citation lacks a paragraph number." },
              { t:"Sentence 3 is fine.", why:"A string of “then”s is plot summary posing as analysis." }],
            hints:["Is sentence 3 telling what happens, or how it means?", "Pick two images and say what they suggest.", "Renewal → the change in her."] },
          { id:"e2", goal:4, task:"Explain the irony of the ending.",
            steps:["The ending of “The Story of an Hour” turns on irony.", "Brently Mallard enters, “a little travel-stained” (Chopin, par. 21), unaware of any accident.", "Louise dies at the sight of him.",
              "The doctors are right that she dies “of the joy that kills” (par. 23), because she is overjoyed that her husband is alive.", "This shows how much she loved him."],
            answer:3,
            stepFb:["Fine. Keep checking.", "Accurate and cited.", "Accurate.", "", "Sentence 5 follows the mistaken reading in sentence 4."],
            fixes:[
              { t:"The doctors assume she died of joy at his return, but the reader knows her “monstrous joy” (par. 12) was her freedom; what kills her is losing it, so their diagnosis is dramatic irony.", ok:true, why:"It sets what the doctors believe against what the reader knows, with evidence." },
              { t:"The doctors are wrong because she actually died of a cold.", why:"Unsupported by the text." },
              { t:"The doctors are right, and the story is a romance.", why:"That ignores pars. 11–20." },
              { t:"Sentence 4 is correct.", why:"Reread pars. 11–16. What was her joy about?" }],
            hints:["What does Louise whisper in paragraph 11?", "What did his return take away?", "Dramatic irony."] },
          { id:"e3", goal:6, task:"Show Louise’s joy.",
            steps:["Chopin makes Louise’s joy physical as well as emotional.", "“Free! Body and soul free!” This shows she is happy.", "Her “pulses beat fast” (par. 11) as the feeling takes hold.", "The repetition of “free” becomes a kind of heartbeat."],
            answer:1,
            stepFb:["A precise claim. Keep checking.", "", "Sentence 3 integrates well. The problem is earlier.", "A strong insight. The problem is earlier."],
            fixes:[
              { t:"When she whispers, “Free! Body and soul free!” (Chopin, par. 16), the repetition and the pairing of “body” and “soul” show a joy that fills her completely.", ok:true, why:"Signal phrase, citation, and what the words do." },
              { t:"“Free! Body and soul free!” (Chopin, par. 16).", why:"Cited, but still dropped in and not analysed." },
              { t:"She says she is free. This shows she is free.", why:"Circular. Say what the words <em>do</em>." },
              { t:"Sentence 2 is fine.", why:"A quotation can’t introduce or explain itself." }],
            hints:["Is the quotation introduced?", "Is it cited? Is it analysed?", "Signal phrase + citation + what the words do."] }
        ] }
    ]
  },
  reflect:{
    journal:[
      { id:"j1", q:"Compare your first-read notes with what you saw on the second read. What surprised you most about your own reading?" },
      { id:"j2", q:"In your own words, explain how the last sentence changes the first. Quote both." },
      { id:"j3", q:"Explain free indirect discourse to a friend, using one sentence from the story and one you write yourself." },
      { id:"j4", q:"Which zoom level do you tend to skip when you read on your own? What will you do differently with the next story?" }
    ],
    blocks:[
      { title:"From your reading", html:"<p class=\"tiny muted\">Your first-read notes (Start) and your answer at “Her world” (Read it twice) come back here, for your journal.</p><div id=\"rf-back\"></div>" },
      { title:"Commonplace book", html:"<p>Save one sentence from “The Story of an Hour” that you’d like to remember, and add a note on why it stayed with you.</p><div id=\"cp-app\"></div>" }
    ],
    art:{
      intro:"Write one principle about <em>reading</em> that you now believe, the kind of rule you’d follow with any story. Pair it with a sentence from Chopin that taught it, and an imitation of your own.",
      placeholder:"Your principle about reading, in one sentence",
      examples:[], exampleRefs:ART
    },
    artSamples:"<p class=\"tiny muted\" style=\"margin:0 0 6px\">Two sample principles (examples only; write your own):</p><p class=\"an-note an-theme\">“Reread the ending; it rewrites the beginning.” <span class=\"muted\">Master: “she had died of heart disease—of the joy that kills.” Imitation: “They called it his lucky break—the fall that finally let him rest.”</span></p><p class=\"an-note an-sound\">“Listen for when the narrator starts speaking in a character’s voice.” <span class=\"muted\">Master: “What did it matter!” Imitation: “The bus was late again. Of course it was.”</span></p>",
    commonplaceLines:[[1, 0], [2, 0], [5, 1], [15, 2], [14, 0], [18, 1], [23, 0]]   // [paragraph, sentence] in start.story
  },
  final:{
    questions:[
      { id:"k1", cat:"K", goal:3,
        a:{ prompt:"From what point of view is most of “The Story of an Hour” told?", options:[
          { t:"Third person, staying close to Louise’s thoughts and feelings", ok:true, why:"We follow Louise’s inner life; we don’t enter Josephine’s or Richards’s minds in the same way." },
          { t:"First person, narrated by Louise", why:"Louise is “she”, not “I”." },
          { t:"Third person, entering every character’s mind equally", why:"The narration stays close to Louise." },
          { t:"Second person, addressed to the reader", why:"Nothing is addressed to “you”." }] },
        b:{ prompt:"In “And yet she had loved him—sometimes. Often she had not. What did it matter!” (par. 15), Louise’s thoughts appear in the narration without quotation marks. This technique is called:", options:[
          { t:"free indirect discourse", ok:true, why:"The narrator’s grammar carries the character’s voice." },
          { t:"direct dialogue", why:"There are no quotation marks and no speaker tag." },
          { t:"an aside", why:"An aside is a theatrical convention: a character speaking to the audience." },
          { t:"apostrophe", why:"No one absent is being addressed." }] } },
      { id:"k2", cat:"K", goal:4,
        a:{ prompt:"The doctors say Louise died “of the joy that kills” (par. 23). The reader knows something the doctors don’t. This is:", options:[
          { t:"dramatic irony", ok:true, why:"The reader’s knowledge exceeds the characters’." },
          { t:"verbal irony spoken by Louise", why:"Louise doesn’t speak this line." },
          { t:"foreshadowing", why:"It’s the ending, not a hint of what’s to come." },
          { t:"hyperbole", why:"It isn’t an exaggeration." }] },
        b:{ prompt:"Louise prays “that life might be long” (par. 19) shortly before she dies. An outcome that is the opposite of what a character hopes for is:", options:[
          { t:"situational irony", ok:true, why:"Events overturn her expectation." },
          { t:"personification", why:"Nothing is given human traits." },
          { t:"verbal irony", why:"She means what she prays." },
          { t:"a simile", why:"Nothing is compared." }] } },
      { id:"k3", cat:"K", goal:1,
        a:{ prompt:"Which question belongs to the <strong>word</strong> level of close reading?", options:[
          { t:"“Why does Chopin call it a ‘monstrous’ joy instead of a ‘great’ joy?”", ok:true, why:"It focuses on one word’s connotation." },
          { t:"“How does the ending change the beginning?”", why:"That’s the whole-story level." },
          { t:"“How does paragraph 5 move from sound to sight?”", why:"That’s the paragraph level." },
          { t:"“What happens after Brently arrives?”", why:"That’s plot." }] },
        b:{ prompt:"Which question belongs to the <strong>whole-story</strong> level?", options:[
          { t:"“How does setting the story within one hour shape its structure?”", ok:true, why:M7 },
          { t:"“Why ‘aquiver’ and not ‘shaking’?”", why:"That’s the word level." },
          { t:"“Whose voice is ‘What did it matter!’?”", why:"That’s the sentence level." },
          { t:"“What does ‘elixir’ mean?”", why:"That’s the word level." }] } },
      { id:"t1", cat:"T", goal:2,
        a:{ prompt:"“She was young, with a fair, calm face, whose lines bespoke repression and even a certain strength” (par. 8). Which inference is best supported?", options:[
          { t:"Her calm surface hides years of held-back feeling, and also the strength that will let her claim her freedom", ok:true, why:"“Repression” means feelings held down, and “a certain strength” hints at what will rise." },
          { t:"She is physically weak and ill.", why:"The sentence says “strength”." },
          { t:"She is cruel and cold-hearted.", why:"Nothing here suggests cruelty; “repression” means feelings held down." },
          { t:"She is much older than her husband.", why:"“She was young.”" }] },
        b:{ prompt:"Louise tries to “beat it back with her will—as powerless as her two white slender hands would have been” (par. 10). Which inference is best supported?", options:[
          { t:"The feeling rising in her is stronger than her will; she cannot keep it down, however she tries", ok:true, why:"Her will is as “powerless” as her slender hands: the feeling wins." },
          { t:"She is fighting off a physical attacker.", why:"“It” is the approaching feeling, not a person." },
          { t:"She wants to feel free and welcomes it immediately.", why:"She is “striving to beat it back” at first." },
          { t:"Her hands are injured.", why:"The comparison is about powerlessness, not injury." }] } },
      { id:"t2", cat:"T", goal:5,
        a:{ prompt:"Which statement best describes how the story uses windows and doors?", options:[
          { t:"The open window frames the world of renewal Louise is drinking in, while the doors (Josephine kneeling at the closed door, Brently’s latchkey) mark the household’s claims that pull her back", ok:true, why:"The window lets in spring and “a very elixir of life”; the doors bring the household’s claims to her." },
          { t:"Windows always symbolize death in literature.", why:"A symbol means what this text builds." },
          { t:"Windows and doors are only realistic details with no pattern.", why:"The “elixir of life through that open window” and the closed door make a contrast." },
          { t:"The doors represent Louise’s love for Josephine.", why:"Josephine’s pleading at the door is a claim on her, not a sign of Louise’s affection." }] },
        b:{ prompt:"Which statement best describes how the story uses spring imagery?", options:[
          { t:"Images of new life (“aquiver with the new spring life”, “breath of rain”, “Spring days, and summer days”) mirror the new self awakening in Louise, so the season gives voice to what she cannot yet name", ok:true, why:"The spring images rise as her new self rises." },
          { t:"Spring images show that the story happens in April.", why:"That’s the plot level; ask what the images do." },
          { t:"Spring images show that nature does not care about people.", why:"The images align with Louise’s feeling rather than ignoring it." },
          { t:"Spring images are ironic because spring means sadness.", why:"Spring here means renewal." }] } },
      { id:"t3", cat:"T", goal:4,
        a:{ prompt:"“Every morning for a month, Callum checked the forecast for the day of the parade: rain, rain, sun, rain. He ironed his band uniform twice. On parade day the sky was a clean, polite blue. At noon the city cancelled the parade: a heat warning.” What is the irony?", options:[
          { t:"Situational irony: the weather he feared would ruin the day was not the threat; the perfect weather itself was", ok:true, why:"Events overturn his expectation: the danger came from the sky he hoped for." },
          { t:"Dramatic irony, because Callum knows something the city doesn’t.", why:"Callum knows less, not more." },
          { t:"Verbal irony, because “polite” is sarcastic.", why:"The narration’s word choice is wry, but the irony lies in the events." },
          { t:"There is no irony; parades are often cancelled.", why:"The point is the reversal of his expectation." }] },
        b:{ prompt:"“Dana spent the whole party hiding her new braces behind her hand. As she left, the host’s little brother grinned up at her, showing off his own new braces, and asked where she got such cool ones.” What is the irony?", options:[
          { t:"Situational irony: the thing she was ashamed of is the very thing someone admires", ok:true, why:"The outcome is the opposite of what she feared." },
          { t:"Dramatic irony, because the reader knew the brother had braces.", why:"The reader learns it at the same moment Dana does." },
          { t:"Verbal irony, because the brother is being sarcastic.", why:"Nothing suggests he doesn’t mean it." },
          { t:"Foreshadowing of a dental appointment.", why:M1 }] } },
      { id:"c1", cat:"C", goal:6,
        a:{ prompt:"Which sentence integrates and analyses a quotation most effectively, in MLA style?", options:[
          { t:"“Louise’s ‘feverish triumph’ (Chopin, par. 20) suggests that her joy has become almost an illness, quietly foreshadowing the heart that will fail.”", ok:true, why:"An embedded quotation, a correct citation, and analysis of what the words do." },
          { t:"“‘There was a feverish triumph in her eyes.’ This is a quote about her eyes.”", why:"Dropped in and not analysed." },
          { t:"“Louise has a feverish triumph in her eyes (Chopin, 1894, pg. 20).”", why:"Missing quotation marks; MLA uses “par.” here and no year." },
          { t:"“Chopin says Louise is happy.”", why:"Summary without evidence." }] },
        b:{ prompt:"Which sentence integrates and analyses a quotation most effectively, in MLA style?", options:[
          { t:"“Descending the stairs ‘like a goddess of Victory’ (Chopin, par. 20), Louise seems almost mythic, which makes her collapse a few lines later all the more sudden.”", ok:true, why:"An embedded quotation, a correct citation, and analysis of what the simile does." },
          { t:"“‘She carried herself unwittingly like a goddess of Victory.’ This is a simile.”", why:M6 },
          { t:"“Louise is like a goddess (Chopin).”", why:"No quotation marks or paragraph number." },
          { t:"“Louise walks down the stairs.”", why:M1 }] } },
      { id:"c2", cat:"C", goal:6,
        a:{ prompt:"Which is the strongest thesis for an essay on the story?", options:[
          { t:"“In ‘The Story of an Hour,’ Chopin uses images of spring, an open window and a final dramatic irony to reveal how marriage, even a kind one, could confine a woman’s selfhood in the 1890s.”", ok:true, why:"Arguable, specific, and it names the <em>how</em> and the <em>why</em>." },
          { t:"“Kate Chopin published ‘The Story of an Hour’ in 1894.”", why:"A fact, not an argument." },
          { t:"“The story has many literary devices.”", why:"Too vague to argue." },
          { t:"“Chopin proves that every marriage is a prison.”", why:"Overreaches beyond the evidence; Brently is described as kind." }] },
        b:{ prompt:"Which is the strongest thesis about point of view in the story?", options:[
          { t:"“By slipping from third-person narration into Louise’s own voice, Chopin lets readers share a joy no other character can see, so that the doctors’ final diagnosis lands as bitter irony.”", ok:true, why:"Arguable and specific: it names the technique, its effect and why it matters." },
          { t:"“The story is told in third person.”", why:"A fact, not an argument." },
          { t:"“Point of view is important in this story.”", why:"Too vague." },
          { t:"“The narrator is Kate Chopin herself.”", why:"Narrator and author are different." }] } },
      { id:"a1", cat:"A", goal:4,
        a:{ prompt:"A filmmaker adapting the story wants viewers to grasp the ending’s irony <strong>without narration</strong>. Which choice best does this?", options:[
          { t:"Cut from Louise’s triumphant face on the stairs to the latchkey turning, then to her collapse, then to the doctors calmly writing “joy”", ok:true, why:"The sequence lets viewers hold both truths at once." },
          { t:"Add a voice-over explaining the irony", why:"That uses narration, which the task rules out." },
          { t:"Skip the ending and fade to black after Louise whispers “free”", why:"Without the reversal, there’s no irony." },
          { t:"Show Brently weeping at the funeral", why:"That shifts the focus away from the gap between the doctors and the reader." }] },
        b:{ prompt:"A stage director wants the audience to feel the gap between what Josephine believes and what Louise feels. Which staging best does this?", options:[
          { t:"Split the stage: Josephine kneels pleading at the closed door while, on the other side, Louise stands in the window light, smiling", ok:true, why:"The audience sees both rooms; neither character sees the other." },
          { t:"Have Louise tell the audience she is happy", why:"That removes the subtlety the story builds." },
          { t:"Put both characters in one room, talking about the weather", why:"That loses the door between them." },
          { t:"Cut Josephine from the play", why:"Without her, there’s no contrast." }] } },
      { id:"a2", cat:"A", goal:3,
        a:{ prompt:"A student writing a story wants readers to sense a character’s secret relief <strong>without stating it</strong>. Which sentence uses free indirect discourse to do this?", options:[
          { t:"“The service ran long. The hymns ran long. The house would be quiet now—so wonderfully quiet.”", ok:true, why:"The narration slips into her feeling without saying “she felt relieved”." },
          { t:"“She thought, ‘I am relieved.’”", why:"Direct thought, stated outright." },
          { t:"“She was relieved.”", why:"Telling, not showing." },
          { t:"“I was relieved, I told myself.”", why:"First person." }] },
        b:{ prompt:"A student wants readers to sense a character’s private doubt about a decision. Which sentence uses free indirect discourse to do this?", options:[
          { t:"“He signed the form and slid it across the desk. Three years in a city he had never seen. Well. People did it all the time, didn’t they?”", ok:true, why:"The narration slips into his doubt (“Well. People did it all the time, didn’t they?”) without saying “he doubted”." },
          { t:"“He doubted his decision.”", why:"Telling." },
          { t:"“He thought, ‘I have doubts.’”", why:"Direct thought." },
          { t:"“‘I’m not sure about this,’ he said.”", why:"Dialogue." }] } }
    ]
  },
  task:{
    title:"A paragraph that reads closely", summary:"A paragraph that reads closely",
    statement:"<p>Write one analytical paragraph (150–250 words) arguing how <strong>one</strong> pattern, technique or detail in “The Story of an Hour” builds meaning. Read closely: quote precisely, cite, and tell your reader what the words <em>do</em>.</p><p class=\"tiny muted\">This checklist makes sure the parts are there. Your teacher reads the writing.</p><details class=\"alg pt-rubric\"><summary>How your teacher reads it (levels 1–4)</summary><div class=\"tbl-wrap\"><table class=\"topic-tbl\"><thead><tr><th scope=\"col\">Level</th><th scope=\"col\">The paragraph and the craft statement</th></tr></thead><tbody><tr><td>4</td><td>An insightful, arguable claim; precisely chosen and smoothly integrated quotations; analysis explains <em>how</em> the words work and <em>why</em> it matters; an elegant “so what”; the craft statement shows clear awareness of choices</td></tr><tr><td>3</td><td>A clear claim; well-integrated evidence; analysis mostly explains how; a reasonable “so what”</td></tr><tr><td>2</td><td>The claim is general; the evidence is partly dropped in or loosely linked; analysis slides into summary</td></tr><tr><td>1</td><td>No clear claim; quotations missing or uncited; mostly plot summary</td></tr></tbody></table></div></details>",
    checks:["The story and author are named", "Two or more quotations, each cited", "Quotations are introduced, not dropped", "Analysis verbs at work", "Length 150–250 words", "A “so what” at the end", "Craft statement"],
    tips:["Name the story in quotation marks, and name Chopin, in your first sentence.",
      "Add a second quotation, and cite each one with its paragraph number, like (Chopin, par. 5).",
      "Introduce each quotation with your own words: who says it, when, or why it matters.",
      "Use precise analysis verbs. “Suggests”, “foreshadows” and “reframes” tell the reader what the words do.",
      "Stay between 150 and 250 words. One paragraph, one idea, followed all the way.",
      "End by answering “so what?”: what does this pattern reveal about Louise, or about her world?",
      "In 40 words or more: which detail did you choose, and why that one?"],
    explainPrompt:"Craft statement: what choices did you make, and why?",
    explainLabel:"Craft statement",
    vocab:"In 40 words or more: which detail did you choose, and why that one?",
    checkLabel:"Check my paragraph",
    success:"Your paragraph has all its parts. Close readings can start almost anywhere. Here are three that start in very different places.",
    verbs:["suggests", "implies", "undercuts", "juxtaposes", "foreshadows", "reframes", "intensifies", "complicates", "reveals", "mirrors", "contrasts", "echoes"],
    focus:[
      { id:"windows", t:"windows and doors", look:"Look at pars. 4–6, 17, 18 and 21." },
      { id:"spring", t:"spring imagery", look:"Look at pars. 5–6 and 19." },
      { id:"fid", t:"free indirect discourse", look:"Look at pars. 9, 11, 14–16 and 18–19." },
      { id:"irony", t:"the irony of the ending", look:"Look at pars. 1–3, 12, 19 and 23." },
      { id:"hour", t:"the title’s “hour”", look:"Look at the title, the pace of pars. 9–20, and the sudden end in pars. 21–23." },
      { id:"own", t:"<em>your own</em>", look:"Choose one pattern, technique or detail, and follow it through the story." }],
    models:[
      { title:"Model response 1: windows and doors (pattern)",
        text:"In “The Story of an Hour,” Chopin builds a quiet architecture of freedom out of a window and a door. Upstairs, Louise sits “facing the open window” (Chopin, par. 4), and the spring she sees there, trees “all aquiver with the new spring life” (par. 5), mirrors the life stirring in her before she can name it. Later she is “drinking in a very elixir of life through that open window” (par. 18), while her sister kneels “before the closed door” (par. 17), begging her to come out. The contrast suggests two worlds: the window opens onto possibility, the door onto the household’s claims. When Brently’s latchkey turns in “the front door” (par. 21), the old world simply walks back in. Even the “comfortable, roomy armchair” (par. 4) faces outward, toward the only opening she has. Chopin’s floor plan reveals how narrow the space for a married woman’s self could be: one window wide, and closed from the other side." },
      { title:"Model response 2: free indirect discourse (technique)",
        text:"Chopin’s narrator speaks in the third person, but at the story’s turning point the narration starts to speak in Louise’s own voice, and that shift lets readers share a joy no one in the house can see. After she whispers “free, free, free!” (Chopin, par. 11), the sentences grow short and exclamatory: “Often she had not. What did it matter!” (par. 15). No neutral narrator would exclaim like this; the voice is hers, slipped inside the narration without quotation marks. The clipped sentences intensify the feeling, as if her thoughts were racing ahead of the narration. This free indirect discourse places us, alone, in the room with her, while Josephine is shut outside “imploring for admission” (par. 17). As a result, when the doctors announce that she died “of the joy that kills” (par. 23), the reader alone knows what that joy was. The technique turns us into witnesses, which makes the ending’s irony personal." },
      { title:"Model response 3: the irony of the ending (structure)",
        text:"The last sentence of “The Story of an Hour” reaches back and rewrites the first. Chopin opens by explaining that Louise was “afflicted with a heart trouble” and that “great care was taken” to protect her from grief (Chopin, par. 1). By the end, that care looks badly misplaced. Even Richards’s “second telegram” (par. 2), sent to confirm the news, turns out to be wrong, so every safeguard in the opening fails. When the doctors decide she “died of heart disease—of the joy that kills” (par. 23), they assume her joy was at her husband’s return. The reader knows her “monstrous joy” (par. 12) was the prospect of living “for herself” (par. 14). The irony reframes her heart trouble as something more than medical: a heart with no room of its own. Chopin’s structure suggests that the danger to Louise was never grief; it was the return of a life she had, for one hour, escaped." }
    ]
  },
  cards:[
    ["Close reading", "Slow attention to how a text makes meaning, at the levels of whole, paragraph, sentence and word."],
    ["Third person limited", "The narrator stays close to one character’s mind. Chopin’s narrator stays close to Louise."],
    ["Free indirect discourse", "Third-person narration that carries a character’s own voice without quotation marks. “What did it matter!” (Chopin, par. 15)"],
    ["Reported thought", "The narrator tells us what a character thinks. “She knew that she would weep again…” (par. 13)"],
    ["Dramatic irony", "The reader knows what characters don’t. “of the joy that kills” (par. 23)"],
    ["Situational irony", "The opposite of what’s expected happens. “She breathed a quick prayer that life might be long.” (par. 19)"],
    ["Verbal irony", "Saying the opposite of what you mean, e.g. “Lovely weather,” in a storm."],
    ["Foreshadowing", "Hints of what’s to come. “afflicted with a heart trouble” (par. 1)"],
    ["Image pattern", "Repeated images that build meaning, e.g. the open window (pars. 4, 18) and the closed door (par. 17)."],
    ["Setting as mirror", "Setting that reflects or contradicts a character’s inner life. “all aquiver with the new spring life” (par. 5)"],
    ["Inference", "A conclusion the text implies but doesn’t state. “lines bespoke repression and even a certain strength” (par. 8)"],
    ["MLA citation by paragraph", "When a source numbers paragraphs: (Chopin, par. 5); for several, (Chopin, pars. 5–6)."]
  ]
};
