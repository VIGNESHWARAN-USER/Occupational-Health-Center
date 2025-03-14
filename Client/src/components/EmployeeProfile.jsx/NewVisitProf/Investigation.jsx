import React, { useState } from "react";

const Investigation = ({ data }) => {
  const [selectedInvestigation, setSelectedInvestigation] = useState("");

  const invFormOptions = [
    "HAEMATOLOGY",
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

  const handleInvestigationChange = (e) => {
    setSelectedInvestigation(e.target.value);
  };

  const getCategoryData = () => {
    switch (selectedInvestigation) {
      case "HAEMATOLOGY":
        return data.haematology;
      case "ROUTINE SUGAR TESTS":
        return data.routinesugartests;
      case "RENAL FUNCTION TEST & ELECTROLYTES":
        return data.renalfunctiontests_and_electrolytes;
      case "LIPID PROFILE":
        return data.lipidprofile;
      case "LIVER FUNCTION TEST":
        return data.liverfunctiontest;
      case "THYROID FUNCTION TEST":
        return data.thyroidfunctiontest;
      case "COAGULATION TEST":
        return data.coagulationtest;
      case "ENZYMES & CARDIAC Profile":
        return data.enzymesandcardiacprofile;
      case "URINE ROUTINE":
        return data.urineroutine;
      case "SEROLOGY":
        return data.serology;
      case "MOTION":
        return data.motion;
      case "Men's Pack":
        return data.menspack;
      case "OPHTHALMIC REPORT":
        return data.opthalamicreport;
      case "X-RAY":
        return data.xray;
      case "USG":
        return data.usg;
      case "CT":
        return data.ct;
      case "MRI":
        return data.mri;
      default:
        return null;
    }
  };

  const renderDetails = () => {
    const categoryData = getCategoryData();

    if (!categoryData) return null;

    const { id, latest_id, emp_no, ...filteredData } = categoryData; // Remove id, latest_id, emp_no
    const entries = Object.entries(filteredData); // Convert object to array of [key, value] pairs

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([key, value]) => (
          <div key={key} className="border rounded p-4">
            <span className="block font-medium text-gray-700">
              {key.replace(/_/g, " ").replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}:
            </span>
            <span className="py-2 px-4  block w-full rounded-md border-gray-300 bg-blue-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-12">{value || "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
          Select Investigation Form
        </h2>
        <select
          value={selectedInvestigation}
          onChange={handleInvestigationChange}
          className="w-full p-2 border border-gray-300 rounded mb-6 text-sm md:text-base"
        >
          <option value="">Select Investigation</option>
          {invFormOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {selectedInvestigation && renderDetails()}
      </div>
    </div>
  );
};

export default Investigation;