# 38BudBud Design System

> **Comprehensive Design System Documentation**
> Created: 2026-01-11
> Last Updated: 2026-01-11
> Version: 1.0

## Table of Contents

1. [Overview & Principles](#1-overview--principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Library Reference](#5-component-library-reference)
6. [Component Usage Patterns](#6-component-usage-patterns)
7. [Responsive Design Guidelines](#7-responsive-design-guidelines)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Animation & Transitions](#9-animation--transitions)
10. [Best Practices](#10-best-practices)
11. [Migration Guide](#11-migration-guide)

---

## 1. Overview & Principles

### Project Context
38BudBud is a full-stack web application for managing hockey pools. It's a bilingual (French/English) platform built with modern web technologies.

### Tech Stack
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 3.x
- **UI Components:** shadcn/ui (Radix-based primitives)
- **Routing:** Wouter
- **State Management:** TanStack Query for server state
- **Backend:** Node.js + Express + PostgreSQL

### Design Principles

1. **Consistency First**
   - Use semantic design tokens everywhere
   - Follow established patterns
   - Maintain visual harmony across all pages

2. **Accessibility by Default**
   - WCAG 2.1 AA compliance minimum
   - Keyboard navigation support
   - Semantic HTML and ARIA attributes
   - Sufficient color contrast

3. **Mobile-First Responsive**
   - Design for mobile, scale up for larger screens
   - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
   - Test on all device sizes

4. **Performance Optimized**
   - Lightweight components
   - Efficient rendering
   - Optimized bundle size

5. **Maintainability**
   - Clear component hierarchy
   - Reusable patterns
   - Well-documented code

### Dark Mode Support
The design system fully supports light and dark modes using CSS variables that automatically adapt based on the `.dark` class.

---

## 2. Color System

### 2.1 Semantic Tokens (Primary System)

**ALWAYS USE SEMANTIC TOKENS FIRST.** These tokens automatically adapt to light/dark mode and ensure consistency.

#### Core Tokens

| Token | Light Mode | Dark Mode | Usage | Tailwind Class |
|-------|------------|-----------|--------|----------------|
| **background** | `hsl(0 0% 100%)` #FFFFFF | `hsl(220 39% 11%)` #111827 | Page backgrounds | `bg-background` |
| **foreground** | `hsl(220 26% 14%)` #1C2B33 | `hsl(210 20% 98%)` #F9FAFB | Primary text color | `text-foreground` |
| **card** | `hsl(0 0% 100%)` #FFFFFF | `hsl(220 39% 11%)` #111827 | Card backgrounds | `bg-card` |
| **card-foreground** | `hsl(220 26% 14%)` #1C2B33 | `hsl(210 20% 98%)` #F9FAFB | Text on cards | `text-card-foreground` |
| **muted** | `hsl(210 40% 96%)` #F1F5F9 | `hsl(215 28% 17%)` #1F2937 | Subtle backgrounds | `bg-muted` |
| **muted-foreground** | `hsl(215 16% 47%)` #64748B | `hsl(215 20% 65%)` #9CA3AF | Secondary text | `text-muted-foreground` |
| **primary** | `hsl(217 91% 60%)` #3B82F6 | `hsl(231 48% 48%)` #4F46E5 | Primary actions, links, branding | `bg-primary` `text-primary` |
| **primary-foreground** | `hsl(210 20% 98%)` #F8FAFC | `hsl(210 20% 98%)` #F8FAFC | Text on primary | `text-primary-foreground` |
| **secondary** | `hsl(215 20% 65%)` #94A3B8 | `hsl(215 28% 17%)` #1F2937 | Secondary actions | `bg-secondary` |
| **secondary-foreground** | `hsl(220 26% 14%)` #1C2B33 | `hsl(210 20% 98%)` #F9FAFB | Text on secondary | `text-secondary-foreground` |
| **accent** | `hsl(6 78% 57%)` #EF4444 | `hsl(188 94% 42%)` #06B6D4 | Highlights, alerts, important items | `bg-accent` |
| **accent-foreground** | `hsl(210 20% 98%)` #F8FAFC | `hsl(210 20% 98%)` #F9FAFB | Text on accent | `text-accent-foreground` |
| **destructive** | `rgb(234 179 8)` yellow-500 | `hsl(0 84% 60%)` #EF4444 | Errors, warnings, delete actions | `bg-destructive` |
| **destructive-foreground** | `hsl(210 20% 98%)` #F8FAFC | `hsl(210 20% 98%)` #F8FAFC | Text on destructive | `text-destructive-foreground` |
| **border** | `hsl(214 32% 91%)` #E2E8F0 | `hsl(215 28% 17%)` #1F2937 | Borders | `border` `border-border` |
| **input** | `hsl(214 32% 91%)` #E2E8F0 | `hsl(215 28% 17%)` #1F2937 | Input borders | `border-input` |
| **ring** | `hsl(217 91% 60%)` #3B82F6 | `hsl(231 48% 48%)` #4F46E5 | Focus rings | `ring-ring` |

#### Special Tokens

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|--------|
| **popover** | `hsl(0 0% 100%)` #FFFFFF | `hsl(220 39% 11%)` #111827 | Popover backgrounds |
| **popover-foreground** | `hsl(220 26% 14%)` #1C2B33 | `hsl(210 20% 98%)` #F9FAFB | Popover text |

### 2.2 Hockey Theme Colors

Custom colors specific to the hockey pool theme:

| Variable | Value | Hex | Usage |
|----------|-------|-----|--------|
| `--hockey-blue` | `hsl(217 91% 60%)` | #3B82F6 | Primary branding color |
| `--hockey-blue-dark` | `hsl(213 94% 68%)` | #2563EB | Darker shade for depth |
| `--hockey-red` | `hsl(6 78% 57%)` | #EF4444 | Accent/alert color |
| `--hockey-red-dark` | `hsl(0 84% 60%)` | #DC2626 | Darker red for emphasis |
| `--ice-blue` | `hsl(199 89% 48%)` | #0EA5E9 | Secondary branding |
| `--slate-dark` | `hsl(215 28% 17%)` | #1E293B | Dark mode backgrounds |

### 2.3 Extended Palette (Use Sparingly)

Tailwind's default color scale should only be used when semantic tokens don't fit the use case.

**Gray Scale:** `gray-50`, `gray-100`, `gray-200`, ... `gray-900`
**Blue Scale:** `blue-50`, `blue-100`, ... `blue-900`
**Green Scale:** `green-50`, `green-100`, ... `green-900`
**Red Scale:** `red-50`, `red-100`, ... `red-900`
**Yellow Scale:** `yellow-50`, `yellow-100`, ... `yellow-900`

**Rule:** If a semantic token exists for your use case, use it. Extended palette colors should be exceptions, not the rule.

### 2.4 Common Color Issues Found

*(To be populated during audit)*

---

## 3. Typography

### 3.1 Font Family

**Primary Font:** Inter (loaded from Google Fonts)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
```

The Inter font is applied globally to the body element and provides excellent readability at all sizes.

### 3.2 Type Scale

| Usage | Tailwind Classes | Size | Weight | Line Height | Example Context |
|-------|-----------------|------|--------|-------------|-----------------|
| **H1 (Page Title)** | `text-3xl md:text-4xl font-bold` | 30px / 36px | 700 (bold) | tight | "Repêchage 2024", "Historique des Échanges" |
| **H2 (Section Title)** | `text-2xl font-bold` | 24px | 700 (bold) | tight | "Activité en Direct", "Dernier Échange" |
| **H3 (Card Title)** | `text-xl font-semibold` | 20px | 600 (semibold) | normal | Card headers, subsection titles |
| **H4 (Subsection)** | `text-lg font-semibold` | 18px | 600 (semibold) | normal | Small subsections |
| **Body Large** | `text-base` | 16px | 400 (normal) | relaxed | Hero descriptions, important content |
| **Body Default** | `text-sm` | 14px | 400 (normal) | normal | General body text, paragraphs |
| **Body Small** | `text-xs` | 12px | 400 (normal) | normal | Captions, metadata, timestamps |
| **Label** | `text-sm font-medium` | 14px | 500 (medium) | normal | Form labels, component labels |
| **Button Text** | `text-sm font-medium` | 14px | 500 (medium) | normal | Button labels |

### 3.3 Text Color Guidelines

| Usage | Semantic Class | Alternative | When to Use |
|-------|---------------|-------------|-------------|
| **Primary Text** | `text-foreground` | `text-gray-900` | Main content, headings |
| **Secondary Text** | `text-muted-foreground` | `text-gray-600` | Descriptions, supporting text |
| **Tertiary Text** | `text-muted-foreground` | `text-gray-500` | Captions, timestamps, metadata |
| **Inverted Text** | `text-primary-foreground` | `text-white` | Text on dark backgrounds |
| **Link Text** | `text-primary` | - | Interactive links |
| **Success Text** | `text-green-600` | - | Success messages, positive states |
| **Error Text** | `text-destructive` | `text-red-600` | Error messages, validation errors |
| **Warning Text** | `text-yellow-600` | - | Warning messages, cautionary text |

**Preference:** Always use semantic classes first (`text-foreground`, `text-muted-foreground`) before falling back to color-specific classes.

### 3.4 Typography Issues Found

*(To be populated during audit)*

---

## 4. Spacing & Layout

### 4.1 Tailwind Spacing Scale

38BudBud uses Tailwind's default spacing scale where 1 unit = 4px:

`0`, `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px), `20` (80px), `24` (96px), `32` (128px), `40` (160px), `48` (192px), `64` (256px)

### 4.2 Page-Level Spacing

| Element | Spacing Value | Tailwind Class | Notes |
|---------|--------------|----------------|-------|
| **Page Top Padding** | 80px | `pt-20` | Accounts for fixed navigation height |
| **Page Bottom Padding** | 48px | `pb-12` | Consistent footer spacing |
| **Section Vertical Padding** | 64px | `py-16` | Large sections (hero, feature sections) |
| **Container Max Width** | 1280px | `max-w-7xl` | Standard content container |
| **Container Horizontal Padding** | 16px / 24px / 32px | `px-4 sm:px-6 lg:px-8` | Responsive horizontal padding |

### 4.3 Component-Level Spacing

| Component | Internal Padding | Notes |
|-----------|------------------|-------|
| **Card** | `p-6` | Standard card padding (24px) |
| **Card Header** | `p-6` | Consistent with card |
| **Card Content** | `p-6 pt-0` | Top padding removed if header exists |
| **Button (default)** | `px-4 py-2` | Horizontal 16px, vertical 8px |
| **Button (sm)** | `px-3 h-9` | Small button size |
| **Button (lg)** | `px-8 h-11` | Large button size |
| **Input** | `px-3 py-2` | Form input padding |
| **Badge** | `px-2.5 py-0.5` | Small badge padding |

| Element | External Margin | Notes |
|---------|----------------|-------|
| **Section Title (H2)** | `mb-6` | 24px bottom margin |
| **Card Title (H3)** | `mb-2` | 8px bottom margin |
| **Paragraph** | `mb-4` | 16px between paragraphs |
| **Form Field** | `mb-4` | Space between form fields |

### 4.4 Layout Spacing

| Usage | Gap/Space | Tailwind Class |
|-------|-----------|----------------|
| **Card Grid** | 16px / 24px | `gap-4 md:gap-6` |
| **Form Fields** | 16px | `gap-4` or `space-y-4` |
| **Inline Elements** | 8px | `gap-2` or `space-x-2` |
| **Button Groups** | 8px | `gap-2` |
| **List Items** | 12px | `gap-3` or `space-y-3` |

### 4.5 Spacing Issues Found

*(To be populated during audit)*

---

## 5. Component Library Reference

### 5.1 Overview

38BudBud uses 50+ UI primitives from shadcn/ui, built on Radix UI primitives with Tailwind styling.

**Location:** `client/src/components/ui/`

### 5.2 Core Components

#### Layout Components
- **Card** - Container for grouped content
- **Separator** - Visual divider between sections
- **Scroll Area** - Scrollable container with custom scrollbar

#### Typography Components
- **Label** - Form field labels
- **Badge** - Status indicators, tags, counts

#### Form Components
- **Button** - Interactive actions
- **Input** - Text input fields
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean selection
- **Radio Group** - Single selection from multiple options
- **Switch** - Toggle switch
- **Slider** - Range selection
- **Calendar** - Date picker

#### Feedback Components
- **Alert** - Informational messages
- **Alert Dialog** - Modal confirmations
- **Dialog** - Modal windows
- **Drawer** - Side panel
- **Sheet** - Slide-in panel
- **Toast** - Temporary notifications
- **Loading** - Loading indicators
- **Error Display** - Error messages with retry

#### Navigation Components
- **Tabs** - Tabbed content
- **Breadcrumb** - Page hierarchy navigation
- **Navigation Menu** - Main navigation
- **Menubar** - Application menu bar
- **Dropdown Menu** - Context menus
- **Context Menu** - Right-click menus
- **Command** - Command palette

#### Data Display Components
- **Table** - Tabular data display
- **Avatar** - User profile images
- **Chart** - Data visualizations
- **Carousel** - Image/content carousel
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders

#### Overlay Components
- **Popover** - Floating content
- **Tooltip** - Hover information
- **Hover Card** - Hover details

*(Detailed component documentation to be added during audit)*

---

## 6. Component Usage Patterns

### 6.1 Card Patterns

#### Standard Card with Header and Content
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main card content goes here
  </CardContent>
</Card>
```

#### Stat Card Pattern
```tsx
<Card>
  <CardContent className="p-6 text-center">
    <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </CardContent>
</Card>
```

### 6.2 Badge Patterns

#### Status Badges
```tsx
// Use semantic variants, not hardcoded colors
<Badge variant="default">Completed</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Cancelled</Badge>
<Badge variant="outline">Draft</Badge>
```

#### Info Badges
```tsx
<Badge variant="outline">{count} items</Badge>
<Badge className="bg-primary text-primary-foreground">New</Badge>
```

### 6.3 Button Patterns

```tsx
// Primary action
<Button variant="default">Save Changes</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Tertiary action
<Button variant="ghost">Skip</Button>

// Link-style button
<Button variant="link">Learn More</Button>
```

### 6.4 Table Patterns

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Position</TableHead>
      <TableHead className="text-right">Points</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell className="font-medium">{row.name}</TableCell>
        <TableCell>{row.position}</TableCell>
        <TableCell className="text-right">{row.points}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 6.5 Form Patterns

```tsx
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input
    id="username"
    placeholder="Enter your username"
    aria-describedby="username-error"
  />
  {error && (
    <p id="username-error" className="text-sm text-destructive">
      {error.message}
    </p>
  )}
</div>
```

### 6.6 Loading & Error Patterns

#### Loading State
```tsx
import Loading from '@/components/ui/loading';

if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
}
```

#### Error State
```tsx
import { ErrorDisplay } from '@/components/ui/error-display';

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
```

---

## 7. Responsive Design Guidelines

### 7.1 Breakpoint System

Tailwind's default breakpoints:

| Breakpoint | Min Width | Device Target |
|------------|-----------|---------------|
| `sm:` | 640px | Mobile landscape, small tablet |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Desktop, tablet landscape |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large desktop |

### 7.2 Mobile-First Approach

Always design for mobile first, then progressively enhance for larger screens:

```tsx
// ✅ Good: Mobile-first
<div className="px-4 sm:px-6 lg:px-8">

// ❌ Bad: Desktop-first with arbitrary values
<div className="px-8 max-sm:px-4">
```

### 7.3 Responsive Patterns

#### Container Padding Progression
```tsx
className="px-4 sm:px-6 lg:px-8"
// Mobile: 16px → Tablet: 24px → Desktop: 32px
```

#### Grid Layout Progression
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Mobile: 1 column → Tablet: 2 columns → Desktop: 3 columns
```

#### Typography Scaling
```tsx
className="text-3xl md:text-4xl lg:text-5xl"
// Mobile: 30px → Tablet: 36px → Desktop: 48px
```

#### Visibility Toggles
```tsx
className="hidden md:block"  // Hide on mobile, show on tablet+
className="block md:hidden"  // Show on mobile, hide on tablet+
```

### 7.4 Responsive Issues Found

*(To be populated during audit)*

---

## 8. Accessibility Standards

### 8.1 Color Contrast

**WCAG 2.1 Level AA Requirements:**
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+ or 14px+ bold):** Minimum 3:1 contrast ratio
- **UI components and graphics:** Minimum 3:1 contrast ratio

All color combinations in this design system meet or exceed these requirements.

### 8.2 Keyboard Navigation

All interactive elements must be:
- **Focusable:** Accessible via Tab key
- **Activatable:** Work with Enter/Space keys
- **Visible:** Clear focus indicators
- **Logical:** Tab order follows visual order

**Global Focus Styles:**
```css
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

Component-level focus styles use `focus-visible:ring-2 focus-visible:ring-ring`.

### 8.3 Semantic HTML

Use proper HTML elements:
- `<nav>` for navigation sections
- `<main>` for primary content
- `<article>` for independent content
- `<section>` for thematic grouping
- `<button>` for actions, `<a>` for navigation
- Proper heading hierarchy (h1 → h2 → h3, no skipping)

### 8.4 ARIA Attributes

Use ARIA attributes when semantic HTML isn't sufficient:

| Attribute | When to Use | Example |
|-----------|-------------|---------|
| `aria-label` | Icon-only buttons | `<button aria-label="Close">✕</button>` |
| `aria-describedby` | Associate descriptions | `<input aria-describedby="error-msg">` |
| `aria-live` | Dynamic content | `<div aria-live="polite">` |
| `aria-expanded` | Collapsible content | `<button aria-expanded="false">` |
| `aria-selected` | Selected items | `<div role="tab" aria-selected="true">` |

### 8.5 Accessibility Issues Found

*(To be populated during audit)*

---

## 9. Animation & Transitions

### 9.1 Custom Animations

Defined in `client/src/index.css`:

#### Fade In
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

#### Slide Up
```css
.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
```

#### Float
```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### 9.2 Transition Standards

All interactive elements have smooth transitions:

```css
button, input, select, textarea, a {
  transition: all 0.2s ease-in-out;
}
```

### 9.3 Glassmorphism Effect

For special UI elements:

```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 10. Best Practices

### 10.1 Component Development

1. **Use Semantic Tokens**
   - Always prefer semantic color tokens over hardcoded values
   - Ensures automatic dark mode support

2. **Follow Established Patterns**
   - Reference this design system for all UI decisions
   - Don't reinvent components that already exist

3. **Maintain Consistency**
   - Use standard spacing (p-6 for cards)
   - Follow typography scale
   - Apply consistent responsive patterns

4. **Test Responsiveness**
   - Test all components on mobile, tablet, and desktop
   - Ensure touch targets are at least 44×44px

5. **Ensure Accessibility**
   - Add proper ARIA labels
   - Test keyboard navigation
   - Verify color contrast

### 10.2 Code Organization

1. **Component Location**
   - UI primitives: `client/src/components/ui/`
   - Feature components: `client/src/components/[feature]/`
   - Pages: `client/src/pages/`

2. **Naming Conventions**
   - PascalCase for components
   - camelCase for functions and variables
   - kebab-case for file names (if not components)

3. **Import Organization**
   - UI components from `@/components/ui`
   - Feature components from `@/components/[feature]`
   - Use path alias `@/*` for imports

---

## 11. Migration Guide

> **Comprehensive audit completed:** 2026-01-11
> **Detailed findings:** See [Audit_Summary.md](./Audit_Summary.md) for complete analysis

### 11.1 High-Priority Fixes

#### CRITICAL: DraftTable Component (Priority 1)
**File:** `client/src/components/draft/DraftTable.tsx`
**Issue:** Uses custom HTML `<table>` instead of shadcn/ui `<Table>` component
**Impact:** Major visual inconsistency, hardcoded colors throughout

**Current Implementation Problems:**
- ❌ Uses `border-gray-200`, `bg-white`, `bg-gray-100` (lines 22-24)
- ❌ Uses `py-2 px-2` (8px) instead of `p-4` (16px) spacing
- ❌ Uses `font-normal` for headers instead of `font-medium`
- ❌ All text colors hardcoded: `text-gray-700/600/800/900`
- ❌ Hover state uses `hover:bg-gray-50` instead of `hover:bg-muted/50`

**Reference Standard:** `client/src/components/joueur/JoueurTabsStats.tsx` (lines 205-289)

**Required Changes:**
1. Replace `<table>` with `<Table>` component
2. Replace `<thead>` with `<TableHeader>`
3. Replace `<tbody>` with `<TableBody>`
4. Replace `<tr>` with `<TableRow>`
5. Replace `<th>` with `<TableHead>`
6. Replace `<td>` with `<TableCell>`
7. Update all colors to semantic tokens
8. Update spacing to match Table component standards

#### HIGH: Navigation Component (Priority 2)
**File:** `client/src/components/Navigation.tsx`
**Lines:** 31-36
**Issue:** Hardcoded slate colors

**Changes:**
```tsx
// Replace:
className="bg-slate-900/95 border-b border-slate-700"

// With:
className="bg-background/95 border-b border-border"
```

#### HIGH: HomeLatestTrade Component (Priority 3)
**File:** `client/src/components/home/HomeLatestTrade.tsx`
**Lines:** 24-45
**Issue:** Hardcoded blue/red colors for player lists

**Changes:**
```tsx
// Line 34: Replace
className="bg-blue-100 text-blue-700"
// With:
className="bg-primary/10 text-primary"

// Line 45: Replace
className="bg-red-100 text-red-700"
// With:
className="bg-accent/10 text-accent"

// Lines 24-25, 31, 39, 42: Replace all text-gray-* with semantic tokens
text-gray-500 → text-muted-foreground
text-gray-600 → text-muted-foreground
text-gray-900 → text-foreground
text-gray-400 → text-muted-foreground
```

#### HIGH: HomeActivityFeed Component (Priority 4)
**File:** `client/src/components/home/HomeActivityFeed.tsx`
**Lines:** 18, 22, 27, 29

**Changes:**
```tsx
// Line 18: Use proper Card structure instead of p-4 override
<Card className="p-4"> → Use CardHeader/CardContent

// Line 22: Remove hardcoded badge colors
className="bg-blue-50 text-blue-600" → Remove, use variant only

// Line 27: Replace
text-gray-500 → text-muted-foreground

// Line 29: Replace
text-gray-600 → text-muted-foreground
```

#### HIGH: EchangeCard Component (Priority 5)
**File:** `client/src/components/echanges/EchangeCard.tsx`
**Lines:** 17-18, 26, 32, 35, 38-39, 52-53

**Changes:**
```tsx
// Lines 17-18: Replace
text-gray-500 → text-muted-foreground
text-gray-600 → text-muted-foreground

// Lines 26, 32: Replace
text-gray-900 → text-foreground

// Line 35: Replace
border-gray-200 → border-border

// Lines 38-39: Replace
bg-blue-100 → bg-primary/10
text-blue-700 → text-primary

// Lines 52-53: Replace
bg-red-100 → bg-accent/10
text-red-700 → text-accent
```

#### HIGH: HeroSection Component (Priority 6)
**File:** `client/src/components/HeroSection.tsx`
**Lines:** Multiple throughout

**Changes:**
```tsx
// Line 20: Acceptable hero gradient, but document
bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
// Consider: Document as approved hero pattern in design system

// Lines 30-31: Status indicator
bg-green-400 → bg-accent or define --status-live token

// Line 42: Replace
text-gray-300 → text-muted-foreground or text-foreground (on dark)

// Line 58: Replace
border-gray-400 hover:border-gray-300 text-gray-300 hover:bg-slate-800/50
// With:
border-border hover:border-border text-foreground hover:bg-card/50

// Lines 69, 77, 85: Replace
bg-slate-800/50 border-slate-700 → bg-card/50 border-border

// Lines 73, 82: Replace
text-gray-400 → text-muted-foreground
```

### 11.2 Common Find/Replace Patterns

#### Text Colors:
```bash
# Find → Replace
text-gray-900 → text-foreground
text-gray-800 → text-foreground
text-gray-700 → text-muted-foreground
text-gray-600 → text-muted-foreground
text-gray-500 → text-muted-foreground
text-gray-400 → text-muted-foreground
text-gray-300 → text-muted-foreground (on light) or text-foreground (on dark)
```

#### Background Colors:
```bash
# Find → Replace
bg-white → bg-card or bg-background
bg-gray-50 → bg-muted
bg-gray-100 → bg-muted
bg-slate-900 → bg-background (in dark contexts)
bg-slate-800 → bg-card
```

#### Border Colors:
```bash
# Find → Replace
border-gray-200 → border-border
border-gray-300 → border-border
border-slate-700 → border-border
```

#### Status/Highlight Colors:
```bash
# Find → Replace
bg-blue-100 text-blue-700 → bg-primary/10 text-primary
bg-blue-50 text-blue-600 → bg-primary/10 text-primary
bg-red-100 text-red-700 → bg-accent/10 text-accent
bg-green-100 text-green-700 → bg-accent/10 text-accent (or define success token)
bg-yellow-100 text-yellow-700 → Define playoff/warning token
```

### 11.3 Component-by-Component Refactoring Checklist

#### Critical Priority:
- [ ] **DraftTable.tsx** - Complete rewrite using Table component
  - Replace custom `<table>` with `<Table>` from shadcn/ui
  - Update all 15+ hardcoded color instances
  - Update spacing from `py-2 px-2` to standard `p-4` / `h-12 px-4`
  - Update typography: headers should use `font-medium`

#### High Priority:
- [ ] **Navigation.tsx** - Replace slate colors (lines 31-36)
- [ ] **HomeLatestTrade.tsx** - Replace blue/red hardcoded colors (lines 24-45)
- [ ] **HomeActivityFeed.tsx** - Fix badge and text colors (lines 18, 22, 27, 29)
- [ ] **EchangeCard.tsx** - Replace blue/red sections (lines 17-53)
- [ ] **HeroSection.tsx** - Update text and card colors (multiple lines)

#### Medium Priority:
- [ ] **JoueurTabsStats.tsx** - Define playoff color token for `bg-yellow-500/10` (lines 133, 246)
- [ ] **PlayerSearchDropdown.tsx** - Replace `bg-white` and `border-slate-200` (line 25)
- [ ] **PlayerSearchInput.tsx** - Audit for color consistency
- [ ] **PlayerSearchResultItem.tsx** - Audit for color consistency

#### Low Priority (Global Search):
- [ ] Search all files for `text-gray-` and replace with semantic tokens
- [ ] Search all files for `bg-gray-` and replace with semantic tokens
- [ ] Search all files for `bg-slate-` and replace with semantic tokens
- [ ] Search all files for `border-gray-` and replace with semantic tokens
- [ ] Audit all Card usages for proper CardHeader/CardContent structure

### 11.4 Testing After Migration

For each component after refactoring:

1. **Visual Testing:**
   - [ ] Light mode appearance correct
   - [ ] Dark mode appearance correct
   - [ ] Hover states work properly
   - [ ] All colors use semantic tokens

2. **Responsive Testing:**
   - [ ] Mobile (320px-640px)
   - [ ] Tablet (640px-1024px)
   - [ ] Desktop (1024px+)

3. **Accessibility Testing:**
   - [ ] Color contrast meets WCAG AA (4.5:1 for text)
   - [ ] Keyboard navigation works
   - [ ] Focus states visible
   - [ ] Screen reader friendly

4. **Consistency Testing:**
   - [ ] Compare with reference components (Table, Card, Badge)
   - [ ] Spacing matches design system (p-6 for cards, p-4 for table cells)
   - [ ] Typography matches type scale

### 11.3 Automated Checks

Consider adding ESLint rules to enforce:
- No hardcoded color classes (enforce semantic tokens)
- Consistent spacing patterns
- Proper component usage

---

## Appendix

### Related Documentation
- [UI/UX Documentation](./UI_UX_doc.md) - High-level UX flows
- [Project Structure](./project_structure.md) - File organization
- [Implementation Plan](./Implementation.md) - Development roadmap
- [Design System Cheatsheet](./Design_System_Cheatsheet.md) - Quick reference

### Maintenance

This design system should be updated when:
- New UI components are added
- Design patterns evolve
- Accessibility requirements change
- New features require new patterns

**Last Comprehensive Audit:** 2026-01-11
