import React, { useState, useEffect, useMemo } from "react";
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
  FaFilter,
  FaSync,
} from "react-icons/fa";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { authAPI } from "../utils/apiClient";

// Category icon mapping
const categoryIcons = {
  "Tuyển sinh": FaGraduationCap,
  "Học phí": FaMoneyBillWave,
  "Học bổng": FaMoneyBillWave,
  "Cơ sở vật chất": FaBuilding,
  "Chương trình đào tạo": FaGraduationCap,
  "Hồ sơ": FaBuilding,
  "Khác": FaQuestionCircle,
};

// Enhanced animation variants (entrance only - no infinite loops)
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
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
        duration: 0.6,
      },
    },
  },
};

// Floating particle component with deterministic positioning
const FloatingParticle = ({ delay = 0, size = "small", index = 0 }) => {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3",
  };

  const xPos = ((index * 7 + 5) % 90) + 5;
  const yPos = ((index * 11 + 13) % 80) + 10;
  const duration = 3 + (index * 0.3) % 3;

  return (
    <div
      className={`absolute rounded-full ${sizeClasses[size]} bg-blue-500/10 dark:bg-blue-400/20 animate-particle-rise`}
      style={{
        left: `${xPos}%`,
        top: `${yPos}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );
};

// Demo data as fallback when API fails
const DEMO_FAQ_DATA = [
  {
    category: "Tuyển sinh",
    questions: [
      {
        id: 1,
        question: "HUTECH có bao nhiêu phương thức xét tuyển?",
        answer:
          "HUTECH có 4 phương thức xét tuyển: Xét tuyển học bạ THPT, Xét tuyển kết quả thi THPT Quốc gia, Xét tuyển kết quả thi đánh giá năng lực, và Xét tuyển thẳng theo quy định của Bộ GD&ĐT.",
      },
      {
        id: 2,
        question: "Thời gian nhận hồ sơ xét tuyển khi nào?",
        answer:
          "Thời gian nhận hồ sơ xét tuyển thường bắt đầu từ tháng 3 và kéo dài đến tháng 8 hàng năm. Bạn có thể theo dõi thông tin chi tiết trên website chính thức của trường.",
      },
      {
        id: 3,
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
        id: 4,
        question: "Học phí tại HUTECH như thế nào?",
        answer:
          "Học phí tại HUTECH được tính theo tín chỉ và thay đổi theo từng ngành học. Mức học phí trung bình từ 15-25 triệu đồng/năm học. Trường có nhiều chính sách hỗ trợ học phí cho sinh viên.",
      },
      {
        id: 5,
        question: "Có những loại học bổng nào?",
        answer:
          "HUTECH có nhiều loại học bổng: Học bổng khuyến khích học tập, Học bổng tài năng, Học bổng hỗ trợ sinh viên nghèo, Học bổng từ các doanh nghiệp đối tác.",
      },
      {
        id: 6,
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
        id: 7,
        question: "HUTECH có những cơ sở nào?",
        answer:
          "HUTECH có 3 cơ sở chính tại TP.HCM: Cơ sở 1 (475A Điện Biên Phủ, Q.Bình Thạnh), Cơ sở 2 (31/36 Ung Văn Khiêm, Q.Bình Thạnh), và Cơ sở 3 (288 Đỗ Xuân Hợp, Q.9).",
      },
      {
        id: 8,
        question: "Thư viện có đầy đủ tài liệu không?",
        answer:
          "Thư viện HUTECH có hơn 100,000 đầu sách, tài liệu điện tử, và các cơ sở dữ liệu trực tuyến. Sinh viên có thể truy cập 24/7 thông qua hệ thống thư viện số.",
      },
      {
        id: 9,
        question: "Ký túc xá có sẵn cho sinh viên không?",
        answer:
          "HUTECH có ký túc xá với sức chứa hơn 2,000 sinh viên. Ký túc xá được trang bị đầy đủ tiện nghi với mức phí hợp lý. Sinh viên có thể đăng ký từ năm nhất.",
      },
    ],
  },
];

function CauHoiThuongGap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDemo, setUsingDemo] = useState(false);

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.getFAQs(
        selectedCategory !== "Tất cả" ? { category: selectedCategory } : {}
      );
      if (res.success && res.data) {
        setFaqs(res.data.faqs || []);
        setUsingDemo(false);
      } else {
        throw new Error("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.warn("FAQ API failed, using demo data:", err.message);
      setError("Đang hiển thị dữ liệu mẫu");
      setFaqs([]);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [selectedCategory]);

  // Reset expanded items when category changes
  useEffect(() => {
    setExpandedItems(new Set());
  }, [selectedCategory, searchTerm]);

  // Generate floating particles
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: (i * 0.7) % 5,
        size: ["small", "medium", "large"][i % 3],
      })),
    []
  );

  const toggleItem = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Get all categories from data
  const allCategories = useMemo(() => {
    if (usingDemo || faqs.length === 0) {
      return ["Tất cả", ...DEMO_FAQ_DATA.map((cat) => cat.category)];
    }
    const cats = [...new Set(faqs.map((faq) => faq.category || "Khác"))];
    return ["Tất cả", ...cats];
  }, [faqs, usingDemo]);

  // Filter and group data
  const groupedFaqs = useMemo(() => {
    if (usingDemo || faqs.length === 0) {
      // Use demo data
      return DEMO_FAQ_DATA.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            searchTerm === "" ||
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter(
        (cat) =>
          (selectedCategory === "Tất cả" || cat.category === selectedCategory) &&
          cat.questions.length > 0
      );
    }

    // Use API data
    const filtered = faqs.filter(
      (faq) =>
        searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((faq) => {
      const cat = faq.category || "Khác";
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(faq);
    });

    return Object.entries(grouped)
      .filter(([cat]) => selectedCategory === "Tất cả" || cat === selectedCategory)
      .map(([category, questions]) => ({ category, questions }));
  }, [faqs, searchTerm, selectedCategory, usingDemo]);

  const totalQuestions = groupedFaqs.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  );

  return (
    <>
      <SEO
        title="Câu hỏi thường gặp - HUTECH"
        description="Tìm hiểu các câu hỏi thường gặp về tuyển sinh, học phí, học bổng và cơ sở vật chất tại HUTECH."
        keywords="câu hỏi thường gặp, tuyển sinh HUTECH, học phí, học bổng, cơ sở vật chất"
        canonical="/cau-hoi-thuong-gap"
      />

      <div className="min-h-screen relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <FloatingParticle
              key={particle.id}
              delay={particle.delay}
              size={particle.size}
              index={particle.id}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200/20 dark:bg-blue-500/5 animate-float" />
          <div
            className="absolute top-60 right-20 w-32 h-32 rounded-full bg-purple-200/20 dark:bg-purple-500/5 animate-float-slow"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-40 left-1/3 w-24 h-24 rounded-full bg-emerald-200/20 dark:bg-emerald-500/5 animate-float"
            style={{ animationDelay: "3s" }}
          />
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
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 relative bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 shadow-2xl animate-pulse-soft">
                <FaQuestionCircle className="text-4xl text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-pulse-soft" />
              </div>

              {/* Support badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-lg"
              >
                <div className="animate-pulse-soft">
                  <FaHeart className="text-red-500" />
                </div>
                <span className="font-semibold">Hỗ trợ 24/7</span>
                <FaStar className="text-yellow-500" />
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white"
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
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 text-gray-600 dark:text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Tìm câu trả lời cho những thắc mắc phổ biến về tuyển sinh, học phí,
                học bổng và cơ sở vật chất tại HUTECH
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  { icon: FaQuestionCircle, number: `${totalQuestions}+`, label: "Câu hỏi" },
                  { icon: FaStar, number: "24/7", label: "Hỗ trợ" },
                  { icon: FaRocket, number: "100%", label: "Miễn phí" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform"
                    animate={index === 1 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
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

        {/* Search & Filter Section */}
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
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaFilter className="text-blue-500" />
                    <span className="font-semibold">Lọc theo danh mục:</span>
                    {usingDemo && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                        Dữ liệu mẫu
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {allCategories.map((category, index) => {
                      const IconComponent =
                        categoryIcons[category] || FaQuestionCircle;
                      const isActive = selectedCategory === category;

                      return (
                        <div
                          key={category}
                          className="hover:scale-105 active:scale-95 transition-transform"
                        >
                          <Button
                            variant={isActive ? "primary" : "outline"}
                            size="md"
                            onClick={() => setSelectedCategory(category)}
                            leftIcon={
                              category !== "Tất cả" ? (
                                <IconComponent />
                              ) : (
                                <FaStar />
                              )
                            }
                            className={`transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg"
                            }`}
                          >
                            {category}
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Refresh button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchFaqs}
                      disabled={loading}
                      className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
                    >
                      <FaSync
                        className={`text-xs ${loading ? "animate-spin" : ""}`}
                      />
                      Làm mới dữ liệu
                    </button>
                    {error && (
                      <span className="text-xs text-amber-500">{error}</span>
                    )}
                  </div>
                </motion.div>
              </Card.Content>
            </Card>
          </div>
        </motion.section>

        {/* FAQ Content */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="py-16"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && faqs.length === 0 && !usingDemo ? (
              /* Loading skeleton */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-600" />
                      <div>
                        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((j) => (
                        <div
                          key={j}
                          className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : groupedFaqs.length === 0 ? (
              /* No results */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <Card
                  variant="glass"
                  className="max-w-md mx-auto backdrop-blur-xl"
                >
                  <Card.Content className="p-12">
                    <div className="mb-6 animate-float">
                      <FaLightbulb className="text-6xl mx-auto text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      Không tìm thấy câu hỏi phù hợp
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                      Hãy thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng
                      tôi để được hỗ trợ
                    </p>
                    <Button
                      variant="primary"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      leftIcon={<FaRocket />}
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("Tất cả");
                      }}
                    >
                      Xem tất cả câu hỏi
                    </Button>
                  </Card.Content>
                </Card>
              </motion.div>
            ) : (
              /* FAQ List */
              <motion.div
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {groupedFaqs.map((category, categoryIndex) => {
                  const IconComponent =
                    categoryIcons[category.category] || FaQuestionCircle;

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
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 shadow-lg animate-pulse-soft">
                              <IconComponent className="text-2xl text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                {category.category}
                              </h2>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {category.questions.length} câu hỏi
                              </p>
                            </div>
                          </div>

                          {/* Animated background gradient */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 -z-10 animate-gradient-shift" />
                        </Card.Header>

                        <Card.Content>
                          <div className="space-y-4">
                            {category.questions.map((item, index) => {
                              const itemIndex = `${categoryIndex}-${index}`;
                              const isExpanded = expandedItems.has(itemIndex);

                              return (
                                <motion.div
                                  key={item.id || index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`rounded-2xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl ${
                                    isExpanded ? "shadow-xl" : ""
                                  }`}
                                >
                                  <button
                                    onClick={() => toggleItem(itemIndex)}
                                    aria-expanded={isExpanded}
                                    aria-controls={`faq-answer-${itemIndex}`}
                                    className={`w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between ${
                                      isExpanded
                                        ? "bg-gray-100 dark:bg-gray-800/50"
                                        : "bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    }`}
                                  >
                                    <span className="font-semibold text-base md:text-lg pr-4 text-gray-900 dark:text-white">
                                      {item.question}
                                    </span>
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg flex-shrink-0"
                                      aria-hidden="true"
                                    >
                                      <FaChevronDown className="text-gray-600 dark:text-gray-300" />
                                    </motion.div>
                                  </button>

                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        id={`faq-answer-${itemIndex}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                      >
                                        <motion.div
                                          className="px-6 py-6 leading-relaxed text-lg bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300"
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

        {/* Contact Section */}
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
                  <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full animate-float" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-float-slow" />
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 animate-pulse-soft">
                    <FaHeart className="text-4xl text-red-300" />
                  </div>

                  <h2 className="text-4xl font-bold mb-4">
                    Vẫn chưa tìm được câu trả lời?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 với tất
                    cả sự nhiệt tình
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <div className="hover:scale-105 active:scale-95 transition-transform">
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaPhone />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
                        onClick={() => (window.location.href = "tel:19002088")}
                      >
                        Hotline: 1900 2088
                      </Button>
                    </div>

                    <div className="hover:scale-105 active:scale-95 transition-transform">
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaEnvelope />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
                        onClick={() =>
                          (window.location.href =
                            "mailto:tuyensinh@hutech.edu.vn")
                        }
                      >
                        Email: tuyensinh@hutech.edu.vn
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 text-white/80 animate-pulse-soft">
                    <FaStar className="text-yellow-300" />
                    <span>Phản hồi trong vòng 5 phút</span>
                    <FaStar className="text-yellow-300" />
                  </div>
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
