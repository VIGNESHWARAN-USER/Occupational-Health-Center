import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const MedicalHistory1 = ({ data }) => {
  console.log(data);
  const emp_no = data[0]?.emp_no;
  const [isEditMode, setIsEditMode] = useState(true);
  const [name, setName] = useState(data[0]?.name || "");
  const [sex, setSex] = useState(data[0]?.sex || "");
  const [dob, setDob] = useState(data[0]?.dob || "");
  const [phone_Personal, setPhone_Personal] = useState(
    data[0]?.phone_Personal || ""
  );

  const cardStyle = {
    backgroundColor: "#f8f9fa", // Light gray background
    borderRadius: "8px", // Rounded corners
    padding: "1rem", // Padding inside the card
    marginBottom: "1rem", // Margin below the card
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
  };

  const tableContainerStyle = {
    overflowX: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    borderRadius: "0.5rem",
  };

  const tableHeaderStyle = {
    backgroundColor: "#e9ecef",
    textAlign: "left",
  };

  const cellStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #dee2e6",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.375rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
  };

  const selectStyle = {
    width: "100%",
    padding: "0.375rem 0.75rem",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    backgroundColor: "white", // Add white background
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
  };

  const dropdownOptions = [
    { value: "", label: "Select..." },
    { value: "FATHER", label: "FATHER" },
    { value: "MOTHER", label: "MOTHER" },
    { value: "Paternal Grandfather", label: "Paternal Grandfather" },
    { value: "Paternal Grandmother", label: "Paternal Grandmother" },
    { value: "Maternal Grandfather", label: "Maternal Grandfather" },
    { value: "Maternal Grandmother", label: "Maternal Grandmother" },
  ];

  const [personalHistory, setPersonalHistory] = useState({
    diet: "",
    paan: { yesNo: "", years: "" },
    alcohol: { yesNo: "", years: "", frequency: "" },
    smoking: { yesNo: "", years: "", perDay: "" },
  });

  const [showForm, setShowForm] = useState(false);
  const [showFamilyHistory, setShowFamilyHistory] = useState(false);

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const toggleFamilyVisibility = () => {
    setShowFamilyHistory(!showFamilyHistory);
  };

  const [medicalData, setMedicalData] = useState({
    DM: { detail: "", comment: "" },
    RS: { detail: "", comment: "" },
    CNS: { detail: "", comment: "" },
    CVS: { detail: "", comment: "" },
    GIT: { detail: "", comment: "" },
    KUB: { detail: "", comment: "" },
    HTN: { detail: "", comment: "" },
    Epileptic: { detail: "", comment: "" },
    Hyper_Thyroid: { detail: "", comment: "" },
    Hypo_Thyroid: { detail: "", comment: "" },
    Asthma: { detail: "", comment: "" },
    Cancer: { detail: "", comment: "" },
    Defective_Colour_Vision: {detail: "", comment: ""},
    Others: {detail: "", comment: ""},
    Obstetric: {detail: "", comment: ""},
    Gynaec: {detail: "", comment: ""}
  });

  const [femaleWorker, setFemaleWorker] = useState({
    obstetricHistory: "",
    gynecologicalHistory: "",
  });

  const [surgicalHistory, setSurgicalHistory] = useState({
    comments: "",
    history: "",
    children: [],
  });

  const [familyHistory, setFamilyHistory] = useState({
    father: { status: "", reason: "", remarks: "" },
    mother: { status: "", reason: "", remarks: "" },
    maternalGrandFather: { status: "", reason: "", remarks: "" },
    maternalGrandMother: { status: "", reason: "", remarks: "" },
    paternalGrandFather: { status: "", reason: "", remarks: "" },
    paternalGrandMother: { status: "", reason: "", remarks: "" },
    DM: { detail: "", comment: "" },
    RS: { detail: "", comment: "" },
    CNS: { detail: "", comment: "" },
    CVS: { detail: "", comment: "" },
    GIT: { detail: "", comment: "" },
    KUB: { detail: "", comment: "" },
    HTN: { detail: "", comment: "" },
    Epileptic: { detail: "", comment: "" },
    Hyper_Thyroid: { detail: "", comment: "" },
    Hypo_Thyroid: { detail: "", comment: "" },
    Asthma: { detail: "", comment: "" },
    Cancer: { detail: "", comment: "" },
    Defective_Colour_Vision: {detail: "", comment: ""},
    Others: {detail: "", comment: ""},
    Obstetric: {detail: "", comment: ""},
    Gynaec: {detail: "", comment: ""}
  });

  const [healthConditions, setHealthConditions] = useState({});

  

  const [allergyFields, setAllergyFields] = useState({
    drug: { yesNo: "" },
    food: { yesNo: "" },
    others: { yesNo: "" },
  });

  const [allergyComments, setAllergyComments] = useState({
    drug: "",
    food: "",
    others: "",
  });

  const [childrenData, setChildrenData] = useState([]);

  const [conditions, setConditions] = useState({
    DM: [],
    RS: [],
    CNS: [],
    CVS: [],
    GIT: [],
    KUB: [],
    HTN: [],
    Epileptic: [],
    Hyper_Thyroid: [],
    Hypo_Thyroid: [],
    Asthma: [],
    Cancer: [],
    Defective_Colour_Vision: [],
    Others: []
  });

  const relationshipOptions = [
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "wife", label: "Wife" },
  ];

  const relationshipOptions1 = [
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "wife", label: "Wife" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "paternalGrandFather", label: "Paternal Grand Father" },
    { value: "paternalGrandMother", label: "Paternal Grand Mother" },
    { value: "maternalGrandFather", label: "Maternal Grand Father" },
    { value: "maternalGrandMother", label: "Maternal Grand Mother" },
  ];
  const relationshipOptions2 = [
    { value: "G1 P1 L1 A1", label: "G1 P1 L1 A1" },
    { value: "G2 P1 L1 A1", label: "G2 P1 L1 A1" },
    { value: "G3 P1 L1 A1", label: "G3 P1 L1 A1" },
    { value: "P2 L1 A1", label: "P2 L1 A1" },
  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#e5f3ff",
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "2px",
      boxShadow: state.isFocused ? "0 0 0 2px #cce5ff" : null,
      "&:hover": {
        border: "1px solid #aaa",
      },
    }),
    menu: (provided, state) => ({
        ...provided,
        // This is the key addition for positioning the menu above.
        marginTop: '-1px', // Adjust as needed to fine-tune position
        marginBottom: 'auto', // Prevent overlapping content below.
        position: 'relative', // Added position relative for zIndex
        zIndex: 2, //Ensure Menu List appears above all elements
    }),
    menuList: (provided, state) => ({
        ...provided,
        position: 'relative', // Added position relative for zIndex
        zIndex: 2, //Ensure Menu List appears above all elements
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 10,
      color: "black",
      backgroundColor: state.isFocused ? "#cce5ff" : "white",
      "&:hover": {
        backgroundColor: "#ddd",
      },
    }),
  };

  useEffect(() => {
    if (data && data[0]) {
      const medical = data[0]['msphistory']
      setPersonalHistory(medical?.personal_history || personalHistory);
      setMedicalData(medical?.medical_data || medicalData);
      setFemaleWorker(medical?.female_worker || femaleWorker);
      setSurgicalHistory(medical?.surgical_history || surgicalHistory);
      setFamilyHistory(medical?.family_history || familyHistory);
      setHealthConditions(medical?.health_conditions || healthConditions);
      setSubmissionDetails(medical?.submission_details || submissionDetails);
      setAllergyFields(medical?.allergy_fields || allergyFields);
      setAllergyComments(medical?.allergy_comments || allergyComments);
      setChildrenData(medical?.children_data || childrenData);
      setConditions(medical?.conditions || conditions);
    }
  }, [data]);

  const handlePersonalHistoryChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "smoking" || name === "alcohol" || name === "paan") {
      const key = name;
      setPersonalHistory((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          yesNo: value,
        },
      }));
    } else if (name === "smoking-years") {
      setPersonalHistory((prev) => ({
        ...prev,
        smoking: {
          ...prev.smoking,
          years: value,
        },
      }));
    } else if (name === "smoking-perDay") {
      setPersonalHistory((prev) => ({
        ...prev,
        smoking: {
          ...prev.smoking,
          perDay: value,
        },
      }));
    } else if (name === "alcohol-years") {
      setPersonalHistory((prev) => ({
        ...prev,
        alcohol: {
          ...prev.alcohol,
          years: value,
        },
      }));
    } else if (name === "alcohol-frequency") {
      setPersonalHistory((prev) => ({
        ...prev,
        alcohol: {
          ...prev.alcohol,
          frequency: value,
        },
      }));
    } else if (name === "paan-years") {
      setPersonalHistory((prev) => ({
        ...prev,
        paan: {
          ...prev.paan,
          years: value,
        },
      }));
    } else if (name === "diet") {
      setPersonalHistory((prev) => ({
        ...prev,
        diet: value,
      }));
    }
  };

  const handleAllergySelect = (allergyType) => {
    setAllergyFields((prev) => ({
      ...prev,
      [allergyType]: {
        ...prev[allergyType],
        yesNo: prev[allergyType]?.yesNo === "yes" ? "no" : "yes",
      },
    }));
  };

  const handleAllergyCommentChange = (allergyType, comment) => {
    setAllergyComments((prev) => ({
      ...prev,
      [allergyType]: comment,
    }));
  };

  // Medical History handlers
  const handleMedicalInputChange = (conditionKey, field, value) => {
    setMedicalData((prev) => ({
      ...prev,
      [conditionKey]: {
        ...prev[conditionKey],
        [field]: value,
      },
    }));
  };

  // Surgical History Children handlers
  const handleChildInputChange = (index, field, value) => {
    setChildrenData((prev) => {
      const updatedData = [...prev];
      updatedData[index] = { ...updatedData[index], [field]: value }; // Update the child's object
      return updatedData;
    });
  };

  const addChild = () => {
    setChildrenData((prev) => [
      ...prev,
      { sex: "", dob: "", status: "", reason: "", remarks: "" },
    ]);
  };

  const removeChild = (index) => {
    setChildrenData((prev) => prev.filter((_, i) => i !== index));
  };

  // Family History handler
  const handleFamilyHistoryChange = (relative, field, value) => {
    setFamilyHistory((prev) => ({
      ...prev,
      [relative]: {
        ...prev[relative],
        [field]: value,
      },
    }));
  };

    // Family Medical Condition handler
    const handleFamilyMedicalConditionChange = (conditionKey, field, value) => {
        setFamilyHistory(prev => ({
            ...prev,
            [conditionKey]: {
                ...prev[conditionKey],
                [field]: value
            }
        }));
    };


  // Health Conditions handler
  const handleSelectionChange = (condition, selectedOptions) => {
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];

      setConditions(prev => ({
          ...prev,
          [condition]: selectedValues
      }));
  };

  const handleSubmissionDetailsChange = (e) => {
    const { name, value } = e.target;
    setSubmissionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFemaleWorkerChange = (field, value) => {
    setFemaleWorker((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSurgicalHistoryChange = (field, value) => {
    setSurgicalHistory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSurgicalHistoryCommentChange = (comment) => {
    setSurgicalHistory((prev) => ({
      ...prev,
      comments: comment,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      personalHistory,
      medicalData,
      femaleWorker,
      surgicalHistory,
      familyHistory,
      healthConditions,
      submissionDetails,
      allergyFields,
      allergyComments,
      childrenData,
      conditions,
    };

    try {
      if (formData["surgicalHistory"]["comments"].length !== 0) {
        if (!Array.isArray(formData["surgicalHistory"]["children"])) {
          formData["surgicalHistory"]["children"] = []; // Initialize if not an array
        }
        formData["surgicalHistory"]["children"].push(formData["surgicalHistory"]["comments"]);
        formData["surgicalHistory"]["comments"] = "";
      }
      console.log(formData)

      const updatedFormdata = { ...formData, emp_no: emp_no };
      console.log(updatedFormdata)
      console.log(updatedFormdata);
      const response = await fetch("http://localhost:8000/medical-history/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormdata),
      });

      if (response.ok) {
        console.log("Data submitted successfully!");
        alert("Form submitted successfully!");
      } else {
        console.error(
          "Error submitting data:",
          response.status,
          response.statusText
        );
        alert("There was an error submitting the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(
        "A network error occurred. Please check your connection and try again."
      );
    }
  };

  // ---------------------- Rendered JSX ----------------------

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Medical History</h1>
    
     
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal History</h2>

        <div className="mb-4">
          <label className="block font-medium mb-2">Smoking</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="smoking"
                value="yes"
                id="smoking-yes"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.smoking?.yesNo === "yes"}
                disabled={!isEditMode}
              />
              <label htmlFor="smoking-yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="smoking"
                value="no"
                id="smoking-no"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.smoking?.yesNo === "no"}
                disabled={!isEditMode}
              />
              <label htmlFor="smoking-cessased">No</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="smoking"
                value="cessased"
                id="smoking-cessased"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.smoking?.yesNo === "cessased"}
                disabled={!isEditMode}
              />
              <label htmlFor="smoking-no">Cessased</label>
            </div>
            <input
              type="text"
              name="smoking-years"
              placeholder="Years of Smoking"
              className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={handlePersonalHistoryChange}
              value={personalHistory?.smoking?.years || ""}
              disabled={!isEditMode}
            />
            <input
              type="text"
              name="smoking-perDay"
              placeholder="Cigarettes per day"
              className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={handlePersonalHistoryChange}
              value={personalHistory?.smoking?.perDay || ""}
              disabled={!isEditMode}
            />
          </div>
        </div>
        {/* Alcohol Consumption */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Alcohol Consumption</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="alcohol"
                value="yes"
                id="alcohol-yes"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.alcohol?.yesNo === "yes"}
                disabled={!isEditMode}
              />
              <label htmlFor="alcohol-yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="alcohol"
                value="no"
                id="alcohol-no"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.alcohol?.yesNo === "no"}
                disabled={!isEditMode}
              />
              <label htmlFor="alcohol-no">No</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="alcohol"
                value="cessased"
                id="alcohol-cessased"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.alcohol?.yesNo === "cessased"}
                disabled={!isEditMode}
              />
              <label htmlFor="alcohol-no">Cessased</label>
            </div>
            <input
              type="text"
              name="alcohol-years"
              placeholder="Years of Drinking"
              className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={handlePersonalHistoryChange}
              value={personalHistory?.alcohol?.years || ""}
              disabled={!isEditMode}
            />
            <input
              type="text"
              name="alcohol-frequency"
              placeholder="Consuming per day"
              className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={handlePersonalHistoryChange}
              value={personalHistory?.alcohol?.frequency || ""}
              disabled={!isEditMode}
            />
          </div>
        </div>
        {/* Paan/Beetle Chewer */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Paan/Beetle Consumption
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="paan"
                value="yes"
                id="paan-yes"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.paan?.yesNo === "yes"}
                disabled={!isEditMode}
              />
              <label htmlFor="paan-yes">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="paan"
                value="no"
                id="paan-no"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.paan?.yesNo === "no"}
                disabled={!isEditMode}
              />
              <label htmlFor="paan-no">No</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="paan"
                value="cessased"
                id="paan-cessased"
                className="form-radio h-6 w-6" // Adjusted size here
                onChange={handlePersonalHistoryChange}
                checked={personalHistory?.paan?.yesNo === "cessased"}
                disabled={!isEditMode}
              />
              <label htmlFor="paan-no">Cessased</label>
            </div>
            <input
              type="text"
              name="paan-years"
              placeholder="Years of Chewing"
              className="px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              onChange={handlePersonalHistoryChange}
              value={personalHistory?.paan?.years || ""}
              disabled={!isEditMode}
            />
          </div>
        </div>
        {/* Diet */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Diet</label>
          <select
            className="px-4 py-2 w-56 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            name="diet"
            onChange={handlePersonalHistoryChange}
            value={personalHistory?.diet || ""}
            disabled={!isEditMode}
          >
            <option value="">Select Diet</option>
            <option value="mixed">Mixed</option>
            <option value="veg">Pure Veg</option>
            <option value="egg">Eggetarian</option>
          </select>
        </div>
      </div>
      <div style={cardStyle}>
        <div style={headerStyle} onClick={toggleFormVisibility}>
          <h2 style={titleStyle}>Medical History</h2>
          <span>{showForm ? "[-]" : "[+]"}</span>
        </div>

        {showForm && (
          <form>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderStyle}>
                    <th style={cellStyle}>Condition</th>
                    <th style={cellStyle}>Detail</th>
                    <th style={cellStyle}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {/* HTN Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>HTN</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.HTN?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("HTN", "detail", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.HTN?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("HTN", "comment", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* DM Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>DM</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.DM?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("DM", "detail", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.DM?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("DM", "comment", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* Epileptic Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>Epileptic</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.Epileptic?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Epileptic",
                            "detail",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.Epileptic?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Epileptic",
                            "comment",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* Hyper Thyroid Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>Hyper Thyroid</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData["Hyper_Thyroid"]?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Hyper_Thyroid",
                            "detail",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData["Hyper_Thyroid"]?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Hyper_Thyroid",
                            "comment",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* Hypo Thyroid Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>Hypo Thyroid</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData["Hypo_Thyroid"]?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Hypo_Thyroid",
                            "detail",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData["Hypo_Thyroid"]?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange(
                            "Hypo_Thyroid",
                            "comment",
                            e.target.value
                          )
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* Asthma Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>Asthma</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.Asthma?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("Asthma", "detail", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.Asthma?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("Asthma", "comment", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* CVS Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>CVS</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.CVS?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("CVS", "detail", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.CVS?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("CVS", "comment", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                  </tr>

                  {/* CNS Row */}
                  <tr style={cellStyle}>
                    <td style={cellStyle}>CNS</td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.CNS?.detail || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("CNS", "detail", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Enter details"
                        disabled={!isEditMode}
                      />
                    </td>
                    <td style={cellStyle}>
                      <input
                        type="text"
                        value={medicalData.CNS?.comment || ""}
                        onChange={(e) =>
                          handleMedicalInputChange("CNS", "comment", e.target.value)
                        }
                        style={inputStyle}
                        placeholder="Optional comments"
                        disabled={!isEditMode}
                      />
                    </td>
                    </tr>

{/* RS Row */}
<tr style={cellStyle}>
  <td style={cellStyle}>RS</td>
  <td style={cellStyle}>
    <input
      type="text"
      value={medicalData.RS?.detail || ""}
      onChange={(e) =>
        handleMedicalInputChange("RS", "detail", e.target.value)
      }
      style={inputStyle}
      placeholder="Enter details"
      disabled={!isEditMode}
    />
  </td>
  <td style={cellStyle}>
    <input
      type="text"
      value={medicalData.RS?.comment || ""}
      onChange={(e) =>
        handleMedicalInputChange("RS", "comment", e.target.value)
      }
      style={inputStyle}
      placeholder="Optional comments"
      disabled={!isEditMode}
    />
  </td>
</tr>

{/*                    {/* GIT Row */}
  <tr style={cellStyle}>
    <td style={cellStyle}>GIT</td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.GIT?.detail || ""}
        onChange={(e) =>
          handleMedicalInputChange("GIT", "detail", e.target.value)
        }
        style={inputStyle}
        placeholder="Enter details"
        disabled={!isEditMode}
      />
    </td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.GIT?.comment || ""}
        onChange={(e) =>
          handleMedicalInputChange("GIT", "comment", e.target.value)
        }
        style={inputStyle}
        placeholder="Optional comments"
        disabled={!isEditMode}
      />
    </td>
  </tr>

  {/* KUB Row */}
  <tr style={cellStyle}>
    <td style={cellStyle}>KUB</td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.KUB?.detail || ""}
        onChange={(e) =>
          handleMedicalInputChange("KUB", "detail", e.target.value)
        }
        style={inputStyle}
        placeholder="Enter details"
        disabled={!isEditMode}
      />
    </td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.KUB?.comment || ""}
        onChange={(e) =>
          handleMedicalInputChange("KUB", "comment", e.target.value)
        }
        style={inputStyle}
        placeholder="Optional comments"
        disabled={!isEditMode}
      />
    </td>
  </tr>

  {/* Cancer Row */}
  <tr style={cellStyle}>
    <td style={cellStyle}>Cancer</td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.Cancer?.detail || ""}
        onChange={(e) =>
          handleMedicalInputChange("Cancer", "detail", e.target.value)
        }
        style={inputStyle}
        placeholder="Enter details"
        disabled={!isEditMode}
      />
    </td>
    <td style={cellStyle}>
      <input
        type="text"
        value={medicalData.Cancer?.comment || ""}
        onChange={(e) =>
          handleMedicalInputChange("Cancer", "comment", e.target.value)
        }
        style={inputStyle}
        placeholder="Optional comments"
        disabled={!isEditMode}
      />
    </td>
  </tr>
    {/* Defective Colour Vision Row */}
    <tr style={cellStyle}>
        <td style={cellStyle}>Defective Colour Vision</td>
        <td style={cellStyle}>
            <input
                type="text"
                value={medicalData.Defective_Colour_Vision?.detail || ''}
                onChange={(e) => handleMedicalInputChange("Defective_Colour_Vision", "detail", e.target.value)}
                style={inputStyle}
                placeholder="Enter details"
                disabled={!isEditMode}
            />
        </td>
        <td style={cellStyle}>
            <input
                type="text"
                value={medicalData.Defective_Colour_Vision?.comment || ''}
                onChange={(e) => handleMedicalInputChange("Defective_Colour_Vision", "comment", e.target.value)}
                style={inputStyle}
                placeholder="Optional comments"
                disabled={!isEditMode}
            />
        </td>
    </tr>
    <tr style={cellStyle}>
        <td style={cellStyle}>Others</td>
        <td style={cellStyle}>
            <input
                type="text"
                value={medicalData.Others?.detail || ''}
                onChange={(e) => handleMedicalInputChange("Others", "detail", e.target.value)}
                style={inputStyle}
                placeholder="Enter details"
                disabled={!isEditMode}
            />
        </td>
        <td style={cellStyle}>
            <input
                type="text"
                value={medicalData.Others?.comment || ''}
                onChange={(e) => handleMedicalInputChange("Others", "comment", e.target.value)}
                style={inputStyle}
                placeholder="Optional comments"
                disabled={!isEditMode}
            />
        </td>
    </tr>

 <br></br>

 <tr>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Obstetric</td>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
          <Select
              isMulti
              options={relationshipOptions2}
              value={medicalData.Obstetric?.detail ? relationshipOptions2.filter(option => medicalData.Obstetric.detail.includes(option.value)) : []}
              onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                  handleMedicalInputChange("Obstetric", "detail", selectedValues);
              }}
              styles={{
                  ...customStyles, // Retain existing custom styles
                  menu: (provided, state) => ({
                      ...provided,
                      // This is the key addition for positioning the menu above.
                      marginTop: '-1px', // Adjust as needed to fine-tune position
                      marginBottom: 'auto', // Prevent overlapping content below.
                  }),
                  menuList: (provided, state) => ({
                  ...provided,
                  position: 'relative', // Added position relative for zIndex
                  zIndex: 2, //Ensure Menu List appears above all elements
                  })
              }}
              menuPlacement="top" //  Force the menu to always appear above
              placeholder="Select Options"
              disabled={!isEditMode}
          />
      </td>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
          <input
              type="text"
              value={medicalData.Obstetric?.comment || ''}
              onChange={(e) => handleMedicalInputChange("Obstetric", "comment", e.target.value)}
              style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
              }}
              placeholder="G3 P1 L1 A1 ; P2 L1 A1"
              disabled={!isEditMode}
          />
      </td>
  </tr>
   <tr>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Gynaec</td>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
          <Select
              isMulti
              options={relationshipOptions2}
              value={medicalData.Gynaec?.detail ? relationshipOptions2.filter(option => medicalData.Gynaec.detail.includes(option.value)) : []}
              onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                  handleMedicalInputChange("Gynaec", "detail", selectedValues);
              }}
              styles={{
                  ...customStyles, // Retain existing custom styles
                  menu: (provided, state) => ({
                      ...provided,
                      // This is the key addition for positioning the menu above.
                      marginTop: '-1px', // Adjust as needed to fine-tune position
                      marginBottom: 'auto', // Prevent overlapping content below.
                  }),
                  menuList: (provided, state) => ({
                  ...provided,
                  position: 'relative', // Added position relative for zIndex
                  zIndex: 2, //Ensure Menu List appears above all elements
                  })
              }}
              menuPlacement="top" //  Force the menu to always appear above
              placeholder="Select Options"
              disabled={!isEditMode}
          />
      </td>
      <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
          <input
              type="text"
              value={medicalData.Gynaec?.comment || ''}
              onChange={(e) => handleMedicalInputChange("Gynaec", "comment", e.target.value)}
              style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
              }}
              placeholder="G3 P1 L1 A1 ; P2 L1 A1"
              disabled={!isEditMode}
          />
      </td>
  </tr>
