/* Muhammad Ibrahim - portfolio. Vanilla JS only, no libraries, no network calls.
   Jobs: scroll progress + bar day/night, section highlight, reveals, the counter,
   the screenshot lightbox, the menu sheet, both Back to top buttons, and the pointer-only layer.
   Everything here is optional: the page reads fine with JS switched off. */
(function () {
  "use strict";

  var doc = document;
  var html = doc.documentElement;
  html.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var coarse = mq("(hover: none)") || mq("(pointer: coarse)") || !mq("(hover: hover)");
  var conn = navigator.connection || {};
  /* data-saver, very low memory or a 2g link = lite mode. core count is NOT used:
     cheap phones report plenty of cores. */
  var poor = !!conn.saveData || (conn.deviceMemory || 8) <= 2 ||
             conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
  var lite = reduced || coarse || poor;
  var fine = !lite && mq("(hover: hover)") && mq("(pointer: fine)");
  if (lite) html.classList.add("lite");

  var rAF = window.requestAnimationFrame
    ? function (f) { window.requestAnimationFrame(f); }
    : function (f) { window.setTimeout(function () { f(Date.now()); }, 16); };

  /* ---------- the Menu sheet on a phone: the same links, folded up ---------- */
  var menuBtn = doc.querySelector(".menu-btn");
  var navEl = doc.getElementById("nav");
  var navList = navEl && navEl.querySelector(".nav-list");
  var menuLinks = navEl ? [].slice.call(navEl.querySelectorAll("a")) : [];

  function menuOpen() { return doc.body.classList.contains("menu-open"); }
  function openMenu() {
    doc.body.classList.add("menu-open", "no-scroll");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    if (menuLinks[0]) { menuLinks[0].focus(); }
  }
  function closeMenu(back) {
    doc.body.classList.remove("menu-open", "no-scroll");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    if (back && menuBtn) { menuBtn.focus(); }
  }
  if (menuBtn && navList) {
    var mqSheet = window.matchMedia("(min-width: 920px)");
    var tooWide = function () { return !!(mqSheet && mqSheet.matches); };
    menuBtn.addEventListener("click", function () {
      if (tooWide()) { return; }
      menuOpen() ? closeMenu(true) : openMenu();
    });
    /* a click anywhere outside the sheet, or on one of its links, puts it away */
    doc.addEventListener("click", function (e) {
      if (!menuOpen()) { return; }
      if (navEl.contains(e.target) || menuBtn.contains(e.target)) { return; }
      closeMenu(false);
    });
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", function () { if (menuOpen()) { closeMenu(false); } });
    }
    /* Esc closes it, and Tab stays inside the sheet while it is open */
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen()) { closeMenu(true); }
    });
    navEl.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !menuOpen() || menuLinks.length < 2) { return; }
      var first = menuLinks[0], last = menuLinks[menuLinks.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    /* wide enough for the inline row? then the sheet has nothing to do */
    var mqWide = window.matchMedia("(min-width: 920px)");
    var onWide = function () { if (mqWide.matches && menuOpen()) { closeMenu(false); } };
    if (mqWide.addEventListener) { mqWide.addEventListener("change", onWide); }
    else if (mqWide.addListener) { mqWide.addListener(onWide); }
  }

  /* ---------- Back to top: it scrolls, and the URL keeps the address it had ---------- */
  [].forEach.call(doc.querySelectorAll("a[data-top]"), function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (menuOpen()) { closeMenu(false); }
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      if (doc.activeElement && doc.activeElement !== doc.body && doc.activeElement.blur) doc.activeElement.blur();
    });
  });

  /* ---------- one scroll handler: progress line, bar colour, section highlight ---------- */
  var prog = doc.getElementById("progress");
  var topBtn = doc.querySelector(".totop"), topShown = false;
  var barEl = doc.querySelector(".bar");
  var heroEl = doc.querySelector(".hero");
  var navLinks = [].slice.call(doc.querySelectorAll('.nav a[href^="#"]'));
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = doc.getElementById(id);
    if (sec) sections.push({ link: a, sec: sec });
  });

  var queued = false, spyOn = -2, lightAt = [];
  /* the bar goes light only over a light band, so it follows the page and not the scroll */
  var isLight = function (el) {
    if (!el) return false;
    var m = /rgba?\(([^)]+)\)/.exec(window.getComputedStyle(el).backgroundColor);
    if (!m) return false;
    var p = m[1].split(","), i, v = [];
    for (i = 0; i < 3; i++) v.push(parseFloat(p[i]));
    if (p.length > 3 && parseFloat(p[3]) === 0) return false;
    return (0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255 > 0.55;
  };
  var measure = function () { lightAt = sections.map(function (s) { return isLight(s.sec); }); };
  window.addEventListener("resize", measure);

  function paint() {
    queued = false;
    var y = window.pageYOffset || html.scrollTop || 0;
    var h = Math.max(1, (html.scrollHeight || 0) - (window.innerHeight || 0));
    if (prog && h > 4) prog.style.transform = "scaleX(" + Math.min(1, y / h) + ")";
    var line = (barEl ? barEl.offsetHeight : 0) + 26, now = null, i;
    if (sections.length) {
      if (y < 24) now = -1;                        /* near the top: nothing is "current" */
      else {
        for (i = 0; i < sections.length; i++) if (sections[i].sec.getBoundingClientRect().top <= line) now = i;
        /* the last band is short: at the foot of the page it is the one you are looking at */
        if (y + (window.innerHeight || 0) >= (html.scrollHeight || 0) - 4) now = sections.length - 1;
      }
      if (now !== spyOn) {
        spyOn = now;
        for (i = 0; i < sections.length; i++) sections[i].link.classList.toggle("is-now", i === now);
      }
    }
    if (barEl) {
      var day = now !== null && now >= 0 && !!lightAt[now];
      if (day !== barEl.classList.contains("is-day")) barEl.classList.toggle("is-day", day);
    }
    /* the floating arrow arrives past the first screen and steps out for the footer's own one */
    if (topBtn) {
      var foot = doc.querySelector(".foot-top");
      var clear = !foot || foot.getBoundingClientRect().top > (window.innerHeight || 0) - 96;
      var want = y > (window.innerHeight || 700) * 0.9 && clear;
      if (want !== topShown) { topShown = want; topBtn.classList.toggle("is-on", want); }
    }
  }
  function onScroll() { if (!queued) { queued = true; rAF(paint); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  measure(); paint();

  /* ---------- one-shot reveal, short stagger inside a group ---------- */
  var revealables = [].slice.call(doc.querySelectorAll(".reveal"));
  var canObserve = typeof window.IntersectionObserver === "function";
  if (lite || !canObserve || !revealables.length) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new window.IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { entries[i].target.classList.add("in"); io.unobserve(entries[i].target); }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealables.forEach(function (el) {
      var box = el.parentElement, idx = 0;
      if (box) {
        for (var i = 0; i < box.children.length; i++) if (box.children[i] === el) { idx = i; break; }
        if (idx < 6) el.style.transitionDelay = (idx * 45) + "ms";
      }
      io.observe(el);
    });
  }

  /* ---------- the one real number in the proof strip ---------- */
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
        if (p < 1) rAF(tick); else el.textContent = String(to);
      };
      rAF(tick);
    };
    if (canObserve) {
      var co = new window.IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) {
          if (ents[i].isIntersecting) { runCount(ents[i].target); co.unobserve(ents[i].target); }
        }
      }, { threshold: 0.5 });
      nums.forEach(function (el) { co.observe(el); });
    } else { nums.forEach(runCount); }
  }

  /* ---------- lightbox: any screenshot, big. Esc or Close shuts it, focus stays inside ---------- */
  var lb = doc.getElementById("lb");
  var lbBox = lb ? lb.querySelector(".lb-box") : null;
  var lbImg = doc.getElementById("lb-img");
  var lbCap = doc.getElementById("lb-cap");
  var lbX = lb ? lb.querySelector(".lb-x") : null;
  var opener = null;

  function lbOpen(href, alt, cap, from) {
    if (!lb || !lbImg) return;
    opener = from || null;
    lbImg.src = href;
    lbImg.alt = alt || "Screenshot, shown full size";
    if (lbCap) lbCap.textContent = cap || "";
    lb.hidden = false;
    doc.body.classList.add("lb-open");
    if (lbBox) lbBox.focus({ preventScroll: true });
  }
  function lbClose() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    doc.body.classList.remove("lb-open");
    if (lbImg) { lbImg.removeAttribute("src"); lbImg.alt = ""; }
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    opener = null;
  }

  if (lb) {
    doc.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[data-cap]") : null;
      if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;   /* middle/cmd-click still opens the file */
      e.preventDefault();
      var img = a.querySelector("img");
      lbOpen(a.getAttribute("href"), img ? img.getAttribute("alt") : "", a.getAttribute("data-cap"), a);
    });
    lb.addEventListener("click", function (e) {
      if (e.target.closest("[data-lb-close]")) lbClose();
    });
    doc.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); lbClose(); return; }
      if (e.key !== "Tab") return;
      var items = lb.querySelectorAll("button,[href],img[tabindex]");
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && (doc.activeElement === first || doc.activeElement === lbBox)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- pointer-only layer: cursor, hero spotlight, magnetic button ---------- */
  if (fine) {
    var spot = doc.querySelector(".hero-spot");
    var dot = doc.createElement("div"), ring = doc.createElement("div"), lbl = doc.createElement("span");
    dot.className = "cur-dot"; ring.className = "cur-ring";
    dot.setAttribute("aria-hidden", "true"); ring.setAttribute("aria-hidden", "true");
    ring.appendChild(doc.createElement("i"));
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
      doc.body.classList.add("cur-on");
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      if (spot) spot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      if (!moving) { moving = true; rAF(loop); }
      window.clearTimeout(idle);
      idle = window.setTimeout(function () { doc.body.classList.remove("cur-on"); }, 2400);
    }, { passive: true });

    if (heroEl && spot) {
      heroEl.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") heroEl.classList.add("is-live"); });
      heroEl.addEventListener("pointerleave", function () { heroEl.classList.remove("is-live"); });
    }
    doc.addEventListener("pointerover", function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      var hit = t.closest("a,button,[data-cursor]");
      if (!hit) { doc.body.classList.remove("cur-link"); doc.body.classList.remove("cur-img"); return; }
      var shot = !!hit.getAttribute("data-cap");
      doc.body.classList.toggle("cur-img", shot);
      doc.body.classList.toggle("cur-link", !shot);
      if (!shot) lbl.textContent = hit.getAttribute("data-cursor") || (hit.target === "_blank" ? "Open" : "Go");
    }, { passive: true });
    doc.addEventListener("pointerout", function (e) {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("a,button,[data-cursor]")) return;
      doc.body.classList.remove("cur-link", "cur-img");
    }, { passive: true });

    [].forEach.call(doc.querySelectorAll("[data-magnet]"), function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var w = r.width || 1, h = r.height || 1;
        var dx = Math.max(-8, Math.min(8, (e.clientX - (r.left + w / 2)) * 0.14));
        var dy = Math.max(-8, Math.min(8, (e.clientY - (r.top + h / 2)) * 0.22));
        el.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }
})();
