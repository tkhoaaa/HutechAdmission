# Feature Research: PWA, Real-time Notifications, i18n

**Domain:** University admissions platform (HUTECH tuyển sinh)
**Researched:** 2026-03-30
**Confidence:** MEDIUM (based on standard ecosystem patterns + PROJECT.md context)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist on a modern web platform. Missing these = product feels incomplete or unprofessional.

#### PWA Features

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Service Worker caching | Fast repeat visits, works in spotty connectivity areas (Vietnam mobile networks) | MEDIUM | Workbox is the standard choice. vite-plugin-pwa wraps it with good defaults. Cache-first for static assets, network-first for API calls. |
| Offline page | Graceful degradation when network fails mid-use | LOW | Simple HTML page served by SW when fetch fails. Should include retry button and basic navigation. |
| Install prompt | "Add to home screen" on mobile -- engagement and re-visits | MEDIUM | Requires `beforeinstallprompt` event capture, deferred prompt, user-initiated trigger. Auto-prompting is a poor UX (Chrome penalizes it). Should show custom banner once, not every visit. |

#### Real-time Features

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Admin notification bell | Admins need to know when new applications arrive without refreshing | MEDIUM | Bell icon with live badge counter. Needs SSE client that reconnects on drop. Counter resets on dropdown open or page refresh. |
| SSE endpoint for real-time updates | Admin dashboard should show live application counts | MEDIUM | Unidirectional server-to-client. Express.js supports SSE natively via `res.write`. Must handle client disconnect (server-side cleanup). Vercel supports SSE but has a 30s timeout per request -- clients must reconnect. |
| Student result update notification | Students want to know when their admission status changes | MEDIUM | SSE channel tied to student user ID. Server pushes event when `ket_qua` field changes. Student must be logged in to receive. |

#### i18n Features

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Language switcher | International students (HUTECH has foreign programs) need English; default Vietnamese for domestic users | LOW | Dropdown or toggle in header. Persist preference in `localStorage` + cookie (for SSR/backend). Initial language detection from browser `navigator.language`. |
| Lazy-loaded locale files | Only load the language the user needs | LOW | react-i18next with `lazy: true` in `i18next-http-backend`. VI + EN files only, loaded on demand. |
| Translated core UI | Header, footer, nav, buttons, form labels, validation messages | MEDIUM | All hardcoded strings in ~14 pages and ~10 admin pages need wrapping with `t()` keys. This is a large refactoring task -- every component file needs modification. |

### Differentiators (Competitive Advantage)

Features that set this admissions platform apart from other university sites. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| PWA install rate tracking | Know if students are actually installing the app | LOW | Track `appinstalled` event. Gives insight into engagement. |
| Push notifications (FCM) | Re-engage students who submitted applications | MEDIUM | Firebase Cloud Messaging. Requires Firebase project setup, VAPID key, service worker integration. Browser permission prompt is intrusive -- only request after user action (e.g., after submitting application). Students who enable push get notified on result updates even when browser is closed. |
| Student SSE for all updates | Students see status changes in real-time without polling | MEDIUM | Beyond result updates: document verification status, interview scheduling, etc. SSE channel per student. |
| Language preference per page | Let users switch language for one page without changing global preference | LOW | Unusual but valuable. Can be implemented as a URL parameter (`?lang=en`) or a temporary context override. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Auto-show install prompt on every visit | "Users will install more if we prompt often" | Browser vendors actively penalize aggressive prompting. Users dismiss it. Harms UX. | Show custom banner once, track dismissal, never show again for 30 days. |
| WebSocket instead of SSE | "WebSocket is more modern/powerful" | Overkill for unidirectional server-push. WebSocket adds complexity (ping/pong, reconnection logic, Vercel compatibility issues). SSE is purpose-built for this use case and works with Vercel's edge runtime. | SSE. |
| Translate everything immediately | "Let's support 5 languages from day one" | Scope explosion. Each additional language doubles translation effort. No existing demand for languages beyond VI/EN. | VI + EN only. Add others only when demand is validated. |
| Real-time for everything | "Admin dashboard should update for every single field change" | SSE channel proliferation. More server load. Complexity without clear user benefit -- admins refresh anyway. | SSE only for high-value events: new applications, result updates. Polling for everything else. |
| Browser push without user consent context | "Push notifications will increase engagement" | Vietnam users are sensitive to notifications. Permission fatigue is real. Without clear value exchange (e.g., "Get notified when your result is ready"), permission rates are low and uninstall rates are high. | Request push permission only after a meaningful action (application submitted). Frame it as opt-in benefit. |
| i18n for PDF/print outputs | "Generate English PDFs for international students" | PDF generation with i18n is a separate complex system. Layouts often break with translated text (text expansion in Vietnamese vs English). | Keep PDF outputs Vietnamese-only initially. Add English PDFs only if international enrollment grows. |