</tbody>
</table>
</div>
</form>
)}
</div>

{/* Surgical History */}
<div className="mb-6">
{/* Number of Children */}
<div className="mt-4">
<label className="block font-semibold mb-2">
Number of Children({childrenData.length})
</label>
</div>
{/* Children Table */}

{childrenData.length > 0 && (
<div className="overflow-x-auto mt-4">
<table
className="w-full border-collapse border bg-white shadow-md rounded-lg"
style={tableStyle}
>
<thead>
<tr className="bg-gray-200 text-left" style={tableHeaderStyle}>
<th className="p-2 border" style={cellStyle}>
  Sex
</th>
<th className="p-2 border" style={cellStyle}>
  DOB
</th>
<th className="p-2 border" style={cellStyle}>
  Age
</th>
<th className="p-2 border" style={cellStyle}>
  Status
</th>
<th className="p-2 border" style={cellStyle}>
  Reason (If Expired)
</th>
<th className="p-2 border" style={cellStyle}>
  Remarks (Health Condition)
</th>
<th className="p-2 border" style={cellStyle}>
  Action
</th>
</tr>
</thead>
<tbody>
{childrenData.map((child, index) => (
<tr key={index} className="border" style={cellStyle}>
  <td className="p-2" style={cellStyle}>
    <select
      value={child.sex || ""}
      onChange={(e) =>
        handleChildInputChange(index, "sex", e.target.value)
      }
      className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      required
      style={inputStyle}
      disabled={!isEditMode}
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </td>
  <td className="p-2" style={cellStyle}>
    <input
      type="date"
      value={child.dob || ""}
      onChange={(e) =>
        handleChildInputChange(index, "dob", e.target.value)
      }
      className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      required
      style={inputStyle}
      disabled={!isEditMode}
    />
  </td>
    <td className="p-2" style={cellStyle}>
        <input
            type="text"
            value={child.Age || ""}
            onChange={(e) =>
                handleChildInputChange(index, "Age", e.target.value)
            }
            className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Age"
            required
            style={inputStyle}
            disabled={!isEditMode}
        />
    </td>
  <td className="p-2" style={cellStyle}>
    <input
      type="text"
      value={child.status || ""}
      onChange={(e) =>
        handleChildInputChange(index, "status", e.target.value)
      }
      className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder="Status"
      required
      style={inputStyle}
      disabled={!isEditMode}
    />
  </td>
  <td className="p-2" style={cellStyle}>
    <input
      type="text"
      value={child.reason || ""}
      onChange={(e) =>
        handleChildInputChange(index, "reason", e.target.value)
      }
      className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder="Reason (if expired)"
      style={inputStyle}
      disabled={!isEditMode}
    />
  </td>
  <td className="p-2" style={cellStyle}>
    <input
      type="text"
      value={child.remarks || ""}
      onChange={(e) =>
        handleChildInputChange(index, "remarks", e.target.value)
      }
      className="px-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder="Health condition"
      style={inputStyle}
      disabled={!isEditMode}
    />
  </td>
  <td className="p-2 text-center" style={cellStyle}>
    <button
      type="button"
      onClick={() => removeChild(index)}
      className="bg-red-500 text-white px-3 py-1 rounded-md"
      style={buttonStyle}
      disabled={!isEditMode}
    >
      Remove
    </button>
  </td>
</tr>
))}
</tbody>
</table>
</div>
)}
{/* Action Buttons */}
<div className="flex gap-4 mt-4">
<button
type="button"
onClick={addChild}
className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
style={buttonStyle}
disabled={!isEditMode}
>
Add Child
</button>
</div>
<br />
<h2 className="text-xl font-semibold mb-4">Surgical History</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/* Comments Section */}
<div>
<label
htmlFor="surgicalHistoryComments"
className="block text-sm font-medium text-gray-700"
>
Enter Comments:
</label>
<textarea
id="surgicalHistoryComments"
placeholder="Comments"
className="mt-1 px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
value={surgicalHistory.comments || ""}
onChange={(e) => handleSurgicalHistoryCommentChange(e.target.value)}
style={inputStyle}
disabled={!isEditMode}
/>
</div>

