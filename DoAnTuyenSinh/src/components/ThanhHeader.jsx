import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FaHome,
  FaUserPlus,
  FaSearch,
  FaHandshake,
  FaQuestionCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUserEdit,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaTrophy,
  FaUserCircle,
  FaShieldAlt,
  FaCrown,
  FaUser,
  FaMoon,
  FaSun,
  FaDesktop,
} from "react-icons/fa";
import { UserContext } from "../accounts/UserContext";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { debugUserAvatar, getAvatarUrl } from "../utils/avatarUtils";

const menu = [
  { label: "Trang chủ", path: "/", icon: <FaHome /> },
  {
    label: "Đăng ký xét tuyển",
    path: "/dang-ky-xet-tuyen",
    icon: <FaUserPlus />,
  },
  { label: "Thông tin tuyển sinh", path: "/thong-tin-tuyen-sinh", icon: <FaGraduationCap /> },
  { label: "Câu hỏi thường gặp", path: "/cau-hoi-thuong-gap", icon: <FaQuestionCircle /> },
  { label: "Liên hệ", path: "/lien-he", icon: <FaEnvelope /> },
];

import { useDarkMode } from "../contexts/DarkModeContext";

// Optimized animation variants
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Reduced delay for better performance
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.5,
    },
  },
};

