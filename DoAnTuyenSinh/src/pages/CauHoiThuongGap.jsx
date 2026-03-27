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
  FaFilter,
  FaBookOpen,
  FaUsers,
  FaAward
} from "react-icons/fa";
import SEO from "../components/SEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

// Enhanced animation variants (entrance only - no infinite loops)
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

// Floating particle component with deterministic positioning
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
      className={`absolute rounded-full ${sizeClasses[size]} bg-blue-500/10 dark:bg-blue-400/20 animate-particle-rise`}
      style={{
        left: `${xPos}%`,
        top: `${yPos}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    />
  );
};

// Category icon mapping
const categoryIcons = {
  "Tuyen sinh": FaGraduationCap,
  "Hoc phi & Hoc bong": FaMoneyBillWave,
  "Co so vat chat": FaBuilding
};

const faqData = [
  {
    category: "Tuyen sinh",
    questions: [
      {
        question: "HUTECH co bao nhieu phuong thuc xet tuyen?",
        answer:
          "HUTECH co 4 phuong thuc xet tuyen: Xet tuyen hoc ba THPT, Xet tuyen ket qua thi THPT Quoc gia, Xet tuyen ket qua thi danh gia nang luc, va Xet tuyen thang theo quy dinh cua Bo GD&DT.",
      },
      {
        question: "Thoi gian nhan ho so xet tuyen khi nao?",
        answer:
          "Thoi gian nhan ho so xet tuyen thuong bat dau tu thang 3 va keo dai den thang 8 hang nam. Ban co the theo doi thong tin chi tiet tren website chinh thuc cua truong.",
      },
      {
        question: "HUTECH co bao nhieu nganh dao tao?",
        answer:
          "HUTECH co hon 50 nganh dao tao thuoc cac linh vuc: Cong nghe thong tin, Kinh te - Quan tri, Ky thuat, Ngoai ngu, Du lich, Y te va nhieu nganh khac.",
      },
    ],
  },
  {
    category: "Hoc phi & Hoc bong",
    questions: [
      {
        question: "Hoc phi tai HUTECH nhu the nao?",
        answer:
          "Hoc phi tai HUTECH duoc tinh theo tin chi va thay doi theo tung nganh hoc. Muc hoc phi trung binh tu 15-25 trieu dong/nam hoc. Truong co nhieu chinh sach ho tro hoc phi cho sinh vien.",
      },
      {
        question: "Co nhung loai hoc bong nao?",
        answer:
          "HUTECH co nhieu loai hoc bong: Hoc bong khuyen khich hoc tap, Hoc bong tai nang, Hoc bong ho tro sinh vien ngheo, Hoc bong tu cac doanh nghiep doi tac.",
      },
      {
        question: "Lam the nao de dang ky hoc bong?",
        answer:
          "Ban co the dang ky hoc bong thong qua form online tren website hoac lien he truc tiep voi phong Cong tac sinh vien de duoc huong dan chi tiet.",
      },
    ],
  },
  {
    category: "Co so vat chat",
    questions: [
      {
        question: "HUTECH co nhung co so nao?",
        answer:
          "HUTECH co 3 co so chinh tai TP.HCM: Co so 1 (475A Dien Bien Phu, Q.Binh Thanh), Co so 2 (31/36 Ung Van Khiem, Q.Binh Thanh), va Co so 3 (288 Do Xuan Hop, Q.9).",
      },
      {
        question: "Thu vien co day du tai lieu khong?",
        answer:
          "Thu vien HUTECH co hon 100,000 dau sach, tai lieu dien tu, va cac co so du lieu truc tuyen. Sinh vien co the truy cap 24/7 thong qua he thong thu vien so.",
      },
      {
        question: "Ky tuc xa co san cho sinh vien khong?",
        answer:
          "HUTECH co ky tuc xa voi suc chua hon 2,000 sinh vien. Ky tuc xa duoc trang bi day du tien nghi voi muc phi hop ly. Sinh vien co the dang ky tu nam nhat.",
      },
    ],
  },
];

function CauHoiThuongGap() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Generate floating particles with deterministic values
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: (i * 0.7) % 5,
    size: ["small", "medium", "large"][i % 3]
  }));

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
        category.category === "Tat ca" || category.category === "Tat ca"
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

  const allCategories = ["Tat ca", ...faqData.map((cat) => cat.category)];

  return (
    <>
      <SEO
        title="Cau hoi thuong gap - HUTECH"
        description="Tim hieu cac cau hoi thuong gap ve tuyen sinh, hoc phi, hoc bong va co so vat chat tai HUTECH."
        keywords="cau hoi thuong gap, tuyen sinh HUTECH, hoc phi, hoc bong, co so vat chat"
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

        {/* Floating geometric shapes - CSS animated */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-200/20 dark:bg-blue-500/5 animate-float" />
          <div className="absolute top-60 right-20 w-32 h-32 rounded-full bg-purple-200/20 dark:bg-purple-500/5 animate-float-slow" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-40 left-1/3 w-24 h-24 rounded-full bg-emerald-200/20 dark:bg-emerald-500/5 animate-float" style={{ animationDelay: "3s" }} />
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
              {/* Animated icon - CSS pulse */}
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
                <span className="font-semibold">Ho tro 24/7</span>
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
                  Cau hoi thuong gap
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 text-gray-600 dark:text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Tim cau tra loi cho nhung thac mac pho bien ve tuyen sinh, hoc phi, hoc bong va co so vat chat tai HUTECH
              </motion.p>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {[
                  { icon: FaBookOpen, number: "50+", label: "Cau hoi" },
                  { icon: FaUsers, number: "24/7", label: "Ho tro" },
                  { icon: FaAward, number: "100%", label: "Mien phi" }
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
                    placeholder="Tim kiem cau hoi cua ban..."
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
                    <span className="font-semibold">Loc theo danh muc:</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {allCategories.map((category, index) => {
                      const IconComponent = categoryIcons[category] || FaQuestionCircle;

                      return (
                        <div
                          key={category}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="hover:scale-105 active:scale-95 transition-transform"
                        >
                          <Button
                            variant={index === 0 ? "primary" : "outline"}
                            size="md"
                            onClick={() => {}}
                            leftIcon={category !== "Tat ca" ? <IconComponent /> : <FaStar />}
                            className={`transition-all duration-300 ${
                              index === 0
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                : `border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg`
                            }`}
                          >
                            {category}
                          </Button>
                        </div>
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
                    <div className="mb-6 animate-float">
                      <FaLightbulb className="text-6xl mx-auto text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      Khong tim thay cau hoi phu hop
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                      Hay thu tim kiem voi tu khoa khac hoac lien he voi chung toi de duoc ho tro
                    </p>
                    <Button
                      variant="primary"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      leftIcon={<FaRocket />}
                    >
                      Lien he ho tro
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
                {faqData.map((category, categoryIndex) => {
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
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 shadow-lg animate-pulse-soft">
                              <IconComponent className="text-2xl text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                {category.category}
                              </h2>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {category.questions.length} cau hoi
                              </p>
                            </div>
                          </div>

                          {/* Animated background gradient - CSS based */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 -z-10 animate-gradient-shift" />
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
                                        ? 'bg-gray-100 dark:bg-gray-800/50'
                                        : 'bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`}
                                  >
                                    <span className="font-semibold text-base md:text-lg pr-4 text-gray-900 dark:text-white truncate">
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
                {/* Floating elements - CSS based */}
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
                    Van chua tim duoc cau tra loi?
                  </h2>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Doi ngu tu van cua chung toi luon san sang ho tro ban 24/7 voi tat ca su nhiet tinh
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <div className="hover:scale-105 active:scale-95 transition-transform">
                      <Button
                        variant="outline"
                        size="lg"
                        leftIcon={<FaPhone />}
                        className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm font-bold shadow-xl"
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
                      >
                        Email: tuyen sinh@hutech.edu.vn
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2 text-white/80 animate-pulse-soft">
                    <FaStar className="text-yellow-300" />
                    <span>Phan hoi trong vong 5 phut</span>
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
