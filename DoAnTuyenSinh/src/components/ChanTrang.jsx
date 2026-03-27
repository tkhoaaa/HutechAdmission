import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaGraduationCap,
  FaClock,
  FaGlobe,
  FaHeart,
  FaArrowUp,
  FaChevronRight,
  FaStar,
} from "react-icons/fa";
import { Button } from "./ui/Button";

// Enhanced animation variants
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
  hover: {
    scale: 1.15,
    y: -3,
    transition: { 
      duration: 0.3, 
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const scrollToTopVariants = {
  hidden: { opacity: 0, y: 100, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 1.2,
      duration: 0.6,
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  hover: {
    scale: 1.1,
    y: -5,
    rotate: 360,
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 300,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
  hover: {
    x: 8,
    transition: { duration: 0.2 },
  },
};

const contactVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  hover: {
    x: 5,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

function ChanTrang() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Thông tin tuyển sinh", path: "/thong-tin-tuyen-sinh" },
    { name: "Đăng ký xét tuyển", path: "/dang-ky-xet-tuyen" },
    { name: "Tra cứu kết quả", path: "/tra-cuu-ket-qua" },
    { name: "Học bổng", path: "/dang-ky-hoc-bong" },
    { name: "Tư vấn", path: "/dang-ky-tu-van" },
    { name: "Liên hệ", path: "/lien-he" },
  ];

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      text: "475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM",
    },
    {
      icon: FaPhone,
      text: "1900 2088",
    },
    {
      icon: FaEnvelope,
      text: "tuyensinh@hutech.edu.vn",
    },
    {
      icon: FaGlobe,
      text: "www.hutech.edu.vn",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebook,
      url: "https://facebook.com/hutech.edu.vn",
      color: "hover:text-blue-400 dark:hover:text-blue-300",
    },
    {
      icon: FaYoutube,
      url: "https://youtube.com/hutechuniversity",
      color: "hover:text-red-400 dark:hover:text-red-300",
    },
    {
      icon: FaInstagram,
      url: "https://instagram.com/hutech_university",
      color: "hover:text-pink-400 dark:hover:text-pink-300",
    },
    {
      icon: FaLinkedin,
      url: "https://linkedin.com/school/hutech",
      color: "hover:text-blue-300 dark:hover:text-blue-200",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-950 dark:via-black dark:to-gray-950 text-white overflow-hidden"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-transparent"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${((i * 7 + 5) % 85) + 5}%`,
              top: `${((i * 11 + 13) % 75) + 10}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            
            {/* Logo và thông tin chính */}
            <motion.div
              custom={0}
              variants={sectionVariants}
              className="lg:col-span-2 space-y-6"
            >
                            <Link to="/" className="block">
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="relative group"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30 group-hover:shadow-blue-500/25 group-hover:shadow-xl transition-all duration-300 p-1">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png"
                        alt="Logo HUTECH"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>

                  <div>
                    <motion.h3
                      className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      HUTECH
                    </motion.h3>
                    <motion.p
                      className="text-gray-300 dark:text-gray-400 text-sm font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      Trường Đại học Công nghệ TP.HCM
                    </motion.p>
                  </div>
                </motion.div>
              </Link>

              <motion.p
                className="text-gray-300 dark:text-gray-400 leading-relaxed text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                HUTECH là trường đại học hàng đầu trong lĩnh vực công nghệ và
                kinh tế, cam kết đào tạo nguồn nhân lực chất lượng cao cho sự
                phát triển của đất nước.
              </motion.p>

              <motion.div
                className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 bg-slate-800/50 dark:bg-gray-900/50 rounded-lg p-3 border border-slate-700/50 dark:border-gray-800/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaClock className="text-blue-400" />
                </motion.div>
                <span>Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaStar className="text-yellow-400 text-xs" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Liên kết nhanh */}
            <motion.div custom={1} variants={sectionVariants} className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-500/30">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaGraduationCap className="text-blue-400" />
                </motion.div>
                Liên kết nhanh
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    custom={index}
                    variants={linkVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 flex items-center gap-2 group text-sm py-1 px-2 rounded-md hover:bg-slate-800/50 dark:hover:bg-gray-900/50"
                    >
                      <motion.div
                        className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all duration-300"
                        whileHover={{ scale: 1.5 }}
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        whileHover={{ x: 3 }}
                      >
                        <FaChevronRight className="text-xs text-blue-400" />
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Thông tin liên hệ */}
            <motion.div custom={2} variants={sectionVariants} className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-500/30">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaPhone className="text-blue-400" />
                </motion.div>
                Liên hệ
              </h4>
              <div className="space-y-3">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={contactVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-gray-300 dark:text-gray-400 group p-2 rounded-md hover:bg-slate-800/50 dark:hover:bg-gray-900/50 transition-all duration-200"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="mt-0.5"
                    >
                      <info.icon className="text-blue-400 text-sm flex-shrink-0 group-hover:text-blue-300 transition-colors" />
                    </motion.div>
                    <span className="group-hover:text-white dark:group-hover:text-gray-200 transition-colors text-sm leading-relaxed">
                      {info.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Social Media & Newsletter */}
          <motion.div
            className="mt-10 pt-6 border-t border-slate-700/50 dark:border-gray-800/50"
            custom={3}
            variants={sectionVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Links */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-gray-300 dark:text-gray-400 font-medium text-sm">
                  Theo dõi chúng tôi:
                </span>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-300 dark:text-gray-400 ${social.color} transition-all duration-300 p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 hover:shadow-lg border border-transparent hover:border-blue-400/30 backdrop-blur-sm relative overflow-hidden group`}
                      custom={index}
                      variants={socialVariants}
                      initial="hidden"
                      whileInView="visible"
                      whileHover="hover"
                      whileTap={{ scale: 0.9 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                      <social.icon className="text-lg relative z-10" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  as={Link}
                  to="/dang-ky-tu-van"
                  variant="accent"
                  size="md"
                  className="shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50"
                  leftIcon={<FaUserPlus />}
                >
                  Đăng ký tư vấn
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 dark:border-gray-800/50 bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span>© {currentYear} HUTECH. All rights reserved.</span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  Made with{" "}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <FaHeart className="text-red-400 text-xs" />
                  </motion.div>
                  by HUTECH Team
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <Link
                  to="/privacy"
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                >
                  Chính sách bảo mật
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  to="/terms"
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                >
                  Điều khoản sử dụng
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-xl hover:shadow-2xl z-50 group transition-all duration-300 border border-blue-400/30 backdrop-blur-sm"
          variants={scrollToTopVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-all duration-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <FaArrowUp className="text-base text-white relative z-10 group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>
    </motion.footer>
  );
}

export default ChanTrang;
