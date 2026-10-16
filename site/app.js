/* truecast.dev: progressive enhancement only. With JS off, every command is selectable text,
   the close button is a link to step 1, and every playbook is drawn in full. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var status = document.getElementById("copy-status");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var keys = mac ? "⌘C" : "Ctrl+C";

  function say(msg) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () { status.textContent = msg; }, 30);
  }

  function selectText(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Clipboard API first; the old execCommand path for insecure contexts; otherwise select the
  // text and tell the visitor which keys to press.
  function copyText(text, el) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacy(text, el); });
    }
    return legacy(text, el);
  }
  function legacy(text, el) {
    return new Promise(function (resolve, reject) {
      try {
        selectText(el);
        if (document.execCommand && document.execCommand("copy")) {
          window.getSelection().removeAllRanges();
          resolve();
        } else { reject(); }
      } catch (e) { reject(e); }
    });
  }

  function flash(btn, state, label) {
    var span = btn.querySelector(".copy__label");
    var original = btn.getAttribute("data-label") || (span ? span.textContent : "");
    btn.setAttribute("data-label", original);
    btn.setAttribute("data-state", state);
    if (span && !btn.classList.contains("copy--icon")) span.textContent = label;
    window.clearTimeout(btn._t);
    btn._t = window.setTimeout(function () {
      btn.removeAttribute("data-state");
      if (span) span.textContent = original;
    }, state === "fail" ? 4000 : 2400);
  }

  // The text a block copies. A command written as lines (.ln) copies line by line; the one-line command
  // copies without its continuation mark (.cont), which only shows where the box makes it break.
  function textOf(target) {
    var text;
    if (target.querySelector(".ln")) {
      text = Array.prototype.map.call(target.querySelectorAll(".ln"), function (l) { return l.textContent; }).join("\n");
    } else {
      var c = target.cloneNode(true);
      Array.prototype.forEach.call(c.querySelectorAll(".cont"), function (n) { n.remove(); });
      text = c.textContent;
    }
    return text.replace(/\s+$/, "");
  }

  function copyFrom(btn, target, okMsg) {
    var text = textOf(target);
    return copyText(text, target).then(function () {
      flash(btn, "done", "Copied");
      say(okMsg || "Copied: " + text.split("\n")[0]);
    }, function () {
      selectText(target);
      flash(btn, "fail", "Press " + keys);
      say("Couldn’t copy automatically. The text is selected: press " + keys + ".");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("button.copy[data-copy]"), function (btn) {
    var target = document.getElementById(btn.getAttribute("data-copy"));
    if (!target) return;
    btn.hidden = false;
    if (!btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", "Copy");
    btn.addEventListener("click", function () { copyFrom(btn, target); });
  });

  // Close: one real button. It copies step 1, brings step 1 on screen, and confirms there, on
  // step 1's own Copy button, where the visitor's eyes now are. Focus moves to that button.
  var link = document.querySelector("a[data-copy-step1]");
  var step1 = document.getElementById("cmd-step1b");
  var step1Btn = document.querySelector('button[data-copy="cmd-step1b"]');
  var step1Li = document.getElementById("step-1");
  if (link && step1 && step1Btn && step1Li) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = link.className;
    btn.textContent = "Copy the install command";
    link.parentNode.replaceChild(btn, link);
    btn.addEventListener("click", function () {
      step1Li.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      step1Btn.focus({ preventScroll: true });
      copyFrom(step1Btn, step1, "Copied the install command. Step 1 is on screen: paste it in your terminal, then run step 2 in Claude Code.");
    });
  }

  // Fig. 3 and "Later": open on wide screens (their summaries don't toggle there); on phones each starts
  // folded, one tap away. With JS off both stay open.
  var folds = document.querySelectorAll(".sect__fold, .later__fold");
  if (folds.length && window.matchMedia) {
    var wide = window.matchMedia("(min-width: 48rem)");
    var setFolds = function () { Array.prototype.forEach.call(folds, function (f) { f.open = wide.matches; }); };
    setFolds();
    if (wide.addEventListener) wide.addEventListener("change", setFolds);
  }
  // A link into "Later" (from §2's update line) unfolds it first, so the commands it points at are there.
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#later-h"]'), function (a) {
    a.addEventListener("click", function () {
      var f = document.querySelector(".later__fold");
      if (f) f.open = true;
    });
  });

  // Fig. 1: join each band the run opened to the line in the log where it opened it.
  var card = document.querySelector(".run__card");
  var strip = card && card.querySelector(".run__pb .core");
  function leaders() {
    if (!card || !strip) return;
    var old = card.querySelector(".run__leaders");
    if (old) old.remove();
    if (!strip.getBoundingClientRect().width) return;     // the strip lies flat on small screens: no leaders
    var c = card.getBoundingClientRect();
    var s = strip.getBoundingClientRect();
    var vb = strip.viewBox.baseVal;
    var k = s.height / vb.height;
    var d = "";
    Array.prototype.forEach.call(card.querySelectorAll(".trace li[data-band]"), function (li) {
      var band = strip.querySelector('rect[data-path="' + li.getAttribute("data-band") + '"]');
      if (!band) return;
      var by = s.top - c.top + (band.y.baseVal.value + band.height.baseVal.value / 2) * k;
      var row = li.querySelector(".trace__v").getBoundingClientRect();
      var ry = row.top + row.height / 2 - c.top;
      // The vertical hugs the strip's edge, so it reads as the strip's own line; only the horizontal
      // reaches into the log, at the row that opened the band.
      var x0 = s.right - c.left + 2, xv = x0 + 4, x1 = row.left - c.left - 4;
      d += "M" + x0 + " " + by.toFixed(1) + "H" + xv.toFixed(1) + "V" + ry.toFixed(1) + "H" + x1.toFixed(1);
    });
    if (!d) return;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "run__leaders");
    svg.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    card.appendChild(svg);
  }
  var lt;
  function queueLeaders() { window.clearTimeout(lt); lt = window.setTimeout(leaders, 60); }
  leaders();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(leaders);
  window.addEventListener("resize", queueLeaders);

  // Once a band has drawn, it stays drawn as a plain shape: some full-page capture tools paint running
  // transform animations at their first frame, which would show an empty playbook.
  document.addEventListener("animationend", function (e) {
    if (e.animationName === "drill" || e.animationName === "drillx") e.target.style.animation = "none";
  }, true);

  // The drill: playbooks below the fold replay it the first time they're seen. They are drawn the
  // whole time before that, so a capture, a print or a fast jump never shows them empty.
  var drawings = document.querySelectorAll(".roster .pb, .close__cores .core");
  if (!reduce && "IntersectionObserver" in window && drawings.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    Array.prototype.forEach.call(drawings, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.5) return;
      el.classList.add("drill-armed");
      io.observe(el);
    });
  }
})();
