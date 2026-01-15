import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  type: 'housing' | 'connection' | 'milestone' | 'meetup' | 'checklist' | 'ai_recommendation';
  user: {
    name: string;
    avatar?: string;
    initials: string;
    isYou?: boolean;
  };
  action: string;
  target?: string;
  preview?: {
    image?: string;
    title?: string;
    subtitle?: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'milestone',
    user: { name: 'You', initials: 'JM', isYou: true },
    action: 'completed 5 checklist items',
    timestamp: '2h ago',
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    type: 'housing',
    user: { name: 'Sarah Chen', initials: 'SC' },
    action: 'saved a new listing',
    target: '2BR in Mission',
    preview: {
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
      title: '2BR in Mission District',
      subtitle: '$2,400/mo',
    },
    timestamp: '3h ago',
    likes: 8,
    comments: 5,
  },
  {
    id: '3',
    type: 'connection',
    user: { name: 'Alex Kumar', initials: 'AK' },
    action: 'connected with',
    target: 'Jordan M.',
    timestamp: '4h ago',
    likes: 15,
    comments: 2,
  },
  {
    id: '4',
    type: 'meetup',
    user: { name: 'SF Newcomers Group', initials: 'SF' },
    action: 'organized a meetup',
    target: 'Coffee & Networking',
    preview: {
      title: 'Coffee & Networking at Blue Bottle',
      subtitle: 'Saturday, 10:00 AM',
    },
    timestamp: '5h ago',
    likes: 23,
    comments: 8,
  },
  {
    id: '5',
    type: 'ai_recommendation',
    user: { name: 'Murge AI', initials: 'AI' },
    action: 'found matches for',
    target: 'You',
    preview: {
      title: '3 new housing matches',
      subtitle: 'Based on your preferences',
    },
    timestamp: '6h ago',
    likes: 0,
    comments: 0,
  },
  {
    id: '6',
    type: 'checklist',
    user: { name: 'Emma Wilson', initials: 'EW' },
    action: 'achieved',
    target: 'Relocation Pro status',
    timestamp: '1d ago',
    likes: 42,
    comments: 12,
  },
  {
    id: '7',
    type: 'housing',
    user: { name: 'Jordan M.', initials: 'JM' },
    action: 'is looking for roommates in',
    target: 'SoMa',
    timestamp: '1d ago',
    likes: 5,
    comments: 8,
  },
];

interface ActivityFeedScreenProps {
  onBack: () => void;
}

export function ActivityFeedScreen({ onBack }: ActivityFeedScreenProps) {
  const [activities, setActivities] = useState(mockActivities);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'connections' | 'housing' | 'milestones'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = (id: string) => {
    setActivities(prev =>
      prev.map(a => {
        if (a.id === id) {
          const isLiked = !a.isLiked;
          return {
            ...a,
            isLiked,
            likes: isLiked ? a.likes + 1 : a.likes - 1,
          };
        }
        return a;
      })
    );
  };

  const handleComment = (id: string) => {
    toast.info('Comments coming soon!');
  };

  const getTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'housing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'connection':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'milestone':
      case 'checklist':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'meetup':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'ai_recommendation':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'housing':
        return 'bg-blue-500';
      case 'connection':
        return 'bg-green-500';
      case 'milestone':
      case 'checklist':
        return 'bg-yellow-500';
      case 'meetup':
        return 'bg-purple-500';
      case 'ai_recommendation':
        return 'bg-gradient-to-br from-cyan-500 to-blue-500';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'connections') return activity.type === 'connection';
    if (filter === 'housing') return activity.type === 'housing';
    if (filter === 'milestones') return activity.type === 'milestone' || activity.type === 'checklist';
    return true;
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'connections', label: 'Connections' },
    { id: 'housing', label: 'Housing' },
    { id: 'milestones', label: 'Milestones' },
  ];

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
          <div>
            <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
            <p className="text-white/60 text-sm">See what's happening in your community</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-4">
        {filteredActivities.map((activity, index) => (
          <div
            key={activity.id}
            className={`transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      activity.user.isYou ? 'bg-gradient-to-br from-white to-white/80 text-black' : 'bg-white/20'
                    }`}>
                      {activity.user.initials}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getTypeColor(activity.type)} flex items-center justify-center text-white`}>
                      {getTypeIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white">
                      <span className="font-semibold">{activity.user.name}</span>
                      {' '}
                      <span className="text-white/70">{activity.action}</span>
                      {activity.target && (
                        <>
                          {' '}
                          <span className="font-semibold">{activity.target}</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-white/50 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              {activity.preview && (
                <div className="mx-4 mb-4">
                  <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                    {activity.preview.image && (
                      <img
                        src={activity.preview.image}
                        alt=""
                        className="w-full h-40 object-cover"
                      />
                    )}
                    {(activity.preview.title || activity.preview.subtitle) && (
                      <div className="p-3">
                        {activity.preview.title && (
                          <p className="font-semibold text-white text-sm">{activity.preview.title}</p>
                        )}
                        {activity.preview.subtitle && (
                          <p className="text-white/60 text-xs mt-0.5">{activity.preview.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {activity.type !== 'ai_recommendation' && (
                <div className="px-4 pb-4 flex items-center gap-4">
                  <button
                    onClick={() => handleLike(activity.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      activity.isLiked ? 'text-red-400' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={activity.isLiked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{activity.likes}</span>
                  </button>
                  <button
                    onClick={() => handleComment(activity.id)}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{activity.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors ml-auto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* AI Recommendation CTA */}
              {activity.type === 'ai_recommendation' && (
                <div className="px-4 pb-4">
                  <button className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-colors">
                    View Matches
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
