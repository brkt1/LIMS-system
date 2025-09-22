import { Bell, ChevronDown, Globe, LogOut, Menu } from "lucide-react";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors bg-gray-50"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div className="hidden sm:flex items-center space-x-2">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">EN</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {user?.role?.replace("-", " ") || "Role"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-1 sm:space-x-2 bg-red-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
