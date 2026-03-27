import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaCheckCircle, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaUserPlus, FaStar, FaShieldAlt } from "react-icons/fa";
import { Button, Input } from "../components/ui";

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
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${((i * 17 + 3) % 85) + 5}%`,
              top: `${((i * 13 + 7) % 80) + 5}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-particle-rise bg-blue-500/40 dark:bg-blue-400/30"
            style={{
              left: `${((i * 11 + 5) % 90) + 5}%`,
              top: `${((i * 7 + 13) % 85) + 5}%`,
              animationDelay: `${i * 0.25}s`,
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
        <div className="absolute inset-0 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 animate-pulse-soft" />

        <motion.form
          className="relative backdrop-blur-xl p-8 rounded-3xl shadow-2xl border bg-white/90 border-white/20 dark:bg-gray-900/80 dark:border-gray-700/50"
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
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-spin-slow">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur animate-pulse-ring" />
            </div>

            <motion.h2
              className="text-3xl font-bold mb-3 text-gray-800 dark:text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              Đăng ký tài khoản
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Tạo tài khoản mới để bắt đầu
            </motion.p>

            {/* Decorative stars */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-star-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                  <FaStar className="text-sm text-yellow-500 dark:text-yellow-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="mb-6 p-4 rounded-2xl border bg-green-100 border-green-400 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-pulse-soft">
                    <FaCheckCircle />
                  </div>
                  {success}
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                className="mb-6 p-4 rounded-2xl border bg-red-100 border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-wiggle">
                    <FaShieldAlt />
                  </div>
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
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
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
                  className="w-full transition-all duration-300 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
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
                className="w-full transition-all duration-300 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
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
                className="w-full transition-all duration-300 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
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
                  className="w-full pr-12 transition-all duration-300 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200">
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
                  className="w-full pr-12 transition-all duration-300 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
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

          {/* Links */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Đã có tài khoản?{" "}
              <Link
                to="/accounts/dang-nhap"
                className="font-semibold transition-colors hover:underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
