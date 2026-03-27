import React from 'react';
import { clsx } from 'clsx';

const badgeVariants = {
  default:
    'bg-muted text-muted-foreground',
  success:
    'bg-success/10 text-success border border-success/30',
  warning:
    'bg-warning/10 text-warning border border-warning/30',
  error:
    'bg-destructive/10 text-destructive border border-destructive/30',
  info:
    'bg-primary/10 text-primary border border-primary/30',
  destructive:
    'bg-destructive/10 text-destructive border border-destructive/30',
  pending:
    'bg-warning/10 text-warning border border-warning/30',
  approved:
    'bg-success/10 text-success border border-success/30',
  rejected:
    'bg-destructive/10 text-destructive border border-destructive/30',
};

const Badge = ({ children, variant = 'default', size = 'md', icon, className = '', ...props }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        badgeVariants[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export { Badge };
export default Badge;
