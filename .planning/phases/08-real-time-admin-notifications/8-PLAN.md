---
phase: 8
wave: 1
depends_on: []
requirements:
  - RT-01
  - RT-02
files_modified:
  - DoAnTuyenSinh/backend/services/sseService.js
  - DoAnTuyenSinh/backend/index.js
  - DoAnTuyenSinh/src/contexts/NotificationContext.jsx
  - DoAnTuyenSinh/src/components/NotificationBell.jsx
  - DoAnTuyenSinh/src/App.jsx
  - DoAnTuyenSinh/src/admin/components/AdminLayout.jsx
autonomous: false
type: execute
must_haves:
  truths:
    - Admin browser maintains SSE connection to Express backend with 30s heartbeat comments
    - SSE reconnects automatically with exponential backoff if connection drops (1s, 2s, 4s... max 30s, up to 10 attempts)
    - Admin sees notification bell icon with live unread count badge in admin header
    - Admin can open notification dropdown to see list of new application alerts
    - SSE broadcasts to all connected admin clients when a new application is submitted
  artifacts:
    - path: DoAnTuyenSinh/backend/services/sseService.js
      provides: Client registry with add/remove/broadcast/broadcastAll methods
    - path: DoAnTuyenSinh/backend/index.js
      provides: SSE endpoint at GET /api/sse/events with JWT validation, 30s heartbeat, cleanup
    - path: DoAnTuyenSinh/src/contexts/NotificationContext.jsx
      provides: SSE lifecycle management with exponential backoff reconnection
    - path: DoAnTuyenSinh/src/components/NotificationBell.jsx
      provides: Bell icon with badge, dropdown panel, connection status indicator
    - path: DoAnTuyenSinh/src/App.jsx
      provides: NotificationProvider wrapping BrowserRouter
    - path: DoAnTuyenSinh/src/admin/components/AdminLayout.jsx
      provides: NotificationBell rendered in admin header
  key_links:
    - from: backend/index.js
      to: backend/services/sseService.js
      via: import and broadcast() call on new application
      pattern: sseService.broadcast.*new_application
    - from: NotificationContext.jsx
      to: backend/index.js SSE endpoint
      via: EventSource to /api/sse/events
      pattern: new EventSource.*sse/events
    - from: NotificationBell.jsx
      to: NotificationContext.jsx
      via: useNotifications hook
      pattern: useNotifications.*notifications
user_setup: []
---

# Phase 8: Real-time + Admin Notifications

## Plan 01: SSE Backend (Service + Endpoint + Broadcast Triggers)

**Type:** execute | **Wave:** 1 | **Autonomous:** true

### Objective

Build the Express SSE infrastructure: client registry service, SSE endpoint at `GET /api/sse/events` with JWT validation and 30s heartbeat, and broadcast triggers on new application submission.

### Context

**Files to read before implementing:**
- `DoAnTuyenSinh/backend/index.js` -- locate `authenticateToken` import (line 22), application POST route (line 607), existing CORS config (lines 58-64), Express `app` setup (line 25), and `pool` import (line 6)
- `DoAnTuyenSinh/backend/middleware/auth.js` -- understand `authenticateToken` signature: sets `req.user` from decoded JWT payload containing `{id, username, role}`

**Key interfaces:**
- `authenticateToken` middleware from `./middleware/auth.js` -- validates `Authorization: Bearer <token>` header
- `pool` from `./config/database.js` -- MySQL connection pool (used for `await pool.execute()`)
- Express `app` instance from `index.js`

**Backend route prefix:** The auth-prefixed routes (line ~80 of index.js) use a variable prefix. The application POST is at `${authPrefix}/apply`.

---

### Task 1: Create SSE Service

<read_first>
- Create: `DoAnTuyenSinh/backend/services/sseService.js` (new file -- no read needed)
</read_first>

<action>
Create `DoAnTuyenSinh/backend/services/sseService.js` with this exact implementation:

