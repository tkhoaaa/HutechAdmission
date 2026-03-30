# Pitfalls Research

**Domain:** PWA + Real-time Notifications + i18n on React 18 + Vite 7 + Express.js
**Researched:** 2026-03-30
**Confidence:** MEDIUM-HIGH

## Critical Pitfalls

### Pitfall 1: SW Registration Timing -- Assets Load Before Cache Is Ready

**What goes wrong:**
The SPA loads and renders before the Service Worker finishes installing and activating. Users see a partially cached or uncached app on first visit, causing blank screens, missing assets, or broken layouts.

**Why it happens:**
`vite-plugin-pwa` registers the SW via a `<script>` injected into `index.html`. If the SW installation takes time (pre-caching a large bundle), the app may mount with `navigator.serviceWorker` still `undefined` or in `installing` state. The app then makes network requests that should be intercepted, but the SW is not yet active.

**How to avoid:**
1. Use `vite-plugin-pwa`'s `registerType: 'autoUpdate'` (default). This handles the update cycle correctly.
2. Add a loading state during SW registration. Show a minimal shell or splash until the SW is `active`:

```javascript
// In your app entry, before rendering
navigator.serviceWorker?.register('/sw.js').then(reg => {
  if (reg.active) {
    // SW already active, proceed
    renderApp();
  } else {
    // Wait for activation
    reg.installing?.addEventListener('statechange', (e) => {
      if (e.target?.state === 'active') renderApp();
    });
  }
});
```

3. Alternatively, use the `waitOnLocalhost` strategy (blocks rendering until SW is ready) if offline-first is critical for first load.
4. Pre-cache the critical path (HTML shell + critical CSS) using Workbox's `ManifestTransformPlugin` to ensure minimal assets load instantly.

**Warning signs:**
- Lighthouse PWA audit shows "User will not be prompted to install the Web App" on fresh incognito visit
- Console errors like "Cannot read property 'add' of undefined" from SW cache
- Random blank pages on first PWA load, works on refresh

**Phase to address:**
Phase 1 (PWA infrastructure: SW + caching) -- this is a foundational setup issue.

---

### Pitfall 2: Cache Poisoning -- Old SW Serves Stale Assets After Deploy

**What goes wrong:**
After a new Vercel deployment, the old Service Worker still serves cached versions of JS/CSS bundles. Users run outdated code against a new API, causing runtime errors, broken UI, or data inconsistencies. The app looks broken until users manually unregister the SW.

**Why it happens:**
The SW caches assets with a long TTL or uses a "cache-first" strategy without a cache-busting mechanism tied to deployment. When Vercel deploys new assets (with new content-hashed filenames), the old SW's cache still holds the old assets. The browser serves the old SW because it was registered once and persists across deployments.

**How to avoid:**
1. **Always use content-hashed filenames** (Vite does this by default for production builds). The SW cache key should be the URL itself, so new hashes = new cache entries.
2. Configure `vite-plugin-pwa` with `manifest: { publicExposed: [...] }` and use Workbox's `CacheExpirationPlugin` with a reasonable `maxAgeSeconds` (e.g., 1 day for assets, 1 week for fonts).
3. Implement a "new version available" UX pattern: listen for `reg.update()` and prompt the user to reload when a new SW is waiting:

```javascript
// In SW registration
navigator.serviceWorker?.register('/sw.js').then(reg => {
  reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing;
    newWorker?.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New SW available, prompt user
        showUpdatePrompt();
      }
    });
  });
});
```

4. For critical data (admission results), prefer **network-first** for API calls, not cache-first. This prevents stale data from being served as "truth."

**Warning signs:**
- Users reporting "the app looks different from what I submitted yesterday"
- API responses don't match what the UI renders
- Browser DevTools shows cached responses with old `content-length` on new deployments

**Phase to address:**
Phase 1 (PWA caching strategies) -- must be configured before going live.

---

### Pitfall 3: Vercel Edge Caching Overrides Service Worker Caching Headers

