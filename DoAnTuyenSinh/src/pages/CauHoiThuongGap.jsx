import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaQuestionCircle,
  FaSearch,
  FaLightbulb,
  FaGraduationCap,
  FaMoneyBillWave,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaRocket,
  FaHeart,
  FaMoon,
  FaSun,
  FaFilter,
  FaBookOpen,
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

// Category icon mapping
const categoryIcons = {
  "Tuyển sinh": FaGraduationCap,
  "Học phí & Học bổng": FaMoneyBillWave,
  "Cơ sở vật chất": FaBuilding
};

const faqData = [
  {
    category: "Tuyển sinh",
    questions: [
      {
        question: "HUTECH có bao nhiêu phương thức xét tuyển?",
        answer:
          "HUTECH có 4 phương thức xét tuyển: Xét tuyển học bạ THPT, Xét tuyển kết quả thi THPT Quốc gia, Xét tuyển kết quả thi đánh giá năng lực, và Xét tuyển thẳng theo quy định của Bộ GD&ĐT.",
      },
      {
        question: "Thời gian nhận hồ sơ xét tuyển khi nào?",
        answer:
          "Thời gian nhận hồ sơ xét tuyển thường bắt đầu từ tháng 3 và kéo dài đến tháng 8 hàng năm. Bạn có thể theo dõi thông tin chi tiết trên website chính thức của trường.",
      },
      {
        question: "HUTECH có bao nhiêu ngành đào tạo?",
        answer:
          "HUTECH có hơn 50 ngành đào tạo thuộc các lĩnh vực: Công nghệ thông tin, Kinh tế - Quản trị, Kỹ thuật, Ngoại ngữ, Du lịch, Y tế và nhiều ngành khác.",
      },
    ],
  },
  {
    category: "Học phí & Học bổng",
    questions: [
      {
        question: "Học phí tại HUTECH như thế nào?",
        answer:
          "Học phí tại HUTECH được tính theo tín chỉ và thay đổi theo từng ngành học. Mức học phí trung bình từ 15-25 triệu đồng/năm học. Trường có nhiều chính sách hỗ trợ học phí cho sinh viên.",
      },
      {
        question: "Có những loại học bổng nào?",
        answer:
          "HUTECH có nhiều loại học bổng: Học bổng khuyến khích học tập, Học bổng tài năng, Học bổng hỗ trợ sinh viên nghèo, Học bổng từ các doanh nghiệp đối tác.",
      },
      {
        question: "Làm thế nào để đăng ký học bổng?",
        answer:
          "Bạn có thể đăng ký học bổng thông qua form online trên website hoặc liên hệ trực tiếp với phòng Công tác sinh viên để được hướng dẫn chi tiết.",
      },
    ],
  },
  {
    category: "Cơ sở vật chất",
    questions: [
      {
        question: "HUTECH có những cơ sở nào?",
        answer:
          "HUTECH có 3 cơ sở chính tại TP.HCM: Cơ sở 1 (475A Điện Biên Phủ, Q.Bình Thạnh), Cơ sở 2 (31/36 Ung Văn Khiêm, Q.Bình Thạnh), và Cơ sở 3 (288 Đỗ Xuân Hợp, Q.9).",
      },
      {
        question: "Thư viện có đầy đủ tài liệu không?",
        answer:
          "Thư viện HUTECH có hơn 100,000 đầu sách, tài liệu điện tử, và các cơ sở dữ liệu trực tuyến. Sinh viên có thể truy cập 24/7 thông qua hệ thống thư viện số.",
      },
      {
        question: "Ký túc xá có sẵn cho sinh viên không?",
        answer:
          "HUTECH có ký túc xá với sức chứa hơn 2,000 sinh viên. Ký túc xá được trang bị đầy đủ tiện nghi với mức phí hợp lý. Sinh viên có thể đăng ký từ năm nhất.",
      },
    ],
  },
];

