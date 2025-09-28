import { FileText, Plus, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { culturesAntibioticsAPI } from "../../services/api";
import { getCurrentTenantId } from "../../utils/helpers";

const CulturesAntibiotics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showAddCultureModal, setShowAddCultureModal] = useState(false);
  const [showViewCultureModal, setShowViewCultureModal] = useState(false);
  const [showUpdateCultureModal, setShowUpdateCultureModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<any>(null);

  // Form states
  const [newCulture, setNewCulture] = useState({
    patientName: "",
    patientId: "",
    specimenType: "",
    cultureType: "",
    organism: "",
    collectionDate: "",
    technician: "",
    notes: "",
  });

  const [updateCulture, setUpdateCulture] = useState({
    organism: "",
    sensitivity: "",
    antibiotics: "",
    resistantTo: "",
    sensitiveTo: "",
    reportDate: "",
    notes: "",
  });

  // Cultures state
  const [cultures, setCultures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cultures from backend API
  useEffect(() => {
    const fetchCultures = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await culturesAntibioticsAPI.getAllCultures();

        // Map backend data to frontend expected format
        const mappedCultures = response.data.map((item: any) => ({
          id:
            item.id ||
            `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Fallback ID if empty
          patientName: item.patient_name,
          patientId: item.patient_id,
          specimenType: item.specimen_type,
          cultureType: item.culture_type,
          organism: item.organism || "",
          collectionDate: item.collection_date,
          incubationDate: item.collection_date, // Use collection date as fallback
          status: item.status,
          technician: item.technician || "",
          notes: item.notes || "",
          reportDate: item.report_date || "",
          sensitivity: "pending",
          antibiotics: "",
          resistantTo: "",
          sensitiveTo: "",
        }));

        setCultures(mappedCultures);
      } catch (error: any) {
        console.error("Error fetching cultures:", error);
        setError(error.message || "Failed to load cultures");
        // Set empty array when API fails
        setCultures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCultures();
  }, []);

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
      case "in_progress":
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

  // Handler functions
  const handleAddCulture = () => {
    setNewCulture({
      patientName: "",
      patientId: "",
      specimenType: "",
      cultureType: "",
      organism: "",
      collectionDate: "",
      technician: "",
      notes: "",
    });
    setShowAddCultureModal(true);
  };

  const handleViewCulture = async (culture: any) => {
    setSelectedCulture(culture);
    setShowViewCultureModal(true);

    // Fetch antibiotic sensitivities for this culture
    try {
      const sensitivitiesResponse =
        await culturesAntibioticsAPI.getAntibioticSensitivitiesByCulture(
          culture.id
        );
      const sensitivities = sensitivitiesResponse.data || [];

      // Update the culture with antibiotic sensitivities
      setSelectedCulture({
        ...culture,
        antibioticSensitivities: sensitivities,
      });
    } catch (error) {
      console.error("Error fetching antibiotic sensitivities:", error);
      // Continue with the view modal even if sensitivities fail to load
    }
  };

  const handleUpdateCulture = (culture: any) => {
    setSelectedCulture(culture);
    setUpdateCulture({
      organism: culture.organism,
      sensitivity: culture.sensitivity,
      antibiotics: Array.isArray(culture.antibiotics)
        ? culture.antibiotics.join(", ")
        : culture.antibiotics || "",
      resistantTo: Array.isArray(culture.resistantTo)
        ? culture.resistantTo.join(", ")
        : culture.resistantTo || "",
      sensitiveTo: Array.isArray(culture.sensitiveTo)
        ? culture.sensitiveTo.join(", ")
        : culture.sensitiveTo || "",
      reportDate: culture.reportDate,
      notes: culture.notes,
    });
    setShowUpdateCultureModal(true);
  };

  const handleReportCulture = (culture: any) => {
    setSelectedCulture(culture);
    setShowReportModal(true);
  };

  const handleCreateCulture = async () => {
    if (
      newCulture.patientName &&
      newCulture.patientId &&
      newCulture.specimenType &&
      newCulture.cultureType &&
      newCulture.collectionDate
    ) {
      try {
        setLoading(true);
        setError(null);

        // Prepare data for backend
        const cultureData = {
          patient_name: newCulture.patientName,
          patient_id: newCulture.patientId,
          specimen_type: newCulture.specimenType,
          culture_type: newCulture.cultureType,
          organism: newCulture.organism || null,
          collection_date: newCulture.collectionDate,
          technician: newCulture.technician || null,
          notes: newCulture.notes || null,
          status: "pending",
          tenant: getCurrentTenantId(),
        };

        const response = await culturesAntibioticsAPI.createCulture(
          cultureData
        );

        if (response.data && response.data.culture) {
          // Map backend response to frontend format
          const newCultureData = {
            id: response.data.culture.id,
            patientName: response.data.culture.patient_name,
            patientId: response.data.culture.patient_id,
            specimenType: response.data.culture.specimen_type,
            cultureType: response.data.culture.culture_type,
            organism: response.data.culture.organism || "",
            collectionDate: response.data.culture.collection_date,
            incubationDate: response.data.culture.collection_date,
            status: response.data.culture.status,
            technician: response.data.culture.technician || "",
            notes: response.data.culture.notes || "",
            reportDate: response.data.culture.report_date || "",
            sensitivity: "pending",
            antibiotics: [],
            resistantTo: [],
            sensitiveTo: [],
          };

          setCultures((prev: any) => [newCultureData, ...prev]);
          setShowAddCultureModal(false);
          setNewCulture({
            patientName: "",
            patientId: "",
            specimenType: "",
            cultureType: "",
            organism: "",
            collectionDate: "",
            technician: "",
            notes: "",
          });
        }
      } catch (error: any) {
        console.error("Error creating culture:", error);
        setError(error.response?.data?.error || "Failed to create culture");
      } finally {
        setLoading(false);
      }
    }
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      const response = await fetch("/api/test/");
      const data = await response.json();
      console.log("API Test Response:", data);
      return data;
    } catch (error) {
      console.error("API Test Failed:", error);
      return null;
    }
  };

  const handleUpdateCultureConfirm = async () => {
    if (selectedCulture && updateCulture.organism) {
      try {
        setLoading(true);
        setError(null);

        // Validate that we have a valid culture ID
        if (!selectedCulture.id || selectedCulture.id.trim() === "") {
          throw new Error(
            "Invalid culture ID. Cannot update culture without a valid ID."
          );
        }

        // Test API connection first
        const apiTest = await testAPIConnection();
        if (!apiTest) {
          throw new Error("API connection failed");
        }

        console.log("Updating culture with ID:", selectedCulture.id);
        console.log("Update data:", updateCulture);

        // Prepare update data for backend
        const updateData = {
          organism: updateCulture.organism,
          notes: updateCulture.notes || null,
          status:
            updateCulture.sensitivity === "Pending"
              ? "in_progress"
              : "completed",
          report_date:
            updateCulture.reportDate || new Date().toISOString().split("T")[0],
        };

        console.log("Sending update data to backend:", updateData);
        console.log("API URL will be:", `/api/cultures/${selectedCulture.id}/`);

        const response = await culturesAntibioticsAPI.updateCulture(
          selectedCulture.id,
          updateData
        );

        console.log("Backend response:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.data && response.data.culture) {
          // Update the culture in the local state with backend data
          setCultures((prev: any) =>
            prev.map((culture: any) =>
              culture.id === selectedCulture.id
                ? {
                    ...culture,
                    organism: response.data.culture.organism,
                    notes: response.data.culture.notes,
                    status: response.data.culture.status,
                    reportDate: response.data.culture.report_date,
                    sensitivity: updateCulture.sensitivity,
                    antibiotics: updateCulture.antibiotics
                      .split(", ")
                      .filter((a) => a.trim()),
                    resistantTo: updateCulture.resistantTo
                      .split(", ")
                      .filter((a) => a.trim()),
                    sensitiveTo: updateCulture.sensitiveTo
                      .split(", ")
                      .filter((a) => a.trim()),
                  }
                : culture
            )
          );
        } else {
          // Fallback: Update local state even if backend response is not as expected
          console.warn(
            "Backend response format unexpected, updating local state only"
          );
          setCultures((prev: any) =>
            prev.map((culture: any) =>
              culture.id === selectedCulture.id
                ? {
                    ...culture,
                    organism: updateCulture.organism,
                    notes: updateCulture.notes,
                    status:
                      updateCulture.sensitivity === "Pending"
                        ? "in_progress"
                        : "completed",
                    reportDate:
                      updateCulture.reportDate ||
                      new Date().toISOString().split("T")[0],
                    sensitivity: updateCulture.sensitivity,
                    antibiotics: updateCulture.antibiotics
                      .split(", ")
                      .filter((a) => a.trim()),
                    resistantTo: updateCulture.resistantTo
                      .split(", ")
                      .filter((a) => a.trim()),
                    sensitiveTo: updateCulture.sensitiveTo
                      .split(", ")
                      .filter((a) => a.trim()),
                  }
                : culture
            )
          );
        }

        // If antibiotic sensitivities were provided, create them
        if (updateCulture.antibiotics.trim()) {
          const antibiotics = updateCulture.antibiotics
            .split(", ")
            .filter((a) => a.trim());
          const resistantAntibiotics = updateCulture.resistantTo
            .split(", ")
            .filter((a) => a.trim());
          const sensitiveAntibiotics = updateCulture.sensitiveTo
            .split(", ")
            .filter((a) => a.trim());

          // Create antibiotic sensitivity records
          for (const antibiotic of antibiotics) {
            let sensitivity = "not_tested";
            if (resistantAntibiotics.includes(antibiotic)) {
              sensitivity = "resistant";
            } else if (sensitiveAntibiotics.includes(antibiotic)) {
              sensitivity = "sensitive";
            }

            try {
              await culturesAntibioticsAPI.createAntibioticSensitivity({
                culture: selectedCulture.id,
                antibiotic_name: antibiotic.trim(),
                sensitivity: sensitivity,
                tested_date: new Date().toISOString().split("T")[0],
                tenant: getCurrentTenantId(),
              });
            } catch (error) {
              console.error(
                `Error creating antibiotic sensitivity for ${antibiotic}:`,
                error
              );
            }
          }
        }

        setShowUpdateCultureModal(false);
        setSelectedCulture(null);

        // Show success message
        alert("Culture updated successfully!");
      } catch (error: any) {
        console.error("Error updating culture:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to update culture"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerateReport = async () => {
    if (selectedCulture) {
      try {
        setLoading(true);
        setError(null);

        // Fetch antibiotic sensitivities for this culture
        const sensitivitiesResponse =
          await culturesAntibioticsAPI.getAntibioticSensitivitiesByCulture(
            selectedCulture.id
          );
        const sensitivities = sensitivitiesResponse.data || [];

        // Create detailed report content
        const reportContent = `CULTURE & ANTIBIOTIC SENSITIVITY REPORT
===============================================

CULTURE INFORMATION:
-------------------
Culture ID: ${selectedCulture.id}
Patient Name: ${selectedCulture.patientName}
Patient ID: ${selectedCulture.patientId}
Specimen Type: ${
          selectedCulture.specimenType === "blood"
            ? "Blood"
            : selectedCulture.specimenType === "urine"
            ? "Urine"
            : selectedCulture.specimenType === "sputum"
            ? "Sputum"
            : selectedCulture.specimenType === "stool"
            ? "Stool"
            : selectedCulture.specimenType === "wound_swab"
            ? "Wound Swab"
            : selectedCulture.specimenType === "throat_swab"
            ? "Throat Swab"
            : selectedCulture.specimenType === "cerebrospinal_fluid"
            ? "Cerebrospinal Fluid"
            : selectedCulture.specimenType === "tissue"
            ? "Tissue"
            : selectedCulture.specimenType === "other"
            ? "Other"
            : selectedCulture.specimenType
        }
Culture Type: ${
          selectedCulture.cultureType === "bacterial"
            ? "Bacterial Culture"
            : selectedCulture.cultureType === "fungal"
            ? "Fungal Culture"
            : selectedCulture.cultureType === "viral"
            ? "Viral Culture"
            : selectedCulture.cultureType === "mycobacterial"
            ? "Mycobacterial Culture"
            : selectedCulture.cultureType === "mixed"
            ? "Mixed Culture"
            : selectedCulture.cultureType
        }
Collection Date: ${selectedCulture.collectionDate}
Report Date: ${
          selectedCulture.reportDate || new Date().toISOString().split("T")[0]
        }
Status: ${
          selectedCulture.status.charAt(0).toUpperCase() +
          selectedCulture.status.slice(1)
        }
Technician: ${selectedCulture.technician || "Not specified"}

ORGANISM IDENTIFICATION:
-----------------------
Organism: ${selectedCulture.organism || "Not identified"}

ANTIBIOTIC SENSITIVITY TESTING:
------------------------------
${
  sensitivities.length > 0
    ? sensitivities
        .map(
          (sens) =>
            `• ${sens.antibiotic_name}: ${sens.sensitivity.toUpperCase()}${
              sens.mic_value ? ` (MIC: ${sens.mic_value})` : ""
            }${sens.zone_diameter ? ` (Zone: ${sens.zone_diameter}mm)` : ""}`
        )
        .join("\n")
    : "No antibiotic sensitivity testing performed"
}

${
  selectedCulture.notes
    ? `NOTES:
------
${selectedCulture.notes}`
    : ""
}

REPORT SUMMARY:
--------------
${
  sensitivities.filter((s) => s.sensitivity === "sensitive").length > 0
    ? `Sensitive to: ${sensitivities
        .filter((s) => s.sensitivity === "sensitive")
        .map((s) => s.antibiotic_name)
        .join(", ")}`
    : ""
}
${
  sensitivities.filter((s) => s.sensitivity === "resistant").length > 0
    ? `Resistant to: ${sensitivities
        .filter((s) => s.sensitivity === "resistant")
        .map((s) => s.antibiotic_name)
        .join(", ")}`
    : ""
}
${
  sensitivities.filter((s) => s.sensitivity === "intermediate").length > 0
    ? `Intermediate to: ${sensitivities
        .filter((s) => s.sensitivity === "intermediate")
        .map((s) => s.antibiotic_name)
        .join(", ")}`
    : ""
}

Generated on: ${new Date().toLocaleString()}
Generated by: LIMS System`;

        // Create and download report
        const blob = new Blob([reportContent], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `culture-report-${selectedCulture.id}-${
          new Date().toISOString().split("T")[0]
        }.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setShowReportModal(false);
        setSelectedCulture(null);
      } catch (error: any) {
        console.error("Error generating report:", error);
        setError(error.response?.data?.error || "Failed to generate report");
      } finally {
        setLoading(false);
      }
    }
  };

  const totalCultures = cultures.length;
  const completedCultures = cultures.filter(
    (c) => c.status === "completed"
  ).length;
  const inProgressCultures = cultures.filter(
    (c) => c.status === "in_progress"
  ).length;
  const pendingCultures = cultures.filter((c) => c.status === "pending").length;

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading cultures...
          </span>
        </div>
      )}

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
        <div className="flex gap-2">
          <button
            onClick={testAPIConnection}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
          >
            <span>Test API</span>
          </button>
          <button
            onClick={handleAddCulture}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Culture</span>
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
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="bacterial">Bacterial</option>
            <option value="fungal">Fungal</option>
            <option value="viral">Viral</option>
            <option value="mycobacterial">Mycobacterial</option>
            <option value="mixed">Mixed</option>
          </select>
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
                <tr
                  key={culture.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {culture.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {culture.cultureType === "bacterial"
                          ? "Bacterial"
                          : culture.cultureType === "fungal"
                          ? "Fungal"
                          : culture.cultureType === "viral"
                          ? "Viral"
                          : culture.cultureType === "mycobacterial"
                          ? "Mycobacterial"
                          : culture.cultureType === "mixed"
                          ? "Mixed"
                          : culture.cultureType}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        {culture.specimenType === "blood"
                          ? "Blood"
                          : culture.specimenType === "urine"
                          ? "Urine"
                          : culture.specimenType === "sputum"
                          ? "Sputum"
                          : culture.specimenType === "stool"
                          ? "Stool"
                          : culture.specimenType === "wound_swab"
                          ? "Wound Swab"
                          : culture.specimenType === "throat_swab"
                          ? "Throat Swab"
                          : culture.specimenType === "cerebrospinal_fluid"
                          ? "CSF"
                          : culture.specimenType === "tissue"
                          ? "Tissue"
                          : culture.specimenType === "other"
                          ? "Other"
                          : culture.specimenType}
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
                    {culture.specimenType === "blood"
                      ? "Blood"
                      : culture.specimenType === "urine"
                      ? "Urine"
                      : culture.specimenType === "sputum"
                      ? "Sputum"
                      : culture.specimenType === "stool"
                      ? "Stool"
                      : culture.specimenType === "wound_swab"
                      ? "Wound Swab"
                      : culture.specimenType === "throat_swab"
                      ? "Throat Swab"
                      : culture.specimenType === "cerebrospinal_fluid"
                      ? "CSF"
                      : culture.specimenType === "tissue"
                      ? "Tissue"
                      : culture.specimenType === "other"
                      ? "Other"
                      : culture.specimenType}
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
                      <button
                        onClick={() => handleViewCulture(culture)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleUpdateCulture(culture)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleReportCulture(culture)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
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

      {/* Add Culture Modal */}
      {showAddCultureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Culture
              </h3>
              <button
                onClick={() => setShowAddCultureModal(false)}
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
                    value={newCulture.patientName}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={newCulture.patientId}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specimen Type *
                  </label>
                  <select
                    value={newCulture.specimenType}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        specimenType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select specimen type</option>
                    <option value="blood">Blood</option>
                    <option value="urine">Urine</option>
                    <option value="sputum">Sputum</option>
                    <option value="stool">Stool</option>
                    <option value="wound_swab">Wound Swab</option>
                    <option value="throat_swab">Throat Swab</option>
                    <option value="cerebrospinal_fluid">
                      Cerebrospinal Fluid
                    </option>
                    <option value="tissue">Tissue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Culture Type
                  </label>
                  <select
                    value={newCulture.cultureType}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        cultureType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select culture type</option>
                    <option value="bacterial">Bacterial Culture</option>
                    <option value="fungal">Fungal Culture</option>
                    <option value="viral">Viral Culture</option>
                    <option value="mycobacterial">Mycobacterial Culture</option>
                    <option value="mixed">Mixed Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    value={newCulture.collectionDate}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        collectionDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technician
                  </label>
                  <input
                    type="text"
                    value={newCulture.technician}
                    onChange={(e) =>
                      setNewCulture({
                        ...newCulture,
                        technician: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter technician name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newCulture.notes}
                    onChange={(e) =>
                      setNewCulture({ ...newCulture, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter any notes about this culture"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddCultureModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCulture}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Culture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Culture Modal */}
      {showViewCultureModal && selectedCulture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Culture Details
              </h3>
              <button
                onClick={() => setShowViewCultureModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Culture ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specimen Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.specimenType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Culture Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.cultureType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organism
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.organism}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedCulture.status
                    )}`}
                  >
                    {selectedCulture.status.charAt(0).toUpperCase() +
                      selectedCulture.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sensitivity
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSensitivityColor(
                      selectedCulture.sensitivity
                    )}`}
                  >
                    {selectedCulture.sensitivity}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Collection Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.collectionDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Incubation Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.incubationDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Report Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.reportDate || "Not available"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Antibiotic Sensitivities
                  </label>
                  {selectedCulture.antibioticSensitivities &&
                  selectedCulture.antibioticSensitivities.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCulture.antibioticSensitivities.map(
                        (sens: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {sens.antibiotic_name}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                sens.sensitivity === "sensitive"
                                  ? "bg-green-100 text-green-800"
                                  : sens.sensitivity === "resistant"
                                  ? "bg-red-100 text-red-800"
                                  : sens.sensitivity === "intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {sens.sensitivity.toUpperCase()}
                            </span>
                            {sens.mic_value && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                MIC: {sens.mic_value}
                              </span>
                            )}
                            {sens.zone_diameter && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Zone: {sens.zone_diameter}mm
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      No antibiotic sensitivity testing performed
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCulture.notes || "None"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewCultureModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Culture Modal */}
      {showUpdateCultureModal && selectedCulture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Culture Results
              </h3>
              <button
                onClick={() => setShowUpdateCultureModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organism *
                  </label>
                  <input
                    type="text"
                    value={updateCulture.organism}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        organism: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organism name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sensitivity
                  </label>
                  <select
                    value={updateCulture.sensitivity}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        sensitivity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Resistant">Resistant</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Antibiotics Tested
                  </label>
                  <input
                    type="text"
                    value={updateCulture.antibiotics}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        antibiotics: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter antibiotics separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resistant To
                  </label>
                  <input
                    type="text"
                    value={updateCulture.resistantTo}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        resistantTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter resistant antibiotics separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sensitive To
                  </label>
                  <input
                    type="text"
                    value={updateCulture.sensitiveTo}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        sensitiveTo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter sensitive antibiotics separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Date
                  </label>
                  <input
                    type="date"
                    value={updateCulture.reportDate}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        reportDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={updateCulture.notes}
                    onChange={(e) =>
                      setUpdateCulture({
                        ...updateCulture,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter any additional notes"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowUpdateCultureModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCultureConfirm}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Culture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedCulture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generate Report
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedCulture.id}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Patient: {selectedCulture.patientName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Organism: {selectedCulture.organism}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Status: {selectedCulture.status}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                This will generate and download a detailed culture and
                antibiotic sensitivity report for the selected culture.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturesAntibiotics;
