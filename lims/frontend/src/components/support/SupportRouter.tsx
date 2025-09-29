import React from "react";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "../common/ErrorBoundary";
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
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<SupportDashboard />} />
        <Route path="/dashboard" element={<SupportDashboard />} />
        <Route path="/support-tickets" element={<SupportTickets />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route
          path="/inventory"
          element={
            <ErrorBoundary
              fallback={
                <div className="p-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                      Inventory Error
                    </h3>
                    <p className="text-red-600 dark:text-red-300">
                      There was an error loading the inventory component. Please
                      try refreshing the page.
                    </p>
                  </div>
                </div>
              }
            >
              <Inventory />
            </ErrorBoundary>
          }
        />
        <Route path="/messages" element={<Messages />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/system-logs" element={<SystemLogs />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default SupportRouter;
