import React from "react";
import { Route, Routes } from "react-router-dom";
import TechnicianDashboard from "../dashboards/TechnicianDashboard";
import AcceptSamples from "./AcceptSamples";
import Calibrations from "./Calibrations";
import Equipment from "./Equipment";
import Maintenance from "./Maintenance";
import Samples from "./Samples";
import TestReports from "./TestReports";

const TechnicianRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TechnicianDashboard />} />
      <Route path="/dashboard" element={<TechnicianDashboard />} />
      <Route path="/samples" element={<Samples />} />
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/test-reports" element={<TestReports />} />
      <Route path="/accept-samples" element={<AcceptSamples />} />
      <Route path="/calibrations" element={<Calibrations />} />
      <Route path="/maintenance" element={<Maintenance />} />
    </Routes>
  );
};

export default TechnicianRouter;
