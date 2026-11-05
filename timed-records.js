// The clock times behind the model, and the timed records it reads.
//
// DO NOT DELETE THIS FILE BECAUSE OF ITS NAME. The first half builds ninety days
// with a clock on them, which looks like data for a view that no longer exists.
// The second half is what the model itself depends on: it swaps the day-wide
// stand-ins for sleep and bed out of window.EPISODES and puts real timed spans
// in their place, so zooming into a night shows the shape of the night instead
// of one block a whole day wide. work.js reads those spans through e.timed.
(function(){
  var seed = 20261002;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
  function jitter(spread){ return (rnd() + rnd() + rnd() - 1.5) * spread; }   // roughly bell shaped

  function unwell(d){ return d >= 42 && d <= 54; }
  function weekend(d){ return d % 7 === 6 || d % 7 === 0; }

  var DAYS = [];
  for (var d = 1; d <= 90; d++){
    var loose = unwell(d) ? 2.6 : (weekend(d) ? 1.8 : 1.0);

    var bed      = 23 * 60 + 10 + jitter(22) * loose;
    var latency  = (unwell(d) ? 68 : 34) + jitter(10) * loose;
    var asleep   = bed + latency;
    var slept    = (unwell(d) ? 5.9 : 7.1) * 60 + jitter(26) * loose;
    var woke     = asleep + slept;
    var gotUp    = woke + 12 + jitter(8);

    var day = { day:d, bed:[bed, gotUp], asleep:[asleep, woke] };

    if (!weekend(d) && !unwell(d)) {
      var on = 9 * 60 + jitter(18), off = 17 * 60 + 30 + jitter(40);
      day.work = [on, off];
    }

    day.meals = [];
    [8 * 60, 13 * 60, 19 * 60 + 30].forEach(function(m, i){
      if (unwell(d) && i !== 1 && rnd() < 0.6) return;        // appetite goes first
      day.meals.push(m + jitter(26));
    });

    day.stands = [];
    var n = unwell(d) ? 7 : 16;
    for (var s = 0; s < n; s++) day.stands.push(gotUp + rnd() * (bed - gotUp));
    day.stands.sort(function(a, b){ return a - b; });

    // a heart rate trace, sampled every quarter hour, that knows when she is asleep
    day.hr = [];
    for (var t = 0; t <= 1440; t += 15){
      var inBed = (t + 1440 >= asleep && t + 1440 <= woke) || (t >= asleep % 1440 && t <= woke % 1440 && woke < 1440);
      var night = (t < (woke % 1440)) || (t > (asleep % 1440));
      var base = night ? 52 : 68;
      if (unwell(d)) base += 9;
      if (day.work && t > day.work[0] && t < day.work[1]) base += 5;
      var near = day.stands.some(function(x){ return t - x >= 0 && t - x < 8; });
      day.hr.push({ t:t, bpm: base + (near ? 16 : 0) + jitter(4) });
    }
    DAYS.push(day);
  }
  window.CLOCK = DAYS;
})();

