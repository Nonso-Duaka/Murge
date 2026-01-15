import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useFavorites, useLocalStorageSet } from '../hooks/useLocalStorage';

interface FavoritesScreenProps {
  onBack: () => void;
}

export function FavoritesScreen({ onBack }: FavoritesScreenProps) {
  const [activeTab, setActiveTab] = useState<'housing' | 'people' | 'places'>('housing');
  const [mounted, setMounted] = useState(false);
  const [savedListings] = useLocalStorageSet('murge_saved_listings');
  const [connectedUsers] = useLocalStorageSet('murge_connections');
  const { favorites, removeFavorite } = useFavorites();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data based on saved items
  const savedHousingData = [
    { title: '2BR in Mission', price: '$2,400/mo', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80' },
    { title: 'Studio in SoMa', price: '$2,100/mo', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&q=80' },
    { title: '1BR in Nob Hill', price: '$2,800/mo', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80' },
  ].filter(h => savedListings.has(h.title));

  const connectedPeopleData = [
    { name: 'Sarah Chen', role: 'Product Designer', company: 'Meta' },
    { name: 'Alex Kumar', role: 'Software Engineer', company: 'Stripe' },
    { name: 'Jordan Martinez', role: 'Product Manager', company: 'Airbnb' },
    { name: 'Emma Wilson', role: 'Data Scientist', company: 'Uber' },
    { name: 'Michael Brown', role: 'UX Researcher', company: 'Google' },
    { name: 'Lisa Park', role: 'Software Engineer', company: 'Netflix' },
  ].filter(p => connectedUsers.has(p.name));

  const tabs = [
    { id: 'housing', label: 'Housing', count: savedHousingData.length },
    { id: 'people', label: 'People', count: connectedPeopleData.length },
    { id: 'places', label: 'Places', count: favorites.filter(f => f.type === 'place').length },
  ];

  const handleRemove = (title: string, type: string) => {
    toast.success(`Removed ${title} from favorites`);
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-white">Favorites</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black/10' : 'bg-white/20'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
        {/* Housing Tab */}
        {activeTab === 'housing' && (
          <div className="space-y-4">
            {savedHousingData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No saved listings</h3>
                <p className="text-white/50">Save housing listings to see them here</p>
              </div>
            ) : (
              savedHousingData.map((listing, index) => (
                <div
                  key={listing.title}
                  className={`group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <div className="flex">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-28 h-28 object-cover"
                    />
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white mb-1">{listing.title}</h3>
                        <p className="text-white/60">{listing.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(listing.title, 'housing')}
                        className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* People Tab */}
        {activeTab === 'people' && (
          <div className="space-y-4">
            {connectedPeopleData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No connections yet</h3>
                <p className="text-white/50">Connect with people to see them here</p>
              </div>
            ) : (
              connectedPeopleData.map((person, index) => (
                <div
                  key={person.name}
                  className={`group bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center font-bold text-black">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{person.name}</h3>
                      <p className="text-white/60 text-sm">{person.role} at {person.company}</p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm font-medium hover:bg-white/20 transition-all">
                      Message
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No saved places</h3>
            <p className="text-white/50">Save places from Explore to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}
