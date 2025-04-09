import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

const CurrentExpiry = () => {
  const [expiryStock, setExpiryStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch expiry stock
  const fetchExpiryStock = () => {
    axios
      .get("http://localhost:8000/current_expiry/")
      .then((response) => {
        setExpiryStock(response.data.expiry_stock);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load expiry stock.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExpiryStock();
  }, []);

  // Remove expired medicine
  const handleRemove = async (id) => {
    try {
      const response = await axios.post("http://localhost:8000/remove_expiry/", { id });

      if (response.data.success) {
        alert("Medicine removed successfully!");

        // Update UI: Set removed_month to today's date for the removed item
        setExpiryStock(expiryStock.map(med =>
          med.id === id ? { ...med, removed_date: new Date().toISOString().split("T")[0] } : med
        ));
      }
    } catch (error) {
      console.error("Error removing medicine:", error);
      alert("Failed to remove medicine");
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Expiry Medicines</h2>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-3 text-left">Medicine Form</th>
                  <th className="p-3 text-left">Brand Name</th>
                  <th className="p-3 text-left">Chemical Name</th>
                  <th className="p-3 text-left">Dose/Volume</th>
                  <th className="p-3 text-left">Total Quantity</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiryStock.length > 0 ? (
                  expiryStock.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3 font-bold">{item.brand_name}</td>
                      <td className="p-3 text-gray-600">{item.chemical_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3 font-bold">{item.total_quantity}</td>
                      <td className="p-3">{item.expiry_date}</td>
                      <td className="p-3 text-center">
                        {item.removed_date ? (
                          <span className="px-3 py-2 bg-green-500 text-white font-semibold rounded-lg">
                            Removed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No expiring medicines next month.
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

export default CurrentExpiry;