---
phase: 1
wave: 1
depends_on: []
requirements_addressed: []
autonomous: false
created: 2026-03-28
---

# Plan: Phase 1 — Foundation & Design System

## Wave 1

---

### Plan 1.1: Clean Up Tailwind Config & Integrate CSS Variables

**Objective:** Consolidate Tailwind config, remove duplicate tokens, integrate shadcn CSS variables.

<read_first>
- DoAnTuyenSinh/tailwind.config.js
- DoAnTuyenSinh/css/tailwind.css
- DoAnTuyenSinh/.planning/phases/p1-foundation-design-system/p1-UI-SPEC.md
</read_first>

<action>

**Step 1: Backup current tailwind.config.js** — no action needed (git history)

**Step 2: Remove duplicate color tokens that conflict with shadcn CSS variables**

In `tailwind.config.js`, remove the following color blocks from `theme.extend.colors` (shadcn handles these via CSS variables):
- `primary` (50-950 steps) — shadcn uses `--primary` CSS var
- `secondary` (50-950 steps) — shadcn uses `--secondary` CSS var
- `accent` (50-950 steps) — shadcn uses `--accent` CSS var
- `success` (50-950 steps) — create as custom utility classes instead
- `warning` (50-950 steps) — create as custom utility classes instead
- `error` (50-950 steps) — shadcn uses `--destructive` CSS var
- `gray` (50-950 steps) — Tailwind's default gray scale sufficient
- `glass` (custom rgba values) — replace with Tailwind `bg-*` + `backdrop-blur-*` + `border-*` utility classes
- `dark` (custom dark mode steps) — shadcn handles via `.dark` class

**Step 3: Remove duplicate Tailwind extensions**

Remove from `theme.extend`:
- `spacing` — default Tailwind spacing sufficient
- `fontSize` — remove non-standard sizes (keep 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl if used, else remove)
- `borderRadius` — shadcn default radius is 0.625rem, remove non-standard radii
- `zIndex` — default Tailwind z-index sufficient
- `backgroundSize` — default Tailwind sufficient
- `animation` — keep custom animations that are actively used in code (check with grep first)
- `keyframes` — keep only those referenced by kept animations
- `backgroundImage` — keep gradient-primary, gradient-secondary, gradient-accent, gradient-success, gradient-warning, gradient-error; remove gradient-mesh, gradient-rainbow unless used

**Step 4: Verify kept animations are actually used**

```bash
grep -r "animate-float\|animate-shimmer\|animate-pulse-glow\|animate-gradient\|animate-bounce-gentle\|animate-wiggle" DoAnTuyenSinh/src/ --include="*.jsx" --include="*.js"
```

Remove unused animation + keyframe entries from tailwind.config.js.

**Step 5: Keep in tailwind.config.js**

- `darkMode: 'class'` — already present
- `fontFamily` — Inter, system-ui, sans-serif
- `boxShadow` — glass, glow, soft, soft-lg, soft-xl, dark-soft (keep only if used)
- `backdropBlur` — xs: '2px' (custom, keep)
- Any animation/keyframe that IS actively used

**Step 6: Verify shadcn CSS variables in css/tailwind.css**

Ensure `--primary` is overridden to `#3b82f6` (blue-500) instead of default dark color. The current css/tailwind.css shows `--primary: oklch(0.205 0 0)` which is dark gray — needs to be blue.

**Step 7: Verify Tailwind plugins still work**

Plugins: `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio` — these should be kept and verified compatible with shadcn.
</action>

<acceptance_criteria>
- `grep -c "primary:" DoAnTuyenSinh/tailwind.config.js` returns 0 (no custom primary color scale)
- `grep -c "secondary:" DoAnTuyenSinh/tailwind.config.js` returns 0 (no custom secondary color scale)
- `grep -c "accent:" DoAnTuyenSinh/tailwind.config.js` returns 0 (no custom accent color scale)
- `grep -c "gray:" DoAnTuyenSinh/tailwind.config.js` returns 0 (no custom gray scale)
- `grep -c "glass:" DoAnTuyenSinh/tailwind.config.js` returns 0 (no custom glass colors)
- `grep "oklch" DoAnTuyenSinh/css/tailwind.css` shows `--primary: oklch(0.488 0.243 264.376);` or equivalent blue — NOT dark gray
- `grep "oklch" DoAnTuyenSinh/css/tailwind.css | head -1` shows `--primary` in blue range
- `cat DoAnTuyenSinh/tailwind.config.js | grep -c "theme:"` returns 1 (clean structure)
- Total lines in tailwind.config.js < 150 lines (down from ~285)
</acceptance_criteria>