**What goes wrong:**
Vercel's CDN (edge network) caches responses at the edge level before they reach the browser or SW. Even with correct SW caching strategies, users get stale data cached by Vercel, and the SW never gets a chance to intercept or update the response.

**Why it happens:**
Vercel automatically caches static assets at the edge. By default, `Cache-Control` headers on your server responses may tell Vercel to cache for hours or days. The SW sits between the browser and the network, but Vercel's edge sits above the SW. If an API response is cached at the edge, the SW never sees a fresh request.

**How to avoid:**
1. Set `Cache-Control: public, max-age=0, must-revalidate` on API endpoints in Express. This tells Vercel not to cache at the edge:

```javascript
// In Express routes for API endpoints
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
```

2. For Vercel, use `vercel.json` to configure caching headers per route:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

3. Static assets (JS/CSS/images) CAN be cached aggressively at the edge since they have content hashes. But HTML files should have short or no edge caching to allow SW updates to propagate quickly.
4. For the SSE endpoint, explicitly disable all caching: `Cache-Control: no-cache, no-store, must-revalidate`.

**Warning signs:**
- SSE events not reaching the browser (edge caching the connection)
- API data doesn't update even after clearing browser cache
- Lighthouse shows "Page load is not fast enough" despite optimized bundles

**Phase to address:**
Phase 1 (PWA infrastructure) combined with SSE endpoint setup. This is a cross-cutting concern.

---

### Pitfall 4: SSE Connection Never Closes on Browser Tab Close / Navigates Away

**What goes wrong:**
When a user navigates to another page or closes the tab, the `EventSource` connection remains open on the server. Over time, this accumulates open connections on the Express server, eventually exhausting server resources or hitting connection limits. The server continues sending events to dead connections.

**Why it happens:**
`EventSource` does not have a built-in mechanism to send a "close" signal to the server when the browser tab is closed. The TCP connection may stay in `TIME_WAIT` state briefly, but Express event emitters are not cleaned up. Each page navigation (e.g., going from `/` to `/result`) creates a new SSE connection without closing the old one, especially with React Router's client-side navigation.

**How to avoid:**
1. **Always close the EventSource in `useEffect` cleanup**:

```javascript
useEffect(() => {
  const eventSource = new EventSource('/api/sse/notifications');

  // Handle messages
  eventSource.onmessage = (event) => { /* ... */ };

  // Cleanup on unmount
  return () => {
    eventSource.close();
  };
}, []);
```

2. **Handle `beforeunload` for full page navigation**:

```javascript
useEffect(() => {
  const eventSource = new EventSource('/api/sse/notifications');

  const handleUnload = () => {
    eventSource.close();
    // Send a final message to the server so it can clean up
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/sse/close');
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  return () => {
    eventSource.close();
    window.removeEventListener('beforeunload', handleUnload);
  };
}, []);
```

3. **Server-side: detect closed connections**. In Express, use `req.on('close')` to detect when the client disconnects:

```javascript
app.get('/api/sse/notifications', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = req.query.userId;

  const sendUpdate = (data) => {
    if (res.writableEnded) return; // Client disconnected
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Register client
  clientRegistry.add(clientId, sendUpdate);

  // Clean up on close
  req.on('close', () => {
    clientRegistry.remove(clientId);
  });
});
```

4. **Set a `keep-alive` heartbeat** so intermediate proxies (nginx, load balancers) do not close the connection due to inactivity:

```javascript
// Server: send a comment line every 30 seconds
const heartbeat = setInterval(() => {
  if (!res.writableEnded) {
    res.write(': heartbeat\n\n');
  }
}, 30000);
req.on('close', () => clearInterval(heartbeat));
```

5. **React Router navigation**: Each route change that mounts an SSE component creates a new connection. Design SSE management as a global singleton (React context or a dedicated hook that lives at the app root level), not per-page. All pages share one SSE connection.

**Warning signs:**
- Express server `netstat` shows hundreds of open connections
- Server memory grows linearly over time
- SSE events are delayed or batched unexpectedly
- `Error: Hub connection already exists` or similar from duplicate connection attempts