```javascript
// backend/services/sseService.js
class SSEService {
    constructor() {
        // Map of channelKey -> Set of Express response objects
        // channelKey is either 'admin' (all admins) or a userId string (per-user)
        this.clients = new Map();
    }

    // Add a client response object to a channel
    addClient(channelKey, res) {
        if (!this.clients.has(channelKey)) {
            this.clients.set(channelKey, new Set());
        }
        this.clients.get(channelKey).add(res);
        console.log(`[SSE] Client connected: ${channelKey} (total: ${this.clients.get(channelKey).size})`);
    }

    // Remove a client response object from a channel
    removeClient(channelKey, res) {
        if (this.clients.has(channelKey)) {
            this.clients.get(channelKey).delete(res);
            if (this.clients.get(channelKey).size === 0) {
                this.clients.delete(channelKey);
            }
        }
        console.log(`[SSE] Client disconnected: ${channelKey}`);
    }

    // Send event to all clients in a specific channel
    broadcast(channelKey, eventName, data) {
        const clientSet = this.clients.get(channelKey);
        if (!clientSet || clientSet.size === 0) return;

        const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const res of clientSet) {
            if (!res.writableEnded) {
                res.write(message);
            }
        }
    }

    // Send event to ALL connected clients (all channels)
    broadcastAll(eventName, data) {
        const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const [, clientSet] of this.clients) {
            for (const res of clientSet) {
                if (!res.writableEnded) {
                    res.write(message);
                }
            }
        }
    }

    // Get count of connected clients for monitoring
    getConnectionCount(channelKey) {
        return this.clients.has(channelKey) ? this.clients.get(channelKey).size : 0;
    }

    getTotalConnections() {
        let total = 0;
        for (const [, clientSet] of this.clients) {
            total += clientSet.size;
        }
        return total;
    }
}

export default new SSEService();
```

**Important:** Use `export default new SSEService()` (singleton pattern) so the same registry is shared across all requests.
</action>

<acceptance_criteria>
- `DoAnTuyenSinh/backend/services/sseService.js` exists and contains `export default new SSEService()`
- File contains `addClient`, `removeClient`, `broadcast`, `broadcastAll` methods
- No syntax errors -- `node --check backend/services/sseService.js` passes
</acceptance_criteria>

<done>
SSE service singleton with client registry exists at `backend/services/sseService.js`
</done>

---

### Task 2: Add SSE Endpoint to Express

<read_first>
- `DoAnTuyenSinh/backend/index.js` (lines 1-100 for imports, line ~22 for authenticateToken import, lines 58-64 for CORS config, line 25 for `app` instance, line 6 for `pool` import)
</read_first>

<action>
Add the following to `DoAnTuyenSinh/backend/index.js`:

**1. Add the import** at the top of the file (after the existing imports, around line 23):
```javascript
import sseService from './services/sseService.js';
```

**2. Add the SSE endpoint** AFTER the CORS config (after line 64) and BEFORE the body parsing middleware (before line 67). Place it right after the `app.use(cors(...))` block:

```javascript
// SSE endpoint for real-time notifications
app.get('/api/sse/events', authenticateToken, (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    // Determine channel: 'admin' for admin/staff roles, userId for others
    const userId = req.user.id;
    const role = req.user.role;
    const channelKey = (role === 'admin' || role === 'staff') ? 'admin' : userId;

    // Register client
    sseService.addClient(channelKey, res);

    // Send initial connection confirmation
    res.write(`event: connected\ndata: ${JSON.stringify({ channel: channelKey, message: 'SSE connected' })}\n\n`);

    // Heartbeat: send comment every 30 seconds to keep connection alive
    const heartbeat = setInterval(() => {
        if (!res.writableEnded) {
            res.write(': heartbeat\n\n');
        } else {
            clearInterval(heartbeat);
        }
    }, 30000);

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        sseService.removeClient(channelKey, res);
    });
});
```

**Critical requirements:**
- The SSE endpoint MUST use `authenticateToken` middleware to validate JWT before establishing the stream
- Channel key MUST be `'admin'` for admin/staff roles (broadcast to all admins) and `userId` for regular users (per-user)
- Heartbeat MUST be a comment line (`: heartbeat`) not a named event, sent every 30000ms
- Cleanup MUST clear the heartbeat interval and call `sseService.removeClient` on `req.on('close')`
</action>

