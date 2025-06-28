import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  Users, 
  ChevronRight,
  ChevronDown,
  Tag,
  Circle
} from 'lucide-react';

const FixedSidebar = ({ activeTab = 'dashboard', activeSection = null, onNavigate }) => {
  const [expandedSections, setExpandedSections] = useState(['admin']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigation = (tab, section = null) => {
    if (onNavigate) {
      onNavigate(tab, section);
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: true,
      onClick: () => handleNavigation('dashboard')
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building2,
      active: true,
      onClick: () => handleNavigation('properties')
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      active: true,
      expandable: true,
      expanded: expandedSections.includes('admin'),
      onToggle: () => toggleSection('admin'),
      children: [
        {
          id: 'property-types',
          label: 'Property Types',
          icon: Tag,
          active: true,
          onClick: () => handleNavigation('admin', 'property-types')
        },
        {
          id: 'status-management',
          label: 'Status Management',
          icon: Circle,
          active: true,
          onClick: () => handleNavigation('admin', 'status-management')
        },
        {
          id: 'user-management',
          label: 'User Management',
          icon: Users,
          active: false,
          disabled: true
        },
        {
          id: 'system-settings',
          label: 'System Settings',
          icon: Settings,
          active: false,
          disabled: true
        }
      ]
    }
  ];

  const isActive = (item, section = null) => {
    if (section) {
      return activeTab === 'admin' && activeSection === item.id;
    }
    return activeTab === item.id;
  };

  const renderNavItem = (item, isChild = false) => {
    const Icon = item.icon;
    const active = isActive(item, isChild);
    
    return (
      <div key={item.id}>
        <button
          onClick={item.expandable ? item.onToggle : item.onClick}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
            ${isChild ? 'ml-4 pl-8' : ''}
            ${active
              ? 'bg-blue-600 text-white shadow-md'
              : item.disabled
              ? 'text-gray-400 cursor-not-allowed opacity-60'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          <Icon size={20} className="flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.expandable && (
            <ChevronRight 
              size={16} 
              className={`transition-transform ${item.expanded ? 'rotate-90' : ''}`}
            />
          )}
        </button>

        {/* Render children if expanded */}
        {item.expandable && item.expanded && item.children && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-slate-800 overflow-y-auto z-40">
      <div className="p-6">
        {/* User Profile Section */}
        <div className="mb-8 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">SA</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">SuperAdmin</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>

        {/* Future Sections Placeholder */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Coming Soon</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-500 opacity-50">
              <Users size={20} />
              <span>Reports</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-500 opacity-50">
              <Settings size={20} />
              <span>Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FixedSidebar;

