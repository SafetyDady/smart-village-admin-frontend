import React, { useState } from 'react';
import { Menu, X, User, Bell, ChevronDown } from 'lucide-react';

const FixedHeader = ({ currentUser, onLogout, activeTab = 'dashboard', onTabChange }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', active: true },
    { id: 'properties', label: 'Properties', active: true },
    { id: 'reports', label: 'Reports', active: false, disabled: true },
    { id: 'settings', label: 'Settings', active: false, disabled: true }
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">Smart Village</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-2xl">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap relative
                ${activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed opacity-60'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="hidden lg:flex items-center gap-3 min-w-[200px] justify-end">
          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors">
            <Bell size={20} />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {currentUser?.first_name || 'SuperAdmin'}
              </span>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile User Profile */}
        <div className="lg:hidden">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <nav className="px-6 py-4 space-y-2">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && handleTabClick(tab.id)}
                disabled={tab.disabled}
                className={`
                  w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed opacity-60'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default FixedHeader;

