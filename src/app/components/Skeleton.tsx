import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-white/10 rounded';

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '3rem' : '4rem'),
  };

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

// Preset skeleton layouts
export function UserCardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton variant="circular" width={64} height={64} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="50%" />
      </div>
      <Skeleton variant="rectangular" height={40} />
    </div>
  );
}

export function HousingCardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
      <Skeleton variant="rectangular" height={240} className="rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={100} height={24} />
        </div>
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="text" width="40%" height={24} />
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={40} />
        </div>
        <Skeleton variant="rectangular" height={60} className="rounded-2xl" />
      </div>
    </div>
  );
}

export function ChannelSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width={16} height={16} />
            <Skeleton variant="text" width={100 + Math.random() * 50} />
          </div>
          <Skeleton variant="circular" width={24} height={24} />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 px-4 sm:px-6 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
            <Skeleton variant="text" width="60%" height={32} className="mb-2 mx-auto" />
            <Skeleton variant="text" width="80%" height={12} className="mx-auto" />
          </div>
        ))}
      </div>
      {/* Progress Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="text" width={100} height={14} />
          </div>
          <Skeleton variant="text" width={60} height={48} />
        </div>
        <Skeleton variant="rectangular" height={6} className="mb-6" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={44} />
          ))}
        </div>
      </div>
      {/* Activity List */}
      <div className="space-y-3">
        <Skeleton variant="text" width={120} height={20} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExploreSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
            <Skeleton variant="rectangular" height={208} className="rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" height={14} />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" width={60} height={24} />
                <Skeleton variant="rectangular" width={80} height={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      ))}
    </div>
  );
}
