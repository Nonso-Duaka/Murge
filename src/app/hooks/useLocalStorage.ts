import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Read from localStorage on mount
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue, clearValue];
}

// Hook for storing Sets (like connected users, saved listings)
export function useLocalStorageSet(key: string): [Set<string>, (value: string) => void, (value: string) => void, () => void] {
  const [stored, setStored, clearStored] = useLocalStorage<string[]>(key, []);

  const set = new Set(stored);

  const add = useCallback((value: string) => {
    setStored(prev => [...new Set([...prev, value])]);
  }, [setStored]);

  const remove = useCallback((value: string) => {
    setStored(prev => prev.filter(v => v !== value));
  }, [setStored]);

  return [set, add, remove, clearStored];
}

// Hook for storing messages
export interface StoredMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
  channelId: string;
}

export function useMessages(channelId: string) {
  const [allMessages, setAllMessages] = useLocalStorage<StoredMessage[]>('murge_messages', []);

  const channelMessages = allMessages.filter(m => m.channelId === channelId);

  const addMessage = useCallback((message: Omit<StoredMessage, 'id' | 'channelId'>) => {
    const newMessage: StoredMessage = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channelId,
    };
    setAllMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [channelId, setAllMessages]);

  return { messages: channelMessages, addMessage, allMessages };
}

// Hook for user profile
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  startDate: string;
  location: string;
  avatar: string;
  bio: string;
  interests: string[];
  housingPreferences: {
    budget: string;
    moveInDate: string;
    preferredNeighborhoods: string[];
    roommates: string;
    petFriendly: boolean;
    amenities: string[];
  };
  stats: {
    connections: number;
    savedListings: number;
    daysUntilMove: number;
  };
}

const defaultProfile: UserProfile = {
  name: 'Jordan Martinez',
  email: 'jordan.martinez@google.com',
  phone: '+1 (555) 123-4567',
  company: 'Google',
  position: 'Software Engineering Intern',
  startDate: 'June 1, 2024',
  location: 'San Francisco, CA',
  avatar: 'JM',
  bio: 'Incoming SWE intern at Google. Looking for housing close to the office and excited to explore SF!',
  interests: ['Hiking', 'Coffee', 'Tech meetups', 'Photography'],
  housingPreferences: {
    budget: '$1,800 - $2,200/mo',
    moveInDate: 'May 25, 2024',
    preferredNeighborhoods: ['Mission District', 'SoMa', 'Castro'],
    roommates: 'Open to roommates',
    petFriendly: true,
    amenities: ['Gym', 'In-unit laundry', 'Parking', 'Near public transit'],
  },
  stats: {
    connections: 23,
    savedListings: 12,
    daysUntilMove: 42,
  },
};

export function useUserProfile() {
  const [profile, setProfile, clearProfile] = useLocalStorage<UserProfile>('murge_profile', defaultProfile);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, [setProfile]);

  const updateHousingPreferences = useCallback((updates: Partial<UserProfile['housingPreferences']>) => {
    setProfile(prev => ({
      ...prev,
      housingPreferences: { ...prev.housingPreferences, ...updates },
    }));
  }, [setProfile]);

  const updateStats = useCallback((updates: Partial<UserProfile['stats']>) => {
    setProfile(prev => ({
      ...prev,
      stats: { ...prev.stats, ...updates },
    }));
  }, [setProfile]);

  return { profile, updateProfile, updateHousingPreferences, updateStats, clearProfile };
}

// Hook for app-wide state
export interface AppState {
  companyCode: string;
  companyName: string;
  selectedCity: string;
  backgroundImage: string | null;
  hasCompletedOnboarding: boolean;
}

const defaultAppState: AppState = {
  companyCode: '',
  companyName: '',
  selectedCity: 'San Francisco',
  backgroundImage: null,
  hasCompletedOnboarding: false,
};

export function useAppState() {
  const [state, setState, clearState] = useLocalStorage<AppState>('murge_app_state', defaultAppState);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, [setState]);

  return { state, updateState, clearState };
}

// Hook for notifications
export interface Notification {
  id: string;
  type: 'connection' | 'housing' | 'message' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const defaultNotifications: Notification[] = [
  { id: '1', type: 'connection', title: 'Sarah Chen accepted your connection', description: 'You can now message each other', time: '2h ago', read: false },
  { id: '2', type: 'housing', title: 'New listing matches your preferences', description: '2BR in Mission - $2,400/mo', time: '4h ago', read: false },
  { id: '3', type: 'message', title: 'New message from Alex Kumar', description: 'Hey! Want to grab coffee this weekend?', time: '6h ago', read: false },
  { id: '4', type: 'system', title: 'Complete your profile', description: 'Add your interests to get better matches', time: '1d ago', read: true },
  { id: '5', type: 'housing', title: 'Price drop alert', description: 'Studio in SoMa reduced to $1,950/mo', time: '1d ago', read: true },
];

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('murge_notifications', defaultNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      time: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [setNotifications]);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification, clearNotification };
}

// Hook for filter persistence
export interface FilterState {
  housing: {
    priceRange: [number, number];
    bedrooms: string;
    neighborhoods: string[];
  };
  people: {
    role: string;
    searchQuery: string;
  };
  explore: {
    category: string;
    searchQuery: string;
  };
}

const defaultFilters: FilterState = {
  housing: {
    priceRange: [1500, 3500],
    bedrooms: 'all',
    neighborhoods: [],
  },
  people: {
    role: 'all',
    searchQuery: '',
  },
  explore: {
    category: 'all',
    searchQuery: '',
  },
};

export function useFilters() {
  const [filters, setFilters] = useLocalStorage<FilterState>('murge_filters', defaultFilters);

  const updateHousingFilters = useCallback((updates: Partial<FilterState['housing']>) => {
    setFilters(prev => ({ ...prev, housing: { ...prev.housing, ...updates } }));
  }, [setFilters]);

  const updatePeopleFilters = useCallback((updates: Partial<FilterState['people']>) => {
    setFilters(prev => ({ ...prev, people: { ...prev.people, ...updates } }));
  }, [setFilters]);

  const updateExploreFilters = useCallback((updates: Partial<FilterState['explore']>) => {
    setFilters(prev => ({ ...prev, explore: { ...prev.explore, ...updates } }));
  }, [setFilters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  return { filters, updateHousingFilters, updatePeopleFilters, updateExploreFilters, resetFilters };
}

// Hook for favorites/bookmarks
export interface Favorite {
  id: string;
  type: 'housing' | 'person' | 'place';
  title: string;
  subtitle: string;
  image?: string;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Favorite[]>('murge_favorites', []);

  const addFavorite = useCallback((favorite: Omit<Favorite, 'id' | 'addedAt'>) => {
    const newFavorite: Favorite = {
      ...favorite,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: new Date().toISOString(),
    };
    setFavorites(prev => [newFavorite, ...prev]);
    return newFavorite;
  }, [setFavorites]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, [setFavorites]);

  const isFavorite = useCallback((title: string, type: Favorite['type']) => {
    return favorites.some(f => f.title === title && f.type === type);
  }, [favorites]);

  const getFavoritesByType = useCallback((type: Favorite['type']) => {
    return favorites.filter(f => f.type === type);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, getFavoritesByType };
}