// Hand the timed records to the main model as well, so that zooming into a night
// there shows the real shape of it instead of a block a whole day wide.
(function(){
  var E = window.EPISODES;
  if (!E) return;
  function M(day){ return (day - 1) * 1440; }

  // out with the day-wide stand-ins
  var drop = [
    ["asleep", "deep"], ["asleep", "light"], ["asleep", "rem"], ["asleep", "awakenings"],
    ["bed", "went to bed"], ["bed", "got out of bed"]
  ];
  for (var i = E.length - 1; i >= 0; i--)
    if (drop.some(function(d){ return E[i].group === d[0] && E[i].item === d[1]; })) E.splice(i, 1);

  function timed(cell, group, item, name, spans){
    E.push({ box:"person", cell:cell, group:group, item:item, name:name, timed:spans });
  }

  var deep = [], light = [], rem = [], wake = [], toBed = [], upAgain = [],
      meals = [], stands = [], onWork = [], offWork = [];

  window.CLOCK.forEach(function(d){
    var base = M(d.day);
    var a = base + d.asleep[0], b = base + d.asleep[1], len = b - a;

    // A night is not one block of each. It runs in cycles of roughly ninety minutes, with
    // the deep sleep front-loaded and the dreaming sleep growing towards the morning.
    var cycles = Math.max(3, Math.round(len / 90)), last = Math.max(1, cycles - 1);
    for (var c = 0; c < cycles; c++){
      var s0 = a + len * c / cycles, e0 = a + len * (c + 1) / cycles, L = e0 - s0;
      var dq = 0.46 * (1 - c / last), rq = 0.10 + 0.34 * (c / last);
      deep.push([s0, s0 + L * dq]);
      light.push([s0 + L * dq, e0 - L * rq]);
      rem.push([e0 - L * rq, e0]);
    }
    if (d.day >= 42 && d.day <= 54)                       // broken nights while unwell
      [0.35, 0.6, 0.8].forEach(function(f){ wake.push([a + len * f, a + len * f + 9]); });

    toBed.push([base + d.bed[0], base + d.bed[0] + 4, true]);
    upAgain.push([base + d.bed[1], base + d.bed[1] + 4, true]);
    d.meals.forEach(function(t){ meals.push([base + t, base + t + 22, true]); });
    d.stands.forEach(function(t){ stands.push([base + t, base + t + 3, true]); });
    if (d.work){
      onWork.push([base + d.work[0], base + d.work[0] + 4, true]);
      offWork.push([base + d.work[1], base + d.work[1] + 4, true]);
    }
  });

  timed("state", "asleep", "deep", "deep sleep", deep);
  timed("state", "asleep", "light", "light sleep", light);
  timed("state", "asleep", "rem", "rem", rem);
  timed("state", "asleep", "awakenings", "waking in the night", wake);
  timed("behaviour", "bed", "went to bed", "went to bed", toBed);
  timed("behaviour", "bed", "got out of bed", "got out of bed", upAgain);
  timed("behaviour", "eating", "taking a meal", "a meal", meals);
  timed("behaviour", "movement", "standing up", "stood up", stands);
  timed("behaviour", "working", "started working", "started working", onWork);
  timed("behaviour", "working", "stopped working", "stopped working", offWork);
})();

