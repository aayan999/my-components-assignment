import React, { useState, useId } from 'react';
import clsx from 'clsx';

interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void; // 🔧 new prop to make clear handling cleaner
  label?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  loading = false,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  className,
  value,
  onChange,
  onClear,
  showClearButton = false,
  id,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // --- Base classes ---
  const baseClasses =
    'w-full border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const variantClasses = {
    outlined: 'border-gray-300 bg-white focus:ring-blue-500',
    filled: 'bg-gray-100 border-gray-100 focus:border-gray-300 focus:bg-white focus:ring-blue-500',
    ghost: 'border-transparent bg-transparent hover:bg-gray-100 focus:bg-white focus:ring-blue-500',
  };

  const stateClasses = {
    disabled: 'cursor-not-allowed bg-gray-100 text-gray-500',
    invalid: 'border-red-500 focus:ring-red-500',
    loading: 'pl-10', // space for spinner
  };

  const combinedClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled && stateClasses.disabled,
    invalid && stateClasses.invalid,
    loading && stateClasses.loading,
    className
  );

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const currentType = type === 'password' && isPasswordVisible ? 'text' : type;
  const describedById = invalid && errorMessage ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx('block mb-1 text-sm font-medium', {
            'text-gray-700': !disabled,
            'text-gray-400': disabled,
          })}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {loading && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              role="status"
              aria-label="Loading..."
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
              />
            </svg>
          </div>
        )}

        <input
          id={inputId}
          type={currentType}
          className={combinedClasses}
          placeholder={placeholder}
          disabled={disabled || loading}
          value={value}
          onChange={onChange}
          aria-invalid={invalid}
          aria-describedby={describedById}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {showClearButton && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="text-gray-500 hover:text-gray-700"
            >
              {/* Clear Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-gray-700"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              disabled={disabled || loading}
            >
              {isPasswordVisible ? (
                // Eye Open Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.04 12.32a1.01 1.01 0 010-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.57 3 9.96 7.18.07.21.07.43 0 .64C20.58 16.5 16.64 19.5 12 19.5c-4.64 0-8.57-3.01-9.96-7.18z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                // Eye Closed Icon
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3.98 8.22A10.47 10.47 0 001.93 12C3.23 16.34 7.24 19.5 12 19.5c.99 0 1.95-.14 2.86-.39M6.23 6.23A10.45 10.45 0 0112 4.5c4.76 0 8.77 3.16 10.07 7.5a10.52 10.52 0 01-4.29 5.77M6.23 6.23 3 3m3.23 3.23 3.65 3.65m7.89 7.89L21 21m-3.23-3.23-3.65-3.65m0 0a3 3 0 10-4.24-4.24l4.24 4.24z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {helperText && !invalid && (
        <p id={`${inputId}-help`} className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {errorMessage && invalid && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};