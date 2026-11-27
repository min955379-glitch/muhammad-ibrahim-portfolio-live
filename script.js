/* Muhammad Ibrahim - portfolio. Vanilla JS only, no libraries, no network calls.
   Jobs: mobile menu, one-shot reveal, label scramble, and the premium layer
   (lite-mode switch, day/night glass bar, progress line, counters, cursor,
   hero spotlight, sheen, magnetic button, hero letter reveal). */
(function () {
  "use strict";

  var doc = document;
  doc.documentElement.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wide = window.matchMedia("(min-width: 768px)");

  /* ---------- mobile menu ---------- */
  var btn = doc.querySelector(".menu-btn");
  var nav = doc.getElementById("nav");
  var body = doc.body;

  function isOpen() {
    return body.classList.contains("menu-open");
  }

  function open() {
    if (wide.matches) return;
    nav.classList.remove("nav-closing");
    body.classList.add("menu-open", "no-scroll");
    btn.setAttribute("aria-expanded", "true");
    var first = nav.querySelector("a");
    if (first) first.focus({ preventScroll: true });
  }

  function close(refocus) {
    if (wide.matches) return;
    body.classList.remove("menu-open");
    body.classList.remove("no-scroll");
    nav.classList.add("nav-closing");
    btn.setAttribute("aria-expanded", "false");
    window.setTimeout(function () { nav.classList.remove("nav-closing"); }, 140);
    if (refocus !== false) btn.focus({ preventScroll: true });
  }

  if (btn && nav) {
    btn.addEventListener("click", function () { isOpen() ? close() : open(); });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close();
    });

    doc.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || btn.contains(e.target)) return;
      close(false);
    });

    /* tab loop inside the open sheet */
    nav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !isOpen()) return;
      var items = nav.querySelectorAll('a[href], button:not([disabled])');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* links close the sheet before jumping to the section */
    nav.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (a) close(false);
    });

    wide.addEventListener("change", function () {
      body.classList.remove("menu-open", "no-scroll");
      nav.classList.remove("nav-closing");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- one-shot reveal with a short stagger ---------- */
  var revealables = [].slice.call(doc.querySelectorAll("[data-reveal]"));
  var canObserve = typeof window.IntersectionObserver === "function";
  if (reduced || !canObserve || !revealables.length) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    revealables.forEach(function (el) {
      var box = el.parentElement;
      var group = box && box.hasAttribute("data-stagger") ? box : null;
      if (group) {
        var idx = 0;
        for (var i = 0; i < group.children.length; i++) {
          if (group.children[i] === el) { idx = i; break; }
        }
        if (idx < 6) el.style.setProperty("--d", (idx * 45) + "ms");
      }
    });
    var io = new window.IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("in");
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- scramble the hero label once (450 ms) ---------- */
  var target = doc.querySelector("[data-scramble]");
  if (target && !reduced) {
    var text = target.textContent;
    var glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#.";
    var started = null;
    var duration = 450;
    target.textContent = "";
    var step = function (now) {
      if (started === null) started = now;
      var p = Math.min((now - started) / duration, 1);
      var shown = Math.floor(p * text.length);
      var out = text.slice(0, shown);
      for (var i = shown; i < text.length; i++) {
        out += text.charAt(i) === " " ? " " : glyphs.charAt((Math.random() * glyphs.length) | 0);
      }
      target.textContent = out;
      if (p < 1) window.requestAnimationFrame(step);
      else target.textContent = text;
    };
    window.requestAnimationFrame(step);
  }

  /* ================= premium layer ================= */
  var html = doc.documentElement;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var coarse = mq("(hover: none)") || mq("(pointer: coarse)") || !mq("(hover: hover)");
  var conn = navigator.connection || {};
  /* low memory, data-saver or a very slow network = lite mode.
     (core count is NOT used: cheap phones report plenty of cores.) */
  var poor = !!conn.saveData || (conn.deviceMemory || 8) <= 2 ||
             conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
  var lite = reduced || coarse || poor;          /* every expensive effect off */
  var fine = !lite && mq("(hover: hover)") && mq("(pointer: fine)");
  if (lite) html.classList.add("lite");
  var rAF = window.requestAnimationFrame
    ? function (f) { window.requestAnimationFrame(f); }
    : function (f) { window.setTimeout(function () { f(Date.now()); }, 16); };

  /* --- one scroll handler: progress line + bar day/night --- */
  var prog = doc.getElementById("progress");
  var barEl = doc.querySelector(".bar");
  var heroEl = doc.getElementById("hero");
  var queued = false;
  var heroH = 0;
  var measure = function () { heroH = heroEl ? heroEl.offsetHeight : 0; };
  window.addEventListener("resize", measure);
  function paint() {
    queued = false;
    var y = window.pageYOffset || doc.documentElement.scrollTop || 0;
    var h = Math.max(1, (doc.documentElement.scrollHeight || 0) - (window.innerHeight || 0));
    if (prog && h > 4) prog.style.transform = "scaleX(" + Math.min(1, y / h) + ")";
    if (barEl && heroEl) {
      var past = y > Math.max(0, heroH - 72);
      if (past !== barEl.classList.contains("is-day")) barEl.classList.toggle("is-day", past);
    }
  }
  function onScroll() { if (!queued) { queued = true; rAF(paint); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  measure();
  paint();

  /* --- animated counters: only the two real numbers in the proof strip --- */
  if (!lite) {
    var nums = [].slice.call(doc.querySelectorAll("[data-count]"));
    var runCount = function (el) {
      var to = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(to)) return;
      var t0 = null, dur = 700;
      var tick = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / dur, 1);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) rAF(tick);
        else el.textContent = String(to);
      };
      rAF(tick);
    };
    if (typeof window.IntersectionObserver === "function") {
      var co = new window.IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) {
          if (ents[i].isIntersecting) { runCount(ents[i].target); co.unobserve(ents[i].target); }
        }
      }, { threshold: 0.5 });
      nums.forEach(function (el) { co.observe(el); });
    } else { nums.forEach(runCount); }
  }

  /* --- sheen: one pass when a preview or card appears, and on hover --- */
  var shineables = [].slice.call(doc.querySelectorAll("[data-shine]"));
  if (!lite && shineables.length) {
    if (typeof window.IntersectionObserver === "function") {
      var so = new window.IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) {
          if (ents[i].isIntersecting) {
            var el = ents[i].target;
            so.unobserve(el);
            el.classList.add("shine-on");
            (function (n) { n.addEventListener("animationend", function () { n.classList.remove("shine-on"); }); })(el);
          }
        }
      }, { threshold: 0.3 });
      shineables.forEach(function (el) { so.observe(el); });
    }
    if (fine) {
      shineables.forEach(function (el) {
        el.addEventListener("pointerenter", function () {
          if (el.classList.contains("shine-on")) return;
          el.classList.add("shine-on");
        });
        el.addEventListener("animationend", function () { el.classList.remove("shine-on"); });
      });
    }
  }

  /* --- hero spotlight + custom cursor + magnetic button (real mouse only) --- */
  if (fine) {
    var spot = doc.querySelector(".hero-spot");
    var dot = doc.createElement("div");
    var ring = doc.createElement("div");
    var lbl = doc.createElement("span");
    dot.className = "cur-dot"; dot.setAttribute("aria-hidden", "true");
    ring.className = "cur-ring"; ring.setAttribute("aria-hidden", "true");
    ring.appendChild(lbl);
    doc.body.appendChild(dot); doc.body.appendChild(ring);

    var x = -100, y = -100, rx = -100, ry = -100, moving = false, idle = 0;
    var loop = function () {
      rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      if (Math.abs(x - rx) > 0.4 || Math.abs(y - ry) > 0.4) rAF(loop); else moving = false;
    };
    doc.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      x = e.clientX; y = e.clientY;
      body.classList.add("cur-on");
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      if (spot) spot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      if (!moving) { moving = true; rAF(loop); }
      window.clearTimeout(idle);
      idle = window.setTimeout(function () { body.classList.remove("cur-on"); }, 2400);
    }, { passive: true });

    var heroSec = heroEl;
    if (heroSec && spot) {
      heroSec.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") heroSec.classList.add("is-live"); });
      heroSec.addEventListener("pointerleave", function () { heroSec.classList.remove("is-live"); });
    }

    doc.addEventListener("pointerover", function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      var hit = t.closest("a,button,[data-cursor],[data-shape='phone']");
      if (!hit) { body.classList.remove("cur-link"); body.classList.remove("cur-img"); return; }
      var shot = hit.getAttribute("data-shape") === "phone" && !hit.closest("a,button");
      body.classList.toggle("cur-img", !!shot);
      body.classList.toggle("cur-link", !shot);
      if (!shot) lbl.textContent = hit.getAttribute("data-cursor") || (hit.target === "_blank" ? "Open" : "Go");
    }, { passive: true });
    doc.addEventListener("pointerout", function (e) {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("a,button,[data-cursor]")) return;
      body.classList.remove("cur-link", "cur-img");
    }, { passive: true });

    [].forEach.call(doc.querySelectorAll("[data-magnet]"), function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var w = r.width || 1, h = r.height || 1;
        var dx = (e.clientX - (r.left + w / 2)) * 0.14;
        var dy = (e.clientY - (r.top + h / 2)) * 0.22;
        dx = Math.max(-8, Math.min(8, dx)); dy = Math.max(-8, Math.min(8, dy));
        el.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* --- hero letter reveal: one shot, 26ms apart (skipped in lite mode) --- */
  if (!lite) {
    var h1 = doc.querySelector("[data-split]");
    if (h1) {
      var idx = 0, frag = doc.createDocumentFragment();
      [].slice.call(h1.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split("").forEach(function (ch) {
            if (ch === " ") { frag.appendChild(doc.createTextNode(" ")); return; }
            var sp = doc.createElement("span");
            sp.textContent = ch;
            sp.style.setProperty("--i", idx++);
            frag.appendChild(sp);
          });
        } else { frag.appendChild(node.cloneNode(true)); }
      });
      h1.textContent = "";
      h1.appendChild(frag);
      h1.classList.add("split");
      rAF(function () { h1.classList.add("in"); });
    }
  }
})();
