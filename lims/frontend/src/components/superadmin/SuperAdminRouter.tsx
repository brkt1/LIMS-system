import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "../dashboards/SuperAdminDashboard";
import AdminManagement from "./AdminManagement";
import AllTenants from "./AllTenants";
import BackupDatabase from "./BackupDatabase";
import BillingPlans from "./BillingPlans";
import CreateTenants from "./CreateTenants";
import GlobalNotification from "./GlobalNotification";
import ManageTenants from "./ManageTenants";
import MonitorUsers from "./MonitorUsers";
import Profile from "./Profile";
import SystemLogs from "./SystemLogs";
import UsageAnalysis from "./UsageAnalysis";

const SuperAdminRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard />} />
      <Route path="/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/manage-tenants" element={<ManageTenants />} />
      <Route path="/create-tenants" element={<CreateTenants />} />
      <Route path="/all-tenants" element={<AllTenants />} />
      <Route path="/usage-analysis" element={<UsageAnalysis />} />
      <Route path="/billing-plans" element={<BillingPlans />} />
      <Route path="/admin-management" element={<AdminManagement />} />
      <Route path="/system-logs" element={<SystemLogs />} />
      <Route path="/global-notification" element={<GlobalNotification />} />
      <Route path="/monitor-users" element={<MonitorUsers />} />
      <Route path="/backup-database" element={<BackupDatabase />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default SuperAdminRouter;
