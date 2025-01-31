import React, { useState } from "react";

function InvestigationForm() {
  const [selectedOption, setSelectedOption] = useState(""); // State to track the selected option

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
    setSelectedOption(e.target.value); // Update the state with the selected option
  };

  return (
    <div className="bg-blue-100 p-8 rounded-lg">
      <div className="mb-6">
        <label htmlFor="investigations" className="block text-sm font-medium text-gray-700">
          Select Investigation
        </label>
        <select
          id="investigations"
          name="investigations"
          className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

      {selectedOption === "HAEMATALOGY" && (
        <div>
          <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <label htmlFor="hemoglobin" className="block text-sm font-medium text-gray-700">
              Hemoglobin
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="hemoglobin"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="hemoglobinUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="hemoglobinUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="hemoglobinReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="hemoglobinReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="hemoglobinComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="hemoglobinComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="TotalRBC" className="block text-sm font-medium text-gray-700">
            Total RBC
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalRBC"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalRBCUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalRBCUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalRBCReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalRBCReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalRBCComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="TotalRBCComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="TotalWBC" className="block text-sm font-medium text-gray-700">
            Total WBC
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalWBC"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalWBCUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalWBCUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalWBCnReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="TotalWBCReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="TotalWBCComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="TotalWBCComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Neutrophil" className="block text-sm font-medium text-gray-700">
            Neutrophil
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Neutrophil"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="NeutrophilUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="NeutrophilUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="NeutrophilReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="NeutrophilReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="NeutrophilComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="NeutrophilComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Monocyte" className="block text-sm font-medium text-gray-700">
            Monocyte
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Monocyte"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MonocyteUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MonocyteUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MonocyteReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MonocyteReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MonocyteComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="MonocyteComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="PCV" className="block text-sm font-medium text-gray-700">
            PCV
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="PCV"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="PCVUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="PCVUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="PCVReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="PCVReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="PCVComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="PCVComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="MCV" className="block text-sm font-medium text-gray-700">
            MCV
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCV"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCVUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCVUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCVReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCVReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCVComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="MCVComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="MCH" className="block text-sm font-medium text-gray-700">
              MCH
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCH"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCHUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCHReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="MCHComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Lymphocyte" className="block text-sm font-medium text-gray-700">
              Lymphocyte
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Lymphocyte"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="LymphocyteUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="LymphocyteUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="LymphocyteReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="LymphocyteReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="LymphocyteComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="LymphocyteComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="ESR" className="block text-sm font-medium text-gray-700">
              ESR
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="ESR"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="ESRUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="ESRUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="ESRReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="ESRReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="ESRComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="ESRComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="MCHC" className="block text-sm font-medium text-gray-700">
              MCHC
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCHC"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHCUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCHCUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHCReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="MCHCReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="MCHCComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="MCHCComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Platelet Count" className="block text-sm font-medium text-gray-700">
              Platelet Count
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Platelet Count"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="Platelet CountUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Platelet CountUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="Platelet CountReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Platelet CountReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="Platelet CountComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="Platelet CountComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="RDW" className="block text-sm font-medium text-gray-700">
              RDW
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="RDW"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="RDWUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="RDWUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="RDWReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="RDWReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="RDWComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="RDWComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Eosinophil" className="block text-sm font-medium text-gray-700">
              Eosinophil
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Eosinophil"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="EosinophilUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="EosinophilUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="EosinophilReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="EosinophilReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="EosinophilComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="EosinophilComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="Basophil" className="block text-sm font-medium text-gray-700">
              Basophil
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="Basophil"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="BasophilUnit" className="block text-sm font-medium text-gray-700">
              Unit (in %)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="BasophilUnit"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="BasophilReferenceRange" className="block text-sm font-medium text-gray-700">
              Reference Range
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="BasophilReferenceRange"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="col-span-1">
            <label htmlFor="BasophilComments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <div className="mt-1">
              <textarea
                id="BasophilComments"
                className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          </div>
          <div>
          <div className="mb-6">
            <label htmlFor="investigations" className="mt-5 block text-sm font-medium text-gray-700">
              Preipheral Blood Smear - RBC Morphology
            </label>
            <textarea
                    id="BasophilComments"
                    className="mt-3 py-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="investigations" className="mt-5 block text-sm font-medium text-gray-700">
            Preipheral Blood Smear - Parasites
            </label>
            <textarea
                    id="BasophilComments"
                    className="mt-3 py-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="investigations" className="mt-5 block text-sm font-medium text-gray-700">
            Preipheral Blood Smear - Others
            </label>
            <textarea
                    id="BasophilComments"
                    className="mt-3 py-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        
          </div>

          </div>
        </div>
        
        
      )}

      {selectedOption === "ROUTINE SUGAR TESTS" && (
        <div>
          <h3 className="text-lg font-medium">Routine Sugar Tests Inputs</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Glucose(F)" className="block text-sm font-medium text-gray-700">
                Glucose(F)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(F)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(F)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(F)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(F)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(F)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(F)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Glucose(F)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Glucose(PP)" className="block text-sm font-medium text-gray-700">
                Glucose(PP)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(PP)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(PP)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(PP)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(PP)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose(PP)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose(PP)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Glucose(PP)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="RandomBloodsugar" className="block text-sm font-medium text-gray-700">
                RandomBloodsugar
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RandomBloodsugar"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RandomBloodsugarUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RandomBloodsugarUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RandomBloodsugarReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RandomBloodsugarReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RandomBloodsugarComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="RandomBloodsugarComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="EstimatedAverageGlucose" className="block text-sm font-medium text-gray-700">
                EstimatedAverageGlucose
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="EstimatedAverageGlucose"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="EstimatedAverageGlucoseUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="EstimatedAverageGlucoseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="EstimatedAverageGlucoseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="EstimatedAverageGlucoseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="EstimatedAverageGlucoseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="EstimatedAverageGlucoseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="HbA1c" className="block text-sm font-medium text-gray-700">
                HbA1c
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HbA1c"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HbA1cUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HbA1cUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HbA1cReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HbA1cReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HbA1cComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="HbA1cComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedOption === "RENAL FUNCTION TEST & ELECTROLYTES" && (
        <div>
          <div className="mb-6">
            <label htmlFor="investigations" className="mt-5 block text-sm font-medium text-gray-700">
              Employee ID :
              </label>
              <input
                      type="text"
                      id="BasophilComments"
                      className="mt-3 p-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
          </div>
          <h3 className="text-lg font-medium">RENAL FUNCTION TEST & ELECTROLYTES</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Urea" className="block text-sm font-medium text-gray-700">
                Urea
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Urea"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UreaUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UreaUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UreaReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UreaReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UreaComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="UreaComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="BUN" className="block text-sm font-medium text-gray-700">
                BUN
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BUN"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BUNUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BUNUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BUNReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BUNReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BUNComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="BUNComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Calcium" className="block text-sm font-medium text-gray-700">
                Calcium
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Calcium"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CalciumUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CalciumUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CalciumReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CalciumReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CalciumComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CalciumComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Sodium" className="block text-sm font-medium text-gray-700">
                Sodium
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Sodium"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SodiumUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SodiumUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SodiumReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SodiumReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SodiumComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="SodiumComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Potassium" className="block text-sm font-medium text-gray-700">
                Potassium
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Potassium"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PotassiumUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PotassiumUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PotassiumReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PotassiumReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PotassiumComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PotassiumComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Phosphorus" className="block text-sm font-medium text-gray-700">
                Phosphorus
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Phosphorus"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PhosphorusUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PhosphorusUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PhosphorusReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PhosphorusReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PhosphorusComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PhosphorusComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="SerumCreatinine" className="block text-sm font-medium text-gray-700">
                SerumCreatinine
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SerumCreatinine"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SerumCreatinineUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SerumCreatinineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SerumCreatinineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SerumCreatinineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SerumCreatinineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="SerumCreatinineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="UricAcid" className="block text-sm font-medium text-gray-700">
                UricAcid
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UricAcid"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UricAcidUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UricAcidUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UricAcidReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UricAcidReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UricAcidComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="UricAcidComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Chloride" className="block text-sm font-medium text-gray-700">
                Chloride
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Chloride"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ChlorideUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ChlorideUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ChlorideReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ChlorideReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ChlorideComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="ChlorideComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedOption ==="LIPID PROFILE" && (
        <div>
          <h3 className="text-lg font-medium">LIPID PROFILE</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            
            <div className="col-span-1">
              <label htmlFor="Calcium" className="block text-sm font-medium text-gray-700">
                Calcium
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Calcium"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CalciumUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CalciumUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CalciumReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CalciumReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="coTotalCholesteroll-span-1">
              <label htmlFor="CalciumComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CalciumComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Triglycerides" className="block text-sm font-medium text-gray-700">
                Triglycerides
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Triglycerides"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TriglyceridesUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TriglyceridesUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TriglyceridesReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TriglyceridesReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TriglyceridesComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="TriglyceridesComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="HDL - Cholesterol" className="block text-sm font-medium text-gray-700">
                HDL - Cholesterol
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HDL - Cholesterol"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HDL - CholesterolUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HDL - CholesterolUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HDL - CholesterolReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="HDL - CholesterolReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="HDL - CholesterolComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="HDL - CholesterolComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="LDL- Cholesterol" className="block text-sm font-medium text-gray-700">
                LDL- Cholesterol
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL- Cholesterol"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL- CholesterolUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL- CholesterolUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL- CholesterolReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL- CholesterolReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL- CholesterolComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="LDL- CholesterolComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="CHOL HDL ratio" className="block text-sm font-medium text-gray-700">
                CHOL HDL ratio
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CHOL HDL ratio"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CHOL HDL ratioUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CHOL HDL ratioUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CHOL HDL ratioReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CHOL HDL ratioReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CHOL HDL ratioComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CHOL HDL ratioComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="VLDL -Choleserol" className="block text-sm font-medium text-gray-700">
                VLDL -Choleserol
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="VLDL -Choleserol"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="VLDL -CholeserolUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="VLDL -CholeserolUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="VLDL -CholeserolReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="VLDL -CholeserolReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="VLDL -CholeserolComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="VLDL -CholeserolComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="LDL.CHOL/HDL.CHOL Ratio" className="block text-sm font-medium text-gray-700">
                LDL.CHOL/HDL.CHOL Ratio
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL.CHOL/HDL.CHOL Ratio"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL.CHOL/HDL.CHOL RatioUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL.CHOL/HDL.CHOL RatioUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL.CHOL/HDL.CHOL RatioReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LDL.CHOL/HDL.CHOL RatioReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LDL.CHOL/HDL.CHOL RatioComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="LDL.CHOL/HDL.CHOL RatioComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
       {selectedOption === "LIVER FUNCTION TEST" && (
        <div>
          
          <h3 className="text-lg font-medium">LIVER FUNCTION TEST</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Bilirubin - Total" className="block text-sm font-medium text-gray-700">
                Bilirubin - Total
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - Total"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - TotalUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - TotalUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - TotalReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - TotalReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - TotalComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bilirubin - TotalComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bilirubin - Direct" className="block text-sm font-medium text-gray-700">
                Bilirubin - Direct
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - Direct"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - DirectUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - DirectUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - DirectReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - DirectReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - DirectComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bilirubin - DirectComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bilirubin - Indirect" className="block text-sm font-medium text-gray-700">
                Bilirubin - Indirect
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - Indirect"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - IndirectUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - IndirectUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - IndirectReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bilirubin - IndirectReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bilirubin - IndirectComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bilirubin - IndirectComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="SGOT /AST" className="block text-sm font-medium text-gray-700">
                SGOT /AST
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGOT /AST"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGOT /ASTUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGOT /ASTUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGOT /ASTReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGOT /ASTReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGOT /ASTComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="SGOT /ASTComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="SGPT /ALT" className="block text-sm font-medium text-gray-700">
                SGPT /ALT
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGPT /ALT"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGPT /ALTUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGPT /ALTUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGPT /ALTReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SGPT /ALTReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SGPT /ALTComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="SGPT /ALTComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Alkaline phosphatase" className="block text-sm font-medium text-gray-700">
                Alkaline phosphatase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alkaline phosphatase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alkaline phosphataseUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alkaline phosphataseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alkaline phosphataseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alkaline phosphataseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alkaline phosphataseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Alkaline phosphataseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Total Protein" className="block text-sm font-medium text-gray-700">
                Total Protein
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Total Protein"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Total ProteinUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Total ProteinUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Total ProteinReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Total ProteinReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Total ProteinComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Total ProteinComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Albumin (Serum )" className="block text-sm font-medium text-gray-700">
                Albumin (Serum )
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Albumin (Serum )"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Albumin (Serum )Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Albumin (Serum )Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Albumin (Serum )ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Albumin (Serum )ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Albumin (Serum )Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Albumin (Serum )Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Globulin(Serum)" className="block text-sm font-medium text-gray-700">
                Globulin(Serum)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Globulin(Serum)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Globulin(Serum)Unit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Globulin(Serum)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Globulin(Serum)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Globulin(Serum)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Globulin(Serum)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Globulin(Serum)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Alb/Glob Ratio" className="block text-sm font-medium text-gray-700">
                Alb/Glob Ratio
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alb/Glob Ratio"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alb/Glob RatioUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alb/Glob RatioUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alb/Glob RatioReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Alb/Glob RatioReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Alb/Glob RatioComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Alb/Glob RatioComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Gamma Glutamyl transferase" className="block text-sm font-medium text-gray-700">
                Gamma Glutamyl transferase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Gamma Glutamyl transferase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Gamma Glutamyl transferaseUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Gamma Glutamyl transferaseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Gamma Glutamyl transferaseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Gamma Glutamyl transferaseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Gamma Glutamyl transferaseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Gamma Glutamyl transferaseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption ==="THYROID FUNCTION TEST"  && (
        <div>
          
          <h3 className="text-lg font-medium">THYROID FUNCTION TEST</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="T3- Triiodothyroine" className="block text-sm font-medium text-gray-700">
                T3- Triiodothyroine
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T3- Triiodothyroine"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T3- TriiodothyroineUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T3- TriiodothyroineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T3- TriiodothyroineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T3- TriiodothyroineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T3- TriiodothyroineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="T3- TriiodothyroineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="T4 - Thyroxine" className="block text-sm font-medium text-gray-700">
                T4 - Thyroxine
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T4 - Thyroxine"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T4 - ThyroxineUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T4 - ThyroxineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T4 - ThyroxineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="T4 - ThyroxineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="T4 - ThyroxineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="T4 - ThyroxineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="TSH- Thyroid Stimulating Hormone" className="block text-sm font-medium text-gray-700">
                TSH- Thyroid Stimulating Hormone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TSH- Thyroid Stimulating Hormone"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TSH- Thyroid Stimulating HormoneUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TSH- Thyroid Stimulating HormoneUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TSH- Thyroid Stimulating HormoneReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TSH- Thyroid Stimulating HormoneReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TSH- Thyroid Stimulating HormoneComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="TSH- Thyroid Stimulating HormoneComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption ==="COAGULATION TEST"  && (
        <div>
          
          <h3 className="text-lg font-medium">COAGULATION TEST</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Prothrombin Time (PT)" className="block text-sm font-medium text-gray-700">
                Prothrombin Time (PT)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Prothrombin Time (PT)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Prothrombin Time (PT)Unit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Prothrombin Time (PT)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Prothrombin Time (PT)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Prothrombin Time (PT)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Prothrombin Time (PT)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Prothrombin Time (PT)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="PT INR" className="block text-sm font-medium text-gray-700">
                PT INR
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PT INR"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PT INRUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PT INRUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PT INRReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PT INRReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PT INRComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PT INRComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Clotting Time (CT)" className="block text-sm font-medium text-gray-700">
                Clotting Time (CT)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Clotting Time (CT)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Clotting Time (CT)Unit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Clotting Time (CT)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Clotting Time (CT)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Clotting Time (CT)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Clotting Time (CT)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Clotting Time (CT)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bleeding Time (BT)" className="block text-sm font-medium text-gray-700">
                Bleeding Time (BT)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bleeding Time (BT)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bleeding Time (BT)Unit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bleeding Time (BT)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bleeding Time (BT)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bleeding Time (BT)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bleeding Time (BT)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bleeding Time (BT)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption ==="ENZYMES & CARDIAC Profile"  && (
        <div>
          
          <h3 className="text-lg font-medium">ENZYMES & CARDIAC Profile</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Acid Phosphatase" className="block text-sm font-medium text-gray-700">
                Acid Phosphatase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Acid Phosphatase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Acid PhosphataseUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Acid PhosphataseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Acid PhosphataseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Acid PhosphataseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Acid PhosphataseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Acid PhosphataseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Adenosine Deaminase" className="block text-sm font-medium text-gray-700">
                Adenosine Deaminase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Adenosine Deaminase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Adenosine DeaminaseUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Adenosine DeaminaseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Adenosine DeaminaseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Adenosine DeaminaseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Adenosine DeaminaseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Adenosine DeaminaseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Amylase" className="block text-sm font-medium text-gray-700">
                Amylase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Amylase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AmylaseUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AmylaseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AmylaseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AmylaseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AmylaseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="AmylaseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="ECG" className="block text-sm font-medium text-gray-700">
                ECG
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECGUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ECGUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECGReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ECGReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECGComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="ECGComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Troponin- T" className="block text-sm font-medium text-gray-700">
                Troponin- T
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Troponin- T"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Troponin- TUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Troponin- TUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Troponin- TReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Troponin- TReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Troponin- TComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Troponin- TComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="CPK - TOTAL" className="block text-sm font-medium text-gray-700">
                CPK - TOTAL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - TOTAL"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - TOTALUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - TOTALUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - TOTALReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - TOTALReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - TOTALComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CPK - TOTALComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="ECHO" className="block text-sm font-medium text-gray-700">
                ECHO
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECHOUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ECHOUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECHOReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ECHOReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ECHOComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="ECHOComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Lipase" className="block text-sm font-medium text-gray-700">
                Lipase
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Lipase"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LipaseUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LipaseUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LipaseReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="LipaseReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="LipaseComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="LipaseComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="CPK - MB" className="block text-sm font-medium text-gray-700">
                CPK - MB
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - MB"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - MBUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - MBUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - MBReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CPK - MBReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CPK - MBComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CPK - MBComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="TMT" className="block text-sm font-medium text-gray-700">
                TMT
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="TMTUnit" className="block text-sm font-medium text-gray-700">
                Unit (in %)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TMTUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TMTReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="TMTReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="TMTComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="TMTComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption === "URINE ROUTINE"  && (
        <div>
          
          <h3 className="text-lg font-medium">URINE ROUTINE</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Colour" className="block text-sm font-medium text-gray-700">
                Colour
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Colour"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ColourUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ColourUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ColourReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="ColourReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="ColourComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="ColourComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Appearance" className="block text-sm font-medium text-gray-700">
                Appearance
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Appearance"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AppearanceUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AppearanceUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AppearanceReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AppearanceReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AppearanceComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="AppearanceComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Reaction (pH)" className="block text-sm font-medium text-gray-700">
                Reaction (pH)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Reaction (pH)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Reaction (pH)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Reaction (pH)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Reaction (pH)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Reaction (pH)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Reaction (pH)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Reaction (pH)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Specific gravity" className="block text-sm font-medium text-gray-700">
                Specific gravity
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Specific gravityReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            
            </div>

            <div className="col-span-1">
              <label htmlFor="Specific gravityUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Specific gravityUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Specific gravityReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Specific gravityReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Specific gravityComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Specific gravityComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Crystals" className="block text-sm font-medium text-gray-700">
                Crystals
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Crystals"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CrystalsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CrystalsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CrystalsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CrystalsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CrystalsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CrystalsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bacteria" className="block text-sm font-medium text-gray-700">
                Bacteria
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bacteria"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BacteriaUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BacteriaUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BacteriaReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BacteriaReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BacteriaComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="BacteriaComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Protein/Albumin" className="block text-sm font-medium text-gray-700">
                Protein/Albumin
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Protein/AlbuminUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="Protein/AlbuminUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Protein/AlbuminUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Protein/AlbuminReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Protein/AlbuminReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Protein/AlbuminComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Protein/AlbuminComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Glucose (Urine)" className="block text-sm font-medium text-gray-700">
                Glucose (Urine)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose (Urine)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose (Urine)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose (Urine)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose (Urine)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Glucose (Urine)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Glucose (Urine)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Glucose (Urine)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Ketone Bodies" className="block text-sm font-medium text-gray-700">
                Ketone Bodies
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Ketone Bodies"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Ketone BodiesUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Ketone BodiesUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Ketone BodiesReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Ketone BodiesReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Ketone BodiesComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Ketone BodiesComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Urobilinogen" className="block text-sm font-medium text-gray-700">
                Urobilinogen
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UrobilinogenReferenceRange"
                  className="py-3  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="UrobilinogenUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UrobilinogenUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UrobilinogenReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UrobilinogenReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UrobilinogenComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="UrobilinogenComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Casts" className="block text-sm font-medium text-gray-700">
                Casts
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CastsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="CastsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CastsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CastsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CastsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CastsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CastsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bile Salts" className="block text-sm font-medium text-gray-700">
                Bile Salts
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile SaltsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile SaltsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile SaltsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile SaltsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile SaltsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile SaltsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bile SaltsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Bile Pigments" className="block text-sm font-medium text-gray-700">
                Bile Pigments
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile PigmentsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile PigmentsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile PigmentsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile PigmentsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Bile PigmentsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Bile PigmentsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Bile PigmentsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="WBC / Pus cells" className="block text-sm font-medium text-gray-700">
                WBC / Pus cells
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="WBC / Pus cellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="WBC / Pus cellsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="WBC / Pus cellsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="WBC / Pus cellsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="WBC / Pus cellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="WBC / Pus cellsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="WBC / Pus cellsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Red Blood Cells" className="block text-sm font-medium text-gray-700">
                Red Blood Cells
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Red Blood CellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="Red Blood CellsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Red Blood CellsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Red Blood CellsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Red Blood CellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Red Blood CellsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Red Blood CellsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Epithelial cells" className="block text-sm font-medium text-gray-700">
                Epithelial cells
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id=" Epithelial cellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="Epithelial cellsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Epithelial cellsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Epithelial cellsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Epithelial cellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Epithelial cellsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Epithelial cellsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption === "SEROLOGY"  && (
        <div>
          
          <h3 className="text-lg font-medium">SEROLOGY</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Screening For HIV I & II" className="block text-sm font-medium text-gray-700">
                Screening For HIV I & II
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Screening For HIV I & II"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Screening For HIV I & IIUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Screening For HIV I & IIUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Screening For HIV I & IIReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Screening For HIV I & IIReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Screening For HIV I & IIComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Screening For HIV I & IIComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Occult Blood" className="block text-sm font-medium text-gray-700">
                Occult Blood
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult Blood"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult BloodUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult BloodReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Occult BloodComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Cyst" className="block text-sm font-medium text-gray-700">
                Cyst
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Cyst"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CystUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CystReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CystComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Mucus" className="block text-sm font-medium text-gray-700">
                Mucus
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="MucusComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Pus Cells" className="block text-sm font-medium text-gray-700">
                Pus Cells
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus Cells"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus CellsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus CellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Pus CellsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Ova" className="block text-sm font-medium text-gray-700">
                Ova
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Ova"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OvaUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OvaReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="OvaComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="RBCs" className="block text-sm font-medium text-gray-700">
                RBCs
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="RBCsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Others" className="block text-sm font-medium text-gray-700">
                Others
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Others"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OthersUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OthersReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="OthersComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
       {selectedOption === "MOTION"  && (
        <div>
          
          <h3 className="text-lg font-medium">MOTION</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Colour (Motion)" className="block text-sm font-medium text-gray-700">
                Colour (Motion)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Colour (Motion)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Colour (Motion)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Colour (Motion)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Colour (Motion)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Colour (Motion)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Colour (Motion)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Colour (Motion)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Appearance (Motion)" className="block text-sm font-medium text-gray-700">
                Appearance (Motion)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Appearance (Motion)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Appearance (Motion)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Appearance (Motion)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Appearance (Motion)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Appearance (Motion)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Appearance (Motion)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Appearance (Motion)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Occult Blood" className="block text-sm font-medium text-gray-700">
                Occult Blood
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult Blood"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult BloodUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Occult BloodReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Occult BloodComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Occult BloodComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Cyst" className="block text-sm font-medium text-gray-700">
                Cyst
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Cyst"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CystUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CystReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CystComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CystComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Mucus" className="block text-sm font-medium text-gray-700">
                Mucus
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MucusReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MucusComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="MucusComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Pus Cells" className="block text-sm font-medium text-gray-700">
                Pus Cells
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus Cells"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus CellsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Pus CellsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Pus CellsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Pus CellsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Ova" className="block text-sm font-medium text-gray-700">
                Ova
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Ova"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OvaUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OvaReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OvaComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="OvaComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="RBCs" className="block text-sm font-medium text-gray-700">
                RBCs
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="RBCsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="RBCsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="RBCsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Others" className="block text-sm font-medium text-gray-700">
                Others
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Others"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OthersUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="OthersReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="OthersComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="OthersComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
       {selectedOption === "ROUTINE CULTURE & SENSITIVITY TEST" && (
        <div>
          
          <h3 className="text-lg font-medium">ROUTINE CULTURE & SENSITIVITY TEST</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Urine" className="block text-sm font-medium text-gray-700">
                Urine
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Urine"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UrineUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UrineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UrineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="UrineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="UrineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="UrineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Motion" className="block text-sm font-medium text-gray-700">
                Motion
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Motion"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MotionUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MotionUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MotionReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MotionReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MotionComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="MotionComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Sputum" className="block text-sm font-medium text-gray-700">
                Sputum
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Sputum"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SputumUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SputumUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SputumReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="SputumReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="SputumComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="SputumComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label htmlFor="Blood" className="block text-sm font-medium text-gray-700">
                Blood
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Blood"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BloodUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BloodUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BloodReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="BloodReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="BloodComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="BloodComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
          </div>
        </div>
      )}
       {selectedOption === "Men's Pack" && (
        <div>
          
          <h3 className="text-lg font-medium">Men's Pack</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="PSA (Prostate specific Antigen)" className="block text-sm font-medium text-gray-700">
                PSA (Prostate specific Antigen)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PSA (Prostate specific Antigen)"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PSA (Prostate specific Antigen)Unit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PSA (Prostate specific Antigen)Unit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PSA (Prostate specific Antigen)ReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PSA (Prostate specific Antigen)ReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PSA (Prostate specific Antigen)Comments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PSA (Prostate specific Antigen)Comments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "Women's Pack" && (
        <div>
          
          <h3 className="text-lg font-medium">Women's Pack</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Mammogram" className="block text-sm font-medium text-gray-700">
                Mammogram
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MammogramUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MammogramUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MammogramReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MammogramReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MammogramComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="MammogramComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="PAP Smear" className="block text-sm font-medium text-gray-700">
                PAP Smear
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="PAP SmearUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PAP SmearUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PAP SmearReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PAP SmearReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PAP SmearComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PAP SmearComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "Occupational Profile" && (
        <div>
          
          <h3 className="text-lg font-medium">Occupational Profile</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Audiometry" className="block text-sm font-medium text-gray-700">
                Audiometry
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="AudiometryUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AudiometryUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AudiometryReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="AudiometryReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="AudiometryComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="AudiometryComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="PFT" className="block text-sm font-medium text-gray-700">
                PFT
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="PFTUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PFTUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PFTReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PFTReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PFTComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PFTComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "Others TEST" && (
        <div>
          
          <h3 className="text-lg font-medium">Others TEST</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Pathology" className="block text-sm font-medium text-gray-700">
                Pathology
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="PathologyUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PathologyUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PathologyReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="PathologyReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="PathologyComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="PathologyComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>   
          </div>
        </div>
      )}
       {selectedOption === "OPHTHALMIC REPORT" && (
        <div>
          
          <h3 className="text-lg font-medium">OPHTHALMIC REPORT</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="Vision" className="block text-sm font-medium text-gray-700">
                Vision
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="VisionUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="VisionUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="VisionReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="VisionReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="VisionComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="VisionComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="Color Vision" className="block text-sm font-medium text-gray-700">
                Color Vision
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="Color VisionUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Color VisionUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Color VisionReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="Color VisionReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="Color VisionComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="Color VisionComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "X-RAY" && (
        <div>
          
          <h3 className="text-lg font-medium">X-RAY</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="X-RAY" className="block text-sm font-medium text-gray-700">
              X-RAY Chest
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAYUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAYUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAYReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAYReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAYComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="X-RAYComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="X-RAY KUB" className="block text-sm font-medium text-gray-700">
                X-RAY KUB
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY KUBUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY KUBUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY KUBReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY KUBReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY KUBComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="X-RAY KUBComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="X-RAY Spine" className="block text-sm font-medium text-gray-700">
                X-RAY Spine
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY SpineUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY SpineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY SpineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY SpineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY SpineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="X-RAY SpineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="X-RAY Pelvis" className="block text-sm font-medium text-gray-700">
                X-RAY Pelvis
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY PelvisUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY PelvisUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY PelvisReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY PelvisReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY PelvisComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="X-RAY PelvisComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="X-RAY Abdomen" className="block text-sm font-medium text-gray-700">
                X-RAY Abdomen
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY AbdomenUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY AbdomenUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY AbdomenReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="X-RAY AbdomenReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="X-RAY AbdomenComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="X-RAY AbdomenComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "USG" && (
        <div>
          
          <h3 className="text-lg font-medium">USG</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="USG ABDOMEN" className="block text-sm font-medium text-gray-700">
                USG ABDOMEN
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG ABDOMENUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG ABDOMENUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG ABDOMENReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG ABDOMENReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG ABDOMENComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="USG ABDOMENComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="USG KUB" className="block text-sm font-medium text-gray-700">
                USG KUB
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG KUBUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG KUBUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG KUBReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG KUBReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG KUBComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="USG KUBComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="USG Pelvis" className="block text-sm font-medium text-gray-700">
                USG Pelvis
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG PelvisUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG PelvisUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG PelvisReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG PelvisReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG PelvisComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="USG PelvisComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="USG Neck" className="block text-sm font-medium text-gray-700">
                USG Neck
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG NeckUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG NeckUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG NeckReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="USG NeckReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="USG NeckComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="USG NeckComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "CT" && (
        <div>
          
          <h3 className="text-lg font-medium">CT</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label htmlFor="CT Brain" className="block text-sm font-medium text-gray-700">
                CT Brain
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT BrainUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT BrainUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT BrainReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT BrainReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT BrainComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CT BrainComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="CT Lungs" className="block text-sm font-medium text-gray-700">
                CT Lungs
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT LungsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT LungsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT LungsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT LungsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT LungsComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CT LungsComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="CT Abdomen" className="block text-sm font-medium text-gray-700">
                CT Abdomen
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT AbdomenUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT AbdomenUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT AbdomenReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT AbdomenReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT AbdomenComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CT AbdomenComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="CT Spine" className="block text-sm font-medium text-gray-700">
                CT Spine
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT SpineUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT SpineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT SpineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT SpineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT SpineComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CT SpineComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
            <div className="col-span-1">
              <label htmlFor="CT Pelvis" className="block text-sm font-medium text-gray-700">
                CT Pelvis
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT PelvisUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT PelvisUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT PelvisReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="CT PelvisReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="CT PelvisComments" className="block text-sm font-medium text-gray-700">
                Comments
              </label>
              <div className="mt-1">
                <textarea
                  id="CT PelvisComments"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>  
          </div>
        </div>
      )}
       {selectedOption === "MRI" && (
        <div>
          
          <h3 className="text-lg font-medium">MRI</h3>
          {/* Add specific input fields for this option */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="MRI Brain" className="block text-sm font-medium text-gray-700">
                MRI Brain
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI BrainUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI BrainUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI BrainReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI BrainReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
  
            <div className="col-span-1">
              <label htmlFor="MRI Lungs" className="block text-sm font-medium text-gray-700">
                MRI Lungs
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI LungsUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI LungsUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI LungsReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI LungsReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI Abdomen" className="block text-sm font-medium text-gray-700">
                MRI Abdomen
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI AbdomenUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI AbdomenUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI AbdomenReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI AbdomenReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

         
            <div className="col-span-1">
              <label htmlFor="MRI Spine" className="block text-sm font-medium text-gray-700">
                MRI Spine
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI SpineUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI SpineUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI SpineReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI SpineReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

          
            <div className="col-span-1">
              <label htmlFor="MRI Pelvis" className="block text-sm font-medium text-gray-700">
                MRI Pelvis
              </label>
              <select
                  id="investigations"
                  name="investigations"
                  className="py-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >  
                <option value="1">Normal</option>
                <option value="2">Abnormal</option>
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI PelvisUnit" className="block text-sm font-medium text-gray-700">
              Unit (in mg/dL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI PelvisUnit"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="MRI PelvisReferenceRange" className="block text-sm font-medium text-gray-700">
                Reference Range
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="MRI PelvisReferenceRange"
                  className="py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            
          </div>
        </div>
      )}

      {/* Add similar conditional blocks for other options */}
    </div>
  );
}

export default InvestigationForm;
