import {
  Plus,
  Search,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  Eye,
  Edit,
  History,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { patientAPI } from "../../services/api";

const PatientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  // Modal states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showViewPatientModal, setShowViewPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Form states
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    primaryDoctor: "",
    insurance: "",
    emergencyContact: "",
  });

  const [editPatient, setEditPatient] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    primaryDoctor: "",
    insurance: "",
    emergencyContact: "",
  });

  // Dynamic patients state
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load patients from backend API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await patientAPI.getAll();

        // Map backend data to frontend expected format
        const mappedPatients = response.data.map((patient: any) => ({
          id: patient.id,
          name: patient.name || "Unknown Patient",
          email: patient.email || "No email",
          phone: patient.phone || "No phone",
          age: patient.age || 0,
          gender: patient.gender || "Unknown",
          status: "active", // Default status since backend doesn't have it
          lastVisit:
            patient.last_visit || new Date().toISOString().split("T")[0],
          totalVisits: patient.total_visits || 0,
          primaryDoctor: patient.primary_doctor || "No doctor assigned",
          insurance: patient.insurance || "No insurance",
          emergencyContact: patient.emergency_contact || "No emergency contact",
        }));

        setPatients(mappedPatients);
      } catch (error: any) {
        console.error("Error fetching patients:", error);
        setError(error.message || "Failed to load patients");
        // Fallback to mock data if API fails
        setPatients([
          {
            id: "P001",
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "+1 (555) 123-4567",
            age: 45,
            gender: "Male",
            status: "active",
            lastVisit: "2025-01-20",
            totalVisits: 12,
            primaryDoctor: "Dr. Sarah Johnson",
            insurance: "Blue Cross Blue Shield",
            emergencyContact: "Jane Smith (555) 987-6543",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Mock data is now handled in the useEffect fallback

  // Note: Data is now loaded from backend API in the useEffect above

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || patient.status === filterStatus;
    const matchesAge =
      filterAge === "all" ||
      (filterAge === "0-30" && patient.age <= 30) ||
      (filterAge === "31-50" && patient.age > 30 && patient.age <= 50) ||
      (filterAge === "51-70" && patient.age > 50 && patient.age <= 70) ||
      (filterAge === "70+" && patient.age > 70);
    return matchesSearch && matchesStatus && matchesAge;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddPatient = () => {
    setNewPatient({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      primaryDoctor: "",
      insurance: "",
      emergencyContact: "",
    });
    setShowAddPatientModal(true);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowViewPatientModal(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setEditPatient({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age.toString(),
      gender: patient.gender,
      primaryDoctor: patient.primaryDoctor,
      insurance: patient.insurance,
      emergencyContact: patient.emergencyContact,
    });
    setShowEditPatientModal(true);
  };

  const handleViewHistory = (patient: any) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
  };

  const handleCreatePatient = async () => {
    if (
      newPatient.name &&
      newPatient.email &&
      newPatient.phone &&
      newPatient.age &&
      newPatient.gender
    ) {
      try {
        const patientData = {
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phone,
          age: parseInt(newPatient.age),
          gender: newPatient.gender,
          primary_doctor: newPatient.primaryDoctor,
          insurance: newPatient.insurance,
          emergency_contact: newPatient.emergencyContact,
        };

        const response = await patientAPI.create(patientData);
        const createdPatient = response.data;

        // Map backend response to frontend format
        const mappedPatient = {
          id: createdPatient.id,
          name: createdPatient.name,
          email: createdPatient.email,
          phone: createdPatient.phone,
          age: createdPatient.age,
          gender: createdPatient.gender,
          status: "active",
          lastVisit: new Date().toISOString().split("T")[0],
          totalVisits: 0,
          primaryDoctor: createdPatient.primary_doctor || "No doctor assigned",
          insurance: createdPatient.insurance || "No insurance",
          emergencyContact:
            createdPatient.emergency_contact || "No emergency contact",
        };

        setPatients((prev: any) => [mappedPatient, ...prev]);
        setShowAddPatientModal(false);
        setNewPatient({
          name: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          primaryDoctor: "",
          insurance: "",
          emergencyContact: "",
        });
      } catch (error: any) {
        console.error("Error creating patient:", error);
        setError(error.message || "Failed to create patient");
      }
    }
  };

  const handleUpdatePatient = async () => {
    if (
      selectedPatient &&
      editPatient.name &&
      editPatient.email &&
      editPatient.phone &&
      editPatient.age &&
      editPatient.gender
    ) {
      try {
        const patientData = {
          name: editPatient.name,
          email: editPatient.email,
          phone: editPatient.phone,
          age: parseInt(editPatient.age),
          gender: editPatient.gender,
          primary_doctor: editPatient.primaryDoctor,
          insurance: editPatient.insurance,
          emergency_contact: editPatient.emergencyContact,
        };

        const response = await patientAPI.update(
          selectedPatient.id,
          patientData
        );
        const updatedPatient = response.data;

        // Map backend response to frontend format
        const mappedPatient = {
          id: updatedPatient.id,
          name: updatedPatient.name,
          email: updatedPatient.email,
          phone: updatedPatient.phone,
          age: updatedPatient.age,
          gender: updatedPatient.gender,
          status: selectedPatient.status, // Keep existing status
          lastVisit: selectedPatient.lastVisit, // Keep existing last visit
          totalVisits: selectedPatient.totalVisits, // Keep existing total visits
          primaryDoctor: updatedPatient.primary_doctor || "No doctor assigned",
          insurance: updatedPatient.insurance || "No insurance",
          emergencyContact:
            updatedPatient.emergency_contact || "No emergency contact",
        };

        setPatients((prev: any) =>
          prev.map((patient: any) =>
            patient.id === selectedPatient.id ? mappedPatient : patient
          )
        );
        setShowEditPatientModal(false);
        setSelectedPatient(null);
      } catch (error: any) {
        console.error("Error updating patient:", error);
        setError(error.message || "Failed to update patient");
      }
    }
  };

  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === "active").length;
  const totalVisits = patients.reduce((sum, p) => sum + p.totalVisits, 0);
  const avgAge = Math.round(
    patients.reduce((sum, p) => sum + p.age, 0) / patients.length
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Patient Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage patient records and information
          </p>
        </div>
        <button
          onClick={handleAddPatient}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or patient ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Ages</option>
            <option value="0-30">0-30 years</option>
            <option value="31-50">31-50 years</option>
            <option value="51-70">51-70 years</option>
            <option value="70+">70+ years</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading patients...
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPatients}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Active Patients
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activePatients}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Visits
              </p>
              <p className="text-2xl font-bold text-blue-600">{totalVisits}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Avg. Age
              </p>
              <p className="text-2xl font-bold text-purple-600">{avgAge}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Age/Gender
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Doctor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Last Visit
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          ID: {patient.id}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {patient.age} years
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {patient.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                    {patient.primaryDoctor}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        patient.status
                      )}`}
                    >
                      {patient.status.charAt(0).toUpperCase() +
                        patient.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    {patient.lastVisit}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewHistory(patient)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Patient
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newPatient.phone}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter age"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Doctor
                  </label>
                  <input
                    type="text"
                    value={newPatient.primaryDoctor}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        primaryDoctor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter primary doctor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Insurance
                  </label>
                  <input
                    type="text"
                    value={newPatient.insurance}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        insurance: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter insurance provider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={newPatient.emergencyContact}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter emergency contact"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePatient}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {showViewPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Patient Details
              </h3>
              <button
                onClick={() => setShowViewPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.age} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.gender}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedPatient.status
                    )}`}
                  >
                    {selectedPatient.status.charAt(0).toUpperCase() +
                      selectedPatient.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Visits
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.totalVisits}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Primary Doctor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.primaryDoctor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insurance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.insurance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Visit
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.lastVisit}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Emergency Contact
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPatient.emergencyContact}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewPatientModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Patient
              </h3>
              <button
                onClick={() => setShowEditPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={editPatient.name}
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editPatient.email}
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editPatient.phone}
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={editPatient.age}
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, age: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender *
                  </label>
                  <select
                    value={editPatient.gender}
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Doctor
                  </label>
                  <input
                    type="text"
                    value={editPatient.primaryDoctor}
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        primaryDoctor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Insurance
                  </label>
                  <input
                    type="text"
                    value={editPatient.insurance}
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        insurance: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={editPatient.emergencyContact}
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditPatientModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePatient}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient History Modal */}
      {showHistoryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Patient History - {selectedPatient.name}
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Visit History
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Regular Checkup
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Dr. Sarah Johnson
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-21
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          10:30 AM
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Blood Test
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Dr. Mike Davis
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-15
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          2:15 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Consultation
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Dr. Lisa Wilson
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-08
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          9:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Medical Records
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Complete Blood Count
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Results: Normal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-15
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          X-Ray Chest
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          Results: Clear
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Prescriptions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Vitamin D3
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          1000 IU daily
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900 dark:text-white">
                          2025-01-21
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
