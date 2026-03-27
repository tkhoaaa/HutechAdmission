import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import TrangChu from "./pages/TrangChu";
import ThongTinTuyenSinh from "./pages/ThongTinTuyenSinh";
import DangKyXetTuyen from "./pages/DangKyXetTuyen";
import TraCuuKetQua from "./pages/TraCuuKetQua";
import LienHe from "./pages/LienHe";
import ThanhHeader from "./components/ThanhHeader";
import ChanTrang from "./components/ChanTrang";
import ScrollToTop from "./components/ScrollToTop";
import DangNhap from "./accounts/DangNhap";
import DangKyTaiKhoan from "./accounts/DangKyTaiKhoan";
import DangKyTaiKhoanAdmin from "./accounts/DangKyTaiKhoanAdmin";
import QuenMatKhau from "./accounts/QuenMatKhau";
import CauHoiThuongGap from "./pages/CauHoiThuongGap";
import { UserContextProvider } from "./accounts/UserContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import DangKyHocBong from "./pages/DangKyHocBong";
import DangKyTuVan from "./pages/DangKyTuVan";
import HoSoNguoiDung from "./pages/HoSoNguoiDung";
import { Toaster } from "./components/ui/sonner";
import PageTransition from "./components/ui/PageTransition";


// Admin Components
import AdminLayout from "./admin/components/AdminLayout";
import TongQuan from "./admin/pages/TongQuan";
import QuanLyHoSo from "./admin/pages/QuanLyHoSo";
import QuanLyFAQ from "./admin/pages/QuanLyFAQ";
import BaoCao from "./admin/pages/BaoCao";
import CaiDat from "./admin/pages/CaiDat";
import HoSoQuanLi from "./admin/pages/HoSoQuanLi";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Public Layout Component with AnimatePresence
function PublicLayout() {
  const location = useLocation();
  
  return (
    <>
      <ThanhHeader />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><TrangChu /></PageTransition>} />
          <Route path="/thong-tin-tuyen-sinh" element={<PageTransition><ThongTinTuyenSinh /></PageTransition>} />
          <Route path="/dang-ky-xet-tuyen" element={<PageTransition><DangKyXetTuyen /></PageTransition>} />
          <Route path="/tra-cuu-ket-qua" element={<PageTransition><TraCuuKetQua /></PageTransition>} />
          <Route path="/lien-he" element={<PageTransition><LienHe /></PageTransition>} />
          <Route path="/accounts/dang-nhap" element={<PageTransition type="fade"><DangNhap /></PageTransition>} />
          <Route path="/login" element={<Navigate to="/accounts/dang-nhap" replace />} />
          <Route path="/accounts/dang-ky" element={<PageTransition type="fade"><DangKyTaiKhoan /></PageTransition>} />
          <Route path="/accounts/dang-ky-admin" element={<PageTransition type="fade"><DangKyTaiKhoanAdmin /></PageTransition>} />
          <Route path="/accounts/quen-mat-khau" element={<PageTransition type="fade"><QuenMatKhau /></PageTransition>} />
          <Route path="/cau-hoi-thuong-gap" element={<PageTransition><CauHoiThuongGap /></PageTransition>} />
          <Route path="/dang-ky-hoc-bong" element={<PageTransition><DangKyHocBong /></PageTransition>} />
          <Route path="/dang-ky-tu-van" element={<PageTransition><DangKyTuVan /></PageTransition>} />
          <Route path="/ho-so-nguoi-dung" element={<PageTransition><HoSoNguoiDung /></PageTransition>} />

        </Routes>
      </AnimatePresence>
      <ChanTrang />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <DarkModeProvider>
        <UserContextProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton expand={false} />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="tong-quan">
                  <TongQuan />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/tong-quan" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="tong-quan">
                  <TongQuan />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/quan-ly-ho-so" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="quan-ly-ho-so">
                  <QuanLyHoSo />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/quan-ly-faq" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="quan-ly-faq">
                  <QuanLyFAQ />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/bao-cao" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="bao-cao">
                  <BaoCao />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/cai-dat" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="cai-dat">
                  <CaiDat />
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            <Route path="/admin/ho-so-quan-ly" element={
              <AdminProtectedRoute>
                <AdminLayout currentPage="ho-so-quan-ly">
                  <HoSoQuanLi/>
                </AdminLayout>
              </AdminProtectedRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
        </UserContextProvider>
      </DarkModeProvider>
    </HelmetProvider>
  );
}

export default App;
