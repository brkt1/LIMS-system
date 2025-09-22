import { Plus, Search, Stethoscope } from "lucide-react";
import React, { useState } from "react";

const HomeVisitRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Home Visit Requests
          </h1>
          <p className="text-gray-600">Manage home visit service requests</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Home visit requests coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default HomeVisitRequests;
