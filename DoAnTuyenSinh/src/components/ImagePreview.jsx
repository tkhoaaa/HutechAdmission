import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSearchPlus, FaSearchMinus, FaArrowsAlt, FaDownload, FaFilePdf } from 'react-icons/fa';

export default function ImagePreview({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 5));
      if (e.key === '-') setScale(s => Math.max(s - 0.25, 0.5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset position when src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.5, Math.min(s + delta, 5)));
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const content = (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[1100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        {/* Controls bar */}
        <div className="absolute top-0 left-0 right-0 z-[1101] flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm font-medium">{alt || 'Xem ảnh'}</span>
            <span className="text-white/40 text-xs">{Math.round(scale * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.5, 5)); }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Phóng to (+)"
            >
              <FaSearchPlus />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.5, 0.5)); }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Thu nhỏ (-)"
            >
              <FaSearchMinus />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Đặt lại"
            >
              <FaArrowsAlt />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Tải về"
            >
              <FaDownload />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors"
              title="Đóng (ESC)"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Image */}
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: isDragging ? 'none' : 'transform 0.2s ease'
          }}
          draggable={false}
          onClick={(e) => { e.stopPropagation(); if (scale < 1) setScale(s => Math.min(s + 0.5, 3)); }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
