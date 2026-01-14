import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';

interface WorkspaceScreenProps {
  cityName?: string;
}

export function WorkspaceScreen({ cityName = 'San Francisco' }: WorkspaceScreenProps) {
  const [selectedChannel, setSelectedChannel] = useState('sf-general');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const channels = [
    {
      category: 'Micro-cohorts',
      items: [
        { id: 'june-cohort', name: 'June Starters', count: 42 },
        { id: 'engineers', name: 'Engineers', count: 28 },
        { id: 'designers', name: 'Designers', count: 15 },
      ]
    },
    {
      category: 'Housing Groups',
      items: [
        { id: 'mission-hunt', name: 'Mission District', count: 18 },
        { id: 'soma-hunt', name: 'SoMa', count: 12 },
        { id: 'roommates', name: 'Roommate Search', count: 31 },
      ]
    },
    {
      category: 'City Channels',
      items: [
        { id: 'sf-general', name: 'General', count: 156 },
        { id: 'sf-social', name: 'Social Events', count: 89 },
        { id: 'sf-tips', name: 'City Tips', count: 67 },
      ]
    }
  ];

  const messages = [
    { sender: 'Alex K.', text: 'Does anyone know good coffee shops with wifi in the Mission?', time: '10:24 AM', isSelf: false },
    { sender: 'Sarah C.', text: 'Ritual Coffee is great! Also Four Barrel nearby', time: '10:28 AM', isSelf: false },
    { sender: 'Jordan M.', text: 'Seconding Ritual. I\'ll be working from there tomorrow if anyone wants to join', time: '10:35 AM', isSelf: true },
    { sender: 'Alex K.', text: 'Perfect, thanks! I might join tomorrow', time: '10:42 AM', isSelf: false },
  ];

  return (
    <div className={`min-h-screen bg-transparent flex flex-col pb-20 lg:flex-row lg:pb-0 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar - Glass */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0 lg:h-screen lg:overflow-y-auto bg-black/20 backdrop-blur-xl">
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-2xl font-light text-white tracking-tight">Workspace</h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">{cityName} • Google</p>
        </div>

        <div className="py-4 px-3">
          {channels.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="px-3 py-2">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {group.category}
                </h3>
              </div>
              <div className="space-y-0.5">
                {group.items.map(channel => {
                  const isSelected = selectedChannel === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel.id)}
                      className={`w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-300 group relative overflow-hidden ${isSelected
                        ? 'bg-white text-black shadow-lg font-medium'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg leading-none ${isSelected ? 'text-black/50' : 'text-white/30'}`}>#</span>
                          <span>{channel.name}</span>
                        </div>
                        {channel.count > 0 && (
                          <span className={`text-[10px] py-0.5 px-2 rounded-full ${isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-white/60'
                            }`}>
                            {channel.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-12rem)] lg:min-h-screen relative">
        {/* Chat Header - Glass sticky */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xl font-light">#</span>
              <h2 className="text-xl font-medium text-white tracking-tight">General</h2>
            </div>
            <p className="text-sm text-white/60 pl-6">Professional network for SF relocators</p>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/20 backdrop-blur-sm" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-[10px] font-bold">
              +42
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scrollbar-hide">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'} group`}>
              {!message.isSelf && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold text-white mt-1">
                  {message.sender.split(' ').map(n => n[0]).join('')}
                </div>
              )}

              <div className={`max-w-[80%] sm:max-w-[70%]`}>
                {!message.isSelf && (
                  <div className="flex items-baseline mb-1 ml-1">
                    <span className="text-xs font-medium text-white/80 mr-2">{message.sender}</span>
                    <span className="text-[10px] text-white/40">{message.time}</span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-sm transition-all duration-300
                    ${message.isSelf
                      ? 'bg-white text-black rounded-tr-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      : 'bg-black/40 border border-white/10 text-white rounded-tl-sm hover:bg-black/50'
                    }
                  `}
                >
                  {message.text}
                </div>

                {message.isSelf && (
                  <div className="flex justify-end mt-1 mr-1">
                    <span className="text-[10px] text-white/40">{message.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Message #general"
              className="w-full pl-4 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder-white/30 text-sm backdrop-blur-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}