function CauHoiThuongGap() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      size: ["small", "medium", "large"][Math.floor(Math.random() * 3)]
    }));
    setParticles(newParticles);
  }, []);

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredData = faqData
    .filter(
      (category) =>
        activeCategory === "Tất cả" || category.category === activeCategory
    )
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const allCategories = ["Tất cả", ...faqData.map((cat) => cat.category)];

  return (
    <>
      <SEO
        title="Câu hỏi thường gặp - HUTECH"
        description="Tìm hiểu các câu hỏi thường gặp về tuyển sinh, học phí, học bổng và cơ sở vật chất tại HUTECH."
        keywords="câu hỏi thường gặp, tuyển sinh HUTECH, học phí, học bổng, cơ sở vật chất"
        canonical="/cau-hoi-thuong-gap"
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
                <FaQuestionCircle className="text-4xl text-white" />
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
                   <FaHeart className="text-red-500" />
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
                  Câu hỏi thường gặp
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
                Tìm câu trả lời cho những thắc mắc phổ biến về tuyển sinh, học phí, học bổng và cơ sở vật chất tại HUTECH
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  { icon: FaBookOpen, number: "50+", label: "Câu hỏi" },
                  { icon: FaUsers, number: "24/7", label: "Hỗ trợ" },
                  { icon: FaAward, number: "100%", label: "Miễn phí" }
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

        {/* Enhanced Search & Filter Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-12"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card 
              variant="glass" 
              className="backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl"
              hover={true}
              shimmer={true}
            >
              <Card.Content className="space-y-8 p-8">
                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <Input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi của bạn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<FaSearch className="text-blue-500" />}
                    size="lg"
                    className="text-lg"
                  />
                  
                  {/* Animated search border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 -z-10"
                    animate={{ opacity: searchTerm ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Category Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <FaFilter className="text-blue-500" />
                    <span className="font-semibold">Lọc theo danh mục:</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {allCategories.map((category, index) => {
                      const isActive = activeCategory === category;
                      const IconComponent = categoryIcons[category] || FaQuestionCircle;
                      
                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={isActive ? "primary" : "outline"}
                            size="md"
                            onClick={() => setActiveCategory(category)}
                            leftIcon={category !== "Tất cả" ? <IconComponent /> : <FaStar />}
                            className={`transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                : `${
                                    darkMode 
                                      ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400' 
                                      : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                                  } hover:shadow-lg`
                            }`}
                          >
                            {category}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </Card.Content>
            </Card>
          </div>
        </motion.section>

        {/* Enhanced FAQ Content */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-16"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <Card variant="glass" className="max-w-md mx-auto backdrop-blur-xl">
                  <Card.Content className="p-12">
                    <motion.div
                      animate={ANIMATION_VARIANTS.float}
                      className="mb-6"
                    >
                      <FaLightbulb className={`text-6xl mx-auto ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Không tìm thấy câu hỏi phù hợp
                    </h3>
                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Hãy thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ
                    </p>
                    <Button
                      variant="primary"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      leftIcon={<FaRocket />}
                    >
                      Liên hệ hỗ trợ
                    </Button>
                  </Card.Content>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {filteredData.map((category, categoryIndex) => {
                  const IconComponent = categoryIcons[category.category] || FaQuestionCircle;
                  
                  return (
                    <motion.div
                      key={category.category}
                      variants={ANIMATION_VARIANTS.item}
                    >
                      <Card 
                        variant="glass" 
                        className="backdrop-blur-xl border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden"
                        hover={true}
                        shimmer={true}
                      >
                        <Card.Header className="relative overflow-hidden">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className={`p-4 rounded-xl ${
                                darkMode 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              } shadow-lg`}
                              animate={ANIMATION_VARIANTS.pulse}
                            >
                              <IconComponent className="text-2xl text-white" />
                            </motion.div>
                            <div>
                              <h2 className={`text-3xl font-bold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {category.category}
                              </h2>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {category.questions.length} câu hỏi
                              </p>
                            </div>
                          </div>
                          
                          {/* Animated background gradient */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 -z-10"
                            animate={{
                              background: [
                                "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(16, 185, 129, 0.05))",
                                "linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))",
                                "linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))"
                              ]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                          />
                        </Card.Header>

                        <Card.Content>
                          <div className="space-y-4">
                            {category.questions.map((item, index) => {
                              const itemIndex = `${categoryIndex}-${index}`;
                              const isExpanded = expandedItems.has(itemIndex);

                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                                    darkMode 
                                      ? 'border border-gray-700 hover:border-gray-600' 
                                      : 'border border-gray-200 hover:border-gray-300'
                                  } hover:shadow-xl`}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <motion.button
                                    onClick={() => toggleItem(itemIndex)}
                                    className={`w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between ${
                                      darkMode 
                                        ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    whileHover={{ x: 5 }}
                                  >
                                    <span className={`font-semibold text-lg pr-4 ${
                                      darkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {item.question}
                                    </span>
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                      className={`p-2 rounded-full ${
                                        darkMode ? 'bg-gray-700' : 'bg-white'
                                      } shadow-lg`}
                                    >
                                      <FaChevronDown className={`${
                                        darkMode ? 'text-gray-300' : 'text-gray-600'
                                      } flex-shrink-0`} />
                                    </motion.div>
                                  </motion.button>

                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                      >
                                        <motion.div
                                          className={`px-6 py-6 leading-relaxed text-lg ${
                                            darkMode 
                                              ? 'bg-gray-900/50 text-gray-300' 
                                              : 'bg-white text-gray-700'
                                          }`}
                                          initial={{ y: -10, opacity: 0 }}
                                          animate={{ y: 0, opacity: 1 }}
                                          transition={{ delay: 0.1 }}
                                        >
                                          {item.answer}
                                        </motion.div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Enhanced Contact Section */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
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
                  transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                  className="relative z-10"
                >
                  <motion.div
                    animate={ANIMATION_VARIANTS.pulse}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
                  >
                    <FaHeart className="text-4xl text-red-300" />
                  </motion.div>

                  <h2 className="text-4xl font-bold mb-4">
                    Vẫn chưa tìm thấy câu trả lời?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 với tất cả sự nhiệt tình
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
                        Hotline: 1900 2088
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaEnvelope />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
                      >
                        Email: tuyensinh@hutech.edu.vn
                      </Button>
                    </motion.div>
                  </div>

                                     <motion.div
                     className="mt-8 flex items-center justify-center gap-2 text-white/80"
                     animate={ANIMATION_VARIANTS.pulse}
                   >
                     <FaStar className="text-yellow-300" />
                     <span>Phản hồi trong vòng 5 phút</span>
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

export default CauHoiThuongGap;
