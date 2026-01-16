import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'sonner';
// @ts-ignore
import murgeLogoImage from '../assets/murge-logo-latest.png';
import { EnterCodeScreen } from './screens/EnterCodeScreen';
import { SelectLocationScreen } from './screens/SelectLocationScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { WorkspaceScreen } from './screens/WorkspaceScreen';
import { FindOthersScreen } from './screens/FindOthersScreen';
import { HousingScreen } from './screens/HousingScreen';
import { AIAgentScreen } from './screens/AIAgentScreen';
import { RecommendedHousingScreen } from './screens/RecommendedHousingScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ChecklistScreen } from './screens/ChecklistScreen';
import { BudgetCalculatorScreen } from './screens/BudgetCalculatorScreen';
import { NeighborhoodGuideScreen } from './screens/NeighborhoodGuideScreen';
import { ActivityFeedScreen } from './screens/ActivityFeedScreen';
import { CalendarScreen } from './components/Calendar';
import { TabBar } from './components/TabBar';
import { GlobalSearch } from './components/GlobalSearch';
import { CommandPalette, useCommands } from './components/CommandPalette';
import { useAppState, useNotifications } from './hooks/useLocalStorage';

type Screen =
  | 'enter-code'
  | 'select-location'
  | 'dashboard'
  | 'workspace'
  | 'find-others'
  | 'housing'
  | 'ai-agent'
  | 'recommended-housing'
  | 'explore'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'favorites'
  | 'checklist'
  | 'budget'
  | 'neighborhood-guide'
  | 'activity-feed'
  | 'calendar';

