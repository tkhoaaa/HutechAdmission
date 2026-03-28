import React, { useState, useMemo } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import ThemeToggle from "../components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaChartLine,
  FaStar,
  FaBookOpen,
  FaLaptopCode,
  FaBusinessTime,
  FaHeartbeat,
  FaPalette,
  FaClipboardList,
  FaDownload,
  FaCheckCircle,
  FaArrowRight,
  FaClock,
  FaSearch,
  FaChevronDown,
  FaRocket,
  FaAward,
  FaUserGraduate,
  FaHandshake,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";

// Entrance animation variants (fine - not infinite loops)
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

// Floating particle component - deterministic positions, no Math.random()
const FloatingParticle = ({ delay = 0, size = "small", index = 0 }) => {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3"
  };

  const xPos = ((index * 7 + 5) % 90) + 5;
  const yPos = ((index * 11 + 13) % 80) + 10;
  const duration = 3 + (index * 0.3) % 3;

  return (
    <div
      className={`absolute rounded-full ${sizeClasses[size]} bg-blue-500/10 dark:bg-blue-400/20 animate-particle-float`}
      style={{
        left: `${xPos}%`,
        top: `${yPos}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    />
  );
};

function ThongTinTuyenSinh() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { darkMode } = useDarkMode();
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      delay: (i * 0.2) % 5,
      size: (["small", "medium", "large"])[i % 3]
    }))
  );


  // Comprehensive majors data — memoized to prevent recreation on each render
  const majorsData = useMemo(() => [
    {
      id: 1,
      name: "Công nghệ Thông tin",
      code: "CNTT",
      icon: FaLaptopCode,
      category: "technology",
      duration: "4 năm",
      degree: "Cử nhân",
      tuition: "22-25 triệu/năm",
      description: "Đào tạo chuyên gia IT với kiến thức toàn diện về lập trình, AI, cybersecurity",
      subjects: ["Toán", "Lý", "Hóa", "Tiếng Anh"],
      career: ["Lập trình viên", "Kỹ sư phần mềm", "Chuyên gia AI", "Quản lý dự án IT"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Quản trị Kinh doanh",
      code: "QTKD",
      icon: FaBusinessTime,
      category: "business",
      duration: "4 năm",
      degree: "Cử nhân",
      tuition: "18-22 triệu/năm",
      description: "Phát triển kỹ năng lãnh đạo và quản lý doanh nghiệp hiện đại",
      subjects: ["Toán", "Văn", "Tiếng Anh", "GDCD"],
      career: ["Quản lý doanh nghiệp", "Chuyên viên kinh doanh", "Tư vấn chiến lược"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      name: "Y khoa",
      code: "YK",
      icon: FaHeartbeat,
      category: "medical",
      duration: "6 năm",
      degree: "Bác sĩ",
      tuition: "35-40 triệu/năm",
      description: "Đào tạo bác sĩ với chất lượng quốc tế và thực hành lâm sàng",
      subjects: ["Toán", "Lý", "Hóa", "Sinh học"],
      career: ["Bác sĩ đa khoa", "Bác sĩ chuyên khoa", "Nghiên cứu y học"],
      color: "from-red-500 to-pink-500"
    },
    {
      id: 4,
      name: "Thiết kế Đồ họa",
      code: "TKDH",
      icon: FaPalette,
      category: "design",
      duration: "4 năm",
      degree: "Cử nhân",
      tuition: "20-24 triệu/năm",
      description: "Sáng tạo và thiết kế với công nghệ hiện đại",
      subjects: ["Văn", "Tiếng Anh", "Mỹ thuật"],
      career: ["Nhà thiết kế", "Art Director", "UI/UX Designer"],
      color: "from-purple-500 to-pink-500"
    }
  ], []);

  const admissionMethods = useMemo(() => [
    {
      title: "Xét tuyển học bạ THPT",
      description: "Xét điểm trung bình 3 năm THPT hoặc tương đương",
      icon: FaFileAlt,
      requirements: "Điểm TB từ 6.5 trở lên",
      deadline: "31/08/2024",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Xét tuyển kết quả thi THPT",
      description: "Xét theo tổ hợp môn thi THPT Quốc gia",
      icon: FaClipboardList,
      requirements: "Điểm sàn theo quy định",
      deadline: "30/09/2024",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Xét tuyển năng lực",
      description: "Xét kết quả thi đánh giá năng lực",
      icon: FaChartLine,
      requirements: "Điểm thi đánh giá năng lực",
      deadline: "15/09/2024",
      color: "from-purple-500 to-purple-600"
    }
  ], []);

  const timeline = useMemo(() => [
    { date: "01/03 - 31/08", event: "Nhận hồ sơ xét tuyển", status: "active" },
    { date: "15/09", event: "Công bố kết quả", status: "upcoming" },
    { date: "20/09 - 30/09", event: "Xác nhận nhập học", status: "upcoming" },
    { date: "15/10", event: "Khai giảng năm học", status: "upcoming" }
  ], []);

  const faqData = useMemo(() => [
    {
      question: "Điều kiện xét tuyển vào HUTECH như thế nào?",
      answer: "HUTECH xét tuyển theo 3 phương thức chính: học bạ THPT, kết quả thi THPT Quốc gia, và kết quả thi đánh giá năng lực. Thí sinh cần đạt điểm tối thiểu theo quy định của từng phương thức."
    },
    {
      question: "Học phí tại HUTECH bao nhiêu?",
      answer: "Học phí dao động từ 18-40 triệu đồng/năm tùy theo ngành học. HUTECH có nhiều chính sách hỗ trợ học phí và học bổng cho sinh viên."
    },
    {
      question: "Có những ngành nào đào tạo tại HUTECH?",
      answer: "HUTECH có hơn 50 ngành đào tạo thuộc các lĩnh vực: Công nghệ thông tin, Kinh tế, Y tế, Kỹ thuật, Ngoại ngữ, Nghệ thuật và nhiều ngành khác."
    }
  ], []);

  // Filter majors based on search and category
  const filteredMajors = useMemo(() => {
    return majorsData.filter(major => {
      const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           major.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || major.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [majorsData, searchTerm, selectedCategory]);

  const categories = useMemo(() => [
    { value: "all", label: "Tất cả", icon: FaStar },
    { value: "technology", label: "Công nghệ", icon: FaLaptopCode },
    { value: "business", label: "Kinh tế", icon: FaBusinessTime },
    { value: "medical", label: "Y tế", icon: FaHeartbeat },
    { value: "design", label: "Thiết kế", icon: FaPalette }
  ], []);

  return (
    <>
      <SEO
        title="Thông tin tuyển sinh - HUTECH"
        description="Thông tin tuyển sinh HUTECH 2024 - Hướng dẫn đăng ký, phương thức xét tuyển, ngành học và học phí chi tiết."
        keywords="tuyển sinh HUTECH, đăng ký xét tuyển, ngành học, học phí"
        canonical="/thong-tin-tuyen-sinh"
      />

      <div className={`min-h-screen relative overflow-hidden transition-all duration-500 bg-background text-foreground ${
        darkMode
          ? 'dark bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        {/* Animated background particles - CSS-based */}
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
          <div
            className={`absolute top-20 left-10 w-40 h-40 rounded-full ${
              darkMode ? 'bg-blue-500/5' : 'bg-blue-200/20'
            }`}
          />
          <div
            className={`absolute top-60 right-20 w-32 h-32 rounded-full ${
              darkMode ? 'bg-purple-500/5' : 'bg-purple-200/20'
            }`}
          />
          <div
            className={`absolute bottom-40 left-1/3 w-24 h-24 rounded-full ${
              darkMode ? 'bg-emerald-500/5' : 'bg-emerald-200/20'
            }`}
          />
        </div>

        {/* Hero Section */}
        <section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* Animated icon */}
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 relative animate-pulse-glow ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                } shadow-2xl`}
              >
                <FaGraduationCap className="text-4xl text-white" />
              </div>

              {/* Support badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 ${
                  darkMode
                    ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                } shadow-lg animate-pulse-glow`}
              >
                <FaRocket className="text-emerald-500" />
                <span className="font-semibold">Tuyển sinh 2025</span>
                <FaStar className="text-yellow-500" />
              </motion.div>

              {/* Main title */}
              <motion.h1
                className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Thông tin tuyển sinh 2025
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className={`text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed mb-6 md:mb-8 ${
                  darkMode ? 'text-gray-100' : 'text-gray-600'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Khám phá cơ hội học tập tại HUTECH với hơn 50 ngành đào tạo chất lượng cao
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  { icon: FaBookOpen, number: "50+", label: "Ngành học" },
                  { icon: FaUserGraduate, number: "100K+", label: "Sinh viên" },
                  { icon: FaAward, number: "95%", label: "Việc làm" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl hover-lift cursor-default ${
                      darkMode
                        ? 'bg-gray-800/50 border border-gray-700'
                        : 'bg-white/80 border border-gray-200'
                    } backdrop-blur-sm shadow-lg`}
                    whileHover={{ scale: 1.05, y: -2 }}
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

              {/* Action buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <Link
                  to="/dang-ky-xet-tuyen"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl px-8 py-4 shadow-xl hover:shadow-2xl rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <FaGraduationCap />
                  Đăng ký ngay
                </Link>

                <button
                  className={`inline-flex items-center justify-center gap-2 font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                    darkMode
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaDownload />
                  Tải thông báo tuyển sinh
                </button>
              </motion.div>

              {/* Dark mode toggle */}
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Admission Methods */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Phương thức xét tuyển
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                HUTECH áp dụng 3 phương thức xét tuyển linh hoạt để tạo cơ hội cho mọi thí sinh
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
            >
              {admissionMethods.map((method, index) => (
                <motion.div
                  key={index}
                  variants={ANIMATION_VARIANTS.item}
                >
                  <div
                    className="h-full backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden rounded-xl bg-white/10 dark:bg-gray-800/30 hover-lift"
                  >
                    <div className="p-8 text-center relative">
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-10 rounded-lg animate-pulse-glow`}
                      />

                      <div
                        className={`relative z-10 w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center bg-gradient-to-r ${method.color} shadow-lg animate-pulse`}
                      >
                        <method.icon className="text-2xl text-white" />
                      </div>

                      <h3 className={`text-xl font-bold mb-4 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {method.title}
                      </h3>

                      <p className={`mb-6 leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {method.description}
                      </p>

                      <div className="space-y-3">
                        <div className={`flex items-center justify-center gap-2 text-sm ${
                          darkMode ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          <FaCheckCircle />
                          <span className="font-medium">{method.requirements}</span>
                        </div>
                        <div className={`flex items-center justify-center gap-2 text-sm ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          <FaClock />
                          <span className="font-medium">Hạn nộp: {method.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Lịch trình tuyển sinh
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Theo dõi các mốc thời gian quan trọng trong quá trình tuyển sinh
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />

                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center mb-12 ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'text-right md:pr-8 pr-4' : 'text-left md:pl-8 pl-4'}`}>
                      <div
                        className={`backdrop-blur-xl ${
                          item.status === 'active'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 border-2'
                            : 'border border-white/20 dark:border-gray-700/30'
                        } shadow-xl rounded-xl`}
                      >
                        <div className="p-6">
                          <div className={`font-bold text-lg mb-2 ${
                            item.status === 'active'
                              ? 'text-blue-600 dark:text-blue-400'
                              : darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`}>
                            {item.date}
                          </div>
                          <div className={`text-lg ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.event}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div
                      className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full border-4 ${
                        darkMode ? 'border-gray-800' : 'border-white'
                      } ${
                        item.status === 'active'
                          ? 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse'
                          : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Majors Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ngành đào tạo
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Khám phá các ngành học phù hợp với đam mê và định hướng tương lai của bạn
              </p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <div
                className="backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl rounded-xl bg-white/10 dark:bg-gray-800/30"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm ngành học..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-label="Tìm kiếm ngành học"
                          className={`w-full pl-12 pr-4 py-3 text-lg rounded-lg border transition-all duration-200 ${
                            darkMode
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      {categories.map((category, index) => (
                        <motion.button
                          key={category.value}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          onClick={() => setSelectedCategory(category.value)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                            selectedCategory === category.value
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                              : `${
                                  darkMode
                                    ? 'border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                                    : 'border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                                } hover:shadow-lg`
                          }`}
                        >
                          <category.icon />
                          {category.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Majors Grid */}
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
            >
              {filteredMajors.map((major) => (
                <motion.div
                  key={major.id}
                  variants={ANIMATION_VARIANTS.item}
                  whileHover={{ y: -5 }}
                  className="hover-lift"
                >
                  <div
                    className="h-full backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden rounded-xl bg-white/10 dark:bg-gray-800/30"
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-6 mb-6">
                        <div
                          className={`p-4 rounded-xl bg-gradient-to-r ${major.color} text-white shadow-lg`}
                        >
                          <major.icon className="text-3xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-2xl font-bold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {major.name}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Mã ngành: {major.code}
                          </p>
                        </div>
                      </div>

                      <p className={`mb-6 leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {major.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}>
                          <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Thời gian:
                          </span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {major.duration}
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}>
                          <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Bằng cấp:
                          </span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {major.degree}
                          </span>
                        </div>
                        <div className={`col-span-2 p-3 rounded-lg ${
                          darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}>
                          <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Học phí:
                          </span>
                          <span className={`font-bold text-lg ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {major.tuition}
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className={`text-sm mb-3 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Tổ hợp xét tuyển:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {major.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                darkMode
                                  ? 'bg-blue-900/30 text-blue-300'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                          darkMode
                            ? 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          Xem chi tiết
                          <FaArrowRight />
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredMajors.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto backdrop-blur-xl rounded-xl bg-white/10 dark:bg-gray-800/30">
                  <div className="p-12">
                    <div className="mb-6">
                      <FaSearch className={`text-6xl mx-auto ${
                        darkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Không tìm thấy ngành học phù hợp
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-16"
            >
              <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Câu hỏi thường gặp
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Giải đáp những thắc mắc phổ biến về tuyển sinh và đào tạo tại HUTECH
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="visible"
            >
              {faqData.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={ANIMATION_VARIANTS.item}
                >
                  <div
                    className="backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden rounded-xl bg-white/10 dark:bg-gray-800/50 hover-lift"
                  >
                    <div className="p-0">
                      <button
                        className={`w-full p-6 text-left flex items-center justify-between transition-all duration-300 ${
                          darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      >
                        <span className={`font-bold text-base md:text-lg pr-4 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-2 rounded-full flex-shrink-0 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <FaChevronDown className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {expandedFAQ === index && (
                          <motion.div
                            id={"faq-answer-" + index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              className={`px-6 pb-6 leading-relaxed text-lg ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {faq.answer}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`shadow-2xl overflow-hidden rounded-xl ${
                darkMode
                  ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border border-gray-700'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600'
              }`}
            >
              <div className="relative p-12 text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                  className="relative z-10"
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 ${
                    darkMode ? 'bg-gray-700/50' : 'bg-white/20'
                  }`}>
                    <FaHandshake className={`text-4xl ${
                      darkMode ? 'text-gray-300' : 'text-white'
                    }`} />
                  </div>

                  <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-6 ${
                    darkMode ? 'text-white' : 'text-white'
                  }`}>
                    Cần tư vấn thêm?
                  </h2>
                  <p className={`text-xl mb-8 max-w-2xl mx-auto ${
                    darkMode ? 'text-gray-400' : 'text-white/90'
                  }`}>
                    Đội ngũ tư vấn viên của chúng tôi sẵn sàng hỗ trợ bạn 24/7 với tất cả sự nhiệt tình
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                      to="/dang-ky-tu-van"
                      className={`inline-flex items-center justify-center gap-2 border-2 font-bold shadow-xl px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50 backdrop-blur-sm'
                          : 'bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm'
                      }`}
                    >
                      <FaPhone />
                      Đăng ký tư vấn
                    </Link>

                    <Link
                      to="/lien-he"
                      className={`inline-flex items-center justify-center gap-2 border-2 font-bold shadow-xl px-8 py-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200 hover:bg-gray-600/50 backdrop-blur-sm'
                          : 'bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm'
                      }`}
                    >
                      <FaEnvelope />
                      Liên hệ trực tiếp
                    </Link>
                  </div>

                  <div className={`mt-8 flex items-center justify-center gap-2 animate-pulse ${
                    darkMode ? 'text-gray-500' : 'text-white/80'
                  }`}>
                    <FaStar className={darkMode ? 'text-gray-500' : 'text-yellow-300'} />
                    <span className={darkMode ? 'text-gray-500' : ''}>Tư vấn miễn phí - Hỗ trợ tận tâm</span>
                    <FaStar className={darkMode ? 'text-gray-500' : 'text-yellow-300'} />
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

export default ThongTinTuyenSinh;