<acceptance_criteria>
- `backend/index.js` contains `import sseService from './services/sseService.js'`
- `backend/index.js` contains `app.get('/api/sse/events', authenticateToken,`
- SSE handler sets `Content-Type: text/event-stream` and `Cache-Control: no-cache, no-store, must-revalidate`
- SSE handler has `res.flushHeaders()` call after setting headers
- SSE handler registers client with `sseService.addClient(channelKey, res)`
- SSE handler sends heartbeat via `setInterval(..., 30000)` with comment line `: heartbeat\n\n`
- SSE handler has `req.on('close', ...)` that clears heartbeat and calls `sseService.removeClient`
- Channel key is `'admin'` for `role === 'admin' || role === 'staff'`, otherwise `req.user.id`
</acceptance_criteria>

<done>
SSE endpoint exists at GET /api/sse/events, validates JWT, sends 30s heartbeat comments, registers client in sseService
</done>

---

### Task 3: Trigger SSE Broadcast on New Application

<read_first>
- `DoAnTuyenSinh/backend/index.js` -- find the application POST route (around line 607, look for `app.post(\`${authPrefix}/apply\``) and read its full handler to find where to insert the broadcast call after successful insertion)
</read_first>

<action>
Find the `app.post(\`${authPrefix}/apply\`` route in `backend/index.js`. Read the full handler to find the `await pool.execute` INSERT call that creates a new application. After the successful INSERT (where `results.insertId` is available), add this broadcast call:

```javascript
// After successful application insert (after results.insertId is available):
// Broadcast new application notification to all admins
sseService.broadcast('admin', 'new_application', {
    id: results.insertId,
    candidateName: fullName || email,
    email: email,
    major: majorId,
    timestamp: new Date().toISOString()
});
```

The broadcast MUST:
- Use `sseService.broadcast('admin', ...)` to send only to admin channel (not all clients)
- Event name MUST be `'new_application'`
- Data payload MUST include at minimum: `id` (application insertId), `candidateName`, `email`, `timestamp`

Also add the `sseService` import at the top if not already present:
```javascript
import sseService from './services/sseService.js';
```

**Note:** If the file already has the import from Task 2, do NOT add it again.
</action>

<acceptance_criteria>
- `sseService` is imported at the top of `backend/index.js`
- The application POST handler calls `sseService.broadcast('admin', 'new_application', ...)` after successful INSERT
- Broadcast payload contains: `id` (insertId), `candidateName`, `email`, `timestamp`
- Broadcast event name is exactly `'new_application'`
</acceptance_criteria>

<done>
New application submissions broadcast SSE event to all connected admin clients
</done>

---

### Verification

**Backend SSE test:**

1. Start the backend: `cd DoAnTuyenSinh/backend && npm start`
2. Get a valid JWT token by logging in via the login endpoint
3. Test SSE connection with curl:
   ```bash
   curl -N -H "Authorization: Bearer <YOUR_TOKEN>" http://localhost:3001/api/sse/events
   ```
   Expected: Streams `event: connected\ndata: {...}\n\n` then `: heartbeat\n\n` every 30s
4. Submit a new application (POST to `/api/auth/apply`) while SSE is connected
   Expected: SSE receives `event: new_application\ndata: {...}\n\n`
5. Verify connection cleanup: close the curl connection, check server logs for `[SSE] Client disconnected`

---

## Plan 02: NotificationBell UI (Context + Component + Integration)

**Type:** execute | **Wave:** 2 | **Autonomous:** false (has checkpoint)

### Objective

Build the frontend NotificationContext that manages the SSE connection with exponential backoff reconnection, and the NotificationBell component that shows a badge counter and dropdown list of notifications. Integrate into the admin header.

### Context

