import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UserManagementPage from './pages/UserManagementPage';
import PropertyManagementPage from './pages/PropertyManagementPage';
import VillageManagementPage from './pages/VillageManagementPage';
import UserVillageAssignmentPage from './pages/UserVillageAssignmentPage';
import EmergencyOverridePage from './pages/EmergencyOverridePage';
import { Toaster } from 'sonner';
import './App.css';

// Main App Content with Navigation
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Handle navigation between pages
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Render current page based on navigation state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagementPage onBack={handleBackToDashboard} />;
      case 'villages':
        return <VillageManagementPage onBack={handleBackToDashboard} />;
      case 'user-villages':
        return <UserVillageAssignmentPage onBack={handleBackToDashboard} />;
      case 'emergency-override':
        return <EmergencyOverridePage onBack={handleBackToDashboard} />;
      case 'properties':
        return <PropertyManagementPage onBack={handleBackToDashboard} />;
      case 'financial':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Financial Management</h1>
              <p className="text-gray-600 mb-4">Coming soon in Phase 4...</p>
              <button 
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
              <p className="text-gray-600 mb-4">Coming soon in Phase 4...</p>
              <button 
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">System Settings</h1>
              <p className="text-gray-600 mb-4">Coming soon in Phase 4...</p>
              <button 
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activeItem={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

