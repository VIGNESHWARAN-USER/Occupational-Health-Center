import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import * as XLSX from "xlsx";

const CurrentStock = () => {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const doArchiveAndFetch = async () => {
      try {
        await axios.post("https://occupational-health-center-1.onrender.com/archive_stock/");
        const res = await axios.get("https://occupational-health-center-1.onrender.com/current_stock/");
        setStockData(res.data.stock);
        setFilteredData(res.data.stock);
      } catch (err) {
        setError("Error archiving or loading stock.");
      } finally {
        setLoading(false);
      }
    };

    doArchiveAndFetch();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredData(stockData);
    } else {
      const filtered = stockData.filter(
        (item) =>
          item.brand_name.toLowerCase().startsWith(value) ||
          item.chemical_name.toLowerCase().startsWith(value)
      );
      setFilteredData(filtered);
    }
  };

  // Excel Export
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stockData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockData");
    XLSX.writeFile(wb, "Pharmacy_Current_Stock.xlsx");
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Pharmacy Current Stock
        </h2>

        {/* Search & Download Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Brand or Chemical Name"
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleDownloadExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow"
          >
            Download Excel
          </button>
        </div>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">Medicine Form</th>
                  <th className="p-3 text-left">Brand Name</th>
                  <th className="p-3 text-left">Chemical Name</th>
                  <th className="p-3 text-left">Dose/Volume</th>
                  <th className="p-3 text-left">Entry Date</th>
                  <th className="p-3 text-left">Total Quantity</th>
                  <th className="p-3 text-left">Current Quantity</th>
                  <th className="p-3 text-left">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3">{item.entry_date}</td>
                      <td className="p-3 font-bold">{item.total_quantity}</td>
                      <td className="p-3 text-green-600 font-semibold">{item.quantity_expiry}</td>
                      <td className="p-3">{item.expiry_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No stock available
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

export default CurrentStock;