**Files to read before implementing:**
- `DoAnTuyenSinh/DoAnTuyenSinh/src/accounts/UserContext.jsx` -- understand provider structure, exported `useUser` hook, `user.id`, `user.role`, `token` values
- `DoAnTuyenSinh/DoAnTuyenSinh/src/components/ThanhHeader.jsx` -- find the right section to insert NotificationBell (right section near ThemeToggle around line 237)
- `DoAnTuyenSinh/DoAnTuyenSinh/src/App.jsx` -- see provider nesting order (line 191: UserContextProvider wraps everything)
- `DoAnTuyenSinh/DoAnTuyenSinh/src/config/apiConfig.js` -- API_BASE_URL is `http://localhost:3001/api`, full SSE URL will be `http://localhost:3001/api/sse/events`
- `DoAnTuyenSinh/DoAnTuyenSinh/src/admin/components/AdminLayout.jsx` -- already has `notifications` state, `fetchNotifications`, and a bell button using `FaBell` icon (line 16, 35, 65-83). The bell is currently only in AdminLayout, not in the public ThanhHeader.

**Important:** RT-02 says "Admin sees notification bell icon in header" -- the admin uses the admin dashboard (via AdminLayout), NOT the public ThanhHeader. So NotificationBell should be integrated into `AdminLayout.jsx`, not `ThanhHeader.jsx`. The AdminLayout already has a bell button structure (FaBell + notifications dropdown) -- we need to replace the static polling with live SSE-driven updates.

---

### Task 1: Create NotificationContext

<read_first>
- `DoAnTuyenSinh/DoAnTuyenSinh/src/accounts/UserContext.jsx` -- understand `useUser()` return value: `{ user, role, token, isDemoMode, ... }`
- `DoAnTuyenSinh/DoAnTuyenSinh/src/config/apiConfig.js` -- `API_CONFIG.BASE_URL` is `http://localhost:3001` (dev) or `import.meta.env.VITE_API_URL`
</read_first>

<action>
Create `DoAnTuyenSinh/DoAnTuyenSinh/src/contexts/NotificationContext.jsx` with this exact implementation:

```javascript
// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../accounts/UserContext';
import { toast } from 'sonner';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export function NotificationProvider({ children }) {
    const { user, role, token, isDemoMode } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);

    const eventSourceRef = useRef(null);
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    const isAdminOrStaff = role === 'admin' || role === 'staff';

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s (max 30s cap)
    const getRetryDelay = useCallback((retryCount) => {
        const baseDelay = 1000;
        const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
        return delay;
    }, []);

    const connectSSE = useCallback(() => {
        // Skip SSE in demo mode or when not authenticated
        if (isDemoMode || !token || !user?.id || !isAdminOrStaff) {
            return;
        }

        // Close existing connection if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const sseUrl = `${API_BASE}/api/sse/events`;

        try {
            const eventSource = new EventSource(sseUrl, { withCredentials: true });
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                if (!isMountedRef.current) return;
                setIsConnected(true);
                setIsReconnecting(false);
                retryCountRef.current = 0;
                console.log('[SSE] Connected');
            };

            // Handle new_application event (admin)
            eventSource.addEventListener('new_application', (event) => {
                if (!isMountedRef.current) return;
                try {
                    const data = JSON.parse(event.data);
                    const notification = {
                        id: data.id || Date.now(),
                        title: 'Hồ sơ mới',
                        message: `Thí sinh ${data.candidateName || 'mới'} vừa nộp hồ sơ`,
                        type: 'new_application',
                        timestamp: data.timestamp || new Date().toISOString(),
                        unread: true,
                        applicationId: data.id,
                    };
                    setNotifications(prev => [notification, ...prev].slice(0, 50));
                    setUnreadCount(prev => prev + 1);
                    // Show toast notification
                    toast.success(notification.title, {
                        description: notification.message,
                        duration: 5000,
                    });
                } catch (err) {
                    console.error('[SSE] Failed to parse new_application event:', err);
                }
            });

            // Handle connected event
            eventSource.addEventListener('connected', (event) => {
                if (!isMountedRef.current) return;
                console.log('[SSE] Received connected event:', event.data);
            });

            eventSource.onerror = () => {
                if (!isMountedRef.current) return;
                setIsConnected(false);
                eventSource.close();
                eventSourceRef.current = null;

                // Exponential backoff reconnection
                if (retryCountRef.current < 10) {
                    const delay = getRetryDelay(retryCountRef.current);
                    setIsReconnecting(true);
                    console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1})`);
                    retryCountRef.current += 1;
                    retryTimeoutRef.current = setTimeout(connectSSE, delay);
                } else {
                    console.error('[SSE] Max reconnection attempts reached');
                    setIsReconnecting(false);
                }
            };
        } catch (err) {
            console.error('[SSE] Failed to create EventSource:', err);
        }
    }, [token, user?.id, isAdminOrStaff, isDemoMode, getRetryDelay]);

    // Connect SSE when user changes
    useEffect(() => {
        isMountedRef.current = true;

        if (isAdminOrStaff && !isDemoMode && token) {
            // Small delay to ensure UserContext is fully loaded
            const timer = setTimeout(connectSSE, 500);
            return () => {
                isMountedRef.current = false;
                clearTimeout(timer);
                if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
                setIsConnected(false);
                setIsReconnecting(false);
            };
        } else {
            // Clean up when logged out or not admin
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            setIsConnected(false);
            setIsReconnecting(false);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAdminOrStaff, token, isDemoMode, connectSSE]);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        setUnreadCount(0);
    }, []);

    // Clear all notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const value = {
        notifications,
        unreadCount,
        isConnected,
        isReconnecting,
        markAsRead,
        markAllAsRead,
        clearNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
