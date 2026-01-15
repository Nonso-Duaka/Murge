import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category: 'navigation' | 'action' | 'search';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      cmd => cmd.title.toLowerCase().includes(q) || cmd.description?.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      action: [],
      search: [],
    };
    filteredCommands.forEach(cmd => {
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatCommands = useMemo(() => {
    return [...groupedCommands.navigation, ...groupedCommands.action, ...groupedCommands.search];
  }, [groupedCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % flatCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + flatCommands.length) % flatCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          flatCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, flatCommands, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Go to';
      case 'action': return 'Actions';
      case 'search': return 'Search';
      default: return category;
    }
  };

  let currentIndex = 0;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl animate-scale-in">
        <div className="mx-4 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
            />
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/50 font-mono">ESC</kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {flatCommands.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-white/50">No commands found</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => {
                if (cmds.length === 0) return null;
                return (
                  <div key={category}>
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider">
                        {getCategoryLabel(category)}
                      </p>
                    </div>
                    {cmds.map((cmd) => {
                      const index = currentIndex++;
                      const isSelected = index === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                            isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                          }`}>
                            {cmd.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                              {cmd.title}
                            </p>
                            {cmd.description && (
                              <p className="text-sm text-white/50">{cmd.description}</p>
                            )}
                          </div>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/50 font-mono">
                              {cmd.shortcut}
                            </kbd>
                          )}
                          {isSelected && (
                            <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono">↵</kbd>
                Select
              </span>
            </div>
            <span className="text-xs text-white/30">Murge Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to provide default commands
export function useCommands(handlers: {
  onNavigateDashboard: () => void;
  onNavigateHousing: () => void;
  onNavigatePeople: () => void;
  onNavigateExplore: () => void;
  onNavigateWorkspace: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenAIAgent?: () => void;
  onOpenChecklist?: () => void;
  onOpenBudget?: () => void;
  onOpenNeighborhoodGuide?: () => void;
  onOpenActivityFeed?: () => void;
  onOpenCalendar?: () => void;
}) {
  const commands: Command[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      description: 'Go to your dashboard',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      shortcut: '⌘1',
      action: handlers.onNavigateDashboard,
    },
    {
      id: 'nav-housing',
      title: 'Housing',
      description: 'Browse housing listings',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      shortcut: '⌘2',
      action: handlers.onNavigateHousing,
    },
    {
      id: 'nav-people',
      title: 'Find People',
      description: 'Connect with relocators',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      shortcut: '⌘3',
      action: handlers.onNavigatePeople,
    },
    {
      id: 'nav-explore',
      title: 'Explore',
      description: 'Discover your new city',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
      shortcut: '⌘4',
      action: handlers.onNavigateExplore,
    },
    {
      id: 'nav-workspace',
      title: 'Workspace',
      description: 'Team chat and collaboration',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      shortcut: '⌘5',
      action: handlers.onNavigateWorkspace,
    },
    {
      id: 'action-search',
      title: 'Search',
      description: 'Search across everything',
      category: 'action',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
      shortcut: '/',
      action: handlers.onOpenSearch,
    },
    {
      id: 'action-notifications',
      title: 'Notifications',
      description: 'View your notifications',
      category: 'action',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
      shortcut: 'N',
      action: handlers.onOpenNotifications,
    },
    {
      id: 'action-profile',
      title: 'Profile',
      description: 'View your profile',
      category: 'action',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      shortcut: 'P',
      action: handlers.onOpenProfile,
    },
    {
      id: 'action-settings',
      title: 'Settings',
      description: 'App settings and preferences',
      category: 'action',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      shortcut: ',',
      action: handlers.onOpenSettings,
    },
    ...(handlers.onOpenChecklist ? [{
      id: 'action-checklist',
      title: 'Checklist',
      description: 'Track your relocation progress',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
      action: handlers.onOpenChecklist,
    }] : []),
    ...(handlers.onOpenBudget ? [{
      id: 'action-budget',
      title: 'Budget Calculator',
      description: 'Plan your relocation budget',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      action: handlers.onOpenBudget,
    }] : []),
    ...(handlers.onOpenNeighborhoodGuide ? [{
      id: 'action-neighborhoods',
      title: 'Neighborhood Guide',
      description: 'Explore neighborhoods',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
      action: handlers.onOpenNeighborhoodGuide,
    }] : []),
    ...(handlers.onOpenActivityFeed ? [{
      id: 'action-activity',
      title: 'Activity Feed',
      description: 'See community updates',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
      action: handlers.onOpenActivityFeed,
    }] : []),
    ...(handlers.onOpenCalendar ? [{
      id: 'action-calendar',
      title: 'Calendar',
      description: 'Schedule viewings and meetups',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      action: handlers.onOpenCalendar,
    }] : []),
    ...(handlers.onOpenAIAgent ? [{
      id: 'action-ai',
      title: 'AI Assistant',
      description: 'Get AI-powered help',
      category: 'action' as const,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
      action: handlers.onOpenAIAgent,
    }] : []),
  ], [handlers]);

  return commands;
}
