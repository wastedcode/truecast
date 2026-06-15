/* truecast.dev — progressive enhancement only.
   The page is fully readable and correct with JS disabled:
   - .no-js styles show every .reveal element
   - copy buttons leave the command as selectable text when there's no clipboard
   All motion here is additionally gated by prefers-reduced-motion. */
(function () {
  "use strict";

  var doc = document.documentElement;
  // Flip from the no-js fallback to the JS-driven (initially hidden) state.
  // Done immediately so reveals start hidden, then animate in.
  doc.classList.remove("no-js");

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  var reveals = document.querySelectorAll(".reveal");

  /* If reduced motion OR no IntersectionObserver: just show everything now.
     No entrance animation. */
  function showAllNow() {
    each(reveals, function (el) {
      el.classList.add("is-in");
    });
  }

  /* Reduced motion: also stop the SVG SMIL motion (animateMotion isn't governed
     by the CSS animation tokens). pauseAnimations() freezes them at t=0. */
  if (reduceMotion) {
    each(document.querySelectorAll(".diagram__svg"), function (svg) {
      if (typeof svg.pauseAnimations === "function") {
        try {
          svg.pauseAnimations();
        } catch (e) {
          /* no-op: CSS already hides the travelling marks as a fallback */
        }
      }
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAllNow();
  } else {
    /* ---------- scroll-reveal ---------- */
    var io = new IntersectionObserver(
      function (entries) {
        each(entries, function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    each(reveals, function (el) {
      io.observe(el);
    });
  }

  /* ---------- copy-to-clipboard (unchanged behavior) ---------- */
  if (navigator.clipboard) {
    var buttons = document.querySelectorAll(".copy[data-copy-target]");

    var textFor = function (el) {
      var parts = el.querySelectorAll(".cmd__text");
      if (parts.length) {
        return Array.prototype.map
          .call(parts, function (p) {
            return p.textContent.trim();
          })
          .join("\n");
      }
      return el.textContent.trim();
    };

    each(buttons, function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(
          btn.getAttribute("data-copy-target")
        );
        if (!target) return;
        var label = btn.querySelector(".copy__label");
        var defaultText = label ? label.getAttribute("data-copy-default") : null;

        navigator.clipboard
          .writeText(textFor(target))
          .then(function () {
            btn.classList.add("is-copied");
            if (label) label.textContent = "Copied";
            window.clearTimeout(btn._copyTimer);
            btn._copyTimer = window.setTimeout(function () {
              btn.classList.remove("is-copied");
              if (label && defaultText) label.textContent = defaultText;
            }, 1800);
          })
          .catch(function () {
            if (label) label.textContent = "Press ⌘C";
            window.clearTimeout(btn._copyTimer);
            btn._copyTimer = window.setTimeout(function () {
              if (label && defaultText) label.textContent = defaultText;
            }, 1800);
          });
      });
    });
  }
})();
