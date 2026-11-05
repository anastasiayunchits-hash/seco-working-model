/* ---------------------------------------------------------------------------
   THE MAP, AND THE SWITCH BETWEEN IT AND THE 3D MODEL.

   Same mechanism as the Nervous System Model Record, in the same viewer frame,
   so the two artifacts show one model rather than two. The step bar reveals it
   a piece at a time: two blocks, then the inside of the person, then the inside
   of the world, then what a sensor can actually see.

   Two things are deliberately NOT the same as the record's copy, and both are
   because this model has moved on since that one was written:

     The four boxes inside the environment carry THIS model's names: around you,
     conditions, how life stands, what happens. The record still says people and
     place, which is the older split. One model, one set of names.

     There are two marker boxes, not one. The record has body markers only. This
     model also reads the world with sensors, and step six says so.

   The record's seventh step, the five real situations lighting live arrows, is
   not here. It runs off that artifact's own day data, and wiring it to this
   model's ninety day person is its own job.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LAST = 6;
  var step = 1;

  var STEP_TITLE = [
    "",
    "A person and their world",
    "The body, and what it does",
    "What the body makes urgent",
    "What you make of it",
    "What the world is made of",
    "What can actually be measured"
  ];

  var STEP_NOTE = [
    "",

    "<b>Two things of equal size, and each changes the other.</b> Every argument about "
      + "nature against nurture, genes against circumstance, lives in these two arrows. "
      + "Everything that follows is an enlargement of one block or the other, and neither "
      + "one is the background to the other.",

    "<b>Open the person, and start with two things.</b> How the body is, and what it does. "
      + "They move each other in both directions.<br><br>The downward arrow is the "
      + "<b>fast lane</b>: startle, flinch, freeze, with no deciding in between. The upward "
      + "one is behaviour acting back on the body, which is why doing something first and "
      + "letting the feeling follow is a real treatment rather than a slogan.",

    "<b>A state does not create a need. It changes how much that need presses.</b> The need "
      + "for connection is standing; inflammation and sleep loss make it urgent, or distort "
      + "it. Physical and emotional, and the two are not ranked.<br><br><b>This box earns its "
      + "place for one reason.</b> A need can be reported independently of the state, and the "
      + "two sometimes disagree. Somebody physiologically depleted who reports needing nothing "
      + "is showing you something real, and that gap is invisible if the box does not exist.",

    "<b>And then it is weighed.</b> Needs are read against what it would cost and what is "
      + "possible, and that produces behaviour that went through something first. Now there "
      + "are two routes to the same box: the fast one that skips all of this, and the slow one "
      + "that goes through it.<br><br><b>Weighed does not mean noticed.</b> People-pleasing is "
      + "weighed every time it runs, and almost nobody catches it happening. Most of this box "
      + "is out of sight.",

    "<b>Now open the other block, and it stacks by speed.</b> Not by subject, because speed is "
      + "what decides what the model can do with a thing.<br><br><b>The moment</b> changes within "
      + "a day, so it can cut a baseline in two: her heart at home against her heart at work. "
      + "<b>Dated, then over</b> is what a baseline is used to judge, never the yardstick. "
      + "<b>The standing floor</b> holds for months and cannot cut anything, because if she has "
      + "been housed all year there is no unhoused half of her to compare against. What it does "
      + "instead is move where her whole normal sits.<br><br>The floor is in two halves, and they "
      + "are the same pair as needs on the other side: whether the ground is there at all, and "
      + "whether the life on top of it is worth having. Somebody can have one without the "
      + "other.<br><br>It reaches the person in two places. <b>On the body</b>, with no decision "
      + "involved: noise, cold, darkness, someone hostile in the room. And <b>on reasoning</b>, "
      + "where it sets what is actually on the menu. Without that second arrow, a behaviour that "
      + "stopped could only ever be explained by the person rather than their circumstances.",

    "<b>Three boxes are solid, and the rest is the honest problem.</b> Behaviour is partly "
      + "visible. Body markers are the single window onto state. Environment markers are a "
      + "narrow window onto the world: a microphone hears the noise, the band feels the room, "
      + "the city's own readings give the air and the weather.<br><br>Everything drawn dashed "
      + "is invisible to every sensor we have: needs, reasoning, the whole standing floor, and most of "
      + "what happens to a person in a day. The amount of dashed line here is the measure of "
      + "how much has to be asked rather than measured."
  ];

  function $(id) { return document.getElementById(id); }

  function show(sel, on) {
    document.querySelectorAll("#pane-map " + sel).forEach(function (el) {
      el.style.display = on ? "" : "none";
    });
  }

  function setStep(n) {
    step = Math.max(1, Math.min(LAST, n));

    document.querySelectorAll("#pane-map .sb").forEach(function (b) {
      var k = Number(b.getAttribute("data-step"));
      b.classList.toggle("on", k === step);
      b.classList.toggle("done", k < step);
    });

    $("steptitle").textContent = STEP_TITLE[step];
    $("sprev").disabled = step === 1;
    $("snext").disabled = step === LAST;

    show(".k2", step >= 2);
    show(".k3", step >= 3);
    show(".k4", step >= 4);
    show(".k5", step >= 5);
    show(".k6", step >= 6);

    $("loopnote").innerHTML = STEP_NOTE[step];
  }

  /* ----- the switch ------------------------------------------------------ */

  /* The 3D canvas sizes itself from a ResizeObserver, and a hidden pane has no
     size. Coming back to it therefore re-measures on its own, which is why
     nothing here has to tell the renderer anything. */
  function setPane(which) {
    var map = which === "map";
    document.querySelectorAll(".vt").forEach(function (t) {
      t.classList.toggle("on", (t.getAttribute("data-pane") === which));
      t.setAttribute("aria-selected", String(t.getAttribute("data-pane") === which));
    });
    $("pane-map").hidden = !map;
    $("pane-3d").hidden = map;
  }

  function start() {
    if (!$("pane-map")) return;

    document.querySelectorAll("#pane-map .sb").forEach(function (b) {
      b.addEventListener("click", function () {
        setStep(Number(b.getAttribute("data-step")));
      });
    });
    $("sprev").addEventListener("click", function () { setStep(step - 1); });
    $("snext").addEventListener("click", function () { setStep(step + 1); });

    document.querySelectorAll(".vt").forEach(function (t) {
      t.addEventListener("click", function () {
        setPane(t.getAttribute("data-pane"));
      });
    });

    setStep(1);
    setPane("map");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();
