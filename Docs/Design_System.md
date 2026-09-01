# Design System — 38BudBud

**v2.0 · Monochrome dashboard**

> This document describes the system **as implemented**. v1.0 documented a dark
> palette and a 50-primitive component library that never existed in the code;
> both have been removed rather than carried forward. If you find a gap between
> this file and `client/src/index.css`, the CSS is the source of truth — fix the
> doc in the same commit.

---

## 1. The core rule

**Chrome is monochrome. Colour is reserved for state, and every hue encodes exactly one meaning.**

The application shell — navigation, footer, page and card surfaces, borders,
headings, table text — is greyscale, with no exceptions. Colour appears only
where it carries information.

| Token | Hue | Means | Appears on |
|---|---|---|---|
| `--live` | red | in progress, right now | LIVE dot + pulse, period/clock label, live card border |
| `--destructive` | red | error, injury | error states, injury badges |
| `--positive` | green | gain, positive delta | points gained tonight, upward movement |
| `--negative` | red | loss, negative delta | downward movement |
| `--rank-gold/silver/bronze` | medal | finishing position 1 / 2 / 3 | the rank badge, nothing else |
| `--division-nord` | blue | Division Nord | division band, standings rule, trade side A |
| `--division-sud` | red | Division Sud | division band, standings rule, trade side B |

NHL team logos and player headshots supply the remaining colour naturally, and
they do it better than any brand palette would — that colour is real data.

### Identity colour: the podium and the divisions

Two palettes sit outside the state model, because they encode a *fixed
property* rather than a changing state. They are the only ones, and they are
deliberately fenced in:

**The podium.** Gold, silver and bronze mark ranks 1, 2 and 3. Fourth place
down is grey. It lives in exactly one component — `components/ui/rank-badge.tsx`
— which every leaderboard, standings table and bilan table renders. Do not
re-implement it, and do not extend medal colour onto a row background, a
border, a heading or a points figure. The badge is the whole surface area.

**The divisions.** Nord is blue, Sud is red. A team's division never changes,
so the pair also serves as the neutral "two sides" palette on a trade card —
side A blue, side B red. That is by position on the card, not by the teams'
actual divisions: both teams in a trade are frequently in the same division,
and two blue columns would defeat the purpose.

Each division token ships in two weights. The bare token (`bg-division-nord`)
is the marker weight — dots, rules, bands, gradient washes. The `-ink` variant
(`text-division-nord-ink`) is darkened to clear 4.5:1 on white and is the only
one allowed on text.

### The test

Before adding any colour, ask: **what state does this encode?**
If the answer is *"it looks nice"* or *"it's the brand colour"*, use a grey.

### Why red is rare

On a night with three live games, exactly three cards carry red and the eye
lands on them instantly. That only works because nothing else on the page is
red. Every additional red element makes the live signal weaker. This is why
"points behind the leader" is muted grey rather than red, and why overtime
escalates the *same* red (a stronger border) instead of introducing amber.

`--division-sud` is the one other red on the page. It is pitched darker and
browner than `--live`, and it is barred from the two things that make live
red carry — borders and animation. A Sud marker is a static 8px dot or a 3px
rule; a live signal pulses. If you find yourself putting `--division-sud` on
a card border, you are weakening the live state and should use a grey.

---

## 2. Tokens

All tokens live in `:root` in `client/src/index.css` as raw HSL triplets, and are
exposed to Tailwind in `client/tailwind.config.ts`. Always use the semantic
Tailwind class (`bg-card`, `text-muted-foreground`), never a raw hex or a
numbered Tailwind palette utility.

### Surfaces & ink

