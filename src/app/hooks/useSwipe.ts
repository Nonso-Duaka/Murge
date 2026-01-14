import { useState, useRef, useCallback } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  preventScroll?: boolean;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    preventScroll = false,
  } = options;

  const [state, setState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    isSwiping: false,
    direction: null,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setState({
      startX: touch.clientX,
      startY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      isSwiping: true,
      direction: null,
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!state.isSwiping) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - state.startX;
    const deltaY = touch.clientY - state.startY;

    let direction: SwipeState['direction'] = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    if (preventScroll && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }

    setState(prev => ({
      ...prev,
      deltaX,
      deltaY,
      direction,
    }));
  }, [state.isSwiping, state.startX, state.startY, preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!state.isSwiping) return;

    const { deltaX, deltaY, direction } = state;

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (direction === 'left' && onSwipeLeft) onSwipeLeft();
      if (direction === 'right' && onSwipeRight) onSwipeRight();
      if (direction === 'up' && onSwipeUp) onSwipeUp();
      if (direction === 'down' && onSwipeDown) onSwipeDown();
    }

    setState({
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      isSwiping: false,
      direction: null,
    });
  }, [state, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };

  return {
    ...state,
    handlers,
    ref: elementRef,
  };
}

// Hook for dismissible cards
export function useDismissible(onDismiss: () => void, threshold = 100) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  const { handlers, deltaX, isSwiping } = useSwipe({
    threshold,
    onSwipeLeft: () => {
      setIsDismissing(true);
      setTimeout(onDismiss, 200);
    },
    onSwipeRight: () => {
      setIsDismissing(true);
      setTimeout(onDismiss, 200);
    },
    preventScroll: true,
  });

  const style: React.CSSProperties = {
    transform: isSwiping ? `translateX(${deltaX}px)` : isDismissing ? `translateX(${deltaX > 0 ? '100%' : '-100%'})` : 'translateX(0)',
    opacity: isSwiping ? 1 - Math.abs(deltaX) / 300 : isDismissing ? 0 : 1,
    transition: isSwiping ? 'none' : 'all 0.2s ease-out',
  };

  return { handlers, style, isDismissing };
}
