import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../accounts/UserContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { adminAPI } from "../../utils/apiClient";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaFileAlt,
  FaQuestionCircle,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaCrown,
  FaUserCircle,
  FaUser,
  FaUserCog,
  FaRocket,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const { user, username, role, isDemoMode, logout } = useContext(UserContext);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const notificationRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  const displayName = username || user?.username || user?.name || user?.email || "Admin";
  const avatarUrl = getAvatarUrl(user);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const fetchNotifications = async () => {
    if (isDemoMode) {
      setNotifications([
        { id: 1, title: "Hồ sơ mới cần duyệt", message: "Có 5 hồ sơ mới cần xử lý ngay", time: "5 phút trước", type: "warning", unread: true },
        { id: 2, title: "Báo cáo tuần đã sẵn sàng", message: "Báo cáo thống kê tuần này đã được tạo", time: "1 giờ trước", type: "info", unread: true },
        { id: 3, title: "Hệ thống cập nhật", message: "Hệ thống đã được cập nhật thành công", time: "2 giờ trước", type: "success", unread: false },
        { id: 4, title: "Người dùng mới đăng ký", message: "12 người dùng mới đăng ký hôm nay", time: "3 giờ trước", type: "info", unread: false },
      ]);
      return;
    }
    setNotificationsLoading(true);
    try {
      const res = await adminAPI.getNotifications({ limit: 10 });
      if (res.success) {
        setNotifications(res.data.notifications.map(n => ({
          id: n.id,
          title: n.title,
          message: n.content,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : "",
          type: n.isPublished ? "info" : "warning",
          unread: !n.isPublished,
        })));
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isDemoMode]);

  const menuItems = [
    { id: "tong-quan", label: "Tổng Quan", icon: FaHome, path: "/admin/tong-quan", color: "from-blue-500 to-blue-600", description: "Dashboard chính", badge: "Hot" },
    { id: "quan-ly-ho-so", label: "Quản Lý Hồ Sơ", icon: FaFileAlt, path: "/admin/quan-ly-ho-so", color: "from-green-500 to-green-600", description: "Xét duyệt hồ sơ", badge: "89" },
    { id: "quan-ly-faq", label: "Quản Lý FAQ", icon: FaQuestionCircle, path: "/admin/quan-ly-faq", color: "from-purple-500 to-purple-600", description: "Câu hỏi thường gặp" },
    { id: "bao-cao", label: "Báo Cáo", icon: FaChartBar, path: "/admin/bao-cao", color: "from-orange-500 to-orange-600", description: "Thống kê chi tiết", badge: "New" },
    { id: "cai-dat", label: "Cài Đặt", icon: FaCog, path: "/admin/cai-dat", color: "from-gray-500 to-gray-600", description: "Thiết lập hệ thống" },
  ];

  const notificationConfig = {
    warning: "bg-yellow-500",
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const MenuItem = ({ item, isActive, onClick }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-4 mx-2 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? `bg-gradient-to-r ${item.color} text-white shadow-2xl`
            : darkMode
            ? "text-gray-300 hover:bg-gray-700/80 hover:text-white hover:shadow-xl"
            : "text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-xl"
        }`}
      >
        <div className="relative z-10 p-3 rounded-xl flex-shrink-0 transition-all duration-200 bg-white/10 dark:bg-white/10">
          <item.icon className={`text-xl ${isActive ? "text-white" : darkMode ? "text-gray-300" : "text-gray-600"}`} />
        </div>
        <div className="relative z-10 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg truncate">{item.label}</div>
            {item.badge && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ml-2 flex-shrink-0 ${
                item.badge === "Hot" ? "bg-red-500 text-white" : item.badge === "New" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
              }`}>
                {item.badge}
              </span>
            )}
          </div>
          <div className={`text-sm opacity-80 truncate ${isActive ? "text-white" : darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {item.description}
          </div>
        </div>
        {isActive && <div className="absolute right-2 w-1 h-8 bg-white rounded-full shadow-xl" />}
      </Link>
    </motion.div>
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"}`}>
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2 px-4 text-center shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            🎯 <span>DEMO MODE - Dữ liệu mẫu cho Vercel deployment</span>
          </div>
        </motion.div>
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`flex min-h-screen ${isDemoMode ? 'pt-10' : ''}`}>
        {/* Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 z-50 w-80 ${
            darkMode ? "bg-gray-800/90 border-gray-700/30" : "bg-white/90 border-white/30"
          } backdrop-blur-2xl shadow-2xl border-r lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isDemoMode ? 'top-10' : ''}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <motion.div
              className={`relative z-10 p-6 border-b ${darkMode ? "border-gray-700/20" : "border-white/20"}`}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png"
                        alt="HUTECH Logo"
                        className="w-8 h-8 object-contain rounded-lg"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-crown-glow">
                      <FaCrown className="text-yellow-800 text-xs" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                      HUTECH Admin
                    </h1>
                    <p className={`text-xs flex items-center gap-2 font-semibold whitespace-nowrap ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <FaShieldAlt className="text-blue-500" />
                      Quản trị hệ thống
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                  aria-label="Đóng thanh điều hướng"
                >
                  <FaTimes className="text-lg" aria-hidden="true" />
                </button>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-3 relative z-10">
              <div className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                <FaRocket className="text-blue-500" />
                Điều hướng chính
              </div>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <MenuItem item={item} isActive={location.pathname === item.path} onClick={() => setSidebarOpen(false)} />
                </motion.div>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-80">
          {/* Top Header */}
          <motion.header
            className={`${darkMode ? "bg-gray-800/85 border-gray-700/30" : "bg-white/85 border-white/30"} backdrop-blur-2xl shadow-2xl border-b sticky z-30 ${isDemoMode ? 'top-10' : 'top-0'}`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-8 py-5">
              {/* Left side */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/")}
                  className={`p-3 rounded-2xl transition-all duration-300 font-bold flex items-center gap-2 ${darkMode ? "text-blue-400 hover:bg-blue-900/50" : "text-blue-600 hover:bg-blue-100"}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Quay về trang chủ"
                >
                  <FaHome className="text-lg" />
                  Trang chủ
                </button>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`lg:hidden p-4 rounded-2xl transition-all duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Mở thanh điều hướng"
                >
                  <FaBars className="text-xl" aria-hidden="true" />
                </button>

                {/* Search */}
                <motion.div
                  className="relative hidden md:block"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FaSearch className={`absolute left-5 top-1/2 transform -translate-y-1/2 transition-all ${searchFocused ? "text-blue-500" : darkMode ? "text-gray-400" : "text-gray-400"}`} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hồ sơ, sinh viên, báo cáo..."
                    className={`pl-14 pr-8 py-4 border-2 rounded-2xl transition-all duration-300 w-96 font-medium ${
                      searchFocused
                        ? "shadow-2xl border-blue-300"
                        : darkMode
                        ? "bg-gray-700/80 border-gray-600 text-gray-200 shadow-xl"
                        : "bg-white/80 border-gray-200 text-gray-800 shadow-xl"
                    }`}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </motion.div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Dark Mode */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-4 rounded-2xl transition-all duration-300 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
                >
                  <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
                    {darkMode ? <FaSun className="text-yellow-500 text-xl" aria-hidden="true" /> : <FaMoon className="text-xl" aria-hidden="true" />}
                  </motion.div>
                </button>

                {/* Notifications */}
                <motion.div className="relative" ref={notificationRef} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
                    aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
                    aria-expanded={notificationsOpen}
                  >
                    <FaBell className="text-xl" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        className={`absolute right-0 mt-3 w-96 ${darkMode ? "bg-gray-800/95 border-gray-700/30" : "bg-white/95 border-white/30"} backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-bold flex items-center gap-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                              <FaBell className="text-blue-500" />
                              Thông báo
                            </h3>
                            <span className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {unreadCount} mới
                            </span>
                          </div>
                          <div className="space-y-4 max-h-80 overflow-y-auto">
                            {notificationsLoading ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : notifications.length === 0 ? (
                              <div className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                <FaBell className="mx-auto mb-2 text-2xl opacity-50" />
                                <p className="text-sm">Không có thông báo nào</p>
                              </div>
                            ) : notifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                                  notification.unread
                                    ? darkMode ? "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50" : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                                    : darkMode ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                                }`}
                                whileHover={{ scale: 1.02, x: 4 }}
                              >
                                <div className={`w-4 h-4 ${notificationConfig[notification.type] || "bg-gray-500"} rounded-full flex-shrink-0 mt-1 animate-pulse`} />
                                <div className="flex-1 min-w-0">
                                  <h4 className={`text-sm font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{notification.title}</h4>
                                  <p className={`text-sm mb-2 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{notification.message}</p>
                                  <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{notification.time}</p>
                                </div>
                                {notification.unread && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                              </motion.div>
                            ))}
                          </div>
                          {notifications.length > 0 && (
                            <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} text-center`}>
                              <button
                                onClick={() => setNotificationsOpen(false)}
                                className={`text-sm font-medium ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                              >
                                Đóng thông báo
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Profile */}
                <motion.div className="relative" ref={profileRef} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    whileHover={{ x: 4 }}
                    aria-label="Menu hồ sơ"
                    aria-expanded={profileOpen}
                  >
                    <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      ) : null}
                      <div className={`w-full h-full items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                        {role === "admin" ? <FaCrown className="text-white text-xl" /> : <FaUserCircle className="text-white text-xl" />}
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className={`text-sm font-bold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>Xin chào, {displayName}</p>
                      <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Quản trị viên • Online</p>
                    </div>
                    <FaChevronDown className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        className={`absolute right-0 mt-3 w-80 ${darkMode ? "bg-gray-800/95 border-gray-700/30" : "bg-white/95 border-white/30"} backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl overflow-hidden">
                              {avatarUrl ? (
                                <img src={avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover"
                                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                              ) : null}
                              <div className={`w-full h-full items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                                {role === "admin" ? <FaCrown className="text-white text-xl" /> : <FaUser className="text-white text-xl" />}
                              </div>
                            </div>
                            <div>
                              <h4 className={`font-bold text-lg ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{displayName}</h4>
                              <p className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user?.email || "admin@hutech.edu.vn"}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span className="text-xs text-green-600 font-semibold">Đang hoạt động</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Link to="/admin/ho-so-quan-ly" onClick={() => setProfileOpen(false)} className="flex items-center gap-4 w-full p-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl transition-all duration-300 group">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <FaUserCog className="text-blue-500 text-lg" />
                              </div>
                              <div>
                                <span className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Hồ sơ quản lý</span>
                                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Quản lý thông tin cá nhân</p>
                              </div>
                            </Link>
                            <Link to="/admin/cai-dat" onClick={() => setProfileOpen(false)} className="flex items-center gap-4 w-full p-4 text-left hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-2xl transition-all duration-300 group">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                <FaShieldAlt className="text-purple-500 text-lg" />
                              </div>
                              <div>
                                <span className={`text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>Cài đặt</span>
                                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Cài đặt hệ thống và bảo mật</p>
                              </div>
                            </Link>
                            <hr className={`my-4 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
                            <button
                              onClick={() => { setProfileOpen(false); logout(); navigate('/accounts/dang-nhap'); }}
                              className="flex items-center gap-4 w-full p-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-300 group"
                            >
                              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                <FaSignOutAlt className="text-red-500 text-lg" />
                              </div>
                              <div>
                                <span className="text-sm font-bold">Đăng xuất</span>
                                <p className="text-xs text-red-400 font-medium">Thoát khỏi hệ thống an toàn</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Page Content */}
          <motion.main
            className="flex-1 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
