# Project Research Summary

**Project:** DoAnTuyenSinh (HUTECH University Admissions Platform)
**Domain:** University admissions web platform (PWA + Real-time + i18n)
**Researched:** 2026-03-30
**Confidence:** MEDIUM

## Executive Summary

This project adds three major capability layers to an existing React 18 + Vite 7 + Express.js admissions platform: PWA offline/install support, real-time SSE notifications for admins and students, and Vietnamese/English i18n. All three are independent additions with clear integration points into the existing stack — no major refactoring required.

The recommended approach uses `vite-plugin-pwa` (wrapping Workbox) for PWA, SSE for real-time updates (not WebSocket — unidirectional server-push is all the project needs), and `react-i18next` with `i18next-http-backend` for lazy-loaded locale files served from `public/locales/`. Firebase Cloud Messaging (FCM) handles push notifications as an enhancement after the core works. Bundle size impact is estimated at ~40–60KB gzipped, which is near the 50KB budget constraint — modular imports and lazy loading must be enforced strictly.

The biggest risk is SSE connection management (leaks, no backoff) and the 50KB budget ceiling with i18n included. Both are manageable if the architectural patterns are followed from the start. Vercel does NOT support SSE — the SSE endpoint must run on the Express backend on port 3001.

## Key Findings

### Recommended Stack

The additions require 6 new packages plus supporting libraries. All versions are npm-confirmed as of 2026-03-30.

**Core technologies:**

- `vite-plugin-pwa@1.2.0` — PWA Service Worker generation wrapping Workbox. Injects SW registration at build time, configures caching strategies via `workbox.runtimeCaching`, compatible with Vite 7.x.
- `workbox-window@7.4.0` — PWA client utilities (`updateSW`, install prompt events). Bundled by `vite-plugin-pwa`; also used directly in components for the deferred install prompt flow.
- `firebase@12.11.0` — FCM push notifications (modular SDK). Handles token management, foreground/background push. Use modular imports (`getMessaging`, `getToken`) to stay under bundle budget.
- `i18next@26.0.2` — Core i18n engine. Translation loading, interpolation, pluralization, namespaces. Powers `react-i18next`.
- `react-i18next@17.0.1` — React bindings. Hooks-based (`useTranslation`), Suspense support. Preferred over lingui (compile step) or next-intl (Next.js-coupled).
- `express-sse@1.0.0` — SSE helper for Express. Simplifies `WriteStream` + `flush()` pattern with proper Content-Type, keep-alive, and heartbeat cleanup.

**Supporting libraries (dev):**

- `@vite-pwa/assets-generator` — Auto-generate PWA icons from a source image. Only if icon generation is needed; manual icons already exist at `/icons/`.

**Total estimated bundle impact: ~40–60KB gzipped.** This is at the budget ceiling. Must use modular imports and lazy namespace loading strictly.

**What NOT to use:**

| Avoid | Reason |
|-------|--------|
| `sw-precache`, `sw-toolbox` | Deprecated; replaced by Workbox |
| `react-intl` (FormatJS) | Heavy, requires compile step |
| Socket.IO | WebSocket wrapper; overkill for unidirectional SSE; adds ~40KB |
| Long polling | Higher server load, higher latency |
| `@firebase/messaging` standalone | Bundled inside firebase v9+ modular SDK |
| lingui | Compile step required; better for hundreds of translation keys, not needed here |

### Expected Features

**Must have (table stakes):**

- PWA Service Worker — caching static assets (cache-first) and API calls (network-first). Fast repeat visits, resilience on Vietnam mobile networks.
- Offline fallback page — simple HTML with retry button, served by SW when network fails.
- PWA install prompt — custom deferred banner shown once after engagement, not auto-prompted (Chrome penalizes aggressive prompting).
- SSE endpoint — Express backend route broadcasting new application events to connected admin clients.
- i18n infrastructure — `react-i18next` setup with VI default, EN lazy-loaded. Lazy-loaded locale files in `public/locales/{lang}/` via `i18next-http-backend`. Bundle size constraint makes lazy loading non-optional.
- Language switcher — dropdown in `ThanhHeader`. Persists to `localStorage`. Detects browser language on first visit.

**Should have (competitive differentiators):**