**Phase to address:**
Phase 2 (SSE endpoint + notification UI) -- this must be built correctly from day one or it will silently accumulate.

---

### Pitfall 5: No Exponential Backoff on SSE Reconnection

**What goes wrong:**
When the SSE connection drops (network blip, server restart), the `EventSource` automatically reconnects with a short delay. On repeated failures, the browser reconnects rapidly, flooding the server with connection requests and making the outage worse. The server may ban the client IP, or the browser tab becomes unresponsive.

**Why it happens:**
`EventSource` has built-in reconnection, but it uses a short delay that decreases on each attempt (standard behavior). After a server outage, all connected clients reconnect simultaneously, creating a "thundering herd" that overwhelms the recovering server.

**How to avoid:**
1. **Do not rely on EventSource's default reconnection** for critical notification flows. Implement manual reconnection with exponential backoff:

```javascript
function createSSEWithBackoff(url, options = {}) {
  const { maxRetries = 10, baseDelay = 1000 } = options;
  let retryCount = 0;
  let eventSource = null;
  let timeoutId = null;

  function connect() {
    eventSource = new EventSource(url);

    eventSource.onopen = () => {
      retryCount = 0;
    };

    eventSource.onerror = () => {
      eventSource.close();
      if (retryCount < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
        retryCount++;
        timeoutId = setTimeout(connect, delay);
      }
    };

    return eventSource;
  }

  return {
    open: connect,
    close: () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (eventSource) eventSource.close();
    }
  };
}
```

2. **Track connection state** in React with a dedicated hook. Show UI feedback (e.g., "Reconnecting..." badge) so users know the system is recovering.
3. **Use `navigator.onLine` and `offline`/`online` events** to pause reconnection attempts when the device is genuinely offline, and resume when back online.
4. Consider a maximum delay cap (e.g., 30 seconds) so users do not wait forever for reconnection.

**Warning signs:**
- Server logs show sudden spike in connection attempts after restart
- Browser tab CPU usage spikes during network instability
- "Too many connections" errors from Express or Vercel serverless functions

**Phase to address:**
Phase 2 (SSE endpoint + notification UI) -- must be implemented alongside the SSE hook.

---

### Pitfall 6: i18n Translation Keys Missing in Production (Ghost Strings)

**What goes wrong:**
After deployment, some UI strings appear as blank spaces, untranslated keys (e.g., `[common.welcome_message]`), or fallback language strings instead of the correct translation. This happens because translation keys were added after the last locale file was built, or keys were extracted from source but never added to translation files.

**Why it happens:**
1. `i18next-scanner` (or `vite-plugin-i18next`) runs at build time to extract keys. If a developer adds a new `t('key')` call after the last scan, it is missing from the built locale files.
2. In development, `fallbackLng: 'vi'` kicks in and shows the Vietnamese string (or a placeholder), hiding the problem until production.
3. Lazy-loaded locale files may not include all keys if the extraction only runs on the initially-loaded bundle.

**How to avoid:**
1. **Fail the build if missing keys are detected**: configure `i18next-scanner` with ` interpolation: { escapeValue: false }` and a `漠视` (ignore) list, then run a pre-production check:

```javascript
// In your i18n config
i18next.use(Backend).init({
  fallbackLng: 'vi',
  debug: process.env.NODE_ENV === 'development',
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    if (process.env.NODE_ENV === 'production') {
      console.error(`MISSING KEY: ${ns}:${key}`);
      // Or: throw new Error(`Missing translation: ${key}`);
    }
  },
});
```

2. **Use `react-i18next`'s `useTranslation` with explicit namespace support** for lazy-loaded namespaces. Do not mix default namespace usage across the app without a clear convention.
3. **Add a CI/CD check** that runs `i18next` extraction and compares against committed locale files, failing if new keys are detected without corresponding translations.
4. **Use descriptive key names** rather than auto-generated hashes. Keys like `admission.form.step3.label.name` are self-documenting and easier to track than UUIDs.

