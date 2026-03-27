# DoAnTuyenSinh - Website Tuyển Sinh HUTECH

## What This Is

Website tuyển sinh trực tuyến của Trường Đại học HUTECH — cho phép thí sinh đăng ký xét tuyển, tra cứu kết quả, đăng ký tư vấn, và quản lý hồ sơ tuyển sinh. Hệ thống bao gồm trang công khai (public) và trang quản trị (admin) riêng biệt.

## Core Value

Thí sinh có thể hoàn tất toàn bộ quy trình tuyển sinh từ đăng ký đến tra cứu kết quả trên nền tảng web hiện đại, chuyên nghiệp, nhanh chóng.

## Requirements

### Validated

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

### Active

- [ ] **UI-01**: Thiết kế lại toàn bộ UI/UX theo shadcn/ui + design system hiện đại
- [ ] **UI-02**: Tối ưu animation (giảm motion thừa, cải thiện performance)
- [ ] **UI-03**: Hoàn thiện accessibility (ARIA, keyboard navigation)
- [ ] **UI-04**: Xây dựng shared component library nhất quán (shadcn/ui pattern)
- [ ] **UI-05**: Thống nhất dark mode cho admin pages
- [ ] **UI-06**: Cải thiện responsive design toàn trang
- [ ] **UI-07**: Performance audit & fix (Math.random(), bundle size, loading states)

### Out of Scope

- Thay đổi logic nghiệp vụ (business logic giữ nguyên) — UI/UX only
- Thêm tính năng mới ngoài spec hiện tại — chỉ refactor UI
- Backend/API refactoring — chỉ frontend
- Thêm unit tests — có thể bổ sung sau UI xong
- Chuyển đổi TypeScript — JavaScript đủ cho scope hiện tại

## Context

**Tech Stack hiện tại:**
- React 18 + Vite
- Tailwind CSS 3.x (custom config)
- Framer Motion (animations)
- React Router v6
- Recharts (charts)
- react-icons (icons)
- react-hot-toast (notifications)

**Design System hiện tại:**
- 16+ UI components tự xây (Button, Card, Input, Modal, etc.)
- 12 color variants cho primary, secondary, accent
- Glassmorphism pattern với backdrop-blur
- Floating particles decoration
- Framer Motion entrance/hover animations

**Vấn đề UI/UX đã xác định:**
1. `Math.random()` trong JSX render (Header, Footer, Auth pages) → DOM re-render không cần thiết
2. Animation loops vô hạn → tốn CPU/GPU
3. Page entrance delays > 1s → UX chậm
4. Admin pages không có dark mode → không nhất quán
5. Custom Select/Dropdown không có keyboard navigation → accessibility kém
6. Console.log debug còn nhiều → production không clean
7. Component duplication (FormField ≈ Input)
8. Components quá lớn (Header 800+ lines)
9. Animation variants duplicate ở nhiều page
10. No skeleton loading cho data fetching
11. Tailwind config quá dài (400+ lines) với CSS variables không sử dụng
12. Table component chưa hoàn thiện (dùng cards thay table)

**Project Structure:**
- `src/accounts/` — Auth pages (DangNhap, DangKyTaiKhoan, QuenMatKhau)
- `src/admin/` — Admin pages (6 pages + AdminLayout)
- `src/components/ui/` — 16 atomic UI components
- `src/pages/` — 9 public pages
- `src/contexts/` — DarkModeContext, ThemeContext (duplicate)
- `src/utils/` — animations, apiClient, avatarUtils

## Constraints

- **Tech Stack**: React + Vite + Tailwind — không đổi framework
- **Backward Compatibility**: Giữ nguyên tất cả routes, business logic, API contracts
- **Bundle Size**: Không tăng đáng kể bundle size (hiện tại chưa optimize)
- **Browser Support**: Hỗ trợ Chrome/Firefox/Edge/Safari phiên bản mới nhất
- **Performance**: Lighthouse score >= 80 cho cả desktop và mobile

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dùng shadcn/ui | Copy-paste vào project, sở hữu 100% code, integrate hoàn toàn với Tailwind hiện có | — Pending |
| Giữ Framer Motion | Animation library đã dùng, chỉ cần tối ưu cách dùng | — Pending |
| Thay react-hot-toast bằng Sonner (shadcn) | Nhất quán với shadcn pattern, API tương tự | — Pending |
| Design tokens qua CSS Variables | Pattern chuẩn, dùng cho cả light/dark mode | — Pending |
| V0/Vercel cho rapid prototyping | AI-assisted UI generation, review & integrate thủ công | — Pending |
| Xóa ThemeContext, giữ DarkModeContext | Loại bỏ duplicate context | — Pending |

---
*Last updated: 2026-03-28 after initial GSD setup*
