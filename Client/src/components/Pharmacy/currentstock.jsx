import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";

const CurrentStock = () => {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const doArchiveAndFetch = async () => {
      try {
        await axios.post("http://localhost:8000/archive_stock/");
        const res = await axios.get("http://localhost:8000/current_stock/");
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

  const handleSearch = (e) => {
  const value = e.target.value.toLowerCase();
  setSearchTerm(value);

  if (value === "") {
    setFilteredData(stockData);
  } else {
    const filtered = stockData.filter((item) => {
      const brand = (item.brand_name || "").toLowerCase();
      const chem = (item.chemical_name || "").toLowerCase();

      return brand.includes(value) || chem.includes(value);
    });

    setFilteredData(filtered);
  }
};


  // Excel Export
  const handleDownloadExcel = () => {
    if (!stockData || stockData.length === 0) {
      alert("No stock available to download.");
      return;
    }

    // Format date
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    // Format time
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 24hr → 12hr, replace 0 with 12
    
    const timeFormatted = `${hours}.${minutes} ${ampm}`;

    const fileName = `Pharmacy Current Stock - ${day}-${month}-${year} @ ${timeFormatted}.xlsx`;

    // Create excel
    const ws = XLSX.utils.json_to_sheet(stockData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockData");

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        
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
            className="flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            <FaDownload size={15} />
            <span>Download Excel</span>
          </button>
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center"> Pharmacy Current Stock</h2>

          {/* Loading & Error Handling */}
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredData.length === 0 ? (
              <p className="text-center text-gray-500">No stock available.</p>
          ) :(
            
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
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3">{item.entry_date}</td>
                      <td className="p-3 font-bold">{item.total_quantity}</td>
                      <td className={`p-3 font-semibold ${
                        item.quantity_expiry <= 10 ? 'text-red-600' : 
                        item.quantity_expiry <= 30 ? 'text-yellow-500' : 'text-green-600'
                      }`}>
                        {item.quantity_expiry}
                      </td>
                      <td className="p-3">{item.expiry_date}</td>
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

export default CurrentStock;
