# 38BudBud Design System Quick Reference

> **Note:** This is a quick reference. For comprehensive details, see [Design_System.md](./Design_System.md)

## Color Tokens (Use These First!)

### Semantic Colors
```tsx
// Backgrounds
bg-background          // Page background
bg-card               // Card background
bg-muted              // Subtle background
bg-primary            // Primary actions
bg-secondary          // Secondary actions
bg-accent             // Highlights
bg-destructive        // Errors/warnings

// Text Colors
text-foreground       // Primary text
text-muted-foreground // Secondary text
text-primary          // Primary action text
text-card-foreground  // Text on cards
```

### ❌ Avoid Hardcoded Colors
```tsx
// DON'T use these:
bg-slate-900, bg-gray-50, bg-blue-100, bg-green-500
text-gray-600, text-blue-600

// DO use semantic tokens:
bg-background, bg-muted, bg-primary
text-foreground, text-muted-foreground
```

---

## Typography Scale

```tsx
// Page Title (H1)
<h1 className="text-3xl md:text-4xl font-bold text-foreground">

// Section Title (H2)
<h2 className="text-2xl font-bold text-foreground">

// Card Title (H3)
<h3 className="text-xl font-semibold text-foreground">

// Subsection (H4)
<h4 className="text-lg font-semibold text-foreground">

// Body Text
<p className="text-sm text-foreground">

// Secondary Text
<p className="text-sm text-muted-foreground">

// Caption/Metadata
<span className="text-xs text-muted-foreground">
```

---

## Spacing Standards

### Card Padding
```tsx
<Card>
  <CardHeader className="p-6">  // Always use p-6
  <CardContent className="p-6">
</Card>
```

### Page Layout
```tsx
<main className="pt-20 pb-12">  // Top padding accounts for nav
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    // Content
  </div>
</main>
```

### Section Spacing
```tsx
<section className="py-16">  // Large sections
<div className="mb-6">       // Section titles
<div className="mb-4">       // Content blocks
```

### Grid/Flex Gaps
```tsx
<div className="grid gap-4 md:gap-6">     // Grids
<div className="flex gap-2">              // Inline elements
<div className="space-y-4">               // Vertical stacks
```

---

## Component Patterns

### Standard Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Status Badge (Correct Way)
```tsx
// ✅ DO: Use semantic variants
<Badge variant="default">Completed</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Cancelled</Badge>

// ❌ DON'T: Hardcode colors
<Badge className="bg-green-500">Completed</Badge>
```

### Button Variants
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Cancel</Button>
```

### Table Structure
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Form Field
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Label</Label>
  <Input id="field" placeholder="Placeholder" />
</div>
```

---

## Responsive Design

### Breakpoints
- `sm:` → 640px (mobile landscape/tablet)
- `md:` → 768px (tablet)
- `lg:` → 1024px (desktop)
- `xl:` → 1280px (large desktop)

### Common Patterns
```tsx
// Container padding scales up
className="px-4 sm:px-6 lg:px-8"

// Grid columns increase
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Typography scales up
className="text-3xl md:text-4xl"
```

---

## Do's and Don'ts

### Colors
✅ **DO:** Use semantic tokens (`bg-primary`, `text-foreground`)
❌ **DON'T:** Use hardcoded colors (`bg-blue-600`, `text-gray-500`)

### Typography
✅ **DO:** Follow the type scale consistently
❌ **DON'T:** Create one-off font sizes

### Spacing
✅ **DO:** Use p-6 for card padding
❌ **DON'T:** Mix p-4 and p-6 randomly

### Components
✅ **DO:** Use UI components from `/components/ui`
❌ **DON'T:** Create custom implementations of existing components

### Responsive
✅ **DO:** Design mobile-first, scale up with breakpoints
❌ **DON'T:** Use arbitrary breakpoint values

---

## Quick Checklist for New Components

- [ ] Uses semantic color tokens (no hardcoded colors)
- [ ] Follows typography scale
- [ ] Uses consistent spacing (p-6 for cards)
- [ ] Responsive on all screen sizes
- [ ] Has proper focus states
- [ ] Uses semantic HTML elements
- [ ] Accessible (keyboard navigation, ARIA when needed)

---

## Common Patterns Reference

### Loading State
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

### Error State
```tsx
import { ErrorDisplay } from '@/components/ui/error-display';

if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorDisplay error={error} onRetry={() => refetch()} />
    </div>
  );
}
```

### Page Layout
```tsx
<div className="min-h-screen bg-background">
  <Navigation />
  <main className="pt-20 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content */}
    </div>
  </main>
  <Footer />
</div>
```

---

## Need More Details?

See the comprehensive [Design System documentation](./Design_System.md) for:
- Complete semantic token reference
- Detailed typography guidelines
- Component library reference
- Accessibility standards
- Animation guidelines
- Migration guide
