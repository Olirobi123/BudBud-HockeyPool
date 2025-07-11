# UI/UX Documentation for 38BudBud

## Design System Specifications
- **Color Palette:** Use Tailwind's semantic color names for consistency.
- **Typography:** Use Tailwind's font utilities; maintain consistent heading/body styles.
- **Spacing:** Use Tailwind's spacing scale for padding, margin, and gaps.
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
- See Implementation.md for the full implementation plan and task breakdown.
- See project_structure.md for folder and component organization.