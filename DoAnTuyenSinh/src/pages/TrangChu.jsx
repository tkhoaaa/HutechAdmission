import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaTrophy,
  FaUsers,
  FaStar,
  FaPlay,
  FaArrowRight,
  FaHandshake,
  FaSearch,
  FaEnvelope,
  FaUserPlus,
  FaClipboardCheck,
  FaHeadset,
} from "react-icons/fa";
import { 
  FilePlus, 
  ClipboardList, 
  Headphones 
} from "lucide-react";
import SEO from "../components/SEO";
import StructuredData, {
  organizationData,
  websiteData,
} from "../components/StructuredData";
import OptimizedImage from "../components/OptimizedImage";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import VideoModal from "../components/VideoModal";

const bannerUrl =
  "https://file1.hutech.edu.vn/file/editor/homepage1/792764-xep-hang-scimago-2025-713x475.jpg";

const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const cardHover = {
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function TrangChu() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoUrl = "https://youtu.be/ayTTBNBtNpk?si=7byB99-BkTZPRP0n";

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <>
      <SEO
        title="Trang chủ"
        description="HUTECH - Đại học Công nghệ TP.HCM, QS Stars 4 sao chu kỳ 2. Tuyển sinh 2025 với nhiều ngành học hot, học bổng hấp dẫn và cơ hội việc làm cao."
        keywords="HUTECH, tuyển sinh 2025, đại học công nghệ, TP.HCM, QS Stars, học bổng, ngành học"
        canonical="/"
      />
      <StructuredData data={organizationData} />
      <StructuredData data={websiteData} />

      <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
        >
          {/* Enhanced background pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            {/* Floating shapes */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -3, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                y: [0, -10, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
              className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-secondary-400/20 to-accent-400/20 rounded-full blur-lg"
            />
          </div>

          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 px-4 relative z-10">
            <motion.div
              className="flex-1 text-center lg:text-left order-2 lg:order-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-accent-100 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-700 text-accent-800 dark:text-accent-200 px-6 py-3 rounded-full text-sm font-semibold mb-6"
              >
                <FaStar className="text-accent-600 dark:text-accent-400" />
                QS Stars 4 Sao chu kỳ 2
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight"
              >
                Khởi đầu{" "}
                <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent">
                  Tương lai
                </span>
                <br />
                cùng{" "}
                <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  HUTECH
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl"
              >
                Đại học Công nghệ TP.HCM - Nơi khởi nguồn của những ước mơ và
                thành công. Với chất lượng giáo dục được công nhận quốc tế{" "}
                <span className="font-semibold text-accent-600 dark:text-accent-400">
                  QS Stars 4 sao
                </span>
                .
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12"
              >
                <Button
                  as={Link}
                  to="/dang-ky-xet-tuyen"
                  variant="primary"
                  size="xl"
                  className="group shadow-2xl hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
                  rightIcon={
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  }
                >
                  Đăng ký xét tuyển ngay
                </Button>

                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleVideoClick}
                  className="border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transform hover:scale-105 transition-all duration-300"
                  leftIcon={<FaPlay />}
                >
                  Xem video giới thiệu
                </Button>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="grid grid-cols-3 gap-6 max-w-md"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sinh viên
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    100+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ngành học
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-accent-600 dark:text-accent-400">
                    95%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Việc làm
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full lg:w-1/2 order-1 lg:order-2"
            >
              <div className="relative">
                {/* Main image container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 p-8">
                  <OptimizedImage
                    src={bannerUrl}
                    alt="HUTECH đạt xếp hạng QS Stars 4 sao - Minh chứng cho chất lượng giáo dục hàng đầu"
                    className="w-full object-cover rounded-2xl shadow-xl"
                    loading="eager"
                  />
                  
                  {/* Floating badge - positioned above banner */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: 0,
                      y: [0, -6, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.6, delay: 0.8 },
                      scale: { duration: 0.6, delay: 0.8 },
                      rotate: { duration: 0.6, delay: 0.8 },
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                      }
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                    className="absolute -top-12 -right-12 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm border-2 border-white/20 backdrop-blur-sm cursor-pointer"
                    style={{ zIndex: 9999, position: 'absolute' }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      <FaStar className="text-yellow-200" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent font-extrabold">
                      QS Stars 4⭐
                    </span>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-br from-primary-200/50 to-secondary-200/50 dark:from-primary-800/30 dark:to-secondary-800/30 rounded-3xl"></div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-400/10 to-primary-400/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent mb-4">
                Thành tựu nổi bật
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Những con số ấn tượng khẳng định vị thế của HUTECH trong giáo dục đại học
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
            >
              {[
                {
                  icon: FaGraduationCap,
                  number: "50,000+",
                  label: "Sinh viên",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
                  description: "Đang theo học tại HUTECH"
                },
                { 
                  icon: FaTrophy, 
                  number: "4 Sao", 
                  label: "QS Stars",
                  color: "from-yellow-500 to-orange-500",
                  bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
                  description: "Chứng nhận chất lượng quốc tế"
                },
                { 
                  icon: FaUsers, 
                  number: "1,000+", 
                  label: "Giảng viên",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
                  description: "Đội ngũ giảng dạy chất lượng cao"
                },
                { 
                  icon: FaStar, 
                  number: "Top 11", 
                  label: "Đại học VN",
                  color: "from-purple-500 to-pink-500",
                  bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
                  description: "Xếp hạng trong top đầu Việt Nam"
                },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={itemAnimation}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={`relative text-center p-8 bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm group overflow-hidden`}>
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon with enhanced animation */}
                    <motion.div
                      className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 shadow-xl`}
                      whileHover={{ 
                        scale: 1.15, 
                        rotate: [0, -10, 10, 0],
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="text-3xl text-white drop-shadow-lg" />
                      
                      {/* Pulse effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl`}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>

                    {/* Number with counter animation */}
                    <motion.h3 
                      className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                    >
                      {stat.number}
                    </motion.h3>

                    {/* Label */}
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      {stat.label}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {stat.description}
                    </p>

                    {/* Decorative element */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* News Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          className="py-24 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-blue-900/10 relative overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div className="text-center mb-20" variants={itemAnimation}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-full text-sm font-semibold mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <FaStar className="text-primary-600 dark:text-primary-400" />
                </motion.div>
                Tin tức & Sự kiện
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 bg-clip-text text-transparent mb-6">
                Tin tức nổi bật
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Cập nhật những thông tin mới nhất về HUTECH và các hoạt động tuyển sinh
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {[
                {
                  img: "https://file1.hutech.edu.vn/file/editor/homepage1/213688-dat-chung-nhan-qs-stars-4-sao-713x475.jpg",
                  title: "QS Stars 4 Sao chu kỳ 2",
                  desc: "HUTECH đạt chuẩn đánh giá quốc tế QS Stars 4 Sao chu kỳ 2.",
                  link: "https://www.hutech.edu.vn/homepage/tin-hutech/14623064-hutech-don-tin-vui-dau-nam-2025-dat-chung-nhan-qs-stars-4-sao-o-chu-ky-2",
                  category: "Thành tựu",
                  date: "15/01/2025",
                  featured: true
                },
                {
                  img: "https://file1.hutech.edu.vn/file/editor/tuyensinh/679403-jpeg-optimizer_482063183_992252426347806_2741441194146505700_n.jpg",
                  title: "Chất lượng đào tạo top đầu miền Nam",
                  desc: "Chất lượng đào tạo đứng đầu trong những top đầu của các trường Đại học miền Nam.",
                  link: "https://www.hutech.edu.vn/tuyensinh/moi-truong-hutech/14622762-chat-luong-dao-tao-cua-hutech",
                  category: "Giáo dục",
                  date: "10/01/2025",
                  featured: false
                },
                {
                  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC2mEQgq-ntbDuSAoMWyZJ1ALx4jU1sExLSA&s",
                  title: "Top 11 trường đại học hàng đầu Việt Nam",
                  desc: "HUTECH xếp thứ 11 trong số 53 trường đại học và viện nghiên cứu hàng đầu Việt Nam.",
                  link: "https://www.facebook.com/share/p/1W74ULtPFd/",
                  category: "Xếp hạng",
                  date: "05/01/2025",
                  featured: false
                },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemAnimation}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer border border-gray-100 dark:border-gray-700 ${item.featured ? 'ring-2 ring-primary-500/20' : ''}`}
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    {/* Featured badge */}
                    {item.featured && (
                      <div className="absolute top-4 left-4 z-20">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          <FaStar className="inline mr-1" />
                          Nổi bật
                        </div>
                      </div>
                    )}

                    {/* Image container with enhanced effects */}
                    <div className="relative overflow-hidden h-56">
                      <OptimizedImage
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {item.category}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="absolute bottom-4 left-4 text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {item.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3">
                        {item.desc}
                      </p>

                      {/* Read more button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                          <span>Đọc thêm</span>
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <FaArrowRight />
                          </motion.div>
                        </div>

                        {/* Share button */}
                        <motion.button
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.share?.({ title: item.title, url: item.link }) || 
                            navigator.clipboard.writeText(item.link);
                          }}
                        >
                          <FaHandshake className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Hover effect border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/30 rounded-3xl transition-colors duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>


          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionFade}
          className="py-24 bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 dark:from-primary-800 dark:via-accent-800 dark:to-secondary-800 relative overflow-hidden"
        >
          {/* Enhanced background effects */}
          <div className="absolute inset-0">
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Floating geometric shapes */}
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
              animate={{ 
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-xl"
              animate={{ 
                y: [0, 20, 0],
                scale: [1, 0.8, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/3 rounded-full blur-2xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Section Header */}
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <FaGraduationCap className="text-white" />
                </motion.div>
                Bắt đầu hành trình của bạn
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Sẵn sàng gia nhập
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-white to-blue-200 bg-clip-text text-transparent">
                  HUTECH?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Khám phá cơ hội học tập tuyệt vời và bắt đầu hành trình thành công của bạn ngay hôm nay
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {[
                {
                  icon: FilePlus,
                  title: "Đăng ký xét tuyển",
                  desc: "Nộp hồ sơ xét tuyển online nhanh chóng, tiện lợi với nhiều phương thức xét tuyển đa dạng.",
                  link: "/dang-ky-xet-tuyen",
                  color: "from-blue-400 to-cyan-400",
                  bgPattern: "from-blue-500/20 to-cyan-500/20"
                },
                {
                  icon: ClipboardList,
                  title: "Tra cứu kết quả",
                  desc: "Kiểm tra kết quả xét tuyển và thông tin học bổng một cách nhanh chóng và chính xác.",
                  link: "/tra-cuu-ket-qua",
                  color: "from-green-400 to-emerald-400",
                  bgPattern: "from-green-500/20 to-emerald-500/20"
                },
                {
                  icon: Headphones,
                  title: "Liên hệ tư vấn",
                  desc: "Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn 24/7 về mọi thông tin tuyển sinh.",
                  link: "/lien-he",
                  color: "from-purple-400 to-pink-400",
                  bgPattern: "from-purple-500/20 to-pink-500/20"
                },
              ].map((action, i) => (
                <motion.div 
                  key={i} 
                  variants={itemAnimation}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative text-center text-white p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-500 group overflow-hidden">
                    {/* Background pattern */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.bgPattern} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Icon with enhanced effects */}
                    <motion.div
                      className={`relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${action.color} rounded-2xl mb-8 shadow-2xl`}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                        boxShadow: "0 25px 50px rgba(255,255,255,0.2)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <action.icon className="w-10 h-10 text-white drop-shadow-lg" />
                      
                      {/* Pulse ring effect */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-2xl`}
                        animate={{ 
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 0, 0.6]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: i * 0.5
                        }}
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-white/90 mb-8 leading-relaxed text-lg">
                        {action.desc}
                      </p>

                      {/* Enhanced CTA Button */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          as={Link}
                          to={action.link}
                          className="bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-8 rounded-2xl backdrop-blur-sm transition-all duration-300 shadow-xl hover:shadow-2xl"
                          rightIcon={
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <FaArrowRight />
                            </motion.div>
                          }
                        >
                          Truy cập ngay
                        </Button>
                      </motion.div>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div 
              className="text-center mt-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="text-white/80 text-lg mb-8">
                Có câu hỏi? Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  to="/dang-ky-tu-van"
                  variant="glass"
                  size="xl"
                  rounded="2xl"
                  className="bg-white/95 dark:bg-white/90 text-primary-600 dark:text-primary-700 hover:bg-white dark:hover:bg-white/95 font-bold shadow-xl hover:shadow-2xl border-0"
                  leftIcon={<FaHandshake />}
                >
                  Đăng ký tư vấn miễn phí
                </Button>
                <Button
                  as={Link}
                                          to="/cau-hoi-thuong-gap"
                  variant="glass"
                  size="xl"
                  rounded="2xl"
                  className="bg-white/10 dark:bg-white/10 border-2 border-white/30 dark:border-white/40 text-white hover:bg-white/20 dark:hover:bg-white/20 hover:border-white/50 dark:hover:border-white/60 font-bold backdrop-blur-sm"
                  leftIcon={<FaSearch />}
                >
                  Xem câu hỏi thường gặp
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl={videoUrl}
      />
    </>
  );
}

export default TrangChu;
