import React, { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
  channelId: string;
}

interface WorkspaceScreenProps {
  cityName?: string;
}

// Default messages for different channels
const defaultMessages: Message[] = [
  { id: '1', sender: 'Alex K.', text: 'Does anyone know good coffee shops with wifi in the Mission?', time: '10:24 AM', isSelf: false, channelId: 'sf-general' },
  { id: '2', sender: 'Sarah C.', text: 'Ritual Coffee is great! Also Four Barrel nearby', time: '10:28 AM', isSelf: false, channelId: 'sf-general' },
  { id: '3', sender: 'Jordan M.', text: "Seconding Ritual. I'll be working from there tomorrow if anyone wants to join", time: '10:35 AM', isSelf: true, channelId: 'sf-general' },
  { id: '4', sender: 'Alex K.', text: 'Perfect, thanks! I might join tomorrow', time: '10:42 AM', isSelf: false, channelId: 'sf-general' },
  { id: '5', sender: 'Emma W.', text: 'Anyone looking for a roommate in the Mission area?', time: '9:15 AM', isSelf: false, channelId: 'roommates' },
  { id: '6', sender: 'Lisa P.', text: "I am! What's your budget range?", time: '9:22 AM', isSelf: false, channelId: 'roommates' },
  { id: '7', sender: 'Michael B.', text: 'Just joined the June cohort! Excited to meet everyone', time: '8:00 AM', isSelf: false, channelId: 'june-cohort' },
];

export function WorkspaceScreen({ cityName = 'San Francisco' }: WorkspaceScreenProps) {
  const [selectedChannel, setSelectedChannel] = useState('sf-general');
  const [mounted, setMounted] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useLocalStorage<Message[]>('murge_workspace_messages', defaultMessages);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current channel
  const chatMessages = useMemo(() =>
    allMessages.filter(m => m.channelId === selectedChannel),
    [allMessages, selectedChannel]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simulate other users typing occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000 + Math.random() * 2000);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);

    // Simulate sending
    setTimeout(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      const newMessage: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: 'You',
        text: messageInput,
        time: timeString,
        isSelf: true,
        channelId: selectedChannel,
      };

      setAllMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      setIsSending(false);

      toast.success('Message sent!');

      // Simulate a response after a delay (30% chance)
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const responses = [
              "That's a great point!",
              "Thanks for sharing!",
              "I was thinking the same thing",
              "Good to know!",
              "Appreciate the info!",
            ];
            const responders = ['Alex K.', 'Sarah C.', 'Emma W.', 'Michael B.', 'Lisa P.'];

            const responseMessage: Message = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              sender: responders[Math.floor(Math.random() * responders.length)],
              text: responses[Math.floor(Math.random() * responses.length)],
              time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              isSelf: false,
              channelId: selectedChannel,
            };

            setAllMessages(prev => [...prev, responseMessage]);
            setIsTyping(false);
          }, 1500 + Math.random() * 2000);
        }, 2000 + Math.random() * 3000);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const channels = [
    {
      category: 'Micro-cohorts',
      items: [
        { id: 'june-cohort', name: 'June Starters', count: 42 },
        { id: 'may-cohort', name: 'May Starters', count: 35 },
        { id: 'july-cohort', name: 'July Starters', count: 28 },
        { id: 'engineers', name: 'Engineers', count: 28 },
        { id: 'designers', name: 'Designers', count: 15 },
        { id: 'product-managers', name: 'Product Managers', count: 12 },
        { id: 'data-scientists', name: 'Data Scientists', count: 9 },
      ]
    },
    {
      category: 'Housing Groups',
      items: [
        { id: 'mission-hunt', name: 'Mission District', count: 18 },
        { id: 'soma-hunt', name: 'SoMa', count: 12 },
        { id: 'marina-hunt', name: 'Marina', count: 8 },
        { id: 'nob-hill-hunt', name: 'Nob Hill', count: 6 },
        { id: 'castro-hunt', name: 'Castro', count: 5 },
        { id: 'roommates', name: 'Roommate Search', count: 31 },
        { id: 'housing-tips', name: 'Housing Tips', count: 24 },
      ]
    },
    {
      category: 'City Channels',
      items: [
        { id: 'sf-general', name: 'General', count: 156 },
        { id: 'sf-social', name: 'Social Events', count: 89 },
        { id: 'sf-tips', name: 'City Tips', count: 67 },
        { id: 'sf-food', name: 'Food & Dining', count: 54 },
        { id: 'sf-fitness', name: 'Fitness & Sports', count: 42 },
        { id: 'sf-culture', name: 'Arts & Culture', count: 38 },
      ]
    },
    {
      category: 'Professional',
      items: [
        { id: 'networking', name: 'Networking', count: 45 },
        { id: 'job-search', name: 'Job Search', count: 23 },
        { id: 'career-advice', name: 'Career Advice', count: 19 },
        { id: 'mentorship', name: 'Mentorship', count: 15 },
      ]
    },
    {
      category: 'Interests',
      items: [
        { id: 'hiking', name: 'Hiking & Outdoors', count: 34 },
        { id: 'gaming', name: 'Gaming', count: 27 },
        { id: 'book-club', name: 'Book Club', count: 18 },
        { id: 'photography', name: 'Photography', count: 14 },
        { id: 'cooking', name: 'Cooking', count: 21 },
      ]
    }
  ];


  return (
    <div className={`min-h-screen bg-transparent flex flex-col pb-0 lg:flex-row lg:pb-0 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Sidebar - Responsive Drawer */}
      <div className={`
        fixed inset-0 z-50 lg:static lg:z-auto
        w-full lg:w-80
        bg-black lg:bg-black/20 backdrop-blur-2xl lg:backdrop-blur-xl
        border-r border-white/10
        transition-transform duration-500 ease-out
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:h-screen lg:overflow-y-auto
      `}>
        <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-light text-white tracking-tight">Workspace</h2>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">{cityName} • Google</p>
          </div>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
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
                      onClick={() => {
                        setSelectedChannel(channel.id);
                        setShowMobileSidebar(false);
                      }}
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
      <div className="flex-1 flex flex-col h-screen lg:h-screen relative overflow-hidden">
        {/* Chat Header - Glass sticky */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-1 -ml-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xl font-light">#</span>
                <h2 className="text-xl font-medium text-white tracking-tight">General</h2>
              </div>
              <p className="text-sm text-white/60 pl-6">Professional network for SF relocators</p>
            </div>
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 pb-20 space-y-6 scrollbar-hide">
          {chatMessages.map((message, index) => (
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

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start group">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold text-white mt-1">
                ...
              </div>
              <div className="max-w-[80%] sm:max-w-[70%]">
                <div className="flex items-baseline mb-1 ml-1">
                  <span className="text-xs font-medium text-white/80 mr-2">Someone</span>
                  <span className="text-[10px] text-white/40">typing</span>
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-black/40 border border-white/10">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Input Area - Inside Scrollable Area */}
          <div className="relative p-4 sm:px-6 mt-4 border-t border-white/10 bg-black/80 backdrop-blur-xl z-30 lg:bg-transparent lg:border-t-0 rounded-2xl">
            <div className="relative max-w-screen-xl mx-auto">
              <input
                type="text"
                placeholder={`Message #${selectedChannel.replace('sf-', '')}`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isSending}
                className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-white placeholder-white/30 text-sm backdrop-blur-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !messageInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}