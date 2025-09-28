import { Plus, Search, Stethoscope, UserCheck, Users, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { doctorAPI } from "../../services/api";
import { getCurrentTenantId, getCurrentUserEmail } from "../../utils/helpers";

const DoctorsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showViewDoctorModal, setShowViewDoctorModal] = useState(false);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // Form states
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
    licenseNumber: "",
    phone: "",
    experience: "",
    education: "",
    schedule: "",
  });

  const [editDoctor, setEditDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
    licenseNumber: "",
    phone: "",
    experience: "",
    education: "",
    schedule: "",
  });

  const [scheduleData, setScheduleData] = useState({
    schedule: "",
    notes: "",
  });

  // Dynamic doctors state
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<any[]>([]);

  // Load doctors and specialties from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load doctors
        const response = await doctorAPI.getAll();

        // Map backend data to frontend expected format
        const mappedDoctors = response.data.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          specialty: doctor.specialty,
          licenseNumber: doctor.license_number,
          phone: doctor.phone || "No phone",
          status: doctor.status,
          experience: doctor.experience || "Not specified",
          education: doctor.education || "Not specified",
          joinDate: doctor.join_date,
          totalPatients: doctor.total_patients,
          rating: doctor.rating,
          schedule: doctor.schedule || "Not specified",
        }));

        setDoctors(mappedDoctors);

        // Load specialties from backend API
        try {
          const specialtiesResponse = await doctorAPI.getSpecialties();
          if (specialtiesResponse.data.success) {
            setSpecialties(specialtiesResponse.data.data);
          } else {
            throw new Error("Failed to load specialties");
          }
        } catch (specialtyError) {
          console.error("Error fetching specialties:", specialtyError);
          // Fallback to empty array if API fails
          setSpecialties([]);
        }
      } catch (error: any) {
        console.error("Error fetching doctors:", error);
        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to load doctors"
        );
        // Fallback to empty array if API fails
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "all" || doctor.specialty === filterSpecialty;
    const matchesStatus =
      filterStatus === "all" || doctor.status === filterStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate test data for easy testing
  const generateTestData = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);

    setNewDoctor({
      name: `Dr. Test ${timestamp}`,
      email: `test.${timestamp}@example.com`,
      specialty: "cardiology",
      licenseNumber: `LIC_${timestamp}_${randomNum}`,
      phone: `555-${randomNum.toString().padStart(4, "0")}`,
      experience: "5 years",
      education: "MD, Test University",
      schedule: "Mon-Fri 9-5",
    });
  };

  // Handler functions
  const handleAddDoctor = () => {
    setNewDoctor({
      name: "",
      email: "",
      specialty: "",
      licenseNumber: "",
      phone: "",
      experience: "",
      education: "",
      schedule: "",
    });
    setShowAddDoctorModal(true);
  };

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowViewDoctorModal(true);
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setEditDoctor({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      licenseNumber: doctor.licenseNumber,
      phone: doctor.phone,
      experience: doctor.experience,
      education: doctor.education,
      schedule: doctor.schedule,
    });
    setShowEditDoctorModal(true);
  };

  const handleScheduleDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setScheduleData({
      schedule: doctor.schedule,
      notes: "",
    });
    setShowScheduleModal(true);
  };

  const handleCreateDoctor = async () => {
    if (
      newDoctor.name &&
      newDoctor.email &&
      newDoctor.specialty &&
      newDoctor.licenseNumber
    ) {
      try {
        setLoading(true);
        setError(null);

        const doctorData = {
          name: newDoctor.name,
          email: newDoctor.email,
          specialty: newDoctor.specialty,
          license_number: newDoctor.licenseNumber,
          phone: newDoctor.phone || "",
          experience: newDoctor.experience || "",
          education: newDoctor.education || "",
          schedule: newDoctor.schedule || "",
          tenant: getCurrentTenantId(), // Dynamic tenant ID
          created_by: getCurrentUserEmail(), // Current user email
          status: "active", // Default status
        };

        const response = await doctorAPI.create(doctorData);
        const createdDoctor = response.data.doctor || response.data;

        // Map backend response to frontend format
        const mappedDoctor = {
          id: createdDoctor.id,
          name: createdDoctor.name,
          email: createdDoctor.email,
          specialty: createdDoctor.specialty,
          licenseNumber: createdDoctor.license_number,
          phone: createdDoctor.phone || "No phone",
          status: createdDoctor.status || "active",
          experience: createdDoctor.experience || "Not specified",
          education: createdDoctor.education || "Not specified",
          joinDate:
            createdDoctor.join_date || new Date().toISOString().split("T")[0],
          totalPatients: createdDoctor.total_patients || 0,
          rating: createdDoctor.rating || 0,
          schedule: createdDoctor.schedule || "Not specified",
        };

        setDoctors((prev: any) => [mappedDoctor, ...prev]);
        setShowAddDoctorModal(false);
        setNewDoctor({
          name: "",
          email: "",
          specialty: "",
          licenseNumber: "",
          phone: "",
          experience: "",
          education: "",
          schedule: "",
        });

        // Show success message
        alert("Doctor created successfully!");
      } catch (error: any) {
        console.error("Error creating doctor:", error);
        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to create doctor"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateDoctor = async () => {
    if (
      selectedDoctor &&
      editDoctor.name &&
      editDoctor.email &&
      editDoctor.specialty &&
      editDoctor.licenseNumber
    ) {
      try {
        const doctorData = {
          name: editDoctor.name,
          email: editDoctor.email,
          specialty: editDoctor.specialty,
          license_number: editDoctor.licenseNumber,
          phone: editDoctor.phone || "",
          experience: editDoctor.experience || "",
          education: editDoctor.education || "",
          schedule: editDoctor.schedule || "",
        };

        const response = await doctorAPI.update(selectedDoctor.id, doctorData);
        const updatedDoctor = response.data.doctor || response.data;

        // Map backend response to frontend format
        const mappedDoctor = {
          id: updatedDoctor.id,
          name: updatedDoctor.name,
          email: updatedDoctor.email,
          specialty: updatedDoctor.specialty,
          licenseNumber: updatedDoctor.license_number,
          phone: updatedDoctor.phone || "No phone",
          status: updatedDoctor.status || selectedDoctor.status,
          experience: updatedDoctor.experience || "Not specified",
          education: updatedDoctor.education || "Not specified",
          joinDate: updatedDoctor.join_date || selectedDoctor.joinDate,
          totalPatients:
            updatedDoctor.total_patients || selectedDoctor.totalPatients,
          rating: updatedDoctor.rating || selectedDoctor.rating,
          schedule: updatedDoctor.schedule || "Not specified",
        };

        setDoctors((prev: any) =>
          prev.map((doctor: any) =>
            doctor.id === selectedDoctor.id ? mappedDoctor : doctor
          )
        );
        setShowEditDoctorModal(false);
        setSelectedDoctor(null);
      } catch (error: any) {
        console.error("Error updating doctor:", error);
        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to update doctor"
        );
      }
    }
  };

  const handleUpdateSchedule = async () => {
    if (selectedDoctor && scheduleData.schedule) {
      try {
        const doctorData = {
          schedule: scheduleData.schedule,
        };

        const response = await doctorAPI.update(selectedDoctor.id, doctorData);
        const updatedDoctor = response.data.doctor || response.data;

        setDoctors((prev: any) =>
          prev.map((doctor: any) =>
            doctor.id === selectedDoctor.id
              ? { ...doctor, schedule: updatedDoctor.schedule }
              : doctor
          )
        );
        setShowScheduleModal(false);
        setSelectedDoctor(null);
      } catch (error: any) {
        console.error("Error updating schedule:", error);
        setError(error.message || "Failed to update schedule");
      }
    }
  };

  const activeDoctors = doctors.filter((d) => d.status === "active").length;
  const totalPatients = doctors.reduce((sum, d) => sum + d.totalPatients, 0);
  const avgRating =
    doctors.filter((d) => d.rating > 0).reduce((sum, d) => sum + d.rating, 0) /
    doctors.filter((d) => d.rating > 0).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 dark:text-red-400 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading doctors...
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Doctors Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage doctor profiles, specialties, and schedules
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleAddDoctor}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty.value} value={specialty.value}>
                {specialty.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Doctors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {doctors.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Doctors
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activeDoctors}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalPatients}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-purple-600">
                {avgRating.toFixed(1)}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Specialty
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  License
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Experience
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Rating
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {doctor.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {doctor.email}
                        </div>
                        <div className="text-xs text-gray-400 sm:hidden">
                          {doctor.specialty} • {doctor.experience} •{" "}
                          {doctor.licenseNumber}
                        </div>
                        <div className="text-xs text-gray-400 hidden sm:block">
                          {doctor.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {doctor.specialty}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {doctor.licenseNumber}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {doctor.experience}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {doctor.totalPatients}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {doctor.rating > 0 ? (
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{doctor.rating}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        doctor.status
                      )}`}
                    >
                      {doctor.status.charAt(0).toUpperCase() +
                        doctor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewDoctor(doctor)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleScheduleDoctor(doctor)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        Schedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Doctor
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty *
                  </label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, specialty: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={newDoctor.licenseNumber}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter license number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={newDoctor.experience}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, experience: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={newDoctor.education}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, education: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., MD, Harvard Medical School"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Schedule
                  </label>
                  <input
                    type="text"
                    value={newDoctor.schedule}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, schedule: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={generateTestData}
                className="px-4 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                Generate Test Data
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddDoctorModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDoctor}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Doctor Modal */}
      {showViewDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Doctor Details
              </h3>
              <button
                onClick={() => setShowViewDoctorModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialty
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.specialty}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    License Number
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.licenseNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.experience}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Education
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.education}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedDoctor.status
                    )}`}
                  >
                    {selectedDoctor.status.charAt(0).toUpperCase() +
                      selectedDoctor.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Patients
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.totalPatients}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.rating > 0
                      ? `${selectedDoctor.rating} ⭐`
                      : "No rating yet"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Join Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.joinDate}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedDoctor.schedule}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewDoctorModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Doctor
              </h3>
              <button
                onClick={() => setShowEditDoctorModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={editDoctor.name}
                    onChange={(e) =>
                      setEditDoctor({ ...editDoctor, name: e.target.value })
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
                    value={editDoctor.email}
                    onChange={(e) =>
                      setEditDoctor({ ...editDoctor, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specialty *
                  </label>
                  <select
                    value={editDoctor.specialty}
                    onChange={(e) =>
                      setEditDoctor({
                        ...editDoctor,
                        specialty: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {specialties.map((specialty) => (
                      <option key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={editDoctor.licenseNumber}
                    onChange={(e) =>
                      setEditDoctor({
                        ...editDoctor,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editDoctor.phone}
                    onChange={(e) =>
                      setEditDoctor({ ...editDoctor, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={editDoctor.experience}
                    onChange={(e) =>
                      setEditDoctor({
                        ...editDoctor,
                        experience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={editDoctor.education}
                    onChange={(e) =>
                      setEditDoctor({
                        ...editDoctor,
                        education: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Schedule
                  </label>
                  <input
                    type="text"
                    value={editDoctor.schedule}
                    onChange={(e) =>
                      setEditDoctor({ ...editDoctor, schedule: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditDoctorModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDoctor}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Doctor Modal */}
      {showScheduleModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Doctor
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doctor: {selectedDoctor.name}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule *
                </label>
                <input
                  type="text"
                  value={scheduleData.schedule}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      schedule: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={scheduleData.notes}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about the schedule"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSchedule}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;