- Admin notification bell — live badge counter in header, SSE-connected. Resets on dropdown open or page refresh.
- Student SSE for result updates — student sees status changes in real-time without polling. SSE channel per authenticated student.
- Full VI + EN locale coverage — wrap every hardcoded string across all ~24 page components. Largest content migration task in M2.
- Push notifications via FCM — re-engage students who submitted applications. Request permission only after meaningful action (form submit), framed as opt-in benefit.

**Defer (v2+):**

- PWA install rate analytics
- Language preference per page (URL parameter)
- Expanded languages (Chinese, Korean — only if international enrollment grows)
- i18n for PDF/print outputs (layout fragility with translated text)
- Mobile native app (React Native/Expo) — only if PWA install rates are low

### Architecture Approach

The additions integrate at four levels: `vite.config.js` (PWA plugin), `main.jsx` + `App.jsx` (i18n provider + NotificationContext), `ThanhHeader` (LanguageSwitcher + NotificationBell), and `backend/index.js` (SSE service + notification endpoints). No existing components need structural changes — only new wrappers and new components.

**New component boundaries:**

| Component | File | Responsibility |
|-----------|------|----------------|
| `NotificationContext` | `src/contexts/NotificationContext.jsx` | SSE lifecycle, unread count, toast dispatch |
| `I18nProvider` | `src/i18n/index.js` + `config.js` | i18next init, language detection, lazy namespace loading |
| `NotificationBell` | `src/components/ui/NotificationBell.jsx` | Admin live counter badge in header |
| `InstallPrompt` | `src/components/ui/InstallPrompt.jsx` | PWA install banner (one-time, deferred) |
| `OfflineBoundary` | `src/components/ui/OfflineBoundary.jsx` | Catches network failures, renders offline page |
| `LanguageSwitcher` | `src/components/ui/LanguageSwitcher.jsx` | Header VI/EN toggle |
| SSE service | `backend/services/sseService.js` | Client registry + broadcast |
| Notification service | `backend/services/notificationService.js` | MySQL notification CRUD |
| `useSSE.js` | `src/hooks/useSSE.js` | SSE hook with exponential backoff + cleanup |
| `useOffline.js` | `src/hooks/useOffline.js` | Offline detection hook |
| `usePushNotification.js` | `src/hooks/usePushNotification.js` | FCM registration hook |

**Key integration points:**

- `src/main.jsx` — add `import './i18n/config.js'` before App import
- `src/App.jsx` — wrap with `<NotificationProvider>` inside `UserContext`
- `ThanhHeader.jsx` — import and render `<LanguageSwitcher>` + `<NotificationBell>` (admin only)
- `ChanTrang.jsx` — wrap with `<OfflineBoundary>`
- `vite.config.js` — add `VitePWA()` plugin with caching strategies
- `public/manifest.json` — add `"id": "sw-base"` field for SW scoping
- `backend/index.js` — add SSE route, SSE service init, notification endpoints

### Critical Pitfalls

1. **SSE connection leaks** — `EventSource` connections persist across React Router navigation if not closed in `useEffect` cleanup. Results in server connection accumulation and resource exhaustion. Fix: always return `eventSource.close()` from `useEffect`. Use `beforeunload` + `sendBeacon` for full-page navigation. SSE should be managed at app root level via `NotificationContext`, not per-page.

2. **No exponential backoff on SSE reconnection** — `EventSource` default reconnection floods the recovering server after an outage ("thundering herd"). Fix: implement manual reconnection with exponential backoff (1s → 2s → 4s, max 30s cap). Track connection state in UI.

3. **SW registration timing** — App renders before SW installs and activates. Users see blank screens or missing assets on first visit. Fix: use `registerType: 'autoUpdate'` and wait for SW `active` state before rendering critical content, or use `waitOnLocalhost` strategy.

4. **Cache poisoning after deploy** — Old SW serves old cached assets after new Vercel deployment. Stale JS against new API causes runtime errors. Fix: always use content-hashed filenames (Vite default), implement "new version available" prompt via `reg.update()`, prefer network-first for API calls.

5. **Vercel edge caching overrides SW** — Vercel's CDN caches API responses before the SW can intercept them. Fix: set `Cache-Control: no-store` on all `/api/` routes via `vercel.json` or Express middleware. Disable edge caching for SSE endpoint explicitly.

6. **i18n missing keys in production** — New `t('key')` calls added after last locale file build, resulting in blank/placeholder strings in production. Fallback language (Vietnamese) hides the problem in dev. Fix: configure `missingKeyHandler` to error in production, add CI check that fails if new keys are detected without translations.

