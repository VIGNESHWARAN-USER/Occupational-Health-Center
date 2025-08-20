import axios from "axios";
import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate is not used in the current version

// --- Helper: Icon for expand/collapse ---
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);


// CHANGED: Accept mrdNo as a prop
function InvestigationForm({ data, mrdNo }) {
  console.log("Received data prop:", data);
  console.log("Received mrdNo prop:", mrdNo); // Log the new prop

  const [formData, setFormData] = useState({});
  const [processedData, setProcessedData] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeCategoryForForm, setActiveCategoryForForm] = useState("");

  const accessLevel = localStorage.getItem('accessLevel');
  console.log("Access Level:", accessLevel);

  const getNestedData = (obj, path) => {
    if (!obj) return null;
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : null, obj);
  };

  const categoryMap = {
    "HAEMATALOGY": "heamatalogy",
    "ROUTINE SUGAR TESTS": "routinesugartests",
    "RENAL FUNCTION TEST & ELECTROLYTES": "renalfunctiontests_and_electrolytes",
    "LIPID PROFILE": "lipidprofile",
    "LIVER FUNCTION TEST": "liverfunctiontest",
    "THYROID FUNCTION TEST": "thyroidfunctiontest",
    "AUTOIMMUNE TEST": "autoimmunetest",
    "COAGULATION TEST": "coagulationtest",
    "ENZYMES & CARDIAC Profile": "enzymescardiacprofile",
    "URINE ROUTINE": "urineroutinetest",
    "SEROLOGY": "serologytest",
    "MOTION": "motiontest",
    "ROUTINE CULTURE & SENSITIVITY TEST": "culturesensitivitytest",
    "Men's Pack": "menspack",
    "Women's Pack": "womenspack",
    "Occupational Profile": "occupationalprofile",
    "Others TEST": "otherstest",
    "OPHTHALMIC REPORT": "ophthalmicreport",
    "USG": "usg",
    "MRI": "mri",
    "X-RAY": "xray",
    "CT": "ct",
  };

  const allInvFormOptions = Object.keys(categoryMap);

  useEffect(() => {
    if (data && data.length > 0 && data[0]) {
      const initialData = data[0];
      setProcessedData(initialData);
      console.log("Processed Initial Data:", initialData);
      setExpandedCategories({});
      setActiveCategoryForForm("");
      setFormData({});
    } else {
      console.log("Data prop is empty or invalid, resetting all states.");
      setProcessedData(null);
      setExpandedCategories({});
      setActiveCategoryForForm("");
      setFormData({});
    }
  }, [data]);
  
  // CHANGED: This effect will update the form's MRD number if it's generated after a form is already open.
  useEffect(() => {
    if (mrdNo && activeCategoryForForm) {
      setFormData(prevData => ({ ...prevData, mrdNo: mrdNo }));
    }
  }, [mrdNo, activeCategoryForForm]);


  const toggleCategory = (categoryName) => {
    const isCurrentlyExpanded = expandedCategories[categoryName];
    let newActiveCategory = "";
    const newExpandedState = {};

    if (!isCurrentlyExpanded) {
      allInvFormOptions.forEach(opt => {
        newExpandedState[opt] = (opt === categoryName);
      });
      newActiveCategory = categoryName;

      if (processedData) {
        const categoryKey = categoryMap[categoryName];
        const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;
        console.log(`Populating form for ${categoryName} (key: ${categoryKey}):`, categoryData);
        if (categoryData && typeof categoryData === 'object') {
          // CHANGED: We explicitly ignore the old mrdNo from fetched data
          const { id, latest_id, aadhar, checked, entry_date, emp_no, mrdNo: oldMrdNo, ...initialFields } = categoryData;
          // CHANGED: We set the form data using fields from the database BUT inject the NEW mrdNo from props
          setFormData({ ...initialFields, mrdNo: mrdNo || "" });
        } else {
          console.log(`No data or invalid structure for ${categoryName}, resetting form.`);
          // CHANGED: Even for a new form, we set the new mrdNo
          setFormData({ mrdNo: mrdNo || "" });
        }
      }
    } else {
      allInvFormOptions.forEach(opt => {
        newExpandedState[opt] = false;
      });
      newActiveCategory = "";
      setFormData({});
    }

    setExpandedCategories(newExpandedState);
    setActiveCategoryForForm(newActiveCategory);
  };


  const handleChange = (e) => {
    // ... (This function remains unchanged)
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

        const hasRangeFrom = fromRangeStr !== null && fromRangeStr !== undefined && String(fromRangeStr).trim() !== '';
        const hasRangeTo = toRangeStr !== null && toRangeStr !== undefined && String(toRangeStr).trim() !== '';

        if (hasRangeFrom && hasRangeTo) {
            const currentValue = parseFloat(currentValueStr);
            const fromRange = parseFloat(fromRangeStr);
            const toRange = parseFloat(toRangeStr);

            if (!isNaN(currentValue) && !isNaN(fromRange) && !isNaN(toRange)) {
                calculatedComment = (currentValue < fromRange || currentValue > toRange) ? "Abnormal" : "Normal";
            } else if (currentValueStr.trim() === '') {
                calculatedComment = "";
            } else {
                 calculatedComment = "";
            }
        } else if (currentValueStr.trim() === '') {
             calculatedComment = "";
        } else {
             calculatedComment = "";
        }
        newState[commentKey] = calculatedComment;
    }
    setFormData(newState);
  };

  const handleSubmit = async (e, categoryNameToSubmit) => {
    e.preventDefault();

    if (!processedData || !processedData.aadhar) {
      alert("Employee details not loaded. Cannot submit.");
      return;
    }
    
    // CHANGED: Add a check for the mrdNo from props
    if (!mrdNo) {
      alert("MRD Number for this visit is missing. Please click 'Add Entry' first.");
      return;
    }

    if (!categoryNameToSubmit) {
        alert("Internal error: Category to submit is not defined.");
        return;
    }

    const endpointMap = {
        "HAEMATALOGY": "addInvestigation",
        "ROUTINE SUGAR TESTS": "addRoutineSugarTest",
        "RENAL FUNCTION TEST & ELECTROLYTES": "addRenalFunctionTest",
        "LIPID PROFILE": "addLipidProfile",
        "LIVER FUNCTION TEST": "addLiverFunctionTest",
        "THYROID FUNCTION TEST": "addThyroidFunctionTest",
        "AUTOIMMUNE TEST": "addAutoimmuneFunctionTest",
        "COAGULATION TEST": "addCoagulationTest",
        "ENZYMES & CARDIAC Profile": "addEnzymesAndCardiacProfile",
        "URINE ROUTINE": "addUrineRoutine",
        "SEROLOGY": "addSerology",
        "MOTION": "addMotion",
        "ROUTINE CULTURE & SENSITIVITY TEST": "addCultureSensitivityTest",
        "Men's Pack": "addMensPack",
        "Women's Pack": "addWomensPack",
        "Occupational Profile": "addOccupationalprofile",
        "Others TEST": "addOtherstest",
        "OPHTHALMIC REPORT": "addOpthalmicReport",
        "USG": "addUSG",
        "MRI": "addMRI",
        "X-RAY": "addXRay",
        "CT": "addCT",
    };

    const endpoint = endpointMap[categoryNameToSubmit];
    if (!endpoint) {
        alert(`No submission endpoint configured for "${categoryNameToSubmit}".`);
        return;
    }
    const url = `http://localhost:8000/${endpoint}`;

    try {
      // CHANGED: The payload now correctly uses formData which includes the new mrdNo.
      const { emp_no, ...formDataToSend } = formData;
      const finalPayload = { 
        ...formDataToSend, 
        aadhar: processedData.aadhar,
        mrdNo: mrdNo,
        accessLevel: accessLevel
      };
      
      console.log(`Submitting Data for ${categoryNameToSubmit}:`, finalPayload);

      const response = await axios.post(url, finalPayload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        alert(`${categoryNameToSubmit} data submitted successfully!`);
      } else {
        alert(`Submission for ${categoryNameToSubmit} failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error submitting ${categoryNameToSubmit} form:`, error);
      const errorMsg = error.response?.data?.detail || error.message || "An unknown error occurred.";
      alert(`Error submitting data for ${categoryNameToSubmit}: ${errorMsg}`);
    }
  };

  const getDoctorOptions = () => {
    // ... (This function remains unchanged)
    if (!processedData) return [];
    return allInvFormOptions.filter(option => {
        const categoryKey = categoryMap[option];
        if (!categoryKey) return false;
        const categoryData = getNestedData(processedData, categoryKey);
        return categoryData && categoryData.checked === true;
    });
  };

  const renderFields = (category) => {
    // ... (This function remains unchanged)
    if (!processedData || !category) return null;

    const categoryKey = categoryMap[category];
    const categoryData = categoryKey ? getNestedData(processedData, categoryKey) : null;

    if (!categoryData || typeof categoryData !== 'object') {
        console.log(`No data structure found for category: ${category}`);
        return <p className="text-gray-500 italic p-4">No data available or structure defined for {category}.</p>;
    }

    const { id, latest_id, aadhar,checked,entry_date, emp_no, ...filteredCategoryData } = categoryData;
    const allKeys = Object.keys(filteredCategoryData);

    const baseKeys = allKeys.filter(key =>
        !key.endsWith('_unit') &&
        !key.endsWith('_reference_range_from') &&
        !key.endsWith('_reference_range_to') &&
        !key.endsWith('_comments') &&
        key !== 'emp_no' && 
        key !== 'mrdNo' // Also ignore mrdNo for rendering
    );

    if (baseKeys.length === 0 && allKeys.length > 0) {
        console.warn("Could not automatically determine base keys for", category, ". Displaying all relevant keys.");
        const relevantKeys = allKeys.filter(key => key !== 'emp_no');
        if (relevantKeys.length === 0) {
             return <p className="text-gray-500 italic p-4">No displayable fields found for {category} after filtering.</p>;
        }
        return (
            <div className="p-4 border-t grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relevantKeys.map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/_/g, ' ')}
                        </label>
                        <input
                            type="text" id={key} name={key}
                            value={formData[key] !== undefined ? formData[key] : ''}
                            onChange={handleChange}
                            className="mt-1 py-2 px-3 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
      <div className="space-y-4 p-4 border-t">
        {baseKeys.map((baseKey) => {
          const valueKey = baseKey;
          const unitKey = `${baseKey}_unit`;
          const rangeFromKey = `${baseKey}_reference_range_from`;
          const rangeToKey = `${baseKey}_reference_range_to`;
          const commentKey = `${baseKey}_comments`;

          const hasUnit = allKeys.includes(unitKey);
          const hasRangeFrom = allKeys.includes(rangeFromKey);
          const hasRangeTo = allKeys.includes(rangeToKey);
          const hasComment = allKeys.includes(commentKey);

          const label = baseKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <div key={baseKey} className="grid grid-cols-1 md:grid-cols-5 gap-x-3 gap-y-2 p-3 border rounded bg-gray-50 items-end">
              <div className="md:col-span-1">
                <label htmlFor={valueKey} className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type="text" id={valueKey} name={valueKey}
                  className="py-2 px-3 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={formData[valueKey] !== undefined ? formData[valueKey] : ""}
                  onChange={handleChange}
                  placeholder="Normal / Abnormal (Result)"
                />
              </div>
              {hasUnit && (
                <div className="md:col-span-1">
                  <label htmlFor={unitKey} className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                  <input type="text" id={unitKey} name={unitKey}
                    className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm "
                    value={formData[unitKey] !== undefined ? formData[unitKey] : ""}
                    onChange={handleChange}  tabIndex={-1} />
                </div>
              )}
              {(hasRangeFrom || hasRangeTo) && (
                <div className="md:col-span-1 flex items-center space-x-1">
                    {hasRangeFrom && (
                        <div className="flex-1">
                            <label htmlFor={rangeFromKey} className="block text-xs font-medium text-gray-600 mb-1">Range From</label>
                            <input type="text" id={rangeFromKey} name={rangeFromKey}
                                className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm "
                                value={formData[rangeFromKey] !== undefined ? formData[rangeFromKey] : ""}
                                onChange={handleChange}  tabIndex={-1} />
                        </div>
                    )}
                    {hasRangeTo && (
                        <div className="flex-1">
                            <label htmlFor={rangeToKey} className="block text-xs font-medium text-gray-600 mb-1">Range To</label>
                            <input type="text" id={rangeToKey} name={rangeToKey}
                                className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm "
                                value={formData[rangeToKey] !== undefined ? formData[rangeToKey] : ""}
                                onChange={handleChange}  tabIndex={-1} />
                        </div>
                    )}
                </div>
              )}
              {!(hasRangeFrom || hasRangeTo) && <div className="md:col-span-1"></div>}
              {hasComment && (
                <div className="md:col-span-2">
                  <label htmlFor={commentKey} className="block text-xs font-medium text-gray-600 mb-1">Comments</label>
                  <textarea id={commentKey} name={commentKey} rows="1"
                    className="py-2 px-3 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm "
                    value={formData[commentKey] !== undefined ? formData[commentKey] : ""}
                    onChange={handleChange}  tabIndex={-1} />
                </div>
              )}
               {!hasComment && <div className="md:col-span-2"></div>}
            </div>
          );
        })}
      </div>
    );
  };

  let displayOptions = [];
  if (processedData) {
    if (accessLevel === "doctor") {
      displayOptions = getDoctorOptions();
    } else if (accessLevel === "nurse") {
      displayOptions = allInvFormOptions;
    }
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Investigation Entry</h2>

      {!processedData && data && data.length > 0 && (
           <p className="text-center text-orange-600 my-4">Processing employee data...</p>
      )}
       {(!data || data.length === 0) && (
          <p className="text-center text-red-600 my-4">Please select an employee first to view investigation categories.</p>
      )}

      {processedData && (
        <div className="space-y-2">
            {displayOptions.length > 0 ? displayOptions.map((optionName) => (
              <div key={optionName} className="border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleCategory(optionName)}
                  className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
                >
                  <span className="font-medium text-gray-700">{optionName}</span>
                  {expandedCategories[optionName] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {expandedCategories[optionName] && (
                  <div className="bg-white">
                    {renderFields(optionName)}
                    <div className="px-4 py-4 border-t flex justify-end">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, optionName)}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-sm"
                        >
                            Submit {optionName} Data
                        </button>
                    </div>
                  </div>
                )}
              </div>
            )) : (
                (accessLevel === "doctor" && <p className="text-sm text-gray-500 mt-2 italic p-4 text-center">No investigation records found with today's date for this employee.</p>) ||
                (accessLevel !== "doctor" && accessLevel !== "nurse" && <p className="text-sm text-gray-500 mt-2 italic p-4 text-center">No investigation categories available for your role.</p>)
            )}
        </div>
      )}
    </div>
  );
}

export default InvestigationForm;