| Token | Value | Hex | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `#FFFFFF` | page background |
| `--foreground` | `0 0% 4%` | `#0A0A0A` | primary ink, headings, numbers |
| `--card` | `0 0% 100%` | `#FFFFFF` | card surface |
| `--card-foreground` | `0 0% 4%` | `#0A0A0A` | text on cards |
| `--popover` / `--popover-foreground` | as card | — | popovers, sheets |
| `--muted` | `0 0% 96%` | `#F5F5F5` | subdued fills, ticker strip |
| `--muted-foreground` | `240 4% 46%` | `#52525B` | secondary text, labels |
| `--border` | `240 6% 90%` | `#E4E4E7` | all rules and card borders |
| `--input` | `240 6% 90%` | `#E4E4E7` | form field borders |

### Interactive

| Token | Value | Usage |
|---|---|---|
| `--primary` | `0 0% 9%` | primary buttons, active toggle — black, not blue |
| `--primary-foreground` | `0 0% 98%` | text on primary |
| `--secondary` / `--accent` | `0 0% 96%` | hover surface — a grey, deliberately hueless |
| `--ring` | `0 0% 4%` | focus outline |
| `--radius` | `0.375rem` | base radius; `lg`/`md`/`sm` derive from it |

### State

| Token | Value | Hex |
|---|---|---|
| `--live` | `358 77% 50%` | `#E11D26` |
| `--destructive` | `358 70% 45%` | `#C4222A` |
| `--positive` | `142 60% 30%` | `#1F7A3D` |
| `--negative` | `358 70% 45%` | `#C4222A` |

### Podium

Ranks 1–3 only, and only on the rank badge. `-fill` is the badge background,
`-ink` the numeral, and the bare token the ring at 40% opacity.

| Token | Value | Hex |
|---|---|---|
| `--rank-gold` / `-fill` / `-ink` | `43 89% 38%` / `45 94% 93%` / `38 88% 26%` | `#B7900F` / `#FDF4DC` / `#7C5308` |
| `--rank-silver` / `-fill` / `-ink` | `215 16% 55%` / `214 25% 94%` / `215 22% 34%` | `#7A879B` / `#EDF0F5` / `#44546A` |
| `--rank-bronze` / `-fill` / `-ink` | `24 60% 45%` / `26 62% 93%` / `22 62% 30%` | `#B86A2E` / `#FAEBE0` / `#7B3F1D` |

### Divisions

Bare token for markers and rules; `-ink` for text on white.

| Token | Value | Hex |
|---|---|---|
| `--division-nord` | `217 91% 60%` | `#3B82F6` |
| `--division-nord-ink` | `224 76% 48%` | `#1D4ED8` |
| `--division-sud` | `6 78% 57%` | `#EA4B3B` |
| `--division-sud-ink` | `6 72% 42%` | `#B82D1E` |

### Theme

Light only. `darkMode: ["class"]` remains in the Tailwind config and the tokens
are structured so a `.dark {}` block could be added later, but **there is no dark
mode today** — no theme provider, no toggle, and no `.dark` selector. Do not add
`dark:` utilities; they will not do anything.

---

## 3. Typography

Loaded once, from `client/index.html`. Do not add `@import` rules to the CSS.

| Face | Tailwind | Usage |
|---|---|---|
| Inter | `font-sans` (default on `body`) | all body copy, tables, forms |
| Oswald | `font-display` | headings, team abbreviations, scores, uppercase labels |

**Numbers**: any figure that updates in place — scores, clocks, points, PPM —
must carry `tabular-nums`, or the digits jitter on every refresh.

**Uppercase labels**: `font-display text-xs font-semibold uppercase tracking-wider
text-muted-foreground` is the standard section-label recipe.

---

## 4. Components

26 primitives in `client/src/components/ui/`:

`GoalieIcon`, `alert`, `avatar`, `badge`, `breadcrumb`, `button`, `card`,
`dialog`, `empty-state`, `error-display`, `form`, `input`, `label`, `page-header`,
`pagination`, `rank-badge`, `select`, `sheet`, `skeleton`, `stat-tooltip`, `table`,
`tabs`, `team-dg-tooltip`, `textarea`, `toast`, `toaster`.

