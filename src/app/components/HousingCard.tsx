import React, { useState } from 'react';
import { Card } from './Card';
import { Chip } from './Chip';

interface HousingCardProps {
  priceRange: string;
  commute: string;
  neighborhood: string;
  tags: string[];
  imageUrl?: string;
  matchScore?: number;
  isSaved?: boolean;
  isHighMatch?: boolean;
  onSave?: () => void;
  onClick?: () => void;
}

export function HousingCard({
  priceRange,
  commute,
  neighborhood,
  tags,
  imageUrl,
  matchScore,
  isSaved = false,
  isHighMatch = false,
  onSave,
  onClick
}: HousingCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    onSave?.();
  };

  return (
    <Card variant="interactive" hoverable padding="none" onClick={onClick}>
      {/* Image Section */}
      <div className="relative w-full h-44 overflow-hidden rounded-t-xl group/image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={neighborhood}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover/image:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex gap-2">
            {isHighMatch && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-green-500 text-white rounded-full shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                High Match
              </span>
            )}
            {matchScore && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-900 rounded-full shadow-md">
                {matchScore}% match
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSave}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-110 active:scale-95"
          >
            <svg
              className={`w-5 h-5 transition-colors ${saved ? 'fill-brand-primary text-brand-primary' : 'text-gray-600'}`}
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{priceRange}</h3>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {neighborhood}
        </p>

        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {commute} commute
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <Chip key={index} size="sm" variant="default">
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
