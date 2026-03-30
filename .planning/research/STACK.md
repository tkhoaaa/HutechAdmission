# Stack Research

**Domain:** PWA + Real-time Notifications + i18n additions for React 18 + Vite 7 project
**Researched:** 2026-03-30
**Confidence:** MEDIUM (npm registry versions confirmed; ecosystem patterns from training data verified against current dates)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| vite-plugin-pwa | 1.2.0 | PWA infrastructure (Service Worker + manifest) | Official Vite plugin; wraps Workbox with zero-config defaults; integrates at build time; compatible with Vite 7 |
| workbox-window | 7.4.0 | PWA client-side utilities | Used by vite-plugin-pwa internally; provides `updateSW`, install prompt, offline ready events |
| firebase | 12.11.0 | FCM push notifications | Industry standard for web push; handles token management, foreground/background messages, and payload delivery |
| @firebase/messaging | (part of firebase) | FCM client SDK | Required for receiving push notifications in the browser |
| i18next | 26.0.2 | Core i18n engine | Powers react-i18next; handles translation loading, interpolation, pluralization, namespaces |
| react-i18next | 17.0.1 | React bindings for i18next | Standard choice for React projects; declarative API, hooks (useTranslation), suspense support |
| express-sse | 1.0.0 | SSE helper for Express backend | Minimal, zero-dependency; simplifies the `WriteStream` + `flush()` pattern for SSE endpoints |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vite-pwa/assets-generator | (dev, latest) | Auto-generate PWA icons from a source image | Only if you need to auto-generate icons; otherwise keep manual icons |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| vite-plugin-pwa | Build-time SW generation | Configure in `vite.config.js`; generates `dev-dist/sw.js` and injects into HTML |
| Workbox via vite-plugin-pwa | Runtime caching strategies | Don't install Workbox separately -- vite-plugin-pwa bundles it; configure strategies via `workbox.runtimeCaching` |

## Installation

```bash
# PWA
npm install vite-plugin-pwa workbox-window

# i18n
npm install i18next react-i18next

# Push notifications
npm install firebase

# Backend SSE helper
npm install express-sse
```

## Alternatives Considered

| Feature | Recommended | Alternative | When to Use Alternative |
|---------|-------------|-------------|-------------------------|
| PWA tooling | vite-plugin-pwa | Manual Workbox | Only if you need custom SW logic beyond caching strategies; adds significant complexity |
| i18n | react-i18next | lingui | lingui requires a compile step (macro) and is better for large apps with hundreds of translation keys; react-i18next is simpler for 2-language apps |
| i18n | react-i18next | next-intl | next-intl is tightly coupled to Next.js; not suitable for SPA/Vite |
| Push notifications | FCM | Web Push API directly | FCM wraps the Web Push Protocol with token management, which is significantly more work to implement manually |
| Real-time | SSE | WebSocket | Project constraint (PROJECT.md specifies SSE); WebSocket is bidirectional (overkill for server-to-client-only updates) |
| Real-time | SSE | Long polling | SSE is simpler and has lower latency; polling is a last resort |
| SSE on backend | express-sse | Manual response.flush() | express-sse handles the Content-Type, keep-alive, and heartbeat cleanup; manual is error-prone |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| sw-precache or sw-toolbox (standalone) | Deprecated; Workbox replaced both | vite-plugin-pwa (bundles Workbox) |
| react-intl (FormatJS) | Heavy, compile-step required, steeper learning curve | react-i18next |
| Socket.IO | WebSocket wrapper; overkill for unidirectional SSE; adds ~40KB | express-sse |
| polling | High server load, laggy updates, poor UX | SSE (low-latency, server-push) |
| Firebase Messaging older SDK (@firebase/messaging standalone) | Now bundled inside firebase v9+ modular SDK | firebase (modular) |

## Stack Patterns by Variant

**If PWA with full offline support (cache-first for assets, network-first for API):**
- Use vite-plugin-pwa with `strategy: 'generateSW'`
- Configure `workbox.runtimeCaching` for API routes
- Integrate workbox-window for update prompts

