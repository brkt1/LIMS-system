import React, { useState, useEffect } from "react";
import { equipmentAPI } from "../services/api";

const EquipmentTest: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await equipmentAPI.getAll();
        console.log("Equipment API response:", response.data);
        setEquipment(response.data);
      } catch (error: any) {
        console.error("Error fetching equipment:", error);
        setError(error.message || "Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading equipment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Equipment Test ({equipment.length} items)
      </h2>
      <div className="grid gap-4">
        {equipment.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg bg-white">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Model: {item.model}</p>
            <p>Serial: {item.serial_number}</p>
            <p>Status: {item.status}</p>
            <p>Location: {item.location}</p>
            <p>Department: {item.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentTest;
