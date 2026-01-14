import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNotifications, Notification } from '../hooks/useLocalStorage';

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { notifications, markAsRead, markAllAsRead, clearNotification, unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'connection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'housing':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'message':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    toast.info('Opening...', { description: notification.title });
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    clearNotification(id);
    toast.success('Notification dismissed');
  };

  return (
    <div className="min-h-screen bg-transparent pb-24 relative z-10">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 sm:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-white/60">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllAsRead();
                toast.success('All notifications marked as read');
              }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
            <p className="text-white/50">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative bg-white/10 backdrop-blur-xl rounded-2xl border transition-all duration-500 cursor-pointer hover:bg-white/15 ${
                  notification.read ? 'border-white/10' : 'border-white/30'
                } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-white/10 text-white/50' : 'bg-white text-black'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium mb-1 ${notification.read ? 'text-white/70' : 'text-white'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-white/50 mb-2">{notification.description}</p>
                    <p className="text-xs text-white/40">{notification.time}</p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0 mt-2" />
                  )}

                  {/* Dismiss button */}
                  <button
                    onClick={(e) => handleDismiss(e, notification.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
