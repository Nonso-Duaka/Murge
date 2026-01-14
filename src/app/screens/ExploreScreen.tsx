import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Input } from '../components/Input';

export function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food' },
    { id: 'barbers', label: 'Barbers' },
    { id: 'gyms', label: 'Gyms' },
    { id: 'transport', label: 'Transport' },
  ];

  const places = [
    {
      name: 'Tartine Bakery',
      category: 'food',
      description: 'Iconic bakery in Mission',
      recommended: true,
      tags: ['breakfast', 'bakery'],
      image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cmllc3xlbnwxfHx8fDE3NjgzNDA4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Equinox SOMA',
      category: 'gyms',
      description: 'Premium fitness club',
      recommended: true,
      tags: ['fitness', 'classes'],
      image: 'https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2ODIyODgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Fellow Barber',
      category: 'barbers',
      description: 'Modern barbershop',
      recommended: false,
      tags: ['haircut', 'grooming'],
      image: 'https://images.unsplash.com/photo-1759134198561-e2041049419c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZXIlMjBzaG9wJTIwbW9kZXJufGVufDF8fHx8MTc2ODI1ODA3OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Clipper Card Info',
      category: 'transport',
      description: 'Public transit guide',
      recommended: true,
      tags: ['muni', 'bart'],
      image: 'https://images.unsplash.com/photo-1726457380907-ab8710d74614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjB0cmFuc2l0JTIwdHJhaW58ZW58MXx8fHwxNzY4MzQwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Blue Bottle Coffee',
      category: 'food',
      description: 'Specialty coffee roaster',
      recommended: true,
      tags: ['coffee', 'work-friendly'],
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4MjkxMzU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      name: 'Barry\'s Bootcamp',
      category: 'gyms',
      description: 'High-intensity workout classes',
      recommended: false,
      tags: ['fitness', 'cardio'],
      image: 'https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwZXF1aXBtZW50fGVufDF8fHx8MTc2ODIyODgxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredPlaces = selectedCategory === 'all' 
    ? places 
    : places.filter(place => place.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Explore San Francisco</h1>
        <p className="text-base text-gray-600 mb-4">Community recommendations for relocators</p>

        <Input
          type="text"
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="md"
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
      </div>
      
      {/* Categories */}
      <div className="px-4 sm:px-6 py-4 overflow-x-auto bg-white/50">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant="brand"
              size="md"
            >
              {category.label}
            </Chip>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 sm:px-6 pb-6 py-6 max-w-7xl mx-auto">
        <div
          className={`mb-6 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-base font-medium text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <Card variant="interactive" hoverable padding="none">
                {/* Image */}
                <div className="relative overflow-hidden group/image">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-52 object-cover transform transition-transform duration-500 group-hover/image:scale-110"
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
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{place.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{place.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {place.tags.map((tag, tagIndex) => (
                      <Chip key={tagIndex} size="sm" variant="default">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}