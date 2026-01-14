import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
// @ts-ignore
import murgeLogoImage from '../../assets/murge-logo.png';

interface Activity {
  type: 'person' | 'housing' | 'meetup';
  title: string;
  subtitle: string;
  time: string;
}

interface DashboardScreenProps {
  cityName?: string;
  onOpenProfile?: () => void;
}

export function DashboardScreen({ cityName = 'San Francisco', onOpenProfile }: DashboardScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [progress] = useState(65);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activities: Activity[] = [
    {
      type: 'person',
      title: 'Sarah Chen joined your city',
      subtitle: 'Product Designer at Meta',
      time: '2h ago',
    },
    {
      type: 'housing',
      title: 'New housing match found',
      subtitle: '$2,400/mo • Mission District',
      time: '4h ago',
    },
    {
      type: 'meetup',
      title: 'Coffee meetup this Saturday',
      subtitle: '8 people confirmed',
      time: '6h ago',
    },
    {
      type: 'person',
      title: 'Alex Kumar is relocating',
      subtitle: 'Software Engineer at Stripe',
      time: '1d ago',
    },
    {
      type: 'housing',
      title: 'Marina posted a room',
      subtitle: '$1,800/mo • Available June 1',
      time: '1d ago',
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    // Monochrome icons
    const icons = {
      person: {
        bg: 'bg-black text-white',
        path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      },
      housing: {
        bg: 'bg-white border border-black text-black',
        path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      },
      meetup: {
        bg: 'bg-gray-200 text-black',
        path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      },
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header - Glass */}
      <div className="bg-transparent px-4 sm:px-6 py-6 sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
            <p className="text-sm font-medium text-white/90 flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full backdrop-blur-md">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              {cityName}
            </p>
          </div>
          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white to-white/80 flex items-center justify-center text-black font-bold text-lg hover:scale-110 transition-transform shadow-lg"
          >
            JM
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2 max-w-4xl mx-auto">
        {/* Stats Cards Row - Dark Glass */}
        <div
          className={`grid grid-cols-3 gap-3 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Card padding="sm" className="bg-white/90 backdrop-blur-xl border border-white/50 text-black shadow-lg">
            <div className="text-center py-2">
              <div className="text-3xl font-light mb-1 text-black">23</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-medium text-black">Connections</div>
            </div>
          </Card>
          <Card padding="sm" className="bg-white/90 backdrop-blur-xl border border-white/50 text-black shadow-lg">
            <div className="text-center py-2">
              <div className="text-3xl font-light mb-1 text-black">12</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-medium text-black">Saved</div>
            </div>
          </Card>
          <Card padding="sm" className="bg-white/90 backdrop-blur-xl border border-white/50 text-black shadow-lg">
            <div className="text-center py-2">
              <div className="text-3xl font-light mb-1 text-black">42</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60 font-medium text-black">Days Left</div>
            </div>
          </Card>
        </div>

        {/* Progress Card - Featured Glass */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Card padding="lg" className="bg-white/10 backdrop-blur-3xl text-white border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-light text-white mb-1">Your Move Progress</h3>
                  <p className="text-sm text-gray-300 font-light">42 days until start date</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-thin text-white tracking-tighter">{progress}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-8 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-white rounded-full h-1.5 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  style={{ width: mounted ? `${progress}%` : '0%' }}
                />
              </div>

              {/* Quick Actions - Minimal Pill Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button className="py-3 px-3 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all text-center shadow-lg">
                  Overview
                </button>
                <button className="py-3 px-3 bg-black/40 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-black/60 transition-all text-center backdrop-blur-md">
                  Checklist
                </button>
                <button className="py-3 px-3 bg-black/40 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-black/60 transition-all text-center backdrop-blur-md">
                  Timeline
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div
          className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-medium text-white tracking-tight">Recent Activity</h2>
            <button className="text-xs text-white/70 font-bold uppercase tracking-widest hover:text-white transition-all bg-white/10 px-3 py-1 rounded-full">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const icon = getActivityIcon(activity.type);
              return (
                <div
                  key={index}
                  className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  style={{ transitionDelay: `${300 + index * 50}ms` }}
                >
                  {/* Activity Card - Clean White Pop */}
                  <div className="group relative bg-white/90 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-lg hover:bg-white transition-colors">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 ${icon.bg} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white/50`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon.path} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="font-bold text-black mb-0.5 text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-500 font-medium">{activity.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}