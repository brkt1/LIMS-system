import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ChartsSection from '../ChartsSection';
import DashboardCards from '../DashboardCards';
import RecentDataTable from '../RecentDataTable';

interface BaseDashboardProps {
  children?: React.ReactNode;
}

const BaseDashboard: React.FC<BaseDashboardProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) return null;

  const getWelcomeMessage = () => {
    const roleNames = {
      'superadmin': 'Super Administrator',
      'tenant-admin': 'Tenant Administrator',
      'doctor': 'Doctor',
      'technician': 'Technician',
      'support': 'Support Staff',
      'patient': 'Patient'
    };

    return `Welcome ${roleNames[user.role]}!`;
  };

  const getDashboardDescription = () => {
    const descriptions = {
      'superadmin': 'Manage the entire LIMS system, tenants, and global analytics',
      'tenant-admin': 'Manage your tenant organization, users, and operations',
      'doctor': 'Manage patient care, test requests, and appointments',
      'technician': 'Process samples, manage equipment, and create test reports',
      'support': 'Handle support tickets, manage inventory, and assist users',
      'patient': 'View your appointments, test results, and manage your profile'
    };

    return descriptions[user.role];
  };

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
        <p className="text-gray-600 mt-2">{getDashboardDescription()}</p>
      </div>

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
  );
};

export default BaseDashboard;
