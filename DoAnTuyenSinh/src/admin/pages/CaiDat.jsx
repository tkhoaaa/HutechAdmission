import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCog, FaSave, FaUndo, FaUpload, FaBell, FaUsers, FaBuilding,
  FaEnvelope, FaPhone, FaGlobe, FaFileUpload, FaTrash, FaEdit,
  FaCheckCircle, FaExclamationTriangle, FaSearch,
  FaFilter, FaUserShield,
  FaCloud, FaShieldAlt, FaPalette, FaMoon, FaSun, FaTimesCircle
} from 'react-icons/fa';
import { useUser } from '../../accounts/UserContext';
import { buildApiUrl } from '../../config/apiConfig';

const CaiDat = () => {
  const { isDemoMode } = useUser();
  const [activeTab, setActiveTab] = useState('system');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // System Information
  const [systemInfo, setSystemInfo] = useState({
    schoolName: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
    schoolCode: 'HUTECH',
    contactEmail: 'tuyensinh@hutech.edu.vn',
    contactPhone: '028 5445 7777',
    website: 'https://hutech.edu.vn',
    address: '475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM',
    description: 'Trường Đại học Công nghệ TP.HCM - HUTECH là một trong những trường đại học hàng đầu về đào tạo công nghệ và kinh tế tại Việt Nam.'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    applicationSubmitted: true,
    applicationStatusChanged: true,
    newUserRegistered: false,
    systemAlerts: true,
    dailyReports: false,
    weeklyReports: true,
    emailTemplate: 'default'
  });

  // File Upload Settings
  const [uploadSettings, setUploadSettings] = useState({
    maxFileSize: 10,
    allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    avatarMaxSize: 5,
    documentMaxSize: 20,
    autoCompress: true,
    storagePath: '/uploads',
    backupEnabled: true
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [usersSearch, setUsersSearch] = useState('');
  const [usersStatus, setUsersStatus] = useState('all');

  useEffect(() => {
    if (isDemoMode) {
      return;
    }
    fetchSettings();
  }, [isDemoMode]);

  useEffect(() => {
    if (activeTab === 'users' && !isDemoMode) {
      fetchUsers();
    }
  }, [activeTab, usersPagination.page, usersPagination.limit, usersSearch, usersStatus, isDemoMode]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: usersPagination.page,
        limit: usersPagination.limit,
        search: usersSearch,
        status: usersStatus
      });

      const response = await fetch(`${buildApiUrl('/api/admin/users')}?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setUsersPagination({
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages
        });
      }
    } catch {
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${buildApiUrl('/api/admin/users')}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      return;
    }

    try {
      const response = await fetch(`${buildApiUrl('/api/admin/users')}/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message || 'Lỗi khi xóa user');
      }
    } catch {
      alert('Lỗi khi xóa user');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(buildApiUrl('/api/admin/settings'));
      const data = await response.json();

      if (data.success) {
        setSystemInfo(data.data.systemInfo);
        setNotificationSettings(data.data.notificationSettings);
        setUploadSettings(data.data.uploadSettings);
      }
    } catch {
      setSystemInfo({
        schoolName: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
        schoolCode: 'HUTECH',
        contactEmail: 'tuyensinh@hutech.edu.vn',
        contactPhone: '028 5445 7777',
        website: 'https://hutech.edu.vn',
        address: '475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM',
        description: 'Trường Đại học Công nghệ TP.HCM - HUTECH là một trong những trường đại học hàng đầu về đào tạo công nghệ và kinh tế tại Việt Nam.'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section) => {
    try {
      setLoading(true);
      setSaveStatus('saving');

      const response = await fetch(buildApiUrl('/api/admin/settings'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: getSectionData(section) })
      });

      const data = await response.json();
      if (data.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error(data.message || 'Lỗi khi lưu cài đặt');
      }
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (section) => {
    switch (section) {
      case 'system': return systemInfo;
      case 'notifications': return notificationSettings;
      case 'upload': return uploadSettings;
      default: return {};
    }
  };

  const tabs = [
    { id: 'system', name: 'Thông tin hệ thống', icon: FaBuilding, color: 'from-blue-500 to-cyan-500' },
    { id: 'users', name: 'Quản lý Users', icon: FaUsers, color: 'from-purple-500 to-pink-500' },
    { id: 'notifications', name: 'Thông báo', icon: FaBell, color: 'from-orange-500 to-red-500' },
    { id: 'upload', name: 'Cấu hình Upload', icon: FaUpload, color: 'from-green-500 to-teal-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-center">
                <p className="text-white text-lg font-medium">Đang tải cài đặt...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <FaCog className="text-2xl text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Cài đặt hệ thống
                    </h1>
                    <p className="text-gray-300 mt-2 text-base md:text-lg">
                      Quản lý cấu hình hệ thống với giao diện hiện đại
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{tab.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* System Information */}
            {activeTab === 'system' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Thông tin hệ thống</h2>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex gap-3">
                    <button
                      onClick={() => saveSettings('system')}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-green-500/25"
                    >
                      <FaSave />
                      Lưu thay đổi
                    </button>
                    <button
                      onClick={() => fetchSettings()}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
                    >
                      <FaUndo />
                      Khôi phục
                    </button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    { label: 'Tên trường', key: 'schoolName', icon: FaBuilding, type: 'text' },
                    { label: 'Mã trường', key: 'schoolCode', icon: FaBuilding, type: 'text' },
                    { label: 'Email liên hệ', key: 'contactEmail', icon: FaEnvelope, type: 'email' },
                    { label: 'Số điện thoại', key: 'contactPhone', icon: FaPhone, type: 'text' },
                    { label: 'Website', key: 'website', icon: FaGlobe, type: 'url' },
                    { label: 'Địa chỉ', key: 'address', icon: FaBuilding, type: 'text' }
                  ].map((field) => {
                    const Icon = field.icon;
                    return (
                      <motion.div
                        key={field.key}
                        variants={itemVariants}
                        className="group"
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <Icon className="inline mr-2 text-purple-400" />
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.type}
                            value={systemInfo[field.key]}
                            onChange={(e) => setSystemInfo({...systemInfo, [field.key]: e.target.value})}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/10"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none"></div>
                        </div>
                      </motion.div>
                    );
                  })}

                  <motion.div variants={itemVariants} className="lg:col-span-2 group">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      <FaEdit className="inline mr-2 text-purple-400" />
                      Mô tả
                    </label>
                    <div className="relative">
                      <textarea
                        value={systemInfo.description}
                        onChange={(e) => setSystemInfo({...systemInfo, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/10 resize-none"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* User Management */}
            {activeTab === 'users' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quản lý Users</h2>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm user..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/10"
                    />
                  </div>
                  <div className="relative group">
                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <select
                      value={usersStatus}
                      onChange={(e) => setUsersStatus(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300 group-hover:bg-white/10 appearance-none"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <select
                      value={usersPagination.limit}
                      onChange={(e) => setUsersPagination({...usersPagination, page: 1, limit: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300 group-hover:bg-white/10 appearance-none"
                    >
                      <option value={10}>10 items/page</option>
                      <option value={20}>20 items/page</option>
                      <option value={50}>50 items/page</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  {usersLoading ? (
                    <div className="text-center py-12">
                      <div className="relative inline-block">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                      </div>
                      <p className="mt-4 text-gray-300 text-lg">Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/5 border-b border-white/10">
                          <tr>
                            {['Tài khoản', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((header) => (
                              <th key={header} className="px-6 py-4 text-gray-300 font-medium">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                            >
                              <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                              <td className="px-6 py-4 text-gray-300">{user.email}</td>
                              <td className="px-6 py-4 text-gray-300">{user.phone}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  user.role === 'admin'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {user.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  user.isActive
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-300">
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${
                                      user.isActive
                                        ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                                        : 'text-green-400 hover:bg-green-500/20 hover:text-green-300'
                                    }`}
                                    title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                  >
                                    {user.isActive ? <FaTimesCircle /> : <FaCheckCircle />}
                                  </button>
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:scale-110 active:scale-90 rounded-lg transition-all duration-300"
                                    title="Xóa"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>

                {usersPagination.totalPages > 1 && (
                  <motion.div variants={itemVariants} className="flex items-center justify-between mt-8">
                    <div className="text-sm text-gray-300">
                      Hiển thị {((usersPagination.page - 1) * usersPagination.limit) + 1} đến{' '}
                      {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} trong tổng số{' '}
                      {usersPagination.total} users
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUsersPagination({...usersPagination, page: usersPagination.page - 1})}
                        disabled={usersPagination.page === 1}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Trước
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-300 flex items-center">
                        Trang {usersPagination.page} / {usersPagination.totalPages}
                      </span>
                      <button
                        onClick={() => setUsersPagination({...usersPagination, page: usersPagination.page + 1})}
                        disabled={usersPagination.page === usersPagination.totalPages}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Sau
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <FaBell className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Cấu hình thông báo</h2>
                  </motion.div>
                  <button
                    onClick={() => saveSettings('notifications')}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-green-500/25"
                  >
                    <FaSave />
                    Lưu thay đổi
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaEnvelope className="text-orange-400" />
                      Thông báo Email
                    </h3>

                    {[
                      { key: 'emailNotifications', title: 'Bật thông báo email', desc: 'Gửi thông báo qua email' },
                      { key: 'applicationSubmitted', title: 'Hồ sơ mới được nộp', desc: 'Thông báo khi có hồ sơ mới' },
                      { key: 'applicationStatusChanged', title: 'Trạng thái hồ sơ thay đổi', desc: 'Thông báo khi trạng thái hồ sơ thay đổi' }
                    ].map((setting, index) => (
                      <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-purple-300 transition-colors duration-300">{setting.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      Thống kê
                    </h3>

                    {[
                      { key: 'dailyReports', title: 'Báo cáo hàng ngày', desc: 'Gửi báo cáo thống kê hàng ngày' },
                      { key: 'weeklyReports', title: 'Báo cáo hàng tuần', desc: 'Gửi báo cáo thống kê hàng tuần' }
                    ].map((setting, index) => (
                      <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-purple-300 transition-colors duration-300">{setting.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                          </label>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="group"
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        <FaPalette className="inline mr-2 text-orange-400" />
                        Template email
                      </label>
                      <div className="relative">
                        <select
                          value={notificationSettings.emailTemplate}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            emailTemplate: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-300 group-hover:bg-white/10 appearance-none"
                        >
                          <option value="default">Mặc định</option>
                          <option value="custom">Tùy chỉnh</option>
                          <option value="minimal">Tối giản</option>
                        </select>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Upload Settings */}
            {activeTab === 'upload' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <FaUpload className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Cấu hình Upload</h2>
                  </motion.div>
                  <button
                    onClick={() => saveSettings('upload')}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-green-500/25"
                  >
                    <FaSave />
                    Lưu thay đổi
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaFileUpload className="text-green-400" />
                      Giới hạn kích thước
                    </h3>

                    {[
                      { key: 'maxFileSize', label: 'Kích thước file tối đa (MB)', type: 'number' },
                      { key: 'avatarMaxSize', label: 'Kích thước avatar tối đa (MB)', type: 'number' },
                      { key: 'documentMaxSize', label: 'Kích thước tài liệu tối đa (MB)', type: 'number' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.type}
                            value={uploadSettings[field.key]}
                            onChange={(e) => setUploadSettings({
                              ...uploadSettings,
                              [field.key]: parseInt(e.target.value)
                            })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-300 group-hover:bg-white/10"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none"></div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaShieldAlt className="text-green-400" />
                      Cấu hình khác
                    </h3>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group"
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Định dạng file được phép
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={uploadSettings.allowedExtensions.join(', ')}
                          onChange={(e) => setUploadSettings({
                            ...uploadSettings,
                            allowedExtensions: e.target.value.split(',').map(ext => ext.trim())
                          })}
                          placeholder="jpg, jpeg, png, pdf, doc, docx"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/10"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group"
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        <FaCloud className="inline mr-2 text-green-400" />
                        Thư mục lưu trữ
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={uploadSettings.storagePath}
                          onChange={(e) => setUploadSettings({
                            ...uploadSettings,
                            storagePath: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-white transition-all duration-300 group-hover:bg-white/10"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none"></div>
                      </div>
                    </motion.div>

                    {[
                      { key: 'autoCompress', title: 'Tự động nén ảnh', desc: 'Nén ảnh để tiết kiệm dung lượng' },
                      { key: 'backupEnabled', title: 'Sao lưu tự động', desc: 'Tự động sao lưu file upload' }
                    ].map((setting, index) => (
                      <motion.div
                        key={setting.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="group p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-green-300 transition-colors duration-300">{setting.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={uploadSettings[setting.key]}
                              onChange={(e) => setUploadSettings({
                                ...uploadSettings,
                                [setting.key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-500"></div>
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Status */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`fixed bottom-6 right-6 p-6 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                saveStatus === 'success'
                  ? 'bg-green-500/90 border-green-400/50'
                  : saveStatus === 'error'
                  ? 'bg-red-500/90 border-red-400/50'
                  : 'bg-blue-500/90 border-blue-400/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {saveStatus === 'success' && <FaCheckCircle className="text-2xl text-white" />}
                  {saveStatus === 'error' && <FaExclamationTriangle className="text-2xl text-white" />}
                  {saveStatus === 'saving' && <FaSave className="text-2xl text-white animate-spin" />}
                </div>
                <span className="text-white font-medium text-lg">
                  {saveStatus === 'success' && 'Lưu thành công!'}
                  {saveStatus === 'error' && 'Lỗi khi lưu!'}
                  {saveStatus === 'saving' && 'Đang lưu...'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaiDat;
