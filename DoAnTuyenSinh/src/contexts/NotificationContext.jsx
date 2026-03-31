import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../accounts/UserContext';
import { toast } from 'sonner';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};

export function NotificationProvider({ children }) {
    const { role, token, isDemoMode } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);

    const eventSourceRef = useRef(null);
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    const isAdminOrStaff = role === 'admin' || role === 'staff';

    const getRetryDelay = useCallback((count) => {
        return Math.min(1000 * Math.pow(2, count), 30000);
    }, []);

    const connectSSE = useCallback(() => {
        if (isDemoMode || !token || !isAdminOrStaff) return;
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const sseUrl = `${API_BASE}/api/sse/events?token=${encodeURIComponent(token)}`;

        try {
            const es = new EventSource(sseUrl);
            eventSourceRef.current = es;

            es.onopen = () => {
                if (!isMountedRef.current) return;
                setIsConnected(true);
                setIsReconnecting(false);
                retryCountRef.current = 0;
            };

            es.addEventListener('connected', () => {
                console.log('[SSE] Connected');
            });

            es.addEventListener('new_application', (event) => {
                if (!isMountedRef.current) return;
                try {
                    const data = JSON.parse(event.data);
                    const notification = {
                        id: data.id || Date.now(),
                        title: 'Hồ sơ mới',
                        message: `Thí sinh ${data.candidateName || 'mới'} vừa nộp hồ sơ`,
                        type: 'new_application',
                        time: 'Vừa xong',
                        unread: true,
                        applicationId: data.id,
                        candidateAvatar: data.candidateAvatar || null,
                        timestamp: data.timestamp || new Date().toISOString(),
                    };
                    setNotifications(prev => [notification, ...prev].slice(0, 50));
                    setUnreadCount(prev => prev + 1);
                    toast.success(notification.title, { description: notification.message, duration: 5000 });
                } catch (err) {
                    console.error('[SSE] Parse error:', err);
                }
            });

            es.onerror = () => {
                if (!isMountedRef.current) return;
                setIsConnected(false);
                es.close();
                eventSourceRef.current = null;

                if (retryCountRef.current < 10) {
                    const delay = getRetryDelay(retryCountRef.current);
                    setIsReconnecting(true);
                    retryCountRef.current += 1;
                    retryTimeoutRef.current = setTimeout(connectSSE, delay);
                } else {
                    setIsReconnecting(false);
                }
            };
        } catch (err) {
            console.error('[SSE] Failed to create EventSource:', err);
        }
    }, [token, isAdminOrStaff, isDemoMode, getRetryDelay]);

    useEffect(() => {
        isMountedRef.current = true;
        if (isAdminOrStaff && !isDemoMode && token) {
            const timer = setTimeout(connectSSE, 500);
            return () => {
                isMountedRef.current = false;
                clearTimeout(timer);
                clearTimeout(retryTimeoutRef.current);
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
                setIsConnected(false);
                setIsReconnecting(false);
            };
        } else {
            if (eventSourceRef.current) eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
            setIsReconnecting(false);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAdminOrStaff, token, isDemoMode, connectSSE]);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, isConnected, isReconnecting, markAsRead, markAllAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}