```

**Key design decisions:**
- SSE connects only for admin/staff roles, not for regular users
- Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s, up to 10 attempts
- Max 50 notifications stored in state (oldest dropped)
- Shows sonner toast on new application event
- Cleanup on unmount: closes EventSource, clears timeout, sets `isMountedRef` flag
- Demo mode skips SSE entirely
</action>

<acceptance_criteria>
- `DoAnTuyenSinh/DoAnTuyenSinh/src/contexts/NotificationContext.jsx` exists
- File exports `NotificationProvider` component and `useNotifications()` hook
- Context has state: `notifications`, `unreadCount`, `isConnected`, `isReconnecting`
- Context has methods: `markAsRead`, `markAllAsRead`, `clearNotifications`
- SSE connects only when `role === 'admin' || role === 'staff'` AND `!isDemoMode` AND `token` exists
- SSE uses `EventSource` with exponential backoff reconnection (max 10 attempts, cap 30s)
- SSE handler listens for `new_application` event and shows toast via sonner
- All cleanup (EventSource close, timeout clear, `isMountedRef`) happens in useEffect return
</acceptance_criteria>

<done>
NotificationContext manages SSE connection lifecycle with exponential backoff, stores notifications, tracks unread count
</done>

---

### Task 2: Create NotificationBell Component

<read_first>
- `DoAnTuyenSinh/DoAnTuyenSinh/src/contexts/NotificationContext.jsx` (just created above)
- `DoAnTuyenSinh/DoAnTuyenSinh/src/admin/components/AdminLayout.jsx` -- see existing notification dropdown structure around lines 35, 65-120, and bell button structure to understand styling patterns
</read_first>

<action>
Create `DoAnTuyenSinh/DoAnTuyenSinh/src/components/NotificationBell.jsx` with this exact implementation:

```javascript
// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaFileAlt, FaCheck, FaTrash, FaCircle } from 'react-icons/fa';
import { useNotifications } from '../contexts/NotificationContext';
import { useUser } from '../accounts/UserContext';

