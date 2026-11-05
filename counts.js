/* ---------------------------------------------------------------------------
   THE BASELINE COUNT, READ OFF THE MODEL INSTEAD OF TYPED INTO THE FIGURE.

   Those numbers were written by hand and they were wrong within a day. On
   9 October "around you" gained five values and the figure still said 19 of
   the moment, 399 per context and 1,533 in total, when the model had moved to
   24, 504 and 1,638. Nobody would have caught it: a wrong number in a table
   looks exactly like a right one.

   The arithmetic:

       markers x (1 + situations x activities + contexts x activities + events)

   One baseline per marker on its own, one per marker per situation PER
   ACTIVITY, one per marker per context PER ACTIVITY, one response per marker
   per behaviour. The rhythms are counted separately and deliberately, because
   a rhythm is the behaviour itself rather than a marker split by it.

   WHY SITUATION AND CONTEXT ARE MULTIPLIED AND BEHAVIOUR IS NOT. A room is not an
   activity and neither is an illness, and both overlap in time with what the
   body is doing. Measured on a worn month, "her heart at home" came back as
   52.9 bpm and read like a remarkably calm house: she is at home from midnight
   to nine and asleep from midnight to seven, so seven of those nine hours were
   sleep. The number was a sleeping heart wearing the name of a room, and "home
   is calmer than work" was really "night is calmer than day". "Her heart while
   unwell" had the identical problem, and came back as 64.4 when her sleeping
   and waking hearts while unwell are 52.0 and 66.6.

   Behaviour is not multiplied because an episode cannot cross anything: nobody
   stands up all day, so "at home while standing up" has no duration to take a
   level over.

   NINE STATES ARE NOT MULTIPLIED, and they are exactly the ones that ARE an
   activity. Deep sleep crossed with asleep is the same question in a longer
   coat; deep sleep crossed with awake is the empty set.

   A SITUATION IS NOT ONLY A BODY. Two cells are multiplied, not one: the
   person's state, which is her body, and the person's reasoning, which is the
   belief sitting over it. A belief outlasts an activity, so "her heart while
   I will be rejected is present" is confounded unless it is crossed, exactly
   as a room is. Two reasoning groups are left out and named below, because
   making something of the day is an act of judging rather than a thing she is
   inside, and "her heart while the day" is not a sentence.

   Founder decisions, 12 October 2026.

   WHAT COUNTS AS WHAT, and these are the figure's own definitions, not new ones:
     markers   every value in the two sensor boxes, body and environment
     situations  every value in the person's state cell and in the person's
               reasoning cell, less the two groups named in NOT_SITUATIONS
     contexts  every value in around you and in conditions, the two cells that
               change inside a day. The standing floor is not here on purpose:
               it cannot split a baseline, because there is no unhoused half of
               somebody who has been housed all year.
     events    every value in the person's behaviour cell
     activities  the partition groups in the person's state cell that say what
               the body is doing. Sleep counts once rather than per stage,
               because "at home while in REM" is nobody's question. A partition
               is required and checked: it is always on, so every minute has
               exactly one, and the cut leaves no minute out and none counted
               twice. An episode could not cross anything, since nobody stands
               up all day.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  function start() {
    var M = window.MODEL;
    if (!M || !document.getElementById("n-total")) return;

    /* `skipGroups` is a list of group names to leave out of the count. It
       exists for the two reasoning groups: without it the figure would say
       58 situations where the engine asks about 55, and a figure that is three
       out looks exactly like a figure that is right. */
    function values(box, cellName, skipGroups) {
      var b = M[box];
      if (!b) return 0;
      var skip = skipGroups || [];
      return (b.cells || []).reduce(function (n, c) {
        if (cellName && c.name !== cellName) return n;
        return n + (c.groups || []).reduce(function (m, g) {
          if (skip.indexOf(g.n) >= 0) return m;
          return m + (g.items || []).length;
        }, 0);
      }, 0);
    }

    /* The six activity cuts, read off the model the same way the engine's
       `everything.activities` reads them, so the figure and the code cannot
       disagree. Each entry is a group name and whether its values split it;
       sleep does not, so it counts as one. */
    var ACTIVITY_GROUPS = [
      { group: "asleep", perValue: false },
      { group: "awake", perValue: true },
      { group: "what the body is doing", perValue: true }
    ];

    function activityCuts() {
      var cells = (M.person && M.person.cells) || [];
      var state = cells.filter(function (c) { return c.name === "state"; })[0];
      if (!state) return 0;
      return ACTIVITY_GROUPS.reduce(function (n, want) {
        var g = (state.groups || []).filter(function (x) {
          return x.n === want.group;
        })[0];
        /* Not a partition any more means the cross is no longer valid, and a
           figure that quietly carried on would be the exact failure this file
           was written to stop. */
        if (!g || g.shape !== "partition") return n;
        return n + (want.perValue ? (g.items || []).length : 1);
      }, 0);
    }

    /* How many STATE VALUES sit in those groups. Not the same number as the
       cuts: sleep is four values and one cut. These are the ones left alone. */
    function activityStateValues() {
      var cells = (M.person && M.person.cells) || [];
      var state = cells.filter(function (c) { return c.name === "state"; })[0];
      if (!state) return 0;
      return ACTIVITY_GROUPS.reduce(function (n, want) {
        var g = (state.groups || []).filter(function (x) {
          return x.n === want.group;
        })[0];
        if (!g || g.shape !== "partition") return n;
        return n + (g.items || []).length;
      }, 0);
    }

    /* The reasoning groups that are NOT situations. The same two names, in the
       same words, as NOT_SITUATIONS in the engine's everything.py: making
       something of the day is an act of judging rather than a stretch she is
       inside. The engine RAISES when one of these names goes stale in the
       model and its test is what catches that; here a stale name would only
       put the values back into the count, which is why the names are written
       out rather than guessed from `proposed` or from the shape. */
    var NOT_SITUATIONS = ["what you made of it", "what you expect"];

    var markers = values("envmark") + values("mark");
    var situations = values("person", "state")
                   + values("person", "reasoning", NOT_SITUATIONS);
    var context = values("env", "around you") + values("env", "conditions");
    var events  = values("person", "behaviour");
    var acts    = activityCuts();
    var plain   = activityStateValues();

    var sitCuts  = plain + (situations - plain) * acts;
    var perSit   = markers * sitCuts;
    var perCtx   = markers * context * acts;
    var perBeh   = markers * events;
    var total    = markers + perSit + perCtx + perBeh;
    var sits     = situations + context;

    /* The tree in the engine is hardcoded there, so this one really is a
       constant. It is the only number here that is.

       Ten since 19 October 2026. Five activities, and a distressed twin of
       each whose parent is that same activity. None of the twins ever grows a
       baseline of its own, so a distressed block is judged against the same
       thing she was doing without the distress, instead of quietly raising it.
       It used to be eight, with one flat "distressed" that threw away whatever
       she was doing at the time. */
    var BRANCHES = 10;

    function thousands(n) { return n.toLocaleString("en-GB"); }

    /* The ids keep their old spelling. They were named when the state cell was
       the only one multiplied, and renaming them buys nothing and would break
       the figure the first time one spelling was missed. */
    var put = {
      "n-mark": markers, "n-states": values("person", "state"),
      "n-sits": situations, "n-ctx": context, "n-beh": events,
      "n-perstate": thousands(perSit), "n-perctx": thousands(perCtx),
      "n-perbeh": thousands(perBeh),
      "n-total": thousands(total), "n-total2": thousands(total),
      "n-rhy": events, "n-rhy2": events,
      "n-sit": sits, "n-left": Math.max(0, sits - BRANCHES),
      "n-act": acts, "n-ctxact": thousands(context * acts),
      "n-act2": acts, "n-statecuts": thousands(sitCuts), "n-plain": plain
    };
    Object.keys(put).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = put[id];
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();
