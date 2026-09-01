# Bug Tracking

---

## Résolus

### `variant="destructive"` s'affichait en jaune (2026-09-01)

**Fichier:** `client/tailwind.config.ts`

`destructive.DEFAULT` était codé en dur à `"rgb(234 179 8)"` (yellow-500) au lieu
de pointer vers `hsl(var(--destructive))`, alors que `--destructive: 0 84% 60%`
(rouge) était bien défini dans `index.css`. Tout `<Button variant="destructive">`
et tout `<Alert variant="destructive">` s'affichait donc en jaune.

**Correctif:** le token pointe maintenant vers `hsl(var(--destructive))`.

---

### Tokens `--chart-*` et `--sidebar-*` jamais définis (2026-09-01)

**Fichier:** `client/tailwind.config.ts`

Le config exposait les groupes de couleurs `chart.1..5` et `sidebar.*` référençant
des variables CSS qui n'ont jamais existé dans `index.css`. Les classes
correspondantes produisaient `hsl()` avec une variable vide — sans erreur visible.

**Correctif:** les deux groupes ont été retirés (aucune utilisation dans le code).

---

### Aucune navigation entre 768px et 1023px (2026-09-01)

**Fichier:** `client/src/components/Navigation.tsx`

Les liens inline étaient en `hidden lg:block` et le menu hamburger en `md:hidden`.
Entre `md` (768px) et `lg` (1024px), ni l'un ni l'autre ne s'affichait : aucun
lien de navigation n'était accessible.

**Correctif:** le menu mobile passe à `lg:hidden`, alignant les deux seuils.

---

### Lien de navigation actif absent sur les pages de détail (2026-09-01)

**Fichiers:** `client/src/components/navigation/NavigationLink.tsx`, `NavigationLinks.tsx`, `NavigationMobileMenu.tsx`

L'état actif utilisait une égalité stricte `location.pathname === href`, donc
`/equipes/12` ne mettait pas « Équipes » en surbrillance.

**Correctif:** helper partagé `isNavLinkActive()` qui matche le préfixe.

---

### Transition CSS shorthand cassée — P0 de `UI_Audit.md` (2026-09-01)

**Fichier:** `client/src/index.css`

`transition: color, background-color, border-color, box-shadow, opacity 0.2s ease-in-out;`
— seule `opacity` recevait une durée.

**Correctif:** `transition-property` / `transition-duration` /
`transition-timing-function` déclarés séparément, plus un override
`prefers-reduced-motion`.

---

_Aucun bug ouvert._
