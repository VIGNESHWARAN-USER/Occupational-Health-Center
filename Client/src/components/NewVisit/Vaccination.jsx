import React, { useState, useEffect } from "react";
import axios from "axios";
const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  console.log(data)
  const emp_no = data[0]?.emp_no;
  useEffect(() => {
    if (data) {
      setVaccinationData(data[0].vaccination.vaccination || []);
    }
  }, [data]);
  console.log(vaccinationData)
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

  function handleSubmit(e)
  {
    e.preventDefault();
    try{
      console.log(emp_no)
      const resp = axios.post("http://localhost:8000/vaccination/", {emp_no: emp_no, vaccination: vaccinationData});
      console.log(resp)
    }
    catch(error)
    {
      console.log(error)
    }
  }

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
    <div className="mt-8 bg-gray-50 min-h-screen ">
      <div className="">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Vaccination Information
        </h1>

        {vaccinationData.length === 0 ? (
          <p className="text-center text-gray-500">No vaccination records available.</p>
        ) : (
          vaccinationData.map((vaccination, vIndex) => (
            <div key={vIndex} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-100">
              <input
                type="text"
                value={vaccination.vaccine_name}
                onChange={(e) => handleChange(vIndex, "vaccine_name", e.target.value)}
                placeholder="Vaccine Name"
                className="text-xl font-semibold text-gray-800 mb-2 w-full border p-2"
              />
              <input
                type="text"
                value={vaccination.status}
                onChange={(e) => handleChange(vIndex, "status", e.target.value)}
                placeholder="Status"
                className="text-lg text-gray-700 mb-4 w-full border p-2"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Normal Doses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Normal Doses</h3>
                  {vaccination.doses.dates.map((date, dIndex) => (
                    <div key={dIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => handleDoseChange(vIndex, dIndex, "doses", "dates", e.target.value)}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                      />
                      <input
                        type="text"
                        value={vaccination.doses.dose_names[dIndex] || ""}
                        onChange={(e) => handleDoseChange(vIndex, dIndex, "doses", "dose_names", e.target.value)}
                        placeholder="Dose Name"
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addDose(vIndex, "doses")}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Add Dose
                  </button>
                </div>

                {/* Booster Doses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Booster Doses</h3>
                  {vaccination.boosters.dates.map((date, bIndex) => (
                    <div key={bIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => handleDoseChange(vIndex, bIndex, "boosters", "dates", e.target.value)}
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                      />
                      <input
                        type="text"
                        value={vaccination.boosters.dose_names[bIndex] || ""}
                        onChange={(e) => handleDoseChange(vIndex, bIndex, "boosters", "dose_names", e.target.value)}
                        placeholder="Booster Name"
                        className="px-4 py-2 w-full bg-blue-50 border border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addDose(vIndex, "boosters")}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Add Booster
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <button onClick={addVaccine} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Add New Vaccine
        </button>
        <button onClick={handleSubmit} className="mt-4 mx-6 px-4 py-2 bg-blue-500 text-white rounded">
          Submit Data
        </button>
      </div>
    </div>
  );
};

export default Vaccination;