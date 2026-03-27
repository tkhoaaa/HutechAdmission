import React, { useState, useRef, useEffect, useId } from 'react';
import { clsx } from 'clsx';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Chọn...',
  label,
  error,
  disabled = false,
  className = '',
  size = 'md',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectId = useId();
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const optionSizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div className={clsx('relative', className)} ref={ref}>
      {label && (
        <label
          htmlFor={selectId}
          className={clsx(
            'block text-sm font-medium mb-2',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        id={selectId}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-2 rounded-lg border bg-background',
          'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          sizeClasses[size],
          error
            ? 'border-destructive text-destructive'
            : 'border-input hover:border-muted-foreground/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      >
        <span className={clsx(!selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          className={clsx(
            'w-4 h-4 flex-shrink-0 transition-transform duration-200 text-muted-foreground',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-popover text-popover-foreground border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between gap-2',
                  optionSizeClasses[size],
                  'text-left transition-colors duration-150',
                  option.value === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {option.label}
                {option.value === value && <FaCheck className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export { Select };
export default Select;
