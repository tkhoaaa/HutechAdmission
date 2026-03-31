import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { UserContext } from '../../accounts/UserContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { DEMO_APPLICATIONS, DEMO_MAJORS } from '../../config/demoData';
import ApplicationDetailModal from '../../components/ApplicationDetailModal';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendar,
  FaIdCard,
  FaFileAlt,
  FaCheckCircle,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

const QuanLyHoSo = () => {
  const { isDemoMode } = useContext(UserContext);
  const { darkMode } = useDarkMode();

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [majors, setMajors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorBannerMessage, setErrorBannerMessage] = useState('');

  // Initial load
  useEffect(() => {
    fetchMajors();
    fetchApplications();
  }, []);

  // Reload when demo mode changes
  useEffect(() => {
    if (isDemoMode !== undefined) {
      fetchMajors();
      fetchApplications();
    }
  }, [isDemoMode]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch applications when filters change
  useEffect(() => {
    fetchApplications();
  }, [statusFilter, majorFilter, debouncedSearchTerm]);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, majorFilter, debouncedSearchTerm]);

  // Set filtered applications from API response
  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      setShowErrorBanner(false);

      const isDemo = isDemoMode || localStorage.getItem("demoMode") === "true";

      if (isDemo) {
        if (!DEMO_APPLICATIONS || DEMO_APPLICATIONS.length === 0) {
          const msg = "Demo data không có sẵn. Vui lòng thử lại.";
          setErrorBannerMessage(msg);
          setShowErrorBanner(true);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        let filteredData = [...DEMO_APPLICATIONS];

        if (statusFilter !== 'all') {
          filteredData = filteredData.filter(app => app.status === statusFilter);
        }

        if (majorFilter !== 'all') {
          filteredData = filteredData.filter(app => app.major_name === majorFilter);
        }

        if (debouncedSearchTerm) {
          const searchLower = debouncedSearchTerm.toLowerCase();
          filteredData = filteredData.filter(app =>
            (app.ho_ten || app.studentName || '').toLowerCase().includes(searchLower) ||
            (app.email || '').toLowerCase().includes(searchLower) ||
            (app.application_code || '').toLowerCase().includes(searchLower)
          );
        }

        setApplications(filteredData);
        setError('');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3001/api/admin/applications', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          major: majorFilter !== 'all' ? majorFilter : undefined,
          search: debouncedSearchTerm || undefined
        }
      });

      if (response.data.success) {
        setApplications(response.data.data.applications);
      } else {
        setApplications([]);
      }
    } catch {
      const msg = 'Không thể tải danh sách hồ sơ. Vui lòng kiểm tra kết nối server.';
      setErrorBannerMessage(msg);
      setShowErrorBanner(true);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const isDemo = isDemoMode || localStorage.getItem("demoMode") === "true";

      if (isDemo) {
        if (DEMO_MAJORS && DEMO_MAJORS.length > 0) {
          setMajors(DEMO_MAJORS.map(major => ({ name: major.ten_nganh })));
        } else {
          setMajors([
            { name: "Công nghệ Thông tin" },
            { name: "Quản trị Kinh doanh" },
            { name: "Kế toán" },
            { name: "Thiết kế Đồ họa" }
          ]);
        }
        return;
      }

      const response = await axios.get('http://localhost:3001/api/auth/majors');
      if (response.data.success) {
        setMajors(response.data.data);
      }
    } catch {
      setMajors([
        { name: "Công nghệ Thông tin" },
        { name: "Quản trị Kinh doanh" },
        { name: "Kỹ thuật Cơ khí" },
        { name: "Kế toán" }
      ]);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      if (isDemoMode) {
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );

        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication(prev => ({ ...prev, status: newStatus }));
        }
        toast.success('Trạng thái hồ sơ đã được cập nhật (Demo mode)');
        return;
      }

      const response = await axios.put(`http://localhost:3001/api/admin/applications/${applicationId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setApplications(prev =>
          prev.map(app =>
            app.id === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );

        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch {
      const msg = 'Không thể cập nhật trạng thái hồ sơ';
      setErrorBannerMessage(msg);
      setShowErrorBanner(true);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        text: "Chờ xử lý",
        light: "bg-yellow-100 text-yellow-800",
        dark: "bg-yellow-900/40 text-yellow-300",
        icon: FaClock
      },
      approved: {
        text: "Đã duyệt",
        light: "bg-green-100 text-green-800",
        dark: "bg-green-900/40 text-green-300",
        icon: FaCheck
      },
      rejected: {
        text: "Từ chối",
        light: "bg-red-100 text-red-800",
        dark: "bg-red-900/40 text-red-300",
        icon: FaTimes
      }
    };
    const config = statusConfig[status];
    const colorClass = darkMode ? config.dark : config.light;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${colorClass}`}>
        <Icon className="text-xs" />
        {config.text}
      </span>
    );
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const getMajorColor = (major) => {
    const colors = {
      "Công nghệ Thông tin": "from-blue-500 to-blue-600",
      "Quản trị Kinh doanh": "from-green-500 to-green-600",
      "Kỹ thuật Cơ khí": "from-purple-500 to-purple-600",
      "Kế toán": "from-orange-500 to-orange-600"
    };
    return colors[major] || "from-gray-500 to-gray-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const bg = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
  const textColor = darkMode ? "text-gray-200" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-600";
  const textMuted2 = darkMode ? "text-gray-500" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-800/80" : "bg-white/80";
  const cardBgSolid = darkMode ? "bg-gray-800" : "bg-white";
  const filterBg = darkMode ? "bg-gray-800/50" : "bg-white/5";
  const filterBorder = darkMode ? "border-gray-700" : "border-white/10";
  const inputBg = darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900";
  const inputPlaceholder = darkMode ? "placeholder-gray-400" : "placeholder-gray-400";
  const listItemHover = darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50/50";
  const modalBg = darkMode ? "bg-gray-800" : "bg-white";
  const modalBorder = darkMode ? "border-gray-700" : "border-gray-200";
  const modalText = darkMode ? "text-gray-100" : "text-gray-900";
  const modalTextMuted = darkMode ? "text-gray-400" : "text-gray-600";
  const sectionBg = darkMode ? "bg-gray-700/30" : "bg-gray-50";
  const dividerColor = darkMode ? "divide-gray-700" : "divide-gray-200";

  // Error banner
  const dismissErrorBanner = () => {
    setShowErrorBanner(false);
    setErrorBannerMessage('');
  };

  return (
    <div className={`min-h-screen ${bg} p-6 relative overflow-hidden`}>
      {/* Modern Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {showErrorBanner && errorBannerMessage && (
          <motion.div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FaTimes className="text-lg flex-shrink-0" />
                <span className="font-medium">{errorBannerMessage}</span>
              </div>
              <button
                onClick={dismissErrorBanner}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Đóng thông báo lỗi"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? "text-white" : "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent"}`}>
                Quản Lý Hồ Sơ
              </h1>
              <p className={`text-base md:text-lg ${textMuted}`}>
                Quản lý hồ sơ xét tuyển của thí sinh
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Refresh Button */}
              <motion.button
                onClick={fetchApplications}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white/80 text-gray-700 hover:bg-white"}`}
                title="Làm mới dữ liệu"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                <span className="hidden sm:inline text-sm font-medium">Làm mới</span>
              </motion.button>

              <motion.div
                className={`px-4 py-2 rounded-xl shadow-lg ${cardBg}`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <span className={`text-sm ${textMuted}`}>Tổng hồ sơ: </span>
                <span className={`font-bold ${darkMode ? "text-purple-400" : "text-purple-500"}`}>
                  {applications.length}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className={`${filterBg} backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border ${filterBorder}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${textMuted} text-lg`} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, CCCD..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Tìm kiếm hồ sơ"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputBg} ${inputPlaceholder}`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Lọc theo trạng thái"
              className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputBg}`}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>

            {/* Major Filter */}
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              aria-label="Lọc theo ngành"
              className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${inputBg}`}
            >
              <option value="all">Tất cả ngành</option>
              {majors.map(major => (
                <option key={major.name} value={major.name}>{major.name}</option>
              ))}
            </select>

            {/* Stats */}
            <div className={`flex items-center text-lg ${textMuted} px-4 py-3 rounded-xl ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
              <FaFileAlt className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
              Kết quả: <span className={`font-bold ml-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{filteredApplications.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          className={`${cardBg} backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Compact Inline Loading Indicator */}
          {loading && (
            <div className={`flex items-center justify-center gap-3 py-4 ${borderColor} border-b`}>
              <div className={`animate-spin rounded-full h-5 w-5 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-600"}`}></div>
              <span className={`text-sm ${textMuted}`}>
                {isDemoMode ? 'Đang tải dữ liệu demo...' : 'Đang tải dữ liệu...'}
              </span>
            </div>
          )}

          <div className={`divide-y ${dividerColor}`}>
            {!loading && filteredApplications.length === 0 ? (
              <div className={`p-8 text-center ${textMuted}`}>
                <FaFileAlt className={`mx-auto text-4xl mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>Không có hồ sơ nào</h3>
                <p>Không tìm thấy hồ sơ phù hợp với bộ lọc hiện tại.</p>
              </div>
            ) : (
              paginatedApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 ${listItemHover} transition-all duration-300 ${borderColor} border-b last:border-b-0`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getMajorColor(app.major_name || app.major)} rounded-xl flex items-center justify-center mr-4`}>
                        {app.avatar || (app.user && app.user.avatar) ? (
                          <img
                            src={app.avatar || (app.user && app.user.avatar)}
                            alt={app.ho_ten || app.studentName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <FaGraduationCap className="text-white text-lg" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${textColor}`}>
                          {app.ho_ten || app.studentName}
                        </h3>
                        <p className={textMuted}>{app.major_name || app.major}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                        <FaEnvelope className={darkMode ? "text-blue-400" : "text-blue-500"} />
                        {app.email}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                        <FaPhone className={darkMode ? "text-green-400" : "text-green-500"} />
                        {app.sdt || app.phone || 'Chưa có'}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                        <FaIdCard className={darkMode ? "text-purple-400" : "text-purple-500"} />
                        {app.cccd || 'Chưa có'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-4 text-sm ${textMuted2}`}>
                        <span className="flex items-center gap-1">
                          <FaCalendar className={darkMode ? "text-orange-400" : "text-orange-500"} />
                          {formatDate(app.created_at || app.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          GPA: {app.gpa || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          {app.phuong_thuc_xet_tuyen || 'Chưa rõ'}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className={`p-3 ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-100"} rounded-xl transition-all duration-200 hover:scale-110 active:scale-90`}
                          title="Xem chi tiết"
                          aria-label="Xem chi tiết hồ sơ"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, "approved")}
                          className={`p-3 ${darkMode ? "text-green-400 hover:bg-green-900/30" : "text-green-600 hover:bg-green-100"} rounded-xl transition-all duration-200 hover:scale-110 active:scale-90`}
                          title="Duyệt hồ sơ"
                          aria-label="Duyệt hồ sơ"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, "rejected")}
                          className={`p-3 ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-100"} rounded-xl transition-all duration-200 hover:scale-110 active:scale-90`}
                          title="Từ chối"
                          aria-label="Từ chối hồ sơ"
                        >
                          <FaTimes />
                        </button>
                        <button
                          className={`p-3 ${darkMode ? "text-purple-400 hover:bg-purple-900/30" : "text-purple-600 hover:bg-purple-100"} rounded-xl transition-all duration-200 hover:scale-110 active:scale-90`}
                          title="Tải xuống"
                          aria-label="Tải xuống hồ sơ"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && filteredApplications.length > ITEMS_PER_PAGE && (
            <div className={`flex items-center justify-center gap-4 py-4 ${borderColor} border-t`}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? `${textMuted2} cursor-not-allowed opacity-50`
                    : `${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} hover:scale-110 active:scale-90`
                }`}
                aria-label="Trang trước"
              >
                <FaChevronLeft />
              </button>

              <span className={`text-sm font-medium ${textColor}`}>
                Trang {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? `${textMuted2} cursor-not-allowed opacity-50`
                    : `${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} hover:scale-110 active:scale-90`
                }`}
                aria-label="Trang sau"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detail Modal — rendered via Portal to document.body, z-[1000]+ */}
      <ApplicationDetailModal
        app={selectedApplication}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        darkMode={darkMode}
        onApprove={(id, status) => {
          handleStatusChange(id, status);
          setShowDetailModal(false);
        }}
      />
    </div>
  );
};

export default QuanLyHoSo;
