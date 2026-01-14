import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface UserCardProps {
  name: string;
  role: string;
  company: string;
  moveDate: string;
  matchScore?: number;
  isOnline?: boolean;
  isNew?: boolean;
  onConnect?: () => void;
}

// Generate a consistent color based on the name
const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-rose-500 to-pink-500',
    'from-amber-500 to-orange-500',
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function UserCard({
  name,
  role,
  company,
  moveDate,
  matchScore,
  isOnline = false,
  isNew = false,
  onConnect
}: UserCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const avatarGradient = getAvatarColor(name);

  return (
    <Card variant="interactive" hoverable>
      <div className="flex items-start justify-between mb-3">
        <div className="relative">
          <div className={`w-14 h-14 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110`}>
            <span className="text-xl font-semibold text-white">
              {initials}
            </span>
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        {(matchScore || isNew) && (
          <div className="flex gap-1">
            {isNew && (
              <span className="px-2 py-1 text-xs font-medium bg-brand-primary text-white rounded-full">
                New
              </span>
            )}
            {matchScore && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {matchScore}%
              </span>
            )}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 text-base">{name}</h3>
      <p className="text-sm text-gray-600 mb-0.5">{role}</p>
      <p className="text-sm text-gray-500 mb-2">{company}</p>
      <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Moving {moveDate}
      </p>
      <Button
        onClick={onConnect}
        fullWidth
        size="sm"
        variant="primary"
      >
        Connect
      </Button>
    </Card>
  );
}
