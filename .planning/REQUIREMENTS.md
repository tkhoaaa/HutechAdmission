# Requirements: DoAnTuyenSinh - Milestone M2

**Defined:** 2026-03-30
**Core Value:** Thí sinh có thể hoàn tất toàn bộ quy trình tuyển sinh từ đăng ký đến tra cứu kết quả trên nền tảng web hiện đại, chuyên nghiệp, nhanh chóng.

## v1 Requirements

Requirements for M2 Advanced Features. Each maps to roadmap phases.

### PWA

- [ ] **PWA-01**: Service Worker được đăng ký tự động tại build time qua vite-plugin-pwa, với Workbox caching strategies (cache-first cho static assets, network-first cho API calls)
- [ ] **PWA-02**: Khi mất kết nối mạng, user thấy offline page với thông báo và retry button
- [ ] **PWA-03**: User được prompt cài đặt ứng dụng ("Cài đặt HUTECHS App") qua install prompt API
- [ ] **PWA-04**: Push notifications qua Firebase Cloud Messaging khi có cập nhật hồ sơ — DEFERRED (cần Firebase project setup)

### Real-time

- [ ] **RT-01**: Express backend có SSE endpoint với heartbeat 30s, client reconnection logic với exponential backoff
- [ ] **RT-02**: Admin thấy notification bell icon trong header với badge counter, popup dropdown hiển thị danh sách thông báo mới
- [ ] **RT-03**: Thí sinh nhận thông báo in-app qua SSE khi trạng thái hồ sơ được cập nhật bởi admin

### i18n

- [ ] **I18N-01**: react-i18next infrastructure với lazy-loaded locale files, LanguageSwitcher trong header (VI/EN)
- [ ] **I18N-02**: Locale files đầy đủ cho tiếng Việt và tiếng Anh, page-by-page string migration
- [ ] **I18N-03**: SEO meta tags (react-helmet-async) tự động cập nhật theo ngôn ngữ hiện tại

## Out of Scope

| Feature | Reason |
|---------|--------|
| FCM push notifications (PWA-04) | Cần Firebase project setup, VAPID key management, backend FCM integration. Deferred đến sau khi có Firebase. |
| RTL language support | Không có yêu cầu cho ngôn ngữ RTL trong scope hiện tại |
| Payment gateway | Không trong scope M2 |
| TypeScript migration | JavaScript đủ cho M2 scope |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PWA-01 | Phase 7 | Pending |
| PWA-02 | Phase 7 | Pending |
| PWA-03 | Phase 7 | Pending |
| RT-01 | Phase 8 | Pending |
| RT-02 | Phase 8 | Pending |
| RT-03 | Phase 9 | Pending |
| I18N-01 | Phase 9 | Pending |
| I18N-02 | Phase 9 | Pending |
| I18N-03 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-31 after roadmap creation (i18n phases corrected to 9)*
