import React, { useState, useEffect } from 'react';

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  image: string;
  avgRent: number;
  walkScore: number;
  transitScore: number;
  safetyScore: number;
  vibe: string[];
  bestFor: string[];
  highlights: string[];
  nearbyCompanies: string[];
}

const neighborhoods: Neighborhood[] = [
  {
    id: 'mission',
    name: 'Mission District',
    description: 'Vibrant, diverse neighborhood known for murals, taquerias, and nightlife.',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
    avgRent: 2800,
    walkScore: 97,
    transitScore: 92,
    safetyScore: 72,
    vibe: ['Artsy', 'Diverse', 'Lively', 'Foodie'],
    bestFor: ['Young professionals', 'Foodies', 'Nightlife lovers'],
    highlights: ['Dolores Park', 'Valencia Street', 'Amazing tacos', 'Street art'],
    nearbyCompanies: ['Uber', 'Airbnb', 'Dropbox'],
  },
  {
    id: 'soma',
    name: 'SoMa',
    description: 'Tech hub with modern apartments, startups, and urban energy.',
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=80',
    avgRent: 3200,
    walkScore: 95,
    transitScore: 100,
    safetyScore: 68,
    vibe: ['Tech', 'Urban', 'Modern', 'Fast-paced'],
    bestFor: ['Tech workers', 'Commuters', 'Urban dwellers'],
    highlights: ['Oracle Park', 'SFMOMA', 'Tech offices', 'Caltrain access'],
    nearbyCompanies: ['Salesforce', 'LinkedIn', 'Pinterest', 'Stripe'],
  },
  {
    id: 'castro',
    name: 'Castro',
    description: 'Historic LGBTQ+ neighborhood with Victorian homes and community spirit.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    avgRent: 2900,
    walkScore: 98,
    transitScore: 88,
    safetyScore: 78,
    vibe: ['Welcoming', 'Historic', 'Community', 'Inclusive'],
    bestFor: ['LGBTQ+ community', 'History lovers', 'Community seekers'],
    highlights: ['Castro Theatre', 'Twin Peaks', 'Pride events', 'Local shops'],
    nearbyCompanies: ['Lyft', 'Square', 'Yelp'],
  },
  {
    id: 'marina',
    name: 'Marina',
    description: 'Upscale waterfront neighborhood with stunning views and active lifestyle.',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    avgRent: 3500,
    walkScore: 94,
    transitScore: 72,
    safetyScore: 85,
    vibe: ['Upscale', 'Active', 'Scenic', 'Fitness'],
    bestFor: ['Fitness enthusiasts', 'Young professionals', 'Nature lovers'],
    highlights: ['Palace of Fine Arts', 'Crissy Field', 'Chestnut Street', 'Golden Gate views'],
    nearbyCompanies: ['Google', 'Apple', 'Meta'],
  },
  {
    id: 'hayes',
    name: 'Hayes Valley',
    description: 'Trendy boutique neighborhood with upscale dining and shopping.',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&q=80',
    avgRent: 3100,
    walkScore: 99,
    transitScore: 95,
    safetyScore: 75,
    vibe: ['Trendy', 'Boutique', 'Foodie', 'Stylish'],
    bestFor: ['Foodies', 'Shoppers', 'Design lovers'],
    highlights: ['Patricia Green', 'Boutique shopping', 'Craft cocktails', 'Opera House'],
    nearbyCompanies: ['Twitter', 'Slack', 'Coinbase'],
  },
  {
    id: 'nob-hill',
    name: 'Nob Hill',
    description: 'Historic hilltop neighborhood with cable cars and classic SF charm.',
    image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&q=80',
    avgRent: 2600,
    walkScore: 96,
    transitScore: 100,
    safetyScore: 82,
    vibe: ['Classic', 'Historic', 'Elegant', 'Central'],
    bestFor: ['History buffs', 'Central location seekers', 'Classic SF fans'],
    highlights: ['Cable cars', 'Grace Cathedral', 'Huntington Park', 'City views'],
    nearbyCompanies: ['Wells Fargo', 'Visa', 'Gap'],
  },
];

interface NeighborhoodGuideScreenProps {
  onBack: () => void;
}

export function NeighborhoodGuideScreen({ onBack }: NeighborhoodGuideScreenProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (selectedNeighborhood) {
    return (
      <div className="min-h-screen bg-transparent pb-24 relative z-10">
        {/* Hero Image */}
        <div className="relative h-64">
          <img
            src={selectedNeighborhood.image}
            alt={selectedNeighborhood.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <button
            onClick={() => setSelectedNeighborhood(null)}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-3xl font-bold text-white mb-1">{selectedNeighborhood.name}</h1>
            <p className="text-white/80">{selectedNeighborhood.description}</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
              <p className="text-xs text-white/50 mb-1">Avg Rent</p>
              <p className="text-lg font-bold text-white">{formatCurrency(selectedNeighborhood.avgRent)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
              <p className="text-xs text-white/50 mb-1">Walk</p>
              <p className={`text-lg font-bold ${getScoreColor(selectedNeighborhood.walkScore)}`}>
                {selectedNeighborhood.walkScore}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
              <p className="text-xs text-white/50 mb-1">Transit</p>
              <p className={`text-lg font-bold ${getScoreColor(selectedNeighborhood.transitScore)}`}>
                {selectedNeighborhood.transitScore}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
              <p className="text-xs text-white/50 mb-1">Safety</p>
              <p className={`text-lg font-bold ${getScoreColor(selectedNeighborhood.safetyScore)}`}>
                {selectedNeighborhood.safetyScore}
              </p>
            </div>
          </div>

          {/* Vibe */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-white mb-3">Neighborhood Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNeighborhood.vibe.map(v => (
                <span key={v} className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/80">
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Best For */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-white mb-3">Best For</h3>
            <ul className="space-y-2">
              {selectedNeighborhood.bestFor.map(item => (
                <li key={item} className="flex items-center gap-2 text-white/80">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-white mb-3">Highlights</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedNeighborhood.highlights.map(highlight => (
                <div key={highlight} className="flex items-center gap-2 text-white/80 text-sm">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Companies */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-white mb-3">Nearby Tech Companies</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNeighborhood.nearbyCompanies.map(company => (
                <span key={company} className="px-3 py-1.5 bg-white/20 rounded-lg text-sm font-medium text-white">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Neighborhood Guide</h1>
            <p className="text-white/60 text-sm">Explore San Francisco neighborhoods</p>
          </div>
        </div>
      </div>

      {/* Neighborhoods Grid */}
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighborhoods.map((neighborhood, index) => (
            <button
              key={neighborhood.id}
              onClick={() => setSelectedNeighborhood(neighborhood)}
              className={`group relative h-48 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <img
                src={neighborhood.image}
                alt={neighborhood.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">{neighborhood.name}</h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/80">{formatCurrency(neighborhood.avgRent)}/mo</span>
                  <span className="text-white/50">•</span>
                  <span className={getScoreColor(neighborhood.walkScore)}>Walk {neighborhood.walkScore}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {neighborhood.vibe.slice(0, 3).map(v => (
                    <span key={v} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
