import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

const ExpiryRegister = () => {
  const [expiryRegister, setExpiryRegister] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch expiry register data
  const fetchExpiryRegister = () => {
    axios
      .get("http://localhost:8000/expiry_register/")
      .then((response) => {
        setExpiryRegister(response.data.expiry_register);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load expiry register.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExpiryRegister();
  }, []);

  // Helper function to fix the removed_date format
  const parseDate = (dateStr) => {
    if (dateStr) {
      const [month, year] = dateStr.split("-");
      // Append the year explicitly (assuming it's for 20XX, for example)
      const fullDate = `${month}-${year.length === 2 ? "20" + year : year}`;
      return new Date(fullDate);
    }
    return null; // In case the date is null or not provided
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Expiry Register</h2>

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
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Expiry Date</th>
                  <th className="p-3 text-left">Removed Month</th>
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
                      <td className="p-3">{item.expiry_date}</td>
                      <td className="p-3 text-green-600 font-semibold">
                        {/* Format the removed_date properly */}
                        {item.removed_date
                          ? parseDate(item.removed_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short' })
                          : "Not Removed"}
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
