import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'glass';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const containerStyles = variant === 'glass'
    ? 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl'
    : 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl';

  return (
    <div className={`${containerStyles} p-8 text-center`}>
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-white/40">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      {description && (
        <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Preset empty states
export function NoResultsEmpty({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title={`No results for "${searchQuery}"`}
      description="Try adjusting your search or filters to find what you're looking for"
      actionLabel="Clear search"
      onAction={onClear}
    />
  );
}

export function NoConnectionsEmpty({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      title="No connections yet"
      description="Start connecting with other relocators to build your network"
      actionLabel="Find People"
      onAction={onExplore}
    />
  );
}

export function NoSavedListingsEmpty({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      title="No saved listings"
      description="Save listings you like to easily find them later"
      actionLabel="Browse Listings"
      onAction={onBrowse}
    />
  );
}

export function NoMessagesEmpty() {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      }
      title="No messages yet"
      description="Be the first to start the conversation!"
    />
  );
}
