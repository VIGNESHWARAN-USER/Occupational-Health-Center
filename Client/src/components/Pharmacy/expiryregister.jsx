import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import * as XLSX from "xlsx";

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
    const dataToExport = expiryRegister.map((item) => ({
      "Medicine Form": item.medicine_form,
      "Brand Name": item.brand_name,
      "Chemical Name": item.chemical_name,
      "Dose/Volume": item.dose_volume,
      Quantity: item.quantity,
      "Expiry Date": formatDate(item.expiry_date),
      "Removed Date": formatDate(item.removed_date),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ExpiryRegister");
    XLSX.writeFile(wb, "Filtered_Expiry_Register.xlsx");
  };

  return (
    <div className="h-screen flex">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Filter
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>

        {/* Right-aligned Download */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow"
          >
            Download Excel
          </button>
        </div>
      </div>

        {/* Table Section */}
        
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Expiry Register</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Medicine Form</th>
                  <th className="p-3 text-left">Brand Name</th>
                  <th className="p-3 text-left">Chemical Name</th>
                  <th className="p-3 text-left">Dose/Volume</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-left">Removed Date</th>
                </tr>
              </thead>
              <tbody>
                {expiryRegister.length > 0 ? (
                  expiryRegister.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3 font-bold">{item.quantity}</td>
                      <td className="p-3">{formatDate(item.expiry_date)}</td>
                      <td className="p-3 text-green-700 font-semibold">
                        {formatDate(item.removed_date)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No expired medicines recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryRegister;
