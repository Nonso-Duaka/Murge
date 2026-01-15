import React, { useState, useEffect, useRef } from 'react';

interface AIAgentScreenProps {
  onFindHousing: () => void;
  onBack?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  quickActions?: { label: string; action: string }[];
  showListings?: boolean;
}

// Meg's personality responses
const aiResponses = {
  greeting: [
    "Hi there! I'm Meg, your AI relocation buddy. Ready to find your perfect SF home?",
    "Hey! Meg here - think of me as your local guide who knows all the best spots. What are you looking for?",
    "Welcome! I'm Meg, and I'm obsessed with helping people find their dream homes. Let's do this!",
  ],
  budget: [
    "Great budget range! SF can be pricey but I know some hidden gems. Want me to focus on any particular neighborhoods?",
    "I love a person who knows their numbers! With that budget, you've got some solid options. Any must-haves?",
    "Perfect! I'm already mentally scrolling through some great places. Do you need parking or is transit your jam?",
  ],
  neighborhood: [
    "Excellent choice! That area has such great vibes. Want me to prioritize walkability or space?",
    "Oh I love that neighborhood! Great food, great people. Should I look for buildings with amenities?",
    "Smart pick! Let me dig into what's available there. Any dealbreakers I should know about?",
  ],
  searching: [
    "On it! Let me work my magic... I'm analyzing thousands of listings to find your matches.",
    "Searching now! My algorithms are doing their happy dance. This is what I was built for!",
    "Give me a sec while I find you the good stuff. Promise it'll be worth the wait!",
  ],
  found: [
    "I found some gems for you! Based on everything you told me, I think you're going to love these.",
    "Okay, I'm pretty excited about these results. Your preferences + my search skills = chef's kiss.",
    "Ta-da! Here's what I've got. I've ranked them by how well they match what you're looking for.",
  ],
  encouragement: [
    "You're doing great! Every question helps me find better matches.",
    "Love the specificity! The more you tell me, the better I can help.",
    "This is exactly the kind of info I need. We make a good team!",
  ],
};

const getRandomResponse = (category: keyof typeof aiResponses) => {
  const responses = aiResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
};

export function AIAgentScreen({ onFindHousing, onBack }: AIAgentScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: getRandomResponse('greeting'),
      timestamp: new Date(),
      quickActions: [
        { label: 'Find housing near work', action: 'work' },
        { label: 'Affordable neighborhoods', action: 'affordable' },
        { label: 'Pet-friendly places', action: 'pets' },
      ],
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [conversationStage, setConversationStage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: String(Date.now()),
      timestamp: new Date(),
    }]);
  };

  const handleQuickAction = (action: string) => {
    let userText = '';
    let aiResponse = '';
    let quickActions: { label: string; action: string }[] | undefined;

    switch (action) {
      case 'work':
        userText = 'I want to find housing near my office';
        aiResponse = "Smart thinking! Living close to work is a game-changer in SF traffic. What's your office neighborhood, and what's your monthly budget range?";
        quickActions = [
          { label: 'SoMa / Financial District', action: 'soma' },
          { label: 'Mission Bay', action: 'mission-bay' },
          { label: 'South Bay (commute)', action: 'south-bay' },
        ];
        break;
      case 'affordable':
        userText = 'Show me affordable neighborhoods';
        aiResponse = "I got you! SF has some underrated gems that won't break the bank. The Outer Sunset, Excelsior, and parts of the Richmond are worth exploring. What's your ideal budget?";
        quickActions = [
          { label: 'Under $2,000/mo', action: 'budget-low' },
          { label: '$2,000 - $3,000/mo', action: 'budget-mid' },
          { label: '$3,000+/mo', action: 'budget-high' },
        ];
        break;
      case 'pets':
        userText = 'I have a pet and need a pet-friendly place';
        aiResponse = "A fellow pet parent! I'll make sure to filter for pet-friendly buildings. What kind of furry friend are we accommodating? This helps me find places with the right amenities!";
        quickActions = [
          { label: 'Dog', action: 'dog' },
          { label: 'Cat', action: 'cat' },
          { label: 'Other', action: 'other-pet' },
        ];
        break;
      default:
        userText = action;
        aiResponse = getRandomResponse('encouragement') + " Let me factor that into my search...";
    }

    addMessage({ sender: 'user', text: userText });
    setIsTyping(true);
    setConversationStage(prev => prev + 1);

    setTimeout(() => {
      addMessage({
        sender: 'ai',
        text: aiResponse,
        quickActions,
      });
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    addMessage({ sender: 'user', text: userMessage });
    setInput('');
    setIsTyping(true);
    setConversationStage(prev => prev + 1);

    // Determine response based on conversation stage
    const stage = conversationStage + 1;

    setTimeout(() => {
      if (stage >= 3) {
        // Ready to show results
        addMessage({
          sender: 'ai',
          text: getRandomResponse('searching'),
        });
        setIsTyping(false);

        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            addMessage({
              sender: 'ai',
              text: getRandomResponse('found'),
              showListings: true,
            });
            setIsTyping(false);

            setTimeout(() => {
              onFindHousing();
            }, 2000);
          }, 2000);
        }, 1000);
      } else {
        // Continue conversation
        const responses = [
          { text: getRandomResponse('budget'), quickActions: [{ label: 'Under $2.5k', action: 'budget-2500' }, { label: '$2.5k - $3.5k', action: 'budget-3500' }, { label: 'Flexible', action: 'budget-flex' }] },
          { text: getRandomResponse('neighborhood'), quickActions: [{ label: 'Mission', action: 'mission' }, { label: 'SoMa', action: 'soma' }, { label: 'Surprise me!', action: 'surprise' }] },
        ];
        const response = responses[stage - 1] || responses[0];
        addMessage({
          sender: 'ai',
          text: response.text,
          quickActions: response.quickActions,
        });
        setIsTyping(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className={`relative z-10 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3 flex-1">
            {/* AI Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>

            <div className="flex-1">
              <h1 className="text-base font-semibold text-white">Meg</h1>
              <p className="text-xs text-white/50">AI Housing Assistant</p>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/60 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full relative z-10">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm mt-1 animate-pulse-slow">
                  <span className="text-sm">M</span>
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`rounded-2xl px-5 py-3.5 backdrop-blur-md ${message.sender === 'user'
                      ? 'bg-white text-black shadow-lg rounded-tr-sm'
                      : 'bg-white/10 text-white border border-white/10 rounded-tl-sm'
                    }`}
                >
                  {message.sender === 'ai' && (
                    <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Meg
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>

                {/* Quick Actions */}
                {message.sender === 'ai' && message.quickActions && message.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action.action)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white hover:bg-white/20 hover:border-white/40 transition-all hover:scale-105"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[10px] text-white/30 mt-1.5 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <span className="text-sm">M</span>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-white/40 ml-2">Meg is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`relative z-10 px-4 sm:px-6 py-4 border-t border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="e.g., Budget $2000, close to transit, pet friendly..."
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white placeholder-white/30 text-sm"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-4 bg-white text-black rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm whitespace-nowrap shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Send
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { icon: '💰', text: 'Budget $2,500' },
              { icon: '🐕', text: 'Pet friendly' },
              { icon: '🚇', text: 'Near transit' },
              { icon: '🏢', text: 'In-unit laundry' },
              { icon: '🅿️', text: 'Parking included' },
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion.text)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <span>{suggestion.icon}</span>
                {suggestion.text}
              </button>
            ))}
          </div>

          {/* Conversation Tips */}
          {conversationStage === 0 && (
            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <p className="text-xs text-cyan-400 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tip: The more details you share, the better I can match you!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}