---

### Plan 1.2: Consolidate Dark Mode — Remove Duplicate Context

**Objective:** Remove duplicate ThemeContext, keep only DarkModeContext, integrate with shadcn dark mode.

<read_first>
- DoAnTuyenSinh/src/contexts/DarkModeContext.jsx
- DoAnTuyenSinh/src/contexts/ThemeContext.jsx
- DoAnTuyenSinh/src/App.jsx
- DoAnTuyenSinh/src/main.jsx
</read_first>

<action>

**Step 1: Audit usage of both contexts**

```bash
grep -rn "useTheme\|ThemeContext\|useDarkMode\|DarkModeContext" DoAnTuyenSinh/src/ --include="*.jsx" --include="*.js"
```

Identify which files use which context. Expected: ThemeContext is unused or minimally used.

**Step 2: Update DarkModeContext to match shadcn pattern**

Current: DarkModeContext toggles `.dark` class on `document.documentElement`
Target: Same behavior — keep as-is since it works correctly with shadcn.

**Step 3: Remove ThemeContext.jsx**

1. Delete `src/contexts/ThemeContext.jsx`
2. Remove ThemeContext import and usage from `src/main.jsx` (if present)
3. Remove ThemeContext import and usage from `src/App.jsx` (if present)

**Step 4: Update DarkModeContext for shadcn compatibility**

Ensure the dark class toggle works with shadcn CSS variables. Verify that when `.dark` is added to `<html>`, all shadcn components respond correctly (they use `.dark` selector in css/tailwind.css).

**Step 5: Add dark mode to index.html**

Ensure `<html>` does NOT have class="dark" by default. Dark mode should only activate when user toggles it via DarkModeContext.

**Step 6: Verify dark mode toggle works**

1. Check that DarkModeContext saves/loads from localStorage correctly
2. Check that `.dark` class is added/removed from `<html>` element
3. Check that `dark:` classes in existing components work with shadcn variables

**Step 7: Update package.json if needed**

Ensure `@fontsource-variable/geist` is in dependencies (required by css/tailwind.css import).
</action>

<acceptance_criteria>
- `test -f DoAnTuyenSinh/src/contexts/ThemeContext.jsx` returns 1 (file deleted)
- `grep "ThemeContext" DoAnTuyenSinh/src/App.jsx DoAnTuyenSinh/src/main.jsx` returns empty (no references)
- `grep "useDarkMode\|DarkModeContext" DoAnTuyenSinh/src/App.jsx DoAnTuyenSinh/src/main.jsx` returns results (context still used)
- `grep "\.dark" DoAnTuyenSinh/src/contexts/DarkModeContext.jsx` returns results (class toggle present)
- `grep "darkMode" DoAnTuyenSinh/src/contexts/DarkModeContext.jsx` | grep -c "localStorage" returns 1 (persistence)
- `grep "fontsource-variable/geist" DoAnTuyenSinh/package.json` returns results (font dep present)
</acceptance_criteria>

---

### Plan 1.3: Standardize Animation System

**Objective:** Consolidate animation variants into shared utils, remove Math.random(), fix performance issues.

<read_first>
- DoAnTuyenSinh/src/utils/animations.js
- DoAnTuyenSinh/src/components/ui/Button.jsx
- DoAnTuyenSinh/src/components/ui/Card.jsx
- DoAnTuyenSinh/src/components/ui/PageTransition.jsx
- DoAnTuyenSinh/.planning/phases/p1-foundation-design-system/p1-UI-SPEC.md
</read_first>

<action>

**Step 1: Rewrite src/utils/animations.js with standardized variants**

Replace the existing file with these standardized variants based on UI-SPEC.md animation principles:

```javascript
// Entrance animations
export const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }
export const fadeInUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
export const fadeInDown = { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }
export const fadeInScale = { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 } }

// Hover animations
export const hoverLift = { whileHover: { y: -2, scale: 1.02 }, transition: { duration: 0.15 } }
export const hoverScale = { whileHover: { scale: 1.05 }, transition: { duration: 0.15 } }
export const tapScale = { whileTap: { scale: 0.97 }, transition: { duration: 0.1 } }

// Page transitions
export const pageEnter = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 } }
export const pageExit = { exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 } }

// Stagger container
export const staggerContainer = { animate: { transition: { staggerChildren: 0.05 } } }
export const staggerItem = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }

// Modal/Dialog
export const modalSpring = { type: "spring", stiffness: 500, damping: 30 }
export const dialogContent = { initial: { opacity: 0, scale: 0.95, y: 8 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 8 }, transition: { type: "spring", stiffness: 500, damping: 30 } }

// Overlay
export const overlayFade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

// Reduced motion helper
export const shouldReduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const reducedMotionVariant = { transition: { duration: 0.001 } }
```

