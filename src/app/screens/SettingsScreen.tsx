import React, { useState } from 'react';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    housing: true,
    connections: true,
    messages: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    haptics: true,
    autoPlay: false,
  });

  const handleToggle = (category: 'notifications' | 'preferences', key: string) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    } else {
      setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    }
    toast.success('Setting updated');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    onLogout();
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        enabled ? 'bg-white' : 'bg-white/20'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 rounded-full transition-all ${
          enabled ? 'left-6 bg-black' : 'left-1 bg-white/60'
        }`}
      />
    </button>
  );

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
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
        {/* Notifications Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Notifications</h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications' },
              { key: 'email', label: 'Email Notifications', desc: 'Receive email updates' },
              { key: 'housing', label: 'Housing Alerts', desc: 'New listings matching your preferences' },
              { key: 'connections', label: 'Connection Requests', desc: 'When someone wants to connect' },
              { key: 'messages', label: 'Messages', desc: 'New messages from connections' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
                <Toggle
                  enabled={notifications[item.key as keyof typeof notifications]}
                  onToggle={() => handleToggle('notifications', item.key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Preferences</h2>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { key: 'darkMode', label: 'Dark Mode', desc: 'Use dark theme throughout the app' },
              { key: 'haptics', label: 'Haptic Feedback', desc: 'Vibration feedback on interactions' },
              { key: 'autoPlay', label: 'Auto-play Videos', desc: 'Automatically play video content' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
                <Toggle
                  enabled={preferences[item.key as keyof typeof preferences]}
                  onToggle={() => handleToggle('preferences', item.key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Account</h2>
          </div>
          <div className="divide-y divide-white/10">
            <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-white font-medium">Privacy & Security</span>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-medium">Help & Support</span>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-white font-medium">Terms & Policies</span>
              </div>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-red-400 font-semibold hover:bg-red-500/20 hover:border-red-500/30 transition-all"
        >
          Log Out
        </button>

        {/* Version */}
        <p className="text-center text-white/30 text-sm">
          Murge v1.0.0
        </p>
      </div>
    </div>
  );
}
