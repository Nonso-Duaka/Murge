import React, { useState } from 'react';
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
import { TabBar } from './components/TabBar';

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
  | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('enter-code');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companyCode, setCompanyCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('San Francisco');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

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
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'dashboard':
        setCurrentScreen('dashboard');
        break;
      case 'workspace':
        setCurrentScreen('workspace');
        break;
      case 'housing':
        setCurrentScreen('housing');
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

  const showTabBar = !['enter-code', 'select-location', 'ai-agent', 'recommended-housing', 'profile'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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

        {/* Main App Screens */}
        {currentScreen === 'dashboard' && <DashboardScreen cityName={selectedCityName} onOpenProfile={handleOpenProfile} />}

        {currentScreen === 'workspace' && <WorkspaceScreen cityName={selectedCityName} />}

        {currentScreen === 'find-others' && <FindOthersScreen />}

        {currentScreen === 'housing' && (
          <HousingScreen onOpenAI={handleOpenAI} />
        )}

        {currentScreen === 'ai-agent' && (
          <AIAgentScreen onFindHousing={handleFindHousing} onBack={handleBackFromAI} />
        )}

        {currentScreen === 'recommended-housing' && <RecommendedHousingScreen onBack={handleBackFromRecommendations} />}

        {currentScreen === 'profile' && <ProfileScreen onBack={handleBackFromProfile} />}

        {currentScreen === 'explore' && <ExploreScreen />}

        {/* Tab Bar Navigation */}
        {showTabBar && (
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
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