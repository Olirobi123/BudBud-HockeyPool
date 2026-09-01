# UI/UX Documentation for 38BudBud

## Design System Reference

**IMPORTANT:** Comprehensive design system specifications are now documented in [`/Docs/Design_System.md`](./Design_System.md).

**Quick Reference:** See [`/Docs/Design_System_Cheatsheet.md`](./Design_System_Cheatsheet.md) for common patterns and quick lookup.

---

## Design System Specifications (High-Level)
- **Color Palette:** Use semantic design tokens (e.g., `bg-primary`, `text-foreground`) defined in Design System.
- **Typography:** Follow the type scale defined in Design System for consistent heading/body styles.
- **Spacing:** Use Tailwind's spacing scale as documented in Design System for padding, margin, and gaps.
- **Components:** All UI primitives must be stateless, reusable, and accept data via props.

## UI Component Guidelines
- Use only components from `components/ui` for base UI elements.
- Feature/layout components should compose UI primitives and manage feature logic.
- All forms should use consistent input, button, and validation components.

## User Experience Flow Diagrams
- **Landing Page:** Clear call-to-action, summary of features, and navigation to main sections.
- **Player Search:** Prominent search bar, instant results, easy navigation to player details.
- **Trades:** Simple, step-by-step flow for proposing and confirming trades.
- **Draft:** Table view aligned visually with player search, clear filters for year/type/round/team.
- **Teams:** Dedicated page for each team, showing roster, stats, and recent activity.

## Responsive Design Requirements
- All pages/components must be fully responsive (mobile, tablet, desktop).
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) for layout adjustments.

## Accessibility Standards
- All interactive elements must be keyboard accessible.
- Use semantic HTML and ARIA attributes where appropriate.
- Ensure sufficient color contrast and readable font sizes.

## Style Guide and Branding
- Use consistent branding (logo, colors, typography) across all pages.
- Avoid inline styles; use Tailwind utility classes.

## Component Library Organization
- All base UI components in `components/ui`.
- Feature components in `components/[feature]`.
- Shared layouts/navigation in `components/`.

## User Journey Maps
- **Onboarding:** User lands on homepage → explores features → navigates to team/join pool.
- **Trade Flow:** User navigates to trades → proposes trade → confirms → sees update in activity feed.
- **Draft Flow:** User filters draft table → views picks by round/team → navigates to player/team details.

## Wireframe References
- (Add Figma or image links here if available)

## Design Tool Integration
- (Specify Figma, Sketch, or other tools if used)

---

**All documentation is interconnected and supports the overall implementation and refactor strategy. Update these docs as the project evolves.**

### Cross-References
- **Design System (NEW):** `/Docs/Design_System.md` - Comprehensive design system reference
- **Design System Cheatsheet (NEW):** `/Docs/Design_System_Cheatsheet.md` - Quick reference guide
- **Component Structure:** see the "Component Structure" section of `/CLAUDE.md` — folder and component organization
- **Component Audit:** `/Docs/Component_Audit.md` - single-responsibility review of oversized components