7. **Bundle size exceeds 50KB** — PWA (15–25KB) + i18n (10–15KB) + firebase modular (15–20KB) = close to 50KB total. Fix: use only modular firebase imports, lazy-load locale files from `public/locales/` (not bundled), load only active language at startup.

## Implications for Roadmap

Based on research, M2 should be structured in two sub-phases to respect the SSE → notification UI dependency chain.

### Phase 1: PWA Infrastructure
**Rationale:** PWA does not depend on any other feature. It touches only build config, entry files, and a new offline page. Establishes caching strategies correctly before any content is added.

**Delivers:**
- `vite-plugin-pwa` installed and configured in `vite.config.js`
- Service Worker with Workbox (cache-first for assets, network-first for API)
- Offline fallback page (`public/offline.html`)
- Install prompt with deferred banner (one-time, not auto-prompted)
- `public/manifest.json` updated with `id: "sw-base"`
- `OfflineBoundary` component in `src/components/ui/`
- `useOffline.js` hook

**Addresses:** PWA-01, PWA-02, PWA-03 (from FEATURES.md)
**Avoids:** Pitfall 3 (SW registration timing), Pitfall 4 (cache poisoning), Pitfall 5 (Vercel edge caching)

---

### Phase 2: SSE + Admin Notifications
**Rationale:** SSE requires backend work before the frontend can consume it. The SSE endpoint is the enabler for both admin and student notification flows. Cannot build notification UI without the backend route.

**Delivers:**
- `backend/services/sseService.js` — client registry with `addClient`, `removeClient`, `broadcast`, `broadcastAll`
- `GET /api/sse/events` endpoint on Express (JWT-validated, heartbeat every 30s)
- `NotificationContext` managing SSE lifecycle from app root
- `useSSE.js` hook with exponential backoff reconnection
- `NotificationBell` component with live badge counter in `ThanhHeader`
- SSE trigger from `POST /api/applications` and result update routes
- SSE trigger from result status change route → `sseService.broadcast(studentId, ...)`

**Addresses:** RT-01, RT-02, RT-03 (from FEATURES.md)
**Avoids:** Pitfall 1 (connection leaks), Pitfall 2 (no backoff)
**Research flags:** Vercel SSE incompatibility confirmed — SSE must target Express backend on port 3001, not Vercel functions.

---

### Phase 3: i18n Infrastructure
**Rationale:** i18n is a large content migration across ~24 page components. The infrastructure must be scaffolded first (locale files, config, provider), then string wrapping proceeds page by page. This is content work, not technical work.

**Delivers:**
- `src/i18n/config.js` — i18next init with `HttpBackend` + `LanguageDetector`, lazy namespaces
- `src/i18n/index.js` — provider export
- `useLanguage.js` hook
- `LanguageSwitcher` component in `ThanhHeader`
- `public/locales/vi/translation.json` — initial VI strings (header, nav, footer, buttons, form labels, validation)
- `public/locales/en/translation.json` — EN translations (initially matching VI until full coverage)
- `<Suspense fallback={<PageLoader />}>` wrapper in `main.jsx`
- Inline fallback strings in `src/i18n/locales/` for immediate boot
- Page-by-page string wrapping (plan: common namespace first, then page namespaces)

**Addresses:** I18N-01, I18N-02, I18N-03 (from FEATURES.md)
**Avoids:** Pitfall 6 (missing keys), Pitfall 8 (SEO meta tags not translated), bundle size trap

---

### Phase 4: Push Notifications (FCM)
**Rationale:** Requires Firebase project setup and SW integration. Permission rates may be low without a meaningful trigger. Measure demand from students before investing in FCM infrastructure.

**Delivers:**
- Firebase project setup with VAPID keys
- Unified SW handling both Workbox caching and FCM messaging (`importScripts` Firebase SDK inside SW)
- `usePushNotification.js` hook
- Push permission request triggered post-application-submit (not on page load)
- `firebase-admin` on Express backend to send FCM messages on status changes
- FCM device token storage per user in database

**Addresses:** PWA-04 (from FEATURES.md)
**Avoids:** UX pitfall (push permission without context), FCM SW conflict with Workbox SW
**Research flags:** FCM requires standard Node.js server, not Vercel edge. Confirm backend hosting supports long-running FCM delivery.

---

