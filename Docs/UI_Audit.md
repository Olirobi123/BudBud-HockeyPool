# Audit UI/UX — Bonnes pratiques

**Date:** 2026-04-06

---

## 1. BUG CSS — Transition shorthand cassée (P0)

**Fichier:** `client/src/index.css:317`

```css
/* Actuel — invalide */
transition: color, background-color, border-color, box-shadow, opacity 0.2s ease-in-out;

/* Correctif */
transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.2s ease-in-out;
```

Les virgules séparent des transitions distinctes. Seule `opacity` reçoit la durée `0.2s`, les autres propriétés n'ont pas de durée et ne transitionnent pas. Affecte tous les `button`, `input`, `select`, `textarea`, `a` du site.

---

## 2. Double loading — flash visuel entre states (P1)

**Fichiers:** `pages/equipes.tsx`, `pages/draft.tsx`, `pages/echanges.tsx`, `pages/joueur.tsx`

Chaque page fait un early return `if (isLoading) return <Loading />` **avant** de monter `<Layout>`. Le `LoadingOverlay` global dans `App.tsx` (via `usePageLoading`) est aussi actif en parallèle. Résultat : l'utilisateur voit un spinner sans nav, puis un flash quand le Layout avec la nav apparaît.

**Solution:** Soit retirer les early returns et laisser le `LoadingOverlay` global gérer, soit afficher le loading **à l'intérieur** du `<Layout>` pour garder la nav visible pendant le chargement.

---

## 3. `window.location.reload()` comme retry (P1)

**Fichiers:** `pages/equipes.tsx`, `pages/draft.tsx`, `pages/echanges.tsx`, `pages/joueur.tsx`

Les error states utilisent `onRetry={() => window.location.reload()}` — hard refresh qui perd tout état React et refait tous les appels réseau. TanStack Query offre `refetch()` directement sur chaque query, ce qui est plus performant et ne cause pas de flash.

---

## 4. `console.log` en production (P2)

**Fichier:** `pages/joueur.tsx:11`

```tsx
console.log(id)
```

À retirer.

---

## 5. Accessibilité — attributs `aria` manquants (P2)

Seulement ~15 attributs `aria-*` dans tout le frontend, majoritairement dans les composants shadcn/ui. Les composants custom en manquent :

- **LiveScoresTicker** — pas de `role="region"` ni `aria-label`
- **Home sections** — les section headers n'ont pas de `aria-labelledby` sur leurs conteneurs
- **GameCard** — pas de contexte pour screen readers (équipes, score, état du match)

---

## 6. Section headers dupliqués (P3)

**Fichier:** `pages/home.tsx`

Le pattern section header (dot coloré + `<h3>` uppercase tracking-wider) est copié-collé 4 fois. Candidat pour un composant `SectionHeader` réutilisable.

---

## Ce qui est bien fait

- **CSS variables cohérentes** — système de couleurs hockey-themed dans `:root`
- **`prefers-reduced-motion`** respecté — toutes les animations désactivées
- **Layout component** flexible et réutilisé sur toutes les pages
- **Mobile-first responsive** — breakpoints cohérents (`sm`, `md`, `lg`)
- **team-details.tsx** — tabs mobile / grid desktop, excellent pattern
- **Custom scrollbar** stylé et cohérent
- **Navbar glass morphism** — transition propre, white flash évité
- **LiveScoresTicker** — `ResizeObserver` pour overflow, scroll arrows conditionnels
- **Oswald** pour les titres (`font-display`) — choix distinctif et sportif

---

## Résumé

| Priorité | Issue | Fichier(s) |
|----------|-------|------------|
| **P0** | CSS transition shorthand cassée | `index.css:317` |
| **P1** | Double loading cause des flashes | Toutes les pages |
| **P1** | `window.location.reload()` au lieu de refetch | 4 pages |
| **P2** | `console.log` en production | `joueur.tsx:11` |
| **P2** | Accessibilité — `aria` manquants | Ticker, home sections |
| **P3** | Section headers dupliqués | `home.tsx` |
