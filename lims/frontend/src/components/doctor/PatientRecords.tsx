import { Calendar, FileText, Plus, Search, User, Users } from "lucide-react";
import React, { useState } from "react";

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const patients = [
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
      lastVisit: "2025-01-15",
      totalRecords: 8,
    },
    {
      id: "P002",
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      email: "sarah.johnson@email.com",
      lastVisit: "2025-01-18",
      totalRecords: 5,
    },
    {
      id: "P003",
      name: "Mike Davis",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 345-6789",
      email: "mike.davis@email.com",
      lastVisit: "2025-01-10",
      totalRecords: 12,
    },
  ];

  const medicalRecords = [
    {
      id: "MR001",
      patientId: "P001",
      date: "2025-01-15",
      type: "Consultation",
      doctor: "Dr. Sarah Johnson",
      diagnosis: "Hypertension",
      treatment: "Prescribed medication and lifestyle changes",
      notes: "Patient shows improvement with current treatment plan",
    },
    {
      id: "MR002",
      patientId: "P001",
      date: "2025-01-10",
      type: "Follow-up",
      doctor: "Dr. Mike Davis",
      diagnosis: "Diabetes Type 2",
      treatment: "Insulin therapy and diet modification",
      notes: "Blood sugar levels stabilizing",
    },
    {
      id: "MR003",
      patientId: "P002",
      date: "2025-01-18",
      type: "Initial Consultation",
      doctor: "Dr. Lisa Wilson",
      diagnosis: "Chest Pain",
      treatment: "Further testing recommended",
      notes: "Patient experiencing chest pain, ordered X-ray",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientRecords = selectedPatient
    ? medicalRecords.filter((record) => record.patientId === selectedPatient)
    : medicalRecords;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Patient Records
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and view patient medical records
            </p>
          </div>
          <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Patients
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedPatient === patient.id
                        ? "bg-primary-50 border-r-2 border-primary-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ID: {patient.id} • {patient.age} years
                        </div>
                        <div className="text-xs text-gray-400">
                          {patient.totalRecords} records
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedPatient
                    ? `Medical Records - ${
                        patients.find((p) => p.id === selectedPatient)?.name
                      }`
                    : "All Medical Records"}
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {patientRecords.length === 0 ? (
                  <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                    {selectedPatient
                      ? "No records found for this patient."
                      : "Select a patient to view their records."}
                  </div>
                ) : (
                  patientRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 sm:p-6 hover:bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {record.type}
                            </span>
                            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">
                              •
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {record.date}
                            </span>
                            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">
                              •
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {record.doctor}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              Diagnosis:{" "}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-900">
                              {record.diagnosis}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              Treatment:{" "}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-900">
                              {record.treatment}
                            </span>
                          </div>
                          {record.notes && (
                            <div className="mb-2">
                              <span className="text-xs sm:text-sm font-medium text-gray-700">
                                Notes:{" "}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-900">
                                {record.notes}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 sm:ml-4">
                          <button className="text-primary-600 hover:text-primary-900 text-xs sm:text-sm font-medium text-left">
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900 text-xs sm:text-sm font-medium text-left">
                            Edit
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm font-medium text-left">
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Patients
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {patients.length}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Records
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {medicalRecords.length}
                </p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {
                    medicalRecords.filter(
                      (r) =>
                        new Date(r.date).getMonth() === new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Avg. Records/Patient
                </p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600">
                  {Math.round(medicalRecords.length / patients.length)}
                </p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
