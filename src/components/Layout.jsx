import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onSidebarToggle={handleSidebarToggle}
        user={user}
      />

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <main 
        className={`
          transition-all duration-300 ease-in-out mt-16 p-6
          ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </a>
              </li>
            </ol>
          </nav>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

