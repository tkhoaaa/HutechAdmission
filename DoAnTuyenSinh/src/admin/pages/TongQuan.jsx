import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../accounts/UserContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import {
  FaUsers,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaGraduationCap,
  FaChartBar,
  FaCalendarAlt,
  FaStar,
  FaTrophy,
  FaQuestionCircle,
  FaEye,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaBolt,
  FaRocket,
  FaFire,
  FaGem,
  FaLightbulb,
  FaShieldAlt,
  FaTimes as FaClose,
  FaSync,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TongQuan = () => {
  const { isDemoMode } = useContext(UserContext);
  const { darkMode } = useDarkMode();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [topMajors, setTopMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Profile modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const PER_PAGE = 5;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, recentRes, majorsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/admin/dashboard-stats"),
        axios.get("http://localhost:3001/api/admin/recent-applications"),
        axios.get("http://localhost:3001/api/admin/top-majors"),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (recentRes.data.success) setRecentApplications(recentRes.data.data || []);
      if (majorsRes.data.success) setTopMajors(majorsRes.data.data || []);
    } catch (err) {
      setError("Không thể kết nối server. Hiển thị dữ liệu mẫu.");
      // Demo fallback
      setStats({
        totalApplications: 1250,
        pendingApplications: 89,
        approvedApplications: 1089,
        rejectedApplications: 72,
        totalStudents: 1089,
        totalMajors: 25,
        averageGPA: 7.8,
        completionRate: 85,
      });
      setRecentApplications([
        { id: 1, studentName: "Nguyễn Văn A", email: "nguyenvana@example.com", major: "Công nghệ thông tin", gpa: 8.5, status: "pending", submittedAt: new Date().toISOString(), avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=fff" },
        { id: 2, studentName: "Trần Thị B", email: "tranthib@example.com", major: "Quản trị kinh doanh", gpa: 7.8, status: "approved", submittedAt: new Date(Date.now() - 86400000).toISOString(), avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=10b981&color=fff" },
        { id: 3, studentName: "Lê Minh C", email: "leminhc@example.com", major: "Kế toán", gpa: 8.2, status: "approved", submittedAt: new Date(Date.now() - 172800000).toISOString(), avatar: "https://ui-avatars.com/api/?name=Le+Minh+C&background=f59e0b&color=fff" },
        { id: 4, studentName: "Phạm Thị D", email: "phamthid@example.com", major: "Marketing", gpa: 7.5, status: "rejected", submittedAt: new Date(Date.now() - 259200000).toISOString(), avatar: "https://ui-avatars.com/api/?name=Pham+Thi+D&background=ef4444&color=fff" },
        { id: 5, studentName: "Hoàng Văn E", email: "hoangvane@example.com", major: "Thiết kế đồ họa", gpa: 8.8, status: "pending", submittedAt: new Date(Date.now() - 345600000).toISOString(), avatar: "https://ui-avatars.com/api/?name=Hoang+Van+E&background=8b5cf6&color=fff" },
      ]);
      setTopMajors([
        { name: "Công nghệ thông tin", count: 450, percentage: 36, trend: "+12%", icon: "IT" },
        { name: "Quản trị kinh doanh", count: 320, percentage: 26, trend: "+8%", icon: "KD" },
        { name: "Kế toán", count: 280, percentage: 22, trend: "+5%", icon: "KT" },
        { name: "Marketing", count: 150, percentage: 12, trend: "+15%", icon: "MK" },
        { name: "Thiết kế đồ họa", count: 50, percentage: 4, trend: "+20%", icon: "TH" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(recentApplications.length / PER_PAGE);
  const paginatedApps = recentApplications.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const StatCard = ({ icon: Icon, title, value, colorClass, subtitle, trend }) => {
    const colorMap = {
      blue: darkMode ? "from-blue-600 to-blue-700" : "from-blue-500 to-blue-600",
      orange: darkMode ? "from-orange-600 to-orange-700" : "from-orange-500 to-orange-600",
      green: darkMode ? "from-green-600 to-green-700" : "from-green-500 to-green-600",
      red: darkMode ? "from-red-600 to-red-700" : "from-red-500 to-red-600",
      purple: darkMode ? "from-purple-600 to-purple-700" : "from-purple-500 to-purple-600",
      indigo: darkMode ? "from-indigo-600 to-indigo-700" : "from-indigo-500 to-indigo-600",
      yellow: darkMode ? "from-yellow-600 to-yellow-700" : "from-yellow-500 to-yellow-600",
      emerald: darkMode ? "from-emerald-600 to-emerald-700" : "from-emerald-500 to-emerald-600",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer group ${
          darkMode
            ? "bg-gray-800/70 border-gray-700/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/50"
            : "bg-white/80 border-gray-200/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold mb-2 truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {title}
            </p>
            <p className={`text-3xl font-black mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                parseFloat(trend.replace("%", "").replace("+", "")) >= 0
                  ? darkMode ? "text-green-400" : "text-green-600"
                  : darkMode ? "text-red-400" : "text-red-600"
              }`}>
                {parseFloat(trend.replace("%", "").replace("+", "")) >= 0 ? (
                  <FaArrowUp className="text-xs" />
                ) : (
                  <FaArrowDown className="text-xs" />
                )}
                {trend}
                <span className={`font-normal ${darkMode ? "text-gray-500" : "text-gray-400"}`}> tháng trước</span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ml-4 bg-gradient-to-br ${colorMap[colorClass] || colorMap.blue} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="text-white text-xl" />
          </div>
        </div>
      </motion.div>
    );
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { text: "Chờ xử lý", bg: darkMode ? "bg-yellow-900/50 text-yellow-300" : "bg-yellow-100 text-yellow-800", icon: FaClock },
      approved: { text: "Đã duyệt", bg: darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800", icon: FaCheckCircle },
      rejected: { text: "Từ chối", bg: darkMode ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800", icon: FaTimes },
    };
    const cfg = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg}`}>
        <cfg.icon />
        {cfg.text}
      </span>
    );
  };

  const getMajorColor = (index) => {
    const colors = [
      darkMode ? "from-blue-500 to-cyan-400" : "from-blue-500 to-cyan-400",
      darkMode ? "from-green-500 to-emerald-400" : "from-green-500 to-emerald-400",
      darkMode ? "from-purple-500 to-pink-400" : "from-purple-500 to-pink-400",
      darkMode ? "from-orange-500 to-yellow-400" : "from-orange-500 to-yellow-400",
      darkMode ? "from-red-500 to-pink-400" : "from-red-500 to-pink-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${darkMode ? "from-blue-600 to-purple-600" : "from-blue-500 to-purple-500"}`}>
              <FaRocket className="text-white text-xl" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
                Trang Tổng Quan
              </h1>
              <p className={`text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Hệ thống quản lý tuyển sinh HUTECH
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Clock */}
            <div className={`px-5 py-3 rounded-2xl border shadow-sm ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
              <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {currentTime.toLocaleDateString("vi-VN", { weekday: "long" })}
              </p>
              <p className={`text-lg font-bold font-mono ${darkMode ? "text-white" : "text-gray-900"}`}>
                {currentTime.toLocaleTimeString("vi-VN")}
              </p>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className={`p-3 rounded-2xl border shadow-sm transition-all duration-200 ${darkMode ? "bg-gray-800/70 border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600" : "bg-white/80 border-gray-200/50 text-gray-500 hover:text-gray-900 hover:border-gray-300"} disabled:opacity-50`}
              title="Làm mới dữ liệu"
              aria-label="Làm mới dữ liệu"
            >
              <FaSync className={`text-lg ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 px-5 py-4 rounded-2xl border-l-4 flex items-center gap-4 ${
                darkMode ? "bg-amber-900/20 border-amber-500 text-amber-300" : "bg-amber-50 border-amber-400 text-amber-800"
              }`}
            >
              <FaLightbulb className="text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <button onClick={() => setError("")} className="text-amber-500 hover:text-amber-700">
                <FaClose className="text-sm" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="mb-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Stats Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <StatCard icon={FaFileAlt} title="Tổng hồ sơ" value={stats?.totalApplications || 0} colorClass="blue" subtitle="Hồ sơ đã nộp" trend="+12.5%" />
          <StatCard icon={FaClock} title="Chờ xử lý" value={stats?.pendingApplications || 0} colorClass="orange" subtitle="Cần duyệt" trend="-5.2%" />
          <StatCard icon={FaCheckCircle} title="Đã duyệt" value={stats?.approvedApplications || 0} colorClass="green" subtitle="Hồ sơ hợp lệ" trend="+8.7%" />
          <StatCard icon={FaTimes} title="Từ chối" value={stats?.rejectedApplications || 0} colorClass="red" subtitle="Không hợp lệ" trend="-2.1%" />
        </div>

        {/* Stats Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={FaUsers} title="Sinh viên" value={stats?.totalStudents || 0} colorClass="purple" subtitle="Đã nhập học" trend="+15.2%" />
          <StatCard icon={FaGraduationCap} title="Ngành học" value={stats?.totalMajors || 0} colorClass="indigo" subtitle="Chương trình đào tạo" trend="+2.3%" />
          <StatCard icon={FaStar} title="GPA TB" value={stats?.averageGPA || 0} colorClass="yellow" subtitle="Điểm trung bình" trend="+0.3%" />
          <StatCard icon={FaTrophy} title="Hoàn thành" value={`${stats?.completionRate || 0}%`} colorClass="emerald" subtitle="Hồ sơ hoàn chỉnh" trend="+4.2%" />
        </div>

        {/* Charts & Recent */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Top Majors */}
          <div className={`xl:col-span-2 rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500`}>
                  <FaChartBar className="text-white text-sm" />
                </div>
                Top Ngành Phổ Biến
              </h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${darkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                <FaFire className="inline text-orange-500 mr-1" />
                Hot
              </span>
            </div>

            <div className="space-y-3">
              {topMajors.map((major, index) => (
                <motion.div
                  key={major.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                    darkMode ? "bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50" : "bg-gray-50/50 border-gray-100 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm bg-gradient-to-br ${getMajorColor(index)} shadow-sm flex-shrink-0`}>
                      {major.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {major.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{major.count} hồ sơ</span>
                        <span className={`text-xs font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                          <FaArrowUp className="inline text-xs mr-0.5" />
                          {major.trend}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-4 flex-shrink-0">
                    <p className={`text-lg font-black ${darkMode ? "text-white" : "text-gray-900"}`}>{major.percentage}%</p>
                    <div className={`w-24 h-1.5 rounded-full mt-1 overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getMajorColor(index)}`}
                        style={{ width: `${major.percentage}%`, transition: "width 1s ease-out" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500`}>
                  <FaBolt className="text-white text-sm" />
                </div>
                Hồ Sơ Gần Đây
              </h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${darkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                {recentApplications.length} hồ sơ
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {paginatedApps.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer group ${
                    darkMode ? "bg-gray-700/30 border-gray-700/50 hover:bg-gray-700/50" : "bg-gray-50/50 border-gray-100 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={app.avatar}
                        alt={app.studentName}
                        className="w-10 h-10 rounded-full border-2 border-white/20 shadow-sm"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${darkMode ? "border-gray-700" : "border-white"} ${
                        app.status === "approved" ? "bg-green-500" : app.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {app.studentName}
                        </p>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{app.major}</p>
                        <p className={`text-xs font-bold flex-shrink-0 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>GPA {app.gpa}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-all ${darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-700 disabled:opacity-30" : "border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"}`}
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <span className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition-all ${darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-700 disabled:opacity-30" : "border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30"}`}
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/admin/quan-ly-ho-so")}
              className={`w-full mt-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-sm`}
            >
              Xem tất cả hồ sơ
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
          <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500`}>
              <FaGem className="text-white text-sm" />
            </div>
            Thao Tác Nhanh
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaFileAlt, title: "Xử lý hồ sơ", subtitle: `${stats?.pendingApplications || 0} chờ duyệt`, color: "from-blue-500 to-cyan-400", path: "/admin/quan-ly-ho-so" },
              { icon: FaUsers, title: "Quản lý sinh viên", subtitle: "Thông tin sinh viên", color: "from-green-500 to-emerald-400", path: "/admin/quan-ly-ho-so" },
              { icon: FaQuestionCircle, title: "Quản lý FAQ", subtitle: "Câu hỏi thường gặp", color: "from-purple-500 to-pink-400", path: "/admin/quan-ly-faq" },
              { icon: FaChartBar, title: "Báo cáo", subtitle: "Thống kê chi tiết", color: "from-orange-500 to-yellow-400", path: "/admin/bao-cao" },
            ].map((action) => (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(action.path)}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm hover:shadow-lg transition-all duration-200 text-left`}
              >
                <action.icon className="text-xl mb-2" />
                <p className="font-bold text-sm">{action.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{action.subtitle}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {showProfileModal && selectedProfile && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Chi tiết hồ sơ
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <FaClose />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <img src={selectedProfile.avatar} alt={selectedProfile.studentName} className="w-14 h-14 rounded-full border-2 border-blue-500/50" />
                <div>
                  <p className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedProfile.studentName}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{selectedProfile.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Ngành</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedProfile.major}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>GPA</p>
                    <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedProfile.gpa}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Trạng thái</p>
                    <div className="mt-0.5">{getStatusBadge(selectedProfile.status)}</div>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Ngày nộp</p>
                  <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {new Date(selectedProfile.submittedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setShowProfileModal(false); navigate(`/admin/quan-ly-ho-so/${selectedProfile.id}/edit`); }}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm transition-all"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TongQuan;
