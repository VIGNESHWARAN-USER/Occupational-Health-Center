import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function InvestigationForm({ data }) {
  console.log("Received data prop:", data); // Log incoming prop
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({});
  const [processedData, setProcessedData] = useState(null);
  const accessLevel = localStorage.getItem('accessLevel');
  console.log("Access Level:", accessLevel);

  // Function to safely get nested data
  const getNestedData = (obj, path) => {
    // Check if obj is valid before proceeding
    if (!obj) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : null, obj);
  };

  // --- Map frontend options to backend data keys ---
  // Make sure these keys exactly match the keys in your `processedData` object
  const categoryMap = {
    "HAEMATALOGY": "haematology",
    "ROUTINE SUGAR TESTS": "routinesugartests",
    "RENAL FUNCTION TEST & ELECTROLYTES": "renalfunctiontests_and_electrolytes",
    "LIPID PROFILE": "lipidprofile",
    "LIVER FUNCTION TEST": "liverfunctiontest",
    "THYROID FUNCTION TEST": "thyroidfunctiontest",
    "AUTOIMMUNE TEST": "autoimmunetest",
    "COAGULATION TEST": "coagulationtest",
    "ENZYMES & CARDIAC Profile": "enzymesandcardiacprofile",
    "URINE ROUTINE": "urineroutine",
    "SEROLOGY": "serology",
    "MOTION": "motion",
    "ROUTINE CULTURE & SENSITIVITY TEST": "routinecultureandsensitive",
    "Men's Pack": "menspack",
    "Women's Pack": "womenpack",
    "Occupational Profile": "occupationalprofile",
    "Others TEST": "otherstest",
    "OPHTHALMIC REPORT": "opthalamicreport", // Double check backend model/key spelling if issues arise
    "USG": "usg",
    "MRI": "mri",
    "X-RAY": "xray",
    "CT": "ct",
  };

  // List of all possible investigation options (display names)
  const allInvFormOptions = Object.keys(categoryMap); // Derive from map for consistency

  // Initialize state and handle data processing
  useEffect(() => {
    if (data && data.length > 0 && data[0]) {
      const initialData = data[0];
      setProcessedData(initialData);
      console.log("Processed Initial Data:", initialData);

      // Reset form when data changes (e.g., new employee)
      setSelectedOption("");
      setFormData({});
    } else {
      console.log("Data prop is empty or invalid, resetting state.");
      setProcessedData(null);
      setSelectedOption("");
      setFormData({});
    }
  }, [data]); // Re-run only when the main data prop changes

  // Initialize form data when selection changes
  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    setFormData({}); // Reset form data first

    if (selected && processedData) {
      const categoryKey = categoryMap[selected];
      const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;
      console.log(`Data for selected category (${selected} -> ${categoryKey}):`, categoryData);

      if (categoryData && typeof categoryData === 'object') {
        // Exclude metadata fields AND emp_no when setting initial form data
        const { id, latest_id, aadhar, entry_date, emp_no, ...initialFields } = categoryData;
        console.log(`Initializing form for ${selected} with:`, initialFields);
        setFormData(initialFields);
      } else {
        console.log(`No initial data found or invalid format for category: ${selected}`);
      }
    }
  };

  // Handle input changes and calculate comments
  const handleChange = (e) => {
    const { id, value } = e.target;
    const baseName = id.split('_reference_range_')[0]
                      .replace('_unit', '')
                      .replace('_comments', '');

    const valueKey = baseName;
    const rangeFromKey = `${baseName}_reference_range_from`;
    const rangeToKey = `${baseName}_reference_range_to`;
    const commentKey = `${baseName}_comments`;

    const newState = { ...formData, [id]: value };

    if (id === valueKey) {
        const currentValueStr = value;
        const fromRangeStr = newState[rangeFromKey];
        const toRangeStr = newState[rangeToKey];
        let calculatedComment = formData[commentKey] || "";

        // Check if range values exist and are not null/undefined
        const hasRangeFrom = fromRangeStr !== null && fromRangeStr !== undefined && String(fromRangeStr).trim() !== '';
        const hasRangeTo = toRangeStr !== null && toRangeStr !== undefined && String(toRangeStr).trim() !== '';

        if (hasRangeFrom && hasRangeTo) {
            const currentValue = parseFloat(currentValueStr);
            const fromRange = parseFloat(fromRangeStr);
            const toRange = parseFloat(toRangeStr);

            if (!isNaN(currentValue) && !isNaN(fromRange) && !isNaN(toRange)) {
                calculatedComment = (currentValue < fromRange || currentValue > toRange) ? "Abnormal" : "Normal";
            } else if (currentValueStr.trim() === '') {
                calculatedComment = ""; // Clear comment if value is cleared
            } else {
                 // Value is not a number, clear comment
                 calculatedComment = "";
            }
        } else if (currentValueStr.trim() === '') {
             calculatedComment = ""; // Clear comment if value is cleared and no range exists
        } else {
             // No range defined, clear comment or leave as is? Let's clear it.
             calculatedComment = "";
        }
        newState[commentKey] = calculatedComment;
    }
    setFormData(newState);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!processedData || !processedData.aadhar) {
      alert("Employee details not loaded. Cannot submit.");
      return;
    }
    if (!selectedOption) {
        alert("Please select an investigation type.");
        return;
    }

    // --- Map selected option to backend API endpoint suffix/identifier ---
    const endpointMap = {
        "HAEMATALOGY": "addInvestigation",
        "ROUTINE SUGAR TESTS": "addRoutineSugarTest",
        "RENAL FUNCTION TEST & ELECTROLYTES": "addRenalFunctionTest",
        "LIPID PROFILE": "addLipidProfile",
        "LIVER FUNCTION TEST": "addLiverFunctionTest",
        "THYROID FUNCTION TEST": "addThyroidFunctionTest",
        "AUTOIMMUNE TEST": "addAutoimmuneTest", // Added endpoint
        "COAGULATION TEST": "addCoagulationTest",
        "ENZYMES & CARDIAC Profile": "addEnzymesAndCardiacProfile",
        "URINE ROUTINE": "addUrineRoutine",
        "SEROLOGY": "addSerology",
        "MOTION": "addMotion",
        "ROUTINE CULTURE & SENSITIVITY TEST": "addCultureSensitivityTest",
        "Men's Pack": "addMensPack",
        "Women's Pack": "addWomensPack", // Added endpoint
        "Occupational Profile": "addOccupationalProfile", // Added endpoint
        "Others TEST": "addOthersTest", // Added endpoint
        "OPHTHALMIC REPORT": "addOpthalmicReport",
        "USG": "addUSG",
        "MRI": "addMRI",
        "X-RAY": "addXRay",
        "CT": "addCT",
    };

    const endpoint = endpointMap[selectedOption];
    if (!endpoint) {
        alert(`No submission endpoint configured for "${selectedOption}".`);
        return;
    }
    const url = `https://occupational-health-center-1.onrender.com/${endpoint}`; // Construct full URL

    try {
      // Ensure aadhar is included, but NOT emp_no unless specifically needed by backend
      const { emp_no, ...formDataToSend } = formData; // Remove emp_no from form data if present
      const finalPayload = { ...formDataToSend, aadhar: processedData.aadhar };
      console.log("Submitting Data:", finalPayload); // Log data being sent

      const response = await axios.post(url, finalPayload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Data submitted successfully!");
        // Consider resetting form or giving other feedback
        // setFormData({});
        // setSelectedOption("");
        // navigate('/some-success-page'); // Example navigation
      } else {
        alert(`Submission failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
       const errorMsg = error.response?.data?.detail || error.message || "An unknown error occurred.";
      alert(`Error submitting data: ${errorMsg}`);
    }
  };

  // --- Function to get today's date in YYYY-MM-DD format ---
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- Filter options for Doctor based on today's entry_date ---
  const getDoctorOptions = () => {
    if (!processedData) return [];

    const today = getTodayDateString();
    console.log("Today's Date for filtering:", today);

    return allInvFormOptions.filter(option => {
        const categoryKey = categoryMap[option];
        if (!categoryKey) return false; // Skip if no mapping

        const categoryData = getNestedData(processedData, categoryKey);
        // Check if data exists and if its entry_date matches today
        const hasDataToday = categoryData && categoryData.entry_date === today;

        // Log check result for debugging
        // console.log(`Checking ${option} (${categoryKey}): Data exists=`, !!categoryData, `Entry date=`, categoryData?.entry_date, `Matches today=`, hasDataToday);

        return hasDataToday;
    });
  };


  // Render dynamic fields based on selection
  const renderFields = (category) => {
    if (!processedData || !category) return null;

    const categoryKey = categoryMap[category];
    // Use getNestedData to safely access category data
    const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;

    if (!categoryData || typeof categoryData !== 'object') {
        console.log(`No data structure found for category: ${category}`);
        return <p className="text-gray-500 italic">No data available or structure defined for {category}.</p>;
    }

    // Get field names, excluding metadata AND emp_no
    const { id, latest_id, aadhar, entry_date, emp_no, ...filteredCategoryData } = categoryData;
    const allKeys = Object.keys(filteredCategoryData);

    // Identify base keys (those without suffixes)
    const baseKeys = allKeys.filter(key =>
        !key.endsWith('_unit') &&
        !key.endsWith('_reference_range_from') &&
        !key.endsWith('_reference_range_to') &&
        !key.endsWith('_comments') &&
        key !== 'emp_no' // Explicitly exclude emp_no here as well
    );

     // Check if baseKeys could be identified, fallback if needed
    if (baseKeys.length === 0 && allKeys.length > 0) {
        console.warn("Could not automatically determine base keys for", category, ". Displaying all relevant keys.");
        // Filter out emp_no from allKeys for the fallback rendering
        const relevantKeys = allKeys.filter(key => key !== 'emp_no');
        if (relevantKeys.length === 0) {
             return <p className="text-gray-500 italic">No displayable fields found for {category} after filtering.</p>;
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relevantKeys.map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="text" id={key} name={key}
                            // Use formData state for controlled input
                            value={formData[key] !== undefined ? formData[key] : ''}
                            onChange={handleChange}
                            className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Make editable
                        />
                    </div>
                ))}
            </div>
        );
    }


    return (
      <div className="space-y-4">
        {/* Map over baseKeys (already filtered to exclude emp_no) */}
        {baseKeys.map((baseKey) => {
          // Construct the related field names
          const valueKey = baseKey;
          const unitKey = `${baseKey}_unit`;
          const rangeFromKey = `${baseKey}_reference_range_from`;
          const rangeToKey = `${baseKey}_reference_range_to`;
          const commentKey = `${baseKey}_comments`;

          // Check if related keys exist in the original filtered data structure
          const hasUnit = allKeys.includes(unitKey);
          const hasRangeFrom = allKeys.includes(rangeFromKey);
          const hasRangeTo = allKeys.includes(rangeToKey);
          const hasComment = allKeys.includes(commentKey);

          const label = baseKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            // Using baseKey as key is fine here since it's unique within this render
            <div key={baseKey} className="grid grid-cols-1 md:grid-cols-5 gap-x-3 gap-y-2 p-3 border rounded bg-gray-50 items-end">
              {/* Column 1: Value (Editable) */}
              <div className="md:col-span-1">
                <label htmlFor={valueKey} className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  id={valueKey}
                  name={valueKey}
                  className="py-2 px-3 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Editable style
                  // Use formData state for controlled input, fallback to empty string
                  value={formData[valueKey] !== undefined ? formData[valueKey] : ""}
                  onChange={handleChange}
                  placeholder="Normal / Abnormal (Result)"
                />
              </div>

              {/* Column 2: Unit (Disabled) */}
              {hasUnit && (
                <div className="md:col-span-1">
                  <label htmlFor={unitKey} className="block text-xs font-medium text-gray-600 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    id={unitKey}
                    name={unitKey}
                    className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed" // Disabled style
                    // Use formData state, fallback to empty string
                    value={formData[unitKey] !== undefined ? formData[unitKey] : ""}
                    onChange={handleChange} // Keep handler, input is disabled but state can technically change
                    disabled
                    tabIndex={-1}
                  />
                </div>
              )}

              {/* Column 3: Range From/To (Disabled) */}
              {(hasRangeFrom || hasRangeTo) && (
                <div className="md:col-span-1 flex items-center space-x-1">
                    {/* Conditional rendering for Range From */}
                    {hasRangeFrom && (
                        <div className="flex-1">
                            <label htmlFor={rangeFromKey} className="block text-xs font-medium text-gray-600 mb-1">
                                Range From
                            </label>
                            <input
                                type="text"
                                id={rangeFromKey}
                                name={rangeFromKey}
                                className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed"
                                value={formData[rangeFromKey] !== undefined ? formData[rangeFromKey] : ""}
                                onChange={handleChange}
                                disabled
                                tabIndex={-1}
                            />
                        </div>
                    )}
                     {/* Conditional rendering for Range To */}
                    {hasRangeTo && (
                        <div className="flex-1">
                            <label htmlFor={rangeToKey} className="block text-xs font-medium text-gray-600 mb-1">
                                Range To
                            </label>
                            <input
                                type="text"
                                id={rangeToKey}
                                name={rangeToKey}
                                className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed"
                                value={formData[rangeToKey] !== undefined ? formData[rangeToKey] : ""}
                                onChange={handleChange}
                                disabled
                                tabIndex={-1}
                            />
                        </div>
                    )}
                </div>
              )}
              {/* Render a placeholder div if neither Range From nor Range To exists to maintain grid structure */}
              {!(hasRangeFrom || hasRangeTo) && <div className="md:col-span-1"></div>}


              {/* Column 4: Comments (Disabled Textarea) */}
              {hasComment && (
                <div className="md:col-span-2"> {/* Give comments more space */}
                  <label htmlFor={commentKey} className="block text-xs font-medium text-gray-600 mb-1">
                    Comments
                  </label>
                  <textarea
                    id={commentKey}
                    name={commentKey}
                    rows="1" // Keep it short
                    className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed" // Disabled style
                    value={formData[commentKey] !== undefined ? formData[commentKey] : ""}
                    onChange={handleChange} // Keep handler
                    disabled
                    tabIndex={-1}
                  />
                </div>
              )}
               {/* Render a placeholder div if no Comment field exists */}
               {!hasComment && <div className="md:col-span-2"></div>}
            </div>
          );
        })}
      </div>
    );
  };


  // Main component return
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Investigation Entry</h2>
      {!processedData && data && data.length > 0 && (
           <p className="text-center text-orange-600 my-4">Processing employee data...</p>
      )}
       {(!data || data.length === 0) && ( // Simplified condition
          <p className="text-center text-red-600 my-4">Please select an employee first.</p>
      )}

      {/* Render dropdown section only if processedData exists */}
      {processedData && (
        <div className="mb-6">
          <label htmlFor="investigations" className="block text-sm font-medium text-gray-700 mb-1">
            Select Investigation Category
          </label>
          <select
            id="investigations"
            name="investigations"
            className="py-3 px-4 mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            value={selectedOption}
            onChange={handleOptionChange}
            disabled={!processedData} // Disable if no data
          >
            <option value="">-- Select a category --</option>
            {/* Conditional Rendering based on Access Level */}
            {accessLevel === "doctor" &&
              getDoctorOptions().map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))
            }
            {accessLevel === "nurse" &&
              allInvFormOptions.map((option, index) => ( // Nurse sees all options
                <option key={index} value={option}>
                  {option}
                </option>
              ))
            }
            {/* Add other access levels if needed */}
            {accessLevel !== "doctor" && accessLevel !== "nurse" && (
                 <option value="" disabled>No investigation categories available for your role.</option>
             )}
          </select>
           {/* Message if doctor has no options for today */}
           {accessLevel === "doctor" && getDoctorOptions().length === 0 && (
                <p className="text-sm text-gray-500 mt-2 italic">No investigation records found with today's date for this employee.</p>
           )}
        </div>
      )}

      {/* Render dynamic fields and submit button */}
      {selectedOption && processedData && (
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            {renderFields(selectedOption)}
          </div>
          <div className="mt-8 flex justify-end border-t pt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-base"
              >
                Submit {selectedOption} Data
              </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default InvestigationForm;