import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../Sidebar"; // Assuming correct path
import axios from "axios";
import * as XLSX from "xlsx";

// Define API endpoints centrally
const API_BASE_URL = "http://localhost:8000"; // Or your actual base URL
const CURRENT_STOCK_URL = `${API_BASE_URL}/current_stock/`;
const STOCK_HISTORY_URL = `${API_BASE_URL}/stock_history/`;

const StockHistory = () => {
  // State variables
  const [combinedStock, setCombinedStock] = useState([]); // Holds the unified raw data
  const [filteredData, setFilteredData] = useState([]); // Data displayed in the table after ALL filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(""); // State for From Date filter
  const [toDate, setToDate] = useState("");     // State for To Date filter

  // Fetch and combine data (remains largely the same)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [currentRes, historyRes] = await Promise.all([
        axios.get(CURRENT_STOCK_URL),
        axios.get(STOCK_HISTORY_URL),
      ]);

      const currentStock = (currentRes.data.stock || []).map(item => ({
        ...item,
        dataType: 'Current',
        displayQuantity: item.quantity_expiry // Assuming this is correct from backend
      }));

      const stockHistory = (historyRes.data.stock_history || []).map(item => ({
        ...item,
        dataType: 'History',
        // Ensure field name matches backend response (total_quantity_recorded or total_quantity_sum)
        displayQuantity: item.total_quantity_recorded || item.total_quantity_sum
      }));

      const allData = [...currentStock, ...stockHistory];

      allData.sort((a, b) => {
         // Keep existing sort or adjust as needed
         if (a.dataType !== b.dataType) return a.dataType.localeCompare(b.dataType);
         if (a.brand_name !== b.brand_name) return a.brand_name.localeCompare(b.brand_name);
         if (a.chemical_name !== b.chemical_name) return a.chemical_name.localeCompare(b.chemical_name);
         // Add entry_date sort if desired for consistent ordering within groups
         if (a.entry_date !== b.entry_date) return new Date(b.entry_date) - new Date(a.entry_date); // Descending date
         return 0;
      });

      console.log("Combined Data:", allData);

      setCombinedStock(allData);
      // Initial filtering is done in the useEffect below

    } catch (err) {
      console.error("Error fetching stock data:", err);
      let errorMessage = "Error loading stock data. ";
       if (err.response) {
        errorMessage += `Server responded with status ${err.response.status}. ${err.response.data?.error || ''}`;
      } else if (err.request) {
        errorMessage += "No response received from server. Is it running?";
      } else {
        errorMessage += err.message;
      }
      setError(errorMessage);
      setCombinedStock([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - runs once on mount

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect to apply ALL filters whenever dependencies change
  useEffect(() => {
    let result = combinedStock;

    // Apply text search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.brand_name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.chemical_name?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply 'From Date' filter
    // Ensure item.entry_date is in 'YYYY-MM-DD' or comparable format
    if (fromDate) {
       result = result.filter(item => item.entry_date && item.entry_date >= fromDate);
    }

    // Apply 'To Date' filter
    if (toDate) {
       result = result.filter(item => item.entry_date && item.entry_date <= toDate);
    }

    setFilteredData(result);

  }, [combinedStock, searchTerm, fromDate, toDate]); // Re-run filter when these change


  // --- Handlers ---

  // Update search term state only
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Update from date state
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  // Update to date state
  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  // Prepare FILTERED data and handle Excel Export
  const handleDownloadExcel = () => {
    // Use filteredData for export
    if (filteredData.length === 0) {
        alert("No data available to export based on current filters.");
        return;
    }

    const dataForExport = filteredData.map(item => ({
      "Type": item.dataType,
      "Medicine Form": item.medicine_form,
      "Brand Name": item.brand_name,
      "Chemical Name": item.chemical_name,
      "Dose/Volume": item.dose_volume,
      "Quantity": item.displayQuantity,
      "Entry Date": item.entry_date,
      "Expiry Date": item.expiry_date,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredStockReport"); // Sheet name
    XLSX.writeFile(wb, "Pharmacy_Filtered_Stock_Report.xlsx"); // Filename reflects filtered data
  };

  // --- Render ---
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-auto flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Stock Report (Current & History)
        </h2>

        {/* Filters Row */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow flex flex-wrap items-end gap-4">
          {/* Text Search */}
          <div className="flex-grow min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange} // Updated handler
              placeholder="Brand or Chemical Name..."
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          {/* From Date */}
          <div className="flex-shrink-0">
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Entry Date</label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange} // Updated handler
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          {/* To Date */}
          <div className="flex-shrink-0">
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Entry Date</label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={handleToDateChange} // Updated handler
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
               // Optional: Set min attribute based on fromDate
               min={fromDate}
            />
          </div>

          {/* Download Button */}
          <div className="flex-shrink-0">
             {/* Label removed for button, aligned by items-end on container */}
             <button
                onClick={handleDownloadExcel}
                // Disable if loading or no FILTERED data
                disabled={loading || filteredData.length === 0}
                className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow transition duration-150 ${loading || filteredData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                Download Excel
            </button>
          </div>
        </div>

        {/* Data Display Area */}
        <div className="flex-grow overflow-x-auto bg-white shadow-lg rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-40"> {/* Reduced height */}
                <p className="text-gray-600 text-lg">Loading Stock Data...</p>
            </div>
          ) : error ? (
             <div className="flex justify-center items-center h-40 p-4"> {/* Reduced height */}
                 <p className="text-red-600 bg-red-100 p-4 rounded border border-red-300 text-center">{error}</p>
             </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md z-10">
                <tr>
                  {/* Headers remain the same */}
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Type</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Medicine Form</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Brand Name</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Chemical Name</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Dose/Volume</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Quantity</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Entry Date</th>
                  <th className="p-3 text-left text-sm font-semibold tracking-wider">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                 {/* Render filteredData */}
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={`${item.dataType}-${item.brand_name}-${item.chemical_name}-${item.expiry_date}-${item.entry_date}-${index}`} // Enhanced key
                        className={`hover:bg-gray-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                    >
                      <td className="p-3 whitespace-nowrap">
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                           item.dataType === 'Current' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                         }`}>
                             {item.dataType}
                         </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-700">{item.medicine_form}</td>
                      <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.brand_name}</td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-600">{item.chemical_name}</td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-700">{item.dose_volume}</td>
                      {/* Ensure displayQuantity has a value */}
                      <td className="p-3 whitespace-nowrap text-sm font-bold text-indigo-700">{item.displayQuantity ?? 'N/A'}</td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-500">{item.entry_date}</td>
                      <td className="p-3 whitespace-nowrap text-sm text-gray-500">{item.expiry_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-500">
                      {searchTerm || fromDate || toDate ? "No items match your filters." : "No stock data found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHistory;