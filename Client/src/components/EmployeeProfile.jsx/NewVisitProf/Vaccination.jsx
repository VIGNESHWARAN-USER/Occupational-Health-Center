import React, { useState, useEffect } from "react";

const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setVaccinationData(data.vaccination || []);
    }
  }, [data]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Vaccination Information
      </h1>

      {vaccinationData.length === 0 ? (
        <p className="text-center text-gray-500">No vaccination records available.</p>
      ) : (
        vaccinationData.map((vaccination, vIndex) => (
          <div key={vIndex} className="mb-4 p-3 border flex gap-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-2">
              <div className="col-span-1">
                <label htmlFor={`vaccine_name_${vIndex}`} className="block text-sm font-medium text-gray-700">Vaccine Name:</label>
                <input
                  type="text"
                  id={`vaccine_name_${vIndex}`}
                  value={vaccination.vaccine_name}
                  readOnly
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor={`status_${vIndex}`} className="block text-sm font-medium text-gray-700">Status:</label>
                <input
                  type="text"
                  id={`status_${vIndex}`}
                  value={vaccination.status}
                  readOnly
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Normal Doses */}
              <div>
                <h3 className="block text-sm font-medium text-gray-700">Doses</h3>
                {vaccination.doses?.dates.map((date, dIndex) => (
                  <div key={dIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <input
                      type="date"
                      value={date}
                      readOnly
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <input
                      type="text"
                      value={vaccination.doses.dose_names[dIndex] || ""}
                      readOnly
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Booster Doses */}
              <div>
                <h3 className="block text-sm font-medium text-gray-700">Boosters</h3>
                {vaccination.boosters?.dates.map((date, bIndex) => (
                  <div key={bIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <input
                      type="date"
                      value={date}
                      readOnly
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <input
                      type="text"
                      value={vaccination.boosters.dose_names[bIndex] || ""}
                      readOnly
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
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