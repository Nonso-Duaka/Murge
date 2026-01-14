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
  onNavigate: (screen: string) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
}) {
  const commands: Command[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      description: 'Go to your dashboard',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
      shortcut: '⌘1',
      action: () => handlers.onNavigate('dashboard'),
    },
    {
      id: 'nav-housing',
      title: 'Housing',
      description: 'Browse housing listings',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      shortcut: '⌘2',
      action: () => handlers.onNavigate('housing'),
    },
    {
      id: 'nav-people',
      title: 'Find People',
      description: 'Connect with relocators',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      shortcut: '⌘3',
      action: () => handlers.onNavigate('find-people'),
    },
    {
      id: 'nav-explore',
      title: 'Explore',
      description: 'Discover your new city',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
      shortcut: '⌘4',
      action: () => handlers.onNavigate('explore'),
    },
    {
      id: 'nav-workspace',
      title: 'Workspace',
      description: 'Team chat and collaboration',
      category: 'navigation',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      shortcut: '⌘5',
      action: () => handlers.onNavigate('workspace'),
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
  ], [handlers]);

  return commands;
}
