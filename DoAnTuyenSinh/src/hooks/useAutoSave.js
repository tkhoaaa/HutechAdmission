import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useAutoSave = (data, key, delay = 2000) => {
    const timeoutRef = useRef(null);
    const lastSavedRef = useRef(null);

    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Don't save if data hasn't changed
        const currentData = JSON.stringify(data);
        if (currentData === lastSavedRef.current) {
            return;
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, currentData);
                lastSavedRef.current = currentData;

                // Show subtle save notification
                toast.info('Đã tự động lưu bản nháp', { description: 'Lưu tự động' });
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, delay);

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, key, delay]);

    // Function to manually save
    const saveNow = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        try {
            const currentData = JSON.stringify(data);
            localStorage.setItem(key, currentData);
            lastSavedRef.current = currentData;
            toast.success('Đã lưu bản nháp thành công');
        } catch (error) {
            console.error('Manual save failed:', error);
            toast.error('Không thể lưu bản nháp');
        }
    };

    // Function to load saved data
    const loadSaved = () => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Load saved data failed:', error);
        }
        return null;
    };

    // Function to clear saved data
    const clearSaved = () => {
        try {
            localStorage.removeItem(key);
            lastSavedRef.current = null;
            toast.info('Đã xóa bản nháp');
        } catch (error) {
            console.error('Clear saved data failed:', error);
        }
    };

    return { saveNow, loadSaved, clearSaved };
};