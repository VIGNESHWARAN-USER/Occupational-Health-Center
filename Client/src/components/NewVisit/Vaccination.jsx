import React, { useState } from "react";

const Vaccination = () => {
  const [showNewVaccinePopup, setShowNewVaccinePopup] = useState(false);
  const [newVaccineName, setNewVaccineName] = useState("");
  const [vaccines, setVaccines] = useState(["Vaccine 1", "Vaccine 2", "Vaccine 3"]);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [status, setStatus] = useState("Full");

  // State for doses
  const [normalDoses, setNormalDoses] = useState(Array(5).fill({ date: "", name: "" }));
  const [boosterDoses, setBoosterDoses] = useState(Array(5).fill({ date: "", name: "" }));

  const handleAddNewVaccine = () => {
    if (newVaccineName.trim() && !vaccines.includes(newVaccineName)) {
      setVaccines([...vaccines, newVaccineName]);
      setSelectedVaccine(newVaccineName);
      setNewVaccineName("");
      setShowNewVaccinePopup(false);
    } else {
      alert("Please enter a valid and unique vaccine name.");
    }
  };

  const handleSubmit = async () => {
    const data = {
      vaccine: selectedVaccine,
      status,
      normalDoses,
      boosterDoses,
    };

    try {
      const response = await fetch("https://occupational-health-center-1.onrender.com/vaccination/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Vaccination data submitted successfully!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data.");
    }
  };

  return (
    <div className="mt-8 p-8">
      <h1 className="text-3xl font-bold mb-6">Vaccination Information</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <label className="block mb-2 text-lg font-medium">Select Vaccine</label>
          <select
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            value={selectedVaccine}
            onChange={(e) =>
              e.target.value === "add_new"
                ? setShowNewVaccinePopup(true)
                : setSelectedVaccine(e.target.value)
            }
          >
            <option value="">Select</option>
            {vaccines.map((vaccine, index) => (
              <option key={index} value={vaccine}>{vaccine}</option>
            ))}
            <option value="add_new">Add New Vaccine</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium">Status</label>
          <select
            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8">
        {/* Normal Doses */}
        <div>
          <h2 className="text-lg font-medium">Normal Doses</h2>
          {normalDoses.map((dose, index) => (
            <div className="grid grid-cols-2 gap-4 mt-2" key={index}>
              <input
                type="date"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={dose.date}
                onChange={(e) =>
                  setNormalDoses(normalDoses.map((d, i) => i === index ? { ...d, date: e.target.value } : d))
                }
              />
              <input
                type="text"
                placeholder={`Dose ${index + 1} Name`}
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={dose.name}
                onChange={(e) =>
                  setNormalDoses(normalDoses.map((d, i) => i === index ? { ...d, name: e.target.value } : d))
                }
              />
            </div>
          ))}
        </div>

        {/* Booster Doses */}
        <div>
          <h2 className="text-lg font-medium">Booster Dose</h2>
          {boosterDoses.map((dose, index) => (
            <div className="grid grid-cols-2 gap-4 mt-2" key={index}>
              <input
                type="date"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={dose.date}
                onChange={(e) =>
                  setBoosterDoses(boosterDoses.map((d, i) => i === index ? { ...d, date: e.target.value } : d))
                }
              />
              <input
                type="text"
                placeholder={`Booster ${index + 1} Name`}
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={dose.name}
                onChange={(e) =>
                  setBoosterDoses(boosterDoses.map((d, i) => i === index ? { ...d, name: e.target.value } : d))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Add New Vaccine Popup */}
      {showNewVaccinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Enter New Vaccine Name</h2>
            <input
              type="text"
              value={newVaccineName}
              onChange={(e) => setNewVaccineName(e.target.value)}
              className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="New Vaccine Name"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowNewVaccinePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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