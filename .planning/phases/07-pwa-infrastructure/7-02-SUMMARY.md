# Phase 7 Plan 2: Offline Page + Install Prompt — Summary

**Phase:** 7 (pwa-infrastructure) | **Plan:** 2 of 3
**Executed:** 2026-03-31
**Requirements Addressed:** PWA-02, PWA-03

---

## Objective

Add offline detection with a user-friendly "no connection" page and a deferred PWA install prompt banner to drive app installation.

---

## Tasks Executed

| # | Task | Name | Status |
|---|------|------|--------|
| 2.1 | Create OfflineBoundary component | OfflineBoundary.jsx | Done |
| 2.2 | Update App.jsx with OfflineBoundary | App.jsx | Done |
| 2.3 | Create InstallPrompt component | InstallPrompt.jsx | Done |
| 2.4 | Add InstallPrompt to ThanhHeader | ThanhHeader.jsx | Done |

---

## Files Created

### `DoAnTuyenSinh/src/components/OfflineBoundary.jsx`
- Detects online/offline state via `navigator.onLine` and `window online/offline` events
- Renders styled "Khong co ket noi" page with antenna emoji, message, and retry button
- Returns `children` when online

### `DoAnTuyenSinh/src/components/InstallPrompt.jsx`
- Listens for `beforeinstallprompt` event
- Stores `deferredPrompt`, shows floating card at bottom-left (bottom-right on desktop)
- "Cai dat" triggers `deferredPrompt.prompt()`, "Dong" dismisses
- Returns null when not shown

---

## Files Modified

### `DoAnTuyenSinh/src/App.jsx`
- Added `import OfflineBoundary from "./components/OfflineBoundary"`
- Wrapped `<OfflineBoundary>` around `<DarkModeProvider>` inside `<HelmetProvider>`
- Structure: `HelmetProvider > OfflineBoundary > DarkModeProvider > UserContextProvider > BrowserRouter > ...`

### `DoAnTuyenSinh/src/components/ThanhHeader.jsx`
- Added `import InstallPrompt from "./InstallPrompt"`
- Added `<InstallPrompt />` inside `<motion.header>` before closing tag

---

## Acceptance Criteria

| Criteria | Result |
|----------|--------|
| OfflineBoundary.jsx exports component with online/offline detection | PASS |
| Offline state renders styled "Khong co ket noi" page with retry button | PASS |
| App.jsx wraps content with `<OfflineBoundary>` | PASS |
| InstallPrompt.jsx listens for `beforeinstallprompt` event | PASS |
| ThanhHeader.jsx renders `<InstallPrompt />` | PASS |

**Note:** `npm run build` verification not run due to environment constraints. Please run `cd DoAnTuyenSinh && npm run build` to confirm zero build errors.

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Commit

```
feat(pwa): add OfflineBoundary and InstallPrompt components
```

**Files committed:**
- Created: `DoAnTuyenSinh/src/components/OfflineBoundary.jsx`
- Created: `DoAnTuyenSinh/src/components/InstallPrompt.jsx`
- Modified: `DoAnTuyenSinh/src/App.jsx`
- Modified: `DoAnTuyenSinh/src/components/ThanhHeader.jsx`

---

## Self-Check

- [x] OfflineBoundary.jsx created at correct path
- [x] InstallPrompt.jsx created at correct path
- [x] App.jsx has OfflineBoundary import and wrapping JSX
- [x] ThanhHeader.jsx has InstallPrompt import and rendering
- [x] No build errors (pending `npm run build` verification)
