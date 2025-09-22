import React from "react";
import { useAuth } from "../contexts/AuthContext";
import BaseDashboard from "./dashboards/BaseDashboard";
import DoctorDashboard from "./dashboards/DoctorDashboard";
import PatientDashboard from "./dashboards/PatientDashboard";
import SupportDashboard from "./dashboards/SupportDashboard";
import TechnicianDashboard from "./dashboards/TechnicianDashboard";
import TenantAdminDashboard from "./dashboards/TenantAdminDashboard";
import SuperAdminRouter from "./superadmin/SuperAdminRouter";
import DoctorRouter from "./doctor/DoctorRouter";
import PatientRouter from "./patient/PatientRouter";
import SupportRouter from "./support/SupportRouter";
import TechnicianRouter from "./technician/TechnicianRouter";
import TenantAdminRouter from "./tenantadmin/TenantAdminRouter";

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "superadmin":
      return <SuperAdminRouter />;

    case "tenant-admin":
      return <TenantAdminRouter />;

    case "doctor":
      return <DoctorRouter />;

    case "technician":
      return <TechnicianRouter />;

    case "support":
      return <SupportRouter />;

    case "patient":
      return <PatientRouter />;

    default:
      return <BaseDashboard />;
  }
};

export default RoleBasedDashboard;
