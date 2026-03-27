import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const modalSizes = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  full: 'max-w-full',
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
  animate = true,
  blur = true,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!closeOnEscape) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (!preventScroll) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const modalClasses = clsx(
    'relative bg-background dark:bg-card rounded-2xl border border-border dark:border-border shadow-xl',
    'w-full mx-4',
    modalSizes[size],
    className
  );

  const overlayClasses = clsx(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    'bg-black/50 dark:bg-black/70',
    {
      'backdrop-blur-sm': blur,
    },
    overlayClassName
  );

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={overlayClasses}
          onClick={handleOverlayClick}
          variants={animate ? overlayVariants : undefined}
          initial={animate ? "hidden" : undefined}
          animate={animate ? "visible" : undefined}
          exit={animate ? "exit" : undefined}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className={modalClasses}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            tabIndex={-1}
            variants={animate ? modalVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            exit={animate ? "exit" : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 pb-4">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-foreground"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className={clsx('px-6', {
              'pb-6': !title && !showCloseButton,
              'pt-0 pb-6': title || showCloseButton
            })}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

const ModalHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-b border-border dark:border-border', className)} {...props}>
    {children}
  </div>
);

const ModalTitle = ({ children, className = '', as: Component = 'h2', ...props }) => (
  <Component
    className={clsx('text-xl font-semibold text-foreground', className)}
    {...props}
  >
    {children}
  </Component>
);

const ModalBody = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('px-6 py-4 border-t border-border dark:border-border bg-muted dark:bg-card rounded-b-2xl', className)} {...props}>
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
export default Modal;
export { ModalHeader, ModalTitle, ModalBody, ModalFooter };
