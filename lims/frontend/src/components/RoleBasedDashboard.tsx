import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BaseDashboard from './dashboards/BaseDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import SupportDashboard from './dashboards/SupportDashboard';
import TechnicianDashboard from './dashboards/TechnicianDashboard';
import TenantAdminDashboard from './dashboards/TenantAdminDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    
    case 'tenant-admin':
      return <TenantAdminDashboard />;
    
    case 'doctor':
      return <DoctorDashboard />;
    
    case 'technician':
      return <TechnicianDashboard />;
    
    case 'support':
      return <SupportDashboard />;
    
    case 'patient':
      return <PatientDashboard />;
    
    default:
      return <BaseDashboard />;
  }
};

export default RoleBasedDashboard;
