# How we chose the marketer that wrote truecast.dev

On 2026-10-17 we ran a blind bake-off between four versions of our `product-marketer` teammate. Each wrote
a homepage copy deck for truecast.dev from the same brief, twice. Judges scored the eight drafts without
knowing which version wrote which. The winner became `product-marketer` 1.6.0, and 1.6.0 wrote the copy deck for
the current homepage (its hand-off, and every change made after it, are in [`../homepage/`](../homepage/)).

Everything here is as the runs and judges produced it, except local machine paths, which are replaced with
`~/…` or `<a throwaway HOME>`.

## The four versions

| arm | what it was |
|---|---|
| A | `product-marketer` as it shipped on `main` that day |
| B | A plus one rule: before handing off, run an outside judge that can disagree with you, fix what it returns, and name it in the hand-off |
| C | no persona at all: the same model and tools with an empty system prompt |
| D | a marketer rebuilt on Rieseberg's essay, as [`RUBRIC.md`](RUBRIC.md) describes |

The task ([`task.md`](task.md)) and the model, tools and repo were the same for all eight runs. Only the
system prompt changed; the three persona prompts are in [`prompts/`](prompts/) (C had none).

## How it was judged

Both rubrics were written and timestamped (2026-10-17T04:36:42Z, [`sealed-at.txt`](sealed-at.txt)) before any run, and the drafts were
renamed to random IDs ([`key.json`](key.json) maps them back; it was opened after all scores were in).

- **Defects** ([`RUBRIC.md`](RUBRIC.md)): two judges per draft, each counting claims with no source, claims
  wider than their evidence, facts that are false, inconsistent names, and things a founder would require
  that the draft lacks. Lower is better. [All 16 judgements](defect-judgements/).
- **Ambition** ([`RUBRIC-AMBITION.md`](RUBRIC-AMBITION.md)): three more judges each read all eight drafts side
  by side, in a different order, and ranked them on the boldest idea that holds up. Each had to argue for the
  riskiest draft and against the safest before ranking. [All three verdicts](ambition-judgements/).

## Results

| arm | findings per draft (mean of 2 judges) | blocker + material | ambition rank (mean of 3 judges, 1 = best) | cost per run |
|---|---|---|---|---|
| A, as shipped | 10.0 | 3.8 | 4.3 | $2.84 |
| B, + outside judge | 7.8 | 3.3 | **1.5** | $15.27 |
| C, no persona | 9.8 | 1.8 | 6.0 | $1.92 |
| D, essay rebuild | 7.8 | 1.3 | 6.2 | $10.79 |

Figures from [`scores-blind.json`](scores-blind.json) and [`runs.json`](runs.json) (each run's `total_cost_usd`, `duration_ms` and turns).

- **Our shipped marketer did no better than no persona.** A had about as many findings as C, and more
  serious ones.
- **The outside judge won on ambition.** All three ambition judges ranked B's two drafts 1st and 2nd. On
  defects it had fewer than A (C's 2.0 gap sits right at the noise line below) and tied D, but it had more
  serious findings than C or D, and one of its drafts drew a blocker from both judges.
- **It costs more.** B averaged $15.27 a run against $2.84 for A.
- **B's drafts were also the longest** (about 10,400–10,800 words against 6,400–8,400), so we can't rule out that
  judges favoured length.
- Two judges reading the same draft differed by 2.1 findings on average (at most 5), so gaps under about 2
  are noise at two runs per arm.

We shipped B's rule as `product-marketer` 1.6.0. The rescore that adjusted for evidence runs created in their
own working copy (they were judged against `main`) moves B to 6.8 findings and 2.2 serious; the table above is unadjusted.

## What the judges proposed

The ambition judges independently picked the same idea as the best of the eight: say on the page that it was
made by truecast's own teammates, and publish the hand-offs. All three said to go further and publish how the
page was made: the losing drafts, the scores and the rubric. This folder is that.

## What it didn't settle

These drafts were for the previous homepage, which ran to about 2,600 words. Neither rubric scored length,
and our founder's verdict on the page that came out of this round was that it was too long. The current page
was rewritten from scratch by 1.6.0 under a budget: at most 800 words.

Some runs made new evidence in their own working copy (a `product-manager` run on our roadmap, a token
derivation). The drafts and judgements refer to it under `evidence/`; it isn't published here. The token
derivation is now in [the proof README](../README.md).

## Files

- [`drafts/`](drafts/): the eight decks, under their blind IDs
- [`defect-judgements/`](defect-judgements/), [`ambition-judgements/`](ambition-judgements/)
- [`prompts/`](prompts/): arms A, B and D's system prompts
- [`task.md`](task.md), [`RUBRIC.md`](RUBRIC.md), [`RUBRIC-AMBITION.md`](RUBRIC-AMBITION.md), [`sealed-at.txt`](sealed-at.txt),
  [`key.json`](key.json), [`scores-blind.json`](scores-blind.json), [`runs.json`](runs.json)
