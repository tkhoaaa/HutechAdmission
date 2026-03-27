import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../accounts/UserContext";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCamera, 
  FaSave, 
  FaTimes, 
  FaPhone,
  FaGlobe,
  FaDesktop,
  FaHistory,
  FaEdit,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaShieldAlt
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import apiClient from "../utils/apiClient";
import ThemeToggle from "../components/ThemeToggle";
import DeviceManager from "../components/DeviceManager";
import ActivityLog from "../components/ActivityLog";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

function HoSoNguoiDung() {
  const { user, username, role, login, updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Fallback để hiển thị tên người dùng
  const displayName = username || user?.username || user?.name || user?.email || "Người dùng";
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [social, setSocial] = useState(user?.social || "");
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Xử lý URL avatar đúng cách
      let avatarUrl = "";
      if (user.avatar) {
        if (user.avatar.startsWith('http')) {
          avatarUrl = user.avatar;
        } else if (user.avatar.startsWith('/uploads/')) {
          avatarUrl = `http://localhost:3001${user.avatar}`;
        } else {
          avatarUrl = `http://localhost:3001/uploads/${user.avatar}`;
        }
      }
      setAvatar(avatarUrl);
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setSocial(user.social || "");
    }
  }, [user]);

  // Debug: log để kiểm tra giá trị
  console.log("HoSoNguoiDung - User context:", { user, username, role, displayName });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("user_id", user.id);

      console.log("Uploading avatar for user:", user.id);

      // Upload file
      const uploadRes = await apiClient.post("/user/upload-avatar", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      });

      console.log("Upload response:", uploadRes);

      if (uploadRes.success || uploadRes.data?.success) {
        const avatarPath = uploadRes.url || uploadRes.data?.url;
        const fullAvatarUrl = avatarPath.startsWith('http') 
          ? avatarPath 
          : `http://localhost:3001${avatarPath}`;

        console.log("Avatar uploaded successfully:", {
          path: avatarPath,
          fullUrl: fullAvatarUrl
        });

        // Update avatar URL in database
        const updateRes = await apiClient.put("/user/update-avatar", {
          user_id: user.id,
          avatar_url: avatarPath,
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("Avatar update response:", updateRes);

        if (updateRes.success || updateRes.data?.success) {
          // Update local state
          setAvatar(fullAvatarUrl);

          // Update user context với avatar mới
          const updatedUser = {
            ...user,
            avatar: avatarPath // Lưu relative path trong context
          };

          // Sử dụng updateUser nếu có, nếu không thì dùng login
          if (updateUser) {
            updateUser(updatedUser);
          } else {
            login(user.id, role, username, updatedUser);
          }

          // Lưu vào localStorage để persist qua sessions
          const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          const newUserData = {
            ...currentUserData,
            avatar: avatarPath
          };
          localStorage.setItem('userData', JSON.stringify(newUserData));

          setMessage("Cập nhật avatar thành công!");
        } else {
          throw new Error(updateRes.message || "Lỗi khi cập nhật avatar trong database");
        }
      } else {
        throw new Error(uploadRes.message || "Lỗi khi upload ảnh lên server");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      setError(`Lỗi khi cập nhật avatar: ${err.response?.data?.message || err.message || "Không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await apiClient.put("/user/update-email", {
        user_id: user.id,
        email: email,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.success || response.data?.success) {
        // Update user context
        const updatedUser = { ...user, email: email };
        if (updateUser) {
          updateUser(updatedUser);
        } else {
          login(user.id, role, username, updatedUser);
        }

        // Update localStorage
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const newUserData = { ...currentUserData, email: email };
        localStorage.setItem('userData', JSON.stringify(newUserData));

        setMessage("Cập nhật email thành công!");
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật email");
      }
    } catch (err) {
      console.error("Email update error:", err);
      setError(`Lỗi khi cập nhật email: ${err.response?.data?.message || err.message || "Không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await apiClient.put("/user/update-password", {
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.success || response.data?.success) {
        setMessage("Cập nhật mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật mật khẩu");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setError(`Lỗi khi cập nhật mật khẩu: ${err.response?.data?.message || err.message || "Không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInfoChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await apiClient.put("/user/update-profile-info", {
        user_id: user.id,
        phone,
        bio,
        social,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.success || response.data?.success) {
        // Update user context
        const updatedUser = { ...user, phone, bio, social };
        if (updateUser) {
          updateUser(updatedUser);
        } else {
          login(user.id, role, username, updatedUser);
        }

        // Update localStorage
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const newUserData = { ...currentUserData, phone, bio, social };
        localStorage.setItem('userData', JSON.stringify(newUserData));

        setMessage("Lưu thay đổi thành công!");
        setIsEditing(false);
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật thông tin");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(`Lỗi khi cập nhật thông tin cá nhân: ${err.response?.data?.message || err.message || "Không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { 
      id: 'profile', 
      label: 'Hồ sơ cá nhân', 
      icon: <FaUser />,
      gradient: 'from-blue-500 to-purple-600',
      description: 'Quản lý thông tin cá nhân'
    },
    { 
      id: 'security', 
      label: 'Bảo mật', 
      icon: <FaShieldAlt />,
      gradient: 'from-green-500 to-teal-600',
      description: 'Cài đặt bảo mật tài khoản'
    },
    { 
      id: 'devices', 
      label: 'Thiết bị', 
      icon: <FaDesktop />,
      gradient: 'from-orange-500 to-red-600',
      description: 'Quản lý thiết bị đăng nhập'
    },
    { 
      id: 'activity', 
      label: 'Hoạt động', 
      icon: <FaHistory />,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Lịch sử hoạt động'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Avatar section with enhanced design */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Ảnh đại diện
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Cập nhật hình ảnh đại diện của bạn
                    </p>
                  </div>
                  <HiSparkles className="text-3xl text-yellow-500 animate-pulse" />
                </div>
                
                <div className="flex items-center space-x-6">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative">
                      <img
                        src={avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMCA5MEM0MCA3MCA4MCA3MCAxMDAgOTBWMTIwSDIwVjkwWiIgZmlsbD0iIzlCOUJBMyIvPgo8L3N2Zz4K"}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        onError={(e) => {
                          console.error("Avatar image failed to load:", avatar);
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMCA5MEM0MCA3MCA4MCA3MCAxMDAgOTBWMTIwSDIwVjkwWiIgZmlsbD0iIzlCOUJBMyIvPgo8L3N2Zz4K";
                        }}
                      />
                      <motion.label 
                        className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaCamera className="text-sm" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={loading}
                        />
                      </motion.label>
                    </div>
                    {loading && (
                      <motion.div 
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {displayName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Chọn ảnh có kích thước tối thiểu 200x200px để có chất lượng tốt nhất
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      Chấp nhận: JPG, PNG (tối đa 5MB)
                    </p>
                    {user && (
                      <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
                        ID: {user.id} | Role: {role}
                      </p>
                    )}
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCamera />
                      {loading ? "Đang tải..." : "Thay đổi ảnh"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile info section with enhanced design */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 dark:from-green-500/10 dark:to-blue-500/10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Thông tin cá nhân
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Cập nhật thông tin liên hệ và giới thiệu
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isEditing ? <FaCheck /> : <FaEdit />}
                  </motion.button>
                </div>
                
                <form onSubmit={handleProfileInfoChange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FaUser className="text-blue-500" />
                        Tên người dùng
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={displayName}
                          disabled
                          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Tên người dùng"
                        />
                        <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tên người dùng không thể thay đổi
                      </p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FaPhone className="text-green-500" />
                        Số điện thoại
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Nhập số điện thoại"
                        />
                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={itemVariants}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FaGlobe className="text-purple-500" />
                      Mạng xã hội
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={social}
                        onChange={(e) => setSocial(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Link mạng xã hội (Facebook, LinkedIn...)"
                      />
                      <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <HiSparkles className="text-yellow-500" />
                      Giới thiệu
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Giới thiệu về bản thân..."
                    />
                  </motion.div>

                  <motion.div
                    className="flex gap-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <FaSave />
                          Lưu thay đổi
                        </>
                      )}
                    </motion.button>
                    {isEditing && (
                      <motion.button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <FaTimes />
                        Hủy
                      </motion.button>
                    )}
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            key="security"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            {/* Theme toggle with enhanced design */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                      <HiLightningBolt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Giao diện
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Chuyển đổi giữa giao diện sáng và tối
                      </p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>

            {/* Email change with enhanced design */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Thay đổi email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cập nhật địa chỉ email của bạn
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleEmailChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FaEnvelope className="text-blue-500" />
                      Email mới
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="Nhập email mới"
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaSave />
                        Cập nhật email
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Password change with enhanced design */}
            <motion.div 
              variants={itemVariants}
              className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-full">
                    <FaLock className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      Thay đổi mật khẩu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cập nhật mật khẩu để bảo mật tài khoản
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FaLock className="text-red-500" />
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FaLock className="text-orange-500" />
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <FaLock className="text-yellow-500" />
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-red-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaSave />
                        Cập nhật mật khẩu
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'devices':
        return (
          <motion.div
            key="devices"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-red-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10"></div>
            <div className="relative">
              <DeviceManager />
            </div>
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            key="activity"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10"></div>
            <div className="relative">
              <ActivityLog />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with enhanced design */}
        <motion.div 
          variants={itemVariants}
          className="mb-12 text-center"
        >
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Chỉnh sửa hồ sơ
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Quản lý thông tin cá nhân và cài đặt tài khoản của bạn với giao diện hiện đại
          </motion.p>
        </motion.div>

        {/* Messages with enhanced design */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <FaCheck className="text-green-500" />
                {message}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <FaTimes className="text-red-500" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab navigation with enhanced design */}
        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
          <div className="relative border-b border-gray-200/50 dark:border-gray-700/50">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 min-w-0 py-6 px-6 font-semibold text-sm flex flex-col items-center gap-3 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl m-2`}
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`text-2xl ${activeTab === tab.id ? 'text-white' : ''}`}>
                      {tab.icon}
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{tab.label}</div>
                      <div className={`text-xs mt-1 ${
                        activeTab === tab.id 
                          ? 'text-white/80' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab content with enhanced animations */}
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default HoSoNguoiDung; 