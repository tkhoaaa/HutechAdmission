import React, { useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaSignInAlt, FaShieldAlt, FaRocket, FaStar } from "react-icons/fa";
import { UserContext } from "./UserContext";
import { Button, Input, Card } from "../components/ui";
import { shouldShowDemoMode } from "../utils/environment";

function DangNhap() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loginDemo, user, role } = useContext(UserContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDemoLogin = () => {
    setError("");
    setSuccess("");
    loginDemo();
    setSuccess("Đăng nhập Demo thành công!");
    setTimeout(() => {
      navigate("/admin");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        identifier: form.identifier,
        password: form.password,
      });

      // Lấy thông tin user từ response
      if (res.data.success) {
        const user = res.data.data.user;
        const role = user.role;
        const username = user.full_name || user.username || user.email;

        // Sử dụng thông tin user từ login response trực tiếp
        // Không cần gọi API profile riêng vì có thể endpoint chưa được implement
        login(user.id, role, username, user);

        setSuccess("Đăng nhập thành công!");
        if (role === "admin") {
          setSuccess("Đăng nhập admin thành công! Đang chuyển hướng...");
          setTimeout(() => {
            navigate("/admin/tong-quan");
          }, 1000);
        } else {
          setSuccess("Đăng nhập user thành công! Đang chuyển hướng...");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else {
        throw new Error(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      // Hiển thị lỗi chi tiết hơn
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        setError(err.response.data.errors.map((e) => e.msg).join(" | "));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
        );
      } else {
        setError("Đăng nhập thất bại! Sai tài khoản hoặc mật khẩu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center relative overflow-hidden dark:bg-gradient-to-br dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full dark:bg-gradient-to-r dark:from-indigo-500/10 dark:to-purple-500/10 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 animate-float"
            style={{
              width: `${50 + i * 15}px`,
              height: `${50 + i * 15}px`,
              left: `${((i * 7 + 5) % 85) + 5}%`,
              top: `${((i * 11 + 13) % 75) + 10}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${6 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating login icons */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute dark:text-indigo-400/30 text-indigo-500/40 animate-particle-rise"
            style={{
              left: `${((i * 19 + 10) % 80) + 5}%`,
              top: `${((i * 13 + 20) % 70) + 15}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + i * 0.4}s`,
            }}
          >
            <FaSignInAlt className="text-lg" />
          </div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 rounded-3xl blur-xl opacity-30 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-soft"
        />

        <motion.form
          className="relative backdrop-blur-xl p-8 rounded-3xl shadow-2xl border dark:bg-gray-900/85 dark:border-indigo-700/50 bg-white/95 border-indigo-200/50"
          onSubmit={handleSubmit}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-spin-slow">
                <FaSignInAlt className="text-white text-2xl" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur animate-pulse-ring" />
            </div>

            <motion.h2
              className="text-3xl font-bold mb-3 dark:text-white text-gray-800"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              Đăng nhập
            </motion.h2>

            <motion.p
              className="text-lg dark:text-gray-300 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Chào mừng bạn quay trở lại!
            </motion.p>

            {/* Decorative stars */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-star-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  <FaStar className="text-sm dark:text-indigo-400 text-indigo-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status messages */}
          <AnimatePresence>
            {user && (
              <motion.div
                key="user-logged-in"
                className="mb-6 p-4 rounded-2xl border dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 bg-green-100 border-green-400 text-green-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-pulse-soft">
                    <FaUser />
                  </div>
                  <div>
                    Đã đăng nhập với tài khoản: {user.email}
                    <br />
                    Vai trò: {role}
                  </div>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success-message"
                className="mb-6 p-4 rounded-2xl border dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 bg-green-100 border-green-400 text-green-700"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <div className="animate-pulse-soft">
                    <FaRocket />
                  </div>
                  {success}
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error-message"
                className="mb-6 p-4 rounded-2xl border dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 bg-red-100 border-red-400 text-red-700"
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
              <label className="block text-sm font-semibold mb-3 dark:text-gray-200 text-gray-700">
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative group">
                <Input
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="Nhập email hoặc tên đăng nhập"
                  icon={FaEnvelope}
                  required
                  className={`w-full transition-all duration-300 ${
                    "dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label className="block text-sm font-semibold mb-3 dark:text-gray-200 text-gray-700">
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
                    "dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors hover:scale-110 active:scale-95 ${
                    "dark:text-gray-400 dark:hover:text-gray-200 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Submit button */}
          <div
            className="mt-8 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>

            {/* Demo Login Button - Only show on Vercel deployment */}
            {shouldShowDemoMode() && (
              <>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t dark:border-gray-600 border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 dark:bg-gray-900 dark:text-gray-400 bg-white text-gray-500">hoặc</span>
                  </div>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className={`w-full text-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    "dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400/10 border-amber-300 text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  Xem Demo Admin Dashboard
                </Button>

                <motion.p
                  className="text-xs text-center mt-2 dark:text-gray-400 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  * Demo mode dành cho Vercel deployment (không cần backend)
                </motion.p>
              </>
            )}
          </div>

          {/* Links */}
          <motion.div
            className="mt-6 text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <p className="text-sm dark:text-gray-300 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/accounts/dang-ky"
                className="font-semibold transition-colors hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 text-indigo-600 hover:text-indigo-800"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p className="text-sm dark:text-gray-300 text-gray-600">
              <Link
                to="/accounts/quen-mat-khau"
                className="font-semibold transition-colors hover:underline dark:text-indigo-400 dark:hover:text-indigo-300 text-indigo-600 hover:text-indigo-800"
              >
                Quên mật khẩu?
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

export default DangNhap;
