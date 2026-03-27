import React from 'react';
import { clsx } from 'clsx';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const alertVariants = {
  success: {
    container: 'bg-success/10 border-success/30 text-success',
    icon: FaCheckCircle,
    iconColor: 'text-success',
  },
  error: {
    container: 'bg-destructive/10 border-destructive/30 text-destructive',
    icon: FaTimesCircle,
    iconColor: 'text-destructive',
  },
  warning: {
    container: 'bg-warning/10 border-warning/30 text-warning',
    icon: FaExclamationTriangle,
    iconColor: 'text-warning',
  },
  info: {
    container: 'bg-primary/10 border-primary/30 text-primary',
    icon: FaInfoCircle,
    iconColor: 'text-primary',
  },
};

const Alert = ({ children, variant = 'info', title, onClose, className = '', ...props }) => {
  const config = alertVariants[variant];
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
        <div className="text-sm opacity-80">{children}</div>
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
