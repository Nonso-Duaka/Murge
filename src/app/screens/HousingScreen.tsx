import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';

interface HousingScreenProps {
  onOpenAI: () => void;
}

// Simple internal ImageSlideshow component
const ImageSlideshow = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Subtle auto-advance or just let user click. 
    // To keep it "calm", maybe no auto-advance, just manual or slow fade?
    // Let's do a slow fade every 5s
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 bg-gray-100">
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <img src={img} alt="Department" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export function HousingScreen({ onOpenAI }: HousingScreenProps) {
  const [activeTab, setActiveTab] = useState('listings');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    {
      id: 'listings',
      label: 'Listings',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      id: 'roommates',
      label: 'Roommates',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    },
  ];

  const listings = [
    {
      title: '2BR in Mission',
      price: '$2,400/mo',
      available: 'June 1',
      matches: '92% Match',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
      ]
    },
    {
      title: 'Studio in SoMa',
      price: '$2,100/mo',
      available: 'May 15',
      matches: '75% Match',
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
      ]
    },
    {
      title: '1BR in Nob Hill',
      price: '$2,800/mo',
      available: 'June 15',
      matches: '88% Match',
      images: [
        'https://images.unsplash.com/photo-1484154218962-a1c00207bf9a?w=800&q=80',
        'https://images.unsplash.com/photo-1512918760532-3edbed13ee1e?w=800&q=80'
      ]
    },
  ];

  const roommates = [
    { name: 'Alex Kumar', budget: '$1.2-1.5k', looking: 'Mission', matchPercent: 85 },
    { name: 'Jordan M.', budget: '$1.0-1.3k', looking: 'SoMa', matchPercent: 78 },
    { name: 'Emma Wilson', budget: '$1.4-1.6k', looking: 'Nob Hill', matchPercent: 92 },
  ];

  const groups = [
    { name: 'Mission District Hunters', members: 18, lastActive: '2h ago', newMessages: 5 },
    { name: 'SoMa Roommate Search', members: 12, lastActive: '4h ago', newMessages: 0 },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-24">
      {/* Header - Transparent/Glass */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <h1 className="text-3xl font-bold text-white mb-4">Housing</h1>

        {/* Tabs - Glass pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Assistant CTA - keeping it as a glass button */}
        <Button
          onClick={onOpenAI}
          fullWidth
          variant="secondary"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          }
        >
          AI Housing Assistant
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {listings.map((listing, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Immersive Glass Card */}
                <div className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                  {/* Background Slideshow */}
                  <ImageSlideshow images={listing.images} />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                            {listing.matches}
                          </span>
                          <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md text-xs font-medium text-white/80 border border-white/10">
                            Available {listing.available}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-2xl mb-1">{listing.title}</h3>
                        <p className="text-xl font-light text-white/90">{listing.price}</p>
                      </div>

                      <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Roommates Tab */}
        {activeTab === 'roommates' && (
          <div className="space-y-4">
            {roommates.map((roommate, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center font-bold text-xl text-black shadow-lg">
                      {roommate.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1.5">{roommate.name}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-white/80 font-medium">{roommate.budget}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-white/80 font-medium">{roommate.looking}</span>
                      </div>
                    </div>

                    {/* Match Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold shadow-lg">
                        {roommate.matchPercent}% Match
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white text-sm font-medium">
                        View Profile →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    {/* Group Icon & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-1.5">{group.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-white/80 font-medium">{group.members} members</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60">Active {group.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notification Badge or Join Button */}
                    <div className="flex items-center gap-3">
                      {group.newMessages > 0 ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="w-8 h-8 flex items-center justify-center bg-white text-black text-sm font-bold rounded-full shadow-lg">
                            {group.newMessages}
                          </span>
                          <span className="text-xs text-white/60 font-medium">new</span>
                        </div>
                      ) : (
                        <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white hover:text-black transition-all">
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}