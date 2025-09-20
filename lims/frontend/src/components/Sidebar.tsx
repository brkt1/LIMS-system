import {
  BarChart3,
  ChevronDown,
  CreditCard,
  FileText,
  Grid3X3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users
} from 'lucide-react';
import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    {
      title: 'MAIN MENU',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Package, label: 'Products' },
        { icon: Grid3X3, label: 'Categories' },
      ]
    },
    {
      title: 'LEADS',
      items: [
        { icon: ShoppingCart, label: 'Orders' },
        { icon: BarChart3, label: 'Sales' },
        { icon: Users, label: 'Customers' },
      ]
    },
    {
      title: 'COMMS',
      items: [
        { icon: CreditCard, label: 'Payments' },
        { icon: FileText, label: 'Reports' },
        { icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">+</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold text-gray-800">LIMS</span>
          )}
        </div>

        <nav className="space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center justify-between mb-3">
                {isOpen && (
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </span>
                )}
                {isOpen && <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        item.active
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {isOpen && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
