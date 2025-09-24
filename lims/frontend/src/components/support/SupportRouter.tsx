import React from "react";
import { Route, Routes } from "react-router-dom";
import SupportDashboard from "../dashboards/SupportDashboard";
import FAQ from "./FAQ";
import Inventory from "./Inventory";
import KnowledgeBase from "./KnowledgeBase";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Reports from "./Reports";
import SupportTickets from "./SupportTickets";
import SystemLogs from "./SystemLogs";
import UserManagement from "./UserManagement";

const SupportRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SupportDashboard />} />
      <Route path="/dashboard" element={<SupportDashboard />} />
      <Route path="/support-tickets" element={<SupportTickets />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/knowledge-base" element={<KnowledgeBase />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/system-logs" element={<SystemLogs />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default SupportRouter;
