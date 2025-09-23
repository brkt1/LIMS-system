import { CheckCircle, Plus, Search, TestTube } from "lucide-react";
import React, { useState } from "react";

const AcceptSamples: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Accept Samples</h1>
          <p className="text-gray-600 mt-1">
            Accept and process incoming samples
          </p>
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            <span>Accept Sample</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Sample acceptance workflow coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AcceptSamples;
