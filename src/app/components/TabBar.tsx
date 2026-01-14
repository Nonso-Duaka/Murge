import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  badges?: Record<string, number>;
}

export function TabBar({ activeTab, onTabChange, badges = {} }: TabBarProps) {
  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: badges.dashboard },
    { id: 'workspace', label: 'Workspace', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', badge: badges.workspace },
    { id: 'housing', label: 'Housing', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', badge: badges.housing },
    { id: 'explore', label: 'Explore', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', badge: badges.explore },
  ];

  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-40">
      {/* Active Indicator */}
      <div
        className="absolute top-0 h-0.5 bg-black transition-all duration-300 ease-out"
        style={{
          width: `${100 / tabs.length}%`,
          left: `${(activeIndex * 100) / tabs.length}%`,
        }}
      />

      <div className="px-2 sm:px-4 py-1.5 flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center py-2 px-2 sm:px-3 rounded-xl
                transition-all duration-200
                active:scale-95
                ${isActive
                  ? 'text-black'
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
                }
              `}
            >
              <div className="relative">
                <svg
                  className={`w-6 h-6 mb-1 transition-all duration-200 ${isActive ? 'scale-110' : 'scale-100'
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={isActive ? 2 : 1.5}
                    d={tab.icon}
                  />
                </svg>

                {/* Badge Notification */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-black text-white rounded-full border-2 border-white">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-all duration-200 ${isActive ? 'opacity-100 font-semibold' : 'opacity-70'
                  }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}