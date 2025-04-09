import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Ensure Sidebar is in the correct path
import axios from "axios";

const CurrentStock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch stock data from backend
  useEffect(() => {
    axios
      .get("https://occupational-health-center-1.onrender.com/current_stock/")
      .then((response) => {
        setStockData(response.data.stock);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load stock data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pharmacy Current Stock</h2>

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
                  <th className="p-3 text-left">Total Quantity</th>
                  <th className="p-3 text-left">Quantity/Expiry</th>
                  <th className="p-3 text-left">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {stockData.length > 0 ? (
                  stockData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3 font-bold">{item.total_quantity}</td>
                      <td className="p-3 text-green-600 font-semibold">{item.quantity_expiry}</td>
                      <td className="p-3">{item.expiry_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">No stock available</td>
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
