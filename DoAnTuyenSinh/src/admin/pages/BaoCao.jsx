import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FaChartBar, FaChartPie, FaChartLine, FaFilter, FaDownload,
  FaCalendarAlt, FaIndustry, FaCheckCircle, FaTimesCircle, FaClock
} from 'react-icons/fa';
import { useUser } from '../../accounts/UserContext';
import { buildApiUrl } from '../../config/apiConfig';

const BaoCao = () => {
  const { isDemoMode } = useUser();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const demoData = {
    industryStats: [
      { name: 'CNTT', applications: 345, percentage: 28 },
      { name: 'Kinh tế', applications: 287, percentage: 23 },
      { name: 'QTKD', applications: 234, percentage: 19 },
      { name: 'Kế toán', applications: 198, percentage: 16 },
      { name: 'Thiết kế', applications: 156, percentage: 12 },
      { name: 'Khác', applications: 27, percentage: 2 }
    ],
    statusStats: [
      { name: 'Chờ duyệt', value: 89, color: '#fbbf24' },
      { name: 'Đã duyệt', value: 876, color: '#10b981' },
      { name: 'Từ chối', value: 282, color: '#ef4444' }
    ],
    timeSeriesData: [
      { month: 'T1', applications: 45, approved: 38, rejected: 7 },
      { month: 'T2', applications: 52, approved: 44, rejected: 8 },
      { month: 'T3', applications: 78, approved: 65, rejected: 13 },
      { month: 'T4', applications: 95, approved: 82, rejected: 13 },
      { month: 'T5', applications: 120, approved: 105, rejected: 15 },
      { month: 'T6', applications: 156, approved: 134, rejected: 22 },
      { month: 'T7', applications: 189, approved: 162, rejected: 27 },
      { month: 'T8', applications: 234, approved: 198, rejected: 36 },
      { month: 'T9', applications: 267, approved: 234, rejected: 33 },
      { month: 'T10', applications: 298, approved: 267, rejected: 31 },
      { month: 'T11', applications: 312, approved: 284, rejected: 28 },
      { month: 'T12', applications: 324, approved: 298, rejected: 26 }
    ],
    topSchools: [
      { name: 'THPT Nguyễn Thị Minh Khai', applications: 89, city: 'TP.HCM' },
      { name: 'THPT Lê Hồng Phong', applications: 76, city: 'TP.HCM' },
      { name: 'THPT Trần Đại Nghĩa', applications: 67, city: 'TP.HCM' },
      { name: 'THPT Nguyễn Thượng Hiền', applications: 54, city: 'TP.HCM' },
      { name: 'THPT Gia Định', applications: 43, city: 'TP.HCM' }
    ],
    admissionMethods: [
      { method: 'Học bạ THPT', count: 876, percentage: 70 },
      { method: 'Thi THPT', count: 298, percentage: 24 },
      { method: 'Đánh giá năng lực', count: 73, percentage: 6 }
    ]
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

      const params = new URLSearchParams({
        year: selectedYear,
        month: selectedMonth,
        industry: selectedIndustry,
        status: selectedStatus
      });

      const [overviewRes, industryRes, statusRes, timeSeriesRes, schoolsRes, methodsRes] = await Promise.all([
        fetch(`${buildApiUrl('/api/admin/reports/overview')}?${params}`),
        fetch(`${buildApiUrl('/api/admin/reports/industry-stats')}?${params}`),
        fetch(`${buildApiUrl('/api/admin/reports/status-stats')}?${params}`),
        fetch(`${buildApiUrl('/api/admin/reports/time-series')}?${params}`),
        fetch(`${buildApiUrl('/api/admin/reports/top-schools')}?${params}`),
        fetch(`${buildApiUrl('/api/admin/reports/admission-methods')}?${params}`)
      ]);

      const [overviewData, industryData, statusData, timeSeriesData, schoolsData, methodsData] = await Promise.all([
        overviewRes.json(),
        industryRes.json(),
        statusRes.json(),
        timeSeriesRes.json(),
        schoolsRes.json(),
        methodsRes.json()
      ]);

      if (overviewData.success && industryData.success && statusData.success &&
          timeSeriesData.success && schoolsData.success && methodsData.success) {
        setReportData({
          overview: overviewData.data,
          industryStats: industryData.data,
          statusStats: statusData.data,
          timeSeriesData: timeSeriesData.data,
          topSchools: schoolsData.data,
          admissionMethods: methodsData.data
        });
      } else {
        throw new Error('Một số API trả về lỗi');
      }
    } catch {
      setReportData(demoData);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const exportReport = (format = 'pdf') => {
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-96 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
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
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Báo cáo thống kê
              </h1>
              <p className="text-gray-300">
                Thống kê chi tiết về hồ sơ tuyển sinh và hiệu suất hệ thống
              </p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <FaDownload />
                Xuất PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <FaDownload />
                Xuất Excel
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Bộ lọc</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Nam
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Thang
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả tháng</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>Tháng {month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIndustry className="inline mr-2" />
                Nganh học
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả ngành</option>
                {reportData.industryStats.map(industry => (
                  <option key={industry.name} value={industry.name}>{industry.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCheckCircle className="inline mr-2" />
                Trang thai
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng hồ sơ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview?.total || demoData.overview?.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaChartBar className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+12.5%</span>
              <span className="text-gray-600 text-sm ml-2">so với tháng trước</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview?.approved || demoData.overview?.approved || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">
                {reportData.overview?.approvalRate || demoData.overview?.approvalRate || 0}%
              </span>
              <span className="text-gray-600 text-sm ml-2">tỷ lệ duyệt</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview?.pending || demoData.overview?.pending || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">
                {reportData.overview?.total > 0 ? ((reportData.overview?.pending || 0) / reportData.overview?.total * 100).toFixed(1) : 0}%
              </span>
              <span className="text-gray-600 text-sm ml-2">tỷ lệ chờ</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Từ chối</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview?.rejected || demoData.overview?.rejected || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">
                {reportData.overview?.total > 0 ? ((reportData.overview?.rejected || 0) / reportData.overview?.total * 100).toFixed(1) : 0}%
              </span>
              <span className="text-gray-600 text-sm ml-2">tỷ lệ từ chối</span>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Industry Statistics - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartBar className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Thống kê theo ngành học</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.industryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Distribution - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FaChartPie className="text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Phân bố trạng thái</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Time Series Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <FaChartLine className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Xu hướng hồ sơ theo thời gian</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={reportData.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="rejected" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Schools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top trường THPT có nhiều hồ sơ nhất</h3>
            <div className="space-y-4">
              {reportData.topSchools.map((school, index) => (
                <div key={school.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{school.name}</p>
                      <p className="text-sm text-gray-600">{school.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{school.applications}</p>
                    <p className="text-sm text-gray-600">hồ sơ</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Admission Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Phương thức xét tuyển</h3>
            <div className="space-y-4">
              {reportData.admissionMethods.map((method) => (
                <div key={method.method} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{method.method}</span>
                    <span className="text-lg font-bold text-blue-600">{method.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.percentage}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BaoCao;
