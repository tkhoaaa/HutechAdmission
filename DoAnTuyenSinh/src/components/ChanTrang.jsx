import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
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

const quickLinks = [
  { name: "Thông tin tuyển sinh", path: "/thong-tin-tuyen-sinh" },
  { name: "Đăng ký xét tuyển", path: "/dang-ky-xet-tuyen" },
  { name: "Tra cứu kết quả", path: "/tra-cuu-ket-qua" },
  { name: "Học bổng", path: "/dang-ky-hoc-bong" },
  { name: "Tư vấn", path: "/dang-ky-tu-van" },
  { name: "Liên hệ", path: "/lien-he" },
];

const contactInfo = [
  { icon: FaMapMarkerAlt, text: "475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM" },
  { icon: FaPhone, text: "1900 2088" },
  { icon: FaEnvelope, text: "tuyensinh@hutech.edu.vn" },
  { icon: FaGlobe, text: "www.hutech.edu.vn" },
];

const socialLinks = [
  { icon: FaFacebook, url: "https://facebook.com/hutech.edu.vn" },
  { icon: FaYoutube, url: "https://youtube.com/hutechuniversity" },
  { icon: FaInstagram, url: "https://instagram.com/hutech_university" },
  { icon: FaLinkedin, url: "https://linkedin.com/school/hutech" },
];

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, staggerChildren: 0.1 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

function ChanTrang() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="relative bg-slate-900 dark:bg-gray-950 text-white overflow-hidden"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${((i * 7 + 5) % 85) + 5}%`,
              top: `${((i * 11 + 13) % 75) + 10}%`,
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{ y: [-20, -100], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 3 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          </div>
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
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30 hover:shadow-blue-500/25 hover:shadow-xl transition-all duration-300 p-1 group">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/8/81/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_Th%C3%A0nh_ph%E1%BB%91_H%E1%BB%93_Ch%C3%AD_Minh.png"
                      alt="Logo HUTECH"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      HUTECH
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">
                      Trường Đại học Công nghệ TP.HCM
                    </p>
                  </div>
                </div>
              </Link>

              <p className="text-gray-300 leading-relaxed text-sm">
                HUTECH là trường đại học hàng đầu trong lĩnh vực công nghệ và
                kinh tế, cam kết đào tạo nguồn nhân lực chất lượng cao cho sự
                phát triển của đất nước.
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-400 bg-slate-800/50 dark:bg-gray-900/50 rounded-lg p-3 border border-slate-700/50 dark:border-gray-800/50">
                <div className="animate-spin-slow">
                  <FaClock className="text-blue-400" />
                </div>
                <span>Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</span>
                <FaStar className="text-yellow-400 text-xs animate-star-pulse" />
              </div>
            </motion.div>

            {/* Liên kết nhanh */}
            <motion.div custom={1} variants={sectionVariants} className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-500/30">
                <FaGraduationCap className="text-blue-400" />
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
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group text-sm py-1 px-2 rounded-md hover:bg-slate-800/50 dark:hover:bg-gray-900/50"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:w-2 group-hover:h-2 transition-all" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Thông tin liên hệ */}
            <motion.div custom={2} variants={sectionVariants} className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-blue-500/30">
                <FaPhone className="text-blue-400" />
                Liên hệ
              </h4>
              <div className="space-y-3">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-gray-300 dark:text-gray-400 group p-2 rounded-md hover:bg-slate-800/50 dark:hover:bg-gray-900/50 transition-colors text-sm"
                  >
                    <info.icon className="text-blue-400 text-sm flex-shrink-0 mt-0.5 group-hover:text-blue-300 transition-colors" />
                    <span className="group-hover:text-white dark:group-hover:text-gray-200 transition-colors leading-relaxed">
                      {info.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div
            className="mt-10 pt-6 border-t border-slate-700/50 dark:border-gray-800/50"
            custom={3}
            variants={sectionVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
                      className="text-gray-300 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 hover:shadow-lg border border-transparent hover:border-blue-400/30"
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <Link
                to="/dang-ky-tu-van"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50"
              >
                <FaGraduationCap />
                Đăng ký tư vấn
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 dark:border-gray-800/50 bg-slate-900/80 dark:bg-black/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span>© {currentYear} HUTECH. All rights reserved.</span>
                <span className="hidden sm:inline text-gray-600">|</span>
                <span className="flex items-center gap-1">
                  Made with{" "}
                  <FaHeart className="text-red-400 text-xs animate-star-pulse" />
                  by HUTECH Team
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/privacy"
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                >
                  Chính sách bảo mật
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  to="/terms"
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
                >
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-xl hover:shadow-2xl z-50 transition-all duration-300 border border-blue-400/30"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp className="text-base text-white" />
        </motion.button>
      </div>
    </motion.footer>
  );
}

export default ChanTrang;
