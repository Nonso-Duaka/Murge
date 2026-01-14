import React, { useState, useEffect, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  direction?: 'left' | 'right' | 'up' | 'down' | 'fade' | 'scale';
}

export function PageTransition({ children, transitionKey, direction = 'fade' }: PageTransitionProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'exit' | 'idle'>('idle');
  const previousKey = useRef(transitionKey);

  useEffect(() => {
    if (transitionKey !== previousKey.current) {
      setTransitionStage('exit');

      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('enter');
        previousKey.current = transitionKey;

        const enterTimer = setTimeout(() => {
          setTransitionStage('idle');
        }, 300);

        return () => clearTimeout(enterTimer);
      }, 150);

      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [children, transitionKey]);

  const getTransformStyle = () => {
    const transforms = {
      left: {
        exit: 'translateX(-30px)',
        enter: 'translateX(30px)',
        idle: 'translateX(0)',
      },
      right: {
        exit: 'translateX(30px)',
        enter: 'translateX(-30px)',
        idle: 'translateX(0)',
      },
      up: {
        exit: 'translateY(-20px)',
        enter: 'translateY(20px)',
        idle: 'translateY(0)',
      },
      down: {
        exit: 'translateY(20px)',
        enter: 'translateY(-20px)',
        idle: 'translateY(0)',
      },
      fade: {
        exit: 'scale(0.98)',
        enter: 'scale(1.02)',
        idle: 'scale(1)',
      },
      scale: {
        exit: 'scale(0.9)',
        enter: 'scale(1.1)',
        idle: 'scale(1)',
      },
    };

    return transforms[direction][transitionStage];
  };

  const getOpacity = () => {
    return transitionStage === 'idle' ? 1 : transitionStage === 'exit' ? 0 : 0;
  };

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        transform: getTransformStyle(),
        opacity: transitionStage === 'idle' ? 1 : 0,
      }}
    >
      {displayChildren}
    </div>
  );
}

// Slide transition for modal-like screens
interface SlideTransitionProps {
  show: boolean;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export function SlideTransition({ show, children, direction = 'up', className = '' }: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const handleAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  if (!shouldRender) return null;

  const directionClasses = {
    left: show ? 'animate-slide-in-left' : 'animate-slide-out-left',
    right: show ? 'animate-slide-in-right' : 'animate-slide-out-right',
    up: show ? 'animate-slide-in-up' : 'animate-slide-out-up',
    down: show ? 'animate-slide-in-down' : 'animate-slide-out-down',
  };

  return (
    <div
      className={`${directionClasses[direction]} ${className}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}

// Stagger children animation
interface StaggerProps {
  children: React.ReactNode[];
  delay?: number;
  className?: string;
}

export function Stagger({ children, delay = 50, className = '' }: StaggerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-slide-up"
          style={{ animationDelay: `${index * delay}ms`, animationFillMode: 'both' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
