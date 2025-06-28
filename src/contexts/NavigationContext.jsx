import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentSection, setCurrentSection] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);

  const navigateTo = (tab, section = null) => {
    // Add current location to history
    if (currentTab !== tab || currentSection !== section) {
      setNavigationHistory(prev => [...prev, { tab: currentTab, section: currentSection }]);
    }
    
    setCurrentTab(tab);
    setCurrentSection(section);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentTab(previous.tab);
      setCurrentSection(previous.section);
    }
  };

  const getCurrentRoute = () => {
    if (currentSection) {
      return `${currentTab}/${currentSection}`;
    }
    return currentTab;
  };

  const isCurrentRoute = (tab, section = null) => {
    return currentTab === tab && currentSection === section;
  };

  const value = {
    currentTab,
    currentSection,
    navigateTo,
    goBack,
    getCurrentRoute,
    isCurrentRoute,
    canGoBack: navigationHistory.length > 0
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;

