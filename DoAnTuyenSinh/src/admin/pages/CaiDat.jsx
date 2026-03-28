import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCog, FaSave, FaUndo, FaUpload, FaBell, FaUsers, FaBuilding,
  FaEnvelope, FaPhone, FaGlobe, FaFileUpload, FaTrash, FaEdit,
  FaCheckCircle, FaExclamationTriangle, FaSearch,
  FaFilter, FaUserShield, FaUserCog,
  FaCloud, FaShieldAlt, FaPalette, FaMoon, FaSun, FaTimesCircle,
  FaPlus, FaCrown
} from 'react-icons/fa';
import { useUser } from '../../accounts/UserContext';
import { buildApiUrl } from '../../config/apiConfig';
import { useDarkMode } from '../../contexts/DarkModeContext';
import ThemeToggle from '../../components/ThemeToggle';
import AdminModal from '../../components/ui/AdminModal';
import { adminAPI } from '../../utils/apiClient';
import { toast } from 'sonner';

const CaiDat = () => {
  const { isDemoMode } = useUser();
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('system');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

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

  // Admin Management State
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsPagination, setAdminsPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [adminsSearch, setAdminsSearch] = useState('');
  const [adminsStatus, setAdminsStatus] = useState('all');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState({
    username: '', email: '', password: '', phone: '', role: 'staff'
  });

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

  useEffect(() => {
    if (activeTab === 'admins' && !isDemoMode) {
      fetchAdmins();
    }
  }, [activeTab, adminsPagination.page, adminsPagination.limit, adminsSearch, adminsStatus, isDemoMode]);

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
        toast.success('Cập nhật trạng thái thành công');
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
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
        toast.success('Xóa user thành công');
      } else {
        toast.error(data.message || 'Lỗi khi xóa user');
      }
    } catch {
      toast.error('Lỗi khi xóa user');
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const params = new URLSearchParams({
        page: adminsPagination.page,
        limit: adminsPagination.limit,
        search: adminsSearch,
        status: adminsStatus
      });

      const response = await fetch(`${buildApiUrl('/api/admin/admins')}?${params}`);
      const data = await response.json();

      if (data.success) {
        setAdmins(data.data.admins);
        setAdminsPagination({
          page: data.data.page,
          limit: data.data.limit,
          total: data.data.total,
          totalPages: data.data.totalPages
        });
      }
    } catch {
    } finally {
      setAdminsLoading(false);
    }
  };

  const toggleAdminStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${buildApiUrl('/api/admin/users')}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        toast.success('Cập nhật trạng thái thành công');
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      return;
    }

    try {
      const response = await fetch(`${buildApiUrl('/api/admin/users')}/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        toast.success('Xóa tài khoản thành công');
      } else {
        toast.error(data.message || 'Lỗi khi xóa tài khoản');
      }
    } catch {
      toast.error('Lỗi khi xóa tài khoản');
    }
  };

  const updateAdminRole = async (id, role) => {
    try {
      const response = await fetch(`${buildApiUrl('/api/admin/admins')}/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      const data = await response.json();
      if (data.success) {
        fetchAdmins();
        toast.success('Cập nhật vai trò thành công');
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật vai trò');
      }
    } catch {
      toast.error('Lỗi khi cập nhật vai trò');
    }
  };

  const openAdminModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setAdminForm({
        username: admin.username,
        email: admin.email,
        password: '',
        phone: admin.phone || '',
        role: admin.role
      });
    } else {
      setEditingAdmin(null);
      setAdminForm({ username: '', email: '', password: '', phone: '', role: 'staff' });
    }
    setShowAdminModal(true);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.email || (!editingAdmin && !adminForm.password)) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const url = editingAdmin
        ? `${buildApiUrl('/api/admin/users')}/${editingAdmin.id}`
        : buildApiUrl('/api/admin/admins');
      const method = editingAdmin ? 'PUT' : 'POST';

      const body = { ...adminForm };
      if (editingAdmin && !body.password) delete body.password;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingAdmin ? 'Cập nhật tài khoản thành công' : 'Tạo tài khoản thành công');
        setShowAdminModal(false);
        fetchAdmins();
      } else {
        toast.error(data.message || 'Lỗi khi lưu tài khoản');
      }
    } catch {
      toast.error('Lỗi khi lưu tài khoản');
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getSettings();

      if (data.success) {
        setSystemInfo(data.data.systemInfo);
        setNotificationSettings(data.data.notificationSettings);
        setUploadSettings(data.data.uploadSettings);
      }
    } catch (error) {
      console.error('Lỗi khi tải cài đặt:', error);
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
    if (isDemoMode) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus('saving');

      const data = await adminAPI.updateSettings({
        section,
        data: getSectionData(section)
      });

      if (data.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error(data.message || 'Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      console.error('Lỗi khi lưu cài đặt:', error);
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
    { id: 'admins', name: 'Quản lý Admin', icon: FaCrown, color: 'from-amber-500 to-orange-500' },
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
      <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"} p-4 md:p-6`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <div className="relative">
              <div className={`w-20 h-20 border-4 ${darkMode ? "border-gray-700 border-t-purple-600" : "border-purple-200 border-t-purple-600"} rounded-full animate-spin`}></div>
              <div className="mt-4 text-center">
                <p className={`${darkMode ? "text-white" : "text-gray-700"} text-lg font-medium`}>Đang tải cài đặt...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className={`relative overflow-hidden ${darkMode ? "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10" : "bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl"} rounded-3xl p-8`}>
            <div className={`absolute inset-0 ${darkMode ? "bg-gradient-to-r from-purple-600/10 to-cyan-600/10" : "bg-gradient-to-r from-blue-50/50 to-purple-50/50"}`}></div>
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
                    <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text ${darkMode ? "bg-gradient-to-r from-white to-gray-300 text-transparent" : "bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent"}`}>
                      Cài đặt hệ thống
                    </h1>
                    <p className={`mt-2 text-base md:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Quản lý cấu hình hệ thống với giao diện hiện đại
                    </p>
                  </div>
                </div>
                <ThemeToggle />
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
          <div className={`${darkMode ? "bg-white/5 backdrop-blur-xl border border-white/10" : "bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg"} rounded-2xl p-2`}>
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
                        ? `${darkMode ? "" : "shadow-md"} bg-gradient-to-r ${tab.color} text-white ${darkMode ? "shadow-purple-500/25" : "shadow-lg"}`
                        : `${darkMode ? "text-gray-300 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"}`
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{tab.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 bg-gradient-to-r ${darkMode ? "from-white/20 to-transparent" : "from-white/30 to-transparent"} rounded-xl`}
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
            className={`${darkMode ? "bg-white/5 backdrop-blur-xl border border-white/10" : "bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg"} rounded-2xl overflow-hidden`}
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
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Thông tin hệ thống</h2>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex gap-3">
                    <button
                      onClick={() => saveSettings('system')}
                      disabled={loading}
                      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg ${darkMode ? "shadow-green-500/25" : "shadow-green-500/20"}`}
                    >
                      <FaSave />
                      Lưu thay đổi
                    </button>
                    <button
                      onClick={() => fetchSettings()}
                      className={`flex items-center gap-2 px-6 py-3 ${darkMode ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"} rounded-xl hover:scale-105 active:scale-95 transition-all duration-300`}
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
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <Icon className="inline mr-2 text-purple-400" />
                          {field.label}
                        </label>
                        <div className="relative">
                          <input
                            type={field.type}
                            value={systemInfo[field.key]}
                            onChange={(e) => setSystemInfo({...systemInfo, [field.key]: e.target.value})}
                            className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white placeholder-gray-400 hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                          />
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
                        </div>
                      </motion.div>
                    );
                  })}

                  <motion.div variants={itemVariants} className="lg:col-span-2 group">
                    <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <FaEdit className="inline mr-2 text-purple-400" />
                      Mô tả
                    </label>
                    <div className="relative">
                      <textarea
                        value={systemInfo.description}
                        onChange={(e) => setSystemInfo({...systemInfo, description: e.target.value})}
                        rows={4}
                        className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white placeholder-gray-400 hover:bg-white/10 group-hover:bg-white/10 resize-none" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white group-hover:bg-white resize-none"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                      />
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
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
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Quản lý Users</h2>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="relative group">
                    <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400 group-hover:text-purple-400" : "text-gray-400 group-hover:text-purple-500"} transition-colors duration-300`} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm user..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      aria-label="Tìm kiếm người dùng"
                      className={`w-full pl-12 pr-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white placeholder-gray-400 hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  <div className="relative group">
                    <FaFilter className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400 group-hover:text-purple-400" : "text-gray-400 group-hover:text-purple-500"} transition-colors duration-300`} />
                    <select
                      value={usersStatus}
                      onChange={(e) => setUsersStatus(e.target.value)}
                      aria-label="Lọc theo trạng thái"
                      className={`w-full pl-12 pr-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none`}
                    >
                      <option value="all" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Tất cả trạng thái</option>
                      <option value="active" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Hoạt động</option>
                      <option value="inactive" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <select
                      value={usersPagination.limit}
                      onChange={(e) => setUsersPagination({...usersPagination, page: 1, limit: parseInt(e.target.value)})}
                      aria-label="Số mục trên trang"
                      className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none`}
                    >
                      <option value={10} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">10 items/page</option>
                      <option value={20} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">20 items/page</option>
                      <option value={50} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">50 items/page</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className={`${darkMode ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"} rounded-xl overflow-hidden`}>
                  {usersLoading ? (
                    <div className="text-center py-12">
                      <div className="relative inline-block">
                        <div className={`w-12 h-12 border-4 ${darkMode ? "border-gray-700 border-t-purple-600" : "border-purple-200 border-t-purple-600"} rounded-full animate-spin`}></div>
                      </div>
                      <p className={`mt-4 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase ${darkMode ? "bg-white/5 border-b border-white/10" : "bg-gray-100 border-b border-gray-200"}`}>
                          <tr>
                            {['Tài khoản', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((header) => (
                              <th key={header} className={`px-6 py-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className={`border-b ${darkMode ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"} transition-all duration-300`}
                            >
                              <td className={`px-6 py-4 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{user.username}</td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{user.email}</td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{user.phone}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  user.role === 'admin'
                                    ? darkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : darkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {user.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  user.isActive
                                    ? darkMode ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'
                                    : darkMode ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${
                                      user.isActive
                                        ? darkMode ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                        : darkMode ? 'text-green-400 hover:bg-green-500/20 hover:text-green-300' : 'text-green-500 hover:bg-green-50 hover:text-green-600'
                                    }`}
                                    title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                  >
                                    {user.isActive ? <FaTimesCircle /> : <FaCheckCircle />}
                                  </button>
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${darkMode ? "text-red-400 hover:bg-red-500/20 hover:text-red-300" : "text-red-500 hover:bg-red-50 hover:text-red-600"}`}
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
                    <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Hiển thị {((usersPagination.page - 1) * usersPagination.limit) + 1} đến{' '}
                      {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} trong tổng số{' '}
                      {usersPagination.total} users
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUsersPagination({...usersPagination, page: usersPagination.page - 1})}
                        disabled={usersPagination.page === 1}
                        className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-300 ${darkMode ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                      >
                        Trước
                      </button>
                      <span className={`px-4 py-2 text-sm flex items-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Trang {usersPagination.page} / {usersPagination.totalPages}
                      </span>
                      <button
                        onClick={() => setUsersPagination({...usersPagination, page: usersPagination.page + 1})}
                        disabled={usersPagination.page === usersPagination.totalPages}
                        className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-300 ${darkMode ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                      >
                        Sau
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Admin Account Management */}
            {activeTab === 'admins' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <FaCrown className="text-white text-xl" />
                    </div>
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Quản lý Tài khoản Admin</h2>
                  </motion.div>
                  <motion.button
                    variants={itemVariants}
                    onClick={() => openAdminModal()}
                    className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg ${darkMode ? "shadow-amber-500/25" : "shadow-amber-500/20"}`}
                  >
                    <FaPlus />
                    Thêm Admin/Staff
                  </motion.button>
                </div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="relative group">
                    <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400 group-hover:text-amber-400" : "text-gray-400 group-hover:text-amber-500"} transition-colors duration-300`} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm tài khoản..."
                      value={adminsSearch}
                      onChange={(e) => setAdminsSearch(e.target.value)}
                      aria-label="Tìm kiếm tài khoản admin"
                      className={`w-full pl-12 pr-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white placeholder-gray-400 hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  <div className="relative group">
                    <FaFilter className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400 group-hover:text-amber-400" : "text-gray-400 group-hover:text-amber-500"} transition-colors duration-300`} />
                    <select
                      value={adminsStatus}
                      onChange={(e) => setAdminsStatus(e.target.value)}
                      aria-label="Lọc theo trạng thái"
                      className={`w-full pl-12 pr-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 appearance-none`}
                    >
                      <option value="all" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Tất cả trạng thái</option>
                      <option value="active" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Hoạt động</option>
                      <option value="inactive" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Không hoạt động</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <select
                      value={adminsPagination.limit}
                      onChange={(e) => setAdminsPagination({...adminsPagination, page: 1, limit: parseInt(e.target.value)})}
                      aria-label="Số mục trên trang"
                      className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 appearance-none`}
                    >
                      <option value={10} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">10 items/page</option>
                      <option value={20} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">20 items/page</option>
                      <option value={50} className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">50 items/page</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className={`${darkMode ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"} rounded-xl overflow-hidden`}>
                  {adminsLoading ? (
                    <div className="text-center py-12">
                      <div className="relative inline-block">
                        <div className={`w-12 h-12 border-4 ${darkMode ? "border-gray-700 border-t-amber-600" : "border-amber-200 border-t-amber-600"} rounded-full animate-spin`}></div>
                      </div>
                      <p className={`mt-4 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Đang tải dữ liệu...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase ${darkMode ? "bg-white/5 border-b border-white/10" : "bg-gray-100 border-b border-gray-200"}`}>
                          <tr>
                            {['Tài khoản', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((header) => (
                              <th key={header} className={`px-6 py-4 font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {admins.length === 0 ? (
                            <tr>
                              <td colSpan={7} className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Chưa có tài khoản admin/staff nào
                              </td>
                            </tr>
                          ) : admins.map((admin) => (
                            <tr
                              key={admin.id}
                              className={`border-b ${darkMode ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"} transition-all duration-300`}
                            >
                              <td className={`px-6 py-4 font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{admin.username}</td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{admin.email}</td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{admin.phone || '—'}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={admin.role}
                                  onChange={(e) => updateAdminRole(admin.id, e.target.value)}
                                  className={`px-3 py-1 text-xs rounded-full font-medium border cursor-pointer ${
                                    admin.role === 'admin'
                                      ? darkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-200'
                                      : darkMode ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-200'
                                  }`}
                                  aria-label="Đổi vai trò"
                                >
                                  <option value="admin" className="dark:bg-gray-800">Admin</option>
                                  <option value="staff" className="dark:bg-gray-800">Staff</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  admin.isActive
                                    ? darkMode ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'
                                    : darkMode ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                  {admin.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </span>
                              </td>
                              <td className={`px-6 py-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                {new Date(admin.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleAdminStatus(admin.id, admin.isActive)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${
                                      admin.isActive
                                        ? darkMode ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300' : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                        : darkMode ? 'text-green-400 hover:bg-green-500/20 hover:text-green-300' : 'text-green-500 hover:bg-green-50 hover:text-green-600'
                                    }`}
                                    title={admin.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                    aria-label={admin.isActive ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản'}
                                  >
                                    {admin.isActive ? <FaTimesCircle /> : <FaCheckCircle />}
                                  </button>
                                  <button
                                    onClick={() => openAdminModal(admin)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${darkMode ? "text-blue-400 hover:bg-blue-500/20 hover:text-blue-300" : "text-blue-500 hover:bg-blue-50 hover:text-blue-600"}`}
                                    title="Chỉnh sửa"
                                    aria-label="Chỉnh sửa tài khoản"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteAdmin(admin.id)}
                                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-90 ${darkMode ? "text-red-400 hover:bg-red-500/20 hover:text-red-300" : "text-red-500 hover:bg-red-50 hover:text-red-600"}`}
                                    title="Xóa"
                                    aria-label="Xóa tài khoản"
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

                {adminsPagination.totalPages > 1 && (
                  <motion.div variants={itemVariants} className="flex items-center justify-between mt-8">
                    <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Hiển thị {((adminsPagination.page - 1) * adminsPagination.limit) + 1} đến{' '}
                      {Math.min(adminsPagination.page * adminsPagination.limit, adminsPagination.total)} trong tổng số{' '}
                      {adminsPagination.total} tài khoản
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAdminsPagination({...adminsPagination, page: adminsPagination.page - 1})}
                        disabled={adminsPagination.page === 1}
                        className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-300 ${darkMode ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`}
                      >
                        Trước
                      </button>
                      <span className={`px-4 py-2 text-sm flex items-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Trang {adminsPagination.page} / {adminsPagination.totalPages}
                      </span>
                      <button
                        onClick={() => setAdminsPagination({...adminsPagination, page: adminsPagination.page + 1})}
                        disabled={adminsPagination.page === adminsPagination.totalPages}
                        className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-300 ${darkMode ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"}`}
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
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Cấu hình thông báo</h2>
                  </motion.div>
                  <button
                    onClick={() => saveSettings('notifications')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg ${darkMode ? "shadow-green-500/25" : "shadow-green-500/20"}`}
                  >
                    <FaSave />
                    Lưu thay đổi
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
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
                        className={`group p-6 rounded-xl transition-all duration-300 ${darkMode ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-gray-50 border border-gray-200 hover:bg-white"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium group-hover:${darkMode ? "text-purple-300" : "text-purple-600"} transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>{setting.title}</p>
                            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: e.target.checked
                              })}
                              aria-label={setting.title}
                              className="sr-only peer"
                            />
                            <div className={`w-14 h-7 ${darkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
                          </label>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
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
                        className={`group p-6 rounded-xl transition-all duration-300 ${darkMode ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-gray-50 border border-gray-200 hover:bg-white"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium group-hover:${darkMode ? "text-purple-300" : "text-purple-600"} transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>{setting.title}</p>
                            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings[setting.key]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [setting.key]: e.target.checked
                              })}
                              aria-label={setting.title}
                              className="sr-only peer"
                            />
                            <div className={`w-14 h-7 ${darkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500`}></div>
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
                      <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
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
                          aria-label="Chọn template email"
                          className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 appearance-none`}
                        >
                          <option value="default" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Mặc định</option>
                          <option value="custom" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Tùy chỉnh</option>
                          <option value="minimal" className="dark:bg-gray-800 dark:text-gray-200 text-gray-800 bg-white">Tối giản</option>
                        </select>
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
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
                    <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Cấu hình Upload</h2>
                  </motion.div>
                  <button
                    onClick={() => saveSettings('upload')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-lg ${darkMode ? "shadow-green-500/25" : "shadow-green-500/20"}`}
                  >
                    <FaSave />
                    Lưu thay đổi
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
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
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
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
                            className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                          />
                          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
                      <FaShieldAlt className="text-green-400" />
                      Cấu hình khác
                    </h3>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="group"
                    >
                      <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
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
                          className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white placeholder-gray-400 hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                        />
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="group"
                    >
                      <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
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
                          className={`w-full px-4 py-3 ${darkMode ? "bg-white/5 border border-white/10 text-white hover:bg-white/10 group-hover:bg-white/10" : "bg-gray-50 border border-gray-200 text-gray-800 hover:bg-white group-hover:bg-white"} rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
                        />
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-teal-500/0 group-hover:from-green-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none ${darkMode ? "hidden" : ""}`}></div>
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
                        className={`group p-6 rounded-xl transition-all duration-300 ${darkMode ? "bg-white/5 border border-white/10 hover:bg-white/10" : "bg-gray-50 border border-gray-200 hover:bg-white"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium group-hover:${darkMode ? "text-green-300" : "text-green-600"} transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>{setting.title}</p>
                            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={uploadSettings[setting.key]}
                              onChange={(e) => setUploadSettings({
                                ...uploadSettings,
                                [setting.key]: e.target.checked
                              })}
                              aria-label={setting.title}
                              className="sr-only peer"
                            />
                            <div className={`w-14 h-7 ${darkMode ? "bg-gray-600" : "bg-gray-300"} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-teal-500`}></div>
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

        {/* Admin Create/Edit Modal — rendered via Portal to document.body */}
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          title={editingAdmin ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản Admin/Staff'}
          icon={FaCrown}
          iconBg="from-amber-500 to-orange-500"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={adminForm.username}
                onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                placeholder="Nhập tên đăng nhập"
                className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-500"
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none`}
                required={!editingAdmin}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                placeholder="admin@hutech.edu.vn"
                className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-500"
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Mật khẩu {editingAdmin ? '(để trống nếu không đổi)' : <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                placeholder={editingAdmin ? "Nhập mật khẩu mới để thay đổi" : "Nhập mật khẩu"}
                className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-500"
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none`}
                required={!editingAdmin}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Số điện thoại
              </label>
              <input
                type="tel"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                placeholder="0xxxxxxxxx"
                className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-amber-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-500"
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['admin', 'staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAdminForm({...adminForm, role: r})}
                    className={`py-2.5 px-4 rounded-xl border font-semibold text-sm capitalize transition-all duration-200 cursor-pointer ${
                      adminForm.role === r
                        ? r === 'admin'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-md'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-amber-500'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-500'
                    }`}
                  >
                    {r === 'admin' ? 'Admin' : 'Staff'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md"
              >
                {editingAdmin ? 'Cập nhật' : 'Tạo tài khoản'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className={`px-6 py-3 rounded-xl font-semibold border transition-colors cursor-pointer ${
                  darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Hủy
              </button>
            </div>
          </form>
        </AdminModal>

        {/* Save Status */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`fixed bottom-6 right-6 p-6 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                saveStatus === 'success'
                  ? darkMode ? 'bg-green-500/90 border-green-400/50' : 'bg-green-500/90 border-green-400/50'
                  : saveStatus === 'error'
                  ? darkMode ? 'bg-red-500/90 border-red-400/50' : 'bg-red-500/90 border-red-400/50'
                  : darkMode ? 'bg-blue-500/90 border-blue-400/50' : 'bg-blue-500/90 border-blue-400/50'
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
