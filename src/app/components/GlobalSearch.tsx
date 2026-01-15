import React, { useState, useEffect, useMemo } from 'react';

interface SearchResult {
  id: string;
  type: 'housing' | 'person' | 'place';
  title: string;
  subtitle: string;
  image?: string;
  matchScore?: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick?: (result: SearchResult) => void;
}

export function GlobalSearch({ isOpen, onClose, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      setMounted(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Mock data - in real app this would come from context/props
  const allData: SearchResult[] = [
    // Housing
    { id: 'h1', type: 'housing', title: '2BR in Mission', subtitle: '$2,400/mo - Available June 1', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80' },
    { id: 'h2', type: 'housing', title: 'Studio in SoMa', subtitle: '$2,100/mo - Available May 15', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=200&q=80' },
    { id: 'h3', type: 'housing', title: '1BR in Nob Hill', subtitle: '$2,800/mo - Available June 15', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80' },
    // People
    { id: 'p1', type: 'person', title: 'Sarah Chen', subtitle: 'Product Designer at Meta', matchScore: 92 },
    { id: 'p2', type: 'person', title: 'Alex Kumar', subtitle: 'Software Engineer at Stripe', matchScore: 88 },
    { id: 'p3', type: 'person', title: 'Jordan Martinez', subtitle: 'Product Manager at Airbnb', matchScore: 85 },
    { id: 'p4', type: 'person', title: 'Emma Wilson', subtitle: 'Data Scientist at Uber', matchScore: 78 },
    { id: 'p5', type: 'person', title: 'Michael Brown', subtitle: 'UX Researcher at Google', matchScore: 94 },
    // Places
    { id: 'pl1', type: 'place', title: 'Tartine Bakery', subtitle: 'Food - Iconic bakery in Mission', image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?w=200&q=80' },
    { id: 'pl2', type: 'place', title: 'Equinox SOMA', subtitle: 'Gyms - Premium fitness club', image: 'https://images.unsplash.com/photo-1632077804406-188472f1a810?w=200&q=80' },
    { id: 'pl3', type: 'place', title: 'Blue Bottle Coffee', subtitle: 'Food - Specialty coffee roaster', image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200&q=80' },
    { id: 'pl4', type: 'place', title: 'Fellow Barber', subtitle: 'Barbers - Modern barbershop', image: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?w=200&q=80' },
  ];

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allData.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      housing: [],
      person: [],
      place: [],
    };
    filteredResults.forEach(result => {
      groups[result.type].push(result);
    });
    return groups;
  }, [filteredResults]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'housing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'person':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'place':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'housing': return 'Housing';
      case 'person': return 'People';
      case 'place': return 'Places';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={onClose}
      />

      {/* Search Panel */}
      <div
        className={`absolute inset-x-0 top-0 bg-black/90 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search housing, people, places..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto space-y-6">
            {query.trim() === '' ? (
              <div className="text-center py-8">
                <p className="text-white/40">Start typing to search...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60 mb-2">No results found for "{query}"</p>
                <p className="text-white/40 text-sm">Try different keywords</p>
              </div>
            ) : (
              Object.entries(groupedResults).map(([type, results]) => {
                if (results.length === 0) return null;
                return (
                  <div key={type}>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                      {getTypeIcon(type as SearchResult['type'])}
                      {getTypeLabel(type as SearchResult['type'])} ({results.length})
                    </h3>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            onResultClick?.(result);
                            onClose();
                          }}
                          className="w-full flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
                        >
                          {result.image ? (
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">
                              {result.title.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate group-hover:text-white/90">
                              {result.title}
                            </p>
                            <p className="text-white/50 text-sm truncate">{result.subtitle}</p>
                          </div>
                          {result.matchScore && (
                            <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
                              {result.matchScore}%
                            </span>
                          )}
                          <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
