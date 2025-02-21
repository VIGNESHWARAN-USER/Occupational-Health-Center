import React, { useState } from "react";

const Vaccination = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNewVaccinePopup, setShowNewVaccinePopup] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");

  const handleAddNewVaccine = () => {
    if (newVaccineName.trim()) {
      alert(`New Vaccine Added: ${newVaccineName}`);
      setNewVaccineName("");
      setShowNewVaccinePopup(false);
    } else {
      alert("Please enter a valid vaccine name.");
    }
  };

  return (
    <div className="mt-8 bg-gray-50 min-h-screen">
      {/* Vaccination Section */}
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Vaccination Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 text-lg font-medium">Select Vaccine</label>
            <select className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select</option>
              <option>Vaccine 1</option>
              <option>Vaccine 2</option>
              <option>Vaccine 3</option>
              <option onClick={() => setShowNewVaccinePopup(true)}>Add New Vaccine</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium">Status</label>
            <select className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Full</option>
              <option>Partial</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Normal Doses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Normal Doses</h2>
            {[...Array(5)].map((_, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" key={index}>
                <input
                  type="date"
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder={`Dose ${index + 1} Name`}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Booster Doses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booster Dose</h2>
            {[...Array(5)].map((_, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" key={index}>
                <input
                  type="date"
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder={`Booster ${index + 1} Name`}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-xl w-96 transform transition-transform scale-95 hover:scale-100">
            <h2 className="text-xl font-bold mb-4">Select Date</h2>
            <input
              type="date"
              className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                onClick={() => setShowCalendar(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vaccine Popup */}
      {showNewVaccinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-md shadow-xl w-96 transform transition-transform scale-95 hover:scale-100">
            <h2 className="text-xl font-bold mb-4">Enter New Vaccine Name</h2>
            <input
              type="text"
              value={newVaccineName}
              onChange={(e) => setNewVaccineName(e.target.value)}
              className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New Vaccine Name"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                onClick={() => setShowNewVaccinePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={handleAddNewVaccine}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccination;
