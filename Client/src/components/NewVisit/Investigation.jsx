import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InvestigationForm({ data }) {

  const navigate = useNavigate()

  if(data.length)
  {
    console.log(data)
    delete data[0]['haematology']['id'];
    delete data[0]['haematology']['latest_id'];
    console.log(data[0]['haematology']);
  
  

  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({}); // Initialize formData state

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
        const { id, latest_id, emp_no, ...rest } = categoryData; // Remove id, latest_id and emp_no
        return { ...rest };
      }
      return {};
    };

    switch (selected) {
      case "HAEMATALOGY":
        setFormData(initializeFormData(data[0]['haematology']));
        break;
      case "ROUTINE SUGAR TESTS":
        setFormData(initializeFormData(data[0]['routinesugartests']));
        break;
      // case "RENAL FUNCTION TEST & ELECTROLYTES":
      //   setFormData(initializeFormData(data[0]['renalfunctiontestselectrolytes']));
      //   break;
      case "LIPID PROFILE":
        setFormData(initializeFormData(data[0]['lipidprofile']));
        break;
      case "LIVER FUNCTION TEST":
        setFormData(initializeFormData(data[0]['liverfunctiontest']));
        break;
      case "THYROID FUNCTION TEST":
        setFormData(initializeFormData(data[0]['thyroidfunctiontest']));
        break;
      case "COAGULATION TEST":
        setFormData(initializeFormData(data[0]['coagulationtest']));
        break;
      case "ENZYMES & CARDIAC Profile":
        setFormData(initializeFormData(data[0]['enzymesandcardiacprofile']));
        break;
      case "URINE ROUTINE":
        setFormData(initializeFormData(data[0]['urineroutine']));
        break;
      case "SEROLOGY":
        setFormData(initializeFormData(data[0]['serology']));
        break;
      case "MOTION":
        setFormData(initializeFormData(data[0]['motion']));
        break;
      // case "ROUTINE CULTURE & SENSITIVITY TEST":
      //   setFormData(initializeFormData(data[0]['routineculturesensitivitytest']));
      //   break;
      case "Men's Pack":
        setFormData(initializeFormData(data[0]['menspack']));
        break;
      // case "Women's Pack":
      //   setFormData(initializeFormData(data[0]['womenspack']));
      //   break;
      // case "Occupational Profile":
      //   setFormData(initializeFormData(data[0]['occupationalprofile']));
      //   break;
      // case "Others TEST":
      //   setFormData(initializeFormData(data[0]['otherstest']));
      //   break;
      case "OPHTHALMIC REPORT":
        setFormData(initializeFormData(data[0]['opthalmicreport']));
        break;
      case "X-RAY":
        setFormData(initializeFormData(data[0]['xray']));
        break;
      case "USG":
        setFormData(initializeFormData(data[0]['usg']));
        break;
      case "CT":
        setFormData(initializeFormData(data[0]['ct']));
        break;
      case "MRI":
        setFormData(initializeFormData(data[0]['mri']));
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

  console.log(data);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await axios.post(url, dataToSend, {
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
    let categoryData;

    switch (category) {
      case "HAEMATALOGY":
        categoryData = data[0]?.haematology;
        break;
      case "ROUTINE SUGAR TESTS":
        categoryData = data[0]?.routinesugartests;
        break;
      // case "RENAL FUNCTION TEST & ELECTROLYTES":
      //   categoryData = data[0]?.renalfunctiontestselectrolytes;
      //   break;
      case "LIPID PROFILE":
        categoryData = data[0]?.lipidprofile;
        break;
      case "LIVER FUNCTION TEST":
        categoryData = data[0]?.liverfunctiontest;
        break;
      case "THYROID FUNCTION TEST":
        categoryData = data[0]?.thyroidfunctiontest;
        break;
      case "COAGULATION TEST":
        categoryData = data[0]?.coagulationtest;
        break;
      case "ENZYMES & CARDIAC Profile":
        categoryData = data[0]?.enzymesandcardiacprofile;
        break;
      case "URINE ROUTINE":
        categoryData = data[0]?.urineroutine;
        break;
      case "SEROLOGY":
        categoryData = data[0]?.serology;
        break;
      case "MOTION":
        categoryData = data[0]?.motion;
        break;
      // case "ROUTINE CULTURE & SENSITIVITY TEST":
      //   categoryData = data[0]?.routineculturesensitivitytest;
      //   break;
      case "Men's Pack":
        categoryData = data[0]?.menspack;
        break;
      // case "Women's Pack":
      //   categoryData = data[0]?.womenspack;
      //   break;
      // case "Occupational Profile":
      //   categoryData = data[0]?.occupationalprofile;
      //   break;
      // case "Others TEST":
      //   categoryData = data[0]?.otherstest;
      //   break;
      case "OPHTHALMIC REPORT":
        categoryData = data[0]?.opthalmicreport;
        break;
      case "X-RAY":
        categoryData = data[0]?.xray;
        break;
      case "USG":
        categoryData = data[0]?.usg;
        break;
      case "CT":
        categoryData = data[0]?.ct;
        break;
      case "MRI":
        categoryData = data[0]?.mri;
        break;
      default:
        categoryData = {};
        break;
    }

    if (!categoryData) return null;

    // Make sure to remove the id, latest_id and emp_no fields
    const { id, latest_id, emp_no, ...filteredCategoryData } = categoryData;
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
    </div>
  );
}
else{
  return (
<p className=" p-4 flex justify-center items-center">Get the employee details</p>
  )
  
}
}


export default InvestigationForm;