import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onDismiss?: () => void;
  variant?: 'default' | 'outline' | 'brand' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  count?: number;
}

export function Chip({
  children,
  selected = false,
  onClick,
  onDismiss,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  count
}: ChipProps) {
  const baseStyles = `
    inline-flex items-center gap-1.5
    rounded-full font-medium
    transition-all duration-200
    hover:scale-105 active:scale-95
  `;

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  const cursorStyle = (onClick || onDismiss) ? 'cursor-pointer' : '';

  const getVariantStyles = () => {
    if (selected) {
      return variant === 'brand'
        ? 'bg-brand-primary text-white shadow-md'
        : 'bg-black text-white shadow-sm';
    }

    const variants = {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      outline: 'bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50',
      brand: 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20',
      success: 'bg-green-100 text-green-700 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    };

    return variants[variant];
  };

  return (
    <div
      className={`${baseStyles} ${sizeStyles[size]} ${getVariantStyles()} ${cursorStyle}`}
      onClick={onClick}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {count !== undefined && count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold rounded-full bg-white/30">
          {count > 99 ? '99+' : count}
        </span>
      )}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
