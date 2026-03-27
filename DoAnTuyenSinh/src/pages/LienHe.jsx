import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaUser,
  FaComments,
  FaHeart,
  FaStar,
  FaRocket,
  FaGlobe,
  FaHeadset,
  FaCheckCircle,
  FaBuilding,
  FaUsers,
  FaAward,
  FaSpinner,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

// Entrance animation variants (no infinite loops)
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  }
};

// Static particle data (deterministic, no Math.random)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  delay: ((i * 17 + 3) % 50) / 10,
  size: ["small", "medium", "large"][i % 3]
}));

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: "Địa chỉ",
    content: "475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: FaPhone,
    title: "Điện thoại",
    content: "028.5445.7777",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: FaEnvelope,
    title: "Email",
    content: "tuyensinh@hutech.edu.vn",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: FaClock,
    title: "Giờ làm việc",
    content: "Thứ 2 - Thứ 6: 7:30 - 17:00",
    color: "from-purple-500 to-pink-500"
  },
];

const socialLinks = [
  {
    icon: FaFacebook,
    name: "Facebook",
    url: "https://facebook.com/hutech.edu.vn",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: FaYoutube,
    name: "YouTube",
    url: "https://www.youtube.com/@hutechuniversity",
    color: "from-red-600 to-red-700",
  },
  {
    icon: FaInstagram,
    name: "Instagram",
    url: "https://www.instagram.com/hutechuniversity/",
    color: "from-pink-600 to-purple-600",
  },
  {
    icon: FaLinkedin,
    name: "LinkedIn",
    url: "https://linkedin.com/company/hutech",
    color: "from-blue-700 to-blue-800",
  },
];

