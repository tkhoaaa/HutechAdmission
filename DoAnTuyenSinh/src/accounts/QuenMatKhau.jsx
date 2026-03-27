import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaRocket,
  FaMagic,
  FaStar,
  FaKey
} from "react-icons/fa";

function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    setTimeout(() => {
      setSuccess("Email xác nhận đã được gửi! Vui lòng kiểm tra hộp thư của bạn.");
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuccess("Mật khẩu đã được đặt lại thành công!");
      setLoading(false);
    }, 1500);
  };

  const getStepIcon = (stepNumber) => {
    return stepNumber === 1 ? FaEnvelope : FaLock;
  };

  const getStepTitle = (stepNumber) => {
    return stepNumber === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu";
  };

  const getStepDescription = (stepNumber) => {
    return stepNumber === 1
      ? "Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu"
      : "Nhập mật khẩu mới cho tài khoản của bạn";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Floating background circles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/10 dark:to-pink-500/10"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${5 + i * 8}%`,
              top: `${10 + i * 7}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating key particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-purple-500/40 dark:text-purple-400/30 animate-particle-rise"
            style={{
              left: `${((i * 17 + 7) % 85) + 5}%`,
              top: `${((i * 13 + 11) % 80) + 5}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i % 4) * 0.5}s`,
            }}
          >
            <FaKey className="text-lg" />
          </div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-spin-slower">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur animate-pulse-ring" />
            {/* Floating mini stars */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute text-purple-600 dark:text-purple-300 animate-star-pulse"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <FaStar className="text-xs" />
              </div>
            ))}
          </div>

          <motion.h1
            className="text-3xl font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            {getStepTitle(step)}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getStepDescription(step)}
          </motion.p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-xl transition-all duration-300 ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                {step >= stepNumber ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {React.createElement(getStepIcon(stepNumber))}
                  </motion.div>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 2 && (
                <motion.div
                  className={`w-20 h-2 mx-3 rounded-full transition-all duration-500 ${
                    step > stepNumber
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  animate={{
                    scaleX: step > stepNumber ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          className="backdrop-blur-xl rounded-3xl shadow-2xl border p-8 relative overflow-hidden bg-white/90 dark:bg-gray-900/85 border-purple-200/50 dark:border-purple-700/50"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          {/* Animated shine effect on hover */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer-cta pointer-events-none" />
          </div>

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <FaEnvelope className="text-purple-500 dark:text-purple-400" />
                      Email đăng ký
                    </label>
                    <div className="relative group">
                      <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-4 pl-12 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500"
                        placeholder="Nhập email của bạn"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors duration-300" />
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {loading ? (
                      <div className="animate-spin">
                        <FaSpinner className="text-white" />
                      </div>
                    ) : (
                      <>
                        <FaRocket />
                        Gửi yêu cầu
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <FaLock className="text-purple-500 dark:text-purple-400" />
                      Mật khẩu mới
                    </label>
                    <div className="relative group">
                      <motion.input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500"
                        placeholder="Nhập mật khẩu mới"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors duration-300" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <FaLock className="text-purple-500 dark:text-purple-400" />
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative group">
                      <motion.input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-4 pl-12 pr-12 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-white/70 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500"
                        placeholder="Nhập lại mật khẩu mới"
                        whileFocus={{ scale: 1.02 }}
                      />
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors duration-300" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {loading ? (
                      <div className="animate-spin">
                        <FaSpinner className="text-white" />
                      </div>
                    ) : (
                      <>
                        <FaMagic />
                        Đặt lại mật khẩu
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Back Button for Step 2 */}
            {step === 2 && (
              <motion.button
                onClick={() => setStep(1)}
                className="w-full mt-4 py-3 font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FaArrowLeft />
                Quay lại
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="mt-6 p-4 rounded-2xl shadow-lg border bg-gradient-to-r from-green-100 to-emerald-100 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 text-green-800"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="animate-pulse-soft">
                  <FaCheckCircle className="text-green-600 dark:text-green-400" />
                </div>
                <p className="font-semibold">{success}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="mt-6 p-4 rounded-2xl shadow-lg border bg-gradient-to-r from-red-100 to-pink-100 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 text-red-800"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="animate-wiggle">
                  <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                </div>
                <p className="font-semibold">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Đã có tài khoản?{" "}
            <a
              href="/accounts/dang-nhap"
              className="font-semibold underline transition-colors text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Đăng nhập ngay
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default QuenMatKhau;
