import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Wrench, 
  Users, 
  Plus, 
  Settings, 
  FileText,
  RefreshCw,
  AlertCircle,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react';
import { propertyAPI, adminAPI, apiHelpers } from '../utils/api';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch statistics and recent properties in parallel
      const [statsResponse, recentResponse] = await Promise.all([
        propertyAPI.getStatistics(),
        propertyAPI.getRecentProperties()
      ]);

      const stats = apiHelpers.extractData(statsResponse);
      const recent = apiHelpers.extractData(recentResponse);

      if (stats) {
        setStatistics(stats);
      }

      if (recent && Array.isArray(recent)) {
        setRecentProperties(recent);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ icon: Icon, label, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-3 w-full p-4 rounded-lg border transition-all
        ${disabled
          ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
          : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
        }
      `}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-200 h-96 rounded-lg"></div>
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <p className="text-red-800 font-medium">Error loading dashboard</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="ml-auto flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Properties"
          value={statistics.total}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Available"
          value={statistics.available}
          icon={Home}
          color="green"
        />
        <StatCard
          title="Occupied"
          value={statistics.occupied}
          icon={Users}
          color="gray"
        />
        <StatCard
          title="Maintenance"
          value={statistics.maintenance}
          icon={Wrench}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
                <button
                  onClick={fetchDashboardData}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentProperties.length > 0 ? (
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div key={property.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Home size={16} className="text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {property.property_type?.name || 'Unknown Type'}
                          </h4>
                          <span
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${property.property_status?.color || '#6B7280'}20`,
                              color: property.property_status?.color || '#6B7280'
                            }}
                          >
                            {property.property_status?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="truncate">{property.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(property.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Home size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No properties yet</p>
                  <p className="text-sm">Properties will appear here once you add them</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <QuickActionButton
                icon={Plus}
                label="Add New Property"
                onClick={() => console.log('Add property')}
              />
              <QuickActionButton
                icon={Settings}
                label="Manage Property Types"
                onClick={() => console.log('Manage types')}
              />
              <QuickActionButton
                icon={FileText}
                label="View Reports"
                onClick={() => console.log('View reports')}
                disabled={true}
              />
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Healthy</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Running</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

