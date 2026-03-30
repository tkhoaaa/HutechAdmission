# DoAnTuyenSinh - Website Tuyển Sinh HUTECH

## What This Is

Website tuyển sinh trực tuyến của Trường Đại học HUTECH — cho phép thí sinh đăng ký xét tuyển, tra cứu kết quả, đăng ký tư vấn, và quản lý hồ sơ tuyển sinh. Hệ thống bao gồm trang công khai (public) và trang quản trị (admin) riêng biệt.

## Core Value

Thí sinh có thể hoàn tất toàn bộ quy trình tuyển sinh từ đăng ký đến tra cứu kết quả trên nền tảng web hiện đại, chuyên nghiệp, nhanh chóng.

## Current Milestone: M2 — Advanced Features

**Goal:** Thêm 3 tính năng nâng cao: PWA hoàn chỉnh, real-time notifications, và đa ngôn ngữ (i18n).

**Target features:**
- Option A — PWA: Service Worker + offline support + install prompt + push notifications
- Option B — Real-time: SSE cho admin thấy hồ sơ mới, thí sinh thấy cập nhật kết quả
- Option C — i18n: Tiếng Việt + Tiếng Anh, lazy-load locale files

## Requirements

### Validated (M1)

- ✓ Đăng ký / Đăng nhập tài khoản — v1
- ✓ Dark mode toàn trang — v1
- ✓ Header sticky navigation — v1
- ✓ Footer với thông tin liên hệ — v1
- ✓ Trang chủ với hero + stats — v1
- ✓ Trang đăng ký xét tuyển — v1
- ✓ Trang tra cứu kết quả — v1
- ✓ Trang thông tin tuyển sinh — v1
- ✓ Trang liên hệ — v1
- ✓ Trang FAQ — v1
- ✓ Trang hồ sơ người dùng — v1
- ✓ Trang đăng ký tư vấn — v1
- ✓ Dashboard admin quản lý hồ sơ — v1
- ✓ Báo cáo thống kê admin — v1
- ✓ Cài đặt & FAQ quản lý admin — v1
- ✓ UI/UX Redesign hoàn chỉnh (shadcn/ui, dark mode, responsive) — M1
- ✓ Code splitting + bundle optimization — M1
- ✓ Toast migration (react-hot-toast → sonner) — M1
- ✓ **PWA-01**: Service Worker + Workbox caching (vite-plugin-pwa) — Phase 7
- ✓ **PWA-02**: Offline page khi mất kết nối (OfflineBoundary) — Phase 7
- ✓ **PWA-03**: Install prompt để cài đặt ứng dụng (beforeinstallprompt) — Phase 7

### Active (M2)
- [ ] **PWA-04**: Push notifications (FCM) khi có cập nhật hồ sơ
- [ ] **RT-01**: SSE endpoint cho real-time updates
- [ ] **RT-02**: Admin notification bell với live counter
- [ ] **RT-03**: Thí sinh nhận thông báo khi kết quả được cập nhật
- [ ] **I18N-01**: i18n infrastructure (react-i18next)
- [ ] **I18N-02**: Language switcher trong header
- [ ] **I18N-03**: Locale files tiếng Việt + tiếng Anh

### Out of Scope

- Thay đổi logic nghiệp vụ (business logic giữ nguyên) — chỉ thêm features
- Backend/API refactoring — chỉ thêm SSE endpoint
- TypeScript migration — JavaScript đủ cho scope hiện tại
- Payment gateway — không trong scope M2

## Context

**Tech Stack hiện tại (sau M1):**
- React 18 + Vite 7
- Tailwind CSS 3.x (custom config, CSS variables)
- Framer Motion (animations)
- React Router v6.30
- Recharts (charts)
- react-icons (icons)
- sonner (toast notifications)
- axios (HTTP client)
- @base-ui/react (shadcn-style components)

**Backend:**
- Express.js + MySQL
- JWT authentication
- Nodemailer email templates

**Deployment:**
- Vercel (frontend, automatic deploy)
- Node.js server (backend on port 3001)

**PWA state hiện tại:**
- Service Worker hoạt động qua vite-plugin-pwa + Workbox (dist/sw.js)
- 58 assets precached (1687KB), Google Fonts cache-first 1 năm
- OfflineBoundary component hiển thị trang "Không có kết nối" khi offline
- InstallPrompt hiển thị banner "Cài đặt HUTECHS App" qua beforeinstallprompt
- manifest.json + android-chrome icons (192x192, 512x512)

**i18n state hiện tại:**
- Hoàn toàn chưa có — hardcoded tiếng Việt

## Constraints

- **Tech Stack**: React + Vite + Tailwind — không đổi framework
- **Backward Compatibility**: Giữ nguyên tất cả routes, business logic, API contracts
- **Bundle Size**: Không tăng quá 50KB sau khi thêm PWA + i18n
- **Browser Support**: Hỗ trợ Chrome/Firefox/Edge/Safari phiên bản mới nhất
- **PWA**: Service Worker phải work offline (cache-first cho assets, network-first cho API)
- **Real-time**: Dùng SSE (Server-Sent Events) thay vì WebSocket — đơn giản hơn cho unidirectional updates

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PWA với Workbox | Workbox là thư viện chuẩn, hỗ trợ nhiều caching strategies, được Google maintain | Done (Phase 7) |
| SSE thay vì WebSocket | Unidirectional (server → client), đơn giản hơn, work được với Vercel edge functions | — Pending |
| react-i18next | Thư viện i18n phổ biến nhất cho React, lazy-load locale files | — Pending |
| FCM cho push notifications | Firebase Cloud Messaging là giải pháp push notification phổ biến nhất | — Pending |
| react-router-dom v6 | Ổn định, tương thích với React 18, API đơn giản | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-31 after Phase 7 completion*