## Feature Dependencies

```
PWA Service Worker
    ├──requires──> manifest.json (already exists)
    │                └──requires──> PWA icons (already exist at /icons/)
    ├──requires──> vite-plugin-pwa or workbox (needs installation)
    │
    └──enables──> Offline page (simple HTML, served by SW)

PWA Push Notifications (FCM)
    ├──requires──> Firebase project + VAPID keys
    ├──requires──> SW with FCM messaging integration
    ├──requires──> Backend SSE (RT-01)
    │                └──requires──> Express SSE endpoint
    └──requires──> Browser permission (user-initiated)

SSE Real-time Updates
    ├──requires──> RT-01: SSE endpoint on Express backend
    ├──requires──> RT-02: Notification bell component (AdminLayout)
    │                └──requires──> Notification dropdown (existing modal/dropdown components)
    ├──requires──> RT-03: Student result SSE
    │                └──requires──> Student authentication (JWT, already exists)
    └──conflicts──> Vercel cold starts (SSE timeout after 30s -- need client reconnect logic)

i18n Infrastructure
    ├──requires──> I18N-01: react-i18next setup + i18n config
    ├──requires──> I18N-02: Language switcher in ThanhHeader
    │                └──requires──> localStorage persistence
    └──requires──> I18N-03: Locale files (VI default, EN lazy-loaded)
                       └──enhances──> Every page component (refactor all hardcoded strings)

Language Switcher
    └──enhances──> Dark mode toggle (existing -- language is another persisted user preference)
```

### Dependency Notes

- **SSE requires RT-01 backend endpoint:** Cannot build RT-02/RT-03 without the Express SSE endpoint first. Backend work must come before frontend SSE integration.
- **Push notifications require both PWA SW and FCM:** Cannot do PWA-04 until PWA-01 (SW) is working. Also requires Firebase project setup (account-level decision).
- **i18n touches every page:** I18N-03 (locale files) is easy. The hard part is wrapping all ~24 page components with `t()` keys. This is a content migration task, not a technical one.
- **Vercel + SSE compatibility:** Vercel serverless functions have a 30s response timeout. SSE clients must implement reconnection logic. This is standard but must be explicitly handled.

## MVP Definition

### Launch With (M2 -- Advanced Features)

- [ ] **PWA-01** -- Service Worker with Workbox (vite-plugin-pwa). Cache-first for assets, network-first for API. MEDIUM complexity.
- [ ] **PWA-02** -- Offline fallback page. Simple HTML with "You are offline" message and retry button. LOW complexity.
- [ ] **PWA-03** -- Install prompt with custom banner (deferred prompt). Show once, not auto-prompt. LOW complexity.
- [ ] **I18N-01** -- react-i18next infrastructure with lazy-loaded VI/EN locale files. LOW complexity but high refactoring effort.
- [ ] **I18N-02** -- Language switcher in ThanhHeader. Persist to localStorage. LOW complexity.
- [ ] **RT-01** -- SSE endpoint on Express backend for new applications event. MEDIUM complexity.

### Add After M2 Core Works

- [ ] **RT-02** -- Admin notification bell with live counter. Requires RT-01 first. LOW complexity (frontend only once SSE endpoint exists).
- [ ] **RT-03** -- Student SSE for result updates. Requires RT-01. LOW complexity (frontend only).
- [ ] **I18N-03** -- Full VI + EN locale coverage across all pages. This is the bulk of i18n work -- wrap every hardcoded string. MEDIUM complexity (content work, not technical).
- [ ] **PWA-04** -- Push notifications via FCM. Requires Firebase setup + SW integration. MEDIUM complexity with ongoing maintenance (Firebase project).

### Future Consideration (v2+)

- [ ] PWA install rate analytics dashboard
- [ ] Language preference per-page (URL parameter)
- [ ] Expanded language support (Chinese, Korean -- HUTECH has partner programs)
- [ ] Mobile app (React Native / Expo) -- if PWA install rates are low

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Rationale |
|---------|------------|---------------------|----------|-----------|
| PWA-01 Service Worker | MEDIUM | MEDIUM | P1 | Core PWA experience. Fast loads, offline resilience. |
| PWA-02 Offline page | MEDIUM | LOW | P1 | Critical for mobile users on spotty networks. |
| PWA-03 Install prompt | LOW | LOW | P1 | Quick win. Improves re-engagement for students who save to home screen. |
| I18N-01 Infrastructure | HIGH | MEDIUM | P1 | Foundation for everything else in i18n. Without it, translations cannot load. |
| I18N-02 Language switcher | MEDIUM | LOW | P1 | Visible feature. Students see it immediately. |
| I18N-03 Full locale coverage | MEDIUM | HIGH | P2 | Large refactoring effort. Should be done incrementally (page by page). |
| RT-01 SSE endpoint | HIGH | MEDIUM | P1 | Backend enabler for both RT-02 and RT-03. |
| RT-02 Admin notification bell | MEDIUM | LOW | P2 | Once RT-01 is ready, frontend integration is straightforward. |
| RT-03 Student result updates | MEDIUM | LOW | P2 | Once RT-01 is ready, frontend integration is straightforward. |
| PWA-04 Push notifications (FCM) | MEDIUM | MEDIUM | P3 | Requires Firebase setup. Permission rates may be low. Defer until after launch to measure demand. |