That is the whole list. There is no accordion, checkbox, switch, slider,
calendar, popover, tooltip, dropdown-menu, separator, scroll-area, progress,
chart, carousel, command, or menubar — add the shadcn primitive properly if you
need one rather than hand-rolling it.

**`EmptyState`** (`components/ui/empty-state.tsx`) is the shared empty
treatment: a Lucide icon at 30% opacity above a muted message, with an optional
hint line. Use it instead of adding a new variant.

### Structure

Per `CLAUDE.md`: one component per file; feature folders under `components/`;
when a feature grows past one file, create a named lowercase subfolder where the
parent is a thin wrapper that fetches data and owns loading/empty/error states,
and the children are pure and take props. `components/home/tonight/` is the
reference example.

Pure logic belongs outside components. `components/scores/gameState.ts` holds
every interpretation of NHL game state (`formatGameState`, `getGameStatus`,
`getWinners`, `sortGamesByPriority`, `hasLiveGame`) so the ticker and the home
scoreboard cannot drift apart.

---

## 5. Layout & spacing

- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card padding: `p-6` (shadcn default); dense scoreboard cards use `p-3`
- Grid gaps: `gap-6` for page-level grids, `gap-2` for dense card rails
- Mobile-first: every layout must be checked at 375 / 768 / 1024 / 1440

**Breakpoint discipline**: inline nav links appear at `lg`, so the mobile menu
must be `lg:hidden` — not `md:hidden`. Mismatching those two left 768–1023px
with no navigation at all for some time.

---

## 6. Loading states

**The shell never blocks.** There is no global loading overlay and no
full-page spinner — `LoadingProvider`, `usePageLoading` and the `Loading`
component were all removed. A page mounts its `<Layout>` on the first frame,
so navigation, the ticker and the page header are usable while data is still
in flight.

Inside the layout, the content region renders a skeleton:

```tsx
<Layout>
  <PageHeader title="Échanges" subtitle="Historique des transactions" />
  {isLoading && <EchangeListSkeleton />}
  {!isLoading && error !== null && <ErrorDisplay error={error} … />}
  {!isLoading && error === null && <EchangeList echanges={filtered} />}
</Layout>
```

Rules:

- **A skeleton mirrors the real layout.** Same card count, same column widths,
  same row heights — its whole job is to stop the page jumping when data
  lands. Name it `<Feature>Skeleton.tsx` and put it beside the component it
  stands in for.
- **Errors stay inside the layout too.** An error is not a reason to throw
  away the nav.
- **Render what you already know.** Static content does not wait on a fetch:
  the Québec map draws immediately and only its team counts are deferred.
- **Never show a zero you have not measured.** A count that reads `0` during
  load is a wrong answer, not a placeholder — show `—` or a skeleton.
- **Watch disabled queries.** A TanStack query with `enabled: false` reports
  `isLoading: false`, so a page keyed off a second fetch can flash an empty
  state. Fold the gating query's own loading flag in.

---

## 7. Motion

Three animations survive, defined in `index.css`: `fadeIn`, `slideUp`, and
Tailwind's `animate-ping` for the live pulse. All decorative motion (`float`,
`glowPulse`, `iceDrift`, `shimmer`) has been removed.

Every animation must be disabled under `prefers-reduced-motion: reduce`.
Interactive transitions are declared with explicit `transition-property` and a
single `transition-duration`; never use the `transition: a, b, c 0.2s` shorthand,
which silently applies the duration to the last property only.

---

## 8. Known exceptions

These predate v2.0 and are scheduled for follow-up, not endorsed:

- Roughly 300 hardcoded Tailwind palette utilities remain in feature components
  (tables, badges, tooltips, playoff bracket).
- `bilan` heatmap cells use hardcoded `#2563eb` / `#60a5fa`.
- Four empty states have not yet been migrated onto `EmptyState`.

New code does not get to add to this list.