// ---------------------------------------------------------------------------
// THE CONTEXT WE ACTUALLY INFER, as pipes in the environment box.
//
// Only what we have a way of knowing today. Two sources and no third:
//
//   she tells us at a check-in   whether she was at work, what she took
//   the date and the place       how much daylight there was
//
// Everything else in that box stays empty on purpose. An empty box is the
// honest picture of something nobody collects yet, and filling it with a
// plausible guess would make the model look further along than it is.
(function(){
  var C = window.CLOCK, E = window.EPISODES;
  if (!C || !E) return;
  function M(day){ return (day - 1) * 1440; }

  var atWorkplace = [], atHome = [], commuting = [], daylight = [], working = [];

  C.forEach(function(d, i){
    var base = M(d.day), down = base + d.bed[0];

    // She goes to bed at 23:10 and gets up at 07:12, so a day's "got out of bed"
    // is past the twenty four hour mark and belongs to the NEXT morning. Her
    // morning at home therefore runs from YESTERDAY's getting up, and reading it
    // off today's would silently throw away every morning she has.
    var prev = i > 0 ? C[i - 1] : null;
    var up = prev ? M(prev.day) + prev.bed[1] : base;

    // HOME AND WORK ARE NOT EXCLUSIVE. Two days of her working week are worked
    // from home, and on those days both pipes run across the same hours. That is
    // the honest picture and it is also the thing the old version got wrong: it
    // cut her day into home, then work, then home, as though being at one meant
    // not being at the other. On a day worked from home there is no commute
    // either, which is most of what makes such a day different.
    var fromHome = d.work && (d.day % 5 === 1 || d.day % 5 === 3);

    if (d.work && !fromHome){
      var on = base + d.work[0], off = base + d.work[1];
      commuting.push([on - 32, on]);
      commuting.push([off, off + 32]);
      atWorkplace.push([on, off]);
      if (on - 32 > up) atHome.push([up, on - 32]);
      if (down > off + 32) atHome.push([off + 32, down]);
    } else {
      // at home all day, and on a work from home day the working hours sit
      // inside that, overlapping it rather than interrupting it
      atHome.push([up, down]);

    }

    // Daylight needs no sensor at all: a date and a place give it. Ninety days
    // from the start of October at this latitude, so it shortens as it goes.
    // the activity, wherever she did it
    if (d.work) working.push([base + d.work[0], base + d.work[1]]);

    var hours = 11.6 - 3.0 * Math.sin(Math.PI * d.day / 180);
    var noon = base + 12 * 60;
    daylight.push([noon - hours * 30, noon + hours * 30]);
  });

  function env(cell, group, item, name, spans, told, source){
    var e = { box:"env", cell:cell, group:group, item:item, name:name, timed:spans };
    if (told) e.told = true;
    e.source = source || "tap";          // she pressed something, unless said otherwise
    E.push(e);
  }

  env("around you", "where you are", "the workplace", "at the workplace", atWorkplace, true);
  env("around you", "where you are", "home",   "at home",        atHome,    true);
  env("around you", "where you are", "commuting", "getting there", commuting, false);
  env("conditions", "light", "daylight hours", "daylight", daylight, false, "lookup");

  // A DAILY TAP, which is what a tap is good for: a total over a day rather than
  // an instant. Three choices, so it is one press. She gives less of it while she
  // is unwell, which is the shape worth being able to see.
  var withPeople = [];
  C.forEach(function(d){
    var base = M(d.day), unwell = d.day >= 42 && d.day <= 54;
    var hours = unwell ? 1.0 : (d.work ? 4.5 : 6.0);
    var from = base + 17 * 60;
    withPeople.push([from, from + hours * 60]);
  });
  env("around you", "contact", "time with others", "time with people", withPeople, true);

  // Who she lives with is not the moment. One answer, believed, so it is a single
  // unbroken run in the standing floor rather than a mark a day.
  [["who you live with",  "who she lives with, as she told us"],
   ["who is in reach",     "who she could turn to, as she told us"]].forEach(function(p){
    window.EPISODES.push({ box:"env", cell:"meaning and agency", group:"the life on top of it",
                           item:p[0], from:1, to:90, name:p[1], told:true,
                           source:"told" });
  });

  // The activity sits in the person box, so it can overlap any place she is in.
  window.EPISODES.push({ box:"person", cell:"behaviour", group:"working",
                         item:"working", name:"working", timed:working, told:true });
})();

// ---------------------------------------------------------------------------
// WHAT SHE TOLD US AT LENGTH, in a questionnaire or talking to it. One answer,
// then believed, so these are long unbroken runs rather than a mark a day. Work
// is drawn as two runs because she answered it again on day forty nine, and a
// change is the one moment a standing answer is readable inside one person.
(function(){
  var E = window.EPISODES; if (!E) return;
  // The standing floor is two cells now, so the helper is told which one. The
  // first argument is still the old group name at the call sites below, and this
  // maps it, so the list underneath reads the same as it always did.
  var FLOOR = {
    "environmental safety": ["environmental safety", "the ground under you"],
    "meaning and agency":   ["meaning and agency",   "the life on top of it"]
  };
  function told(half, item, from, to, name){
    var at = FLOOR[half];
    E.push({ box:"env", cell:at[0], group:at[1], item:item,
             from:from, to:to, name:name, told:true, source:"told" });
  }
  told("environmental safety", "housing stability",  1,  90, "her housing, as she told us");
  told("environmental safety", "financial baseline", 1,  90, "her money, as she told us");
  told("environmental safety", "sleep opportunity",  1,  90, "her chance to sleep, as she told us");
  told("meaning and agency",   "work quality",       1,  48, "her work, as she told us");
  told("meaning and agency",   "work quality",      49,  90, "her work, when she told us again");
  told("meaning and agency",   "relationship quality", 1, 90, "her people, as she told us");
})();

