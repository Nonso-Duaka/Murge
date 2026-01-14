import React, { useState, useEffect } from 'react';

interface ProfileScreenProps {
    onBack?: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock user data - in real app this would come from state/API
    const userProfile = {
        name: 'Jordan Martinez',
        email: 'jordan.martinez@google.com',
        phone: '+1 (555) 123-4567',
        company: 'Google',
        position: 'Software Engineering Intern',
        startDate: 'June 1, 2024',
        location: 'San Francisco, CA',
        avatar: 'JM',

        // Housing Preferences
        housingPreferences: {
            budget: '$1,800 - $2,200/mo',
            moveInDate: 'May 25, 2024',
            preferredNeighborhoods: ['Mission District', 'SoMa', 'Castro'],
            roommates: 'Open to roommates',
            petFriendly: true,
            amenities: ['Gym', 'In-unit laundry', 'Parking', 'Near public transit'],
        },

        // Personal Info
        bio: 'Incoming SWE intern at Google. Looking for housing close to the office and excited to explore SF!',
        interests: ['Hiking', 'Coffee', 'Tech meetups', 'Photography'],

        // Stats
        stats: {
            connections: 23,
            savedListings: 12,
            daysUntilMove: 42,
        }
    };

    return (
        <div className="min-h-screen bg-black pb-24 relative overflow-hidden">
            {/* Subtle Background */}
            <div className="fixed inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_50%)]" />
            </div>

            {/* Header */}
            <div className={`relative z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="px-4 sm:px-6 py-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors group mb-4"
                    >
                        <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Profile Header */}
                    <div className="flex items-start gap-6 mb-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center text-4xl font-bold text-black shadow-2xl">
                            {userProfile.avatar}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
                            <p className="text-white/80 text-lg mb-1">{userProfile.position}</p>
                            <p className="text-white/60 text-sm">{userProfile.company}</p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-all"
                                >
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                                <button className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all">
                                    Share Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{userProfile.stats.connections}</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Connections</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{userProfile.stats.savedListings}</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Saved</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{userProfile.stats.daysUntilMove}</div>
                            <div className="text-xs text-white/60 uppercase tracking-wider font-medium">Days Left</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 py-6 max-w-4xl mx-auto space-y-6">
                {/* Contact Information */}
                <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Contact Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-white/80">{userProfile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-white/80">{userProfile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-white/80">{userProfile.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-white/80">Start Date: {userProfile.startDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">About</h2>
                        <p className="text-white/80 leading-relaxed">{userProfile.bio}</p>
                    </div>
                </div>

                {/* Housing Preferences */}
                <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Housing Preferences
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-medium">Budget</div>
                                    <div className="text-white/90 font-semibold">{userProfile.housingPreferences.budget}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-medium">Move-in Date</div>
                                    <div className="text-white/90 font-semibold">{userProfile.housingPreferences.moveInDate}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Preferred Neighborhoods</div>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.housingPreferences.preferredNeighborhoods.map((neighborhood, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 font-medium">
                                            {neighborhood}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Amenities</div>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.housingPreferences.amenities.map((amenity, index) => (
                                        <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/70">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${userProfile.housingPreferences.petFriendly ? 'bg-white border-white' : 'border-white/30'}`}>
                                        {userProfile.housingPreferences.petFriendly && (
                                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-white/80 text-sm">Pet Friendly</span>
                                </div>
                                <div className="text-white/60 text-sm">{userProfile.housingPreferences.roommates}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interests */}
                <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {userProfile.interests.map((interest, index) => (
                                <span key={index} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-white/80 font-medium hover:bg-white/20 transition-all cursor-pointer">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
