import React, { useState, useRef, useCallback } from 'react';

// Ripple effect button wrapper
interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function RippleButton({ children, onClick, className = '', disabled = false }: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    onClick?.();
  }, [onClick, disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
}

// Press scale effect wrapper
interface PressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  scale?: number;
  disabled?: boolean;
}

export function Pressable({ children, onPress, className = '', scale = 0.97, disabled = false }: PressableProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => {
        setIsPressed(false);
        if (!disabled) onPress?.();
      }}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        if (!disabled) onPress?.();
      }}
      className={`transition-transform duration-150 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={{
        transform: isPressed && !disabled ? `scale(${scale})` : 'scale(1)',
      }}
    >
      {children}
    </div>
  );
}

// Haptic feedback simulation (visual only in web)
export function useHaptic() {
  const trigger = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    // Try to use vibration API if available
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return { trigger };
}

// Animated counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 500, className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  React.useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(startValue + (endValue - startValue) * easeOutQuart);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    previousValue.current = value;
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
}

// Success checkmark animation
interface SuccessCheckProps {
  show: boolean;
  size?: number;
}

export function SuccessCheck({ show, size = 24 }: SuccessCheckProps) {
  if (!show) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="animate-success-check"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="animate-circle-draw"
      />
      <path
        d="M6 12l4 4 8-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-check-draw"
      />
    </svg>
  );
}

// Floating action button with scale animation
interface FABProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  badge?: number;
}

export function FAB({ icon, onClick, className = '', badge }: FABProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => {
        setIsPressed(false);
        onClick();
      }}
      onMouseLeave={() => setIsPressed(false)}
      className={`relative w-14 h-14 rounded-full bg-white text-black shadow-xl flex items-center justify-center transition-all duration-150 hover:shadow-2xl active:scale-95 ${className}`}
      style={{
        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
      }}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}
