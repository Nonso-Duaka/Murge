import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserProfile } from '../hooks/useLocalStorage';

interface ProfileScreenProps {
    onBack?: () => void;
    onOpenSettings?: () => void;
    onOpenFavorites?: () => void;
}

export function ProfileScreen({ onBack, onOpenSettings, onOpenFavorites }: ProfileScreenProps) {
    const [mounted, setMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { profile: userProfile, updateProfile, updateHousingPreferences } = useUserProfile();

    // Form state for editing
    const [formData, setFormData] = useState({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        bio: userProfile.bio,
        budget: userProfile.housingPreferences.budget,
        moveInDate: userProfile.housingPreferences.moveInDate,
        roommates: userProfile.housingPreferences.roommates,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Update form data when profile changes
    useEffect(() => {
        setFormData({
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,
            bio: userProfile.bio,
            budget: userProfile.housingPreferences.budget,
            moveInDate: userProfile.housingPreferences.moveInDate,
            roommates: userProfile.housingPreferences.roommates,
        });
    }, [userProfile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            // Update profile with form data
            updateProfile({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            });
            updateHousingPreferences({
                budget: formData.budget,
                moveInDate: formData.moveInDate,
                roommates: formData.roommates,
            });

            setIsSaving(false);
            setIsEditing(false);
            toast.success('Profile updated!', {
                description: 'Your changes have been saved',
            });
        }, 800);
    };

    const handleCancelEdit = () => {
        // Reset form data to current profile
        setFormData({
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,
            bio: userProfile.bio,
            budget: userProfile.housingPreferences.budget,
            moveInDate: userProfile.housingPreferences.moveInDate,
            roommates: userProfile.housingPreferences.roommates,
        });
        setIsEditing(false);
    };

    const handleShareProfile = () => {
        // Simulate copying profile link
        const profileSlug = userProfile.name.toLowerCase().replace(' ', '-');
        navigator.clipboard?.writeText(`https://murge.app/profile/${profileSlug}`).then(() => {
            toast.success('Profile link copied!', {
                description: 'Share it with others to connect',
            });
        }).catch(() => {
            toast.success('Profile link copied!', {
                description: 'Share it with others to connect',
            });
        });
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
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
                        >
                            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onOpenFavorites}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors group"
                                title="Favorites"
                            >
                                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <button
                                onClick={onOpenSettings}
                                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors group"
                                title="Settings"
                            >
                                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="flex items-start gap-6 mb-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center text-4xl font-bold text-black shadow-2xl">
                            {userProfile.avatar}
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="text-3xl font-bold text-white mb-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1 w-full focus:outline-none focus:border-white/40"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
                            )}
                            <p className="text-white/80 text-lg mb-1">{userProfile.position}</p>
                            <p className="text-white/60 text-sm">{userProfile.company}</p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                                {isEditing ? (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleShareProfile}
                                        className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-all"
                                    >
                                        Share Profile
                                    </button>
                                )}
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
                                <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="flex-1 text-white/80 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                                    />
                                ) : (
                                    <span className="text-white/80">{userProfile.email}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="flex-1 text-white/80 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                                    />
                                ) : (
                                    <span className="text-white/80">{userProfile.phone}</span>
                                )}
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
                        {isEditing ? (
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                rows={4}
                                className="w-full text-white/80 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40 resize-none"
                            />
                        ) : (
                            <p className="text-white/80 leading-relaxed">{userProfile.bio}</p>
                        )}
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
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.budget}
                                            onChange={(e) => handleInputChange('budget', e.target.value)}
                                            className="w-full text-white/90 font-semibold bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                                        />
                                    ) : (
                                        <div className="text-white/90 font-semibold">{userProfile.housingPreferences.budget}</div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider mb-1 font-medium">Move-in Date</div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.moveInDate}
                                            onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                                            className="w-full text-white/90 font-semibold bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/40"
                                        />
                                    ) : (
                                        <div className="text-white/90 font-semibold">{userProfile.housingPreferences.moveInDate}</div>
                                    )}
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