**Warning signs:**
- Build logs show "missing key" warnings during development (these are the warning signs to catch)
- Lighthouse accessibility audit flags empty `aria-label` or `alt` attributes on translated images
- QA reports "some text is in English" on the Vietnamese site

**Phase to address:**
Phase 3 (i18n infrastructure) -- tooling must be set up correctly before any translation work begins.

---

### Pitfall 7: RTL Layout Breaks When Adding Arabic/Hebrew Support

**What goes wrong:**
The entire layout flips incorrectly when an RTL language is added. CSS properties that work for LTR (like `margin-left`, `padding-right`) remain directionally tied to the original LTR layout. The sidebar appears on the wrong side, text alignment is wrong, icons that indicate direction (arrows, chevrons) are not flipped, and the language switcher itself may disappear or be inaccessible.

**Why it happens:**
1. `react-i18next` does not handle RTL -- it only provides translated strings. Direction must be set on the `html` element.
2. CSS that uses absolute directional values (`margin-left: 16px`) instead of logical properties (`margin-inline-start: 16px`) does not flip in RTL.
3. Tailwind CSS 3.x defaults to LTR physical properties. The project needs explicit RTL-aware classes (`rtl:ml-4`, `ltr:ml-4`) or must migrate to logical properties.

**How to avoid:**
1. **Set direction on the document root** whenever the language changes:

```javascript
// In your language switcher handler
import i18n from './i18n';

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  document.documentElement.dir = lng === 'ar' || lng === 'he' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};
```

2. **Migrate CSS to logical properties** (Tailwind supports these natively):

| Physical (LTR-only) | Logical (RTL-aware) |
|---------------------|---------------------|
| `ml-4`, `mr-4` | `ms-4`, `me-4` |
| `pl-4`, `pr-4` | `ps-4`, `pe-4` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `float-left`, `float-right` | `float-start`, `float-end` |

3. **Audit icons and visual indicators**: Use `react-icons` icons that are symmetric or explicitly handle direction. Arrows like `FaChevronRight` should become `FaChevronLeft` for RTL -- or better, use a component that auto-flips with CSS `transform: scaleX(-1)` in RTL context.
4. **Test RTL early** -- do not design everything in LTR and plan to "fix RTL later." The project only needs Vietnamese and English (both LTR), so this is **low risk for M2**, but if any RTL language is ever considered, set up the direction infrastructure now.

**Warning signs:**
- Sidebar or navigation items on the wrong side after language change
- Arrow icons pointing the wrong direction
- Scroll bars on the wrong side

**Phase to address:**
Phase 3 (i18n + language switcher) -- if RTL languages are ever planned. For current scope (VI + EN), this is a low-priority watch item.

---

### Pitfall 8: SEO Meta Tags Are Not Translated and No hreflang Exists

**What goes wrong:**
Search engines index the Vietnamese version of page titles and meta descriptions for all language versions. English-speaking users searching in English do not find the English version of the site. Google may penalize for duplicate content across language variants if hreflang is missing.

**Why it happens:**
1. `react-i18next` only translates strings rendered in the DOM. `<title>` and `<meta>` tags in the document `<head>` are not part of the React component tree by default and do not respond to `t()` calls.
2. Without `<link rel="alternate" hreflang="...">` tags, Google cannot associate the language variants of the same page, leading to incorrect indexing.

**How to avoid:**
1. **Use `react-helmet-async` or a similar library** to manage document head tags from React components:

