import React, { useState, useEffect } from "react";

const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(data)
  useEffect(() => {
    if (data) {
      setVaccinationData(data.vaccination || []);
    }
  }, [data]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-8 bg-gray-50 p-6 min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Vaccination Information
        </h1>

        {vaccinationData.length === 0 ? (
          <p className="text-center text-gray-500">No vaccination records available.</p>
        ) : (
          vaccinationData.map((vaccination, vIndex) => (
            <div key={vIndex} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {vaccination.vaccine_name}
              </h2>
              <p className="text-lg text-gray-700 mb-4">Status: {vaccination.status}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Normal Doses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Normal Doses</h3>
                  {vaccination.doses?.dates.map((date, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <input
                        type="date"
                        value={date}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                        readOnly
                      />
                      <input
                        type="text"
                        value={vaccination.doses.dose_names[index] || ""}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                        readOnly
                      />
                    </div>
                  ))}
                </div>

                {/* Booster Doses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Booster Doses</h3>
                  {vaccination.boosters?.dates.map((date, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <input
                        type="date"
                        value={date}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                        readOnly
                      />
                      <input
                        type="text"
                        value={vaccination.boosters.dose_names[index] || ""}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export default Vaccination;