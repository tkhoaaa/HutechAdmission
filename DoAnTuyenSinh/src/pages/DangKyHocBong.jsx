import React, { useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendar,
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

      setSuccess("Nop don hoc bong thanh cong!");
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
        setError(err.response?.data?.message || "Nop don that bai!");
      }
    }
    setLoading(false);
  };

  const loadApplications = async () => {
    if (!user?.email) {
      setError("Vui long dang nhap de xem danh sach don");
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
        "Khong the tai danh sach don: " +
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
        title="Dang ky hoc bong - HUTECH"
        description="Dang ky hoc bong HUTECH 2025 - Hoc bong khuyen khich hoc tap, tai nang, ho tro sinh vien ngheo. Nop don truc tuyen don gian."
        keywords="dang ky hoc bong, hoc bong HUTECH, hoc bong tai nang, hoc bong khuyen khich"
        canonical="/dang-ky-hoc-bong"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements - CSS based */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-800/10 rounded-full blur-3xl animate-spin-slow-reverse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 dark:from-emerald-600/10 dark:to-cyan-800/10 rounded-full blur-3xl animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-600/10 dark:from-pink-600/5 dark:to-orange-800/5 rounded-full blur-3xl animate-pulse-soft" />
        </div>

        {/* Floating Particles - CSS based */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const leftPos = ((i * 7 + 5) % 90) + 5;
            const topPos = ((i * 11 + 13) % 80) + 10;
            const delay = (i * 0.5) % 5;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-600/20 rounded-full animate-particle-rise"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${3 + (i * 0.25) % 2.5}s`,
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
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-pulse-soft" />
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
                <div className="animate-spin-slow">
                  <FaStar className="text-yellow-500" />
                </div>
                Hoc bong len den 100% hoc phi
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight"
              >
                Dang Ky Hoc Bong
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Mo ra co hoi hoc tap voi hoc bong gia tri tu HUTECH
                <br />
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  Ho tro tai chinh cho sinh vien xuat sac va co hoan canh kho khan
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
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                      He Thong Hoc Bong HUTECH
                    </h2>
                    <p className="text-white/90 text-lg">
                      Chon dich vu ban muon su dung
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
                      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                        activeTab === "register"
                          ? "bg-white text-blue-600 shadow-xl scale-105"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaPlus className="text-xl" />
                        Nop don moi
                      </div>
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
                      className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                        activeTab === "list"
                          ? "bg-white text-blue-600 shadow-xl scale-105"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FaList className="text-xl" />
                        Danh sach don da gui
                      </div>
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
                      <motion.form
                        key="register"
                        onSubmit={handleSubmit}
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Thong tin ca nhan */}
                        <motion.div
                          className="relative bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-8 rounded-3xl border border-blue-200/50 dark:border-blue-700/30 shadow-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl" />
                          <motion.h3
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-360 transition-transform duration-500">
                              <FaUser className="text-white text-xl" />
                            </div>
                            Thong tin ca nhan
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <Input
                              name="ho_ten"
                              value={form.ho_ten}
                              onChange={handleChange}
                              placeholder="Ho va ten"
                              icon={FaUser}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <Input
                              name="ngay_sinh"
                              type="date"
                              value={form.ngay_sinh}
                              onChange={handleChange}
                              placeholder="Ngay sinh"
                              icon={FaCalendar}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Gioi tinh *
                              </label>
                              <select
                                name="gioi_tinh"
                                value={form.gioi_tinh}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chon gioi tinh</option>
                                <option value="Nam">Nam</option>
                                <option value="Nu">Nu</option>
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
                              placeholder="So dien thoai"
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
                                placeholder="Dia chi"
                                icon={FaMapMarkerAlt}
                                required
                                className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Thong tin hoc tap */}
                        <motion.div
                          className="relative bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm p-8 rounded-3xl border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl" />
                          <motion.h3
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-360 transition-transform duration-500">
                              <FaGraduationCap className="text-white text-xl" />
                            </div>
                            Thong tin hoc tap
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <Input
                              name="nganh"
                              value={form.nganh}
                              onChange={handleChange}
                              placeholder="Nganh hoc"
                              icon={FaGraduationCap}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <Input
                              name="lop"
                              value={form.lop}
                              onChange={handleChange}
                              placeholder="Lop"
                              icon={FaGraduationCap}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <Input
                              name="khoa"
                              value={form.khoa}
                              onChange={handleChange}
                              placeholder="Khoa"
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
                              placeholder="Diem trung binh"
                              icon={FaStar}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400"
                            />
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Loai hoc bong mong muon *
                              </label>
                              <select
                                name="hoc_bong"
                                value={form.hoc_bong}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chon loai hoc bong</option>
                                <option value="Hoc bong khuyen khich hoc tap">
                                  Hoc bong khuyen khich hoc tap
                                </option>
                                <option value="Hoc bong tai nang">
                                  Hoc bong tai nang
                                </option>
                                <option value="Hoc bong ho tro sinh vien ngheo">
                                  Hoc bong ho tro sinh vien ngheo
                                </option>
                              </select>
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Thanh tich hoc tap
                              </label>
                              <textarea
                                name="thanh_tich"
                                value={form.thanh_tich}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none text-slate-700 dark:text-slate-300"
                                placeholder="Mo ta thanh tich hoc tap, giai thuong..."
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Hoan canh gia dinh */}
                        <motion.div
                          className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm p-8 rounded-3xl border border-purple-200/50 dark:border-purple-700/30 shadow-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
                          <motion.h3
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-360 transition-transform duration-500">
                              <FaUsers className="text-white text-xl" />
                            </div>
                            Hoan canh gia dinh
                          </motion.h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Hoan canh kinh te *
                              </label>
                              <select
                                name="kinh_te"
                                value={form.kinh_te}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-purple-200 dark:border-purple-700 rounded-2xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chon hoan canh</option>
                                <option value="Kho khan">Kho khan</option>
                                <option value="Trung binh">Trung binh</option>
                                <option value="Kha giang">Kha giang</option>
                              </select>
                            </div>
                            <Input
                              name="so_thanh_vien"
                              type="number"
                              min="1"
                              value={form.so_thanh_vien}
                              onChange={handleChange}
                              placeholder="So thanh vien trong gia dinh"
                              icon={FaUsers}
                              required
                              className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                            />
                          </div>
                        </motion.div>

                        {/* Ly do va nguon thong tin */}
                        <motion.div
                          className="relative bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm p-8 rounded-3xl border border-orange-200/50 dark:border-orange-700/30 shadow-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl" />
                          <motion.h3
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-360 transition-transform duration-500">
                              <FaTrophy className="text-white text-xl" />
                            </div>
                            Thong tin bo sung
                          </motion.h3>
                          <div className="space-y-6 relative z-10">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Ly do xin hoc bong *
                              </label>
                              <textarea
                                name="ly_do"
                                value={form.ly_do}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-2xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 resize-none text-slate-700 dark:text-slate-300"
                                placeholder="Trinh bay ly do xin hoc bong..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                Nguon thong tin *
                              </label>
                              <select
                                name="nguon_thong_tin"
                                value={form.nguon_thong_tin}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-orange-200 dark:border-orange-700 rounded-2xl focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                              >
                                <option value="">Chon nguon thong tin</option>
                                <option value="Website truong">
                                  Website truong
                                </option>
                                <option value="Mang xa hoi">Mang xa hoi</option>
                                <option value="Ban be">Ban be</option>
                                <option value="Thay co">Thay co</option>
                                <option value="Khac">Khac</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>

                        {/* Upload file minh chung */}
                        <motion.div
                          className="relative bg-gradient-to-br from-cyan-50/80 to-teal-50/80 dark:from-cyan-900/20 dark:to-teal-900/20 backdrop-blur-sm p-8 rounded-3xl border border-cyan-200/50 dark:border-cyan-700/30 shadow-lg overflow-hidden hover:scale-[1.01] transition-transform duration-300"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-2xl" />
                          <motion.h3
                            className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-360 transition-transform duration-500">
                              <FaFileUpload className="text-white text-xl" />
                            </div>
                            File minh chung (tuy chon)
                          </motion.h3>
                          <div className="relative z-10">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                              Tai len file minh chung (toi da 5 file)
                            </label>
                            <div className="border-2 border-dashed border-cyan-300 dark:border-cyan-600 rounded-2xl p-8 text-center hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:scale-[1.02] transition-transform">
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
                                <div className="animate-float">
                                  <FaFileUpload className="text-4xl md:text-5xl text-cyan-500 dark:text-cyan-400 mx-auto mb-4" />
                                </div>
                                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                  Chon file hoac keo tha vao day
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  Chap nhan: PDF, DOC, DOCX, JPG, PNG (moi file
                                  toi da 5MB)
                                </p>
                              </label>
                            </div>
                            {attachments.length > 0 && (
                              <motion.div
                                className="mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                  Files da chon:
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
                            className="relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-shimmer-cta" />
                            <div className="relative flex items-center gap-3">
                              <div className={loading ? "animate-spin" : ""}>
                                <FaTrophy className="text-2xl" />
                              </div>
                              {loading ? "Dang xu ly..." : "Nop don hoc bong"}
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
                            Danh sach don hoc bong da gui
                          </motion.h3>
                          <motion.button
                            onClick={loadApplications}
                            disabled={loadingList}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            {loadingList ? (
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              "Lam moi"
                            )}
                          </motion.button>
                        </div>

                        {loadingList ? (
                          <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6 animate-spin" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">Dang tai danh sach...</p>
                          </motion.div>
                        ) : applications.length === 0 ? (
                          <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="animate-float">
                              <FaList className="text-8xl text-slate-400 dark:text-slate-600 mx-auto mb-6" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
                              Chua co don hoc bong nao duoc gui
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
                                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-[1.02] hover:-translate-y-1"
                              >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl" />

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                                  <motion.h4
                                    className="text-2xl font-bold text-slate-800 dark:text-slate-100"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    Don #{app.id} - {app.ho_ten}
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
                                      <strong className="text-slate-700 dark:text-slate-300">Nganh:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.nganh}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Lop:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.lop}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Khoa:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.khoa}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Diem TB:</strong>
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
                                      <strong className="text-slate-700 dark:text-slate-300">Loai hoc bong:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.hoc_bong}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Hoan canh:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.kinh_te}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Thanh vien:</strong>
                                      <span className="text-slate-600 dark:text-slate-400">{app.so_thanh_vien} nguoi</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <strong className="text-slate-700 dark:text-slate-300">Trang thai:</strong>
                                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg animate-pulse-soft">
                                        Dang xu ly
                                      </span>
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
                                      File dinh kem:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {JSON.parse(app.attachments).map(
                                        (file, fileIndex) => (
                                          <motion.span
                                            key={fileIndex}
                                            className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-medium backdrop-blur-sm hover:scale-110 transition-transform"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: fileIndex * 0.1 }}
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