// ---------------------------------------------------------------------------
// THE WEATHER, which costs nothing to collect: one lookup a day by city, no
// device and nothing asked of her. Ninety days from the start of October, so
// it cools, the air gets worse as the heating season starts, and the pressure
// swings the way pressure does. Invented like the rest of her, and drawn so
// the boxes are not empty when the data would in fact be there from day one.
(function(){
  var E = window.EPISODES; if (!E) return;
  var seed = 90210;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
  function M(day){ return (day - 1) * 1440; }

  var cold = [], damp = [], pressing = [], smoggy = [];
  for (var d = 1; d <= 90; d++){
    var base = M(d), all = [base, base + 1440];

    // it is October to December, so it cools as it goes
    if (10 - d * 0.14 + (rnd() - 0.5) * 6 < 4) cold.push(all);
    if (rnd() < 0.45 + d * 0.003) damp.push(all);

    // a pressure swing every ten days or so, which is what a front looks like
    if (Math.sin(d / 1.6) + (rnd() - 0.5) * 0.7 < -0.55) pressing.push(all);

    // Krakow: the smog arrives with the heating and does not leave
    if (rnd() < 0.08 + Math.max(0, (d - 30)) * 0.009) smoggy.push(all);
  }

  function cond(group, item, spans, name){
    E.push({ box:"env", cell:"conditions", group:group, item:item,
             name:name, timed:spans, source:"lookup" });
  }
  // damp cold is the overlap of the two, which is the point of folding them
  var dampCold = [];
  cold.forEach(function(c){ if (damp.some(function(d){ return d[0] === c[0]; })) dampCold.push(c); });
  var dryCold = cold.filter(function(c){ return !dampCold.some(function(d){ return d[0] === c[0]; }); });

  cond("temperature", "cold",      dryCold,  "a cold day");
  cond("temperature", "damp cold", dampCold, "cold and damp");
  // pressure is a measurement now, so it is drawn in the marker box
  E.push({ box:"envmark", cell:"what the sensor reads", group:"pressure",
           item:"fell in 24 hours", name:"the pressure fell", timed:pressing });
  cond("air",         "over the health limit", smoggy, "over the limit for smog");

  // exposure adds up, so this is the running count rather than the day itself
  var running = [], sofar = 0;
  smoggy.forEach(function(s){ sofar++; if (sofar >= 5) running.push(s); });
  cond("air", "days above the limit", running, "a fifth day above the limit, and counting");
})();

