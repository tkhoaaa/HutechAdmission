import React, { useState, useEffect } from "react";
import { useUser } from "../../accounts/UserContext";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSave, FaTimes, FaShieldAlt, FaDesktop, FaHistory, FaEdit, FaUserCircle, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../utils/apiClient";
import ThemeToggle from "../../components/ThemeToggle";
import DeviceManager from "../../components/DeviceManager";
import ActivityLog from "../../components/ActivityLog";

function HoSoQuanLi() {
  const { user, login, role, username, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [social, setSocial] = useState(user?.social || "");
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

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

      const uploadRes = await apiClient.post("/user/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (uploadRes.success || uploadRes.data?.success) {
        const avatarPath = uploadRes.url || uploadRes.data?.url;
        const fullAvatarUrl = avatarPath.startsWith('http')
          ? avatarPath
          : `http://localhost:3001${avatarPath}`;

        const updateRes = await apiClient.put("/user/update-avatar", {
          user_id: user.id,
          avatar_url: avatarPath,
        }, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (updateRes.success || updateRes.data?.success) {
          setAvatar(fullAvatarUrl);

          const updatedUser = {
            ...user,
            avatar: avatarPath
          };

          if (updateUser) {
            updateUser(updatedUser);
          } else {
            login(user.id, role, username, updatedUser);
          }

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
        const updatedUser = { ...user, email: email };
        if (updateUser) {
          updateUser(updatedUser);
        } else {
          login(user.id, role, username, updatedUser);
        }

        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const newUserData = { ...currentUserData, email: email };
        localStorage.setItem('userData', JSON.stringify(newUserData));

        setMessage("Cập nhật email thành công!");
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật email");
      }
    } catch (err) {
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
        const updatedUser = { ...user, phone, bio, social };
        if (updateUser) {
          updateUser(updatedUser);
        } else {
          login(user.id, role, username, updatedUser);
        }

        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const newUserData = { ...currentUserData, phone, bio, social };
        localStorage.setItem('userData', JSON.stringify(newUserData));

        setMessage("Lưu thay đổi thành công!");
      } else {
        throw new Error(response.message || "Lỗi khi cập nhật thông tin");
      }
    } catch (err) {
      setError(`Lỗi khi cập nhật thông tin cá nhân: ${err.response?.data?.message || err.message || "Không xác định"}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: <FaUserCircle />, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Bảo mật', icon: <FaShieldAlt />, color: 'from-emerald-500 to-teal-500' },
    { id: 'devices', label: 'Thiết bị', icon: <FaDesktop />, color: 'from-purple-500 to-pink-500' },
    { id: 'activity', label: 'Hoạt động', icon: <FaHistory />, color: 'from-orange-500 to-red-500' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar section */}
            <motion.div
              className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
              <motion.h3
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCamera className="text-white text-lg" />
                </div>
                Ảnh đại diện
              </motion.h3>
              <div className="flex items-center space-x-6 relative z-10">
                <div className="relative">
                  <img
                    src={avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMCA5MEM0MCA3MCA4MCA3MCAxMDAgOTBWMTIwSDIwVjkwWiIgZmlsbD0iIzlCOUJBMyIvPgo8L3N2Zz4K"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-600 shadow-xl"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOUI5QkEzIi8+CjxwYXRoIGQ9Ik0yMCA5MEM0MCA3MCA4MCA3MCAxMDAgOTBWMTIwSDIwVjkwWiIgZmlsbD0iIzlCOUJBMyIvPgo8L3N2Zz4K";
                    }}
                  />
                  <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full cursor-pointer hover:from-blue-600 hover:to-cyan-600 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg">
                    <FaCamera className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Cập nhật ảnh đại diện của bạn
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Chấp nhận: JPG, PNG (tối đa 5MB)
                  </p>
                  {user && (
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                      ID: {user.id} | Role: {role}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Profile info section */}
            <motion.div
              className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
              <motion.h3
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-white text-lg" />
                </div>
                Thông tin cá nhân
              </motion.h3>
              <form onSubmit={handleProfileInfoChange} className="space-y-6 relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                    placeholder="Nhập số điện thoại"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Giới thiệu
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 resize-none text-slate-700 dark:text-slate-300"
                    placeholder="Giới thiệu về bản thân"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Mạng xã hội
                  </label>
                  <input
                    type="url"
                    value={social}
                    onChange={(e) => setSocial(e.target.value)}
                    className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                    placeholder="Link mạng xã hội (Facebook, LinkedIn...)"
                  />
                </motion.div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="relative flex items-center gap-3">
                    <FaSave className="text-lg" />
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </div>
                </button>
              </form>
            </motion.div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Theme toggle */}
            <motion.div
              className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
              <motion.h3
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                Giao diện
              </motion.h3>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Chế độ tối/sáng</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Chuyển đổi giữa giao diện sáng và tối</p>
                </div>
                <ThemeToggle />
              </div>
            </motion.div>

            {/* Email change */}
            <motion.div
              className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
              <motion.h3
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaEnvelope className="text-white text-lg" />
                </div>
                Thay đổi email
              </motion.h3>
              <form onSubmit={handleEmailChange} className="space-y-6 relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Email mới
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                    placeholder="Nhập email mới"
                  />
                </motion.div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative flex items-center gap-3">
                    <FaSave className="text-lg" />
                    {loading ? "Đang lưu..." : "Cập nhật email"}
                  </div>
                </button>
              </form>
            </motion.div>

            {/* Password change */}
            <motion.div
              className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.02] transition-all duration-300"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
              <motion.h3
                className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaKey className="text-white text-lg" />
                </div>
                Thay đổi mật khẩu
              </motion.h3>
              <form onSubmit={handlePasswordChange} className="space-y-6 relative z-10">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-4 pr-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-110 active:scale-95 transition-all duration-200"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-4 pr-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-110 active:scale-95 transition-all duration-200"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-4 pr-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-slate-700 dark:text-slate-300"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-110 active:scale-95 transition-all duration-200"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </motion.div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 overflow-hidden disabled:opacity-50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="relative flex items-center gap-3">
                    <FaSave className="text-lg" />
                    {loading ? "Đang lưu..." : "Cập nhật mật khẩu"}
                  </div>
                </button>
              </form>
            </motion.div>
          </motion.div>
        );

      case 'devices':
        return (
          <motion.div
            className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.01] transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            <motion.h3
              className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaDesktop className="text-white text-lg" />
              </div>
              Quản lý thiết bị
            </motion.h3>
            <div className="relative z-10">
              <DeviceManager />
            </div>
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:scale-[1.01] transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl"></div>
            <motion.h3
              className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaHistory className="text-white text-lg" />
              </div>
              Lịch sử hoạt động
            </motion.h3>
            <div className="relative z-10">
              <ActivityLog />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 dark:from-emerald-600/10 dark:to-cyan-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2 md:mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Chỉnh sửa hồ sơ
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Quản lý thông tin cá nhân và cài đặt tài khoản
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {message && (
              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-2xl flex items-center gap-4 shadow-lg"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
              >
                <FaSave className="text-green-500 dark:text-green-400 text-xl" />
                <span className="font-semibold">{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="mb-8 p-6 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 backdrop-blur-sm border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl flex items-center gap-4 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <FaTimes className="text-red-500 dark:text-red-400 text-xl" />
                <span className="font-semibold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab navigation */}
          <motion.div
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 mb-8 overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="border-b border-slate-200/50 dark:border-slate-700/50">
              <nav className="flex flex-wrap justify-center lg:justify-start px-6">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-4 px-3 sm:py-5 sm:px-4 md:py-6 md:px-6 font-semibold text-xs sm:text-sm flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      activeTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tab.icon}
                    </div>
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} rounded-full`}
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default HoSoQuanLi;
