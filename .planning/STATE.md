# STATE.md - DoAnTuyenSinh

**Project:** DoAnTuyenSinh - Website Tuyen Sinh HUTECH
**Last Updated:** 2026-03-31

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-30)

**Core value:** Thí sinh có thể hoàn tất toàn bộ quy trình tuyển sinh tu dang ky den tra cuu kết qua tren nen tang web hiện đại, chuyên nghiệp, nhanh chóng.

**Current focus:** Phase 7 — PWA Infrastructure

## Current Milestone

**Milestone:** M2 — Advanced Features
**Status:** In Progress
**Started:** 2026-03-30

## Current Position

Phase: 7 of 9 (PWA Infrastructure)
Plan: Not started
Status: Ready to plan
Last activity: 2026-03-31 — M2 roadmap created

Progress: [░░░░░░░░░░] 0% (0/9 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Complete | Avg/Plan |
|-------|-------|----------|----------|
| 7 | 3 | 0 | — |
| 8 | 3 | 0 | — |
| 9 | 3 | 0 | — |

**Recent Trend:** N/A (M2 just started)

*Updated after each plan completion*

## Milestone M1 Summary

| Phase | Status |
|-------|--------|
| 1-6 | Complete (2026-03-28) |

## Research Context

Research completed by 4 parallel agents on 2026-03-30:
- PWA: vite-plugin-pwa + Workbox confirmed (MEDIUM confidence)
- Real-time: SSE confirmed, Vercel incompatibility noted — SSE targets Express on port 3001
- i18n: react-i18next with lazy loading confirmed
- Key pitfalls: SSE connection leaks, cache poisoning, bundle size (50KB budget)

Full research: .planning/research/SUMMARY.md

## Accumulated Context

### Decisions

| Phase | Decision | Rationale |
|-------|----------|-----------|
| M2 | vite-plugin-pwa + Workbox for PWA | Standard Google-maintained solution with multiple caching strategies |
| M2 | SSE over WebSocket | Unidirectional updates only; simpler, ~30KB smaller bundle |
| M2 | react-i18next with lazy loading | Most popular React i18n lib; lazy namespaces required to stay under 50KB budget |
| M2 | SSE targets Express port 3001, not Vercel | Vercel serverless functions do not support SSE streaming |
| M2 | Deferred install prompt (not auto) | Chrome penalizes aggressive auto-prompting |
| M2 | PWA-04 (FCM push) deferred | Requires Firebase project setup, deferred to v2 |

### Blockers/Concerns

- **SSE CORS on Vercel:** Need to verify existing CORS config (localhost:5173 + do-an-tuyen-sinh.vercel.app) works for SSE streaming, not just REST responses. Flagged in research.
- **Bundle size:** PWA (~15-25KB) + i18n (~10-15KB) + firebase modular (~15-20KB) approaches 50KB ceiling. Must enforce modular imports and lazy loading strictly.
- **i18n string count:** Full codebase scan of ~24 page components needed to count hardcoded strings. Migration effort may be larger than estimated.

## Session Continuity

Last session: 2026-03-31
Stopped at: M2 roadmap created, Phase 7 ready to plan
Resume file: None

---
*State updated: 2026-03-31 — M2 roadmap created*