**Priority key:**
- P1: Must have for M2 completion
- P2: Should have, add when RT-01 / infrastructure is in place
- P3: Nice to have, evaluate after launch

## Competitor Feature Analysis

| Feature | Other Vietnamese University Admissions Sites | International Admissions Platforms | Our Approach |
|---------|----------------------------------------------|-------------------------------------|--------------|
| PWA / App-like experience | Rare. Most are static HTML sites. | Common (Canvas, Salesforce edu portals) | Build PWA properly -- offline, install, push. First-mover advantage in Vietnamese university space. |
| Real-time notifications | Almost none. Email only. | Email + in-app notifications. Some use SMS. | SSE for in-app. Push notifications as enhancement. |
| Language support | Vietnamese only, or poor machine translation | Full i18n (EN primary, plus multiple languages). | VI + EN with proper lazy-loading. Don't over-invest until international enrollment grows. |
| Mobile-first | Desktop-first, responsive afterthought | Mobile-first with native apps | PWA as the "native app" experience without app store friction. |

## Implementation Complexity Breakdown

### PWA (Workbox / vite-plugin-pwa)

**What it does:** Registers a Service Worker that intercepts network requests and serves cached responses based on strategies.

**Typical implementation:**
1. Install `vite-plugin-pwa` (wraps Workbox)
2. Configure in `vite.config.js` with caching strategies
3. Import `virtual:pwa-register` in `main.jsx`
4. Listen for `beforeinstallprompt`, store deferred prompt
5. Show custom "Install App" button/banner
6. Call `deferredPrompt.prompt()` on user action

**Caching strategies for this project:**
- Static assets (JS/CSS/images): Cache-first, update in background (Workbox `StaleWhileRevalidate`)
- API calls: Network-first with fallback to cache (most important data should still try network)
- Font files: Cache-first with long expiration
- HTML pages: Network-first (always try fresh, fallback to cache)

**Key files to modify:** `vite.config.js`, `src/main.jsx`, add offline HTML page in `public/`.

### SSE (Server-Sent Events)

**What it does:** HTTP connection held open. Server pushes events. Browser receives via `EventSource` API.

**Express.js server-side:**
```javascript
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add client to broadcast list
  clients.push(res);

  req.on('close', () => {
    // Remove client from broadcast list (cleanup)
    clients = clients.filter(c => c !== res);
  });
});
```

**Broadcasting events:**
```javascript
// When new application arrives
clients.forEach(client => {
  client.write(`data: ${JSON.stringify({ type: 'new_application', id: 123 })}\n\n`);
});
```

**Client-side (React):**
```javascript
useEffect(() => {
  const eventSource = new EventSource('/api/events');
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // update state
  };
  return () => eventSource.close();
}, []);
```

**Vercel-specific:** Serverless functions timeout. SSE needs a keep-alive ping every 15-20s and client reconnection logic. Or use a separate Node.js server for SSE endpoints (not on Vercel). **This is a key architectural decision.**

### i18n (react-i18next)

**What it does:** Wraps UI strings with translation keys. Loads locale JSON files on demand.

**Typical setup:**
1. Install `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`
2. Create `src/i18n/index.js` with configuration
3. Create `public/locales/vi/translation.json` and `public/locales/en/translation.json`
4. Wrap `App` with `I18nextProvider`
5. Replace all hardcoded strings: `"Trang chu"` -> `t('header.home')`

**Lazy loading:** `i18next-http-backend` fetches `/locales/{lang}/translation.json` only when that language is selected.

**Namespace strategy:** Use multiple namespaces to avoid loading everything at once. E.g., `common` (shared strings), `admin` (admin-only), `pages/home`, `pages/admission`, etc.

**Key challenge:** Every component that displays text needs modification. With ~24 pages, this is a significant content migration. Plan: create namespace per page, migrate page by page.

## Sources

- Workbox documentation (Google): https://developer.chrome.com/docs/workbox
- vite-plugin-pwa: https://vite-pwa-org.netlify.app
- SSE MDN: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- react-i18next: https://react.i18next.com
- FCM Web documentation: https://firebase.google.com/docs/cloud-messaging/js/client
- Google PWA installability criteria: https://web.dev/articles/install-criteria
- Vercel + SSE: https://vercel.com/guides/do-serverless-functions-support-sse

---

*Feature research for: M2 -- PWA, Real-time Notifications, i18n*
*Researched: 2026-03-30*
