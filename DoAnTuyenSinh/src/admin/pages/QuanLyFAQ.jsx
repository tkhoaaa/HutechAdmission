import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaQuestionCircle,
  FaSave,
  FaTimes,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { adminAPI } from "../../utils/apiClient";
import { useDarkMode } from "../../contexts/DarkModeContext";

const CATEGORIES = [
  "Tuyển sinh",
  "Học phí",
  "Học bổng",
  "Cơ sở vật chất",
  "Chương trình đào tạo",
  "Hồ sơ",
  "Khác",
];

const QuanLyFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Tuyển sinh",
    is_active: true,
    sort_order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const { darkMode } = useDarkMode();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchFaqs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;

      const res = await adminAPI.getFAQs(params);
      if (res.success) {
        setFaqs(res.data.faqs);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total,
          totalPages: res.data.totalPages,
        }));
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách FAQ");
      console.error("Fetch FAQs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [pagination.page, categoryFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      } else {
        fetchFaqs();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddNew = () => {
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category: "Tuyển sinh",
      is_active: true,
      sort_order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      is_active: faq.isActive,
      sort_order: faq.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.question.trim()) {
      showToast("Vui lòng nhập câu hỏi", "error");
      return;
    }
    if (!formData.answer.trim()) {
      showToast("Vui lòng nhập câu trả lời", "error");
      return;
    }

    setSaving(true);
    try {
      if (editingFAQ) {
        const res = await adminAPI.updateFAQ(editingFAQ.id, formData);
        if (res.success) {
          showToast("Cập nhật FAQ thành công!");
          fetchFaqs();
        }
      } else {
        const res = await adminAPI.createFAQ(formData);
        if (res.success) {
          showToast("Tạo FAQ mới thành công!");
          setPagination((prev) => ({ ...prev, page: 1 }));
          fetchFaqs();
        }
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.message || "Lỗi khi lưu FAQ", "error");
      console.error("Save FAQ error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm(`Bạn có chắc muốn xóa câu hỏi "${faq.question}"?`)) return;

    setLoading(true);
    try {
      const res = await adminAPI.deleteFAQ(faq.id);
      if (res.success) {
        showToast("Xóa FAQ thành công!");
        fetchFaqs();
      }
    } catch (err) {
      showToast(err.message || "Lỗi khi xóa FAQ", "error");
      console.error("Delete FAQ error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (faq) => {
    try {
      const res = await adminAPI.updateFAQ(faq.id, {
        is_active: !faq.isActive,
      });
      if (res.success) {
        showToast(faq.isActive ? "Đã ẩn câu hỏi" : "Đã hiển thị câu hỏi");
        fetchFaqs();
      }
    } catch (err) {
      showToast(err.message || "Lỗi khi cập nhật trạng thái", "error");
      console.error("Toggle FAQ error:", err);
    }
  };

  const activeCount = faqs.filter((f) => f.isActive).length;
  const totalViews = faqs.reduce((sum, f) => sum + (f.viewCount || 0), 0);

  return (
    <div className={`min-h-screen p-6 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
      {/* Toast notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-2xl text-white font-semibold flex items-center gap-3 ${
              toast.type === "error"
                ? "bg-red-600"
                : "bg-emerald-600"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Elements */}
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
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 dark:bg-gradient-to-r dark:from-white dark:to-gray-300 dark:bg-clip-text dark:text-transparent">
                Quản Lý FAQ
              </h1>
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
                Quản lý câu hỏi thường gặp trên website
              </p>
            </div>
            <button
              onClick={handleAddNew}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                aria-label="Tìm kiếm câu hỏi"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Lọc theo chủ đề"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Tất cả chủ đề</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-lg text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-white/10 px-4 py-3 rounded-xl">
                <FaQuestionCircle className="mr-3 text-blue-400" />
                <span className="mr-1">{pagination.total}</span> câu hỏi
              </div>
              <button
                onClick={fetchFaqs}
                disabled={loading}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                title="Làm mới"
              >
                <FaSync className={`text-gray-600 dark:text-gray-300 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* FAQ Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng câu hỏi</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FaQuestionCircle className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Đang hiển thị</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FaEye className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tổng lượt xem</p>
                <p className="text-3xl font-bold text-purple-600">{totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaEye className="text-white text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Chủ đề</p>
                <p className="text-3xl font-bold text-orange-600">{CATEGORIES.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FaFilter className="text-white text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading && faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <FaQuestionCircle className="text-5xl mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg">Chưa có câu hỏi nào</p>
              <button
                onClick={handleAddNew}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                Thêm câu hỏi đầu tiên
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3 flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            faq.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {faq.isActive ? "Hiển thị" : "Ẩn"}
                        </span>
                        <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-semibold">
                          {faq.category}
                        </span>
                        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                          <FaEye className="text-xs" />
                          {faq.viewCount || 0} lượt xem
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                          #{faq.sortOrder || 0}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {faq.question}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {faq.answer.length > 200
                          ? `${faq.answer.substring(0, 200)}...`
                          : faq.answer}
                      </p>

                      <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-4">
                        <span>Tạo: {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString("vi-VN") : "-"}</span>
                        <span>Cập nhật: {faq.updatedAt ? new Date(faq.updatedAt).toLocaleDateString("vi-VN") : "-"}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-6">
                      <button
                        onClick={() => toggleActive(faq)}
                        className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90 ${
                          faq.isActive
                            ? "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                            : "text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-700"
                        }`}
                        title={faq.isActive ? "Ẩn câu hỏi" : "Hiển thị câu hỏi"}
                      >
                        {faq.isActive ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-3 text-blue-600 hover:bg-blue-100 hover:scale-110 active:scale-90 rounded-xl transition-all duration-200 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        className="p-3 text-red-600 hover:bg-red-100 hover:scale-110 active:scale-90 rounded-xl transition-all duration-200 dark:text-red-400 dark:hover:bg-red-900/30"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            className="mt-6 flex justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page <= 1 || loading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all text-white"
            >
              <FaChevronLeft />
            </button>
            <span className="text-gray-700 dark:text-gray-300 px-4">
              Trang {pagination.page} / {pagination.totalPages} — {pagination.total} câu hỏi
            </span>
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all text-white"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </div>

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
                className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingFAQ ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 active:scale-90 transition-all duration-200"
                    aria-label="Đóng"
                  >
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Câu hỏi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Nhập câu hỏi..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Câu trả lời <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Nhập câu trả lời..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Chủ đề
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={formData.is_active ? "true" : "false"}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="true">Hiển thị</option>
                        <option value="false">Ẩn</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Thứ tự hiển thị
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-8">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {editingFAQ ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuanLyFAQ;
