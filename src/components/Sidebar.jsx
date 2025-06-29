import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Building, 
  DollarSign, 
  BarChart, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
    { id: 'users', label: 'Users Management', icon: Users, href: '/users' },
    { id: 'properties', label: 'Property Management', icon: Building, href: '/properties' },
    { id: 'financial', label: 'Financial Management', icon: DollarSign, href: '/financial' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart, href: '/reports' },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/help' },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  const MenuItem = ({ item, isActive, isBottom = false }) => {
    const Icon = item.icon;
    return (
      <a
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          handleItemClick(item.id);
        }}
        className={`
          flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105
          ${isActive 
            ? 'bg-blue-50 text-blue-700' 
            : isBottom 
              ? 'text-gray-700 hover:bg-gray-50' 
              : 'text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Icon className={`text-lg w-5 h-5 ${isActive ? 'text-blue-700' : ''}`} />
        <span 
          className={`
            menu-text font-medium transition-opacity duration-200
            ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
          `}
        >
          {item.label}
        </span>
      </a>
    );
  };

  return (
    <aside 
      className={`
        fixed left-0 top-16 bottom-0 z-40 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="p-4">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={activeItem === item.id}
            />
          ))}

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {bottomMenuItems.map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isActive={activeItem === item.id}
              isBottom={true}
            />
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <button 
          className={`
            flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200 hover:scale-105
          `}
          onClick={() => {
            // Handle logout
            console.log('Logout clicked');
          }}
        >
          <LogOut className="text-lg w-5 h-5" />
          <span 
            className={`
              menu-text transition-opacity duration-200
              ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
            `}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

