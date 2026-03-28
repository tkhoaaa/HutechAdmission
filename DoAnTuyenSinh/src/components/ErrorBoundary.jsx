import React from "react";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDarkMode } from "../contexts/DarkModeContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show toast notification
    toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.", {
      description: error?.message || "Lỗi không xác định",
    });

    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          retry: this.handleRetry,
        });
      }

      // Default fallback UI
      return <DefaultErrorFallback
        error={this.state.error}
        onRetry={this.handleRetry}
      />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, onRetry }) {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
          : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
      }}
    >
      <div
        className="max-w-md w-full rounded-2xl p-8 text-center shadow-xl border"
        style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          borderColor: darkMode ? "#334155" : "#e2e8f0",
        }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
              : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          }}
        >
          <FaExclamationTriangle
            className="text-4xl"
            style={{
              color: darkMode ? "#fca5a5" : "#d97706",
            }}
          />
        </div>

        {/* Heading */}
        <h1
          className="text-2xl font-bold mb-3"
          style={{
            color: darkMode ? "#f1f5f9" : "#1e293b",
          }}
        >
          Đã xảy ra lỗi
        </h1>

        {/* Friendly message */}
        <p
          className="text-base mb-2 leading-relaxed"
          style={{
            color: darkMode ? "#94a3b8" : "#64748b",
          }}
        >
          Rất tiếc, đã có lỗi không mong muốn xảy ra trong quá trình tải trang.
        </p>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{
            color: darkMode ? "#64748b" : "#94a3b8",
          }}
        >
          Vui lòng thử tải lại trang hoặc liên hệ bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn.
        </p>

        {/* Error detail (collapsed by default) */}
        {error?.message && (
          <details
            className="mb-8 text-left rounded-lg p-3 text-xs font-mono overflow-x-auto"
            style={{
              background: darkMode ? "#0f172a" : "#f8fafc",
              border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
              color: darkMode ? "#94a3b8" : "#64748b",
            }}
          >
            <summary
              className="cursor-pointer font-sans font-semibold mb-1"
              style={{ color: darkMode ? "#94a3b8" : "#64748b" }}
            >
              Chi tiết lỗi
            </summary>
            <span className="break-all">{error.message}</span>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Thử lại
          </button>
          <Link
            to="/"
            onClick={onRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: darkMode ? "#334155" : "#f1f5f9",
              color: darkMode ? "#e2e8f0" : "#475569",
              border: `1px solid ${darkMode ? "#475569" : "#e2e8f0"}`,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ErrorBoundary;