```javascript
import { Helmet } from 'react-helmet-async';

function AdmissionPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('seo.admission.title')}</title>
        <meta name="description" content={t('seo.admission.description')} />
        <link rel="alternate" hreflang="vi" href="https://hutech.edu.vn/tuyen-sinh" />
        <link rel="alternate" hreflang="en" href="https://hutech.edu.vn/en/admissions" />
        <link rel="alternate" hreflang="x-default" href="https://hutech.edu.vn/tuyen-sinh" />
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

2. **Update `react-helmet-async`'s `Provider`** in your app root (`main.jsx`).
3. **For SEO in a SPA on Vercel**, note that crawlers may not execute JavaScript to render meta tags. Either use Vercel's server-side rendering (SSR) mode, or ensure meta tags are present in the initial HTML shell (can be injected via `vite-plugin-pwa`'s `base` configuration or a `template.html` modification).
4. **Add `hreflang`** for all language variants. For a SPA with client-side routing, this typically means one `<link>` tag per language variant.

**Warning signs:**
- Google Search Console shows "Sitemaps contain URLs noindex" or missing hreflang
- English pages still show Vietnamese titles in Google search results
- Lighthouse SEO score drops after i18n is added

**Phase to address:**
Phase 3 (i18n infrastructure) -- SEO meta tags should be part of the i18n scaffold, not bolted on later.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using cache-first for ALL resources (including API) | Faster perceived performance | Users see stale data; cache poisoning | Only for truly static assets (images, fonts, CSS with content hashes) |
| One global SSE connection shared by all components | Simple to implement | Components tightly coupled; hard to debug which component triggered reconnect | Only if SSE is managed at app root with a context |
| Hardcoding locale keys as string literals `t('home.title')` | No setup needed | Translation files get out of sync; no extraction tooling | Never for production |
| Skipping `beforeunload` cleanup for SSE | Saves a few lines of code | Connection leaks on navigation; server resource exhaustion | Never |
| Using `axios` interceptors for SSE connection setup | Reuses existing HTTP patterns | SSE is not HTTP; mixing patterns creates confusion | Never -- SSE needs its own connection management |
| Lazy-loading locale files without a fallback namespace | Smaller initial bundle | Flash of untranslated content on route change | Only with preloading of the default namespace |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| FCM (Firebase Cloud Messaging) | Using a separate SW for FCM that conflicts with the main vite-plugin-pwa SW | Use a single SW that handles both caching (Workbox) and FCM. Register FCM messaging in the same SW file. `importScripts` for Firebase SDK inside the SW. |
| FCM + Vercel | Vercel edge functions cannot run long-running background processes like SWs | FCM push notifications require a standard Node.js server, not Vercel edge. The SSE endpoint and FCM token management should run on the Express backend (port 3001), not on Vercel. |
| vite-plugin-pwa + Vercel SSR | Enabling SSR mode breaks SW registration | vite-plugin-pwa requires a static SPA build. If using Vercel SSR mode, keep PWA only on the static preview deployment, not the SSR version. |
| SSE + Vercel serverless | Serverless functions have execution time limits (10s on hobby, 60s on pro) | SSE connections timeout on serverless. The SSE endpoint MUST run on the Express backend server (port 3001), not Vercel functions. Vercel is for static hosting only. |
| axios + i18n | Setting `Accept-Language` header per-request manually | Set axios default headers globally once on app init: `axios.defaults.headers.common['Accept-Language'] = i18n.language;` |
| sonner toasts + i18n | Using hardcoded strings in toast messages | Use `useTranslation` inside the toast or pass translated strings: `toast(t('notification.success'))` |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Pre-caching all assets on first load | 3-5 second delay on first PWA visit, users think the app is broken | Use "增量缓存" -- only pre-cache the app shell. Lazy-cache remaining assets on first access. Configure `vite-plugin-pwa` `strategy: 'generateSW'` with `navigateFallback: '/index.html'` and let runtime caching handle non-critical assets. | On slow 3G connections or devices with limited storage |
| SSE event buffer accumulation | Memory grows as unread events pile up if tab is backgrounded | Implement a max buffer size. If the buffer exceeds N events, drop oldest events. On reconnect, fetch the current state via REST API, not rely on replaying missed events. | After several hours of background tab with no focus |
| Loading all locale namespaces at once | Initial bundle includes all translations (VI + EN), defeating lazy loading | Split locale files by route/page namespace. Load only the namespace needed for the current route. The `common` namespace (buttons, labels) should be in the initial load; page-specific namespaces are lazy. | Every page load carries the full translation payload |
| Too many SSE event handlers | Each notification component registers its own `onmessage` handler, creating competing handlers | Use a single event bus (e.g., a custom `NotificationContext`) that all components subscribe to. One EventSource, many listeners. | After 10+ notification types across admin + user views |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| SSE endpoint not validating JWT | Any user can connect to any user's SSE stream and see private admission results | Validate JWT from query param or cookie on every SSE connection. Reject with 401 if token is invalid or expired. |
| SSE user ID from query param without ownership check | User A sends `?userId=B` and sees User B's notifications | On the server, extract the user ID from the verified JWT, NOT from the query parameter. Ignore any `userId` in the query string. |
| PWA manifest with `theme_color` that does not match meta theme-color | Browser may show incorrect color in the address bar or splash screen | Ensure `<meta name="theme-color">` in `index.html` matches `theme_color` in manifest.json. vite-plugin-pwa can inject this automatically. |
| Firebase VAPID key exposed in client-side code | Anyone can send push notifications to your FCM topic | VAPID key is intentionally public (identifies your app). However, ensure FCM server key / service account credentials are NEVER in client code. Store them in environment variables on the Express backend only. |
| No CSP headers for Service Worker | XSS within SW cache poisoning | Add Content-Security-Policy headers that restrict `script-src 'self'` and do not allow inline scripts in the SW scope. |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Install prompt shown on first visit immediately | Users do not know what the app is yet; low install conversion and annoyance | Use the "delayed prompt" pattern: track installation eligibility, show the prompt after the user has engaged meaningfully (e.g., after 2 page visits or 30 seconds on site). Use `@vite-pwa/sveltekit` deferred prompt approach. |
| Notification permission requested immediately on page load | Users deny permission because they do not understand the value; cannot re-prompt | Wait until the user performs a relevant action (e.g., submits an admission form). Show an explanation card first: "Get notified when your admission result is ready." |
| Language switcher loses page context | Switching language resets the user to the home page, losing their place | Preserve the current route + scroll position. Use `react-i18next`'s language detection with `lookupLocalStorage` and ensure the router navigates to the equivalent route in the new language. |
| Toast notifications for every SSE event | Notification spam; users mute or ignore toasts | Implement a notification inbox model: queue events silently, show a bell icon badge. A toast appears only for high-priority events (e.g., "Your admission result is ready"). |
| No offline indicator | User fills out a long form while offline, submits, and the request appears to succeed but never reaches the server | Use the SW to detect online/offline state. Show a persistent banner: "You are offline. Your submission will be sent when connection is restored." Queue the request in IndexedDB. |

---

## "Looks Done But Isn't" Checklist

- [ ] **PWA Service Worker:** Often missing the `skipWaiting()` + `clients.claim()` flow in the SW source -- verify the generated SW in `dist/` contains these calls.
- [ ] **PWA Offline:** Often the offline fallback page loads but API calls still fail silently -- verify API calls are handled with a network-first strategy that degrades gracefully.
- [ ] **SSE Reconnection:** Often the reconnection works in dev but fails in production behind a corporate proxy -- test reconnection behind a VPN or corporate firewall.
- [ ] **SSE Cleanup:** Often the SSE connection is closed on component unmount but not on route change within React Router -- verify React Router navigation does not leak connections.
- [ ] **i18n Translation Files:** Often locale files are built once and never updated when new keys are added -- verify CI/CD fails if new keys are detected without translations.
- [ ] **i18n SEO:** Often meta tags are translated but hreflang is missing -- verify all pages have correct `<link rel="alternate" hreflang>` tags.
- [ ] **FCM Push Notifications:** Often the SW registration for FCM conflicts with the main caching SW -- verify only one SW file exists and it handles both.
- [ ] **Manifest Icons:** Often only 192x192 and 512x512 icons are provided, causing the "Add to Home Screen" to use upscaled blurry icons -- verify icons exist at all required sizes listed in the manifest.
- [ ] **Bundle Size:** Often adding PWA (Workbox runtime) + i18n (react-i18next + locale files) exceeds the 50KB constraint -- verify the production bundle size with `vite build --mode production` and check the chunk sizes.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| SW serves stale assets | MEDIUM | 1) Push a new SW version with `skipWaiting()` forcing activation. 2) If Vercel edge cache is the issue, purge the Vercel cache via dashboard or `vercel purge-url`. 3) Set cache-control headers correctly and redeploy. |
| SSE connection leak (server) | LOW-MEDIUM | 1) Check `req.on('close')` handler is firing. 2) Implement a heartbeat to detect dead connections. 3) Restart Express server to clear stuck connections. 4) Set up connection count monitoring. |
| Missing translation keys in prod | MEDIUM | 1) Add missing keys to locale files. 2) If hotfix: add keys directly to locale files (not source code). 3) Rebuild. 4) Add the key extraction to CI to prevent recurrence. |
| Cache poisoning (old data served) | HIGH | 1) Identify the cache strategy that caused it. 2) Clear the affected cache (browser DevTools for users, Vercel CDN purge for all users). 3) Change the cache key strategy (add content hash or query param). 4) Force SW update with `self.skipWaiting()`. |
| FCM SW conflicts with Workbox SW | MEDIUM | 1) Consolidate into a single SW. 2) Use Workbox's `registerRoute` for caching, inject Firebase SDK via `importScripts` within the same SW. 3) Register the unified SW in `main.jsx`. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| SW registration timing | Phase 1: PWA infrastructure | Load app in incognito, check DevTools SW status = "activated and running" before app renders |
| Cache poisoning after deploy | Phase 1: PWA caching strategies | Deploy new version, verify assets have new content hashes, old SW cannot serve them |
| Vercel edge caching overrides SW | Phase 1: PWA infrastructure | Check Vercel network tab for `x-vercel-cache` headers on API responses |
| SSE connection never closes | Phase 2: SSE endpoint | Navigate between pages, check `netstat` on server or Vercel function logs for open connections |
| SSE no exponential backoff | Phase 2: SSE endpoint | Kill the Express server, observe reconnect behavior -- should not flood |
| Missing translation keys | Phase 3: i18n infrastructure | Run `npm run i18n-extract`, verify no new keys appear without translations |
| RTL layout breaks | Phase 3: i18n + language switcher | Only relevant if RTL languages are added |
| SEO meta tags not translated | Phase 3: i18n + language switcher | Inspect page `<head>` in browser, verify `<title>` and `<meta>` change with language |
| FCM + PWA SW conflict | Phase 1: PWA + FCM integration | Register SW once, verify both caching (Workbox) and FCM messaging work together |
| Bundle size exceeds 50KB | All phases | Run `vite build`, check gzip sizes of main chunks before committing |

---

## Sources

- [vite-plugin-pwa official documentation](https://vite-pwa-org.netlify.app/) -- SW registration, caching strategies, manifest configuration (MEDIUM confidence)
- [Workbox documentation](https://developer.chrome.com/docs/workbox/) -- caching strategies, cache expiration, SW best practices (MEDIUM confidence)
- [react-i18next official documentation](https://react.i18next.com/) -- namespace lazy loading, language detection, interpolation (MEDIUM confidence)
- [MDN: Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) -- EventSource lifecycle, reconnection behavior (HIGH confidence)
- [Google Web Dev: PWA Checklist](https://web.dev/pwa-checklist/) -- install prompt timing, offline behavior, manifest requirements (MEDIUM confidence)
- [Firebase Cloud Messaging Web Documentation](https://firebase.google.com/docs/cloud-messaging/js/client) -- FCM SW registration, VAPID keys (MEDIUM confidence)
- [Vercel: Configuring Caching Headers](https://vercel.com/docs/concepts/edge-network/caching) -- cache-control headers per route on Vercel (MEDIUM confidence)
- [Stack Overflow / community discussions: SSE + Express connection cleanup](https://stackoverflow.com/questions/59727602/how-to-cleanup-express-sse-connections-when-client-disconnect) -- req.on('close') pattern for connection cleanup (LOW-MEDIUM confidence, community source)

---

*Pitfalls research for: PWA + Real-time Notifications + i18n on React 18 + Vite 7 + Express.js*
*Researched: 2026-03-30*
