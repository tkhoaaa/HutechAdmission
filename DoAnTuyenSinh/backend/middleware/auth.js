import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

export const authenticateAdminFAQ = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Không có quyền truy cập' });
        }
        const token = authHeader.split(' ')[1];
        const [rows] = await pool.execute(
            'SELECT id, username, role FROM users WHERE token = ? AND role IN ("admin", "staff")',
            [token]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc không có quyền' });
        }
        req.user = rows[0];
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xác thực', error: error.message });
    }
};