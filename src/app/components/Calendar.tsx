import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'viewing' | 'meetup' | 'reminder' | 'move';
  location?: string;
  description?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onAddEvent?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '2BR Mission Viewing',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    type: 'viewing',
    location: '123 Valencia St',
    description: 'Virtual tour with landlord',
  },
  {
    id: '2',
    title: 'Coffee Meetup',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: '2:00 PM',
    type: 'meetup',
    location: 'Blue Bottle Coffee, SoMa',
    description: 'Meeting other relocators',
  },
  {
    id: '3',
    title: 'Studio SoMa Viewing',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '11:30 AM',
    type: 'viewing',
    location: '456 Folsom St',
  },
  {
    id: '4',
    title: 'Move-in Day',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    time: 'All day',
    type: 'move',
    description: 'Moving to new apartment',
  },
  {
    id: '5',
    title: 'Submit Documents',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '5:00 PM',
    type: 'reminder',
    description: 'Deadline for rental application',
  },
];

export function Calendar({ events = mockEvents, onAddEvent, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'viewing': return 'bg-blue-500';
      case 'meetup': return 'bg-green-500';
      case 'reminder': return 'bg-yellow-500';
      case 'move': return 'bg-purple-500';
    }
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'viewing':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'meetup':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'reminder':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
      case 'move':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'month' ? 'bg-white text-black' : 'bg-white/10 text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'week' ? 'bg-white text-black' : 'bg-white/10 text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 px-2 py-2 border-b border-white/10">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-white/50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                isSelected(day)
                  ? 'bg-white text-black'
                  : isToday(day)
                  ? 'bg-white/20 text-white ring-2 ring-white/50'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <span className={`text-sm font-medium ${isSelected(day) ? 'text-black' : ''}`}>
                {day.getDate()}
              </span>
              {hasEvents && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </h3>
            <button
              onClick={() => {
                if (onAddEvent) {
                  onAddEvent(selectedDate);
                } else {
                  toast.info('Scheduling coming soon!');
                }
              }}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {selectedDateEvents.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">No events scheduled</p>
          ) : (
            <div className="space-y-2">
              {selectedDateEvents.map(event => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="w-full text-left bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${getEventTypeColor(event.type)} flex items-center justify-center text-white flex-shrink-0`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{event.title}</p>
                      <p className="text-sm text-white/60">{event.time}</p>
                      {event.location && (
                        <p className="text-xs text-white/40 mt-1 truncate">{event.location}</p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="px-4 pb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Viewing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Meetup</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Reminder</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span>Move</span>
        </div>
      </div>
    </div>
  );
}

// Standalone Calendar Screen
interface CalendarScreenProps {
  onBack: () => void;
}

export function CalendarScreen({ onBack }: CalendarScreenProps) {
  const [showAddEvent, setShowAddEvent] = useState(false);

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Calendar</h1>
            <p className="text-white/60 text-sm">Schedule viewings and meetups</p>
          </div>
          <button
            onClick={() => setShowAddEvent(true)}
            className="p-2 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
        <Calendar
          onEventClick={(event) => toast.info(`${event.title} at ${event.time}`)}
          onAddEvent={() => setShowAddEvent(true)}
        />

        {/* Upcoming Events Summary */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
          <h3 className="font-semibold text-white mb-4">Upcoming This Week</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="flex-1">2 housing viewings</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="flex-1">1 community meetup</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="flex-1">1 deadline reminder</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
