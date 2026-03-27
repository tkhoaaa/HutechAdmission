# Roadmap: UI/UX Redesign - DoAnTuyenSinh

**Created:** 2026-03-28
**Core Value:** Thiết kế lại toàn bộ UI/UX theo shadcn/ui + design system hiện đại, nhất quán, performace tối ưu.

## Phases

| # | Phase | Status | Description |
|---|-------|--------|-------------|
| 1 | Foundation & Design System | ○ Pending | Thiết lập shadcn/ui, design tokens, consolidate dark mode |
| 2 | Shared Component Library | ○ Pending | Xây dựng lại Button, Card, Input, Modal, Table, v.v. |
| 3 | Layout & Navigation | ○ Pending | Header, Footer, Auth Layout, Admin Layout refactor |
| 4 | Public Pages | ○ Pending | Redesign 9 public pages |
| 5 | Admin Pages | ○ Pending | Redesign 6 admin pages + admin layout |
| 6 | Polish & Performance | ○ Pending | Animation optimization, accessibility audit, responsive fix |

## Phase Details

### Phase 1: Foundation & Design System

**Mục tiêu:** Thiết lập nền tảng design system + shadcn/ui

**Deliverables:**
- shadcn/ui CLI configured trong project
- Design tokens (CSS variables) cho colors, spacing, typography, shadows
- Dark mode consolidation (xóa ThemeContext)
- Tailwind config cleaned up
- Animation system chuẩn hóa trong `src/utils/animations.js`

**Components touched:** Tailwind config, DarkModeContext, ThemeContext, animations.js

**Estimates:** 2-3 ngày

---

### Phase 2: Shared Component Library

**Mục tiêu:** Xây dựng lại 16+ UI components theo shadcn/ui pattern

**Deliverables:**
- Button, Card, Input, Select, Dialog, Sheet, Tabs, Table, Badge, Avatar
- Toast (Sonner), Skeleton, Accordion, Dropdown, Checkbox, Switch, Progress
- StatsCard, Hero, Section, FeatureCard, EmptyState, PageHeader, FilterBar (custom)
- ARIA attributes đầy đủ trên tất cả interactive elements
- Keyboard navigation cho Select, Dropdown, Dialog

**Estimates:** 3-5 ngày

---

### Phase 3: Layout & Navigation

**Mục tiêu:** Refactor Header, Footer, Auth Layout, Admin Layout

**Deliverables:**
- Header: tách sub-components, shadcn Sheet cho mobile menu, DropdownMenu
- Footer: tách sub-components, bỏ Math.random(), CSS animations
- Auth Layout: unified layout cho DangNhap, DangKyTaiKhoan, QuenMatKhau
- Admin Layout: dark mode nhất quán, shadcn NavigationMenu/DropdownMenu
- Page transitions nhất quán qua AnimatePresence

**Estimates:** 2-3 ngày

---

### Phase 4: Public Pages

**Mục tiêu:** Redesign 9 public pages

**Deliverables:**
| Page | Components | Notes |
|------|-----------|-------|
| TrangChu | Hero, Stats, News, CTA | Giảm delays, CSS animations, Skeleton |
| DangKyXetTuyen | Multi-step form | react-hook-form + zod |
| TraCuuKetQua | Search + Result Card | Shadcn pattern |
| ThongTinTuyenSinh | Grid layout, Accordion | Major cards |
| LienHe | Form + Map | Shadcn form |
| CauHoiThuongGap | Accordion | Shadcn Accordion |
| HoSoNguoiDung | Tabs, Avatar, Form | Shadcn pattern |
| DangKyTuVan | Tabs, Form | Shadcn pattern |

**Estimates:** 3-4 ngày

---

### Phase 5: Admin Pages

**Mục tiêu:** Redesign 6 admin pages + admin layout

**Deliverables:**
| Page | Components | Notes |
|------|-----------|-------|
| TongQuan | Stats, Charts, Table | Dashboard |
| QuanLyHoSo | Table, Filters, Dialog | Full CRUD |
| BaoCao | Charts, Tables, Filters | Reports |
| CaiDat | Tabs, Switch, Form | Settings |
| QuanLyFAQ | Table, Accordion, Dialog | FAQ CRUD |
| HoSoQuanLi | Table, Filters | Profile management |

**Estimates:** 3-4 ngày

---

### Phase 6: Polish & Performance

**Mục tiêu:** Hoàn thiện animation, accessibility, responsive, cleanup

**Deliverables:**
- Animation optimization: bỏ Math.random(), giảm loops, CSS keyframes
- Skeleton loading trên tất cả data fetching pages
- Accessibility audit: keyboard nav, screen reader, color contrast
- Responsive audit: tablet + mobile breakpoints
- Console.log removal (production clean)
- Bundle size optimization: tree-shaking, lazy loading
- Code cleanup: xóa unused components, duplicate code

**Estimates:** 1-2 ngày

---

## Traceability

| Phase | Requirements | Status |
|-------|-------------|--------|
| Phase 1 | UI-01 (partial: foundation) | ○ Pending |
| Phase 2 | UI-01 (partial: components), UI-04 | ○ Pending |
| Phase 3 | UI-01 (partial: layout), UI-05 | ○ Pending |
| Phase 4 | UI-01 (partial: public pages) | ○ Pending |
| Phase 5 | UI-01 (partial: admin pages), UI-05 | ○ Pending |
| Phase 6 | UI-02, UI-03, UI-06, UI-07 | ○ Pending |

**Coverage:**
- Active requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0 ✓

---
*Roadmap created: 2026-03-28*
*Last updated: 2026-03-28 after initial roadmap definition*
