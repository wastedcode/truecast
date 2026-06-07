---
name: surface-the-signal
description: Use when output, status, notifications, or system messages are scattered across multiple places (panes, channels, logs, replies, toasts, emails) — consolidate them into one glanceable surface so the user always knows the system's state from a single look, instead of hunting across channels.
---
# Surface the signal — one glanceable place, not scattered channels

Information surfacing is a *consolidation* problem, not a within-screen hierarchy problem. The failure
isn't "this card is too low-contrast" — it's "the system is telling me things in five different places and
I can't tell what's happening." Status in a log file, a reply in one pane, a toast that already vanished,
an email three apps away: each is individually fine and collectively a shit show. The user's question is
always the same — **"what is the system doing right now, and does anything need me?"** — and they should
answer it with one glance at one surface, not by triangulating across channels.

This is upstream of `compose-the-layout` (which orders *one* screen) and `design-the-states` (which designs
*one* state): first decide **where the truth lives**, then compose it.

## The method
1. **Inventory every channel.** List *every* place the system currently emits signal: stdout/logs, status
   bars, toasts, banners, badge counts, separate panes/tabs, replies vs. system messages, emails, push,
   exit codes. Most "surfacing is a mess" problems are invisible until you enumerate the channels.
2. **Classify each signal by what the user must do with it.**
   - **Ambient state** — "what's true right now" (running/idle/blocked, counts, last result). Belongs on a
     persistent, always-visible surface; never a transient toast.
   - **Transient acknowledgement** — "that worked / that failed" (saved, sent, copied). A brief in-place
     confirmation, then gone.
   - **Demands-action** — "you must decide/fix something." Must be impossible to miss and must persist
     until resolved — never a toast that auto-dismisses before the user looks.
   - **Reference / history** — "what happened earlier." A log/feed you can scroll back through, not the
     primary surface.
3. **Design the single primary surface** — one feed/status surface that answers "what's happening + does
   anything need me?" Ambient state lives here persistently; demands-action items pin to the top and don't
   leave until resolved; transient acks flash and fade; history is one scroll away from the same place. One
   place to look, ordered by what needs the user.
4. **Collapse redundant channels; route the rest into the one surface.** If the same event fires a toast
   *and* a log line *and* an email, that's three half-truths — pick the canonical home and route the others
   there (this is the DRY/single-source-of-truth instinct applied to the UI surface).
5. **Make state legible at a glance.** Consistent status vocabulary and signifiers (one running indicator,
   one blocked indicator, one done indicator — reused everywhere, never reinvented per screen), counts that
   are scannable (tabular nums), and a clear empty-state ("nothing needs you") that is itself a status, not
   a blank.

## The discipline
- **One question, one glance, one place.** If answering "is it working / does it need me?" requires looking
  in two places, the surfacing has failed — consolidate.
- **State is persistent; events are transient.** Never encode "what's true right now" in a notification
  that disappears — a user who looked away has now lost the truth.
- **Never let a demands-action signal be missable.** A toast that auto-dismisses is the wrong vehicle for
  anything the user must act on.
- **Reuse the status vocabulary** — one running/blocked/done language across every surface, so the same
  state always looks the same (`build-on-the-design-system`); a new status style per screen *is* the scatter
  reappearing inside one app.
- When the *content* of a signal (which events exist, what they mean, what's worth interrupting for) is a
  product or system question rather than a presentation one, **consult the product-manager / software-
  engineer** — you own *where and how* the signal surfaces, not *which* events are worth raising.
