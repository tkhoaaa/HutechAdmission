import React, { useState, useEffect } from "react";
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
  FaMoon,
  FaSun,
  FaBuilding,
  FaUsers,
  FaAward
} from "react-icons/fa";
import { useDarkMode } from "../contexts/DarkModeContext";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

// Enhanced animation variants
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
  },
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  shimmer: {
    x: ["-100%", "100%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },
  glow: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 40px rgba(59, 130, 246, 0.5)",
      "0 0 20px rgba(59, 130, 246, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating particle component
const FloatingParticle = ({ delay = 0, size = "small", index = 0 }) => {
  const { darkMode } = useDarkMode();

  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };

  const xPos = ((index * 7 + 5) % 90) + 5;
  const yPos = ((index * 11 + 13) % 80) + 10;
  const duration = 3 + (index * 0.3) % 3;

  return (
    <motion.div
      className={`absolute rounded-full ${sizeClasses[size]} ${
        darkMode ? 'bg-blue-400/20' : 'bg-blue-500/10'
      }`}
      initial={{
        x: xPos,
        y: yPos + 10,
        opacity: 0
      }}
      animate={{
        y: -10,
        opacity: [0, 1, 0],
        scale: [0, 1, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: "Địa chỉ",
    content: "475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM",
    color: "from-red-500 to-pink-500",
    darkColor: "from-red-600 to-pink-600"
  },
  {
    icon: FaPhone,
    title: "Điện thoại",
    content: "028.5445.7777",
    color: "from-green-500 to-emerald-500",
    darkColor: "from-green-600 to-emerald-600"
  },
  {
    icon: FaEnvelope,
    title: "Email",
    content: "tuyensinh@hutech.edu.vn",
    color: "from-blue-500 to-indigo-500",
    darkColor: "from-blue-600 to-indigo-600"
  },
  {
    icon: FaClock,
    title: "Giờ làm việc",
    content: "Thứ 2 - Thứ 6: 7:30 - 17:00",
    color: "from-purple-500 to-pink-500",
    darkColor: "from-purple-600 to-pink-600"
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
  const { darkMode, toggleDarkMode } = useDarkMode();
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
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      size: ["small", "medium", "large"][Math.floor(Math.random() * 3)]
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Simulate form submission
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

      <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <FloatingParticle
              key={particle.id}
              delay={particle.delay}
              size={particle.size}
              index={i}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute top-20 left-10 w-40 h-40 rounded-full ${
              darkMode ? 'bg-blue-500/5' : 'bg-blue-200/20'
            }`}
            animate={ANIMATION_VARIANTS.float}
          />
          <motion.div
            className={`absolute top-60 right-20 w-32 h-32 rounded-full ${
              darkMode ? 'bg-purple-500/5' : 'bg-purple-200/20'
            }`}
            animate={{
              ...ANIMATION_VARIANTS.float,
              transition: { ...ANIMATION_VARIANTS.float.transition, delay: 1.5 }
            }}
          />
          <motion.div
            className={`absolute bottom-40 left-1/3 w-24 h-24 rounded-full ${
              darkMode ? 'bg-emerald-500/5' : 'bg-emerald-200/20'
            }`}
            animate={{
              ...ANIMATION_VARIANTS.float,
              transition: { ...ANIMATION_VARIANTS.float.transition, delay: 3 }
            }}
          />
        </div>

        {/* Enhanced Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={ANIMATION_VARIANTS.container}
          className="relative py-20 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div variants={ANIMATION_VARIANTS.item} className="text-center">
              {/* Animated icon */}
              <motion.div 
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 relative ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                } shadow-2xl`}
                animate={ANIMATION_VARIANTS.pulse}
              >
                <FaEnvelope className="text-4xl text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
                  animate={ANIMATION_VARIANTS.pulse}
                />
              </motion.div>

              {/* Support badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 ${
                  darkMode 
                    ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700' 
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                } shadow-lg`}
              >
                <motion.div animate={ANIMATION_VARIANTS.pulse}>
                  <FaHeadset className="text-emerald-500" />
                </motion.div>
                <span className="font-semibold">Hỗ trợ 24/7</span>
                <FaStar className="text-yellow-500" />
              </motion.div>

              {/* Main title */}
              <motion.h1 
                className={`text-5xl md:text-7xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
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
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 ${
                  darkMode ? 'text-gray-100' : 'text-gray-600'
                }`}
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
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl ${
                      darkMode 
                        ? 'bg-gray-800/50 border border-gray-700' 
                        : 'bg-white/80 border border-gray-200'
                    } backdrop-blur-sm shadow-lg`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    animate={index === 1 ? ANIMATION_VARIANTS.pulse : {}}
                  >
                    <stat.icon className="text-blue-500 text-xl" />
                    <div>
                      <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.number}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className={`p-4 rounded-full transition-all duration-300 ${
                  darkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                } shadow-lg hover:shadow-xl`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
              >
                <motion.div
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {darkMode ? <FaSun className="text-2xl" /> : <FaMoon className="text-2xl" />}
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Contact Info */}
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
              <h2 className={`text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Thông tin liên hệ
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
                  <Card 
                    variant="glass" 
                    className="h-full backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
                    hover={true}
                    shimmer={true}
                  >
                    <Card.Content className="p-8 text-center relative">
                      {/* Gradient background */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${
                          darkMode ? info.darkColor : info.color
                        } opacity-10 rounded-lg`}
                        animate={ANIMATION_VARIANTS.glow}
                      />
                      
                      <motion.div
                        className={`relative z-10 w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center bg-gradient-to-r ${
                          darkMode ? info.darkColor : info.color
                        } shadow-lg`}
                        animate={ANIMATION_VARIANTS.pulse}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <info.icon className="text-2xl text-white" />
                      </motion.div>

                      <h3 className={`text-xl font-bold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {info.title}
                      </h3>
                      <p className={`leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {info.content}
                      </p>
                    </Card.Content>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Social Media */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-16"
            >
              <h3 className={`text-3xl font-bold mb-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Theo dõi chúng tôi
              </h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl overflow-hidden group`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color}`} />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <social.icon className="text-2xl relative z-10" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Contact Form */}
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
              <h2 className={`text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className={`text-xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Hãy để lại thông tin và tin nhắn của bạn, chúng tôi sẽ phản hồi trong thời gian sớm nhất
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card 
                variant="glass" 
                className="backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl"
                hover={true}
                shimmer={true}
              >
                <Card.Content className="p-12">
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        className={`mb-8 p-6 rounded-xl border ${
                          darkMode 
                            ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300' 
                            : 'bg-emerald-100 border-emerald-400 text-emerald-700'
                        } flex items-center gap-3`}
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
                        className={`mb-8 p-6 rounded-xl border ${
                          darkMode 
                            ? 'bg-red-900/30 border-red-700 text-red-300' 
                            : 'bg-red-100 border-red-400 text-red-700'
                        }`}
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
                      <label className={`block text-lg font-semibold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Tin nhắn
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Nhập nội dung tin nhắn..."
                        required
                        rows="6"
                        className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 text-lg ${
                          darkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="text-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={loading}
                          leftIcon={loading ? <FaRocket className="animate-spin" /> : <FaPaperPlane />}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl px-12 py-4 shadow-xl hover:shadow-2xl"
                        >
                          {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Map Section */}
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
              <h2 className={`text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Vị trí của chúng tôi
              </h2>
              <p className={`text-xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Ghé thăm cơ sở chính của HUTECH tại TP.HCM
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Card 
                variant="glass" 
                className="backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
                hover={true}
              >
                <Card.Content className="p-0">
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
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced CTA Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card 
              variant="gradient" 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white shadow-2xl overflow-hidden"
            >
              <Card.Content className="relative p-12 text-center">
                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full"
                    animate={ANIMATION_VARIANTS.float}
                  />
                  <motion.div
                    className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full"
                    animate={{
                      ...ANIMATION_VARIANTS.float,
                      transition: { ...ANIMATION_VARIANTS.float.transition, delay: 1 }
                    }}
                  />
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
                  className="relative z-10"
                >
                  <motion.div
                    animate={ANIMATION_VARIANTS.pulse}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
                  >
                    <FaHeart className="text-4xl text-red-300" />
                  </motion.div>

                  <h2 className="text-4xl font-bold mb-4">
                    Sẵn sàng bắt đầu hành trình?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn chi tiết về các chương trình đào tạo
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaPhone />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
                      >
                        Gọi ngay: 028.5445.7777
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaGlobe />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
                      >
                        Tham quan cơ sở
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-8 flex items-center justify-center gap-2 text-white/80"
                    animate={ANIMATION_VARIANTS.pulse}
                  >
                    <FaStar className="text-yellow-300" />
                    <span>Tư vấn miễn phí - Hỗ trợ tận tâm</span>
                    <FaStar className="text-yellow-300" />
                  </motion.div>
                </motion.div>
              </Card.Content>
            </Card>
          </div>
        </motion.section>
      </div>
    </>
  );
}

export default LienHe;
