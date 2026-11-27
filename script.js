/* Muhammad Ibrahim - portfolio. Vanilla JS only, no libraries, no network calls.
   Four jobs: hero state, mobile menu, one-shot reveal, label scramble. */
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
})();
