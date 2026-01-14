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
  isConnected?: boolean;
  isConnecting?: boolean;
  onConnect?: () => void;
  onShare?: () => void;
  imageUrl?: string;
}

// Generate a consistent professional image URL based on the name
const getProfileImage = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = (hash % 70) + 1; // Use a range of professional photos
  return `https://randomuser.me/api/portraits/${hash % 2 === 0 ? 'men' : 'women'}/${imageId}.jpg`;
};

export function UserCard({
  name,
  role,
  company,
  moveDate,
  matchScore,
  isOnline = false,
  isNew = false,
  isConnected = false,
  isConnecting = false,
  onConnect,
  onShare,
  imageUrl
}: UserCardProps) {
  const profileImage = imageUrl || getProfileImage(name);

  return (
    <div className="relative group">
      {/* Glass Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/95">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {/* Professional Image with Glass Border */}
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50 shadow-lg transform transition-transform group-hover:scale-110">
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a different image service if randomuser fails
                  e.currentTarget.src = `https://i.pravatar.cc/150?img=${Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 70)}`;
                }}
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-md" />
            )}
          </div>
          {(matchScore || isNew) && (
            <div className="flex gap-1">
              {isNew && (
                <span className="px-2.5 py-1 text-xs font-bold bg-black text-white rounded-full shadow-md">
                  New
                </span>
              )}
              {matchScore && (
                <span className="px-2.5 py-1 text-xs font-bold bg-green-500 text-white rounded-full flex items-center gap-1 shadow-md">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {matchScore}%
                </span>
              )}
            </div>
          )}
        </div>
        <h3 className="font-bold text-black mb-1 text-base">{name}</h3>
        <p className="text-sm text-gray-600 mb-0.5">{role}</p>
        <p className="text-sm text-gray-500 mb-4">{company}</p>
        <div className="flex gap-2">
          <Button
            onClick={onShare}
            size="sm"
            variant="secondary"
            className="flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </Button>
        <Button
          onClick={onConnect}
          fullWidth
          size="sm"
          variant={isConnected ? "secondary" : "primary"}
          isLoading={isConnecting}
          disabled={isConnected || isConnecting}
        >
          {isConnected ? (
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </span>
          ) : isConnecting ? (
            'Connecting...'
          ) : (
            'Connect'
          )}
        </Button>
        </div>
      </div>
    </div>
  );
}
