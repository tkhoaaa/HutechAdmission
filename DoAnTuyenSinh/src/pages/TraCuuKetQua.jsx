import React, { useState, useEffect } from "react";
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
  FaSpinner,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { useDarkMode } from "../contexts/DarkModeContext";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

// Enhanced animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  },
  item: {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.6
      }
    }
  },
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  shimmer: {
    x: ["-100%", "100%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Particle component for background effects
const Particle = ({ delay = 0, index = 0 }) => {
  const { darkMode } = useDarkMode();

  const xPos = ((index * 7 + 5) % 90) + 5;
  const yPos = ((index * 11 + 13) % 80) + 10;
  const duration = 2 + (index * 0.25) % 2.5;

  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${
        darkMode ? 'bg-blue-400/20' : 'bg-blue-500/10'
      }`}
      initial={{
        x: xPos,
        y: yPos + 10,
        opacity: 0
      }}
      animate={{
        y: -10,
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Loading skeleton component
const LoadingSkeleton = () => {
  const { darkMode } = useDarkMode();
  
  return (
    <Card variant="glass" className="max-w-4xl mx-auto">
      <Card.Content>
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className={`h-6 w-32 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-8 w-24 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className="space-y-2 flex-1">
                    <div className={`h-3 w-20 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 w-32 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className="space-y-2 flex-1">
                    <div className={`h-3 w-24 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 w-28 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

// Mock data for demo
const mockResults = {
  "HS001": {
    hoTen: "Nguyễn Văn An",
    maSoHoSo: "HS001",
    cccd: "123456789012",
    ngaySinh: "15/03/2005",
    sdt: "0901234567",
    email: "nguyenvanan@email.com",
    trangThai: "da_trung_tuyen",
    nganhTrungTuyen: "Công nghệ Thông tin",
    maNganh: "CNTT01",
    diemXetTuyen: 24.5,
    diemChuan: 22.0,
    thuTu: 15,
    ngayNopHoSo: "20/02/2024",
    ngayXetTuyen: "15/03/2024"
  },
  "HS002": {
    hoTen: "Trần Thị Bình",
    maSoHoSo: "HS002",
    cccd: "987654321098",
    ngaySinh: "22/07/2005",
    sdt: "0907654321",
    email: "tranthibinh@email.com",
    trangThai: "dang_xet_tuyen",
    nganhDangKy: ["Quản trị Kinh doanh", "Marketing"],
    ngayNopHoSo: "25/02/2024"
  },
  "HS003": {
    hoTen: "Lê Văn Cường",
    maSoHoSo: "HS003",
    cccd: "456789123456",
    ngaySinh: "10/12/2004",
    sdt: "0912345678",
    email: "levancuong@email.com",
    trangThai: "khong_dat",
    nganhDangKy: ["Kỹ thuật Phần mềm"],
    diemXetTuyen: 18.5,
    diemChuan: 20.0,
    ngayNopHoSo: "18/02/2024",
    ngayXetTuyen: "15/03/2024"
  }
};

function TraCuuKetQua() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [maHoSo, setMaHoSo] = useState("");
  const [ketQua, setKetQua] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [particles, setParticles] = useState([]);

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleTraCuu = async () => {
    if (!maHoSo.trim()) {
      setError("Vui lòng nhập mã hồ sơ");
      return;
    }

    setIsLoading(true);
    setError("");
    setKetQua(null);

    // Simulate API call with enhanced loading
    setTimeout(() => {
      const result = mockResults[maHoSo.toUpperCase()];
      if (result) {
        setKetQua(result);
      } else {
        setError("Không tìm thấy hồ sơ với mã này. Vui lòng kiểm tra lại.");
      }
      setIsLoading(false);
    }, 2000);
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

      <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <Particle key={particle.id} delay={particle.delay} index={i} />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute top-20 left-10 w-32 h-32 rounded-full ${
              darkMode ? 'bg-blue-500/5' : 'bg-blue-200/30'
            }`}
            animate={ANIMATION_VARIANTS.float}
          />
          <motion.div
            className={`absolute top-40 right-20 w-24 h-24 rounded-full ${
              darkMode ? 'bg-purple-500/5' : 'bg-purple-200/30'
            }`}
            animate={{
              ...ANIMATION_VARIANTS.float,
              transition: { ...ANIMATION_VARIANTS.float.transition, delay: 1 }
            }}
          />
          <motion.div
            className={`absolute bottom-32 left-1/4 w-20 h-20 rounded-full ${
              darkMode ? 'bg-emerald-500/5' : 'bg-emerald-200/30'
            }`}
            animate={{
              ...ANIMATION_VARIANTS.float,
              transition: { ...ANIMATION_VARIANTS.float.transition, delay: 2 }
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Enhanced Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ANIMATION_VARIANTS.container}
            className="text-center mb-16"
          >
            <motion.div variants={ANIMATION_VARIANTS.item}>
              <motion.div 
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 relative ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                } shadow-2xl`}
                animate={ANIMATION_VARIANTS.pulse}
              >
                <FaSearch className="text-3xl text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
                  animate={ANIMATION_VARIANTS.pulse}
                />
              </motion.div>
              
              <motion.h1 
                className={`text-5xl md:text-7xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Tra cứu kết quả
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                  darkMode ? 'text-gray-100' : 'text-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Nhập mã hồ sơ để kiểm tra tình trạng và kết quả xét tuyển của bạn
              </motion.p>

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className={`mt-6 p-3 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              >
                <motion.div
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Enhanced Search Form */}
          <motion.div
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            <motion.div variants={ANIMATION_VARIANTS.item}>
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
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleTraCuu()}
                      size="lg"
                      className="text-lg"
                    />
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 -z-10"
                      animate={{ opacity: maHoSo ? 0.1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                  <Button
                    onClick={handleTraCuu}
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                      leftIcon={isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {isLoading ? "Đang tra cứu..." : "Tra cứu kết quả"}
                  </Button>
                  </motion.div>

                  <motion.div 
                    className={`text-center text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="flex items-center justify-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
                      Mã demo: HS001 (Đã trúng tuyển), HS002 (Đang xét tuyển), HS003 (Không đạt)
                    </p>
                  </motion.div>
                </Card.Content>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Loading State */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingSkeleton />
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
                    <div className="flex items-center justify-between">
                      <Card.Title className="flex items-center gap-3 text-2xl">
                        <motion.div
                          animate={ANIMATION_VARIANTS.pulse}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                        >
                          <FaFileAlt className="text-blue-500 text-xl" />
                        </motion.div>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        Thông tin hồ sơ
                        </span>
                      </Card.Title>
                      
                      {(() => {
                        const statusInfo = getStatusInfo(ketQua.trangThai);
                        return (
                          <motion.div 
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 ${statusInfo.bgColor} ${statusInfo.borderColor} shadow-lg ${statusInfo.glowColor}`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                          >
                            <motion.div
                              animate={ketQua.trangThai === "da_trung_tuyen" ? ANIMATION_VARIANTS.pulse : {}}
                            >
                              <statusInfo.icon className={`text-xl ${statusInfo.color}`} />
                            </motion.div>
                            <span className={`font-bold text-lg ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            {ketQua.trangThai === "da_trung_tuyen" && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <FaTrophy className="text-yellow-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })()}
                    </div>
                    
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 -z-10"
                      animate={{
                        background: [
                          "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(16, 185, 129, 0.05))",
                          "linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                          "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))"
                        ]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />
                  </Card.Header>
                  
                  <Card.Content>
                    <motion.div 
                      className="grid md:grid-cols-2 gap-8"
                      variants={ANIMATION_VARIANTS.container}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Enhanced Personal Information */}
                      <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-6">
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
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
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                                darkMode 
                                  ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              <motion.div
                                className={`p-2 rounded-lg ${item.color.replace('text-', 'bg-').replace('500', '100')} dark:${item.color.replace('text-', 'bg-').replace('500', '900/30')}`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <item.icon className={`${item.color}`} />
                              </motion.div>
                              <div className="flex-1">
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.label}
                                </p>
                                <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {item.value}
                                </p>
                            </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Enhanced Admission Information */}
                      <motion.div variants={ANIMATION_VARIANTS.item} className="space-y-6">
                        <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          <FaGraduationCap className="text-purple-500" />
                          Thông tin xét tuyển
                        </h3>
                        
                        <div className="space-y-4">
                          <motion.div
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                              darkMode 
                                ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaFileAlt className="text-blue-500" />
                            </motion.div>
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Mã hồ sơ
                              </p>
                              <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {ketQua.maSoHoSo}
                              </p>
                            </div>
                          </motion.div>
                          
                          <motion.div
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                              darkMode 
                                ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaCalendarAlt className="text-emerald-500" />
                            </motion.div>
                            <div>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Ngày nộp hồ sơ
                              </p>
                              <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {ketQua.ngayNopHoSo}
                              </p>
                            </div>
                          </motion.div>

                          {/* Status-specific information with enhanced animations */}
                          {ketQua.trangThai === "da_trung_tuyen" && (
                            <motion.div
                              className="space-y-4"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div
                                className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700 ${
                                  'hover:scale-105 transition-all duration-300'
                                }`}
                                whileHover={{ x: 5 }}
                                animate={ANIMATION_VARIANTS.pulse}
                              >
                                <motion.div
                                  className="p-2 rounded-lg bg-emerald-200 dark:bg-emerald-800"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <FaTrophy className="text-emerald-600 dark:text-emerald-400" />
                                </motion.div>
                                <div>
                                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    Ngành trúng tuyển
                                  </p>
                                  <p className="font-bold text-lg text-emerald-700 dark:text-emerald-300">
                                    {ketQua.nganhTrungTuyen}
                                  </p>
                                </div>
                              </motion.div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  className={`p-4 rounded-xl text-center ${
                                    darkMode 
                                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  } transition-all duration-300 hover:scale-105`}
                                  whileHover={{ y: -5 }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <FaStar className="text-2xl text-yellow-500 mx-auto mb-2" />
                                  </motion.div>
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Điểm xét tuyển
                                  </p>
                                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {ketQua.diemXetTuyen}/30
                                  </p>
                                </motion.div>
                                
                                <motion.div
                                  className={`p-4 rounded-xl text-center ${
                                    darkMode 
                                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  } transition-all duration-300 hover:scale-105`}
                                  whileHover={{ y: -5 }}
                                >
                                  <FaInfoCircle className="text-2xl text-blue-500 mx-auto mb-2" />
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Điểm chuẩn
                                  </p>
                                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {ketQua.diemChuan}/30
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}

                          {ketQua.trangThai === "dang_xet_tuyen" && (
                            <motion.div
                              className={`p-4 rounded-xl ${
                                darkMode 
                                  ? 'bg-amber-900/20 border border-amber-700' 
                                  : 'bg-amber-50 border border-amber-200'
                              } transition-all duration-300 hover:scale-105`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center gap-4">
                                <motion.div
                                  className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                  <FaClock className="text-amber-600 dark:text-amber-400" />
                                </motion.div>
                              <div>
                                  <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Ngành đăng ký
                                  </p>
                                <div className="space-y-1">
                                  {ketQua.nganhDangKy.map((nganh, index) => (
                                      <motion.p 
                                        key={index} 
                                        className="font-bold text-amber-700 dark:text-amber-300"
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
                                className={`p-4 rounded-xl ${
                                  darkMode 
                                    ? 'bg-red-900/20 border border-red-700' 
                                    : 'bg-red-50 border border-red-200'
                                } transition-all duration-300 hover:scale-105`}
                                whileHover={{ x: 5 }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-lg bg-red-200 dark:bg-red-800">
                                    <FaGraduationCap className="text-red-600 dark:text-red-400" />
                                  </div>
                                <div>
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                      Ngành đăng ký
                                    </p>
                                    <p className="font-bold text-red-700 dark:text-red-300">
                                      {ketQua.nganhDangKy[0]}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  className={`p-4 rounded-xl text-center ${
                                    darkMode 
                                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  } transition-all duration-300 hover:scale-105`}
                                  whileHover={{ y: -5 }}
                                >
                                  <FaTimesCircle className="text-2xl text-red-500 mx-auto mb-2" />
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Điểm xét tuyển
                                  </p>
                                  <p className="font-bold text-xl text-red-600 dark:text-red-400">
                                    {ketQua.diemXetTuyen}/30
                                  </p>
                                </motion.div>
                                
                                <motion.div
                                  className={`p-4 rounded-xl text-center ${
                                    darkMode 
                                      ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  } transition-all duration-300 hover:scale-105`}
                                  whileHover={{ y: -5 }}
                                >
                                  <FaInfoCircle className="text-2xl text-blue-500 mx-auto mb-2" />
                                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Điểm chuẩn
                                  </p>
                                  <p className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {ketQua.diemChuan}/30
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </Card.Content>

                  {/* Enhanced Action Buttons */}
                  {ketQua.trangThai === "da_trung_tuyen" && (
                    <Card.Footer>
                      <motion.div 
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                        <Button
                          variant="primary"
                          leftIcon={<FaDownload />}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                          >
                            Tải giấy báo trúng tuyển
                          </Button>
                        </motion.div>
                        <motion.div
                          className="flex-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                        <Button
                          variant="outline"
                          leftIcon={<FaEye />}
                            className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
                            size="lg"
                        >
                          Xem hướng dẫn nhập học
                        </Button>
                        </motion.div>
                      </motion.div>
                    </Card.Footer>
                  )}
                </Card>

                {/* Enhanced Support Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Card variant="glass" className="backdrop-blur-xl border-white/20 dark:border-gray-700/30">
                  <Card.Content>
                      <div className="text-center space-y-6">
                        <motion.div
                          animate={ANIMATION_VARIANTS.pulse}
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        >
                          <FaInfoCircle className="text-3xl text-white" />
                        </motion.div>
                        
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Cần hỗ trợ?
                        </h3>
                        
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Nếu bạn có thắc mắc về kết quả xét tuyển, vui lòng liên hệ:
                      </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                          <motion.div 
                            className={`flex items-center gap-3 p-4 rounded-xl ${
                              darkMode 
                                ? 'bg-blue-900/20 hover:bg-blue-800/30' 
                                : 'bg-blue-50 hover:bg-blue-100'
                            } transition-all duration-300 cursor-pointer`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaPhone className="text-blue-500 text-xl" />
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Hotline: 1900 2088
                            </span>
                          </motion.div>
                          
                          <motion.div 
                            className={`flex items-center gap-3 p-4 rounded-xl ${
                              darkMode 
                                ? 'bg-purple-900/20 hover:bg-purple-800/30' 
                                : 'bg-purple-50 hover:bg-purple-100'
                            } transition-all duration-300 cursor-pointer`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaEnvelope className="text-purple-500 text-xl" />
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Email: tuyensinh@hutech.edu.vn
                            </span>
                          </motion.div>
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
