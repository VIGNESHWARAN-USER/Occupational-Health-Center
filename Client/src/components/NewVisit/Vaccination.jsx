import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Define a default empty structure for clarity and reuse
const defaultVaccineRecord = {
  disease_name: "",
  vaccine_name: "",
  status: "",
  doses: { dates: [], dose_names: [] },
  boosters: { dates: [], dose_names: [] },
};

const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Added for submit feedback
  const [error, setError] = useState(null); // Added for displaying submit errors

  // Safely extract emp_no (aadhar)
  // Use useCallback to memoize this value if needed elsewhere, though simple extraction is fine here.
  const emp_no = data?.[0]?.aadhar;

  // --- Effect to Load Initial Data ---
  useEffect(() => {
    // Reset state when data prop changes fundamentally (e.g., new employee loaded)
    setVaccinationData([]); // Clear previous data first

    // Safely access nested data
    const initialVaccines = data?.[0]?.vaccination?.vaccination;

    if (Array.isArray(initialVaccines) && initialVaccines.length > 0) {
      // Sanitize and ensure each loaded vaccine has the full structure
      const sanitizedData = initialVaccines.map((vac) => ({
        disease_name: vac?.disease_name || "", // Use optional chaining and defaults
        vaccine_name: vac?.vaccine_name || "",
        status: vac?.status || "",
        // Ensure doses/boosters structure exists and arrays are present
        doses: {
          dates: Array.isArray(vac?.doses?.dates) ? vac.doses.dates : [],
          dose_names: Array.isArray(vac?.doses?.dose_names) ? vac.doses.dose_names : [],
        },
        boosters: {
          dates: Array.isArray(vac?.boosters?.dates) ? vac.boosters.dates : [],
          dose_names: Array.isArray(vac?.boosters?.dose_names) ? vac.boosters.dose_names : [],
        },
      }));
      setVaccinationData(sanitizedData);
    }
    // If no valid initialVaccines found, state remains an empty array (set above)

  }, [data]); // Re-run ONLY when the main 'data' prop changes


  // --- State Update Handlers (Memoized with useCallback for potential performance benefits) ---

  const addVaccine = useCallback(() => {
    setVaccinationData((prevData) => [
      ...prevData,
      { ...defaultVaccineRecord }, // Use the default structure
    ]);
  }, []); // Empty dependency array: function never needs to change

  const removeVaccine = useCallback((indexToRemove) => {
    setVaccinationData((prevData) =>
      prevData.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleChange = useCallback((index, field, value) => {
    setVaccinationData((prevData) =>
      prevData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const addDoseOrBooster = useCallback((vIndex, type) => { // type is 'doses' or 'boosters'
    setVaccinationData((prevData) => {
      // Create a deep copy to avoid direct state mutation issues
      const updatedData = prevData.map(item => ({
          ...item,
          doses: { ...item.doses, dates: [...item.doses.dates], dose_names: [...item.doses.dose_names] },
          boosters: { ...item.boosters, dates: [...item.boosters.dates], dose_names: [...item.boosters.dose_names] },
      }));

      // Ensure the structure exists (though it should due to initialization)
      if (updatedData[vIndex] && updatedData[vIndex][type]) {
        updatedData[vIndex][type].dates.push("");
        updatedData[vIndex][type].dose_names.push("");
      }
      return updatedData;
    });
  }, []);

  const removeDoseOrBooster = useCallback((vIndex, dIndex, type) => {
    setVaccinationData((prevData) => {
       const updatedData = prevData.map(item => ({
          ...item,
          doses: { ...item.doses, dates: [...item.doses.dates], dose_names: [...item.doses.dose_names] },
          boosters: { ...item.boosters, dates: [...item.boosters.dates], dose_names: [...item.boosters.dose_names] },
      }));

      if (updatedData[vIndex]?.[type]?.dates && updatedData[vIndex]?.[type]?.dose_names) {
        updatedData[vIndex][type].dates.splice(dIndex, 1);
        updatedData[vIndex][type].dose_names.splice(dIndex, 1);
      }
      return updatedData;
    });
  }, []);

  const handleDoseOrBoosterChange = useCallback((vIndex, dIndex, type, field, value) => { // field is 'dates' or 'dose_names'
    setVaccinationData((prevData) => {
       const updatedData = prevData.map(item => ({
          ...item,
          doses: { ...item.doses, dates: [...item.doses.dates], dose_names: [...item.doses.dose_names] },
          boosters: { ...item.boosters, dates: [...item.boosters.dates], dose_names: [...item.boosters.dose_names] },
      }));

      // Use optional chaining for safer access
      if (updatedData[vIndex]?.[type]?.[field]?.[dIndex] !== undefined) {
        updatedData[vIndex][type][field][dIndex] = value;
      } else {
         console.error("Error updating dose/booster: Invalid structure access.", {vIndex, dIndex, type, field});
      }
      return updatedData;
    });
  }, []);


  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!emp_no) {
        setError("Employee Aadhar number is missing. Cannot submit.");
        alert("Employee Aadhar number is missing. Cannot submit."); // Keep alert for immediate feedback if needed
        return;
    }

    if (vaccinationData.length === 0) {
      setError("Please add at least one vaccine record before submitting.");
      alert("Please add at least one vaccine record before submitting.");
      return;
    }

    const isValid = vaccinationData.every(
      (vac) => vac.disease_name && vac.vaccine_name && vac.status
    );
    if (!isValid) {
      setError("Please ensure Disease Name, Vaccine Name, and Status are filled for all records.");
      alert("Please ensure Disease Name, Vaccine Name, and Status are filled for all records.");
      return;
    }

    setIsLoading(true);
    try {
      // *** FIXED THE BUG HERE: Use emp_no instead of undefined 'aadhar' ***
      await axios.post("https://occupational-health-center-1.onrender.com/vaccination/", {
        aadhar: emp_no, // Corrected variable name
        vaccination: vaccinationData,
      });
      alert("Vaccination data submitted successfully!");
      // Optionally clear form or redirect after success
    } catch (err) {
      console.error("Error submitting vaccination data:", err);
      const errorMsg = err.response?.data?.detail || "Failed to submit vaccination data.";
      setError(`Submission Error: ${errorMsg}`);
      alert(`Error: ${errorMsg}`); // Keep alert for immediate feedback
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Logic ---

  // Early return if essential data is missing
  if (!emp_no) {
    return (
      <div className="mt-4 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Vaccination Information
        </h1>
        <p className="p-4 text-center text-red-600 font-medium">
          Employee Aadhar data not available. Cannot display or add vaccination records.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Vaccination Information for Aadhar: {emp_no}
      </h1>

      {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

      {vaccinationData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">No vaccination records added yet.</p>
          <button
            onClick={addVaccine}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            Add First Vaccine Record
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {vaccinationData.map((vaccination, vIndex) => (
            // Using index as key is acceptable if list isn't reordered, but prefer stable IDs if available
            <div key={`vaccine-${vIndex}`} className="mb-6 p-4 border rounded-md bg-gray-50 relative">
              {/* Remove Vaccine Button */}
              <button
                type="button"
                onClick={() => removeVaccine(vIndex)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs leading-none w-5 h-5 flex items-center justify-center hover:bg-red-600 transition duration-200 disabled:opacity-50"
                aria-label="Remove this vaccine record"
                disabled={isLoading}
              >
                ×
              </button>

              {/* Disease, Vaccine Name, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor={`disease_name_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Disease Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id={`disease_name_${vIndex}`}
                    value={vaccination.disease_name} // No need for || '' if default structure is used
                    onChange={(e) => handleChange(vIndex, "disease_name", e.target.value)}
                    placeholder="e.g., COVID-19, Hepatitis B"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor={`vaccine_name_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id={`vaccine_name_${vIndex}`}
                    value={vaccination.vaccine_name}
                    onChange={(e) => handleChange(vIndex, "vaccine_name", e.target.value)}
                    placeholder="e.g., Pfizer, Covaxin"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    required
                    disabled={isLoading}
                  />
                </div>
                 <div>
                    <label htmlFor={`status_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                    <select
                      id={`status_${vIndex}`}
                      value={vaccination.status}
                      onChange={(e) => handleChange(vIndex, "status", e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                      required
                      disabled={isLoading}
                    >
                       <option value="" disabled>Select status...</option>
                       <option value="Completed">Completed</option>
                       <option value="Partial">Partial</option> {/* Changed In Progress to Partial based on dropdown? */}
                       <option value="Not Taken">Not Taken</option> {/* Added option */}
                    </select>
                 </div>
              </div>

              {/* Doses and Boosters Section */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doses Column */}
                <div>
                  <h3 className="block text-sm font-semibold text-gray-700 mb-2">Doses</h3>
                  {(vaccination.doses?.dates?.length ?? 0) === 0 ? (
                       <p className="text-xs text-gray-500 italic">No doses added.</p>
                  ) : (
                    vaccination.doses.dates.map((date, dIndex) => (
                      <div key={`dose-${vIndex}-${dIndex}`} className="flex items-center gap-2 mt-1">
                        <input
                          type="date"
                          value={date} // Defaults handled upstream
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, dIndex, "doses", "dates", e.target.value)}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm disabled:bg-gray-100"
                          aria-label={`Dose ${dIndex + 1} Date`}
                          disabled={isLoading}
                        />
                        <input
                          type="text"
                          value={vaccination.doses.dose_names[dIndex]}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, dIndex, "doses", "dose_names", e.target.value)}
                          placeholder={`Dose ${dIndex + 1} Name`}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm disabled:bg-gray-100"
                          aria-label={`Dose ${dIndex + 1} Name`}
                          disabled={isLoading}
                        />
                         <button
                            type="button"
                            onClick={() => removeDoseOrBooster(vIndex, dIndex, "doses")}
                            className="p-1 bg-red-100 text-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Remove Dose ${dIndex + 1}`}
                            disabled={isLoading}
                         >
                            ×
                         </button>
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => addDoseOrBooster(vIndex, "doses")}
                    className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    + Add Dose
                  </button>
                </div>

                {/* Booster Doses Column */}
                <div>
                  <h3 className="block text-sm font-semibold text-gray-700 mb-2">Boosters</h3>
                   {(vaccination.boosters?.dates?.length ?? 0) === 0 ? (
                       <p className="text-xs text-gray-500 italic">No boosters added.</p>
                  ) : (
                    vaccination.boosters.dates.map((date, bIndex) => (
                      <div key={`booster-${vIndex}-${bIndex}`} className="flex items-center gap-2 mt-1">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, bIndex, "boosters", "dates", e.target.value)}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm disabled:bg-gray-100"
                          aria-label={`Booster ${bIndex + 1} Date`}
                          disabled={isLoading}
                        />
                        <input
                          type="text"
                          value={vaccination.boosters.dose_names[bIndex]}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, bIndex, "boosters", "dose_names", e.target.value)}
                          placeholder={`Booster ${bIndex + 1} Name`}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm disabled:bg-gray-100"
                          aria-label={`Booster ${bIndex + 1} Name`}
                          disabled={isLoading}
                        />
                         <button
                            type="button"
                            onClick={() => removeDoseOrBooster(vIndex, bIndex, "boosters")}
                            className="p-1 bg-red-100 text-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Remove Booster ${bIndex + 1}`}
                            disabled={isLoading}
                         >
                            ×
                         </button>
                      </div>
                    ))
                  )}
                  <button
                     type="button"
                    onClick={() => addDoseOrBooster(vIndex, "boosters")}
                    className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    + Add Booster
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end items-center mt-6 pt-4 border-t">
             {isLoading && <span className="text-sm text-gray-500 mr-4">Submitting...</span>}
            <button
                type="button"
                onClick={addVaccine}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm mr-3 hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
              Add Another Vaccine
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit All Vaccination Data"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Vaccination;