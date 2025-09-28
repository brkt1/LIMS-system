import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileAction = (action: string) => {
    setIsProfileDropdownOpen(false);
    // Handle different profile actions here
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-gray-50 dark:bg-gray-700"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle size="sm" />

          <NotificationDropdown />

          <LanguageSwitcher />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initial if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">${user?.email?.charAt(0).toUpperCase() || "U"}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.email || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                  {user?.role?.replace("-", " ") || "Role"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 hidden sm:block transition-transform ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role?.replace("-", " ") || "Role"}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleProfileAction("profile")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    {t("nav.profile")}
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    {t("nav.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
