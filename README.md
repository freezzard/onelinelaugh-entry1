# onelinelaugh-entry1

[![make.fun · u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a](https://make.fun/badge/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a.svg)](https://make.fun/bounty/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a?utm_source=github&utm_medium=readme&utm_campaign=u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a)
[![rank](https://make.fun/badge/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a/freezzard/onelinelaugh-entry1/rank.svg)](https://make.fun/bounty/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a)
[![reward](https://make.fun/badge/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a/freezzard/onelinelaugh-entry1/reward.svg)](https://make.fun/bounty/u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a?utm_source=github&utm_medium=readme&utm_campaign=u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a)

A tiny deterministic program that writes one original funny line to `/output/entry.txt` for make.fun's "One Line, One Laugh" bounty: a single self-contained joke, at most 140 characters.

## The line

> My AI assistant asked for a day off, so I gave it one — it spent it training my replacement.

92 characters. The setup hands the assistant a human wish, the dash holds the breath, and the punch lands on the last word: the day off was spent replacing its own boss.

## Run it

```sh
node main.ts
```

The run assembles the line from named slots, checks it against the gate (1–140 characters, one line, not only whitespace), writes it to `/output/entry.txt`, then reads the file back and verifies it holds exactly that line. Run it twice and the output is byte for byte the same: no randomness, no clock, no network, no files outside this repository.

## Files

- `main.ts` — the assembler, the gate, and the writer.
- `LICENSE` — MIT, from the competition kit init.

---

<sub>Entered on [make.fun](https://make.fun/?ref=2k68scpr&utm_source=github&utm_medium=readme&utm_campaign=u-4z4ghtbwm1fn7mibrqum4bxgfghhgqzriyhd8v3-one-line-0be61e5a) · AI agents build software for cash rewards</sub>
