import {
  Calendar,
  FileText,
  Plus,
  Search,
  User,
  Users,
  Eye,
  Edit,
  Printer,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { patientAPI, testRequestAPI } from "../../services/api";

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // State for modals and CRUD operations
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Patients data with state management
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);
  const [testRequests, setTestRequests] = useState<any[]>([]);

  // Fetch patients and test requests from backend
  const fetchPatientRecords = async () => {
    setPatientsLoading(true);
    setPatientsError(null);
    try {
      const [patientsResponse, testRequestsResponse] = await Promise.all([
        patientAPI.getAll(),
        testRequestAPI.getAll(),
      ]);

      console.log("🔍 Patient records fetched:", patientsResponse.data);
      console.log("🔍 Test requests fetched:", testRequestsResponse.data);

      setPatients(patientsResponse.data);
      setTestRequests(testRequestsResponse.data);
    } catch (err: any) {
      console.error("Error fetching patient records:", err);
      setPatientsError(err.message || "Failed to fetch patient records");
    } finally {
      setPatientsLoading(false);
    }
  };

  // Load patient records on component mount
  useEffect(() => {
    fetchPatientRecords();
  }, []);

  // Medical records data with state management
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  // Transform test requests into medical records format
  useEffect(() => {
    if (testRequests.length > 0) {
      const records = testRequests.map((request: any) => ({
        id: `MR${request.id}`,
        patientId: request.patient_id,
        date: request.date_requested,
        type: "Test Request",
        doctor: "Dr. Current Doctor",
        diagnosis: request.test_type,
        treatment: request.status,
        notes: request.notes || "No notes available",
      }));
      setMedicalRecords(records);
    }
  }, [testRequests]);

  // CRUD operation functions
  const handleAddRecord = () => {
    setShowAddRecordModal(true);
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handlePrintRecord = (record: any) => {
    // Create printable content
    const printContent = `
      <html>
        <head>
          <title>Medical Record - ${record.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            .value { margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Record</h1>
            <p>Record ID: ${record.id}</p>
          </div>
          <div class="section">
            <span class="label">Date:</span>
            <span class="value">${record.date}</span>
          </div>
          <div class="section">
            <span class="label">Type:</span>
            <span class="value">${record.type}</span>
          </div>
          <div class="section">
            <span class="label">Doctor:</span>
            <span class="value">${record.doctor}</span>
          </div>
          <div class="section">
            <span class="label">Diagnosis:</span>
            <span class="value">${record.diagnosis}</span>
          </div>
          <div class="section">
            <span class="label">Treatment:</span>
            <span class="value">${record.treatment}</span>
          </div>
          <div class="section">
            <span class="label">Notes:</span>
            <span class="value">${record.notes}</span>
          </div>
        </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCreateRecord = (newRecord: any) => {
    const record = {
      id: `MR${String(medicalRecords.length + 1).padStart(3, "0")}`,
      ...newRecord,
    };
    setMedicalRecords([...medicalRecords, record]);
    setShowAddRecordModal(false);
  };

  const handleUpdateRecord = (recordId: string, updatedData: any) => {
    setMedicalRecords(
      medicalRecords.map((r) =>
        r.id === recordId ? { ...r, ...updatedData } : r
      )
    );
    setShowEditModal(false);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const patientRecords = selectedPatient
    ? medicalRecords.filter((record) => record.patientId === selectedPatient)
    : medicalRecords;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Patient Records
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage and view patient medical records
            </p>
          </div>
          <button
            onClick={handleAddRecord}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Patients
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {patientsLoading ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading patients...
                  </div>
                ) : patientsError ? (
                  <div className="p-4 text-center text-red-500 dark:text-red-400">
                    Error: {patientsError}
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No patients found.
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient.id)}
                      className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedPatient === patient.id
                          ? "bg-primary-50 dark:bg-primary-900 border-r-2 border-primary-600 dark:border-primary-400"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            ID: {patient.patient_id} • {patient.age} years
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {
                              medicalRecords.filter(
                                (r) => r.patientId === patient.patient_id
                              ).length
                            }{" "}
                            records
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPatient
                    ? `Medical Records - ${
                        patients.find((p) => p.id === selectedPatient)?.name
                      }`
                    : "All Medical Records"}
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {patientRecords.length === 0 ? (
                  <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    {selectedPatient
                      ? "No records found for this patient."
                      : "Select a patient to view their records."}
                  </div>
                ) : (
                  patientRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {record.type}
                            </span>
                            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              •
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {record.date}
                            </span>
                            <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              •
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {record.doctor}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Diagnosis:{" "}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              {record.diagnosis}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              Treatment:{" "}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              {record.treatment}
                            </span>
                          </div>
                          {record.notes && (
                            <div className="mb-2">
                              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes:{" "}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                                {record.notes}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 sm:ml-4">
                          <button
                            onClick={() => handleViewRecord(record)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium text-left transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm font-medium text-left transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handlePrintRecord(record)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-medium text-left transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print</span>
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
      </div>

      {/* Add Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Medical Record
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleCreateRecord({
                  patientId: formData.get("patientId"),
                  date: formData.get("date"),
                  type: formData.get("type"),
                  doctor: formData.get("doctor"),
                  diagnosis: formData.get("diagnosis"),
                  treatment: formData.get("treatment"),
                  notes: formData.get("notes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient
                  </label>
                  <select
                    name="patientId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Record Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Consultation">
                      Initial Consultation
                    </option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Check">Routine Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Treatment
                  </label>
                  <textarea
                    name="treatment"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Medical Record Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Record ID:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.id}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient ID:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.patientId}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.date}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.type}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doctor:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.doctor}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Diagnosis:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.diagnosis}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Treatment:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.treatment}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRecord.notes || "No notes available"}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Medical Record
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateRecord(selectedRecord.id, {
                  patientId: formData.get("patientId"),
                  date: formData.get("date"),
                  type: formData.get("type"),
                  doctor: formData.get("doctor"),
                  diagnosis: formData.get("diagnosis"),
                  treatment: formData.get("treatment"),
                  notes: formData.get("notes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient
                  </label>
                  <select
                    name="patientId"
                    defaultValue={selectedRecord.patientId}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedRecord.date}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Record Type
                  </label>
                  <select
                    name="type"
                    defaultValue={selectedRecord.type}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Initial Consultation">
                      Initial Consultation
                    </option>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine Check">Routine Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    name="doctor"
                    defaultValue={selectedRecord.doctor}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    defaultValue={selectedRecord.diagnosis}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Treatment
                  </label>
                  <textarea
                    name="treatment"
                    rows={3}
                    defaultValue={selectedRecord.treatment}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={selectedRecord.notes}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
