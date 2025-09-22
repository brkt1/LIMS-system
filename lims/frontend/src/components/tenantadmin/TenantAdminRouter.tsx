import React from "react";
import { Route, Routes } from "react-router-dom";
import TenantAdminDashboard from "../dashboards/TenantAdminDashboard";
import Accounting from "./Accounting";
import Analytics from "./Analytics";
import BranchManagement from "./BranchManagement";
import ContractManagement from "./ContractManagement";
import CulturesAntibiotics from "./CulturesAntibiotics";
import DoctorsManagement from "./DoctorsManagement";
import Equipment from "./Equipment";
import HomeVisitRequests from "./HomeVisitRequests";
import HomeVisitSchedule from "./HomeVisitSchedule";
import InventoryManagement from "./InventoryManagement";
import ManageTests from "./ManageTests";
import PatientManagement from "./PatientManagement";
import ReceiptsPrinting from "./ReceiptsPrinting";
import TenantSettings from "./TenantSettings";
import TestPricing from "./TestPricing";
import TestReports from "./TestReports";
import UserManagement from "./UserManagement";

const TenantAdminRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TenantAdminDashboard />} />
      <Route path="/dashboard" element={<TenantAdminDashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/settings" element={<TenantSettings />} />
      <Route path="/inventory" element={<InventoryManagement />} />
      <Route path="/manage-tests" element={<ManageTests />} />
      <Route path="/cultures-antibiotics" element={<CulturesAntibiotics />} />
      <Route path="/test-pricing" element={<TestPricing />} />
      <Route path="/doctors" element={<DoctorsManagement />} />
      <Route path="/patients" element={<PatientManagement />} />
      <Route path="/test-reports" element={<TestReports />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/receipts" element={<ReceiptsPrinting />} />
      <Route path="/home-visit-requests" element={<HomeVisitRequests />} />
      <Route path="/home-visit-schedule" element={<HomeVisitSchedule />} />
      <Route path="/branches" element={<BranchManagement />} />
      <Route path="/contracts" element={<ContractManagement />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/equipment" element={<Equipment />} />
    </Routes>
  );
};

export default TenantAdminRouter;
