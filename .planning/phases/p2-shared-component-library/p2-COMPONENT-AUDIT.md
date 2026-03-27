# Phase 2 — Component Audit Report

**Generated:** 2026-03-28
**Auditors:** Claude Opus 4.6 (2 parallel Explore agents)
**Scope:** All 35+ components in `src/components/ui/`

---

## Architecture

The codebase uses **@base-ui/react v1.3.0** (not @radix-ui/react) for shadcn-style components.
This is confirmed by `package.json` and `Button.jsx` imports.

| Pattern | Count | Example |
|---------|-------|---------|
| shadcn-style (@base-ui) | 20+ | Button, Card, Input, dialog, sheet, etc. |
| Custom legacy (framer-motion) | 11 | Modal, Alert, FormField, Stats, Hero, etc. |
| Deprecated/orphaned | 2 | Card.modern.jsx |

---

## Component Quality Matrix

### shadcn-style Components (Good — Low Priority)

| Component | File | Library | Quality | Notes |
|-----------|------|---------|---------|-------|
| Button | Button.jsx | @base-ui | ✅ Good | Uses @base-ui/button, CVA variants, buttonVariants exported |
| Input | Input.jsx | @base-ui | ✅ Good | @base-ui/input, data-slot pattern, dark mode via CSS vars |
| Card | Card.jsx | @base-ui | ✅ Good | Full compound pattern (Header/Title/Content/Footer), size prop |
| Badge | Badge.jsx | @base-ui | ✅ Good | CVA, useRender hook, all variants |
| Avatar | Avatar.jsx | @base-ui | ✅ Good | Root/Image/Fallback/Badge/Group/GroupCount |
| Select | Select.jsx | @base-ui | ✅ Good | Full select suite |
| Table | Table.jsx | @base-ui | ✅ Good | Table + all subcomponents |
| Dialog | dialog.jsx | @base-ui | ✅ Good | Portal + overlay + content |
| Sheet | sheet.jsx | @base-ui | ✅ Good | Mobile drawer, reuses Dialog |
| Tabs | tabs.jsx | @base-ui | ✅ Good | List/Trigger/Content |
| Accordion | accordion.jsx | @base-ui | ✅ Good | Item/Trigger/Content |
| DropdownMenu | dropdown-menu.jsx | @base-ui | ✅ Good | Full menu suite |
| Tooltip | tooltip.jsx | @base-ui | ✅ Good | Provider pattern |
| Popover | popover.jsx | @base-ui | ✅ Good | Custom subcomponents |
| Checkbox | checkbox.jsx | @base-ui | ✅ Good | Minimal, data-checked |
| Separator | separator.jsx | @base-ui | ✅ Good | Minimal wrapper |
| Switch | switch.jsx | @base-ui | ✅ Good | data-checked/unchecked |
| Progress | progress.jsx | @base-ui | ✅ Good | Track/Indicator/Label/Value |
| ScrollArea | scroll-area.jsx | @base-ui | ✅ Good | ScrollArea + ScrollBar |
| Skeleton | skeleton.jsx | Custom | ✅ Good | CSS pulse, no library needed |
| Command | command.jsx | cmdk | ✅ Good | Command palette |
| Textarea | textarea.jsx | Custom | ✅ Good | Plain HTML, styled |
| Label | label.jsx | Custom | ✅ Good | Plain HTML, styled |

### Custom Components (Needs Work)

| Component | File | Issues | Priority |
|-----------|------|--------|----------|
| **Alert** | Alert.jsx | No dark mode, hardcoded gray colors | HIGH |
| **Modal** | Modal.jsx | No dark mode, hardcoded bg-white/text-gray-900 | HIGH |
| **FormField** | FormField.jsx | Uses invalid Tailwind colors (error-500, success-600, etc.) | HIGH |
| Stats | Stats.jsx | Hardcoded blue-600, gray-600 — not theme-aware | MEDIUM |
| Hero | Hero.jsx | Uses undefined `bg-grid-pattern` | MEDIUM |
| FeatureCard | FeatureCard.jsx | Hardcoded blue-100/600 — not theme-aware | MEDIUM |
| Loading | Loading.jsx | Dual skeleton implementation | LOW |
| PageTransition | PageTransition.jsx | Animation wrappers in wrong layer | LOW |
| Grid | Grid.jsx | GridItem not exported | LOW |
| Section | Section.jsx | Container not exported from index | LOW |

