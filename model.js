// The working model. Every box we have agreed on or proposed, with the contents listed.
window.MODEL = {
  env: {
    title: "environment", z: -34, wall: 0xB08240,
    // FIVE CELLS, THREE ACROSS AND TWO UNDER THEM. The top row is everything
    // that comes and goes: where she is, the conditions she is in, and what
    // happened. The bottom row is the standing floor, which holds for months.
    // The box is wider than the person box and that is the honest shape: the
    // environment holds five cells and the person holds four.
    rows: 2, cols: 3,
    cells: [
      // THE MOMENT. Changes within a day, so it can split a baseline in two:
      // her heart at home against her heart at work.
      { name: "around you", col: 0, row: 0, groups: [
        // Commute is not a different kind of thing from home and work, it is the
        // third place she is, and it is the useful one: a repeated, reliable,
        // mildly demanding stretch that happens twice a day without anybody
        // asking her to do it, which makes it a response probe like standing up.
        { n: "where you are", shape: "partition",   proposed: true, items: ["home", "the workplace", "outside", "commuting"] },
        { n: "what it is like", shape: "dial", proposed: true, items: ["nature", "crowds"] },
        // "Who you live with" used to sit here and it does not belong in the
        // moment: it changes when somebody moves in or out, which is months or
        // years. It is over in how life stands now, beside relationship quality.
        //
        // What is left is genuinely the moment. "Alone or not" is deliberately
        // NOT a daily tap: a tap gives one answer for a whole day and aloneness
        // changes hour to hour, so "was she alone today" is true of almost
        // nobody. It is asked in the moment instead, riding along with a prompt
        // the engine is already sending because it cannot read something.
        // "Alone or not" used to sit here and it is gone. Asked in the moment it
        // produced twelve instants over ninety days, which is thirty six minutes
        // of labelled time out of a hundred and thirty thousand, so it could
        // never become a context a baseline splits on: that needs seven days in
        // the context and this had none. It cost the most on her hardest
        // afternoons, which is where asking feels most like being watched, and
        // bought a number nothing could use. If the companion wants to know, it
        // asks in conversation and the answer stays with that conversation.
        // A DAILY TAP. A tap is a good instrument for a total over a day and a bad
        // one for an instant, so this is the total and nothing else is here.
        { n: "contact", shape: "dial",         said: ["time with others", "someone who feels safe"],
          items: ["time with others", "someone who feels safe"] },
        // WHAT IS WITHIN REACH. Not what she took, which is behaviour, and not
        // what is in her blood, which is state. Whether the thing was around her
        // at all. It earns its place twice over: the gap between available and
        // taken is a real pattern, and availability is one of the very few things
        // in the environment a person can actually change, which makes it a lever
        // rather than only a record.
        { n: "what is within reach", shape: "dial", proposed: true,
          said: ["medication", "caffeine", "nicotine", "alcohol"],
          items: ["medication", "caffeine", "nicotine", "alcohol"] }
      ]},
      { name: "conditions", col: 1, row: 0, groups: [
        { n: "light", shape: "dial",       proposed: true, items: ["daylight hours", "season"] },
        // NOT a thing she does. Every rhythm in this engine is measured on clock
        // time, on a circle, so a zone she has moved into changes what her 23:10
        // means. Left unknown, two hours east reads as her rhythm coming loose
        // when nothing about her has changed. It is a correction applied before a
        // rhythm can be read, which is why it sits with the date and the place.
        { n: "time zone", shape: "dial",   proposed: true, items: ["offset from home", "how long since it changed"] },
        // OUTDOORS. The room she is in is a sensor reading and lives in the blue
        // box; this is the weather, and it only reaches her while she is out, so
        // it is read against "outside" and "commuting" rather than the whole day.
        // A LEVEL, read against her usual and against what a body sleeps well in.
        // Humidity is folded in here rather than kept apart, because sixty per
        // cent on its own means nothing: damp cold and dry cold are different
        // weather and a body knows the difference.
        { n: "temperature", shape: "dial", proposed: true, items: ["cold", "damp cold", "hot", "close"] },
        // Free from the date and the city, like the daylight. Pressure is here
        // because some people genuinely react to it and nothing else in this map
        // would ever show that: not collecting it is the model deciding their bad
        // days are noise. It costs about a hundredth of a standard deviation on
        // the bar everything else has to clear, which is the measured price of
        // comparing a few more things.
        { n: "noise", shape: "dial",       proposed: true, items: ["loud", "quiet"] },
        // THE ONE ABSOLUTE THRESHOLD IN THE WHOLE MODEL. Everything else here
        // asks whether something is unusual FOR HER. This asks whether it is bad
        // for lungs, and that answer is the same for everybody. Somebody who has
        // lived with a Krakow winter for ten years is used to the smog in the
        // sense that it no longer surprises her; her lungs are not. Measured her
        // way, a bad winter would read as her normal and disappear.
        //
        // "days above the limit" is here because exposure adds up: one day at
        // thirty and ten days at thirty are not the same thing.
        { n: "air", shape: "dial",         proposed: true,
          items: ["over the health limit", "days above the limit"] }
      ]},

      // THE STANDING FLOOR. Holds for weeks or months. Nothing senses any of it,
      // so every value here is one she tells us, and it is believed until she says
      // otherwise. It CANNOT split a baseline: if she has been housed all year
      // there is no unhoused half of her to compare against. What it does is move
      // where her whole normal sits, and the only moment it is readable inside one
      // person is when it changes. These are the needs in the person box, read as
      // standing facts about a situation rather than as moment to moment needs.
      { name: "environmental safety", col: 0, row: 1, groups: [
        // TWO HALVES, NOT THREE GROUPS, and they are the pair needs already uses.
        //
        // There used to be a third group called "not scored yet", a holding pen
        // for eight things nobody had decided how to score. Every one of them
        // landed cleanly on one of these two sides, and each already sits on
        // that side over in NEEDS: water, warmth, movement and medical care are
        // physical, identity coherence, freedom to express, limits and fairness
        // are emotional. So the pen was hiding the structure rather than holding
        // anything. Dissolved 9 October 2026.
        //
        // "Not scored yet" was then carried per item for a while, so those eight
        // kept drawing dashed. The founder removed that too on 9 October 2026:
        // the pen is gone and so is every trace of it, and these twenty are now
        // twenty things on the same footing.

        { n: "the ground under you", shape: "dial", said:
            ["food security", "housing stability", "physical safety",
             "financial baseline", "sleep opportunity",
             "water", "movement", "medical care"],
          items:
            ["food security", "housing stability", "physical safety",
             "financial baseline", "sleep opportunity",
             "water", "movement", "medical care"] },
        // THREE THINGS WERE CUT FROM THE STANDING FLOOR on 9 October 2026, by the
        // founder, after she asked what each of them meant and the answers were
        // not good enough.
        //
        //   "a shift rota"        arrived here the same morning from demands.
        //   "who is treating you" arrived the same way.
        //   "warmth"              came out of the dissolved holding pen, and
        //                         collided with temperature in conditions.
        //
        // Warmth still exists in NEEDS, in the person box, where it is a need
        // rather than a standing fact about a place. That one was not cut.
      ]},

      { name: "meaning and agency", col: 1, row: 1, groups: [
        { n: "the life on top of it", shape: "dial", said:
            ["work quality", "relationship quality", "play access",
             "who you live with", "who is in reach",
             "identity coherence", "freedom to express", "limits", "fairness"],
          items:
            ["work quality", "relationship quality", "play access",
             "who you live with", "who is in reach",
             "identity coherence", "freedom to express", "limits", "fairness"] }
      ]},

      // THINGS THAT HAPPEN. Dated, then over. These are what a baseline judges,
      // never the yardstick it judges by.
      //
      // A NAME APPEARING IN TWO BLOCKS IS NOT A DUPLICATE. The block is half the
      // question, so the same word asks a different thing in each one. Medication
      // is the clean case: in the environment a prescription exists, in behaviour
      // she took it today, in state it is a level in her blood. The GAPS between
      // those three are the useful part. Prescribed and not taking it, or taking
      // it with the level never rising, are both real and both invisible if the
      // three are collapsed into one. Founder's rule, 9 October 2026, after this
      // file nearly lost the four substances to a tidy-up.
      { name: "what happens", col: 2, row: 0, groups: [
        // Workload stays, and it is a SPIKE rather than a level: a heavy stretch
        // that starts and finishes. Read as a level it would be the yardstick and
        // belong next door; read as a stretch it is exactly what this cell is for.
        { n: "demands", shape: "episode",     items: ["deadlines", "workload"] },
        // One item, not three. Travel, a trip and a stay elsewhere were three
        // names for being away from home, and a trip now carries all of it.
        { n: "away", shape: "episode",        items: ["a trip"] },
        // SPLIT BY HOW OFTEN, because the two kinds are used differently.
        //
        // A RARE event is a marker. You point at it and say that was the week it
        // changed. It can never be a context a baseline splits on, because there
        // are no days inside it to average.
        //
        // An EVERYDAY one is a context. There are days in it and days out of it,
        // so a baseline can be cut in two and the halves compared. That is the
        // whole reason the second group exists.
        // A ROTA IS IN THE MODEL TWICE, ON PURPOSE, and it is the medication case
        // again. WHICH rota she is on is standing, shapes every baseline under
        // it, and is over in how life stands. The rota CHANGING is dated, lands
        // on one day, and wrecks the fortnight after it, so it is here with the
        // other rare markers. Split on 9 October 2026 after it was moved whole
        // and the dated half went missing.
        { n: "life events", shape: "episode", proposed: true,
          items: ["loss", "a move", "a job change", "a rota change"] },
        // BOTH DIRECTIONS, ON ORDINARY DAYS. Everything that happened to this
        // person used to be bad, which meant the model could explain a terrible
        // Thursday and had nothing at all to say about a good one.
        //
        // Read SMALL or these do not work. Good news is something that went her
        // way, a problem that resolved itself, a message she was glad to get, NOT
        // a life-changing announcement. Kindness is a colleague covering for her,
        // not a grand gesture. Read big they happen three times in ninety days
        // and fail the test this group was built on. Founder, 9 October 2026.
        { n: "ups and downs", shape: "episode", proposed: true,
          items: ["bad news", "good news", "conflict", "someone was kind"] },
        // MOMENTS, NOT LEVELS, and that is the whole reason this group is not
        // folded into conditions next door. `conditions / noise / loud` is a
        // level held over a stretch: the room was loud for an hour. A sudden
        // loud sound is an instant, it starts and stops, and it can land in a
        // quiet room. Collapsing the two would lose the bang in the quiet room,
        // which is exactly the kind of thing a startled body is reacting to.
        //
        // An EPISODE because each one starts and stops, and because several can
        // be true at the same moment: a thing can fall, flash and be loud all at
        // once, so no partition could hold them.
        // OPEN. Her check in offers "Something else" here, and the word she
        // types is stored and then shown back to her as a tile every time she
        // marks a moment. Founder, 26 October 2026. `open` is what makes the
        // engine accept a word that is not on this list; everywhere else a
        // value off the map is a typo and is refused.
        { n: "sudden things", shape: "episode", open: true,
          items: ["a sudden loud sound", "a sudden bright light", "an unexpected touch",
                  "sudden movement nearby", "losing balance", "immediate physical danger"] },
        // PRESSURE FROM THE SITUATION SHE IS IN, as against the demands group
        // above, which is workload and deadlines: how much there is to do. The
        // two are not the same and a body answers them differently. She can have
        // a great deal to do and not be stressed, and be badly stressed at work
        // with little to do.
        //
        // THE NAME IS NARROWER THAN THE CONTENTS, AND IS LEFT THAT WAY ON
        // PURPOSE. It began as being looked at, which is what public speaking
        // and a difficult interaction are. `work pressure` is not that: it is a
        // stressful stretch at work, and the founder corrected a mapping of it
        // onto `demands / workload` on 27 October 2026, because hers is about
        // the stress and not the volume. A group name is part of every address,
        // so renaming this one would orphan anything already stored here. The
        // name stays and this comment carries the truth. Do not "fix" it.
        //
        // OPEN. Her check in offers "Something else" here, and the word she
        // types is stored and then shown back to her as a tile every time she
        // marks a moment. Founder, 26 October 2026. `open` is what makes the
        // engine accept a word that is not on this list; everywhere else a
        // value off the map is a typo and is refused.
        { n: "social pressure", shape: "episode", open: true,
          items: ["public speaking", "a difficult interaction", "work pressure"] },
        // THE OTHER DIRECTION OF BEING WITH PEOPLE, and it is its own pipe for
        // the reason she gave on 19 October 2026 about positive excitement: "if
        // you want it later it becomes its own pipe, not a second value inside
        // distress. They are different things and one is not the opposite of
        // the other." The same holds here. This is not the happy end of
        // `social pressure` and it is not a fifth flavour of `ups and downs`.
        //
        // IT IS IN THE ENVIRONMENT, NOT IN THE PERSON, because it is a thing
        // that happened with other people. What it did to her body is a state
        // and is recorded over in `person / state / positive excitement`. The
        // two are deliberately separate, so the model can hold an evening with
        // friends that lifted her and an evening with friends that did not.
        //
        // NOT folded into `ups and downs / someone was kind`: kindness is
        // something another person did for her, and this is time among people
        // that lifted her, which can happen with nobody doing anything for her
        // at all.
        //
        // The group name is the one piece of wording here that is not hers:
        // she named the value, and a group needed a name to hold it.
        { n: "social stimulation", shape: "episode",
          items: ["positive social stimulation"] },
        // "a prescription started" is the dated half of medication. Whether it is
        // within reach on a given day is a condition, and lives in around you.
        { n: "care", shape: "episode",        items: ["appointments", "a prescription started"] }
      ]}
    ]
  },

  person: {
    title: "a person", z: 47, wall: 0x857AB4,
    cells: [
      { name: "state", col: 0, row: 0, groups: [
        { n: "asleep", shape: "partition",            items: ["deep", "light", "rem", "awakenings"] },
        // AWAKE IS NOT A CONTAINER. It used to hold being still, moving and
        // sport, which made sport a kind of awakeness. The founder split it on
        // 12 October 2026: being awake and doing sport are both true at once
        // and neither is inside the other. So awake says only that she is
        // awake, and what her body is doing is its own group beside it.
        { n: "awake", shape: "partition",             items: ["awake"] },
        // WHAT THE BODY IS DOING, as a sensor sees it. The told half of the
        // same four lives over in behaviour/movement, because what she chose
        // and what her body did are different facts and the gap between them
        // is the point: stillness she did not choose is freeze.
        //
        // "sport" became "hard sport" and "gentle sport" arrived with it. One
        // word could not carry both, and they belong in different places: hard
        // sport is real work, gentle sport behaves like stillness from the
        // inside however much it looks like sport from the outside.
        { n: "what the body is doing", shape: "partition",
          items: ["being still", "moving", "hard sport", "gentle sport"] },
        { n: "autonomic tone", shape: "dial",    items: ["sympathetic", "parasympathetic"] },
        // Posture is a PARTITION, not an episode: she is always in one of
        // these, so a gap means nobody looked rather than nothing happened.
        // It is here because it moves both autonomic branches mechanically and
        // a wrist cannot see it: the band knows where her forearm is, not
        // where her trunk is. Changing posture is a separate thing and lives
        // as an event under behaviour / movement.
        { n: "posture", shape: "partition",
          items: ["sitting", "reclined", "standing", "lying"] },
        { n: "cycle", shape: "partition",             items: ["menstrual", "follicular", "ovulation", "luteal"] },
        { n: "pregnancy", shape: "episode",         items: ["how far along"] },
        { n: "illness", shape: "episode",           items: ["fever", "infection"] },
        { n: "chronic illness", shape: "episode",   items: ["long running, moves your normal"] },
        { n: "pain", shape: "episode",              items: ["acute", "ongoing", "injury"] },
        { n: "hunger", shape: "episode",            items: ["fed", "hungry", "how long since eating"] },
        { n: "substances", shape: "dial",        items: ["medication level", "caffeine", "alcohol", "nicotine", "withdrawal"] },
        { n: "window", shape: "partition",            items: ["in", "hyper", "hypo"] },
        { n: "felt safety", shape: "partition",       items: ["safe", "unsafe"] },
        // WHAT SHE FEELS, ASKED AS FACTS RATHER THAN AS A FRAMEWORK. Her call,
        // 28 October 2026: the window of tolerance question asks her to classify
        // herself, in a theory, and these ask plainly what her experience is like
        // instead. They are asked immediately before the window question, every
        // time, on every activation mark, and nothing chooses between them: "I
        // don't want to invent any algorithm for showing how we show these
        // questions. Let's show all of them at once."
        //
        // THE WHOLE POINT IS THAT THE INTERPRETATION COMES AFTER. The window
        // answer should one day be predictable FROM these, which only works if
        // these are never contaminated by it. So the order on the screen is not a
        // layout choice: facts first, classification second, and never the reverse.
        //
        // WORDED TO AVOID TELLING HER WHAT SHE IS. Her own notes beside each one
        // are constraints and not commentary: the perception question captures a
        // change "without using clinical terms such as derealization"; the self
        // one "without telling the participant that they are detached from their
        // body"; the thoughts one distinguishes following them from how fast they
        // move; the agency one asks about choosing "without assuming physical
        // mobility or equating agency with activity". They live verbatim in
        // lib/neutral-questions.ts in the phone app, pinned letter for letter.
        //
        // A DIAL EACH, BECAUSE EVERY ONE OF THEM IS ALWAYS TRUE OF HER. A gap
        // means nobody asked, never that the dimension stopped existing.
        //
        // HOW THIS SITS BESIDE ITS THREE NEIGHBOURS, which is the whole reason it
        // is its own group rather than items scattered into theirs:
        //   `felt safety` above is a PARTITION, safe or unsafe, WHICH state she is
        //     in. "safe or threatened" here is HOW STRONGLY. Two different
        //     questions, so two owners; and a five point answer squeezed into two
        //     values would be a threshold, which is an interpretation stored as a
        //     fact, which is the one thing this whole group exists to prevent.
        //   `window` is whether coping held. These are what it was like.
        //   `autonomic tone` is a sensor reading. These are hers to say.
        //
        // TWO OF HER TWELVE ARE NOT HERE AND THAT IS THE RULE WORKING. "What do
        // you notice in your body" is already `named sensations`, and "when did
        // this begin" is already the mark's own time. A second pipe for either
        // would split the same answer in half.
        { n: "felt experience", shape: "dial",
          items: ["pleasantness", "subjective activation",
                  "bodily sensation salience", "attentional control",
                  "connection and presence", "surroundings as usual",
                  "sense of self as usual", "following thoughts",
                  "choosing what to do next", "safe or threatened"] },
        // DISTRESS IS A STATE, and it took being wrong twice to see it. It was
        // first put in behaviour/movement, as a fourth answer to "what are you
        // doing", which it is not: it says nothing about what she is doing.
        //
        // It was then argued to be the same thing as window/hyper, and it is
        // not that either. Founder, 12 October 2026: distress can be hypo, the
        // shut down and numb kind, and it can sit inside the window when
        // somebody is managing it. So it crosses the arousal axis rather than
        // sitting on it, and folding it into `window` would lose exactly the
        // cases that matter most.
        //
        // Its own pipe, then. An episode, because it starts and stops and
        // several states are true at once. Told only, because nothing reads
        // distress off a wrist: a high heart rate is a high heart rate, and
        // which of exercise, fear and shutdown it belongs to is hers to say.
        { n: "distress", shape: "episode", said: ["distressed"],
          items: ["distressed"] },
        // WHERE THE FLASHBACK CAME FROM, in her words:
        //   external   caused by the environment
        //   internal   caused by a thought or a memory
        //   unknown    hard to define
        //
        // The three are the useful split because they point at different
        // handling: an external one can be met by changing the room, an internal
        // one cannot. `unknown` is here on purpose rather than as a tidy-up: the
        // honest answer much of the time is that she cannot tell, and without a
        // word for that the record would either be guessed or left empty.
        //
        // An EPISODE: it starts and stops, and more than one can be running.
        // OPEN. Her check in offers "Something else" here, and the word she
        // types is stored and then shown back to her as a tile every time she
        // marks a moment. Founder, 26 October 2026. `open` is what makes the
        // engine accept a word that is not on this list; everywhere else a
        // value off the map is a typo and is refused.
        { n: "flashback", shape: "episode", open: true,
          items: ["external", "internal", "unknown"] },
        // DEPLETION, in her words, verbatim: "A state in which the person
        // experiences reduced capacity to cope with demands, recover or maintain
        // their usual functioning."
        //
        // A DIAL, not an episode, because it is graded. There is no moment it
        // switches on; there is more of it or less of it, and the useful question
        // is how much capacity is left rather than whether depletion is present.
        //
        // DEPLETION IS NOT DISTRESS, and nothing may derive one from the other.
        // Someone can feel exhausted with no acute distress at all, and someone
        // can be acutely distressed without having been depleted first. They are
        // two separate readings about the same body and either can move while the
        // other sits still.
        //
        // IT IS ALSO NOT `named sensations / tired out`. That one is a sensation
        // she reports feeling. This one is capacity: what she still has to spend.
        // A person can report feeling tired and still have capacity, and can
        // report feeling fine with very little left.
        //
        // FIVE KINDS, AND THEY ARE HERS. They come from her own check in design
        // of 26 October 2026, not from a taxonomy anybody found: her screen
        // offers these five as tiles and her intensity answer rides on whichever
        // one she picks. They are five kinds of ONE graded thing, which is why
        // they are five values in one dial rather than five pipes.
        //
        // Her screen capitalises them as tile labels. These are the stored
        // addresses, so they keep the model's own lower case, like every other
        // value in this file. The phone holds its display label separately and
        // must send these strings character for character: `records.check`
        // refuses an address the map does not carry.
        //
        // The same words reach her screen as an information panel in her own
        // wording: "You can feel depleted without feeling stressed. This
        // includes physical, mental or emotional exhaustion."
        // OPEN. Her check in offers "Something else" here, and the word she
        // types is stored and then shown back to her as a tile every time she
        // marks a moment. Founder, 26 October 2026. `open` is what makes the
        // engine accept a word that is not on this list; everywhere else a
        // value off the map is a typo and is refused.
        { n: "depletion", shape: "dial", open: true,
          items: ["low energy", "mentally tired", "reduced capacity",
                  "need more rest than usual", "emotionally drained"] },
        // POSITIVE STRESS, which until now was recorded nowhere in this model.
        // Everything on the activation side was unpleasant, so a body lit up by
        // something good read as a body in trouble.
        //
        // ITS OWN PIPE, decided 19 October 2026: "if you want it later it becomes
        // its own pipe, not a second value inside distress. They are different
        // things and one is not the opposite of the other." So this is not a
        // happy end of a distress scale. A person can be excited and distressed
        // in the same hour, and neither reading cancels the other.
        //
        // An EPISODE: each one starts and stops, and several can overlap.
        // OPEN. Her check in offers "Something else" here, and the word she
        // types is stored and then shown back to her as a tile every time she
        // marks a moment. Founder, 26 October 2026. `open` is what makes the
        // engine accept a word that is not on this list; everywhere else a
        // value off the map is a typo and is refused.
        { n: "positive excitement", shape: "episode", open: true,
          items: ["excitement or anticipation", "joyful surprise",
                  "enthusiasm or eagerness", "pleasant novelty"] },
        // DEEP RELAXATION, in her words, verbatim: "a physiological state of deep
        // relaxation, accompanied by a sense of safety -- that feeling of being so
        // relaxed that your body almost melts, like butter." A moment when the body
        // feels soft and loose, there is no need to brace or stay alert, breathing is
        // slow and effortless, and there is little internal pressure to act.
        // Founder, 27 October 2026.
        //
        // ITS OWN PIPE AND NOT THE QUIET END OF SOMETHING ELSE. It is not low
        // distress, it is not low depletion, and it is not the parasympathetic
        // dial: that dial is a reading off a sensor and this is a state she
        // reports. A person can be parasympathetically settled and not feel
        // remotely safe, and the gap between those two is exactly what this pipe
        // exists to catch.
        //
        // AN EPISODE, like the distress and the excitement either side of it: it
        // starts and stops, there can be several in a day, and a gap means it was
        // not happening rather than nobody looking.
        //
        // ONE VALUE, AND THE DEPTH TRAVELS AS THE AMOUNT. Her screens ask how
        // deeply, not which kind, so there is nothing to split the value on and a
        // grid of invented sub-kinds would be a second question she never asked.
        // Same shape as `distress` beside it, which is one label graded by amount.
        //
        // NOT `said`, DELIBERATELY. Her own brief says this is reported rather than
        // read off the band, "and the model then learns which physiological patterns
        // accompany it", which is the whole experiment: measure automatically where
        // confidence is high, ask where it is low, and learn until it is high. Her
        // correction, 26 October 2026. Marking it told-only would close the door
        // this pipe was opened to walk through.
        { n: "deep relaxation", shape: "episode", items: ["deeply relaxed"] },
        // THE THREE LAYERS THE CHECK IN ASKS FOR, as one pipe each rather than
        // one per word. The pipe is the group and the words live inside it, so
        // sixteen sensations is still one pipe and the picture stays readable.
        //
        // EPISODES, like pain and named conditions beside them, because several
        // are true at once and none of them is true all the time. They could not
        // be folded into felt safety for that reason alone: a partition holds
        // exactly one value at every moment, and a headache and shallow
        // breathing happen together.
        //
        // SENSATION AND EMOTION ARE SEPARATE because a sensor could one day
        // corroborate a sensation and never an emotion. Trembling hands is the
        // same event the accelerometer calls trembling, so keeping them apart
        // leaves room to ask whether what she feels matches what was measured.
        //
        // `open` means she may add her own word. Everywhere else in this model a
        // value not on the map is a typo and is refused, which is the right
        // default and the wrong one here: the words for a body are hers.
        { n: "named sensations", shape: "episode", open: true,
          items: ["tired out", "trembling hands", "hot", "heavy stomach",
                  "headache", "shallow breathing"] },
        { n: "named emotions", shape: "episode", open: true,
          items: ["anxious", "ashamed", "guilty", "afraid", "scared", "angry"] },
        { n: "named conditions", shape: "episode",  items: ["burnout", "depression", "anxiety", "a diagnosis"] }
      ]},
      { name: "needs", col: 1, row: 0, checkin: true, groups: [
        { n: "physical", shape: "dial",  items: ["food", "water", "sleep and rest", "housing", "warmth",
                                  "physical safety", "movement", "medical care"] },
        { n: "emotional", shape: "dial", items: ["attachment security", "autonomy and competence",
                                  "identity coherence", "freedom to express",
                                  "spontaneity and play", "limits", "fairness"] }
      ]},
      { name: "behaviour", col: 0, row: 1, groups: [
        { n: "bed", shape: "episode",             said: ["went to bed", "got out of bed"],
                                items: ["went to bed", "got out of bed"] },
        // THE FIRST THREE ARE SENSED, THE LAST FIVE ARE TOLD. She says what she
        // chose to do when the check in asks; the band says what her body did.
        // Both are behaviour, so both are here, and the disagreement between
        // this and state/what the body is doing is where the freeze shows.
        { n: "movement", shape: "episode",
          said: ["being still", "moving", "doing chores",
                 "doing hard sport", "doing gentle sport"],
          items: ["steps", "walking", "standing up",
                  "being still", "moving", "doing chores",
                  "doing hard sport", "doing gentle sport",
                  // The moment of changing posture, which is a different fact
                  // from the posture she ends up in. The change itself moves
                  // the heart for a minute or two, and standing up moves it
                  // most of all.
                  "sitting down", "lying down", "reclining",
                  "changed posture"] },
        // "a snack" earns a value of its own rather than being filed as a meal.
        // Her own 21 October: a chocolate and a banana. The shift after a meal
        // is large and runs about three hours, which is why `food` is a
        // covariate at all, and a model that reads a banana as dinner will wait
        // for a shift that never comes.
        { n: "eating", shape: "episode",          proposed: true, said: ["taking a meal", "a snack", "skipping a meal"],
                                items: ["taking a meal", "a snack", "skipping a meal"] },
        { n: "taking things", shape: "episode",   said: ["medication", "missed a dose", "caffeine", "nicotine", "alcohol"],
                                items: ["medication", "missed a dose", "caffeine", "nicotine", "alcohol"] },
        // Work is a place AND an activity, so it is in the model twice on purpose.
        // "the workplace" is a place, in the environment box. "working" is this,
        // a stretch of her doing it, which can run at the workplace or at home.
        { n: "working", shape: "episode", said: ["started working", "stopped working", "working"],
          items: ["started working", "stopped working", "working"] }
      ]},
      { name: "reasoning", col: 1, row: 1, checkin: true, groups: [
        { n: "what you made of it", shape: "episode", proposed: true, items: ["the day", "the week"] },
        { n: "what you expect", shape: "episode",     proposed: true, items: ["of tomorrow"] },
        // THE THIRD LAYER, and it is reasoning rather than state. A feeling is
        // something she is in; a belief is something she is concluding. They
        // behave differently over time, and that difference is the whole of how
        // she works: "afraid" passes in an hour, "I will be rejected" can sit
        // under months of readings and colour how every one of them is read.
        //
        // Open, for the same reason as the two in state. Her own words about
        // herself are the last thing a fixed list should be allowed to refuse.
        { n: "named thoughts", shape: "episode", open: true,
          items: ["I will not manage", "I will be rejected",
                  "I am worse than them", "I am not doing enough"] }
      ]}
    ]
  },

  envmark: {
    // ONLY WHAT A SENSOR READS. Nothing else belongs in a marker box, and two
    // things used to: "place" and "weather". Weather is a lookup from a public
    // feed by city, which is not a measurement of anything near her, and it is
    // already where it should be, in the conditions. "Place" was the same
    // mistake wearing a sensor's name: where she is comes from her telling us,
    // and "time at home" is already drawn properly in the environment box.
    //
    // What is left is the hardware, and nothing but: a light meter, a
    // microphone, a thermometer facing away from the skin.
    title: "environment markers", z: -34, wall: 0x4A8CCB, above: true,
    cells: [
      { name: "what the sensor reads", col: 0, row: 0, groups: [
        { n: "light", shape: "dial",   proposed: true, items: ["lux at the wrist", "how much daylight"] },
        { n: "sound", shape: "dial",   proposed: true, items: ["ambient level", "quiet or loud"] },
        // A band can carry TWO temperature sensors: one against the skin and one
        // facing out. The outward one is not a nice extra, it is what makes the
        // inward one readable, because a skin reading on a cold night and a warm
        // night are not the same measurement. The gap between them is the number
        // worth keeping, and nothing in the model had it.
        { n: "temperature", shape: "dial", proposed: true, items: ["the room", "the gap from her skin"] },
        // A CHANGE, AND ONLY A CHANGE. There is no level of pressure anybody has
        // a reaction to: 1005 is not a thing that happens to a person. What
        // happens is a fall of five or so in a day, and that is where the
        // migraine evidence sits. "Low and staying low" is here because the
        // fibromyalgia work found a level effect over a spell, not a morning.
        //
        // TWO INSTRUMENTS, AND THE READING MUST SAY WHICH. Her phone may have a
        // barometer, and then it reads her own air, including her altitude, and
        // nothing about where she is leaves the handset. But NOT EVERY PHONE HAS
        // ONE: they are common on better Android models and uncommon on cheap
        // ones. Where there is none, the nearest weather station stands in,
        // which is fine for pressure because a front is hundreds of kilometres
        // wide, and useless for altitude. A cohort that mixes the two without
        // saying so is pooling two different measurements.
        //
        // Read it while she is ASLEEP. The sensor resolves about a tenth, and a
        // flight of stairs is a third, so her walking upstairs looks like
        // weather. Asleep she is not changing floors and what is left is the sky.
        // A low sample rate also matters: a fast barometer stream has been shown
        // to leak finger taps on the screen.
        { n: "pressure", shape: "dial",    proposed: true,
          items: ["fell in 24 hours", "rose in 24 hours", "low and staying low"] }
      ]}
    ]
  },

  mark: {
    title: "body markers", z: 47, wall: 0x4A8CCB, above: true,
    cells: [
      { name: "what the sensor reads", col: 0, row: 0, groups: [
        { n: "heart", shape: "dial",       items: ["resting rate", "rate across the day"] },
        { n: "variability", shape: "dial", items: ["RMSSD", "SDNN"] },
        // Pulse height is how the accelerator is read: more sympathetic
        // traffic squeezes the small vessels of the hand, so the pulse shrinks.
        // It is a sensor reading in its own right and not part of "heart",
        // which is about rate.
        { n: "vessels", shape: "dial",     items: ["pulse height", "perfusion index"] },
        // BREATHING, READ OFF THE CHEST STRAP. Her call, 28 October 2026, after
        // reading how a wrist watch estimates breathing from its optical pulse:
        // "Can we do smth similar using ECG? So we explore breathing patterns as
        // detailed as possible?"
        //
        // WHY THIS IS NOT THE WRIST'S THREE CLUES WITH A BETTER SENSOR. A watch
        // infers breathing from indirect effects on blood flow. A chest strap has
        // four routes and one of them is not an inference at all: the strap's own
        // accelerometer is tied to the thing that moves when she breathes. The other
        // three are electrical, and they are cleaner than the optical equivalents
        // because an R wave is a spike where a pulse is a soft bump: the spacing
        // between beats, the height of each R wave as her chest expands, and the
        // baseline of the trace drifting with the chest wall.
        //
        // THE FOUR ROUTES ARE WHY CONFIDENCE CAN BE EARNED RATHER THAN GUESSED. Each
        // gives its own answer for the same minute, so agreement between them is a
        // measurement and not a heuristic. A wrist has one route and has to judge how
        // clean it looks.
        //
        // "rate at night" and "pattern from sound" ARE THE BAND'S AND STAY. They are a
        // different instrument answering a narrower question, and records exist at
        // both. The new values are the strap's and are read continuously.
        //
        // DEPTH IS RELATIVE AND SAYS SO. Nothing here is a volume in millilitres:
        // calibrating that needs equipment nobody wears in bed. It can say this breath
        // was deeper than that one, which is the question that gets asked anyway.
        //
        // PAUSES AND SIGHS ARE ON THE MAP AND ARE NOT YET REPORTABLE. Her own brief is
        // explicit: "I would not present these events as detected unless they have been
        // validated against a suitable respiratory reference, such as a respiratory belt
        // or airflow sensor." So they are recorded and held, not shown, until that
        // check has been done. An address on the map is not permission to display.
        { n: "breathing", shape: "dial",   items: ["rate at night", "pattern from sound",
                  "rate", "depth", "in to out ratio",
                  "steadiness of rate", "steadiness of depth",
                  "pauses", "sighs"] },
        // WHICH HALF OF THE BREATH A MOMENT FELL IN.
        //
        // A PARTITION AND NOT A DIAL, because at every instant she is doing one or the
        // other. A gap here means nobody was looking, never that she stopped breathing.
        //
        // WHY IT IS ITS OWN PIPE AND NOT A VALUE INSIDE `breathing`: everything there is
        // a graded reading over a stretch of time, and this is which state a single
        // instant sits in. Two different shapes cannot share a group.
        //
        // WHAT IT IS FOR, which is her idea's whole point: when she presses "Mark this
        // moment", the breath she was in is knowable and is not something she could ever
        // report. Startled on the inhale is not the same event as startled on the
        // exhale, and nothing else in this model can tell them apart.
        { n: "breathing phase", shape: "partition", items: ["breathing in", "breathing out"] },
        // HOW THE BREATH AND THE HEART MOVE TOGETHER, which is the one family a
        // breathing belt cannot give at all. A belt measures breathing. This needs both
        // rhythms in the same signal, perfectly aligned, which is what an ECG is.
        //
        // ITS OWN GROUP BECAUSE IT OWNS A DIFFERENT THING. "size of the swing" is not a
        // property of her breathing and not a property of her heart; it is a property of
        // the coupling between them, and putting it under either one would give it the
        // wrong owner.
        //
        // AND IT IS THE CLOSEST THING IN THIS MODEL TO WHAT THE RELAXATION SCREEN ASKS.
        // The size of the heart rate swing across a breath is a standard read on the
        // parasympathetic side. It does not replace her answer on that bar; it is the
        // thing her answer gets matched against.
        { n: "breath and heart", shape: "dial",
          items: ["size of the swing", "how locked they are", "the delay between them"] },
        // Conductance is split in two because the two are different
        // measurements: the slow level and the fast jumps on top of it. The
        // jumps are the cleanest wearable reading of the accelerator there is,
        // and this band carries neither.
        { n: "skin", shape: "dial",        items: ["temperature", "conductance level",
                                                   "conductance jumps"] },
        { n: "movement", shape: "dial",    items: ["accelerometer"] },
        { n: "sleep", shape: "dial",       items: ["stages", "timing"] },
        { n: "blood", shape: "dial",       items: ["oxygen"] }
      ]}
    ]
  }
};

