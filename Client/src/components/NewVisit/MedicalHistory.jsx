import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// This is the second code snippet provided, which already includes the spouse functionality.
const MedicalHistory1 = ({ data }) => {
  // console.log(data); // Keep console logs minimal in final code unless debugging
  const emp_no = data && data[0] ? data[0]?.emp_no : null; // Use emp_no if available
  const aadhar = data && data[0] ? data[0]?.aadhar : null; // Extract Aadhar
  const initialSex = data && data[0] ? data[0]?.sex || "" : ""; // Get initial sex

  const [isEditMode, setIsEditMode] = useState(true);
  const [sex, setSex] = useState(initialSex); // State for sex

  // --- Styles ---
   const cardStyle = {
    backgroundColor: "#f8f9fa", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };
  const headerStyle = {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", cursor: "pointer",
  };
  const titleStyle = { fontSize: "1.25rem", fontWeight: "600" };
  const tableContainerStyle = { overflowX: "auto" };
  const tableStyle = {
    width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", borderRadius: "0.5rem",
  };
  const tableHeaderStyle = { backgroundColor: "#e9ecef", textAlign: "left" };
  const cellStyle = { padding: "0.5rem", borderBottom: "1px solid #dee2e6" };
  const inputStyle = {
    width: "100%", padding: "0.375rem 0.75rem", border: "1px solid #ced4da", borderRadius: "0.25rem", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)", backgroundColor: "#e5f3ff",
  };
  const selectStyle = {
    width: "100%", padding: "0.375rem 0.75rem", border: "1px solid #ced4da", borderRadius: "0.25rem", backgroundColor: "#e5f3ff", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)", appearance: 'none', minHeight: 'calc(1.5em + 0.75rem + 2px)', display: 'block',
  };
  const textareaStyle = {
    width: "100%", padding: "0.375rem 0.75rem", border: "1px solid #ced4da", borderRadius: "0.25rem", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)", backgroundColor: "#e5f3ff", resize: 'vertical', minHeight: '3rem',
  };
  const buttonStyle = {
    backgroundColor: "#007bff", color: "white", padding: "0.5rem 1rem", borderRadius: "0.25rem", border: "none", cursor: "pointer",
  };
  const removeButtonStyle = {
    backgroundColor: "#dc3545", color: "white", padding: "0.375rem 0.75rem", borderRadius: "0.25rem", border: "none", cursor: "pointer",
  };
  // --- End Styles ---

  const [showForm, setShowForm] = useState(false); // Medical History collapsed by default
  const [showFamilyHistory, setShowFamilyHistory] = useState(false); // Family History collapsed by default

  const toggleFormVisibility = () => setShowForm(!showForm);
  const toggleFamilyVisibility = () => setShowFamilyHistory(!showFamilyHistory);

  // --- State Variables ---
  // Initial state structures
  const initialMedicalData = {
    DM: { detail: "", comment: "", children: [] }, RS: { detail: "", comment: "", children: [] }, CNS: { detail: "", comment: "", children: [] }, CVS: { detail: "", comment: "", children: [] }, GIT: { detail: "", comment: "", children: [] }, KUB: { detail: "", comment: "", children: [] }, HTN: { detail: "", comment: "", children: [] }, Epileptic: { detail: "", comment: "", children: [] }, Hyper_Thyroid: { detail: "", comment: "", children: [] }, Hypo_Thyroid: { detail: "", comment: "", children: [] }, Asthma: { detail: "", comment: "", children: [] }, Cancer: { detail: "", comment: "", children: [] }, Defective_Colour_Vision: { detail: "", comment: "", children: [] }, Others: { detail: "", comment: "", children: [] },
    Obstetric: { detail: [], comment: "", children: [] }, // detail is array for multi-select
    Gynaec: { detail: [], comment: "", children: [] }      // detail is array for multi-select
  };
   const initialFamilyHistory = {
    father: { status: "", reason: "", remarks: "" }, mother: { status: "", reason: "", remarks: "" }, maternalGrandFather: { status: "", reason: "", remarks: "" }, maternalGrandMother: { status: "", reason: "", remarks: "" }, paternalGrandFather: { status: "", reason: "", remarks: "" }, paternalGrandMother: { status: "", reason: "", remarks: "" },
    DM: { detail: "", comment: "", children: [] }, RS: { detail: "", comment: "", children: [] }, CNS: { detail: "", comment: "", children: [] }, CVS: { detail: "", comment: "", children: [] }, GIT: { detail: "", comment: "", children: [] }, KUB: { detail: "", comment: "", children: [] }, HTN: { detail: "", comment: "", children: [] }, Epileptic: { detail: "", comment: "", children: [] }, Hyper_Thyroid: { detail: "", comment: "", children: [] }, Hypo_Thyroid: { detail: "", comment: "", children: [] }, Asthma: { detail: "", comment: "", children: [] }, Cancer: { detail: "", comment: "", children: [] }, Defective_Colour_Vision: { detail: "", comment: "", children: [] }, Others: { detail: "", comment: "", children: [] },
    Obstetric: { detail: "", comment: "", children: [] }, // detail/comment are text
    Gynaec: { detail: "", comment: "", children: [] }     // detail/comment are text
  };
  const initialConditions = { // State for multi-select dropdowns in Family History table
    DM: [], RS: [], CNS: [], CVS: [], GIT: [], KUB: [], HTN: [], Epileptic: [], Hyper_Thyroid: [], Hypo_Thyroid: [], Asthma: [], Cancer: [], Defective_Colour_Vision: [], Others: [],
    Obstetric: [], Gynaec: []
  };

  // State hooks
  const [personalHistory, setPersonalHistory] = useState({ diet: "", paan: { yesNo: "", years: "" }, alcohol: { yesNo: "", years: "", frequency: "" }, smoking: { yesNo: "", years: "", perDay: "" } });
  const [medicalData, setMedicalData] = useState(initialMedicalData);
  const [femaleWorker, setFemaleWorker] = useState({ obstetricHistory: "", gynecologicalHistory: "" });
  const [surgicalHistory, setSurgicalHistory] = useState({ comments: "", history: "", children: [] });
  const [familyHistory, setFamilyHistory] = useState(initialFamilyHistory);
  const [allergyFields, setAllergyFields] = useState({ drug: { yesNo: "" }, food: { yesNo: "" }, others: { yesNo: "" } });
  const [allergyComments, setAllergyComments] = useState({ drug: "", food: "", others: "" });
  const [childrenData, setChildrenData] = useState([]);
  const [spousesData, setSpousesData] = useState([]); // <-- SPOUSE STATE IS HERE
  const [conditions, setConditions] = useState(initialConditions);

  // Default structure for adding spouse/child
  const defaultPerson = { sex: "", dob: "", age: "", status: "", reason: "", remarks: "" };

  // --- Options ---
  const familyConditionRelationshipOptions = [ // Renamed from relationshipOptions1
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "paternalGrandFather", label: "Paternal Grand Father" },
    { value: "paternalGrandMother", label: "Paternal Grand Mother" },
    { value: "maternalGrandFather", label: "Maternal Grand Father" },
    { value: "maternalGrandMother", label: "Maternal Grand Mother" },
  ];
  const obstetricGynaecOptions = [ // Renamed from relationshipOptions2
    { value: "G1 P1 L1 A1", label: "G1 P1 L1 A1" },
    { value: "G2 P1 L1 A1", label: "G2 P1 L1 A1" },
    { value: "G3 P1 L1 A1", label: "G3 P1 L1 A1" },
    { value: "P2 L1 A1", label: "P2 L1 A1" },
    // Add more options as needed
  ];
  const customStyles = { // Styles for react-select
    control: (provided, state) => ({
      ...provided, backgroundColor: "#e5f3ff", border: "1px solid #ced4da", borderRadius: "0.25rem", padding: "2px", boxShadow: state.isFocused ? "0 0 0 1px #007bff" : "inset 0 1px 2px rgba(0, 0, 0, 0.075)", "&:hover": { border: "1px solid #aaa", }, minHeight: 'calc(1.5em + 0.75rem + 2px)',
    }),
    valueContainer: (provided) => ({ ...provided, padding: '0 0.5rem' }),
    input: (provided) => ({ ...provided, margin: '0', padding: '0', }),
    indicatorSeparator: () => ({ display: 'none' }),
    indicatorsContainer: (provided) => ({ ...provided, paddingRight: '0.25rem', }),
    menu: (provided) => ({ ...provided, marginTop: '1px', marginBottom: 'auto', zIndex: 10, backgroundColor: 'white', border: "1px solid #aaa", borderRadius: "0.25rem", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", }),
    menuList: (provided) => ({ ...provided, paddingTop: 0, paddingBottom: 0, maxHeight: '200px', overflowY: 'auto'}),
    option: (provided, state) => ({ ...provided, padding: '0.5rem 0.75rem', color: state.isSelected ? 'white' : 'black', backgroundColor: state.isSelected ? "#007bff" : state.isFocused ? "#e9ecef" : "white", "&:hover": { backgroundColor: "#e9ecef", cursor: 'pointer', }, }),
    multiValue: (provided) => ({ ...provided, backgroundColor: '#cce5ff', borderRadius: '0.25rem', margin: '2px', }),
    multiValueLabel: (provided) => ({ ...provided, color: '#004085', padding: '2px 4px', }),
    multiValueRemove: (provided) => ({ ...provided, color: '#004085', cursor: 'pointer', ':hover': { backgroundColor: '#0056b3', color: 'white', }, }),
   };

  // --- useEffect for Data Loading ---
  useEffect(() => {
    if (data && data[0]) {
      const currentData = data[0];
      const currentInitialSex = currentData?.sex || "";
      setSex(currentInitialSex);

      const medical = currentData['msphistory'] || {}; // Get the medical history object

      // Load Personal History
      setPersonalHistory(medical.personal_history || { diet: "", paan: { yesNo: "", years: "" }, alcohol: { yesNo: "", years: "", frequency: "" }, smoking: { yesNo: "", years: "", perDay: "" } });

      // Load Medical Data
       const loadedMedicalData = medical.medical_data || {};
        const completeMedicalData = Object.keys(initialMedicalData).reduce((acc, key) => {
            const loadedItem = loadedMedicalData[key] || {};
            acc[key] = {
                ...initialMedicalData[key],
                ...loadedItem,
                detail: (key === 'Obstetric' || key === 'Gynaec')
                    ? (Array.isArray(loadedItem.detail)
                        ? loadedItem.detail
                        : (typeof loadedItem.detail === 'string' && loadedItem.detail
                            ? loadedItem.detail.split(',').map(s => s.trim()).filter(Boolean)
                            : []))
                    : (loadedItem.detail || ""),
                children: Array.isArray(loadedItem.children) ? loadedItem.children : []
            };
            return acc;
        }, {});
      setMedicalData(completeMedicalData);

      // Load Female Worker specific data
      setFemaleWorker(medical.female_worker || { obstetricHistory: "", gynecologicalHistory: "" });

      // Load Surgical History
      setSurgicalHistory({
            ...(medical.surgical_history || { comments: "", history: "" }),
            children: Array.isArray(medical.surgical_history?.children) ? medical.surgical_history.children : []
      });

      // Load Allergy info
      setAllergyFields(medical.allergy_fields || { drug: { yesNo: "" }, food: { yesNo: "" }, others: { yesNo: "" } });
      setAllergyComments(medical.allergy_comments || { drug: "", food: "", others: "" });

       // Load Children Data
       setChildrenData(Array.isArray(medical.children_data) ? medical.children_data.map(c => ({ ...defaultPerson, ...c })) : []);

       // Load Family History (Parents/Grandparents + Condition Comments)
       const loadedFamilyHistoryRaw = medical.family_history || {};
       const { spouse, ...familyHistoryRest } = loadedFamilyHistoryRaw; // Separate potential legacy spouse field
       const completeFamilyHistory = Object.keys(initialFamilyHistory).reduce((acc, key) => {
            if (['father', 'mother', 'maternalGrandFather', 'maternalGrandMother', 'paternalGrandFather', 'paternalGrandMother'].includes(key)) {
                 acc[key] = { ...initialFamilyHistory[key], ...(familyHistoryRest[key] || {}) };
            } else {
                 acc[key] = {
                     ...initialFamilyHistory[key],
                     ...(familyHistoryRest[key] || {}),
                     children: Array.isArray(familyHistoryRest[key]?.children) ? familyHistoryRest[key].children : []
                 };
            }
            return acc;
       }, {});
       setFamilyHistory(completeFamilyHistory);

       // **** LOAD SPOUSE DATA IS HERE ****
       if (Array.isArray(medical.spouse_data)) {
            setSpousesData(medical.spouse_data.map(sp => ({ ...defaultPerson, ...sp })));
       } else if (spouse && typeof spouse === 'object') { // Handle legacy single spouse
            setSpousesData([{ ...defaultPerson, ...spouse }]);
       } else {
            setSpousesData([]); // Default to empty if none found
       }

        // Load conditions state (selections for family history dropdowns)
        setConditions({ ...initialConditions, ...(medical.conditions || {}) });

    } else {
         // Optional: Reset states if data is invalid/null
         setSex("");
         setPersonalHistory({ diet: "", paan: { yesNo: "", years: "" }, alcohol: { yesNo: "", years: "", frequency: "" }, smoking: { yesNo: "", years: "", perDay: "" } });
         setMedicalData(initialMedicalData);
         setFemaleWorker({ obstetricHistory: "", gynecologicalHistory: "" });
         setSurgicalHistory({ comments: "", history: "", children: [] });
         setFamilyHistory(initialFamilyHistory);
         setAllergyFields({ drug: { yesNo: "" }, food: { yesNo: "" }, others: { yesNo: "" } });
         setAllergyComments({ drug: "", food: "", others: "" });
         setChildrenData([]);
         setSpousesData([]); // Reset spouse data
         setConditions(initialConditions);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // Dependency array

  // --- Handlers ---

  // Personal History Handler
  const handlePersonalHistoryChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('-');

    if (keys.length === 1) {
      if (['smoking', 'alcohol', 'paan'].includes(name)) {
        setPersonalHistory(prev => ({ ...prev, [name]: { ...(prev[name] || {}), yesNo: value } }));
      } else {
        setPersonalHistory(prev => ({ ...prev, [name]: value }));
      }
    } else if (keys.length === 2) {
      const [group, field] = keys;
      setPersonalHistory(prev => ({
        ...prev,
        [group]: { ...(prev[group] || {}), [field]: value }
      }));
    }
  };

  // Allergy Handlers
  const handleAllergySelect = (allergyType) => {
    const currentSelection = allergyFields[allergyType]?.yesNo;
    const newSelection = currentSelection === "yes" ? "no" : "yes";

    setAllergyFields((prev) => ({
      ...prev,
      [allergyType]: { ...(prev[allergyType] || {}), yesNo: newSelection },
    }));
     if (newSelection === "no") {
        handleAllergyCommentChange(allergyType, "");
     }
  };
  const handleAllergyCommentChange = (allergyType, comment) => {
    setAllergyComments((prev) => ({ ...prev, [allergyType]: comment }));
  };

  // Medical History Input Handler
  const handleMedicalInputChange = (conditionKey, field, value) => {
    setMedicalData((prev) => ({
      ...prev,
      [conditionKey]: {
          ...(prev[conditionKey] || initialMedicalData[conditionKey]),
          [field]: value
       },
    }));
  };

  // Surgical History Handlers
   const handleSurgicalHistoryCommentChange = (comment) => {
    setSurgicalHistory((prev) => ({ ...prev, comments: comment }));
  };

  // Family History (Parents/Grandparents) Handler
  const handleFamilyHistoryChange = (relativeKey, field, value) => {
    setFamilyHistory((prev) => ({
      ...prev,
      [relativeKey]: { ...(prev[relativeKey] || {}), [field]: value },
    }));
  };

  // Family Medical Condition Table Handlers
  const handleFamilyMedicalConditionChange = (conditionKey, field, value) => {
    setFamilyHistory(prev => ({
        ...prev,
        [conditionKey]: {
            ...(prev[conditionKey] || initialFamilyHistory[conditionKey]),
            [field]: value // Specifically updates 'comment'
        }
    }));
  };
  const handleSelectionChange = (conditionKey, selectedOptions) => {
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setConditions(prev => ({
          ...prev,
          [conditionKey]: selectedValues // Updates the 'conditions' state
      }));
  };

  // Children Handlers
  const handleChildInputChange = (index, field, value) => {
    setChildrenData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = { ...(updatedData[index] || defaultPerson), [field]: value };
      return updatedData;
    });
  };
  const addChild = () => {
    setChildrenData((prev) => [...(Array.isArray(prev) ? prev : []), { ...defaultPerson }]);
  };
  const removeChild = (index) => {
    setChildrenData((prev) => prev.filter((_, i) => i !== index));
  };

  // **** SPOUSE HANDLERS ARE HERE ****
  const handleSpouseInputChange = (index, field, value) => {
    setSpousesData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = { ...(updatedData[index] || defaultPerson), [field]: value };
      return updatedData;
    });
  };
  const addSpouse = () => {
    setSpousesData((prev) => [...(Array.isArray(prev) ? prev : []), { ...defaultPerson }]);
  };
  const removeSpouse = (index) => {
    setSpousesData((prev) => prev.filter((_, i) => i !== index));
  };

   // Female Worker Handler
   const handleFemaleWorkerChange = (field, value) => {
        setFemaleWorker((prev) => ({ ...prev, [field]: value }));
   };


  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Helper functions (same as before)
    const processHistoryItem = (item, fieldKey) => {
        if (!item) return { detail: '', comment: '', children: [] };
        const newItem = { ...item };
        const textValue = newItem[fieldKey];
        if ((fieldKey === 'detail' || fieldKey === 'comments') && typeof textValue === 'string' && textValue.trim().length > 0) {
            if (!Array.isArray(newItem.children)) { newItem.children = []; }
            if (!newItem.children.includes(textValue.trim())) {
                newItem.children.push(textValue.trim());
            }
            newItem[fieldKey] = "";
        }
        if (!Array.isArray(newItem.children)) { newItem.children = []; }
        return newItem;
    };

    const processFamilyHistoryConditions = (currentFamilyHistory, currentConditions) => {
        const updatedFamilyHistory = JSON.parse(JSON.stringify(currentFamilyHistory));
        Object.keys(currentConditions).forEach(conditionKey => {
            const isConditionKey = initialFamilyHistory[conditionKey] && typeof initialFamilyHistory[conditionKey] === 'object' && !['father', 'mother', 'maternalGrandFather', 'maternalGrandMother', 'paternalGrandFather', 'paternalGrandMother'].includes(conditionKey);
            const hasSelections = Array.isArray(currentConditions[conditionKey]) && currentConditions[conditionKey].length > 0;
            if (isConditionKey && hasSelections) {
                const relations = currentConditions[conditionKey]
                    .map(value => familyConditionRelationshipOptions.find(opt => opt.value === value)?.label || value)
                    .join(', ');
                const relationString = `Affected Relatives: ${relations}`;
                if (!updatedFamilyHistory[conditionKey]) {
                    updatedFamilyHistory[conditionKey] = { ...initialFamilyHistory[conditionKey] };
                }
                let existingComment = updatedFamilyHistory[conditionKey].comment || '';
                if (!existingComment.includes(relationString)) {
                    updatedFamilyHistory[conditionKey].comment = existingComment ? `${existingComment.trim()}; ${relationString}` : relationString;
                }
            }
        });
        return updatedFamilyHistory;
    };

    // Process histories
    const processedMedicalData = Object.keys(medicalData).reduce((acc, key) => {
       if (key === 'Obstetric' || key === 'Gynaec') {
          acc[key] = { ...medicalData[key], children: Array.isArray(medicalData[key]?.children) ? medicalData[key].children : [] };
       } else {
         acc[key] = processHistoryItem(medicalData[key], 'detail');
       }
       return acc;
    }, {});
    const processedSurgicalHistory = processHistoryItem({ ...surgicalHistory }, 'comments');
    const processedFamilyHistory = processFamilyHistoryConditions(familyHistory, conditions);

    // Prepare final data payload
    const formData = {
      emp_no: aadhar,
      aadhar: aadhar, // Include Aadhar
      personal_history: personalHistory,
      medical_data: processedMedicalData,
      surgical_history: processedSurgicalHistory,
      family_history: processedFamilyHistory, // Does not contain spouse here
      allergy_fields: allergyFields,
      allergy_comments: allergyComments,
      children_data: childrenData,
      spouse_data: spousesData, // **** SPOUSE DATA IS INCLUDED HERE ****
      // conditions: conditions, // Optional
    };

     // Crucial Check for Aadhar before submitting
    if (!aadhar) {
        console.error("Aadhar number is missing. Cannot submit.");
        alert("Error: Aadhar number is missing. Please ensure patient data includes Aadhar.");
        return; // Stop submission
    }

    // Conditionally handle Female specific data
    if (sex === 'Female' || sex === 'Other') {
      formData.female_worker = femaleWorker;
      if (formData.medical_data.Obstetric && Array.isArray(formData.medical_data.Obstetric.detail)) {
        formData.medical_data.Obstetric.detail = formData.medical_data.Obstetric.detail.join(', ');
      } else {
        formData.medical_data.Obstetric = { ...(formData.medical_data.Obstetric || {}), detail: "" };
      }
      if (formData.medical_data.Gynaec && Array.isArray(formData.medical_data.Gynaec.detail)) {
        formData.medical_data.Gynaec.detail = formData.medical_data.Gynaec.detail.join(', ');
      } else {
        formData.medical_data.Gynaec = { ...(formData.medical_data.Gynaec || {}), detail: "" };
      }
      formData.family_history.Obstetric = formData.family_history.Obstetric || { detail: "", comment: "", children: [] };
      formData.family_history.Gynaec = formData.family_history.Gynaec || { detail: "", comment: "", children: [] };
    } else {
      delete formData.female_worker;
      if (formData.medical_data) {
        delete formData.medical_data.Obstetric;
        delete formData.medical_data.Gynaec;
      }
      if (formData.family_history) {
        delete formData.family_history.Obstetric;
        delete formData.family_history.Gynaec;
      }
    }

    // Log final payload
    console.log("Submitting Data:", JSON.stringify(formData, null, 2));

    // Send data to backend
    try {
      const response = await fetch("http://localhost:8000/medical-history/", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Data submitted successfully!", result);
        alert("Form submitted successfully!");
        // Update state to reflect processed data (e.g., clear inputs)
         setMedicalData(processedMedicalData);
         setSurgicalHistory(processedSurgicalHistory);
         setFamilyHistory(processedFamilyHistory);
      } else {
        const errorData = await response.text();
        console.error("Error submitting data:", response.status, response.statusText, errorData);
        alert(`Error: ${response.status} ${response.statusText}. ${errorData || 'No additional error details.'}`);
      }
    } catch (error) {
      console.error("Network or fetch error:", error);
      alert("Network error. Please check connection.");
    }
  }; // --- End Submit Handler ---

  // --- Rendered JSX ---
  return (
    <div className="p-4 md:p-6 bg-gray-100">

      {/* Personal History Section */}
       <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal History</h2>
        {/* Smoking */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Smoking</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 items-center">
            {['yes', 'no', 'cessased'].map(val => (
              <div key={val} className="flex items-center space-x-2">
                <input type="radio" name="smoking" value={val} id={`smoking-${val}`} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                       onChange={handlePersonalHistoryChange} checked={personalHistory?.smoking?.yesNo === val} disabled={!isEditMode} />
                <label htmlFor={`smoking-${val}`} className="text-sm text-gray-700">{val.charAt(0).toUpperCase() + val.slice(1)}</label>
              </div>
            ))}
            <input type="text" name="smoking-years" placeholder="Years" style={inputStyle}
                   onChange={handlePersonalHistoryChange} value={personalHistory?.smoking?.years || ""} disabled={!isEditMode || personalHistory?.smoking?.yesNo !== 'yes'} />
            <input type="text" name="smoking-perDay" placeholder="#/day" style={inputStyle}
                   onChange={handlePersonalHistoryChange} value={personalHistory?.smoking?.perDay || ""} disabled={!isEditMode || personalHistory?.smoking?.yesNo !== 'yes'} />
          </div>
        </div>
        {/* Alcohol */}
         <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Alcohol</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 items-center">
            {['yes', 'no', 'cessased'].map(val => (
              <div key={val} className="flex items-center space-x-2">
                <input type="radio" name="alcohol" value={val} id={`alcohol-${val}`} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                       onChange={handlePersonalHistoryChange} checked={personalHistory?.alcohol?.yesNo === val} disabled={!isEditMode} />
                <label htmlFor={`alcohol-${val}`} className="text-sm text-gray-700">{val.charAt(0).toUpperCase() + val.slice(1)}</label>
              </div>
            ))}
            <input type="text" name="alcohol-years" placeholder="Years" style={inputStyle}
                   onChange={handlePersonalHistoryChange} value={personalHistory?.alcohol?.years || ""} disabled={!isEditMode || personalHistory?.alcohol?.yesNo !== 'yes'} />
            <input type="text" name="alcohol-frequency" placeholder="Freq/day" style={inputStyle}
                   onChange={handlePersonalHistoryChange} value={personalHistory?.alcohol?.frequency || ""} disabled={!isEditMode || personalHistory?.alcohol?.yesNo !== 'yes'} />
          </div>
        </div>
        {/* Paan */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Paan/Beetle</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 items-center">
             {['yes', 'no', 'cessased'].map(val => (
              <div key={val} className="flex items-center space-x-2">
                <input type="radio" name="paan" value={val} id={`paan-${val}`} className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                       onChange={handlePersonalHistoryChange} checked={personalHistory?.paan?.yesNo === val} disabled={!isEditMode} />
                <label htmlFor={`paan-${val}`} className="text-sm text-gray-700">{val.charAt(0).toUpperCase() + val.slice(1)}</label>
              </div>
            ))}
             <div className="md:col-span-2">
                <input type="text" name="paan-years" placeholder="Years" style={inputStyle}
                    onChange={handlePersonalHistoryChange} value={personalHistory?.paan?.years || ""} disabled={!isEditMode || personalHistory?.paan?.yesNo !== 'yes'} />
             </div>
          </div>
        </div>
        {/* Diet */}
        <div className="mb-4">
          <label htmlFor="diet-select" className="block font-medium mb-2 text-gray-700">Diet</label>
          <select id="diet-select" style={{...selectStyle, width: "auto", minWidth: "150px"}} name="diet"
                  onChange={handlePersonalHistoryChange} value={personalHistory?.diet || ""} disabled={!isEditMode}>
            <option value="">Select Diet</option>
            <option value="mixed">Mixed</option>
            <option value="veg">Pure Veg</option>
            <option value="egg">Eggetarian</option>
          </select>
        </div>
      </div>

      {/* Medical History Card */}
      <div style={cardStyle}>
        <div style={headerStyle} onClick={toggleFormVisibility}>
          <h2 style={titleStyle}>Medical History</h2>
          <span className="text-lg font-semibold">{showForm ? "[-]" : "[+]"}</span>
        </div>
        {showForm && (
          <form onSubmit={(e) => e.preventDefault()} className="pt-2">
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead style={tableHeaderStyle}>
                  <tr>
                    <th style={cellStyle}>Condition</th>
                    <th style={{...cellStyle, width: '40%'}}>Add New Detail / Select Options</th>
                    <th style={cellStyle}>History (Previous Entries)</th>
                  </tr>
                </thead>
                <tbody>
                  {[ // Standard medical conditions
                    { key: 'HTN', label: 'HTN' }, { key: 'DM', label: 'DM' }, { key: 'Epileptic', label: 'Epileptic' },
                    { key: 'Hyper_Thyroid', label: 'Hyper Thyroid' }, { key: 'Hypo_Thyroid', label: 'Hypo Thyroid' },
                    { key: 'Asthma', label: 'Asthma' }, { key: 'CVS', label: 'CVS' }, { key: 'CNS', label: 'CNS' },
                    { key: 'RS', label: 'RS' }, { key: 'GIT', label: 'GIT' }, { key: 'KUB', label: 'KUB' },
                    { key: 'Cancer', label: 'Cancer' }, { key: 'Defective_Colour_Vision', label: 'Def. Colour Vision' },
                    { key: 'Others', label: 'Others' },
                  ].map(({ key, label }) => (
                    <tr key={key} style={cellStyle}>
                      <td style={{...cellStyle, verticalAlign: 'top', paddingTop: '0.75rem'}}>{label}</td>
                      <td style={cellStyle}>
                         <input type="text" value={medicalData[key]?.detail || ""} style={inputStyle} placeholder="Enter current details..."
                               onChange={(e) => handleMedicalInputChange(key, "detail", e.target.value)} disabled={!isEditMode} />
                      </td>
                      <td style={cellStyle}>
                         <textarea value={Array.isArray(medicalData[key]?.children) ? medicalData[key].children.join('\n') : ''}
                                  style={{...textareaStyle, backgroundColor: '#e9ecef', minHeight: '3rem'}} readOnly disabled={true} placeholder="Previous history entries..." rows={2} />
                      </td>
                    </tr>
                  ))}
                  {/* --- Conditional Obstetric and Gynaec Rows --- */}
                  {(sex === 'Female' || sex === 'Other') && (
                    <>
                      <tr style={cellStyle}>
                        <td style={{...cellStyle, verticalAlign: 'top', paddingTop: '0.75rem'}}>Obstetric</td>
                        <td style={cellStyle}>
                          <Select isMulti options={obstetricGynaecOptions} styles={customStyles} menuPlacement="auto" placeholder="Select Options..." isDisabled={!isEditMode}
                                   value={obstetricGynaecOptions.filter(option => Array.isArray(medicalData.Obstetric?.detail) && medicalData.Obstetric.detail.includes(option.value))}
                                   onChange={(selectedOptions) => handleMedicalInputChange("Obstetric", "detail", selectedOptions ? selectedOptions.map(o => o.value) : [])}
                          />
                        </td>
                        <td style={cellStyle}>
                          <textarea value={Array.isArray(medicalData.Obstetric?.children) ? medicalData.Obstetric.children.join('\n') : ''}
                                    style={{...textareaStyle, backgroundColor: '#e9ecef', minHeight: '3rem'}} readOnly disabled={true} placeholder="Previous history entries..." rows={2}/>
                        </td>
                      </tr>
                      <tr style={cellStyle}>
                        <td style={{...cellStyle, verticalAlign: 'top', paddingTop: '0.75rem'}}>Gynaec</td>
                        <td style={cellStyle}>
                           <Select isMulti options={obstetricGynaecOptions} styles={customStyles} menuPlacement="auto" placeholder="Select Options..." isDisabled={!isEditMode}
                                  value={obstetricGynaecOptions.filter(option => Array.isArray(medicalData.Gynaec?.detail) && medicalData.Gynaec.detail.includes(option.value))}
                                  onChange={(selectedOptions) => handleMedicalInputChange("Gynaec", "detail", selectedOptions ? selectedOptions.map(o => o.value) : [])}
                           />
                        </td>
                        <td style={cellStyle}>
                          <textarea value={Array.isArray(medicalData.Gynaec?.children) ? medicalData.Gynaec.children.join('\n') : ''}
                                    style={{...textareaStyle, backgroundColor: '#e9ecef', minHeight: '3rem'}} readOnly disabled={true} placeholder="Previous history entries..." rows={2}/>
                        </td>
                      </tr>
                    </>
                  )}
                  {/* --- End Conditional Rows --- */}
                </tbody>
              </table>
            </div>
          </form>
        )}
      </div>

      {/* Surgical History Section */}
       <div className="mt-6 mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Surgical History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="surgicalHistoryComments" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter New Surgical History/Comments:
                </label>
                <textarea id="surgicalHistoryComments" placeholder="Add new surgical event details..." style={textareaStyle}
                          value={surgicalHistory.comments || ""} onChange={(e) => handleSurgicalHistoryCommentChange(e.target.value)} disabled={!isEditMode} rows={3}/>
            </div>
            <div>
                <label htmlFor="surgicalHistoryDisplay" className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Surgical History:
                </label>
                 <textarea id="surgicalHistoryDisplay" style={{...textareaStyle, backgroundColor: '#e9ecef'}}
                            value={Array.isArray(surgicalHistory.children) ? surgicalHistory.children.join('\n') : (surgicalHistory.history || '')}
                            readOnly disabled={true} placeholder="Previous surgical history..." rows={3} />
            </div>
        </div>
      </div>

      {/* Allergy History Section */}
      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Allergy History</h2>
        <div className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-x-4 gap-y-3 items-center">
             {/* Headers */}
            <div className="font-semibold text-gray-700 pl-2 md:text-left text-sm">Type</div>
            <div className="font-semibold text-gray-700 text-center text-sm">Response</div>
            <div className="font-semibold text-gray-700 md:text-left text-sm">Comments</div>
            <div className="col-span-1 md:col-span-3 border-t my-1"></div>
            {/* Rows */}
            {['drug', 'food', 'others'].map(type => (
                <React.Fragment key={type}>
                    <div className="flex items-center pl-2">
                         <label className="text-sm font-medium text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)} Allergy</label>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500" name={`${type}AllergyResponse`} value="yes"
                                   checked={allergyFields[type]?.yesNo === "yes"} onChange={() => handleAllergySelect(type)} disabled={!isEditMode} />
                            <span className="ml-1 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="radio" className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500" name={`${type}AllergyResponse`} value="no"
                                   checked={!allergyFields[type]?.yesNo || allergyFields[type]?.yesNo === "no"}
                                   onChange={() => handleAllergySelect(type)} disabled={!isEditMode} />
                            <span className="ml-1 text-sm text-gray-700">No</span>
                        </label>
                    </div>
                    <div>
                        <textarea placeholder={`Details if Yes...`} style={textareaStyle} value={allergyComments[type] || ""}
                                  onChange={(e) => handleAllergyCommentChange(type, e.target.value)} disabled={!isEditMode || allergyFields[type]?.yesNo !== 'yes'} rows={2}/>
                    </div>
                    <div className="col-span-1 md:col-span-3 border-t my-1 last:border-0"></div>
                </React.Fragment>
            ))}
        </div>
      </div>

      {/* Family History Card */}
      <div style={cardStyle}>
        <div style={headerStyle} onClick={toggleFamilyVisibility}>
          <h2 style={titleStyle}>Family History</h2>
          <span className="text-lg font-semibold">{showFamilyHistory ? "[-]" : "[+]"}</span>
        </div>
        {showFamilyHistory && (
          <div className="p-2 md:p-4">
            {/* Parents & Grandparents */}
            <h3 className="text-lg font-semibold mt-2 mb-3 text-gray-800">Parents & Grandparents</h3>
            {[
                { label: "Father", key: "father" }, { label: "Paternal Grand Father", key: "paternalGrandFather" }, { label: "Paternal Grand Mother", key: "paternalGrandMother" },
                { label: "Mother", key: "mother" }, { label: "Maternal Grand Father", key: "maternalGrandFather" }, { label: "Maternal Grand Mother", key: "maternalGrandMother" },
            ].map(({ label, key }) => (
                <div key={key} className="mb-4 p-3 border rounded-md bg-gray-50 shadow-sm">
                    <label className="block mb-2 font-medium text-gray-700">{label}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select style={selectStyle} value={familyHistory[key]?.status || ""} onChange={(e) => handleFamilyHistoryChange(key, "status", e.target.value)} disabled={!isEditMode}>
                            <option value="">Select Status</option> <option value="Alive">Alive</option> <option value="Expired">Expired</option>
                        </select>
                        <input type="text" placeholder="Reason (if expired)" style={inputStyle} value={familyHistory[key]?.reason || ""} onChange={(e) => handleFamilyHistoryChange(key, "reason", e.target.value)} disabled={!isEditMode || familyHistory[key]?.status !== 'Expired'} />
                        <input type="text" placeholder="Remarks (Health Condition)" style={inputStyle} value={familyHistory[key]?.remarks || ""} onChange={(e) => handleFamilyHistoryChange(key, "remarks", e.target.value)} disabled={!isEditMode} />
                    </div>
                </div>
            ))}

             {/* Family Medical Conditions Table */}
             <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">Family Medical Conditions</h3>
             <div style={tableContainerStyle}>
              <table style={tableStyle}>
                 <thead style={tableHeaderStyle}>
                    <tr>
                        <th style={cellStyle}>Condition</th>
                        <th style={{...cellStyle, width: '40%'}}>Affected Relatives (Select)</th>
                        <th style={cellStyle}>Comments / Details</th>
                    </tr>
                 </thead>
                 <tbody>
                     {[ // Base conditions
                        { key: 'HTN', label: 'HTN' }, { key: 'DM', label: 'DM' }, { key: 'Epileptic', label: 'Epileptic' },
                        { key: 'Hyper_Thyroid', label: 'Hyper Thyroid' }, { key: 'Hypo_Thyroid', label: 'Hypo Thyroid' },
                        { key: 'Asthma', label: 'Asthma' }, { key: 'CVS', label: 'CVS' }, { key: 'CNS', label: 'CNS' },
                        { key: 'RS', label: 'RS' }, { key: 'GIT', label: 'GIT' }, { key: 'KUB', label: 'KUB' },
                        { key: 'Cancer', label: 'Cancer' }, { key: 'Defective_Colour_Vision', label: 'Def. Colour Vision' },
                        { key: 'Others', label: 'Others' },
                     ].concat( // Conditionally add female-related
                        (sex === 'Female' || sex === 'Other') ? [
                            { key: 'Obstetric', label: 'Obstetric (Family)' },
                            { key: 'Gynaec', label: 'Gynaec (Family)' }
                        ] : []
                     ).map(({ key, label }) => (
                        <tr key={key}>
                            <td style={{...cellStyle, verticalAlign: 'top', paddingTop: '0.75rem'}}>{label}</td>
                            <td style={cellStyle}>
                                <Select
                                    isMulti options={familyConditionRelationshipOptions} styles={customStyles} placeholder="Select affected relatives..." menuPlacement="auto" isDisabled={!isEditMode}
                                    value={familyConditionRelationshipOptions.filter(option => Array.isArray(conditions[key]) && conditions[key].includes(option.value))}
                                    onChange={(selected) => handleSelectionChange(key, selected)}
                                />
                            </td>
                            <td style={cellStyle}>
                                <textarea value={familyHistory[key]?.comment || ''} style={textareaStyle} placeholder="Add comments about condition in family..." disabled={!isEditMode}
                                           onChange={(e) => handleFamilyMedicalConditionChange(key, "comment", e.target.value)} rows={2} />
                            </td>
                        </tr>
                     ))}
                 </tbody>
              </table>
            </div>

             {/* --- SPOUSE SECTION IS HERE --- */}
            <div className="mb-6 mt-6 border-t border-gray-300 pt-4">
                 <div className="flex justify-between items-center mb-3">
                    <label className="block font-semibold text-lg text-gray-800">
                        Spouse ({spousesData.length})
                    </label>
                    <button type="button" onClick={addSpouse} style={buttonStyle} disabled={!isEditMode}>
                        + Add Spouse
                    </button>
                </div>
                 {spousesData.length > 0 && (
                    <div className="overflow-x-auto mt-2">
                        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg" style={tableStyle}>
                            <thead>
                                <tr className="bg-gray-200 text-left text-sm" style={tableHeaderStyle}>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Sex</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>DOB</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Age</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Status</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Reason (Expired)</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Remarks (Health)</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spousesData.map((spouse, index) => ( // Use spousesData state
                                    <tr key={index} className="border-b border-gray-300 text-sm hover:bg-gray-50" style={cellStyle}>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <select value={spouse.sex || ""} style={{...selectStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                    onChange={(e) => handleSpouseInputChange(index, "sex", e.target.value)}> {/* Use handleSpouseInputChange */}
                                                <option value="">Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="date" value={spouse.dob || ""} style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleSpouseInputChange(index, "dob", e.target.value)} /> {/* Use handleSpouseInputChange */}
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="number" value={spouse.age || ""} placeholder="Age" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleSpouseInputChange(index, "age", e.target.value)} /> {/* Use handleSpouseInputChange */}
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                             <select value={spouse.status || ""} style={{...selectStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                     onChange={(e) => handleSpouseInputChange(index, "status", e.target.value)}> {/* Use handleSpouseInputChange */}
                                                <option value="">Status</option> <option value="Alive">Alive</option> <option value="Expired">Expired</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="text" value={spouse.reason || ""} placeholder="Reason" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode || spouse.status !== 'Expired'}
                                                   onChange={(e) => handleSpouseInputChange(index, "reason", e.target.value)} /> {/* Use handleSpouseInputChange */}
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="text" value={spouse.remarks || ""} placeholder="Health condition" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleSpouseInputChange(index, "remarks", e.target.value)} /> {/* Use handleSpouseInputChange */}
                                        </td>
                                        <td className="p-1 text-center" style={cellStyle}>
                                            <button type="button" onClick={() => removeSpouse(index)} style={removeButtonStyle} disabled={!isEditMode}> {/* Use removeSpouse */}
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* --- End Spouse Section --- */}

             {/* --- Children Section --- */}
            <div className="mb-6 mt-6 border-t border-gray-300 pt-4">
                 <div className="flex justify-between items-center mb-3">
                     <label className="block font-semibold text-lg text-gray-800">
                        Children ({childrenData.length})
                    </label>
                    <button type="button" onClick={addChild} style={buttonStyle} disabled={!isEditMode}>
                        + Add Child
                    </button>
                </div>
                {childrenData.length > 0 && (
                    <div className="overflow-x-auto mt-2">
                         <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg" style={tableStyle}>
                            <thead>
                                <tr className="bg-gray-200 text-left text-sm" style={tableHeaderStyle}>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Sex</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>DOB</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Age</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Status</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Reason (Expired)</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Remarks (Health)</th>
                                    <th className="p-2 border border-gray-300" style={cellStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {childrenData.map((child, index) => (
                                    <tr key={index} className="border-b border-gray-300 text-sm hover:bg-gray-50" style={cellStyle}>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <select value={child.sex || ""} style={{...selectStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                    onChange={(e) => handleChildInputChange(index, "sex", e.target.value)}>
                                                 <option value="">Select</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="date" value={child.dob || ""} style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleChildInputChange(index, "dob", e.target.value)} />
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="number" value={child.age || ""} placeholder="Age" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleChildInputChange(index, "age", e.target.value)} /> {/* Changed from Age to age */}
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                             <select value={child.status || ""} style={{...selectStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                     onChange={(e) => handleChildInputChange(index, "status", e.target.value)}>
                                                 <option value="">Status</option> <option value="Alive">Alive</option> <option value="Expired">Expired</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="text" value={child.reason || ""} placeholder="Reason" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode || child.status !== 'Expired'}
                                                   onChange={(e) => handleChildInputChange(index, "reason", e.target.value)} />
                                        </td>
                                        <td className="p-1 border-r border-gray-300" style={cellStyle}>
                                            <input type="text" value={child.remarks || ""} placeholder="Health condition" style={{...inputStyle, padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} disabled={!isEditMode}
                                                   onChange={(e) => handleChildInputChange(index, "remarks", e.target.value)} />
                                        </td>
                                        <td className="p-1 text-center" style={cellStyle}>
                                            <button type="button" onClick={() => removeChild(index)} style={removeButtonStyle} disabled={!isEditMode}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
             {/* --- End Children Section --- */}

          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={handleSubmit} style={buttonStyle} disabled={!isEditMode}> {/* Changed type to button to prevent implicit form submission */}
          Submit Medical History
        </button>
      </div>

    </div>
  );
};

export default MedicalHistory1;