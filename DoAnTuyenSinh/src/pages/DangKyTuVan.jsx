import React, { useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendar,
  FaVenusMars,
  FaIdCard,
  FaMapMarkerAlt,
  FaComments,
  FaList,
  FaPlus,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStar,
  FaRocket,
  FaHeart,
  FaLightbulb,
  FaGem,
  FaMagic,
  FaHeadset,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";
import { UserContext } from "../accounts/UserContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

function DangKyTuVan() {
  const { user } = useContext(UserContext);
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("register"); // 'register' hoặc 'list'
  const [form, setForm] = useState({
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "",
    phone: "",
    email: "",
    nganh: "",
    lop: "",
    khoa: "",
    diem_tb: "",
    phuong_thuc: "",
    noi_dung: "",
    nguon_thong_tin: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/consult/apply",
        form
      );
      setSuccess("Gửi yêu cầu tư vấn thành công!");
      setForm({
        ho_ten: "",
        ngay_sinh: "",
        gioi_tinh: "",
        phone: "",
        email: "",
        nganh: "",
        lop: "",
        khoa: "",
        diem_tb: "",
        phuong_thuc: "",
        noi_dung: "",
        nguon_thong_tin: "",
      });
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.map((e) => e.msg).join(" | "));
      } else {
        setError(err.response?.data?.message || "Gửi yêu cầu thất bại!");
      }
    }
    setLoading(false);
  };

  const loadConsultations = async () => {
    if (!user?.email) {
      setError("Vui lòng đăng nhập để xem danh sách yêu cầu");
      return;
    }

    setLoadingList(true);
    try {
      const res = await axios.get(
        `http://localhost:3001/api/consult/list?email=${user.email}`
      );
      setConsultations(res.data.data || []);
    } catch (err) {
      setError(
        "Không thể tải danh sách yêu cầu: " +
          (err.response?.data?.message || err.message)
      );
    }
    setLoadingList(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <>
      <SEO
        title="Đăng ký tư vấn - HUTECH"
        description="Đăng ký tư vấn tuyển sinh HUTECH 2025 - Tư vấn trực tiếp, qua điện thoại, email. Hỗ trợ thông tin chi tiết về ngành học, học phí, học bổng."
        keywords="đăng ký tư vấn, tư vấn tuyển sinh, HUTECH, tư vấn ngành học, học phí"
        canonical="/dang-ky-tu-van"
      />

      <div className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          {[...Array(8)].map((_, i) => {
            const leftPos = ((i * 13 + 7) % 80) + 10;
            const topPos = ((i * 17 + 11) % 70) + 15;
            return (
              <motion.div
                key={i}
                className={`absolute rounded-full blur-xl ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10'
                    : 'bg-gradient-to-r from-blue-300/20 to-purple-300/20'
                }`}
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            );
          })}

          {/* Sparkle Effects */}
          {[...Array(20)].map((_, i) => {
            const leftPos = ((i * 7 + 5) % 90) + 5;
            const topPos = ((i * 11 + 13) % 85) + 5;
            return (
              <motion.div
                key={`sparkle-${i}`}
                className={`absolute w-2 h-2 rounded-full ${
                  darkMode ? 'bg-cyan-400' : 'bg-yellow-400'
                }`}
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            );
          })}
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-20 overflow-hidden"
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Hero Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center shadow-2xl ${
                  darkMode 
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600' 
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }`}
              >
                <FaHeadset className="text-white text-4xl" />
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 40px rgba(59, 130, 246, 0.8)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-700/50 text-emerald-300' 
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700'
                } backdrop-blur-sm shadow-lg`}
              >
                <FaStar className="animate-pulse" />
                <span className="font-bold">Tư vấn miễn phí 24/7</span>
                <FaHeart className="animate-pulse text-red-500" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-6xl font-black mb-6 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent'
                }`}
              >
                Đăng Ký Tư Vấn
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi thắc mắc về
                tuyển sinh, ngành học và cơ hội nghề nghiệp
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap justify-center gap-6 mt-8"
              >
                {[
                  { icon: FaClock, text: "Phản hồi nhanh" },
                  { icon: FaLightbulb, text: "Tư vấn chuyên sâu" },
                  { icon: FaGem, text: "Hoàn toàn miễn phí" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      darkMode 
                        ? 'bg-gray-800/50 border border-gray-700/50 text-gray-300' 
                        : 'bg-white/80 border border-gray-200 text-gray-700'
                    } backdrop-blur-sm shadow-lg`}
                  >
                    <feature.icon className="text-blue-500" />
                    <span className="font-semibold">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-16"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`max-w-7xl mx-auto rounded-3xl shadow-2xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700/50' 
                  : 'bg-white/90 border-gray-200'
              } backdrop-blur-xl`}
            >
              {/* Enhanced Header với tabs */}
              <div className={`relative overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                <div className="relative z-10 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mb-8"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <FaRocket className="text-white text-2xl animate-bounce" />
                      <h2 className="text-4xl font-black text-white">
                        Dịch Vụ Tư Vấn HUTECH
                      </h2>
                      <FaMagic className="text-white text-2xl animate-pulse" />
                    </div>
                    <p className="text-white/90 text-lg">Chọn dịch vụ bạn muốn sử dụng</p>
                  </motion.div>

                  {/* Enhanced Tab buttons */}
                  <motion.div
                    className="flex justify-center gap-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.button
                      onClick={() => setActiveTab("register")}
                      className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        activeTab === "register"
                          ? 'bg-white text-blue-600 shadow-2xl scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-3">
                        <FaPlus className={`transition-transform duration-300 ${
                          activeTab === "register" ? 'rotate-90' : ''
                        }`} />
                        Gửi yêu cầu mới
                      </div>
                      {activeTab === "register" && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        setActiveTab("list");
                        loadConsultations();
                      }}
                      className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        activeTab === "list"
                          ? 'bg-white text-blue-600 shadow-2xl scale-105'
                          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-3">
                        <FaList />
                        Danh sách yêu cầu đã gửi
                      </div>
                      {activeTab === "list" && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === "register" ? (
                    // Form đăng ký tư vấn
                    <motion.form
                      key="register"
                      onSubmit={handleSubmit}
                      className="space-y-8"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Thông tin cá nhân */}
                      <motion.div
                        className={`relative overflow-hidden p-8 rounded-3xl border shadow-xl ${
                          darkMode 
                            ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-800/50' 
                            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                        }`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl" />

                        <div className="relative z-10">
                          <motion.h3 
                            className={`text-3xl font-black mb-8 flex items-center gap-4 ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                              darkMode 
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                                : 'bg-gradient-to-br from-blue-500 to-purple-500'
                            }`}>
                              <FaUser className="text-white text-xl" />
                            </div>
                            Thông tin cá nhân
                            <FaStar className="text-yellow-500 animate-pulse" />
                          </motion.h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Input
                                name="ho_ten"
                                value={form.ho_ten}
                                onChange={handleChange}
                                placeholder="Họ và tên"
                                icon={FaUser}
                                required
                                className="w-full"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Input
                                name="ngay_sinh"
                                type="date"
                                value={form.ngay_sinh}
                                onChange={handleChange}
                                placeholder="Ngày sinh"
                                icon={FaCalendar}
                                required
                                className="w-full"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <label className={`block text-sm font-bold mb-3 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Giới tính *
                              </label>
                              <select
                                name="gioi_tinh"
                                value={form.gioi_tinh}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:scale-105 ${
                                  darkMode 
                                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500/20' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                              </select>
                            </motion.div>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <Input
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                                icon={FaPhone}
                                required
                                className="w-full"
                              />
                            </motion.div>

                            <motion.div
                              className="md:col-span-2"
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                icon={FaEnvelope}
                                required
                                className="w-full"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Thông tin học tập */}
                      <motion.div
                        className={`relative overflow-hidden p-8 rounded-3xl border shadow-xl ${
                          darkMode 
                            ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-800/50' 
                            : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                        }`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl" />
                        
                        <div className="relative z-10">
                          <motion.h3 
                            className={`text-3xl font-black mb-8 flex items-center gap-4 ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                              darkMode 
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-600' 
                                : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                            }`}>
                              <FaGraduationCap className="text-white text-xl" />
                            </div>
                            Thông tin học tập
                            <FaGem className="text-emerald-500 animate-pulse" />
                          </motion.h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { name: "nganh", placeholder: "Ngành học", icon: FaGraduationCap, delay: 0.4 },
                              { name: "lop", placeholder: "Lớp", icon: FaGraduationCap, delay: 0.5 },
                              { name: "khoa", placeholder: "Khóa", icon: FaGraduationCap, delay: 0.6 },
                              { name: "diem_tb", placeholder: "Điểm trung bình", icon: FaStar, delay: 0.7, type: "number", step: "0.01", min: "0", max: "10" },
                            ].map((field) => (
                              <motion.div
                                key={field.name}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: field.delay }}
                              >
                                <Input
                                  name={field.name}
                                  type={field.type || "text"}
                                  step={field.step}
                                  min={field.min}
                                  max={field.max}
                                  value={form[field.name]}
                                  onChange={handleChange}
                                  placeholder={field.placeholder}
                                  icon={field.icon}
                                  required
                                  className="w-full"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Thông tin tư vấn */}
                      <motion.div
                        className={`relative overflow-hidden p-8 rounded-3xl border shadow-xl ${
                          darkMode 
                            ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-800/50' 
                            : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                        }`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
                        
                        <div className="relative z-10">
                          <motion.h3 
                            className={`text-3xl font-black mb-8 flex items-center gap-4 ${
                              darkMode ? 'text-white' : 'text-gray-800'
                            }`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${
                              darkMode 
                                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                                : 'bg-gradient-to-br from-purple-500 to-pink-500'
                            }`}>
                              <FaComments className="text-white text-xl" />
                            </div>
                            Thông tin tư vấn
                            <FaHeart className="text-pink-500 animate-pulse" />
                          </motion.h3>

                          <div className="space-y-6">
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <label className={`block text-sm font-bold mb-3 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Phương thức tư vấn mong muốn *
                              </label>
                              <select
                                name="phuong_thuc"
                                value={form.phuong_thuc}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:scale-105 ${
                                  darkMode 
                                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                                }`}
                              >
                                <option value="">Chọn phương thức</option>
                                <option value="Tư vấn trực tiếp">Tư vấn trực tiếp</option>
                                <option value="Tư vấn qua điện thoại">Tư vấn qua điện thoại</option>
                                <option value="Tư vấn qua email">Tư vấn qua email</option>
                                <option value="Tư vấn qua video call">Tư vấn qua video call</option>
                              </select>
                            </motion.div>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              <label className={`block text-sm font-bold mb-3 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Nội dung cần tư vấn *
                              </label>
                              <textarea
                                name="noi_dung"
                                value={form.noi_dung}
                                onChange={handleChange}
                                required
                                rows="6"
                                className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:scale-105 resize-none ${
                                  darkMode 
                                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                                }`}
                                placeholder="Mô tả chi tiết vấn đề cần tư vấn, thắc mắc, khó khăn gặp phải..."
                              />
                            </motion.div>

                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              <label className={`block text-sm font-bold mb-3 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Nguồn thông tin *
                              </label>
                              <select
                                name="nguon_thong_tin"
                                value={form.nguon_thong_tin}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:ring-4 focus:scale-105 ${
                                  darkMode 
                                    ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20'
                                }`}
                              >
                                <option value="">Chọn nguồn thông tin</option>
                                <option value="Website trường">Website trường</option>
                                <option value="Mạng xã hội">Mạng xã hội</option>
                                <option value="Bạn bè">Bạn bè</option>
                                <option value="Thầy cô">Thầy cô</option>
                                <option value="Khác">Khác</option>
                              </select>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Submit button */}
                      <motion.div
                        className="flex justify-center pt-8"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className={`group relative px-12 py-6 rounded-3xl font-black text-xl transition-all duration-300 shadow-2xl ${
                            loading 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-105 hover:shadow-3xl'
                          } ${
                            darkMode 
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500' 
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                          } text-white`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center gap-3">
                            {loading ? (
                              <>
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <FaRocket className="group-hover:animate-bounce" />
                                Gửi yêu cầu tư vấn
                                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </div>
                          
                          {/* Shine effect */}
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />
                        </motion.button>
                      </motion.div>

                      {/* Messages */}
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            className={`p-6 rounded-2xl border shadow-xl flex items-center gap-4 ${
                              darkMode 
                                ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' 
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            }`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                          >
                            <FaCheckCircle className="text-emerald-500 text-2xl animate-pulse" />
                            <span className="font-bold text-lg">{success}</span>
                          </motion.div>
                        )}
                        {error && (
                          <motion.div
                            className={`p-6 rounded-2xl border shadow-xl flex items-center gap-4 ${
                              darkMode 
                                ? 'bg-red-900/50 border-red-700 text-red-300' 
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                          >
                            <FaExclamationTriangle className="text-red-500 text-2xl animate-pulse" />
                            <span className="font-bold text-lg">{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  ) : (
                    // Danh sách yêu cầu đã gửi
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <motion.h3 
                          className={`text-3xl font-black flex items-center gap-4 ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          <FaList className="text-blue-500" />
                          Danh sách yêu cầu tư vấn đã gửi
                        </motion.h3>
                        
                        <motion.button
                          onClick={loadConsultations}
                          disabled={loadingList}
                          className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                            loadingList 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-105'
                          } ${
                            darkMode 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          } shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {loadingList ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang tải...
                            </div>
                          ) : (
                            'Làm mới'
                          )}
                        </motion.button>
                      </div>

                      {loadingList ? (
                        <motion.div
                          className="text-center py-16"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6 ${
                            darkMode ? 'border-blue-400' : 'border-blue-500'
                          }`} />
                          <p className={`text-xl font-semibold ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Đang tải danh sách...
                          </p>
                        </motion.div>
                      ) : consultations.length === 0 ? (
                        <motion.div
                          className="text-center py-16"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <FaList className={`text-8xl mx-auto mb-6 ${
                            darkMode ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                          <p className={`text-2xl font-bold ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Chưa có yêu cầu tư vấn nào được gửi
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-6"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.1,
                              },
                            },
                          }}
                          initial="hidden"
                          animate="visible"
                        >
                          {consultations.map((consult, index) => (
                            <motion.div
                              key={consult.id || index}
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                              }}
                              className={`relative overflow-hidden p-6 rounded-3xl border shadow-xl transition-all duration-300 hover:scale-102 hover:shadow-2xl ${
                                darkMode 
                                  ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/60' 
                                  : 'bg-white/80 border-gray-200 hover:bg-white'
                              } backdrop-blur-sm`}
                            >
                              {/* Decorative gradient */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                              
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                  <h4 className={`text-2xl font-black ${
                                    darkMode ? 'text-white' : 'text-gray-800'
                                  }`}>
                                    Yêu cầu #{consult.id} - {consult.ho_ten}
                                  </h4>
                                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                    darkMode 
                                      ? 'bg-gray-700 text-gray-300' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {formatDate(consult.created_at)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                                  <div className="space-y-3">
                                    {[
                                      { label: "Ngành", value: consult.nganh },
                                      { label: "Lớp", value: consult.lop },
                                      { label: "Khóa", value: consult.khoa },
                                      { label: "Điểm TB", value: consult.diem_tb },
                                    ].map((item, idx) => (
                                      <p key={idx} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        <strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                                          {item.label}:
                                        </strong> {item.value}
                                      </p>
                                    ))}
                                  </div>
                                  <div className="space-y-3">
                                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      <strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                                        Phương thức:
                                      </strong> {consult.phuong_thuc}
                                    </p>
                                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      <strong className={darkMode ? 'text-white' : 'text-gray-900'}>
                                        Trạng thái:
                                      </strong>
                                      <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-bold animate-pulse">
                                        Đang xử lý
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className={`p-6 rounded-2xl border ${
                                  darkMode 
                                    ? 'bg-gray-900/50 border-gray-600' 
                                    : 'bg-gray-50 border-gray-200'
                                }`}>
                                  <p className={`text-sm font-bold mb-3 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}>
                                    Nội dung tư vấn:
                                  </p>
                                  <p className={`text-sm whitespace-pre-wrap ${
                                    darkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {consult.noi_dung}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}

export default DangKyTuVan;
