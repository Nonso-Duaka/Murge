import React, { useState, useEffect } from 'react';

interface RecommendedHousingScreenProps {
  onBack?: () => void;
}

export function RecommendedHousingScreen({ onBack }: RecommendedHousingScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    setMounted(true);
  }, []);

  const recommendations = [
    {
      priceRange: '$2,200 - $2,400/mo',
      commute: '15 min',
      neighborhood: 'Mission District',
      tags: ['budget-friendly', 'close to transit', 'popular with interns'],
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      matchScore: 95,
    },
    {
      priceRange: '$2,000 - $2,200/mo',
      commute: '20 min',
      neighborhood: 'Castro',
      tags: ['walkable', 'close to transit', 'good food scene'],
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      matchScore: 88,
    },
    {
      priceRange: '$2,400 - $2,600/mo',
      commute: '12 min',
      neighborhood: 'SoMa',
      tags: ['modern building', 'gym included', 'tech crowd'],
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      matchScore: 92,
    },
    {
      priceRange: '$1,900 - $2,100/mo',
      commute: '25 min',
      neighborhood: 'Outer Sunset',
      tags: ['budget-friendly', 'quiet', 'near beach'],
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      matchScore: 82,
    },
  ];

  const toggleSave = (index: number) => {
    setSavedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className={`relative z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="mb-4 p-2 hover:bg-white/10 rounded-xl transition-colors group -ml-2"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Recommended for You</h1>
              <p className="text-sm text-white/60">Curated by Meg based on your preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div className={`flex items-center justify-between mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-sm text-white/60 font-medium">{recommendations.length} perfect matches found</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((housing, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Housing Card */}
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={housing.imageUrl}
                    alt={housing.neighborhood}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <div className="px-3 py-1.5 bg-white text-black rounded-full text-xs font-bold shadow-lg">
                      {housing.matchScore}% Match
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(index);
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${savedItems.has(index) ? 'fill-black text-black' : 'text-gray-600'}`}
                        fill={savedItems.has(index) ? 'currentColor' : 'none'}
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

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-xl mb-2">{housing.priceRange}</h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {housing.neighborhood}
                    </p>
                    <p className="text-sm text-white/60 flex items-center gap-2">
                      <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {housing.commute} commute
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {housing.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}