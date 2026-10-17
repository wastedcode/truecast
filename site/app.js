/* truecast.dev: progressive enhancement only. With JS off every command is selectable text and every
   figure is drawn in its final frame. Motion (styles.css) runs only under .js and without reduced motion. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");
  var status = document.getElementById("copy-status");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var keys = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘C" : "Ctrl+C";

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

  // Clipboard API first; execCommand for insecure contexts; otherwise select the text and say which keys.
  function copyText(text, el) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacy(text, el); });
    }
    return legacy(text, el);
  }
  function legacy(text, el) {
    return new Promise(function (resolve, reject) {
      var tmp = null;
      try {
        if (!el) {
          tmp = document.createElement("textarea");
          tmp.value = text;
          tmp.setAttribute("readonly", "");
          tmp.style.position = "fixed"; tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
        } else { selectText(el); }
        var ok = document.execCommand && document.execCommand("copy");
        window.getSelection().removeAllRanges();
        if (tmp) tmp.remove();
        ok ? resolve() : reject();
      } catch (e) { if (tmp) tmp.remove(); reject(e); }
    });
  }

  function setIcon(btn, id) {
    var use = btn.querySelector("use");
    if (use) use.setAttribute("href", id);
  }

  function flash(btn, state) {
    btn.setAttribute("data-state", state);
    if (state === "done") setIcon(btn, "#i-done");
    window.clearTimeout(btn._t);
    btn._t = window.setTimeout(function () {
      btn.removeAttribute("data-state");
      setIcon(btn, "#i-copy");
    }, state === "fail" ? 4000 : 2000);
  }

  var ICON = '<svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>';
  Array.prototype.forEach.call(document.querySelectorAll("button.copy"), function (btn) {
    var target = btn.hasAttribute("data-copy") ? document.getElementById(btn.getAttribute("data-copy")) : null;
    var fixed = btn.getAttribute("data-copy-text");
    if (!target && !fixed) return;
    if (!btn.querySelector("svg")) btn.innerHTML = ICON;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      var text = fixed || target.textContent.replace(/\s+/g, " ").trim();
      copyText(text, target).then(function () {
        flash(btn, "done");
        say("Copied: " + text);
      }, function () {
        if (target) selectText(target);
        btn.setAttribute("data-fail", target ? "Press " + keys : text);
        flash(btn, "fail");
        say(target ? "Couldn’t copy automatically. The text is selected: press " + keys + "." : "Couldn’t copy. The command is " + text);
      });
    });
  });

  if (reduce) return;   // the page is already in its final frame

  // Once a figure has played, its parts rest as plain shapes: some full-page capture tools paint a finished
  // transform animation at its first frame, which would show an empty playbook.
  document.addEventListener("animationend", function (e) {
    var el = e.target;
    if (el.closest && el.closest(".f1")) {   // Fig. 1 can replay: when its last line lands, it rests in its final frame
      if (el.classList.contains("f1__find")) el.closest(".f1").classList.remove("play");
      return;
    }
    el.style.animation = "none";
  }, true);

  // Fig. 1 plays once on load, and again on Replay.
  var f1 = document.querySelector(".f1");
  var replay = document.querySelector(".replay");
  function play() {
    if (!f1) return;
    f1.classList.remove("play");
    void f1.offsetWidth;   // restart the CSS animations
    f1.classList.add("play");
  }
  play();
  if (replay) {
    replay.hidden = false;
    replay.addEventListener("click", play);
  }

  // The roster's drill runs row by row.
  Array.prototype.forEach.call(document.querySelectorAll(".ro__row .pb"), function (pb, i) { pb.style.setProperty("--row", i); });

  // Figs. 2–6 play once, the first time they're seen. A figure already on screen (or above it) at load is
  // never hidden: it is only armed if it starts below the fold, so a fast jump or a print never shows it empty.
  var figs = document.querySelectorAll(".f2, .f3, .f4, .f5, .f6");
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.35 });
  Array.prototype.forEach.call(figs, function (fig) {
    if (fig.getBoundingClientRect().top < window.innerHeight) return;
    fig.classList.add("arm");
    io.observe(fig);
  });
})();
