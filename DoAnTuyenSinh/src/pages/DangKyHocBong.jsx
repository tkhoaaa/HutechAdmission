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
  FaStar,
  FaTrophy,
  FaUsers,
  FaFileUpload,
  FaList,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { UserContext } from "../accounts/UserContext";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

function DangKyHocBong() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("register");
  const [form, setForm] = useState({
    ho_ten: "",
    ngay_sinh: "",
    gioi_tinh: "",
    cccd: "",
    dia_chi: "",
    phone: "",
    email: "",
    nganh: "",
    lop: "",
    khoa: "",
    diem_tb: "",
    hoc_bong: "",
    thanh_tich: "",
    kinh_te: "",
    so_thanh_vien: "",
    ly_do: "",
    nguon_thong_tin: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await axios.post(
        "http://localhost:3001/api/scholarship/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Nộp đơn học bổng thành công!");
      setForm({
        ho_ten: "",
        ngay_sinh: "",
        gioi_tinh: "",
        cccd: "",
        dia_chi: "",
        phone: "",
        email: "",
        nganh: "",
        lop: "",
        khoa: "",
        diem_tb: "",
        hoc_bong: "",
        thanh_tich: "",
        kinh_te: "",
        so_thanh_vien: "",
        ly_do: "",
        nguon_thong_tin: "",
      });
      setAttachments([]);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.map((e) => e.msg).join(" | "));
      } else {
        setError(err.response?.data?.message || "Nộp đơn thất bại!");
      }
    }
    setLoading(false);
  };

  const loadApplications = async () => {
    if (!user?.email) {
      setError("Vui lòng đăng nhập để xem danh sách đơn");
      return;
    }

    setLoadingList(true);
    try {
      const res = await axios.get(
        `http://localhost:3001/api/scholarship/list?email=${user.email}`
      );
      setApplications(res.data.data || []);
    } catch (err) {
      setError(
        "Không thể tải danh sách đơn: " +
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
        title="Đăng ký học bổng - HUTECH"
        description="Đăng ký học bổng HUTECH 2025 - Học bổng khuyến khích học tập, tài năng, hỗ trợ sinh viên nghèo. Nộp đơn trực tuyến đơn giản."
        keywords="đăng ký học bổng, học bổng HUTECH, học bổng tài năng, học bổng khuyến khích"
        canonical="/dang-ky-hoc-bong"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-800/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 dark:from-emerald-600/10 dark:to-cyan-800/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-600/10 dark:from-pink-600/5 dark:to-orange-800/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const leftPos = ((i * 7 + 5) % 90) + 5;
            const topPos = ((i * 11 + 13) % 80) + 10;
            const duration = 3 + (i * 0.25) % 2.5;
            const delay = i * 0.15;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-600/20 rounded-full"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  y: [-20, -100, -20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                }}
              />
            );
          })}
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-24 z-10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-yellow-500 text-3xl" />
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaStar className="text-yellow-500" />
                </motion.div>
                Học bổng lên đến 100% học phí
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6 leading-tight"
              >
                Đăng Ký Học Bổng
              </motion.h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Mở ra cơ hội học tập với học bổng giá trị từ HUTECH
                <br />
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Hỗ trợ tài chính cho sinh viên xuất sắc và có hoàn cảnh khó khăn
                </span>
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="pb-20 relative z-10"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              {/* Tab Navigation */}
              <motion.div
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-4xl font-bold text-white mb-3">
                      Hệ Thống Học Bổng HUTECH
                    </h2>
                    <p className="text-white/90 text-lg">
                      Chọn dịch vụ bạn muốn sử dụng
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <motion.button
                      onClick={() => setActiveTab("register")}
                      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        activeTab === "register"
                          ? "bg-white text-blue-600 shadow-xl scale-105"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        animate={activeTab === "register" ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <FaPlus className="text-xl" />
                        Nộp đơn mới
                      </motion.div>
                      {activeTab === "register" && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        setActiveTab("list");
                        loadApplications();
                      }}
                      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                        activeTab === "list"
                          ? "bg-white text-blue-600 shadow-xl scale-105"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        animate={activeTab === "list" ? { x: [0, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <FaList className="text-xl" />
                        Danh sách đơn đã gửi
                      </motion.div>
                      {activeTab === "list" && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === "register" ? (
                      // Form đăng ký học bổng
                      <motion.form
                        key="register"
                        onSubmit={handleSubmit}
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Thông tin cá nhân */}
                        <motion.div
                          className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-8 rounded-3xl border border-blue-200/50 dark:border-blue-700/30 shadow-lg overflow-hidden"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaUser className="text-white text-xl" />
                            </motion.div>
                            Thông tin cá nhân
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <Input
                              name="ho_ten"
                              value={form.ho_ten}
                              onChange={handleChange}
                              placeholder="Họ và tên"
                              icon={FaUser}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <Input
                              name="ngay_sinh"
                              type="date"
                              value={form.ngay_sinh}
                              onChange={handleChange}
                              placeholder="Ngày sinh"
                              icon={FaCalendar}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Giới tính *
                              </label>
                              <select
                                name="gioi_tinh"
                                value={form.gioi_tinh}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                              </select>
                            </div>
                            <Input
                              name="cccd"
                              value={form.cccd}
                              onChange={handleChange}
                              placeholder="CCCD/CMND"
                              icon={FaIdCard}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <Input
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="Số điện thoại"
                              icon={FaPhone}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <Input
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={handleChange}
                              placeholder="Email"
                              icon={FaEnvelope}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <div className="md:col-span-2">
                              <Input
                                name="dia_chi"
                                value={form.dia_chi}
                                onChange={handleChange}
                                placeholder="Địa chỉ"
                                icon={FaMapMarkerAlt}
                                required
                                className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Thông tin học tập */}
                        <motion.div
                          className="relative bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm p-8 rounded-3xl border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg overflow-hidden"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaGraduationCap className="text-white text-xl" />
                            </motion.div>
                            Thông tin học tập
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <Input
                              name="nganh"
                              value={form.nganh}
                              onChange={handleChange}
                              placeholder="Ngành học"
                              icon={FaGraduationCap}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <Input
                              name="lop"
                              value={form.lop}
                              onChange={handleChange}
                              placeholder="Lớp"
                              icon={FaGraduationCap}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <Input
                              name="khoa"
                              value={form.khoa}
                              onChange={handleChange}
                              placeholder="Khóa"
                              icon={FaGraduationCap}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <Input
                              name="diem_tb"
                              type="number"
                              step="0.01"
                              min="0"
                              max="10"
                              value={form.diem_tb}
                              onChange={handleChange}
                              placeholder="Điểm trung bình"
                              icon={FaStar}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Loại học bổng mong muốn *
                              </label>
                              <select
                                name="hoc_bong"
                                value={form.hoc_bong}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chọn loại học bổng</option>
                                <option value="Học bổng khuyến khích học tập">
                                  Học bổng khuyến khích học tập
                                </option>
                                <option value="Học bổng tài năng">
                                  Học bổng tài năng
                                </option>
                                <option value="Học bổng hỗ trợ sinh viên nghèo">
                                  Học bổng hỗ trợ sinh viên nghèo
                                </option>
                              </select>
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Thành tích học tập
                              </label>
                              <textarea
                                name="thanh_tich"
                                value={form.thanh_tich}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none text-slate-700 dark:text-slate-300"
                                placeholder="Mô tả thành tích học tập, giải thưởng..."
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Hoàn cảnh gia đình */}
                        <motion.div
                          className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm p-8 rounded-3xl border border-purple-200/50 dark:border-purple-700/30 shadow-lg overflow-hidden"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaUsers className="text-white text-xl" />
                            </motion.div>
                            Hoàn cảnh gia đình
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Hoàn cảnh kinh tế *
                              </label>
                              <select
                                name="kinh_te"
                                value={form.kinh_te}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chọn hoàn cảnh</option>
                                <option value="Khó khăn">Khó khăn</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Khá giả">Khá giả</option>
                              </select>
                            </div>
                            <Input
                              name="so_thanh_vien"
                              type="number"
                              min="1"
                              value={form.so_thanh_vien}
                              onChange={handleChange}
                              placeholder="Số thành viên trong gia đình"
                              icon={FaUsers}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                            />
                          </div>
                        </motion.div>

                        {/* Lý do và nguồn thông tin */}
                        <motion.div
                          className="relative bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm p-8 rounded-3xl border border-orange-200/50 dark:border-orange-700/30 shadow-lg overflow-hidden"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl"></div>
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaTrophy className="text-white text-xl" />
                            </motion.div>
                            Thông tin bổ sung
                          </motion.h3>
                          <div className="space-y-6 relative z-10">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Lý do xin học bổng *
                              </label>
                              <textarea
                                name="ly_do"
                                value={form.ly_do}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-2xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 resize-none text-slate-700 dark:text-slate-300"
                                placeholder="Trình bày lý do xin học bổng..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Nguồn thông tin *
                              </label>
                              <select
                                name="nguon_thong_tin"
                                value={form.nguon_thong_tin}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-2xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chọn nguồn thông tin</option>
                                <option value="Website trường">
                                  Website trường
                                </option>
                                <option value="Mạng xã hội">Mạng xã hội</option>
                                <option value="Bạn bè">Bạn bè</option>
                                <option value="Thầy cô">Thầy cô</option>
                                <option value="Khác">Khác</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>

                        {/* Upload file minh chứng */}
                        <motion.div
                          className="relative bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/20 dark:to-teal-900/20 backdrop-blur-sm p-8 rounded-3xl border border-cyan-200/50 dark:border-cyan-700/30 shadow-lg overflow-hidden"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <FaFileUpload className="text-white text-xl" />
                            </motion.div>
                            File minh chứng (tùy chọn)
                          </motion.h3>
                          <div className="relative z-10">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                              Tải lên file minh chứng (tối đa 5 file)
                            </label>
                            <motion.div 
                              className="border-2 border-dashed border-cyan-300 dark:border-cyan-600 rounded-2xl p-8 text-center hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm"
                              whileHover={{ scale: 1.02 }}
                            >
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                              />
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                <motion.div
                                  animate={{ y: [0, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <FaFileUpload className="text-5xl text-cyan-500 dark:text-cyan-400 mx-auto mb-4" />
                                </motion.div>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                  Chọn file hoặc kéo thả vào đây
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Chấp nhận: PDF, DOC, DOCX, JPG, PNG (mỗi file
                                  tối đa 5MB)
                                </p>
                              </label>
                            </motion.div>
                            {attachments.length > 0 && (
                              <motion.div
                                className="mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                  Files đã chọn:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {attachments.map((file, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center gap-3 p-3 bg-cyan-100/70 dark:bg-cyan-900/30 backdrop-blur-sm rounded-xl border border-cyan-200 dark:border-cyan-700"
                                    >
                                      <FaFileUpload className="text-cyan-500 dark:text-cyan-400" />
                                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                        {file.name}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>

                        {/* Submit button */}
                        <motion.div
                          className="flex justify-center pt-8"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <motion.button
                            type="submit"
                            disabled={loading}
                            className="relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="relative flex items-center gap-3">
                              <motion.div
                                animate={loading ? { rotate: 360 } : {}}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <FaTrophy className="text-2xl" />
                              </motion.div>
                              {loading ? "Đang xử lý..." : "Nộp đơn học bổng"}
                            </div>
                          </motion.button>
                        </motion.div>

                        {/* Messages */}
                        <AnimatePresence>
                          {success && (
                            <motion.div
                              className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-2xl flex items-center gap-4 shadow-lg"
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                <FaCheckCircle className="text-green-500 dark:text-green-400 text-2xl" />
                              </motion.div>
                              <span className="font-semibold">{success}</span>
                            </motion.div>
                          )}
                          {error && (
                            <motion.div
                              className="p-6 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 backdrop-blur-sm border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl flex items-center gap-4 shadow-lg"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                            >
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-2xl" />
                              </motion.div>
                              <span className="font-semibold">{error}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.form>
                    ) : (
                      // Danh sách đơn đã gửi
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                          <motion.h3 
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            Danh sách đơn học bổng đã gửi
                          </motion.h3>
                          <motion.button
                            onClick={loadApplications}
                            disabled={loadingList}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            {loadingList ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              "Làm mới"
                            )}
                          </motion.button>
                        </div>

                        {loadingList ? (
                          <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">Đang tải danh sách...</p>
                          </motion.div>
                        ) : applications.length === 0 ? (
                          <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <FaList className="text-8xl text-slate-400 dark:text-slate-600 mx-auto mb-6" />
                            </motion.div>
                            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
                              Chưa có đơn học bổng nào được gửi
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
                            {applications.map((app, index) => (
                              <motion.div
                                key={app.id || index}
                                variants={{
                                  hidden: { opacity: 0, y: 30 },
                                  visible: { opacity: 1, y: 0 },
                                }}
                                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                                
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                                  <motion.h4 
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    Đơn #{app.id} - {app.ho_ten}
                                  </motion.h4>
                                  <motion.span 
                                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold backdrop-blur-sm"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                  >
                                    {formatDate(app.created_at)}
                                  </motion.span>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm relative z-10">
                                  <motion.div 
                                    className="space-y-3"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                  >
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Ngành:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.nganh}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Lớp:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.lop}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Khóa:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.khoa}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Điểm TB:</strong> 
                                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg font-semibold">{app.diem_tb}</span>
                                    </p>
                                  </motion.div>
                                  <motion.div 
                                    className="space-y-3"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.4 }}
                                  >
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Loại học bổng:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.hoc_bong}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Hoàn cảnh:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.kinh_te}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Thành viên:</strong> 
                                      <span className="text-slate-600 dark:text-slate-400">{app.so_thanh_vien} người</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Trạng thái:</strong>
                                      <motion.span 
                                        className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      >
                                        Đang xử lý
                                      </motion.span>
                                    </p>
                                  </motion.div>
                                </div>

                                {app.attachments && (
                                  <motion.div 
                                    className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 relative z-10"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                  >
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                      File đính kèm:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {JSON.parse(app.attachments).map(
                                        (file, fileIndex) => (
                                          <motion.span
                                            key={fileIndex}
                                            className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium backdrop-blur-sm"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: fileIndex * 0.1 }}
                                            whileHover={{ scale: 1.1 }}
                                          >
                                            {file}
                                          </motion.span>
                                        )
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}

export default DangKyHocBong;
