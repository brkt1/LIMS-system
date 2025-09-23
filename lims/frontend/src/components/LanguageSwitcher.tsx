import { Globe, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en" as const, name: t("language.english"), flag: "🇺🇸" },
    { code: "om" as const, name: t("language.oromo"), flag: "🇪🇹" },
    { code: "am" as const, name: t("language.amharic"), flag: "🇪🇹" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: "en" | "om" | "am") => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span className="hidden xs:inline">
            {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
          </span>
          <span className="xs:hidden">{currentLanguage?.flag}</span>
        </span>
        <ChevronDown
          className={`w-2 h-2 sm:w-3 sm:h-3 text-gray-400 dark:text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t("common.select")} {t("profile.language")}
            </h3>
          </div>

          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                  language === lang.code
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {language === lang.code && (
                  <span className="text-primary-600 dark:text-primary-400">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
