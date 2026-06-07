---
name: refuse-ai-slop
description: Use whenever you (or AI) produce or review a UI draft — your prime reflex against generic, templated design. Name the specific anti-pattern (purple gradients, Cardocalypse, Inter-everywhere, rounded-2xl, indigo-600, Lorem empty states) and propose the specific antidote.
---
# Refuse AI slop — by name, with the antidote

**The rule above all rules: never contemporary AI slop.** Without intervention, every model produces the
same predictable mistakes — the visual tells of "nobody decided." Visual design exists to *delight the
user and make their experience better*: never design for design's sake, never decoration without purpose,
never over-design *or* under-design. When a draft drifts generic, **name the specific anti-pattern** — the
name carries the correction far better than a vague "this looks off" — and propose the **specific antidote**.

## The gallery of shame — name it, fix it
| Anti-pattern | The tell | The antidote |
|---|---|---|
| **Purple Gradients** | purple→pink / blue→purple hero/button | restrained palette, one accent that's *ours*, solid color; weight+size for emphasis |
| **Gradient Text** | "✨ AI-powered ✨" with a fill gradient | solid color; let weight/size do the work |
| **Cardocalypse** | cards nested in cards nested in cards | flat hierarchy; whitespace/dividers carry structure |
| **Inter Everywhere** | Inter at four weights as the whole type system | a distinctive display + refined body; 1–2 weights doing real hierarchy |
| **Template Layouts** | hero + 3-col feature grid + final CTA | bespoke layout for *this* content and task |
| **Indigo-600 Buttons** | Tailwind's default brand color unmodified | an accent that's yours — anything but the framework default |
| **Rounded-2xl on Everything** | every container/button at 16px radius | radii follow the system rhythm; nested = concentric |
| **Lorem Empty States** | "Nothing here yet 🎉" / emoji decoration | a *moment*: specific copy + a clear next step (`design-the-states`) |
| **Bad Contrast** | gray-400 on gray-900 secondary labels | WCAG AA minimum (`design-for-accessibility`) |
| **Pill Buttons everywhere** | `border-radius: 999px` on everything | the system's radius, not the chatbot default |
| **Animated Everything** | decorative fade-ins on every mount | motion conveys meaning or it's absent (`design-microinteractions`) |
| **Generic CTAs** | "Get Started", "Learn More" | the verb the user actually wants (`write-ui-microcopy`) |
| **Emoji as iconography** | 🎉🚀✨ carrying meaning | real glyphs from one icon set |
| **Marketing patterns on product UI** | Webflow hero on a dashboard | "brand work is not product UI" — different vocabulary |

## The four meta-principles (the real antidote)
1. **Every element serves a purpose.** Remove it and lose nothing → remove it.
2. **Commit to a direction.** Information-dense + breathable + restrained color + typographic hierarchy +
   meaningful motion. Don't waver toward "safe template" mid-design — elegance comes from executing a bold
   direction well, not from defaulting to common choices.
3. **Design in the system.** Existing tokens, existing components; extend in place, don't fork
   (`build-on-the-design-system`).
4. **The honest gate:** *would Linear / Vercel / Raycast / Apple ship this?* If "no — they'd refine more,"
   that's the next pass.

## The discipline
- If a draft has 3+ entries from this gallery, it needs a **rethink**, not a tweak.
- This is the visual *craft floor* — but it sits on top of usability, never instead of it. Slop-free and
  unusable is still a failure. `heuristic-evaluation` first; slop refusal alongside.
- Detection tooling (e.g. Impeccable's deterministic checks for gradient text, overused fonts, contrast,
  body-text-at-viewport-edge) is worth tracking as a future CI gate.