export default function App() {
  const { state: appState, updateState: updateAppState } = useAppState();
  const { unreadCount: notificationCount } = useNotifications();

  const [currentScreen, setCurrentScreen] = useState<Screen>('enter-code');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyCode, setCompanyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('San Francisco');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    if (appState.hasCompletedOnboarding && appState.backgroundImage) {
      setSelectedCityName(appState.selectedCity);
      setBackgroundImage(appState.backgroundImage);
      setCompanyName(appState.companyName);
      setCompanyCode(appState.companyCode);
      setCurrentScreen('dashboard');
    }
    setIsLoading(false);
  }, []);

  // Keyboard listener for Cmd+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (currentScreen !== 'enter-code' && currentScreen !== 'select-location') {
          setIsCommandPaletteOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  const handleEnterCode = (code: string) => {
    setCompanyCode(code);
    setCompanyName('Google');
    setCurrentScreen('select-location');
  };

  const handleSelectLocation = (locationName: string, imageUrl: string) => {
    console.log('Selected location:', locationName);
    setSelectedCityName(locationName);
    setBackgroundImage(imageUrl);
    setCurrentScreen('dashboard');
    // Save onboarding completion
    updateAppState({
      hasCompletedOnboarding: true,
      selectedCity: locationName,
      backgroundImage: imageUrl,
      companyCode,
      companyName,
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'dashboard':
        setCurrentScreen('dashboard');
        break;
      case 'find-people':
        setCurrentScreen('find-others');
        break;
      case 'housing':
        setCurrentScreen('housing');
        break;
      case 'workspace':
        setCurrentScreen('workspace');
        break;
      case 'explore':
        setCurrentScreen('explore');
        break;
    }
  };

  const handleOpenAI = () => {
    setCurrentScreen('ai-agent');
  };

  const handleFindHousing = () => {
    setCurrentScreen('recommended-housing');
  };

  const handleBackToCode = () => {
    setCurrentScreen('enter-code');
  };

  const handleBackFromAI = () => {
    setCurrentScreen('housing');
  };

  const handleBackFromRecommendations = () => {
    setCurrentScreen('ai-agent');
  };

  const handleOpenProfile = () => {
    setCurrentScreen('profile');
  };

  const handleBackFromProfile = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('profile');
  };

  const handleOpenNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleBackFromNotifications = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenFavorites = () => {
    setCurrentScreen('favorites');
  };

  const handleBackFromFavorites = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenChecklist = () => {
    setCurrentScreen('checklist');
  };

  const handleBackFromChecklist = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenBudget = () => {
    setCurrentScreen('budget');
  };

  const handleBackFromBudget = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenNeighborhoodGuide = () => {
    setCurrentScreen('neighborhood-guide');
  };

  const handleBackFromNeighborhoodGuide = () => {
    setCurrentScreen('explore');
  };

  const handleOpenActivityFeed = () => {
    setCurrentScreen('activity-feed');
  };

  const handleBackFromActivityFeed = () => {
    setCurrentScreen('dashboard');
  };

  const handleOpenCalendar = () => {
    setCurrentScreen('calendar');
  };

  const handleBackFromCalendar = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    updateAppState({
      hasCompletedOnboarding: false,
      companyCode: '',
      companyName: '',
      selectedCity: 'San Francisco',
      backgroundImage: null,
    });
    setCurrentScreen('enter-code');
    setBackgroundImage(null);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearchResultClick = (result: { type: string }) => {
    // Navigate based on result type
    switch (result.type) {
      case 'housing':
        setActiveTab('housing');
        setCurrentScreen('housing');
        break;
      case 'person':
        setActiveTab('find-people');
        setCurrentScreen('find-others');
        break;
      case 'place':
        setActiveTab('explore');
        setCurrentScreen('explore');
        break;
    }
  };

  // Command palette commands (must be after all handlers are defined)
  const commands = useCommands({
    onNavigateDashboard: () => { setActiveTab('dashboard'); setCurrentScreen('dashboard'); },
    onNavigateHousing: () => { setActiveTab('housing'); setCurrentScreen('housing'); },
    onNavigatePeople: () => { setActiveTab('find-people'); setCurrentScreen('find-others'); },
    onNavigateExplore: () => { setActiveTab('explore'); setCurrentScreen('explore'); },
    onNavigateWorkspace: () => { setActiveTab('workspace'); setCurrentScreen('workspace'); },
    onOpenProfile: handleOpenProfile,
    onOpenSettings: handleOpenSettings,
    onOpenNotifications: handleOpenNotifications,
    onOpenSearch: handleOpenSearch,
    onOpenAIAgent: handleOpenAI,
    onOpenChecklist: handleOpenChecklist,
    onOpenBudget: handleOpenBudget,
    onOpenNeighborhoodGuide: handleOpenNeighborhoodGuide,
    onOpenActivityFeed: handleOpenActivityFeed,
    onOpenCalendar: handleOpenCalendar,
  });

  const showTabBar = !['enter-code', 'select-location', 'ai-agent', 'recommended-housing', 'profile', 'settings', 'notifications', 'favorites', 'checklist', 'budget', 'neighborhood-guide', 'activity-feed', 'calendar'].includes(currentScreen);

  // Show loading screen while checking onboarding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Persistent Logo Overlay */}
      {currentScreen !== 'enter-code' && currentScreen !== 'select-location' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
            <img
              src={murgeLogoImage}
              alt="Murge"
              className="h-12 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] opacity-100 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      {/* Dynamic Background Image */}
      {backgroundImage && currentScreen !== 'enter-code' && currentScreen !== 'select-location' && (
        <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
          <img
            src={backgroundImage}
            alt="City Background"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>
      )}

      <div className="w-full mx-auto relative z-10">
        {/* Onboarding Screens */}
        {currentScreen === 'enter-code' && (
          <EnterCodeScreen onContinue={handleEnterCode} />
        )}

        {currentScreen === 'select-location' && (
          <SelectLocationScreen
            companyName={companyName}
            onSelectLocation={handleSelectLocation}
            onBack={handleBackToCode}
          />
        )}

        {/* Global Search Overlay */}
        <GlobalSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onResultClick={handleSearchResultClick}
        />

        {/* Main App Screens */}
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            cityName={selectedCityName}
            onOpenProfile={handleOpenProfile}
            onOpenSearch={handleOpenSearch}
            onOpenNotifications={handleOpenNotifications}
            onOpenChecklist={handleOpenChecklist}
            onOpenBudget={handleOpenBudget}
            onOpenActivityFeed={handleOpenActivityFeed}
          />
        )}

        {currentScreen === 'workspace' && <WorkspaceScreen cityName={selectedCityName} />}

        {currentScreen === 'find-others' && <FindOthersScreen />}

        {currentScreen === 'housing' && (
          <HousingScreen onOpenAI={handleOpenAI} />
        )}

        {currentScreen === 'ai-agent' && (
          <AIAgentScreen onFindHousing={handleFindHousing} onBack={handleBackFromAI} />
        )}

        {currentScreen === 'recommended-housing' && <RecommendedHousingScreen onBack={handleBackFromRecommendations} />}

        {currentScreen === 'profile' && (
          <ProfileScreen
            onBack={handleBackFromProfile}
            onOpenSettings={handleOpenSettings}
            onOpenFavorites={handleOpenFavorites}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen onBack={handleBackFromSettings} onLogout={handleLogout} />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsScreen onBack={handleBackFromNotifications} />
        )}

        {currentScreen === 'favorites' && (
          <FavoritesScreen onBack={handleBackFromFavorites} />
        )}

        {currentScreen === 'explore' && <ExploreScreen onOpenNeighborhoodGuide={handleOpenNeighborhoodGuide} />}

        {currentScreen === 'checklist' && (
          <ChecklistScreen onBack={handleBackFromChecklist} />
        )}

        {currentScreen === 'budget' && (
          <BudgetCalculatorScreen onBack={handleBackFromBudget} />
        )}

        {currentScreen === 'neighborhood-guide' && (
          <NeighborhoodGuideScreen onBack={handleBackFromNeighborhoodGuide} />
        )}

        {currentScreen === 'activity-feed' && (
          <ActivityFeedScreen onBack={handleBackFromActivityFeed} />
        )}

        {currentScreen === 'calendar' && (
          <CalendarScreen onBack={handleBackFromCalendar} />
        )}

        {/* Tab Bar Navigation */}
        {showTabBar && (
          <TabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            badges={{ workspace: notificationCount > 0 ? notificationCount : undefined }}
            onNotificationClick={handleOpenNotifications}
          />
        )}
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />


    </div>
  );
}