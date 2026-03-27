import React from 'react';
import { clsx } from 'clsx';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const alertVariants = {
  default: {
    container: 'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40 dark:text-primary',
    icon: FaInfoCircle,
    iconColor: 'text-primary',
  },
  success: {
    container: 'bg-green-500/10 border-green-500/30 text-green-700 dark:bg-green-500/20 dark:border-green-500/40 dark:text-green-400',
    icon: FaCheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
  },
  destructive: {
    container: 'bg-destructive/10 border-destructive/30 text-destructive dark:bg-destructive/20 dark:border-destructive/40 dark:text-destructive',
    icon: FaTimesCircle,
    iconColor: 'text-destructive dark:text-destructive',
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/20 dark:border-yellow-500/40 dark:text-yellow-400',
    icon: FaExclamationTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
};

const Alert = ({ children, variant = 'default', title, onClose, className = '', ...props }) => {
  const config = alertVariants[variant] || alertVariants.default;
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'flex gap-3 p-4 rounded-lg border',
        config.container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Đóng"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export { Alert };
export default Alert;
