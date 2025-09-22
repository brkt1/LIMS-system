import React from "react";
import { Route, Routes } from "react-router-dom";
import PatientDashboard from "../dashboards/PatientDashboard";
import Appointments from "./Appointments";
import FAQ from "./FAQ";
import Help from "./Help";
import Profile from "./Profile";
import Support from "./Support";
import TestResults from "./TestResults";

const PatientRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientDashboard />} />
      <Route path="/dashboard" element={<PatientDashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/test-results" element={<TestResults />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/support" element={<Support />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  );
};

export default PatientRouter;
