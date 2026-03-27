import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaCheckCircle, FaEnvelope, FaPhone, FaCrown, FaShieldAlt, FaStar, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDarkMode } from "../contexts/DarkModeContext";

function DangKyTaiKhoanAdmin() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { darkMode } = useDarkMode();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }
    if (!form.phone) {
      setError("Số điện thoại không được để trống!");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post("http://localhost:3001/api/auth/register-admin", {
        email: form.email,
        password: form.password,
        username: form.username,
        phone: form.phone
      });
      setSuccess("Đăng ký thành công!");
      setError("");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        setError(errors.map(e => e.msg).join(' | '));
      } else {
        setError(
          err.response?.data?.message ||
          "Đăng ký thất bại!"
        );
      }
      setSuccess("");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-yellow-900 to-orange-900' 
          : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              darkMode 
                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' 
                : 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
            }`}
            style={{
              width: `${80 + i * 25}px`,
              height: `${80 + i * 25}px`,
              left: `${((i * 7 + 5) % 85) + 5}%`,
              top: `${((i * 11 + 13) % 75) + 10}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Crown particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              darkMode ? 'text-yellow-400/40' : 'text-yellow-500/50'
            }`}
            style={{
              left: `${((i * 13 + 7) % 85) + 5}%`,
              top: `${((i * 17 + 11) % 75) + 10}%`,
            }}
            animate={{
              y: [-30, -120],
              opacity: [0, 1, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <FaCrown className="text-lg" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Background decoration */}
        <motion.div 
          className={`absolute inset-0 rounded-3xl blur-xl opacity-40 ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
              : 'bg-gradient-to-r from-yellow-500 to-orange-500'
          }`}
          animate={{ 
            scale: [1, 1.08, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.form
          className={`relative backdrop-blur-xl p-8 rounded-3xl shadow-2xl border ${
            darkMode 
              ? 'bg-gray-900/85 border-yellow-700/50' 
              : 'bg-white/95 border-yellow-200/50'
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="relative w-24 h-24 mx-auto mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-full h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <FaCrown className="text-white text-3xl" />
              </motion.div>
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-20 blur"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              {/* Floating mini crowns */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute text-yellow-400 ${
                    darkMode ? 'text-yellow-300' : 'text-yellow-600'
                  }`}
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${10 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <FaStar className="text-xs" />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.h2 
              className={`text-3xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              Đăng ký tài khoản quản lý
            </motion.h2>
            
            <motion.p 
              className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Tạo tài khoản quản trị viên
            </motion.p>

            {/* Admin badge */}
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 ${
                darkMode 
                  ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
            >
              <FaShieldAlt className="text-sm" />
              <span className="text-sm font-semibold">Quyền quản trị</span>
            </motion.div>
          </motion.div>

          {/* Status messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                className={`mb-6 p-4 rounded-2xl border ${
                  darkMode 
                    ? 'bg-green-900/50 border-green-700 text-green-300' 
                    : 'bg-green-100 border-green-400 text-green-700'
                }`}
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaCheckCircle />
                  </motion.div>
                  {success}
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                className={`mb-6 p-4 rounded-2xl border ${
                  darkMode 
                    ? 'bg-red-900/50 border-red-700 text-red-300' 
                    : 'bg-red-100 border-red-400 text-red-700'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaShieldAlt />
                  </motion.div>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form fields */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className={`block font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FaUser className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                Tên đăng nhập
              </label>
              <motion.input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
                    : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-yellow-500'
                }`}
                placeholder="Nhập tên đăng nhập"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className={`block font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FaEnvelope className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                Email
              </label>
              <motion.input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
                    : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-yellow-500'
                }`}
                placeholder="Nhập email"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className={`block font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FaPhone className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                Số điện thoại
              </label>
              <motion.input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
                    : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-yellow-500'
                }`}
                placeholder="Nhập số điện thoại"
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className={`block font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FaLock className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                Mật khẩu
              </label>
              <div className="relative">
                <motion.input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-2xl border-2 focus:outline-none transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
                      : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-yellow-500'
                  }`}
                  placeholder="Nhập mật khẩu"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className={`block font-semibold mb-3 flex items-center gap-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                <FaCheckCircle className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <motion.input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 pr-12 rounded-2xl border-2 focus:outline-none transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
                      : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-yellow-500'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-8 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <FaCrown />
                Đăng ký quản lý
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default DangKyTaiKhoanAdmin;
