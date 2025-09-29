import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import ChartsSection from "../ChartsSection";
import DashboardCards from "../DashboardCards";
import RecentDataTable from "../RecentDataTable";

interface BaseDashboardProps {
  children?: React.ReactNode;
}

const BaseDashboard: React.FC<BaseDashboardProps> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const getWelcomeMessage = () => {
    if (user.role === "superadmin") {
      return t("superadmin.welcome");
    }

    if (user.role === "tenant-admin") {
      return t("tenantAdmin.welcome");
    }

    if (user.role === "doctor") {
      return t("doctor.welcome");
    }

    if (user.role === "technician") {
      return t("technician.welcome");
    }

    if (user.role === "support") {
      return t("support.welcome");
    }

    if (user.role === "patient") {
      return t("patient.welcome");
    }

    return `Welcome ${user.role}!`;
  };

  const getDashboardDescription = () => {
    if (user.role === "superadmin") {
      return t("superadmin.description");
    }

    if (user.role === "tenant-admin") {
      return t("tenantAdmin.description");
    }

    if (user.role === "doctor") {
      return t("doctor.description");
    }

    if (user.role === "technician") {
      return t("technician.description");
    }

    if (user.role === "support") {
      return t("support.description");
    }

    if (user.role === "patient") {
      return t("patient.description");
    }

    return `Manage your ${user.role} activities`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Welcome Message */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {getWelcomeMessage()}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-4xl mx-auto sm:mx-0">
            {getDashboardDescription()}
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Role-specific content */}
        {children || (
          <>
            {/* Default dashboard cards */}
            <DashboardCards />

            {/* Charts section */}
            <ChartsSection />

            {/* Recent data table */}
            <RecentDataTable />
          </>
        )}
      </div>
    </div>
  );
};

export default BaseDashboard;
