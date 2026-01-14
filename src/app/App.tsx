import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'sonner';
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
import { TabBar } from './components/TabBar';
import { GlobalSearch } from './components/GlobalSearch';
import { CommandPalette, useCommands } from './components/CommandPalette';
import { OnboardingTour, useTour } from './components/OnboardingTour';
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
  | 'neighborhood-guide';

export default function App() {
  const { state: appState, updateState: updateAppState } = useAppState();
  const { unreadCount: notificationCount } = useNotifications();
  const { showTour, completeTour, hasSeenTour } = useTour();

  const [currentScreen, setCurrentScreen] = useState<Screen>('enter-code');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyCode, setCompanyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('San Francisco');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);

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

  const showTabBar = !['enter-code', 'select-location', 'ai-agent', 'recommended-housing', 'profile', 'settings', 'notifications', 'favorites'].includes(currentScreen);

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

        {currentScreen === 'explore' && <ExploreScreen />}

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

      {/* Quick Navigation Helper (for demo purposes) */}
      {currentScreen !== 'enter-code' && currentScreen !== 'select-location' && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs max-w-xs z-50 hidden lg:block">
          <div className="font-medium text-gray-900 mb-2">Quick Nav:</div>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentScreen('find-others')}
              className="block w-full text-left text-gray-600 hover:text-black"
            >
              → Find Others
            </button>
            <button
              onClick={() => setCurrentScreen('ai-agent')}
              className="block w-full text-left text-gray-600 hover:text-black"
            >
              → AI Agent
            </button>
            <button
              onClick={() => setCurrentScreen('recommended-housing')}
              className="block w-full text-left text-gray-600 hover:text-black"
            >
              → Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
  );
}