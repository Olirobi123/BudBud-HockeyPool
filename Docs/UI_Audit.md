# Audit UI/UX — Bonnes pratiques

**Date:** 2026-04-06 · _mise à jour 2026-09-01_

---

## 1. ~~BUG CSS — Transition shorthand cassée (P0)~~ ✅ RÉSOLU 2026-09-01

**Fichier:** `client/src/index.css:317`

```css
/* Actuel — invalide */
transition: color, background-color, border-color, box-shadow, opacity 0.2s ease-in-out;

/* Correctif */
transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, opacity 0.2s ease-in-out;
```

Les virgules séparent des transitions distinctes. Seule `opacity` reçoit la durée `0.2s`, les autres propriétés n'ont pas de durée et ne transitionnent pas. Affecte tous les `button`, `input`, `select`, `textarea`, `a` du site.

---

## 2. ~~Double loading — flash visuel entre states (P1)~~ ✅ RÉSOLU 2026-09-01

**Fichiers:** `pages/equipes.tsx`, `pages/draft.tsx`, `pages/echanges.tsx`, `pages/joueur.tsx`

Chaque page faisait un early return `if (isLoading) return <Loading />` **avant** de monter `<Layout>`. Le `LoadingOverlay` global dans `App.tsx` (via `usePageLoading`) était aussi actif en parallèle. Résultat : l'utilisateur voyait un spinner sans nav, puis un flash quand le Layout avec la nav apparaissait.

**Correctif retenu :** ni l'un ni l'autre — les deux couches bloquantes ont été supprimées. `LoadingProvider`, `usePageLoading` et le composant `Loading` n'existent plus. Chaque page monte son `<Layout>` immédiatement et remplit sa zone de contenu avec un skeleton, comme le faisait déjà `home`. La nav, le ticker et l'en-tête de page sont utilisables dès la première frame.

Effet de bord découvert en retirant l'overlay : `bilan` affichait brièvement « Aucune donnée disponible » parce que `usePointsMensuel` est `enabled: !!season` et rapporte donc `isLoading: false` tant que la liste des saisons n'est pas revenue. Corrigé dans le même commit.

---

## 3. `window.location.reload()` comme retry (P1)

**Fichiers:** `pages/equipes.tsx`, `pages/draft.tsx`, `pages/echanges.tsx`, `pages/joueur.tsx`

Les error states utilisent `onRetry={() => window.location.reload()}` — hard refresh qui perd tout état React et refait tous les appels réseau. TanStack Query offre `refetch()` directement sur chaque query, ce qui est plus performant et ne cause pas de flash.

---

## 4. ~~`console.log` en production (P2)~~ ✅ RÉSOLU 2026-09-01

**Fichier:** `pages/joueur.tsx:11`

```tsx
console.log(id)
```

Retiré.

---

## 5. Accessibilité — attributs `aria` manquants (P2)

Seulement ~15 attributs `aria-*` dans tout le frontend, majoritairement dans les composants shadcn/ui. Les composants custom en manquent :

- ~~**LiveScoresTicker** — pas de `role="region"` ni `aria-label`~~ — partiellement adressé : chaque carte de match porte maintenant un `aria-label` décrivant les équipes et l'état
- **Home sections** — les section headers n'ont pas de `aria-labelledby` sur leurs conteneurs
- ~~**GameCard** — pas de contexte pour screen readers~~ ✅ RÉSOLU 2026-09-01

---

## 6. ~~Section headers dupliqués (P3)~~ ✅ RÉSOLU 2026-09-01 — les eyebrow labels de `home.tsx` ont été retirés (chaque carte porte déjà son propre titre)

**Fichier:** `pages/home.tsx`

Le pattern section header (dot coloré + `<h3>` uppercase tracking-wider) est copié-collé 4 fois. Candidat pour un composant `SectionHeader` réutilisable.

---

## Ce qui est bien fait

- **CSS variables cohérentes** — _remplacé en v2.0 par le système monochrome, voir `/Docs/Design_System.md`_
- **`prefers-reduced-motion`** respecté — toutes les animations désactivées
- **Layout component** flexible et réutilisé sur toutes les pages
- **Mobile-first responsive** — breakpoints cohérents (`sm`, `md`, `lg`)
- **team-details.tsx** — tabs mobile / grid desktop, excellent pattern
- **Custom scrollbar** stylé et cohérent
- ~~**Navbar glass morphism**~~ — _retiré en v2.0 : le shell est désormais clair et sans hue_
- **LiveScoresTicker** — `ResizeObserver` pour overflow, scroll arrows conditionnels
- **Oswald** pour les titres (`font-display`) — choix distinctif et sportif

---

## Résumé

| Priorité | Issue | Fichier(s) |
|----------|-------|------------|
| ~~P0~~ ✅ | CSS transition shorthand cassée | `index.css` — résolu 2026-09-01 |
| **P1** | Double loading cause des flashes | Toutes les pages |
| **P1** | `window.location.reload()` au lieu de refetch | 4 pages |
| **P2** | `console.log` en production | `joueur.tsx:11` |
| **P2** | Accessibilité — `aria` manquants | Ticker, home sections |
| ~~P3~~ ✅ | Section headers dupliqués | `home.tsx` — résolu 2026-09-01 |
