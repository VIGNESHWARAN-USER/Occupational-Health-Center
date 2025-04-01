import axios from "axios";
import React, { useState, useEffect } from "react"; //Import useEffect
import { useNavigate } from "react-router-dom";

function InvestigationForm({ data }) {

  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({}); // Initialize formData state
  const [processedData, setProcessedData] = useState(null); // State to hold processed data

  useEffect(() => {
    if (data && data.length) {
      const newData = JSON.parse(JSON.stringify(data)); // Deep copy to avoid modifying original data
      delete newData[0]['haematology']['id'];
      delete newData[0]['haematology']['latest_id'];
      setProcessedData(newData);
      console.log(newData[0]['haematology']);
    } else {
      setProcessedData(null);
    }
  }, [data]); // useEffect runs whenever data changes

  const invFormOptions = [
    "HAEMATALOGY",
    "ROUTINE SUGAR TESTS",
    "RENAL FUNCTION TEST & ELECTROLYTES",
    "LIPID PROFILE",
    "LIVER FUNCTION TEST",
    "THYROID FUNCTION TEST",
    "AUTOIMMUNE TEST",
    "COAGULATION TEST",
    "ENZYMES & CARDIAC Profile",
    "URINE ROUTINE",
    "SEROLOGY",
    "MOTION",
    "ROUTINE CULTURE & SENSITIVITY TEST",
    "Men's Pack",
    "Women's Pack",
    "Occupational Profile",
    "Others TEST",
    "OPHTHALMIC REPORT",
    "X-RAY",
    "USG",
    "CT",
    "MRI",
  ];


  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);

    // Initialize form data based on selected option
    const initializeFormData = (categoryData) => {
      if (categoryData) {
        const { id, latest_id, emp_no, entry_date, ...rest } = categoryData; // Remove id, latest_id, emp_no, and entry_date
        return { ...rest };
      }
      return {};
    };

    switch (selected) {
      case "HAEMATALOGY":
        setFormData(initializeFormData(processedData ? processedData[0]['haematology'] : null));
        break;
      case "ROUTINE SUGAR TESTS":
        setFormData(initializeFormData(processedData ? processedData[0]['routinesugartests'] : null));
        break;
      // case "RENAL FUNCTION TEST & ELECTROLYTES":
      //   setFormData(initializeFormData(processedData ? processedData[0]['renalfunctiontestselectrolytes'] : null));
      //   break;
      case "LIPID PROFILE":
        setFormData(initializeFormData(processedData ? processedData[0]['lipidprofile'] : null));
        break;
      case "LIVER FUNCTION TEST":
        setFormData(initializeFormData(processedData ? processedData[0]['liverfunctiontest'] : null));
        break;
      case "THYROID FUNCTION TEST":
        setFormData(initializeFormData(processedData ? processedData[0]['thyroidfunctiontest'] : null));
        break;
      case "COAGULATION TEST":
        setFormData(initializeFormData(processedData ? processedData[0]['coagulationtest'] : null));
        break;
      case "ENZYMES & CARDIAC Profile":
        setFormData(initializeFormData(processedData ? processedData[0]['enzymesandcardiacprofile'] : null));
        break;
      case "URINE ROUTINE":
        setFormData(initializeFormData(processedData ? processedData[0]['urineroutine'] : null));
        break;
      case "SEROLOGY":
        setFormData(initializeFormData(processedData ? processedData[0]['serology'] : null));
        break;
      case "MOTION":
        setFormData(initializeFormData(processedData ? processedData[0]['motion'] : null));
        break;
      // case "ROUTINE CULTURE & SENSITIVITY TEST":
      //   setFormData(initializeFormData(processedData ? processedData[0]['routineculturesensitivitytest'] : null));
      //   break;
      case "Men's Pack":
        setFormData(initializeFormData(processedData ? processedData[0]['menspack'] : null));
        break;
      // case "Women's Pack":
      //   setFormData(initializeFormData(processedData ? processedData[0]['womenspack'] : null));
      //   break;
      // case "Occupational Profile":
      //   setFormData(initializeFormData(processedData ? processedData[0]['occupationalprofile'] : null));
      //   break;
      // case "Others TEST":
      //   setFormData(initializeFormData(processedData ? processedData[0]['otherstest'] : null));
      //   break;
      case "OPHTHALMIC REPORT":
        setFormData(initializeFormData(processedData ? processedData[0]['opthalmicreport'] : null));
        break;
      case "X-RAY":
        setFormData(initializeFormData(processedData ? processedData[0]['xray'] : null));
        break;
      case "USG":
        setFormData(initializeFormData(processedData ? processedData[0]['usg'] : null));
        break;
      case "CT":
        setFormData(initializeFormData(processedData ? processedData[0]['ct'] : null));
        break;
      case "MRI":
        setFormData(initializeFormData(processedData ? processedData[0]['mri'] : null));
        break;
      default:
        setFormData({}); // Reset if no option selected
        break;
    }
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!processedData) {
      alert("Please wait for data to load.");
      return;
    }

    let url = "";
    let dataToSend = {};

    switch (selectedOption) {
      case "HAEMATALOGY":
        url = "http://localhost:8000/addInvestigation";
        dataToSend = formData;
        break;
      case "ROUTINE SUGAR TESTS":
        url = "http://localhost:8000/addRoutineSugarTest"; // Update with your endpoint
        dataToSend = formData;
        break;
      case "LIPID PROFILE":
        url = "http://localhost:8000/addLipidProfile";
        dataToSend = formData;
        break;
      case "LIVER FUNCTION TEST":
        url = "http://localhost:8000/addLiverFunctionTest";
        dataToSend = formData;
        break;
      case "THYROID FUNCTION TEST":
        url = "http://localhost:8000/addThyroidFunctionTest";
        dataToSend = formData;
        break;
      case "COAGULATION TEST":
        url = "http://localhost:8000/addCoagulationTest";
        dataToSend = formData;
        break;
      case "ENZYMES & CARDIAC Profile":
        url = "http://localhost:8000/addEnzymesAndCardiacProfile";
        dataToSend = formData;
        break;
      case "URINE ROUTINE":
        url = "http://localhost:8000/addUrineRoutine";
        dataToSend = formData;
        break;
      case "SEROLOGY":
        url = "http://localhost:8000/addSerology";
        dataToSend = formData;
        break;
      case "MOTION":
        url = "http://localhost:8000/addMotion";
        dataToSend = formData;
        break;
      case "Men's Pack":
        url = "http://localhost:8000/addMensPack";
        dataToSend = formData;
        break;
      case "OPHTHALMIC REPORT":
        url = "http://localhost:8000/addOpthalmicReport";
        dataToSend = formData;
        break;
      case "X-RAY":
        url = "http://localhost:8000/addXRay";
        dataToSend = formData;
        break;
      case "USG":
        url = "http://localhost:8000/addUSG";
        dataToSend = formData;
        break;
      case "CT":
        url = "http://localhost:8000/addCT";
        dataToSend = formData;
        break;
      case "MRI":
        url = "http://localhost:8000/addMRI";
        dataToSend = formData;
        break;
      default:
        alert("Please select an investigation type.");
        return;
    }

    try {
      const updatedData = { ...dataToSend, emp_no: processedData[0].emp_no };
      console.log(updatedData);
      const response = await axios.post(url, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting data!");
    }
  };


  const renderFields = (category) => {
    if (!processedData) return null;

    let categoryData;

    switch (category) {
      case "HAEMATALOGY":
        categoryData = processedData[0]?.haematology;
        break;
      case "ROUTINE SUGAR TESTS":
        categoryData = processedData[0]?.routinesugartests;
        break;
      // case "RENAL FUNCTION TEST & ELECTROLYTES":
      //   categoryData = processedData[0]?.renalfunctiontestselectrolytes;
      //   break;
      case "LIPID PROFILE":
        categoryData = processedData[0]?.lipidprofile;
        break;
      case "LIVER FUNCTION TEST":
        categoryData = processedData[0]?.liverfunctiontest;
        break;
      case "THYROID FUNCTION TEST":
        categoryData = processedData[0]?.thyroidfunctiontest;
        break;
      case "COAGULATION TEST":
        categoryData = processedData[0]?.coagulationtest;
        break;
      case "ENZYMES & CARDIAC Profile":
        categoryData = processedData[0]?.enzymesandcardiacprofile;
        break;
      case "URINE ROUTINE":
        categoryData = processedData[0]?.urineroutine;
        break;
      case "SEROLOGY":
        categoryData = processedData[0]?.serology;
        break;
      case "MOTION":
        categoryData = processedData[0]?.motion;
        break;
      // case "ROUTINE CULTURE & SENSITIVITY TEST":
      //   categoryData = processedData[0]?.routineculturesensitivitytest;
      //   break;
      case "Men's Pack":
        categoryData = processedData[0]?.menspack;
        break;
      // case "Women's Pack":
      //   categoryData = processedData[0]?.womenspack;
      //   break;
      // case "Occupational Profile":
      //   categoryData = processedData[0]?.occupationalprofile;
      //   break;
      // case "Others TEST":
      //   categoryData = processedData[0]?.otherstest;
      //   break;
      case "OPHTHALMIC REPORT":
        categoryData = processedData[0]?.opthalmicreport;
        break;
      case "X-RAY":
        categoryData = processedData[0]?.xray;
        break;
      case "USG":
        categoryData = processedData[0]?.usg;
        break;
      case "CT":
        categoryData = processedData[0]?.ct;
        break;
      case "MRI":
        categoryData = processedData[0]?.mri;
        break;
      default:
        categoryData = {};
        break;
    }

    if (!categoryData) return null;

    // Make sure to remove the id, latest_id, emp_no, and entry_date fields
    const { id, latest_id, emp_no, entry_date, ...filteredCategoryData } = categoryData;
    const fields = Object.keys(filteredCategoryData);

    return (
      <div className="grid grid-cols-4 gap-4">
        {fields.map((key, index) => (
          <div key={index} className="col-span-1">
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </label>
            <div className="mt-1">
              {key.includes("comments") ? (
                <textarea
                  id={key}
                  className="py-2 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12"
                  value={formData[key] || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  id={key}
                  className="py-3 px-4 block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData[key] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      {processedData ? (
        <>
          <div className="mb-6">
            <label htmlFor="investigations" className="block text-sm font-medium text-gray-700">
              Select Investigation
            </label>
            <select
              id="investigations"
              name="investigations"
              className="py-4 mt-1 block w-full rounded-md bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="">-- Select an option --</option>
              {invFormOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {selectedOption && (
            <div>
              {renderFields(selectedOption)}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-1/5 mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
              >
                Add Data
              </button>
            </div>
          )}
        </>
      ) : (
        <p className=" p-4 flex justify-center items-center">Get the employee details</p>
      )}
    </div>
  );
}

export default InvestigationForm;