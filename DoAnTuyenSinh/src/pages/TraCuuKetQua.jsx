import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaInfoCircle,
  FaDownload,
  FaEye,
  FaIdCard,
  FaCalendarAlt,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import axios from "axios";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { useDarkMode } from "../contexts/DarkModeContext";

const API_BASE = "http://localhost:3001";

function TraCuuKetQua() {
  const { darkMode } = useDarkMode();
  const [maHoSo, setMaHoSo] = useState("");
  const [ketQua, setKetQua] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTraCuu = async () => {
    if (!maHoSo.trim()) {
      setError("Vui lòng nhập mã hồ sơ");
      return;
    }

    setIsLoading(true);
    setError("");
    setKetQua(null);

    try {
      const res = await axios.get(`${API_BASE}/api/tra-cuu`, {
        params: { code: maHoSo.trim() }
      });
      if (res.data.success) {
        setKetQua(res.data.data);
      } else {
        setError(res.data.message || "Không tìm thấy hồ sơ với mã này.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (trangThai) => {
    switch (trangThai) {
      case "da_trung_tuyen":
        return {
          icon: FaCheckCircle,
          text: "Đã trúng tuyển",
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
          borderColor: "border-emerald-200 dark:border-emerald-700",
          glowColor: "shadow-emerald-500/20"
        };
      case "dang_xet_tuyen":
        return {
          icon: FaClock,
          text: "Đang xét tuyển",
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-700",
          glowColor: "shadow-amber-500/20"
        };
      case "khong_dat":
        return {
          icon: FaTimesCircle,
          text: "Không đạt",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-700",
          glowColor: "shadow-red-500/20"
        };
      default:
        return {
          icon: FaInfoCircle,
          text: "Chưa xác định",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-700",
          glowColor: "shadow-gray-500/20"
        };
    }
  };

  return (
    <>
      <SEO
        title="Tra cứu kết quả"
        description="Tra cứu kết quả xét tuyển HUTECH 2025 - Kiểm tra tình trạng hồ sơ và kết quả xét tuyển bằng mã hồ sơ của bạn."
        keywords="tra cứu kết quả, HUTECH, kết quả xét tuyển, kiểm tra hồ sơ, mã hồ sơ"
        canonical="/tra-cuu-ket-qua"
      />

      <div className="min-h-screen relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated background particles - CSS based */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => {
            const xPos = ((i * 7 + 5) % 90) + 5;
            const yPos = ((i * 11 + 13) % 80) + 10;
            const duration = 2 + (i * 0.25) % 2.5;
            const delay = (i * 0.3) % 5;
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-particle-rise ${
                  i % 2 === 0
                    ? 'bg-blue-500/10 dark:bg-blue-400/20'
                    : 'bg-purple-500/10 dark:bg-purple-400/20'
                }`}
                style={{
                  left: `${xPos}%`,
                  top: `${yPos}%`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Floating geometric shapes - CSS based */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-200/30 dark:bg-blue-500/5 animate-float" />
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-500/5 animate-float-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-emerald-200/30 dark:bg-emerald-500/5 animate-float-slow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 shadow-2xl animate-pulse-ring">
                <FaSearch className="text-3xl text-white" />
              </div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Tra cứu kết quả
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Nhập mã hồ sơ để kiểm tra tình trạng và kết quả xét tuyển của bạn
              </motion.p>
            </div>
          </motion.div>

          {/* Enhanced Search Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div>
              <Card
                variant="glass"
                className="max-w-3xl mx-auto backdrop-blur-xl border-white/20 dark:border-gray-700/30"
                hover={true}
                shimmer={true}
              >
                <Card.Content className="space-y-8 p-8">
                  <div className="relative">
                    <Input
                      label="Mã hồ sơ"
                      placeholder="Nhập mã hồ sơ (VD: HS001)"
                      value={maHoSo}
                      onChange={(e) => setMaHoSo(e.target.value.toUpperCase())}
                      leftIcon={<FaIdCard className="text-blue-500" />}
                      error={error}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleTraCuu(); }}
                      size="lg"
                      className="text-lg"
                    />
                  </div>

                  <Button
                    onClick={handleTraCuu}
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    leftIcon={isLoading ? null : <FaSearch />}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {isLoading ? "Đang tra cứu..." : "Tra cứu kết quả"}
                  </Button>

                  <motion.p
                    className="text-center text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="flex items-center justify-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
                      Mã hồ sơ được gửi qua email sau khi đăng ký xét tuyển
                    </p>
                  </motion.p>
                </Card.Content>
              </Card>
            </div>
          </motion.div>

          {/* Loading Skeleton */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" className="max-w-4xl mx-auto">
                  <Card.Content>
                    <div className="animate-pulse space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                              <div className="space-y-2 flex-1">
                                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700" />
                              <div className="space-y-2 flex-1">
                                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Results */}
          <AnimatePresence mode="wait">
            {ketQua && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <Card
                  variant="default"
                  className="mb-8 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-2xl"
                  hover={true}
                  shimmer={true}
                >
                  <Card.Header className="relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-emerald-400/10 -z-10 animate-gradient-shift" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-3">
                      <div className="flex items-center gap-3 text-lg sm:text-2xl">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FaFileAlt className="text-blue-500 text-lg sm:text-xl" />
                        </div>
                        <span className="text-gray-900 dark:text-white">
                        Thông tin hồ sơ
                        </span>
                      </div>

                      {(() => {
                        const statusInfo = getStatusInfo(ketQua.trangThai);
                        return (
                          <div
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 ${statusInfo.bgColor} ${statusInfo.borderColor} shadow-lg ${statusInfo.glowColor}`}
                          >
                            <div className={ketQua.trangThai === "da_trung_tuyen" ? "animate-star-pulse" : ""}>
                              <statusInfo.icon className={`text-xl ${statusInfo.color}`} />
                            </div>
                            <span className={`font-bold text-lg ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {ketQua.trangThai === "da_trung_tuyen" && (
                              <FaTrophy className="text-yellow-500 animate-spin-slow" />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </Card.Header>

                  <Card.Content>
                    <motion.div
                      className="grid md:grid-cols-2 gap-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Enhanced Personal Information */}
                      <div className="space-y-6">
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <FaIdCard className="text-blue-500" />
                          Thông tin cá nhân
                        </h3>

                        <div className="space-y-4">
                          {[
                            { icon: FaIdCard, label: "Họ và tên", value: ketQua.hoTen, color: "text-blue-500" },
                            { icon: FaCalendarAlt, label: "Ngày sinh", value: ketQua.ngaySinh, color: "text-emerald-500" },
                            { icon: FaPhone, label: "Số điện thoại", value: ketQua.sdt, color: "text-purple-500" },
                            { icon: FaEnvelope, label: "Email", value: ketQua.email, color: "text-orange-500" }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-').replace('500', '100')} dark:${item.color.replace('text-', 'bg-').replace('500', '900/30')} hover:scale-110 transition-transform`}>
                                <item.icon className={`${item.color}`} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm text-gray-500 dark:text-gray-400`}>
                                  {item.label}
                                </p>
                                <p className={`font-bold text-lg text-gray-900 dark:text-white`}>
                                  {item.value}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced Admission Information */}
                      <div className="space-y-6">
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          <FaGraduationCap className="text-purple-500" />
                          Thông tin xét tuyển
                        </h3>

                        <div className="space-y-4">
                          <motion.div
                            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:scale-110 transition-transform">
                              <FaFileAlt className="text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Mã hồ sơ
                              </p>
                              <p className="font-bold text-lg text-gray-900 dark:text-white">
                                {ketQua.maSoHoSo}
                              </p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 hover:scale-110 transition-transform">
                              <FaCalendarAlt className="text-emerald-500" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ngày nộp hồ sơ
                              </p>
                              <p className="font-bold text-lg text-gray-900 dark:text-white">
                                {ketQua.ngayNopHoSo}
                              </p>
                            </div>
                          </motion.div>

                          {/* Status-specific information */}
                          {ketQua.trangThai === "da_trung_tuyen" && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div
                                className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-700 transition-all duration-300 hover:scale-105 animate-pulse-ring`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <div className="p-2 rounded-lg bg-emerald-200 dark:bg-emerald-800 animate-wiggle">
                                  <FaTrophy className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    Ngành trúng tuyển
                                  </p>
                                  <p className={`font-bold text-lg ${darkMode ? "text-emerald-300" : "text-emerald-700"}`}>
                                    {ketQua.nganhTrungTuyen}
                                  </p>
                                </div>
                              </motion.div>

                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  className="p-4 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  <div className="animate-star-pulse">
                                    <FaStar className="text-2xl text-yellow-500 mx-auto mb-2" />
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Điểm xét tuyển
                                  </p>
                                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                                    {ketQua.diemXetTuyen}/30
                                  </p>
                                </motion.div>

                                <motion.div
                                  className="p-4 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.7 }}
                                >
                                  <FaInfoCircle className="text-2xl text-blue-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Điểm chuẩn
                                  </p>
                                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                                    {ketQua.diemChuan}/30
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          {ketQua.trangThai === "dang_xet_tuyen" && (
                            <motion.div
                              className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 transition-all duration-300 hover:scale-105"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800 animate-spin-slow">
                                  <FaClock className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Ngành đăng ký
                                  </p>
                                  <div className="space-y-1">
                                    {ketQua.nganhDangKy.map((nganh, index) => (
                                      <motion.p
                                        key={index}
                                        className={`font-bold ${darkMode ? "text-amber-300" : "text-amber-700"}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                      >
                                        {index + 1}. {nganh}
                                      </motion.p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {ketQua.trangThai === "khong_dat" && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div
                                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 transition-all duration-300 hover:scale-105"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-red-200 dark:bg-red-800">
                                    <FaGraduationCap className="text-red-600 dark:text-red-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                      Ngành đăng ký
                                    </p>
                                    <p className={`font-bold ${darkMode ? "text-red-300" : "text-red-700"}`}>
                                      {ketQua.nganhDangKy[0]}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>

                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  className="p-4 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  <FaTimesCircle className="text-2xl text-red-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Điểm xét tuyển
                                  </p>
                                  <p className="font-bold text-xl text-red-600 dark:text-red-400">
                                    {ketQua.diemXetTuyen}/30
                                  </p>
                                </motion.div>

                                <motion.div
                                  className="p-4 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.7 }}
                                >
                                  <FaInfoCircle className="text-2xl text-blue-500 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Điểm chuẩn
                                  </p>
                                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                                    {ketQua.diemChuan}/30
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Card.Content>

                  {/* Action Buttons */}
                  {ketQua.trangThai === "da_trung_tuyen" && (
                    <Card.Footer>
                      <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="flex-1">
                          <Button
                            variant="primary"
                            leftIcon={<FaDownload />}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            Tải giấy báo trúng tuyển
                          </Button>
                        </div>
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            leftIcon={<FaEye />}
                            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            Xem hướng dẫn nhập học
                          </Button>
                        </div>
                      </motion.div>
                    </Card.Footer>
                  )}
                </Card>

                {/* Support Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Card variant="glass" className="backdrop-blur-xl border-white/20 dark:border-gray-700/30">
                    <Card.Content>
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-ring">
                          <FaInfoCircle className="text-3xl text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Cần hỗ trợ?
                        </h3>

                        <p className="text-lg text-gray-600 dark:text-gray-300">
                        Nếu bạn có thắc mắc về kết quả xét tuyển, vui lòng liên hệ:
                      </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-all duration-300 cursor-pointer hover:scale-105">
                            <FaPhone className="text-blue-500 text-xl" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Hotline: 1900 2088
                            </span>
                          </div>

                          <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-all duration-300 cursor-pointer hover:scale-105">
                            <FaEnvelope className="text-purple-500 text-xl" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              Email: tuyensinh@hutech.edu.vn
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default TraCuuKetQua;
