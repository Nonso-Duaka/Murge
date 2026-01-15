import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { useFilters } from '../hooks/useLocalStorage';

interface ExploreScreenProps {
  onOpenNeighborhoodGuide?: () => void;
}

export function ExploreScreen({ onOpenNeighborhoodGuide }: ExploreScreenProps) {
  const { filters, updateExploreFilters } = useFilters();
  const [selectedCategory, setSelectedCategory] = useState(filters.explore.category);
  const [searchQuery, setSearchQuery] = useState(filters.explore.searchQuery);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Persist filter changes
  useEffect(() => {
    updateExploreFilters({ category: selectedCategory, searchQuery });
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'events', label: 'Events' },
    { id: 'food', label: 'Food' },
    { id: 'barbers', label: 'Barbers' },
    { id: 'gyms', label: 'Gyms' },
    { id: 'transport', label: 'Transport' },
  ];

  const places = [
    // Events
    {
      name: 'SF Tech Week Hackathon',
      category: 'events',
      description: 'Annual city-wide hackathon',
      recommended: true,
      tags: ['coding', 'networking', 'free'],
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    },
    {
      name: 'AI Innovators Summit',
      category: 'events',
      description: 'Conference for AI professionals',
      recommended: true,
      tags: ['ai', 'conference', 'tech'],
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80',
    },
    {
      name: 'StartUp Grind Mixer',
      category: 'events',
      description: 'Monthly founder meetup',
      recommended: false,
      tags: ['startup', 'mixer'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    },
    // Existing places with Reviews added
    {
      name: 'Tartine Bakery',
      category: 'food',
      description: 'Iconic bakery in Mission',
      recommended: true,
      tags: ['breakfast', 'bakery'],
      image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjgzNDA4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviewCount: 2400,
      reviews: [
        { user: 'Jamie L.', text: 'Best croissants in the city, hands down.', rating: 5 },
        { user: 'Mike T.', text: 'Line is long but worth the wait.', rating: 4 }
      ]
    },
    {
      name: 'Equinox SOMA',
      category: 'gyms',
      description: 'Premium fitness club',
      recommended: true,
      tags: ['fitness', 'classes'],
      image: 'https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2ODIyODgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviewCount: 450,
      reviews: [{ user: 'FitFam', text: 'Clean and great equipment.', rating: 5 }]
    },
    {
      name: 'Fellow Barber',
      category: 'barbers',
      description: 'Modern barbershop',
      recommended: false,
      tags: ['haircut', 'grooming'],
      image: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzaG9wJTIwbW9kZXJufGVufDF8fHx8MTc2ODI1ODA3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      reviewCount: 120,
      reviews: [
        { user: 'Sam K.', text: 'Great fade, asking for Marcus.', rating: 5 },
        { user: 'Chris P.', text: 'A bit pricey but solid service.', rating: 4 }
      ]
    },
    {
      name: 'Clipper Card Info',
      category: 'transport',
      description: 'Public transit guide',
      recommended: true,
      tags: ['muni', 'bart'],
      image: 'https://images.unsplash.com/photo-1726457380907-ab8710d74614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjB0cmFuc2l0JTIwdHJhaW58ZW58MXx8fHwxNzY4MzQwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.2,
      reviewCount: 890,
      reviews: []
    },
    {
      name: 'Blue Bottle Coffee',
      category: 'food',
      description: 'Specialty coffee roaster',
      recommended: true,
      tags: ['coffee', 'work-friendly'],
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4MjkxMzU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviewCount: 1500,
      reviews: []
    },
    {
      name: 'Barry\'s Bootcamp',
      category: 'gyms',
      description: 'High-intensity workout classes',
      recommended: false,
      tags: ['fitness', 'cardio'],
      image: 'https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2ODIyODgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviewCount: 600,
      reviews: []
    },
  ];

  const filteredPlaces = selectedCategory === 'all'
    ? places
    : places.filter(place => place.category === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header - Glass */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Explore</h1>
          {onOpenNeighborhoodGuide && (
            <button
              onClick={onOpenNeighborhoodGuide}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Neighborhood Guide
            </button>
          )}
        </div>
        <p className="text-base text-white/80 mb-4">Community recommendations for relocators</p>

        <div className="relative">
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-white placeholder-white/60 text-sm shadow-lg"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 sm:px-6 py-4 overflow-x-auto bg-white/5 backdrop-blur-sm">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md whitespace-nowrap ${selectedCategory === category.id
                ? 'bg-white text-black'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pb-6 py-6 max-w-7xl mx-auto">
        <div
          className={`mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <p className="text-base font-medium text-white flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg w-fit">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            {filteredPlaces.length} {selectedCategory === 'all' ? 'recommendations' : 'results'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPlaces.map((place, index) => (
            <div
              key={index}
              className={`transition-all duration-500 h-full ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <Card variant="interactive" hoverable padding="none" className="h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden group/image h-52 shrink-0">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover/image:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />

                  {/* Recommended Badge */}
                  {place.recommended && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-yellow-400 text-gray-900 rounded-full shadow-lg">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Recommended
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{place.name}</h3>

                  {place.category !== 'events' && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(place.rating || 0) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{place.rating} ({place.reviewCount})</span>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{place.description}</p>

                  <div className="mb-4">
                    {place.reviews && place.reviews.length > 0 && place.category !== 'events' && (
                      <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-gray-900">{place.reviews[0].user}</span>
                          <div className="flex text-yellow-500 scale-75 origin-left">
                            {[...Array(place.reviews[0].rating)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic">"{place.reviews[0].text}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {place.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reviews Action */}
                  {place.category !== 'events' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {reviewingId === place.name ? (
                        <div className="animate-scale-in">
                          <input
                            autoFocus
                            className="w-full text-xs p-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-black transition-colors"
                            placeholder="Write a review..."
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setReviewingId(null)} className="flex-1 bg-black text-white text-xs font-bold py-1.5 rounded-lg hover:bg-gray-800 transition-colors">Submit</button>
                            <button onClick={() => setReviewingId(null)} className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewingId(place.name)}
                          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-colors py-1 hover:bg-gray-50 rounded-lg group"
                        >
                          <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Write a Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}