# Design System Cheatsheet

Quick reference. Full spec: `/Docs/Design_System.md`.

## The one rule

**Chrome is monochrome. Colour encodes state, one hue per meaning.**
Before adding colour ask *what state does this encode?* — if the answer is
"it looks nice", use a grey.

## Colour

| Need | Class |
|---|---|
| Page background | `bg-background` |
| Card surface | `bg-card` |
| Primary text | `text-foreground` |
| Secondary text / labels | `text-muted-foreground` |
| Borders & rules | `border-border` |
| Subdued fill | `bg-muted` |
| Hover surface | `hover:bg-accent` |
| Primary button | `bg-primary text-primary-foreground` (black) |
| **Game in progress** | `text-live` / `bg-live` / `border-live` |
| Error, injury | `text-destructive` |
| Positive delta | `text-positive` |
| Negative delta | `text-negative` |

### Identity colour (the only two exceptions)

| Need | How |
|---|---|
| Rank 1 / 2 / 3 | `<RankBadge rank={n} />` — never hand-roll medal colours |
| Division Nord marker / rule | `bg-division-nord`, `border-t-division-nord`, `from-division-nord/10` |
| Division Sud marker / rule | `bg-division-sud`, `border-t-division-sud`, `from-division-sud/10` |
| Division name as text | `text-division-nord-ink` / `text-division-sud-ink` (the bare token fails contrast) |
| The two sides of a trade | Nord blue left, Sud red right — by side, not by real division |

Medal colour stops at the badge; division colour stops at markers, bands and
rules. Neither goes on a heading, a row background or a points figure, and
`--division-sud` never goes on a border or anything animated — that is
`--live`'s job.

❌ **Never**: `bg-slate-*`, `text-gray-*`, `from-blue-*`, `text-cyan-*`,
`bg-amber-*`, any numbered Tailwind palette utility, any raw hex, any
`dark:` prefix (there is no dark mode).

## Type

| Need | Class |
|---|---|
| Body | inherits `font-sans` (Inter) |
| Heading / score / abbrev | `font-display` (Oswald) |
| Section label | `font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground` |
| **Any updating number** | add `tabular-nums` |

## Layout

- Container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card `p-6`, dense card `p-3`, page grid `gap-6`, dense rail `gap-2`
- Check 375 / 768 / 1024 / 1440
- Inline nav at `lg` ⇒ mobile menu is `lg:hidden`

## Loading

The shell never blocks — there is no global spinner. Mount `<Layout>`
immediately, skeleton the content region.

```tsx
<Layout>
  <PageHeader title="…" subtitle="…" />
  {isLoading && <FeatureSkeleton />}
  {!isLoading && error !== null && <ErrorDisplay error={error} … />}
  {!isLoading && error === null && <Feature … />}
</Layout>
```

- Skeleton mirrors the real layout so nothing jumps · name it `<Feature>Skeleton.tsx`
- Errors render inside the layout too
- Never render a `0` you have not measured — use `—`
- `enabled: false` queries report `isLoading: false`; fold in the gating query

## New component checklist

- [ ] One component per file, PascalCase name matching the export
- [ ] Reuses a `components/ui/` primitive rather than re-implementing it
- [ ] Zero hardcoded colours — semantic tokens only
- [ ] Data fetching lives in the thin wrapper, not the presentational child
- [ ] Pure logic extracted to a `.ts` module, not trapped in the component
- [ ] Loading, empty (`EmptyState`) and error states all handled — **inside** `<Layout>`, never as a full-page block
- [ ] `tabular-nums` on every figure that can change
- [ ] Keyboard reachable, `aria-label` on icon-only controls
- [ ] Responsive at all four breakpoints
- [ ] `npm run check` passes
