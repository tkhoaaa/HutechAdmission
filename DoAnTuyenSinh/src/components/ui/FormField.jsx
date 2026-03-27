import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Input } from './Input';
import { clsx } from 'clsx';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  validation,
  error,
  success,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const hasError = error && hasBeenTouched;
  const hasSuccess = success && hasBeenTouched && !error;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasBeenTouched(true);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const labelColorClass = hasError
    ? 'text-destructive dark:text-destructive'
    : hasSuccess
    ? 'text-green-600 dark:text-green-400'
    : isFocused
    ? 'text-primary dark:text-primary'
    : 'text-foreground dark:text-foreground';

  const ringColorClass = hasError
    ? 'ring-2 ring-destructive dark:ring-destructive'
    : hasSuccess
    ? 'ring-2 ring-green-500 dark:ring-green-400'
    : isFocused
    ? 'ring-2 ring-primary dark:ring-primary'
    : 'ring-1 ring-input dark:ring-input';

  const passwordStrength = isPassword && value
    ? value.length < 6 ? 'weak' : value.length < 8 ? 'medium' : 'strong'
    : null;

  const strengthColorClass = passwordStrength === 'weak'
    ? 'bg-destructive dark:bg-destructive'
    : passwordStrength === 'medium'
    ? 'bg-yellow-500 dark:bg-yellow-400'
    : 'bg-green-500 dark:bg-green-400';

  const strengthWidthClass = passwordStrength === 'weak'
    ? 'w-1/3'
    : passwordStrength === 'medium'
    ? 'w-2/3'
    : 'w-full';

  const strengthTextClass = passwordStrength === 'weak'
    ? 'text-destructive dark:text-destructive'
    : passwordStrength === 'medium'
    ? 'text-yellow-600 dark:text-yellow-400'
    : 'text-green-600 dark:text-green-400';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            'block text-sm font-semibold mb-2 transition-colors duration-200',
            labelColorClass
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <div className={clsx(
          'relative rounded-xl transition-all duration-300',
          ringColorClass
        )}>
          <Input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border-0',
              'bg-background dark:bg-input',
              'text-foreground dark:text-foreground',
              'placeholder:text-muted-foreground dark:placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-0',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-12' : '',
              (rightIcon || isPassword || hasError || hasSuccess) ? 'pr-12' : '',
              inputClassName
            )}
            {...props}
          />

          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}

            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-destructive"
                >
                  <FaExclamationTriangle />
                </motion.div>
              )}
              {hasSuccess && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-green-600 dark:text-green-400"
                >
                  <FaCheck />
                </motion.div>
              )}
            </AnimatePresence>

            {rightIcon && (
              <div className="text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {passwordStrength && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            className="mt-2"
          >
            <div className="h-1 bg-muted dark:bg-muted rounded-full overflow-hidden">
              <motion.div
                className={clsx('h-full transition-all duration-300', strengthColorClass)}
                initial={{ width: 0 }}
                animate={{ width: strengthWidthClass }}
              />
            </div>
            <p className={clsx('text-xs mt-1', strengthTextClass)}>
              {passwordStrength === 'weak' ? 'Yếu' : passwordStrength === 'medium' ? 'Trung bình' : 'Mạnh'}
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2 text-destructive dark:text-destructive text-sm"
          >
            <FaExclamationTriangle className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {hasSuccess && success && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
          >
            <FaCheck className="flex-shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {props.maxLength && (
        <div className="mt-1 text-right">
          <span className={clsx('text-xs', {
            'text-yellow-600 dark:text-yellow-400': value.length > props.maxLength * 0.9,
            'text-muted-foreground': value.length <= props.maxLength * 0.9,
          })}>
            {value.length}/{props.maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormField;
export { FormField };
