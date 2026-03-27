import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { UserContext } from '../../accounts/UserContext';
import { DEMO_APPLICATIONS, DEMO_MAJORS } from '../../config/demoData';
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
  FaCheckCircle
} from 'react-icons/fa';

const QuanLyHoSo = () => {
  const { isDemoMode } = useContext(UserContext);
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

  // Set filtered applications from API response
  useEffect(() => {
    setFilteredApplications(applications);
  }, [applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const isDemo = isDemoMode || localStorage.getItem("demoMode") === "true";

      if (isDemo) {
        if (!DEMO_APPLICATIONS || DEMO_APPLICATIONS.length === 0) {
          setError("Demo data không có sẵn. Vui lòng thử lại.");
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
            app.ho_ten.toLowerCase().includes(searchLower) ||
            app.email.toLowerCase().includes(searchLower) ||
            app.application_code.toLowerCase().includes(searchLower)
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
      setError('Không thể tải danh sách hồ sơ. Vui lòng kiểm tra kết nối server.');
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
        alert(`Trạng thái hồ sơ đã được cập nhật (Demo mode)`);
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
      alert('Không thể cập nhật trạng thái hồ sơ');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800", icon: FaClock },
      approved: { text: "Đã duyệt", color: "bg-green-100 text-green-800", icon: FaCheck },
      rejected: { text: "Từ chối", color: "bg-red-100 text-red-800", icon: FaTimes }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${config.color}`}>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isDemoMode ? 'Đang tải dữ liệu demo...' : 'Đang tải dữ liệu...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              fetchApplications();
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Quản Lý Hồ Sơ</h1>
            <p className="text-gray-300 text-lg">Quản lý hồ sơ xét tuyển của thí sinh</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <span className="text-sm text-gray-300">Tổng hồ sơ: </span>
              <span className="font-bold text-purple-400">{applications.length}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, CCCD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">Tất cả ngành</option>
            {majors.map(major => (
              <option key={major.name} value={major.name}>{major.name}</option>
            ))}
          </select>

          {/* Stats */}
          <div className="flex items-center text-lg text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
            <FaFileAlt className="mr-3 text-blue-500" />
            Kết quả: <span className="font-bold ml-1">{filteredApplications.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="divide-y divide-gray-200">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaFileAlt className="mx-auto text-4xl mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">Không có hồ sơ nào</h3>
              <p>Không tìm thấy hồ sơ phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50/50 transition-all duration-300"
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
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {app.ho_ten || app.studentName}
                      </h3>
                      <p className="text-gray-600">{app.major_name || app.major}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-blue-500" />
                      {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-green-500" />
                      {app.sdt || app.phone || 'Chưa có'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaIdCard className="text-purple-500" />
                      {app.cccd || 'Chưa có'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-orange-500" />
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
                        className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "approved")}
                        className="p-3 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Duyệt hồ sơ"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Từ chối"
                      >
                        <FaTimes />
                      </button>
                      <button
                        className="p-3 text-purple-600 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Tải xuống"
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
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedApplication && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowDetailModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="relative bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Chi tiết hồ sơ - {selectedApplication.studentName}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 hover:scale-110 active:scale-90 transition-all duration-200"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-blue-500" />
                        Thông tin cá nhân
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Họ và tên:</span>
                          <span className="font-semibold">{selectedApplication.studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-semibold">{selectedApplication.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Số điện thoại:</span>
                          <span className="font-semibold">{selectedApplication.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CCCD:</span>
                          <span className="font-semibold">{selectedApplication.cccd}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-green-500" />
                        Thông tin học tập
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngành học:</span>
                          <span className="font-semibold">{selectedApplication.major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phương thức xét tuyển:</span>
                          <span className="font-semibold">{selectedApplication.admissionMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">GPA:</span>
                          <span className="font-semibold">{selectedApplication.gpa}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaFileAlt className="text-purple-500" />
                        Tài liệu đính kèm
                      </h4>
                      <div className="space-y-2">
                        {Array.isArray(selectedApplication.attachments) && selectedApplication.attachments.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedApplication.attachments.map((file, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={file.startsWith('http') ? file : `/uploads/${file}`}
                                  alt={`attachment-${idx}`}
                                  className="w-full h-32 object-cover rounded-lg border shadow cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => window.open(file.startsWith('http') ? file : `/uploads/${file}`, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic">Không có file đính kèm</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaClock className="text-orange-500" />
                        Thông tin xử lý
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ngày nộp:</span>
                          <span className="font-semibold">{formatDate(selectedApplication.submittedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trạng thái:</span>
                          {getStatusBadge(selectedApplication.status)}
                        </div>
                        {selectedApplication.assignedTo && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Người xử lý:</span>
                            <span className="font-semibold">{selectedApplication.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, "approved")}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-lg"
                  >
                    <FaCheck className="mr-2 inline" />
                    Duyệt hồ sơ
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

export default QuanLyHoSo;
