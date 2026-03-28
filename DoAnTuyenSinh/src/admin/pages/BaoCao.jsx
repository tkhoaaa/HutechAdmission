import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import {
  FaChartBar, FaChartPie, FaChartLine, FaFilter, FaDownload,
  FaCalendarAlt, FaIndustry, FaCheckCircle, FaTimesCircle, FaClock,
  FaSync, FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { useUser } from "../../accounts/UserContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { buildApiUrl } from "../../config/apiConfig";

const BaoCao = () => {
  const { isDemoMode } = useUser();
  const { darkMode } = useDarkMode();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const demoData = {
    industryStats: [
      { name: "CNTT", applications: 345, percentage: 28 },
      { name: "Kinh tế", applications: 287, percentage: 23 },
      { name: "QTKD", applications: 234, percentage: 19 },
      { name: "Kế toán", applications: 198, percentage: 16 },
      { name: "Thiết kế", applications: 156, percentage: 12 },
      { name: "Khác", applications: 27, percentage: 2 },
    ],
    statusStats: [
      { name: "Chờ duyệt", value: 89, color: "#fbbf24" },
      { name: "Đã duyệt", value: 876, color: "#10b981" },
      { name: "Từ chối", value: 282, color: "#ef4444" },
    ],
    timeSeriesData: [
      { month: "T1", applications: 45, approved: 38, rejected: 7 },
      { month: "T2", applications: 52, approved: 44, rejected: 8 },
      { month: "T3", applications: 78, approved: 65, rejected: 13 },
      { month: "T4", applications: 95, approved: 82, rejected: 13 },
      { month: "T5", applications: 120, approved: 105, rejected: 15 },
      { month: "T6", applications: 156, approved: 134, rejected: 22 },
      { month: "T7", applications: 189, approved: 162, rejected: 27 },
      { month: "T8", applications: 234, approved: 198, rejected: 36 },
      { month: "T9", applications: 267, approved: 234, rejected: 33 },
      { month: "T10", applications: 298, approved: 267, rejected: 31 },
      { month: "T11", applications: 312, approved: 284, rejected: 28 },
      { month: "T12", applications: 324, approved: 298, rejected: 26 },
    ],
    topSchools: [
      { name: "THPT Nguyễn Thị Minh Khai", applications: 89, city: "TP.HCM" },
      { name: "THPT Lê Hồng Phong", applications: 76, city: "TP.HCM" },
      { name: "THPT Trần Đại Nghĩa", applications: 67, city: "TP.HCM" },
      { name: "THPT Nguyễn Thượng Hiền", applications: 54, city: "TP.HCM" },
      { name: "THPT Gia Định", applications: 43, city: "TP.HCM" },
    ],
    admissionMethods: [
      { method: "Học bạ THPT", count: 876, percentage: 70 },
      { method: "Thi THPT", count: 298, percentage: 24 },
      { method: "Đánh giá năng lực", count: 73, percentage: 6 },
    ],
    overview: {
      total: 1247,
      approved: 876,
      pending: 89,
      rejected: 282,
      approvalRate: 70.2,
    },
  };

  const [reportData, setReportData] = useState(demoData);

  useEffect(() => {
    if (isDemoMode) {
      setReportData(demoData);
      setLoading(false);
    } else {
      fetchReportData();
    }
  }, [selectedYear, selectedMonth, selectedIndustry, selectedStatus, isDemoMode]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        year: selectedYear,
        month: selectedMonth,
        industry: selectedIndustry,
        status: selectedStatus,
      });

      const [overviewRes, industryRes, statusRes, timeSeriesRes, schoolsRes, methodsRes] = await Promise.all([
        fetch(`${buildApiUrl("/api/admin/reports/overview")}?${params}`),
        fetch(`${buildApiUrl("/api/admin/reports/industry-stats")}?${params}`),
        fetch(`${buildApiUrl("/api/admin/reports/status-stats")}?${params}`),
        fetch(`${buildApiUrl("/api/admin/reports/time-series")}?${params}`),
        fetch(`${buildApiUrl("/api/admin/reports/top-schools")}?${params}`),
        fetch(`${buildApiUrl("/api/admin/reports/admission-methods")}?${params}`),
      ]);

      const [overviewData, industryData, statusData, timeSeriesData, schoolsData, methodsData] = await Promise.all([
        overviewRes.json(),
        industryRes.json(),
        statusRes.json(),
        timeSeriesRes.json(),
        schoolsRes.json(),
        methodsRes.json(),
      ]);

      if (
        overviewData.success && industryData.success && statusData.success &&
        timeSeriesData.success && schoolsData.success && methodsData.success
      ) {
        setReportData({
          overview: overviewData.data,
          industryStats: industryData.data,
          statusStats: statusData.data,
          timeSeriesData: timeSeriesData.data,
          topSchools: schoolsData.data,
          admissionMethods: methodsData.data,
        });
      } else {
        throw new Error("Một số API trả về lỗi");
      }
    } catch {
      setError("Không thể kết nối server. Hiển thị dữ liệu mẫu.");
      setReportData(demoData);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    // Placeholder - implement export logic
  };

  // Dark mode chart colors
  const chartTextColor = darkMode ? "#9ca3af" : "#374151";
  const chartGridColor = darkMode ? "#374151" : "#e5e7eb";

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
              Báo cáo thống kê
            </h1>
            <p className={`text-sm md:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Thống kê chi tiết về hồ sơ tuyển sinh và hiệu suất hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchReportData}
              disabled={loading}
              className={`p-3 rounded-xl border transition-all duration-200 ${darkMode ? "bg-gray-800/70 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600" : "bg-white/80 border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"} disabled:opacity-50`}
              title="Làm mới dữ liệu"
              aria-label="Làm mới dữ liệu"
            >
              <FaSync className={`text-lg ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => exportReport("pdf")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-sm"
            >
              <FaDownload />
              Xuất PDF
            </button>
            <button
              onClick={() => exportReport("excel")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-sm"
            >
              <FaDownload />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-5 py-4 rounded-2xl border-l-4 flex items-center gap-4 ${
              darkMode ? "bg-amber-900/20 border-amber-500 text-amber-300" : "bg-amber-50 border-amber-400 text-amber-800"
            }`}
          >
            <FaClock className="text-amber-500 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{error}</p>
            <button onClick={() => setError("")} className="text-amber-500 hover:text-amber-700 text-sm font-bold">
              Đóng
            </button>
          </motion.div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mb-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Filters */}
        <div className={`rounded-2xl border p-6 mb-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className={`${darkMode ? "text-purple-400" : "text-purple-500"}`} />
            <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Bộ lọc</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <FaCalendarAlt className="inline mr-1" /> Năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <FaCalendarAlt className="inline mr-1" /> Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <option value="all">Tất cả tháng</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>Tháng {month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <FaIndustry className="inline mr-1" /> Ngành học
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <option value="all">Tất cả ngành</option>
                {reportData.industryStats.map((industry) => (
                  <option key={industry.name} value={industry.name}>{industry.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
                <FaCheckCircle className="inline mr-1" /> Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {[
            { label: "Tổng hồ sơ", value: reportData.overview?.total || demoData.overview.total, icon: FaChartBar, color: "blue", trend: "+12.5%" },
            { label: "Đã duyệt", value: reportData.overview?.approved || demoData.overview.approved, icon: FaCheckCircle, color: "green", trend: `${reportData.overview?.approvalRate || demoData.overview.approvalRate}% duyệt` },
            { label: "Chờ duyệt", value: reportData.overview?.pending || demoData.overview.pending, icon: FaClock, color: "yellow", trend: `${reportData.overview?.total > 0 ? ((reportData.overview?.pending || 0) / reportData.overview?.total * 100).toFixed(1) : 0}% tổng` },
            { label: "Từ chối", value: reportData.overview?.rejected || demoData.overview.rejected, icon: FaTimesCircle, color: "red", trend: `${reportData.overview?.total > 0 ? ((reportData.overview?.rejected || 0) / reportData.overview?.total * 100).toFixed(1) : 0}% tổng` },
          ].map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{card.label}</p>
                  <p className={`text-2xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>{card.value.toLocaleString()}</p>
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{card.trend}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                  card.color === "blue" ? "from-blue-500 to-blue-600" :
                  card.color === "green" ? "from-green-500 to-green-600" :
                  card.color === "yellow" ? "from-yellow-500 to-yellow-600" :
                  "from-red-500 to-red-600"
                }`}>
                  <card.icon className="text-white text-lg" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <div className="flex items-center gap-2 mb-4">
              <FaChartBar className="text-blue-500" />
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Thống kê theo ngành học</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={reportData.industryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: darkMode ? "#e5e7eb" : "#374151",
                  }}
                />
                <Legend wrapperStyle={{ color: chartTextColor }} />
                <Bar dataKey="applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <div className="flex items-center gap-2 mb-4">
              <FaChartPie className="text-green-500" />
              <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Phân bố trạng thái</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={reportData.statusStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                    borderRadius: "8px",
                    color: darkMode ? "#e5e7eb" : "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className={`rounded-2xl border p-6 mb-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-purple-500" />
            <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Xu hướng hồ sơ theo thời gian</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="month" tick={{ fill: chartTextColor, fontSize: 12 }} />
              <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  color: darkMode ? "#e5e7eb" : "#374151",
                }}
              />
              <Legend wrapperStyle={{ color: chartTextColor }} />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="rejected" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Row: Schools + Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Schools */}
          <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <h3 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Top trường THPT</h3>
            <div className="space-y-3">
              {reportData.topSchools.map((school, index) => (
                <div
                  key={school.name}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    darkMode ? "bg-gray-700/30 border-gray-700/50" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-blue-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{school.name}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{school.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{school.applications}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>hồ sơ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admission Methods */}
          <div className={`rounded-2xl border p-6 ${darkMode ? "bg-gray-800/70 border-gray-700/50" : "bg-white/80 border-gray-200/50"}`}>
            <h3 className={`text-base font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Phương thức xét tuyển</h3>
            <div className="space-y-4">
              {reportData.admissionMethods.map((method) => (
                <div key={method.method} className={`p-4 rounded-xl ${darkMode ? "bg-gray-700/30" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{method.method}</span>
                    <span className={`text-lg font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{method.count}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{method.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaoCao;
