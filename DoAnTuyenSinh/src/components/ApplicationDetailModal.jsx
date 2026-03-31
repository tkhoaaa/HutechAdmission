import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaGraduationCap, FaEnvelope, FaPhone, FaIdCard,
  FaFileAlt, FaClock, FaCheck, FaFilePdf, FaImage
} from 'react-icons/fa';
import ImagePreview from './ImagePreview';

export default function ApplicationDetailModal({ app, open, onClose, darkMode, onApprove }) {
  const [previewSrc, setPreviewSrc] = React.useState(null);
  const [previewAlt, setPreviewAlt] = React.useState('');

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!app) return null;

  const modalBg = darkMode ? "bg-gray-800" : "bg-white";
  const modalBorder = darkMode ? "border-gray-700" : "border-gray-200";
  const modalText = darkMode ? "text-gray-100" : "text-gray-900";
  const modalTextMuted = darkMode ? "text-gray-400" : "text-gray-600";
  const sectionBg = darkMode ? "bg-gray-700/30" : "bg-gray-50";
  const textGray = darkMode ? "text-gray-200" : "text-gray-800";

  const getStatusBadge = (status) => {
    const configs = {
      pending: { text: "Chờ xử lý", light: "bg-yellow-100 text-yellow-800", dark: "bg-yellow-900/40 text-yellow-300" },
      approved: { text: "Đã duyệt", light: "bg-green-100 text-green-800", dark: "bg-green-900/40 text-green-300" },
      rejected: { text: "Từ chối", light: "bg-red-100 text-red-800", dark: "bg-red-900/40 text-red-300" }
    };
    const c = configs[status] || configs.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${darkMode ? c.dark : c.light}`}>
        <FaClock className="text-xs" />
        {c.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Get documents from attachments
  const docs = app.attachments || [];

  // Group docs by category
  const hocBaDocs = docs.filter(d => d.category === 'hoc-ba');
  const cccdDocs = docs.filter(d => d.category === 'cccd');
  const otherDocs = docs.filter(d => d.category === 'other');

  const hasDocuments = docs.length > 0;

  const handlePreview = (url, label) => {
    setPreviewSrc(url);
    setPreviewAlt(label);
  };

  const handleClosePreview = () => {
    setPreviewSrc(null);
    setPreviewAlt('');
  };

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`relative z-[1001] ${modalBg} rounded-2xl max-h-[90vh] w-full max-w-5xl overflow-hidden shadow-2xl border ${modalBorder} flex flex-col`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b ${modalBorder}">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                  {app.candidateAvatar ? (
                    <img
                      src={app.candidateAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div className={`w-full h-full items-center justify-center ${app.candidateAvatar ? 'hidden' : 'flex'}`}>
                    <FaGraduationCap className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${modalText}`}>
                    Chi tiết hồ sơ
                  </h3>
                  <p className={`text-sm ${modalTextMuted}`}>
                    {app.ho_ten || app.studentName} • {app.applicationCode || app.application_code}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                aria-label="Đóng"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Body - scrollable */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Personal info */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textGray}`}>
                      <FaGraduationCap className={darkMode ? "text-blue-400" : "text-blue-500"} />
                      Thông tin cá nhân
                    </h4>
                    <div className={`space-y-3 p-4 rounded-xl ${sectionBg}`}>
                      {[
                        { label: 'Họ và tên', value: app.ho_ten || app.studentName },
                        { label: 'Email', value: app.email },
                        { label: 'SĐT', value: app.sdt || app.phone },
                        { label: 'CCCD', value: app.cccd },
                        { label: 'Ngày sinh', value: app.ngay_sinh || app.birthDate },
                        { label: 'Địa chỉ', value: app.dia_chi || app.address },
                      ].map(({ label, value }) => value ? (
                        <div key={label} className="flex justify-between gap-4">
                          <span className={modalTextMuted}>{label}:</span>
                          <span className={`font-semibold text-right ${modalText}`}>{value}</span>
                        </div>
                      ) : null)}
                    </div>
                  </div>

                  {/* Academic info */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textGray}`}>
                      <FaGraduationCap className={darkMode ? "text-green-400" : "text-green-500"} />
                      Thông tin học tập
                    </h4>
                    <div className={`space-y-3 p-4 rounded-xl ${sectionBg}`}>
                      {[
                        { label: 'Ngành', value: app.major || app.major_name || app.majorName },
                        { label: 'Trường THPT', value: app.school || app.truong_thpt },
                        { label: 'Lớp 12', value: app.class || app.ten_lop_12 },
                        { label: 'Phương thức', value: app.admissionMethod || app.phuong_thuc_xet_tuyen || app.phuongThucXetTuyen },
                        { label: 'GPA', value: app.gpa || '—' },
                      ].map(({ label, value }) => value ? (
                        <div key={label} className="flex justify-between gap-4">
                          <span className={modalTextMuted}>{label}:</span>
                          <span className={`font-semibold text-right ${modalText}`}>{value}</span>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  {/* Documents */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textGray}`}>
                      <FaFileAlt className={darkMode ? "text-purple-400" : "text-purple-500"} />
                      Tài liệu đính kèm
                    </h4>

                    {!hasDocuments ? (
                      <div className={`text-center py-8 rounded-xl border-2 border-dashed ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                        <FaFileAlt className="mx-auto mb-2 text-3xl opacity-50" />
                        <p className="text-sm">Không có tài liệu đính kèm</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Học bạ */}
                        {hocBaDocs.length > 0 && (
                          <div>
                            <p className={`text-sm font-semibold mb-2 ${modalTextMuted}`}>Học bạ THPT</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {hocBaDocs.map((doc) => (
                                <DocThumbnail
                                  key={doc.id}
                                  doc={doc}
                                  darkMode={darkMode}
                                  onPreview={handlePreview}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CCCD */}
                        {cccdDocs.length > 0 && (
                          <div>
                            <p className={`text-sm font-semibold mb-2 ${modalTextMuted}`}>CCCD / CMND</p>
                            <div className="grid grid-cols-2 gap-3">
                              {cccdDocs.map((doc) => (
                                <DocThumbnail
                                  key={doc.id}
                                  doc={doc}
                                  darkMode={darkMode}
                                  onPreview={handlePreview}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Other */}
                        {otherDocs.length > 0 && (
                          <div>
                            <p className={`text-sm font-semibold mb-2 ${modalTextMuted}`}>Tài liệu khác</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {otherDocs.map((doc) => (
                                <DocThumbnail
                                  key={doc.id}
                                  doc={doc}
                                  darkMode={darkMode}
                                  onPreview={handlePreview}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Processing info */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textGray}`}>
                      <FaClock className={darkMode ? "text-orange-400" : "text-orange-500"} />
                      Thông tin xử lý
                    </h4>
                    <div className={`space-y-3 p-4 rounded-xl ${sectionBg}`}>
                      {[
                        { label: 'Ngày nộp', value: formatDate(app.submittedAt || app.created_at) },
                        { label: 'Trạng thái', value: getStatusBadge(app.status) },
                        { label: 'Người xử lý', value: app.assignedTo || '—' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center gap-4">
                          <span className={modalTextMuted}>{label}:</span>
                          <div className="text-right">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex justify-end gap-4 px-8 py-5 border-t ${modalBorder}`}>
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Đóng
              </button>
              {app.status !== 'approved' && (
                <button
                  onClick={() => onApprove(app.id, 'approved')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg flex items-center gap-2 transition-all"
                >
                  <FaCheck className="" />
                  Duyệt hồ sơ
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(content, document.body)}
      {previewSrc && (
        <ImagePreview src={previewSrc} alt={previewAlt} onClose={handleClosePreview} />
      )}
    </>
  );
}

// Doc thumbnail sub-component
function DocThumbnail({ doc, darkMode, onPreview }) {
  const isImage = doc.type === 'image';
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const hoverBg = darkMode ? "group-hover:bg-gray-700" : "group-hover:bg-gray-50";

  return (
    <div
      className={`relative group rounded-xl overflow-hidden border-2 ${borderColor} ${hoverBg} transition-all duration-200 hover:shadow-lg hover:border-blue-400 cursor-pointer`}
      onClick={() => onPreview(doc.url, doc.label)}
    >
      {isImage ? (
        <>
          <img
            src={doc.url}
            alt={doc.label}
            className="w-full h-28 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-28 bg-gray-100 dark:bg-gray-700 items-center justify-center">
            <FaImage className="text-gray-400 text-2xl" />
          </div>
        </>
      ) : (
        <div className={`w-full h-28 flex flex-col items-center justify-center gap-2 ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}>
          <FaFilePdf className={`text-3xl ${darkMode ? "text-red-400" : "text-red-500"}`} />
          <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>PDF</span>
        </div>
      )}
      {/* Label overlay */}
      <div className={`absolute bottom-0 left-0 right-0 px-2 py-1.5 ${darkMode ? "bg-gray-900/80" : "bg-black/60"}`}>
        <p className="text-white text-xs font-medium truncate">{doc.label}</p>
      </div>
      {/* Hover icon */}
      <div className={`absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors ${isImage ? '' : 'hidden'}`}>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800 rounded-full p-2">
          <FaImage className={`text-lg ${darkMode ? "text-white" : "text-gray-800"}`} />
        </div>
      </div>
    </div>
  );
}