const NotificationBell = () => {
    const { notifications, unreadCount, isConnected, isReconnecting, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
    const { isDemoMode } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_application':
                return <FaFileAlt className="text-blue-500" />;
            default:
                return <FaBell className="text-gray-500" />;
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const connectionStatusColor = isConnected ? 'bg-green-500' : isReconnecting ? 'bg-yellow-500' : 'bg-red-500';
    const connectionStatusText = isConnected ? 'Đã kết nối' : isReconnecting ? 'Đang kết nối...' : 'Mất kết nối';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${
                    isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Thông báo"
            >
                <FaBell className="text-gray-700 dark:text-gray-300 text-lg" />
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
                {/* Connection Status Dot */}
                {!isDemoMode && (
                    <span
                        className={`absolute top-0 right-0 w-2 h-2 ${connectionStatusColor} rounded-full border border-white dark:border-gray-900`}
                        title={connectionStatusText}
                    />
                )}
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">Thông báo</h3>
                                {!isDemoMode && (
                                    <span className={`w-2 h-2 rounded-full ${connectionStatusColor}`} />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {notifications.length > 0 && (
                                    <>
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                            title="Đánh dấu đã đọc"
                                        >
                                            Đọc hết
                                        </button>
                                        <button
                                            onClick={clearNotifications}
                                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                            title="Xóa tất cả"
                                        >
                                            Xóa
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FaBell className="mx-auto text-gray-300 dark:text-gray-600 text-3xl mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Chưa có thông báo nào</p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                        Thông báo sẽ xuất hiện khi có hồ sơ mới
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                                            notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                        onClick={() => notification.unread && markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-sm font-semibold truncate ${
                                                        notification.unread
                                                            ? 'text-gray-900 dark:text-gray-100'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {notification.title}
                                                    </p>
                                                    {notification.unread && (
                                                        <FaCircle className="text-blue-500 text-[6px] flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    {formatTimestamp(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {notifications.length} thông báo
                                    {!isDemoMode && (
                                        <span className="ml-1">
                                            | {connectionStatusText}
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
```

**Key design decisions:**
- Bell icon with unread count badge (red, top-right corner)
- Connection status dot (green=connected, yellow=reconnecting, red=disconnected)
- Dropdown with notification list: icon, title, message, timestamp
- "Đọc hết" and "Xóa" action buttons in header
- Empty state when no notifications
- Click notification to mark as read
- Footer shows total count and connection status
- Demo mode hides connection status dot
</action>

<acceptance_criteria>
- `DoAnTuyenSinh/DoAnTuyenSinh/src/components/NotificationBell.jsx` exists
- Bell button renders with `FaBell` icon
- Unread badge shows when `unreadCount > 0`, displays count (99+ max)
- Connection status dot: green when `isConnected`, yellow when `isReconnecting`, red when disconnected
- Dropdown shows notification list with icon, title, message, formatted timestamp
- "Đọc hết" button calls `markAllAsRead`, "Xóa" button calls `clearNotifications`
- Empty state shown when `notifications.length === 0`
- Click on unread notification calls `markAsRead`
- Dropdown closes on outside click (uses ref + mousedown listener)
</acceptance_criteria>

<done>
NotificationBell component renders bell icon with badge, dropdown panel with notification list, and connection status indicator
</done>

---

### Task 3: Integrate NotificationProvider and NotificationBell

<read_first>
- `DoAnTuyenSinh/DoAnTuyenSinh/src/App.jsx` -- see provider nesting (line 191: UserContextProvider is the innermost real provider)
- `DoAnTuyenSinh/DoAnTuyenSinh/src/admin/components/AdminLayout.jsx` -- see existing bell button, notification refs, and right section of header (around line 237)
</read_first>

<action>
**Step A: Add NotificationProvider to App.jsx**

Modify `DoAnTuyenSinh/DoAnTuyenSinh/src/App.jsx`:

1. Add import after the existing imports (around line 10):
```javascript
import { NotificationProvider } from './contexts/NotificationContext';
```

2. Wrap the children of `UserContextProvider` with `NotificationProvider`. The current structure is:
```jsx
<UserContextProvider>
  <BrowserRouter>
    ...
  </BrowserRouter>
</UserContextProvider>
```

Change it to:
```jsx
<UserContextProvider>
  <NotificationProvider>
    <BrowserRouter>
      ...
    </BrowserRouter>
  </NotificationProvider>
</UserContextProvider>
```

**Important:** `NotificationProvider` MUST be INSIDE `UserContextProvider` because NotificationContext depends on `useUser()` which comes from UserContext.

**Step B: Add NotificationBell to AdminLayout.jsx**

Modify `DoAnTuyenSinh/DoAnTuyenSinh/src/admin/components/AdminLayout.jsx`:

1. Add import at the top with other imports (after line 29):
```javascript
import NotificationBell from '../../components/NotificationBell';
```

2. Find the top navbar/header section of AdminLayout (look for the `<header>` element or the section with `FaCog`, `FaBell`, etc. around line 270+). The header has a right section with `FaBell` (existing) and profile dropdown.

   Replace the existing `FaBell` button with `<NotificationBell />`. The existing bell button in AdminLayout uses a different approach (polling via `fetchNotifications`). We need to keep the NotificationBell component but we can keep the existing notification dropdown for now -- the NotificationContext will provide the SSE-driven notifications while the existing `notifications` state from AdminLayout can coexist as a secondary source or be replaced.

   **Recommended approach:** Replace the existing bell button + notifications dropdown with `<NotificationBell />` and remove the old `fetchNotifications` useEffect and `notifications` state (since SSE will now drive notifications in real-time).

   Find the section that renders the bell icon (around line 270-310 in AdminLayout). Look for `FaBell` in the JSX. Replace the notification bell button + dropdown section with:
   ```jsx
   <NotificationBell />
   ```

   Then remove the `notifications` state (line 45), `notificationsLoading` state (line 46), `fetchNotifications` async function (lines 65-83), and the `useEffect` that calls `fetchNotifications` (should be around line 48+).

   Keep the existing profile dropdown and other header elements intact.

   **Alternative (safer):** If the existing AdminLayout notification dropdown has additional functionality that should be preserved, keep both -- add `<NotificationBell />` as an additional button next to the existing bell, and remove just the SSE-replaced notification fetch useEffect. But since RT-02 only requires "notification bell icon with badge counter and dropdown", replacing the existing structure with NotificationBell is cleaner.
</action>

<acceptance_criteria>
- `App.jsx` contains `import { NotificationProvider } from './contexts/NotificationContext'`
- `App.jsx` has `<NotificationProvider>` wrapping `<BrowserRouter>` inside `<UserContextProvider>`
- `AdminLayout.jsx` contains `import NotificationBell from '../../components/NotificationBell'`
- `AdminLayout.jsx` renders `<NotificationBell />` in the header's right section
- `AdminLayout.jsx` does NOT have `fetchNotifications` or `notifications` state that would conflict with NotificationContext (either removed or left for non-SSE notifications)
</acceptance_criteria>

<done>
NotificationProvider wraps the app inside UserContextProvider, NotificationBell renders in AdminLayout header for admin users
</done>

---

### Task 4: Verification (Human Checkpoint)

<task type="checkpoint:human-verify">
<what-built>
Complete Phase 8 implementation: SSE endpoint with heartbeat, NotificationContext with exponential backoff, NotificationBell with badge counter and dropdown. The notification bell appears in the admin dashboard header.
</what-built>

<how-to-verify>

**Backend (SSE Endpoint):**
1. Start backend: `cd DoAnTuyenSinh/backend && npm start`
2. Login as admin and capture the JWT token
3. Test SSE endpoint:
   ```bash
   curl -N -H "Authorization: Bearer <TOKEN>" http://localhost:3001/api/sse/events
   ```
   Expected: `event: connected\ndata: {...}\n\n` immediately, then `: heartbeat\n\n` every 30 seconds
4. Check server logs for `[SSE] Client connected: admin`
5. Close the curl connection -- check logs for `[SSE] Client disconnected: admin`

**Frontend (NotificationBell):**
1. Start frontend: `cd DoAnTuyenSinh && npm run dev`
2. Login as admin
3. Navigate to admin dashboard (`/admin/tong-quan`)
4. Verify: Bell icon visible in admin header (top-right area)
5. Verify: Small colored dot on bell icon (green=connected, check browser console for `[SSE] Connected`)
6. Have another user submit a new application (or trigger via API):
   ```bash
   curl -X POST http://localhost:3001/api/auth/apply \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@test.com","phone":"0123456789","majorId":1}'
   ```
7. Verify:
   - Bell badge counter increments (red badge with count)
   - Toast notification appears (top-right, blue)
   - Click bell -- dropdown shows notification with title "Hồ sơ mới" and message "Thí sinh Test User vừa nộp hồ sơ"
   - Click notification -- badge count decreases
   - Connection status dot remains green

**Reconnection Test:**
1. Stop the backend server
2. Wait 5 seconds -- verify connection dot turns yellow (reconnecting) then red (disconnected)
3. Restart the backend server
4. Wait -- verify dot turns green again and SSE reconnects automatically
</how-to-verify>

<resume-signal>Type "approved" or describe issues
</resume-signal>
</task>