// ---------------------------------------------------------------------------
// EVERY REMAINING BOX, FILLED. Up to now most of the model was empty and the
// caption said that was the point: an empty box showed what we would have to
// collect. The founder has changed that rule, and it is the better one. If a
// thing has ANY route to us, it is drawn, so the only empty boxes left are the
// ones where nobody has decided what the question even is. Today that is the
// reasoning cell, and nothing else.
//
// Everything below is invented, like the rest of her ninety days, and it is
// shaped by her story: away for work days 12 to 15, a hard conversation on 33,
// unwell 42 to 54, depression from 50, an antidepressant from 55.
(function(){
  var C = window.CLOCK, E = window.EPISODES;
  if (!C || !E) return;
  var seed = 4242;
  function rnd(){ seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
  function M(day){ return (day - 1) * 1440; }
  function unwell(d){ return d >= 42 && d <= 54; }
  function weekend(d){ return d % 7 === 6 || d % 7 === 0; }

  function put(box, cell, group, item, name, src, spans, stretch){
    var e = { box:box, cell:cell, group:group, item:item, name:name };
    if (src) e.source = src;
    if (stretch) { e.from = spans[0]; e.to = spans[1]; }
    else e.timed = spans;
    E.push(e);
  }
  // a stretch of whole days
  function run(box, cell, group, item, name, src, from, to){
    put(box, cell, group, item, name, src, [from, to], true);
  }
  // one span per day, for the days a test says yes
  function days(pick, start, end){
    var out = [];
    for (var d = 1; d <= 90; d++) if (pick(d)) out.push([M(d) + start * 60, M(d) + end * 60]);
    return out;
  }
  // scattered instants
  function marks(list, hour){
    return list.map(function(d){ var t = M(d) + hour * 60; return [t, t + 4, true]; });
  }

  // SIX THINGS ARE DELIBERATELY NOT DRAWN: she does not smoke, nothing is
  // injured, she is not withdrawing from anything, and she did not move house. A pipe means a thing was PRESENT, so drawing "none" as a
  // pipe would be a lie in the one direction this model must not lie. They are
  // empty for a different reason from the reasoning cell: that one is empty
  // because nobody has decided what the question is, these are empty because the
  // answer for this person is no.

  // ---- around you, things she taps -------------------------------------
  put("env","around you","where you are","outside","out of doors","tap",
      days(function(d){ return !unwell(d) && rnd() < 0.75; }, 17.5, 18.6));
  put("env","around you","what it is like","nature","somewhere green","tap",
      days(function(d){ return weekend(d) && !unwell(d); }, 11, 13.5));
  put("env","around you","what it is like","crowds","a crowded place","tap",
      days(function(d){ return !weekend(d) && !unwell(d) && rnd() < 0.8; }, 8.5, 9.2));

  // ---- conditions, looked up by city -----------------------------------
  run("env","conditions","light","season","autumn turning to winter","lookup", 1, 90);
  run("env","conditions","time zone","offset from home","an hour ahead","lookup", 12, 15);
  run("env","conditions","time zone","how long since it changed","still adjusting","lookup", 12, 18);
  put("env","conditions","temperature","hot","a warm day","lookup",
      days(function(d){ return d < 18 && rnd() < 0.35; }, 12, 17));
  put("env","conditions","temperature","close","warm and heavy","lookup",
      days(function(d){ return d < 22 && rnd() < 0.22; }, 13, 18));
  put("env","conditions","noise","loud","a loud day where she was","lookup",
      days(function(d){ return !weekend(d) && rnd() < 0.3; }, 8, 18));
  put("env","conditions","noise","quiet","quiet where she was","lookup",
      days(function(d){ return weekend(d) || rnd() < 0.25; }, 21, 23.5));

  // ---- what happens, she reports it ------------------------------------
  put("env","what happens","demands","deadlines","a deadline","tap", marks([9,26,38,66,81], 10));
  run("env","what happens","demands","workload","a heavy stretch at work","tap", 24, 33);
  run("env","what happens","away","a trip","away for work","tap", 12, 15);
  run("env","what happens","away","a trip","staying with family","tap", 69, 72);
  put("env","around you","contact","someone who feels safe","time with someone safe","tap",
      days(function(d){ return weekend(d) && rnd() < 0.7; }, 15, 18));
  run("env","what happens","life events","loss","a bereavement","tap", 40, 40);
  run("env","what happens","life events","a job change","her role changed","tap", 59, 59);
  run("env","what happens","life events","a rota change","the rota changed","tap", 59, 59);

  // ---- ups and downs, both directions, on ordinary days ------------------
  // READ SMALL, or none of this works. Good news is something that went her way
  // or a problem that resolved itself, NOT an announcement. Kindness is somebody
  // covering for her, not a grand gesture. At the big reading each of these
  // happens about three times in ninety days, which is too rare to split a
  // baseline on, and that is the whole reason this group exists.
  //
  // Bad news used to be three marks here, at the big reading. It is twenty-odd
  // now for the same reason, and the three it already had are still in the list
  // because they are beats in her story.
  //
  // THE THINNING IS PUT THERE, NOT FOUND. Good news and kindness drop off while
  // she is unwell and while she is withdrawn, because a flat sprinkle would have
  // been just as much of a choice and a duller one. She is invented. Nothing in
  // these four lines is evidence of anything.
  function scatter(p){
    var out = [];
    for (var d = 1; d <= 90; d++) if (rnd() < p(d)) out.push(d);
    return out;
  }
  function withdrawn(d){ return d >= 59; }

  put("env","what happens","ups and downs","bad news","bad news","tap",
      marks([33, 41, 58].concat(scatter(function(){ return 0.17; })), 16));
  put("env","what happens","ups and downs","good news","something went her way","tap",
      marks(scatter(function(d){
        return unwell(d) ? 0.10 : withdrawn(d) ? 0.18 : 0.34; }), 12));
  put("env","what happens","ups and downs","conflict","a difficult exchange","tap",
      marks(scatter(function(){ return 0.13; }), 15));
  put("env","what happens","ups and downs","someone was kind","somebody was kind","tap",
      marks(scatter(function(d){ return withdrawn(d) ? 0.22 : 0.38; }), 14));
  put("env","what happens","care","appointments","an appointment","tap", marks([44, 55, 70, 85], 11));
  run("env","what happens","care","a prescription started","an antidepressant started","tap", 55, 55);
  put("env","around you","what is within reach","caffeine","coffee in the house","tap",
      days(function(){ return true; }, 7, 12));
  put("env","around you","what is within reach","alcohol","wine in the house","tap",
      days(function(d){ return weekend(d); }, 19, 22));

  // ---- the standing floor and the needs, both told at length -----------
  var standing = [
    ["environmental safety","the ground under you","food security","enough to eat, as she told us"],
    ["environmental safety","the ground under you","physical safety","safe where she sleeps, as she told us"],
    ["meaning and agency","the life on top of it","play access","little room for play, as she told us"],
    ["meaning and agency","the life on top of it","identity coherence","who she is, as she told us"],
    ["meaning and agency","the life on top of it","freedom to express","room to speak, as she told us"],
    ["meaning and agency","the life on top of it","limits","limits she can hold, as she told us"],
    ["meaning and agency","the life on top of it","fairness","whether it feels fair, as she told us"],
    ["environmental safety","the ground under you","water","enough water, as she told us"],
    ["environmental safety","the ground under you","movement","room to move, as she told us"],
    ["environmental safety","the ground under you","medical care","care she can reach, as she told us"]
  ];
  standing.forEach(function(r){ run("env", r[0], r[1], r[2], r[3], "told", 1, 90); });

  var needs = [
    ["physical","food"],["physical","water"],["physical","sleep and rest"],["physical","housing"],
    ["physical","warmth"],["physical","physical safety"],["physical","movement"],["physical","medical care"],
    ["emotional","attachment security"],["emotional","autonomy and competence"],
    ["emotional","identity coherence"],["emotional","freedom to express"],
    ["emotional","spontaneity and play"],["emotional","limits"],["emotional","fairness"]
  ];
  needs.forEach(function(r){
    // a need is asked at a check in and then believed, so it is a long run that
    // breaks where she answered again. Sleep and play break while she is unwell.
    var breaks = (r[1] === "sleep and rest" || r[1] === "spontaneity and play");
    if (breaks){
      run("person","needs",r[0],r[1],"met, as she told us","told", 1, 41);
      run("person","needs",r[0],r[1],"not met, as she told us","told", 42, 58);
      run("person","needs",r[0],r[1],"met again, as she told us","told", 59, 90);
    } else {
      run("person","needs",r[0],r[1],"as she told us","told", 1, 90);
    }
  });

  // ---- her state, inferred ---------------------------------------------
  // PREGNANCY, and the window is forced rather than chosen. Her cycle is already
  // in the model: she menstruated days 8 to 12, 36 to 40 and 64 to 68, and
  // ovulated 78 to 80. So for all but the last fortnight she is demonstrably not
  // pregnant, and the only window that does not contradict the data already here
  // is a conception at that last ovulation, showing as a very early positive
  // right at the end. Nine of the ninety days would be luteal either way, which
  // is exactly why this is hard to see and worth having a box for.
  // She tells us this one, and it is still LILAC, not cream. Nearly every state
  // here is partly told: that she is in pain, that she feels safe, that she is
  // hungry. Colouring by who said it would turn the state cell into a patchwork
  // and lose the distinction that actually matters there, which is state against
  // behaviour. Needs is the exception, and it earns it by being the one cell in
  // this box that is never sensed at all.
  run("person","state","pregnancy","how far along","two weeks, as she told us", null, 88, 90);
  run("person","state","pain","ongoing","a long running ache", null, 1, 90);
  put("person","state","hunger","fed","fed", null, days(function(d){ return !unwell(d); }, 8, 21));
  put("person","state","hunger","how long since eating", "a long gap", null,
      days(function(d){ return unwell(d) || rnd() < 0.15; }, 13, 19));
  put("person","state","substances","alcohol","alcohol in her blood", null,
      days(function(d){ return weekend(d) && !unwell(d); }, 20, 23.5));
  run("person","state","named conditions","burnout","burnout", null, 36, 58);
  run("person","state","named conditions","anxiety","anxiety", null, 33, 62);
  run("person","state","named conditions","a diagnosis","a diagnosis recorded", null, 50, 90);

  // ---- her behaviour ---------------------------------------------------
  put("person","behaviour","movement","steps","steps", null, days(function(){ return true; }, 8, 21));
  put("person","behaviour","eating","skipping a meal","skipped a meal","tap",
      marks([43,44,46,47,49,50,52,53], 13));
  put("person","behaviour","taking things","medication","took it","tap",
      marks((function(){ var a=[]; for (var d=55; d<=90; d++) a.push(d); return a; })(), 8.5));
  put("person","behaviour","taking things","missed a dose","missed it","tap", marks([61, 73, 84], 8.5));
  put("person","behaviour","taking things","caffeine","coffee","tap",
      marks((function(){ var a=[]; for (var d=1; d<=90; d++) a.push(d); return a; })(), 8));
  put("person","behaviour","taking things","alcohol","a drink","tap",
      marks((function(){ var a=[]; for (var d=1; d<=90; d++) if (weekend(d)) a.push(d); return a; })(), 20));

  // ---- what the sensors read -------------------------------------------
  put("envmark","what the sensor reads","light","how much daylight","daylight she got", null,
      days(function(){ return true; }, 8, 17));
  put("envmark","what the sensor reads","sound","ambient level","how loud it was", null,
      days(function(){ return true; }, 7, 23));
  put("envmark","what the sensor reads","sound","quiet or loud","loud enough to matter", null,
      days(function(d){ return !weekend(d) && rnd() < 0.4; }, 9, 17));
  put("envmark","what the sensor reads","temperature","the room","the room she is in", null,
      days(function(){ return true; }, 0, 24));
  put("envmark","what the sensor reads","temperature","the gap from her skin","room against skin", null,
      days(function(){ return true; }, 23, 24));
  put("envmark","what the sensor reads","pressure","rose in 24 hours","the pressure rose", null,
      days(function(d){ return Math.sin(d / 1.6) > 0.55; }, 3, 9));
  put("envmark","what the sensor reads","pressure","low and staying low","low for days", null,
      days(function(d){ return Math.sin(d / 1.6) < -0.3 && Math.sin((d - 1) / 1.6) < -0.3; }, 0, 24));

  put("mark","what the sensor reads","heart","resting rate","resting heart rate", null,
      days(function(){ return true; }, 2, 6));
  put("mark","what the sensor reads","variability","RMSSD","RMSSD", null,
      days(function(){ return true; }, 2, 6));
  put("mark","what the sensor reads","breathing","pattern from sound","breathing, heard", null,
      days(function(d){ return d >= 28; }, 23, 24));
  put("mark","what the sensor reads","skin","conductance","skin conductance", null,
      days(function(){ return true; }, 7, 23));
  put("mark","what the sensor reads","sleep","timing","when she slept", null,
      days(function(){ return true; }, 23, 24));
})();
