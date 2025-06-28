import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  RefreshCw,
  Home,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { propertyAPI, apiHelpers } from '../utils/api';

const PropertiesManagement = () => {
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [propertyStatuses, setPropertyStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    property_type_id: '',
    property_status_id: '',
    bedrooms: 1,
    bathrooms: 1,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });

  const fetchProperties = async (page = 1) => {
    try {
      setError(null);
      const params = {
        page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        type: filterType || undefined,
        status: filterStatus || undefined
      };

      const response = await propertyAPI.getProperties(params);
      const data = apiHelpers.extractData(response);
      
      if (data && data.properties) {
        setProperties(data.properties);
        setPagination({
          page: data.page,
          per_page: data.per_page,
          total: data.total,
          pages: data.pages
        });
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [typesResponse, statusesResponse] = await Promise.all([
        propertyAPI.getPropertyTypes(),
        propertyAPI.getPropertyStatuses()
      ]);

      const types = apiHelpers.extractData(typesResponse) || [];
      const statuses = apiHelpers.extractData(statusesResponse) || [];

      setPropertyTypes(Array.isArray(types) ? types : []);
      setPropertyStatuses(Array.isArray(statuses) ? statuses : []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchProperties(1);
  }, [searchTerm, filterType, filterStatus]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (newPage) => {
    fetchProperties(newPage);
  };

  const openModal = (property = null) => {
    setEditingProperty(property);
    setFormData(property ? {
      address: property.address,
      property_type_id: property.property_type_id,
      property_status_id: property.property_status_id,
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      description: property.description || ''
    } : {
      address: '',
      property_type_id: '',
      property_status_id: '',
      bedrooms: 1,
      bathrooms: 1,
      description: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setFormData({
      address: '',
      property_type_id: '',
      property_status_id: '',
      bedrooms: 1,
      bathrooms: 1,
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty.id, formData);
      } else {
        await propertyAPI.createProperty(formData);
      }
      
      closeModal();
      fetchProperties(pagination.page);
    } catch (err) {
      console.error('Error saving property:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (property) => {
    if (!window.confirm(`Are you sure you want to delete property at "${property.address}"?`)) {
      return;
    }

    try {
      await propertyAPI.deleteProperty(property.id);
      fetchProperties(pagination.page);
    } catch (err) {
      console.error('Error deleting property:', err);
      const errorInfo = apiHelpers.handleError(err);
      setError(errorInfo.message);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#6B7280';
    return status.color || '#6B7280';
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const color = status.color || '#6B7280';
    // Convert hex to RGB for background opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `text-gray-800`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
              onClick={() => fetchProperties(pagination.page)}
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
          <h2 className="text-2xl font-semibold text-gray-900">Properties Management</h2>
          <p className="text-gray-600 text-sm">Manage all properties in the system</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Property
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Types</option>
          {propertyTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          {propertyStatuses.map(status => (
            <option key={status.id} value={status.id}>{status.name}</option>
          ))}
        </select>

        <button
          onClick={() => fetchProperties(pagination.page)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Properties Grid */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Home size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {property.property_type?.name || 'Unknown Type'}
                        </h3>
                        <p className="text-xs text-gray-500">ID: {property.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(property)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(property)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span className="truncate">{property.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{property.bedrooms || 0} bed</span>
                      <span>{property.bathrooms || 0} bath</span>
                    </div>

                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(property.property_status)}`}
                      style={{
                        backgroundColor: `${getStatusColor(property.property_status)}20`,
                        color: getStatusColor(property.property_status)
                      }}
                    >
                      {property.property_status?.name || 'Unknown'}
                    </span>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(property.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded ${
                              page === pagination.page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Home size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No properties found</p>
            <p className="text-sm">
              {searchTerm || filterType || filterStatus ? 'Try adjusting your search or filters' : 'Get started by adding your first property'}
            </p>
            {!searchTerm && !filterType && !filterStatus && (
              <button
                onClick={() => openModal()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Property
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 123 Main Street, City"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    required
                    value={formData.property_type_id}
                    onChange={(e) => setFormData({ ...formData, property_type_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.filter(type => type.is_active).map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.property_status_id}
                    onChange={(e) => setFormData({ ...formData, property_status_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {propertyStatuses.filter(status => status.is_active).map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                  placeholder="Additional details about the property"
                />
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
                  {editingProperty ? 'Update' : 'Create'}
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

export default PropertiesManagement;

