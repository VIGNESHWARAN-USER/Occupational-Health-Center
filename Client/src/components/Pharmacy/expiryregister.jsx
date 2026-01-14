import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaDownload, FaFilter, FaEraser } from "react-icons/fa";

const ExpiryRegister = () => {
  const [expiryRegister, setExpiryRegister] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchExpiryRegister();
  }, []);

  const fetchExpiryRegister = async () => {
    setLoading(true);
    try {
      const params = {};
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const res = await axios.get("http://localhost:8000/expiry_register/", { params });
      setExpiryRegister(res.data.expiry_register);
      setLoading(false);
    } catch (err) {
      setError("Failed to load expiry register.");
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    fetchExpiryRegister();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Removed";
    const fullDateStr = `01-${dateStr}`;
    const date = new Date(fullDateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadExcel = () => {
    if (!expiryRegister || expiryRegister.length === 0) {
      alert("No expiry records available to download.");
      return;
    }

    const dataToExport = expiryRegister.map((item) => ({
      "Medicine Form": item.medicine_form,
      "Brand Name": item.brand_name,
      "Chemical Name": item.chemical_name,
      "Dose/Volume": item.dose_volume,
      "Quantity": item.quantity,
      "Total Quantity": item.total_quantity || item.Total_quantity, // fallback safety
      "Expiry Date": formatDate(item.expiry_date),
      "Removed Date": formatDate(item.removed_date),
    }));

    // ---- Generate formatted timestamp ----
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const timeFormatted = `${hours}.${minutes} ${ampm}`;

    const fileName = `Pharmacy Expiry Register - ${day}-${month}-${year} @ ${timeFormatted}.xlsx`;

    // ---- Create and Save Excel ----
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExpiryRegister");

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
      <div className="w-full flex flex-wrap items-center justify-between mb-4 gap-4">
        {/* Centered Filters */}
        <div className="flex flex-wrap justify-center gap-2 flex-1">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span className="text-gray-700">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={fetchExpiryRegister}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            <FaFilter size={14} />
            Filter
          </button>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
          >
            <FaEraser size={14} />
            Clear
          </button>
        </div>

        {/* Right-aligned Download */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow"
          >
            <FaDownload size={16} />
            <span>Download Excel</span>
          </button>
        </div>

      </div>

        {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Expiry Register</h2>  
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : expiryRegister.length === 0 ? (
              <p className="text-center text-gray-500">No expired medicines recorded.</p>
          ) : (
          
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Medicine Form</th>
                  <th className="p-3 text-left">Brand Name</th>
                  <th className="p-3 text-left">Chemical Name</th>
                  <th className="p-3 text-left">Dose/Volume</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Total_quantity</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-left">Removed Date</th>
                </tr>
              </thead>
              <tbody>
                  {expiryRegister.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3 font-bold">{item.quantity}</td>
                      <td className="p-3 font-bold">{item.total_quantity}</td>
                      <td className="p-3">{formatDate(item.expiry_date)}</td>
                      <td className="p-3 text-green-700 font-semibold">
                        {formatDate(item.removed_date)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiryRegister;