{/* Surgical History Input Section */}
<div>
<label
htmlFor="surgicalHistory"
className="block text-sm font-medium text-gray-700"
>
History:
</label>

{(surgicalHistory.children || []).map((child, index) => (
<div key={index}>
<input
type="text"
value={child}

style={inputStyle}
placeholder="Enter details"
disabled={true}
/>
</div>
))}
</div>
</div>
</div>

{/* Allergy History */}

<div className="mb-6">
<h2 className="text-xl font-semibold mb-4">Allergy History</h2>
<div className="grid grid-cols-4 gap-4 items-center">
{/* Header Row - Added Padding and Alignment */}
<div className="col-span-1 font-semibold text-gray-700 pl-2">
Allergy Type
</div>
<div className="col-span-1 font-semibold text-gray-700 text-center">
Response
</div>
<div className="col-span-2 font-semibold text-gray-700">Comments</div>

{/* Drug Allergy Row - Refactored for Alignment and Spacing */}
<div className="flex items-center">
<label className="ml-2 text-gray-700">Drug Allergy</label>
</div>
<div className="flex items-center justify-center space-x-4">
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="drugAllergyResponse" // Grouping radio buttons
value="yes"
checked={allergyFields.drug?.yesNo === "yes"}
onChange={() => handleAllergySelect("drug")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">Yes</span>
</label>
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="drugAllergyResponse"
value="no"
checked={allergyFields.drug?.yesNo === "no"}
onChange={() => handleAllergySelect("drug")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">No</span>
</label>
</div>

<div className="col-span-2">
<textarea
placeholder="Comments on Drug Allergy"
className="w-full px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
value={allergyComments.drug || ""}
onChange={(e) => handleAllergyCommentChange("drug", e.target.value)}
disabled={!isEditMode}
/>
</div>

{/* Food Allergy Row - Refactored for Alignment and Spacing */}
<div className="flex items-center">
<label className="ml-2 text-gray-700">Food Allergy</label>
</div>
<div className="flex items-center justify-center space-x-4">
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="foodAllergyResponse"
value="yes"
checked={allergyFields.food?.yesNo === "yes"}
onChange={() => handleAllergySelect("food")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">Yes</span>
</label>
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="foodAllergyResponse"
value="no"
checked={allergyFields.food?.yesNo === "no"}
onChange={() => handleAllergySelect("food")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">No</span>
</label>
</div>

<div className="col-span-2">
<textarea
placeholder="Comments on Food Allergy"
className="w-full px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
value={allergyComments.food || ""}
onChange={(e) => handleAllergyCommentChange("food", e.target.value)}
disabled={!isEditMode}
/>
</div>

{/* Other Allergies Row - Refactored for Alignment and Spacing */}
<div className="flex items-center">
<label className="ml-2 text-gray-700">Other Allergies</label>
</div>
<div className="flex items-center justify-center space-x-4">
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="otherAllergyResponse"
value="yes"
checked={allergyFields.others?.yesNo === "yes"}
onChange={() => handleAllergySelect("others")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">Yes</span>
</label>
<label className="inline-flex items-center">
<input
type="radio"
className="form-radio h-6 w-6 text-blue-500"
name="otherAllergyResponse"
value="no"
checked={allergyFields.others?.yesNo === "no"}
onChange={() => handleAllergySelect("others")}
disabled={!isEditMode}
/>
<span className="ml-1 text-gray-700 text-lg">No</span>
</label>
</div>

<div className="col-span-2">
<textarea
placeholder="Comments on Other Allergies"
className="w-full px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
value={allergyComments.others || ""}
onChange={(e) =>
handleAllergyCommentChange("others", e.target.value)
}
disabled={!isEditMode}
/>
</div>
</div>
</div>

{/* Family History - Collapsible Section */}
<div style={cardStyle}>
<div style={headerStyle} onClick={toggleFamilyVisibility}>
<h2 style={titleStyle}>Family History</h2>
<span>{showFamilyHistory ? "[-]" : "[+]"}</span>
</div>

{showFamilyHistory && (
<div>
{[
{ label: "Father", relative: "father" },
{ label: "Paternal Grand Father", relative: "paternalGrandFather" },
{ label: "Paternal Grand Mother", relative: "paternalGrandMother" },
{ label: "Mother", relative: "mother" },
{ label: "Maternal Grand Father", relative: "maternalGrandFather" },
{ label: "Maternal Grand Mother", relative: "maternalGrandMother" },
].map(({ label, relative }) => (
<div key={label} className="mb-6">
<label className="block mb-2 font-medium text-gray-700">
{label}
</label>
<div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
{/* Status Select */}
<select
  className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  style={selectStyle}
  value={familyHistory[relative]?.status || ""}
  onChange={(e) =>
    handleFamilyHistoryChange(relative, "status", e.target.value)
  }
  disabled={!isEditMode}
>
  <option value="">Select Status</option>
  <option value="Alive">Alive</option>
  <option value="Expired">Expired</option>
</select>

<input
  type="text"
  placeholder="Reason (if expired)"
  className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  style={inputStyle}
  value={familyHistory[relative]?.reason || ""}
  onChange={(e) =>
    handleFamilyHistoryChange(relative, "reason", e.target.value)
  }
  disabled={
    familyHistory[relative]?.status !== "Expired" || !isEditMode
  }
/>
<input
  type="text"
  placeholder="Remarks (Health Condition)"
  className="flex-grow px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  style={inputStyle}
  value={familyHistory[relative]?.remarks || ""}
  onChange={(e) =>
    handleFamilyHistoryChange(relative, "remarks", e.target.value)
  }
  disabled={!isEditMode}
/>
</div>

</div>

))}
<div style={tableContainerStyle}>
    <table style={tableStyle}>
        <thead>
            <tr style={tableHeaderStyle}>
                <th style={cellStyle}>Condition</th>
                <th style={cellStyle}>Releation Ship</th>
                <th style={cellStyle}>Comments</th>
            </tr>
        </thead>
        <tbody>
            {/* HTN Row */}
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>HTN</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <Select
                      isMulti
                      options={relationshipOptions1}
                      value={conditions.HTN ? relationshipOptions1.filter(option => conditions.HTN.includes(option.value)) : []}
                      onChange={(selectedOptions) => {
                          handleSelectionChange("HTN", selectedOptions);
                      }}
                      styles={customStyles}
                      placeholder="Select Options"
                      disabled={!isEditMode}
                  />
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
              <textarea
                  value={familyHistory.HTN?.comment || ''}
                  onChange={(e) => handleFamilyMedicalConditionChange("HTN", "comment", e.target.value)}
                  style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                  resize: 'vertical', // Important for allowing vertical resizing
                  minHeight: '3rem', // Or whatever minimum height you prefer
                  }}
                  placeholder="Optional comments"
                  disabled={!isEditMode}
              />
              </td>
          </tr>
          {/* DM Row */}
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>DM</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <Select
                      isMulti
                      options={relationshipOptions1}
                      value={conditions.DM ? relationshipOptions1.filter(option => conditions.DM.includes(option.value)) : []}
                      onChange={(selectedOptions) => {
                          handleSelectionChange("DM", selectedOptions);
                      }}
                      styles={customStyles}
                      placeholder="Select Options"
                      disabled={!isEditMode}
                  />
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <input
                      type="text"
                      value={familyHistory.DM?.comment || ''}
                      onChange={(e) => handleFamilyMedicalConditionChange("DM", "comment", e.target.value)}
                      style={{
                          width: '100%',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #ced4da',
                          borderRadius: '0.25rem',
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                      }}
                      placeholder="Optional comments"
                      disabled={!isEditMode}
                  />
              </td>
          </tr>
                {/* Epileptic Row */}
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Epileptic</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <Select
                      isMulti
                      options={relationshipOptions1}
                      value={conditions.Epileptic ? relationshipOptions1.filter(option => conditions.Epileptic.includes(option.value)) : []}
                      onChange={(selectedOptions) => {
                          handleSelectionChange("Epileptic", selectedOptions);
                      }}
                      styles={customStyles}
                      placeholder="Select Options"
                      disabled={!isEditMode}
                  />
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <input
                      type="text"
                      value={familyHistory.Epileptic?.comment || ''}
                      onChange={(e) => handleFamilyMedicalConditionChange("Epileptic", "comment", e.target.value)}
                      style={{
                          width: '100%',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #ced4da',
                          borderRadius: '0.25rem',
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                      }}
                      placeholder="Optional comments"
                      disabled={!isEditMode}
                  />
              </td>
          </tr>

            
            {/* Hyper Thyroid Row */}

          

            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Hyper Thyroid</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <Select
                      isMulti
                      options={relationshipOptions1}
                      value={conditions.Hyper_Thyroid ? relationshipOptions1.filter(option => conditions.Hyper_Thyroid.includes(option.value)) : []}
                      onChange={(selectedOptions) => {
                          handleSelectionChange("Hyper_Thyroid", selectedOptions);
                      }}
                      styles={customStyles}
                      placeholder="Select Options"
                      disabled={!isEditMode}
                  />
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                  <input
                      type="text"
                      value={familyHistory.Hyper_Thyroid?.comment || ''}
                      onChange={(e) => handleFamilyMedicalConditionChange("Hyper_Thyroid", "comment", e.target.value)}
                      style={{
                          width: '100%',
                          padding: '0.375rem 0.75rem',
                          border: '1px solid #ced4da',
                          borderRadius: '0.25rem',
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                      }}
                      placeholder="Optional comments"
                      disabled={!isEditMode}
                  />
              </td>
          </tr>


            {/* Hypo Thyroid Row */}
           
            <tr>
              <td style={{ padding: '0.5rem', borderBottom:'1px solid #dee2e6' }}>Hypo Thyroid</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.Hypo_Thyroid ? relationshipOptions1.filter(option => conditions.Hypo_Thyroid.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("Hypo_Thyroid", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <input
                                        type="text"
                                        value={familyHistory.Hypo_Thyroid?.comment || ''}
                                        onChange={(e) => handleFamilyMedicalConditionChange("Hypo_Thyroid", "comment", e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.375rem 0.75rem',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.25rem',
                                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                                        }}
                                        placeholder="Optional comments"
                                        disabled={!isEditMode}
                                    />
                                </td>
                            </tr>

                                 {/* Asthma Row */}
                                
                              <tr>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Asthma</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.Asthma ? relationshipOptions1.filter(option => conditions.Asthma.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("Asthma", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <input
                                        type="text"
                                        value={familyHistory.Asthma?.comment || ''}
                                        onChange={(e) => handleFamilyMedicalConditionChange("Asthma", "comment", e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.375rem 0.75rem',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.25rem',
                                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                                        }}
                                        placeholder="Optional comments"
                                        disabled={!isEditMode}
                                    />
                                </td>
                            </tr>
                              {/* CVS Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>CVS</td>
                                  <td style={cellStyle}>
                                      <Select
                                          isMulti
                                          options={relationshipOptions1}
                                          value={conditions.CVS ? relationshipOptions1.filter(option => conditions.CVS.includes(option.value)) : []}
                                          onChange={(selectedOptions) => {
                                              handleSelectionChange("CVS", selectedOptions);
                                          }}
                                          styles={customStyles}
                                          placeholder="Select Options"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.CVS?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("CVS", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>

                              {/* CNS Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>CNS</td>
                                  <td style={cellStyle}>
                                      <Select
                                          isMulti
                                          options={relationshipOptions1}
                                          value={conditions.CNS ? relationshipOptions1.filter(option => conditions.CNS.includes(option.value)) : []}
                                          onChange={(selectedOptions) => {
                                              handleSelectionChange("CNS", selectedOptions);
                                          }}
                                          styles={customStyles}
                                          placeholder="Select Options"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.CNS?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("CNS", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>


                              {/* RS Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>RS</td>
                                  <td style={cellStyle}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.RS ? relationshipOptions1.filter(option => conditions.RS.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("RS", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.RS?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("RS", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>

                              {/* GIT Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>GIT</td>
                                  <td style={cellStyle}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.GIT ? relationshipOptions1.filter(option => conditions.GIT.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("GIT", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.GIT?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("GIT", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>

                              {/* KUB Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>KUB</td>
                                  <td style={cellStyle}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.KUB ? relationshipOptions1.filter(option => conditions.KUB.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("KUB", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.KUB?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("KUB", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>

                              {/* Cancer Row */}
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>Cancer</td>
                                  <td style={cellStyle}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions1}
                                        value={conditions.Cancer ? relationshipOptions1.filter(option => conditions.Cancer.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            handleSelectionChange("Cancer", selectedOptions);
                                        }}
                                        styles={customStyles}
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.Cancer?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("Cancer", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>Defective Colour Vision</td>
                                  <td style={cellStyle}>
                                      <Select
                                          isMulti
                                          options={relationshipOptions1}
                                          value={conditions.Defective_Colour_Vision ? relationshipOptions1.filter(option => conditions.Defective_Colour_Vision.includes(option.value)) : []}
                                          onChange={(selectedOptions) => {
                                              handleSelectionChange("Defective_Colour_Vision", selectedOptions);
                                          }}
                                          styles={customStyles}
                                          placeholder="Select Options"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.Defective_Colour_Vision?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("Defective_Colour_Vision", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>
                              <tr style={cellStyle}>
                                  <td style={cellStyle}>Others</td>
                                  <td style={cellStyle}>
                                       <Select
                                          isMulti
                                          options={relationshipOptions1}
                                          value={conditions.Others ? relationshipOptions1.filter(option => conditions.Others.includes(option.value)) : []}
                                          onChange={(selectedOptions) => {
                                              handleSelectionChange("Others", selectedOptions);
                                          }}
                                          styles={customStyles}
                                          placeholder="Select Options"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                                  <td style={cellStyle}>
                                      <input
                                          type="text"
                                          value={familyHistory.Others?.comment || ''}
                                          onChange={(e) => handleFamilyMedicalConditionChange("Others", "comment", e.target.value)}
                                          style={inputStyle}
                                          placeholder="Optional comments"
                                          disabled={!isEditMode}
                                      />
                                  </td>
                              </tr>


                             <tr>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Obstetric</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions2}
                                        value={medicalData.Obstetric?.detail ? relationshipOptions2.filter(option => medicalData.Obstetric.detail.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            handleMedicalInputChange("Obstetric", "detail", selectedValues);
                                        }}
                                        styles={{
                                            ...customStyles, // Retain existing custom styles
                                            menu: (provided, state) => ({
                                                ...provided,
                                                // This is the key addition for positioning the menu above.
                                                marginTop: '-1px', // Adjust as needed to fine-tune position
                                                marginBottom: 'auto', // Prevent overlapping content below.
                                            }),
                                            menuList: (provided, state) => ({
                                            ...provided,
                                            position: 'relative', // Added position relative for zIndex
                                            zIndex: 2, //Ensure Menu List appears above all elements
                                            })
                                        }}
                                        menuPlacement="top" //  Force the menu to always appear above
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <input
                                        type="text"
                                        value={medicalData.Obstetric?.comment || ''}
                                        onChange={(e) => handleMedicalInputChange("Obstetric", "comment", e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.375rem 0.75rem',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.25rem',
                                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                                        }}
                                        placeholder="G3 P1 L1 A1 ; P2 L1 A1"
                                        disabled={!isEditMode}
                                    />
                                </td>
                            </tr>
                             <tr>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>Gynaec</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <Select
                                        isMulti
                                        options={relationshipOptions2}
                                        value={medicalData.Gynaec?.detail ? relationshipOptions2.filter(option => medicalData.Gynaec.detail.includes(option.value)) : []}
                                        onChange={(selectedOptions) => {
                                            const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                            handleMedicalInputChange("Gynaec", "detail", selectedValues);
                                        }}
                                        styles={{
                                            ...customStyles, // Retain existing custom styles
                                            menu: (provided, state) => ({
                                                ...provided,
                                                // This is the key addition for positioning the menu above.
                                                marginTop: '-1px', // Adjust as needed to fine-tune position
                                                marginBottom: 'auto', // Prevent overlapping content below.
                                            }),
                                            menuList: (provided, state) => ({
                                            ...provided,
                                            position: 'relative', // Added position relative for zIndex
                                            zIndex: 2, //Ensure Menu List appears above all elements
                                            })
                                        }}
                                        menuPlacement="top" //  Force the menu to always appear above
                                        placeholder="Select Options"
                                        disabled={!isEditMode}
                                    />
                                </td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #dee2e6' }}>
                                    <input
                                        type="text"
                                        value={medicalData.Gynaec?.comment || ''}
                                        onChange={(e) => handleMedicalInputChange("Gynaec", "comment", e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.375rem 0.75rem',
                                            border: '1px solid #ced4da',
                                            borderRadius: '0.25rem',
                                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                                        }}
                                        placeholder="G3 P1 L1 A1 ; P2 L1 A1"
                                        disabled={!isEditMode}
                                    />
                                </td>
                            </tr>


                          </tbody>
                      </table>
                  </div>
          </div>
        )}
      </div>

    

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          style={buttonStyle}
          disabled={!isEditMode}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MedicalHistory1;