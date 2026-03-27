import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaQuestionCircle,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const QuanLyFAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "HUTECHS tuyển sinh những ngành nào?",
      answer:
        "Trường tuyển sinh đa ngành với 61 ngành đào tạo từ trình độ đại học đến tiến sĩ, chi tiết xem tại mục Thông tin tuyển sinh.",
      category: "Tuyển sinh",
      isActive: true,
      createdAt: "2025-01-20",
      views: 245,
    },
    {
      id: 2,
      question: "Học phí năm 2025 là bao nhiêu?",
      answer:
        "Học phí ổn định với nhiều chính sách học bổng hấp dẫn, tham khảo chi tiết tại website chính thức.",
      category: "Học phí",
      isActive: true,
      createdAt: "2025-01-19",
      views: 189,
    },
    {
      id: 3,
      question: "Có những loại học bổng nào?",
      answer:
        "HUTECHS có nhiều loại học bổng: học bổng tài năng, học bổng khuyến khích, học bổng hỗ trợ và các học bổng đặc biệt khác.",
      category: "Học bổng",
      isActive: true,
      createdAt: "2025-01-18",
      views: 167,
    },
    {
      id: 4,
      question: "Thời gian nộp hồ sơ xét tuyển?",
      answer:
        "Thời gian nộp hồ sơ từ tháng 3 đến tháng 8 năm 2025. Thí sinh có thể nộp hồ sơ trực tuyến qua website hoặc trực tiếp tại trường.",
      category: "Hồ sơ",
      isActive: true,
      createdAt: "2025-01-17",
      views: 298,
    },
  ]);

  const [categories] = useState([
    "Tuyển sinh",
    "Học phí",
    "Học bổng",
    "Chương trình đào tạo",
    "Hồ sơ",
    "Khác",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Tuyển sinh",
    isActive: true,
  });

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category: "Tuyển sinh",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingFAQ) {
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingFAQ.id ? { ...faq, ...formData } : faq
        )
      );
    } else {
      const newFAQ = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        views: 0,
      };
      setFaqs((prev) => [newFAQ, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    }
  };

  const toggleActive = (id) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Quản Lý FAQ
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              Quản lý câu hỏi thường gặp trên website
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
          >
            <FaPlus className="mr-2" />
            Thêm câu hỏi mới
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tất cả chủ đề</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Stats */}
          <div className="flex items-center text-lg text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
            <FaQuestionCircle className="mr-3 text-blue-500" />
            Tổng cộng: <span className="font-bold ml-1">{faqs.length}</span> câu
            hỏi
          </div>
        </div>
      </motion.div>

      {/* FAQ Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng câu hỏi</p>
              <p className="text-3xl font-bold text-gray-900">{faqs.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FaQuestionCircle className="text-white text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang hiển thị</p>
              <p className="text-3xl font-bold text-green-600">
                {faqs.filter((faq) => faq.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FaEye className="text-white text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lượt xem</p>
              <p className="text-3xl font-bold text-purple-600">
                {faqs.reduce((total, faq) => total + faq.views, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaEye className="text-white text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chủ đề</p>
              <p className="text-3xl font-bold text-orange-600">
                {categories.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <FaFilter className="text-white text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="divide-y divide-gray-200">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full mr-3 ${
                        faq.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {faq.isActive ? "Hiển thị" : "Ẩn"}
                    </span>
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {faq.category}
                    </span>
                    <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {faq.views} lượt xem
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {faq.answer.length > 200
                      ? `${faq.answer.substring(0, 200)}...`
                      : faq.answer}
                  </p>

                  <div className="text-sm text-gray-500">
                    Tạo ngày: {faq.createdAt}
                  </div>
                </div>

                <div className="flex space-x-2 ml-6">
                  <button
                    onClick={() => toggleActive(faq.id)}
                    className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90 ${
                      faq.isActive
                        ? "text-green-600 hover:bg-green-100"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={faq.isActive ? "Ẩn câu hỏi" : "Hiển thị câu hỏi"}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-3 text-blue-600 hover:bg-blue-100 hover:scale-110 active:scale-90 rounded-xl transition-all duration-200"
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-3 text-red-600 hover:bg-red-100 hover:scale-110 active:scale-90 rounded-xl transition-all duration-200"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingFAQ ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 hover:scale-110 active:scale-90 transition-all duration-200"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Câu hỏi
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Câu trả lời
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Nhập câu trả lời..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chủ đề
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.value === "true",
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value={true}>Hiển thị</option>
                        <option value={false}>Ẩn</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-lg"
                  >
                    <FaSave className="mr-2" />
                    {editingFAQ ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default QuanLyFAQ;
