import React, { useState, useEffect } from 'react';
import { UserCard } from '../components/UserCard';
import { Input } from '../components/Input';
import { Chip } from '../components/Chip';

export function FindOthersScreen() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Find Others</h1>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`p-2.5 rounded-xl transition-all ${
              filterOpen ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

        <Input
          type="text"
          placeholder="Search by name, company, or role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="md"
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />

        {/* Filters */}
        {filterOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by role:</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Chip
                  key={role}
                  selected={selectedRole === role}
                  onClick={() => setSelectedRole(role)}
                  variant="brand"
                  size="sm"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
        <div
          className={`mb-6 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-base font-medium text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {users.length} people relocating to San Francisco
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
                onConnect={() => console.log('Connect with', user.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}