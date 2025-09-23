import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const LocalizationDemo: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("common.welcome")} - LIMS
            </h1>
            <LanguageSwitcher size="md" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {t("common.subtitle")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Current Language: {currentLanguage}
          </p>
        </div>

        {/* Navigation Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("navigation.mainMenu")}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {t("common.dashboard")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {t("navigation.manageTenants")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {t("navigation.createTenants")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("dashboard.title")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  24
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("dashboard.totalTenants")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  1,247
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t("dashboard.systemUsers")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("roles.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {t("roles.superadmin")}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm font-medium text-green-800 dark:text-green-300">
                {t("roles.tenantAdmin")}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
                {t("roles.doctor")}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                {t("roles.technician")}
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm font-medium text-red-800 dark:text-red-300">
                {t("roles.support")}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-300">
                {t("roles.patient")}
              </div>
            </div>
          </div>
        </div>

        {/* Medical Terms Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("medicalTerms.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t("doctors.specialty")}
              </h3>
              <div className="space-y-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("doctors.cardiology")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("doctors.neurology")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("doctors.pediatrics")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("doctors.orthopedics")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("doctors.dermatology")}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t("testRequests.testType")}
              </h3>
              <div className="space-y-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("testRequests.bloodPanelComplete")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("testRequests.xrayChest")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("testRequests.mriBrain")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  • {t("testRequests.urineAnalysis")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationDemo;