function ThanhHeader() {
  const location = useLocation();
  const { user, username, role, logout } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Optimized scroll effects with reduced calculations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 16]);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debug: log để kiểm tra giá trị
  console.log("ThanhHeader - User context:", { user, username, role });
  
  // Debug avatar
  useEffect(() => {
    if (user) {
      debugUserAvatar(user, "ThanhHeader");
    }
  }, [user]);

  // Fallback để hiển thị tên người dùng
  const displayName =
    username || user?.username || user?.name || user?.email || "Người dùng";

  // Xử lý URL avatar đúng cách
  const avatarUrl = getAvatarUrl(user);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/60 dark:border-gray-700/60 py-2" 
          : "bg-white/85 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border-b border-gray-200/30 dark:border-gray-700/30 py-3"
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
      }}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.img
                src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png"
                alt="Logo HUTECH"
                className={`object-contain rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft bg-white dark:bg-neutral-800 transition-all duration-300 ${
                  isScrolled ? "h-10 w-10" : "h-12 w-12"
                }`}
                style={{
                  minWidth: isScrolled ? 40 : 48,
                  minHeight: isScrolled ? 40 : 48,
                }}
                animate={{
                  scale: isScrolled ? 0.85 : 1,
                }}
                transition={{
                  scale: { duration: 0.3, ease: "easeOut" },
                }}
              />
            </motion.div>
            <motion.div
              className="flex flex-col"
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span
                className={`text-neutral-900 dark:text-neutral-100 font-bold tracking-wide transition-all duration-300 ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                HUTECH
              </span>
              <span
                className={`text-primary-600 dark:text-primary-400 font-medium transition-all duration-300 ${
                  isScrolled ? "text-xs" : "text-xs"
                }`}
              >
                Tuyển sinh 2025
              </span>
            </motion.div>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center justify-center gap-1 flex-1 max-w-4xl mx-6">
          {menu.map((item, index) => (
            <motion.div
              key={item.path || item.label}
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative"
            >
              <Link
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 text-sm relative overflow-hidden group ${
                  location.pathname === item.path
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : ""
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  layoutId="navHover"
                />
                <motion.span
                  className="text-base relative z-10"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {item.icon}
                </motion.span>
                <span className="hidden xl:block relative z-10">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}

          {/* Dropdown Tư vấn & Học bổng */}
          <motion.div
            className="relative"
            custom={5}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 text-sm relative overflow-hidden group"
              onClick={() => setShowDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <motion.span
                className="text-base relative z-10"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FaQuestionCircle />
              </motion.span>
              <span className="hidden xl:block relative z-10">
                Tư vấn & Học bổng
              </span>
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className="relative z-10"
              >
                <FaChevronDown className="ml-1 text-xs" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute left-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-600/20 z-50 overflow-hidden"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <Link
                      to="/dang-ky-tu-van"
                      className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-900 dark:hover:text-blue-100 transition-all duration-200 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <FaQuestionCircle className="text-blue-500 dark:text-blue-400" />
                      </motion.div>
                      <div>
                        <div className="font-semibold group-hover:text-blue-900 dark:group-hover:text-blue-100">
                          Đăng ký tư vấn
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Hỗ trợ tư vấn tuyển sinh
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/dang-ky-hoc-bong"
                      className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-900 dark:hover:text-blue-100 transition-all duration-200 group"
                      onClick={() => setShowDropdown(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <FaTrophy className="text-yellow-500 dark:text-yellow-400" />
                      </motion.div>
                      <div>
                        <div className="font-semibold group-hover:text-blue-900 dark:group-hover:text-blue-100">
                          Đăng ký học bổng
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Cơ hội nhận học bổng
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>

        {/* Right Section: Dark Mode + Auth */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
                          className={`p-2 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}
              style={{ 
                color: darkMode ? '#f3f4f6' : '#111827',
                WebkitTextFillColor: darkMode ? '#f3f4f6' : '#111827'
              }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            title={
              darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
            }
          >
            <motion.div
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {darkMode ? (
                <FaSun className="text-yellow-400 group-hover:text-yellow-300" />
              ) : (
                <FaMoon className="text-blue-200 group-hover:text-blue-100" />
              )}
            </motion.div>
          </motion.button>

          {user ? (
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <motion.button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                  className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10 hover:text-yellow-600 dark:hover:text-yellow-400 bg-white/10 dark:bg-white/5 backdrop-blur-sm hover:shadow-lg group relative overflow-hidden ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ 
                    color: darkMode ? '#ffffff' : '#111827',
                    WebkitTextFillColor: darkMode ? '#ffffff' : '#111827'
                  }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 overflow-hidden ${
                      role === "admin"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          console.log("Avatar failed to load:", avatarUrl);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                      {role === "admin" ? (
                        <FaCrown className="text-sm" />
                      ) : (
                        <FaUserCircle className="text-sm" />
                      )}
                    </div>
                  </div>
                  {role === "admin" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                  )}
                </motion.div>
                <div className="hidden md:block text-left relative z-10">
                                      <p 
                      className={`text-sm font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ 
                        color: darkMode ? '#ffffff' : '#111827',
                        WebkitTextFillColor: darkMode ? '#ffffff' : '#111827'
                      }}
                    >
                      Xin chào, {displayName}
                    </p>
                  {role === "admin" && (
                    <p className="text-xs text-yellow-300 dark:text-yellow-400 leading-none mt-1 flex items-center gap-1">
                      <FaShieldAlt className="text-xs" />
                      Quản trị viên
                    </p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: showUserDropdown ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring", damping: 20 }}
                  className="relative z-10"
                >
                  <FaChevronDown className="text-xs" />
                </motion.div>
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-600/20 z-50 overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden ${
                            role === "admin"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-blue-500 to-purple-500"
                          }`}
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="User Avatar"
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                console.log("Dropdown avatar failed to load:", avatarUrl);
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                            {role === "admin" ? <FaCrown /> : <FaUser />}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            {role === "admin" ? (
                              <>
                                <FaShieldAlt className="text-yellow-500" />
                                Quản trị viên
                              </>
                            ) : (
                              <>
                                <FaUser className="text-blue-500" />
                                Người dùng
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Menu Items */}
                    <div className="py-2">
                      {/* Profile Edit Link */}
                      <Link
                        to={
                          role === "admin"
                            ? "/admin/ho-so-quan-ly"
                            : "/ho-so-nguoi-dung"
                        }
                        className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-900 dark:hover:text-blue-100 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaUserEdit className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {role === "admin" ? "Hồ sơ quản lý" : "Hồ sơ người dùng"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Cập nhật thông tin cá nhân
                          </div>
                        </div>
                      </Link>

                      {/* Tra cứu kết quả Link */}
                      <Link
                        to="/tra-cuu-ket-qua"
                        className="flex items-center gap-3 px-4 py-3 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-900 dark:hover:text-purple-100 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaSearch className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">Tra cứu kết quả</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Kiểm tra kết quả xét tuyển
                          </div>
                        </div>
                      </Link>

                      {role === "admin" && (
                        <Link
                          to="/admin/tong-quan"
                          className="flex items-center gap-3 px-4 py-3 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-900 dark:hover:text-green-100 transition-all duration-200"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <FaCog className="text-sm" />
                          </div>
                          <div>
                            <div className="font-semibold">Admin Dashboard</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Quản lý hệ thống
                            </div>
                          </div>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 w-full text-left"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaSignOutAlt className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">Đăng xuất</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Thoát khỏi tài khoản
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Link
                  to="/accounts/dang-nhap"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-yellow-600 dark:hover:text-yellow-400 text-sm ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                  style={{ 
                    color: darkMode ? '#f3f4f6' : '#111827',
                    WebkitTextFillColor: darkMode ? '#f3f4f6' : '#111827'
                  }}
                >
                  <span className="text-base">
                    <FaSignInAlt />
                  </span>
                  <span className="hidden sm:block">Đăng nhập</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Link
                  to="/accounts/dang-ky"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-yellow-600 dark:hover:text-yellow-400 text-sm ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                  style={{ 
                    color: darkMode ? '#f3f4f6' : '#111827',
                    WebkitTextFillColor: darkMode ? '#f3f4f6' : '#111827'
                  }}
                >
                  <span className="text-base">
                    <FaUserEdit />
                  </span>
                  <span className="hidden sm:block">Đăng ký</span>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className={`lg:hidden p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-xl transition-all duration-200 ml-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
            style={{ 
              color: darkMode ? '#f3f4f6' : '#111827',
              WebkitTextFillColor: darkMode ? '#f3f4f6' : '#111827'
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-white/20 dark:border-gray-600/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {menu.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 dark:bg-blue-700 text-white"
                        : "text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Dropdown Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="space-y-2"
              >
                <Link
                  to="/dang-ky-tu-van"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaQuestionCircle />
                  <span>Đăng ký tư vấn</span>
                </Link>
                <Link
                  to="/dang-ky-hoc-bong"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaTrophy />
                  <span>Đăng ký học bổng</span>
                </Link>
              </motion.div>

              {/* Mobile Auth Section */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2"
                >
                  <Link
                    to={
                      role === "admin"
                        ? "/admin/ho-so-quan-ly"
                        : "/ho-so-nguoi-dung"
                    }
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserEdit />
                    <span>{role === "admin" ? "Hồ sơ quản lý" : "Hồ sơ người dùng"}</span>
                  </Link>

                  <Link
                    to="/tra-cuu-ket-qua"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaSearch />
                    <span>Tra cứu kết quả</span>
                  </Link>

                  {role === "admin" && (
                    <Link
                      to="/admin/tong-quan"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaCog />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 w-full text-left"
                  >
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default ThanhHeader;
