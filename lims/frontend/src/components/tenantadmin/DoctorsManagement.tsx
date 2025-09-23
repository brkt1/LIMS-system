import { Plus, Search, Stethoscope, UserCheck, Users } from "lucide-react";
import React, { useState } from "react";

const DoctorsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@clinic.com",
      specialty: "Cardiology",
      licenseNumber: "MD-12345",
      phone: "+1 (555) 123-4567",
      status: "active",
      experience: "8 years",
      education: "MD, Harvard Medical School",
      joinDate: "2020-03-15",
      totalPatients: 245,
      rating: 4.8,
      schedule: "Mon-Fri 9AM-5PM",
    },
    {
      id: "DOC002",
      name: "Dr. Michael Davis",
      email: "michael.davis@clinic.com",
      specialty: "Neurology",
      licenseNumber: "MD-67890",
      phone: "+1 (555) 234-5678",
      status: "active",
      experience: "12 years",
      education: "MD, Johns Hopkins University",
      joinDate: "2019-08-20",
      totalPatients: 189,
      rating: 4.9,
      schedule: "Mon-Thu 8AM-4PM",
    },
    {
      id: "DOC003",
      name: "Dr. Lisa Wilson",
      email: "lisa.wilson@clinic.com",
      specialty: "Pediatrics",
      licenseNumber: "MD-54321",
      phone: "+1 (555) 345-6789",
      status: "inactive",
      experience: "6 years",
      education: "MD, Stanford University",
      joinDate: "2021-01-10",
      totalPatients: 156,
      rating: 4.7,
      schedule: "Tue-Sat 10AM-6PM",
    },
    {
      id: "DOC004",
      name: "Dr. Robert Brown",
      email: "robert.brown@clinic.com",
      specialty: "Orthopedics",
      licenseNumber: "MD-98765",
      phone: "+1 (555) 456-7890",
      status: "active",
      experience: "15 years",
      education: "MD, Mayo Clinic",
      joinDate: "2018-06-05",
      totalPatients: 312,
      rating: 4.9,
      schedule: "Mon-Fri 7AM-3PM",
    },
    {
      id: "DOC005",
      name: "Dr. Jennifer Smith",
      email: "jennifer.smith@clinic.com",
      specialty: "Dermatology",
      licenseNumber: "MD-13579",
      phone: "+1 (555) 567-8901",
      status: "pending",
      experience: "4 years",
      education: "MD, Yale University",
      joinDate: "2025-01-20",
      totalPatients: 0,
      rating: 0,
      schedule: "Wed-Sun 9AM-5PM",
    },
  ];

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

  const activeDoctors = doctors.filter((d) => d.status === "active").length;
  const totalPatients = doctors.reduce((sum, d) => sum + d.totalPatients, 0);
  const avgRating =
    doctors.filter((d) => d.rating > 0).reduce((sum, d) => sum + d.rating, 0) /
    doctors.filter((d) => d.rating > 0).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
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
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Dermatology">Dermatology</option>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
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
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Specialty
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  License
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Experience
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {doctor.specialty}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {doctor.licenseNumber}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {doctor.experience}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {doctor.totalPatients}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
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
                      <button className="text-primary-600 hover:text-primary-900 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-left">
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 text-left">
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
    </div>
  );
};

export default DoctorsManagement;
