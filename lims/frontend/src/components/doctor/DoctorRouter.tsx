import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorDashboard from "../dashboards/DoctorDashboard";
import Appointments from "./Appointments";
import Messages from "./Messages";
import PatientRecords from "./PatientRecords";
import Patients from "./Patients";
import TestRequests from "./TestRequests";
import TestResults from "./TestResults";
import Profile from "../superadmin/Profile";

const DoctorRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DoctorDashboard />} />
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/test-requests" element={<TestRequests />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/test-results" element={<TestResults />} />
      <Route path="/patient-records" element={<PatientRecords />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default DoctorRouter;
