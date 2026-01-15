import React, { useState } from 'react';

interface Listing {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  beds: number;
  baths: number;
  sqft?: number;
  available: string;
  matches: string;
  neighborhood?: string;
  image: string;
  amenities?: string[];
  walkScore?: number;
  transitScore?: number;
  commute?: string;
}

interface ComparisonToolProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  selectedIds: string[];
  onRemove: (id: string) => void;
}

export function ComparisonTool({
  isOpen,
  onClose,
  listings,
  selectedIds,
  onRemove,
}: ComparisonToolProps) {
  const [activeCategory, setActiveCategory] = useState<'overview' | 'details' | 'location'>('overview');

  if (!isOpen) return null;

  const selectedListings = listings.filter(l => selectedIds.includes(l.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBestValue = (values: number[], type: 'lowest' | 'highest') => {
    if (type === 'lowest') return Math.min(...values);
    return Math.max(...values);
  };

  const categories = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'location', label: 'Location' },
  ];

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="absolute inset-x-4 top-4 bottom-4 md:inset-x-8 md:top-8 md:bottom-8 bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Compare Listings</h2>
            <p className="text-sm text-gray-500">{selectedListings.length} listings selected</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto">
          {selectedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings to compare</h3>
              <p className="text-gray-500 text-sm">Select listings by tapping the compare button on each card</p>
            </div>
          ) : (
            <div className="min-w-max">
              {/* Listing Headers */}
              <div className="flex sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="w-40 flex-shrink-0 p-4" />
                {selectedListings.map(listing => (
                  <div key={listing.id} className="w-64 flex-shrink-0 p-4">
                    <div className="relative">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => onRemove(listing.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-3 truncate">{listing.title}</h3>
                    <p className="text-lg font-bold text-black">{listing.price}</p>
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              {activeCategory === 'overview' && (
                <div className="divide-y divide-gray-100">
                  <ComparisonRow
                    label="Price"
                    values={selectedListings.map(l => formatPrice(l.priceNum))}
                    highlights={selectedListings.map(l =>
                      l.priceNum === getBestValue(selectedListings.map(x => x.priceNum), 'lowest')
                    )}
                    highlightLabel="Best price"
                  />
                  <ComparisonRow
                    label="Bedrooms"
                    values={selectedListings.map(l => l.beds === 0 ? 'Studio' : `${l.beds} bed`)}
                  />
                  <ComparisonRow
                    label="Bathrooms"
                    values={selectedListings.map(l => `${l.baths} bath`)}
                  />
                  <ComparisonRow
                    label="Match Score"
                    values={selectedListings.map(l => l.matches)}
                    highlights={selectedListings.map(l => {
                      const scores = selectedListings.map(x => parseInt(x.matches));
                      return parseInt(l.matches) === getBestValue(scores, 'highest');
                    })}
                    highlightLabel="Best match"
                  />
                  <ComparisonRow
                    label="Available"
                    values={selectedListings.map(l => l.available)}
                  />
                </div>
              )}

              {activeCategory === 'details' && (
                <div className="divide-y divide-gray-100">
                  <ComparisonRow
                    label="Square Feet"
                    values={selectedListings.map(l => l.sqft ? `${l.sqft} sqft` : 'N/A')}
                  />
                  <ComparisonRow
                    label="Price/sqft"
                    values={selectedListings.map(l =>
                      l.sqft ? `${formatPrice(Math.round(l.priceNum / l.sqft))}/sqft` : 'N/A'
                    )}
                  />
                  <ComparisonRow
                    label="Amenities"
                    values={selectedListings.map(l =>
                      l.amenities?.slice(0, 3).join(', ') || 'Not listed'
                    )}
                  />
                </div>
              )}

              {activeCategory === 'location' && (
                <div className="divide-y divide-gray-100">
                  <ComparisonRow
                    label="Neighborhood"
                    values={selectedListings.map(l => l.neighborhood || l.title.split(' in ')[1] || 'N/A')}
                  />
                  <ComparisonRow
                    label="Walk Score"
                    values={selectedListings.map(l => l.walkScore?.toString() || '—')}
                    valueClasses={selectedListings.map(l =>
                      l.walkScore ? getScoreColor(l.walkScore) : ''
                    )}
                  />
                  <ComparisonRow
                    label="Transit Score"
                    values={selectedListings.map(l => l.transitScore?.toString() || '—')}
                    valueClasses={selectedListings.map(l =>
                      l.transitScore ? getScoreColor(l.transitScore) : ''
                    )}
                  />
                  <ComparisonRow
                    label="Commute"
                    values={selectedListings.map(l => l.commute || 'Calculate')}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedListings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              Scroll horizontally to see all listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  values: string[];
  highlights?: boolean[];
  highlightLabel?: string;
  valueClasses?: string[];
}

function ComparisonRow({
  label,
  values,
  highlights,
  highlightLabel,
  valueClasses,
}: ComparisonRowProps) {
  return (
    <div className="flex">
      <div className="w-40 flex-shrink-0 p-4 bg-gray-50">
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      {values.map((value, index) => (
        <div key={index} className="w-64 flex-shrink-0 p-4">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${valueClasses?.[index] || 'text-gray-900'}`}>
              {value}
            </span>
            {highlights?.[index] && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                {highlightLabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Floating comparison bar component
interface ComparisonBarProps {
  selectedCount: number;
  onCompare: () => void;
  onClear: () => void;
}

export function ComparisonBar({ selectedCount, onCompare, onClear }: ComparisonBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
      <div className="max-w-md mx-auto bg-black text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="font-bold">{selectedCount}</span>
          </div>
          <div>
            <p className="font-medium">
              {selectedCount === 1 ? '1 listing selected' : `${selectedCount} listings selected`}
            </p>
            <p className="text-xs text-white/60">Select up to 4 to compare</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