### Phase Ordering Rationale

1. **PWA before everything else** — SW registration and caching must be established before any runtime-loaded content (locale files, SSE). Getting the caching layer right first prevents cache poisoning issues later.

2. **SSE before i18n** — SSE requires backend work; i18n is frontend-only. The SSE endpoint is a prerequisite for notification UI. Prioritize the backend dependency.

3. **i18n infrastructure before full coverage** — Build the scaffold (config, locale files, provider, LanguageSwitcher) first. Then migrate strings page-by-page. Doing full coverage without infrastructure means all 24 pages need rework when the approach changes.

4. **FCM last** — Highest complexity (Firebase setup, SW integration), lowest user value until the core notification flow is validated. Permission fatigue is real without a clear trigger.

### Research Flags

Phases needing deeper research during planning:

- **Phase 4 (FCM):** Firebase project account access needed; VAPID key generation process; `firebase-admin` SDK configuration on Express backend. Complexity is moderate but requires external account setup.
- **Phase 3 (i18n):** Extent of hardcoded strings in existing components — needs a full codebase scan to count `t()` calls needed. The 24-page estimate is approximate; actual string count may be higher.
- **Phase 2 (SSE):** Vercel CORS configuration for SSE — the existing `backend/index.js` CORS allows `localhost:5173` and `do-an-tuyen-sinh.vercel.app`. Need to verify this works for SSE streaming (not just REST responses).

Phases with standard patterns (skip detailed research-phase):

- **Phase 1 (PWA):** `vite-plugin-pwa` is well-documented; Workbox strategies are standard. Confirmed approach with low risk.
- **SSE reconnection logic:** `useSSE.js` with exponential backoff is a well-established pattern. Implement once, reuse everywhere.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | npm registry versions confirmed; ecosystem patterns verified against current dates |
| Features | MEDIUM | Based on standard web platform patterns + PROJECT.md context |
| Architecture | MEDIUM | Codebase confirmed; integration patterns from official docs |
| Pitfalls | MEDIUM-HIGH | Community patterns + official docs; SSE reconnect and connection cleanup verified via MDN |

**Overall confidence:** MEDIUM

### Gaps to Address

- **Exact string count for i18n:** Needs a full codebase scan of all ~24 page components to count hardcoded strings. The migration effort may be larger than estimated.
- **Firebase project access:** No Firebase project exists yet. FCM cannot proceed without account setup, VAPID keys, and `firebase-admin` credentials.
- **Vercel SSE CORS behavior:** Need to verify that CORS headers that work for REST responses also work for SSE streaming responses.
- **manifest.json icon sizes:** Need to verify existing icons at `/icons/` cover all sizes required by `vite-plugin-pwa` (192×192, 512×512 minimum).

## Sources

### Primary (HIGH confidence)
- [npm registry](https://www.npmjs.com) — version numbers confirmed for all packages
- [MDN: Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) — SSE lifecycle, reconnection, cleanup
- [vite-plugin-pwa official guide](https://vite-pwa-org.netlify.app/) — SW registration, build integration, manifest configuration
- [react-i18next official documentation](https://react.i18next.com/) — namespace lazy loading, language detection

### Secondary (MEDIUM confidence)
- [Workbox documentation (Google)](https://developer.chrome.com/docs/workbox/) — caching strategies, cache expiration, SW best practices
- [Firebase Cloud Messaging Web Documentation](https://firebase.google.com/docs/cloud-messaging/js/client) — FCM SW registration, VAPID keys
- [Vercel: Configuring Caching Headers](https://vercel.com/docs/concepts/edge-network/caching) — cache-control headers per route
- [Google Web Dev: PWA Checklist](https://web.dev/pwa-checklist/) — install prompt timing, offline behavior, manifest requirements
- [locize: react-i18next lazy loading](https://locize.com/blog/react-i18next/) — namespace pattern, Suspense requirement

### Tertiary (LOW confidence)
- [Stack Overflow: SSE + Express connection cleanup](https://stackoverflow.com/questions/59727602/how-to-cleanup-express-sse-connections-when-client-disconnect) — `req.on('close')` pattern; community source, needs verification in production
- [Vercel + SSE compatibility](https://vercel.com/guides/do-serverless-functions-support-sse) — serverless function timeout constraints confirmed; SSE must run on Express backend

---

*Research completed: 2026-03-30*
*Ready for roadmap: yes*