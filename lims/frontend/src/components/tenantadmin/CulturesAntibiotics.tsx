import {
  Microscope,
  Plus,
  Search,
  TestTube,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import React, { useState } from "react";

const CulturesAntibiotics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const cultures = [
    {
      id: "CUL001",
      patientName: "John Smith",
      patientId: "P001",
      specimenType: "Blood",
      cultureType: "Bacterial",
      organism: "Staphylococcus aureus",
      collectionDate: "2025-01-20",
      incubationDate: "2025-01-21",
      status: "completed",
      sensitivity: "Resistant",
      antibiotics: ["Penicillin", "Amoxicillin", "Ciprofloxacin"],
      resistantTo: ["Penicillin", "Amoxicillin"],
      sensitiveTo: ["Ciprofloxacin", "Vancomycin"],
      reportDate: "2025-01-22",
      technician: "Dr. Sarah Johnson",
      notes: "MRSA strain detected",
    },
    {
      id: "CUL002",
      patientName: "Sarah Johnson",
      patientId: "P002",
      specimenType: "Urine",
      cultureType: "Bacterial",
      organism: "Escherichia coli",
      collectionDate: "2025-01-19",
      incubationDate: "2025-01-20",
      status: "incubating",
      sensitivity: "Pending",
      antibiotics: ["Ciprofloxacin", "Nitrofurantoin", "Trimethoprim"],
      resistantTo: [],
      sensitiveTo: [],
      reportDate: "",
      technician: "Dr. Mike Davis",
      notes: "Standard UTI culture",
    },
    {
      id: "CUL003",
      patientName: "Mike Davis",
      patientId: "P003",
      specimenType: "Sputum",
      cultureType: "Bacterial",
      organism: "Streptococcus pneumoniae",
      collectionDate: "2025-01-18",
      incubationDate: "2025-01-19",
      status: "completed",
      sensitivity: "Sensitive",
      antibiotics: ["Penicillin", "Amoxicillin", "Ceftriaxone"],
      resistantTo: [],
      sensitiveTo: ["Penicillin", "Amoxicillin", "Ceftriaxone"],
      reportDate: "2025-01-21",
      technician: "Dr. Lisa Wilson",
      notes: "Pneumonia culture",
    },
    {
      id: "CUL004",
      patientName: "Lisa Wilson",
      patientId: "P004",
      specimenType: "Wound Swab",
      cultureType: "Bacterial",
      organism: "Pseudomonas aeruginosa",
      collectionDate: "2025-01-17",
      incubationDate: "2025-01-18",
      status: "completed",
      sensitivity: "Resistant",
      antibiotics: ["Ciprofloxacin", "Gentamicin", "Piperacillin"],
      resistantTo: ["Ciprofloxacin", "Piperacillin"],
      sensitiveTo: ["Gentamicin", "Tobramycin"],
      reportDate: "2025-01-20",
      technician: "Dr. Robert Brown",
      notes: "Wound infection culture",
    },
    {
      id: "CUL005",
      patientName: "Robert Brown",
      patientId: "P005",
      specimenType: "Blood",
      cultureType: "Fungal",
      organism: "Candida albicans",
      collectionDate: "2025-01-16",
      incubationDate: "2025-01-17",
      status: "incubating",
      sensitivity: "Pending",
      antibiotics: ["Fluconazole", "Amphotericin B", "Caspofungin"],
      resistantTo: [],
      sensitiveTo: [],
      reportDate: "",
      technician: "Dr. Jennifer Smith",
      notes: "Fungal blood culture",
    },
  ];

  const filteredCultures = cultures.filter((culture) => {
    const matchesSearch =
      culture.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.organism.toLowerCase().includes(searchTerm.toLowerCase()) ||
      culture.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || culture.status === filterStatus;
    const matchesType =
      filterType === "all" || culture.cultureType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "incubating":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity.toLowerCase()) {
      case "sensitive":
        return "bg-green-100 text-green-800";
      case "resistant":
        return "bg-red-100 text-red-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalCultures = cultures.length;
  const completedCultures = cultures.filter(
    (c) => c.status === "completed"
  ).length;
  const incubatingCultures = cultures.filter(
    (c) => c.status === "incubating"
  ).length;
  const resistantCultures = cultures.filter(
    (c) => c.sensitivity === "Resistant"
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Cultures & Antibiotics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage bacterial cultures and antibiotic sensitivity testing
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>Add Culture</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, organism, or culture ID..."
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
            <option value="completed">Completed</option>
            <option value="incubating">Incubating</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Bacterial">Bacterial</option>
            <option value="Fungal">Fungal</option>
            <option value="Viral">Viral</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Cultures</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
                {totalCultures}
              </p>
            </div>
            <Microscope className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedCultures}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Incubating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {incubatingCultures}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Resistant</p>
              <p className="text-2xl font-bold text-red-600">
                {resistantCultures}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Cultures Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Culture
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Specimen
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Organism
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Sensitivity
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Collection Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCultures.map((culture) => (
                <tr key={culture.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {culture.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {culture.cultureType}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        {culture.specimenType}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {culture.patientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        ID: {culture.patientId}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm text-gray-900 dark:text-white">
                    {culture.specimenType}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {culture.organism}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        culture.status
                      )}`}
                    >
                      {culture.status.charAt(0).toUpperCase() +
                        culture.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSensitivityColor(
                        culture.sensitivity
                      )}`}
                    >
                      {culture.sensitivity}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    {culture.collectionDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left">
                        Update
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left">
                        Report
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

export default CulturesAntibiotics;
