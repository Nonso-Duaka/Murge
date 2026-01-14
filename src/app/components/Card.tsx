import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'glass' | 'glass-dark' | 'glass-light' | 'gradient-border' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const variantStyles = {
    default: 'bg-card text-card-foreground border border-border shadow-sm',
    elevated: 'bg-card text-card-foreground border border-border shadow-md hover:shadow-lg',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-glass',
    'glass-dark': 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl',
    'glass-light': 'bg-white/90 backdrop-blur-xl border border-white/50 text-black shadow-lg',
    'gradient-border': 'bg-card border border-border relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-primary/10 before:to-brand-primary/5 before:opacity-0 hover:before:opacity-100 transition-all',
    interactive: 'bg-card border border-border shadow-sm hover:shadow-md hover:border-brand-primary/20'
  };

  const hoverStyles = hoverable || onClick
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0'
    : 'transition-shadow duration-200';

  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