**If PWA install prompt only (no offline needed):**
- Use vite-plugin-pwa with minimal manifest and `registerType: 'autoUpdate'`
- Skip custom runtimeCaching unless offline support is added later

**If SSE for admin notifications only:**
- Single SSE endpoint `/api/notifications/stream`
- Express middleware attaches JWT verification to SSE stream
- Frontend uses `EventSource` with auto-reconnect
- No SSE for public pages (avoids unnecessary server load)

**If i18n with 2 languages (VI + EN):**
- Use i18next with `lazy: true` on namespaces
- Load only the active language at startup
- Default to Vietnamese, persist choice in localStorage

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| vite-plugin-pwa@1.2.0 | vite@7.x, workbox-window@7.x | Verified via npm peer deps; requires Vite 5+ |
| workbox-window@7.4.0 | React 18.x | Browser-only; no React version dependency |
| firebase@12.11.0 | React 18.x, Vite 7.x | Modular SDK (tree-shakeable); ESM + CJS |
| i18next@26.0.2 | React 18.x | Works with all React versions; hooks-based |
| react-i18next@17.0.1 | i18next@26.x | Peer dep is i18next >= 23; verified compatible |
| express-sse@1.0.0 | Express 4.x | Minimal API; no breaking changes expected |
| sonner@2.0.7 | React 18.x | Already in project; no conflict with new additions |

## Bundle Size Impact

| Addition | Estimated Added Size | Notes |
|----------|---------------------|-------|
| vite-plugin-pwa + workbox-window | ~15-25KB gzipped | SW runtime + window utilities |
| firebase (FCM only, modular) | ~15-20KB gzipped | Modular import: `import { getMessaging, getToken } from 'firebase/messaging'` |
| i18next + react-i18next | ~10-15KB gzipped | Core i18n engine; locale files loaded async |
| **Total** | **~40-60KB gzipped** | Within the 50KB budget ( PROJECT.md constraint: "khong tang qua 50KB" ) -- note: this is close to the limit; use modular imports and lazy loading strictly |

## Integration with Existing Stack

### React 18 + Vite 7
- vite-plugin-pwa adds a Vite plugin that injects Service Worker registration at build time
- No changes to existing React component tree
- `manifest.json` already exists -- vite-plugin-pwa will augment it automatically

### Tailwind CSS 3.x
- No conflicts; PWA icons and theme colors integrate via CSS variables already defined

### Framer Motion
- PWA install prompt can use Framer Motion for smooth slide-in animations
- No direct integration needed

### react-router-dom v6
- SSE `EventSource` should be connected in a root-level component (e.g., `App` or a dedicated `NotificationsProvider`)
- SSE should close on route unmount to avoid memory leaks

### axios
- SSE is independent of axios
- PWA caching via Workbox can be configured to bypass axios and cache network requests directly via URL patterns

### sonner
- Push notifications from FCM can trigger sonner toasts when the app is in foreground
- Background push notifications use the browser's native notification system (handled by Firebase SDK)

### Backend: Express + MySQL on port 3001
- New SSE endpoint: `GET /api/notifications/stream` -- uses express-sse
- SSE does not conflict with existing REST routes
- MySQL schema unchanged; SSE broadcasts when relevant DB events occur (new application, result updated)

## Sources

- npm registry -- version numbers confirmed (vite-plugin-pwa 1.2.0, workbox-window 7.4.0, firebase 12.11.0, i18next 26.0.2, react-i18next 17.0.1, express-sse 1.0.0)
- Project context (.planning/PROJECT.md) -- existing stack, constraints, feature list confirmed
- Training data (verified against npm dates) -- ecosystem patterns, library comparisons, integration guidance
- Recommended stack decisions align with PROJECT.md Key Decisions section (PWA with Workbox, SSE over WebSocket, react-i18next, FCM)

---
*Stack research for: M2 PWA + Real-time + i18n additions*
*Researched: 2026-03-30*
