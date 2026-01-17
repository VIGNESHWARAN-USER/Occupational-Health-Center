import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPrescription, faCalendarAlt, faUserMd, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PrescriptionDisplay = ({ data }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // According to your log, data is the object {id: 6, emp_no: '...', ...}
  const aadhar = data?.aadhar;

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. If 'data' is a single prescription object (matching your console log)
        if (data && data.id && !Array.isArray(data)) {
          setPrescriptions([data]);
          setIsLoading(false);
        } 
        // 2. If 'data' is already an array of prescriptions
        else if (Array.isArray(data)) {
          setPrescriptions(data);
          setIsLoading(false);
        }
        // 3. If data is just a reference, fetch history from API
        else if (aadhar) {
          const response = await axios.get(`http://localhost:8000/getprescriptions/${aadhar}`);
          setPrescriptions(response.data?.prescriptions || response.data || []);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error setting prescription data:", err);
        setError("Failed to load prescription details.");
        setIsLoading(false);
      }
    };

    initializeData();
  }, [data, aadhar]);

  // Helper to format timing array (handles the empty Array(0) in your log)
  const formatTiming = (timing) => {
    if (!timing || (Array.isArray(timing) && timing.length === 0)) return "Not specified";
    if (Array.isArray(timing)) {
      return timing.map(t => typeof t === 'object' ? t.label : t).join(", ");
    }
    return String(timing);
  };

  const renderMedicineTable = (items, title, colorClass) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-md font-bold mb-2 ${colorClass} border-b pb-1 flex justify-between`}>
          <span>{title}</span>
          <span className="text-xs font-normal text-gray-400">({items.length} items)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-2 font-semibold">Medicine Name</th>
                <th className="p-2 font-semibold">Dose/Vol</th>
                <th className="p-2 font-semibold">Qty</th>
                <th className="p-2 font-semibold">Timing</th>
                <th className="p-2 font-semibold">Relation to Food</th>
                <th className="p-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-blue-50/30 transition-colors">
                  <td className="p-2">
                    <div className="font-medium text-gray-800">{item.chemicalName || "Unnamed Item"}</div>
                    {item.brandName && <div className="text-xs text-blue-500 font-medium">{item.brandName}</div>}
                  </td>
                  <td className="p-2 text-gray-600">{item.doseVolume || item.serving || "-"}</td>
                  <td className="p-2 font-bold text-gray-700">{item.qty || "-"}</td>
                  <td className="p-2 text-gray-600 italic">{formatTiming(item.timing)}</td>
                  <td className="p-2 text-gray-600">{item.food || "Anytime"}</td>
                  <td className="p-2 text-gray-600">{item.days ? `${item.days} Days` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-blue-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading Prescription Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
        {error}
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="mt-4 bg-white rounded-lg shadow-sm p-10 text-center border">
        <p className="text-gray-400">No prescription records found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-end border-b pb-2">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Prescription History
        </h1>
      </div>

      {prescriptions.map((record, index) => (
        <div key={record.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          

          <div className="p-5">
            {/* Logic to render only categories that have items */}
            {renderMedicineTable(record.tablets, "Tablets", "text-blue-600")}
            {renderMedicineTable(record.syrups, "Syrups", "text-green-600")}
            {renderMedicineTable(record.injections, "Injections", "text-purple-600")}
            {renderMedicineTable(record.drops, "Drops", "text-teal-600")}
            {renderMedicineTable(record.creams, "Creams & Ointments", "text-orange-600")}
            {renderMedicineTable(record.respules, "Respules", "text-cyan-600")}
            {renderMedicineTable(record.lotions, "Lotions", "text-pink-600")}
            {renderMedicineTable(record.fluids, "Fluids", "text-indigo-600")}
            {renderMedicineTable(record.powder, "Powders", "text-lime-600")}
            {renderMedicineTable(record.suture_procedure, "Suture/Procedure Items", "text-gray-600")}
            {renderMedicineTable(record.dressing, "Dressing Items", "text-gray-600")}
            {renderMedicineTable(record.others, "Other Items", "text-gray-500")}

            {/* Pharmacist/Nurse Notes */}
            {record.nurse_notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <p className="text-xs font-bold text-blue-800 uppercase mb-1">Pharmacist Notes:</p>
                <p className="text-sm text-gray-700">{record.nurse_notes}</p>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
              <span>Submitted By: {record.submitted_by}</span>
              <span>Issued By: {record.issued_by}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionDisplay;