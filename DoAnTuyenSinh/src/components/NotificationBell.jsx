import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCircle } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';
import { useDarkMode } from '../contexts/DarkModeContext';

const typeConfig = {
  new_application: 'bg-blue-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

export default function NotificationBell() {
  const { darkMode } = useDarkMode();
  const { notifications, unreadCount, isConnected, isReconnecting, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };

  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <motion.button
        onClick={() => setOpen(o => !o)}
        className={`relative p-4 rounded-2xl transition-all duration-300 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
        aria-expanded={open}
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {(isConnected || isReconnecting) && (
          <span
            className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-ping'}`}
            title={isConnected ? 'Đã kết nối SSE' : 'Đang kết nối lại...'}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute right-0 mt-3 w-96 ${darkMode ? "bg-gray-800/95 border-gray-700/30" : "bg-white/95 border-white/30"} backdrop-blur-2xl rounded-3xl shadow-2xl border overflow-hidden z-50`}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={handleClickOutside}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold flex items-center gap-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  <FaBell className="text-blue-500" />
                  Thông báo
                </h3>
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                      <FaCircle className="text-[8px]" /> Live
                    </span>
                  )}
                  {isReconnecting && (
                    <span className="text-xs text-yellow-500 font-semibold">Đang kết nối...</span>
                  )}
                  <span className={`text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {unreadCount} mới
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <FaBell className="mx-auto mb-2 text-2xl opacity-50" />
                    <p className="text-sm">Không có thông báo nào</p>
                  </div>
                ) : notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                      notification.unread
                        ? darkMode ? "bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50" : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        : darkMode ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={`w-4 h-4 ${typeConfig[notification.type] || "bg-gray-500"} rounded-full flex-shrink-0 mt-1`} />
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>{notification.title}</h4>
                      <p className={`text-sm mb-2 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{notification.message}</p>
                      <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{notification.time}</p>
                    </div>
                    {notification.unread && <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
