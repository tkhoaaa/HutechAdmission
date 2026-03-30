# Roadmap: DoAnTuyenSinh

## Milestones

- **M1** - UI/UX Redesign - Phases 1-6 (shipped 2026-03-28)
- **M2** - Advanced Features - Phases 7-9 (in progress)

## Phases

- [ ] **Phase 7: PWA Infrastructure** - Service Worker, offline page, install prompt
- [x] **Phase 8: Real-time + Admin Notifications** - SSE endpoint, NotificationBell
- [ ] **Phase 9: Student Notifications + i18n** - Student SSE, LanguageSwitcher, locale files

---

## Phase Details

### Phase 7: PWA Infrastructure

**Goal**: App works offline, loads instantly on repeat visits, and can be installed as a standalone app

**Depends on**: Nothing (M2 first phase)

**Requirements**: PWA-01, PWA-02, PWA-03

**Success Criteria** (what must be TRUE):

1. Returning visitors see cached content served from Service Worker within 200ms
2. When network is disconnected, user sees offline page with message and retry button
3. First-time or engaged user sees install prompt banner ("Cai dat HUTECHS App")
4. Static assets (JS, CSS, images) are cached with content-hashed filenames and cache-first strategy
5. API calls use network-first strategy to prevent stale data

**Plans**: 3 plans

Plans:
- [x] 07-01: Install and configure vite-plugin-pwa in vite.config.js with Workbox caching strategies (2026-03-31, commit 3ecd6c0)
- [x] 07-02: Create offline fallback page (public/offline.html) and OfflineBoundary component
- [x] 07-03: Implement deferred install prompt banner with InstallPrompt component and useOffline hook

### Phase 8: Real-time + Admin Notifications

**Goal**: Admins receive live notifications when new applications are submitted, with a notification bell in the header

**Depends on**: Phase 7

**Requirements**: RT-01, RT-02

**Success Criteria** (what must be TRUE):

1. Admin browser maintains SSE connection to Express backend with 30s heartbeat
2. SSE reconnects automatically with exponential backoff if connection drops
3. Admin sees notification bell icon with live unread count badge in header
4. Admin can open notification dropdown to see list of new application alerts
5. SSE broadcasts to all connected admin clients when a new application is submitted

**Plans**: 2 plans (merged into 2 commits)

Plans:
- [x] 08-01: Create SSE service (backend/services/sseService.js) with client registry and heartbeat (commit 840a9d26)
- [x] 08-02: Build NotificationBell component with badge counter, NotificationContext, and useSSE hook (commits b2da2b57, 9ead9ab2)

### Phase 9: Student Notifications + i18n

**Goal**: Students receive real-time in-app notifications when their application status changes, and users can switch between Vietnamese and English

**Depends on**: Phase 8

**Requirements**: RT-03, I18N-01, I18N-02, I18N-03

**Success Criteria** (what must be TRUE):

1. Authenticated student browser establishes SSE connection tied to their studentId
2. Student receives in-app toast notification when admin updates their application status
3. User can switch language between Vietnamese and English via LanguageSwitcher in header
4. Language preference persists across browser sessions (localStorage)
5. SEO meta tags (title, description) update dynamically based on current language

**Plans**: 3 plans

Plans:
- [ ] 09-01: Wire SSE student notifications — trigger broadcast on status update, render in-app toast
- [ ] 09-02: Set up i18n infrastructure with react-i18next, LanguageSwitcher, locale files (VI/EN)
- [ ] 09-03: Add SEO meta tags with react-helmet-async, update per language, wrap common strings

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. PWA Infrastructure | 3/3 | Complete | 2026-03-31 |
| 8. Real-time + Admin | 0/3 | Not started | - |
| 9. Student RT + i18n | 0/3 | Not started | - |

**Coverage:** 9/9 requirements mapped

---

*M2 Roadmap created: 2026-03-31*
