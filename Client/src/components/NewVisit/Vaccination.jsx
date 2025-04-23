import React, { useState, useEffect } from "react";
import axios from "axios";

const Vaccination = ({ data }) => {
  const [vaccinationData, setVaccinationData] = useState([]);
  const emp_no = data?.[0]?.aadhar; // Use optional chaining for safer access

  // Check if data or emp_no is missing early
  if (!data || data.length === 0 || !emp_no) {
    return (
      <div className="mt-4 bg-white rounded-lg shadow-md p-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Vaccination Information
        </h1>
        <p className="p-4 text-center text-gray-500 italic">
          Employee data not available. Cannot display or add vaccination records.
        </p>
      </div>
    );
  }

  // Effect to load initial data
  useEffect(() => {
    // Check for nested structure and ensure it's an array
    const initialVaccines = data[0]?.vaccination?.vaccination;
    if (Array.isArray(initialVaccines) && initialVaccines.length > 0) {
        // Ensure each loaded vaccine has the necessary fields, including the new one
        const sanitizedData = initialVaccines.map(vac => ({
            disease_name: vac.disease_name || "", // Add default
            vaccine_name: vac.vaccine_name || "",
            status: vac.status || "",
            doses: vac.doses && Array.isArray(vac.doses.dates) && Array.isArray(vac.doses.dose_names)
                   ? { dates: vac.doses.dates, dose_names: vac.doses.dose_names }
                   : { dates: [], dose_names: [] }, // Default if structure is wrong/missing
            boosters: vac.boosters && Array.isArray(vac.boosters.dates) && Array.isArray(vac.boosters.dose_names)
                      ? { dates: vac.boosters.dates, dose_names: vac.boosters.dose_names }
                      : { dates: [], dose_names: [] }, // Default
        }));
      setVaccinationData(sanitizedData);
    } else {
        // If no data in props, initialize as empty array
        setVaccinationData([]);
    }
  }, [data]); // Depend only on the data prop

  // Add a new empty vaccine record structure
  const addVaccine = () => {
    setVaccinationData([
      ...vaccinationData,
      {
        disease_name: "", // Add disease_name field here
        vaccine_name: "",
        status: "",
        doses: { dates: [], dose_names: [] },
        boosters: { dates: [], dose_names: [] },
      },
    ]);
  };

  // Handle submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: Check if at least one vaccine record exists
    if (vaccinationData.length === 0) {
        alert("Please add at least one vaccine record before submitting.");
        return;
    }
    // Optional: Validate required fields within each record
    const isValid = vaccinationData.every(vac => vac.disease_name && vac.vaccine_name && vac.status);
    if (!isValid) {
        alert("Please ensure Disease Name, Vaccine Name, and Status are filled for all records.");
        return;
    }

    try {
      await axios.post("https://occupational-health-center-1.onrender.com/vaccination/", {
        aadhar: aadhar,
        vaccination: vaccinationData, // Send the array directly
      });
      alert("Vaccination data submitted successfully!");
    } catch (error) {
      console.error("Error submitting vaccination data:", error);
      const errorMsg = error.response?.data?.detail || "Failed to submit vaccination data.";
      alert(`Error: ${errorMsg}`);
    }
  };

  // Handle changes in top-level fields (disease, vaccine, status)
  const handleChange = (index, field, value) => {
    const updatedData = vaccinationData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
    );
    setVaccinationData(updatedData);
  };

  // Add a new dose/booster entry (date and name)
  const addDoseOrBooster = (vIndex, type) => { // Renamed for clarity
    const updatedData = [...vaccinationData];
    // Ensure the structure exists before pushing
    if (!updatedData[vIndex][type]) {
        updatedData[vIndex][type] = { dates: [], dose_names: [] };
    } else {
        if (!Array.isArray(updatedData[vIndex][type].dates)) updatedData[vIndex][type].dates = [];
        if (!Array.isArray(updatedData[vIndex][type].dose_names)) updatedData[vIndex][type].dose_names = [];
    }
    updatedData[vIndex][type].dates.push("");
    updatedData[vIndex][type].dose_names.push("");
    setVaccinationData(updatedData);
  };

  // Handle changes within dose/booster date or name inputs
  const handleDoseOrBoosterChange = (vIndex, dIndex, type, field, value) => { // Renamed for clarity
    const updatedData = [...vaccinationData];
    // Defensive check for nested structure existence
    if (updatedData[vIndex]?.[type]?.[field]?.[dIndex] !== undefined) {
        updatedData[vIndex][type][field][dIndex] = value;
        setVaccinationData(updatedData);
    } else {
        console.error("Error updating dose/booster: Invalid structure access.");
    }
  };

   // Remove a specific vaccine record
   const removeVaccine = (indexToRemove) => {
        const updatedData = vaccinationData.filter((_, index) => index !== indexToRemove);
        setVaccinationData(updatedData);
    };

     // Remove a specific dose/booster entry
    const removeDoseOrBooster = (vIndex, dIndex, type) => {
        const updatedData = [...vaccinationData];
        if (updatedData[vIndex]?.[type]?.dates && updatedData[vIndex]?.[type]?.dose_names) {
            updatedData[vIndex][type].dates.splice(dIndex, 1);
            updatedData[vIndex][type].dose_names.splice(dIndex, 1);
            setVaccinationData(updatedData);
        }
    };


  return (
    <div className="mt-4 bg-white rounded-lg shadow-md p-6"> {/* Increased padding */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Vaccination Information
      </h1>

      {/* Conditionally render based on records */}
      {vaccinationData.length === 0 ? (
        <div className="text-center py-4">
            <p className="text-gray-500 mb-3">No vaccination records added yet.</p>
             <button onClick={addVaccine} className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition duration-200">
                 Add First Vaccine Record
             </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}> {/* Wrap list and buttons in form */}
          {vaccinationData?.map((vaccination, vIndex) => (
            // Use a unique key if possible, like a combination or temporary ID
            <div key={`vaccine-${vIndex}`} className="mb-6 p-4 border rounded-md bg-gray-50 relative"> {/* Added relative positioning for remove button */}
                {/* Remove Vaccine Button */}
                <button
                    type="button" // Prevent form submission
                    onClick={() => removeVaccine(vIndex)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs leading-none w-5 h-5 flex items-center justify-center hover:bg-red-600 transition duration-200"
                    aria-label="Remove this vaccine record"
                >
                    × {/* Simple X icon */}
                </button>

               {/* Disease, Vaccine Name, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"> {/* Use 3 columns */}
                <div>
                  <label htmlFor={`disease_name_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Disease Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id={`disease_name_${vIndex}`}
                    value={vaccination.disease_name || ''} // Ensure controlled input
                    onChange={(e) => handleChange(vIndex, "disease_name", e.target.value)}
                    placeholder="e.g., COVID-19, Hepatitis B"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`vaccine_name_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id={`vaccine_name_${vIndex}`}
                    value={vaccination.vaccine_name || ''}
                    onChange={(e) => handleChange(vIndex, "vaccine_name", e.target.value)}
                    placeholder="e.g., Pfizer, Covaxin"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                 <div>
                    <label htmlFor={`status_${vIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                    {/* Use a select dropdown for better control */}
                    <select
                      id={`status_${vIndex}`}
                      value={vaccination.status || ''}
                      onChange={(e) => handleChange(vIndex, "status", e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                       <option value="" disabled>Select status...</option>
                       <option value="Completed">Completed</option>
                       <option value="In Progress">Partial</option>
                    </select>
                 </div>
              </div>

              {/* Doses and Boosters Section */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Normal Doses Column */}
                <div>
                  <h3 className="block text-sm font-semibold text-gray-700 mb-2">Doses</h3>
                  {(vaccination.doses?.dates?.length ?? 0) === 0 ? (
                       <p className="text-xs text-gray-500 italic">No doses added.</p>
                  ) : (
                    vaccination.doses.dates.map((date, dIndex) => (
                      <div key={`dose-${vIndex}-${dIndex}`} className="flex items-center gap-2 mt-1">
                        <input
                          type="date"
                          value={date || ''} // Ensure controlled input
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, dIndex, "doses", "dates", e.target.value)}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                          aria-label={`Dose ${dIndex + 1} Date`}
                        />
                        <input
                          type="text"
                          value={vaccination.doses.dose_names[dIndex] || ""}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, dIndex, "doses", "dose_names", e.target.value)}
                          placeholder={`Dose ${dIndex + 1} Name`}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                          aria-label={`Dose ${dIndex + 1} Name`}
                        />
                         <button
                            type="button"
                            onClick={() => removeDoseOrBooster(vIndex, dIndex, "doses")}
                            className="p-1 bg-red-100 text-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center hover:bg-red-200"
                            aria-label={`Remove Dose ${dIndex + 1}`}
                         >
                            ×
                         </button>
                      </div>
                    ))
                  )}
                  <button
                    type="button" // Prevent form submission
                    onClick={() => addDoseOrBooster(vIndex, "doses")}
                    className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition duration-200"
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
                          value={date || ''}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, bIndex, "boosters", "dates", e.target.value)}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                          aria-label={`Booster ${bIndex + 1} Date`}
                        />
                        <input
                          type="text"
                          value={vaccination.boosters.dose_names[bIndex] || ""}
                          onChange={(e) => handleDoseOrBoosterChange(vIndex, bIndex, "boosters", "dose_names", e.target.value)}
                          placeholder={`Booster ${bIndex + 1} Name`}
                          className="py-1 px-2 flex-grow bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                          aria-label={`Booster ${bIndex + 1} Name`}
                        />
                         <button
                            type="button"
                            onClick={() => removeDoseOrBooster(vIndex, bIndex, "boosters")}
                            className="p-1 bg-red-100 text-red-600 rounded-full text-xs w-5 h-5 flex items-center justify-center hover:bg-red-200"
                            aria-label={`Remove Booster ${bIndex + 1}`}
                         >
                            ×
                         </button>
                      </div>
                    ))
                  )}
                  <button
                     type="button" // Prevent form submission
                    onClick={() => addDoseOrBooster(vIndex, "boosters")}
                    className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition duration-200"
                  >
                    + Add Booster
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons outside the map loop */}
          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
                type="button" // Prevent form submission
                onClick={addVaccine}
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm mr-3 hover:bg-blue-600 transition duration-200"
            >
              Add Another Vaccine
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition duration-200"
            >
              Submit All Vaccination Data
            </button>
          </div>
        </form> // End of form
      )}
    </div> // End of component wrapper
  );
};

export default Vaccination;