import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
}

const defaultSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Murge!',
    description: 'Your personal relocation companion. Let us show you around.',
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'Track your move progress, see recent activity, and stay organized.',
    position: 'center',
    action: 'View your stats, progress, and quick actions all in one place.',
  },
  {
    id: 'housing',
    title: 'Find Housing',
    description: 'Browse verified listings, save favorites, and find your perfect home.',
    position: 'center',
    action: 'Swipe through listings and use AI to find matches.',
  },
  {
    id: 'people',
    title: 'Connect with Others',
    description: 'Meet other people relocating to your city. Make friends before you arrive!',
    position: 'center',
    action: 'See match scores based on shared interests and timeline.',
  },
  {
    id: 'explore',
    title: 'Explore Your City',
    description: 'Discover local recommendations from the community.',
    position: 'center',
    action: 'Find the best cafes, gyms, and hidden gems.',
  },
  {
    id: 'workspace',
    title: 'Team Workspace',
    description: 'Chat with your future colleagues and coordinate your move.',
    position: 'center',
    action: 'Join channels and start conversations.',
  },
  {
    id: 'search',
    title: 'Quick Search',
    description: 'Press ⌘K (or Ctrl+K) anytime to search and navigate quickly.',
    position: 'center',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Start exploring and make your relocation smooth and exciting.',
    position: 'center',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  steps?: TourStep[];
}

export function OnboardingTour({ onComplete, steps = defaultSteps }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 200);
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md bg-gradient-to-b from-white to-white/95 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Progress bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step content */}
          <div className="p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-400">
                {currentStep + 1} of {steps.length}
              </span>
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip tour
                </button>
              )}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-black flex items-center justify-center">
              {step.id === 'welcome' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {step.id === 'dashboard' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              )}
              {step.id === 'housing' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
              {step.id === 'people' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
              {step.id === 'explore' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              )}
              {step.id === 'workspace' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              {step.id === 'search' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {step.id === 'complete' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-black text-center mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 text-center mb-2">
              {step.description}
            </p>
            {step.action && (
              <p className="text-sm text-gray-400 text-center italic">
                {step.action}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 pb-8 flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
    </div>
  );
}

// Hook to manage tour state
export function useTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('murge_tour_completed', false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Show tour after a short delay if user hasn't seen it
    if (!hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
  };

  const resetTour = () => {
    setHasSeenTour(false);
  };

  return { showTour, completeTour, resetTour, hasSeenTour };
}
