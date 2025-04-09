import axios from "axios";
import React, { useState, useEffect } from "react"; //Import useEffect
import { useNavigate } from "react-router-dom";

function InvestigationForm({ data }) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({}); // Initialize formData state
  const [processedData, setProcessedData] = useState(null); // State to hold processed data

  // Function to safely get nested data
  const getNestedData = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Initialize state and handle data processing
  useEffect(() => {
    if (data && data.length > 0 && data[0]) {
      // Create a deep copy only if necessary, often direct use is fine if not modifying `data` prop
      const initialData = data[0]; // Use direct reference if not modifying
      setProcessedData(initialData); // Store the raw initial data
      console.log("Processed Initial Data:", initialData);

      // Reset form data when data prop changes (e.g., new employee selected)
      setSelectedOption(""); // Clear selection
      setFormData({});     // Clear form
    } else {
      setProcessedData(null);
      setSelectedOption("");
      setFormData({});
    }
  }, [data]); // Re-run when the main data prop changes

  const invFormOptions = [
    "HAEMATALOGY",
    "ROUTINE SUGAR TESTS",
    "RENAL FUNCTION TEST & ELECTROLYTES", // Added back (assuming model exists)
    "LIPID PROFILE",
    "LIVER FUNCTION TEST",
    "THYROID FUNCTION TEST",
    "AUTOIMMUNE TEST", // Assuming model exists
    "COAGULATION TEST",
    "ENZYMES & CARDIAC Profile",
    "URINE ROUTINE",
    "SEROLOGY",
    "MOTION",
    "ROUTINE CULTURE & SENSITIVITY TEST", // Added back
    "Men's Pack",
    "Women's Pack", // Assuming model exists
    "Occupational Profile", // Assuming model exists
    "Others TEST", // Assuming model exists
    "OPHTHALMIC REPORT",
    "X-RAY", // Assuming model exists
    "USG",
    "CT", // Assuming model exists
    "MRI",
  ];

  // Map frontend options to backend data keys
  const categoryMap = {
    "HAEMATALOGY": "haematology",
    "ROUTINE SUGAR TESTS": "routinesugartests",
    "RENAL FUNCTION TEST & ELECTROLYTES": "renalfunctiontest", // Match model name
    "LIPID PROFILE": "lipidprofile",
    "LIVER FUNCTION TEST": "liverfunctiontest",
    "THYROID FUNCTION TEST": "thyroidfunctiontest",
    "COAGULATION TEST": "coagulationtest",
    "ENZYMES & CARDIAC Profile": "enzymesandcardiacprofile",
    "URINE ROUTINE": "urineroutine",
    "SEROLOGY": "serology",
    "MOTION": "motion",
    "ROUTINE CULTURE & SENSITIVITY TEST": "culturesensitivitytest", // Match model name
    "Men's Pack": "menspack",
    "OPHTHALMIC REPORT": "opthalmicreport", // Check spelling if model is OphthalmicReport
    "USG": "usg", // Assuming USGReport model name
    "MRI": "mri", // Assuming MRIReport model name
    // Add mappings for other categories if needed (XRAY, CT, Women's Pack etc.)
     "X-RAY": "xray", // Example mapping
     "CT": "ct", // Example mapping
  };

  // Initialize form data when selection changes
  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);

    // Reset form data first
    setFormData({});

    if (selected && processedData) {
      const categoryKey = categoryMap[selected];
      const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;

      if (categoryData && typeof categoryData === 'object') {
        // Exclude metadata fields when setting initial form data
        const { id, latest_id, emp_no, entry_date, ...initialFields } = categoryData;
        console.log(`Initializing form for ${selected} with:`, initialFields);
        setFormData(initialFields);
      } else {
        console.log(`No initial data found or invalid format for category: ${selected}`);
      }
    }
  };

  // Handle input changes and calculate comments
  const handleChange = (e) => {
    const { id, value } = e.target; // id is the field name (e.g., "hemoglobin")

    // Determine the base name (e.g., "hemoglobin" from "hemoglobin")
    // This assumes value fields don't have suffixes like _unit, _comments etc.
    const baseName = id.split('_reference_range_')[0] // Get base name even if changing range
                      .replace('_unit', '')
                      .replace('_comments', '');

    const valueKey = baseName;
    const rangeFromKey = `${baseName}_reference_range_from`;
    const rangeToKey = `${baseName}_reference_range_to`;
    const commentKey = `${baseName}_comments`;

    // Update the changed field immediately
    const newState = {
      ...formData,
      [id]: value,
    };

    // --- Calculate comment ONLY if the main VALUE field changed ---
    if (id === valueKey) {
        const currentValueStr = value; // The new value being entered
        const fromRangeStr = newState[rangeFromKey]; // Get range from potentially updated state
        const toRangeStr = newState[rangeToKey];

        let calculatedComment = formData[commentKey] || ""; // Default to existing comment or empty

        // Only calculate if range values exist
        if (fromRangeStr !== null && fromRangeStr !== undefined && toRangeStr !== null && toRangeStr !== undefined) {
            const currentValue = parseFloat(currentValueStr);
            const fromRange = parseFloat(fromRangeStr);
            const toRange = parseFloat(toRangeStr);

            // Check if all are valid numbers
            if (!isNaN(currentValue) && !isNaN(fromRange) && !isNaN(toRange)) {
                if (currentValue < fromRange || currentValue > toRange) {
                    calculatedComment = "Abnormal";
                } else {
                    calculatedComment = "Normal";
                }
            } else if (currentValueStr.trim() === '') {
                 calculatedComment = ""; // Clear comment if value is cleared
            } else {
                // Handle cases where ranges aren't numbers or value isn't a number
                // Keep existing comment or set to empty/indicator?
                // calculatedComment = "N/A"; // Or keep existing: formData[commentKey] || ""
                // Let's clear it if value is not a number but range exists
                 if (isNaN(currentValue)) calculatedComment = "";
            }
        } else if (currentValueStr.trim() === '') {
             calculatedComment = ""; // Clear comment if value is cleared and no range exists
        }

        // Update the comment in the new state object
        newState[commentKey] = calculatedComment;
    }

    // Set the final state
    setFormData(newState);
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!processedData || !processedData.emp_no) {
      alert("Employee details not loaded. Cannot submit.");
      return;
    }
    if (!selectedOption) {
        alert("Please select an investigation type.");
        return;
    }

    let url = "";
    // Map selected option to backend API endpoint suffix/identifier
    const endpointMap = {
        "HAEMATALOGY": "addInvestigation", // Assuming this is the haematalogy endpoint
        "ROUTINE SUGAR TESTS": "addRoutineSugarTest",
        "RENAL FUNCTION TEST & ELECTROLYTES": "addRenalFunctionTest", // Match your URL pattern
        "LIPID PROFILE": "addLipidProfile",
        "LIVER FUNCTION TEST": "addLiverFunctionTest",
        "THYROID FUNCTION TEST": "addThyroidFunctionTest",
        "COAGULATION TEST": "addCoagulationTest",
        "ENZYMES & CARDIAC Profile": "addEnzymesAndCardiacProfile",
        "URINE ROUTINE": "addUrineRoutine",
        "SEROLOGY": "addSerology",
        "MOTION": "addMotion",
        "ROUTINE CULTURE & SENSITIVITY TEST": "addCultureSensitivityTest", // Match your URL pattern
        "Men's Pack": "addMensPack",
        "OPHTHALMIC REPORT": "addOpthalmicReport", // Check spelling
        "USG": "addUSG",
        "MRI": "addMRI",
        "X-RAY": "addXRay", // Example
        "CT": "addCT", // Example
        // Add other mappings
    };

    const endpoint = endpointMap[selectedOption];
    if (!endpoint) {
        alert(`No submission endpoint configured for "${selectedOption}".`);
        return;
    }
    url = `http://localhost:8000/${endpoint}`; // Construct full URL

    try {
      // Ensure emp_no is included in the data being sent
      const dataToSend = { ...formData, emp_no: processedData.emp_no };
      console.log("Submitting Data:", dataToSend);

      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Data submitted successfully!");
         // Optionally clear the form or navigate away
        // setFormData({});
        // setSelectedOption("");
      } else {
        alert(`Submission failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
       const errorMsg = error.response?.data?.detail || error.message || "An unknown error occurred.";
      alert(`Error submitting data: ${errorMsg}`);
    }
  };

  // Render dynamic fields based on selection
  const renderFields = (category) => {
    if (!processedData || !category) return null;

    const categoryKey = categoryMap[category];
    const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;

    if (!categoryData || typeof categoryData !== 'object') {
         // If no initial data for this category, maybe render empty fields based on a schema?
         // For now, return null or a message.
        console.log(`No data structure found for category: ${category}`);
        return <p className="text-gray-500 italic">No data structure available for {category}.</p>;
    }

    // Get field names, excluding metadata
    const { id, latest_id, emp_no, entry_date, ...filteredCategoryData } = categoryData;
    const allKeys = Object.keys(filteredCategoryData);

    // Identify base keys (those without suffixes)
    const baseKeys = allKeys.filter(key =>
        !key.endsWith('_unit') &&
        !key.endsWith('_reference_range_from') &&
        !key.endsWith('_reference_range_to') &&
        !key.endsWith('_comments')
    );

     // Check if baseKeys could be identified, fallback if needed
    if (baseKeys.length === 0 && allKeys.length > 0) {
        console.warn("Could not automatically determine base keys for", category, ". Displaying all.");
         // Fallback: Render all fields simply if base key logic fails
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allKeys.map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="text" id={key} name={key}
                            value={formData[key] || ''} onChange={handleChange}
                            className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                ))}
            </div>
        );
    }


    return (
      <div className="space-y-4">
        {baseKeys.map((baseKey) => {
          // Construct the related field names
          const valueKey = baseKey;
          const unitKey = `${baseKey}_unit`;
          const rangeFromKey = `${baseKey}_reference_range_from`;
          const rangeToKey = `${baseKey}_reference_range_to`;
          const commentKey = `${baseKey}_comments`;

          // Check if related keys exist in the original data structure (optional but good practice)
          const hasUnit = allKeys.includes(unitKey);
          const hasRangeFrom = allKeys.includes(rangeFromKey);
          const hasRangeTo = allKeys.includes(rangeToKey);
          const hasComment = allKeys.includes(commentKey);

          const label = baseKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <div key={baseKey} className="grid grid-cols-1 md:grid-cols-5 gap-x-3 gap-y-2 p-3 border rounded bg-gray-50 items-end">
              {/* Column 1: Value (Editable) */}
              <div className="md:col-span-1">
                <label htmlFor={valueKey} className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type="text" // Use text initially, can change to number if strict validation needed
                  id={valueKey}
                  name={valueKey}
                  className="py-2 px-3 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Editable style
                  value={formData[valueKey] || ""}
                  onChange={handleChange}
                  placeholder="Result"
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
                    value={formData[unitKey] || ""}
                    onChange={handleChange} // Keep handler if needed, but field is disabled
                    disabled
                    tabIndex={-1} // Remove from tab order
                  />
                </div>
              )}

              {/* Column 3: Range From/To (Disabled) */}
              {(hasRangeFrom || hasRangeTo) && (
                <div className="md:col-span-1 flex items-center space-x-1">
                  {hasRangeFrom && (
                     <div className="flex-1">
                        <label htmlFor={rangeFromKey} className="block text-xs font-medium text-gray-600 mb-1">
                            Range From
                        </label>
                        <input
                            type="text"
                            id={rangeFromKey}
                            name={rangeFromKey}
                            className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed" // Disabled style
                            value={formData[rangeFromKey] || ""}
                            onChange={handleChange}
                            disabled
                            tabIndex={-1}
                        />
                    </div>
                  )}
                   {hasRangeTo && (
                     <div className="flex-1">
                         <label htmlFor={rangeToKey} className="block text-xs font-medium text-gray-600 mb-1">
                            Range To
                        </label>
                        <input
                            type="text"
                            id={rangeToKey}
                            name={rangeToKey}
                            className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm cursor-not-allowed" // Disabled style
                            value={formData[rangeToKey] || ""}
                            onChange={handleChange}
                            disabled
                            tabIndex={-1}
                        />
                    </div>
                  )}
                </div>
              )}


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
                    value={formData[commentKey] || ""}
                    onChange={handleChange}
                    disabled
                    tabIndex={-1}
                  />
                </div>
              )}
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
       {!data || data.length === 0 && (
          <p className="text-center text-red-600 my-4">Please select an employee first.</p>
      )}

      {/* Render dropdown only if processedData exists */}
      {processedData && (
        <div className="mb-6">
          <label htmlFor="investigations" className="block text-sm font-medium text-gray-700 mb-1">
            Select Investigation Category
          </label>
          <select
            id="investigations"
            name="investigations"
            className="py-3 px-4 mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base" // Larger text
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="">-- Select a category --</option>
            {invFormOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render dynamic fields and submit button */}
      {selectedOption && processedData && (
        <form onSubmit={handleSubmit}> {/* Wrap fields and button in form */}
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