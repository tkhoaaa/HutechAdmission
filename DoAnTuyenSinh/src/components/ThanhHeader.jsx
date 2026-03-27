import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import { UserContext } from "../accounts/UserContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { getAvatarUrl } from "../utils/avatarUtils";

const menu = [
  { label: "Trang chủ", path: "/", icon: <FaHome /> },
  { label: "Đăng ký xét tuyển", path: "/dang-ky-xet-tuyen", icon: <FaUserPlus /> },
  { label: "Thông tin tuyển sinh", path: "/thong-tin-tuyen-sinh", icon: <FaGraduationCap /> },
  { label: "Câu hỏi thường gặp", path: "/cau-hoi-thuong-gap", icon: <FaQuestionCircle /> },
  { label: "Liên hệ", path: "/lien-he", icon: <FaEnvelope /> },
];

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
  }),
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
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

  const displayName =
    username || user?.username || user?.name || user?.email || "Người dùng";
  const avatarUrl = getAvatarUrl(user);

  const navLinkClass = (itemPath) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm relative overflow-hidden group ${
      location.pathname === itemPath
        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    }`;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/60 dark:border-gray-700/60 py-2"
          : "bg-white/85 dark:bg-gray-900/70 backdrop-blur-lg shadow-lg border-b border-gray-200/30 dark:border-gray-700/30 py-3"
      }`}
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
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png"
                alt="Logo HUTECH"
                className={`object-contain rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft bg-white dark:bg-neutral-800 transition-all duration-300 ${
                  isScrolled ? "h-10 w-10" : "h-12 w-12"
                }`}
                style={{ minWidth: isScrolled ? 40 : 48, minHeight: isScrolled ? 40 : 48 }}
              />
            </motion.div>
            <motion.div className="flex flex-col" animate={{ scale: isScrolled ? 0.9 : 1 }} transition={{ duration: 0.3 }}>
              <span className={`font-bold tracking-wide transition-all duration-300 ${
                isScrolled ? "text-lg" : "text-xl"
              } text-gray-900 dark:text-gray-100`}>
                HUTECH
              </span>
              <span className="text-xs font-medium text-primary dark:text-primary">
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
              <Link to={item.path} className={navLinkClass(item.path)}>
                <span className="text-base">{item.icon}</span>
                <span className="hidden xl:block">{item.label}</span>
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              aria-label="Tư vấn và Học bổng"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <FaQuestionCircle className="text-base" />
              <span className="hidden xl:block">Tư vấn & Học bổng</span>
              <motion.div animate={{ rotate: showDropdown ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FaChevronDown className="ml-1 text-xs" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="absolute left-0 mt-2 w-64 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border dark:border-border z-50 overflow-hidden"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Link
                    to="/dang-ky-tu-van"
                    className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200 group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaQuestionCircle className="text-blue-500 dark:text-blue-400" />
                    <div>
                      <div className="font-semibold group-hover:text-blue-900 dark:group-hover:text-blue-100">Đăng ký tư vấn</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Hỗ trợ tư vấn tuyển sinh</div>
                    </div>
                  </Link>
                  <Link
                    to="/dang-ky-hoc-bong"
                    className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200 group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaTrophy className="text-yellow-500 dark:text-yellow-400" />
                    <div>
                      <div className="font-semibold group-hover:text-blue-900 dark:group-hover:text-blue-100">Đăng ký học bổng</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Cơ hội nhận học bổng</div>
                    </div>
                  </Link>
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
            className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            title={darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          >
            <motion.div animate={{ rotate: darkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-blue-200" />
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
                className="flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                aria-label="Menu tài khoản"
                aria-expanded={showUserDropdown}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden ${
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
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                    {role === "admin" ? <FaCrown className="text-sm" /> : <FaUserCircle className="text-sm" />}
                  </div>
                </div>
                {role === "admin" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold leading-none text-gray-900 dark:text-gray-100">
                    Xin chào, {displayName}
                  </p>
                  {role === "admin" && (
                    <p className="text-xs text-yellow-300 dark:text-yellow-400 leading-none mt-1 flex items-center gap-1">
                      <FaShieldAlt className="text-xs" />
                      Quản trị viên
                    </p>
                  )}
                </div>
                <motion.div animate={{ rotate: showUserDropdown ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FaChevronDown className="text-xs text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border dark:border-border z-50 overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="px-4 py-3 bg-blue-50 dark:bg-gray-800 border-b border-border dark:border-border">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                          role === "admin" ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                        }`}>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="User Avatar" className="w-full h-full rounded-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${avatarUrl ? 'hidden' : 'flex'}`}>
                            {role === "admin" ? <FaCrown /> : <FaUser />}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{displayName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            {role === "admin" ? <><FaShieldAlt className="text-yellow-500" />Quản trị viên</> : <><FaUser className="text-blue-500" />Người dùng</>}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to={role === "admin" ? "/admin/ho-so-quan-ly" : "/ho-so-nguoi-dung"}
                        className="flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaUserEdit className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">{role === "admin" ? "Hồ sơ quản lý" : "Hồ sơ người dùng"}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Cập nhật thông tin cá nhân</div>
                        </div>
                      </Link>
                      <Link
                        to="/tra-cuu-ket-qua"
                        className="flex items-center gap-3 px-4 py-3 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaSearch className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">Tra cứu kết quả</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Kiểm tra kết quả xét tuyển</div>
                        </div>
                      </Link>
                      {role === "admin" && (
                        <Link
                          to="/admin/tong-quan"
                          className="flex items-center gap-3 px-4 py-3 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <FaCog className="text-sm" />
                          </div>
                          <div>
                            <div className="font-semibold">Admin Dashboard</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Quản lý hệ thống</div>
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 w-full text-left"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                          <FaSignOutAlt className="text-sm" />
                        </div>
                        <div>
                          <div className="font-semibold">Đăng xuất</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Thoát khỏi tài khoản</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.3 }}>
                <Link
                  to="/accounts/dang-nhap"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <FaSignInAlt className="text-base" />
                  <span className="hidden sm:block">Đăng nhập</span>
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.3 }}>
                <Link
                  to="/accounts/dang-ky"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                  <FaUserEdit className="text-base" />
                  <span className="hidden sm:block">Đăng ký</span>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className={`lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 ml-2 text-gray-900 dark:text-gray-100`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-background dark:bg-card border-t border-border dark:border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {menu.map((item) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.3 }} className="space-y-2">
                <Link to="/dang-ky-tu-van" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  <FaQuestionCircle /><span>Đăng ký tư vấn</span>
                </Link>
                <Link to="/dang-ky-hoc-bong" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  <FaTrophy /><span>Đăng ký học bổng</span>
                </Link>
              </motion.div>
              {user && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.3 }} className="border-t border-border dark:border-border pt-4 space-y-2">
                  <Link to={role === "admin" ? "/admin/ho-so-quan-ly" : "/ho-so-nguoi-dung"} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                    <FaUserEdit /><span>{role === "admin" ? "Hồ sơ quản lý" : "Hồ sơ người dùng"}</span>
                  </Link>
                  <Link to="/tra-cuu-ket-qua" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                    <FaSearch /><span>Tra cứu kết quả</span>
                  </Link>
                  {role === "admin" && (
                    <Link to="/admin/tong-quan" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                      <FaCog /><span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-all duration-200 w-full text-left">
                    <FaSignOutAlt /><span>Đăng xuất</span>
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
