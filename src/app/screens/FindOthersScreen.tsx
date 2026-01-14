import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { UserCard } from '../components/UserCard';
import { NoResultsEmpty } from '../components/EmptyState';
import { useLocalStorageSet, useFilters } from '../hooks/useLocalStorage';
import { useShare } from '../hooks/useShare';

export function FindOthersScreen() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [connectedUsers, addConnection, removeConnection] = useLocalStorageSet('murge_connections');
  const [connectingUser, setConnectingUser] = useState<string | null>(null);
  const { filters, updatePeopleFilters } = useFilters();
  const { shareProfile } = useShare();

  // Use persisted filters
  const [searchQuery, setSearchQuery] = useState(filters.people.searchQuery);
  const [selectedRole, setSelectedRole] = useState(filters.people.role);

  // Persist filter changes
  useEffect(() => {
    updatePeopleFilters({ searchQuery, role: selectedRole });
  }, [searchQuery, selectedRole]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = (userName: string) => {
    if (connectedUsers.has(userName)) {
      toast.info(`You're already connected with ${userName}`);
      return;
    }

    setConnectingUser(userName);

    // Simulate connection request
    setTimeout(() => {
      addConnection(userName);
      setConnectingUser(null);
      toast.success(`Connection request sent to ${userName}!`, {
        description: "They'll be notified and can accept your request.",
      });
    }, 800);
  };

  const roles = ['all', 'engineering', 'design', 'product', 'data'];

  const users = [
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      company: 'Meta',
      moveDate: 'June 1, 2026',
      matchScore: 92,
      isOnline: true,
      isNew: true,
    },
    {
      name: 'Alex Kumar',
      role: 'Software Engineer',
      company: 'Stripe',
      moveDate: 'May 15, 2026',
      matchScore: 88,
      isOnline: false,
      isNew: false,
    },
    {
      name: 'Jordan Martinez',
      role: 'Product Manager',
      company: 'Airbnb',
      moveDate: 'June 1, 2026',
      matchScore: 85,
      isOnline: true,
      isNew: false,
    },
    {
      name: 'Emma Wilson',
      role: 'Data Scientist',
      company: 'Uber',
      moveDate: 'July 1, 2026',
      matchScore: 78,
      isOnline: false,
      isNew: true,
    },
    {
      name: 'Michael Brown',
      role: 'UX Researcher',
      company: 'Google',
      moveDate: 'May 20, 2026',
      matchScore: 94,
      isOnline: true,
      isNew: false,
    },
    {
      name: 'Lisa Park',
      role: 'Software Engineer',
      company: 'Netflix',
      moveDate: 'June 15, 2026',
      matchScore: 82,
      isOnline: false,
      isNew: true,
    },
  ];

  // Filter users based on search query and selected role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        user.name.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.company.toLowerCase().includes(searchLower);

      // Filter by role
      const roleMap: Record<string, string[]> = {
        engineering: ['software engineer', 'engineer'],
        design: ['designer', 'ux researcher'],
        product: ['product manager', 'product'],
        data: ['data scientist', 'data'],
      };

      const matchesRole = selectedRole === 'all' ||
        roleMap[selectedRole]?.some(r => user.role.toLowerCase().includes(r));

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header - Glass */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Find People</h1>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`p-2.5 rounded-xl transition-all shadow-lg ${filterOpen ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, company, or role"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-white placeholder-white/60 text-sm shadow-lg"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filters */}
        {filterOpen && (
          <div className="mt-4 p-4 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg">
            <p className="text-sm font-medium text-white mb-2">Filter by role:</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${selectedRole === role
                    ? 'bg-white text-black'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                    }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div
          className={`mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <p className="text-base font-medium text-white flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg w-fit">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <NoResultsEmpty
            searchQuery={searchQuery || selectedRole}
            onClear={clearFilters}
          />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <UserCard
                name={user.name}
                role={user.role}
                company={user.company}
                moveDate={user.moveDate}
                matchScore={user.matchScore}
                isOnline={user.isOnline}
                isNew={user.isNew}
                isConnected={connectedUsers.has(user.name)}
                isConnecting={connectingUser === user.name}
                onConnect={() => handleConnect(user.name)}
                onShare={() => shareProfile({ name: user.name, company: user.company })}
              />
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}