// The ninety day person, placed into the boxes that actually have data.
window.EPISODES = [
  { box:"env", cell:"what happens", group:"ups and downs",       item:"conflict",   from:33, to:33, name:"a hard conversation" , source:"tap" },
  { box:"env", cell:"around you",   group:"what is within reach", item:"medication", from:55, to:90, name:"an antidepressant in the house" , source:"tap" },
  { box:"envmark", cell:"what the sensor reads", group:"light", item:"lux at the wrist", from:1, to:90, daily:true, name:"light she got" },

  // asleep: every night, and broken while she is unwell
  { box:"person", cell:"state", group:"asleep", item:"deep",        from:1,  to:90, daily:true, name:"deep sleep" },
  { box:"person", cell:"state", group:"asleep", item:"light",       from:1,  to:90, daily:true, name:"light sleep" },
  { box:"person", cell:"state", group:"asleep", item:"rem",         from:1,  to:90, daily:true, name:"rem" },
  { box:"person", cell:"state", group:"asleep", item:"awakenings",  from:42, to:58, daily:true, name:"waking in the night" },

  // awake: still most of the day, moving when she walks, exerting when she trains
  // She is awake every day, which is the whole point of the group: it says only
  // that, and leaves what her body was doing to the group beside it. Without a
  // pipe here the model would draw a woman who was never awake, and a pipe
  // means a thing was present, so the absence would have been a lie.
  { box:"person", cell:"state", group:"awake", item:"awake", from:1, to:90, daily:true, name:"awake" },
  { box:"person", cell:"state", group:"what the body is doing", item:"being still", from:1, to:90, daily:true, name:"still" },
  { box:"person", cell:"state", group:"what the body is doing", item:"moving",      walks:true,     name:"moving" },
  { box:"person", cell:"state", group:"what the body is doing", item:"hard sport",       gym:true,       name:"hard sport" },

  { box:"person", cell:"state", group:"autonomic tone", item:"parasympathetic", from:1,  to:41, name:"settled" },
  { box:"person", cell:"state", group:"autonomic tone", item:"sympathetic",     from:42, to:58, name:"leaning sympathetic" },
  { box:"person", cell:"state", group:"autonomic tone", item:"parasympathetic", from:59, to:90, name:"settled" },

  { box:"person", cell:"state", group:"cycle", item:"luteal",     from:1,  to:7,  name:"luteal" },
  { box:"person", cell:"state", group:"cycle", item:"menstrual",  from:8,  to:12, name:"menstruating" },
  { box:"person", cell:"state", group:"cycle", item:"follicular", from:13, to:21, name:"follicular" },
  { box:"person", cell:"state", group:"cycle", item:"ovulation",  from:22, to:24, name:"ovulation" },
  { box:"person", cell:"state", group:"cycle", item:"luteal",     from:25, to:35, name:"luteal" },
  { box:"person", cell:"state", group:"cycle", item:"menstrual",  from:36, to:40, name:"menstruating" },
  { box:"person", cell:"state", group:"cycle", item:"follicular", from:41, to:49, name:"follicular" },
  { box:"person", cell:"state", group:"cycle", item:"ovulation",  from:50, to:52, name:"ovulation" },
  { box:"person", cell:"state", group:"cycle", item:"luteal",     from:53, to:63, name:"luteal" },
  { box:"person", cell:"state", group:"cycle", item:"menstrual",  from:64, to:68, name:"menstruating" },
  { box:"person", cell:"state", group:"cycle", item:"follicular", from:69, to:77, name:"follicular" },
  { box:"person", cell:"state", group:"cycle", item:"ovulation",  from:78, to:80, name:"ovulation" },
  { box:"person", cell:"state", group:"cycle", item:"luteal",     from:81, to:90, name:"luteal" },

  { box:"person", cell:"state", group:"illness", item:"infection", from:42, to:54, name:"unwell" },
  { box:"person", cell:"state", group:"illness", item:"fever",     from:44, to:48, name:"a fever" },
  { box:"person", cell:"state", group:"chronic illness", item:"long running, moves your normal", from:1, to:90, name:"a long running condition" },
  { box:"person", cell:"state", group:"pain",   item:"acute",   from:44, to:50, name:"in pain" },
  { box:"person", cell:"state", group:"hunger", item:"hungry",  from:12, to:15, name:"went long without eating" },
  { box:"person", cell:"state", group:"hunger", item:"hungry",  from:44, to:52, name:"not eating much" },

  { box:"person", cell:"state", group:"substances", item:"caffeine",         from:1,  to:90, daily:true, name:"caffeine" },
  { box:"person", cell:"state", group:"substances", item:"medication level", from:55, to:90, name:"an antidepressant in her blood" },

  { box:"person", cell:"state", group:"window", item:"in",    from:1,  to:32, name:"inside her window" },
  { box:"person", cell:"state", group:"window", item:"hyper", from:33, to:33, name:"hyperactivated" },
  { box:"person", cell:"state", group:"window", item:"in",    from:34, to:45, name:"inside her window" },
  { box:"person", cell:"state", group:"window", item:"hypo",  from:46, to:52, name:"hypoactivated" },
  { box:"person", cell:"state", group:"window", item:"in",    from:53, to:90, name:"inside her window" },

  // THE FOUR PIPES THE CHECK IN FILLS. Days, not stretches, because being
  // asked and answering is not a rhythm: these appear only where she stopped
  // and told us, and the gaps are the days nobody asked.
  //
  // They follow the story the rest of this demo already tells. Day 33 is the
  // hyperactivated day, 46 to 52 the shut down stretch, and 44 to 50 the pain
  // and the fever. The words line up with those rather than being sprinkled,
  // because the whole point of these pipes is that they explain the others.
  { box:"person", cell:"state", group:"distress", item:"distressed",
    days:[33, 46, 48, 51], name:"she said she was distressed" },

  { box:"person", cell:"state", group:"named sensations", item:"trembling hands",
    days:[33], name:"trembling hands" },
  { box:"person", cell:"state", group:"named sensations", item:"shallow breathing",
    days:[33, 46], name:"shallow breathing" },
  { box:"person", cell:"state", group:"named sensations", item:"tired out",
    days:[44, 46, 48, 51, 52], name:"tired out" },
  { box:"person", cell:"state", group:"named sensations", item:"headache",
    days:[44, 45, 48], name:"a headache" },
  { box:"person", cell:"state", group:"named sensations", item:"heavy stomach",
    days:[46, 51], name:"a heavy stomach" },

  { box:"person", cell:"state", group:"named emotions", item:"anxious",
    days:[33, 46], name:"anxious" },
  { box:"person", cell:"state", group:"named emotions", item:"afraid",
    days:[33], name:"afraid" },
  { box:"person", cell:"state", group:"named emotions", item:"ashamed",
    days:[48, 51], name:"ashamed" },
  { box:"person", cell:"state", group:"named emotions", item:"angry",
    days:[51], name:"angry" },

  // The third layer, in reasoning rather than state, because a belief is
  // something she is concluding and not something she is in. It outlasts the
  // feeling: "afraid" sits on day 33 alone, "I will not manage" runs through
  // the whole shut down stretch.
  //
  // These are the first strips the reasoning cell has ever had. It was drawn
  // and then never given anything to show, which is why it reads as an empty
  // frame in the picture.
  { box:"person", cell:"reasoning", group:"named thoughts", item:"I will not manage",
    days:[33, 46, 48, 51, 52], name:"I will not manage" },
  { box:"person", cell:"reasoning", group:"named thoughts", item:"I am not doing enough",
    days:[46, 51], name:"I am not doing enough" },
  { box:"person", cell:"reasoning", group:"named thoughts", item:"I will be rejected",
    days:[33], name:"I will be rejected" },

  { box:"person", cell:"state", group:"felt safety", item:"safe",   from:1,  to:11, name:"felt safe" },
  { box:"person", cell:"state", group:"felt safety", item:"unsafe", from:12, to:15, name:"did not feel safe" },
  { box:"person", cell:"state", group:"felt safety", item:"safe",   from:16, to:32, name:"felt safe" },
  { box:"person", cell:"state", group:"felt safety", item:"unsafe", from:33, to:34, name:"did not feel safe" },
  { box:"person", cell:"state", group:"felt safety", item:"safe",   from:35, to:90, name:"felt safe" },

  { box:"person", cell:"state", group:"named conditions", item:"depression", from:50, to:90, name:"depression" },

  { box:"mark", cell:"what the sensor reads", group:"heart",       item:"rate across the day", from:1,  to:24, daily:true, name:"heart rate recorded" },
  { box:"mark", cell:"what the sensor reads", group:"heart",       item:"rate across the day", from:28, to:90, daily:true, name:"heart rate recorded" },
  { box:"mark", cell:"what the sensor reads", group:"variability", item:"SDNN",                from:1,  to:24, daily:true, name:"SDNN recorded" },
  { box:"mark", cell:"what the sensor reads", group:"variability", item:"SDNN",                from:28, to:90, daily:true, name:"SDNN recorded" },
  { box:"mark", cell:"what the sensor reads", group:"breathing",   item:"rate at night",       from:1,  to:24, daily:true, name:"breathing rate recorded" },
  { box:"mark", cell:"what the sensor reads", group:"breathing",   item:"rate at night",       from:28, to:90, daily:true, name:"breathing rate recorded" },
  { box:"mark", cell:"what the sensor reads", group:"skin",        item:"temperature",         from:1,  to:24, daily:true, name:"skin temperature recorded" },
  { box:"mark", cell:"what the sensor reads", group:"skin",        item:"temperature",         from:28, to:90, daily:true, name:"skin temperature recorded" },
  { box:"mark", cell:"what the sensor reads", group:"movement",    item:"accelerometer",       from:1,  to:24, daily:true, name:"movement recorded" },
  { box:"mark", cell:"what the sensor reads", group:"movement",    item:"accelerometer",       from:28, to:90, daily:true, name:"movement recorded" },
  { box:"mark", cell:"what the sensor reads", group:"sleep",       item:"stages",              from:1,  to:24, daily:true, name:"sleep stages recorded" },
  { box:"mark", cell:"what the sensor reads", group:"sleep",       item:"stages",              from:28, to:90, daily:true, name:"sleep stages recorded" },
  { box:"mark", cell:"what the sensor reads", group:"blood",       item:"oxygen",              from:1,  to:24, daily:true, name:"blood oxygen recorded" },
  { box:"mark", cell:"what the sensor reads", group:"blood",       item:"oxygen",              from:28, to:90, daily:true, name:"blood oxygen recorded" },

  { box:"person", cell:"behaviour", group:"bed", item:"went to bed",    from:1, to:90, daily:true, name:"went to bed" },
  { box:"person", cell:"behaviour", group:"bed", item:"got out of bed", from:1, to:90, daily:true, name:"got out of bed" },

  { box:"person", cell:"behaviour", group:"movement", item:"walking", walks:true, name:"a walk" },
  { box:"person", cell:"behaviour", group:"movement", item:"doing hard sport", gym:true, name:"the gym" },

  // THE TOLD HALF OF MOVEMENT, which is what she says at a check in rather than
  // what the band noticed. Chosen stillness is deliberately RARER than the
  // stillness the band sees: she is barely moving most of the day, and only
  // sometimes is that a rest she chose. The gap between the two is the whole
  // reason both exist, and on this person it is wide.
  { box:"person", cell:"behaviour", group:"movement", item:"being still",        days:[4, 5, 7, 13, 15, 17, 19, 24, 25, 28, 31, 33, 36, 38, 39, 42, 43, 44, 45, 46, 47, 50, 51, 52, 53, 54, 55, 56, 61, 65, 69, 71, 73, 74, 77, 79, 80, 85, 88], name:"she chose to rest" },
  { box:"person", cell:"behaviour", group:"movement", item:"moving",             days:[1, 2, 4, 5, 6, 7, 11, 12, 13, 17, 18, 19, 21, 24, 25, 27, 29, 32, 33, 34, 37, 39, 40, 41, 61, 66, 67, 70, 76, 78, 79, 80, 81, 84, 86, 87, 89, 90], name:"just her day" },
  { box:"person", cell:"behaviour", group:"movement", item:"doing chores",       days:[1, 2, 4, 5, 6, 7, 11, 12, 13, 17, 18, 19, 21, 24, 25, 27, 29, 32, 33, 34, 37, 39, 40, 41, 61, 66, 67, 70, 76, 78, 79, 80, 81, 84, 86, 87, 89, 90], name:"chores" },
  { box:"person", cell:"behaviour", group:"movement", item:"doing gentle sport", days:[4, 5, 12, 15, 18, 21, 23, 24, 26, 30, 34, 38, 56, 57, 66, 73, 79, 80, 81, 84], name:"something gentle" },

  // And the state half of the gentle one, on the same days, because here the
  // two agree. The interesting days are the ones where they will not.
  { box:"person", cell:"state", group:"what the body is doing", item:"gentle sport", days:[4, 5, 12, 15, 18, 21, 23, 24, 26, 30, 34, 38, 56, 57, 66, 73, 79, 80, 81, 84], name:"gentle sport" }
];
