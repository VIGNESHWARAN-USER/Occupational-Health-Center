import React, { useState, useEffect } from "react";
import axios from "axios";

const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  console.log(data.length)
  if(data.length === 0) {return (
    <p className=" p-4 flex justify-center items-center">Get the employee details</p>
  )}else{
  const emp_no = data[0]?.emp_no;
  console.log(data)
  useEffect(() => {
    if (data && data[0]?.vaccination?.vaccination.length > 0) {
      setVaccinationData(data[0]?.vaccination?.vaccination || []);
    }
  }, [data]);

  const addVaccine = () => {
    setVaccinationData([
      ...vaccinationData,
      {
        vaccine_name: "",
        status: "",
        doses: { dates: [], dose_names: [] },
        boosters: { dates: [], dose_names: [] },
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/vaccination/", {
        emp_no: emp_no,
        vaccination: vaccinationData,
      });
      alert("Vaccination data submitted successfully!");
    } catch (error) {
      console.error("Error submitting vaccination data:", error);
      alert("Failed to submit vaccination data.");
    }
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...vaccinationData];
    updatedData[index][field] = value;
    setVaccinationData(updatedData);
  };

  const addDose = (index, type) => {
    const updatedData = [...vaccinationData];
    updatedData[index][type].dates.push("");
    updatedData[index][type].dose_names.push("");
    setVaccinationData(updatedData);
  };

  const handleDoseChange = (vIndex, dIndex, type, field, value) => {
    const updatedData = [...vaccinationData];
    updatedData[vIndex][type][field][dIndex] = value;
    setVaccinationData(updatedData);
  };
  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Vaccination Information
      </h1>

      {vaccinationData.length === 0 ? (
        <p className="text-center text-gray-500">No vaccination records available.</p>
      ) : (
        vaccinationData?.map((vaccination, vIndex) => (
          <div key={vIndex} className="mb-4 p-3 border flex gap-4 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              <div className="col-span-1">
                <label htmlFor={`vaccine_name_${vIndex}`} className="block text-sm font-medium text-gray-700">Vaccine Name:</label>
                <input
                  type="text"
                  id={`vaccine_name_${vIndex}`}
                  value={vaccination.vaccine_name}
                  onChange={(e) => handleChange(vIndex, "vaccine_name", e.target.value)}
                  placeholder="Vaccine Name"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor={`status_${vIndex}`} className="block text-sm font-medium text-gray-700">Status:</label>
                <input
                  type="text"
                  id={`status_${vIndex}`}
                  value={vaccination.status}
                  onChange={(e) => handleChange(vIndex, "status", e.target.value)}
                  placeholder="Status"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Normal Doses */}
              <div>
                <h3 className="block text-sm font-medium text-gray-700">Doses</h3>
                {vaccination.doses.dates.map((date, dIndex) => (
                  <div key={dIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDoseChange(vIndex, dIndex, "doses", "dates", e.target.value)}
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <input
                      type="text"
                      value={vaccination.doses.dose_names[dIndex] || ""}
                      onChange={(e) => handleDoseChange(vIndex, dIndex, "doses", "dose_names", e.target.value)}
                      placeholder="Dose Name"
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addDose(vIndex, "doses")}
                  className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Add Dose
                </button>
              </div>

              {/* Booster Doses */}
              <div>
                <h3 className="block text-sm font-medium text-gray-700">Boosters</h3>
                {vaccination.boosters.dates.map((date, bIndex) => (
                  <div key={bIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => handleDoseChange(vIndex, bIndex, "boosters", "dates", e.target.value)}
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                    <input
                      type="text"
                      value={vaccination.boosters.dose_names[bIndex] || ""}
                      onChange={(e) => handleDoseChange(vIndex, bIndex, "boosters", "dose_names", e.target.value)}
                      placeholder="Booster Name"
                      className="py-1 px-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addDose(vIndex, "boosters")}
                  className="mt-1 px-2 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Add Booster
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-end mt-4">
        <button onClick={addVaccine} className="px-3 py-1 bg-blue-500 text-white rounded text-sm mr-2">
          Add Vaccine
        </button>
        <button onClick={handleSubmit} className="px-3 py-1 bg-green-500 text-white rounded text-sm">
          Submit Data
        </button>
      </div>
    </div>
  );
}
};

export default Vaccination;