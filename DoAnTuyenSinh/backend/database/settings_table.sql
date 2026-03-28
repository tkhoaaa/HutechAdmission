-- Bảng lưu trữ cài đặt hệ thống
-- Dùng cấu trúc section/setting_key để linh hoạt lưu trữ nhiều loại cài đặt
USE tuyensinh;

CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL COMMENT 'Nhóm cài đặt: system_info, notifications, upload, ...',
    setting_key VARCHAR(100) NOT NULL COMMENT 'Khóa cài đặt trong nhóm',
    setting_value TEXT COMMENT 'Giá trị cài đặt (lưu dạng JSON cho object)',
    description VARCHAR(255) DEFAULT NULL COMMENT 'Mô tả ngắn về cài đặt',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_setting (section, setting_key),
    INDEX idx_section (section)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu ban đầu cho các section cài đặt
INSERT IGNORE INTO settings (section, setting_key, setting_value, description) VALUES
-- System Info
('system_info', 'schoolName', 'Trường Đại học Công nghệ TP.HCM (HUTECH)', 'Tên trường'),
('system_info', 'schoolCode', 'HUTECH', 'Mã trường'),
('system_info', 'contactEmail', 'tuyensinh@hutech.edu.vn', 'Email liên hệ'),
('system_info', 'contactPhone', '028 5445 7777', 'Số điện thoại liên hệ'),
('system_info', 'website', 'https://hutech.edu.vn', 'Website trường'),
('system_info', 'address', '475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM', 'Địa chỉ trường'),
('system_info', 'description', 'Trường Đại học Công nghệ TP.HCM - HUTECH là một trong những trường đại học hàng đầu về đào tạo công nghệ và kinh tế tại Việt Nam.', 'Mô tả trường'),

-- Notification Settings
('notifications', 'emailNotifications', 'true', 'Bật/tắt thông báo email'),
('notifications', 'applicationSubmitted', 'true', 'Thông báo khi có hồ sơ mới'),
('notifications', 'applicationStatusChanged', 'true', 'Thông báo khi trạng thái hồ sơ thay đổi'),
('notifications', 'newUserRegistered', 'false', 'Thông báo khi có người dùng mới đăng ký'),
('notifications', 'systemAlerts', 'true', 'Thông báo cảnh báo hệ thống'),
('notifications', 'dailyReports', 'false', 'Báo cáo hàng ngày qua email'),
('notifications', 'weeklyReports', 'true', 'Báo cáo hàng tuần qua email'),
('notifications', 'emailTemplate', 'default', 'Mẫu email sử dụng'),

-- Upload Settings
('upload', 'maxFileSize', '10', 'Kích thước file tối đa (MB)'),
('upload', 'allowedExtensions', '["jpg","jpeg","png","pdf","doc","docx"]', 'Các định dạng file cho phép'),
('upload', 'avatarMaxSize', '5', 'Kích thước avatar tối đa (MB)'),
('upload', 'documentMaxSize', '20', 'Kích thước tài liệu tối đa (MB)'),
('upload', 'autoCompress', 'true', 'Tự động nén ảnh khi upload'),
('upload', 'storagePath', '/uploads', 'Đường dẫn lưu trữ file'),
('upload', 'backupEnabled', 'true', 'Bật/tắt sao lưu tự động');
