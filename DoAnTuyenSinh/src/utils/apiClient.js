import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized) - redirect to login
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            window.location.href = '/accounts/dang-nhap';
            return Promise.reject(error);
        }

        // Handle other errors
        const errorMessage = (error.response && error.response.data && error.response.data.message) || 'Đã xảy ra lỗi không xác định';

        console.error('API Error:', {
            status: error.response && error.response.status,
            message: errorMessage,
            url: error.config && error.config.url
        });

        return Promise.reject({
            status: error.response && error.response.status,
            message: errorMessage,
            data: error.response && error.response.data
        });
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    registerAdmin: (adminData) => apiClient.post('/auth/register-admin', adminData),
    getProfile: () => apiClient.get('/auth/profile'),
    changePassword: (passwordData) => apiClient.post('/auth/change-password', passwordData),
    refreshToken: () => apiClient.post('/auth/refresh-token'),
    getFAQs: (params = {}) => apiClient.get('/auth/faqs', { params }),
};

// Admin API
export const adminAPI = {
    // Dashboard
    getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),

    // Applications
    getApplications: (params = {}) => apiClient.get('/admin/applications', { params }),
    updateApplicationStatus: (id, statusData) =>
        apiClient.patch(`/admin/applications/${id}/status`, statusData),

    // FAQs
    getFAQs: (params = {}) => apiClient.get('/admin/faqs', { params }),
    createFAQ: (faqData) => apiClient.post('/admin/faqs', faqData),
    updateFAQ: (id, faqData) => apiClient.put(`/admin/faqs/${id}`, faqData),
    deleteFAQ: (id) => apiClient.delete(`/admin/faqs/${id}`),

    // Contacts
    getContacts: (params = {}) => apiClient.get('/admin/contacts', { params }),
    respondToContact: (id, responseData) =>
        apiClient.post(`/admin/contacts/${id}/respond`, responseData),

    // Majors
    getMajors: () => apiClient.get('/admin/majors'),

    // Admission Methods
    getAdmissionMethods: () => apiClient.get('/admin/admission-methods'),

    // Settings
    getSettings: () => apiClient.get('/admin/settings'),
    updateSettings: (settingsData) => apiClient.put('/admin/settings', settingsData),

    // Notifications
    getNotifications: (params = {}) => apiClient.get('/admin/notifications', { params }),
    createNotification: (data) => apiClient.post('/admin/notifications', data),
    updateNotification: (id, data) => apiClient.put(`/admin/notifications/${id}`, data),
    deleteNotification: (id) => apiClient.delete(`/admin/notifications/${id}`),
    markNotificationRead: (id, data) => apiClient.patch(`/admin/notifications/${id}/read`, data),
};

// Utility functions
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const setUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

export const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const isAdmin = () => {
    const userInfo = getUserInfo();
    return userInfo && userInfo.role_name === 'admin';
};

export const isStaff = () => {
    const userInfo = getUserInfo();
    return userInfo && ['admin', 'staff'].includes(userInfo.role_name);
};

export default apiClient;