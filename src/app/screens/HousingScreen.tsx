import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Button } from '../components/Button';
import { useLocalStorageSet } from '../hooks/useLocalStorage';
import { useShare } from '../hooks/useShare';
import { MapView, MapModal } from '../components/MapView';
import { ComparisonTool, ComparisonBar } from '../components/ComparisonTool';

interface HousingScreenProps {
  onOpenAI: () => void;
}

// Enhanced ImageSlideshow component with navigation controls
const ImageSlideshow = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const goToSlide = (i: number) => {
    setIndex(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToSlide((index + 1) % images.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToSlide((index - 1 + images.length) % images.length);
  };

  return (
    <div className="absolute inset-0 bg-gray-900 group/slideshow">
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={img} alt="Apartment" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Navigation Arrows - appear on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/slideshow:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/slideshow:opacity-100 transition-all hover:bg-black/60 hover:scale-110 z-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image counter */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium z-10 border border-white/10">
        {index + 1} / {images.length}
      </div>

      {/* Clickable Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
            className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${i === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
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
  const [savedListings, addSavedListing, removeSavedListing] = useLocalStorageSet('murge_saved_listings');
  const [joinedGroups, addJoinedGroup] = useLocalStorageSet('murge_joined_groups');
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const { shareHousing } = useShare();

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 4) {
        toast.info('Maximum 4 listings for comparison');
        return prev;
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);
  const removeFromCompare = (id: string) => setCompareIds(prev => prev.filter(x => x !== id));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSaveListing = (listingTitle: string) => {
    if (savedListings.has(listingTitle)) {
      removeSavedListing(listingTitle);
      toast.info(`Removed ${listingTitle} from saved`, {
        description: 'You can save it again anytime',
      });
    } else {
      addSavedListing(listingTitle);
      toast.success(`Saved ${listingTitle}!`, {
        description: 'Added to your saved listings',
      });
    }
  };

  const handleJoinGroup = (groupName: string) => {
    if (joinedGroups.has(groupName)) {
      toast.info(`You're already a member of ${groupName}`);
      return;
    }

    setJoiningGroup(groupName);

    setTimeout(() => {
      addJoinedGroup(groupName);
      setJoiningGroup(null);
      toast.success(`Joined ${groupName}!`, {
        description: 'You can now see group discussions',
      });
    }, 600);
  };

  const handleViewRoommate = (name: string) => {
    toast.info(`Opening ${name}'s profile...`, {
      description: 'Profile view coming soon!',
    });
  };

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
      id: 'listing-1',
      title: '2BR in Mission',
      price: '$2,400/mo',
      priceNum: 2400,
      available: 'June 1',
      matches: '92% Match',
      beds: 2,
      baths: 1,
      lat: 37.759,
      lng: -122.419,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
      ]
    },
    {
      id: 'listing-2',
      title: 'Studio in SoMa',
      price: '$2,100/mo',
      priceNum: 2100,
      available: 'May 15',
      matches: '75% Match',
      beds: 0,
      baths: 1,
      lat: 37.778,
      lng: -122.405,
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'
      ]
    },
    {
      id: 'listing-3',
      title: '1BR in Nob Hill',
      price: '$2,800/mo',
      priceNum: 2800,
      available: 'June 15',
      matches: '88% Match',
      beds: 1,
      baths: 1,
      lat: 37.793,
      lng: -122.416,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
      ]
    },
  ];

  // Map markers derived from listings
  const mapMarkers = useMemo(() => listings.map(listing => ({
    id: listing.id,
    lat: listing.lat,
    lng: listing.lng,
    price: listing.priceNum,
    title: listing.title,
    image: listing.images[0],
    beds: listing.beds,
    baths: listing.baths,
  })), []);

  const handleMarkerClick = (marker: { id: string }) => {
    setSelectedListingId(marker.id);
    setShowMapModal(false);
    // Scroll to listing
    const element = document.getElementById(marker.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
      {/* Map Modal */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        markers={mapMarkers}
        onMarkerClick={handleMarkerClick}
        selectedMarkerId={selectedListingId || undefined}
      />

      {/* Comparison Tool */}
      <ComparisonTool
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        listings={listings.map(l => ({
          ...l,
          image: l.images[0],
          neighborhood: l.title.split(' in ')[1],
          sqft: l.beds === 0 ? 450 : l.beds === 1 ? 650 : 900,
          amenities: ['In-unit laundry', 'Parking', 'Pet-friendly'],
          walkScore: Math.floor(Math.random() * 20) + 75,
          transitScore: Math.floor(Math.random() * 20) + 75,
          commute: `${Math.floor(Math.random() * 20) + 10} min`,
        }))}
        selectedIds={compareIds}
        onRemove={removeFromCompare}
      />

      {/* Comparison Bar */}
      <ComparisonBar
        selectedCount={compareIds.length}
        onCompare={() => setShowCompare(true)}
        onClear={clearCompare}
      />
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
          {/* Map/List Toggle */}
          {activeTab === 'listings' && (
            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white/10 text-white hover:bg-white/20 border border-white/10 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </button>
          )}
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
                key={listing.id}
                id={listing.id}
                className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Immersive Glass Card */}
                <div className={`group relative h-96 rounded-3xl overflow-hidden shadow-2xl transition-all ${selectedListingId === listing.id
                    ? 'ring-4 ring-white scale-[1.02]'
                    : 'ring-1 ring-white/20'
                  }`}>
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

                      <div className="flex gap-2">
                        {/* Compare Button */}
                        <button
                          onClick={() => toggleCompare(listing.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all ${compareIds.includes(listing.id)
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                            }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                        {/* Share Button */}
                        <button
                          onClick={() => shareHousing({ title: listing.title, price: listing.price })}
                          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveListing(listing.title)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-all ${savedListings.has(listing.title)
                              ? 'bg-black text-white'
                              : 'bg-white text-black'
                            }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={savedListings.has(listing.title) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
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
                      <button
                        onClick={() => handleViewRoommate(roommate.name)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white text-sm font-medium"
                      >
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
                        <button
                          onClick={() => handleJoinGroup(group.name)}
                          disabled={joiningGroup === group.name || joinedGroups.has(group.name)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${joinedGroups.has(group.name)
                              ? 'bg-white text-black'
                              : 'bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black'
                            } disabled:opacity-50`}
                        >
                          {joiningGroup === group.name ? (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Joining...
                            </span>
                          ) : joinedGroups.has(group.name) ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Joined
                            </span>
                          ) : (
                            'Join'
                          )}
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