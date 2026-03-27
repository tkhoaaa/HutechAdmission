import React from 'react';
import { clsx } from 'clsx';

const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export { EmptyState };
export default EmptyState;
