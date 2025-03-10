import React, { useState, useEffect } from "react";

const Vaccination = () => {
  const [vaccinationData, setVaccinationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [status, setStatus] = useState("Full");
  const [normalDoses, setNormalDoses] = useState(Array(5).fill({ date: "", name: "" }));
  const [boosterDoses, setBoosterDoses] = useState(Array(5).fill({ date: "", name: "" }));

  // Fetch vaccination data from backend
  useEffect(() => {
    fetch("https://occupational-health-center.onrender.com/getvaccinations/") // Update with your API URL
      .then((response) => response.json())
      .then((data) => {
        if (data.vaccinations.length > 0) {
          const latestVaccine = data.vaccinations[0]; // Assuming the latest vaccine is the first in the list

          setSelectedVaccine(latestVaccine.vaccine);
          setStatus(latestVaccine.status);

          setNormalDoses([
            ...latestVaccine.normalDoses,
            ...Array(5 - latestVaccine.normalDoses.length).fill({ date: "", name: "" }),
          ]);

          setBoosterDoses([
            ...latestVaccine.boosterDoses,
            ...Array(5 - latestVaccine.boosterDoses.length).fill({ date: "", name: "" }),
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-8 bg-gray-50 min-h-screen">
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Vaccination Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 text-lg font-medium">Select Vaccine</label>
            <input
              type="text"
              value={selectedVaccine}
              readOnly
              className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-lg font-medium">Status</label>
            <select
              className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Full</option>
              <option>Partial</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Normal Doses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Normal Doses</h2>
            {normalDoses.map((dose, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" key={index}>
                <input
                  type="date"
                  value={dose.date}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
                <input
                  type="text"
                  value={dose.name}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
              </div>
            ))}
          </div>

          {/* Booster Doses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booster Doses</h2>
            {boosterDoses.map((dose, index) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" key={index}>
                <input
                  type="date"
                  value={dose.date}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
                <input
                  type="text"
                  value={dose.name}
                  className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccination;