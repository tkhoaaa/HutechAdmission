---
phase: 3
slug: layout-navigation
status: draft
created: 2026-03-28
---

# Phase 3 Plan — Layout & Navigation

## Scope

Refactor 4 layout components: ThanhHeader, ChanTrang, AdminLayout, PageTransition.

## Audit Summary

### ThanhHeader (806 lines)
| Issue | Severity | Fix |
|-------|----------|-----|
| `console.log` debug statements (2x) | HIGH | Remove |
| Inline `style` color overrides (10+) | MEDIUM | Use CSS vars / Tailwind |
| `whileHover` scale+rotate on icon | MEDIUM | Simplify to hoverLift |
| Complex `useScroll` animation | LOW | Keep as-is |
| Non-existent `primary-50`, `primary-700` colors | HIGH | Replace with CSS vars |
| `WebkitTextFillColor` inline style | MEDIUM | Remove, use Tailwind |

### ChanTrang (550 lines)
| Issue | Severity | Fix |
|-------|----------|-----|
| Infinite animation loops (rotate 360, backgroundPosition) | HIGH | Replace with CSS keyframes |
| `Math.random()` — ALREADY FIXED (Phase 1) | N/A | Done |
| Inline logo animation (rotate 360) | MEDIUM | Replace with CSS animation |
| Many `whileHover`/`whileInView` with complex animations | MEDIUM | Simplify per animation spec |
| `FaStar` pulse animation | MEDIUM | CSS animation |

### AdminLayout (975 lines)
| Issue | Severity | Fix |
|-------|----------|-----|
| Infinite animation loops (logo pulse, shine effect) | HIGH | Replace with CSS |
| `console.log` in onError handlers (4x) | HIGH | Remove |
| Complex nested motion components | MEDIUM | Simplify |
| Heavy inline styles | MEDIUM | Migrate to Tailwind |

### PageTransition
| Issue | Severity | Fix |
|-------|----------|-----|
| May have complex transitions | LOW | Audit and simplify |

---

## Plans

### Plan 3.1: Header Cleanup (HIGH)

**Goal:** Clean ThanhHeader — remove console.log, fix colors, simplify animations.

**Acceptance Criteria:**
- [ ] All `console.log` removed from ThanhHeader
- [ ] `text-primary-50`, `text-primary-700`, `bg-primary-50`, `bg-primary-900/20` replaced with CSS vars
- [ ] `WebkitTextFillColor` inline styles removed
- [ ] Icon `whileHover` simplified to standard hoverLift
- [ ] Dark mode colors use semantic tokens throughout

**Files:** `ThanhHeader.jsx`

---

### Plan 3.2: Footer Cleanup (HIGH)

**Goal:** Clean ChanTrang — replace infinite framer-motion loops with CSS keyframes.

**Acceptance Criteria:**
- [ ] All `whileInView` with infinite animations replaced with CSS
- [ ] Logo rotation animation → CSS `@keyframes rotate`
- [ ] Star pulse → `.animate-pulse` Tailwind class
- [ ] Scroll-to-top button animation → CSS
- [ ] Particle effects (already deterministic) → keep framer-motion (not infinite)
- [ ] Dark mode colors use semantic tokens

**Files:** `ChanTrang.jsx`

---

### Plan 3.3: Admin Layout Cleanup (HIGH)

**Goal:** Clean AdminLayout — remove console.log, replace infinite animations.

**Acceptance Criteria:**
- [ ] All `console.log` in onError removed
- [ ] Logo crown animation → CSS
- [ ] Notification icon animation → CSS
- [ ] Sidebar shine effect → CSS
- [ ] Heavy inline `style` objects → Tailwind classes
- [ ] Dark mode colors use semantic tokens

**Files:** `AdminLayout.jsx`

---

### Plan 3.4: Page Transition Audit (MEDIUM)

**Goal:** Audit PageTransition for consistency with animation spec.

**Acceptance Criteria:**
- [ ] No `Math.random()` in render
- [ ] All animations respect reduced motion
- [ ] Consistent with `animations.js` variants

**Files:** `PageTransition.jsx`

---

## Execution Order

1. Plan 3.1 — Header cleanup (HIGH priority)
2. Plan 3.2 — Footer cleanup (HIGH priority)
3. Plan 3.3 — Admin layout cleanup (HIGH priority)
4. Plan 3.4 — Page transition audit (MEDIUM priority)
5. Build + Commit

---

## Dependencies

- All plans depend on Phase 1 (animations.js, CSS keyframes) and Phase 2 (index exports)

## Estimated Effort

| Plan | Effort | Notes |
|------|--------|-------|
| 3.1 | Medium | 2 console.log + color fixes + animation simplification |
| 3.2 | Medium | Replace 5+ infinite framer-motion loops with CSS |
| 3.3 | Medium | 4 console.log + 3+ infinite loops + style cleanup |
| 3.4 | Low | Audit only, likely minimal changes needed |

---
*Plan created: 2026-03-28*