### Deprecated/Orphaned

| File | Action |
|------|--------|
| `Card.modern.jsx` | **DELETE** — old forwardRef shadcn, unused, orphaned |
| `Toast.jsx` (react-hot-toast) | Deprecate in favor of `sonner.jsx` |

---

## Critical Issues

### 1. Missing Exports (HIGH — affects all consumers)

**Current `index.js` exports only 12 items.** 23+ components are defined but not exported.

**Fix:** Update `index.js` to export all components consistently.

### 2. Dark Mode Broken (HIGH — 3 components)

- `Alert.jsx`: `bg-gray-50 text-gray-900 border-gray-200` — no dark mode
- `Modal.jsx`: `bg-white text-gray-900 border-gray-200` — no dark mode
- `FormField.jsx`: `text-error-500`, `text-success-600`, etc. — invalid tokens

**Fix:** Replace hardcoded colors with CSS variables from the design system.

### 3. Non-Existent Tailwind Colors (HIGH — 1 component)

`FormField.jsx` uses `text-error-500`, `text-error-600`, `text-success-500`, `text-success-600`, `text-warning-500`, `text-warning-600`, `primary-500`, `primary-600` — none of these exist in `tailwind.config.js`.

**Fix:** Replace with semantic design tokens: `text-destructive`, `text-muted-foreground`, `text-primary`, etc.

### 4. Dual Toast System (MEDIUM)

- `Toast.jsx` (react-hot-toast) — currently used in `App.jsx` and `useAutoSave.js`
- `sonner.jsx` (sonner) — available but not integrated

**Decision needed:** Migrate to `sonner` (recommended) or keep `react-hot-toast`.

---

## Integration Status

| Component | Exported from index.js | Used in app |
|-----------|----------------------|-------------|
| Button | ✅ | ✅ (many pages) |
| Input | ✅ | ✅ (many pages) |
| Card | ✅ | ✅ (many pages) |
| Modal | ✅ | ✅ (admin pages) |
| Loading | ✅ | ✅ (some pages) |
| Section/Container | ✅ | ❌ |
| Hero | ✅ | ❌ |
| FeatureCard | ✅ | ❌ |
| Stats | ✅ | ❌ |
| Alert | ❌ | ❌ |
| Badge | ❌ | ❌ |
| Avatar | ❌ | ❌ |
| Select | ❌ | ❌ |
| Table | ❌ | ❌ |
| EmptyState | ❌ | ❌ |
| FormField | ❌ | ❌ |
| dialog (Dialog) | ❌ | ❌ |
| sheet (Sheet) | ❌ | ❌ |
| accordion | ❌ | ❌ |
| tabs | ❌ | ❌ |
| dropdown-menu | ❌ | ❌ |
| tooltip | ❌ | ❌ |
| sonner | ❌ | ❌ |
| skeleton | ❌ | ❌ |
| progress | ❌ | ❌ |
| switch | ❌ | ❌ |
| checkbox | ❌ | ❌ |
| separator | ❌ | ❌ |
| scroll-area | ❌ | ❌ |
| popover | ❌ | ❌ |
| command | ❌ | ❌ |
| textarea | ❌ | ❌ |
| label | ❌ | ❌ |

---

## Recommendations

1. **Update `index.js`** first — this is a prerequisite for everything else
2. **Refactor Alert, Modal, FormField** in priority order
3. **Delete `Card.modern.jsx`** and orphan shadcn v3 files
4. **Decide on toast system** — migrate to sonner or keep hot-toast
5. **Migrate custom components** to CSS variables for dark mode support

---
*Audit completed: 2026-03-28*
