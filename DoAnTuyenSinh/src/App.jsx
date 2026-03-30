import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import ThanhHeader from "./components/ThanhHeader";
import ChanTrang from "./components/ChanTrang";
import ScrollToTop from "./components/ScrollToTop";
import { UserContextProvider } from "./accounts/UserContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { Toaster } from "./components/ui/sonner";
import PageTransition from "./components/ui/PageTransition";
import AdminLayout from "./admin/components/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBoundary from "./components/OfflineBoundary";

// Lazy-loaded public pages
const TrangChu = lazy(() => import("./pages/TrangChu"));
const ThongTinTuyenSinh = lazy(() => import("./pages/ThongTinTuyenSinh"));
const DangKyXetTuyen = lazy(() => import("./pages/DangKyXetTuyen"));
const TraCuuKetQua = lazy(() => import("./pages/TraCuuKetQua"));
const LienHe = lazy(() => import("./pages/LienHe"));
const DangNhap = lazy(() => import("./accounts/DangNhap"));
const DangKyTaiKhoan = lazy(() => import("./accounts/DangKyTaiKhoan"));
const DangKyTaiKhoanAdmin = lazy(() => import("./accounts/DangKyTaiKhoanAdmin"));
const QuenMatKhau = lazy(() => import("./accounts/QuenMatKhau"));
const CauHoiThuongGap = lazy(() => import("./pages/CauHoiThuongGap"));
const DangKyHocBong = lazy(() => import("./pages/DangKyHocBong"));
const DangKyTuVan = lazy(() => import("./pages/DangKyTuVan"));
const HoSoNguoiDung = lazy(() => import("./pages/HoSoNguoiDung"));

// Lazy-loaded admin pages
const TongQuan = lazy(() => import("./admin/pages/TongQuan"));
const QuanLyHoSo = lazy(() => import("./admin/pages/QuanLyHoSo"));
const QuanLyFAQ = lazy(() => import("./admin/pages/QuanLyFAQ"));
const BaoCao = lazy(() => import("./admin/pages/BaoCao"));
const CaiDat = lazy(() => import("./admin/pages/CaiDat"));
const HoSoQuanLi = lazy(() => import("./admin/pages/HoSoQuanLi"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading-dots">
      <div />
      <div />
      <div />
    </div>
  </div>
);

// Admin loading fallback
const AdminPageLoader = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="loading-dots">
      <div />
      <div />
      <div />
    </div>
  </div>
);

// Public Layout with lazy loading
function PublicLayout() {
  const location = useLocation();

  return (
    <>
      <ThanhHeader />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><TrangChu /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/thong-tin-tuyen-sinh"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><ThongTinTuyenSinh /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/dang-ky-xet-tuyen"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><DangKyXetTuyen /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/tra-cuu-ket-qua"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><TraCuuKetQua /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/lien-he"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><LienHe /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/accounts/dang-nhap"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition type="fade"><DangNhap /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={<Navigate to="/accounts/dang-nhap" replace />}
          />
          <Route
            path="/accounts/dang-ky"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition type="fade"><DangKyTaiKhoan /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/accounts/dang-ky-admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition type="fade"><DangKyTaiKhoanAdmin /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/accounts/quen-mat-khau"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition type="fade"><QuenMatKhau /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/cau-hoi-thuong-gap"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><CauHoiThuongGap /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/dang-ky-hoc-bong"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><DangKyHocBong /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/dang-ky-tu-van"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><DangKyTuVan /></PageTransition>
              </Suspense>
            }
          />
          <Route
            path="/ho-so-nguoi-dung"
            element={
              <Suspense fallback={<PageLoader />}>
                <PageTransition><HoSoNguoiDung /></PageTransition>
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
      <ChanTrang />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <OfflineBoundary>
      <DarkModeProvider>
        <UserContextProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-right" richColors closeButton expand={false} />
            <ErrorBoundary>
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="tong-quan">
                      <Suspense fallback={<AdminPageLoader />}><TongQuan /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/tong-quan"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="tong-quan">
                      <Suspense fallback={<AdminPageLoader />}><TongQuan /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/quan-ly-ho-so"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="quan-ly-ho-so">
                      <Suspense fallback={<AdminPageLoader />}><QuanLyHoSo /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/quan-ly-faq"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="quan-ly-faq">
                      <Suspense fallback={<AdminPageLoader />}><QuanLyFAQ /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/bao-cao"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="bao-cao">
                      <Suspense fallback={<AdminPageLoader />}><BaoCao /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/cai-dat"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="cai-dat">
                      <Suspense fallback={<AdminPageLoader />}><CaiDat /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/ho-so-quan-ly"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout currentPage="ho-so-quan-ly">
                      <Suspense fallback={<AdminPageLoader />}><HoSoQuanLi /></Suspense>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />

              {/* Public Routes */}
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </UserContextProvider>
      </DarkModeProvider>
      </OfflineBoundary>
    </HelmetProvider>
  );
}

export default App;
