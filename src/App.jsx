import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import LoginForm from './components/LoginForm';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PropertyTypesManagement from './pages/PropertyTypesManagement';
import StatusManagement from './pages/StatusManagement';
import PropertiesManagement from './pages/PropertiesManagement';

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTab, currentSection } = useNavigation();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Render different components based on current navigation
  const renderContent = () => {
    if (currentTab === 'dashboard') {
      return <Dashboard />;
    } else if (currentTab === 'properties') {
      return <PropertiesManagement />;
    } else if (currentTab === 'admin') {
      if (currentSection === 'property-types') {
        return <PropertyTypesManagement />;
      } else if (currentSection === 'status-management') {
        return <StatusManagement />;
      }
      return <div className="p-6">Admin page coming soon...</div>;
    }
    return <Dashboard />;
  };

  return (
    <MainLayout currentUser={user} onLogout={logout}>
      {renderContent()}
    </MainLayout>
  );
}

function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}

export default App;

