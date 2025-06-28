import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Circle,
  Palette
} from 'lucide-react';
import { adminAPI, apiHelpers } from '../utils/api';

const StatusManagement = () => {
  const [propertyStatuses, setPropertyStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);

  // Predefined color options
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  const fetchPropertyStatuses = async () => {
    try {
      setError(null);
      const response = await adminAPI.getPropertyStatuses(showInactive);
      const data = apiHelpers.extractData(response) || [];
      setPropertyStatuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching property statuses:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
      setPropertyStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyStatuses();
  }, [showInactive]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredStatuses = propertyStatuses.filter(status =>
    status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (status.description && status.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (status = null) => {
    setEditingStatus(status);
    setFormData(status ? {
      name: status.name,
      description: status.description || '',
      color: status.color || '#3B82F6',
      is_active: status.is_active
    } : {
      name: '',
      description: '',
      color: '#3B82F6',
      is_active: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStatus(null);
    setFormData({ name: '', description: '', color: '#3B82F6', is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStatus) {
        await adminAPI.updatePropertyStatus(editingStatus.id, formData);
      } else {
        await adminAPI.createPropertyStatus(formData);
      }
      
      closeModal();
      fetchPropertyStatuses();
    } catch (err) {
      console.error('Error saving property status:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (status) => {
    try {
      await adminAPI.togglePropertyStatusStatus(status.id);
      fetchPropertyStatuses();
    } catch (err) {
      console.error('Error toggling status:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    }
  };

  const handleDelete = async (status) => {
    if (!window.confirm(`Are you sure you want to delete "${status.name}"?`)) {
      return;
    }

    try {
      await adminAPI.deletePropertyStatus(status.id);
      fetchPropertyStatuses();
    } catch (err) {
      console.error('Error deleting property status:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
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
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchPropertyStatuses}
              className="ml-auto flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Property Status Management</h2>
          <p className="text-gray-600 text-sm">Manage property status options with custom colors</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Status
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search property statuses..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show Inactive
        </label>
        <button
          onClick={fetchPropertyStatuses}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Property Statuses Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredStatuses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStatuses.map((status) => (
                  <tr key={status.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: status.color || '#6B7280' }}
                        ></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {status.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {status.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: status.color || '#6B7280' }}
                        ></div>
                        <span className="text-sm text-gray-600 font-mono">
                          {status.color || '#6B7280'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {status.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          status.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {status.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {status.properties_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(status)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(status)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          disabled={status.properties_count > 0}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Circle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No property statuses found</p>
            <p className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first property status'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Property Status
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStatus ? 'Edit Property Status' : 'Add New Property Status'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Available, Occupied, Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of this status"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <div className="space-y-3">
                  {/* Color Picker */}
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="#3B82F6"
                    />
                  </div>
                  
                  {/* Predefined Colors */}
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-10 h-10 rounded border-2 transition-all ${
                          formData.color === color.value 
                            ? 'border-gray-800 scale-110' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active (available for use)
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {editingStatus ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusManagement;

