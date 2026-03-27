import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaCheckCircle, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaUserPlus, FaStar, FaShieldAlt } from "react-icons/fa";
import { Button, Input, Card } from "../components/ui";
import { useDarkMode } from "../contexts/DarkModeContext";

function DangKyTaiKhoan() {
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
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        email: form.email,
        password: form.password,
        username: form.username,
        phone: form.phone
      });
      setSuccess("Đăng ký thành công!");
      setForm({
        username: "",
        email: "",
        password: "",
        confirm: "",
        phone: ""
      });
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
    }
    setLoading(false);
  };

  return (
    <motion.div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' 
                : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
            }`}
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${((i * 17 + 3) % 85) + 5}%`,
              top: `${((i * 13 + 7) % 80) + 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              darkMode ? 'bg-blue-400/30' : 'bg-blue-500/40'
            }`}
            style={{
              left: `${((i * 11 + 5) % 90) + 5}%`,
              top: `${((i * 7 + 13) % 85) + 5}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + (i % 4) * 0.5,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Background decoration */}
        <motion.div 
          className={`absolute inset-0 rounded-3xl blur-xl opacity-30 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.form
          className={`relative backdrop-blur-xl p-8 rounded-3xl shadow-2xl border ${
            darkMode 
              ? 'bg-gray-900/80 border-gray-700/50' 
              : 'bg-white/90 border-white/20'
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
              className="relative w-20 h-20 mx-auto mb-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FaUserPlus className="text-white text-2xl" />
              </motion.div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.h2 
              className={`text-3xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              Đăng ký tài khoản
            </motion.h2>
            
            <motion.p 
              className={`text-lg ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Tạo tài khoản mới để bắt đầu
            </motion.p>

            {/* Decorative stars */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  <FaStar className={`text-sm ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                </motion.div>
              ))}
            </div>
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
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label className={`block text-sm font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Tên đăng nhập
              </label>
              <div className="relative group">
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  icon={FaUser}
                  required
                  className={`w-full transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label className={`block text-sm font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhập email"
                icon={FaEnvelope}
                required
                className={`w-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500'
                }`}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label className={`block text-sm font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Số điện thoại
              </label>
              <Input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                icon={FaPhone}
                required
                className={`w-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500'
                }`}
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label className={`block text-sm font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  icon={FaLock}
                  required
                  className={`w-full pr-12 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
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
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <label className={`block text-sm font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  icon={FaCheckCircle}
                  required
                  className={`w-full pr-12 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500'
                  }`}
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
                  {showConfirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Submit button */}
          <motion.div
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                disabled={loading}
                className="w-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Links */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Đã có tài khoản?{" "}
              <Link
                to="/accounts/dang-nhap"
                className={`font-semibold transition-colors hover:underline ${
                  darkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Đăng nhập ngay
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default DangKyTaiKhoan; 
