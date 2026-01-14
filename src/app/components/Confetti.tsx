import React, { useEffect, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocity: { x: number; y: number };
  rotationSpeed: number;
  type: 'circle' | 'square' | 'star';
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function Confetti({
  active,
  duration = 3000,
  particleCount = 50,
  colors = ['#FFFFFF', '#E5E5E5', '#CCCCCC', '#999999', '#666666'],
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: 3 + Math.random() * 5,
        },
        rotationSpeed: (Math.random() - 0.5) * 20,
        type: ['circle', 'square', 'star'][Math.floor(Math.random() * 3)] as Particle['type'],
      });
    }
    return newParticles;
  }, [particleCount, colors]);

  useEffect(() => {
    if (active) {
      setParticles(createParticles());

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, createParticles, duration, onComplete]);

  useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = requestAnimationFrame(function animate() {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            rotation: p.rotation + p.rotationSpeed,
            velocity: {
              x: p.velocity.x * 0.99,
              y: p.velocity.y + 0.1, // gravity
            },
          }))
          .filter(p => p.y < window.innerHeight + 50)
      );

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles.length]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
          }}
        >
          {particle.type === 'circle' && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.type === 'square' && (
            <div
              className="w-3 h-3"
              style={{ backgroundColor: particle.color }}
            />
          )}
          {particle.type === 'star' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill={particle.color}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// Success celebration with checkmark
interface SuccessCelebrationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
}

export function SuccessCelebration({ show, message = 'Success!', onComplete }: SuccessCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <Confetti active={show} particleCount={30} duration={2000} />
      <div className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none">
        <div className="animate-scale-in bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center animate-success-check">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl font-bold text-white">{message}</p>
        </div>
      </div>
    </>
  );
}

// Milestone celebration
interface MilestoneCelebrationProps {
  show: boolean;
  milestone: string;
  description?: string;
  onComplete?: () => void;
}

export function MilestoneCelebration({ show, milestone, description, onComplete }: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <Confetti active={show} particleCount={60} duration={3500} />
      <div className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none">
        <div className="animate-scale-in bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-black flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-black mb-2">{milestone}</p>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </>
  );
}
