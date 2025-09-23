import { Globe, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface LanguageSwitcherProps {
  size?: "sm" | "md" | "lg";
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ size = "md" }) => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-3",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 ${sizeClasses[size]} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
      >
        <Globe className={iconSizes[size]} />
        <span className="hidden sm:inline">
          {currentLang?.nativeName || currentLang?.name}
        </span>
        <ChevronDown
          className={`${iconSizes[size]} transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLanguage(language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    currentLanguage === language.code
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {language.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
