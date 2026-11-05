(function(){
  var canvas = document.getElementById("scene3d");
  if (!canvas || typeof THREE === "undefined" || !window.MODEL) return;

  var M = window.MODEL, COL = { env:0xD9B070, told:0xF2DFB0, look:0x7E92A8, beh:0x5DCAA5, state:0xA697C7,
                                mark:0x4A8CCB, rhr:0xD85A30, hrv:0x378ADD };
  function cssVar(n, f){ var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || f; }
  function hex(s){ return parseInt(s.replace("#",""), 16); }

  // ONE PERSON'S OWN MODEL, IF THERE IS ONE. `mine.js` is written from that
  // person's real records, so a pipe is drawn only where they really have
  // something and every other pipe is drawn empty. Without it we fall back to
  // the invented ninety day woman, who exists to show what a full model looks
  // like and has never been anybody.
  if (window.REAL_EPISODES) {
    window.EPISODES = window.REAL_EPISODES;
    growHerOwnWords();
    // Say whose model this is and how little of it is filled, so nobody reads
    // an empty model as a calm one.
    var foot = document.getElementById("whose");
    if (foot) {
      var pipes = 0;
      for (var bk in window.MODEL) (window.MODEL[bk].cells || []).forEach(function(c){
        pipes += (c.groups || []).length; });
      foot.textContent = window.REAL_PERSON + ", from " + window.REAL_FIRST + ", "
        + window.REAL_DAYS + (window.REAL_DAYS === 1 ? " day" : " days")
        + " of real records. " + window.REAL_EPISODES.length + " of " + pipes
        + " pipes have anything in them. An empty pipe means we have never had"
        + " data for it, not that nothing happened.";
    }
  }

  // ONE SHAPE FOR EVERYBODY, PLUS HER OWN LEAVES WHERE THE MODEL INVITED THEM.
  //
  // The working model is a statement about what the platform can hold, so it
  // keeps the shared vocabulary and never grows. A person's own model is her
  // life, and a group marked `open` is the model saying in advance that the
  // words for this one are hers. So a word she typed becomes a pipe in HER
  // model, here, and never in the file everybody shares.
  //
  // This runs only inside the REAL_EPISODES branch, so the working model's
  // shape is untouched by it and stays the same picture for every reader.
  //
  // THE OPEN CHECK IS REPEATED HERE ON PURPOSE. `episodes-from-records.py`
  // already refuses to send a word from a closed group, so this is the second
  // lock on one door. A pipe grown in a closed group would mean the shared
  // shape had quietly drifted for one person, and two models that no longer
  // have the same skeleton cannot be compared without anybody being told.
  function growHerOwnWords(){
    var own = window.REAL_OWN;
    if (!own || typeof own !== "object") return;
    Object.keys(own).forEach(function(key){
      var at = key.split("|");
      var box = M[at[0]];
      if (!box || !Array.isArray(own[key])) return;
      (box.cells || []).forEach(function(c){
        if (c.name !== at[1]) return;
        (c.groups || []).forEach(function(g){
          if (g.n !== at[2] || !g.open || !Array.isArray(g.items)) return;
          own[key].forEach(function(word){
            if (typeof word === "string" && g.items.indexOf(word) < 0) g.items.push(word);
          });
        });
      });
    });
  }

  // The axis is minutes, not days. The run is always the same width on screen,
  // however many days it holds: ninety for the invented person, and however
  // many a real person has actually worn the band for. Keeping the width fixed
  // rather than the scale is what lets one evening of records be looked at at
  // all, instead of being a hair's width at the far left of a ninety day model.
  var DAY = 1440, RUN_UNITS = 95.4;
  var DAYS = (window.REAL_EPISODES && window.REAL_DAYS) ? window.REAL_DAYS : 90;
  var SCALE = RUN_UNITS / (DAYS * DAY), MID_M = DAYS * DAY / 2;
  function Mn(day){ return (day - 1) * DAY; }                  // the minute a day begins
  var X = function(m){ return (m - MID_M) * SCALE; };          // minutes in, world units out
  function XD(day){ return X(Mn(day) + DAY / 2); }             // the middle of a day
  var X0 = X(-DAY / 2), X1 = X(DAYS * DAY + DAY / 2), RUN = X1 - X0, MID = (X0 + X1) / 2;

  // A box holds a grid of cells. A cell holds a grid of groups. A group holds the days.
  //
  // THE GRID USED TO BE TWO BY TWO AND NOTHING ELSE. Row and column were read as
  // "is it zero", so a fifth cell had nowhere to go. The environment has five now,
  // stacked in three tiers by how fast a thing moves, so a box says how many rows
  // it wants and the arithmetic follows. Two rows gives back exactly the old
  // numbers, so nothing that was here before has moved by a hair.
  //
  // A column may be fractional. "what happens" is alone in its tier and sits at
  // col 0.5, which puts it in the middle instead of hard against one side.
  var GH = 4, GD = 4.4, GAP = 1.3, CAP = 6.5, COLS = 4;
  var ROWS = 4;
  var CELL_H = ROWS * GH + (ROWS - 1) * GAP + CAP + 2, CELL_D = COLS * GD + (COLS - 1) * GAP + 2;
  var CPAD = 3;
  function boxH(rows){ return rows * CELL_H + (rows - 1) * CPAD + 4; }
  function boxD(cols){ return cols * CELL_D + (cols - 1) * CPAD + 4; }
  var BOX_H = boxH(2), BOX_D = boxD(2);
  var MARK_H = 2 * GH + GAP + CAP + 3;

  var TALL = 0;
  Object.keys(M).forEach(function(k){
    var b = M[k];
    b.rows = b.rows || 2; b.cols = b.cols || 2;
    b.h = b.above ? MARK_H : boxH(b.rows);
    b.d = b.above ? CELL_D + CPAD : boxD(b.cols);
    if (!b.above) TALL = Math.max(TALL, b.h);
  });
  // The marker boxes sit above the TALLEST box, not above a number that assumed
  // every box was the same height.
  Object.keys(M).forEach(function(k){
    var b = M[k];
    b.y0 = b.above ? TALL + 8 : 2;
  });

  function cellAt(key, cell){
    var b = M[key];
    if (b.above) return { y: b.y0 + b.h / 2, z: b.z };
    return {
      y: b.y0 + b.h - 2 - CELL_H / 2 - cell.row * (CELL_H + CPAD),
      z: b.z + (cell.col - (b.cols - 1) / 2) * (CELL_D + CPAD)
    };
  }
  // Every value box is a square, however many of them there are. The grid is sized by
  // whichever direction runs out first, and a short last row is centred.
  var IPAD = 0.3;
  // ONE VALUE IS ONE BOX, THE SAME SIZE WHEREVER IT LIVES.
  //
  // It used not to be. The size came out of however much room the group had, so
  // the same kind of thing was drawn four times bigger in a sparse cell than in
  // a crowded one, and a reader had no way to know the size meant nothing. It
  // ran from 0.73 to 3.40 across the model, and when the group box was allowed
  // to fill its cell it ran to 9.50.
  //
  // SIDE is what a four item group gets in the densest cell there is, so it is
  // the largest size that fits everywhere rather than a number picked by eye.
  // Capped at it, 47 of the 49 groups land on exactly the same pipe. The one
  // that cannot is state/substances, five items in a sixteenth of a cell, and it
  // comes out smaller because there is genuinely no room, not because of a rule.
  var SIDE = (GH - 3 * IPAD) / 2;
  function itemGrid(n){ var c = Math.ceil(Math.sqrt(n)); return { cols:c, rows:Math.ceil(n / c) }; }
  function sideIn(n, availH, availD){
    var g = itemGrid(n);
    return Math.min(SIDE, (availH - (g.rows + 1) * IPAD) / g.rows,
                          (availD - (g.cols + 1) * IPAD) / g.cols);
  }
  function itemAt(p, n, i){
    var cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
    var side = Math.min((p.h - (rows + 1) * IPAD) / rows, (p.d - (cols + 1) * IPAD) / cols);
    var row = Math.floor(i / cols), col = i % cols;
    var inRow = Math.min(cols, n - row * cols);
    var spanH = rows * side + (rows - 1) * IPAD;
    var spanD = inRow * side + (inRow - 1) * IPAD;
    return {
      y: p.y + spanH / 2 - side / 2 - row * (side + IPAD),
      z: p.z - spanD / 2 + side / 2 + col * (side + IPAD),
      h: side, d: side
    };
  }
  // A GROUP FILLS ITS SHARE OF THE CELL, however many groups there are.
  //
  // GH and GD used to be fixed, and they are exactly the size a group needs when
  // a cell holds a full four by four grid of them. Only "state" ever did. Every
  // other cell drew its groups at that same small size and left the rest of the
  // box empty: "around you" filled a fifth of its cell, and the two standing
  // floor cells, which hold one group each, filled four per cent. The pipes were
  // not small, the box around them was mostly air.
  //
  // So the slot is computed from the cell instead. For a four by four grid the
  // arithmetic gives back exactly GH and GD, so the dense cells have not moved.
  var AVAIL_H = CELL_H - CAP - 2, AVAIL_D = CELL_D - 2;
  function groupAt(key, cell, i){
    var c = cellAt(key, cell), n = cell.groups.length;
    var cols = Math.min(cell.cols || COLS, n), rows = Math.ceil(n / cols);
    var col = i % cols, row = Math.floor(i / cols);
    // The share of the cell this group is entitled to.
    var slotH = (AVAIL_H - (rows - 1) * GAP) / rows;
    var slotD = (AVAIL_D - (cols - 1) * GAP) / cols;
    // The box is then drawn snug around its own values at the common pipe size,
    // and centred in that share. Filling the share instead is what blew the
    // pipes up: a cell holding one group would have given that group the whole
    // cell and every pipe in it would have been four times everybody else's.
    var items = cell.groups[i].items.length;
    var s = sideIn(items, slotH, slotD), g = itemGrid(items);
    return {
      y: c.y + CELL_H / 2 - CAP - slotH / 2 - row * (slotH + GAP),
      z: c.z + (col - (cols - 1) / 2) * (slotD + GAP),
      h: g.rows * s + (g.rows + 1) * IPAD,
      d: g.cols * s + (g.cols + 1) * IPAD
    };
  }

  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true });
  // A day view is the whole model cut down to one day. Two planes do the cutting, so
  // nothing outside the day is drawn and the day becomes a box of its own.
  var CLIP = [new THREE.Plane(new THREE.Vector3(1,0,0), 0), new THREE.Plane(new THREE.Vector3(-1,0,0), 0)];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var camera = new THREE.OrthographicCamera(-60, 60, 40, -40, 0.1, 1200);
  scene.add(new THREE.AmbientLight(0xffffff, 0.84));
  var key = new THREE.DirectionalLight(0xffffff, 0.52); key.position.set(60, 120, 90); scene.add(key);

  function wire(w, h, d, x, y, z, colour, op, dash){
    var g = new THREE.BoxGeometry(w, h, d);
    var m = dash
      ? new THREE.LineDashedMaterial({ color: colour, transparent: true, opacity: op, dashSize: 2.2, gapSize: 1.6 })
      : new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: op });
    var l = new THREE.LineSegments(new THREE.EdgesGeometry(g), m);
    if (dash) l.computeLineDistances();
    l.position.set(x, y, z); scene.add(l);
    WIRES.push({ m: m, op: op, lvl: wireLevel });
    return l;
  }
  // Inside one day the nest is still there, so the outer wires stay; the innermost ones
  // would be a hundred and ninety parallel lines down a corridor, so they go quiet.
  var WIRES = [], wireLevel = 0;
  function setDetail(near){
    WIRES.forEach(function(w){
      w.m.opacity = (near && w.lvl >= 2 ? w.op * 0.22 : w.op) * (only ? 0.4 : 1);
    });
  }

  var HOVER = [], SKINS = [];
  Object.keys(M).forEach(function(k){
    var b = M[k];
    var skin = new THREE.Mesh(new THREE.BoxGeometry(RUN, b.h, b.d),
      new THREE.MeshBasicMaterial({ color: b.wall, transparent: true, opacity: 0.05, depthWrite: false }));
    skin.position.set(MID, b.y0 + b.h / 2, b.z); skin.renderOrder = 2; scene.add(skin);
    SKINS.push(skin);
    wireLevel = 0; wire(RUN, b.h, b.d, MID, b.y0 + b.h / 2, b.z, b.wall, 0.9);
    b.cells.forEach(function(cell){
      var c = cellAt(k, cell);
      wireLevel = 1; wire(RUN, CELL_H, b.above ? b.d - 3 : CELL_D, MID, c.y, c.z, b.wall, 0.34);

      cell.groups.forEach(function(g, i){
        var p = groupAt(k, cell, i);
        wireLevel = 2; wire(RUN, p.h, p.d, MID, p.y, p.z, b.wall, g.proposed ? 0.62 : 0.4, !!g.proposed);
        g.items.forEach(function(name, j){
          var it = itemAt(p, g.items.length, j);
          if (g.items.length > 1)
            wireLevel = 3,
            wire(RUN, it.h, it.d, MID, it.y, it.z, b.wall,
                 g.proposed ? 0.3 : 0.22, !!g.proposed);
          var target = new THREE.Mesh(new THREE.BoxGeometry(RUN, it.h, it.d),
            new THREE.MeshBasicMaterial({ visible: false }));
          target.position.set(MID, it.y, it.z);
          // Always say the group AND the value, even when the group holds only one.
          // Hiding the value on a single item group meant hovering "contact" said
          // "contact", which tells a reader nothing about what is measured there.
          //
          // The name and nothing else. It used to carry "(you tell us)" for any
          // value a sensor cannot reach, which included every daily tap, so an
          // amber pipe said the words that belong to a cream one and blurred the
          // only distinction the colours are making. Removed 9 October 2026.
          target.userData = { n: g.n + "  \u00b7  " + name, p: !!g.proposed };
          scene.add(target); HOVER.push(target);
        });
      });
    });
  });

  function findGroup(e){
    var b = M[e.box];
    for (var i = 0; i < b.cells.length; i++) if (b.cells[i].name === e.cell) {
      var cell = b.cells[i];
      for (var j = 0; j < cell.groups.length; j++) if (cell.groups[j].n === e.group) {
        var g = cell.groups[j], p = groupAt(e.box, cell, j);
        var k = g.items.indexOf(e.item);
        if (k < 0) { if (window.console) console.warn("no such item", e.group, e.item); return null; }
        return itemAt(p, g.items.length, k);
      }
    }
    return null;
  }
  var CYCLES = [[8,12],[36,40],[64,68]], BARS = [], DRAWN = {};
  window.EPISODES.forEach(function(e){
    var at = findGroup(e); if (!at) return;
    // THE BAR LEARNS WHICH PIPE IT IS. A bar has always carried its display
    // `name`, which is what a tag is pressed by, and that is not an address:
    // two pipes can share a word and a value does not say which group it sits
    // in. Search has to hold up a set of pipes chosen by address, so the
    // address rides along on the bar.
    var pipe = e.box + "|" + e.cell + "|" + e.group + "|" + e.item;
    DRAWN[pipe] = true;
    // Four boxes, so the rule needs four answers. What a sensor wrote down is not a state,
    // and painting it like one is the one confusion this model exists to prevent.
    // HOW WE KNOW IS A QUESTION THE ENVIRONMENT ASKS, so the source only picks
    // the colour there, and in `needs`, which is the one cell in the person box
    // that is never sensed. Everywhere else in the person box the colour says
    // WHAT KIND OF THING IT IS, state against behaviour, and a told state is
    // still a state: she tells us she is pregnant, in pain, distressed.
    //
    // The demo has always done this by hand, passing no source on every
    // person/state strip while passing "told" on every needs one, so the chain
    // gave the right answer by never being asked the wrong question. Real
    // records carry whatever source they were written with, so `Sad`, told,
    // would have come out cream in the middle of the purple state cell. The
    // rule is written down here now rather than depending on what the demo
    // happens not to do.
    var bySource = (e.box === "env") || (e.box === "person" && e.cell === "needs");
    var colour = (bySource && e.source === "told") ? COL.told
              : (bySource && e.source === "lookup") ? COL.look
              : (e.box === "mark" || e.box === "envmark") ? COL.mark
              // WHAT THE COLOUR MEANS, AND IT IS NOT THE SAME QUESTION ON BOTH
              // SIDES OF THE MODEL.
              //
              // In the ENVIRONMENT the colour says HOW WE KNOW, because the world
              // outside her is only ever knowable through its source, and the four
              // sources differ enormously in what they cost her and how far they
              // can be trusted:
              //
              //   blue    a device she is wearing reads it
              //   slate   somebody else's instrument reads the region she is in
              //   amber   she tapped it, and it is about today
              //   cream   she told us at length, and it is believed for months
              //
              // In the PERSON the colour says WHAT KIND OF THING IT IS, because
              // nearly everything about a person is partly told and partly sensed.
              // That she is in pain, that she feels safe, that she is pregnant: she
              // says all of those and they are states all the same. Colouring them
              // by who spoke would turn that cell into a patchwork and lose the
              // distinction that matters there, which is state against behaviour.
              //
              // NEEDS IS THE ONE EXCEPTION and it earns it: it is the only cell in
              // the person box that is never sensed, only ever told, so there the
              // source IS the kind.
              //
              // Slate rather than a third warm tone, because two warm ones already
              // share the environment box and olive was tried there and could not be
              // told from the amber at pipe width. Warm against cool survives being
              // small where one hue against a near hue does not.
              : e.box === "env" ? COL.env
              : e.cell === "behaviour" ? COL.beh
              : COL.state;
    function push(from, to, quiet){ pushM(Mn(from), Mn(to) + DAY, quiet); }
    function pushM(a, b, quiet){
      BARS.push({ a:a, b:b, name:e.name, key:pipe, c:colour, quiet:quiet,
                  mark:(e.box === "mark" || e.box === "envmark"),
                  y:at.y, z:at.z, h:at.h, d:at.d });
    }
    // An episode that knows its own clock times is drawn at them, not across the day.
    if (e.timed) { e.timed.forEach(function(t){ pushM(t[0], t[1], !!t[2]); }); return; }
    if (e.daily) { for (var dd = e.from; dd <= e.to; dd++) push(dd, dd, true); }
    else if (e.walks) { for (var d = 1; d <= DAYS; d++) if (d <= 58 ? (d % 9 !== 0) : (d % 6 === 0)) push(d, d, true); }
    else if (e.gym) { for (var g = 30; g <= 54; g++) if (g % 7 === 1 || g % 7 === 3 || g % 7 === 5) push(g, g, true); }
    // An explicit list of days, for the things she tells us at a check in
    // rather than the band noticing. They do not fall on a tidy rhythm,
    // because being asked and answering is not a rhythm.
    else if (e.days) { e.days.forEach(function (d) { push(d, d, true); }); }
    else push(e.from, e.to, false);
  });

  /* -------------------------------------------------------------------------
     EVERY PIPE IS COLOURED IN THE WORKING MODEL. NOTHING IS COLOURED IN A
     PERSON'S MODEL THAT DID NOT HAPPEN TO THEM.

     The two models look identical and answer opposite questions, so one colour
     rule cannot serve both.

     THE WORKING MODEL is a static presentation of what the platform can hold:
     what we have and what we might have. It is the same for everybody and it
     is about nobody. A pipe drawn there as a bare outline reads as "none of
     that is happening", which is a sentence about a person, and there is no
     person here to say it about. So every value carries its colour across the
     whole run whether or not the invented woman has an episode in it.

     A PERSON'S OWN MODEL is the live twin, loaded through REAL_EPISODES, and
     there a colour means a thing was PRESENT at that moment. An empty pipe is
     the truth: nothing has been recorded in it yet. Filling those would invent
     a life, which is the one thing a model of somebody's body must never do.

     So this pass runs only when no real person is loaded.

     WHY IT IS NOT 122 HAND-WRITTEN DEMO DAYS. It was, for the four pipes added
     in October, and each time the colouring was forgotten until she saw it
     missing. A rule that has to be remembered per pipe is a rule that will be
     broken per pipe, so the renderer carries it instead.
  ------------------------------------------------------------------------- */
  if (!window.REAL_EPISODES) {
    var RUN_A = Mn(1), RUN_B = Mn(DAYS) + DAY;
    Object.keys(M).forEach(function(boxName){
      (M[boxName].cells || []).forEach(function(cell){
        (cell.groups || []).forEach(function(g, gi){
          var p = groupAt(boxName, cell, gi);
          (g.items || []).forEach(function(name, j){
            var pipe = boxName + "|" + cell.name + "|" + g.n + "|" + name;
            if (DRAWN[pipe]) return;
            var at = itemAt(p, g.items.length, j);
            // The same four answers as above, read off the model instead of off
            // an episode: `said` is the group's own record of what is told at
            // length rather than sensed, which is what cream means.
            var colour = ((g.said || []).indexOf(name) >= 0) ? COL.told
                       : (boxName === "mark" || boxName === "envmark") ? COL.mark
                       : boxName === "env" ? COL.env
                       : cell.name === "behaviour" ? COL.beh
                       : COL.state;
            BARS.push({ a:RUN_A, b:RUN_B, name:name, key:pipe, c:colour, quiet:true, shape:true,
                        mark:(boxName === "mark" || boxName === "envmark"),
                        y:at.y, z:at.z, h:at.h, d:at.d });
          });
        });
      });
    });
  }

  BARS.forEach(function(b){
    var m = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max((b.b - b.a) * SCALE, 0.04),
        Math.max(b.h - 0.35, 0.45), Math.max(b.d - 0.35, 0.45)),
      new THREE.MeshLambertMaterial({ color: b.c, transparent: true, opacity: b.quiet ? 0.85 : 0.97 }));
    m.position.set((X(b.a) + X(b.b)) / 2, b.y, b.z); m.renderOrder = 1; scene.add(m);
    b.mesh = m; b.op = m.material.opacity;
  });

  function inCycle(d){ for (var i=0;i<CYCLES.length;i++) if (d>=CYCLES[i][0] && d<=CYCLES[i][1]) return true; return false; }
  function bump(d,a,b){ return (d<a||d>b) ? 0 : Math.sin(Math.PI*(d-a)/(b-a)); }
  function restingHr(d){ var v=54; if(inCycle(d))v+=3; v+=bump(d,41,55)*9; if(d>=55)v+=4;
    if(d>=30&&d<=58)v-=1.6; if(d>=59)v+=1.2; return v+Math.sin(d*1.7)*0.7; }
  function nightHrv(d){ var v=44; if(inCycle(d))v-=5; v-=bump(d,41,55)*17; if(d>=55)v-=6;
    if(d>=30&&d<=58)v+=1.5; return v+Math.cos(d*1.9)*1.3; }

  var TRENDS = [];
  function ribbon(fn, lo, hi, colour, where){
    var at = findGroup(where); if (!at) return;
    var z = at.z, base = at.y - at.h / 2 + 0.25, span = at.h - 0.5;
    function Y(d){ return base + Math.max(0, Math.min(1, (fn(d)-lo)/(hi-lo))) * span; }
    var v = [], d;
    for (d = 1; d < DAYS; d++) v.push(XD(d),base,z, XD(d+1),base,z, XD(d+1),Y(d+1),z,
                                   XD(d),base,z, XD(d+1),Y(d+1),z, XD(d),Y(d),z);
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    var sk = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color:colour, transparent:true,
      opacity:0.42, side:THREE.DoubleSide, depthWrite:false }));
    sk.renderOrder = 1; scene.add(sk); TRENDS.push({ m:sk.material, op:0.42 });
    var pts = []; for (d = 1; d <= DAYS; d++) pts.push(new THREE.Vector3(XD(d), Y(d), z));
    var lm = new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 1 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
    TRENDS.push({ m:lm, op:1 });
  }
  ribbon(restingHr, 48, 70, COL.rhr,
    { box:"mark", cell:"what the sensor reads", group:"heart",       item:"resting rate" });
  ribbon(nightHrv, 16, 50, COL.hrv,
    { box:"mark", cell:"what the sensor reads", group:"variability", item:"RMSSD" });

  var TOP = M.mark.y0 + M.mark.h;
  var scrub = new THREE.Mesh(new THREE.BoxGeometry(0.5, TOP + 6, BOX_D + 90),
    new THREE.MeshBasicMaterial({ color:0xA697C7, transparent:true, opacity:0.08, depthWrite:false }));
  scrub.renderOrder = 3; scrub.position.set(XD(46), (TOP + 6) / 2, 0); scene.add(scrub);

  var themed = [];
  function buildFrame(){
    themed.forEach(function(o){ scene.remove(o); }); themed = [];
    var pts = [], lim = BOX_D / 2 + 36;
    [-lim, lim].forEach(function(z){ pts.push(X0,0,z, X1,0,z); });
    [X0, X(Mn(31)), X(Mn(61)), X1].forEach(function(x){ pts.push(x,0,-lim, x,0,lim); });
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    var l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: hex(cssVar("--line","#E3DDD6")) }));
    scene.add(l); themed.push(l);
  }

  var theta = -Math.PI / 2, phi = 1.46, zoom = 1.3;
  var HOME = new THREE.Vector3(0, TOP * 0.5, 0), target = HOME.clone();
  // Keep the model reachable: you can move past its edge a little, but not lose it.
  function clampTarget(){
    target.x = Math.max((X0 - 30) * tscale, Math.min((X1 + 30) * tscale, target.x));
    target.y = Math.max(-14, Math.min(TOP + 14, target.y));
    target.z = Math.max(-90, Math.min(90, target.z));
  }
  function updateCamera(){
    var r = 600;
    camera.position.set(target.x + r*Math.sin(phi)*Math.sin(theta),
                        target.y + r*Math.cos(phi),
                        target.z + r*Math.sin(phi)*Math.cos(theta));
    camera.lookAt(target);
    camera.zoom = zoom; camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  }
  // The camera used to frame a fixed 72 world units of height, which was right
  // for a model exactly two cells tall and crops one that is three. Scaling it
  // against the model's own height keeps the same margin whatever the model
  // grows into, and reproduces the old number exactly for a two-row model.
  var WAS_TALL = 2 + BOX_H + 8 + MARK_H;
  var HALF_H = TOP * 72 / WAS_TALL;
  function resize(){
    var w = canvas.clientWidth || 900, h = canvas.clientHeight || 560;
    renderer.setSize(w, h, false);
    var hh = HALF_H, hw = hh * (w / h);
    camera.left = -hw; camera.right = hw; camera.top = hh; camera.bottom = -hh;
    updateCamera();
  }

  var overlay = document.createElement("div");
  overlay.className = "vlabels"; canvas.parentNode.appendChild(overlay);
  var FRONT = X0 - 3, LF = FRONT, ANCHORS = [];
  Object.keys(M).forEach(function(k){
    var b = M[k];
    ANCHORS.push({ text:b.title, cls:"face head", at:new THREE.Vector3(FRONT, b.y0 + b.h + 4, b.z) });
    b.cells.forEach(function(cell){
      var c = cellAt(k, cell);
      // A box with one cell would say its own name twice, so the cell caption is dropped.
      if (b.cells.length > 1)
        ANCHORS.push({ text:cell.name, cls:"face cell",
                       at:new THREE.Vector3(FRONT, c.y + CELL_H/2 - 3, c.z) });
    });
  });
  // The ticks under the model are not fixed. They read the stretch and say whatever is
  // readable at it: days when the whole run is in view, clock times when one day is.
  var TICKS = [];
  for (var t = 0; t < 11; t++)
    TICKS.push({ text:"", cls:"below", at:new THREE.Vector3(0, 9, BOX_D/2 + 36) });
  TICKS.forEach(function(a){ ANCHORS.push(a); });
  var STEPS = [30*DAY, 10*DAY, 5*DAY, 2*DAY, DAY, 720, 360, 180, 60, 30, 15, 5];
  function hhmm(m){
    var x = ((m % DAY) + DAY) % DAY;
    return String(Math.floor(x / 60)).padStart(2,"0") + ":" + String(x % 60).padStart(2,"0");
  }
  function setTicks(){
    var aspect = (canvas.clientWidth || 900) / (canvas.clientHeight || 560);
    var spanMin = (2 * HALF_H * aspect / zoom) / (SCALE * tscale);
    var centre = target.x / tscale / SCALE + MID_M;
    var lo = centre - spanMin / 2, hi = centre + spanMin / 2;
    // A cut day is the only thing on screen, so it is what the ticks are spaced against.
    if (dayCut !== null) { lo = cutFrom(dayCut); hi = lo + DAY; spanMin = DAY; }
    // The widest step that still puts a few marks on the axis.
    var step = STEPS[STEPS.length - 1];
    for (var i = 0; i < STEPS.length; i++) if (spanMin / STEPS[i] >= 2.5) { step = STEPS[i]; break; }
    var first = Math.ceil(lo / step) * step;
    TICKS.forEach(function(a, i){
      var m = first + i * step;
      if (m < -DAY || m > DAYS * DAY + DAY || m > hi) { a.text = ""; a.el.textContent = ""; return; }
      var day = Math.min(DAYS, Math.floor(m / DAY) + 1);
      a.text = step >= DAY ? "day " + day
             : (m % DAY === 0 ? "day " + day + " \u00b7 00:00" : hhmm(m));
      a.el.textContent = a.text;
      a.at.x = X(m);
      a.at.z = BOX_D / 2 + (dayCut === null ? 36 : 12);
    });
  }
  // A LONG CELL NAME GOES ON TWO LINES. Cell captions are centred on their own
  // cell, and two cells side by side are about a hundred pixels apart at the
  // default zoom. "environmental safety" and "meaning and agency" are the two
  // longest names in the model and on one line they are wider than that gap, so
  // the second one was being hidden by the clash check and the cell looked
  // nameless. Broken near the middle they are half as wide and both fit. The
  // alternative was shortening the founder's names to suit the renderer.
  function twoLine(t){
    if (t.length < 15 || t.indexOf(" ") < 0) return null;
    var best = -1;
    for (var i = 0; i < t.length; i++)
      if (t[i] === " " && (best < 0 || Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2)))
        best = i;
    return best < 0 ? null : [t.slice(0, best), t.slice(best + 1)];
  }
  ANCHORS.forEach(function(a){
    var e = document.createElement("span"); e.className = "vl " + a.cls;
    var split = a.cls.indexOf("cell") >= 0 ? twoLine(a.text) : null;
    if (split) {
      e.classList.add("twoline");
      e.appendChild(document.createTextNode(split[0]));
      e.appendChild(document.createElement("br"));
      e.appendChild(document.createTextNode(split[1]));
    } else {
      e.textContent = a.text;
    }
    overlay.appendChild(e); a.el = e;
  });

  var SIZE = { "face cell":3.4, "face head":4.4 };
  function placeLabels(){
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var perWorld = h * zoom / (2 * HALF_H);
    setTicks();
    var items = [];
    ANCHORS.forEach(function(a){
      a.el.style.display = "";
      var world = SIZE[a.cls.replace(" faintlabel", "")];
      if (world) a.el.style.fontSize = Math.max(6, Math.min(15, world * perWorld)) + "px";
      if (a.cls === "below" && !a.text) { a.el.style.display = "none"; return; }
      var v = a.at.clone();
      if (a.cls.indexOf("face") >= 0) v.x = LF;
      v.x *= tscale; v.project(camera);
      var x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
      a.el.style.left = x + "px"; a.el.style.top = y + "px";
      items.push({ a:a, x:x, y:y, d:v.z });
    });
    function tier(a){ return a.cls.indexOf("head") >= 0 ? 0 : a.cls.indexOf("cell") >= 0 ? 1 : 3; }
    items.sort(function(p, q){ var t = tier(p.a) - tier(q.a); return t !== 0 ? t : p.d - q.d; });
    var kept = [];
    items.forEach(function(it){
      var el = it.a.el, hw = el.offsetWidth / 2 + 2, hh2 = el.offsetHeight / 2 + 1;
      var cy = it.a.cls === "below" ? it.y + el.offsetHeight / 2 + 6 : it.y;
      var clash = kept.some(function(k){
        return Math.abs(k.x - it.x) < k.w + hw && Math.abs(k.y - cy) < k.h + hh2;
      });
      el.style.display = clash ? "none" : "";
      if (!clash) kept.push({ x:it.x, y:cy, w:hw, h:hh2 });
    });
  }

  // The small boxes say their name when the pointer is on them, and stay quiet otherwise.
  var tip = document.createElement("span");
  tip.className = "vl tip"; tip.style.display = "none"; overlay.appendChild(tip);
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener("pointermove", function(e){
    if (dragging) { tip.style.display = "none"; return; }
    var r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    var h = ray.intersectObjects(HOVER, false)[0];
    if (!h) { tip.style.display = "none"; return; }
    tip.textContent = h.object.userData.n;
    tip.classList.toggle("faintlabel", h.object.userData.p);
    tip.style.display = "";
    tip.style.left = (e.clientX - r.left) + "px";
    tip.style.top = (e.clientY - r.top - 12) + "px";
  });
  canvas.addEventListener("pointerleave", function(){ tip.style.display = "none"; });

  window.__setZoom = function(z){ zoom = z; updateCamera(); paint(); };
  function paint(){
    scene.background = new THREE.Color(hex(cssVar("--sunk","#F2EFEA")));
    renderer.render(scene, camera);
    placeLabels();
  }

  var dragging = false, lx = 0, ly = 0;
  canvas.addEventListener("pointerdown", function(e){ dragging = true; dragDist = 0; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", function(e){
    if (!dragging) return;
    dragDist += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
    if (e.shiftKey) {
      vR.setFromMatrixColumn(camera.matrixWorld, 0);
      vU.setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(vR, -(e.clientX - lx) * 2 * camera.right / zoom / canvas.clientWidth);
      target.addScaledVector(vU,  (e.clientY - ly) * 2 * camera.top  / zoom / canvas.clientHeight);
      clampTarget();
    } else {
      theta -= (e.clientX - lx) * 0.007;
      phi = Math.max(0.08, Math.min(Math.PI - 0.08, phi - (e.clientY - ly) * 0.006));
    }
    lx = e.clientX; ly = e.clientY; updateCamera(); paint();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(function(ev){
    canvas.addEventListener(ev, function(){ dragging = false; });
  });
  // The wheel moves up and down through the model and never turns it. Zoom is ctrl or cmd
  // with the wheel, and it still goes toward the pointer. At the top or the bottom the wheel
  // is handed back to the page so it can scroll normally.
  var vR = new THREE.Vector3(), vU = new THREE.Vector3();
  canvas.addEventListener("wheel", function(e){
    var r = canvas.getBoundingClientRect();
    vR.setFromMatrixColumn(camera.matrixWorld, 0);
    vU.setFromMatrixColumn(camera.matrixWorld, 1);

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      var was = zoom;
      zoom = Math.max(0.35, Math.min(400, zoom * (e.deltaY > 0 ? 0.9 : 1.111)));
      var k = (1 / was) - (1 / zoom);
      target.addScaledVector(vR, nx * camera.right * k);
      target.addScaledVector(vU, ny * camera.top * k);
      clampTarget();
      updateCamera(); paint();
      return;
    }

    var before = target.clone();
    var vStep = e.deltaY * 2 * camera.top / zoom / canvas.clientHeight;
    var hStep = e.deltaX * 2 * camera.right / zoom / canvas.clientWidth;
    // A trackpad sends both at once. A wheel with only one direction gets sideways on shift.
    if (e.shiftKey) target.addScaledVector(vR, vStep);
    else target.addScaledVector(vU, -vStep);
    if (hStep) target.addScaledVector(vR, hStep);
    clampTarget();
    if (!target.equals(before)) { e.preventDefault(); updateCamera(); paint(); }
  }, { passive:false });

  // Camera zoom pulls both axes in at once, so zooming to a day would also make the model
  // a sliver tall. The time axis gets its own stretch instead, the two planes cut the rest
  // of the run away, and what is left is the same nest of boxes holding one day.
  var tscale = 1;
  function setTime(k){ tscale = k; scene.scale.x = k; }
  var dayCut = null;
  // A day runs from six in the morning to six the next morning, so it starts when she gets
  // up rather than at midnight.
  function cutFrom(day){ return Mn(day) + 6 * 60; }
  function setCut(day){
    dayCut = day;
    setDetail(day !== null);
    if (day === null) { renderer.clippingPlanes = []; LF = FRONT; scrub.visible = true; return; }
    var a = cutFrom(day);
    CLIP[0].constant = -X(a) * tscale;
    CLIP[1].constant =  X(a + DAY) * tscale;
    renderer.clippingPlanes = CLIP;
    LF = X(a) - 1.2 / tscale;
    scrub.visible = false;
  }

  // theta, phi, zoom, and how much of the frame's width one day should take. Where that
  // last one is left out the day is given a fixed width instead, so it reads as a box
  // rather than a corridor.
  // One day is laid out flat, left to right, because in a day the clock is the whole point.
  // The run is looked at straight down the time axis, which is where its cross-section reads.
  var VIEWS = { "default":[0, 1.46, 1.28, 0.74] };
  var WHOLE = { "default":[-Math.PI/2, 1.46, 1.3] };
  var btns = document.querySelectorAll(".vb"), goday = document.getElementById("goday");
  var dayView = "default";                 // which of the four the day is looked at from

  // One day is the whole model with everything outside that day cut away, so the four
  // view buttons still mean what they meant: they just aim at the day instead of the run.
  window.__goToDay = function(day){
    var v = VIEWS[dayView];
    theta = v[0]; phi = v[1]; zoom = v[2];
    var aspect = (canvas.clientWidth || 900) / (canvas.clientHeight || 560);
    var across = 2 * HALF_H * aspect / zoom;
    setTime((v[3] ? v[3] * across : 96) / (DAY * SCALE));
    setCut(day);
    // Looked at flat on, the box names sit at the left edge of the day, so the day is
    // nudged right to leave them room.
    target.set(X(cutFrom(day) + DAY / 2) * tscale - (v[3] ? across * 0.10 : 0), TOP * 0.5, 0);
    updateCamera(); paint();
  };
  window.__wholeRun = function(which){
    var v = WHOLE[which || "front"];
    setTime(1); setCut(null);
    theta = v[0]; phi = v[1]; zoom = v[2]; target.copy(HOME);
    updateCamera(); paint();
  };
  function markView(which){
    btns.forEach(function(o){ o.classList.toggle("on", o.dataset.view === which); });
  }
  btns.forEach(function(b){
    b.addEventListener("click", function(){
      if (!VIEWS[b.dataset.view]) return;               // the day button shares this class
      markView(b.dataset.view);
      if (dayCut !== null) { dayView = b.dataset.view; window.__goToDay(dayCut); }
      else window.__wholeRun(b.dataset.view);
    });
  });
  if (goday) goday.addEventListener("click", function(){
    if (dayCut !== null) {                              // pressing it again lets the run back
      goday.classList.remove("on");
      window.__wholeRun(dayView); markView(dayView);
      return;
    }
    goday.classList.add("on");
    window.__goToDay(Number(document.getElementById("day3d").value));
  });

  // Pressing a tag holds one thing up and lets the rest of the model fall away. The nest
  // stays, faintly, because where a thing sits is half of what it says.
  //
  // `only` USED TO BE ONE NAME, because one tag is one thing. Search asks for
  // exactly the same holding up and the same falling away, but of a set: typing
  // "social" means every pipe in the social pressure group at once. So `only`
  // is now the HOLD rather than the name, and it carries the two things the
  // rest of this file was reading off the old string:
  //
  //   only.tag        the tag name, when a tag is what is held, else null
  //   only.has(bar)   whether this bar is one of the ones being held up
  //
  // Nothing about the dimming changed. `setOnly(name)` still means exactly what
  // it meant, and a tag press still goes through it.
  var only = null;
  var clearFind = null;             // set by the search box below, if it is there
  function setOnly(name){
    setHeld(name == null ? null
          : { tag:name, has:function(b){ return b.name === name; } });
  }
  // Hold up every pipe in `hits` (entries from PIPES, so addressed by key).
  function holdPipes(hits){
    var set = {};
    hits.forEach(function(p){ set[p.key] = true; });
    setHeld({ tag:null, has:function(b){ return !!set[b.key]; } });
  }
  function setHeld(held){
    only = held;
    BARS.forEach(function(b){
      if (!b.mesh) return;
      var up = !only || only.has(b);
      b.mesh.visible = up;
      b.mesh.material.opacity = only && up ? 1 : b.op;
    });
    WIRES.forEach(function(w){
      var base = (dayCut !== null && w.lvl >= 2) ? w.op * 0.22 : w.op;
      w.m.opacity = only ? base * 0.4 : base;
    });
    SKINS.forEach(function(m){ m.material.opacity = only ? 0.02 : 0.05; });
    TRENDS.forEach(function(t){ t.m.opacity = only ? t.op * 0.12 : t.op; });
    paint();
  }

  var slider = document.getElementById("day3d"), daynum = document.getElementById("daynum"),
      daywhat = document.getElementById("daywhat");
  // The slider was written for ninety days. A real person has however many
  // days they have actually worn the band, which on a first run is one.
  if (slider && DAYS !== 90) {
    slider.max = DAYS;
    if (+slider.value > DAYS) slider.value = 1;   // told below, once there is a listener
    // Its own span, NOT a rewrite of the label's innerHTML. Rewriting the
    // label throws away the #daynum span this file is already holding, so the
    // day number silently stops updating and the label reads "day 46 of 1".
    var total = document.getElementById("daytotal");
    if (total) total.textContent = DAYS;
  }
  function describe(day){
    var out = [];
    // Readings are there every day, so they tell you nothing about this one. The tags are
    // the things that come and go: environment, state, behaviour.
    BARS.forEach(function(b){
      if (b.mark || b.quiet || Mn(day) + DAY <= b.a || Mn(day) >= b.b) return;
      out.push({ t:b.name, c:"#" + b.c.toString(16).padStart(6,"0") });
    });
    // `shape` bars are the structure drawn in its own colour, not something
    // that happened on this day, so they never become tags. The tags are the
    // things that come and go, and a pipe that is always there is not one.
    BARS.forEach(function(b){ if (!b.mark && !b.shape && b.quiet && b.a >= Mn(day) && b.a < Mn(day) + DAY)
      out.push({ t:b.name, c:"#" + b.c.toString(16).padStart(6,"0") }); });
    // THE INVENTED WOMAN'S TWO NUMBERS. `restingHr` and `nightHrv` are curves
    // written by hand to give the demo something to show. Printing them beside
    // a real person's own model would put two numbers about nobody under their
    // name, which is the one thing a model of somebody's body must never do.
    if (!window.REAL_EPISODES) {
      out.push({ t:"resting " + restingHr(day).toFixed(0) + " bpm", c:"#D85A30", pick:false });
      out.push({ t:"hrv " + nightHrv(day).toFixed(0) + " ms", c:"#378ADD", pick:false });
    }
    var seen = {}, order = [];
    out.forEach(function(o){
      if (seen[o.t]) { seen[o.t].n++; return; }
      seen[o.t] = { t:o.t, c:o.c, n:1, pick:o.pick }; order.push(o.t);
    });
    daywhat.innerHTML = order.map(function(k){
      var o = seen[k], label = o.t + (o.n > 1 ? "  \u00d7" + o.n : "");
      var on = !!(only && only.tag === o.t), pick = o.pick !== false;
      return '<b' + (pick ? ' class="pickable' + (on ? " on" : "") + '" data-n="' + esc(o.t) + '"' : "") +
             ' style="background:' + o.c + (on ? "33" : "22") + ';color:' + o.c +
             ';border:1px solid ' + o.c + (on ? "" : "55") + '">' + label + "</b>";
    }).join("");
    // A TAG that is not on this day any more lets go. A SEARCH does not: she
    // asked for those pipes, not for that day, and moving the slider is not
    // her changing her mind. A search hold has no `tag`, which is how they
    // are told apart.
    if (only && only.tag && order.indexOf(only.tag) < 0) setOnly(null);
  }
  function esc(t){ return String(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
  daywhat.addEventListener("click", function(e){
    var el = e.target.closest ? e.target.closest("b.pickable") : null;
    if (!el) return;
    var n = el.dataset.n;
    // One hold at a time, so the chrome never says one thing while the model
    // shows another: pressing a tag empties the search box.
    if (clearFind) clearFind();
    setOnly(only && only.tag === n ? null : n);
    describe(Number(slider.value));
  });
  slider.addEventListener("input", function(){
    var d = Number(slider.value); daynum.textContent = d;
    scrub.position.x = XD(d); describe(d);
    if (dayCut !== null) window.__goToDay(d);     // in a day view the slider moves the day
    else paint();
  });

  /* -------------------------------------------------------------------------
     FINDING A PIPE BY NAME.

     The model holds 62 pipes and 203 values, and a value sits in a group
     nobody chose and nobody would guess. Twice now the answer to "I don't see
     those pipes" has been "it is there, in a group you would not have thought
     of, among two hundred others". That is a gap in the tool.

     So: type a word, and every pipe whose ADDRESS contains it is held up while
     the rest of the model steps back. Plain substring, lowercased, no regex and
     no ranking, because she is looking for a thing she already knows the name
     of. And the answer is said in words as well as in light: how many matched
     and where each one is, because "it is lit up somewhere" is not an answer.

     This does not touch a colour. It holds pipes up and lets them back down,
     which is the one thing pressing a tag already does.
  ------------------------------------------------------------------------- */
  var PIPES = [];
  Object.keys(M).forEach(function(boxName){
    var box = M[boxName];
    (box.cells || []).forEach(function(cell){
      (cell.groups || []).forEach(function(g){
        (g.items || []).forEach(function(name){
          var addr = boxName + " / " + cell.name + " / " + g.n + " / " + name;
          PIPES.push({
            key: boxName + "|" + cell.name + "|" + g.n + "|" + name,
            addr: addr,
            // The box title as well as its key, because both are its name:
            // "environment" should find the `env` box and "a person" `person`.
            hay: (addr + " / " + (box.title || "")).toLowerCase()
          });
        });
      });
    });
  });
  // Built from M AFTER her own typed words have been grown into it, so in her
  // own model the search finds those too. They are the pipes nobody can guess
  // the name of, which makes them the ones this is most for.

  // WHICH PIPES HAVE ANYTHING DRAWN IN THEM. In the working model that is all
  // of them, because the renderer colours every pipe. In a person's own model
  // it is only the ones she really has records in, and a pipe with nothing in
  // it has no bar to hold up. Found and empty is a real answer and the search
  // has to say it, or the model goes dark and reads as "it is nowhere".
  var HASBAR = {};
  BARS.forEach(function(b){ if (b.key) HASBAR[b.key] = true; });

  var vbar = document.querySelector("#pane-3d .vbar") || document.querySelector(".vbar");
  if (vbar) {
    // The row is built here rather than in the page, because the artifact's
    // page has diverged from this repo's and must not be republished from it.
    var fstyle = document.createElement("style");
    fstyle.textContent = ".vfind{display:flex;gap:8px;align-items:center;flex-wrap:wrap;"
      + "padding:10px 14px;border-top:1px solid var(--line)}"
      + ".vfindi{font-family:var(--body);font-size:12.5px;padding:6px 10px;border-radius:8px;"
      + "border:1px solid var(--line);background:var(--surface);color:var(--ink);"
      + "width:240px;max-width:100%;-webkit-appearance:none;appearance:none}"
      + ".vfindi:focus{outline:none;border-color:var(--accent)}"
      + ".vfindi::placeholder{color:var(--faint)}"
      // One way to clear it, not two beside each other: the Clear button says
      // what it does, and the browser's own little cross does not.
      + ".vfindi::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none}"
      + ".vfindout{flex:1 1 100%;font-size:12px;line-height:1.5;color:var(--muted);"
      + "font-family:var(--body)}"
      + ".vfindout:empty{display:none}"
      + ".vfindout b{color:var(--ink);font-weight:500}"
      + ".vfindout p{margin:5px 0 0}"
      + ".vfindout ul{list-style:none;margin:5px 0 0;padding:0;max-height:116px;overflow:auto;"
      + "font-family:var(--mono);font-size:11px;color:var(--muted)}"
      + ".vfindout li{padding:1px 0}";
    document.head.appendChild(fstyle);

    var frow = document.createElement("div");
    frow.className = "vfind";
    frow.innerHTML =
        '<input id="find3d" class="vfindi" type="search" autocomplete="off" spellcheck="false"'
      + ' placeholder="find a pipe by name" aria-label="find a pipe by name">'
      + '<button class="vb" id="find3dclear" type="button" hidden>Clear</button>'
      + '<div class="vfindout" id="find3dout" role="status" aria-live="polite"></div>';
    vbar.parentNode.insertBefore(frow, vbar.nextSibling);

    var fin = frow.querySelector("#find3d"),
        fclr = frow.querySelector("#find3dclear"),
        fout = frow.querySelector("#find3dout");

    function runFind(){
      var typed = fin.value.trim(), q = typed.toLowerCase();
      fclr.hidden = !fin.value;
      // Clearing it puts the model back exactly as it was, which is what
      // pressing a held tag a second time does.
      if (!q) { setOnly(null); fout.innerHTML = ""; return; }
      var hits = PIPES.filter(function(p){ return p.hay.indexOf(q) >= 0; });
      if (!hits.length) {
        // Say so. Dimming the whole model and saying nothing would read as
        // "it is in there somewhere", which is the thing being fixed.
        setOnly(null);
        fout.innerHTML = 'No pipe has &quot;' + esc(typed) + '&quot; in its name.';
        return;
      }
      holdPipes(hits);
      var lit = hits.filter(function(p){ return HASBAR[p.key]; }).length;
      fout.innerHTML = "<b>" + hits.length + (hits.length === 1 ? " pipe found" : " pipes found")
        + "</b><ul>" + hits.map(function(p){ return "<li>" + esc(p.addr) + "</li>"; }).join("") + "</ul>"
        + (lit ? "" : "<p>" + (hits.length === 1
            ? "Nothing has been recorded in it yet, so there is nothing to light up."
            : "Nothing has been recorded in any of them yet, so there is nothing to light up.")
          + "</p>");
    }
    clearFind = function(){ if (fin.value) { fin.value = ""; fclr.hidden = true; fout.innerHTML = ""; } };
    fin.addEventListener("input", runFind);
    fin.addEventListener("keydown", function(e){
      if (e.key === "Escape") { e.stopPropagation(); fin.value = ""; runFind(); }
    });
    fclr.addEventListener("click", function(){ fin.value = ""; runFind(); fin.focus(); });
    window.__find3d = runFind;        // so a browser check can drive it honestly
  }

  // The written list, built from the same data the boxes are built from.
  var panel = document.getElementById("contents");
  if (panel){
    var html = "";
    Object.keys(M).forEach(function(k){
      var b = M[k];
      html += '<div class="cbox"><h3>' + b.title + "</h3>";
      b.cells.forEach(function(cell){
        html += '<div class="ccell"><h4>' + cell.name
             + (cell.checkin ? ' <em>only ever filled by a check in</em>' : "") + "</h4>";
        cell.groups.forEach(function(g, gi){
          var said = g.said || [];
          var list = g.items.map(function(i){
            return said.indexOf(i) >= 0 ? '<u>' + i + "</u>" : i;
          }).join(", ");
          html += '<p class="cg' + (g.proposed ? " prop" : "") + '"><i>' + (gi + 1) + "</i><span>"
               + g.n + "</span><em>" + list + "</em></p>";
        });
        html += "</div>";
      });
      html += "</div>";
    });
    panel.innerHTML = html;
  }

  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function reskin(){ buildFrame(); paint(); }
  if (mq.addEventListener) mq.addEventListener("change", reskin);
  new MutationObserver(reskin).observe(document.documentElement, { attributes:true, attributeFilter:["data-theme"] });
  if (window.ResizeObserver) new ResizeObserver(function(){ resize(); paint(); }).observe(canvas);
  window.addEventListener("resize", function(){ resize(); paint(); });

  window.__dbg = { renderer:renderer, scene:scene, CLIP:CLIP, camera:camera, BARS:BARS, Mn:Mn, X:X, paint:function(){ paint(); } };
  buildFrame(); resize();
  // THE SLIDER SAYS WHICH DAY, not a number written here. This line used to
  // read `describe(46)`, which is the invented woman's most interesting day
  // and is not a day at all in a model that holds one. It ran last, so it
  // quietly wiped the tags on a real person's model and the row under the
  // model came up empty until somebody happened to nudge the slider.
  //
  // Going through the listener rather than calling describe directly also
  // sets the day number and moves the scrubber, so all three agree from the
  // first frame instead of only after the first interaction.
  slider.dispatchEvent(new Event("input", { bubbles: true }));
  paint();
})();