function LienHe() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    setTimeout(() => {
      setSuccess(
        "Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
      );
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <SEO
        title="Liên hệ - HUTECH"
        description="Liên hệ với HUTECH để được tư vấn tuyển sinh, hỗ trợ thông tin và giải đáp thắc mắc."
        keywords="liên hệ HUTECH, tư vấn tuyển sinh, hỗ trợ sinh viên, thông tin liên hệ"
        canonical="/lien-he"
      />

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-all duration-500">
        {/* Animated background particles - CSS-driven */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full animate-particle-rise ${
                particle.size === "small" ? "w-1 h-1" : particle.size === "medium" ? "w-2 h-2" : "w-3 h-3"
              } bg-blue-500/10 dark:bg-blue-400/20`}
              style={{
                left: `${((particle.id * 7 + 5) % 90) + 5}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${3 + (particle.id * 0.3) % 3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes - CSS-driven */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200/20 dark:bg-blue-500/5 animate-float" />
          <div className="absolute top-60 right-20 w-32 h-32 rounded-full bg-purple-200/20 dark:bg-purple-500/5 animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-40 left-1/3 w-24 h-24 rounded-full bg-emerald-200/20 dark:bg-emerald-500/5 animate-float" style={{ animationDelay: "3s" }} />
        </div>

        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={ANIMATION_VARIANTS.container}
          className="relative py-20 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center">
              {/* Animated icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 relative bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 shadow-2xl animate-float-slow">
                <FaEnvelope className="text-4xl text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-pulse" />
              </div>

              {/* Support badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 shadow-lg"
              >
                <div className="animate-pulse">
                  <FaHeadset className="text-emerald-500" />
                </div>
                <span className="font-semibold">Hỗ trợ 24/7</span>
                <FaStar className="text-yellow-500" />
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Liên hệ với chúng tôi
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 text-gray-600 dark:text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn mọi lúc, mọi nơi với tất cả sự nhiệt tình
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  { icon: FaBuilding, number: "4", label: "Cơ sở" },
                  { icon: FaUsers, number: "24/7", label: "Hỗ trợ" },
                  { icon: FaAward, number: "100%", label: "Tận tâm" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 backdrop-blur-sm shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    animate={index === 1 ? { scale: [1, 1.05, 1] } : {}}
                    transition={index === 1 ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                  >
                    <stat.icon className="text-blue-500 text-xl" />
                    <div>
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Thông tin liên hệ
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Hãy liên hệ với chúng tôi qua các kênh sau để được hỗ trợ tốt nhất
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={ANIMATION_VARIANTS.item}
                  className="group"
                >
                  <div className="h-full rounded-xl bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-8 text-center relative">
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${info.color} opacity-10 rounded-lg animate-pulse-glow`}
                      />

                      <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 shadow-lg animate-float-slow">
                        <info.icon className="text-2xl text-white" />
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                        {info.title}
                      </h3>
                      <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                        {info.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Theo dõi chúng tôi
              </h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl overflow-hidden group hover:scale-110 hover:-translate-y-1 transition-all duration-200"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color}`} />
                    <div
                      className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"
                    />
                    <social.icon className="text-2xl relative z-10" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Hãy để lại thông tin và tin nhắn của bạn, chúng tôi sẽ phản hồi trong thời gian sớm nhất
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="rounded-xl bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
                <div className="p-12">
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        className="mb-8 p-6 rounded-xl border flex items-center gap-3 bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300"
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      >
                        <FaCheckCircle className="text-2xl" />
                        <span className="font-semibold">{success}</span>
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        className="mb-8 p-6 rounded-xl border bg-red-100 border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Input
                          label="Họ và tên"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên"
                          leftIcon={<FaUser className="text-blue-500" />}
                          required
                          size="lg"
                          className="text-lg"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Nhập email"
                          leftIcon={<FaEnvelope className="text-purple-500" />}
                          required
                          size="lg"
                          className="text-lg"
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        <Input
                          label="Số điện thoại"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          leftIcon={<FaPhone className="text-green-500" />}
                          size="lg"
                          className="text-lg"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <Input
                          label="Chủ đề"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Nhập chủ đề"
                          leftIcon={<FaComments className="text-orange-500" />}
                          required
                          size="lg"
                          className="text-lg"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                        Tin nhắn
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Nhập nội dung tin nhắn..."
                        required
                        rows="6"
                        className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-lg bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-center"
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl px-12 py-4 shadow-xl hover:shadow-2xl transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="text-xl animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-xl" />
                            Gửi tin nhắn
                          </>
                        )}
                      </button>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Map Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Vị trí của chúng tôi
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Ghé thăm cơ sở chính của HUTECH tại TP.HCM
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="rounded-xl bg-white/10 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.484123456789!2d106.709123456789!3d10.80123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e640d01%3A0xf89fba644b4c0b8!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBIdXRlY2g!5e0!3m2!1svi!2s!4v1234567890"
                    width="100%"
                    height="500"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white shadow-2xl rounded-xl overflow-hidden">
              <div className="relative p-12 text-center">
                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full animate-float" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 animate-float-slow">
                    <FaHeart className="text-4xl text-red-300" />
                  </div>

                  <h2 className="text-4xl font-bold mb-4">
                    Sẵn sàng bắt đầu hành trình?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn chi tiết về các chương trình đào tạo
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                      href="tel:02854457777"
                      className="inline-flex items-center justify-center gap-2 bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl rounded-lg px-8 py-4 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <FaPhone />
                      Gọi ngay: 028.5445.7777
                    </a>
                    <Button
                      variant="outline"
                      size="lg"
                      className="inline-flex items-center justify-center gap-2 bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl text-lg px-8 py-4 dark:border-white/30 dark:bg-white/20 dark:text-white"
                    >
                      <FaGlobe />
                      Tham quan cơ sở
                    </Button>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 text-white/80 animate-pulse">
                    <FaStar className="text-yellow-300" />
                    <span>Tư vấn miễn phí - Hỗ trợ tận tâm</span>
                    <FaStar className="text-yellow-300" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}

export default LienHe;
