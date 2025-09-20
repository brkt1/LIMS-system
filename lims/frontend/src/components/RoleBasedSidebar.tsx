import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calculator,
  Calendar,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Grid3X3,
  Headphones,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Microscope,
  Monitor,
  Package,
  Plus,
  Printer,
  Receipt,
  Settings,
  ShoppingCart,
  Stethoscope,
  TestTube,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wrench
} from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_NAVIGATION } from '../types/auth';

interface RoleBasedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingCart,
  BarChart3,
  Users,
  CreditCard,
  FileText,
  Settings,
  Building2,
  Calendar,
  TestTube,
  Wrench,
  ClipboardList,
  Headphones,
  Bell,
  BookOpen,
  HelpCircle,
  MessageSquare,
  User,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Database,
  DollarSign,
  Monitor,
  Plus,
  Stethoscope,
  Microscope,
  Calculator,
  UserCheck,
  UserPlus,
  Printer,
  CalendarIcon: Calendar,
  MapPin,
  FileContract: FileText,
  Receipt,
};

const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ isOpen }) => {
  const { user, hasPermission } = useAuth();

  if (!user) return null;

  const navigation = ROLE_NAVIGATION[user.role] || [];

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
            <div>
              <span className="text-xl font-bold text-gray-800">LIMS</span>
              <div className="text-xs text-gray-500 capitalize">{user.role.replace('-', ' ')}</div>
            </div>
          )}
        </div>

        <nav className="space-y-6">
          {navigation.map((section, sectionIndex) => (
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
                {section.items.map((item, itemIndex) => {
                  // Check if user has permission for this item
                  if (item.permission && !hasPermission(item.permission)) {
                    return null;
                  }

                  const IconComponent = iconMap[item.icon] || LayoutDashboard;
                  const isActive = window.location.pathname === item.path;

                  return (
                    <li key={itemIndex}>
                      <button
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          // In a real app, you'd use React Router here
                          console.log(`Navigate to ${item.path}`);
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                        {isOpen && (
                          <span className="text-sm font-medium">{item.label}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

      </div>
    </div>
  );
};

export default RoleBasedSidebar;