**Step 2: Verify shouldReduceMotion usage**

Check existing components for motion preferences. If not already present, add to animations.js export.

**Step 3: Remove Math.random() from all source files**

Find all Math.random() in JSX renders:
```bash
grep -rn "Math\.random()" DoAnTuyenSinh/src/ --include="*.jsx" --include="*.js" -l
```

For each file found, identify the context:
- Floating particles/shapes → move to CSS @keyframes animations or use fixed positions in useMemo
- Animated backgrounds → replace with CSS gradient animations
- Any random positioning → use deterministic seeded positions (e.g., array index-based)

Priority files to fix:
1. `ThanhHeader.jsx` — floating shapes
2. `ChanTrang.jsx` — floating particles
3. `DangNhap.jsx` — animated background circles
4. `DangKyTaiKhoan.jsx` — animated background
5. `TrangChu.jsx` — floating shapes

**Step 4: Add CSS keyframes for decorative animations**

In `css/tailwind.css`, add these @keyframes for decorative animations (not JS-driven):
```css
@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
@keyframes float-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

Then add Tailwind classes in the `utils` layer:
```css
.animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
.animate-float-float { animation: float-float 8s ease-in-out infinite; }
.animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
```

**Step 5: Add tw-animate-css import check**

Verify `css/tailwind.css` has `@import "tw-animate-css"` (for shadcn animations). This was added by shadcn init.
</action>

<acceptance_criteria>
- `grep -c "Math\.random()" DoAnTuyenSinh/src/` returns 0 (all Math.random removed from JSX)
- `grep "shouldReduceMotion\|reducedMotion" DoAnTuyenSinh/src/utils/animations.js` returns results
- `grep "staggerChildren" DoAnTuyenSinh/src/utils/animations.js` returns results
- `grep "stiffness\|damping" DoAnTuyenSinh/src/utils/animations.js` returns results (spring configs)
- `grep "@import.*tw-animate" DoAnTuyenSinh/css/tailwind.css` returns results (shadcn animations)
- `grep "float-slow\|float-float\|pulse-ring" DoAnTuyenSinh/css/tailwind.css` returns results (CSS keyframes)
- `wc -l < DoAnTuyenSinh/src/utils/animations.js` returns < 80 lines (consolidated, clean)
</acceptance_criteria>

---

## Verification

After executing all plans, verify:

1. **shadcn integration:** Components render correctly with shadcn styles
2. **Dark mode toggle:** Works on all pages, persists via localStorage
3. **No Math.random() in render:** Verified via grep
4. **Tailwind config:** Reduced from ~285 to < 150 lines
5. **ThemeContext removed:** No longer imported anywhere
6. **Animation variants:** All shared from `src/utils/animations.js`
7. **Build passes:** `npm run build` succeeds without errors
8. **Dev server:** `npm run dev` starts without errors

---

## must_haves (goal-backward verification)

1. All shadcn components render with correct styles (blue primary color)
2. Dark mode toggle adds/removes `.dark` class from `<html>`
3. `ThemeContext.jsx` is deleted, `DarkModeContext.jsx` works standalone
4. Tailwind config has < 150 lines (duplicate tokens removed)
5. CSS variables for primary color in `css/tailwind.css` is blue (not dark gray)
6. No `Math.random()` in any JSX render in src/
7. `src/utils/animations.js` contains all standardized animation variants
8. `@fontsource-variable/geist` is installed in package.json

---

## files_modified

- `tailwind.config.js` — cleaned up, duplicate tokens removed
- `css/tailwind.css` — primary color overridden to blue, custom keyframes added
- `src/contexts/ThemeContext.jsx` — deleted
- `src/contexts/DarkModeContext.jsx` — kept, verified compatible with shadcn
- `src/App.jsx` — remove ThemeContext import/usage
- `src/main.jsx` — remove ThemeContext import/usage
- `src/utils/animations.js` — rewritten with standardized variants
- Multiple page files — Math.random() replaced with CSS animations or fixed positions
