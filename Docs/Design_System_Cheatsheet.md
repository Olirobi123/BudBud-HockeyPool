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

## New component checklist

- [ ] One component per file, PascalCase name matching the export
- [ ] Reuses a `components/ui/` primitive rather than re-implementing it
- [ ] Zero hardcoded colours — semantic tokens only
- [ ] Data fetching lives in the thin wrapper, not the presentational child
- [ ] Pure logic extracted to a `.ts` module, not trapped in the component
- [ ] Loading, empty (`EmptyState`) and error states all handled
- [ ] `tabular-nums` on every figure that can change
- [ ] Keyboard reachable, `aria-label` on icon-only controls
- [ ] Responsive at all four breakpoints
- [ ] `npm run check` passes
