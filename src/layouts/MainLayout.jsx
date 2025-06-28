import React from 'react';
import FixedHeader from '../components/FixedHeader';
import FixedSidebar from '../components/FixedSidebar';
import { useNavigation } from '../contexts/NavigationContext';

const MainLayout = ({ children, currentUser, onLogout }) => {
  const { currentTab, currentSection, navigateTo } = useNavigation();

  const handleTabChange = (tab) => {
    navigateTo(tab);
  };

  const handleNavigation = (tab, section = null) => {
    navigateTo(tab, section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <FixedHeader
        currentUser={currentUser}
        onLogout={onLogout}
        activeTab={currentTab}
        onTabChange={handleTabChange}
      />

      {/* Fixed Sidebar */}
      <FixedSidebar
        activeTab={currentTab}
        activeSection={currentSection}
        onNavigate={handleNavigation}
      />

      {/* Main Content Area */}
      <main className="ml-72 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                  {currentSection ? currentSection.replace('-', ' ') : currentTab}
                </h1>
                <nav className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span className="capitalize">{currentTab}</span>
                  {currentSection && (
                    <>
                      <span>/</span>
                      <span className="capitalize">{currentSection.replace('-', ' ')}</span>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-30 hidden" id="mobile-overlay" />
    </div>
  );
};

export default MainLayout;

